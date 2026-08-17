# Benchmark: Bizzing Bee → Bizzing India

What the sibling app does, what this one does, and where the gap actually is. Read
against the live source in `../Bizzing-Bee/spellbound-app/`, not from memory.

The two apps are not the same product — Bee drills a closed skill (spelling, to a
competition standard) and India tells a subject (history, faiths, geography, language).
So "parity" is the wrong target for a lot of this. Where a difference is deliberate, it
says so.

---

## 1. Where India is now ahead

| | Bee | India |
|---|---|---|
| Worlds | 8 themes: palette + display face + a page motif | 15 worlds, each with a five-layer animated scene (backdrop, air, band, sky, footer stage), a display face, a card-frame idiom drawn from its own craft, a top-bar frieze, and gutter objects on desktop |
| Night | `dusk` mode, palette only | Every world has a night composition: lamps come on, windows light, a city switches itself on |
| Narration | word audio | **3,659 clips**: every story scene in English, plus every scene in Hindi |
| Second language | — | A whole language engine (`bhasha.js`) — 9 packs, Leitner SRS, four interaction families, an abugida-aware script model |
| Map | — | The Living Map: 36 states, each painted, capitals projected from real coordinates, hover-to-light |
| Editorial rules | house style | A binding policy with a headless gate enforcing it (badges, sources, no scores on people, no unattributed quotations) |

## 2. Where Bee is still ahead, and what to take

1. **The theme system is cheaper than ours.** Bee's `[data-theme]` blocks are ~1 line
   per theme: a display face, four colours, and a `::before` motif. Ours is a 3,500-line
   art module. That is the right trade for an app whose worlds ARE content, but Bee's
   discipline is worth copying in one respect — its motif is explicitly *page-level,
   never on cards*, which keeps text legible. We break that rule nowhere yet; keep it.
2. **`ds-src` as a shared package.** Bee ships its tokens as a consumable package.
   India re-declares its own. CLAUDE.md already says the tokens should be shared; they
   are not. **Action: pull Bee's `ds-src` in rather than maintaining a second copy.**
3. **Dusk as a third appearance.** Bee has light / white / dusk. India has day / night
   only, and night is genuinely dark. A soft middle setting is a real accessibility win
   for evening reading. **Action: consider `--mode=dusk` per world.**
4. **Sono for the tile face.** Bee sets spelling tiles in a dedicated monospace-ish face
   so letterforms cannot be confused. India sets Devanagari drill tiles in Mukta, which
   is correct, but the LATIN romanisation beside them is in the body face. **Action:
   evaluate Sono for romanisation tiles.**
5. **Eval harness.** Bee has `plugin eval`-style suites. India has `tools/verify.js`
   (66 views, 7 gates) and `tools/test-bhasha.js` (585 checks), which is comparable in
   spirit — but Bee tests *learning outcomes*, not just rendering. **Action: add a
   scheduling-quality check to the Bhasha suite (does the planner actually re-surface a
   word the child got wrong?).**

## 3. Where the two deliberately diverge

- **No XP ladder in India.** Bee has a rank ladder; India replaced it with the mala,
  which is deeds-not-levels and has no completion state. This was a founder decision
  (docs/11 §3.5) and the reasoning holds: you do not acquire a value by consuming
  stories.
- **India has an economy, Bee does not.** Sikke buy worlds and open avatar packs
  (`economy.js`). Earned-only, never purchasable with money, and nothing sacred is
  priced or drawn.
- **India carries ten scripts.** Bee is Latin + French. The whole `--deva`/`--tamil`/…
  token-per-script rule exists here and has no Bee equivalent.

## 4. Honest scorecard

| Area | Verdict |
|---|---|
| World identity | India ahead, and by a lot after this pass |
| Games | **Bee ahead.** Its arcade is deeper and its covers were always illustrated. India's covers are illustrated as of this pass; the game *count* is 15 vs Bee's larger set, and India's are shallower |
| Content volume | India ahead (344 stories, 2,830 scenes, all narrated twice) |
| Learning engine | Comparable; Bee's is better *measured* |
| Shared design system | **Bee ahead** — it has one, we duplicate it |
| Offline | Both hard-offline; neither has a service worker yet in India's case |

## 5. The three actions worth doing next

1. Consume Bee's `ds-src` instead of maintaining a parallel token file.
2. Add a service worker to India (Bee's offline story is better proven).
3. Deepen the games rather than widen them — the covers are fixed now, the engines are
   where Bee is genuinely stronger.
