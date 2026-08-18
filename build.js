#!/usr/bin/env node
/* Build: site/ + content/copy.json -> dist/
 *
 * For every element carrying data-copy, the inner content is replaced with
 * the value from copy.json. Everything else is copied through untouched.
 * The output is plain static HTML — the copy is baked in at deploy time,
 * never fetched by the browser, so there is no hydration flash and search
 * engines see the real words.
 *
 * Values are escaped, so a stray < or & in someone's edit renders as text
 * instead of becoming markup. That is also what keeps the editor endpoint
 * from being an HTML injection route into the site.
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "site");
const OUT = path.join(ROOT, "dist");
const COPY = path.join(ROOT, "content", "copy.json");

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function walk(dir, base = "") {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) out.push(...walk(path.join(dir, entry.name), rel));
    else out.push(rel);
  }
  return out;
}

function inject(html, copy, file, report) {
  // Matches <tag ... data-copy="key" ...>inner</tag> for a non-nesting element.
  const re = /<(\w+)(\b[^>]*\bdata-copy="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g;
  return html.replace(re, (whole, tag, attrs, key, inner) => {
    if (!(key in copy)) {
      report.missing.push(`${file}: ${key}`);
      return whole;
    }
    const value = copy[key];
    if (typeof value !== "string") {
      report.badType.push(`${file}: ${key}`);
      return whole;
    }
    report.used.add(key);
    return `<${tag}${attrs}>${esc(value)}</${tag}>`;
  });
}

function main() {
  const copy = JSON.parse(fs.readFileSync(COPY, "utf8"));
  fs.rmSync(OUT, { recursive: true, force: true });

  const report = { missing: [], badType: [], used: new Set(), pages: 0, files: 0 };

  for (const rel of walk(SRC)) {
    const from = path.join(SRC, rel);
    const to = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    if (rel.endsWith(".html")) {
      fs.writeFileSync(to, inject(fs.readFileSync(from, "utf8"), copy, rel, report));
      report.pages++;
    } else {
      fs.copyFileSync(from, to);
    }
    report.files++;
  }

  const unused = Object.keys(copy).filter((k) => !report.used.has(k));

  console.log(`built ${report.pages} pages, ${report.files} files -> dist/`);
  console.log(`copy keys: ${Object.keys(copy).length} defined, ${report.used.size} placed`);
  if (unused.length) console.log(`  unused in HTML: ${unused.length} -> ${unused.slice(0, 5).join(", ")}`);
  if (report.badType.length) {
    console.error(`FAIL non-string values:\n  ${report.badType.join("\n  ")}`);
    process.exit(1);
  }
  if (report.missing.length) {
    console.error(`FAIL keys in HTML with no entry in copy.json:\n  ${report.missing.join("\n  ")}`);
    process.exit(1);
  }
}

main();
