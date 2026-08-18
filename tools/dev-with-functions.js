/* Local harness: serves dist/ and runs the two real Netlify function
 * handlers, with the GitHub call redirected to content/copy.json on disk.
 * Every other path — auth, token signing, key allowlisting, length caps — is
 * the production code, so this exercises the real thing.
 *
 *   node build.js && node tools/dev-with-functions.js
 *   open http://localhost:4180/?edit      password: local-dev-only
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const COPY = path.join(ROOT, "content", "copy.json");

/* Local only. The real values live in Netlify's environment; these exist so
   the editor can be driven end to end without deploying, and the GitHub write
   below is redirected to the working copy instead of the repo. */
process.env.EDIT_PASSWORD = process.env.EDIT_PASSWORD || "local-dev-only";
process.env.EDIT_SECRET = process.env.EDIT_SECRET || "local-dev-only";
process.env.GITHUB_TOKEN = "unused-locally";
process.env.GITHUB_REPO = "local/local";

const auth = require(path.join(ROOT, "netlify/functions/edit-auth.js"));
const save = require(path.join(ROOT, "netlify/functions/save-copy.js"));

// Intercept GitHub calls; keep every validation path in save-copy real.
const realFetch = global.fetch;
global.fetch = async (url, opts = {}) => {
  if (String(url).startsWith("https://api.github.com/")) {
    if ((opts.method || "GET") === "GET") {
      const content = fs.readFileSync(COPY, "utf8");
      return new Response(JSON.stringify({
        sha: "devsha",
        content: Buffer.from(content).toString("base64"),
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    const body = JSON.parse(opts.body);
    fs.writeFileSync(COPY, Buffer.from(body.content, "base64").toString("utf8"));
    return new Response(JSON.stringify({ commit: { sha: "devcommit" } }),
      { status: 200, headers: { "Content-Type": "application/json" } });
  }
  return realFetch(url, opts);
};

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".mp4": "video/mp4", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain",
  ".xml": "application/xml" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const fn = url.pathname.match(/^\/\.netlify\/functions\/(edit-auth|save-copy)$/);
  if (fn) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const handler = fn[1] === "edit-auth" ? auth.handler : save.handler;
    const out = await handler({
      httpMethod: req.method,
      headers: req.headers,
      body: Buffer.concat(chunks).toString("utf8"),
    });
    res.writeHead(out.statusCode, out.headers);
    return res.end(out.body);
  }
  let p = path.join(DIST, url.pathname === "/" ? "index.html" : url.pathname);
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/html" });
    return res.end(fs.readFileSync(path.join(DIST, "404.html")));
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
  res.end(fs.readFileSync(p));
}).listen(4180, () => console.log("dev+functions on http://localhost:4180"));
