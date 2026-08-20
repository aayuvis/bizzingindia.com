/* Bizzing India — Utsav: the festival layer, built for the child who is not in India.

   THE PROBLEM THIS FILE EXISTS TO SOLVE (docs/11 §4.4):
   The gap is NOT that the child doesn't know what Diwali is. Content solves that, and every
   other app already tried. The gap is that in India the whole city does it — school shuts,
   the sweetshop queue goes round the block, the sound of it comes through the window — and
   in New Jersey it is a Tuesday with a spelling test. The child therefore experiences the
   festival as private family strangeness rather than as belonging.

   So this file is not an encyclopaedia of festivals. It is three things:
     1. `festivals` — enough breadth that no child opens this and fails to find their own
        family's year in it, plus, on every single entry, `do[]`: small things a child
        outside India can actually do on the day, in a flat, with no shopping trip.
     2. `presence` — the copy for the "everyone is doing it" mechanic. A countdown, a day-of
        line, a live count, a card for the family WhatsApp group.
     3. `calendarNote` — for the parent, on why the date moves.

   WHAT WE DECIDED, AND WHY

   · BREADTH IS THE WHOLE POINT. A Hindi-belt list with Onam bolted on the end teaches the
     Tamil child that their family does India wrong (CLAUDE.md rule 5, docs/05 §2). So this
     list is built region-first: 38 festivals, every zone of the country, Hindu / Buddhist /
     Jain / Sikh / Parsi / Muslim / Christian, plus the harvest and new-year festivals that
     belong to a place rather than to a faith. Several states have more entries here than
     Delhi does. That is deliberate.

   · NO FESTIVAL IS THE "BIGGEST" ONE. The words "main", "biggest", "most important" appear
     nowhere below. For a Malayali family Onam is the year; for an Assamese family it is
     Bihu. Ranking them is exactly the harm this file is meant to undo.

   · NO DATES. EVER. Editorial rule 3 is absolute and it bites hardest here, because every
     instinct says "put the date in, it's a festival app". We do not. Each entry carries
     `months[]` — the Gregorian months it can fall in — and the app must say plainly that
     the day is set by a lunar or lunisolar reckoning and varies by region and by family.
     Christmas carries December because it is a fixed date, not an invented one. Eid carries
     all twelve months because the Islamic calendar is purely lunar and genuinely walks
     through the whole year. When real dates are wanted they must come from a maintained
     almanac feed, not from this file and not from a model.

   · BADGES: 'aaj' or 'katha' only, never 'itihaas'. Editorial rule 2 says an Itihaas object
     ships with `sources[]` or it does not ship. This file was written as practice-and-story,
     not as a cited history pass, so nothing here claims to be evidence. Where a festival has
     a documented institutional history worth telling, that belongs in a future Itihaas card
     with real citations attached — not smuggled in here. Entries are 'aaj' where the body is
     about how it is kept today, 'katha' where the body is the story as it is told.

   · `needs_review: true` IS NOT AN APOLOGY. Two different kinds of entry carry it, and each
     one says why in `review`:
       (a) festivals whose fuller history touches conflict, martyrdom, colonial violence or
           an antagonist figure — Baisakhi, Hola Mohalla, Prakash Purab, Ram Navami,
           Vijayadashami, Losar. Per editorial rule 6 the entry here is kept to celebratory
           practice and the rest is left for a human author with a named reviewer. We did not
           write around it; we stopped and flagged it.
       (b) festivals belonging to communities outside the four commissioned traditions, or to
           communities whose detail we have no business asserting from a distance — Eid,
           Christmas, Wangala, Chapchar Kut, Nuakhai. These need a reviewer from inside the
           community before they ship, and they are marked accordingly.

   · SCRIPT. `script` is the festival's name in its own script where it has one, and null
     where it honestly doesn't — Mizo and Garo are written in the Roman script, so Chapchar
     Kut and Wangala carry null rather than a Devanagari transliteration that no Mizo or Garo
     family would recognise. Ugadi / Gudi Padwa carries three scripts in one string because
     that is the truthful answer. Devanagari here must be set per the CLAUDE.md typography
     rule; so must Bengali-Assamese, Gurmukhi, Tamil, Malayalam, Telugu, Kannada, Odia,
     Gujarati, Tibetan and Nastaliq. If a face is missing, romanise — do not fake it.

   · `faith` is the tradition the festival belongs to; `also` lists other communities that
     keep the same day in their own way, because Diwali being three different festivals on
     one night is the single best lesson in this file. 'seasonal' is used for harvest and
     new-year festivals that belong to a place and a crop rather than to a faith — it is a
     description, not a demotion.

   · PRESENCE HAS NO NUMBERS IN IT. `presence.count` is a template with {n} in it. This file
     never contains a count, a target or an example figure that could leak to screen. And
     because a low number on a small festival would teach the child the opposite of what this
     feature is for, `presence.small` carries six lines for exactly that case — written so
     that "few" reads as "rare and yours", never as "nobody cares".

   · CHILD DATA. The count is an aggregate and nothing else. No child name, no location, no
     photo, no free text goes anywhere near it, in India, the EU or anywhere else — see the
     child-data rule in CLAUDE.md. The share card is generated by and for the PARENT.

   PLACEHOLDERS used in `presence` copy: {n} count · {days} days remaining · {festival}
   festival name · {child} the child's first name. Nothing else. */

window.IND_UTSAV = {

  intro: 'In India, a festival is not something one family does. The whole street does it, ' +
         'and the school shuts, and you can hear it. Here it can feel like only your house ' +
         'knows. It isn’t — and this is where you find out how many of you there are.',

  /* Legend for the app, so the badge is explained where the child meets it. */
  badges: {
    aaj: 'How it lives today — real families, right now, in all their variety.',
    katha: 'A story as it is told.'
  },

  festivals: [

    /* ═══════════════════════════════════════════ DEEP WINTER · the harvest turn */

    {
      id: 'lohri',
      name: 'Lohri', script: 'ਲੋਹੜੀ', roman: 'Lohṛī',
      faith: 'seasonal', also: ['sikh', 'hindu'],
      region: 'north', states: ['PB', 'HR', 'CH', 'HP', 'DL', 'JK'],
      months: ['January'],
      badge: 'aaj', needs_review: false,
      kid: 'On the coldest night of the Punjabi year, everyone lights a big bonfire and stands ' +
           'around it. You throw popcorn and sesame sweets into the flames and wish for a good year.',
      big: 'Lohri marks the end of the deepest winter and the coming sugarcane harvest. Families ' +
           'gather round a bonfire at night, throw in popcorn, rewri and gajak, walk around it, ' +
           'and sing — the old song is about Dulla Bhatti, a folk hero of Punjab. In many ' +
           'families it is an especially big night when there has been a wedding or a baby that year.',
      story: null,
      do: [
        'Light one candle after dark and stand around it with whoever is home — this is a fire-and-cold festival, and a candle counts.',
        'Make popcorn. Popcorn is genuinely the Lohri food and it costs nothing.',
        'Learn the first line of "Sunder mundriye" and sing it badly at someone. That is the correct way to sing it.',
        'Go outside for one minute in the cold, then come back to the warm. That is the whole feeling of the festival.',
        'Call the coldest-living relative you have and tell them Happy Lohri.'
      ],
      variations: [
        'In many Punjabi families the biggest Lohri is the first one after a wedding or a new baby, and the whole extended family turns up for that one.',
        'In many Sikh and Hindu Punjabi households the same night is kept, and the day after is Maghi — which is a gurdwara morning, not a bonfire.',
        'In Jammu the same turn of the season is called Lohri too, and in the hills of Himachal the bonfire is smaller and the singing goes on longer.'
      ],
      ask: 'Ask a grandparent what they used to shout at the bonfire, and who gave them their rewri.',
      words: [
        { term: 'ਲੋਹੜੀ', roman: 'Lohri', en: 'the bonfire night before the harvest turn' },
        { term: 'ਰਿਓੜੀ', roman: 'rewri', en: 'sesame-and-jaggery sweets thrown into the fire' },
        { term: 'ਗੱਚਕ', roman: 'gajak', en: 'brittle sesame slab, eaten only in winter' }
      ]
    },

    {
      id: 'makar-sankranti',
      name: 'Makar Sankranti', script: 'मकर संक्रांति', roman: 'Makar Saṅkrānti',
      faith: 'hindu', also: ['seasonal'],
      region: 'pan-india', states: ['GJ', 'MH', 'UP', 'BR', 'RJ', 'MP', 'KA', 'AP', 'TG', 'WB', 'OR', 'JH', 'HR', 'PB', 'AS'],
      months: ['January'],
      badge: 'aaj', needs_review: false,
      kid: 'This is the day the sun starts moving back towards the north, so the days get longer ' +
           'again. In lots of places people fly kites all day until they can’t see them any more.',
      big: 'One of the few Indian festivals fixed to the sun rather than the moon, which is why it ' +
           'lands in mid-January nearly every year. It marks the sun’s turn northward — the end of ' +
           'the coldest stretch — and it goes by a different name in almost every state. Sesame and ' +
           'jaggery are eaten nearly everywhere, because both are winter foods that warm you up.',
      story: null,
      do: [
        'Fly a kite, or make one out of a paper bag and string and fly it badly. Badly is fine.',
        'Eat something with sesame in it and say the Marathi line that goes with it: "til gul ghya, god god bola" — take this sweet, and speak sweetly.',
        'Find out what your family calls this day. It has at least eight names and yours is one of them.',
        'Stand outside and notice that it is light later than it was in December. That is literally what the festival is about.'
      ],
      variations: [
        'In many Gujarati families it is Uttarayan and it is a kite war on the roof, all day, with a whole vocabulary for cutting someone else’s string.',
        'In many Maharashtrian families you hand people til-gul and say "til gul ghya, god god bola" — and that sentence does the work of an apology, if one was needed.',
        'In many Bengali families it is Poush Sankranti and the day is about pithe — rice-flour sweets with date-palm jaggery — not kites at all.',
        'In many Assamese families the same turn is Magh Bihu, with a night of feasting and bonfires; in many Tamil families it is Pongal.'
      ],
      ask: 'Ask a grandparent whether they flew kites or ate pithe or lit a bonfire — the answer tells you where your family is from.',
      words: [
        { term: 'तिल', roman: 'til', en: 'sesame' },
        { term: 'गुड़', roman: 'gud', en: 'jaggery — raw cane sugar' },
        { term: 'पतंग', roman: 'patang', en: 'kite' }
      ]
    },

    {
      id: 'pongal',
      name: 'Pongal', script: 'பொங்கல்', roman: 'Poṅgal',
      faith: 'seasonal', also: ['hindu'],
      region: 'south', states: ['TN', 'PY', 'KL', 'KA', 'AN'],
      months: ['January'],
      badge: 'aaj', needs_review: false,
      kid: 'Rice and milk are boiled in a pot until they bubble right over the edge — and when ' +
           'they spill, everyone shouts "Pongalo Pongal!" The spilling over is the point: it means plenty.',
      big: 'A four-day Tamil harvest festival and the one Tamil families abroad hold on to hardest. ' +
           'Thanks go to the sun, to the rain, and to the cattle that did the ploughing. New pots, ' +
           'new clothes, kolam at the door, sugarcane in the house, and a pot deliberately allowed ' +
           'to boil over, because a pot that overflows is the oldest picture of abundance there is.',
      story: null,
      days: [
        { name: 'Bhogi', do: 'Throw out or give away one thing you have stopped using.' },
        { name: 'Thai Pongal', do: 'Boil rice with milk and let it bubble over, and shout when it does.' },
        { name: 'Mattu Pongal', do: 'Thank an animal. Feed a pet, or read about the cattle that pulled the plough.' },
        { name: 'Kaanum Pongal', do: 'Go and see people. That is the entire instruction for the day.' }
      ],
      do: [
        'Boil rice in milk in the biggest pot you are allowed to use, and let it rise over the rim. Shout "Pongalo Pongal!" when it does.',
        'Draw a kolam at the front door with chalk. Outside a flat, the corridor floor works and it washes off.',
        'Thank an animal out loud on Mattu Pongal. A dog, a cat, or the cows in a picture.',
        'On the last day, go and see somebody — a neighbour, a cousin on a call. That is what Kaanum Pongal is for.',
        'Say "Iniya Pongal nalvazhthukkal" to one Tamil-speaking person.'
      ],
      variations: [
        'In many Tamil families the pot is a brand-new one every year, tied with turmeric and ginger still on the root, and nobody uses last year’s.',
        'In many Tamil families in Sri Lanka and Malaysia the same four days are kept with slightly different foods and the same shout.',
        'In many Andhra and Telangana families the same days are Sankranti, with rangavalli at the door and a very different food list.'
      ],
      ask: 'Ask a grandparent who used to hold the pot, and whether anybody ever let it burn.',
      words: [
        { term: 'பொங்கல்', roman: 'pongal', en: 'it boils over / the dish itself' },
        { term: 'கோலம்', roman: 'kolam', en: 'rice-flour pattern drawn at the doorstep' },
        { term: 'தை', roman: 'Thai', en: 'the Tamil month this falls in' }
      ]
    },

    {
      id: 'prakash-purab-gobind-singh',
      name: 'Guru Gobind Singh Prakash Purab', script: 'ਪ੍ਰਕਾਸ਼ ਪੁਰਬ', roman: 'Prakāsh Purab',
      faith: 'sikh',
      region: 'north', states: ['PB', 'HR', 'CH', 'DL', 'JK', 'UP', 'BR', 'MH'],
      months: ['December', 'January'],
      badge: 'aaj',
      needs_review: true,
      review: 'The tenth Guru’s life includes conflict and family martyrdom. This entry is kept ' +
              'deliberately to the celebratory practice — the gurdwara, the kirtan, the langar. ' +
              'The rest is for a human author with a named Sikh reviewer (docs/05 §6.5).',
      kid: 'This is the birthday of Guru Gobind Singh, the tenth Sikh Guru. Gurdwaras are lit up, ' +
           'people sing all day, and everybody eats together in the langar.',
      big: 'Prakash Purab means "the festival of the light coming"— a Guru’s birth. Sikhs mark it ' +
           'with continuous singing of the Guru Granth Sahib, a nagar kirtan procession through the ' +
           'streets in many cities, and langar, the free kitchen where anyone at all may eat and ' +
           'everyone sits in the same row on the same floor.',
      story: null,
      do: [
        'Cook something and give a plate of it to someone who did not expect it. That is the langar idea, done small.',
        'Look up your nearest gurdwara. There is one closer than you think, and the langar is open to anyone.',
        'Wash up after a meal without being asked, and don’t mention it. Seva is meant to be quiet.',
        'Learn to say "Waheguru ji ka Khalsa, Waheguru ji ki Fateh" — the greeting of the day.'
      ],
      variations: [
        'In many Sikh families the day is spent mostly at the gurdwara, and the food at home is simple because the eating happens there.',
        'In many Punjabi families outside India the nagar kirtan is the one day of the year when the whole community is visible on the street of a foreign town — which is exactly the feeling this app is about.'
      ],
      ask: 'Ask a grandparent which gurdwara they grew up going to, and what the langar there served.',
      words: [
        { term: 'ਪ੍ਰਕਾਸ਼ ਪੁਰਬ', roman: 'Prakash Purab', en: 'the festival of a Guru’s birth' },
        { term: 'ਲੰਗਰ', roman: 'langar', en: 'the free kitchen — anyone may eat' },
        { term: 'ਸੇਵਾ', roman: 'seva', en: 'service done without being asked or thanked' }
      ]
    },

    {
      id: 'losar',
      name: 'Losar', script: 'ལོ་གསར་', roman: 'Losar',
      faith: 'buddhist',
      region: 'himalaya', states: ['LA', 'JK', 'HP', 'SK', 'AR', 'UK', 'WB'],
      months: ['December', 'January', 'February', 'March'],
      badge: 'aaj',
      needs_review: true,
      review: 'Kept by Ladakhi, Sikkimese, Monpa, Sherpa and Tibetan communities in India, whose ' +
              'observances and histories differ. A practitioner reviewer from these communities ' +
              'should check the detail and the framing before this ships.',
      kid: 'This is New Year in the high mountains. Houses are swept out completely, monasteries ' +
           'fill with masked dancers, and everyone eats a noodle soup with surprises hidden in the dumplings.',
      big: 'Losar means "new year" in Tibetan. Before it, houses are cleaned out and the old year’s ' +
           'dust is deliberately thrown away. Monasteries hold cham — masked dances performed by ' +
           'monks. On the eve, families eat guthuk, a soup with dumplings that have small objects ' +
           'hidden inside, each one a joke about the person who gets it.',
      story: 'jt.hare-moon',
      do: [
        'Clean out one drawer or one shelf completely and throw away what is dead in it. That is the actual practice.',
        'Make dumplings or noodles and hide something silly in one of them — a peppercorn, a twist of paper — and see who gets it.',
        'Say "Tashi delek" to somebody. It is the greeting of the day and it means good fortune to you.',
        'Look at a photograph of a Himalayan monastery in the snow and find the prayer flags.'
      ],
      variations: [
        'In many Ladakhi families Losar is kept two months earlier than the Tibetan one, in the depth of winter — the same festival, a different month, and both are correct.',
        'In many Sikkimese and Monpa households the monastery dances matter most and the house is quieter; in others the eve at home with guthuk is the whole thing.'
      ],
      ask: 'Ask an older relative what New Year smelled like where they grew up — every New Year in India has a different smell.',
      words: [
        { term: 'ལོ་གསར་', roman: 'Losar', en: 'new year' },
        { term: 'བཀྲ་ཤིས་བདེ་ལེགས།', roman: 'Tashi delek', en: 'good fortune to you — the greeting' },
        { term: 'དགུ་ཐུག', roman: 'guthuk', en: 'the noodle soup eaten on the eve' }
      ]
    },

    /* ═══════════════════════════════════════════ LATE WINTER INTO SPRING */

    {
      id: 'maha-shivaratri',
      name: 'Maha Shivaratri', script: 'महाशिवरात्रि', roman: 'Mahā Śivarātri',
      faith: 'hindu',
      region: 'pan-india', states: ['UP', 'MP', 'RJ', 'GJ', 'MH', 'KA', 'TN', 'AP', 'TG', 'JK', 'HP', 'UK', 'OR', 'WB', 'BR', 'KL'],
      months: ['February', 'March'],
      badge: 'katha', needs_review: false,
      kid: 'This is Shiva’s night, and people stay awake for it. Milk and water are poured over the ' +
           'Shivling, and bel leaves are offered, and in many houses somebody tries very hard not to fall asleep.',
      big: 'The great night of Shiva. Many families keep a fast and a vigil, going to the temple after ' +
           'dark, offering water, milk and bel leaves, and chanting "Om Namah Shivaya" through the ' +
           'night. Shiva is the one who is at home in the wild places — ash on his body, the Ganga in ' +
           'his hair, the mountain for a house — and this is the night that belongs to him.',
      story: null,
      do: [
        'Try to stay up half an hour past bedtime with a grown-up. That is a child-sized vigil and it counts.',
        'Learn to say "Om Namah Shivaya" and say it five times slowly.',
        'Pour water over a stone in the garden or a plant pot and think about what it is for. Water is the whole offering.',
        'Find the Ganga on the map and follow it from the Himalaya to the sea, because Shiva is said to have caught it in his hair.'
      ],
      variations: [
        'In many Kashmiri Pandit families this is Herath, kept over several days at home with walnuts soaked in water, and it is the family festival of the year.',
        'In many Tamil families the night is spent at the temple with the Thiruvasagam sung aloud; in many Telugu families the fast is strict and the temple queue starts before dawn.',
        'In many families nobody fasts at all and the day is simply a quiet temple visit — that is also normal, and your family gets to decide.'
      ],
      ask: 'Ask a grandparent whether they ever managed to stay awake the whole night, honestly.',
      words: [
        { term: 'रात्रि', roman: 'ratri', en: 'night' },
        { term: 'बेलपत्र', roman: 'belpatra', en: 'the three-lobed bel leaf offered to Shiva' },
        { term: 'ॐ नमः शिवाय', roman: 'Om Namah Shivaya', en: 'the chant of the night' }
      ]
    },

    {
      id: 'holi',
      name: 'Holi', script: 'होली', roman: 'Holī',
      faith: 'hindu', also: ['seasonal'],
      region: 'pan-india', states: ['UP', 'BR', 'MP', 'RJ', 'HR', 'DL', 'PB', 'GJ', 'MH', 'WB', 'OR', 'JH', 'CT', 'UK', 'GA'],
      months: ['February', 'March'],
      badge: 'aaj', needs_review: false,
      kid: 'This is the day everyone is allowed to throw colour at everyone else, and nobody is ' +
           'allowed to be cross about it. The night before, there is a bonfire.',
      big: 'Spring arrives and the rules relax. On the eve there is Holika Dahan, a bonfire; the next ' +
           'day is the colour — dry powder, water, whole streets of it — and for that one day the ' +
           'usual order of who may tease whom is suspended. "Bura na mano, Holi hai" is the standard ' +
           'defence: don’t take it badly, it’s Holi.',
      story: null,
      do: [
        'Put one colour on one person’s cheek and say "Bura na mano, Holi hai". Ask first; in a country where this isn’t a public holiday, asking first is part of it.',
        'Make colour from turmeric, beetroot juice or spinach water. This is how it used to be made anyway.',
        'Eat something sweet you are not usually allowed to. Gujiya if someone will make it; anything if not.',
        'Wear the oldest clothes you own all day, on purpose, and enjoy that nobody can tell you off about them.',
        'Send a photo of your coloured face to someone in India and let them be jealous of your Tuesday.'
      ],
      variations: [
        'In many Braj families around Mathura and Barsana, Holi runs for days and includes Lathmar Holi, where the women of Barsana chase the men off with sticks and everyone finds this hilarious.',
        'In many Bengali families the day is Dol Jatra or Basanta Utsav, with songs and dry colour and white clothes, and it looks nothing like a north Indian Holi.',
        'In many Goan families the season is Shigmo, with folk processions and drums; in many Maharashtrian and Malwa families the colour day is Rang Panchami, several days after the bonfire.'
      ],
      ask: 'Ask a grandparent what they used to make their colour out of, and who they were most afraid of on Holi.',
      words: [
        { term: 'रंग', roman: 'rang', en: 'colour' },
        { term: 'गुलाल', roman: 'gulal', en: 'the dry coloured powder' },
        { term: 'बुरा न मानो, होली है', roman: 'Bura na mano, Holi hai', en: 'don’t take it badly — it’s Holi' }
      ]
    },

    {
      id: 'hola-mohalla',
      name: 'Hola Mohalla', script: 'ਹੋਲਾ ਮਹੱਲਾ', roman: 'Holā Mohallā',
      faith: 'sikh',
      region: 'north', states: ['PB', 'HR', 'CH', 'HP', 'DL'],
      months: ['February', 'March'],
      badge: 'aaj',
      needs_review: true,
      review: 'Held at Anandpur Sahib and centred on the Khalsa; the fuller history involves ' +
              'conflict. Kept here to the practice — the horsemanship, the kirtan, the langar. ' +
              'A named Sikh reviewer before ship.',
      kid: 'The day after Holi, thousands of people gather at Anandpur Sahib in Punjab to watch ' +
           'riders on horses do things that look impossible. Everybody there is fed for free, for days.',
      big: 'Hola Mohalla is a Sikh gathering held over several days at Anandpur Sahib in Punjab. ' +
           'There is gatka — a martial art done with wooden weapons — bareback horsemanship by the ' +
           'Nihang orders, poetry and kirtan competitions, and langar on an enormous scale, cooked ' +
           'and served by volunteers for anyone who walks in.',
      story: null,
      do: [
        'Watch a short clip of gatka with a grown-up and notice that it is a skill, practised for years, not a fight.',
        'Help make and hand out food to somebody outside your family. Volume is not the point; volunteering is.',
        'Learn what "Chardi Kala" means — rising spirits, staying cheerful in a hard time — and use it once this week.',
        'Find Anandpur Sahib on the map of Punjab.'
      ],
      variations: [
        'In many Sikh families Holi colour is played too, and Hola Mohalla the next day is the part that actually matters.',
        'In many Punjabi families outside India there is no Anandpur Sahib to go to, so the local gurdwara holds a gatka demonstration in a hall and everyone brings their children.'
      ],
      ask: 'Ask a grandparent whether they ever went to Anandpur Sahib, and what the crowd was like.',
      words: [
        { term: 'ਗਤਕਾ', roman: 'gatka', en: 'the Sikh martial art, practised with wooden weapons' },
        { term: 'ਚੜ੍ਹਦੀ ਕਲਾ', roman: 'Chardi Kala', en: 'rising spirits — staying high-hearted whatever comes' }
      ]
    },

    {
      id: 'chapchar-kut',
      name: 'Chapchar Kut', script: null, roman: 'Chapchar Kut',
      faith: 'seasonal',
      region: 'northeast', states: ['MZ'],
      months: ['March'],
      badge: 'aaj',
      needs_review: true,
      review: 'A Mizo community festival. Detail should be checked and, ideally, written by ' +
              'somebody Mizo before it ships. Flagged for accuracy, not sensitivity.',
      kid: 'This is Mizoram’s spring festival. The best-known part is a dance done between long ' +
           'bamboo poles that clap together — you have to step in and out without getting caught.',
      big: 'Chapchar Kut comes in spring, after the hard work of clearing the fields and before the ' +
           'planting. It is a festival of relief and of dancing: the famous one is Cheraw, where ' +
           'pairs of people tap long bamboo poles together on the ground while dancers step between ' +
           'them in time. Mizo is written in the Roman script, which is why this festival’s name has ' +
           'no other script to show you.',
      story: null,
      do: [
        'Try Cheraw with two brooms or two rulers on the floor and two people tapping them together — slowly at first. This genuinely works.',
        'Clap a steady beat and keep it going for a whole minute without speeding up. Harder than it sounds, and it is the skill the dance runs on.',
        'Find Mizoram on the map and see how far it is from Delhi. Then check how far it is from Myanmar.',
        'Learn that Mizo is written in the same letters as English, and think about why that is unusual for an Indian language.'
      ],
      variations: [
        'In many Mizo families the festival is now held in a town hall or a stadium rather than a village clearing, and the dance is what has carried through.',
        'In Mizo communities outside Mizoram — in Delhi, in Bengaluru, in Chennai — Chapchar Kut is often the one day of the year the whole community meets, hires a hall and dances.'
      ],
      ask: 'Ask a grown-up which Indian festivals they had never heard of until they left India. Most people have a list.',
      words: [
        { term: 'Cheraw', roman: 'Cheraw', en: 'the bamboo dance of Mizoram' },
        { term: 'Kut', roman: 'kut', en: 'festival, in Mizo' }
      ]
    },

    {
      id: 'ugadi-gudi-padwa',
      name: 'Ugadi · Gudi Padwa', script: 'ఉగాది · ಯುಗಾದಿ · गुढी पाडवा', roman: 'Ugādi · Guḍhī Pāḍvā',
      faith: 'hindu', also: ['seasonal'],
      region: 'south-west', states: ['AP', 'TG', 'KA', 'MH', 'GA', 'MP'],
      months: ['March', 'April'],
      badge: 'aaj', needs_review: false,
      kid: 'This is New Year in several parts of India. In some houses you eat one thing that is ' +
           'sweet and bitter and sour and hot all at once — because a year has all of those in it.',
      big: 'The same first day of the lunar new year, kept under different names: Ugadi in Andhra, ' +
           'Telangana and Karnataka, Gudi Padwa in Maharashtra and Goa. In Maharashtra a gudi — a ' +
           'bright cloth on a pole with a copper pot on top — is raised at the door. In Andhra and ' +
           'Telangana the food is Ugadi pachadi, made with six tastes at once; in Karnataka it is ' +
           'bevu-bella, neem and jaggery, bitter and sweet eaten together on purpose.',
      story: null,
      do: [
        'Taste something bitter and something sweet in the same mouthful — a tiny bit of dark chocolate and a raisin will do — and say out loud what the year might hold.',
        'Make a gudi: a scarf tied to a broom handle by the door, with a cup upside down on top.',
        'Write one thing you want to get better at this year and put it where you will see it.',
        'Say "Ugadi subhakankshalu" or "Gudi Padwa chya hardik shubhechha", depending on which is yours.'
      ],
      variations: [
        'In many Marathi families the gudi goes up at sunrise and comes down before sunset, and neighbours compare whose is highest.',
        'In many Telugu and Kannada families the day begins with the pachadi or bevu-bella and then the panchangam — the year’s almanac — is read aloud to the family.',
        'In many Sindhi families the same season brings Cheti Chand, and in many Kashmiri Pandit families it is Navreh — different names, the same turn of the year.'
      ],
      ask: 'Ask a grandparent what the almanac reading was like, and whether anyone in the family actually believed the predictions.',
      words: [
        { term: 'ఉగాది', roman: 'Ugadi', en: 'the beginning of an age — new year' },
        { term: 'गुढी', roman: 'gudi', en: 'the flag-and-pot raised at the door' },
        { term: 'ಬೇವು ಬೆಲ್ಲ', roman: 'bevu-bella', en: 'neem and jaggery — bitter with sweet' }
      ]
    },

    {
      id: 'navroz',
      name: 'Navroz', script: 'નવરોઝ', roman: 'Navroz',
      faith: 'parsi',
      region: 'west', states: ['MH', 'GJ', 'DL', 'KA'],
      months: ['March', 'July', 'August'],
      badge: 'aaj', needs_review: false,
      kid: 'This is New Year for Parsi families in India. The house is cleaned, a special table is ' +
           'laid out with things that mean good luck, and everyone visits everyone.',
      big: 'Navroz means "new day". Parsis came to India from Persia more than a thousand years ago ' +
           'and have kept it ever since. The house is cleaned and chalk patterns are drawn at the ' +
           'door; a table is laid with items each standing for something — a fish, a flame, fruit, ' +
           'coins, a mirror. Then everyone eats, and the eating goes on for most of the day.',
      story: null,
      do: [
        'Clean your room properly before the day, not on it. That is the actual custom and it is not a trick.',
        'Lay out five things on a table that mean something good to you and explain each one to someone.',
        'Say "Navroz Mubarak" to a Parsi friend if you have one, and look up the Parsi community of Mumbai if you don’t.',
        'Draw a chalk pattern at your own front door.'
      ],
      variations: [
        'Some Parsi families keep Navroz in March at the spring equinox, and others keep it in July or August, because two different Parsi calendars are in use — both are right, and both are kept in the same city.',
        'In many Parsi families in Mumbai the day is as much about lunch as anything else, and the dhansak and the sev come out for it.'
      ],
      ask: 'Ask a grown-up whether they have ever been to a Parsi home for Navroz — the Parsis are one of India’s smallest communities and one of its most visible.',
      words: [
        { term: 'નવરોઝ', roman: 'Navroz', en: 'new day — new year' },
        { term: 'નવરોઝ મુબારક', roman: 'Navroz Mubarak', en: 'happy new year' }
      ]
    },

    {
      id: 'mahavir-jayanti',
      name: 'Mahavir Jayanti', script: 'महावीर जयंती', roman: 'Mahāvīr Jayantī',
      faith: 'jain',
      region: 'pan-india', states: ['GJ', 'RJ', 'MH', 'MP', 'KA', 'TN', 'DL', 'UP', 'BR', 'JH'],
      months: ['March', 'April'],
      badge: 'aaj', needs_review: false,
      kid: 'This is the birthday of Mahavira, the twenty-fourth Jain teacher. It is a gentle day — ' +
           'no noise, no fireworks, and nobody eats anything that had to be harmed.',
      big: 'Jains mark the birth of Mahavira, the twenty-fourth Tirthankara — not the first, the ' +
           'last of a long line. Temples are decorated, a procession carries an image through the ' +
           'streets in many cities, and food is given to those who need it. The teaching the day ' +
           'belongs to is ahimsa: not harming, carried further than almost anybody else carries it.',
      story: 'jn.chandkaushik',
      do: [
        'Eat one meal that harmed nothing, and notice how much thinking that takes.',
        'Move an insect outside instead of the other thing. That is ahimsa, exactly.',
        'Say something you were about to say more kindly. Jains count words as a way of causing harm too.',
        'Learn what anekantavada means — many-sidedness — and try it in one argument this week.'
      ],
      variations: [
        'In many Jain families the day is quiet and spent at the derasar or the temple; in many others there is a large procession through the town and the whole community walks it.',
        'In many Shvetambara and Digambara families the customs differ — Jains are not one single practice either, and it is worth asking which yours is.'
      ],
      ask: 'Ask a grown-up whether they have ever visited a Jain temple, and what was different about how quiet it was.',
      words: [
        { term: 'अहिंसा', roman: 'ahimsa', en: 'not harming' },
        { term: 'तीर्थंकर', roman: 'Tirthankara', en: 'one who makes a crossing-place' },
        { term: 'अनेकांतवाद', roman: 'anekantavada', en: 'many-sidedness — you are right, and not about all of it' }
      ]
    },

    /* ═══════════════════════════════════════════ THE NEW-YEAR CLUSTER · mid-April */

    {
      id: 'baisakhi',
      name: 'Baisakhi · Vaisakhi', script: 'ਵੈਸਾਖੀ', roman: 'Vaisākhī',
      faith: 'sikh', also: ['seasonal', 'hindu'],
      region: 'north', states: ['PB', 'HR', 'CH', 'HP', 'DL', 'JK', 'UK'],
      months: ['April'],
      badge: 'aaj',
      needs_review: true,
      review: 'Vaisakhi is both the Punjabi harvest and the founding of the Khalsa in 1699, and ' +
              'the same date carries a painful colonial-era association in Punjab. Kept here ' +
              'strictly to harvest and gurdwara practice; a named Sikh reviewer and a historian ' +
              'before anything more is written.',
      kid: 'The wheat is ready, so Punjab dances. It is also a very big day at the gurdwara, with ' +
           'singing from early morning and langar all day.',
      big: 'Vaisakhi is the Punjabi harvest festival — the wheat is in, and bhangra and giddha are ' +
           'danced in the fields and now in halls all over the world. It is also one of the ' +
           'most important days in the Sikh year, marking the founding of the Khalsa, and gurdwaras ' +
           'are full from before dawn. In several other parts of India the same mid-April day is the ' +
           'new year under another name.',
      story: 'sk.langar-akbar',
      do: [
        'Learn one bhangra move. One. The shoulder one. Then do it in the kitchen.',
        'Eat something made of wheat and remember that is what the whole festival is about.',
        'Help cook for more people than live in your house, and give the extra away.',
        'Say "Waheguru ji ka Khalsa, Waheguru ji ki Fateh" and find out what it means before you say it.'
      ],
      variations: [
        'In many Sikh families the morning is entirely at the gurdwara and the dancing comes after; in many Punjabi Hindu families the day is a harvest fair and a river bath.',
        'In many Punjabi families abroad, Vaisakhi is the one day a year the town centre fills with a nagar kirtan and free food handed to complete strangers.',
        'On or around the same mid-April day, many Bengali families keep Poila Boishakh, many Tamil families Puthandu, many Malayali families Vishu and many Assamese families Rongali Bihu — the same turn of the year, four different new years.'
      ],
      ask: 'Ask a grandparent whether they ever saw the wheat harvest, and what the fields sounded like.',
      words: [
        { term: 'ਵੈਸਾਖੀ', roman: 'Vaisakhi', en: 'the harvest festival, named for the month' },
        { term: 'ਭੰਗੜਾ', roman: 'bhangra', en: 'the harvest dance' },
        { term: 'ਕਣਕ', roman: 'kanak', en: 'wheat' }
      ]
    },

    {
      id: 'bihu',
      name: 'Bihu', script: 'বিহু', roman: 'Bihu',
      faith: 'seasonal',
      region: 'northeast', states: ['AS', 'AR', 'ML', 'NL'],
      months: ['January', 'April', 'October'],
      badge: 'aaj', needs_review: false,
      kid: 'Assam has three Bihus in a year — one for planting, one for eating, and one quiet one ' +
           'in between. The spring one is the big dance, with a drum and a buffalo-horn pipe.',
      big: 'Bihu is Assam’s year, kept three times. Rongali or Bohag Bihu comes in April with the ' +
           'sowing and the new year: dancing, the dhol, the pepa made from a buffalo horn, and ' +
           'gamosas — white cloths with red woven borders — given as a mark of respect. Magh or ' +
           'Bhogali Bihu comes in January and is about eating, with feasts and bonfires. Kati or ' +
           'Kongali Bihu in October is the lean one, when the rice is still growing and lamps are ' +
           'lit in the fields, and it is quiet on purpose.',
      story: null,
      do: [
        'Give somebody a cloth — a scarf, a towel, anything — with both hands, the way a gamosa is given. Both hands is the whole point.',
        'Find a beat on a table with both hands and keep it while somebody else dances. Bihu runs on the dhol.',
        'Eat something made of rice and coconut. Assamese pitha is exactly that.',
        'Find the Brahmaputra on the map and see how wide it is, then find Kaziranga next to it.'
      ],
      variations: [
        'In many Assamese families the January Bihu is the one about food and the April one is the one about dancing, and people are very clear which they prefer.',
        'In many Assamese families the gamosa is given to elders on Bihu morning as a way of touching their feet without saying anything — and it is one of the warmest customs in India.',
        'Many other Northeast communities keep their own spring and harvest festivals in the same weeks, under their own names.'
      ],
      ask: 'Ask a grandparent whether anyone in the family can play a dhol, and if not, who could.',
      words: [
        { term: 'গামোচা', roman: 'gamosa', en: 'the white cloth with a red border, given with both hands' },
        { term: 'ঢোল', roman: 'dhol', en: 'the drum Bihu is danced to' },
        { term: 'পিঠা', roman: 'pitha', en: 'rice cakes made for the festival' }
      ]
    },

    {
      id: 'vishu',
      name: 'Vishu', script: 'വിഷു', roman: 'Viṣu',
      faith: 'hindu', also: ['seasonal'],
      region: 'south', states: ['KL', 'KA', 'TN', 'PY'],
      months: ['April'],
      badge: 'aaj', needs_review: false,
      kid: 'On Vishu morning a grown-up leads you to a table with your eyes shut, and then you open ' +
           'them. The first thing you see on New Year is supposed to be something good.',
      big: 'The Malayalam new year. The night before, the Vishukkani is arranged: a lamp, a mirror, ' +
           'rice, fruit, coins, a cloth, and above all the golden kanikkonna flowers, which happen to ' +
           'bloom exactly now. Children are led to it with their eyes closed and open them onto it, so ' +
           'that the first sight of the year is a good one. Then the elders give kaineettam — coins ' +
           'pressed into the children’s hands.',
      story: null,
      do: [
        'Arrange five good things on a table the night before and lead somebody to it with their eyes shut in the morning.',
        'Find one yellow flower and put it on the table. In Kerala it would be kanikkonna.',
        'Give a coin to somebody younger than you and say "Vishu ashamsakal".',
        'Notice what the first thing you saw this morning was, and whether it was worth seeing.'
      ],
      variations: [
        'In many Malayali families the Vishukkani is arranged the night before by the mother and nobody else is allowed to look at it early.',
        'In many families in northern Kerala the day includes Vishu padakkam — small firecrackers at dawn — and in many others it stays entirely quiet.'
      ],
      ask: 'Ask a grandparent what was on the Vishukkani when they were small, and who used to arrange it.',
      words: [
        { term: 'വിഷുക്കണി', roman: 'Vishukkani', en: 'the first sight of the new year' },
        { term: 'കണിക്കൊന്ന', roman: 'kanikkonna', en: 'the golden flower that blooms exactly now' },
        { term: 'കൈനീട്ടം', roman: 'kaineettam', en: 'the coin an elder presses into your hand' }
      ]
    },

    {
      id: 'puthandu',
      name: 'Puthandu', script: 'புத்தாண்டு', roman: 'Puthāṇḍu',
      faith: 'hindu', also: ['seasonal'],
      region: 'south', states: ['TN', 'PY', 'KL', 'AN'],
      months: ['April'],
      badge: 'aaj', needs_review: false,
      kid: 'Tamil New Year. There is a dish you eat on this day that is sweet and sour and bitter ' +
           'and hot all at once, so that you taste the whole year in one spoon.',
      big: 'The first day of Chithirai, the first Tamil month. A kani of fruit, gold and a mirror is ' +
           'arranged to be seen first thing; a big kolam goes at the door; the panchangam is read; ' +
           'and mangai-pachadi is eaten — raw mango, neem flower, jaggery and chilli in one dish, ' +
           'deliberately containing every taste there is.',
      story: null,
      do: [
        'Taste four things in one sitting: something sweet, sour, bitter and spicy. Say which part of a year each one is.',
        'Draw a kolam at the door with chalk, or with rice flour if you are allowed.',
        'Say "Puthandu vazhthukkal" to a Tamil-speaking person.',
        'Set the table for someone else before they wake up.'
      ],
      variations: [
        'In many Tamil families the kani is seen first thing and nothing else happens until it has been; in many others the day is mostly the temple and the meal.',
        'In many Tamil families in Sri Lanka, Malaysia and Singapore the same day is kept, which is why "Tamil New Year" is a public holiday in more than one country.'
      ],
      ask: 'Ask a grandparent whether they liked mangai-pachadi as a child. Almost nobody did, and that is part of the joke.',
      words: [
        { term: 'புத்தாண்டு', roman: 'puthandu', en: 'new year' },
        { term: 'சித்திரை', roman: 'Chithirai', en: 'the first Tamil month' },
        { term: 'வாழ்த்துக்கள்', roman: 'vazhthukkal', en: 'good wishes' }
      ]
    },

    {
      id: 'poila-boishakh',
      name: 'Poila Boishakh', script: 'পয়লা বৈশাখ', roman: 'Poilā Boishākh',
      faith: 'seasonal', also: ['hindu'],
      region: 'east', states: ['WB', 'TR', 'AS', 'JH', 'AN'],
      months: ['April'],
      badge: 'aaj', needs_review: false,
      kid: 'Bengali New Year. Shops open a brand-new account book, everyone wears new clothes, and ' +
           'there are more sweets in the house than on any other day.',
      big: 'The first day of Boishakh. Traditionally shopkeepers begin a new ledger — halkhata — and ' +
           'invite their customers in for sweets, which is a lovely way to run a business. Families ' +
           'wear new clothes, eat a big meal, sing, and in Kolkata the day starts with processions ' +
           'and music before it is properly hot.',
      story: null,
      do: [
        'Start a brand-new notebook today and write the date at the top. That is halkhata, done exactly right.',
        'Eat something sweet before anything else — Bengali New Year genuinely begins with mishti.',
        'Say "Shubho Noboborsho" to somebody.',
        'Sing or play one Rabindrasangeet and find out who wrote it.'
      ],
      variations: [
        'In many Bengali families the day begins with a visit to the sweetshop and ends with a very large fish; in many others it is mostly music.',
        'In many Bengali families in Bangladesh and in Tripura the same day is kept with its own processions — the new year does not stop at a border.'
      ],
      ask: 'Ask a grandparent what was in the halkhata sweet box at their shop, or their neighbour’s.',
      words: [
        { term: 'শুভ নববর্ষ', roman: 'Shubho Noboborsho', en: 'happy new year' },
        { term: 'হালখাতা', roman: 'halkhata', en: 'the new account book opened today' },
        { term: 'মিষ্টি', roman: 'mishti', en: 'sweets' }
      ]
    },

    {
      id: 'ram-navami',
      name: 'Ram Navami', script: 'राम नवमी', roman: 'Rām Navamī',
      faith: 'hindu',
      region: 'pan-india', states: ['UP', 'BR', 'MP', 'MH', 'GJ', 'RJ', 'KA', 'TN', 'AP', 'TG', 'OR', 'JH', 'WB', 'UK'],
      months: ['March', 'April'],
      badge: 'katha',
      needs_review: true,
      review: 'Kept here to home and temple practice and to the Ramayana as story. The day has ' +
              'acquired a contested public dimension in recent years that has no place in a ' +
              'children’s product; a human author and a named reviewer before anything further.',
      kid: 'This is the day Rama was born. In many houses the Ramayana is read aloud, and in the ' +
           'south people drink a sweet cardamom drink made specially for it.',
      big: 'Ram Navami is kept on the ninth day of Chaitra and marks the birth of Rama. Many families ' +
           'read or hear the Ramayana across these days; temples hold recitations; in much of the ' +
           'south the day is marked with panakam, a jaggery-and-cardamom drink, and kosambari. In ' +
           'many families it is also a fasting day until noon.',
      story: 'ep.squirrel-bridge',
      do: [
        'Have one chapter of the Ramayana read to you out loud. Out loud is different from reading it.',
        'Make panakam: water, jaggery, a little cardamom, a squeeze of lemon. It is a real recipe and a child can make it.',
        'Learn the names of the four brothers, in order. Most grown-ups get this wrong.',
        'Ask which version of the Ramayana your family knows — there are dozens, in many languages, and they do not all agree.'
      ],
      variations: [
        'In many families in the south the day is quiet and domestic — panakam, a temple visit, no procession at all.',
        'In many Odia and Bengali families the day is kept modestly and the bigger Rama occasion in the year is a different one.',
        'In many families the story told is Tulsidas’s Ramcharitmanas; in many Tamil families it is Kamban’s; in many households in Southeast Asia it is a version with different names altogether.'
      ],
      ask: 'Ask a grandparent which Ramayana they grew up with, and in which language they first heard it.',
      words: [
        { term: 'नवमी', roman: 'navami', en: 'the ninth day of a lunar fortnight' },
        { term: 'पानकम्', roman: 'panakam', en: 'the jaggery and cardamom drink of the day' },
        { term: 'रामायण', roman: 'Ramayana', en: 'Rama’s journey — the epic' }
      ]
    },

    {
      id: 'buddha-purnima',
      name: 'Buddha Purnima', script: 'बुद्ध पूर्णिमा', roman: 'Buddha Pūrṇimā',
      faith: 'buddhist',
      region: 'pan-india', states: ['BR', 'UP', 'SK', 'AR', 'LA', 'JK', 'HP', 'MH', 'WB', 'TR', 'KA', 'DL'],
      months: ['April', 'May'],
      badge: 'aaj', needs_review: false,
      kid: 'On this full-moon day Buddhists remember the Buddha. Temples are lit with lamps, people ' +
           'give food away, and many families eat nothing that had to be harmed.',
      big: 'A full-moon day that Buddhists keep as the day of the Buddha’s birth, his awakening under ' +
           'the tree at Bodh Gaya, and his passing. Monasteries are decorated and lit; there is ' +
           'chanting, meditation and dana — giving. In India, Bodh Gaya and Sarnath fill with people ' +
           'who have travelled from all over Asia to be there.',
      story: 'ka.buddha-mustard',
      do: [
        'Sit still and count ten breaths. Ten. That is a real meditation and it is where everyone starts.',
        'Give something away today without being asked — food, a toy, your turn.',
        'Eat one meal that harmed nothing.',
        'Look up at the moon tonight and check that it is full. It is the calendar this festival runs on.'
      ],
      variations: [
        'In many Ladakhi, Sikkimese and Arunachali families the day is spent at a monastery, and butter lamps are lit in rows.',
        'In many Buddhist families in Maharashtra the day is kept alongside the memory of Dr Ambedkar, who chose Buddhism in 1956 and brought many others with him.',
        'Buddhism left India and changed as it travelled, so a Thai, Sri Lankan, Japanese and Ladakhi Buddha Purnima look genuinely different from one another.'
      ],
      ask: 'Ask a grown-up whether anyone in the family has been to Bodh Gaya or Sarnath, and what it was like.',
      words: [
        { term: 'पूर्णिमा', roman: 'purnima', en: 'full moon' },
        { term: 'दान', roman: 'dana', en: 'giving — the practice of the day' },
        { term: 'संघ', roman: 'sangha', en: 'the community; you are not meant to do this alone' }
      ]
    },

    {
      id: 'thrissur-pooram',
      name: 'Thrissur Pooram', script: 'തൃശ്ശൂർ പൂരം', roman: 'Thrissūr Pūram',
      faith: 'hindu',
      region: 'south', states: ['KL'],
      months: ['April', 'May'],
      badge: 'aaj', needs_review: false,
      kid: 'In one town in Kerala, rows of elephants stand facing each other in front of a temple ' +
           'while hundreds of drummers play together. The people up on the elephants swap enormous ' +
           'silk parasols above their heads, over and over, and the crowd roars every time.',
      big: 'Thrissur Pooram is a temple festival held in the Kerala summer. Its famous hour is the ' +
           'kudamattam: two lines of caparisoned elephants face each other, and the men on their ' +
           'backs exchange great silk parasols, one after another, each more astonishing than the ' +
           'last, while the crowd decides which side it likes. Around it runs the panchavadyam and ' +
           'the melam — percussion ensembles of hundreds of players building for hours.',
      story: null,
      do: [
        'Listen to a recording of chenda melam with a grown-up and try to hear it speeding up. It does that for an hour.',
        'Clap in time with somebody for two full minutes without either of you drifting. That is what a hundred drummers do for hours.',
        'Find Thrissur on the map of Kerala.',
        'Talk about elephants: why they are honoured here, and why more and more people in Kerala are now arguing about whether they should be in the festival at all. Both things are true at once.'
      ],
      variations: [
        'In many Malayali families the Pooram is a day out with a huge crowd and very loud drums; in many others the family stays home and watches it on television, which is also a tradition now.',
        'Almost every Kerala temple has its own pooram or utsavam at its own time of year — Thrissur is the one outsiders have heard of, not the only one that matters.'
      ],
      ask: 'Ask a grown-up from Kerala which pooram their own town holds. Nearly every town has one.',
      words: [
        { term: 'പൂരം', roman: 'pooram', en: 'a temple festival gathering' },
        { term: 'ചെണ്ട', roman: 'chenda', en: 'the cylindrical drum of Kerala' },
        { term: 'കുടമാറ്റം', roman: 'kudamattam', en: 'the exchanging of the parasols' }
      ]
    },

    /* ═══════════════════════════════════════════ MONSOON */

    {
      id: 'ratha-yatra',
      name: 'Ratha Yatra', script: 'ରଥଯାତ୍ରା', roman: 'Ratha Yātrā',
      faith: 'hindu',
      region: 'east', states: ['OR', 'WB', 'GJ', 'JH', 'AS', 'TR'],
      months: ['June', 'July'],
      badge: 'aaj', needs_review: false,
      kid: 'Once a year at Puri, three deities come out of their temple and ride through the town on ' +
           'three enormous wooden chariots. The chariots are pulled along the road by the crowd, on ' +
           'long ropes, by hand.',
      big: 'At Puri in Odisha, Jagannath, Balabhadra and Subhadra leave the temple and travel by ' +
           'chariot. The chariots are built new each year from fresh wood, they are pulled by ' +
           'thousands of people on long ropes, and before the journey the road is swept with a golden ' +
           'broom. The English word "juggernaut" comes from this — from the size of the chariots.',
      story: null,
      do: [
        'Sweep the floor before an important guest arrives. At Puri the sweeping is done first, by hand, and it matters.',
        'Build a chariot from a box and string and pull it down the hall with somebody riding on it.',
        'Find Puri on the coast of Odisha on the map.',
        'Learn that "juggernaut" is an Odia word that got into English, and tell someone at school.'
      ],
      variations: [
        'In many Odia families this is the festival of the year, and relatives travel home for it the way other families travel for Diwali.',
        'In many Bengali families a small household version is kept, with a little chariot pulled by the children of the street.',
        'In Ahmedabad and in cities all over the world, local Ratha Yatras are held by communities who cannot get to Puri.'
      ],
      ask: 'Ask a grandparent whether they have ever pulled a chariot rope, and how heavy it was.',
      words: [
        { term: 'ରଥ', roman: 'ratha', en: 'chariot' },
        { term: 'ଯାତ୍ରା', roman: 'yatra', en: 'journey' },
        { term: 'ଛେରା ପହଁରା', roman: 'chhera pahanra', en: 'the ceremonial sweeping of the road' }
      ]
    },

    {
      id: 'teej',
      name: 'Teej', script: 'तीज', roman: 'Tīj',
      faith: 'hindu', also: ['seasonal'],
      region: 'north', states: ['RJ', 'UP', 'BR', 'HR', 'PB', 'MP', 'JH', 'DL', 'UK'],
      months: ['July', 'August', 'September'],
      badge: 'aaj', needs_review: false,
      kid: 'The rains have finally come, everything has gone green, and swings are hung from the ' +
           'trees. Hands are covered in mehndi and there is a lot of singing.',
      big: 'Teej is the monsoon festival — the relief of the rain after the hot months. Swings go up ' +
           'in courtyards and under trees, women and girls wear green, mehndi is put on hands, and ' +
           'the songs are specific to the season. There is more than one Teej: Hariyali Teej in ' +
           'Shravan, Kajari Teej, and Hartalika Teej a little later, and different families keep ' +
           'different ones.',
      story: null,
      do: [
        'Get on a swing. Any swing. This festival is about swings and rain and it works anywhere.',
        'Draw a mehndi pattern on your own hand with a felt pen.',
        'Go outside in the rain on purpose, if it is raining. If it isn’t, this is a good day to be jealous of India.',
        'Wear something green.',
        'Learn one line of a Teej song from a grown-up who knows one.'
      ],
      variations: [
        'In many Rajasthani families Teej is a fair with processions in Jaipur, and green bangles and ghewar are the whole taste of the season.',
        'In many families in Uttar Pradesh and Bihar the day is a fast kept by married women; in many others it is simply the swing, the songs and the mehndi, kept by everybody.',
        'In many Nepali and Himalayan Indian families Teej is kept over several days with its own songs entirely.'
      ],
      ask: 'Ask a grandmother whether there was a swing in her house in the monsoon, and who pushed it.',
      words: [
        { term: 'तीज', roman: 'Teej', en: 'the third day of a lunar fortnight — the monsoon festival' },
        { term: 'झूला', roman: 'jhoola', en: 'swing' },
        { term: 'मेहंदी', roman: 'mehndi', en: 'henna patterns on the hands' }
      ]
    },

    {
      id: 'raksha-bandhan',
      name: 'Raksha Bandhan', script: 'रक्षाबंधन', roman: 'Rakṣā Bandhan',
      faith: 'hindu',
      region: 'pan-india', states: ['UP', 'MP', 'RJ', 'HR', 'DL', 'PB', 'GJ', 'MH', 'BR', 'JH', 'CT', 'UK', 'WB', 'KA'],
      months: ['July', 'August'],
      badge: 'aaj', needs_review: false,
      kid: 'A sister ties a thread on her brother’s wrist, and he promises to look after her — and ' +
           'usually gives her something. The thread stays on until it falls off by itself.',
      big: 'Raksha bandhan means "the tie of protection". A rakhi — a thread, sometimes plain, ' +
           'sometimes enormous and glittery — is tied on the wrist, sweets are exchanged, and a ' +
           'promise is made both ways. It works over long distances too: rakhis are posted across ' +
           'oceans every year, which is why the post offices in India get busy in Shravan.',
      story: null,
      do: [
        'Make a rakhi from thread, wool or ribbon and tie it on somebody. It does not have to be a brother — many families now tie for cousins, friends and sisters.',
        'Post one to a cousin in another country, early, because post is slow.',
        'Tie one on a video call and get them to hold their wrist up to the camera. This is a real thing families do.',
        'Promise one specific thing you will actually do, rather than "look after them". Specific promises get kept.'
      ],
      variations: [
        'In many families in Maharashtra and coastal Gujarat, the same full moon is Narali Purnima, when coconuts are offered to the sea before the fishing boats go out again.',
        'In many Tamil, Telugu and Malayali families the same day is Avani Avittam or Upakarmam, when the sacred thread is changed — a completely different observance on the same date.',
        'In many families there is no brother to tie for, and the rakhi goes to a cousin, a friend or a sister instead. That is now extremely common and entirely normal.'
      ],
      ask: 'Ask a grandparent who they tied rakhi to as a child, and what they got for it.',
      words: [
        { term: 'राखी', roman: 'rakhi', en: 'the thread tied on the wrist' },
        { term: 'रक्षा', roman: 'raksha', en: 'protection' },
        { term: 'बंधन', roman: 'bandhan', en: 'a tie, a bond' }
      ]
    },

    /* ═══════════════════════════════════════════ LATE MONSOON · the crowded weeks */

    {
      id: 'janmashtami',
      name: 'Janmashtami', script: 'जन्माष्टमी', roman: 'Janmāṣṭamī',
      faith: 'hindu',
      region: 'pan-india', states: ['UP', 'MH', 'GJ', 'RJ', 'MP', 'HR', 'DL', 'TN', 'KA', 'AP', 'TG', 'OR', 'WB', 'BR', 'MN'],
      months: ['August', 'September'],
      badge: 'katha', needs_review: false,
      kid: 'This is Krishna’s birthday, and he was born at midnight — so people stay up for it. As a ' +
           'baby he was famous for stealing butter, so on this day there is butter everywhere.',
      big: 'Krishna is born at midnight in a prison in Mathura and is carried across a flooding river ' +
           'to safety, and the whole story is told again every year. Families keep a fast until ' +
           'midnight, then break it. In Maharashtra, human pyramids form in the street to reach a pot ' +
           'of curd hung high above — dahi handi — because the child Krishna was a butter thief and ' +
           'nobody has ever let him forget it.',
      story: null,
      do: [
        'Stay up until midnight if you are allowed. If you are not, celebrate loudly at eight and blame the time difference.',
        'Make tiny footprints from the front door to wherever the baby Krishna would be. Rice flour or chalk.',
        'Build a human pyramid with cushions and a toy on top, and pull it down. This is dahi handi, indoors and safe.',
        'Eat butter on something and say sorry to nobody.',
        'Swing a cradle — a shoebox on a string will do — because in the south the baby is put in a swing.'
      ],
      variations: [
        'In many Maharashtrian families the day belongs to the dahi handi in the street, and the pyramid teams train for weeks.',
        'In many Tamil families it is Gokulashtami, with little footprints drawn in rice flour leading into the house, and seedai and murukku made for it.',
        'In many Gujarati and Braj families the temples at Mathura and Dwarka set the tone, with jhankis — tableaux of the story — and singing all night.'
      ],
      ask: 'Ask a grandparent whether they ever managed to stay awake until midnight for it, and what they ate first.',
      words: [
        { term: 'जन्म', roman: 'janma', en: 'birth' },
        { term: 'माखन', roman: 'makhan', en: 'butter — the thing he stole' },
        { term: 'दही हांडी', roman: 'dahi handi', en: 'the pot of curd hung out of reach' }
      ]
    },

    {
      id: 'ganesh-chaturthi',
      name: 'Ganesh Chaturthi', script: 'गणेश चतुर्थी', roman: 'Gaṇeś Chaturthī',
      faith: 'hindu',
      region: 'west', states: ['MH', 'GA', 'KA', 'TG', 'AP', 'TN', 'GJ', 'MP', 'CT', 'OR', 'DD', 'DN'],
      months: ['August', 'September'],
      badge: 'aaj', needs_review: false,
      kid: 'Ganesha comes to stay. A clay Ganesha is brought into the house, looked after like a ' +
           'guest for a few days, and then taken to the water and let go — and everybody says ' +
           '"come back soon next year".',
      big: 'For anywhere from a day and a half to eleven days, a clay Ganesha stays in the house or ' +
           'in a street pandal. He is woken, fed modaks, sung to, and then carried in a procession to ' +
           'the water and immersed, with the whole crowd shouting "Ganpati bappa morya, pudhchya ' +
           'varshi lavkar ya" — come back soon next year. More and more families now use unbaked ' +
           'clay and immerse at home in a bucket, so the river is not harmed.',
      story: 'ka.ganesha-race',
      do: [
        'Make a Ganesha from clay or salt dough, keep him on a shelf for two days, and dissolve him in a bucket at the end. That is the whole festival, correctly done.',
        'Make or eat a modak, or any sweet dumpling. Steamed if you can.',
        'Shout "Ganpati bappa — morya!" and get someone to shout the second half back.',
        'Learn the story of how Ganesha won the race around the world without leaving home.',
        'Water a plant with the bucket afterwards, so nothing is wasted.'
      ],
      variations: [
        'In many Maharashtrian families Ganpati comes for a day and a half; in many others for five, seven or eleven days, and every family knows exactly which it is.',
        'In many Goan families the festival is Chavath, kept at home with a decorated wooden canopy called a matoli hung with fruit from the garden — no street pandal at all.',
        'In many Telugu and Kannada families the festival is kept quietly at home, and in many Tamil families it is Vinayaka Chaturthi with kozhukattai made for it.'
      ],
      ask: 'Ask a grandparent how many days Ganpati stayed at their house, and who was allowed to carry him to the water.',
      words: [
        { term: 'मोदक', roman: 'modak', en: 'the sweet dumpling Ganesha is given' },
        { term: 'विसर्जन', roman: 'visarjan', en: 'the letting-go in the water' },
        { term: 'मोरया', roman: 'morya', en: 'the shout that answers "Ganpati bappa"' }
      ]
    },

    {
      id: 'onam',
      name: 'Onam', script: 'ഓണം', roman: 'Oṇam',
      faith: 'seasonal', also: ['hindu'],
      region: 'south', states: ['KL', 'TN', 'KA', 'PY', 'LD'],
      months: ['August', 'September'],
      badge: 'katha', needs_review: false,
      kid: 'Once a year the old king Mahabali comes back to visit Kerala, and everyone makes sure he ' +
           'finds it happy. There are flower carpets at every door and a feast eaten off a banana leaf.',
      big: 'Onam runs for ten days and belongs to everyone in Kerala, whatever their faith. A ' +
           'pookalam — a carpet of flower petals — is laid at the door and grows bigger each day. ' +
           'There is the Onasadya, a feast of many dishes served on a banana leaf and eaten with the ' +
           'right hand, and vallamkali, the snake-boat races with a hundred rowers to a boat. The ' +
           'story underneath it is Mahabali’s, and it is told as a homecoming, not a defeat.',
      story: 'fk.mahabali',
      do: [
        'Lay a pookalam at your door with petals, or with coloured paper circles if there are no flowers where you live.',
        'Eat one meal off a banana leaf, or off the biggest plate in the house, with your hand. There is a right order to eat a sadya in — ask.',
        'Add one more circle to the pookalam every day for ten days. Its growing is the point.',
        'Say "Onashamsakal" to a Malayali person.',
        'Race paper boats in the bath or a puddle and call it vallamkali.'
      ],
      variations: [
        'In many Malayali families Onam is kept by Hindu, Christian and Muslim households alike — it is Kerala’s festival before it is anybody’s religious one.',
        'In many families the sadya has twenty-six items and somebody counts; in many others it is eight and nobody minds.',
        'In many Malayali families abroad, the Onam sadya at a hired hall in September is the largest gathering of the year, and everyone brings one dish.'
      ],
      ask: 'Ask a grandparent how many dishes were on their Onasadya, and which one they used to leave on the leaf.',
      words: [
        { term: 'പൂക്കളം', roman: 'pookalam', en: 'the carpet of flower petals at the door' },
        { term: 'സദ്യ', roman: 'sadya', en: 'the feast on a banana leaf' },
        { term: 'വള്ളംകളി', roman: 'vallamkali', en: 'the snake-boat race' }
      ]
    },

    {
      id: 'paryushana',
      name: 'Paryushana · Das Lakshana', script: 'पर्युषण', roman: 'Paryuṣaṇa',
      faith: 'jain',
      region: 'pan-india', states: ['GJ', 'RJ', 'MH', 'MP', 'KA', 'TN', 'DL', 'UP', 'BR'],
      months: ['August', 'September'],
      badge: 'aaj', needs_review: false,
      kid: 'For eight or ten days Jains eat simply, listen to readings, and try very hard not to hurt ' +
           'anything. At the end, everyone goes to everyone they know and asks to be forgiven.',
      big: 'The most concentrated stretch of the Jain year. Shvetambara Jains keep eight days and read ' +
           'the Kalpa Sutra; Digambara Jains keep ten, as Das Lakshana, one virtue for each day. ' +
           'Eating becomes simpler and more careful, fasting is common, and it ends with Samvatsari ' +
           'or Kshamavani — the day of asking forgiveness. You say Michhami Dukkadam: if I have hurt ' +
           'you, knowingly or not, I ask your forgiveness. To everybody. Every year. Not optional.',
      story: 'jn.bahubali',
      days: [
        { name: 'Through the days', do: 'Eat before dark, and eat simply. Jains do this all week.' },
        { name: 'Samvatsari · Kshamavani', do: 'Say Michhami Dukkadam to everyone you can reach, and mean it.' }
      ],
      do: [
        'Say sorry properly to one person, to their face, for an old thing. Not sideways, not by text if you can help it.',
        'Say Michhami Dukkadam to your whole family group — Jain families send exactly this message every year.',
        'Eat before it gets dark for one evening, and notice what that changes.',
        'Forgive one person without them asking. That is the harder half of this festival.'
      ],
      variations: [
        'In many Shvetambara families it is eight days and the Kalpa Sutra is read aloud; in many Digambara families it is ten days of Das Lakshana. Both are Paryushana and both are right.',
        'In many Jain families the children keep a small fast of their own choosing, and the family makes a proper occasion of it rather than a hardship.'
      ],
      ask: 'Ask a grandparent who they used to find it hardest to say sorry to.',
      words: [
        { term: 'मिच्छामि दुक्कडम्', roman: 'Michhami Dukkadam', en: 'if I have hurt you, forgive me' },
        { term: 'क्षमा', roman: 'kshama', en: 'forgiveness' },
        { term: 'संवत्सरी', roman: 'Samvatsari', en: 'the yearly day of asking' }
      ]
    },

    {
      id: 'nuakhai',
      name: 'Nuakhai', script: 'ନୂଆଖାଇ', roman: 'Nuākhāi',
      faith: 'seasonal', also: ['hindu'],
      region: 'east', states: ['OR', 'CT', 'JH'],
      months: ['August', 'September'],
      badge: 'aaj',
      needs_review: true,
      review: 'A western-Odisha community festival. Local detail should be checked by somebody from ' +
              'the Sambalpuri-speaking region before ship. Flagged for accuracy, not sensitivity.',
      kid: 'The first rice of the new crop is cooked, offered, and then eaten by the family together ' +
           '— and nobody eats any of it before that. Afterwards everyone goes and greets their elders.',
      big: 'Nuakhai means "eating the new". In western Odisha the first grain of the season is offered ' +
           'at the household or village shrine, and only then eaten, by the whole family at the same ' +
           'sitting. After the meal comes Nuakhai Juhar: you go to every elder you can reach and greet ' +
           'them, and any quarrel from the year is supposed to end there.',
      story: null,
      do: [
        'Eat the first of something as a family, all at the same time, and nobody starts early.',
        'Go and greet every grown-up in the house properly, one at a time. That is Nuakhai Juhar.',
        'End one small argument today, deliberately, because that is what the greeting is for.',
        'Find Sambalpur on the map of Odisha.'
      ],
      variations: [
        'In many western Odia families the exact hour of the meal is set locally and everybody in the town eats at once — which is a very literal version of "everyone is doing it".',
        'In many families now living in other cities, the meal is held on the same day at whatever hour people can get home, and the Juhar happens on the phone.'
      ],
      ask: 'Ask a grandparent whether there was a rule in their house about who ate first.',
      words: [
        { term: 'ନୂଆ', roman: 'nua', en: 'new' },
        { term: 'ଜୁହାର', roman: 'juhar', en: 'the greeting given to an elder' }
      ]
    },

    /* ═══════════════════════════════════════════ AUTUMN · the long bright run */

    {
      id: 'navratri',
      name: 'Navratri', script: 'नवरात्रि', roman: 'Navrātri',
      faith: 'hindu',
      region: 'pan-india', states: ['GJ', 'MH', 'RJ', 'MP', 'KA', 'TN', 'AP', 'TG', 'UP', 'DL', 'HR', 'PB', 'GA', 'OR'],
      months: ['March', 'April', 'September', 'October'],
      badge: 'aaj', needs_review: false,
      kid: 'Nine nights. In Gujarat everyone dances in circles until very late; in Tamil Nadu people ' +
           'build steps of dolls in the front room and invite the neighbours to come and look.',
      big: 'Nine nights for the Goddess, and no two regions keep them the same way. In Gujarat it is ' +
           'garba and dandiya every night, in halls that fill with hundreds of people. In Tamil Nadu, ' +
           'Karnataka and Andhra it is Golu or Bombe Habba: an odd number of steps stacked with dolls, ' +
           'and neighbours invited in to see them and sent home with sundal. Many families fast. There ' +
           'are two Navratris in the year — one in spring, one in autumn — and the autumn one is the ' +
           'one most people mean.',
      story: null,
      do: [
        'Learn the basic garba step — clap, step, clap — and do one circle round the kitchen with somebody.',
        'Build a golu on three shelves or three stairs with whatever figures you own, and invite someone to come and look at it.',
        'Make sundal: boiled chickpeas, coconut, mustard seeds. It is the snack of these nine nights and it takes ten minutes.',
        'Find out which of the nine nights your family thinks matters most. Families genuinely differ.'
      ],
      variations: [
        'In many Gujarati families the whole nine nights are dancing, and children are allowed to stay up far later than usual.',
        'In many Tamil, Kannada and Telugu families the nine nights are the Golu, the dolls come out of the same boxes every year, and one figure is added each year.',
        'In many Bengali families these same days are Durga Puja and look entirely different again.',
        'In many Telangana families the same season brings Bathukamma, when flowers are stacked into a cone and floated on the water.'
      ],
      ask: 'Ask a grandparent whether there was a doll in the family golu, or a garba their village danced, that they still remember.',
      words: [
        { term: 'नवरात्रि', roman: 'navratri', en: 'nine nights' },
        { term: 'गरबा', roman: 'garba', en: 'the circle dance of Gujarat' },
        { term: 'கொலு', roman: 'golu', en: 'the steps of dolls set up in the house' }
      ]
    },

    {
      id: 'durga-puja',
      name: 'Durga Puja', script: 'দুর্গা পূজা', roman: 'Durgā Pūjā',
      faith: 'hindu',
      region: 'east', states: ['WB', 'AS', 'TR', 'OR', 'JH', 'BR', 'DL', 'MH', 'KA'],
      months: ['September', 'October'],
      badge: 'aaj', needs_review: false,
      kid: 'For a few days, whole streets in Kolkata turn into art. People build enormous decorated ' +
           'rooms called pandals, walk around all night looking at them, and eat the entire time.',
      big: 'Durga Puja runs from Shashthi to Dashami. Communities commission pandals — temporary ' +
           'structures that are genuinely works of art, some of them enormous — and the whole city ' +
           'walks from one to the next, all night, for days. The dhaak drums do not stop, there is ' +
           'dhunuchi dancing, the food stalls run out and refill, and on the last day the image is ' +
           'carried to the river and immersed, and people say "aasche bochor abar hobe" — next year ' +
           'it will happen again.',
      story: null,
      do: [
        'Build a pandal from a cardboard box, properly, with a decorated front. Take as long over it as you can bear.',
        'Walk somewhere at night with your family and look at things you would not usually stop for. Pandal-hopping is a walking festival.',
        'Learn the dhaak rhythm on a table or an upturned bucket.',
        'Say "Shubho Bijoya" on the last day and eat something sweet immediately after.',
        'Learn what "aasche bochor abar hobe" means and say it when you take the box down.'
      ],
      variations: [
        'In many Bengali families the days are spent almost entirely outside the house, and eating out for five days straight is part of it.',
        'In many Assamese, Odia and Tripuri families the same days are kept with their own customs and their own foods.',
        'In many Bengali families abroad, one hall is hired for one weekend and the whole community’s Puja happens in it — on the nearest Saturday, not on the real day, because of school.'
      ],
      ask: 'Ask a grandparent which para — which neighbourhood — had the best pandal, and why theirs was better.',
      words: [
        { term: 'পূজা', roman: 'puja', en: 'worship, offering' },
        { term: 'ঢাক', roman: 'dhaak', en: 'the big drum of these days' },
        { term: 'শুভ বিজয়া', roman: 'Shubho Bijoya', en: 'the greeting of the last day' }
      ]
    },

    {
      id: 'vijayadashami',
      name: 'Vijayadashami · Dussehra', script: 'विजयादशमी', roman: 'Vijayādaśamī',
      faith: 'hindu',
      region: 'pan-india', states: ['KA', 'HP', 'UP', 'MH', 'TN', 'WB', 'CT', 'MP', 'GJ', 'RJ', 'DL', 'TG', 'AP', 'OR'],
      months: ['September', 'October'],
      badge: 'aaj',
      needs_review: true,
      review: 'The day is kept in ways that include the burning of an effigy. CLAUDE.md rule 7 says ' +
              'nothing sacred to anyone is ever the antagonist, and Ravana is honoured in some ' +
              'communities in India. Kept here to practice and to the tools-and-books custom; a ' +
              'human author and a named reviewer before the fuller framing is written.',
      kid: 'The tenth day, after the nine nights. In many houses this is the day you put your books, ' +
           'your instrument or your tools out to be blessed — and it is a very good day to start ' +
           'learning something new.',
      big: 'Vijayadashami closes Navratri, and how it is kept depends entirely on where you are. In ' +
           'Mysuru there is a procession of decorated elephants that is centuries old; in Kullu the ' +
           'deities of the valleys are brought down to meet; in much of the north there is Ramlila, ' +
           'the Ramayana acted out over many evenings. In a great many homes across India the day is ' +
           'Ayudha Puja and Saraswati Puja: books, instruments, tools and even the car are cleaned ' +
           'and set out, and children are started on their first lesson.',
      story: null,
      do: [
        'Clean the thing you use most — your instrument, your bike, your pencil case — and set it out properly for the day. That is Ayudha Puja and it is the loveliest version of this festival.',
        'Start learning one new thing today. Traditionally children are begun on their letters on this day, and starting on this day is meant to stick.',
        'Write the first letter of an alphabet you do not know yet.',
        'Watch a few minutes of the Mysuru Dasara procession with a grown-up and count the elephants.'
      ],
      variations: [
        'In many Kannada families the day is Ayudha Puja and Vidyarambham, and books are put away in front of the lamp the night before and not touched until morning.',
        'In many Bengali families the same day is Bijoya Dashami, the last day of Durga Puja, with sindoor khela and sweets, and it is a farewell rather than a victory.',
        'In many Himachali families it is Kullu Dussehra, which starts when everywhere else has finished, and lasts a week.',
        'In a few communities in India, Ravana is honoured rather than burned, and the day is kept quite differently. Ask a grown-up about that one.'
      ],
      ask: 'Ask a grandparent what got put out for Ayudha Puja in their house — somebody’s sewing machine, somebody’s scooter.',
      words: [
        { term: 'दशमी', roman: 'dashami', en: 'the tenth day' },
        { term: 'आयुध पूजा', roman: 'Ayudha Puja', en: 'the honouring of your tools' },
        { term: 'विद्यारंभम्', roman: 'Vidyarambham', en: 'the beginning of learning' }
      ]
    },

    {
      id: 'diwali',
      name: 'Diwali · Deepavali', script: 'दिवाली · दीपावली', roman: 'Dīvālī · Dīpāvalī',
      faith: 'hindu', also: ['jain', 'sikh'],
      region: 'pan-india', states: ['UP', 'MH', 'GJ', 'RJ', 'MP', 'DL', 'HR', 'PB', 'BR', 'JH', 'CT', 'KA', 'TN', 'AP', 'TG', 'WB', 'OR', 'GA', 'UK', 'HP', 'DD', 'DN'],
      months: ['October', 'November'],
      badge: 'aaj', needs_review: false,
      kid: 'The whole country puts little lamps outside on the darkest night of the month, so that ' +
           'nobody is walking home in the dark. There are sweets, new clothes and a lot of noise.',
      big: 'Diwali is a row of lamps — deep-avali — on the new-moon night of Kartik, and it is ' +
           'several festivals at once. Many families light the diyas for Rama’s return to Ayodhya; ' +
           'many keep it as Lakshmi Puja and open the new business year; Jain families mark the ' +
           'liberation of Mahavira; Sikh families keep Bandi Chhor Divas and light the gurdwara. ' +
           'In Bengal the same night is Kali Puja. It runs five days in much of India and one very ' +
           'early morning in much of the south.',
      story: 'ka.hanuman-leap',
      days: [
        { name: 'Dhanteras', do: 'Clean one room properly. In India the whole house gets done this week.' },
        { name: 'Choti Diwali · Naraka Chaturdashi', do: 'Have an early bath and put on the best thing you own.' },
        { name: 'Diwali · Lakshmi Puja', do: 'Light your lamps at dusk and put one where a stranger can see it.' },
        { name: 'Govardhan · Bali Pratipada · Bestu Varas', do: 'Cook far too much food and give some of it away.' },
        { name: 'Bhai Dooj', do: 'Call a brother, sister or cousin. That is the entire instruction.' }
      ],
      do: [
        'Light one diya, or one tealight, and put it on the windowsill facing the street. One lamp in a dark window is the entire festival.',
        'Draw a rangoli at the front door with chalk, rice flour or coloured paper. In a corridor, paper works and comes up again.',
        'Make or buy one sweet and take it to a neighbour who has no idea it is Diwali. This is the single best thing on this list.',
        'Video-call the oldest person in your family and let them see your lamps.',
        'Learn to say "Shubh Deepavali" and one greeting in your own family’s language too.'
      ],
      variations: [
        'In many Tamil families Deepavali happens before sunrise, with an oil bath and new clothes and firecrackers at dawn — by the time the north wakes up, the south has finished.',
        'In many Gujarati families the day after Diwali is Bestu Varas, the new year, and the greeting changes to "Saal Mubarak".',
        'In many Bengali families the same night is Kali Puja, and it looks and sounds quite different.',
        'In many Jain families the night marks Mahavira’s liberation and is kept quietly, with lamps and readings; in many Sikh families it is Bandi Chhor Divas and the gurdwara is lit.',
        'In many families abroad the fireworks are simply not possible, and the lamps and the food do all the work instead. That is not a lesser Diwali.'
      ],
      ask: 'Ask a grandparent what their street sounded like at Diwali, and what time they were allowed to start.',
      words: [
        { term: 'दीया', roman: 'diya', en: 'the little clay lamp' },
        { term: 'रंगोली', roman: 'rangoli', en: 'the pattern drawn on the floor to welcome people in' },
        { term: 'मिठाई', roman: 'mithai', en: 'sweets' },
        { term: 'शुभ दीपावली', roman: 'Shubh Deepavali', en: 'happy Diwali' }
      ]
    },

    {
      id: 'karva-chauth',
      name: 'Karva Chauth', script: 'करवा चौथ', roman: 'Karvā Chauth',
      faith: 'hindu',
      region: 'north', states: ['PB', 'HR', 'DL', 'UP', 'RJ', 'MP', 'HP', 'CH', 'JK'],
      months: ['October', 'November'],
      badge: 'aaj', needs_review: false,
      kid: 'On this day people fast all day and cannot eat until the moon comes up. Then they look at ' +
           'the moon through a sieve, and then everybody finally eats.',
      big: 'A day-long fast kept in much of north India, ending only when the moon has risen. The day ' +
           'starts before dawn with sargi — food sent by the mother-in-law — and ends with the moon ' +
           'seen through a sieve or a fine cloth. Mehndi is put on the day before, and the waiting is ' +
           'done together: the whole street knows what time moonrise is, and everybody is watching the ' +
           'same sky.',
      story: null,
      do: [
        'Look up what time the moon rises tonight and go outside to see it. Everyone keeping this fast is looking at the same moon you are.',
        'Wait for something small before you eat it — five minutes, deliberately. That is a child-sized version and it is the actual skill.',
        'Draw a mehndi pattern on a hand with a felt pen.',
        'Make food for whoever in your house is hungriest, and let them eat first.'
      ],
      variations: [
        'In many families now, husbands keep the fast alongside their wives, and in many others the couple keeps it together as a joint thing rather than a one-way one.',
        'In many north Indian families the day is a large social occasion with the whole neighbourhood’s women gathering; in many other families it is not kept at all, and that is entirely normal too.',
        'This is not a festival kept everywhere in India — in most of the south and east it is simply not part of the year.'
      ],
      ask: 'Ask a grandparent whether they kept this one, and who used to spot the moon first.',
      words: [
        { term: 'करवा', roman: 'karva', en: 'the small clay pot the day is named for' },
        { term: 'सरगी', roman: 'sargi', en: 'the food eaten before dawn' },
        { term: 'चंद्रमा', roman: 'chandrama', en: 'the moon' }
      ]
    },

    {
      id: 'chhath',
      name: 'Chhath', script: 'छठ पूजा', roman: 'Chhaṭh Pūjā',
      faith: 'hindu',
      region: 'east', states: ['BR', 'JH', 'UP', 'WB', 'DL', 'MH'],
      months: ['October', 'November', 'March', 'April'],
      badge: 'aaj', needs_review: false,
      kid: 'People stand in the river at sunset and again at sunrise and hold up offerings to the sun. ' +
           'It is one of the only festivals anywhere where you say thank you to the sun going down as ' +
           'well as coming up.',
      big: 'Four days, kept with real rigour: cleaning, then a strict fast, then arghya — offerings ' +
           'held up to the setting sun standing waist-deep in water, and again to the rising sun the ' +
           'next morning. Thekua is made for it. The riverbanks of Bihar and eastern Uttar Pradesh ' +
           'fill with thousands of people at dusk, and then again before dawn, and the songs go on ' +
           'all night in between.',
      story: null,
      do: [
        'Go outside and watch the sun actually set. All the way. Do not go in early.',
        'Get up and watch it rise the next morning. This is the hard half and it is the whole festival.',
        'Say thank you out loud to something that is leaving, not only to something that is arriving.',
        'Make thekua, or any wheat-and-jaggery biscuit, and share it out.',
        'Find the Ganga on the map and follow it through Bihar.'
      ],
      variations: [
        'In many Bihari and Purvanchali families this is the festival of the year — bigger in the house than Diwali — and people travel home across the country for it.',
        'In many families now living in Delhi, Mumbai or abroad, an artificial pond or a park lake or even a bathtub stands in for the river, and the fast is kept exactly as strictly.',
        'In many families a second, smaller Chhath is kept in spring as well, in March or April.'
      ],
      ask: 'Ask a grandparent which ghat their family used to go to, and how early they had to leave the house.',
      words: [
        { term: 'अर्घ्य', roman: 'arghya', en: 'the offering held up to the sun' },
        { term: 'ठेकुआ', roman: 'thekua', en: 'the wheat-and-jaggery sweet made for it' },
        { term: 'घाट', roman: 'ghat', en: 'the steps down to the water' }
      ]
    },

    {
      id: 'wangala',
      name: 'Wangala', script: null, roman: 'Wangala',
      faith: 'seasonal',
      region: 'northeast', states: ['ML', 'AS'],
      months: ['October', 'November', 'December'],
      badge: 'aaj',
      needs_review: true,
      review: 'A Garo community festival. Should be checked, and ideally written, by somebody Garo ' +
              'before it ships. Flagged for accuracy, not sensitivity.',
      kid: 'The harvest is in, so the Garo hills hold the hundred-drums festival. Rows of dancers ' +
           'move together with long drums slung across them, wearing tall feathered headdresses.',
      big: 'Wangala is the Garo harvest thanksgiving in Meghalaya, held after the crop is gathered. ' +
           'It is known as the Hundred Drums festival: lines of dancers, drums carried on the body, ' +
           'gong and flute, and headdresses of feathers. Garo is written in the Roman script, which ' +
           'is why this festival’s name has no other script to show you.',
      story: null,
      do: [
        'Drum on a box with both hands while walking in a line with somebody. That is closer to the real thing than it sounds.',
        'Make a feathered headband from paper.',
        'Find the Garo Hills on the map of Meghalaya — and then find how many different peoples live in that one small state.',
        'Say thank you for a meal out loud before you eat it. That is the whole idea of a harvest festival.'
      ],
      variations: [
        'In many Garo villages Wangala is held at slightly different times over several weeks, so the season has many Wangalas rather than one.',
        'Meghalaya’s other communities — Khasi and Jaintia — have their own festivals entirely, and it is worth not mixing them up.'
      ],
      ask: 'Ask a grown-up how many different peoples and languages there are in the Northeast. The real answer surprises most people.',
      words: [
        { term: 'Wangala', roman: 'Wangala', en: 'the Garo harvest festival' },
        { term: 'Dama', roman: 'dama', en: 'the long drum carried by the dancers' }
      ]
    },

    {
      id: 'guru-nanak-gurpurab',
      name: 'Guru Nanak Gurpurab', script: 'ਗੁਰਪੁਰਬ', roman: 'Gurpurab',
      faith: 'sikh',
      region: 'north', states: ['PB', 'HR', 'CH', 'DL', 'JK', 'HP', 'UP', 'MH', 'WB'],
      months: ['October', 'November'],
      badge: 'aaj', needs_review: false,
      kid: 'This is the birthday of Guru Nanak, the first of the Sikh Gurus. Gurdwaras are lit up, ' +
           'there is singing from before it gets light, and everybody eats together for free.',
      big: 'Sikhs mark the birth of Guru Nanak with an akhand path — an unbroken reading of the Guru ' +
           'Granth Sahib over about two days — a nagar kirtan through the streets, and langar. Guru ' +
           'Nanak’s teaching is famously practical: work honestly, share what you have, remember God, ' +
           'and treat everyone as equal. Then go and prove it at lunch.',
      story: 'sk.sacha-sauda',
      do: [
        'Share your food with someone who did not ask. That is the whole teaching, in one action.',
        'Sit on the floor to eat one meal, with everyone at the same height. That is how langar works and the reason is not comfort.',
        'Do a job for the house without telling anybody you did it.',
        'Learn to say "Sat Sri Akal" and find out what it means.'
      ],
      variations: [
        'In many Sikh families the day begins before dawn with Asa di Var at the gurdwara, and the children are carried there half asleep.',
        'In many Punjabi Hindu families the day is kept too, because in Punjab the gurdwara and the mandir were part of the same week for most families.',
        'In many towns outside India the nagar kirtan is the one day of the year the community is visible on the high street, and the langar is offered to complete strangers.'
      ],
      ask: 'Ask a grandparent what they used to eat in the langar, and who did the washing up.',
      words: [
        { term: 'ਗੁਰਪੁਰਬ', roman: 'gurpurab', en: 'a Guru’s day' },
        { term: 'ਲੰਗਰ', roman: 'langar', en: 'the free kitchen where everyone sits in one row' },
        { term: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', roman: 'Sat Sri Akal', en: 'the greeting Sikhs use' }
      ]
    },

    /* ═══════════════════════════════════════════ DECEMBER · and the one that moves */

    {
      id: 'christmas-india',
      name: 'Christmas in India', script: 'ക്രിസ്മസ്', roman: 'Krismas',
      faith: 'christian',
      region: 'pan-india', states: ['GA', 'KL', 'TN', 'NL', 'MZ', 'ML', 'MN', 'AP', 'KA', 'MH', 'WB', 'JH', 'AN'],
      months: ['December'],
      badge: 'aaj',
      needs_review: true,
      review: 'Christianity in India is outside the four commissioned traditions and gets survey ' +
              'treatment per docs/05 §2. A reviewer from an Indian Christian community should check ' +
              'this entry before it ships.',
      kid: 'Christians have been in India for a very long time — nearly two thousand years in Kerala. ' +
           'At Christmas, paper stars are hung outside every house, and in Goa the whole street smells ' +
           'of baking.',
      big: 'Kerala’s Christian community traces itself back to the first century, long before ' +
           'Christianity reached most of Europe. Christmas in India has its own shape: big paper ' +
           'lanterns shaped like stars hung outside houses from the beginning of December, midnight ' +
           'mass, kuswar — a tray of many small home-made sweets — in Goa and Mangalore, plum cake ' +
           'everywhere, and carol singers going house to house in Nagaland, Mizoram and Meghalaya.',
      story: null,
      do: [
        'Make a paper star and hang it in a window. In Kerala and Goa the star goes up weeks early.',
        'Bake something small and put it on a plate for a neighbour.',
        'Sing one carol with somebody, badly, out loud.',
        'Find Kerala on the map and look up how old the churches there are. It surprises everybody.'
      ],
      variations: [
        'In many Goan families Christmas means kuswar — a tray of a dozen different home-made sweets — and the neighbours all compare theirs.',
        'In many Naga and Mizo families whole choirs go from house to house through the night, and the singing is the festival.',
        'In many Syrian Christian families in Kerala the Christmas meal is appam and stew, not turkey, and the church service is in the morning.'
      ],
      ask: 'Ask a grown-up whether they had Christian friends or neighbours growing up, and what those families did that was different.',
      words: [
        { term: 'നക്ഷത്രം', roman: 'nakshatram', en: 'star — the paper one hung outside' },
        { term: 'kuswar', roman: 'kuswar', en: 'the Goan tray of Christmas sweets' }
      ]
    },

    {
      id: 'eid-ul-fitr',
      name: 'Eid-ul-Fitr', script: 'عید الفطر', roman: 'Īd-ul-Fitr',
      faith: 'muslim',
      region: 'pan-india', states: ['UP', 'BR', 'WB', 'KL', 'MH', 'TG', 'AP', 'KA', 'TN', 'DL', 'JK', 'RJ', 'GJ', 'AS', 'MP'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      badge: 'aaj',
      needs_review: true,
      review: 'Islam in India is outside the four commissioned traditions and gets survey treatment ' +
              'per docs/05 §2. A reviewer from an Indian Muslim community should check this entry ' +
              'before it ships.',
      kid: 'After a whole month of fasting from sunrise to sunset, Eid is the morning it ends. ' +
           'Everyone wears something new, everyone hugs, and there is a sweet milky vermicelli ' +
           'dish that only turns up on this day.',
      big: 'Eid-ul-Fitr comes at the end of Ramzan, the month of fasting. The morning begins with ' +
           'prayers, often outdoors with enormous numbers of people; then new clothes, visiting, and ' +
           'sheer khurma or seviyan — vermicelli cooked in milk with dates and nuts. Giving to those ' +
           'who need it is part of the day, not an extra. The Islamic calendar is purely lunar, so ' +
           'Eid moves about eleven days earlier every year and over a lifetime it passes through ' +
           'every season.',
      story: null,
      do: [
        'Say "Eid Mubarak" to somebody who is keeping it. It is a good sentence and it is always welcome.',
        'Skip one snack you were looking forward to, and notice how much you think about it. That is one hour of a month of fasting.',
        'Make or eat something with vermicelli and milk. Seviyan is the taste of this day.',
        'Give something away today — this is a day when giving is part of the festival, not an extra.'
      ],
      variations: [
        'In many families in Hyderabad the day means haleem in the weeks before and sheer khurma on the morning; in many Kerala families it is pathiri and biryani.',
        'In many families the moon must actually be sighted before Eid is announced, which is why in the same city one family may celebrate a day before another — and both are right.',
        'In many Bengali and Kashmiri families the customs and the food are different again — India’s Muslim communities are as varied as everybody else’s.'
      ],
      ask: 'Ask a grown-up whether they had friends who fasted at school, and what the last day was like.',
      words: [
        { term: 'عید مبارک', roman: 'Eid Mubarak', en: 'blessed Eid — the greeting' },
        { term: 'سویاں', roman: 'seviyan', en: 'the vermicelli cooked in milk' },
        { term: 'روزہ', roman: 'roza', en: 'the fast kept through Ramzan' }
      ]
    }
  ],

  /* ─────────────────────────────────────────────────────────────────────────────
     PRESENCE — the "everyone is doing it" mechanic.

     This is the actual product idea from docs/11 §4.4 and it is the reason this file
     exists. The child in New Jersey is not missing information about Diwali. They are
     missing four thousand other people doing it at the same time.

     RULES FOR THIS BLOCK, which the app must honour:
     · {n} is filled at runtime from a server-side aggregate count. It is NEVER filled with
       an estimate, a target, a "join 5,000 others" or a placeholder that ships.
     · The count is an aggregate of taps on the "I did it" button. It counts actions, not
       children, and it stores nothing about who tapped it. No name, no location, no photo.
     · If the count is unavailable, show `count.offline`. Do not guess.
     · If the count is small, use `small.lines`. A festival kept by few people is rare and
       precious, and the copy must say that and mean it. It must never read as "nobody
       cares", because for a Garo or Parsi or Mizo child that is the exact wound this
       feature was built to close.
     ───────────────────────────────────────────────────────────────────────────── */
  presence: {

    note: 'Numbers here are always real or absent. There is no placeholder count, no target ' +
          'and no rounded-up figure anywhere in this file or on screen.',

    /* Weeks out. {days} and {festival} are filled at runtime. */
    countdown: {
      far: [
        '{days} days until {festival}.',
        '{festival} is {days} days away. Somewhere, someone has already started cleaning.',
        '{days} days. There is time to learn one thing before it gets here.',
        '{days} days until {festival} — long enough to make something.'
      ],
      near: [
        '{days} days. This week the shops in India change what is in the window.',
        '{days} days until {festival}. Time to tell somebody it is coming.',
        'Nearly. {days} days.',
        '{days} days. Ask a grown-up what you are doing this year.'
      ],
      eve: [
        'Tomorrow.',
        '{festival} is tomorrow. Get everything ready tonight — that is half of it.',
        'Tomorrow is {festival}. In India, tonight is the night nobody sleeps early.'
      ],
      soon: [
        'Today is the first day of {festival}.',
        '{festival} starts today and runs for a few days yet.'
      ]
    },

    /* The day itself. */
    dayOf: [
      'It’s {festival}. Today, all over the world, families are doing exactly what you are doing.',
      'Today is {festival}. Your grandparents are doing this today too.',
      'It’s {festival} — and it is being kept today in more countries than you can name.',
      'Today is {festival}. You are not the only one. You never were.',
      'It’s {festival}. School may not know. Your house knows.'
    ],

    /* The live count. {n} comes from the server. Nothing else does. */
    count: {
      templates: [
        '{n} children marked {festival} today.',
        '{n} children have done this today, in {festival} houses all over the world.',
        'You’re number {n} today.',
        '{n} others did this today. You are one of them.'
      ],
      one: 'You are the first today. Somebody has to be.',
      offline: 'You’re offline, so we can’t count today — but plenty of people are doing this ' +
               'right now, and you are one of them.',
      cta: 'I did it',
      after: 'Counted. Thank you.'
    },

    /* Six lines for when the count is genuinely small. This is the most important copy in
       the file: a Garo child on Wangala or a Parsi child on Navroz must not be told, by a
       number, that their festival does not matter. */
    small: {
      note: 'Use these whenever the count is low. Never show a small number bare, and never ' +
            'compare one festival’s count with another’s, anywhere in the UI.',
      lines: [
        '{n} today — this is one of the rare ones, and you are keeping it.',
        'Not many. That is exactly why it matters that you did.',
        '{n} of you today, spread right across the world. That is a small, stubborn number and it is a good one.',
        'This one is kept by fewer people, and it has been kept for a very long time. Today you are one of them.',
        'Some festivals fill a whole city. This one fills a few kitchens, and yours is one.',
        'A small number today — and every single one of them is somebody’s family, like yours.'
      ]
    },

    /* The card the PARENT sends to the family group. Written to be forwarded — that is the
       growth loop in docs/01 §4 — and written so a grandmother in India understands it
       immediately. Nothing about the child goes on it except a first name, and only if the
       parent puts it there. */
    share: {
      title: '{child} kept {festival} today',
      titleNoName: 'We kept {festival} today',
      lines: [
        'Eight thousand miles away, the diyas went on anyway.',
        'A long way from home, and it still happened.',
        'It’s a school night here. We did it anyway.',
        'Not the same as being there. Done all the same.'
      ],
      body: 'Here is what we did for {festival} today.',
      askLine: 'One question for you: {ask}',
      footer: 'Made on Bizzing India',
      cta: 'Send to the family group',
      privacy: 'Nothing is shared unless you tap send. No location, no photo unless you add ' +
               'one, and no name unless you type it.'
    },

    /* The nudge that turns the day into a conversation, per docs/11 §4.3. */
    prompt: {
      lead: 'One thing to ask today:',
      fallback: 'Ask the oldest person you can reach what this day sounded like where they grew up.'
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────────
     CALENDAR NOTE — for the parent, not the child.

     Written because the first support question this feature will generate is "your app
     says Diwali is on the wrong day". It usually isn't; there are simply several correct
     answers. This paragraph refuses to pick one, on purpose.
     ───────────────────────────────────────────────────────────────────────────── */
  calendarNote: {
    title: 'Why the dates move',
    audience: 'parent',
    text: 'Most Indian festivals are set by a lunisolar calendar — the months follow the moon, ' +
          'and an extra month is added every few years to keep the seasons in place — so they ' +
          'land on a different Gregorian date each year. Some, like Makar Sankranti, follow the ' +
          'sun instead and barely move. Eid follows a purely lunar calendar and walks about ' +
          'eleven days earlier every year. On top of that, India uses several regional almanacs ' +
          'that count months and start the year differently: the same festival can fall on ' +
          'different days in Chennai, Ahmedabad and Kolkata, and where the day begins at ' +
          'sunrise rather than midnight, a tithi that spans two mornings genuinely gives two ' +
          'defensible answers. Some observances also wait on an actual moon sighting. So it is ' +
          'entirely normal for two families on the same street — sometimes in the same building ' +
          '— to keep the same festival a day apart, each following the almanac their family or ' +
          'their temple or their community has always followed. None of these reckonings is the ' +
          'correct one and we do not present any of them as such. This app shows you the months ' +
          'a festival can fall in and leaves the day to your family, your calendar and your ' +
          'grandmother — who, in our experience, wins.',
    childLine: 'Festivals here don’t have one date, because India uses more than one calendar. ' +
               'Your family knows which day is yours — go and ask.'
  }
};
