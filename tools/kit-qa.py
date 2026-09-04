#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""City Kit QA — find the faces that drifted, without opening 368 files.

Four views drawn in one image usually agree. When they do not, they disagree
in a way arithmetic can see: one view is a different size, or a different
shape, or the model quietly drew a different object for one quarter. This
prints the parts worth a human look, most suspect first.

    python3 tools/kit-qa.py [--json]
"""
import argparse, io, json, os, sys
from PIL import Image
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "app", "art", "kit")

AREA_TOL, ASPECT_TOL, SPECK_TOL = 1.75, 0.34, 0.055


def stats(path):
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im)[:, :, 3] > 128
    if not a.any():
        return None
    ink = int(a.sum())
    ys, xs = np.where(a)
    w, h = xs.max() - xs.min() + 1, ys.max() - ys.min() + 1
    # loose ink: pixels far from the main mass are matte crumbs
    fill = ink / float(w * h)
    return {"ink": ink, "w": int(w), "h": int(h), "ar": w / float(h), "fill": fill}


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    bad = []
    for pid in sorted(os.listdir(ART)):
        d = os.path.join(ART, pid)
        if not os.path.isdir(d):
            continue
        pngs = [os.path.join(d, "%d.png" % i) for i in range(4)]
        if not all(os.path.exists(p) for p in pngs):
            continue
        s = [stats(p) for p in pngs]
        if any(x is None for x in s):
            bad.append((9.9, pid, "an empty face")); continue
        inks = [x["ink"] for x in s]
        ars = [x["ar"] for x in s]
        fills = [x["fill"] for x in s]
        area_r = max(inks) / float(min(inks))
        med_ar = sorted(ars)[1]
        ar_dev = max(abs(a - med_ar) / med_ar for a in ars)
        why = []
        score = 0.0
        if area_r > AREA_TOL:
            why.append("size %.2fx across faces" % area_r); score += area_r
        if ar_dev > ASPECT_TOL:
            why.append("shape %.0f%% off" % (ar_dev * 100)); score += ar_dev * 3
        if min(fills) < SPECK_TOL:
            why.append("matte crumbs (fill %.3f)" % min(fills)); score += 2
        if why:
            bad.append((score, pid, ", ".join(why)))
    bad.sort(reverse=True)
    if args.json:
        print(json.dumps([b[1] for b in bad]))
        return
    for score, pid, why in bad:
        print("  %-22s %s" % (pid, why))
    print("\n%d parts flagged of %d" % (len(bad),
          len([d for d in os.listdir(ART) if os.path.isdir(os.path.join(ART, d))])))


if __name__ == "__main__":
    main()
