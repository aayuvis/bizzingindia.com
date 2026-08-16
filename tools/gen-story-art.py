#!/usr/bin/env python3
"""Generate one hero painting per Bizzing India story.

Why: docs/10-the-corpus.md sec 3.5 — "Artwork does the work of a grandmother's face.
It has to be beautiful or none of this lands." Each story gets one painting of its
single most iconic moment, in the same house style as app/art/banner/*.jpg.

Usage:
    export GEMKEY=...            # never hardcode, never print
    python3 tools/gen-story-art.py                 # resumable: skips what exists
    python3 -u tools/gen-story-art.py --slice 3/4  # one worker's share (-u: live progress)
    python3 tools/gen-story-art.py --only pt.lion-rabbit,ka.ganesha-race   # regen
    python3 tools/gen-story-art.py --print-prompt fk.tejimola   # no API call
    python3 tools/gen-story-art.py --manifest-only

Output:
    app/art/story/<slug>.jpg      900x600, JPEG q78 — what the app serves
    masters/story/<slug>.jpg      near-native q92 — the digital book tier, like
                                  masters/epic/. Outside app/, so deploy.sh never
                                  ships it and gh-pages stays light.
    app/story-art-manifest.js     window.IND_STORY_ART = [...]

HOW A PROMPT IS BUILT, at 283 stories. The first 78 paintings were made from the
hand-written PROMPTS below, one prompt per story, and those stay exactly as they are —
they are the overrides. Every story without an entry gets its prompt composed by
build_prompt() from the story's own title, hook, scene texts and moral — the same move
tools/gen-epic-art.py makes with build_card_prompt(), including the always-appended
gentleness clause. The scene prose is written for a child and is already close to an
ideal image prompt; the model picks the iconic moment out of it. Stories whose iconic
moment must NOT be left to the model — a battle, a death, a Muslim religious subject,
an indigenous community where depiction risks caricature — get a hand-written override
added to PROMPTS instead (see the SIX-TRANCHE OVERRIDES block at the end of PROMPTS).

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
  * every request carries two finished paintings from this set as image references
    (REF_IMAGES below). Written style words alone drift badly across forty calls;
    handing the model the actual paintings converges the whole batch in one pass.
    This matters more than any adjective in STYLE.
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
OUT_DIR = os.path.join(ROOT, "app", "art", "story")
MANIFEST = os.path.join(ROOT, "app", "story-art-manifest.js")
ENDPOINT = ("https://generativelanguage.googleapis.com/v1beta/models/"
            "%s:generateContent")
# gemini-3.1-flash-image returns 1408x768 natively — landscape, high enough to double as
# a page in the digital book. The first 78 were made on gemini-2.5-flash-image (1024x1024);
# the web tier stays 900x600 so all 283 stay consistent in the app.
DEFAULT_MODEL = "gemini-3.1-flash-image"

# The story data files, in the order the app merges them.
DATA_FILES = ["data-stories.js", "data-stories-regional.js", "data-stories-more.js",
              "data-stories-north.js", "data-stories-south.js", "data-stories-east.js",
              "data-stories-west.js", "data-stories-ne-a.js", "data-stories-ne-b.js",
              "data-stories-modern.js", "data-stories-vigyan.js"]

MASTER_DIR = os.path.join(ROOT, "masters", "story")
MASTER_QUALITY = 92           # near-native; the book tier, same as masters/epic
WIDTH, HEIGHT, QUALITY = 900, 600, 78

# Two finished paintings from this same set, sent with every request so the model
# matches the book rather than re-inventing it. One animal/forest scene, one with
# people and architecture, so both halves of the corpus have something to lock on to.
REF_IMAGES = [
    os.path.join(OUT_DIR, "pt-lion-rabbit.jpg"),
    os.path.join(OUT_DIR, "fk-mahabali.jpg"),
]

REF_NOTE = (
    "The two paintings above are from the same children's book. Match them exactly: "
    "the same fine ink linework, the same warm saturated palette, the same handmade-paper "
    "grain, the same soft painted shading, the same density of small ornament. "
    "Paint the new scene below as another page of that same book. "
)

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
        "a long row of glossy black crows squabbling along the top of a red sandstone "
        "palace wall at sunset, and many more crows scattered across the rose-gold sky "
        "above the white domes and minarets — each single bird drawn clearly with its "
        "wings open; on a marble balcony an emperor in a jewelled turban and his "
        "minister lean on the railing counting them on their fingers. Warm dusk, jali "
        "screens, flowering creepers, painted birds."),

    "ka.ganesha-race": p(
        "drawn reverently in a folk-art idiom: the elephant-headed Ganesha, round and "
        "gentle, walking slowly in a circle around his mother and father who sit "
        "together on a lotus seat on a snowy Himalayan peak; his small mouse trots "
        "beside his feet, and a single golden mango glows in the air above. Kailash "
        "snow, lotus, moon, soft radiant light, ornamental painted borders of leaves."),

    "ka.hanuman-leap": p(
        "drawn reverently in a folk-art idiom: Hanuman the monkey-faced vanara hero "
        "with orange-red fur, a golden crown, a flower garland and a long tail curling "
        "behind him, flying in a great soaring arc high above a bright blue sea, one "
        "arm stretched forward; behind him a mountain top and a whirl of uprooted trees "
        "and pink blossom tumbling along in his wake; far ahead across the shining "
        "water a small green island, and a little mountain rising out of the waves "
        "below. Banded dawn clouds of gold and rose, spray, sweeping painted sea."),

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
        "deep night in a south Indian garden of broad plantain leaves around an old "
        "round stone well: four weary thieves in the blue darkness hauling dripping "
        "buckets up on a rope and tipping the water out across rows of vegetables that "
        "have grown thick and lush from it; behind them a tiled house with one small "
        "shuttered window glowing warm gold, where a smiling man and his wife peep out "
        "at the scene. Indigo night, big silver moon, fireflies, coconut palms."),

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
        "open with a shaft of daylight falling across the empty floor, and standing "
        "together in the middle of the room a group of exactly three great carved "
        "wooden figures side by side — one large and black, one large and white, and a "
        "smaller yellow one between them — every one with enormous round eyes, a wide "
        "painted smile and short unfinished arms; wood shavings and a chisel on the "
        "ground, a queen at the doorway with her hand on the frame; the sea and temple "
        "towers beyond. Bold Odia painted line and colour."),

    "fk.naga-brothers": p(
        "a Naga hill village on a high ridge at dusk, painted in warm ochre, deep red "
        "and gold: a thatched longhouse with carved wooden beams and a big fire glowing "
        "orange inside, a young man standing in the lit doorway, an old mother seated "
        "on the step reaching one hand out toward the trees, and at the edge of the "
        "dark forest a striped tiger pausing to look back over his shoulder at her; "
        "terraced hillsides and cloud filling the valley beyond, red-and-black woven "
        "shawl patterns everywhere. Warm firelight against a deep blue evening."),

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
        "a starlit forest at night, foliage and sky filling the whole width of the "
        "picture: a calm crowned king striding along a winding path carrying a "
        "friendly folded bat-winged spirit piggyback on his shoulders, the spirit "
        "chattering away and gesturing with one long hand; behind them a huge gnarled "
        "old tree whose branches are full of fireflies, and the path winding away "
        "between more trees into the dark. Deep midnight blue and gold, painted stars "
        "across the entire sky, whimsical and friendly."),

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

    # =============================================== data-stories-more.js =====
    # -- Jataka --
    "jt.golden-goose": p(
        "a magnificent hamsa goose made entirely of metal — every single feather a "
        "separate leaf of beaten gold, drawn individually and overlapping like scale "
        "armour or goldsmith's work, each one catching the light with bright highlights "
        "and deep amber, bronze and copper shadow between them, so the whole bird reads "
        "as burnished treasure and glows against the sky; he has the graceful arched "
        "neck, rounded crown and short pale coral bill of a bar-headed goose, ruby eye, "
        "wings half-lifted with long gold flight feathers fanned. He stands on the low "
        "terracotta-tiled roof of a small village house at sunrise, letting one glowing "
        "gold feather drift down onto the doorstep below; a mother and three daughters "
        "in patched saris of deep indigo, crimson and marigold stand in the doorway with "
        "their hands at their mouths, looking up at him. A deep rose, amber and saffron "
        "sunrise burning behind them with a low golden sun, the house walls warm "
        "terracotta and ochre lit by that light, long warm shadows across the swept "
        "earth, sewing baskets on the step, a mango tree in deep emerald leaf, green and "
        "gold fields beyond, white doves. Richly saturated jewel tones, deeply warm and "
        "glowing, the painted scene running right off all four edges of the picture."),

    "jt.woodpecker-lion": p(
        "a calm golden lion lying on the forest floor with his head resting sideways on "
        "the grass and his jaws propped wide apart by a short stick standing upright "
        "between his upper and lower teeth like a tent pole, holding perfectly still "
        "and patient with his eyes closed; a small green-and-crimson woodpecker stands "
        "right at the front of his open mouth with her whole head and shoulders "
        "disappearing inside it, tail up, feet braced on his lower lip, working away. "
        "Dappled sunlight through leaves, painted ferns and flowers, curious deer "
        "peeping from behind a tree. Gentle, kind, faintly comic, entirely unfrightening."),

    "jt.elephant-dog": p(
        "a sunny palace stable yard: a great grey elephant with painted forehead "
        "markings lifting a small delighted street dog high with his curling trunk and "
        "setting him on top of his own head, the dog with all four legs waving; stable "
        "boys clapping, a trough of rice, a wise old minister smiling in the archway. "
        "Warm golden light, marigold garlands, painted arches, joyful."),

    "jt.nandivisala": p(
        "a magnificent white ox with a great hump and painted horns leaning into a "
        "wooden yoke and taking the first step, while behind him a line of a hundred "
        "loaded bullock carts, roped one to the next, stretches away down a dusty road "
        "to the horizon; his owner leans forward from the front cart speaking softly to "
        "him, and a whole town lines the roadside cheering. Bright dust, hot gold light."),

    "jt.monkey-gardener": p(
        "a royal pleasure garden at dusk in cheerful comedy: a troop of monkeys busily "
        "pulling young saplings out of their neat rows and holding them up in the air to "
        "measure their dangling roots, brass water pots and leather buckets everywhere, "
        "one chief monkey sitting on a stone bench directing the work with great "
        "seriousness; flower beds, a garden wall, a mango tree, warm evening colour."),

    "jt.crocodile-rock": p(
        "a moonlit river at dusk: a monkey standing on the near bank with both hands "
        "cupped around his mouth, shouting cheerfully across the water at a large grey "
        "boulder in midstream — and the boulder is quite clearly a big crocodile lying "
        "flat with his eyes just showing, opening his mouth to answer; the far bank is "
        "an island of fruit trees. Silver moon, indigo water, reeds, fireflies, comic."),

    "jt.parrot-figtree": p(
        "a huge old fig tree on a riverbank whose bare grey branches are bursting back "
        "into green leaf in a spreading haze from the middle outward: one small green "
        "parrot sits firmly on a high branch on the left where he has always sat, and "
        "beside him a great goose with wings the colour of morning; new figs appearing, "
        "a flock of birds returning across a golden sky, the Ganga wide below."),

    "jt.partridge-elders": p(
        "in deep saturated jewel tones, rich full-strength colour running right out to "
        "all four corners of the frame: under an enormous spreading banyan tree in full "
        "emerald and viridian leaf, three friends stacked one on another and walking "
        "along together — a big grey elephant painted with marigold and vermilion and "
        "turquoise ornament on a crimson caparison below, a warm russet-brown monkey "
        "sitting on his back, and a small partridge with chestnut and cream barred "
        "plumage perched on the monkey's shoulder, all three looking pleased with "
        "themselves; hanging aerial roots, ripe purple figs, scarlet and emerald and "
        "sapphire painted birds, dense flowering creepers, and a honey-coloured "
        "sandstone gateway carved with the same three animals beyond, warm ochre earth "
        "underfoot. Strong warm golden afternoon light, deep glowing shadows under the "
        "canopy, luminous and richly painted from edge to edge."),

    "jt.quail-fire": p(
        "in deep saturated jewel tones with rich full-strength colour: a tiny downy "
        "quail chick sitting up bright, serene and unafraid in a grass nest at the "
        "centre of a perfect circle of deep emerald and viridian untouched grass, while "
        "a low grass fire curves gently and respectfully away all around the outside of "
        "that circle and travels off up the slope — the fire painted as living "
        "atmosphere, molten amber and vermilion and gold at its base, its warm glow "
        "washing across the grass and lighting the underside of drifting smoke that "
        "catches the light in soft rose and bronze plumes; a deep marigold and saffron "
        "dawn sky above with a band of ultramarine at the top, deer and painted birds "
        "moving calmly away across the hillside in the warm haze, dense flowering herbs "
        "and grasses in emerald and teal in the foreground. Radiant, glowing, protected, "
        "utterly gentle, colour rich to all four corners."),

    "jt.guttila-veena": p(
        "a great open assembly ground in Benares at night: an old master musician "
        "seated cross-legged on a low platform playing a long veena that has a single "
        "string left on it, his eyes closed; thousands of people sit hushed on the "
        "ground in the lamplight, the king at the front, a young musician standing to "
        "one side holding his own perfect seven-stringed instrument and listening. "
        "Hanging oil lamps, deep blue night, warm gold pools of light."),

    "jt.three-birds-king": p(
        "a palace chamber at night: a king in a plain robe sitting on the floor beside "
        "three wooden perches, talking earnestly to three birds — a round wise owl, a "
        "bright green parrot and a small brown hen — who look back at him and are "
        "plainly answering; one oil lamp, an open window full of stars, carpets, jali "
        "screens, painted flowers. Intimate, warm, gold on deep blue."),

    "jt.trees-together": p(
        "a great storm on the plain: on the right a dense wood whose trees lean together "
        "with their branches interlocked, holding firm while only leaves fly off them; "
        "on the left a wide open field where a few very large solitary trees lie tipped "
        "over with their root plates in the air; a bruise-coloured sky, sheets of wind "
        "drawn as sweeping painted lines, birds sheltering deep inside the wood."),

    # -- Panchatantra & Hitopadesha --
    "pt.mongoose-baby": p(
        "the warm inside of a village house: a father sitting down flat on the floor "
        "with relief all over his face while a sleek little mongoose puts both front "
        "paws up on his knee, pleased with himself and waiting to be praised; just "
        "behind them a wooden cradle with a fat happy baby kicking both legs in the air. "
        "Lamplight, a doorway of daylight, painted floor patterns, brass pots, tender."),

    "pt.four-friends": p(
        "a golden evening field: a deer stepping free of a loosened rope net whose "
        "strands hang chewed apart, a small mouse standing on the net still holding a "
        "strand, a crow with wings spread overhead, and a determined tortoise arriving "
        "at a run from the far side; long grass, a distant wood, a lake beyond. Warm "
        "amber light, painted rope pattern, all four friends together in one frame."),

    "pt.mice-iron": p(
        "a court of judges in a Gujarati merchant town: a huge heavy iron balance-beam "
        "being carried in and set down on the floor by two straining porters, entirely "
        "unmarked; one merchant looking sheepish, another with his arms folded, a room "
        "of townspeople trying not to laugh, and a small mouse sitting quite innocently "
        "on a sack in the corner. Carved wooden pillars, warm ochre, scales, ledgers."),

    "pt.crane-crab": p(
        "high over a green landscape at midday: a big old crane in flight with a "
        "blue-grey crab riding on his long neck, both claws firmly clamped on either "
        "side of it, the crab looking sternly down; far below a small flat sun-baked "
        "rock in a field, and behind them the lily pond they came from with the hill "
        "between. Wide painted sky, swirling clouds, kingfisher blue and white."),

    "pt.elephants-rabbits": p(
        "a desert lake under an enormous full moon: a huge tusked elephant kneeling at "
        "the water's edge with his trunk just touching the surface, and the reflected "
        "moon breaking into a hundred shivering white pieces spreading right across the "
        "lake; a small rabbit stands upright on a high rock beside them with one paw "
        "raised, speaking, and the whole herd waits behind in the moonlight. Rajasthan "
        "dunes, silver and indigo, painted ripples."),

    "pt.two-headed-bird": p(
        "a lush green riverbank in full colour: a beautiful bird with one plump body and "
        "two long graceful necks and two heads, its plumage deep peacock blue, emerald "
        "green and gold with dense decorative feather pattern; the right head holds a "
        "glossy scarlet fruit in its beak and the left head is turned away, looking out "
        "over the water. Deep turquoise river with painted ripples, banks thick with "
        "emerald reeds and pink lotus, mango trees in full leaf, a white heron, a sunset "
        "sky of rose and marigold above, fireflies. Richly saturated, jewel-like, "
        "many different colours, ornamental and tender."),

    "pt.lion-makers": p(
        "a sunlit forest clearing in gentle comedy: a brand-new young lion standing in "
        "the grass having a great luxurious stretch with his eyes half shut, looking "
        "thoroughly pleased and not at all fierce; three learned young men in scholars' "
        "shawls are running away over the ridge with their books under their arms, and a "
        "fourth sits comfortably high in a tree looking down. Dappled light, painted "
        "leaves, scattered white bones and a fallen palm-leaf book on the ground."),

    "pt.drum-jackal": p(
        "an abandoned army camp field at dusk: a lean jackal crouching low in the grass "
        "with his ears up, staring at an enormous war drum lying on its side in a clump "
        "of bushes, a long branch swinging over it in the wind and striking the drumskin; "
        "beside the drum a burst sack spilling grain and provisions. Long shadows, "
        "abandoned tent pegs, dusty rose sky, painted drum ornament."),

    "pt.monkey-wedge": p(
        "a temple building yard at noon: a half-sawn log lying across trestles with a "
        "wooden wedge driven into the split, and a young monkey sitting astride the log "
        "with both hands gripping that wedge and heaving at it with all his might; other "
        "monkeys sitting in the empty buckets and inspecting the saws, the carpenters' "
        "lunch cloths abandoned, a half-carved stone temple rising behind. Bright, comic."),

    "pt.singing-donkey": p(
        "a moonlit cucumber field: a fat happy grey donkey standing among the vines with "
        "his head thrown right back and his mouth wide open, singing at the moon with "
        "enormous feeling; a jackal is slipping neatly out through a gap in the thorn "
        "fence in the foreground, glancing back; a farmer's hut with one lit window a "
        "little way off. Silver-blue night, curling vines, comic and warm."),

    # -- Puranic --
    "pu.samudra-manthan": p(
        "drawn reverently in a folk-art idiom, the great churning of the ocean of milk: "
        "Mount Mandara standing upright in the middle of a wide sea, spinning on the "
        "broad back of an enormous serene tortoise, with the huge coiled serpent Vasuki "
        "wound round the mountain as a rope; two long lines of figures haul on either "
        "end of him from left and right; overhead the goddess Lakshmi rises standing on "
        "a pink lotus with elephants pouring water, and beside the mountain a "
        "blue-throated Shiva stands calm and gentle. Foam, conch shells, banded gold and "
        "turquoise sea, radiant light."),

    "pu.ganga-shiva": p(
        "drawn reverently in a folk-art idiom: Shiva seated serenely on a snowy "
        "Himalayan peak with his eyes closed and a crescent moon in his piled-up matted "
        "hair, and the whole white torrent of a heavenly river falling out of the sky "
        "into that hair and disappearing, then coming out below as one clear bright "
        "stream that runs down the rock; a prince in a saffron and vermilion dhoti "
        "stands lower on the slope with his hands joined, walking ahead of the new river "
        "as it goes down to the plain. The slope is held by enormous ancient Himalayan "
        "deodar cedars with thick furrowed reddish-brown trunks and broad tiers of long "
        "drooping blue-green needled branches sweeping downward and outward. Warm golden "
        "hour light: the snow and the rock lit rose-gold and honey-amber, deep marigold "
        "and saffron in the sky behind the peak, warm ochre and terracotta in the stone, "
        "rich viridian and emerald in the meadow below with marigold and crimson "
        "wildflowers. Silver spray, small rainbows, gold ornament. Deeply warm and "
        "saturated, glowing, richly painted to all four corners."),

    "pu.durga-mahisha": p(
        "drawn reverently in a folk-art idiom, the moment of calm victory: the goddess "
        "Durga seated serenely side-saddle on a great golden lion on a green hilltop at "
        "dawn, radiant and smiling gently, with many arms each holding a different "
        "emblem — lotus, conch, discus, bow, bell — held quietly at rest; a crown, red "
        "and gold silk, heavy jewellery, a garland of hibiscus. All around her the devas "
        "stand with their hands joined offering lamps and flowers, and the sky behind is "
        "full of golden light. Marigolds, drums, festival banners, deeply warm."),

    "pu.narasimha-prahlad": p(
        "drawn reverently in a folk-art idiom, the quiet moment after: in a warm "
        "honey-coloured sandstone and cream marble palace hall at dusk, every surface "
        "washed golden and amber by lamplight, the lion-faced Narasimha sits calmly on "
        "the threshold step, entirely at peace and resting, his mane a deep flame-orange "
        "and russet, his silks marigold and crimson, his ornaments heavy gold; a small "
        "boy in a saffron dhoti stands at his knee with his hands joined and his eyes "
        "shining, and one great hand rests gently on the boy's head. Behind them a great "
        "carved pillar stands cracked open with warm golden light pouring out of it and "
        "spilling across the floor. Many small oil lamps with amber flames, scalloped "
        "arches, deep indigo and umber shadow in the far hall, courtiers bowing in the "
        "warm gloom, garlands of marigold, painted floral borders in vermilion and "
        "turquoise. Tender, radiant, richly saturated, deeply warm."),

    "pu.dhruva-star": p(
        "a small boy standing alone and very straight in a clearing in a dark forest at "
        "night, his hands joined, his face turned up to an immense sky of painted stars "
        "— and directly above him one large steady white star, brighter than the rest, "
        "with all the other stars drawn as fine circling trails wheeling around it; "
        "sages' huts, deer resting, fireflies, deep indigo and gold. Still and hopeful."),

    "pu.krishna-kaliya": p(
        "drawn reverently in a folk-art idiom, the most-painted scene in Braj: the boy "
        "Krishna, blue-skinned, in a yellow dhoti with a peacock feather in his hair, "
        "dancing lightly on the spread hoods of a great many-headed serpent in the "
        "middle of the Yamuna, one foot raised, one hand holding the serpent's tail like "
        "a ribbon, smiling; the serpent's wives rise from the water on either side with "
        "their hands joined; the whole village of cowherds and cows crowds the bank "
        "under a kadamba tree, watching. White water, lotuses, turquoise and gold."),

    "pu.govardhan": p(
        "drawn reverently in a folk-art idiom: the boy Krishna, blue-skinned in a yellow "
        "dhoti, standing easily and holding an entire green hill up on the little finger "
        "of one raised hand like an umbrella; underneath the hill the whole village of "
        "Vrindavan shelters dry — men, women, children, cows, calves, dogs and carts — "
        "and all around the rim the cowherds hold their long wooden staffs up against "
        "the underside of the hill, taking their share. Sheets of monsoon rain outside, "
        "peacocks, deep greens, warm gold light under the hill."),

    "pu.markandeya": p(
        "a small stone Shiva shrine by the sea at dusk: a boy with both arms wrapped "
        "tightly around a smooth dark stone lingam on its round base, his cheek against "
        "it and his eyes shut, a small oil lamp and fresh flowers beside him — and out "
        "of the stone itself a gentle radiance of warm light spreading through the whole "
        "shrine, with the calm figure of Shiva appearing within that light, drawn "
        "reverently in a folk-art idiom. Coconut palms, waves, bilva leaves, deep "
        "protective glow."),

    # -- Regional folk --
    "fk.bhekuli-biya": p(
        "an Assam village at the end of a hot dry afternoon: a children's frog wedding "
        "in full swing — two little frogs dabbed with turmeric sitting side by side "
        "under a tiny pandal made of banana leaf, a small boy holding a big umbrella "
        "over them, girls in mekhela chador singing with their hands raised, someone "
        "banging a dhol; the whole village watching and laughing, a grandmother on the "
        "step; cracked paddy fields beyond and the first heavy dark clouds finally "
        "coming over the hills. Marigold, brass, green and gold."),

    "fk.lepcha-tower": p(
        "a towering column of thousands of round clay cooking pots stacked one on "
        "another, rising from a Sikkim hillside past the pines and up into the cloud "
        "out of sight, with a long line of tiny people passing pots hand to hand all the "
        "way up it; the great white snow wall of Kanchenjunga stands behind in the "
        "clear morning air. Prayer flags, terraced fields, cardamom groves, deep blue "
        "sky, awe and scale."),

    "fk.pebet": p(
        "a Manipur grassland at golden hour: a very small brown mother bird flying low "
        "and heavy just above the grass tops with her smallest chick clinging "
        "underneath her, heading for a dense thorn bush; five other fledglings wobble "
        "off in five directions overhead; below in the grass a startled cat sits with "
        "his paw half raised, quite outwitted. Lotus pond, tall reeds, warm gold light."),

    "fk.hojagiri-pots": p(
        "a Tripura hill village at night: eight Reang girls in black and red woven "
        "risa and rignai each balanced on top of an upturned earthen pitcher, dancing "
        "with only their knees and hips moving, a bottle standing on each girl's head "
        "and a lit oil lamp burning on top of each bottle, a cloth in their hands; "
        "drummers seated in front, harvested paddy sheaves stacked behind, the whole "
        "village watching. Deep night blue, eight steady flames, firelight, bamboo."),

    "fk.parashuram-coast": p(
        "drawn reverently in a folk-art idiom: a calm sage-warrior with an axe across "
        "his shoulder standing high on the green cliff-top of the Western Ghats, having "
        "just loosed an arrow far out over the sea — the arrow drawn as a long golden "
        "arc over the water; below him the sea has drawn back and left a wide new strip "
        "of dark shining land between the mountains and the waves, and people are "
        "already coming down the slope to it with baskets and coconut saplings. "
        "Monsoon-washed greens, laterite red earth, palms, radiant sky."),

    "fk.hadimba-cedar": p(
        "a tall wooden temple with a triple pagoda roof standing in a wood of "
        "enormous ancient deodar cedars above Manali, shafts of light coming down "
        "between the trunks in bars; a Kullu Dussehra procession winds up the path to it "
        "— village deities carried on flower-decked palanquins on men's shoulders, "
        "long horns, drums, women in Kullu shawls and caps; snow peaks glimpsed beyond. "
        "Deep green shade, warm gold light, carved wooden panels, hushed and grand."),

    "fk.santhal-first-birds": p(
        "the beginning of the world: an endless open ocean under a wide pale sky, with "
        "two tired birds circling low over it — and in the middle of the water an "
        "enormous calm tortoise holding perfectly still while a fresh island of dark "
        "earth grows across his broad back, an earthworm curling on the new soil, and a "
        "crab and a prawn watching from the shallows below. First green shoots, "
        "first light on the water, deep teal and gold, Santhal wall-painting patterns "
        "of white line on warm earth-red running round the scene."),

    "fk.karaikal-mango": p(
        "the doorway of a Tamil merchant's house in Karaikal at midday: a woman in a "
        "sari standing on the threshold placing a golden mango and a heap of rice onto a "
        "banana leaf held out by a thin, dusty wandering ascetic who has stopped at her "
        "door; behind her the cool dark of the house with brass vessels and a lit lamp, "
        "and a kolam drawn on the step. Coconut palms, hot white coastal light, deep "
        "reds and gold, quiet and generous."),

    "fk.andaman-fire": p(
        "a night seascape in the Andaman Islands: a small brilliant blue-and-orange "
        "kingfisher flying fast and low over the black water carrying a burning brand in "
        "his beak, a trail of bright sparks streaming behind him; ahead of him the dark "
        "green wall of an island forest with mangrove roots and tall trees, and behind "
        "him a great storm sky of piled cloud lit from within. Painted waves, phosphor "
        "on the water, deep indigo and ember orange. A landscape and a bird alone."),

    # Composed automatically this story's motto-shaped prose keeps coming back as
    # ribbon lettering across the sky — three rolls, three banners. Hand-composed
    # scene with no scroll, no ribbon, nothing shaped like a place for words.
    "ny.flipkart": p(
        "a Bengaluru lane at dusk in the mid-2000s: a young man on a small scooter, a "
        "stack of paper-wrapped books tied with string on the seat behind him, handing "
        "one wrapped book down to a delighted mother and child at their gate; warm "
        "windows coming on down the lane, rain-washed street shining, a sleeping dog, "
        "a chai stall's steam, marigolds on a balcony rail. In the far sky one small "
        "white star shaped faintly like a running horse. No writing, no signboards, no "
        "ribbons or scrolls anywhere in the scene."),

    "fk.abotani-rice": p(
        "an Arunachal Pradesh hillside at harvest, first light on the mountains: a "
        "bamboo house on stilts with a thatched roof, terraced rice fields dropping away "
        "in green and gold steps below it, and on the veranda a tall woven basket heaped "
        "with the first rice of the world — a pair of hands setting a small handful of "
        "that rice out onto a green leaf on the top step before anyone has eaten. A "
        "great dark mithun stands quietly in the yard below, bamboo tubes, woven cane "
        "baskets, red and white Tani weaving patterns, mist in the valley, dawn gold."),

    # ============================== SIX-TRANCHE OVERRIDES =====================
    # The six regional tranches are prompted automatically by build_prompt() from their
    # own text. These few are composed by hand instead, because their iconic moment must
    # not be left to the model:
    #   * Muslim religious subjects — the Prophet is never depicted in any form
    #     (docs/05): architecture, sea, lamp and community carry the scene instead.
    #   * stories whose climax is a death or a battle — painted as the moment before,
    #     or the emblem, per the gen-epic-art.py war rule.
    #   * indigenous communities where depiction risks caricature — the fk.andaman-fire
    #     pattern: paint the place and the animals.

    # Composed automatically this one paints the caller's cry as lettering in the sky —
    # the scene prose quotes it — so the call is described here without quoting it.
    "fk.kabootarbaz": p(
        "an Old Delhi rooftop at golden dusk: a grey-bearded kabootarbaz in a kurta "
        "standing at the parapet waving a long cloth in a great arc, his mouth open in "
        "a wordless call, while an enormous wheeling flock of pigeons turns as one "
        "above him across a marigold sky; a boy beside him watches with shining eyes, "
        "a wooden pigeon-loft full of roosting birds behind them, bowls of grain and "
        "water on the roof; below, the packed rooftops, domes and minarets of the old "
        "city, other tiny figures on distant roofs waving their own flocks. Warm amber "
        "and indigo, painted wings filling the sky."),

    "fk.cheraman-moon": p(
        "a Kerala coastal evening at Kodungallur, told through place and light: the old "
        "Cheraman mosque in pure Kerala style — sloping tiled roofs, white walls, carved "
        "dark wood, no domes — glowing warmly at dusk beside a temple spire and a small "
        "church further down the same palm-lined street, while neighbours of every faith "
        "walk up with small vessels of oil for the great brass lamp burning at its "
        "threshold; above the sea beyond, an enormous serene full moon lays a silver "
        "path on the water, and ships with lateen sails ride at anchor in the harbour. "
        "Warm lamp gold against deep blue, coconut palms, painted waves, peaceful."),

    "fk.cheraman-sails": p(
        "wide open ocean in brilliant morning light: two graceful wooden sailing ships "
        "with white lateen sails cresting a turquoise swell, sailors in Kerala dress "
        "leaning from the rigging and pointing ahead in joy — and there on the horizon, "
        "scattered like a handful of green beads, a string of tiny coral islands, each a "
        "ring of white sand and coconut palms around a pale turquoise lagoon; flying "
        "fish, gulls, dolphins in the bow wave. Banded blues and greens, painted spray, "
        "airy and full of discovery."),

    "fk.ubaidullah-lamp": p(
        "a night sea and a dawn island in one painting: on the left, deep indigo ocean "
        "under painted stars where a small wooden boat rides the swell carrying one "
        "glowing oil lamp at its prow, its light laid along the water; and ahead on the "
        "right, first light breaking over a low coral island — white sand, leaning "
        "coconut palms, a small white island mosque with a lamp in its doorway, and "
        "islanders coming down the beach to welcome the boat in. The traveller is a "
        "small distant figure at the tiller, seen from far away. Rose-gold dawn against "
        "deep night blue, painted waves, gentle and hopeful."),

    "it.birsa-munda": p(
        "the Chotanagpur plateau in first light, painted with love for the land: a Munda "
        "village of red-tiled mud houses among old sal trees, smoke rising, and on a "
        "green rise above it a boy in a plain white cloth sitting on a rock playing a "
        "bamboo flute while his sheep graze around him; the sal forest rolls away in "
        "ridge after ridge behind, a river catching the light in the valley. Red earth, "
        "deep sal greens, warm dawn gold, small birds, dignified and quiet."),

    "fk.lal-ded": p(
        "a Kashmir valley lane in autumn, chinar trees turned copper and gold: a "
        "dignified elderly woman in a simple woollen pheran walking the lane singing, "
        "one hand lifted with the verse, her face open and shining; villagers of every "
        "kind — a farmer, a boatman, a potter, women at doorways, children on a wall — "
        "have all stopped to listen, drawn in warmly from both sides; snow peaks beyond "
        "the rooftops, a samovar steaming on a step, fallen chinar leaves everywhere. "
        "Warm russet and gold, soft valley light, papier-mache floral borders."),

    "fk.kurukshetra-waters": p(
        "the sacred flat land of Kurukshetra at dusk, painted as place and peace: the "
        "great banyan of Jyotisar spreading over a small white shrine, and beyond it the "
        "wide stone-stepped water of Brahma Sarovar reflecting a marigold sky, hundreds "
        "of small oil lamps set floating on the still water and along the steps by "
        "families with children; mustard fields in bloom at the edges, cranes flying "
        "home in a line. One small stone chariot sculpture stands quiet under the "
        "banyan. Deep gold and indigo, lamp flames doubled in the water, hushed."),

    "it.amrita-devi": p(
        "a Rajasthan desert village at golden hour, the moment held still: a woman in a "
        "red and ochre Rajasthani ghagra and odhni standing with her arms wrapped "
        "gently around the trunk of a green khejri tree, her cheek against the bark, "
        "calm and resolute; the women and children of the village stand in a quiet ring "
        "around the other trees, each with a hand or both arms on a trunk of their own; "
        "blackbuck and chinkara graze unafraid beside the houses, and the desert rolls "
        "away golden behind. Deep ochre and green, long warm light, painted sand "
        "pattern, brave and tender."),

    "fk.obavva-onake": p(
        "the great granite fort of Chitradurga at midday — seven rings of wall climbing "
        "over enormous rounded boulders: at a narrow crack between two vast stones "
        "beside a small water channel, a Kannada village woman in a green sari stands "
        "guard completely still, pressed to the warm rock, both hands holding a long "
        "wooden pestle upright like a staff, her face steady and brave; her brass water "
        "pot waits by the pond, and high on the walls tiny watchmen and fluttering "
        "pennants. Hot gold light, deep rock shadow, painted granite pattern, "
        "courage as stillness."),

    "fk.kannagi-anklet": p(
        "the pillared court of Madurai in the held-breath moment of truth: a young woman "
        "in a plain travelling sari standing very straight and dignified before the "
        "throne, one arm raised high with a broken golden anklet in her hand — and "
        "bright red rubies scattered in an arc across the polished stone floor at her "
        "feet, catching the light; the king half-risen from his throne with a hand at "
        "his heart, the court frozen along the walls, a goldsmith shrinking behind a "
        "pillar. Carved stone pillars, hanging lamps, deep red and gold, her dignity "
        "filling the frame."),

    "fk.tejimola": p(
        "the wide Brahmaputra in soft morning mist: a single luminous pink lotus "
        "blooming in the middle of the great river, glowing as though lit from within, "
        "and a merchant's wooden trading boat drawn up beside it, the grey-bearded "
        "merchant leaning far out with his open hand stretched toward the flower — "
        "while a bright mynah bird flies up from the water toward his shoulder in a "
        "spray of silver drops; on the far bank a gourd vine and a wild plum tree grow "
        "impossibly green. Assamese river country, mist and gold, painted ripples, "
        "tender and full of becoming."),

    # Composed automatically this one drifted to a generic backwater scene; the Meitei
    # world is anchored by hand instead.
    "fk.sandrembi": p(
        "a Manipuri homestead at golden evening, the moment of reunion: a gentle young "
        "woman in a fine striped phanek and a light innaphi shawl stepping back into "
        "human form from a soft grey glow, a grey dove's feather still drifting to the "
        "ground beside her, while the king takes both her hands with his head bowed and "
        "her young son runs to her arms; a Meitei house with a steep thatched roof and "
        "a walled courtyard behind, lotus and fish in a small pond, the wide waters of "
        "Loktak lake with its round floating phumdi islands and snowy egrets beyond. "
        "Warm gold and deep green, painted lotus borders, tender and just."),

    "fk.tree-that-counts": p(
        "a Nicobar island painted as place and plenty: a curve of white beach where a "
        "carved outrigger canoe is drawn up on the sand, and behind it groves of "
        "coconut palms of every age — tall grandmother palms and small new ones freshly "
        "planted, one with a little woven fence of its own; a stilt hut with a thatched "
        "roof among the trees, pigs dozing in the shade, a pandanus tree heavy with "
        "fruit, and the turquoise sea folding gently on the reef beyond. Deep greens "
        "and blues, warm sand, painted palm pattern, generous and calm."),
}


# --------------------------------------------------------------------- utils --
# ---------------------------------------------------------------- kill switch --
# A fleet of workers re-runs this script on a loop, so "stop generating" cannot be done
# by killing processes — they come straight back. Touch tools/.artstop and every run
# exits immediately instead. Delete it to resume. (Shared with gen-epic-art.py.)
STOP_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".artstop")


def check_stop():
    if os.path.exists(STOP_FILE):
        print("tools/.artstop present — generation halted deliberately. "
              "Delete that file to resume.", flush=True)
        sys.exit(0)


def slug(story_id):
    return re.sub(r"[^a-z0-9]+", "-", story_id, flags=re.I).lower().strip("-")


def load_stories():
    """Every story in all nine data files, in order, as
       {id, title, hook, moral, texts:[scene text, ...]}.

       Reads the data through node rather than by regex: the prose is full of
       apostrophes, commas and quoted dialogue, and a regex over it would silently
       mis-split. node hands back exactly what the app sees."""
    script = r"""
      global.window = {};
      var fs = require('fs');
      %s.forEach(function (f) { eval(fs.readFileSync('app/' + f, 'utf8')); });
      var out = [];
      Object.keys(window).forEach(function (k) {
        if (!/^IND_STORIES/.test(k)) return;
        window[k].forEach(function (s) {
          out.push({ id: s.id, title: s.title, hook: s.hook || '', moral: s.moral || '',
                     texts: (s.scenes || []).map(function (sc) { return sc.text || ''; }) });
        });
      });
      process.stdout.write(JSON.stringify(out));
    """ % json.dumps(DATA_FILES)
    res = subprocess.run(["node", "-e", script], cwd=ROOT,
                         capture_output=True, text=True, check=True)
    return json.loads(res.stdout)


# The gentleness clause, appended to every composed prompt. Said every time rather than
# once in STYLE, because — as gen-epic-art.py learned — it is the rule most easily lost
# in a long prompt, and the tranches hold sieges, floods and vigils.
GENTLE = (
    " Paint one single warm moment from this story — where the story holds any danger "
    "or grief, paint the calm moment before it or the peace after it — with every "
    "figure calm, kind and dignified, gentle enough for a four-year-old. Any sacred "
    "figure is drawn reverently in a folk-art idiom, warm and beloved. Every Indian "
    "community and its dress is painted with warmth, accuracy and dignity, as its own "
    "people would paint it. The picture tells the whole story purely through image — "
    "every voice, song and name is expressed through gesture, light, painted birds and "
    "ornament alone, exactly like the two reference pages above.")


def build_prompt(story):
    """One prompt per story, composed from the story's own words.

       The hand-written PROMPTS entries stay as overrides — the 78 shipped paintings
       were made from them, plus the sensitive-subject overrides above. Everything
       else gets: the title (the icon in one phrase), the hook (written to tease the
       most vivid image), a digest of the scene prose (written for a child, already
       close to an ideal image prompt), and the moral (the feeling to land on). The
       digest keeps the opening and the ending — the resolution is usually the
       painting — and the model picks the iconic moment out of it."""
    sid = story["id"]
    if sid in PROMPTS:
        return PROMPTS[sid]
    digest = " ".join(t.strip() for t in story["texts"] if t.strip())
    if len(digest) > 1900:
        head = digest[:1300].rsplit(" ", 1)[0]
        tail = digest[-550:].split(" ", 1)[-1]
        digest = head + " … " + tail
    bits = ["the single most iconic moment of the children's story “%s”. "
            % story["title"].strip()]
    if story["hook"].strip():
        bits.append("The story in one breath: %s " % story["hook"].strip())
    if digest:
        bits.append("The story: %s " % digest)
    if story["moral"].strip():
        bits.append("The heart of it: %s" % story["moral"].strip())
    return STYLE + "".join(bits) + GENTLE


def to_jpeg(png_bytes, path, master_path=None):
    """Write the web copy, and the near-native master the digital book will use."""
    im = Image.open(io.BytesIO(png_bytes)).convert("RGB")

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
    """One call. Returns image bytes. Retries 3x with backoff on 429/5xx."""
    parts = list(ref_parts())
    parts.append({"text": (REF_NOTE if parts else "") + prompt})
    body = json.dumps({"contents": [{"parts": parts}]}).encode()
    last = None
    for attempt in range(3):
        req = urllib.request.Request(
            ENDPOINT % model, data=body,
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
    ap.add_argument("--slice", help="i/n — take every nth story starting at i, so several "
                                    "workers can share the list without overlapping")
    ap.add_argument("--limit", type=int, help="stop after this many generation calls")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--manifest-only", action="store_true")
    ap.add_argument("--print-prompt", help="print one story's prompt and exit, no API call")
    args = ap.parse_args()
    check_stop()

    os.makedirs(OUT_DIR, exist_ok=True)
    stories = load_stories()
    by_id = {s["id"]: s for s in stories}
    known = [s["id"] for s in stories]

    if args.print_prompt:
        print(build_prompt(by_id[args.print_prompt]))
        return

    calls = 0
    if not args.manifest_only:
        key = os.environ.get("GEMKEY")
        if not key:
            sys.exit("GEMKEY not set")

        wanted = known
        force = set()
        if args.only:
            force = {s.strip() for s in args.only.split(",") if s.strip()}
            wanted = [i for i in known if i in force]
        elif args.slice:
            i, n = (int(x) for x in args.slice.split("/"))
            wanted = [k for j, k in enumerate(known) if j % n == i]

        for sid in wanted:
            if args.limit is not None and calls >= args.limit:
                print("limit reached, stopping", flush=True)
                break
            path = os.path.join(OUT_DIR, slug(sid) + ".jpg")
            if sid not in force and os.path.exists(path) and os.path.getsize(path) > 4000:
                continue
            try:
                calls += 1
                raw = generate(build_prompt(by_id[sid]), key, args.model)
                to_jpeg(raw, path, os.path.join(MASTER_DIR, slug(sid) + ".jpg"))
                print("made  ", sid, "%.0f kB" % (os.path.getsize(path) / 1024),
                      flush=True)
            except Exception as err:
                print("FAIL  ", sid, err, flush=True)
            time.sleep(1)

    have = [slug(i) for i in known
            if os.path.exists(os.path.join(OUT_DIR, slug(i) + ".jpg"))]
    write_manifest(have)
    total = sum(os.path.getsize(os.path.join(OUT_DIR, s + ".jpg")) for s in have)
    print("\n%d/%d images, %.2f MB total, %d generation calls this run"
          % (len(have), len(known), total / 1e6, calls))


if __name__ == "__main__":
    main()
