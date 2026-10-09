/* Bizzing India — MITHU'S LAMPS, the Sabhyata campaign (docs/specs/sabhyata-master.md Part F).

   THE FACTS ARE NOT HERE. Every line of history a chapter shows is a REFERENCE into
   data-sabhyata.js — `site.fact`, `site.more.N`, `eras.N.aha`, `treasures.site` — and the
   engine reads it, with that entry's own sources[], at the moment it is shown. Nothing in
   this file can drift from the sourced data, because nothing in this file is a fact.

   What IS here, and is labelled as invented on screen: the guides (an ordinary made-up person
   of the age — "Kesar is made up. Lothal is real."), Mithu's hooks (the owner-approved text of
   the storyline, each backed by the refs listed beside it), the order of the beats, and the
   riddles' wording — whose answers and "that was Lothal" distractors each name the data line
   they come from (tools/check-sabhyata.js `camp-facts` resolves every one).

   Chapters 3–13 are listed for the lamp-map as "coming". Chapters 3, 6, 8, 9, 10, 11 and 12
   carry reviewer flags (master, Reviewer checklist) and do not open outside tester mode even
   once they are built.

   Plain script, no modules, no build. */
window.IND_SABHYATA_CAMPAIGN = {
  v: 1,
  needs_review: true,
  /* what is on in each chapter is the onboarding ladder — one new system a chapter */
  chapters: [
    {
      n: 1, id: 'c1', era: 0, title: 'The First Cities', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: false,
      anchor: 'dholavira',
      guide: { id: 'kesar', name: 'Kesar', place: 'lothal', mood: 'bead',
        who: 'about 11, a bead-maker’s daughter from the coast near Lothal — quick hands, slow patience',
        note: 'We don’t know what the people of these cities called themselves or their children — nobody can read their script yet. We’ve called her Kesar.' },
      hook: 'Squawk — apprentice! Look at my old lamp-map. Every lamp is a real place, and every lamp is dark, because Vismriti, the grey mist, has made the land forget. A lamp wakes when someone reaches it and tells its story. Our first is Dholavira — a planned stone city on an island in the Rann. It caught the rain in great stone reservoirs, in a land with almost none. Kesar is waiting at the gate. Shall we light the first lamp?',
      hookRefs: ['dholavira.fact'],
      preset: {
        awake: ['dholavira'], foundAsleep: [], unfound: ['lothal', 'rakhigarhi', 'kalibangan'],
        heritage: [], capital: null, routes: [], techs: [], riti: [],
        res: { anna: 60, kala: 60, katha: 20 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city'],
      raidPool: ['mist'],
      turns: 40,
      win: { awake: ['dholavira', 'lothal', 'rakhigarhi', 'kalibangan'], routed: ['dholavira', 'lothal', 'rakhigarhi', 'kalibangan'] },
      goal: 'Wake all four first cities, and join each one to a road.',
      beats: [
        { id: 'gate', on: 'start', who: 'kesar',
          say: 'This is the gate. Look at the water they kept — all of it caught from the rain.',
          ref: 'dholavira.more.1', riddle: 'c1r1' },
        { id: 'explorer', on: 'after:gate', who: 'mithu',
          say: 'Somewhere south, the sea. Send an explorer — twenty anna of food for the road.' },
        { id: 'lothal', on: 'awake:lothal', who: 'kesar',
          say: 'Home! Come and see the workshops.',
          ref: 'lothal.fact', riddle: 'c1r2' },
        { id: 'mist', on: 'found:kalibangan', who: 'mithu', mist: 'kalibangan',
          say: 'A road keeps the mist off. Hurry, gently.',
          warn: 'mist' },
        { id: 'field', on: 'routed:kalibangan', who: 'kesar',
          say: 'The furrows still cross in the ground. Somebody walked behind a plough right here.',
          ref: 'kalibangan.fact', riddle: 'c1r3' },
        { id: 'largest', on: 'awake:rakhigarhi', who: 'mithu',
          say: 'The last lamp of this age, and the biggest town of them all.',
          ref: 'rakhigarhi.fact', ref2: 'rakhigarhi.more.1' },
        { id: 'ship', on: 'win', who: 'kesar',
          say: 'Look — a cargo leaving the basin. Ships will matter later. Remember this one.',
          ref: 'lothal.more.0' }
      ],
      riddles: [
        { id: 'c1r1', site: 'dholavira', q: 'What did Dholavira build to keep its water?',
          a: 'Great stone reservoirs, stepped one into the next', aRef: 'dholavira.more.1',
          o: [ { t: 'A great brick basin for ships', why: 'that was Lothal', ref: 'lothal.fact' },
               { t: 'A canal dug from the Ganga' } ] },
        { id: 'c1r2', site: 'lothal', q: 'Lothal’s workshops made something so tiny a whole necklace can pass through a bangle. What?',
          a: 'Carnelian beads', aRef: 'lothal.more.0',
          o: [ { t: 'Painted grey bowls', why: 'that is a later age, at Hastinapura', ref: 'hastinapura.more.1' },
               { t: 'Spotted red sandstone statues', why: 'that is Mathura, much later', ref: 'mathura.more.1' } ] },
        { id: 'c1r3', site: 'kalibangan', q: 'What does the name Kalibangan mean?',
          a: 'Black bangles', aRef: 'kalibangan.more.0',
          o: [ { t: 'Black river' }, { t: 'Bangle-makers’ town' } ] }
      ],
      payoff: { aha: 'eras.0.aha', souvenir: 'treasures.dholavira',
        guideBye: 'Keep the signboard safe for me. One day somebody will read it.' }
    },
    {
      n: 2, id: 'c2', era: 1, title: 'Rivers and Kingdoms', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: false,
      anchor: 'hastinapura',
      guide: { id: 'megh', name: 'Megh', place: 'kashi', mood: 'river',
        who: 'about 70, a ferryman who has crossed the Ganga more times than he can count',
        note: 'Megh is made up. The river, and these towns, are real.' },
      hook: 'Iron came, and the forests opened, and people followed the rivers east. Four places sleep along the new roads. The story goes that Hastinapura was the Pandavas’ capital — and under the village today is a real mound, dug layer by careful layer. Kashi on the Ganga has woken beside the river for three thousand years. And in Vaishali, hundreds sat together and voted! But the rivers rise in this age. Megh knows the water. Let’s go.',
      hookRefs: ['eras.0.aha', 'hastinapura.fact', 'kashi.fact', 'vaishali.fact'],
      preset: {
        awake: ['hastinapura'], foundAsleep: [], unfound: ['kashi', 'ujjain', 'vaishali'],
        heritage: ['dholavira', 'lothal', 'rakhigarhi', 'kalibangan'], capital: null, routes: [],
        techs: ['plough', 'brick', 'weights', 'reservoir'], riti: ['grama'],
        /* the master drafted kala 80; three roads are 90 and no ch-2 job makes craft, so the
           purse holds four roads' worth — the chapter can always be finished */
        res: { anna: 70, kala: 120, katha: 20 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs'],
      jobs: ['kisan', 'rakshak'],
      raidPool: ['boar', 'flood', 'locust', 'mist'],
      turns: 45, star: 30,
      win: { awake: ['hastinapura', 'kashi', 'ujjain', 'vaishali'], network: ['hastinapura', 'kashi', 'ujjain', 'vaishali'] },
      goal: 'Wake the four river towns and join them into one road network.',
      beats: [
        { id: 'ferry', on: 'start', who: 'megh',
          say: 'Kashi is that way, downriver. People have been waking up beside this river there for three thousand years.',
          ref: 'kashi.fact' },
        { id: 'watch', on: 'after:ferry', who: 'mithu',
          say: 'A watch, not an army. Nobody here is ever hurt. In a city, the People shelf has two jobs this age: kisan feed everyone, and a rakshak keeps watch and earns nothing.',
          raid: { id: 'boar', at: 'hastinapura', in: 4 } },
        { id: 'kashi', on: 'awake:kashi', who: 'megh',
          say: 'Listen to the bells across the water.',
          ref: 'kashi.more.0', riddle: 'c2r3' },
        { id: 'vaishali', on: 'awake:vaishali', who: 'megh',
          say: 'Hundreds of them in one hall, and every one allowed to speak.',
          ref: 'vaishali.fact', riddle: 'c2r2' },
        { id: 'flood', on: 'after:vaishali', who: 'megh',
          say: 'The river is in a hurry today. Put hands on the bunds at Hastinapura.',
          raid: { id: 'flood', at: 'hastinapura', in: 4 } },
        { id: 'mound', on: 'struck:flood', who: 'megh',
          say: 'The old story says the river took the town once. The diggers say so too.',
          ref: 'hastinapura.more.0', riddle: 'c2r1' },
        { id: 'ujjain', on: 'awake:ujjain', who: 'mithu',
          say: 'Where the trade roads met — and, much later, where the star-watchers drew their line.',
          ref: 'ujjain.fact' },
        { id: 'back', on: 'win', who: 'megh',
          say: 'Rivers carry people. Next, they’ll carry words.' }
      ],
      riddles: [
        { id: 'c2r1', site: 'hastinapura', q: 'What did diggers find in Hastinapura’s mound that matches the old story?',
          a: 'A thick flood layer', aRef: 'hastinapura.more.0',
          o: [ { t: 'Great stone reservoirs', why: 'that was Dholavira', ref: 'dholavira.fact' },
               { t: 'A brick dockyard', why: 'that was Lothal', ref: 'lothal.fact' } ] },
        { id: 'c2r2', site: 'vaishali', q: 'How did the Licchavis of Vaishali run their city?',
          a: 'By assembly — hundreds arguing and voting', aRef: 'vaishali.fact',
          o: [ { t: 'By one king’s word alone' }, { t: 'By whoever owned the most land' } ] },
        { id: 'c2r3', site: 'kashi', q: 'What happened at Sarnath, just outside Kashi?',
          a: 'The Buddha gave his very first teaching', aRef: 'kashi.more.0',
          o: [ { t: 'Ashoka was crowned' }, { t: 'A great reservoir was cut into the rock' } ] }
      ],
      payoff: { aha: 'eras.1.aha', souvenir: 'treasures.hastinapura',
        guideBye: 'Keep the bowl out of the rain. It has seen enough of rivers.' }
    },
    /* the lamps still to be made — on the map as "coming", never playable until built and,
       where flagged, signed by the named reviewer (master Part F, Reviewer checklist) */
    { n: 3,  era: 2,  title: 'The Great Sabha',       status: 'coming', review: true,  anchor: 'dhauli',    guide: { name: 'Ila' } },
    { n: 4,  era: 3,  title: 'The Age of Wonder',     status: 'coming', review: false, anchor: 'nalanda',   guide: { name: 'Nilu' } },
    { n: 5,  era: 4,  title: 'Temples and the Sea',   status: 'coming', review: false, anchor: 'muziris',   guide: { name: 'Kayal' } },
    { n: 6,  era: 5,  title: 'Domes and Minars',      status: 'coming', review: true,  anchor: 'delhi',     guide: { name: 'Hira' } },
    { n: 7,  era: 6,  title: 'The City of Victory',   status: 'coming', review: false, anchor: 'hampi',     guide: { name: 'Malli' } },
    { n: 8,  era: 7,  title: 'Gardens and Marble',    status: 'coming', review: true,  anchor: 'agra',      guide: { name: 'Bahar' } },
    { n: 9,  era: 8,  title: 'Sails and Factories',   status: 'coming', review: true,  anchor: 'surat',     guide: { name: 'Moti' } },
    { n: 10, era: 9,  title: 'Railways and Presses',  status: 'coming', review: true,  anchor: 'kolkata',   guide: { name: 'Roshni' } },
    { n: 11, era: 10, title: 'The Freedom Age',       status: 'coming', review: true,  anchor: 'ahmedabad', guide: { name: 'Dhara' } },
    { n: 12, era: 11, title: 'The Young Republic',    status: 'coming', review: true,  anchor: 'chandigarh', guide: { name: 'Akash' } },
    { n: 13, era: 12, title: 'The Takeoff',           status: 'coming', review: false, anchor: 'sriharikota', guide: { name: 'Kiran' } }
  ]
};
