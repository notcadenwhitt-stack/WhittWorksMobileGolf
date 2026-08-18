/* Exchange the editing password for a short-lived signed token.
 *
 * The password is checked here and never stored by the browser; only the
 * token it returns is. The token is an HMAC over its own expiry, so it needs
 * no server-side session store and cannot be extended by the holder.
 *
 * Env: EDIT_PASSWORD, EDIT_SECRET
 */
const crypto = require("crypto");

const TTL_MS = 8 * 60 * 60 * 1000; /* one working day */

function sign(expiry, secret) {
  return crypto.createHmac("sha256", secret).update(String(expiry)).digest("hex");
}

/* Compares in constant time, and without leaking the length of the real
   password through an early return. */
function sameSecret(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

exports.handler = async (event) => {
  const json = (code, body) => ({
    statusCode: code,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: JSON.stringify(body),
  });

  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { EDIT_PASSWORD, EDIT_SECRET } = process.env;
  if (!EDIT_PASSWORD || !EDIT_SECRET) {
    return json(500, { error: "Editing is not configured on this deploy." });
  }

  let password;
  try {
    password = JSON.parse(event.body || "{}").password;
  } catch (e) {
    return json(400, { error: "Bad request" });
  }
  if (typeof password !== "string" || !password) {
    return json(400, { error: "Password required" });
  }

  if (!sameSecret(password, EDIT_PASSWORD)) {
    /* Blunt the speed of an online guessing run. Netlify bills by duration,
       so keep it short enough to stay cheap and long enough to matter. */
    await new Promise((r) => setTimeout(r, 700));
    return json(401, { error: "That password is not right." });
  }

  const expiry = Date.now() + TTL_MS;
  return json(200, { token: `${expiry}.${sign(expiry, EDIT_SECRET)}` });
};
