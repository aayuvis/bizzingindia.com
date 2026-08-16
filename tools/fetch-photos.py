#!/usr/bin/env python3
"""Bizzing India — fetch freely-licensed photographs of REAL places and artifacts
from Wikimedia Commons, for the layer of the app where a photo is evidence and a
destination, not a story scene.

WHAT IT COVERS
  - Itihaas: every `today[]` entry of every era in app/data-itihaas.js
    (keys era-<eraId>-<n>), plus the iconic artifacts named in era text
    (Indus bull seal, punch-marked coin, Konark wheel — the dancing girl and
    the Sarnath Lion Capital are already today-entries).
  - States: the first two `places[]` of every state in app/data-states.js
    (keys state-<CODE>-<n>).

LICENSING IS THE POINT. For every candidate the script fetches Commons
`extmetadata` and accepts ONLY:
  CC0 · Public domain (only when Commons' machine-readable `Copyrighted` flag
  is "False", i.e. the PD claim is reviewed, not a bare tag) · CC-BY (any
  version) · CC-BY-SA (any version — fine for photos used as-is with
  attribution and the license named).
Anything NC, ND, "fair use", unlicensed, or PD-without-rationale is rejected.
Every accepted image gets a credit row (title, author, license, license URL,
source page URL) recorded in tools/photo-sources.json BEFORE download, and the
row is what app/photo-credits.js and docs/photo-credits.md are generated from.
`verify` fails the build if any shipped image lacks its credit row.

FILES
  app/art/photo/<key>.jpg     max 1200px wide, JPEG q80, EXIF stripped
                              (no geotags / camera serials ship to children)
  masters/photo/<key>.jpg     up to 2400px, for the book
  app/photo-manifest.js       window.IND_PHOTO = ['era-harappa-0', ...]
  app/photo-credits.js        window.IND_PHOTO_CREDITS = { key: {...} }
  docs/photo-credits.md       the same credits, human-readable
  tools/photo-sources.json    canonical state; makes the run resumable

USAGE
  python3 tools/fetch-photos.py plan            # list targets + queries (offline)
  python3 tools/fetch-photos.py fetch [key...]  # resumable fetch; optional key filter
  python3 tools/fetch-photos.py emit            # regenerate manifest + credits from state
  python3 tools/fetch-photos.py verify          # image<->credit<->manifest parity; exit 1 on drift

NETWORK MANNERS
  Descriptive User-Agent, ~1 request/second, and the API's own thumbnail
  rendering (iiurlwidth) instead of original files wherever possible.
"""

import html
import io
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_PHOTO_DIR = os.path.join(ROOT, "app", "art", "photo")
MASTER_DIR = os.path.join(ROOT, "masters", "photo")
STATE_PATH = os.path.join(ROOT, "tools", "photo-sources.json")
MANIFEST_PATH = os.path.join(ROOT, "app", "photo-manifest.js")
CREDITS_JS_PATH = os.path.join(ROOT, "app", "photo-credits.js")
CREDITS_MD_PATH = os.path.join(ROOT, "docs", "photo-credits.md")

API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "BizzingIndia/1.0 (content pipeline)"
THROTTLE_S = 1.0
APP_WIDTH = 1200
MASTER_WIDTH = 2400

# ---------------------------------------------------------------------------
# Targets
# ---------------------------------------------------------------------------

_NODE_EXTRACT = r"""
global.window = {};
require(process.argv[1] + '/app/data-itihaas.js');
require(process.argv[1] + '/app/data-states.js');
const out = [];
for (const era of window.IND_ITIHAAS.eras) {
  (era.today || []).forEach((t, i) =>
    out.push({ key: 'era-' + era.id + '-' + i, era: era.id, n: i,
               what: t.what, where: t.where, state: t.state }));
}
for (const [code, st] of Object.entries(window.IND_STATES)) {
  (st.places || []).slice(0, 2).forEach((p, i) =>
    out.push({ key: 'state-' + code + '-' + i, state: code, n: i,
               what: p.name, where: p.what }));
}
console.log(JSON.stringify(out));
"""

# Iconic artifacts named in era text but not present as today[] entries.
# Keys continue each era's today[] numbering, computed at runtime.
EXTRA_ARTIFACTS = {
    "harappa": [{"what": "An Indus seal with a humped bull",
                 "query": "Indus Valley seal bull Mohenjo-daro"}],
    "buddha-age": [{"what": "Punch-marked silver coins, India's first money",
                    "query": "punch-marked coin silver Magadha"}],
    "temple-builders": [{"what": "A carved stone wheel of the Konark sun chariot",
                         "query": "Konark Sun Temple wheel"}],
}

# Curated search queries. Anything not listed falls back to build_query().
# Reviewed by hand: names disambiguated (Rock Garden -> Chandigarh), sacred
# sites phrased toward architecture, people-heavy subjects steered to places.
QUERIES = {
    "era-harappa-0": "Dholavira archaeological site",
    "era-harappa-1": "Rakhigarhi archaeological site",
    "era-harappa-2": "Dancing Girl Mohenjo-daro bronze",
    "era-vedic-0": "Vadakkunnathan Temple Thrissur",
    "era-vedic-1": "Painted Grey Ware",
    "era-vedic-2": "Haridwar Ganges Har ki Pauri",
    "era-buddha-age-0": "Mahabodhi Temple Bodh Gaya",
    "era-buddha-age-1": "Dhamek Stupa Sarnath",
    "era-buddha-age-2": "Vaishali Ashokan pillar Kolhua",
    "era-maurya-0": "Sanchi Great Stupa",
    "era-maurya-1": "Lion Capital of Ashoka Sarnath",
    "era-maurya-2": "Dhauli rock edict",
    "era-gupta-0": "Ajanta Caves painting",
    "era-gupta-1": "Iron pillar of Delhi",
    "era-gupta-2": "Dashavatara Temple Deogarh",
    "era-souths-0": "Shore Temple Mahabalipuram",
    "era-souths-1": "Hampi bazaar street Virupaksha",
    "era-souths-2": "Kodungallur temple",
    "era-chola-0": "Brihadisvara Temple Thanjavur",
    "era-chola-1": "Gangaikonda Cholapuram temple",
    "era-chola-2": "Chola bronze Nataraja",
    "era-temple-builders-0": "Konark Sun Temple",
    "era-temple-builders-1": "Khajuraho Kandariya Mahadeva temple",
    "era-temple-builders-2": "Nalanda ruins stupa",
    "era-sultanate-mughal-0": "Qutb Minar",
    "era-sultanate-mughal-1": "Taj Mahal",
    "era-sultanate-mughal-2": "Charminar Hyderabad",
    "era-marathas-sikhs-0": "Raigad Fort",
    "era-marathas-sikhs-1": "Golden Temple Amritsar Harmandir Sahib",
    "era-marathas-sikhs-2": "Rang Ghar Sivasagar",
    "era-colonial-0": "Jallianwala Bagh memorial",
    "era-colonial-1": "Gateway of India Mumbai",
    "era-colonial-2": "Victoria Memorial Kolkata",
    "era-freedom-0": "Sabarmati Ashram Gandhi",
    "era-freedom-1": "Cellular Jail Port Blair",
    "era-freedom-2": "August Kranti Maidan Mumbai",
    "era-modern-0": "Statue of Unity",
    "era-modern-1": "Satish Dhawan Space Centre PSLV launch",
    "era-modern-2": "Rashtrapati Bhavan",
    "state-AN-0": "Radhanagar Beach Havelock",
    "state-AN-1": "Barren Island volcano Andaman",
    "state-AP-0": "Tirumala Venkateswara Temple",
    "state-AP-1": "Veerabhadra Temple Lepakshi",
    "state-AR-0": "Tawang Monastery",
    "state-AR-1": "Ziro Valley paddy",
    "state-AS-0": "Kaziranga one-horned rhinoceros",
    "state-AS-1": "Majuli river island",
    "state-BR-0": "Mahabodhi Temple Bodh Gaya",
    "state-BR-1": "Nalanda ruins stupa",
    "state-CH-0": "Rock Garden Chandigarh",
    "state-CH-1": "Chandigarh Capitol Complex Palace of Assembly",
    "state-CT-0": "Chitrakote Falls",
    "state-CT-1": "Kanger Valley National Park",
    "state-DD-0": "Moti Daman Fort",
    "state-DD-1": "Diu Fort",
    "state-DL-0": "Qutb Minar",
    "state-DL-1": "Humayun's Tomb Delhi",
    "state-DN-0": "Vanganga Lake Garden Silvassa",
    "state-DN-1": "Dudhni Lake Dadra",
    "state-GA-0": "Basilica of Bom Jesus Goa",
    "state-GA-1": "Aguada Fort lighthouse Goa",
    "state-GJ-0": "Asiatic lion Gir",
    "state-GJ-1": "Rann of Kutch white salt desert",
    "state-HP-0": "Key Monastery Spiti",
    "state-HP-1": "Kalka Shimla Railway",
    "state-HR-0": "Brahma Sarovar Kurukshetra",
    "state-HR-1": "Sultanpur National Park birds",
    "state-JH-0": "Shikharji Parasnath",
    "state-JH-1": "Betla National Park",
    "state-JK-0": "Dal Lake shikara Srinagar",
    "state-JK-1": "Shalimar Bagh Srinagar",
    "state-KA-0": "Hampi stone chariot Vittala",
    "state-KA-1": "Mysore Palace illuminated",
    "state-KL-0": "Alappuzha backwaters houseboat",
    "state-KL-1": "Munnar tea plantations",
    "state-LD-0": "Kavaratti lagoon Lakshadweep",
    "state-LD-1": "Minicoy lighthouse",
    "state-MH-0": "Kailasa temple Ellora",
    "state-MH-1": "Elephanta Caves Trimurti",
    "state-ML-0": "double decker living root bridge Nongriat",
    "state-ML-1": "Nohkalikai Falls Cherrapunji",
    "state-MN-0": "Loktak Lake phumdi",
    "state-MN-1": "Sangai deer Keibul Lamjao",
    "state-MP-0": "Bhimbetka rock painting",
    "state-MP-1": "Khajuraho temple",
    "state-MZ-0": "Phawngpui Blue Mountain Mizoram",
    "state-MZ-1": "Vantawng Falls",
    "state-NL-0": "Dzukou Valley",
    "state-NL-1": "Khonoma village Nagaland",
    "state-OR-0": "Konark Sun Temple",
    "state-OR-1": "Jagannath Temple Puri",
    "state-PB-0": "Golden Temple Amritsar Harmandir Sahib",
    "state-PB-1": "Virasat-e-Khalsa Anandpur Sahib",
    "state-PY-0": "Pondicherry French Quarter street",
    "state-PY-1": "Promenade Beach Pondicherry",
    "state-RJ-0": "Amber Fort Jaipur",
    "state-RJ-1": "Mehrangarh Fort Jodhpur",
    "state-SK-0": "Kangchenjunga from Sikkim",
    "state-SK-1": "Rumtek Monastery",
    "state-TN-0": "Meenakshi Amman Temple Madurai gopuram",
    "state-TN-1": "Brihadisvara Temple Thanjavur",
    "state-TR-0": "Neermahal palace",
    "state-TR-1": "Unakoti rock carving",
    "state-UK-0": "Valley of Flowers National Park",
    "state-UK-1": "Jim Corbett National Park",
    "state-UP-0": "Taj Mahal",
    "state-UP-1": "Varanasi ghats Ganges",
    "state-WB-0": "Sundarbans mangrove",
    "state-WB-1": "Victoria Memorial Kolkata",
    "state-TG-0": "Charminar Hyderabad",
    "state-TG-1": "Golconda Fort",
    "state-LA-0": "Thiksey Monastery",
    "state-LA-1": "Hemis Monastery",
}


def extract_targets():
    """Targets from the data files (via node, the app's own parser) + artifact extras."""
    out = subprocess.run(
        ["node", "-e", _NODE_EXTRACT, ROOT],
        capture_output=True, text=True, check=True, cwd=ROOT)
    targets = json.loads(out.stdout)
    per_era = {}
    for t in targets:
        if t["key"].startswith("era-"):
            per_era[t["era"]] = max(per_era.get(t["era"], 0), t["n"] + 1)
    for era, extras in EXTRA_ARTIFACTS.items():
        base = per_era.get(era)
        if base is None:
            continue  # era removed from data; skip its extras too
        for i, ex in enumerate(extras):
            targets.append({"key": f"era-{era}-{base + i}", "era": era,
                            "n": base + i, "what": ex["what"], "where": "",
                            "query": ex["query"]})
    return targets


_STOP = set("the a an of and in on at near with its it his her their whole one "
            "you can walk through where still after over from was were is are "
            "himself herself itself".split())


def build_query(target):
    """Fallback query when no curated one exists (future content growth)."""
    if target.get("query"):
        return target["query"]
    if target["key"] in QUERIES:
        return QUERIES[target["key"]]
    what = re.split(r"[,——]", target["what"])[0]
    words = [w for w in re.findall(r"[A-Za-z][A-Za-z'-]+", what)
             if w.lower() not in _STOP][:6]
    where = re.split(r"[,——]", target.get("where") or "")[0]
    wwords = [w for w in re.findall(r"[A-Za-z][A-Za-z'-]+", where)
              if w.lower() not in _STOP][:3]
    return " ".join(words + [w for w in wwords if w not in words])


# ---------------------------------------------------------------------------
# Commons API
# ---------------------------------------------------------------------------

_last_request = [0.0]


def _throttle():
    wait = THROTTLE_S - (time.monotonic() - _last_request[0])
    if wait > 0:
        time.sleep(wait)
    _last_request[0] = time.monotonic()


def http_get(url, binary=False, tries=3):
    for attempt in range(tries):
        _throttle()
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = resp.read()
            return data if binary else json.loads(data)
        except Exception as e:
            if attempt == tries - 1:
                raise
            time.sleep(2.0 * (attempt + 1))
    raise RuntimeError("unreachable")


def api(**params):
    params.update(format="json", formatversion="2")
    return http_get(API + "?" + urllib.parse.urlencode(params))


def search_candidates(query, limit=10, width=APP_WIDTH):
    """Search file namespace; return pages with imageinfo+extmetadata+thumburl."""
    data = api(
        action="query",
        generator="search",
        gsrsearch=f"filetype:bitmap {query}",
        gsrnamespace=6,
        gsrlimit=limit,
        prop="imageinfo",
        iiprop="extmetadata|url|size|mime",
        iiurlwidth=width,
    )
    return (data.get("query") or {}).get("pages") or []


def fileinfo(title, width):
    data = api(action="query", titles=title, prop="imageinfo",
               iiprop="url|size|mime", iiurlwidth=width)
    pages = (data.get("query") or {}).get("pages") or []
    return pages[0]["imageinfo"][0] if pages and pages[0].get("imageinfo") else None


# ---------------------------------------------------------------------------
# License gate — the entire point of this pipeline
# ---------------------------------------------------------------------------

_OK_CC = re.compile(r"^cc-(by(-sa)?)-\d", re.I)          # CC-BY / CC-BY-SA, any version
_OK_CC0 = re.compile(r"^cc0", re.I)
_PD = re.compile(r"^(pd|public domain)", re.I)
_BAD = re.compile(r"\b(nc|nd|noncommercial|non-commercial|noderiv)\b", re.I)


def _meta(page, field):
    info = (page.get("imageinfo") or [{}])[0]
    md = info.get("extmetadata") or {}
    v = md.get(field) or {}
    return (v.get("value") or "").strip()


def license_ok(page):
    """Return (accepted: bool, reason: str). Accept only CC0 / PD-reviewed /
    CC-BY / CC-BY-SA. Reject NC, ND, unlicensed, and bare PD claims."""
    lic = _meta(page, "License")
    short = _meta(page, "LicenseShortName")
    probe = f"{lic} {short}"
    if not probe.strip():
        return False, "no machine-readable license"
    if _BAD.search(probe.replace("-", " ")) or "-nc" in probe.lower() or "-nd" in probe.lower():
        return False, f"restricted license: {short or lic}"
    if _OK_CC0.search(lic) or _OK_CC0.search(short):
        return True, "CC0"
    if _OK_CC.search(lic) or _OK_CC.search(short.replace(" ", "-")):
        return True, short or lic
    if _PD.search(lic) or _PD.search(short):
        # PD only with Commons' machine-readable copyright flag as rationale —
        # a recent photo bare-tagged "PD" does not pass.
        if _meta(page, "Copyrighted") == "False":
            return True, "Public domain"
        return False, "PD claim without machine-readable rationale"
    return False, f"unrecognised license: {short or lic}"


# ---------------------------------------------------------------------------
# Candidate scoring
# ---------------------------------------------------------------------------

_PENALTY_WORDS = ["map", "plan", "diagram", "stamp", "banknote", "logo",
                  "coat of arms", "flag", "painting", "drawing", "sketch",
                  "engraving", "lithograph", "model", "replica", "poster",
                  "screenshot", "collage", "montage"]


def score(page, query):
    info = (page.get("imageinfo") or [{}])[0]
    s = 0.0
    assess = _meta(page, "Assessments").lower()
    if "featured" in assess:
        s += 30
    if "quality" in assess:
        s += 20
    if "valued" in assess:
        s += 8
    w = info.get("width") or 0
    if w >= APP_WIDTH:
        s += 10
    if w >= MASTER_WIDTH:
        s += 4
    if (info.get("mime") or "") == "image/jpeg":
        s += 5
    title = page.get("title", "").lower()
    qwords = [q.lower() for q in re.findall(r"[a-z][a-z'-]+", query.lower())]
    s += 2 * sum(1 for q in qwords if q in title)
    for bad in _PENALTY_WORDS:
        if bad in title and bad not in query.lower():
            s -= 12
    # people-shots: prefer the place over portraits (privacy: no identifiable
    # children ship; human review still required on top of this)
    for bad in ("selfie", "portrait", "boy", "girl", "child", "children",
                "student", "wedding"):
        if bad in title and bad not in query.lower():
            s -= 20
    return s


def strip_html(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip() or "Unknown"


# ---------------------------------------------------------------------------
# Image processing — Pillow re-encode strips EXIF (geotags, serials)
# ---------------------------------------------------------------------------

def save_jpeg(raw, path, max_width, quality):
    from PIL import Image
    img = Image.open(io.BytesIO(raw))
    img = img.convert("RGB")
    if img.width > max_width:
        img = img.resize((max_width, round(img.height * max_width / img.width)),
                         Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    # No `exif=` kwarg: Pillow writes no EXIF unless asked — that is the strip.
    img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    return img.width, img.height


# ---------------------------------------------------------------------------
# State + emission
# ---------------------------------------------------------------------------

def load_state():
    if os.path.exists(STATE_PATH):
        with open(STATE_PATH, encoding="utf-8") as f:
            return json.load(f)
    return {"credits": {}, "misses": {}}


def save_state(state):
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=1, ensure_ascii=False, sort_keys=True)
        f.write("\n")


def js_str(s):
    return "'" + str(s).replace("\\", "\\\\").replace("'", "\\'") + "'"


HEADER = ("GENERATED by tools/fetch-photos.py — do not hand-edit.\n"
          "   Freely-licensed photographs from Wikimedia Commons; every entry\n"
          "   carries author, license and source. An image without its credit\n"
          "   row must not ship (CLAUDE.md; enforced by `fetch-photos.py verify`).")


def emit(state):
    keys = sorted(state["credits"].keys())
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        f.write(f"/* Bizzing India — photo manifest. {HEADER}\n")
        f.write("   Keys have a photo at app/art/photo/<key>.jpg (max 1200px). */\n\n")
        f.write("window.IND_PHOTO = [\n")
        for k in keys:
            f.write(f"  {js_str(k)},\n")
        f.write("];\n\nwindow.IND_PHOTO_SRC = function (key) {\n")
        f.write("  return window.IND_PHOTO.indexOf(key) < 0 ? '' : 'art/photo/' + key + '.jpg';\n};\n")

    with open(CREDITS_JS_PATH, "w", encoding="utf-8") as f:
        f.write(f"/* Bizzing India — photo credits. {HEADER} */\n\n")
        f.write("window.IND_PHOTO_CREDITS = {\n")
        for k in keys:
            c = state["credits"][k]
            f.write(f"  {js_str(k)}: {{\n")
            f.write(f"    author: {js_str(c['author'])},\n")
            f.write(f"    license: {js_str(c['license'])},\n")
            f.write(f"    licenseUrl: {js_str(c.get('license_url') or '')},\n")
            f.write(f"    title: {js_str(c['title'])},\n")
            f.write(f"    source: {js_str(c['source'])}\n")
            f.write("  },\n")
        f.write("};\n")

    os.makedirs(os.path.dirname(CREDITS_MD_PATH), exist_ok=True)
    with open(CREDITS_MD_PATH, "w", encoding="utf-8") as f:
        f.write("# Photo credits\n\n")
        f.write("Generated by `tools/fetch-photos.py` — do not hand-edit. All photographs\n")
        f.write("are from [Wikimedia Commons](https://commons.wikimedia.org/) under the\n")
        f.write("license named per row (CC0, public domain, CC-BY or CC-BY-SA only). Images\n")
        f.write("are used as-is apart from downscaling; EXIF metadata is stripped for\n")
        f.write("privacy. An image without a credit row here must not ship.\n\n")
        f.write("| Key | Subject | Author | License | Source |\n")
        f.write("|-----|---------|--------|---------|--------|\n")
        for k in keys:
            c = state["credits"][k]
            subj = c.get("subject", "").replace("|", "\\|")
            author = c["author"].replace("|", "\\|")
            lic = c["license"]
            if c.get("license_url"):
                lic = f"[{lic}]({c['license_url']})"
            f.write(f"| `{k}` | {subj} | {author} | {lic} | [Commons]({c['source']}) |\n")
        f.write(f"\n{len(keys)} photographs.\n")


def verify(state):
    """Image <-> credit <-> manifest parity. Exit nonzero on any drift."""
    problems = []
    on_disk = set()
    if os.path.isdir(APP_PHOTO_DIR):
        on_disk = {f[:-4] for f in os.listdir(APP_PHOTO_DIR) if f.endswith(".jpg")}
    credited = set(state["credits"].keys())
    for k in sorted(on_disk - credited):
        problems.append(f"UNCREDITED image must not ship: app/art/photo/{k}.jpg")
    for k in sorted(credited - on_disk):
        problems.append(f"credit without image: {k}")
    manifest = set()
    if os.path.exists(MANIFEST_PATH):
        with open(MANIFEST_PATH, encoding="utf-8") as f:
            manifest = set(re.findall(r"'([a-zA-Z0-9_.-]+)',", f.read()))
    for k in sorted(on_disk - manifest):
        problems.append(f"image missing from manifest: {k}")
    for k in sorted(manifest - on_disk):
        problems.append(f"manifest entry without image: {k}")
    for k in sorted(credited):
        c = state["credits"][k]
        for field in ("title", "author", "license", "source"):
            if not c.get(field):
                problems.append(f"{k}: credit row missing `{field}`")
        if not os.path.exists(os.path.join(MASTER_DIR, k + ".jpg")):
            problems.append(f"warning: no master copy masters/photo/{k}.jpg")
    hard = [p for p in problems if not p.startswith("warning:")]
    for p in problems:
        print(("FAIL  " if not p.startswith("warning:") else "warn  ") + p)
    print(f"verify: {len(on_disk)} images, {len(credited)} credits, "
          f"{len(manifest)} manifest entries, {len(hard)} problems")
    return 1 if hard else 0


# ---------------------------------------------------------------------------
# Fetch
# ---------------------------------------------------------------------------

def fetch_one(target, state):
    key, query = target["key"], build_query(target)
    app_path = os.path.join(APP_PHOTO_DIR, key + ".jpg")
    if key in state["credits"] and os.path.exists(app_path):
        return "skip"
    pages = search_candidates(query)
    accepted = []
    for p in pages:
        if not (p.get("imageinfo") or [{}])[0].get("url"):
            continue
        ok, why = license_ok(p)
        if ok:
            accepted.append((score(p, query), why, p))
    if not accepted:
        state["misses"][key] = {"query": query,
                                "reason": "no acceptable license among "
                                          f"{len(pages)} results"}
        return "miss"
    accepted.sort(key=lambda t: -t[0])
    _, license_name, page = accepted[0]
    info = page["imageinfo"][0]
    title = page["title"]
    source = ("https://commons.wikimedia.org/wiki/" +
              urllib.parse.quote(title.replace(" ", "_")))

    # Credit row is recorded BEFORE the download — no image without its credit.
    state["credits"][key] = {
        "title": title,
        "subject": target["what"],
        "author": strip_html(_meta(page, "Artist")),
        "license": license_name,
        "license_url": _meta(page, "LicenseUrl"),
        "source": source,
        "query": query,
    }
    state["misses"].pop(key, None)
    save_state(state)

    # App copy from the API's own thumbnail rendering; master likewise at 2400.
    thumb = info.get("thumburl") or info.get("url")
    raw = http_get(thumb, binary=True)
    save_jpeg(raw, app_path, APP_WIDTH, 80)
    master_info = fileinfo(title, MASTER_WIDTH)
    mraw = (http_get(master_info.get("thumburl") or master_info["url"], binary=True)
            if master_info else raw)
    save_jpeg(mraw, os.path.join(MASTER_DIR, key + ".jpg"), MASTER_WIDTH, 88)
    return "ok"


def main(argv):
    cmd = argv[1] if len(argv) > 1 else "plan"
    targets = extract_targets()
    state = load_state()

    if cmd == "plan":
        for t in targets:
            mark = "done" if t["key"] in state["credits"] else "    "
            print(f"{mark}  {t['key']:28s}  {build_query(t)}")
        print(f"{len(targets)} targets, {len(state['credits'])} already fetched")
        return 0

    if cmd == "emit":
        emit(state)
        print(f"emitted {len(state['credits'])} credits -> "
              f"{MANIFEST_PATH}, {CREDITS_JS_PATH}, {CREDITS_MD_PATH}")
        return 0

    if cmd == "verify":
        return verify(state)

    if cmd == "fetch":
        only = set(argv[2:])
        counts = {"ok": 0, "skip": 0, "miss": 0, "error": 0}
        for t in targets:
            if only and t["key"] not in only:
                continue
            try:
                r = fetch_one(t, state)
            except Exception as e:
                r = "error"
                state["misses"][t["key"]] = {"query": build_query(t),
                                             "reason": f"error: {e}"}
                print(f"error {t['key']}: {e}", file=sys.stderr)
            counts[r] += 1
            if r in ("ok", "miss"):
                save_state(state)
            if r != "skip":
                print(f"{r:5s} {t['key']}")
        save_state(state)
        emit(state)
        code = verify(state)
        print("fetched {ok}, skipped {skip}, missed {miss}, errors {error}"
              .format(**counts))
        if state["misses"]:
            print("misses (need a human or a better query):")
            for k, m in sorted(state["misses"].items()):
                print(f"  {k}: {m['reason']}  [query: {m['query']}]")
        return code

    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
