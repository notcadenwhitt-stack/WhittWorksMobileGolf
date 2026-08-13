# Security headers — apply at go-live

Hosting is deliberately undecided (no Netlify, per Caden). Whichever host wins, apply these headers at the hosting layer on day one. All JS/CSS is external, so `script-src 'self'` works with zero hash maintenance.

## The CSP this site needs

PostHog (US Cloud) requires two origins beyond `'self'`. The quote-form processor adds its own origin to `connect-src`/`form-action` once chosen (example shows Formspree).

```
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data:; style-src 'self'; script-src 'self' https://us-assets.i.posthog.com; connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com https://formspree.io; form-action 'self' https://formspree.io; font-src 'self'; upgrade-insecure-requests
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-site
```

Verify the PostHog origins against js/analytics.js at go-live (the loader fetches `<api_host>/static/array.js`; if PostHog changes asset hosts, the console will show the CSP block).

## Host notes

- **GitHub Pages cannot set response headers at all.** If this repo deploys via Pages, put a free Cloudflare proxy in front and inject the headers at the edge, or pick another host. Decide before pointing a domain.
- **Cloudflare Pages / Vercel / Firebase** all support the block above natively (Vercel: `vercel.json`; Firebase: `firebase.json`; Cloudflare Pages: `_headers` file).
- Do NOT add `X-XSS-Protection`, `Expect-CT`, or `Public-Key-Pins` — obsolete or harmful.

## DNS + certificate order of operations

1. Point DNS at the host FIRST, then add the domain in the host's dashboard (a cert requested before DNS is right fails and does not auto-retry).
2. `www` CNAMEs to the site's own hostname, never to an apex load balancer.
3. Check every hostname: `curl -sI https://<host> | head -1` for both apex and www.
