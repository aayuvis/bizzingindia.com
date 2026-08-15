# 01 — Product Strategy

## 1. The three jobs, ranked

Bizzing India is not primarily an education product that happens to make money. It is a
**growth and commerce vehicle that earns its audience by being a genuinely good education
product**. The ranking matters when features compete:

1. **Acquire households into the Bizzing family.** Free cultural content is the top of the
   funnel for both apps. A household that installs Bizzing India is a qualified lead for
   Bizzing Bee (same parent, same values, overlapping ages).
2. **Convert to a Hindi subscription.** The only pillar behind the paywall, because it is
   the only pillar parents already pay real money for.
3. **Sell books.** The highest-margin, most gift-able, most grandparent-purchasable
   artefact, and the one that puts the brand on a shelf in a house rather than on a screen.

When a feature serves none of the three, it doesn't ship in year one no matter how charming.

## 2. Jobs-to-be-done

### The diaspora parent (primary)

> *"My daughter is seven. She was born here. She says 'Diwali is the one with the lights,
> right?' She can't talk to my mother. I have twenty minutes on a Tuesday and no idea where
> to start."*

Functional job: **teach my child about India without me having to be the teacher.**
Emotional job: **stop feeling like I'm failing at passing something on.**
Social job: **have something to show the grandparents that proves it's working.**

That third job is under-served by everyone and it is why the parent report and the
Yatra Yearbook are commerce features, not admin features.

### The India-based parent (secondary)

> *"He gets an hour of screen time. I'd rather it wasn't brainrot."*

Functional job: **screen time I don't feel guilty about**, plus light school support
(history, geography, and Hindi are all in the syllabus). Emotional job: **pride**.
Price sensitivity is an order of magnitude higher. Same product, different price, different
copy, UPI payments.

### The child (4–12)

Wants: a good story, to be good at something, to be seen. Does not want: a lesson.
Every screen has to pass the *"would a kid choose this over a cartoon for the next three
minutes?"* test — which is why mythology leads and history follows.

## 3. Positioning

**For** Indian parents raising kids away from India (and Indian parents at home who want
better than brainrot), **who** worry their children are losing the thread, **Bizzing India
is** a story-first learning world **that** turns India's history, faiths, myths, geography
and Hindi into a map a child fills in themselves — **unlike** YouTube channels, PDF stores
and weekend classes, **because** it remembers what the child learned, it looks like Indian
art instead of generic cartoon, and it lets the family's own voices into the app.

### Competitive landscape

| Alternative | Strength | Where it leaves a gap |
|---|---|---|
| YouTube mythology channels | Free, infinite, genuinely loved | Passive, no progress, no parent visibility, ad-funded, algorithm decides what's next |
| Weekend Hindi / heritage school | Human teacher, community | Expensive, inconvenient, one time slot, high drop-off, nothing between sessions |
| Worksheet / PDF marketplaces | Cheap, printable | Joyless, no narrative, no audio, no retention |
| Kids' general edtech (Khan Kids, Duolingo etc.) | Polished, proven mechanics | No Indian cultural depth; Hindi where offered is thin and script-light |
| Story apps & audio (Tinkle, mythology audio apps) | Great content | Story-only — no language, no progression, no map, no commerce |

Nobody occupies **culture + language + progression + family voice + books** at once. That
combination is the moat, and it compounds: the more a child learns, the more personal the
map and the Yearbook become, and the harder it is to leave.

## 4. Growth loops

The paid-acquisition math for a $59/year kids' subscription is unforgiving. Bizzing India
should be built to grow on loops, not ads.

**Loop 1 — Nani-Nana Stories (the strongest).** Parent invites grandparents to record a
story. Grandparent installs nothing (web link, record, done) but now has a stake. Child
listens; parent shares the clip in the family WhatsApp group; two aunts ask what app that
is. *Every invite is a soft install prompt to an already-warm relative.*

**Loop 2 — The Yatra Yearbook.** At the end of a year (or a term), the app generates a
printable/orderable book of what this specific child learned, in the folk-art world they
chose, with their Gattu on the cover. Grandparents buy it. It arrives in India with a QR
code on the back.

**Loop 3 — Festival moments.** Diwali, Holi, Pongal, Onam, Navratri, Buddha Purnima,
Mahavir Jayanti, Independence Day, Republic Day. Each is a free, timely, shareable mini-unit
released the week before. This is the content calendar and the organic-search strategy in
one — diaspora parents search "explain Diwali to kids" every single October.

**Loop 4 — Bizzing Bee cross-sell.** House-ad cards inside Bizzing India ("your speller?"),
and vice versa, plus the Family Pass. Cheapest possible CAC: an existing customer.

**Loop 5 — Books to app, app to books.** QR in every book; a "read it in print" card on
every story.

## 5. Channel strategy

- **Organic search + festivals.** Publish the free festival units as public web pages
  (`bizzingindia.com/diwali-for-kids`) that are genuinely the best answer to the query, with
  the app as the call to action.
- **Diaspora community distribution** — temple and community-centre schools, Hindi weekend
  schools (offer them a free classroom tier — they are a channel, not a competitor), cultural
  associations, PTA groups.
- **WhatsApp-native sharing.** Every shareable artefact (a story clip, a report card, a
  festival card) must be one tap to WhatsApp. This is *the* diaspora distribution medium.
- **India: price, UPI, and school partnerships** — but only after the diaspora business
  works. Do not split focus early.

## 6. Success metrics

| Stage | Metric | Target signal |
|---|---|---|
| Activation | First story finished **and** first map tile lit, in session 1 | > 60% of new child profiles |
| Habit | Diya streak ≥ 7 days in first 30 | > 25% |
| Family loop | Households with ≥ 1 Nani-Nana recording | > 15% |
| Conversion | Free → Plus (Hindi trial start → paid) | > 5% of active households |
| Commerce | Book attach rate per paying household per year | > 0.4 |
| Cross-sell | Bizzing India households that install Bizzing Bee | > 10% |
| Retention | Annual subscription renewal | > 55% |

## 7. What we are deliberately *not* doing

- **No ads.** Legally fraught for children (DPDP Act 2023 bars targeted advertising to
  minors outright) and strategically wrong — it would compete with the subscription.
- **No user-generated public content.** Family voice notes are private to the household.
  Moderating child-facing UGC at this scale is not a business we want.
- **No AI chat companion for children** in v1. Cannot be made safe enough for a 5-year-old
  cheaply, and it undermines the "every word here was written by a human who checked it"
  editorial promise, which is the whole trust proposition on this subject matter.
- **No app-store launch in v1.** Web + PWA first, per Bizzing Bee's roadmap — avoids the
  15–30% cut while the subscription price is being discovered.
- **Not all five pillars at once.** See [08 — Roadmap](08-roadmap.md).
