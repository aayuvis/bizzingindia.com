# 30 — My Feed

The owner (2 Oct 2026): *"we are all used to scrolling instagram and reddit… create a tab 'My Feed'
that presents a scrollable feed to the kids on content from across the app… all based on context of
where the child is and what their stage/level is… 1,000 feed items… dynamically updated on kids'
activities."*

A feed for children has to differ from the ones it borrows its shape from in three ways. It is built
only from what the app already says. It ranks by what the child is doing and learning, never by what
holds attention. And it ends.

## Where it lives

| piece | what it does |
|---|---|
| `tools/build-feed.js` | cuts the cards from the corpus (`tools/lib/corpus.js` loads it exactly as the page does) and writes `app/data-feed-index.js` plus four body groups `app/data-feed-{a,b,c,d}.js`, with `tools/lib/feed-manifest.json` |
| `app/feed.js` | the engine: `feedFor(child, ctx)`, pure, the same file in node and the page |
| `app.js` `V.feed` | today's session, the cards, the one question a card may ask, the finished card |
| `#/feed` | the last tab, after Play (owner's decision), and a row in ☰ |

The engine and the index load with the route (`lazy-feed`). A body group loads only when one of its
cards is on today's feed, so nothing here is on the first screen (`check-platform weight`).

## The 1,000

Every card carries `src`, the address of the object it was cut from, and `tools/check-feed.js
resolves` finds its words in that object on every run. Change a story, verse or fact and the check
fails until `node tools/build-feed.js` runs again.

| kind | n | cut from |
|---|---|---|
| story | 393 | the opening of each of the 336 stories not held for review, plus the first card of each of the 57 epic nights |
| fact | 109 | the dated moments, "still there today" lines and figures of the 11 eras that carry `sources[]`, are not held for review and are not gated 11+ |
| verse | 34 | every verse in `data-shlok.js` that is not flagged `unsure` or `needs_original`, with its source |
| tip | 144 | the first words of each language's Listening and Word rungs, and its first letters, across all nine packs |
| play | 117 | one question each: whose capital (36), what a word means (54), where a festival is kept (27) |
| place | 108 | each of the 36 places: its map fact, its first trivia line, its first place to see |
| festival | 54 | each festival not held for review: what it is, and one thing to do at home |
| game | 41 | the 13 Mela games with their own how-to line, and the 28 street games |

The corpus holds more than 1,000 honest cards (1,228 before trimming). The surplus is let go in a
declared order: a state's second trivia line, the stories' second moments, a language's tenth and
eleventh words, then era figures.

Held back on purpose:
- anything `needs_review`, including the colonial, freedom and recent eras;
- anything gated 11+;
- flagged verses;
- the Gita course (its five verses come from `data-shlok.js` itself);
- a state's `myth` field, which names deities and stays on the state page, where it is framed.

A card wears its object's badge, so a Katha never reads as Itihaas.

## The ranking (on the device; nothing is sent)

Score = context + level fit + due + novelty, less a penalty for anything seen this week. Then a
session is drawn so that a kind already shown costs the next one of its kind a little:
- never three of one kind in a row;
- at most five questions;
- at most twenty cards.

What counts as each part of the score:
- **context:** the last stories read (the story, its place, its collection), the last games and
  lessons, the languages started, the family's language, the places lit and the world chosen;
- **level fit:** a card that opens at the rung the child has just reached;
- **due:** a word or letter with a miss on record whose gap is over. Same rule as Words that
  slipped, read straight from the language record.

A card the child's band does not open never appears. Nor does one their progress has not reached.

Every card says why it is there:
- "Because you read *The Monkey Who Kept His Heart in a Tree*, set in Kerala";
- "A word that slipped on Tuesday — its gap is over";
- "New: you reached Rung 3 in Tamil".

The session is kept for the day (`S.feed`). It is drawn again when the child has done something
new.

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

| check | holds |
|---|---|
| count | 1,000 cards, unique ids |
| resolves | every `src` resolves and every quotation is found in it |
| held | nothing held for review or gated 11+ |
| distinct | no two cards share src + kind + text |
| bands | the youngest band never sees older cards |
| context | reading a story moves its cards up |
| due | a slipped word comes back after its gap, not before |
| mix | never three of a kind in a row, at most five questions |
| ends | at most twenty cards; this week's cards sink |
| screen | the page head, the finished card, no counts or sound, fits 390px |
| play | keyboard and touch; wrong holds, right pays once |
| keys | j / k and the arrows step card to card |
| routes | all 610 routes open a real screen |
| pin | the grown-up's switch takes the feed away |
| demo | the sample feed writes nothing |

`check-contrast` measures `#/feed` in every world, day and night.
