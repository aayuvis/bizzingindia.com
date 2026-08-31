#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One painted portrait per historical city, for the era-map popup cards.

These are ILLUSTRATIONS in the app's own picture-book idiom — the same
brush as the world backdrops — never presented as photographs and never
inventing an artefact's appearance beyond what the scene needs. Real
photographs (tools/fetch-city-photos.py) take precedence in the UI the
moment the manifest has them.

    export GEMKEY=...            # never hardcode, never print
    python3 tools/gen-city-portraits.py [--only id] [--model m]

Editorial (docs/05): no deities or figures of worship depicted; sacred
buildings shown whole and with respect; no text in the image; distant
tiny people only, no faces.
"""
import argparse, io, json, os, sys, time, base64, urllib.request

try:
    from PIL import Image
except ImportError:
    sys.exit("pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, "..", "app")
OUT = os.path.join(APP, "art", "itihaas", "ct")
W, H, Q = 1120, 630, 80
DEFAULT_MODEL = "gemini-3.1-flash-image"

STYLE = (" Flat hand-painted Indian illustration, matte gouache texture, warm "
         "children's picture-book art, wide 16:9 landscape. Rich colour, soft "
         "morning or golden-hour light. Any people are tiny and distant with no "
         "faces. No deities or figures of worship. Absolutely NO text, NO "
         "letters, NO numerals, NO logos, NO watermark, NO border, NO frame.")

SCENES = {
    "dholavira":    "An ancient walled stone city in a white salt desert: great stepped stone reservoirs full of rainwater, cascading one into the next, mud-brick houses inside massive stone walls.",
    "lothal":       "An ancient brick dockyard basin by the sea holding two small reed-sailed trading ships, bead-makers' workshops with tiny red and orange beads drying on cloths.",
    "rakhigarhi":   "Wide grassy village mounds over a buried ancient city, a neat archaeologists' excavation trench with string grids, mustard fields and a small present-day Haryana village beyond.",
    "kalibangan":   "An ancient mud-brick town beside a dry river, in the foreground a ploughed field with criss-crossing furrows, terracotta bangles scattered on the earth.",
    "hastinapura":  "An epic-age river citadel on a high earthen mound above the Ganga, timber halls with banners, grey clay bowls by a potter's lamp in the foreground.",
    "kashi":        "The ghats of Varanasi at dawn: stone steps down to the Ganga, temple spires and umbrellas, little oil lamps floating on the water, rowing boats.",
    "ujjain":       "A riverside stone observatory under a deep star-filled sky: huge geometric masonry astronomical instruments, the Shipra river glinting, lamps in the town beyond.",
    "vaishali":     "An ancient assembly under a mango grove: a great open hall with many people seated in rows seen small and distant, a smooth stone pillar topped by a single sitting lion.",
    "pataliputra":  "A vast ancient river capital with long wooden walls and watchtowers along the Ganga, inside them a great hall of many polished stone pillars.",
    "sanchi":       "A great stone stupa on a quiet hill at golden hour, its carved gateway toranas crowded with reliefs, a pilgrim path winding up through trees.",
    "dhauli":       "A rounded rock hill by a river bend: the front half of an elephant carved emerging from the living rock above smooth inscribed stone, rice fields below.",
    "sopara":       "An ancient west-coast port: a grassy stupa mound, wharves with bales of cloth and pepper, ships with square sails setting out past palm trees.",
    "nalanda":      "A great red-brick monastery university: courtyards, shrines and a towering many-storeyed library, monks in ochre robes tiny in the distance.",
    "ajanta":       "A horseshoe river gorge with carved cave doorways along the cliff face, one cave glowing warmly from inside with colourful painted walls.",
    "mathura":      "An ancient sculptors' workshop by the Yamuna: figures carved from spotted red sandstone in many sizes, chisels and mallets, a river ford beyond.",
    "madurai":      "Towering temple gopurams rising over a southern city, every tier crowded with colourful carved figures, market streets below at lamp-lighting hour.",
    "mamallapuram": "A shore temple standing in the surf at sunrise, carved boulders along the beach, one giant round boulder balancing on a slope.",
    "thanjavur":    "A mighty Chola temple tower casting a long shadow over green rice plains, a great stone Nandi bull in its courtyard, canals threading the fields.",
    "konark":       "A colossal stone chariot temple by the sea: giant carved stone wheels taller than a person, stone horses straining, surf and dark clouds behind.",
    "muziris":      "An ancient pepper port on the Kerala coast: sacks of black pepper on wharves, tall clay amphorae being rolled ashore from a Roman-style ship, palms and backwaters.",
    "delhi":        "The tall fluted stone minar rising over a medieval city of domes and bazaars, in its courtyard a dark slender iron pillar, kites circling the sky.",
    "hampi":        "A city among giant golden boulders: a carved stone chariot, long colonnaded bazaar streets, banana groves and a river threading the rocks.",
    "agra":         "The white marble mausoleum at dawn seen across the Yamuna, pink light on the dome, four minarets, a charbagh garden cut in four by water channels.",
    "amritsar":     "The golden shrine shining on its calm pool at evening, reflected lamps, the walkway around the water, pilgrims tiny and distant.",
    "surat":        "A busy river-mouth port of the age of sail: teak ships being built on the Tapi bank, warehouses flying many different flags, loaded barges.",
    "mumbai":       "A grand Victorian-Gothic railway terminus with domes and arches, red buses and bicycles with lunchbox carriers in front, the sea beyond.",
    "kolkata":      "A street of endless second-hand book stalls under old colonnades, a yellow tram passing, the great steel bridge faint in the river haze beyond.",
    "ahmedabad":    "An exquisite carved stone lattice window shaped as a tree with curving branches, set in an old mosque wall, kites flying over pol houses beyond.",
    "chandigarh":   "A planned green city: a giant open-hand monument turning in the wind, wide tree-lined boulevards, in one corner a garden of small figures made of broken bangles and crockery.",
    "bengaluru":    "A garden city: an old stone watchtower on a rock, flowering gulmohar and jacaranda avenues, glass campus buildings and a lake with egrets.",
    "sriharikota":  "A slim white rocket with a saffron band on its seaside launch tower, casuarina forest island, a lake full of flamingoes in the foreground.",
    "x-harappa":    "An ancient mud-brick city on the old Ravi river: round threshing platforms, a great granary building by the gate, tiny square carved seals on a trader's cloth in the foreground.",
    "x-mohenjo":    "The Great Bath of an ancient Indus city: a sunken brick pool with steps at both ends, neat grid streets and wells beyond, morning light.",
    "x-taxila":     "A crossroads monastery city of Gandhara: a round stupa with umbrella spires, monastery cells, traders with camels and bundles arriving tiny on the road.",
    "x-lahore":     "A grand Mughal fort gateway with tilework, beyond it terraced gardens with fountains and cypress trees in the evening light.",
}


def generate(prompt, key, model):
    url = ("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s"
           % (model, key))
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"],
                             "imageConfig": {"aspectRatio": "16:9"}}
    }).encode()
    req = urllib.request.Request(url, data=body,
                                 headers={"Content-Type": "application/json"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                data = json.load(r)
            for part in data["candidates"][0]["content"]["parts"]:
                blob = part.get("inlineData") or part.get("inline_data")
                if blob:
                    return base64.b64decode(blob["data"])
            raise RuntimeError("no image part in response")
        except Exception:
            if attempt == 3:
                raise
            time.sleep(4 * (attempt + 1))


def save(raw, sid):
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = im.size
    t = W / H
    if w / h > t:
        nw = int(round(h * t)); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    elif w / h < t:
        nh = int(round(w / t)); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((W, H), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    im.save(os.path.join(OUT, sid + ".jpg"), "JPEG", quality=Q, optimize=True, progressive=True)


def write_manifest():
    have = sorted(f[:-4] for f in os.listdir(OUT) if f.endswith(".jpg"))
    with io.open(os.path.join(APP, "city-art-manifest.js"), "w", encoding="utf-8") as f:
        f.write("/* generated by tools/gen-city-portraits.py — do not edit */\n")
        f.write("window.IND_CITY_ART = %s;\n" % json.dumps(have))
    print("manifest:", len(have), "portraits")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    args = ap.parse_args()
    key = os.environ.get("GEMKEY")
    if not key:
        sys.exit("GEMKEY not set")
    todo = [args.only] if args.only else list(SCENES)
    for sid in todo:
        try:
            print("painting", sid, "...")
            save(generate(SCENES[sid] + STYLE, key, args.model), sid)
        except Exception as e:
            print("  FAIL", sid, e)
    write_manifest()


if __name__ == "__main__":
    main()
