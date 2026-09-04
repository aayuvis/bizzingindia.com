#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Plate grammar — the traced dioramas become grids the kit can build on.

app/data-plates.js already holds, for all 31 cities, the roads a walker may
use, the green ground, the water, the monument, the gate, the plaza and the
seven building sites, all hand-traced off the paintings in percent of the
plate. That geometry is the cities' actual shape and it would be daft to
throw it away and hand-author grids: this reads it and rasterises it onto the
2:1 board, so a composed Dholavira is still Dholavira.

Screen percent -> grid, for a 3/4 view: horizontal position is (gx - gy) and
vertical position is (gx + gy). Invert that pair and you have the cell.

    python3 tools/plate-to-grid.py [--only id] [--era 0-1]

Writes app/data-kit-cities.js.
"""
import argparse, io, json, math, os, random, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
OUT = os.path.join(APP, "data-kit-cities.js")
# A city is dense. The first board was 34x22 with 48 pieces on it and read as
# a car park with huts. Smaller board, far more on it.
GW, GH = 26, 18

# per city: base ground, green cover, water piece, road piece, house set, trees
CITY = {
 "dholavira":   ("gnd-salt", "gnd-scrub", "wa-river", "rd-brick",
                 ["hs-stone-low", "hs-mud-flat", "hs-mud-flat-2", "hs-harappan"],
                 ["tr-babul", "tr-palmyra"]),
 "lothal":      ("gnd-plain", "cr-wheat", "wa-river", "rd-brick",
                 ["hs-harappan", "hs-mud-flat", "hs-hut-rect"],
                 ["tr-palmyra", "tr-babul", "tr-tamarind"]),
 "rakhigarhi":  ("gnd-plain", "cr-wheat", "wa-canal", "rd-brick",
                 ["hs-hut-round", "hs-hut-pair", "hs-mud-flat", "hs-harappan"],
                 ["tr-peepal", "tr-babul", "tr-mango"]),
 "kalibangan":  ("gnd-sand-river", "cr-furrow", "wa-river", "rd-brick",
                 ["hs-mud-flat", "hs-raj-flat", "hs-hut-round"],
                 ["tr-babul", "tr-tamarind"]),
 "hastinapura": ("gnd-plain", "cr-wheat", "wa-river", "rd-mud",
                 ["hs-timber-hall", "hs-tile-court", "hs-hut-round", "hs-mud-flat"],
                 ["tr-mango", "tr-peepal", "tr-banyan"]),
 "kashi":       ("gnd-plain", "gnd-grass", "wa-river", "rd-stone",
                 ["hs-tile-court", "hs-mud-flat-2", "hs-mud-flat", "hs-hut-rect"],
                 ["tr-peepal", "tr-mango", "tr-tamarind"]),
 "ujjain":      ("gnd-plain", "cr-mustard", "wa-river", "rd-mud",
                 ["hs-tile-court", "hs-mud-flat", "hs-hut-rect", "hs-raj-flat"],
                 ["tr-tamarind", "tr-mango", "tr-babul"]),
 "vaishali":    ("gnd-grass", "cr-paddy-green", "wa-canal", "rd-mud",
                 ["hs-tile-court", "hs-hut-round", "hs-hut-pair", "hs-timber-hall"],
                 ["tr-mango", "tr-banyan", "tr-peepal"]),
}

# the site a plate calls X becomes the kit part it is built from
SPOT = {"granary": "bd-granary", "workshop": "bd-workshop", "gurukul": "bd-gurukul",
        "bazaar": "bd-bazaar", "stepwell": "bd-stepwell", "prakara": "wl-mud",
        "durg": "wl-keep"}

# what stands at the plate's monument point, per city
MON = {"dholavira": "wa-reservoir", "lothal": "wa-basin", "rakhigarhi": "bd-granary",
       "kalibangan": "cr-furrow", "hastinapura": "hs-timber-hall",
       "kashi": "rd-ghat", "ujjain": "bd-observatory", "vaishali": "bd-assembly"}

# a little life, placed on roads and greens
FOLK = ["fg-kisan", "fg-karigar", "fg-kathakar", "fg-rakshak", "fg-vendor",
        "fg-child", "fg-pilgrim", "fg-mason", "fg-porter", "fg-guard",
        "fg-boatman", "fg-weaver", "fg-teacher"]
BEASTS = ["an-ox", "an-goat", "an-dog", "an-cow", "an-buffalo", "an-monkey"]
# the small stuff that turns a model village into a place people live in
DRESS = ["pr-pots", "pr-baskets", "pr-fire", "pr-cloth-line", "pr-awning",
         "pr-sacks", "pr-plough", "pr-bench", "pr-wheel", "pr-loom",
         "cr-haystack", "wa-well", "bd-kiln", "pr-lamp-post"]
CARTS = ["vh-cart-bullock", "vh-handcart"]


def plates():
    js = subprocess.check_output(
        ["node", "-e",
         "global.window={};require('%s/data-plates.js');"
         "process.stdout.write(JSON.stringify(window.IND_PLATES))" % APP])
    return json.loads(js)


def to_cell(px, py):
    """percent of plate -> (gx, gy). u drives (gx-gy), v drives (gx+gy)."""
    u, v = (px - 50.0) / 50.0, (py - 50.0) / 50.0
    d = (GW - GH) / 2.0 + u * (GW + GH) / 2.0 * 0.86
    s = (v * 0.5 + 0.5) * (GW + GH) * 0.94 + (GW + GH) * 0.03
    gx, gy = (s + d) / 2.0, (s - d) / 2.0
    return (max(0, min(GW - 1, int(round(gx)))),
            max(0, min(GH - 1, int(round(gy)))))


def in_poly(pt, poly):
    x, y = pt
    inside = False
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / float(y2 - y1 + 1e-9) + x1:
            inside = not inside
    return inside


def cell_pct(gx, gy):
    """inverse of to_cell, for testing a cell against a traced polygon"""
    d, s = gx - gy, gx + gy
    u = (d - (GW - GH) / 2.0) / ((GW + GH) / 2.0 * 0.86)
    v = ((s - (GW + GH) * 0.03) / ((GW + GH) * 0.94) - 0.5) * 2.0
    return u * 50.0 + 50.0, v * 50.0 + 50.0


def build(cid, plate):
    base, green, water, road, houses, trees = CITY[cid]
    rnd = random.Random("kitcity/" + cid)
    ground = [[base] * GW for _ in range(GH)]
    roads = [[0] * GW for _ in range(GH)]
    taken = set()

    # --- water and green, tested per cell against the traced polygons -------
    for gy in range(GH):
        for gx in range(GW):
            px, py = cell_pct(gx, gy)
            if any(in_poly((px, py), poly) for poly in plate.get("water", [])):
                ground[gy][gx] = water
                taken.add((gx, gy))
            elif any(in_poly((px, py), poly) for poly in plate.get("greens", [])):
                ground[gy][gx] = green

    # --- roads: walk each traced polyline and mark the cells it crosses ----
    for line in plate.get("roads", []):
        for i in range(len(line) - 1):
            (x1, y1), (x2, y2) = line[i], line[i + 1]
            steps = int(max(abs(x2 - x1), abs(y2 - y1)) * 1.4) + 2
            for t in range(steps + 1):
                k = t / float(steps)
                c = to_cell(x1 + (x2 - x1) * k, y1 + (y2 - y1) * k)
                roads[c[1]][c[0]] = 1
                taken.add(c)

    objs = []

    def put(pid, gx, gy, f=0, span=1):
        for dx in range(span):
            for dy in range(span):
                taken.add((gx + dx, gy + dy))
        objs.append({"p": pid, "x": gx, "y": gy, "f": f})

    # --- the monument, the gate, the plaza --------------------------------
    if plate.get("mon"):
        c = to_cell(*plate["mon"]); put(MON[cid], c[0], c[1], rnd.randrange(4), 2)
    if plate.get("gate"):
        c = to_cell(*plate["gate"]); put("wl-gate", c[0], c[1], rnd.randrange(4), 2)
    for name, xy in (plate.get("spots") or {}).items():
        if name in SPOT:
            c = to_cell(*xy); put(SPOT[name], c[0], c[1], rnd.randrange(4), 2)

    # --- houses along the roads, which is where houses actually stand ------
    road_cells = [(x, y) for y in range(GH) for x in range(GW) if roads[y][x]]
    rnd.shuffle(road_cells)
    wet = set((x, y) for y in range(GH) for x in range(GW)
              if ground[y][x] == water)

    def free(sx, sy, span=2):
        if not (0 <= sx <= GW - span and 0 <= sy <= GH - span):
            return False
        for a in range(span):
            for b in range(span):
                c = (sx + a, sy + b)
                if c in taken or c in wet or roads[c[1]][c[0]]:
                    return False
        return True

    n = 0
    for (x, y) in road_cells:                 # first ring: fronting a street
        if n >= 44:
            break
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1),
                       (1, 1), (-1, -1), (1, -1), (-1, 1)):
            if free(x + dx, y + dy):
                put(rnd.choice(houses), x + dx, y + dy, rnd.randrange(4), 2)
                n += 1
                break
    for (x, y) in road_cells:                 # second ring: the lane behind
        if n >= 62:
            break
        for dx, dy in ((2, 0), (-2, 0), (0, 2), (0, -2), (2, 2), (-2, -2)):
            if free(x + dx, y + dy):
                put(rnd.choice(houses), x + dx, y + dy, rnd.randrange(4), 2)
                n += 1
                break

    # --- trees on the green, animals and folk and clutter on the streets ---
    green_cells = [(x, y) for y in range(GH) for x in range(GW)
                   if ground[y][x] == green and (x, y) not in taken and (x, y) not in wet]
    rnd.shuffle(green_cells)
    for (x, y) in green_cells[:26]:
        put(rnd.choice(trees), x, y, rnd.randrange(4))
    open_cells = [(x, y) for y in range(GH) for x in range(GW)
                  if (x, y) not in taken and (x, y) not in wet and not roads[y][x]]
    rnd.shuffle(open_cells)
    for (x, y) in open_cells[:22]:            # yards: pots, fires, drying cloth
        put(rnd.choice(DRESS), x, y, rnd.randrange(4))
    for (x, y) in green_cells[26:34]:
        put(rnd.choice(trees), x, y, rnd.randrange(4))
    for (x, y) in road_cells[:20]:            # people go on the road, only
        objs.append({"p": rnd.choice(FOLK), "x": x, "y": y, "f": rnd.randrange(4)})
    for (x, y) in road_cells[20:29]:
        objs.append({"p": rnd.choice(BEASTS), "x": x, "y": y, "f": rnd.randrange(4)})
    for (x, y) in road_cells[29:33]:
        objs.append({"p": rnd.choice(CARTS), "x": x, "y": y, "f": rnd.randrange(4)})

    # --- road masks: a piece connects to whichever neighbours are road ----
    net = []
    for y in range(GH):
        for x in range(GW):
            if not roads[y][x]:
                continue
            m = 0
            if x + 1 < GW and roads[y][x + 1]: m |= 1
            if y + 1 < GH and roads[y + 1][x]: m |= 2
            if x - 1 >= 0 and roads[y][x - 1]: m |= 4
            if y - 1 >= 0 and roads[y - 1][x]: m |= 8
            net.append([x, y, m])

    # ground compresses to one char per cell
    legend, chars = {}, []
    for row in ground:
        line = ""
        for pid in row:
            if pid not in legend:
                legend[pid] = "abcdefghijklmnop"[len(legend)]
            line += legend[pid]
        chars.append(line)
    # --- the shore: which edges of a water cell face dry land -------------
    shore = []
    for y in range(GH):
        for x in range(GW):
            if ground[y][x] != water:
                continue
            m = 0
            if x + 1 >= GW or ground[y][x + 1] != water: m |= 1
            if y + 1 >= GH or ground[y + 1][x] != water: m |= 2
            if x - 1 < 0 or ground[y][x - 1] != water: m |= 4
            if y - 1 < 0 or ground[y - 1][x] != water: m |= 8
            if m:
                shore.append([x, y, m])

    return {"gw": GW, "gh": GH, "road": road, "shore": shore,
            "legend": {v: k for k, v in legend.items()},
            "ground": chars, "net": net, "objs": objs}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    args = ap.parse_args()
    pl = plates()
    out = {}
    for cid in sorted(CITY):
        if args.only and cid != args.only:
            continue
        if cid not in pl:
            print("  no plate for", cid); continue
        out[cid] = build(cid, pl[cid])
        c = out[cid]
        print("  %-13s %3d road, %3d shore, %3d pieces"
              % (cid, len(c["net"]), len(c["shore"]), len(c["objs"])))
    with io.open(OUT, "w", encoding="utf-8") as f:
        f.write("/* generated by tools/plate-to-grid.py from data-plates.js —\n"
                "   the traced dioramas rasterised onto the 2:1 kit board.\n"
                "   ground: one char per cell, decoded by legend. net: [x,y,mask],\n"
                "   mask bits 1 +x, 2 +y, 4 -x, 8 -y. Do not edit by hand. */\n")
        f.write("window.IND_KIT_CITIES = %s;\n"
                % json.dumps(out, sort_keys=True, separators=(",", ":")))
    print("%d cities -> %s" % (len(out), OUT))


if __name__ == "__main__":
    main()
