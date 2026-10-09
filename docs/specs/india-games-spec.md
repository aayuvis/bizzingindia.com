# Bizzing India — games specification (build-ready)

**For:** the Bizzing India chat, working in `aayuvis/bizzingindia.com`.
**From:** the games audit of 4 Oct 2026, in which all 15 Play-tab games were played to the end by keyboard, touch, a
random bot and a perfect bot. The code was re-checked on 8 Oct 2026 at `5d6a24e7`.
**Owner's standing rules for this work** (taken from the Bee and English game rounds, and binding here):
- **One in, one out.** The number of cards on the Play tab never goes up. Look-alike games merge into one hub card
  with modes.
- **No game exists for the sake of it.** Every card earns its place by teaching something the app is for.
- **The child chooses their level.** After each round, 50% or more keeps the level and under 50% drops it one level.
- **Flagships must be meaty.**
- **New games and hubs are symmetrical and full-bleed, with no white space.**
- **Coins are for learning only.** No coins for finishing, no streaks, nothing random in a reward.
- **The India editorial policy (docs/05) outranks any game idea.**

---

## 0. Executive summary

**Where it stands.** The Play tab has fifteen cards and **four real games**:
- **Sabhyata**, a civilisation game where reaching places *is* the history;
- **Rangoli Rush**, where random play cannot climb;
- **Carrom** and **Pallanguzhi**, where skill decides the result.

The rest have problems:
- Six of the remaining cards are **multiple-choice quizzes**. Three of them (State Hunt, Festival Frenzy, Jataka Jump) run on one
  engine where *random tapping scores 63–68%* and is told "Shabash — you did it!".
- **All six teaching quizzes pay 10 coins for finishing**, even on 0 out of 10. That breaks the family's first coin rule.
- The game host counts "rights" from CSS class changes, so every game shows impossible numbers ("43 right" on a
  15-question ladder, "18 right" in Ludo).

**What changes:**

1. **Fix the shared host first (weeks 1–2).**
   - Rights come from the engine, not the page.
   - Pay `answer` 1 per first-try right, never for finishing.
   - A miss holds and teaches.
   - Use one clock, honour the level rule, and route every sound through the app's mute.
2. **Two flagships.**
   - **Sabhyata** stays, but first gets a **blocker fix**: turning the first age currently folds every city and the game
     cannot be finished (§2.1, B1). Then it gets a 13-chapter campaign, *Mithu's Lamps*, one real place per age.
   - **Gattu aur Vismriti** (*Gattu and the Great Forgetting*) is promoted from the saga file that exists but is never
     loaded. It becomes the story spine that sends the child across India, restoring what the grey mist made a village
     forget, with each chapter played as one of the Play-tab games.
3. **Swap quizzes for games where the subject is the mechanic.** Each new card replaces a quiz or folds in a duplicate,
   one in for one out:

   | New card | What the child does | In for |
   |---|---|---|
   | **Naksha** | Taps the real India map | State Hunt |
   | **Panchang** | Turns a 12-month festival wheel | Festival Frenzy |
   | **Kaal Nadi** | Sets events along the River of Time | Saap-Sidi's card (Saap-Sidi moves into Ludo as a second mode) |
   | **Akshar** | Builds syllables in the family's own script | Rishtey quiz (Rishtey moves into Shabd as a pack) |
   | **Katha Chain** | Puts a tale back in order and predicts what happens next | Jataka Jump (the Jataka tales move into it as a pack) |

   - **Trivia Master** merges into **Gyanpati**. Its one good idea, choosing a category, comes with it; its streak
     multiplier does not.
   - **Ludo keeps its own card** (owner, 8 Oct 2026) and becomes the family's board game. **Saap-Sidi** moves inside it
     as a second mode.
   - **Kancha** and **Gutte** are removed (owner, 8 Oct 2026). **Pallanguzhi stays with a complete visual and
     handling redesign**, which the owner has funded ("improve its UI a hundredfold", §4.8). Their engines stay archived in `games-gully.js` with
     Patang, Gilli-danda and Pithoo.
4. **The heritage games stay honest.** They are played for fun, pay no coins, and the card says so.
   - **Ludo** gets real decisions, a 10-minute game and four-player family play (§4.6).
   - **Carrom** is rebuilt for smooth handling (owner: "not smooth, difficult UX-wise"). It gets a full-screen board
     38% larger, one gesture per job, a power pad below the board with a cancel, mouse aim on desktop, and no hitches
     (§4.7).

**Card count: 15 → 13.** The full ledger is in §3.

**Key insights**
- Every subject this app teaches has a natural *manipulable* form, and each game uses it:

  | Subject | Its natural form |
  |---|---|
  | Geography | a map |
  | Festivals | a calendar |
  | History | a timeline |
  | Language | a script |
  | Stories | a sequence |

  Today all five are taught as four-option questions. The quiz was the cheapest engine; it is the wrong one.
- The saga is the missing reason to come back. A story where the grey mist has made a village forget its festival, its
  songs and its words, and where every game played restores one thing, gives the Play tab a spine without a streak.
- Fixing the host and the pay path is a week's work and makes every existing game honest at once. It ships first.

**Implications**
- About 11 weeks of engineering, plus content work: saga Acts 2–5, Kaal Nadi event cards and Panchang dates. That
  content needs the **named reviewer** under docs/05.
- Pay falls for random play to zero, and rises for real learning.
- No card is added without one leaving.

---

## 1. Shared foundations (weeks 1–2, before any new game)

### 1.1 One result contract: the engine reports, the host never guesses

**Today:** `IND_GAMES` engines call `done({win, score})`, and the host counts rights by watching CSS classes
(`is-right` on the *correct* option). That produces "10 right" on a 0/10 round, and both the right and wrong sounds on
one miss.

**Change:** every engine reports each answer as it happens, and its result at the end:
```js
host.answer({ id, right: true|false, firstTry: true|false, skill: 'naksha.capital', objective: 'm3-capitals'|null })
done({ win, score, asked, firstTryRight, level, levelNext })
```

- The host's "right this game" counter, its sounds, the finish card and "what you practised" read **only** these
  reports.
- **Games with no answers** (Saap-Sidi, Ludo, Carrom) report none, and the host
  **hides** the counter for them.
- Delete the class-watching code.

### 1.2 One pay path

| Event | Pays | Where |
|---|---|---|
| A first-try right answer in any teaching game | `answer` 1 | `host.answer` → `earn('answer')`, at most 10 per round |
| A saga chapter restored with its skill shown (§2.2) | `stop` 5 | once per chapter per child |
| A Gyanpati ladder climbed to rung 10 or higher on first-try rights | `contest` 10 | once per day |
| Mastery evidence (a later-day re-check passed) | `mastery` 20 | through the existing mastery ledger only |
| Finishing, playing, time, dice, a heritage game | **0** | never |

- **Rishtey and Shabd terms** pay the first right answer per term per day only, which stops replay farming.
- **Saga "kauris"** (`reward: {kauris}` in `data-saga.js`) are removed. The family has **one** wallet, and a second
  in-game currency breaks the coin rule. The saga's reward is the restored village (§2.2).
- **TEACHES** becomes:
  ```
  ['gyanpati','shabd','naksha','panchang','kaalnadi','akshar','katha','sabhyata','saga','rangoli*']
  ```
  `*` Rangoli pays only on cleared levels, and only once it reports what it measured (§4.5).

### 1.3 The level rule (owner's rule, every teaching game)

- **A level chip on every teaching card's start screen: 1 · 2 · 3 · 4 · 5.** The child picks; the default is the last
  level played.
- **After each round:**
  - 50% or more first-try right **keeps** the level;
  - under 50% **drops it one**;
  - 80% or more **offers** the next level, and never forces it.
- The chip shows what each level means *in that game*. Examples: Naksha L1 = "big states by name", L5 = "rivers and
  neighbours".
- A level is stored per game, per child, through the Store seam.

### 1.4 One miss card

- A wrong first answer **holds**.
- It says "Not quite" in words, not only colour, and shows the right answer with its one-line teach.
- The child presses **Aage** (Continue) to move on.
- **No elimination guessing.** Greying out options until the right one is left is removed from State Hunt, Festival
  Frenzy and Jataka Jump.
- After a miss, a retry is allowed for *learning* but never scores.

### 1.5 One clock, one sound path

- **Clock:** every timer and physics loop uses `requestAnimationFrame` with **delta time**, and pauses on
  `visibilitychange`.
  - This fixes Sabhyata's live speeds and the Trivia sprint.
- **Sound:** all sound goes through `IND_SFX`/`IND_AUDIO`, so mute, Calm mode and ducking apply.
  - Sabhyata's private `blip()` AudioContext is removed.
  - Carrom, Ludo and Saap-Sidi get their missing sounds (die, pocket, ladder) through the same path.

### 1.6 The game stage: symmetric, full-bleed, no white space

This is the same contract as Bee §5.0 and English §1.8, and becomes a family drop-in.

- **A painted plate fills the stage edge to edge, in day and night versions.**
  - **Desktop** (1280 × 800): the play area is centred. The side panels hold the level chip, the score and a "what you
    are practising" note. They are mirrored left and right to within 4 px.
  - **Phone** (390 × 844): the play area takes the full width.
    - The action row (Lock karo, Aage, the options) is **sticky above the tab bar**.
    - Nothing a child must tap sits below the fold. That fixes Gyanpati, Shabd, State Hunt and Jataka today.
- **Tap targets ≥ 44 px.** This affects Sabhyata's HUD (40 px), Gyanpati's lifelines (40 px).
- **Tests T14/T15** (symmetry and no white space) run on every card at both sizes, in light and night.

### 1.7 Small shared fixes

- **Finish-card headline from the score:** no "Shabash — you did it!" on 0/6, and no "Ekdum sahi!" on 0/10.
- **Remove every in-a-row line:** "Three in a row!", "N in a row", the ×1.6 multiplier.
- **Remove claims the app never checks:** "Every question you met today is one you now know", and "You will meet it
  again" unless the word really goes back into the Bhasha review queue (§4.2).
- **Teach lines keep proper nouns capitalised** ("The Indian roller is Odisha's own bird").
- **Number keys 1–4 pick options in every multiple-choice game.**

---

## 2. The two flagships

### 2.1 Sabhyata (Explore): see `sabhyata-master.md`

**The full review, the city-building UX fixes, the payoff design, the *Mithu's Lamps* storyline (approved) and the
build plan are in `sabhyata-master.md`.** This section keeps the summary.

**What is broken** (reproduced):

| # | Finding | Severity |
|---|---|---|
| B1 | **Soft-lock: the game cannot be finished.** Turning the first age folds *every* era-0 city into a "remembered" city (`advance()`, sabhyata.js:5756–5779: `s.era <= G.era - 1`, where the code's own comment says "two full ages behind"). The child is left with 0 living cities and no explorer, so era-1 sites can never be found. Mithu says "Send an explorer" forever, and the panel still says "4 places awake". The only escape, a monument or a capital built *beforehand*, is never explained | **Blocker** |
| B2 | **Riddles never show their question.** Only "A question, traveller…" and three options appear; `s.ask.q` is never rendered | High |
| B3 | **A wrong riddle retries forever** and never shows the answer; full reward after guessing. Jokey distractors ("a stone spaceship") | High |
| B4 | **Good news sounds wrong.** The game's `warm` message class is read by the host as a near-miss: the "wrong" sound played 4 times and the frame flashed red twice in one turn. The "N right" counter never rises | High |
| B5 | `blip()` uses its own AudioContext and ignores mute and Calm | Medium |
| B6 | **Mithu's advice does nothing** when there is nothing to select. Following it for 90 turns gives 1 city awake and grain drained to 0. Mithu and the "Next:" line contradict each other | High |
| B7 | Live speeds keep ticking in a hidden tab | Medium |
| B8 | Touch targets: desktop HUD 40 px; inside a city on a phone, "← the map" is 89 × 36 and ☰ is 36 × 36 | Medium |
| B9 | **Pay:** 1 coin per new age and similar events; riddles pay nothing; the 10 for a full win is unreachable while B1 stands | Medium |
| B10 | Smaller faults: timers say "s" but count turns; two "TURN" buttons (one rotates the board); the kit cities' quest chip does nothing; low-contrast call cards; the phone map crops the selected city; teardown leaks listeners; the welcome card names about eleven systems in one paragraph | Low |

**The design problem behind the bugs:**
- **No goal on screen.** A child doesn't know what this age needs.
- **Too many systems for 4–12**, and no age bands: every child gets the same 13 eras.
- **The one decisive choice** (build a monument or name a capital before turning the age) is hidden, and is currently
  a trap.
- **The game is hours long.** It needs about 5,300 katha at +2 to +8 a turn. The Mela card says "12 min".

**Changes, in order:**

1. **Fix B1 now (S):**
   - fold only cities two or more ages behind;
   - **never fold the last living city**;
   - warn before the advance ("Lothal will become a memory: build a monument to keep it");
   - add a check in `tools/check-sabhyata.js` that plays from era 0 into era 1 and asserts a living city and a
     findable site.

   This is the one change that must ship this week.
2. **Mithu leads (M).**
   - His tap *does* the step or points at it with an arrow on the map.
   - `hint()` merges into him.
   - He ranks the age turn and help requests first.
3. **Riddles that teach (S–M):**
   - show the question;
   - one try scores, a miss shows the answer and its source line;
   - plausible distractors;
   - pay `answer` 1 for a first-try right.
4. **Fix the sound path (S):** rename `warm` so good news sounds good, and route `blip()` through `IND_SFX`.
5. **A goal strip** ("This age: lamps 2/4 · 📜 35/60") and **honest lengths** on the start screen (M).
6. **Age bands (M–L):**

   | Band | What is on |
   |---|---|
   | 4–7 | Waking and roads only, Sochna mode, no trees, 3 eras |
   | 8–10 | Adds buildings, quests and Vidya |
   | 11–12 | Everything |

7. **The badge travels (S plus the reviewer).**
   - Wake and About cards show 📜 and their sources, with a link into Itihaas.
   - `needs_review` clears only after sign-off. Points to review:
     - darshan cards that turn sacred figures into gameplay boons;
     - shrine "wonders" giving power-ups;
     - the Pashupati seal note;
     - the post-1200 framing.
8. **Touch and legibility (S):** 44 px everywhere, contrast, timers in turns, rename the rotate button, wire the kit
   quest chip, fix the teardown listeners.

**And a storyline: the Sabhyata campaign, "Mithu's Lamps"** (approved by the owner, 8 Oct 2026; the full storyline is
in `sabhyata-master.md`).

- **What it is:** a campaign of 13 short chapters, **one per era**, built as **scoped scenarios** on the existing engine.
  Each chapter has a preset start, one goal, a turn deadline and a guide.
- **Free play stays**, and becomes the reward for finishing the campaign. The campaign is also the onboarding (B6) and
  the honest length (B9).
- **Why history, not fiction:**
  - The chapters are **📜 Itihaas**, each anchored on a real object or place with its sources, unlike Inkwell and the
    Gattu saga, which are 🪔 Katha.
  - The guide characters are invented and labelled as such. The facts are not.
  - Keeping the badge honest is why Sabhyata is *not* folded into the Gattu saga, though both share Vismriti's mist
    as a visual frame.

| Ch | Era | Anchor (real, sourced) | Goal in the chapter |
|---|---|---|---|
| 1 | The First Cities | Dholavira's signboard; Lothal's dock | Wake all four Harappan cities, and send a bead cargo from Lothal by sea |
| 2 | Rivers and Kingdoms | Kashi on the Ganga | Join the river cities by road before the floods |
| 3 | The Great Sabha | Ashoka's rock edict at Dhauli; the Sopara edict | Carry the edict's words along the roads to both coasts |
| 4 | The Age of Wonder | Nalanda; Ajanta | Build a gurukul and bring scholars from three cities |
| 5 | Temples and the Sea | Mamallapuram's shore temples; Muziris | Open the sea road to the spice port |
| 6 | Domes and Minars | the Qutb Minar | Raise the tower and keep the craftsmen fed |
| 7 | The City of Victory | Hampi's bazaar | Fill Hampi's market from five different goods |
| 8 | Gardens and Marble | the Taj Mahal; the Harmandir Sahib | Build a garden and keep two cities content (reviewed for sacred framing) |
| 9 | Sails and Factories | Surat's harbour | Trade with three overseas partners |
| 10 | Railways and Presses | Bombay's first railway (1853) | Lay a line between two cities and print a newspaper |
| 11 | The Freedom Age | Sabarmati, Ahmedabad | Reach every city with a printed word (reviewed; no violence in a game) |
| 12 | The Young Republic | Chandigarh, a planned city | Lay out a city to a plan |
| 13 | The Takeoff | Bengaluru; Sriharikota | Connect the whole map and launch |

- **Length:** about 15–20 minutes per chapter.
- **Pay:** `stop` 5 per chapter completed with its riddle shown and answered first try, plus riddle `answer` coins.
- **Reviewer:** chapters 8, 11 and every darshan card need the named reviewer.

**Acceptance:**

| # | Check |
|---|---|
| S1 | Advancing from era 0 leaves at least one living city and a findable site |
| S2 | A new child following only Mithu wakes a city within 10 turns |
| S3 | Every riddle shows its question; a miss shows its answer |
| S4 | No positive message plays the wrong sound |
| S5 | Mute and Calm silence every Sabhyata sound; a hidden tab advances 0 turns |
| S6 | Every target ≥ 44 px on desktop and phone |
| S7 | Campaign chapter 1 completes in ≤ 20 minutes for a guided bot |

### 2.2 Gattu aur Vismriti (Story): the new flagship, in for Trivia Master's card

**What it is:**
- A told story (🪔 Katha, badged as such) that strings the Play-tab games into one adventure.
- **Vismriti**, the Forgetting, is an impersonal grey mist (per CLAUDE.md, never a villain and never sacred). It drifts
  into places, and they forget things: a festival's name, a song's tune, the word for grandmother, the way to the
  river, the order of a story.
- **Gattu** (the mascot) and **Mithu** (the parrot) travel with the child. Each chapter is restored by *doing the skill*
  in one of the games.
- Nobody loses a life. A `lose` beat is always an invitation to try again.

**What exists:**
- `data-saga.js` has Act 1, *The Fading Village*: four chapters built on the rangoli, festival and jataka engines, with
  binding editorial notes.
  - Amwa village and its festival, Kahani Raat, are invented on purpose.
  - The mist is undone by telling, never by fighting.
- **The file is never loaded, and nothing reads `IND_SAGA`.** Turning this on is the fastest flagship in the family.

**The shape: five acts, one region each, each act a short arc of 5–6 chapters.** Places are real and the people are
invented. Every factual line is sourced in the game data, not in the dialogue.

| Act | Region and setting | What the mist took | Games that restore it |
|---|---|---|---|
| 1 | *The Fading Village* (exists): Central India | the festival's name, the doorway patterns, the story's order | Rangoli, Panchang (replacing the festival engine), Katha Chain (replacing the jataka engine), Shabd |
| 2 | *The Silent River*: a riverside town in the east | the river's route to the sea, the boat songs, the ferry timetable | Naksha (rivers mode), Kaal Nadi, Shabd (Suno) |
| 3 | *The Unwritten Market*: a port in the south | the shop signs (the script itself), the spice route | Akshar, Sabhyata (sea roads, a scoped scenario) |
| 4 | *The Desert Fair*: the west | the fair's calendar, the puppet play's order, the walls' mandana patterns | Panchang, Katha Chain, Rangoli (mandana) |
| 5 | *The Mountain Pass*: the north-east and the Himalaya | the routes between valleys, the many languages of one bus stop, the oldest story of the place | Naksha (neighbours mode), Akshar (several scripts), Katha Chain |
| Finale | *Home*: wherever the child's family lives today, the diaspora kitchen | the family's own words | Shabd (the family's tongue), Rishtey pack: "ask your family" made into a real call |

**How a chapter plays:**
- A short illustrated scene, in comic-panel style, with Gattu and Mithu and the village in reported speech (Act 1's
  rule: no borrowed avatars playing villagers).
- One game round, launched with `opts` that **scope** it. For example:
  `{ engine: 'naksha', opts: { mode: 'rivers', set: ['Ganga','Hooghly'] } }`.
  Every engine must now read `opts`; none does today.
- A **restoration** moment: colour and sound return to the place on the saga map.
- **To restore a chapter, the child shows the skill:** at least 50% first-try right at the chosen level (the owner's
  rule). Below that, the mist thins a little and Gattu says "One more telling?", with no scolding and no lost
  progress.

**Why a child comes back (no streaks):**
- The saga map greys and colours by region.
- Each act ends on a real piece of culture the child can take home, such as a song from Geet or a recipe card from
  Utsav, always with "ask your family how *yours* does it".
- The finale asks the child to learn three words from their own family in their own tongue and teach Gattu. That is
  the app's whole purpose in one scene.

**Pay:** `stop` 5 per chapter restored (once), plus the inner game's `answer` coins. Nothing for watching scenes.

**Editorial (binding, owner plus the named reviewer):**
- 🪔 badge throughout. Real festivals, scripts and places are shown only through the sourced game data. Dialogue makes
  no factual claim.
- **Every region is many people.** No act reduces a region to one costume, one food or one religion. The "in many
  families…" voice is used.
- **No faith is the mist's victim, and no sacred object is something to "restore" by playing.** The mist takes ordinary
  things: songs, names, routes, recipes, the order of a story.
- **No deity is a character.** Gattu and Mithu are the only recurring cast.
- **Act 5's languages:** the bus stop shows each script set correctly in its own face, with no Latin stand-ins (the
  Devanagari rule, extended to all scripts).

**Acceptance:**

| # | Check |
|---|---|
| G1 | `data-saga.js` loads, and Act 1 is playable end to end on desktop and phone |
| G2 | Every chapter's engine honours `opts`; a scoped round only asks its scope |
| G3 | A random bot restores no chapter |
| G4 | No `kauris` field remains; pay goes only through `earn` |
| G5 | Each act's text has the reviewer's sign-off before release (tester mode until then) |

**Build:**
- Weeks 3–4: load Act 1, retarget its chapters 3–4 to Panchang and Katha Chain when they ship (until then, the
  existing engines), and build the saga map.
- Content: Acts 2–5 at about one act a fortnight, each reviewed.

---

## 3. The lineup: one in, one out

### 3.1 The ledger

**Today, 15 cards:**
- Sabhyata · Gyanpati · Trivia Master · Shabd Challenge · State Hunt · Festival Frenzy · Jataka Jump · Rangoli Rush
- Saap-Sidi · Ludo · Carrom
- Kancha · Pallanguzhi · Gutte
- Rishtey quiz (from home)

| Out (or folded in) | Where it goes | In | Why |
|---|---|---|---|
| Trivia Master | Its category picker and the 9+ sprint move into **Gyanpati**; the streak multiplier is deleted | **Gattu aur Vismriti** (flagship) | Same question bank as Gyanpati with weaker integrity; the freed card holds the story spine |
| State Hunt | Its clues, capitals and silhouettes become Naksha's data | **Naksha** | A map game must be played *on the map*; random tapping scored 63% |
| Festival Frenzy | Its twelve festivals and teach cards become Panchang's data | **Panchang** | A calendar subject needs a calendar; random scored 68% with three options |
| Jataka Jump | Its eight tales become a Katha Chain pack | **Katha Chain** | The moral was the only sensible option; sequencing makes reading the tale necessary |
| Rishtey quiz | Becomes Shabd's *Parivaar* (family) pack, shuffled and paid once per term per day | **Akshar** | A fixed 12-card list that could be farmed; the missing game is script-building |
| Saap-Sidi (its card) | Becomes a second mode inside **Ludo** | **Kaal Nadi** | Two dice races in two cards; the owner likes Ludo, so Ludo keeps the card. History has no ordering game |
| Kancha | **Removed** (owner); engine archived | — | Fun core, but broken on phones and teaches nothing the app is for |
| Gutte | **Removed** (owner); engine archived | — | The controls decided it more than timing did |

**After: 13 cards.**

| Group | Cards |
|---|---|
| **Flagships** | Sabhyata · Gattu aur Vismriti |
| **Know** | Gyanpati |
| **Map · Time · Calendar** | Naksha · Kaal Nadi · Panchang |
| **Language** | Shabd · Akshar |
| **Story and art** | Katha Chain · Rangoli Rush |
| **Aangan ke khel** (for fun, no coins) | Ludo (+ Saap-Sidi) · Carrom · Pallanguzhi (redesign funded) |

**Rules:**
- **A card count test (T16) fails if the Play tab ever shows more than 13 cards.**
- The archived gully engines (Kancha, Gutte, Patang, Gilli-danda, Pithoo, in `games-gully.js`) come back only through
  one in, one out, and only after passing the clock and touch checks (§1.5, §1.6).

### 3.2 My assessment behind the ledger

| Game | Audit (out of 75) | Real skill? | Verdict |
|---|---|---|---|
| Sabhyata | 51 | yes, the subject is the mechanic | flagship; onboarding fix |
| Carrom | 51 | yes, aim; handling is clumsy | keep; rebuild the controls and the stage |
| Rangoli Rush | 49 | yes, memory and symmetry | keep; timer bug, painted stage |
| Shabd Challenge | 48 | partly, audio as mechanic | keep; link to Bhasha |
| Gyanpati | 44 | recall only | keep as *the* quiz; absorbs Trivia |
| Pallanguzhi | 44 | yes, lookahead; the UI is poor | keep, with the full redesign (funded, §4.8) |
| Saap-Sidi | 41 | none | keep as heritage, a mode inside Ludo |
| State Hunt | 39 | none (63% random) | rebuild as Naksha |
| Festival Frenzy | 39 | none (68% random) | rebuild as Panchang |
| Ludo | 39 | barely (fixable) | **keeps its card** (owner likes it); add real decisions |
| Kancha | 38 | yes, but broken on phones | **removed** (owner) |
| Rishtey quiz | 38 | farmable | Shabd pack |
| Trivia Master | 37 | recall plus a streak | merge |
| Jataka Jump | 36 | none (the answer is obvious) | Katha Chain pack |
| Gutte | 36 | controls decide it | **removed** (owner) |

### 3.3 Names (owner to confirm)

| Card | Suggested | Alternatives |
|---|---|---|
| Story flagship | **Gattu aur Vismriti** | Gattu's Great Journey · The Great Forgetting |
| Map | **Naksha** | Bharat Darshan · Map Detective |
| Calendar | **Panchang** | Utsav Chakra (festival wheel) · The Year Wheel |
| Timeline | **Kaal Nadi** | River of Time · Itihaas Ki Nadi |
| Script | **Akshar** | Barakhadi · Letter Builder |
| Story order | **Katha Chain** | Kahani Ki Kadi · Story Beads |
| Board game | **Ludo** (with Saap-Sidi inside) | Ludo & Saap-Sidi · Aangan |

Each card carries a one-line English subtitle (e.g., "Naksha · find it on the map"). The Hindi names are the app's
house style for its sections, and the subtitle keeps them open to every family. They are never a statement that Hindi
is India.

---

## 4. Detailed specs: the games that stay

### 4.1 Kaun Banega Gyanpati? (Know): the one quiz, absorbing Trivia Master

**Keep:**
- the 15-rung ladder;
- *Lock karo* and the dramatic pause;
- the teach line that waits for *Aage*;
- the kind "knew / learned" end chips.

**Changes:**
1. **Category picker** (from Trivia Master): Naksha, Itihaas, Utsav, Khazana, Mahakavya, or *Sab kuch* (everything).
   The ladder draws its rungs from the chosen categories.
2. **The ladder adapts to the child.** Rungs 1–3 re-ask *yesterday's* missed or learned questions (spaced retrieval,
   which counts toward mastery on a later day). The rest climb by difficulty at the chosen level.
3. **Sprint mode** (9+ only, from Trivia): 60 seconds, first-try rights only.
   - No multiplier and no "in a row".
   - Delta-time clock, paused when the tab is hidden.
4. **Lifelines** (Gattu ka Guess, Poochho Nani, 50:50) become **deterministic**:
   - *Poochho Nani* gives a one-line clue from the question's teach text, never the answer;
   - *Gattu ka Guess* is honest about being a guess (Gattu is right about 60% of the time on a **fixed**, seeded
     schedule per question), so nothing in the reward path is random.

   A rung answered with a lifeline still pays if right, but does not count toward the ladder's `contest` threshold.
5. **Phone:** the Lock karo row and the lifelines are sticky above the tab bar.
6. **Pay:** `answer` 1 per first-try right (capped at 10 a round), plus `contest` 10 once a day for rung 10 or higher
   without lifelines.

**Acceptance:**

| # | Check |
|---|---|
| Q1 | A random bot earns 0 coins over 20 rounds (no rungs above 4, since rungs need first-try rights) |
| Q2 | One wrong answer plays exactly one sound |
| Q3 | The finish counter equals the engine's `firstTryRight` |

### 4.2 Shabd Challenge (Language): wired to Bhasha, with the Parivaar pack

**Keep:**
- the nine language packs, with the family's own tongue preselected from `data-tongue.js`, never Hindi by
  assumption;
- native audio, correct script faces, `lang` attributes and right-to-left Urdu;
- the three modes: word → meaning, meaning → word, and **Suno** (hear it, pick it).

**Changes:**
1. **Words come from the child's Bhasha review queue.** About half are due or missed items and half are new at the
   chosen level.
   - **Misses are written back** to the queue, so "You will meet it again" becomes true.
   - A right answer on a later day credits the word through Bhasha's mastery rule.
2. **Parivaar pack (from the Rishtey quiz):**
   - **Shuffled** family-tree slots and options, with each term's audio.
   - A miss says "Not quite" in words and shows the card.
   - Pays once per term per day.
   - The finish keeps Rishtey's best line: "Use one of these words on your next family call."
   - **Parivaar terms differ by language and region** (Nani/Ammamma/Dida…). The pack follows the family's tongue and says
     "in many families…" where terms vary.
3. **Suno for pre-readers (5–7):** pictures instead of written options, audio only, with no reading needed.
4. Remove "Wah! Three in a row!", and fix the start button hidden under the phone tab bar.

**Acceptance:**

| # | Check |
|---|---|
| W1 | A missed word appears in Bhasha's due list the next day |
| W2 | Replaying Parivaar earns at most one coin per term per day |
| W3 | No streak copy anywhere in `games-shabd.js` |

### 4.3 Naksha (Map): new, in for State Hunt

**The promise:** a child finds India on the map with their own finger. The data is already in the app:
- 37 states and union territories with capitals (`data-geo.js`, `data-states.js`);
- the physical layer of rivers and mountains (`data-bhugol.js`);
- the Survey of India geometry (`map-data.js`).

**Modes, unlocked by level:**

| Level | Mode | What the child does |
|---|---|---|
| 1 | **Dhoondho** (Find it) | "Tap Rajasthan." Large states first, with the name shown |
| 2 | **Rajdhani** (Capitals) | "Tap the state whose capital is Bhubaneswar." The capital's dot appears after the tap |
| 3 | **Pehchaano** (Clues) | A clue from `data-states.js`: "Its state animal is the one-horned rhino." Tap the state |
| 4 | **Padosi** (Neighbours) | "Tap every state that touches Madhya Pradesh." Neighbours are computed from shared boundary segments at build time, not typed by hand |
| 5 | **Nadi** (Rivers) | "Tap the states the Godavari flows through, from source to sea," in order |
| Saga only | **Yatra** (Journey) | Tap a route of 3–5 states in order for a story train |

**Mechanics:**
- **One tap answers.** A wrong tap holds:
  - the tapped state gets a soft grey fill and its name;
  - the right state gets a soft warm fill and its name and the teach line;
  - the child presses **Aage**.
- Pinch-zoom and pan on phones, and arrow keys plus Enter on desktop. A keyboard cursor moves between state centroids
  in reading order, and a search-by-letter jump is offered.
- Tiny territories (Lakshadweep, Puducherry, Chandigarh, Dadra & Nagar Haveli and Daman & Diu, Delhi) get an enlarged
  invisible hit zone and a callout bubble. Lakshadweep is drawn as a marker, as `data-geo.js` already does.

**Map rules (binding, from CLAUDE.md):**
- Survey of India depiction for every user in every locale.
- **J&K shown whole.**
- **No border ever draws itself, pulses, animates, is "won" or moves as a reward.** A found state's *fill* tints
  softly; its outline never changes.
- No region-varying geometry.

**Pay:** `answer` 1 per first-try right. The level rule applies.

**Acceptance:**

| # | Check |
|---|---|
| N1 | A random tapper scores under 10% at L1 (the number of states makes that so) |
| N2 | A map-snapshot test: across a whole round, no boundary path's `d` or stroke changes |
| N3 | J&K's outline equals `map-data.js`'s whole outline in every locale |
| N4 | All 37 states and territories are reachable by keyboard |
| N5 | The neighbour data is generated and its test reproduces it from geometry |

### 4.4 Panchang (Calendar): new, in for Festival Frenzy

**The promise:**
- Festivals are *when*, and a calendar is something you turn.
- Teach the shape of a year in a home that keeps more than one calendar.
- Never rank a faith.

**Data:**
- `data-utsav.js` (110 KB: festivals with months, regions, what families do, sources);
- Festival Frenzy's twelve festivals and teach cards.

**Modes:**

| Level | Mode | What the child does |
|---|---|---|
| 1 | **Kab?** (When?) | Drag a festival card to its month on a 12-month wheel |
| 2 | **Mausam** (Season) | Place it by season and harvest. Pongal, Lohri, Bihu and Makar Sankranti sit together; the teach card shows how one harvest moment has many names |
| 3 | **Chaand** (Moon) | Learn which festivals follow the moon. The wheel shows two years side by side, and the child places Eid in each. Its drift of about 11 days a year is the lesson |
| 4 | **Kyon?** (Why?) | Match the festival to *what families do* (lamps, colours, a fast and its breaking, a new year), from the festival's own tradition |
| 5 | **Mera saal** (My year) | Build *your family's* year: the child picks the festivals their family keeps, with "ask your family". This mode is never scored |

**Mechanics:**
- **Accepting a placement:** a placement is right if it falls inside the festival's month window for the shown year,
  taken from data. Lunisolar festivals carry a window ("October or November").
- A miss holds and shows the window with the teach card.
- Keyboard: arrows move the card around the wheel, Enter drops it. Touch: drag, or tap the card and then tap the
  month.

**Editorial (binding):**
- Faiths from the inside.
- **Equal visual weight** for every festival on the wheel.
- Never "the biggest festival". Use "in many families…" and "ask your family".
- **Dates are data, sourced per year.** No festival date is ever typed from memory. The wheel ships with the coming
  year's dates and refreshes from data each year.

**Pay:** `answer` 1 per first-try right. Mode 5 pays nothing; it is a gift to the family, not a test.

**Acceptance:**

| # | Check |
|---|---|
| P1 | A random placer scores under 15% at L1 |
| P2 | Every festival shown has a sourced window for the displayed year |
| P3 | The Eid placement in year+1 is earlier than in year (the drift test) |
| P4 | No festival card is larger, brighter or first by default |

### 4.5 Rangoli Rush (Art and memory): keep, fix, paint it

**Keep:** the memory-and-symmetry mechanic, the 100-level ladder and the twists every fourth level.

**Changes:**
1. **The timer bug:** "I have got it" must clear the show interval, and `drawPhase()` must be guarded by phase, so a
   checked answer is never wiped.
2. **A painted threshold:** draw on a doorway, using chalk-texture dots on a floor plate in day and night.
3. **Shape markers per colour** (dot, ring, petal, star), so colour is never the only signal.
4. **Regional traditions, credited and played.** Twist levels rotate through:
   - **kolam** (Tamil Nadu): continuous line around the dots, with the *order* hidden;
   - **muggu** (Andhra Pradesh, Telangana);
   - **alpana** (Bengal): freehand curves on a grid;
   - **mandana** (Rajasthan): geometric, on a wall plate;
   - **rangoli** (Maharashtra, Gujarat and widely).

   Each names its tradition and region on the level card (the folk-art credit rule).
5. **Twists can fail.** The kolam's hidden order must be traced, and points are floored at 0.
6. **TEACHES:** Rangoli pays `answer` 1 per level cleared at first try, and reports the measured skill
   (`memory.pattern`, cells correct). With that it joins TEACHES honestly.

**Acceptance:**

| # | Check |
|---|---|
| R1 | Clicking "I have got it" early, then waiting 10 s, never changes a checked result |
| R2 | A random dotter clears 0 levels |

### 4.6 Ludo (for fun): keeps its card, with Saap-Sidi inside (owner likes Ludo)

**Why it stays:** it is the game families already play together, at home and on the phone. The aim is to make it the
best family board game in the app, not to make it teach.

**Today's problems** (audit):
- Rounds take 6–7 minutes with long stretches where no move is legal.
- The move choice barely matters.
- With every token in the yard, a 3 says "the last step needs the exact number", which is the wrong reason.
- The header shows "18 right".
- There are no sounds of its own.

**Changes:**
1. **Three game lengths on the start screen:**

   | Length | Tokens each | About |
   |---|---|---|
   | Jaldi (Quick) | 2 | 4 minutes |
   | Classic | 4 | 10 minutes |
   | Lambi (Long) | 4, with the full rules | 15+ minutes |

2. **Real choices, made visible.**
   - When more than one token can move, each legal destination shows a small preview: "safe star", "captures Gattu",
     "lands next to Gattu, risky" or "reaches home".
   - The child still chooses; the preview just makes the choice *a choice*.
   - When exactly one move is legal, it happens automatically after a beat. This removes the dead taps.
3. **Family play, up to four:**
   - pass-and-play on one device for 2–4 players;
   - any seat can be Gattu;
   - each player picks a colour and their family avatar.
   - This is the reason a child opens Ludo with a grandparent.
4. **Gattu tiers:**

   | Tier | How Gattu plays |
   |---|---|
   | Naya (beginner) | moves his furthest token |
   | Saathi (partner) | captures when he can and hides on stars |
   | Ustaad (expert) | weighs risk |

   Gattu adapts one tier after two losses or wins in a row. This is deterministic play, not luck.
5. **Pachisi mode** (heritage, optional): the cross-shaped board and **cowrie-shell throws** in place of the die, with
   counting the open shells as the throw. The game's history and region are credited.
6. **Saap-Sidi, as the second mode inside the card** (Gyan Chaupar):
   - young bands (4–6) tap their own landing square;
   - each ladder's virtue and each snake's vice is read aloud with a one-line meaning.
7. **Fixes and feel:**
   - the yard message: "You need a 6 to bring a token out";
   - die, step, capture and home sounds through `IND_SFX`;
   - smooth token hops;
   - **no right-counter**;
   - keyboard and touch on a par.
8. **Pay: nothing**, labelled "played for fun".

**Acceptance:**

| # | Check |
|---|---|
| L1 | Quick mode finishes in ≤ 5 min for two bots |
| L2 | No tap is ever required when only one move is legal |
| L3 | Four-player pass-and-play completes |
| L4 | The yard message is correct |
| L5 | The header shows no counter |

### 4.7 Carrom (for fun): make it smooth and easy to *handle* (owner: "not smooth, difficult UX-wise")

The physics is good: a fixed 120 Hz step, delta time, a cached board layer, and a median frame of 16.7 ms measured on a
phone. The problem is **handling**. Measured on a 390 × 844 phone (8 Oct 2026, `games-carrom.js`):

| Finding | Evidence |
|---|---|
| **The board is small** | 266 px wide on a 390 px phone (68% of the width). The page chrome above it (demo banner, top bar, search bar, "Mela" back pill, the word "Carrom" twice, score chips) and the tab bar below eat the screen |
| **So the pieces are tiny** | Striker 16 px across, coins 12 px, pockets 21 px. A child's fingertip (about 40 px) covers the striker and its aim line while aiming |
| **One gesture does three jobs** | Grabbing the striker slides it; pulling back past the line silently turns the same drag into a sling; touching anywhere else starts a sling anchored *where you touched*, not at the striker. The direction depends on an invisible anchor |
| **There is no way to cancel a shot** | Any release with more than 7% power fires. A child who changes their mind mid-pull has to drag back to exactly zero |
| **Three ways to do one thing** | Drag the striker, a slider under the board, or arrow keys, plus a two-line instruction paragraph explaining all three ways and the sling and the keyboard |
| **Power and aim are drawn under the finger** | The power arc rings the striker itself, so the thumb hides both |
| **One visible hitch** | A 266 ms frame at a turn change (measured once in a 22-second run) |
| **Desktop aim is coarse** | A/D or ↑/↓ step 0.055 radians (about 3°) per press; there is no mouse "point to aim" |

**Changes (UX first; the rules stay):**

1. **Play full-screen.** When a match starts, the stage takes the whole viewport, with a small ✕ and the score:
   - the search bar, the duplicate titles, the back pill and the tab bar hide until the match ends or is paused;
   - the board fills **≥ 94% of the width** on a phone, about 366 px instead of 266. That makes every piece **38%
     larger**: striker about 22 px, coins about 16 px, pockets about 29 px;
   - landscape on phones and tablets is supported, with the board at full height.

   This is the stage contract (§1.6) applied properly. It is the single biggest fix.
2. **One gesture, one job, in the order a real player does it:**

   | Step | What the child does | What it does |
   |---|---|---|
   | **Place** | Drag the striker along the baseline | Only slides it; it can never fire |
   | **Aim** | Tap or drag anywhere *ahead* of the striker | Turns the aim line to point there. The line runs from the striker to the first coin it will hit, with a ghost striker at contact |
   | **Shoot** | Pull back on the **power pad**, a large strip *below the board* in the frame, out of the board's way, then release | Sets power and fires. The finger never covers the board |
   | **Cancel** | Slide back into the pad's ✕ end, or lift outside the pad | Cancels with zero power |

   - The slider under the board is removed, because the striker itself is now easy to drag at 22 px with a 44 px hit
     area.
   - The flick sling stays as an option in settings for children who like it, now anchored *on the striker*, with the
     same cancel zone.
3. **Feedback where the eyes are.**
   - Power is shown as a fill on the power pad and as a number (0–100), not as an arc under the thumb.
   - A light haptic tick where the device allows it.
   - The aim line shows its first contact, and a short arrow for where that coin will go.
4. **Fine aim.**
   - On touch, a two-finger nudge or the ‹ › buttons beside the pad turn the aim by 0.5°.
   - On desktop, **the mouse points to aim** (as in any pool game), the wheel or ‹ › fine-tunes, and you hold and release
     to shoot.
   - Keyboard: ←/→ place, ↑/↓ aim at 1° steps (Shift for 0.25°), hold Space for power, Esc cancels.
5. **Smoothness.**
   - Find and remove the 266 ms hitch at turn changes: no layout or `fit()` work during play, and pre-render Gattu's
     tween.
   - Render with interpolation between physics steps (a smooth 90/120 Hz display, no stepping).
   - Coins ease to rest (exponential plus linear friction), instead of the linear stop that ends abruptly.
   - A short pocket-drop animation (kept off under reduced motion).
   - Gattu's "thinking" pause is capped at 0.8 s, then he slides and shoots.
6. **Learn it in 30 seconds.**
   - A three-step first-shot coach (Place → Aim → Shoot) with arrows, shown once and replayable from "?".
   - The two-line instruction paragraph goes.
7. **Sounds:** striker click, coin knock, wall thud and pocket drop, all through `IND_SFX`.
8. **Fairness, lightly:**
   - Gattu's wobble widens a little after two losses in a row and narrows after two wins. This is deterministic.
   - A Short match (first to five coins) is offered alongside the full game.

**Acceptance:**

| # | Check |
|---|---|
| CR1 | On 390 × 844 the board is ≥ 360 px wide during a match, and the striker's hit area is ≥ 44 px |
| CR2 | Dragging the striker with any downward drift never fires a shot (scripted test: 200 drags with ±20 px drift → 0 shots) |
| CR3 | Every shot can be cancelled (lift outside the pad, or slide to ✕) |
| CR4 | No frame over 50 ms during a full match on a mid-range phone profile |
| CR5 | The aim line and the power value are never under the touch point |
| CR6 | Mouse point-to-aim works on desktop, and keyboard play completes a match |


### 4.8 Pallanguzhi (for fun, the one real strategy game): a complete redesign (owner: funded, 8 Oct 2026)

**What a child sees today** (measured on 8 Oct 2026, desktop 1280 × 800 and phone 390 × 844):

| Problem | Evidence |
|---|---|
| **The board is below the fold** | On desktop the board starts 620 px down an 800 px screen; on a phone it starts below the whole first screen. The rules card opens *over* the board, and its "Shuru — play!" button sits under the phone's tab bar |
| **Words before play** | A title card, a description, four status chips ("Your pouch 0", "your turn — pick a pit", "Gattu 0", "first to 36") and a three-rule modal, all before one shell moves |
| **Dark on dark** | Dark brown pits on a dark brown board. The shell counts are small grey digits above and below the pits |
| **The shells don't show the count** | Every pit draws the same three shells whether it holds 5 or 15. The child has to read the number, which defeats a counting game |
| **Tiny on a phone** | Pits about 32 px, shells 5–7 px, counts about 7 px text |
| **The stores are unlabelled holes** | "you · 0" and "Gattu · 0" are faint text beside two empty circles at the board's ends |
| **The sowing is invisible** | Shells jump. The child cannot follow the anticlockwise path, so the capture rule ("the pit *after* your last shell") is impossible to see happen |
| **The hint teaches greed** | It glows Gattu's greedy pit, which loses every game against Gattu (audit) |

**The redesign:**

1. **The board is the screen.**
   - Full-screen during play, as for Carrom (§4.7).
   - Desktop: the board fills the stage width, about 1100 px, centred, with both stores as large carved bowls at the
     ends.
   - **Phone: the board turns vertical.** Two columns of seven pits run top to bottom, each pit ≥ 48 px, your column
     nearest your thumb, and Gattu's store at the top and yours at the bottom.
   - No title card, no description and no chip row during play. The score sits in each store.
2. **A board you want to touch.**
   - A painted carved-wood pallanguzhi plate, in day and night, from the family art pipeline with no lettering.
   - Fourteen pits lit from above, with real **cowries or tamarind seeds**.
3. **Shells show the count:**
   - up to 12 shells are drawn individually and packed naturally in the pit;
   - above 12 the pit shows a heap, with the number in a clear badge (≥ 16 px, high contrast);
   - the stores show the real heap growing.
4. **Sowing you can follow.**
   - Tap a pit and its shells lift into Gattu's or your hand (a small hand cursor).
   - They drop **one by one** around the board, anticlockwise, about 140 ms each, with a soft *tock* per shell through
     `IND_SFX`.
   - A **"Jaldi"** (fast) toggle speeds this up for experienced players. Reduced motion shows the path as a numbered
     trail instead.
5. **Preview before you commit, which is the lookahead lesson.**
   - Press and hold a pit, or hover on desktop, to see a **ghost trail**: where each shell will land, the last landing
     pit highlighted, and whether it captures ("+7 — the kasi!").
   - At the Naya level the preview also shows **Gattu's best reply** ("…then Gattu can take 9").
   - Lifting your finger away cancels; tapping again commits.
   - This replaces today's greedy hint, and it is the whole skill of the game made visible.
6. **Captures and rounds that feel like events.** On a capture, the captured shells arc into your store with a
   *chhan* sound and a brief glow, and the rule is named once: "Empty pit after your last shell, so you take the pit
   beyond: the kasi."
7. **Learn it by playing, not by reading.**
   - Replace the three-rule modal with a **three-move coach** on a tiny board: sow, then a capture, then the round end.
   - Each step has an arrow and one line, and it can be replayed from "?".
8. **Gattu you can beat, and learn from.**
   - Tiers: Naya (greedy), Saathi (two-move lookahead), Ustaad (four-move). Gattu adapts after two results in a row,
     deterministically.
   - **Gattu's move is shown slowly**, with his ghost trail drawn first, so the child sees what a good move looks like.
9. **Fair variety without luck.** The starting layout rotates through a fixed list of fair openings, so a winning line
   cannot be memorised.
10. **Accessibility.**
    - Keyboard: ←/→ moves between your pits, Space previews, Enter sows, Esc cancels.
    - A screen reader announces "Pit 3, 7 shells, lands in Gattu's pit 2."
    - Colour is never the only signal: your pits are rimmed, Gattu's are not.
11. **Credit:** Pallanguzhi, Tamil Nadu; played across South India as Ali Guli Mane (Karnataka), Vamana Guntalu (Andhra
    Pradesh) and Kuzhipara (Kerala). Named on the card, with "ask your family what *you* call it".

**Pay: nothing** ("played for fun").

**Acceptance:**

| # | Check |
|---|---|
| PZ1 | On 390 × 844 the whole board is visible without scrolling, every pit ≥ 48 px and every count ≥ 16 px |
| PZ2 | Each pit's drawn shells equal its count up to 12 |
| PZ3 | Sowing animates one shell per pit, in order, and can be followed frame by frame |
| PZ4 | The preview's predicted landing and capture always equal the engine's result (tested over 1,000 random boards) |
| PZ5 | A two-move-lookahead bot beats Naya Gattu more than 70% of the time; greedy play loses to Saathi |
| PZ6 | Nothing appears before the first move except the board and the coach |

**Funded by the owner (8 Oct 2026).**


---

## 5. The new games

### 5.0 The stage

All new games use §1.6. Each has a painted plate:

| Game | Plate |
|---|---|
| Naksha | a hand-drawn paper map on a desk |
| Panchang | a brass calendar wheel on a wall |
| Kaal Nadi | a river seen from above, flowing left to right (top to bottom on phones) |
| Akshar | a slate and chalk, or a palm-leaf for the southern scripts |
| Katha Chain | a kathputli (puppet) stage, with Pattachitra or Madhubani framing **credited by tradition and region** |

Nothing structural (the map, the wheel, the river's eras, letters) is ever painted into the plate. The app draws it.
This is the family art rule: a model letters badly and counts badly.

### 5.1 Kaal Nadi (Time): new, in for Ludo's card

**The promise:**
- History is a river.
- A child who can put things in order, and say *how we know*, can read history.

**Data:**
- `data-itihaas.js` (River of Time, already the app's metaphor), whose events have `when` as ranges ("about 2600–1900
  BCE") and named evidence;
- `data-sabhyata.js` eras and sites.

**Modes:**

| Level | Mode | What the child does |
|---|---|---|
| 1 | **Pehle–Baad** (Before/after) | Two cards: which came first? (The Harappan cities, or Ashoka's edicts?) |
| 2 | **Teen ki Kadi** (Chain of three) | Order three |
| 3 | **Nadi par** (On the river) | Drop 5 cards onto the river, which is divided into era banks (Harappan · Vedic · Mauryan · Gupta · Delhi Sultanate and Vijayanagara · Mughal · Colonial · Freedom · Republic). A card is right if its range overlaps the bank |
| 4 | **Kaise pata?** (How do we know?) | Match each event to its evidence: "edicts carved on rocks you can still visit", "coins", "a traveller's account", "an inscription" |
| 5 | **Kadi todo** (Break the chain) | Find the one card in a placed row that is out of order, and explain why by picking its evidence |

**Mechanics:**
- Drag or tap-to-place, and arrows plus Enter.
- **Ranges are honoured:** a card whose range spans two banks is right on either.
- A miss holds and shows the card's range on the river with the evidence line.

**Editorial (binding, docs/05):**
- **Evidence is named on every card.** Never write history from memory: each card carries `sources[]`.
- **Contested chronology is never scored.** Cards whose `when` is marked contested in the data ("historians argue about
  exactly when") appear only in a **"Historians are still arguing"** lane. They teach that history has open questions,
  and are never right or wrong.
- **Sensitive topics are not in this game:** Partition, communal conflict, colonial violence and caste. Docs/05 reserves
  them for a human author with a named reviewer, and a sorting game is the wrong form for them. The Colonial and
  Freedom banks hold institutions, people and documents (the railways, the 1885 Congress, the Constitution), each
  reviewed.
- Itihaas 📜 badge on every card.

**Pay:** `answer` 1 per first-try right. **Acceptance:**

| # | Check |
|---|---|
| K1 | A random placer scores under 20% at L3 |
| K2 | Every card has `sources[]` |
| K3 | No contested card is ever scored |
| K4 | No card carries a sensitive-topic tag |
| K5 | The reviewer has signed the card set before release |

### 5.2 Akshar (Script): new, in for the Rishtey quiz's card

**The promise:**
- A child can read and build syllables in **their family's own script**.
- It is never "Hindi = Indian". The script follows `data-tongue.js`: Devanagari, Bengali–Assamese, Gurmukhi, Gujarati,
  Odia, Tamil, Telugu, Kannada, Malayalam, and Urdu (Nastaliq, right to left).
- It fills the audit's largest content gap: barakhadi, matras and conjuncts.

**Modes:**

| Level | Mode | What the child does |
|---|---|---|
| 1 | **Suno aur Chuno** (Listen and pick, pre-readers 5–7) | Hear a letter; pick it from three, all shown large in the family's script |
| 2 | **Barakhadi** | A consonant plus each vowel sign: build क → का कि की कु कू … by dragging matras onto the consonant (or the matching grid in other scripts) |
| 3 | **Shabd Banao** (Build a word) | Hear a two- or three-syllable word from Bhasha's list; build it from syllable tiles |
| 4 | **Jodakshar** (Conjuncts) | Join two consonants into a conjunct (क + ष = क्ष, न + द = न्द, the scripts' own forms) and read the result |
| 5 | **Likho** (Write it) | Trace the syllable. Devanagari uses `likhna.js`'s stroke data; other scripts get tracing only where stroke data exists (no invented stroke orders) |

**Rendering rule (critical):**
- Every built syllable is **rendered as one shaped text string in the script's real font**, never as glued glyph
  images or adjacent tiles.
- That way the shirorekha stays unbroken, the vowel sign ि sits *before* the consonant visually, and Tamil and
  Malayalam vowel signs reorder correctly.
- The tiles are input; the display is always shaped text.
- **No letter-spacing.** Indic text is set about 10–15% larger than Latin, with line-height ≥ 1.7 (CLAUDE.md).
- Urdu builds right to left, with joining forms rendered by the font.

**Mechanics:**
- Drag tiles, or tap-tap (tile, then slot). Keyboard: Tab between tiles, Enter places.
- **Audio** for every syllable and word, in the native voice, as Shabd already has.
- A miss holds, plays the right syllable and shows it built.

**Pay:** `answer` 1 per first-try right. Syllables move into the Bhasha review queue as they are learned.

**Acceptance:**

| # | Check |
|---|---|
| A1 | A snapshot test confirms every displayed syllable is a single text node with the right `lang` |
| A2 | Rendered width of कि equals the shaped string's width (no tile seams) |
| A3 | Urdu mode's direction is right to left |
| A4 | Tracing appears only for scripts with stroke data |
| A5 | The family's tongue is preselected, and Hindi is never the default when another tongue is set |

**Review:** the scripts other than Devanagari need a native-reader check of the tile sets and audio before release.

### 5.3 Katha Chain (Story): new, in for Jataka Jump

**The promise:** prove you read the story by putting it back together. The app has **344 stories**:
- 235 🪔 Katha;
- 51 📜 Itihaas;
- 58 🧭 Aaj.

All have morals already tagged in `data-neeti-stories.js`.

**Modes:**

| Level | Mode | What the child does |
|---|---|---|
| 1 | **Chitra Kadi** (Picture chain, pre-readers) | 3 picture panels with audio; put them in order |
| 2 | **Kadi** | 4–5 text-and-picture panels of a short tale (Panchatantra, Jataka, Tenali Raman, Akbar–Birbal, regional folk tales); order them |
| 3 | **Aage kya?** (What next?) | Read up to a turning point; pick what happens next from three *plausible* options, two taken from other tales' real events |
| 4 | **Kisne kaha?** (Who said it?) | Match lines to characters |
| 5 | **Seekh** (The lesson) | Pick the moral from three **true morals**, the other two drawn from *other* tales. This fixes Jataka Jump's absurd distractors, so only reading tells them apart |

**Content rules:**
- **Only 🪔 Katha stories are scrambled.** Itihaas stories are history and are never shuffled into fiction; Aaj stories
  are not used.
- The badge shows on every round.
- **Sacred narratives are not chopped into puzzle panels.** Tales whose central figures are deities, and the epics'
  devotional episodes, stay in the reader and the epic serial. Katha Chain uses folk, animal and wit tales. A
  per-story `katha_chain: true` flag in the data marks which ones; it is reviewed and never inferred.
- **Panel art credits** its folk tradition and region (Madhubani, Bihar · Pattachitra, Odisha · Kalamkari, Andhra
  Pradesh · Gond, Madhya Pradesh), or a named artist where commissioned.

**Mechanics:**
- Drag to order or tap-to-swap, and arrows plus Space to pick up and move.
- A miss holds and shows the right order with the one line that gives it away ("*Then* the crocodile…": a time word,
  as in Inkwell's sequence skill).

**Pay:** `answer` 1 per first-try right. **Acceptance:**

| # | Check |
|---|---|
| C1 | A random orderer scores under 15% at L2 (5 panels give 120 orders) |
| C2 | No Itihaas story appears |
| C3 | Every story used has `katha_chain: true` |
| C4 | Every moral distractor is another tale's real moral |

---

## 6. Pay table (after)

| Card | Pays | Never pays for |
|---|---|---|
| Sabhyata | `answer` per first-try riddle; mastery on a later day | turns, time, the win alone |
| Gattu aur Vismriti | `stop` 5 per chapter restored, plus the inner game's `answer` | scenes, kauris (removed) |
| Gyanpati | `answer` per first-try right (≤10), `contest` 10 once a day for rung 10+ without lifelines | finishing |
| Shabd (with Parivaar) | `answer` per first-try right; a term pays once a day | replays |
| Naksha · Panchang · Kaal Nadi · Akshar · Katha Chain | `answer` per first-try right (≤10 a round) | retries, Panchang's "Mera saal" mode |
| Rangoli Rush | `answer` per level cleared first try | points, twists |
| Ludo (+ Saap-Sidi) · Carrom · Pallanguzhi | **nothing**, labelled on the card | — |

The 100-a-day family cap applies to all of it.

---

## 7. Content, accessibility and calm

- **Every game:** keyboard **and** touch (the family rule), ≥ 44 px targets, focus rings, text equivalents for colour,
  and reduced motion respected.
- **Calm mode:** music and effects off, and no countdowns. Sprint is hidden in Calm.
- **Read-aloud** on every prompt at L1–2, and for the 5–7 band everywhere.
- **Content that needs the named reviewer before release** (tester mode until signed):

  | Content | What needs review |
  |---|---|
  | Saga Acts 2–5 | the whole act |
  | Kaal Nadi | the card set |
  | Panchang | the year's dates and the "Kyon?" lines |
  | Akshar | the non-Devanagari scripts |
  | Katha Chain | the `katha_chain` flags |

- **Folk-art credits** on Rangoli twists and Katha Chain panels.
- **Never leak the answer** in on-screen text:
  - Naksha's Rajdhani mode hides the capital's dot until after the tap;
  - Akshar never shows the target syllable while it is being built;
  - Katha Chain never numbers the panels.

---

## 8. Test suite (added to `npm test` / the trust checks)

| # | Test |
|---|---|
| T1 | **Random bot earns 0** in every TEACHES game over 20 rounds |
| T2 | **The counter is honest:** the host's "right" count equals the engine's `firstTryRight` in every game; a game with no answers shows no counter |
| T3 | **One sound per answer** |
| T4 | **No finishing pay:** a 0/10 round earns 0 |
| T5 | **No streak copy:** a grep for "in a row", "streak" or "×" multipliers in `games-*.js` finds nothing |
| T6 | **The miss holds:** after a wrong answer, no new question renders until Aage |
| T7 | **The level rule:** a scripted round at 40% drops the level by one; at 60% it keeps it |
| T8 | **Clock:** hiding the tab for 30 s changes no game state, in every timed game |
| T9 | **Mute and Calm:** zero audio nodes start in any game while muted |
| T10 | **The map is never gamified:** boundary paths are byte-identical before and after every Naksha round; J&K is whole |
| T11 | **Script shaping:** Akshar's displayed syllables are single text nodes with `lang`; no `letter-spacing` on Indic text |
| T12 | **Panchang dates are sourced** and Eid drifts |
| T13 | **Kaal Nadi:** contested cards are unscored and sensitive tags are absent |
| T14 / T15 | **Stage:** symmetric and full-bleed at both sizes, light and night |
| T16 | **Card count ≤ 13** |
| T17 | **Saga:** `opts` honoured by every engine; no `kauris` field |
| T18 | **Phone fold:** every required action is within the viewport above the tab bar on 390 × 844 |

**Prove every new check by breaking it once**, as the family does.

---

## 9. Timeline and owners

| Weeks | Work | Owner | Done when |
|---|---|---|---|
| 0 | Owner confirms the ledger (§3.1) and the names (§3.3), and names the reviewer | **Owner** | signed |
| 1–2 | Shared foundations §1: result contract, pay path, level chip, miss card, clock and sound, stage, small fixes | India chat | T1–T9, T14–T15, T18 |
| 2 | Gyanpati absorbs Trivia; Shabd gets the Bhasha link and the Parivaar pack; Trivia and Rishtey cards retired | India chat | Q1–Q3, W1–W3 |
| **1** | **Sabhyata soft-lock fix (B1), riddle question shown (B2), the `warm` sound fix (B4)** | India chat | S1, S3, S4 |
| 3–4 | Sabhyata: Mithu leads, riddles teach, goal strip, sound and clock, touch pass; the saga loads with Act 1 and the saga map | India chat | S2, S5–S6, G1–G4 |
| 5–9 | **Sabhyata campaign "Mithu's Lamps":** chapters 1–4, then the rest at two a fortnight, each reviewed | content + India chat + reviewer | S7 |
| 3–5 | **Naksha** | India chat | N1–N5, T10 |
| 4–6 | **Panchang** (dates data per year, sourced) | India chat + content | P1–P4, T12 |
| 5–7 | **Akshar** (Devanagari first; then the other scripts, each with a native-reader check) | India chat + reviewers | A1–A5, T11 |
| 6–8 | **Katha Chain** (flag the stories, credit the art) | India chat + content | C1–C4 |
| 7–9 | **Kaal Nadi** (card set with sources; reviewer sign-off) | content + India chat | K1–K5, T13 |
| 8–10 | Ludo upgrade (lengths, choice previews, four-player, Gattu tiers, Saap-Sidi mode); Carrom handling rebuild (full-screen stage, place/aim/shoot gestures with a power pad and cancel, mouse aim, smoothness, coach, sounds); Pallanguzhi redesign (vertical phone board, shells that show the count, visible sowing, preview trail, coach); Rangoli fixes and traditions | India chat | L1–L5, CR1–CR5, R1–R2, T16 |
| 9–11 | Saga Acts 2–3 (Acts 4–5 follow at one a fortnight, each reviewed) | content + reviewer | G5 per act |

---

## 10. How we'll know it worked

- **Honesty:** random play earns 0 coins in every teaching game (it was 10 a round). The finish counters match reality.
- **Learning:** the share of first-try rights that are re-checked on a later day and pass (the mastery ledger) rises
  for map, calendar, time and script objectives. Those four have no reliable measure today.
- **Return without streaks:** saga chapters restored per child per week. Shared maps are a better signal than minutes.
- **Family reach:** the Parivaar finish ("use this word on your next family call") and Panchang's "Mera saal" are the
  two places the app hands a child back to their family. Count how often they are opened, never who the family is.

---

*End of spec. Companion documents: `india-fix-brief-v4.md` (non-game fixes), the Bee and English game specs (the shared
stage and level rules), and FAMILY-STANDARD.md (coins, avatars, shell).*
