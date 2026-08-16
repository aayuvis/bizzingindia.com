/* Bizzing India — Itihaas: Indian history as the River of Time (Kaal Nadi).

   EDITORIAL (docs/05 §3, binding):
   - Evidence is NAMED. "We know this from Ashoka's edicts, carved on rocks you can still
     go and see." Never "historians believe" with nothing behind it.
   - Uncertainty is stated at a child's level. "Nobody has read the Indus script yet.
     Maybe you will."
   - Dates are honest and labelled approximate. No false precision.
   - Rulers are people, not teams. No dynasty is a hero-team or a villain-team.
   - The whole map: the Souths, the East and the Northeast are not a footnote.
   - Everyday life beats battles — more interesting at seven, and less contested.
   - Sensitive topics carry `gate`, the minimum age band. The app hides anything above
     the child's band. Caste, colonial violence and Partition are gated to 11+.

   Every era carries `badge: 'itihaas'` and a `sources` list. Nothing here is invented:
   where a thing is a story rather than evidence, it is marked katha and said so. */

window.IND_ITIHAAS = {
  intro: 'A river runs through all of this. Sail down it and the centuries go past on the ' +
         'banks. Some of what washes up is solid — a seal, a coin, a pillar with writing on ' +
         'it. Some of it is a story people have told for so long that the telling is the ' +
         'evidence. We will always tell you which is which.',

  eras: [
    {
      id: 'harappa', title: 'The First Cities', when: 'about 3300–1300 BCE', gate: 4,
      badge: 'itihaas', place: 'GJ', avatar: 'pt_bull',
      hook: 'Cities with drains, before almost anywhere else had streets.',
      kid: 'People built brick cities along the Indus and the rivers near it — Mohenjo-daro, ' +
           'Harappa, Dholavira, Lothal. Straight streets. Drains under the roads. A ' +
           'swimming-pool-sized bath in the middle of town. Toy carts with wheels that turn.',
      big: 'They traded as far as Mesopotamia; their seals turn up there. Then, over a few ' +
           'centuries, the cities emptied. Nobody is certain why — the rivers may have ' +
           'shifted, the climate dried.',
      wonder: 'Nobody has been able to read their writing. Thousands of seals, and we still ' +
              'do not know what a single word says. Maybe you will.',
      objects: ['The dancing girl, a small bronze figure', 'A seal with a humped bull',
                'A toy bullock cart', 'A ruler marked in tiny even units'],
      moments: [
        { when: 'by about 2600 BCE',
          what: 'Big planned cities — Mohenjo-daro, Harappa, Dholavira — are up and busy, ' +
                'with straight streets and drains running underneath.' },
        { when: 'about 2600–1900 BCE',
          what: 'Harappan seals and beads travel by ship and turn up in Mesopotamia, far to ' +
                'the west.' },
        { when: 'around 2500 BCE',
          what: 'In dry Kutch, the city of Dholavira stores the monsoon in huge stone ' +
                'reservoirs — a desert city that farmed the rain.' },
        { when: 'about 1900 BCE onwards',
          what: 'Over centuries the cities slowly empty. Nobody is sure why — the rivers ' +
                'may have shifted, the rains grown thin.' },
        { when: '1921–1924 CE',
          what: 'Archaeologists digging at Harappa and Mohenjo-daro realise the mounds hide ' +
                'a forgotten civilisation — one of the great surprises of archaeology.' }
      ],
      figures: [
        { id: null, name: 'The girl in the bronze',
          line: 'Someone cast a tiny statue of a girl standing hand-on-hip, about as tall ' +
                'as your palm. We do not know her name — the statue is how we know her.' },
        { id: null, name: 'Daya Ram Sahni',
          line: 'The archaeologist whose 1921 dig at Harappa first showed that the mounds ' +
                'were hiding a lost city.' },
        { id: null, name: 'Rakhal Das Banerji',
          line: 'Dug at Mohenjo-daro in 1922 and found streets nobody had walked for more ' +
                'than three thousand years.' }
      ],
      today: [
        { what: 'Dholavira, a whole Harappan city you can walk through', where: 'Khadir ' +
          'island, Kutch', state: 'GJ' },
        { what: 'Rakhigarhi, a village sitting on top of one of the largest Harappan sites',
          where: 'Hisar district', state: 'HR' },
        { what: 'The dancing girl herself, in the National Museum', where: 'New Delhi',
          state: 'DL' }
      ],
      stories: ['it.rakhigarhi'],
      listen: 'Close your eyes and stand on a street four and a half thousand years old — ' +
              'the drains ran under your feet, and the toy carts had wheels that really ' +
              'turned.',
      sources: ['Archaeological Survey of India excavations at Mohenjo-daro, Harappa, ' +
                'Dholavira and Lothal', 'Indus seals found at Mesopotamian sites',
                'UNESCO World Heritage listing for Dholavira (2021)']
    },
    {
      id: 'vedic', title: 'The Songs Before Writing', when: 'about 1500–500 BCE', gate: 6,
      badge: 'itihaas', place: 'PB', avatar: 'saraswati',
      hook: 'The oldest poetry in India was not written down. It was remembered — exactly.',
      kid: 'The Vedas were composed and then carried in people\'s memories for centuries ' +
           'before anyone wrote them. Families trained children to hold thousands of verses ' +
           'perfectly, syllable by syllable, with the pitch right.',
      big: 'The memorisation methods were extraordinary — reciting a text forwards, ' +
           'backwards, and in interlocking patterns so that a single slipped syllable would ' +
           'be caught. It is one of the most accurate oral transmissions anywhere in the world.',
      wonder: 'Think about what that means. A poem three thousand years old, and we can still ' +
              'hear roughly how it sounded.',
      objects: ['A fire altar', 'The Rigveda', 'A gurukul in the forest'],
      moments: [
        { when: 'sometime after about 1500 BCE — historians argue about exactly when',
          what: 'The hymns of the Rigveda are composed along the rivers of the northwest.' },
        { when: 'over the centuries that follow',
          what: 'Families train children to carry the verses in memory, syllable-perfect, ' +
                'without writing a word of them down.' },
        { when: 'about 1000–600 BCE',
          what: 'People move east along the Ganga plain, clearing forest, keeping cattle ' +
                'and learning to work iron — their plain grey pottery still turns up in ' +
                'digs.' },
        { when: 'about 800–500 BCE',
          what: 'The Upanishads are composed — long conversations full of questions like ' +
                '"what is the self?"' },
        { when: '2008 CE',
          what: 'UNESCO lists Vedic chanting as a treasure of human heritage — the sound ' +
                'itself, still being handed on.' }
      ],
      figures: [
        { id: null, name: 'Lopamudra',
          line: 'One of the women the tradition names as a composer of Rigveda hymns.' },
        { id: null, name: 'Gargi',
          line: 'In the Upanishads, a woman scholar who asked the hardest questions in the ' +
                'room and kept asking until the answers ran out.' },
        { id: null, name: 'Yajnavalkya',
          line: 'The Upanishad teacher famous for answering enormous questions — sometimes ' +
                'with even bigger ones.' }
      ],
      today: [
        { what: 'Vedic chanting, still passed from mouth to mouth in the old way',
          where: 'temple schools in and around Thrissur', state: 'KL' },
        { what: 'Hastinapura, where archaeologists found the plain grey pottery of this age',
          where: 'Meerut district', state: 'UP' },
        { what: 'The Ganga plain the hymn-singers slowly moved into', where: 'anywhere along ' +
          'the river from Haridwar down', state: 'UK' }
      ],
      stories: [],
      listen: 'Before anyone in India wrote anything down, there were songs — and the songs ' +
              'were kept so carefully that we can still hear them.',
      sources: ['The Rigveda and its recension traditions', 'UNESCO lists Vedic chanting as ' +
                'Intangible Cultural Heritage',
                'Brihadaranyaka Upanishad (the Gargi–Yajnavalkya dialogues)',
                'ASI excavations at Hastinapura (B. B. Lal)']
    },
    {
      id: 'buddha-age', title: 'The Age of Big Questions', when: 'about 600–300 BCE', gate: 7,
      badge: 'itihaas', place: 'BR', avatar: 'buddha',
      hook: 'Sixteen kingdoms, new cities, and two young men who walked out of comfortable ' +
            'lives to ask what suffering is.',
      kid: 'Towns were growing, coins were being minted, and people were arguing about how to ' +
           'live. Siddhartha Gautama and Mahavira were both born into this, and both left ' +
           'everything to go and think.',
      big: 'Some of these states were republics — the Vajji confederacy governed by assembly ' +
           'rather than a king. Magadha eventually grew strongest and became the base for ' +
           'the empire that followed.',
      wonder: 'Two of the world\'s great traditions began within a few decades and a few ' +
              'hundred miles of each other.',
      objects: ['Punch-marked silver coins', 'The Bodhi tree at Bodh Gaya', 'A begging bowl'],
      moments: [
        { when: 'about 600–400 BCE',
          what: 'Sixteen big states, the mahajanapadas, grow up across the north — some ' +
                'ruled by kings, some by assemblies.' },
        { when: 'sometime in the 500s or 400s BCE — historians argue about the years',
          what: 'Siddhartha Gautama leaves his palace, and after years of searching sits ' +
                'down under a tree at Bodh Gaya and becomes the Buddha.' },
        { when: 'around the same time',
          what: 'Mahavira, the twenty-fourth Jain tirthankara, teaches ahimsa — ' +
                'carefulness with every living thing.' },
        { when: 'about 500 BCE',
          what: 'India\'s first coins — silver pieces punched with tiny marks — begin ' +
                'passing from hand to hand.' },
        { when: 'soon after the Buddha\'s passing — the date is argued over',
          what: 'His followers gather at Rajgir to recite everything he taught, so that ' +
                'nothing would be lost.' }
      ],
      figures: [
        { id: 'buddha', name: 'The Buddha',
          line: 'A prince who saw sickness, old age and death for the first time — and ' +
                'could not go back to pretending he had not.' },
        { id: 'mahavira', name: 'Mahavira',
          line: 'Walked barefoot and owned nothing, so careful of life that he watched ' +
                'where every footstep fell.' },
        { id: null, name: 'Bimbisara',
          line: 'The king of Magadha whom the old texts remember as a friend to both the ' +
                'Buddha and Mahavira.' }
      ],
      today: [
        { what: 'The Mahabodhi temple and the Bodhi tree', where: 'Bodh Gaya', state: 'BR' },
        { what: 'Sarnath, where the Buddha first taught', where: 'near Varanasi',
          state: 'UP' },
        { what: 'Vaishali, home of the assembly-run Vajji republic', where: 'Vaishali ' +
          'district', state: 'BR' }
      ],
      stories: ['ka.buddha-mustard', 'ka.mahavira-elephant', 'jt.banyan-deer',
                'jt.hare-moon', 'jt.golden-goose', 'jn.chandkaushik'],
      listen: 'The towns were new, the coins were new, and two young men walked away from ' +
              'everything to ask the oldest question there is: why do we suffer?',
      sources: ['Pali canon and Jain Agamas', 'Excavations at Rajgir, Vaishali and Sarnath',
                'Punch-marked coin hoards in Indian museum collections']
    },
    {
      id: 'maurya', title: 'The Emperor Who Was Sorry', when: '322–185 BCE', gate: 7,
      badge: 'itihaas', place: 'BR', avatar: 'ashoka',
      hook: 'He won a war, looked at what he had done, and spent the rest of his life ' +
            'apologising in stone.',
      kid: 'Chandragupta Maurya built an empire across most of the subcontinent, helped by ' +
           'his sharp adviser Chanakya. His grandson Ashoka fought a terrible war in Kalinga ' +
           '— and afterwards had his regret carved onto rocks and pillars all over the empire.',
      big: 'The edicts are the remarkable thing: a ruler using his own monuments to say he ' +
           'was wrong, and to instruct his officials to be gentle. They are written in ' +
           'everyday languages so ordinary people could have them read aloud.',
      wonder: 'The lions from the top of his pillar at Sarnath are the emblem on your ' +
              'passport, your coins and your government\'s letterhead. They have been ' +
              'standing for over 2,200 years.',
      objects: ['The Lion Capital at Sarnath', 'Major Rock Edict XIII', 'A pillar at Lauriya'],
      moments: [
        { when: 'about 322 BCE',
          what: 'Chandragupta Maurya takes the throne of Magadha, with his sharp adviser ' +
                'Chanakya beside him, and builds outwards from there.' },
        { when: 'about 305 BCE',
          what: 'Chandragupta faces Seleucus, one of Alexander\'s generals — the treaty ' +
                'leaves the northwest with the Mauryas, and a Greek ambassador, ' +
                'Megasthenes, comes to stay.' },
        { when: 'about 268 BCE',
          what: 'Ashoka becomes emperor.' },
        { when: 'about 260 BCE',
          what: 'The Kalinga war. Ashoka wins, sees what winning has cost, and is changed ' +
                'by it — he says so himself, in stone.' },
        { when: 'the years after',
          what: 'Edicts go up across the empire, on rocks and polished pillars, in everyday ' +
                'languages — some as far away as Afghanistan, in Greek and Aramaic.' },
        { when: 'about 185 BCE',
          what: 'The last Mauryan emperor is overthrown by his own general, and the empire ' +
                'ends.' }
      ],
      figures: [
        { id: 'ashoka', name: 'Ashoka',
          line: 'The emperor who won his biggest war and then spent the rest of his life ' +
                'carving his regret where everyone could read it.' },
        { id: 'chanakya', name: 'Chanakya',
          line: 'The teacher whose sharp planning helped put Chandragupta on the throne — ' +
                'tradition ties his name to the Arthashastra, a manual on how to run a ' +
                'state.' },
        { id: null, name: 'Chandragupta Maurya',
          line: 'Started from beginnings nobody recorded for certain — and ended ruling ' +
                'more of India than anyone before him.' },
        { id: null, name: 'Megasthenes',
          line: 'The Greek ambassador who wrote down what he saw at the Mauryan court — ' +
                'later writers copied his best bits, which is why we still have them.' }
      ],
      today: [
        { what: 'The Great Stupa begun by Ashoka', where: 'Sanchi', state: 'MP' },
        { what: 'The Lion Capital, in the Sarnath museum', where: 'near Varanasi',
          state: 'UP' },
        { what: 'The Dhauli rock edict, near the old Kalinga battlefield',
          where: 'near Bhubaneswar', state: 'OR' }
      ],
      stories: [],
      listen: 'This is the story of an emperor who won everything, looked hard at what ' +
              'winning had cost, and spent the rest of his life saying sorry in stone.',
      sources: ['Ashoka\'s Rock and Pillar Edicts, including Major Rock Edict XIII on Kalinga',
                'Megasthenes\' account, as quoted by later Greek writers',
                'The Kandahar bilingual rock inscription, in Greek and Aramaic']
    },
    {
      id: 'gupta', title: 'Zero, Stars and Poems', when: 'about 320–550 CE', gate: 8,
      badge: 'itihaas', place: 'BR', avatar: 'aryabhata',
      hook: 'Somebody worked out how to write nothing down — and it changed all of ' +
            'mathematics.',
      kid: 'Aryabhata calculated that the Earth spins, and got the length of the year very ' +
           'nearly right. The decimal place-value system, with a symbol for zero, took shape ' +
           'in India and travelled from here to the whole world. Kalidasa wrote plays people ' +
           'still perform.',
      big: 'Nalanda became a university drawing students from across Asia. The Ajanta cave ' +
           'paintings date from around this time.',
      wonder: 'Every number you will ever write uses this idea. It is Indian, and it is about ' +
              '1,500 years old.',
      objects: ['The Aryabhatiya', 'Ajanta cave paintings', 'The iron pillar at Delhi'],
      moments: [
        { when: 'about 320 CE',
          what: 'Chandragupta I begins the Gupta line in Magadha.' },
        { when: 'about 375–415 CE',
          what: 'Under Chandragupta II the court is at its height — tradition places ' +
                'Kalidasa, the greatest of Sanskrit poets, around this time.' },
        { when: 'around 400 CE',
          what: 'Faxian, a monk from China, walks to India and writes down what he sees — ' +
                'one of our best eyewitness accounts of the age.' },
        { when: '499 CE',
          what: 'Aryabhata, aged twenty-three, finishes the Aryabhatiya — the Earth spins, ' +
                'he says, and here is the length of the year, very nearly right.' },
        { when: 'around the 400s',
          what: 'Painters working by lamplight fill the Ajanta caves with faces you can ' +
                'still read across fifteen centuries.' },
        { when: 'about 550 CE',
          what: 'Worn down by long wars with Huna invaders, the empire fades — but the ' +
                'numbers, the poems and the paintings stay.' }
      ],
      figures: [
        { id: 'aryabhata', name: 'Aryabhata',
          line: 'Worked out that the Earth spins — and wrote his mathematics as verses you ' +
                'could memorise.' },
        { id: null, name: 'Kalidasa',
          line: 'Wrote a poem in which a cloud carries a message across half of India — ' +
                'people still perform his plays.' },
        { id: null, name: 'Faxian',
          line: 'Walked from China across deserts and mountains to copy Buddhist books — ' +
                'and left us a traveller\'s diary of Gupta India.' },
        { id: null, name: 'Prabhavati Gupta',
          line: 'A Gupta princess who ruled the neighbouring Vakataka kingdom for years on ' +
                'behalf of her young sons — we still have the copper plates she issued.' }
      ],
      today: [
        { what: 'The Ajanta caves and their paintings', where: 'near Aurangabad',
          state: 'MH' },
        { what: 'The iron pillar that has barely rusted in 1,600 years', where: 'Qutub ' +
          'complex, Delhi', state: 'DL' },
        { what: 'The Dashavatara temple, one of the oldest standing stone temples',
          where: 'Deogarh, Lalitpur district', state: 'UP' }
      ],
      stories: ['pt.lion-rabbit', 'pt.monkey-crocodile', 'pt.blue-jackal',
                'pt.four-friends', 'fk.iron-pillar'],
      listen: 'Somewhere in these years, somebody wrote down nothing at all — a small round ' +
              'zero — and every number you will ever write remembers it.',
      sources: ['Aryabhata, Aryabhatiya (499 CE)', 'Bakhshali manuscript', 'Xuanzang\'s ' +
                'account of Nalanda', 'ASI, Ajanta', 'Faxian\'s travel account',
                'The copper-plate charters of Prabhavati Gupta']
    },
    {
      id: 'souths', title: 'Ships, Bronze and Stone', when: 'about 300 BCE–1600 CE', gate: 8,
      badge: 'itihaas', place: 'TN', avatar: 'shivaji',
      hook: 'South Indian kings sent fleets across the Bay of Bengal — and their sculptors ' +
            'cast bronzes nobody has bettered.',
      kid: 'The Cholas, Pallavas, Cheras, Pandyas and later Vijayanagara built temples you ' +
           'can still walk into. Chola bronzes of Nataraja are among the finest metal ' +
           'sculptures made anywhere. Tamil Sangam poetry is older than most European ' +
           'literature.',
      big: 'Chola influence reached Southeast Asia through trade and naval expeditions, which ' +
           'is part of why you find Ramayana stories in Java and Thailand today.',
      wonder: 'Hampi was one of the largest cities in the world in the 1500s. You can still ' +
              'stand in its market street.',
      objects: ['A Chola Nataraja bronze', 'The stone chariot at Hampi',
                'Shore temple at Mamallapuram'],
      moments: [
        { when: 'about 300 BCE–200 CE',
          what: 'The Sangam age: Tamil poets compose about love, war, rain and the sea — ' +
                'poetry people still read today.' },
        { when: 'the early centuries CE',
          what: 'Roman ships ride the monsoon winds to Kerala\'s ports for pepper — Roman ' +
                'coins still turn up in south Indian fields.' },
        { when: 'the 600s CE',
          what: 'The Pallavas carve whole temples out of living rock at Mamallapuram, right ' +
                'down to the shore.' },
        { when: 'about 850 CE onwards',
          what: 'The Cholas rise in the Kaveri delta — their story gets its own stretch of ' +
                'this river.' },
        { when: '1336 onwards',
          what: 'Vijayanagara is founded and grows into one of the largest cities on Earth — ' +
                'travellers from Persia and Portugal write home amazed.' },
        { when: '1565',
          what: 'After the battle of Talikota the great city is abandoned. Hampi\'s ruins are ' +
                'what remains.' }
      ],
      figures: [
        { id: null, name: 'Avvaiyar',
          line: 'The name Tamil tradition gives its best-loved poet-grandmother — sharp, ' +
                'always travelling, impossible to fool.' },
        { id: null, name: 'Narasimhavarman I, called Mamallan',
          line: 'The Pallava king nicknamed "the great wrestler", in whose family\'s time the ' +
                'shore temples of Mamallapuram were cut.' },
        { id: null, name: 'Krishnadevaraya',
          line: 'Vijayanagara\'s most famous king — a poet himself, whose court the Tenali ' +
                'Rama stories remember.' }
      ],
      today: [
        { what: 'The Shore Temple and the rock carvings', where: 'Mamallapuram', state: 'TN' },
        { what: 'Hampi — you can walk the market street of Vijayanagara', where: 'near Hosapete',
          state: 'KA' },
        { what: 'The old spice coast, where Roman ships once anchored', where: 'Kodungallur and ' +
          'the Muziris sites', state: 'KL' }
      ],
      stories: ['fk.kannagi-anklet', 'fk.poompuhar-sea', 'fk.avvaiyar-naaval',
                'wt.tenali-vikatakavi', 'wt.tenali-book', 'fk.lepakshi'],
      listen: 'While empires rose and fell in the north, the south was writing poetry, ' +
              'casting bronze and sending ships across the sea — this is that story.',
      sources: ['Chola inscriptions at Thanjavur', 'Sangam corpus',
                'Accounts of visitors to Vijayanagara, including Domingo Paes',
                'Roman coin hoards found in Tamil Nadu and Kerala',
                'ASI, the Mamallapuram monuments']
    },
    {
      id: 'chola', title: 'The Kings of the Sea', when: 'about 850–1250 CE', gate: 8,
      badge: 'itihaas', place: 'TN', avatar: 'royal_elephant',
      hook: 'They ruled from a river delta, chose village committees by drawing names from ' +
            'a pot, and sent a navy across an ocean.',
      kid: 'From the Kaveri delta the Cholas built the grandest temple of their age at ' +
           'Thanjavur, wrote records of nearly everything onto temple walls, and under ' +
           'Rajendra I sent ships all the way to Srivijaya — in today\'s Indonesia and ' +
           'Malaysia.',
      big: 'Their temple walls are covered in inscriptions — land records, gifts, wages — ' +
           'which is why historians know Chola daily life better than almost any other ' +
           'period of early India. At Uttaramerur, inscriptions spell out how villages chose ' +
           'their committees: names into a pot, and a young boy draws the lots.',
      wonder: 'The bronze-casters\' method — a wax model, a clay mould, molten metal — is ' +
              'still used in Swamimalai today. What else do you use every day that is a ' +
              'thousand years old?',
      objects: ['A Nataraja bronze', 'The Brihadisvara temple at Thanjavur',
                'A pot for drawing village-committee lots'],
      moments: [
        { when: 'about 850',
          what: 'Vijayalaya takes Thanjavur, and the Chola family begins its long climb.' },
        { when: 'about 920',
          what: 'At Uttaramerur, villagers carve the rules for choosing their committees ' +
                'onto the assembly-hall walls — names into a pot, a boy draws.' },
        { when: '1010',
          what: 'Rajaraja I completes the great Brihadisvara temple at Thanjavur, its tower ' +
                'among the tallest things ever raised in India till then.' },
        { when: '1025',
          what: 'Rajendra I sends a naval expedition across the Bay of Bengal against ' +
                'Srivijaya — the boldest overseas strike of any Indian kingdom.' },
        { when: 'about 1030',
          what: 'Rajendra builds a new capital, Gangaikonda Cholapuram — "the town of the ' +
                'Chola who took the Ganga".' },
        { when: 'the 1000s and 1100s',
          what: 'Workshops around Thanjavur cast the great Nataraja bronzes, and dancers and ' +
                'musicians fill the temple records by name.' }
      ],
      figures: [
        { id: null, name: 'Rajaraja I',
          line: 'Built the Thanjavur temple and had every gift to it — down to single lamps ' +
                '— carved into its walls, which is how we know his world so well.' },
        { id: null, name: 'Rajendra I',
          line: 'Marched north to the Ganga and sailed east to Srivijaya — then named his ' +
                'new city after the river he had reached.' },
        { id: null, name: 'Sembiyan Mahadevi',
          line: 'A Chola queen who spent some fifty years rebuilding old brick temples in ' +
                'stone — the inscriptions record her gifts by name.' }
      ],
      today: [
        { what: 'The Brihadisvara temple, still in worship after a thousand years',
          where: 'Thanjavur', state: 'TN' },
        { what: 'Gangaikonda Cholapuram, Rajendra\'s quieter capital', where: 'near ' +
          'Jayankondam', state: 'TN' },
        { what: 'Bronze-casting workshops using the old lost-wax method', where: 'Swamimalai',
          state: 'TN' }
      ],
      stories: ['fk.karikala-kaveri', 'fk.kaveri-pot'],
      listen: 'Follow the Kaveri down to the sea and you reach a kingdom that wrote its ' +
              'whole life on temple walls and sent its ships over the horizon.',
      sources: ['Inscriptions of the Brihadisvara temple, Thanjavur',
                'The Uttaramerur inscriptions',
                'Rajendra I\'s Thanjavur inscription recording the Srivijaya expedition',
                'UNESCO listing, the Great Living Chola Temples']
    },
    {
      id: 'temple-builders', title: 'Mountains Made by Hand', when: 'about 600–1300 CE', gate: 8,
      badge: 'itihaas', place: 'OR', avatar: 'shiva',
      hook: 'Some kingdoms wrote books. These ones carved whole mountains.',
      kid: 'Between the Guptas and the sultans, India filled with temple kingdoms. The ' +
           'Rashtrakutas cut the Kailasa temple at Ellora downwards out of a single cliff. ' +
           'The Chandelas raised Khajuraho. In the east, the Pala kings kept the great ' +
           'universities of Nalanda and Vikramashila teaching, and the Eastern Gangas built ' +
           'Konark — a temple shaped like the sun\'s own chariot, with stone wheels that ' +
           'tell the time.',
      big: 'This is also when Indian ideas travelled hardest: monks from Pala Bengal carried ' +
           'Buddhism across the mountains to Tibet, and sailors from Kalinga — today\'s ' +
           'Odisha — traded across the sea towards Java and Bali, which is why Odisha still ' +
           'floats little boats every year to remember them.',
      wonder: 'The Kailasa temple was not built up — it was carved down, starting from the ' +
              'top of the cliff. How do you plan a building you can only make by taking ' +
              'away?',
      objects: ['The Kailasa temple at Ellora', 'A carved stone wheel at Konark',
                'A Pala bronze of the Buddha'],
      moments: [
        { when: 'the 630s',
          what: 'Xuanzang, walking from China, studies at Nalanda and describes its towers ' +
                'and its thousands of students.' },
        { when: 'about 756–773',
          what: 'Under the Rashtrakuta king Krishna I, carvers begin the Kailasa temple at ' +
                'Ellora — a full-size temple cut down out of the living rock.' },
        { when: 'the 700s to 1100s',
          what: 'The Pala kings of Bengal and Bihar support Nalanda and found Vikramashila — ' +
                'students come from Tibet, China and Southeast Asia.' },
        { when: 'about 950–1050',
          what: 'The Chandela kings build the Khajuraho temples, covered in carvings of ' +
                'gods, dancers, musicians and everyday life.' },
        { when: '1042',
          what: 'Atisha, a scholar-monk of Vikramashila, crosses the mountains to Tibet, ' +
                'where he is remembered to this day.' },
        { when: 'about 1250',
          what: 'King Narasimhadeva I\'s builders raise Konark — the sun temple as a giant ' +
                'chariot with twelve pairs of carved wheels.' }
      ],
      figures: [
        { id: null, name: 'Atisha',
          line: 'A monk from Bengal whom Tibet begged to come teach — he crossed the ' +
                'Himalaya in his sixties and never went home.' },
        { id: null, name: 'Dharmapala',
          line: 'The Pala king who founded Vikramashila university — its ruins were only ' +
                'found again in modern times.' },
        { id: null, name: 'Narasimhadeva I',
          line: 'The Eastern Ganga king whose builders shaped Konark — a whole temple as ' +
                'the sun god\'s chariot.' }
      ],
      today: [
        { what: 'Konark, the stone chariot of the sun', where: 'near Puri', state: 'OR' },
        { what: 'The Khajuraho temples', where: 'Chhatarpur district', state: 'MP' },
        { what: 'The excavated ruins of Nalanda', where: 'near Rajgir', state: 'BR' }
      ],
      stories: ['it.konark-chariot', 'fk.rasagola-door', 'fk.boita-bandana'],
      listen: 'For six hundred years, kingdom after kingdom answered the same dare: build ' +
              'something that will still make people gasp in a thousand years.',
      sources: ['Xuanzang\'s account of Nalanda',
                'ASI, the Ellora caves and the Kailasa temple',
                'ASI, Khajuraho and Konark',
                'Tibetan accounts of Atisha of Vikramashila',
                'Excavated ruins of Nalanda and Vikramashila']
    },
    {
      id: 'sultanate-mughal', title: 'Domes, Gardens and Miniatures', when: '1206–1857', gate: 9,
      badge: 'itihaas', place: 'UP', avatar: 'akbar',
      hook: 'New rulers, new architecture, and a court that argued about religion for fun.',
      kid: 'The Delhi Sultanate and then the Mughals ruled much of northern India. They built ' +
           'the Qutub Minar, Fatehpur Sikri, the Taj Mahal. Persian mixed with local ' +
           'languages and became a new way of speaking; miniature painters worked in colours ' +
           'ground from stone.',
      big: 'Akbar held debates between scholars of different faiths in his Ibadat Khana and ' +
           'abolished a tax on non-Muslims. Later rulers governed differently — Aurangzeb ' +
           'reimposed it. Individual rulers made individual choices, and they varied a lot.',
      wonder: 'This is also when the Bhakti and Sufi poets were writing — Kabir, Mirabai, ' +
              'Amir Khusrau — and their songs are still sung.',
      objects: ['A Mughal miniature', 'The Qutub Minar', 'Kabir\'s dohas'],
      moments: [
        { when: '1206',
          what: 'Qutbuddin Aibak begins the Delhi Sultanate — the Qutub Minar is already ' +
                'rising over the city.' },
        { when: '1236–1240',
          what: 'Razia Sultan rules Delhi — a woman on the throne, centuries before most of ' +
                'the world would try it.' },
        { when: '1526',
          what: 'Babur wins at Panipat and begins the Mughal line — and writes honestly ' +
                'about all of it in his diary, the Baburnama.' },
        { when: '1556–1605',
          what: 'Akbar rules for half a century — hosting debates between faiths in his ' +
                'Ibadat Khana, and abolishing the tax on non-Muslims.' },
        { when: '1632–1653',
          what: 'Thousands of craftsmen raise the Taj Mahal at Agra, in white marble that ' +
                'changes colour with the light.' },
        { when: '1857',
          what: 'The last Mughal emperor, Bahadur Shah Zafar — a poet — is exiled after the ' +
                'great uprising, and the era closes.' }
      ],
      figures: [
        { id: 'akbar', name: 'Akbar',
          line: 'Could not read — his books were read to him — yet built one of the great ' +
                'libraries of the world and asked scholars of every faith to argue in front ' +
                'of him.' },
        { id: 'birbal', name: 'Birbal',
          line: 'Akbar\'s quickest courtier — the stories about his wit are told to this ' +
                'day, and some of them may even be true.' },
        { id: 'tansen', name: 'Tansen',
          line: 'The court musician people said could bring rain and light lamps with a ' +
                'raga — that part is katha, but the musician was real.' },
        { id: null, name: 'Razia Sultan',
          line: 'Delhi\'s only woman sultan — trained to rule, and remembered for insisting ' +
                'on being seen doing it.' }
      ],
      today: [
        { what: 'The Qutub Minar and its courtyard', where: 'Delhi', state: 'DL' },
        { what: 'The Taj Mahal', where: 'Agra', state: 'UP' },
        { what: 'The Charminar, from the Deccan sultanate of the Qutb Shahs',
          where: 'Hyderabad', state: 'TG' }
      ],
      stories: ['ab.shorter-line', 'ab.khichdi', 'ab.crows', 'it.razia-sultan',
                'it.tansen-tigers', 'sk.langar-akbar'],
      listen: 'New kings came with new songs and new stones — and out of the mixing came ' +
              'buildings, paintings and words that India still lives inside.',
      sources: ['Abul Fazl, Ain-i-Akbari', 'Babur, Baburnama', 'ASI records for Qutub ' +
                'complex, Fatehpur Sikri and the Taj Mahal',
                'Minhaj-i-Siraj\'s chronicle of the Delhi Sultanate, on Razia']
    },
    {
      id: 'marathas-sikhs', title: 'Forts, Horses and the Gurus', when: 'about 1600–1850', gate: 9,
      badge: 'itihaas', place: 'MH', avatar: 'shivaji',
      hook: 'Hill forts you cannot besiege, and a new community built around a free kitchen.',
      kid: 'Shivaji built a Maratha state on forts and fast-moving cavalry. In Punjab, the ten ' +
           'Sikh Gurus taught over about two centuries, and Ranjit Singh later ruled a large ' +
           'kingdom from Lahore. In the Northeast the Ahoms held Assam for six hundred years.',
      big: 'These were not a footnote to Delhi. The Marathas became the dominant power in ' +
           'much of India in the 1700s, and the Ahom kingdom outlasted several empires.',
      wonder: 'Raigad, Sinhagad, Pratapgad — you can climb them. The Golden Temple still feeds ' +
              'everyone who comes.',
      objects: ['A Maratha hill fort', 'The Golden Temple at Amritsar', 'An Ahom coin'],
      moments: [
        { when: 'from 1469',
          what: 'Guru Nanak begins the line of ten Gurus — teaching one humanity, honest ' +
                'work, and a kitchen where everyone eats together.' },
        { when: '1671',
          what: 'On the Brahmaputra at Saraighat, the Ahom general Lachit Borphukan turns ' +
                'back a Mughal fleet.' },
        { when: '1674',
          what: 'Shivaji is crowned Chhatrapati at Raigad fort.' },
        { when: '1699',
          what: 'Guru Gobind Singh founds the Khalsa at Anandpur.' },
        { when: 'the 1700s',
          what: 'Maratha power spreads until much of India answers to Pune — while in Assam ' +
                'the Ahoms complete six centuries of unbroken rule.' },
        { when: '1801–1839',
          what: 'Ranjit Singh rules his Sikh kingdom from Lahore, wearing the Koh-i-noor on ' +
                'his arm.' }
      ],
      figures: [
        { id: 'shivaji', name: 'Shivaji',
          line: 'Took forts the hard way — up the cliff nobody watched — and built a state ' +
                'from mountains the empires could not hold.' },
        { id: null, name: 'Guru Nanak',
          line: 'Asked why anyone should be a stranger, and answered with a kitchen where ' +
                'everyone sits on the floor together.' },
        { id: null, name: 'Jijabai',
          line: 'Shivaji\'s mother, who raised him on stories of heroes — a story in this ' +
                'app remembers her telling them.' },
        { id: null, name: 'Lachit Borphukan',
          line: 'The Ahom general who beat a Mughal fleet on the river at Saraighat — Assam ' +
                'still celebrates him every year.' }
      ],
      today: [
        { what: 'Raigad, the fort where Shivaji was crowned', where: 'Raigad district',
          state: 'MH' },
        { what: 'Harmandir Sahib, the Golden Temple — the kitchen still feeds everyone',
          where: 'Amritsar', state: 'PB' },
        { what: 'The Rang Ghar and the Ahom monuments', where: 'Sivasagar', state: 'AS' }
      ],
      stories: ['it.jijabai-stories', 'fk.shivaji-baskets', 'fk.hirkani-cliff',
                'sk.sacha-sauda', 'fk.tukaram-notebooks'],
      listen: 'While emperors watched from Delhi, other Indias were rising — on hill forts ' +
              'in the west, around a shared kitchen in Punjab, and along the Brahmaputra in ' +
              'the east.',
      sources: ['Maratha-period records and fort archaeology', 'Sikh historical tradition and ' +
                'the Gurus\' compositions', 'Ahom Buranji chronicles',
                'Contemporary European and Persian accounts of Ranjit Singh\'s court']
    },
    {
      id: 'colonial', title: 'When India Was Ruled From Somewhere Else', when: '1757–1947', gate: 11,
      badge: 'itihaas', place: 'WB', avatar: 'courtier',
      hook: 'A trading company ended up governing a subcontinent. It did not go well for the ' +
            'people who lived there.',
      kid: 'The East India Company began as traders and ended up ruling. After 1857 the ' +
           'British government took over directly. Railways and telegraphs were built — ' +
           'largely to move goods and troops — while India\'s own weaving and shipbuilding ' +
           'industries declined.',
      big: 'There were repeated famines under colonial administration in which millions died, ' +
           'and policy decisions made them worse. This is not a comfortable part of the story ' +
           'and it should not be told comfortably. Reform movements grew through this period ' +
           'too, on education, on women\'s rights, and against caste discrimination.',
      wonder: 'Ask a grandparent whether anyone in your family remembers this time. Many ' +
              'families do.',
      objects: ['A Company rupee', 'A spinning wheel', 'A railway timetable from 1900'],
      moments: [
        { when: '1757',
          what: 'After the battle of Plassey, the East India Company — a trading business — ' +
                'starts collecting Bengal\'s taxes.' },
        { when: '1770',
          what: 'Famine kills millions in Bengal while the Company keeps collecting — the ' +
                'first of the era\'s terrible famines.' },
        { when: '1853',
          what: 'The first passenger railway runs, Bombay to Thane — the lines spread fast, ' +
                'built mainly to move cotton, grain and troops.' },
        { when: '1857',
          what: 'Soldiers and civilians rise across northern India. The uprising is put ' +
                'down with great violence on both sides, and the British Crown takes over ' +
                'from the Company.' },
        { when: '1919',
          what: 'At Jallianwala Bagh in Amritsar, troops are ordered to fire on an unarmed ' +
                'crowd, and hundreds are killed. India does not forget it.' },
        { when: '1943',
          what: 'Famine again, in wartime Bengal — millions die while the policies that ' +
                'should have fed them fail. Historians still study how it was allowed to ' +
                'happen.' }
      ],
      figures: [
        { id: 'lakshmibai', name: 'Rani Lakshmibai',
          line: 'The queen of Jhansi who rode into battle in 1857 rather than hand over her ' +
                'kingdom — even the general sent against her wrote of her courage.' },
        { id: null, name: 'Dadabhai Naoroji',
          line: 'Sat down with the numbers and showed India\'s wealth draining away — then ' +
                'said it out loud in the British Parliament, where he had won a seat.' },
        { id: null, name: 'Birsa Munda',
          line: 'An Adivasi teenager who led his people against unjust land laws — ' +
                'Jharkhand calls him Dharti Aba, Father of the Earth.' }
      ],
      today: [
        { what: 'Jallianwala Bagh, kept as a memorial garden', where: 'Amritsar', state: 'PB' },
        { what: 'The Gateway of India — the last British troops sailed out past it in 1948',
          where: 'Mumbai', state: 'MH' },
        { what: 'The Victoria Memorial, now a museum of this era', where: 'Kolkata',
          state: 'WB' }
      ],
      stories: ['it.birsa-munda'],
      listen: 'For nearly two hundred years, decisions about India were made far away, by ' +
              'people who had never seen it — this stretch of the river runs slow and heavy, ' +
              'and we will tell it honestly.',
      sources: ['Parliamentary records of the Company and Crown administrations',
                'Famine Commission reports', 'Dadabhai Naoroji, Poverty and Un-British Rule in India',
                'Hunter Commission inquiry records on Amritsar, 1919–20',
                'Famine Inquiry Commission report on Bengal, 1945'],
      needs_review: true,
      review_note: 'Famines, 1857 and Jallianwala Bagh: draft only. Editorial policy §6 — ' +
                   'a human author and a named reviewer must sign off before any of this ' +
                   'is published.'
    },
    {
      id: 'freedom', title: 'Winning It Back', when: '1885–1947', gate: 9,
      badge: 'itihaas', place: 'GJ', avatar: 'gandhi',
      hook: 'A man walked 240 miles to pick up a handful of salt, and an empire did not know ' +
            'what to do about it.',
      kid: 'Millions of people, over sixty years, in a hundred different ways. Gandhi\'s salt ' +
           'march and non-cooperation. Ambedkar\'s fight for the rights of people crushed by ' +
           'caste. Bhagat Singh\'s defiance. Sarojini Naidu, Bose, Nehru, Patel, and enormous ' +
           'numbers of people whose names are not in any book.',
      big: 'They did not all agree. Gandhi and Ambedkar argued hard and publicly about how to ' +
           'end caste injustice. Disagreeing is not the same as being on different sides.',
      wonder: 'Independence came at midnight on 15 August 1947 — and with Partition, which ' +
              'uprooted millions and is still grieved in families on all sides.',
      objects: ['A handful of salt from Dandi', 'The charkha', 'The tricolour'],
      moments: [
        { when: '1885',
          what: 'The Indian National Congress first meets in Bombay — seventy-two delegates, ' +
                'and the beginning of asking together.' },
        { when: '1905–1911',
          what: 'Bengal is split in two, and then — after years of protest, swadeshi and ' +
                'song — put back together. A lesson in what a movement can do.' },
        { when: '1930',
          what: 'Gandhi walks 240 miles to Dandi and picks up salt from the beach — ' +
                'breaking, on purpose and in public, a law that taxed even salt.' },
        { when: '1930–1932',
          what: 'Ambedkar argues at the London Round Table Conferences for the rights of ' +
                'people whom others had pushed to the margins.' },
        { when: '1942',
          what: '"Quit India" — and tens of thousands of people, Gandhi among them, are ' +
                'jailed for saying it.' },
        { when: '15 August 1947',
          what: 'Independence at midnight — and Partition with it: the land divided, ' +
                'millions uprooted, a grief many families still carry. That part of the ' +
                'story is told fully when you are older.' }
      ],
      figures: [
        { id: 'gandhi', name: 'Mahatma Gandhi',
          line: 'Found a way for unarmed people to be stronger than an empire: refuse, ' +
                'openly and politely, and take the consequences together.' },
        { id: 'ambedkar', name: 'Dr B. R. Ambedkar',
          line: 'Made to sit apart from his classmates as a boy; grew up to write the rules ' +
                'of the whole country.' },
        { id: 'sarojini', name: 'Sarojini Naidu',
          line: 'A poet who led marches and went to prison laughing — they called her the ' +
                'Nightingale of India.' },
        { id: 'bhagat', name: 'Bhagat Singh',
          line: 'Chose defiance and paid with his life at twenty-three — remembered even by ' +
                'those who argued with his methods.' }
      ],
      today: [
        { what: 'Sabarmati Ashram, where the Salt March began', where: 'Ahmedabad',
          state: 'GJ' },
        { what: 'The Cellular Jail, where freedom fighters were held', where: 'Port Blair',
          state: 'AN' },
        { what: 'August Kranti Maidan, where "Quit India" was launched', where: 'Mumbai',
          state: 'MH' }
      ],
      stories: [],
      listen: 'No single hero won this — it took millions of ordinary people, sixty years, ' +
              'and a hundred different kinds of brave.',
      sources: ['Gandhi, Collected Works', 'Constituent Assembly Debates',
                'Indian National Congress records',
                'Records of the first Indian National Congress session, 1885',
                'B. R. Ambedkar, Writings and Speeches (Government of Maharashtra edition)'],
      partition_gate: 11,
      needs_review: true,
      review_note: 'Partition, jailings and executions: draft only. Editorial policy §6 — ' +
                   'a human author and a named reviewer must sign off before publication; ' +
                   'partition_gate 11 applies to the Partition moment.'
    },
    {
      id: 'modern', title: 'A Country Writing Its Own Rules', when: '1947 to now', gate: 7,
      badge: 'itihaas', place: 'DL', avatar: 'ambedkar',
      hook: 'The longest written constitution in the world, and a rocket to Mars on a budget.',
      kid: 'India wrote a constitution guaranteeing every adult a vote from the very first ' +
           'election — something most countries took a century to reach. Dr Ambedkar chaired ' +
           'the drafting committee. Since then: the Green Revolution, a software industry, ' +
           'and a space programme that reached Mars on its first try.',
      big: 'Universal adult suffrage from 1950 was genuinely radical. Britain had only ' +
           'reached it in 1928, the United States in practice much later.',
      wonder: 'Your grandparents were probably alive for a lot of this. Ask them what changed ' +
              'in their lifetime.',
      objects: ['The Constitution of India', 'A Mangalyaan model', 'The first election\'s ballot box'],
      moments: [
        { when: '26 January 1950',
          what: 'The Constitution comes into force — every adult, one vote, from the very ' +
                'start.' },
        { when: '1951–52',
          what: 'The first general election: over 170 million people eligible, many voting ' +
                'by picture symbols — the biggest election the world had seen.' },
        { when: 'the 1960s and 70s',
          what: 'The Green Revolution: new seeds and hard-working farmers turn food ' +
                'shortage into food surplus.' },
        { when: '1975',
          what: 'Aryabhata — the satellite named for the mathematician — becomes India\'s ' +
                'first, launched into orbit.' },
        { when: '2014',
          what: 'Mangalyaan reaches Mars orbit on the first attempt — no country had done ' +
                'that before.' },
        { when: '2023',
          what: 'Chandrayaan-3 lands near the Moon\'s south pole — the first craft from any ' +
                'country to reach there.' }
      ],
      figures: [
        { id: 'kalam', name: 'A. P. J. Abdul Kalam',
          line: 'A boy who delivered newspapers in Rameswaram grew up to lead India\'s ' +
                'rocket programme — and then to be President.' },
        { id: 'kalpana', name: 'Kalpana Chawla',
          line: 'From Karnal to orbit — the first woman of Indian origin in space, who told ' +
                'children the path from dreams to success does exist.' },
        { id: null, name: 'Verghese Kurien',
          line: 'The "milkman of India" — helped farmers organise their own dairies until ' +
                'India produced more milk than any country on Earth.' }
      ],
      today: [
        { what: 'The Statue of Unity, the world\'s tallest statue, of Sardar Patel',
          where: 'Kevadia', state: 'GJ' },
        { what: 'Sriharikota, where India\'s rockets launch — you can watch one go up',
          where: 'Satish Dhawan Space Centre', state: 'AP' },
        { what: 'Rashtrapati Bhavan and the Republic Day parade route', where: 'New Delhi',
          state: 'DL' }
      ],
      stories: ['it.nek-chand', 'fk.city-from-drawing', 'fk.republic-day'],
      listen: 'The newest stretch of the river is yours — your grandparents watched it ' +
              'being dug, and you are standing in it right now.',
      sources: ['The Constitution of India, 1950', 'Constituent Assembly Debates',
                'ISRO mission records',
                'Election Commission of India, records of the first general election',
                'National Dairy Development Board, Operation Flood records']
    }
  ]
};
