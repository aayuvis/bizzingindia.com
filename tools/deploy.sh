#!/usr/bin/env bash
# Deploy app/ to the gh-pages branch.
#
# gh-pages serves the contents of app/ from the repo root, so this lays that tree down at the
# root, drops a .nojekyll (GitHub Pages otherwise hides files beginning with an underscore),
# and commits.
#
# TWO THINGS THIS IS CAREFUL ABOUT, both learned by getting them wrong:
#
#   * It deploys HEAD, never the working tree. What is live is therefore always reachable by
#     a sha, and half-written work can never ship by accident. Uncommitted changes are
#     reported and skipped rather than blocking the deploy.
#
#   * It never checks out gh-pages in your working directory. Deploys happen while background
#     jobs are writing files, and `git checkout` refuses to switch branches when that is
#     happening — which used to mean a dirty tools/ directory could block shipping the app.
#     A throwaway worktree sidesteps the whole problem: your checkout is untouched, and you
#     stay on your branch the entire time.
#
# Run tools/stamp.sh first. This script deliberately does not stamp, so that an un-stamped
# deploy is a decision rather than an accident.
set -euo pipefail

cd "$(dirname "$0")/.."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
MSG=${1:-"Deploy $(git log -1 --format=%s)"}

DIRTY=$(git status --porcelain)
if [ -n "$DIRTY" ]; then
  echo "note: uncommitted changes are NOT being deployed —"
  echo "$DIRTY" | sed 's/^/      /'
fi

WT=$(mktemp -d)
cleanup() { git worktree remove --force "$WT" >/dev/null 2>&1 || rm -rf "$WT"; }
trap cleanup EXIT

git worktree add -q --no-checkout "$WT" gh-pages
git -C "$WT" checkout -q gh-pages

# Clear everything git tracks on the branch, then lay the new tree down, so files deleted
# from app/ actually disappear from the served branch instead of lingering as orphans.
git -C "$WT" ls-files -z | xargs -0 -r rm -f
git archive HEAD app | tar -x -C "$WT" --strip-components=1
git show HEAD:README.md > "$WT"/README.md 2>/dev/null || true
touch "$WT"/.nojekyll

# THE CUSTOM DOMAIN. This script clears every tracked file on gh-pages before laying the
# new tree down, which is right for orphaned assets and wrong for one file: GitHub Pages
# keeps the custom domain in a CNAME file IN THE SERVED BRANCH, and wiping it can unset
# the domain — the site then answers on github.io and bizzingindia.com stops resolving to
# it, which looks exactly like "the deploy did nothing". Write it back every time.
echo "bizzingindia.com" > "$WT"/CNAME

git -C "$WT" add -A
if git -C "$WT" diff --cached --quiet; then
  echo "gh-pages already matches app/ at HEAD — nothing to deploy"
else
  git -C "$WT" commit -q -m "$MSG"
  for i in 1 2 3 4; do
    git -C "$WT" push -u origin gh-pages && break || sleep $((2 ** i))
  done
  echo "deployed $(git rev-parse --short HEAD) to gh-pages"
fi

echo "still on $BRANCH, working tree untouched"
