# 03 — App Structure

Bizzing India reuses Bizzing Bee's proven shape: a parent account holding child profiles, a
`state → render()` shell, journeys built on a Level ladder, a narrative saga, an arcade, and
a coin economy feeding a shop. What changes is the metaphor and the content spine.

## 1. Shell & navigation

```
Topbar   [☰]  Bizzing India  ·  🐚 kauris  ·  🪔 streak  ·  [⚙]
Drawer   Map · Stories · Saga · Mela · Learn (Itihaas/Dharma/Bhugol) · Hindi 🔒 · Bazaar · Parents
Home     THE LIVING MAP
```

**Chhote mode (4–7)** collapses this hard: the map, one big "Story" button, one "Play"
button, a mic for Nani-Nana. No drawer, no numbers, no timers, no failure states. Any text
on screen is also spoken.

**Bade mode (8–12)** gets the full shell above.

## 2. The Living Map — home and signature

The map of India is the home screen, the navigation, the progress bar and the geography
curriculum in one object.

- Starts **greyed under the Forgetting's mist**. Every completed story, chapter, quiz or
  Hindi level clears mist and colours a piece.
- **Layers** toggle on the same map: states · rivers · monuments · festivals · wildlife ·
  the saga's route · food · languages.
- **Pins** are content: tapping Hampi opens a card with a Katha, an Itihaas entry, a photo, a
  Hindi word and a mini-game.
- **Time slider** (Bade mode) scrubs the map through the centuries — watch empires breathe.
  This is where geography and history fuse and it is the most memorable single interaction
  available to this product.
- The map is also the **share artefact**: "Aanya has lit up 14 states" renders as a WhatsApp
  card.

Two companion views, same idea, different axis:
- **River of Time (Kaal Nadi)** — the history spine, scrolled left-to-right.
- **Story Tree (Katha Vriksha)** — the mythology hub, a banyan with stories on its roots.

## 3. The Yatra — the main ladder

Bizzing Bee's ladder is *Word → Set → Level → Champ → Library*. Ours:

```
Story/Card  →  Padav (a stage: ~8 cards)  →  Level  →  Yatri rank  →  the open map
```

- Each pillar is its own ladder, so a child can be Level 9 in Kathayein and Level 2 in Itihaas.
- **Rank ladder (Gurukul):** Shishya → Vidyarthi → Sadhak → Khoji → Pandit → Vidwan →
  Acharya → Rishi. Folk-art worlds can re-skin the ladder names, exactly as Bizzing Bee's
  themes do.
- **Padav Challenge** — the accelerator, mirroring Bizzing Bee's Champ Challenge: a
  configurable quiz that lets a confident child test out of a level and jump ahead.
- **Free stops at Level 5** on each ladder; Premium continues. (Same shape as Bizzing Bee, so
  the paywall is familiar to a returning household.)

## 4. Saga — *Gattu & the Great Forgetting*

The narrative mode. Same machine as Bizzing Bee's saga (`ACTS` → `CH_META` chapters →
playable engines → dialogue scripts), which makes engine and tooling work portable between
the two apps.

**Premise.** A grey mist called **Vismriti** is eating India's memory — names slip off maps,
faces fade from stories, words drop out of mouths. Gattu the elephant calf remembers
*everything*, which is why he's the only one who notices. Mithu the parakeet knows every
story ever told, which is why he's the only one who can tell them back. Together they walk
the map and the centuries, and each recovered story pushes the mist back a little.

| Act | Where / when | Recovers |
|---|---|---|
| 1 · The Fading Village | Today, a village that's forgetting its own festival | The idea that stories have to be told to survive |
| 2 · The Buried City | Harappa & Mohenjo-daro | The first cities, the unread script |
| 3 · The Forest of Teachers | Vedic forests, the Buddha's age, Mahavira | Where India's big ideas came from |
| 4 · The Lion's Regret | Maurya & Gupta | Ashoka, zero, Nalanda |
| 5 · Ships, Domes and Bhakti | The Souths, Sultanates, Mughals, the saints | That India was always many at once |
| 6 · The Long Walk | Colonial era → freedom → today | That memory is a choice a people make |

~30 chapters. Each = dialogue beats → a playable engine → a win/lose beat → map territory
recovered. Engines are reusable across chapters (Bizzing Bee runs 13 engines across 31
chapters); target 8–10 engines for 30 chapters.

Vismriti is deliberately an *impersonal force*, not a demon, villain-king or figure from
anyone's tradition. Nothing sacred to anyone is ever the enemy.

## 5. The Mela — mini-games

The carnival. Bizzing Bee's arcade in Indian dress; each game is a drill wearing a costume.

| Game | Teaches | Mode |
|---|---|---|
| **Rangoli Rush** | Pattern, symmetry, memory | Both |
| **Yatra Ludo** | States, capitals, distances | Both |
| **Rivers Run** | Trace a river source→sea, name the cities | Bade |
| **Monument Builder** | Assemble a monument from its parts; learn the parts' names | Both |
| **Dynasty Dash** | Order events on the timeline before the mist takes them | Bade |
| **Festival Frenzy** | Match festival ↔ region ↔ month ↔ why | Both |
| **Jataka Jump** | Hear the tale, pick the moral | Chhote-friendly |
| **Spice Bazaar** | Hindi shopping vocabulary, numbers, money | Premium |
| **Matra Magic** | Hindi matras, letter-joining | Premium |
| **Shabd Shikar** | Hindi word hunt in a Devanagari grid | Premium |
| **Mudra Match** | Classical dance mudras ↔ meanings | Both |
| **Wild Trails** | Animal ↔ habitat ↔ state | Chhote-friendly |

Rules inherited from Bizzing Bee and non-negotiable: **every game needs both keyboard and
touch controls**, and games must look professional — folk-art quality, never boxy.

## 6. Gyan Cards

The analogue of Bizzing Bee's Concepts (121 cards in 11 chapters): illustrated card decks
that *teach* rather than test — a worked example plus five cards. Here they carry the
non-narrative teaching load across all pillars: "What is a stupa?", "Why does the monsoon
come in June?", "Who was Ashoka?", "What is ahimsa?", "How does a matra change a letter?"

Card 1 of every chapter is an **animated explainer narrated by Mithu**, matching Bizzing
Bee's bee-taught explainers: audio pre-recorded and bundled so it plays instantly and
offline, with animation timed to narration.

Every card carries its **Katha / Itihaas / Aaj** badge (see
[05 — Editorial Policy](05-editorial-policy.md)).

## 7. Bhasha Coach *(Premium)*

The Hindi trainer, structurally the Word Coach from Bizzing Bee:

- Top row quick-switch: current stage · my word list · tricky review · my misses · + Lists
- **Revise** tab (one card at a time, script + audio + meaning) and **Practice** tab
  (hear it, write/type/trace it, instant feedback)
- Live **heatmap** of letters/words by mastery, per child
- Written and oral rounds; stroke-order tracing on touch
- Spaced repetition driven by the child's own misses
- 🖨 **Print** any list as a worksheet — Letter/A4/A5 — the direct on-ramp to the workbook
  business

## 8. Economy, streaks, rewards

- **Kauris 🐚** — earned from stories, quizzes, games, streaks. Cowrie shells were real
  Indian currency for centuries; the shop can teach that.
- **The Bazaar** — spend kauris on folk-art worlds, Gattu decorations, story unlocks, map
  stickers, a ⚡ level boost. Cosmetic-first; paid content stays server-gated.
- **Diya streak 🪔** — light a lamp each day. Seven days completes a rangoli; thirty lights a
  full festival scene. Milestone bonuses at 3 / 7 / 14 / 30, as in Bizzing Bee.
- **Gattu grows** — the child's elephant calf gains decoration, gear and expressions as
  ranks rise. This is the avatar-evolution mechanic Bizzing Bee already proved.
- **Celebrations** — confetti, a rank-up card, and mist visibly retreating on the map.

## 9. Nani-Nana Stories

The family-voice loop, and the feature nothing else in this market has.

1. Parent taps **Invite a grown-up** → gets a link.
2. Grandparent (or uncle, or family friend, anywhere) opens the link in a browser — **no
   install, no account** — sees a simple prompt ("Tell Aanya about a Diwali from when you
   were small") or a script to read, and records.
3. Audio lands in the child's app as a card on the Story Tree, in that person's voice.
4. Optional: the parent picks a story from the app for a grandparent to narrate — the app
   supplies the pictures, the family supplies the voice.

Private to the household. No public feed, no moderation surface, no discovery. Recordings
are stored per-family and count as household data, not child data.

## 10. Parents

- **Activity log** — every session, story, game and quiz; tap a row to see exactly what was
  missed.
- **What they learned** — plain-language summary: "Aanya can now name 14 states, has read 22
  stories, and reads 18 Hindi letters."
- **Weekly/monthly report** — printable one-pager, and one-tap share to WhatsApp. This is the
  artefact that goes to the grandparents, so it is designed to be *shown off*, not audited.
- **Controls** — mode (Chhote/Bade), sensitive-topic age gate, screen-time cap, sound,
  language of narration, invite grown-ups, manage subscription.
- **Printables** — worksheets, map outlines, festival crafts, colouring pages in the child's
  chosen folk-art style.

## 11. Screen inventory (v1)

```
Onboarding      Parent signup → add child (name, age, mode, art world, home language) → Gattu picker
Home            The Living Map (+ layer & time controls)
Stories         Story Tree → story player (art + narration + read-along) → comprehension beat
Saga            Act map → chapter → dialogue beats → engine → result → mist recedes
Mela            Game grid → game → result
Learn           Pillar hub → Gyan Card decks → Padav → Level ladder
Hindi 🔒        Bhasha Coach: stage ladder · Revise · Practice · Heatmap · Print
Bazaar          Kauri balance → worlds, decorations, unlocks
Parents         Log · Learned · Report · Controls · Printables · Subscription · Invite
Books           In-app shop cards + "read it in print" from any story
Settings        Sound, narration language, theme/world, accessibility, about
```
