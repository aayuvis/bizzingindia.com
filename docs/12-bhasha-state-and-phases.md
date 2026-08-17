# 12 — Bhasha: where the Hindi engine actually stands, and what comes next

**Companion to [09-language-engine.md](09-language-engine.md).** That document is the
architecture and the business case. This one is the audit: what is built, what is measured,
what is missing, and the phases that close the gap — **Hindi first, deliberately**, because
every gap closed for Hindi is closed as an engine capability that the other eight packs
inherit as data.

Written after a full read of `app/bhasha.js` (3,169 lines), the Hindi data files, the Bhasha
views in `app/app.js`, and `tools/test-bhasha.js`. **Every number below was measured, not
estimated** — the measurement commands are in §8 so anyone can re-run them and catch this
document drifting.

> **A note on the numbering.** An earlier rebuild plan referred to "Phases 0–5" and lived
> only in a chat thread and a task title; it was never written down and is not recoverable.
> The phases in §5 below are a fresh, documented plan and do not attempt to continue that
> numbering. They are also **not** the Phase 2–5 language-rollout schedule in
> [09 §8](09-language-engine.md#8-what-this-does-to-the-roadmap), which is about *which
> languages ship when*. Two different things had the same label; this document is where the
> engine plan lives from now on.

---

## 1. The short version

**Hindi content is complete and the engine under it is sound.** 507 lexicon words, 507
example sentences (100% coverage), 72 authored dialogues, all eight stages populated, all
thirteen exercise generators reachable, 539/539 checks passing.

**The gap is no longer content for Hindi. It is four capabilities the engine does not have
at all** — production, grammar as a taught object, comprehension above the sentence, and a
parent's view — plus one thing that is not a gap but a launch blocker: **the audio is
synthesised**.

And then, separately, the eight other packs have **zero** sentence and dialogue content.
That is a content job on seams that already exist, and it should not start until the Hindi
capabilities below are settled, or it will be done twice.

---

## 2. What is built and working

### 2.1 The eight-stage ladder

| Stage | Name | English | Script? | Exercise types |
|---|---|---|---|---|
| s0 | Sunna | Listening | no | `listenPoint` |
| s1 | Varnamala | The letters | yes | `soundMatch`, `oddOneOut` |
| s2 | Matras | Vowel signs | yes | `matraAttach`, `barakhadi`, `soundMatch` |
| s3 | Shabd | Words | yes | `listenPoint`, `wordBuild`, `sentenceBlank` |
| s4 | Vakya | Sentences | yes | `sentenceBuild` |
| s5 | Baat-cheet | Conversation | yes | `pickReply`, `listenPoint` |
| s6 | Padhna | Reading | yes | `conjunctSplit`, `readPassage` |
| s7 | Likhna | Writing | yes | `trace` ×3, `wordBuild` |

Stage types are **data, not code branches** — `typeOpts` on the ladder is how s2 gets
syllable-kind `soundMatch` without a language `if`. Stages degrade by content: a pack with no
authored sentences falls back to `wordBuild` automatically, which is why the eight other
packs are usable today rather than broken.

### 2.2 Measured Hindi content

```
lexicon            507 words across 17 themes
sentences          507  (100% of lexicon — one per word, each containing
                        its word verbatim exactly once, which is what makes
                        masking honest)
dialogues           72  authored, with per-distractor whyWrong lines
stage items        s0:93  s1:46  s2:12  s3:507  s4:68  s5:72  s6:54  s7:33
```

**s4 covers 16 grammar points**, which is more structure than the stage description
suggests: `sov` 9, `postposition` 7, `question` 7, `agreement` 7, `copula` 6, `imperative` 6,
`tense-present` 4, `tense-past` 4, `gender` 3, `possession` 3, `negation` 3, `quantity` 3,
`tense-future` 2, `request` 2, `plural` 1, `respect` 1.

**s5 covers 11 real scenes**, and the weighting is the product working as designed —
`phone-to-nani` 12, `at-the-table` 10, `answering-a-grown-up` 8, `at-school` 7,
`greeting-elders` 6, `asking-for-something` 6, `the-market` 6, `playing` 5, `at-a-festival` 4,
`bedtime` 4, `not-well` 4. A heritage child's hardest real conversation is the Sunday phone
call, and it is the largest scene.

**s6** holds 42 conjuncts and 12 graded passages.

### 2.3 The engine capabilities

- **Leitner SRS** — 7 boxes, `10min / 1 / 2 / 4 / 8 / 16 / 32 days`. A miss drops one box,
  never to zero from the top. Times are in ms so tests can drive a fake clock.
- **Session planner** — plans a lesson arc rather than serving random questions;
  `replayMiss` brings a missed item back inside the same session.
- **Placement** — three routing questions, so a child who already speaks Hindi does not start
  at "this is the letter क".
- **Band** — climb fast, fall slow.
- **Readiness** — per-stage new / learning / review / mastered counts.
- **Stage gates** — mastered by 12 correct, or by testing out.
- **Deterministic RNG** — same seed, same question. A worksheet can be reprinted and a parent
  report can show exactly what was asked.
- **Three interaction families** — `choice` (tap or key), `build` (ordered tiles, auto-graded
  when the last slot fills), `trace` (the Likhna canvas). All keyboard **and** touch.
- **One masker** — `IND_BHASHA.mask` is shared by every view and every test, so "hide the
  word" cannot drift per screen.

### 2.4 The seams that already generalise

`W.IND_BHASHA_SENTENCES[packId]` and the dialogue equivalent are **generic and guarded for
absence**. A pack's content can land without touching engine code. Hindi currently reaches
its sentences through a legacy `W.IND_HI_SENTENCES` global that the resolver special-cases —
see Phase A.

---

## 3. The gaps, in priority order

### G1 — There is no production. Everything is recognition. **(High)**

Every question in all thirteen generators is *choose* or *arrange from given tiles*. A child
can complete the entire Hindi ladder without ever producing a word from nothing.

This is the single biggest pedagogical hole. Recognition and recall are different skills and
the gap between them is where heritage learners actually stall: they understand Nani
perfectly and cannot answer her. `build` gets close — the tiles are given, so it is
assembly, not retrieval.

There is also **no speaking**, which for a language a child hears daily and speaks rarely is
the skill the app is nominally for.

### G2 — Grammar is drilled but never taught. **(High)**

s4 tags 68 sentences across 16 grammar points, and a child meets them one sentence at a time
and induces the rule — or doesn't. There is no moment where the app says *Hindi verbs agree
with gender, here is what that means, here are the two shapes.*

Gender agreement is the hardest single feature of Hindi for a heritage learner and has
**3 sentences**. `respect` (आप/तुम/तू) has **1** — in an app whose largest conversation scene
is talking to a grandparent, where getting आप wrong is the actual social risk.

### G3 — Comprehension stops at the sentence. **(Medium-High)**

s6 has 12 graded passages, but the exercise is `readPassage` and `conjunctSplit` — decoding.
Nothing asks *what happened in that passage*. The app has 344 stories in English with real
narrative; none of that machinery is pointed at Hindi.

### G4 — The audio is synthesised. **(Launch blocker, already known)**

Measured: **1,087 Hindi clips** — 522 word, 507 sentence, 46 letter, 12 matra. Coverage is
essentially total, and every one of them is `hi-IN-Neural2-A`.

[09 §9](09-language-engine.md#9-per-pack-production-cost) calls human voice non-negotiable,
and it is right: children imitate these sounds and TTS teaches errors a native-speaker parent
hears in five seconds. **The 72 dialogues have no audio at all** (0 clips), so the
conversation stage — the one about talking to people — is silent.

### G5 — No parent's view. **(Medium)**

`readiness` computes per-stage new/learning/review/mastered, and nothing renders it for a
grown-up. There is no "what has she actually learned", no way to see the 16 grammar points as
a map, nothing a parent can act on. For a paid family product this is a retention feature,
not a nicety.

### G6 — Hinglish and code-switching are absent. **(Medium)**

Real diaspora Hindi is code-switched constantly, and the app models a pure Hindi that the
child does not hear at home. Worth a deliberate decision rather than an accident — currently
it is an accident.

### G7 — Eight packs have no sentences or dialogues. **(High, but sequenced last)**

```
pa 0/248   bn 0/233   mr 0/231   te 0/184
ta 0/243   gu 0/206   kn 0/250   ur 0/248
```

All eight fall back to derived adjacency pairs — which is exactly the "conversations that do
not logically connect" problem the original audit named. Hindi was fixed; these were not.

**Sequenced last on purpose.** Authoring 8 × ~250 sentences against an engine that is about
to gain production, grammar cards and comprehension means authoring them twice. Every phase
below is designed so its content shape is fixed *before* it is multiplied by nine.

### G8 — Minor, but they will bite

- **Legacy Hindi globals.** `W.IND_HI_SENTENCES` / `W.IND_HI_DIALOGUES` are special-cased by
  pack id inside `sentenceMap()` and `pickReply()`. Nine packs should reach content one way.
- **No native-speaker sign-off recorded** in any pack file, though [09 §9] requires it.
- **58 `needs_native_speaker` names** outstanding across the app.

**Corrected on re-measurement:** an earlier draft of this document called Hindi's s2 "thin"
at 12 items. It is not. Devanagari **has** exactly twelve matras, so 12 is the complete
inventory, and the drill space is 33 consonants × 12 matras = 396 syllables generated by
`barakhadi` and `matraAttach`. Item count is not practice count on a generative stage. Urdu's
5 is a genuinely different writing system, not a gap either.

---

## 4. What is explicitly *not* wrong

Worth recording, because these were the original audit's complaints and re-opening them would
waste a cycle:

- Readiness levels exist and are computed per stage.
- Word cards carry the word, its meaning, its theme, its sentence and its place in the
  child's own progress.
- `oddOneOut` renders options.
- s3 (Shabd) holds 507 **words**, not letters.
- s4 (Vakya) holds 68 authored sentences and is not empty.
- Dialogues are authored exchanges with reasoned distractors, not derived adjacency.

---

## 5. The phases

Each phase is **an engine capability proven on Hindi, then a content shape frozen**. Nothing
is multiplied across nine packs until its shape has survived contact with real Hindi content.

### Phase A — Tidy the seams *(small, do first)* — **DONE**

Retired the `IND_HI_*` special-casing so all nine packs reach sentences and dialogues through
`IND_BHASHA_SENTENCES[packId]` / `IND_BHASHA_DIALOGUES[packId]`. `sentenceMap()` and
`dialogueBank()` have no pack-id branch, and `tools/test-bhasha.js` asserts the absence so it
cannot come back.

*Why first:* every later phase adds a per-pack content channel. Adding them to a resolver
that already special-cases Hindi bakes the exception in nine times.

### Phase B — Production

A fourth interaction family: **`produce`** — the child writes the answer in Devanagari, from
nothing.

- A Devanagari input that is not a system keyboard: a consonant grid plus matra ring, which
  is the same abugida model s2 already teaches, so the input *is* practice.
- Grading that is script-aware, not string-equality — a missing nukta or a wrong-length
  matra is a near-miss with a specific correction, not a red cross.
- Seeded into s3 and s4 first, where the vocabulary is already known.

*Gate:* production items must flow through the same SRS boxes as recognition items, or the
child will drill what they can already do.

### Phase C — Grammar as a taught object

The 16 grammar points become **first-class objects** with a card each — the rule in a
sentence a nine-year-old can hold, two or three worked examples pulled from the sentences
already written, and its own SRS track.

Then rebalance the thin ones: `gender` from 3 items to ~20, `respect` (आप/तुम/तू) from 1 to
~15 and wired to the `phone-to-nani` and `greeting-elders` scenes where it actually matters.

*Why this shape:* a grammar point with an id is a thing the parent view can show, the SRS can
schedule, and the other eight packs can map onto — even where the point itself differs.

### Phase D — Human voice, Hindi first

Record the 1,087 Hindi clips with a native speaker, **and the 72 dialogues, which have none.**
Keep the derived clip keys (`hi/w-paani`, `hi/s-paani`) so a recording session works from a
generated manifest and the swap is a file drop.

*This is the launch gate for Hindi.* Not a phase that can be skipped and returned to: every
week of synthesised audio is a week of children learning wrong sounds.

### Phase E — Comprehension above the sentence

Point the story machinery at Hindi. Short Hindi passages with *what happened* questions,
graded on the s3 lexicon so a child meets only words they have. The obvious source is the
folk tales already written in English — the same story, told small, in Hindi.

### Phase F — The parent's view

Render `readiness` for a grown-up: stages, the grammar map from Phase C, what is due, what
was missed twice, what she can say now that she could not last month. Read-only, honest, no
gamified score.

### Phase G — The other eight packs

**Only now.** For each pack, in the order [09 §8](09-language-engine.md#8-what-this-does-to-the-roadmap)
sets: ~250 sentences at one per lexicon word, ~70 dialogues on the same 11 scenes, the
grammar points mapped, a native-speaker pass, human voice.

*Gate from [09 §8], and it still holds:* if pack #2's content takes more than ~30% of the
effort of Hindi's, the shape is not actually reusable — stop and fix the shape, not the pack.

---

## 6. Sequencing rationale

Phases B, C and E each **change what a pack's content file must contain**. Phase G multiplies
whatever that shape is by eight. Doing G early costs the eight-fold rewrite; doing it last
costs nothing but time.

Phase D is orthogonal — it can run in parallel with anything, because the clip keys are
already derived and stable. It is listed fourth only because it is the launch gate, not
because it blocks B or C.

---

## 7. Open decisions for a human

1. **Hinglish (G6).** Model the code-switching a diaspora child actually hears, or hold a
   pure register? This is a pedagogical position, not an implementation detail.
2. **Speaking (G1).** Speech recognition for a 4–12 heritage learner is genuinely hard and
   genuinely valuable. In scope, or explicitly deferred?
3. **Which grammar points are load-bearing** for a heritage learner specifically — needs a
   native pedagogue, not a developer's guess.
4. **Whether Hindi ships before the other packs have any sentences.** Shipping Hindi alone
   risks exactly the Hindi-centrism [09 §10](09-language-engine.md#10-risks) names as a high
   risk.

---

## 8. Re-measuring this document

Every number in §2 and §3 comes from these. Re-run them before trusting anything above.

```sh
node tools/test-bhasha.js          # engine invariants (539 checks at time of writing)
node tools/verify.js               # includes the no-dead-ends Bhasha walk
```

Coverage per pack — lexicon size, sentence coverage, items per stage:

```sh
node -e "
const fs=require('fs'),vm=require('vm');const W={};
const ctx=vm.createContext({window:W,console,Date,Math,JSON,Object,Array,String,Number});
fs.readdirSync('app').filter(f=>/^(bhasha|data-bhasha|voice-manifest)/.test(f))
  .forEach(f=>{try{vm.runInContext(fs.readFileSync('app/'+f,'utf8'),ctx)}catch(e){}});
const B=W.IND_BHASHA;
for (const id of Object.keys(W.IND_PACKS)) {
  const p=W.IND_PACKS[id], lex=p.lexicon||[], sm=B.sentences(id)||{};
  const withS=lex.filter(w=>sm[w.word]).length;
  console.log(id, 'lex='+lex.length, 'sent='+withS+'/'+lex.length,
    (p.stages||[]).map(s=>s.id+':'+((s.items||[]).length)).join(' '));
}"
```

Audio coverage for a pack (`hi/w-` words, `hi/s-` sentences, `hi/d-` dialogues):

```sh
node -e "
const fs=require('fs'),vm=require('vm');const W={};
vm.runInNewContext(fs.readFileSync('app/voice-manifest.js','utf8'),{window:W});
const c=p=>W.IND_VOICE.filter(k=>k.startsWith(p)).length;
console.log('words',c('hi/w-'),'sentences',c('hi/s-'),'letters',c('hi/l-'),
            'matras',c('hi/m-'),'dialogues',c('hi/d-'));"
```
