#!/bin/sh
# Go-live script for Southern Drive Golf Co.
# The brand and domain are already applied site-wide (2026-08-13).
# Running this at launch removes the pre-launch noindex guard from every
# page except 404.html. Run from the repo root.

set -eu

find site -type f -name '*.html' ! -name '404.html' | while read -r f; do
  sed -i '' '/<meta name="robots" content="noindex">/d' "$f"
done

echo "Removed the pre-launch noindex tag from every page except 404.html."
echo "Go-live checklist beyond this script:"
echo "  1. Buy southerndrivegolf.com and point DNS per docs/HOSTING-HEADERS.md (DNS first, then host)."
echo "  2. Create the Formspree form and set formEndpoint in site/js/config.js."
echo "  3. Set posthogKey in site/js/config.js."
echo "  4. Apply the security headers block for the chosen host (docs/HOSTING-HEADERS.md)."
echo "  5. Uncomment the Sitemap line in site/robots.txt."
