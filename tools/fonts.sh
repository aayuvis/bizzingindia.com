#!/usr/bin/env bash
# Fetch the app's typefaces and generate app/fonts.css so nothing is loaded from a CDN.
#
# WHY THIS EXISTS. tokens.css used to @import Google Fonts, which broke two hard rules in
# CLAUDE.md at once:
#
#   * offline-first. A PWA that needs fonts.googleapis.com at paint time is not offline-first;
#     the child on a plane gets system fallbacks.
#   * "Devanagari is set correctly or not at all." On a slow or blocked connection Mukta never
#     arrives and Devanagari falls back to whatever the OS has, which on many devices breaks
#     the shirorekha. Shipping the face is the only way to keep that promise.
#
# Also: Google Fonts sees the IP of every child who opens the app. Self-hosting removes a
# third party from a children's product for free, which the DPDP/COPPA posture in CLAUDE.md
# wants anyway.
#
# Re-run this only when a family or weight changes. The woff2 files are committed.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=app/font
mkdir -p "$OUT"

# A modern desktop UA, or the API serves ttf instead of woff2.
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
API='https://fonts.googleapis.com/css2'

# Latin for the UI, latin-ext for the odd diacritic in a transliteration, devanagari for Mukta.
# Fraunces is two-axis (opsz, wght), so the tuple after @ must carry both axes in the order
# they are named — `opsz,wght@9..144,600..900`, not a bare list of weights. Getting that wrong
# returns a 400 page that looks like CSS to a script and silently produces zero fonts.
UI='family=Fraunces:opsz,wght@9..144,600..900&family=Hanken+Grotesk:wght@400;500;600;700;800&family=Space+Mono:wght@400;700'

# THE INDIAN SCRIPTS. CLAUDE.md's rule is written about Devanagari, but the reason behind it
# is not Devanagari-specific: a script set in a fallback face is a script set badly, and this
# audience is Tamil, Telugu, Bengali, Gujarati, Punjabi, Malayalam, Kannada and Odia
# households as much as Hindi ones. Shipping Mukta alone and letting the rest fall back to
# whatever the OS has would say, in typography, exactly the thing rule 8 forbids saying.
#
# Mukta first wherever Ek Type drew a sibling — Mahee (Gurmukhi), Malar (Tamil), Vaani
# (Gujarati) — because they were designed as one superfamily and the scripts then look like
# one app rather than eight. Noto Sans covers the rest at a compatible weight and colour.
# Assamese is written in the Bengali script, so Noto Sans Bengali serves both.
SCRIPTS='family=Mukta:wght@400;500;600;700&family=Mukta+Mahee:wght@400;500;600;700&family=Mukta+Malar:wght@400;500;600;700&family=Mukta+Vaani:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400..700&family=Noto+Sans+Telugu:wght@400..700&family=Noto+Sans+Kannada:wght@400..700&family=Noto+Sans+Malayalam:wght@400..700&family=Noto+Sans+Oriya:wght@400..700&family=Noto+Nastaliq+Urdu:wght@400..700'
# Noto Nastaliq Urdu is the Urdu pack's face. Nastaliq, not Naskh, because Nastaliq is what
# Urdu is written in — a child taught Urdu in Naskh is being taught Arabic typesetting. Its
# hanging baseline needs the generous line-height set in app.css (:lang(ur)).

QUERY="$UI&$SCRIPTS&display=swap"

RAW=$(mktemp); trap 'rm -f "$RAW"' EXIT
curl -sS -A "$UA" "$API?$QUERY" -o "$RAW"
if ! head -c 400 "$RAW" | grep -q '@font-face'; then
  echo "the font API did not return CSS — check QUERY below, then re-run:" >&2
  head -c 300 "$RAW" >&2; echo >&2
  exit 1
fi

# Rewrite each remote src to a local file, downloading as we go. The generated CSS keeps the
# unicode-range blocks Google emits, so a browser still only pulls the subset it needs.
python3 - "$RAW" "$OUT" <<'PY'
import re, sys, os, urllib.request, hashlib

raw, out = sys.argv[1], sys.argv[2]
css = open(raw, encoding='utf-8').read()
seen = {}

# Google emits every subset it has — cyrillic, greek, vietnamese. unicode-range means a
# browser would never fetch them, but we would still be committing the files, so drop the
# blocks we have no use for. This app needs latin (UI), latin-ext (transliteration
# diacritics: ā, ṛ, ṣ, ñ) and every Indian script it sets.
# 'arabic' is the subset name Google gives Noto Nastaliq Urdu's own script.
KEEP = ('latin', 'latin-ext', 'devanagari', 'gurmukhi', 'tamil', 'gujarati',
        'bengali', 'telugu', 'kannada', 'malayalam', 'oriya', 'arabic')

# And the Latin subset is kept ONLY for the three UI families. Every Indian-script family
# also ships Latin, which would be eight redundant copies of an alphabet Hanken Grotesk
# already sets — 2.6MB instead of 900KB, all of it downloaded by a child on a phone. The
# --deva stack falls through to the body family for Latin runs inside an Indian-script span,
# so nothing loses a glyph.
UI_FAMILIES = ('Fraunces', 'Hanken Grotesk', 'Space Mono')

kept, dropped = [], 0
for b in re.split(r'(?=/\* [a-z-]+ \*/)', css):
    m = re.match(r'/\* ([a-z-]+) \*/', b.strip())
    if not m:
        kept.append(b)                      # preamble, not a subset block
        continue
    subset = m.group(1)
    fam = re.search(r"font-family: '([^']+)'", b)
    fam = fam.group(1) if fam else ''
    if subset not in KEEP:
        dropped += 1
    elif subset.startswith('latin') and fam not in UI_FAMILIES:
        dropped += 1
    else:
        kept.append(b)
css = ''.join(kept)
print(f"dropped {dropped} redundant subset blocks")

def fetch(url):
    if url in seen:
        return seen[url]
    fam = re.search(r'/s/([a-z]+)/', url)
    fam = fam.group(1) if fam else 'font'
    name = f"{fam}-{hashlib.sha1(url.encode()).hexdigest()[:8]}.woff2"
    dest = os.path.join(out, name)
    if not os.path.exists(dest):
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as r, open(dest, 'wb') as f:
            f.write(r.read())
    seen[url] = name
    return name

css = re.sub(r'url\((https://fonts\.gstatic\.com/[^)]+)\)',
             lambda m: f"url('font/{fetch(m.group(1))}')", css)

header = (
    "/* Bizzing India — self-hosted typefaces. GENERATED by tools/fonts.sh, do not edit.\n"
    "   Fonts are served from the app itself so the PWA works offline and so Mukta is always\n"
    "   present for Devanagari (CLAUDE.md: set correctly or not at all). No child's device\n"
    "   contacts a font CDN.\n\n"
    "   Fraunces, Hanken Grotesk, Space Mono and Mukta are all under the SIL Open Font\n"
    "   License 1.1, which permits redistribution like this. See app/font/OFL.txt. */\n\n"
)
open('app/fonts.css', 'w', encoding='utf-8').write(header + css)
print(f"{len(seen)} font files in {out}")
PY

cat > "$OUT/OFL.txt" <<'EOF'
The typefaces in this directory are redistributed under the SIL Open Font License 1.1:

  Fraunces        — Undercase Type / Flavia Zimbardi, Phaedra Charles
  Hanken Grotesk  — Alfredo Marco Pradil
  Space Mono      — Colophon Foundry for Google Design
  Mukta           — Ek Type

Full licence text: https://openfontlicense.org/open-font-license-official-text/
Sources: https://fonts.google.com/
EOF

echo "wrote app/fonts.css"
