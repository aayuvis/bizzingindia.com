#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ground fields — painted terrain, not procedural fill.

The first board failed on its ground: flat colour with a speckle, laid beside
painted pieces, reads as graph paper someone coloured in. This paints each
terrain as ONE LARGE FIELD, and the board then shows each cell a different
part of that one field, offset by where the cell sits. Adjacent cells of the
same terrain are therefore continuous by construction — there is no tile to
repeat and no seam to hide, and the trick costs one image per terrain instead
of a seamless-tiling problem no image model can solve.

    export GEMKEY=...
    python3 tools/gen-kit-ground.py [--only id] [--jobs 4]

Writes app/art/kit/_ground/<id>.jpg (1024 square) and app/kit-ground-manifest.js.
"""
import argparse, base64, io, json, os, sys, threading, time, urllib.request
from collections import deque
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "app", "art", "kit", "_ground")
MANIFEST = os.path.join(ROOT, "app", "kit-ground-manifest.js")
REF_DIR = os.path.join(ROOT, "app", "art", "sabhyata")
REFS = ["lothal.jpg"]
DEFAULT_MODEL = "gemini-3.1-flash-image"
SIZE, Q = 1024, 82

PALETTE = ("#241a14 ink, #f3e6cd cream, #f7f1e4 warm white, #2f3d78 indigo, "
           "#3fa89c turquoise, #4a86a8 water blue, #c07a2c ochre, #efb34a marigold, "
           "#e6c15a gold, #cf4a34 vermilion, #8a5a34 earth brown, #4f8b46 leaf green, "
           "#b9a98c pale stone, #6b4a63 shadow plum")

# Ground is BACKGROUND. Asked for "folk art" it comes back as a carpet —
# paisley, flower borders, medallions — and a carpet under a city reads as a
# carpet. The style note here is deliberately anti-decorative: the folk hand
# shows in the mark-making and the palette, never in a motif.
STYLE = ("A quiet painted ground texture for a game board. Hand-painted marks, "
         "handmade-paper grain, warm muted colour, painted not rendered. It is "
         "BACKGROUND: almost plain, low contrast, dusty and desaturated, so that "
         "objects placed on top of it stay readable. Absolutely NO ornament: no "
         "motifs, no paisley, no flowers, no medallions, no borders, no mandalas, "
         "no repeating decorative pattern, no figures, no animals, no buildings. "
         "Only the marks the bare ground itself would have. "
         "Seen from DIRECTLY ABOVE, flat on, filling "
         "the whole square edge to edge with no border, no frame, no vignette, no "
         "horizon, no sky, no buildings, no people, no text. Even lighting across "
         "the whole square with no bright spot and no dark corner, so it can be "
         "cut up and reassembled. Use only this palette: " + PALETTE + ". "
         "The ground is: ")

GROUND = {
 "gnd-salt": "a white salt flat, the crust broken into large pale polygons by hairline cracks, a faint blush of ochre in the hollows",
 "gnd-plain": "dry pale ochre river earth, finely speckled, with a scatter of tiny grass tufts and small stones",
 "gnd-sand-river": "warm pale river sand raked into long soft ripples, a few dark pebbles",
 "gnd-scrub": "dusty grey-green thorn scrub ground, thin dry grass, scattered small stones and low thorn bushes seen from above",
 "gnd-grass": "green common grass going gold at the tips, cropped short, small clover patches",
 "gnd-rock": "bare grey granite sheet, wide shallow curved cracks, faint lichen in gold and pale green",
 "gnd-mud": "dark churned wet earth, hoof marks and cart ruts, a few shallow puddles catching light",
 "gnd-court": "a swept courtyard of beaten pale earth, faint broom arcs across it, edged with a thin line of small stones",
 # EVERY CITY GROWS ITS OWN, and the rows must be FINE. One cell of the board
 # shows about a fifth of this square, so a painting with six fat plants across
 # it puts one plant in a whole diamond and reads as a blob. Twenty-five thin
 # rows across the square is roughly four rows to a cell, which is a field.
 "cr-wheat": "a VERY WIDE view from high above of a field of ripe wheat, at least twenty-five thin parallel rows crossing the whole square, sown in distinct parallel rows with dark furrow lines between them, the heads heavy and slightly separate so the rows read as rows, a low earth bund along one edge, dry gold going pale where the light catches",
 "cr-barley": "a VERY WIDE view from high above of a barley field, at least twenty-five thin parallel rows crossing the whole square,  sown in parallel rows with furrows between, paler and shorter than wheat with long fine awns catching light, a low earth bund at one edge",
 "cr-millet": "a VERY WIDE view from high above of a bajra millet field, at least twenty-five thin parallel rows crossing the whole square,  sturdy blue-green plants in wide-spaced rows with bare earth showing between them, thick seed heads standing up, a low earth bund at one edge",
 "cr-cotton": "a VERY WIDE view from high above of a cotton field, at least twenty-five thin parallel rows crossing the whole square,  grey-green bushes in even rows with dark earth between, white bolls open on the branches, a low earth bund at one edge",
 "cr-sugarcane": "a VERY WIDE view from high above of a sugarcane field, at least twenty-five thin parallel rows crossing the whole square,  tall dense green cane planted in long parallel rows with narrow dark channels between them, leaf tips fanning out",
 "cr-sesame": "a VERY WIDE view from high above of a sesame field, at least twenty-five thin parallel rows crossing the whole square,  low bushy plants in neat rows with pale earth between, small white and pink flowers along the stems, a low earth bund at one edge",
 "cr-gram": "a VERY WIDE view from high above of a chana gram field, at least twenty-five thin parallel rows crossing the whole square,  low bushy blue-green plants in close rows on dark earth, small pods along the stems, a low earth bund at one edge",
 "cr-mustard": "a VERY WIDE view from high above of a mustard field, at least twenty-five thin parallel rows crossing the whole square,  sown in parallel rows with green stems visible between, hard yellow flower heads on top, a low earth bund at one edge",
 "cr-furrow": "a ploughed field of dark earth raked into long criss-crossing furrows in two directions, a lattice of ridges",
 "cr-paddy-green": "a VERY WIDE view from high above of a rice paddy, at least twenty-five thin rows of shoots crossing the whole square, bright emerald shoots planted in distinct rows in shallow water that shows between them, low earth bunds dividing the field into small rectangles",
 "wa-river": "slow river water, deep green-blue, long soft current threads and a few slow eddies, no bank and no shore",
 "wa-sea": "open sea water, deep blue-green, a long even swell",
}


def ref_parts():
    out = []
    for f in REFS:
        p = os.path.join(REF_DIR, f)
        if os.path.exists(p):
            with open(p, "rb") as fh:
                out.append({"inline_data": {"mime_type": "image/jpeg",
                            "data": base64.b64encode(fh.read()).decode("ascii")}})
    return out


def generate(prompt, key, model):
    parts = list(ref_parts())
    parts.append({"text": prompt})
    body = json.dumps({"contents": [{"parts": parts}],
                       "generationConfig": {"responseModalities": ["IMAGE"],
                                            "imageConfig": {"aspectRatio": "1:1"}}}).encode()
    url = ("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s"
           % (model, key))
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
            raise RuntimeError("no image part")
        except urllib.error.HTTPError as e:
            if attempt == 3:
                raise
            # 429 means the whole pool is hot, not just this call
            time.sleep((30 if e.code == 429 else 6) * (attempt + 1))
        except Exception:
            if attempt == 3:
                raise
            time.sleep(6 * (attempt + 1))


def wrap_edges(im, feather=64):
    """Cross-fade the square onto itself so left meets right and top meets
    bottom. The field is big enough that a board rarely wraps, but when it
    does the join must not be a line."""
    im = im.convert("RGB")
    w, h = im.size
    out = im.copy()
    for axis in (0, 1):
        band = im.crop((w - feather, 0, w, h)) if axis == 0 else im.crop((0, h - feather, w, h))
        tgt = out.crop((0, 0, feather, h)) if axis == 0 else out.crop((0, 0, w, feather))
        mask = Image.linear_gradient("L").resize(tgt.size if axis else tgt.size)
        if axis == 0:
            mask = Image.linear_gradient("L").rotate(270, expand=True).resize((feather, h))
        else:
            mask = Image.linear_gradient("L").resize((w, feather))
        merged = Image.composite(tgt, band, mask)
        out.paste(merged, (0, 0))
    return out


def quieten(im, k=0.42):
    """Pull every field toward its own mean. Ground that competes with the
    pieces standing on it is ground that has been drawn twice."""
    from PIL import ImageStat
    st = ImageStat.Stat(im)
    flat = Image.new("RGB", im.size, tuple(int(round(v)) for v in st.mean))
    return Image.blend(im, flat, k)


def one(pid, key, model, redo):
    path = os.path.join(OUT, pid + ".jpg")
    if os.path.exists(path) and not redo:
        return "skip"
    raw = generate(STYLE + GROUND[pid], key, model)
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    if im.size != (SIZE, SIZE):
        im = im.resize((SIZE, SIZE), Image.LANCZOS)
    im = wrap_edges(im)
    im = quieten(im)
    os.makedirs(OUT, exist_ok=True)
    im.save(path, "JPEG", quality=Q, optimize=True, progressive=True)
    return "ok"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only"); ap.add_argument("--jobs", type=int, default=4)
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--redo", action="store_true")
    args = ap.parse_args()
    key = os.environ.get("GEMKEY")
    if not key:
        sys.exit("GEMKEY not set")
    todo = deque([args.only] if args.only else list(GROUND))
    lock = threading.Lock()

    def worker():
        while True:
            with lock:
                if not todo:
                    return
                pid = todo.popleft()
            try:
                st = one(pid, key, args.model, args.redo)
            except Exception as e:
                st = "FAIL " + str(e)[:80]
            with lock:
                print("  %-8s %s" % (st, pid))
            time.sleep(3.0)

    ts = [threading.Thread(target=worker) for _ in range(args.jobs)]
    [t.start() for t in ts]; [t.join() for t in ts]
    have = sorted(f[:-4] for f in os.listdir(OUT)) if os.path.isdir(OUT) else []
    with io.open(MANIFEST, "w", encoding="utf-8") as f:
        f.write("/* generated by tools/gen-kit-ground.py — painted terrain fields.\n"
                "   The board samples each cell from a different part of one field,\n"
                "   so same-terrain cells are continuous and never repeat. */\n")
        f.write("window.IND_KIT_GROUND = %s;\nwindow.IND_KIT_GROUND_SIZE = %d;\n"
                % (json.dumps(have), SIZE))
    print("%d ground fields" % len(have))


if __name__ == "__main__":
    main()
