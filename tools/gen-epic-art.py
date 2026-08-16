#!/usr/bin/env python3
"""Generate one painting per CARD of the two epics — 686 of them.

Sibling of tools/gen-story-art.py: same house style, same reference-image technique,
different data source (app/data-epic-*.js) and its own manifest.

TWO TIERS, because this art has two jobs.
    masters/epic/<key>.jpg   1408x768 q92 — the digital book. Outside app/, so deploy.sh
                             never ships it and gh-pages stays light. Committed, because
                             this container is ephemeral and uncommitted work is lost.
    app/art/epic/<key>.jpg   900x506 q80 — what the app serves. ~120KB a card, fetched
                             lazily, so a child downloads the card on screen and no more.

HOW A CARD PROMPT IS BUILT. The 57 hand-written entries in PROMPTS are not one image
each any more; each is the SETTING ANCHOR for every card in its episode. Without it the
model cheerfully paints twelve differently-shaped halls for twelve cards of one scene.
The card's own text — narrative prose written for a child, which is already close to an
ideal image prompt — is passed through as the subject, so what gets painted is what is
actually read on that card.

Usage:
    export GEMKEY=...            # never hardcode, never print
    python3 tools/gen-epic-art.py                    # resumable: skips what exists
    python3 -u tools/gen-epic-art.py --slice 3/8     # one worker's share (-u: see progress live)
    python3 tools/gen-epic-art.py --only ramayana-11-4
    python3 tools/gen-epic-art.py --print-prompt ramayana-11-4   # no API call
    python3 tools/gen-epic-art.py --manifest-only

Prompt rules, inherited from gen-story-art.py and tightened for the epics:
  * style declaration FIRST, subject after — style drifts otherwise
  * positive-only phrasing. Naming an artifact ("no text", "no weapons") reliably
    summons it. Say what you DO want instead.
  * every request carries two finished paintings from app/art/story as image
    references. Written style words alone drift badly across hundreds of calls, and
    with the work split across parallel workers the shared references are also what
    stops one worker's slice drifting away from another's.
  * BOTH EPICS CONTAIN A WAR AND THESE PAINTINGS DO NOT. Every battlefield beat is
    composed as the moment before or the moment after: two armies standing still at
    dawn, a chariot at rest, an empty field, a lament, a lamp. Bhishma's fall,
    Abhimanyu in the wheel, Karna at the wheel, Ravana's end and the fire ordeal
    are all painted as stillness, grief or aftermath. build_card_prompt() repeats this
    on every single card, because it is the rule most easily lost in a long prompt.
  * Draupadi's episodes are the hall, the dice, the silent men, the empty throne —
    her dignity, never her distress.
  * The Gita episode is two friends and a chariot at dawn. No vishvarupa.
  * Deities are drawn reverently in a folk-art idiom, warm and dignified.
  * Nothing here should frighten a four-year-old.
"""

import argparse
import base64
import io
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "app", "art", "epic")
STORY_DIR = os.path.join(ROOT, "app", "art", "story")
MANIFEST = os.path.join(ROOT, "app", "epic-art-manifest.js")
ENDPOINT = ("https://generativelanguage.googleapis.com/v1beta/models/"
            "%s:generateContent")
# gemini-3.1-flash-image returns 1408x768 natively — landscape, so nothing is thrown away
# cropping a square down to a banner, and high enough to double as a page in a digital book.
# (gemini-2.5-flash-image returns 1024x1024; gemini-3-pro-image at 4K returns 5504x3072 and
# ~11MB, which is the right model for the handful of full-page book heroes later, not for
# 686 cards.)
DEFAULT_MODEL = "gemini-3.1-flash-image"

# TWO TIERS, because this art has two jobs.
#
#   masters/  the book. Native resolution, barely compressed. Never deployed — deploy.sh
#             only copies app/ — so gh-pages stays light while the book assets stay in the
#             repo at full quality.
#   app/      the app. A card is read on a phone; 900px wide is plenty and 120KB a card
#             keeps the deployed tree sane.
#
# 686 cards: masters ~395MB, web ~82MB.
MASTER_DIR = os.path.join(ROOT, "masters", "epic")
MASTER_QUALITY = 92           # near-native; the book tier
WIDTH, HEIGHT, QUALITY = 900, 506, 80   # 16:9 web tier

# STYLE SEEDS. Every request carries these finished paintings as inline_data so the whole
# run converges on one look — written style words alone drift badly over hundreds of calls,
# and across parallel workers the shared seeds are what stops one slice diverging from
# another's.
#
# This directory starts EMPTY on purpose. The epics are painted in the soft animated-film
# style below, which is deliberately not the Indian folk-art idiom of app/art/story — seeding
# with those paintings would drag every card straight back to Madhubani. The workflow is:
# generate two or three cards with no seed, pick the best by eye, drop it in here, and let it
# hold the rest of the run.
SEED_DIR = os.path.join(ROOT, "tools", "style-ref", "epic")
REF_IMAGES = ([os.path.join(SEED_DIR, f) for f in sorted(os.listdir(SEED_DIR))
               if f.lower().endswith((".jpg", ".png"))]
              if os.path.isdir(SEED_DIR) else [])

REF_NOTE = (
    "The painting(s) above are finished pages from this same children's book. Match them "
    "exactly: the same soft painted rendering, the same palette and light, the same "
    "character-design language and facial style, the same level of background detail. "
    "Paint the new scene below as another page of that same book. "
)

# ---------------------------------------------------------------- house style --
STYLE = (
    "A soft, hand-painted animated-film illustration in the Japanese feature-animation "
    "tradition: luminous watercolour and gouache backgrounds, gentle rounded character "
    "designs with warm expressive faces and large clear eyes, delicate cel linework over "
    "painted scenery, lush layered foliage, drifting clouds and long shafts of natural "
    "light, dust and pollen in the air, deep atmospheric perspective, a quiet unhurried "
    "mood. Nature is painted with love and detail — every leaf, every stone, moving grass, "
    "wind through the trees. The colour is warm and slightly sun-faded: deep greens, "
    "sky-blues, ochres, saffron and marigold. "
    "Everything in the scene is INDIAN and specific: real Indian dress — dhoti, angavastram, "
    "sari, uttariya — real Indian architecture, courtyards, stepwells, temple towers, "
    "banyan and peepal and mango trees, Indian birds and animals, the Gangetic plain and "
    "the Deccan and the Himalaya. Indian faces and skin tones. "
    "One single continuous painted scene filling the frame edge to edge, 16:9 landscape "
    "composition, cinematic, warm and beautiful and gentle, for a children's storybook. "
    "The painting shows: "
)


def p(subject):
    return STYLE + subject


# ------------------------------------------------------------------- the list --
# '<epicId>-<n>' -> prompt subject. One iconic moment each.
PROMPTS = {

    # ================================================== THE RAMAYANA (24) =====
    "ramayana-1": p(
        "dawn beside a wide river, a great ceremonial fire burning on a platform of "
        "packed earth outside a white and rose city of domes and balconies: a tall "
        "radiant figure of golden light stepping forward out of the flames holding out "
        "a round golden bowl of hot rice payasam, while an old king in a jewelled turban "
        "kneels on the steps with both hands lifted to receive it and three queens in "
        "crimson, saffron and green silk stand behind him; priests seated in a ring, "
        "conch shells, mango leaves and marigold garlands, the river bright behind. "
        "Warm amber firelight, rose-gold sky, painted flowering borders."),

    "ramayana-2": p(
        "the great gate of a river city at dusk: two young princes in plain cloth with a "
        "bow each and no servants at all, walking out along the road behind a very old "
        "sage in a bark robe with a staff; the whole city stands along the top of the "
        "walls watching them go, lamps being lit in every window, an old king with his "
        "hand raised at the gate; the road bends away into dark forest ahead. Deep indigo "
        "evening, gold lamplight, banners, painted parapet ornament, peacocks on the wall."),

    "ramayana-3": p(
        "an overgrown courtyard garden at morning, the roof of the house fallen in and "
        "fruit trees gone wild: in the middle of the swept dust a woman is rising up out "
        "of a smooth grey worn stone, the stone still shaped like her at her feet, dust "
        "lifting round her in a soft golden cloud; a young prince stands quietly a few "
        "paces away with his hands joined, his brother behind him, and she is looking "
        "past them at her own crooked pomegranate tree. Long shafts of morning light, "
        "green creepers over broken walls, doves, painted floral borders."),

    "ramayana-4": p(
        "a great open courtyard in Mithila crowded with a hundred kings in bright silks "
        "and turbans: in the middle, an enormous ancient bow lying in two pieces on a "
        "wheeled cart with eight wheels, and a calm young prince standing beside it with "
        "one hand still open; walking towards him across the swept ground, unhurried, a "
        "princess in red and gold holding a long flower garland in both hands, her "
        "attendants behind her; birds coming off every roof at once. Carved pillars, "
        "hanging lamps, warm morning gold, dense painted ornament."),

    "ramayana-5": p(
        "a city at night decorated for a crowning: flags on every balcony, plantain stems "
        "tied to every doorpost, strings of little oil lamps down every street and torches "
        "moving in the crowd far below; up on a flat palace roof a queen in fine silk "
        "stands at the parapet looking down at all of it with a bracelet in her open hand, "
        "and at the top of the stair behind her an old attendant waits in shadow. Deep "
        "blue night, marigold and gold lamplight, domes and jali screens, painted stars."),

    "ramayana-6": p(
        "a quiet palace corridor by lamplight before dawn: a queen's jewellery lying "
        "scattered piece by piece along the polished floor — bangles, a necklace, "
        "earrings, an anklet — leading to an open doorway of deep blue shadow, with one "
        "small brass oil lamp burning on the floor beside the threshold; an old king in "
        "a plain robe kneels in that doorway with his head bowed and one hand on the "
        "frame. Carved stone arches, hanging lamps, a window of night sky and stars, "
        "painted floral border, hushed amber light and deep indigo shadow."),

    "ramayana-7": p(
        "a wide river at first light: a long wooden boat crossing the bright water, rowed "
        "by a broad-shouldered boatman in a red turban, carrying a young prince, his wife "
        "and his brother, all three in simple bark cloth with small bundles; on the bank "
        "behind them a charioteer stands beside an empty chariot with his hand raised, "
        "and on the far bank a great forest waits. Mist on the water, herons, lotuses, "
        "banded rose and gold dawn sky, painted ripples."),

    "ramayana-8": p(
        "a hillside path at Chitrakuta coming down towards a river, with an entire city "
        "in procession on it — ministers, soldiers, elephants, three queens in "
        "palanquins, mothers and children: at the front, walking alone and barefoot with "
        "his own shoes in his hand, a young prince carrying a pair of plain wooden sandals "
        "balanced on top of his own head, his face solemn; hermits' huts and rocks above, "
        "a great banyan, the plain stretching away below. Warm ochre and green, dust in "
        "the light, painted leaf borders."),

    "ramayana-9": p(
        "evening at Panchavati on the Godavari river: a neat thatched hut with a swept "
        "yard under five huge banyan trees at a bend in the water, a small cooking fire, "
        "and three people sitting outside it together talking — a young man, his wife "
        "planting something in a row of pots, and his brother mending an arrow; tame deer "
        "standing close by, a cow, parrots in the branches, hills gold across the river. "
        "Warm honey evening light, aerial roots, fireflies, dense painted foliage."),

    "ramayana-10": p(
        "a forest clearing on a hot afternoon: a tall rakshasa princess in deep green and "
        "gold silk with heavy jewellery and a proud, striking face steps out from between "
        "the trees into the open and stands with her chin up, speaking; across the "
        "clearing two brothers in bark cloth look round from the step of their hut, and a "
        "woman stands in the doorway behind them; long shadows on the swept earth, "
        "flowering creepers, deer moving off between the trunks. Deep greens and gold, "
        "dappled light, richly painted ornament."),

    "ramayana-11": p(
        "the edge of a forest clearing in bright morning: a deer made entirely of gold — "
        "every hair beaten metal, silver spots that ripple like water, little coral-branch "
        "antlers — standing lightly in the long grass with its head turned, glowing "
        "against dark green leaves; a woman in a plain sari stands at the door of a "
        "thatched hut with her hand at her mouth, and two brothers stand beside her "
        "looking out. Sun-shafts through the trees, painted ferns and flowers, "
        "butterflies, warm gold on deep emerald."),

    "ramayana-12": p(
        "the quiet moment after, in a forest at afternoon: an enormous old vulture with "
        "white round his eyes lying among fallen leaves in a great heap of broken "
        "feathers, and a young prince kneeling in the leaves holding the old bird's head "
        "gently in his lap with his cheek bent down close, listening; his brother stands "
        "behind with his head bowed. The bird is looking away southward. Soft slanting "
        "gold light, deep green shade, painted leaves, doves, marigold petals fallen on "
        "the ground. Tender and still."),

    "ramayana-13": p(
        "a hilltop hut at the top of a long swept forest path lined on both edges with "
        "laid flowers: a very old woman with almost no teeth sitting on the ground "
        "holding out a leaf-plate of little red-brown wild berries with both shaking "
        "hands, and a young prince sitting down cross-legged in front of her taking one "
        "and eating it, smiling properly; his brother stands stiffly to one side. A "
        "broom against the wall, a water pot, thorn bushes, hills falling away behind. "
        "Warm morning gold, painted flower borders, deeply tender."),

    "ramayana-14": p(
        "night on a high rocky hill above a lake: a small fire between a young prince in "
        "bark cloth and a monkey king with a bright garland round his neck, the two of "
        "them clasping hands across the flames while the firelight catches both faces; "
        "beside them a great vanara with a golden crown and a long curling tail kneels "
        "with his palms joined, and a young monkey prince and a bow-carrying brother "
        "watch from the rocks. Deep indigo night, stars, painted cave mouth, flowering "
        "creepers, warm amber firelight."),

    "ramayana-15": p(
        "the very end of the land at evening, where a long shelf of rock runs out into a "
        "turquoise sea: a huge ragged old vulture with bare wings stands high on the cliff "
        "with his head stretched out, looking far across the water and pointing the way "
        "with his beak; below him a great crowd of vanaras sits on the rocks looking where "
        "he looks, an old bear among them, and far out across the shining water a tiny "
        "golden island city catches the last light. Banded rose and saffron sky, spray, "
        "gulls, painted waves."),

    "ramayana-16": p(
        "the top of a mountain at the sea's edge at dawn, the moment before the leap: a "
        "great vanara with orange-red fur, a golden crown, heavy earrings, a flower "
        "garland and a long tail curling high behind him, standing braced on the summit "
        "with his chest filled and one arm swept back, the trees on the slope all bending "
        "towards him and loose blossom and leaves already lifting into the air around his "
        "feet; far below, hundreds of vanaras on the beach with their faces turned up, and "
        "beyond, a hundred miles of bright open sea. Banded gold and rose dawn, sweeping "
        "painted wind lines, radiant."),

    "ramayana-17": p(
        "a grove of ashoka trees in full red-orange flower just before sunrise, the most "
        "beautiful garden in a golden city: a woman in a dusty plain sari sitting very "
        "straight on the bare ground under a big simsupa tree with her chin up, and a "
        "small cat-sized vanara come down out of the branches kneeling in front of her, "
        "holding out a gold ring on his open palm; she has just taken it and is turning it "
        "over. Fallen orange petals everywhere, a lotus pool, painted birds, the golden "
        "roofs of Lanka beyond the wall. Soft dawn light, gentle, hopeful."),

    "ramayana-18": p(
        "the most magnificent hall in the world, in gentle comedy: a vanara with orange-red "
        "fur has wound his own long tail up into a tall neat spiral on the polished floor "
        "and is sitting cheerfully on top of it with his arms folded, a good deal higher "
        "than the great carved throne opposite; on that throne a magnificent ten-headed "
        "scholar-king in gold and deep red silk leans forward with one eyebrow up, half "
        "amused; courtiers in bright silks lean in from the pillars, a younger brother "
        "stands with his hand raised speaking. Gold pillars, hanging lamps, carpets, "
        "musical instruments and books along the walls, warm lamplight, dense ornament."),

    "ramayana-19": p(
        "a wide beach of pale sand at golden hour with an army of vanaras and bears "
        "crowded along it: in the middle a young prince in bark cloth is setting a plain "
        "golden circlet on the head of a kneeling rakshasa prince in fine court clothes, "
        "who has his palms joined and his eyes closed; four companions kneel behind him, a "
        "monkey king and a great vanara stand to one side, and the sea runs away flat and "
        "bright to a far golden island. Conch shells, gulls, garlands laid on the sand, "
        "banded amber sky, painted waves and shell ornament."),

    "ramayana-20": p(
        "a turquoise sea in broad daylight with a great causeway of boulders reaching out "
        "across it towards a far island: a long chain of vanaras running out along it "
        "carrying whole green hills and rocks on their shoulders and setting them into "
        "place, singing, all in step; a builder stands on the near end with his arm out "
        "directing them, and in the foreground a small striped squirrel coated in wet sand "
        "trots along the stones packing sand into the gaps. Foam, sunlit water, painted "
        "rock pattern, gulls, brilliant blue and gold."),

    "ramayana-21": p(
        "night over the whole of India, seen from very high up: an enormous vanara with "
        "orange-red fur and a golden crown flying south through a sky full of painted "
        "stars, carrying an entire Himalayan mountain balanced on one upturned hand — snow "
        "on its peak, dark pines on its slopes and thousands of tiny glowing herbs "
        "scattered over it like green-gold sparks; far below, silver rivers, dark forests, "
        "sleeping villages with one lamp each, and people on the rooftops looking up. Deep "
        "indigo and gold, moonlight, sweeping painted wind lines, awe and scale."),

    "ramayana-22": p(
        "an empty field at dusk after everything has stopped: a great ornamented chariot "
        "standing still and riderless in the middle of the open ground with its four "
        "horses quiet and their heads lowered, tall banners hanging straight down; far off "
        "on either side two armies stand in long silent lines with their standards at "
        "rest, and beyond them the golden walls and towers of an island city stand hushed "
        "against the sea; one small oil lamp burns on the sand in the foreground beside a "
        "heap of marigold flowers. Deep violet and amber evening, first stars, long "
        "shadows, painted chariot ornament. Utterly still and solemn."),

    "ramayana-23": p(
        "a river city at night with a lamp on every single doorstep, every wall, every "
        "balcony and all down the stone steps to the water, so that the whole shape of the "
        "city glows in the dark and the river carries a second city of reflections; over "
        "the rooftops a beautiful flying chariot shaped like a swan comes down through the "
        "air with garlands trailing from it, and the streets below are packed with people "
        "holding up lamps and flowers. Deep indigo and marigold gold, rangoli patterns on "
        "the thresholds, painted fireworks of flowers, joyful and radiant."),

    "ramayana-24": p(
        "a wide street outside a great ceremony pavilion in the morning: two boys of about "
        "twelve, dressed as forest hermits' pupils, standing barefoot singing together — "
        "one holding a small stringed tanpura, both with their heads back — while an "
        "enormous crowd stands completely still around them, and at the pavilion steps a "
        "king in white has come down from his seat and sits on the step listening with his "
        "hand over his mouth; garlands, banners, a poet with a palm-leaf manuscript at the "
        "edge of the crowd. Warm honey light, painted floral borders, hushed and tender."),

    # =============================================== THE MAHABHARATA (33) =====
    "mahabharata-1": p(
        "the mouth of a Himalayan cave by lamplight: an old poet with a long white beard "
        "sitting cross-legged on a deerskin with his eyes closed, speaking with one hand "
        "lifted, and facing him the elephant-headed Ganesha, drawn reverently in a "
        "folk-art idiom, round and gentle in marigold silk, writing at enormous speed onto "
        "a palm-leaf manuscript that unrolls away across the floor in long ribbons and "
        "coils out of the cave mouth; his small mouse sits on a leaf watching. Butter "
        "lamps, ink pots, snow peaks and dawn sky beyond, dense painted ornament."),

    "mahabharata-2": p(
        "morning on a wide river: a woman in white and silver silk standing calmly in the "
        "shallow bright water with the current curling round her, her hand trailing on the "
        "surface, looking back over her shoulder; on the bank a young king in hunting "
        "clothes has stopped mid-step and is simply staring, his horse forgotten behind "
        "him. Reeds, lotuses, herons lifting off, sun on the ripples, willows and mango "
        "trees, banded gold and turquoise water, painted wave pattern, tender and quiet."),

    "mahabharata-3": p(
        "a ferry landing on a river at evening, wooden boats drawn up on the mud and nets "
        "hung to dry: a young prince in fine clothes standing barefoot in front of a "
        "grey-haired fisherman with both his hands open and empty, speaking plainly; the "
        "fisherman's daughter waits by a boat with her hands folded, boatmen and villagers "
        "have stopped work to listen, and in many tellings flowers are falling out of a "
        "clear sky over the landing. Deep amber and rose light on the water, egrets, "
        "painted boat ornament, hushed and grave."),

    "mahabharata-4": p(
        "first light on a river bank: a lined wicker basket that has drifted in among the "
        "reeds, and in it a plump baby wearing golden armour that is part of his own skin "
        "and small gold earrings, kicking and glowing softly; a chariot-driver in a plain "
        "dhoti kneels in the shallows lifting the basket with both arms while his wife "
        "comes down the bank with her hands out and her face open with astonishment; his "
        "horses and cart wait on the path above. Rose-gold dawn, mist, lotuses, "
        "kingfishers, painted ripples, deeply tender."),

    "mahabharata-5": p(
        "a great palace courtyard in the morning: on one side a hundred princes of every "
        "size in bright silks playing all over the steps and the fountain, wrestling, "
        "chasing, sitting on the balustrade; on the other side, just come in through the "
        "gateway and standing close together, five boys in plain bark cloth with a widow "
        "in a white sari holding the smallest one's hand; between them an old grandfather "
        "with white hair and a blindfolded queen in red and gold stand waiting to receive "
        "them. Carved arches, marigold garlands, doves, warm honey light, dense pattern."),

    "mahabharata-6": p(
        "a summer river bank in cheerful comedy: an enormous grinning boy up in a mango "
        "tree shaking a big branch with both hands while a dozen laughing cousins tumble "
        "out of the leaves into soft grass and a heap of picnic baskets below, mangoes "
        "raining down with them; on the bank a cook's fire, brass pots, a boat, and two "
        "older cousins sitting apart on a rock watching without smiling. Bright green and "
        "gold, parrots, dragonflies, painted river ripples, sunlit and funny."),

    "mahabharata-7": p(
        "the rim of a deep old dry well outside a city wall at noon: a hundred and five "
        "young princes in bright clothes lying on their stomachs all round the rim looking "
        "down in complete bafflement, and a thin man in poor patched clothes standing "
        "calmly to one side dropping a blade of grass — a long chain of grass blades "
        "already reaching down the shaft and hooked into a ball at the bottom, with a gold "
        "ring resting on the ball. Dust, neem trees, a water pot, hot white light with "
        "warm ochre shadow, painted stonework and border ornament."),

    "mahabharata-8": p(
        "a forest clearing at golden hour: a rough clay and river-mud figure of a teacher "
        "seated on a low stone under a tree, with fresh flowers laid on its head and "
        "shoulders and a little lamp burning at its feet; in front of it a young forest "
        "boy in a plain cloth stands drawing a bow with perfect form, alone, his eyes on "
        "a mark high in the branches, and worn practice marks and hundreds of arrow "
        "notches all around him in the trunks. Long shafts of amber light, deer at the "
        "edge, painted leaves and flowers, dignified and quiet."),

    "mahabharata-9": p(
        "a great arena packed to the walls with a whole city watching: through the open "
        "gate at one end walks a tall young man in golden armour that is part of his skin, "
        "with gold earrings, unhurried, straight down the middle of the sunlit sand with "
        "his bow at his side; the crowd on that side is standing up, a guard at the gate "
        "stares after him, and away across the arena a slim archer stands quite still "
        "beside his teacher. Bright banners, drums, the covered royal gallery with the "
        "old grandfather and two queens, warm gold dust in the light, dense painted "
        "ornament."),

    "mahabharata-10": p(
        "a beautiful new palace at night, freshly built, glowing warm gold from every "
        "window and lacquered so smoothly that the pillars and painted panels shine like "
        "resin: gardens and flowering trees around it, a river beyond, and down in the "
        "dark garden in the foreground the neat mouth of a tunnel opening under a screen "
        "of bushes, with a quiet man in a plain dhoti coming up out of it holding a small "
        "lamp, and five brothers waiting at the top with their mother. Deep indigo night, "
        "amber lamplight, fireflies, painted floral borders."),

    "mahabharata-11": p(
        "the great hall of a marriage contest: high up under the roof a wooden fish turns "
        "slowly on a spinning wheel of iron, and on the floor directly below it a wide "
        "shallow bowl of still water holds its reflection; a slim young man in a plain "
        "student's cloth stands beside the bowl with an enormous bow drawn full, his eyes "
        "down on the water and not on the fish; kings in silks crowd the tiered seats "
        "leaning forward, a princess with a garland waits on the steps, drummers at the "
        "side. Carved pillars, hanging lamps, warm gold and deep red, dense ornament."),

    "mahabharata-12": p(
        "the marvellous hall of Indraprastha in bright morning: a vast pillared room where "
        "one floor is dark polished stone so smooth it mirrors the whole hall like still "
        "water, and beyond it a real lotus pool lies so clear that it looks like a floor; "
        "guests in brilliant silks walk through wondering, one pausing with a foot out and "
        "a hand on a pillar, another laughing and pointing; carved crystal columns, "
        "gold-leaf ceilings, painted lotuses, peacocks walking on the parapet, servants "
        "with trays. Cool turquoise and warm gold, sunbeams from high windows, rich ornament."),

    "mahabharata-13": p(
        "a great hall gone completely still: in the middle of the polished floor a low "
        "inlaid gaming board with a scatter of dice on it, one player sitting cross-legged "
        "and very upright with his hands flat on his knees and his eyes closed, and "
        "opposite him a lean smiling uncle in green with his palm just opening; all around, "
        "rows of old men and ministers sit motionless and lowered-eyed on their cushions, "
        "one standing with his arm out mid-protest; four brothers stand together against a "
        "pillar. Empty carpets where the treasure used to be, hanging lamps, deep red and "
        "gold, heavy amber lamplight and long shadows. Hushed and grave."),

    "mahabharata-14": p(
        "the same great hall, painted as a question: a queen in a plain sari with her hair "
        "loose stands alone and perfectly straight in the middle of the floor with her "
        "chin up and one hand open, speaking; every man in that enormous room — old "
        "warriors, ministers, teachers, princes — sits with his eyes on the floor and "
        "cannot answer her, one very old man with white hair holding his forehead; a "
        "carved throne at the head of the hall stands empty, and the dice lie where they "
        "fell. A single messenger halfway to the door. Deep crimson and gold, hanging "
        "lamps, tall pillars, painted floral borders. Her dignity fills the frame."),

    "mahabharata-15": p(
        "a city gateway at midday: a line of loaded chariots and carts halted on the road "
        "just outside it, horses stamping, bundles roped on, a family standing beside them "
        "with the reins still in their hands and their faces turned back — and a "
        "messenger on a dusty horse just reined in at the gate with his arm raised, "
        "calling them back; on the wall above, a blindfolded queen stands with one hand "
        "on the parapet. Red sandstone arches, banners, dust and hot gold light, painted "
        "wall ornament, a quiet and sinking moment."),

    "mahabharata-16": p(
        "a forest camp at night twelve years in: five brothers in bark cloth and a queen "
        "with her hair loose sitting in a close ring round a small bright fire under huge "
        "old trees, deep in argument — she leaning forward speaking with both hands open, "
        "the eldest sitting very still with his palms on his knees, the biggest one poking "
        "the fire with a branch, another lying back looking at the stars; a hut of leaves "
        "behind, deer resting at the edge of the light, a river beyond. Deep indigo night, "
        "warm amber firelight, fireflies, painted foliage and stars, intimate."),

    "mahabharata-17": p(
        "a high snow mountainside above the treeline in clear morning light: a young "
        "archer, dusty and worn, is picking himself up off the stones and staring — and "
        "the little heap of earth he had shaped is bare, while the wild flowers he laid on "
        "it are now sitting on the head of the huge smiling hunter standing in front of "
        "him in skins with a bow over his shoulder, a woman in red and gold beside him. "
        "Shiva drawn reverently in a folk-art idiom, warm and kind. Snow peaks, deodar "
        "cedars, mountain flowers, a bull resting on the rocks, rose-gold light, radiant."),

    "mahabharata-18": p(
        "a river ghat at sunrise: a tall young man in golden armour that is part of his "
        "own skin, with gold earrings, standing waist-deep in the bright water facing an "
        "enormous rising sun with both palms lifted and his eyes closed in prayer, the "
        "water pouring off his hands in bright drops; on the stone steps behind him a "
        "thin, plainly dressed traveller waits patiently with an empty begging bowl, and a "
        "few brass pots and flower offerings sit at the water's edge. Banded saffron and "
        "rose sky, herons, temple spires, painted ripples, deeply warm and dignified."),

    "mahabharata-19": p(
        "a forest lake at first light, so still it looks like polished glass: four brothers "
        "lie peacefully asleep in a row along the bank as though under a blanket, and the "
        "eldest kneels at the water's edge with his hands in the water and his head lifted, "
        "listening — a soft golden glow and a slow ring of ripples spreading from the "
        "middle of the lake where a voice is speaking. Deer at the far shore, cranes, "
        "reeds and lotus, dry hills beyond. Deep teal and warm gold, mist, fireflies, "
        "painted water pattern, calm and hushed."),

    "mahabharata-20": p(
        "one busy palace courtyard in a small kingdom, showing five people hiding in plain "
        "sight: a huge cheerful cook in an apron carrying an enormous steaming pot out of "
        "a kitchen doorway; a tall dance teacher in bangles, long braided hair and a "
        "bright sari teaching a circle of laughing girls a hand gesture on the veranda; "
        "twin grooms leading glossy horses past the stable arch and counting cattle beyond "
        "the wall; and a quiet gentleman playing dice with an old king in the shaded "
        "pavilion, while a hairdresser queen arranges the queen's hair at an upper window. "
        "Warm ochre walls, marigold garlands, parrots, painted arches, sunlit and lively."),

    "mahabharata-21": p(
        "a burning-ground at the edge of a field with one great old tree: a young prince in "
        "fine clothes halfway up the trunk, unwrapping a long bundle of cloth tied high in "
        "the branches and turning round very slowly with an enormous famous bow half "
        "uncovered in his hands, his eyes enormous; below, standing calmly beside a "
        "chariot and holding the reins, a tall dance teacher in bangles and a braid looks "
        "up with a small smile; far across the plain a long line of banners and standards. "
        "Dry gold grass, dust, wheeling kites, warm afternoon light, painted borders."),

    "mahabharata-22": p(
        "a cool palace bedchamber in Dwaraka at midday: a blue-skinned prince in yellow "
        "silk with a peacock-feather crown, drawn reverently in a folk-art idiom, sitting "
        "up on a low couch just woken, looking straight ahead — where a slim archer is "
        "sitting cross-legged on the floor at the foot of the couch with his palms joined; "
        "at the head of the couch a richly dressed king sits in a tall carved chair with "
        "his arms folded, half risen; conch, lamps, garlands, jali screens, a garden of "
        "flowering trees through the arch. Warm turquoise and gold, soft shadow, painted "
        "floral ornament."),

    "mahabharata-23": p(
        "the great court of Hastinapura, full and hushed: a blue-skinned envoy in yellow "
        "silk with a peacock feather in his crown, drawn reverently in a folk-art idiom, "
        "standing alone in the middle of the floor with one hand open, holding up five "
        "fingers as he speaks; ranked along the walls the whole family — an old white-"
        "haired grandfather with his palm out pleading, an old teacher leaning forward, a "
        "blind king on the throne with a hand raised, a blindfolded queen beside him, and "
        "a young king seated with his arms folded and his face set. Tall carved pillars, "
        "hanging lamps, deep crimson carpets, gold ornament, tense warm lamplight."),

    "mahabharata-24": p(
        "a river ghat in the flat white heat of morning: a tall young man in golden armour "
        "stands at the water with his back turned and his palms lifted to the sun, "
        "finishing his prayers, and a little way behind him on the hot stone steps an "
        "older woman in a plain sari stands waiting bareheaded in the full sun with her "
        "hands folded, having waited a long time; her shadow reaches almost to his heel. "
        "Temple spires, brass pots, a lone crane, bright water. Bleached gold and deep "
        "ochre, hard clean light, painted step and border ornament. Quiet and heavy."),

    "mahabharata-25": p(
        "an enormous flat dry plain at sunrise with two great armies drawn up facing each "
        "other far apart, standards and banners and rows of chariots and elephants "
        "standing perfectly still in the mist: and alone in the wide empty ground between "
        "them, a king who has taken off his armour and left his weapons behind walks "
        "barefoot across to the other side and kneels to put his head at the feet of a "
        "very old white-haired warrior, who is laying a hand on his head; other old "
        "teachers wait beside him. Conch-blowers on both lines, dust, wheeling birds. "
        "Banded rose and gold dawn, long shadows, painted banner ornament. Grave and gentle."),

    "mahabharata-26": p(
        "two friends and a chariot at dawn, calm and quiet: a beautiful painted chariot "
        "with four white horses standing at rest in the wide empty middle of a plain, its "
        "great banner hanging still with an old monkey sitting cheerfully on top of it; in "
        "the chariot a blue-skinned charioteer in yellow silk with a peacock-feather crown, "
        "drawn reverently in a folk-art idiom, has turned round on the driving seat and is "
        "talking gently, one hand open, to a young archer sitting on the chariot floor with "
        "his bow laid down beside him and his head bowed. Two distant armies stand "
        "motionless as bands of colour on the horizon. Soft mist, rose and gold sky, "
        "morning star, painted chariot and border ornament. Tender and still."),

    "mahabharata-27": p(
        "the field gone completely quiet at evening: a very old white-haired warrior lying "
        "on his back a little way above the ground, resting on a great bed of arrows as if "
        "on a couch, calm and awake, with three arrows set in the earth as a pillow under "
        "his head; warriors from both armies stand all around him in a wide respectful "
        "ring with their weapons laid on the ground, some kneeling, one young archer "
        "beside him with a hand over his face — and a clear spring of bright water rising "
        "out of the earth by his shoulder. Marigold flowers laid on the sand, lamps being "
        "lit, banners at rest, a huge amber and violet sky, painted borders. Solemn, "
        "reverent, entirely still."),

    "mahabharata-28": p(
        "an empty plain at dusk after the day has ended: a single tall chariot wheel "
        "standing upright and alone in the middle of the swept ground with a small oil "
        "lamp burning at its foot and a heap of marigold and jasmine flowers laid around "
        "it; the great spiral of the day's formation still faintly drawn in the dust "
        "wheeling away outward across the whole plain; far off, a lone chariot returning "
        "with its lamp lit, and the tents of a camp beyond. Deep violet and amber evening, "
        "first stars, mist, painted wheel and border ornament. Quiet, tender, aching."),

    "mahabharata-29": p(
        "the moment a very old teacher stops: he has stepped down from his chariot in the "
        "middle of a dusty field and sat down cross-legged on the bare ground with his bow "
        "laid on the chariot floor behind him, his hands open on his knees and his eyes "
        "closed, his white hair loose; a little way off a king in white stands quite still "
        "with his mouth just closing and his hand half lifted, unable to look at him, and "
        "a grey elephant is being led quietly away in the background. Standards and dust "
        "all around at a distance, wheeling kites, low gold light and long shadows, "
        "painted borders. Hushed and terrible and calm."),

    "mahabharata-30": p(
        "late afternoon on a wide plain, everything waiting: a magnificent chariot stopped "
        "at an angle with its right wheel sunk deep into soft dark earth to the axle, its "
        "horses standing quiet with lowered heads, and its owner — a tall man in a plain "
        "tunic where the golden armour used to be — down off it with his bow laid on the "
        "ground and both hands and one shoulder on the rim of the wheel, looking across "
        "and calling out; some way off, a second chariot stands still, its archer standing "
        "with his bow lowered and its blue-skinned charioteer turned towards him. Long "
        "gold light, dust hanging in the air, painted chariot ornament. Held breath."),

    "mahabharata-31": p(
        "a wide still lake at first light among dry hills: a big man in a plain wet dhoti "
        "standing waist-deep in the middle of the cold water with a heavy carved mace "
        "resting on his shoulder, his head up, quite calm, water running off him and rings "
        "spreading out from him across the mirror surface; on the bank a small group of "
        "five men stands watching in a row with a blue-skinned figure a little behind them; "
        "reeds, cranes lifting off, an abandoned banner leaning in the mud. Pale silver "
        "and rose dawn, mist on the water, painted ripple pattern. Cold, quiet, grand."),

    "mahabharata-32": p(
        "an enormous empty plain in the grey first light of morning after everything is "
        "over: a long line of women in white walking slowly out across it from a distant "
        "city gate, carrying small oil lamps and baskets of marigold and jasmine, some "
        "kneeling to lay flowers on the swept ground; at the front a queen with a cloth "
        "bound over her eyes walks holding another woman's arm, her free hand out in front "
        "of her, and a blue-skinned figure stands alone and still a little way off with his "
        "head bowed as she turns towards him. Fallen standards and banners lying quiet, "
        "mist, a river beyond, cranes. Cool pearl grey, soft rose in the east, warm lamp "
        "flames, painted borders. Overwhelming grief, held with dignity, nothing frightening."),

    "mahabharata-33": p(
        "a snowy mountain summit in a blaze of light: a lean old king in a worn white cloth "
        "standing in deep snow with one hand resting on the head of a thin, tired brown dog "
        "pressed against his leg, refusing the golden chariot that waits beside him on the "
        "peak — a radiant crowned figure standing in it with his hand held out, white "
        "horses, wheels of light, the whole sky behind him opened up in gold and rose; "
        "footprints in the snow leading up out of cloud and pine far below. Himalayan "
        "peaks, drifting snow, small painted birds, luminous banded sky, rich painted "
        "ornament. Warm, radiant, loyal."),
}


# --------------------------------------------------------------------- utils --
# ---------------------------------------------------------------- kill switch --
# A fleet of workers re-runs this script on a loop, so "stop generating" cannot be done
# by killing processes — they come straight back. Touch tools/.artstop and every run
# exits immediately instead. Delete it to resume.
STOP_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".artstop")


def check_stop():
    if os.path.exists(STOP_FILE):
        print("tools/.artstop present — generation halted deliberately. "
              "Delete that file to resume.", flush=True)
        sys.exit(0)


def load_cards():
    """Every card in both epics, in order, as
       (key, epicId, episodeN, cardIndex, cardText, episodeTitle).

       Reads the data through node rather than by regex: card text is prose full of
       apostrophes, commas and quoted dialogue, and a regex over it would silently
       mis-split. node hands back exactly what the app sees."""
    script = r"""
      global.window = {};
      ['app/avatars.js','app/data-epic-ramayana.js','app/data-epic-mahabharata.js']
        .forEach(function (f) { eval(require('fs').readFileSync(f, 'utf8')); });
      var out = [];
      [window.IND_EPIC_RAMAYANA, window.IND_EPIC_MAHABHARATA].forEach(function (E) {
        E.episodes.forEach(function (ep) {
          ep.cards.forEach(function (c, i) {
            out.push([E.id + '-' + ep.n + '-' + i, E.id, ep.n, i, c.text, ep.title]);
          });
        });
      });
      process.stdout.write(JSON.stringify(out));
    """
    res = subprocess.run(["node", "-e", script], cwd=ROOT,
                         capture_output=True, text=True, check=True)
    return json.loads(res.stdout)


def build_card_prompt(epic_id, n, card_text, ep_title):
    """One prompt per card.

       The 57 hand-written episode prompts in PROMPTS are not thrown away — each is used
       as the SETTING ANCHOR for every card in its episode. Without it the model happily
       paints twelve differently-shaped halls for twelve cards of one scene; with it the
       episode holds together and the card text only has to move the moment along.

       The card text is narrative prose written for a child, which is close to an ideal
       image prompt already. It is passed through as the subject rather than paraphrased,
       so what is painted is what is actually read on that card."""
    anchor = PROMPTS.get("%s-%s" % (epic_id, n), "")
    # Drop the STYLE preamble off the episode prompt; only its scene description is wanted.
    if anchor.startswith(STYLE):
        anchor = anchor[len(STYLE):]
    parts = []
    if anchor:
        parts.append("The setting for this whole episode, which every page shares: " +
                     anchor.rstrip(". ") + ". ")
    parts.append("This page of that episode, “%s”, shows this moment: %s"
                 % (ep_title, card_text.strip()))
    # Said every time rather than once, because it is the rule most likely to be lost in a
    # long prompt, and these two books contain a war.
    parts.append(" Paint it as stillness — the moment before or the moment after — with "
                 "everyone drawn calmly and reverently, gentle enough for a small child.")
    return STYLE + "".join(parts)


def to_jpeg(raw_bytes, path, master_path=None):
    """Write the web copy, and the near-native master the digital book will use."""
    im = Image.open(io.BytesIO(raw_bytes)).convert("RGB")

    if master_path:
        os.makedirs(os.path.dirname(master_path), exist_ok=True)
        im.save(master_path, "JPEG", quality=MASTER_QUALITY,
                optimize=True, progressive=True)

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


def ref_parts():
    """Style-reference paintings as inline_data parts, loaded once and cached."""
    if not hasattr(ref_parts, "cache"):
        parts = []
        for path in REF_IMAGES:
            if os.path.exists(path):
                with open(path, "rb") as fh:
                    parts.append({"inline_data": {
                        "mime_type": "image/jpeg",
                        "data": base64.b64encode(fh.read()).decode("ascii")}})
        ref_parts.cache = parts
    return ref_parts.cache


def generate(prompt, key, model):
    """One call. Returns PNG bytes. Retries 3x with backoff on 429/5xx."""
    parts = list(ref_parts())
    parts.append({"text": (REF_NOTE if parts else "") + prompt})
    body = json.dumps({"contents": [{"parts": parts}]}).encode()
    last = None
    for attempt in range(3):
        req = urllib.request.Request(
            ENDPOINT % model, data=body,
            headers={"Content-Type": "application/json", "X-goog-api-key": key})
        try:
            with urllib.request.urlopen(req, timeout=240) as resp:
                data = json.load(resp)
            for part in data["candidates"][0]["content"]["parts"]:
                if "inlineData" in part:
                    return base64.b64decode(part["inlineData"]["data"])
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


def write_manifest(keys):
    lines = [
        "/* Bizzing India — epic card artwork index. GENERATED by tools/gen-epic-art.py.",
        "   Keys are <epicId>-<episode>-<card>, one per card of data-epic-ramayana.js and",
        "   data-epic-mahabharata.js, with a painting at app/art/epic/<key>.jpg (900x506).",
        "",
        "   Two tiers. This one is the web copy the app serves. The near-native master for",
        "   the digital book is at masters/epic/<key>.jpg — outside app/, so deploy.sh never",
        "   ships it and gh-pages stays light.",
        "",
        "   The browser fetches only the card on screen, so a child downloads ~120KB per",
        "   card turned rather than the whole set. That stops being true the day a service",
        "   worker precaches for offline: epic art should be cache-on-read, not bundled with",
        "   the shell. */",
        "window.IND_EPIC_ART = [",
    ]
    lines += ["  '%s'," % k for k in keys]
    lines += ["];", ""]
    with open(MANIFEST, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))


# ---------------------------------------------------------------------- main --
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma-separated card keys to (re)generate")
    ap.add_argument("--slice", help="i/n — take every nth card starting at i, so several "
                                    "workers can share the list without overlapping")
    ap.add_argument("--limit", type=int, help="stop after this many generation calls")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--manifest-only", action="store_true")
    ap.add_argument("--print-prompt", help="print one card's prompt and exit, no API call")
    args = ap.parse_args()
    check_stop()

    os.makedirs(OUT_DIR, exist_ok=True)
    cards = load_cards()
    by_key = {c[0]: c for c in cards}
    known = [c[0] for c in cards]

    if args.print_prompt:
        c = by_key[args.print_prompt]
        print(build_card_prompt(c[1], c[2], c[4], c[5]))
        return

    # The 57 episode prompts are the setting anchors; warn if an episode has none, because
    # its cards then have nothing holding them to one place.
    eps = sorted({"%s-%s" % (c[1], c[2]) for c in cards})
    missing = [e for e in eps if e not in PROMPTS]
    if missing:
        print("WARNING no setting anchor for:", ", ".join(missing))

    calls = 0
    if not args.manifest_only:
        key = os.environ.get("GEMKEY")
        if not key:
            sys.exit("GEMKEY not set")

        wanted = known
        force = set()
        if args.only:
            force = {s.strip() for s in args.only.split(",") if s.strip()}
            wanted = [k for k in known if k in force]
        elif args.slice:
            i, n = (int(x) for x in args.slice.split("/"))
            wanted = [k for j, k in enumerate(known) if j % n == i]

        for ck in wanted:
            if args.limit is not None and calls >= args.limit:
                print("limit reached, stopping")
                break
            path = os.path.join(OUT_DIR, ck + ".jpg")
            if ck not in force and os.path.exists(path) and os.path.getsize(path) > 4000:
                continue
            c = by_key[ck]
            try:
                calls += 1
                raw = generate(build_card_prompt(c[1], c[2], c[4], c[5]), key, args.model)
                to_jpeg(raw, path, os.path.join(MASTER_DIR, ck + ".jpg"))
                print("made  ", ck, "%.0f kB web" % (os.path.getsize(path) / 1024),
                      flush=True)
            except Exception as err:
                print("FAIL  ", ck, err, flush=True)
            time.sleep(1)

    have = [k for k in known if os.path.exists(os.path.join(OUT_DIR, k + ".jpg"))]
    write_manifest(have)
    total = sum(os.path.getsize(os.path.join(OUT_DIR, k + ".jpg")) for k in have)
    mtot = sum(os.path.getsize(os.path.join(MASTER_DIR, k + ".jpg"))
               for k in have if os.path.exists(os.path.join(MASTER_DIR, k + ".jpg")))
    print("\n%d/%d cards · web %.1f MB · masters %.1f MB · %d generation calls this run"
          % (len(have), len(known), total / 1e6, mtot / 1e6, calls))


if __name__ == "__main__":
    main()
