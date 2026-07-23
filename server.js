import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 3000);
const distDir = resolve(__dirname, "dist");

console.log("CCM SPA Server starting. PORT:", port);

const MIME = {
  ".html": "text/html; charset=utf-8",
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
  const safePath = resolve(distDir, "." + urlPath);
  if (!safePath.startsWith(distDir)) return false;
  try {
    const stat = statSync(safePath);
    if (!stat.isFile()) return false;
    const mime = MIME[extname(safePath)] || "application/octet-stream";
    const isImmutable = urlPath.startsWith("/assets/");
    res.writeHead(200, {
      "Content-Type": mime,
      "Cache-Control": isImmutable ? "public, max-age=31536000, immutable" : "no-cache",
    });
    createReadStream(safePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const httpServer = createServer((req, res) => {
  const urlPath = new URL(req.url, `http://localhost:${port}`).pathname;

  if (tryStaticFile(urlPath, res)) return;

  // SPA fallback — todas las rutas de navegación sirven index.html
  const indexPath = resolve(distDir, "index.html");
  try {
    statSync(indexPath);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
    createReadStream(indexPath).pipe(res);
  } catch {
    res.writeHead(503, { "Content-Type": "text/plain" });
    res.end("App not deployed yet.");
  }
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`CCM SPA Server running on http://0.0.0.0:${port}`);
});
