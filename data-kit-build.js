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
 * `on` says what it may stand on: 'land' (dry, unbuilt), 'green' (a field
 * tile), 'shore' (a cell touching water), 'road' (on the street itself).
 * `give` is per turn, forever. `once` is a one-off effect the engine reads.
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
    ['great',  'Great works', 'One to a city, and only where it belongs.']
  ],

  items: [
    /* ---- FIELDS: bought as ground, they replace the cell they stand on --- */
    { p: 'cr-wheat', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: '*',
      cost: { anna: 6 }, give: { anna: 1 },
      what: 'Wheat. One more 🌾 every turn, for as long as it is sown.' },
    { p: 'cr-barley', g: 'field', on: 'land', tile: true, era: [0, 4], lv: 1, kind: '*',
      cost: { anna: 5 }, give: { anna: 1 },
      what: 'Barley — hardier than wheat, and it asks less of the soil.' },
    { p: 'cr-mustard', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 2, kind: '*',
      cost: { anna: 9 }, give: { anna: 1, kala: 1 },
      what: 'Mustard. Food and oil both — 🌾 and 🛠️ each turn.' },
    { p: 'cr-furrow', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: 'kheti',
      cost: { anna: 8 }, give: { anna: 2 },
      what: 'Ploughed and cross-ploughed, the way Kalibangan did it first: 2 🌾.' },
    { p: 'cr-paddy-green', g: 'field', on: 'shore', tile: true, era: [0, 12], lv: 2, kind: '*',
      cost: { anna: 12 }, give: { anna: 3 },
      what: 'Paddy. It must touch water, and it feeds three.' },

    /* ---- WORK -------------------------------------------------------- */
    { p: 'bd-granary', g: 'work', on: 'land', era: [0, 12], lv: 1, kind: '*', bld: 'granary',
      cost: { anna: 30 }, give: { anna: 1 },
      what: 'A granary: +1 🌾 a turn, and the town forgets hunger slower.' },
    { p: 'bd-workshop', g: 'work', on: 'land', era: [0, 12], lv: 1, kind: '*', bld: 'workshop',
      cost: { anna: 20, kala: 20 }, give: { kala: 1 },
      what: 'A potter at the wheel: +1 🛠️ a turn.' },
    { p: 'bd-kiln', g: 'work', on: 'land', era: [0, 12], lv: 1, kind: 'shilpa',
      cost: { kala: 12 }, give: { kala: 1 },
      what: 'A kiln. Fire turns clay into things that last: +1 🛠️.' },
    { p: 'bd-bazaar', g: 'work', on: 'road', era: [1, 12], lv: 2, kind: '*', bld: 'bazaar',
      cost: { kala: 35 }, give: {},
      what: 'A bazaar, on the street where it belongs: +1 of everything while the city is on a route.' },
    { p: 'bd-weighing', g: 'work', on: 'land', era: [0, 12], lv: 2, kind: '*',
      cost: { kala: 18 }, give: { kala: 1, anna: 1 },
      what: 'A weighing yard: honest measure brings trade back. +1 🛠️ +1 🌾.' },
    { p: 'bd-warehouse', g: 'work', on: 'shore', era: [0, 12], lv: 2, kind: '*',
      cost: { kala: 26, anna: 10 }, give: { kala: 2 },
      what: 'A warehouse on the water: +2 🛠️ a turn.' },
    { p: 'bd-stable', g: 'work', on: 'road', era: [1, 12], lv: 2, kind: '*',
      cost: { anna: 16 }, give: { anna: 1 },
      what: 'A byre on the road: oxen, and the carts that follow them.' },
    { p: 'pr-loom', g: 'work', on: 'land', era: [0, 12], lv: 2, kind: 'shilpa',
      cost: { kala: 14 }, give: { kala: 1 },
      what: 'A pit loom. Thread in, cloth out.' },
    { p: 'bd-forge', g: 'work', on: 'land', era: [1, 12], lv: 3, kind: 'shilpa',
      cost: { kala: 30 }, give: { kala: 2 },
      what: 'A forge: +2 🛠️, and the rakshaks are better armed for it.' },

    /* ---- LEARNING ------------------------------------------------------ */
    { p: 'bd-gurukul', g: 'learn', on: 'land', era: [1, 12], lv: 1, kind: '*', bld: 'gurukul',
      cost: { anna: 20, katha: 15 }, give: { katha: 1 },
      what: 'A gurukul under a tree: +1 📜, and the teacher will take questions here.' },
    { p: 'bd-shrine-small', g: 'learn', on: 'road', era: [0, 12], lv: 1, kind: '*',
      cost: { katha: 8 }, give: { katha: 1 },
      what: 'A wayside shrine. A city that stops to remember, remembers.' },
    { p: 'fg-teacher', g: 'learn', on: 'land', era: [1, 12], lv: 2, kind: 'vidya',
      cost: { katha: 14 }, give: { katha: 2 },
      what: 'A teacher and four pupils on a mat: +2 📜 a turn.' },
    { p: 'bd-observatory', g: 'learn', on: 'land', era: [1, 12], lv: 3, kind: 'vidya',
      cost: { kala: 30, katha: 20 }, give: { katha: 2, kala: 1 },
      what: 'A roof for counting stars: +2 📜 +1 🛠️.' },

    /* ---- HOMES: each one holds one more praja ------------------------- */
    { p: 'hs-hut-round', g: 'home', on: 'land', era: [0, 12], lv: 1, kind: '*',
      cost: { anna: 8 }, give: {}, pop: 1,
      what: 'A round thatched hut. One more pair of hands in the city.' },
    { p: 'hs-hut-pair', g: 'home', on: 'land', era: [0, 12], lv: 1, kind: '*',
      cost: { anna: 14 }, give: {}, pop: 2,
      what: 'Two huts and a swept yard: two more praja.' },
    { p: 'hs-mud-flat', g: 'home', on: 'land', era: [0, 8], lv: 1, kind: '*',
      cost: { anna: 10, kala: 4 }, give: {}, pop: 1,
      what: 'Mud brick with a flat roof — things dry up there.' },
    { p: 'hs-harappan', g: 'home', on: 'land', era: [0, 1], lv: 2, kind: '*',
      cost: { anna: 18, kala: 10 }, give: { kala: 1 }, pop: 2,
      what: 'A courtyard house with its own well and drain — two praja and +1 🛠️.' },
    { p: 'hs-mud-flat-2', g: 'home', on: 'land', era: [0, 8], lv: 2, kind: '*',
      cost: { anna: 16, kala: 8 }, give: {}, pop: 2,
      what: 'Two storeys and an outside stair.' },
    { p: 'hs-tile-court', g: 'home', on: 'land', era: [1, 12], lv: 2, kind: '*',
      cost: { anna: 22, kala: 12 }, give: {}, pop: 3,
      what: 'Rooms on four sides of an open court: three praja.' },
    { p: 'hs-stone-low', g: 'home', on: 'land', era: [0, 2], lv: 2, kind: '*',
      cost: { kala: 16 }, give: {}, pop: 2,
      what: 'Dry-laid stone. It will still be standing when the mud is gone.' },
    { p: 'hs-timber-hall', g: 'home', on: 'land', era: [1, 2], lv: 3, kind: '*',
      cost: { anna: 26, kala: 20 }, give: { katha: 1 }, pop: 3,
      what: 'A carved timber hall with a banner on the ridge.' },

    /* ---- WATER --------------------------------------------------------- */
    { p: 'wa-well', g: 'water', on: 'land', era: [0, 12], lv: 1, kind: '*',
      cost: { kala: 10 }, give: { anna: 1 },
      what: 'A well. Water near the houses is one more field fed.' },
    { p: 'wa-well-pulley', g: 'water', on: 'land', era: [0, 12], lv: 2, kind: '*',
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
    { p: 'wl-mud', g: 'guard', on: 'land', era: [0, 8], lv: 1, kind: '*', bld: 'prakara',
      cost: { kala: 40, anna: 20 }, give: {},
      what: 'A rammed-earth rampart: worth two more rakshaks when something comes.' },
    { p: 'wl-gate', g: 'guard', on: 'road', era: [0, 12], lv: 2, kind: '*',
      cost: { kala: 20 }, give: {},
      what: 'A gate across the street. A wall without one is a wall around nothing.' },
    { p: 'wl-watchtower', g: 'guard', on: 'land', era: [1, 8], lv: 2, kind: '*',
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
    { p: 'pr-awning', g: 'work', on: 'road', era: [0, 12], lv: 1, kind: '*',
      cost: { kala: 6 }, give: { kala: 1 },
      what: 'A stall under a striped awning.' },
    { p: 'pr-cloth-line', g: 'work', on: 'land', era: [0, 12], lv: 1, kind: '*',
      cost: { kala: 4 }, give: { kala: 1 },
      what: 'Dyed cloth drying between two posts.' },
    { p: 'cr-threshing', g: 'field', on: 'land', tile: true, era: [0, 12], lv: 1, kind: 'kheti',
      cost: { anna: 7 }, give: { anna: 1 },
      what: 'A beaten threshing floor with a pole at its centre.' }
  ]
};
