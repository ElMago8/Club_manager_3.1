// Generates dist/start.js — the HTTP server entry that lives inside dist/
// so Hostinger finds it whether it interprets the entry path relative to
// the project root or relative to the output directory.
import { writeFileSync } from "node:fs";

const code = `import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 3000);
const clientDir = resolve(__dirname, "client");

console.log("CCM SSR starting. PORT:", port, "DIR:", __dirname);

let ssrHandler = null;
let startupError = null;

try {
  console.log("Loading SSR handler...");
  const mod = await import("./server/server.js");
  ssrHandler = mod.default;
  console.log("SSR handler OK. fetch:", typeof ssrHandler?.fetch);
} catch (err) {
  console.error("SSR LOAD ERROR:", err.message, err.stack);
  startupError = err;
}

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
  const urlPath = new URL(req.url, \`http://localhost:\${port}\`).pathname;

  if (startupError) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(\`CCM STARTUP ERROR:\\n\\n\${startupError.message}\\n\\n\${startupError.stack}\`);
    return;
  }

  if (urlPath !== "/" && tryStaticFile(urlPath, res)) return;

  const url = new URL(req.url, \`http://localhost:\${port}\`);
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

httpServer.listen(port, "0.0.0.0", () => {
  console.log(\`CCM SSR Server on http://0.0.0.0:\${port}\`);
});
`;

writeFileSync("dist/start.js", code, "utf-8");
console.log("postbuild: dist/start.js generated OK");
