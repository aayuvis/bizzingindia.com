# 20 — Paathshala: the courses

Ten courses, 246 hours, 82 parts, 328 lessons and 82 projects, laid over the corpus this
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

Ten courses at 21–30 hours is **246 hours of child time**. It is **not** 246 hours of
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
| 10 | Arjuna's Questions (the Gita) | 24 | 9–12 | 8 | yes | 25% |

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
cites any other.

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

Twelve, in two kinds. **Structure**, read straight off the data, catches rot that only
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

Four were watched to fail first, each naming the exact fault: a broken hours claim
(*"neeti-course claims 30h but holds 8 modules"*), a dead reference
(*"points at st:pt.no-such-story"*), a dropped review flag (*"i8 (colonial) is not flagged
for review"*), and the day rule.

`readable` exists because of a screenshot. The first version said "premium" by putting
`opacity: .72` on the whole card — which dims the text with it and lets the page's artwork
through an otherwise opaque card, on exactly the five premium courses and no others. The
lock is said in words now. **Somebody deciding whether to buy a course has to be able to
read it.**

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
