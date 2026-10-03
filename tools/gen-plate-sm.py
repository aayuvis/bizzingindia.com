#!/usr/bin/env python3
"""A phone's copy of every world plate: 960 x 540, for a screen no wider than 900px.

The plates are 1600 x 900 (150-400 KB each) and sit at half opacity behind the cards. A phone
was sent the full one — and the night one with it — before the child had touched anything,
which put the first load over the 1.5 MB budget the day all fifteen worlds were painted
(check-platform untouched). worlds-art.js takes art/worlds/sm/ under 900px, and only the plate
for the mode that is showing.

Run: python3 tools/gen-plate-sm.py   (Pillow). Rerun after painting a plate;
check-standard plates fails on a missing or older copy.
"""
from PIL import Image
import glob, os

HERE = os.path.dirname(os.path.abspath(__file__))
W = os.path.join(HERE, '..', 'app', 'art', 'worlds')
OUT = os.path.join(W, 'sm')
os.makedirs(OUT, exist_ok=True)
n = total = 0
for f in sorted(glob.glob(os.path.join(W, '*.jpg'))):
    im = Image.open(f).convert('RGB').resize((960, 540), Image.LANCZOS)
    dst = os.path.join(OUT, os.path.basename(f))
    # a dense painting (Madhubani's day is all line) steps its quality down to fit 110 KB
    for q in (72, 66, 60, 54, 48):
        im.save(dst, 'JPEG', quality=q, optimize=True, progressive=True)
        if os.path.getsize(dst) <= 110 * 1024: break
    n += 1; total += os.path.getsize(dst)
print('plate copies: %d at 960x540, %d KB' % (n, total // 1024))
