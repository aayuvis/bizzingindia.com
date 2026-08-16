/* Bizzing India — southern story content (fourth tranche).

   Same shape as data-stories.js, data-stories-regional.js and data-stories-more.js,
   on its own global so all four sets can be loaded and merged independently.

   This file brings every southern state to at least eight stories: Kerala, Tamil
   Nadu, Karnataka, Andhra Pradesh, and Puducherry — whose four scattered pieces
   (Pondicherry and Karaikal on the Coromandel coast, Mahe on the Malabar coast,
   Yanam on the Godavari delta) are treated as the geography lesson they are.

   Every object carries badge 'katha' — a story as it is told. Sources name the
   tradition, the collection or the place honestly; where a tale is oral and has
   no single collector, the source says so rather than inventing one. Kerala's
   Aithihyamala tellings (Naranath, Kochunni, the Kathanar, the panthirukulam)
   name that collection because it is genuinely where most families' versions
   descend from.

   Softening notes (docs/05, and the age band): several of these tales end more
   harshly in their oldest tellings than they do here — Kannagi's ending is
   pointed to rather than told, the three devotees of Srikalahasti keep their
   lives, Onake Obavva's stand is told without the battlefield details, and the
   sea gives back the tittibha eggs without Garuda's harder threats. Each one
   says so in its own `source` line rather than quietly rewriting the tradition.

   Faiths (docs/05 §4): Kerala's Hindu, Christian and Muslim traditions all
   appear here, each told warmly from the inside — the Kathanar is a Christian
   priest and says so plainly; the Cheraman legend is told as Kerala's Muslims
   cherish it; the Manimekalai is told as the Buddhist Tamil epic it is.

   The panthirukulam and Naranath tales touch, in their old tellings, on the
   harsh old words for people and the ranking of families. Those words do not
   appear here; the stories are told around them, the way this app's
   Mahabharata is — and the internal diversity they celebrate IS the point.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is said / told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_SOUTH = [

/* ============================================================== KERALA ====== */
{
  id: 'fk.panthirukulam',
  collection: 'desh-south',
  badge: 'katha',
  title: 'Twelve Houses, One Mother',
  hook: 'Twelve babies, one mother — and every one of them grew up in a different house, with a different trade, and a different way of praying.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-KL'],
  words_hi: [['परिवार', 'parivaar', 'family'], ['बारह', 'baarah', 'twelve'], ['माँ', 'maa', 'mother']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'This is one of the oldest stories Kerala tells about itself, and once you have heard it you will see it everywhere you look there. It begins with a scholar called Vararuchi, who was famous across the land for knowing everything — and who was just beginning to suspect that he did not.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'By a river one day he met a young woman who answered, without even putting down the washing, a riddle that had beaten every scholar he knew. He came back the next day with a harder one. She answered that too, and added a better one of her own. He married her, which was the first fully sensible thing he had ever done.' },
    { art: ['courtier'], who: null,
      text: 'They took to the road together, the way wandering scholars did, and over the years twelve children were born to them — each one in a different place along the way.' },
    { art: ['courtier', 'guard'], who: null, mood: 'sad',
      text: 'And here the story does a hard thing, and it knows it is hard. Each time a baby came, Vararuchi asked his wife one question: "Does the child have a mouth?" "Of course," she said. "Then the One who gave the mouth will send the food," he said. "Lay the child down gently, and walk on." And, trusting something bigger than her own breaking heart, she did.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'A baby, lying wrapped by the side of a path in Kerala, where somebody passes every few minutes. The story knows exactly what it is doing.',
      ask: {
        q: 'A baby is found by the path. Who picks it up?',
        options: ['Nobody — people walk past', 'Whichever family finds it first — and every family is different', 'Only a rich family could'],
        answer: 1,
        right: 'Exactly that. And that is the whole story. Twelve babies, twelve different families — and not one child was left lying there long.',
        wrong: 'Kerala answers that question the way Kerala would. Whichever family found the child took the child — and every family was a different kind of family.'
      } },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'One was raised in a carpenter\'s house and became Perunthachan, the greatest builder the land ever talked about. One grew up with a family of drummers and carried their beat. One was raised by basket weavers and became Pakkanar, whose plain words could stop a proud man mid-stride. One grew up in a scholar\'s house tending the sacred fire.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'One, called Uppukottan, was raised in a salt trader\'s house where the family prayed as Muslims pray, and he grew up in that faith and carried salt down every road in the country. One never settled in any house at all — you will meet him in the next story, pushing a boulder up a hill. Twelve homes, twelve trades, more than one way of praying. One mother.' },
    { art: ['courtier'], who: null,
      text: 'And once a year, the story says, all twelve came together under one roof for their mother\'s feast day — the drummer and the fire keeper, the carpenter and the salt trader, each bringing what his own house made, each eating in the way of his own home, at the same time, in the same courtyard.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'The neighbours were scandalised, of course. Such different people, at one feast! And the story just looks at the neighbours, and waits, until they work it out: same mother.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Kerala has told this story about itself for centuries — a land of twelve kinds of household that knows, underneath, it is one family. Ask your own family who counts as family. The answer is usually bigger than the house.' }
  ],
  moral: 'One mother can have twelve kinds of children, and a country can too. That is not a problem to fix — that is a family.',
  source: 'Parayi petta panthirukulam — the twelve families of one mother — from Kerala oral tradition and the Malayalam legend collection Aithihyamala. Told here without the harsh old words for people that some tellings carry.'
},

{
  id: 'fk.naranath-boulder',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Man Who Rolled the Boulder Up',
  hook: 'Every morning he pushed a huge rock up the hill. Every evening he let it roll back down — and laughed. Everyone said he was mad. Was he?',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'durga'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['पत्थर', 'patthar', 'boulder'], ['पहाड़ी', 'pahaadi', 'hill'], ['हँसी', 'hansi', 'laughter']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'You remember the twelve children of one mother? This is the one who never settled anywhere. His name was Naranath, and all of Kerala called him Naranath Branthan — Naranath the mad one — and Kerala has been arguing for hundreds of years about whether that name was fair.' },
    { art: ['courtier'], who: null,
      text: 'His days went like this. At dawn he put his shoulder to an enormous boulder at the bottom of the hill at Rayiranellur, and he pushed. All morning. All afternoon. Grunting, sweating, inch by inch, all the way up.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'And at the top, in the last light, he stood back, dusted his hands — and let it go. The boulder went thundering and bouncing all the way back down to exactly where it had started. And Naranath threw back his head and laughed until he had to sit down.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: '"Mad," said the villagers, comfortably, and went back to their dinners. But the children were braver than the grown-ups, the way children are, and one evening a few of them climbed up and asked him straight out: "Why do you laugh when your whole day\'s work rolls away?"',
      ask: {
        q: 'Well? Why WOULD a man laugh as his whole day\'s work rolls back down the hill?',
        options: ['Because he is silly and does not understand', 'Because the rolling down is part of the game — and he chose the game himself', 'Because he is really crying inside'],
        answer: 1,
        right: 'That is the answer Kerala has settled on, after a few hundred years of thinking about it. Nobody gave him that task. Nobody could take it from him. He was free.',
        wrong: 'The children thought that too, at first. But look again. Nobody gave him that task, nobody paid him for it, nobody could fire him from it or cheat him at it. He chose it. He was free.'
      } },
    { art: ['courtier'], who: 'courtier',
      text: '"Everyone in the valley pushes something uphill all day," he told the children, wiping his eyes. "Money up the hill, and it rolls down. Fame up the hill, and it rolls down. They cry about it every evening. I am the only one who knew it would roll — so I am the only one laughing." And he patted the boulder like an old bullock.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'One night, the story says, he settled down to sleep in a place people avoided after dark. In the middle of the night the great goddess Bhadrakali came through with her noisy companions, as she does in the old tales, and found a man calmly lying there, entirely unbothered. She was intrigued. Nobody was ever unbothered.' },
    { art: ['durga', 'courtier'], who: null,
      text: '"Ask me for something," said the goddess, who rather liked him. Naranath thought about it. He asked when his life would end, and she told him, because he asked so calmly. "Could I have one day more?" No, she said — that is not given. "One day less, then?" Not that either. "Then, Amma," said Naranath, "the boons I actually need, nobody can give."' },
    { art: ['durga', 'courtier'], who: 'courtier', mood: 'wow',
      text: 'The goddess insisted — a boon is a boon. So Naranath looked down at his legs. One had been swollen since he was young, and ached. "Then move the swelling," he said, "from my left leg to my right. For a change." And she did. And Naranath laughed harder than he had ever laughed at the boulder — and the goddess, the story swears, laughed with him.' },
    { art: ['courtier'], who: null,
      text: 'He walked on through the land all his life, wanting nothing, owing nothing, laughing at the right moments — and the ones who called him mad slowly noticed that he was the only person in Kerala nobody could make unhappy.' },
    { art: ['courtier'], who: 'mithu',
      text: 'People still climb his hill at Rayiranellur, once a year, to stand where the boulder stood. Here is a thing to try: choose one small task nobody asked you to do, and do it just for you. See how it feels. That feeling is what Naranath was laughing about.' }
  ],
  moral: 'A person who chooses their own task and wants nothing else can never be made unhappy — and whether that is madness or wisdom, Kerala is still happily arguing.',
  source: 'Naranath Branthan, one of the panthirukulam, from Kerala oral tradition and the Aithihyamala; his hill at Rayiranellur near Pattambi is still climbed each year. Many tellings.'
},

{
  id: 'fk.kochunni',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Man the Poor Would Not Give Up',
  hook: 'Soldiers searched every house in Kayamkulam for one man. Every house had fed him the night before, and nobody said a word.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['इंसाफ़', 'insaaf', 'fairness'], ['ग़रीब', 'gareeb', 'poor'], ['दरवाज़ा', 'darwaaza', 'door']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In Kayamkulam, in the backwater country of old Travancore, there was once a boy called Kochunni who was poor in the way that has no cushion under it at all. He swept a shopkeeper\'s floor for his food, and he was quick, and he watched everything.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'What he watched most was the kalari — the training yard where boys learned kalaripayattu, the old exercise art of Kerala. It was not for boys like him; nobody would pay his way in. So he watched through the fence, every evening, and practised what he saw, alone, by moonlight, until the moves lived in his body.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: 'The teacher caught him at it one night. Stood in the shadows and watched a shop boy run through the whole evening\'s lesson, alone, correctly. "Come inside," said the teacher at last. "A boy who teaches himself through a fence will not be kept out by me."' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Kochunni grew up strong and quick, able to climb a wall like a cat and cross a courtyard without a sound. And here the story stops smiling for a moment, because of what he did with all that. He took things. From the locked storerooms of men who had grown rich squeezing the hungry — but he took, and taking is taking, and this story is not going to pretend otherwise.' },
    { art: ['courtier'], who: null,
      text: 'But here is what Kayamkulam actually remembers, and why it remembers him at all. He never, ever touched a poor house. And the poor houses noticed something else: after a hard month, a small bag of coins on the widow\'s doorstep. A sack of rice inside a door where the cooking fire had gone cold. Nobody saw who. Everybody knew who.' },
    { art: ['guard'], who: null,
      text: 'And his word was iron. If Kochunni said a thing would happen, it happened; if he promised a man safety, that man was safe. Even the merchants he had robbed admitted it through their teeth: the thief was the fairest man in the district.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      text: 'So when the soldiers came to Kayamkulam to search for him, house by house, they found something they had not planned for. Silence. In every lane, in every doorway, from every fisherman and washerwoman and rice farmer: nobody had seen him. Nobody knew anything at all.',
      ask: {
        q: 'The soldiers offer a reward. The poor of Kayamkulam are very poor. Why does nobody talk?',
        options: ['They were too afraid of him', 'He had been fair to them when nobody else was — and people protect the one who protected them', 'They wanted a share of what he took'],
        answer: 1,
        right: 'That is it exactly. You cannot buy back a loyalty like that with a reward. It is only ever earned one fairness at a time.',
        wrong: 'The story is very clear that it was not that. He had been fair to them when nobody else in the world was — and people will protect, with their silence, the one who protected them.'
      } },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'The law caught up with him in the end, because it does, and his last years were spent locked away. And even then — this is the part the old tellings linger on — people carried food to him, and told his stories out loud, and went on leaving his name out of their answers.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Kerala still argues about Kochunni, and that is exactly why he is a story: grown-ups need somewhere safe to argue about hard things. Taking was wrong. Being fair was rare. Both of those are true at once, and a good story can hold them both.' }
  ],
  moral: 'Taking is taking, and the story knows it. What the people could not forget was the rarer thing — a strong man who was fair to the weak when nobody else was.',
  source: 'Kayamkulam Kochunni, from Travancore oral tradition and the Aithihyamala. The tradition remembers his fairness and his word; the law remembered the rest; this telling keeps both, which is what the tradition itself does.'
},

{
  id: 'fk.kathanar',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Priest Who Talked to the Dark',
  hook: 'Things went bump in the night all over Kerala. One priest would put on his cloak, pick up his lamp, and go and have a word with them.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['दीया', 'diya', 'lamp'], ['रात', 'raat', 'night'], ['डर', 'dar', 'fear']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Christians have lived in Kerala for a very, very long time — longer than in most of Europe, they will tell you, and proudly. At Kadamattom, among low green hills, stands one of their old churches, and this story belongs to it: the story of its most famous priest.' },
    { art: ['courtier'], who: null,
      text: 'He began as a boy called Poulose who looked after the church\'s cattle, and one day, following a strayed cow, he went too far into the high forest and was lost. The people who found him were hill people who lived far from any town, and who knew things about the forest and the night that the valley folk had long forgotten. They took him in for years, and taught him.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'When he came home at last, he served his church and in time became its priest — its kathanar, which is simply the old Kerala word for a priest. Kadamattathu Kathanar: the priest of Kadamattom. And word slowly went round that this particular priest was not afraid of the dark. At all.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'Because here is what he had learned in the hills, and it is worth learning: the dark is mostly full of lonely things, not wicked ones.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'A family came to him once, worn out and grey-faced. Something was in their house. Pots shifted by themselves. The roof rattled on windless nights. Nobody had slept in weeks. The Kathanar picked up his lamp and walked home with them, and sat down in the middle of the noisiest room, and waited for full dark.' },
    { art: ['courtier'], who: 'courtier',
      text: 'And then he did the thing nobody ever thinks to do. He spoke to the empty room, politely, the way you speak to a guest. "Well," he said. "You have everyone\'s attention now. What is it you want?"',
      ask: {
        q: 'Nobody had ever asked it a question before. What does the thing in the dark actually want?',
        options: ['To frighten everyone away', 'It had been forgotten, and wanted somewhere to belong', 'The family\'s gold'],
        answer: 1,
        right: 'That was it. It was lonely and forgotten, and rattling the pots was the only way it knew to say so. Frightened things and frightening things are usually the same things.',
        wrong: 'The Kathanar listened for a long time, and it was nothing like that. It had been forgotten, and it wanted somewhere to belong. Frightened things and frightening things are usually the same things.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'So he gave it what it wanted. A place of its own — a great old tree at the edge of the land — and, even better, a job: keeping watch. "Spirits are like children at a wedding," the Kathanar used to say. "Dreadful when ignored. Magnificent when given something to do." The pots never moved again, and the family slept.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'One story tells of a spirit who followed him for miles along a night road, planning mischief the whole way — and who arrived at Kadamattom, somehow, as his friend, and stayed. That was the pattern with him. Whatever set out to frighten the Kathanar ended up working for him.' },
    { art: ['guard'], who: null,
      text: 'And people of every faith sent for him — Hindu households, Muslim households, Christian households — because a lamp in the dark does not check the name on the door. He went to all of them alike, in his priest\'s robes, with his lamp.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The old church at Kadamattom is still there, and Kerala still tells the Kathanar\'s stories — always gently, always with a smile, because that is how he did everything. Next time a dark corner worries you, try his method. Hold up a light, and ask it a kind question.' }
  ],
  moral: 'Most fears shrink when somebody holds up a lamp and asks the dark a kind question.',
  source: 'Kadamattathu Kathanar, the priest of Kadamattom church, from Kerala Christian oral tradition and the Aithihyamala. His tales are told all over Kerala with great affection, which is exactly how this one is told.'
},

{
  id: 'fk.theyyam-mirror',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Night Grandfather Became a Goddess',
  hook: 'All night they painted his face. At dawn they held up a mirror — and the person who looked back was not grandfather.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'durga'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['आईना', 'aaina', 'mirror'], ['नाच', 'naach', 'dance'], ['भोर', 'bhor', 'dawn']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In the far north of Kerala — Kannur, Kasaragod, the country they call Malabar — the gods do not wait to be visited. Once a year, in the cool season, they come to the village themselves, and they come dancing. It is called theyyam, and there is nothing else quite like it anywhere.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'A girl called Devu sat up one night to watch it happen to her own grandfather. He sat perfectly still on a mat in the temple yard while artists worked on him by lamplight, hour after hour — orange and red and black, fine lines drawn on his face with a slip of coconut leaf, a headdress being built nearby that stood taller than a door.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'Her family had carried this theyyam for generations — the painting, the songs, the steps, handed down like land. And here is the part to sit with. The families who carry the gods in Malabar are, most of them, families whom others too often put last — for the work they did, and the houses they were born into. On theyyam night, that turns upside down.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'Because when the drums began before dawn, everyone came, and everyone stood, and everyone waited on her grandfather. The landowner whose fields he worked. The shopkeeper. The teacher. On this night, in this yard, the man they walked past all year was the one they had all come to bow to.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'The headdress was lifted onto him. The drums climbed. And then came the moment the whole night had been building to: they held up a small mirror in front of his painted face. He looked into it. And the tellings all agree — the person who looks back out of that mirror is not the performer anymore. Devu\'s grandfather looked into the glass, and the goddess looked out.' },
    { art: ['durga'], who: null,
      text: 'For the rest of that night, the goddess was in the yard — turning, blazing, enormous under the torches — and the village could do what a village can never usually do: walk up to its goddess and talk to her.',
      ask: {
        q: 'The goddess is standing in your own courtyard, listening. What do people ask her?',
        options: ['For gold and treasure', 'About the crops, the children, and the quarrels that need settling', 'To see magic tricks'],
        answer: 1,
        right: 'That is what a village actually needs. Rain for the fields, health for the little ones — and two stubborn neighbours told, by someone they cannot argue with, to make it up.',
        wrong: 'Nobody wastes the goddess\'s time on that. They ask about the crops, the children — and the quarrels. Two stubborn neighbours, told by someone they cannot argue with to make it up, make it up.'
      } },
    { art: ['durga', 'courtier'], who: null,
      text: 'The goddess blessed each person by name — she knew them all. She scolded gently where scolding was needed. She settled the quarrel between the two houses that had not spoken since the wedding. And the drums held it all up like a floor, till the sky went grey.' },
    { art: ['courtier'], who: null,
      text: 'At dawn the headdress was lifted off, and the paint was wiped away, and there on the mat sat Devu\'s grandfather — small again, tired to the bone, drinking hot tea with both hands wobbling. Devu crept up and asked him: "Where did the goddess go?"' },
    { art: ['courtier'], who: 'courtier',
      text: '"Home," said her grandfather, looking out at the morning. "Until next year." He took another sip of tea, and smiled at her. "Don\'t worry. Now she knows the way."' },
    { art: ['courtier'], who: 'mithu',
      text: 'Theyyam happens only in north Malabar, nowhere else in the world, and it is not a show — it is a visit. If you are ever there in the cool season, you can sit up all night in a temple yard and watch, and every Malabar family can tell you which theyyam is theirs.' }
  ],
  moral: 'For one night, the person everyone overlooked stands where the goddess stands — and the whole village is reminded who has been carrying whom.',
  source: 'The theyyam traditions of North Malabar — Kannur and Kasaragod districts, Kerala — where hereditary artist families perform the gods each year in the temple yards. A living oral tradition; ask a Malabar family about theirs.'
},

{
  id: 'fk.aranmula-boat',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Race That Nobody Must Win',
  hook: 'Every year, long snake boats sweep down the river at Aranmula. And the oldest rule of the day says the point is not to come first.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'krishna'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['नाव', 'naav', 'boat'], ['नदी', 'nadi', 'river'], ['साथ', 'saath', 'together']],
  scenes: [
    { art: ['krishna'], who: null,
      text: 'On the banks of the river Pampa stands the temple of Aranmula, where Krishna is worshipped as Parthasarathy — Arjuna\'s charioteer, the friend who steers. Remember that it is the steering-friend who lives here. It matters to how this story ends.' },
    { art: ['courtier'], who: null,
      text: 'Long ago, the legend says, one household upriver was given a great honour: every year at Onam time, their boat would carry the provisions for the temple feast down the Pampa — rice and coconuts, plantains and jaggery, everything needed to feed every single person who came, with nobody turned away.' },
    { art: ['courtier', 'guard'], who: null, mood: 'sad',
      text: 'And one year, on a lonely dark stretch of the river, boats slid out from the shadows of the banks. Men who wanted the feast for themselves. The provision boat was slow and heavy and alone, and the river was long, and the night was very dark.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'But a river bank is never as empty as it looks. Word ran along the water faster than any boat — a shout, a lamp, a conch — and village after village pushed out what it had. And what those villages had were chundan vallams: snake boats. Long as ten houses, curled high at the stern like a cobra\'s raised hood, a hundred rowers to a boat.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      text: 'Now, forty fast boats guarding one slow one. There is a right way and a wrong way to do that.',
      ask: {
        q: 'How do the snake boats protect the slow, heavy feast boat?',
        options: ['Race ahead to the temple and wait for it there', 'Stay beside it the whole way, every boat matching the slow boat\'s pace', 'Tow it as fast as possible'],
        answer: 1,
        right: 'That is what they did. A moving fence of boats, all the way down the Pampa — every fast boat rowing exactly as slowly as the slowest one needed.',
        wrong: 'That would have left it alone on the dark water again. They stayed beside it — a moving fence of boats, every fast boat rowing exactly as slowly as the slowest one needed.'
      } },
    { art: ['courtier'], who: null,
      text: 'The feast arrived. The temple fed everyone, with nobody turned away. And the story smiles and says that Parthasarathy — who spent the great war not fighting but steering, right beside one man who needed him — was pleased that year, and not mainly by the food.' },
    { art: ['krishna', 'courtier'], who: null,
      text: 'So it became the rule, and then the festival. Every year in the Onam season, the snake boats of the Pampa villages come back and go down the river with the feast boat — oars flashing in time, the boat songs called vanchipattu keeping the stroke, thousands singing on the banks.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'And at Aranmula, the elders will tell you, it is not truly a race at all, whatever it looks like. The boats arrive together, because they are doing what their great-great-grandfathers\' boats did: escorting the feast, at the pace of the one who needs them. The day is only ruined if somebody arrives alone.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Afterwards the rowers themselves are fed a proper feast — the valla sadya, one of the biggest meals served anywhere in Kerala. Fair enough, too. A hundred people who rowed all that way slowly, on purpose, have earned it.' }
  ],
  moral: 'Fast is good fun, but the feast was saved by everyone agreeing to travel at the speed of the slowest boat.',
  source: 'The legend of the Aranmula vallamkali, held in the Onam season on the river Pampa around the Aranmula Parthasarathy temple, Kerala; the valla sadya for the oarsmen continues. Oral tradition, many tellings.'
},

{
  id: 'fk.cheraman-moon',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The King Who Followed the Moon',
  hook: 'One night the king of the Kerala coast dreamed the moon split in two. He could not rest until he knew what it meant — and the answer changed his whole life.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['चाँद', 'chaand', 'moon'], ['सपना', 'sapna', 'dream'], ['यात्रा', 'yaatra', 'journey']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'This is the story Kerala\'s Muslims tell about how their faith first came home to India, and it is theirs, and it is told here the way they tell it — with love. It begins in Kodungallur, the great port of the spice coast, where ships came in from Arabia and China and everywhere between, and a king called Cheraman Perumal ruled.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'One night the king dreamed. He saw the full moon over the sea split cleanly into two halves — and then draw together and become whole again. He woke with his heart pounding, and the dream would not fade the way dreams do. It sat in his chest like a stone in a shoe.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'His own wise men turned the dream over and could not open it. Then a ship came in from Arabia, and the merchants aboard, asked politely about news from their country, said something that made the king sit slowly forward on his throne. Far away, in a city called Mecca, people spoke of a teacher — the Prophet Muhammad, whose name Kerala\'s Muslims never say without adding a blessing after it — and of a sign connected with him: the moon, seen parted in the sky.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'The king went very quiet. His dream, walking around in other men\'s mouths, from the other side of the sea.',
      ask: {
        q: 'A king cannot just leave. He has a whole country to run. What does he do about the question burning in him?',
        options: ['Send a messenger to go and look for him', 'Go himself — some questions cannot be answered second-hand', 'Decide to forget the dream'],
        answer: 1,
        right: 'That is what he chose. Some questions you cannot send a servant to ask for you. The heart that carries the question has to make the journey.',
        wrong: 'He thought about that, the story says, and knew it would never be enough. Some questions you cannot send a servant to ask. The heart that carries the question has to make the journey.'
      } },
    { art: ['courtier', 'guard'], who: null,
      text: 'So he did what almost no king in any story does: he set his kingdom in order to run without him. He divided the duties of the land among his governors, settled every account, said what needed saying — and then walked down to his own harbour and boarded a ship west, watching his green coast slide away behind him.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'And the tradition tells that he reached Arabia, and met the Prophet, and asked his question at last, face to face. And that his heart, which had been restless since the night of the dream, went still and certain — the way a boat goes still when it finally reaches harbour. He chose the new faith there, with both hands.' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'He set out for home, longing to tell his own people what he had found. The story says his journey ended quietly on the way, in a harbour town on the Arabian shore. But his letters travelled on without him, carried by his companions — east, across the sea, to the coast he could see when he shut his eyes.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'And at Kodungallur, where he had been king, his friends were welcomed — that is worth noticing; they were welcomed — and a mosque was built. Not a grand dome from a far country: a small Kerala building, with sloping tiled roofs like the temples and houses around it, and an old brass lamp burning inside. Tradition calls it the Cheraman Juma Masjid, the first mosque in India, named for the king who followed his question.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The mosque stands in Kodungallur to this day, rebuilt and loved, and here is the detail to keep: neighbours of every faith bring oil for that old lamp. Mosque, temple and church have shared Kerala\'s streets for a very long time — and this is the story the coast tells about how that began.' }
  ],
  moral: 'He had a whole kingdom, and he traded it for an answer his heart needed — and his country ended up keeping both the kingdom and the answer.',
  source: 'The Cheraman Perumal legend of the Cheraman Juma Masjid at Kodungallur, Kerala — a tradition cherished by Kerala\'s Muslims and told here as the tradition tells it. The mosque stands, and its lamp is kept burning with oil brought by neighbours of every faith.'
},

/* ========================================================== TAMIL NADU ====== */
{
  id: 'fk.avvaiyar-naaval',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Fruit That Needed Blowing On',
  hook: 'The wisest woman in the Tamil country sat down under a tree to rest — and a small boy in the branches asked her one question that undid her.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['फल', 'phal', 'fruit'], ['रेत', 'ret', 'sand'], ['सीखना', 'seekhna', 'to learn']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Avvaiyar was old before most stories about her even begin — a white-haired poet who walked the whole Tamil country on her own two feet, owning nothing but her verses. Kings stood up when she came in. Tamil children still learn her sayings before they learn almost anything else. She was, everyone agreed, the wisest person in the land — and by now, quietly, she agreed too.' },
    { art: ['courtier'], who: null,
      text: 'One blazing afternoon, tired and thirsty on a long road, she sat down in the shade of a naaval tree — the jamun, whose dark purple fruit stains your tongue like ink. High in the branches, a small cowherd boy sat swinging his legs.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: '"Paatti," the boy called down — grandmother — "would you like some fruit?" "Very much," said Avvaiyar. And then the boy asked his question. "Shall I give you roasted fruit, or unroasted fruit?" In his Tamil it sang: sutta pazham, sudatha pazham?' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Avvaiyar sighed at the silliness of children. Fruit does not roast on trees. But she was hot and tired and the fruit looked wonderful, so she played along. "Roasted, then," she said. And the boy shook his branch.' },
    { art: ['courtier'], who: null,
      text: 'The ripe jamuns rained down into the sand at her feet. She gathered them up — and, without thinking, blew on each one, phoo, phoo, to puff the sand off before eating it.' },
    { art: ['guard'], who: 'guard', mood: 'wow',
      text: 'A small voice floated down from the branches, innocent as morning. "Careful, paatti. Are they too hot? I see you are blowing on them to cool them."' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Avvaiyar stopped with a jamun halfway to her mouth. The wisest woman in the Tamil country. Standing in the sand, blowing on a roasted fruit. Beaten — completely, sweetly, fairly beaten — by a cowherd child in a tree.',
      ask: {
        q: 'What does the wisest person in the country do when a child catches her out?',
        options: ['Pretend it was all a joke she was in on', 'Walk away quickly before anyone sees', 'Laugh at herself, and say out loud: I still have things to learn'],
        answer: 2,
        right: 'That is exactly what she did — and it is the reason she is in this story, and the reason she was truly wise. Only a big mind can enjoy being wrong.',
        wrong: 'Not Avvaiyar. She threw back her head and laughed at herself, and said it out loud: I still have things to learn. Only a big mind can enjoy being wrong.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      text: 'And when she looked up to salute the child properly, the branches were full of light. The Tamil country tells that the boy was Murugan himself — the beloved god of these hills, who loves the Tamil language and loves a good game even more — come down to remind his old poet of one last thing while there was time.' },
    { art: ['courtier'], who: 'courtier',
      text: 'Avvaiyar bowed to the tree, and the saying tradition gives her from that day is still on Tamil tongues: "Katrathu kai mann alavu; kallathathu ulagalavu." What I have learned is a handful of sand. What I have not learned is the whole wide world.' },
    { art: ['courtier'], who: 'mithu',
      text: 'She picked up her stick and walked on, and kept walking and kept learning to the end of her long days. A handful of sand, mind you — from the woman who knew more than anyone. Weigh your own handful sometime.' }
  ],
  moral: 'The day you are sure you have finished learning, there is a child in a tree waiting for you.',
  source: 'The Avvaiyar and the naaval tree story, from Tamil oral tradition — told of the beloved elder poet whose verses Tamil children still learn first. Many tellings.'
},

{
  id: 'fk.kannagi-anklet',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Anklet Full of Rubies',
  hook: 'They said her husband stole the queen\'s anklet. Kannagi walked into the palace holding its twin — and asked the king to look inside it.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-TN'],
  words_hi: [['पायल', 'paayal', 'anklet'], ['सच', 'sach', 'truth'], ['न्याय', 'nyaay', 'justice']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In the great port city of Puhar, where the Kaveri meets the eastern sea, there lived a young couple: Kannagi, patient and steady as a lamp flame, and her husband Kovalan, who was charming, and generous, and not very careful.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'The money ran out. Some of that was Kovalan\'s own doing, and he knew it, and it sat heavily on him. What was left to them, in the end, was one treasure: Kannagi\'s pair of golden anklets — silambu, the Tamil calls them — hollow gold, each one filled with rubies that whispered like rain when she walked.' },
    { art: ['courtier', 'guard'], who: null,
      text: '"We will start again," said Kannagi, and meant it. They walked all the long way to Madurai, the city of the Pandyan kings, and Kovalan took one of her anklets to the market to sell, so they could open a small shop and begin their life over.' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'But in that city, the queen\'s own anklet had lately gone missing — taken by the royal goldsmith himself, who now needed, urgently, somebody to blame. And here came a dusty stranger, holding out a golden anklet. The goldsmith went to the king. The king was busy, and angry about the theft, and he did not ask the one question a king must always ask. He did not check. And Kovalan did not come home.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'When the word reached Kannagi, she wept — once, hard, like a monsoon breaking. And then she stopped. She stood up, and picked up the second anklet, and walked through the streets of Madurai to the palace gates with it held high in her fist, and the whole city came out of its doorways and followed her.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      text: 'She stood before the throne of the Pandyan king, one small woman in a travelling sari, and her voice did not shake. "Your goldsmith says my husband stole the queen\'s anklet. Here is its twin, from my own ankle. Tell me, King — what is inside the queen\'s anklets?"',
      ask: {
        q: 'Two golden anklets that look exactly alike. How can anyone prove whose is whose?',
        options: ['Swear an oath before the gods', 'Open them — and see what is sealed inside', 'Ask the goldsmith to decide'],
        answer: 1,
        right: 'Exactly what Kannagi had come to do. The queen\'s anklets were filled with pearls. And Kannagi knew, better than anyone alive, what was inside her own.',
        wrong: 'Kannagi had come with something better than words. Anklets are hollow, and filled — and the queen\'s were filled with pearls. Kannagi knew what was inside her own.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      text: '"Pearls," said the king. "The queen\'s anklets hold pearls." Kannagi raised her arm and broke her anklet open on the stones before the throne — and rubies burst across the floor like red rain, bouncing and rolling to the feet of every courtier in the hall. The silence after them was the loudest sound Madurai ever heard.' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'The king understood everything in a single heartbeat — the goldsmith\'s lie, his own haste, the innocent man, the question he had not asked. The old epic says his heart could not carry it, and stopped, there on the throne; and the queen\'s followed his. A king\'s mistake, the epic is careful to say, cost the king everything too.' },
    { art: ['courtier'], who: null,
      text: 'And Kannagi\'s grief, the epic tells, blazed so hot that the old city itself never forgot it. That part of the story is for when you are older — ask, when you are ready, how Madurai remembers that night. What matters here is what came after: the Tamil land did not let her go.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'They made her a goddess. Pattini, the faithful one — honoured in Tamil Nadu, honoured in Kerala, where old tradition links her to the great temple at Kodungallur, honoured across the sea in Sri Lanka. A woman who walked into a palace with the truth in her fist, and won.' },
    { art: ['courtier'], who: 'mithu',
      text: 'On Marina Beach in Chennai her statue stands today, facing the sea, the anklet raised in her hand — still asking her question. It is a good question to keep: before anyone is blamed for anything, did somebody check?' }
  ],
  moral: 'One person with the truth in her hand outweighs a palace — and a judge who does not check is not judging at all.',
  source: 'Silappadikaram, the Tamil epic of Ilango Adigal — the story of Kannagi and the anklet. The epic\'s fiery ending is pointed to here rather than told, and the source says so. She is honoured as Pattini in Tamil Nadu, in Kerala tradition at Kodungallur, and in Sri Lanka.'
},

{
  id: 'fk.karikala-kaveri',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Boy With the Fire-Marked Leg',
  hook: 'They shut the boy prince away so he could never be king. What happened next gave him his name — and gave a river its master.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['बाढ़', 'baadh', 'flood'], ['आग', 'aag', 'fire'], ['किनारा', 'kinaara', 'riverbank']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Long, long ago in the Chola country — so long ago that this was already an old story when most old stories were new — a king\'s story ended while his son was still a small boy. And the men who wanted the throne for themselves looked at the boy, and had him taken far away, and kept shut in a house, and meant to keep him there forever.' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'One night, fire broke out in that house. Smoke, roaring, falling beams — a night no child should ever have. But this child kept his head. He wet a cloth, held it to his face the way he had been taught, found the one gap in the flames, and walked out of that burning house alive. The fire touched him only once: along one leg, leaving a mark he would carry all his life.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      text: 'And that mark became his name. Kari-kala: in Tamil, "the one with the charred leg." Now — plenty of princes would have hidden a mark like that under fine cloth. Karikala wore his name like a medal, his whole life. Because it did not say "the boy who was burned." It said: "the boy who walked out."' },
    { art: ['courtier'], who: null,
      text: 'In time the elders of the land came looking for the true heir, and found him, and hesitated — for he was still barely more than a child. "The Chola country cannot be ruled by a boy," they murmured. One old telling says Karikala answered that without a single argument.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      text: 'A difficult dispute was brought to the court — two stubborn parties, a tangle of claims, the kind of case that makes wise heads ache. And an aged judge nobody quite recognised, grey-haired and slow-moving, heard it all patiently and untangled it so cleanly that both sides went home satisfied. Then the judge straightened up, and pulled off the grey — and it was the boy, smiling. The elders bowed. That telling may have grown in the telling, but Tamil country has loved it for a thousand years, so it stays.' },
    { art: ['guard'], who: null,
      text: 'So Karikala was king. And the greatest matter in his kingdom was not an enemy or a treasury. It was the river. The Kaveri — mother and monster both. She watered every field in the land; and then, some years, she rose in flood and took the fields, the houses and the harvest all at once.',
      ask: {
        q: 'How do you fight a river that you also love and need?',
        options: ['Build a great dam and shut her off completely', 'Raise long banks to guide her, and lay a low stone wall across her — not to stop her, but to share her out', 'You cannot — just pray and rebuild every year'],
        answer: 1,
        right: 'That was Karikala\'s answer. Not a wall against the river — a handshake with her. Guide her, slow her, and share her water out among all the fields.',
        wrong: 'Karikala loved the river too much to shut her away — and respected her too much to only pray. He guided her with long banks, and shared her with a low stone wall. A handshake, not a fight.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      text: 'He set the whole country to work raising great embankments along her length, so the flood had somewhere to be. And tradition credits him with the boldest stroke of all: the Kallanai — a long, low weir of fitted stone laid right across the Kaveri, which does not stop the river but gently divides her, sending her water spreading out through channels to field after field after field.' },
    { art: ['courtier'], who: null,
      text: 'A stone barrage stands across the Kaveri at that spot today — ancient beyond easy counting, repaired and repaired again, and still doing its work: the rice country of the delta drinks through it every single season. Tradition points at it and says, simply: the boy with the fire-marked leg built that.' },
    { art: ['guard'], who: 'mithu',
      text: 'Fire gave him his name when he was small and alone. He spent the rest of his life answering it with water. That is one way to grow up, and not the worst one.' }
  ],
  moral: 'What hurts you can end up naming you — and what you build with it can outlast every palace in the story.',
  source: 'Traditions of Karikala Chola, from Sangam poetry and later Tamil legend — the fire, the name, and the Kallanai across the Kaveri that tradition credits to him. Old tellings differ; where this one leans on a single telling, it says so.'
},

/* =========================================================== KARNATAKA ====== */
{
  id: 'fk.obavva-onake',
  collection: 'desh-south',
  badge: 'katha',
  title: 'Obavva and the Crack in the Rocks',
  hook: 'An army found a secret way into the fort — a gap in the rocks just wide enough for one man at a time. It had not counted on the woman fetching water.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['किला', 'kila', 'fort'], ['दरार', 'daraar', 'crack'], ['हिम्मत', 'himmat', 'courage']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'Chitradurga is a fort like a stone wave — seven rings of wall climbing over enormous round granite hills, in the dry heart of Karnataka. In the days this story happened, an enemy army had camped outside it for months, trying gate after gate, and getting nowhere. Forts like Chitradurga do not open.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'On the walls stood watchmen, day and night, and one of them was a man named Kahale Mudda Hanuma, whose post guarded a quiet corner where a stream slipped out through the rocks. At midday his wife Obavva sent word that his meal was ready, and he handed his watch to the quiet corner itself — what could happen at lunchtime? — and went home to eat.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Obavva walked down to the pond by the walls to fetch water while he ate. And as she bent with her pot, she heard something under the birdsong that did not belong: a clink. A whisper. Coming from inside the rocks.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'She crept closer. There, behind the water channel, was a kindi — a crevice, a crack in the great stones, just wide enough for one crawling man — and in its darkness, things were moving. The army outside had found what months of attacking the gates had not: a way in. And they were coming through it, one man at a time.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Think about her next few seconds, because everything lived inside them. Run for her husband — minutes lost, the crack unwatched, a dozen men through and the gate opened from inside. Scream — and the men in the crack rush, and the men outside charge. In her two hands she held the only thing she had carried from her kitchen: the onake — the long, heavy wooden pestle that Kannada kitchens pound rice with.',
      ask: {
        q: 'What can one woman with a rice pestle do about an army coming through a crack?',
        options: ['Run and fetch the guards, whatever it costs', 'Stand flat beside the gap, silent and still, and stop each man as he comes through', 'Hide and hope they pass by'],
        answer: 1,
        right: 'That is what Obavva chose, in the time it takes to set down a water pot. The crack let in only one man at a time. So only one man at a time would ever get in.',
        wrong: 'Obavva saw what the crack itself was telling her: it let in only one man at a time. So she stood flat against the rock beside it, silent and completely still — and only one man at a time would ever get in.'
      } },
    { art: ['courtier'], who: null,
      text: 'She pressed herself against the warm stone beside the opening and went as still as the hill itself. A helmet came slowly out of the dark. The onake swung once. The man dropped without a sound, and she drew him quietly aside — so that the next man, hearing nothing, kept coming.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'And the next. And the next. Her whole weapon was stillness. Outside the walls, the army kept feeding men into the crack and hearing only silence, which they took for success. Inside, by the pond, one woman stood in the sun with a rice pestle, guarding an entire fort alone, and did not once cry out, and did not once step back.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'When her husband came back from his meal he found his post held — by Obavva, pestle in hand, breathing hard, with a line of enemy soldiers lying quiet along the wall behind her. His conch blast raised the whole fort. Soldiers came running, the crack was sealed with stone, and Chitradurga did not fall that day.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'The old tellings say Obavva\'s own story ended that same evening, quietly, as if the day had asked everything she had and she had given all of it. Karnataka has never stopped saying her name.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Go to Chitradurga today and they will walk you to the very spot — it is called Onake Obavvana Kindi now, the crack of Obavva of the pestle — and you can stand where she stood. It is a very ordinary-looking crack in a rock. That is rather the point.' }
  ],
  moral: 'Courage is not always loud. Sometimes it is one person deciding to stand completely still in exactly the right place.',
  source: 'The legend of Onake Obavva at Chitradurga fort, from Karnataka oral tradition; the cleft in the rocks, Onake Obavvana Kindi, is shown to visitors today. Told here without the battlefield details of some tellings.'
},

{
  id: 'fk.gullakayajji',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Grandmother\'s Little Cup of Milk',
  hook: 'Rivers of milk were poured over the tallest statue in the land — and every drop stopped halfway down, until an old woman climbed the hill with a cup.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['दूध', 'doodh', 'milk'], ['घमंड', 'ghamand', 'pride'], ['छोटा', 'chhota', 'small']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'At Shravanabelagola in Karnataka, on top of a bare granite hill, stands one of the wonders of the world: Bahubali — Gommateshwara — carved from a single stone, so tall that clouds seem to brush his shoulders, standing so perfectly still that the sculptors carved vines twining up his legs. You may have heard his story already: he is the one whose raised fist stopped.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'The statue was made at the order of Chavundaraya, a great minister, and it had taken years, and it was magnificent, and he knew it. Now came the day of the first anointing — when milk would be poured over the statue\'s head from scaffolding high above, to run shining down the whole great figure from crown to feet.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'Up went the pots — huge ones, hundreds of them, milk enough for a river. Down came the milk over the stone head, down over the shoulders — and stopped. Halfway. It simply would not flow further, as if the stone itself had closed a door. They poured again. It stopped again, at the same line, and trickled away sideways into nothing.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Chavundaraya checked everything a thorough man checks. More milk. Purer milk. Louder chanting, holier priests, costlier pots. The crowd stood hushed on the hilltop and the milk stopped halfway every single time, and nobody could say why.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'At the edge of the crowd stood a small old woman the guards had twice waved back. An ajji — a grandmother, in Kannada — so poor and so ordinary that nobody had asked her name. In her two hands she held her offering: milk, carried up the whole long hill in a gullakayi, a little cup made from a hollowed gourd shell. Enough milk, perhaps, for a kitten.',
      ask: {
        q: 'The minister\'s thousand pots have failed. Whose offering should be tried next?',
        options: ['Even bigger pots, from an even richer donor', 'The grandmother\'s little gourd cup', 'None — the anointing should be abandoned'],
        answer: 1,
        right: 'A wise elder in the crowd said exactly that: let the ajji pour. And the guards stood aside, and the small old woman began to climb.',
        wrong: 'It was the opposite that was needed, and a wise elder in the crowd saw it: let the ajji pour. And the guards stood aside, and the small old woman began to climb.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'She reached the top, caught her breath, tipped her little gourd cup over the statue\'s head — and the milk flowed. Over the shoulders. Down the arms, down past the carved vines, over the feet, until the whole colossal figure stood gleaming from crown to toe, anointed at last — by about half a cup of milk.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Chavundaraya stood in the crowd and understood, all at once, what the stone had been telling him. The statue of the man who gave up everything had been about to become one more thing for a rich man to be proud of. His milk was full of pride. Hers was full of nothing but love — and love, it turns out, flows further.' },
    { art: ['courtier'], who: null,
      text: 'The great minister walked over to the small grandmother and bowed to her, all the way down, in front of everyone. It was the second wisest thing he ever did. The wisest was what came next: he made sure nobody ever forgot her.' },
    { art: ['courtier'], who: 'mithu',
      text: 'At Shravanabelagola today they will show you a small statue of Gullakayajji herself, standing near the great one, her little gourd cup in her hands. And every twelve years, at the great head-anointing festival, the milk pours again — and this story gets told again, first.' }
  ],
  moral: 'It is not the size of the cup. It is what the heart carries up the hill in it.',
  source: 'The Gullakayajji legend of Shravanabelagola, Karnataka, told of the anointing of the Gommateshwara statue; her small statue stands on the hill, and the story is retold at each Mahamastakabhisheka. Jain and Kannada oral tradition.'
},

{
  id: 'fk.kaveri-pot',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The River in the Sage\'s Pot',
  hook: 'The whole south was thirsty, and the water it needed was inside one small brass pot — until a crow tipped it over.',
  hero: 'courtier',
  cast: ['courtier', 'ganesha', 'pt_crow'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['घड़ा', 'ghada', 'pot'], ['कौआ', 'kauwa', 'crow'], ['प्यास', 'pyaas', 'thirst']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'High in the misty hills of Kodagu — Coorg, the coffee country of Karnataka — there is a small spring on a mountainside called Talakaveri: "the head of the Kaveri." A whole great river starts there, in a pool you could step across. And this is the story of how she got out.' },
    { art: ['courtier'], who: null,
      text: 'The sage Agastya — the small, mighty sage of the south, whom you will meet again in these stories — carried a kamandalu, the little water-pot that wandering sages carry. And in that pot, the legend says, was no ordinary water. It was Kaveri herself: a goddess who had chosen, of her own free heart, to become a river, so that the south would never go hungry.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'But a river can only be poured out once, so it must be done right — and Agastya meant to do it perfectly. The perfect hillside. The perfect hour. He walked the hills with the pot in his hand, considering and rejecting, considering and rejecting, while inside the pot a goddess waited, and waited, and waited to run.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'And down below, the land was cracking. The rains had failed and failed again. Farmers stood in dust that had been fields, looking at the sky. The south was thirsty now — and perfect was taking years.' },
    { art: ['ganesha'], who: null,
      text: 'Ganesha had been watching all of this — the pot, the waiting goddess, the cracked fields — and Ganesha, who loves solving things sideways, decided the waiting had gone on exactly long enough. He made himself small, and feathered, and black: a little crow.' },
    { art: ['pt_crow', 'courtier'], who: null, mood: 'wow',
      text: 'The crow flapped down while the sage stood in prayer, hopped along a branch, perched neatly on the rim of the kamandalu — and tipped it right over. The water leapt out onto the hillside.',
      ask: {
        q: 'Was the crow just being naughty?',
        options: ['Yes — crows love mischief', 'No — the wait was over. Thirsty fields cannot drink "perfect"', 'It only wanted the shiny pot'],
        answer: 1,
        right: 'That is the heart of it. Somewhere below, children were hungry. Perfect had had its chance. The crow chose now.',
        wrong: 'It looked like mischief — good tricks always do. But somewhere below, children were hungry, and perfect had had its chance. The crow chose now.'
      } },
    { art: ['courtier', 'ganesha'], who: null,
      text: 'Agastya spun round with his hand raised to shoo the wretched bird — and the crow became a round, grinning boy, and the sage froze mid-swing. Ganesha. He had very nearly swatted Ganesha. Mortified, the sage rapped his own knuckles against his own temples in apology — and Ganesha laughed with delight. To this day, people knock their knuckles gently on their heads before Ganesha, and this story claims that is where it began.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'And the spilled water? It rose from the grass, and laughed, and became a girl, and became a stream, and went dancing away downhill — Kaveri, free at last, running for the sea. Through the hills of Kodagu, out across the wide fields of Karnataka, on into Tamil country — the very river a boy king with a fire-marked leg would one day lay a stone wall across, to share her out.' },
    { art: ['courtier'], who: 'mithu',
      text: 'At Talakaveri a small tank marks the spring, and once a year, at the Kaveri Sankramana, families gather to watch the water rise. The Kodava people of those hills do not merely call her a river, either. They call her Kaveramme — Mother Kaveri. She fed everyone, exactly as she chose to. The crow just opened the door.' }
  ],
  moral: 'Perfect is a fine thing to wait for, but thirsty fields cannot drink perfect. Sometimes the kindest thing in the story is the one who tips the pot.',
  source: 'The origin legend of the Kaveri told at Talakaveri in Kodagu, Karnataka, where the Kaveri Sankramana is kept each year — joined, as the tradition joins it, to Agastya\'s kamandalu and Ganesha\'s crow. Many tellings.'
},

{
  id: 'fk.story-song',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Story That Wanted Out',
  hook: 'A woman knew one story and one song, and never told them to anybody. So one night, while she slept, they escaped.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'hanuman'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['कहानी', 'kahaani', 'story'], ['गाना', 'gaana', 'song'], ['बताना', 'bataana', 'to tell']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In a village in the Kannada country there lived a woman who knew exactly one story and one song — her own grandmother had given them to her, mouth to ear, the way you hand over jewellery. And somehow, she had never once told them. There was cooking. There was the buffalo. There was always tomorrow. The story and the song stayed shut inside her for years.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Now, here is a thing not everybody knows. Stories and songs are alive, and an untold story gets cramped. Hers sat inside her like two birds in a cage gone too small — wings folded, fidgeting, year after year — until one night they had simply had enough.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'That night she slept with her mouth open. And out they slipped, one after the other, quiet as breath. But a story that is out in the world must be something — so the story hung itself up on the peg by the door and became a man\'s coat. And the song hopped down below it and became a pair of shoes.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: 'Her husband came home late from the fields, lifted the lamp — and stopped dead. "Whose coat is this?" A strange coat on his peg. Strange shoes beneath it. A visitor, at this hour, and where was he? "Whose ARE these?" And his wife, blinking awake, gave the worst possible true answer: "I have no idea." Which, you will agree, did not help.' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'He was too hurt to shout. He took his blanket and stalked off through the dark to sleep in the Monkey God\'s temple at the end of the street, the way men in that village sulked when sulking was serious. His wife lay awake, staring at a coat she had never seen, in a house gone suddenly cold.' },
    { art: ['hanuman'], who: null, mood: 'wow',
      text: 'But the temple at the end of the street was not empty at night. Oh no. That temple was where the flames went. When every lamp in the village is blown out for the night, its flame does not die — it slips off to the temple to sit up late with the other flames, gossiping about their households. And in they came now, flame after little flame, settling in rows like sparrows.' },
    { art: ['hanuman', 'courtier'], who: null,
      text: 'His own house\'s flame came in last, and the others pounced. "Late again! What kept you?" "What a night at ours," sighed the little flame. "You know my mistress keeps a story and a song locked up and never tells them? Tonight they escaped while she slept — one is hanging on the peg being a coat, the other is being shoes — and now the master thinks a stranger has come, and he is sulking right here in this temple, and everyone is miserable over two runaways." The flames all clucked like aunties.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'And behind a pillar, one wide-awake husband lay very still with his blanket to his chin, listening to his own lamp discuss his marriage.',
      ask: {
        q: 'What should he do with what he just overheard?',
        options: ['March home and scold his wife for keeping secrets', 'Go home gently, and ask her to tell the story and sing the song at last', 'Say nothing, ever, to anyone'],
        answer: 1,
        right: 'That is what he did, first thing in the morning — and it is the only ending where everybody, including the story, gets to go home.',
        wrong: 'None of it was a secret she had kept — it was a story she had starved. He went home gently in the morning and asked her to tell it at last.'
      } },
    { art: ['courtier'], who: null,
      text: 'In the morning he asked, and she began — slowly at first, finding it, then faster, then glowing — and as she told the story and sang the song at last, she remembered why her grandmother\'s voice had always gone soft in exactly one place. When she finished, the peg by the door was empty. Coat and shoes both gone — home, into the telling, where they lived.' },
    { art: ['courtier'], who: 'mithu',
      text: 'This is a story about stories, so mind how you treat it. If you know one — and you do, you know this one now — tell it to somebody. Stories shut in a mouth go stale like rice shut in a pot. And they will get out anyway. They always get out.' }
  ],
  moral: 'A story kept shut away goes stale, and then it escapes on its own. Tell it — telling is what a story is for.',
  source: 'A Kannada folktale — "A Story and a Song" — collected and retold by A. K. Ramanujan. Many household tellings across Karnataka.'
},

/* ====================================================== ANDHRA PRADESH ====== */
{
  id: 'wt.tenali-vikatakavi',
  collection: 'chatur',
  badge: 'katha',
  title: 'The Boy Who Made the Goddess Laugh',
  hook: 'The goddess appeared to a boy at midnight with two bowls — one of riches, one of learning — and told him to choose one. He did something nobody had ever dared.',
  hero: 'courtier',
  cast: ['courtier', 'durga'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['हँसना', 'hansna', 'to laugh'], ['विद्या', 'vidya', 'learning'], ['धन', 'dhan', 'wealth']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In the town of Tenali, in the green delta country of Andhra, there lived a boy called Rama — poor, fatherless, and with a tongue so quick that his mother despaired of him at least once a day. The world would come to know him as Tenali Raman, the funniest man in the south. But first, this had to happen.' },
    { art: ['courtier'], who: null,
      text: 'A wandering holy man, amused by the boy\'s wit, taught him a sacred chant, and told him: go alone to the temple of the great goddess Kali at midnight, and recite it, and do not stop, whatever happens. Most people would not even try. The boy went that same night.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Alone in the dark temple, a little afraid — which is the only honest way to be — he sat down and chanted, and did not stop. The lamps guttered. The dark got thick. He chanted. And at midnight, the temple filled.' },
    { art: ['durga'], who: null, mood: 'wow',
      text: 'The great Mother came — vast and shining, with so many faces that every lamp in the temple found one to light. It is the kind of sight that flattens grown heroes to the floor. The boy looked up at her, all those magnificent faces — and giggled. And clapped his hand over his mouth. And giggled again. He could not stop.' },
    { art: ['durga', 'courtier'], who: null,
      text: 'The goddess was genuinely astonished. Sages tremble before her. Kings faint. Nobody — nobody in all the ages — giggles. "Child," she said, and her voice was the temple itself, "what, exactly, is funny?"' },
    { art: ['courtier', 'durga'], who: 'courtier', mood: 'wow',
      text: 'The boy pulled himself together, mostly. "Amma," he said, "forgive me. But when we people catch a cold, we have just one nose to manage, and it keeps us up all night. And I was looking at all your beautiful faces and thinking — Amma, when YOU catch a cold, however do you cope?" There was a terrible silence. And then the temple rang like a bell, because the goddess was laughing.' },
    { art: ['durga', 'courtier'], who: null, mood: 'think',
      text: 'Wiping her eyes, she held out two bowls. "You have earned a gift. This is the milk of learning — drink it and be the wisest of scholars. This is the curd of riches — drink it and want for nothing. Choose one, child. Only one."',
      ask: {
        q: 'Learning in one bowl, riches in the other, and you may have only one. What does the boy do?',
        options: ['Take the milk of learning', 'Take the curd of riches', 'Find a way to have both'],
        answer: 2,
        right: 'Of course he did. "May I hold them a moment, Amma, to help me decide?" And the moment they were in his hands, he drank both, straight down, one after the other.',
        wrong: 'This is Tenali Raman we are talking about. "May I hold them a moment, Amma, to help me decide?" And the instant they were in his hands he drank both, straight down.'
      } },
    { art: ['durga', 'courtier'], who: null,
      text: 'She could have been angry. Anyone else, she might have been. But she looked at this impossible child — too clever for one bowl, too honest to pretend he wasn\'t — and gave him instead a stranger and better blessing. "You will never be solemn enough for a scholar nor greedy enough for a rich man. You will be rarer than either: a vikatakavi. A jester-poet."' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: '"And note the word, child," she said, already fading into the lamplight. "Vi-ka-ta-ka-vi. It reads the same forwards and backwards — like you. Nobody will ever be quite sure which way you are facing." And that is precisely what he became.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The boy from Tenali grew up and walked into the greatest court of the age — Krishnadevaraya\'s, at Vijayanagara — and kept kings honest with jokes for the rest of his life. You will meet him again. He is usually facing both ways.' }
  ],
  moral: 'He was not fearless because nothing frightened him. He was fearless because he could find the funny thing standing right next to the frightening one.',
  source: 'The origin tale of the Tenali Ramakrishna cycle, from Telugu oral tradition. Tenali is in Andhra Pradesh; the court he later joined, Krishnadevaraya\'s Vijayanagara, lies in today\'s Karnataka. Told with Andhra, whose language the tradition speaks.'
},

{
  id: 'wt.tenali-book',
  collection: 'chatur',
  badge: 'katha',
  title: 'The Book That Did Not Exist',
  hook: 'A famous scholar challenged the whole court to debate him on any book ever written. Tenali Raman chose one the scholar had never read. Nobody had.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['किताब', 'kitaab', 'book'], ['बहस', 'bahas', 'debate'], ['डींग', 'deeng', 'boast']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'A visiting scholar arrived at the great court of Krishnadevaraya, trailing servants and certificates. He had, he announced, defeated the best minds of every kingdom from the mountains to the sea, and he would debate anyone present on any book ever written. Any book at all. He smiled around the hall and waited.' },
    { art: ['guard', 'courtier'], who: null, mood: 'sad',
      text: 'The court\'s own scholars looked at their feet. Each was master of some books — nobody is master of every book, and one slip against this man meant being laughed out of the profession. The silence stretched. The king\'s ears slowly went red. And then a familiar voice said, comfortably: "Oh, I\'ll debate him."' },
    { art: ['courtier'], who: null,
      text: 'Tenali Raman proposed the terms, all courtesy: tomorrow at dawn, before the full court, on a single great classic — a book he would name at the debate itself. The scholar, who had read everything, accepted with a small bow and a large smirk.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'That night Tenali went home and prepared with enormous care. Not by reading. He took a bundle of dried sesame stalks and a length of the rope used for tying up buffaloes, wrapped the whole thing grandly in embroidered silk, and went to bed early, extremely pleased with himself.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'At dawn he swept into court bearing the silk bundle with tremendous reverence and laid it on the debating table. "The text for today\'s debate," he announced, "that towering classic — Tilakashta Mahisha Bandhana." The scholar\'s smile stayed put while his eyes went completely still. He had never heard of it. And he could not say so.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'Watch him think, because his whole life had led him into this corner. Admit ignorance, in public, after that boast? Unthinkable. Debate a book he had never seen? Impossible.',
      ask: {
        q: 'What should the great scholar do?',
        options: ['Say the honest thing: "I do not know this book"', 'Bluff his way through the debate', 'Grab the bundle and open it'],
        answer: 0,
        right: 'That was the one move that would have saved him — and the one move his boasting had made impossible. Instead he bowed and asked for a night to "refresh his memory."',
        wrong: 'Either of those would have ended him faster. The only safe move was the honest one — "I do not know it" — and his boasting had made exactly that impossible. He bowed, and asked for a night to "refresh his memory."'
      } },
    { art: ['guard'], who: null,
      text: 'All night the scholar ransacked his trunks of books and his palace of a memory. Nothing. No Tilakashta Mahisha Bandhana anywhere in the world of letters. And when the court gathered at dawn, the great man\'s rooms were empty and his horse was gone — he had ridden out before first light, certificates and all.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'The king demanded to at least see this legendary book. Tenali untied the silk with great ceremony: sesame stalks and a buffalo rope. "Maharaja — in plain words: tila, sesame stalks. Kashta, dry wood. Mahisha bandhana, a rope for tying a buffalo. The title was simply telling everyone what was in the parcel. Nobody thought to ask." The court roared for a week.' },
    { art: ['courtier'], who: 'courtier',
      text: '"But what if he had opened it?" asked the king, wiping his eyes. "Maharaja," said Tenali, "a man who cannot say I don\'t know will never open anything. That is what I was debating. I won."' },
    { art: ['courtier'], who: 'mithu',
      text: '"I don\'t know" — three small words, and the measure of every scholar. The ones who really know things say them easily, and often, and first.' }
  ],
  moral: 'The truly learned say "I do not know" easily. It is only the boasters who cannot afford those three words.',
  source: 'From the Tenali Ramakrishna cycle, Telugu oral tradition — the tale of Tilakashta Mahisha Bandhana at Krishnadevaraya\'s court. Tenali is in Andhra; the court is Vijayanagara. Many tellings.'
},

{
  id: 'fk.paramananda-count',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Disciple Who Was Always Missing',
  hook: 'Ten disciples crossed the river. On the far bank they counted only nine — and the missing one was standing right there, counting.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-AP'],
  words_hi: [['गिनती', 'ginti', 'counting'], ['नौ', 'nau', 'nine'], ['दस', 'das', 'ten']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In the Telugu country there once lived a guru called Paramanandayya, a man of truly bottomless patience — which was fortunate, because his ten disciples were devoted, hardworking, and magnificently, dazzlingly foolish. Telugu grandmothers have been laughing about them for hundreds of years, and are not finished yet.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      text: 'One day the guru sent them on an errand to the next village, across the river. "All ten of you go together," he said slowly and clearly, "and all ten of you come back together. Count yourselves. Ten." The disciples repeated it all the way to the water: ten, ten, ten.' },
    { art: ['guard'], who: null,
      text: 'They waded across the river, holding hands and squealing, and climbed out dripping on the far bank. And the eldest, being responsible, lined everyone up and counted heads: one, two, three, four, five, six, seven, eight — nine. He went cold. He counted again. Nine!' },
    { art: ['guard', 'courtier'], who: null, mood: 'sad',
      text: 'Each disciple took a turn counting, and each, with perfect care, counted every head except the one his own eyes lived in. Nine. Nine. Nine, ten times over. There was only one possible explanation: the river had taken their tenth brother. And all ten of them sat down in a row on the bank and wept for him — which, you will notice, took ten people.',
      ask: {
        q: 'Ten disciples keep counting nine. What has actually gone wrong?',
        options: ['The river really has taken one of them', 'Every counter is forgetting to count himself', 'None of them can count past nine'],
        answer: 1,
        right: 'That is it exactly. Each one counted all his brothers perfectly — and left out the one head he could not see. His own.',
        wrong: 'Count with them and you will catch it. Each one counted his brothers perfectly — and left out the one head he could not see. His own.'
      } },
    { art: ['courtier', 'guard'], who: 'courtier',
      text: 'A traveller came down the road and found ten grown men weeping in a row. "Who has died?" "Our brother! We were ten, and now we are nine — count for yourself!" The traveller looked slowly along the line, and his lips moved, and something began to twitch at the corner of his mouth. "Suppose," he said gravely, "I find your tenth man. What will you give me?" "Everything in our bundles!"' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'In the telling I know best, he had each man press one thumbprint into the wet river clay, then stood back. "Now count the thumbprints." One, two, three... eight, nine — TEN. Ten thumbprints! The disciples leapt up whooping, embraced the traveller, embraced each other, and thanked the heavens for returning their brother from the river.' },
    { art: ['guard'], who: null,
      text: 'They pressed their bundles on the traveller, who took only a drink of water and walked on, shaking gently for the rest of the day. And the disciples hurried home to tell their guru of the tragedy and the miracle.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      text: 'Paramanandayya heard it all with his eyes closed — the drowning, the weeping, the wonderful stranger, the ten thumbprints. He took one long, slow breath, the kind that holds a laugh down where it cannot escape. "And who," he asked, "was the tenth man?" "That is the miracle, guruji! He never appeared — and yet his thumbprint was in the clay!"' },
    { art: ['courtier'], who: 'mithu',
      text: 'The guru kept them anyway, all ten — eleven, he liked to say, counting the one in the clay. And here is the trick, free of charge: when something seems to be missing, count yourself first. You are usually the one you forgot.' }
  ],
  moral: 'When something is missing, count yourself before you cry. You are usually the one you forgot.',
  source: 'From the Paramanandayya Sishyula kathalu — the Telugu comic cycle of the guru and his devoted, muddle-headed disciples. Oral, many versions; the counting mishap is one of the oldest of them.'
},

{
  id: 'fk.srikalahasti',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Spider, the Snake and the Elephant',
  hook: 'A spider, a snake and an elephant loved the same forest shrine. The trouble was, none of them knew about the other two.',
  hero: 'pt_elephant',
  cast: ['pt_elephant', 'shiva', 'courtier'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['मकड़ी', 'makdi', 'spider'], ['साँप', 'saanp', 'snake'], ['हाथी', 'haathi', 'elephant']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Long before there was a town, in the forest by the river Swarnamukhi — "the golden-faced river" of Andhra — there stood a shivalinga under the trees, with no priest, no bell, and no roof. Just stone, and quiet. And three creatures of the forest, each entirely alone, fell in love with it.' },
    { art: ['courtier'], who: null,
      text: 'The spider came first. And what does a spider have to give? Silk. So she gave it. High over the linga she wove a canopy, thread by thread by thread — a ceiling of silver lace to keep off the falling leaves and the beating sun. Every day something tore it. Every day she wove it whole again.' },
    { art: ['pt_elephant'], who: null,
      text: 'The elephant came at dawn, up from the river, with his trunk full of clean water. He washed the linga tenderly from top to bottom — sweeping away, though he never once noticed, a certain silver lace canopy — and then laid wild leaves and flowers on the clean wet stone, and stood a while, and went.' },
    { art: ['courtier'], who: null,
      text: 'And in the night came the snake, gliding, carrying the one treasure a serpent owns: a shining jewel, which he laid at the foot of the linga so it would gleam there in the dark like a small moon. In the morning the elephant\'s washing swept the jewel into the leaves. That night the snake found his gift flung aside — and the spider, above, found her canopy torn again.' },
    { art: ['pt_elephant'], who: null, mood: 'sad',
      text: 'Day after day it went on. Each of the three arrived to find their offering ruined, and each thought the same hurt thought: somebody is spoiling my worship. On purpose. The spider spun grimly. The snake coiled tighter round his jewel. The elephant washed harder.',
      ask: {
        q: 'Each one finds their gift swept away every single day. What is actually happening?',
        options: ['A thief comes in the night', 'Three kinds of love keep tidying each other away', 'The forest wind does it'],
        answer: 1,
        right: 'That is the whole heartbreak of it — and nobody in the story can see it, because each one is certain that worship looks like theirs.',
        wrong: 'No thief, no wind. Three kinds of love, each certain that worship looks like its own, each tidying the other two away without ever knowing they existed.'
      } },
    { art: ['pt_elephant', 'courtier'], who: null, mood: 'think',
      text: 'And so one grey dawn, all three arrived at once — the elephant with his water, the snake still coiled by his jewel, the spider on her thread — and the long misunderstanding stood up on its feet at last, hissing and trumpeting. The oldest tellings let what happened next go very badly indeed. This telling stops it in time — and tells you so.' },
    { art: ['shiva'], who: null, mood: 'wow',
      text: 'Because the stone itself had had enough. Shiva rose out of the linga in a blaze of gentle light and stood between them — the god all three had been loving, all along, alone. And he showed them, each to each: the silk was shade for him. The water was washing for him. The jewel was light for him. Three gifts. One love. The quarrel fell down dead where it stood, and the three of them looked at one another properly for the first time.' },
    { art: ['shiva', 'courtier'], who: null,
      text: 'And so that no one, ever, would forget the three of them, the place itself took their names. Sri, the spider. Kala, the snake. Hasti, the elephant. Say them together — Sri-kala-hasti.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Srikalahasti is a real town in Andhra Pradesh today, with a great temple by that same golden-faced river, and every pilgrim who walks in through the gate gets told exactly this story. The spider, the snake and the elephant have been in its name for as long as anyone can measure.' }
  ],
  moral: 'The one who undoes your offering may simply be making their own. Love comes in more shapes than yours.',
  source: 'The temple legend of Srikalahasti, Andhra Pradesh — the spider, snake and elephant held in the town\'s own name. In the oldest tellings the three give their lives in their devotion; this telling ends before that, and says so.'
},

{
  id: 'fk.lepakshi',
  collection: 'desh-south',
  badge: 'katha',
  title: 'Rise, Bird',
  hook: 'Rama found the great old bird lying among the rocks, too hurt to stand. What he said to him became the name of a village.',
  hero: 'rama',
  cast: ['rama', 'pt_heron', 'courtier'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['पक्षी', 'pakshi', 'bird'], ['उठो', 'utho', 'rise'], ['नाम', 'naam', 'name']],
  scenes: [
    { art: ['pt_heron'], who: null,
      text: 'You know the terrible turn of the Ramayana: Sita, carried away south through the sky. What you may not know is that one creature tried to stop it. Jatayu — the great eagle-king, huge and old, who had been mighty once and had been Rama\'s father\'s friend. He heard Sita cry out overhead, and he rose on his old wings, and he fought. He was old, and he lost.' },
    { art: ['courtier'], who: null,
      text: 'Now come down out of the epic for a moment, into the dry, boulder-strewn hills of Andhra — the country of huge tumbled rocks the colour of honey. Because the villages there will tell you it was here, among these very boulders, that the great bird came down.' },
    { art: ['rama'], who: null, mood: 'sad',
      text: 'Rama and Lakshmana came searching south, calling Sita\'s name into the empty country. And spread on a warm rock they found him — the enormous old bird, feathers scattered wide, one wing gone, his story nearly over. But his eyes were still bright, and he had been holding on. He had something to deliver.' },
    { art: ['pt_heron', 'rama'], who: null, mood: 'wow',
      text: 'With the strength he had saved, Jatayu told them everything: who it was that had taken her, and the way the chariot had gone, south, toward the sea. It was the first real news of Sita anyone had given them — the first thread of hope in all that terrible searching. The old bird had lost his fight, and delivered his message anyway.' },
    { art: ['rama', 'pt_heron'], who: null,
      text: 'Rama knelt on the rock and took the great scarred head into his lap, and grieved for him as a son grieves — for Jatayu had fought for Rama\'s family as family. And here the Telugu country adds its own two words to the epic. Rama looked at the fallen bird and said: "Le, pakshi." Rise, bird.',
      ask: {
        q: 'What can "rise" mean, said gently to somebody who cannot get up?',
        options: ['It is an order he must somehow obey', 'It is a blessing — rise beyond this tired old body; you are finished, and you finished well', 'Rama was simply mistaken about how hurt he was'],
        answer: 1,
        right: 'That is how the tradition hears it. Not a command to the body — a blessing to the one inside it. You did the bravest deed in the whole story. Now rise, and rest.',
        wrong: 'Rama could see exactly how things stood. The tradition hears it as a blessing — rise beyond this tired old body. You did the bravest deed in the whole story. Now rest.'
      } },
    { art: ['rama'], who: null, mood: 'sad',
      text: 'And the epic tells that Rama gave the old bird what a son gives a father — honour, and thanks, and a gentle letting-go — and that Jatayu finished his long story there in peace, in the god\'s own lap, having done the bravest thing in it. Then the brothers rose and walked on south, carrying his message all the way to the end of the war.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'But the two Telugu words stayed behind, on the spot where they were spoken. Le, pakshi. Say them quickly — Lepakshi. That is the village\'s name to this day.' },
    { art: ['courtier'], who: null,
      text: 'Centuries later, builders raised a temple at Lepakshi, as if the place had been holy all along — with a Nandi bull carved from a single rock so enormous you can see it from the road, and a famous pillar inside that people will delightedly show you does not quite rest on the ground. But ask anyone there what the name means, and you get the old bird, every time.' },
    { art: ['pt_heron'], who: 'mithu',
      text: 'Jatayu lost his fight. Completely. And a village has carried his memory in its name for thousands of years. Places do not name themselves only after the ones who win — they name themselves after the ones who tried with everything.' }
  ],
  moral: 'Trying with everything you have, and failing, can still be the deed a place keeps your name for.',
  source: 'The local legend of Lepakshi, Andhra Pradesh — "le, pakshi", rise, bird — joining the village to the Ramayana\'s Jatayu; the Veerabhadra temple with its hanging pillar and great stone Nandi stands there. Oral tradition, many tellings.'
},

/* ========================================================== PUDUCHERRY ====== */
/* Puducherry is four far-flung pieces on two coasts — Pondicherry and Karaikal on
   the Coromandel, Mahe on the Malabar coast, Yanam on the Godavari delta — and
   these seven stories deliberately use all four, because the geography IS the
   lesson. Where a legend belongs to a longer coast (Puhar, the Godavari, the
   Malabar fisher lore), the source line says so plainly. */
{
  id: 'fk.poompuhar-sea',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The City Under the Sea',
  hook: 'Fishermen on this coast will tell you: on very quiet nights, out past the surf, you can hear bells. There was a city out there once.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['शहर', 'shehar', 'city'], ['लहर', 'lehar', 'wave'], ['घंटी', 'ghanti', 'bell']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'The long east coast of the south is called the Coromandel, and Karaikal — the sea-side piece of Puducherry — keeps its own stretch of it: fishing boats, casuarina trees, surf you can hear from your bed. The fisher grandmothers of this coast tell a story about what lies out past the breakers, and it begins with the grandest city the coast ever had.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'Puhar, they called it — Kaveripoompattinam, the flower of the Kaveri — built where the great river met the sea. The old Tamil poems remember it glittering: ships from countries nobody could pronounce, warehouses of silk and pepper and pearls, streets of goldsmiths, a lighthouse burning all night, and music coming out of the windows.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'And the city had, the story says, an understanding with the sea. Every year Puhar kept a great festival of thanks — flags up, lamps floated on the waves, songs to the sky god Indra, the whole city down on the shore remembering out loud what it owed the water. And as long as the festival was kept, the sea kept its distance, like a good neighbour.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'Then came a year when the king\'s heart was buried in his own sorrows, and nobody dared remind him, and the calendar turned quietly past the festival day. No flags. No lamps. No songs. The first year anyone could remember that Puhar forgot to say thank you.',
      ask: {
        q: 'The promise-day has passed with no lamps and no songs. What does the sea do?',
        options: ['Nothing — seas do not count days', 'It rises. Slowly. And comes up the streets', 'It dries up and goes away'],
        answer: 1,
        right: 'That is what the old epics say. Not a crash — a rising. The sea came up the streets of Puhar the way a tide comes in, and it did not turn around.',
        wrong: 'The fisher grandmothers will tell you: the sea counts everything. It rose — not with a crash, but slowly, up the streets, the way a tide comes in. And it did not turn around.'
      } },
    { art: ['guard'], who: null,
      text: 'It rose gently, that is the strange mercy in the telling — a little higher each day, lapping at doorsteps, sitting down in courtyards, giving the city time. And the people understood, and gathered their children and their pots and their birds in cages, and walked inland with the water walking patiently behind them.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'And then the sea lay down in the empty city, over the goldsmith streets and the warehouses and the lighthouse stair, and stayed. The greatest port of the coast became a quietness under the water. The old Tamil epics — the very ones that tell of Kannagi and of Manimekalai — remember the day it happened.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'But here is why the fisher families tell it still. The city, they say, was never wrecked — only taken back, whole. It is all still down there, streets and all, dim and green and quiet. And on very still nights, out past the surf, an old bell sometimes remembers its job.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'And this may make you sit up: grown-ups with diving gear and clever instruments have actually gone looking, off the little town that carries the name Poompuhar today — and have found old worked stones far out under the water, where the story always said the city was. The sea shows a little, and keeps the rest.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The grandmothers of the coast draw one lesson from it, and it is worth having: festivals look like play, but they are promises — the days a place remembers out loud what it owes. Keep your promise-days. The sea, at least, is keeping count.' }
  ],
  moral: 'What is forgotten sinks. What is remembered keeps a bell ringing, even under the sea.',
  source: 'The drowned city of Puhar (Kaveripoompattinam), remembered in the Tamil epics Silappadikaram and Manimekalai and in fisher lore along the Coromandel coast — of which Karaikal, in Puducherry, keeps its own stretch. Old worked stones have indeed been found offshore near today\'s Poompuhar.'
},

{
  id: 'fk.amudha-surabhi',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Bowl That Was Never Empty',
  hook: 'It looked like an ordinary begging bowl. It had one rule: it could never run dry — as long as the hungriest person was fed first.',
  hero: 'courtier',
  cast: ['courtier', 'buddha', 'guard'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['कटोरा', 'katora', 'bowl'], ['भरना', 'bharna', 'to fill'], ['भूखा', 'bhookha', 'hungry']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Before the sea took Puhar back — you have heard that story — the city had one more tale to give the coast, and it is this one. It is about a girl called Manimekalai, a famous dancer\'s daughter, who was supposed to grow up to be a famous dancer herself. The whole city had planned her life for her. Manimekalai had other ideas.' },
    { art: ['buddha', 'courtier'], who: null,
      text: 'In the city\'s garden groves she had listened to the Buddhist teachers — for in those days the Buddha\'s way flourished all along this Tamil coast, its monks and its gardens right there among the temples and the markets. What she heard there sat down in her heart and stayed: a life spent performing seemed a small thing next to a life spent giving.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'The epic that carries her name tells that on an island, beside a lake, on a festival day, a wonder came into her hands: a begging bowl called Amudha Surabhi — "the nectar that never fails." It looked like any bowl a wandering nun might carry. It was not.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Filled once, with a handful of rice given by a good heart, the bowl would pour and pour and not run dry. But it had one rule, learned by using it: it poured only when the hungriest were served first. Start at the wrong end of the queue, and it was just a bowl.',
      ask: {
        q: 'A queue forms in front of the wonderful bowl: a king\'s messenger, a rich merchant, and a thin old woman standing at the very back. Who must be served first?',
        options: ['The king\'s messenger — kings come first', 'The rich merchant — he will pay', 'The thin old woman at the back'],
        answer: 2,
        right: 'Always. Manimekalai walked straight past the messenger and the merchant, and the bowl poured. Hunger is the only rank it recognised.',
        wrong: 'The bowl would have sat in her hands like a stone. Manimekalai walked to the thin old woman at the back — and the bowl poured. Hunger is the only rank it recognised.'
      } },
    { art: ['courtier'], who: null,
      text: 'So she walked the city with it, day after day — and wherever the hunger was worst, the bowl was deepest. It never once ran dry before the last outstretched hand. Rich men offered to buy it. It was not that kind of bowl.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'Then she asked for something that startled the whole city: to be let into the prison, to feed the prisoners — the forgotten ones, the hungriest of all, whom nobody fed first. And the king, watching this girl serve rice to the people everyone else had crossed off, was so moved that the epic says he changed what the prison was: from a place of punishment into a house of care.' },
    { art: ['buddha'], who: null,
      text: 'Manimekalai\'s story became one of the five great epics of the Tamil language — a Buddhist epic, made on this coast when the Buddha\'s way flowered here, remembering a girl who out-gave a city. The faith that made it is told here the way it tells itself: from the inside, with love.' },
    { art: ['courtier'], who: 'mithu',
      text: 'And the bowl\'s magic, told plainly? Any pot in your kitchen can do the same trick, only slower. Serve the hungriest first, and somehow there is always enough to go round. It is called sharing, and it has never once run dry.' }
  ],
  moral: 'Plenty is not how much the bowl holds. Plenty is which end of the queue you serve first.',
  source: 'Manimekalai, the Tamil Buddhist epic of Sattanar, set largely in Puhar on the Coromandel coast — the bowl Amudha Surabhi. The coast that remembers it includes Karaikal, in Puducherry. Told from inside the tradition, as every faith in this app is.'
},

{
  id: 'fk.thirunallar-nala',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The King Who Waited Out the Storm',
  hook: 'Everything King Nala touched began to go wrong — his luck, his kingdom, even his beloved dice. The place where his hard years finally ended is a small town you can still visit.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'shiva'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['सब्र', 'sabr', 'patience'], ['मुश्किल', 'mushkil', 'hard times'], ['स्नान', 'snaan', 'holy bath']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'King Nala was one of the genuinely good ones — brave, fair, married to the wise and steadfast Damayanti, and, of all things, the finest cook among the kings of his age. His story is old enough to be told inside the Mahabharata itself. And it is the story of a good man\'s bad years — which makes it one of the most useful stories there is.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'For the tradition says this: among the nine great lights of the sky walks Shani — the slow, dark, patient one. He is not cruel, whatever frightened people say. He is the strict teacher, and his subject is patience, and every life, kings included, gets a turn in his classroom. Nala\'s turn came.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'And everything slid. He sat down to a game of dice he should never have sat down to, and lost what was never his alone to lose — his kingdom, his comforts, the roof over his family. The good king became a wanderer on the roads, in one worn cloth, with his own name feeling like someone else\'s.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'He took work, in the end, in another king\'s kitchen — for a king can lose everything and a good cook still eats. And far away Damayanti, who was cleverer than any court she ever stood in, refused every suggestion that she forget him. The tellings say she tracked her husband down by taste: one dish arrived from a distant kitchen, and she knew the hand that had made it. No one else cooked like Nala.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'But knowing where he was could not end the hard years — hard years do not end because you want them to. So here is the question the whole story turns on.',
      ask: {
        q: 'What do you do inside years where nothing works, no matter how hard you try?',
        options: ['Stop trying — what is the use?', 'Keep doing small things well, and wait it out the way a farmer waits out a bad monsoon', 'Find somebody to blame'],
        answer: 1,
        right: 'That is what Nala did — cooked well, kept his word, stayed kind — and it is the whole of what the tradition teaches about hard seasons. They are weather. Farmers do not argue with weather; they outlast it.',
        wrong: 'Nala was tempted by both, the story admits. What he actually did was keep doing small things well — cook well, keep his word, stay kind — and wait, the way a farmer waits out a bad monsoon.'
      } },
    { art: ['courtier'], who: null,
      text: 'And in his wanderings, the temple tradition of the south tells, he came at last to a small place in the green paddy country near the Coromandel coast — Thirunallar — where there is an old temple of Shiva, and within it a shrine of Shani himself. Nala went in, and laid the whole weight of his years down in front of it, and bathed in the temple tank.' },
    { art: ['shiva', 'courtier'], who: null, mood: 'wow',
      text: 'And there, the tradition says, Shani let him go. Not beaten — finished. "He has learned everything the hard years had to teach him. The lesson is over." The weight lifted off Nala like a wet cloak taken from his shoulders, and the story turns: his kingdom found its way back to him, and Damayanti, and the light.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'The tank at Thirunallar is called Nala theertham to this day — Nala\'s waters — and pilgrims carrying their own hard years still come, and bathe, and breathe out. And Thirunallar sits in Karaikal district, which is a piece of Puducherry — a coin from one purse sitting deep in Tamil country\'s pocket.' },
    { art: ['courtier'], who: 'mithu',
      text: 'One more thing, and it is the kindest thing the tradition does. Tamil families even put a number on the hardest stretch — they call it the seven-and-a-half years. Why does a number help? Because a thing with a number has an end. Hard seasons are seasons. Seasons end.' }
  ],
  moral: 'A hard season is a season, not a life. It teaches what it came to teach — and then, hold on to this part, it ends.',
  source: 'The temple legend of the Saniswaran shrine at Thirunallar, in Karaikal district, Puducherry — where King Nala of the Nala–Damayanti tale was released from his hard years; the tank there is called Nala theertham. Told with respect for Shani, as the tradition itself tells it.'
},

{
  id: 'fk.agastya-south',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Small Sage Who Balanced the World',
  hook: 'So many gods and sages crowded north for the great wedding that the world began to tip over. Somebody had to go and sit on the other end.',
  hero: 'courtier',
  cast: ['courtier', 'shiva', 'guard'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['तराज़ू', 'taraazu', 'balance scales'], ['दक्षिण', 'dakshin', 'south'], ['उत्तर', 'uttar', 'north']],
  scenes: [
    { art: ['shiva'], who: null, mood: 'wow',
      text: 'When Shiva married Parvati in the high Himalaya, absolutely everyone went. Gods, sages, spirits, rivers in their travelling shapes — all of creation packed itself into the mountains of the north for the wedding of the age. Which created a problem nobody had thought of. Weight.' },
    { art: ['guard'], who: null,
      text: 'The world, the story says, tilted. With everything of importance crowded onto its northern end, the earth began to lean like an overloaded boat — the north groaning downward, the south rising light and empty. Something, or someone, of very great weight had to go and sit on the other side. During the wedding. Immediately.' },
    { art: ['shiva', 'courtier'], who: null, mood: 'think',
      text: 'Shiva looked out over the gathering for the one to send. And he did not choose the strongest god or the tallest. He called Agastya — the smallest of all the sages, a man you could lose in a crowd of children. Because the scales of the world, Shiva knew, do not weigh muscle. They weigh wisdom. And this small man\'s learning weighed as much as the whole wedding party put together.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'Agastya\'s face fell, and the story lets it fall — he was being asked to miss the wedding of the age, the one everyone would talk about for the rest of time.',
      ask: {
        q: 'Miss the greatest celebration ever held — to go and hold the world level. What does the small sage do?',
        options: ['Refuse — he has waited ages for this day', 'Go. The earth matters more than the party', 'Send a student in his place'],
        answer: 1,
        right: 'He picked up his water-pot and his stick and turned south, that same hour. That is why the south calls him its own to this day.',
        wrong: 'Not Agastya. He picked up his water-pot and his stick and turned south that same hour — because the earth mattered more than the party. That is why the south calls him its own.'
      } },
    { art: ['shiva', 'courtier'], who: null, mood: 'wow',
      text: 'And Shiva, watching him go, gave him a promise worth more than a front-row seat: "Wherever you stand, whenever you turn your heart this way — you will see the wedding, clear as if you stood beside me." So the small sage walked south with the celebration playing before his inner eye the whole way, missing nothing after all.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'At the Vindhya mountains, which had lately been growing taller and prouder and were shouldering into the very sky, the range bowed low to let the great sage pass. "Stay just so until I return," said Agastya pleasantly. He never returned north. The Vindhyas are bowing still — which, the old ones say with a wink, is why anyone can cross into the south at all.' },
    { art: ['courtier'], who: null,
      text: 'And the moment he crossed into the southern lands, the world came level — and level it has stayed. Agastya settled in the south for good and became its grandfather: tradition makes him the first teacher of Tamil grammar, and you have already met him in these stories, carrying a certain river in his little pot until a crow got involved.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      text: 'On the Coromandel shore, old tradition says the sage kept a hermitage where Pondicherry stands today — the town was once called Vedapuri, and the Vedapureeswarar temple in Puducherry keeps that old name alive right now. Later the same streets grew French names alongside their Tamil ones. It has always been a town that can hold more than one name at a time.' },
    { art: ['courtier'], who: 'mithu',
      text: 'And keep the picture the story painted: the world only stands level when the south is honoured with the same weight as the north. That is not just geography. India works exactly the same way.' }
  ],
  moral: 'When everyone crowds one way, the person who walks the other way may be holding the whole world level.',
  source: 'The pan-southern legend of Agastya sent south to balance the earth, with the bowing of the Vindhyas, from Puranic and Tamil tradition; Puducherry\'s own tradition of the sage\'s hermitage at Vedapuri survives in the name of the Vedapureeswarar temple in Pondicherry.'
},

{
  id: 'fk.gautami-yanam',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The River That Washed a Sorrow',
  hook: 'The kind sage\'s field fed the whole country through the famine. So why did he beg the gods for a river to wash him clean?',
  hero: 'courtier',
  cast: ['courtier', 'shiva', 'guard'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['खेत', 'khet', 'field'], ['दुख', 'dukh', 'sorrow'], ['धारा', 'dhaara', 'stream']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In famine years, long ago, when the rains failed and failed again, there was exactly one green field left in the burnt country — on Brahmagiri hill in the western mountains, at the hermitage of the sage Gautama. By the steadiness of his prayer, the story says, that one field gave rice every single day. And every single day, Gautama fed everyone who came. Everyone. Including people who did not like him.' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'And that last part is where the trouble grew. Some of the very people his rice had kept alive found, as the famine ended, that they could not forgive him for it. Gratitude curdles in some hearts, and turns to jealousy. They put their heads together to make the good sage small again.' },
    { art: ['courtier'], who: null,
      text: 'Their trick was cruel and clever. They shaped an illusion — a frail old cow, thin as a shadow — and sent her wandering into Gautama\'s precious field at seed time. Gautama, ever gentle, picked a soft blade of grass, the mildest thing a hand can hold, and waved her away with it.' },
    { art: ['courtier'], who: null, mood: 'sad',
      text: 'And the cow fell, and did not get up — and then thinned into mist and was gone, for she had never been a real cow at all. But Gautama did not know that. All he knew was what his eyes had shown him: his hand, and a fallen cow. For a sage who would not bruise a leaf, there was no heavier stone the world could have laid on him. And the jealous ones stood at the fence, loudly agreeing that it was all his fault.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      text: 'So there he stood, believing he had done a harm he never meant.',
      ask: {
        q: 'What does a good person do with a harm they believe they have caused?',
        options: ['Hide it and hope nobody finds out', 'Carry it alone forever', 'Ask for help to make it right — help bigger than they could ever make alone'],
        answer: 2,
        right: 'That is what Gautama did — and asking honestly for help that big is not weakness. It is the strongest move in the whole story.',
        wrong: 'Hiding and carrying are what guilt whispers. Gautama did the strong thing instead: he asked for help bigger than he could make alone.'
      } },
    { art: ['shiva', 'courtier'], who: null, mood: 'wow',
      text: 'He climbed to the top of Brahmagiri and prayed to Shiva — not to undo what could not be undone, but to wash it: "Send me Ganga\'s water, here, in the south, so that this sorrow and every sorrow after it can be washed clean." And Shiva — moved by the honest grief, and knowing perfectly well whose trick it had been — released from his own bound-up hair a shining stream onto the hilltop.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'The stream rose, and gathered, and set off east across the whole width of the land — the Godavari, the great river of the south, whom the tradition also calls Gautami: the sage\'s river. And the trick came out, as tricks do; and the tricksters stood ashamed in the shallows; and the river washed them too, without being asked. Rivers do not check names first.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Follow her on a map and she runs right across the peninsula, widening as she goes, until she splits into a great green delta of coconut and canal and rice, and meets the sea through many mouths. And at one of those mouths sits a surprise: Yanam, a little piece of Puducherry on a Telugu river, where French was once spoken on the ghats — a two-hour drive and a whole coast away from Pondicherry itself.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Every twelfth year the river\'s great bathing festival, the Pushkaram, fills her banks from the hills to the sea — Yanam\'s ghats included. A river born, remember, because one good man\'s first thought after a harm was not "who saw?" but "how do I make it right?"' }
  ],
  moral: 'A good person\'s first thought after a harm is not "who saw me?" but "how do I make it right?" — and help, asked for honestly, comes bigger than the harm.',
  source: 'The origin legend of the Godavari as Gautami — the sage Gautama, the illusion cow and the stream from Shiva\'s hair — from Puranic tradition, told the river\'s whole length to its mouths; Yanam, in Puducherry, sits at one of them. The Godavari Pushkaram is still kept.'
},

{
  id: 'fk.kadalamma',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Sea Mother\'s Storeroom',
  hook: 'Some mornings, without any warning, the sea by Mahe goes still and brown and fills to the brim with fish. The coast has an old explanation.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_heron'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['मछली', 'machhli', 'fish'], ['बरसात', 'barsaat', 'the rains'], ['टोकरी', 'tokri', 'basket']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Mahe is the smallest and greenest piece of Puducherry — one river-mouth town tucked into the Malabar coast, speaking Malayalam, once flying a French flag, and if you ask for it by its older name, Mayyazhi, the whole town will know you mean home. Its people have always lived with their feet in the sea. This is a story their coast tells.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'The fisher families of the Malabar shore do not call the sea "it." They call her Kadalamma — kadal, the sea; amma, mother. You do not simply take from an amma. You greet her before you push the boat out. You mind her moods. And you trust, even in the thin times, that she has not forgotten you.' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'And there are thin times, every single year. When the monsoon arrives, the sea turns wild for weeks on end and the boats cannot go out at all. Those are the months when dinners grow small, and mothers get very clever with one fish, and the children of fisher houses learn early what a quiet kitchen sounds like.' },
    { art: ['pt_heron', 'courtier'], who: null, mood: 'wow',
      text: 'And then — some years, as the rains ease — the coast wakes up to a miracle. A stretch of sea gone flat as a temple tank, calm and brown with stirred-up mud, while the waves crash on white as ever to either side. And that still brown water is boiling with life: prawns, sardines, more fish than anyone has seen since last time — swarming so close in that a child on the sand can watch them flicker. The coast has a word for it: chakara.' },
    { art: ['courtier'], who: null,
      text: 'And here is the coast\'s old explanation, the one the grandmothers give. Kadalamma keeps a storeroom, the way every amma does. All through the hungry weeks of the rains she hears the quiet kitchens of her children on the shore. And when the storm finally spends itself, she remembers them — and opens the storeroom doors wide, right at their doorstep, where even the smallest boat and the oldest uncle can reach.',
      ask: {
        q: 'The sea is suddenly full of fish, right at your feet. What do you do?',
        options: ['Take absolutely everything you can — it may never come again', 'Take what your household and your neighbours need, thank Amma, and leave plenty in the water', 'Fence off the beach and charge the other boats'],
        answer: 1,
        right: 'That is the rule of the coast, old as the boats. A mother\'s storeroom is opened for all her children — grabbing it all is exactly the thing you do not do to a gift.',
        wrong: 'The elders of the shore would stop you gently. A mother\'s storeroom is opened for all her children — you take what is needed, thank Amma, and leave the sea her seed for next year.'
      } },
    { art: ['courtier', 'guard'], who: null,
      text: 'So the elders keep the old rules when the chakara comes. Every family\'s boat gets its turn at the water. The houses with no boat at all are given fish before one basket goes to market. And nobody, ever, mocks the gift by wasting it — because you do not insult your amma\'s cooking, and you certainly do not insult her storeroom.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'Now, the grown-ups who study the sea have their own telling: the floods of the monsoon wash a soft bank of mud down along the shore, and the mud calms the waves like oil, and the fish gather in that calm, rich water. The fisher families listen politely and nod. Both tellings can be true at once. That is what a good story is for.' },
    { art: ['courtier'], who: 'mithu',
      text: 'If you are ever on that green coast at the end of the rains — Mahe, or anywhere along the Malabar shore — you can ask the question the whole coast asks each year, like children outside a kitchen: "Has the chakara come?" And if it has, go down to the sand and watch a mother keep her promise.' }
  ],
  moral: 'A gift that arrives at everyone\'s feet is meant for everyone\'s baskets — and taking gently is how you say thank you to the sea.',
  source: 'Fisher lore of the Malabar coast — Kadalamma the Sea Mother and the chakara, the calm, teeming sea after the rains; Mahe, in Puducherry, keeps its own stretch of that coast. Oral and living; the mudbank chakara itself appears most years somewhere along the shore.'
},

{
  id: 'fk.tittibha-sea',
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Birds Who Argued With the Sea',
  hook: 'The sea took two small eggs from the beach. So two small birds decided they would empty the sea. Beakful by beakful.',
  hero: 'pt_heron',
  cast: ['pt_heron', 'pt_crow', 'courtier'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['अंडा', 'anda', 'egg'], ['घोंसला', 'ghonsla', 'nest'], ['बूँद', 'boond', 'drop']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In Pondicherry the whole town walks by the sea in the evening, along the promenade above the black rocks, and the sea booms away below like a big drum that never gets tired. And on that shore they still tell a story about that sea which is as old as the Panchatantra — because it IS from the Panchatantra. It goes like this.' },
    { art: ['pt_heron', 'pt_crow'], who: null,
      text: 'A pair of tittibha birds — small, quick shore birds with legs like grass stalks — decided to nest right on the sand, above the tide line. The sea watched them build, and the sea was in one of its proud moods. "Little birds," it murmured, "you are nesting at the feet of the enormous sea." "We know," said the birds, busy. "Mind you behave yourself."' },
    { art: ['pt_heron'], who: null, mood: 'sad',
      text: 'The sea had never in its life been told to behave. So one night, just to show what enormous meant, it swelled up quietly, reached one long wave up the sand, and took the two eggs out of the nest — down into its green dark, to see what the little birds would do about it.' },
    { art: ['pt_heron', 'pt_crow'], who: null, mood: 'think',
      text: 'What they did, after one terrible morning of grief, was get angry — the useful kind. The two of them looked out at the horizon, all of it, and made an announcement to the entire ocean: "Give back our eggs. Or we will empty you. Beakful by beakful, down to your last wet stone."',
      ask: {
        q: 'Two birds the size of your fist against every ocean on earth. Can they possibly empty the sea?',
        options: ['No — so why even try?', 'No — but that was never the real plan. A promise kept loudly, without stopping, gathers help', 'Yes, in about a thousand years'],
        answer: 1,
        right: 'Watch what happens next. It is not about the water level. It is about who is watching somebody small refuse to give up.',
        wrong: 'Of course they cannot — and it does not matter. Watch what happens. It is not about the water level. It is about who is watching somebody small refuse to give up.'
      } },
    { art: ['pt_heron'], who: null,
      text: 'And they began. Dip the beak, fly to the rocks, spit out the drop. Back for another. All morning. All day. Drop, by drop, by drop, against the entire Indian Ocean, which is the best joke in the whole Panchatantra until you notice you have stopped laughing.' },
    { art: ['pt_crow', 'pt_heron'], who: null, mood: 'wow',
      text: 'The other birds laughed first, of course. Then they watched a while. Then, one by one, they stopped laughing and started dipping — sparrows, herons, gulls, crows, a whole coastline of beaks, drop by drop by drop. There is something about somebody small who will not stop that other somebodies find impossible to walk past.' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      text: 'And the news of it rose, bird by bird, all the way up to Garuda himself — the king of every bird that flies, whose family the smallest sandpiper belongs to. Down he came, with wings that dimmed the sun — on their side, mind, all that hugeness on the side of two shore birds — and he looked at the sea, and asked it, once, to give back what it had taken.' },
    { art: ['pt_heron', 'pt_crow'], who: null,
      text: 'And the sea — which had only ever been proud, not truly wicked — looked at the two little birds, and the coastline of beaks behind them, and the sky full of Garuda above, and understood that pride is a very heavy thing to carry alone. It brought the eggs back up on a soft wave and laid them in the nest, unbroken, with an apology of white foam around them.' },
    { art: ['pt_heron'], who: 'mithu',
      text: 'The eggs hatched by that same sea, and the chicks grew up paddling in its shallows, and the sea rocked them like anybody\'s amma. It still boasts a little, evenings, on the Pondicherry rocks. So do the tittibhas. Honestly, both sides have earned it.' }
  ],
  moral: 'Too small to win is not too small to start — and nothing on earth gathers help faster than somebody small who refuses to stop.',
  source: 'Panchatantra — the tittibha birds and the sea, told here the way it gets told on the Coromandel shore at Puducherry. In older tellings Garuda\'s help arrives with harder threats behind it; softened here, and the source says so.'
}

];

window.IND_COLLECTIONS_SOUTH = [
  { id: 'desh-south', name: 'The Deep South', note: 'Kerala, Tamil Nadu, Karnataka, Andhra — and the four scattered pieces of Puducherry, on two coasts.', avatar: 'pt_crocodile' }
];
