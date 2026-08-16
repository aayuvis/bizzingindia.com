#!/usr/bin/env bash
# Deploy app/ to the gh-pages branch.
#
# gh-pages serves the contents of app/ from the repo root, so this copies the
# tree across, drops a .nojekyll (GitHub Pages otherwise hides files that begin
# with an underscore), and commits. Run tools/stamp.sh first — this script does
# not stamp, so that an un-stamped deploy is a deliberate act rather than an
# accident.
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT=$(pwd)
BRANCH=$(git rev-parse --abbrev-ref HEAD)
MSG=${1:-"Deploy $(git log -1 --format=%s)"}

if [ -n "$(git status --porcelain)" ]; then
  echo "working tree is dirty — commit on $BRANCH first" >&2
  exit 1
fi

STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT
cp -R app/. "$STAGE"/
cp README.md "$STAGE"/ 2>/dev/null || true
touch "$STAGE"/.nojekyll

git checkout -q gh-pages
# Clear everything git tracks, then lay the new tree down, so deletions in app/
# actually propagate instead of leaving orphans on the served branch.
git ls-files -z | xargs -0 rm -f
cp -R "$STAGE"/. "$ROOT"/
git add -A

if git diff --cached --quiet; then
  echo "gh-pages already matches app/ — nothing to deploy"
else
  git commit -q -m "$MSG"
  for i in 1 2 3 4; do
    git push -u origin gh-pages && break || sleep $((2 ** i))
  done
fi

git checkout -q "$BRANCH"
echo "deployed to gh-pages, back on $BRANCH"
