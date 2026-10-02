# CLAUDE.md — Bizzing India

Read this first, then [CONCEPT.md](CONCEPT.md).

## What this is

**Bizzing India** (bizzingindia.com) — a story-first web app teaching Indian kids 4–12 the
history, faiths, mythology, geography and Hindi of India. Sibling to
[Bizzing Bee](https://github.com/aayuvis/Bizzing-Bee); primary audience is the Indian
diaspora, secondary is India.

A working app in `app/` (no build step), with the docs as its spec. `npm test` is the gate.

## Working style (the user's pace)

Inherited from Bizzing Bee, and it holds here:

- **Work autonomously.** Move through the whole request list without stopping to confirm
  routine steps. Stop only for a real fork, a destructive or outward-facing action, or
  missing information you genuinely can't infer.
- **Multitask.** Background long jobs; make independent edits and searches in parallel.
- **Bias to action, then verify.** Prefer doing over asking; verify headlessly rather than
  asking the user to check.
- **Batch and ship.** Group related edits into one commit with a clear message.
- **Keep reasoning tight.**

## Hard rules

### Editorial (the big one)

[docs/05-editorial-policy.md](docs/05-editorial-policy.md) is **binding**, not aspirational.
The short version:

1. **Every content object gets a badge** — 🪔 Katha (a story as it's told) / 📜 Itihaas (what
   evidence shows) / 🧭 Aaj (how it lives today). Assign it before writing a word.
2. **Never write history from memory.** Fill `sources[]` on every Itihaas and Dharma object.
   If you can't cite it, cut it.
3. **Never invent** a scripture quotation, a date, an inscription, or an archaeological
   finding. Not even a plausible one.
4. **Faiths are presented from the inside** — as adherents understand and practise them.
   Never ranked, never compared to judge. Never "myth" as a synonym for "false."
5. **Internal diversity is the point.** A Tamil, Bengali, Gujarati and Punjabi childhood look
   genuinely different. Say "in many families…" and "ask your family."
6. **Sensitive topics** (caste, Partition, communal conflict, colonial violence, contested
   chronology) are for a human author with a named reviewer. Draft flagged
   `needs_review: true`; never publish directly.
7. **Nothing sacred to anyone is ever the antagonist.** Vismriti — the Forgetting — is an
   impersonal grey mist, deliberately.
8. **Never imply Hindi = Indian.** Large parts of the audience are Tamil, Telugu, Gujarati,
   Punjabi, Bengali, Marathi households.

### Product & code

- **Every game needs BOTH keyboard AND touch controls.** Non-negotiable, inherited from
  Bizzing Bee.
- **Never leak the answer** in on-screen text for any quiz or Hindi drill.
- **Entitlements are server-authoritative** — read from the DB via RLS, never a client flag.
- **Back never leaves the app.** Every screen is a route, `#/<view>/<arg>`, written by `go()`;
  `#/continue` opens the one next thing (the Hive's door). A new screen is routable by being
  a `case` in `render()` — there is no second list. `tools/check-trust.js` holds it.
- **Coins are for learning, in the family's one wallet** (`app/family/bizzing-wallet.js`, docs/23):
  `earn('answer'|'stop'|'contest'|'mastery')` at 1 · 5 · 10 · 20, ≤ 100 a day. Never for
  time, taps, self-report, dice or luck; only a game in `TEACHES` pays. Rank counts mastery
  evidence, never coins. Nothing is random (no draws — a child chooses at a printed price).
  No streak counts — "good days this week". A wrong answer holds until Continue.
  `tools/check-rewards.js` holds all of it.
- **Home is the family anatomy, and Continue is one function** (docs/24): greeting with the
  ring and the word of the hour · ONE Continue card with the only filled button · today's
  three · ≤ 6 ways in. `nextStep()` decides the next thing for Continue *and* `#/continue`;
  never add a second "next". `?demo` runs in `demo.js`'s in-memory sandbox and never touches
  the real household. `tools/check-home.js` holds all of it.
- **A household, not a device** (docs/25): `Store.kidKey()` decides whose key a thing is — the
  first child keeps the old keys, later ones get `.<id>`. Switching child reloads the page.
  Only the seam files touch `localStorage`; engines use `window.IND_STORE`. The top bar is the
  family's (standard v2 §3): ⬡ · ☰ · peacock + name · … · search · coin · theme · 🔒 · avatar ▾, 56px,
  one row; five tabs Home · India · Paathshala · Bhasha · Play; everything else lives in ☰. `bizzing.activity` gets
  active minutes and milestones, never from the demo. `tools/check-family.js` holds it.
- **Medals, sound and the game frame** (docs/26): medals only from what the app saw, each
  celebrated once; the host gives every game a how-to, sound, motion and "what you practised";
  `sfx.js` makes its sounds (no audio files) under the one mute; every lock says how to open.
  `tools/check-motivation.js` holds it.
- **The first screen carries only the shell** (docs/27). New data goes in a `<template id="lazy-…">`
  group in index.html, never as a shell `<script>`; a screen lists its groups in `NEEDS`. Home
  reads `shell-index.js` (generated by stamp.sh — never hand-edit). Budget on a phone: 1.5 MB,
  JS 400 KB gzipped; `check-platform weight` holds it.
- **Nothing ships untested**: `npm test` records the exact tree it passed; `deploy.sh` refuses
  any other. Contrast is measured on pixels in every world, day and night (`check-contrast`);
  facts are linted (`check-facts`). The report card is Time · Progress · Mastery.
- **Nothing that changes the child sits on the child's page.** Starting again, backups and
  the report card are behind the grown-ups' PIN, which the screen calls a deterrent. The
  developer unlock exists only in tester mode (`?tester=1`), never in front of a child.
- **Child data is minimal by construction**: first name and an *age band*, never a birthdate,
  no child email, photo, location or free text. COPPA + GDPR-K + India's DPDP Act 2023 (which
  covers under-18s and bars behavioural tracking and targeted ads at children). No ads, ever.
- **Map boundaries** — the app uses the **Survey of India depiction everywhere**, for every
  user in every locale. **J&K is shown whole**, as India depicts it. There is no
  region-varying geometry. Pre-modern boundaries on the time slider are **soft zones of
  influence**, never crisp modern borders. **Never animate or gamify a boundary** — no
  border draws itself, pulses, gets conquered or moves as a reward. Reviewed before shipping.
  Known geometry gaps to fix before launch (Telangana, Ladakh, Lakshadweep) are listed in
  [docs/07-tech-architecture.md](docs/07-tech-architecture.md#7-the-living-map-technically).
- **Devanagari is set correctly or not at all** — real Devanagari face (Mukta / Noto Sans
  Devanagari), unbroken shirorekha, ~10–15% larger than Latin, line-height ≥ 1.7, never
  letter-spaced, never faked with a Latin "Sanskrit-look" font, never decorative squiggle.
- **Folk art traditions are credited.** Named artist where commissioned; the tradition and
  region named always. Never uncredited texture.
- **Never** put a real model identifier in commits, PRs, code, or any pushed artefact.
- **Video lives in [Bizzing-Videos](https://github.com/aayuvis/Bizzing-Videos) now**, not
  here — see [docs/14-video.md](docs/14-video.md). It *reads* this repo through its own
  `pipeline/sources.js` and keeps no copy of the narration or the art, because nothing on
  the channel is invented for the channel: a child who watches a video and then opens the
  app meets the same tortoise, and a copy is a thing that can drift. **Change a story's
  text, hook, moral or narration and every film built from it is stale.**
- **No Veo videos. No generated motion at all for story films.** Films are composited
  locally from generated sprites and plates. Generative *image* models stay in the pipeline
  and draw the sprites, plates and model sheets; generated *motion* is out, because a model
  with no scene cannot guarantee a structural fact ("both geese are holding the stick") and
  four rounds proved it can only be asked for. Before starting video work on **any** Bizzing
  property, read `docs/02-production-brief.md` in Bizzing-Videos. Every trap in it was paid
  for once already.

## Courses (Paathshala)

Ten courses, 264 hours, laid over the corpus rather than written from scratch — see
[docs/20-courses.md](docs/20-courses.md), and [docs/21-gita.md](docs/21-gita.md) for the
Gita module specifically. Four rules bind anyone touching them:

- **A check on the same day as its teaching is practice, not learning.** `ledger()` in
  `app/paath.js` is the only door into the mastery record, and it writes only when the
  check happens on a later day. The grown-up's report shows objectives, never minutes.
- **A course may only quote a verse that already exists, sourced, in `data-shlok.js`.**
  The Gita course is built on the five Gita verses this app has and says so. Anywhere a
  course wants a verse it does not have, `needsVerse` renders an honest screen.
- **Sensitive modules carry `needsReview` and do not publish.** Colonial rule, Partition,
  contested claims in the history of science, and the whole Gita course.
- **A verse is set in its own script.** The courses cite Tamil and Pali alongside Sanskrit
  on purpose — the same quality in three traditions is the lesson — so the take-home pack
  derives each card's language from its collection. Setting Thirukkural in a Devanagari
  face is the `docs/05` script rule broken, and `script` in check-paath.js holds it.

- **A part is three stages, and the third one is locked.** Learn it, test yourself, make
  something — and the project does not open until the test passes. Making the thing is how
  a child keeps what they learned; it is not a way round showing that they learned it.
- **The app never claims to have marked what it cannot mark.** A project has a workshop
  half done in the app (`app/karya.js`) and a paper half done away from it. What a rule can
  decide — a word the course holds, a traced letter, four things in order — is decided
  completely and counts. What it cannot decide is **kept, never scored**: no photograph of a
  child's handwriting leaves the device and no program grades it. And for the one in the
  middle — *write your own name*, which this app cannot spell-check — it checks the
  **script** (every vowel sign hung on a consonant, every halant between two letters) and
  says on screen which of the two it did. A child told "correct" about their own name by a
  program that does not know their name has been lied to.
- **Nothing in the workshop touches the mastery record.** `ledger()` in `app/paath.js` is
  still the only door, and `karya.js` has no handle on it.
- **A reference that resolves is not a link that works.** Every check was green while 47
  links ended in "Not found" and 74 stops were empty. `tools/qc-paath.js` clicks through
  every stop, question and link in a real browser and must exit 0. A stop with nothing in
  the corpus to show is held for a reviewer and says so — never filled from memory.

`tools/check-paath.js` holds all of it — hours = modules × 3, every corpus reference
resolves, nothing sensitive claims to be finished, the project is gated, and the app's
claim about how it marked a thing matches what it actually did.

- **The family's shared code is copied, never edited** (docs/29): `app/family/` holds
  Bizzing_Schedule's `bizzing-wallet.js`, `bizzing-activity.js`, `bizzing-avatars.js` and `.css`
  byte for byte; `family/bridge.js` hands them to the classic scripts. Avatars are the family's
  96 = 12 × 8 at 2/3/2/1 (`avatar-catalogue.js`, validated in `check-standard`); worlds 1–2 are
  free and the rest open with the family plan or 240 coins. Music is composed in code
  (`music/engine.js`, `music/CREDITS.md`), lazy, ducked under the voice, off in Calm mode.
  `tools/check-standard.js` holds the v2 standard.

## Architecture (planned)

Vanilla ES modules + Vite + PWA · Supabase (Auth/Postgres/RLS) · Stripe (+ Razorpay/UPI for
India) · content as versioned JSON on a CDN with bundled offline fallback · design tokens
shared with Bizzing Bee via its `ds-src` package. Full detail in
[docs/07-tech-architecture.md](docs/07-tech-architecture.md).

Two things to preserve from Bizzing Bee: the `state → render()` + `data-act` dispatch idiom
(the team is fluent in it), and offline-first as a hard requirement. Two things to change:
build with Vite and ES modules from day one, and put **all** storage behind the `Store` seam
from the first commit — the "Phase 1 linchpin" of Bizzing Bee's commercialization roadmap,
free if done first.

## Branch

Development happens on `claude/bizzingindia-github-pages-8qsv38` unless told otherwise.

## Commit trailer

```
Co-Authored-By: Claude <noreply@anthropic.com>
```
