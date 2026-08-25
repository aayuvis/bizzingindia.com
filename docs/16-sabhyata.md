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

## 7. Phase 2 and beyond (not in this build)

Narrated site cards in the app's own voice; more eras (Vijayanagara, the takeoff era
bridging to Itihaas); a "visit the story" link from a woken site into the story library;
cooperative two-player on one screen (one grows, one connects).
