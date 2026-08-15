# 08 — Roadmap

## Sequencing principle

**One pillar deep beats five pillars shallow.** A parent decides whether to keep the app on
the first story, not on the breadth of the menu. Ship mythology properly, then let the map
pull the other pillars in behind it.

The second principle: **build the money before building the library.** The Hindi paywall
should exist while there are only three Hindi stages, so pricing, conversion and the trial
flow are learned on a small content bet rather than a large one.

---

## Phase 0 · Foundations *(before any content)*

The decisions that are expensive to reverse.

- Business entity, Stripe account, Supabase project, domain, CDN.
- **Legal**: privacy policy, terms, parental-consent flow reviewed by a lawyer for COPPA,
  GDPR-K and India's DPDP Act. DPAs with every vendor.
- **The content schema** — badges, tags, sources, age gates ([07](07-tech-architecture.md#5-content-pipeline)).
  Nothing gets commissioned before this is frozen.
- **The editorial policy signed off**, and the review board retained by name
  ([05](05-editorial-policy.md)).
- **Shared identity decision with Bizzing Bee**: one `profiles` table across both apps.
  Trivial now, expensive in a year.
- Art direction locked: Chitrakatha default + one folk world, artists commissioned.
- Map boundary depiction reviewed.

---

## Phase 1 · MVP — "would a parent forward this?" *(≈ 3–4 months)*

The smallest thing that produces a real emotional reaction.

**Ships:**
1. The **Living Map** — grey to colour, states layer, mist/lit states
2. **30 mythology stories** — narrated (EN), illustrated in two folk-art worlds, with
   comprehension beats
3. **Saga Act 1** — 5 chapters, 3 playable engines
4. **Chhote / Bade mode** split
5. Parent account, up to 2 child profiles, kauris, diya streak, Gattu
6. **Nani-Nana Stories**
7. 4 Mela games
8. One book listed, one free printable pack, one Bizzing Bee house ad

**Not in MVP:** payments, Hindi, history, geography depth, offline packs, Yearbook.

**Gate to Phase 2:** activation > 50% (first story finished *and* first tile lit in session 1),
day-7 retention > 30%, and ≥ 10% of households with a Nani-Nana recording. If the free
product doesn't produce those, more pillars won't fix it.

---

## Phase 2 · The business *(≈ 2 months)*

Turn on revenue while the content bet is still small.

- **Hindi stages 0–2** (Sunna, Varnamala, Matras) with human-recorded audio
- **Bhasha Coach** shell — Revise, Practice, heatmap, printable worksheets
- **Stripe** Checkout + Billing Portal + webhook → server-authoritative entitlements
- **Paywall**, 14-day trial triggered by the first Hindi lesson, parent gate
- **Parent report** — printable, WhatsApp-shareable
- Two more books; the QR bridge live in both directions
- Gift subscriptions **before the first Diwali after launch**

**Gate to Phase 3:** trial→paid > 25%, free→paid > 3%, and monthly churn < 8%.

---

## Phase 3 · The map fills in *(≈ 3 months)*

- **Bhugol** in full — rivers, monuments, wildlife, food, festivals, language map
- **Itihaas** — the River of Time, 6 eras, 50 anchor objects
- **Saga Acts 2–3**
- Folk-art worlds 3–6, Bazaar expanded
- Offline packs
- **Festival units** running as a standing content calendar (this becomes permanent)
- Community/temple-school free tier

---

## Phase 4 · Depth & the flywheel *(≈ 4 months)*

- **Dharma** in depth — the three named traditions plus Sikh depth and the wider weave
- **Hindi stages 3–5** (Shabd, Vakya, Baat-cheet) — the conversation payoff
- **Saga Acts 4–6** complete
- **The Yatra Yearbook** — auto-generated, print-on-demand
- Personalised books
- **Bizzing Family Pass** — shared login and dashboard with Bizzing Bee live
- The full Mela (12 games)

---

## Phase 5 · Reach *(12 months+)*

- **India launch** — INR pricing, UPI/Razorpay, India-first onboarding and copy
- **Hindi stages 6–7** (graded readers, writing)
- **Second language pack** — Tamil, Gujarati, Punjabi, Telugu or Bengali, chosen by measured
  demand, built on the same language engine. If the engine was built language-agnostic in
  Phase 2, this is a content project. If it wasn't, it's a rewrite — which is why
  [02](02-curriculum.md#pillar-5--bhasha--hindi-premium) calls that the highest-leverage
  technical decision in the product.
- Native app wrappers (Capacitor) + RevenueCat, if store distribution proves worth the cut
- School / heritage-programme licensing as a real line

---

## Metrics dashboard

Watch weekly from Phase 1:

| Metric | Phase 1 target | Phase 3 target |
|---|---|---|
| Activation (story + tile, session 1) | 50% | 65% |
| Day-7 retention | 30% | 40% |
| Diya streak ≥ 7 in first 30 days | 15% | 25% |
| Households with a family recording | 10% | 20% |
| Trial → paid | — | 30% |
| Free → paid | — | 5% |
| Book attach per paying household/yr | — | 0.4 |
| Bizzing Bee cross-install | — | 10% |

---

## Risks, and what to do about them

| Risk | Severity | Mitigation |
|---|---|---|
| **Content cost** — this product is a publishing house wearing an app | **High** | Interlocked tagging so one object serves 4 journeys; folk-art styles that are beautiful *and* cheaper than 3D; POD books with no inventory; commission in batches gated on retention |
| **Editorial backlash** on religion or history | **High** | The badge system, the named review board, the age gate, the corrections changelog. Treat [05](05-editorial-policy.md) as binding, not aspirational |
| **Map boundary depiction** → removal in India | Medium | Survey of India depiction for India; reviewed pre-launch; never animate a disputed boundary |
| **Hindi isn't the diaspora's language** — Tamil, Gujarati, Telugu, Punjabi, Bengali households | **High** | Language-agnostic engine from Phase 2; the culture pillars stay language-neutral; never imply Hindi = Indian |
| **Free tier too generous / not generous enough** | Medium | Hindi is the only hard paywall; tune Level-5 gates with flags, not rebuilds |
| **4–12 is too wide** | Medium | Chhote/Bade is a real fork, tested separately; if one band underperforms, narrow rather than compromise both |
| **Seasonality** — festivals drive spiky traffic | Low | Lean into it: the festival calendar *is* the content calendar and the acquisition plan |
| **Kids' subscription CAC exceeds LTV** | **High** | Growth loops over paid acquisition ([01](01-product-strategy.md#4-growth-loops)); annual-first pricing; the Family Pass |

---

## The one-sentence test

At every phase gate, ask: *would a diaspora parent send this to their sister?*
If the honest answer is no, the next phase is the wrong work.
