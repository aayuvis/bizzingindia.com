#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Contact sheet — every part, all four faces, on one page.

The consistency pass is not me opening 368 files. It is this page: drift in
scale, palette or light shows up as a row that does not sit with its
neighbours, and that is visible in one glance. Declared L x B x H is printed
under each row, and each face is drawn at the size the board will draw it, so
a piece that came back the wrong size cannot hide.

    python3 tools/gen-kit-sheet.py [--svg] > /dev/null   # writes the file
"""
import argparse, io, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "app", "art", "kit")
OUT = os.path.join(ROOT, "tools", "kit-sheet.html")
KIT = os.path.join(ROOT, "tools", "city-kit.json")
TILE_HALF, RISE = 32, 16


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--svg", action="store_true", help="show traced SVG, not the PNG masters")
    ap.add_argument("--scale", type=float, default=1.0)
    ap.add_argument("--only", help="comma-separated ids")
    ap.add_argument("--out")
    a = ap.parse_args()
    ext = "svg" if a.svg else "png"
    kit = json.load(io.open(KIT, encoding="utf-8"))
    defs = {p[0]: p for p in kit["parts"]}

    rows, n = [], 0
    keep = set(a.only.split(",")) if a.only else None
    for pid in sorted(os.listdir(ART)):
        d = os.path.join(ART, pid)
        if not os.path.isdir(d) or (keep and pid not in keep):
            continue
        faces = [os.path.join("..", "app", "art", "kit", pid, "%d.%s" % (i, ext))
                 for i in range(4)]
        if not all(os.path.exists(os.path.join(ROOT, "app", "art", "kit", pid,
                                               "%d.%s" % (i, ext))) for i in range(4)):
            continue
        p = defs.get(pid)
        if not p:
            continue
        L, B, H = p[3]
        w = max(64, (L + B) * TILE_HALF) * a.scale
        n += 1
        cells = "".join(
            '<div class="f"><img src="%s" style="width:%.0fpx" alt=""></div>' % (f, w)
            for f in faces)
        rows.append(
            '<div class="row"><div class="meta"><b>%s</b><code>%s</code>'
            '<span>%g × %g × %g</span><em>%s</em></div>'
            '<div class="faces">%s</div></div>'
            % (p[1], pid, L, B, H, p[2], cells))

    html = """<!doctype html><meta charset="utf-8"><title>City Kit contact sheet</title>
<style>
body{background:#15101f;color:#f6efe1;font:14px/1.5 system-ui,sans-serif;margin:0;padding:24px}
h1{font:700 26px/1.1 Georgia,serif;margin:0 0 4px}
.sub{color:#a2937c;margin:0 0 22px;font-size:13px}
.row{display:grid;grid-template-columns:190px 1fr;gap:16px;align-items:end;
  padding:14px 0;border-top:1px solid #33254a}
.meta{position:sticky;left:0;font-size:12px;line-height:1.5;padding-bottom:6px}
.meta b{display:block;font:700 15px/1.2 Georgia,serif}
.meta code{color:#e9a13b;font-size:11.5px}
.meta span{display:block;color:#f2c46a;font-family:ui-monospace,monospace;font-size:12px}
.meta em{color:#45b8ab;font-style:normal;font-size:11px;text-transform:uppercase;letter-spacing:.1em}
.faces{display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap}
.f{background:repeating-conic-gradient(#241a2f 0 25%,#1d1628 0 50%) 0 0/16px 16px;
  padding:4px;border:1px solid #33254a;display:flex;align-items:flex-end}
img{display:block;image-rendering:auto}
</style>
<h1>City Kit — contact sheet</h1>
<p class="sub">__N__ parts · four faces each · drawn at board scale · __SRC__</p>
__ROWS__"""
    html = (html.replace("__N__", str(n))
                .replace("__SRC__", "traced SVG" if a.svg else "PNG masters")
                .replace("__ROWS__", "\n".join(rows)))
    out = a.out or OUT
    io.open(out, "w", encoding="utf-8").write(html)
    print("%s — %d parts" % (out, n))


if __name__ == "__main__":
    main()
