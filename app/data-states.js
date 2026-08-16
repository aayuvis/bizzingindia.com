/* Bizzing India — per-state detail for the Living Map.
   Keys match window.IND_GEO.states in data-geo.js, plus TG and LA from IND_GEO.pending.

   EDITORIAL NOTE (docs/05-editorial-policy.md is binding):
   - Population is the 2011 Census of India — the last completed full census. Every entry
     carries population_year: 2011. Where a figure could not be checked it is omitted, not
     guessed. Areas are the standard published state areas.
   - `myth` content is Katha — story as it is told — and is written from the inside, the way
     a family from that region would want their child to hear it. It is never presented as
     disproven, never ranked against another tradition, never frightening. Adivasi and tribal
     traditions here are living religions, not "folklore" in some lesser sense.
   - `people` are from the state by birth, or by an association strong enough to say so in
     `why`. Anything shaky is named in `unsure`, per state.
   - Historical claims that go beyond geography still need sources[] before they ship in a
     content object. This file is map furniture, not a substitute for a sourced Itihaas card.
*/

window.IND_STATES = {

  AN: {
    capital: "Port Blair",
    formed: "A union territory since 1956",
    population: 380581, population_year: 2011,
    area_km2: 8249,
    languages: ["Hindi", "Bengali", "Tamil", "Telugu", "Nicobarese", "English"],
    script: "Several — Devanagari, Bengali, Tamil and the Latin script are all in daily use",
    symbols: { animal: "Dugong", bird: "Andaman wood pigeon", tree: "Andaman padauk" },
    people: [],
    food: [
      { dish: "Fish curry with coconut", what: "Fresh-caught fish in a thin coconut gravy — the everyday meal on most islands." },
      { dish: "Grilled seafood", what: "Lobster, crab and squid cooked over coals right by the beach." },
      { dish: "Coconut everything", what: "Coconut goes into the curry, the chutney, the sweets and the drink." }
    ],
    places: [
      { name: "Radhanagar Beach, Swaraj Dweep", what: "A long white curve of sand that regularly turns up on lists of the best beaches in Asia." },
      { name: "Barren Island", what: "A volcano sticking out of the sea — the only active one in South Asia." },
      { name: "Mahatma Gandhi Marine National Park", what: "Coral gardens you can look down into from a glass-bottomed boat." },
      { name: "Cellular Jail, Port Blair", what: "A colonial-era prison, now a national memorial." },
      { name: "Indira Point", what: "The southernmost tip of India, on Great Nicobar." }
    ],
    trivia: [
      "These islands are closer to Myanmar and Indonesia than to the Indian mainland.",
      "Barren Island has South Asia's only active volcano, and nobody lives on it.",
      "The coconut crab, the largest land crab in the world, lives in the Nicobars — it can crack a coconut open with its claws.",
      "There are more than 500 islands here, and most of them have nobody living on them at all."
    ],
    hello: { word: "नमस्ते", roman: "Namaste" },
    myth: {
      deities: [
        { name: "Puluga (also called Biliku)", what: "In Great Andamanese tradition, the creator, spoken of with the north-east wind that brings the change of season." }
      ],
      legend: null,
      living: [
        { name: "Island communities keeping their own languages", what: "The Nicobarese, Onge, Great Andamanese and Jarawa each hold their own traditions — several of these languages are spoken by only a few hundred people." }
      ]
    },
    unsure: [
      "No `people` entry: could not confidently name a nationally known figure born in the islands, so the field is left empty rather than padded.",
      "Andamanese and Nicobarese traditions are recorded mostly in early-20th-century anthropology; only the single best-attested name (Puluga/Biliku) is used, and no legend is retold. Needs a specialist reviewer before it ships.",
      "Highest point (Saddle Peak) height not stated — figure not verified."
    ]
  },

  AP: {
    capital: "Amaravati",
    formed: "1 November 1956 as Andhra Pradesh (Andhra State had been created in 1953). Telangana was separated from it in 2014.",
    population: 49506799, population_year: 2011,
    area_km2: 162968,
    languages: ["Telugu", "Urdu", "English"],
    script: "Telugu",
    symbols: { animal: "Blackbuck", bird: "Indian roller (palapitta)", tree: "Neem", flower: "Jasmine" },
    people: [
      { name: "Pingali Venkayya", what: "Designer", why: "Born in Bhatlapenumarru in coastal Andhra; the flag he designed is the basis of India's national flag." },
      { name: "Yellapragada Subbarow", what: "Biochemist", why: "Born in Bhimavaram; his work led to medicines still used against cancer and infection today." },
      { name: "Annamacharya", what: "Poet-composer", why: "Born at Tallapaka; he wrote thousands of Telugu songs for the deity at Tirumala, and copper plates of them were found in the temple." },
      { name: "Pullela Gopichand", what: "Badminton player and coach", why: "Born in Nagandla, Prakasam district; All England champion, and the coach behind a generation of Indian players." }
    ],
    food: [
      { dish: "Pulihora", what: "Tangy tamarind rice with peanuts and curry leaves — temple food and picnic food both." },
      { dish: "Gongura pachadi", what: "A chutney made from sour sorrel leaves; Andhra families argue about whose is best." },
      { dish: "Pesarattu", what: "A dosa made from whole green gram, usually eaten with upma tucked inside." },
      { dish: "Tirupati laddu", what: "The temple sweet given to pilgrims, made in its own kitchen by the lakh." },
      { dish: "Ulava charu", what: "A thick, dark horsegram soup, slow-cooked for hours." }
    ],
    places: [
      { name: "Tirumala", what: "The hill temple of Venkateswara, one of the busiest places of worship on Earth." },
      { name: "Lepakshi", what: "A 16th-century temple with a stone pillar that hangs a whisker off the floor." },
      { name: "Araku Valley", what: "Coffee hills reached by a train that goes through dozens of tunnels." },
      { name: "Gandikota", what: "A fort on the edge of a deep red gorge cut by the Penna river." },
      { name: "Amaravati", what: "The remains of a great ancient Buddhist stupa, and the name of the new capital." }
    ],
    trivia: [
      "Andhra Pradesh has India's second-longest coastline, after Gujarat.",
      "The Tirupati laddu has a Geographical Indication tag — it can legally only be made at that temple.",
      "At Lepakshi you can pass a sheet of cloth right under one of the temple's pillars.",
      "Borra Caves in the Araku hills are among the deepest caves in India."
    ],
    hello: { word: "నమస్కారం", roman: "Namaskaram" },
    myth: {
      deities: [
        { name: "Venkateswara (Balaji)", what: "The lord of the seven hills at Tirumala, to whom people bring their hair, their savings and their hardest wishes." },
        { name: "Gangamma", what: "The goddess of Tirupati town, thought of as the fierce elder sister who guards the place." },
        { name: "Poleramma and Ankamma", what: "Village goddesses whose small shrines stand at the edge of fields all across coastal Andhra." }
      ],
      legend: {
        name: "The loan that is still being repaid",
        tell: "When Venkateswara wanted to marry Padmavati, the story goes that he had nothing to pay for the wedding, so he borrowed from Kubera, the keeper of treasure. The interest is still running. That is why people drop coins and notes into the hundi at Tirumala — in many families they will tell you, quite seriously, that they are helping him clear his debt."
      },
      living: [
        { name: "Gangamma Jatara", what: "A week in Tirupati when people put on veshams — disguises and painted faces — to go before the goddess." },
        { name: "Burrakatha", what: "Three performers, a hollow drum called a burra, and a whole story told standing up, half sung and half argued." },
        { name: "Grama devata shrines", what: "The small goddess shrine at the village boundary, garlanded before anything important is begun." }
      ]
    },
    unsure: [
      "Area given is for Andhra Pradesh after the 2014 bifurcation; published figures vary slightly between 162,968 and 162,975 km2.",
      "State flower listed as jasmine — designated symbol, but the exact species named in the notification was not verified."
    ]
  },

  AR: {
    capital: "Itanagar",
    formed: "Became the union territory of Arunachal Pradesh in 1972; a full state on 20 February 1987",
    population: 1383727, population_year: 2011,
    area_km2: 83743,
    languages: ["Nyishi", "Adi", "Galo", "Apatani", "Monpa", "Nocte", "Hindi", "English"],
    script: "Mostly the Latin script; Tibetan script for Monpa Buddhist texts",
    symbols: { animal: "Mithun (gayal)", bird: "Great hornbill", tree: "Hollong", flower: "Foxtail orchid" },
    people: [
      { name: "Mamang Dai", what: "Poet and novelist", why: "From Pasighat; she writes the Adi world — rivers, forests, memory — into English literature." },
      { name: "Anshu Jamsenpa", what: "Mountaineer", why: "From Bomdila; she has stood on the summit of Everest five times, twice within five days." },
      { name: "Tapi Mra", what: "Mountaineer", why: "From the Nyishi community of Arunachal; the first person from the state to climb Everest, in 2009." }
    ],
    food: [
      { dish: "Thukpa", what: "A hot noodle soup from the high Monpa country, eaten when the passes are cold." },
      { dish: "Zan", what: "A thick millet or flour porridge with leafy greens — the everyday Monpa meal." },
      { dish: "Pika pila", what: "An Apatani pickle of bamboo shoot and king chilli, sour and very hot." },
      { dish: "Bamboo shoot with smoked meat", what: "Meat hung above the kitchen fire for weeks, then cooked with fermented bamboo." },
      { dish: "Momos", what: "Steamed dumplings, eaten everywhere from Tawang down to the plains." }
    ],
    places: [
      { name: "Tawang Monastery", what: "The largest monastery in India, on a spur high above the valley." },
      { name: "Ziro Valley", what: "The Apatani homeland — flat paddy fields with fish farmed in the same water as the rice." },
      { name: "Namdapha National Park", what: "Dense rainforest climbing from 200 m to over 4,500 m." },
      { name: "Sela Pass", what: "A pass at around 4,170 m with a frozen lake beside the road." },
      { name: "Dong", what: "The village in the far east where the sun reaches India first." }
    ],
    trivia: [
      "The sun rises over India here before anywhere else — the name means 'land of the dawn-lit mountains'.",
      "Namdapha is said to be the only protected area in the world where tiger, leopard, clouded leopard and snow leopard all live.",
      "Arunachal is the largest state in the Northeast by area, and one of the least crowded places in India.",
      "The Apatani grow rice and raise fish in the very same flooded field, without a drop of machinery."
    ],
    hello: null,
    myth: {
      deities: [
        { name: "Donyi-Polo", what: "The Sun and the Moon, held as the eye and truth of the world by the Tani peoples — Nyishi, Adi, Galo, Apatani." },
        { name: "Abotani", what: "The first man, the ancestor from whom the Tani communities trace themselves." },
        { name: "Wiyus", what: "The spirits of river, forest and household who are spoken to before a hunt, a harvest or a house." }
      ],
      legend: {
        name: "Abotani, the first ancestor",
        tell: "Before there were villages there was Abotani, and everything he learned he had to learn the hard way — from the animals, from the river, from his own mistakes. The Tani peoples count their descent from him, so when an elder begins a story with his name, the children in the room know it is about where they themselves come from."
      },
      living: [
        { name: "Solung, Mopin, Nyokum, Dree", what: "Four harvest and blessing festivals — Adi, Galo, Nyishi and Apatani — each with its own songs, and none of them the same." },
        { name: "The priest-singer", what: "A nyibu or miri chants for a whole night, and the chant is also the community's history, kept without writing." }
      ]
    },
    unsure: [
      "`hello` omitted deliberately: Arunachal has dozens of languages and no single greeting; a made-up 'Arunachali hello' would be wrong.",
      "Namdapha 'four big cats' claim is widely published by the forest department but a recent snow leopard record was not verified.",
      "Sela Pass elevation is variously given between 4,170 m and 4,200 m."
    ]
  },

  AS: {
    capital: "Dispur",
    formed: "A state since 1950; Nagaland, Meghalaya, Mizoram and Arunachal Pradesh were later carved out of it",
    population: 31205576, population_year: 2011,
    area_km2: 78438,
    languages: ["Assamese", "Bengali", "Bodo", "Hindi", "English"],
    script: "Bengali-Assamese",
    symbols: { animal: "One-horned rhinoceros", bird: "White-winged wood duck", tree: "Hollong", flower: "Foxtail orchid (kopou phul)" },
    people: [
      { name: "Srimanta Sankardeva", what: "Poet, playwright and teacher", why: "Born at Bordowa in Assam; he gave Assam its plays, its songs and the namghar prayer hall found in villages today." },
      { name: "Bhupen Hazarika", what: "Singer and composer", why: "Born in Sadiya; his voice on the Brahmaputra is what many Assamese families hear when they think of home." },
      { name: "Jyoti Prasad Agarwala", what: "Filmmaker and poet", why: "Born in Tezpur; he made Joymoti, the first Assamese film, in 1935." },
      { name: "Hima Das", what: "Sprinter", why: "Born in Dhing, Nagaon district; the first Indian to win a gold on the track at a world athletics championship, at the 2018 World U20." }
    ],
    food: [
      { dish: "Masor tenga", what: "A light, sour fish curry — sourness from tomato, lemon or dried mangosteen." },
      { dish: "Khar", what: "A dish made with an alkaline water filtered through banana ash; the first thing on an Assamese plate." },
      { dish: "Pitha", what: "Rice cakes made at Bihu — steamed, fried, or toasted over the fire with sesame inside." },
      { dish: "Aloo pitika", what: "Mashed potato with mustard oil, onion and green chilli. Simple and beloved." },
      { dish: "Assam tea", what: "Strong, malty, and grown right here — the plant is Assam's own variety." }
    ],
    places: [
      { name: "Kaziranga National Park", what: "Tall grass, elephants and the great one-horned rhino." },
      { name: "Majuli", what: "One of the largest river islands in the world, dotted with sattras — monastery-villages." },
      { name: "Kamakhya Temple", what: "A hilltop shrine above Guwahati, one of the great goddess sites of India." },
      { name: "Sivasagar", what: "Ahom-era tanks and monuments, including the oval Rang Ghar pavilion." },
      { name: "Umananda", what: "A tiny temple island in the middle of the Brahmaputra." }
    ],
    trivia: [
      "Assam's tea gardens keep their own clock — 'bagan time' runs one hour ahead of Indian Standard Time.",
      "Kaziranga holds around two-thirds of the world's one-horned rhinos.",
      "The Brahmaputra gets so wide in Assam that from one bank you sometimes cannot see the other.",
      "Assam tea comes from its own kind of tea plant, found growing wild in these hills."
    ],
    hello: { word: "নমস্কাৰ", roman: "Nomoskar" },
    myth: {
      deities: [
        { name: "Kamakhya", what: "The goddess of the Nilachal hill above Guwahati, worshipped not as an image but as a stone cleft with a spring in it." },
        { name: "Manasa (Marai)", what: "The snake goddess, called on in the flood season when the water and the snakes come together." },
        { name: "Bathow (Bwrai Bathou)", what: "In Bodo tradition, honoured through a living sijou plant in the courtyard, fenced with five rings of bamboo." }
      ],
      legend: {
        name: "Ambubachi, when the earth rests",
        tell: "For three days each June the doors of Kamakhya are shut, because the goddess — like the land in the first rains — is said to be resting. Nothing is sown, nothing is ploughed. On the fourth day the doors open and people come from all over India, and the red cloth from the shrine is carried home as a blessing."
      },
      living: [
        { name: "The three Bihus", what: "Assam's year turns on them: Rongali in spring for sowing, Kati in autumn when the granary is empty, Magh in winter when it is full." },
        { name: "Bhaona and Ankiya Naat", what: "Sankardeva's plays, still performed all night in the village namghar, with masks made of bamboo and clay." },
        { name: "Sattriya", what: "Dance that grew inside Majuli's monasteries and is now counted among India's classical forms." }
      ]
    },
    unsure: [
      "Bodo Bathow practice summarised briefly; the five-fold bamboo fencing and its meaning should be checked with a Bodo reviewer."
    ]
  },

  BR: {
    capital: "Patna",
    formed: "A separate province from 1936 and a state from 1950; Jharkhand was carved out of it in 2000",
    population: 104099452, population_year: 2011,
    area_km2: 94163,
    languages: ["Hindi", "Bhojpuri", "Maithili", "Magahi", "Urdu"],
    script: "Devanagari (Urdu is written in the Perso-Arabic script; Maithili also has its own old Mithilakshar script)",
    symbols: { animal: "Gaur", bird: "House sparrow", tree: "Peepal", flower: "Marigold" },
    people: [
      { name: "Ashoka", what: "Mauryan emperor", why: "Ruled from Pataliputra, today's Patna; his edicts carved on rock and pillar can still be visited." },
      { name: "Aryabhata", what: "Astronomer and mathematician", why: "Worked at Kusumapura near Pataliputra in the 5th century; where he was born is still argued about." },
      { name: "Vidyapati", what: "Poet", why: "Born at Bisapi in Mithila; his Maithili songs are still sung at weddings in north Bihar." },
      { name: "Rajendra Prasad", what: "First President of India", why: "Born at Ziradei in Siwan district." },
      { name: "Anand Kumar", what: "Maths teacher", why: "From Patna; he coaches thirty students from poor families for the IIT entrance every year, free." }
    ],
    food: [
      { dish: "Litti chokha", what: "Wheat balls stuffed with roasted gram flour, baked on coals, crushed with mashed brinjal and potato." },
      { dish: "Sattu", what: "Roasted gram flour — drunk cold with salt and lemon in summer, or stuffed into parathas." },
      { dish: "Thekua", what: "A hard, sweet, deep-fried biscuit made especially for Chhath." },
      { dish: "Silao khaja", what: "Dozens of paper-thin layers of pastry, fried and soaked in syrup. It has its own GI tag." },
      { dish: "Dal pitha", what: "Steamed rice dumplings with a spiced lentil filling — Bihar's own answer to the momo." }
    ],
    places: [
      { name: "Mahabodhi Temple, Bodh Gaya", what: "Where the Buddha is said to have found enlightenment under a Bodhi tree." },
      { name: "Nalanda", what: "The brick ruins of a residential university that drew students from China, Korea and Central Asia." },
      { name: "Rajgir", what: "Hills ringed with old walls, hot springs, and a white peace stupa reached by ropeway." },
      { name: "Kesaria Stupa", what: "One of the tallest Buddhist stupas anywhere, rising in earth-brown tiers out of the fields." },
      { name: "Golghar, Patna", what: "A giant stone beehive built in 1786 as a grain store, with a staircase spiralling up the outside." }
    ],
    trivia: [
      "The name Bihar comes from vihara, the word for a Buddhist monastery — the land was once full of them.",
      "The Chinese traveller Xuanzang studied at Nalanda in the 7th century and wrote about its daily timetable.",
      "Madhubani painting from north Bihar was originally done on the walls of houses, by women, for weddings.",
      "At Chhath, the very first prayer of the festival is offered to the setting sun, not the rising one."
    ],
    hello: { word: "प्रणाम", roman: "Pranaam" },
    myth: {
      deities: [
        { name: "Chhathi Maiya", what: "The goddess of the Chhath festival, spoken of as the sister of the sun and the protector of children." },
        { name: "Surya", what: "The sun himself, thanked standing waist-deep in the river at dusk and again at dawn." },
        { name: "Bishahari (Manasa)", what: "The snake goddess of the Anga country around Bhagalpur, honoured in the rainy months." }
      ],
      legend: {
        name: "Bihula and the raft",
        tell: "In the old Anga story, Bihula's husband Bala Lakhindar was bitten by a snake on their wedding night. Instead of mourning him she put him on a raft and floated down the river for months, singing, until she reached the gods and argued for his life — and won. Bhagalpur's Manjusha paintings still tell the whole journey, box by box, in red, green and pink."
      },
      living: [
        { name: "Chhath Puja", what: "Four days of fasting and river-standing — no priest, no temple, just families on the ghat at sunrise." },
        { name: "Manjusha art", what: "Paintings on paper and cloth that run like a comic strip, made to tell the Bihula story." },
        { name: "Bidesia", what: "Bhojpuri travelling theatre, invented by Bhikhari Thakur, about people who leave home to find work." }
      ]
    },
    unsure: [
      "Aryabhata's birthplace is genuinely disputed (Ashmaka vs Kusumapura); the entry says so rather than picking a side."
    ]
  },

  CH: {
    capital: "Chandigarh",
    formed: "Made a union territory on 1 November 1966, when Haryana was created",
    population: 1055450, population_year: 2011,
    area_km2: 114,
    languages: ["Hindi", "Punjabi", "English"],
    script: "Gurmukhi and Devanagari",
    symbols: { animal: "Indian grey mongoose", bird: "Indian grey hornbill", tree: "Mango", flower: "Dhak (flame of the forest)" },
    people: [
      { name: "Kapil Dev", what: "Cricketer", why: "Born in Chandigarh; captained India to the 1983 World Cup." },
      { name: "Nek Chand", what: "Artist", why: "Worked as a road inspector in Chandigarh and spent eighteen years secretly building the Rock Garden out of the city's rubbish." }
    ],
    food: [
      { dish: "Chole bhature", what: "Fat puffed bread with a dark, spicy chickpea curry." },
      { dish: "Amritsari kulcha", what: "A stuffed flatbread baked till blistered, crushed by hand and buttered." },
      { dish: "Lassi", what: "Sweet or salted yoghurt, whipped and served in a glass you need two hands for." }
    ],
    places: [
      { name: "Rock Garden", what: "Courtyards and waterfalls built from broken bangles, tiles and old plug sockets." },
      { name: "Capitol Complex", what: "Le Corbusier's concrete government buildings, a UNESCO World Heritage Site." },
      { name: "Sukhna Lake", what: "A man-made lake at the foot of the Shivaliks, full of migratory birds in winter." },
      { name: "Zakir Hussain Rose Garden", what: "Thousands of rose bushes across dozens of acres." }
    ],
    trivia: [
      "Chandigarh is the capital of two states at once — Punjab and Haryana — and belongs to neither.",
      "The whole city is divided into numbered Sectors, and there is no Sector 13.",
      "Nek Chand built the Rock Garden illegally on government land; when officials found it they decided to keep it.",
      "The Open Hand, the city's emblem, is a giant metal sculpture that turns in the wind."
    ],
    hello: { word: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", roman: "Sat Sri Akal" },
    myth: {
      deities: [
        { name: "Chandi", what: "The goddess the city is named after — Chandigarh means the fort of Chandi, from the old Chandi temple just outside it." }
      ],
      legend: null,
      living: [
        { name: "Lohri and Baisakhi", what: "A city built in the 1950s keeps the festivals of the countryside around it — the bonfire in January, the harvest dance in April." }
      ]
    },
    unsure: [
      "Chandigarh is a planned city barely seventy years old and has almost no folklore of its own; the myth block is deliberately thin rather than borrowed from Punjab and Haryana. The Chandi Mandir the city is named for stands just outside it, in Haryana.",
      "State symbols for union territories are less well documented than for states; these four are widely published but were not checked against a notification."
    ]
  },

  CT: {
    capital: "Raipur",
    formed: "1 November 2000, carved out of Madhya Pradesh",
    population: 25545198, population_year: 2011,
    area_km2: 135192,
    languages: ["Chhattisgarhi", "Hindi", "Gondi", "Halbi"],
    script: "Devanagari",
    symbols: { animal: "Wild buffalo", bird: "Hill myna", tree: "Sal" },
    people: [
      { name: "Teejan Bai", what: "Pandavani singer", why: "Born at Ganiyari near Durg; she was the first woman to perform Pandavani standing up, and took it around the world." },
      { name: "Habib Tanvir", what: "Playwright and director", why: "Born in Raipur; he built his theatre company around Chhattisgarhi folk actors and their own dialect." }
    ],
    food: [
      { dish: "Chila", what: "A soft pancake of ground rice, eaten with green chutney." },
      { dish: "Faraa", what: "Steamed rice rolls, sometimes tempered with mustard seed afterwards." },
      { dish: "Bafauri", what: "Steamed lentil dumplings — the healthy cousin of a pakora." },
      { dish: "Aamat", what: "A tangy Bastar vegetable stew, sharp with local herbs." },
      { dish: "Rugra", what: "A wild mushroom that pushes out of the ground after the first heavy rain, and is cooked the same week." }
    ],
    places: [
      { name: "Chitrakote Falls", what: "The widest waterfall in India, a horseshoe of orange monsoon water on the Indravati." },
      { name: "Kanger Valley National Park", what: "Limestone caves, including Kutumsar, and thick sal forest." },
      { name: "Bhoramdeo Temple", what: "An 11th-century stone temple under the Maikal hills." },
      { name: "Sirpur", what: "Brick temples and monastery ruins beside the Mahanadi." },
      { name: "Tirathgarh Falls", what: "Water dropping down a wide staircase of rock in stages." }
    ],
    trivia: [
      "Chitrakote is the widest waterfall in India — people call it the Niagara of India.",
      "Fish in the Kutumsar caves have no eyes at all; they have lived in total darkness for so long that they stopped needing them.",
      "Bastar's Dussehra runs for about 75 days, which makes it one of the longest festivals in the world.",
      "Chhattisgarh was created on the same night in 2000 as Uttarakhand and Jharkhand — three new states in one month."
    ],
    hello: { word: "जय जोहार", roman: "Jai Johar" },
    myth: {
      deities: [
        { name: "Danteshwari Mai", what: "The presiding goddess of Bastar; nothing important in the region begins without her." },
        { name: "Budha Deo", what: "The 'old god' of Gond tradition, honoured at a particular tree at the edge of the village." },
        { name: "Mahamaya", what: "The goddess of Ratanpur, whose old temple gave the region one of its ancient capitals." }
      ],
      legend: {
        name: "The Dussehra that is not about a war",
        tell: "Almost everywhere else in India, Dussehra ends with an effigy burning. In Bastar it is something else entirely: a huge wooden chariot, rebuilt from scratch each year by families who have done that job for generations, is pulled through Jagdalpur for the goddess Danteshwari. Villagers walk in from the forests for it, and the whole thing lasts more than two months."
      },
      living: [
        { name: "Pandavani", what: "The Mahabharata sung solo, standing, with a tambura in one hand that becomes Bhima's mace, Draupadi's hair, a chariot." },
        { name: "Bastar Dussehra", what: "Seventy-five days of ritual, chariot-building and gathering, led by Adivasi communities." },
        { name: "Karma dance", what: "Danced in a ring around a branch of the karma tree, sung by Gond and Baiga communities at the turn of the season." }
      ]
    },
    unsure: [
      "State flower not listed — could not confirm a designated flower for Chhattisgarh.",
      "Only two `people` entries: could not verify a third figure to the same standard.",
      "Bastar Dussehra duration is widely reported as 75 days; ritual details vary by year and by account."
    ]
  },

  DD: {
    capital: "Daman",
    formed: "A separate union territory in 1987, when Goa became a state; merged with Dadra & Nagar Haveli in 2020",
    population: 243247, population_year: 2011,
    area_km2: 112,
    languages: ["Gujarati", "Hindi", "Marathi", "English"],
    script: "Gujarati and Devanagari",
    symbols: {},
    people: [],
    food: [
      { dish: "Fried fish", what: "Pomfret or mackerel rubbed with chilli and semolina and fried till the edges crackle." },
      { dish: "Coastal seafood thali", what: "Prawns, crab and fish curry served together with rice and rotla." },
      { dish: "Gujarati snacks", what: "Dhokla, khakhra and fafda are as much at home here as any seaside dish." }
    ],
    places: [
      { name: "Moti Daman Fort", what: "A big Portuguese sea fort with a whole neighbourhood living inside its walls." },
      { name: "Diu Fort", what: "Ramparts, cannon and a lighthouse on the tip of the island." },
      { name: "Naida Caves, Diu", what: "A maze of quarried rock chambers with sunlight dropping through holes in the roof." },
      { name: "Gangeshwar Temple", what: "Five shivlings on the shore that the sea washes over at every high tide." },
      { name: "St Paul's Church, Daman", what: "A carved wooden Portuguese-era church interior." }
    ],
    trivia: [
      "Daman is cut in two by a river — Nani (small) Daman on one bank, Moti (big) Daman on the other.",
      "Diu is an island, reached from Gujarat by a bridge.",
      "These were Portuguese territories for over four hundred years, until 1961, and the forts still carry Portuguese inscriptions.",
      "At Gangeshwar the tide does the worship — the sea covers the shrine and uncovers it twice a day."
    ],
    hello: { word: "કેમ છો?", roman: "Kem chho?" },
    myth: {
      deities: [],
      legend: {
        name: "The five stones in the sea",
        tell: "At Gangeshwar, five small shivlings sit right on the rocks where the waves break. Local tradition says the Pandavas set them there during their years of exile, one for each brother, and left them to the sea. Whether or not you take that literally, the tide has been washing them for as long as anyone can remember."
      },
      living: [
        { name: "Nariyal Purnima", what: "Fishing families offer a coconut to the sea at the end of the monsoon before the boats go out again." }
      ]
    },
    unsure: [
      "No `people` entry and no state symbols: could not verify either to a publishable standard for this territory.",
      "The Gangeshwar Pandava association is local tradition, and is written as tradition, not as history."
    ]
  },

  DL: {
    capital: "New Delhi",
    formed: "A union territory from 1956; became the National Capital Territory of Delhi under a 1991 amendment, in force from 1992",
    population: 16787941, population_year: 2011,
    area_km2: 1483,
    languages: ["Hindi", "Punjabi", "Urdu", "English"],
    script: "Devanagari (Urdu in the Perso-Arabic script, Punjabi in Gurmukhi)",
    symbols: { animal: "Nilgai", bird: "House sparrow", tree: "Jamun" },
    people: [
      { name: "Mirza Ghalib", what: "Poet", why: "Born in Agra but lived most of his life in Delhi, and wrote the city into Urdu poetry for good." },
      { name: "Amir Khusrau", what: "Poet and musician", why: "Born at Patiyali, he lived and worked in Delhi; the qawwali tradition traces itself to him." },
      { name: "Virat Kohli", what: "Cricketer", why: "Born and brought up in Delhi, and came up through its maidan cricket." },
      { name: "Shah Rukh Khan", what: "Actor", why: "Born in New Delhi and schooled here before moving to Bombay." }
    ],
    food: [
      { dish: "Chaat", what: "Aloo tikki, golgappe, papdi — sour, sweet, hot and cold all in one mouthful." },
      { dish: "Chole bhature", what: "Delhi's loudest breakfast: bread the size of a football and dark chana." },
      { dish: "Paranthe", what: "Stuffed and fried in ghee, most famously in a lane in Chandni Chowk named after them." },
      { dish: "Daulat ki chaat", what: "A cloud of sweetened milk foam, sold only in winter, and gone by mid-morning." },
      { dish: "Butter chicken", what: "Invented in a Delhi kitchen when leftover tandoori chicken met tomato and cream." }
    ],
    places: [
      { name: "Qutub Minar", what: "The tallest brick minaret in the world, with a 1,600-year-old iron pillar beside it." },
      { name: "Humayun's Tomb", what: "The great garden tomb that the Taj Mahal's builders learned from." },
      { name: "Red Fort", what: "Red sandstone walls along the old city, and the place the Prime Minister speaks from each 15 August." },
      { name: "Lodhi Garden", what: "Six-hundred-year-old domed tombs standing in the middle of a public park." },
      { name: "Jama Masjid", what: "A wide sandstone courtyard above Chandni Chowk, with a view over the old city." }
    ],
    trivia: [
      "The iron pillar in the Qutub complex is about 1,600 years old and has hardly rusted — metallurgists still study why.",
      "People count seven cities of Delhi, built one after another, and you can still walk between the ruins of several of them.",
      "The Delhi Ridge is the very last northern spur of the Aravalli hills, running right through the capital.",
      "Daulat ki chaat is made only on cold winter nights, because the dew is part of the recipe."
    ],
    hello: { word: "नमस्ते", roman: "Namaste" },
    myth: {
      deities: [
        { name: "Yogmaya", what: "A goddess whose temple at Mehrauli is one of the oldest continuously used shrines in the city." },
        { name: "Kalka Ji", what: "The goddess of the old shrine on Delhi's southern edge, busiest on Navratri nights." }
      ],
      legend: {
        name: "Indraprastha",
        tell: "The Mahabharata says the Pandavas built a city called Indraprastha, with a hall so cleverly made that water looked like floor and floor looked like water. People have long pointed at the mound where Purana Qila stands and said: there. Archaeologists have dug there and found very old pottery, and grown-ups still argue about what it proves."
      },
      living: [
        { name: "Phool Walon Ki Sair", what: "Delhi's flower-sellers walk a procession every autumn and offer embroidered fans at both the Yogmaya temple and the dargah of Khwaja Bakhtiyar Kaki — one festival, two shrines, on purpose." },
        { name: "Ramlila", what: "Open-air Ramayana plays across the city through Navratri, some of them more than a century old." },
        { name: "Qawwali at Nizamuddin", what: "Singers at the dargah on Thursday evenings, in a tradition that goes back to Amir Khusrau." }
      ]
    },
    unsure: [
      "Delhi's state flower is not listed — could not confirm a designated flower.",
      "Butter chicken's Delhi origin is the standard account but is a restaurant history, not a documented one."
    ]
  },

  DN: {
    capital: "Silvassa",
    formed: "A union territory since 1961; merged with Daman & Diu in 2020",
    population: 343709, population_year: 2011,
    area_km2: 491,
    languages: ["Varli", "Gujarati", "Hindi", "Marathi", "Konkani"],
    script: "Devanagari and Gujarati",
    symbols: {},
    people: [],
    food: [
      { dish: "Ubadiyu", what: "Winter vegetables and beans steamed slowly in an earthen pot buried upside down over a fire." },
      { dish: "Khichdi with kadhi", what: "Rice and lentils with a thin, sour yoghurt curry — everyday food here." },
      { dish: "Nagli rotla", what: "Flatbread of finger millet, dark and nutty, eaten with chutney." }
    ],
    places: [
      { name: "Vanganga Lake Garden", what: "An island garden with bridges, on the edge of Silvassa." },
      { name: "Dudhni", what: "A wide, still reservoir ringed by low forested hills." },
      { name: "Tribal Cultural Museum, Silvassa", what: "Warli masks, instruments and painted panels under one roof." },
      { name: "Satmaliya Deer Park", what: "A small forest reserve with spotted deer and blackbuck." }
    ],
    trivia: [
      "This territory touches no sea at all — it is completely surrounded by Gujarat and Maharashtra.",
      "Warli painting uses one colour, white rice paste, on a mud-brown wall, and almost everything is built from triangles and circles.",
      "The tarpa, the instrument the dance is named after, is made from a dried gourd and bamboo and sounds a bit like a horn.",
      "It was under Portuguese rule until 1954."
    ],
    hello: { word: "કેમ છો?", roman: "Kem chho?" },
    myth: {
      deities: [
        { name: "Palaghata", what: "The Warli mother goddess of the harvest, painted as a square figure at the centre of a wedding wall painting." },
        { name: "Waghoba", what: "The tiger deity of the Warli and neighbouring communities, honoured at a stone at the forest edge." }
      ],
      legend: null,
      living: [
        { name: "The wedding chauk", what: "Before a Warli wedding, a woman paints a square on the house wall with the goddess inside it; the marriage cannot go ahead until the painting is done." },
        { name: "Tarpa dance", what: "A long spiral of dancers with hands linked, moving around one player and his gourd pipe, sometimes for hours." }
      ]
    },
    unsure: [
      "No `people` entry and no state symbols verified for this territory.",
      "No `legend` given: Warli oral narrative is real and rich but I could not source a specific telling accurately enough to retell it."
    ]
  },

  GA: {
    capital: "Panaji",
    formed: "A union territory in 1961; became a state on 30 May 1987",
    population: 1458545, population_year: 2011,
    area_km2: 3702,
    languages: ["Konkani", "Marathi", "English", "Hindi"],
    script: "Devanagari — Konkani in Goa is officially written in Devanagari, and also widely in the Latin script",
    symbols: { animal: "Gaur", bird: "Flame-throated bulbul", tree: "Matti" },
    people: [
      { name: "Abbé Faria", what: "Pioneer of hypnotism", why: "Born at Candolim in Goa; he showed that hypnosis came from suggestion, not magnetism." },
      { name: "Kesarbai Kerkar", what: "Hindustani classical singer", why: "Born at Keri in Goa; one of her recordings was put aboard the Voyager spacecraft's Golden Record." },
      { name: "Francis Newton Souza", what: "Painter", why: "Born at Saligao; a founder of the Progressive Artists' Group that changed modern Indian art." },
      { name: "Remo Fernandes", what: "Musician", why: "Born in Siolim; he made Konkani-and-English rock that sounded like nowhere else in India." }
    ],
    food: [
      { dish: "Xitti kodi", what: "Fish curry and rice — the meal most Goan households eat almost every day." },
      { dish: "Bebinca", what: "A pudding of many thin layers, each one baked separately before the next is poured on." },
      { dish: "Poi", what: "A hollow, chewy bread the baker still delivers by bicycle, honking a rubber horn." },
      { dish: "Prawn balchão", what: "Prawns in a dark, sharp, long-keeping chilli and vinegar pickle." },
      { dish: "Ros omelette", what: "An omelette drowned in chicken curry gravy and eaten off a roadside cart at night." }
    ],
    places: [
      { name: "Basilica of Bom Jesus", what: "A 16th-century church in Old Goa, a UNESCO World Heritage Site." },
      { name: "Fort Aguada", what: "A Portuguese fort with a freshwater spring inside and a lighthouse above the sea." },
      { name: "Dudhsagar Falls", what: "A white four-tier waterfall in the Western Ghats, with a railway line crossing its face." },
      { name: "Mhadei and Bhagwan Mahavir sanctuaries", what: "Thick Western Ghats forest with hornbills and the odd leopard." },
      { name: "Fontainhas, Panaji", what: "A Latin Quarter of narrow lanes and houses painted yellow, blue and green." }
    ],
    trivia: [
      "Goa is the smallest state in India by area — you can drive its whole length in a morning.",
      "Bebinca can have anywhere from seven to sixteen layers, and each one is baked on its own.",
      "Goa was under Portuguese rule for about 450 years, far longer than any other part of India.",
      "Dudhsagar means 'sea of milk', which is exactly what it looks like when it is in full monsoon flood."
    ],
    hello: { word: "नमस्कार", roman: "Namaskar" },
    myth: {
      deities: [
        { name: "Santeri", what: "The earth goddess of Goa, worshipped not as a statue but as an anthill of raw earth." },
        { name: "Shantadurga", what: "The goddess who, in the Goan telling, stepped between Shiva and Vishnu to stop a quarrel — her name means the peaceful one." },
        { name: "Betal", what: "A village guardian who stands at the boundary and is given the first offering before anyone else." }
      ],
      legend: {
        name: "How the coast was made",
        tell: "The old Konkan story says Parashurama stood on the mountains, drew his bow and shot an arrow far out to sea — and the sea drew back as far as the arrow flew, leaving behind this strip of coconut, laterite and river. It is the same story told all down the coast to Kerala, which is a good hint about how long people have been sailing between them."
      },
      living: [
        { name: "Zatra", what: "A temple's yearly festival, when the deity is pulled through the village on a wooden chariot and the whole place eats together." },
        { name: "Shigmo", what: "Goa's spring festival — drums, painted floats and folk dances through the villages." },
        { name: "São João", what: "In June, young men jump into wells and streams wearing crowns of leaves, to celebrate the monsoon and the feast of St John." }
      ]
    },
    unsure: [
      "State flower not listed — could not confirm a designated flower for Goa.",
      "The Voyager Golden Record track is Kesarbai Kerkar's 'Jaat Kahan Ho'; the detail is well documented but worth a second check before it appears in a child-facing card."
    ]
  },

  GJ: {
    capital: "Gandhinagar",
    formed: "1 May 1960, when Bombay State was divided into Gujarat and Maharashtra",
    population: 60439692, population_year: 2011,
    area_km2: 196024,
    languages: ["Gujarati", "Hindi", "Kutchi", "Sindhi"],
    script: "Gujarati",
    symbols: { animal: "Asiatic lion", bird: "Greater flamingo", tree: "Banyan", flower: "Marigold" },
    people: [
      { name: "Mohandas Karamchand Gandhi", what: "Leader of the freedom movement", why: "Born at Porbandar on the Gujarat coast." },
      { name: "Vikram Sarabhai", what: "Physicist", why: "Born in Ahmedabad; he started India's space programme, which is why ISRO's main centre carries his name." },
      { name: "Narsinh Mehta", what: "Poet", why: "From Junagadh; his 15th-century bhajan 'Vaishnav Jan To' is sung across India to this day." },
      { name: "Vallabhbhai Patel", what: "Statesman", why: "Born at Nadiad; he brought hundreds of princely states into the Indian union after 1947." }
    ],
    food: [
      { dish: "Dhokla", what: "Steamed, spongy, faintly sour squares of fermented gram batter." },
      { dish: "Undhiyu", what: "A winter pot of root vegetables and beans, slow-cooked with fresh green masala." },
      { dish: "Thepla", what: "Fenugreek flatbreads that keep for days, which is why every Gujarati train journey has them." },
      { dish: "Khandvi", what: "Gram-flour sheets rolled into little yellow scrolls and tempered with mustard seed." },
      { dish: "Fafda-jalebi", what: "Crisp savoury strips with hot syrupy jalebi — a Sunday breakfast people queue for." }
    ],
    places: [
      { name: "Gir National Park", what: "The only place on Earth where Asiatic lions live wild." },
      { name: "Rann of Kutch", what: "A vast flat of white salt that becomes a shallow sea in the monsoon." },
      { name: "Dholavira", what: "A 4,500-year-old Harappan city with an extraordinary system of reservoirs, now a World Heritage Site." },
      { name: "Modhera Sun Temple", what: "An 11th-century temple with a stepped tank of carved shrines in front of it." },
      { name: "Rani ki Vav, Patan", what: "A stepwell that goes seven storeys down, lined with hundreds of sculptures." }
    ],
    trivia: [
      "Gujarat has the longest coastline of any Indian state, around 1,600 km.",
      "The Great Rann floods in the monsoon and dries to white salt in winter — the same ground, twice a year.",
      "Wild asses live in the Little Rann and nowhere else in India.",
      "Rani ki Vav is on the ₹100 note."
    ],
    hello: { word: "કેમ છો?", roman: "Kem chho?" },
    myth: {
      deities: [
        { name: "Dwarkadhish", what: "Krishna as the king of Dwarka on the western sea — also called Ranchhodrai, the one who walked away from a fight." },
        { name: "Ambaji", what: "The mother goddess of the Arasur hills, worshipped there as a shri yantra rather than an image." },
        { name: "Khodiyar Mata", what: "A Saurashtra folk goddess who rides a crocodile, and is the family deity of a great many households." },
        { name: "Ashapura Mata", what: "The 'goddess who fulfils hope' of Kutch, whose Matano Madh shrine draws walking pilgrims every year." }
      ],
      legend: {
        name: "The city under the sea",
        tell: "Krishna's Dwarka is said to have been a golden city of many gates, and when his time was done the sea rose and took it back. Divers have found stone anchors and walls in the water off the coast, and archaeologists still argue about what they belong to. Which means the story and the search are both still going."
      },
      living: [
        { name: "Garba", what: "Nine nights of Navratri danced in rings around a clay lamp-pot — the largest folk dance event in the world." },
        { name: "Bhavai", what: "Village theatre played in the open through the night, comic and sharp and hundreds of years old." },
        { name: "Rabari embroidery", what: "Mirror-work stitched by Kutchi herding families, where the pattern tells you which community made it." }
      ]
    },
    unsure: [
      "Coastline length is given as 'around 1,600 km'; published figures range from about 1,600 to 1,660 km.",
      "Underwater finds off Dwarka are genuine but their identification with the city of the story is disputed — written that way on purpose."
    ]
  },

  HP: {
    capital: "Shimla",
    formed: "A centrally administered territory from 1948; became a full state on 25 January 1971",
    population: 6864602, population_year: 2011,
    area_km2: 55673,
    languages: ["Hindi", "Pahari (Himachali)", "Kangri", "Kinnauri", "Punjabi"],
    script: "Devanagari",
    symbols: { animal: "Snow leopard", bird: "Western tragopan", tree: "Deodar", flower: "Pink rhododendron" },
    people: [
      { name: "Y. S. Parmar", what: "Himachal's first Chief Minister", why: "Born in Sirmaur district; he spent decades arguing for a separate hill state, and got one." },
      { name: "Preity Zinta", what: "Actor", why: "Born in Shimla and schooled there." },
      { name: "Vijay Kumar", what: "Shooter", why: "From Hamirpur district; won an Olympic silver medal in the 25 m rapid fire pistol in 2012." }
    ],
    food: [
      { dish: "Siddu", what: "A steamed wheat bun with a walnut or poppy-seed filling, eaten hot with ghee." },
      { dish: "Dham", what: "A festive meal cooked by botis, hereditary cooks, and served on leaf plates, seated on the floor." },
      { dish: "Madra", what: "Chickpeas simmered in yoghurt with whole spices, thick and mild." },
      { dish: "Babru", what: "A stuffed fried bread — Himachal's own version of a kachori." },
      { dish: "Chha gosht", what: "Meat cooked in gram flour and yoghurt, a Dham favourite." }
    ],
    places: [
      { name: "Spiti Valley", what: "A high cold desert with monasteries like Key clinging to hilltops." },
      { name: "Kalka–Shimla Railway", what: "A narrow-gauge line climbing through more than a hundred tunnels; a World Heritage Site." },
      { name: "Great Himalayan National Park", what: "A World Heritage park of alpine meadow, snow and blue sheep." },
      { name: "Dharamshala and McLeod Ganj", what: "Deodar slopes above the Kangra valley, and the home of the Dalai Lama since 1960." },
      { name: "Atal Tunnel", what: "A 9 km road tunnel under the Rohtang pass that keeps Lahaul connected all winter." }
    ],
    trivia: [
      "The toy train to Shimla goes through more than a hundred tunnels on its way up.",
      "Spiti has some of the highest villages in the world reachable by road.",
      "Himachal grows a very large share of India's apples — whole valleys turn red in autumn.",
      "The Atal Tunnel is one of the longest highway tunnels in the world above 3,000 m."
    ],
    hello: { word: "नमस्ते", roman: "Namaste" },
    myth: {
      deities: [
        { name: "Village devtas and devis", what: "Each valley has its own deity with its own name, temple, treasury and staff — and its own opinions." },
        { name: "Hadimba", what: "The goddess of Manali, whose cedar-wood temple stands in a grove of enormous old trees." },
        { name: "Jamlu", what: "The deity of Malana village, who by tradition speaks through his own council rather than through images." }
      ],
      legend: {
        name: "The gods who come to the festival",
        tell: "At Kullu Dussehra the valley's devtas are carried down from their villages in palanquins hung with silver masks and cloth, some of them walking for days with their drummers ahead of them. The festival cannot begin until Hadimba arrives. When the palanquins meet in the maidan, people say the gods are greeting each other — and you can see the palanquins dip and sway as if they are."
      },
      living: [
        { name: "Kullu Dussehra", what: "A week where hundreds of village deities gather in one field, each with its own procession." },
        { name: "The gur", what: "A person chosen to speak for the village deity, who answers questions put by the community." },
        { name: "Fagli", what: "A late-winter masked festival in the upper valleys, marking the end of the cold." }
      ]
    },
    unsure: [
      "Kalka–Shimla tunnel count is usually given as 102 (originally 107); written as 'more than a hundred'.",
      "Highest-village claims for Spiti (Komic, Hikkim) vary by source; kept general."
    ]
  },

  HR: {
    capital: "Chandigarh",
    formed: "1 November 1966, carved out of Punjab",
    population: 25351462, population_year: 2011,
    area_km2: 44212,
    languages: ["Hindi", "Haryanvi", "Punjabi", "Urdu"],
    script: "Devanagari",
    symbols: { animal: "Blackbuck", bird: "Black francolin", tree: "Peepal", flower: "Lotus" },
    people: [
      { name: "Kalpana Chawla", what: "Astronaut", why: "Born in Karnal; the first woman of Indian origin to go to space." },
      { name: "Neeraj Chopra", what: "Javelin thrower", why: "Born at Khandra village near Panipat; Olympic champion in 2021." },
      { name: "Saina Nehwal", what: "Badminton player", why: "Born in Hisar; the first Indian woman to win an Olympic badminton medal." },
      { name: "Bajrang Punia", what: "Wrestler", why: "From Khudan village in Jhajjar district, out of Haryana's akhara tradition." }
    ],
    food: [
      { dish: "Bajra khichdi", what: "Pearl millet and lentils cooked soft, eaten with a spoon of white butter on top." },
      { dish: "Kadhi pakora", what: "Gram-flour dumplings in a slow-simmered sour yoghurt curry." },
      { dish: "Singri ki sabzi", what: "Dried desert beans cooked with spices — food invented for dry years." },
      { dish: "Churma", what: "Crushed roti with ghee and jaggery, pressed into a ball." },
      { dish: "Lassi", what: "Served in brass tumblers big enough that finishing one counts as lunch." }
    ],
    places: [
      { name: "Kurukshetra", what: "Brahma Sarovar and the Jyotisar banyan — the landscape of the Mahabharata." },
      { name: "Sultanpur National Park", what: "A shallow wetland that fills with migratory birds from Central Asia and Siberia each winter." },
      { name: "Rakhigarhi", what: "One of the largest Harappan sites found anywhere, still being excavated." },
      { name: "Pinjore Gardens", what: "A stepped Mughal-style garden below the Shivaliks." },
      { name: "Surajkund", what: "An old reservoir, and the ground for a big crafts mela every February." }
    ],
    trivia: [
      "Haryana shares its capital city, Chandigarh, with Punjab — and Chandigarh is in neither state.",
      "Rakhigarhi in Hisar district is one of the biggest Harappan cities discovered so far.",
      "Haryana's village akharas have produced a remarkable number of India's Olympic wrestlers and boxers.",
      "The state was created on the same day, 1 November 1966, that Chandigarh became a union territory."
    ],
    hello: { word: "राम राम", roman: "Ram Ram" },
    myth: {
      deities: [
        { name: "Sheetala Mata", what: "The cooling goddess who protects against fever; her Gurugram shrine draws huge crowds in spring." },
        { name: "Gogaji (Goga Pir)", what: "The snake protector, whose shrines are visited by Hindus and Muslims alike — his followers call him by both names." },
        { name: "Baba Mastnath and the local jogis", what: "Nath yogi shrines around Rohtak that villages still turn to at planting and harvest." }
      ],
      legend: {
        name: "The tree at Jyotisar",
        tell: "At Jyotisar near Kurukshetra there is an old banyan, and people will tell you this is where Krishna spoke the Bhagavad Gita to Arjuna, on a battlefield, in the pause before everything began. Whether the tree is that tree nobody can say, but families still sit under it and read the verses aloud, which is its own kind of continuity."
      },
      living: [
        { name: "Gogaji's chhari", what: "In the monsoon month, bands of singers carry a decorated staff from village to village, drumming and singing his ballad." },
        { name: "Saang", what: "Haryanvi open-air theatre — one raised platform, a harmonium, and a story sung all night." },
        { name: "Teej and Phag", what: "Swings hung from trees in the rains, and colour and dhol at the end of winter." }
      ]
    },
    unsure: [
      "Nath and jogi shrine practice around Rohtak is summarised loosely; details vary village to village."
    ]
  },

  JH: {
    capital: "Ranchi",
    formed: "15 November 2000, carved out of Bihar — on Birsa Munda's birthday",
    population: 32988134, population_year: 2011,
    area_km2: 79716,
    languages: ["Hindi", "Santali", "Nagpuri", "Kurukh", "Mundari", "Ho", "Bengali", "Urdu"],
    script: "Devanagari; Santali is written in Ol Chiki, a script invented for it in the 1920s",
    symbols: { animal: "Indian elephant", bird: "Koel", tree: "Sal", flower: "Palash" },
    people: [
      { name: "M. S. Dhoni", what: "Cricketer", why: "Born and brought up in Ranchi; captained India to two World Cup titles." },
      { name: "Jaipal Singh Munda", what: "Hockey captain", why: "Born at Takra Pahantoli in Khunti district; he captained India to Olympic gold in 1928." },
      { name: "Deepika Kumari", what: "Archer", why: "Born at Ratu Chatti near Ranchi; she has been ranked world number one." },
      { name: "Birsa Munda", what: "Munda leader", why: "Born at Ulihatu; Jharkhand's foundation day is deliberately set on his birthday." }
    ],
    food: [
      { dish: "Dhuska", what: "A deep-fried rice-and-lentil bread, puffed and golden, eaten with chana." },
      { dish: "Rugra", what: "A wild mushroom that appears only after the first monsoon rain, cooked the day it is gathered." },
      { dish: "Chilka roti", what: "A thin rice pancake, plain or with lentils folded in." },
      { dish: "Thekua", what: "A crunchy jaggery biscuit fried in ghee." },
      { dish: "Litti chokha", what: "Roasted stuffed dough balls with smoky mashed brinjal, shared with neighbouring Bihar." }
    ],
    places: [
      { name: "Parasnath Hill (Shikharji)", what: "One of the holiest Jain pilgrimage places; the climb up and around is many kilometres in a day." },
      { name: "Betla National Park", what: "Sal forest with elephants, and two old hill forts inside it." },
      { name: "Hundru Falls", what: "The Subarnarekha dropping about 98 m over black rock." },
      { name: "Netarhat", what: "A plateau known for its sunrises, high above the surrounding forest." },
      { name: "Baidyanath Dham, Deoghar", what: "A major Shiva shrine that draws a month-long walking pilgrimage in monsoon." }
    ],
    trivia: [
      "Jharkhand means 'the land of forests', and the name is much older than the state.",
      "Santali has its own alphabet, Ol Chiki, designed in the 1920s specifically for the language.",
      "Rugra mushrooms cannot be farmed — they simply arrive with the first proper rain and are gone in a fortnight.",
      "The state was created on 15 November 2000, chosen because it is Birsa Munda's birthday."
    ],
    hello: { word: "जोहार", roman: "Johar" },
    myth: {
      deities: [
        { name: "Singbonga", what: "The sun as the highest god in Munda and Ho tradition — everything begins with him." },
        { name: "Marang Buru", what: "The great mountain spirit of the Santals, called on first at every gathering." },
        { name: "Sarna Ma", what: "The goddess of the sacred grove; the grove itself, uncut, is the shrine." }
      ],
      legend: {
        name: "How the first people came",
        tell: "The Santals tell of Pilchu Haram and Pilchu Budhi, the first man and the first woman, who hatched from eggs and had to learn everything about living from the beginning. Their story is not read from a book — it is sung, in long sequences, by people who have carried it in memory for a very long time."
      },
      living: [
        { name: "Sarna sthal", what: "A patch of old trees left standing at the edge of the village, never cut, where the community worships." },
        { name: "Sohrai and Khovar painting", what: "Women in Hazaribagh paint their house walls with combs and cloth pads — animals at harvest, patterns for a wedding." },
        { name: "Karam", what: "A branch of the karam tree is brought into the village and sung to through the night by young people." }
      ]
    },
    unsure: [
      "The Santal first-couple narrative has several recorded versions; retold in the most general terms and marked as sung tradition. Needs a Santal reviewer.",
      "Hundru Falls height is commonly given as 98 m; not independently checked."
    ]
  },

  JK: {
    capital: "Srinagar (summer) · Jammu (winter)",
    formed: "Reorganised as a union territory in 2019, when Ladakh was made separate",
    population: 12541302, population_year: 2011,
    languages: ["Kashmiri", "Dogri", "Urdu", "Hindi", "Pahari", "Gojri"],
    script: "Perso-Arabic for Kashmiri and Urdu; Devanagari for Dogri and Hindi",
    symbols: { animal: "Hangul (Kashmir stag)", tree: "Chinar" },
    people: [
      { name: "Lal Ded", what: "Poet", why: "A 14th-century Kashmiri mystic whose short verses, the vakhs, are still quoted in ordinary conversation in the valley." },
      { name: "Habba Khatoon", what: "Poet", why: "A 16th-century Kashmiri poet whose songs of longing are sung on the shikaras to this day." },
      { name: "Zain-ul-Abidin", what: "15th-century sultan", why: "Remembered in Kashmir as Budshah, the 'great king', who brought in the craftsmen who began papier-mâché, carpet and shawl weaving here." }
    ],
    food: [
      { dish: "Rogan josh", what: "Lamb in a deep red gravy coloured by dried Kashmiri chillies, which are mild, not fiery." },
      { dish: "Wazwan", what: "A formal feast of many courses cooked by wazas, eaten four to a big copper plate called a trami." },
      { dish: "Nadru", what: "Lotus root from Dal Lake, sliced into rings and fried or curried." },
      { dish: "Kahwa", what: "Green tea with saffron, cardamom and slivered almonds, poured from a samovar." },
      { dish: "Kalari", what: "A stretchy Dogra cheese from the Jammu hills, fried in its own fat until it squeaks." }
    ],
    places: [
      { name: "Dal Lake", what: "Houseboats, floating vegetable gardens, and a market held on the water at dawn." },
      { name: "Mughal Gardens", what: "Shalimar and Nishat, built in terraces so the water falls from one level to the next." },
      { name: "Gulmarg", what: "A meadow that becomes a ski slope in winter, with one of the highest cable cars in the world." },
      { name: "Pahalgam", what: "Pine valleys where the Lidder river comes down cold and fast." },
      { name: "Vaishno Devi, Katra", what: "A cave shrine in the Trikuta hills reached by a long walk uphill." }
    ],
    trivia: [
      "Most of India's saffron is grown around Pampore, and it takes roughly 150,000 flowers to make a single kilogram.",
      "A fine pashmina shawl is woven from the winter undercoat of a Changthangi goat, and the best ones will pass through a finger ring.",
      "Chinar trees turn the whole valley red and gold in autumn; some standing chinars are hundreds of years old.",
      "Dal Lake has floating gardens — mats of weed and soil that vegetables are actually grown on."
    ],
    hello: null,
    myth: {
      deities: [
        { name: "Ragnya Devi (Kheer Bhawani)", what: "A Kashmiri goddess worshipped at a spring, to whom milk-rice is offered rather than anything cooked in oil." }
      ],
      legend: {
        name: "Satisar, the lake that was drained",
        tell: "The old Kashmiri account says the whole valley was once a lake called Satisar, and that the sage Kashyapa cut a gap in the hills at Baramulla and let the water out — and the valley underneath was the land people then settled. Geologists agree there really was a great lake here once, which is one of those places where a very old story and the rocks happen to shake hands."
      },
      living: [
        { name: "Rouf", what: "Rows of women dancing shoulder to shoulder, stepping forward and back, singing at weddings and at Eid." },
        { name: "Chakri", what: "Kashmiri folk singing with the harmonium, rabab and matka, that can go on for hours." },
        { name: "Ziyarat", what: "Visiting a saint's shrine is part of ordinary life in the valley, and people of more than one faith do it." }
      ]
    },
    unsure: [
      "Area deliberately omitted.",
      "`hello` omitted: Kashmiri, Dogri, Gojri and Urdu are all spoken here and picking one greeting would misrepresent the territory.",
      "State bird and flower omitted: the symbols of the former state are not cleanly carried over after the 2019 reorganisation.",
      "Population is the 2011 Census for the then state of Jammu & Kashmir, which included Ladakh — so it is not comparable to the present territory.",
      "Saffron flower-per-kilogram figure is commonly cited between 150,000 and 170,000; written as 'roughly'."
    ]
  },

  KA: {
    capital: "Bengaluru",
    formed: "1 November 1956 as Mysore State; renamed Karnataka on 1 November 1973",
    population: 61095297, population_year: 2011,
    area_km2: 191791,
    languages: ["Kannada", "Urdu", "Telugu", "Tamil", "Tulu", "Konkani", "Kodava"],
    script: "Kannada",
    symbols: { animal: "Indian elephant", bird: "Indian roller", tree: "Sandalwood", flower: "Lotus" },
    people: [
      { name: "M. Visvesvaraya", what: "Engineer", why: "Born at Muddenahalli; he designed the Krishna Raja Sagara dam and flood gates still copied today. India's Engineers' Day is his birthday." },
      { name: "Kuvempu", what: "Poet", why: "From Kuppali in the Malnad hills; the first Kannada writer to win the Jnanpith, and author of the state anthem." },
      { name: "C. N. R. Rao", what: "Chemist", why: "Born in Bengaluru; one of the world's most-cited solid-state chemists." },
      { name: "Anil Kumble", what: "Cricketer", why: "Born in Bengaluru; one of only three bowlers ever to take all ten wickets in a Test innings." },
      { name: "Prakash Padukone", what: "Badminton player", why: "Born in Bengaluru; the first Indian to win the All England championship." }
    ],
    food: [
      { dish: "Bisi bele bath", what: "Hot rice, lentils, vegetables and a special masala, all cooked into one pot." },
      { dish: "Mysore pak", what: "Gram flour, sugar and a startling amount of ghee, set into a crumbly slab." },
      { dish: "Ragi mudde", what: "A ball of finger-millet dough swallowed, not chewed, with a spicy saaru." },
      { dish: "Neer dosa", what: "Coastal rice crepes so thin they are almost translucent." },
      { dish: "Dharwad peda", what: "A brown, grainy milk sweet with its own GI tag." }
    ],
    places: [
      { name: "Hampi", what: "The boulder-strewn capital of Vijayanagara, with a stone chariot and pillars that ring like bells." },
      { name: "Mysore Palace", what: "Lit by thousands of bulbs on Sunday nights and through Dasara." },
      { name: "Pattadakal and Badami", what: "Chalukya temples and rock-cut caves where south and north Indian temple styles met." },
      { name: "Shravanabelagola", what: "A 17 m statue of Bahubali carved from a single block of granite on top of a hill." },
      { name: "Jog Falls", what: "The Sharavathi dropping about 253 m in four separate streams." }
    ],
    trivia: [
      "The Bahubali statue at Shravanabelagola is bathed with milk, saffron and sandalwood from scaffolding once every twelve years.",
      "Karnataka grows most of India's coffee — the Baba Budan hills are where the plant first arrived in India.",
      "Some pillars in Hampi's Vittala temple ring with different musical notes when you tap them.",
      "Kannada has one of the longest continuous literary traditions in India, going back well over a thousand years."
    ],
    hello: { word: "ನಮಸ್ಕಾರ", roman: "Namaskara" },
    myth: {
      deities: [
        { name: "Panjurli", what: "A boar daiva of Tulunadu on the coast, a guardian who is called to settle disputes as much as to bless." },
        { name: "Chamundeshwari", what: "The goddess on Chamundi hill above Mysuru, whose name the city carries." },
        { name: "Manjunatha of Dharmasthala", what: "A Shiva shrine looked after by a Jain family, with Vaishnava priests — one place, three traditions, on purpose." },
        { name: "Yellamma and the grama devatas", what: "Village goddesses of north Karnataka whose small shrines mark the boundary of a settlement." }
      ],
      legend: {
        name: "Why Mysuru is called Mysuru",
        tell: "The old telling is that a buffalo-headed being called Mahishasura ruled here, and the goddess Chamundeshwari met him on the hill above the town. The city took its name from him — Mahishuru, then Mysuru — which is a rather generous thing for a city to do. His statue still stands at the top of the hill, and the Dasara procession still comes down it."
      },
      living: [
        { name: "Yakshagana", what: "All-night coastal theatre with towering headdresses, painted faces and a drummer who never seems to tire." },
        { name: "Bhoota Kola", what: "In Tulunadu, a performer takes on the daiva's ornaments and voice and speaks to the village — spectacular, formal, and taken very seriously." },
        { name: "Mysuru Dasara", what: "Ten days ending with a procession of elephants, one carrying a golden howdah." }
      ]
    },
    unsure: [
      "Jog Falls height commonly given as 253 m; Bahubali statue height as about 17 m (57–58 ft). Neither independently verified.",
      "Karnataka's share of India's coffee is usually put around 70%; written as 'most' rather than a number."
    ]
  },

  KL: {
    capital: "Thiruvananthapuram",
    formed: "1 November 1956",
    population: 33406061, population_year: 2011,
    area_km2: 38863,
    languages: ["Malayalam", "Tamil", "Kannada", "Tulu", "English"],
    script: "Malayalam",
    symbols: { animal: "Indian elephant", bird: "Great hornbill", tree: "Coconut palm", flower: "Golden shower (kanikonna)" },
    people: [
      { name: "Raja Ravi Varma", what: "Painter", why: "Born at Kilimanoor in Travancore; his oil paintings and cheap printed copies changed how India pictures its own gods." },
      { name: "E. Sreedharan", what: "Engineer", why: "Born in Palakkad district; built the Konkan Railway and the Delhi Metro, both on time." },
      { name: "P. T. Usha", what: "Athlete", why: "Born at Payyoli near Kozhikode; missed an Olympic medal by 1/100th of a second in 1984." },
      { name: "Adi Shankara", what: "Philosopher", why: "By tradition born at Kalady on the Periyar river; he walked the length of the subcontinent debating." }
    ],
    food: [
      { dish: "Sadya", what: "Two dozen dishes served on a banana leaf in a fixed order, eaten with the hands." },
      { dish: "Puttu and kadala", what: "Steamed cylinders of rice flour and coconut, with a dark black-chickpea curry." },
      { dish: "Appam with stew", what: "A lacy fermented rice pancake with a mild coconut-milk stew." },
      { dish: "Meen curry", what: "Fish cooked with kudampuli, a smoky sour fruit, in a clay pot that is never washed with soap." },
      { dish: "Payasam", what: "Milk or jaggery pudding, always the last thing on the leaf." }
    ],
    places: [
      { name: "Alappuzha backwaters", what: "A network of lakes and canals you travel along instead of roads." },
      { name: "Munnar", what: "Tea slopes in the high ranges, where the neelakurinji flowers once every twelve years." },
      { name: "Fort Kochi", what: "Chinese fishing nets, Dutch and Portuguese houses, and a spice market that has been trading for centuries." },
      { name: "Paradesi Synagogue, Mattancherry", what: "Built in 1568, with a floor of hand-painted Chinese tiles and no two tiles the same." },
      { name: "Periyar, Thekkady", what: "A reserve where you watch elephants from a boat on a flooded lake." }
    ],
    trivia: [
      "Kerala has around 44 rivers, and all but three of them flow west into the Arabian Sea.",
      "A snake boat used in the Vallam Kali races can be over 100 feet long and carry more than a hundred rowers.",
      "The neelakurinji shrub in the high ranges flowers just once every twelve years and turns whole hillsides blue.",
      "Kathakali make-up takes three to four hours to put on, and a lot of it is applied lying down."
    ],
    hello: { word: "നമസ്കാരം", roman: "Namaskaram" },
    myth: {
      deities: [
        { name: "Mahabali", what: "The good king whose people were happy — remembered every year when he is said to come back to check on them." },
        { name: "Ayyappan", what: "The deity of Sabarimala, whose pilgrims wear black and address one another as swami, all as equals." },
        { name: "Bhagavathy", what: "The goddess of the kavu, the sacred grove, in a thousand local forms with a thousand local names." },
        { name: "Muthappan", what: "A hunter-deity of north Malabar whose theyyam meets and talks with anyone who comes, of any background." }
      ],
      legend: {
        name: "Onam, and the king who comes home",
        tell: "Mahabali ruled so well that there was no falsehood and no want in his land, and that made the gods uneasy. Vishnu came as Vamana, a small boy, and asked for three paces of ground — and with two strides covered everything, so the king offered his own head for the third. Because Mahabali asked to come back once a year and see his people happy, every Malayali household lays a flower carpet and cooks a sadya for him. He is coming to visit. You want the house looking good."
      },
      living: [
        { name: "Theyyam", what: "In north Kerala, a performer in enormous headgear and paint becomes the deity for a night, and the village comes to speak with them." },
        { name: "Vallam Kali", what: "Snake boat races on the backwaters in the monsoon, with villages rowing to a song that keeps the stroke." },
        { name: "Kavu", what: "Sacred groves left uncut for the goddess, which turn out to be some of the last patches of original forest in the state." }
      ]
    },
    unsure: [
      "Adi Shankara's birth at Kalady is strong tradition, not documented history; the entry says 'by tradition'.",
      "Snake boat lengths and crew sizes vary; written as 'can be'."
    ]
  },

  LD: {
    capital: "Kavaratti",
    formed: "A union territory since 1956 as the Laccadive, Minicoy and Amindivi Islands; renamed Lakshadweep in 1973",
    population: 64473, population_year: 2011,
    area_km2: 32,
    languages: ["Malayalam", "Mahl (on Minicoy)", "English"],
    script: "Malayalam; Mahl on Minicoy is written in Thaana",
    symbols: { animal: "Butterfly fish", bird: "Sooty tern", tree: "Breadfruit" },
    people: [],
    food: [
      { dish: "Masmin", what: "Tuna smoked and dried until it is hard as wood, then shaved into curries." },
      { dish: "Mus kavaab", what: "Tuna cooked with coconut and spices — the everyday island dish." },
      { dish: "Coconut", what: "Grated into every curry, pressed for milk, drunk from the shell and burnt for fuel." }
    ],
    places: [
      { name: "Kavaratti", what: "The capital island, with a lagoon so calm it looks like a swimming pool." },
      { name: "Minicoy", what: "The southernmost island, with a tall lighthouse and its own language." },
      { name: "Bangaram", what: "An uninhabited island ringed by reef." },
      { name: "Agatti", what: "The only island with an airstrip, laid along the reef." },
      { name: "Pitti Bird Sanctuary", what: "A tiny sandbank where terns come in thousands to nest." }
    ],
    trivia: [
      "Lakshadweep is India's smallest union territory by land — about 32 square kilometres in total.",
      "There are 36 islands and only about ten of them have people living on them.",
      "The name means 'a hundred thousand islands', which is a generous count.",
      "On Minicoy people speak Mahl, the same language as the Maldives, and write it in the curly Thaana script."
    ],
    hello: { word: "നമസ്കാരം", roman: "Namaskaram" },
    myth: {
      deities: [],
      legend: {
        name: "The sailors who did not come back",
        tell: "The islands' own account of how they were settled tells of ships sent out from the Kerala coast in search of a king who had sailed away, and of crews who were blown off course, found land ringed with coral, and stayed. It is told as history on the islands and as legend on the mainland, and nobody has been able to settle which it is."
      },
      living: [
        { name: "Lava dance", what: "On Minicoy, dancers in bright headgear move in lines to drums, a tradition shared with the Maldives." },
        { name: "Kolkali and Parichakali", what: "Circle dances beaten out with sticks or with small shields, performed at weddings and Eid." }
      ]
    },
    unsure: [
      "No `people` entry: could not verify a nationally known figure born in the islands.",
      "The settlement legend is the standard local account (usually attached to Cheraman Perumal); it is written as an unsettled story rather than as fact."
    ]
  },

  MH: {
    capital: "Mumbai",
    formed: "1 May 1960, when Bombay State was divided into Maharashtra and Gujarat",
    population: 112374333, population_year: 2011,
    area_km2: 307713,
    languages: ["Marathi", "Hindi", "Urdu", "Gujarati", "Konkani"],
    script: "Devanagari",
    symbols: { animal: "Indian giant squirrel (shekru)", bird: "Yellow-footed green pigeon (hariyal)", tree: "Mango", flower: "Jarul" },
    people: [
      { name: "Chhatrapati Shivaji", what: "17th-century ruler", why: "Born at Shivneri fort near Junnar; he built a kingdom out of the hill forts of the Sahyadris." },
      { name: "Sachin Tendulkar", what: "Cricketer", why: "Born in Mumbai and made in its maidans; the only batter with a hundred international centuries." },
      { name: "Dadasaheb Phalke", what: "Filmmaker", why: "Born at Trimbak; he made Raja Harishchandra in 1913, India's first full-length feature." },
      { name: "Savitribai Phule", what: "Teacher", why: "Born at Naigaon in Satara district; she opened one of India's first schools for girls, in Pune in 1848, and taught in it herself." },
      { name: "Sant Tukaram", what: "Poet", why: "From Dehu near Pune; his abhangs are still sung by the lakh on the walk to Pandharpur." }
    ],
    food: [
      { dish: "Puran poli", what: "A flatbread stuffed with sweet gram and jaggery, rolled thin and eaten with ghee." },
      { dish: "Vada pav", what: "A spiced potato ball in a bun with dry garlic chutney — Mumbai's whole lunch for very little money." },
      { dish: "Misal pav", what: "Sprouted beans under a slick of fiery red tarri, with farsan on top." },
      { dish: "Modak", what: "Steamed rice dumplings with coconut and jaggery inside, made for Ganpati." },
      { dish: "Solkadhi", what: "A cool pink drink of coconut milk and kokum, drunk after a coastal meal." }
    ],
    places: [
      { name: "Ajanta and Ellora Caves", what: "Painted Buddhist caves and, at Ellora, a whole temple carved downwards out of one rock." },
      { name: "Elephanta Caves", what: "Rock-cut Shiva caves on an island an hour's boat ride from the Gateway of India." },
      { name: "Raigad Fort", what: "Shivaji's capital, on a flat-topped hill reached by 1,400-odd steps or a ropeway." },
      { name: "Kaas Plateau", what: "A high rock flat that erupts into wildflowers for a few weeks each monsoon." },
      { name: "Chhatrapati Shivaji Maharaj Terminus", what: "A Gothic railway station with gargoyles, and a World Heritage Site." }
    ],
    trivia: [
      "The Kailasa temple at Ellora was cut downwards out of a single hill — no bricks, no joins, and about 200,000 tonnes of rock removed.",
      "Mumbai's dabbawalas deliver around 200,000 home-cooked lunches a day, mostly without reading or writing an address.",
      "Maharashtra has more UNESCO World Heritage Sites than any other Indian state.",
      "The Kaas Plateau changes colour week by week as different flowers take their turn."
    ],
    hello: { word: "नमस्कार", roman: "Namaskar" },
    myth: {
      deities: [
        { name: "Vitthal (Vithoba)", what: "Krishna standing on a brick at Pandharpur, hands on his hips, waiting — the most patient god in India." },
        { name: "Khandoba", what: "The deity of Jejuri, whose devotees throw turmeric until the whole hill goes gold." },
        { name: "Ganpati", what: "Every Maharashtrian household's first invitation, and the reason the city stops for ten days each year." },
        { name: "Jyotiba and Bahiroba", what: "Guardian deities of the hills and the village boundary, older than most temples." }
      ],
      legend: {
        name: "The brick that is still there",
        tell: "Pundalik was busy looking after his mother and father when God turned up at his door. He did not want to be rude, but he also did not want to stop — so he tossed a brick outside and asked the visitor to wait on it. And Vitthal has been standing on that brick at Pandharpur ever since, hands on his hips, perfectly happy about it. Which is the whole point of the story: looking after your parents was not the lesser thing."
      },
      living: [
        { name: "The Wari", what: "Hundreds of thousands of warkaris walk to Pandharpur every year in the monsoon, singing abhangs, sleeping in fields." },
        { name: "Ganeshotsav", what: "Ten days of neighbourhood pandals, ending with clay images carried to the sea." },
        { name: "Bhandara at Jejuri", what: "Turmeric thrown in handfuls at Khandoba's festival, until people, steps and sky are all yellow." }
      ]
    },
    unsure: [
      "Ellora Kailasa rock-removal figure (about 200,000 tonnes) is the widely published estimate, not a measured number.",
      "Raigad step count is approximate."
    ]
  },

  ML: {
    capital: "Shillong",
    formed: "An autonomous state within Assam in 1970; a full state on 21 January 1972",
    population: 2966889, population_year: 2011,
    area_km2: 22429,
    languages: ["Khasi", "Garo", "Pnar (Jaintia)", "English"],
    script: "Latin — Khasi and Garo are both written in the Roman alphabet",
    symbols: { animal: "Clouded leopard", bird: "Hill myna", tree: "White teak", flower: "Lady's slipper orchid" },
    people: [
      { name: "Soso Tham", what: "Poet", why: "Born at Sohra (Cherrapunji); he is regarded as the poet laureate of the Khasi language." },
      { name: "Lou Majaw", what: "Musician", why: "From Shillong; he has played a Bob Dylan birthday concert in the city every year for decades." },
      { name: "Neil Nongkynrih", what: "Pianist and conductor", why: "From Shillong; he founded the Shillong Chamber Choir." },
      { name: "Patricia Mukhim", what: "Journalist and writer", why: "From Shillong; a long-standing editor writing from and about the hills." }
    ],
    food: [
      { dish: "Jadoh", what: "Red rice cooked with meat until the grains take the colour and the flavour." },
      { dish: "Dohneiiong", what: "Pork with black sesame ground into a dark, nutty gravy." },
      { dish: "Tungrymbai", what: "Fermented soybean paste, pungent and much loved, cooked with sesame and ginger." },
      { dish: "Pukhlein", what: "A rice-and-jaggery fritter, sticky in the middle and crisp at the edge." },
      { dish: "Nakham bitchi", what: "A Garo soup of dried fish, drunk before a meal to open the appetite." }
    ],
    places: [
      { name: "Living root bridges, Nongriat", what: "Bridges grown from the roots of rubber fig trees, including a famous double-decker." },
      { name: "Mawsynram and Sohra", what: "Two of the wettest inhabited places on Earth, a few hours apart." },
      { name: "Nohkalikai Falls", what: "A single plunge off the plateau into a green pool far below." },
      { name: "Mawlynnong", what: "A village known across India for keeping itself spotless, with bamboo bins on every path." },
      { name: "Krem Liat Prah", what: "The longest known cave in India, over 30 km of passages." }
    ],
    trivia: [
      "The root bridges are grown, not built — it takes fifteen to thirty years, and unlike an ordinary bridge they get stronger with age.",
      "Meghalaya has the longest cave systems in India; new passages are still being surveyed.",
      "Khasi, Garo and Jaintia families are matrilineal — children take the mother's family name, and the youngest daughter usually looks after the ancestral home.",
      "The name Meghalaya means 'the abode of clouds', and on many days you cannot see the far side of the road."
    ],
    hello: { word: "Khublei", roman: "Khublei" },
    myth: {
      deities: [
        { name: "U Blei Nongthaw", what: "The creator in Khasi tradition — the one who made, and to whom the first portion is offered." },
        { name: "Ka Ramew", what: "The earth, spoken of as a mother who agreed to hold people if they would look after her." },
        { name: "Misi Saljong", what: "The giver of the harvest in Garo tradition, thanked at Wangala with a hundred drums." }
      ],
      legend: {
        name: "The golden ladder at Sohpetbneng",
        tell: "The Khasi telling is that a golden ladder once joined earth to the sky at the peak of Lum Sohpetbneng, and sixteen families lived on both sides. Seven of them came down to look after the earth — the Hynñiew Trep, the seven huts — and then the ladder was lost. People still climb that hill every February, which is a rather good way of saying: we have not forgotten where the ladder was."
      },
      living: [
        { name: "Ka Pomblang Nongkrem", what: "A five-day dance at Smit, where unmarried women dance in the centre and men circle them with swords and whisks." },
        { name: "Shad Suk Mynsiem", what: "The 'dance of the joyful heart', danced in spring after the sowing." },
        { name: "Wangala", what: "The Garo harvest festival, where a hundred drums are played together for Misi Saljong." }
      ]
    },
    unsure: [
      "Krem Liat Prah length is usually given as about 34 km and keeps changing as surveying continues; written as 'over 30 km'.",
      "Khasi cosmology is summarised from published accounts and should be checked by a Khasi reviewer before it ships."
    ]
  },

  MN: {
    capital: "Imphal",
    formed: "A union territory in 1956; a full state on 21 January 1972",
    area_km2: 22327,
    languages: ["Meiteilon (Manipuri)", "Thadou", "Tangkhul", "Paite", "Hindi", "English"],
    script: "Meitei Mayek; the Bengali-Assamese script has also been used for Meiteilon",
    symbols: { animal: "Sangai", bird: "Mrs Hume's pheasant (nongin)", tree: "Uningthou", flower: "Shirui lily" },
    people: [
      { name: "Mary Kom", what: "Boxer", why: "Born at Kangathei in Churachandpur district; six-time world champion." },
      { name: "Mirabai Chanu", what: "Weightlifter", why: "Born at Nongpok Kakching near Imphal; Olympic silver medallist in 2021." },
      { name: "Guru Bipin Singh", what: "Dance guru", why: "From Manipur; he did more than anyone to bring Manipuri dance onto the concert stage." },
      { name: "Dingko Singh", what: "Boxer", why: "Born at Sekta village; won gold at the 1998 Asian Games and pulled a generation of Manipuri children into the ring." }
    ],
    food: [
      { dish: "Eromba", what: "Boiled vegetables mashed with chilli and fermented fish — the taste people miss most when away." },
      { dish: "Chak-hao kheer", what: "Pudding made from Manipur's black rice, which cooks to a deep purple." },
      { dish: "Singju", what: "A crunchy salad of shredded raw vegetables, roasted chickpea flour and chilli." },
      { dish: "Nga thongba", what: "A light fish curry, usually with local river fish." },
      { dish: "Kangshoi", what: "A clear vegetable stew, seasoned simply, eaten with rice every day." }
    ],
    places: [
      { name: "Loktak Lake", what: "A lake covered in phumdis — floating mats of vegetation big enough to build a hut on." },
      { name: "Keibul Lamjao National Park", what: "The only floating national park in the world, and the last home of the sangai deer." },
      { name: "Ima Keithel, Imphal", what: "A market of thousands of stalls, every single one run by a woman." },
      { name: "Kangla Fort", what: "The old seat of the Meitei kings in the middle of Imphal." },
      { name: "Shirui hills", what: "Where the Shirui lily grows, and grows nowhere else on Earth." }
    ],
    trivia: [
      "Keibul Lamjao is the only floating national park anywhere, and the sangai deer walks on the floating mats as if they were ground.",
      "Ima Keithel — the Mothers' Market — has been run entirely by women for centuries.",
      "The ancestor of modern polo, sagol kangjei, was played in Manipur, and the game spread from here to the rest of the world.",
      "Chak-hao, Manipur's black rice, turns a deep purple when it is cooked."
    ],
    hello: { word: "খুরুমজরি", roman: "Khurumjari" },
    myth: {
      deities: [
        { name: "Lainingthou Sanamahi", what: "Honoured in the south-west corner of every traditional Meitei home — the household's own deity, in the house itself." },
        { name: "Pakhangba", what: "The serpent-dragon of Meitei tradition, whose coiled form is drawn on the Kangla and on flags." },
        { name: "Leimarel Sidabi", what: "The mother of the earth, to whom the first offering of the household is made." },
        { name: "Umang Lai", what: "The forest deities of the sacred groves, each with its own grove and its own festival." }
      ],
      legend: {
        name: "Lai Haraoba, the merrymaking of the gods",
        tell: "Once a year the maibis — the priestesses — dance the making of the world in front of the Umang Lai: the shaping of the earth, the building of the first house, the sowing, the weaving, all of it in gesture. Nothing is explained out loud. The children watching learn the order of creation the way you learn a song, by seeing it again every year until you know it."
      },
      living: [
        { name: "Lai Haraoba", what: "Weeks of dance and offering at the sacred groves, led by maibis and maibas." },
        { name: "Thabal Chongba", what: "A moonlight dance at Yaoshang where young people hold hands in a circle and go round until very late." },
        { name: "Manipuri Ras Leela", what: "Krishna's dance performed in stiff, mirrored skirts, with the softest footwork of any Indian classical form." }
      ]
    },
    unsure: [
      "Population omitted: the 2011 Census figure for Manipur is reported differently across sources (the count in parts of Senapati district was disputed), so no number is given rather than a wrong one."
    ]
  },

  MP: {
    capital: "Bhopal",
    formed: "1 November 1956; Chhattisgarh was carved out of it in 2000",
    population: 72626809, population_year: 2011,
    area_km2: 308252,
    languages: ["Hindi", "Bundeli", "Malvi", "Nimadi", "Gondi", "Bhili", "Urdu"],
    script: "Devanagari",
    symbols: { animal: "Barasingha", bird: "Indian paradise flycatcher (dudhraj)", tree: "Banyan" },
    people: [
      { name: "Tansen", what: "Musician", why: "Born near Gwalior; the dhrupad singer of Akbar's court, and his tomb in Gwalior still hosts a music festival every year." },
      { name: "Lata Mangeshkar", what: "Singer", why: "Born in Indore; she recorded in three dozen languages over seven decades." },
      { name: "Kishore Kumar", what: "Singer and actor", why: "Born in Khandwa, where his house is still a stop for fans." },
      { name: "Raja Bhoj", what: "11th-century king", why: "Ruled from Dhar; a scholar-king who wrote on architecture, poetry and astronomy, and built the great lake at Bhojpur." }
    ],
    food: [
      { dish: "Poha-jalebi", what: "Flattened rice with onion and sev, eaten with a hot jalebi on the side. Indore's breakfast." },
      { dish: "Bhutte ka kees", what: "Grated corn cooked in milk with mustard seed — sweet, savoury and a bit weird, in a good way." },
      { dish: "Dal bafla", what: "Wheat balls boiled, then baked, then dunked in ghee and eaten with dal." },
      { dish: "Sabudana khichdi", what: "Tapioca pearls with peanuts and green chilli, made for fasting days and eaten on all the others too." },
      { dish: "Indori namkeen", what: "A whole street of savoury mixtures, sold by weight late into the night." }
    ],
    places: [
      { name: "Bhimbetka", what: "Rock shelters whose walls people painted on for thousands of years — hunters, dancers, a giant boar." },
      { name: "Khajuraho", what: "Temples covered in carvings of everyday life a thousand years ago." },
      { name: "Sanchi", what: "The great stupa begun under Ashoka, with Jataka stories carved on its gateways." },
      { name: "Kanha and Bandhavgarh", what: "Sal forest and meadow, and some of the best tiger country in India." },
      { name: "Bhedaghat", what: "White marble cliffs rising straight out of the Narmada, best seen by boat." }
    ],
    trivia: [
      "Madhya Pradesh had more tigers than any other state in the last national count.",
      "The paintings at Bhimbetka were made across many thousands of years — some are so high up nobody is sure how they were reached.",
      "For centuries Indian astronomers measured longitude from Ujjain, treating it as the prime meridian.",
      "The Narmada is one of the very few big Indian rivers that flows west instead of east."
    ],
    hello: { word: "नमस्ते", roman: "Namaste" },
    myth: {
      deities: [
        { name: "Mahakal of Ujjain", what: "Shiva as lord of time, woken before dawn with the bhasma aarti while the city is still asleep." },
        { name: "Narmada Maiya", what: "The river herself as a goddess — not a river with a goddess in it, the river." },
        { name: "Bada Deo", what: "The great deity of Gond tradition, honoured at the saja tree rather than in a building." }
      ],
      legend: {
        name: "Why the Narmada turns her back",
        tell: "The story goes that Narmada was to marry the Sohan river, and on the wedding day she was tricked — a message went astray, and she found out too late. She turned around and walked away west, all the way to the sea, and she has never turned back since. Every other great river of the north goes east. She goes west. People walking her banks will point this out to you within about five minutes."
      },
      living: [
        { name: "Narmada Parikrama", what: "Walking the entire river, down one bank and up the other — some three thousand kilometres — while villages on the way feed you." },
        { name: "Bhasma aarti", what: "The pre-dawn ritual at Ujjain, where the crowd waits in the dark for the doors to open." },
        { name: "Gond and Bhil painting", what: "Dotted, line-filled animals and trees, taken from house walls onto paper by artists from Patangarh and beyond." }
      ]
    },
    unsure: [
      "State flower not listed — could not confirm a designated flower for Madhya Pradesh.",
      "Tiger numbers change with each national estimation cycle; phrased as 'the last national count' rather than a figure.",
      "The Narmada–Sohan story has several regional variants; the version told is the most common one."
    ]
  },

  MZ: {
    capital: "Aizawl",
    formed: "A union territory in 1972; a full state on 20 February 1987",
    population: 1097206, population_year: 2011,
    area_km2: 21081,
    languages: ["Mizo", "English", "Hindi"],
    script: "Latin",
    symbols: { animal: "Himalayan serow (saza)", bird: "Mrs Hume's pheasant (vavu)", flower: "Red vanda (senhri)" },
    people: [
      { name: "Lalsangzuali Sailo", what: "Songwriter and singer", why: "From Mizoram; she wrote hundreds of Mizo songs and was given the Padma Shri for them." },
      { name: "Jeje Lalpekhlua", what: "Footballer", why: "From Hnahthial in Mizoram; a long-serving India international striker." },
      { name: "Lallianzuala Chhangte", what: "Footballer", why: "From Mizoram; one of the fastest wingers in Indian football." }
    ],
    food: [
      { dish: "Bai", what: "Boiled vegetables with a little pork and bamboo shoot — the everyday Mizo dish, light and clean." },
      { dish: "Vawksa rep", what: "Pork smoked slowly above the kitchen fire until it is dark and firm." },
      { dish: "Sawhchiar", what: "Rice cooked together with meat into a soft, comforting one-pot meal." },
      { dish: "Chhum han", what: "Steamed mixed vegetables, seasoned barely at all so you taste the vegetables." },
      { dish: "Bamboo shoot", what: "Fermented and used a little at a time, the way another kitchen would use a stock cube." }
    ],
    places: [
      { name: "Phawngpui (Blue Mountain)", what: "The highest peak in Mizoram, with an open grassy top and cliffs falling away on one side." },
      { name: "Vantawng Falls", what: "The tallest waterfall in the state, dropping in two steps through thick forest." },
      { name: "Reiek", what: "A rock hill above Aizawl with a rebuilt traditional Mizo village at its foot." },
      { name: "Dampa Tiger Reserve", what: "The largest protected forest in Mizoram, on the western edge." },
      { name: "Champhai", what: "A wide rice-growing valley in the east, unusual in such a hilly state." }
    ],
    trivia: [
      "Mizoram has one of the highest literacy rates in India, close behind Kerala.",
      "The bamboo that covers much of Mizoram flowers roughly once every 48 years, an event called mautam — and then dies back all at once.",
      "In the Cheraw dance, pairs of bamboo poles are clapped together on the beat and the dancers step in and out between them.",
      "Almost every Mizo village used to have a zawlbuk, a large house in the centre where the young men slept and learned."
    ],
    hello: { word: "Chibai", roman: "Chibai" },
    myth: {
      deities: [
        { name: "Pathian", what: "The creator in older Mizo belief — good, distant, and not to be bargained with." },
        { name: "Khuavang", what: "A spirit of fortune and protection, spoken of in older village practice." }
      ],
      legend: {
        name: "Chhura",
        tell: "Chhura is the hero of Mizo folktales, and he is not clever. He is enormously strong, absolutely well-meaning, and gets things wrong in ways that make children fall over laughing. Grandparents still tell Chhura stories, and the joke is always gentle — he is never humiliated, just very silly."
      },
      living: [
        { name: "Chapchar Kut", what: "The spring festival after the jhum fields are cleared, with Cheraw danced in the open." },
        { name: "Church choirs", what: "Mizoram today is overwhelmingly Christian, and choral singing is one of the strongest living community traditions in the state." },
        { name: "Puanchei weaving", what: "The bright striped cloth worn for Cheraw, woven on a backstrap loom." }
      ]
    },
    unsure: [
      "State tree omitted — could not confirm a designated tree for Mizoram.",
      "Pathian and Khuavang are drawn from published ethnography of pre-Christian Mizo belief; a Mizo reviewer should check both the names and the framing.",
      "Mautam bamboo flowering cycle is usually given as about 48 years."
    ]
  },

  NL: {
    capital: "Kohima",
    formed: "1 December 1963",
    population: 1978502, population_year: 2011,
    area_km2: 16579,
    languages: ["English (the official language)", "Nagamese", "Ao", "Angami", "Konyak", "Sema", "Lotha"],
    script: "Latin",
    symbols: { animal: "Mithun", bird: "Blyth's tragopan", tree: "Alder", flower: "Rhododendron" },
    people: [
      { name: "Easterine Kire", what: "Novelist and poet", why: "From Kohima; the first Naga writer to publish a novel in English, and a chronicler of Angami village life." },
      { name: "Temsüla Ao", what: "Writer and scholar", why: "An Ao Naga writer whose short stories are the best-known literary account of the hills; she also documented Ao oral tradition." },
      { name: "Chekrovolü Swüro", what: "Archer", why: "From Nagaland; she competed for India at the 2012 Olympics." }
    ],
    food: [
      { dish: "Smoked pork with axone", what: "Pork cured over the fire, cooked with fermented soybean — the state's signature dish." },
      { dish: "Galho", what: "A rice porridge cooked with greens and a little meat, warm and filling." },
      { dish: "Bamboo shoot", what: "Fermented in bamboo tubes and used to sharpen almost any dish." },
      { dish: "Raja mircha", what: "The king chilli, used in tiny slivers — a whole one would be a mistake." },
      { dish: "Anishi", what: "Dried, fermented yam leaves pressed into cakes, cooked with pork." }
    ],
    places: [
      { name: "Dzükou Valley", what: "A high, treeless valley of rolling green that fills with lilies in summer." },
      { name: "Khonoma", what: "A terraced village that declared its own forest a no-hunting zone." },
      { name: "Kisama Heritage Village", what: "Where the Hornbill Festival is held each December, with a house built by each tribe." },
      { name: "Japfü Peak", what: "The second-highest point in Nagaland, with a famously tall rhododendron tree on its slopes." },
      { name: "Kohima", what: "A hill capital built along a ridge, with the old village on the height above it." }
    ],
    trivia: [
      "English is the official language of Nagaland — the only state in India where that is the case.",
      "The Naga king chilli was once measured as the hottest chilli in the world.",
      "The Dzükou lily grows in that valley and nowhere else on Earth.",
      "Nagaland has sixteen major tribes, and their languages are different enough that people often talk to each other in Nagamese or English."
    ],
    hello: null,
    myth: {
      deities: [
        { name: "Ukepenuopfü", what: "In Angami tradition, the ancestress from whom people descend — the first mother." },
        { name: "Lijaba", what: "In Ao tradition, the earth god who goes into the ground with the seed and comes up with the crop." },
        { name: "Terhuomia", what: "Spirits of forest, field and stone in Angami belief, treated with care rather than fear." }
      ],
      legend: {
        name: "The six stones",
        tell: "The Ao account says the first ancestors came out at Lungterok — 'six stones' — and from those six the clans spread across the hills. Every Ao village can trace its way back to that place. It is a short story with a very long shadow: it is why village elders can still tell you exactly who is related to whom, across dozens of villages, without writing anything down."
      },
      living: [
        { name: "Sekrenyi", what: "The Angami purification festival in February — ten days of ritual, washing, feasting and settling of quarrels." },
        { name: "Moatsü", what: "The Ao festival after the sowing, when the hard work is done and the village sings." },
        { name: "The morung", what: "The carved wooden dormitory where boys once learned everything a village knew; the log drums outside them are enormous." }
      ]
    },
    unsure: [
      "`hello` omitted: Nagaland has sixteen major tribal languages plus Nagamese, and there is no single greeting for the state.",
      "Naga deity names are given per tribe and should not be merged; each entry names whose tradition it comes from. Needs a Naga reviewer.",
      "Japfü's tall rhododendron is a documented record but the claim is often exaggerated; kept vague."
    ]
  },

  OR: {
    capital: "Bhubaneswar",
    formed: "A separate province from 1936 and a state from 1950; the state's name was officially changed from Orissa to Odisha in 2011",
    population: 41974218, population_year: 2011,
    area_km2: 155707,
    languages: ["Odia", "Santali", "Ho", "Hindi", "Telugu"],
    script: "Odia",
    symbols: { animal: "Sambar", bird: "Indian roller" },
    people: [
      { name: "Kelucharan Mohapatra", what: "Odissi dancer and guru", why: "Born at Raghurajpur; he shaped Odissi into the classical form performed today." },
      { name: "Subhas Chandra Bose", what: "Leader of the freedom movement", why: "Born in Cuttack in 1897." },
      { name: "Sudarsan Pattnaik", what: "Sand artist", why: "From Puri; he builds enormous sculptures on the beach that the tide takes away again." },
      { name: "Dutee Chand", what: "Sprinter", why: "Born at Chaka Gopalpur in Jajpur district; national record holder in the 100 m." }
    ],
    food: [
      { dish: "Dalma", what: "Lentils cooked with vegetables and no onion or garlic, finished with roasted cumin." },
      { dish: "Pakhala bhata", what: "Rice left overnight in water, eaten cold with fried fish and green chilli in the summer heat." },
      { dish: "Chhena poda", what: "Fresh cheese and sugar baked until the top goes dark and smoky — a burnt cheesecake, roughly." },
      { dish: "Rasagola", what: "Odisha's version is softer and browner than its neighbour's, and has its own GI tag." },
      { dish: "Santula", what: "Lightly boiled mixed vegetables with a spoon of mustard oil — the gentlest thing on the plate." }
    ],
    places: [
      { name: "Konark Sun Temple", what: "Built as a chariot for the sun, with twenty-four carved stone wheels." },
      { name: "Jagannath Temple, Puri", what: "The great temple whose Rath Yatra brings the deities out into the street." },
      { name: "Chilika Lake", what: "Asia's largest brackish lagoon, with Irrawaddy dolphins and flamingos in winter." },
      { name: "Udayagiri and Khandagiri caves", what: "Rock-cut Jain cells above Bhubaneswar, carved more than two thousand years ago." },
      { name: "Raghurajpur", what: "A village where every single house is a Pattachitra painter's workshop." }
    ],
    trivia: [
      "Three brand-new wooden chariots are built from scratch every single year for the Rath Yatra, and taken apart afterwards.",
      "The English word 'juggernaut' comes from Jagannath, from European travellers describing the size of the chariots.",
      "Olive ridley turtles come ashore at Gahirmatha and Rushikulya in the hundreds of thousands to nest, all in a few nights.",
      "Chilika Lake is home to India's only regular resident population of Irrawaddy dolphins."
    ],
    hello: { word: "ନମସ୍କାର", roman: "Namaskar" },
    myth: {
      deities: [
        { name: "Jagannath, Balabhadra and Subhadra", what: "Three wooden images with round eyes and unfinished arms — brother, brother and sister, worshipped together." },
        { name: "Sudarshan", what: "The fourth presence on the chariot, a wooden pillar rather than a figure." },
        { name: "Mangala and the village goddesses", what: "Local goddesses across coastal Odisha with their own shrines, songs and fiercely loyal villages." }
      ],
      legend: {
        name: "The carving that was never finished",
        tell: "The telling is that the images were being carved behind closed doors, and the one condition was that nobody look until it was done. The king could not wait. The door opened too early, the work stopped where it was, and that is why Jagannath has no finished hands or feet — and why he is loved exactly like that. Odisha will also tell you that he was first worshipped by Vishvavasu of the Sabara people in the forest, and that the servitors who dress him today descend from him."
      },
      living: [
        { name: "Rath Yatra", what: "Three new chariots, ropes, and a whole city pulling them down the Grand Road in July." },
        { name: "Nabakalebara", what: "Every twelve to nineteen years the wooden images are made anew, from trees chosen by signs, in secret." },
        { name: "Pattachitra", what: "Paintings on cloth stiffened with tamarind glue, in natural colours, still made in Raghurajpur." }
      ]
    },
    unsure: [
      "State tree and flower omitted — could not confirm the designated species.",
      "The Sabara origin of Jagannath worship is the tradition maintained at Puri itself; presented as the temple's own account."
    ]
  },

  PB: {
    capital: "Chandigarh",
    formed: "A state from 1950; reorganised on 1 November 1966, when Haryana and Himachal's hill districts were separated",
    population: 27743338, population_year: 2011,
    area_km2: 50362,
    languages: ["Punjabi", "Hindi", "Urdu", "English"],
    script: "Gurmukhi",
    symbols: { animal: "Blackbuck", bird: "Northern goshawk (baaz)", tree: "Shisham" },
    people: [
      { name: "Balbir Singh Sr.", what: "Hockey player", why: "Born at Haripur Khalsa in Jalandhar district; three Olympic golds, and a final-match record that stood for decades." },
      { name: "Bhai Vir Singh", what: "Poet and scholar", why: "Born in Amritsar; often called the father of modern Punjabi literature." },
      { name: "Sobha Singh", what: "Painter", why: "Born at Sri Hargobindpur; his paintings of Punjabi folk figures hang in homes across the state." },
      { name: "Harbhajan Singh", what: "Cricketer", why: "Born in Jalandhar; took a hat-trick against Australia in 2001." }
    ],
    food: [
      { dish: "Sarson da saag with makki di roti", what: "Slow-cooked mustard greens with maize flatbread and a lump of white butter." },
      { dish: "Amritsari fish", what: "River fish in an ajwain-scented gram-flour batter, fried till crisp." },
      { dish: "Pinni", what: "Wheat flour, ghee and jaggery rolled into winter balls with nuts inside." },
      { dish: "Lassi", what: "Thick, sweet and topped with malai, in a glass you cannot lift with one hand." },
      { dish: "Kada prasad", what: "Warm halwa of flour, ghee and sugar, given to everyone who comes to a gurdwara." }
    ],
    places: [
      { name: "Harmandir Sahib, Amritsar", what: "The Golden Temple, with four doors so anyone may enter from any direction." },
      { name: "Anandpur Sahib", what: "A historic Sikh town in the Shivalik foothills, and the Virasat-e-Khalsa museum." },
      { name: "Qila Mubarak, Patiala", what: "A rambling old fort-palace in the middle of the city." },
      { name: "Harike Wetland", what: "Where the Beas and Sutlej meet — a huge winter stop for migratory birds." },
      { name: "Sheesh Mahal, Patiala", what: "A palace of mirrors with a suspension bridge across the garden." }
    ],
    trivia: [
      "The langar at Harmandir Sahib feeds tens of thousands of people free every day, and anyone at all can join the cooking.",
      "Punjab means 'five rivers' — panj ab — although only some of them run through the Indian state today.",
      "Punjabi is written in Gurmukhi, a script arranged so that the letters follow the sounds in order.",
      "The wheat grown in Punjab feeds a large part of the country, from a state that is barely one-and-a-half per cent of India's land."
    ],
    hello: { word: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", roman: "Sat Sri Akal" },
    myth: {
      deities: [
        { name: "Gugga Pir (Gogaji)", what: "The snake protector of the Punjab plains — his shrine is visited by Hindus, Sikhs and Muslims, and he is called by more than one name." },
        { name: "Sakhi Sarwar", what: "A saint whose shrine drew followers from several communities for centuries, remembered in Punjabi folk song." }
      ],
      legend: {
        name: "Heer and Ranjho",
        tell: "Heer of the Sials and Ranjha the flute-player is the great Punjabi love story, and it is not really told — it is sung. Waris Shah put it into verse in the 1700s, and a good singer will hold a courtyard for hours on a single passage. Ask an older relative to sing you two lines of Heer and watch what happens to the room."
      },
      living: [
        { name: "Bhangra and giddha", what: "Harvest dances — bhangra to the dhol, giddha in a ring with clapped verses that the women make up as they go." },
        { name: "Lohri", what: "A January bonfire with sesame and jaggery thrown in, and the song of Dulla Bhatti sung around it." },
        { name: "Qissa singing", what: "Long verse romances — Heer Ranjha, Sohni Mahiwal, Mirza Sahiban — sung by folk singers at fairs." }
      ]
    },
    unsure: [
      "State flower not listed — could not confirm a designated flower for Punjab.",
      "Punjab's Sikh life is deliberately not placed inside the `myth` block; it belongs in the Dharma pillar, and the Gurus are never depicted (docs/05 §2)."
    ]
  },

  PY: {
    capital: "Puducherry",
    formed: "Transferred to India in 1954 and formally in 1962; a union territory from 1 July 1963",
    population: 1247953, population_year: 2011,
    area_km2: 479,
    languages: ["Tamil", "French", "Telugu", "Malayalam", "English"],
    script: "Tamil (with French and English in daily official use)",
    symbols: { animal: "Indian palm squirrel", bird: "Koel" },
    people: [
      { name: "Sri Aurobindo", what: "Poet and philosopher", why: "Born in Calcutta, he lived in Puducherry for the last forty years of his life, and his ashram is at the centre of the town." },
      { name: "Subramania Bharati", what: "Tamil poet", why: "Born at Ettayapuram, he spent a decade in Puducherry, and wrote some of his best-known poems here." },
      { name: "Ananda Ranga Pillai", what: "Diarist and merchant", why: "Lived in 18th-century Puducherry and kept a day-by-day diary that historians still read to understand the town." }
    ],
    food: [
      { dish: "Dosa and filter coffee", what: "The Tamil breakfast, served in Puducherry with a baguette on the next table." },
      { dish: "Kadugu yerra", what: "Prawns in a sharp mustard sauce — a dish born from Tamil and French kitchens meeting." },
      { dish: "French bakery bread", what: "Baguettes and croissants, made here for well over a century." },
      { dish: "Podanlangkai", what: "Snake gourd cooked simply with coconut, an everyday Tamil vegetable dish." }
    ],
    places: [
      { name: "White Town", what: "Yellow walls, bougainvillea and street signs in French, Tamil and English." },
      { name: "Promenade Beach", what: "A rock-lined seafront that closes to traffic every evening." },
      { name: "Auroville", what: "An experimental township laid out as a spiral around a golden dome." },
      { name: "Sri Aurobindo Ashram", what: "A quiet courtyard in the middle of the town where people sit without speaking." },
      { name: "Basilica of the Sacred Heart", what: "A Gothic church in cream and brown with tall stained-glass panels." }
    ],
    trivia: [
      "Puducherry is made of four separate pieces of land, hundreds of kilometres apart: Puducherry and Karaikal inside Tamil Nadu, Yanam inside Andhra Pradesh, and Mahé inside Kerala.",
      "French is still an official language here, and some of the police still wear red kepis.",
      "Auroville's Matrimandir is a golden sphere with a crystal inside that catches the sun through the roof.",
      "The old town is laid out on a grid that was drawn up in the 1700s and has barely changed."
    ],
    hello: { word: "வணக்கம்", roman: "Vanakkam" },
    myth: {
      deities: [
        { name: "Ayyanar", what: "The guardian who rides the boundary of the village at night; his shrines stand at the edge, under a tree." },
        { name: "Muneeswaran", what: "A guardian deity of the crossroads and the field, given offerings before travel or a new venture." },
        { name: "Draupadi Amman", what: "Draupadi worshipped as a goddess — a tradition especially strong in this stretch of the coast." }
      ],
      legend: {
        name: "The horses at the edge of the village",
        tell: "Go to the boundary of an old village around here at dusk and you may find a row of terracotta horses, some of them taller than a grown-up, facing outwards into the dark. They are for Ayyanar, who is said to ride them at night around the fields. Potters make new ones as offerings, and the old ones are left to crumble back into the earth they came from."
      },
      living: [
        { name: "Terukoothu", what: "Street theatre performed through the night at village festivals, with painted faces and a story from the epics." },
        { name: "Villupattu", what: "The bow-song: a big bow strung with bells is struck like an instrument while the singer tells a story." },
        { name: "Masi Magam", what: "In February or March, deities from many temples are carried down to the sea for a bath." }
      ]
    },
    unsure: [
      "Area is given as 479 km2; 492 km2 also appears in published sources.",
      "Symbols for Puducherry are less well documented than for states; tree and flower omitted.",
      "'Kadugu yerra' as a specifically Puducherry Creole dish is reported in food writing rather than in an official source."
    ]
  },

  RJ: {
    capital: "Jaipur",
    formed: "Formed in stages from 1949; completed on 1 November 1956",
    population: 68548437, population_year: 2011,
    area_km2: 342239,
    languages: ["Hindi", "Rajasthani (Marwari, Mewari, Dhundhari)", "Urdu"],
    script: "Devanagari",
    symbols: { animal: "Chinkara", bird: "Great Indian bustard (godawan)", tree: "Khejri", flower: "Rohida" },
    people: [
      { name: "Meera Bai", what: "Poet", why: "Born at Kudki in Merta; her Krishna songs are sung across India five hundred years later." },
      { name: "Maharana Pratap", what: "16th-century ruler of Mewar", why: "Born at Kumbhalgarh; remembered in Rajasthan for holding out in the Aravalli hills for years." },
      { name: "Allah Jilai Bai", what: "Folk singer", why: "From Bikaner; her 'Kesariya Balam' is the song Rajasthan is known by." },
      { name: "Devendra Jhajharia", what: "Paralympic javelin thrower", why: "Born at Jhajharia village in Churu district; the first Indian to win two Paralympic golds." }
    ],
    food: [
      { dish: "Dal baati churma", what: "Baked wheat balls cracked open over dal, with sweet crushed churma alongside." },
      { dish: "Gatte ki sabzi", what: "Gram-flour dumplings boiled, sliced and simmered in yoghurt gravy." },
      { dish: "Ker sangri", what: "Desert berries and beans, dried and cooked — food designed for a place with no vegetables." },
      { dish: "Ghewar", what: "A crisp honeycomb disc soaked in syrup, made for the monsoon festivals." },
      { dish: "Pyaaz kachori", what: "A fat, flaky pastry filled with spiced onion, eaten hot in Jodhpur." }
    ],
    places: [
      { name: "Amber Fort", what: "A hill fort above Jaipur with a hall of a thousand tiny mirrors." },
      { name: "Mehrangarh, Jodhpur", what: "A fort standing on a cliff above a whole city painted blue." },
      { name: "Jaisalmer Fort", what: "A golden sandstone fort with several thousand people still living inside it." },
      { name: "Keoladeo Ghana, Bharatpur", what: "A World Heritage wetland made for birds, best seen from a cycle rickshaw." },
      { name: "Jantar Mantar, Jaipur", what: "Giant stone instruments for reading the sky, including the world's largest stone sundial." }
    ],
    trivia: [
      "The Aravalli hills are among the oldest mountain ranges on Earth — far older than the Himalaya.",
      "Jaisalmer is one of very few forts in the world where people still live inside the walls, as they have for centuries.",
      "The Vrihat Samrat Yantra at Jantar Mantar is a sundial about 27 m tall and can be read to a couple of seconds.",
      "Rajasthan is the largest Indian state by area, and the khejri tree in its desert can send roots down tens of metres for water."
    ],
    hello: { word: "खम्मा घणी", roman: "Khamma ghani" },
    myth: {
      deities: [
        { name: "Pabuji", what: "A folk deity of western Rajasthan, protector of camels, whose story is sung in front of a painted scroll." },
        { name: "Gogaji", what: "The snake deity, whose shrine at Gogamedi is visited by Hindus and Muslims together." },
        { name: "Ramdevji", what: "A saint of Runicha revered across communities, whose fair at Ramdevra draws walking pilgrims for weeks." },
        { name: "Karni Mata", what: "The goddess of Deshnok, in whose temple thousands of rats are fed and protected." }
      ],
      legend: {
        name: "The scroll that is only opened at night",
        tell: "A bhopa and bhopi arrive at a village at dusk, unroll a long painted cloth called a phad, and set a lamp in front of it. They sing Pabuji's story all night, moving the lamp so that only the part being sung is lit — so the picture you can see is always the part of the story you are in. At dawn they roll it up. The phad is treated as a travelling temple, not a painting."
      },
      living: [
        { name: "Phad painting and bhopa singing", what: "Scroll paintings made in Bhilwara, sung by hereditary performers with a ravanhatta fiddle." },
        { name: "Kalbeliya", what: "A whirling dance in black skirts, listed by UNESCO as intangible cultural heritage." },
        { name: "Karni Mata's temple", what: "At Deshnok the rats are cared for, counted and fed — and seeing a white one is considered lucky." }
      ]
    },
    unsure: [
      "Jantar Mantar sundial accuracy is usually given as about two seconds; the height as about 27 m.",
      "Jaisalmer's resident population inside the fort is often quoted as around 3,000–4,000; no figure given."
    ]
  },

  SK: {
    capital: "Gangtok",
    formed: "Became the 22nd state of India on 16 May 1975",
    population: 610577, population_year: 2011,
    area_km2: 7096,
    languages: ["Nepali", "Bhutia", "Lepcha", "Limbu", "English"],
    script: "Devanagari for Nepali, Tibetan script for Bhutia, and Lepcha has its own Róng script",
    symbols: { animal: "Red panda", bird: "Blood pheasant", tree: "Rhododendron", flower: "Noble dendrobium orchid" },
    people: [
      { name: "Baichung Bhutia", what: "Footballer", why: "Born at Tinkitam in South Sikkim; captained India and played professionally in England." },
      { name: "Danny Denzongpa", what: "Actor", why: "Born at Yuksom; a Hindi film mainstay for five decades." },
      { name: "Tarundeep Rai", what: "Archer", why: "From Namchi; a three-time Olympian and Asian Games medallist." }
    ],
    food: [
      { dish: "Momos", what: "Steamed dumplings with a fiery tomato-and-chilli dip." },
      { dish: "Thukpa", what: "Noodles in broth with vegetables or meat, eaten when the mist comes down." },
      { dish: "Gundruk", what: "Leafy greens fermented and dried, then cooked into a sour soup." },
      { dish: "Phagshapa", what: "Strips of pork fat cooked with radish and dried chillies." },
      { dish: "Sel roti", what: "A ring of sweet rice batter poured into hot oil, crisp outside and soft in." }
    ],
    places: [
      { name: "Kanchenjunga National Park", what: "A World Heritage site of glacier, forest and the third-highest mountain on Earth." },
      { name: "Rumtek Monastery", what: "A large monastery above Gangtok with a golden roof and a courtyard for masked dance." },
      { name: "Tsomgo Lake", what: "A glacial lake that freezes in winter, at about 3,750 m." },
      { name: "Yuksom", what: "The old capital, and the start of the walk to Kanchenjunga base camp." },
      { name: "Gurudongmar Lake", what: "One of the highest lakes in the world, in the far north of the state." }
    ],
    trivia: [
      "Sikkim became India's first fully organic state in 2016 — chemical pesticides and fertilisers are banned outright.",
      "Sikkim has the smallest population of any Indian state.",
      "Kanchenjunga is treated as a guardian, and by long-standing custom climbers stop just short of the actual summit.",
      "Sikkim joined India in 1975, which makes it one of the newest parts of the map."
    ],
    hello: { word: "नमस्ते", roman: "Namaste" },
    myth: {
      deities: [
        { name: "Dzonga", what: "Kanchenjunga itself as the guardian deity of Sikkim — the mountain is not scenery here, it is the protector." },
        { name: "Itbu-moo", what: "The mother creator in Lepcha tradition, who made the first people from the pure snows of the peak." },
        { name: "Yabdu", what: "The retinue of local mountain and valley spirits honoured alongside Dzonga at Pang Lhabsol." }
      ],
      legend: {
        name: "Mayel Lyang, the hidden valley",
        tell: "The Lepchas speak of Mayel Lyang, a hidden valley somewhere below the snows where seven households live, growing old in the evening and young again by morning, and sending the seeds of every crop down to the people outside. Nobody finds it by looking. It is where the Lepchas say they came from, and it is why the mountain is treated with such care."
      },
      living: [
        { name: "Pang Lhabsol", what: "A festival for Kanchenjunga, with the Pangtoed Chaam — a warrior dance in helmets and armour." },
        { name: "Cham", what: "Masked monastic dances at Rumtek and Pemayangtse, performed in the courtyard over several days." },
        { name: "Losar", what: "The new year, with butter lamps, prayer flags renewed on the passes, and houses swept out completely." }
      ]
    },
    unsure: [
      "Lepcha creation names (Itbu-moo, Fudongthing and Nazongnyu) appear in several published spellings; only the best-attested one is used and no couple is named.",
      "Tsomgo Lake elevation is usually given between 3,700 and 3,780 m."
    ]
  },

  TN: {
    capital: "Chennai",
    formed: "Madras State from 1950; renamed Tamil Nadu on 14 January 1969",
    population: 72147030, population_year: 2011,
    area_km2: 130058,
    languages: ["Tamil", "Telugu", "Kannada", "Urdu", "English"],
    script: "Tamil",
    symbols: { animal: "Nilgiri tahr", bird: "Emerald dove", tree: "Palmyra palm", flower: "Glory lily (kandhal)" },
    people: [
      { name: "Srinivasa Ramanujan", what: "Mathematician", why: "Born in Erode and raised in Kumbakonam; he worked out results nobody had seen before, largely on his own." },
      { name: "C. V. Raman", what: "Physicist", why: "Born in Tiruchirappalli; won the Nobel Prize in 1930 for discovering why the sea is blue." },
      { name: "M. S. Subbulakshmi", what: "Carnatic singer", why: "Born in Madurai; the first musician to receive the Bharat Ratna." },
      { name: "Subramania Bharati", what: "Poet", why: "Born at Ettayapuram; he rewrote what Tamil poetry could sound like, and wrote for children too." },
      { name: "Thiruvalluvar", what: "Poet", why: "Author of the Tirukkural, 1,330 couplets on how to live; when exactly he lived is genuinely unknown." }
    ],
    food: [
      { dish: "Idli and sambar", what: "Steamed rice cakes with lentil stew — breakfast for millions, every day." },
      { dish: "Chettinad curries", what: "Ground fresh spices, black pepper and stone flower, from the Chettinad merchant houses." },
      { dish: "Pongal", what: "Rice and lentils with pepper and cumin, or the sweet version with jaggery for the harvest festival." },
      { dish: "Filter coffee", what: "Decoction dripped slowly through a brass filter, then pulled between two tumblers till it froths." },
      { dish: "Jigarthanda", what: "A Madurai drink of milk, almond gum, sarsaparilla syrup and ice cream." }
    ],
    places: [
      { name: "Meenakshi Temple, Madurai", what: "Fourteen towers covered in thousands of painted figures." },
      { name: "Brihadisvara Temple, Thanjavur", what: "A Chola temple a thousand years old, with a tower of enormous single stones." },
      { name: "Mahabalipuram", what: "Shore temples and a whole cliff carved with elephants, cats and a descending river." },
      { name: "Nilgiri Mountain Railway", what: "A World Heritage steam line that climbs on a rack-and-pinion track." },
      { name: "Kanyakumari", what: "The southern tip of India, where you can watch the sun set and the moon rise over the same water." }
    ],
    trivia: [
      "Tamil has literature going back more than two thousand years, and the Sangam poems still read as if they were written yesterday.",
      "The Nilgiri Mountain Railway uses a toothed rail to grip its way up the steepest sections — the steepest such line in Asia.",
      "The Thanjavur temple's tower is topped by a single huge capstone, put in place a thousand years ago.",
      "Every morning millions of Tamil households draw a kolam in rice flour on the doorstep, and it is meant to be walked on and worn away."
    ],
    hello: { word: "வணக்கம்", roman: "Vanakkam" },
    myth: {
      deities: [
        { name: "Murugan", what: "The hill god of the Tamil country, with six great shrines — the Arupadai Veedu — each on its own hill." },
        { name: "Ayyanar", what: "The village guardian, whose shrines at the boundary are lined with giant terracotta horses." },
        { name: "Meenakshi", what: "The fish-eyed queen of Madurai, who is the ruler of the city and whose husband came to her." },
        { name: "Mariamman", what: "The goddess of rain and of cooling, honoured in the hot months with pots of water and neem leaves." }
      ],
      legend: {
        name: "The wedding the whole city attends",
        tell: "Every year at Chithirai, Madurai holds Meenakshi's wedding — and the whole city is the wedding party. Her brother Kallazhagar sets out from his own temple to attend, and arrives late, riding into the Vaigai river to a crowd of thousands. It is a family occasion at the scale of a city, and people take the lateness quite personally, in a fond sort of way."
      },
      living: [
        { name: "Terukoothu", what: "All-night street theatre in the villages, with towering headgear and a drummer keeping everyone awake." },
        { name: "Kolam", what: "Dot-and-line patterns drawn in rice flour at dawn, made to be erased by feet and eaten by ants." },
        { name: "Ayyanar shrines", what: "Potters make terracotta horses as offerings and stand them at the village edge, facing outward." }
      ]
    },
    unsure: [
      "Thanjavur capstone weight is popularly given as about 80 tonnes; the number is disputed, so no figure is used.",
      "Thiruvalluvar's dates are unknown — stated as unknown rather than guessed."
    ]
  },

  TR: {
    capital: "Agartala",
    formed: "Merged with India in 1949 and made a union territory in 1956; a full state on 21 January 1972",
    population: 3673917, population_year: 2011,
    area_km2: 10486,
    languages: ["Bengali", "Kokborok", "Hindi", "English"],
    script: "Bengali-Assamese; Kokborok is written in both the Bengali and Latin scripts",
    symbols: { animal: "Phayre's langur", bird: "Green imperial pigeon", tree: "Agar", flower: "Nageshwar" },
    people: [
      { name: "Dipa Karmakar", what: "Gymnast", why: "Born in Agartala; the first Indian woman gymnast to compete at the Olympics, and she finished fourth." },
      { name: "Sachin Dev Burman", what: "Composer", why: "Born into the Tripura royal family; he brought the folk tunes of this region into Hindi film music." },
      { name: "Bir Bikram Kishore Manikya", what: "Ruler and city planner", why: "The maharaja who laid out modern Agartala and built its airfield in the 1930s." }
    ],
    food: [
      { dish: "Mui borok", what: "The Tripuri way of cooking — very little oil, lots of herbs, and berma for depth." },
      { dish: "Berma", what: "Fermented dried fish, used in small amounts the way another kitchen uses salt." },
      { dish: "Chakhwi", what: "Bamboo shoot cooked with vegetables and a little pork." },
      { dish: "Gudok", what: "Vegetables and berma cooked inside a bamboo tube over a fire." },
      { dish: "Mosdeng serma", what: "A hot tomato-and-chilli chutney pounded in a stone mortar." }
    ],
    places: [
      { name: "Neermahal", what: "A palace built in the middle of Rudrasagar Lake, reached only by boat." },
      { name: "Unakoti", what: "Enormous faces and figures carved into a forested hillside." },
      { name: "Ujjayanta Palace", what: "A white-domed palace in the middle of Agartala, now a museum." },
      { name: "Jampui Hills", what: "Orange orchards along a ridge, with cloud sitting in the valleys below." },
      { name: "Sepahijala", what: "A sanctuary with a lake and the spectacled langur." }
    ],
    trivia: [
      "Tripura is bordered by Bangladesh on three of its four sides.",
      "The carvings at Unakoti are cut straight into the rock face and the largest head is several times taller than a person.",
      "Neermahal is one of only two water palaces in India.",
      "Tripura is the third-smallest state in India by area, after Goa and Sikkim."
    ],
    hello: { word: "খুলুমখা", roman: "Khulumkha" },
    myth: {
      deities: [
        { name: "The Chaturdasha Devata", what: "Fourteen deities of the Tripuri royal tradition, worshipped as heads rather than full figures." },
        { name: "Tripura Sundari", what: "The goddess at Udaipur in south Tripura, in a temple shaped like a tortoise's back." },
        { name: "Garia", what: "The Tripuri deity of the harvest and of cattle, honoured at a decorated bamboo pole." }
      ],
      legend: {
        name: "Kharchi, the washing of the fourteen",
        tell: "Once a year the fourteen deities are carried out of their temple to the river by the chantai — the traditional Tripuri priest — and bathed there before being carried back. It is a court ritual and a village fair at the same time, and for those days Agartala fills with people who have walked in from the hills."
      },
      living: [
        { name: "Kharchi Puja", what: "Seven days in July around the fourteen deities, with a fair that takes over the town." },
        { name: "Garia Puja", what: "A spring festival with a bamboo pole dressed in flowers and cloth, and dancing round it." },
        { name: "Hojagiri", what: "Reang girls dance balanced on earthen pitchers, with bottles and lit lamps on their heads, moving only from the waist down." }
      ]
    },
    unsure: [
      "S. D. Burman was born at Comilla, in what is now Bangladesh, into the Tripura royal house; the entry says 'born into the Tripura royal family' rather than claiming a Tripura birthplace.",
      "The 'only two water palaces in India' claim is widely repeated but not from an official source."
    ]
  },

  UK: {
    capital: "Dehradun",
    formed: "9 November 2000, carved out of Uttar Pradesh as Uttaranchal; renamed Uttarakhand in 2007",
    population: 10086292, population_year: 2011,
    area_km2: 53483,
    languages: ["Hindi", "Garhwali", "Kumaoni", "Jaunsari", "Urdu"],
    script: "Devanagari",
    symbols: { animal: "Alpine musk deer", bird: "Himalayan monal", tree: "Burans (rhododendron)", flower: "Brahma kamal" },
    people: [
      { name: "Bachendri Pal", what: "Mountaineer", why: "Born at Nakuri in Uttarkashi district; the first Indian woman to climb Everest, in 1984." },
      { name: "Gaura Devi", what: "Village leader", why: "From Reni village; in 1974 she led the women of her village to stand between the trees and the axes, and the Chipko movement grew from it." },
      { name: "Jim Corbett", what: "Hunter turned conservationist", why: "Born in Nainital and lived there most of his life; India's oldest national park is named after him." },
      { name: "Narendra Singh Negi", what: "Folk singer", why: "From Pauri Garhwal; his Garhwali songs are the soundtrack of the hills." }
    ],
    food: [
      { dish: "Kafuli", what: "Spinach and fenugreek cooked into a thick green curry, thickened with rice paste." },
      { dish: "Bhatt ki churkani", what: "Black soybeans cooked slow into a dark, glossy gravy." },
      { dish: "Aloo ke gutke", what: "Boiled potatoes tossed with red chilli and coriander seed — the picnic food of Kumaon." },
      { dish: "Bal mithai", what: "A brown fudge of roasted khoya, rolled in white sugar balls. Almora's own." },
      { dish: "Jhangora ki kheer", what: "Barnyard millet cooked in milk until it is creamy." }
    ],
    places: [
      { name: "Valley of Flowers", what: "A World Heritage valley that flowers for a few weeks each monsoon and is under snow the rest of the year." },
      { name: "Jim Corbett National Park", what: "India's first national park, set up in 1936." },
      { name: "Rishikesh and Haridwar", what: "Where the Ganga leaves the mountains, with evening aartis on the ghats." },
      { name: "Kedarnath", what: "A stone shrine below a glacier, reached by a long walk uphill." },
      { name: "Nanda Devi", what: "The highest mountain entirely within India, and a goddess to the hills around it." }
    ],
    trivia: [
      "Both the Ganga and the Yamuna begin in Uttarakhand's glaciers, a few valleys apart.",
      "Jim Corbett National Park, opened in 1936, is the oldest national park in India.",
      "The brahma kamal flowers at night, high in the mountains, and is offered at the shrines up there.",
      "The Chipko movement started here in 1974, when village women put themselves between the trees and the contractors."
    ],
    hello: { word: "नमस्कार", roman: "Namaskar" },
    myth: {
      deities: [
        { name: "Nanda Devi", what: "The mountain as a daughter of the hills — and the region's most beloved goddess." },
        { name: "Golu Devta", what: "The god of justice, who hears complaints; his temples are hung with thousands of bells and written petitions." },
        { name: "Ganga", what: "The river as a goddess from her very first metre at Gaumukh, the cow's mouth of the glacier." }
      ],
      legend: {
        name: "The Raj Jat, walking the daughter home",
        tell: "About once every twelve years, Uttarakhand walks Nanda Devi back to her husband's house in the high mountains. A four-horned ram leads the procession, and villages hand her on from one to the next over nearly three weeks and 280 kilometres of hard walking. Nobody rides. At the last stage the ram goes on alone, and the people turn back."
      },
      living: [
        { name: "Jagar", what: "Night-long invocation singing where a deity is called into a dangariya, who then answers the village's questions." },
        { name: "Golu Devta's bells", what: "People write their case on stamped paper, tie it up at Chitai, and hang a bell — thousands of them." },
        { name: "Nanda Devi Raj Jat", what: "The twelve-yearly pilgrimage, one of the longest walking festivals in the Himalaya." }
      ]
    },
    unsure: [
      "Raj Jat distance and interval vary between accounts (roughly 280 km, roughly every twelve years); written with 'about'.",
      "Nanda Devi is the highest mountain entirely within India — correct, but worth checking the phrasing against the map policy before it ships."
    ]
  },

  UP: {
    capital: "Lucknow",
    formed: "The United Provinces were renamed Uttar Pradesh on 26 January 1950; Uttarakhand was carved out of it in 2000",
    population: 199812341, population_year: 2011,
    area_km2: 240928,
    languages: ["Hindi", "Awadhi", "Braj Bhasha", "Bhojpuri", "Urdu"],
    script: "Devanagari (Urdu in the Perso-Arabic script)",
    symbols: { animal: "Barasingha", bird: "Sarus crane", tree: "Ashoka", flower: "Palash" },
    people: [
      { name: "Munshi Premchand", what: "Novelist", why: "Born at Lamhi near Varanasi; he moved Hindi and Urdu fiction out of romance and into the lives of ordinary villagers." },
      { name: "Dhyan Chand", what: "Hockey player", why: "Born in Allahabad; three Olympic golds, and stick skills that opponents wrote books about." },
      { name: "Ravi Shankar", what: "Sitar player", why: "Born in Varanasi; he took Indian classical music to concert halls across the world." },
      { name: "Tulsidas", what: "Poet", why: "Associated with Varanasi and with Rajapur; his Ramcharitmanas is recited in millions of homes." },
      { name: "Kabir", what: "Poet-weaver", why: "Associated with Varanasi; his short, blunt verses are sung by singers of several faiths." }
    ],
    food: [
      { dish: "Tunday kebab", what: "Lucknow mince kebabs so soft they are said to melt before you chew." },
      { dish: "Awadhi biryani", what: "Rice and meat sealed under dough and cooked slowly in its own steam." },
      { dish: "Mathura peda", what: "A dense, slightly grainy milk sweet from Krishna's town." },
      { dish: "Agra petha", what: "Translucent candied ash gourd, plain or flavoured with rose or saffron." },
      { dish: "Malaiyo", what: "Varanasi's winter foam of milk left out overnight in the dew, served before the sun gets high." }
    ],
    places: [
      { name: "Taj Mahal", what: "Marble that goes pink at dawn, white at noon and gold at dusk." },
      { name: "Varanasi ghats", what: "Stone steps down to the Ganga where the whole city meets the river." },
      { name: "Sarnath", what: "Where the Buddha is said to have taught for the first time, and where Ashoka's Lion Capital was found." },
      { name: "Fatehpur Sikri", what: "A red sandstone city built and then left, still standing almost complete." },
      { name: "Bara Imambara, Lucknow", what: "A vast hall with no pillars, and a maze of narrow passages built into the walls above it." }
    ],
    trivia: [
      "If Uttar Pradesh were a country it would be among the most populous on Earth — nearly 200 million people at the 2011 Census.",
      "The Lion Capital that is India's state emblem was found at Sarnath, and the original is in the museum there.",
      "The Bhool Bhulaiya at the Bara Imambara is a maze of hundreds of passages, and a whisper carries clear across the gallery.",
      "Braj, around Mathura and Vrindavan, has its own kind of Holi — at Barsana the women drive the men off with sticks, and everyone enjoys it enormously."
    ],
    hello: { word: "नमस्ते", roman: "Namaste" },
    myth: {
      deities: [
        { name: "Krishna of Braj", what: "Not the king or the charioteer here — the child who stole butter and would not stay out of the river." },
        { name: "Kashi Vishwanath", what: "Shiva as the lord of Varanasi, a city people say he never leaves." },
        { name: "Ganga Maiya", what: "The river as mother, greeted at the ghats every evening with lamps." }
      ],
      legend: {
        name: "The hill on one finger",
        tell: "When the rain would not stop and the village of Braj was about to be washed away, Krishna — still a boy — lifted the whole hill of Govardhan on the tip of his little finger and held it up like an umbrella for seven days, so that everyone and every cow could stand underneath. People still walk the twenty-one kilometres around that hill, barefoot, and some of them lie down and measure the whole way with their bodies."
      },
      living: [
        { name: "Ramlila of Ramnagar", what: "A month-long open-air Ramayana played across a whole town, with the audience walking from scene to scene." },
        { name: "Lathmar Holi", what: "At Barsana and Nandgaon, the women of the village chase the men with long sticks, and the men carry shields." },
        { name: "Ganga aarti", what: "Lamps swung in unison on the ghats at sunset, every single evening of the year." }
      ]
    },
    unsure: [
      "Tulsidas's birthplace is disputed (Rajapur and Soron are both claimed); the entry says 'associated with' rather than choosing.",
      "Bara Imambara passage count is usually given as about 1,000; written as 'hundreds'.",
      "Govardhan parikrama length is usually given as 21 km."
    ]
  },

  WB: {
    capital: "Kolkata",
    formed: "A state since 1950",
    population: 91276115, population_year: 2011,
    area_km2: 88752,
    languages: ["Bengali", "Hindi", "Santali", "Urdu", "Nepali"],
    script: "Bengali-Assamese; Santali is written in Ol Chiki",
    symbols: { animal: "Fishing cat", bird: "White-throated kingfisher", tree: "Chatim (devil tree)", flower: "Shiuli (night-flowering jasmine)" },
    people: [
      { name: "Rabindranath Tagore", what: "Poet", why: "Born in Kolkata; the first non-European to win the Nobel Prize in Literature, and he wrote two national anthems." },
      { name: "Satyajit Ray", what: "Filmmaker", why: "Born in Kolkata; he also wrote detective stories and science fiction for children, and drew his own posters." },
      { name: "Sukumar Ray", what: "Poet", why: "Born in Kolkata; his Abol Tabol is the greatest nonsense verse in Bengali and possibly in India." },
      { name: "Satyendra Nath Bose", what: "Physicist", why: "Born in Kolkata; the boson is named after him." },
      { name: "Sourav Ganguly", what: "Cricketer", why: "Born in Kolkata; captained India and changed how the team behaved abroad." }
    ],
    food: [
      { dish: "Macher jhol", what: "A light fish curry with potato, eaten with rice at lunch, most days." },
      { dish: "Shorshe ilish", what: "Hilsa in a mustard paste, steamed — the most argued-about dish in Bengal." },
      { dish: "Rosogolla", what: "Cheese balls boiled in syrup until they are spongy enough to bounce back." },
      { dish: "Mishti doi", what: "Yoghurt set with caramelised sugar in a clay pot." },
      { dish: "Puchka", what: "Kolkata's fiercer, tamarind-sharp version of the golgappa." }
    ],
    places: [
      { name: "Sundarbans", what: "The world's largest mangrove forest, where the tigers swim between islands." },
      { name: "Victoria Memorial", what: "A white marble hall in a garden in the middle of Kolkata." },
      { name: "Howrah Bridge", what: "A steel cantilever bridge built entirely with rivets — not a single nut or bolt." },
      { name: "Darjeeling Himalayan Railway", what: "A toy train running since 1881, looping and zigzagging up to 2,000 m." },
      { name: "Santiniketan", what: "Tagore's school where classes are still held under the trees; a World Heritage Site since 2023." }
    ],
    trivia: [
      "The Sundarbans is the largest mangrove forest on Earth, and its tigers really do swim from island to island.",
      "The Howrah Bridge was assembled with rivets alone — there is not one nut or bolt holding it up.",
      "Durga Puja in Kolkata was added to UNESCO's list of intangible cultural heritage in 2021.",
      "The Darjeeling toy train has been climbing the same track since 1881, and still uses a loop and a zigzag to gain height."
    ],
    hello: { word: "নমস্কার", roman: "Nomoskar" },
    myth: {
      deities: [
        { name: "Durga", what: "In Bengal she is the daughter coming home to her parents for four days — the whole festival is a family visit." },
        { name: "Manasa", what: "The snake goddess, honoured in the monsoon when the water rises and the snakes move." },
        { name: "Bonbibi", what: "The guardian of the Sundarbans forest, prayed to by Hindu and Muslim honey-collectors and woodcutters alike before they go in." },
        { name: "Shitala", what: "The cooling goddess, called on against fever, worshipped at small shrines under trees." }
      ],
      legend: {
        name: "Bonbibi and the boy",
        tell: "Dukhey was a poor boy taken into the forest by a man who meant to leave him there. Alone and frightened, he called out to Bonbibi, and she came — and she made the forest and the people share it fairly, so much for the tiger and so much for the honey-gatherers. Before anyone enters the Sundarbans they still stop at her shrine, and the men who do it are Hindu and Muslim both, standing in the same queue."
      },
      living: [
        { name: "Durga Puja", what: "Four days when hundreds of pandals turn Kolkata into an open-air gallery, and nobody sleeps much." },
        { name: "Baul", what: "Wandering singers in saffron with a one-stringed ektara, singing songs that belong to no one religion." },
        { name: "Patachitra of Naya", what: "Scroll painters in Pingla unroll a painted cloth and sing the story on it — and many of the painters are Muslim families painting Hindu tales." }
      ]
    },
    unsure: [
      "The Naya patua community's religious background is well documented in folk-art scholarship but should be checked with a named source before it appears in a child-facing card."
    ]
  },

  TG: {
    capital: "Hyderabad",
    formed: "2 June 2014, separated from Andhra Pradesh — India's newest state",
    population: 35003674, population_year: 2011,
    area_km2: 112077,
    languages: ["Telugu", "Urdu", "Hindi", "Lambadi", "Gondi"],
    script: "Telugu (Urdu in the Perso-Arabic script)",
    symbols: { animal: "Spotted deer (jinka)", bird: "Indian roller (palapitta)", tree: "Jammi", flower: "Tangedu" },
    people: [
      { name: "Sarojini Naidu", what: "Poet", why: "Born in Hyderabad; called the Nightingale of India, and the first woman to be governor of an Indian state." },
      { name: "P. V. Sindhu", what: "Badminton player", why: "Born in Hyderabad; world champion and a two-time Olympic medallist." },
      { name: "V. V. S. Laxman", what: "Cricketer", why: "Born in Hyderabad; his 281 at Eden Gardens in 2001 is one of the most famous innings ever played." },
      { name: "Sania Mirza", what: "Tennis player", why: "Brought up in Hyderabad, where she trained; a former doubles world number one." }
    ],
    food: [
      { dish: "Hyderabadi biryani", what: "Raw marinated meat and rice sealed under dough and cooked together, never separately." },
      { dish: "Haleem", what: "Wheat and meat pounded for hours into a smooth paste, made in Ramzan." },
      { dish: "Sarva pindi", what: "A thick rice-flour pancake with peanuts and chana, cooked slowly in a pan with holes poked in it." },
      { dish: "Jonna rotte", what: "Sorghum flatbread, patted out by hand, eaten with a fiery chutney." },
      { dish: "Qubani ka meetha", what: "Stewed dried apricots served with cream — the last course at every Hyderabadi wedding." }
    ],
    places: [
      { name: "Charminar", what: "Four minarets over a crossroads, with the bangle bazaar all around it." },
      { name: "Golconda Fort", what: "A hill fort whose acoustics carry a clap from the gate to the top." },
      { name: "Ramappa Temple, Palampet", what: "A 13th-century Kakatiya temple, a World Heritage Site since 2021." },
      { name: "Thousand Pillar Temple, Warangal", what: "A star-shaped Kakatiya temple with a huge polished Nandi." },
      { name: "Hussain Sagar", what: "A lake built in the 1560s with a stone Buddha standing in the middle of it." }
    ],
    trivia: [
      "Telangana became India's 29th state in 2014, and is the newest state on the map.",
      "A clap at the entrance of Golconda Fort can be heard right at the top of the hill.",
      "The Kohinoor and several other famous diamonds came out of the Golconda mines.",
      "Ramappa Temple is built with bricks said to be light enough to float on water."
    ],
    hello: { word: "నమస్కారం", roman: "Namaskaram" },
    myth: {
      deities: [
        { name: "Bathukamma", what: "The goddess is the flower stack itself — built up in layers by hand and then given to the water." },
        { name: "Pochamma and Mysamma", what: "Village goddesses of Telangana, with shrines under trees at the edge of the settlement." },
        { name: "Sammakka and Saralamma", what: "A Koya mother and daughter honoured at Medaram — an Adivasi tradition that now draws millions." },
        { name: "Yellamma", what: "A goddess whose Bonalu procession brings women through the streets with decorated pots on their heads." }
      ],
      legend: {
        name: "The flowers that go back to the water",
        tell: "For nine days at Bathukamma, women build cone after cone of marigold, tangedu and chrysanthemum on brass plates, higher and higher, and sing around them in a ring, clapping. On the last evening every stack is carried to the tank and set on the water, and the flowers come apart and drift away. Nothing is kept. That is the point."
      },
      living: [
        { name: "Bathukamma", what: "Nine days of flower stacks and circle songs, ending with everything floated on the water." },
        { name: "Medaram Jatara", what: "Held every two years for Sammakka and Saralamma; one of the largest gatherings of people anywhere in India." },
        { name: "Perini Shivatandavam", what: "A vigorous Kakatiya-era dance, reconstructed in the twentieth century from temple sculpture." }
      ]
    },
    unsure: [
      "Population is the 2011 Census figure for the districts that became Telangana in 2014 — the state did not exist at the time of the count.",
      "The 'floating bricks' of Ramappa are a widely repeated claim; written as 'said to be'.",
      "Medaram Jatara attendance figures vary enormously between reports; no number given."
    ]
  },

  LA: {
    capital: "Leh",
    formed: "Became a separate union territory on 31 October 2019",
    population: 274289, population_year: 2011,
    languages: ["Ladakhi (Bhoti)", "Purgi", "Balti", "Hindi", "Urdu", "English"],
    script: "Tibetan script for Ladakhi; Perso-Arabic and Devanagari are also in use",
    symbols: { animal: "Snow leopard", bird: "Black-necked crane" },
    people: [
      { name: "Sonam Wangchuk", what: "Engineer and educator", why: "From Uleytokpo in Ladakh; he founded SECMOL and invented the ice stupa, a cone of frozen water that stores winter melt for spring." },
      { name: "Kushok Bakula Rinpoche", what: "Monk and diplomat", why: "Born at Matho in Ladakh; a monastic leader who later served as India's ambassador to Mongolia." },
      { name: "Morup Namgyal", what: "Folk singer", why: "From Ladakh; he spent a lifetime recording and broadcasting Ladakhi songs so they would not be lost." }
    ],
    food: [
      { dish: "Skyu", what: "Thumb-pressed wheat pasta cooked with root vegetables into a thick stew." },
      { dish: "Thukpa", what: "Hand-pulled noodles in broth — the meal at the end of a cold day." },
      { dish: "Gur gur cha", what: "Butter tea churned in a wooden cylinder, salty rather than sweet." },
      { dish: "Tigmo", what: "Steamed, springy bread rolls torn up and dipped into stew." },
      { dish: "Apricots", what: "Dried on flat roofs all summer; the kernels are pressed for oil." }
    ],
    places: [
      { name: "Thiksey Monastery", what: "A whitewashed monastery stepping up a hill, with a two-storey Maitreya inside." },
      { name: "Hemis Monastery", what: "Hidden in a side valley, and the site of a great masked dance festival each summer." },
      { name: "Pangong Tso", what: "A long, high lake that changes colour through the day." },
      { name: "Nubra Valley", what: "Sand dunes at 3,000 m, with double-humped Bactrian camels on them." },
      { name: "Zanskar", what: "A deep valley whose river freezes solid enough to walk on in winter." }
    ],
    trivia: [
      "Ladakh is a cold desert — it gets very little rain, but it is high up in the mountains rather than hot.",
      "The Bactrian camels in Nubra are descendants of Silk Road caravan animals that never left.",
      "In deep winter the Zanskar river freezes hard enough to walk along, which was for centuries the only way out.",
      "Ice stupas — tall cones of frozen water built on purpose in winter — melt slowly in spring exactly when the fields need water."
    ],
    hello: { word: "ཇུ་ལེ།", roman: "Julley" },
    myth: {
      deities: [
        { name: "Chenrezig", what: "The bodhisattva of compassion, whose mantra is carved on the mani walls beside every path." },
        { name: "Lha and lhu", what: "The mountain spirits and water spirits of older Ladakhi belief, still given a lhatho — a small shrine — on rooftops and passes." },
        { name: "Protectors of the monastery", what: "Each gompa has its own guardian, whose mask is brought out only at the yearly festival." }
      ],
      legend: {
        name: "Kesar of Ling",
        tell: "Kesar is the hero-king of a story so long that a Ladakhi bard could sing for many nights and still not finish it. He is sent down from the sky, born in poor circumstances, tricked and underestimated, and he wins anyway — usually by being cleverer than everyone expects. Versions of his story are sung right across the Himalaya and into Tibet and Mongolia."
      },
      living: [
        { name: "Hemis Tsechu", what: "Masked cham dance in the monastery courtyard, with cymbals, long horns and enormous embroidered thangkas." },
        { name: "Losar", what: "The Ladakhi new year in winter, with ibex-shaped bread and lamps set out in the dark." },
        { name: "Lungta", what: "Prayer flags strung across every pass, so the wind carries the printed prayers away." }
      ]
    },
    unsure: [
      "Area deliberately omitted.",
      "Population is the sum of the 2011 Census figures for Leh and Kargil districts, counted when Ladakh was part of Jammu & Kashmir.",
      "State symbols for Ladakh as a union territory are recent; snow leopard and black-necked crane are the widely reported choices but were not checked against a notification.",
      "Tree and flower symbols omitted."
    ]
  }

};
