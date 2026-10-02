#!/usr/bin/env bash
# THE LIVE SITE IS SOMEBODY'S WORK. Refuse a deploy that would roll it back.
#
# deploy.sh publishes HEAD's app/ — the whole of it — over whatever is on gh-pages. Two
# sessions on two branches share that one gh-pages, and on 2 October that was enough: the
# family shell and the wallet fix went live from claude/amazing-knuth-4aemgz at 18:20 and
# 18:48, and at 22:54 the Sabhyata phone deploy from this branch, which did not contain
# them, put 142 files back a version. The gate was open, the deploy reported a sha, and
# nothing anywhere said that a day's work on another branch had just been taken down.
#
# So every deploy now says what it was built from (a `Deployed-From:` line in the gh-pages
# commit, written by deploy.sh), and before the next one this script reads it back:
#
#   * the live source is in HEAD's history  -> fine, this deploy carries it forward
#   * it is not                             -> REFUSED: merge it first, and say which
#   * it cannot be found even after a fetch -> REFUSED: cannot prove it is carried
#   * the live deploy predates the line     -> allowed, with a note: nothing to check
#
# Replacing a live deploy on purpose (a bad deploy being reverted) is one explicit env var
# naming the exact commit being replaced: DEPLOY_REPLACE=<sha>. Never a general bypass.
#
# Reads origin/gh-pages as it is now; deploy.sh fetches it before calling this.
set -euo pipefail
cd "$(dirname "$0")/.."

LIVE=$(git rev-parse --verify -q origin/gh-pages || true)
if [ -z "$LIVE" ]; then
  echo "live-guard: nothing is live yet"
  exit 0
fi

SRC=$(git log -1 --format=%B "$LIVE" | sed -n 's/^Deployed-From: \([0-9a-f]\{40\}\).*/\1/p' | head -1)
FROM=$(git log -1 --format=%B "$LIVE" | sed -n 's/^Deployed-From: [0-9a-f]\{40\} *//p' | head -1)
if [ -z "$SRC" ]; then
  echo "live-guard: the live deploy ($(git rev-parse --short "$LIVE")) does not say what it was built from — nothing to check"
  exit 0
fi

if ! git cat-file -e "$SRC^{commit}" 2>/dev/null; then
  # it was built somewhere else: look for it on the remote's branches
  git fetch -q origin '+refs/heads/*:refs/remotes/origin/*' 2>/dev/null || true
fi
if ! git cat-file -e "$SRC^{commit}" 2>/dev/null; then
  echo "DEPLOY REFUSED: the live site was built from $SRC $FROM," >&2
  echo "which this checkout cannot find even after fetching every branch, so it cannot be" >&2
  echo "shown that this deploy carries it. Find it and merge it first." >&2
  exit 1
fi

if git merge-base --is-ancestor "$SRC" HEAD; then
  echo "live-guard: HEAD contains what is live ($(git rev-parse --short "$SRC") $FROM)"
  exit 0
fi

if [ "${DEPLOY_REPLACE:-}" = "$SRC" ]; then
  echo "live-guard: replacing the live $(git rev-parse --short "$SRC") on purpose (DEPLOY_REPLACE)"
  exit 0
fi

echo "DEPLOY REFUSED: the live site was built from $(git rev-parse --short "$SRC") $FROM —" >&2
echo "  \"$(git log -1 --format=%s "$SRC")\"" >&2
echo "and this HEAD does not contain it, so deploying would roll that work back." >&2
echo "Merge it first:   git merge $SRC" >&2
echo "or, to replace it on purpose:   DEPLOY_REPLACE=$SRC bash tools/deploy.sh" >&2
exit 1
