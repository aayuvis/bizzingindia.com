# CLAUDE.md — Bizzing India

Read this first, then [CONCEPT.md](CONCEPT.md).

## What this is

**Bizzing India** (bizzingindia.com) — a story-first web app teaching Indian kids 4–12 the
history, faiths, mythology, geography and Hindi of India. Sibling to
[Bizzing Bee](https://github.com/aayuvis/Bizzing-Bee); primary audience is the Indian
diaspora, secondary is India.

**Currently concept-stage.** Docs only, no application code yet.

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
- **Video lives in [Bizzing Videos](https://github.com/aayuvis/Bizzing-Videos)**, not here.
  The pipeline, the film assets and the two binding documents moved to that repo; `docs/14`
  and `docs/15` here are stubs pointing at it. **Read its `docs/02` before starting video
  work on any Bizzing property**, Bizzing Bee included — it is written to be read cold, and
  its first section is the one that costs money.
- **No Veo videos. No generated motion at all for story films.** Films are composited
  locally from generated sprites and plates. Generative *image* models stay in the pipeline
  and draw the sprites, plates and model sheets; generated *motion* is out, because a model
  with no scene cannot guarantee a structural fact ("both geese are holding the stick") and
  four rounds proved it can only be asked for.
- **This app is the source of truth for everything on the channel.** The films read this
  checkout live — the words from `app/data-stories*.js`, the narration from `app/voice/st/`,
  the type from `app/fonts.css`, the paintings from `app/art/story/` — so a child who
  watches a video and then opens the app meets the same tortoise. Two consequences that
  have already bitten: **a clip the app never plays is not the app's narration** (hook and
  moral clips were orphans in a different voice across 646 stories), and **renaming a story
  changes the channel** (the title card went on saying the old name until it was
  re-rendered). If a film has a better tortoise than the app, the app is what to fix.
- **Video published under the brand follows Bizzing Videos' `docs/01`**, which is binding.
  Generated lettering never appears in a shot — titles are composited in the app's own type.
  Harm and death stay as elliptical as the app's own telling; never make the video braver
  than the text.

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

Development happens on `claude/bizzingindia-webapp-concept-1gyjif` unless told otherwise.

## Commit trailer

```
Co-Authored-By: Claude <noreply@anthropic.com>
```
