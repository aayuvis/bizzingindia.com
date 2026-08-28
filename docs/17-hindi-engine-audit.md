# 17 — The Hindi engine, audited deeply — and what was actually wrong with it

**Successor to [12-bhasha-state-and-phases.md](12-bhasha-state-and-phases.md).** That
document planned phases A–G; by the time of this audit, A–F had all shipped code. The brief
for this one was the founder's, verbatim: *"I still don't think the Hindi engine is very
strong — do a very deep critical analysis of the Hindi engine before we build others."*

Method: a full read of `app/bhasha.js` (3,650 lines), all four Hindi data files, the Bhasha
views and session driver in `app/app.js`, `tools/tts.py`'s clip derivation, and
`tools/test-bhasha.js` — followed by **measurement of every suspicion against the live voice
manifest and the live data**. Nothing below is an impression; every finding has a number or
a line of code behind it, and §5 has the commands to re-check.

---

## 1. The verdict

**The engine's architecture is genuinely strong. Its delivery had seven specific defects,
and they are exactly the kind a child feels and an architecture review misses.** The ladder,
the planner, the SRS, the leak rules, the script-generic generators — all sound, all tested,
all doing what docs/09 designed. But the core script stage had **no audio at all**, the
sentence stage **spoke its own answers aloud**, the conversation stage's listen buttons were
**gated on an empty manifest**, the grammar track and the parent's "missed twice" list read
fields **nothing ever wrote**, and the 2,820 story passages arrived **ungraded** — a
seven-year-old could draw a 370-character philosophy paragraph as a reading drill.

None of these is architecture. All of them are the difference between an engine that is
strong and an engine that *feels* strong. **All seven are fixed in this commit**, each
pinned by a regression check in `tools/test-bhasha.js` (634 → 649 checks).

---

## 2. The findings — fixed in this commit

### F1 — Stage 2, the core abugida skill, was silent. **(the big one)**

Measured: `barakhadi`, `matraAttach` and syllable-kind `soundMatch` derive their prompt
audio as `hi/bk-<consonant>-<matra>` — **396 keys for Devanagari, 0 of which existed**.
The ten keyed conjuncts (`hi/ksha`…) and seven nukta letters (`hi/qa`…): also 0. Every
"Listen, then tap the one you heard" in the matra stage fell through to the device's own
speech synthesis — wildly variable on Android, frequently **absent entirely on iOS**, where
the drill becomes an unanswerable guessing game.

*Why it happened, which matters more than the count:* the recording list is derived from
`srsItems()`, and `srsItems()` never mentions the syllable keys the generators invent at
question time. A key on no list is a clip nobody records. The pipeline now asks the same
derivation the generators use (`tools/tts.py` `_DUMP_JS`), the **413 missing clips are
generated** (hi-IN-Neural2-A, same voice as the letters beside them), and a test walks all
33×12 keys against the manifest so the gap cannot reopen. Punjabi's 288 (`pa/bk-*`) remain —
one command, see §4.

### F2 — Stage 4 spoke the answer, then asked the question.

`sentenceBuild` set `say` to the full Hindi sentence and the session player reads `say`
aloud as every question opens. The child this app is for — the heritage child who
*understands spoken Hindi perfectly and cannot produce it* — heard the correct word order,
then arranged tiles to match. Echo, not construction: the one skill s4 exists to build was
the one thing it never demanded. The tiles were also exactly the answer's words, so a
three-word sentence (most of them) was pure elimination. The code comment promised decoys;
the code had none.

Now: **silent until answered** (`audio:null, say:null`; the sentence rides to the feedback
beat as `full`, where it is finally shown *and* spoken as the reward), **two decoy word
tiles** drawn from other sentences, and the tray never opens with the answer laid out left
to right.

### F3 — The conversation stage's listen buttons were dead — with 360 clips on disk.

All 72 dialogues are voiced: 360 clips (`hi/d-NN-p/-r/-x1..3`) in the manifest. But the
per-option ear button was gated on `IND_VOICE_HUMAN[key]` — the *human-recording* manifest,
which is `{}` until a person records. So a four-year-old in Baat-cheet faced three replies
they could neither read nor hear. The gate now accepts a clip from either manifest, human
preferred when it lands.

### F4 — The grammar track was read everywhere and written nowhere.

Phase C built the sixteen grammar points as taught objects with an SRS key each
(`gram:<id>`), a vyakaran reference page, and a parent's grammar map that lights when a
point has been met. Measured: `gram:` appears at **one write site — zero**. No lesson, no
answer, no introduce beat ever created a `gram:` card; the parent map was permanently
unlit and the "point, not only its sentences" scheduling promise was inert. Now every
graded s4 answer moves its sentence's point card with it, and meeting a sentence in an
introduce beat lights its point on the map.

### F5 — "Missed more than once" could never have a single entry.

The parent view filters cards on `c.lapses >= 2`. `srsReview()` writes `seen`, `right`,
`wrong`, `streak`, `box`, `last`, `due` — **never `lapses`**. The one list on that page a
parent can act on was structurally empty. `srsReview` now counts every miss as a lapse.
And the list showed raw storage ids (`s4-12`) — a parent cannot say "s4-12" at dinner —
so entries now resolve to the thing itself: the word, the sentence's own Hindi, the
grammar point's name.

### F6 — 2,820 story passages, ungraded and unweighed.

Phase E folded the story library's Hindi tellings into stage 6 — with narration, which is
lovely. But `readPassage` drew from them with **no length gate and no readiness gate**,
despite every passage carrying a `lex` field computed for exactly that purpose. Sampled:
option "meanings" ran 93–369 characters, three abreast, and a passage's Hindi could be
narrator-register prose far above the s3 lexicon. Now: a bank passage is served only when
it is kid-sized (≤160 chars of Hindi) **and** the child's own SRS holds ≥60% of its anchor
words (≥3 of them) — the authored twelve, graded by hand, pass as they are. Options render
as one readable sentence each; the full meaning stays for the feedback beat.

### F7 — The feedback spoke linguist, not child.

`oddOneOut`'s teaching line was built from raw group ids: *"Three of them are velar
sounds. That one is palatal."* No seven-year-old, and few parents, can use that. The line
now says where the sound is made — *"Three of them are made at the back of the throat.
That one is made with both lips."* — from a script-generic map, since the varga layout is
the shared skeleton of every script this engine will carry.

---

## 3. What the audit checked and found already right

Recorded so nobody re-litigates it (the docs/12 §4 discipline):

- **The leak rules hold.** Every generator was walked for answer leakage: sentenceBlank
  masks by exact single occurrence and withholds roman + sentence audio; wordProduce shows
  meaning/roman/sound and never the word; matraAttach and soundMatch options carry names in
  data but the renderer deliberately withholds them (`subFor = null`); oddOneOut's length
  cut hides romans and offers numbered speakers instead; barakhadi options carry no roman.
  F2 was the *only* leak found, and it was aural, not visual.
- **The planner is real pedagogy.** Teach-then-drill-twice, list-order introduction, the
  85% steering, band depth gating, the repeat cap, miss replay inside the session, the
  practice tail — all present, all tested, all confirmed reachable.
- **The SRS is honest Leitner** with sane intervals, no punishment mechanics, and the
  band/window steering behind it (climb fast, fall slow) works as documented.
- **Grading of written production** (`gradeWritten`) is genuinely script-aware: nasal
  marks, halant, nukta folds, matra length pairs — each with a warm, specific line.
- **507/507 words carry sentences; 72/72 dialogues are authored with reasoned
  distractors; all 16 grammar points have cards.** The content is there.

## 4. Still open, ranked

1. **Human voice (docs/12 G4, unchanged) — the launch gate.** Now 1,500 Hindi clips
   including the 413 new ones, all synthesised. Founder's call on the speaker; keys are
   derived, so the swap is a file drop. *Not attempted here on purpose.*
2. **Punjabi's syllable clips** — same fix as F1, one command:
   `python3 tools/tts.py --bhasha pa` (288 `bk-` + conjunct + nukta keys).
3. **Speaking practice (G1's second half)** — recognition, build and written production
   now all exist; the mouth is still silent. Needs a human decision on ASR for children
   (docs/12 §7), not code first.
4. **Grammar cards in the lesson flow** — the `gram:` track now records honestly (F4),
   but a point's card is still only *read* in the reference; an introduce-style beat that
   shows the card before its sentences are drilled is the natural next step.
5. **Story passages as plannable units** — F6 makes the bank safe to draw; folding the
   in-reach subset into s6's ramp (so the planner can pin and the SRS can schedule them)
   is the completion of Phase E.
6. **Numerals** — the ten Devanagari digits are in the script module and no stage teaches
   them; `soundMatch(kind:'numeral')` is unreachable. Small, real, unscheduled.
7. **Hinglish register decision** (G6) and **native-speaker sign-off** (`reviewedBy: []`)
   — both human, both still open.

## 5. Re-measuring this document

```sh
node tools/test-bhasha.js     # 649 checks; the AUDIT FIXES block is this document's §2
node tools/verify.js          # the no-dead-ends Bhasha walk still passes end to end
```

Clip coverage (the F1 numbers):

```sh
node -e "
const fs=require('fs'),vm=require('vm');const W={};
vm.runInNewContext(fs.readFileSync('app/voice-manifest.js','utf8'),{window:W});
const c=p=>W.IND_VOICE.filter(k=>k.startsWith(p)).length;
console.log('bk',c('hi/bk-'),'d',c('hi/d-'),'w',c('hi/w-'),'s',c('hi/s-'),'pa-bk',c('pa/bk-'));"
```

Every claim of the form "X is read and never written" greps in seconds:
`grep -rn "lapses" app/*.js` · `grep -rn "gram:" app/*.js`.
