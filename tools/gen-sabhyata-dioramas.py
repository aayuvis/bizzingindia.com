"""Sabhyata dioramas — each city as a tilted board-game plate, Civ-style.

Sibling to gen-sabhyata-art.py (same refs, same pipeline habits). Those twenty
paintings are EYE-LEVEL scenes — beautiful cards, poor game boards. These are
the same cities seen from high above at a gentle three-quarter tilt, like a
hand-painted board-game diorama: terrain to the edges, the town in the middle
ground, the monument at the centre. The interaction layer (stations, plots,
scaffold, walkers, moored boat) drops onto them unchanged.

THE COMPOSITION CONTRACT, present in every prompt because the game anchors
depend on it:
  * high bird's-eye three-quarter view, tilted like a game board
  * the city's monument (or its ground) at the CENTRE of the frame
  * a clear open dirt street along the BOTTOM edge — the sprite walkers' lane
  * the streets nearly empty (one or two tiny figures at most): the game's own
    walking sprites are the people, and painted crowds would fight them
  * ports and shores keep their water along the RIGHT edge, where the game
    moors its boat

    export GEMKEY=...            # never hardcode, never print
    python3 tools/gen-sabhyata-dioramas.py [--only id] [--print-prompt id]

Output: app/art/sabhyata/dio/<id>.jpg (900x600), masters under
masters/sabhyata-dio/, and app/sabhyata-dio-manifest.js. A city with no
diorama falls back to its eye-level painting — never a broken scene.
"""
import argparse, base64, io, json, os, sys, time, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "app", "art", "sabhyata", "dio")
MASTER_DIR = os.path.join(ROOT, "masters", "sabhyata-dio")
MANIFEST = os.path.join(ROOT, "app", "sabhyata-dio-manifest.js")
REF_DIR = os.path.join(ROOT, "app", "art", "sabhyata")
REFS = ["kashi.jpg", "lothal.jpg"]
DEFAULT_MODEL = "gemini-3.1-flash-image"
WIDTH, HEIGHT, QUALITY = 900, 600, 80

STYLE = (
    "A richly painted Indian folk-art board-game diorama — Madhubani, Pattachitra "
    "and Mughal-miniature influence, fine ink linework over warm saturated colour, "
    "deep indigo and ochre and marigold and turquoise, handmade-paper texture. "
    "THE VIEW: seen from HIGH ABOVE at a gentle three-quarter tilt, like looking "
    "down onto a beautiful hand-painted game board — terrain spreading to every "
    "edge of the frame, buildings small and seen from above-and-beside, roads and "
    "fields readable as map shapes. One single continuous scene filling the frame "
    "edge to edge, 3:2 landscape. THE LAYOUT, exactly: the city's great monument "
    "stands at the CENTRE of the frame on open ground; the town's smaller houses "
    "cluster around the middle ground; one clear open dirt street runs the full "
    "width along the BOTTOM edge of the frame; the streets are nearly empty — at "
    "most one or two tiny distant figures, no crowds. Purely pictorial, no text, "
    "no border, no game pieces. The scene: ")


def p(s):
    return STYLE + s


DIO_PROMPTS = {
    "dholavira": p(
        "an ancient planned stone city on a dry island amid pale white salt flats, "
        "at golden evening. At the centre, the great stepped stone reservoirs "
        "brimming with bright collected rainwater, stairs running down inside them. "
        "Around them, neat low stone houses in a walled grid; the pale salt desert "
        "spreads to the frame's edges, with one lone gateway road from the bottom "
        "street up into the city."),
    "lothal": p(
        "a Harappan river-mouth trading town at sunrise on a flat green delta. At "
        "the centre, the great rectangular brick dockyard basin holding two small "
        "wooden boats. Brick warehouses and bead-workshops cluster round it; the "
        "green estuary water runs along the RIGHT edge of the frame to the sea, "
        "with white egrets, and canals thread the fields."),
    "rakhigarhi": p(
        "a wide Harappan farming town on low warm mounds, at harvest. At the "
        "centre, rows of great mud-brick granaries on a raised platform. Golden "
        "wheat and barley fields quilt the land to every edge, cut by cart lanes; "
        "round houses cluster on the mounds, and drying cloth is strung between "
        "them."),
    "kalibangan": p(
        "an early farming village beside a wide sandy river at first light. At the "
        "centre, the famous ploughed field — long criss-cross furrows raked in dark "
        "earth, one strip flowering yellow with mustard. The sandy river curves "
        "along the top edge; twin low mounds of mud-brick houses sit mid-ground, "
        "and young green fields patch the rest of the land."),
    "hastinapura": p(
        "a storied timber citadel above the wide Ganga plain, in the Mahabharata's "
        "telling. At the centre, the raised citadel of carved wooden halls with "
        "bright banners. The broad river crosses the upper frame with sand banks "
        "and drawn-up boats; below the citadel spread market awnings in marigold "
        "and indigo, mango groves, and the plain to the edges."),
    "kashi": p(
        "the ancient city of Kashi at dusk on a great curve of the Ganga. At the "
        "centre, the tallest temple spire among stacked warm old houses. The dark "
        "river sweeps along the RIGHT edge, stone ghats stepping down to it with "
        "tiny floating lamps; the old city's lanes and rooftops fill the middle "
        "ground, fields and groves at the far edges."),
    "ujjain": p(
        "an ancient crossroads market city under early stars. At the centre, the "
        "flat rooftop observatory with its bronze sighting rod and star charts. "
        "Lamplit bazaar streets radiate from it toward every edge of the frame — "
        "the meeting of the great roads — with cloth stalls and camel carts small "
        "along them, and dark fields between the roads."),
    "vaishali": p(
        "ancient Vaishali of the great assembly, in green mango country. At the "
        "centre, the vast open pillared assembly hall under old trees, its woven "
        "mats in calm ordered rows. Tiled-roof houses and courtyards cluster "
        "round; mango orchards and small tanks of water fill the land to the "
        "edges."),
    "pataliputra": p(
        "mighty Pataliputra of the Mauryas at golden hour on the Ganga. At the "
        "centre, the many-pillared palace hall rising above long timber walls with "
        "watchtowers. The wide river runs along the TOP edge with square-sailed "
        "boats at the wharves; inside the walls, ordered streets and courtyards; "
        "outside, fields and palm groves to the frame's edges."),
    "sanchi": p(
        "the great stupa of Sanchi on its quiet green hill, late light. At the "
        "centre, the vast stone dome with its carved gateways and circular path. "
        "The hill falls away on every side in terraces of grass and mango groves; "
        "a small monastery courtyard sits mid-ground, and the plain of tiny fields "
        "spreads to the edges."),
    "dhauli": p(
        "the rock of Dhauli above a green river bend, rain-washed light. At the "
        "centre, the smooth granite boulder with its gentle carved stone elephant "
        "emerging, trunk lowered. Flooded emerald paddy fields quilt the land with "
        "white herons; the wide river curves along the top edge, and a small "
        "village of thatched houses sits mid-ground."),
    "sopara": p(
        "an ancient western sea-port among coconut palms. At the centre, the "
        "palm-thatch trading pavilions and warehouses on the sand. The green sea "
        "runs along the RIGHT edge with broad wooden ships riding at anchor and "
        "longboats ferrying bales; palm groves and village lanes fill the rest to "
        "the edges."),
    "nalanda": p(
        "the great university of Nalanda in its glory, seen from above. At the "
        "centre, the many-storeyed library tower. Around it, long red-brick halls "
        "and shaded courtyards in an ordered grid, small stupas and mango trees "
        "between them; fields and a pilgrim road spread to the frame's edges."),
    "ajanta": p(
        "the painted caves of Ajanta in their horseshoe river cliff, from high "
        "above. At the centre of the horseshoe, the carved cave mouths with "
        "pillared verandas stepping along the curved rock face. The green river "
        "threads the gorge below with its waterfall; forest crowns the cliff tops "
        "to every edge of the frame."),
    "mathura": p(
        "the sculptor city of Mathura on the Yamuna. At the centre, the open-air "
        "sculpture yards with red sandstone figures garlanded on plinths. The blue "
        "river runs along the RIGHT edge with ghats and boats unloading fresh "
        "stone; the old city's warm rooftops and workshop courtyards fill the "
        "middle ground, groves at the edges, peacocks on the walls."),
    "madurai": p(
        "ancient Tamil Madurai at evening. At the centre, the lamplit pillared "
        "sangam pavilion where the poets meet, jasmine garlands at its steps. "
        "Around it, the old city's tiled roofs and temple towers in warm dusk "
        "colours; the city tank reflects the last orange light, and rice country "
        "spreads to the frame's edges."),
    "mamallapuram": p(
        "the carving shore of Mamallapuram from high above. At the centre, the "
        "stone temples shaped like great chariots on golden sand, with the long "
        "carved cliff face beside them and bamboo scaffolds against it. The blue "
        "surf and sea run along the RIGHT edge with fishing catamarans drawn up; "
        "casuarina groves and the mason's village fill the left."),
    "thanjavur": p(
        "the great temple of Thanjavur above the Chola rice country at first "
        "light. At the centre, the vast pyramid tower inside its long walled "
        "courtyard, morning procession flags at the gate. Emerald paddy fields "
        "and coconut groves quilt the land to every edge, threaded by silver "
        "irrigation channels."),
    "konark": p(
        "the Sun temple of Konark near the sea, morning gold. At the centre, the "
        "great shrine built as the sun god's stone chariot with its carved wheels "
        "and seven straining horses. Sand dunes with casuarina trees roll away "
        "around it; the blue sea runs along the RIGHT edge with fishermen's "
        "sails."),
    "muziris": p(
        "the pepper port of Muziris in green backwater country. At the centre, the "
        "spice-weighing pavilions under palm thatch, sacks of black pepper "
        "stacked high. The winding green backwater runs along the RIGHT edge with "
        "a broad-beamed foreign ship moored and longboats ferrying sacks; coconut "
        "palms and spice gardens quilt the rest."),
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
    "match their ink linework, palette, paper grain and painted shading exactly — "
    "but change the CAMERA as the prompt instructs: high above, three-quarter "
    "tilt, a board-game diorama, not an eye-level scene. ")


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


def save_pair(raw, art_id):
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    os.makedirs(MASTER_DIR, exist_ok=True)
    im.save(os.path.join(MASTER_DIR, art_id + ".jpg"), "JPEG",
            quality=92, optimize=True, progressive=True)
    w, h = im.size
    target = WIDTH / HEIGHT
    if w / h > target:
        new_w = int(round(h * target)); left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    elif w / h < target:
        new_h = int(round(w / target)); top = (h - new_h) // 2
        im = im.crop((0, top, w, top + new_h))
    im = im.resize((WIDTH, HEIGHT), Image.LANCZOS)
    os.makedirs(OUT_DIR, exist_ok=True)
    im.save(os.path.join(OUT_DIR, art_id + ".jpg"), "JPEG",
            quality=QUALITY, optimize=True, progressive=True)


def write_manifest():
    have = sorted(f[:-4] for f in os.listdir(OUT_DIR) if f.endswith(".jpg")) \
        if os.path.isdir(OUT_DIR) else []
    with open(MANIFEST, "w", encoding="utf-8") as fh:
        fh.write("/* GENERATED by tools/gen-sabhyata-dioramas.py — do not hand-edit.\n"
                 "   Ids listed here have a tilted board-game plate at\n"
                 "   app/art/sabhyata/dio/<id>.jpg (900x600). The city scene prefers\n"
                 "   the diorama and falls back to the eye-level painting. */\n")
        fh.write("window.IND_SABHYATA_DIO = " + json.dumps(have) + ";\n")
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
        print(DIO_PROMPTS[args.print_prompt]); return
    if args.manifest_only:
        print("manifest:", write_manifest(), "dioramas"); return
    key = os.environ.get("GEMKEY")
    if not key:
        sys.exit("GEMKEY not set")
    todo = [args.only] if args.only else list(DIO_PROMPTS)
    done = fail = 0
    for did in todo:
        out = os.path.join(OUT_DIR, did + ".jpg")
        if os.path.exists(out) and not args.force:
            print("  cached", did); continue
        try:
            save_pair(generate(DIO_PROMPTS[did], key, args.model), did)
            done += 1
            print("  drew  ", did)
        except Exception as e:
            fail += 1
            print("  FAILED", did, "-", e)
    n = write_manifest()
    print("DONE new=%d failed=%d manifest=%d" % (done, fail, n))
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
