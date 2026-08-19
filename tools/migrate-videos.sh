#!/usr/bin/env bash
# Move the YouTube video pipeline out of bizzingindia.com and into its own repo.
#
# WHY IT MOVES AT ALL. The pipeline is not a feature of the app -- it consumes the app.
# It reads narration, story text, the brand mark and the type, and it emits mp4s. Those
# two things have different release cadences, different disk profiles (21MB of sprites and
# plates per two films, and growing with the cast) and, increasingly, different chats.
# Keeping them in one repo means every app clone pays for the film library.
#
# WHAT IT DELIBERATELY DOES NOT MOVE. The narration, the story text, the logo and the
# fonts stay in the app and are READ from a checkout of it. docs/15 Rule 1 is that nothing
# on the channel is invented for the channel: a child who watches a video and opens the app
# must meet the same tortoise, and the only way to guarantee that is for the film to have
# no copy of its own to drift from. So the new repo has a seam, $BIZZING_APP, and no
# duplicated content.
#
#   tools/migrate-videos.sh <target-dir> [--remove-from-source]
#
# Without --remove-from-source this is READ-ONLY on bizzingindia.com: it builds the new
# repo and leaves this one exactly as it was. Run it, look at what came out, push the new
# repo, and only then come back and run the removal half.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=$PWD

TARGET=${1:?usage: migrate-videos.sh <target-dir> [--remove-from-source]}
REMOVE=no
[ "${2:-}" = "--remove-from-source" ] && REMOVE=yes

# ---------------------------------------------------------------- what moves
# tools/anim/*         the compositor: build, render, cut, cards, stills, asset generation
# tools/publish-video.sh   publishing to gh-pages
# tools/veo-story.py   the abandoned generative pipeline -- kept as evidence, see docs
# docs/14, docs/15     the look-and-feel rules and the production brief
PATHS=(tools/anim tools/publish-video.sh tools/veo-story.py
       docs/14-video-look-and-feel.md docs/15-video-production-brief.md)

for p in "${PATHS[@]}"; do
  [ -e "$p" ] || { echo "missing: $p (is this bizzingindia.com?)" >&2; exit 1; }
done

echo "==> target: $TARGET"
[ -e "$TARGET" ] && { echo "$TARGET already exists — pick an empty path" >&2; exit 1; }
mkdir -p "$TARGET"
git -C "$TARGET" init -q -b main

# ------------------------------------------------------- history, replayed
# There is no git-filter-repo here and the video work is not one directory, so a subtree
# split cannot do it either. Instead: find every commit that touched a video path and
# replay the STATE of those paths at each one, keeping the original message, author and
# date. The result is a faithful linear history of the video work -- you can still run
# `git log` on a film and read why a number is what it is, which is the only reason to
# carry history across a move at all.
mapfile -t COMMITS < <(git -C "$SRC" log --reverse --format=%H -- "${PATHS[@]}")
echo "==> replaying ${#COMMITS[@]} commits that touched the pipeline"

layout() {  # $1 = worktree of a commit, $2 = destination root
  local from=$1 to=$2
  mkdir -p "$to/tools" "$to/docs" "$to/films" "$to/tools/attic"
  [ -d "$from/tools/anim" ] && {
    for f in "$from"/tools/anim/*.js "$from"/tools/anim/*.py; do
      [ -e "$f" ] || continue
      cp -a "$f" "$to/tools/"
    done
    # a film is a directory of scenes.json + assets.json + sprites/ + plates/ + cards
    for d in "$from"/tools/anim/*/; do
      [ -d "$d" ] || continue
      cp -a "$d" "$to/films/$(basename "$d")"
    done
    # loose reference art that predates the per-film layout
    for f in "$from"/tools/anim/*.png; do
      [ -e "$f" ] || continue
      mkdir -p "$to/films/_reference"; cp -a "$f" "$to/films/_reference/"
    done
  }
  [ -e "$from/tools/publish-video.sh" ] && cp -a "$from/tools/publish-video.sh" "$to/tools/"
  # The Veo pipeline is dead (docs/15 §0) but it is the evidence for why, and four rounds
  # of failure paid for it. It goes to the attic, not the bin.
  [ -e "$from/tools/veo-story.py" ] && cp -a "$from/tools/veo-story.py" "$to/tools/attic/"
  [ -e "$from/docs/14-video-look-and-feel.md" ] &&
    cp -a "$from/docs/14-video-look-and-feel.md" "$to/docs/01-video-look-and-feel.md"
  [ -e "$from/docs/15-video-production-brief.md" ] &&
    cp -a "$from/docs/15-video-production-brief.md" "$to/docs/02-video-production-brief.md"
  return 0
}

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
git -C "$SRC" worktree add --detach -q "$WORK/src" HEAD

n=0
for sha in "${COMMITS[@]}"; do
  n=$((n + 1))
  git -C "$WORK/src" checkout -q "$sha"
  find "$TARGET" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
  layout "$WORK/src" "$TARGET"
  git -C "$TARGET" add -A
  git -C "$TARGET" diff --cached --quiet && continue   # nothing of ours changed
  GIT_AUTHOR_NAME=$(git -C "$SRC" show -s --format=%an "$sha") \
  GIT_AUTHOR_EMAIL=$(git -C "$SRC" show -s --format=%ae "$sha") \
  GIT_AUTHOR_DATE=$(git -C "$SRC" show -s --format=%aD "$sha") \
  GIT_COMMITTER_NAME=$(git -C "$SRC" show -s --format=%an "$sha") \
  GIT_COMMITTER_EMAIL=$(git -C "$SRC" show -s --format=%ae "$sha") \
  GIT_COMMITTER_DATE=$(git -C "$SRC" show -s --format=%aD "$sha") \
  git -C "$TARGET" commit -q --no-verify \
    -m "$(git -C "$SRC" show -s --format=%B "$sha")" \
    -m "Migrated from bizzingindia.com $sha"
  printf '  %3d/%d  %s\n' "$n" "${#COMMITS[@]}" "$(git -C "$SRC" show -s --format=%s "$sha" | cut -c1-64)"
done
git -C "$SRC" worktree remove --force "$WORK/src"

# --------------------------------------------------- the seam, and the paths
# The tools moved up one level (tools/anim/x.js -> tools/x.js) and the films moved sideways
# (tools/anim/<story>/ -> films/<story>/), so every path constant has to move with them.
# $BIZZING_APP is the new one: where a checkout of bizzingindia.com lives. Everything the
# films read from the app -- narration, story text, logo, fonts -- comes through it.
echo "==> repointing paths at the new layout and the \$BIZZING_APP seam"
SEAM_JS="const HERE = __dirname, ROOT = path.join(HERE, '..');
/* WHERE THE APP LIVES. Narration, story text, the mark and the type are read from a
   checkout of bizzingindia.com and never copied here -- docs/02 Rule 1: nothing on the
   channel is invented for the channel, and a copy is a thing that can drift. */
const APP_REPO = process.env.BIZZING_APP || path.join(ROOT, '..', 'bizzingindia.com');
const APP = path.join(APP_REPO, 'app');"

for f in "$TARGET"/tools/*.js; do
  [ -e "$f" ] || continue
  perl -0pi -e "s{const HERE = __dirname, ROOT = path\.join\(HERE, '\.\.', '\.\.'\), APP = path\.join\(ROOT, 'app'\);}{$SEAM_JS}s" "$f"
  perl -0pi -e "s{const HERE = __dirname, ROOT = path\.join\(HERE, '\.\.', '\.\.'\);}{$SEAM_JS}s" "$f"
  perl -0pi -e "s{path\.join\(ROOT, 'app', 'voice', 'st'\)}{path.join(APP, 'voice', 'st')}g" "$f"
  perl -0pi -e "s{path\.join\(__dirname, '\.\.', '\.\.', 'build'}{path.join(__dirname, '..', 'build'}g" "$f"
  perl -0pi -e "s{path\.join\(__dirname, STORY\)}{path.join(__dirname, '..', 'films', STORY)}g" "$f"
  perl -0pi -e "s{path\.join\(HERE, STORY\)}{path.join(ROOT, 'films', STORY)}g" "$f"
done

# gen-assets.py: ROOT was three dirnames up (tools/anim/x.py); it is two now (tools/x.py).
if [ -e "$TARGET/tools/gen-assets.py" ]; then
  perl -0pi -e "s{ROOT = os\.path\.dirname\(os\.path\.dirname\(os\.path\.dirname\(os\.path\.abspath\(__file__\)\)\)\)}{ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))\n# Where a checkout of bizzingindia.com lives; the story paintings are read from it.\nAPP_REPO = os.environ.get('BIZZING_APP', os.path.join(ROOT, '..', 'bizzingindia.com'))}" "$TARGET/tools/gen-assets.py"
  perl -0pi -e "s{HERE = os\.path\.join\(ROOT, 'tools', 'anim'\)}{HERE = os.path.join(ROOT, 'films')}" "$TARGET/tools/gen-assets.py"
  perl -0pi -e "s{os\.path\.join\(ROOT, 'app', 'art', 'story'}{os.path.join(APP_REPO, 'app', 'art', 'story'}g" "$TARGET/tools/gen-assets.py"
fi

# The shot pages and the cards load the app's font, tokens and logo by RELATIVE url, which
# only worked because the app was two directories up. It is now in another repo entirely,
# so those become absolute file:// urls resolved from $BIZZING_APP at build time. Every one
# of them sits inside a template literal, so the interpolation is ${APP_URL} and not string
# concatenation -- get that backwards and the url is the literal text "' + APP_URL + '".
for f in "$TARGET/tools/build.js" "$TARGET/tools/cards.js"; do
  [ -e "$f" ] || continue
  perl -0pi -e 's{\.\./\.\./(?:\.\./)?app/}{\$\{APP_URL\}/}g' "$f"
  perl -0pi -e "s{(const APP = path\.join\(APP_REPO, 'app'\);)}{\$1\n/* the same directory as a url: the shot pages and cards are loaded over file:// */\nconst APP_URL = 'file://' + APP;}" "$f"
done

# Comments and usage lines still say tools/anim. A doc comment that describes a layout the
# repo does not have is the same class of fault as a manifest that misreports its own
# generator -- worse than no note, because it is believed.
for f in "$TARGET"/tools/*.js "$TARGET"/tools/*.py "$TARGET"/tools/*.sh; do
  [ -e "$f" ] || continue
  perl -0pi -e 's{tools/anim/(\w[\w-]*)\.(js|py)}{tools/$1.$2}g' "$f"
  perl -0pi -e 's{tools/anim/<story>}{films/<story>}g' "$f"
  perl -0pi -e 's{tools/anim/}{films/}g' "$f"
done

# --------------------------------------------------------------- repo furniture
cat > "$TARGET/.gitignore" <<'EOF'
# Build output. Shot pages are generated from scenes.json; films are re-rendered
# whenever a line of narration changes. Neither belongs in git.
build/
films/*/shot-*.html
node_modules/
__pycache__/
*.pyc
.DS_Store

# secrets — never commit API keys
.env
*.key
keys.env
EOF

# The handover. It is the first thing a session in the new repo reads, so it is not
# optional furniture -- if it is missing, say so loudly rather than shipping a repo whose
# rules live only in a chat that has ended.
if [ -e "$SRC/Bizzing_India_youtube_Video.md" ]; then
  cp -a "$SRC/Bizzing_India_youtube_Video.md" "$TARGET/CLAUDE.md"
else
  echo "WARNING: Bizzing_India_youtube_Video.md not found — the new repo has no CLAUDE.md" >&2
fi

cat > "$TARGET/README.md" <<'EOF'
# Bizzing Videos

The film pipeline for the Bizzing properties. Story films are **composited locally** from
generated sprites and plates — there is no generative video anywhere in here, and
`docs/02-video-production-brief.md` §0 is the standing instruction that says why.

    export BIZZING_APP=../bizzingindia.com     # a checkout of the app
    STORY=pt-monkey-crocodile node tools/build.js     # scenes.json -> shot pages
    STORY=pt-monkey-crocodile node tools/film.js --check   # assertions, no render
    STORY=pt-monkey-crocodile T=3600 node tools/still.js 07   # one frame, one second
    STORY=pt-monkey-crocodile node tools/film.js      # render every shot
    STORY=pt-monkey-crocodile node tools/cut.js       # cards, narration, master + preview

Read `CLAUDE.md` first.
EOF

git -C "$TARGET" add -A
git -C "$TARGET" -c user.name=Claude -c user.email=noreply@anthropic.com commit -q \
  -m "Repoint the pipeline at the new layout and the \$BIZZING_APP seam

tools/anim/x.js became tools/x.js and tools/anim/<story>/ became films/<story>/, so
every path constant moved with them. The app -- narration, story text, the mark, the
type -- is now READ from a checkout of bizzingindia.com through \$BIZZING_APP and never
copied here: docs/02 Rule 1 is that nothing on the channel is invented for the channel,
and a copy is a thing that can drift.

Co-Authored-By: Claude <noreply@anthropic.com>"

# ---------------------------------------------------------------- verification
# A migration that produces a repo nobody has run is a guess. Say plainly what still
# points at the old tree, so the first session in the new repo starts from a list.
echo
echo "==> anything still pointing into the old tree:"
if grep -rn "tools/anim\|'\.\.', '\.\.', 'app'\|\.\./\.\./app/\|\.\./\.\./\.\./app/" \
     "$TARGET/tools" "$TARGET/films"/*/scenes.json 2>/dev/null | grep -v Binary; then
  echo "    ^ fix these before the first render."
else
  echo "    none found."
fi
echo
echo "==> next:"
echo "    cd $TARGET"
echo "    export BIZZING_APP=$SRC"
echo "    STORY=pt-monkey-crocodile node tools/build.js && STORY=pt-monkey-crocodile node tools/film.js --check"
echo "    git remote add origin git@github.com:aayuvis/Bizzing-Videos.git && git push -u origin main"

# --------------------------------------------------- the destructive half
if [ "$REMOVE" = yes ]; then
  echo
  echo "==> removing the pipeline from bizzingindia.com"
  git -C "$SRC" rm -r -q "${PATHS[@]}"
  cat > "$SRC/docs/14-video.md" <<'EOF'
# 14 — Video

The film pipeline lives in its own repository now: **Bizzing-Videos**.

It reads this repo rather than copying from it — narration out of `app/voice/st`, story
text out of `app/data-stories*.js`, the mark and the type out of `app/` — through a
`$BIZZING_APP` environment variable pointing at a checkout of bizzingindia.com. That is
deliberate and it is the first rule of the channel: nothing on the channel is invented for
the channel, so a child who watches a video and then opens the app meets the same tortoise.
A copy would be a thing that can drift; there is no copy.

**If you change a story's text, its hook, its moral or its narration, the films that use
it are stale.** Re-render them from Bizzing-Videos.

The look-and-feel rules and the production brief moved with it, to `docs/01` and `docs/02`
in that repo. Read the brief before starting any video work on any Bizzing property — its
first section is the one that costs money.
EOF
  git -C "$SRC" add docs/14-video.md
  echo "    staged. Review with 'git -C $SRC status', then commit."
fi
