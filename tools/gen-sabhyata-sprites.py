"""Sabhyata sprites — the little painted figures that make the board LIVE.

Sibling to gen-sabhyata-art.py (whose pipeline habits it reuses: style first,
positive-only phrasing, two finished paintings as style references), but these
are SPRITES, not scenes: one subject on a plain white ground, matted to
transparency by flooding the white in from the edges (tools/transparent.py's
approach), so the game can move them across the map and the city paintings.

MOTION IS THE GAME'S OWN. These are stills; every walk, drift and bob is done
in code (transform animation over a fixed sprite). That is the same rule the
story films live by — generated stills, composited motion — because a model
cannot be trusted with a structural fact and a game must be.

    export GEMKEY=...            # never hardcode, never print
    python3 tools/gen-sabhyata-sprites.py [--only id] [--print-prompt id]

Output: app/art/sabhyata/sp/<id>.png (transparent, trimmed, <=360px tall),
masters under masters/sabhyata-sprites/, and app/sabhyata-sprites-manifest.js
listing what exists — the game falls back to its plain shapes for anything
not listed, so a missing sprite is a quieter board, never a broken one.
"""
import argparse, base64, io, json, os, sys, time, urllib.request
from collections import deque
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "app", "art", "sabhyata", "sp")
MASTER_DIR = os.path.join(ROOT, "masters", "sabhyata-sprites")
MANIFEST = os.path.join(ROOT, "app", "sabhyata-sprites-manifest.js")
REF_DIR = os.path.join(ROOT, "app", "art", "sabhyata")
REFS = ["kashi.jpg", "lothal.jpg"]
DEFAULT_MODEL = "gemini-3.1-flash-image"
MAX_H = 360

STYLE = (
    "A painted Indian folk-art storybook figure — Madhubani and Pattachitra "
    "influence, fine ink linework over warm saturated colour, deep indigo and "
    "ochre and marigold and turquoise, soft painted shading. ONE single subject "
    "only, whole and complete, centred on a plain pure white background with "
    "nothing else at all: no scenery, no ground line, no border, no text, no "
    "pattern around it — just the painted subject floating on clean white, like "
    "a sticker for a children's picture book. The subject: "
)

def p(s):
    return STYLE + s

SPRITES = {
    # ---- the walkers (side view, facing right, mid-stride: code moves them) --
    "explorer": p(
        "a young traveller in a dhoti and orange turban walking to the right, "
        "mid-stride, a wooden staff in one hand and a small glowing brass oil "
        "lamp held up in the other, a cloth bundle tied on their back."),
    "cart": p(
        "a wooden bullock cart piled with grain sacks and bright cloth bundles, "
        "pulled by two white humped oxen walking to the right, a driver in a "
        "turban seated at the front with the reins, full side view."),
    "boat": p(
        "a small wooden river boat seen from the side, one square ochre sail on "
        "a bamboo mast, a boatman standing at the stern with a long pole, two "
        "covered baskets of goods in the hull."),
    "kisan": p(
        "a farmer walking to the right, mid-stride, carrying a golden sheaf of "
        "wheat over one shoulder and a sickle in the other hand, green dhoti "
        "and white turban."),
    "karigar": p(
        "an artisan walking to the right, mid-stride, carrying a painted clay "
        "pot under one arm and a small wooden mallet in the other hand, tools "
        "tucked in a red waist sash."),
    "kathakar": p(
        "a storyteller walking to the right, mid-stride, singing, holding up a "
        "one-stringed ektara, a yellow cloth bag of scrolls on their shoulder."),
    "rakshak": p(
        "a village watchman walking to the right, mid-stride, holding a tall "
        "bamboo lathi upright in one hand and a small lantern in the other, "
        "indigo tunic and a bright sash."),
    # A DOORKEEPER, NOT A SOLDIER. What the earliest walls were for is argued
    # about and nothing we have sourced settles it, so the person who belongs
    # to a gate keeps a door: no armour, no weapon drawn, nobody to fight.
    "dwarpal": p(
        "a gatekeeper standing at ease facing the viewer, one hand resting on "
        "a tall carved wooden staff planted on the ground, the other holding a "
        "small palm-leaf tally, a heavy brass key on a cord at the waist, deep "
        "green tunic and a saffron turban, calm and welcoming, no weapon."),
    "dhanurdhar": p(
        "an archer standing in profile facing right on watch, a long bamboo bow "
        "held UNDRAWN and pointing down at their side, a quiver of arrows on "
        "the back, one hand shading their eyes to look into the distance, "
        "ochre tunic and a red waist sash. Watching, not shooting."),
    # ---- the towns (front view, compact, for the map lamps) -----------------
    "city1": p(
        "a tiny village: three round thatched mud huts close together under one "
        "green peepal tree, a small cooking fire with a thin smoke curl, seen "
        "from the front as one compact cluster."),
    "city2": p(
        "a small prosperous town as one compact cluster: warm brick houses with "
        "tiled roofs, a stone well, a little shrine with a red pennant flag, a "
        "tree between the roofs, seen from the front."),
    "city3": p(
        "a grand walled city as one compact cluster: a carved stone gateway in "
        "a rampart wall, domes and a tall tower rising behind it, bright "
        "pennant flags flying, seen from the front."),
    # ---- the works ----------------------------------------------------------
    "scaffold": p(
        "a half-built stone monument wrapped in a bamboo scaffolding lattice "
        "with ropes and a simple wooden hoist, a few dressed stone blocks "
        "waiting at its foot."),
    # ---- the buildings a player raises (data-sabhyata buildings{}) ----------
    "granary": p(
        "a rounded clay grain store on a raised wooden platform, a little "
        "thatched cap on top, plump grain sacks and a winnowing basket at its "
        "foot, seen from the front as one compact object."),
    "workshop": p(
        "a potter's open-sided workshop: a small brick kiln with a gentle warm "
        "flame, a shelf of painted clay pots, a low workbench with tools, all "
        "under one thatched lean-to roof, one compact object."),
    "gurukul": p(
        "a small open-air school under one green banyan tree: a low stone "
        "platform with a woven mat, a teacher's low seat, palm-leaf scrolls "
        "and a lit brass oil lamp, one compact object."),
    "bazaar": p(
        "a small market stall with a striped cloth awning on bamboo poles, "
        "hanging brass balance scales, baskets of fruit and folded bright "
        "cloth on the counter, one compact object."),
    "stepwell": p(
        "a small square stone stepwell seen at a gentle angle: carved stone "
        "steps descending inside to bright turquoise water, a little carved "
        "pavilion at its rim, one compact object."),
    # ---- the great ones (invented ROLES, never real people — safe as pieces) --
    "hero-annadata": p(
        "a radiant elder farmer, the Annadata, standing proud with a tall sheaf "
        "of golden wheat cradled in one arm and an overflowing basket of grain "
        "at their feet, marigold garland, gentle smile, warm morning glow."),
    "hero-sthapati": p(
        "a master builder, the Sthapati, standing proud with a rolled plan under "
        "one arm and a plumb-line and chisel in hand, a small model of a temple "
        "tower at their feet, tool sash, quiet confident smile."),
    "hero-acharya": p(
        "a beloved teacher, the Acharya, standing with a bundle of palm-leaf "
        "manuscripts under one arm and a small lit brass lamp raised in the "
        "other hand, a white shawl, warm patient smile."),
}


def ref_parts():
    if not hasattr(ref_parts, "cache"):
        parts = []
        for f in REFS:
            path = os.path.join(REF_DIR, f)
            if os.path.exists(path):
                with open(path, "rb") as fh:
                    parts.append({"inline_data": {
                        "mime_type": "image/jpeg",
                        "data": base64.b64encode(fh.read()).decode("ascii")}})
        ref_parts.cache = parts
    return ref_parts.cache


REF_NOTE = (
    "The attached paintings are finished pages from the same painted storybook: "
    "match their ink linework, palette and painted shading exactly — but paint "
    "ONLY the single subject described, alone on plain pure white. ")


def generate(prompt, key, model):
    parts = list(ref_parts())
    parts.append({"text": (REF_NOTE if parts else "") + prompt})
    body = json.dumps({"contents": [{"parts": parts}]}).encode()
    url = ("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s"
           % (model, key))
    last = None
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, data=body,
                                         headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=180) as r:
                out = json.load(r)
            for part in out["candidates"][0]["content"]["parts"]:
                if "inlineData" in part:
                    return base64.b64decode(part["inlineData"]["data"])
                if "inline_data" in part:
                    return base64.b64decode(part["inline_data"]["data"])
            raise RuntimeError("no image in response")
        except urllib.error.HTTPError as e:
            last = e
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(8 * (attempt + 1)); continue
            raise
        except Exception as e:
            last = e
            if attempt < 3:
                time.sleep(5 * (attempt + 1)); continue
            raise
    raise last


def matte(im):
    """White background -> alpha, flood-filled from the edges so the subject
    keeps its own whites (an ox, a wall, a sail). transparent.py's approach."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    NEAR = 238

    def white(x, y):
        r, g, b, a = px[x, y]
        return r >= NEAR and g >= NEAR and b >= NEAR

    seen = [[False] * h for _ in range(w)]
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if white(x, y) and not seen[x][y]:
                seen[x][y] = True; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if white(x, y) and not seen[x][y]:
                seen[x][y] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        px[x, y] = (255, 255, 255, 0)
        for nx, ny in ((x-1, y), (x+1, y), (x, y-1), (x, y+1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[nx][ny] and white(nx, ny):
                seen[nx][ny] = True; q.append((nx, ny))
    return im


def trim(im, pad=6):
    box = im.getbbox()
    if not box:
        return im
    box = (max(0, box[0] - pad), max(0, box[1] - pad),
           min(im.width, box[2] + pad), min(im.height, box[3] + pad))
    return im.crop(box)


def save(raw, sid):
    os.makedirs(MASTER_DIR, exist_ok=True)
    with open(os.path.join(MASTER_DIR, sid + ".png"), "wb") as fh:
        fh.write(raw)
    im = matte(Image.open(io.BytesIO(raw)))
    im = trim(im)
    if im.height > MAX_H:
        im = im.resize((int(round(im.width * MAX_H / im.height)), MAX_H), Image.LANCZOS)
    os.makedirs(OUT_DIR, exist_ok=True)
    im.save(os.path.join(OUT_DIR, sid + ".png"), "PNG", optimize=True)


def write_manifest():
    have = sorted(f[:-4] for f in os.listdir(OUT_DIR) if f.endswith(".png")) \
        if os.path.isdir(OUT_DIR) else []
    with open(MANIFEST, "w", encoding="utf-8") as fh:
        fh.write("/* GENERATED by tools/gen-sabhyata-sprites.py — do not hand-edit.\n"
                 "   Ids listed here have a transparent sprite at\n"
                 "   app/art/sabhyata/sp/<id>.png. The game falls back to its plain\n"
                 "   shapes for anything missing — a lost sprite is a quieter board,\n"
                 "   never a broken one. */\n")
        fh.write("window.IND_SABHYATA_SPRITES = " + json.dumps(have) + ";\n")
    return len(have)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--print-prompt")
    ap.add_argument("--manifest-only", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    args = ap.parse_args()
    if args.print_prompt:
        print(SPRITES[args.print_prompt]); return
    if args.manifest_only:
        print("manifest:", write_manifest(), "sprites"); return
    key = os.environ.get("GEMKEY")
    if not key:
        sys.exit("GEMKEY not set")
    todo = [args.only] if args.only else list(SPRITES)
    done = fail = 0
    for sid in todo:
        out = os.path.join(OUT_DIR, sid + ".png")
        if os.path.exists(out) and not args.force:
            print("  cached", sid); continue
        try:
            save(generate(SPRITES[sid], key, args.model), sid)
            done += 1
            print("  drew  ", sid)
        except Exception as e:
            fail += 1
            print("  FAILED", sid, "-", e)
    n = write_manifest()
    print("DONE new=%d failed=%d manifest=%d" % (done, fail, n))
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
