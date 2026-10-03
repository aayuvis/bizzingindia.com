#!/usr/bin/env python3
"""Small copies of the 96 avatars, for everywhere an avatar is drawn at 96px or less.

The portraits are 512px (art/av/<id>.webp, ~34 KB each) and the Collection draws all 96 at
96px. Lazy-loaded, that was 3.3 MB arriving as the child scrolled, and every card below the fold
stood blank until it came (audit, 3 Oct 2026: "several avatar cards render blank until
scrolled"). At 192px — twice the largest size they are drawn at, for a sharp phone screen — the
whole shelf is ~0.5 MB and can load at once.

Run: python3 tools/gen-av-thumbs.py   (Pillow). Rerun when an avatar is added or redrawn;
check-family collection fails on a missing or stale copy.
"""
from PIL import Image
import glob, os

HERE = os.path.dirname(os.path.abspath(__file__))
AV = os.path.join(HERE, '..', 'app', 'art', 'av')
OUT = os.path.join(AV, 'sm')
os.makedirs(OUT, exist_ok=True)
n = total = 0
for f in sorted(glob.glob(os.path.join(AV, '*.webp'))):
    im = Image.open(f).convert('RGBA')
    im.thumbnail((192, 192), Image.LANCZOS)
    dst = os.path.join(OUT, os.path.basename(f))
    im.save(dst, 'WEBP', quality=84, method=6)
    n += 1; total += os.path.getsize(dst)
print('av thumbs: %d at 192px, %d KB' % (n, total // 1024))
