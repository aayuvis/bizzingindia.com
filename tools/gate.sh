#!/usr/bin/env bash
# The deploy gate: may HEAD be published? Only if tools/test.sh passed on exactly HEAD's
# app/ and tools/ (FIX-INDIA N3; docs/27). deploy.sh runs this first and stops on a no.
set -uo pipefail
cd "$(dirname "$0")/.."
MARK="$(git rev-parse --absolute-git-dir)/bizzing-gate"
WANT="$(git rev-parse HEAD:app) $(git rev-parse HEAD:tools)"
HAVE="$(cat "$MARK" 2>/dev/null || true)"
if [ "$HAVE" = "$WANT" ]; then echo "gate: open — tools/test.sh passed on this exact app/ and tools/"; exit 0; fi
echo "gate: SHUT — tools/test.sh has not passed on HEAD's app/ and tools/."
echo "      run: npm test   (or BIZZING_REPO=$(pwd) bash tools/test.sh in a snapshot of HEAD)"
exit 1
