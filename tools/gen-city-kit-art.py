#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""City Kit art — one MODEL SHEET per part, four turntable views in ONE image.

The whole point is the single image. A model asked four separate times for
"the same house, turned" gives four different houses: the roof pitch drifts,
a door appears, the ochre shifts a notch. Asked once for a 2x2 sheet of the
same object on a turntable, it draws them together and they agree, because
they are strokes of one picture. That is the same lesson the story films
paid for — a model with no scene cannot be trusted with a structural fact,
so the structure has to be inside one generation.

    export GEMKEY=...            # never hardcode, never print
    python3 tools/gen-city-kit-art.py --era 0-1 [--only id] [--jobs 5]
                                      [--print-prompt id] [--redo]

Reads tools/city-kit.json. Writes masters/city-kit/<id>.png (the sheet) and
app/art/kit/<id>/0..3.png (matted, trimmed, one per rotation), plus
app/kit-art-manifest.js. Parts marked 'tile' or 'code' are drawn by
tools/kit-tiles.py and app/kit.js instead — a model cannot make an edge
tile seamlessly or land a road connector on an exact grid edge.
"""
import argparse, base64, io, json, os, sys, threading, time, urllib.request
from collections import deque
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(ROOT, "tools", "city-kit.json")
OUT = os.path.join(ROOT, "app", "art", "kit")
MASTER = os.path.join(ROOT, "masters", "city-kit")
MANIFEST = os.path.join(ROOT, "app", "kit-art-manifest.js")
REF_DIR = os.path.join(ROOT, "app", "art", "sabhyata")
REFS = ["kashi.jpg", "lothal.jpg"]
DEFAULT_MODEL = "gemini-3.1-flash-image"
FACES = ["se", "sw", "nw", "ne"]      # turntable order, 90 degrees apart

# The locked palette. Every call carries it, or 143 parts drawn over two
# hours do not look like one kit and no amount of QA fixes it after.
PALETTE = ("#241a14 ink linework, #f3e6cd cream, #f7f1e4 warm white, "
           "#2f3d78 deep indigo, #3fa89c turquoise, #4a86a8 water blue, "
           "#c07a2c ochre, #efb34a marigold, #e6c15a gold, #cf4a34 vermilion, "
           "#8a5a34 earth brown, #4f8b46 leaf green, #b9a98c pale stone, "
           "#6b4a63 shadow plum")

STYLE = (
    "A painted Indian folk-art game piece — Madhubani and Pattachitra "
    "influence: fine dark ink linework drawn over FLAT areas of warm "
    "saturated colour, painted borders of leaf and flower and bird motifs "
    "where a real building would carry them, handmade-paper grain. Painted, "
    "not rendered — no airbrushed gradients, no cel-shaded cartoon, no 3D "
    "render. Use only this palette: "
    + PALETTE + ". "
)

SHEET = (
    "Draw a TURNTABLE MODEL SHEET: the SAME single object drawn FOUR times "
    "on a plain pure white background, arranged in an even 2x2 grid with "
    "generous white space between the four, nothing else in the image. The "
    "four are one object turned on a turntable in 90 degree steps — "
    "top-left is the front-right view, top-right is turned 90 degrees to "
    "the back-right view, bottom-left the back-left view, bottom-right the "
    "front-left view. All four are seen from the SAME high three-quarter "
    "angle looking down, like a board-game piece on a table, and all four "
    "are the SAME SIZE. They must agree in every detail: the same colours, "
    "the same roof, the same number of doors and windows and posts, the "
    "same load, the same wear. The light comes from the upper left in all "
    "four, so a face that is lit in one view is shaded when it turns away. "
    "Each of the four FLOATS on clean white with NOTHING beneath it: no "
    "ground, no grass, no base plate, no plinth that is not part of the "
    "object itself, and absolutely NO cast shadow — no grey or plum "
    "ellipse on the white under it, no contact shadow, no drop shadow. "
    "Shading belongs on the object's own faces only. No border, no grid "
    "lines, no labels, no text, no numerals, no arrows. The object: "
)


# A model asked for "a guard" in a kit full of buildings draws the gatehouse.
# Asked for "a street dog" it draws the crate the dog is on. The subject has
# to be fenced in, per category, or the piece comes back as architecture.
LONE = ("This is a FIGURE PIECE, not a building. Draw ONE single %s alone, "
        "whole from head to foot, filling the view, standing free on the white "
        "with NOTHING under or around them: no ground, no grass, no turf, no "
        "tile, no plinth, no base plate, no crate, no wall, no doorway, no "
        "stall, no building of any kind. Only what they wear and carry. ")

CAT_SHIM = {"fg": LONE % "person", "an": LONE % "animal"}

# Where the catalogue's line describes a role rather than a picture, or where
# the first sweep drew the wrong thing, the picture is spelled out here.
# ---------------------------------------------------------------------------
# HARAPPAN ARCHITECTURE, drawn from what excavation actually shows rather than
# from the generic "ancient Indian village" a model reaches for by default.
# The first pass gave era 0 conical thatch, curved tile roofs and painted
# floral bands with peacocks — an idiom a thousand years and a thousand miles
# away from the Indus cities. What the evidence gives instead:
#
#   * brick, standardised at a 4:2:1 ratio, laid in courses; baked brick where
#     water touches it, unbaked mud brick for most of a town, and dressed
#     stone at Dholavira, which had stone and no river clay
#   * FLAT roofs of wooden beams under reed matting and packed mud, with a low
#     parapet — never thatch, never tile, never a curve
#   * doors on the side lane rather than the street front, and few or no
#     windows outward: the courtyard is where light and air come from
#   * a stair to the roof, which is a room in its own right
#   * a bathing floor draining under the wall into a covered street drain
#   * wells of wedge-shaped brick cut for the curve, rope-worn at the rim
#   * no columns, no arches, no domes, no carved ornament, no painted bands,
#     and no temple: none has been identified
# Sources are listed in docs/19-harappan-architecture.md.
NO_LATER = ("Absolutely NO thatch, NO conical or curved or tiled roof, NO "
            "carved brackets, NO painted floral or peacock border bands, NO "
            "columns, NO arches, NO domes, NO temple spire, NO ornament of "
            "any kind. Every roof here is FLAT. ")

HARAPPAN = ("An Indus city building of about 2500 BCE: brick laid in neat "
            "courses of standardised bricks twice as long as they are wide "
            "and twice as wide as they are thick, plain mud-plastered wall "
            "faces, a FLAT roof of wooden beams carrying reed matting and "
            "packed mud with a low parapet round it. " + NO_LATER)

OVERRIDE = {
 "hs-har-court": HARAPPAN + "A courtyard house: rooms on all four sides of a small open central court, the plank door set on the SIDE lane rather than the street front, an outside staircase climbing to the flat roof, and a paved bathing floor in one corner with a channel running out under the wall. Pots and a reed mat on the roof.",
 "hs-har-room": HARAPPAN + "One small square house of plastered brick with a low parapet round its flat roof, a single low plank door, and no windows at all on the outside — only two small high vents. A water pot beside the door.",
 "hs-har-two": HARAPPAN + "A narrow two-storey brick house, the staircase built on the OUTSIDE of the wall climbing to a flat roof with a low parapet, pots and a rope cot on the roof, two small high vents and one plank door.",
 "hs-har-mud": HARAPPAN + "A small house of UNBAKED mud brick under thick mud plaster, its flat roof edged with a low mud parapet, a bundle of reeds and a broom leaning by the plank door. Plainer and browner than a baked-brick house.",
 "hs-har-stone": HARAPPAN + "A small house built in two clearly different "
   "materials: the whole LOWER HALF is large dressed STONE blocks, pale grey "
   "and fitted close with visible joints between them, and only the upper half "
   "is smaller brown mud brick, with a flat roof over that. The change from "
   "stone to brick must be obvious at a glance.",
 "bd-har-hall": HARAPPAN + "A massive raised platform built as a grid of separate rectangular brick blocks with open air channels running between them, carrying a plain timber hall with a flat roof above. No decoration whatsoever, no doors visible on the platform itself, a ramp at one end.",
 "bd-har-store": HARAPPAN + "A raised store: square blocks of mud brick standing clear of the ground with gaps between them, plain timber decking over, bales and sealed jars stacked on top under a flat reed-and-mud roof on posts.",
 "wa-har-well": (NO_LATER + "THIS IS NOT A BUILDING and it has no roof, no "
   "walls and no rooms. Draw a single round WELL-HEAD alone on bare ground: a "
   "low circular ring of brickwork about knee to waist high, built of "
   "wedge-shaped bricks cut to the curve so each course rings it exactly, open "
   "at the top so the dark water shows far down inside, the rim worn into deep "
   "grooves where ropes have run for generations. A coiled rope and a plain "
   "clay pot on the ground beside it. Nothing above it at all — open sky."),
 "bd-har-bead": HARAPPAN + "An open bead-maker's floor of brick: a low brick working platform, stone drills and a bow-drill on it, a small round brick furnace with a little smoke, and long orange carnelian beads laid out drying on a cloth.",
 "wl-har-wall": (NO_LATER + "THIS IS NOT A BUILDING and it has no rooms, no "
   "doors and no windows. Draw one straight SECTION of a thick city wall, cut "
   "off square at both ends as though sawn out of a much longer wall: mud brick "
   "faced with baked brick in visible courses, BATTERED so the face leans "
   "distinctly backward as it rises, the top flat and wide enough to walk "
   "along. Bare ground under it."),

 "fg-annadata": "A radiant elder farmer standing tall and proud, a great sheaf of golden wheat cradled in one arm, an overflowing basket of grain in the other hand, a marigold garland at the neck, white dhoti and shawl.",
 "fg-sthapati": "A master builder standing, a rolled palm-leaf plan under one arm, a plumb-line and a chisel held in the other hand, a tool sash at the waist, a folded turban.",
 "fg-acharya": "A white-bearded teacher standing, a bundle of palm-leaf manuscripts under one arm, a small lit brass oil lamp raised in the other hand, a white shawl over one shoulder.",
 "fg-guard": "A watchman standing at ease, a tall spear held upright in one hand, a small round shield on the other arm, indigo tunic and a bright waist sash, a folded turban.",
 "fg-mason": "A stonemason kneeling on one knee, a chisel held to the work in one hand and a wooden mallet raised in the other, a cloth twisted round the head.",
 "fg-boatman": "A boatman standing, a long bamboo pole held upright in both hands, dhoti tucked up at the knee, a cloth twisted round the head.",
 "fg-karigar": "An artisan sitting cross-legged, a painted clay pot resting on one knee, a small wooden mallet in the other hand, tools tucked in a red waist sash.",
 "fg-vendor": "A market seller sitting cross-legged behind nothing at all, one arm raised in welcome, a folded cloth on the shoulder, a small brass balance held in the other hand.",
 "fg-yatri": "A young traveller walking, a wooden staff in one hand, a small glowing brass oil lamp held up in the other, a cloth bundle tied on the back, an orange turban.",
 "an-buffalo": "A single black water buffalo standing, broad swept-back horns, head carried low, wet dark hide.",
 "an-dog": "A single tan street dog lying curled up asleep, nose to tail, one ear turned up.",
 "an-monkey": "A single grey langur sitting upright, long tail curled round, black face and hands, alert.",
 "an-cow": "A single humped white cow standing with a small calf close beside her, a bell on a red cord at her neck.",
 "an-goat": "Two goats standing close together, one white and one brown, short curved horns, one head turned.",
 "an-heron": "A single white egret standing on one leg, neck curved back, long yellow beak, feet lifted clear.",
 "bd-bazaar": "A market stall: a striped cloth awning on four bamboo poles, wide open on every side in every view, hanging brass balance scales, baskets of fruit and folded bright cloth on a plank counter.",
 "bd-workshop": "A potter's open-sided workshop: one thatched lean-to roof carried on bare posts with NO walls at all, open on every side in every view, a small brick kiln with a gentle flame under it, a shelf of painted pots, a low workbench.",
 "bd-stable": "An open byre: one long tiled roof on plain posts, no upper storey and no walls, iron tethering rings along a beam, a long fodder trough of stone.",
}

REF_NOTE = ("The attached paintings are finished pages from the same painted "
            "storybook: match their ink linework, palette and painted shading "
            "exactly — but paint only the model sheet described, on plain white. ")


# ---------------------------------------------------------------- selection
def load_kit():
    with io.open(KIT, encoding="utf-8") as f:
        return json.load(f)


TILE_CATS = {"ground", "road", "fx"}
TILE_WATER = {"wa-river", "wa-bank", "wa-sea", "wa-surf", "wa-backwater",
              "wa-lagoon", "wa-canal", "wa-channel", "wa-moat", "wa-lotus"}


def classify(p):
    """sheet = Gemini draws it; tile = procedural geometry, generated texture;
    code = pure code (overlays, shadows, lattices)."""
    pid, cat = p[0], p[2]
    if cat == "fx":
        return "code"
    if cat in TILE_CATS or pid in TILE_WATER or pid.startswith("cr-"):
        return "tile"
    return "sheet"


def in_era(p, lo, hi):
    a, b = [int(x) for x in p[4].split("-")]
    return not (b < lo or a > hi)


def needed(p, cities):
    used = p[6].lower()
    if "all" in used or "player" in used:
        return True
    return any(c in used for c in cities)


ERA_CITIES = {
    0: ["dholavira", "lothal", "rakhigarhi", "kalibangan"],
    1: ["hastinapura", "kashi", "ujjain", "vaishali"],
}


def select(kit, lo, hi):
    cities = [c for e in range(lo, hi + 1) for c in ERA_CITIES.get(e, [])]
    return [p for p in kit["parts"]
            if in_era(p, lo, hi) and needed(p, cities) and classify(p) == "sheet"]


# ---------------------------------------------------------------- prompting
def dims(p):
    L, B, H = p[3]
    f = lambda n: ("%g" % n)
    return ("It is %s units long, %s wide and %s tall, where one unit is four "
            "metres — draw it in those proportions. " % (f(L), f(B), f(H)))


# The house style asks for "painted borders of leaf and flower and bird motifs
# where a real building would carry them" — which is right for most of this kit
# and is precisely what put peacocks on a Harappan granary. An Indus building
# carried none, so these pieces get the same hand with that clause removed.
BARE_STYLE = STYLE.replace(
    "painted borders of leaf and flower and bird motifs "
    "where a real building would carry them, ",
    "no painted motifs or borders of any kind on the building itself, ")


def build_prompt(p):
    pid, name, cat, d, era, desc, used = p
    subject = OVERRIDE.get(pid) or (name + " — " + desc)
    shim = CAT_SHIM.get(pid.split("-")[0], "")
    style = BARE_STYLE if "-har-" in pid else STYLE
    return style + SHEET + shim + subject + " " + dims(p)


# ---------------------------------------------------------------- the model
_ref_lock = threading.Lock()
_refs = None


def ref_parts():
    global _refs
    with _ref_lock:
        if _refs is None:
            out = []
            for f in REFS:
                path = os.path.join(REF_DIR, f)
                if os.path.exists(path):
                    with open(path, "rb") as fh:
                        out.append({"inline_data": {
                            "mime_type": "image/jpeg",
                            "data": base64.b64encode(fh.read()).decode("ascii")}})
            _refs = out
    return _refs


def generate(prompt, key, model):
    parts = list(ref_parts())
    parts.append({"text": (REF_NOTE if parts else "") + prompt})
    body = json.dumps({
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"],
                             "imageConfig": {"aspectRatio": "1:1"}},
    }).encode()
    url = ("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s"
           % (model, key))
    last = None
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, data=body,
                                         headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=240) as r:
                out = json.load(r)
            for part in out["candidates"][0]["content"]["parts"]:
                blob = part.get("inlineData") or part.get("inline_data")
                if blob:
                    return base64.b64decode(blob["data"])
            raise RuntimeError("no image part in response")
        except Exception as e:
            last = e
            if attempt == 3:
                raise
            time.sleep(6 * (attempt + 1))
    raise last


# ---------------------------------------------------------------- matting
def matte(im, near=236):
    """White ground -> alpha, flooded from the edges so the subject keeps its
    own whites (a salt crust, a lime wall, a sail)."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()

    def white(x, y):
        r, g, b, a = px[x, y]
        return r >= near and g >= near and b >= near

    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if white(x, y) and not seen[y * w + x]:
                seen[y * w + x] = 1; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if white(x, y) and not seen[y * w + x]:
                seen[y * w + x] = 1; q.append((x, y))
    while q:
        x, y = q.popleft()
        px[x, y] = (255, 255, 255, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and white(nx, ny):
                seen[ny * w + nx] = 1; q.append((nx, ny))
    return im


def trim(im, pad=3):
    box = im.getbbox()
    if not box:
        return None
    box = (max(0, box[0] - pad), max(0, box[1] - pad),
           min(im.width, box[2] + pad), min(im.height, box[3] + pad))
    return im.crop(box)


def ink_ratio(im):
    a = im.getchannel("A")
    hist = a.histogram()
    return sum(hist[40:]) / float(im.width * im.height)


def split4(sheet):
    """Quadrants, matted and trimmed. Returns None if any quadrant is empty —
    that is the automated reject: the model drew three views, or one big one."""
    w, h = sheet.size
    out = []
    for (x0, y0) in ((0, 0), (w // 2, 0), (0, h // 2), (w // 2, h // 2)):
        q = sheet.crop((x0, y0, x0 + w // 2, y0 + h // 2))
        q = matte(q)
        if ink_ratio(q) < 0.012:
            return None
        q = trim(q)
        if q is None or q.width < 40 or q.height < 40:
            return None
        out.append(q)
    return out


SS, TILE_HALF, MAXW = 3, 32, 720


def save_faces(faces, pid, d3):
    """One scale for all four, so a turn never changes the piece's size —
    and that scale comes from the DECLARED footprint, not from the pixels
    the model happened to fill. A box L x B x H is (L+B) tile-halves wide
    across its base diamond, so that is what the widest view must measure.
    Without this a 1x1x1 hut and a 2x2x2 granary land the same size."""
    L, B, H = d3
    d = os.path.join(OUT, pid)
    os.makedirs(d, exist_ok=True)
    want = min(MAXW, max(96, (L + B) * TILE_HALF * SS))
    k = want / float(max(f.width for f in faces))
    for i, f in enumerate(faces):
        if abs(k - 1.0) > 0.01:
            f = f.resize((max(1, int(round(f.width * k))),
                          max(1, int(round(f.height * k)))), Image.LANCZOS)
        f.save(os.path.join(d, "%d.png" % i), "PNG", optimize=True)


# ---------------------------------------------------------------- manifest
def write_manifest():
    have = {}
    if os.path.isdir(OUT):
        for pid in sorted(os.listdir(OUT)):
            d = os.path.join(OUT, pid)
            if os.path.isdir(d):
                n = sum(1 for i in range(4) if os.path.exists(os.path.join(d, "%d.png" % i)))
                if n == 4:
                    im = Image.open(os.path.join(d, "0.png"))
                    have[pid] = [im.width, im.height]
    with io.open(MANIFEST, "w", encoding="utf-8") as f:
        f.write("/* generated by tools/gen-city-kit-art.py — do not edit.\n"
                "   id -> [w,h] of face 0; four faces exist for every entry. */\n")
        f.write("window.IND_KIT_ART = %s;\n" % json.dumps(have, sort_keys=True))
    print("manifest: %d parts with four faces" % len(have))
    return have


# ---------------------------------------------------------------- driver
def run_one(p, key, model, redo):
    pid = p[0]
    if not redo and os.path.exists(os.path.join(OUT, pid, "3.png")):
        return "skip", pid
    raw = generate(build_prompt(p), key, model)
    sheet = Image.open(io.BytesIO(raw)).convert("RGB")
    os.makedirs(MASTER, exist_ok=True)
    sheet.save(os.path.join(MASTER, pid + ".png"), "PNG")
    faces = split4(sheet)
    if faces is None:
        return "reject", pid
    save_faces(faces, pid, p[3])
    return "ok", pid


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--era", default="0-1")
    ap.add_argument("--only")
    ap.add_argument("--jobs", type=int, default=5)
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--redo", action="store_true")
    ap.add_argument("--print-prompt")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()

    kit = load_kit()
    lo, hi = [int(x) for x in args.era.split("-")]
    todo = select(kit, lo, hi)
    if args.only:
        todo = [p for p in kit["parts"] if p[0] == args.only]
    if args.print_prompt:
        p = [q for q in kit["parts"] if q[0] == args.print_prompt][0]
        print(build_prompt(p)); return
    if args.list:
        for p in todo:
            print(p[0], "\t", p[1])
        print(len(todo), "sheets")
        return

    key = os.environ.get("GEMKEY")
    if not key:
        sys.exit("GEMKEY not set")

    lock = threading.Lock()
    tally = {"ok": 0, "reject": 0, "skip": 0, "fail": 0}
    rejects = []
    q = deque(todo)

    def worker():
        while True:
            with lock:
                if not q:
                    return
                p = q.popleft()
            try:
                st, pid = run_one(p, key, args.model, args.redo)
            except Exception as e:
                st, pid = "fail", p[0]
                with lock:
                    print("  FAIL  %-20s %s" % (pid, str(e)[:110]))
            with lock:
                tally[st] += 1
                if st == "reject":
                    rejects.append(pid)
                if st != "skip":
                    print("  %-7s %-20s (%d/%d)" % (st, pid,
                          sum(tally.values()), len(todo)))

    ts = [threading.Thread(target=worker) for _ in range(max(1, args.jobs))]
    [t.start() for t in ts]
    [t.join() for t in ts]
    print("\n%s" % tally)
    if rejects:
        print("rejects (rerun with --redo --only <id>): " + " ".join(rejects))
    write_manifest()


if __name__ == "__main__":
    main()
