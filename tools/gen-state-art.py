#!/usr/bin/env python3
"""Generate one hero painting per Indian state/UT for the Living Map state pages.

Why: tapping a state on the Living Map opens a page that needs a banner of that
place. Same house style as tools/gen-story-art.py so the map art and the story
art read as one painted book.

Usage:
    export GEMKEY=...            # never hardcode, never print
    python3 tools/gen-state-art.py                  # resumable: skips what exists
    python3 tools/gen-state-art.py --only KL,RJ     # force regenerate
    python3 tools/gen-state-art.py --workers 6
    python3 tools/gen-state-art.py --manifest-only

Output:
    app/art/state/<CODE>.jpg       900x600, progressive JPEG q78, uppercase code
    app/state-art-manifest.js      window.IND_STATE_ART = [...]

Prompt rules that were learned the hard way in this repo:
  * style declaration FIRST, subject after — style drifts otherwise
  * positive-only phrasing. Never list what you do not want: naming an artifact
    ("no text", "no border") reliably summons it. Say what you DO want instead.
  * 3:2 landscape, one continuous scene filling the frame
  * each state gets its OWN signature — landscape, monument, craft, dress, food,
    wildlife. Never generic India repeated 37 times.
  * reverent with anything sacred; the Sikh Gurus are NEVER depicted
    (docs/05-editorial-policy.md), so Punjab is the fields and the Harmandir
    Sahib seen at a distance, with no Guru figure at all.
  * Jammu & Kashmir is the lake, the chinars and the crafts. Landscape and craft
    only — nothing military, no border imagery, no flags anywhere.
  * gentle and welcoming: this is for children 4-12.
"""

import argparse
import base64
import io
import json
import os
import re
import sys
import time
import threading
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "app", "art", "state")
MANIFEST = os.path.join(ROOT, "app", "state-art-manifest.js")
ENDPOINT = ("https://generativelanguage.googleapis.com/v1beta/models/"
            "gemini-2.5-flash-image:generateContent")

WIDTH, HEIGHT, QUALITY = 900, 600, 78

# ---------------------------------------------------------------- house style --
# Byte-for-byte the STYLE paragraph from tools/gen-story-art.py, so the state
# banners sit convincingly beside the story paintings.
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
# state code -> the single most recognisable scene of that place.
PROMPTS = {

    "AN": p(
        "a curving white coral beach in the Andaman Islands: turquoise shallows so "
        "clear the coral gardens and bright striped reef fish show through, a wooden "
        "outrigger fishing boat with a painted hull drawn up on the sand, tall coconut "
        "palms and mangrove roots leaning right over the water, a green sea turtle "
        "gliding past and a thatched stilt house on the headland behind. Bright "
        "tropical light, aquamarine and jade and warm sand gold."),

    "AP": p(
        "an Andhra Pradesh scene at golden hour: a tall carved temple gopuram tower "
        "rising above wooded hills with pilgrims climbing the stone steps toward it, "
        "and in the foreground a Kuchipudi dancer in a pleated silk sari and temple "
        "jewellery poised on the ball of one foot on the rim of a brass plate; beside "
        "her a spread of scarlet chillies drying in the sun and a row of round-bodied "
        "painted Kondapalli wooden toy horses and birds. Warm ochre earth, coconut "
        "groves, Kalamkari flowering-tree pattern."),

    "AR": p(
        "the first sunrise over Arunachal Pradesh: a whitewashed hilltop monastery with "
        "sloping golden roofs and deep red timber galleries standing on a spur above a "
        "valley brimming with cloud, ranks of deep blue snow peaks catching hot pink "
        "and gold light behind it, long strings of prayer flags crossing the picture, "
        "whole hillsides of blazing scarlet rhododendron in flower, a great hornbill "
        "with a curved yellow bill perched small and complete on a branch to one side, "
        "and a family in Monpa woollen coats and yak-hair caps climbing the stone track "
        "with cane baskets on their backs past a row of little water-driven prayer "
        "wheels. Rich saturated dawn colour, deep indigo shadow, glowing gold."),

    "AS": p(
        "an Assam morning: rolling tea gardens of neat rounded green bushes running to "
        "the horizon in soft white mist, women in red-and-white cotton wraps plucking "
        "leaves into cane baskets carried on their heads, tall shade trees, and at the "
        "edge of the elephant grass a calm one-horned rhinoceros standing knee-deep in "
        "a marshy pool with egrets on his back; the wide silver Brahmaputra beyond and "
        "a conical bamboo japi hat resting on a fence post. Misty green and gold."),

    "BR": p(
        "a Bihar scene of quiet learning: the tall pointed brick tower of the great "
        "Bodh Gaya temple beside an enormous spreading bodhi tree whose heart-shaped "
        "leaves are turning gold, saffron-robed monks and villagers walking slowly "
        "around it, oil lamps in rows on the stone; behind, the long red-brick "
        "courtyards and stairways of an ancient monastery-university with students "
        "reading palm-leaf manuscripts, and a wall painted in bold Madhubani fish, "
        "peacocks and lotuses. Warm brick red, marigold, deep green."),

    "CH": p(
        "the Rock Garden of Chandigarh on a bright afternoon: winding walls and "
        "archways made of broken ceramic and mosaic, and rows of cheerful little "
        "sculpted figures and animals made from bangles and tiles standing in a "
        "courtyard; a waterfall spilling down a stepped wall, children walking through "
        "a low arched doorway, and beyond it a calm lake with rowing boats, a rose "
        "garden in flower and wide tree-lined boulevards laid out in neat green "
        "squares. Turquoise mosaic, terracotta, sunny greens."),

    "CT": p(
        "a Chhattisgarh scene in the rains: a wide horseshoe waterfall thundering in "
        "creamy curtains over a red rock ledge into a green gorge, rainbow spray, dense "
        "sal forest all around; on the bank a group of dancers in white and red with "
        "peacock-feather headdresses and big cylindrical drums, and in the foreground a "
        "Bastar dhokra brass horse and elephant with their fine coiled-wire pattern "
        "showing, plus a wall painted with white tribal figures. Monsoon green, "
        "laterite red, brass gold."),

    "DD": p(
        "a small sunny Portuguese-era seaside town at Daman and Diu: honey-coloured "
        "fort walls with round bastions running out into a blue-green sea, an old "
        "lighthouse and a whitewashed church with a bell tower and blue shutters, "
        "narrow lanes of pastel houses hung with washing, painted wooden fishing boats "
        "with high prows drawn up on the sand and fishermen spreading nets, palms "
        "leaning over the water. Sea blue, whitewash, warm stone gold."),

    "DL": p(
        "Delhi on a winter afternoon: the long red sandstone walls and domed gateway of "
        "the old fort with a great white-domed mosque and a tall fluted minaret tower "
        "rising behind it, a busy lane in front full of cycle rickshaws, a chaat "
        "seller's cart with little bowls of chutney and a brass pot, a jalebi pan, "
        "flower garlands and rolls of cloth; small paper kites of every colour flying "
        "high over the rooftops, and green parakeets on the wires. Rose sandstone, "
        "marigold, dusty gold light."),

    "DN": p(
        "a Dadra and Nagar Haveli village in Warli idiom set into the painted "
        "landscape: the mud walls of a thatched house covered with white stick-figure "
        "Warli painting — a great spiral ring of people dancing hand in hand around a "
        "tarpa player with his long gourd pipe, tiny huts, trees, birds and deer — "
        "while in front of the wall real villagers dance the same spiral on the swept "
        "earth; green hills, mango and teak trees and a river beyond. Deep terracotta "
        "red ground, white line, forest green."),

    "GA": p(
        "a Goa afternoon: a curving palm-fringed beach with brightly painted wooden "
        "fishing boats pulled up on the sand and nets drying on poles, a whitewashed "
        "church with a scrolled baroque façade and a bell tower on the green slope "
        "above, lanes of little houses in lemon yellow, blue and pink with tiled roofs "
        "and shell windows, a coconut palm arching over a red-earth road, and a plate "
        "of fish curry and rice on a table under a tree. Sea blue, whitewash, hibiscus, "
        "warm gold."),

    "GJ": p(
        "a Gujarat night of Navratri: a great ring of dancers in mirror-work chaniya "
        "choli and bandhani tie-dye whirling around a lamp-lit clay shrine, clapping "
        "wooden dandiya sticks, drummers to one side; behind them the flat white "
        "salt desert of the Rann shining silver under a big moon, a carved stepwell "
        "descending in tiers, and out on the scrub at the edge of the picture a calm "
        "Asiatic lion with a dark mane lying with his paws crossed. Mirror sparkle, "
        "magenta, saffron, indigo night."),

    "HP": p(
        "a Himachal valley in autumn: terraced apple orchards heavy with red fruit "
        "climbing the slope, women in woollen shawls and green Kinnauri caps filling "
        "wooden crates, a many-tiered wooden and slate temple with carved eaves and "
        "little brass bells, deodar cedars, a train of mules on the path, prayer flags "
        "and a whitewashed monastery on the far ridge, and great snow peaks above. "
        "Crisp blue sky, apple red, deodar green, snow white."),

    "HR": p(
        "a Haryana morning: an enormous sweep of ripening golden wheat under a wide "
        "sky, a tractor and a bullock cart on the field track, farmers in white kurtas "
        "and turbans and women in bright phulkari-embroidered shawls carrying brass "
        "water pots; in the foreground a round mud wrestling pit where two young "
        "wrestlers in langots grip each other's shoulders while friends sit round the "
        "rim cheering, a buffalo chewing nearby, blackbuck antelope in the far field "
        "and a peacock on the well wall. Wheat gold, phulkari pink and orange."),

    "JH": p(
        "a Jharkhand scene: a tall white waterfall dropping in steps through dark "
        "boulders into a pool ringed by sal forest, and beside it a village of "
        "mud houses whose walls are covered in Sohrai harvest painting — flowing black "
        "and white and red ochre cattle, peacocks, trees and lotus; villagers dance in "
        "a long line holding hands while a man plays a big barrel drum slung at his "
        "waist, and a herd of wild elephants moves quietly along the treeline. Ochre, "
        "charcoal line, deep forest green."),

    "JK": p(
        "a Kashmir afternoon on Dal Lake: carved wooden shikara boats with bright "
        "canopies and heart-shaped paddles gliding through floating gardens of lotus "
        "and lily, wooden houseboats with fretwork balconies moored along the "
        "waterfront, huge chinar trees in flaming autumn red and gold, terraced Mughal "
        "gardens with fountains climbing the hill and snow mountains behind; in the "
        "foreground a purple saffron field being picked into a basket, a hand-knotted "
        "carpet and a papier-mache bowl painted with tiny flowers. Lake blue, chinar "
        "crimson, saffron gold."),

    "KA": p(
        "the boulder landscape of Hampi in Karnataka at golden hour: enormous rounded "
        "granite boulders piled on the hills, a small exquisite stone temple chariot "
        "with carved wheels standing in a courtyard, long pillared bazaar colonnades, "
        "a river with round coracle boats, a temple elephant with painted patterns on "
        "her forehead being led along the path, and coffee slopes and banana groves "
        "beyond; a Yakshagana dancer in a huge painted crown and mirrored costume at "
        "the edge of the scene. Granite pink-gold, banana green, deep sky."),

    "KL": p(
        "a Kerala backwater at golden hour, the whole scene lit warm: a long low snake "
        "boat with a high curved gilded prow and many rowers in white mundu with red "
        "sashes sweeping down a palm-lined channel, their oars flashing, orange and "
        "gold sunset light pouring across the water and lighting the ripples, pink "
        "water lilies and lotus in the foreground; a red-tiled house with a carved "
        "wooden verandah on the bank, a tall brass lamp burning bright gold, a "
        "Kathakali dancer in a towering headdress and huge white skirt with a "
        "green-and-red painted face standing at the water's edge, marigold garlands, "
        "and a banana-leaf feast of little coloured dishes spread on the step. Warm "
        "gold and marigold against deep emerald green, glowing and rich."),

    "LD": p(
        "a busy Lakshadweep coral island shore at golden hour, densely painted and "
        "full of life: a grove of leaning coconut palms with patterned trunks shading a "
        "cluster of thatched and coral-stone houses, women in bright wraps drying fish "
        "and weaving coir rope on the warm sand, children running in the shallows; a "
        "slim wooden dhoni boat with a triangular sail and a carved painted hull moored "
        "in an impossibly clear turquoise lagoon, fishermen lifting silver tuna into "
        "cane baskets, and beneath the water a crowded coral garden of orange fans, "
        "blue staghorn and shoals of yellow and striped reef fish, a green turtle, a "
        "hermit crab and scattered patterned shells. Warm gold light on turquoise and "
        "jade, palm-green and coral-orange, rich and detailed."),

    "MH": p(
        "a Maharashtra monsoon morning: a black stone hill fort with stepped ramparts "
        "and an arched gateway riding the crest of a green Sahyadri ridge above "
        "cloud-filled valleys and a plunging waterfall; below in the foreground a "
        "rock-cut cave temple carved straight into the cliff with pillared verandahs "
        "and painted ceilings, and on the path a troupe of dhol-tasha drummers in "
        "saffron turbans with big drums slung at their waists and a lezim ring of "
        "dancers. Rain-washed emerald green, basalt grey, saffron."),

    "ML": p(
        "a Meghalaya gorge in the clouds: a living root bridge — the thick woven aerial "
        "roots of two rubber-fig trees grown together into a bridge — spanning a "
        "turquoise river far below, mossy and green, with a Khasi family in "
        "checked shawls and cane baskets crossing it single file; tall waterfalls "
        "dropping out of white cloud on both walls of the gorge, pines, orange trees "
        "and a bamboo hut on the ridge. Wet emerald green, mist white, cool blue."),

    "MN": p(
        "Loktak Lake in Manipur at dawn: perfect floating rings of grass and reed "
        "resting on the still water like green wheels, fishermen poling slim canoes "
        "between them and lifting conical bamboo fish traps, a thatched hut on one "
        "floating island; on the shore a Manipuri Raas dancer in a stiff embroidered "
        "cylindrical skirt and fine white veil turning slowly, a drummer beside her, "
        "and a shy brown Sangai deer with branching antlers watching from the reeds. "
        "Pearl dawn, mint green, rose and gold."),

    "MP": p(
        "the heart of Madhya Pradesh: the great hemispherical stone stupa of Sanchi on "
        "its hilltop terrace with an intricately carved gateway in front of it, and "
        "behind, a cluster of honey-coloured temple spires rising in tiers of carved "
        "figures; below, a sal forest where a calm striped tiger walks in dappled light "
        "past a rock shelter whose overhang is covered in ancient ochre stick paintings "
        "of hunters, deer and dancers; the Narmada winding away. Warm sandstone, sal "
        "green, ochre."),

    "MZ": p(
        "a Mizoram hillside in blue morning haze: ranks of soft blue-green mountains "
        "one behind the other under a warm gold morning sky, terraced fields and clumps "
        "of feathery bamboo, a village of houses on stilts along a high spine, orchids "
        "and red flowering trees; large in the foreground the cheraw bamboo dance — men "
        "kneeling in two rows tapping long bamboo poles together on the ground in "
        "rhythm while girls in scarlet, black and white striped puanchei wraps and tall "
        "flowered silver headdresses step lightly between them, hands linked, and "
        "drummers and a crowd watching from the grass. Warm gold light on bamboo green, "
        "hot scarlet and white, rich saturated colour."),

    "NL": p(
        "a Nagaland hill village during the hornbill festival: carved wooden house "
        "fronts with painted beams and a huge hollowed log drum in the open ground, "
        "dancers in red and black striped shawls, cowrie-shell sashes and tall "
        "feathered cane headdresses standing in a line and singing, an enormous "
        "communal fire, cane baskets and bowls of food; terraced rice fields dropping "
        "away into cloud below and blue ranges beyond. Deep red, black, ochre, "
        "firelight gold."),

    "OR": p(
        "the Konark sun temple in Odisha at sunrise: a colossal stone chariot wheel "
        "carved with spokes and medallions taller than a person, the great temple "
        "behind it with rows of carved stone horses and dancing figures, the sea "
        "glittering beyond the dunes; in the foreground an artist bent over a "
        "Pattachitra cloth scroll painting a bold-eyed figure with a fine brush, his "
        "colour pots around him, and an Odissi dancer in white silver jewellery in a "
        "tribhanga pose. Warm stone, sea blue, red-and-white Pattachitra border "
        "pattern woven into the scene."),

    "PB": p(
        "a Punjab afternoon with no single central figure: an endless blaze of yellow "
        "mustard flowers under a big blue sky, a red tractor on the field track and a "
        "buffalo at a hand pump, a village well and eucalyptus trees; in the foreground "
        "bhangra dancers in bright lungis and embroidered waistcoats leaping with their "
        "arms up while a man plays a big barrel dhol, and a girl in a phulkari shawl "
        "claps; far off across the fields, small and serene on the horizon, a golden "
        "domed shrine sits in the middle of a wide still pool of water. Mustard yellow, "
        "turquoise, warm gold light."),

    "PY": p(
        "a Puducherry street on a bright morning: a row of mustard-yellow colonial "
        "houses with white pilasters, tall green shutters and bougainvillea spilling "
        "over the compound walls, a bicycle leaning by a blue doorway, a cat on the "
        "step; the street opening at its end onto a seaside promenade with black rocks, "
        "a lighthouse and the blue Bay of Bengal, and a café table under a tree with a "
        "crisp golden dosa on a banana leaf beside a French loaf. Ochre yellow, "
        "white, magenta bougainvillea, sea blue."),

    "RJ": p(
        "Rajasthan at golden hour: a great honeycomb-coloured sandstone fort with "
        "domed pavilions, carved jali screens and stepped ramparts crowning a rocky "
        "hill above a lake, camels with tasselled saddles and their handlers coming "
        "along the dunes in long shadow, a woman in a mirrored ghagra and orange odhni "
        "carrying brass pots on her head; in the foreground a painted phad scroll "
        "stretched between two poles crowded with tiny orange and green figures, and a "
        "peacock on a wall. Desert gold, indigo, marigold, rose sky."),

    "SK": p(
        "a Sikkim morning: the huge white triple summit of Kanchenjunga above a valley "
        "of terraced organic fields and cardamom groves, a red-and-gold monastery with "
        "a curled roof on a spur with lines of prayer flags streaming from it, monks in "
        "maroon robes walking the path, rhododendrons in full flower, a yak with a "
        "woven blanket, and a rust-red panda curled in a bamboo tree in the foreground. "
        "Snow white, prayer-flag primaries, deep forest green."),

    "TN": p(
        "a Tamil Nadu temple town at dusk: an immense stepped gopuram tower packed with "
        "hundreds of brightly painted stucco figures rising over the street, oil lamps "
        "in rows along the temple wall, a white kolam of curling dots and loops drawn "
        "fresh on the red-washed doorstep in the foreground; a bronze dancing Nataraja "
        "in a ring of flame standing in a lamp-lit pillared hall inside, a woman in a "
        "silk Kanchipuram sari with jasmine in her hair, and idli and sambar on a "
        "banana leaf. Vermilion, temple gold, deep teal evening."),

    "TR": p(
        "a Tripura scene: a palace of white domes and long arcaded wings standing among "
        "gardens and reflected upside down in a wide still lake with fountains, a "
        "second small water palace far out in the middle of the water; groves of "
        "feathery bamboo all around, a woman weaving a striped risa cloth on a "
        "backstrap loom on a bamboo verandah, orange trees and pineapple, and a "
        "spectacled langur with a white face in the branches. Mirror-still water, "
        "bamboo green, warm cream stone."),

    "UK": p(
        "a Uttarakhand mountain morning in warm sunrise light: a milky turquoise river "
        "bursting from under the blue snout of a glacier and running over grey boulders "
        "through a deep valley, great snow peaks above it blazing rose and gold; on a "
        "rock terrace beside the water a small carved stone temple with a stepped "
        "pyramid roof, a red flag and marigold garlands, pilgrims in shawls climbing "
        "its steps with brass trays of flowers; a wooden footbridge, tall deodar "
        "cedars, an alpine meadow thick with blue and yellow wildflowers, a monal "
        "pheasant with iridescent copper and green feathers standing on a boulder, and "
        "a village doorway painted with red-and-white aipan folk pattern. Saturated "
        "rose-gold light, glacier turquoise, deep pine green."),

    "UP": p(
        "Uttar Pradesh at sunrise on the Yamuna: a white marble domed mausoleum with "
        "four slender towers and a long reflecting watercourse of dark cypresses "
        "glowing rose in the early light on the far bank, a flock of birds crossing the "
        "sky; in the foreground broad stone river steps where wooden boats are moored "
        "and people set little leaf-boats of flowers and lamps afloat on the water, a "
        "man in a white kurta with a brass pot, marble inlay of flowers on a screen, "
        "and green parakeets. Pearl white, rose gold, river blue."),

    "WB": p(
        "Kolkata on a Durga Puja morning: a tall decorated pandal pavilion of bamboo, "
        "cloth and gold ornament, and inside it a clay idol group with a serene "
        "many-armed mother goddess on her lion, painted reverently in the Bengali "
        "folk-clay idiom; dhaki drummers with feathered drums and women in red-bordered "
        "white saris throwing red powder and blowing conches, an alpona rice-paste "
        "pattern on the ground; a yellow taxi and a tram in the street, the tall "
        "girders of a great river bridge in the haze, and a terracotta temple wall. "
        "Marigold, sindoor red, morning gold."),

    "TG": p(
        "Telangana at dusk: a great square gateway monument with four tall fluted "
        "minarets and arched openings glowing under lamplight in the middle of a busy "
        "old bazaar, shops hung with hundreds of glass bangles in every colour, a "
        "pearl-seller's tray; on the rocky hill behind, the long walls and domed "
        "pavilions of a granite hill fort; in the foreground women stacking a tall cone "
        "of marigold and chrysanthemum flowers for Bathukamma on a brass plate, and a "
        "steaming platter of biryani with a boiled egg. Bangle turquoise and magenta, "
        "granite grey, lamp gold."),

    "LA": p(
        "Ladakh in thin bright mountain light: a white-and-ochre monastery of stacked "
        "flat-roofed buildings clinging to the top of a rocky cliff above a green ribbon "
        "of barley fields and poplars in a bare brown valley, long lines of prayer "
        "flags and a row of whitewashed chortens along the path, a monk in maroon robes "
        "turning a big prayer wheel, two double-humped bactrian camels and a shaggy yak "
        "on the cold sand dunes, and enormous snow peaks under a deep cobalt sky. "
        "Cobalt, ochre, barley gold, prayer-flag primaries."),
}


# --------------------------------------------------------------------- utils --
def state_codes():
    """Read the codes out of app/data-geo.js: the `states` keys plus `pending`."""
    path = os.path.join(ROOT, "app", "data-geo.js")
    with open(path, encoding="utf-8") as fh:
        src = fh.read()
    body = src.split("states: {", 1)[1].split("\n  },", 1)[0]
    codes = re.findall(r"^\s{4}([A-Z]{2}):\s*\{", body, flags=re.M)
    codes += re.findall(r"code:\s*'([A-Z]{2})'", src)
    seen, out = set(), []
    for c in codes:
        if c not in seen:
            seen.add(c)
            out.append(c)
    return out


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
            texts = [q.get("text", "") for q in data["candidates"][0]["content"]["parts"]]
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


def write_manifest(codes):
    lines = [
        "/* Bizzing India — state hero artwork index. Generated by tools/gen-state-art.py.",
        "   Codes listed here have a painting at app/art/state/<CODE>.jpg (900x600). */",
        "window.IND_STATE_ART = [",
    ]
    lines += ["  '%s'," % c for c in codes]
    lines += ["];", ""]
    with open(MANIFEST, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))


# ---------------------------------------------------------------------- main --
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma-separated state codes to (re)generate")
    ap.add_argument("--manifest-only", action="store_true")
    ap.add_argument("--workers", type=int, default=4)
    args = ap.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)
    known = state_codes()
    missing = [c for c in known if c not in PROMPTS]
    if missing:
        print("WARNING no prompt for:", ", ".join(missing))

    if not args.manifest_only:
        key = os.environ.get("GEMKEY")
        if not key:
            sys.exit("GEMKEY not set")

        wanted = [c for c in known if c in PROMPTS]
        force = set()
        if args.only:
            force = {s.strip().upper() for s in args.only.split(",") if s.strip()}
            wanted = [c for c in wanted if c in force]

        lock = threading.Lock()

        def one(code):
            path = os.path.join(OUT_DIR, code + ".jpg")
            if code not in force and os.path.exists(path) and os.path.getsize(path) > 4000:
                with lock:
                    print("skip  ", code)
                return
            try:
                png = generate(PROMPTS[code], key)
                to_jpeg(png, path)
                with lock:
                    print("made  ", code, "%.0f kB" % (os.path.getsize(path) / 1024))
            except Exception as err:
                with lock:
                    print("FAIL  ", code, err)

        with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
            list(pool.map(one, wanted))

    have = [c for c in known
            if os.path.exists(os.path.join(OUT_DIR, c + ".jpg"))]
    write_manifest(have)
    total = sum(os.path.getsize(os.path.join(OUT_DIR, c + ".jpg")) for c in have)
    print("\n%d/%d images, %.2f MB total" % (len(have), len(known), total / 1e6))


if __name__ == "__main__":
    main()
