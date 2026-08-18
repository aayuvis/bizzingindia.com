#!/usr/bin/env bash
# Publish a rendered film to the gh-pages branch, WITHOUT committing it to the source branch.
#
# WHY IT IS NOT JUST `cp build/video/x.mp4 app/`. app/ is source and everything in it lands
# in git forever; a film is a build artefact that is re-rendered whenever a line of narration
# changes, so committing each cut would grow the repo by tens of megabytes per revision for
# versions nobody will ever check out. gh-pages is already a build-output branch — the film
# belongs there and only there.
#
# So this writes the blob straight into the gh-pages tree by plumbing: hash-object, read the
# existing tree, add one entry, commit, push. The source branch is untouched and the working
# directory is never checked out to another branch.
#
#   tools/publish-video.sh build/video/bizzing-india-kambugriva-preview.mp4 video/kambugriva.mp4
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=${1:?usage: publish-video.sh <local file> <path on the site>}
DEST=${2:?usage: publish-video.sh <local file> <path on the site>}
[ -f "$SRC" ] || { echo "no such file: $SRC" >&2; exit 1; }

git fetch origin gh-pages --quiet
BASE=$(git rev-parse origin/gh-pages)
BLOB=$(git hash-object -w "$SRC")
echo "blob $BLOB  ($(du -h "$SRC" | cut -f1))  -> $DEST"

# build the new tree with an index that is NOT the working index
export GIT_INDEX_FILE=$(mktemp -u /tmp/pubidx.XXXXXX)
trap 'rm -f "$GIT_INDEX_FILE"' EXIT
git read-tree "$BASE"
git update-index --add --cacheinfo 100644,"$BLOB","$DEST"
TREE=$(git write-tree)

if [ "$TREE" = "$(git rev-parse "$BASE^{tree}")" ]; then
  echo "gh-pages already has this exact file — nothing to publish"
  exit 0
fi

COMMIT=$(git commit-tree "$TREE" -p "$BASE" -m "Publish $DEST")
for i in 1 2 3 4 5; do
  if git push origin "$COMMIT":refs/heads/gh-pages; then
    URL="https://$(git remote get-url origin | sed -E 's#.*github.com[:/]([^/]+)/(.+?)(\.git)?$#\1.github.io/\2#')/$DEST"
    echo "published: $URL"
    exit 0
  fi
  echo "push failed, retry $i" >&2; sleep $((2**i))
done
echo "push failed after 5 attempts" >&2; exit 1
