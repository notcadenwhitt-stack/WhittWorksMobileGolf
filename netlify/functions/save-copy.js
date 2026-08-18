/* Commit edited wording to content/copy.json in the repo.
 *
 * The deploy that GitHub triggers is what puts the words on the live site;
 * this function only ever writes that one file.
 *
 * What it will not do, by construction:
 *   - write any other path (the path is a constant here, never from input)
 *   - add a key that does not already exist in the committed copy.json
 *   - store anything but a plain string, length-capped
 * So the worst a stolen token buys is reworded copy, not code execution:
 * build.js escapes every value on the way into the HTML.
 *
 * Env: EDIT_SECRET, GITHUB_TOKEN, GITHUB_REPO ("owner/name"), GITHUB_BRANCH
 */
const crypto = require("crypto");

const FILE = "content/copy.json"; /* constant on purpose — never from the request */
const MAX_VALUE = 2000;
const MAX_CHANGES = 200;

function validToken(token, secret) {
  if (typeof token !== "string") return false;
  const [expiry, sig] = token.split(".");
  if (!expiry || !sig) return false;
  if (!/^\d+$/.test(expiry) || Number(expiry) < Date.now()) return false;
  const want = crypto.createHmac("sha256", secret).update(expiry).digest("hex");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(want, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

exports.handler = async (event) => {
  const json = (code, body) => ({
    statusCode: code,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: JSON.stringify(body),
  });

  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { EDIT_SECRET, GITHUB_TOKEN, GITHUB_REPO } = process.env;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!EDIT_SECRET || !GITHUB_TOKEN || !GITHUB_REPO) {
    return json(500, { error: "Editing is not configured on this deploy." });
  }

  const auth = event.headers.authorization || event.headers.Authorization || "";
  if (!validToken(auth.replace(/^Bearer\s+/i, ""), EDIT_SECRET)) {
    return json(401, { error: "Session expired" });
  }

  let changes;
  try {
    changes = JSON.parse(event.body || "{}").changes;
  } catch (e) {
    return json(400, { error: "Bad request" });
  }
  if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
    return json(400, { error: "No changes sent" });
  }

  const keys = Object.keys(changes);
  if (!keys.length) return json(400, { error: "No changes sent" });
  if (keys.length > MAX_CHANGES) return json(400, { error: "Too many changes at once" });

  for (const k of keys) {
    const v = changes[k];
    if (typeof v !== "string") return json(400, { error: `Not text: ${k}` });
    if (!v.trim()) return json(400, { error: `Empty text: ${k}` });
    if (v.length > MAX_VALUE) return json(400, { error: `Too long: ${k}` });
  }

  const api = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "sdg-copy-editor",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    const read = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers: ghHeaders });
    if (!read.ok) {
      return json(502, { error: `Could not read ${FILE} (${read.status})` });
    }
    const meta = await read.json();
    const current = JSON.parse(Buffer.from(meta.content, "base64").toString("utf8"));

    /* The committed file is the allowlist. A key the site does not already
       use cannot be introduced here. */
    const unknown = keys.filter((k) => !(k in current));
    if (unknown.length) {
      return json(400, { error: `Unknown item: ${unknown[0]}` });
    }

    const merged = { ...current };
    let touched = 0;
    for (const k of keys) {
      if (merged[k] !== changes[k]) { merged[k] = changes[k]; touched++; }
    }
    if (!touched) return json(200, { ok: true, changed: 0, note: "Nothing differed" });

    const sorted = {};
    for (const k of Object.keys(merged).sort()) sorted[k] = merged[k];
    const body = JSON.stringify(sorted, null, 2) + "\n";

    const write = await fetch(api, {
      method: "PUT",
      headers: { ...ghHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Copy edit: ${touched} item${touched === 1 ? "" : "s"} via site editor`,
        content: Buffer.from(body, "utf8").toString("base64"),
        sha: meta.sha, /* rejects the write if someone else committed meanwhile */
        branch,
      }),
    });

    if (write.status === 409) {
      return json(409, { error: "Someone else saved first. Reload and redo your edits." });
    }
    if (!write.ok) {
      const detail = await write.text();
      console.error("github write failed", write.status, detail.slice(0, 300));
      return json(502, { error: `Could not save (${write.status})` });
    }

    const result = await write.json();
    return json(200, { ok: true, changed: touched, commit: result.commit && result.commit.sha });
  } catch (err) {
    console.error("save-copy failed", err);
    return json(500, { error: "Save failed. Try again in a moment." });
  }
};
