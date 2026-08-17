#!/usr/bin/env python3
"""gen-avatars.py — generate the Bizzing India avatar art with the Gemini image API.

Reads a JSON map of {id: prompt} (or {id: {"prompt": ..., "alt": ...}}), generates one
square PNG per id, resizes it to 256x256 and writes it to app/art/<id>.png.

Resumable: any id that already has an output PNG is skipped unless --force / --only.

  export GEMKEY=...            # never hardcode the key
  python3 tools/gen-avatars.py tools/avatar-prompts.json
  python3 tools/gen-avatars.py tools/avatar-prompts.json --only ganesha,mithu --force

Style is held by IMAGE REFERENCE, not by adjectives. Keys in the prompt file that begin
with "_" are settings rather than ids:

  "_refs":   ["ganesha.png", ...]   tiles under app/art sent as style references with
                                    every request (a spec may override with "refs")
  "_prefix": "..."                  text prepended to every prompt (the style paragraph)
  "_suffix": "..."                  text appended to every prompt (the framing rules)

Sending two or three finished tiles alongside the words is what keeps 48 avatars looking
like one artist drew them; the words alone drift.

Tiles come out with a real alpha channel. The model always paints on a white studio
background; that surround is flood-filled away from the border at full resolution and the
tile is then downscaled premultiplied, so the subject keeps its own whites (a heron, a
white sari, the Buddha's robe) and the edges land soft instead of ringed. Pass --matte to
get the old opaque-white behaviour back.

Requires: pillow, numpy.
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
from collections import deque

import numpy as np
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

_REF_CACHE = {}


def ref_part(name):
    """One inline_data part for a style-reference tile under app/art."""
    if name not in _REF_CACHE:
        with open(os.path.join(OUT_DIR, name), "rb") as f:
            _REF_CACHE[name] = base64.b64encode(f.read()).decode()
    return {"inline_data": {"mime_type": "image/png", "data": _REF_CACHE[name]}}


def call_api(prompt, key, refs=()):
    """POST one prompt. Returns (png_bytes, text). png_bytes is None if refused.

    refs are filenames under app/art sent ahead of the text as style references.
    """
    parts = [ref_part(r) for r in refs] + [{"text": prompt}]
    body = json.dumps({
        "contents": [{"parts": parts}],
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

MARGIN = 0.05        # share of the tile left as air around the subject
WHITE_TOL = 18       # how far off pure white still counts as studio background


def surround(rgb):
    """Boolean mask of the studio background, flood-filled in from the border.

    Flood-filling rather than thresholding is the whole point: a heron, a white sari,
    the Buddha's robe and Gandhi's shawl are white too, and a plain threshold would
    punch holes straight through them. Only background reachable from the edge of
    the frame is background.

    IT IS NOT ALWAYS WHITE. The prompt asks for a white studio background and the
    model usually obliges — but not always, and six tiles (Brahma, Vamana, Yama,
    Mahabali, Parashurama, Tarakasura) came back painted on near-black. The fill
    was hunting for white, found none at the border, removed nothing, and every
    one of them shipped with a hard dark rectangle behind the character.

    So the background colour is READ FROM THE BORDER rather than assumed: sample
    the frame's edge, take the most common colour, and fill from that. White
    studio backgrounds behave exactly as before; a dark one now works too.
    """
    w, h = rgb.size
    a = np.asarray(rgb, dtype=np.uint8)

    edge = np.concatenate([a[0, :, :], a[h - 1, :, :], a[:, 0, :], a[:, w - 1, :]])
    # quantise to 8 levels per channel so near-identical pixels count together
    q = (edge // 32).astype(np.int32)
    codes = q[:, 0] * 64 + q[:, 1] * 8 + q[:, 2]
    dom = np.bincount(codes).argmax()
    base = edge[codes == dom].mean(axis=0)

    diff = np.abs(a.astype(np.int16) - base.astype(np.int16)).max(axis=2)
    white = (diff <= WHITE_TOL).reshape(-1).tolist()
    seen = bytearray(w * h)
    q = deque()

    def push(i):
        if white[i] and not seen[i]:
            seen[i] = 1
            q.append(i)

    for x in range(w):
        push(x)
        push((h - 1) * w + x)
    for y in range(h):
        push(y * w)
        push(y * w + w - 1)
    while q:
        i = q.popleft()
        x = i % w
        if x:            push(i - 1)
        if x < w - 1:    push(i + 1)
        if i >= w:       push(i - w)
        if i < w * (h - 1): push(i + w)

    return np.frombuffer(bytes(seen), dtype=np.uint8).reshape(h, w).astype(bool)


def _resize_rgba(im, size):
    """LANCZOS down to size x size with the colour premultiplied by alpha.

    Resizing straight RGBA averages the RGB of fully transparent white pixels into
    the edge, which is exactly the pale halo that makes a cut-out look like a sticker
    someone peeled badly. Premultiplying, resizing, then dividing back out keeps the
    edge the colour of the ink.
    """
    a = np.asarray(im, dtype=np.float32)
    al = a[:, :, 3:4] / 255.0
    pre = Image.fromarray(np.concatenate([a[:, :, :3] * al, a[:, :, 3:4]], axis=2)
                          .round().clip(0, 255).astype(np.uint8), "RGBA")
    pre = pre.resize((size, size), Image.LANCZOS)
    b = np.asarray(pre, dtype=np.float32)
    bl = np.maximum(b[:, :, 3:4], 1.0) / 255.0
    rgb = (b[:, :, :3] / bl).round().clip(0, 255)
    return Image.fromarray(np.concatenate([rgb, b[:, :, 3:4]], axis=2)
                           .astype(np.uint8), "RGBA")


def to_tile(png_bytes, matte=False):
    """Square, auto-trimmed, 256x256 RGBA PNG bytes with a real alpha channel.

    The model leaves an unpredictable amount of white air around the subject, which
    makes the set look ragged in a grid. Trimming to the ink and re-padding with a
    fixed margin is what makes every tile sit at the same visual weight.

    The background is cleared at full resolution and only then downscaled, so the 4x
    supersample does the antialiasing and the cut edge stays soft. With matte=True the
    surround is left opaque white instead (the pre-alpha behaviour).
    """
    im = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
    flat = Image.new("RGB", im.size, (255, 255, 255))
    flat.paste(im, (0, 0), im)

    bg = surround(flat)
    share = float(bg.mean())
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    if matte or share < 0.02 or share > 0.98:
        # nothing sane to cut away: a coloured background, or an image that is all ink
        alpha = np.full(flat.size[::-1], 255, dtype=np.uint8)

    cut = Image.fromarray(np.dstack([np.asarray(flat, dtype=np.uint8), alpha]), "RGBA")

    # trim to the ink (245 keeps soft shadows and pale sparkles in)
    mask = flat.convert("L").point(lambda v: 255 if v < 245 else 0)
    box = mask.getbbox()
    if box:
        w, h = box[2] - box[0], box[3] - box[1]
        # ignore a degenerate trim (a stray speck, or an image that is nearly all ink)
        if w > im.width * 0.2 and h > im.height * 0.2:
            cut = cut.crop(box)

    side = int(max(cut.size) * (1 + 2 * MARGIN))
    fill = (255, 255, 255, 255) if matte else (255, 255, 255, 0)
    canvas = Image.new("RGBA", (side, side), fill)
    canvas.paste(cut, ((side - cut.width) // 2, (side - cut.height) // 2))

    buf = io.BytesIO()
    _resize_rgba(canvas, SIZE).save(buf, "PNG", optimize=True)
    return buf.getvalue()


# -------------------------------------------------------------------- main

def generate(aid, spec, key, log, style=None, matte=False):
    """Generate one id. Returns 'ok' | 'refused' | 'error'."""
    style = style or {}
    prompt = spec["prompt"] if isinstance(spec, dict) else spec
    alt = spec.get("alt") if isinstance(spec, dict) else None
    refs = (spec.get("refs") if isinstance(spec, dict) else None) or style.get("refs") or []
    pre, suf = style.get("prefix", ""), style.get("suffix", "")
    attempts = [pre + p + suf for p in ([prompt] + ([alt] if alt else []))]

    for which, text in enumerate(attempts):
        label = "prompt" if which == 0 else "reworded prompt"
        for attempt in range(1, MAX_TRIES + 1):
            try:
                png, note = call_api(text, key, refs)
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
                tile = to_tile(png, matte)
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
    ap.add_argument("--reprocess", action="store_true",
                    help="rebuild tiles from the cached raws, no API calls")
    ap.add_argument("--matte", action="store_true",
                    help="leave the background opaque white instead of cutting it out")
    args = ap.parse_args()

    if args.reprocess:
        n = 0
        for f in sorted(os.listdir(RAW_DIR)):
            if not f.endswith(".png"):
                continue
            with open(os.path.join(RAW_DIR, f), "rb") as fh:
                tile = to_tile(fh.read(), args.matte)
            with open(os.path.join(OUT_DIR, f), "wb") as fh:
                fh.write(tile)
            n += 1
        print("reprocessed %d tiles" % n)
        return 0

    key = os.environ.get("GEMKEY") or os.environ.get("GEMINI_API_KEY")
    if not key:
        sys.exit("GEMKEY is not set")

    with open(args.prompts) as f:
        raw = json.load(f)

    style = {"refs": raw.get("_refs") or [], "prefix": raw.get("_prefix", ""),
             "suffix": raw.get("_suffix", "")}
    prompts = {k: v for k, v in raw.items() if not k.startswith("_")}

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

    log("%d to generate, %d already present%s" % (
        len(todo), skipped,
        ("  (style refs: " + ", ".join(style["refs"]) + ")") if style["refs"] else ""))
    results = {}
    for i, aid in enumerate(todo, 1):
        log("[%d/%d] %s" % (i, len(todo), aid))
        results[aid] = generate(aid, prompts[aid], key, log, style, args.matte)
        if i < len(todo):
            time.sleep(SLEEP)

    ok = [k for k, v in results.items() if v == "ok"]
    bad = [k for k, v in results.items() if v != "ok"]
    log("\ndone: %d ok, %d failed%s" % (len(ok), len(bad), (": " + ", ".join(bad)) if bad else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
