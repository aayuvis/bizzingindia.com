# 10 — The Corpus: what Bizzing India's 128,040 is

> **The problem, stated plainly:** Bizzing Bee's proposition is a *number*. 128,040 words,
> ramped easy→hard, every one of them waiting its turn. A parent can repeat that number to
> another parent. Bizzing India currently has 38 stories, which is a sampler. There is no
> number, so there is no promise, so there is no reason to subscribe for three years.

This document fixes that.

---

## 1. What Bizzing Bee actually sells

Strip the theme and the mascot away and the machine is:

| Layer | Bizzing Bee |
|---|---|
| **A corpus** | 128,040 words — finite, countable, canonical, ownable |
| **An atom** | one word: say it, spell it, know its meaning and origin |
| **A ladder** | Word → Set (24) → Level → Champ → Library, ramped easy→hard |
| **A memory engine** | spaced repetition; a word won't return until ~150 others have |
| **A completion meter** | "Library explored" — the multi-year long game |
| **A promise** | *nothing is skipped; every word waits its turn* |

The corpus is the moat. Anyone can build a spelling game; nobody else hands you the whole
championship word list with a ladder through it.

**So the question for Bizzing India is not "what features?" It is: *what is our 128,040?***

---

## 2. The answer: India has better corpora than English does

English has one countable corpus worth mastering — its words. India has **five**, and every
one of them is finite, canonical, already numbered by tradition, and already loved.

| Corpus | Count | Atom | Why it works |
|---|---|---|---|
| **Katha Sagar** — the ocean of stories | **1,008** target | one story | Ramayana (~24 episodes), Mahabharata (~30), **547 Jataka tales**, Panchatantra (~84 in 5 books), Hitopadesha, the Puranas, Kathasaritsagara's 350+, and the regional folk canon |
| **Shlok** — verses worth carrying | **~2,500** | one verse | **Thirukkural 1,330 couplets** · **Dhammapada 423** · **Bhagavad Gita 700** · subhashitas · Kabir's dohas · Gurbani shabads |
| **Bhasha** — the languages | 1,000 words × N languages | one word | Already built ([09](09-language-engine.md)) |
| **Bhugol** — the map | 36 states + 40 monuments + 7 rivers | one place | Already built |
| **Devas** — the pantheon | 200+ figures | one figure | Already built, already graded by rarity |

**The headline number: *1,008 stories. 2,500 verses. 5,000 years. One map.***

1,008 is not a marketing round-up — it is an auspicious count in Indian tradition (1,008 names,
1,008 lamps), which makes it both meaningful and memorable. It is also achievable: the Jatakas
alone are 547.

---

## 3. The gap the founder actually pointed at

> *"there are so many lessons from vedas etc… i dont see that"*

Correct, and it is the biggest hole in the product. **We have stories but no teachings.**
A story entertains; a verse is something a child *carries*. Every Indian grandparent can
still recite what they learned at seven. That is the emotional core of this whole business and
we are not serving it.

### Shlok — the sixth pillar

The unit is **one verse**: the text in its own script, transliteration, a child-level meaning,
audio by a human voice, and where it comes from. The child learns it, then keeps it.

This is **Bizzing Bee's word engine, pointed at verses** — and the SRS in
[`app/bhasha.js`](../app/bhasha.js) already exists, so the engine is largely built.

Why these three corpora first:

- **Thirukkural (1,330 couplets)** — the single best fit in all of Indian literature. Exactly
  two lines each. Secular ethics, so it belongs to every Indian family regardless of faith.
  Complete, numbered, endlessly translated. Tamil, which also proves the platform is not
  Hindi-centric on day one.
- **Dhammapada (423 verses)** — complete, Buddhist, short, and already moral-shaped.
- **Bhagavad Gita (700 shlokas)** — the one a diaspora parent most wants their child to have
  touched. Handled at 10+ as *"a talk about doing the right thing when it is hard."*

Plus **subhashitas**, **Kabir's dohas** and **Gurbani shabads** as the growing tail.

### The hard rule this pillar lives under

`docs/05` forbids inventing a scripture quotation, and this is where that rule earns its
keep. **Every verse must be transcribed from a real edition and checked by a reader of that
language.** No verse ships from memory or from a model. Attribution carries the work, the
chapter and the verse number. A wrong Gita verse in a children's app is not a typo — it is the
kind of error that ends the product's credibility with the exact families it is for.

---

## 4. The ladder, restated

Directly parallel to Bizzing Bee's *Spellbound Journey → Champion's Library*:

```
Story / Verse  →  Padav (8)  →  Level  →  Yatri rank  →  THE KATHA SAGAR
                                                          the ocean, 1,008 stories,
                                                          the multi-year long game
```

- **Levels 1–20 · The Yatra** — the canonical spine every Indian child should have: the
  Ramayana and Mahabharata serialised, the Panchatantra, the best Jatakas, the founding
  history, one verse a week.
- **Levels 21+ · The Katha Sagar** — literally *"the ocean of the streams of story"*, the name
  of a real 11th-century Sanskrit collection. The long tail: all 547 Jatakas, the regional
  canon, the full Kural. Premium, and the reason a subscription renews for years.
- A **"Sagar explored"** meter, exactly like "Library explored".
- **Nothing is skipped. Every story waits its turn.**

---

## 5. Why this is a better business than the spelling app

Bizzing Bee's corpus is a means to an end — nobody loves the word *filariid*, they want the
trophy. **Bizzing India's corpus is the end itself.** A parent does not want their child to
have "completed a module". They want to be able to say:

> *"She knows the Ramayana. She can recite ten Kural. She knows which state her grandmother
> is from and why the river matters."*

That sentence is the product. Everything in this document exists to make it true and to make
it *provable* — which is what the Yatra Yearbook in [06](06-commerce-and-books.md) prints.

---

## 6. What to build, in order

1. **Shlok pillar, seeded** — the engine plus ~40 verses, sourced and reviewed, across
   Thirukkural, Dhammapada and subhashitas. Proves the atom.
2. **Serialise the Ramayana** — all 24 episodes. One canonical body, complete. This is the
   single most valuable content object in the product.
3. **The Jataka run** — bulk toward 1,008. They are short, moral-shaped and already numbered.
4. **The Katha Sagar meter** — surface the count everywhere. The number is the marketing.
5. **Mahabharata**, then the Puranic and regional tail.

**Do not** widen to new pillars until the count is real. Breadth is what we have; depth is
what we are missing, and depth is what gets repeated to another parent.

---

## 7. The one-line test

Bizzing Bee: *"128,040 words. Every one waits its turn."*

Bizzing India: **_"1,008 stories and 2,500 verses of India. Nothing skipped."_**

If we cannot say that truthfully, we have not built the product yet.
