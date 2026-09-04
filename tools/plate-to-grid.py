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
# The board is the LAND, not the city. What this file lays down is only what
# the land gives you for nothing — its ground, its water, its streets and the
# trees already growing on it. Every building on top is bought and placed by
# the child, so a city starts as a place and becomes a city.
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

    objs = []            # what the land already has: nothing you built
    wild = []            # free scenery — trees on the green, rock on the rock

    def put(pid, gx, gy, f=0, span=1):
        for dx in range(span):
            for dy in range(span):
                taken.add((gx + dx, gy + dy))
        wild.append({"p": pid, "x": gx, "y": gy, "f": f})

    # --- trees where trees grow, and nowhere else ------------------------
    wet = set((x, y) for y in range(GH) for x in range(GW)
              if ground[y][x] == water)
    green_cells = [(x, y) for y in range(GH) for x in range(GW)
                   if ground[y][x] == green and (x, y) not in wet
                   and not roads[y][x]]
    rnd.shuffle(green_cells)
    for (x, y) in green_cells[:18]:
        put(rnd.choice(trees), x, y, rnd.randrange(4))

    # --- the heart the buildable land grows out from ----------------------
    # NOT the monument. Dholavira's monument is a reservoir and Lothal's is a
    # dock: put the heart on the monument and a new city has nowhere to build
    # anything at all. The heart is the buildable cell with the most free land
    # around it, nudged toward the monument so a city still grows where its
    # great work is.
    mon = to_cell(*plate["mon"]) if plate.get("mon") else (GW // 2, GH // 2)
    gate = to_cell(*plate["gate"]) if plate.get("gate") else None

    def free_at(x, y):
        return (0 <= x < GW and 0 <= y < GH and (x, y) not in wet
                and not roads[y][x] and (x, y) not in taken)

    def room(x, y, r=6):
        n = 0
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                if abs(dx) + abs(dy) <= r and free_at(x + dx, y + dy):
                    n += 1
        return n

    best, bestScore = mon, -1
    for y in range(GH):
        for x in range(GW):
            if not free_at(x, y):
                continue
            d = abs(x - mon[0]) + abs(y - mon[1])
            score = room(x, y) - d * 1.5      # room first, nearness second
            if score > bestScore:
                best, bestScore = (x, y), score
    centre = best

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

    return {"gw": GW, "gh": GH, "road": road, "shore": shore,
            "centre": list(centre), "gate": (list(gate) if gate else None),
            "wild": wild,
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
        # prove the city is buildable before anyone opens it
        cx, cy = c["centre"]
        wet2 = set()
        for yy in range(c["gh"]):
            for xx in range(c["gw"]):
                if c["legend"][c["ground"][yy][xx]].startswith("wa-"):
                    wet2.add((xx, yy))
        rd = set((n[0], n[1]) for n in c["net"])
        occ = set()
        for o in c["wild"]:
            occ.add((o["x"], o["y"]))
        n1 = sum(1 for yy in range(c["gh"]) for xx in range(c["gw"])
                 if abs(xx - cx) + abs(yy - cy) <= 7
                 and (xx, yy) not in wet2 and (xx, yy) not in rd and (xx, yy) not in occ)
        flag = "" if n1 >= 20 else "   <-- TOO TIGHT"
        print("  %-13s %3d road, %3d shore, %3d wild, heart %-8s %3d free at lv1%s"
              % (cid, len(c["net"]), len(c["shore"]), len(c["wild"]),
                 str(c["centre"]), n1, flag))
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
