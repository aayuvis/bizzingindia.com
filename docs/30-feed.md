# 30 — My Feed

The owner (2 Oct 2026): *"we are all used to scrolling instagram and reddit… create a tab 'My Feed'
that presents a scrollable feed to the kids on content from across the app… all based on context of
where the child is and what their stage/level is… dynamically updated on kids' activities."* And
later the same day: *"at least 100 cards per level, plus at least 300 level-agnostic cards, and no
upper limit — do more if possible"*, with feeds *"structured by level and progress of the kid."*

A feed for children has to differ from the ones it borrows its shape from in three ways. It is built
only from what the app already says. It ranks by what the child is doing and learning, never by what
holds attention. And it ends.

## Where it lives

| piece | what it does |
|---|---|
| `tools/build-feed.js` | cuts the cards from the corpus (`tools/lib/corpus.js` loads it exactly as the page does) and writes `app/data-feed-index.js` (what the ranking needs, no words) plus one body group per level chunk and agnostic chunk, `app/data-feed-<L0-0 … any-5>.js`, their `<template>`s in index.html, and `tools/lib/feed-manifest.json` |
| `family/bizzing-feed.js` | **the one engine** — the family's, copied byte for byte from Bizzing_Schedule's `integration/` (FAMILY-STANDARD §6a) and handed to the classic scripts by `family/bridge.js` as `IND_FEED_ENGINE` |
| `app/feed.js` | the adapter: India's signals, due words, unlocks, skips and level fit, in the engine's words. It ranks nothing itself (`check-feed engine`) |
| `app.js` `V.feed` | today's session, India's own card look (`family.css .fd-*`), the one question a card may ask, the finished card |
| `#/feed` | the last tab, after Play (owner's decision), and a row in ☰ |

The adapter and the index load with the route (`lazy-feed`). A body group loads only when one of its
cards is on today's feed — a session of twenty needs a handful of the 31 groups — so nothing here is
on the first screen (`check-platform weight`) and #/feed never fetches the whole corpus
(`check-feed screen`). `bizzing-feed.css` is carried unedited for the day India moves to the family
card, and is not linked.

## Levels: the Gurukul rank

The level is the rank Home shows as **"Your level"** — Shishya, Vidyarthi, Sadhak, Khoji, Pandit,
Vidwan, Acharya, Rishi (`app.js` `RANKS`, 0–7). It is the one ladder a child sees, and it moves only
on things mastered (course objectives under the day rule, Bhasha rungs), so a feed structured by it
grows with learning and with nothing else. Course parts and rungs are each one thread among many;
the rank is the sum of them.

A card's level says where on that ladder it belongs. The builder reads `RANKS` and `RANK_AT` from
app.js, never retypes them:

- **behind a language rung r** — the lowest rank a child who has reached rung r must already hold
  (r rungs mastered → the rank `RANK_AT` gives r): Listening words on Shishya, letters and vowel signs
  on Vidyarthi, words, sentences and conversation on Sadhak, joined letters on Khoji. A card a child
  has unlocked is therefore never above their rank, and never hidden from them (`check-feed levels`).
- **a story, an epic night or an era a course part uses** — that part's place in its course, dealt
  across the eight ranks (part 1 of 10 → Shishya, part 10 → Rishi). The Gita course and every part
  held for review are not used.
- **any other story, night or era** — its place on its own path, dealt the same way: the library's
  order (the order the app's index lists the shelves), the epic's nights in order, the eras in time.
  The earlier of the two wins.
- **no level** — festivals, places and the map's features, games, verses, Nani's questions, the
  family words and the values. They are for anyone at any rank.

The engine builds a session in tiers, by arithmetic: at least 60% at the child's rank ("For Sadhak"),
at most a quarter review from ranks passed ("To keep: from Shishya", what slipped first), at most two
peeks at the next rank ("Coming up on Khoji"), and at most a quarter with no level. Nothing beyond the
next rank ever appears. A child who climbs gets a different feed (`check-feed climb`).

## The cards: 13,669 (doubled, owner 10 Oct 2026: "look for additional content and double the feed cards")

Every card carries `src`, the address of the words it quotes, and `tools/check-feed.js resolves`
finds them in that object on every run. Change a story, verse or fact and the check fails until
`node tools/build-feed.js` runs again.

| rank | cards |
|---|---|
| Shishya | 1,871 |
| Vidyarthi | 1,243 |
| Sadhak | 3,781 |
| Khoji | 672 |
| Pandit | 602 |
| Vidwan | 579 |
| Acharya | 586 |
| Rishi | 340 |
| no level | 3,995 |

Each object gives several honest **angles**, each its own `kind` with its own `src`:

| object | angles (kind: n) |
|---|---|
| a story (336 not held) | its opening (story 336) · its hook (hook 336) · the moment its middle turns on (moment 336) · **every other scene but its last**, which is the story's own ending and stays for the reading (scene 1,761) · the moral it states (moral 336) · a question on a Hindi word it teaches (storyword 486, one per word) · a question on the place it lights (storyplace 322) |
| the faces on the cards | an invented character's own line, and every epic figure's line (cast 53 — an epic figure only where it has a card of its own, which is where the door opens) · **every** achievement of a real person on the cards (person 153) · the fact each card carries (avfact 100). Never a deity (`sacred`) |
| an epic night (57) | its opening (night 57) · its hook (nighthook 57) · its middle (nightmoment 57) · **every other card but its last** (nightcard 515) · what it asks you to wonder about (wonder 57) |
| the whole Gita (700, 10 and up) | each verse in Sanskrit with Besant's 1922 English (gita 700) · Swarupananda's 1909 translation of it (gita2 671 — 29 were 80% Besant's words). Opened by the owner before the Sanskrit review (4 Oct 2026), as its pages are; each card opens on the verse's page, which says so above the verse. Never the computer-drafted reading, which is flagged. No "who says it?" question: Besant names the speaker inside the verse, and the answer would mostly be Krishna |
| an era (11 with sources, not held, under 11+) | its hook (era 11) · what a child is told (erakid 11) · what a bigger child is told (erabig 11) · what nobody knows yet (erawonder 11) · each thing found (found 34) · each dated moment (moment-era 63) · each "still there today" (today 33) · each figure (figure 37) |
| a language (9 packs, every rung) | words (word 826: in a pack of more than forty, only a word the corpus also has **in a sentence**, which the card carries — v4 found 2,840 bare glosses; 319 remain, from the small packs) · a question on **every** word the path holds, at its rung's rank (wordq 2,201 — never one whose answer names what its question names, "What does this Tamil word mean?" → "Tamil…"; the question, not the gloss, is how a word comes back) · each Hindi word's example sentence, as a card (example 506) and as a question on its meaning (exampleq 507) · letters (letter 406) · vowel signs (matra 89) · Hindi sentences (sentence 102) and conversation lines (talk 70) · joined letters (conjunct 42) |
| a verse (34 not flagged) | the verse in its own script (verse 34) · its meaning (versemeaning 34) · why carry it (versewhy 34) |
| a place (36) | its map fact (place 36) · every trivia line (trivia 144) · every place to see (see 178) · every food (food 171) · every feature on the map (feature 399) · a capital question (capital 31: never where the capital's name is inside the place's own, which answered itself — Chandigarh, New Delhi, Puducherry; `check-feed selfanswer`) · a food question, for a dish one state alone claims (foodq 36) |
| a festival (27 not held) | what it is (festival 27) · the fuller telling, 8 and up (festbig 27) · every thing to do at home (festdo 118) · every "in many families" line (festways 78) · the question to take to your family (festask 27) · its own words in their own script, and a question on each (festword 81 · festwordq 77) · where it is kept (festwhere 27) |
| a place's symbols | a question on each state symbol, only where the state's own `unsure` notes raise no doubt about its symbols (symbolq 104) |
| games | the Mela games' how-to (game 11) · each street game, how it starts and its other names (gully 28 · gullyhow 28 · gullyname 127) · each of its rules (gullyrule 185), its other ways (gullyway 56), how to keep it safe (gullysafe 59) and the words you shout (gullyword 117) |
| the family | questions to ask Nani and Dada (ask 52) · family words (family 26) · the values (value 12) and each one's "do it today" (valuedo 12) |

**A picture where the corpus has one.** 4,241 of the 13,669 cards (31%; v4 measured 5%) carry a
painting: a story's card its own painting at plate size (`art/story/sm`), an epic night's card its
cover (`art/epic/sm`, `tools/gen-plate-thumbs.py`). No picture is drawn for the feed.

**One thing, at most two cards a session.** The cards cut from one story, one epic night, one verse,
one era, one festival, one state or one street game are one object (`objectOf` in `app/feed.js`,
read from the card's id). The family engine is not edited: India's adapter asks it again with an
object's third card set aside, until no object has more than two — so the engine's own tiers and
kinds still hold (`check-feed object`; without it, one Ramayana night came four times).

**More to say, all of it read.** A card carries up to four **facts** — a label and a value, like
*From: Panchatantra* · *Lights up: West Bengal* · *Read: 6 min* — and 6,224 of the 6,308 do. The
label is the app's own word for the slot; the value is whatever the corpus holds at a path the
builder names (`tools/lib/feed-facts.js`: `stories/[id=pt.lion-rabbit]/minutes`, `IND_UTSAV/festivals/[id=lohri]/states|names`).
The builder writes the paths to `tools/lib/feed-proof.json` (not shipped) and `check-feed facts`
reads every one again and must get the same value — so a fact is never typed, and a fact whose
path finds nothing is not written. Short facts sit in a two-column list; long ones (a verse's
meaning, "In many families it is also …") as a line under it. On a question the facts and the
door stay hidden until it is answered, because a fact like "Capital: …" would be the answer.

**Every door opens on that very thing.** A card's route names the thing, not the tool:
`#/verses/<collection>|<verse>`, `#/chart/<pack>|<letter>`, `#/pack/<pack>|<stage>:<item>`,
`#/state/<code>|trivia:2`, `#/era/<id>|objects:1`, `#/festival/<id>|do:3`, `#/story/<id>|s4` (the
moment its middle turns on), `#/epic/<id>|<night>`, `#/nani/<question>`, `#/rishtey/<term>`. The part
after `|` is the **focus**: the screen opens with a card for exactly that thing at the top ("From
your feed"), above the list it belongs to, and the rest of the screen as before. No feed card opens a
front door (`#/nani`, `#/verses/gita`) when it is about one thing inside it (`check-feed specific`),
and `check-feed lands` opens all 5,339 distinct routes in a browser and finds the card's own words
in the focus card, which must be first. On a phone the thing is shown whole (`check-feed whole`): the
story reader used to keep 120px of picture and shrink the words, so 158 landings, most of them a
story's turning moment with its question under it, opened on a clipped line. Now the picture takes
only the room the words leave, and a scene that asks may be taller than the screen.

**Near-duplicates.** Two cards whose words — title, script, romanisation, body and question — are
≥ 80% the same are one card: the builder drops the later as it cuts (18 went: Marathi vowel signs
that are Hindi's, a sentence that is also a conversation line, a street game's two names for one
thing) and `check-feed near` holds the whole set to it (`tools/lib/feed-near.js` is the one
definition).

**A question never shows its answer** — not in its words, its title, its script, its romanisation or
the reason it gives. A question whose answer is a place carries no place topic, so the ranking's
reason ("You lit Kerala on the map") can never say it either (`check-feed noleak`). Story-word
questions whose meaning is in the story's own title are not cut.

**Badges.** A card wears its object's badge, so a Katha never reads as Itihaas. A "still there today"
line is 🧭 Aaj (it is a place, not a claim about the era's evidence) and a story's word question is
🧭 Aaj (it is a language card). **Verses are 🧭 Aaj.** A verse object carries no badge and India's
verse screens show none; they frame a verse as something families still carry ("Verses worth
carrying"). A quotation with its source is not "a story as it is told", so 🪔 Katha, which the first
feed showed, was wrong. The owner left this open; it is one constant (`VERSE_BADGE` in build-feed.js)
and `check-feed resolves` holds every verse card to it.

Held back on purpose:
- anything `needs_review`, including the colonial, freedom and recent eras, and the Neeti deck;
- anything gated 11+;
- flagged verses;
- the Dharma pillar and the songs (both awaiting reviewers), and the Gita course;
- the 2,820 Hindi reading passages (story scenes told in Hindi): every one is a draft until a named
  Hindi pedagogue signs its story (data-bhasha-hi-passages.js) — the largest pool left, held until then;
- Sabhyata's data (the whole file is `needs_review`), and a story's or night's last scene (its ending);
- a state's `myth` field, which names deities and stays on the state page, where it is framed, and
  its `people` field, which is unsourced there;
- deities as cast cards (avatar-cards `sacred`), and real people from a 🪔 Katha story.

What the corpus could not honestly supply: a word from a verse (verses carry no glossary), a craft
for a place (the states hold none), a "one thing to do" for an era, phrase cards for the eight
languages other than Hindi (their sentence and conversation rungs hold grammar-point ids, not
lines), and Likhna cards (the writing rung repeats the letters). The feed stops there rather than
paraphrasing.

## The ranking (on the device; nothing is sent)

`feedFor()` in the family engine: score = context + level fit + due + novelty, less a penalty for
anything seen this week, then the tiers above, then a session drawn so that a kind already shown
costs the next one of its kind a little:
- never three of one kind in a row;
- at most five questions;
- one reason never leads more than six cards;
- at most twenty cards.

What India passes it (`app/feed.js`):
- **level** and **levelName**: the rank and its own name;
- **signals:** the last stories read (the story, its place, its collection), the last games and
  lessons, the languages started, the family's language, the places lit and the world chosen;
- **extra** (level fit): a card that opens at the rung the child has just reached;
- **due:** a word or letter with a miss on record whose gap is over, keyed `<lang>|<srs key>`. Same
  rule as Words that slipped, read straight from the language record. It comes back first;
- **unlocked:** a card behind a rung opens when the rung is reached (or its word slipped);
- **skip:** a story already read is not news: its opening and hook never come back. Its moment,
  moral and questions can, as review.

A card the child's band does not open never appears. Nor does one their progress has not reached.

Every card says why it is there:
- "Because you read *The Monkey Who Kept His Heart in a Tree*, set in West Bengal";
- "A word that slipped on Tuesday — its gap is over";
- "New: you reached Rung 3 in Tamil";
- "For Sadhak" · "To keep: from Shishya" · "Coming up on Khoji".

The session is kept for the day (`S.feed`). It is drawn again when the child has done something
new, or climbed a rank.

## The guardrails

- It ends with a finished card. There is no infinite scroll, no autoplay, no auto-advance and no
  sound before a tap.
- There are no likes, counts, comments or streaks. Scrolling earns nothing and is not learning.
- Only a right answer to a card's question **on the first try** pays, once per card, through
  `earn('answer')`. Every question has three options, so a second try is a coin toss — and coins are
  for learning, never for luck.
- **Two tries, then the answer and why** (owner, 4 Oct 2026; v4 E5). A first miss sets that option
  aside and asks again, saying nothing about which is right. A second miss names the answer and the
  card's own "why", and holds until Continue. The answer is never in the page before it is given.
- A grown-up can switch My Feed off behind the PIN. The tab and the ☰ row go with it.
- `?demo` shows a sample feed from the sandbox and writes nothing.

## Held by `tools/check-feed.js`

Each check was watched to fail by breaking what it holds.

| check | holds | broken by |
|---|---|---|
| count | ≥ 100 cards at every rank, ≥ 300 with no level, unique ids, every card has words | 150 Rishi cards made level-free |
| levels | levels are ranks; a card behind rung r is never above the rank r implies | a rung-3 word moved to Khoji |
| resolves | every `src` resolves and every quotation, meaning and answer is found in it | (inherited) |
| held | nothing held, gated 11+, sacred as a cast card, or Katha as Itihaas | (inherited) |
| near | no two cards ≥ 80% the same words | a trivia line copied onto its neighbour |
| distinct | no two cards share src + kind + text | (inherited) |
| engine | app/feed.js ranks nothing itself; bridge.js hands over the family engine | a sort added to the adapter |
| bands | the youngest band never sees older cards | (inherited) |
| ceiling | on rank n: nothing above n+1, ≤ 2 peeks, ≥ 60% at n, ≤ 25% review, ≤ 25% level-free | the adapter dropping the level |
| climb | a rank up changes every "now" card; the old ones return only as review | the adapter pinning one level |
| context | reading a story moves its cards up, and it does not come back as news | (inherited) |
| noleak | a question's reason never says its answer, for every child built | a capital question given its place topic |
| due | a slipped word comes back first after its gap, not before | due keyed without the language |
| mix | never three of a kind in a row, at most five questions | (inherited) |
| ends | at most twenty cards; this week's cards sink | (inherited) |
| screen | page head, finished card, no counts or sound, fits 390px, loads only the groups it needs | #/feed loading every group |
| play | keyboard and touch; a first miss asks again and tells nothing, a second names the answer and holds; right first time pays once, a second try never; no fact or door before the answer | the door shown on an unanswered question; a first miss holding; a second try paying |
| keys | j / k and the arrows step card to card | (inherited) |
| facts | every fact is the corpus value at the path the builder named; ≥ 1 fact a card on average | a fact's value typed into the card |
| specific | no card's door is a tool's front door; a thing inside a list names itself in its route | the verse cards routed to `#/verses/<coll>` |
| lands | all 5,339 routes open their thing, with a focus card for it first and its words in it | the focused verse put under the collection's head |
| whole | on a 390×844 phone, none of the 2,469 focused landings clips its thing inside its own box | the story reader's old sizing, where the picture kept 120px and the words gave way (158 clipped) |
| pin | the grown-up's switch takes the feed away | (inherited) |
| demo | the sample feed writes nothing | (inherited) |

`check-family dropins` holds `family/bizzing-feed.js` and `.css` (and every other family file) byte
for byte to `tools/lib/family-dropins.json` and, where it is checked out beside this repo, to
Bizzing_Schedule's `integration/` — broken by appending one comment line. `check-contrast` measures
`#/feed` in every world, day and night; `check-standard shell` holds `checkShell` to `[]`.
