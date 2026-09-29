# 21 — The Gita module

*Arjuna's Questions* — 42 hours, fourteen parts, ages 9–12. The flagship course and the most
constrained thing in the repo. This file exists so that the constraint is a worklist rather
than a vague unease.

## 1. What it is

A soldier puts his bow down between two armies and says he cannot do it. What his friend
says back is the longest argument in Indian literature about doing the right thing when the
right thing is unbearable.

**Fourteen parts, and not one of them quotes a verse this app cannot attribute.**

| | |
|---|---|
| Parts | 14 (42 hours) |
| Sourced Gita verses used | **5 of 700** — 2.47, 2.63, 6.5, 6.17, 12.13 |
| Other verses cited | Thirukkural 1, Dhammapada 1 (deliberately — see §4) |
| Take-home | 7 verse cards, 14 table questions, 14 at-home activities, 14 project briefs |
| Publishable today | **No.** See §5. |

## 2. What it is built from, and nothing else

Three sourced places:

1. **`data-shlok.js`** — the five Gita verses, each with chapter, verse, and the collection
   note placing the Gita inside the Bhishma Parva of the Mahabharata.
2. **`data-epic-mahabharata.js` episode 26, "A Talk Between Friends"** — the conversation
   retold in the storyteller's own words, in Hindi and English. This file already carries
   the right instinct and says it out loud to the child: *"the verses themselves are in
   Sanskrit and you will find them on the verse shelf, read out one at a time by a person.
   Nobody should ever hand you a made-up version of those."*
3. **The parva list and cast of the same file** — for where the Gita sits and who is
   standing on the other side.

Everything in the course traces to one of those. Nothing was written from memory.

## 3. The structure

| # | Part | Built on |
|---|---|---|
| 1 | The war this interrupts | episodes 25–27 |
| 2 | A man who does not want to fight | episode 26 |
| 3 | The family on both sides | episode 26 + the kinship terms |
| 4 | Where the seven hundred verses are | the collection note |
| 5 | Do the work, not the prize | **2.47** |
| 6 | Anger | **2.63** |
| 7 | Your own friend or your own enemy | **6.5** |
| 8 | Not too much of anything | **6.17** |
| 9 | What a good person is like | **12.13** + Thirukkural + Dhammapada |
| 10 | The sound of it | all five, with the recordings |
| 11 | Two readings, both old | episode 26 |
| 12 | Gandhi read it as non-violence | Gandhi + ahimsa |
| 13 | **What this course does not teach you** | the collection note |
| 14 | Back to your own battlefield | episode 26 |

**Part 13 is the one to keep.** It tells a nine-year-old, outright, that they have met five
verses out of seven hundred, and why there is no eighteen-chapter map in this app: chapter
names are not in the corpus except chapter 2's, so a map would be seventeen names written
from memory. Its project is *"write down every question this course did not answer, and take
the list to somebody who has read all of it."*

A course that is honest about its own gaps teaches something a complete course cannot.

## 4. Why Thirukkural and Dhammapada are in a Gita course

Part 9 takes the qualities in 12.13 and asks where else the same list turns up. It turns up
in Tamil and in Pali. **That is the lesson**, and it is also the guard against the failure
this course could most easily cause: a child concluding that the Gita is *the* Indian moral
text. It is not, and this app serves Jain, Muslim, Sikh, Tamil, Buddhist and Christian
households. Neeti carries ethics across traditions for the same reason.

The consequence is that **the take-home pack prints three scripts**, and the first version
got that wrong — it set `lang="sa"` on every card, which renders Thirukkural in a Devanagari
face. `docs/05`: a script is set correctly or it is not set at all. The pack now derives the
language from the verse's collection; `script` in `tools/check-paath.js` holds it, and was
watched to fail with *"kural-1 is Tamil but tagged lang='sa'; dhp-1 is Pali but tagged
lang='sa'."*

## 5. What blocks publication

**Two things, both needing a person, neither needing more engineering.**

### 5.1 A named reviewer from within the tradition

`docs/05 §6` — doctrinal content is for a human author with a named reviewer. The course
carries `needsReview` and the engine renders the notice on both the screen and the printed
pack. It does not publish until a name is on it.

The reviewer is being asked to check three things specifically:

1. That the framing — *Arjuna's questions*, not doctrine — is respectful rather than
   reductive to somebody who holds the text sacred.
2. That the five child-level meanings in `data-shlok.js` are defensible readings.
3. That part 12 (Gandhi) represents the disagreement fairly in both directions.

### 5.2 More verses, properly sourced

Five of seven hundred is honest but thin. **Nobody should type these from memory, including
anybody who is sure they know them.** The worklist:

| step | what | who |
|---|---|---|
| 1 | Choose a Sanskrit edition with a known provenance and a citable text | reviewer |
| 2 | Confirm the translation licence — the Sanskrit is public domain; a *translation* may not be | you |
| 3 | Decide which verses a 9–12 course needs beyond the five | reviewer |
| 4 | Transcribe Devanagari **from the edition**, not from memory, with the shirorekha intact | reviewer |
| 5 | Child-level meaning written to the voice already in `data-shlok.js` | author + reviewer |
| 6 | Record the audio in the app's Indian narrator voice | pipeline |
| 7 | Add with `source:` naming chapter, verse and edition | author |

A reasonable target is **15–20 verses**, which would carry a course of this length
comfortably. Until then the course runs on five and says so.

## 6. The take-home pack

The half of the course that leaves the screen, at `#/paathp/gita-course`, printable or
saveable as a PDF:

- **Verse cards**, each with the original script, transliteration, child-level meaning and
  full attribution — *"Bhagavad Gita 2.47 — chapter 2, 'Sankhya Yoga', verse 47; within the
  Bhishma Parva of the Mahabharata"*. **A sheet of paper cannot be tapped for a source**, so
  the source is printed on it.
- **A question to ask at the table** for each of the fourteen parts.
- **Something to do at home** for each.
- **Every project brief** with ruled space to write on.
- **The reviewer notice**, printed, so a parent who prints this knows what state it is in.

It is generated from the course itself, so it cannot disagree with what is on the screen,
and it **counts its own verse cards** — the description used to say "five verse cards in
Devanagari" while seven rendered in three scripts.

`@media print` drops the site bar, the nav, the page artwork and every button that does
nothing on paper, and keeps parts whole across page breaks.

## 7. Where to pick up

1. **Name the reviewer.** Everything else here is done and nothing else moves without it.
2. **Source verses 6 through 20** by the worklist in §5.2.
3. **Record the five** in the app's narrator voice if they are not already — `audio` fields
   exist (`shlok/gita-2-47` and so on) and part 10 is built on them.
4. **Then consider the other four faiths.** If a Gita course exists, a family from a Jain,
   Sikh or Buddhist household will reasonably ask where theirs is. Neeti is the honest
   partial answer today; it is not a permanent one.
