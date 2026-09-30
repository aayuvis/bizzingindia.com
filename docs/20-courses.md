# 20 — Paathshala: the courses

Ten courses, 264 hours, 88 parts, 352 lessons and 88 projects, laid over the corpus this
app already holds. Built in [`app/data-paath.js`](../app/data-paath.js) (the courses) and
[`app/paath.js`](../app/paath.js) (the engine), checked by
[`tools/check-paath.js`](../tools/check-paath.js).

## 1. Why a course layer, when there is already a corpus

Because **a corpus is not a curriculum**. This app holds 375 stories, 2,820 Hindi passages,
91 songs, 46 sourced verses, 38 festivals, 34 historical anchors, 26 kinship terms, 12
values, four faiths, two epics and every state. A child can wander in it for a year and a
parent still cannot answer *"what has she learned?"*

A course answers that, and answers it the way Bizzing Finance's `docs/05` says to:
objectives, prerequisites, and **assessment kept separate from teaching**.

## 2. The economics, because this is where the project dies if it is got wrong

Ten courses at 21–42 hours is **264 hours of child time**. It is **not** 246 hours of
authoring, and the sibling repo already has the write-up of what happens when somebody
tries to make it so. The hours come from:

| | share | what it costs to author |
|---|---|---|
| Teaching | ~40% | the only part that costs real writing |
| Practice | ~35% | generated from the corpus already owned |
| Projects | ~25% | a paragraph of brief → an afternoon of child |

So a 24-hour course is roughly **eight to ten hours of genuinely new writing**. Projects are
the cheapest hours in the product and the only ones that leave a family an object.

## 3. The ten

| # | Course | Hrs | Ages | Parts | Premium | Corpus reuse |
|---|---|---|---|---|---|---|
| 1 | Hindi, from Zero | 30 | 5–12 | 10 | yes | 85% |
| 2 | Neeti — Moral Science | 24 | 6–12 | 8 | no | 70% |
| 3 | Rishtey | 21 | 4–10 | 7 | no | 60% |
| 4 | The Story of India | 30 | 8–12 | 10 | yes | 55% |
| 5 | My India (geography) | 21 | 6–12 | 7 | no | 80% |
| 6 | The Two Epics | 30 | 7–12 | 10 | yes | 85% |
| 7 | The Indian Year (festivals) | 21 | 4–10 | 7 | no | 75% |
| 8 | Songs and Sounds | 21 | 4–9 | 7 | no | 75% |
| 9 | Vigyan | 24 | 8–12 | 8 | yes | 50% |
| 10 | Arjuna's Questions (the Gita) | **42** | 9–12 | **14** | yes | 40% |

Hours are **modules × 3** by construction — four lessons and a project come to three hours —
and `check-paath.js` enforces it. A course that claims 30 hours and holds seven modules is
lying to a parent about what they bought.

## 4. The one rule that makes the rest worth anything

**A check taken on the same day as its teaching is practice. A week later is learning.**

The check that happens ninety seconds after a card measures *attention*: the child heard a
thing and can still repeat it, and so can anyone. So the engine keeps two records and never
lets the first masquerade as the second:

```
seen[]      a lesson was opened. That is all it means. It is NOT progress.
mastery{}   per OBJECTIVE, and only a check lesson may write it — and only if the
            module's teaching was opened on an EARLIER DAY.
```

`ledger()` is the only door into mastery, exactly as `sim.js` is the only door to money in
the sibling app. Views read it; nothing else writes it.

This will annoy a child who wants the tick today, and the screen says so kindly. It is the
single thing that makes the grown-up's report mean anything, so it stays. `dayrule` drives
both halves through the real app and was watched to fail: removing the `t > taught`
comparison produces *"A SAME-DAY CHECK WAS RECORDED AS LEARNED — the day rule is gone."*

**The report shows objectives, never minutes.** A report that counts minutes rewards
leaving the app open.

## 5. Editorial

`docs/05` is binding here exactly as everywhere else. Two rules do most of the work.

### Never a verse from memory

A course may only quote a shlok that already exists, sourced, in `data-shlok.js`. This is
the easiest place in the whole app to break that rule, because a course *wants* a verse at
a particular point and one is not always there. The answer is `needsVerse` and an honest
screen — never a plausible line.

**The Gita course is built on the five Gita verses this app actually has** — 2.47, 2.63,
6.5, 6.17 and 12.13 — and says so on its own front page. `verses` fails the build if it
cites any other. It is fourteen parts and 42 hours, and part 13 is *"What this course does
not teach you"*: it tells a nine-year-old outright that they have met five verses of seven
hundred, and why there is no eighteen-chapter map here. Full write-up and the sourcing
worklist in [21-gita.md](21-gita.md).

### Nothing sensitive ships unreviewed

Caste, Partition, communal conflict, colonial violence and contested chronology are for a
human author with a named reviewer. Those modules carry `needsReview`; the engine renders
them as *being checked by a person* rather than pretending. Currently flagged:

- **The Story of India** module 8 (colonial rule) and module 9 (freedom and Partition)
- **Vigyan** module 8 (contested claims about ancient technology)
- **Arjuna's Questions**, the whole course — *does not publish without a named reviewer
  from within the tradition*

`review` fails if any of these loses its flag.

### Faiths are never ranked

There is a Gita course because families ask for one more than for anything else. There is
**no implied hierarchy in which it is the Indian moral text**: Neeti carries ethics across
Jain, Buddhist, Tamil and Sikh sources together, and The Indian Year treats Eid, Christmas,
Losar, Navroz and Gurpurab as the Indian festivals they are. A child from any of those
households must find their own year in that course.

### Hindi is not India

Paathshala, not "Courses": पाठशाला / পাঠশালা / પાઠશાળા / ಪಾಠಶಾಲೆ / பாடசாலை all mean the same
thing in the same way, because the root is shared. `docs/05 §8` forbids implying Hindi =
Indian, and a word every one of those households already owns is the opposite of that. The
Hindi course goes first because its corpus is deepest, and its ladder is language-agnostic
by design — Bengali, Gujarati, Kannada, Marathi, Tamil, Telugu and Urdu are data files.

## 6. What the checks hold

Twenty-one, in two kinds. **Structure**, read straight off the data, catches rot that only
appears on the one page that holds it. **Behaviour**, driven through the real app, catches
rules that get "simplified" by someone who finds them annoying.

| check | holds |
|---|---|
| `shape` | hours = modules × 3; every course has a badge, an age band and sources |
| `one-check` | every part ends with exactly one check, and has teaching before it |
| `refs` | all 272 corpus references resolve — a dead one renders an empty screen |
| `verses` | no course cites a verse this app cannot attribute |
| `review` | nothing sensitive claims to be finished |
| `projects` | every part leaves something behind, with a real brief |
| `opens` | the tab opens and every course is on it |
| `dayrule` | **same-day is practice; a later day counts** |
| `report` | the grown-up gets objectives, never minutes |
| `keyboard` | every control is a real `<button>` |
| `touch` | nothing under 32px, no sideways scroll on a phone |
| `readable` | no card, header or part is see-through |
| `pack` | the take-home pack matches the course, and printing drops the chrome |
| `script` | every verse is set in its own script, never Sanskrit by default |
| `voice` | nothing on a family's screen is a note to ourselves — no shouting, no doc path |
| `covers` | every course's picture is on disk and has an alt line (docs/05) |
| `labels` | every reference of every lesson renders a title, never a database key |
| `tasks` | every workshop task is one the app can actually run |
| `script-rule` | the orthography rule refuses the beginner mistakes and passes a real name |
| `gate` | the project does not open before the test is passed |
| `honest` | **the app never claims to have marked what it cannot mark** |

Four were watched to fail first, each naming the exact fault: a broken hours claim
(*"neeti-course claims 30h but holds 8 modules"*), a dead reference
(*"points at st:pt.no-such-story"*), a dropped review flag (*"i8 (colonial) is not flagged
for review"*), and the day rule.

`readable` exists because of a screenshot. The first version said "premium" by putting
`opacity: .72` on the whole card — which dims the text with it and lets the page's artwork
through an otherwise opaque card, on exactly the five premium courses and no others. The
lock is said in words now. **Somebody deciding whether to buy a course has to be able to
read it.**

## 5a. A part is three stages, and the project is the last one

**Teach, then test, then make.** A part used to render as four chips in a row with a
project brief underneath, and the project's "I made it" button was tappable on a course
nobody had opened — a self-certification standing in for both the test and the project.

Now a part is three numbered stages, and the order is on the screen because the order *is*
the method:

| | | |
|---|---|---|
| **1 Learn it** | the teaching and practice lessons | open from the start |
| **2 Test yourself** | the check, on its own, on a later day | open from the start |
| **3 Make something** | the workshop and the paper half | **opens when the test passes** |

The third stage is not dimmed, it is **closed and says what opens it**: *"Making the thing
is how you keep what you learned — it is not a way round showing that you learned it."*
Dimming a paragraph is the `readable` rule broken; dimming a lock is how a child decides
the app is broken rather than that they have not got there yet.

`gate` holds it, and was watched to fail both ways: nothing shut on a fresh course, and
one passed test opening exactly one project rather than ten.

## 5b. Doing the project in the app — and how a submission is checked with no AI

[`app/karya.js`](../app/karya.js). **कार्य — the work.** A brief nobody can do on the screen
and nobody can check is a homework sheet with a tick box. So a project has two halves, and
they are different *kinds* of thing:

- **The workshop** — done here, with a real tool, and **marked by the app**.
- **The paper** — done away from the screen, kept, and **never marked by anything**.

The tool is not new: the Devanagari keypad is the one the Bhasha engine's `produce`
exercise uses — **this script's own consonants and matras, never a system IME**, because a
system keyboard hides the abugida structure the course is trying to teach — and the tracing
canvas is `likhna.js`, which has measured coverage and spill since stage 7.

### The question this answers

*How is a submission checked with no model behind it?* By stopping asking one question and
asking two.

**1. What a computer can actually check, it checks completely, and it counts.** A typed
word against a word the course holds. A traced letter against the glyph's own ink. Four
ages in the right order. None of this needs a model; it needs the answer, and a course that
cites its corpus already has the answer.

**2. What it cannot check, it does not pretend to.** Nobody marks a photograph of a child's
handwriting without a model, and nothing here is going to send a child's handwriting
anywhere — `CLAUDE.md`: no child photo, no free text off the device, ever. So the paper half
is **kept, not scored**. It goes on the shelf, the grown-up's page lists it, and the mastery
record never hears about it. `ledger()` in `paath.js` stays the only door, and `karya.js`
has no handle on it to touch.

**3. The interesting middle — an answer only the child knows.** *"Write your own name in
Devanagari"* is the most-wanted project in the whole course layer, and this app cannot know
whether आयुष is spelled right. It can know whether it is **well-formed Devanagari**: every
vowel sign hung on a consonant, every halant between two letters, no mark floating on
nothing. That is the abugida model stage 2 teaches, it is the mistake a beginner actually
makes, and a script rule decides it exactly.

**The screen says which of the two it did**, in those words:

> **Kept.** Every sign is hung on a letter and every halant has something on both sides.
> That part is right.
> *The app checked the WRITING, not the word — it cannot know how your name is spelled.
> Show it to somebody at home who does.*

A child told *"correct!"* about their own name, by a program that does not know their name,
has been lied to. `honest` fails if a submission the app could not decide is ever recorded
as `by: 'app'`, and if anything in the workshop writes to the mastery record.

### The four task kinds

| kind | what the child does | who decides |
|---|---|---|
| `write` | type a word the course holds | the app, completely |
| `writeOwn` | type something only they know | the app checks the **script**, and says so |
| `trace` | form the letter on the canvas | `likhna.js`, on coverage and spill |
| `order` | put four things in order | the app, completely |

**A project with no task is a perfectly good project.** A letter hunt round the kitchen is
not a screen, and the course page renders that as paper only rather than inventing one.

`tasks` fails on a trace naming a letter the script table does not hold, an order whose
answer is not its own items, or a write target the keypad cannot type. `script-rule` drives
the orthography rule with seven mistakes that must be refused and five real names that must
pass — it was watched to fail in both directions, which is the half people skip.

## 6a. The take-home pack

**A course that only exists on a screen is a course a family cannot do at the table.** Every
course has a printable pack at `#/paathp/<course>`: verse cards with their attribution
printed on them (a sheet of paper cannot be tapped for a source), a question to ask at the
table and something to do at home for each part, every project brief with ruled space, and
the reviewer notice where there is one. `@media print` drops the site bar, the nav, the page
artwork and every button that does nothing on paper.

It is generated from the course, so it cannot disagree with the screen, and it **counts its
own verse cards** — the Gita pack's description used to claim "five verse cards in
Devanagari" while seven rendered in three scripts, because part 9 cites a Thirukkural and a
Dhammapada verse deliberately. A number written by hand beside a number produced by code
disagrees eventually.

## 7. What is deliberately not done

- **Entitlements are a label, not a gate.** `premium` shows a lock and sends the grown-up
  to the Parents area. The real gate is server-authoritative and does not exist yet
  (`docs/07`); a client flag deciding entitlement would be the thing that rule forbids.
- **No content was invented to fill a course.** Where a course wants something the corpus
  does not hold, it says so. The `ready` percentage on each course is honest.
- **Nothing leaves the device.** Project notes are local. No child email, no photograph, no
  transmitted free text.

## 8. Where to pick up

1. **Name the reviewers.** Four modules and one whole course are blocked on this, and no
   amount of engine work moves them.
2. **Source more Gita verses**, with a translation licence, if that course is to be more
   than eight modules on five verses.
3. **Run the Hindi course end to end with a real child** before building the second one.
   It is the deepest corpus and the likeliest to convert; whatever it teaches about pacing
   applies to the other nine.
4. **The same ladder on a second language.** Bengali or Tamil, to prove the claim in §5
   that it is a data file and not a rewrite.
