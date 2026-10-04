#!/usr/bin/env python3
"""Plate-size copies of the story paintings, the banners, the epic covers and the world plates.

Home draws its Continue and map plates 100px tall. They were drawn from the full paintings
(story art 760px, ~100 KB; banners 1200px, ~100 KB) — two of the biggest things a returning
child's phone was sent before a tap (check-platform untouched). At 480px (story) and 640px
(banner) a plate is ~20-35 KB and still sharp on a phone's screen.

Run: python3 tools/gen-plate-thumbs.py   (Pillow). Rerun after adding a painting:
check-standard plates fails on a painting with no copy, or an older one.
"""
from PIL import Image
import glob, os

HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(HERE, '..', 'app', 'art')
total = n = 0
for sub, w in (('story', 480), ('banner', 640)):
    out = os.path.join(ART, sub, 'sm'); os.makedirs(out, exist_ok=True)
    for f in sorted(glob.glob(os.path.join(ART, sub, '*.jpg'))):
        im = Image.open(f).convert('RGB')
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        dst = os.path.join(out, os.path.basename(f))
        im.save(dst, 'JPEG', quality=64, optimize=True, progressive=True)
        n += 1; total += os.path.getsize(dst)
# THE EPICS' NIGHT COVERS for My Feed's cards (v4: 5% of feed cards had a picture): card 0 of
# each episode, the painting the episode list already uses as its thumbnail, at story size.
out = os.path.join(ART, 'epic', 'sm'); os.makedirs(out, exist_ok=True)
for f in sorted(glob.glob(os.path.join(ART, 'epic', '*-0.jpg'))):
    im = Image.open(f).convert('RGB')
    im = im.resize((480, round(im.height * 480 / im.width)), Image.LANCZOS)
    dst = os.path.join(out, os.path.basename(f))
    im.save(dst, 'JPEG', quality=64, optimize=True, progressive=True)
    n += 1; total += os.path.getsize(dst)
# THE WORLDS PAGE'S THUMBNAILS (v4 D3/D4): each world's own painted plate, day and night, in
# place of the flat vector insets — the same picture the world paints behind the app, small.
out = os.path.join(ART, 'worlds', 'th'); os.makedirs(out, exist_ok=True)
for f in sorted(glob.glob(os.path.join(ART, 'worlds', 'sm', '*.jpg'))):
    im = Image.open(f).convert('RGB')
    im = im.resize((480, round(im.height * 480 / im.width)), Image.LANCZOS)
    dst = os.path.join(out, os.path.basename(f))
    im.save(dst, 'JPEG', quality=62, optimize=True, progressive=True)
    n += 1; total += os.path.getsize(dst)
print('plate thumbs: %d, %d KB' % (n, total // 1024))
