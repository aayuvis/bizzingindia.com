# 05 — Editorial Policy

This product teaches **religion** and **history** to **children**, on a subject where adults
argue fiercely and where the audience spans devout households, secular households, and
several different faiths. Getting the editorial stance right is not a compliance chore — it
is the core product risk and, handled well, the core differentiator. A parent decides
whether to trust this app in about ninety seconds.

This policy is binding on every content contributor and on every agent working in this repo.

---

## 1. The three badges

Every card, story and lesson carries exactly one badge, visible to the child:

| Badge | Means | Voice |
|---|---|---|
| 🪔 **Katha** | A story as it is told | Warm, whole-hearted, no hedging. Tell it the way it's meant to be told |
| 📜 **Itihaas** | What evidence shows | Names the evidence. States uncertainty plainly. Dates are approximate and say so |
| 🧭 **Aaj** | How it lives today | Present tense. Real families, real festivals, real variety |

**Why this matters.** Mythology and history are both pillars of this app. Blurring them —
in either direction — is the single most common failure mode in Indian children's content,
and both directions do damage: presenting sacred story as disproven fiction insults the
household, and presenting story as documented fact leaves a child unable to answer a
classroom challenge and feeling deceived when they find out.

The badge dissolves the problem, because children handle this distinction easily when adults
are honest about it. A child can love the Ramayana *and* know what an archaeologist can
show. The phrasing that does the work:

> *"This is one of the greatest stories ever told, and people have loved it for two thousand
> five hundred years. Here's what we can also show you: the oldest written version we have
> was written down by a poet called Valmiki, and people all over Asia have been retelling it
> in their own way ever since."*

Never *"myth" as a synonym for "false."* Never *"it is proven that…"* where it isn't. When
scholars genuinely disagree, say **"grown-ups still argue about this one"** — that is an
honest and, to a ten-year-old, thrilling sentence.

---

## 2. Religion

### The insider rule
Each tradition is presented **as its adherents understand and practise it**. When Bizzing
India teaches Jain ahimsa, it is written the way a Jain family would want their child taught.
Same for Hindu, Buddhist, Sikh, Muslim, Christian, Jewish and Parsi content.

### Never rank, never compare-to-judge
No "which is right," no "unlike X, Y believes." Comparison is fine when it is *interesting*
(all three of Hinduism, Buddhism and Jainism talk about karma, and they mean somewhat
different things) and never when it is *evaluative*.

### Internal diversity is the point
There is no single Hinduism. A Tamil Iyer household, a Bengali Shakta household, a Gujarati
Vaishnav household and a Punjabi household do genuinely different things, and the diaspora
child needs to see *their* version on screen — otherwise the app teaches them that their
family does India wrong. Practise this concretely:
- Give deity names in multiple regional forms.
- Show festivals with their regional variants (Diwali is not the same festival in Bengal).
- Use the phrase **"in many families…"** and **"in your family, it might be different — ask!"**
  as a recurring device. It doubles as a conversation prompt home.

### Reverence in depiction
Deities are depicted only in named folk-art idioms, never in comic-grotesque, never as
game-collectible loot, never as an antagonist, never customised as a player avatar. Sacred
texts are quoted accurately with citation, never paraphrased into a slogan.

### The three named traditions, plus the honest weave
The commissioned scope is Hinduism, Buddhism and Jainism in depth. **Sikhism should be
carried close to that depth too** — a large share of the diaspora target audience is Sikh,
and an app called Bizzing India that skips the Gurus will be noticed and resented. Islam,
Christianity, Judaism and Zoroastrianism in India get respectful survey treatment as
*Indian* stories: the Sufi dargah, Kerala's ancient churches, Cochin's synagogue, Mumbai's
Parsis. This is not political balance-seeking; it is accuracy about what India is, and it is
what makes the app safe to recommend inside a mixed classroom.

---

## 3. History

### Rules
1. **Evidence is named.** "We know this from Ashoka's edicts carved on rocks and pillars —
   you can still go and see them."
2. **Uncertainty is stated, at the child's level.** "Nobody has been able to read the Indus
   script yet. Maybe you will."
3. **Dates are honest.** Approximate is fine and labelled approximate; false precision is not.
4. **Rulers are people, not teams.** Individuals had good and bad in them; empires did good
   and terrible things. No dynasty is a hero-team and none is a villain-team.
5. **The whole map.** South, East and Northeast India get real coverage, not a footnote after
   the Delhi-centric narrative. The Cholas, Ahoms, Vijayanagara, Travancore and the Northeast
   are not optional.
6. **Everyday life beats battles.** What kids ate, wore, played and learned is both more
   interesting to a 7-year-old and less contested.
7. **No triumphalism, no grievance.** Both are adult political projects and neither belongs
   in a children's product.

### Sensitive topics, gated by age

| Topic | 4–7 | 8–10 | 11–12 |
|---|---|---|---|
| Wars & conquest | Not covered | "Kingdoms sometimes fought" | Named conflicts, causes, consequences |
| Caste | Not covered | "Society was divided in unfair ways; people fought to change that" | Historical structure, reform movements, Ambedkar, the Constitution |
| Colonialism | Not covered | Simple: "Britain ruled India and Indians won freedom back" | Company rule, economic drain, famines, 1857, resistance |
| Partition | Not covered | Not covered | Handled carefully, with human cost, without assigning collective blame |
| Religious conflict | Not covered | Not covered | Only where unavoidable, factually, without generalising to communities today |
| Sati, child marriage, untouchability | Not covered | Named as things reformers ended | Reform movements in context |

**Parent control:** the age gate is settable by the parent, in both directions, with a plain
explanation of what it changes. A parent who wants their 11-year-old to learn about Partition
from them rather than from an app must be able to switch it off.

### Language discipline
- Prefer **"the subcontinent"** for pre-modern geography; modern national borders are 1947 and
  after, and saying so is simply accurate.
- Use both names with a light touch where names have changed (Bombay/Mumbai) — it's
  interesting, not a battleground.
- Regional-language terms in their own script *and* transliteration.

---

## 4. Sourcing & review

**Every content object carries source metadata**, visible to parents in a "Sources" link:

```json
{
  "id": "itihaas.maurya.ashoka",
  "badge": "itihaas",
  "sources": [
    {"type":"primary","ref":"Major Rock Edict XIII (Kalsi)"},
    {"type":"secondary","ref":"Thapar, R. — Aśoka and the Decline of the Mauryas"},
    {"type":"institution","ref":"ASI — Sarnath Museum, Lion Capital"}
  ],
  "reviewed_by": ["hist-01"],
  "reviewed_on": "2026-09-14",
  "age_gate": 8
}
```

**Review board.** Before launch, retain named reviewers and credit them publicly:
- One historian of pre-modern India, one of modern India
- One practitioner-scholar each for Hindu, Buddhist, Jain and Sikh content
- One children's-education specialist (age-appropriateness, reading level)
- One Hindi-language pedagogue (script, grammar, audio accuracy)

Nothing in the Dharma or Itihaas pillars ships without a reviewer sign-off recorded in the
content file. Publishing the review board on the website is itself a conversion asset —
it is exactly what a cautious parent looks for.

**Corrections.** A visible "tell us we got it wrong" path, a public changelog of content
corrections, and a commitment to fix errors in days, not quarters. Being *correctable* in
public is more credible than claiming to be right.

---

## 5. Tone for children

- **Never babyish.** Bizzing Bee's rule holds: plain, active, kid-readable, never talking down.
- **Wonder over reverence-performance.** "The oldest mountains in India are the Aravallis —
  older than the Himalayas, older than *dinosaurs*" beats any amount of solemnity.
- **Curiosity is the outcome.** The best ending to any card is a question the child takes to
  a grown-up. Build "ask your family" prompts in deliberately — they drive the family loop,
  which drives retention, which drives everything else.
- **No fear, no guilt.** Not about being a bad Indian, not about not knowing Hindi, not about
  the Forgetting. Vismriti is *sad*, and telling stories fixes it.

---

## 6. Agent rules for this repo

Anyone (human or agent) authoring content here must:

1. Assign a badge (Katha / Itihaas / Aaj) before writing a word.
2. Fill `sources[]` for every Itihaas or Dharma object. **Do not write history from memory** —
   cite, and if you can't cite it, don't ship it.
3. Set `age_gate` explicitly.
4. Never invent a scripture quotation, a date, an inscription, or an archaeological finding.
   If a detail can't be sourced, cut it.
5. Leave anything touching caste, Partition, communal conflict or contested chronology to a
   human author with a reviewer. Draft it flagged `needs_review: true` and never publish it
   directly.
