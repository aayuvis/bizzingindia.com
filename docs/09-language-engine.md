# 09 — The Bhasha Engine: a language platform for India

> **Decision (Aug 2026):** the language layer is built **language-agnostic from day one**.
> Hindi is the first pack, not the product. The ambition is *Duolingo for Indian languages* —
> aimed at the learner Duolingo serves worst.

This changes the shape of the business. The culture pillars remain the acquisition engine and
the context; the **language platform becomes the revenue engine**, and it is potentially
larger than the app it started inside.

> **Where the build actually stands:** this document is the architecture and the business
> case. For the audited state of the engine as built — measured content coverage per pack,
> the four capability gaps, and the phase plan that closes them — see
> **[12 — Bhasha: where the Hindi engine actually stands](12-bhasha-state-and-phases.md)**.
>
> Note that the **Phase 2–5 in [§8](#8-what-this-does-to-the-roadmap) below is a language
> rollout schedule** — which languages ship when. The engine phases in 12 are lettered A–G
> precisely so the two cannot be confused again; they already were once.

---

## 1. Why this is tractable — the abugida insight

Indian languages look like eleven separate products. Structurally they are close to **one
product with eleven skins**, because almost every Indian script is an **abugida**:

> a base consonant carries an inherent vowel, and vowel signs (*matras*) attach around it —
> above, below, before, after — to change it. Consonants combine into conjuncts.

That single sentence describes Devanagari, Gurmukhi, Gujarati, Bengali-Assamese, Odia,
Telugu, Kannada, Malayalam and (with real differences) Tamil. The **barakhadi grid** — every
consonant × every vowel sign — is the core teaching object in all of them.

So the pedagogy that teaches क → का → कि → की teaches ਕ → ਕਾ → ਕਿ → ਕੀ and క → కా → కి → కీ.
**Build the grid engine once, feed it script data.** That is the whole technical thesis.

Where the abstraction must not over-reach:
- **Tamil** is genuinely different — a smaller consonant set with no aspirated/voiced
  distinction, plus *grantha* letters for loanwords. It also has strong **diglossia**: spoken
  Tamil and literary Tamil differ enough that teaching only one fails the learner. The engine
  must support a spoken track and a written track that don't perfectly mirror.
- **Malayalam** has dense conjuncts and an old/new orthography split.
- **Urdu** is Perso-Arabic, right-to-left, cursive, with heavy contextual shaping — a
  different engine mode, not a different pack. Deliberately later.
- **Hindi and Urdu are the same spoken language in two scripts.** That's a feature: one audio
  library, two script tracks. Ship it as such when Urdu lands.

## 2. Script modules ≠ language packs

The key separation. **One script module can serve several languages**, so the engineering
cost is sublinear in the language count.

| Script module | Languages it unlocks |
|---|---|
| **Devanagari** | Hindi, Marathi, Nepali, Konkani, Sanskrit |
| **Gurmukhi** | Punjabi |
| **Gujarati** | Gujarati |
| **Bengali–Assamese** | Bengali, Assamese |
| **Odia** | Odia |
| **Telugu** | Telugu |
| **Kannada** | Kannada |
| **Tamil** | Tamil |
| **Malayalam** | Malayalam |
| **Perso-Arabic (Nastaliq)** | Urdu, Kashmiri |

Nine modules cover fifteen-plus languages, and the first four cover the overwhelming majority
of the diaspora.

### Script module spec

```json
{
  "id": "gurmukhi",
  "direction": "ltr",
  "headline": false,                    // Devanagari/Bengali have shirorekha; Gurmukhi's differs
  "vowels":     [ {"char":"ਅ","name":"aira","audio":"…"} ],
  "consonants": [ {"char":"ਕ","name":"kakka","inherent":"a","group":"velar","audio":"…"} ],
  "matras":     [ {"sign":"ਾ","vowel":"aa","position":"right","audio":"…"} ],
  "conjuncts":  { "rules": "…", "hard_cases": ["ਕ੍ਰ","ਪ੍ਰ"] },
  "numerals":   ["੦","੧","੨"],
  "strokes":    "strokes/gurmukhi.json",   // per-glyph stroke paths for tracing
  "font":       {"family":"Noto Sans Gurmukhi","minSize":17,"lineHeight":1.7},
  "notes":      "Script of the Guru Granth Sahib — interlocks with the Dharma pillar"
}
```

### Language pack spec

```json
{
  "id": "pa",
  "name": {"en":"Punjabi","native":"ਪੰਜਾਬੀ"},
  "script": "gurmukhi",
  "phonology": { "inventory": [], "tones": true },   // Punjabi is tonal — most Indian languages aren't
  "transliteration": "iso15919+kid",
  "lexicon": "packs/pa/words.json",                  // 1,000 core words, themed, shared theme IDs
  "grammar": "packs/pa/stages.json",                 // stages 4–5 progression
  "audio":   {"voice":"human","artist":"…","manifest":"packs/pa/audio.json"},
  "diglossia": null,                                 // Tamil sets this
  "reviewed_by": ["lang-pa-01"]
}
```

**Everything else is shared**: the ladder, spaced repetition, the heatmap, the coach shell,
exercise types, printables, the parent report. Adding a language is a **content project with
a linguist and a voice artist**, not an engineering project.

## 3. The learner Duolingo misses

Duolingo is built for an adult starting from zero with no connection to the language. The
diaspora child is the opposite on every axis, and that gap is the product:

| | Duolingo's learner | Ours |
|---|---|---|
| Age | Adult | 4–12 |
| Starting point | Zero | **Understands spoken language at home, can't read a word** |
| Motivation | Travel, hobby, streak | Talking to grandparents; belonging |
| Script | Romanised, script secondary | **Script is the whole point** — it's what parents can see |
| Context | Invented sentences about owls | Stories, festivals, family, the culture pillars |
| Failure | Hearts, guilt streaks | No punishment mechanics. Ever |
| Who buys | The learner | The parent |

**The heritage path is the differentiator and almost nobody builds it.** A child who already
knows what *paani* means does not need a lesson teaching them *paani = water*; they need to
learn that it is written ਪਾਣੀ / पानी and to read it. Every pack ships two entry paths:

- **Heritage** — ear is ahead of eye. Skip the meaning, go straight to script and reading.
  Vocabulary drawn from what's actually spoken at home: food, family, the body, the house,
  instructions a parent gives.
- **Beginner** — no exposure. Ear first (Stage 0), then script.

A three-question placement at profile creation ("Does anyone speak this at home? Does your
child answer back? In which language?") routes the child, and the paths converge by Stage 4.

## 4. What we take from Duolingo, and what we refuse

**Take:** bite-size lessons, immediate feedback, spaced repetition, a visible ladder, a daily
habit, one clear next thing to do.

**Refuse:**
- **Hearts, lives, and any mechanic that punishes failure.** A 6-year-old learning their
  grandmother's script must never be told they've run out of chances.
- **Guilt streaks.** The diya streak celebrates showing up; it never shames missing a day.
  (Bizzing Bee's streak already works this way — keep it.)
- **Ads.** Illegal to target at children under India's DPDP Act 2023 and wrong regardless.
- **Romanised-forever.** Script from the start is the outcome parents pay for.
- **Invented context.** Sentences come from the stories, festivals and places in the culture
  pillars. The language is taught inside things the child already cares about.

**Accept honestly:** Duolingo has brand, free-tier scale, and much better speech recognition
than we will have for years. We are not competing for adults, and we shouldn't try.

## 5. Input design — the decision that makes this work for kids

**Do not require typing.** Indic keyboards on a shared family tablet are a wall: IME setup,
transliteration modes, a parent who has to configure it. Every one of those is a place a
7-year-old quits.

The engine's exercise types are **script-parametric and typing-free**:

| Exercise | What it drills | Works in every script |
|---|---|---|
| **Trace** | Stroke order, letter form | Stroke paths from the script module |
| **Matra attach** | Drag a vowel sign onto a base letter | The core abugida skill |
| **Barakhadi grid** | The consonant × vowel matrix | The core drill in every Indian script |
| **Sound match** | Hear it → tap the letter/word | Audio-first, works pre-literacy |
| **Word build** | Assemble a word from letter tiles | Replaces typing entirely |
| **Read aloud** | Show the word, child says it | Parent or self-verify; ASR optional, never required |
| **Conjunct split** | Break क्ष into its parts | The hardest reading skill, made visual |
| **Odd one out** | Sound families, vowel length | Discrimination |
| **Listen & point** | Stage 0, no reading | Chhote mode |

Typing is offered as an *option* for older kids, never as a requirement. Handwriting via
tracing is better pedagogy anyway, and it's what turns directly into the printable workbook
business.

## 6. Language sequencing

Order by **diaspora concentration × heritage-anxiety × community-school density**, not by
speaker count in India.

| # | Language | Script | Why this order |
|---|---|---|---|
| 1 | **Hindi** | Devanagari | Largest single audience; the pack that proves the engine |
| 2 | **Punjabi** | Gurmukhi | The strongest case after Hindi: dominant South Asian language in Canada, huge in UK and Australia, intense heritage-language concern, dense community-school network — **and it interlocks directly with the Sikh pillar**, since Gurmukhi is the script of the Guru Granth Sahib. A Sikh family gets faith and language reinforcing each other |
| 3 | **Gujarati** | Gujarati | Very large in the UK and US, long-established community infrastructure |
| 4 | **Telugu** | Telugu | Fastest-growing Indian language in the US, and the families are young — children are *exactly* in the 4–12 band right now |
| 5 | **Tamil** | Tamil | Singapore, Malaysia, Sri Lankan diaspora in Canada/UK, strong US presence. Existing Tamil-school networks are a channel. Needs the diglossia work |
| 6 | **Bengali** | Bengali–Assamese | UK and US; Assamese comes nearly free afterwards |
| 7 | **Malayalam** | Malayalam | The Gulf, plus the US healthcare diaspora |
| 8+ | Marathi, Kannada, Odia, Assamese, Urdu | Devanagari / Kannada / Odia / Bengali–Assamese / Perso-Arabic | Marathi is near-free (Devanagari already built). Urdu is a separate engine mode |

**Sanskrit** is worth noting as a later, high-margin oddity: no diaspora "heritage speaker"
segment, but real demand from temple schools and from parents wanting shloka literacy, and it
runs on the Devanagari module already built.

## 7. Pricing: one subscription, every language

The single most important commercial consequence of going language-agnostic.

**Bizzing India Plus includes every language pack, present and future.** Not per-language.

Why this is right, not generous:
- Diaspora families are routinely **multilingual** — Punjabi at home and Hindi for films;
  Tamil from one parent, Gujarati from the other. Per-language pricing taxes exactly the
  households most committed to language learning.
- It converts every new pack into a **retention event for the whole base** rather than an
  upsell to a slice of it.
- It's a clean, memorable differentiator: *"every Indian language your family speaks, one
  price."* Nobody else can say that.
- It makes the marginal cost of a new pack a content cost, recovered across the whole base.

Pricing itself doesn't move ([06](06-commerce-and-books.md#2-pricing)) — $59/yr family,
₹1,999 in India. The value of the annual plan roughly doubles each time a pack ships.

## 8. What this does to the roadmap

The language platform is now a parallel track, not a phase-5 nice-to-have.

- **Phase 2** — Hindi stages 0–2 ship **on the engine**, with the script module and language
  pack already separated. Slightly more work now; it is the whole bet.
- **Phase 3** — **Punjabi/Gurmukhi as pack #2**, shipped alongside the Sikh pillar so they
  launch as one story. This is the proof that the engine generalises, and it should happen
  early enough that finding out it *doesn't* is still cheap.
- **Phase 4** — Gujarati and Telugu. Two packs in one phase is the test of whether pack
  production is genuinely a repeatable content pipeline.
- **Phase 5** — Tamil (with diglossia), Bengali, Malayalam; Urdu engine mode.

**The gate that matters:** if pack #2 takes more than ~30% of the effort of pack #1, the
engine is not actually language-agnostic and that must be fixed before pack #3, not after.

## 9. Per-pack production cost

Each pack needs, roughly:

- A **native pedagogue** — sequencing, grammar staging, age-appropriate vocabulary
- A **voice artist**, human, for every letter, matra, core word and phrase. Non-negotiable:
  synthesised Indic speech mispronounces in ways that *teach errors*, and a native-speaker
  parent hears it in five seconds
- **Stroke-path data** for every glyph (traceable, once per script — amortised across
  languages sharing it)
- **1,000 core words** mapped onto the shared theme IDs, so the lexicons stay parallel and
  a bilingual child sees the same themes in both
- **Font licensing** — the Noto family covers every script under an open licence; verify
  conjunct rendering per script before committing
- **A reviewer** signing off, recorded in the pack file

Budget in the range of a small book advance per pack, not a software project.

## 10. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **The engine isn't actually generic** — Hindi assumptions leak into shared code | **High** | Ship Punjabi early (Phase 3) as the forcing function. Build the script module spec *before* Hindi content, not after. Tamil is the real stress test — sanity-check the abstraction against Tamil and Malayalam on paper before writing the engine |
| **Duolingo adds Indian languages** | Medium | They have had Hindi for years and haven't gone deeper. The moat isn't the language list — it's heritage-learner design, script-first pedagogy, family voice, cultural context and the 4–12 age band. None of those are things an adult L2 platform can bolt on |
| **Content cost scales linearly and eats the margin** | **High** | Sequence by demand; gate each pack on measured waitlist signups; shared theme IDs and shared exercise types keep production mechanical |
| **Hindi-centrism alienates non-Hindi families** | **High** | Home language is asked at profile creation and Hindi is *never* the default. The culture pillars stay language-neutral. A waitlist ("we're building Tamil — tell us") converts the gap into demand data instead of churn |
| **Audio quality varies by pack** | Medium | Reuse Bizzing Bee's voice QA loop: parent-facing tester, flag queue, re-record, version bump |

---

## 11. The open question: does this need its own brand?

If the language platform becomes the larger business, "Bizzing India" is arguably the wrong
container for it — a Tamil family in Toronto is buying *Tamil*, not India-in-general.

The options:

1. **Keep it inside Bizzing India.** Simplest. The culture pillars are genuinely pan-Indian
   and give the language its context, which is the pedagogical advantage. Risk: the language
   product is harder to market on its own terms.
2. **A sibling app — "Bizzing Bhasha"** — sharing the account, the design system and the
   parent dashboard, sold separately and bundled in the Family Pass. Matches the Bizzing
   family structure already established with Bizzing Bee. Risk: splits a small team's focus,
   and severs the language from the cultural context that makes it work.
3. **Bizzing India now, spin out later**, once one pack beyond Hindi has proven the engine.

**Recommendation: option 3.** The architecture in this document makes the split cheap
whenever you want it — the engine and packs are already separable, and the account is shared
with Bizzing Bee from day one. Deciding the brand now costs focus and buys nothing; deciding
it after Punjabi ships costs nothing and is informed by real data.
