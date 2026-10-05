#!/usr/bin/env python3
"""Install icons from the peacock mark (app/art/logo.png). Audit U11/R1, 3 Oct 2026.

A home screen crops an icon to the platform's shape, and a launcher may draw it anywhere from
a circle to a squircle. So there are three jobs, and one picture cannot do all three:

  icon-192.png, icon-512.png   purpose "any": the peacock large on the marigold ground
  icon-maskable-512.png        purpose "maskable": the whole of the peacock inside the centre
                               80% circle (the safe zone), the ground running to every edge
  apple-touch-icon.png         180 x 180, opaque: iOS draws a transparent pixel black

The old icons were the peacock at about 45% on cream, which reads as a small bird on a page,
and both claimed "any maskable" at once — so a round launcher cut its tail off.

Run: python3 tools/gen-icons.py   (Pillow)
"""
from PIL import Image, ImageDraw, ImageFilter
import os

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, '..', 'app')
MARK = Image.open(os.path.join(APP, 'art', 'logo.png')).convert('RGBA')
INNER, OUTER = (247, 190, 76), (231, 132, 44)   # marigold to saffron, the festival flower


def ground(n):
    """a radial marigold ground, lighter behind the bird so the blue reads"""
    g = Image.new('RGB', (n, n), OUTER)
    d = ImageDraw.Draw(g)
    steps = 64
    for i in range(steps):
        t = i / (steps - 1)
        r = int(n * 0.75 * (1 - t))
        c = tuple(int(OUTER[k] + (INNER[k] - OUTER[k]) * t) for k in range(3))
        d.ellipse([n / 2 - r, n * 0.47 - r, n / 2 + r, n * 0.47 + r], fill=c)
    return g.filter(ImageFilter.GaussianBlur(n / 40))


def bird(span):
    """the mark, trimmed to its pixels and scaled so its larger side is `span`"""
    m = MARK.crop(MARK.getbbox())
    k = span / max(m.size)
    return m.resize((max(1, round(m.width * k)), max(1, round(m.height * k))), Image.LANCZOS)


def icon(n, frac, alpha=False):
    g = ground(n).convert('RGBA')
    b = bird(n * frac)
    g.alpha_composite(b, (round((n - b.width) / 2), round((n - b.height) / 2)))
    return g if alpha else g.convert('RGB')


# A browser fetches the manifest's icons on the first visit to judge installability, so they are
# part of the first load (check-platform untouched): a 256-colour palette takes icon-512 from
# 192 KB to 72 with no difference anyone can see. iOS's own icon stays plain RGB.
def small(im):
    return im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)

small(icon(192, 0.82)).save(os.path.join(APP, 'icon-192.png'), optimize=True)
small(icon(512, 0.82)).save(os.path.join(APP, 'icon-512.png'), optimize=True)
# the safe zone is a circle of diameter 0.8n; a square-ish bird of side s fits it when s*sqrt(2) <= 0.8n
small(icon(512, 0.56)).save(os.path.join(APP, 'icon-maskable-512.png'), optimize=True)
icon(180, 0.80).save(os.path.join(APP, 'apple-touch-icon.png'), optimize=True)
# THE TAB ICON IS THE BIRD ALONE (owner, 4 Oct 2026: "the bee icon has no background square —
# do so here too"): in a browser tab the mark stands on the tab itself, the way Bizzing Bee's bee
# does. Transparent, the peacock filling the square. The home-screen icons above keep their
# ground, because a launcher draws a transparent pixel as black or as its own plate.
def bare():
    """the mark without its cream halo or loose sparkles: the halo is flooded away from outside
    (cream pixels only, so the bird's own whites, ringed by its outline, stay), then only the
    largest connected shape — the bird — is kept"""
    from collections import deque
    m = MARK.copy(); W, H = m.size; px = m.load()
    def cream(p):
        r, g, b, a = p
        return a < 40 or (r > 225 and g > 205 and b > 150 and r - b < 95 and abs(r - g) < 45)
    gone = [[False] * H for _ in range(W)]; q = deque()
    for x in range(W):
        for y in range(H):
            if px[x, y][3] == 0: gone[x][y] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        for a, b in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= a < W and 0 <= b < H and not gone[a][b] and cream(px[a, b]):
                gone[a][b] = True; q.append((a, b))
    comp, best, label = {}, None, 0
    for x in range(W):
        for y in range(H):
            if gone[x][y] or (x, y) in comp: continue
            label += 1; q = deque([(x, y)]); comp[(x, y)] = label; size = 0
            while q:
                cx, cy = q.popleft(); size += 1
                for a, b in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= a < W and 0 <= b < H and not gone[a][b] and (a, b) not in comp:
                        comp[(a, b)] = label; q.append((a, b))
            if not best or size > best[1]: best = (label, size)
    for x in range(W):
        for y in range(H):
            if gone[x][y] or comp.get((x, y)) != best[0]: px[x, y] = (0, 0, 0, 0)
    return m.crop(m.getbbox())


def tab(n):
    c = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    m = bare(); k = n / max(m.size)
    b = m.resize((max(1, round(m.width * k)), max(1, round(m.height * k))), Image.LANCZOS)
    c.alpha_composite(b, (round((n - b.width) / 2), round((n - b.height) / 2)))
    return c

# a palette keeps the alpha and takes the 96 from 19 KB to a few: it is sent on every first visit
def tabsmall(im):
    return im.quantize(colors=128, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)

# THE PEACOCK IS AN AVATAR TOO (owner, 5 Oct 2026: "app icon should be a free avatar too"): the
# same bare bird, at the 512 every avatar sticker is drawn at, with the margin they keep.
def sticker(n=512, frac=0.9):
    c = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    m = bare(); k = n * frac / max(m.size)
    b = m.resize((max(1, round(m.width * k)), max(1, round(m.height * k))), Image.LANCZOS)
    c.alpha_composite(b, (round((n - b.width) / 2), round((n - b.height) / 2)))
    return c

sticker().save(os.path.join(APP, 'art', 'av', 'mor.webp'), 'WEBP', quality=90, method=6)
tabsmall(tab(32)).save(os.path.join(APP, 'favicon-32.png'), optimize=True)
tabsmall(tab(96)).save(os.path.join(APP, 'favicon-96.png'), optimize=True)
print('icons: 192, 512, maskable 512, apple 180; tab icons 32 and 96, transparent; avatar art/av/mor.webp')
