# 07 — Tech Architecture

## 1. Principle: start where Bizzing Bee is heading

Bizzing Bee is a no-build, offline, `localStorage` vanilla-JS SPA, and its
[COMMERCIALIZATION.md](https://github.com/aayuvis/Bizzing-Bee/blob/main/COMMERCIALIZATION.md)
lays out the migration to accounts, cloud data and payments. Bizzing India has no legacy to
protect, so it **starts at the end state of that roadmap** — and in doing so becomes the
proving ground for the architecture Bizzing Bee will migrate into.

Deliberately kept from Bizzing Bee:
- Vanilla JS, `state → render()`, `data-act` click dispatch — the team is fluent, and it's
  fast. No framework.
- Offline-first as a hard requirement.
- Parent account → non-authenticating child profiles.
- Token-driven theming, one token contract, themes as pure remaps.
- Every game playable by **both keyboard and touch**.

Deliberately changed:
- **Vite + ES modules** from day one (Bizzing Bee's `app3.js` is 627 KB in one file).
- **Storage behind a `Store` seam** from the first commit — the "Phase 1 linchpin" of the
  Bizzing Bee roadmap, done for free by doing it first.
- **Content is data, shipped separately from code**, versioned and CDN-fetched. Bizzing Bee's
  content is word lists; ours is stories, art and audio, and it will change weekly.

## 2. Stack

| Layer | Choice | Why |
|---|---|---|
| Build | **Vite** | Fast, boring, no framework lock-in |
| App | **Vanilla ES modules** | Team fluency; no React tax on a render-simple app |
| Styling | **CSS custom properties + `tokens.css`** | Shared with Bizzing Bee via `ds-src` |
| Offline | **PWA — manifest + service worker** | Installable; works on a plane to Delhi |
| Auth + DB | **Supabase** (Postgres, Auth, RLS, Edge Functions) | Relational progress data, per-family row security |
| Payments | **Stripe** Checkout + Billing Portal + webhooks; **Razorpay/UPI** for India | Standard; hosted, minimal code |
| Content | **Versioned JSON on CDN**, bundled fallback | Ship stories without redeploying |
| Media | **Cloudflare R2 / CDN** for audio + art | Bandwidth is the main variable cost |
| Analytics | **PostHog** (product + flags), **Sentry** (errors) | Same as the Bizzing Bee plan |
| Hosting | **Cloudflare Pages / Vercel** | Static front end, global edge |
| CI | **GitHub Actions** — lint → Playwright smoke → deploy on merge | Mirrors Bizzing Bee |

## 3. Module map

```
src/
  main.js            boot, router, service worker registration
  store/             THE SEAM — loadProfile/saveProfile/loadDevice/onRemoteChange
    local.js         IndexedDB + localStorage cache (works with zero backend)
    cloud.js         Supabase write-through + reconcile
    migrate.js       schemaVersion migrations
  auth/              Supabase auth, parent gate, child profile switching
  billing/           Stripe checkout, entitlement reads (server-authoritative)
  content/           loader, version check, integrity, offline pack manager
  engine/
    ladder.js        Padav → Level → rank progression, shared by all pillars
    srs.js           spaced repetition (Hindi + quiz misses)
    quiz.js          question types
    games/           Mela engines — engine(host, opts, done) → done({win,score,stars})
    saga/            acts, chapters, dialogue beats, engine dispatch
  map/               the Living Map: geometry, layers, mist/lit state, time slider
  ui/                shell, drawer, cards, modals, toasts, celebrations
  a11y/              reduced motion, dyslexia mode, audio-for-text
  i18n/              UI strings; EN + HI at launch
content/             (published to CDN, bundled fallback)
  index.json         content_version manifest
  stories/*.json     Kathayein
  gyan/*.json        Gyan Card decks (all pillars)
  bhasha/*.json      Hindi program
  geo/*.json         states, rivers, monuments, pins
  saga/*.json        acts, chapters, scripts
  media/             audio + art (CDN)
```

The saga keeps Bizzing Bee's engine contract — `engine(host, opts, done)` →
`done({win, score, stars})` — so engines port between the two apps.

## 4. Data model

Extending the schema sketched in Bizzing Bee's roadmap, so the two apps can eventually share
one `profiles` table and one Family Pass entitlement.

```
profiles(id = auth.uid, email, country, locale, created_at)
children(id, parent_id → profiles, name, age_band, mode, world, home_language,
         gattu, created_at)                       -- NO birthdate, NO free text
progress(child_id, pillar, key, value jsonb, updated_at)
mastery(child_id, item_id, box, due_at, misses)   -- spaced repetition
activity(id, child_id, kind, payload jsonb, at)
entitlements(profile_id, product, tier, source, expires_at)   -- Stripe webhook writes this
family_audio(id, parent_id, child_id, contributor_label, storage_path, duration, created_at)
orders(id, profile_id, sku, fulfilment_ref, status, at)       -- books
```

- **RLS on every table**: `parent_id = auth.uid()`. Test that family A cannot read family B —
  this is the security backbone.
- **`entitlements` is written only by the Stripe webhook** in an Edge Function. The client
  never writes it and never decides it.
- **`family_audio`** is household data: private, never public, never used for training,
  deletable in one tap, and deleted with the account.
- **Two buckets in `Store`**, as in the Bizzing Bee roadmap: *sync* (children, progress,
  entitlements) vs *device-local* (sound, chosen voice, downloaded packs). Only the first
  goes to the cloud.

## 5. Content pipeline

Content is the product here, so the pipeline is a first-class system, not a folder.

**Object shape** (every content object, all pillars):

```json
{
  "id": "katha.ramayana.hanuman-leap",
  "type": "story",
  "badge": "katha",
  "title": {"en": "Hanuman's Leap", "hi": "हनुमान की छलांग"},
  "age_band": ["4-7", "8-12"],
  "age_gate": 4,
  "pillars": ["kathayein"],
  "tags": {
    "place": ["IN-TN", "LK"],
    "time": null,
    "faith": ["hindu"],
    "words_hi": ["समुद्र", "पर्वत", "छलांग"]
  },
  "media": {
    "art": ["r-hanuman-01..08"],
    "audio": {"en": "st/hanuman-leap.en.mp3", "hi": "st/hanuman-leap.hi.mp3"}
  },
  "sources": [],
  "reviewed_by": ["dharma-02"],
  "needs_review": false,
  "content_version": 14
}
```

The `tags` block is what makes the pillars interlock (see
[02 — Curriculum](02-curriculum.md#the-interlock-principle)): the same object surfaces on the
map, on the timeline, in a faith deck and in the Hindi vocabulary. **Build and enforce this
schema before commissioning content** — retro-tagging 200 stories is miserable.

**Versioned delivery.** `content/index.json` carries `content_version`; the app fetches if
newer and falls back to the bundled copy offline. New stories, festival units and Hindi
lessons ship without a deploy.

**Offline packs.** Premium households can download a pillar (art + audio) for offline use.
Pack manifests with size estimates, per-pack delete, and a hard "never auto-download on
cellular" rule.

## 6. Audio

Heavier than Bizzing Bee, because half the audience cannot read.

- **English narration**: US and UK accents. TTS is acceptable for bulk narration if quality is
  high; A/B it against human voice on session length before committing.
- **Hindi**: **human voice for anything a child will imitate** — every letter, matra, core
  word and phrase in the Bhasha pillar. Synthesised Hindi mispronounces and mis-stresses in
  ways that teach errors, and a parent hears it instantly. TTS only for bulk vocabulary
  padding, always flagged for review.
- Bizzing Bee's voice QA loop is the model: parent-facing tester, flag queue, re-synthesis,
  a `VOICE_VER` bump on change. Reuse the pattern outright.
- MP3, 24 kHz mono for speech; per-clip manifest with durations so animation can be timed to
  narration (as Bizzing Bee's concept explainers already do).

## 7. The Living Map, technically

- **Inline SVG**, not a tile-map library: hand-simplified state geometry (~50–100 KB total),
  fully themeable via tokens, works offline, styles with CSS.
- Each region is a `<path id="IN-KA">` with a `data-state` of `mist | lit | partial`.
- **Layers** are separate SVG groups toggled on/off. **Pins** are data, positioned by
  lat/long projected once at build time.
- **The time slider** swaps a historical-boundaries overlay group per era. Pre-modern
  boundaries are drawn as **soft, fuzzy zones of influence**, never crisp modern-style borders
  — that is both historically honest and diplomatically wise.

### Boundary depiction — decided

**The app uses the Survey of India depiction everywhere.** Not "for users in India" — there
is one map, and this is it. **Jammu & Kashmir is shown whole**, as India depicts it. No
region-varying geometry, no per-locale swap, no dotted "disputed" hatching: a single
depiction is simpler to build, simpler to review, and the only version that is legal in the
largest market this product will ever have.

The rules that follow from it:

1. One geometry set, shipped to every user, in every locale.
2. **Pre-modern boundaries on the time slider stay soft zones of influence**, never crisp
   modern borders. An empire's reach is a gradient, and drawing it as a hard line is both bad
   history and an invitation to argument.
3. **Never animate or gamify a boundary.** No borders that draw themselves, pulse, get
   conquered, get captured, or move as a reward. Boundaries are undramatised background, not
   a mechanic.
4. The depiction is reviewed before launch, and the reviewer's sign-off is recorded.

### Known geometry gaps *(in the shipped data, needing better source geometry before launch)*

The current SVG geometry predates several changes and has one placeholder. These are data
problems, not policy problems, and they are all visible to any Indian parent in about four
seconds:

| Gap | Why | Fix |
|---|---|---|
| **Telangana is still inside Andhra Pradesh** | The source geometry predates the 2014 bifurcation | Source or cut a boundary between Telangana and Andhra Pradesh; Hyderabad's tagging follows |
| **Ladakh is not split out of J&K** | The source geometry predates the 2019 reorganisation | Split Ladakh as its own UT while keeping J&K whole per the depiction above |
| **Lakshadweep is drawn as a marker** | No island geometry in the source | Real island geometry, or an inset panel — small islands are not legible at national zoom either way |

Until these are fixed, the states-and-UTs count in [02](02-curriculum.md#pillar-4--bhugol--geography)
(28 + 8) is not what the map actually draws. Fixing them is a Phase 0/1 content-data task,
not a rendering task.

## 8. Privacy & compliance

A paid children's product with a global audience. Non-negotiable, and cheaper to build in
than to retrofit.

- **Only the parent has an account.** Children are profiles: first name (or nickname) and an
  **age band**, never a birthdate. No child email, photo, location or free text.
- **COPPA** (US, under 13) — verifiable parental consent, no behavioural profiling of
  children, no third-party ad SDKs.
- **UK Age Appropriate Design Code / GDPR-K** — high-privacy defaults, no nudge techniques,
  no engagement dark patterns.
- **India's DPDP Act 2023** — verifiable parental consent for **under-18s**, and an explicit
  prohibition on tracking, behavioural monitoring and targeted advertising directed at
  children. This is stricter than COPPA on age and is easy to trip.
- **No ads. No third-party trackers in the child experience.** Analytics are
  product-analytics only, on the parent surface and on anonymised child events.
- **Data minimisation as architecture**: if a field isn't needed to run the ladder, don't
  store it.
- Signed **DPAs** with Supabase, Stripe, the CDN and the POD partner. Privacy policy, terms
  and the consent flow reviewed by a lawyer before charging anyone.
- One-tap **export** and **delete** of everything a family has, including voice recordings.

## 9. Testing & release

- `node --check` on every module; ESLint; a schema validator for every content JSON in CI —
  **content bugs are the likely failure mode here, not code bugs**.
- Playwright headless smoke: boot, create a profile, run each Mela engine and each saga
  engine, assert no page errors — the same harness Bizzing Bee already uses.
- Content lint: every object has a badge; every Itihaas/Dharma object has `sources[]` and a
  reviewer; no `needs_review: true` reaches production.
- Cache-busting on every deploy (Bizzing Bee's `?v=` stamp discipline) plus a
  `content_version` bump when content changes.
- Feature flags via PostHog for staged rollout of the paywall and new pillars.
