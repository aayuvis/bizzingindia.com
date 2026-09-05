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
    anna:  { icon: '🌾', name: 'Anna',  hi: 'अन्न',  what: 'the harvest — whatever this land grows, and it grows settlements' },
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
      katha: 400,
      aha: { title: 'Paper', text: 'Paper-making arrives along the trade roads. What took a palm-leaf a page now fills a book — and ideas start travelling faster than the people who carry them.' } },
    /* THE ROAD TO NOW (the founder's ask): eight more ages, a finer ladder to
       the present day, under the same editorial law as the first five — what
       is shown is attested and sourced; nothing sacred to anyone is ever an
       antagonist; cities fall quiet through rivers, rains and the turning of
       ages, NEVER through war; and the difficult chapters of these centuries
       (docs/05 §6 — conquest, colonial violence, Partition) belong to human
       authors with named reviewers, not to a game board. The ages are framed
       by what was BUILT, written, sung and grown. */
    { id: 'minar', name: 'Domes and Minars', dates: 'c. 1200–1400 CE',
      note: 'Delhi rises city upon city; arches and domes join older ways of building, and paper begins to fill the libraries.',
      katha: 450,
      aha: { title: 'The Charkha', text: 'The spinning wheel reaches every courtyard. Thread that took a week now takes a day — and Indian cloth becomes a gift the whole world asks for.' } },
    { id: 'vijaya', name: 'The City of Victory', dates: 'c. 1336–1600 CE',
      note: 'Hampi weighs gems by the heap in its bazaars; travellers from far lands write home in plain disbelief.',
      katha: 500,
      aha: { title: 'The Char Bagh', text: 'Gardens of four quarters — running water, fruit trees, shade — teach even cities how to breathe.' } },
    { id: 'baagh', name: 'Gardens and Marble', dates: 'c. 1526–1707 CE',
      note: 'The Taj rises at Agra; Harmandir Sahib shines from its pool at Amritsar; miniature painters fit whole worlds onto a page.',
      katha: 550,
      aha: { title: 'The Shipyards', text: 'On every coast, Indian shipwrights build ocean-going ships that traders of many flags queue to buy.' } },
    { id: 'bandar', name: 'Sails and Factories', dates: 'c. 1600–1800 CE',
      note: 'Surat weighs the cargo of the world at its wharves, and cloth from Indian looms dresses half the earth.',
      katha: 600,
      aha: { title: 'The Railway', text: 'Steam engines pull the first train from Bombay to Thane in 1853. A journey of weeks becomes a day, and every town moves closer to every other.' } },
    { id: 'rail', name: 'Railways and Presses', dates: 'c. 1800–1900 CE',
      note: 'Trains, post and printing knit the land together; ideas travel third class and reach absolutely everyone.',
      katha: 650,
      aha: { title: 'Swadeshi', text: 'Indians decide that their own things matter: their own cloth, their own schools, their own salt. Small choices, made by millions together.' } },
    { id: 'azaadi', name: 'The Freedom Age', dates: 'c. 1900–1947 CE',
      note: 'From a quiet ashram on the Sabarmati, patience and truth are shown to move an empire — and in 1947, India is free.',
      katha: 700,
      aha: { title: 'The Constitution', text: 'Dr Ambedkar and the Assembly write the Republic’s promise: every grown-up’s vote equal, every citizen’s dignity equal.' } },
    { id: 'nirman', name: 'The Young Republic', dates: '1947–1991 CE',
      note: 'Dams, steel towns, new seeds, a brand-new planned city — a young country builds itself with its own hands.',
      katha: 750,
      aha: { title: '1991', text: 'India opens its doors to the world’s trade — and a billion ideas suddenly find room to grow.' } },
    { id: 'takeoff', name: 'The Takeoff', dates: '1991 CE – today',
      note: 'Software from Bengaluru, rockets from Sriharikota, a phone in nearly every hand — the oldest story on earth, still being written.',
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
                what: 'The city weathers neglect three times longer.' },
    /* DEFENCE IS A BUILDING NOW. A wall is worth two watchers on the gate and
       a fort worth four, and the fort also shelters a monument still rising —
       which is why the great cities of every age put one up first. */
    prakara:  { name: 'Prakara', icon: '🧱', era: 1, cost: { kala: 40, anna: 20 },
                what: 'A rampart: worth two more rakshaks when something comes.' },
    durg:     { name: 'Durg',    icon: '🏰', era: 3, cost: { kala: 60, anna: 30 },
                what: 'A fort: worth four more rakshaks, and it shelters a monument being raised.' }
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
      what: 'Ride the winds out and home: +2 of everything from every port on a route.' },
    /* one door per later age — the ladder is longer now, so each rung carries
       one real thing that changed the country, never a weapon among them */
    { id: 'paper',    era: 5,  name: 'Paper',               cost: { katha: 70, kala: 35 },
      what: 'Books, not palm leaves: +1 📜 from every learning city.' },
    { id: 'charkha',  era: 6,  name: 'The Charkha',         cost: { katha: 70, anna: 35 },
      what: 'A spinning wheel in every home: +1 🛠️ from every craft city.' },
    { id: 'chahbagh', era: 7,  name: 'The Char Bagh',       cost: { katha: 75, kala: 40 },
      what: 'Gardens of four quarters: an utsav costs half — the whole town is already outdoors.' },
    { id: 'ship',     era: 8,  name: 'The Shipyards',       cost: { katha: 75, kala: 40 },
      what: 'Ocean-going hulls from Indian yards: +1 of everything from every port on a route.' },
    { id: 'railway',  era: 9,  name: 'The Railway',         cost: { katha: 80, kala: 45 },
      what: 'Iron roads: new routes cost half again.' },
    { id: 'press',    era: 10, name: 'The Printing Press',  cost: { katha: 80, anna: 45 },
      what: 'A thousand copies by morning: every teacher’s question pays double.' },
    { id: 'harit',    era: 11, name: 'The Green Revolution', cost: { katha: 85, anna: 50 },
      what: 'New seeds and shared science: +2 🌾 from every farming city.' },
    { id: 'satellite',era: 12, name: 'The Satellite',       cost: { katha: 90, kala: 50 },
      what: 'Aryabhata, 1975 — India’s own eye in the sky: explorers walk twice as fast, and no city ever fades again.' }
  ],

  /* THE RIVERS — the map's own veins, projected from real courses through the same
     Mercator fit as everything else (tools/map-capitals.py), then simplified to a
     handful of waypoints each: this is a child's map, not a survey sheet. Terrain
     only — nothing interactive, nothing gamified, no boundary meaning. */
  rivers: [
    { n: 'Sutlej', p: [[316.0,242.0],[256.0,257.0],[221.3,290.4],[202.4,301.4]] },
    { n: 'Yamuna', p: [[347.6,264.4],[326.4,348.6],[351.4,400.3],[383.2,415.0],[472.3,462.2]] },
    { n: 'Ganga', p: [[359.3,294.4],[355.8,300.0],[357.0,341.7],[398.1,388.8],[424.9,426.4],[472.3,462.2],[508.6,466.5],[576.1,456.6],[634.8,468.9],[666.4,498.8],[679.0,537.2],[685.3,578.8]] },
    { n: 'Brahmaputra', p: [[915.7,374.4],[884.2,389.9],[817.9,420.0],[784.8,436.0],[728.9,441.7],[723.2,467.2]] },
    { n: 'Narmada', p: [[469.1,559.1],[411.7,541.7],[334.9,561.5],[271.8,571.9],[192.3,592.5]] },
    { n: 'Godavari', p: [[208.7,652.6],[328.6,681.1],[410.7,691.2],[470.0,751.6],[486.5,761.6]] },
    { n: 'Krishna', p: [[215.0,720.8],[284.4,761.6],[331.8,778.2],[432.8,768.2],[445.4,791.5]] },
    { n: 'Kaveri', p: [[271.8,904.1],[309.1,902.8],[331.8,919.7],[357.0,949.1],[391.8,952.3],[409.1,945.8]] }
  ],

  /* ports, for Monsoon Sailing */
  ports: ['lothal', 'sopara', 'mamallapuram', 'muziris', 'konark'],

  /* THE PEOPLE. Every city has praja — citizens with jobs the player allocates.
     Jobs are era-honest and gentle; the rakshaks are a village WATCH, not an army:
     they drive crop-raiders off with drums, torches and mended fences, and nobody
     in this game is ever hurt. */
  /* WHO A CITY MAY PUT TO WORK.
     `guard` is what one of them is worth at the gate when the dust rises, so
     a role that earns nothing is not a role that does nothing. Which of these
     a city may actually add is decided by what it has BUILT — see the `jobs`
     roster in data-kit-build.js. Kisan are ungated everywhere, deliberately:
     a city that cannot farm is a city that cannot start. */
  jobs: {
    kisan:   { name: 'Kisan',   icon: '🌾', guard: 0, what: 'farms — feeds everyone, earns anna' },
    karigar: { name: 'Karigar', icon: '🛠️', guard: 0, what: 'crafts — earns kala' },
    kathakar:{ name: 'Kathakar',icon: '📜', guard: 0, what: 'tells and teaches — earns katha' },
    rakshak: { name: 'Rakshak', icon: '🛡️', guard: 1, what: 'keeps watch — drives raids off, earns nothing' },
    /* A DOORKEEPER IS NOT A SOLDIER. What the Harappan walls were for is
       argued about and nothing in docs/19 settles it, so the earliest city
       gets somebody who keeps a door, not somebody who fights a war. */
    dwarpal: { name: 'Dwarpal', icon: '🚪', guard: 1, what: 'keeps the gate — counts who comes and goes, and holds it when the dust rises' },
    dhanurdhar: { name: 'Dhanurdhar', icon: '🏹', guard: 2, what: 'keeps the bow from the tower — worth two on the wall' }
  },

  /* RAIDS — the wilds test the granaries, never people. Real, era-honest hazards a
     child can meet without fear; each names what the rakshaks actually do. */
  /* WHAT COMES TO THE GATE, AGE BY AGE.

     The house rule holds and is the reason this table exists at all: a raid is
     dust on the horizon and a banner, never a painted people. No face, no
     costume, no enemy a child could point at in a classroom. Faith is never
     the threat. Where a force is named it is named as history names it — the
     Hunas, the Mongol raids, Timur's army, Nadir Shah's — and the naming is
     the teaching: these things happened to cities that then rebuilt.

     Two ages carry the editorial policy's colonial-violence flag (docs/05 §6).
     Until a named human reviewer signs their human threats off, those ages
     face only what nobody argues about: fire, storm, famine and sickness.

       era   which age it belongs to        str  how hard it presses
       hits  which store it empties         warn the banner it flies

     Sources are the standard record: Skandagupta's Bhitari pillar inscription
     for the Huna wars; Barani and Amir Khusrau for the Mongol raids on Delhi;
     the Timur campaign of 1398; Nadir Shah's of 1739; Sangam and Chola-era
     accounts of coastal raiding; famine and epidemic commission reports for
     the nineteenth century. */
  raids: [
    /* — the ages of nature and neighbours — */
    { id: 'boar',    era: [0, 2], hits: 'anna', str: 2, kind: 'beast',
      what: 'Wild boar are in the wheat at night', warn: 'Something is moving in the fields',
      fended: 'the rakshaks drum and wave torches till the boar trot back to the forest' },
    { id: 'elephant',era: [0, 4], hits: 'anna', str: 3, kind: 'beast',
      what: 'A wild elephant herd has found the grain stores', warn: 'The forest edge is crashing',
      fended: 'the rakshaks guide the herd away with lanterns, drums and a clear path out' },
    { id: 'dryriver',era: [0, 1], hits: 'anna', str: 3, kind: 'nature',
      what: 'The river is running thin and the fields are cracking',
      warn: 'The water is falling at the ghats',
      fended: 'the reservoirs and the stepwell hold, and the town drinks through it' },
    { id: 'flood',   era: [0, 3], hits: 'kala', str: 3, kind: 'nature',
      what: 'The river has come over its banks into the lanes',
      warn: 'The river is rising fast',
      fended: 'the rakshaks raise the bunds and carry the stores to high ground in time' },
    { id: 'locust',  era: [1, 5], hits: 'anna', str: 3, kind: 'beast',
      what: 'A locust cloud is settling on the fields', warn: 'A brown cloud is coming over the fields',
      fended: 'everyone under the rakshaks\u2019 lead beats pans and smokes the swarm onward' },
    { id: 'warband', era: [1, 2], hits: 'kala', str: 5, kind: 'human',
      what: 'A rival janapada\u2019s war-band is at the boundary stone',
      warn: 'Dust on the boundary road — a neighbouring janapada rides',
      fended: 'the rakshaks hold the gate and the elders talk them back across the boundary' },
    { id: 'rivalking',era: [2, 4], hits: 'kala', str: 6, kind: 'human',
      what: 'A rival kingdom\u2019s army is camped a day away',
      warn: 'A rival kingdom\u2019s standards are a day away',
      fended: 'the walls are manned, the granary is deep, and the camp strikes its tents' },
    { id: 'frontier',era: [2, 2], hits: 'kala', str: 6, kind: 'human',
      what: 'Armies from the northwest frontier are on the royal road',
      warn: 'Word from the northwest: an army is on the royal road',
      fended: 'the frontier is held and the envoys are sent home with gifts instead' },
    { id: 'huna',    era: [3, 3], hits: 'kala', str: 8, kind: 'human',
      what: 'The Hunas ride from the northwest', warn: 'Riders from the northwest — the Hunas',
      fended: 'the gates hold and the riders turn away, as Skandagupta\u2019s pillar remembers it' },
    { id: 'searaid', era: [4, 6], hits: 'kala', str: 6, kind: 'human',
      what: 'Raiders have come off the sea into the harbour',
      warn: 'Strange sails on the horizon',
      fended: 'the harbour chain goes up and the fishing fleet warns the town in time' },
    { id: 'mongol',  era: [5, 5], hits: 'kala', str: 9, kind: 'human',
      what: 'Mongol raiders are across the river', warn: 'The Mongol raiders are across the river',
      fended: 'the city gates hold through the season and the raiders ride back north' },
    { id: 'timur',   era: [5, 5], hits: 'katha', str: 11, kind: 'human',
      what: 'Timur\u2019s army is at the gates', warn: 'Timur\u2019s army is three days away',
      fended: 'the walls hold, the libraries are carried to the fort, and the city survives its worst year' },
    { id: 'deccan',  era: [6, 6], hits: 'kala', str: 8, kind: 'human',
      what: 'The Deccan kingdoms have made an alliance against this city',
      warn: 'The Deccan kingdoms are gathering',
      fended: 'the bazaars close, the fort holds, and the alliance falls out among itself' },
    { id: 'nadir',   era: [7, 7], hits: 'katha', str: 10, kind: 'human',
      what: 'Nadir Shah\u2019s army has entered the capital',
      warn: 'An army out of the northwest is a week from the capital',
      fended: 'the treasury is emptied into the fort and the city keeps its people' },
    { id: 'revolt',  era: [7, 7], hits: 'kala', str: 6, kind: 'human',
      what: 'The provinces at the edge have stopped sending revenue',
      warn: 'The edge provinces are restless',
      fended: 'the governors are heard out and the roads stay open' },
    /* — the two flagged ages: nothing human until a reviewer signs it off — */
    { id: 'fire',    era: [8, 9], hits: 'kala', str: 6, kind: 'nature',
      what: 'Fire has taken hold in the warehouses by the water',
      warn: 'Smoke over the warehouse quarter',
      fended: 'the rakshaks form the bucket line and the fire is out before the roofs go' },
    { id: 'cyclone', era: [8, 11], hits: 'kala', str: 7, kind: 'nature',
      what: 'A cyclone is coming up the coast', warn: 'The sea is wrong — a cyclone is coming',
      fended: 'the boats are hauled up, the roofs lashed, and everyone is inside before it lands' },
    { id: 'famine',  era: [9, 9], hits: 'anna', str: 8, kind: 'nature',
      what: 'The rains failed and the grain is not coming',
      warn: 'The rains have failed a second year',
      fended: 'the granaries were deep enough, and the trains bring grain in time' },
    { id: 'plague',  era: [9, 9], hits: 'katha', str: 7, kind: 'nature',
      what: 'A sickness is travelling the new railway lines',
      warn: 'Word of sickness down the line',
      fended: 'the town keeps its wells clean and its sick cared for, and it passes' },
    /* — the mist, the one antagonist this game allows itself — */
    { id: 'mist',    era: [0, 10], hits: 'fade', str: 5, kind: 'mist',
      what: 'Vismriti itself pushes at the lamps', warn: 'The grey is thickening at the edges',
      fended: 'the rakshaks walk the lanes all night relighting every lamp that gutters' },
    { id: 'forget',  era: [10, 12], hits: 'katha', str: 6, kind: 'mist',
      what: 'Nobody under thirty knows what this place is for',
      warn: 'The old stories are going quiet here',
      fended: 'the kathakars hold a telling in the square and the whole quarter comes' },
    /* — the ages of the Republic — */
    { id: 'drought', era: [11, 12], hits: 'anna', str: 7, kind: 'nature',
      what: 'A hard drought is on the district', warn: 'Three months and no rain',
      fended: 'the tanks and the canals hold, and the harvest comes in anyway' },
    { id: 'floodmod',era: [11, 12], hits: 'anna', str: 7, kind: 'nature',
      what: 'The river is over the embankment again', warn: 'The river is rising above the mark',
      fended: 'the embankment holds and the relief camps are ready before the water comes' },
    { id: 'heat',    era: [12, 12], hits: 'anna', str: 7, kind: 'nature',
      what: 'The heat has not broken for weeks and the tanks are low',
      warn: 'The heat is not breaking',
      fended: 'the green belt and the old tanks keep the city cool enough to work' },
    { id: 'smog',    era: [12, 12], hits: 'katha', str: 6, kind: 'nature',
      what: 'The air has turned grey and nobody goes out',
      warn: 'The air is turning grey',
      fended: 'the parks and the wetlands breathe for the city and the air clears' }
  ],

  /* HEROES — one may rise in a level-3 city, and they are ROLES, never named rulers
     (docs/05: rulers are people, not player pieces). Each has one great deed and a
     quiet gift while they stay. */
  heroes: {
    kheti:  { name: 'The Annadata', icon: '🌾',
              deed: 'The Golden Harvest', deedWhat: 'a year of plenty: +120 anna, and every dusty town shakes itself proud again',
              gift: '+2 anna each turn while they stay' },
    shilpa: { name: 'The Sthapati', icon: '🛠️',
              deed: 'The Master Work', deedWhat: 'raises this city\u2019s monument in a single season, free',
              gift: '+2 kala each turn while they stay' },
    vidya:  { name: 'The Acharya',  icon: '📜',
              deed: 'The Great Teaching', deedWhat: 'one learning of this age comes to everyone, free',
              gift: '+2 katha each turn while they stay' }
  },

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
      more: ['Ten big signs of the Indus script were found fallen by its north gate — a wooden signboard once hung there, and its letters still cannot be read by anyone alive.',
             'Its people cut sixteen great reservoirs into the rock, stepped one into the next, so the rain of one season could last the whole year.',
             'The city was laid out in three nested parts — a citadel, a middle town and a lower town — measured out in careful proportions, wall within wall.',
             'When the rains and the rivers failed, the great city slowly emptied — archaeologists read its end as a long drying that outlasted even those master water-keepers.'
            ],
      asks: [{ q: 'What was found fallen by Dholavira’s north gate?', o: ['Ten signs of an unread script — a signboard', 'A golden crown', 'An iron anchor'] },
             { q: 'How did Dholavira’s reservoirs work?', o: ['Stepped one into the next, keeping the rain', 'A canal filled them from the Ganga', 'They stored oil, not water'] },
             { q: 'Dholavira was laid out in…', o: ['three parts — citadel, middle and lower town', 'one great circle', 'a hundred little islands'] }
            ],
      sources: ['NCERT, Our Pasts I, ch. "In the Earliest Cities"', 'ASI Dholavira excavation literature; UNESCO World Heritage listing (2021)', 'Bisht/ASI on the city plan and its decline (aridification reading)'] },
    { id: 'lothal', era: 0, name: 'Lothal', state: 'GJ', x: 169.2, y: 564.2, kind: 'shilpa',
      fact: 'A town of bead-makers by the sea, with a great brick basin that many archaeologists read as a dockyard for trading ships.',
      works: ['a fishing village', 'the bead workshops', 'the great basin and its ships'],
      ask: { q: 'Many archaeologists read Lothal\'s big brick basin as…', o: ['a dockyard for trading ships', 'a royal bath', 'a rice field'] },
      more: ['Its workshops drilled carnelian beads so tiny a whole necklace can pass through a bangle — Lothal beads travelled as far as Mesopotamia.',
             'Traders here weighed goods with neat cube-shaped stone weights, each size doubling the last — the same sizes used across every Harappan town.',
             'Among the finds are terracotta toys and little gamesmen — the children of the port had their own khel, four thousand years before yours.'
            ],
      asks: [{ q: 'Lothal’s famous workshops made…', o: ['tiny carnelian beads', 'iron swords', 'silk cloth'] },
             { q: 'Harappan traders at Lothal weighed goods with…', o: ['cube-shaped stone weights in matching sizes', 'bags of feathers', 'clay coins'] },
             { q: 'What did Lothal’s children leave behind?', o: ['Terracotta toys and game pieces', 'Iron bicycles', 'Glass kites'] }
            ],
      sources: ['NCERT, Our Pasts I', 'S. R. Rao, ASI Lothal excavation reports (the dockyard reading is his, and is debated)', 'S. R. Rao, Lothal reports (toys and gamesmen)'] },
    { id: 'rakhigarhi', lab: 's', era: 0, name: 'Rakhigarhi', state: 'HR', x: 291.2, y: 323.7, kind: 'kheti',
      fact: 'The largest Harappan-era settlement found in India — a farming and trading town whose mounds are still being carefully dug today.',
      works: ['farmsteads on the mound', 'granaries and streets', 'a trading town in full voice'],
      ask: { q: 'Rakhigarhi is famous as…', o: ['the largest Harappan-era settlement in India', 'a temple city', 'Ashoka\'s capital'] },
      more: ['In 2019 scientists managed to read the DNA of a woman buried here some 4,500 years ago — one skeleton out of sixty-one gave up its story.',
             'A living village sits right on top of the old mounds — buffaloes and bicycles pass over streets nobody has walked for four thousand years.',
             'Granaries, hearths and neat drains keep coming up from the trenches — and the mounds stretch so wide that much of the city still waits unopened under the fields.'
            ],
      asks: [{ q: 'What did scientists read from a Rakhigarhi burial in 2019?', o: ['DNA, 4,500 years old', 'A paper map', 'A gold coin’s date'] },
             { q: 'What sits on top of Rakhigarhi’s ancient mounds today?', o: ['A living village', 'A glacier', 'An airport'] }],
      sources: ['ASI / Deccan College Rakhigarhi excavations', 'NCERT, Our Pasts I', 'Shinde et al., Cell 179 (2019) — the Rakhigarhi ancient-DNA study'] },
    { id: 'kalibangan', lab: 'w', era: 0, name: 'Kalibangan', state: 'RJ', x: 228.6, y: 317.2, kind: 'kheti',
      fact: 'Here archaeologists found a ploughed field older than almost any other on Earth — the furrows still crossing each other in the ground.',
      works: ['the first furrows', 'mud-brick lanes', 'the twin mounds, thriving'],
      ask: { q: 'What ancient mark of farming was found at Kalibangan?', o: ['A ploughed field', 'A spice market', 'A star chart'] },
      more: ['Its name means “black bangles” — the mounds are strewn with burnt terracotta bangles, and they named the place before anyone knew what lay below.',
             'Diggers found rows of small brick platforms holding ash, which many read as fire altars — the polite argument about them continues to this day.',
             'Its earliest layers were found buckled and torn — signs, many say, of an ancient earthquake, among the oldest ever traced by diggers anywhere.'
            ],
      asks: [{ q: 'What does the name Kalibangan mean?', o: ['Black bangles', 'White river', 'Tall gate'] },
             { q: 'Many read the ash-filled brick platforms at Kalibangan as…', o: ['fire altars — still debated', 'bread ovens', 'elephant stables'] }],
      sources: ['B. B. Lal & B. K. Thapar, ASI Kalibangan excavations', 'NCERT, Our Pasts I', 'B. B. Lal on the disturbed early layers (earthquake reading, debated)'] },

    /* — era 2 · Vedic / janapadas — */
    { id: 'hastinapura', era: 1, name: 'Hastinapura', state: 'UP', x: 351.4, y: 328.6, kind: 'kheti',
      fact: 'The story goes that this was the Kauravas’ and Pandavas’ capital. Under the village today is a real ancient mound, dug layer by careful layer.',
      works: ['a river settlement', 'the raised citadel', 'the storied capital'],
      ask: { q: 'The story goes that Hastinapura was the capital of…', o: ['the Kauravas and Pandavas', 'the Cholas', 'the Mughals'] },
      more: ['When diggers cut into the mound in the 1950s they found a thick flood layer — the river truly drowned the town once, much as the old story says it did.',
             'The mound’s people ate from thin grey bowls painted with black lines — Painted Grey Ware, the signature pottery of the age of the epics.',
             'The old chronicles themselves tell of the Ganga washing the capital away and the kings moving to Kausambi — and the trenches at Kausambi rise just as Hastinapura drowns.'
            ],
      asks: [{ q: 'What did diggers find in Hastinapura’s mound that matches the old story?', o: ['A great flood layer', 'A stone spaceship', 'A Roman coin'] },
             { q: 'The pottery of Hastinapura’s age is called…', o: ['Painted Grey Ware', 'Blue China', 'Redstone Ware'] }],
      sources: ['B. B. Lal, ASI Hastinapura excavations (1950–52; the flood layer and the Painted Grey Ware)', 'Mahabharata (Katha frame — the story, as it is told)', 'Puranic chronicles on the flood and the move to Kausambi (with Lal’s correlation)'] },
    { id: 'kashi', era: 1, name: 'Kashi', state: 'UP', x: 508.7, y: 466.6, kind: 'vidya',
      renames: [{ era: 5, name: 'Banaras' }, { era: 11, name: 'Varanasi' }],
      fact: 'Kashi — Varanasi today — is one of the oldest continuously lived-in cities on Earth — people have been waking up beside the Ganga here for some three thousand years.',
      works: ['ghats of timber', 'the river city grows', 'lamps the length of the Ganga'],
      ask: { q: 'Kashi is one of the world\'s oldest…', o: ['continuously lived-in cities', 'iron mines', 'island forts'] },
      more: ['Just outside the city, at Sarnath, the Buddha gave his very first teaching — and the lion capital of Ashoka’s pillar there is now the emblem of India itself.',
             'Old tales prize the fine cloth of Kashi — even the Jataka stories, over two thousand years old, boast of its weavers — and Banarasi weaves are treasured still.',
             'Mark Twain, visiting, wrote that Banaras is older than history, older than tradition, older even than legend — and looks twice as old as all of them put together.',
             'The tellings place Tulsidas here by the ghats, writing the Ramcharitmanas that half of north India knows by heart.',
             'It has drawn learners for centuries — pathshalas by the hundred, and Banaras Hindu University, founded in 1916, among Asia’s great campuses.'
            ],
      asks: [{ q: 'What happened at Sarnath, just outside Kashi?', o: ['The Buddha gave his first teaching', 'The first train departed', 'A great dam was built'] },
             { q: 'The Jataka tales boast of Kashi’s…', o: ['fine woven cloth', 'iron mines', 'war elephants'] },
             { q: 'Which visiting writer called Banaras older than legend itself?', o: ['Mark Twain', 'Charles Dickens', 'William Wordsworth'] }
            ],
      sources: ['NCERT, Our Pasts I', 'ASI Rajghat excavation literature', 'Jataka tales (Kasi cloth); Sarnath lion capital (the State Emblem of India)', 'Mark Twain, Following the Equator (1897); BHU (est. 1916); Tulsidas tradition (Katha frame)'] },
    { id: 'ujjain', era: 1, name: 'Ujjain', state: 'MP', x: 280.8, y: 541.4, kind: 'vidya',
      fact: 'A crossroads city where the trade roads met — later so famous for star-watching that Indian astronomers drew their zero line of longitude through it.',
      works: ['a crossroads camp', 'the market town', 'the observatory city'],
      ask: { q: 'Indian astronomers drew what through Ujjain?', o: ['Their zero line of longitude', 'The first railway', 'A great wall'] },
      more: ['In a famous Sanskrit poem, Kalidasa sends a cloud with a message — and the cloud makes a detour just to drift over Ujjain, so loved was the city.',
             'Every twelve years the Simhastha Kumbh gathers on the Shipra here — one of the great melas of the world, in a city that has hosted crowds for millennia.',
             'King Vikramaditya of the tales held court here, ringed by his navaratna — nine gems of poets and scholars — or so the tellings go.',
             'An eighteenth-century observatory, the Vedh Shala, still works here — great stone instruments under the open sky, heirs of the old zero meridian.'
            ],
      asks: [{ q: 'In Kalidasa’s poem, what detours just to see Ujjain?', o: ['A cloud carrying a message', 'A flock of parrots', 'A river'] },
             { q: 'What gathers on the Shipra at Ujjain every twelve years?', o: ['The Simhastha Kumbh mela', 'A snow festival', 'A boat race to the sea'] },
             { q: 'Whose court do the tales fill with nine gems at Ujjain?', o: ['Vikramaditya’s', 'Ashoka’s', 'Babur’s'] }
            ],
      sources: ['NCERT, Our Pasts I–II', 'History of Indian astronomy literature (Ujjayinī meridian)', 'Jai Singh’s Vedh Shala, Ujjain (18th c.); Vikramaditya cycle (Katha frame)'] },
    { id: 'vaishali', era: 1, name: 'Vaishali', state: 'BR', x: 575.8, y: 442.8, kind: 'kheti',
      fact: 'Here the Licchavis ran their city by assembly — hundreds sitting together, arguing and voting, over two thousand years ago.',
      works: ['village councils', 'the assembly hall', 'the great sabha in session'],
      ask: { q: 'How did the Licchavis of Vaishali run their city?', o: ['By assembly — arguing and voting', 'By one king\'s word alone', 'By drawing lots'] },
      more: ['An Ashokan pillar still stands whole at Kolhua here — a single lion on top, gazing north — one of the few that never fell in over two thousand years.',
             'The Jain tradition remembers Mahavira as born just outside Vaishali, and the tellings say the Buddha loved this city and preached here many times.',
             'The tellings remember Amrapali, the most famous dancer of her age — she gave the Buddha her mango grove, and the sangha rested in its shade.'
            ],
      asks: [{ q: 'What still stands whole at Kolhua in Vaishali?', o: ['An Ashokan pillar with a single lion', 'A glass tower', 'A Roman arch'] },
             { q: 'Whom does Jain tradition remember as born near Vaishali?', o: ['Mahavira', 'Ashoka', 'Akbar'] },
             { q: 'What did Amrapali of Vaishali give the Buddha?', o: ['Her mango grove', 'A golden chariot', 'A war elephant'] }
            ],
      sources: ['NCERT, Our Pasts I, ch. on early republics (gana-sanghas)', 'ASI Vaishali site literature; the Kolhua pillar', 'Jain tradition on Mahavira’s birthplace (Katha frame — as the community tells it)', 'Amrapali in the Pali tradition (Katha frame — as the tellings tell it)'] },

    /* — era 3 · Maurya — */
    { id: 'pataliputra', lab: 'w', era: 2, name: 'Pataliputra', state: 'BR', x: 576.0, y: 456.8, kind: 'vidya',
      renames: [{ era: 5, name: 'Patna' }],
      fact: 'Capital of the Mauryas. A Greek visitor named Megasthenes wrote home amazed at its wooden walls, said to run for miles along the Ganga.',
      works: ['a river fort', 'the wooden walls', 'the Mauryan capital entire'],
      ask: { q: 'Who wrote home amazed at Pataliputra\'s wooden walls?', o: ['Megasthenes, a Greek visitor', 'Xuanzang, a Chinese traveller', 'Marco Polo'] },
      more: ['At Kumhrar in today’s Patna, diggers found the stumps of a vast hall of eighty polished stone pillars — very likely where the Mauryan court gathered.',
             'The story goes that clever Chanakya guided young Chandragupta to build the empire from this city — and the Arthashastra, a book of statecraft, carries the teaching.',
             'The Buddha himself, the tellings say, crossed the Ganga at the little fort of Pataligrama and foretold the greatness of the city to come.',
             'Under the Guptas it was still the capital — the traveller Fa-hien found charitable houses here around 400 CE where the poor and the sick were cared for without charge.'
            ],
      asks: [{ q: 'What did diggers find at Kumhrar in old Pataliputra?', o: ['A hall of eighty stone pillars', 'A buried war fleet', 'A glass palace'] },
             { q: 'Who does the story say guided Chandragupta from Pataliputra?', o: ['Chanakya', 'Megasthenes', 'Tenali Rama'] },
             { q: 'What did the traveller Fa-hien find at Pataliputra around 400 CE?', o: ['Care for the sick, given without charge', 'A flying machine', 'A wall of solid iron'] }
            ],
      sources: ['NCERT, Our Pasts I, ch. on the Mauryas', 'Megasthenes’ Indica (as preserved in later Greek writers)', 'ASI Kumhrar excavations (the 80-pillared hall)', 'Faxian, A Record of Buddhistic Kingdoms (the charitable houses); Pataligrama telling (Katha frame)'] },
    { id: 'sanchi', era: 2, name: 'Sanchi', state: 'MP', x: 342.5, y: 531.0, kind: 'shilpa',
      fact: 'A great stone stupa begun in Ashoka’s time, its gateways crowded with carved stories — kept safe on its quiet hill for two thousand years.',
      works: ['a quiet hill', 'the stupa\'s dome', 'the carved gateways'],
      ask: { q: 'What stands on Sanchi\'s quiet hill?', o: ['A great stone stupa', 'A sun temple', 'A dockyard'] },
      more: ['A carving on the south gateway says it was the gift of the ivory-carvers of nearby Vidisha — a whole guild signing their work in stone.',
             'The stupa stood lost under trees for centuries and was found again in 1818; a hundred years on, John Marshall’s teams set it right, stone by patient stone.',
             'The chronicles of Sri Lanka say Ashoka’s own queen Devi was from nearby Vidisha — and that their children Mahendra and Sanghamitta carried the teaching from this land across the sea.'
            ],
      asks: [{ q: 'Who gave Sanchi’s south gateway, by its own carving?', o: ['The ivory-carvers of Vidisha', 'A Chinese emperor', 'The sailors of Sopara'] },
             { q: 'What happened to Sanchi for centuries before 1818?', o: ['It stood lost under the trees', 'It was a busy port', 'It was a royal mint'] },
             { q: 'Where do the chronicles say Mahendra and Sanghamitta carried the teaching?', o: ['To Sri Lanka', 'To Greece', 'To China'] }
            ],
      sources: ['ASI Sanchi; UNESCO World Heritage listing', 'NCERT, Our Pasts I', 'South gateway inscription (the gift of the ivory-workers of Vidisha)', 'Mahavamsa chronicles on Devi, Mahendra and Sanghamitta (as the chronicles tell it)'] },
    { id: 'dhauli', lab: 'w', era: 2, name: 'Dhauli', state: 'OR', x: 598.2, y: 644.0, kind: 'vidya',
      fact: 'By the Kalinga battlefield, Ashoka had his promises carved into the rock — that he would rule by care, not conquest. The letters are still there.',
      works: ['the river bend', 'the edict rock', 'the hill of the promises'],
      ask: { q: 'What did Ashoka have carved into the rock at Dhauli?', o: ['His promises to rule by care', 'A map of his empire', 'The rules of chess'] },
      more: ['Above the edicts, the front half of an elephant steps out of the living rock — among the earliest rock-cut sculpture in India, carved to draw eyes to the words below.',
             'The Dhauli edicts are special ones written to Ashoka’s own officers: all people are my children, they say — rule them with patience and care.',
             'On the hilltop above the old letters stands a white Peace Pagoda, raised in the 1970s by Japanese and Indian Buddhists — the old promise renewed in lime and concrete.'
            ],
      asks: [{ q: 'What steps out of the rock above Dhauli’s edicts?', o: ['The front half of an elephant', 'A stone tiger', 'A giant wheel'] },
             { q: 'In the Dhauli edicts, Ashoka tells his officers that all people are…', o: ['his children, to be ruled with care', 'his soldiers', 'his rivals'] }],
      sources: ['Ashokan rock edicts at Dhauli (ASI)', 'NCERT, Our Pasts I, ch. on Ashoka', 'Dhauli Shanti Stupa (1972, Kalinga Nippon Buddha Sangha)'] },
    { id: 'sopara', era: 2, name: 'Sopara', state: 'MH', x: 186.6, y: 670.3, kind: 'shilpa',
      fact: 'An ancient western port — ships left here for distant coasts, and a fragment of Ashoka’s own edicts was found in its soil.',
      works: ['a fishing harbour', 'the trade wharves', 'ships for distant coasts'],
      ask: { q: 'What was ancient Sopara?', o: ['A western port', 'A mountain fort', 'A university'] },
      more: ['In 1882 a digger opened Sopara’s old stupa mound and found caskets nested inside caskets — copper, silver, stone, crystal and gold — guarding relics laid down centuries before.',
             'Sailors across the sea knew this port’s name — old Greek trading handbooks list it among the harbours where India’s cloth and pepper could be bought.',
             'The old texts call it Shurparaka and make it the chief town of the northern Konkan — a port so old that Buddhist, Jain and Hindu tellings all pass through it.'
            ],
      asks: [{ q: 'What lay nested inside Sopara’s stupa mound?', o: ['Caskets within caskets, guarding relics', 'A chest of Roman swords', 'A stone chariot'] },
             { q: 'Who listed Sopara in their trading handbooks?', o: ['Greek sailors from across the sea', 'Chinese generals', 'Arctic whalers'] }],
      sources: ['ASI Sopara (Shurparaka) finds, incl. the VIII rock edict fragment', 'Periplus of the Erythraean Sea (as “Ouppara”)', 'Bhagwanlal Indraji’s 1882 stupa excavation (the nested relic caskets)', 'Shurparaka in early text traditions'] },

    /* — era 4 · Gupta / classical — */
    { id: 'nalanda', lab: 'e', era: 3, name: 'Nalanda', state: 'BR', x: 585.7, y: 473.0, kind: 'vidya',
      fact: 'A university with thousands of students and a library said to have towered stories high; the traveller Xuanzang came from China and stayed years.',
      works: ['a grove of teachers', 'the first halls', 'the towering library'],
      ask: { q: 'Who travelled from China to study at Nalanda?', o: ['Xuanzang', 'Megasthenes', 'Ibn Battuta'] },
      more: ['Xuanzang wrote that the gatekeeper questioned every would-be student, and many were turned away — an entrance exam at the very door, thirteen centuries ago.',
             'Students walked and sailed here from China, Korea, Tibet and Java — monks’ travel diaries are how we know the campus, hall by hall.',
             'Xuanzang heard its name explained as na-alam-da — “giving without a stop” — a place, the tellings say, that never refused a seeker.',
             'After centuries of silence, a new Nalanda University opened nearby in 2014 — the old name teaching again.'
            ],
      asks: [{ q: 'How did Nalanda choose its students, by Xuanzang’s telling?', o: ['Hard questions at the very gate', 'By height', 'By lottery'] },
             { q: 'From where did students travel to Nalanda?', o: ['China, Korea, Tibet and Java', 'Only the nearby villages', 'Rome and Athens'] },
             { q: 'What happened to Nalanda’s name in 2014?', o: ['A new university revived it nearby', 'It was given to a warship', 'It was retired forever'] }
            ],
      sources: ['Xuanzang’s account (Si-yu-ki), incl. the gate examinations', 'ASI Nalanda; UNESCO World Heritage listing', 'NCERT, Our Pasts I', 'Xuanzang on the name (as he heard it told); Nalanda University (reopened 2014)'] },
    { id: 'ajanta', era: 3, name: 'Ajanta', state: 'MH', x: 278.2, y: 631.8, kind: 'shilpa',
      fact: 'Caves cut into a river cliff and painted floor to ceiling — the Jataka tales in colour, still glowing in the dark after fifteen centuries.',
      works: ['the river cliff', 'the first cut caves', 'the painted halls'],
      ask: { q: 'What fills the caves of Ajanta?', o: ['Paintings of the Jataka tales', 'Chests of gold coins', 'Iron tools'] },
      more: ['The caves were forgotten for a thousand years until 1819, when a British hunting party chasing a tiger up the gorge looked up and saw a carved doorway in the cliff.',
             'There are about thirty caves, cut in two great waves centuries apart — the later painters could study the work of masters long dead, on the same cliff.',
             'The painters ground their colours from stones and earths — and the deep blue travelled in trade all the way from the lapis mountains of Afghanistan.'
            ],
      asks: [{ q: 'How were the Ajanta caves found again in 1819?', o: ['A hunting party saw a doorway in the cliff', 'A flood washed the cliff bare', 'A balloon drifted past'] },
             { q: 'The Ajanta caves were cut…', o: ['in two great waves, centuries apart', 'in a single year', 'by one sculptor alone'] },
             { q: 'Where did Ajanta’s deep blue colour travel from?', o: ['The lapis mountains of Afghanistan', 'The floor of the sea', 'Burnt sugar-cane'] }
            ],
      sources: ['ASI Ajanta; UNESCO World Heritage listing', 'NCERT, Our Pasts I', 'Pigment studies of the Ajanta murals (lapis lazuli imports)'] },
    { id: 'mathura', lab: 'e', era: 3, name: 'Mathura', state: 'UP', x: 340.4, y: 389.1, kind: 'shilpa',
      fact: 'The story goes that Krishna was born here. In the same city, workshops carved some of the most loved sculpture in India’s history.',
      works: ['a ford on the Yamuna', 'the workshops', 'the city of sculptors'],
      ask: { q: 'Mathura\'s workshops were famous across India for…', o: ['carved sculpture', 'silk sails', 'war chariots'] },
      more: ['A great standing statue of the Kushan emperor Kanishka was found near here — boots, long coat and sword, but the head lost long ago; it stands headless in Mathura’s museum still.',
             'Mathura’s carvers worked a spotted red sandstone you can recognise at a glance — their figures travelled out along the roads to adorn far cities.',
             'With Gandhara in the northwest, Mathura’s workshops shaped how the Buddha image itself first looked — two schools of carvers answering one impossible question: how do you carve compassion?'
            ],
      asks: [{ q: 'Mathura’s famous statue of Kanishka is missing…', o: ['its head', 'its feet', 'its sword'] },
             { q: 'Mathura’s carvers were known for working…', o: ['spotted red sandstone', 'green jade', 'white coral'] }],
      sources: ['Mathura school of sculpture (standard art-history literature)', 'Krishna tradition (Katha frame — the story, as it is told)', 'Government Museum, Mathura (the Kanishka statue)', 'Mathura–Gandhara Buddha-image scholarship (standard art history)'] },
    { id: 'madurai', lab: 's', era: 3, name: 'Madurai', state: 'TN', x: 354.5, y: 983.9, kind: 'vidya',
      fact: 'The old tellings say poets gathered here in academies called sangams; the Tamil poems of that age still name the streets, the traders, the sea.',
      works: ['a river town', 'the poets arrive', 'the sangam in session'],
      ask: { q: 'The old tellings say poets gathered at Madurai in…', o: ['sangam academies', 'stone circles', 'sea forts'] },
      more: ['One sangam poem, the Madurai-kanchi, walks the reader through the city’s whole day — the morning market, the evening drums, the lamps coming on street by street.',
             'At the city’s heart today rise the painted gopurams of the Meenakshi temple, crowded with a thousand bright figures — the fish-eyed goddess’s own city.',
             'The tellings say the city rose where drops of nectar fell from Shiva’s locks — madhura, the sweet city, named for that sweetness.',
             'Inside the temple is the hall the guides call thousand-pillared — rearing stone horses, and pillars that ring musical notes among them.'
            ],
      asks: [{ q: 'What does the poem Madurai-kanchi walk the reader through?', o: ['The city’s whole day, morning to lamps', 'A sea voyage', 'A recipe for sweets'] },
             { q: 'Whose great temple crowns Madurai today?', o: ['Meenakshi, the fish-eyed goddess', 'The sun god Surya', 'A Chola king'] },
             { q: 'What do the tellings say fell where Madurai was built?', o: ['Drops of nectar', 'A star', 'A golden fish'] }
            ],
      sources: ['Sangam literature corpus (e.g. Madurai-kanchi)', 'NCERT, Our Pasts I, ch. on the southern kingdoms', 'Madurai sthala purana (Katha frame); Meenakshi Amman temple literature'] },

    /* — era 5 · temples and the sea — */
    { id: 'mamallapuram', lab: 'e', era: 4, name: 'Mamallapuram', state: 'TN', x: 419.9, y: 896.3, kind: 'shilpa',
      fact: 'A Pallava harbour town where sculptors tried everything — temples shaped like chariots, a whole cliff carved into one crowded, joyful scene.',
      works: ['a shore village', 'the carvers\' yard', 'temples like chariots'],
      ask: { q: 'Some of Mamallapuram\'s temples are shaped like…', o: ['chariots', 'lotuses', 'elephants'] },
      more: ['The town is named for the Pallava king Narasimhavarman, called Mamalla — “the great wrestler” — whose carvers worked these shores.',
             'Just before the 2004 tsunami struck, the sea drew far back and bared old carved stones on the seabed — and afterwards diggers found carvings of an elephant and a flying horse under the sand.',
             'One giant boulder balances on a slope here — Krishna’s Butter Ball, which neither royal elephants nor engineers have ever managed to budge.'
            ],
      asks: [{ q: 'Mamallapuram is named for a king called Mamalla, meaning…', o: ['the great wrestler', 'the quiet fisherman', 'the star-counter'] },
             { q: 'What did the withdrawing sea bare at Mamallapuram in 2004?', o: ['Old carved stones on the seabed', 'A sunken submarine', 'A pearl mountain'] },
             { q: 'What is Krishna’s Butter Ball at Mamallapuram?', o: ['A giant boulder nothing can budge', 'A marble sweet', 'A temple bell'] }
            ],
      sources: ['ASI Mamallapuram; UNESCO World Heritage listing', 'NCERT, Our Pasts II', 'ASI / press reports on the 2004 tsunami finds', 'Krishna’s Butter Ball (Vaan Irai Kal), local record of failed attempts to move it'] },
    { id: 'thanjavur', era: 4, name: 'Thanjavur', state: 'TN', x: 386.7, y: 956.0, kind: 'vidya',
      fact: 'Rajaraja Chola raised a temple here so tall its shadow was a wonder of the age, and its walls carry the accounts of the whole kingdom, carved in stone.',
      works: ['the rice plain', 'the rising vimana', 'the great temple\'s shadow'],
      ask: { q: 'Who raised the great temple at Thanjavur?', o: ['Rajaraja Chola', 'Ashoka', 'Akbar'] },
      more: ['The temple’s own walls record its people like a ledger — four hundred dancers, two hundred musicians, priests, lamp-lighters, tailors — a whole city’s worth of names in stone.',
             'How the builders raised the mighty capstone to the tower’s top is still argued over — the favourite telling is a long earthen ramp, built for years and then carried away.',
             'Its Nandi is carved from a single stone, among the largest in the land — and in the tower’s hidden inner passage, Chola murals of Rajaraja’s own age were found under later paint.'
            ],
      asks: [{ q: 'What do the Thanjavur temple walls record, name by name?', o: ['Its dancers, musicians and workers', 'The kings of China', 'The rules of chess'] },
             { q: 'How do many say the temple’s capstone reached the top?', o: ['Up a long earthen ramp', 'By a hundred kites', 'It was carved in place'] },
             { q: 'What was found in the Thanjavur tower’s hidden passage?', o: ['Chola murals under later paint', 'A river running uphill', 'A library of iron books'] }
            ],
      sources: ['Brihadisvara temple inscriptions (ASI; the 400 dancers and 200 musicians are inscriptional)', 'UNESCO World Heritage listing', 'NCERT, Our Pasts II, ch. on the Cholas', 'The Chola murals found in the vimana passage (1931); the single-stone Nandi (temple literature)'] },
    { id: 'konark', lab: 'e', era: 4, name: 'Konark', state: 'OR', x: 606.2, y: 654.4, kind: 'shilpa',
      fact: 'The Sun temple — a whole shrine built as the sun god’s chariot, with carved stone wheels taller than a grown-up.',
      works: ['the shore site', 'the wheels take shape', 'the chariot of the sun'],
      ask: { q: 'Konark\'s Sun temple is built in the shape of…', o: ['the sun god\'s chariot', 'a giant lotus', 'a warship'] },
      more: ['The chariot’s twelve pairs of carved wheels are sundials — read the shadow on the right spoke and you can tell the time of day, as guides still show visitors.',
             'European sailors steering up this coast used the dark tower as a landmark and called it the Black Pagoda, to tell it from the white temple at Puri.',
             'Sailors’ lore said the tower once held a great lodestone that tugged ships’ compasses astray — a story the sea kept telling long after the tower fell.'
            ],
      asks: [{ q: 'What can Konark’s carved wheels do?', o: ['Tell the time, like sundials', 'Turn and roll', 'Ring like bells'] },
             { q: 'What did European sailors call Konark?', o: ['The Black Pagoda', 'The Glass Palace', 'The Iron Gate'] }],
      sources: ['ASI Konark; UNESCO World Heritage listing', 'NCERT, Our Pasts II', 'The lodestone of Konark (sailors’ lore — Katha frame, told as lore)'] },
    { id: 'muziris', lab: 'w', era: 4, name: 'Muziris', state: 'KL', x: 293.8, y: 973.9, kind: 'kheti',
      fact: 'The pepper port of the west — Roman writers grumbled about the gold their ships spent here, and a Tamil poem calls it the city where the ships come laden.',
      works: ['a pepper village', 'the wharves, busy', 'ships from across the sea'],
      ask: { q: 'What left Muziris for the wider world?', o: ['Pepper', 'Marble', 'Horses'] },
      more: ['One real Roman contract survives on papyrus for a ship’s cargo out of Muziris — pepper, ivory and cloth, worth a fortune, written down like any bill.',
             'Diggers at Pattanam, which many think was Muziris, keep finding shards of Roman wine jars — amphorae that crossed the whole sea for this market.',
             'A Tamil poem sings of the Yavana ships arriving with gold and leaving with pepper — the trade written down from the Indian shore’s own side.'
            ],
      asks: [{ q: 'What survives on a Roman papyrus about Muziris?', o: ['A ship’s cargo contract', 'A love song', 'A war plan'] },
             { q: 'What do diggers keep finding at Pattanam?', o: ['Shards of Roman wine jars', 'Viking helmets', 'Silk robes from Rome'] }],
      sources: ['Periplus of the Erythraean Sea; Pliny, Natural History', 'Akananuru 149 (the Muciri poem); Pattanam excavation literature (the identification is discussed)', 'The Muziris papyrus (P. Vindob. G 40822)', 'Akananuru 149 — the Yavana ships verse'] },

    /* — the later ages (eras 6–13). Same law as above: attested, sourced,
       framed by what was built and sung. Cities RENAME across the ages
       (renames[]) because that is the truth of Indian cities — Pataliputra
       answers to Patna, Kashi to Banaras to Varanasi — and older cities fold
       into memory as the ages turn (the engine's heritage rule). — */
    { id: 'delhi', lab: 'w', era: 5, name: 'Delhi', state: 'DL', x: 326.4, y: 347.0, kind: 'shilpa',
      fact: 'City upon city has risen on this ground beside the Yamuna. In this age the Qutb Minar goes up — a fluted stone tower taller than anything in the land, ringed by India’s first great arches and domes.',
      works: ['a fort town by the Yamuna', 'the bazaars of many tongues', 'the Qutb Minar touches the sky'],
      ask: { q: 'The Qutb Minar in Delhi is…', o: ['a very tall carved stone tower', 'a river bridge', 'a great bell'] },
      more: ['In the Qutb courtyard stands an iron pillar cast many centuries earlier that has barely rusted — metalworkers still study how the old smiths managed it.',
             'Delhi is not one city but many stacked in one place — the walls of seven cities and more stand among its streets, each raised by a different age.',
             'Ibn Battuta, who had crossed half the known world, served years as a judge here and counted the city among the greatest he had seen.',
             'The Qutb Minar itself grew in stages — begun by Aibak, finished by Iltutmish, mended after lightning by Tughlaq and Lodi hands — four dynasties in one tower.'
            ],
      asks: [{ q: 'What is strange about the iron pillar at the Qutb?', o: ['It has barely rusted in all these centuries', 'It floats above the ground', 'It hums at noon'] },
             { q: 'Why do people call Delhi many cities in one?', o: ['Age after age built its own city here', 'It has many airports', 'Its streets change names daily'] },
             { q: 'Which world traveller served as a judge in Delhi?', o: ['Ibn Battuta', 'Marco Polo', 'Megasthenes'] }
            ],
      sources: ['NCERT, Our Pasts II, ch. "The Delhi Sultans"', 'ASI Qutb complex literature; UNESCO World Heritage listing (1993)', 'Iron Pillar corrosion studies (IIT Kanpur / R. Balasubramaniam)', 'Ibn Battuta, Rihla (his Delhi years); Qutb Minar construction history (ASI)'] },
    { id: 'hampi', era: 6, name: 'Hampi', state: 'KA', x: 302.2, y: 806.9, kind: 'shilpa',
      fact: 'Capital of Vijayanagara, the City of Victory. Travellers wrote home in disbelief that its bazaars sold pearls and gems in open heaps — and the stone chariot still stands in the Vittala temple courtyard.',
      works: ['a river crossing among boulders', 'the long bazaars fill', 'the stone chariot of Vittala'],
      ask: { q: 'Hampi was the capital of…', o: ['Vijayanagara', 'Magadha', 'the Mauryas'] },
      more: ['King Krishnadevaraya, Vijayanagara’s greatest, wrote poetry himself — a whole Telugu poem on how a king should care for his people.',
             'Some pillars of the Vittala temple ring with musical notes when tapped — the guides’ favourite wonder, and the argument over how is half the fun.',
             'Domingo Paes, who knew Lisbon, wrote that Vijayanagara seemed as large as Rome and was the best-provisioned city he had ever seen.'
            ],
      asks: [{ q: 'What did King Krishnadevaraya of Hampi write?', o: ['A Telugu poem on caring for his people', 'A cookbook', 'A railway timetable'] },
             { q: 'What do some Vittala temple pillars do when tapped?', o: ['Ring with musical notes', 'Light up', 'Turn on their bases'] },
             { q: 'Visitors compared Vijayanagara’s size to…', o: ['Rome', 'A fishing village', 'The moon'] }
            ],
      sources: ['NCERT, Our Pasts II (Vijayanagara)', 'Travel accounts of Abdur Razzaq and Domingo Paes; UNESCO listing (1986)', 'Krishnadevaraya, Amuktamalyada (the rajadharma verses)', 'Domingo Paes (c. 1520), the Rome comparison'] },
    { id: 'agra', lab: 'e', era: 7, name: 'Agra', state: 'UP', x: 351.0, y: 400.4, kind: 'shilpa',
      fact: 'Shah Jahan raised the Taj Mahal here in memory of Mumtaz Mahal — some twenty years of work by thousands of craftsmen, white marble inlaid with flowers of coloured stone.',
      works: ['a garden city on the Yamuna', 'the marble workshops hum', 'the Taj Mahal, white on the river'],
      ask: { q: 'The Taj Mahal was built in memory of…', o: ['Mumtaz Mahal', 'a great victory', 'a river goddess'] },
      more: ['The Taj’s four minarets were built leaning a whisper outward — so that if an earthquake ever threw one down, it would fall away from the tomb, not onto it.',
             'Before the marble, Agra’s riverbank filled with gardens — the char bagh, a garden cut in four by water channels, came to its perfection here.',
             'The marble plays with the light — pinkish at dawn, white at noon, golden under the moon — and the builders knew the stone would do it.',
             'Across the river lie the moonlight garden’s foundations — the Mehtab Bagh, planted so the Taj could be watched by night.'
            ],
      asks: [{ q: 'Why do the Taj’s minarets lean slightly outward?', o: ['To fall away from the tomb in a quake', 'The builders ran out of rope', 'To catch more sunlight'] },
             { q: 'What is a char bagh, perfected at Agra?', o: ['A garden cut in four by water channels', 'A four-horse chariot', 'A four-stringed sitar'] },
             { q: 'How does the Taj’s marble behave through the day?', o: ['It changes colour with the light', 'It hums at noon', 'It grows warm like a stove'] }
            ],
      sources: ['NCERT, Our Pasts II', 'ASI Taj Mahal literature; UNESCO listing (1983)', 'ASI Taj Mahal literature (the minarets, the marble); Mehtab Bagh (ASI)'] },
    { id: 'amritsar', era: 7, name: 'Amritsar', state: 'PB', x: 252.0, y: 237.0, kind: 'kheti',
      fact: 'Founded by Guru Ram Das around a pool; in 1604 the Adi Granth was installed in Harmandir Sahib at its centre. In the langar everyone — anyone — eats together as equals, and the kitchen never closes.',
      works: ['a pool dug by many hands', 'the langar fires grow', 'Harmandir Sahib shines from its pool'],
      ask: { q: 'In the langar at Amritsar, everyone…', o: ['eats together as equals', 'pays according to rank', 'must bring their own food'] },
      more: ['Harmandir Sahib opens through four doors, one to each direction — kept so as a sign that every person, from every side, is welcome.',
             'Maharaja Ranjit Singh’s craftsmen later gilded the shrine’s upper storeys — the gold that gives the Golden Temple the name the world knows it by.',
             'The langar’s way of sitting has a name — pangat: one row on the floor, whoever you are, king or farmer, eating the same food together.'
            ],
      asks: [{ q: 'Why does Harmandir Sahib have four doors?', o: ['Welcome comes from every direction', 'To let the wind through', 'One for each season'] },
             { q: 'Where did the Golden Temple’s gold come from?', o: ['Ranjit Singh’s craftsmen gilded it', 'A fallen meteor', 'The sea floor'] },
             { q: 'What is pangat, kept in the langar at Amritsar?', o: ['Sitting in one row to eat as equals', 'A drum rhythm', 'A kind of sweet'] }
            ],
      sources: ['Sikh tradition as the community keeps it (docs/05 §4 — from the inside)', 'NCERT, Our Pasts II', 'Pangat and langar as the community keeps them (docs/05 §4 — from the inside)'] },
    { id: 'surat', era: 8, name: 'Surat', state: 'GJ', x: 187.6, y: 610.7, kind: 'shilpa',
      fact: 'The great port of its age — ships under many flags anchored in the Tapi, and a Surat merchant’s letter of credit was honoured in harbours half the world away.',
      works: ['a river-mouth anchorage', 'the warehouses fill', 'the great wharves of the world'],
      ask: { q: 'Surat was famous as…', o: ['a great trading port', 'a hill fortress', 'a mountain shrine'] },
      more: ['Shipwrights on the Tapi built ocean-going ships of good teak so well that even foreign captains ordered theirs here.',
             'When the English and Dutch first came to trade, their first warehouses in India — their “factories” — went up in Surat.',
             'Pilgrims for Mecca took ship from its wharves for centuries — the city was called Bab-ul-Mecca, the gate of Mecca.'
            ],
      asks: [{ q: 'What did Surat’s shipwrights build?', o: ['Ocean-going teak ships', 'Ice boats', 'Paper canoes'] },
             { q: 'What did English and Dutch traders first raise at Surat?', o: ['Their first Indian warehouses', 'Lighthouses', 'Universities'] },
             { q: 'Why was Surat called Bab-ul-Mecca?', o: ['Pilgrims sailed for Mecca from here', 'Its gates were plated in gold', 'It stood on a holy mountain'] }
            ],
      sources: ['NCERT, Our Pasts II, ch. "Towns, Traders and Crafts-persons" (Surat)', 'Seventeenth-century travel accounts (Ovington and others)', 'Bab-ul-Mecca in Mughal-era accounts of Surat'] },
    { id: 'mumbai', lab: 's', era: 9, name: 'Bombay', state: 'MH', x: 187.7, y: 686.5, kind: 'shilpa',
      renames: [{ era: 12, name: 'Mumbai' }],
      fact: 'Seven islands joined into one city. In 1853 Asia’s first passenger train steamed from here to Thane — thirty-four kilometres that changed the whole country — and its great station is now a world monument.',
      works: ['seven islands, one harbour', 'the mills and docks roar', 'the great railway station opens'],
      ask: { q: 'India’s first passenger train ran from Bombay to…', o: ['Thane', 'Delhi', 'Madras'] },
      more: ['The seven islands were stitched into one by decades of causeways and land-filling — people quite literally made the ground the city stands on.',
             'In 1913 Dadasaheb Phalke showed Raja Harishchandra here — India’s first full-length film, and the seed of one of the biggest film industries on Earth.',
             'Every working day the dabbawalas move lunchboxes by the hundred thousand across the city by train and bicycle, sorted by a code of paint and letters, with hardly ever a mistake.'
            ],
      asks: [{ q: 'How did Bombay’s seven islands become one?', o: ['People filled the sea between them', 'An earthquake joined them', 'The tide never came back'] },
             { q: 'What began with Raja Harishchandra in 1913?', o: ['Indian cinema', 'The postal service', 'Test cricket'] },
             { q: 'What do Mumbai’s dabbawalas deliver each day?', o: ['Lunchboxes by the hundred thousand', 'Only newspapers', 'Fishing nets'] }
            ],
      sources: ['Indian Railways history (Bombay–Thane, 1853)', 'NCERT, India and the Contemporary World; UNESCO listing for the terminus (2004)', 'Phalke, Raja Harishchandra (1913)', 'The Mumbai dabbawala system (widely documented; Harvard case study)'] },
    { id: 'kolkata', lab: 'e', era: 9, name: 'Calcutta', state: 'WB', x: 677.9, y: 562.4, kind: 'vidya',
      renames: [{ era: 12, name: 'Kolkata' }],
      fact: 'The city of presses and colleges — books and newspapers in Bengali, Hindi, Urdu, English and more went out from here to be read aloud in courtyards across the land.',
      works: ['a river landing', 'College Street fills with books', 'the Howrah Bridge spans the Hooghly'],
      ask: { q: 'Calcutta became famous for…', o: ['printing books and newspapers in many languages', 'mining gold', 'carving marble'] },
      more: ['In 1857 the University of Calcutta opened its doors — among the first modern universities in Asia, with Bombay and Madras the same year.',
             'College Street’s pavements are one endless second-hand bookshop — stall after stall, where a patient reader can find nearly anything the city ever printed.',
             'Rabindranath Tagore of this city became the first non-European to win the Nobel Prize in Literature, in 1913.',
             'Trams have rattled through its streets since 1902 — among the oldest electric tram lines in all of Asia.'
            ],
      asks: [{ q: 'What opened in Calcutta in 1857?', o: ['One of Asia’s first modern universities', 'The first cinema hall', 'A space centre'] },
             { q: 'What fills College Street in Kolkata?', o: ['Second-hand book stalls, without end', 'Boat builders', 'Kite factories'] },
             { q: 'Which honour came to Kolkata’s Tagore in 1913?', o: ['The Nobel Prize in Literature', 'The first flight over Everest', 'An Olympic gold'] }
            ],
      sources: ['NCERT, India and the Contemporary World II (print culture)', 'Howrah Bridge (1943) engineering records', 'University of Calcutta (est. 1857)', 'Nobel Prize in Literature 1913 (Tagore); Calcutta Tramways (electric from 1902)'] },
    { id: 'ahmedabad', lab: 'w', era: 10, name: 'Ahmedabad', state: 'GJ', x: 179.4, y: 546.9, kind: 'vidya',
      fact: 'On the Sabarmati’s bank here stood the ashram from which Gandhi walked to the sea at Dandi in 1930 — twenty-four days on foot, to pick up a handful of salt that everyone had been forbidden to make.',
      works: ['a weaving city', 'the mills and the ashram', 'the ashram by the river, kept as it was'],
      ask: { q: 'From the ashram at Ahmedabad, Gandhi walked to Dandi to…', o: ['make salt from the sea', 'climb a mountain', 'catch a train'] },
      more: ['A stone window in the Sidi Saiyyed mosque here is carved as a tree with curving branches, so fine it looks like lace — carvers still measure themselves against it.',
             'Its cotton mills once earned it the name “Manchester of India” — and the mill-workers’ city is where Gandhi chose to root his ashram.',
             'In 2017 the old walled city — its pols, gates and carved wooden havelis — became India’s first UNESCO World Heritage City.'
            ],
      asks: [{ q: 'The famous Sidi Saiyyed window is carved as…', o: ['a tree, fine as lace', 'a ship in full sail', 'a map of the world'] },
             { q: 'Ahmedabad’s cotton mills earned it the name…', o: ['Manchester of India', 'Venice of the East', 'City of Lakes'] },
             { q: 'What did Ahmedabad’s walled city become in 2017?', o: ['India’s first World Heritage City', 'A film studio', 'A new state capital'] }
            ],
      sources: ['NCERT, India and the Contemporary World II (Civil Disobedience, 1930)', 'Sabarmati Ashram Preservation and Memorial Trust', 'Sidi Saiyyed mosque (1573) — the jali', 'UNESCO World Heritage City listing: Historic City of Ahmadabad (2017)'] },
    { id: 'chandigarh', era: 11, name: 'Chandigarh', state: 'CH', x: 312.2, y: 270.6, kind: 'shilpa',
      fact: 'A brand-new city, planned on a blank sheet for the young Republic — wide green sectors, and an Open Hand monument that means "open to give, open to receive".',
      works: ['a plan on paper', 'the sectors rise', 'the Open Hand turns in the wind'],
      ask: { q: 'Chandigarh’s Open Hand means…', o: ['open to give, open to receive', 'stop here', 'a famous king lived here'] },
      more: ['In a corner of the planned city, a roads inspector named Nek Chand secretly built a garden of figures from broken bangles and crockery — his Rock Garden is now the city’s best-loved wonder.',
             'The city’s plan reads like a body — the Capitol its head, the green belts its lungs, the bazaars its heart — that is how its planners described it.',
             'In 2016 its Capitol buildings joined the World Heritage list as part of Le Corbusier’s work across seven countries — the young Republic’s architecture honoured worldwide.'
            ],
      asks: [{ q: 'What did Nek Chand build in secret at Chandigarh?', o: ['A garden of figures from broken things', 'A private railway', 'A lighthouse'] },
             { q: 'Chandigarh’s planners described their city as…', o: ['a body — head, lungs and heart', 'a ship at anchor', 'a chessboard'] }],
      sources: ['Chandigarh Capitol Complex records (the Le Corbusier plan)', 'UNESCO World Heritage listing (2016)', 'Nek Chand Rock Garden Trust', 'UNESCO listing: The Architectural Work of Le Corbusier (2016)'] },
    { id: 'bengaluru', era: 12, name: 'Bengaluru', state: 'KA', x: 337.9, y: 884.7, kind: 'vidya',
      fact: 'The garden city became India’s city of new ideas — from the great science institute founded with Jamsetji Tata’s gift in 1909, to the software that now runs screens across the world.',
      works: ['a garden town of lakes', 'the labs and campuses multiply', 'the city of a million screens'],
      ask: { q: 'Bengaluru is best known today as a city of…', o: ['science and software', 'sea trade', 'marble carving'] },
      more: ['The old telling says Kempegowda founded the town in 1537 and raised four watchtowers at its edges — the growing city swallowed them whole long ago.',
             'India’s space agency has its headquarters here — the missions to the Moon and Mars are steered from rooms in this city.',
             'The name’s favourite telling: an old woman fed a lost king boiled beans, and he gratefully called the place benda-kaalu-ooru — boiled-beans town.'
            ],
      asks: [{ q: 'Who does the old telling say founded Bengaluru in 1537?', o: ['Kempegowda', 'Ashoka', 'A Chola admiral'] },
             { q: 'What is steered from Bengaluru’s mission rooms?', o: ['India’s craft at the Moon and Mars', 'The world’s shipping lanes', 'The monsoon'] },
             { q: 'What does the boiled-beans telling say about Bengaluru’s name?', o: ['An old woman’s beans fed a lost king', 'It was named for a bell foundry', 'A bean market stood here'] }
            ],
      sources: ['Indian Institute of Science history (founded 1909)', 'docs/16 takeoff-era sources (the Itihaas pack)', 'Kempegowda tradition (Katha frame); ISRO HQ, Bengaluru', 'The benda-kaalu-ooru telling (Katha frame — a story of the name)'] },
    { id: 'sriharikota', lab: 'e', era: 12, name: 'Sriharikota', state: 'AP', x: 421.3, y: 859.7, kind: 'vidya',
      fact: 'A quiet island of casuarina trees that became India’s doorway to space — in 1980 an Indian rocket rose from here and set the satellite Rohini into the sky, and the countdowns have never stopped.',
      works: ['an island of casuarina', 'the assembly halls rise', 'the launch tower, lit for countdown'],
      ask: { q: 'Sriharikota is India’s…', o: ['rocket launch island', 'biggest port', 'oldest city'] },
      more: ['Rockets leave here flying east over the open sea — the spin of the Earth gives every launch a free push, and only water lies under the flight path.',
             'In 2023 Chandrayaan-3 rose from this island and set its lander down near the Moon’s south pole — the first craft from any nation to reach there.',
             'The island sits between the sea and Pulicat lake, loud with birds — flamingoes share this coast with rockets.'
            ],
      asks: [{ q: 'Why do Sriharikota’s rockets fly east over the sea?', o: ['Earth’s spin helps, and only water lies below', 'The wind always blows east', 'To wave at the ships'] },
             { q: 'What did Chandrayaan-3 do in 2023?', o: ['Landed near the Moon’s south pole, a world first', 'Orbited the Sun', 'Carried tourists'] }],
      sources: ['ISRO: SLV-3 and Rohini (18 July 1980); Satish Dhawan Space Centre SHAR', 'ISRO: Chandrayaan-3 landing (23 August 2023)', 'Pulicat lake sanctuary literature (the flamingo coast)'] }
  ],

  /* DARSHAN — the great ones pass through, and the world receives them.
     These are VISITATIONS, never player pieces: no stats, no owning, no
     spending a person (docs/05: rulers and the sacred are people and faiths,
     not tokens; the app-wide rule is "deeds, not numbers"). Each fires once,
     as a card with its frame badge — 🪔 katha, told as it is told; 📜
     itihaas, attested — its sources, and one gentle boon the player never
     controls. Krishna's card is the KATHAKARS SINGING of Krishna: the
     telling is the event, which is both the honest frame and the beautiful
     one. */
  darshan: [
    { id: 'buddha', era: 1, site: 'kashi', frame: 'itihaas',
      name: 'The Buddha teaches at Sarnath',
      text: 'Near Kashi, in the deer park at Sarnath, the Buddha gives his first teaching — a middle way between too harsh and too soft, and kindness to every living thing.',
      boon: { kind: 'peace', katha: 40 }, boonLine: 'Every quarrel in the land is quietly set down · +40 📜',
      sources: ['NCERT, Our Pasts I (the Buddha); Sarnath, as Buddhist tradition keeps it'] },
    { id: 'mahavira', era: 1, site: 'vaishali', frame: 'itihaas',
      name: 'Mahavira walks from Vaishali',
      text: 'Born near Vaishali, Mahavira teaches ahimsa — that no living thing, however small, is yours to harm.',
      boon: { kind: 'calm', len: 40 }, boonLine: 'The wilds rest — no raids for a long while.',
      sources: ['NCERT, Our Pasts I (Jainism); Jain tradition, from the inside'] },
    { id: 'krishna', era: 3, site: 'mathura', frame: 'katha',
      name: 'The kathakars sing of Krishna',
      text: 'In Mathura tonight the kathakars sing of Krishna — the stolen butter, the flute across the river, the mountain lifted like an umbrella. The whole town stays up to listen.',
      boon: { kind: 'shine', katha: 40 }, boonLine: 'Every fading lamp in the land steadies · +40 📜',
      sources: ['The Bhagavata katha tradition, as it is told'] },
    { id: 'aryabhata', era: 3, site: 'pataliputra', frame: 'itihaas',
      name: 'Aryabhata counts the sky',
      text: 'At Pataliputra, Aryabhata writes his verses of mathematics and stars — that the earth turns, and how to reckon with zero.',
      boon: { kind: 'katha', katha: 60 }, boonLine: '+60 📜 — a teaching for every gurukul',
      sources: ['Aryabhatiya (499 CE); NCERT mathematics history'] },
    { id: 'kabir', era: 6, site: 'kashi', frame: 'katha',
      name: 'Kabir sings at his loom',
      text: 'In Banaras, Kabir weaves and sings — short dohas that pin the biggest truths to the smallest things. Weavers, farmers and kings all end up repeating them.',
      boon: { kind: 'katha', katha: 50 }, boonLine: '+50 📜 — the dohas travel every road',
      sources: ['The dohas of Kabir, in the Bhakti tradition; NCERT, Our Pasts II (devotional paths)'] },
    { id: 'nanak', era: 7, site: 'amritsar', frame: 'itihaas',
      name: 'Guru Nanak’s songs are gathered',
      text: 'Guru Nanak walked and sang across the land: one human family, honest work, share what you have. At Amritsar his words are gathered and kept, and the langar seats everyone together.',
      boon: { kind: 'anna', anna: 80 }, boonLine: '+80 🌾 — the langar feeds every town',
      sources: ['Sikh tradition, from the inside (docs/05 §4); NCERT, Our Pasts II'] },
    { id: 'gandhi', era: 10, site: 'ahmedabad', frame: 'itihaas',
      name: 'The salt march sets out',
      text: 'From the ashram by the Sabarmati, Gandhi walks twenty-four days to the sea and picks up a handful of salt. A quiet act, understood by a whole country at once.',
      boon: { kind: 'shine', katha: 60 }, boonLine: 'Every dusty town in the land brightens · +60 📜',
      sources: ['NCERT, India and the Contemporary World II (Civil Disobedience, 1930)'] },
    { id: 'kalam', era: 12, site: 'sriharikota', frame: 'itihaas',
      name: 'The countdown at Sriharikota',
      text: 'Dr Kalam and his teams count down India’s own rockets — failures first, then wings. He spends the rest of his life telling children to dream bigger than their circumstances.',
      boon: { kind: 'katha', katha: 60 }, boonLine: '+60 📜 — a whole generation looks up',
      sources: ['ISRO SLV-3 programme (1980); A. P. J. Abdul Kalam, Wings of Fire'] }
  ],


  /* KHAZANA — one treasure hidden in every living city: a REAL artifact of
     that place (sourced like everything else), tucked somewhere on the city
     plate. The folk whisper a hint; a faint glint gives it away to a patient
     eye; and a city's khazana can only be found WHILE IT LIVES — when the
     ages fold a town into memory, an unfound treasure sleeps with it. x,y
     are percent positions on the diorama plate. */
  treasures: {
    dholavira:   { name: 'The great signboard', x: 50, y: 30,
      hint: 'Ten giant signs once crowned the north gate. Look above the gateway.',
      what: 'Ten large symbols of cut white stone — perhaps the world\u2019s oldest big sign. Nobody alive can read it. Yet.',
      src: 'ASI Dholavira excavations (the north-gate signboard)' },
    lothal:      { name: 'A carnelian necklace', x: 42, y: 58,
      hint: 'The bead-makers dropped one near the great basin\u2019s edge.',
      what: 'Tiny drilled carnelian beads, polished to fire — Lothal\u2019s beads travelled to lands their makers never saw.',
      src: 'ASI Lothal excavations (bead factory and drills)' },
    rakhigarhi:  { name: 'A clay toy cart', x: 55, y: 62,
      hint: 'Some child left it by the granary steps, four thousand years ago.',
      what: 'A little terracotta cart with turning wheels — proof that Harappan children played exactly the way you do.',
      src: 'Harappan terracotta toy carts (NCERT, Our Pasts I)' },
    kalibangan:  { name: 'The ploughed-field clod', x: 48, y: 52,
      hint: 'In the crossed furrows themselves — the oldest field keeps a piece of itself.',
      what: 'A preserved clod from the world\u2019s earliest excavated ploughed field, its criss-cross furrows still readable.',
      src: 'ASI Kalibangan excavations (the ploughed field)' },
    hastinapura: { name: 'A painted grey bowl', x: 46, y: 48,
      hint: 'By the citadel stair — thin as an eggshell, grey as a monsoon sky.',
      what: 'Painted Grey Ware — the fine grey pottery of the age the epics remember; archaeologists found it right here.',
      src: 'B. B. Lal, Hastinapura excavations (PGW)' },
    kashi:       { name: 'A thread of banarasi silk', x: 40, y: 55,
      hint: 'Where the weavers\u2019 lane meets the ghats, a gold thread catches the lamp-light.',
      what: 'A single zari thread — Kashi has woven cloth-of-light for as long as anyone can count.',
      src: 'The Banarasi weaving tradition; NCERT crafts chapters' },
    ujjain:      { name: 'A punch-marked coin', x: 52, y: 60,
      hint: 'Dropped in the bazaar where the great roads cross.',
      what: 'A small silver coin stamped with punches — among India\u2019s first money, and Ujjain sat on the crossroads it travelled.',
      src: 'Punch-marked coinage of the janapadas (NCERT)' },
    vaishali:    { name: 'The lion pillar\u2019s polish', x: 55, y: 42,
      hint: 'Touch the pillar north of the hall — glass-smooth after two thousand monsoons.',
      what: 'The Mauryan pillar at Kolhua still carries its mirror polish — a finish nobody has fully re-created since.',
      src: 'ASI Kolhua (Vaishali) pillar; Mauryan polish literature' },
    pataliputra: { name: 'A wall-timber of the old city', x: 45, y: 40,
      hint: 'Under the palace wharf — the old walls were WOOD, and the mud kept them.',
      what: 'A preserved timber from Pataliputra\u2019s wooden ramparts, exactly as Greek visitors described them.',
      src: 'Bulandi Bagh excavations (timber palisade); Megasthenes\u2019 account' },
    sanchi:      { name: 'A carved lotus medallion', x: 48, y: 45,
      hint: 'Fallen from the oldest railing, face-down in the grass by the path.',
      what: 'A lotus roundel from the stupa railing — the carvers of Sanchi filled stone with flowers for two hundred years.',
      src: 'ASI Sanchi; the stupa railing carvings' },
    dhauli:      { name: 'The elephant\u2019s gentle eye', x: 50, y: 44,
      hint: 'Climb to the rock and look at the elephant from its own height.',
      what: 'Up close, the Dhauli elephant\u2019s eye is carved soft and kind — a message with no words at all.',
      src: 'ASI Dhauli rock-cut elephant' },
    sopara:      { name: 'The relic casket', x: 47, y: 50,
      hint: 'The old stupa mound kept a secret at its heart for two thousand years.',
      what: 'Sopara\u2019s stupa held nested caskets — stone, then copper, then silver, then gold — found intact in 1882.',
      src: 'Bhagwanlal Indraji, Sopara stupa excavation (1882); CSMVS collection' },
    nalanda:     { name: 'The university\u2019s seal', x: 50, y: 46,
      hint: 'Every letter Nalanda sent went out stamped. One sealing fell by the gate.',
      what: 'A clay sealing reading of the venerable community of monks of great Nalanda — the university\u2019s own signature.',
      src: 'ASI Nalanda excavations (monastic sealings)' },
    ajanta:      { name: 'A shell of lapis pigment', x: 44, y: 40,
      hint: 'A painter set down a shell of blue by the cave mouth and never came back for it.',
      what: 'The blues of Ajanta came from lapis lazuli carried over the mountains — paint worth its weight in silver.',
      src: 'Ajanta pigment analyses (ASI conservation literature)' },
    mathura:     { name: 'A red sandstone hand', x: 46, y: 55,
      hint: 'In the sculptors\u2019 yard, one perfect hand waits for a statue that moved on.',
      what: 'Mathura\u2019s spotted red sandstone travelled the whole north as finished gods — this hand stayed home.',
      src: 'Mathura school sculpture (Government Museum, Mathura)' },
    madurai:     { name: 'A sangam palm-leaf', x: 48, y: 47,
      hint: 'A poem slipped from the pavilion bundle. The ants have spared it, so far.',
      what: 'A palm-leaf strip of Tamil verse — the sangam poems lived on leaves like this for centuries before paper.',
      src: 'Palm-leaf transmission of the Sangam corpus' },
    mamallapuram:{ name: 'An unfinished chisel-line', x: 52, y: 48,
      hint: 'On the last chariot\u2019s flank — the mason stopped mid-stroke, seven centuries ago.',
      what: 'Several of the shore monuments were never finished — the half-cut lines teach carvers to this day.',
      src: 'ASI Mamallapuram (the unfinished monoliths)' },
    thanjavur:   { name: 'A casting-bell of bronze', x: 45, y: 52,
      hint: 'By the caster\u2019s pit south of the tower, a test-bell rings true.',
      what: 'Before pouring a god, Chola casters poured little bells — if the bell sang, the bronze was ready.',
      src: 'Chola bronze-casting (lost-wax) tradition' },
    konark:      { name: 'The wheel\u2019s shadow-clock', x: 50, y: 50,
      hint: 'Stand at the great wheel when the sun is out, and read it.',
      what: 'The spokes of Konark\u2019s stone wheels work as sundials — the temple IS the chariot of time.',
      src: 'ASI Konark; the wheel-dial readings' },
    muziris:     { name: 'A Roman gold coin', x: 46, y: 56,
      hint: 'The pepper-scales swallowed one aureus. The mud remembers where.',
      what: 'Hoards of Roman gold have been dug from this coast — the pepper trade pulled coins across the whole world.',
      src: 'Roman coin hoards of the Malabar coast; Pattanam excavations' },
    delhi:       { name: 'The pillar that will not rust', x: 55, y: 48,
      hint: 'In the courtyard stands iron older than the tower — touch it: no rust.',
      what: 'The Mehrauli iron pillar has stood sixteen centuries nearly rust-free — metallurgy the world still studies.',
      src: 'The Mehrauli iron pillar (Gupta period); IIT metallurgical studies' },
    hampi:       { name: 'A gem-seller\u2019s weighing pan', x: 47, y: 58,
      hint: 'In the long bazaar, one brass pan still smells of rosewater.',
      what: 'Travellers wrote that Hampi\u2019s bazaars weighed pearls and rubies in open heaps, like grain.',
      src: 'Paes and Razzaq travel accounts of Vijayanagara' },
    agra:        { name: 'A jade inlay petal', x: 48, y: 44,
      hint: 'One petal fell from the inlayers\u2019 tray and hides by the reflecting pool.',
      what: 'The Taj\u2019s flowers are stone set in stone — carnelian, jade and lapis cut to petals thinner than a coin.',
      src: 'Parchin kari inlay of the Taj Mahal (ASI)' },
    amritsar:    { name: 'The langar\u2019s great ladle', x: 44, y: 55,
      hint: 'In the kitchen that never closes, the oldest ladle hangs by the door.',
      what: 'A ladle long enough to stir a cauldron that feeds thousands — the langar\u2019s true regalia.',
      src: 'The langar tradition of Harmandir Sahib, from the inside' },
    surat:       { name: 'A merchant\u2019s hundi', x: 49, y: 52,
      hint: 'Folded into the warehouse ledger — paper worth a ship\u2019s cargo.',
      what: 'A hundi — a paper promise honoured across oceans. Surat\u2019s credit notes moved fortunes without moving a coin.',
      src: 'The hundi system (NCERT, Our Pasts II — towns and traders)' },
    mumbai:      { name: 'A first-day train ticket', x: 44, y: 50,
      hint: 'Dropped on platform one, April 1853, and swept into a crack.',
      what: 'A pasteboard ticket from the first passenger run to Thane — four hundred people rode into a new age.',
      src: 'Indian Railways history (Bombay\u2013Thane, 16 April 1853)' },
    kolkata:     { name: 'A brass type of \u0995', x: 50, y: 55,
      hint: 'One letter of the Bengali alphabet rolled under the press.',
      what: 'A single piece of movable Bengali type — with a few hundred of these, a room could talk to a million people.',
      src: 'The Serampore/Calcutta type foundries; NCERT print culture' },
    ahmedabad:   { name: 'A charkha spindle', x: 46, y: 50,
      hint: 'On the ashram veranda, a spindle still holds an arm\u2019s length of thread.',
      what: 'A slim iron spindle from a charkha — the quiet machine that became a flag.',
      src: 'Sabarmati Ashram collection' },
    chandigarh:  { name: 'The Open Hand blueprint', x: 50, y: 46,
      hint: 'A drawing escaped the architects\u2019 office and blew against the plaza fence.',
      what: 'A blueprint sheet of the Open Hand — a city drawn before it existed, down to this very monument.',
      src: 'Chandigarh Capitol Complex archives' },
    bengaluru:   { name: 'A punched program card', x: 48, y: 52,
      hint: 'Behind the institute\u2019s tower, a card full of tiny rectangular holes.',
      what: 'A punched card — programs were once stacks of these, and dropping the stack was a catastrophe children today are spared.',
      src: 'Early computing at Indian institutes (IISc history)' },
    sriharikota: { name: 'The countdown logbook page', x: 47, y: 48,
      hint: 'Near the pad, a page of numbers counting backwards to zero.',
      what: 'A hand-kept countdown log from the early launches — ten, nine, eight, written by nervous, hopeful hands.',
      src: 'ISRO SLV-3 programme records' }
  },

  /* SUTRAS — the threads through the ages (the founder's ask: story ARCS).
     A sutra is a presence that keeps returning, era after era, one bead at a
     time: each beat fires as a card (in order, at its own era and city), the
     thread draws as a mala filling bead by bead, and a finished mala pays a
     pitara draw. Editorial law holds bead by bead: every beat sourced; a
     debated reading SAYS it is debated on the card (the Pashupati seal, the
     Ghaggar-Hakra river); the sacred is framed from inside and never played
     with; and threads touching faith carry review:true for the named human
     reviewer (docs/05 §6) on top of this file's needs_review. */
  sutras: [
    { id: 'pashupati', name: 'The Lord of Animals', review: true, beats: [
      { era: 0, site: 'lothal', frame: 'itihaas',
        text: 'A trader’s seal comes down the river to Lothal: a horned figure seated cross-legged, animals gathered round. What did its maker mean? The clay keeps that secret. Many, centuries later, would see Pashupati here — Shiva, lord of animals — already seated. Scholars still debate it; the seal just smiles.',
        src: 'The Mohenjo-daro "Pashupati" seal — Marshall’s proto-Shiva reading (1931), widely debated since; NCERT, Our Pasts I (seals)' },
      { era: 1, site: 'kashi', frame: 'itihaas',
        text: 'By the rivers, the singers sing to Rudra — the storm, the healer, the wild one who is also kind. Kashi will keep his name close for three thousand years.',
        src: 'The Rigveda’s hymns to Rudra, as the tradition transmits them; NCERT, Our Pasts I' },
      { era: 4, site: 'thanjavur', frame: 'itihaas',
        text: 'In bronze, the lord of animals now dances. The Chola casters make Nataraja — one foot raised, the drum and the flame in balance — and many call it the most beautiful thing ever cast in metal.',
        src: 'Chola bronze Nataraja tradition; museum and iconography literature; NCERT' },
      { era: 5, site: 'kashi', frame: 'itihaas',
        text: 'Pilgrims walk to Banaras as they always have — the city of Shiva, lamps going down the dark river. The name on the maps changes; the walking never stops.',
        src: 'The continuous pilgrimage tradition of Kashi/Banaras; NCERT, Our Pasts II (devotional paths)' },
      { era: 12, site: 'bengaluru', frame: 'katha',
        text: 'On a morning bus between two glass offices, somebody hums Om Namah Shivaya, the way somebody always has. The oldest face of this thread, still riding along.',
        src: 'Living devotional practice, told as it is lived (🧭 Aaj)' } ] },

    { id: 'walkers', name: 'The Walkers', review: true, beats: [
      { era: 1, site: 'kashi', frame: 'itihaas',
        text: 'The Buddha’s teaching travels at walking pace — down every road out of Sarnath, carried by people on foot with begging bowls, for five hundred years before anyone carves it in stone.',
        src: 'NCERT, Our Pasts I (the Buddha and the sangha); Sarnath tradition' },
      { era: 1, site: 'vaishali', frame: 'itihaas',
        text: 'Mahavira walks barefoot from Vaishali, watching where he steps so that nothing small is crushed. The walk itself is the teaching.',
        src: 'NCERT, Our Pasts I (Jainism); Jain tradition, from the inside' },
      { era: 4, site: 'kashi', frame: 'itihaas',
        text: 'A young teacher from Kerala walks the whole map — north, south, east, west — and the tradition remembers a school of learning founded at each corner. It remembers him as Adi Shankara, and it remembers the WALK as the point.',
        src: 'The matha traditions (Sringeri, Puri, Dwarka, Jyotirmath), as tradition keeps them' },
      { era: 7, site: 'amritsar', frame: 'itihaas',
        text: 'Guru Nanak walks farther than almost anyone of his age — by tradition to the far corners of the map and beyond — singing that there is one human family and honest work is worship.',
        src: 'The janamsakhi tradition of the udasis, from the inside; NCERT, Our Pasts II' },
      { era: 10, site: 'ahmedabad', frame: 'itihaas',
        text: 'Gandhi walks twenty-four days to the sea for a handful of salt. And look at your own map: the explorer you have been sending into the mist all game walks in this same long line.',
        src: 'NCERT, India and the Contemporary World II (the salt march, 1930)' } ] },

    { id: 'tellers', name: 'The Tellers', beats: [
      { era: 1, site: 'vaishali', frame: 'itihaas',
        text: 'Nothing is written down yet, and nothing is lost: in the assemblies and courtyards, the reciters carry whole oceans of story by heart, checking each other line by line.',
        src: 'Oral transmission of the early texts; NCERT, Our Pasts I' },
      { era: 3, site: 'madurai', frame: 'itihaas',
        text: 'At the sangam of Madurai the poets read aloud to each other, and the Tamil anthologies they leave behind still name the bees, the hills and the heartbreaks of two thousand years ago.',
        src: 'The Sangam anthologies (Akananuru, Purananuru); NCERT' },
      { era: 6, site: 'kashi', frame: 'katha',
        text: 'Kabir weaves and sings, and his dohas travel out of Banaras in every direction without a single book — pinned to memory by rhyme, repeated by weavers, farmers and kings.',
        src: 'The dohas of Kabir, Bhakti tradition; NCERT, Our Pasts II' },
      { era: 9, site: 'kolkata', frame: 'itihaas',
        text: 'The presses of Calcutta put the old tales into print in a dozen tongues — and a story that once needed a teller in the room can now wait quietly in a satchel for a child to find it.',
        src: 'NCERT, India and the Contemporary World II (print culture)' },
      { era: 12, site: 'bengaluru', frame: 'katha',
        text: 'The stories ride screens now — and the newest teller in this whole unbroken line is holding one right now. Yes: you. Tell somebody one.',
        src: 'The app’s own frame — the child as the next teller (🧭 Aaj)' } ] },

    { id: 'annapurna', name: 'Annapurna’s Kitchen', review: true, beats: [
      { era: 0, site: 'rakhigarhi', frame: 'itihaas',
        text: 'The biggest buildings the first towns raise are not palaces — they are storehouses for grain, built so that a bad year does not become a hungry one.',
        src: 'Harappan storehouse structures (their exact use is studied and discussed); NCERT, Our Pasts I' },
      { era: 1, site: 'kashi', frame: 'katha',
        text: 'In Kashi they tell of Annapurna, the giver of food, from whose kitchen no one is turned away — even Shiva holds out his bowl to her. A city that tells that story feeds its pilgrims.',
        src: 'The Annapurna katha of Kashi, as it is told' },
      { era: 7, site: 'amritsar', frame: 'itihaas',
        text: 'At Amritsar the langar seats everyone in the same row on the same floor — a king beside a farmer, anyone beside everyone — and the kitchen simply never closes.',
        src: 'The langar tradition, from the inside (docs/05 §4); NCERT, Our Pasts II' },
      { era: 11, site: 'amritsar', frame: 'itihaas',
        text: 'New seeds and shared science come to Punjab’s fields, and a country that once feared famine begins to fill its own storehouses again — the oldest promise of this thread, kept with tractors.',
        src: 'The Green Revolution in Punjab (1960s); NCERT economics chapters' } ] },

    { id: 'starcounters', name: 'The Star-Counters', beats: [
      { era: 1, site: 'ujjain', frame: 'itihaas',
        text: 'On a flat roof in Ujjain, watchers line a bronze rod against the night sky and write down what returns. Counting the sky becomes an Indian habit early.',
        src: 'Ujjain’s ancient astronomical tradition (the prime meridian of Indian astronomy); NCERT' },
      { era: 3, site: 'pataliputra', frame: 'itihaas',
        text: 'Aryabhata writes that the earth turns, and shows how to reckon with zero — verses of mathematics a student can sing.',
        src: 'Aryabhatiya (499 CE); NCERT mathematics history' },
      { era: 8, site: 'delhi', frame: 'itihaas',
        text: 'At Delhi, a king of Jaipur builds instruments the size of buildings — stairways that climb to nowhere and measure everything. The sky, counted in stone.',
        src: 'Jantar Mantar, Delhi (Sawai Jai Singh II, c. 1724); ASI' },
      { era: 12, site: 'sriharikota', frame: 'itihaas',
        text: 'India’s first satellite goes up carrying the old star-counter’s name — Aryabhata — and from Sriharikota the counting continues, now from the other side of the sky.',
        src: 'ISRO: Aryabhata (1975), SLV-3/Rohini (1980)' } ] },

    { id: 'hands', name: 'The Hands', beats: [
      { era: 0, site: 'dholavira', frame: 'itihaas',
        text: 'Every brick in every Harappan town follows one recipe — the same proportions, city after city, before anyone wrote a single rule down. The hands agreed.',
        src: 'The standardized Harappan brick ratio; NCERT, Our Pasts I' },
      { era: 2, site: 'sanchi', frame: 'itihaas',
        text: 'On a gateway at Sanchi, the carvers leave a signature — a guild of ivory-workers from the nearby town, proud enough of their stone to put their trade on it.',
        src: 'The Sanchi south gateway inscription of the ivory-carvers of Vidisha; ASI' },
      { era: 4, site: 'thanjavur', frame: 'itihaas',
        text: 'The Chola casters pour bronze into a mould of wax and clay that must be broken to open — so every bronze is one of one, and the hands must be sure.',
        src: 'The lost-wax (cire perdue) casting of the Chola bronzes' },
      { era: 7, site: 'agra', frame: 'itihaas',
        text: 'At Agra the inlayers set flowers of carnelian and jade into white marble, petal by petal — work so fine you must touch it to believe it is stone in stone.',
        src: 'Parchin kari (pietra dura) inlay of the Taj Mahal; ASI' },
      { era: 11, site: 'chandigarh', frame: 'itihaas',
        text: 'The material is concrete now and the drawings come from far away — but the shuttering, the finishing, the pride of a true edge: the same hands, five thousand years on.',
        src: 'The construction of Chandigarh’s Capitol Complex (1950s)' } ] },

    { id: 'river', name: 'The River', review: true, beats: [
      { era: 0, site: 'kalibangan', frame: 'itihaas',
        text: 'The wide river beside Kalibangan is thinning. Many scholars read the dry bed of the Ghaggar-Hakra as the reason whole towns eventually walked away — the reading is debated, but this much is sure: in this land, the rivers decide.',
        src: 'Ghaggar-Hakra palaeochannel studies (its identification with the Sarasvati is debated); NCERT, Our Pasts I' },
      { era: 1, site: 'kashi', frame: 'katha',
        text: 'To those who love her, Ganga is not water but a mother who came down from the sky — and at Kashi her lamps go out on the current every single evening.',
        src: 'The Ganga avatarana katha, as it is told; living arti tradition' },
      { era: 9, site: 'kolkata', frame: 'itihaas',
        text: 'The river carries bridges now: at Calcutta the Hooghly — Ganga by another name — takes a road of steel across her back without a single pier in the water.',
        src: 'Howrah Bridge (1943) engineering records' },
      { era: 11, site: 'chandigarh', frame: 'itihaas',
        text: 'The young Republic asks the rivers to light its lamps: at Bhakra the Sutlej turns turbines, and villages that never had a bulb switch one on.',
        src: 'Bhakra-Nangal project (dedicated 1963); NCERT' } ] }
  ]
};
