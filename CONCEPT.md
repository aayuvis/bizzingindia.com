# Bizzing India — Product Concept

> **One line:** A story-first web app that teaches Indian kids aged 4–12 — especially kids
> growing up outside India — the history, faiths, myths, geography and Hindi language of
> India, through a living map, folk-art worlds and a saga about memory.

**Domain:** bizzingindia.com · **Family:** the second app in the Bizzing family, after
[Bizzing Bee](https://github.com/aayuvis/Bizzing-Bee) (spelling, ages 8–15).

---

## 1. Why this exists

Bizzing India has **three jobs**, and every feature should serve at least one:

| # | Job | How the product does it |
|---|---|---|
| 1 | **Be the growth engine for the Bizzing family** | Free, shareable, emotionally irresistible cultural content that diaspora parents pass to other diaspora parents. Cross-sells Bizzing Bee (English spelling) to the same household. |
| 2 | **Sell a language subscription** | Hindi is the paid pillar — a real, structured, Devanagari-first program that replaces or supports weekend Hindi school. |
| 3 | **Sell books** | Every story in the app has a printed counterpart. Plus a print-on-demand *Yatra Yearbook* generated from the child's own year of learning. |

The strategic insight: **culture pulls, language pays, books compound.** Give the culture
away generously — it is the marketing. Charge for the thing parents already pay tutors for.

---

## 2. Who it's for

**Primary — the diaspora child (US, Canada, UK, UAE, Australia, Singapore), ages 4–12.**
Their parent's real fear is not "my child won't know history" — it's *"my child won't be
able to talk to their grandmother, and won't know where they come from."* That fear is the
product's centre of gravity.

**Secondary — India's urban English-medium households.** Same content, different framing
(supplement + screen-time-you-don't-feel-guilty-about), and radically different price.

**The buyer is always the parent; the user is always the child.** Two different products in
one: a delightful world for the kid, a legible progress story for the parent.

### The 4–12 age span is the hardest constraint

It is too wide for one interface. Bizzing India ships **two front doors** off one content
spine:

- **Chhote Mode (4–7)** — audio-first, no reading required, tap-and-listen, 3-minute
  sessions, big art, no timers, no losing. Grown-up-optional.
- **Bade Mode (8–12)** — reading, maps, timelines, quizzes, mastery ladders, streaks,
  competition with self, Devanagari.

Same stories, same map, same art — different depth and different verbs. Mode is set at
profile creation from age and can be switched by the parent.

---

## 3. The five pillars

| Pillar | Hindi name | Free / Paid | What it is |
|---|---|---|---|
| History | **Itihaas** | Free core, Premium depth | Indus Valley → Vedic → Mahajanapadas → Maurya → Gupta → the Souths (Chola, Pallava, Vijayanagara) → Sultanates → Mughals → Marathas & Sikhs → colonial era → freedom movement → modern India |
| Faiths | **Dharma** | Free | Hinduism, Buddhism, Jainism in depth — beliefs, festivals, texts, places, people, ideas. Sikhism and India's other living faiths covered respectfully at survey level |
| Mythology | **Kathayein** | Free | Ramayana, Mahabharata, Puranic tales, Jataka tales, Jain legends, Panchatantra, and regional folk tales |
| Geography | **Bhugol** | Free core, Premium depth | States & capitals, rivers, mountains, monsoon, wildlife, monuments, food, festivals, language map |
| **Hindi** | **Bhasha** | **Premium only** | Varnamala → matras → reading → vocabulary → conversation → writing Devanagari |

**Mythology is deliberately the front door.** A 5-year-old will sit still for Hanuman
leaping to Lanka; nobody's 5-year-old asks for the Gupta empire. Stories earn the attention
that history, geography and language then spend.

Full scope & sequence: [`docs/02-curriculum.md`](docs/02-curriculum.md).

---

## 4. The world and its story

### Mascots

- **Mithu** — a green ring-necked parakeet. The storyteller. Fast, funny, a bit of a
  show-off. (Descends from the parrot-narrator that runs through Indian storytelling, from
  the Shuka of the Puranas to Tota-Maina folk tales.) Mithu tells every katha.
- **Gattu** — an elephant calf. The **memory keeper**. Gattu is the child's avatar-companion
  and grows/decorates as the child learns. An elephant never forgets — that's the whole point.
- **Vismriti, the Forgetting** — the antagonist. Not a demon, not a villain from anyone's
  religion, deliberately: a grey mist that creeps across the map and erases stories, place
  names, monuments and words. Neutral by design, so no faith's iconography is cast as evil.

### The Saga — *"Gattu & the Great Forgetting"*

The narrative spine, mirroring Bizzing Bee's *"Bizzy & the Great Unspelling."* The
Forgetting is swallowing India's memory. Gattu and Mithu travel the map and the centuries
to recover lost stories; every chapter recovered pushes the mist back and re-colours a
piece of the map. Six acts, ~30 chapters, each chapter a playable engine plus dialogue.

Structurally this is the same machine as Bizzing Bee's saga (acts → chapters → engines →
scripts), so the engine work is portable.

### Three signature visuals

1. **The Living Map** — the home screen *is* a map of India that starts grey and fills in as
   the child learns. States colour, rivers start flowing, monuments rise, festivals light up
   on their dates. It is simultaneously the navigation, the progress bar, and the geography
   curriculum. (Bizzing Bee's signature is "the hero word on stage"; this is ours.)
2. **The River of Time (Kaal Nadi)** — history rendered as a river the child sails down, with
   eras as bends and evidence washing up on the banks.
3. **The Story Tree (Katha Vriksha)** — a banyan with stories hanging from its aerial roots;
   the mythology hub, told the way stories actually were told: under a tree.

### Worlds = real Indian folk-art styles

Bizzing Bee sells cosmetic "worlds" (themes) in its shop. Here the worlds are **authentic
regional art traditions**, each a full re-skin *and* a small lesson about the art form and
where it comes from:

**Madhubani** (Bihar) · **Warli** (Maharashtra) · **Pattachitra** (Odisha) · **Gond** (Madhya
Pradesh) · **Kalamkari** (Andhra) · **Phad** (Rajasthan) · **Mughal Miniature** ·
**Tanjore** (Tamil Nadu) · **Kalighat** (Bengal)

Every world credits the tradition and, where art is commissioned, the named artist. This is
the single biggest visual differentiator available to this product and it is not
decoration — it is content.

---

## 5. How the app is structured

Bizzing India reuses Bizzing Bee's proven shape. The mapping is close to 1:1:

| Bizzing Bee | Bizzing India |
|---|---|
| Spellbound Journey (Word → Set → Level → Champ) | **The Yatra** (Story → Padav → Level → Yatri rank) |
| Saga: *Bizzy & the Great Unspelling* | **Saga: *Gattu & the Great Forgetting*** |
| Arcade (6 games) | **The Mela** (carnival of mini-games) |
| Concepts (121 in 11 chapters) | **Gyan Cards** — illustrated concept decks per pillar |
| Word Coach | **Bhasha Coach** — the Hindi trainer (Premium) |
| Theme Journeys (50+ themes) | **Trails** — rivers, dynasties, festivals, monuments, animals, foods |
| Coins 🪙 + Shop | **Kauris** 🐚 + the **Bazaar** |
| Themes / worlds | Folk-art worlds (above) |
| 🔥 Daily streak | 🪔 **Diya streak** — light a lamp a day; a full rangoli at 7, a festival at 30 |
| Rank ladders per theme | Gurukul ladder: Shishya → Vidyarthi → Sadhak → Khoji → Pandit → Vidwan → Acharya → Rishi |
| Parent dashboard + weekly report | **Parents** — activity log, what-they-learned report, printables |

Full screen map and mechanics: [`docs/03-app-structure.md`](docs/03-app-structure.md).

### One thing Bizzing Bee doesn't have: **Nani-Nana Stories**

A grandparent (or any family member, anywhere in the world) gets a link, records
themselves telling a story or reading a Hindi word list, and it appears in the child's app
in their own voice. It costs almost nothing to build, it is the most emotionally loaded
feature in the product, and it is the reason a parent forwards the app to three cousins.
This is the growth loop.

---

## 6. Katha vs Itihaas — the editorial spine

The product teaches both **mythology** and **history**, to children, about traditions people
hold sacred and about a past people argue over. That demands an explicit editorial stance,
built into the UI rather than buried in a policy page.

**Every card in the app carries one of three badges:**

- 🪔 **Katha** — a story as it is told. Told with love, told as the tradition tells it.
- 📜 **Itihaas** — what evidence shows, with the evidence named (this inscription, this
  excavation, this text) and uncertainty stated plainly.
- 🧭 **Aaj** — how it lives today: the festival your family actually celebrates.

Kids are entirely capable of holding "this is a beautiful story" and "this is what we can
show" at the same time — but only if adults stop blurring them. Making the distinction a
visible, cheerful piece of UI is both honest and genuinely good pedagogy.

Faiths are presented **as their adherents understand them**, never comparatively ranked.
Hard subjects (caste, invasions, colonial famines, Partition) are gated by age band and
handled at 11–12 with care, not erased. Sourcing, review board and the full policy:
[`docs/05-editorial-policy.md`](docs/05-editorial-policy.md).

---

## 7. Business model

**Free** — the whole cultural spine at explore depth: mythology, faiths, the map, the saga's
first act, two folk-art worlds, the Mela. Enough that a parent would recommend it having
never paid.

**Bizzing India Plus** — the Hindi program in full, mastery ladders and Levels past 5 on
every pillar, all folk-art worlds, offline downloads, printables, and the parent report.

| Market | Monthly | Annual (family, up to 4 kids) |
|---|---|---|
| Diaspora (US/CA/UK/AU/AE/SG) | $7.99 | **$59** — includes one printed book shipped |
| India | ₹299 | **₹1,999** |

**Bizzing Family Pass** — Bizzing India + Bizzing Bee, one price, one login, one parent
dashboard. This is the cross-sell, and it is the reason both apps should share an account
system from day one.

**Books** are the third leg: a Katha story series, Hindi Varnamala workbooks (the thing
diaspora parents already buy), map-and-monument activity books, personalised books starring
the child's own Gattu, and the auto-generated **Yatra Yearbook**. Print-on-demand, no
inventory. Every book carries a QR that unlocks its audio in the app; every story in the app
carries a "read it in print" card. Detail: [`docs/06-commerce-and-books.md`](docs/06-commerce-and-books.md).

---

## 8. Technology, briefly

Start where Bizzing Bee is *heading*, not where it is — its
[COMMERCIALIZATION.md](https://github.com/aayuvis/Bizzing-Bee/blob/main/COMMERCIALIZATION.md)
roadmap is this app's day-one architecture:

- **Vanilla ES modules + Vite + PWA.** Same idiom as Bizzing Bee (no framework tax, the team
  is already fluent), but modular and built from the start. Offline-first — essential for
  car rides, flights to India, and patchy connections.
- **Supabase** (Postgres + Auth + RLS) — parent-only accounts, children as non-authenticating
  profiles. **Stripe** for subscriptions.
- **Content as versioned JSON + CDN**, so stories, chapters and Hindi lessons ship without a
  redeploy. Content is the product here; the pipeline matters more than it did for word lists.
- **Shared design-system package** with Bizzing Bee (`ds-src` — tokens, icons, avatars).
- **Audio is a first-class asset**: English narration (US + UK), Hindi narration by human
  voice for anything a child will imitate, TTS only for bulk vocabulary.
- **Child-privacy law is a design constraint, not a footnote**: COPPA (US), GDPR-K (EU/UK),
  and India's DPDP Act 2023 — which requires verifiable parental consent for under-18s and
  bars behavioural tracking and targeted advertising at children. No ads, ever. Minimal child
  data by construction.

Detail: [`docs/07-tech-architecture.md`](docs/07-tech-architecture.md).

---

## 9. What to build first

**MVP (the "would a parent forward this?" test) — one pillar deep, not five shallow:**

1. The Living Map home screen, grey → colour.
2. **Mythology**, 30 stories, narrated, illustrated in two folk-art worlds.
3. Saga Act 1 (5 chapters) with three playable engines.
4. Chhote/Bade mode split.
5. Parent account, child profiles, kauris, diya streak.
6. **Nani-Nana Stories.**
7. One book listed, one printable pack, a Bizzing Bee house ad.

**Then:** Hindi Varnamala + paywall + Stripe (this is when the business starts) → geography
and the states → history and the River of Time → faiths → the Mela → the Yearbook.

Phasing, milestones and success metrics: [`docs/08-roadmap.md`](docs/08-roadmap.md).

---

## 10. The bet

Every competitor in this space is either a **YouTube channel** (passive, ad-driven, no
progress), a **worksheet PDF store** (joyless), or a **weekend Hindi class** (expensive,
inconvenient, hard to sustain). None of them gives a diaspora child a *place* — a world with
their own name in it, that remembers what they learned, that their grandmother can speak
into from eight thousand miles away.

That's the gap. The map is the product.

---

### Documents

| Doc | Contents |
|---|---|
| [01 — Product Strategy](docs/01-product-strategy.md) | Audience, jobs-to-be-done, positioning, competition, growth loops |
| [02 — Curriculum](docs/02-curriculum.md) | The five pillars, scope & sequence by age band |
| [03 — App Structure](docs/03-app-structure.md) | Screen map, mechanics, saga, Mela games, economy |
| [04 — Design Language](docs/04-design-language.md) | Identity, folk-art worlds, tokens, mascots, motion |
| [05 — Editorial Policy](docs/05-editorial-policy.md) | Katha vs Itihaas, faiths, hard topics, sourcing, review |
| [06 — Commerce & Books](docs/06-commerce-and-books.md) | Pricing, paywall design, the book funnel, cross-sell |
| [07 — Tech Architecture](docs/07-tech-architecture.md) | Stack, content pipeline, data model, offline, privacy |
| [08 — Roadmap](docs/08-roadmap.md) | Phases, MVP, metrics, risks |
