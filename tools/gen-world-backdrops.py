#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Painted full-page backdrops for the worlds.

Each world gets a painted day and night backdrop (16:9, palette-locked to the
world's own tokens in app/worlds-art.js), saved to app/art/worlds/{id}-{mode}.jpg
with a manifest the runtime reads. A painted backdrop replaces the world's
drawn SVG scene wholesale; a world without one on disk keeps its drawn scene.

    set -a; . keys.env; set +a   # GEMKEY — never hardcode, never print
    export IMG_MODEL=...         # the image model; named nowhere in this repo
    python3 tools/gen-world-backdrops.py --only delhi6,pujo [--jobs 4]
    python3 tools/gen-world-backdrops.py --only cricket-night

--only takes world ids (both modes) or plate ids, comma-separated, and is
required: this tool rewrites plates in place, so painting everything has to
be asked for by name (--all). The model comes from IMG_MODEL or --model and
from nowhere else; there is no default, so no model name is written here.

A night plate is painted FROM its day master when one is on disk (the day
image goes in as a reference with "the same place, at night"), so the two
plates are one composition and the cross-fade between them reads as the sun
going down rather than a cut to another picture.

Editorial (CLAUDE.md / docs/05): every prompt forbids text, because a
backdrop with lettering reads as UI and generated lettering is refused
outright. No deities, idols or religious icons as decoration anywhere: Pujo
is the pandal, kash flowers and dhak seen from outside; Diwali is diyas,
rangoli and lanterns; Holi is gulal and pichkaris; Dance is the instruments
and lamps, no dancer. No people as a rule (Madhubani's), no brand, team,
league or agency marks, no film titles, no truck slogans, no maps. Folk-art
traditions shown are the ones each world's credit line names.
"""
import argparse, io, os, sys, time, base64, json, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

try:
    from PIL import Image
except ImportError:
    sys.exit("pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, "..", "app")
OUT_DIR = os.path.join(APP, "art", "worlds")
MASTER_DIR = os.path.join(os.environ.get("WORLDS_MASTERS", "/tmp/worlds-masters"))
WIDTH, HEIGHT, QUALITY = 1600, 900, 80
MAX_BYTES = 420 * 1024   # a plate over this steps its JPEG quality down, never below 64

STYLE = (" Flat hand-painted Indian illustration, matte gouache texture, a "
         "children's picture-book backdrop. Wide 16:9 landscape. The centre of "
         "the image stays calm and airy (interface cards sit over it); the "
         "richness lives along the bottom and the sides. Absolutely NO text, "
         "NO letters, NO numerals, NO logos, NO watermark, NO border, NO frame.")

# Every one of the new worlds carries the same hard refusals; said once here so
# no prompt can quietly drop one.
SAFE = (" No people, no faces, no figures. No gods, goddesses, idols, statues, "
        "religious icons or sacred symbols anywhere. No signs, no posters, no "
        "writing in any script on any surface.")

NIGHT_FROM_DAY = (
    "The attached image is a daytime painting. Repaint EXACTLY this picture - "
    "the same place, the same viewpoint, the same composition, every building, "
    "tree and object in the same position and the same size - but at night, in "
    "the same flat gouache picture-book style. Keep the centre calm and dark. "
    "Night details: ")

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

    # ---- Delhi 6: Purani Dilli from a rooftop, kites and kabootar ----
    "delhi6-day": (
        "A wide warm-afternoon painting of the rooftops of Purani Dilli (Old "
        "Delhi), India, seen from a high terrace. A pale warm sky (#f8ecdd) "
        "stays open and empty across the centre. Along the bottom and up both "
        "sides: a tumble of old havelis with carved sandstone jharokha "
        "balconies and arched windows in brick red #ba4a2a and sandstone, flat "
        "terraces with low parapets, iron railings, water tanks, a washing line "
        "of plain cloths, potted plants, a tangle of overhead wires. A flock of "
        "grey pigeons wheels up from a wooden pigeon coop on one roof. Three "
        "paper kites fly high at the sides in marigold #e9a13b, teal #2e7d6e "
        "and red. Far away on the hazy skyline at one side only, the soft "
        "silhouette of an old dome with slender minarets and long red sandstone "
        "fort ramparts, small and pale. Outlines in warm dark brown #3e1b10. "
        "Balconies and railings carry only jaali lattice and flower carving, "
        "never any carved marks that could look like letters." + SAFE + STYLE),
    "delhi6-night": (
        "A wide night painting of the rooftops of Purani Dilli (Old Delhi), "
        "India, from a high terrace: a deep warm-black sky (#1a1009) with a "
        "thin crescent moon and a few stars, calm and dark across the centre. "
        "Along the bottom and sides the old havelis and jharokha balconies "
        "are dark shapes (#26180e) with small windows glowing warm amber "
        "#f0a55c and soft gold #ffd08a, a string of little lights along one "
        "parapet, a teal-painted door #5fbfa8 lit by a lamp, the pigeon coop "
        "quiet, one kite caught on a wire. Far off on the skyline at one side, "
        "the dark silhouette of an old dome with slender minarets and the long "
        "fort ramparts, softly lit." + SAFE + STYLE),

    # ---- Diwali: diyas, rangoli, toran, lanterns — never deities as decor ----
    "diwali-day": (
        "A wide late-afternoon painting of a row of Indian homes getting ready "
        "for Diwali. A soft pale warm sky (#fbeedc) open across the centre. "
        "Along the bottom: doorsteps and a courtyard floor with bright rangoli "
        "of flowers, petals and geometric rings in burnt orange #b3541e, "
        "marigold #f0ac29 and plum #8a3a69, rows of unlit clay diyas along the "
        "steps and the parapet edges, baskets of marigold flowers. At the left "
        "and right sides: house fronts with carved wooden doorways hung with "
        "marigold-and-mango-leaf torans, paper star lanterns (akash kandil) "
        "hanging from balconies, rooftops and terraces. Outlines in warm brown "
        "#43210b. The rangoli is only flowers, petals, dots and rings." + SAFE + STYLE),
    "diwali-night": (
        "A wide night painting of a row of Indian homes on Diwali night: a "
        "deep warm-black sky (#140b05), calm and dark across the centre. Along "
        "the bottom the rangoli of flowers and rings glows in the light of "
        "hundreds of lit clay diyas in rows along the steps and parapets, "
        "flames in warm amber #ffb454. At the sides the house fronts with "
        "torans, glowing paper star lanterns in soft gold #ffd479, a couple of "
        "phuljhari sparkler trails as golden streaks, and small distant "
        "fireworks blooming high in the corners in pink #e58ab5 and gold. "
        "Walls in #22150b." + SAFE + STYLE),

    # ---- Pujo: the pandal from outside, kash, dhak — never the murti ----
    "pujo-day": (
        "A wide bright autumn painting of the Durga Puja season in Kolkata, "
        "India, seen from a quiet lane. A high clear pale autumn sky (#fbf1e8) "
        "with a few soft white clouds across the centre. Along the bottom, "
        "tall feathery white kash (kans grass) flowers swaying. On the left "
        "side, a grand festival pandal built of bamboo scaffolding wrapped in "
        "pleated cloth in red #c1272d and gold #e8b00e with a tall arched "
        "facade, seen from OUTSIDE at an angle, its entrance closed by draped "
        "cloth curtains so nothing inside is visible. On the right side, two "
        "big dhak drums with tall white plumes of kash feathers resting on a "
        "wooden bench, a row of clay lamps, old Kolkata houses with green "
        "wooden shutters and wrought-iron balconies, strings of unlit bulbs "
        "and paper flags in orange #ee7a3b. Outlines in deep brown #46150f."
        + SAFE + STYLE),
    "pujo-night": (
        "A wide night painting of the Durga Puja season in Kolkata, India, "
        "seen from a quiet lane: a deep warm-black sky (#1b0b0a), calm and "
        "dark across the centre. On the left the bamboo-and-cloth pandal, "
        "seen from outside with its entrance curtained, is outlined in "
        "thousands of tiny light bulbs in gold #ffd45e and coral #ff8f6b. "
        "Arched gateways of decorative lights (only flowers and paisley "
        "shapes made of bulbs) span the lane at the sides. On the right the "
        "two dhak drums with white plumes, glowing clay lamps in #ffab5e, "
        "Kolkata houses with lit shuttered windows. White kash flowers along "
        "the bottom catch the light, silvery in the dark." + SAFE + STYLE),

    # ---- Mumbai: Marine Drive, the necklace of lamps, the local, monsoon ----
    "mumbai-day": (
        "A wide monsoon-afternoon painting of Marine Drive, Mumbai, India: a "
        "soft pale grey monsoon sky (#edf0f2) with gentle rain clouds and fine "
        "slanting rain, open across the centre. Seen from a high window at "
        "one end of the bay: the long sea-face promenade with its low wall, "
        "concrete tetrapods and white spray sweeps in ONE open C-shaped curve "
        "from the bottom-left corner away into the far distance on the right, "
        "with its long row of tall street lamps following the curve. The bay "
        "is open to the sea: the Arabian Sea in deep teal-blue #256d85 fills "
        "the middle distance and meets the horizon. Along the left side and "
        "the inner curve, a row of cream art-deco apartment buildings with "
        "rounded balconies and palm trees; far away on the right, a small "
        "maroon-and-yellow local train crossing a bridge. A few gulls, yellow "
        "#f2b90d and coral #d94e63 awnings on the buildings. Outlines in "
        "slate ink #1d2733."
        + SAFE + STYLE),
    "mumbai-night": (
        "A wide monsoon night painting of Marine Drive, Mumbai, India: a deep "
        "blue-black sky (#0a1119), calm and dark across the centre, a light "
        "drizzle. The long curving arc of street lamps around the bay glows "
        "warm gold #ffcf4d like a necklace, reflected in the dark wet "
        "promenade and the open sea. Art-deco buildings along the left with "
        "lit windows in soft cyan #6fc6e0 and gold; far away on the right a "
        "local train with a lit row of windows crossing a bridge. A few "
        "coral-pink #ff8fa3 lights on distant boats." + SAFE + STYLE),

    # ---- Rajasthan: dunes, a hill fort, havelis, a camel caravan ----
    "rajasthan-day": (
        "A wide golden-afternoon painting of the Thar desert in Rajasthan, "
        "India. A pale warm sky (#f9eedc) open across the centre. Along the "
        "bottom, soft rolling golden sand dunes in #dfa032 with a few khejri "
        "trees, and a small caravan of three camels walking in a line on a "
        "distant dune crest, saddled with rugs but riderless. On the left "
        "side, a great sandstone fort on a rocky hill with round bastions and "
        "crenellated ramparts. On the right side, a haveli with carved "
        "jharokha windows and indigo-blue #2d5f9e painted houses below it, a "
        "length of pink #d8447c leheriya cloth drying on a terrace, two paper "
        "kites in the sky at the sides. Outlines in warm brown #40260d. The "
        "sky paint runs FULL BLEED to all four edges: no ruled line, no "
        "border line, no margin anywhere." + SAFE + STYLE),
    "rajasthan-night": (
        "A wide moonlit night painting of the Thar desert in Rajasthan, India: "
        "a deep plum-black sky (#160f14) full of small stars, a round moon, "
        "calm and dark across the centre. The dunes along the bottom stay "
        "DARK warm sand (#241722 shading to deep ochre), only their crests "
        "touched by a thin rim of cool moonlight #8fb4e8 - never pale, never "
        "white, nothing that could read as snow. The three camels rest folded "
        "on the sand. "
        "The hill fort on the left lit by warm lamps along its ramparts in "
        "gold #ffc861; the haveli on the right with glowing jharokha windows "
        "and a few pink #ff86b4 lanterns. Walls in #241722." + SAFE + STYLE),

    # ---- Taj: the monument across the Yamuna and its gardens ----
    "taj-day": (
        "A wide soft dawn painting of the Taj Mahal in Agra, India, seen from "
        "across the Yamuna river from the gardens on the far bank. The white "
        "marble Taj Mahal with its great dome and four minarets stands small "
        "and distant on the far bank toward the right third. A pale pearl sky "
        "(#f3efea) with a faint mauve #8c5a74 and gold #c99a4b dawn glow, "
        "open and calm across the centre. The still river reflects it. Along "
        "the bottom and left side, a formal char-bagh garden: rows of dark "
        "cypress trees in green #3e7c6f, flowerbeds, a long still water "
        "channel and low sandstone walls with inlaid flower patterns. Outlines "
        "in plum-grey #322b36. No inscriptions visible." + SAFE + STYLE),
    "taj-night": (
        "A wide moonlit night painting of the Taj Mahal in Agra, India, seen "
        "from across the Yamuna river: a deep violet-black sky (#110e14) with "
        "a full moon and small stars, calm across the centre. The marble Taj "
        "Mahal small and distant on the far bank toward the right third, "
        "glowing pale lilac #d1a0bb in the moonlight, its reflection "
        "shimmering in the dark river. Cypress rows and the garden along the "
        "bottom and left as dark teal silhouettes #7fc0b1, a few small warm "
        "lamps in gold #e8c88a along the garden wall." + SAFE + STYLE),

    # ---- Holi: gulal, pichkari, tesu blossom — the play, not a rite ----
    "holi-day": (
        "A wide bright spring-morning painting of an Indian courtyard during "
        "Holi. A soft pale lilac-white sky (#f6f3f7) open across the centre. "
        "Big soft clouds of coloured gulal powder billow in from the left and "
        "right sides and along the bottom in magenta #c43ba0, sunshine yellow "
        "#efb61c and leaf green #2f9e62. Along the bottom, a low courtyard wall "
        "with brass pichkari water squirters, brass plates heaped with "
        "coloured powder, a clay pot, puddles of colour on the floor. At the "
        "sides, flame-of-the-forest (tesu) trees in orange blossom and a neem "
        "tree. Outlines in deep plum #33203e." + SAFE + STYLE),
    "holi-night": (
        "A wide full-moon night painting of an Indian courtyard after Holi "
        "play: a deep violet-black sky (#140b1c) with a big round full moon "
        "and soft stars, calm across the centre. The coloured powder has "
        "settled into soft glowing drifts of pink #ff8ad4, yellow #ffce5e and "
        "green #5fd497 on the wall and floor; the brass pichkaris and plates "
        "of colour rest on the low wall; the tesu trees at the sides are dark "
        "silhouettes with a few blossoms catching a lantern's warm light. "
        "Walls in #20122b." + SAFE + STYLE),

    # ---- Dal Lake: shikaras, houseboats, chinar, mountains ----
    "dallake-day": (
        "A wide clear autumn-morning painting of Dal Lake, Srinagar, Kashmir, "
        "India. A pale blue-grey sky (#e8eff2) and a mirror-still lake fill the "
        "calm centre, with soft blue mountains and snowy peaks low on the "
        "horizon. On the right side, a row of ornate carved-wood houseboats "
        "with fretwork verandahs; on the left, a great chinar tree in autumn "
        "leaves of orange #d9822b and red #b04a3a, a few leaves drifting down "
        "onto the water. Along the bottom, an empty shikara boat with a "
        "flowered canopy and cushions moored at a wooden jetty, lotus leaves, "
        "reflections. Water in teal #33718a. Outlines in slate #253844. The "
        "houseboats are carved wood all over: no name boards, no plaques, no "
        "painted panels with any marks on them." + SAFE + STYLE),
    "dallake-night": (
        "A wide night painting of Dal Lake, Srinagar, Kashmir, India: a deep "
        "ink-blue sky (#060d14) with a crescent moon over dark mountains and "
        "a few stars, the mirror-still lake calm and dark across the centre. "
        "The carved houseboats on the right with warm lit windows in amber "
        "#ffc077 reflected as long glowing streaks; the chinar on the left a "
        "dark silhouette with a few rust #e08a76 leaves caught by lamplight; "
        "the empty shikara moored at the jetty along the bottom with a small "
        "lantern, ripples in pale blue #79c2dc. No name boards or plaques on "
        "any boat." + SAFE + STYLE),

    # ---- Bollywood: the craft of the pictures, no titles, no stars ----
    "bollywood-day": (
        "A wide warm painting of an old Bombay film studio and cinema world, "
        "India. A soft warm cream sky (#fbedde) open across the centre. On "
        "the left side, the corner of a grand art-deco single-screen cinema "
        "facade with curved tiers, a marquee canopy rimmed with round light "
        "bulbs, and its sign panels left plain blank colour. On the right "
        "side, a vintage film camera on a wooden tripod, two big studio "
        "spotlights on stands, a stack of round film reel tins. Along the "
        "bottom, a ribbon of film strip with plain coloured frames curling "
        "across, a plain clapperboard with blank boards, red velvet curtain "
        "swags at the top corners in magenta #c42a6c with gold #f0a519 "
        "tassels, accents of blue #2c63a8. Outlines in deep wine #3a1030."
        + SAFE + STYLE),
    "bollywood-night": (
        "A wide night painting of an old Bombay film studio and cinema world, "
        "India: a deep purple-black sky (#150818), dark and calm across the "
        "whole centre. Two short soft spotlight beams rise straight up at the "
        "far left and far right edges only and never cross the centre. "
        "On the left the art-deco cinema facade glows, its marquee bulbs lit "
        "warm gold #ffc45e, its sign panels left blank and lit pink #ff77ab. "
        "On the right the film camera and studio lights on their stands, one "
        "studio lamp glowing blue #7ba6ef. Along the bottom the film strip "
        "with blank frames catches the light; velvet curtain swags at the top "
        "corners." + SAFE + STYLE),

    # ---- Truck art: the painted lorry, no slogans, no plates ----
    "truck-day": (
        "A wide sunny painting of an Indian highway across flat green fields "
        "and yellow mustard, India. A pale warm sky (#fdf3e3) open across the "
        "centre. Along the bottom left, a big old Indian goods truck seen "
        "exactly side-on, its tall wooden body and cab covered in traditional "
        "truck-art painting: bright flowers, peacocks, parrots, swirling "
        "vines, panels of mirror work, chrome trims, colourful tassels and "
        "black fringe hanging from the bumper, in cobalt blue #0f6bb4, "
        "sunflower yellow #f2b211 and rose red #e0345c, outlined in ink "
        "#22263b. The truck's painted panels carry ONLY flowers, birds and "
        "patterns - absolutely no words, no slogans, no numbers, no number "
        "plate. Along the bottom right, a roadside tree and a row of "
        "eucalyptus. All the truck-art decoration is ON the truck itself; "
        "nothing ornamental floats in the corners of the picture."
        + SAFE + STYLE),
    "truck-night": (
        "A wide night painting of an Indian highway across flat fields: a "
        "deep navy sky (#0c0f1a) with small stars and a crescent moon, calm "
        "across the centre. The same big painted truck side-on along the "
        "bottom left, its headlights and rows of little coloured marker "
        "lights glowing, its mirror-work panels and painted flowers and "
        "peacocks catching the light in sky blue #5cb3ee, gold #ffcb52 and "
        "pink #ff7d9c. No words, no slogans, no numbers, no number plate. A "
        "roadside tree silhouette on the right and faraway headlights on the "
        "road." + SAFE + STYLE),

    # ---- Dance: the instruments and the lamps, no dancer ----
    "dance-day": (
        "A wide warm-afternoon painting of an empty open-air stone courtyard "
        "stage in India, ready for a classical dance recital. A pale warm "
        "wall and sky (#f8ece4) calm and open across the centre. Along the "
        "bottom: a pair of ghungroo ankle-bell strings resting on a folded "
        "silk cloth, a double-headed mridangam drum, a pair of small hand "
        "cymbals, strings of jasmine and marigold. On the left, a tall "
        "tanpura leaning against a carved stone pillar; on the right, two "
        "tall brass oil lamps (unlit) and a plain carved pillar. Silk drapes "
        "in deep rose #a62b52 and gold #d99c27 hang from the top corners, "
        "accents of teal #2f7a72. The pillars carry only flower and vine "
        "carving. Outlines in deep wine #3c1626." + SAFE + STYLE),
    "dance-night": (
        "A wide night painting of an empty open-air stone courtyard stage in "
        "India before a classical dance recital: a deep wine-black sky "
        "(#15080f) with soft stars, calm and dark across the centre. The tall "
        "brass oil lamps on the right are lit with several small flames in "
        "warm gold #ffc85f, their glow on the stone floor. Along the bottom "
        "the ghungroo bells on silk, the mridangam and cymbals, jasmine "
        "strings; on the left the tanpura against its pillar. Silk drapes in "
        "rose #ef7e9e at the top corners, teal #63bdb2 accents." + SAFE + STYLE),

    # ---- Patterns: the textiles the credit names, around a calm cloth ----
    "patterns-day": (
        "A wide overhead flat-lay painting of Indian handmade textiles. A large "
        "plain undyed cotton cloth (#f0ece4) lies calm and empty across the "
        "whole centre. Folded lengths of patterned cloth overlap in from the "
        "edges, densest along the bottom and the two sides: red bandhani "
        "tie-dye with fine white dot patterns, ajrakh block print with "
        "geometric stars and paisley in indigo #29527a and madder red "
        "#b23a48, phulkari embroidery in golden silk #c98a2b, and an ikat "
        "weave with soft feathered diamond shapes. In one bottom corner a "
        "small white rice-flour kolam of dots and looping lines on the floor. "
        "This cloth along the edges is the subject itself, not a frame."
        + SAFE + STYLE),
    "patterns-night": (
        "A wide overhead flat-lay painting of Indian handmade textiles at "
        "night by the light of one small brass oil lamp: the large plain "
        "cloth across the centre lies in deep indigo-black shadow (#0e0c14), "
        "calm and dark. The bandhani, ajrakh, phulkari and ikat lengths along "
        "the edges catch soft lamplight in muted blue #87aede, gold #e4b565 "
        "and rose #e4808c; the white kolam in the corner glows faintly; the "
        "lamp's small warm flame at one side. Cloth in #1a1622." + SAFE + STYLE),
}


def _post(model, key, parts):
    url = ("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent"
           % model)
    body = json.dumps({
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"],
                             "imageConfig": {"aspectRatio": "16:9"}}
    }).encode()
    # the key travels in a header, never in the URL, so no error message can carry it
    req = urllib.request.Request(url, data=body, headers={
        "Content-Type": "application/json", "X-goog-api-key": key})
    with urllib.request.urlopen(req, timeout=240) as r:
        return json.load(r)


def generate(prompt, key, model, ref=None):
    parts = [{"text": prompt}]
    if ref:
        with open(ref, "rb") as f:
            parts = [{"inline_data": {"mime_type": "image/jpeg",
                                      "data": base64.b64encode(f.read()).decode()}},
                     {"text": NIGHT_FROM_DAY + prompt}]
    last = None
    for attempt in range(5):
        try:
            data = _post(model, key, parts)
            cand = (data.get("candidates") or [{}])[0]
            for part in (cand.get("content") or {}).get("parts", []):
                blob = part.get("inlineData") or part.get("inline_data")
                if blob:
                    return base64.b64decode(blob["data"])
            raise RuntimeError("no image part (finishReason=%s)" % cand.get("finishReason"))
        except urllib.error.HTTPError as e:
            last = "HTTP %s" % e.code
        except Exception as e:
            last = type(e).__name__ + ": " + str(e)[:200]
        time.sleep(6 * (attempt + 1))
    raise RuntimeError(last)


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
    q = QUALITY
    while True:
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
        if buf.tell() <= MAX_BYTES or q <= 64:
            break
        q -= 4
    with open(os.path.join(OUT_DIR, art_id + ".jpg"), "wb") as f:
        f.write(buf.getvalue())
    return q, buf.tell()


def write_manifest():
    have = sorted(f[:-4] for f in os.listdir(OUT_DIR) if f.endswith(".jpg"))
    path = os.path.join(APP, "worlds-bg-manifest.js")
    with open(path, "w") as f:
        f.write("/* generated by tools/gen-world-backdrops.py — do not edit */\n")
        f.write("window.IND_WORLD_BG = %s;\n" % json.dumps(have))
    print("manifest:", have)


def expand(only):
    todo = []
    for tok in [t.strip() for t in only.split(",") if t.strip()]:
        ids = [tok] if tok in PROMPTS else [tok + "-day", tok + "-night"]
        for aid in ids:
            if aid not in PROMPTS:
                sys.exit("no prompt for %r" % aid)
            if aid not in todo:
                todo.append(aid)
    return todo


def paint_world(aids, key, model, use_ref):
    """One world's plates in order: day first, so its night can be painted from it."""
    out = []
    for aid in sorted(aids, key=lambda a: a.endswith("-night")):
        ref = None
        if use_ref and aid.endswith("-night"):
            cand = os.path.join(MASTER_DIR, aid[:-6] + "-day.jpg")
            ref = cand if os.path.exists(cand) else None
        try:
            q, n = save_pair(generate(PROMPTS[aid], key, model, ref), aid)
            msg = "%s ok q%d %dKB%s" % (aid, q, n // 1024, " (from day)" if ref else "")
        except Exception as e:
            msg = "%s FAILED %s" % (aid, e)
        print(msg, flush=True)
        out.append(msg)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma-separated world ids or plate ids, e.g. delhi6,cricket-night")
    ap.add_argument("--all", action="store_true", help="repaint every plate (say it out loud)")
    ap.add_argument("--model", default=os.environ.get("IMG_MODEL"),
                    help="image model id (or set IMG_MODEL); there is no default")
    ap.add_argument("--jobs", type=int, default=4, help="worlds painted at once")
    ap.add_argument("--no-ref", action="store_true",
                    help="paint night plates from text alone, not from the day master")
    args = ap.parse_args()
    if not args.model:
        sys.exit("no model: set IMG_MODEL or pass --model (none is written in this file)")
    key = os.environ.get("GEMKEY")
    if not key:
        sys.exit("GEMKEY not set")
    if args.all:
        print("--all: repainting EVERY plate (%d)" % len(PROMPTS), flush=True)
        todo = list(PROMPTS)
    elif args.only:
        todo = expand(args.only)
    else:
        sys.exit("say which: --only <ids> or --all")
    worlds = {}
    for aid in todo:
        worlds.setdefault(aid.rsplit("-", 1)[0], []).append(aid)
    print("painting", ", ".join(todo), flush=True)
    with ThreadPoolExecutor(max_workers=max(1, args.jobs)) as ex:
        results = list(ex.map(lambda w: paint_world(worlds[w], key, args.model, not args.no_ref),
                              list(worlds)))
    write_manifest()
    failed = [m for r in results for m in r if "FAILED" in m]
    if failed:
        sys.exit("%d failed:\n  %s" % (len(failed), "\n  ".join(failed)))


if __name__ == "__main__":
    main()
