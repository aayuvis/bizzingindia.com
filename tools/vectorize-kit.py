#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""City Kit vectorizer — painted PNG faces to SVG, on-palette by construction.

Two passes, in this order for a reason.

1. PALETTE SNAP. Every pixel is moved to the nearest colour in the kit's own
   ramp: fourteen tokens, each with a lighter and a darker shade, forty-two
   colours in all. This is not a lint that runs afterwards and complains — it
   is how the art becomes on-palette. It also flattens the model's airbrushed
   noise into real regions, which is what a tracer needs to make few, clean
   paths instead of ten thousand slivers.

2. TRACE. vtracer, stacked colour mode, splines. The alpha is traced as the
   silhouette so the piece keeps its cut-out edge.

    python3 tools/vectorize-kit.py [--only id] [--redo] [--jobs 4]

Reads app/art/kit/<id>/0..3.png, writes 0..3.svg beside them and
app/kit-svg-manifest.js. The PNGs stay: they are the masters, and a face
that traces badly can be re-traced without another generation.
"""
import argparse, io, json, os, re, sys, threading
from collections import deque

try:
    import numpy as np
    from PIL import Image
    import vtracer
except ImportError as e:
    sys.exit("need pillow, numpy and vtracer (pip install vtracer): %s" % e)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "app", "art", "kit")
MANIFEST = os.path.join(ROOT, "app", "kit-svg-manifest.js")

TOKENS = {
    "ink":       "#241a14", "cream":  "#f3e6cd", "white":   "#f7f1e4",
    "indigo":    "#2f3d78", "turq":   "#3fa89c", "water":   "#4a86a8",
    "ochre":     "#c07a2c", "marigold": "#efb34a", "gold":  "#e6c15a",
    "vermilion": "#cf4a34", "earth":  "#8a5a34", "leaf":    "#4f8b46",
    "stone":     "#b9a98c", "plum":   "#6b4a63",
}
SHADES = (-0.30, 0.0, 0.26)          # darker, the token, lighter


def hex2rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def ramp():
    out = []
    for name, h in sorted(TOKENS.items()):
        r, g, b = hex2rgb(h)
        for k in SHADES:
            if k < 0:
                c = (r * (1 + k), g * (1 + k), b * (1 + k))
            else:
                c = (r + (255 - r) * k, g + (255 - g) * k, b + (255 - b) * k)
            out.append(tuple(int(round(v)) for v in c))
    return np.array(sorted(set(out)), dtype=np.int16)


RAMP = ramp()


def snap(im):
    """Nearest ramp colour per pixel, weighted toward luminance so shading
    survives and hue does not wander."""
    im = im.convert("RGBA")
    a = np.asarray(im, dtype=np.int16)
    rgb, alpha = a[:, :, :3], a[:, :, 3]
    h, w = alpha.shape
    flat = rgb.reshape(-1, 3).astype(np.int32)
    W = np.array([0.9, 1.15, 0.75])          # eye weights: green matters most
    best = np.zeros(flat.shape[0], dtype=np.int32)
    chunk = 60000
    for i in range(0, flat.shape[0], chunk):
        seg = flat[i:i + chunk][:, None, :] - RAMP[None, :, :].astype(np.int32)
        d = ((seg ** 2) * W[None, None, :]).sum(axis=2)
        best[i:i + chunk] = d.argmin(axis=1)
    out = RAMP[best].reshape(h, w, 3).astype(np.uint8)
    res = np.dstack([out, alpha.astype(np.uint8)])
    # hard alpha: a tracer cannot do a soft edge, and a soft edge on a game
    # piece reads as a halo against every background it is ever put on
    res[:, :, 3] = np.where(alpha >= 128, 255, 0).astype(np.uint8)
    res[res[:, :, 3] == 0] = 0
    return Image.fromarray(res, "RGBA")


TRACE = dict(colormode="color", hierarchical="stacked", mode="spline",
             filter_speckle=14, color_precision=5, layer_difference=32,
             corner_threshold=80, length_threshold=4.0, max_iterations=10,
             splice_threshold=60, path_precision=1)

# The single biggest lever on file size is what you hand the tracer. A piece
# 3x2 on the board is drawn 160 px wide; tracing its 480 px master gives three
# times the paths for detail nobody will ever see. Trace at 1.6x board scale.
TRACE_SCALE, TRACE_MIN = 1.6, 128


def trace_width(pid, w):
    d = DIMS.get(pid)
    if not d:
        return w
    L, B = d[0] or 1, d[1] or 1
    return max(TRACE_MIN, min(w, int((L + B) * 32 * TRACE_SCALE)))


DIMS = {}
try:
    _k = json.load(io.open(os.path.join(ROOT, "tools", "city-kit.json"), encoding="utf-8"))
    DIMS = {p[0]: p[3] for p in _k["parts"]}
except Exception:
    pass


def head_fix(svg, w, h):
    """vtracer emits width/height in px and no viewBox. Give it a viewBox so
    the piece scales with the board, and drop its version comment."""
    svg = re.sub(r"<\?xml[^>]*\?>\s*", "", svg)
    svg = re.sub(r"<svg[^>]*>",
                 '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
                 'width="%d" height="%d" shape-rendering="geometricPrecision">'
                 % (w, h, w, h), svg, count=1)
    return svg.strip() + "\n"


def one_face(png, svg_path, pid=None):
    src = Image.open(png)
    tw = trace_width(pid or os.path.basename(os.path.dirname(png)), src.width)
    if tw < src.width:
        src = src.resize((tw, max(1, int(round(src.height * tw / float(src.width))))),
                         Image.LANCZOS)
    im = snap(src)
    tmp = png + ".snap.png"
    im.save(tmp, "PNG")
    try:
        vtracer.convert_image_to_svg_py(tmp, svg_path, **TRACE)
    finally:
        os.remove(tmp)
    with io.open(svg_path, encoding="utf-8") as f:
        svg = f.read()
    svg = head_fix(svg, im.width, im.height)
    with io.open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg)
    return len(svg)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--redo", action="store_true")
    ap.add_argument("--jobs", type=int, default=4)
    args = ap.parse_args()

    ids = [args.only] if args.only else sorted(
        d for d in os.listdir(ART)
        if os.path.isdir(os.path.join(ART, d))
        and os.path.exists(os.path.join(ART, d, "0.png")))   # painted parts only;
        # procedural tiles are already SVG and must never be traced
    q = deque(ids)
    lock = threading.Lock()
    done, bytes_ = [0], [0]

    def worker():
        while True:
            with lock:
                if not q:
                    return
                pid = q.popleft()
            d = os.path.join(ART, pid)
            tot = 0
            try:
                for i in range(4):
                    png = os.path.join(d, "%d.png" % i)
                    svg = os.path.join(d, "%d.svg" % i)
                    if not os.path.exists(png):
                        raise IOError("missing face %d" % i)
                    if os.path.exists(svg) and not args.redo:
                        tot += os.path.getsize(svg); continue
                    tot += one_face(png, svg, pid)
            except Exception as e:
                with lock:
                    print("  FAIL  %-20s %s" % (pid, str(e)[:90]))
                continue
            with lock:
                done[0] += 1; bytes_[0] += tot
                print("  ok    %-20s %5.1f KB" % (pid, tot / 1024.0))

    ts = [threading.Thread(target=worker) for _ in range(max(1, args.jobs))]
    [t.start() for t in ts]
    [t.join() for t in ts]

    have = {}
    for pid in sorted(os.listdir(ART)):
        d = os.path.join(ART, pid)
        if os.path.isdir(d) and os.path.exists(os.path.join(d, "0.png")) and all(
                os.path.exists(os.path.join(d, "%d.svg" % i)) for i in range(4)):
            im = Image.open(os.path.join(d, "0.png"))
            have[pid] = [im.width, im.height]
    with io.open(MANIFEST, "w", encoding="utf-8") as f:
        f.write("/* generated by tools/vectorize-kit.py — do not edit.\n"
                "   id -> [w,h]; four traced faces exist for every entry. */\n")
        f.write("window.IND_KIT_SVG = %s;\n" % json.dumps(have, sort_keys=True))
    print("\n%d parts traced, %.1f MB total, manifest %d entries"
          % (done[0], bytes_[0] / 1048576.0, len(have)))


if __name__ == "__main__":
    main()
