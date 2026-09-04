#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""City Kit tiles — the pieces a model must not draw.

Ground, crops, water sheets and road networks are procedural, because the two
things they must do are the two things a generative model cannot promise: butt
against the next tile with no seam, and put a road's edge exactly on the cell
boundary so a walker can cross it. Structure from code; the colour and the
grain come from the kit's own palette, so they sit beside the painted pieces
without looking like a different game.

Roads and water networks are emitted once per connection mask — four bits,
one per neighbour (+x, +y, -x, -y) — so straight, corner, tee, cross and end
all fall out of the same generator and always meet.

    python3 tools/kit-tiles.py [--only id]

Writes app/art/kit/<id>/0.svg (flat parts show one face in all four board
rotations) or <id>/m<mask>.svg for networks, plus app/kit-tile-manifest.js.
"""
import argparse, io, json, math, os, random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "app", "art", "kit")
KIT = os.path.join(ROOT, "tools", "city-kit.json")
MANIFEST = os.path.join(ROOT, "app", "kit-tile-manifest.js")

W, H = 64, 32                      # one ground tile
N, E, S, Wc = (32, 0), (64, 16), (32, 32), (0, 16)
C = (32, 16)
# edge midpoints toward each neighbour: +x, +y, -x, -y
EDGE = [(48, 24), (16, 24), (16, 8), (48, 8)]
DIAMOND = "M32 0L64 16L32 32L0 16Z"

T = {
    "ink": "#241a14", "cream": "#f3e6cd", "white": "#f7f1e4", "indigo": "#2f3d78",
    "turq": "#3fa89c", "water": "#4a86a8", "ochre": "#c07a2c", "marigold": "#efb34a",
    "gold": "#e6c15a", "vermilion": "#cf4a34", "earth": "#8a5a34", "leaf": "#4f8b46",
    "stone": "#b9a98c", "plum": "#6b4a63",
}


def mix(a, b, k):
    A = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    Bc = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#%02x%02x%02x" % tuple(int(round(A[i] + (Bc[i] - A[i]) * k)) for i in range(3))


def light(c, k=.18): return mix(c, "#ffffff", k)
def dark(c, k=.18):  return mix(c, T["ink"], k)


# id -> (base colour, grain style, accent)
TILES = {
    # --- ground -----------------------------------------------------------
    "gnd-plain":      (mix(T["ochre"], T["cream"], .52), "speck", T["leaf"]),
    "gnd-salt":       (T["white"], "crack", T["stone"]),
    "gnd-sand-river": (mix(T["cream"], T["ochre"], .30), "ripple", T["stone"]),
    "gnd-dune":       (mix(T["cream"], T["gold"], .32), "ripple", T["ochre"]),
    "gnd-black":      (mix(T["plum"], T["ink"], .40), "crack", T["earth"]),
    "gnd-laterite":   (mix(T["vermilion"], T["earth"], .55), "speck", T["ochre"]),
    "gnd-rock":       (T["stone"], "rock", T["cream"]),
    "gnd-scrub":      (mix(T["stone"], T["ochre"], .35), "tuft", T["leaf"]),
    "gnd-grass":      (mix(T["leaf"], T["gold"], .30), "tuft", T["leaf"]),
    "gnd-mud":        (mix(T["earth"], T["ink"], .22), "puddle", T["stone"]),
    "gnd-beach":      (mix(T["cream"], T["gold"], .18), "ripple", T["water"]),
    "gnd-forest":     (mix(T["leaf"], T["ink"], .38), "tuft", T["earth"]),
    "gnd-court":      (mix(T["cream"], T["stone"], .40), "swept", T["white"]),
    # --- crops ------------------------------------------------------------
    "cr-wheat":    (T["gold"], "rows", T["marigold"]),
    "cr-barley":   (mix(T["gold"], T["cream"], .32), "rows", T["gold"]),
    "cr-mustard":  (T["marigold"], "rows", T["gold"]),
    "cr-furrow":   (mix(T["earth"], T["ink"], .18), "furrow", T["ochre"]),
    "cr-paddy-wet":   (mix(T["water"], T["turq"], .40), "paddy", T["leaf"]),
    "cr-paddy-green": (T["leaf"], "paddy", T["turq"]),
    "cr-kitchen":  (mix(T["leaf"], T["earth"], .40), "beds", T["marigold"]),
    "cr-cotton":   (mix(T["leaf"], T["stone"], .45), "rows", T["white"]),
    "cr-threshing": (mix(T["cream"], T["ochre"], .38), "swept", T["gold"]),
    # --- water sheets -----------------------------------------------------
    "wa-sea":        (mix(T["water"], T["indigo"], .34), "wave", T["turq"]),
    "wa-surf":       (mix(T["turq"], T["white"], .30), "wave", T["white"]),
    "wa-backwater":  (mix(T["turq"], T["leaf"], .40), "wave", T["leaf"]),
    "wa-lagoon":     (mix(T["turq"], T["cream"], .28), "wave", T["white"]),
    "wa-lotus":      (mix(T["water"], T["leaf"], .30), "lotus", T["vermilion"]),
}

# networks: connection-mask pieces. (surface, edge, width, style)
NETS = {
    "rd-mud":    (mix(T["earth"], T["cream"], .42), T["earth"], 15, "rut"),
    "rd-brick":  (mix(T["vermilion"], T["stone"], .55), T["earth"], 15, "brick"),
    "rd-track":  (mix(T["earth"], T["cream"], .50), T["leaf"], 8, "rut"),
    "rd-stone":  (T["stone"], dark(T["stone"], .30), 16, "slab"),
    "rd-drain":  (mix(T["stone"], T["cream"], .30), T["earth"], 7, "slab"),
    "wa-river":  (mix(T["water"], T["turq"], .22), T["indigo"], 22, "flow"),
    "wa-canal":  (mix(T["water"], T["turq"], .35), T["leaf"], 9, "flow"),
    "wa-moat":   (mix(T["water"], T["indigo"], .30), T["stone"], 18, "flow"),
}

# A network piece carries NO ground of its own. It is laid over whatever the
# city's ground sheet already put there, so a brick street through Dholavira
# runs across salt and a brick street through Lothal runs across river silt,
# from one file. Baking a ground into the road was the bug that made every
# city's streets look like they had been cut out of a different picture.


def head(extra=""):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
            'width="%d" height="%d" shape-rendering="geometricPrecision"%s>'
            % (W, H, W, H, extra))


def clip(uid):
    return ('<defs><clipPath id="c%s"><path d="%s"/></clipPath></defs>'
            '<g clip-path="url(#c%s)">' % (uid, DIAMOND, uid))


def inside(x, y, m=1.0):
    """Point in the diamond, with a margin — keeps grain off the seam."""
    return abs(x - 32) / (32.0 - m) + abs(y - 16) / (16.0 - m / 2) <= 1.0


def grain(style, base, accent, rnd):
    """Detail that stops at the tile edge and repeats without a visible join:
    everything is clipped to the diamond and nothing crosses a corner."""
    o = []
    a = lambda s: o.append(s)
    if style == "speck":
        for _ in range(34):
            x, y = rnd.uniform(2, 62), rnd.uniform(1, 31)
            if inside(x, y, 2):
                a('<circle cx="%.1f" cy="%.1f" r="%.2f" fill="%s" opacity=".%d"/>'
                  % (x, y, rnd.uniform(.35, .9), rnd.choice([dark(base, .3), accent]),
                     rnd.randint(18, 45)))
    elif style == "crack":
        for _ in range(7):
            x, y = rnd.uniform(8, 56), rnd.uniform(4, 28)
            p = "M%.1f %.1f" % (x, y)
            for _ in range(3):
                x += rnd.uniform(-9, 9); y += rnd.uniform(-4, 4)
                p += "L%.1f %.1f" % (x, y)
            a('<path d="%s" fill="none" stroke="%s" stroke-width=".5" opacity=".33"/>'
              % (p, dark(base, .45)))
    elif style == "ripple":
        for i in range(9):
            y = 3 + i * 3.2 + rnd.uniform(-.6, .6)
            a('<path d="M2 %.1f Q32 %.1f 62 %.1f" fill="none" stroke="%s" '
              'stroke-width=".55" opacity=".26"/>' % (y, y + rnd.uniform(-1.6, 1.6), y,
                                                      light(base, .40)))
    elif style == "rock":
        for _ in range(6):
            x, y = rnd.uniform(8, 56), rnd.uniform(5, 27)
            rx, ry = rnd.uniform(4, 11), rnd.uniform(2, 5)
            a('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" opacity=".5"/>'
              % (x, y, rx, ry, rnd.choice([light(base, .22), dark(base, .18)])))
    elif style == "tuft":
        for _ in range(22):
            x, y = rnd.uniform(4, 60), rnd.uniform(3, 29)
            if inside(x, y, 2):
                a('<path d="M%.1f %.1f l-1.1 -2.4 M%.1f %.1f l0 -2.8 M%.1f %.1f l1.1 -2.4" '
                  'stroke="%s" stroke-width=".55" fill="none" opacity=".55"/>'
                  % (x, y, x, y, x, y, accent))
    elif style == "puddle":
        for _ in range(5):
            x, y = rnd.uniform(10, 54), rnd.uniform(6, 26)
            a('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" opacity=".38"/>'
              % (x, y, rnd.uniform(3, 8), rnd.uniform(1.4, 3), light(T["water"], .1)))
    elif style == "swept":
        for i in range(11):
            y = 2 + i * 2.7
            a('<path d="M4 %.1f Q32 %.1f 60 %.1f" fill="none" stroke="%s" '
              'stroke-width=".4" opacity=".22"/>' % (y, y - 1.1, y, dark(base, .25)))
    elif style in ("rows", "beds"):
        step = 3.0 if style == "rows" else 5.0
        n = int(30 / step) + 4
        for i in range(-2, n):
            y0 = i * step
            a('<path d="M0 %.1f L64 %.1f" stroke="%s" stroke-width="%.1f" '
              'opacity=".38"/>' % (y0, y0 + 16, dark(base, .30), .8 if style == "rows" else 1.4))
            a('<path d="M0 %.1f L64 %.1f" stroke="%s" stroke-width=".5" opacity=".30"/>'
              % (y0 + step / 2, y0 + step / 2 + 16, accent))
    elif style == "furrow":
        for i in range(-3, 14):
            y0 = i * 2.6
            a('<path d="M0 %.1f L64 %.1f" stroke="%s" stroke-width=".9" opacity=".45"/>'
              % (y0, y0 + 16, dark(base, .35)))
            a('<path d="M0 %.1f L64 %.1f" stroke="%s" stroke-width=".9" opacity=".30"/>'
              % (y0 + 30, y0 - 2, light(base, .25)))
    elif style == "paddy":
        a('<path d="%s" fill="none" stroke="%s" stroke-width="1.6" opacity=".55"/>'
          % (DIAMOND, mix(T["earth"], T["cream"], .35)))
        for i in range(6):
            y0 = 4 + i * 4.4
            a('<path d="M6 %.1f L58 %.1f" stroke="%s" stroke-width=".5" opacity=".4"/>'
              % (y0, y0 + 10, accent))
    elif style == "wave":
        for i in range(7):
            y = 3 + i * 4.0
            a('<path d="M1 %.1f q8 -1.6 16 0 t16 0 t16 0 t14 0" fill="none" '
              'stroke="%s" stroke-width=".7" opacity=".%d"/>'
              % (y, light(base, .38), rnd.randint(22, 40)))
    elif style == "brick_sheet":
        for i in range(-2, 13):
            y0 = i * 2.4
            a('<path d="M0 %.1f L64 %.1f" stroke="%s" stroke-width=".4" opacity=".38"/>'
              % (y0, y0 + 16, dark(base, .30)))
    elif style == "slab_sheet":
        for i in range(-2, 11):
            y0 = i * 3.4
            a('<path d="M0 %.1f L64 %.1f" stroke="%s" stroke-width=".45" opacity=".32"/>'
              % (y0, y0 + 16, dark(base, .28)))
    elif style == "lotus":
        for _ in range(5):
            x, y = rnd.uniform(12, 52), rnd.uniform(6, 26)
            a('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" opacity=".8"/>'
              % (x, y, rnd.uniform(2.2, 3.6), T["leaf"]))
        a('<circle cx="34" cy="15" r="1.7" fill="%s"/>' % accent)
    return "".join(o)


def tile_svg(pid, base, style, accent, v):
    rnd = random.Random(pid + "/" + str(v))
    uid = "%s%d" % (abs(hash(pid)) % 9973, v)
    return (head() + clip(uid)
            + '<path d="%s" fill="%s"/>' % (DIAMOND, base)
            + grain(style, base, accent, rnd)
            + '</g></svg>\n')


def band(a, b, w, fill, edge):
    """A road/water band from the tile centre to an edge midpoint."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    ln = math.hypot(dx, dy) or 1
    nx, ny = -dy / ln * w / 2.0, dx / ln * w / 2.0
    pts = [(a[0] + nx, a[1] + ny), (b[0] + nx, b[1] + ny),
           (b[0] - nx, b[1] - ny), (a[0] - nx, a[1] - ny)]
    p = "M" + "L".join("%.1f %.1f" % q for q in pts) + "Z"
    return ('<path d="%s" fill="%s"/>' % (p, fill),
            '<path d="%s" fill="none" stroke="%s" stroke-width=".9" opacity=".5"/>'
            % (p, edge))


def net_svg(pid, mask, v):
    surf, edge, w, style = NETS[pid]
    rnd = random.Random(pid + str(mask) + str(v))
    uid = "n%s%d%d" % (abs(hash(pid)) % 9973, mask, v)
    out = [head(), clip(uid)]
    fills, edges = [], []
    live = [i for i in range(4) if mask & (1 << i)]
    for i in live:
        f, e = band(C, EDGE[i], w, surf, edge)
        fills.append(f); edges.append(e)
    if not live:                                   # a lone patch, no neighbours
        fills.append('<ellipse cx="32" cy="16" rx="%.1f" ry="%.1f" fill="%s"/>'
                     % (w * .8, w * .4, surf))
    out += fills
    out.append('<ellipse cx="32" cy="16" rx="%.1f" ry="%.1f" fill="%s"/>'
               % (w * .62, w * .31, surf))
    out += edges
    if style == "rut":
        for k in (-1, 1):
            for i in live:
                a2 = (C[0] + k * 3.2, C[1] + k * 1.6)
                b2 = (EDGE[i][0] + k * 3.2, EDGE[i][1] + k * 1.6)
                out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" '
                           'stroke-width=".7" opacity=".38" fill="none"/>'
                           % (a2[0], a2[1], b2[0], b2[1], dark(surf, .35)))
    elif style == "brick":
        for i in range(-2, 12):
            y0 = i * 2.4
            out.append('<path d="M0 %.1f L64 %.1f" stroke="%s" stroke-width=".4" '
                       'opacity=".35"/>' % (y0, y0 + 16, dark(surf, .30)))
    elif style == "slab":
        for i in range(-2, 10):
            y0 = i * 3.4
            out.append('<path d="M0 %.1f L64 %.1f" stroke="%s" stroke-width=".45" '
                       'opacity=".30"/>' % (y0, y0 + 16, dark(surf, .28)))
    elif style == "flow":
        for _ in range(6):
            x, y = rnd.uniform(8, 56), rnd.uniform(5, 27)
            out.append('<path d="M%.1f %.1f q5 -1.4 10 0" fill="none" stroke="%s" '
                       'stroke-width=".65" opacity=".33"/>' % (x, y, light(surf, .40)))
    out.append("</g></svg>\n")
    return "".join(out)


NET_SHEET_STYLE = {"rd-mud": "speck", "rd-brick": "brick_sheet", "rd-track": "tuft",
                   "rd-stone": "slab_sheet", "rd-drain": "slab_sheet",
                   "wa-river": "wave", "wa-canal": "wave", "wa-moat": "wave"}


def surf_of(pid):  return NETS[pid][0]
def edge_of(pid):  return NETS[pid][1]
def style_of(pid): return NET_SHEET_STYLE.get(pid, "speck")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    args = ap.parse_args()
    man = {}
    n = 0
    for pid, (base, style, accent) in sorted(TILES.items()):
        if args.only and pid != args.only:
            continue
        d = os.path.join(ART, pid)
        os.makedirs(d, exist_ok=True)
        for v in range(3):                        # three jitters, so a field
            with io.open(os.path.join(d, "v%d.svg" % v), "w",   # is never stamped
                         encoding="utf-8") as f:
                f.write(tile_svg(pid, base, style, accent, v))
            n += 1
        for i in range(4):                        # flat: one face, four rotations
            with io.open(os.path.join(d, "%d.svg" % i), "w", encoding="utf-8") as f:
                f.write(tile_svg(pid, base, style, accent, 0))
        man[pid] = {"kind": "tile", "v": 3, "wh": [W, H]}
    for pid in sorted(NETS):
        if args.only and pid != args.only:
            continue
        d = os.path.join(ART, pid)
        os.makedirs(d, exist_ok=True)
        for mask in range(16):
            with io.open(os.path.join(d, "m%d.svg" % mask), "w", encoding="utf-8") as f:
                f.write(net_svg(pid, mask, 0))
            n += 1
        # A network part is also a SHEET: a river polygon is a body of water,
        # not a channel, and a paved square is a road with no direction. Same
        # surface, whole cell, so the two uses can never disagree in colour.
        for v in range(3):
            with io.open(os.path.join(d, "v%d.svg" % v), "w", encoding="utf-8") as f:
                f.write(tile_svg(pid, surf_of(pid), style_of(pid), edge_of(pid), v))
        for i in range(4):
            with io.open(os.path.join(d, "%d.svg" % i), "w", encoding="utf-8") as f:
                f.write(net_svg(pid, 5, 0))       # a straight run, for previews
        man[pid] = {"kind": "net", "masks": 16, "v": 3, "wh": [W, H]}
    with io.open(MANIFEST, "w", encoding="utf-8") as f:
        f.write("/* generated by tools/kit-tiles.py — do not edit.\n"
                "   tile: v0..v2 jitters. net: m0..m15, bits +x +y -x -y. */\n")
        f.write("window.IND_KIT_TILES = %s;\n" % json.dumps(man, sort_keys=True, indent=1))
    print("%d tile files, %d parts" % (n, len(man)))


if __name__ == "__main__":
    main()
