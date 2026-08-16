#!/usr/bin/env python3
"""Generate one hero painting per Bizzing India story.

Why: docs/10-the-corpus.md sec 3.5 — "Artwork does the work of a grandmother's face.
It has to be beautiful or none of this lands." Each story gets one painting of its
single most iconic moment, in the same house style as app/art/banner/*.jpg.

Usage:
    export GEMKEY=...            # never hardcode, never print
    python3 tools/gen-story-art.py                 # resumable: skips what exists
    python3 tools/gen-story-art.py --only pt.lion-rabbit,ka.ganesha-race   # regen
    python3 tools/gen-story-art.py --manifest-only

Output:
    app/art/story/<slug>.jpg      900x600, JPEG q78
    app/story-art-manifest.js     window.IND_STORY_ART = [...]

Prompt rules that were learned the hard way in this repo:
  * style declaration FIRST, subject after — style drifts otherwise
  * positive-only phrasing. Never list what you do not want: naming an artifact
    ("no text", "no border") reliably summons it. Say what you DO want instead.
  * 3:2 landscape, one continuous scene filling the frame
  * deities reverently in a folk-art idiom, identified by traditional attributes
  * the Sikh Gurus are NEVER depicted (docs/05-editorial-policy.md) — the Sikh
    stories are composed around the langar, the sarovar, the Khanda, the food and
    the people, with no Guru figure at all
  * peril is fine for ages 4-12; terror, gore and weapons-in-use are not
"""

import argparse
import base64
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "app", "art", "story")
MANIFEST = os.path.join(ROOT, "app", "story-art-manifest.js")
ENDPOINT = ("https://generativelanguage.googleapis.com/v1beta/models/"
            "gemini-2.5-flash-image:generateContent")

WIDTH, HEIGHT, QUALITY = 900, 600, 78

# ---------------------------------------------------------------- house style --
# Kept identical for every story so the 38 read as one painted book.
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


# ------------------------------------------------------------------- the list --
# id -> prompt subject. One iconic moment each.
PROMPTS = {

    # ===================================================== data-stories.js =====
    "pt.lion-rabbit": p(
        "a great golden lion leaning far over the mossy rim of an ancient stone well "
        "in a moonlit forest clearing, gazing down at his own reflection shining back "
        "up at him from the still black water; a very small brown rabbit sits calmly "
        "in the tall grass a little way behind him, watching. Silver moonlight, "
        "fireflies, deep indigo night, banyan roots and painted foliage all around."),

    "pt.monkey-crocodile": p(
        "a cheerful monkey riding on the broad back of a big smiling crocodile in the "
        "middle of a wide sunlit river, purple jamun fruit bobbing on the water around "
        "them; on the bank a huge jamun tree heavy with purple fruit leans over the "
        "water. Warm afternoon gold, lotus leaves, kingfishers, rippling painted water."),

    "pt.talkative-tortoise": p(
        "a plump tortoise gripping the middle of a stick with his mouth, carried high "
        "through a wide golden sky by two white geese holding either end of the stick "
        "in their beaks; far below, a patchwork of green and ochre Indian fields, a "
        "little walled town, and tiny villagers on the road looking up and pointing. "
        "Sunlit clouds, flocking birds, airy and joyful."),

    "pt.blue-jackal": p(
        "a jackal whose fur is a deep glorious indigo blue standing proudly on a flat "
        "rock in a forest clearing at dawn, while a lion and a tiger bow their heads "
        "low before him and other animals kneel in a ring; behind them, glimpsed "
        "through the trees, a dyer's yard with great round vats and lengths of indigo "
        "cloth hanging out to dry. Rose-gold morning light, rich pattern."),

    "ab.shorter-line": p(
        "a marble Mughal court hall: a clever minister in a white robe kneeling on the "
        "polished floor with a piece of white chalk, drawing a second long straight "
        "chalk stroke on the floor beside a shorter one, while the emperor on his "
        "brocade cushion leans forward laughing and the courtiers crane in astonished. "
        "Scalloped arches, hanging lamps, carpets, warm lamplight."),

    "ab.khichdi": p(
        "a palace courtyard at night: a small bright fire burning on the ground, and "
        "high above it — dangling from a tall wooden pole a good four feet up — a round "
        "clay cooking pot swinging far out of reach of the flames; a minister sits "
        "calmly cross-legged beside the fire fanning it, while the emperor stands "
        "staring up at the impossible pot. Lanterns, moonlight, stone arches."),

    "ab.crows": p(
        "a row of glossy black crows squabbling along the top of a red sandstone palace "
        "wall against a rose-gold evening sky, a whole wheeling flock of them above the "
        "white domes and minarets; on a marble balcony below, an emperor and his "
        "minister lean on the railing watching the birds. Warm dusk, painted birds "
        "everywhere, jali screens."),

    "ka.ganesha-race": p(
        "drawn reverently in a folk-art idiom: the elephant-headed Ganesha, round and "
        "gentle, walking slowly in a circle around his mother and father who sit "
        "together on a lotus seat on a snowy Himalayan peak; his small mouse trots "
        "beside his feet, and a single golden mango glows in the air above. Kailash "
        "snow, lotus, moon, soft radiant light, ornamental painted borders of leaves."),

    "ka.hanuman-leap": p(
        "drawn reverently in a folk-art idiom: Hanuman the mighty vanara, mace at his "
        "side and a garland at his neck, launching in a great arc from a cracking "
        "mountain top out over a bright sea, trees and blossom and leaves torn up and "
        "swirling along in his wake; below him the sea flattens into a shining golden "
        "road toward a distant island, and a small mountain rises out of the water. "
        "Dawn light, spray, sweeping painted clouds."),

    "ka.buddha-mustard": p(
        "a village lane at dusk with a row of warm lit doorways: a woman in a simple "
        "sari stands at one threshold with her hands open and empty, and a small brass "
        "bowl of tiny mustard seeds sits on the step in front of her while the "
        "householder gently shakes her head; far down the lane, under a spreading "
        "bodhi tree, the seated Buddha glows softly, drawn reverently in a folk-art "
        "idiom. Lamps, doves, blue evening, mango leaves."),

    "ka.mahavira-elephant": p(
        "six calm men with their eyes gently closed standing around an enormous "
        "patterned elephant in a courtyard, each touching a different part of him — one "
        "holding the curling trunk, one the great fanning ear, one with his arms round "
        "a leg, one a hand flat on the side, one at the tusk, one holding the tail like "
        "a rope; the elephant stands patient and kind, his hide covered in Madhubani "
        "flowers and fish and spirals. Warm ochre ground, bright decorative colour."),

    # ============================================ data-stories-regional.js =====
    "fk.kiranmala": p(
        "a brave Bengali girl in a red-bordered white sari climbing a steep white stone "
        "mountain path with her chin high, singing aloud, her hands over her own ears; "
        "the slope behind and below her is scattered with pale boulders shaped almost "
        "like sleeping young men; at the summit ahead, a golden cage holding a bright "
        "talking bird, a tree whose branches are strung with tiny bells, and a spring "
        "of silver water. Dawn sky, mist, painted flowering vines."),

    "wt.gopal-smell": p(
        "a Bengali royal court: a laughing jester in a dhoti holding a fat cloth bag of "
        "coins up beside the ear of a plump sweet-shop keeper and shaking it, while the "
        "raja on his cushioned seat rocks back roaring with laughter and the whole court "
        "leans in; brass trays piled with orange jalebi and white sandesh in the "
        "foreground. Warm lamplight, terracotta temple carving, alpona floor patterns."),

    "wt.tenali-thieves": p(
        "a moonlit south Indian garden of broad plantain leaves around an old stone "
        "well: four weary thieves hauling up dripping buckets and sloshing water out "
        "across the vegetable beds, which are lush and thriving; at a shuttered window "
        "of the tiled house behind, a man watches, thoroughly amused, with his wife "
        "beside him. Silver moonlight, warm lamp glow at the window, coconut palms."),

    "ep.squirrel-bridge": p(
        "a small striped palm squirrel, soaked and coated in wet sand, standing on a "
        "great causeway of boulders that reaches out across a turquoise sea; behind her "
        "the vanaras heave enormous rocks into place; in the foreground a large gentle "
        "hand reaches down and rests three fingers along her back. Bright southern "
        "coast, foam, gulls, sunlit water, painted rock pattern."),

    "fk.mahabali": p(
        "an Onam morning in Kerala: a huge circular pookalam of concentric rings of "
        "flower petals — marigold, white, purple — laid on the swept ground before a "
        "tiled house, a brass lamp burning at its centre, banana-leaf feasts spread out "
        "and a whole family standing to welcome a smiling round old king with a golden "
        "umbrella; beyond, a long snake boat with many rowers on the green backwaters. "
        "Coconut palms, monsoon-washed light, deep greens and gold."),

    "fk.pabuji": p(
        "a Rajasthani desert night: a bhopa singer in a red turban touching a long "
        "painted cloth scroll stretched between two poles with a stick, while his wife "
        "holds up a small oil lamp that lights one patch of it — and the lit patch shows "
        "a chief on a black mare riding hard through a crowd of tiny orange and green "
        "painted figures; villagers and children sit wrapped in shawls in the sand "
        "watching, camels resting behind them. Starry sky, lamp glow, phad colours."),

    "fk.lambikin": p(
        "a small round painted drum rolling merrily down a sunny forest path, tilted "
        "mid-roll as though singing to itself; sitting politely in a row along the "
        "roadside a jackal, a vulture, a shaggy bear and a big striped tiger all watch "
        "it go past with puzzled friendly faces; a grandmother's little house with a "
        "green door waits at the end of the path. Mustard fields, dappled sun, comic "
        "and warm."),

    "sk.sacha-sauda": p(
        "a Punjab roadside grove with no single central figure: a long row of thin "
        "travelling holy men seated cross-legged on the ground eating together from "
        "leaf plates, great steaming pots of dal and stacks of hot roti over a wood "
        "fire, hands ladling out food, an empty knotted cloth lying open and flat on "
        "the grass beside the pots; blazing yellow mustard fields and a village well "
        "beyond, and high in the sky a softly glowing Khanda emblem. Golden late "
        "afternoon light, chinar and kikar trees."),

    "sk.langar-akbar": p(
        "the inside of a langar hall: long rows of people of every kind sitting "
        "cross-legged on the floor in lines eating from leaf plates — farmers, "
        "travellers, children, a potter still dusted with clay, a richly dressed "
        "visitor sitting in the same row as everybody else; sevadars walk the rows with "
        "buckets of dal and towers of roti, hands serving and hands held out; sandals "
        "left in pairs at the low doorway, and above the door a glowing Khanda emblem. "
        "Warm steam, lamplight, no throne and no chairs anywhere."),

    "fk.shivaji-baskets": p(
        "a red sandstone gateway in Agra at first light: two porters carrying an "
        "enormous flat wicker basket heaped with sweets and fruit slung from a pole on "
        "their shoulders, with a second basket behind them, walking out past bored "
        "yawning guards who wave them through without looking; marigold garlands, "
        "sweet-sellers, dust and long golden shadows, domes and minarets behind."),

    "fk.unfinished-hands": p(
        "a temple workshop room at Puri in Pattachitra idiom: a door standing newly "
        "open with a shaft of daylight falling across the empty floor, and three great "
        "carved wooden figures standing there — enormous round eyes, wide painted "
        "smiles, brilliant black and white and yellow, and short unfinished arms; wood "
        "shavings and a chisel on the ground, a queen at the doorway with her hand on "
        "the frame; the sea and temple towers beyond. Bold Odia painted line and colour."),

    "fk.naga-brothers": p(
        "a Naga hill village on a high ridge at dusk with cloud drifting in through the "
        "doorways: a thatched wooden longhouse with carved beams and a fire glowing "
        "inside, a man standing in the lit doorway, an old mother seated on the step "
        "with her hand raised, and at the edge of the dark treeline a tiger pausing to "
        "look back over his shoulder; a soft shape of mist among the rocks and tall "
        "trees. Blue evening, terraced hills, warm fire glow, woven shawl patterns."),

    "fk.khasi-sun": p(
        "a rooster standing tall and bright at the mouth of a dark cave in the Khasi "
        "hills, crowing, as the first flood of golden sunlight pours out past him and "
        "spills over pine trees, a living-root bridge and a valley filled with cloud; a "
        "tiger, an elephant, a bear and a crowd of animals wait a little way off in the "
        "half-light, watching. Waterfalls, mist, radiant dawn colour."),

    "fk.chakli-kagdo": p(
        "a monsoon night in a Gujarat village: high in the fork of a neem tree a small "
        "smooth round house glows warm from its one lit window, rain streaming off it; "
        "a very wet crow with his feathers plastered flat stands on the branch outside, "
        "and a little sparrow holds the tiny door open for him. Sheets of silver rain, "
        "lightning-lit clouds, village roofs below, warm gold against cool blue."),

    "fk.punyakoti": p(
        "dusk among great rounded granite boulders in Karnataka: a white cow stands "
        "quietly facing a big striped tiger who has sat down and drawn back to the side "
        "of the path to let her pass, his head lowered; far behind her the herd and her "
        "small calf watch from the gateway of a thatched cattle shed. Mellow gold "
        "evening light, long shadows, painted grasses and flowering trees."),

    "jn.bahubali": p(
        "drawn reverently in a Jain folk-art idiom: a tall serene standing figure in a "
        "forest clearing, perfectly still with his arms at his sides and his hands "
        "open, creepers and flowering vines curling all the way up his legs, anthills "
        "risen at his feet and small birds nesting in his hair; two great armies sit "
        "peacefully on the grass far away in the distance, watching. Karnataka hills, "
        "granite outcrops, soft green light, falling petals."),

    "wt.tenali-dolls": p(
        "a Vijayanagara pillared granite court hall: three identical little painted "
        "wooden dolls standing in a row on a spread of red velvet, while a witty poet "
        "leans over them feeding a fine white thread into the ear of one; the king and "
        "his courtiers crowd in around the cloth, and a visiting scholar sits stiffly "
        "to one side. Carved pillars, brass lamps, warm gold light."),

    "wt.gonu-brinjal": p(
        "in bold Madhubani idiom with heavy black line and flat bright colour: a Mithila "
        "court where a brass plate piled with glossy purple brinjals sits on a low "
        "table, the raja rocking back on his seat mid-laugh, a quick-witted courtier "
        "standing with his palms spread wide and innocent, and ministers pointing at him "
        "all at once. Fish, peacocks, lotuses and dense pattern filling every gap."),

    "jt.quails-net": p(
        "a hundred small brown quails rising together out of a golden barley field at "
        "sunrise, all lifting one wide net between them with their heads poked through "
        "its holes, the net billowing like a sail above the crop; below, a fowler stands "
        "in the stubble with his arms slack and his mouth open, and a thorn bush waits "
        "ahead. Long dawn light, dust motes, flocking birds, painted wheat pattern."),

    "jn.chandkaushik": p(
        "a hushed green forest path where the grass around an old tree is scorched "
        "bare: a great patterned serpent lies coiled and utterly quiet on the ground at "
        "the bare feet of a standing figure who is completely still with his eyes "
        "closed, drawn reverently in a Jain folk-art idiom; a small trickle of "
        "milk-white light runs from a mark on his foot, and villagers peer out from "
        "between the trees at a safe distance. Dappled green shade, calm, no movement."),

    "wt.kashmir-carry": p(
        "a Kashmir road on a long golden afternoon: a small farmer with a bundle on his "
        "back and a large well-dressed traveller walking side by side, deep in "
        "conversation, past a field of tall ripe gold wheat; chinar trees turning "
        "russet, a wooden farmhouse ahead where a girl sits laughing on the doorstep, "
        "snow mountains beyond. Warm slanting light, papier-mache floral pattern in the "
        "painted borders of the landscape."),

    "fk.lingo-song": p(
        "in strong Gond painting idiom, every animal filled with tiny dots and fine "
        "parallel lines: a man seated on the ground in a night forest playing a "
        "one-stringed gourd fiddle, and the note travelling out from it across the "
        "valley as great curling ribbons of pattern that bounce back off the far hill; "
        "deer stand at the edge of the clearing listening, birds line the branches, and "
        "villagers come out of their houses tapping their feet. Deep blue night, hot "
        "pink and ochre pattern, a fire glowing."),

    "wt.vetala-tree": p(
        "a moonless starry night in a forest: a calm crowned king walking steadily "
        "along a path with a friendly folded bat-winged spirit riding comfortably on "
        "his back, chattering away and gesturing with one long hand; behind them the "
        "old gnarled tree it came down from, its branches full of fireflies. Deep "
        "midnight blue and gold, whimsical rather than fearsome, painted stars."),

    "jt.banyan-deer": p(
        "a palace courtyard beside a huge spreading banyan tree at sunrise: a "
        "golden-coated deer standing quietly and willingly with his head bowed on a low "
        "stone block, while the astonished cook steps back with his hands up and the "
        "king comes running through the archway; at the edge of the courtyard a doe and "
        "her small fawn watch. Warm morning gold, aerial roots, painted flowering vines."),

    "jt.hare-moon": p(
        "a riverbank at night under an enormous full moon: a little hare sits perfectly "
        "comfortable in the middle of a small ring of cool silver flames that clearly "
        "do not burn him, while an old traveller in softly glowing robes reaches up "
        "toward the moon, where the pale shape of a hare is appearing among the grey "
        "markings; a monkey with mangoes, a jackal with a pot of curds and an otter "
        "with a fish watch from the grass. Silver and indigo night, reeds, fireflies."),

    "ep.yaksha-lake": p(
        "a forest lake at dusk so still it looks like a polished floor: a calm prince "
        "stands at the water's edge with one hand raised, not drinking, while his four "
        "brothers lie peacefully asleep along the bank like sleepers under a blanket; a "
        "soft golden glow and a slow ring of ripples spread out in the middle of the "
        "water where a voice is speaking. Deer at the far shore, fireflies, deep teal "
        "and gold, painted reeds and lotus."),

    "ep.bhima-hanuman": p(
        "a narrow Himalayan mountain path squeezed between two grey rocks: a very old "
        "grey-muzzled monkey lies dozing in the sun with one eye open and his long tail "
        "stretched right across the path like a fallen rope, while an enormous "
        "broad-shouldered young man braces his feet and heaves at the tail with both "
        "hands, red-faced and getting nowhere. Rhododendron blossom, snow peaks, "
        "pine, a rushing stream, bright thin mountain light."),
}


# --------------------------------------------------------------------- utils --
def slug(story_id):
    return re.sub(r"[^a-z0-9]+", "-", story_id, flags=re.I).lower().strip("-")


def story_ids_from_data():
    """Read the ids out of the two data files so we can assert full coverage."""
    ids = []
    for name in ("data-stories.js", "data-stories-regional.js"):
        path = os.path.join(ROOT, "app", name)
        with open(path, encoding="utf-8") as fh:
            src = fh.read()
        ids += re.findall(r"^\s*id:\s*'([^']+)'", src, flags=re.M)
    return ids


def to_jpeg(png_bytes, path):
    im = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    w, h = im.size
    target = WIDTH / HEIGHT
    if w / h > target:                       # too wide -> crop sides
        new_w = int(round(h * target))
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    elif w / h < target:                     # too tall -> crop top/bottom
        new_h = int(round(w / target))
        top = (h - new_h) // 2
        im = im.crop((0, top, w, top + new_h))
    im = im.resize((WIDTH, HEIGHT), Image.LANCZOS)
    im.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True)


def generate(prompt, key):
    """One call. Returns PNG bytes. Retries 3x with backoff on 429/5xx."""
    body = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode()
    last = None
    for attempt in range(3):
        req = urllib.request.Request(
            ENDPOINT, data=body,
            headers={"Content-Type": "application/json", "X-goog-api-key": key})
        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                data = json.load(resp)
            for part in data["candidates"][0]["content"]["parts"]:
                if "inlineData" in part:
                    return base64.b64decode(part["inlineData"]["data"])
            # a text-only answer means the model declined or chatted
            texts = [p.get("text", "") for p in data["candidates"][0]["content"]["parts"]]
            raise RuntimeError("no image returned: " + " ".join(texts)[:180])
        except urllib.error.HTTPError as err:
            last = "HTTP %s" % err.code
            if err.code in (429, 500, 502, 503, 504):
                time.sleep(4 * (2 ** attempt))
                continue
            raise RuntimeError("%s %s" % (last, err.read()[:200].decode("utf8", "replace")))
        except Exception as err:                     # network hiccup, malformed body
            last = str(err)[:180]
            time.sleep(4 * (2 ** attempt))
    raise RuntimeError(last or "failed")


def write_manifest(slugs):
    lines = [
        "/* Bizzing India — story hero artwork index. Generated by tools/gen-story-art.py.",
        "   Slugs listed here have a painting at app/art/story/<slug>.jpg (900x600). */",
        "window.IND_STORY_ART = [",
    ]
    lines += ["  '%s'," % s for s in slugs]
    lines += ["];", ""]
    with open(MANIFEST, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))


# ---------------------------------------------------------------------- main --
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma-separated story ids to (re)generate")
    ap.add_argument("--manifest-only", action="store_true")
    args = ap.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)
    known = story_ids_from_data()
    missing_prompts = [i for i in known if i not in PROMPTS]
    if missing_prompts:
        print("WARNING no prompt for:", ", ".join(missing_prompts))

    if not args.manifest_only:
        key = os.environ.get("GEMKEY")
        if not key:
            sys.exit("GEMKEY not set")

        wanted = known
        force = set()
        if args.only:
            force = {s.strip() for s in args.only.split(",") if s.strip()}
            wanted = [i for i in known if i in force]

        for sid in wanted:
            path = os.path.join(OUT_DIR, slug(sid) + ".jpg")
            if sid not in force and os.path.exists(path) and os.path.getsize(path) > 4000:
                print("skip  ", sid)
                continue
            try:
                png = generate(PROMPTS[sid], key)
                to_jpeg(png, path)
                print("made  ", sid, "%.0f kB" % (os.path.getsize(path) / 1024))
            except Exception as err:
                print("FAIL  ", sid, err)
            time.sleep(1)

    have = [slug(i) for i in known
            if os.path.exists(os.path.join(OUT_DIR, slug(i) + ".jpg"))]
    write_manifest(have)
    total = sum(os.path.getsize(os.path.join(OUT_DIR, s + ".jpg")) for s in have)
    print("\n%d/%d images, %.2f MB total" % (len(have), len(known), total / 1e6))


if __name__ == "__main__":
    main()
