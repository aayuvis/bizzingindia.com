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

## The cards: 7,836

Every card carries `src`, the address of the words it quotes, and `tools/check-feed.js resolves`
finds them in that object on every run. Change a story, verse or fact and the check fails until
`node tools/build-feed.js` runs again.

| rank | cards |
|---|---|
| Shishya | 1,467 |
| Vidyarthi | 868 |
| Sadhak | 2,311 |
| Khoji | 386 |
| Pandit | 315 |
| Vidwan | 301 |
| Acharya | 336 |
| Rishi | 214 |
| no level | 1,638 |

Each object gives several honest **angles**, each its own `kind` with its own `src`:

| object | angles (kind: n) |
|---|---|
| a story (336 not held) | its opening (story 336) · its hook (hook 336) · the moment its middle turns on (moment 336) · the moral it states (moral 336) · a question on a Hindi word it teaches (storyword 486, one per word) · a question on the place it lights (storyplace 322) |
| its cast | an invented character's own line (cast, with the epic cast: 23) · a real person's first achievement, only from a story that is not 🪔 Katha (person 35). Never a deity |
| an epic night (57) | its opening (night 57) · its hook (nighthook 57) · its middle (nightmoment 57) · what it asks you to wonder about (wonder 57) |
| an era (11 with sources, not held, under 11+) | its hook (era 11) · what a child is told (erakid 11) · what a bigger child is told (erabig 11) · what nobody knows yet (erawonder 11) · each thing found (found 34) · each dated moment (moment-era 63) · each "still there today" (today 33) · each figure (figure 37) |
| a language (9 packs, every rung) | words (word 2,349) · a question on each first-rung word (wordq 491) · letters (letter 406) · vowel signs (matra 89) · Hindi sentences (sentence 102) and conversation lines (talk 70) · joined letters (conjunct 42) |
| a verse (34 not flagged) | the verse in its own script (verse 34) · its meaning (versemeaning 34) · why carry it (versewhy 34) |
| a place (36) | its map fact (place 36) · every trivia line (trivia 144) · every place to see (see 178) · every food (food 171) · every feature on the map (feature 399) · a capital question (capital 36) · a food question, for a dish one state alone claims (foodq 36) |
| a festival (27 not held) | what it is (festival 27) · every thing to do at home (festdo 118) · every "in many families" line (festways 78) · where it is kept (festwhere 27) |
| games | the Mela games' how-to (game 13) · each street game, how it starts and its other names (gully 28 · gullyhow 28 · gullyname 127) |
| the family | questions to ask Nani and Dada (ask 52) · family words (family 26) · the values (value 12) |

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
- Only a right answer to a card's question pays, once per card, through `earn('answer')`.
- A wrong answer holds until Continue, and the answer is never in the page before it is given.
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
| play | keyboard and touch; wrong holds, right pays once | (inherited) |
| keys | j / k and the arrows step card to card | (inherited) |
| routes | all 2,889 routes open a real screen | (inherited) |
| pin | the grown-up's switch takes the feed away | (inherited) |
| demo | the sample feed writes nothing | (inherited) |

`check-family dropins` holds `family/bizzing-feed.js` and `.css` (and every other family file) byte
for byte to `tools/lib/family-dropins.json` and, where it is checked out beside this repo, to
Bizzing_Schedule's `integration/` — broken by appending one comment line. `check-contrast` measures
`#/feed` in every world, day and night; `check-standard shell` holds `checkShell` to `[]`.
