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

  /* fact: shown once, when the site wakes — the game's one teaching moment per place.
     say: how the mist event names it ("the mist is drifting over …"). */
  sites: [
    /* — era 1 · Harappan — */
    { id: 'dholavira', era: 0, name: 'Dholavira', state: 'GJ', x: 104.9, y: 516.8, kind: 'shilpa',
      fact: 'A planned stone city on an island in the Rann, famous for its great water reservoirs — it caught and kept the rain in a land with almost none.',
      sources: ['NCERT, Our Pasts I, ch. "In the Earliest Cities"', 'ASI Dholavira excavation literature; UNESCO World Heritage listing (2021)'] },
    { id: 'lothal', era: 0, name: 'Lothal', state: 'GJ', x: 169.2, y: 564.2, kind: 'shilpa',
      fact: 'A town of bead-makers by the sea, with a great brick basin that many archaeologists read as a dockyard for trading ships.',
      sources: ['NCERT, Our Pasts I', 'S. R. Rao, ASI Lothal excavation reports (the dockyard reading is his, and is debated)'] },
    { id: 'rakhigarhi', lab: 's', era: 0, name: 'Rakhigarhi', state: 'HR', x: 291.2, y: 323.7, kind: 'kheti',
      fact: 'The largest Harappan-era settlement found in India — a farming and trading town whose mounds are still being carefully dug today.',
      sources: ['ASI / Deccan College Rakhigarhi excavations', 'NCERT, Our Pasts I'] },
    { id: 'kalibangan', lab: 'w', era: 0, name: 'Kalibangan', state: 'RJ', x: 228.6, y: 317.2, kind: 'kheti',
      fact: 'Here archaeologists found a ploughed field older than almost any other on Earth — the furrows still crossing each other in the ground.',
      sources: ['B. B. Lal & B. K. Thapar, ASI Kalibangan excavations', 'NCERT, Our Pasts I'] },

    /* — era 2 · Vedic / janapadas — */
    { id: 'hastinapura', era: 1, name: 'Hastinapura', state: 'UP', x: 351.4, y: 328.6, kind: 'kheti',
      fact: 'The story goes that this was the Kauravas’ and Pandavas’ capital. Under the village today is a real ancient mound, dug layer by careful layer.',
      sources: ['B. B. Lal, ASI Hastinapura excavations (1950–52)', 'Mahabharata (Katha frame — the story, as it is told)'] },
    { id: 'kashi', era: 1, name: 'Kashi', state: 'UP', x: 508.7, y: 466.6, kind: 'vidya',
      fact: 'Kashi — Varanasi today — is one of the oldest continuously lived-in cities on Earth — people have been waking up beside the Ganga here for some three thousand years.',
      sources: ['NCERT, Our Pasts I', 'ASI Rajghat excavation literature'] },
    { id: 'ujjain', era: 1, name: 'Ujjain', state: 'MP', x: 280.8, y: 541.4, kind: 'vidya',
      fact: 'A crossroads city where the trade roads met — later so famous for star-watching that Indian astronomers drew their zero line of longitude through it.',
      sources: ['NCERT, Our Pasts I–II', 'History of Indian astronomy literature (Ujjayinī meridian)'] },
    { id: 'vaishali', era: 1, name: 'Vaishali', state: 'BR', x: 575.8, y: 442.8, kind: 'kheti',
      fact: 'Here the Licchavis ran their city by assembly — hundreds sitting together, arguing and voting, over two thousand years ago.',
      sources: ['NCERT, Our Pasts I, ch. on early republics (gana-sanghas)', 'ASI Vaishali site literature'] },

    /* — era 3 · Maurya — */
    { id: 'pataliputra', lab: 'w', era: 2, name: 'Pataliputra', state: 'BR', x: 576.0, y: 456.8, kind: 'vidya',
      fact: 'Capital of the Mauryas. A Greek visitor named Megasthenes wrote home amazed at its wooden walls, said to run for miles along the Ganga.',
      sources: ['NCERT, Our Pasts I, ch. on the Mauryas', 'Megasthenes’ Indica (as preserved in later Greek writers)'] },
    { id: 'sanchi', era: 2, name: 'Sanchi', state: 'MP', x: 342.5, y: 531.0, kind: 'shilpa',
      fact: 'A great stone stupa begun in Ashoka’s time, its gateways crowded with carved stories — kept safe on its quiet hill for two thousand years.',
      sources: ['ASI Sanchi; UNESCO World Heritage listing', 'NCERT, Our Pasts I'] },
    { id: 'dhauli', lab: 'w', era: 2, name: 'Dhauli', state: 'OR', x: 598.2, y: 644.0, kind: 'vidya',
      fact: 'By the Kalinga battlefield, Ashoka had his promises carved into the rock — that he would rule by care, not conquest. The letters are still there.',
      sources: ['Ashokan rock edicts at Dhauli (ASI)', 'NCERT, Our Pasts I, ch. on Ashoka'] },
    { id: 'sopara', era: 2, name: 'Sopara', state: 'MH', x: 186.6, y: 670.3, kind: 'shilpa',
      fact: 'An ancient western port — ships left here for distant coasts, and a fragment of Ashoka’s own edicts was found in its soil.',
      sources: ['ASI Sopara (Shurparaka) finds, incl. the VIII rock edict fragment', 'Periplus of the Erythraean Sea (as “Ouppara”)'] },

    /* — era 4 · Gupta / classical — */
    { id: 'nalanda', lab: 'e', era: 3, name: 'Nalanda', state: 'BR', x: 585.7, y: 473.0, kind: 'vidya',
      fact: 'A university with thousands of students and a library said to have towered stories high; the traveller Xuanzang came from China and stayed years.',
      sources: ['Xuanzang’s account (Si-yu-ki)', 'ASI Nalanda; UNESCO World Heritage listing', 'NCERT, Our Pasts I'] },
    { id: 'ajanta', era: 3, name: 'Ajanta', state: 'MH', x: 278.2, y: 631.8, kind: 'shilpa',
      fact: 'Caves cut into a river cliff and painted floor to ceiling — the Jataka tales in colour, still glowing in the dark after fifteen centuries.',
      sources: ['ASI Ajanta; UNESCO World Heritage listing', 'NCERT, Our Pasts I'] },
    { id: 'mathura', lab: 'e', era: 3, name: 'Mathura', state: 'UP', x: 340.4, y: 389.1, kind: 'shilpa',
      fact: 'The story goes that Krishna was born here. In the same city, workshops carved some of the most loved sculpture in India’s history.',
      sources: ['Mathura school of sculpture (standard art-history literature)', 'Krishna tradition (Katha frame — the story, as it is told)'] },
    { id: 'madurai', lab: 's', era: 3, name: 'Madurai', state: 'TN', x: 354.5, y: 983.9, kind: 'vidya',
      fact: 'The old tellings say poets gathered here in academies called sangams; the Tamil poems of that age still name the streets, the traders, the sea.',
      sources: ['Sangam literature corpus (e.g. Madurai-kanchi)', 'NCERT, Our Pasts I, ch. on the southern kingdoms'] },

    /* — era 5 · temples and the sea — */
    { id: 'mamallapuram', lab: 'e', era: 4, name: 'Mamallapuram', state: 'TN', x: 419.9, y: 896.3, kind: 'shilpa',
      fact: 'A Pallava harbour town where sculptors tried everything — temples shaped like chariots, a whole cliff carved into one crowded, joyful scene.',
      sources: ['ASI Mamallapuram; UNESCO World Heritage listing', 'NCERT, Our Pasts II'] },
    { id: 'thanjavur', era: 4, name: 'Thanjavur', state: 'TN', x: 386.7, y: 956.0, kind: 'vidya',
      fact: 'Rajaraja Chola raised a temple here so tall its shadow was a wonder of the age, and its walls carry the accounts of the whole kingdom, carved in stone.',
      sources: ['Brihadisvara temple inscriptions (ASI); UNESCO World Heritage listing', 'NCERT, Our Pasts II, ch. on the Cholas'] },
    { id: 'konark', lab: 'e', era: 4, name: 'Konark', state: 'OR', x: 606.2, y: 654.4, kind: 'shilpa',
      fact: 'The Sun temple — a whole shrine built as the sun god’s chariot, with carved stone wheels taller than a grown-up.',
      sources: ['ASI Konark; UNESCO World Heritage listing', 'NCERT, Our Pasts II'] },
    { id: 'muziris', lab: 'w', era: 4, name: 'Muziris', state: 'KL', x: 293.8, y: 973.9, kind: 'kheti',
      fact: 'The pepper port of the west — Roman writers grumbled about the gold their ships spent here, and a Tamil poem calls it the city where the ships come laden.',
      sources: ['Periplus of the Erythraean Sea; Pliny, Natural History', 'Akananuru 149 (the Muciri poem); Pattanam excavation literature (the identification is discussed)'] }
  ]
};
