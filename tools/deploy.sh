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
#
# THIS SCRIPT DOES NOT MAKE THE SITE LIVE, and for a long time nobody noticed. Pushing
# gh-pages is only half of it: GitHub has to be told to *serve* that branch, and the
# repository setting was simply never switched on (the API reported has_pages: false).
# Every deploy landed perfectly, reported a sha, and the address 404'd — which from here
# is indistinguishable from a deploy that worked. .github/workflows/pages.yml is the
# other half; it points Pages at gh-pages and then fetches the live URL to prove it.
# If the address ever 404s again after a clean deploy, check the setting before the tree.
set -euo pipefail

cd "$(dirname "$0")/.."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
MSG=${1:-"Deploy $(git log -1 --format=%s)"}

DIRTY=$(git status --porcelain)
if [ -n "$DIRTY" ]; then
  echo "note: uncommitted changes are NOT being deployed —"
  echo "$DIRTY" | sed 's/^/      /'
fi

# PUBLISH BY PLUMBING, not by copying files.
#
# This used to check gh-pages out into a throwaway worktree, delete every tracked file,
# extract `git archive HEAD app` over the top, and commit whatever changed. That worked
# until app/voice grew to 700MB of narration, at which point the archive-through-tar step
# quietly did nothing and the script reported "gh-pages already matches app/ at HEAD —
# nothing to deploy" while the live site sat four hours behind. A deploy that no-ops and
# says so cheerfully is worse than one that fails.
#
# The tree we want to publish is ALREADY a git object: HEAD:app. So build the commit from
# it directly — read that tree into a scratch index, add .nojekyll and the README, write
# the tree, commit it onto gh-pages, push. No files are copied, no worktree is checked
# out, nothing can half-happen, and it takes the same time whether the corpus is 1MB or
# 1GB because every blob is already in the object store.
TREE_SRC=$(git rev-parse HEAD:app)
SCRATCH_INDEX=$(mktemp -u)
# The trap must not read GIT_INDEX_FILE: the script unsets it below, and `set -u` then
# turns the cleanup itself into an error on exit. Keep the path in its own variable.
trap 'rm -f "$SCRATCH_INDEX"' EXIT
export GIT_INDEX_FILE="$SCRATCH_INDEX"
git read-tree "$TREE_SRC"
EMPTY=$(printf '' | git hash-object -w --stdin)
git update-index --add --cacheinfo 100644,"$EMPTY",.nojekyll
if README_BLOB=$(git rev-parse HEAD:README.md 2>/dev/null); then
  git update-index --add --cacheinfo 100644,"$README_BLOB",README.md
fi

# CARRY THE CUSTOM DOMAIN FORWARD, if there is one.
#
# Setting a custom domain in Settings -> Pages writes a CNAME file into the gh-pages branch,
# and an ABSENT CNAME is how GitHub is told the custom domain has been removed. This script
# builds the published tree from HEAD:app plus .nojekyll and nothing else, so without this
# block the very next deploy would quietly drop that file and the site would fall back to
# the github.io address -- hours after someone believed they had moved it, with a deploy log
# that says nothing but success. Exactly the failure this repo has already been bitten by
# once, in the other direction.
#
# A CNAME committed at the repo root wins, so the domain can live in git where it is
# reviewable and a deploy from any checkout carries it. Otherwise whatever is already live
# is preserved untouched.
if CNAME_BLOB=$(git rev-parse HEAD:CNAME 2>/dev/null); then
  git update-index --add --cacheinfo 100644,"$CNAME_BLOB",CNAME
  echo "domain: carrying ./CNAME from the repo root ($(git cat-file -p HEAD:CNAME | tr -d '\n'))"
elif CNAME_BLOB=$(git rev-parse origin/gh-pages:CNAME 2>/dev/null || git rev-parse gh-pages:CNAME 2>/dev/null); then
  git update-index --add --cacheinfo 100644,"$CNAME_BLOB",CNAME
  echo "domain: preserving the CNAME already live on gh-pages"
else
  echo "domain: none set -- serving from the github.io address"
fi
TREE=$(git write-tree)
unset GIT_INDEX_FILE

# NO CNAME. Deliberately: the site is served from GitHub Pages' own github.io address
# while it is in development, and writing a CNAME here would point Pages at a domain
# that is not in use yet — which takes the site OFF the address that does work.

PARENT=$(git rev-parse origin/gh-pages 2>/dev/null || git rev-parse gh-pages 2>/dev/null || true)
if [ -n "$PARENT" ] && [ "$(git rev-parse "$PARENT^{tree}")" = "$TREE" ]; then
  echo "gh-pages already matches app/ at HEAD — nothing to deploy"
else
  if [ -n "$PARENT" ]; then
    COMMIT=$(git commit-tree "$TREE" -p "$PARENT" -m "$MSG")
  else
    COMMIT=$(git commit-tree "$TREE" -m "$MSG")
  fi
  # The first push of a large corpus can disconnect mid-sideband; the objects that did
  # land are kept, so a retry sends only what is missing and succeeds quickly.
  ok=0
  for i in 1 2 3 4 5; do
    if git push origin "$COMMIT":gh-pages; then ok=1; break; fi
    sleep $((2 ** i))
  done
  if [ "$ok" != 1 ]; then
    echo "DEPLOY FAILED: could not push to gh-pages after 5 attempts" >&2
    exit 1
  fi
  echo "deployed $(git rev-parse --short HEAD) to gh-pages as ${COMMIT:0:9}"
fi

echo "still on $BRANCH, working tree untouched"
