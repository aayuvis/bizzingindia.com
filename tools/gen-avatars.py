#!/usr/bin/env python3
"""gen-avatars.py — generate the Bizzing India avatar art with the Gemini image API.

Reads a JSON map of {id: prompt} (or {id: {"prompt": ..., "alt": ...}}), generates one
square PNG per id, resizes it to 256x256 and writes it to app/art/<id>.png.

Resumable: any id that already has an output PNG is skipped unless --force / --only.

  export GEMKEY=...            # never hardcode the key
  python3 tools/gen-avatars.py tools/avatar-prompts.json
  python3 tools/gen-avatars.py tools/avatar-prompts.json --only ganesha,mithu --force

Requires: pillow.
"""

import argparse
import base64
import io
import json
import os
import random
import sys
import time
import urllib.error
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "app", "art")
RAW_DIR = os.path.join(ROOT, "tools", ".art-raw")
MODEL = "gemini-2.5-flash-image"
ENDPOINT = ("https://generativelanguage.googleapis.com/v1beta/models/"
            + MODEL + ":generateContent")

SIZE = 256
MAX_TRIES = 3
SLEEP = 2.0          # polite gap between calls
TIMEOUT = 180


# --------------------------------------------------------------------- api

def call_api(prompt, key):
    """POST one prompt. Returns (png_bytes, text). png_bytes is None if refused."""
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }).encode()
    req = urllib.request.Request(
        ENDPOINT, data=body, method="POST",
        headers={"Content-Type": "application/json", "X-goog-api-key": key})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        data = json.loads(r.read().decode())

    cands = data.get("candidates") or []
    if not cands:
        return None, "no candidates: " + json.dumps(data)[:400]
    cand = cands[0]
    notes = [cand.get("finishReason") or ""]
    for part in (cand.get("content") or {}).get("parts") or []:
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"]), " ".join(notes)
        if "text" in part:
            notes.append(part["text"][:300])
    return None, " ".join(n for n in notes if n)


# ------------------------------------------------------------------ images

def to_tile(png_bytes):
    """Square, white-matted, 256x256, palette-optimised PNG bytes."""
    im = Image.open(io.BytesIO(png_bytes))
    im = im.convert("RGBA")

    # square it off on white (the source is normally already square)
    side = max(im.size)
    canvas = Image.new("RGBA", (side, side), (255, 255, 255, 255))
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2), im)
    flat = Image.new("RGB", (side, side), (255, 255, 255))
    flat.paste(canvas, (0, 0), canvas)

    flat = flat.resize((SIZE, SIZE), Image.LANCZOS)
    pal = flat.quantize(colors=192, method=Image.MEDIANCUT, dither=Image.NONE)

    buf = io.BytesIO()
    pal.save(buf, "PNG", optimize=True)
    return buf.getvalue()


# -------------------------------------------------------------------- main

def generate(aid, spec, key, log):
    """Generate one id. Returns 'ok' | 'refused' | 'error'."""
    prompt = spec["prompt"] if isinstance(spec, dict) else spec
    alt = spec.get("alt") if isinstance(spec, dict) else None
    attempts = [prompt] + ([alt] if alt else [])

    for which, text in enumerate(attempts):
        label = "prompt" if which == 0 else "reworded prompt"
        for attempt in range(1, MAX_TRIES + 1):
            try:
                png, note = call_api(text, key)
            except urllib.error.HTTPError as e:
                detail = e.read().decode()[:200]
                png, note = None, "HTTP %s %s" % (e.code, detail)
                if e.code in (429, 500, 503) and attempt < MAX_TRIES:
                    back = SLEEP * (2 ** attempt) + random.random()
                    log("    %s retry %d in %.1fs (%s)" % (aid, attempt, back, note))
                    time.sleep(back)
                    continue
            except Exception as e:                       # network hiccup
                png, note = None, "%s: %s" % (type(e).__name__, e)
                if attempt < MAX_TRIES:
                    back = SLEEP * (2 ** attempt) + random.random()
                    log("    %s retry %d in %.1fs (%s)" % (aid, attempt, back, note))
                    time.sleep(back)
                    continue

            if png:
                os.makedirs(RAW_DIR, exist_ok=True)
                os.makedirs(OUT_DIR, exist_ok=True)
                with open(os.path.join(RAW_DIR, aid + ".png"), "wb") as f:
                    f.write(png)
                tile = to_tile(png)
                with open(os.path.join(OUT_DIR, aid + ".png"), "wb") as f:
                    f.write(tile)
                log("  ok   %-16s %6.1fkB raw -> %5.1fkB tile  (%s)"
                    % (aid, len(png) / 1024, len(tile) / 1024, label))
                return "ok"

            log("  miss %-16s %s :: %s" % (aid, label, (note or "")[:160]))
            break        # no image and not a transient error -> try the alt prompt

    return "refused"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("prompts", help="JSON file of {id: prompt}")
    ap.add_argument("--only", default="", help="comma-separated ids")
    ap.add_argument("--force", action="store_true", help="regenerate existing")
    args = ap.parse_args()

    key = os.environ.get("GEMKEY") or os.environ.get("GEMINI_API_KEY")
    if not key:
        sys.exit("GEMKEY is not set")

    with open(args.prompts) as f:
        prompts = json.load(f)

    only = [s.strip() for s in args.only.split(",") if s.strip()]
    ids = only or list(prompts)

    def log(msg):
        print(msg, flush=True)

    todo, skipped = [], 0
    for aid in ids:
        if aid not in prompts:
            log("  ??   %s not in prompt file" % aid)
            continue
        if os.path.exists(os.path.join(OUT_DIR, aid + ".png")) and not (args.force or only):
            skipped += 1
            continue
        todo.append(aid)

    log("%d to generate, %d already present" % (len(todo), skipped))
    results = {}
    for i, aid in enumerate(todo, 1):
        log("[%d/%d] %s" % (i, len(todo), aid))
        results[aid] = generate(aid, prompts[aid], key, log)
        if i < len(todo):
            time.sleep(SLEEP)

    ok = [k for k, v in results.items() if v == "ok"]
    bad = [k for k, v in results.items() if v != "ok"]
    log("\ndone: %d ok, %d failed%s" % (len(ok), len(bad), (": " + ", ".join(bad)) if bad else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
