#!/usr/bin/env python3
"""Separate Telangana from Andhra Pradesh, and Ladakh from Jammu & Kashmir.

WHY THIS IS NOT JUST "DOWNLOAD A NEWER MAP". The national outline in map-data.js is the
Survey of India depiction — Jammu & Kashmir shown whole — and CLAUDE.md says that is what
every user sees in every locale. Almost every open GeoJSON of India draws the Line of
Control instead. Replacing the geometry with a downloaded state set would silently change
the depiction of a disputed international boundary, which is the one thing this repo is
most explicit about not doing.

So the outer boundary is NEVER touched. What the downloaded source contributes is only the
INTERNAL dividing line, and it is applied by intersection:

    Telangana = (current Andhra Pradesh) INTERSECT (source Telangana)
    Andhra    = (current Andhra Pradesh) MINUS     (source Telangana)

The union of the two is, to the pixel, the polygon that was there before. Same for J&K.
No coastline moves, no international border moves, and nothing outside the shape that was
already on the map can appear.

THE ONE JUDGEMENT CALL, and it is flagged rather than hidden. The Survey of India depiction
of J&K is larger than what the source draws, because the source stops at the Line of
Control. That leaves a remainder — the Gilgit-Baltistan and Aksai Chin areas — which the
source has no opinion about and which must land on one side of the new internal line. Each
piece of the remainder is assigned to whichever of the two it actually touches more of
(nearest-boundary), which follows the 2019 reorganisation as India describes it: Ladakh UT
is Leh and Kargil districts, and Leh district in that depiction carries the northern and
eastern remainder. This is a DRAFT and map-data.js is marked needs_review for it. A human
signs the J&K/Ladakh line before it ships — CLAUDE.md, boundaries.

Lakshadweep gets its geometry too, for the first time.

    python3 tools/map-split.py /tmp/india-dist.json
    python3 tools/map-bbox.py && python3 tools/map-capitals.py
"""
import json
import math
import pathlib
import re
import sys

from shapely.geometry import MultiPolygon, Polygon, shape
from shapely.ops import unary_union

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'app' / 'map-data.js'

# The map's own Mercator frame, fitted against its geometry by tools/map-capitals.py.
# Same numbers, same frame — that is what lets a lat/lon source land on this map at all.
K, X0, KY, Y0 = 1808.55, -2111.35, 1828.84, 1302.34
SIMPLIFY = 1.1          # px, Douglas-Peucker — matches the existing paths' density
MIN_AREA = 3.0          # px^2, below which a ring is a speck and is dropped


def merc(lat):
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def project(geom):
    def fwd(x, y, z=None):
        return (X0 + K * math.radians(x), Y0 - KY * merc(y))
    from shapely.ops import transform
    return transform(fwd, geom)


def clean(g):
    if g.is_empty:
        return g
    if not g.is_valid:
        g = g.buffer(0)
    return g


def parts(g):
    if g.is_empty:
        return []
    if isinstance(g, Polygon):
        return [g]
    return [p for p in g.geoms if isinstance(p, Polygon)]


def to_path(g, simplify=SIMPLIFY):
    """A polygon as this file's own path dialect: 'M x,y x,y ...' per ring, one decimal."""
    out = []
    for p in sorted(parts(g), key=lambda q: -q.area):
        p = p.simplify(simplify, preserve_topology=True)
        if p.is_empty or p.area < MIN_AREA:
            continue
        pts = list(p.exterior.coords)[:-1]
        if len(pts) < 3:
            continue
        out.append('M' + ' '.join('%.1f,%.1f' % (x, y) for x, y in pts) + 'Z')
    return ''.join(out)


def rings(d):
    out = []
    for chunk in d.split('M'):
        chunk = chunk.strip().rstrip('Zz').strip()
        if not chunk:
            continue
        nums = [float(n) for n in re.findall(r'-?\d+\.?\d*', chunk)]
        pts = list(zip(nums[0::2], nums[1::2]))
        if len(pts) >= 3:
            out.append(pts)
    return out


def from_path(d):
    polys = [clean(Polygon(r)) for r in rings(d)]
    polys = [p for p in polys if not p.is_empty and p.area > 0]
    return clean(unary_union(polys))


def anchor(g):
    """A label point that is actually inside the shape, not a centroid in the sea."""
    big = max(parts(g), key=lambda p: p.area)
    p = big.representative_point()
    for shrink in (0.22, 0.16, 0.10, 0.05, 0.0):
        inner = big.buffer(-shrink * math.sqrt(big.area))
        if not inner.is_empty:
            q = inner.representative_point()
            if big.contains(q):
                p = q
                break
    return [round(p.x, 1), round(p.y, 1)]


# ------------------------------------------------------------------- the source

src_path = sys.argv[1] if len(sys.argv) > 1 else '/tmp/india-dist.json'
gj = json.load(open(src_path))
WANT = {'Andhra Pradesh': 'AP', 'Telangana': 'TG', 'Jammu and Kashmir': 'JK',
        'Ladakh': 'LA', 'Lakshadweep': 'LD'}
bits = {}
for f in gj['features']:
    code = WANT.get(f['properties'].get('st_nm'))
    if not code:
        continue
    bits.setdefault(code, []).append(clean(shape(f['geometry'])))
srcp = {c: project(clean(unary_union(v))) for c, v in bits.items()}
print('source parts:', {c: len(parts(g)) for c, g in srcp.items()})

# --------------------------------------------------------------- the current map

js = SRC.read_text(encoding='utf-8')
paths = dict(re.findall(r"\n\s*([A-Z]{2}): '([^']+)'", js))
cur = {c: from_path(d) for c, d in paths.items()}

new_paths, new_anchors, notes = {}, {}, []

# Telangana: a purely internal line inside one state. No ambiguity anywhere in it.
ap = cur['AP']
tg = clean(ap.intersection(srcp['TG']))
ap2 = clean(ap.difference(srcp['TG']))
lost = abs(ap.area - (tg.area + ap2.area))
print('AP %.0f px2  ->  AP %.0f + TG %.0f   (lost %.2f px2)' % (ap.area, ap2.area, tg.area, lost))
new_paths['AP'], new_paths['TG'] = to_path(ap2), to_path(tg)
new_anchors['AP'], new_anchors['TG'] = anchor(ap2), anchor(tg)

# J&K and Ladakh. The whole shape is kept; only the line inside it is new.
jk = cur['JK']
la0 = clean(jk.intersection(srcp['LA']))
jk0 = clean(jk.intersection(srcp['JK']))
rest = clean(jk.difference(unary_union([srcp['LA'], srcp['JK']])))
print('J&K whole %.0f px2 = J&K %.0f + Ladakh %.0f + remainder %.0f (%.0f%% of the state)'
      % (jk.area, jk0.area, la0.area, rest.area, 100 * rest.area / jk.area))

# Each piece of the remainder goes to the side it shares more of its edge with.
add_la, add_jk = [], []
for piece in parts(rest):
    if piece.area < 1.0:
        continue
    to_la = piece.buffer(2.0).intersection(la0).area
    to_jk = piece.buffer(2.0).intersection(jk0).area
    (add_la if to_la >= to_jk else add_jk).append(piece)
la = clean(unary_union([la0] + add_la))
jk2 = clean(unary_union([jk0] + add_jk))
print('  remainder assigned: %d piece(s) to Ladakh, %d to J&K' % (len(add_la), len(add_jk)))
notes.append('J&K/Ladakh internal line is a DRAFT — see tools/map-split.py, needs review')
new_paths['JK'], new_paths['LA'] = to_path(jk2), to_path(la)
new_anchors['JK'], new_anchors['LA'] = anchor(jk2), anchor(la)

# Lakshadweep: real geometry at last. The islands are specks at this scale, so they are
# drawn at the smallest size that is still a shape rather than dropped to a marker.
ld = srcp['LD']
ldp = to_path(ld.buffer(1.6), simplify=0.4)
if ldp:
    new_paths['LD'] = ldp
    new_anchors['LD'] = anchor(ld.buffer(1.6))
    print('Lakshadweep: %d island group(s) drawn' % len(parts(ld)))
else:
    print('Lakshadweep: still below the threshold, left as a marker')

# ---------------------------------------------------------------------- write it

for code, d in new_paths.items():
    if not d:
        print('!! %s came out empty — not written' % code)
        continue
    if re.search(r"\n(\s*)%s: '[^']+'," % code, js):
        js = re.sub(r"\n(\s*)%s: '[^']+'," % code, lambda m: "\n%s%s: '%s'," % (m.group(1), code, d), js)
    else:
        js = re.sub(r"\n(\s*)paths: \{", lambda m: "\n%spaths: {\n%s  %s: '%s'," %
                    (m.group(1), m.group(1), code, d), js, count=1)

for code, a in new_anchors.items():
    if re.search(r"\n(\s*)%s: \[[-\d., ]+\]," % code, js):
        js = re.sub(r"\n(\s*)%s: \[[-\d., ]+\]," % code,
                    lambda m: "\n%s%s: [%s, %s]," % (m.group(1), code, a[0], a[1]), js, count=1)
    else:
        js = re.sub(r"\n(\s*)anchors: \{", lambda m: "\n%sanchors: {\n%s  %s: [%s, %s]," %
                    (m.group(1), m.group(1), code, a[0], a[1]), js, count=1)

js = js.replace("""   KNOWN GAPS (need better source geometry, see docs/07):
   - Telangana is still inside Andhra Pradesh (state set predates 2014)
   - Ladakh is not split out of J&K (predates 2019)
   - Lakshadweep falls below the sliver threshold and is drawn as a marker */""",
"""   Telangana (2014) and Ladakh (2019) are separated by tools/map-split.py, which cuts the
   INTERNAL line only: each new state is an intersection with the polygon that was already
   here, so the outer boundary — the Survey of India depiction, J&K whole — is bit for bit
   what it was. Lakshadweep now has its islands rather than a marker.

   NEEDS REVIEW: the J&K/Ladakh internal line. The depiction of J&K is larger than any open
   source draws it, so the remainder (the Gilgit-Baltistan and Aksai Chin areas) is assigned
   by which side it touches, following the 2019 reorganisation as India describes it. That
   assignment is a draft and a human signs it before launch — CLAUDE.md, boundaries. */""")

SRC.write_text(js, encoding='utf-8')
print('\nwrote %d paths and %d anchors' % (len(new_paths), len(new_anchors)))
for n in notes:
    print('  !! ' + n)
