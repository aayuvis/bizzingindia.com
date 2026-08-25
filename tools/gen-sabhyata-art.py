#!/usr/bin/env python3
"""Paint Sabhyata — the civilization game's cities, monuments and vidyas.

Why: the game shipped playable-first ("then we add graphics later" — the founder's
words), and later is now. Twenty-nine paintings, in the same house style and through
the same pipeline habits as tools/gen-story-art.py, whose hard-won prompt rules are
reused wholesale: style declaration first, positive-only phrasing, two finished
paintings from the story set as style references so the batch converges on the book
instead of drifting across twenty-nine calls.

    export GEMKEY=...            # never hardcode, never print
    python3 tools/gen-sabhyata-art.py                # resumable: skips what exists
    python3 tools/gen-sabhyata-art.py --only dholavira,vidya-zero
    python3 tools/gen-sabhyata-art.py --print-prompt sanchi
    python3 tools/gen-sabhyata-art.py --manifest-only

Output:
    app/art/sabhyata/<site>.jpg        900x600 q78 — the city at its height, its
                                       monument the centrepiece. The game shows it
                                       desaturated until the monument is raised:
                                       the SAME painting, remembered into colour.
    app/art/sabhyata/vidya-<id>.jpg    900x600 q78 — one per tech card.
    app/sabhyata-art-manifest.js       window.IND_SABHYATA_ART = [...ids]

Editorial notes for THIS set (docs/05, docs/16):
  * Real monuments painted reverently as architecture and daily life — Sanchi,
    Konark, Thanjavur are sacred to living traditions; they get crowds of ordinary
    pilgrims and no invented iconography.
  * Brahmi on the edict rock is suggested as weathered carved marks, never legible
    writing — a painted page that "reads" invents an inscription, which the policy
    forbids.
  * No rulers' faces where none are known: Ashoka appears as a distant robed figure
    at most; mostly his works appear instead.
"""

import argparse
import base64
import io
import json
import os
import sys
import time
import urllib.error
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "app", "art", "sabhyata")
STORY_DIR = os.path.join(ROOT, "app", "art", "story")
MASTER_DIR = os.path.join(ROOT, "masters", "sabhyata")
MANIFEST = os.path.join(ROOT, "app", "sabhyata-art-manifest.js")

DEFAULT_MODEL = "gemini-3.1-flash-image"
WIDTH, HEIGHT, QUALITY = 900, 600, 78

REF_IMAGES = [
    os.path.join(STORY_DIR, "pt-lion-rabbit.jpg"),
    os.path.join(STORY_DIR, "fk-mahabali.jpg"),
]
REF_NOTE = (
    "The attached paintings are finished pages from the same painted storybook: match "
    "the same fine ink linework, the same warm saturated palette, the same handmade-paper "
    "grain, the same soft painted shading, the same density of small ornament. "
    "Paint the new scene below as another page of that same book. "
)

STYLE = (
    "A richly painted Indian folk-art storybook illustration — Madhubani, Pattachitra "
    "and Mughal-miniature influence, fine ink linework over warm saturated colour, "
    "deep indigo and ochre and marigold and turquoise, glowing atmospheric light, "
    "handmade-paper texture, painted leaves and birds and small pattern woven through "
    "the scene itself. Purely pictorial: painted figures, animals, architecture and "
    "ornament only. One single continuous painted scene filling the frame edge to edge, "
    "3:2 landscape composition, warm and beautiful and gentle, for a children's book. "
    "The painting shows: "
)


def p(subject):
    return STYLE + subject


# ------------------------------------------------------------ the cities (20) --
# Each is the city at its height with its monument (works[2]) as the centrepiece,
# full of ordinary life — the game's "build the monument" moment, painted.
CITY_PROMPTS = {
    "dholavira": p(
        "an ancient planned stone city on a dry island in a white salt desert at golden "
        "evening — and at its heart the great stepped stone water reservoirs, brimming "
        "with collected rain, stairs running down to the bright water. Children carry "
        "clay pots up the steps, traders lead laden oxen through a massive stone "
        "gateway, and the low city of neat stone houses glows warm against the pale "
        "salt flats stretching away."),
    "lothal": p(
        "a busy Harappan-era river-mouth town at sunrise, its famous great rectangular "
        "brick basin in the foreground holding two small wooden trading boats; workers "
        "on the brick wharf carry baskets of carnelian beads and bundles of cotton, a "
        "bead-maker's stall shows strings of tiny red and white beads, and the flat "
        "green delta with white egrets stretches to the sea."),
    "rakhigarhi": p(
        "a wide Harappan-era farming town on low mounds above golden wheat and barley "
        "fields at harvest — mud-brick granaries in neat rows, women winnowing grain in "
        "a bright cloud of chaff, bullock carts rolling in on a dusty lane, and the "
        "great mound of the old town rising warm behind, strung with drying cloth."),
    "kalibangan": p(
        "an early farming village beside a wide sandy river at first light, and in the "
        "foreground the world's oldest ploughed field — long criss-crossing furrows "
        "raked through dark earth, a farmer guiding a wooden plough behind two white "
        "oxen, mustard flowering yellow in one strip, a low mud-brick town on its twin "
        "mounds behind."),
    "hastinapura": p(
        "a storied ancient river capital in the Mahabharata's telling — a raised "
        "citadel of carved timber halls and bright banners above the wide Ganga plain, "
        "elephants with painted foreheads by the water-gate, boats drawn up on the "
        "sand, market awnings in marigold and indigo below the walls, morning mist on "
        "the river."),
    "kashi": p(
        "the ancient city of Kashi at dusk along the curving Ganga — stone ghats "
        "stepping down to the river, hundreds of tiny oil lamps set floating on the "
        "dark water, umbrellas of the ghat pandits, temple spires and tall old houses "
        "stacked warm behind, a boat gliding past with a lantern at its prow."),
    "ujjain": p(
        "an ancient crossroads market city under a vast starry sky — in the foreground "
        "astronomers on a flat rooftop observatory sight the stars along a bronze rod, "
        "star charts and instruments about them; below, the lamplit bazaar street runs "
        "on with camel carts and cloth stalls, the meeting roads stretching away to "
        "the horizon."),
    "vaishali": p(
        "the great assembly of ancient Vaishali in session — a vast open pillared hall "
        "under old trees, hundreds of citizens seated in calm ordered rows on woven "
        "mats, one speaker standing mid-argument with raised hand, elders listening, "
        "scribes with palm leaves, mango trees and the town's tiled roofs all around."),
    "pataliputra": p(
        "mighty Pataliputra, capital of the Mauryas, seen from the Ganga at golden "
        "hour — its famous long timber walls with watchtowers running along the "
        "riverbank mile after mile, river boats with square sails coming in to the "
        "wharves, the many-pillared palace hall rising above the walls, flights of "
        "parrots over the water."),
    "sanchi": p(
        "the great stupa of Sanchi on its quiet green hill — the vast stone dome warm "
        "in late light, its four carved gateways crowded with sculpted stories of "
        "animals and trees, pilgrim families with marigold garlands walking the "
        "circular path, monks in ochre robes, the plain of fields and mango groves "
        "far below."),
    "dhauli": p(
        "the rock of Dhauli above a bend of green river fields — a smooth granite "
        "boulder carved with weathered ancient marks, a sculpted stone elephant "
        "emerging from the rock beside it, village children listening as an old man "
        "traces the carvings with his finger, white herons rising from the paddy "
        "below, a soft rain-washed sky."),
    "sopara": p(
        "an ancient western sea-port in full sail-mending, cargo-hauling life — broad "
        "wooden ships riding at anchor beyond the surf, longboats ferrying bales of "
        "cloth and jars of oil through green water, merchants of many lands bargaining "
        "under palm-thatch awnings, coconut palms leaning over the sand."),
    "nalanda": p(
        "the great university of Nalanda in its glory — long red-brick halls and "
        "shaded courtyards full of debating students, the many-storeyed library tower "
        "rising above mango trees, teachers with palm-leaf manuscripts under a great "
        "banyan, a traveller from far away being welcomed at the gate with folded "
        "hands."),
    "ajanta": p(
        "the painted caves of Ajanta in their horseshoe river cliff — carved cave "
        "mouths with pillared verandas stepping along the rock face above a green "
        "gorge, and within the nearest cave glowing lamplit walls painted with "
        "processions and animals and flowering trees, painters on a bamboo scaffold "
        "at work by lamplight, the waterfall threading down beyond."),
    "mathura": p(
        "the sculptor city of Mathura on the Yamuna — open-air workshops along the "
        "ghats where carvers shape red sandstone into graceful figures, finished "
        "sculpture garlanded on plinths, river boats unloading fresh stone, peacocks "
        "on the workshop walls, the old city warm behind."),
    "madurai": p(
        "a sangam of poets in ancient Madurai — a lamplit pillared pavilion at "
        "evening where poets young and old recite in turn, palm-leaf manuscripts "
        "passing hand to hand, listeners leaning in from the steps, garlands of "
        "jasmine, the tiled roofs and temple towers of the old Tamil city rising "
        "behind against the last orange light."),
    "mamallapuram": p(
        "the shore of Mamallapuram alive with carving — stone temples shaped like "
        "great chariots standing on golden sand, a whole granite cliff face being "
        "sculpted into a crowded joyful scene of elephants and rivers and sages, "
        "masons on scaffolds with mallets and chisels, fishing catamarans drawn up "
        "beside the surf."),
    "thanjavur": p(
        "the great temple of Thanjavur rising above the Chola rice country — its "
        "vast pyramid tower catching first light high over the town, its long walls "
        "carved with weathered rows of inscription marks, morning processions with "
        "drums and flowers entering the gate, green paddy and coconut groves "
        "stretching to the horizon."),
    "konark": p(
        "the Sun temple of Konark near the sea — the great shrine built as the sun "
        "god's stone chariot, its carved stone wheels taller than the pilgrims "
        "beside them, seven sculpted horses straining seaward, morning light "
        "flooding gold across the carvings, fishermen's sails on the blue water "
        "beyond the dunes."),
    "muziris": p(
        "the pepper port of Muziris at the height of the sea trade — a broad-beamed "
        "ship from across the western sea moored in the green backwater, sacks of "
        "black pepper and baskets of ginger going aboard by longboat, merchants "
        "weighing spice against bright coins under palm-thatch, kingfishers and "
        "coconut palms over the water."),
}

# ------------------------------------------------------------- the vidyas (9) --
VIDYA_PROMPTS = {
    "vidya-plough": p(
        "the gift of the plough — a farmer and two garlanded white oxen cutting the "
        "first long furrows through rich dark earth at sunrise, the wooden plough "
        "polished with use, birds following the fresh soil, a village waking under "
        "trees at the field's edge, young green rows already rising in the finished "
        "strips."),
    "vidya-brick": p(
        "the craft of fired brick — a busy kiln yard at evening, the domed brick kiln "
        "glowing warm at its vents, workers laying out neat rows of new bricks the "
        "colour of sunset, a half-built wall rising true and straight under a string "
        "line, children stamping small handprints into one soft brick while a mason "
        "laughs."),
    "vidya-iron": p(
        "the coming of iron tools — a village smithy under a great tree at dusk, the "
        "forge glowing orange, a smith drawing a bright new axe-head from the coals "
        "with tongs, finished sickles and ploughshares hung gleaming on the wall, "
        "sparks rising like fireflies, farmers waiting with grain to trade."),
    "vidya-panchayat": p(
        "the panchayat — five village elders seated on a low platform under a vast "
        "banyan tree, listening carefully to two farmers who stand before them, "
        "villagers gathered all round in the dappled shade, a scribe with a palm "
        "leaf, water being passed, doves in the branches, everything calm and "
        "attentive."),
    "vidya-script": p(
        "the gift of writing — a teacher under a veranda guiding children who trace "
        "letterforms in smooth river sand with sticks, palm-leaf manuscripts tied in "
        "bundles beside them, a stone pillar in the courtyard bearing weathered "
        "carved marks, a parrot watching from the eaves, morning light on it all."),
    "vidya-roads": p(
        "the royal roads — a wide tree-lined highway running straight to the horizon "
        "through green country, carved milestone at the verge, a rest-house with a "
        "well and mango shade where travellers water their bullocks, a merchant "
        "caravan and a family on foot and a royal messenger all sharing the road."),
    "vidya-zero": p(
        "the idea of zero — an astronomer-teacher at night on a rooftop drawing a "
        "perfect glowing circle in white on a slate, students leaning in wonder, "
        "counting-boards with bead rows beside oil lamps, the full moon echoing the "
        "drawn circle, star charts and instruments about, the sleeping town below."),
    "vidya-temple": p(
        "the craft of temple building — a rising stone tower wrapped in bamboo "
        "scaffolding, master masons hoisting a carved block with rope and wooden "
        "crane, sculptors below finishing lotus medallions, the architect holding a "
        "palm-leaf plan against the sky, baskets of marigolds ready for the day the "
        "work is done."),
    "vidya-monsoon": p(
        "monsoon sailing — a broad-beamed trading ship with a great square sail "
        "running before the monsoon wind on deep blue open sea, sailors trimming "
        "lines, flying fish skipping the bow wave, towering silver monsoon clouds "
        "astern, a coastline of palms just rising on the horizon ahead."),
}

ALL = {}
ALL.update(CITY_PROMPTS)
ALL.update(VIDYA_PROMPTS)


# ---------------------------------------------------------------- machinery --
# (the same shape as gen-story-art.py: refs -> generate -> shrink -> manifest)

def ref_parts():
    if not hasattr(ref_parts, "cache"):
        parts = []
        for path in REF_IMAGES:
            if os.path.exists(path):
                with open(path, "rb") as fh:
                    parts.append({"inline_data": {
                        "mime_type": "image/jpeg",
                        "data": base64.b64encode(fh.read()).decode("ascii")}})
        ref_parts.cache = parts
    return ref_parts.cache


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
        fh.write("/* GENERATED by tools/gen-sabhyata-art.py — do not hand-edit.\n"
                 "   Ids listed here have a painting at app/art/sabhyata/<id>.jpg (900x600).\n"
                 "   Cities carry their monument as the centrepiece; the game shows the\n"
                 "   painting desaturated until the monument is raised. */\n")
        fh.write("window.IND_SABHYATA_ART = " + json.dumps(have) + ";\n")
    return len(have)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--print-prompt")
    ap.add_argument("--manifest-only", action="store_true")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    args = ap.parse_args()

    if args.print_prompt:
        print(ALL[args.print_prompt]); return
    if args.manifest_only:
        print("manifest: %d ids" % write_manifest()); return

    key = os.environ.get("GEMKEY")
    if not key:
        sys.exit("GEMKEY not set")

    todo = sorted(ALL) if not args.only else args.only.split(",")
    done = fail = skip = 0
    for art_id in todo:
        out = os.path.join(OUT_DIR, art_id + ".jpg")
        if not args.only and os.path.exists(out):
            skip += 1; continue
        try:
            raw = generate(ALL[art_id], key, args.model)
            save_pair(raw, art_id)
            done += 1
            print("  ok %-18s" % art_id, flush=True)
        except Exception as e:
            fail += 1
            print("  !! %-18s %s" % (art_id, e), flush=True)
    n = write_manifest()
    print("DONE new=%d skip=%d fail=%d manifest=%d" % (done, skip, fail, n))
    if fail:
        sys.exit(1)


if __name__ == "__main__":
    main()
