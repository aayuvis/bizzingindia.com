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

## 5. Phase 2 and beyond (not in this build)

Narrated site cards in the app's own voice; more eras (Vijayanagara, the takeoff era
bridging to Itihaas); a "visit the story" link from a woken site into the story library;
cooperative two-player on one screen (one grows, one connects).
