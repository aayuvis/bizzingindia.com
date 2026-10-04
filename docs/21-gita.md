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
| The whole text | **All 700**, chanted, with a guru — a separate module, §8. Also held for a reviewer. |

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

**Steps 1, 2 and 4 are now done for all 700** (§8): an edition with known provenance, both
translations public domain, the Devanagari taken from the edition by a build, never typed.
What a course *chooses* from them, and the child-level meaning, is still steps 3 and 5.

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

## 7. Where to pick up (the course)

1. **Name the reviewer.** Everything else here is done and nothing else moves without it.
2. **Source verses 6 through 20** by the worklist in §5.2.
3. **Record the five** in the app's narrator voice if they are not already — `audio` fields
   exist (`shlok/gita-2-47` and so on) and part 10 is built on them.
4. **Then consider the other four faiths.** If a Gita course exists, a family from a Jain,
   Sikh or Buddhist household will reasonably ask where theirs is. Neeti is the honest
   partial answer today; it is not a permanent one.

## 8. The whole Gita: 700 verses, chanted, with a guru

Owner, 3 Oct 2026: *"an advanced gita learning module with all 700 shlokas and their
ucchāraṇ … in Sanskrit, anglicised, then the meaning in English … set to a musical
background … a guided journey of a guru … and the ability to record oneself."* Then: chant-like,
with situational music, "this helps in memory"; visuals, reused. It is `app/gita.js`, three
routes — `#/gita` (the journey), `#/gitach/<n>` (a chapter), `#/gitav/<c.v>` (a verse) — and
`tools/check-gita.js` holds every promise below.

### 8.1 The text, and where every word comes from

`node tools/build-gita.js` writes `app/data-gita.js` and one `data-gita-NN.js` per chapter
(each its own lazy group: a verse loads the one chapter it shows) from `tools/gita-src/`:

| | source | licence |
|---|---|---|
| Sanskrit | gita/gita `data/verse.json` — the IIT Kanpur Gita Supersite vulgate; 701→700 renumbered, 26 encoding errors repaired | Unlicense |
| checked against | GRETIL (vulgate), the DCS (BORI critical edition), vedicscriptures, Besant's own Devanagari (ch. 1) | evidence only, not copied |
| corrected | **31 readings** where witnesses that agree outvote the base, taken from a Devanagari witness — 30 by group, 1 word by word (18.71 श्रृ→शृ) | `resolutions.json` |
| held | **2** where editions genuinely differ (8.7, 18.68): the vulgate reading is kept and the verse says so | |
| IAST + easy spelling | converted from the Devanagari by `tools/lib/sanskrit.js`, so they cannot disagree with it; agrees with an independent library on all 700 (candrabindu spelt m̐) | |
| English | Annie Besant, 4th ed. 1922; Swami Swarupananda 1909 as "another translation", with his verse ranges | public domain |
| chapter titles | Swarupananda's Contents, word for word | public domain |
| what the guru tells you about where the Gita sits | three lines of Swarupananda's Foreword, quoted and attributed | public domain |

gita/gita's chapter **summaries and English titles are not used**: they carry no source and
argue one school's reading, which is not this app's to pick. The guru's own words are
instructions only — *listen, now you, tap a line* — never a gloss. What a verse means is
Besant's or Swarupananda's, attributed. Who is speaking is read off the text's own *uvāca* lines.

### 8.2 The voice — a computer's, labelled, until a person's

The owner chose (3 Oct 2026) to chant all 700 with Google's voice **and say so on every
verse**, until a human reciter records them. This is the one exception to `data-shlok.js`'s
human-voice rule, and it is an exception only because it is labelled.

`tools/gita-chant.py` (models and key from the environment, never in the repo):
- the speaker line is chanted where the text has it (before the verse; mid-verse in 1.21, 1.28);
- **three takes** per verse, each transcribed **blind** by a second model that is not told the
  verse, scored by edit distance against the IAST of the same Devanagari; the best is kept,
  and up to three more are made if even the best is > 12% off. (A listener told the text hears
  the text — measured once: distance 0 on a take that said *f* for *ph*.)
- the prompt that won was measured on 2.47, 11.32, 1.21 and 12.13; the newest voice model got
  *ph*, *ṇ* and *ṣ* right where the older ones said *f*, *n*, *s*;
- **the distance is fair to the anusvāra**: a listener who writes m, n, ṅ or ñ for ṃ heard it as
  it is said (sāṃkhya is said sāṅkhya), and a visarga before a sibilant said as that sibilant is
  right too. Everything else counts — n for ṇ, a short vowel for a long one, an added visarga.
  The screen quotes the fair figure, recomputed by the build from the listener's own transcript;
- `--improve N` makes three more takes of any kept verse heard N+ letters off and keeps one only
  if it is heard more exactly;
- **where it ended (3 Oct 2026): 674 of 700 heard exactly, 23 one letter off, 3 two letters off,
  none worse** — after best-of-three (634 exact) and one `--improve 1` pass (47 bettered, 19 kept
  because three more takes were no better). 6.6 hours of chant. Measured strictly, letter for
  letter with ṃ never matching m, the first pass was 76% exact: most "errors" were the listener
  spelling the anusvāra the way it is said;
- 24 kbps mono MP3, ~100 KB a verse, ~70 MB for 700 (`app/voice/gita/`);
- each record keeps a hash of the text it chanted: **change a verse and its chant is stale**,
  and `check-gita voice` fails until it is re-chanted (`--only 18.71 --redo`).

`tools/gita-lines.py` measures where each chanted line starts and ends from the breaths in the
audio — that is what lights the line being chanted and what "repeat after me" plays one at a time.

**The guru speaks in the same voice.** His seventeen lines live in `tools/gita-src/guru.json` —
shown on screen and spoken word for word by `tools/gita-guru.py`, best of three, each checked by a
blind listener (all 17 word-perfect). He says who is speaking before a verse is chanted the first
time, and each step's instruction when a child opens it; "Guru speaks" turns that off, and every
line has its own speaker button. A note on the voice model: **any style instruction in front of
the words was read aloud** ("Speak this as a warm teacher…", even "Say warmly:") on 6 of 17
lines, and it refuses a system instruction, so the guru's lines are sent as the bare words.
`check-gita guru` fails if a line changes and is not spoken again, and if any line glosses a verse.

**A human recording replaces a verse by being put at** `app/voice/gita/human/<c>-<v>.mp3`
and rerunning `gita-lines.py` + `build-gita.js`. The screen then says "Recited by a person."

### 8.3 A verse, in six steps

Listen (the chant over the chapter's raga, lines lighting, the painting's camera drifting) ·
Read (Devanagari, IAST, easy spelling; tap a line to hear it) · Meaning (Besant; Swarupananda
under "another translation") · Repeat (the guru chants a line, waits the length of it and a
breath for the child, next) · Record (on the device only, never scored; mine, the guru's, or
both one after the other) · Remember (all → first sounds → nothing; "I said it" is the child's
own word, pays nothing, and is "by heart" only when said on two different days).

Keys: space plays, ← → walk verses (across chapters), 1–6 choose a step. Every step is a tap too.

**A child's reading, on Meaning** (owner, 4 Oct 2026: "draft, flagged needs_review").
Under Besant (whom the guru's line introduces), one short plain reading for a child of 8–12 — drafted by a computer from the two
translations on that same page and nothing else, and the page says exactly that: *"In simpler
words — drafted by a computer from the two translations on this page, and not yet checked by a person."*
Every draft passed `tools/lib/gita-gloss-lint.js` before it was kept (no name or number that is in
neither translation, no Sanskrit, nothing that ranks or dismisses a faith, 8–45 words); a verse
whose drafts kept failing has no reading rather than a bad one. Each sits in
`tools/gita-src/gloss.json` with `needs_review: true`, `by: computer-drafted`, `from: [Besant 1922,
Swarupananda 1909]`, and `build-gita.js` writes it only while it is flagged and still passes the
lint against *that* verse's English. Whether a reading is faithful is the reviewer's to say, not a
program's — it is on the Sanskrit reviewer's list in §8.5. `tools/gita-gloss.py` drafts with a
Gemini text model (key and model from the environment) or `--import`s drafts made elsewhere under
the same rules; the first 700 were drafted by the AI assistant that builds this app, on 4 Oct 2026, when the Gemini text
models answered 402 on this key. `check-gita readings` holds it.

### 8.4 Music and pictures

Six themes in `music/engine.js`, no drums under a chant: the field (ch. 1, Darbari), a teacher
and a friend (Bhupali), sitting still (Malkauns), devotion (Bhairavi), the vision (ch. 10–11,
Darbari), the way through (ch. 18, Yaman). Under a chant the music sits as a bed (60%), not
ducked out of the way as it is under narration. Off in Calm mode, like all music.

Pictures are the Mahabharata's own episode-26 paintings (and one of the field, 25-2), **none
with lettering painted in** (26-0, 26-2, 26-7, 25-3 are excluded). Each verse gets one of its
chapter's paintings and its own slow camera; nothing in a painting moves. Still under
reduced motion and Calm.

### 8.5 It does not publish until a person has read it

`tools/gita-src/review.json` says `needs_review`. Until a reviewer who reads Sanskrit writes
their name there — having checked the text against a printed edition, the two held readings,
the attributions, and **listened to the chanting** — the module opens in **tester mode only**
(`?tester=1`), with a draft bar. Everyone else, on the Gita shelf and at any of its routes, is
told it is built and being checked, and is offered the five verses instead. Ages 10+ (the
collection's gate) once it opens.
