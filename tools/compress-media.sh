#!/usr/bin/env bash
# Shrink the DEPLOYED media without touching the masters.
#
# WHY: app/ is what gh-pages serves — 673MB of it, which is a long first visit on a
# family tablet and an awkward thing to push through a CDN. Two honest wins, measured
# before they were taken:
#
#   narration mp3  85KB -> 42KB   mono, 24kHz, 32kbps CBR. Speech only; this is the
#                                 audiobook standard for low bandwidth.
#   painting jpg  126KB -> 92KB   longest edge 760px at q80 progressive. The JPEGs were
#                                 ALREADY near-optimal at 900px — re-encoding at the same
#                                 size saved 2%, so the win here is dimensions, not quality.
#
# WHAT IS DELIBERATELY LEFT ALONE:
#   * masters/            the book-quality originals. Untouched, always.
#   * app/voice/{hi,pa,bn,mr,te,ta,gu,kn,ur}  the Bhasha teaching clips. A child imitates
#                         these to learn to SAY a letter; they stay at full quality.
#   * app/art/*.png       the avatar tiles, already small and alpha-sensitive.
#
# Everything it edits is committed, so git is the backup: git checkout -- app/voice app/art.
set -euo pipefail
cd "$(dirname "$0")/.."
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
export FF

echo "== narration: mono 24kHz 32kbps =="
find app/voice/st app/voice/ep -name '*.mp3' -print0 |
  xargs -0 -P 8 -I{} sh -c '
    t="{}.tmp.mp3"
    if "$FF" -v error -y -i "{}" -ac 1 -ar 24000 -b:a 32k "$t" 2>/dev/null; then
      mv "$t" "{}"
    else rm -f "$t"; echo "SKIP {}" >&2; fi'

echo "== paintings: longest edge 760, q80 progressive =="
python3 - <<'PY'
from PIL import Image
from concurrent.futures import ProcessPoolExecutor
import glob, os
def shrink(f):
    try:
        im = Image.open(f)
        if im.width > 760:
            im = im.resize((760, round(im.height * 760 / im.width)), Image.LANCZOS)
        im.convert('RGB').save(f, quality=80, optimize=True, progressive=True)
    except Exception as e:
        return '%s: %s' % (f, e)
files = glob.glob('app/art/epic/*.jpg') + glob.glob('app/art/story/*.jpg') + glob.glob('app/art/state/*.jpg')
with ProcessPoolExecutor(max_workers=8) as ex:
    for bad in ex.map(shrink, files):
        if bad: print(bad)
print('%d paintings' % len(files))
PY

echo "== after =="
du -sh app/voice app/art app/
