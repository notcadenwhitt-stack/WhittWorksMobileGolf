# Southern Drive Golf Co (WhittWorks Mobile Golf)

Mobile golf simulator rentals serving Alabama. Business name: Southern Drive Golf Co (domain southerndrivegolf.com, purchase pending).

- `site/` — static marketing + booking website (no framework, ADA-first)
- `content/copy.json` — the editable wording, one key per string
- `build.js` — combines the two into `dist/`; this is what Netlify runs
- `netlify/functions/` — the endpoints behind the owner's in-place editor
- `tools/` — one-off scripts: copy tagging, key extraction, go-live
- `docs/` — internal business documents: equipment build sheet, pricing, media manifest
- `PLAN.md` — the approved build plan and its assumptions ledger

`dist/` is generated and gitignored. Never edit it by hand.

## Working on it

```
node build.js          # site/ + content/copy.json -> dist/
python3 -m http.server 4173 -d dist
```

The owner edits wording on the live site by adding `?edit` to any URL. See
[docs/EDITING.md](docs/EDITING.md) for how that works, how to set it up on
Netlify, and how to make a new piece of text editable.

Not deployed anywhere yet. See PLAN.md → Parked items.
