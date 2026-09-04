#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ground fields, painted without a model.

Same contract as tools/gen-kit-ground.py — one large field per terrain, which
the board samples per cell so same-terrain neighbours are continuous — but
built here out of fractal noise, colour strata and drawn marks, because the
image key ran out of credit mid-job. Swap back to the Gemini version the
moment it has credit again: the board does not know or care which made the
file, and the filenames are identical.

What makes this better than the flat SVG diamonds it replaces is not the
grain, it is the SCALE of variation: patches of lighter and darker earth many
cells wide, so a field reads as ground with weather in it rather than one
colour with confetti on it.

    python3 tools/gen-kit-ground-proc.py [--only id]
"""
import argparse, io, json, math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "app", "art", "kit", "_ground")
MANIFEST = os.path.join(ROOT, "app", "kit-ground-manifest.js")
SIZE = 1024

T = {"ink": (36, 26, 20), "cream": (243, 230, 205), "white": (247, 241, 228),
     "indigo": (47, 61, 120), "turq": (63, 168, 156), "water": (74, 134, 168),
     "ochre": (192, 122, 44), "marigold": (239, 179, 74), "gold": (230, 193, 90),
     "vermilion": (207, 74, 52), "earth": (138, 90, 52), "leaf": (79, 139, 70),
     "stone": (185, 169, 140), "plum": (107, 74, 99)}


def mix(a, b, k):
    return tuple(int(round(a[i] + (b[i] - a[i]) * k)) for i in range(3))


def noise(rnd, octaves=6, size=SIZE):
    """Tileable fractal value noise: each octave is a small random grid,
    rolled to wrap, blown up smoothly and added at half the weight."""
    acc = np.zeros((size, size), dtype=np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        n = 2 ** (o + 1)
        g = rnd.random((n, n)).astype(np.float32)
        g = np.vstack([g, g[:1]]); g = np.hstack([g, g[:, :1]])   # wrap
        im = Image.fromarray((g * 255).astype(np.uint8), "L").resize(
            (size + 1, size + 1), Image.BICUBIC).crop((0, 0, size, size))
        acc += np.asarray(im, dtype=np.float32) / 255.0 * amp
        tot += amp
        amp *= 0.55
    acc /= tot
    return (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)


def ramp(n, c0, c1, c2):
    """noise -> colour, through three stops, so a field has real strata"""
    out = np.zeros(n.shape + (3,), dtype=np.float32)
    lo, hi = n < 0.5, n >= 0.5
    k = (n[lo] * 2)[:, None]
    out[lo] = np.array(c0)[None, :] * (1 - k) + np.array(c1)[None, :] * k
    k = ((n[hi] - 0.5) * 2)[:, None]
    out[hi] = np.array(c1)[None, :] * (1 - k) + np.array(c2)[None, :] * k
    return out


def speck(im, rnd, n, col, r=(0.6, 1.9), op=(20, 60)):
    d = ImageDraw.Draw(im, "RGBA")
    for _ in range(n):
        x, y = rnd.uniform(0, SIZE), rnd.uniform(0, SIZE)
        rr = rnd.uniform(*r)
        d.ellipse([x - rr, y - rr, x + rr, y + rr],
                  fill=col + (rnd.randint(*op),))
    return im


def lines(im, rnd, n, col, w, ang, jitter=0.25, op=(30, 70), dash=0):
    d = ImageDraw.Draw(im, "RGBA")
    for _ in range(n):
        x, y = rnd.uniform(-SIZE * .2, SIZE * 1.2), rnd.uniform(-SIZE * .2, SIZE * 1.2)
        a = ang + rnd.uniform(-jitter, jitter)
        L = rnd.uniform(SIZE * .3, SIZE * 1.3)
        pts, cx, cy = [], x, y
        steps = 14
        for s in range(steps):
            pts.append((cx, cy))
            cx += math.cos(a) * L / steps + rnd.uniform(-3, 3)
            cy += math.sin(a) * L / steps + rnd.uniform(-3, 3)
        d.line(pts, fill=col + (rnd.randint(*op),), width=w, joint="curve")
    return im


def tufts(im, rnd, n, col, h=7):
    d = ImageDraw.Draw(im, "RGBA")
    for _ in range(n):
        x, y = rnd.uniform(0, SIZE), rnd.uniform(0, SIZE)
        op = rnd.randint(70, 150)
        for dx in (-2.2, 0, 2.2):
            d.line([(x, y), (x + dx, y - h * rnd.uniform(.6, 1.2))],
                   fill=col + (op,), width=1)
    return im


def base(pid, rnd, np_rnd, c0, c1, c2, octaves=6):
    n = noise(np_rnd, octaves)
    arr = ramp(n, c0, c1, c2)
    return Image.fromarray(arr.astype(np.uint8), "RGB")


def build(pid):
    rnd = random.Random("ground/" + pid)
    nr = np.random.RandomState(abs(hash(pid)) % (2 ** 31))
    E, C, S, W, O, G, L, M, K, V = (T["earth"], T["cream"], T["stone"], T["white"],
                                    T["ochre"], T["gold"], T["leaf"], T["marigold"],
                                    T["water"], T["turq"])
    if pid == "gnd-salt":
        im = base(pid, rnd, nr, mix(W, O, .18), W, mix(W, C, .5), 5)
        im = lines(im, rnd, 90, mix(S, T["ink"], .25), 1, 0.6, 1.6, (18, 45))
        im = lines(im, rnd, 70, mix(S, T["ink"], .2), 1, -0.9, 1.6, (14, 38))
        im = speck(im, rnd, 900, mix(O, C, .5))
    elif pid == "gnd-plain":
        im = base(pid, rnd, nr, mix(O, E, .35), mix(O, C, .5), mix(C, O, .25))
        im = speck(im, rnd, 2600, mix(E, T["ink"], .2), (0.5, 1.5), (16, 45))
        im = tufts(im, rnd, 260, L, 6)
    elif pid == "gnd-sand-river":
        im = base(pid, rnd, nr, mix(C, O, .34), mix(C, G, .22), W, 5)
        im = lines(im, rnd, 130, mix(C, S, .5), 2, 0.32, .12, (20, 46))
        im = speck(im, rnd, 700, mix(S, T["ink"], .3), (0.6, 1.6))
    elif pid == "gnd-scrub":
        im = base(pid, rnd, nr, mix(S, L, .3), mix(S, O, .35), mix(C, S, .4))
        im = speck(im, rnd, 1800, mix(E, T["ink"], .25), (0.6, 2.0))
        im = tufts(im, rnd, 620, mix(L, S, .45), 9)
    elif pid == "gnd-grass":
        im = base(pid, rnd, nr, mix(L, T["ink"], .28), L, mix(L, G, .45))
        im = tufts(im, rnd, 1500, mix(L, G, .3), 8)
        im = speck(im, rnd, 500, mix(L, T["ink"], .35), (0.6, 1.6))
    elif pid == "gnd-rock":
        im = base(pid, rnd, nr, mix(S, T["ink"], .30), S, mix(S, C, .6), 5)
        im = lines(im, rnd, 60, mix(S, T["ink"], .45), 2, 0.4, 1.8, (25, 60))
        im = speck(im, rnd, 500, mix(L, G, .5), (1.0, 3.0), (18, 40))
    elif pid == "gnd-mud":
        im = base(pid, rnd, nr, mix(E, T["ink"], .35), E, mix(E, C, .3))
        im = speck(im, rnd, 1600, mix(E, T["ink"], .45), (1.0, 3.2), (30, 80))
        im = speck(im, rnd, 220, mix(K, W, .35), (2.5, 6.5), (30, 70))
    elif pid == "gnd-court":
        im = base(pid, rnd, nr, mix(C, S, .45), mix(C, W, .4), C, 5)
        im = lines(im, rnd, 150, mix(S, E, .3), 1, 0.45, .06, (14, 30))
        im = speck(im, rnd, 500, S, (0.6, 1.8), (16, 34))
    elif pid in ("cr-wheat", "cr-barley"):
        c = G if pid == "cr-wheat" else mix(G, C, .35)
        im = base(pid, rnd, nr, mix(c, E, .32), c, mix(c, W, .3))
        im = lines(im, rnd, 420, mix(c, E, .40), 2, 0.46, .05, (30, 70))
        im = lines(im, rnd, 300, mix(c, W, .35), 1, 0.46, .05, (25, 55))
    elif pid == "cr-mustard":
        im = base(pid, rnd, nr, mix(M, L, .35), M, mix(M, W, .35))
        im = lines(im, rnd, 380, mix(L, T["ink"], .2), 2, 0.46, .05, (28, 60))
        im = speck(im, rnd, 2200, mix(M, W, .4), (1.0, 2.4), (40, 95))
    elif pid == "cr-furrow":
        im = base(pid, rnd, nr, mix(E, T["ink"], .38), E, mix(E, O, .35))
        im = lines(im, rnd, 300, mix(E, T["ink"], .45), 3, 0.46, .03, (40, 90))
        im = lines(im, rnd, 300, mix(E, C, .35), 2, -0.46, .03, (30, 70))
    elif pid in ("cr-paddy-green", "cr-paddy-wet"):
        wet = pid.endswith("wet")
        c = mix(K, V, .45) if wet else L
        im = base(pid, rnd, nr, mix(c, T["ink"], .30), c, mix(c, W if wet else G, .35))
        im = lines(im, rnd, 240, mix(c, W, .30) if wet else mix(c, G, .35), 2, 0.46, .04, (30, 65))
        im = lines(im, rnd, 60, mix(E, C, .45), 5, -0.46, .02, (60, 120))
    elif pid in ("wa-river", "wa-canal", "wa-moat"):
        im = base(pid, rnd, nr, mix(K, T["indigo"], .42), K, mix(K, V, .45), 5)
        im = lines(im, rnd, 260, mix(V, W, .45), 2, 0.46, .10, (18, 44))
        im = lines(im, rnd, 90, mix(K, T["indigo"], .55), 3, 0.46, .10, (14, 34))
    elif pid == "wa-sea":
        im = base(pid, rnd, nr, mix(K, T["indigo"], .55), mix(K, V, .25), V, 5)
        im = lines(im, rnd, 300, mix(V, W, .5), 2, 0.30, .12, (18, 46))
    else:
        im = base(pid, rnd, nr, mix(O, E, .35), mix(O, C, .5), C)
    # paper grain, then a whisper of blur so nothing is pixel-sharp
    g = Image.fromarray((nr.random((SIZE, SIZE)) * 255).astype(np.uint8), "L")
    im = Image.blend(im, Image.merge("RGB", (g, g, g)), 0.045)
    return im.filter(ImageFilter.GaussianBlur(0.4))


IDS = ["gnd-salt", "gnd-plain", "gnd-sand-river", "gnd-scrub", "gnd-grass",
       "gnd-rock", "gnd-mud", "gnd-court", "cr-wheat", "cr-barley", "cr-mustard",
       "cr-furrow", "cr-paddy-green", "cr-paddy-wet", "wa-river", "wa-canal",
       "wa-moat", "wa-sea"]


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--only")
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    for pid in ([a.only] if a.only else IDS):
        build(pid).save(os.path.join(OUT, pid + ".jpg"), "JPEG",
                        quality=84, optimize=True, progressive=True)
        print("  ok  ", pid)
    have = sorted(f[:-4] for f in os.listdir(OUT) if f.endswith(".jpg"))
    with io.open(MANIFEST, "w", encoding="utf-8") as f:
        f.write("/* generated by tools/gen-kit-ground-proc.py — painted terrain\n"
                "   fields. The board samples each cell from a different part of one\n"
                "   field, so same-terrain cells are continuous and never repeat.\n"
                "   tools/gen-kit-ground.py makes the same files with Gemini; swap\n"
                "   freely, the board cannot tell them apart. */\n")
        f.write("window.IND_KIT_GROUND = %s;\nwindow.IND_KIT_GROUND_SIZE = %d;\n"
                % (json.dumps(have), SIZE))
    print("%d ground fields" % len(have))


if __name__ == "__main__":
    main()
