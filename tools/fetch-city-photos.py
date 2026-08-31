#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Real photographs for the historical cities — pulled ONLY from Wikimedia
Commons, ONLY under free licenses (public domain / CC0 / CC BY / CC BY-SA).

For every city the script searches Commons for a curated subject (the thing
the facts talk about: Dholavira's reservoirs, the Kolhua lion pillar, the
Sidi Saiyyed jali), walks the results until it finds one whose license is in
the allowed set, downloads a 1000px rendition, recompresses it, and records
the photographer and license in the manifest. The page shows that credit
under the picture — attribution is the license's own condition, not decor.

    python3 tools/fetch-city-photos.py [--only id]

Output: app/art/itihaas/ph/{id}.jpg + app/city-photos-manifest.js
"""
import argparse, io, json, os, re, ssl, sys, time, urllib.parse, urllib.request

try:
    from PIL import Image
except ImportError:
    sys.exit("pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, "..", "app")
OUT = os.path.join(APP, "art", "itihaas", "ph")
API = "https://commons.wikimedia.org/w/api.php"
UA = "BizzingIndia/1.0 (educational app; contact via github.com/aayuvis)"
CA = "/root/.ccr/ca-bundle.crt"
CTX = ssl.create_default_context(cafile=CA if os.path.exists(CA) else None)
MAXW = 1000

# What to look for, per city — the subject the facts actually talk about.
SUBJECTS = {
    "dholavira":    "Dholavira reservoir",
    "lothal":       "Lothal dockyard",
    "rakhigarhi":   "Rakhigarhi mound excavation",
    "kalibangan":   "Kalibangan archaeological site",
    "hastinapura":  "Painted Grey Ware",
    "kashi":        "Varanasi ghats Ganga",
    "ujjain":       "Ujjain Ram Ghat Shipra",
    "vaishali":     "Kolhua Ashoka pillar lion",
    "pataliputra":  "Pataliputra capital Kumhrar",
    "sanchi":       "Sanchi stupa gateway torana",
    "dhauli":       "Dhauli rock-cut elephant",
    "sopara":       "Nala Sopara stupa",
    "nalanda":      "Nalanda mahavihara ruins",
    "ajanta":       "Ajanta caves painting",
    "mathura":      "Mathura Museum Buddha sculpture",
    "madurai":      "Meenakshi temple gopuram Madurai",
    "mamallapuram": "Shore Temple Mahabalipuram",
    "thanjavur":    "Brihadisvara Temple Thanjavur",
    "konark":       "Konark Sun Temple wheel",
    "muziris":      "Pattanam excavation Kerala",
    "delhi":        "Qutb Minar iron pillar Delhi",
    "hampi":        "Hampi stone chariot Vittala",
    "agra":         "Taj Mahal Agra",
    "amritsar":     "Harmandir Sahib Golden Temple Amritsar",
    "surat":        "Surat castle Tapi",
    "mumbai":       "Chhatrapati Shivaji Maharaj Terminus",
    "kolkata":      "College Street Kolkata books",
    "ahmedabad":    "Sidi Saiyyed jali",
    "chandigarh":   "Rock Garden Chandigarh Nek Chand",
    "bengaluru":    "Indian Institute of Science main building",
    "sriharikota":  "PSLV launch Satish Dhawan Space Centre",
    "x-harappa":    "Harappa archaeological site granary",
    "x-mohenjo":    "Mohenjo-daro Great Bath",
    "x-taxila":     "Taxila Dharmarajika stupa",
    "x-lahore":     "Lahore Fort Alamgiri Gate",
}

FREE = re.compile(r"^(public domain|no restrictions|cc0|cc by(-sa)?( \d\.\d)?( [a-z]{2,3})?)$", re.I)


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
        return r.read()


def search(term):
    q = urllib.parse.urlencode({
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": term + " filetype:bitmap", "gsrnamespace": 6, "gsrlimit": 10,
        "prop": "imageinfo", "iiprop": "url|extmetadata|mime|size",
        "iiurlwidth": MAXW,
    })
    data = json.loads(get(API + "?" + q))
    pages = (data.get("query") or {}).get("pages") or {}
    return sorted(pages.values(), key=lambda p: p.get("index", 99))


def clean(html):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html or "")).strip()


def pick(term):
    for page in search(term):
        ii = (page.get("imageinfo") or [None])[0]
        if not ii:
            continue
        if ii.get("mime") not in ("image/jpeg", "image/png"):
            continue
        if (ii.get("width") or 0) < 500:
            continue
        md = ii.get("extmetadata") or {}
        lic = clean((md.get("LicenseShortName") or {}).get("value"))
        if not FREE.match(lic or ""):
            continue
        artist = clean((md.get("Artist") or {}).get("value")) or "unknown"
        if len(artist) > 60:
            artist = artist[:57] + "…"
        return {
            "thumb": ii.get("thumburl") or ii.get("url"),
            "credit": "Photo: %s · %s · Wikimedia Commons" % (artist, lic),
            "license": lic,
            "page": ii.get("descriptionshorturl") or ii.get("url"),
            "title": page.get("title"),
        }
    return None


def fetch_one(sid, term):
    hit = pick(term)
    if not hit:
        print("  MISS  %-14s (%s)" % (sid, term))
        return None
    raw = get(hit["thumb"])
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    if im.width > MAXW:
        im = im.resize((MAXW, int(im.height * MAXW / im.width)), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    fn = sid + ".jpg"
    im.save(os.path.join(OUT, fn), "JPEG", quality=78, optimize=True, progressive=True)
    print("  ok    %-14s %-22s %s" % (sid, hit["license"], hit["title"]))
    return {"file": fn, "credit": hit["credit"], "license": hit["license"], "src": hit["page"]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    args = ap.parse_args()
    manifest_path = os.path.join(APP, "city-photos-manifest.js")
    man = {}
    if os.path.exists(manifest_path):
        m = re.search(r"=\s*(\{.*\});", io.open(manifest_path, encoding="utf-8").read(), re.S)
        if m:
            man = json.loads(m.group(1))
    todo = [args.only] if args.only else list(SUBJECTS)
    for sid in todo:
        try:
            got = fetch_one(sid, SUBJECTS[sid])
            if got:
                man[sid] = got
        except Exception as e:
            print("  FAIL  %-14s %s" % (sid, e))
        time.sleep(0.6)
    with io.open(manifest_path, "w", encoding="utf-8") as f:
        f.write("/* generated by tools/fetch-city-photos.py — free-licensed Commons\n"
                "   images only; each entry keeps its photographer and license, and the\n"
                "   page credits them under the picture. Do not edit by hand. */\n")
        f.write("window.IND_CITY_PHOTOS = %s;\n" %
                json.dumps(man, ensure_ascii=False, indent=1, sort_keys=True))
    print("manifest: %d cities with photos" % len(man))


if __name__ == "__main__":
    main()
