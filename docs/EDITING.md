# Editing the site's wording

The owner edits text on the real page. Sign in, click a headline, type, press
Save. The save commits `content/copy.json` to this repo, Netlify rebuilds, and
the new words are live in about a minute.

---

## For the owner

1. Open any page with `?edit` on the end, e.g.
   `https://southerndrivegolf.com/events.html?edit`
2. Enter the editing password.
3. Every editable piece of text picks up a dashed outline. Click one and type.
4. **Save** commits the change. **Preview** turns editing off so links work
   again, for checking a page normally.
5. The live site updates about a minute later. Refresh to confirm.

Worth knowing:

- **Amber outline means shared text.** The header, footer and menu appear on
  every page. Editing one of those changes all of them, and the toolbar says so
  while you have it selected.
- **Escape undoes** the field you are in, back to its last saved wording.
- **Enter finishes** a field rather than adding a line break. One field is one
  line of copy.
- **Links do not navigate while editing** — clicking one selects its text
  instead. Use Preview, or the menu button, to move between pages.
- **The legal pages are not editable.** Privacy, Terms, Cookie Policy and
  Accessibility are deliberately locked. They are pending attorney review, and
  rewording a deposit clause or a privacy disclosure by hand creates liability.
  Those changes go through Caden.
- **Signing in lasts 8 hours**, then you are asked again.

---

## For whoever maintains it

### How it fits together

```
site/                 hand-written HTML; the source of truth for WHICH
                      strings are editable (elements carrying data-copy)
content/copy.json     the source of truth for WHAT they say
build.js              site/ + copy.json -> dist/   (Netlify runs this)
dist/                 build output, gitignored, never edited by hand
netlify/functions/    edit-auth.js, save-copy.js
site/js/edit.js       the in-place editor, fetched only when ?edit is present
```

Copy is baked into the HTML at deploy time, never fetched by the browser.
There is no hydration flash and search engines see the real words.

### Netlify setup

Build settings (also in `netlify.toml`, so they should populate themselves):

| Setting | Value |
|---|---|
| Build command | `node build.js` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |

Environment variables, set under **Site configuration → Environment variables**.
Type them into Netlify directly; do not paste secrets into a chat window or a
shell command.

| Variable | What it is |
|---|---|
| `EDIT_PASSWORD` | The password you give the owner. Make it long. |
| `EDIT_SECRET` | Signing key for session tokens. Generate with `openssl rand -hex 32`. |
| `GITHUB_TOKEN` | Fine-grained PAT, this repo only, **Contents: Read and write**. Nothing else. |
| `GITHUB_REPO` | `owner/name`, e.g. `notcadenwhitt-stack/WhittWorksMobileGolf` |
| `GITHUB_BRANCH` | `main` (optional, defaults to `main`) |

Without these the editor returns "Editing is not configured on this deploy"
rather than failing silently.

### Adding newly editable text

1. Put `data-copy="page.something-descriptive"` on the element in `site/`.
   The element must contain text and no child elements — if text sits beside
   markup, wrap the text in a `<span>` first.
2. Run `python3 tools/extract-copy.py`. It adds the new key with the current
   wording and leaves existing values alone.
3. Commit both files. `build.js` fails the deploy if any key in the HTML has no
   entry in `copy.json`, so a missed step breaks the build instead of the page.

Use the `site.` prefix for anything in the header, footer or consent banner so
one edit covers every page.

### Security

The blast radius of a stolen password or token is **reworded copy, and nothing
else**. That is by construction:

- `save-copy.js` writes one path, `content/copy.json`, and that path is a
  constant in the source — never taken from the request.
- A key that does not already exist in the committed file is rejected, so no
  new keys can be introduced.
- Values must be strings, non-empty, at most 2,000 characters, at most 200 per
  save.
- `build.js` HTML-escapes every value, so `<img onerror=...>` renders as those
  literal characters on the page rather than becoming markup. This is tested.
- The GitHub token lives only in Netlify's environment and never reaches the
  browser. The password is exchanged once for an 8-hour signed token; only the
  token is stored, in `sessionStorage`, which clears when the tab closes.
- Wrong-password responses are delayed and compared in constant time.
- The write sends the file's `sha`, so two people saving at once produces a
  clear "someone else saved first" rather than a silent overwrite.

What is **not** covered: there is no rate limit beyond that delay, and no audit
trail past the Git history (every save is a commit, so `git log content/copy.json`
is the log). If the password leaks, change `EDIT_PASSWORD` and `EDIT_SECRET` in
Netlify; changing the secret invalidates every outstanding session immediately.

### If something looks wrong

- **"Could not reach the server"** — you are on a local preview, not the
  deployed site. The functions only exist on Netlify.
- **Edits saved but the site looks unchanged** — check the Netlify deploy log.
  The commit lands regardless; the deploy is a separate step.
- **Build fails with "keys in HTML with no entry in copy.json"** — someone added
  a `data-copy` attribute without running `tools/extract-copy.py`.
