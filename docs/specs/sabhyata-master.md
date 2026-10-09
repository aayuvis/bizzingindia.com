# Sabhyata: the master document

**Review, city-building UX, payoff design, the *Mithu's Lamps* storyline, and the build plan**

Bizzing India · for the India chat and the owner · 8 Oct 2026 · reviewed at `5d6a24e7`

This document is the single home for Sabhyata. It supersedes the Sabhyata section of `india-games-spec.md` (§2.1), which
now points here.

**Owner decisions (8 Oct 2026):**
- **Yes to *Mithu's Lamps***, the 13-chapter campaign.
- Sabhyata stays a flagship.
- City-building UX and payoffs are to be reviewed and fixed. The owner's words: "in cities it is difficult to build
  stuff… the UI is difficult… monuments don't stick when added to map… and there are no payoffs."

---

## Part A. Executive summary

**Where it stands.** Sabhyata is the most ambitious game in the Bizzing family.
- 13 ages and 31 real, sourced sites.
- A game where nothing is conquered, only reached and woken.
- Flagship art.
- Today it is **unfinishable and frustrating to handle**.

**The four problems that matter, in the owner's words and ours:**

1. **"It can't be finished."** Turning the first age folds every first-age city into a memory. The child is left with
   no living city and can never find the next age's sites (Part C, B1).
2. **"In cities it is difficult to build stuff."** Two shell bugs cause most of the pain:
   - **every card opened inside a city is invisible and freezes the game** (tapping a building, the Grow chooser,
     treasure, turn events);
   - **every success plays the app's "wrong" sound and shakes the whole city 183 px down the screen.**

   On top of that:
   - the city opens zoomed in on a water tile where nothing can be built;
   - holding a piece hides the rotate and put-back buttons;
   - "⟳ TURN" rotates the board, though a child reads it as "end turn";
   - buttons overlap or sit under other things (Part D).
3. **"Monuments don't stick."** True three ways:
   - in the 8 drawn ("kit") cities a finished monument is drawn as *nothing*: the scaffold vanishes and empty water is
     left;
   - the world map never shows a monument;
   - a reload can roll a finished monument back, because the game saves only every fifth turn (Part D, B).
4. **"There are no payoffs."** Most rewards happen in code but are invisible:
   - adjacency bonuses vanish after placement;
   - growth unlocks nothing you could see coming;
   - the monument, the biggest reward in the game, shows nothing in kit cities or on the map;
   - the coin toast says +1 while the code grants 15 (Part D, C).

**What we do:**

| When | What | Owner |
|---|---|---|
| **Week 1** | Fix the six blockers: the age-turn soft-lock; invisible city cards and the frozen turn button; the wrong sound and shake; monuments drawn in kit cities and on the map; save on every spend and on hide; the riddle question shown | India chat |
| Weeks 2–3 | The city UX pass (Part D.2) and the payoff layer (Part E) | India chat |
| Weeks 3–4 | Mithu leads, the goal strip, age bands, honest lengths (Part C) | India chat |
| Weeks 4–10 | ***Mithu's Lamps***, chapters 1–13, about two a fortnight, each reviewed (Part F) | content + India chat + reviewer |

**Key insight.** The owner's three complaints are mostly *two shell bugs and one missing renderer*, not a bad design.
- The design underneath is strong: connect, don't conquer; adjacency; monuments that hold off the mist.
- One week of fixes changes how the game *feels* more than any new feature could.
- The campaign then turns a sandbox that overwhelms into a guided story where each chapter adds one system.

---

## Part B. What Sabhyata is (for anyone new to it)

**The frame.** India sits under **Vismriti**, the Forgetting, a grey mist that is sad, never scary. The child reaches
places and *tells* them awake. Nothing is fought or conquered. Raids are boar, elephants and storms, never people.
Quarrels end in a panchayat. No boundary is ever drawn.

**The loop:** explore → build a road → wake the city (with *katha*, story) → grow and build inside it → turn the age.

**Resources:**

| Resource | What it does |
|---|---|
| 🌾 anna (grain) | Feeds citizens (0.25 each per turn) |
| 🛠️ kala (craft) | Pays for roads (30) and buildings |
| 📜 katha (story) | Wakes places (35 or more) and opens ages (60, 120, 200 … 750) |
| Khushi | Contentment from variety. The "restless" penalty applies when it is low |

**Inside a city:**
- 8 cities are drawn on an isometric **kit** board with 10 adjacency rules; the other 23 are **painted plates** with
  building plots.
- Grow levels 1–3, jobs (kisan, karigar, kathakar, guards), and buildings (granary, workshop, gurukul, bazaar, stepwell,
  wall, fort).
- A **monument** at level 3. A finished monument makes the city immune to the mist and keeps it alive at the age turn.
- Capital, quests, the gurukul quiz, treasure, heroes.

**Around it:**
- Vidya, a 23-technology tree, and Riti, civics policies.
- Six overseas partners and sea roads.
- Timed events: raids every 30 turns, quarrels every 50, droughts, lean-season help, quest scrolls, darshan and sutra
  story cards.

**Ages:** 13, from **The First Cities** (Dholavira, Lothal, Rakhigarhi, Kalibangan, 3300–1300 BCE) to **The Takeoff**
(Bengaluru, Sriharikota). Each age's sites carry facts with `sources[]` (NCERT, ASI, UNESCO, named excavators).

**Modes:** *Sochna* (turn-based, the default; the world waits) and live speeds (Slow, Standard, Quick). Two mid-game
scenarios are hidden in the Restart dialog.

**Length:** a full game is hundreds of turns, meaning hours. The Mela card says "12 min".

---

## Part C. The game-level review (hands-on, desktop 1280 × 800 and phone 390 × 844)

**Method.** Played once by following only Mithu's advice, and once deliberately. The code and data were read alongside.

### C.1 What's great
- **The editorial frame is a real achievement:** connect, don't conquer; an impersonal mist; panchayats, not battles.
- **The content is sourced,** with debated readings marked ("many archaeologists read it as…").
- **Coordinates are projected** from real latitude and longitude, and renames carry through the ages
  (Kashi → Banaras → Varanasi).
- **The art is flagship quality:** wake paintings, isometric scaffolded monuments, a teak-and-brass HUD.
- **Mature design choices:** Sochna mode, a single "Agla Saal" button, Undo, a production queue, and an adjacency
  preview computed by the same function that pays out.

### C.2 What's broken

| # | Finding | Evidence | Severity |
|---|---|---|---|
| **B1** | **Soft-lock: the first age turn folds every city.** The child is left with 0 living cities, no explorer, and can never find the era-1 sites. Mithu says "Send an explorer" forever; the panel still says "4 places awake" | `advance()` sabhyata.js:5756–5779 folds when `s.era <= G.era − 1`, where the comment says "two full ages behind". Reproduced by lighting all four Harappan cities and advancing on turn 14 | **Blocker** |
| B2 | **Riddles never show their question:** "A question, traveller…" plus three options | `callQuest` :2833 and the painted path :5187 never render `s.ask.q` | High |
| B3 | **A wrong riddle retries forever,** never shows the answer, pays in full; distractors are jokes ("a stone spaceship") | Played: both wrong options, then the right one, gave +30 📜 | High |
| B4 | **Good news sounds wrong and shakes the screen** (see D.1, item 3) | The `warm` class is read by `app.js:8430` as a wrong answer | High |
| B5 | `blip()` ignores mute and Calm mode | A private `AudioContext` at :4457 | Medium |
| B6 | **Mithu's advice does nothing** when there is nothing to select. Following him for 90 turns gave 1 city awake and grain at 0. He contradicts the "Next:" line, and ranks a tech above "the age can turn" | Played | High |
| B7 | Live speeds keep ticking in a hidden tab | No `visibilitychange` handler | Medium |
| B8 | Touch targets: desktop HUD 40 px; in-city "← the map" 89 × 36 and ☰ 36 × 36 on phone | Measured | Medium |
| B9 | **Pay:** 1 coin per age and similar events; nothing for a right riddle; the 10 for a win can't be reached while B1 stands | `grant()` → `earn('answer')` | Medium |
| B10 | Smaller faults: timers say "s" but count turns; the kit quest chip does nothing; low-contrast call cards; the phone map crops the selected city; teardown leaks listeners; the welcome card names about 11 systems in one paragraph | — | Low |

### C.3 The design gaps behind the bugs
- **No goal on screen:** the child doesn't know what this age needs.
- **No age bands:** every child from 4 to 12 gets all 13 ages and every system.
- **The decisive choice is hidden.** "Build a monument or name a capital *before* turning the age" is never explained,
  and is currently a trap.
- **The length is dishonest:** hours, labelled "12 min".
- **Learning is thin:**
  - riddles can be brute-forced;
  - sources and badges never reach the child;
  - there is no link to the story library or Itihaas;
  - nothing feeds the mastery record.

### C.4 Game-level fixes
1. **B1 (S, week 1):**
   - fold only cities **two or more** ages behind;
   - **never fold the last living city**;
   - warn before the advance ("Lothal will become a memory — build a monument to keep it awake");
   - a `check-sabhyata` test that plays from era 0 into era 1 and asserts a living city and a findable site.
2. **Mithu leads (M):**
   - his tap *does* the step or draws an arrow to it;
   - `hint()` merges into him;
   - ranking: age turn → help requests → the next lamp → economy;
   - never a dead tap.
3. **Riddles teach (S–M):**
   - show the question;
   - one try scores;
   - a miss shows the answer and its source line;
   - plausible distractors;
   - pay `answer` 1 for a first-try right.
4. **Goal strip (S).** Always visible: "This age: lamps 2/4 · 📜 35/60 · next: road to Lothal".
5. **Age bands (M–L):**

   | Band | What is on |
   |---|---|
   | 4–7 | Explore, road and wake only; Sochna; 3 ages |
   | 8–10 | Adds buildings, quests and Vidya |
   | 11–12 | Everything |

6. **Honest lengths (M).** The start screen offers **Campaign** (*Mithu's Lamps*, about 15–20 min a chapter), **Short
   game** (3 ages) and **Long game** (all 13). The Mela card shows the real time.
7. **Sound and clock (S):**
   - route `blip()` through `IND_SFX`;
   - pause live speeds on `visibilitychange`;
   - timers say "turns".
8. **The badge travels (S plus the reviewer).** Wake and About cards show 📜 and the sources, with a link into Itihaas.
   - Darshan cards that turn sacred figures (Buddha, Mahavira, Krishna, Guru Nanak) into gameplay boons are **reworked
     into story cards with no boon**.
   - The shrine "wonders" that grant a watchtower lose their power-up.
   - The Pashupati bead and the post-1200 framing go to the reviewer.

---

## Part D. The city-building review (the owner's complaints)

**Method.** Played Dholavira (kit) and Pataliputra (painted) at both sizes, with tap counts. Reload tests ran on a real
save.

### D.1 Why building is hard

**Tap counts (kit city, desktop):**

| Task | Taps | Problem |
|---|---|---|
| Enter a city | 2 (double-click) | Desktop has no "Enter" button; the child must guess the double-click |
| Place a piece | 3 + panning | Build → tile → tap land |
| Grow | 2 | …but the direction card is **invisible** (item 1) |
| Assign a job | 3 | Build → People → +, on **26 × 22 px** buttons |
| Move a building | 2–3 | Its button sits under "Grow" |
| Monument | 1 tap, then 11 turns | …and then nothing is drawn (D.2) |

**Friction, worst first:**

1. **Every card inside a city is invisible, and the world freezes.**
   - The overlay host `#sab-ovhost` lives inside `#sab-stage` (sabhyata.js:4089), which `paintCity()` hides with
     `display:none` whenever a city is open (:5220).
   - The card's rect is 0 × 0, but the game believes a card is open, so turns are blocked (:7481, :6193) and Agla Saal
     is disabled (:2863).
   - Affected: tapping a built piece (the "what is this?" tap), the Grow direction chooser, khazana found, and any turn
     event fired while inside a city (darshan, sutra beads, "found!", "sleeps").
   - A child is stuck until they leave the city, when the card suddenly appears on the map.
2. **Agla Saal stays dead after a card closes.** `ovclose` calls `paintAll()` but not `paintCity()` (:7302), so the
   city's turn button keeps `disabled`. Reproduced at turn 15 in Pataliputra.
3. **Every success plays "wrong" and shakes the city 183 px.**
   - `say(msg,'warm')` sets the feed class `warm` (:3544).
   - The app's game frame reads it as a wrong answer (`app.js:8430`, `TOK_NO = /(warm|is-warm)/`): it plays
     `IND_SFX 'wrong'` and adds `gf-no`.
   - Its keyframes put a `transform` on `#gframe` (app.css:2802), which re-anchors the fixed-position city, so the whole
     city jumps down 183 px for about 0.4 s and the app header shows through.
   - Triggered by building, growing, the monument rising and finishing, and Undo.
4. **The city opens where nothing can be built.**
   - Entry is 200% zoom centred on the monument cell. In Dholavira that is water; the city heart is in a corner.
   - Only 18 of 72 legal cells are on screen, and taps answer "too far out".
   - The reach shading is barely visible.
5. **Holding a piece hides the controls you need.**
   - Picking a tile closes the shelf, taking **Rotate** and **Put back** with it.
   - Panning is disabled while holding.
   - The only visible rotate is "⟳ TURN", which rotates the camera, not the piece.
   - Keyboard shortcuts (arrows, Enter, R, Esc) exist but are never shown.
6. **"⟳ TURN" vs "Agla Saal".** A child reads TURN as "end turn".
7. **Placement feedback is far from the finger.** The plot preview is a banner at the top of the screen. After placing,
   the piece stays held with no "still holding" cue.
8. **Overlaps:**
   - "Move a building" under "Grow to level 2";
   - with the shelf open, Agla Saal is covered;
   - on phone, the shelf covers the resource HUD and the turn button;
   - in painted cities, job stations and the yatri sit on top of the Granary, Gurukul and Bazaar plots, so tapping
     them does nothing.
9. **Locks and costs are unclear.**
   - Next-level items are hidden, not shown locked, so Grow's reward can't be previewed.
   - Painted plots grey out with a price but no reason.
   - Grow asks N/E/S/W on a rotated board with no compass, and its text says "Dholavira itself…" in every city (:5631).
10. **Tiny targets:** job ± 26 × 22; ☰ and zoom 36 × 36.
11. **A stingy start.** The first city nets 0 grain a turn and shows "0/1 restless" (−1 to everything) from turn 1 with
    no explanation. Four builds empty the purse.

### D.2 Why monuments don't stick

**Reproduction (Dholavira):** reach level 3 → tap the scaffold ("The foundation is laid…") → 11 × Agla Saal → "has
raised its monument" (`q.mon = true`).

**What the child then sees:**
- **Inside the city:** the scaffold vanishes, leaving empty water. Nothing is drawn.
- **On the map:** nothing changes. The sprite depends on level only, with no star, marker or line in the sheet.
- **After a reload:** the monument can roll back (`mon:true` at turn 16 → `mon:false, monB:true` at turn 15). Kit
  pieces placed since the last save are also lost.

**Root causes:**
1. **The kit renderer has no finished-monument branch.** The scaffold is built only `if (!q.mon …)` (:4708). The kit
   board gets no monument piece, and `kit.js` never reads `q.mon`. Painted cities un-dim a hero painting (:5004); kit
   cities have none.
2. **The map never reads monuments.** `paintSite()` (:4285–4334) picks the sprite from `q.lv` only.
3. **Saves are sparse.** `save(G)` runs only when `G.t % 5 === 0` (:6528) and on teardown. There is no save on spend,
   on monument completion, or on `pagehide`/`visibilitychange`.
4. **The anchor is in the water.** The scaffold uses the painted plate's `mon` point mapped onto the kit grid (:4711);
   in Dholavira that is inside the reservoir.

**Fixes (week 1):**
- **(a)** When `q.mon`, draw the monument on the kit board at its pin, using the city's monument sprite as a kit "great
  work" piece with a footprint. It **replaces** the scaffold with a one-time *rise* animation and a ★ label.
- **(b)** On the map, `paintSite` adds a **monument glyph** (a small lit stupa, pillar or tower per city) when `q.mon`,
  and a scaffold glyph when `q.monB`. The sheet says "★ Monument stands: this city never fades."
- **(c)** `save(G)` on every spend (`pay()`), on monument and tech completion, on grow, and on
  `pagehide`/`visibilitychange:hidden`.
- **(d)** Each kit city gets a **dry-land monument anchor** near its heart, never the painted plate's point.

### D.3 The payoff audit (what the code does vs what the child sees)

| Action | What the code does | What the child sees | Gap |
|---|---|---|---|
| Place a field, workshop or home | +1 yield per turn; homes add people | Title-pill numbers change; a toast with a *wrong* sound | No "+1 🌾" on the piece; the piece card shows base output, never the adjacency bonus |
| Adjacency (well beside field, etc.) | Adds yield (`adjTotal`) | Only in the hover banner, before placing | Nothing after placement: no links, no bonus on the piece, lumped as "how it is arranged" in the ledger |
| Granary, stepwell, wall, fort… | ±1 yield, guard +2/+4, neglect ×3 | Painted plot fills in; a kit piece just stands | Protective effects show only when a raid or neglect happens |
| Grow to level 2 / 3 | +2 people, a bigger reach, a direction bonus, new items | The map sprite grows (good); a toast | The direction card is invisible; new items were hidden, so there is no "unlocked!" moment; the reach ring is faint |
| Jobs | Yields ×2 for the city's kind; guards | Workers drawn on buildings (kit) | No per-turn delta |
| Monument rising | Progress bar, stages 1–3 | Visible (good) | Shake and wrong sound |
| **Monument done** | +60 score, +10 katha, +2 📜 a turn forever, immune to mist and dust, keeps the city at the age turn, grant 15 | Painted: the hero un-dims. **Kit: nothing. Map: nothing.** Coin toast "+1" | **The biggest reward in the game is invisible** in 8 of 31 cities and everywhere on the map |
| Capital | +1 of everything, never dusty | Map ★ (good) | — |

---

## Part E. The payoff design: make every action pay off *where the child is looking*

**Principle.** A child should be able to answer "what did that do?" without opening a menu. Every action gets four
payoffs:
1. **an instant one**, at the finger;
2. **a lasting one**, on the board;
3. **a map one**, visible from the world;
4. **a story one**, a sourced line that feeds the riddles.

### E.1 Instant: at the finger
- **Floating yield** on placement and at every Agla Saal, rising from the piece: "+2 🌾", "+1 🛠️".
- **A success language:** a warm *chime*, a ring of light and a gentle bounce of the piece. Never the wrong sound, and
  never a transform on an ancestor of the city.
- **Adjacency, shown:** on hover and on placement, golden threads link the piece to the neighbours that boost it, with
  "+1 (beside the well)". The piece card lists its yield as **base + each bonus with its reason**.

### E.2 Lasting: on the board
- **Every building changes the scene:**
  - the granary fills visibly as grain stocks rise;
  - workshops show workers and a curl of smoke;
  - the gurukul has children under a tree;
  - the bazaar has an awning and stalls;
  - the stepwell catches water in the rain.

  These are kit animations and sprite states, already partly in `kitCrowd`.
- **Growth is a moment.** Level 2 and level 3 each get a short **"the city grows"** sequence: the reach ring expands
  with a visible outline, new tiles light, and an **"Unlocked:" card** lists the new pieces with their pictures. Those
  pieces were shown **🔒 at level 2** in the shelf beforehand, so the child sees them coming.
- **The monument is the headline:**
  - it rises over three stages;
  - on completion it is **drawn permanently** on the board with a ★;
  - the city's people gather around it once (a small *utsav*);
  - a soft **glow ring** radiates from it and visibly pushes back the mist on the board's edges, so the mist immunity
    is *seen*.

### E.3 On the map: visible from the world
- **City sprite tiers** (level 1 → 2 → 3) stay.
- **A monument glyph** sits on the site: a lit stupa, pillar, gopuram, minar or dome, matched to the city.
- **A glow radius** keeps the mist off nearby land on the map too.
- **Trade made visible:** roads carry small moving carts in proportion to the trade they carry, and sea roads carry
  sails. A connected, busy India *looks* alive.
- **The age lamp:** each lit lamp sits on Mithu's lamp-map in the corner. The campaign's spine is always in view.

### E.4 Story: a sourced line that pays off later
- **Each building unlocks one line of the city's own history** from `data-sabhyata.js` `more[]`, shown on its card.
  Examples: the stepwell at Dholavira gives "sixteen reservoirs stepped one into the next"; the bazaar at Lothal gives
  "carnelian beads that travelled as far as Mesopotamia". Each line carries its source.
- **Those lines become the riddles.** The questions a child is asked are the ones they have *already seen* on their own
  buildings, so building is how you learn, and the riddle pays (`answer` 1 for a first try).
- **The monument card** goes into the **Hall of Lamps** with a painting, the sourced fact and the badge. A child can
  revisit it.

### E.5 Numbers that matter
- **A turn report** after each Agla Saal. It is one line, never a modal: "+6 🌾 +4 🛠️ +3 📜 · Lothal grew · road
  to Kalibangan: 2 turns". Tapping a number explains it.
- **A goal strip** always visible: lamps lit, katha needed for the next age, and the next step.
- **The opening is tuned to be generous.** The first city nets **+2 grain** a turn; "restless" does not apply to a lone
  first city and is explained the first time it appears.
- **Coins are honest:**
  - the toast shows what was actually granted;
  - `stop` 5 per campaign chapter completed;
  - `answer` 1 per first-try riddle;
  - nothing for turns or time.

### E.6 The city UX pass (Part D fixes, as one list)

| # | Fix | Effort |
|---|---|---|
| 1 | Move `#sab-ovhost` out of `#sab-stage`, above the city; `ovclose` calls `paintCity()` | S |
| 2 | Rename the `warm` feed class (`sab-good`) or exclude `#sab-feed` from the observer; success fires a success cue; no `transform` on `#gframe` | S |
| 3 | Monument drawn on kit boards and on the map (D.2 a–b); dry-land anchors (d) | M |
| 4 | Save on every spend, completion, grow and hide (D.2 c) | S |
| 5 | Open the city centred on its heart, at a zoom that shows the whole reach; a visible reach outline | S |
| 6 | A **"Holding: Field · ⟲ Rotate · ✕ Put back"** bar while holding; drag-to-pan while holding; on-screen key hints on desktop | S |
| 7 | Rename "⟳ TURN" to **"⟳ View"** with a camera icon; Agla Saal is the only "turn" | S |
| 8 | Fix overlaps: Move vs Grow; the shelf vs Agla Saal and the HUD; job stations and the yatri vs plots. An `elementFromPoint` check per button in `check-sabhyata` | S |
| 9 | Show next-level items 🔒 with the level that unlocks them; "Unlocked:" after Grow; a compass on the board; fix the hardcoded "Dholavira itself…" | S |
| 10 | Desktop: an **"Enter Dholavira"** button in the sheet, as on phone | S |
| 11 | Job ± ≥ 44 px; ☰ and zoom ≥ 44 px | S |
| 12 | Floating yields, adjacency threads, a piece card with reasons (E.1) | M |
| 13 | Building scene states and the growth sequence (E.2) | M |
| 14 | Map monument glyphs, glow radius, moving carts and sails (E.3) | M |
| 15 | Building → history line → riddle pipeline (E.4) | M |

### E.7 Acceptance (city and payoffs)

| # | Check |
|---|---|
| C1 | Every card opened inside a city is visible (non-zero rect, on top), and closing it re-enables Agla Saal |
| C2 | No action in Sabhyata plays the "wrong" sound unless a riddle was answered wrongly; `#gframe` never gets a transform |
| C3 | After a monument completes: it is drawn on the kit board, the map shows its glyph, and both survive a reload |
| C4 | Reloading at any point loses no spend, piece, growth or monument (save on spend and on hide) |
| C5 | On entering any city, at least 80% of the legal build cells are on screen, and none of the visible taps answers "too far out" |
| C6 | While holding a piece, Rotate and Put back are visible, and panning works |
| C7 | Every on-screen button passes an `elementFromPoint` hit test at its centre, at both sizes |
| C8 | Every placement shows a floating yield, and the piece card lists each adjacency bonus with its reason |
| C9 | The first city nets ≥ +1 grain per turn at the start |
| C10 | Every riddle's question has appeared on one of the child's own building cards earlier in the run |

---

## Part F. *Mithu's Lamps*: the full storyline

**Approved by the owner.** Drafted strictly from `app/data-sabhyata.js`: every fact carries the data's own source.
**Guides are invented and labelled as invented; facts are not.** Items marked **[NEEDS SOURCE]** must be sourced or cut
before release. Chapters 8 and 11 are hard reviewer flags.

The payoffs in each chapter use Part E's layer. In particular, a chapter's riddles are drawn from the history lines its
buildings unlock (E.4).

## Mithu's Lamps: the Sabhyata campaign storyline

**Status:** draft for the owner and the named reviewer. Nothing here ships until docs/05 §4 sign-off. Chapters 3, 6, 8, 9, 10, 11 and 12 carry reviewer flags. Ch 8 and ch 11 are hard flags.
**Badge:** every chapter is 📜 **Itihaas**. Where a site's fame is story, not evidence, the card says *"the story goes…"* (the 🪔 Katha frame, inline), exactly as the data does.
**The only source of history** is `app/data-sabhyata.js`: site `fact`, `more[]`, `asks[]`, `sources[]`, `eras[].aha`, `treasures`, `darshan` and `sutras`. Every fact below is quoted or paraphrased from it, with the data's own source string. The guide characters are invented and labelled as invented on screen. The facts are not invented.

---

### 0. Overview

#### The frame

Mithu the parakeet, the storyteller (CONCEPT §4), keeps an old **lamp-map** of India with thirteen *age lamps*, one per era. All thirteen are dark: Vismriti, the grey mist, has made the land forget. The child is **Mithu's apprentice**.

- In each chapter the apprentice goes into one age and reaches its places: **explore → road → wake**. Waking is done by *telling*. Nothing is fought, conquered or claimed.
- When the chapter's goal is met, that age's lamp lights on Mithu's map.
- The apprentice keeps one **souvenir** in the **Hall of Lamps**. It is the anchor city's real *khazana* from `treasures`, so even the keepsake is sourced.
- Each chapter has one **guide**, an ordinary invented person of that age and place. Their card always says: *"Kesar is made up. Lothal is real."*

Vismriti is soft, slow and faceless (docs/04). It is sad, never scary, and it lifts when a place's story is told.

#### What the child learns across the 13 lamps

| Arc | Lamps | The thread a child can say back |
|---|---|---|
| **Water and making** | 1–2 | The first cities caught rain, drilled beads, ploughed fields. Rivers decided where people lived. |
| **Words that travel** | 3–4 | A king carved promises in rock coast to coast. Universities asked questions at the gate. Painters ground colours brought from far away. |
| **Stone and sea** | 5–7 | Ports sent pepper across the sea. Temples, towers and bazaars rose, and each took many hands and many years. |
| **Gardens, ships, trains, presses** | 8–10 | Gardens taught cities to breathe. Indian shipyards built for the world. Trains and printing presses knit the land together. |
| **Choosing together** | 11–13 | A walk to the sea for a handful of salt. A city drawn on a blank sheet. Rockets from an island of casuarina trees. |

There is also a thread that runs through every chapter: **India is a story still being told, and the child is its newest teller.** This is the data's own last sutra bead (`tellers`, era 12).

#### The systems-introduction ladder (one new system per chapter, at most)

| Ch | Era (data) | New system this chapter | Already known | Still held back for free play |
|---|---|---|---|---|
| 1 | The First Cities | **Explore · road · wake** (plus Mithu's riddles, which are the teaching layer in every chapter) | none | everything else |
| 2 | Rivers and Kingdoms | **The wilds** (raids from beasts and floods; the *rakshak* watch on the jobs panel) | 1 | buildings, Vidya, sea |
| 3 | The Great Sabha | **Vidya** (research, two doors in a chain) | 1–2 | buildings, sea, quarrels |
| 4 | The Age of Wonder | **City buildings** (gurukul and friends, and the teacher's questions) | 1–3 | sea, monuments |
| 5 | Temples and the Sea | **Sea roads** (overseas partners and their requests) | 1–4 | monuments |
| 6 | Domes and Minars | **Monuments** (three stages over time; karigars speed them) | 1–5 | goods |
| 7 | The City of Victory | **Goods and khushi** (variety, not volume; the bazaar) | 1–6 | utsav |
| 8 | Gardens and Marble | **Utsav** (the festival verb, made cheaper by the Char Bagh) | 1–7 | favour |
| 9 | Sails and Factories | **Trade deepened** (partner favour; prices fall as you sell) | 1–8 | quarrels |
| 10 | Railways and Presses | **Quarrels and the panchayat** | 1–9 | Riti |
| 11 | The Freedom Age | **Riti** (one custom, one policy card) | 1–10 | placement |
| 12 | The Young Republic | **Placement** (adjacency: a city laid out to a plan) | 1–11 | endings |
| 13 | The Takeoff | **The endings** (the four roads to an ending, checked; *India Remembers*) | all | none: free play unlocks |

These stay **free-play only** and never appear in the campaign: kingdoms and crowns, heroes, dedications and era score, wonders, sister realms, the diaspora quarter, explorer dedications, the khazana hunt (the souvenir is given, not hunted), and **every human raid kind** (§ Engine notes, E3).

#### Length and pay

- **Length:** about 15–20 minutes per chapter in *Sochna* mode (nothing moves until *Agla Saal*). Turn deadlines are 40–55 turns. The whole campaign is about 3½–4½ hours over many sittings.
- **Deadlines are soft.** Missing one never loses the chapter. Mithu says *"The mist is patient, and so are we — ten more turns,"* and the lamp still lights. The only cost is the chapter's ☆ *in good time* mark. Nothing is unrecoverable (docs/16 §8).
- **Pay per chapter, through the one pay path only** (india-games-spec §1.2):
  - `stop` **5** once per chapter per child, on completion with every riddle shown;
  - `answer` **1** per riddle right at the first try (2–3 riddles per chapter).
  - That is at most **8 coins a chapter** and about 104 across the campaign, under the ≤ 100-a-day family cap because chapters span days.
  - **The engine's `grant(40, 'a new age')` must not fire in the campaign.** It is a second pay door (E6).
- **Riddles follow spec §2.1 item 3:**
  - the question is shown;
  - **one try scores**;
  - a miss shows the right answer *and its source line*;
  - options are shuffled per city.
  - Distractors are written to be **plausible and plainly false**. Where possible they are true facts *from another place in the game* ("that was Lothal"), so a miss still teaches.

#### Age bands (spec §2.1 item 6, docs/05 §3 table)

| Band | Chapters | What changes |
|---|---|---|
| **4–7** | 1–3 | Waking and roads only. Ch 2's raids are drums-and-lanterns cards with no jobs panel. Ch 3 comes with the Edicts already learned and no tree. Any mention of the Kalinga battlefield is omitted. |
| **8–10** | 1–13 | Ch 9–11 use the docs/05 "simple" register ("Britain ruled India and Indians won freedom back", pending a sourced line, see the [NEEDS SOURCE] list). |
| **11–12** | 1–13 | Fuller wake cards (`more[]`). Still no war, no Partition, no communal conflict in a game. |

---

### Chapter 1 — The First Cities

**Era:** 3300–1300 BCE · **Badge:** 📜 Itihaas · **Anchors:** Dholavira (its reservoirs and the north-gate signboard), Lothal (the great basin, the beads), Rakhigarhi, Kalibangan

#### Hook (Mithu, read aloud, ~85 words)
> "Squawk — apprentice! Look at my old lamp-map. Every lamp is a real place, and every lamp is dark, because Vismriti, the grey mist, has made the land forget. A lamp wakes when someone reaches it and tells its story. Our first is Dholavira — a planned stone city on an island in the Rann. It caught the rain in great stone reservoirs, in a land with almost none. Kesar is waiting at the gate. Shall we light the first lamp?"

#### Guide
- **Kesar** *(invented)*, about 11, a bead-maker's daughter from the coast near Lothal. Quick hands, slow patience, proud of a drill bit thinner than a grass stem.
- On-screen note: *"We don't know what the people of these cities called themselves or their children — nobody can read their script yet. We've called her Kesar."*
- **Mithu** opens the lamp-map, teaches the three verbs one at a time (his tap *does* the step or points at it, spec item 2), and asks the riddles.

#### Scenario preset
```
era: 0 (harappa)
awake + found: dholavira            // the first city needs no road and wakes free (docs/16 §2)
asleep, unfound: lothal, rakhigarhi, kalibangan
routes: none · techs: none · riti: none · capital: none
res: { anna: 60, kala: 60, katha: 0 }
systems ON: explore, road, wake, riddles
systems OFF: buildings, jobs, raids, events, quarrels, Vidya, Riti, sea, monuments, utsav, quests other than Mithu's
raidPool: ['mist']  — scripted once (beat 4), never random
turns: 40 (soft)
win: all four awake AND each on a route (connected)
```

#### Story beats
1. **The gate.** Dholavira wakes free and its fact card plays. Kesar shows the apprentice the stepped reservoirs. Mithu asks Riddle 1.
2. **First explorer.** Mithu points: *"Somewhere south, the sea. Send an explorer — twenty anna of food for the road."* The fog opens along the lamp and Lothal is *found*. Finding pays katha (spec S2: a city woken within 10 turns).
3. **First road, first wake.** A road from Dholavira to Lothal, then waking Lothal by telling. Kesar's home lights up: bead workshops and the great basin. Riddle 2.
4. **Twist — the mist pushes.** Kalibangan, found far to the north, stands awake but unroaded and begins to fade: *"the grey is thickening at the edges"* (`mist` raid kind's own warn line). Mithu: *"A road keeps the mist off. Hurry, gently."* The child builds toward it and the lamp steadies. This teaches the game's oldest promise: connected places can't be taken by the mist.
5. **The ploughed field.** At Kalibangan the furrows still cross in the ground. Riddle 3.
6. **The largest town.** Rakhigarhi wakes last: the largest Harappan-era settlement found in India, with a living village on top of the mounds today.
7. **Ending — a ship at Lothal.** A told card, not a system. Kesar watches a cargo of carnelian beads leave the basin: *"Lothal beads travelled as far as Mesopotamia."* Mithu: *"Ships will matter later. Remember this one."* This foreshadows ch 5.
   - *Change from the spec table:* "send a bead cargo by sea" moves from a goal to a told beat. Sea roads are ch 5's one new system.

#### Riddles
| # | Question | Options (✓ = answer) |
|---|---|---|
| R1 | What did Dholavira build to keep its water? | ✓ Great stone reservoirs, stepped one into the next · A great brick basin for ships *(that was Lothal)* · A canal dug from the Ganga |
| R2 | Lothal's workshops made something so tiny a whole necklace can pass through a bangle. What? | ✓ Carnelian beads · Painted grey bowls *(that is a later age, at Hastinapura)* · Spotted red sandstone statues *(that is Mathura, much later)* |
| R3 | What does the name Kalibangan mean? | ✓ Black bangles · Black river · Bangle-makers' town |

#### Payoff
- **Map:** four lamps lit across the northwest. The fog rolls back off Gujarat, Rajasthan and Haryana, and colour blooms outward from each pin (docs/04 "mist recede").
- **City:** Dholavira shows `works[0]` "mud-brick homes" and Lothal "the bead workshops".
- **Aha card (the era's `aha`):** **Iron.** *"People learn to work iron. Tools open the forests, and the rivers become highways to new homes in the east."*
- **Kept:**
  - Age lamp 1 on Mithu's map.
  - Hall of Lamps souvenir: **The great signboard** — *"Ten large symbols of cut white stone — perhaps the world's oldest big sign. Nobody alive can read it. Yet."* (src: ASI Dholavira excavations, the north-gate signboard)
- **Coins:** stop 5 + up to 3 = **8**.

#### Facts used
- Dholavira is a planned stone city on an island in the Rann with great reservoirs; sixteen reservoirs stepped one into the next; three nested parts; ten signs fallen by the north gate. *NCERT, Our Pasts I, "In the Earliest Cities"; ASI Dholavira excavation literature; UNESCO (2021); Bisht/ASI on the city plan.*
- Lothal: bead-makers by the sea; a great brick basin *many archaeologists read as a dockyard*; carnelian beads to Mesopotamia; cube weights doubling in size. *NCERT, Our Pasts I; S. R. Rao, ASI Lothal reports (the dockyard reading is his, and is debated).*
- Rakhigarhi: the largest Harappan-era settlement found in India; a living village on top of the mounds. *ASI / Deccan College Rakhigarhi excavations; NCERT, Our Pasts I.*
- Kalibangan: a ploughed field older than almost any other; the name means "black bangles". *B. B. Lal & B. K. Thapar, ASI Kalibangan excavations; NCERT, Our Pasts I.*

#### Editorial notes
- The dockyard is said as *"many archaeologists read it as…"*, as the data does.
- **Do not use** the `pashupati` sutra bead (era 0, Lothal; `review: true`) or the `river` sutra's Ghaggar-Hakra bead (`review: true`, Sarasvati-adjacent, a contested chronology docs/16 §3 keeps out). Both stay off in the campaign.
- `hands` (Dholavira, standard brick) may fire. It is review-free.
- Dholavira's decline ("a long drying") is a wake-card `more[]` line for 11–12 only. It is not a beat.

---

### Chapter 2 — Rivers and Kingdoms

**Era:** 1500–600 BCE · **Badge:** 📜 Itihaas (Hastinapura's fame told *"the story goes…"*, 🪔 inline) · **Anchors:** Kashi on the Ganga; Hastinapura's flood layer; Vaishali's assembly; Ujjain

#### Hook (~80 words)
> "Iron came, and the forests opened, and people followed the rivers east. Four places sleep along the new roads. The story goes that Hastinapura was the Pandavas' capital — and under the village today is a real mound, dug layer by careful layer. Kashi on the Ganga has woken beside the river for three thousand years. And in Vaishali, hundreds sat together and voted! But the rivers rise in this age. Megh knows the water. Let's go."

#### Guide
- **Megh** *(invented)*, about 70, a ferryman who has crossed the Ganga more times than he can count. He reads the river's colour the way Kesar read stone.
- **Mithu** teaches the watch: who stands at the gate when something comes.

#### Scenario preset
```
era: 1 (janapada)
heritage (awake, lamp lit, monument shown): dholavira, lothal, rakhigarhi, kalibangan   // chapter 1's lamps, honoured
awake + found: hastinapura   // the first lamp of the age wakes free, as Dholavira did
asleep, unfound: kashi, ujjain, vaishali
routes: none · techs: plough, brick, weights, reservoir (era 0) · riti: grama
res: { anna: 70, kala: 80, katha: 20 }
systems ON: ch1 + raids (beast/nature only) + jobs panel limited to kisan, rakshak
raidPool: ['boar', 'flood', 'locust', 'mist']; first raid is scripted (beat 3)
turns: 45 (soft); ☆ "before the floods" if all routed by turn 30
win: all four awake AND routed into one network
```

#### Story beats
1. **Megh's ferry.** The age's aha (Iron) replays as a single line. Megh points downriver: *"Kashi is that way. People have been waking up beside this river there for three thousand years."*
2. **The watch.** Mithu opens the jobs panel with only two jobs: kisan (farms, feeds everyone) and rakshak (keeps watch, earns nothing). *"A watch, not an army. Nobody here is ever hurt."*
3. **First raid (scripted): boar in the wheat.** The warn line is *"Something is moving in the fields."* Two rakshaks drum and wave torches *"till the boar trot back to the forest."* A fended raid **earns katha**: the story of the night the boar came is worth telling.
4. **Kashi and Vaishali.** Kashi wakes (Riddle 3 later). Vaishali wakes on its assembly: *hundreds sitting together, arguing and voting.* Riddle 2.
5. **Twist — the river rises at Hastinapura.** A scripted `flood` raid: *"The river is rising fast."* If two rakshaks are on watch, *"the rakshaks raise the bunds and carry the stores to high ground in time."* If not, some kala is lost and Hastinapura stays awake.
   - Then Megh says the line that makes this chapter: *"When diggers cut into this mound in the 1950s they found a thick flood layer. The river truly drowned the town once, much as the old story says."* Riddle 1.
6. **Ujjain, the crossroads.** The fourth lamp is the city where the trade roads met, later so famous for star-watching that astronomers drew their zero line of longitude through it.
7. **Ending.** All four on one road network. Megh poles the apprentice back across: *"Rivers carry people. Next, they'll carry words."*

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | What did diggers find in Hastinapura's mound that matches the old story? | ✓ A thick flood layer · Great stone reservoirs *(that was Dholavira)* · A brick dockyard *(that was Lothal)* |
| R2 | How did the Licchavis of Vaishali run their city? | ✓ By assembly — hundreds arguing and voting · By one king's word alone · By whoever owned the most land |
| R3 | What happened at Sarnath, just outside Kashi? | ✓ The Buddha gave his very first teaching · Ashoka was crowned · A great reservoir was cut into the rock |

#### Payoff
- **Map:** four river lamps in the north and centre. The Ganga's course glows under the new road (rivers are terrain only, never a boundary).
- **Aha:** **Script and Edicts.** *"Writing returns to the land — and Ashoka uses it to talk to everyone, carving his promises onto rocks from coast to coast."*
- **Kept:**
  - Age lamp 2.
  - Souvenir: **A painted grey bowl** — *"Painted Grey Ware — the fine grey pottery of the age the epics remember; archaeologists found it right here."* (src: B. B. Lal, Hastinapura excavations, PGW)
- **Coins:** up to **8**.

#### Facts used
- Hastinapura: *the story goes* it was the Kauravas' and Pandavas' capital; a real mound; the 1950s flood layer; Painted Grey Ware. *B. B. Lal, ASI Hastinapura excavations (1950–52); Mahabharata (Katha frame); Puranic chronicles with Lal's correlation.*
- Kashi: among the oldest continuously lived-in cities, about three thousand years by the Ganga; Sarnath, the first teaching; the lion capital is now India's emblem. *NCERT, Our Pasts I; ASI Rajghat; Sarnath lion capital (State Emblem).*
- Vaishali: the Licchavis ran the city by assembly; the Kolhua pillar. *NCERT, Our Pasts I (gana-sanghas); ASI Vaishali, the Kolhua pillar.*
- Ujjain: a crossroads; the zero line of longitude. *NCERT, Our Pasts I–II; history of Indian astronomy literature (Ujjayinī meridian).*

#### Editorial notes
- **Exclude the `warband` raid** (era [1,2], human: "a rival janapada's war-band"). Never in the campaign.
- **Darshan cards** `buddha` (Kashi) and `mahavira` (Vaishali) fire in era 1. In the campaign they play as **told cards with no boon** until the reviewer signs (spec §2.1 item 7). Faith from the inside: the Buddha "a middle way… kindness to every living thing"; Mahavira "ahimsa", in the data's words.
- The `walkers` sutra beads (review) are off. `tellers` (Vaishali, reciters) and `starcounters` (Ujjain) may fire.
- R3 deliberately does **not** use Mahavira as a distractor for the Buddha, to avoid setting two traditions against each other in a trap.

---

### Chapter 3 — The Great Sabha

**Era:** 321–185 BCE · **Badge:** 📜 Itihaas · **Anchors:** Ashoka's rock edicts at Dhauli; the edict fragment at Sopara; Pataliputra; Sanchi

#### Hook (~85 words)
> "One vast realm, run from Pataliputra, a city with wooden walls that a Greek visitor wrote home about. Its king had his promises carved into rock — and above the letters at Dhauli, the front half of an elephant steps out of the stone to make you look. The same words reached all the way to Sopara, a port on the other sea. Ila cuts letters into stone for a living. Can we carry the words from coast to coast?"

#### Guide
- **Ila** *(invented)*, about 20, a letter-cutter's apprentice near Dhauli in the east. She cares about one thing: that a letter is cut deep enough to outlast her.
- **Mithu** opens the Vidya panel: *"Two doors. Learn the script, then the edicts."*

#### Scenario preset
```
era: 2 (maurya)
heritage: era-0 sites · awake + routed: hastinapura, kashi, ujjain, vaishali (one network)
awake + found + CAPITAL: pataliputra   // shown, not taught: "one vast realm run from Pataliputra" (era note)
asleep, unfound: sanchi, dhauli, sopara
techs: era 0–1 (plough, brick, weights, reservoir, iron, panchayat, dock) · riti: grama, shreni, dana
res: { anna: 80, kala: 90, katha: 50 }
systems ON: ch1–2 + Vidya (only `script` and `edict` doors shown this chapter)
raidPool: ['boar', 'elephant', 'flood', 'locust', 'mist']
turns: 45 (soft)
win: tech.script AND tech.edict learned; dhauli AND sopara awake and in ONE network with pataliputra
```

#### Story beats
1. **The capital.** Pataliputra glows with ★ capital already set. The wake card plays: Megasthenes, amazed at wooden walls said to run for miles.
2. **First door: Brahmi Script.** Research takes turns. Mithu, from the tech's own line: *"Written down, a question travels."*
3. **East to Dhauli.** An explorer, a road and a wake. Ila shows the rock. Riddle 1.
4. **Twist — an elephant herd at the stores.** A scripted `elephant` raid at Dhauli: *"The forest edge is crashing."* The fending line: *"the rakshaks guide the herd away with lanterns, drums and a clear path out."* Ila laughs: *"Look up. The elephant on the rock is gentler than this lot."* Riddle 2.
5. **Second door: the Edicts.** Its effect is that every woken city earns +1 📜, *words cut where everyone passes*. Mithu watches the katha on every lamp tick up together.
6. **West to Sopara, by way of Sanchi.** Sanchi's stupa on its quiet hill, and the gateway signed by the ivory-carvers of Vidisha (Riddle 3). Then Sopara, the ancient western port where a fragment of Ashoka's edicts was found in the soil.
7. **Ending.** One road from sea to sea through the capital. Ila: *"The same words at both ends. That's what a letter is for."*

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | What did Ashoka have carved into the rock at Dhauli? | ✓ His promises to rule by care, not conquest · A map of all his roads · The names of every town in the realm |
| R2 | What steps out of the rock above Dhauli's edicts? | ✓ The front half of an elephant · A lion with four faces *(that is the Sarnath capital, near Kashi)* · A great stone wheel *(that is Konark, much later)* |
| R3 | Who gave Sanchi's south gateway, by its own carving? | ✓ The ivory-carvers of Vidisha · The sailors of Sopara · The bead-makers of Lothal |

#### Payoff
- **Map:** a single lit line from the east coast to the west coast, through Pataliputra.
- **Aha:** **Zero.** *"In these centuries Indian thinkers treat nothing as a number. Zero will travel further than any army ever did."*
- **Kept:**
  - Age lamp 3.
  - Souvenir: **The elephant's gentle eye** — *"Up close, the Dhauli elephant's eye is carved soft and kind — a message with no words at all."* (src: ASI Dhauli rock-cut elephant)
- **Coins:** up to **8**.

#### Facts used
- Pataliputra: Mauryan capital; Megasthenes and the wooden walls; Kumhrar's eighty-pillared hall. *NCERT, Our Pasts I (Mauryas); Megasthenes' Indica (via later Greek writers); ASI Kumhrar excavations.*
- Dhauli: promises carved by the Kalinga battlefield; the elephant above the edicts; the officers' edicts, *all people are my children* (data paraphrase). *Ashokan rock edicts at Dhauli (ASI); NCERT, Our Pasts I (Ashoka).*
- Sanchi: the stupa begun in Ashoka's time; the ivory-carvers' gateway. *ASI Sanchi; UNESCO; south gateway inscription.*
- Sopara: a western port; the edict fragment. *ASI Sopara (Shurparaka) finds, incl. the VIII rock edict fragment.*
- Era aha "from coast to coast": `eras[1].aha`.

#### Reviewer flags
- **Kalinga.** The data says *"by the Kalinga battlefield"* and *"after Kalinga, a king who chooses remorse."* Per docs/05 §3: **4–7 omit it**; 8–10 get "kingdoms sometimes fought", in the data's words only; 11–12 as written. No battle is shown or evoked.
- **Ashoka's words.** Any line in quotation marks must be checked against the Separate Rock Edict text before release. The data line is a paraphrase and is presented as one ("the letters say…"), never as a verbatim quotation.
- **Exclude** the `warband`, `rivalking` and `frontier` raids (human, era 2).
- The akal (drought) timer starts at era 2. It is **muted in ch 3** so the twist stays the scripted one. Akal is used in ch 8.

---

### Chapter 4 — The Age of Wonder

**Era:** c. 320–700 CE · **Badge:** 📜 Itihaas (Mathura's Krishna line told *"the story goes…"*) · **Anchors:** Nalanda's gate; Ajanta's painted caves; Mathura's sculptors; Madurai's sangam

#### Hook (~85 words)
> "This age has a university so famous that a traveller called Xuanzang walked all the way from China and stayed for years. But you couldn't just walk in — the gatekeeper asked hard questions, and many were turned away! Far to the west, painters filled cliff-caves with stories in colour. Their blue came over the mountains from Afghanistan. Nilu grinds those colours. Let's build a gurukul at Nalanda and bring it learners from three cities."

#### Guide
- **Nilu** *(invented)*, about 13, a colour-grinder's apprentice at Ajanta, blue to the elbows. He wants to see Nalanda's library and isn't sure they'll let him past the gate.
- **Mithu** is the gatekeeper this time. His riddles are the "gate questions".

#### Scenario preset
```
era: 3 (gupta)
heritage: era 0–1 sites (kashi stays live: it carries later names)
awake + routed: pataliputra (capital), sanchi, dhauli, sopara, kashi
asleep, unfound: nalanda, ajanta, mathura, madurai
techs: era 0–2 (incl. script — so the teacher can ask about any woken city) · riti: era 0–2
res: { anna: 100, kala: 100, katha: 60 }
systems ON: ch1–3 + city buildings (granary, workshop, gurukul, bazaar, stepwell) + the gurukul teacher's questions
raidPool: ['elephant', 'flood', 'locust', 'mist']
turns: 45 (soft)
win: gurukul built in nalanda; nalanda routed to ≥ 3 other awake cities;
     the Nalanda teacher's questions answered right about 3 DIFFERENT cities (new counter; any try)
```

#### Story beats
1. **Nalanda wakes** (near Pataliputra): *a university with thousands of students and a library said to have towered stories high.* Mithu at the gate asks Riddle 1.
2. **Inside a city for the first time.** Mithu shows the building board, with every price shown up front: granary, workshop, **gurukul** (+1 📜, *and the teacher will take questions here*).
3. **West to Ajanta.** Nilu's cliff-caves: *the Jataka tales in colour, still glowing in the dark after fifteen centuries.* Riddle 2.
4. **Mathura.** *The story goes* that Krishna was born here, and in the same city workshops carved some of the most loved sculpture in India's history. Riddle 3.
5. **Twist — locusts on the fields.** A scripted `locust` raid: *"A brown cloud is coming over the fields."* *"Everyone under the rakshaks' lead beats pans and smokes the swarm onward."* The child learns that a granary built earlier softens the blow.
6. **Far south: Madurai.** *The old tellings say poets gathered here in academies called sangams.* This makes the gurukul's third city a long road away, and the south is on the map (docs/05 "the whole map").
7. **The gate exam.** The Nalanda teacher asks about three cities the child has woken, in this chapter or earlier. This is recall across the whole map. Nilu gets in. *"Na-alam-da — giving without a stop. They didn't turn me away."*

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | How did Nalanda choose its students, by Xuanzang's telling? | ✓ The gatekeeper asked hard questions at the door · By the town they came from · By how far they had walked |
| R2 | Where did Ajanta's deep blue colour travel from? | ✓ The lapis mountains of Afghanistan · The river clay below the cliff · Seashells from the western coast |
| R3 | Mathura's carvers worked a stone you can recognise at a glance. Which? | ✓ Spotted red sandstone · White marble *(that is Agra, much later)* · Black granite |

#### Payoff
- **Map:** four new lamps north, west and south. A gurukul icon glows at Nalanda.
- **City:** Nalanda shows `works[1]` "the first halls", or `works[2]` "the towering library" if grown.
- **Aha:** **Ships and Temples.** *"Sailors ride the monsoon winds to trade across the seas, and in the south rise temples taller than anything the land has seen."*
- **Kept:**
  - Age lamp 4.
  - Souvenir: **The university's seal** — *"A clay sealing reading of the venerable community of monks of great Nalanda — the university's own signature."* (src: ASI Nalanda excavations, monastic sealings)
- **Coins:** up to **8**.

#### Facts used
- Nalanda: thousands of students; Xuanzang stayed years; the gate questions; students from China, Korea, Tibet and Java; na-alam-da *as Xuanzang heard it told*. *Xuanzang's account (Si-yu-ki); ASI Nalanda; UNESCO; NCERT, Our Pasts I.*
- Ajanta: painted caves, the Jataka tales; about thirty caves in two waves; lapis blue. *ASI Ajanta; UNESCO; pigment studies of the Ajanta murals.*
- Mathura: *the story goes* Krishna was born here; workshops; spotted red sandstone. *Mathura school (standard art history); Krishna tradition (Katha frame); Government Museum, Mathura.*
- Madurai: sangam academies *(the old tellings)*; Madurai-kanchi. *Sangam literature corpus; NCERT, Our Pasts I.*

#### Editorial notes
- **Darshan** `krishna` (🪔, the kathakars singing of Krishna) and `aryabhata` (📜) fire in era 3. They are told cards with **no boon** pending review. Krishna's card is *the singing*, the honest frame.
- Madurai's `more[]` lines about the Meenakshi temple and the nectar *telling* are wake-card lines, from the inside, and only in the 11–12 band. **No player ever "builds" a living temple as a power-up** (see ch 5).
- **Exclude** the `huna` and `rivalking` raids (human).
- `tellers` (Madurai) and `starcounters` (Pataliputra, Aryabhata) beads may fire.

---

### Chapter 5 — Temples and the Sea

**Era:** c. 700–1300 CE · **Badge:** 📜 Itihaas · **Anchors:** Mamallapuram's chariot-shaped temples; Muziris, the pepper port; Thanjavur; Konark

#### Hook (~85 words)
> "Smell that? Pepper! This age, the south builds in stone and sails east, and pepper leaves Muziris for the whole world. A Roman contract written on papyrus still lists a ship's cargo out of this port. Up the coast at Mamallapuram, carvers tried everything — temples shaped like chariots, a whole cliff carved into one crowded, joyful scene. Kayal knows the winds. Let's open the sea road to the spice port."

#### Guide
- **Kayal** *(invented)*, about 40, a ship's pilot on the Tamil coast who reads the monsoon like a calendar. She's patient with landlubbers and impatient with rope tied badly.
- **Mithu** opens the "Sea roads" panel: *"Nobody out there is an enemy, and nobody can be. They ask, they pay, they remember."* (The panel's own words.)

#### Scenario preset
```
era: 4 (chola)
heritage: era 0–2 sites (renames carried: kashi, pataliputra)
awake + routed: nalanda, ajanta, mathura, madurai, kashi, pataliputra
asleep, unfound: mamallapuram, thanjavur, konark, muziris
techs: era 0–3 · riti: era 0–3
res: { anna: 110, kala: 120, katha: 70 }
systems ON: ch1–4 + sea roads (partners for era 4: Greek cities, China, Srivijaya; requests; envoys)
raidPool: ['elephant', 'locust', 'mist', 'cyclone']   // cyclone borrowed from its era range (E3)
turns: 45 (soft)
win: muziris awake AND on a route; ≥ 2 partner requests filled, from 2 different partners
```

#### Story beats
1. **Down the coast.** Mamallapuram wakes: *a Pallava harbour town where sculptors tried everything.* Kayal points at the chariot-temples. Riddle-free; the wake card does the work.
2. **The sea roads open.** A ship from Srivijaya asks for *workshops of the south*. Mamallapuram is one, so the child can send. This teaches: **a request is answerable only if a road reaches the good.**
3. **Thanjavur.** *Rajaraja Chola raised a temple here so tall its shadow was a wonder of the age, and its walls carry the accounts of the whole kingdom.* Riddle 3 is about the walls' ledger of dancers and musicians, the most human fact in the data.
4. **Twist — a cyclone comes up the coast.** *"The sea is wrong — a cyclone is coming."* *"The boats are hauled up, the roofs lashed, and everyone is inside before it lands."* Kayal: *"The sea gives and the sea asks."* Konark wakes after the storm, the sun god's chariot with stone wheels that tell the time. Riddle 2.
5. **Muziris.** The long road west to the pepper port. Kayal tells the data's lines: *Roman writers grumbled about the gold their ships spent here*; a Tamil poem sings of the Yavana ships *arriving with gold and leaving with pepper.* Riddle 1.
6. **A second partner.** China (*monks who will walk for two years to read in your halls*) asks for *learning of the east*. Nalanda and Pataliputra supply it, so ch 4's work pays twice.
7. **Ending.** Kayal raises a sail: *"Out on the wind and home again."*

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | What left Muziris for the wider world? | ✓ Pepper · Marble · Horses |
| R2 | What can Konark's carved stone wheels do? | ✓ Tell the time, like sundials · Turn and roll the temple along · Ring like bells when tapped *(that is Hampi's pillars, later)* |
| R3 | What do the Thanjavur temple's walls record, name by name? | ✓ Its dancers, musicians and workers · The price of pepper in every port · The stars of every night of the year |

#### Payoff
- **Map:** the coastline lights. Thin sea-road threads run out from the ports to partner names at the map's edge (never a boundary, never a coloured area).
- **Aha:** **Paper.** *"Paper-making arrives along the trade roads. What took a palm-leaf a page now fills a book — and ideas start travelling faster than the people who carry them."*
- **Kept:**
  - Age lamp 5.
  - Souvenir: **A Roman gold coin** — *"Hoards of Roman gold have been dug from this coast — the pepper trade pulled coins across the whole world."* (src: Roman coin hoards of the Malabar coast; Pattanam excavations)
- **Coins:** up to **8**.

#### Facts used
- Mamallapuram: Pallava harbour; chariot temples; the carved cliff; named for Mamalla, "the great wrestler". *ASI Mamallapuram; UNESCO; NCERT, Our Pasts II.*
- Thanjavur: Rajaraja Chola's temple; walls record 400 dancers and 200 musicians. *Brihadisvara temple inscriptions (ASI; the numbers are inscriptional); UNESCO; NCERT, Our Pasts II (Cholas).*
- Konark: the sun god's chariot; wheels as sundials. *ASI Konark; UNESCO; NCERT, Our Pasts II.*
- Muziris: pepper port; the papyrus contract; the Yavana ships verse; Pattanam *which many think was Muziris*. *Periplus; Pliny; Akananuru 149; the Muziris papyrus (P. Vindob. G 40822); Pattanam literature (the identification is discussed).*
- Partners' links are cited in the data's partner comment block (Srivijaya: Rajendra I's Thanjavur inscription, in data-itihaas.js).

#### Reviewer flags
- **Living temples are woken and told, never built as power-ups.**
  - Thanjavur's monument is `works[2]` "the great temple's shadow". Konark's is a Sun temple, and Madurai's gopurams belong to a living shrine.
  - The campaign **never makes a place of worship the chapter's build target**. Its build target is the port.
  - Whether the engine's *monument* verb should apply to living shrines at all is a docs/05 question for the reviewer (spec §2.1 item 7, "shrine wonders giving power-ups").
- **Exclude** the `searaid` raid (human, "strange sails").
- **Rome is not a partner** in the data. The Roman trade appears only in told lines; the "Greek cities" partner is not relabelled.
- The 2004 tsunami line (`mamallapuram.more[1]`) is a modern disaster with loss of life. Keep it out of the chapter's beats. It is a wake-card line for 11–12 only, if at all.
- The `pashupati` and `walkers` beads at Thanjavur and Kashi (review) are off. `hands` (Chola lost-wax casting) may fire.

---

### Chapter 6 — Domes and Minars

**Era:** c. 1200–1400 CE · **Badge:** 📜 Itihaas · **Anchor:** Delhi: the Qutb Minar, and the iron pillar in its courtyard

#### Hook (~80 words)
> "Delhi isn't one city — it's many, stacked in one place, each age raising its own. In this age a fluted stone tower goes up, taller than anything in the land. But nothing great is instant: the tower grew in stages, begun by one ruler, finished by another, mended after lightning by builders from two more dynasties. Four dynasties in one tower! Hira has carried stone his whole life. Let's raise the Minar — and keep its builders fed."

#### Guide
- **Hira** *(invented)*, about 60, a stone-mason whose hands know the weight of every block. He hums while he works and never hurries a course of stone.
- **Mithu** explains a monument's three stages and why karigars speed it.

#### Scenario preset
```
era: 5 (minar)
heritage: era 0–3 sites (kashi→Banaras and pataliputra→Patna carried, renamed this age)
awake + routed: mamallapuram, thanjavur, konark, muziris, kashi (Banaras), pataliputra (Patna)
asleep, unfound: delhi
techs: era 0–4 (incl. temple, stupa → monuments cheaper/faster) · riti: era 0–4
res: { anna: 140, kala: 140, katha: 90 }
systems ON: ch1–5 + monuments (stages over turns; karigar speed; durg shelters a rising monument)
raidPool: ['locust', 'mist', 'storm*']   // storm = a nature kind the data lacks for era 5 (E3, NEEDS DATA ROW)
turns: 50 (soft)
win: delhi awake, routed, level 3; its monument (works[2] "the Qutb Minar touches the sky") raised;
     realm anna net ≥ 0 for the last 5 turns of the build ("keep the builders fed")
```

#### Story beats
1. **Banaras and Patna.** The names change and the city is the same city (the engine's rename line). Mithu: *"Kashi answers to Banaras now. Same river, same lamps."*
2. **Explore north.** An explorer from Banaras finds Delhi. Hira: *"City upon city has risen on this ground beside the Yamuna."*
3. **Grow Delhi to level 3.** Workshops and karigars. The anna balance matters now: *everyone eats*, so more karigars means more anna needed.
4. **The foundation and the walls.** The monument's first two stages rise over turns. Each karigar in Delhi speeds the work. Riddle 2.
5. **Twist — lightning on a rising tower.** A storm knocks the rising monument back one stage, unless a durg (fort) stands beside it. Hira, unbothered: *"The tower was mended after lightning once, by builders from two more dynasties. We'll mend it too."* This mirrors the data's *mended after lightning by Tughlaq and Lodi hands*.
6. **The iron pillar.** While waiting, Hira shows the pillar *that has barely rusted. Metalworkers still study how the old smiths managed it.* Riddle 1.
7. **The top stone.** The Minar stands. *Stone remembers.* Ibn Battuta's line closes it: *he counted the city among the greatest he had seen.* Riddle 3.

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | What is strange about the iron pillar at the Qutb? | ✓ It has barely rusted in all these centuries · It is hollow, like a pipe · It was cast in a single night |
| R2 | The Qutb Minar grew in stages. Builders from how many dynasties worked on it? | ✓ Four · One · Ten |
| R3 | Which world traveller served as a judge in Delhi? | ✓ Ibn Battuta · Xuanzang *(he studied at Nalanda)* · Megasthenes *(he wrote about Pataliputra)* |

#### Payoff
- **Map:** Delhi's lamp, with a ★ monument glyph that the mist can never touch.
- **City:** the plate turns from desaturated to colour as the top stone lands (docs/16 "remembered into colour").
- **Aha:** **The Charkha.** *"The spinning wheel reaches every courtyard. Thread that took a week now takes a day — and Indian cloth becomes a gift the whole world asks for."*
- **Kept:**
  - Age lamp 6.
  - Souvenir: **The pillar that will not rust** — *"The Mehrauli iron pillar has stood sixteen centuries nearly rust-free — metallurgy the world still studies."* (src: the Mehrauli iron pillar (Gupta period); IIT metallurgical studies)
- **Coins:** up to **8**.

#### Facts used
- Delhi: city upon city by the Yamuna; the Qutb Minar, a fluted stone tower taller than anything in the land, ringed by India's first great arches and domes; the walls of seven cities and more. *NCERT, Our Pasts II, "The Delhi Sultans"; ASI Qutb complex; UNESCO (1993).*
- Built in stages: begun by Aibak, finished by Iltutmish, mended after lightning by Tughlaq and Lodi hands. *Qutb Minar construction history (ASI).*
- The iron pillar barely rusted. *Iron Pillar corrosion studies (IIT Kanpur / R. Balasubramaniam).*
- Ibn Battuta as a judge in Delhi. *Ibn Battuta, Rihla.*

#### Reviewer flags
- **The Qutb complex's own history touches religious conflict.** The complex's mosque and its building materials are a communal and contested topic that docs/05 keeps out of 4–10 and allows only "where unavoidable, factually" at 11–12. The chapter speaks **only** of the tower, the pillar and the stacked cities, exactly as the data does. The reviewer confirms that this silence is honest, not evasive, and whether an 11–12 note is wanted.
- **Exclude the `mongol` and `timur` raids** (human, era 5). The engine currently *would* roll them.
- "Rulers are people, not teams" (docs/05 §3): the four dynasties are named only as builders of one tower.
- Kashi's era-5 sutra beads (`pashupati`, review) are off.

---

### Chapter 7 — The City of Victory

**Era:** c. 1336–1600 CE · **Badge:** 📜 Itihaas · **Anchor:** Hampi: its long bazaars, the stone chariot of Vittala, the ringing pillars

#### Hook (~80 words)
> "Travellers wrote home in plain disbelief: in Hampi's bazaars, pearls and gems were sold in open heaps, like grain! A visitor who knew Lisbon said the city seemed as large as Rome. Its king, Krishnadevaraya, wrote poetry himself — a whole Telugu poem on how a king should care for his people. Malli's family keeps a stall in the long bazaar. A good market needs many different things, not lots of one thing. Let's fill it."

#### Guide
- **Malli** *(invented)*, about 12, whose family weighs goods at a stall in Hampi's bazaar. She can tell a fair pan from a crooked one by the sound.
- **Mithu** introduces **khushi**: *"Variety, not volume. A realm is content when its roads reach many different things."*

#### Scenario preset
```
era: 6 (vijaya)
heritage: era 0–4 sites; Delhi live (its era is one behind; its Minar stands if the preset carries ch6's)
awake + routed: delhi, kashi (Banaras), pataliputra (Patna)
asleep, unfound: hampi
techs: era 0–5 (incl. paper) · riti: era 0–5
res: { anna: 140, kala: 150, katha: 100 }
systems ON: ch1–6 + goods & khushi (the "goods" chip row; restless towns gather dust)
raidPool: ['mist', 'locust*']   // locust is era [1,5]; era 6 has no non-human kind but mist (E3)
turns: 40 (soft)
win: hampi awake, routed, bazaar built in hampi;
     distinct goods reached by roads ≥ 4 — every good this age's living map holds
     (workshops of the north · learning of the north · learning of the east · workshops of the south)
```

#### Story beats
1. **The river crossing among boulders.** Hampi wakes: *Capital of Vijayanagara, the City of Victory.*
2. **The goods row.** Mithu shows that each city makes a *kind* of thing from its part of the country. Delhi gives *workshops of the north*, Banaras *learning of the north*, Patna *learning of the east*. These are categories, never claims about what a real place traded (data's goods comment).
3. **The bazaar.** Build it in Hampi (+1 of everything while on a route). Malli's pan clinks. Riddle 1.
4. **Twist — the mist pushes at the lamps.** A `mist` raid: *"The grey is thickening at the edges."* *"The rakshaks walk the lanes all night relighting every lamp that gutters."* A restless realm (khushi short) makes the push harder. Reaching one more different good lowers the pressure.
5. **The Vittala courtyard.** The stone chariot, and pillars that *ring with musical notes when tapped — and the argument over how is half the fun.* Riddle 2.
6. **The king who wrote.** A told card: Krishnadevaraya's Telugu poem on how a king should care for his people (data names him; no invented dialogue). Riddle 3.
7. **Ending.** Four different goods in Malli's bazaar. *"Now it's a market."*

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | Travellers said Hampi's bazaars sold something in open heaps, like grain. What? | ✓ Pearls and gems · Pepper *(that was Muziris)* · Books |
| R2 | What do some pillars of the Vittala temple do when tapped? | ✓ Ring with musical notes · Tell the time *(that was Konark's wheels)* · Glow in the dark |
| R3 | What did King Krishnadevaraya of Hampi write? | ✓ A Telugu poem on how a king should care for his people · A map of the sea roads · A book of star tables |

#### Payoff
- **Map:** Hampi's lamp, with four good-chips lit under the realm bar.
- **Aha:** **The Char Bagh.** *"Gardens of four quarters — running water, fruit trees, shade — teach even cities how to breathe."*
- **Kept:**
  - Age lamp 7.
  - Souvenir: **A gem-seller's weighing pan** — *"Travellers wrote that Hampi's bazaars weighed pearls and rubies in open heaps, like grain."* (src: Paes and Razzaq travel accounts of Vijayanagara)
- **Coins:** up to **8**.

#### Facts used
- Hampi: the capital of Vijayanagara; pearls and gems in open heaps; the Vittala stone chariot; musical pillars. *NCERT, Our Pasts II; travel accounts of Abdur Razzaq and Domingo Paes; UNESCO (1986).*
- Paes: as large as Rome, the best-provisioned city. *Domingo Paes (c. 1520).*
- Krishnadevaraya's Telugu poem on caring for his people. *Krishnadevaraya, Amuktamalyada (the rajadharma verses).*

#### Reviewer flags
- **Exclude the `deccan` raid** (human: "the Deccan kingdoms have made an alliance against this city").
- The city's later ruin is a war topic and is **not told**. The chapter ends at the bazaar's height.
- Spec goal "five different goods" → **four**. That is the most the data's era-6 living map can hold (E7).
- **Darshan** `kabir` (🪔, Banaras, era 6) is a told card with no boon pending review. The `tellers` bead (Kabir's dohas) may fire.

---

### Chapter 8 — Gardens and Marble ⚠ REVIEWER CHAPTER

**Era:** c. 1526–1707 CE · **Badge:** 📜 Itihaas · **Anchors:** Agra (the Taj Mahal, the char bagh, the Mehtab Bagh); Amritsar (Harmandir Sahib and the langar)

#### Hook (~85 words)
> "In this age, a garden cut in four by running water came to its perfection at Agra — and beside it rose the Taj Mahal, raised by Shah Jahan in memory of Mumtaz Mahal: some twenty years of work by thousands of craftsmen. Far to the north, at Amritsar, there is a kitchen that never closes, where everyone — anyone — sits in one row and eats together as equals. Bahar keeps gardens. Let's grow one, and hold a festival in it."

#### Guide
- **Bahar** *(invented)*, about 30, a garden-keeper who tends water channels and fruit trees. She talks about water the way Kayal talked about wind.
- At Amritsar she is a **visitor who eats in the langar, as anyone may**. She is never a participant in worship, never a narrator of Sikh belief. The Amritsar card's words are the data's, from the inside.
- **Mithu** introduces **utsav**, the festival verb: a burst of everything, on a cooldown.

#### Scenario preset
```
era: 7 (baagh)
heritage: era 0–5 (incl. delhi); kashi (Banaras), pataliputra (Patna) carried
awake + routed: hampi, kashi, pataliputra
asleep, unfound: agra, amritsar
techs: era 0–6 (incl. reservoir → char bagh door open) · riti: era 0–6
res: { anna: 160, kala: 150, katha: 110 }
systems ON: ch1–7 + utsav
raidPool: ['mist'] + scripted akal (drought) at agra (beat 4)
turns: 45 (soft)
win: agra AND amritsar awake and routed; tech.chahbagh learned; an utsav held IN AGRA;
     neither agra nor amritsar dusty or restless at the end
```

#### Story beats
1. **Agra wakes.** *A garden city on the Yamuna.* Bahar shows the char bagh, *a garden cut in four by water channels*. Riddle 2.
2. **The Char Bagh door** (Vidya, already known): *"Gardens of four quarters: an utsav costs half — the whole town is already outdoors."*
3. **The Taj.** A told card in the data's words: Shah Jahan, in memory of Mumtaz Mahal; white marble inlaid with flowers of coloured stone; the minarets leaning *a whisper outward*. Riddle 1. The `hands` bead (inlayers, petal by petal) may fire.
4. **Twist — an akal at Agra.** *"The rains hold off over Agra — an akal. The fields bring in half until the clouds return."* Bahar: *"A garden is only as good as its water."* The child can route grain in or wait it out. The stepped reservoir callback from ch 1 is learned.
5. **North to Amritsar.** An explorer, then a road. The wake card (from the inside, data words): *Founded by Guru Ram Das around a pool; in 1604 the Adi Granth was installed in Harmandir Sahib at its centre. In the langar everyone — anyone — eats together as equals, and the kitchen never closes.* Bahar sits in the row with everyone. Riddle 3.
6. **The utsav in the garden.** Once the rains return, an utsav **in Agra's char bagh**. It costs half, and the whole town dances (the engine's line *"The whole town danced."*).
7. **Ending.** Bahar: *"A town owes its people somewhere to sit that grows nothing."* (the data's Bagh Riti line, said by Mithu, not the guide, since it is the game's own custom text).

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | Why do the Taj Mahal's four minarets lean slightly outward? | ✓ So if an earthquake threw one down, it would fall away from the tomb · Because the ground sank under them · To catch more sunlight |
| R2 | What is a char bagh, perfected at Agra? | ✓ A garden cut in four by water channels · A hall of four pillars · A market of four streets |
| R3 | In the langar at Amritsar, everyone… | ✓ Sits in one row and eats together as equals · Eats in order of rank · Brings their own food from home |

#### Payoff
- **Map:** Agra's and Amritsar's lamps. A green four-square glyph sits at Agra.
- **Aha:** **The Shipyards.** *"On every coast, Indian shipwrights build ocean-going ships that traders of many flags queue to buy."*
- **Kept:**
  - Age lamp 8.
  - Souvenir: **A jade inlay petal** — *"The Taj's flowers are stone set in stone — carnelian, jade and lapis cut to petals thinner than a coin."* (src: Parchin kari inlay of the Taj Mahal (ASI))
  - The Amritsar treasure (*the langar's great ladle*) is **not** used as a souvenir pending review.
- **Coins:** up to **8**.

#### Facts used
- Agra: the Taj raised by Shah Jahan in memory of Mumtaz Mahal; some twenty years; thousands of craftsmen; inlaid marble; the minarets lean outward; the char bagh; the Mehtab Bagh. *NCERT, Our Pasts II; ASI Taj Mahal literature; UNESCO (1983); Mehtab Bagh (ASI).*
- Amritsar: Guru Ram Das and the pool; the Adi Granth installed in 1604; the langar; four doors; pangat; Ranjit Singh's craftsmen gilded the upper storeys. *Sikh tradition as the community keeps it (docs/05 §4 — from the inside); NCERT, Our Pasts II.*

#### Reviewer flags (hard)
1. **The Sikh Gurus are never depicted** (docs/05 §2). No figure, silhouette or folk-art rendering on any card, including Mithu's tellings.
   - Darshan `nanak` ("Guru Nanak's songs are gathered") must use Harmandir Sahib, the langar or the Ik Onkar only.
   - Its **boon (+80 anna, "the langar feeds every town") turns a sacred figure and a sacred practice into a gameplay reward** and is **stripped in the campaign** pending review.
2. **Harmandir Sahib is never a build target or a monument power-up.** Amritsar's `works[2]` is "Harmandir Sahib shines from its pool". In the campaign, Amritsar's monument button is **hidden**.
   - The langar is **told, never mechanised**. It is *not* mapped onto the lean-season help verb, however apt that looks.
   - The `annapurna` sutra (review) bead at Amritsar is off.
3. **The Taj Mahal is a tomb**, with graves, on a site with a mosque. It is described as the data does, a memorial raised in memory of Mumtaz Mahal. The utsav is held **in the char bagh garden**, and the reviewer confirms whether any festival on Agra's map is appropriate or should move to another city.
4. **Amritsar's later history** (1919; 1984) is colonial and communal violence and must **never** appear, not even as a twist or a hint.
5. **Exclude the `nadir` and `revolt` raids** (human, era 7).

---

### Chapter 9 — Sails and Factories

**Era:** c. 1600–1800 CE · **Badge:** 📜 Itihaas · **Anchor:** Surat's harbour on the Tapi

#### Hook (~85 words)
> "Ships under many flags anchor in the Tapi river here. Surat is the great port of its age, and a Surat merchant's letter of credit was honoured in harbours half the world away! Its shipwrights built ocean-going ships of good teak so well that even foreign captains ordered theirs here. And from these wharves, pilgrims set sail for Mecca for centuries. Moti is learning to build ships. Let's trade with the world — and see what happens to prices."

#### Guide
- **Moti** *(invented)*, about 14, a shipwright's apprentice on the Tapi. He smells of teak shavings and asks every captain where they've been.
- **Mithu** introduces **favour** (partners remember a filled request) and **price** (the more of one thing you sell, the less each sale pays: *supply and demand, which a ten-year-old can feel rather than be told*).

#### Scenario preset
```
era: 8 (bandar)
heritage: era 0–6 sites EXCEPT hampi (carried live — see E8), kashi/pataliputra carried
awake + routed: agra, amritsar, kashi (Banaras), pataliputra (Patna), hampi
asleep, unfound: surat
techs: era 0–7 (incl. monsoon → shipyards door open) · riti: era 0–7
res: { anna: 170, kala: 170, katha: 120 }
systems ON: ch1–8 + partner favour + market price (both visible in the Sea roads panel)
partners this era (data): Srivijaya (workshops of the south), Persia (fields of the north)
raidPool: ['fire', 'cyclone', 'mist']
turns: 45 (soft)
win: surat awake and routed; tech.ship learned; 4 requests filled across BOTH partners (favour ≥ 2 with each)
```

#### Story beats
1. **The anchorage.** Surat wakes: *a river-mouth anchorage*, then *the warehouses fill*.
2. **The shipyards.** The Shipyards door (Vidya): *"Ocean-going hulls from Indian yards."* Moti planes a teak plank. Riddle 1.
3. **Two partners asking.** Persia wants *fields of the north*, which Amritsar supplies. Srivijaya wants *workshops of the south*, which Hampi supplies. Mithu shows favour rising.
4. **The price falls.** Filling Persia three times pays less each time. Mithu asks: *"Why is the third sack worth less than the first?"* The answer is shown, not quizzed, so it doesn't pay.
5. **Twist — fire in the warehouses by the water.** *"Smoke over the warehouse quarter."* *"The rakshaks form the bucket line and the fire is out before the roofs go."*
6. **Strangers' warehouses.** A told card in the data's words: *When the English and Dutch first came to trade, their first warehouses in India — their "factories" — went up in Surat.* Riddle 2. Then the gate of Mecca. Riddle 3.
7. **Ending.** Moti watches a ship leave: *"Paper worth a ship's cargo"* (the hundi) goes in the apprentice's pocket.

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | What did Surat's shipwrights build so well that foreign captains ordered them here? | ✓ Ocean-going teak ships · Iron steamships · Stone lighthouses |
| R2 | What did English and Dutch traders first raise at Surat? | ✓ Their first warehouses in India — "factories" · Lighthouses · Shipyards |
| R3 | Why was Surat called Bab-ul-Mecca, the gate of Mecca? | ✓ Pilgrims sailed for Mecca from its wharves · Its gates were plated with gold · Its merchants all came from Mecca |

#### Payoff
- **Map:** Surat's lamp, with two partner threads brightening and favour pips beside each partner's name.
- **Aha:** **The Railway.** *"Steam engines pull the first train from Bombay to Thane in 1853. A journey of weeks becomes a day, and every town moves closer to every other."*
- **Kept:**
  - Age lamp 9.
  - Souvenir: **A merchant's hundi** — *"A hundi — a paper promise honoured across oceans. Surat's credit notes moved fortunes without moving a coin."* (src: the hundi system, NCERT, Our Pasts II — towns and traders)
- **Coins:** up to **8**.

#### Facts used
- Surat: the great port; ships under many flags in the Tapi; the letter of credit; teak ships; the English and Dutch first warehouses; Bab-ul-Mecca. *NCERT, Our Pasts II, "Towns, Traders and Crafts-persons"; seventeenth-century travel accounts (Ovington and others); Bab-ul-Mecca in Mughal-era accounts.*

#### Reviewer flags
- **This is the edge of the colonial period.** The data itself marks eras 8–9 as carrying docs/05's colonial-violence flag ("until a named human reviewer signs their human threats off, those ages face only… fire, storm, famine and sickness").
  - The chapter says only what the data says about the English and Dutch: they came to trade, and their first warehouses were here.
  - No "Company", no conquest; 8+ only.
- Spec goal "three overseas partners" → **two**. The data has exactly two partners in era 8 (E7).
- Surat is not in the engine's `PORTS` list although the data calls it "the great port of its age" (E9).

---

### Chapter 10 — Railways and Presses

**Era:** c. 1800–1900 CE · **Badge:** 📜 Itihaas · **Anchors:** Bombay (seven islands; Asia's first passenger train, 1853, to Thane); Calcutta (presses and colleges, College Street)

#### Hook (~85 words)
> "Seven islands, stitched into one city by people who filled in the sea between them! From Bombay, in 1853, Asia's first passenger train steamed to Thane — thirty-four kilometres that changed the whole country. And across the land, Calcutta's presses sent out books and newspapers in Bengali, Hindi, Urdu, English and more, to be read aloud in courtyards everywhere. Roshni sets type for a printer. Let's lay the iron road and get the words moving."

#### Guide
- **Roshni** *(invented)*, about 13, a printer's apprentice on College Street in Calcutta. She can find any letter in the type-case with her eyes shut.
- **Mithu** introduces **quarrels and the panchayat**: *"No armies, no winners, nothing burns — the road just carries nothing until someone sits down to settle it."*

#### Scenario preset
```
era: 9 (rail)
heritage: era 0–7 (Banaras, Patna carried)
awake + routed: surat, kashi (Banaras), pataliputra (Patna)
asleep, unfound: mumbai (Bombay), kolkata (Calcutta)
techs: era 0–8 (incl. roads → railway door; panchayat → settling costs nothing) · riti: era 0–8
res: { anna: 180, kala: 180, katha: 130 }
systems ON: ch1–9 + quarrels & panchayat (one scripted quarrel, beat 5)
raidPool: ['fire', 'cyclone', 'mist']        // NOT famine, NOT plague (flags)
turns: 45 (soft)
win: both awake; tech.railway learned; bombay and calcutta in ONE network;
     a gurukul in calcutta and its teacher answered right twice; the quarrel settled
```

#### Story beats
1. **The seven islands.** Bombay wakes: *seven islands, one harbour*. Riddle 2.
2. **The Railway door.** *"Iron roads: new routes cost half again."* The first train runs to Thane. Riddle 1.
3. **Across to Calcutta.** A long, cheap railway road from Bombay through Banaras and Patna. Calcutta wakes: *the city of presses and colleges.*
4. **Roshni's press.** A gurukul in Calcutta (the "college"). Its teacher asks about any woken city. Brahmi Script made that possible in ch 3, and Mithu says so.
5. **Twist — a quarrel over tolls.** Bombay and Surat fall out over *tolls on the road between them*. The road carries nothing. The child sits the panchayat and chooses *"Agree one fair weight and measure"* or *"Hold a joint market day."* Because the realm learned the Panchayat long ago, it costs nothing. Mithu: *"Five who sit together."*
6. **University, 1857.** A told card: the University of Calcutta *among the first modern universities in Asia, with Bombay and Madras the same year.* Riddle 3.
7. **Ending.** Roshni hands over a single letter of Bengali type: *"With a few hundred of these, a room could talk to a million people."*

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | India's first passenger train ran from Bombay to… | ✓ Thane · Calcutta · Surat |
| R2 | How did Bombay's seven islands become one city? | ✓ People filled in the sea between them · An earthquake pushed them together · A river silted them up |
| R3 | What opened in Calcutta in 1857? | ✓ One of Asia's first modern universities · India's first full-length film *(that was Bombay, 1913)* · The first railway *(that was Bombay, 1853)* |

#### Payoff
- **Map:** an iron line drawn as a road across the middle of the map. Bombay and Calcutta lamps; *"Bombay"* and *"Calcutta"* labels (they rename in ch 13's era, as the data does).
- **Aha:** **Swadeshi.** *"Indians decide that their own things matter: their own cloth, their own schools, their own salt. Small choices, made by millions together."*
- **Kept:**
  - Age lamp 10.
  - Souvenir: **A brass type of ক** — *"A single piece of movable Bengali type — with a few hundred of these, a room could talk to a million people."* (src: the Serampore/Calcutta type foundries; NCERT print culture)
  - Alternative: *A first-day train ticket* (src: Indian Railways history, Bombay–Thane, 16 April 1853).
- **Coins:** up to **8**.

#### Facts used
- Bombay: seven islands joined by causeways and land-filling; 1853 to Thane, thirty-four kilometres; the terminus as a world monument; Phalke 1913. *Indian Railways history (Bombay–Thane, 1853); NCERT, India and the Contemporary World; UNESCO listing for the terminus (2004); Phalke, Raja Harishchandra (1913).*
- Calcutta: presses in many languages; College Street; the University 1857; Tagore's Nobel 1913. *NCERT, India and the Contemporary World II (print culture); University of Calcutta (est. 1857); Nobel Prize in Literature 1913.*

#### Reviewer flags
- Colonial era, per the data's own flag. **Exclude the `famine` and `plague` raids** for every band under 11. Nineteenth-century famines are named in docs/05 as an 11–12 topic ("famines… economic drain"), and a game cannot carry that weight. Recommend excluding them from the campaign at every age.
- **1857** appears only as the university's founding year. The uprising of the same year is not mentioned (docs/05: 11–12, with a human author).
- Old and new names (Bombay/Mumbai, Calcutta/Kolkata) are used "with a light touch" (docs/05 §3), and the engine's rename at era 12 says so.

---

### Chapter 11 — The Freedom Age ⚠ REVIEWER CHAPTER

**Era:** c. 1900–1947 CE · **Badge:** 📜 Itihaas · **Anchor:** Sabarmati Ashram, Ahmedabad, and the walk to Dandi

#### Hook (~85 words)
> "This age has a quiet ashram on the bank of the Sabarmati river. In 1930, Gandhi walked from here to the sea at Dandi — twenty-four days on foot — to pick up a handful of salt that everyone had been forbidden to make. A quiet act, understood by a whole country at once. Patience and truth were shown to move an empire, and in 1947 India was free. Dhara spins thread. Let's carry the printed word to every city."

#### Guide
- **Dhara** *(invented)*, about 50, a spinner who lives in a mill-workers' lane and spins at home in the evenings. She is calm, dry-humoured, and believes in a straight thread.
- **Mithu** introduces **Riti**, the realm's customs and policy cards, with one door shown: *Praja Sabha — "The people who live somewhere have a say in it."*

#### Scenario preset
```
era: 10 (azaadi)
heritage: era 0–8 (surat folds; Banaras, Patna carried)
awake + routed: mumbai (Bombay), kolkata (Calcutta), kashi (Banaras), pataliputra (Patna)
asleep, unfound: ahmedabad
techs: era 0–9 (incl. paper → press door) · riti: era 0–9 (gurupar → Praja Sabha door)
res: { anna: 180, kala: 180, katha: 140 }
systems ON: ch1–10 + Riti (only `sabhyariti` door and the "A Say in It" policy shown)
raidPool: ['forget', 'mist', 'cyclone']   // nothing human, nothing violent — ever, in this chapter
turns: 45 (soft)
win: ahmedabad awake; tech.press learned; EVERY living city in ONE network ("a printed word reaches every city");
     riti.sabhyariti adopted and its policy slotted
```

#### Story beats
1. **A weaving city.** An explorer from Bombay finds Ahmedabad: *a weaving city*, then *the mills and the ashram*. Riddle 2 (Manchester of India).
2. **The window like lace.** A told card: the Sidi Saiyyed mosque's stone window, carved as a tree, *so fine it looks like lace*. Riddle 3.
3. **The Printing Press.** *"A thousand copies by morning: every teacher's question pays double."*
4. **The walk** (darshan `gandhi`, data words only): *"From the ashram by the Sabarmati, Gandhi walks twenty-four days to the sea and picks up a handful of salt. A quiet act, understood by a whole country at once."* Riddle 1.
   - The `walkers` sutra's last bead is a gentle mirror: *"look at your own map: the explorer you have been sending into the mist all game walks in this same long line."* It is review-flagged, see below.
5. **Twist — the old stories go quiet.** The `forget` raid at Banaras: *"Nobody under thirty knows what this place is for."* *"The kathakars hold a telling in the square and the whole quarter comes."* Dhara: *"A thing remembered is a thing kept."* The game's whole frame is in that line: Vismriti is undone by telling.
6. **A say in it.** Adopt Praja Sabha and slot *A Say in It*. Mithu: *"That's a rule of our game, not a history lesson. But it's a good rule."* (Riti are explicitly not historical claims, per the data.)
7. **Ending — 1947.** One line, in the era note's words: *"…and in 1947, India is free."* No crowds, no flags waving over anything, no map change, no boundary. Dhara cuts her thread, knots it and hands over the spindle.

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | From the ashram at Ahmedabad, Gandhi walked to Dandi to… | ✓ Make salt from the sea · Catch a ship · Plant cotton |
| R2 | Ahmedabad's cotton mills earned it the name… | ✓ Manchester of India · Venice of the East · City of Lakes |
| R3 | The famous Sidi Saiyyed window is carved as… | ✓ A tree with curving branches, fine as lace · A ship in full sail · A map of the city |

#### Payoff
- **Map:** every living lamp linked. A small press glyph sits on each.
- **Aha:** **The Constitution.** *"Dr Ambedkar and the Assembly write the Republic's promise: every grown-up's vote equal, every citizen's dignity equal."*
- **Kept:**
  - Age lamp 11.
  - Souvenir: **A charkha spindle** — *"A slim iron spindle from a charkha — the quiet machine that became a flag."* (src: Sabarmati Ashram collection)
- **Coins:** up to **8**.

#### Facts used
- The Sabarmati ashram; 1930; twenty-four days to Dandi; salt everyone was forbidden to make. *NCERT, India and the Contemporary World II (Civil Disobedience, 1930); Sabarmati Ashram Preservation and Memorial Trust.*
- Sidi Saiyyed window, *Sidi Saiyyed mosque (1573) — the jali*. Manchester of India, `ahmedabad.more[1]`. India's first World Heritage City (2017), *UNESCO*.
- Era note "patience and truth… in 1947, India is free": `eras[10].note`. Aha "The Constitution": `eras[10].aha`.

#### Reviewer flags (hard)
1. **Freedom without violence, absolutely.**
   - No 1857, no Jallianwala Bagh, no police, no lathi, no prison, no British soldier. No "enemy" of any kind, and no one shown as an adversary, faceless or otherwise. The raid pool is `forget`, `mist` and `cyclone` only.
   - **Partition is not mentioned or alluded to** (docs/05: not covered under 11, and at 11–12 only by a human author with a named reviewer, never in a game).
2. **Gandhi is a real person.** He has **no invented dialogue**. Every sentence about him is the data's (darshan `gandhi`, `ahmedabad.fact`). He is shown only as the walk and the handful of salt; any figure art goes to the reviewer. The darshan boon ("every dusty town brightens · +60 📜") is **stripped in the campaign** pending review.
3. **Ambedkar** appears only in the aha card, in the data's words.
4. **"An empire" is unnamed in the data.** If the 8–10 text needs docs/05's sentence "Britain ruled India and Indians won freedom back", that sentence needs a sourced object first ([NEEDS SOURCE] #11.2). Until then the chapter uses only the era note.
5. **The `walkers` sutra (review: true)** places Gandhi's walk in a thread with the Buddha, Mahavira, Adi Shankara and Guru Nanak. Whether to show it here is the reviewer's call. Default: **off**.
6. **No age band under 8 plays this chapter.**

---

### Chapter 12 — The Young Republic

**Era:** 1947–1991 CE · **Badge:** 📜 Itihaas · **Anchor:** Chandigarh, a city planned on a blank sheet (the Open Hand; Nek Chand's Rock Garden)

#### Hook (~85 words)
> "A young country builds itself with its own hands: dams, steel towns, new seeds — and a brand-new city, planned on a blank sheet of paper! Its planners described it like a body: the Capitol its head, the green belts its lungs, the bazaars its heart. And in one corner, a roads inspector named Nek Chand secretly built a whole garden of figures out of broken bangles and crockery. Akash draws plans for a living. Let's lay out a city."

#### Guide
- **Akash** *(invented)*, about 28, a draughtsman in the planners' office, ink on his cuffs. He is very serious about a straight line and secretly in love with the Rock Garden's crooked ones.
- **Mithu** introduces **placement**: where a building stands changes what it gives. *"Water reaches the fields beside it; a workshop on the street gets its goods out."* (docs/16 §8, the ten adjacency rules.)

#### Scenario preset
```
era: 11 (nirman)
heritage: era 0–9 except renamed (Varanasi, Patna, Bombay, Calcutta carried)
awake + routed: ahmedabad, mumbai, kolkata, kashi (Varanasi), pataliputra (Patna)
asleep, unfound: chandigarh
techs: era 0–10 (incl. plough → Green Revolution door) · riti: era 0–10
res: { anna: 200, kala: 200, katha: 150 }
systems ON: ch1–11 + placement (adjacency preview — needs Chandigarh on the city kit, E10)
raidPool: ['drought', 'floodmod', 'forget']
turns: 50 (soft)
win: chandigarh awake, routed, level 3; granary, workshop, gurukul, bazaar and stepwell all placed
     in chandigarh with every one earning its adjacency bonus ("to the plan");
     its monument (works[2] "the Open Hand turns in the wind") raised
```

#### Story beats
1. **A plan on paper.** Chandigarh wakes on its first `works` stage: *a plan on paper*. Akash unrolls it. Riddle 2.
2. **Head, lungs, heart.** Mithu shows the plot preview: *the same function that pays out*, so the preview can never promise what the city won't deliver.
3. **Placing to the plan.** The child places five buildings. The first misplacement is expected and can be **lifted for a third of its price** (the engine's own forgiveness).
4. **Twist — a hard drought on the district.** *"Three months and no rain."* *"The tanks and the canals hold, and the harvest comes in anyway"*, but only if the stepwell sits where water reaches the fields.
   - The `river` sutra's Bhakra bead (safe on its own) may play: *"at Bhakra the Sutlej turns turbines, and villages that never had a bulb switch one on."*
5. **The Rock Garden.** A told card: Nek Chand (a real person named in the data, with no invented dialogue) and his secret garden from broken things. Akash grins at the crooked lines. Riddle 1.
6. **The Open Hand.** The monument rises: *"open to give, open to receive."* Riddle 3.
7. **Ending.** Akash rolls up the plan: *"Drawn first, built after. Most cities do it the other way round."* The `hands` bead (Chandigarh: *the same hands, five thousand years on*) closes a thread that began at Dholavira in ch 1.

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | What did Nek Chand build in secret at Chandigarh? | ✓ A garden of figures made from broken bangles and crockery · A private railway · A hidden library |
| R2 | Chandigarh's planners described their city as… | ✓ A body — head, lungs and heart · A ship at anchor · A chessboard |
| R3 | What does Chandigarh's Open Hand mean? | ✓ Open to give, open to receive · Stop here · A king once lived here |

#### Payoff
- **Map:** Chandigarh's lamp, with a neat grid glyph.
- **City:** the plate shows all five buildings in their places and the Open Hand.
- **Aha:** **1991.** *"India opens its doors to the world's trade — and a billion ideas suddenly find room to grow."*
- **Kept:**
  - Age lamp 12.
  - Souvenir: **The Open Hand blueprint** — *"A blueprint sheet of the Open Hand — a city drawn before it existed, down to this very monument."* (src: Chandigarh Capitol Complex archives)
- **Coins:** up to **8**.

#### Facts used
- Chandigarh: planned on a blank sheet for the young Republic; wide green sectors; the Open Hand "open to give, open to receive"; the plan as a body; Nek Chand's Rock Garden; the Capitol on the World Heritage list in 2016 as part of Le Corbusier's work across seven countries. *Chandigarh Capitol Complex records (the Le Corbusier plan); UNESCO (2016); Nek Chand Rock Garden Trust.*
- The era note (dams, steel towns, new seeds): `eras[11].note`. The Bhakra bead: *Bhakra-Nangal project (dedicated 1963); NCERT*.

#### Reviewer flags
- **Why Chandigarh was built is a Partition story** (a new capital for Punjab after 1947). The data does not say it, and the chapter must not. The reviewer confirms that "a brand-new city for the young Republic" is honest enough for 8–10 and that 11–12 needs nothing more from a game.
- The `annapurna` bead (Green Revolution in Punjab, era 11) belongs to a `review: true` sutra and is off by default, though this bead itself is secular.
- **Engine gap:** Chandigarh is **not one of the 8 kit cities** (only Dholavira, Hastinapura, Kalibangan, Kashi, Lothal, Rakhigarhi, Ujjain, Vaishali). Without kit art, "placed to the plan" falls back to "all five buildings built", and the placement system's introduction moves to free play (E10).

---

### Chapter 13 — The Takeoff

**Era:** 1991 CE – today · **Badge:** 📜 Itihaas (Bengaluru's founding and name told *"the old telling says…"*) · **Anchors:** Bengaluru; Sriharikota, India's doorway to space

#### Hook (~85 words)
> "The garden city became India's city of new ideas — its great science institute was founded with Jamsetji Tata's gift in 1909, and missions to the Moon and Mars are steered from rooms here. On a quiet island of casuarina trees, Sriharikota, an Indian rocket rose in 1980 and set the satellite Rohini into the sky. Rockets fly east over the sea, where Earth's spin gives a free push. Kiran builds rockets. Let's connect the whole map — and count down."

#### Guide
- **Kiran** *(invented)*, about 35, a launch engineer who commutes between a Bengaluru lab and the island. She keeps a pencil behind her ear and has a superstition about the number zero.
- **Every earlier guide gets a one-line cameo** at the ending (beat 7). They are all labelled invented.
- **Mithu** explains the **four roads to an ending** and which one this campaign is walking: *India Remembers — every lamp lit, from Dholavira to Sriharikota.*

#### Scenario preset
```
era: 12 (takeoff)
heritage: every earlier site NOT carried — AWAKE, lamp lit (zzz=false), monument shown (E11)
awake + routed: chandigarh, mumbai (Mumbai), kolkata (Kolkata), kashi (Varanasi), pataliputra (Patna)
asleep, unfound: bengaluru, sriharikota
techs: era 0–11 (incl. zero → satellite door) · riti: era 0–11 (dak → sanchar door)
res: { anna: 220, kala: 220, katha: 170 }
systems ON: everything in the ladder + the endings panel (victories checked live)
raidPool: ['heat', 'smog', 'forget', 'drought']
turns: 55 (soft)
win: tech.satellite learned; bengaluru and sriharikota awake; every living city in ONE network;
     sriharikota's monument (works[2] "the launch tower, lit for countdown") raised;
     victory `memory` (India Remembers) true
```

#### Story beats
1. **The garden city.** Bengaluru wakes. *The old telling says* Kempegowda founded the town in 1537 with four watchtowers. *The favourite telling* is that an old woman fed a lost king boiled beans and he named the place benda-kaalu-ooru. Riddle 3.
2. **The Satellite door.** *"Aryabhata, 1975 — India's own eye in the sky: explorers walk twice as fast, and no city ever fades again."* The `starcounters` bead closes: *India's first satellite goes up carrying the old star-counter's name.* That callback reaches back to ch 2 and ch 4.
3. **The island.** An explorer runs fast to Sriharikota: *an island of casuarina* between the sea and Pulicat lake, *loud with birds — flamingoes share this coast with rockets.* Riddle 1.
4. **Twist — the heat won't break.** *"The heat is not breaking."* *"The green belt and the old tanks keep the city cool enough to work."* Kiran: *"The pad doesn't care how hot we are. Check it twice."*
5. **Every lamp on one road.** The endings panel shows *India Remembers* ticking toward true as the last living cities join the network.
6. **The countdown.** Darshan `kalam` plays in its data words: *Dr Kalam and his teams count down India's own rockets — failures first, then wings.* The launch tower is lit (the monument), and a ten-step countdown runs on screen, the child's own tap at zero. Then Chandrayaan-3: *landed near the Moon's south pole, the first craft from any nation to reach there.* Riddle 2.
7. **Ending.** All thirteen age lamps blaze on Mithu's map. Each guide has one line, from Kesar to Kiran (see Epilogue), and the `tellers` bead plays last.

#### Riddles
| # | Question | Options |
|---|---|---|
| R1 | Why do Sriharikota's rockets fly east over the sea? | ✓ Earth's spin gives a free push, and only water lies below · The wind always blows east · To be closer to the Moon |
| R2 | What did Chandrayaan-3 do in 2023? | ✓ Landed near the Moon's south pole — the first craft from any nation to reach there · Orbited the Sun · Landed on Mars |
| R3 | Who does the old telling say founded Bengaluru in 1537? | ✓ Kempegowda · Krishnadevaraya *(he was Hampi's king, in an earlier age)* · Rajaraja Chola *(he built at Thanjavur)* |

#### Payoff
- **Map:** every lamp on the game map is lit, all thirteen age lamps on Mithu's map are lit, and the mist is gone. *India remembers.*
- **Aha:** none (the data's era 12 has `aha: null`). The epilogue takes its place.
- **Kept:**
  - Age lamp 13.
  - Souvenir: **The countdown logbook page** — *"A hand-kept countdown log from the early launches — ten, nine, eight, written by nervous, hopeful hands."* (src: ISRO SLV-3 programme records)
- **Coins:** up to **8**.

#### Facts used
- Bengaluru: the institute founded with Jamsetji Tata's gift in 1909; software; ISRO HQ and Moon/Mars missions steered from here; Kempegowda 1537 *(Katha frame)*; benda-kaalu-ooru *(Katha frame — a story of the name)*. *Indian Institute of Science history (founded 1909); Kempegowda tradition; ISRO HQ, Bengaluru; the benda-kaalu-ooru telling.*
- Sriharikota: casuarina island; 1980, Rohini; launches east over the sea; Chandrayaan-3 in 2023; Pulicat flamingoes. *ISRO: SLV-3 and Rohini (18 July 1980); Satish Dhawan Space Centre SHAR; ISRO: Chandrayaan-3 landing (23 August 2023); Pulicat lake sanctuary literature.*
- Satellite Aryabhata 1975: `techs.satellite`; *ISRO: Aryabhata (1975)* (starcounters bead).
- Dr Kalam: darshan `kalam`, *ISRO SLV-3 programme (1980); A. P. J. Abdul Kalam, Wings of Fire*.

#### Editorial notes
- Dr Kalam is a real person. He has no invented dialogue, and only the darshan text is used. The darshan boon is stripped pending review, like all darshan cards.
- The `pashupati` sutra's last bead (Bengaluru, *Om Namah Shivaya on a morning bus*, 🧭) belongs to a `review: true` sutra and is off.

---

### Epilogue — All Thirteen Lamps

**Badge:** 🧭 Aaj for the last card (the data's own frame for the `tellers` bead). Everything before it is 📜.

**Mithu's lamp-map, full** (read aloud, ~110 words):
> "Look at it, apprentice. Thirteen lamps. Dholavira's reservoirs. Megh's river. Ila's letters. Nilu's blue. Kayal's pepper ships. Hira's tower. Malli's market. Bahar's garden. Moti's teak. Roshni's type. Dhara's thread. Akash's plan. Kiran's countdown. Not one of those places was conquered. Every one was *reached* — by a road, a boat, a train, a question, a story. And here's the secret of Vismriti: the mist doesn't go away because you beat it. It goes away because somebody tells. Which means it isn't really finished…"

Then the `tellers` bead, verbatim from the data:
> *"The stories ride screens now — and the newest teller in this whole unbroken line is holding one right now. Yes: you. Tell somebody one."*

Each guide waves once. Their cards say *"made up, but the places are real"*, and each points to the souvenir they gave. Each guide's last line is about their object, never about the history, to keep invented voices off facts.

**What unlocks:**
- **Free play** — the long game from Dholavira, with every system on (kingdoms, heroes, dedications, wonders, sister realms, the khazana hunt, the four endings).
- **Hall of Lamps** shows 13 souvenirs. The other 18 treasures can be found in free play, each with its source line.
- An **"ask your family"** card (docs/05 §5): *"Which of the thirteen lamps is closest to where your family comes from? Ask a grown-up what they know about it."*
- The **campaign stays replayable** chapter by chapter. Replays pay riddle coins only for riddles not yet answered right at the first try, and no second `stop` (once per chapter per child, spec §1.2).

---

### Engine notes the storyline depends on

The campaign is **scoped scenarios on the existing engine**, but the existing `startScenario` cannot express these presets. Needed:

| # | Need | Why |
|---|---|---|
| E1 | **Chapter preset fields:** `awake`, `foundAsleep`, `unfound`, `heritage` (awake + lit + monument, zzz=false), `capital`, `routes`, `techs`/`riti` beyond "all earlier eras", `res` | `startScenario` wakes *every* site ≤ era. A chapter needs its own era's sites asleep and unfound. |
| E2 | **`systems` mask** per chapter (explore/road/wake, raids+jobs, Vidya with a door whitelist, buildings, sea, monuments, goods, utsav, favour/price, quarrels, Riti with a door whitelist, placement, endings) | This is the onboarding ladder. It is also what the 4–7 / 8–10 / 11–12 age bands need (spec item 6). |
| E3 | **`raidPool` per chapter**, restricted to `beast`/`nature`/`mist` kinds, with a borrowed nature kind allowed outside its era range (cyclone in ch 5, a storm in ch 6) | **The data's `raids` table contains human raids** (warband, rivalking, frontier, huna, searaid, mongol, timur, deccan, nadir, revolt). That contradicts docs/16 §6 and the spec's own review ("never from people"), and the engine will roll them in eras 1–7. The campaign must never; the reviewer should decide whether free play may. Ch 6 needs a **new nature row** (a storm or lightning) because era 5 has no non-human kind but locust and mist. |
| E4 | **Scripted beats:** a first raid, akal or quarrel at a named city on a named turn; told cards in order | Twists must be authored, not random. |
| E5 | **A chapter `win()` predicate** plus helpers: `oneNetwork(ids)`, a teacher-answered-about-N-cities counter, utsav-held-in-city, adjacency-earned-for-all, favour per partner | Today only `canAdvance()` (era gate plus katha bank) exists. The campaign's goals are different. |
| E6 | **Pay path:** `stop` 5 on win (once per chapter per child), `answer` 1 per first-try riddle. **Suppress `grant(40, 'a new age')`** and any other `ind-reward` in campaign mode. | One pay path (spec §1.2). The engine's `grant()` dispatches `ind-reward` with n = 40 on every advance. |
| E7 | Goals adjusted to the data: ch 7 "five goods" → **four** (era 6's living map holds four); ch 9 "three partners" → **two** (data has two partners in era 8) | Never promise what the map cannot deliver. |
| E8 | Ch 9 carries **Hampi live** (as if its monument stands) so Srivijaya's *workshops of the south* can be supplied | Otherwise no southern workshop is alive in era 8. |
| E9 | Add `surat` (and arguably `mumbai`, `kolkata`) to `PORTS` | The data calls Surat "the great port of its age", but the port techs ignore it. |
| E10 | **Chandigarh on the city kit** (art plus ground plan) for ch 12's placement system; fallback otherwise | Only 8 kit cities exist, all in eras 0–1. |
| E11 | Heritage sites in a preset must be **awake** (zzz=false) | `vicMemory()` = `allAwake()`. The current scenario code may leave folded sites zzz and make *India Remembers* unreachable. |
| E12 | **Darshan cards in campaign mode** are told cards with **boons stripped**; sutra beads from `review: true` sutras are off | Spec §2.1 item 7 reviewer list. |
| E13 | Mithu **delivers** the riddles with one try, shown question, shown answer and source on a miss | Spec item 3 (B2, B3). |

---

### Facts the story would need that are NOT in data-sabhyata.js — [NEEDS SOURCE]

None of these is used above. Each is marked where a writer, artist or voice director would be tempted to add it. **Do not add any of them without a sourced object and the reviewer.**

**Frame / all chapters**
- [NEEDS SOURCE] Any claim that a guide's trade existed in that place and age as drawn: Harappan bead-makers' families (ch 1), Ganga ferrymen 1500–600 BCE (ch 2), letter-cutters at Dhauli (ch 3), colour-grinders' apprentices at Ajanta (ch 4), women ship's pilots on the Tamil coast (ch 5), a girl printer's apprentice on College Street (ch 10). The guides are labelled invented. Their *trades* must stay generic and must not be asserted as documented.
- [NEEDS SOURCE] Period dress, tools and ships for the guides' art in every era. The artist brief needs references reviewed per era.

**Ch 1**
- [NEEDS SOURCE] What Lothal's ships looked like (for the departing-cargo beat art).
- Unknowable, not merely unsourced: what Harappans called themselves or their children. The guide's name is presented as our invention.

**Ch 2**
- [NEEDS SOURCE] A date for "people learn to work iron" (the aha gives none).
- [NEEDS SOURCE] Ferries or boats on the Ganga in this age.

**Ch 3**
- [NEEDS SOURCE] That the Dhauli edicts are in Brahmi script. The tech is named Brahmi Script, but the Dhauli site entry doesn't say so.
- [NEEDS SOURCE] The verbatim text of the Dhauli Separate Edict, before anything is put in quotation marks.
- [NEEDS SOURCE] Who physically carved the edicts.
- [NEEDS SOURCE] Any Kalinga war detail (deliberately omitted anyway).

**Ch 4**
- [NEEDS SOURCE] Nalanda's founding date and student numbers ("thousands" is all the data says).
- [NEEDS SOURCE] How many years Xuanzang stayed ("years").

**Ch 5**
- [NEEDS SOURCE] Any direct Muziris–Srivijaya trade (the partner mechanic does not assert it, and nor should the text).
- [NEEDS SOURCE] Monsoon sailing techniques for Kayal's lines beyond the aha's "ride the monsoon winds".

**Ch 6**
- [NEEDS SOURCE] The Qutb Minar's height and the years of each stage (the data names the builders, not the dates).
- [NEEDS SOURCE] The lightning strike's date.

**Ch 7**
- [NEEDS SOURCE] Any other goods of Hampi's bazaars beyond pearls and gems.
- [NEEDS SOURCE] Vijayanagara's founding story (deliberately not used).

**Ch 8**
- [NEEDS SOURCE] The Taj's construction years (the data says "some twenty years").
- [NEEDS SOURCE] The founding year of Amritsar or the pool (the data gives only Guru Ram Das and 1604 for the Adi Granth).
- [NEEDS SOURCE] When the langar tradition began, beyond the darshan line.

**Ch 9**
- [NEEDS SOURCE] The years the English and Dutch warehouses opened at Surat.
- [NEEDS SOURCE] Any statement about the Company's later role (excluded by policy anyway).

**Ch 10**
- [NEEDS SOURCE] The earliest Bengali printing date.
- [NEEDS SOURCE] Calcutta's newspapers by name or date (the data says "books and newspapers in many languages", with no dates).

**Ch 11**
- [NEEDS SOURCE] (11.1) The Dandi march's start and end dates (the data gives 1930 and twenty-four days).
- [NEEDS SOURCE] (11.2) A sourced object for docs/05's 8–10 sentence "Britain ruled India and Indians won freedom back". The data says only "move an empire".
- [NEEDS SOURCE] (11.3) The word *satyagraha* and what it means (the data says "patience and truth").
- [NEEDS SOURCE] (11.4) 15 August 1947 as a day (the data says "in 1947").

**Ch 12**
- [NEEDS SOURCE] Chandigarh's construction and inauguration dates. The `hands` bead says the 1950s Capitol construction, and nothing for the city as a whole.
- [NEEDS SOURCE] The names of the Indian planners and architects who worked on it (the data names only Le Corbusier, in a source string).

**Ch 13**
- [NEEDS SOURCE] ISRO's founding date.
- [NEEDS SOURCE] Mangalyaan details (the data says only "missions to the Moon and Mars").
- [NEEDS SOURCE] Anything about Dr Kalam beyond the darshan text and *Wings of Fire*.
- [NEEDS SOURCE] "A phone in nearly every hand" (the era note says it, but no source string backs it, so the chapter doesn't use it).

---

### Reviewer checklist (summary)

| Ch | Flag | Default in this draft |
|---|---|---|
| all | Darshan boons turn sacred or real figures into rewards | Stripped. Told cards only. |
| all | Human raid kinds in the data's `raids` table | Never in the campaign (E3). The reviewer decides about free play. |
| 1, 5, 6, 8, 13 | `review: true` sutras (Pashupati, Walkers, Annapurna, River's first bead) | Off. |
| 3 | Kalinga and Ashoka's words | Omitted for 4–7. The data paraphrase is not used as a quotation. |
| 5 | Living temples as monument power-ups | Never the build target. The verb's use on shrines goes to the reviewer. |
| 6 | Qutb complex's contested history | Silent. Tower and pillar only. |
| **8** | **Sikh Gurus never depicted; Harmandir Sahib never built as a power-up; langar told, not mechanised; the Taj as a tomb; Amritsar's later violence** | **Hard flag.** Monument hidden, boon stripped, no later history. |
| 9–10 | The data's own colonial-violence flag | Fire, cyclone and mist only. No famine or plague. 8+. |
| **11** | **Freedom without violence; Gandhi and Ambedkar in the data's words only; no Partition** | **Hard flag.** `forget`/`mist`/`cyclone` only. 8+. |
| 12 | Chandigarh's Partition origin | Not told. The reviewer confirms. |

---

## Part G. Build plan

| Week | Work | Owner | Done when |
|---|---|---|---|
| **1** | **Blockers:** B1 soft-lock; city cards visible and Agla Saal re-enabled (E.6 #1); the success cue instead of the wrong sound and shake (#2); monuments drawn on kit boards and the map, with dry-land anchors (#3); save on spend and hide (#4); riddle question shown (B2) | India chat | S1, C1–C4, S3 |
| 2 | City UX pass: E.6 #5–#11 (open on the heart, holding bar, "⟳ View", overlaps, locks and "Unlocked:", desktop Enter, target sizes); sound and clock (C.4 #7) | India chat | C5–C7, S5–S6 |
| 3 | Payoff layer: floating yields, adjacency threads, piece card reasons (#12); turn report; goal strip; generous opening; honest coins | India chat | C8–C9 |
| 3–4 | Mithu leads; riddles teach; age bands; honest lengths and the start screen (Campaign · Short · Long) | India chat | S2 |
| 4 | Building scene states and the growth sequence (#13); map glyphs, glow radius, carts and sails (#14); the history-line → riddle pipeline (#15) | India chat + art | C10 |
| 4–10 | ***Mithu's Lamps***: the campaign engine (scenario presets, systems on/off per chapter, guide cards, Hall of Lamps, lamp-map); then chapters 1–4, and 5–13 at about two a fortnight. Each chapter's [NEEDS SOURCE] items are sourced and each flagged chapter is signed by the reviewer | content + India chat + reviewer | S7 per chapter |
| Ongoing | The badge travels; darshan cards reworked as story cards with no boon; `needs_review` cleared only after sign-off | reviewer | signed |

**Tests added to `tools/check-sabhyata.js`** (prove each by breaking it once):

| Group | Checks |
|---|---|
| Game level | S1–S7 |
| City and payoffs | C1–C10 |
| New checks | A campaign chapter cannot start with a system that its preset turns off. Every chapter's facts resolve to `data-sabhyata.js` entries with `sources[]` |

**What "done" looks like:**
- A child opens Sabhyata and is in Chapter 1 within one tap.
- Kesar and Mithu lead them to light four lamps in about 15 minutes.
- Every build visibly pays.
- Monuments stand on the board and on the map.
- The game can be finished.
