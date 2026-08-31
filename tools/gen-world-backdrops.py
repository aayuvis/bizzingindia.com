#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Painted full-page backdrops for the worlds that earned them.

The CSS/SVG ambient scenes carry delhi6 and diwali well; madhubani, cricket
and antariksh read thin. Each of those gets a Gemini-painted day and night
backdrop (16:9, palette-locked to the world's own tokens), saved to
app/art/worlds/{id}-{mode}.jpg with a manifest the runtime reads. The SVG
scenes stay in worlds-art.js untouched — a world without a backdrop on disk
simply keeps its drawn one.

    export GEMKEY=...            # never hardcode, never print
    python3 tools/gen-world-backdrops.py [--only id] [--model m]

Editorial (CLAUDE.md / docs/05): Madhubani is generated in the tradition's
idiom and the world's credit line already names the tradition and region and
says "rendered in-house until a Mithila artist is commissioned". No deities
or human figures of worship anywhere. Cricket carries no team, league or
brand marks; Antariksh no agency name or insignia. Every prompt forbids
text, because a backdrop with lettering reads as UI.
"""
import argparse, io, os, sys, time, base64, json, urllib.request

try:
    from PIL import Image
except ImportError:
    sys.exit("pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, "..", "app")
OUT_DIR = os.path.join(APP, "art", "worlds")
MASTER_DIR = os.path.join(os.environ.get("WORLDS_MASTERS", "/tmp/worlds-masters"))
WIDTH, HEIGHT, QUALITY = 1600, 900, 80
DEFAULT_MODEL = "gemini-3.1-flash-image"

STYLE = (" Flat hand-painted Indian illustration, matte gouache texture, a "
         "children's picture-book backdrop. Wide 16:9 landscape. The centre of "
         "the image stays calm and airy (interface cards sit over it); the "
         "richness lives along the bottom and the sides. Absolutely NO text, "
         "NO letters, NO numerals, NO logos, NO watermark, NO border, NO frame.")

PROMPTS = {
    # ---- Madhubani: the tradition's own idiom, flora and fauna only ----
    "madhubani-day": (
        "A wide wall painting in the Madhubani (Mithila) idiom of Bihar, India, "
        "on a warm cream ground (#fdf1e6). Traditional double-outlined motifs "
        "with fine cross-hatched fills: a lotus pond along the bottom edge, "
        "facing pairs of arching fish, two peacocks with fanned hatched tails "
        "at the left and right sides, flowering kadamba branches, and one "
        "radiant petal-ringed sun high in the sky. Slim hatched-line-and-dot "
        "border motifs creep in from the edges only. Earth pigments: deep red "
        "#c63c28, marigold #e2951f, leaf green #2f6f5e, every outline in dark "
        "ink brown #3a1410, drawn slightly uneven like a hand on a wall. "
        "No human figures, no deities." + STYLE),
    "madhubani-night": (
        "A wide night wall painting in the Madhubani (Mithila) idiom of Bihar, "
        "India, on a deep warm-black ground (#170d0a). The same double-outlined, "
        "cross-hatched tradition glowing in the dark: a petal-ringed crescent "
        "moon high up, pairs of fish and lotus buds along the bottom in warm "
        "coral #ef7f68 and gold #ffc06a with teal leaves #63b79e, scattered "
        "small hatched stars and fireflies as dotted motifs. Slim border motifs "
        "at the edges only. Outlines in soft warm cream, drawn slightly uneven "
        "like a hand on a wall. No human figures, no deities." + STYLE),

    # ---- Cricket: everyone's maidan, nobody's trademark ----
    "cricket-day": (
        "A wide golden-afternoon painting of gully cricket on an open maidan in "
        "India. A huge soft yellow-green field (#eaf2ea washed with #1e7a46), a "
        "grand old banyan tree at one side, tiny distant silhouetted children "
        "playing cricket near the bottom edge (far away, no faces), chalk-drawn "
        "stumps on a low wall at the other side, two paper kites high in a warm "
        "hazy sky, a tiny red ball sailing in a long arc. Warm marigold light "
        "#efb71e. Generic everyday clothes, no uniforms, no team colours, no "
        "flags, no brands, no scoreboard." + STYLE),
    "cricket-night": (
        "A wide painting of a floodlit cricket night in India seen from far "
        "outside the ground: a deep green-black sky (#07120c), four tall "
        "floodlight towers pouring warm white light onto a distant emerald "
        "field (#4fd08a glow), the stands only soft dots of light, one tiny "
        "white ball high in the beams, faint far-off firework sparks in gold "
        "#ffd75e and coral #ff8f86. Everything distant and dreamy, no readable "
        "anything, no faces, no team marks, no flags, no screens. The dark "
        "paint runs FULL BLEED to every edge of the image - the sky and field "
        "touch all four edges, with no margin, no mat, no paper edge, no vignette "
        "frame of any kind." + STYLE),

    # ---- Antariksh: our own rocket, no agency's marks ----
    "antariksh-day": (
        "A wide dawn painting of a rocket launch coast in India: a slim white "
        "rocket with a single saffron band standing on its seaside launch pad, "
        "long low causeway over calm water, two big white tracking dish "
        "antennas, palm scrub along the shore, morning sky in soft pale blue "
        "#e9edf6 deepening to #27407f, one warm orange dawn glow #e8862b at "
        "the horizon. A completely generic rocket: no insignia, no emblem, no "
        "flags, no lettering anywhere on it." + STYLE),
    "antariksh-night": (
        "A wide night painting of a rocket climbing from a coastal launch pad "
        "in India: deep indigo sky (#050814) full of painted stars with a soft "
        "band of Milky Way in violet #a394ff, the rocket small and high on a "
        "bright warm arc of flame #ffab5e, the glow reflected in the dark sea, "
        "tracking dishes and palm scrub silhouetted along the bottom. A "
        "completely generic rocket: no insignia, no emblem, no flags, no "
        "lettering anywhere." + STYLE),
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
        except Exception as e:
            if attempt == 3:
                raise
            time.sleep(4 * (attempt + 1))


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
    have = sorted(f[:-4] for f in os.listdir(OUT_DIR) if f.endswith(".jpg"))
    path = os.path.join(APP, "worlds-bg-manifest.js")
    with open(path, "w") as f:
        f.write("/* generated by tools/gen-world-backdrops.py — do not edit */\n")
        f.write("window.IND_WORLD_BG = %s;\n" % json.dumps(have))
    print("manifest:", have)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="generate a single id, e.g. cricket-night")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    args = ap.parse_args()
    key = os.environ.get("GEMKEY")
    if not key:
        sys.exit("GEMKEY not set")
    todo = [args.only] if args.only else list(PROMPTS)
    for aid in todo:
        print("painting", aid, "...")
        save_pair(generate(PROMPTS[aid], key, args.model), aid)
    write_manifest()


if __name__ == "__main__":
    main()
