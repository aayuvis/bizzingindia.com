/* Bizzing India — story content, EAST and the ISLANDS.

   Same shape as data-stories.js / data-stories-regional.js / data-stories-more.js,
   on its own global so all the sets can be loaded and merged independently.

   Coverage tranche: Lakshadweep (from zero), the Andaman & Nicobar Islands,
   Jharkhand, Odisha and West Bengal.

   Editorial notes for this file (docs/05 is binding):

   - Lakshadweep is a Muslim, Malayali- and Mahl-speaking seafaring society and is
     told that way from the inside: the odam sets out after prayers because that is
     when it sets out. Nothing here ranks or compares any faith.
   - The indigenous peoples of the Andaman and Nicobar Islands — Great Andamanese,
     Onge, Jarawa, Sentinelese, Nicobarese, Shompen — are living, small and
     protected communities. This file follows the pattern set by fk.andaman-fire:
     landscape, animals and settler history carry the islands; where a community's
     own life is described (the Nicobarese, the languages story) it is credited,
     ethnographically grounded, and never caricatured. No story here puts words in
     the mouth of a protected people.
   - Adivasi traditions of Jharkhand — Santhal, Munda, Oraon (Kurukh), Asur, Ho —
     are told from the inside and credited by name.
   - Where a telling is the app's own — a nature tale in a region's idiom rather
     than a collected folk text — the source line SAYS SO plainly instead of
     inventing a tradition. Where an old telling is harsher than this one, the
     source line says that too.
   - it.birsa-munda touches colonial-era conflict and is flagged needs_review per
     docs/05 §6: a human author with a named reviewer signs off before publish.
   - Bonbibi of the Sundarbans is revered by Hindu and Muslim families alike; the
     story keeps both present and judges neither, and the tiger is respected,
     never a monster.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is said / told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_EAST = [

/* ======================================================== LAKSHADWEEP ====== */
{
  id: 'fk.cheraman-sails',
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Sailors Who Found the Islands',
  hook: 'They set out to look for a king who had sailed away. They found something better than a king.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['खोज', 'khoj', 'search'], ['तूफ़ान', 'toofan', 'storm'], ['द्वीप', 'dweep', 'island']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Off the coast of Kerala, scattered over the blue like a handful of green beads, lie the islands of Lakshadweep — the smallest of all the places on India\'s map, and one of the loveliest. The islanders themselves tell a story about how anyone ever found them at all.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'Long ago, they say, a great king of the Kerala coast — the Cheraman Perumal — left his palace one night and sailed away west across the sea, and did not come back. And his people could not simply let that be. Ships were fitted out to look for him.' },
    { art: ['guard'], who: 'guard',
      text: '"We will follow the sea road west," said the sailors, "and ask at every port until somebody has seen him." They loaded water and rice and coconuts, said their goodbyes, and went out past the fishing boats into open water.' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'The sea had other plans. A storm came up from the south-west — the big monsoon kind, the kind you do not argue with — and it took their sails, and their steering, and their idea of where they were, and blew them for days into the empty part of the map.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'When the wind finally dropped, they were wrecked and drifting, out of fresh water, with no land in sight in any direction at all.',
      ask: {
        q: 'No compass, no chart, no coast. How do sailors in an old story find land?',
        options: ['Shout for help as loudly as possible', 'Watch the birds and the clouds', 'Row in a straight line and hope'],
        answer: 1,
        right: 'That is the old way. Birds fly home to land at evening, and clouds pile up over islands. They followed both.',
        wrong: 'They did what island sailors have always done: watched the birds going home at evening, and the clouds that stack up over land — and followed.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      text: 'And at dawn they heard it before they saw it — a long white line of surf, breaking on a reef in the middle of the ocean. Behind the reef the water turned a green so bright it did not look real, and behind the green there was sand, and behind the sand there were coconut palms.' },
    { art: ['courtier'], who: 'courtier',
      text: '"There is water in the coconuts," said the oldest sailor, wading ashore, "and fish in the lagoon, and not one single thing here that wants to hurt us." They mended the ship. And when they got home and told everyone, people began to go back — on purpose, this time.' },
    { art: ['courtier'], who: null,
      text: 'Families came from the Malabar coast and stayed. They learned the reefs, named the islands, planted more palms, and became the islanders — and their children\'s children\'s children are the people of Lakshadweep today, still speaking Malayalam, still reading the sea like a book.' },
    { art: ['courtier'], who: 'mithu',
      text: 'They never did find the king. The islanders will tell you, with a small smile, that the king was never the point. The islands were the point. Some searches are like that.' }
  ],
  moral: 'Set out looking for one thing and stay ready to find another. The best discoveries are usually the ones you were not making.',
  source: 'The traditional account of the discovery and settlement of Lakshadweep — sailors driven onto the islands during the search for the vanished Cheraman Perumal — as told on the islands and recorded in the old gazetteers of Laccadive, Minicoy and Amindivi. Historians treat it as legend, and it is told here as one. Many versions.'
},

{
  id: 'fk.ubaidullah-lamp',
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Dream That Crossed the Sea',
  hook: 'A man had a dream that told him to sail east. The sea took everything he had except the dream.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['सपना', 'sapna', 'dream'], ['दीया', 'diya', 'lamp'], ['समुद्र', 'samudra', 'sea']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'The people of Lakshadweep are Muslim, and have been for a very long time — the mosque is the middle of every island, the day is shaped by the five prayers, and the boats go out after the morning one. The islanders tell a story about how the faith first came across the water to them.' },
    { art: ['courtier'], who: null,
      text: 'Long ago in Arabia, they say, there lived a good man named Ubaidullah. One night he had a dream — a clear, quiet, unmistakable dream — that told him to go to the sea, board a ship, and carry the faith to islands far away in the east. He woke up and the dream did not fade the way dreams do.' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'think',
      text: '"East is a big place," his friends said. "Which islands? How far? Who will feed you?" And Ubaidullah said, "The dream did not say. I will find out by going." And he went down to the harbour and took the first ship sailing east.',
      ask: {
        q: 'Setting out with no map, no address, and no plan except trust. Is that brave or foolish?',
        options: ['Foolish — you should always know where you are going', 'Brave — some journeys only show you the way once you start', 'Neither — he should have waited for a second dream'],
        answer: 1,
        right: 'The islanders would say so. In this story, the way appears under the traveller\'s feet — but only after the first step.',
        wrong: 'The islanders tell it as bravery. In this story the way appears under the traveller\'s feet — but only after the first step.'
      } },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'Far out at sea, a storm broke the ship to pieces. Ubaidullah went into the water holding a plank, and the waves took him, and turned him over, and carried him — for how long, nobody can say — until they set him down, half-drowned and entirely lost, on the beach of a small green island.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'It was Amini, in the islands we now call Lakshadweep. The islanders found a stranger on their sand at dawn with nothing at all — no goods, no gold, not even shoes. They gave him water, and food, and shade, because that is what you do.' },
    { art: ['courtier'], who: 'courtier',
      text: 'And he stayed, and learned their words, and lived so gently and spoke so plainly about the One God and the straight path that people began to listen — first a few, then households, then, in time, island after island. Nobody was forced. That is a thing the story is careful about: he had nothing to force anyone with. He had a dream and good manners.' },
    { art: ['courtier'], who: null,
      text: 'Ubaidullah grew old among the islanders. When he died, he was buried on the island of Andrott, and his grave is there today — a quiet, whitewashed place where the lamp is kept lit, and people come from all the islands to pray and to remember him.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'Fishermen passing Andrott still know exactly where the dargah stands among the palms. It is one of the oldest and most loved places in all the islands — the spot where, as the islanders tell it, the dream finally arrived at its address.' },
    { art: ['courtier'], who: 'mithu',
      text: 'On every island of Lakshadweep today, the day still begins the way his did: with prayer, and then with the sea. Ask an islander family about Ubaidullah — this is their story, and they tell it best.' }
  ],
  moral: 'A message carried gently travels further than one carried loudly. He arrived with nothing, and it was enough.',
  source: 'The tradition of Hazrat Ubaidullah, told across Lakshadweep as the coming of Islam to the islands; his dargah at Andrott is a revered place of visitation today. An island tradition, told here from the inside; versions differ island to island.'
},

{
  id: 'fk.odam-race',
  collection: 'desh-east',
  badge: 'aaj',
  title: 'Race Day on the Lagoon',
  hook: 'Ten rowers, one drum, and a whole island on the beach shouting. Today the boats race.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['नाव', 'naav', 'boat'], ['दौड़', 'daud', 'race'], ['साथ', 'saath', 'together']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'On Minicoy, the southernmost island of Lakshadweep, every village keeps a great racing boat, long and slim and polished like a musical instrument. The islanders build sailing boats — odam, they call the big ones — better than almost anyone, and on festival days the boats race across the lagoon.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'For days before a race, the boat is everything. It is oiled and rubbed until it shines. The crew practises in the evenings, and small children stand in the shallows watching their fathers and uncles and big sisters count the stroke — because everyone knows exactly whose crew is whose.' },
    { art: ['guard'], who: 'guard',
      text: '"A race boat is not about strong arms," the old steersman tells the new rowers, every single year. "The lagoon is full of strong arms. A race boat is about ten people rowing as one person. The day you learn that, we start winning."' },
    { art: ['courtier'], who: null,
      text: 'On the morning of the race there are prayers first, as there are before everything on the islands — the crews go to the mosque with everyone else, and the boats wait on the sand, and nobody minds waiting, because a thing goes better begun properly.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'This year, one crew has a problem. Their strongest rower has hurt his hand. There are two people on the beach who could take the empty seat: a big, broad-shouldered visitor who has never rowed with them, and a thin fourteen-year-old who has practised with this crew every evening for two years.',
      ask: {
        q: 'One empty seat. The strong stranger, or the thin teenager who knows the stroke?',
        options: ['The strong stranger — muscles win races', 'The teenager — the crew rows as one, and she knows the one', 'Leave the seat empty'],
        answer: 1,
        right: 'The steersman did not even hesitate. "She knows our stroke. Get in." Ten as one beats nine and a stranger.',
        wrong: 'The steersman chose the teenager, and did not even hesitate. "She knows our stroke. Get in." Ten as one beats nine and a stranger.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      text: 'The drum sets the stroke and the boats go off the line like thrown spears. Spray everywhere. The whole island is on the beach — grandmothers, babies, the shopkeeper who shut his shop — roaring for their village, and the lagoon is so clear you can see the boats\' shadows racing along the bottom beneath them.' },
    { art: ['courtier'], who: null,
      text: 'They win by half a boat\'s length, and the fourteen-year-old is carried up the beach on shoulders, trying very hard to look as if this sort of thing happens to her all the time.' },
    { art: ['courtier'], who: 'courtier',
      text: 'And then — this is the part visitors never expect — everybody eats together. Winning crew, losing crews, everyone. The race is a contest for exactly as long as the boats are in the water and not one minute longer, because tomorrow these same men and women will be fishing the same sea, and out there they are all one crew.' },
    { art: ['guard'], who: 'mithu',
      text: 'If you ever go to Minicoy, ask which village\'s boat is fastest this year. Then ask someone from a different village, and compare the answers. This is considered excellent entertainment.' }
  ],
  moral: 'Ten rowing as one beat eleven rowing as eleven — on the lagoon and everywhere else.',
  source: 'Boat racing on Minicoy, Lakshadweep, where each village keeps and races its own great rowing boat and the island\'s builders are famous for the odam, the traditional sailing vessel. Race days are real and current; the crew in this telling is the app\'s own.'
},

{
  id: 'fk.minicoy-mahl',
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Island That Speaks Mahl',
  hook: 'On one island of Lakshadweep, the words come from across the sea — and are written from right to left.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['भाषा', 'bhasha', 'language'], ['पड़ोसी', 'padosi', 'neighbour'], ['चचेरा भाई', 'chachera bhai', 'cousin']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Most of the islands of Lakshadweep speak Malayalam, like the Kerala coast they came from. But sail south, past all the others, to the last island — Minicoy — and the language changes. Here the people speak Mahl.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'Mahl is the same language spoken in the Maldives, the island country just to the south — the Maldivians call it Divehi. Which means a child on Minicoy and a child in the Maldives can talk to each other, across an international border, in the language of their own kitchens.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: '"Minicoy is our map name," an islander will tell you. "Our own name for our island is Maliku." Maliku — say it softly, the way they do. An island that keeps its own name for itself is an island that knows exactly who it is.' },
    { art: ['courtier'], who: null,
      text: 'Long before the map lines were drawn, the sea between Maliku and the Maldives was not a wall — it was a road. Boats went back and forth. Families married across it. Stories and songs and recipes travelled both ways. The border came later; the cousins came first.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'And Mahl has one more surprise. It is written in its own script, called Thaana — and Thaana runs from right to left across the page, like Arabic.',
      ask: {
        q: 'A Minicoy child can write her name in Thaana, in Malayalam script, in English, and often in Hindi too. What is that many scripts worth?',
        options: ['Not much — one is enough for anybody', 'A lot — every script is another window she can look through', 'It only matters for exams'],
        answer: 1,
        right: 'Every script is a window. She has four, and the view is different from each one.',
        wrong: 'The islanders would say: every script is a window, and she has four of them. The view is different from each.'
      } },
    { art: ['guard'], who: null,
      text: 'At school on Minicoy the children learn in Malayalam and English like the rest of Lakshadweep. At home the talk is Mahl. A grandmother\'s song, a proverb, the right word for a particular wind that no other language bothers to name — those live in Mahl, and the children carry them.' },
    { art: ['courtier'], who: 'courtier',
      text: '"Are you Indian or are you like the Maldivians?" a visitor once asked an old Maliku sailor. He thought about it politely. "The lighthouse is British-built, the tuna is everyone\'s, the language is my mother\'s, and the island is Indian," he said. "A man can be a whole harbour. He does not have to be one boat."' },
    { art: ['courtier'], who: null,
      text: 'The great lighthouse at the southern end of Minicoy has stood since the 1880s, and the islanders are famous across the Arabian Sea as sailors — Maliku men have crewed big ships to ports all over the world, taking their language with them and bringing the world home.' },
    { art: ['courtier'], who: 'mithu',
      text: 'India speaks hundreds of languages, and here is one spoken on exactly one of its islands — shared, warmly, with the neighbour country next door. If you ever meet someone from Minicoy, ask them to say something in Mahl. You will be one of the few people on Earth who has heard it.' }
  ],
  moral: 'A border is a line on the water. A language is a family — and family reaches across.',
  source: 'Minicoy (Maliku), Lakshadweep, where the language is Mahl — the same language as the Maldives\' Divehi — written in the right-to-left Thaana script; the island\'s historic lighthouse dates from the 1880s. All current and real; the sailor\'s words are the app\'s own telling.'
},

{
  id: 'fk.tuna-star',
  collection: 'desh-east',
  badge: 'aaj',
  title: 'One Fish at a Time',
  hook: 'No nets. No dragging the sea empty. On these islands, tuna are caught one at a time, like a fair game — and a star shows the way home.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['तारा', 'tara', 'star'], ['मछली', 'machhli', 'fish'], ['सुबह', 'subah', 'morning']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'Before first light on a Lakshadweep island, the tuna boat is already awake. The crew prays the dawn prayer, drinks something hot, and goes down to the water while the sky is still deciding what colour to be.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'First stop: the lagoon, to catch bait — a shimmering scoopful of tiny silver fish, kept alive and swimming in a tank of seawater on board. Without the little fish there will be no big fish. Everything at sea is connected to everything else; fishermen learn that before they learn to swim.' },
    { art: ['guard'], who: 'guard', mood: 'wow',
      text: 'Out past the reef, the lookout reads the water. "Birds!" — where seabirds are diving, tuna are hunting beneath. The boat runs in, the crew flings live bait, and someone sprays the sea with water so it flickers and boils — and the tuna go into a feeding frenzy, striking at everything that glitters.' },
    { art: ['guard'], who: null,
      text: 'And now the famous part. Each fisherman has a pole, a short line, and one barbless hook. Strike — a heave — and a skipjack tuna comes flying over the shoulder onto the deck. Pole and line, one fish at a time, exactly the way their grandfathers did it.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'A visitor once asked the captain the obvious question: why not use a giant net and take the whole school in one go?',
      ask: {
        q: 'Why would fishermen choose to catch fish one at a time when a big net could take thousands?',
        options: ['They cannot afford big nets', 'One at a time takes only what is needed — and leaves the sea full for next year', 'Tuna cannot be caught in nets'],
        answer: 1,
        right: 'That is it exactly. The pole takes the fish that bite and leaves the school alive. These islands have fished this way for generations, and the tuna keep coming back.',
        wrong: 'The captain smiled. "A net takes everything — the mothers, the babies, next year\'s fish. My pole takes what bites today and leaves the sea full. Ask me again in twenty years which of us is still fishing."'
      } },
    { art: ['courtier'], who: null,
      text: 'Back on shore, the catch becomes mas — tuna boiled, smoked and dried until it is hard and dark and keeps for months. Minicoy\'s cured tuna has been famous across these seas for centuries; ships used to call at the island just to buy it.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: 'And in the evening, the old navigation lesson, passed down like a family recipe. The grandfather points north, low over the sea. "Find the one that does not move. All the other stars walk across the sky all night. That one stands still, and it stands over north. Lose your way, find your star."' },
    { art: ['courtier'], who: null,
      text: 'The boats have engines now, and GPS, and phones in waterproof pouches. The grandfathers know this. They teach the star anyway. Batteries run out, they say. The sky does not.' },
    { art: ['guard'], who: 'mithu',
      text: 'Tonight, if the sky is clear where you are, look for the Pole Star — Dhruv Tara, the still one. Fishermen in Lakshadweep are looking at exactly the same star. It is one of the oldest things people have ever shared.' }
  ],
  moral: 'Take what you need and leave the sea full. And always know your still star.',
  source: 'Pole-and-line tuna fishing as practised in Lakshadweep — live bait, barbless hooks, one fish at a time — and the cured tuna (mas) for which Minicoy has long been known. The method and the star-lore are real and current; the family in this telling is the app\'s own.'
},

{
  id: 'fk.first-coconut',
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Nut That Crossed the Ocean',
  hook: 'Before there was anyone on the sandbank, something small and round and patient came riding in on the waves.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'pt_crow'],
  minutes: 3,
  place: ['IN-LD'],
  words_hi: [['नारियल', 'nariyal', 'coconut'], ['लहर', 'lehar', 'wave'], ['किनारा', 'kinara', 'shore']],
  scenes: [
    { art: ['pt_tortoise'], who: null,
      text: 'Here is a tale for the smallest islands — the ones that began as nothing but a white sandbank on a coral reef, far out at sea, with no tree, no shade, no fresh water, and nobody home.' },
    { art: ['pt_tortoise'], who: null,
      text: 'Far away, on some green coast, a coconut palm leaned out over the water, the way they do — coconut palms always lean towards the sea, as if they are listening for something. And one day a ripe nut let go, dropped, bounced once on the wet sand, and rolled into the waves.' },
    { art: ['pt_crow', 'pt_tortoise'], who: 'pt_crow', mood: 'think',
      text: '"You will drown," a gull told the coconut, from above. "Everything drowns out there." But the coconut did not drown. It floated — riding low and calm, like a small brown boat that had been designed by someone very clever.',
      ask: {
        q: 'What does a coconut carry inside its husk that lets it cross an ocean?',
        options: ['A little air to float, and its own water and food for the journey', 'A tiny sail', 'Nothing — it just gets lucky'],
        answer: 0,
        right: 'That is exactly right, and it is real: the husk floats, and inside is water to drink and food to grow on. A coconut is a packed suitcase.',
        wrong: 'Better than luck: the husk holds air so it floats, and inside is its own water and its own food. A coconut is a packed suitcase, ready for a long trip.'
      } },
    { art: ['pt_tortoise'], who: null,
      text: 'It rode the currents for weeks. Storms passed over it. Big fish looked at it and decided against it. It was patient the way only seeds are patient — which is completely.' },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      text: 'And at last a wave, taller than the rest, picked it up and set it down high on the white sandbank in the middle of the sea — above the tide line, in the warm sand, in the one place in a thousand miles where it could begin.' },
    { art: ['pt_tortoise'], who: null,
      text: 'It drank its own water. It ate its own food. It put down roots into sand that had never held a root before, and sent up one green feather of a leaf. The first tree on the island. The gulls came to sit in it, and their visits brought seeds of other things, and slowly the sandbank turned green.' },
    { art: ['pt_crow'], who: null,
      text: 'And when, long after, people came to that island, the palms were waiting for them — sweet water in the nuts, rope from the husk, roofs from the leaves, boats from the trunks, oil, shade, everything. The islanders of Lakshadweep say you can live a whole good life in the gifts of this one tree, and they should know.' },
    { art: ['pt_tortoise'], who: 'mithu',
      text: 'Every coconut palm on every island is the great-great-grandchild of some brave nut that crossed the water alone. Which is worth remembering, next time something small and slow sets out on something big.' }
  ],
  moral: 'Small, slow and packed with patience will cross an ocean that big and loud cannot.',
  source: 'A Bizzing India telling, said so plainly: there is no single collected folk text behind it. The natural history is real — coconuts genuinely float across oceans and sprout on far beaches, and the palm is the tree of life of Lakshadweep, where almost every part of it is used.'
},

{
  id: 'fk.turtle-lagoon',
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Turtle Who Kept the Lagoon Calm',
  hook: 'Outside the reef, the ocean roars all day. Inside, the water lies still as a mirror. The islanders\' children know who to thank.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'courtier'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['कछुआ', 'kachhua', 'turtle'], ['शांति', 'shanti', 'calm'], ['धीरे', 'dheere', 'slowly']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Every Lakshadweep island has two seas. Outside the reef is the big dark ocean, which is always in a hurry and always shouting. Inside the reef is the lagoon — green glass, warm as bathwater, so still you can watch a crab walk on the bottom from a boat.' },
    { art: ['pt_tortoise'], who: null,
      text: 'In the lagoon lives an old green turtle. She has been there longer than anyone\'s grandmother can remember. She grazes on the seagrass meadows the way a cow grazes a field, and she rises, and takes one slow breath, and sinks, and that is her whole day, and she is not sorry.' },
    { art: ['pt_tortoise', 'courtier'], who: null,
      text: 'The island children tell each other that the lagoon is calm because of her. Every morning, they say, she swims one slow circle right around the inside of the reef — and everywhere she passes, the water remembers how to be still.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'One monsoon, the sea outside went wild for days, and even the lagoon began to fret — slapping at the boats, chewing at the sand. A small boy ran to his grandfather. "The turtle has stopped swimming her circle! Someone must go and tell her to hurry!"',
      ask: {
        q: 'The lagoon is upset and the turtle is as slow as ever. Should somebody make her hurry?',
        options: ['Yes — a storm is no time to be slow', 'No — her slowness is not the problem, it is the cure', 'Yes — or find a faster turtle'],
        answer: 1,
        right: 'The grandfather said the same. "She has seen a hundred storms, and hurried for none of them. Watch what she does instead."',
        wrong: 'The grandfather shook his head. "She has seen a hundred storms, and hurried for none of them. Her slowness is not the problem. Watch."'
      } },
    { art: ['pt_tortoise'], who: null,
      text: 'They watched from the beach. Out in the churning lagoon, the old turtle was swimming her circle — the same circle, at the same speed, unhurried as sunrise, while the water leapt and fussed around her.' },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      text: 'And wherever she had passed, the water settled. Not because she pushed it down. Because it is very hard, even for a sea, to keep panicking next to somebody who simply is not going to.' },
    { art: ['courtier'], who: null,
      text: 'By evening the storm outside was still roaring — but the lagoon lay quiet again, holding the boats, holding the reflections of the palms, holding still.' },
    { art: ['courtier', 'pt_tortoise'], who: 'courtier',
      text: '"That is her whole trick," the grandfather said, walking home. "She does not calm the water. She reminds it. There is a turtle like that inside you, too — slow breaths, same circle. When your own weather gets loud, send her swimming."' },
    { art: ['pt_tortoise'], who: 'mithu',
      text: 'Real green turtles really do graze the lagoons of Lakshadweep, and they are protected there — you may swim near one someday. Move slowly if you do. She was calm before you arrived; the least you can do is match her.' }
  ],
  moral: 'You cannot shout a storm quiet. But calm, kept steadily enough, is catching.',
  source: 'A Bizzing India telling in the idiom of the islands, said so plainly — not a collected folk text. The green turtles, the seagrass meadows and the stillness of the Lakshadweep lagoons are real, and the turtles are protected by law.'
},

{
  id: 'fk.wandering-sandbank',
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Sandbank That Goes Visiting',
  hook: 'Some mornings there is a little white island in the lagoon. Some mornings there is only sea. The children say it goes visiting.',
  hero: 'courtier',
  cast: ['courtier', 'pt_crow'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['रेत', 'ret', 'sand'], ['चाँद', 'chand', 'moon'], ['ज्वार', 'jwaar', 'tide']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Near one of the islands of Lakshadweep there is a sandbank — a little bare hill of white sand out in the lagoon, with no trees, no huts, no anything. On some days you can row out, land on it, and have the smallest country in the world all to yourself.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'And on other days it is simply not there. Row to the same spot and you find green water, with fish going about their business exactly where you stood yesterday. The little ones on the island say the sandbank has gone visiting.' },
    { art: ['courtier', 'pt_crow'], who: null,
      text: '"Visiting whom?" asks every child, sooner or later. "Its mother," say the grandmothers, who have been giving this answer for generations. "The sea is its mother. Even an island goes home to its mother twice a day."' },
    { art: ['courtier'], who: null,
      text: 'The bigger children learn the realer answer, which is just as good: the tide. Twice a day the sea breathes in and the water rises, and the sandbank slips under like a turtle ducking its head. Twice a day the sea breathes out, and there it is again, white and dripping, as if nothing had happened.' },
    { art: ['pt_crow', 'courtier'], who: null, mood: 'think',
      text: 'And who pulls the tide? Look up. The moon, all that way away, tugs at the ocean as it passes, and the ocean leans towards it the way sunflowers lean at the sun. The moon moves the sea; the sea covers the sandbank. A child standing on that sand is standing inside a machine made of moonlight.' },
    { art: ['courtier'], who: 'courtier',
      text: 'One afternoon three children rowed out to the sandbank to play, and played hard, and the game reached its absolute best part just as the first cold finger of water crept across the middle of the sand.',
      ask: {
        q: 'The best part of the game, and the tide is coming in. What do the island children do?',
        options: ['Finish the game — the water is still shallow', 'Get in the boat now — the sea keeps its schedule, not yours', 'Argue about it for a while'],
        answer: 1,
        right: 'Island children do not argue with the tide. In the boat, at once — the game can finish on the beach.',
        wrong: 'Island children know better than that. The tide keeps its own schedule and does not wait for the end of games. In the boat, at once.'
      } },
    { art: ['courtier'], who: null,
      text: 'They sat in the boat and watched their footprints disappear one by one under the green water — first the ones near the edge, then the hopscotch squares, then the castle, then the whole little country, gone visiting.' },
    { art: ['courtier'], who: null,
      text: '"It will come back," said the eldest, and it did, the very next morning, rinsed perfectly clean — every footprint gone, every game erased, brand new sand ready for brand new games. Which is, if you think about it, a wonderful way to run an island.' },
    { art: ['pt_crow'], who: 'mithu',
      text: 'Tides are real, the moon really does pull them, and low sandbanks all over Lakshadweep really do appear and disappear twice a day. Ask your family when the moon is fullest — that is when the sea breathes deepest, and the sandbank stays away longest.' }
  ],
  moral: 'The sea keeps its own timetable. The wise thing is not to fight it — it is to know it.',
  source: 'A Bizzing India telling, said so plainly — the grandmothers\' answer is the app\'s own invention in the island idiom. The tides, the moon\'s pull, and the sandbanks of the Lakshadweep lagoons that vanish and return twice a day are entirely real.'
},

/* ================================================== ANDAMAN & NICOBAR ====== */
{
  id: 'fk.tree-that-counts',
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Trees That Count as Family',
  hook: 'In the Nicobar Islands, when a baby is born, somebody plants a tree — and the tree is not a decoration. It is a plan.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['नारियल', 'nariyal', 'coconut'], ['परिवार', 'parivaar', 'family'], ['पेड़', 'ped', 'tree']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'South of the Andamans, strung towards Sumatra, lie the Nicobar Islands — and they belong, first and always, to the Nicobarese, who have lived there for many centuries and still do. This story is about how they count what matters, and it is told with their leave in mind: it describes, it does not pretend to speak for them.' },
    { art: ['courtier'], who: null,
      text: 'Ethnographers who visited the Nicobars long ago wrote down something that surprised them. When they asked, "Who is rich here?", nobody pointed at a house full of things. People pointed at coconut groves, and at pigs, and at big canoes. Wealth, in the Nicobarese way of counting, is what feeds people and carries people — not what sits in a box.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'And families are counted generously too. The traditional Nicobarese household — the tuhet, as it is called — is a big joint family: grandparents, uncles, aunts, cousins, everyone together, holding their groves and gardens in common. The trees do not belong to one person. They belong to the family, the way the family belongs to the trees.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'So when a baby is born, it has long been the way to plant coconut palms for the child. Think about what that means. A palm takes years to bear. Whoever plants for a newborn is saying: you will still be here, we will still be here, and the island will still be feeding us, long after I am old.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'A visitor once wondered aloud why anyone would measure wealth in trees when coins are so much easier to count.',
      ask: {
        q: 'Coins or coconut trees — which is the better way to be rich on an island?',
        options: ['Coins — you can spend them on anything', 'Trees — a coin is spent once, a tree gives food every year for a lifetime', 'Neither — being rich does not matter'],
        answer: 1,
        right: 'That is the island arithmetic. A coin leaves your hand once. A grove feeds your grandchildren.',
        wrong: 'Island arithmetic says otherwise: a coin leaves your hand once and is gone, but a grove stands there feeding your family for a hundred years.'
      } },
    { art: ['guard'], who: null,
      text: 'The groves give food and oil and drink; the pigs are for feasts, when whole villages gather; the canoes — carved, outrigger-steadied, quick through the surf — knit the islands together. Gardens grow yams and pandanus. It is a whole way of living, built to last, and it was built by the Nicobarese themselves.' },
    { art: ['courtier'], who: null,
      text: 'Life on the islands has changed and keeps changing — there are schools and ferries and phones, and the great tsunami of 2004 hit these islands very hard, and the Nicobarese rebuilt, together, tuhet by tuhet. The counting survived. Family first, and trees for the children.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Somewhere in the Nicobars today there are palms standing that were planted for children who are now grandparents. Ask yourself what your family plants — it is not always a tree, but every family plants something.' }
  ],
  moral: 'Real wealth is whatever still feeds your family in fifty years. Count in trees, not coins.',
  source: 'The Nicobarese of the Nicobar Islands, as recorded by ethnographers of the islands and as reported in accounts of Nicobarese life: joint-family tuhets, wealth reckoned in coconut groves, pigs and canoes, and palms planted for children. Practices vary island to island and generation to generation — told here with respect, describing rather than speaking for the community.'
},

{
  id: 'fk.ross-ficus',
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Island the Roots Took Back',
  hook: 'It had ballrooms, a bakery, a printing press and a church. Then the people left — and the forest quietly moved back in.',
  hero: 'guard',
  cast: ['guard', 'pt_deer'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['जड़', 'jad', 'root'], ['दीवार', 'deewar', 'wall'], ['जंगल', 'jangal', 'forest']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'Just off Port Blair in the Andamans lies a tiny island you can walk around in an hour. A hundred and some years ago, under British rule, it was the little capital of the whole island chain — Ross Island, where the officers who governed lived with their families.' },
    { art: ['guard'], who: null,
      text: 'For its size, it had everything: a church with a steeple, a bakery, tennis courts, a printing press, gardens, grand houses with verandas looking out at the sea. People called it the Paris of the East, which was laying it on a bit thick, but it was certainly the fanciest square half-kilometre for a thousand miles.' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'It did not last. A great earthquake shook the island in 1941, and then the Second World War swept through the Andamans, and when it was all over the British were leaving India altogether. The people went away, and the doors stood open, and the island fell silent.' },
    { art: ['pt_deer', 'guard'], who: null, mood: 'think',
      text: 'But an island is never really silent. Something had been waiting at the edges the whole time — patient, green, and in absolutely no hurry.',
      ask: {
        q: 'The people are gone. What takes over an abandoned island?',
        options: ['Nothing — empty buildings just stay empty', 'The forest — seed by seed, root by root', 'Pirates'],
        answer: 1,
        right: 'The forest. Birds dropped fig seeds on the rooftops, the rains watered them, and the great ficus trees began to grow — right out of the walls.',
        wrong: 'Not pirates, and never nothing. Birds dropped fig seeds on the rooftops, the rains watered them, and the great ficus trees began to grow — right out of the walls.'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'Go there today and you will see something few places on Earth can show you: whole buildings held in the arms of trees. Ficus roots pour down over doorways like slow waterfalls, wrap window arches, climb the church tower. You cannot always tell where wall ends and root begins — and that is the point. The island decided they should be one thing.' },
    { art: ['pt_deer'], who: null,
      text: 'Spotted deer graze on the old parade ground. Peacocks call from the officers\' gardens. The sea wind goes through rooms where dances were held, and nobody dances there but the light.' },
    { art: ['guard'], who: 'guard',
      text: 'A guide on the island likes to put it this way: "The empire built in brick and thought it was building forever. The ficus builds in patience — and patience is the stronger material."' },
    { art: ['guard'], who: null,
      text: 'The island has a new official name now — Netaji Subhas Chandra Bose Dweep, honouring the freedom fighter whose flag was raised in these islands. Ferries bring visitors every day, and the deer watch them come and go, the way the island has watched everyone come and go.' },
    { art: ['pt_deer'], who: 'mithu',
      text: 'Walls fall down and roots grow up — everywhere, always, not just there. It is worth remembering which of the two things people cheer for, in the end.' }
  ],
  moral: 'What is built by force stands for a while. What grows by patience takes it back.',
  source: 'Ross Island (officially renamed Netaji Subhas Chandra Bose Dweep in 2018), Port Blair, Andaman Islands: the former British administrative headquarters, damaged by the 1941 earthquake, abandoned around the Second World War, and now famous for its ficus-covered ruins, deer and peafowl. Open to visitors today; the guide\'s words are the app\'s own telling.'
},

{
  id: 'fk.north-bay-light',
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Lighthouse That Says Its Name',
  hook: 'Every lighthouse on every coast blinks — but no two blink alike. Each one is saying who it is, all night long.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['रोशनी', 'roshni', 'light'], ['रात', 'raat', 'night'], ['जहाज़', 'jahaaz', 'ship']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'At the mouth of the harbour near Port Blair, on a green headland called North Bay, stands a lighthouse — white and red-banded, above water so clear that the coral gardens below it are famous across India. For years, a picture of this very view was printed on the old twenty-rupee note, so millions of people carried this lighthouse in their pockets without ever knowing its name.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'By day it just stands there being photographed. Its real work starts when the light goes out of the sky and the sea turns into a thousand kilometres of ink — because out on that ink, there are ships, and the ships need to know where the land is before they touch it.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'A girl visiting her uncle, a lighthouse keeper, asked the good question. "But uncle — a sailor sees a light. Fine. How does he know WHICH light? There are lighthouses on every coast in the world. A light is a light."',
      ask: {
        q: 'In the dark, every lighthouse is just a bright dot. How can a sailor tell one from another?',
        options: ['Each lighthouse blinks in its own special rhythm', 'Lighthouses are all different colours', 'Sailors just guess from the map'],
        answer: 0,
        right: 'Exactly. Each lighthouse has its own pattern of flashes — its signature. Count the blinks and the pauses, check the chart, and the light tells you its name.',
        wrong: 'The trick is rhythm. Each lighthouse flashes in its own pattern — so many blinks, so long a pause — like a signature written in light. Count it, check the chart, and the light tells you its name.'
      } },
    { art: ['guard'], who: 'guard',
      text: '"Every light says its own name, all night, in blinks," the keeper said. "The chart lists every pattern on the coast. A sailor counts — flash, flash, pause — and knows exactly which headland he is looking at, and exactly where the reef lies. The light is not just saying here is land. It is saying here is land, and I am North Bay."' },
    { art: ['guard'], who: null,
      text: 'The keeper\'s work is steadiness itself: the lamp, the lens, the log book. It is not exciting, and it is not supposed to be. Somewhere out in the dark, someone he will never meet is safe because the light did tonight exactly what it did last night.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'These waters have another wonder: the sea itself sometimes lights up. On dark nights, tiny living things in the water glow when the waves stir them, so a boat\'s wake can trail pale fire. Sailors of these islands have watched their own oars drip light for as long as there have been oars.' },
    { art: ['courtier'], who: null,
      text: 'And under the North Bay light, by day, glass-bottomed boats drift over the coral — clouds of striped fish, blue staghorn, giant clams with velvet lips — a whole silent city that the lighthouse has been quietly guarding from shipwreck for generations.' },
    { art: ['guard'], who: 'mithu',
      text: 'People are a little like lighthouses, the keeper would tell his niece. Being bright is ordinary. Being steady — blinking your own true pattern, every night, whether or not anyone seems to be watching — that is what actually brings the ships home.' }
  ],
  moral: 'Anyone can shine once. A lighthouse is trusted because it shines the same, all night, every night.',
  source: 'The North Bay lighthouse near Port Blair, Andaman Islands — the view familiar from the back of India\'s old twenty-rupee note — and the real system of light characteristics, by which every lighthouse flashes its own charted pattern. The keeper and his niece are the app\'s own telling; sea-sparkle (bioluminescence) is real in these waters.'
},

{
  id: 'fk.dugong-meadow',
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Dugong Who Remembered',
  hook: 'Under the sea there are meadows, and in the meadows grazes a gentle giant with a very long memory.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'pt_crocodile'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['समुद्र', 'samudra', 'sea'], ['घास', 'ghaas', 'grass'], ['याद', 'yaad', 'memory']],
  scenes: [
    { art: ['pt_tortoise'], who: null,
      text: 'Most people know the sea has fish. Fewer know the sea has meadows — real ones, of soft green seagrass, growing in the shallow sunlit water of quiet bays. And where there are meadows, there are grazers. In the Andaman and Nicobar Islands, the grazer is the dugong: the sea cow.' },
    { art: ['pt_tortoise'], who: null,
      text: 'A dugong is big as a boat and gentle as a grandmother. She has a round face, small kind eyes, and a whiskery lip made for cropping grass. She hurts nobody. She eats her meadow, rises softly for a breath of air, sighs, and sinks back to the grass. Sailors long ago, seeing her rise in the dusk, started half the mermaid stories in the world.' },
    { art: ['pt_crocodile', 'pt_tortoise'], who: null,
      text: 'Now for the tale the islands\' waters could tell. An old dugong grazed the same meadow her mother had grazed, and her mother\'s mother before that. Dugongs are like that: they carry the map of the meadows in their memory, handed down, older than anybody\'s charts.' },
    { art: ['pt_tortoise'], who: null, mood: 'sad',
      text: 'One year, a storm tore her meadow — ripped the grass, buried it in sand. The young dugong beside her, her daughter, circled the ruined place and did not know what to do. There was nothing to eat, and the sea suddenly seemed very large and very empty.' },
    { art: ['pt_tortoise'], who: 'pt_tortoise', mood: 'think',
      text: 'The old one nudged her and turned away from the ruin, out along the coast. She was remembering: three bays north, past the point where the mangroves lean out, there is another meadow. Her own mother had shown her, long ago, on a day she had never needed until now.',
      ask: {
        q: 'The old dugong has never needed the far meadow in her whole life. Why did her mother bother showing it to her?',
        options: ['To make the swim longer', 'Because what you learn before you need it is the thing that saves you', 'By accident'],
        answer: 1,
        right: 'That is what memory is for. Grandmothers everywhere teach spare meadows.',
        wrong: 'Nothing about it was accident. What you learn before you need it is exactly the thing that saves you — grandmothers everywhere teach spare meadows.'
      } },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      text: 'They swam together, the old one leading, three bays north, past the leaning mangroves — and there it was, green and waving in the underwater light, exactly where memory said it would be. They put their heads down and grazed, side by side, and the daughter learned the way as she went.' },
    { art: ['pt_crocodile'], who: null,
      text: 'And back at the ruined meadow, something slow and hopeful was happening: seagrass regrows. Blade by blade the old meadow returned, and one day the daughter would lead her own calf back to it, along a path made entirely of remembering.' },
    { art: ['pt_tortoise'], who: null,
      text: 'The dugong is the official animal of the Andaman and Nicobar Islands, and it is protected — because there are not many left, and a creature that harms nobody deserves waters that harm her back just as little. Protecting her means protecting the meadows too. You cannot save a grazer and pave her grass.' },
    { art: ['pt_tortoise'], who: 'mithu',
      text: 'Ask your oldest relative to show you something they learned from THEIR oldest relative. That is a seagrass path. Every family swims along them.' }
  ],
  moral: 'The elders carry the map of the spare meadows. Learn it before you need it.',
  source: 'A Bizzing India telling, said so plainly — not a collected folk text. The natural history is real: dugongs graze the seagrass meadows of the Andaman and Nicobar Islands, pass on knowledge of feeding grounds, are the islands\' official animal, and are protected under Indian law.'
},

{
  id: 'fk.flying-fox-ferry',
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Evening Ferry of the Flying Foxes',
  hook: 'Every evening, on schedule, a slow dark river crosses the island sky. It is not birds. Look closer.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'courtier'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['शाम', 'shaam', 'evening'], ['आकाश', 'aakash', 'sky'], ['बीज', 'beej', 'seed']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'On the islands of the Andamans, the day ends with a show, and the show is free. Just as the sky goes gold, a long, slow, flapping line rises out of the tall trees and sets off across the water — hundreds of big dark shapes, unhurried as a ferry queue.' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      text: 'They are flying foxes — the great fruit bats of the islands, with fox-red faces, wrapped-umbrella wings, and a wingspan wider than your armspan. All day they hang upside down in their roost trees, fanning themselves, bickering gently, doing absolutely nothing. Evening is when their work begins.' },
    { art: ['pt_crow', 'courtier'], who: null,
      text: 'And it IS work. The islands just do not know it. The flying foxes cross to the fruit trees — wild figs, sea almonds, mangoes gone wild — and they feast all night, and they are messy eaters, and the mess is the whole point.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'A boy watching the evening crossing with his aunt asked her the good question. "Auntie, the forest on that little island across the water — who planted it? Nobody lives there. Nobody ever has."',
      ask: {
        q: 'Nobody ever planted the little island\'s forest. So how did a forest cross the sea?',
        options: ['It grew from nothing', 'Wings and waves carried the seeds — bats, birds and floating fruit', 'Someone planted it secretly at night'],
        answer: 1,
        right: 'That is exactly how. Every seed a flying fox drops is a tree posted to a new address.',
        wrong: 'The secret planters are real, but they have wings. Bats and birds carry seeds in their bellies, the waves float the rest — every seed dropped is a tree posted to a new address.'
      } },
    { art: ['pt_crow'], who: null,
      text: '"Watch the ferry," said his aunt. "Every fox that eats a fig carries its seeds away inside her, and somewhere out over the islands tonight, seeds will fall — into clearings, onto beaches, across channels no seed could swim. The bats have been planting these islands since before there was anyone here to watch them do it."' },
    { art: ['pt_crow'], who: null,
      text: 'The old trees the foxes hang in by day are known roosts — the same trees, year after year, generations of bats in the same branches, like a family that has never once moved house. Islanders navigate by them: turn at the bat trees, everyone knows where that is.' },
    { art: ['courtier'], who: null,
      text: 'The boy and his aunt watched until the last stragglers crossed, little black commas against the pink. "They will be back before dawn," she said. "Full of fruit, planting all the way home. Sleep, school, dinner — that is your schedule. Hang, fly, plant a forest — that is theirs."' },
    { art: ['pt_crow'], who: 'mithu',
      text: 'Next time you eat a fruit and flick the seed away — congratulations, you did a flying fox\'s job for one seed. They do it a thousand times a night, on wings, in the dark. The forests of the islands are their signature.' }
  ],
  moral: 'Some of the most important work in the world looks like a slow line of somebody else\'s evening.',
  source: 'A Bizzing India telling, said so plainly — the aunt and the boy are the app\'s own. The natural history is real: flying foxes (great fruit bats) roost communally in the Andaman Islands, cross between islands at dusk, and are major seed-dispersers by which island forests spread.'
},

{
  id: 'fk.one-island-bird',
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Bird With One Island',
  hook: 'Every kind of bird lives somewhere. One hornbill lives on exactly one small island — and nowhere else on Earth.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'guard'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['पक्षी', 'pakshi', 'bird'], ['द्वीप', 'dweep', 'island'], ['घोंसला', 'ghonsla', 'nest']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'Far out beyond the main Andaman Islands, alone in the open sea, stands a small green volcanic island called Narcondam. It has cliffs, forest, no town, and one resident that has made it famous among people who love birds: the Narcondam hornbill.' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      text: 'A hornbill is a spectacular thing — a big handsome bird with a huge curved bill, swooping through the canopy after figs. There are hornbills in many forests of India. But THIS hornbill lives on Narcondam Island only. Not the next island. Not the mainland. Nowhere else on the entire planet.' },
    { art: ['pt_crow', 'guard'], who: null,
      text: 'Scientists have a word for that: endemic. It means "found only here." The whole world population of Narcondam hornbills — every single one that exists — fits on one island you could walk across in an afternoon.' },
    { art: ['pt_crow'], who: null,
      text: 'Hornbills raise their families in a way that sounds made up and is not. The mother finds a hollow in a big old tree, settles in, and seals the entrance from inside with mud and paste — leaving only a narrow slit. She stays walled in with her eggs, safe from every snake and storm.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      text: 'Which leaves one obvious problem: a walled-in mother cannot go shopping.',
      ask: {
        q: 'Mother hornbill is sealed in the nest hollow for weeks. How does she eat?',
        options: ['She stores months of food beforehand', 'The father brings food to the slit, trip after trip, all season', 'She does not eat until the chicks fly'],
        answer: 1,
        right: 'The father. All day, every day — figs and fruit passed through the slit, hundreds of trips, until the chicks are ready. He feeds his whole walled-up family alone.',
        wrong: 'The father does it. All day, every day, he flies fruit to the nest and passes it through the slit — hundreds of trips, feeding his whole walled-up family until the chicks are ready to come out.'
      } },
    { art: ['guard'], who: null,
      text: 'And here is the beautiful circle: the hornbills live on the forest\'s figs, and the forest lives on the hornbills — the seeds they swallow and scatter grow into the next generation of fig trees. One island, one bird, one forest, each keeping the other going, round and round, for thousands of years.' },
    { art: ['guard'], who: 'guard',
      text: 'A creature with one island has no spare. If anything went badly wrong on Narcondam — the trees cut, new animals brought ashore — there would be no second population out there to carry on. So the island is protected as a sanctuary, visits are strictly limited, and scientists count the hornbills carefully. The counts in recent years have been good news: the bird with one island is holding on.' },
    { art: ['pt_crow'], who: null,
      text: 'India is dotted with treasures like this — species whose entire world is one hill, one lake, one island. They are the country\'s rarest belongings, rarer than anything in any vault, because a vault\'s treasures can be replaced.' },
    { art: ['pt_crow'], who: 'mithu',
      text: '"Found only here" is another way of saying "trusted only to us." Narcondam\'s hornbill is trusted to India. Whatever is endemic to your corner of the world — ask, find out — is trusted to you.' }
  ],
  moral: 'A treasure that exists in only one place makes that place its keeper.',
  source: 'The Narcondam hornbill, endemic to Narcondam Island in the Andamans — a protected wildlife sanctuary with the species\' entire world population; hornbill nest-sealing and the father\'s provisioning are standard hornbill biology. Recent surveys report a stable population.'
},

{
  id: 'fk.island-of-tongues',
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Bazaar of Many Tongues',
  hook: 'Stand in one market in the Andamans and close your eyes. You can hear half of India — and something far, far older.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['भाषा', 'bhasha', 'language'], ['बाज़ार', 'bazaar', 'market'], ['घर', 'ghar', 'home']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Go to the morning market in Port Blair — the main town of the Andamans, lately given the new official name Sri Vijaya Puram — and just listen. Bengali at the fish stall. Tamil at the flower stall. Telugu, Malayalam, Hindi, Nicobarese from the southern islands, English over the tourist maps. One small market, half of India talking at once.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Every language arrived with a story. Over the last century and a half, settlers came to these islands from Bengal and from Tamil country, from Kerala and Andhra and the Ranchi plateau — farmers, labourers, fisherfolk, clerks — and each family packed its language along with its cooking pots. The islands became a little India, sea-flavoured.' },
    { art: ['guard'], who: null,
      text: 'Their childhoods braided together. An Andaman child today might have a Bengali name, a Tamil best friend, a Malayali teacher, and a favourite Telugu film song — and switch languages three times between the school gate and the bus without noticing she has done it.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'But the islands hold languages far older than any of these — older than almost anything. The first peoples of the Andamans — the Great Andamanese, the Onge, the Jarawa, the Sentinelese — have lived here for many thousands of years, and their languages belong to no other family of languages on Earth. In the Nicobars, the Nicobarese and the Shompen likewise speak languages all their own.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'Some of those ancient voices have grown very quiet. The languages of the Great Andamanese peoples, once many, now have only a handful of speakers, and elders have worked with linguists to write down words, songs and names so that what remains is kept with honour. When an old speaker dies, a whole library closes. That is why the work matters.',
      ask: {
        q: 'When a language falls silent, what exactly is lost?',
        options: ['Nothing — people just use another language', 'A whole way of seeing: its names for the winds and plants, its songs, its jokes, its memory', 'Only some old words'],
        answer: 1,
        right: 'A language is a way of seeing. Every one carries names, songs and knowledge that exist nowhere else — which is why elders and linguists work together to keep them.',
        wrong: 'Far more than words. A language carries its own names for the winds and plants, its own songs and jokes and memory — a whole way of seeing that exists nowhere else.'
      } },
    { art: ['guard'], who: null,
      text: 'The Jarawa and the Sentinelese still speak their languages every day, in their own forests and on their own island, as they always have. Nobody outside knows those languages — and that is as it should be. India protects their lands and their choice to be left in peace. Respect, here, means distance.' },
    { art: ['courtier'], who: 'courtier',
      text: 'A schoolteacher in Port Blair puts it to her class like this: "Our islands speak in layers. The newest layers came by ship, and you can hear them in the bazaar. The oldest layers came before ships existed, and they are not ours to visit. Both deserve the same thing from you — care."' },
    { art: ['courtier'], who: null,
      text: 'So the market hums on: Bengali, Tamil, Hindi, Telugu, Malayalam, Nicobarese, all bargaining over the same bright fish. And beyond the last road, in the deep forest, the oldest languages of the islands go on being spoken to the people they belong to.' },
    { art: ['guard'], who: 'mithu',
      text: 'Count the languages in your own family — the ones spoken, and the ones a grandparent knows that you do not. Ask for ten words of one before the year is out. That is how a library stays open.' }
  ],
  moral: 'Every language is somebody\'s home. Visit the ones you are invited into; guard the ones you are not.',
  source: 'The settler communities of the Andaman Islands (Bengali, Tamil, Telugu, Malayali, Hindi-speaking and Ranchi-region families among them) are well documented, as are the indigenous peoples — Great Andamanese, Onge, Jarawa, Sentinelese, Nicobarese and Shompen — whose languages are unrelated to any outside family; Great Andamanese language documentation with the community\'s elders is real and ongoing, and tribal lands are protected by law. Port Blair was officially renamed Sri Vijaya Puram in 2024. The teacher is the app\'s own telling.'
},

/* ========================================================== JHARKHAND ====== */
{
  id: 'fk.first-dance',
  collection: 'desh-east',
  badge: 'katha',
  title: 'How the First Evening Got Its Dance',
  hook: 'The world was made, the fields were planted, the day\'s work was done — and then everyone just stood there. Something was missing.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['नाच', 'naach', 'dance'], ['ढोल', 'dhol', 'drum'], ['शाम', 'shaam', 'evening']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'The Santhals of Jharkhand sing their whole history, from the very beginning of the world — and this is one of the tellings from early in that story, after the first ancestors, when their children and grandchildren had villages, and fields, and everything a people needs. Almost everything.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Because in the first villages, the tellings say, the evenings were wrong. The day was full — clearing, sowing, herding, building. But when the sun went down and the work stopped, people just sat. The fire crackled. Somebody yawned. There was a hole in the evening exactly the shape of something nobody had invented yet.' },
    { art: ['guard'], who: null,
      text: 'The first piece arrived by accident. A woman husking rice kept a rhythm with her pestle — thum, thum, thum — and a man mending a roof found his hands tapping along. Somebody stretched a skin over a hollow log to answer the pestle back, and there, suddenly, was the drum.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'And a drum, as everyone instantly discovered, does not let you sit still. It goes in at the ears and comes out at the feet. The children were up first — children always are — hopping in the firelight with no idea what they were doing and no interest in stopping.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'Then came the question that made it Santhal. One dancer alone in the middle looked wonderful and a little lonely. Everyone wanted to join — but how do many people dance together without becoming a herd of collisions?',
      ask: {
        q: 'A whole village wants to dance at once. What shape lets everyone in?',
        options: ['A line, hands linked, moving together', 'Everyone alone, scattered about', 'Only the best dancers, with the rest watching'],
        answer: 0,
        right: 'The line. Hands linked, feet together, swaying as one — and there is no end to a line: anyone who comes can simply join it.',
        wrong: 'They found the line: hands linked, feet moving together, the whole row swaying as one. And a line has no end — anyone who comes can simply join it.'
      } },
    { art: ['courtier'], who: null,
      text: 'That is the dance you can still see: the long line of dancers, arms linked, stepping and swaying together while the drums talk underneath — the big tamak and the long tumdak\', the two drums whose names every Santhal child knows. The line curls around the dancing ground like a slow, happy river.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'The songs grew to fit it — songs for planting and harvest, for weddings, for the festivals of Baha in the spring and Sohrai after the harvest. Different dances for different days, each with its own step and its own songs, so the year itself learned to dance.' },
    { art: ['courtier'], who: null,
      text: 'And the hole in the evening was filled. Work all day with your hands beside your neighbours, the elders say, and then in the evening, link those same hands and step together — and a village that dances in one line will pull in one line too, when the hard days come.' },
    { art: ['courtier'], who: 'mithu',
      text: 'On festival nights across Jharkhand the drums still start at dusk, and the line still forms, and it still has room. That is the oldest rule of the oldest dance: nobody who wants to join is ever turned away from the end of the line.' }
  ],
  moral: 'A line of linked hands has no collisions and no end. Villages that dance together hold together.',
  source: 'Santhal oral tradition of Jharkhand and the country round about, where the people\'s history is sung from the creation onward and communal line-dances with the tamak and tumdak\' drums mark Baha, Sohrai, weddings and festivals. The dances and drums are real and current; tellings of how they began vary, and this is one gentle telling of it.'
},

{
  id: 'fk.singbonga-furnaces',
  collection: 'desh-east',
  badge: 'katha',
  title: 'Sing Bonga and the Smoke That Hid the Sky',
  hook: 'The iron furnaces burned day and night, and the smoke rose and rose, until even the sun had to do something about it.',
  hero: 'courtier',
  cast: ['courtier', 'pt_crow'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['सूरज', 'sooraj', 'sun'], ['लोहा', 'loha', 'iron'], ['चिड़िया', 'chidiya', 'bird']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'The Munda people of Jharkhand, and their neighbours the Asur — who were master iron-smelters for centuries, real ones, whose old furnace mounds still dot the plateau — tell a story from the deep beginning of things, about iron, smoke, and the sun himself.' },
    { art: ['courtier'], who: null,
      text: 'In that story the first smelters learned a mighty secret: that certain red earth, cooked in a furnace hotter than any cooking fire, weeps out shining iron. Axes! Ploughshares! Arrowheads! It was the most useful magic anyone had ever found, and they were rightly proud of it.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'But pride kept feeding the fires. One furnace became many; the bellows sighed day and night; and the smoke went up in grey pillars that leaned together over the world, until the days grew dim and the nights had no stars, and everything green began to cough.' },
    { art: ['pt_crow', 'courtier'], who: null,
      text: 'High above it all was Sing Bonga — the great spirit whom the Munda tellings honour as the sun, the one who sees everything. He looked down through the smoke at his dimmed and dirty world, and decided that before anything else, the smelters should be asked, properly, to ease their fires. So he sent messengers: the birds.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      text: 'One after another the birds flew down to the furnaces to carry the message — and came back changed. The tellings say the king crow came back scorched black as charcoal, and others came back marked by smoke and cinders — and that is why those birds wear those colours to this day.',
      ask: {
        q: 'The bird-messengers came back singed, and the message was not heard. What should Sing Bonga do next?',
        options: ['Give up — some people never listen', 'Punish first and explain afterwards', 'Go down himself, humbly, and see the furnaces up close'],
        answer: 2,
        right: 'That is what the tellings say he did — he came down to the furnaces in the shape of an ordinary boy, so he could understand before he judged.',
        wrong: 'He did neither. The tellings say he came down himself, in the shape of an ordinary boy, to stand at the furnaces and understand before he judged.'
      } },
    { art: ['courtier'], who: null,
      text: 'So the sun walked to the furnaces as a plain, dusty boy, and worked the bellows, and listened. He saw the cleverness of the smelters and honoured it. He also saw the fires that never once rested, and the sky they were eating.' },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      text: 'Then he revealed himself — and in this gentle telling, the blaze of him was argument enough. "Your iron is good," he said. "Your never-stopping is not. Even I set, every single evening. The fires may burn — but they must also rest, or the sky belongs to your smoke instead of my light." And the furnaces learned to sleep at night, and the stars came back.' },
    { art: ['pt_crow'], who: null,
      text: 'The old tellings of this story end far more harshly for the smelters — the source below says so honestly — but every version keeps the same bones: the smoke, the singed birds who still wear their marks, and the sun who came down himself before he acted.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The Asur people still live in Jharkhand today, and archaeologists still study their ancestors\' iron — some of the oldest smelting country anywhere. A story this old, about smoke over-filling a sky, has rather a lot to say to the rest of us just now.' }
  ],
  moral: 'Make your fine things — but let the fires rest. Even the sun sets every evening.',
  source: 'The Sing Bonga and Asur cycle of Munda and Asur oral tradition in the Chotanagpur region, in which Sing Bonga sends bird messengers (returned singed, which is why they wear their colours) and descends himself to the smelters. Older recorded tellings end far more harshly for the Asur than this gentle version; the Asur are a living community, and their historic iron-smelting is well attested.'
},

{
  id: 'fk.sal-grove-promise',
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Grove the Axes Never Touch',
  hook: 'When the first fields were cleared, the trees fell one by one. Except in one place — and there is a reason the axes stop there.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['पेड़', 'ped', 'tree'], ['वादा', 'vaada', 'promise'], ['छाया', 'chhaya', 'shade']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Drive through Jharkhand and you will see it again and again: open fields, houses, roads — and then, beside a village, a patch of tall old forest standing untouched, dark green and quiet, like a piece of the original world. That is the sacred grove — the sarna, as the Oraon and Munda say; the jaher, as the Santhals say.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'The tellings go back to when the first fields were made. To farm, you must clear; the first families cut and burned and ploughed, and the forest gave ground, tree by tree, and the villages rose where it had stood.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      text: 'But at the edge of each new village, the elders stopped the axes. "Not this stand," they said, resting a hand on the great sal trunks. "This one we keep whole. The forest has given us everything — our fields were its body. A person who takes everything and keeps nothing back has forgotten who fed them."',
      ask: {
        q: 'The village needs wood and land, and here stands one more grove of tall sal. Why keep it uncut?',
        options: ['The wood was poor quality', 'As a promise — a kept piece of the forest, where its spirits and the village meet with honour', 'They ran out of axes'],
        answer: 1,
        right: 'A promise, and a meeting place. The grove is where the village honours the spirits of the land that carries it — the first and oldest thank-you, still standing.',
        wrong: 'Nothing so small. The grove is a kept promise — the piece of forest never taken, where the village honours the spirits of the land that carries it. The oldest thank-you there is, still standing.'
      } },
    { art: ['courtier'], who: null,
      text: 'So the groves stand. Under the sal trees the village holds its most important days — the Sarhul and Baha festivals of spring come to the grove first, with drums and flowers, and the village priest, the pahan, speaks there for the whole community. The grove is not scenery. It is an address: it is where the village and the living land talk.' },
    { art: ['courtier'], who: null,
      text: 'This is the heart of the Sarna way — the faith of many Adivasi communities of Jharkhand, who honour a single great spirit and the spirits of grove, hill and stream, and who will tell you plainly: our temple has a roof of leaves. It is a living faith, held today by millions, and the groves are its holy places.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'And the promise turned out to be wise twice over. Scientists who study the sacred groves keep finding the same thing: the old trees, the medicine plants, the birds and bees and cool springs survive in the groves when they have vanished everywhere around. The kept promise kept the seeds. The thank-you turned out to be a seed-bank.' },
    { art: ['courtier'], who: null,
      text: 'A sal tree, the elders say, gives all year — leaves for plates, resin for lamps and blessing-smoke, flowers in spring, shade in the terrible May sun. All it asks is what everything asks: do not take the last of me.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Somewhere near you there is probably a tree that someone decided must not be cut — ask your family if they know one, and who decided, and why. Every such tree is a small sarna: a promise with leaves.' }
  ],
  moral: 'Take what you need and keep a grove whole. The thank-you you leave standing feeds your grandchildren.',
  source: 'The sacred groves (sarna / jaher) of the Adivasi communities of Jharkhand — Oraon, Munda, Santhal, Ho and others — are real, current and central to the Sarna faith, with Sarhul and Baha kept in them each spring; their documented role as refuges of biodiversity is also real. The framing tale of the first promise is a Bizzing India telling in that idiom, said so plainly — ask an Adivasi family how they tell it.'
},

{
  id: 'fk.karam-brothers',
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Branch the Brothers Brought Home',
  hook: 'Two brothers had good luck and did not know where it came from. Then they found out — the hard way, and then the walking way.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['भाई', 'bhai', 'brother'], ['डाली', 'daali', 'branch'], ['त्योहार', 'tyohaar', 'festival']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Every year, when the rains are ripening the rice, the villages of Jharkhand keep the festival of Karam. A branch of the karam tree is carried home with songs and drums, planted with honour in the courtyard, and danced around all night. This is the story the festival tells — the story of Karma and Dharma, the two brothers.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Karma and Dharma were farmers, and their luck was famous. Their rice stood taller, their cattle shone, their granary needed a bigger door. And every year, at the ripening time, their household honoured the karam branch with songs, all night, the way their mother had taught them — that was the root of the luck, though the brothers had half forgotten it.' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'Then came a busy year. Trade was good, the brothers were rich and rushing, and when the festival came round, they had no time. The drums played in other courtyards. In theirs, nothing — and in some tellings the sacred branch was not just forgotten but knocked aside in the hurry, which is worse.' },
    { art: ['guard'], who: null,
      text: 'And the luck left. Quietly, completely, the way a guest leaves a house where no one greets her. The rice sickened, the cattle strayed, the granary emptied, and within the year the famous brothers were poor men staring at each other across a bare table.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'They asked an elder what they had broken. "You know what you have broken," she said. "The question is what you will do about it."',
      ask: {
        q: 'The brothers neglected the karam and lost everything. What must they do now?',
        options: ['Wait for the luck to wander back on its own', 'Go and find Karam Rani — walk, search, and bring the branch home with full honour', 'Buy a new branch quickly from the market'],
        answer: 1,
        right: 'The walking way. Honour that was thrown aside cannot be bought back cheap — it has to be gone after, on foot, and carried home properly.',
        wrong: 'There is no quick version. Honour thrown aside cannot be bought back cheap. They had to go after it on foot — and they did.'
      } },
    { art: ['courtier'], who: null,
      text: 'So the brothers walked. The tellings send them far — across rivers, through forests, asking everyone they met where the spirit of the karam might be found. And the search itself began to change them: two men who had had no time for anything now had time for everything, and helped whoever they met on the road, because they finally knew how it felt to need help.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'At last, by the water, they found the karam — and they asked its forgiveness, plainly, the way you ask when you mean it. And they cut one branch with honour, and carried it home high, singing the songs their mother had taught them, every verse, the whole way back.' },
    { art: ['guard'], who: null,
      text: 'They planted the branch in their courtyard, and the household danced around it all night — and the luck came home the way the branch had: carried, honoured, sung to. The fields recovered. The brothers did not forget again. Nobody who has walked that far for a branch forgets again.' },
    { art: ['courtier'], who: 'mithu',
      text: 'At Karam time today, the girls grow little cups of pale-gold seedlings — jawa, they are called — tended secretly for days before the festival, and the branch is planted and sung to till dawn, in Oraon, Munda, Santhal, Ho and many other households. If you are ever in Jharkhand in the rainy season, follow the drums.' }
  ],
  moral: 'Luck is a guest. It stays where it is greeted — and once neglected, it must be fetched back on foot.',
  source: 'The Karam festival of Jharkhand and neighbouring regions, kept by Oraon, Munda, Santhal, Ho, Kharia and other communities, and its tale of the brothers Karma and Dharma who neglected the karam and journeyed to bring the branch home. Many versions, differing in detail; the jawa seedlings and all-night songs are real and current.'
},

{
  id: 'fk.bamboo-bonga',
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Elephant and the Keeper of the Bamboo',
  hook: 'The bamboo grove fed him every winter. One winter he decided to eat all of it at once — and something in the grove cleared its throat.',
  hero: 'pt_elephant',
  cast: ['pt_elephant', 'courtier'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['हाथी', 'haathi', 'elephant'], ['बाँस', 'baans', 'bamboo'], ['कल', 'kal', 'tomorrow']],
  scenes: [
    { art: ['pt_elephant'], who: null,
      text: 'In the Santhal way of speaking, the living world is full of bongas — the spirits of places: a spirit of the hill, of the stream, of the old tree at the crossing. A place with a bonga is a place that is somebody, not just something. Which brings us to the elephant, and the bamboo grove above the village.' },
    { art: ['pt_elephant'], who: null,
      text: 'Every winter, when the forest grew lean, the elephant came up the hill to the great bamboo grove and ate. The grove always had enough: green canes at the edges, sweet shoots in the softer ground. He ate, rumbled his thanks in the general direction of nothing, and ambled off. It had worked this way his whole life.' },
    { art: ['pt_elephant'], who: null, mood: 'think',
      text: 'But this winter was hungrier than most, and standing in the middle of all that bamboo, the elephant had a big grey thought: why nibble at the edges? He could push the whole grove flat in an afternoon and feast for a week — the hearts of the clumps, the young shoots, everything, all at once.',
      ask: {
        q: 'A whole grove, one hungry elephant, one afternoon. What is wrong with eating everything at once?',
        options: ['Nothing — food is for eating', 'Eat the heart of the grove today and there is no grove next winter, or ever', 'He might get a stomach-ache'],
        answer: 1,
        right: 'That is the whole arithmetic. The edges regrow; the heart does not. Eat it all once and you have eaten every winter to come.',
        wrong: 'Bigger than a stomach-ache. The edges of a bamboo clump regrow, but the heart does not. Eat it all once, and you have eaten every winter to come as well.'
      } },
    { art: ['pt_elephant', 'courtier'], who: null,
      text: 'He had wrapped his trunk around the first great clump when the grove spoke. Not loudly. Bongas rarely need to be loud. It was a voice like wind through canes, coming from everywhere and nowhere: "Winter guest. Before you pull — a question."' },
    { art: ['courtier'], who: 'courtier',
      text: '"You have eaten here every winter of your life," said the keeper of the grove. "Who fed you last winter?" "This grove," said the elephant. "And the winter before?" "This grove." "And who will feed you NEXT winter?" The elephant opened his mouth, and stood there, trunk in the air, doing the arithmetic.' },
    { art: ['pt_elephant'], who: 'pt_elephant', mood: 'sad',
      text: '"...This grove," he said at last, very quietly. "If there is one." He let go of the clump. It swayed back upright, and the whole grove rustled — with relief, or laughter; with bamboo it is hard to tell the difference.' },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      text: '"Then here is the grove\'s law, guest," said the bonga. "Take from the edges, where I grow back. Leave the hearts, where I live. Eat your fill and leave me standing — and I will feed you, and your calves, and their calves, every winter until elephants forget the way here. That is a better bargain than one loud afternoon."' },
    { art: ['pt_elephant'], who: null,
      text: 'The elephant ate from the edges — a very large amount, it must be said; the law says fill, and he filled. Then he touched the oldest cane gently with his trunk, the way you touch an elder\'s feet, and went back down the hill. And the next winter the grove was there. And the next. And the next.' },
    { art: ['pt_elephant'], who: 'mithu',
      text: 'The Santhal villages of Jharkhand have kept the grove\'s law for longer than anyone has written things down: take from the edge, spare the heart, and treat the place like a somebody. It is why their hills still have groves to argue with.' }
  ],
  moral: 'Take from the edges and spare the heart, and the grove will outlast your grandchildren\'s hunger.',
  source: 'A Bizzing India telling, said so plainly — this particular elephant tale is the app\'s own. The frame is real and credited: bongas, the spirits of places, are how Santhal tradition speaks of the living land, and take-what-regrows restraint is genuine Adivasi forest practice in Jharkhand.'
},

{
  id: 'it.birsa-munda',
  collection: 'desh-east',
  badge: 'itihaas',
  needs_review: true,
  title: 'The Boy They Called Father of the Earth',
  hook: 'He herded sheep and played the flute like any village boy. A whole state now has its birthday on his.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-JH'],
  words_hi: [['धरती', 'dharti', 'earth'], ['जंगल', 'jangal', 'forest'], ['हक़', 'haq', 'rightful claim']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'This is a true story — itihaas, what the evidence shows. In 1875, in the village of Ulihatu on the Chotanagpur plateau, a boy named Birsa was born to a poor Munda family. He herded sheep, and he was known for his flute. Nothing about the beginning said history was watching.' },
    { art: ['courtier'], who: null,
      text: 'The Munda people had cleared and farmed those forests for many centuries, under their own old system: the land belonged to the families whose ancestors had first cleared it, together, as a community. Birsa grew up moving between villages and mission schools, quick at learning, listening to everything.' },
    { art: ['guard', 'courtier'], who: null, mood: 'sad',
      text: 'And what he saw as he grew up was his people losing ground on their own land. Under the laws of British colonial rule, outsiders — landlords and moneylenders — were gaining rights over Munda fields and forests. Families who had farmed a hillside for generations were being forced to pay rent for it, or to work without pay. The Mundas had a word for what was being lost, and it meant everything.' },
    { art: ['courtier'], who: null,
      text: 'As a young man, Birsa began to speak. He told his people to give up fear, to live cleanly, and to remember that the land under their feet was theirs by the oldest right there is — the right of the ones who made it a home. People began to walk long distances to hear him. They called him Dharti Aba: Father of the Earth. He was barely in his twenties.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'His message gathered into a movement, and the movement into a rising — the Ulgulan, his people called it, the Great Tumult, at its height in 1899 and 1900. Its cry has been remembered ever since: let our own rule return.',
      ask: {
        q: 'What were Birsa and the Mundas standing up FOR?',
        options: ['Treasure and power for Birsa himself', 'Their forests, their fields, and the right to live on their own land under their own ways', 'Nothing in particular'],
        answer: 1,
        right: 'That is what the evidence shows: land, forest and dignity — the right of a people to their own home and their own ways.',
        wrong: 'The record is clear: not treasure, and not power for one man. Forests, fields, and the right of a people to live on their own land under their own ways.'
      } },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'The colonial government answered with force, and the rising was put down; those parts of the story are hard, and this app keeps them for when you are older. Birsa was captured in 1900 and taken to Ranchi jail, and there, that same year, still only about twenty-five years old, he died. His people never stopped saying his name.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'And here is what the evidence shows happened next: the rulers who had jailed him had to change the law. Within a few years came a new act for Chotanagpur that protected Adivasi land from being taken by outsiders — a protection Birsa\'s people had bled for, and one that still stands in Jharkhand\'s law books today.' },
    { art: ['courtier'], who: null,
      text: 'A century later, India carved a new state out of the plateau, for the land of the forests — Jharkhand means exactly that. The chosen date for its birth: 15 November 2000. Birsa\'s birthday. His portrait hangs in India\'s Parliament; Ranchi\'s airport carries his name; and 15 November is now marked across India as a day honouring all Adivasi peoples.' },
    { art: ['courtier'], who: 'mithu',
      text: 'He lived about twenty-five years — fewer than many people spend deciding what to do. Remember the title his own people gave him, which no government ever could: Dharti Aba. Father of the Earth.' }
  ],
  moral: 'Standing up for your people\'s home can outlive you — and outvote the ones who stopped you.',
  source: 'K. S. Singh, "Birsa Munda and His Movement, 1874–1901" (the standard scholarly study); the Chotanagpur Tenancy Act of 1908 protecting Adivasi land; Jharkhand statehood on 15 November 2000, Birsa\'s birth anniversary, now observed nationally as Janjatiya Gaurav Divas; his portrait hangs in Parliament\'s Central Hall. The violence of the Ulgulan\'s suppression is deliberately kept offstage for this age band. needs_review: colonial-era conflict requires named human review before publish (docs/05 §6).'
},

{
  id: 'fk.sarhul-flowers',
  collection: 'desh-east',
  badge: 'aaj',
  title: 'When the Sal Trees Bloom',
  hook: 'In Jharkhand, the new year does not arrive by calendar. It arrives by flower — and the whole state can smell it coming.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['फूल', 'phool', 'flower'], ['वसंत', 'vasant', 'spring'], ['धन्यवाद', 'dhanyavaad', 'thanks']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Every spring, the sal forests of Jharkhand do something quietly spectacular: the great trees flower — small, cream-pale blossoms by the million, and a honeyed scent that drifts for miles. And when the sal blooms, the Adivasi new year has arrived. The festival is called Sarhul: the worship of the sal.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'It is kept, in their own ways, by many peoples of the plateau — the Oraon, the Munda, the Ho and others keep Sarhul, and the Santhals keep their own flower festival, Baha, in the same blossoming season. Different songs, different steps, one shared idea: the year begins when the trees say so.' },
    { art: ['guard'], who: null,
      text: 'The festival goes to the sacred grove first. The village priest — the pahan — keeps the rites there on behalf of everyone, with offerings and prayers for good rains and a good year; in many villages the pahan reads the signs from vessels of water, and the village listens to what the water promises about the monsoon.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'Then the grove\'s blessing comes home. Sal blossoms are carried from the grove and set with honour on doorways and in houses — the priest and elders bringing flowers to every family, so that every roof in the village wears a piece of the forest\'s spring. Drums begin. Lines of dancers form. It goes on into the night, and nobody is in a hurry for it to stop.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'There is one custom inside Sarhul worth thinking about slowly. Until the festival is kept — until thanks are given — many families will not eat the new season\'s first fruits and flowers of the forest.',
      ask: {
        q: 'Why wait for a thank-you before eating the first new fruits of the year?',
        options: ['The fruit is not ripe before the festival', 'Because saying thanks FIRST remembers that the forest gives — that food is received, not just grabbed', 'It is only about parties'],
        answer: 1,
        right: 'Gratitude first, feast second. It is the same order as folding your hands before a meal — the receiving is remembered before the eating begins.',
        wrong: 'It is about the order of things: thanks first, feast second. Eating only after the festival remembers that the forest gives — that food is received, not just grabbed.'
      } },
    { art: ['guard'], who: null,
      text: 'In Ranchi, Sarhul has grown into one of the great sights of the city: processions from every neighbourhood, rivers of dancers and drummers in white saris bordered with red, sal blossoms everywhere, the whole capital walking and singing. Schools close. The plateau celebrates itself.' },
    { art: ['courtier'], who: null,
      text: 'And through it all stand the trees that started it — the sal, the tree of the plateau, giver of leaf-plates and resin and shade and timber and this one week of perfume. The festival is, at its heart, a whole people turning to a forest and saying, formally and with drums: we noticed. Thank you. Again this year.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Whatever your family\'s spring festival is — Sarhul, Baha, Holi, Easter, Navroz, Bihu — ask what it says thank you FOR. Every spring festival is a thank-you note. The addresses differ; the letter is the same.' }
  ],
  moral: 'Begin the year with a thank-you, and everything eaten after it tastes like a gift.',
  source: 'Sarhul, the spring festival of the Oraon, Munda, Ho and other Adivasi communities of Jharkhand, and the Santhal Baha festival in the same season — the sal blossoms, the pahan\'s rites in the sacred grove, the flower-bearing to homes, first-fruits restraint until the festival, and Ranchi\'s great processions are all real and current. Details vary by community and village; ask a family how theirs keeps it.'
},

/* EAST-CHUNK-4 */
];
