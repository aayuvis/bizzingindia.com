# 06 — Commerce & Books

Three revenue lines, in order of how soon they pay: **subscription**, **books**,
**cross-sell to Bizzing Bee**. Plus one strategic non-revenue line (schools) that feeds all
three.

---

## 1. What's free and what's paid

The rule from the concept: **culture pulls, language pays.**

### Free forever
- The Living Map, all layers, all states
- **All of Kathayein** at explore depth — every story, narrated, illustrated
- **All of Dharma** at survey depth
- Itihaas and Bhugol up to **Level 5** on each ladder
- Saga Act 1
- The Mela's non-Hindi games
- Two folk-art worlds (Chitrakatha + one)
- Nani-Nana Stories — *always free, it's the growth loop*
- One child profile
- Festival units, published free the week before each festival

### Bizzing India Plus
- **The entire language program, every pack** — Bhasha is the only pillar that is
  Premium-only, end to end, and Plus carries all of it ([09](09-language-engine.md))
- Levels past 5 on every ladder; Padav Challenges
- All folk-art worlds
- Saga Acts 2–6
- Offline downloads (audio + art) — matters enormously on flights and in the car
- Printables: worksheets, map outlines, craft sheets, colouring pages
- The parent report and activity log
- Up to 4 child profiles
- The **Yatra Yearbook** (annual, included with the annual plan)

The free tier has to be good enough that a parent who never pays still recommends it. If the
free tier feels like a demo, loop 1 dies and so does the business.

---

## 2. Pricing

| Market | Monthly | Annual (family, up to 4 children) |
|---|---|---|
| **Diaspora** — US, CA, UK, AU, AE, SG | **$7.99** | **$59** · *includes one printed book, shipped* |
| **India** | **₹299** | **₹1,999** |

**Bizzing Family Pass** — Bizzing India + Bizzing Bee: **$99/year** (India: ₹2,999). One
account, one parent dashboard, all children.

**One subscription, every language.** Plus includes **every language pack, present and
future** — Hindi, then Punjabi, then Gujarati, Telugu, Tamil, Bengali, Malayalam and the rest.
Never per-language, never a per-pack upgrade, never a bundle tier. Diaspora families are
routinely multilingual (Punjabi at home and Hindi for films; Tamil from one parent, Gujarati
from the other), so per-language pricing taxes exactly the households most committed to
language learning — and it converts every new pack from an upsell to a slice of the base into
a **retention event for all of it**. It is also the cleanest differentiator available:
*"every Indian language your family speaks, one price."* Price does not move as packs ship;
the value of the annual plan roughly doubles each time one does. Full argument:
[09](09-language-engine.md#7-pricing-one-subscription-every-language).

Notes on the shape:
- **Annual is the product.** Monthly exists to lower the first commitment; every surface
  pushes annual, and the shipped book is what makes annual feel like a purchase rather than a
  subscription.
- **Free trial: 14 days of Plus**, no card up front, triggered by the child's first Hindi
  lesson — not by a signup wall. Ask for money at the moment of demonstrated interest.
- **India pricing is a different product decision, not a discount.** Localised checkout with
  **UPI** and Razorpay alongside Stripe; a monthly-first market. Do not launch India pricing
  until the diaspora business works.
- **Gift subscriptions** — a first-class flow. Grandparents buy these. Ship it before the
  first Diwali after launch.
- **Community/temple-school tier** — free classroom accounts (up to 30 kids) for heritage
  schools. They are a distribution channel; giving them the product costs nothing marginal
  and puts the brand in front of exactly the right households.

---

## 3. Paywall design

The paywall is where a kids' app either earns trust or loses it. Rules:

1. **Never trap a child mid-story.** Anything a child starts, a child finishes. Gates sit at
   *entry* to a locked area, never mid-flow, and never mid-sentence.
2. **The gate speaks to the parent, not the child.** Locked areas show a child-facing "ask a
   grown-up" card; the actual pitch, price and checkout live behind a parent gate (a simple
   arithmetic challenge, as is standard for kids' apps).
3. **Kauris can unlock cosmetics and some content, never the Hindi program.** Bizzing Bee
   already models "anything can be earned with coins"; keep that generosity for worlds and
   stories, and keep the language program a genuine purchase.
4. **Entitlements are server-authoritative.** Read from the database via RLS, never from a
   client flag — the mistake Bizzing Bee's COMMERCIALIZATION.md explicitly calls out.
5. **Cancel is easy and obvious.** Stripe Billing Portal, one tap from Parents. Making cancel
   hard destroys the word-of-mouth this business runs on.
6. **Downgrade is graceful.** A lapsed household keeps its map, its progress, its Nani-Nana
   recordings and its free content forever. Nothing a family made is ever held hostage.

---

## 4. Books

The third leg, and the one that compounds: it puts the brand on a shelf, it's giftable, and
grandparents in India will buy it when they won't buy a subscription.

### Line 1 — The Katha Series *(the core)*
Illustrated story books straight from the app's mythology pillar, in the folk-art worlds.
- *Ramayana for Little Ones* (4–7) · *The Ramayana* (8–12)
- *Mahabharata* · *Jataka Tales* · *Stories of Mahavira* · *Panchatantra* ·
  *Tales from Every State*
- Each in English, with a Hindi edition and a bilingual edition

### Line 2 — Workbooks *(the reliable seller)*
Diaspora parents **already buy these**. This is the lowest-risk revenue in the plan.
- *Hindi Varnamala Writing Workbook* — stroke order, tracing, dictation
- *Matras & Barakhadi Practice*
- *Gurmukhi Writing Workbook* and *Punjabi Matras & Barakhadi Practice* — the same two
  titles against pack #2's script. One workbook pair per language pack, generated from the
  same stroke-path data the app traces with; the print list grows with the language list
- *My Map of India* — colouring, labelling, sticker activity book
- *Monuments of India* activity book
- *Festival Craft Book* — one craft per festival, per month

### Line 3 — Personalised books *(the margin)*
Print-on-demand with the child's name and their own Gattu in the illustrations.
- *[Name] and the Great Forgetting* — the saga, starring the child
- *[Name]'s Ramayana*

### Line 4 — The Yatra Yearbook *(the retention engine)*
Auto-generated at the end of each subscription year from the child's actual data: the states
they lit, the stories they read, the Hindi they learned, their Gattu, their chosen art world,
their best moments — laid out as a real hardback. Included with the annual plan (extra copies
purchasable, and grandparents buy extras).

This is simultaneously a renewal argument, a gift, a growth artefact and a book sale. It is
the highest-leverage single item in this document.

### Fulfilment
**Print-on-demand, no inventory** — Amazon KDP and Lulu/Blurb for US/UK/EU/AU, Pothi or a
local POD partner for India. Start with 3 titles and prove attach rate before commissioning a
list. PDF/printable versions sell immediately at near-zero cost and validate demand before
any print run.

### The QR bridge — the loop that makes books strategic
- **Every book carries a QR**: opens that story's narration and art in the app. A book bought
  by a grandparent in Pune installs the app for a child in Toronto.
- **Every story in the app carries a "read it in print" card** at its end.
- **Every printable worksheet** carries the workbook's cover in the footer.

Books and app each acquire for the other. Neither is a side business.

---

## 5. Cross-sell to Bizzing Bee

The cheapest customer acquisition available to either product.

- **House-ad cards** in Bizzing India, placed where they're relevant, not everywhere: after a
  strong reading performance, in the Parents area, in the Hindi pillar ("she's reading
  Devanagari — how's her English spelling?").
- **Shared account.** One parent login across both apps, one dashboard listing both children's
  progress. This must be true from day one — retro-fitting shared identity later is expensive
  and Bizzing Bee's Supabase migration is the moment to do it.
- **Family Pass** as the headline bundle.
- **Age hand-off:** Bizzing India tops out at 12, Bizzing Bee runs 8–15. A child ageing out of
  one has an obvious next home. Design the hand-off explicitly — a "graduation" moment beats a
  churn event.

---

## 6. Twelve-month revenue sketch

Illustrative, to size decisions — not a forecast.

| Line | Assumption | Year 1 |
|---|---|---|
| Subscriptions | 4,000 paying households, 65% annual, blended ~$52 | ~$208k |
| Books | 0.4 attach × 4,000 paying + free-tier buyers, ~$9 margin | ~$25k |
| Family Pass uplift | 10% of subscribers, +$40 | ~$16k |
| **Total** | | **~$250k** |

The sensitivity that matters most is not price — it is **free-tier reach**. At a 5%
conversion rate, 4,000 paying households requires ~80,000 active free households, which is
why the festival content, Nani-Nana loop and community-school channel are funded work, not
marketing garnish.
