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

   ALL THIRTEEN ARE BUILT AND OPEN TO EVERY CHILD. Chapters 3, 6, 8, 9, 10, 11 and 12 carry
   reviewer flags (master, Reviewer checklist) and KEEP `review: true`: no named reviewer has
   signed them. The owner opened them to everyone on 9 Oct 2026 ("open them all to everyone now,
   like the gita") — that is the publisher's decision, recorded in each chapter's `open`, never a
   sign-off — and every such chapter says so on its card and its start screen: "Not yet checked
   by a reviewer — opened by the family who made this app." A flagged chapter WITHOUT an `open`
   record still opens only in tester mode (tools/check-sabhyata.js `camp-open`).

   The reviewer checklist's defaults stay as content constraints, open or not: darshan cards are
   told, never boons; no chapter's raidPool names a human raid; Kalinga and Ashoka's words never
   reach ages 4–7; living temples, Harmandir Sahib and the Taj are never a monument to build here;
   the Qutb is a tower and a pillar and nothing else; the colonial ages face fire, cyclone and mist
   only, and only from age 8; freedom comes without violence and Partition is not told; Chandigarh's
   origin is not told. Chapters 4–13 are for 8 and up (`age: 8`, master F, age bands).

   What a chapter says that the data does NOT hold was cut, not typed: master Part F's
   [NEEDS SOURCE] list. Where a beat wanted one of those (a date, a carver's name, the Dandi
   march's days), the beat says nothing historical and lets its `ref` speak. Cut or reworded
   against the master draft, for the reviewer:
     ch 3   "the same words reached Sopara" → his edicts reached it, a piece found in the soil
            (the data says a fragment); no claim that Dhauli's letters are Brahmi; the lion
            distractor is "a lion on a pillar" (the data never says four faces); Ashoka is
            never quoted.
     ch 4   Xuanzang "came", not "walked"; the granary that "softens the locusts" (untrue of the
            game too).
     ch 5   Mamallapuram is "across on the other coast", not "up the coast"; no monsoon craft
            beyond the age's own aha; Rome only in told lines.
     ch 6   no height, no dates for the stages or the lightning; the four dynasties only as
            builders, in the data's words.
     ch 7   no goods of the bazaar but pearls and gems; "a restless realm is pushed harder" (untrue).
     ch 8   no Taj years, no founding year for Amritsar; the Taj and Harmandir Sahib are never
            built here; the langar's ladle is not the keepsake.
     ch 9   no years for the warehouses; no Company.
     ch 10  Roshni is "an apprentice to a printer", not placed on College Street; "Asia's first
            passenger train", as the data says, not "India's"; no first printing date.
     ch 11  no Dandi dates, no "Britain ruled India…", no satyagraha, no 15 August — the ending
            is the age's own note; the salt answer is the data's own words.
     ch 12  no construction dates or planners' names; placement waits for Chandigarh's board.
     ch 13  no ISRO founding date, no Mangalyaan, nothing of Dr Kalam beyond his darshan; "a phone
            in nearly every hand" is not used; the countdown is Kiran's line, not a mechanic.

   Plain script, no modules, no build. */
window.IND_SABHYATA_CAMPAIGN = {
  v: 1,
  needs_review: true,
  /* PLACES OF WORSHIP AND A TOMB ARE NEVER A MONUMENT TO BUILD in the campaign (master F, ch 5
     and ch 8 reviewer flags): they are woken and told. The monument verb stays on everywhere
     else, and whether it should ever apply to a living shrine is the reviewer's question. */
  noMonument: ['kashi', 'madurai', 'mamallapuram', 'thanjavur', 'konark', 'hampi', 'agra', 'amritsar'],
  /* LINES A BAND DOES NOT SEE in the campaign — the city's own telling card, its wake card and
     its teacher's questions skip them (docs/05 §3; master F ch 1, ch 3, ch 4, ch 5): Dholavira's
     long drying and the 2004 tsunami are for 11–12; Kalinga is never for 4–7; Madurai's temple
     lines are told from the inside to 11–12. `<site>.q.N` is the site's Nth teacher question. */
  withhold: {
    '4-7':  ['dholavira.more.3', 'dhauli.fact', 'mamallapuram.more.1', 'mamallapuram.q.2',
             'madurai.more.1', 'madurai.more.2', 'madurai.more.3', 'madurai.q.2', 'madurai.q.3'],
    '8-10': ['dholavira.more.3', 'mamallapuram.more.1', 'mamallapuram.q.2',
             'madurai.more.1', 'madurai.more.2', 'madurai.more.3', 'madurai.q.2', 'madurai.q.3']
  },
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
    /* ---- the lamps of the later ages (master Part F, chapters 3–13) ----
       PRESET FIELDS (E1): `awake` wakes free with its card still to read (ch 1–2); `live` is
       carried in from the chapter before — found, awake, already told; `heritage: 'rest'` is every
       earlier place not otherwise named, awake and lit with its monument shown (E11); `techs` and
       `riti: 'before'` are every door of the earlier ages; `mon` and `lv` carry a raised monument
       and a grown city in. `doors`, `ritiDoors` and `pols` are the only Vidya and Riti a chapter
       shows (E2). `win` is the chapter's goal, part by part (E5), and Mithu leads to each part. */
    {
      n: 3, id: 'c3', era: 2, title: 'The Great Sabha', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: true,
      open: { to: 'everyone', by: 'owner', on: '2026-10-09', why: 'opened by the publisher before review, like the Gita' },
      anchor: 'dhauli',
      guide: { id: 'ila', name: 'Ila', place: 'dhauli', mood: 'stone',
        who: 'about 20, an apprentice who cuts letters into stone — she cares about one thing: that a letter is cut deep enough to outlast her',
        note: 'Ila is made up — nobody knows the names of the hands that cut these letters. Dhauli is real.' },
      hook: 'One vast realm, run from Pataliputra — a city whose wooden walls a Greek visitor wrote home about. Its king had his promises carved into rock, and above the letters at Dhauli the front half of an elephant steps out of the stone to make you look. His edicts reached all the way to Sopara, a port on the other sea, where a piece of them was found in the soil. Ila cuts letters into stone. Can we carry the words from coast to coast?',
      /* the age's own note says "one vast realm" (hookRefs are provenance, never shown) */
      hookRefs: ['eras.2.note', 'pataliputra.fact', 'eras.1.aha', 'dhauli.more.0', 'sopara.fact'],
      preset: {
        live: ['pataliputra', 'hastinapura', 'kashi', 'ujjain', 'vaishali'],
        routes: [['hastinapura', 'kashi'], ['kashi', 'vaishali'], ['kashi', 'ujjain']],
        unfound: ['sanchi', 'dhauli', 'sopara'],
        heritage: 'rest', capital: 'pataliputra',
        techs: 'before', riti: 'before',
        res: { anna: 80, kala: 90, katha: 50 }
      },
      /* ages 4–7 (master F, age bands): the Edicts come already learned, and there is no tree */
      byBand: { '4-7': { systemsOff: ['vidya'], techs: ['script', 'edict'] } },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'vidya'],
      doors: ['script', 'edict'],
      jobs: ['kisan', 'rakshak'],
      raidPool: ['boar', 'elephant', 'flood', 'locust', 'mist'],
      turns: 45,
      win: { techs: ['script', 'edict'], awake: ['sanchi', 'dhauli', 'sopara'],
             network: ['pataliputra', 'sanchi', 'dhauli', 'sopara'] },
      goal: 'Learn the script and then the edicts, and join Pataliputra by road to both seas — Dhauli in the east, Sopara in the west, by way of Sanchi.',
      beats: [
        { id: 'capital', on: 'start', who: 'mithu',
          say: 'Pataliputra already glows — the capital of this whole realm. Look what a visitor from Greece wrote home about.',
          ref: 'pataliputra.fact', ref2: 'pataliputra.more.0' },
        { id: 'doors', on: 'after:capital', who: 'mithu',
          say: 'This age has a school, and its school has doors. Open Vidya: first the script, then the edicts. Written down, a question travels.',
          byBand: { '4-7': { say: 'This age writes things down. Your realm already knows the script and the edicts — so let’s go and find where the words were cut.' } } },
        { id: 'rock', on: 'awake:dhauli', who: 'ila',
          say: 'Here is the rock. Read what the king promised, right here.',
          ref: 'dhauli.fact', riddle: 'c3r1',
          byBand: { '4-7': { say: 'Here is the rock. Look up — something is stepping out of the stone above the letters.', ref: 'dhauli.more.0' } } },
        { id: 'herd', on: 'after:rock', who: 'mithu',
          say: 'The forest edge is crashing — a herd has found the stores. A watch on the gate at Dhauli: drums and lanterns, and a clear path out.',
          raid: { id: 'elephant', at: 'dhauli', in: 4 } },
        { id: 'eye', on: 'struck:elephant', who: 'ila',
          say: 'Look up. The elephant on the rock is gentler than that lot.',
          ref: 'dhauli.more.0', riddle: 'c3r2' },
        { id: 'edicts', on: 'learned:edict', who: 'mithu',
          say: 'Words cut where everyone passes: every woken city earns one more katha now. Watch the lamps tick up together.',
          ref: 'eras.1.aha' },
        { id: 'sanchi', on: 'awake:sanchi', who: 'ila',
          say: 'A whole guild put its name on this gateway. I would sign mine too.',
          ref: 'sanchi.fact', ref2: 'sanchi.more.0', riddle: 'c3r3' },
        { id: 'sopara', on: 'awake:sopara', who: 'mithu',
          say: 'The other sea! A piece of the king’s edicts was found right here, in the soil.',
          ref: 'sopara.fact' },
        { id: 'both', on: 'win', who: 'ila',
          say: 'Words at both ends of the road. That is what a letter is for.' }
      ],
      riddles: [
        /* Kalinga is in this line's data, so it is never asked of ages 4–7 (docs/05 §3) */
        { id: 'c3r1', site: 'dhauli', bands: ['8-10', '11-12'], q: 'What did Ashoka have carved into the rock at Dhauli?',
          a: 'His promises to rule by care, not conquest', aRef: 'dhauli.fact',
          o: [ { t: 'A map of all his roads' }, { t: 'The names of every town in the realm' } ] },
        { id: 'c3r2', site: 'dhauli', q: 'What steps out of the rock above Dhauli’s edicts?',
          a: 'The front half of an elephant', aRef: 'dhauli.more.0',
          o: [ { t: 'A lion on a pillar', why: 'that is Ashoka’s lion capital at Sarnath, near Kashi', ref: 'kashi.more.0' },
               { t: 'A great stone wheel', why: 'that is Konark, much later', ref: 'konark.fact' } ] },
        { id: 'c3r3', site: 'sanchi', q: 'Who gave Sanchi’s south gateway, by its own carving?',
          a: 'The ivory-carvers of Vidisha', aRef: 'sanchi.more.0',
          o: [ { t: 'The sailors of Sopara' },
               { t: 'The bead-makers of Lothal', why: 'they drilled carnelian beads, long before', ref: 'lothal.more.0' } ] }
      ],
      payoff: { aha: 'eras.2.aha', souvenir: 'treasures.dhauli',
        guideBye: 'Keep the elephant’s eye where you can see it. A message with no words at all.' }
    },
    {
      n: 4, id: 'c4', era: 3, title: 'The Age of Wonder', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: false, age: 8,
      anchor: 'nalanda',
      guide: { id: 'nilu', name: 'Nilu', place: 'ajanta', mood: 'colour',
        who: 'about 13, an apprentice who grinds colours for the painters, blue to the elbows — he wants to see Nalanda’s library and isn’t sure they’ll let him past the gate',
        note: 'Nilu is made up. Ajanta and Nalanda are real.' },
      hook: 'This age has a university so famous that a traveller called Xuanzang came all the way from China and stayed for years. But you couldn’t just walk in — the gatekeeper asked hard questions, and many were turned away! Far to the west, painters filled cliff-caves with stories in colour, and their deep blue travelled all the way from the lapis mountains of Afghanistan. Nilu grinds those colours. Let’s build a gurukul at Nalanda and answer its teacher.',
      hookRefs: ['nalanda.fact', 'nalanda.more.0', 'ajanta.fact', 'ajanta.more.2'],
      preset: {
        live: ['pataliputra', 'sanchi', 'dhauli', 'sopara', 'kashi'],
        routes: [['kashi', 'pataliputra'], ['pataliputra', 'dhauli'], ['pataliputra', 'sanchi'], ['sanchi', 'sopara']],
        unfound: ['nalanda', 'ajanta', 'mathura', 'madurai'],
        heritage: 'rest', capital: 'pataliputra',
        techs: 'before', riti: 'before',
        res: { anna: 100, kala: 100, katha: 60 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow'],
      raidPool: ['elephant', 'flood', 'locust', 'mist'],
      turns: 45,
      win: { awake: ['nalanda', 'ajanta', 'mathura', 'madurai'], network: ['nalanda', 'ajanta', 'mathura', 'madurai'],
             bld: { nalanda: ['gurukul'] }, teacher: { at: 'nalanda', about: 3 } },
      goal: 'Wake Nalanda, Ajanta, Mathura and Madurai on one road, build a gurukul at Nalanda, and answer its teacher right about three different cities.',
      beats: [
        { id: 'gate', on: 'awake:nalanda', who: 'mithu',
          say: 'Nalanda! Thousands of students, and a library said to have towered stories high. Today I am the gatekeeper.',
          ref: 'nalanda.fact', ref2: 'nalanda.more.0', riddle: 'c4r1' },
        { id: 'build', on: 'after:gate', who: 'mithu',
          say: 'You can build inside a city now, and every price is on the board before you choose. A gurukul gives one more katha a turn — and its teacher takes questions.' },
        { id: 'cliff', on: 'awake:ajanta', who: 'nilu',
          say: 'My cliff. Every wall painted, floor to ceiling — and the blue is the best part.',
          ref: 'ajanta.fact', ref2: 'ajanta.more.2', riddle: 'c4r2' },
        { id: 'swarm', on: 'after:cliff', who: 'mithu',
          say: 'A brown cloud over the fields! Rakshaks on the gate at Pataliputra, and everyone with a pan to beat.',
          raid: { id: 'locust', at: 'pataliputra', in: 4 } },
        { id: 'red', on: 'awake:mathura', who: 'nilu',
          say: 'The carvers here work a red stone with spots in it. You can tell it anywhere.',
          ref: 'mathura.fact', ref2: 'mathura.more.1', riddle: 'c4r3' },
        { id: 'south', on: 'awake:madurai', who: 'mithu',
          say: 'Far south — Madurai, where the old tellings gather the poets together.',
          ref: 'madurai.fact', ref2: 'madurai.more.0' },
        { id: 'exam', on: 'built:nalanda.gurukul', who: 'mithu',
          say: 'The gate exam. Nalanda’s teacher will ask about the cities you have woken — in this age or any before it. Three different cities, answered right, and Nilu is in.' },
        { id: 'in', on: 'win', who: 'nilu',
          say: 'Giving without a stop. They didn’t turn me away.',
          ref: 'nalanda.more.2' }
      ],
      riddles: [
        { id: 'c4r1', site: 'nalanda', q: 'How did Nalanda choose its students, by Xuanzang’s telling?',
          a: 'The gatekeeper asked hard questions at the door', aRef: 'nalanda.more.0',
          o: [ { t: 'By the town they came from' }, { t: 'By how far they had walked' } ] },
        { id: 'c4r2', site: 'ajanta', q: 'Where did Ajanta’s deep blue colour travel from?',
          a: 'The lapis mountains of Afghanistan', aRef: 'ajanta.more.2',
          o: [ { t: 'The river clay below the cliff' }, { t: 'Seashells from the western coast' } ] },
        { id: 'c4r3', site: 'mathura', q: 'Mathura’s carvers worked a stone you can recognise at a glance. Which?',
          a: 'Spotted red sandstone', aRef: 'mathura.more.1',
          o: [ { t: 'White marble', why: 'that is Agra, much later', ref: 'agra.fact' }, { t: 'Black granite' } ] }
      ],
      payoff: { aha: 'eras.3.aha', souvenir: 'treasures.nalanda',
        guideBye: 'Keep the seal safe. Every letter Nalanda sent went out stamped with one.' }
    },
    {
      n: 5, id: 'c5', era: 4, title: 'Temples and the Sea', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: false, age: 8,
      anchor: 'muziris',
      guide: { id: 'kayal', name: 'Kayal', place: 'muziris', mood: 'sea',
        who: 'about 40, a pilot who reads the monsoon winds like a calendar — patient with landlubbers, impatient with rope tied badly',
        note: 'Kayal is made up. Muziris is real.' },
      hook: 'Smell that? Pepper! Muziris is the pepper port of the west, and a Roman contract on papyrus still lists a ship’s cargo out of this port. Across on the other coast, at Mamallapuram, carvers tried everything — temples shaped like chariots, a whole cliff carved into one crowded, joyful scene. Sailors ride the monsoon winds in this age, and Kayal reads them like a calendar. Let’s open the sea road to the pepper port.',
      hookRefs: ['muziris.fact', 'muziris.more.0', 'mamallapuram.fact', 'eras.3.aha'],
      preset: {
        live: ['nalanda', 'ajanta', 'mathura', 'madurai', 'kashi', 'pataliputra'],
        routes: [['kashi', 'pataliputra'], ['pataliputra', 'nalanda'], ['kashi', 'mathura'], ['mathura', 'ajanta'], ['ajanta', 'madurai']],
        unfound: ['mamallapuram', 'thanjavur', 'konark', 'muziris'],
        heritage: 'rest',
        techs: 'before', riti: 'before',
        res: { anna: 110, kala: 120, katha: 70 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow', 'sea'],
      /* cyclone is borrowed from its later ages (E3): a nature row, the coast's own weather */
      raidPool: ['elephant', 'locust', 'mist', 'cyclone'],
      turns: 45,
      win: { awake: ['mamallapuram', 'thanjavur', 'konark', 'muziris'], routed: ['mamallapuram', 'thanjavur', 'konark', 'muziris'],
             fills: { n: 2, distinct: 2 } },
      goal: 'Wake the four lamps of the coasts, open the road to Muziris, and fill two requests from two different partners overseas.',
      beats: [
        { id: 'shore', on: 'awake:mamallapuram', who: 'kayal',
          say: 'Chariots made of stone, and not one of them goes anywhere. The carvers here tried everything.',
          ref: 'mamallapuram.fact', ref2: 'mamallapuram.more.0' },
        { id: 'sea', on: 'after:shore', who: 'mithu',
          say: 'The sea roads are open. Nobody out there is an enemy, and nobody can be: they ask, they pay, they remember. A ship from Srivijaya wants the workshops of the south — and a request can be filled only if one of your roads reaches the thing.',
          ask: ['srivijaya'] },
        { id: 'ledger', on: 'awake:thanjavur', who: 'mithu',
          say: 'Rajaraja Chola’s great temple — and its walls keep the names of the people who worked there, like a ledger.',
          ref: 'thanjavur.fact', ref2: 'thanjavur.more.0', riddle: 'c5r3' },
        { id: 'wrong', on: 'after:ledger', who: 'kayal',
          say: 'The sea is wrong. Haul the boats up, lash the roofs — a watch on the gate at Thanjavur.',
          raid: { id: 'cyclone', at: 'thanjavur', in: 4 } },
        { id: 'asks', on: 'struck:cyclone', who: 'kayal',
          say: 'The sea gives, and the sea asks.' },
        { id: 'wheels', on: 'awake:konark', who: 'kayal',
          say: 'A whole temple made as the sun god’s chariot — and the wheels are clocks.',
          ref: 'konark.fact', ref2: 'konark.more.0', riddle: 'c5r2' },
        { id: 'pepper', on: 'awake:muziris', who: 'kayal',
          say: 'Gold came in on the ships and pepper went out — and the poets on this shore wrote it down.',
          ref: 'muziris.fact', ref2: 'muziris.more.2', riddle: 'c5r1' },
        { id: 'china', on: 'filled:srivijaya', who: 'mithu',
          say: 'A second ship, from China — monks who will walk for two years to read in your halls. They want the learning of the east, and Nalanda and Pataliputra are on your roads.',
          ask: ['china'] },
        { id: 'home', on: 'win', who: 'kayal',
          say: 'Out on the wind, and home again.' }
      ],
      riddles: [
        { id: 'c5r1', site: 'muziris', q: 'What left Muziris for the wider world?',
          a: 'Pepper', aRef: 'muziris.fact',
          o: [ { t: 'Marble' }, { t: 'Horses' } ] },
        { id: 'c5r2', site: 'konark', q: 'What can Konark’s carved stone wheels do?',
          a: 'Tell the time, like sundials', aRef: 'konark.more.0',
          o: [ { t: 'Turn and roll the temple along' },
               { t: 'Ring like bells when tapped', why: 'that is Hampi’s pillars, later', ref: 'hampi.more.1' } ] },
        { id: 'c5r3', site: 'thanjavur', q: 'What do the Thanjavur temple’s walls record, name by name?',
          a: 'Its dancers, musicians and workers', aRef: 'thanjavur.more.0',
          o: [ { t: 'The price of pepper in every port' }, { t: 'The stars of every night of the year' } ] }
      ],
      payoff: { aha: 'eras.4.aha', souvenir: 'treasures.muziris',
        guideBye: 'Keep the coin. It crossed a whole sea to get here.' }
    },
    {
      n: 6, id: 'c6', era: 5, title: 'Domes and Minars', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: true, age: 8,
      open: { to: 'everyone', by: 'owner', on: '2026-10-09', why: 'opened by the publisher before review, like the Gita' },
      anchor: 'delhi',
      guide: { id: 'hira', name: 'Hira', place: 'delhi', mood: 'stone',
        who: 'about 60, a stone-mason whose hands know the weight of every block — he hums while he works and never hurries a course of stone',
        note: 'Hira is made up. Delhi is real.' },
      /* THE TOWER, THE PILLAR AND THE STACKED CITIES — and nothing else (reviewer flag): the
         complex's contested history is not told here, in any band */
      hook: 'Delhi isn’t one city — it’s many, stacked in one place, each age raising its own. In this age a fluted stone tower goes up, taller than anything in the land. But nothing great is instant: the tower grew in stages — begun by one ruler, finished by another, mended after lightning by builders from two more dynasties. Four dynasties in one tower! Hira has carried stone his whole life. Let’s raise the Minar — and keep its builders fed.',
      hookRefs: ['delhi.more.1', 'delhi.fact', 'delhi.more.3'],
      preset: {
        live: ['mamallapuram', 'thanjavur', 'konark', 'muziris', 'kashi', 'pataliputra'],
        routes: [['kashi', 'pataliputra'], ['pataliputra', 'konark'], ['konark', 'mamallapuram'], ['mamallapuram', 'thanjavur'], ['thanjavur', 'muziris']],
        unfound: ['delhi'],
        heritage: 'rest',
        techs: 'before', riti: 'before',
        res: { anna: 140, kala: 140, katha: 90 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow', 'sea', 'monuments'],
      /* era 5 has no non-human row but the locust and the mist; `storm` is a nature row added for
         it (E3) — weather, asserting nothing about anybody */
      raidPool: ['locust', 'mist', 'storm'],
      turns: 50,
      win: { awake: ['delhi'], routed: ['delhi'], lv: { delhi: 3 }, mon: ['delhi'], fed: 5 },
      goal: 'Wake Delhi and join it to a road, grow it to level 3, and raise the Qutb Minar — with the stores rising for five years running, so the builders are fed.',
      beats: [
        { id: 'names', on: 'start', who: 'mithu',
          say: 'Kashi answers to Banaras in this age, and Pataliputra to Patna. New names, the same cities, the same lamps.' },
        { id: 'many', on: 'found:delhi', who: 'hira',
          say: 'City upon city on this ground beside the Yamuna. Every age raised its own.',
          ref: 'delhi.fact', ref2: 'delhi.more.1' },
        { id: 'grow', on: 'awake:delhi', who: 'mithu',
          say: 'A monument needs a city big enough to hold it: grow Delhi to level 3. And remember — everyone eats. More hands at work means more grain to find.' },
        { id: 'stages', on: 'raising:delhi', who: 'hira',
          say: 'Foundation first, then the walls, then the top stone. Every karigar on the work makes it rise faster.',
          ref: 'delhi.more.3', riddle: 'c6r2' },
        { id: 'thunder', on: 'after:stages', who: 'hira',
          say: 'Thunder is rolling in. Put a watch on the scaffolds — and a fort beside the work would shelter it.',
          raid: { id: 'storm', at: 'delhi', in: 4 } },
        { id: 'mend', on: 'struck:storm', who: 'hira',
          say: 'The tower was mended after lightning once, by builders from two more dynasties. We would mend it too.',
          ref: 'delhi.more.3' },
        { id: 'iron', on: 'after:mend', who: 'hira',
          say: 'While the mortar sets — come and look at this iron. Centuries old, and it has barely rusted.',
          ref: 'delhi.more.0', riddle: 'c6r1' },
        { id: 'top', on: 'mon:delhi', who: 'hira',
          say: 'The top stone is on. Stone remembers.',
          ref: 'delhi.more.2', riddle: 'c6r3' },
        { id: 'course', on: 'win', who: 'hira',
          say: 'Course by course. Never hurry stone.' }
      ],
      riddles: [
        { id: 'c6r1', site: 'delhi', q: 'What is strange about the iron pillar at the Qutb?',
          a: 'It has barely rusted in all these centuries', aRef: 'delhi.more.0',
          o: [ { t: 'It is hollow, like a pipe' }, { t: 'It was cast in a single night' } ] },
        { id: 'c6r2', site: 'delhi', q: 'The Qutb Minar grew in stages. Builders from how many dynasties worked on it?',
          a: 'Four', aRef: 'delhi.more.3',
          o: [ { t: 'One' }, { t: 'Ten' } ] },
        { id: 'c6r3', site: 'delhi', q: 'Which world traveller served as a judge in Delhi?',
          a: 'Ibn Battuta', aRef: 'delhi.more.2',
          o: [ { t: 'Xuanzang', why: 'he came from China to Nalanda', ref: 'nalanda.fact' },
               { t: 'Megasthenes', why: 'he wrote home about Pataliputra', ref: 'pataliputra.fact' } ] }
      ],
      payoff: { aha: 'eras.5.aha', souvenir: 'treasures.delhi',
        guideBye: 'Put your hand on it whenever you doubt that old work lasts.' }
    },
    {
      n: 7, id: 'c7', era: 6, title: 'The City of Victory', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: false, age: 8,
      anchor: 'hampi',
      guide: { id: 'malli', name: 'Malli', place: 'hampi', mood: 'bazaar',
        who: 'about 12, whose family weighs goods at a stall in the long bazaar — she can tell a fair pan from a crooked one by the sound',
        note: 'Malli is made up. Hampi is real.' },
      hook: 'Travellers wrote home in plain disbelief: in Hampi’s bazaars, pearls and gems were weighed out in open heaps, like grain! A visitor who knew Lisbon said the city seemed as large as Rome. Its king, Krishnadevaraya, wrote poetry himself — a whole Telugu poem on how a king should care for his people. Malli’s family keeps a stall in the long bazaar. A good market needs many different things, not lots of one thing. Let’s fill it.',
      hookRefs: ['hampi.fact', 'treasures.hampi', 'hampi.more.2', 'hampi.more.0'],
      preset: {
        live: ['delhi', 'kashi', 'pataliputra'], mon: ['delhi'], lv: { delhi: 3 },
        routes: [['delhi', 'kashi'], ['kashi', 'pataliputra']],
        unfound: ['hampi'],
        heritage: 'rest',
        techs: 'before', riti: 'before',
        res: { anna: 140, kala: 150, katha: 100 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow', 'sea', 'monuments', 'goods'],
      /* the locust is borrowed (E3): era 6 has no non-human row but the mist */
      raidPool: ['mist', 'locust'],
      turns: 40,
      win: { awake: ['hampi'], routed: ['hampi'], bld: { hampi: ['bazaar'] }, goods: 4 },
      goal: 'Wake Hampi, build its bazaar, and let your roads reach four different kinds of thing.',
      beats: [
        { id: 'victory', on: 'awake:hampi', who: 'malli',
          say: 'Welcome to the City of Victory. Mind the boulders.',
          ref: 'hampi.fact' },
        { id: 'kinds', on: 'after:victory', who: 'mithu',
          say: 'Every city makes a kind of thing from its own part of the country — Delhi the workshops of the north, Banaras the learning of the north, Patna the learning of the east. A realm is content when its roads reach many different things. Variety, not volume.' },
        { id: 'pan', on: 'built:hampi.bazaar', who: 'malli',
          say: 'Hear that? A fair pan rings true.',
          ref: 'treasures.hampi', riddle: 'c7r1' },
        { id: 'grey', on: 'after:pan', who: 'mithu',
          say: 'The grey is pushing at the lamps. Put a watch on Hampi’s lanes tonight.',
          raid: { id: 'mist', at: 'hampi', in: 4 } },
        { id: 'pillars', on: 'struck:mist', who: 'malli',
          say: 'Now tap the pillars in the Vittala courtyard. Listen.',
          ref: 'hampi.more.1', riddle: 'c7r2' },
        { id: 'king', on: 'after:pillars', who: 'mithu',
          say: 'And here is a king who wrote poetry himself.',
          ref: 'hampi.more.0', riddle: 'c7r3' },
        { id: 'market', on: 'win', who: 'malli',
          say: 'Now it’s a market.' }
      ],
      riddles: [
        { id: 'c7r1', site: 'hampi', q: 'Travellers said Hampi’s bazaars sold something in open heaps, like grain. What?',
          a: 'Pearls and gems', aRef: 'hampi.fact',
          o: [ { t: 'Pepper', why: 'that was Muziris', ref: 'muziris.fact' }, { t: 'Books' } ] },
        { id: 'c7r2', site: 'hampi', q: 'What do some pillars of the Vittala temple do when tapped?',
          a: 'Ring with musical notes', aRef: 'hampi.more.1',
          o: [ { t: 'Tell the time', why: 'that was Konark’s wheels', ref: 'konark.more.0' }, { t: 'Glow in the dark' } ] },
        { id: 'c7r3', site: 'hampi', q: 'What did King Krishnadevaraya of Hampi write?',
          a: 'A Telugu poem on how a king should care for his people', aRef: 'hampi.more.0',
          o: [ { t: 'A map of the sea roads' }, { t: 'A book of star tables' } ] }
      ],
      payoff: { aha: 'eras.6.aha', souvenir: 'treasures.hampi',
        guideBye: 'Keep the pan. It still smells of rosewater.' }
    },
    {
      n: 8, id: 'c8', era: 7, title: 'Gardens and Marble', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: true, age: 8,
      open: { to: 'everyone', by: 'owner', on: '2026-10-09', why: 'opened by the publisher before review, like the Gita' },
      anchor: 'agra',
      /* HARD FLAG (master F): the Sikh Gurus are never depicted, here or anywhere; Harmandir Sahib
         is never a monument to build (noMonument); the langar is told and never a mechanic; the Taj
         is a memorial and a tomb; nothing of Amritsar's later history is told. Bahar is a visitor
         who eats in the langar as anyone may — never a narrator of anybody's faith. */
      guide: { id: 'bahar', name: 'Bahar', place: 'agra', mood: 'garden',
        who: 'about 30, a garden-keeper who tends water channels and fruit trees — she talks about water the way Kayal talked about wind',
        note: 'Bahar is made up. Agra is real.' },
      hook: 'In this age a garden cut in four by running water came to its perfection at Agra — and here Shah Jahan raised the Taj Mahal in memory of Mumtaz Mahal: some twenty years of work by thousands of craftsmen. Far to the north, at Amritsar, there is a kitchen that never closes, where everyone — anyone — sits in one row and eats together as equals. Bahar keeps gardens. Let’s grow one, and hold a festival in it.',
      hookRefs: ['agra.more.1', 'agra.fact', 'amritsar.fact', 'amritsar.more.2'],
      preset: {
        live: ['hampi', 'kashi', 'pataliputra'],
        routes: [['kashi', 'pataliputra'], ['kashi', 'hampi']],
        unfound: ['agra', 'amritsar'],
        heritage: 'rest',
        techs: 'before', riti: 'before',
        res: { anna: 160, kala: 150, katha: 110 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow', 'vidya', 'sea', 'monuments', 'goods', 'utsav'],
      doors: ['chahbagh'],
      /* the mist only, and one akal told at Agra (beat `rains`) */
      raidPool: ['mist'],
      turns: 45,
      win: { awake: ['agra', 'amritsar'], routed: ['agra', 'amritsar'], techs: ['chahbagh'], utsav: ['agra'], calm: ['agra', 'amritsar'] },
      goal: 'Wake Agra and Amritsar on your roads, learn the Char Bagh, and hold an utsav in Agra’s garden — with both towns content at the end.',
      beats: [
        { id: 'garden', on: 'awake:agra', who: 'bahar',
          say: 'A garden cut in four by running water. Sit down for a moment — this is what water is for.',
          ref: 'agra.more.1', riddle: 'c8r2' },
        { id: 'door', on: 'after:garden', who: 'mithu',
          say: 'The Char Bagh is a door in Vidya: gardens of four quarters, and an utsav costs half — the whole town is already outdoors.' },
        { id: 'marble', on: 'after:door', who: 'bahar',
          say: 'Look at the marble — flowers of coloured stone set into the white. It was raised in memory of Mumtaz Mahal.',
          ref: 'agra.fact', ref2: 'agra.more.0', riddle: 'c8r1' },
        { id: 'rains', on: 'after:marble', who: 'bahar',
          say: 'The rains are holding off over Agra. A garden is only as good as its water.',
          akal: { at: 'agra', len: 8 } },
        { id: 'langar', on: 'awake:amritsar', who: 'bahar',
          say: 'Here anyone can sit down in the row and be fed. I’m a visitor — I’ll sit with everyone.',
          ref: 'amritsar.fact', ref2: 'amritsar.more.2', riddle: 'c8r3' },
        { id: 'danced', on: 'utsav:agra', who: 'bahar',
          say: 'The whole town danced.' },
        { id: 'sit', on: 'win', who: 'mithu',
          say: 'A town owes its people somewhere to sit that grows nothing.' }
      ],
      riddles: [
        { id: 'c8r1', site: 'agra', q: 'Why do the Taj Mahal’s four minarets lean slightly outward?',
          a: 'So that if an earthquake threw one down, it would fall away from the tomb', aRef: 'agra.more.0',
          o: [ { t: 'Because the ground sank under them' }, { t: 'To catch more sunlight' } ] },
        { id: 'c8r2', site: 'agra', q: 'What is a char bagh, perfected at Agra?',
          a: 'A garden cut in four by water channels', aRef: 'agra.more.1',
          o: [ { t: 'A hall of four pillars' }, { t: 'A market of four streets' } ] },
        { id: 'c8r3', site: 'amritsar', q: 'In the langar at Amritsar, everyone…',
          a: 'Sits in one row and eats together as equals', aRef: 'amritsar.more.2',
          o: [ { t: 'Eats in order of rank' }, { t: 'Brings their own food from home' } ] }
      ],
      /* the langar's ladle is NOT the keepsake while the chapter waits for its reviewer */
      payoff: { aha: 'eras.7.aha', souvenir: 'treasures.agra',
        guideBye: 'One petal, thinner than a coin. Keep it flat — it would snap in a pocket.' }
    },
    {
      n: 9, id: 'c9', era: 8, title: 'Sails and Factories', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: true, age: 8,
      open: { to: 'everyone', by: 'owner', on: '2026-10-09', why: 'opened by the publisher before review, like the Gita' },
      anchor: 'surat',
      /* the edge of the colonial ages (the data's own flag): the English and Dutch came to trade
         and their first warehouses were here — that, and nothing about what followed */
      guide: { id: 'moti', name: 'Moti', place: 'surat', mood: 'ship',
        who: 'about 14, an apprentice shipwright on the Tapi — he smells of teak shavings and asks every captain where they have been',
        note: 'Moti is made up. Surat is real.' },
      hook: 'Ships under many flags anchor in the Tapi river here. Surat is the great port of its age, and a Surat merchant’s letter of credit was honoured in harbours half the world away! Its shipwrights built ocean-going ships of good teak so well that even foreign captains ordered theirs here. And from these wharves, pilgrims set sail for Mecca for centuries. Moti is learning to build ships. Let’s trade with the world — and see what happens to prices.',
      hookRefs: ['surat.fact', 'surat.more.0', 'surat.more.2'],
      preset: {
        /* Hampi is carried live, its monument standing (E8), so the south's workshops can answer Srivijaya */
        live: ['agra', 'amritsar', 'kashi', 'pataliputra', 'hampi'], mon: ['hampi'], lv: { hampi: 3 },
        routes: [['amritsar', 'agra'], ['agra', 'kashi'], ['kashi', 'pataliputra'], ['kashi', 'hampi']],
        unfound: ['surat'],
        heritage: 'rest',
        techs: 'before', riti: 'before',
        res: { anna: 170, kala: 170, katha: 120 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow', 'vidya', 'sea', 'monuments', 'goods', 'utsav', 'favour'],
      doors: ['ship'],
      raidPool: ['fire', 'cyclone', 'mist'],
      turns: 45,
      /* two partners, because the data has two in this age (E7) */
      win: { awake: ['surat'], routed: ['surat'], techs: ['ship'], fills: { per: { persia: 2, srivijaya: 2 } } },
      goal: 'Wake Surat on your roads, learn the Shipyards, and fill two requests each for Persia and Srivijaya.',
      beats: [
        { id: 'flags', on: 'awake:surat', who: 'moti',
          say: 'Ships under many flags, all in one river. Ask any captain where they’ve been.',
          ref: 'surat.fact' },
        { id: 'teak', on: 'after:flags', who: 'moti',
          say: 'The Shipyards are a door in Vidya. Here — smell that teak.',
          ref: 'surat.more.0', riddle: 'c9r1' },
        { id: 'two', on: 'after:teak', who: 'mithu',
          say: 'Two partners are asking. Persia wants the fields of the north — Amritsar can answer. Srivijaya wants the workshops of the south — Hampi can. Fill a request and they remember you: that is favour.',
          ask: ['persia', 'srivijaya'] },
        { id: 'price', on: 'filled:persia', who: 'mithu',
          say: 'Look at the price on the sea roads now: the more of one thing you sell, the less each sale pays. Why is the third sack worth less than the first? Because they already have the first two.' },
        { id: 'smoke', on: 'after:price', who: 'mithu',
          say: 'Smoke over the warehouse quarter! A watch on Surat’s gate — the bucket line.',
          raid: { id: 'fire', at: 'surat', in: 4 } },
        { id: 'factories', on: 'struck:fire', who: 'moti',
          say: 'Those warehouses by the water have a story of their own.',
          ref: 'surat.more.1', riddle: 'c9r2' },
        { id: 'gate', on: 'after:factories', who: 'moti',
          say: 'And from these same wharves, the pilgrims’ ships.',
          ref: 'surat.more.2', riddle: 'c9r3' },
        { id: 'paper', on: 'win', who: 'moti',
          say: 'Paper worth a ship’s cargo. Keep it in your pocket.' }
      ],
      riddles: [
        { id: 'c9r1', site: 'surat', q: 'What did Surat’s shipwrights build so well that foreign captains ordered them here?',
          a: 'Ocean-going teak ships', aRef: 'surat.more.0',
          o: [ { t: 'Iron steamships' }, { t: 'Stone lighthouses' } ] },
        { id: 'c9r2', site: 'surat', q: 'What did English and Dutch traders first raise at Surat?',
          a: 'Their first warehouses in India — “factories”', aRef: 'surat.more.1',
          o: [ { t: 'Lighthouses' }, { t: 'A university' } ] },
        { id: 'c9r3', site: 'surat', q: 'Why was Surat called Bab-ul-Mecca, the gate of Mecca?',
          a: 'Pilgrims sailed for Mecca from its wharves', aRef: 'surat.more.2',
          o: [ { t: 'Its gates were plated with gold' }, { t: 'Its merchants all came from Mecca' } ] }
      ],
      payoff: { aha: 'eras.8.aha', souvenir: 'treasures.surat',
        guideBye: 'Fold the hundi small. It is worth more than it looks.' }
    },
    {
      n: 10, id: 'c10', era: 9, title: 'Railways and Presses', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: true, age: 8,
      open: { to: 'everyone', by: 'owner', on: '2026-10-09', why: 'opened by the publisher before review, like the Gita' },
      anchor: 'kolkata',
      /* fire, cyclone and mist only — never the famine or plague rows (reviewer flag); 1857 appears
         only as the university's year */
      guide: { id: 'roshni', name: 'Roshni', place: 'kolkata', mood: 'press',
        who: 'about 13, an apprentice to a printer — she can find any letter in the type-case with her eyes shut',
        note: 'Roshni is made up. Calcutta is real.' },
      hook: 'Seven islands, stitched into one city by people who filled in the sea between them! From Bombay, in 1853, Asia’s first passenger train steamed to Thane — thirty-four kilometres that changed the whole country. And across the land, Calcutta’s presses sent out books and newspapers in Bengali, Hindi, Urdu, English and more, to be read aloud in courtyards everywhere. Roshni sets type for a printer. Let’s lay the iron road and get the words moving.',
      hookRefs: ['mumbai.more.0', 'mumbai.fact', 'kolkata.fact'],
      preset: {
        live: ['surat', 'kashi', 'pataliputra'],
        routes: [['surat', 'kashi'], ['kashi', 'pataliputra']],
        unfound: ['mumbai', 'kolkata'],
        heritage: 'rest',
        techs: 'before', riti: 'before',
        res: { anna: 180, kala: 180, katha: 130 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow', 'vidya', 'sea', 'monuments', 'goods', 'utsav', 'favour', 'quarrels'],
      doors: ['railway'],
      raidPool: ['fire', 'cyclone', 'mist'],
      turns: 45,
      win: { awake: ['mumbai', 'kolkata'], network: ['mumbai', 'kolkata'], techs: ['railway'],
             bld: { kolkata: ['gurukul'] }, teacher: { at: 'kolkata', right: 2 }, settled: 1 },
      goal: 'Wake Bombay and Calcutta on one network, learn the Railway, build a gurukul in Calcutta and answer its teacher right twice — and settle the quarrel when it comes.',
      beats: [
        { id: 'islands', on: 'awake:mumbai', who: 'mithu',
          say: 'Seven islands, one harbour — and the ground between them was made by people.',
          ref: 'mumbai.more.0', riddle: 'c10r2' },
        { id: 'iron', on: 'after:islands', who: 'mithu',
          say: 'The Railway is a door in Vidya: iron roads, and every new route costs half again.' },
        { id: 'thane', on: 'learned:railway', who: 'mithu',
          say: 'The first train has already run out of Bombay. Thirty-four kilometres, and nothing was the same.',
          ref: 'mumbai.fact', riddle: 'c10r1' },
        { id: 'presses', on: 'awake:kolkata', who: 'roshni',
          say: 'Every press on this street is going. Listen to it.',
          ref: 'kolkata.fact', ref2: 'kolkata.more.1' },
        { id: 'college', on: 'after:presses', who: 'mithu',
          say: 'Build a gurukul in Calcutta. Its teacher can ask about any woken city — the script your realm learned long ago made that possible.' },
        { id: 'tolls', on: 'routed:mumbai', who: 'mithu',
          say: 'A quarrel in your realm: Bombay and its neighbour on the road have fallen out over tolls, and the road carries nothing until it is settled. Your realm learned the Panchayat long ago — five who sit together cost nothing.',
          quarrel: { a: 'mumbai', b: 'surat', tpl: 1 } },
        { id: 'five', on: 'settled', who: 'mithu',
          say: 'Five who sit together. The road carries again.' },
        { id: 'univ', on: 'taught:kolkata', who: 'roshni',
          say: 'The university here is one of the first of its kind in all of Asia.',
          ref: 'kolkata.more.0', riddle: 'c10r3' },
        { id: 'type', on: 'win', who: 'roshni',
          say: 'With a few hundred of these, a room could talk to a million people.',
          ref: 'treasures.kolkata' }
      ],
      riddles: [
        { id: 'c10r1', site: 'mumbai', q: 'Asia’s first passenger train ran from Bombay to…',
          a: 'Thane', aRef: 'mumbai.fact',
          o: [ { t: 'Calcutta' }, { t: 'Surat' } ] },
        { id: 'c10r2', site: 'mumbai', q: 'How did Bombay’s seven islands become one city?',
          a: 'People filled in the sea between them', aRef: 'mumbai.more.0',
          o: [ { t: 'An earthquake pushed them together' }, { t: 'A river silted them up' } ] },
        { id: 'c10r3', site: 'kolkata', q: 'What opened in Calcutta in 1857?',
          a: 'One of Asia’s first modern universities', aRef: 'kolkata.more.0',
          o: [ { t: 'India’s first full-length film', why: 'that was Bombay, 1913', ref: 'mumbai.more.1' },
               { t: 'A railway to Thane', why: 'that was Bombay, 1853', ref: 'mumbai.fact' } ] }
      ],
      payoff: { aha: 'eras.9.aha', souvenir: 'treasures.kolkata',
        guideBye: 'One letter of type. Mind you don’t drop it — I’d have to find it with my eyes shut.' }
    },
    {
      n: 11, id: 'c11', era: 10, title: 'The Freedom Age', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: true, age: 8,
      open: { to: 'everyone', by: 'owner', on: '2026-10-09', why: 'opened by the publisher before review, like the Gita' },
      anchor: 'ahmedabad',
      /* HARD FLAG (master F): freedom without violence — no enemy of any kind, nothing human in the
         raid pool; Gandhi and Ambedkar only in the data's own words (no invented line for either);
         Partition is not told or hinted at. "An empire" stays unnamed, as the data leaves it. */
      guide: { id: 'dhara', name: 'Dhara', place: 'ahmedabad', mood: 'thread',
        who: 'about 50, a spinner who lives in a mill-workers’ lane and spins at home in the evenings — calm, dry-humoured, and fond of a straight thread',
        note: 'Dhara is made up. Ahmedabad is real.' },
      hook: 'This age has a quiet ashram on the bank of the Sabarmati river. In 1930 Gandhi walked from here to the sea at Dandi — twenty-four days on foot — to pick up a handful of salt that everyone had been forbidden to make. A quiet act, understood by a whole country at once. Patience and truth were shown to move an empire, and in 1947 India was free. Dhara spins thread. Let’s carry the printed word to every city.',
      hookRefs: ['ahmedabad.fact', 'darshan.gandhi', 'eras.10.note'],
      preset: {
        live: ['mumbai', 'kolkata', 'kashi', 'pataliputra'],
        routes: [['mumbai', 'kashi'], ['kashi', 'pataliputra'], ['pataliputra', 'kolkata']],
        unfound: ['ahmedabad'],
        heritage: 'rest',
        techs: 'before', riti: 'before',
        res: { anna: 180, kala: 180, katha: 140 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow', 'vidya', 'sea', 'monuments', 'goods', 'utsav', 'favour', 'quarrels', 'riti'],
      doors: ['press'], ritiDoors: ['sabhyariti'], pols: ['voice'],
      raidPool: ['forget', 'mist', 'cyclone'],
      turns: 45,
      win: { awake: ['ahmedabad'], techs: ['press'], network: 'all', riti: ['sabhyariti'], pol: ['voice'] },
      goal: 'Wake Ahmedabad, learn the Printing Press, join every living city into one network, and take up Praja Sabha with “A Say in It” in force.',
      beats: [
        { id: 'mills', on: 'awake:ahmedabad', who: 'dhara',
          say: 'A weaving city. The mills earned it a famous nickname.',
          ref: 'ahmedabad.more.1', riddle: 'c11r2' },
        { id: 'lace', on: 'after:mills', who: 'dhara',
          say: 'Come and see a stone window carved like a tree.',
          ref: 'ahmedabad.more.0', riddle: 'c11r3' },
        { id: 'press', on: 'after:lace', who: 'mithu',
          say: 'The Printing Press is a door in Vidya: a thousand copies by morning, and every teacher’s question pays double.' },
        { id: 'walk', on: 'after:press', who: 'mithu',
          say: 'Here is a walk worth knowing.',
          ref: 'ahmedabad.fact', riddle: 'c11r1' },
        { id: 'quiet', on: 'after:walk', who: 'mithu',
          say: 'The old stories are going quiet in Banaras. A watch on its lanes — and a telling in the square.',
          raid: { id: 'forget', at: 'kashi', in: 4 } },
        { id: 'kept', on: 'struck:forget', who: 'dhara',
          say: 'A thing remembered is a thing kept.' },
        { id: 'say', on: 'after:kept', who: 'mithu',
          say: 'Vidya has a second tree — Riti, how your realm does things. Take up Praja Sabha, and put “A Say in It” in a slot. That’s a rule of our game, not a history lesson. But it’s a good rule.' },
        { id: 'free', on: 'win', who: 'mithu',
          say: '…and in 1947, India is free.',
          ref: 'eras.10.note' }
      ],
      riddles: [
        { id: 'c11r1', site: 'ahmedabad', q: 'From the ashram at Ahmedabad, Gandhi walked to the sea at Dandi to…',
          a: 'Pick up a handful of salt everyone had been forbidden to make', aRef: 'ahmedabad.fact',
          o: [ { t: 'Catch a ship' }, { t: 'Plant cotton' } ] },
        { id: 'c11r2', site: 'ahmedabad', q: 'Ahmedabad’s cotton mills earned it the name…',
          a: 'Manchester of India', aRef: 'ahmedabad.more.1',
          o: [ { t: 'City of Islands' }, { t: 'City of Lakes' } ] },
        { id: 'c11r3', site: 'ahmedabad', q: 'The famous Sidi Saiyyed window is carved as…',
          a: 'A tree with curving branches, fine as lace', aRef: 'ahmedabad.more.0',
          o: [ { t: 'A ship in full sail' }, { t: 'A map of the city' } ] }
      ],
      payoff: { aha: 'eras.10.aha', souvenir: 'treasures.ahmedabad',
        guideBye: 'A straight thread, knotted. Keep the spindle — there’s more in it.' }
    },
    {
      n: 12, id: 'c12', era: 11, title: 'The Young Republic', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: true, age: 8,
      open: { to: 'everyone', by: 'owner', on: '2026-10-09', why: 'opened by the publisher before review, like the Gita' },
      anchor: 'chandigarh',
      /* why the city was built is not told (reviewer flag). PLACEMENT (E10): Chandigarh has no
         drawn board yet, so "to the plan" falls back to "all five built", and the adjacency lesson
         stays in free play until the kit draws this city. */
      guide: { id: 'akash', name: 'Akash', place: 'chandigarh', mood: 'plan',
        who: 'about 28, a draughtsman with ink on his cuffs — very serious about a straight line, and secretly in love with the Rock Garden’s crooked ones',
        note: 'Akash is made up. Chandigarh is real.' },
      hook: 'A young country builds itself with its own hands: dams, steel towns, new seeds — and a brand-new city, planned on a blank sheet of paper! Its planners described it like a body: the Capitol its head, the green belts its lungs, the bazaars its heart. And in one corner, a roads inspector named Nek Chand secretly built a whole garden of figures out of broken bangles and crockery. Akash draws plans for a living. Let’s lay out a city.',
      hookRefs: ['eras.11.note', 'chandigarh.fact', 'chandigarh.more.1', 'chandigarh.more.0'],
      preset: {
        live: ['ahmedabad', 'mumbai', 'kolkata', 'kashi', 'pataliputra'],
        routes: [['ahmedabad', 'mumbai'], ['mumbai', 'kashi'], ['kashi', 'pataliputra'], ['pataliputra', 'kolkata']],
        unfound: ['chandigarh'],
        heritage: 'rest',
        techs: 'before', riti: 'before', pol: ['voice'],
        res: { anna: 200, kala: 200, katha: 150 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow', 'vidya', 'sea', 'monuments', 'goods', 'utsav', 'favour', 'quarrels', 'riti'],
      doors: ['harit'], ritiDoors: ['sahkari'], pols: ['voice', 'shared'],
      raidPool: ['drought', 'floodmod', 'forget'],
      turns: 50,
      win: { awake: ['chandigarh'], routed: ['chandigarh'], lv: { chandigarh: 3 },
             bld: { chandigarh: ['granary', 'workshop', 'gurukul', 'bazaar', 'stepwell'] }, mon: ['chandigarh'] },
      goal: 'Wake Chandigarh, grow it to level 3, build all five — granary, workshop, gurukul, bazaar and stepwell — and raise the Open Hand.',
      beats: [
        { id: 'sheet', on: 'awake:chandigarh', who: 'akash',
          say: 'A plan on paper, before a single brick. Here — head, lungs, heart.',
          ref: 'chandigarh.fact', ref2: 'chandigarh.more.1', riddle: 'c12r2' },
        { id: 'five', on: 'after:sheet', who: 'mithu',
          say: 'Build all five in Chandigarh — granary, workshop, gurukul, bazaar and stepwell — and grow it. The Open Hand needs a city big enough to hold it.' },
        { id: 'dry', on: 'after:five', who: 'mithu',
          say: 'Three months and no rain on the district. A watch on Chandigarh’s tanks.',
          raid: { id: 'drought', at: 'chandigarh', in: 5 } },
        { id: 'rocks', on: 'struck:drought', who: 'akash',
          say: 'Come and see what a roads inspector built in secret, in a corner of my straight lines.',
          ref: 'chandigarh.more.0', riddle: 'c12r1' },
        { id: 'hand', on: 'mon:chandigarh', who: 'akash',
          say: 'Open to give, open to receive.',
          ref: 'chandigarh.fact', riddle: 'c12r3' },
        { id: 'drawn', on: 'win', who: 'akash',
          say: 'Drawn first, built after.' }
      ],
      riddles: [
        { id: 'c12r1', site: 'chandigarh', q: 'What did Nek Chand build in secret at Chandigarh?',
          a: 'A garden of figures made from broken bangles and crockery', aRef: 'chandigarh.more.0',
          o: [ { t: 'A private railway' }, { t: 'A hidden library' } ] },
        { id: 'c12r2', site: 'chandigarh', q: 'Chandigarh’s planners described their city as…',
          a: 'A body — head, lungs and heart', aRef: 'chandigarh.more.1',
          o: [ { t: 'A ship at anchor' }, { t: 'A chessboard' } ] },
        { id: 'c12r3', site: 'chandigarh', q: 'What does Chandigarh’s Open Hand mean?',
          a: 'Open to give, open to receive', aRef: 'chandigarh.fact',
          o: [ { t: 'Stop here' }, { t: 'A king once lived here' } ] }
      ],
      payoff: { aha: 'eras.11.aha', souvenir: 'treasures.chandigarh',
        guideBye: 'Roll it up carefully. Its lines are straighter than mine.' }
    },
    {
      n: 13, id: 'c13', era: 12, title: 'The Takeoff', badge: 'itihaas', minutes: '15–20',
      status: 'open', review: false, age: 8,
      anchor: 'sriharikota',
      guide: { id: 'kiran', name: 'Kiran', place: 'sriharikota', mood: 'rocket',
        who: 'about 35, an engineer who works between a Bengaluru lab and the launch island — a pencil behind her ear, and a superstition about the number zero',
        note: 'Kiran is made up. Sriharikota is real.' },
      hook: 'The garden city became India’s city of new ideas — its great science institute was founded with Jamsetji Tata’s gift in 1909, and missions to the Moon and Mars are steered from rooms here. On a quiet island of casuarina trees, Sriharikota, an Indian rocket rose in 1980 and set the satellite Rohini into the sky. Rockets fly east over the sea, where Earth’s spin gives a free push. Kiran builds rockets. Let’s connect the whole map — and count down.',
      hookRefs: ['bengaluru.fact', 'bengaluru.more.1', 'sriharikota.fact', 'sriharikota.more.0'],
      preset: {
        /* every earlier place is awake and lit (E11), so India Remembers can come true */
        live: ['chandigarh', 'mumbai', 'kolkata', 'kashi', 'pataliputra'], mon: ['chandigarh'], lv: { chandigarh: 3 },
        routes: [['chandigarh', 'kashi'], ['mumbai', 'kashi'], ['kashi', 'pataliputra'], ['pataliputra', 'kolkata']],
        unfound: ['bengaluru', 'sriharikota'],
        heritage: 'rest',
        techs: 'before', riti: 'before', pol: ['voice'],
        res: { anna: 220, kala: 220, katha: 170 }
      },
      systems: ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow', 'vidya', 'sea', 'monuments', 'goods', 'utsav', 'favour', 'quarrels', 'riti', 'endings'],
      doors: ['satellite'], ritiDoors: ['sanchar'], pols: ['voice', 'shared', 'everywhere'],
      raidPool: ['heat', 'smog', 'forget', 'drought'],
      turns: 55,
      win: { techs: ['satellite'], awake: ['bengaluru', 'sriharikota'], network: 'all', mon: ['sriharikota'], vic: ['memory'] },
      goal: 'Learn the Satellite, wake Bengaluru and Sriharikota, join every living city into one network, and light the launch tower — so that India Remembers.',
      beats: [
        { id: 'garden', on: 'awake:bengaluru', who: 'kiran',
          say: 'The garden city. The old telling says how it got its name — ask me about the beans.',
          ref: 'bengaluru.more.0', ref2: 'bengaluru.more.2', riddle: 'c13r3' },
        { id: 'eye', on: 'after:garden', who: 'mithu',
          say: 'The Satellite is a door in Vidya: explorers walk twice as fast, and no city ever fades again.',
          ref: 'sutras.starcounters.3' },
        { id: 'island', on: 'awake:sriharikota', who: 'kiran',
          say: 'Rockets and flamingoes, sharing one coast. And look which way the launches go.',
          ref: 'sriharikota.more.2', ref2: 'sriharikota.more.0', riddle: 'c13r1' },
        { id: 'heat', on: 'after:island', who: 'kiran',
          say: 'The heat is not breaking. The pad doesn’t care how hot we are — check it twice. A watch on Bengaluru’s tanks.',
          raid: { id: 'heat', at: 'bengaluru', in: 4 } },
        { id: 'roads', on: 'after:heat', who: 'mithu',
          say: 'Four roads lead to an ending, and this one is India Remembers — every lamp lit, from Dholavira to Sriharikota. Watch it on the goal strip as the last cities join.' },
        { id: 'countdown', on: 'mon:sriharikota', who: 'kiran',
          say: 'Ten, nine, eight… zero.',
          ref: 'sriharikota.more.1', riddle: 'c13r2' },
        { id: 'blaze', on: 'win', who: 'kiran',
          say: 'Every lamp on one road. Don’t blink.' }
      ],
      riddles: [
        { id: 'c13r1', site: 'sriharikota', q: 'Why do Sriharikota’s rockets fly east over the sea?',
          a: 'Earth’s spin gives a free push, and only water lies below', aRef: 'sriharikota.more.0',
          o: [ { t: 'The wind always blows east' }, { t: 'To be closer to the Moon' } ] },
        { id: 'c13r2', site: 'sriharikota', q: 'What did Chandrayaan-3 do in 2023?',
          a: 'Landed near the Moon’s south pole — the first craft from any nation to reach there', aRef: 'sriharikota.more.1',
          o: [ { t: 'Orbited the Sun' }, { t: 'Landed on Mars' } ] },
        { id: 'c13r3', site: 'bengaluru', q: 'Who does the old telling say founded Bengaluru in 1537?',
          a: 'Kempegowda', aRef: 'bengaluru.more.0',
          o: [ { t: 'Krishnadevaraya', why: 'he was Hampi’s king, in an earlier age', ref: 'hampi.more.0' },
               { t: 'Rajaraja Chola', why: 'he raised the great temple at Thanjavur', ref: 'thanjavur.fact' } ] }
      ],
      /* the data's last age has no aha: the epilogue takes its place */
      payoff: { aha: null, souvenir: 'treasures.sriharikota',
        guideBye: 'Keep the page. Somebody counted backwards on it, very carefully.' }
    }
  ],
  /* EPILOGUE — ALL THIRTEEN LAMPS (master F). Offered once every lamp is lit. Mithu's words are
     the storyline's own and assert nothing the chapters did not already show; the last card is
     the data's `tellers` bead, verbatim, as 🧭 Aaj — the child as the newest teller. Each guide
     waves with the line they gave over their keepsake: never a line about history. */
  epilogue: {
    title: 'All Thirteen Lamps',
    mithu: 'Look at it, apprentice. Thirteen lamps. Dholavira’s reservoirs. Megh’s river. Ila’s letters. Nilu’s blue. Kayal’s pepper ships. Hira’s tower. Malli’s market. Bahar’s garden. Moti’s teak. Roshni’s type. Dhara’s thread. Akash’s plan. Kiran’s countdown. Not one of those places was conquered. Every one was reached — by a road, a boat, a train, a question, a story. And here’s the secret of Vismriti: the mist doesn’t go away because you beat it. It goes away because somebody tells. Which means it isn’t really finished…',
    tellers: 'sutras.tellers.4', tellersBadge: 'aaj',
    ask: 'Which of the thirteen lamps is closest to where your family comes from? Ask a grown-up what they know about it.',
    unlocks: 'The long game waits on the start screen — Dholavira to Sriharikota, with every system on: kingdoms, heroes, wonders, sister realms, the khazana hunt and all four endings. And every chapter here can be played again.'
  }
};
