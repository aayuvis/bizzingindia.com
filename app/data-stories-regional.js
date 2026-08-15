/* Bizzing India — regional story content.

   The same shape as data-stories.js, on a separate global so the two sets can be
   loaded and merged independently.

   Told scene by scene, the way a storyteller tells it: a hook, named characters with
   actual dialogue, one turn where the child has to decide something, then the moral —
   spoken plainly, never printed as a lecture.

   Every object here carries badge 'katha' — a story as it is told. Sources name the
   tradition or the collection honestly; where a tale is oral and has no single
   collector, the source says so rather than inventing one.

   Depiction note (docs/05): the Sikh Gurus are never depicted. The Sikh stories here
   are told through events, through the people around the Guru, and through the Khanda
   and Harmandir Sahib — never through a picture of a Guru.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is said / told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_REGIONAL = [

/* =========================================================== BENGAL ======= */
{
  id: 'fk.kiranmala',
  collection: 'desh',
  badge: 'katha',
  title: 'Kiranmala and the Mountain of Voices',
  hook: 'Two brothers went up the mountain and never came down. Their little sister packed a bag.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_crow'],
  minutes: 6,
  place: ['IN-WB'],
  words_hi: [['पहाड़', 'pahaad', 'mountain'], ['बहन', 'behen', 'sister'], ['पक्षी', 'pakshi', 'bird']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'This is a story Bengali grandmothers have been telling at bedtime for a very long time. In a village outside the city, an old potter once found three babies floating down the river in a wooden box. He brought them home and named them Arun, Barun and Kiranmala, and raised them as his own.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'They grew up. And one evening a traveller stopped at their door, drank their water, and told them about the mountain — the one at the end of the north road, where three impossible things are kept: a bird that talks, a tree that sings, and water that wakes the sleeping.' },
    { art: ['guard'], who: 'guard', mood: 'wow',
      text: '"Then I shall go and get them," said Arun, the eldest. The traveller put down his cup. "Everyone says that. Listen. On the path up, voices call your name from behind you — your mother, your brother, your own dog. Turn round even once and you become a stone on the hillside."' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'Arun went. Halfway up, somebody behind him called his name in his little sister\'s voice, sobbing. He turned. He did not come home. Barun went next, with his ears stopped up with cloth — and the cloth fell out, and he turned too.' },
    { art: ['courtier'], who: 'courtier',
      text: '"Give me the water skin," said Kiranmala to the old potter. He held on to it. "You are the last one I have." "Then hold on to me when I get back," she said, "with all three of them behind me."' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'The path was white stone and very steep, and it was covered in boulders that were exactly the size and shape of young men. And then the voices started. Arun\'s voice. Barun\'s voice. Calling her name, close enough to touch.',
      ask: {
        q: 'The voices behind her sound exactly like her brothers. What does she do?',
        options: ['Look back — it might really be them', 'Keep climbing and never turn round', 'Shout back without turning'],
        answer: 1,
        right: 'That is what she did. She sang instead — loudly, all the way up, so that her own voice was the only one she could hear.',
        wrong: 'Kiranmala did the harder thing. She started singing, loudly, and climbed with her own voice filling her ears.'
      } },
    { art: ['pt_crow', 'courtier'], who: 'pt_crow', mood: 'wow',
      text: 'At the top, in a cage of gold, sat the bird that talks. It looked her up and down. "A hundred years," it said, "and you are the first one who did not turn round. Take the singing branch. Take the water. And be quick — the hillside is waiting."' },
    { art: ['courtier'], who: null,
      text: 'She went down sprinkling water on the boulders as she passed, and the hillside stood up behind her: young men and old men, a shepherd, a merchant, and two brothers who had been stone so long they had forgotten how to talk. They walked home in a crowd, and the whole village came out.' },
    { art: ['courtier', 'guard'], who: 'mithu',
      text: 'Ask your dida or your thakuma for this one if you have one. Every Bengali grandmother tells it slightly differently, and every one of them is sure her version is right.' }
  ],
  moral: 'The voices behind you are not always your people. Sometimes the bravest thing is simply to keep climbing.',
  source: 'Thakurmar Jhuli, collected by Dakshinaranjan Mitra Majumdar, 1907 — the great book of Bengali grandmother-tales.'
},

{
  id: 'wt.gopal-smell',
  collection: 'chatur',
  badge: 'katha',
  title: 'Paying for the Smell',
  hook: 'A shopkeeper charged a poor man for smelling his food. So the king sent for Gopal.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-WB'],
  words_hi: [['खुशबू', 'khushboo', 'smell'], ['आवाज़', 'aawaaz', 'sound'], ['सिक्का', 'sikka', 'coin']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'There was a sweet-shop in the town with a doorway that smelled so good that people slowed down as they passed it. A poor man used to eat his dry roti sitting on the step outside, because dry roti eaten in that doorway tasted of hot jalebi.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'wow',
      text: 'One day the shopkeeper came out with his account book. "Six months you have been sitting there. Six months of my smell. You owe me eight rupees."' },
    { art: ['courtier'], who: null,
      text: 'The poor man had eight rupees the way a fish has pockets. The argument got loud enough that they were both marched off to the court of Raja Krishnachandra — who looked at both of them, sighed, and sent for Gopal Bhar.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: '"Let me be sure I understand," said Gopal. "He ate nothing of yours." "Nothing." "He touched nothing of yours." "Nothing." "But he smelled." "For six months!" said the shopkeeper. "Then this is easy," said Gopal, and asked for a bag of coins.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'The whole court leaned in. Gopal took the bag and held it up beside the shopkeeper\'s ear.',
      ask: {
        q: 'The man ate nothing. How on earth do you pay for a smell?',
        options: ['Hand over eight real rupees', 'Let him listen to the coins', 'Tell the shopkeeper he is being silly'],
        answer: 1,
        right: 'Exactly. Gopal shook the bag beside his ear until it jingled, and stopped.',
        wrong: 'Gopal did something better than an argument. He shook the bag beside the shopkeeper\'s ear until it jingled.'
      } },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'wow',
      text: 'Chhan-chhan-chhan went the coins. Gopal stopped, and tied the bag shut. "Paid," he said. "He had the smell of your sweets. You have had the sound of his money. Nobody is owed anything."' },
    { art: ['guard'], who: null,
      text: 'The shopkeeper opened his mouth, worked out that there was nothing at all to say, and closed it again. The Raja laughed so hard he had to be handed water.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The poor man went back to his step the next morning. Nobody charged him anything ever again.' }
  ],
  moral: 'Take exactly what you gave. A smell is worth a sound.',
  source: 'Gopal Bhar tales — the jester of Raja Krishnachandra of Krishnanagar in Bengal, told in Bengali for generations. Tricksters all over the world are given this same case to solve.'
},

/* ======================================================= TAMIL NADU ======= */
{
  id: 'wt.tenali-thieves',
  collection: 'chatur',
  badge: 'katha',
  title: 'The Thieves Who Watered the Garden',
  hook: 'Tenali Raman heard thieves in his garden at midnight. So he told his wife a secret, very loudly.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['चोर', 'chor', 'thief'], ['बगीचा', 'bageecha', 'garden'], ['कुआँ', 'kuan', 'well']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Tenali Raman was the funniest man at the court of King Krishnadevaraya, which meant he was also, quietly, the cleverest. One hot night he was lying awake when he heard something in the garden that was not the wind: four men, whispering, going carefully through the plantains.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'He counted them by their voices. Four. He was one, his wife was two, and the guards were a long shout away down the road.',
      ask: {
        q: 'He cannot fight four thieves. But they can hear every single word he says. So what should he say?',
        options: ['Shout for the guards and hope', 'Tell his wife, very loudly, that the treasure is going into the well', 'Lie still and pretend to be asleep'],
        answer: 1,
        right: 'That is the move. He did not talk to the thieves at all — he let them overhear him.',
        wrong: 'Raman did something sneakier. He woke his wife up and talked to her far more loudly than anybody talks at midnight.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      text: '"WIFE!" said Raman, in a whisper you could have heard in the next street. "There are thieves in the town! Quick — every coin, every chain, every silver plate — into the well with it, before they come!"' },
    { art: ['courtier'], who: null,
      text: 'His wife, who had been married to him for years and had learned to keep up, said "YES, HUSBAND!" just as quietly. Then the two of them carried box after box out to the well and tipped them in. Sploosh. Sploosh. Sploosh.' },
    { art: ['guard'], who: 'guard',
      text: 'Behind the plantains, four thieves looked at one another. "Every coin," breathed one. "In a well," breathed another. "We only need buckets," breathed the third. The fourth one, who had a bad feeling, was outvoted.' },
    { art: ['guard'], who: null,
      text: 'They emptied that well all night. Bucket after bucket after bucket, and every bucket went sloshing out over Raman\'s vegetable beds because they had nowhere else to put it. At the bottom, at dawn, they found: stones. A great many stones.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      text: 'Raman opened his shutters, stretched, and looked out at four exhausted men standing in a garden that had never been so beautifully watered. "Marvellous work," he said. "Same time next Tuesday?"' },
    { art: ['courtier'], who: 'mithu',
      text: 'They did not come back. But the aubergines that year were the best in the street.' }
  ],
  moral: 'If someone is listening in, that is not a problem. That is a tool.',
  source: 'Tenali Raman tales — told in Tamil as Tenali Raman and in Telugu as Tenali Ramakrishna, of the poet at the court of Krishnadevaraya of Vijayanagara (reigned 1509–1529). Many versions.'
},

{
  id: 'ep.squirrel-bridge',
  collection: 'epics',
  badge: 'katha',
  title: 'The Squirrel Who Built the Bridge',
  hook: 'An army of monkeys carrying mountains. And one squirrel carrying sand.',
  hero: 'pt_mouse',
  cast: ['rama', 'pt_mouse', 'pt_monkey'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['गिलहरी', 'gilhari', 'squirrel'], ['पुल', 'pul', 'bridge'], ['रेत', 'ret', 'sand']],
  scenes: [
    { art: ['rama', 'pt_monkey'], who: null,
      text: 'At the very tip of the south, where the land runs out, Rama\'s army was building a bridge across the sea to Lanka. The vanaras were carrying boulders the size of houses. Some of them were carrying actual hills.' },
    { art: ['pt_mouse'], who: null,
      text: 'A small striped squirrel watched them from a rock for about four minutes. Then she ran down to the water, rolled in the wet sand until she was completely coated in it, ran out onto the bridge, and shook herself.' },
    { art: ['pt_monkey', 'pt_mouse'], who: 'pt_monkey', mood: 'wow',
      text: 'A vanara nearly stepped on her. "Out of the way, little thing! We are carrying mountains here and you are shaking dust about!"' },
    { art: ['pt_mouse'], who: 'pt_mouse',
      text: '"The gaps between your mountains are the size of my body," said the squirrel, and went back for more sand. She was not making a point. She was working.' },
    { art: ['pt_monkey', 'pt_mouse'], who: null, mood: 'think',
      text: 'By afternoon the monkeys had started laughing at her, and one of them picked her up by the tail and swung her away off the bridge.',
      ask: {
        q: 'She is soaked, sandy, laughed at and thrown off. What should the squirrel do?',
        options: ['Stop — she is far too small to help', 'Try to carry a stone instead', 'Get up and go back for more sand'],
        answer: 2,
        right: 'She went back. Nobody had ever asked her permission to help, and she was not asking theirs.',
        wrong: 'The squirrel did the stubborn thing. She got up, shook herself off, and went back for more sand.'
      } },
    { art: ['rama', 'pt_mouse'], who: 'rama',
      text: 'She landed in a hand. Rama had caught her. He set her on his palm and looked at the bridge, where every gap between every boulder had been packed tight with wet sand. "Without this," he said, "the whole thing shifts. Who told you?" "Nobody," said the squirrel. "I just looked."' },
    { art: ['rama', 'pt_mouse'], who: null, mood: 'wow',
      text: 'He stroked her back with three fingers before he put her down. And that, they will tell you all over the south, is why the little palm squirrel who runs up your wall has three pale stripes down her back to this day.' },
    { art: ['pt_mouse'], who: 'mithu',
      text: 'Next time one runs across the veranda, have a look. Three stripes. Go on.' }
  ],
  moral: 'Nobody else gets to decide whether your help counts. That was never their job.',
  source: 'The squirrel appears in Tamil and other regional tellings of the Ramayana rather than in Valmiki\'s Sanskrit poem. The stripes on the Indian palm squirrel are explained this way across the south. Many versions.'
},

/* =========================================================== KERALA ======= */
{
  id: 'fk.mahabali',
  collection: 'desh',
  badge: 'katha',
  title: 'The King Who Comes Home Every Year',
  hook: 'Once a year all of Kerala lays flowers on the doorstep. Somebody is coming.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-KL'],
  words_hi: [['फूल', 'phool', 'flower'], ['वादा', 'vaada', 'promise'], ['राजा', 'raja', 'king']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Every year at Onam, houses all over Kerala lay out a pookalam — a carpet of flower petals on the ground by the front door, a new ring of colour each morning for ten days. Long snake boats race down the backwaters. There is a sadya on a banana leaf with more dishes on it than you have fingers. Somebody is expected.' },
    { art: ['courtier'], who: 'mithu',
      text: 'His name is Mahabali, and Malayali children call him Maveli. He was a king here, long ago, and Kerala has never got over him.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'They say that in his time nobody lied and nobody went hungry; that there was no such thing as a lock on a door, because there was nothing anyone needed to take. Maveli walked about his country asking people whether they had enough. They always had.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Maveli was famous for one thing above all: he had never in his life said no to anyone who asked him for something. So when a small boy — a very small brahmin boy, walking barefoot with a wooden umbrella — came to his great sacrifice and asked for a gift, the whole court smiled.' },
    { art: ['courtier', 'guard'], who: 'guard', mood: 'think',
      text: '"Ask for anything," said Maveli. "Three paces of land," said the boy. "Just as much as I can cover in three steps." The king\'s old teacher went white and caught his arm. "Do not promise this one anything. I am asking you. Do not."',
      ask: {
        q: 'His teacher says stop. The boy is asking for three steps of dust. What does Maveli do?',
        options: ['Refuse — something here is strange', 'Offer a whole province instead', 'Promise, because he has never once broken his word'],
        answer: 2,
        right: 'Yes. He poured the water over the boy\'s hand, which is how a promise was sealed, and said: take your three steps.',
        wrong: 'Maveli promised. He poured the water over the boy\'s hand, the way a promise was sealed, and said: take your three steps.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'And the small boy began to grow. He grew until the umbrella brushed the clouds. One step covered the whole earth, from the sea to the mountains. The second step covered the sky. Then he stopped, with one foot in the air, and said: "Your promise was three. Where shall I put the third?"' },
    { art: ['courtier'], who: 'courtier',
      text: 'Maveli looked at his kingdom under that foot. Then he knelt down and bowed his head. "Here," he said. "There is nothing else left that is mine. A promise has to have somewhere to stand."' },
    { art: ['courtier'], who: null,
      text: 'The third step came down softly, on the crown of his head, and Maveli went away from Kerala. But he had been given one thing back for the asking: one day every year to return and see whether his people are well.' },
    { art: ['courtier'], who: 'mithu',
      text: 'That is what the flowers are for. And it is why, at Onam, families cook far too much and everybody says the same thing: he should find us happy. He should not come all this way and find us sad.' }
  ],
  moral: 'A promise is the last thing a good king owns — and the one thing nobody can take from him.',
  source: 'Kerala\'s Onam tradition. The story of Mahabali and Vamana is told across India and appears in the Puranas; in Kerala the festival is about Maveli\'s homecoming.'
},

/* ======================================================== RAJASTHAN ======= */
{
  id: 'fk.pabuji',
  collection: 'desh',
  badge: 'katha',
  title: 'Pabuji Leaves His Own Wedding',
  hook: 'A wedding half finished, a promise made months before, and a painted scroll seven metres long that only opens after dark.',
  hero: 'guard',
  cast: ['guard', 'courtier', 'pt_bull'],
  minutes: 5,
  place: ['IN-RJ'],
  words_hi: [['ऊँट', 'oont', 'camel'], ['वादा', 'vaada', 'promise'], ['रेगिस्तान', 'registan', 'desert']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In a village in the Thar desert, when the work is done and the night is cold, a singer called a bhopa unrolls a long painted cloth between two poles. It is called a phad. It is covered end to end with tiny orange and green figures, and it is completely dark until his wife holds up a lamp and lights one small patch of it at a time.' },
    { art: ['courtier'], who: 'courtier',
      text: '"Here," says the bhopa, touching the cloth with a stick, "is Pabuji of Kolu, on his black mare, Kesar Kalmi." And then he sings, and does not stop until the sun comes up.' },
    { art: ['guard', 'pt_bull'], who: null,
      text: 'Pabuji was a chief of the desert, and this is the part everyone waits for. A woman called Deval kept a herd of cattle, and one dry season she came to him and asked for his protection. He gave her his word. Whenever she called, he said, he would come — whatever he was doing when the call came.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'Months later Pabuji was at his own wedding. The knot was tied at his wrist, the fire was lit, and he had walked three of the four rounds around it. He had brought his bride a gift no bride in that desert had ever been given: a herd of she-camels, the first anyone there had seen.' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'sad',
      text: 'On the fourth round, Deval came through the doorway with dust on her feet. "They have driven off every one of my cattle," she said. "You gave me your word in the winter. It is summer now."',
      ask: {
        q: 'Three rounds done, one to go, and his word is standing in the doorway. What does Pabuji do?',
        options: ['Finish the wedding first, then ride', 'Send his men and stay', 'Go now, with the wedding knot still tied to his wrist'],
        answer: 2,
        right: 'He went. The singers say he never finished the fourth round — and that is the line the whole night has been building to.',
        wrong: 'Pabuji did the harder thing. He stood up at the fourth round and went, with the wedding knot still tied to his wrist.'
      } },
    { art: ['guard', 'pt_bull'], who: 'guard',
      text: '"Forgive me," he said to his bride. "A promise made in winter is still a promise in summer." He whistled for Kesar Kalmi, and the mare came at a run, and the dust of that ride is painted right across the middle of the phad.' },
    { art: ['courtier'], who: null,
      text: 'He brought the cattle back. What happened after that, the bhopa sings in the last hours before dawn, when the smallest children are already asleep on their mothers\' shawls.' },
    { art: ['courtier'], who: 'mithu',
      text: 'At sunrise the phad is rolled up. Camel herders in Rajasthan still sing to Pabuji when their camels are sick — because he was the one who brought the camels, and because he kept his word.' }
  ],
  moral: 'A promise made in the morning is still a promise at midnight.',
  source: 'Pabuji ki Phad — the Rajasthani epic of Pabuji, sung through the night by bhopa singers in front of a painted cloth scroll. The phads are painted by the Joshi families of Shahpura, Rajasthan. Many versions.'
},

/* =========================================================== PUNJAB ======= */
{
  id: 'fk.lambikin',
  collection: 'desh',
  badge: 'katha',
  title: 'Lambikin and the Drumikin',
  hook: 'Everybody in the forest wanted to eat him. He asked them all to wait until Thursday.',
  hero: 'pt_deer',
  cast: ['pt_deer', 'pt_jackal', 'pt_lion'],
  minutes: 4,
  place: ['IN-PB'],
  words_hi: [['जंगल', 'jangal', 'forest'], ['ढोल', 'dhol', 'drum'], ['नानी', 'nani', 'grandmother']],
  scenes: [
    { art: ['pt_deer'], who: null,
      text: 'Once there was a Lambikin who was so pleased with the world that he skipped everywhere instead of walking. One morning he set off through the forest to his Granny\'s house, singing, because Granny always fed him far too much.' },
    { art: ['pt_jackal', 'pt_deer'], who: 'pt_jackal', mood: 'wow',
      text: 'Round the first bend stood a Jackal, who licked his lips. "Lambikin! I am going to EAT you!"' },
    { art: ['pt_deer'], who: 'pt_deer', mood: 'think',
      text: '"Oh, don\'t," said Lambikin, skipping on the spot. "I am all bones. Wait till I come back from Granny\'s — I shall be fat as butter. You can eat me on Thursday." The Jackal thought about butter, and stood aside.' },
    { art: ['pt_lion', 'pt_deer'], who: null,
      text: 'It happened again with a vulture on the path, and again with an old bear, and finally with a Tiger, who was the largest and hungriest of the lot. Every one of them heard about Thursday. Every one of them stood aside.' },
    { art: ['pt_deer'], who: null, mood: 'wow',
      text: 'At Granny\'s house Lambikin ate for a week, and by the end of it he could hardly stand up. Then he looked out of the window at the forest path, where four large shapes were sitting patiently in a row, waiting for Thursday.',
      ask: {
        q: 'He is now extremely fat and they are all still out there. What can he possibly do?',
        options: ['Run for it and hope he is fast', 'Get inside a drum and roll home', 'Stay at Granny\'s house forever'],
        answer: 1,
        right: 'That is exactly it. Granny made him a little drum — a drumikin — and he climbed inside and rolled.',
        wrong: 'Lambikin did something far stranger. He had Granny make him a little drum, and he climbed inside it and rolled.'
      } },
    { art: ['pt_deer'], who: 'pt_deer',
      text: 'Down the path came a small round drum, rolling and singing to itself: "Lost in the forest, and so are you! On a lickety, lickety, lickety tum!"' },
    { art: ['pt_jackal'], who: 'pt_jackal', mood: 'think',
      text: '"Drumikin!" called the Jackal. "Have you seen Lambikin?" "Lost in the forest, and so are you!" sang the drum, and rolled straight past his nose. The vulture asked. The bear asked. The Tiger asked. The drum sang the same thing to all of them.' },
    { art: ['pt_deer'], who: null,
      text: 'And the drum rolled all the way home, and bumped over the doorstep, and a very fat and very pleased Lambikin climbed out and shut the door.' }
  ],
  moral: 'When you cannot be stronger than them, be somewhere they are not looking.',
  source: 'Tales of the Punjab, collected by Flora Annie Steel, 1894.'
},

{
  id: 'sk.sacha-sauda',
  collection: 'sikh',
  badge: 'katha',
  title: 'The Truest Bargain',
  hook: 'His father gave him twenty rupees and one instruction: come back with a profit.',
  hero: 'khanda',
  cast: ['khanda', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-PB'],
  words_hi: [['सच्चा', 'sachcha', 'true'], ['सौदा', 'sauda', 'bargain'], ['भूख', 'bhookh', 'hunger']],
  scenes: [
    { art: ['khanda'], who: 'mithu',
      text: 'Before we start: in this story you will hear about Guru Nanak, but you will not see him. Sikhs do not make pictures of the Gurus, so we do not either. You will see the Khanda instead — and everyone else in the story.' },
    { art: ['guard'], who: 'guard',
      text: 'Nanak was a young man in a village in Punjab, and his father Mehta Kalu was worried about him, in the ordinary way that fathers worry. "You are dreaming your life away. Take these twenty rupees to the next town. Buy something cheap, sell it dear, come home with a profit. A good bargain — a khara sauda. Everybody manages it."' },
    { art: ['guard', 'courtier'], who: null,
      text: 'He sent a family servant along to keep an eye on him. The two of them walked out at sunrise with twenty rupees knotted into a cloth — a serious amount of money then, enough to buy a great deal of salt or cloth or grain.' },
    { art: ['courtier'], who: 'courtier', mood: 'sad',
      text: 'Halfway there they came on a group of travelling holy men sitting under trees off the road. They were thin. They had eaten nothing for days, and they asked for nothing, because asking was not their way. Nanak sat down with them and asked how long it had been. Three days, they said. Perhaps four.' },
    { art: ['khanda', 'courtier'], who: null, mood: 'think',
      text: 'The servant put his hand on the knotted cloth. "That is your father\'s money," he said. "He asked for a bargain."',
      ask: {
        q: 'Twenty rupees to trade with, and twenty hungry people sitting in front of him. What is the bargain?',
        options: ['Buy grain, sell it, feed them from the profit', 'Spend all twenty rupees on food and watch them eat', 'Give them one rupee and get on with the trip'],
        answer: 1,
        right: 'That is what he did — and Punjab has called it the true bargain ever since.',
        wrong: 'He did something bolder than that. He spent every last rupee on food, and sat down while they ate it.'
      } },
    { art: ['courtier'], who: null,
      text: 'They bought flour and lentils and ghee, cooked it all at the roadside, and fed everybody until nobody wanted any more. Then Nanak wiped out the empty cloth and turned for home with it folded flat in his hand.' },
    { art: ['guard', 'khanda'], who: 'guard', mood: 'wow',
      text: 'His father met him at the edge of the village. "Where is my profit?" "I made the bargain you asked for," said Nanak. "The truest one there is." Mehta Kalu did not think much of that answer at all, and said so at length.' },
    { art: ['khanda'], who: 'mithu',
      text: 'The place where it happened has been called Sacha Sauda ever since — the true bargain. And every gurdwara in the world still cooks for anyone who walks in, which is that same twenty rupees, still being spent.' }
  ],
  moral: 'The best trade you will ever make is the one where you keep nothing.',
  source: 'Sikh tradition — the Sacha Sauda, the "true bargain", from the janamsakhi accounts of Guru Nanak\'s early life. Many versions. Following Sikh practice, the Guru is not depicted.'
},

{
  id: 'sk.langar-akbar',
  collection: 'sikh',
  badge: 'katha',
  title: 'The Emperor Sits on the Floor',
  hook: 'The Emperor of India came to visit. He was told he would have to join the queue.',
  hero: 'khanda',
  cast: ['khanda', 'akbar', 'courtier'],
  minutes: 4,
  place: ['IN-PB'],
  words_hi: [['लंगर', 'langar', 'free kitchen'], ['रोटी', 'roti', 'bread'], ['बराबर', 'baraabar', 'equal']],
  scenes: [
    { art: ['khanda'], who: null,
      text: 'At Goindval, on the river Beas in Punjab, Guru Amar Das had made a rule and would not bend it for anybody: before you meet me, you eat. In the langar. Sitting on the floor in a row, with whoever else is there, off the same plate as everyone else.' },
    { art: ['courtier'], who: 'courtier',
      text: '"Everybody?" people would ask. "Everybody," said the sevadars in the kitchen, ladling out dal. "Rich, poor, first time, hundredth time. Sit down, hold out your hands."' },
    { art: ['akbar'], who: null, mood: 'wow',
      text: 'Then one day the dust on the road turned out to be the Emperor Akbar, with horses, and umbrellas, and a great many people whose whole job was to make sure that nobody ever asked him to wait for anything.' },
    { art: ['akbar', 'courtier'], who: 'courtier',
      text: 'A sevadar came out, wiping her hands. "The Guru will see you," she said, "after you have eaten." There was a silence you could have stood a spoon up in. One of the Emperor\'s men said: "Do you know who this is?" "Yes," she said. "He must be hungry."' },
    { art: ['akbar'], who: null, mood: 'think',
      text: 'Akbar looked at the low doorway of the langar hall, and the rows of people already sitting cross-legged on the floor inside — farmers, travellers, children, a potter still covered in clay.',
      ask: {
        q: 'The Emperor of India is being asked to sit on the floor with everybody else. What does he do?',
        options: ['Insist on a chair — he is the Emperor', 'Send a minister in to eat on his behalf', 'Sit down in the row'],
        answer: 2,
        right: 'He sat down. Tradition says he ate every bit of it, and asked for more.',
        wrong: 'Akbar surprised everyone. He took off his shoes, went in, and sat down in the row.'
      } },
    { art: ['akbar', 'courtier'], who: 'akbar',
      text: 'He ate coarse roti and dal off a leaf plate, with a farmer on one side of him and a child on the other. When he had finished he sat there a moment longer than he needed to. "I have eaten at every table in India," he said. "Nobody has ever made me sit on the floor. I think I see why you do it."' },
    { art: ['akbar'], who: null,
      text: 'He offered a grant of revenue land for the kitchen. The Guru would not take it: a langar is fed by ordinary people or it is not a langar.' },
    { art: ['khanda'], who: 'mithu',
      text: 'Go to the Golden Temple at Amritsar today and tens of thousands of people eat there every single day, for nothing, sitting in rows on the floor. Anyone. Any day. Still no chairs.' }
  ],
  moral: 'A meal where everybody sits in the same row is worth more than any throne in the room.',
  source: 'Sikh tradition — the account of Emperor Akbar eating in the langar at Goindval before meeting Guru Amar Das. Many tellings. Following Sikh practice, the Guru is not depicted.'
},

/* ====================================================== MAHARASHTRA ======= */
{
  id: 'fk.shivaji-baskets',
  collection: 'desh',
  badge: 'katha',
  title: 'The Baskets of Sweets',
  hook: 'Enormous baskets of sweets left the house every single day. The guards got very, very bored of checking them.',
  hero: 'shivaji',
  cast: ['shivaji', 'guard', 'courtier'],
  minutes: 5,
  place: ['IN-MH', 'IN-UP'],
  words_hi: [['टोकरी', 'tokri', 'basket'], ['मिठाई', 'mithai', 'sweets'], ['चुपचाप', 'chupchaap', 'quietly']],
  scenes: [
    { art: ['shivaji'], who: null,
      text: 'In 1666 Shivaji rode north to Agra to meet the Emperor, with his young son Sambhaji beside him. The meeting went badly. When he tried to leave, he found that he could not: soldiers on the gate, soldiers on the road, soldiers who were extremely polite and would not move.' },
    { art: ['guard', 'shivaji'], who: 'guard',
      text: '"You are the Emperor\'s guest," they said, which is a sentence that can mean two completely different things depending on who is standing in the doorway.' },
    { art: ['shivaji'], who: null, mood: 'think',
      text: 'Shivaji was a thousand miles from home, in a city he did not know, watched day and night. Fighting his way out with a handful of men was not a plan. It was a way of getting everybody killed.',
      ask: {
        q: 'Every basket, box and bundle leaving the house is searched. How do you get out?',
        options: ['Send baskets out every day until the guards stop bothering', 'Offer the guards money', 'Wait for a dark night and run'],
        answer: 0,
        right: 'Exactly. He did not beat the guards. He bored them.',
        wrong: 'He did something much slower and much cleverer. He started sending presents out — every day, for weeks.'
      } },
    { art: ['shivaji', 'courtier'], who: 'shivaji',
      text: '"I am ill," Shivaji announced, "and I am giving thanks." And out of the house each morning went great flat baskets of sweets and fruit for holy men and for the poor of Agra — carried on poles by two men each, because they were heavy.' },
    { art: ['guard'], who: null,
      text: 'The guards took the lids off. They dug about in the pedas with their hands. Nothing. The next day, the same. And the next. The baskets went out at the same hour every morning, and the guards got sticky fingers and sore backs and extremely tired of pedas.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'think',
      text: 'By the second week they were lifting one lid in three. By the third they were waving the whole procession through and going back to their shade. It is very hard to keep looking hard at something that has been boring for twenty days.' },
    { art: ['shivaji'], who: null, mood: 'wow',
      text: 'One evening two of the baskets went out heavier than usual. Nobody lifted a lid. Inside one was Shivaji, folded up small. Inside the other was Sambhaji, who was nine years old and had been told he must not sneeze.' },
    { art: ['shivaji'], who: null,
      text: 'They were carried out of the city, set down in the dark, and gone. He rode home to the Deccan by roads nobody expected, and the story says he arrived dressed as a wandering singer, which is exactly the sort of ending this story deserves.' },
    { art: ['shivaji'], who: 'mithu',
      text: 'Every child in Maharashtra knows this one, and every child in Maharashtra tells the basket bit with their hands.' }
  ],
  moral: 'Patience is a kind of key. Being boring, on purpose, for long enough, is a kind of escape.',
  source: 'Told all over Maharashtra. Shivaji was held at Agra in 1666 and got away; the escape is recorded in both Maratha and Mughal accounts, and they differ about the details — the baskets are how it is remembered.'
},

/* =========================================================== ODISHA ======= */
{
  id: 'fk.unfinished-hands',
  collection: 'desh',
  badge: 'katha',
  title: 'The Carpenter Who Asked for a Closed Door',
  hook: 'Shut the door, said the old carpenter, and do not open it for twenty-one days. On day fourteen, somebody opened it.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-OR'],
  words_hi: [['लकड़ी', 'lakdi', 'wood'], ['दरवाज़ा', 'darwaza', 'door'], ['इंतज़ार', 'intezaar', 'waiting']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'At Puri, on the coast of Odisha, King Indradyumna wanted to build the greatest temple on that shore. He had the walls. He had the towers. What he did not have was what should stand inside them, and no stone he was offered was the right stone.' },
    { art: ['courtier', 'guard'], who: 'guard', mood: 'wow',
      text: 'Then one morning the fishermen came running. A log had come in on the tide — a huge piece of dark wood, floating upright, riding the surf as though somebody were steering it. Twenty men could not lift it. Then a child pushed it, and it moved.' },
    { art: ['courtier'], who: null,
      text: 'Every carver in Odisha came to try. The best chisels in the kingdom bent, snapped, or slid off. The wood would not be cut by anyone at all.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: 'An old carpenter appeared at the palace gate — nobody had seen him before, and nobody saw him arrive. "I will do it," he said. "One condition. I work behind a shut door, and nobody opens it for twenty-one days. Not you, Maharaj. Not anybody."' },
    { art: ['courtier'], who: null,
      text: 'The door was shut. From inside came chisel-sounds, day and night, thock, thock, thock — and the whole city sat outside listening to it and guessing. On the fourteenth day the sound stopped.' },
    { art: ['courtier'], who: 'courtier', mood: 'sad',
      text: 'The queen, Gundicha, sat by that door all day. No sound. All night. No sound. "He is an old man alone in a shut room," she said, "with no water. What if he is lying on the floor in there?"',
      ask: {
        q: 'Fourteen days, and now a whole day of silence. What do you do?',
        options: ['Open the door', 'Wait the full twenty-one days as promised', 'Knock and listen for an answer'],
        answer: 1,
        right: 'That is the sensible answer, and not one person in this story managed it.',
        wrong: 'Nobody managed to wait. The queen loved whoever was behind that door too much, and she opened it.'
      } },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'The room was empty. No carpenter, no shavings, no door he could have gone out of. And standing there in the middle of the floor were three figures — huge round eyes, wide painted smiles, and arms that stopped short. Unfinished.' },
    { art: ['courtier'], who: 'courtier',
      text: 'The king came running. Everyone waited for him to say: start again, get a sculptor, finish them properly. He stood there a long time. Then he said: "No. This is how they came to us. This is how they stay."' },
    { art: ['courtier'], who: 'mithu',
      text: 'Go to Puri today and that is exactly what you will see — Jagannath, Balabhadra and Subhadra, with those enormous eyes and those unfinished arms, and every summer they are pulled through the streets on chariots so big it takes thousands of people on the ropes.' }
  ],
  moral: 'Some things are loved exactly as they are, unfinished — and Puri has proved it for centuries.',
  source: 'Odia temple tradition, told at Puri about the making of the images of Jagannath, Balabhadra and Subhadra. Many versions.'
},

/* ======================================================== NORTHEAST ======= */
{
  id: 'fk.naga-brothers',
  collection: 'desh',
  badge: 'katha',
  title: 'The Man, the Tiger and the Spirit',
  hook: 'Three brothers, one mother, and one house that was never going to be big enough.',
  hero: 'pt_lion',
  cast: ['pt_lion', 'courtier'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['भाई', 'bhai', 'brother'], ['बाघ', 'baagh', 'tiger'], ['पहाड़', 'pahaad', 'hill']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'High in the Naga hills, where the villages sit on the tops of the ridges and the clouds come in through the doorways, they tell this at the start of everything. The first mother had three sons. One was the Spirit. One was the Tiger. One was the Man.' },
    { art: ['pt_lion', 'courtier'], who: null,
      text: 'They grew up in one house, and it worked for a while, the way it does. The Spirit was up all night. The Tiger ate an enormous amount and left the bones. The Man made things out of wood and would not stop talking about them.' },
    { art: ['pt_lion'], who: 'pt_lion', mood: 'wow',
      text: '"This house is mine," said the Tiger, "I am the strongest." "It is mine," said the Man, "I built the door." The Spirit said nothing at all, which is somehow the most annoying thing anybody can do in an argument.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Their mother sat outside and listened to it for a long time, and she was old and she was tired, and she knew that all three of them were right.',
      ask: {
        q: 'Three grown brothers, one house, and none of them will move out. What does their mother do?',
        options: ['Set them a race for it', 'Make them share and take turns', 'Send all three of them away'],
        answer: 0,
        right: 'She set a race. There is a post at the edge of the field, she said. First one to touch it keeps the house.',
        wrong: 'She did something quicker. "There is a post at the edge of the field," she said. "First one to touch it keeps the house."'
      } },
    { art: ['pt_lion', 'courtier'], who: null,
      text: 'They ran. And here the tellings pull apart — in some villages the Man wins fairly, in others he wins by being cunning about it, and elders will still argue about that around a fire. But everyone agrees on what happened afterwards.' },
    { art: ['pt_lion'], who: null, mood: 'sad',
      text: 'The Tiger went to the forest. He did not say much. The Spirit went out of sight altogether, into the rocks and the water and the tall trees where you can feel him but not see him. And the Man kept the house, and the fire, and the door.' },
    { art: ['courtier'], who: 'courtier',
      text: '"Come and eat sometimes," their mother said to the Tiger at the edge of the trees. He looked back at her once, and that was all.' },
    { art: ['pt_lion'], who: 'mithu',
      text: 'Which is why, in the Naga hills, an old man telling you about a tiger will not usually call him "it". He will call him brother — and mean it exactly the way you mean it about the brother who moved far away.' }
  ],
  moral: 'Families who live apart are still families. The hills have said so about the tiger for a very long time.',
  source: 'Naga oral tradition — the tale of the first three brothers, told among several Naga communities in Nagaland. Many versions.'
},

{
  id: 'fk.khasi-sun',
  collection: 'desh',
  badge: 'katha',
  title: 'The Sun Who Would Not Come Out',
  hook: 'The sun went into a cave and pulled the dark in after her. Somebody was going to have to go and ask nicely.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'pt_lion', 'pt_elephant'],
  minutes: 4,
  place: ['IN-ML'],
  words_hi: [['सूरज', 'sooraj', 'sun'], ['गुफा', 'gufa', 'cave'], ['मुर्गा', 'murga', 'rooster']],
  scenes: [
    { art: ['pt_elephant'], who: null,
      text: 'In the Khasi hills of Meghalaya — the wettest place on earth, where the clouds walk through the villages — the sun is a woman. Ka Sngi, they call her. The moon is her brother. And once, long ago, something happened that upset her so badly that she walked into a cave and would not come out.' },
    { art: ['pt_elephant'], who: null, mood: 'sad',
      text: 'The world went dark. Not night-dark, which ends. The other kind. The rice stopped growing. The children stopped going outside. People burned pine torches in the middle of the afternoon and got used to not seeing each other\'s faces.' },
    { art: ['pt_lion'], who: 'pt_lion', mood: 'wow',
      text: 'The animals held a meeting. "I will fetch her," said the tiger, and went to the cave mouth and roared into it. The mountain shook. The bats fell off the roof. Nothing else happened at all.' },
    { art: ['pt_elephant'], who: 'pt_elephant',
      text: '"Allow me," said the elephant, and trumpeted until the trees leaned back. Then the bear tried. Then the deer, and the snake, and a great many extremely determined birds. The cave stayed dark and the sun stayed in it.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      text: 'At the back of the crowd stood a rooster. He was not large. He was not frightening. He was the sort of creature nobody looks at twice.',
      ask: {
        q: 'Roaring did not work. Trumpeting did not work. What might?',
        options: ['Something even louder', 'Somebody small, going in politely', 'Give up and light more fires'],
        answer: 1,
        right: 'Yes. The rooster went in alone, and the first thing he did was say good morning.',
        wrong: 'It was the smallest one who managed it. The rooster went in alone, and the first thing he did was say good morning.'
      } },
    { art: ['pt_crow'], who: 'pt_crow',
      text: '"Good morning," said the rooster into the dark, which was a slightly odd thing to say in the circumstances. "I have not seen you for a while. Everyone outside is asking after you. Nobody is angry. They are just cold."' },
    { art: ['pt_crow'], who: null,
      text: 'There was a long silence. Then the sun said, quietly, that she would come. But she would come only when he called for her — and she would want calling every single time.' },
    { art: ['pt_crow'], who: 'mithu',
      text: 'That is the arrangement, and it has held ever since. The rooster crows and the light comes up over the Khasi hills. He has not missed a morning yet.' }
  ],
  moral: 'Some doors only ever open for good manners.',
  source: 'Khasi oral tradition from the hills of Meghalaya, where the sun is spoken of as a woman and the rooster calls her out at dawn. Many versions.'
},

/* ========================================================== GUJARAT ======= */
{
  id: 'fk.chakli-kagdo',
  collection: 'desh',
  badge: 'katha',
  title: 'The House of Wax and the House of Dung',
  hook: 'Two birds, two houses, and the monsoon coming.',
  hero: 'pt_heron',
  cast: ['pt_heron', 'pt_crow'],
  minutes: 4,
  place: ['IN-GJ'],
  words_hi: [['चिड़िया', 'chidiya', 'sparrow'], ['बारिश', 'baarish', 'rain'], ['मोम', 'mom', 'wax']],
  scenes: [
    { art: ['pt_heron', 'pt_crow'], who: null,
      text: 'In a village in Saurashtra there lived a little sparrow and a crow, in the same neem tree, on branches that nearly touched. One hot morning in May the sparrow said the thing everybody in Gujarat says in May: "The rains are coming. We need houses."' },
    { art: ['pt_heron'], who: 'pt_heron',
      text: 'The sparrow gathered wax. That is slow work when you weigh as much as a spoon — a bead of it from a candle-maker\'s floor, a scrap from a beehive, one crumb at a time, all through the hot weeks, while everyone else sat in the shade.' },
    { art: ['pt_crow', 'pt_heron'], who: 'pt_crow', mood: 'wow',
      text: 'The crow watched her from his branch. "You are building a house out of DUST," he said. "Look at mine." He had slapped his together out of dung and mud in an afternoon, and it was three times the size, and he was extremely pleased with it.' },
    { art: ['pt_heron'], who: null,
      text: 'The sparrow kept going. By the last week of June her house was small and smooth and shut tight, and the crow had laughed at it so many times that he had begun repeating his jokes.' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      text: 'Then the monsoon came in off the Arabian Sea the way it does — not a drizzle, a wall of water. The wax house sat there with the rain running off it. The dung house went soft, and then sad, and then it was a puddle with a stick in it.' },
    { art: ['pt_crow', 'pt_heron'], who: 'pt_crow', mood: 'sad',
      text: 'At midnight there was a knock. A very wet crow stood outside with his feathers plastered flat to his head. "Sparrow," he said. "Please."',
      ask: {
        q: 'He laughed at her all summer, and now he is at the door in the rain. Does she open it?',
        options: ['No — he laughed at her for weeks', 'Yes, and say nothing at all about it', 'Yes, but he helps gather wax next year'],
        answer: 2,
        right: 'That is what she did. She opened the door and named one small price, and he paid it.',
        wrong: 'She opened the door — and then named one small price, which he was in no position to argue with.'
      } },
    { art: ['pt_heron', 'pt_crow'], who: 'pt_heron',
      text: '"Come in," said the sparrow. "Wipe your feet. And next April you are gathering wax with me, every morning, until we have two houses." "Every morning," said the crow, who was dripping on her floor and would have agreed to anything.' },
    { art: ['pt_heron'], who: 'mithu',
      text: 'They tell this one all over Gujarat as *Chakli ane Kagdo* — the sparrow and the crow. And in some versions she does not open the door. Ask at home which way your family tells it.' }
  ],
  moral: 'Do the slow work while the sun is out; and open the door anyway when somebody knocks in the rain.',
  source: 'Widely-told folk tale from Gujarat and western India — "Chakli ane Kagdo". Many versions.'
},

/* ======================================================== KARNATAKA ======= */
{
  id: 'fk.punyakoti',
  collection: 'desh',
  badge: 'katha',
  title: 'The Cow Who Came Back',
  hook: 'A tiger let a cow go home to feed her calf. Everybody told him he was a fool.',
  hero: 'pt_bull',
  cast: ['pt_bull', 'pt_lion'],
  minutes: 5,
  place: ['IN-KA'],
  words_hi: [['गाय', 'gaay', 'cow'], ['बाघ', 'baagh', 'tiger'], ['वचन', 'vachan', 'word given']],
  scenes: [
    { art: ['pt_bull'], who: null,
      text: 'This one is a song before it is a story. Children in Karnataka learn it by heart — *Dharani mandala madhyadolage* — and grown men have been known to go quiet when it is sung. It is about a cow called Punyakoti.' },
    { art: ['pt_bull'], who: null,
      text: 'The herd went out to graze at dawn with the cowherd, and came home at dusk, and Punyakoti came home last because she was the one who checked that nobody had been left behind. That is who she was. Remember it for the next bit.' },
    { art: ['pt_lion', 'pt_bull'], who: 'pt_lion', mood: 'wow',
      text: 'One evening she took a wrong turn near the rocks, and a tiger came out of the shadow of them and stood across the path. "I have been hungry for three days," he said, "and you have walked straight into my mouth."' },
    { art: ['pt_bull', 'pt_lion'], who: 'pt_bull',
      text: '"I know," said Punyakoti. She did not run. "I will not argue with you. Only — my calf has not been fed. Let me go to him, and feed him, and tell him. Then I will come back and stand exactly here."' },
    { art: ['pt_lion'], who: 'pt_lion', mood: 'think',
      text: 'The tiger laughed at that until he had to sit down. "Go on then," he said. "Go and feed your calf." He was quite certain he would never see her again, and he was rather enjoying being generous about it.' },
    { art: ['pt_bull'], who: null, mood: 'sad',
      text: 'She fed her calf. She told the herd. And the whole herd stood in the gateway of the shed so she could not get out, and the calf held on to her, and everybody talked at once about how a promise made to a tiger is not a real promise.',
      ask: {
        q: 'Her calf is fed. The gate is blocked. Nobody in the world would blame her. Does she go back?',
        options: ['Stay — the calf needs his mother', 'Go back, because she said she would', 'Send an older cow instead'],
        answer: 1,
        right: 'She went. She walked out through the herd at dusk and took the same path back to the rocks.',
        wrong: 'Punyakoti went back. She walked out through the whole herd at dusk and took the same path to the rocks.'
      } },
    { art: ['pt_lion', 'pt_bull'], who: 'pt_lion', mood: 'wow',
      text: 'The tiger heard her coming and did not believe his ears. She stopped in front of him. "I have come," she said. "I am ready." And the tiger looked at her for a long, long time.' },
    { art: ['pt_lion'], who: 'pt_lion',
      text: '"I have hunted this forest my whole life," he said at last, "and I have never once been beaten in it. Tonight I have. Go home." And he moved out of the path and let her walk past him.' },
    { art: ['pt_bull'], who: 'mithu',
      text: 'In the song that Karnataka sings, what the tiger does next is stranger and sadder than that, and it is the part that makes people go quiet. Ask somebody who knows the song to sing you the end of it.' }
  ],
  moral: 'A promise you keep when absolutely nobody could make you is the only kind that really counts.',
  source: 'Punyakoti — the Kannada folk ballad "Dharani mandala madhyadolage", sung in Karnataka for generations and learned in schools. Many versions.'
},

{
  id: 'jn.bahubali',
  collection: 'jain',
  badge: 'katha',
  title: 'The Fist That Stopped',
  hook: 'He had already won. His arm was up in the air. And then he thought of something.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 5,
  place: ['IN-KA'],
  words_hi: [['मुट्ठी', 'mutthi', 'fist'], ['बेल', 'bel', 'creeper'], ['रुकना', 'rukna', 'to stop']],
  scenes: [
    { art: ['courtier', 'guard'], who: null,
      text: 'Bharata and Bahubali were brothers. Their father had been a king and had given up being a king, and had divided everything between his sons, and for a while that worked. Then Bharata decided that every kingdom in the land ought to bow to him — including his little brother\'s.' },
    { art: ['guard'], who: 'guard',
      text: '"Everyone else has bowed," the messengers told Bahubali. "Everyone else is not his brother," said Bahubali. "I will not." And both of them called up their armies, and the two armies stood looking at each other across a plain.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'Then the old ministers walked out into the space between them. "Whatever this is," they said, "it is between the two of you. Why should thousands of people who have never met either of you be hurt over it? Settle it yourselves. Three contests. Whoever wins, wins."' },
    { art: ['guard', 'courtier'], who: null,
      text: 'So the armies sat down and watched. First they stared at each other without blinking, and Bharata blinked. Then they fought in the water, throwing it in great sheets, and Bharata went under. Then they wrestled, and Bahubali lifted his elder brother clean off the ground.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'And that was it — over, won, three out of three. Bahubali set him down, and his fist came up almost by itself, because that is what a fist does at the end of a fight.',
      ask: {
        q: 'His fist is in the air and his brother is under it. What does Bahubali do?',
        options: ['Open his hand', 'Finish it — he won fairly', 'Take the kingdom and never speak to him again'],
        answer: 0,
        right: 'He opened it. He looked at his own hand and he could not think of one single thing worth doing with it.',
        wrong: 'He opened his hand instead. He looked at it and could not think of one single thing worth doing with it.'
      } },
    { art: ['guard'], who: 'guard',
      text: '"What am I doing?" said Bahubali, out loud, in front of two armies. "I have won the whole world off my own brother. And what have I got? The world. It was always going to be the world."' },
    { art: ['courtier', 'guard'], who: null,
      text: 'He gave the kingdom to Bharata. Then he walked off the field and into the forest, and stood still there, and went on standing still for a very long time — a year, they say, without moving, until anthills rose at his feet and creepers grew up his legs and birds nested in his hair.' },
    { art: ['guard'], who: 'mithu',
      text: 'Go to Shravanabelagola in Karnataka and you can see him: a statue of Bahubali cut out of one enormous rock, taller than a five-storey building, finished in the year 981, standing perfectly still with stone creepers curling up around his legs.' }
  ],
  moral: 'The strongest thing an arm can do is stop.',
  source: 'Jain tradition — the story of Bharata and Bahubali, told in the Jain Puranas. The colossal statue at Shravanabelagola in Karnataka was completed in 981 CE and shows the creepers climbing his legs.'
},

/* ========================================== ANDHRA PRADESH · TELANGANA === */
{
  id: 'wt.tenali-dolls',
  collection: 'chatur',
  badge: 'katha',
  title: 'Three Dolls and a Piece of Thread',
  hook: 'Three dolls, exactly the same. One is priceless, one is ordinary, one is worth nothing. Prove it.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['गुड़िया', 'gudiya', 'doll'], ['धागा', 'dhaaga', 'thread'], ['राज़', 'raaz', 'secret']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'A scholar came to the court of Krishnadevaraya from a long way off, with a velvet cloth and a small box, and the manner of a man who has already decided he is the cleverest person in the room.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'wow',
      text: 'He unwrapped three dolls. Same size, same wood, same paint, same face. "One of these," he said, "is worth a lakh. One is worth a thousand. One is worth nothing whatever. Tell me which is which. Your court is famous. Let us see."' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'The ministers weighed them: identical. Tapped them: identical. Held them up to the lamp, turned them over, argued for two days. The scholar sat with his hands folded and enjoyed himself enormously.' },
    { art: ['courtier'], who: 'courtier',
      text: 'On the third day Tenali Ramakrishna wandered in late, looked at the dolls for about as long as it takes to sneeze, and asked for a piece of thin thread.',
      ask: {
        q: 'Three identical dolls, and all you have is a piece of thread. Where do you put it?',
        options: ['In the ear', 'Round them, to weigh them against each other', 'In the eye'],
        answer: 0,
        right: 'The ear. Each doll had a tiny hole in it, and the thread found out where each one went.',
        wrong: 'He went for the ear. Each doll had a tiny hole in it, and the thread found out where each one went.'
      } },
    { art: ['courtier', 'guard'], who: null,
      text: 'He fed the thread into the first doll\'s ear. It came straight out of the other ear and hung there. "This one," said Tenali, "hears everything you say and it goes clean through. Nothing stays. Worth nothing."' },
    { art: ['courtier'], who: 'courtier',
      text: 'He threaded the second. It came out of the mouth. "This one hears what you tell it and immediately tells the whole street. Worth a thousand — you can use it, but never for anything you mind about."' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'wow',
      text: 'He threaded the third. The thread went in, and stopped, and stayed. He pulled gently. It did not come out anywhere. "And this one," said Tenali, "keeps what you give it. A lakh, and cheap at the price."' },
    { art: ['guard'], who: null,
      text: 'The scholar folded up his velvet cloth without a word, which is the sound a clever visitor makes when he has been out-thought.' }
  ],
  moral: 'What a person is worth is mostly what they do with the things you tell them.',
  source: 'Tenali Ramakrishna tales, Telugu tradition — Tenali served at the court of Krishnadevaraya of Vijayanagara (reigned 1509–1529). The same puzzle is told of Birbal in the north; good stories travel.'
},

/* ============================================================ BIHAR ======= */
{
  id: 'wt.gonu-brinjal',
  collection: 'chatur',
  badge: 'katha',
  title: 'Gonu Jha and the Brinjal',
  hook: 'On Monday the king loved brinjal. On Tuesday he hated it. Gonu Jha agreed with him both times.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-BR'],
  words_hi: [['बैंगन', 'baingan', 'brinjal'], ['सवाल', 'sawaal', 'question'], ['हँसी', 'hansi', 'laughter']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'In Mithila, in north Bihar, they tell stories about Gonu Jha the way other places tell them about Birbal — a man at the Raja\'s court who was never quite as harmless as he looked.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'wow',
      text: 'One evening the Raja ate a dish of brinjal and went off like a firework. "The KING of vegetables!" he said. "Purple as a king should be! Sweet! Soft! Why do we eat anything else?"' },
    { art: ['courtier'], who: 'courtier',
      text: '"Maharaj, you have said it better than any poet," said Gonu Jha at once. "The brinjal wears a crown on its head. Even the vegetable knows it is royal."' },
    { art: ['guard'], who: 'guard', mood: 'sad',
      text: 'The following Tuesday the Raja had eaten rather too much brinjal and had spent the night regretting it in some detail. "Take it away," he groaned. "Bitter, oily, useless thing. Never let it in the kitchen again."' },
    { art: ['courtier', 'guard'], who: 'courtier',
      text: '"Quite right, Maharaj," said Gonu Jha. "A miserable vegetable. Even the crown on its head is only thorns."' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      text: 'The whole court sat up. A minister pointed straight at him. "Last week you called it royal! This week you call it thorns! You cannot have both!"',
      ask: {
        q: 'The entire court has caught him saying the opposite of what he said. What can Gonu Jha possibly say now?',
        options: ['Admit he got it wrong last week', 'Say he serves the Raja, not the vegetable', 'Blame the cook'],
        answer: 1,
        right: 'That is exactly what he said — and then he said one more thing, which was the part that mattered.',
        wrong: 'He said something quicker: "I am the Raja\'s servant, not the brinjal\'s." And then he said one more thing.'
      } },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'wow',
      text: '"Maharaj," said Gonu Jha, "I am your servant. I am not the brinjal\'s servant. It does not pay me anything." The court roared. The Raja laughed until his eyes watered — and then stopped, because something had gone in sideways.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: '"But then," said the Raja slowly, "how will I ever find out what you actually think?" "Easily, Maharaj," said Gonu Jha. "Ask me before you tell me the answer."' }
  ],
  moral: 'If you announce your answer first, you will spend your whole life hearing it come back.',
  source: 'Gonu Jha tales — the trickster of Mithila, told in Maithili across north Bihar. Many versions.'
},

{
  id: 'jt.quails-net',
  collection: 'jataka',
  badge: 'katha',
  title: 'The Quails Who Flew Off With the Net',
  hook: 'A hunter, a net, and a hundred small birds who had one thing the hunter did not.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'pt_heron', 'courtier'],
  minutes: 4,
  place: ['IN-BR'],
  words_hi: [['जाल', 'jaal', 'net'], ['मिलकर', 'milkar', 'together'], ['झगड़ा', 'jhagda', 'quarrel']],
  scenes: [
    { art: ['pt_crow'], who: null,
      text: 'A hundred quails lived in a field, and a fowler used to come at dawn, whistle like a quail until they came to him, and throw his net over the lot of them. He did very well out of it. The quails did not.' },
    { art: ['pt_crow', 'pt_heron'], who: 'pt_crow', mood: 'think',
      text: 'Their leader called a meeting in the long grass. "He is one man," he said. "We are a hundred birds. There are a hundred holes in that net and each of you has a head."',
      ask: {
        q: 'The net is falling and every bird can see it coming. What is the plan?',
        options: ['Everybody scatter in a different direction', 'Everybody put their head through a hole and lift together', 'Sit absolutely still and hope'],
        answer: 1,
        right: 'That was the plan. One hundred heads, one hundred holes, and everybody flapping at once.',
        wrong: 'The plan was better than that. Every head through a hole, and every wing beating at the same moment.'
      } },
    { art: ['pt_crow', 'pt_heron'], who: null, mood: 'wow',
      text: 'The next morning the net came down — and went straight back up again. A hundred quails carried it over the hedge, over the pond, and dropped it neatly onto a thorn bush, and slipped out from underneath and went home to breakfast.' },
    { art: ['courtier'], who: 'courtier', mood: 'sad',
      text: 'It happened again the next day. And the next. The fowler spent his mornings walking to thorn bushes and untangling his own net, and his wife had opinions about it that she shared at some length.' },
    { art: ['pt_heron', 'pt_crow'], who: 'pt_heron', mood: 'wow',
      text: 'Then one morning, landing in the field, one quail\'s wing clipped another\'s head. "You did that on purpose." "I did not." "You always flap too hard." "You always flap too LATE." And the whole field took a side, loudly.' },
    { art: ['courtier'], who: null,
      text: 'The fowler came at dawn and whistled, and the net came down. "LIFT!" shouted the leader. And half the field shouted "You lift!" and the other half shouted "No, YOU lift!" — and the net did not move so much as an inch.' },
    { art: ['pt_crow'], who: null, mood: 'sad',
      text: 'The leader had seen it coming three days earlier, and had already taken the birds who would still listen to him to a different field. He always said afterwards that it was not the net that beat them.' },
    { art: ['pt_crow'], who: 'mithu',
      text: 'The Buddha is said to have told this one to a group of his own students who had been arguing all morning. He did not tell them off. He just told them about the quails, and then he went for a walk.' }
  ],
  moral: 'A hundred birds together can carry a net. Two birds arguing cannot lift a feather.',
  source: 'Sammodamana Jataka — from the Jataka collection in Pali, the stories of the Buddha\'s earlier lives.'
},

{
  id: 'jn.chandkaushik',
  collection: 'jain',
  badge: 'katha',
  title: 'The Snake Everybody Ran From',
  hook: 'There was a short path through the forest that nobody had walked for years. A man in no hurry walked straight down it.',
  hero: 'mahavira',
  cast: ['mahavira', 'courtier'],
  minutes: 4,
  place: ['IN-BR'],
  words_hi: [['साँप', 'saanp', 'snake'], ['गुस्सा', 'gussa', 'anger'], ['दूध', 'doodh', 'milk']],
  scenes: [
    { art: ['courtier'], who: 'courtier', mood: 'sad',
      text: 'The villagers caught up with him at the edge of the trees, all talking at once. "Not that way. There is a serpent on that path — Chandkaushik. Look at the grass round his tree, it is burnt. Go round. It is only one day longer."' },
    { art: ['mahavira'], who: 'mahavira',
      text: '"Thank you," said Mahavira. "One day is a long time to somebody who is angry." And he walked in.' },
    { art: ['mahavira'], who: null,
      text: 'The path was empty and very quiet. No birds. No insects. He walked until he came to the tree the villagers had described, and then he stopped, and stood, and closed his eyes, and did not move at all.' },
    { art: ['mahavira'], who: null, mood: 'wow',
      text: 'Chandkaushik came out fast. He had spent his whole life being screamed at, hit with sticks, run from — and every single time it had made him angrier, until anger was more or less all there was left of him. He struck at the man\'s foot.',
      ask: {
        q: 'The snake has bitten him and is waiting for him to fall over and scream. What does Mahavira do?',
        options: ['Step back out of range', 'Nothing at all — stay exactly where he is', 'Speak sternly to him'],
        answer: 1,
        right: 'Nothing. He stood there. And that was the one thing that had never happened to Chandkaushik before.',
        wrong: 'He did nothing whatsoever. He stood there — and that was the one thing that had never happened to Chandkaushik before.'
      } },
    { art: ['mahavira'], who: null, mood: 'wow',
      text: 'The snake struck again. And then he stopped, because something was wrong. The man had not fallen. The man had not shouted. And what was running from the mark on his foot was not red. It was white as milk.' },
    { art: ['mahavira'], who: 'mahavira',
      text: 'Mahavira opened his eyes and looked down at him, and said only this, quite quietly: "Understand, Chandkaushik. Understand."' },
    { art: ['mahavira', 'courtier'], who: null,
      text: 'The story says the snake lay very still for a long time, and then went back under his tree, and never struck at anything again. The villagers came out to look, cautiously, then less cautiously, and after a while children were using the short path to school.' },
    { art: ['mahavira'], who: 'mithu',
      text: 'This is one of the stories Jain families tell when they talk about ahimsa — not hurting. It is not really about the snake. It is about what standing still can do.' }
  ],
  moral: 'Anger has been shouted at all its life. It has almost never been stood still in front of.',
  source: 'Jain tradition — the story of Chandkaushik, from Shvetambara accounts of Mahavira\'s years of wandering. Many versions.'
},

/* ========================================================== KASHMIR ======= */
{
  id: 'wt.kashmir-carry',
  collection: 'chatur',
  badge: 'katha',
  title: 'Shall I Carry You, or Will You Carry Me?',
  hook: 'A farmer asked the king three questions on the road home. The king could not answer one of them. A girl answered all three.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-JK'],
  words_hi: [['रास्ता', 'raasta', 'road'], ['कहानी', 'kahani', 'story'], ['पहेली', 'paheli', 'riddle']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'A king of Kashmir liked to walk about his country in ordinary clothes, because a king in ordinary clothes finds out things a king in a crown never will. One long afternoon he fell into step with a farmer going the same way along the road to the town.' },
    { art: ['guard', 'courtier'], who: 'courtier',
      text: 'They had walked about a mile in silence when the farmer said: "Shall I carry you, or will you carry me?"' },
    { art: ['guard'], who: 'guard', mood: 'think',
      text: 'The king looked at him. The farmer was a small man carrying a bundle. The king was a large man carrying nothing. "Carry me?" he said. "We are both perfectly well. We are both walking. What sort of a question is that?" The farmer said nothing and walked on.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      text: 'Further along they passed a field of ripe wheat, standing tall and gold with nobody in it. "Is that field eaten," asked the farmer, "or not?" "Eaten?" said the king. "It is standing right there in front of you. Nothing has touched it." The farmer said nothing and walked on.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'At the edge of the town they passed a funeral. "Is that man alive," asked the farmer, "or dead?" The king had had enough. "You can see he is dead." At the crossroads the farmer stopped and said, quite kindly, "You are a learned man. But you do not know anything," and turned for home.',
      ask: {
        q: '"Shall I carry you, or will you carry me?" They were both walking. What could he possibly have meant?',
        options: ['He wanted a piggyback', 'He meant: tell me a story, and the road carries us both', 'He was testing how strong the king was'],
        answer: 1,
        right: 'That is it exactly. Whoever tells the story does the carrying — and the miles go by underneath.',
        wrong: 'He meant something better. Whoever tells the story does the carrying — the road goes by underneath and neither of you notices.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      text: 'At home the farmer told his daughter about the odd, well-dressed man on the road, and she put down what she was doing and laughed. "Abba. He did not understand any of it, did he?"' },
    { art: ['courtier'], who: 'courtier',
      text: '"Carry me" means tell me a story to shorten the road, she said. "Is the field eaten?" means: has the farmer already borrowed money against that crop — because if he has, then it is eaten, standing there or not. "Is the man alive?" means: has he left children who will remember him — because if he has, then he is not entirely gone.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      text: 'The king, who had followed at a distance because he could not bear not knowing, was standing in the doorway by then. He went home thinking about all three of them, and about the fact that the cleverest person he had met that day had been sitting in a farmhouse doing the washing.' }
  ],
  moral: 'A long road and a hard question are the same thing: somebody has to start talking.',
  source: 'Folk Tales of Kashmir, collected by J. Hinton Knowles, 1888 — from the tale "Why the Fish Laughed".'
},

/* ===================================================== CHHATTISGARH ======= */
{
  id: 'fk.lingo-song',
  collection: 'desh',
  badge: 'katha',
  title: 'Lingo and the First Song',
  hook: 'The forest had every sound in it except one. Somebody had to go and invent music.',
  hero: 'courtier',
  cast: ['courtier', 'pt_deer', 'pt_crow'],
  minutes: 4,
  place: ['IN-CT'],
  words_hi: [['संगीत', 'sangeet', 'music'], ['गीत', 'geet', 'song'], ['जंगल', 'jangal', 'forest']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'The Gond people of central India — the forests and hills of Chhattisgarh and Madhya Pradesh — tell of Lingo, who came first and worked things out for everybody else. Most of what the Gonds have, the singers say, Lingo went and fetched.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      text: 'One evening Lingo sat and listened to the forest, and he could hear everything in it. Water over stones. Bamboo knocking. Bees. Rain starting at the far end of the valley and coming towards him. "All of that is sound," he said. "None of it is a song. A song has to be able to come back."' },
    { art: ['pt_crow', 'courtier'], who: null,
      text: 'He tried whistling and it blew away. He tried banging two sticks, which is a good noise but not a song. He tried getting the birds to do it again, and the birds pointed out, reasonably, that they never do anything the same way twice.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'So he sat with what he had: a dry gourd with nothing in it, a length of wood, and some fibre twisted into cord.',
      ask: {
        q: 'A dry gourd, a stick and some cord. How do you make a sound that stays?',
        options: ['Bang the gourd like a drum', 'Stretch the cord across it and pull', 'Blow into the end of the gourd'],
        answer: 1,
        right: 'Yes. Cut a hole in the gourd, tie the cord tight across it, and pull — and the gourd gives you back a note.',
        wrong: 'He found something better. He cut a hole in the gourd, tied the cord tight across it, pulled — and the gourd gave the note back to him.'
      } },
    { art: ['courtier', 'pt_deer'], who: null, mood: 'wow',
      text: 'The note went out across the valley and came home again off the far hill. Lingo pulled the string a second time to see whether it would do it twice. It did. He sat there half the night finding out what else it would do.' },
    { art: ['pt_deer', 'courtier'], who: null,
      text: 'By morning there were deer standing at the edge of the clearing, which deer do not do, and the whole village had come out to listen, and somebody had started tapping their foot without noticing they were doing it — which is how dancing got started, in a fair number of stories.' },
    { art: ['courtier'], who: 'courtier',
      text: '"Now hold this," said Lingo, and gave it to somebody else. That is the important part. He did not keep it.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The Pardhan Gond singers still carry a three-stringed fiddle called the bana, and they still sing the old songs with it. Gond painters put the songs on the wall too — that is the Gond art with the tiny lines and dots inside every animal, which you may have seen.' }
  ],
  moral: 'Music was not found lying about the place. Somebody sat down and made it, and then handed it on.',
  source: 'The Gond tradition of Lingo, culture hero of the Gonds of central India, sung by Pardhan Gond singers with the bana fiddle. Many versions.'
},

/* =================================================== MADHYA PRADESH ======= */
{
  id: 'wt.vetala-tree',
  collection: 'chatur',
  badge: 'katha',
  title: 'The Thing in the Tree',
  hook: 'Carry me to the far end of the wood without saying one single word. Easy, said the king. It was not.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 5,
  place: ['IN-MP'],
  words_hi: [['पेड़', 'ped', 'tree'], ['चुप', 'chup', 'quiet'], ['सवाल', 'sawaal', 'question']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'King Vikramaditya of Ujjain had promised something to a monk, and being the sort of king he was, he had not asked enough questions first. The promise was this: go to the old tree at the edge of the wood on a night with no moon, and bring back the vetala that hangs in it.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'A vetala is a spirit that gets into things and will not get out of them, and this one hung upside down in the branches like an enormous folded bat, and had been enjoying itself there for years.' },
    { art: ['courtier', 'guard'], who: null,
      text: '"Take me down then," said the vetala cheerfully. "I shall even climb on your back. One rule. You may not speak. Say one word on the way and I fly straight back to my tree and you can start again." Vikram, who was a man of few words, thought this sounded extremely easy.' },
    { art: ['guard'], who: null,
      text: 'It was not extremely easy. Because the vetala talked all the way, and what it talked about were stories — and every single story stopped at the end with a question that had a hook in it. Whose fault was it? Who was the bravest? Who had really earned the reward?' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      text: 'And Vikram knew. He was a judge as well as a king, and he had spent his whole life listening to two people tell him the same story two different ways, and he could not hear an unfair thing said out loud and let it stand.',
      ask: {
        q: 'He knows the answer. Saying it costs him the entire night\'s walk. What does the king do?',
        options: ['Keep his mouth shut and win', 'Answer, because he knows', 'Whisper it too quietly to be heard'],
        answer: 1,
        right: 'He answered. And whoosh — off went the vetala, back up the tree, laughing all the way. Twenty-four times.',
        wrong: 'He could not do it. He answered — and off went the vetala, back up into the tree, laughing. Twenty-four times.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      text: 'Twenty-four times Vikram walked back to the tree. Twenty-four times he climbed it, took the thing down, put it on his back and set off. He never once said: this is impossible. He never once said: keep your stories to yourself.' },
    { art: ['guard'], who: null,
      text: 'On the twenty-fifth night the vetala told the last story, and asked the last question — and Vikram opened his mouth, and shut it again, and walked on. He genuinely did not know the answer. It was the only silence the vetala had ever got out of him, and it was an honest one.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      text: '"Well," said the vetala, hanging comfortably on his back as the trees thinned out. "You are the first person I have not been able to bore, annoy or trick. Since we are nearly there — let me tell you one more thing, and this one is not a riddle. It is about that monk of yours."' },
    { art: ['guard'], who: 'mithu',
      text: 'There are twenty-five of these, and each one is a story inside the story. Grown-ups have been arguing about the answers for a thousand years, which is exactly what the vetala wanted.' }
  ],
  moral: 'Not being able to keep quiet about what is right is a fault. It is also the best thing about him.',
  source: 'Vetala Panchavimshati — the twenty-five tales of the vetala, told of King Vikramaditya of Ujjain. The frame and the tales are included in Somadeva\'s Kathasaritsagara, written in Kashmir in the 11th century.'
},

/* ==================================================== UTTAR PRADESH ======= */
{
  id: 'jt.banyan-deer',
  collection: 'jataka',
  badge: 'katha',
  title: 'The Deer Who Would Not Send Anyone Else',
  hook: 'The king hunted every morning, so the deer made an arrangement. Then one day the lot fell on a mother.',
  hero: 'pt_deer',
  cast: ['pt_deer', 'courtier', 'guard'],
  minutes: 5,
  place: ['IN-UP'],
  words_hi: [['हिरण', 'hiran', 'deer'], ['राजा', 'raja', 'king'], ['जान', 'jaan', 'life']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'The king of Benares hunted deer in his park every single morning, with horses and drums and a hundred men. The herds ran until they dropped. Far more deer were hurt in the running than were ever needed in the kitchen, and the park was becoming a miserable place to live.' },
    { art: ['pt_deer'], who: 'pt_deer',
      text: 'There were two herds and two leaders. One was Nigrodha, the Banyan Deer, whose coat was the colour of gold. "This cannot go on," he said. "Let us go to the king and offer him a bargain."' },
    { art: ['pt_deer', 'guard'], who: null,
      text: 'The bargain was this: no more hunts, no more running, no more broken legs. Each morning one deer would draw the short lot and walk to the kitchen on its own. The king thought it a very sensible arrangement and agreed at once.' },
    { art: ['pt_deer'], who: null, mood: 'sad',
      text: 'And so it went, one a day, for a long time. Until one morning the lot fell on a doe of the other herd, who was going to have her fawn within the week. She went to her own leader and asked whether her turn might come after the birth. He said the lot was the lot, and turned away.' },
    { art: ['pt_deer'], who: 'pt_deer', mood: 'think',
      text: 'So she went and found the golden deer of the other herd, and stood in front of him, and asked him to send somebody in her place.',
      ask: {
        q: 'She is asking him to order some other deer to go instead of her. What does the Banyan Deer do?',
        options: ['Draw a new lot — that is fair', 'Refuse: a rule is a rule', 'Go himself'],
        answer: 2,
        right: 'He went himself. He could not think of one animal in that park he had the right to send.',
        wrong: 'He did the one thing nobody expected. He walked to the kitchen himself.'
      } },
    { art: ['guard', 'pt_deer'], who: 'guard', mood: 'wow',
      text: 'The cook came out with his knife and dropped it, and ran for the king. The king came at a run himself and found the golden deer standing quietly with his head on the block. "You are the one deer in this park I promised never to touch. Why are you here?"' },
    { art: ['pt_deer', 'guard'], who: 'pt_deer',
      text: '"Because a mother drew the lot," said Nigrodha. "And I found that I could not order anybody else to take her place. If I can send them, they are not mine. They are just supplies."' },
    { art: ['guard'], who: 'guard',
      text: 'The king was quiet for a while. "Get up," he said. "Your life is yours." "And hers?" "Hers too." "And the rest of the herd?" "Yes." "And the deer outside the park? And the birds? And the fish in the river?" The king laughed, and gave in, and gave in, and gave in.' },
    { art: ['pt_deer'], who: 'mithu',
      text: 'The Buddha told this one about himself, in an earlier life, when he was the deer. If you ever go to Sarnath near Varanasi, you will hear the place called the Deer Park — that name has been going a long time.' }
  ],
  moral: 'A leader is simply the one who finds they cannot send somebody else.',
  source: 'Nigrodhamiga Jataka — the Banyan Deer, from the Pali Jataka collection. The story is set at Benares.'
},

{
  id: 'jt.hare-moon',
  collection: 'jataka',
  badge: 'katha',
  title: 'The Hare in the Moon',
  hook: 'Look at the moon tonight. There is somebody up there, and this is how he got there.',
  hero: 'pt_rabbit',
  cast: ['pt_rabbit', 'pt_monkey', 'pt_jackal', 'courtier'],
  minutes: 4,
  place: ['IN-UP'],
  words_hi: [['चाँद', 'chaand', 'moon'], ['आग', 'aag', 'fire'], ['खरगोश', 'khargosh', 'hare']],
  scenes: [
    { art: ['pt_rabbit', 'pt_monkey'], who: null,
      text: 'Four friends lived by a river: a monkey, a jackal, an otter, and a hare. The hare was the one who thought about things. One evening, with the full moon coming, he said: "Tomorrow is a day for giving. If anybody comes past hungry, we feed them. Agreed?" Everybody agreed, in the easy way you agree to things the night before.' },
    { art: ['pt_monkey'], who: null,
      text: 'In the morning the monkey went out and came back with mangoes, which was easy for him. The jackal found a pot of curds somebody had left at the edge of a field. The otter found fish in the shallows. All three of them sat down feeling extremely pleased.' },
    { art: ['pt_rabbit'], who: 'pt_rabbit', mood: 'think',
      text: 'The hare went out to gather food and came back with grass. He looked at his little heap of grass for a long time. "Nobody," he said, "has ever walked up to a stranger and offered them a mouthful of grass."' },
    { art: ['courtier', 'pt_rabbit'], who: 'courtier',
      text: 'And then an old traveller came up the road, thin and dusty, and sat down on a stone. "I have not eaten," he said. "Have you anything?" The monkey brought his mangoes. The otter brought the fish. The jackal brought the curds. And the hare stood there with his grass.',
      ask: {
        q: 'The others have mangoes, fish and curds. The hare has grass, and the traveller cannot eat grass. What has he actually got?',
        options: ['The grass — he should offer it anyway', 'Nothing at all', 'Himself'],
        answer: 2,
        right: 'Himself. "Build a fire," said the hare, "and I will jump into it, and then you will have supper."',
        wrong: 'He had himself. "Build a fire," said the hare, "and I shall jump into it, and then you will have supper."'
      } },
    { art: ['pt_rabbit', 'courtier'], who: null, mood: 'wow',
      text: 'The traveller gathered sticks and lit them. And the hare, before he jumped, shook himself three times — very carefully — so that any small insect hiding in his fur would fall out and not be hurt. Then he jumped straight in.' },
    { art: ['pt_rabbit'], who: null, mood: 'wow',
      text: 'And the fire was cold. Cold as river water. The hare sat in the middle of the flames feeling perfectly comfortable and extremely confused, and looked up — and the old traveller was not an old traveller at all, and was smiling.' },
    { art: ['courtier', 'pt_rabbit'], who: 'courtier',
      text: '"I came to find out whether you meant it," he said. "You meant it. Now everybody is going to know." And he reached up and drew the shape of the hare on the face of the moon, so that it would still be there tonight.' },
    { art: ['pt_rabbit'], who: 'mithu',
      text: 'Go outside when the moon is full and look at the grey marks on it. Half of Asia sees a hare in them. Once somebody shows you, you cannot stop seeing it.' }
  ],
  moral: 'The one with nothing to give is very often the one who finds the biggest thing to give.',
  source: 'Sasa Jataka — from the Pali Jataka collection. The markings on the full moon are read as a hare across much of Asia.'
},

/* ========================================================== HARYANA ======= */
{
  id: 'ep.yaksha-lake',
  collection: 'epics',
  badge: 'katha',
  title: 'The Questions at the Lake',
  hook: 'Four brothers drank from the lake and fell down asleep. The fifth one was asked some questions first.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 5,
  place: ['IN-HR'],
  words_hi: [['पानी', 'paani', 'water'], ['सवाल', 'sawaal', 'question'], ['माँ', 'maa', 'mother']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'The five Pandava brothers were living in the forest, a long way from any kingdom, and it was the end of a very hot day and they had run out of water. Nakula, the quickest, went off to look and found a lake so still it looked like a floor.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'As he knelt down a voice came out of the water. "This lake is mine. Answer my questions, then drink." Nakula was extremely thirsty and thought very little of talking lakes. He drank — and fell down beside it as though he had been switched off.' },
    { art: ['guard', 'courtier'], who: null, mood: 'sad',
      text: 'Sahadeva went to look for him, and the same. Then Arjuna, the greatest archer alive, who shot an arrow into the water first and then drank anyway, and fell. Then Bhima, who was the strongest man in the world, which turned out not to help either.' },
    { art: ['guard'], who: 'guard',
      text: 'Yudhishthira came last and found his four brothers lying by the water like fallen trees, with no mark on them. He stood up, and he did not drink. "Ask," he said.' },
    { art: ['courtier'], who: null,
      text: '"What is heavier than the earth?" — "A mother." "What is higher than the sky?" — "A father." "What is faster than the wind?" — "The mind." "And what is the most amazing thing in the whole world?"' },
    { art: ['guard'], who: 'guard', mood: 'think',
      text: '"That every day," said Yudhishthira, "people see others die. And every single one of them goes on living as though it will never happen to them. There is nothing stranger than that anywhere."' },
    { art: ['courtier', 'guard'], who: 'courtier',
      text: 'The voice was quiet for a moment. "You have answered everything. So here is your prize: I will wake up one of your brothers. Only one. You choose."',
      ask: {
        q: 'Bhima is the strongest man alive. Arjuna is the greatest archer alive. Who does Yudhishthira ask for?',
        options: ['Bhima, the strongest', 'Arjuna, the best archer', 'Nakula — so that each of his father\'s two wives keeps a son'],
        answer: 2,
        right: 'Nakula. Not the most useful brother. The one that made the family come out even.',
        wrong: 'He asked for Nakula — not the most useful brother, but the one that made the family come out even.'
      } },
    { art: ['guard'], who: 'guard',
      text: '"Nakula," said Yudhishthira. "My father had two wives. My mother has three sons lying here. His mother has two. If only one may get up, let it be one of hers, so that neither mother is left with nothing."' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'And all four of them sat up at once, rubbing their eyes and asking what had happened. The voice in the lake had one more surprise in it, but that is a different part of the story.' }
  ],
  moral: 'When you are the one who gets to choose, choose so that nobody is left with nothing.',
  source: 'Mahabharata, Vana Parva — the Yaksha Prashna, the questions at the lake. Retold in plain English; the questions and the answers are given in the epic.'
},

/* ===================================================== UTTARAKHAND ======== */
{
  id: 'ep.bhima-hanuman',
  collection: 'epics',
  badge: 'katha',
  title: 'The Old Monkey on the Path',
  hook: '"Move your tail, grandfather, I am in a hurry." — "I am old, son. You move it."',
  hero: 'hanuman',
  cast: ['hanuman', 'guard'],
  minutes: 4,
  place: ['IN-UK'],
  words_hi: [['पूँछ', 'poonchh', 'tail'], ['ताकत', 'taakat', 'strength'], ['फूल', 'phool', 'flower']],
  scenes: [
    { art: ['guard'], who: null,
      text: 'High in the Himalaya, a flower came floating down a stream past the Pandavas\' camp — a saugandhika, huge and pale, and it smelled like nothing else in the world. Draupadi picked it out of the water and said she would like some more. Bhima was up the path before anybody could suggest that this was not urgent.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'Bhima was the strongest man alive and knew it. He went up the mountain in a straight line, through the forest rather than round it, snapping trees out of his way and roaring so that the deer and the elephants got well clear. It was, frankly, a lot of noise for a flower.' },
    { art: ['hanuman', 'guard'], who: null,
      text: 'Then the path narrowed between two rocks, and lying right across it in the sun was an extremely old monkey, thin, grey round the muzzle, apparently asleep. His tail lay across the path like a fallen rope.' },
    { art: ['guard', 'hanuman'], who: 'guard',
      text: '"Out of the way, grandfather," said Bhima. "Move your tail." The old monkey opened one eye. "I would, son, but I am very old and it is very heavy. Move it yourself. Just lift it aside — gently, mind."' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'Bhima reached down with one hand, the hand that lifted trees, and took hold of the tail to flick it out of the way. It did not move. He used both hands. Nothing. He braced his feet on the rocks and pulled with everything he had, until he was shaking and the sweat ran off his chin — and the tail lay exactly where it had been lying.',
      ask: {
        q: 'He has pulled with everything he has, and it has not shifted by a hair. What now?',
        options: ['Pull harder — he is the strongest man alive', 'Climb over it and get on', 'Stop, and ask who this is'],
        answer: 2,
        right: 'He stopped. He let go, and stepped back, and asked — and that question is the whole point of the story.',
        wrong: 'He did the harder thing. He let go, stepped back, and asked who he was talking to.'
      } },
    { art: ['guard', 'hanuman'], who: 'guard', mood: 'wow',
      text: '"Forgive me," said Bhima, and he did not say it the way he usually said things. "No monkey alive has a tail I cannot lift. Who are you?"' },
    { art: ['hanuman'], who: 'hanuman',
      text: '"Somebody who crossed a sea once," said the old monkey, sitting up. "And who is, I am told, your brother — we have the same father, the wind. I heard you coming from about four miles away, and I thought I would slow you down before you frightened every animal on this mountain."' },
    { art: ['hanuman', 'guard'], who: null,
      text: 'Hanuman told him where the saugandhika flowers grew, and how to ask the guardians of that pool politely instead of shouting at them. And then he said: when your family really needs me, one day, I shall be there. And he was.' },
    { art: ['hanuman'], who: 'mithu',
      text: 'Bhima went up the rest of that mountain quite a lot more quietly than he came up the first half of it.' }
  ],
  moral: 'The moment you stop pulling and start asking is the moment you find out who you are talking to.',
  source: 'Mahabharata, Vana Parva — Bhima and Hanuman on the mountain, from the episode of the saugandhika flower.'
}

];

window.IND_COLLECTIONS_REGIONAL = [
  { id: 'desh',   name: 'Tales from Every Corner', note: 'One story from each part of India, told in its own colours.', avatar: 'pt_bull' },
  { id: 'chatur', name: 'The Clever Ones',         note: 'Tenali Raman, Gopal Bhar, Gonu Jha — and a king who could not keep quiet.', avatar: 'courtier' },
  { id: 'jataka', name: 'Jataka Tales',            note: 'Stories the Buddha told, mostly about animals behaving better than people.', avatar: 'pt_deer' },
  { id: 'jain',   name: 'Jain Stories',            note: 'Ahimsa told as story — the ones about stopping.', avatar: 'mahavira' },
  { id: 'sikh',   name: "The Guru's Way",          note: 'From the Sikh tradition, told through what happened. Sikhs do not picture the Gurus, so nor do we.', avatar: 'khanda' },
  { id: 'epics',  name: 'More from the Epics',     note: 'Corners of the Ramayana and Mahabharata you may not have been told yet.', avatar: 'rama' }
];
