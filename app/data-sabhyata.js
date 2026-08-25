/* Bizzing India — Sabhyata (the civilization game): eras and sites.

   THE CONTENT CONTRACT (docs/16, docs/05). This is 📜 Itihaas-flavoured play, so every
   site fact here is broadly attested and cites its sources; where a reading is debated
   the fact SAYS so at a child's level, and where a site's fame is story rather than
   evidence the fact says "the story goes" — that is the 🪔 Katha frame, inline. Dates
   are ranges. Contested chronology is left out of the game entirely.

   Coordinates are PROJECTED, not placed by eye: latitude/longitude through the same
   fitted Mercator frame that places the capitals on the Living Map
   (tools/map-capitals.py — x = -2111.35 + 1808.55·lon(rad), y = 1302.34 - 1828.84·merc(lat)),
   so Lothal sits where Lothal is.

   Sites cluster where archaeology clusters — four Harappan-era towns sit in the
   northwest because that is where that civilization's Indian sites are. No state is
   favoured by design.

   kind: what a settlement yields —
     kheti (🌾 anna, grain) · shilpa (🛠️ kala, craft) · vidya (📜 katha, story)

   needs_review: a human reviewer signs off the facts before this ships (docs/05 §6). */

window.IND_SABHYATA = {
  needs_review: true,

  resources: {
    anna:  { icon: '🌾', name: 'Anna',  hi: 'अन्न',  what: 'grain — grows settlements' },
    kala:  { icon: '🛠️', name: 'Kala',  hi: 'कला',  what: 'craft — builds routes' },
    katha: { icon: '📜', name: 'Katha', hi: 'कथा', what: 'stories — wake sleeping places' }
  },

  /* Era gates: every site of the era awake + the katha bank shown here.
     `aha` is the advance card — one real thing that changed everything, kept simple. */
  eras: [
    { id: 'harappa', name: 'The First Cities', dates: '3300–1300 BCE',
      note: 'Planned streets, great baths, tiny carved seals nobody can read yet.',
      katha: 60,
      aha: { title: 'Iron', text: 'People learn to work iron. Tools open the forests, and the rivers become highways to new homes in the east.' } },
    { id: 'janapada', name: 'Rivers and Kingdoms', dates: '1500–600 BCE',
      note: 'Villages become janapadas along the Ganga. Some choose kings; Vaishali chooses an assembly.',
      katha: 120,
      aha: { title: 'Script and Edicts', text: 'Writing returns to the land — and Ashoka uses it to talk to everyone, carving his promises onto rocks from coast to coast.' } },
    { id: 'maurya', name: 'The Great Sabha', dates: '321–185 BCE',
      note: 'One vast realm run from Pataliputra — and after Kalinga, a king who chooses remorse.',
      katha: 200,
      aha: { title: 'Zero', text: 'In these centuries Indian thinkers treat nothing as a number. Zero will travel further than any army ever did.' } },
    { id: 'gupta', name: 'The Age of Wonder', dates: 'c. 320–700 CE',
      note: 'Universities, painted caves, poets and star-counters.',
      katha: 300,
      aha: { title: 'Ships and Temples', text: 'Sailors ride the monsoon winds to trade across the seas, and in the south rise temples taller than anything the land has seen.' } },
    { id: 'chola', name: 'Temples and the Sea', dates: 'c. 700–1300 CE',
      note: 'The south builds in stone and sails east; pepper leaves Muziris for the whole world.',
      katha: 0,
      aha: null }
  ],

  /* THE CITY'S OWN ECONOMY — buildings a player chooses, techs a player unlocks,
     and the one monument each city is famous for. All names are era-honest; the
     monument is always the city's real signature (works[2]), so "build the
     monument" means building the thing that actually stands there.

     Buildings: available everywhere once their era arrives; each is a decision
     because the same coins also want to be roads, growth and peace. */
  buildings: {
    granary:  { name: 'Granary',  icon: '🏺', era: 0, cost: { anna: 30 },
                what: '+1 🌾 each turn, and the town forgets hunger slower.' },
    workshop: { name: 'Workshop', icon: '🧱', era: 0, cost: { anna: 20, kala: 20 },
                what: '+1 🛠️ each turn.' },
    gurukul:  { name: 'Gurukul',  icon: '🪔', era: 1, cost: { anna: 20, katha: 15 },
                what: '+1 📜 each turn, and the teacher will take questions here.' },
    bazaar:   { name: 'Bazaar',   icon: '⚖️', era: 1, cost: { kala: 35 },
                what: '+1 of everything while the city is on a route.' },
    stepwell: { name: 'Stepwell', icon: '💧', era: 2, cost: { kala: 30, anna: 15 },
                what: 'The city weathers neglect three times longer.' }
  },

  /* Techs: two choices an era, and the coins rarely stretch to both at once —
     the order IS the strategy. Each names a real thing. */
  techs: [
    { id: 'plough',   era: 0, name: 'The Plough',      cost: { katha: 25, kala: 15 },
      what: 'Kalibangan\u2019s furrows everywhere: +1 🌾 from every farming city.' },
    { id: 'brick',    era: 0, name: 'Fired Brick',     cost: { katha: 25, anna: 15 },
      what: 'Kiln-fired and true: buildings cost a third less.' },
    { id: 'iron',     era: 1, name: 'Iron Tools',      cost: { katha: 40, kala: 20 },
      what: 'The forests open: +1 🛠️ from every craft city.' },
    { id: 'panchayat',era: 1, name: 'The Panchayat',   cost: { katha: 35, anna: 20 },
      what: 'Five who sit together: settling a quarrel costs nothing.' },
    { id: 'script',   era: 2, name: 'Brahmi Script',   cost: { katha: 50, kala: 25 },
      what: 'Written down, a question travels: every gurukul can ask about every woken city.' },
    { id: 'roads',    era: 2, name: 'Royal Roads',     cost: { katha: 45, anna: 25 },
      what: 'Milestones and rest-houses: routes cost half.' },
    { id: 'zero',     era: 3, name: 'Zero',            cost: { katha: 60, kala: 30 },
      what: 'Nothing, counted: +1 📜 from every learning city.' },
    { id: 'temple',   era: 3, name: 'Temple Craft',    cost: { katha: 55, anna: 30 },
      what: 'Stone on stone to the sky: monuments cost a third less.' },
    { id: 'monsoon',  era: 4, name: 'Monsoon Sailing', cost: { katha: 70, kala: 35 },
      what: 'Ride the winds out and home: +2 of everything from every port on a route.' }
  ],

  /* ports, for Monsoon Sailing */
  ports: ['lothal', 'sopara', 'mamallapuram', 'muziris', 'konark'],

  /* Quarrels between neighbours — real kinds of dispute, no armies, no winners.
     Two settlements each; both work, they just spend different coins. */
  disputes: [
    { over: 'the river water, in a dry year',
      fix: [{ what: 'Dig a shared channel', cost: { kala: 25 } },
            { what: 'Share the granaries till the rains', cost: { anna: 30 } }] },
    { over: 'tolls on the road between them',
      fix: [{ what: 'Agree one fair weight and measure', cost: { kala: 20, katha: 10 } },
            { what: 'Hold a joint market day', cost: { anna: 25 } }] },
    { over: 'whose potters may sell at the fair',
      fix: [{ what: 'Two rows of stalls, side by side', cost: { anna: 20 } },
            { what: 'A shared kiln, built between the towns', cost: { kala: 30 } }] },
    { over: 'an old promise, half-remembered differently',
      fix: [{ what: 'Let the elders retell it together', cost: { katha: 20 } },
            { what: 'Write it down at last, and seal it', cost: { kala: 15, katha: 10 } }] }
  ],

  /* fact:  shown once, when the site wakes — the teaching moment per place.
     works: what stands in the city at level 1, 2, 3 — growth you can SEE from inside.
     ask:   one recall riddle for the city's teacher — the answer is always the first
            option HERE, drawn from the site's own fact card, and the engine shuffles
            the order per city so position never leaks it (house rule: the answer is
            never printed before it is earned — the child earned this one by waking
            the city and reading its card). */
  sites: [
    /* — era 1 · Harappan — */
    { id: 'dholavira', era: 0, name: 'Dholavira', state: 'GJ', x: 104.9, y: 516.8, kind: 'shilpa',
      fact: 'A planned stone city on an island in the Rann, famous for its great water reservoirs — it caught and kept the rain in a land with almost none.',
      works: ['mud-brick homes', 'the stone walls rise', 'the great reservoirs, filled'],
      ask: { q: 'What did Dholavira build to keep its water?', o: ['Great stone reservoirs', 'A tall lighthouse', 'An iron bridge'] },
      sources: ['NCERT, Our Pasts I, ch. "In the Earliest Cities"', 'ASI Dholavira excavation literature; UNESCO World Heritage listing (2021)'] },
    { id: 'lothal', era: 0, name: 'Lothal', state: 'GJ', x: 169.2, y: 564.2, kind: 'shilpa',
      fact: 'A town of bead-makers by the sea, with a great brick basin that many archaeologists read as a dockyard for trading ships.',
      works: ['a fishing village', 'the bead workshops', 'the great basin and its ships'],
      ask: { q: 'Many archaeologists read Lothal\'s big brick basin as…', o: ['a dockyard for trading ships', 'a royal bath', 'a rice field'] },
      sources: ['NCERT, Our Pasts I', 'S. R. Rao, ASI Lothal excavation reports (the dockyard reading is his, and is debated)'] },
    { id: 'rakhigarhi', lab: 's', era: 0, name: 'Rakhigarhi', state: 'HR', x: 291.2, y: 323.7, kind: 'kheti',
      fact: 'The largest Harappan-era settlement found in India — a farming and trading town whose mounds are still being carefully dug today.',
      works: ['farmsteads on the mound', 'granaries and streets', 'a trading town in full voice'],
      ask: { q: 'Rakhigarhi is famous as…', o: ['the largest Harappan-era settlement in India', 'a temple city', 'Ashoka\'s capital'] },
      sources: ['ASI / Deccan College Rakhigarhi excavations', 'NCERT, Our Pasts I'] },
    { id: 'kalibangan', lab: 'w', era: 0, name: 'Kalibangan', state: 'RJ', x: 228.6, y: 317.2, kind: 'kheti',
      fact: 'Here archaeologists found a ploughed field older than almost any other on Earth — the furrows still crossing each other in the ground.',
      works: ['the first furrows', 'mud-brick lanes', 'the twin mounds, thriving'],
      ask: { q: 'What ancient mark of farming was found at Kalibangan?', o: ['A ploughed field', 'A spice market', 'A star chart'] },
      sources: ['B. B. Lal & B. K. Thapar, ASI Kalibangan excavations', 'NCERT, Our Pasts I'] },

    /* — era 2 · Vedic / janapadas — */
    { id: 'hastinapura', era: 1, name: 'Hastinapura', state: 'UP', x: 351.4, y: 328.6, kind: 'kheti',
      fact: 'The story goes that this was the Kauravas’ and Pandavas’ capital. Under the village today is a real ancient mound, dug layer by careful layer.',
      works: ['a river settlement', 'the raised citadel', 'the storied capital'],
      ask: { q: 'The story goes that Hastinapura was the capital of…', o: ['the Kauravas and Pandavas', 'the Cholas', 'the Mughals'] },
      sources: ['B. B. Lal, ASI Hastinapura excavations (1950–52)', 'Mahabharata (Katha frame — the story, as it is told)'] },
    { id: 'kashi', era: 1, name: 'Kashi', state: 'UP', x: 508.7, y: 466.6, kind: 'vidya',
      fact: 'Kashi — Varanasi today — is one of the oldest continuously lived-in cities on Earth — people have been waking up beside the Ganga here for some three thousand years.',
      works: ['ghats of timber', 'the river city grows', 'lamps the length of the Ganga'],
      ask: { q: 'Kashi is one of the world\'s oldest…', o: ['continuously lived-in cities', 'iron mines', 'island forts'] },
      sources: ['NCERT, Our Pasts I', 'ASI Rajghat excavation literature'] },
    { id: 'ujjain', era: 1, name: 'Ujjain', state: 'MP', x: 280.8, y: 541.4, kind: 'vidya',
      fact: 'A crossroads city where the trade roads met — later so famous for star-watching that Indian astronomers drew their zero line of longitude through it.',
      works: ['a crossroads camp', 'the market town', 'the observatory city'],
      ask: { q: 'Indian astronomers drew what through Ujjain?', o: ['Their zero line of longitude', 'The first railway', 'A great wall'] },
      sources: ['NCERT, Our Pasts I–II', 'History of Indian astronomy literature (Ujjayinī meridian)'] },
    { id: 'vaishali', era: 1, name: 'Vaishali', state: 'BR', x: 575.8, y: 442.8, kind: 'kheti',
      fact: 'Here the Licchavis ran their city by assembly — hundreds sitting together, arguing and voting, over two thousand years ago.',
      works: ['village councils', 'the assembly hall', 'the great sabha in session'],
      ask: { q: 'How did the Licchavis of Vaishali run their city?', o: ['By assembly — arguing and voting', 'By one king\'s word alone', 'By drawing lots'] },
      sources: ['NCERT, Our Pasts I, ch. on early republics (gana-sanghas)', 'ASI Vaishali site literature'] },

    /* — era 3 · Maurya — */
    { id: 'pataliputra', lab: 'w', era: 2, name: 'Pataliputra', state: 'BR', x: 576.0, y: 456.8, kind: 'vidya',
      fact: 'Capital of the Mauryas. A Greek visitor named Megasthenes wrote home amazed at its wooden walls, said to run for miles along the Ganga.',
      works: ['a river fort', 'the wooden walls', 'the Mauryan capital entire'],
      ask: { q: 'Who wrote home amazed at Pataliputra\'s wooden walls?', o: ['Megasthenes, a Greek visitor', 'Xuanzang, a Chinese traveller', 'Marco Polo'] },
      sources: ['NCERT, Our Pasts I, ch. on the Mauryas', 'Megasthenes’ Indica (as preserved in later Greek writers)'] },
    { id: 'sanchi', era: 2, name: 'Sanchi', state: 'MP', x: 342.5, y: 531.0, kind: 'shilpa',
      fact: 'A great stone stupa begun in Ashoka’s time, its gateways crowded with carved stories — kept safe on its quiet hill for two thousand years.',
      works: ['a quiet hill', 'the stupa\'s dome', 'the carved gateways'],
      ask: { q: 'What stands on Sanchi\'s quiet hill?', o: ['A great stone stupa', 'A sun temple', 'A dockyard'] },
      sources: ['ASI Sanchi; UNESCO World Heritage listing', 'NCERT, Our Pasts I'] },
    { id: 'dhauli', lab: 'w', era: 2, name: 'Dhauli', state: 'OR', x: 598.2, y: 644.0, kind: 'vidya',
      fact: 'By the Kalinga battlefield, Ashoka had his promises carved into the rock — that he would rule by care, not conquest. The letters are still there.',
      works: ['the river bend', 'the edict rock', 'the hill of the promises'],
      ask: { q: 'What did Ashoka have carved into the rock at Dhauli?', o: ['His promises to rule by care', 'A map of his empire', 'The rules of chess'] },
      sources: ['Ashokan rock edicts at Dhauli (ASI)', 'NCERT, Our Pasts I, ch. on Ashoka'] },
    { id: 'sopara', era: 2, name: 'Sopara', state: 'MH', x: 186.6, y: 670.3, kind: 'shilpa',
      fact: 'An ancient western port — ships left here for distant coasts, and a fragment of Ashoka’s own edicts was found in its soil.',
      works: ['a fishing harbour', 'the trade wharves', 'ships for distant coasts'],
      ask: { q: 'What was ancient Sopara?', o: ['A western port', 'A mountain fort', 'A university'] },
      sources: ['ASI Sopara (Shurparaka) finds, incl. the VIII rock edict fragment', 'Periplus of the Erythraean Sea (as “Ouppara”)'] },

    /* — era 4 · Gupta / classical — */
    { id: 'nalanda', lab: 'e', era: 3, name: 'Nalanda', state: 'BR', x: 585.7, y: 473.0, kind: 'vidya',
      fact: 'A university with thousands of students and a library said to have towered stories high; the traveller Xuanzang came from China and stayed years.',
      works: ['a grove of teachers', 'the first halls', 'the towering library'],
      ask: { q: 'Who travelled from China to study at Nalanda?', o: ['Xuanzang', 'Megasthenes', 'Ibn Battuta'] },
      sources: ['Xuanzang’s account (Si-yu-ki)', 'ASI Nalanda; UNESCO World Heritage listing', 'NCERT, Our Pasts I'] },
    { id: 'ajanta', era: 3, name: 'Ajanta', state: 'MH', x: 278.2, y: 631.8, kind: 'shilpa',
      fact: 'Caves cut into a river cliff and painted floor to ceiling — the Jataka tales in colour, still glowing in the dark after fifteen centuries.',
      works: ['the river cliff', 'the first cut caves', 'the painted halls'],
      ask: { q: 'What fills the caves of Ajanta?', o: ['Paintings of the Jataka tales', 'Chests of gold coins', 'Iron tools'] },
      sources: ['ASI Ajanta; UNESCO World Heritage listing', 'NCERT, Our Pasts I'] },
    { id: 'mathura', lab: 'e', era: 3, name: 'Mathura', state: 'UP', x: 340.4, y: 389.1, kind: 'shilpa',
      fact: 'The story goes that Krishna was born here. In the same city, workshops carved some of the most loved sculpture in India’s history.',
      works: ['a ford on the Yamuna', 'the workshops', 'the city of sculptors'],
      ask: { q: 'Mathura\'s workshops were famous across India for…', o: ['carved sculpture', 'silk sails', 'war chariots'] },
      sources: ['Mathura school of sculpture (standard art-history literature)', 'Krishna tradition (Katha frame — the story, as it is told)'] },
    { id: 'madurai', lab: 's', era: 3, name: 'Madurai', state: 'TN', x: 354.5, y: 983.9, kind: 'vidya',
      fact: 'The old tellings say poets gathered here in academies called sangams; the Tamil poems of that age still name the streets, the traders, the sea.',
      works: ['a river town', 'the poets arrive', 'the sangam in session'],
      ask: { q: 'The old tellings say poets gathered at Madurai in…', o: ['sangam academies', 'stone circles', 'sea forts'] },
      sources: ['Sangam literature corpus (e.g. Madurai-kanchi)', 'NCERT, Our Pasts I, ch. on the southern kingdoms'] },

    /* — era 5 · temples and the sea — */
    { id: 'mamallapuram', lab: 'e', era: 4, name: 'Mamallapuram', state: 'TN', x: 419.9, y: 896.3, kind: 'shilpa',
      fact: 'A Pallava harbour town where sculptors tried everything — temples shaped like chariots, a whole cliff carved into one crowded, joyful scene.',
      works: ['a shore village', 'the carvers\' yard', 'temples like chariots'],
      ask: { q: 'Some of Mamallapuram\'s temples are shaped like…', o: ['chariots', 'lotuses', 'elephants'] },
      sources: ['ASI Mamallapuram; UNESCO World Heritage listing', 'NCERT, Our Pasts II'] },
    { id: 'thanjavur', era: 4, name: 'Thanjavur', state: 'TN', x: 386.7, y: 956.0, kind: 'vidya',
      fact: 'Rajaraja Chola raised a temple here so tall its shadow was a wonder of the age, and its walls carry the accounts of the whole kingdom, carved in stone.',
      works: ['the rice plain', 'the rising vimana', 'the great temple\'s shadow'],
      ask: { q: 'Who raised the great temple at Thanjavur?', o: ['Rajaraja Chola', 'Ashoka', 'Akbar'] },
      sources: ['Brihadisvara temple inscriptions (ASI); UNESCO World Heritage listing', 'NCERT, Our Pasts II, ch. on the Cholas'] },
    { id: 'konark', lab: 'e', era: 4, name: 'Konark', state: 'OR', x: 606.2, y: 654.4, kind: 'shilpa',
      fact: 'The Sun temple — a whole shrine built as the sun god’s chariot, with carved stone wheels taller than a grown-up.',
      works: ['the shore site', 'the wheels take shape', 'the chariot of the sun'],
      ask: { q: 'Konark\'s Sun temple is built in the shape of…', o: ['the sun god\'s chariot', 'a giant lotus', 'a warship'] },
      sources: ['ASI Konark; UNESCO World Heritage listing', 'NCERT, Our Pasts II'] },
    { id: 'muziris', lab: 'w', era: 4, name: 'Muziris', state: 'KL', x: 293.8, y: 973.9, kind: 'kheti',
      fact: 'The pepper port of the west — Roman writers grumbled about the gold their ships spent here, and a Tamil poem calls it the city where the ships come laden.',
      works: ['a pepper village', 'the wharves, busy', 'ships from across the sea'],
      ask: { q: 'What left Muziris for the wider world?', o: ['Pepper', 'Marble', 'Horses'] },
      sources: ['Periplus of the Erythraean Sea; Pliny, Natural History', 'Akananuru 149 (the Muciri poem); Pattanam excavation literature (the identification is discussed)'] }
  ]
};
