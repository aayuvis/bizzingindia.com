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
      deities: [],
      legend: null,
      living: [
        { name: "Lohri and Baisakhi", what: "A city built in the 1950s keeps the festivals of the countryside around it — the bonfire in January, the harvest dance in April." }
      ]
    },
    unsure: [
      "Chandigarh is a planned city barely seventy years old and has no folklore of its own; the myth block is deliberately near-empty rather than borrowed from Punjab and Haryana.",
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

  /*END*/
};
