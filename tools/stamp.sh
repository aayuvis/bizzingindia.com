#!/usr/bin/env bash
# Cache-bust every asset URL in app/index.html.
#
# Bizzing Bee's deploy rule, and it exists because we already got caught by it:
# a deploy went out with a new app.js and app.css behind an unchanged ?v= stamp,
# so browsers kept the old files and a whole tab was missing from the nav.
#
# Run this before EVERY gh-pages deploy. Uses the UTC timestamp so it is always
# newer than whatever a browser is holding.
set -euo pipefail
cd "$(dirname "$0")/.."
STAMP="${1:-$(date -u +%Y%m%d%H%M)}"
sed -i -E "s/\?v=[0-9a-zA-Z.]+/?v=${STAMP}/g" app/index.html
echo "stamped ?v=${STAMP}"
grep -o '?v=[0-9a-zA-Z.]*' app/index.html | sort -u
