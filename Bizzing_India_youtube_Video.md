# Bizzing_India_youtube_Video — handover

**This is the CLAUDE.md for the `Bizzing-Videos` repository.** `tools/migrate-videos.sh`
installs it there as `CLAUDE.md`. It is written to be read cold, by a session that has
none of the context in which the pipeline was built.

Read this, then `docs/02-video-production-brief.md`. The brief's §0 is the section that
costs money if you skip it.

---

## What this is

The film pipeline for the **Bizzing** properties — starting with the Bizzing India YouTube
channel, and built so Bizzing Bee can use the same machinery without a rewrite.

Story films are **composited locally** from generated sprites and plates. Every structural
fact — who is holding what, who is sitting on whom, who is speaking — is a measured
geometric relationship in a rig, asserted before a frame is rendered.

Two films exist. Both are Panchatantra tales, both ~90 seconds:

| film | rig primitive it introduced | state |
|---|---|---|
| `pt-talkative-tortoise` | `carry` — the stick's endpoints **are** the two geese's beak tips | shipped |
| `pt-monkey-crocodile` | `ride` — the rider is pinned to a saddle measured off the mount | shipped |

There are **323 stories** in the app. The asset library — sprites, plates, model sheets for
a cast of ~69 — is the fixed cost of the entire channel; the per-film cost after that is
authoring a `scenes.json` and waiting for a render.

---

## The standing instruction, in one line

> **No Veo. No generative motion of any kind for story films.**

Generative *image* models stay in the pipeline and are essential — they draw the sprites,
the plates and the model sheets. Generated *motion* is out.

Four full rounds of generative video failed on a single 87-second film. The failures were
not quality problems, they were **structural**: the geese changed species between shots,
the tortoise held the stick in his hands and then bit it and then neither, the stick flew
through the air unheld, and he smiled while falling to his death. A model with no scene
cannot *guarantee* a structural fact — it can only be asked for one. `docs/02` §1 has the
full account. Do not reopen this.

---

## The seam: `$BIZZING_APP`

This repo **reads** the app; it never copies from it.

    export BIZZING_APP=../bizzingindia.com

Through that path the pipeline takes:

- **narration** — `app/voice/st/<story>-<seg>.mp3`, which is the clock for every shot
- **story text** — `app/data-stories*.js`, for the title card, the hook and the moral
- **the mark and the type** — `app/art/logo.png`, `app/font/`, `app/tokens.css`

Why a seam and not a copy: **nothing on the channel is invented for the channel.** A child
who watches a video and then opens the app must meet the same tortoise, hear the same
words, read the same moral. A copy is a thing that can drift. There is no copy.

**The corollary is a maintenance obligation.** Change a story's text, hook, moral or
narration in the app and every film built from it is stale. `film.js` catches the narration
half automatically — a shot's cache key includes its narration length — but a reworded
moral with the same duration will not re-render itself. Re-cut deliberately.

---

## The pipeline

    export BIZZING_APP=../bizzingindia.com
    export STORY=pt-monkey-crocodile

    python3 tools/gen-assets.py      # sprites + plates from a canonical model sheet
    node tools/cards.js              # title and end cards, in the app's own type
    node tools/build.js              # scenes.json -> one HTML page per shot
    node tools/film.js --check       # every assertion, no rendering at all
    T=3600 node tools/still.js 07    # ONE frame, paused at 3.6s — use this constantly
    node tools/film.js               # render each shot at its narration length
    node tools/cut.js                # cards, narration, loudnorm, master + preview
    tools/publish-video.sh build/video/<film>.mp4 video/<name>.mp4

Each stage is a separate script on purpose: `--check` is seconds, a still is one second, a
full render is ~4 minutes a shot. The whole discipline is to never pay for the last one to
learn something the first three could have told you.

### What each tool is

- **`gen-assets.py`** — generated art. Every sprite is generated with the **canonical model
  sheet** passed as an extra reference; that is what stops character drift.
- **`build.js`** — the core. Reads `films/<story>/scenes.json`, measures anchors out of the
  sprite PNGs in embedded Python, and emits an HTML page per shot. All the geometry lives
  here.
- **`film.js`** — steps each page frame by frame in headless Chromium and encodes it. Runs
  the assertions first. Holds a lock. Caches per shot.
- **`still.js`** — one frame, paused at a chosen millisecond. Your most-used tool.
- **`cards.js`** — title and end cards, from `data-stories.js`, set in Fraunces. Generated
  lettering never appears in a shot.
- **`cut.js`** — concatenates, overlays the title on the first shot, appends the end card,
  normalises audio to −14 LUFS, writes a CRF-targeted master and preview.
- **`publish-video.sh`** — writes the blob straight into the `gh-pages` tree by git
  plumbing, at **both** a stable path and a content-addressed one.
- **`tools/attic/veo-story.py`** — the abandoned generative pipeline. Kept as evidence, not
  as an option.

---

## Hard rules

These are inherited from the app's `CLAUDE.md` and `docs/01`, and they are binding.

1. **Nothing on the channel is invented for the channel.** Words, narration, characters and
   world all come out of the app.
2. **Generated lettering never appears in a shot.** Titles are composited in the app's own
   type. Image models cannot spell.
3. **Harm and death stay as elliptical as the app's own telling.** Never make the video
   braver than the text. The tortoise falls; you do not watch him land.
4. **Nothing sacred to anyone is ever the antagonist.**
5. **Faiths are shown from the inside**, as adherents understand and practise them. Never
   "myth" as a synonym for "false."
6. **Devanagari is set correctly or not at all** — a real Devanagari face, unbroken
   shirorekha, ~10–15% larger than Latin, line-height ≥ 1.7, never letter-spaced, never
   faked with a Latin "Sanskrit-look" font.
7. **Folk art traditions are credited** — the tradition and region always, the named artist
   where commissioned.
8. **Never put a real model identifier** in a commit, a PR, code, or any pushed artefact.
9. **No ads, ever**, and nothing that behaviourally targets a child.
10. **Any map is the Survey of India depiction**, everywhere, for every viewer. J&K whole.
    Never animate or gamify a boundary.

---

## The voices

| use | voice | rate |
|---|---|---|
| English story narration | `en-IN-Chirp3-HD-Laomedeia` | 1.02 |
| Hindi | `hi-IN-Neural2-A` | 0.88 |

An Indian narrator is the point, not a preference — the old `en-US-Neural2-F` read the
names as a foreigner would, and it was noticed immediately. **Every one of the 646 hook and
moral clips across all 323 stories has been re-recorded in the Indian voice**; if you find
one that has not, it is a bug.

Two things that have bitten and will again:

- The synthesiser can return **200 OK with an empty MP3**. 34 silent clips shipped this way
  once. `repair-voice.py` in the app repo measures every clip and re-records anything under
  −20 dB or 0.35s. Run it after any large narration pass.
- A **failed clip keeps its previous audio on disk**. A batch that reports "9 failed" has
  not left you 9 missing files, it has left you a *mixed corpus* that looks fine. Find them
  by mtime — anything the pass did not touch — and re-record at fewer workers.

---

## The assertions

`film.js` measures the live DOM before rendering and fails the shot. Reviewing generated
video by eye is how a harness, a bird-ride and a set of bared teeth all shipped; it does not
scale to 500 films.

Currently asserted:

- the stick's ends sit on both beak tips — *the geese are holding it*
- the hanging character's mouth sits on the stick — *he is biting it, not riding it*
- the rider sits on the mount's measured saddle, over its body
- every speech bubble is **above its speaker**, **clear of every character**, and **inside
  the frame**

When a note comes in, the first question is always: *can this be an assertion?* Almost
always the answer is yes, and then it can never regress.

---

## Traps, all of them paid for once

The full catalogue is `docs/02` §5. The ones that cost the most:

**A second renderer.** The single most expensive bug across both films was not in a shot. A
render started in an earlier session kept running for over half an hour after it was
believed dead, writing shot mp4s into the same output directory as the current one — so a
cut assembled from "the finished shots" was a mix of two builds, and a film published as the
fixed one was overwritten by the old one minutes later. From the outside this reads as
*"still the old video"* and *"I feel my prompts are not being implemented"*, and neither
diagnosis points anywhere near the real fault. `film.js` now takes a pid lock. **Kill by
process, not by whatever wrapper you think you started** — stopping the shell can leave the
node process running.

**The gap between a fix and seeing it.** Twelve shots is ~45 minutes. That wait, not any
single bug, is what makes a session show a cut that predates its own fixes. Two things close
it and both are already in: per-shot caching (`film.js` hashes a shot's page, its art and
its narration length) and `still.js`. Use them.

**Anchors are measured, never typed.** Every one that was guessed was wrong — a mouth
guessed at 0.30 landed on the brow, guessed at 0.42 landed on the chest. Derive it from the
pixels (`mouth` = the dark band below the eyes; `beak` = the extreme orange pixel; `saddle`
= the highest opaque pixel at 55% of length; `head` = the leftmost opaque column).

**An anchor says where a character *meets* the world, not that he *fits* in frame.** A
correct perch put the monkey's head off the top of the picture.

**Depth is the whole vocabulary.** Getting it backwards makes a puppet look like a sticker.
"The tortoise is in front of the stick — needs to be behind it" was a one-line note and a
real bug.

**A number the renderer ignores is worse than a wrong number.** `carry.y` was read from
`scenes.json` and silently dropped for a whole film.

**Know whether a coordinate is a centre or an edge.** A bubble sitting 48px inside the frame
was declared off-frame by a guard testing `cy - boxH/2` when `cy` was already the top edge,
and thrown into a fallback that put it on top of the speaker.

**A speech bubble clears every body it passes, not just its speaker's.** "Above the head" is
right and not sufficient when the speaker is 1,266px of side-facing crocodile whose head is
his far tip.

**Publish to a content-addressed URL.** A stable path served from cache is the other way to
show someone yesterday's film while insisting it is today's.

**Destructive tools need an `--only`.** A pitch tuner that rewrites MP3s in place and is
*cumulative* was pointed at a directory to fix two clips and degraded 1,068 before it was
killed.

---

## Publishing

`publish-video.sh` writes into `gh-pages` by plumbing rather than committing the mp4 to the
source branch — a film is a build artefact, re-rendered whenever a line of narration
changes, and committing each cut would grow the repo by tens of megabytes per revision.

It publishes to two paths: a stable one and `<name>-<hash8>.mp4`. **Hand out the
content-addressed link.** It cannot be stale by construction.

`docs/01` §6 has the channel conventions and a ready-to-paste description.

---

## Working style

Inherited, and it holds here:

- **Work autonomously.** Move through the whole list without stopping to confirm routine
  steps. Stop only for a real fork, a destructive or outward-facing action, or information
  you genuinely cannot infer.
- **Multitask.** Background long jobs; make independent edits and searches in parallel.
- **Bias to action, then verify** — headlessly, not by asking someone to look.
- **Batch and ship.** Related edits, one commit, a clear message.
- **Keep reasoning tight.**

One addition, learned the hard way on story two: **never show a cut you have not just
rendered.** Check the timestamps. If a note came in after the render started, the render
does not contain the fix.

---

## Where to pick up

1. **Story three.** The pipeline has survived two films and two rig primitives. The third
   tells you whether it is a pipeline or two lucky films — pick a story that needs a
   primitive neither has: a crowd, a character entering frame, or a scale change within a
   shot.
2. **Cast reuse.** Every film so far generated its own sprites. The monkey in story two and
   any future monkey should be the same drawing. A shared `films/_cast/` keyed by character
   rather than by film is the next structural move, and it is what makes 323 stories
   affordable.
3. **Bizzing Bee.** Same machinery, different property. `docs/02` is written to be read cold
   by that session — the seam is already `$BIZZING_APP`, so pointing it at a Bee checkout
   should be a configuration change and not a fork.
4. **`films/_reference/`** holds loose sprite/plate art from before the per-film layout. Fold
   it into the cast library or delete it; do not leave it ambiguous.

---

## Commit trailer

```
Co-Authored-By: Claude <noreply@anthropic.com>
```
