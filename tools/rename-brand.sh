#!/bin/sh
# Swap the placeholder brand and domain across the whole site.
# Usage: tools/rename-brand.sh "Real Brand Name" "realdomain.com"
# Run from the repo root. Safe to run more than once.

set -eu

NEW_NAME="${1:?usage: rename-brand.sh \"New Name\" \"domain.com\"}"
NEW_DOMAIN="${2:?usage: rename-brand.sh \"New Name\" \"domain.com\"}"

OLD_NAME="Blue Fairway Golf"
OLD_DOMAIN="DOMAIN-TBD"

find site -type f \( -name '*.html' -o -name '*.js' -o -name '*.xml' -o -name '*.txt' \) | while read -r f; do
  sed -i '' "s|$OLD_NAME|$NEW_NAME|g; s|$OLD_DOMAIN|$NEW_DOMAIN|g" "$f"
done

# Going live: drop the pre-launch noindex guard everywhere except the 404 page
find site -type f -name '*.html' ! -name '404.html' | while read -r f; do
  sed -i '' '/<meta name="robots" content="noindex">/d' "$f"
done

echo "Renamed '$OLD_NAME' -> '$NEW_NAME' and '$OLD_DOMAIN' -> '$NEW_DOMAIN'."
echo "Removed the pre-launch noindex tag from every page except 404.html."
echo "Still manual: og-image, favicon lettering if any, and the legal entity line if it changes."
