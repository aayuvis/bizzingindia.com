/* THE BUILD CATALOGUE — what a child may buy, where, and what it gives back.
 *
 * The land is free: its ground, its water, its streets, the trees already on
 * it. Everything else is bought and placed, and everything bought does
 * something — a wheat field brings in anna every turn, a workshop kala, a
 * gurukul katha. Nothing here is decoration you pay for.
 *
 * Three gates decide whether an item is even offered, so a city's menu is its
 * own and grows as the city does:
 *   era  [from, to]  the age it belongs to
 *   lv   1 | 2 | 3   the city must have grown this far
 *   kind kheti | shilpa | vidya | '*'   what this city is FOR
 *   only [cityIds]   some things belong to one city and nowhere else
 *
 *   tech 'plough'   the research that has to be finished first
 *
 * A tech-locked thing is SHOWN, greyed, reading what would unlock it. Hiding
 * it would make research a thing a child does for no visible reason; showing
 * it makes the shop the place they find out why the plough matters.
 *
 * `on` says what it may stand on: 'land' (dry, unbuilt), 'green' (a field
 * tile), 'shore' (a cell touching water), 'road' (on the street itself).
 * `give` is per turn, forever. `once` is a one-off effect the engine reads.
 * `pop` is homes: every one is another pair of hands the city may put to work.
 * `bld` grants a legacy building power, so a bead workshop IS a workshop.
 *
 * `jobs` at the foot of this file is the other half: a building is only worth
 * something because somebody works in it, and who a city may put to work
 * depends on what it has built.
 */
window.IND_KIT_BUILD = {

  /* what the land hands you for nothing — never in the shop */
  free: ['gnd-', 'cr-', 'wa-', 'rd-', 'tr-'],

  /* how far from the centre a city may build, by level. A city grows OUT. */
  reach: { 1: 7, 2: 10, 3: 14 },

  groups: [
    ['field',  'Fields',      'Ground that feeds the city.'],
    ['work',   'Workshops',   'Hands making things.'],
    ['learn',  'Learning',    'Where the city keeps what it knows.'],
    ['home',   'Homes',       'Every home holds one more praja.'],
    ['water',  'Water',       'A dry land is a short story.'],
    ['guard',  'Defence',     'What stands between the city and the dust.'],
    ['people', 'People',      'Who lives here, and what they spend the day doing.'],
    ['great',  'Great works', 'One to a city, and only where it belongs.']
  ],

  items: [
    /* ---- FIELDS ---------------------------------------------------------
       EVERY CITY GROWS ITS OWN. The Rann will not carry wheat and the Ganga
       plain will not thank you for millet, so each city's Fields tab offers
       the crop that land actually grows — and that crop is the only one it
       will ever be offered. What the harvest is called is anna either way:
       the currency is the crop, not the wheat. */
    { p: 'cr-millet', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: '*',
      only: ['dholavira'], cost: { anna: 6 }, give: { anna: 1 }, many: true,
      what: 'Bajra — it grows where wheat will not, which is the whole reason there is a city here.' },
    { p: 'cr-cotton', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: '*',
      only: ['lothal'], cost: { anna: 7 }, give: { anna: 1, kala: 1 }, many: true,
      what: 'Cotton. Food it is not, but the bolls become thread, and thread becomes trade.' },
    { p: 'cr-wheat', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: '*',
      only: ['rakhigarhi'], cost: { anna: 6 }, give: { anna: 1 }, many: true,
      what: 'Wheat, sown in rows across the mound country.' },
    { p: 'cr-barley', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: '*',
      only: ['kalibangan'], cost: { anna: 5 }, give: { anna: 1 }, many: true,
      what: 'Barley — hardier than wheat, and it asks less of a dry soil.' },
    { p: 'cr-sugarcane', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: '*',
      only: ['hastinapura'], cost: { anna: 8 }, give: { anna: 2 }, many: true,
      what: 'Cane, tall enough to hide a cart. Two anna a turn, and it drinks.' },
    { p: 'cr-sesame', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: '*',
      only: ['kashi'], cost: { anna: 6 }, give: { anna: 1, kala: 1 }, many: true,
      what: 'Til. Seed for the kitchen and oil for the lamps on the ghats.' },
    { p: 'cr-gram', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: '*',
      only: ['ujjain'], cost: { anna: 6 }, give: { anna: 1 }, many: true,
      what: 'Chana on the black soil of Malwa, low and close-sown.' },
    { p: 'cr-paddy-green', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: '*',
      only: ['vaishali'], cost: { anna: 7 }, give: { anna: 2 }, many: true,
      what: 'Rice in flooded bunds — the crop that made the eastern plain worth arguing over.' },

    /* what any city may add to its own crop */
    { p: 'cr-mustard', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 2, kind: '*',
      cost: { anna: 9 }, give: { anna: 1, kala: 1 },
      what: 'A stripe of mustard between the rows. Food and oil both.' },
    { p: 'cr-furrow', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: 'kheti',
      cost: { anna: 8 }, give: { anna: 2 },
      what: 'Ploughed and cross-ploughed, the way Kalibangan\u2019s field was: 2 anna.' },
    { p: 'cr-paddy-green', g: 'field', on: 'shore', tile: true, era: [0, 12], lv: 2, kind: '*',
      cost: { anna: 12 }, give: { anna: 3 },
      what: 'Paddy on the water\u2019s edge. It must touch water, and it feeds three.' },

    /* ---- THE INDUS SET, era 0 only ---------------------------------------
       The first pass gave the Harappan cities conical thatch, curved tile
       roofs and painted bands with peacocks on them — a building idiom a
       thousand years and a thousand miles from the Indus. These are drawn
       from what excavation shows instead: brick in standardised courses,
       FLAT roofs of beam and reed and packed mud, doors on the side lane,
       a stair to the roof, and no column, arch, dome or ornament anywhere.
       Sources in docs/19-harappan-architecture.md. */
    { p: 'hs-har-room', g: 'home', on: 'land', era: [0, 1], lv: 1, kind: '*',
      cost: { anna: 8 }, give: {}, pop: 1,
      what: 'One room of plastered brick under a flat roof of beam, reed and packed mud.' },
    { p: 'hs-har-mud', g: 'home', on: 'land', era: [0, 1], lv: 1, kind: '*',
      cost: { anna: 6 }, give: {}, pop: 1,
      what: 'Unbaked mud brick under mud plaster \u2014 what most of a Harappan town was actually built of.' },
    { p: 'hs-har-court', g: 'home', on: 'land', era: [0, 1], lv: 2, kind: '*',
      cost: { anna: 18, kala: 10 }, give: { kala: 1 }, pop: 3,
      what: 'Rooms round an open court, the door on the side lane, a stair to the roof, a bathing floor draining under the wall.' },
    { p: 'hs-har-two', g: 'home', on: 'land', era: [0, 1], lv: 2, kind: '*',
      cost: { anna: 16, kala: 8 }, give: {}, pop: 2,
      what: 'The same house grown upward, the stair climbing outside the wall.' },
    { p: 'hs-har-stone', g: 'home', on: 'land', era: [0, 1], lv: 1, kind: '*',
      only: ['dholavira'], many: true, cost: { kala: 12 }, give: {}, pop: 1,
      what: 'Dressed stone below and mud brick above: the Dholavira way, because Dholavira had stone and no river clay.' },
    { p: 'bd-har-bead', g: 'work', on: 'land', era: [0, 1], lv: 1, kind: '*',
      bld: 'workshop', cost: { anna: 20, kala: 20 }, give: { kala: 1 },
      what: 'A brick working floor with stone drills and a small furnace, carnelian beads drying on cloth.' },
    { p: 'bd-har-store', g: 'work', on: 'land', era: [0, 1], lv: 1, kind: '*',
      bld: 'granary', tech: 'plough', cost: { anna: 30 }, give: { anna: 1 },
      what: 'Mud-brick blocks raised clear of the flood with the goods stacked over them.' },
    { p: 'bd-har-hall', g: 'great', on: 'land', era: [0, 1], lv: 2, kind: '*',
      tech: 'brick', cost: { kala: 40, anna: 20 }, give: { katha: 2, anna: 1 },
      what: 'A great brick platform of separate blocks with air channels between them. Long called a granary \u2014 but no grain, no jars and no sealings were ever found in one, so what it held is still argued about.' },
    { p: 'wa-har-well', g: 'water', on: 'land', era: [0, 1], lv: 1, kind: '*',
      cost: { kala: 10 }, give: { anna: 1 },
      what: 'A ring of wedge-shaped bricks cut to the curve, its rim worn into grooves by rope.' },
    { p: 'wl-har-wall', g: 'guard', on: 'land', era: [0, 1], lv: 1, kind: '*',
      bld: 'prakara', tech: 'brick', cost: { kala: 40, anna: 20 }, give: {},
      what: 'Mud brick faced with baked brick, battered so it leans back as it rises: worth two more rakshaks.' },

    /* ---- WORK -------------------------------------------------------- */
    { p: 'bd-granary', g: 'work', on: 'land', era: [1, 12], lv: 1, kind: '*', bld: 'granary',
      cost: { anna: 30 }, give: { anna: 1 },
      what: 'A granary: +1 🌾 a turn, and the town forgets hunger slower.' },
    { p: 'bd-workshop', g: 'work', on: 'land', era: [1, 12], lv: 1, kind: '*', bld: 'workshop',
      cost: { anna: 20, kala: 20 }, give: { kala: 1 },
      what: 'A potter at the wheel: +1 🛠️ a turn.' },
    { p: 'bd-kiln', g: 'work', on: 'land', era: [0, 12], lv: 1, kind: 'shilpa',
      cost: { kala: 12 }, give: { kala: 1 },
      what: 'A kiln. Fire turns clay into things that last: +1 🛠️.' },
    { p: 'bd-bazaar', g: 'work', on: 'road', era: [1, 12], lv: 2, kind: '*', bld: 'bazaar',
      tech: 'panchayat', cost: { kala: 35 }, give: {},
      what: 'A bazaar, on the street where it belongs: +1 of everything while the city is on a route.' },
    { p: 'bd-weighing', g: 'work', on: 'land', era: [1, 12], lv: 2, kind: '*',
      tech: 'panchayat', cost: { kala: 18 }, give: { kala: 1, anna: 1 },
      what: 'A weighing yard: honest measure brings trade back. +1 🛠️ +1 🌾.' },
    { p: 'bd-warehouse', g: 'work', on: 'shore', era: [1, 12], lv: 2, kind: '*',
      cost: { kala: 26, anna: 10 }, give: { kala: 2 },
      what: 'A warehouse on the water: +2 🛠️ a turn.' },
    { p: 'bd-stable', g: 'work', on: 'road', era: [1, 12], lv: 2, kind: '*',
      cost: { anna: 16 }, give: { anna: 1 },
      what: 'A byre on the road: oxen, and the carts that follow them.' },
    { p: 'pr-loom', g: 'work', on: 'land', era: [0, 12], lv: 2, kind: 'shilpa',
      cost: { kala: 14 }, give: { kala: 1 },
      what: 'A pit loom. Thread in, cloth out.' },
    { p: 'bd-forge', g: 'work', on: 'land', era: [1, 12], lv: 3, kind: 'shilpa',
      tech: 'iron', cost: { kala: 30 }, give: { kala: 2 },
      what: 'A forge: +2 🛠️, and the rakshaks are better armed for it.' },

    /* ---- LEARNING ------------------------------------------------------ */
    { p: 'bd-gurukul', g: 'learn', on: 'land', era: [1, 12], lv: 1, kind: '*', bld: 'gurukul',
      cost: { anna: 20, katha: 15 }, give: { katha: 1 },
      what: 'A gurukul under a tree: +1 📜, and the teacher will take questions here.' },
    { p: 'bd-shrine-small', g: 'learn', on: 'road', era: [1, 12], lv: 1, kind: '*',
      cost: { katha: 8 }, give: { katha: 1 },
      what: 'A wayside shrine. A city that stops to remember, remembers.' },
    { p: 'fg-teacher', g: 'learn', on: 'land', era: [1, 12], lv: 2, kind: 'vidya',
      cost: { katha: 14 }, give: { katha: 2 },
      what: 'A teacher and four pupils on a mat: +2 📜 a turn.' },
    { p: 'bd-observatory', g: 'learn', on: 'land', era: [1, 12], lv: 3, kind: 'vidya',
      cost: { kala: 30, katha: 20 }, give: { katha: 2, kala: 1 },
      what: 'A roof for counting stars: +2 📜 +1 🛠️.' },

    /* ---- HOMES: each one holds one more praja ------------------------- */
    { p: 'hs-hut-round', g: 'home', on: 'land', era: [1, 12], lv: 1, kind: '*',
      cost: { anna: 8 }, give: {}, pop: 1,
      what: 'A round thatched hut. One more pair of hands in the city.' },
    { p: 'hs-hut-pair', g: 'home', on: 'land', era: [1, 12], lv: 1, kind: '*',
      cost: { anna: 14 }, give: {}, pop: 2,
      what: 'Two huts and a swept yard: two more praja.' },
    { p: 'hs-mud-flat', g: 'home', on: 'land', era: [1, 8], lv: 1, kind: '*',
      cost: { anna: 10, kala: 4 }, give: {}, pop: 1,
      what: 'Mud brick with a flat roof — things dry up there.' },
    { p: 'hs-mud-flat-2', g: 'home', on: 'land', era: [1, 8], lv: 2, kind: '*',
      cost: { anna: 16, kala: 8 }, give: {}, pop: 2,
      what: 'Two storeys and an outside stair.' },
    { p: 'hs-tile-court', g: 'home', on: 'land', era: [1, 12], lv: 2, kind: '*',
      cost: { anna: 22, kala: 12 }, give: {}, pop: 3,
      what: 'Rooms on four sides of an open court: three praja.' },
    { p: 'hs-stone-low', g: 'home', on: 'land', era: [1, 2], lv: 2, kind: '*',
      cost: { kala: 16 }, give: {}, pop: 2,
      what: 'Dry-laid stone. It will still be standing when the mud is gone.' },
    { p: 'hs-timber-hall', g: 'home', on: 'land', era: [1, 2], lv: 3, kind: '*',
      cost: { anna: 26, kala: 20 }, give: { katha: 1 }, pop: 3,
      what: 'A carved timber hall with a banner on the ridge.' },

    /* ---- WATER --------------------------------------------------------- */
    { p: 'wa-well', g: 'water', on: 'land', era: [1, 12], lv: 1, kind: '*',
      cost: { kala: 10 }, give: { anna: 1 },
      what: 'A well. Water near the houses is one more field fed.' },
    { p: 'wa-well-pulley', g: 'water', on: 'land', era: [1, 12], lv: 2, kind: '*',
      cost: { kala: 16 }, give: { anna: 2 },
      what: 'A well with a hoist: two more 🌾 a turn.' },
    { p: 'bd-stepwell', g: 'water', on: 'land', era: [2, 12], lv: 2, kind: '*', bld: 'stepwell',
      cost: { kala: 30, anna: 15 }, give: { anna: 1 },
      what: 'A stepwell. The city weathers neglect three times longer.' },
    { p: 'wa-kund', g: 'water', on: 'shore', era: [0, 12], lv: 2, kind: '*',
      cost: { kala: 22 }, give: { anna: 2, katha: 1 },
      what: 'A stepped kund at the water’s edge.' },
    { p: 'wa-tank', g: 'water', on: 'shore', era: [1, 12], lv: 3, kind: '*',
      cost: { kala: 40, anna: 20 }, give: { anna: 3, katha: 1 },
      what: 'A great temple tank: three more 🌾 and a place the city gathers.' },

    /* ---- DEFENCE ------------------------------------------------------- */
    { p: 'wl-mud', g: 'guard', on: 'land', era: [1, 8], lv: 1, kind: '*', bld: 'prakara',
      cost: { kala: 40, anna: 20 }, give: {},
      what: 'A rammed-earth rampart: worth two more rakshaks when something comes.' },
    { p: 'wl-gate', g: 'guard', on: 'road', era: [0, 12], lv: 2, kind: '*',
      cost: { kala: 20 }, give: {},
      what: 'A gate across the street. A wall without one is a wall around nothing.' },
    { p: 'wl-watchtower', g: 'guard', on: 'land', era: [1, 8], lv: 2, kind: '*', tech: 'iron',
      cost: { kala: 26 }, give: {}, watch: 1,
      what: 'A watchtower: the dust is seen sooner, and the warning comes earlier.' },
    { p: 'wl-keep', g: 'guard', on: 'land', era: [3, 12], lv: 3, kind: '*', bld: 'durg',
      cost: { kala: 60, anna: 30 }, give: {},
      what: 'A fort: worth four more rakshaks, and it shelters a monument being raised.' },

    /* ---- GREAT WORKS: one to a city, and only where it belongs --------- */
    { p: 'wa-reservoir', g: 'great', on: 'land', era: [0, 2], lv: 2, kind: '*',
      only: ['dholavira'], cost: { kala: 45, anna: 20 }, give: { anna: 4, katha: 1 },
      what: 'One of the sixteen rock-cut reservoirs, stepped one into the next. Four 🌾, and rain that lasts the year.' },
    { p: 'wa-basin', g: 'great', on: 'shore', era: [0, 2], lv: 2, kind: '*',
      only: ['lothal'], cost: { kala: 50, anna: 15 }, give: { kala: 4 },
      what: 'The brick dockyard basin, with its inlet and its spillway. Ships come to it.' },
    { p: 'bd-assembly', g: 'great', on: 'land', era: [1, 4], lv: 3, kind: '*',
      only: ['vaishali'], cost: { kala: 40, katha: 30 }, give: { katha: 4 },
      what: 'The great pillared hall where the sabha sits and every voice is counted.' },
    { p: 'bd-crane', g: 'great', on: 'shore', era: [0, 12], lv: 3, kind: '*',
      only: ['lothal', 'sopara'], cost: { kala: 24 }, give: { kala: 2 },
      what: 'A timber hoist at the wharf: +2 🛠️.' },
    { p: 'bd-pavilion-thatch', g: 'great', on: 'shore', era: [0, 8], lv: 2, kind: '*',
      only: ['lothal', 'sopara', 'muziris'], cost: { kala: 20, anna: 10 }, give: { kala: 2, anna: 1 },
      what: 'A trading pavilion under palm thatch, open on every side.' },

    /* ---- what a city keeps for the look of it, cheap and honest -------- */
    { p: 'pr-awning', g: 'work', on: 'road', era: [1, 12], lv: 1, kind: '*',
      cost: { kala: 6 }, give: { kala: 1 },
      what: 'A stall under a striped awning.' },
    { p: 'pr-cloth-line', g: 'work', on: 'land', era: [0, 12], lv: 1, kind: '*',
      cost: { kala: 4 }, give: { kala: 1 },
      what: 'Dyed cloth drying between two posts.' },
    { p: 'cr-threshing', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: 'kheti',
      cost: { anna: 7 }, give: { anna: 1 },
      what: 'A beaten threshing floor with a pole at its centre.' }
  ],

  /* ---- WHO A CITY MAY PUT TO WORK ------------------------------------
     A building was scenery that paid rent. This is the other half of it: a
     workshop is why the city HAS a karigar, and until one stands there is
     nobody to craft. Every entry names the thing that has to be built first.

       need.bld   any one of these legacy powers (a bead workshop IS a
                  workshop, because its item carries bld:'workshop')
       need.part  any one of these pieces standing on the board
       era        [from, to] — the age the role belongs to
       at         which built things this person is drawn standing on

     Kisan have no `need` on purpose. A city that cannot farm cannot begin,
     and every deadlock in this game has come from forgetting that.

     This gate gives NOTHING away that a save already has: it decides what may
     be ADDED, never what is taken. A city that already keeps a kathakar keeps
     her whether or not the hall has been built yet. */
  jobs: [
    { j: 'kisan', era: [0, 12], at: ['cr-', 'gnd-field'],
      what: 'Somebody has to grow the food. They always can — a city that cannot farm cannot start.' },
    { j: 'karigar', era: [0, 12], need: { bld: ['workshop'], part: ['bd-kiln', 'pr-loom'] },
      at: ['bd-har-bead', 'bd-workshop', 'bd-kiln', 'pr-loom', 'bd-forge', 'bd-warehouse'],
      what: 'Hands need somewhere to work. Build a workshop, a kiln or a loom and a karigar has a bench.' },
    { j: 'kathakar', era: [0, 12], need: { bld: ['gurukul'], part: ['bd-har-hall', 'bd-shrine-small', 'fg-teacher', 'bd-assembly'] },
      at: ['bd-har-hall', 'bd-gurukul', 'bd-shrine-small', 'fg-teacher', 'bd-assembly', 'bd-observatory'],
      what: 'A teller needs somewhere the city gathers to listen. A hall, a shrine, a gurukul — any of them will do.' },
    { j: 'rakshak', era: [0, 12], need: { bld: ['prakara', 'durg'], part: ['wl-har-wall', 'wl-mud', 'wl-keep'] },
      at: ['wl-har-wall', 'wl-mud', 'wl-keep'],
      what: 'A watch needs a wall to stand on. Raise one and the city can keep its own gate.' },
    { j: 'dwarpal', era: [0, 12], need: { part: ['wl-gate'] }, at: ['wl-gate'],
      what: 'A gate wants somebody at it. They keep the door, and they hold it when the dust rises.' },
    { j: 'dhanurdhar', era: [1, 12], need: { part: ['wl-watchtower'] }, at: ['wl-watchtower'],
      what: 'From the tower you see further and reach further. Worth two on the wall.' }
  ]
};
