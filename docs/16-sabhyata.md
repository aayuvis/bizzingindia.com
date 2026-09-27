# 16 — Sabhyata: the civilization game

*A strategy game about growing a civilization across India — where you win by connecting,
not conquering, and the enemy is the Forgetting itself.*

Playable in the Mela as **Sabhyata** (सभ्यता — civilization). This document is the design
contract; `app/data-sabhyata.js` carries the content and its sources, `app/sabhyata.js`
carries the engine.

---

## 1. Why this game is shaped the way it is

The obvious version of this game — start ancient, paint the map your colour, defeat the
invader — is unbuildable here, for reasons this project has already committed to in
CLAUDE.md and docs/05:

1. **Never animate or gamify a boundary.** No border draws itself, pulses, gets conquered
   or moves as a reward. An empire-painting map is exactly that, so *territory is not the
   win condition and is never marked*. The map under the game is terrain, one neutral
   wash; no state is ever coloured by "ownership."
2. **"The external enemy" is the most dangerous phrase in Indian history-telling.** Every
   candidate for "the outsider who attacks India" is somebody's ancestor and somebody's
   co-religionist. Rulers are people, not teams (docs/05); nothing sacred to anyone is
   ever the antagonist. So the adversary is **Vismriti, the Forgetting** — the app's own
   impersonal grey mist. No people, no army, no faces. Places are never destroyed; they
   *fall asleep*, and are woken by being reconnected and re-told.
3. **Collaboration is the core verb, literally.** You expand by *linking* real places —
   trade routes, pilgrim roads, story roads. Growth is lines and lights. Events ask you to
   send grain to a neighbour in famine; helping is the profitable move, always.

## 2. The loop

Real places appear era by era, asleep under the mist. You:

- Every awake city **feeds itself** — a flat +1 🌾 before its speciality — so grain can
  always be earned back. (The opening could deadlock without this: the first city is a
  craft town, and utsav — the only early katha — costs grain.)
- **Grow** a settlement (🌾 anna — grain)
- **Connect** two places with a route (🛠️ kala — craft). Connected places thrive:
  double yield, and the mist cannot take them.
- **Wake** a sleeping place by reaching it with a route and telling its story
  (📜 katha — story). Waking a place shows its real one-line fact.
- **Utsav** — hold a festival for a burst of everything, on a cooldown.

Left unconnected, an awake place fades and eventually sleeps again — reversibly, and
gently ("the mist is drifting over Lothal…"). Every ~40s an event asks for help — a lean
season at a neighbour — answered by spending grain *if a route reaches them*; answering
builds katha faster than anything else.

**Era advance** needs every current site awake + a katha bank. Each advance plays one
real "aha" card (iron; script and edicts; zero; ships and temples) and brings the next
era's places in under the mist. Five eras, Harappan to the temple-and-sea-trade south.
Ending: every lamp lit, the mist off the land — *India remembers*.

## 3. Editorial rules as applied here

- The game is **📜 Itihaas-flavoured**: every site fact in `data-sabhyata.js` is broadly
  attested and carries `sources[]` (NCERT Our Pasts / ASI site literature). Where the
  reading is debated the card says so at a child's level ("many archaeologists read this
  basin as a dockyard"). Where a site's fame is story rather than evidence (Hastinapura,
  Mathura), the card says "the story goes…" — 🪔 Katha framing inline.
- Dates are **ranges**, era names are the curriculum's (docs/02).
- Sites cluster in some states and not others because archaeology does; no state is
  favoured by design, and the roster note in the data file says so.
- No combat, no lives, no shaming; a fading site is sad, not scary, and always
  recoverable. Vismriti follows docs/04: soft-edged, slow, never a face.
- `needs_review: true` stands on the data file until a human reviews the site facts;
  contested chronology (notably anything Sarasvati-adjacent) is simply not in the game.

## 4. Product rules as applied here

- **Keyboard AND touch, fully** (house rule): tap/click a site or Tab/arrow between
  them; Enter opens actions, 1–4 fire them, Esc cancels targeting, P pauses.
- `prefers-reduced-motion`: mist and lanterns render static.
- Saves through the **Store seam** (device-level snapshot, no child data).
- Registered in `window.IND_GAMES` like every Mela engine — host, done, teardown.

## 5. The city, from inside (v3)

The first build's cities were spectators; the note back was exact: *"when I enter the
city nothing much happens… I'm not building anything… not making strategic decisions."*
The city is now the strategy layer, and everything in it obeys the same editorial frame:

- **Buildings** (granary, workshop, gurukul, bazaar, stepwell) — one shared coin pool
  with roads, growth and peace, so every purchase is a real trade-off.
- **The monument** is the city's own `works[2]` — the thing that actually stands there,
  buildable at level 3, expensive, and once raised the town is exempt from mist and
  dust: *a monument is a memory made of stone.*
- **Techs** (the Vidya panel): two real doors per era — plough/brick, iron/panchayat,
  script/roads, zero/temple, monsoon — and the coins rarely stretch to both, so the
  order chosen is the strategy.
- **The capital**: one city carries the realm (+1 of everything, never dusty, never
  quarrels). Moving it echoes Rajagriha → Pataliputra.
- **Neglect**: an untouched city turns *dusty* and earns half — roads keep the mist
  out, but only attention keeps a town proud. The stepwell stretches patience.
- **Quarrels, not wars**: two routed towns fall out over water, tolls, stall-space or
  an old promise. No armies, no winners, nothing burns — the road just carries nothing
  until the player sits the panchayat and picks one of two priced settlements (or the
  Panchayat tech makes it free). Unresolved quarrels invite the mist. This is the
  game's whole answer to "cities fight": they *quarrel*, and the player's role is the
  peace.
- **Trivia as income**: a gurukul takes questions (+katha, cooldown); with Brahmi
  Script the teacher asks about *any* woken city — recall across the whole map.

## 6. The people, the wilds and the great ones (v4)

The founder's second round of notes asked for citizens, upkeep, defence, attacks,
heroes and kingdoms. All in, and each passed through the same editorial gate:

- **Praja**: every city has 2 + 2·level citizens, each with a job the player
  allocates — kisan, karigar, kathakar, **rakshak**. The city's own trade counts
  double. Everyone eats (0.25 anna/turn): production minus appetite is the balance,
  and the HUD shows the net per turn. An empty granary makes every town dusty at
  once — the granaries come first.
- **The rakshaks are a watch, not an army.** Raids come from the wilds and the mist,
  never from people — every human raider is somebody's ancestor. Wild boar in the
  wheat, an elephant herd at the stores, locusts, sea-storms, a push of Vismriti
  itself; two rakshaks fend a raid off entirely, and the fending is always gentle:
  drums, torches, lanterns, mended fences. A fended raid *earns* katha — the story
  of the night the boar came is worth telling.
- **Heroes are roles, never named rulers** (docs/05): the Annadata, the Sthapati,
  the Acharya may rise in a level-3 town — one great deed each (a golden harvest; a
  monument in a single season; a free learning for everyone) and a quiet gift while
  they stay.
- **Kingdoms**: from the janapada era, a hero can be asked to **crown** their city
  instead of the deed. Every town its roads reach shares the kingdom's strength —
  the kingdom IS the road network, so the boundary rules never come into play: a
  realm here is a set of connections, not a coloured area.
- **Art is reused before it is generated**: Mithu opens the game and takes the bow,
  Vismriti itself appears when a town sleeps, the motif set dresses hero and
  kingdom cards, and the Mela cover is the game's own Kashi painting.

## 7. The fog, the explorers, and the pace (v5)

- **A turn is three seconds.** At one second the coins moved faster than a child could
  decide what they meant. Every constant reads in turns, so the whole world slowed by
  the same breath.
- **The fog is Vismriti's own.** Undiscovered places are not shown at all; the land
  sits under a grey veil with clear light around every found place and every walking
  explorer. You begin with one city — Dholavira — and all of India unseen.
- **Explorers** are the discovering verb: provisioned with anna, one walks from a
  chosen city toward the nearest unfound place, the fog opening along the lamp as
  they go, a few turns of real anticipation. Arrival FINDS the place (asleep, ready
  for a road) and pays katha — discovery is itself a story. Then roads, then waking:
  explore → connect → wake is now the game's full sentence.
- **The map is a place you lean into**: wheel or pinch to zoom anchored under the
  pointer, drag to pan, corner buttons and + − 0 for keyboards. A drag never selects
  the lamp it ends on.

## 8. The fifty (v6) — what a strategy game actually asks of a player

The note back was *"the gameplay is still very poor, benchmark Civ 6."* Fifty changes
answered it. The diagnosis was three things, and everything else followed:

1. **The clock ran whether or not anybody had decided anything.** `TICK_MS = 3000`, every
   constant in seconds. A world that moves on its own can only be *reacted* to, so every
   quarrel, raid and lean season arrived as an interruption nobody chose and the game
   became firefighting. **Sochna** — thinking — is now the default: nothing happens until
   *Agla Saal* is pressed. The live speeds remain, and on those a timed decision stops the
   clock itself rather than letting it answer on the player's behalf.
2. **Placement was legality, not strategy.** `kitYield()` summed every piece's `give` and
   never read its coordinates; `canPlace()` only asked whether a thing *fit*. Ten adjacency
   rules now live in `data-kit-build.js` — water reaches the fields beside it, a workshop on
   the street gets its goods out, wall joined to wall is a rampart — and the plot preview is
   computed by the *same* function that pays out, so it can never promise what the city
   won't deliver. The rivers, drawn from real courses and explicitly inert, now feed the
   towns beside them: the boundary rule forbids a *border*, not terrain.
3. **There was no choice architecture and no other agent.** 17 techs with no prerequisites,
   nine of thirteen ages offering exactly one door, one victory, and nothing in the world
   with intent except the mist. Now: a tech **tree** with real prereqs, a parallel **Riti**
   civics tree with swappable policy cards, **eurekas** (three fields and the plough half
   teaches itself), **four roads to an ending**, **era score** with golden and quiet ages —
   and six **overseas partners** who ask, pay and remember.

### The lines that had to hold

- **No boundary, ever.** Growth gained a *direction*, migration gained *pressure*, kingdoms
  stayed a set of connections. Nothing is drawn, coloured, claimed or moved. The genre's
  loyalty mechanic flips cities between empires on a map; only its pressure was portable,
  so a neglected town loses a family down a road that already exists.
- **No external enemy.** Partners are overseas and can never be hostile; a check fails the
  build if any partner's text reads as an adversary. The sister realms' meter only ever goes
  up — competition with the sign flipped.
- **No faith as a score.** The genre's civics tree ends in religions converting each other.
  Riti is entirely secular custom (docs/05 §4); the pilgrim road carries people and stories
  and is never a score.
- **Nothing written from memory.** Every added tech is named for something this repo already
  carries with its own `sources[]` — Lothal's doubling cube weights, Dholavira's stepped
  reservoirs, the basin read as a dockyard, the edicts, the stupas, Vaishali's assembly.
  Every partner's link to India is cited to the file that sources it. Goods are *categories*
  (`fields of the west`), never commodities, because naming what each real place traded
  would be an assertion this file cannot make.
- **Nothing unrecoverable.** Favour never drops below zero. A quiet age *lowers* the next
  age's bar, so a bad stretch is where a good one starts. Deep sleep costs more to wake and
  the check holds that price inside reach, because beyond reach is beyond recovery. And a
  building can be lifted for a third of its price — a divergence the adjacency rules force,
  since a child meets a placement rule for the first time by getting it wrong.
- **Undo, which the genre does not have.** An adult who misclicks has chosen badly and that
  is the game; a nine-year-old has been robbed of sixty anna by a finger. It covers exactly
  the spend not yet lived with, and never the world: a snapshot is only taken outside a
  turn and dies when one passes.

### What holds it

`tools/check-sabhyata.js` — checks that drive the real engine and read the real state, so
none can pass by agreeing with a render that is itself wrong. It has already caught, in the
work it was written for: three policy cards whose effects nothing read; `pay()` not being the
only door money left by (six spends reached into `G.res` directly); an undo that could rewind
a raid; and the phone regression where the globals row cannot wrap inside a bar that can.
Twice the failing thing was the *check* and not the engine, which is written into the commits
because both nearly sent good code to the bin.

## 9. The look (v7) — the same game, legible

The note back was *"the UI/UX is a 3 on 10, benchmark Civ 6, take it to 10/10."* Civ 6's
screen is not prettier than ours was; it is **ordered**. Its information has a hierarchy a
newcomer reads without being taught: one place for what you own, one for what is happening,
one for what you are asked to decide, and a single unmistakable button for *I am done*.
Ours had all the same information and no ranking of it — every panel the same weight, every
number the same size, the verb that advances the game no louder than the verb that opens a
menu. That is what a 3 out of 10 feels like from the inside.

Five passes, each with a check that fails before it passes.

- **A — the frame.** One bar that owns what the realm has, one rail for what is live, one
  button that ends the year, and nothing else competing at that size. The turn button and
  the turn counter are asserted to agree, because a screen that disagrees with itself is
  worse than one that says nothing.
- **B — the map.** City names are measured, not guessed: `labScale()` reads the bound axis
  off the live viewBox and scales the type by its inverse, so a name is the same size
  however far in you lean. Two names that would sit on top of each other are moved apart by
  *measured rectangle collision*, not by a proxy — the first version separated them by
  which city was awake, and Kashi and Pataliputra are both awake, so it did nothing at all.
- **C — colour and role.** The colour that means *press this* is not the colour that means
  *worry*. Held by a check, because it is the kind of rule that decays one convenient
  exception at a time.
- **D — the panels.** A long panel keeps its name and its way out at the top of a bounded
  scroller. `position: sticky` pins to the nearest *scrolling* ancestor, and the first
  version of this pinned to the document and therefore to nothing; the check now measures
  the header's position after a scroll rather than asserting the rule exists. The city got
  its own *Agla Saal*, so a year can be spent without leaving the city you are spending it
  on.
- **E — feedback.** Anna, kala and katha announce what moved. The delta belongs to the
  **turn**, not to the painter: `paintHud` runs twice per turn and the second run wiped the
  first version of it, so `G.delta` carries the turn it describes and is only rendered on a
  match. All of the motion sits inside `prefers-reduced-motion: reduce`, which drops the
  travel and keeps the fact.

- **F — the board's own shape.** Found by looking at a screenshot after the other five
  were green, which is the only thing that found it. The stage was whatever height the
  flex column had spare and whatever width the page was, and the SVG's default
  `preserveAspectRatio` then letterboxed a 1000×1100 portrait map inside it: on a 1440
  desktop India drew at **39% of the board's width** with 416px of dead ground either
  side, and a phone wasted **a quarter of the board's height**. The stage now takes the
  viewBox's own ratio, and **width is the only dial** — `min(100%, 72vh × 10/11)` — because
  `aspect-ratio` is ignored outright when both axes are definite, which quietly reinstates
  the letterbox on whichever orientation it does not suit. That cost two rounds: one
  wasting a phone's height, one a tablet's. All three sizes now fill 92.8% of the board's
  width and 97.3% of its height, the remainder being the artwork's own margin, and the
  desktop map is **23% larger in area**. On a wide screen the stage also reserves a strip
  for the rail, so the rail stops being an overlay: while the board was letterboxed the
  rail landed in the dead ground and cleared the land *by accident*, and removing the
  letterbox put it over the northeast.

- **G — what the other screenshots showed.** Having found F by looking, I looked at the
  rest, and the phone and the city each gave up a fault fifty-three checks had not.
  The phone was printing `\u25b8` and `\u2263` as *text*: five sequences across two files
  had been written with a doubled backslash inside a single-quoted string, so JS never
  decoded them and the app showed the escape. Nothing caught it because every check asks
  the engine what it thinks, and the engine was right — the advisor really did want that
  row. Only the rendered words were nonsense, and no test read them. `no-raw-escapes`
  reads the source rather than the DOM, because a rendered scan covers only the states a
  test happens to open and one of these lived behind a single island in the geography
  data. The city, meanwhile, still had an **alarm-red gate banner and a pulsing red
  chip** — the exact fault pass C existed to remove, on a surface pass C's check did not
  name. Both are the mist's grey with weight now, and the pulse is gone: docs/16 §3 says
  a fading site is sad, not scary, and a throbbing red chip is an alarm in costume.

- **H — the map against the page, not against its own box.** Reported from a real
  screen, not found here: *"the map occupies only a quarter of the page."* It did.
  `board-fills` was green throughout, because it asks whether the map fills the **board**
  and the board itself was small. Three causes, all horizontal room being spent on
  nothing: the 280px rail strip from pass F was reserved **whether or not the rail had
  anything in it**, which is most of the time; the HUD was stacked *above* the board,
  spending the one axis a portrait map is actually short of; and the board's height cap
  left room in the column unused. India is taller than it is wide, so on a landscape
  screen the board can never fill the width without being cropped — the width is
  therefore for the HUD, and above 1100px the bar now sits **beside** the map instead of
  on top of it. The strip appears only when the rail has rows. Measured: the map went
  from **34% of a 1440×900 screen to 44%**, and from 31% to 39% at 1920×1080; the drawn
  map is 35% wider and 83% larger in area than before pass F.

### What this pass taught, twice

**A write-up can run ahead of the code.** It happened on the tech tree in v6 and again on
the sticky header here: the prose was true of the intention and false of the file. Nothing in
the test suite caught either, because both checks asserted the *mechanism* I had written
rather than the *outcome* a player would see. The two things that do catch it are a check
phrased as the visible promise — "the header is still on screen after scrolling", not "the
rule is present" — and looking at a screenshot. `tools/shoot-sabhyata.js` takes 24 of them
across phone, tablet and desktop for exactly that, and it earns its place every pass:
`audit-city-ui.js` can prove nothing overflows and cannot tell you a child would not know
where to look first.

Pass F is the strongest case for the screenshot. Fifty-two checks were green and the board
was drawing India at 39% of its width, because **a letterbox is not a rule that is wrong —
it is what happens when no rule decides**, and no test written against a mechanism can see
an absence. `board-fills` measures the painted land against the box the map was given, at
three real widths, and it was watched to fail on the old CSS first: it reported exactly the
39% and the 75% that the screenshot had shown.

And the colour check taught the sharper version of the same lesson twice over. Widened to
name the city's surfaces, it went green **with the red still in place** — it was running on
the map, where `.sab-alarm` does not exist, so `querySelectorAll` found nothing and it
passed by not looking. *Green for the wrong reason is worse than red*, because red gets
investigated. It now opens the city, and it **fails if a surface it names is not on
screen**: a check that silently skips what it cannot find is not a check. Getting there
also turned up why it could not open one — `G.ev` puts a second thing over the map that
swallows the pair of taps a city needs — which is the sort of fact only an attempt
surfaces.

`board-share` is the check that should have existed before any of this: it measures the
map against the **screen** at two desktop sizes, because every version of this fault has
looked the same — a map at about a third of the page — and no check that measures a thing
against its own container can see it. It was watched to fail on the reported layout and
named it exactly: 31% at 1440×900, 28% at 1920×1080.

**55 checks, 0 failed.** F, G and H added three — `board-fills` and `no-raw-escapes` — and
widened a third; each was watched to fail first, and `colour-roles` failed for the wrong
reason before it failed for the right one.

(This paragraph said 55 until the suite was actually run. The count was the number I
expected, not the number the tool printed, which is the same failure the section above is
about and the reason it is written down: **do not report a number you have not read.**)

**An assertion that fires on correct work is a bug in the assertion, and fixing it is not
loosening it.** Three did here — the rail check, the city-turn overlap check and the size
ladder — and each was rewritten to check the real promise instead of a proxy for it. That is
the same rule as Bizzing-Videos' `rig.ladderSpan`, arrived at independently.

55 checks, 0 failed, layout audit green.

## 10. Phase 2 and beyond (not in this build)

Narrated site cards in the app's own voice; more eras (Vijayanagara, the takeoff era
bridging to Itihaas); a "visit the story" link from a woken site into the story library;
cooperative two-player on one screen (one grows, one connects).
