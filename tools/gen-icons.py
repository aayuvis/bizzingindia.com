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


icon(192, 0.82).save(os.path.join(APP, 'icon-192.png'), optimize=True)
icon(512, 0.82).save(os.path.join(APP, 'icon-512.png'), optimize=True)
# the safe zone is a circle of diameter 0.8n; a square-ish bird of side s fits it when s*sqrt(2) <= 0.8n
icon(512, 0.56).save(os.path.join(APP, 'icon-maskable-512.png'), optimize=True)
icon(180, 0.80).save(os.path.join(APP, 'apple-touch-icon.png'), optimize=True)
icon(32, 0.92).save(os.path.join(APP, 'favicon-32.png'), optimize=True)
print('icons: 192, 512, maskable 512, apple 180, favicon 32')
