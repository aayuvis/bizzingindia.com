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
      sources: ['Archaeological Survey of India excavations at Mohenjo-daro, Harappa, ' +
                'Dholavira and Lothal', 'Indus seals found at Mesopotamian sites']
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
      sources: ['The Rigveda and its recension traditions', 'UNESCO lists Vedic chanting as ' +
                'Intangible Cultural Heritage']
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
      sources: ['Pali canon and Jain Agamas', 'Excavations at Rajgir, Vaishali and Sarnath']
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
      sources: ['Ashoka\'s Rock and Pillar Edicts, including Major Rock Edict XIII on Kalinga',
                'Megasthenes\' account, as quoted by later Greek writers']
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
      sources: ['Aryabhata, Aryabhatiya (499 CE)', 'Bakhshali manuscript', 'Xuanzang\'s ' +
                'account of Nalanda', 'ASI, Ajanta']
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
      sources: ['Chola inscriptions at Thanjavur', 'Sangam corpus',
                'Accounts of visitors to Vijayanagara, including Domingo Paes']
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
      sources: ['Abul Fazl, Ain-i-Akbari', 'Babur, Baburnama', 'ASI records for Qutub ' +
                'complex, Fatehpur Sikri and the Taj Mahal']
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
      sources: ['Maratha-period records and fort archaeology', 'Sikh historical tradition and ' +
                'the Gurus\' compositions', 'Ahom Buranji chronicles']
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
      sources: ['Parliamentary records of the Company and Crown administrations',
                'Famine Commission reports', 'Dadabhai Naoroji, Poverty and Un-British Rule in India'],
      needs_review: true
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
      sources: ['Gandhi, Collected Works', 'Constituent Assembly Debates',
                'Indian National Congress records'],
      partition_gate: 11
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
      sources: ['The Constitution of India, 1950', 'Constituent Assembly Debates',
                'ISRO mission records']
    }
  ]
};
