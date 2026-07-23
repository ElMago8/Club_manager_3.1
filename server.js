import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 3000);
const clientDir = resolve(__dirname, "dist/client");

console.log("CCM Server starting. PORT:", port);

let ssrHandler = null;
let startupError = null;
let initialized = false;

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".webp": "image/webp",
};

function tryStaticFile(urlPath, res) {
  const safePath = resolve(clientDir, "." + urlPath);
  if (!safePath.startsWith(clientDir)) return false;
  try {
    const stat = statSync(safePath);
    if (!stat.isFile()) return false;
    const mime = MIME[extname(safePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime, "Cache-Control": "public, max-age=31536000" });
    createReadStream(safePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const httpServer = createServer(async (req, res) => {
  const urlPath = new URL(req.url, `http://localhost:${port}`).pathname;

  // Aún inicializando — responder 200 para no romper health checks
  if (!initialized) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<html><head><meta http-equiv='refresh' content='2'/></head><body>Iniciando servidor...</body></html>");
    return;
  }

  // Error al cargar el SSR handler — mostrarlo en el browser para diagnóstico
  if (startupError) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`CCM STARTUP ERROR:\n\n${startupError.message}\n\n${startupError.stack}`);
    return;
  }

  // Servir assets estáticos
  if (urlPath !== "/" && tryStaticFile(urlPath, res)) return;

  // SSR handler
  const url = new URL(req.url, `http://localhost:${port}`);
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) headers[key] = Array.isArray(value) ? value.join(", ") : value;
  }

  let body = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await new Promise((resolve) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  const request = new Request(url.href, {
    method: req.method,
    headers,
    ...(body && body.length > 0 ? { body } : {}),
  });

  try {
    const response = await ssrHandler.fetch(request);
    const responseHeaders = {};
    response.headers.forEach((value, key) => { responseHeaders[key] = value; });
    res.writeHead(response.status, responseHeaders);
    if (response.body) {
      for await (const chunk of response.body) {
        res.write(chunk);
      }
    }
    res.end();
  } catch (err) {
    console.error("SSR error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("SSR Error: " + err.message);
  }
});

// Primero: el servidor escucha en el puerto (Hostinger puede hacer health check)
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`HTTP server bound on http://0.0.0.0:${port}`);

  // Después: cargar el SSR handler en background (no bloquea el puerto)
  import("./dist/server/server.js")
    .then((mod) => {
      ssrHandler = mod.default;
      initialized = true;
      console.log("SSR handler loaded. fetch:", typeof ssrHandler?.fetch);
    })
    .catch((err) => {
      console.error("SSR LOAD ERROR:", err.message);
      console.error(err.stack);
      startupError = err;
      initialized = true;
    });
});
