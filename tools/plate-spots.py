#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Where each building belongs on each city plate.

A granary standing on the street was the tell: the plots were a row along the
bottom edge, five identical slots, and nothing knew what a granary IS. This
reads the atlas already traced for every plate and works out an honest site
for each building from the painting's own geometry —

    granary   the middle of the largest field           (greens)
    workshop  the craft side, on a street off the centre
    gurukul   beside the plaza, where the town gathers
    bazaar    the middle of the longest street
    stepwell  the street closest to the water            (water)
    prakara   the outermost street — a rampart rings the town
    durg      just inside the gate

then relaxes them apart so no two crowd each other, none sits on the monument
and none hides under the four job stations. Re-runnable: it rewrites the
spots block in app/data-plates.js and leaves everything else alone.

    python3 tools/plate-spots.py
"""
import io, json, math, re, subprocess, os

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, "..", "app")
PATH = os.path.join(APP, "data-plates.js")

BUILDS = ["granary", "workshop", "gurukul", "bazaar", "stepwell", "prakara", "durg"]
STATIONS = [(8, 72), (88, 72), (8, 22), (88, 22)]     # the four job corners
MIN_APART, MIN_MON, MIN_STATION = 13.0, 16.0, 15.0
# the city camera sits at scale 1.22, so roughly a tenth of each edge can be
# out of frame at any moment: keep every building inside the band that stays
# visible however the camera has followed the yatri
BAND_X, BAND_Y = (16.0, 84.0), (24.0, 84.0)


def load():
    js = "global.window={};require(%s);process.stdout.write(JSON.stringify(window.IND_PLATES))" % json.dumps(PATH)
    return json.loads(subprocess.check_output(["node", "-e", js]).decode())


def centroid(poly):
    return (sum(p[0] for p in poly) / len(poly), sum(p[1] for p in poly) / len(poly))


def area(poly):
    a = 0.0
    for i in range(len(poly)):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % len(poly)]
        a += x1 * y2 - x2 * y1
    return abs(a) / 2


def road_points(a):
    return [tuple(p) for rd in a["roads"] for p in rd]


def free_roads(a):
    """Road points a building may actually stand on: not under the monument,
    not under the price label it hangs, and inside the camera's band."""
    mon = a["mon"]
    out = [p for p in road_points(a)
           if math.hypot(p[0] - mon[0], p[1] - mon[1]) >= MIN_MON
           and math.hypot(p[0] - mon[0], p[1] - (mon[1] + 16)) >= 14.0
           and BAND_X[0] <= p[0] <= BAND_X[1] and BAND_Y[0] <= p[1] <= BAND_Y[1]]
    return out or road_points(a)


def nearest_road(a, x, y):
    return min(free_roads(a), key=lambda p: math.hypot(p[0] - x, p[1] - y))


def nearest_road_to_poly(a, poly):
    """The street closest to a piece of water — measured to its EDGE, so a
    reservoir in the middle of the town does not drag the stepwell onto the
    monument; it puts it on the bank, which is where a stepwell goes."""
    return min(free_roads(a),
               key=lambda p: min(math.hypot(p[0] - q[0], p[1] - q[1]) for q in poly))


def longest_road(a):
    best, bl = a["roads"][0], -1
    for rd in a["roads"]:
        L = sum(math.hypot(rd[i][0] - rd[i-1][0], rd[i][1] - rd[i-1][1]) for i in range(1, len(rd)))
        if L > bl: bl, best = L, rd
    return best


def mid_of(rd):
    L = [0.0]
    for i in range(1, len(rd)):
        L.append(L[-1] + math.hypot(rd[i][0] - rd[i-1][0], rd[i][1] - rd[i-1][1]))
    half = L[-1] / 2
    for i in range(1, len(L)):
        if L[i] >= half:
            t = (half - L[i-1]) / max(0.001, L[i] - L[i-1])
            return (rd[i-1][0] + (rd[i][0] - rd[i-1][0]) * t,
                    rd[i-1][1] + (rd[i][1] - rd[i-1][1]) * t)
    return tuple(rd[len(rd)//2])


def spots_for(cid, a):
    mon, gate = a["mon"], a["gate"]
    plaza = a.get("plaza") or [mon[0], mon[1] + 20]
    greens = sorted(a.get("greens", []), key=area, reverse=True)
    water = sorted(a.get("water", []), key=area, reverse=True)
    s = {}
    s["granary"] = list(centroid(greens[0])) if greens else [plaza[0] - 22, plaza[1] + 6]
    s["workshop"] = list(nearest_road(a, mon[0] + 24, mon[1] + 16))
    s["gurukul"] = list(nearest_road(a, plaza[0] - 17, plaza[1] - 5))
    s["bazaar"] = list(mid_of(longest_road(a)))
    s["stepwell"] = list(nearest_road_to_poly(a, water[0])) if water else \
                    list(nearest_road(a, plaza[0] + 18, plaza[1] + 4))
    # a rampart and a fort are structures OF the street: snap both to one
    far = max(road_points(a), key=lambda p: math.hypot(p[0] - mon[0], p[1] - mon[1]))
    s["prakara"] = list(nearest_road(a, min(max(far[0], BAND_X[0]), BAND_X[1]),
                                        min(max(far[1], BAND_Y[0]), BAND_Y[1])))
    s["durg"] = list(nearest_road(a, gate[0] + 12, gate[1] - 9))

    # relax: nobody on the monument, nobody under a station, nobody on a neighbour
    for _ in range(160):
        moved = False
        for b in BUILDS:
            p = s[b]
            for other in BUILDS:
                if other == b: continue
                q = s[other]
                d = math.hypot(p[0] - q[0], p[1] - q[1])
                if d < MIN_APART:
                    ux, uy = ((p[0] - q[0]) / d, (p[1] - q[1]) / d) if d > 0.01 else (1, 0)
                    push = (MIN_APART - d) / 2
                    p[0] += ux * push; p[1] += uy * push
                    q[0] -= ux * push; q[1] -= uy * push
                    moved = True
            # the scaffold hangs its cost label under the monument — keep clear
            obstacles = [(mon[0], mon[1], MIN_MON), (mon[0], mon[1] + 16, 14.0)] + \
                        [(sx, sy, MIN_STATION) for sx, sy in STATIONS]
            for cx, cy, lim in obstacles:
                d = math.hypot(p[0] - cx, p[1] - cy)
                if d < lim:
                    ux, uy = ((p[0] - cx) / d, (p[1] - cy) / d) if d > 0.01 else (0, 1)
                    p[0] = cx + ux * lim; p[1] = cy + uy * lim
                    moved = True
            p[0] = max(BAND_X[0], min(BAND_X[1], p[0]))
            p[1] = max(BAND_Y[0], min(BAND_Y[1], p[1]))
        if not moved: break
    return {b: [round(s[b][0], 1), round(s[b][1], 1)] for b in BUILDS}


def main():
    P = load()
    src = io.open(PATH, encoding="utf-8").read()
    src = re.sub(r",\s*\n?\s*spots: \{[^}]*\}", "", src)      # idempotent re-run
    n = 0
    for cid in sorted(P):
        sp = spots_for(cid, P[cid])
        line = "    spots: " + json.dumps(sp) + " },"
        pat = re.compile(r"(  " + re.escape(json.dumps(cid)) + r": \{.*?\n    mon: [^\n]*?)( \},\n)", re.S)
        new, k = pat.subn(lambda m: m.group(1) + ",\n" + line + "\n", src)
        assert k == 1, cid
        src, n = new, n + 1
    io.open(PATH, "w", encoding="utf-8").write(src)
    print("plates given building sites:", n)


if __name__ == "__main__":
    main()
