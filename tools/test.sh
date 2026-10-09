#!/usr/bin/env bash
# npm test — THE GATE (FIX-INDIA N3; family standard §15; docs/27).
#
# Engine tests and the browser checks, desktop and phone, every one of which was watched to
# fail by breaking the thing it holds. deploy.sh refuses to publish a tree that has not
# passed this — and "this tree" is exact: on success the git tree ids of app/ and tools/ AS
# TESTED are written to .git/bizzing-gate, and deploy.sh compares them with HEAD's. Test
# one tree and ship another, and it says so.
#
#   bash tools/test.sh           the gate (~15 min)
#   bash tools/test.sh --full    plus the long walks: verify, qc-paath, check-sabhyata
#   BIZZING_REPO=/path/to/repo bash tools/test.sh   test a snapshot of the tree, record it
#                                                    against that repository
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="${BIZZING_REPO:-$ROOT}"
cd "$ROOT"
SUITES="check-facts check-css-compat check-subpath check-trust check-rewards check-home check-family check-motivation
        check-platform check-contrast check-onboard check-paath check-bhasha-path test-bhasha check-standard check-deploy check-feed check-names check-gita check-reading check-quiz"
[ "${1:-}" = "--full" ] && SUITES="$SUITES verify qc-paath check-sabhyata"
fail=0
for t in $SUITES; do
  if [ ! -f "tools/$t.js" ]; then echo "MISSING tools/$t.js"; fail=1; continue; fi
  printf '%-20s ' "$t"
  start=$(date +%s)
  if out=$(node "tools/$t.js" 2>&1); then
    echo "ok   ($(( $(date +%s) - start ))s)"
  else
    echo "FAIL"; echo "$out" | grep -v '^  ok' | tail -20 | sed 's/^/    /'; fail=1
  fi
done
if [ $fail -ne 0 ]; then echo; echo "THE GATE IS SHUT: fix what failed, then run it again."; exit 1; fi

# record exactly what passed: the tree ids of app/ and tools/ as they are on disk here
IDX=$(mktemp -u)
# start from HEAD's index, so a file git tracks counts even where .gitignore would skip it
# (tools/.art-raw is tracked and ignored at once — without this the gate could never open)
( cd "$REPO" && GIT_INDEX_FILE="$IDX" git read-tree HEAD && \
  GIT_INDEX_FILE="$IDX" git --work-tree="$ROOT" add -A app tools >/dev/null 2>&1 )
TREE=$(cd "$REPO" && GIT_INDEX_FILE="$IDX" git write-tree)
rm -f "$IDX"
APP_T=$(cd "$REPO" && git rev-parse "$TREE:app")
TOOLS_T=$(cd "$REPO" && git rev-parse "$TREE:tools")
echo "$APP_T $TOOLS_T" > "$(cd "$REPO" && git rev-parse --absolute-git-dir)/bizzing-gate"
echo; echo "THE GATE IS OPEN for app $APP_T · tools $TOOLS_T"
