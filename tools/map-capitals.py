#!/usr/bin/env python3
"""Place every state capital on the map, in the map's own coordinates.

WHY: the map now says "remembered" with a dot on the capital instead of by taking the
mist off a whole state, so the dot has to actually be where the city is. Guessing a
pixel per city by eye is how a child learns Bhopal is in the wrong place.

HOW: the map is a Mercator frame, so a city's position is a closed-form function of its
latitude and longitude — x is linear in longitude, y is linear in ln(tan(45 + lat/2)).
The four constants of that function are FITTED from the geometry already in map-data.js
rather than assumed: we minimise, over all capitals at once, how far each projected city
falls outside its own state's polygon. A capital is inside its state; that is what makes
it a capital. Thirty-five of those constraints pin the projection down tightly.

Then every point is checked against its own polygon, and the result is written back into
map-data.js as M.capitals. If a point still lands just outside its state (a city on a
river border, drawn against a simplified boundary), it is snapped to the nearest point
inside and the snap distance is reported — a snap of a pixel or two is the boundary
simplification, a snap of twenty is a wrong coordinate and should be fixed at source.

Run after any change to the state geometry.
"""
import math
import pathlib
import re

from shapely.geometry import MultiPolygon, Point, Polygon
from shapely.ops import nearest_points

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'app' / 'map-data.js'

# Capital cities, with the coordinates of the city itself. Where a state's capital sits
# outside it (Chandigarh administers Punjab and Haryana from a union territory of its own)
# the city is still the right answer to "what is the capital", and the dot is snapped onto
# the state it belongs to below.
CAPITALS = {
    'AN': ('Port Blair', 11.623, 92.726),
    'AP': ('Amaravati', 16.515, 80.518),
    'AR': ('Itanagar', 27.084, 93.605),
    'AS': ('Dispur', 26.135, 91.800),
    'BR': ('Patna', 25.594, 85.137),
    'CH': ('Chandigarh', 30.741, 76.768),
    'CT': ('Raipur', 21.251, 81.629),
    'DD': ('Daman', 20.397, 72.832),
    'DL': ('New Delhi', 28.614, 77.209),
    'DN': ('Silvassa', 20.273, 73.008),
    'GA': ('Panaji', 15.498, 73.828),
    'GJ': ('Gandhinagar', 23.223, 72.650),
    'HP': ('Shimla', 31.104, 77.173),
    'HR': ('Chandigarh', 30.741, 76.768),
    'JH': ('Ranchi', 23.344, 85.310),
    'JK': ('Srinagar', 34.084, 74.797),
    'KA': ('Bengaluru', 12.972, 77.594),
    'KL': ('Thiruvananthapuram', 8.524, 76.937),
    'LD': ('Kavaratti', 10.567, 72.642),
    'MH': ('Mumbai', 19.076, 72.878),
    'ML': ('Shillong', 25.579, 91.893),
    'MN': ('Imphal', 24.817, 93.938),
    'MP': ('Bhopal', 23.260, 77.413),
    'MZ': ('Aizawl', 23.727, 92.718),
    'NL': ('Kohima', 25.676, 94.110),
    'OR': ('Bhubaneswar', 20.296, 85.825),
    'PB': ('Chandigarh', 30.741, 76.768),
    'PY': ('Puducherry', 11.934, 79.830),
    'RJ': ('Jaipur', 26.912, 75.787),
    'SK': ('Gangtok', 27.339, 88.606),
    'TN': ('Chennai', 13.083, 80.270),
    'TR': ('Agartala', 23.831, 91.286),
    'UK': ('Dehradun', 30.317, 78.032),
    'UP': ('Lucknow', 26.847, 80.947),
    'WB': ('Kolkata', 22.573, 88.364),
    'TG': ('Hyderabad', 17.385, 78.487),
    'LA': ('Leh', 34.164, 77.585),
}


def merc(lat):
    lat = max(-85.0, min(85.0, lat))
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


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


def shape(d):
    polys = []
    for r in rings(d):
        p = Polygon(r)
        if not p.is_valid:
            p = p.buffer(0)
        if not p.is_empty and p.area > 0:
            polys.append(p)
    if not polys:
        return None
    if len(polys) == 1:
        return polys[0]
    return MultiPolygon([g for p in polys
                         for g in (p.geoms if isinstance(p, MultiPolygon) else [p])])


src = SRC.read_text(encoding='utf-8')
paths = dict(re.findall(r"\n\s*([A-Z]{2}): '([^']+)'", src))
shapes = {c: shape(d) for c, d in paths.items()}
shapes = {c: s for c, s in shapes.items() if s is not None}

# Chandigarh is a few pixels across at this scale and Delhi barely bigger; fitting against
# them would let two tiny polygons outvote the subcontinent. They are still WRITTEN, just
# not used to fit.
FIT_SKIP = {'CH', 'DL', 'DD', 'DN', 'PY', 'LD'}
fit = [(c, lat, lon) for c, (_, lat, lon) in CAPITALS.items()
       if c in shapes and c not in FIT_SKIP]


def cost(k, x0, ky, y0):
    """Total distance by which the projected capitals fall outside their own states."""
    total = 0.0
    for c, lat, lon in fit:
        p = Point(x0 + k * math.radians(lon), y0 - ky * merc(lat))
        total += shapes[c].distance(p) ** 2
    return total


# Seed from the frame's own extent — India's west and east ends and its northern and
# southern tips are the corners of the drawn geometry — then refine by coordinate descent.
xs, ys = [], []
for d in paths.values():
    n = [float(v) for v in re.findall(r'-?\d+\.?\d*', d)]
    xs += n[0::2]
    ys += n[1::2]
k = (max(xs) - min(xs)) / math.radians(97.42 - 68.03)
x0 = min(xs) - k * math.radians(68.03)
ky = (max(ys) - min(ys)) / (merc(37.08) - merc(6.75))
y0 = min(ys) + ky * merc(37.08)

best = cost(k, x0, ky, y0)
step = [k * 0.04, 30.0, ky * 0.04, 30.0]
for _ in range(400):
    moved = False
    for i in range(4):
        for sign in (1, -1):
            trial = [k, x0, ky, y0]
            trial[i] += sign * step[i]
            v = cost(*trial)
            if v < best - 1e-9:
                best, (k, x0, ky, y0), moved = v, trial, True
                break
    if not moved:
        step = [s / 2 for s in step]
        if max(step[0] / k, step[2] / ky, step[1] / 400, step[3] / 400) < 1e-6:
            break

print('projection: x = %.2f + %.2f*lon(rad)   y = %.2f - %.2f*merc(lat)' % (x0, k, y0, ky))
print('residual (px^2 outside own state, %d fitted): %.2f' % (len(fit), best))

# A snap of a few pixels is the boundary simplification pulling a riverside city just
# outside its own outline. A snap of tens of pixels means the geometry does not contain
# the city at all — the Daman & Diu path in this data is Diu alone, and Daman is 2 degrees
# up the coast — and a dot labelled Daman sitting on Diu teaches a child the wrong place.
# Those are dropped and reported rather than drawn.
SNAP_LIMIT = 8.0

out, snapped, dropped = {}, [], []
for c in sorted(CAPITALS):
    name, lat, lon = CAPITALS[c]
    p = Point(x0 + k * math.radians(lon), y0 - ky * merc(lat))
    s = shapes.get(c)
    d = 0.0
    if s is not None and not s.contains(p):
        d = s.distance(p)
        if d > SNAP_LIMIT:
            dropped.append((c, name, d))
            continue
        inner = s.buffer(-1.2)
        p = nearest_points(s if inner.is_empty else inner, p)[0]
        snapped.append((c, name, d))
    out[c] = (round(p.x, 1), round(p.y, 1), name)

for c, name, d in sorted(snapped, key=lambda t: -t[2]):
    print('  snapped %-3s %-22s %5.1f px' % (c, name, d))
for c, name, d in sorted(dropped, key=lambda t: -t[2]):
    print('  DROPPED %-3s %-22s %5.1f px outside its own geometry' % (c, name, d))

block = 'capitals: {\n' + ',\n'.join(
    "    %s: [%s, %s, '%s']" % (c, out[c][0], out[c][1], out[c][2].replace("'", "\\'"))
    for c in sorted(out)) + '\n  },\n  '

if 'capitals: {' in src:
    src = re.sub(r'capitals: \{.*?\n  \},\n  ', block, src, flags=re.S)
else:
    src = src.replace('  anchors: {', '  ' + block + 'anchors: {', 1)
SRC.write_text(src, encoding='utf-8')
print('wrote %d capitals into %s' % (len(out), SRC.name))
