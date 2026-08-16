/* Bizzing India — west & central story content (fourth tranche).

   Same shape as data-stories.js, data-stories-regional.js and data-stories-more.js,
   on its own globals so all four sets can be loaded and merged independently.

   This tranche exists to light two territories that had nothing at all — Dadra &
   Nagar Haveli and Daman & Diu — and to fill the west and the centre: Goa,
   Maharashtra, Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh.

   Badges (docs/05): most objects are 'katha' — a story as it is told. A handful are
   'aaj' — how something lives today, told truthfully. Four are 'itihaas' — real
   people (Jijabai and Shivaji, Tansen, Amrita Devi, Teejan Bai), told from
   well-attested tradition only, with the source line saying honestly what is record
   and what is tradition. No dates are invented anywhere; where a community keeps a
   date, the source says whose date it is.

   Adivasi and community traditions here — Warli, Dhodia, Kokna, Koli, Machhi,
   Kharvi, Maldhari, Kharva, Bishnoi, Raika, Charan, Gond, Muria, Agaria, Pardhi —
   are told from the inside and credited by name, exactly as every other tradition
   in this app is. Where a tale is a NEW telling composed for this app around a real
   place or a real practice (a lighthouse, a fort cat, a singing waterfall), the
   source line says so plainly rather than dressing it up as a collected tale.

   Softening note (docs/05, and the age band): the Khejarli story of Amrita Devi is
   about protection; the cost is stated in a single clause, offstage, and the object
   is flagged needs_review for a human editor before it ships.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is said / told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_WEST = [

/* ======================================= DADRA & NAGAR HAVELI ============ */
{
  id: 'fk.warli-chauk',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Painting Made of Rice',
  hook: 'White paint on a warm mud wall — and the paint is made of rice. Every wedding in the village starts with a square.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['चावल', 'chaawal', 'rice'], ['दीवार', 'deewar', 'wall'], ['शादी', 'shaadi', 'wedding']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In the green hills of Dadra and Nagar Haveli, where the Warli people have lived for longer than anyone can count, the houses are made of mud and bamboo, and the walls are the colour of the earth they stand on. And on those walls, the Warli paint.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'Not with shop paint. With rice. Rice ground to powder, mixed with water into a white paste, put on with a chewed bamboo twig for a brush. White rice pictures on a red-brown wall — people, trees, birds, whole villages, all made of circles and triangles and lines.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: 'A visitor once asked a Warli grandmother why the pictures were so simple. She looked at him for a while. "A circle is the sun and the moon," she said. "A triangle is a mountain and a tree. What else is there? You tell me one thing that is not in my painting."' },
    { art: ['courtier'], who: null,
      text: 'The most important painting of all is the chauk — the square. When there is a wedding, the married women of the family paint a big square on the wall, and inside it goes Palaghata, the goddess of the marriage, and around her the whole world: the sun, the comb, the ladder, the people.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'And here is the question children ask when they first watch it being done. The family will spend money on the wedding — on clothes, on food, on everything. So why is the most important picture in the whole house painted with plain rice?',
      ask: {
        q: 'Why paint the wedding square with rice paste instead of something costly and golden?',
        options: ['Rice is all they could find', 'Rice is the real wealth — it is what feeds everyone', 'Gold paint would not stick to mud'],
        answer: 1,
        right: 'That is it exactly. Rice is life. Painting with it says: may this house always have enough.',
        wrong: 'The Warli would smile at that. Rice is the real treasure — it is what feeds the family. Painting with rice says: may this house always have enough.'
      } },
    { art: ['guard'], who: null,
      text: 'The paintings are not signed and they are not sold off the wall. When the wall is mended, the painting goes, and a new one is made for the next wedding, the next harvest. The picture is not the point. The making of it, together, is the point.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'These days Warli painting is famous far beyond the hills — on cloth, in galleries, in faraway cities. And Warli artists will tell you, politely but firmly: it is not a pattern, it is ours. It has a home, and the home has a name.' },
    { art: ['courtier'], who: 'mithu',
      text: 'So if you ever draw those little triangle people holding hands — and you should, it is a lovely way to draw — say where it comes from. Say: this is Warli, from the hills where Gujarat and Maharashtra meet, and Dadra and Nagar Haveli in between.' }
  ],
  moral: 'The most precious paint is the one that feeds you.',
  source: 'The Warli painting tradition of Dadra & Nagar Haveli and the neighbouring hills — the rice-paste chauk, painted by the married women of the house, with Palaghata at its centre. A living tradition, credited to the Warli by name.'
},

{
  id: 'fk.warli-tarpa',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'Why the Dance Goes Round',
  hook: 'One long horn, played till the stars come out — and a whole village dancing in a coil around it, holding hands.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['नाच', 'naach', 'dance'], ['हाथ', 'haath', 'hand'], ['गोला', 'gola', 'circle']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'When the harvest is in, in the Warli villages of Dadra and Nagar Haveli, a man stands in an open place with a tarpa — a long horn made of dried gourds and bamboo, taller than the man himself. He fills his chest and begins to play, one endless winding note.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'And the village comes. Everyone — grandmothers, farmers, children who can barely walk — takes the hand of the next person, and the line begins to move around the tarpa player. Round, and round, coiling in and uncoiling out, like a creeper growing.' },
    { art: ['courtier'], who: 'courtier',
      text: 'A boy once asked his grandfather, "Why in a circle? In the town they dance facing the front, where everyone can see them." His grandfather kept dancing, because you can talk and dance at the same time if the dance is kind. "Look at the line, and tell me who is first in it," he said.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'The boy looked. The line curled round and round the tarpa player. The end held hands with the middle, the middle with the beginning.',
      ask: {
        q: 'Who is first in a dance that goes in a circle?',
        options: ['The best dancer', 'The one nearest the tarpa', 'Nobody — a circle has no front'],
        answer: 2,
        right: '"Exactly," said his grandfather. "No first, no last. Nobody wins the tarpa dance. That is why everyone comes."',
        wrong: 'The boy guessed that too. "Look again," said his grandfather. "A circle has no front and no back. No first, no last. Nobody wins the tarpa dance. That is why everyone comes."'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'It is the same circle the Warli paint on their walls: the ring of little joined figures, hand in hand, going round. When you see that painting, you are looking at this dance. The wall remembers what the feet did.' },
    { art: ['courtier', 'guard'], who: 'guard',
      text: 'The tarpa player stands in the middle and cannot stop, because the moment the horn stops the dance stops, so he plays until his breath is done and another player slides in and takes over without a gap — the way you pass a full bowl carefully, so nothing spills.' },
    { art: ['courtier'], who: null,
      text: 'They dance for the harvest, and for the gods of the green, and because it is the time of year for it. And a child who joins the line learns the whole thing without one lesson — the steps travel down the line, hand to hand, into their feet.' },
    { art: ['courtier'], who: 'mithu',
      text: 'That is the oldest school there is: hold hands, keep up, go round. Ask your family if they know a circle dance — many parts of India have one, and each one is its own.' }
  ],
  moral: 'In a circle, nobody is first and nobody is last — which is the whole idea.',
  source: 'The tarpa dance of the Warli of Dadra & Nagar Haveli and the surrounding hills — the gourd-and-bamboo horn, the joined-hands coiling line, and the painted circle of dancers on Warli walls. A living tradition, credited to the Warli by name.'
},

{
  id: 'fk.waghoba-watch',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Tiger Who Keeps Watch',
  hook: 'At the edge of the village stands a carved wooden tiger. Nobody is afraid of him. He is the watchman.',
  hero: 'pt_lion',
  cast: ['pt_lion', 'courtier'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['बाघ', 'baagh', 'tiger'], ['जंगल', 'jangal', 'forest'], ['रखवाला', 'rakhwala', 'guardian']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Where the fields of a Warli or Kokna village end and the forest of Dadra and Nagar Haveli begins, there is often a small shrine — a carved wooden post, or a painted stone, with a tiger on it. His name is Waghoba, and the first thing to understand is that he is not the enemy.' },
    { art: ['pt_lion'], who: null,
      text: 'Waghoba is the tiger god, the big one, the lord of everything with paws and stripes. The forest is his house. The village is the people\'s house. And the shrine stands exactly on the doorstep between the two, because that is where a watchman stands.' },
    { art: ['courtier', 'pt_lion'], who: 'courtier',
      text: 'A girl once asked her grandmother, "Why do we give offerings to the tiger? Shouldn\'t we hide from him instead?" Her grandmother was arranging rice and a marigold at the shrine, and she did not hurry her answer.' },
    { art: ['courtier'], who: 'courtier',
      text: '"When your uncle visits," she said, "we feed him and speak to him with respect, and so he is family and not a stranger. It is the same with the forest. Waghoba is our biggest neighbour. You do not hide from a neighbour. You greet him properly, and then you both know how to behave."' },
    { art: ['pt_lion'], who: null, mood: 'think',
      text: 'And when a real leopard or a tiger passed near the village in the night — a pug mark by the stream, a goat looked at but not taken — the old people would nod and say: Waghoba walked his round.',
      ask: {
        q: 'A tiger passed by in the night and took nothing. What do the old people say?',
        options: ['We were lucky', 'Waghoba walked his round, checking on us', 'The tiger was not hungry'],
        answer: 1,
        right: 'That is how it is said. The watchman went past on his rounds — and everything was found in order.',
        wrong: 'Maybe — but that is not how it is said. The old people say: Waghoba walked his round. The watchman went past, and found everything in order.'
      } },
    { art: ['courtier', 'pt_lion'], who: null,
      text: 'At harvest time the village goes to the shrine together. The offerings are simple — rice, a coconut, a daub of red — and the asking is simple too: keep to your side, we will keep to ours, and let neither house trouble the other.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'Scientists who study big cats in these hills have noticed something worth noticing: villages that keep Waghoba\'s shrine tend to speak of leopards with respect instead of panic. The old agreement still works, both ways.' },
    { art: ['pt_lion'], who: 'mithu',
      text: 'A god with stripes, whose job is to keep the peace between two houses. Not a monster. A neighbour, and a watchman, and very much senior to everybody.' }
  ],
  moral: 'Respect is the oldest fence, and the only one a tiger honours.',
  source: 'Waghoba, the tiger deity honoured by the Warli and Kokna communities of Dadra & Nagar Haveli and the hills around — the boundary shrines, the harvest offerings, and the living practice of speaking of the big cats with respect. Credited to those communities by name.'
},

{
  id: 'fk.kansari-grain',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'Kansari and the Last Handful',
  hook: 'Grandmother picks up every single spilled grain of rice, every time. There is a reason, and the reason has a name.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['अनाज', 'anaaj', 'grain'], ['माँ', 'maa', 'mother'], ['भूख', 'bhookh', 'hunger']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In the Warli and Dhodia villages of Dadra and Nagar Haveli, the rice is not just food. Inside the grain lives Kansari — the grain mother, the one who feeds everybody. Which means a pot of rice is never only a pot of rice. It is a house with somebody in it.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'A girl was helping her grandmother carry rice to the cooking fire when the basket tipped, and a small white spray of grains went into the dust. She was going to sweep them out of the door. Her grandmother caught her hand.' },
    { art: ['guard'], who: 'guard',
      text: '"Pick them up," said her grandmother. "Every one." And she got down on her knees, old as she was, and began picking grains out of the dust with her fingertips, one by one, as carefully as if they were beads from a necklace.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: '"Aaji, it is only a handful," said the girl. "We have a whole basket." Her grandmother sat back and looked at her, and the girl understood that she had said something important without knowing what.',
      ask: {
        q: 'Why does one spilled handful matter when the basket is full?',
        options: ['Because rice costs money', 'Because Kansari lives in every grain, not just the full baskets', 'Because the floor gets dirty'],
        answer: 1,
        right: '"Kansari is in the handful as much as in the harvest," said her grandmother. "Throw her in the dust, and why would she stay in your house?"',
        wrong: '"It is not about the money," said her grandmother. "Kansari is in the handful as much as in the harvest. Throw her in the dust, and why would she stay in your house?"'
      } },
    { art: ['courtier', 'guard'], who: 'guard',
      text: 'Then she told her the old understanding. Kansari the grain mother goes where she is honoured. In a house where rice is wasted, thrown about, left to spoil, she quietly gathers her skirts and leaves — and a house she has left is a house that will know hunger.' },
    { art: ['courtier'], who: null,
      text: 'But in a house where every grain is treated as a guest — gathered up, stored dry, cooked with attention, shared without grudging — Kansari settles in like a grandmother by the fire, and the pot in that house somehow always stretches to one more person.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'When the harvest comes in, the villages honour her properly — the first of the new grain is hers before anyone else eats. Not because she is fierce. Because she is the mother, and the mother is served first.' },
    { art: ['guard'], who: 'mithu',
      text: 'The girl grew up and picked up spilled grains all her life, kneeling down for a single one, and her own grandchildren asked her why. Which is exactly how Kansari likes the story to be passed on.' }
  ],
  moral: 'Treat every grain as a guest, and your house will never feel empty.',
  source: 'Kansari, the grain mother honoured by the Warli and Dhodia communities of Dadra & Nagar Haveli — the first-grain offering and the teaching that grain is never wasted. The household telling here follows that living tradition; wordings differ from family to family.'
},

{
  id: 'fk.damanganga-winds',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The River That Would Not Hurry',
  hook: 'The sea is not far, as the crow flies. So why does the river take the long way — bending and bending through every village?',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'courtier'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['नदी', 'nadi', 'river'], ['रास्ता', 'raasta', 'way'], ['धीरे', 'dheere', 'slowly']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'The Daman Ganga is born in the hills to the east, and she is bound for the sea at Daman — everyone knows that, even the river. What puzzles children is the map. The sea is not far. And yet the river bends, and bends, and bends again, looping through Dadra and Nagar Haveli as if she had all the time in the world.' },
    { art: ['pt_tortoise'], who: null,
      text: 'This is the story one grandfather told about it, sitting on the bank with his feet in the water, and he told it as if he had been there.' },
    { art: ['courtier', 'pt_tortoise'], who: 'courtier',
      text: 'When the river first came down from the hills, young and quick, she meant to run straight to the sea. But at the first village a farmer called out: "Sister! My fields are dry — could you come just a little this way?" And she thought, well, it is hardly out of my path, and she bent towards him.' },
    { art: ['pt_tortoise'], who: null,
      text: 'At the next village the buffaloes were standing in the heat with their tongues out, and she bent again. Then a grove of old mango trees. Then a washing stone. Then a fishing village that would have no fish without her. Each time only a little bend. Only a little.' },
    { art: ['pt_tortoise'], who: null, mood: 'think',
      text: 'And the sea, waiting at Daman, sent a wave up the sand to ask: what is keeping you?',
      ask: {
        q: 'The river could run straight and arrive quickly. What should she tell the sea?',
        options: ['Sorry — I will straighten out and hurry', 'I am coming — but I am coming the way that fills everyone\'s pots', 'I have decided not to come at all'],
        answer: 1,
        right: 'That is what she said. "You will get every drop in the end. But I will not pass a thirsty village to reach you sooner."',
        wrong: 'She did not apologise and she did not stop. She said: "You will get every drop in the end. But I will not pass a thirsty village to reach you sooner."'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'So the map is the story. Every bend in the Daman Ganga is a place where somebody once called out and the river answered. The straight path was there all along. She chose the useful one.' },
    { art: ['courtier', 'pt_tortoise'], who: null,
      text: 'And it is true today in the plainest way: the river\'s water works for the fields, the villages and the towns of this small green territory before one drop of it reaches the sea. Ask anyone who farms beside her.' },
    { art: ['pt_tortoise'], who: 'mithu',
      text: 'People who rush past everyone arrive quickly, and arrive alone. The Daman Ganga arrives at the sea trailing the thanks of every village she bent for.' }
  ],
  moral: 'The long way that helps everyone beats the short way that helps no one.',
  source: 'A new telling composed for this app around the real Daman Ganga, which winds through Dadra & Nagar Haveli to the sea at Daman and waters the villages along her way. Told in the riverbank manner of the valley; not a collected tale, and the source says so honestly.'
},

{
  id: 'fk.kokna-honey',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'Half for the Bees',
  hook: 'High in the tree hangs a comb full of honey. The boy wants all of it. His uncle takes out his knife — and cuts exactly half.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['शहद', 'shahad', 'honey'], ['मधुमक्खी', 'madhumakkhi', 'bee'], ['आधा', 'aadha', 'half']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'The Kokna people of Dadra and Nagar Haveli have always known the forest the way you know your own kitchen — which tree gives what, and when, and how much. And of everything the forest gives, the sweetest is honey, hanging in great combs high in the old trees.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'A boy went honey-gathering with his uncle for the first time. They went early, with smoke to make the bees sleepy and a basket lined with leaves, and his uncle climbed like a man who had done it a hundred times, because he had.' },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      text: 'The comb was enormous — golden, heavy, big as a winnowing tray. The boy\'s mouth watered all the way from the ground. "Take it all, kaka!" he called up. "Look at the size of it!"' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'His uncle looked at the comb for a moment. Then he took out his knife and cut — not the whole comb. Half. He left the other half hanging where it was, bees and all, and came down.',
      ask: {
        q: 'The whole comb was right there in his hand. Why take only half?',
        options: ['Half was all the basket could hold', 'The other half is the bees\' — leave it, and there will be honey next year too', 'He was afraid of the bees'],
        answer: 1,
        right: '"The honey is theirs," said his uncle. "We are guests taking a share. Take it all, and the hive dies — and then who makes honey for anybody?"',
        wrong: 'The basket had plenty of room, and his uncle had climbed to those bees for thirty years without fear. "The honey is theirs," he said. "Take it all, and the hive dies — and then who makes honey for anybody?"'
      } },
    { art: ['guard', 'courtier'], who: 'guard',
      text: 'On the walk home his uncle showed him the rest of it. The queen\'s part of the comb, never touched. The season when you do not gather at all, because the bees are building. The tree you skip this year because you took from it last year.' },
    { art: ['courtier'], who: 'courtier',
      text: '"Who taught you all the rules?" asked the boy. "My uncle," said his uncle. "And him, his uncle. Nobody remembers who was first. The forest taught the first one, probably — by going empty on somebody who was greedy."' },
    { art: ['guard'], who: null,
      text: 'And the proof of the rules walks about in the forest to this day: the Kokna have gathered honey from these hills for generations beyond counting, and the hills still hum with bees. Both things are true at once. That is the whole trick of it.' },
    { art: ['guard'], who: 'mithu',
      text: 'Take half, leave half. It works for honey. It works, if you think about it, for nearly everything.' }
  ],
  moral: 'Take a share, never the whole — that is how there is always more.',
  source: 'The forest ethic of the Kokna and neighbouring Adivasi communities of Dadra & Nagar Haveli — take a share and leave the hive living — is real and long-practised. This particular uncle-and-nephew telling is composed for this app around that practice, and the source says so honestly.'
},

{
  id: 'fk.dhodia-road',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Road the Grandmothers Remember',
  hook: 'Ask a Dhodia grandmother where the family is from, and she will not name the village you were born in. She will name a road.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['सफ़र', 'safar', 'journey'], ['घर', 'ghar', 'home'], ['याद', 'yaad', 'memory']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'The Dhodia people live today across Dadra and Nagar Haveli and the country round it — farmers, mostly, settled and rooted. But their own tellings remember something older: that once, long ago, the people came from somewhere else, walking, from the hill country away to the north and east.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'A girl sat with her grandmother at a family gathering, the kind where the old people talk late, and asked the question children always ask sooner or later: "Aaji, where are we from?"' },
    { art: ['guard'], who: 'guard',
      text: 'Her grandmother did not say the name of their village, though they had lived in it for four generations. She said, "We came. The old people walked, with their seed-grain tied up safe and their gods carried carefully, and they crossed the rivers, and they came down into this green country, and it was good, and they stayed."' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: '"But that was so long ago," said the girl. "Before your grandmother\'s grandmother. Why do we still tell it? Nobody remembers the actual road."',
      ask: {
        q: 'Nobody living has seen the old road. Why keep telling the story of the journey?',
        options: ['In case they ever have to go back', 'Because a people that remembers arriving remembers that home is something you make', 'Because old people like old stories'],
        answer: 1,
        right: 'Her grandmother nodded slowly. "We made this home once, out of walking and work. Remember that, and you will never be afraid of a new beginning."',
        wrong: '"Not to go back," said her grandmother. "We made this home once, out of walking and work. Remember that, and you will never be afraid of a new beginning."'
      } },
    { art: ['guard', 'courtier'], who: null,
      text: 'Then the grandmother counted off, on her fingers, what the old people had carried on the road: seed for planting. The names of their gods. The songs. The way of doing weddings. "Everything that mattered," she said, "fit in their hands and their heads. Notice that."' },
    { art: ['courtier'], who: null,
      text: 'The girl looked around the gathering — the food, the talk, the little ones asleep in laps — and understood that she was sitting inside everything the walkers had carried. The road had ended generations ago. The luggage was still being used every day.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'Many peoples of India carry a journey-memory like this one, each their own. It is a particular kind of treasure: a story that says, we were travellers once, and look — we built all this.' },
    { art: ['guard'], who: 'mithu',
      text: 'Ask your own family where they came from, and how, and what they carried. Every family has a road in it somewhere. Most have several.' }
  ],
  moral: 'Home is not where you happen to be — it is what your people built, and the story of the building is yours to keep.',
  source: 'The Dhodia community of Dadra & Nagar Haveli and the surrounding country keep an oral memory of having come long ago from hill country to the north-east; tellings differ from family to family, and this one is a household framing of that remembered journey, credited to the Dhodia by name.'
},

{
  id: 'fk.hirwa-green',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'Hirwa of the Green',
  hook: 'There is a god whose whole job is the colour green. In June, everybody in the hills is waiting for him.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['हरा', 'hara', 'green'], ['बारिश', 'baarish', 'rain'], ['खेत', 'khet', 'field']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'By the end of May, in the hills of Dadra and Nagar Haveli, everything is brown. The fields are cut stubble, the streams are stones, the big trees stand dusty, and the heat lies on the land like a sleeping buffalo. It is hard, in May, to believe in green at all.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'But the Warli know whose month is coming. Among their gods is Hirwa — the green one, the god of growing things, of the sprouting seed and the leafing tree and everything the rain wakes up. The brown months are simply Hirwa away on a journey.' },
    { art: ['courtier'], who: 'courtier',
      text: 'A boy asked his father, in the worst of the heat, "What if he does not come back this year?" His father was mending the plough, getting ready, which is itself a kind of answer. "He has come back every year since the first year," he said. "But it is right to ask him properly, all the same."' },
    { art: ['guard'], who: null,
      text: 'So before the sowing, the village honours Hirwa and the gods of the place — with rice, with a fowl or a coconut, with the old words said by the old man who knows them — and asks plainly for what farmers everywhere ask: rain enough, and not too much, and the green to come up strong.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'And then one day the sky goes the colour of iron, and the wind turns and smells of wet earth arriving from far away.',
      ask: {
        q: 'The first fat drops are about to fall on the dust. What happens to the hills now?',
        options: ['Nothing changes for weeks', 'Hirwa comes home — and the whole country turns green almost overnight', 'Only the river fills up'],
        answer: 1,
        right: 'Anyone who has seen a Konkan June knows it. Within days the brown is gone as if it was never there. The green does not creep in. It arrives.',
        wrong: 'Much faster and much bigger than that. Within days the brown hills are green to the very tops. In these parts the green does not creep in. It arrives.'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'Grass on the bunds. Leaves on the dusty trees. Rice seedlings in the flooded fields like green flame. Frogs shouting all night as if they had invented water. The whole territory, one of the smallest in India, becomes one of the greenest places you will ever see.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'And in the Warli paintings on the mud walls, the god of all this is there among the others — because a people who live by the rain and the seed know exactly which god they cannot do without.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Next time you see the first real rain of the year hit dry ground, watch the earth drink. Somewhere in the hills above the Daman Ganga, they would tell you: that is Hirwa, home again.' }
  ],
  moral: 'The green always comes back — and the people who depend on it have never once taken it for granted.',
  source: 'Hirwa, the green god of growing things in the Warli pantheon, honoured before the sowing in Dadra & Nagar Haveli and the hills around; the monsoon transformation of the territory is plain fact. Credited to the Warli by name; household wordings differ.'
},

/* ============================================== DAMAN & DIU ============== */
{
  id: 'fk.diu-hokka',
  collection: 'coast-forest',
  badge: 'aaj',
  title: 'The Trees That Crossed the Sea',
  hook: 'On the island of Diu grow fat, upside-down-looking trees whose family lives in Africa. How does a tree cross an ocean?',
  hero: 'pt_elephant',
  cast: ['pt_elephant', 'courtier'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['पेड़', 'ped', 'tree'], ['समुद्र', 'samudra', 'sea'], ['बीज', 'beej', 'seed']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Walk around the little island of Diu and sooner or later you will stop and stare at a tree. It is enormously fat — the trunk like a grey water-tank — with stubby branches on top, as if somebody had pulled it up and planted it upside down. In Diu they call it the hokka tree.' },
    { art: ['pt_elephant'], who: null, mood: 'wow',
      text: 'Here is the strange part. This tree is a baobab — and the baobab\'s family home is Africa, an ocean away. Its cousins stand on the African plains where elephants scratch against them. There are only a handful in all of India. And Diu, this one small island, has a whole scatter of them.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'So every child in Diu eventually asks the excellent question: trees cannot swim, and they certainly cannot buy a boat ticket. How did the hokka get here?',
      ask: {
        q: 'How does an African tree end up growing on an Indian island?',
        options: ['Its seeds floated across the whole ocean by themselves', 'People carried it — sailors and traders crossing the sea long ago', 'Birds flew it across'],
        answer: 1,
        right: 'That is what the trees remember for us. Ships, sailors, and seeds in somebody\'s bundle — the sea road between Africa and India is very, very old.',
        wrong: 'The ocean is too big for a floating seed and too far for a bird with a heavy pod. It was people. Ships, sailors, and seeds in somebody\'s bundle, on the old sea road between Africa and India.'
      } },
    { art: ['courtier'], who: null,
      text: 'For many hundreds of years, ships have gone back and forth between India\'s west coast and the coast of Africa — trading cloth, dates, timber, everything. In the years when Diu was a great port, and later a Portuguese one, sailors from many coasts walked its lanes. Somebody, sometime, planted a seed from home.' },
    { art: ['pt_elephant'], who: null,
      text: 'The baobab is a good traveller\'s tree. It stores water in that fat trunk, shrugs off salt wind and drought, and lives longer than anyone can properly measure. Plant one on a dry little island in the sea and it says: this will do nicely.' },
    { art: ['courtier', 'pt_elephant'], who: null, mood: 'wow',
      text: 'So the hokka trees of Diu are living harbour records. Every one of them says: ships came here from far away, and people came with the ships, and some of what they carried put down roots. You can read it without opening a single book — just stand under the tree and look up.' },
    { art: ['courtier'], who: null,
      text: 'The people of Diu use the fruit, rest in the shade, and point the trees out to visitors with a certain owner\'s pride. The tree that crossed the sea is a Diu-wallah now, generations deep — which is, when you think about it, the story of every port town in the world.' },
    { art: ['pt_elephant'], who: 'mithu',
      text: 'A port keeps gifts from every sea it has ever touched. Some are in the museum. The best ones are alive, and still making shade.' }
  ],
  moral: 'Look closely at what grows in a place, and it will tell you who has visited.',
  source: 'The baobabs of Diu — locally called hokka — are real and much loved, a living trace of the old Indian Ocean trade between Africa and India\'s west coast through the port of Diu. How each tree arrived is not recorded; the sea road that brought them is well documented.'
},

{
  id: 'fk.daman-lighthouse',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Keeper of the Small Light',
  hook: 'Every evening, one old man climbed one dark stair to light one small lamp. The whole sea depended on it.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['रोशनी', 'roshni', 'light'], ['किनारा', 'kinara', 'shore'], ['भरोसा', 'bharosa', 'trust']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'Where the Daman Ganga meets the sea, the old fort of Nani Daman stands over the fishing harbour, and above its wall rises a lighthouse. This is a tale told about a keeper of that light, in the years when Daman was a Portuguese town and the lamp burned oil, not electricity.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'He was an old man, and the stair was steep, and he climbed it every single evening of his life — up into the lamp room, trim the wick, polish the glass, light the flame. Then he would look out at the darkening sea and say, in the way of the town, "Boa noite" — good night, in Portuguese — to every boat still out.' },
    { art: ['courtier'], who: 'courtier',
      text: 'His grandson climbed with him sometimes, counting the steps and complaining about most of them. "It is such a small lamp," the boy said one evening. "The sea is so big. What difference can it make?"' },
    { art: ['guard'], who: 'guard', mood: 'think',
      text: 'The keeper hung the lamp and watched it steady. "The sea does not need a big light," he said. "It needs a light that is always there. Ask any fisherman which he would rather have — a bonfire sometimes, or a candle every night, always in the same place."',
      ask: {
        q: 'Which light is worth more to a boat coming home in the dark?',
        options: ['A huge bright fire that burns some nights', 'A small lamp that burns every night without fail, in the same place', 'They are worth the same'],
        answer: 1,
        right: 'Every sailor answers the same way. A light you can count on is a place on the map. A light that comes and goes is worse than none.',
        wrong: 'Ask the fishermen at Nani Daman. A small light that never fails is a place on the map — you steer home by it. A big light that comes and goes is worse than none.'
      } },
    { art: ['courtier', 'guard'], who: null,
      text: 'One monsoon night the wind came in hard and sideways, and the fishing fleet was still out. The keeper climbed the stair three times that night to keep the flame alive in the rattling lamp room, cupping it with his own hands when the draught found it.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'And out on the black water, boat by boat, the fishermen of Daman found the one steady point in a whole world of moving dark, and lined their bows on it, and came in past the fort wall into the calm of the river — soaked, bailing, and alive.' },
    { art: ['guard', 'courtier'], who: 'courtier',
      text: 'Nobody cheered the keeper. Hardly anyone knew to. He put out the lamp at dawn as always, said "Bom dia" — good morning — to the harbour, and went down the long stair to his tea. The boats were in. The light had done its work. That was the whole of it.' },
    { art: ['guard'], who: 'mithu',
      text: 'The lighthouse still stands over Nani Daman, and lights still burn on that coast every night, tended by people whose names the boats never learn. Somebody keeps every light you steer by. It is worth remembering.' }
  ],
  moral: 'Be the small light that never fails, not the big one that sometimes does.',
  source: 'The fort of Nani Daman and its lighthouse over the fishing harbour are real, as is Daman\'s Portuguese-era history. This keeper\'s tale is a new telling composed for this app in the manner of the coast\'s stories, and the source says so honestly rather than inventing a collector.'
},

{
  id: 'fk.nagoa-shankh',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Shell That Called the Boats',
  hook: 'Before there were phones, before there were sirens, the beach at Nagoa had a way to call every boat home: one boy and one enormous shell.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['शंख', 'shankh', 'conch shell'], ['आवाज़', 'awaaz', 'sound'], ['तूफ़ान', 'toofan', 'storm']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'The bay at Nagoa, on the island of Diu, curves like a moon, and the fishing families have worked it for as long as anyone\'s grandmother\'s grandmother could say. The sea gives fish, and shells — and once in a long while, it gives a great conch, a shankh, big as a baby\'s head.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'A boy found one after a storm, half buried at the tideline, and carried it home with both arms. His grandfather turned it over once and nodded. "That is not a toy," he said. "That is a voice. Bring it here and I will show you."' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'The old man put the shell to his lips and blew — and out of it came a sound the boy felt in his chest before he heard it in his ears. Deep, round, enormous. It rolled out over the bay the way thunder rolls, and every head on the beach came up at once.' },
    { art: ['guard'], who: 'guard',
      text: '"When I was young, this was the beach\'s voice," said his grandfather. "One long blast: come in, weather is turning. Two: all safe, all counted. A shell can be heard past the reef when a shout dies at the surf line. The sea taught us that trick, and gave us the instrument too."' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'So the boy practised — red-faced, dizzy, producing mostly duck noises — until one afternoon the real sound came out of the shell, and startled him more than anyone. And then came a day, late in the season, when the sky to the west went a bad green-grey and the boats were all out.',
      ask: {
        q: 'The weather is turning fast and the boats are beyond the reef. What must the boy do?',
        options: ['Run along the beach shouting', 'Blow one long blast, and keep blowing it', 'Wait for the boats to notice the sky themselves'],
        answer: 1,
        right: 'One long blast, again and again — the old signal. His grandfather counted the boats in as they came.',
        wrong: 'Shouting dies at the surf, and the sky can hide behind a sail. He blew the shell — one long blast, again and again — and his grandfather counted the boats in.'
      } },
    { art: ['courtier', 'guard'], who: null,
      text: 'The boats heard it past the reef, and turned, and came in through the chop with the first squall chasing them, and the last one crossed into the calm as the rain arrived like a wall. Two short blasts then, though nobody could hear them in the downpour: all safe. All counted.' },
    { art: ['guard'], who: null,
      text: 'The boy kept that shankh all his life, on a shelf where the salt air could reach it, and blew it on festival days when it was a temple sound and a happy one. But he kept it polished the way you keep a working tool, because he knew what else it was.' },
    { art: ['courtier'], who: 'mithu',
      text: 'These days the weather report comes to a phone in the boat. But if you hold a big shell to your ear, they say you hear the sea — and if you learn to blow one, remember: you are holding the beach\'s oldest loudspeaker.' }
  ],
  moral: 'The best tools are the ones the sea itself hands you — if you learn to use them.',
  source: 'Nagoa bay and its fishing families are real, and the conch as signal and temple voice is an old coastal practice. This particular boy-and-shell telling is composed for this app in the Koli fisher manner of the coast, and the source says so honestly.'
},

{
  id: 'fk.diu-fort-cat',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Cat of the Sea Fort',
  hook: 'The great fort of Diu has walls, cannons and a lighthouse. It also has a cat, and the cat believes she outranks everybody.',
  hero: 'pt_mouse',
  cast: ['pt_mouse', 'guard'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['किला', 'qila', 'fort'], ['बिल्ली', 'billi', 'cat'], ['पहरा', 'pehra', 'guard duty']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'The sea fort of Diu is nearly five hundred years old — built in the days of the Portuguese, with walls like cliffs, a moat cut from rock, and old cannons still lying about like sleeping crocodiles. Ships once feared it. Schoolchildren now picnic in it. And a cat runs it.' },
    { art: ['pt_mouse', 'guard'], who: null,
      text: 'There has always been a fort cat — that is the story the caretakers tell. In the old days the fort kept storerooms of grain and gunpowder, and where there is stored grain there are rats, and where there are rats, a cat is not a pet. A cat is staff.' },
    { art: ['guard'], who: 'guard',
      text: 'The soldiers of long ago fed the first fort cat from their own rations, the tale goes, because she was worth ten of them at her particular job. No rat chewed the sacks on her watch. She patrolled the walls at night like a small striped sergeant, and everything squeaky kept its distance.' },
    { art: ['pt_mouse'], who: null, mood: 'think',
      text: 'The soldiers are centuries gone. The grain stores are empty rooms where swallows nest. But go to the fort today and, likely as not, a cat is there — asleep on a cannon the sun has warmed, one ear turning to follow you like a radar.',
      ask: {
        q: 'The rats and the grain are long gone. Why does the fort still suit a cat so well?',
        options: ['Cats like history', 'Warm stones, high walls, fish from the harbour, and nobody telling her what to do', 'She is waiting for the soldiers to come back'],
        answer: 1,
        right: 'A fort is simply a palace, if you are a cat. Sun-warmed stone, walls to walk, the harbour smell of fish on the wind, and total command of the garrison.',
        wrong: 'Nothing so sentimental. A fort is simply a palace, if you are a cat — warm stone, walls to walk, fish on the harbour wind, and total command of the garrison.'
      } },
    { art: ['pt_mouse', 'guard'], who: null,
      text: 'Visitors climb to the lighthouse at the fort\'s top for the view — the whole blue sweep of sea that the cannons once watched. The cat takes the same view from the wall, professionally, the way her ancestors watched the granary. Old habits, new centuries.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'Children who visit always find her, or she finds them — materialising beside a picnic with the timing of a customs officer. Feed her something and she accepts it graciously, as rent long owed. This is, after all, her fort. Records of any other owner are disputed.' },
    { art: ['pt_mouse'], who: null,
      text: 'And at closing time, when the last visitor crosses back over the old moat and the gate is shut, the fort returns to its true garrison: the swallows, the sea wind in the embrasures, and one cat on the wall, on watch, as the light goes gold.' },
    { art: ['guard'], who: 'mithu',
      text: 'Every grand old place has its small caretakers — the sparrows of the palace, the dog of the railway platform, the cat of the fort. The monuments belong to history. History, in turn, belongs to whoever actually lives there.' }
  ],
  moral: 'Grand places are kept alive by small, unofficial staff — and it is polite to acknowledge them.',
  source: 'The Portuguese-built sea fort of Diu, its moat, cannons and lighthouse, is real; forts everywhere kept cats for their granaries, and Diu\'s visitors will confirm the current management. This telling is composed for this app, warmly, and the source says so honestly.'
},

{
  id: 'fk.gangeshwar-tide',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Shrine the Sea Visits',
  hook: 'Most temples are washed by their priests. At this one, twice a day, the sea itself walks in and does it.',
  hero: 'shiva',
  cast: ['shiva', 'courtier'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['लहर', 'lehar', 'wave'], ['मंदिर', 'mandir', 'temple'], ['ज्वार', 'jwaar', 'tide']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'On the rocky shore of Diu, down among the tide pools where the land gives way to the sea, there is a small shrine called Gangeshwar. It has no tall tower and no great hall. It has five shivlings, set low in the rock — and it has the ocean for a priest.' },
    { art: ['shiva'], who: null,
      text: 'This is how the katha is told in Diu. Long ago, in their years of wandering, the five Pandava brothers came along this shore. They wished to worship Shiva, and there was no temple — so each brother set a shivling in the living rock, five together, at the edge of the sea.' },
    { art: ['courtier'], who: 'courtier',
      text: 'They chose the spot, the telling goes, with open eyes. Not safely up the beach. Down at the tideline, where the sea could reach. And when the tide came in and the first wave washed over the five lings, the brothers saw that it was exactly right, and went on their way content.' },
    { art: ['shiva'], who: null, mood: 'think',
      text: 'Because twice every day, without fail, the sea rises and comes hushing in over the rocks, and pours itself over the five shivlings, and drains away again — leaving them washed, gleaming, and garlanded with foam.',
      ask: {
        q: 'In a temple, pouring water over the shivling is the abhishek — the honouring bath. Who performs it at Gangeshwar?',
        options: ['The priests of Diu, at dawn', 'The tide — the sea itself does it, twice a day, and has never once missed', 'Pilgrims who carry seawater up in pots'],
        answer: 1,
        right: 'That is the wonder of the place. The ocean performs the abhishek — on time, twice a day, since the day the shrine was made.',
        wrong: 'People bring flowers and prayers — but the bath itself is the sea\'s duty. The tide performs the abhishek, twice a day, and has never once missed.'
      } },
    { art: ['courtier', 'shiva'], who: null, mood: 'wow',
      text: 'Pilgrims time their visit by the tide chart, which must make this one of the few temples anywhere with the moon for a timetable. At low tide you can sit close, hear the water breathe in the rocks, and touch the cool stone. At high tide, the sea asks you to step back and wait your turn.' },
    { art: ['courtier'], who: null,
      text: 'People leave flowers on the wet rock, and the next wave gathers them up and carries them out — which, at this shrine, does not feel like the offering being lost. It feels like the offering being accepted.' },
    { art: ['shiva'], who: null,
      text: 'Ganga, they say, lives in Shiva\'s hair — the great river caught in his locks as she fell from heaven. At Gangeshwar it is as if the story turned itself around, just here: the water comes to him, twice a day, respectful as a river bowing.' },
    { art: ['courtier'], who: 'mithu',
      text: 'In many families it is said the whole world worships in its own way — the birds by singing at dawn, the trees by flowering. In Diu they can show you the sea doing it. Ask your family what they think of that; it is a good conversation.' }
  ],
  moral: 'Holiness is not always behind high walls — sometimes it sits in the open, where the sea can reach it.',
  source: 'The Gangeshwar Mahadev shrine on the Diu shore, its five tide-washed shivlings, and the katha connecting them to the five Pandavas, as the tradition of the place tells it. A living shrine, told from the inside; the katha is presented as it is told.'
},

{
  id: 'fk.koli-stars',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Fisherman\'s Compass',
  hook: 'The shiny brass compass fell into the sea. The grandfather laughed — because the real compass was still aboard.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['तारा', 'taara', 'star'], ['हवा', 'hawa', 'wind'], ['दिशा', 'disha', 'direction']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'The fisher families of Daman — Koli and Machhi people, whose boats have worked this coast for generations past counting — put to sea long before anyone aboard owned an instrument. This is a tale in their manner, about a girl, her grandfather, and a very shiny compass.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'The girl had saved up for it at the market: brass, with a needle that swung like magic and a lid that clicked. She brought it aboard her grandfather\'s boat with enormous pride. Her grandfather admired it properly, the way grandfathers do, and put it carefully on the thwart.' },
    { art: ['courtier'], who: 'courtier',
      text: '"Now you can never be lost, dada," she said. Her grandfather looked at the sea and made the small sound old fishermen make, which can mean anything. "I have not been lost in sixty years," he said. "But it is a fine compass."' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'They were far out, past sight of the flat Daman shore, when a swell knocked the thwart and the compass went over the side — one gleam, and gone. The girl burst into tears. All her savings, and worse: now, she was sure, they were lost.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      text: 'Her grandfather pulled her in beside him at the tiller. "Lost? Look about you. The whole sea is a compass, if you know how to read the needle. Tell me — what do you see and feel, right now?"',
      ask: {
        q: 'No compass, no land in sight. What can still show a fisher family the way home?',
        options: ['Nothing — without the instrument you drift', 'The swell\'s direction, the wind, the birds\' evening flight, the sun and stars', 'Only luck'],
        answer: 1,
        right: '"Now you are reading it," said her grandfather. "The swell has run from the southwest all day. The birds go home to land at dusk. The sun sets over the open sea. Home is that way — and always was."',
        wrong: '"Drift? Luck?" Her grandfather snorted. "The swell has run from the southwest all day. The birds go home to land at dusk. The sun sets over the open sea. Read those, and home is that way — and always was."'
      } },
    { art: ['courtier', 'guard'], who: null,
      text: 'All the way in he showed her: how the swell bends as the water shallows, how the wind smells different off the land in the evening, how the first star hangs where it hung for his grandfather. The sky came out like a chart pricked in silver, and he named the stars fishermen steer by.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'They raised the lights of Daman exactly where he said they would be. "The shop compass is good," he said, tying up. "Buy another. But keep this one too" — he tapped her forehead — "wound up and working. Instruments fall in the sea. What you know floats."' },
    { art: ['guard'], who: 'mithu',
      text: 'She fished that coast all her life, with a compass aboard and a better one behind her eyes. Both matter. Only one of them can never be dropped.' }
  ],
  moral: 'Tools help, but knowing holds — learn the thing itself, not just the instrument.',
  source: 'The seamanship of the Koli and Machhi fisher communities of Daman — steering by swell, wind, birds and stars — is real, old knowledge. This grandfather-and-granddaughter telling is composed for this app in their manner, and the source says so honestly.'
},

{
  id: 'fk.narali-punam',
  collection: 'coast-forest',
  badge: 'aaj',
  title: 'The Coconut for the Sea',
  hook: 'Once a year, the fisher families of Daman walk to the water\'s edge and give the sea a present. Then, and only then, the boats go out.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['नारियल', 'nariyal', 'coconut'], ['पूर्णिमा', 'purnima', 'full moon'], ['मौसम', 'mausam', 'season']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'All through the monsoon, the fishing boats of Daman stay in. The sea off this coast in the rains is no place for anyone, and the fisher families — Koli and Machhi people who know it best — do not argue with it. They mend nets, paint hulls, and wait for a particular full moon.' },
    { art: ['guard'], who: null,
      text: 'It comes at the monsoon\'s end: Narali Purnima, the coconut full moon. On that day, all along the western coast, fishing communities go down to the water dressed in their best, singing, carrying coconuts — and give them to the sea.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'In Daman the boats are decorated like relatives at a wedding — fresh paint, flags, flowers on the prow. Families walk down together, the coconuts are offered into the waves with prayers, and the water rocks them away, bright against the grey-green swell.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'A boy watching for the first time asked his mother the obvious, excellent question. "The sea is full of everything already. Why are we giving it a coconut?"',
      ask: {
        q: 'Why offer a coconut to the sea, which needs nothing?',
        options: ['To feed the fish', 'It is a greeting between neighbours — respect and thanks before asking to work in the sea\'s house again', 'It is just for the photographs'],
        answer: 1,
        right: 'That is the heart of it. The sea feeds these families all year. Before the season begins, you greet it, thank it, and ask nicely. You would do the same at any neighbour\'s door.',
        wrong: 'The fish do enjoy it, but that is not the point. It is a greeting between neighbours — thanks for last season, respect before the new one. You would knock politely at any neighbour\'s door.'
      } },
    { art: ['guard'], who: 'guard',
      text: '"We work in the sea\'s house," his mother said. "All year it feeds us. Once a year, we stand at its door and say thank you, and ask leave to come in again. The coconut is how our people have always said it — it is the best thing the shore grows, so it is what we bring."' },
    { art: ['courtier', 'guard'], who: null,
      text: 'And with the offering made, the season opens. Within days the harbour empties at dawn, the boats spreading out over water that has, in everyone\'s eyes, been properly spoken to. The old agreement, renewed for another year.' },
    { art: ['courtier'], who: null,
      text: 'Up and down the coast — in Maharashtra, in Gujarat, here in Daman — fishing communities keep this day, each in their own way, with their own songs. In many families the coconut is broken and shared afterwards too; ask a coastal family how theirs does it.' },
    { art: ['guard'], who: 'mithu',
      text: 'It is worth standing on the sand for, once in your life: a whole community facing the sea, saying thank you to it, out loud, together. The sea does not answer. The boats come home all season. In Daman they will tell you those two sentences are connected.' }
  ],
  moral: 'Say thank you to what feeds you — out loud, together, every year.',
  source: 'Narali Purnima, the coconut full-moon offering kept by Koli, Machhi and other fishing communities along the west coast including Daman, marking the monsoon\'s end and the opening of the fishing season. A living practice, told from the inside.'
},

{
  id: 'fk.moti-daman-bells',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Bell That Answered Ships',
  hook: 'Inside the great fort of Moti Daman stands a church, and in the church a bell — and the bell\'s job, at dusk, was to say one word: home.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['घंटी', 'ghanti', 'bell'], ['शाम', 'shaam', 'evening'], ['वापसी', 'waapsi', 'homecoming']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'On the south bank of the Daman Ganga stands Moti Daman — the big fort, with walls you can walk along and a whole old town tucked inside. And inside the walls stands the Church of Bom Jesus, centuries old, with carved doors, a golden altar, and a bell up in its tower.' },
    { art: ['courtier'], who: null,
      text: 'This is a tale of that bell, from the days when Daman was a Portuguese port and the river below the fort was busy with sails. It is told the way harbour tales are told — leaning on a wall, watching the water.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'Every evening at dusk the bell rang across the river, and every vessel coming up from the sea heard it. To a crew that had been out for days, wet and tired, that sound reaching them over the water meant one thing before it meant anything churchly: Daman. We are home.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'The old bell-ringer, the tale goes, understood this perfectly. A priest once found him ringing on a foul black evening, long past the usual hour, hauling away in the wind. "The hour is gone," said the priest. "For whom are you ringing?"',
      ask: {
        q: 'Why is the bell-ringer still ringing into the storm, after the hour has passed?',
        options: ['He lost track of the time', 'There is a boat still out — and the bell can be heard when nothing can be seen', 'He likes the sound of it'],
        answer: 1,
        right: '"Fernandes\' boat is not in," said the bell-ringer, and kept hauling. "On a night like this the river mouth hides. But my bell carries. Let him find home by his ears."',
        wrong: 'He knew the hour exactly. "Fernandes\' boat is not in," he said, and kept hauling. "On a night like this the river mouth hides. But my bell carries. Let him find home by his ears."'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'And out in the dark, the story says, the late boat heard it — a thread of bronze sound through the rain — and steered on it, and came up the river past the fort wall, safe. The bell-ringer heard the shouts from the water, rang twice more for gladness, and went home to his supper.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Here is the lovely thing about a Daman evening, then and now. The church bell is not the only voice. Across the town, as the light goes, the azaan rises from the mosque, and the aarti bells sound from the temples — different prayers, in different houses of God, floating out over the same river.' },
    { art: ['guard'], who: null,
      text: 'And every one of those sounds, whatever else it carries, carries the bell-ringer\'s message too. Day is ending. You are not alone. Come home. Sailors of every faith steered by whichever voice reached them, and were glad of them all.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Stand on the wall of Moti Daman at dusk sometime and just listen. The evening voices of an old port town, all saying the same word in their own languages. It is one of the best sounds in India.' }
  ],
  moral: 'Every call to prayer is also a call home — and a town with many voices calls the more surely.',
  source: 'The fort of Moti Daman and the Church of Bom Jesus within it are real, as are Daman\'s shared evening voices. This bell-ringer\'s tale is a new telling composed for this app in the harbour manner, and the source says so honestly. Both faiths appear here as their own people know them.'
},

/* ===================================================== GOA =============== */
{
  id: 'fk.goa-two-bells',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Two Bells of the Valley',
  hook: 'A white church on one hill, a temple on the other, and two bells that learned to ring to each other across the paddy fields.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['गाँव', 'gaon', 'village'], ['सुबह', 'subah', 'morning'], ['पड़ोसी', 'padosi', 'neighbour']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'There is a kind of Goan village — you will find it in every taluka — that sits in a green valley of coconut and rice, with a whitewashed church shining on one hill and a temple with a deepastambha, a lamp tower, on the other. This is a tale told about one such village.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Each hill had its bell. The church bell was big and bronze and rang for Mass and the Angelus. The temple bell was smaller and brighter and rang for the morning and evening aarti. And between them, in the valley, everybody\'s rice grew in everybody\'s sight.' },
    { art: ['guard'], who: null,
      text: 'The two bell-ringers had never planned anything. But bells carry in a valley, and slowly, over years, a politeness grew. If the temple bell was sounding, the church ringer waited for the pause before he began. If the church bell was mid-peal, the temple ringer let it finish. Neither would ring over the other.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'A child once asked her grandmother about it — a Catholic grandmother, as it happens, shelling peas on her balcao. "Aji, why does our bell wait for theirs?"',
      ask: {
        q: 'Why would each bell-ringer wait for the other to finish?',
        options: ['It is a rule the village council made', 'Because you do not talk over a neighbour who is praying', 'So people can tell the bells apart'],
        answer: 1,
        right: '"When Salkar-bab\'s family prays, we do not shout across it," said her grandmother. "When we pray, they do not shout across us. That is not a rule, child. That is manners."',
        wrong: 'No council ever discussed it. "When Salkar-bab\'s family prays, we do not shout across it," said her grandmother. "When we pray, they do not shout across us. That is not a rule. That is manners."'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      text: 'And on the great days, the politeness turned into something better. At the church feast, the temple side of the valley came to the fair below the church, and sweets went home in every direction. At Shigmo and Diwali, the church side stood in the lanes to watch the drums and lamps go by, and the children of both hills ran in one flock.' },
    { art: ['courtier'], who: null,
      text: 'People from away sometimes asked the villagers how the two hills got along so well, as if it were a wonder. The villagers found the question odd. "We have always been here," they would say, "both of us. The valley is one valley. The rice does not grow in two colours."' },
    { art: ['guard'], who: null,
      text: 'In the evenings, when both bells had rung and the frogs were starting up in the paddies, you could stand on the bund between the hills and feel it: two houses of God, lit against the dusk, each keeping its own prayers and keeping, also, an ear for the other.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Konkani has a word, "mog" — love, plain and homely. Ask a Goan what holds a village like that together and you will hear it. Not sameness. Mog, and manners, and a shared valley of rice.' }
  ],
  moral: 'Neighbours who let each other\'s prayers finish will never lack for company at their festivals.',
  source: 'A composite village tale composed for this app. What it is made of is real and documented: Goan villages where church and temple share a valley, and the long tradition of Hindu and Catholic Goans attending one another\'s feasts. Both faiths are shown from the inside, as their own people keep them.'
},

{
  id: 'fk.goa-coconut',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Tree That Held the Village',
  hook: 'The flood took the rice, the year\'s work, everything. It could not take the trees — and the trees, it turned out, were a whole pantry.',
  hero: 'courtier',
  cast: ['courtier', 'pt_monkey'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['नारियल', 'nariyal', 'coconut'], ['छत', 'chhat', 'roof'], ['रस्सी', 'rassi', 'rope']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In Konkani the coconut palm is the maad, and in the old Goan reckoning a family that owned maad trees was never truly poor, whatever else went wrong. This tale, told along the Goan coast, is about the year everything else went wrong.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'The rains came that year like an upturned sea. The river left its bed, walked through the fields, and sat on the rice until the rice was gone. When the water finally drew back, the village stood looking at grey mud where a year of food should have been.' },
    { art: ['pt_monkey', 'courtier'], who: null,
      text: 'But standing out of the mud, untroubled, leaning the way they always leaned — the coconut palms. The flood had swirled round their trunks for a week and they had simply held on. Palms know water. They grow with their feet nearly in the sea all their lives.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'The village headwoman gathered everyone. "The rice is gone and the next harvest is months away," she said. "Now — before anyone despairs — somebody count for me what we still have." And she pointed up at the palms.',
      ask: {
        q: 'What can a village actually get from its coconut palms?',
        options: ['Just coconuts to eat', 'Food, drink, oil, rope, roofs, brooms, bowls, fuel — nearly everything', 'Shade and not much else'],
        answer: 1,
        right: 'They counted, and the counting turned into courage. Tender coconuts to drink. Flesh to eat. Oil for cooking and lamps. Coir for rope and nets. Fronds for roofs and brooms. Shells for bowls and fuel. The maad is a pantry, a workshop and a roof, standing on one leg.',
        wrong: 'Far more than that — the counting turned into courage. Tender coconuts to drink. Flesh to eat. Oil for lamps. Coir for rope and nets. Fronds for roofs and brooms. Shells for bowls and fuel. The maad is a pantry, a workshop and a roof, standing on one leg.'
      } },
    { art: ['pt_monkey', 'courtier'], who: null,
      text: 'So that is how the village lived until the next planting. The climbers went up with their ankle-loops and brought down nuts by the hundred. Coir was twisted into rope and the rope sold. Fronds re-roofed what the flood had soaked. Coconut milk went into every pot, and nobody\'s children went to sleep hungry.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'When the new rice finally stood green in the mended fields, the headwoman called the village together once more — under the palms this time — and made the announcement the tale is really told for: "From this year, no one in this village cuts a healthy maad. I do not care whose land it stands on. These trees are the village\'s grandmothers."' },
    { art: ['courtier', 'pt_monkey'], who: null,
      text: 'Goans have called the coconut palm kalpavriksha — the wish-fulfilling tree of the old stories — for as long as anyone can say, and they mean it almost literally. Ask a Goan household how many things in the kitchen came from the maad. Then count the roof.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The flood is one story or another in every telling. The counting under the trees is always the same. Wealth is not only what you harvest this year — it is also what keeps standing when the water comes.' }
  ],
  moral: 'Know what you truly have before you decide you have nothing.',
  source: 'A Konkani coastal telling of a widespread Goan truth: the coconut palm — the maad — as the tree of a thousand uses, honoured as kalpavriksha. The flood-year framing follows the way such tales are told along the coast; versions differ, and no single collector is claimed.'
},

{
  id: 'fk.goa-frog-rain',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Frog Who Called the Rain',
  hook: 'The smallest frog in the paddy kept singing to an empty sky. Everyone told him to save his breath. Then the sky answered.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'pt_crow'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['मेंढक', 'mendhak', 'frog'], ['वर्षा', 'varsha', 'rain'], ['गीत', 'geet', 'song']],
  scenes: [
    { art: ['pt_tortoise'], who: null,
      text: 'In the rice country of Goa, the farmers will tell you the frogs know the monsoon before anyone. When the paddies begin to shout with frog-song, the rain is coming — the frogs are the heralds, singing it in. This is a tale about the year the heralds nearly gave up.' },
    { art: ['pt_tortoise'], who: null, mood: 'sad',
      text: 'The rains were late. Terribly late. June was ending, the fields lay cracked like old pottery, and the frogs sat silent in the last damp hollows, saving themselves. What is the point of singing the rain in, they said, when there is no rain to sing to?' },
    { art: ['pt_tortoise', 'pt_crow'], who: null,
      text: 'All but one. The smallest frog in the lowest paddy — a frog the size of a thumbnail, with a voice to match — climbed onto a clod every evening and sang anyway. Tink. Tink. Tink. Alone, into a dry sky the colour of brass.' },
    { art: ['pt_crow'], who: 'pt_crow',
      text: 'A crow heckled him from the bund, because crows will. "Save your breath, little one. The big frogs have stopped. The sky is not listening." The little frog finished his verse first, politely, and then answered: "The sky is exactly who I am singing to. Somebody has to keep the invitation open."' },
    { art: ['pt_tortoise'], who: null, mood: 'think',
      text: 'And the farmers, who could do nothing else, did what Konkan farmers have long done in a dry year — they honoured the frogs. If the rain-callers are silent, the old ones said, help them ask.',
      ask: {
        q: 'The rain is late and even the frogs have gone quiet. What do the village children do?',
        options: ['Give up like the big frogs', 'Join the little frog — sing and drum for the rain along with him', 'Chase the frogs away'],
        answer: 1,
        right: 'That is the old way. The children came out to the field with pots to drum on and sang for rain beside the smallest frog — and his tink-tink-tink kept the beat.',
        wrong: 'The opposite. The children came out with pots to drum on and sang for rain beside the smallest frog — his tink-tink-tink keeping the beat for the whole crowd.'
      } },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      text: 'And that night — the tale insists on this part — the wind swung round to the sea, and a smell of wet earth came up the valley, and the first fat drops fell hissing on the dust. By morning the whole sky had opened, and every frog in Goa was singing at the absolute top of its voice.' },
    { art: ['pt_tortoise', 'pt_crow'], who: null,
      text: 'The paddies filled. The rice went in. And the big frogs, it is said, were too glad to be embarrassed — though the crow made sure they heard about it, at length, from the bund.' },
    { art: ['pt_tortoise'], who: 'mithu',
      text: 'Did the little frog bring the rain, or did the rain simply come? The farmers of the tale never argued about it. They just noticed which frog had still been singing when it arrived.' }
  ],
  moral: 'Keep singing your song even before the answer comes — someone must hold the invitation open.',
  source: 'A Konkan paddy telling. The beliefs it is built from are real and widespread: frog-song as the monsoon\'s herald, and the old custom in many parts of India of honouring frogs to ask for rain. This shaping of the tale is for this app; versions of frog-and-rain tales differ across the coast.'
},

{
  id: 'fk.goa-shigmo',
  collection: 'coast-forest',
  badge: 'aaj',
  title: 'When Spring Beats the Drum',
  hook: 'For most of the year the village drums sleep. Then spring arrives in Goa, and the drums wake up the entire state.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['वसंत', 'vasant', 'spring'], ['ढोल', 'dhol', 'drum'], ['झंडा', 'jhanda', 'flag']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'Every year, as winter loosens and the mango trees flower, Goa\'s Hindu villages begin tuning their drums. Shigmo is coming — the great spring festival of the Konkan, Goa\'s own cousin of Holi, and for days on end the state belongs to the drummers and the dancers.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      text: 'It begins in the villages. Bands of dancers — the romta mell — go from house to house and temple to temple with flags the colour of flame, with dhol and tasha drums, with cymbals and flutes, dancing in the lanes they have danced in for centuries.' },
    { art: ['courtier'], who: null,
      text: 'The old tellings give Shigmo more than one beginning. In many villages it is told as the festival of homecoming — the season when, long ago, the men who had been away at war or on journeys came home to their families, and were met with drums, dancing and flowers in the streets.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      text: 'A drummer teaching his daughter the rhythms put it this way: "Winter is quiet and careful. The fields are cut, the nights are cool, everyone saves and waits. Then the flowers come. And what should a person do when the waiting ends?"',
      ask: {
        q: 'After the quiet, careful months, what does Shigmo say a village should do?',
        options: ['Stay quiet — save the energy for farming', 'Come out into the lanes together and be loud and glad on purpose', 'Celebrate quietly at home, each family alone'],
        answer: 1,
        right: '"Exactly," said the drummer. "Gladness kept indoors goes stale. Spring is for the whole lane together, as loud as the drums can say it."',
        wrong: '"No," said the drummer, "that is what winter was for. Gladness kept indoors goes stale. Spring is for the whole lane together, as loud as the drums can say it."'
      } },
    { art: ['courtier', 'guard'], who: null,
      text: 'In the towns, Shigmo has grown grand: float parades down the main streets, dancers in troupes of hundreds, scenes from the old stories built bigger than houses and lit like the noon sun. Village Shigmo and city Shigmo, small drum and big parade — the same festival wearing two sets of clothes.' },
    { art: ['courtier'], who: null,
      text: 'And in the proper Goan way, the lanes fill with everybody. Catholic neighbours come out to watch the mell go past and know the drummers by name; visitors get colour on their faces and sweets in their hands. A Goan festival has never been good at staying inside one gate.' },
    { art: ['guard'], who: null,
      text: 'The drums pass down from shoulder to shoulder, father to daughter, uncle to nephew. A child in a Shigmo village learns the rhythms the way they learn to swim — by being in the middle of it every spring until, one year, the drum is on their own shoulder.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Every part of India welcomes spring in its own voice — Holi\'s colours, Bihu\'s songs, and in Goa, the drums of Shigmo. Ask your family how spring is welcomed where your people are from. Somebody will start humming.' }
  ],
  moral: 'Gladness is meant to be shared at full volume, at least once a year.',
  source: 'Shigmo, the spring festival of Goa\'s Hindu communities — the village romta mell processions, the dhol-tasha drumming, the flags, the homecoming tellings, and the modern town parades. A living festival, told from the inside.'
},

{
  id: 'fk.mandovi-mugger',
  collection: 'coast-forest',
  badge: 'aaj',
  title: 'The Crocodile Who Owns His Stretch',
  hook: 'In the tidal creeks off the Mandovi live real crocodiles. The farmers nearby do something surprising about it: once a year, they honour one.',
  hero: 'pt_crocodile',
  cast: ['pt_crocodile', 'courtier'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['मगर', 'magar', 'crocodile'], ['मिट्टी', 'mitti', 'clay'], ['आदर', 'aadar', 'respect']],
  scenes: [
    { art: ['pt_crocodile'], who: null,
      text: 'Between Goa\'s two great rivers, the Mandovi and the Zuari, winds a tidal channel through the mangroves — and in its warm green water live muggers: real, wild marsh crocodiles, dozing on the mud banks with the patience of logs.' },
    { art: ['courtier'], who: null,
      text: 'They have been there longer than anyone\'s records. The fisherfolk who work the channel know their haul-out banks the way you know which neighbour\'s scooter is whose, and give them room. The crocodiles, for their part, mostly mind their own considerable business.' },
    { art: ['pt_crocodile', 'courtier'], who: null, mood: 'wow',
      text: 'And in villages by these waters, the farmers keep a custom that surprises everyone who hears of it. Once a year, after the harvest, they build a crocodile — life-sized, out of wet clay and shells — on the bund beside the water, and honour it with flowers and offerings.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'The custom is called Mannge Thapnee — the setting-up of the crocodile. A visitor once asked an old farmer the obvious question: why honour the animal most people would rather wish away?',
      ask: {
        q: 'Why would farmers honour the crocodile in their creek instead of just fearing it?',
        options: ['To tame it like a pet', 'Because it belongs to these waters as they do — honouring it renews an old agreement to share', 'To make it leave the creek'],
        answer: 1,
        right: '"He was here before my grandfather\'s bund," said the farmer. "He keeps his stretch, we keep ours. Once a year we say so out loud. That is all a good fence is — an agreement said out loud."',
        wrong: 'Nobody tames a mugger and nobody expects him to leave. "He was here before my grandfather\'s bund," said the farmer. "He keeps his stretch, we keep ours. Once a year we say so out loud."'
      } },
    { art: ['pt_crocodile'], who: null,
      text: 'In the old understanding, the crocodile is the guardian of the waters — the one who keeps the banks and the sluice gates safe for the fields. Treat him with respect, the custom says, and the water-world stays in order. It is the same thought the hill people give their tiger god: the big neighbour, greeted properly.' },
    { art: ['courtier', 'pt_crocodile'], who: null,
      text: 'Meanwhile the scientists come with binoculars and notebooks, counting the muggers and studying how such big wild animals live so close to so many people. Their finding, in short: the sharing mostly works — and the old respect is a large part of why.' },
    { art: ['pt_crocodile'], who: null, mood: 'wow',
      text: 'So on a quiet morning you can drift down the channel and see it all at once: mangroves, fishing canoes, a heron statue-still on a post, and on the far bank a three-metre mugger asleep in the sun — everyone keeping, more or less politely, to their own stretch.' },
    { art: ['courtier'], who: 'mithu',
      text: 'You do not have to pretend a crocodile is cuddly to respect it. Goa\'s creek villages have shown for generations that wonder and carefulness can live in the same boat.' }
  ],
  moral: 'You can honour what you are careful of — respect and caution are old friends.',
  source: 'The wild mugger crocodiles of the tidal channel between Goa\'s Mandovi and Zuari rivers, and Mannge Thapnee, the annual clay-crocodile honouring kept by farming villages beside these waters. A living practice, told from the inside.'
},

{
  id: 'fk.goa-mando',
  collection: 'coast-forest',
  badge: 'aaj',
  title: 'The Song That Keeps the Story',
  hook: 'At a Goan wedding, the grandmother begins to sing, slow and sweet — and inside the song, a hundred years of the family is listening.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['गाना', 'gaana', 'song'], ['परिवार', 'parivaar', 'family'], ['विदाई', 'vidaai', 'farewell']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In the Catholic households of Goa there is a kind of song called the mando — slow, graceful, sung in Konkani, with everyone joining the refrain. It is not stage music, though it has reached stages. Its true home is a family gathered in a hall, at a wedding, in the evening.' },
    { art: ['guard'], who: null,
      text: 'The singers stand together, and with them plays the ghumot — Goa\'s own clay-pot drum, warmed by a fire before playing so its voice comes right — and maybe a violin, which the Portuguese years left behind in Goan parlours the way the sea leaves shells.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Every mando tells something. Some are love stories, full of longing across a courtyard. Some remember real happenings from long ago — a wedding, a parting, even village quarrels and old injustices, all smoothed by melody into something a family can hold. The mando is how Goan Catholic families kept their diary: in verse, in Konkani, in four-part sweetness.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'At one wedding, so the affectionate joke goes, a boy whispered to his grandmother: "Why is everyone nearly crying? It is a happy day." His grandmother was singing the refrain and made him wait for the verse-end, which is the correct order of things.',
      ask: {
        q: 'Why do people\'s eyes shine when the mando is sung at a happy wedding?',
        options: ['The song is too long', 'Because the song holds everyone they remember — the family\'s whole story is in the room while it lasts', 'Weddings make people tired'],
        answer: 1,
        right: '"When we sing it," she said, "I hear my mother singing it, and she heard hers. Happy and full-of-remembering are neighbours, child. The mando invites them both."',
        wrong: '"Listen," she said. "When we sing it, I hear my mother singing it, and she heard hers. The song holds everyone we remember. Happy and full-of-remembering are neighbours, child."'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'The dancing that goes with it is as unhurried as the song — couples in lines, a fan turning in a hand, steps that a great-grandmother can do beside a girl of ten, which is precisely the point. Nobody is showing off. Everybody is carrying the same thing together.' },
    { art: ['courtier'], who: null,
      text: 'New mandos were made for new happenings, decade after decade, so the songbook grew along with the families. Sing through a village\'s mandos in order and you have sung its history — told from the inside, in its own kitchen language.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'Today there are mando festivals and competitions, choirs that polish it like silver, recordings that carry it to Goan families in Lisbon and London and Toronto — who play them at their own weddings, and cry the same good tears in a colder climate.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Every community keeps its memory somewhere — in scrolls, in epics, in grandmother\'s kitchen. Goa\'s Catholic families keep a good part of theirs in song. Ask your family what songs hold your story. There will be at least one.' }
  ],
  moral: 'A family that sings its story together never really loses anyone from it.',
  source: 'The mando tradition of Goan Catholic families — Konkani story-songs with the ghumot clay drum, sung at weddings and gatherings and now at festivals worldwide. A living tradition, told from the inside.'
},

{
  id: 'fk.kharvi-wave',
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Sea Speaks in Sevens',
  hook: 'Before any boat went out, the old fisherman stood on the sand doing something strange: counting waves.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['लहरें', 'lehrein', 'waves'], ['गिनती', 'ginti', 'counting'], ['धैर्य', 'dhairya', 'patience']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'The Kharvi are Goa\'s fisher people — the ones whose canoes and nets have worked this surf since long before anyone wrote anything down about Goa at all. This is a tale in their manner, about the oldest skill on the beach: listening to the sea before you argue with it.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'Every morning, before the boats went out, old Pedru — everyone\'s grand-uncle, brown as a coir rope — walked to the water\'s edge and simply stood there. Watching. Counting under his breath. Only after a long while would he turn and say "yes" or "no", and the beach obeyed him like weather.' },
    { art: ['courtier'], who: 'courtier',
      text: 'A boy finally asked him what he was counting. "The waves," said Pedru. "The sea does not send them all alike. She sends them in families — some small, then the big ones together. Stand still long enough and you learn the size of the family she is sending today, and the mood she sent it in."' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'He taught the boy the rest of the listening, too. The colour of the water out past the break. What it means when the wind and the swell disagree with each other. Why birds sitting on the water say one thing and birds flying high and silent say another.',
      ask: {
        q: 'The morning looks sunny and lovely, but Pedru counts the waves and says "no boats today". What has he noticed?',
        options: ['He is being too careful for no reason', 'The swell — big wave-families arriving from a storm far out at sea that the sky here cannot show', 'The fish have moved away'],
        answer: 1,
        right: 'That is the deep trick of it. A storm far over the horizon sends its waves ahead of it. The sky above you can be innocent while the sea beneath you is already carrying the news.',
        wrong: 'Pedru was never careful for no reason. A storm far over the horizon sends its swell ahead of it — the sky here can be innocent while the sea is already carrying the news. The waves told him what the weather had not.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      text: 'And sure enough — the tale would not be told otherwise — by afternoon the horizon turned the colour of wet slate, and the surf stood up taller than a man, and the boats of that beach were all high on the sand, because an old man had counted to seven a few times before breakfast.' },
    { art: ['courtier'], who: null,
      text: 'The boy grew into the man who stood at the water\'s edge in his turn, counting, with a child beside him asking what he was doing. That is how the Kharvi kept their knowledge for all the centuries before barometers: one beach, one dawn, one patient explanation at a time.' },
    { art: ['guard'], who: null,
      text: 'The boats have engines now, and the phone knows the forecast. But watch an old Goan fisherman on the sand some morning. He will still be reading the water with his eyes before he trusts the screen — checking the sea\'s own signature against the letter.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The sea talks to those who stand still long enough to listen. So do most things, actually.' }
  ],
  moral: 'Listen first, decide second — the world sends its news ahead, for those who read it.',
  source: 'The sea-craft of the Kharvi fisher community of Goa — reading swell, wind and birds before launching — is real, old knowledge. This Pedru telling is composed for this app in their manner, and the source says so honestly rather than claiming a collected tale.'
},
