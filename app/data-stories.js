/* Bizzing India — story content.
   Told scene by scene, the way a storyteller tells it: a hook, named characters
   with actual dialogue, a turn where the child has to decide something, then the
   moral — spoken by Mithu, never printed as a lecture.

   Every object carries a badge per docs/05:
     katha   = a story as it is told
     itihaas = what evidence shows
     aaj     = how it lives today

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id or null for narration
     text     what is said / told
     mood     gattu/mithu mood hint for the teller
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES = [

/* ======================================================= PANCHATANTRA ===== */
{
  id: 'pt.lion-rabbit',
  collection: 'panchatantra',
  badge: 'katha',
  title: 'The Lion Who Met Himself',
  hook: 'A lion who ate whatever he liked. And one small rabbit who had had enough.',
  hero: 'pt_rabbit',
  cast: ['pt_lion', 'pt_rabbit'],
  minutes: 4,
  place: ['IN-MP'],
  words_hi: [['शेर', 'sher', 'lion'], ['खरगोश', 'khargosh', 'rabbit'], ['कुआँ', 'kuan', 'well']],
  scenes: [
    { art: ['pt_lion'], who: null, mood: 'think',
      text: 'In the forest of Mandara there lived a lion called Bhasuraka. He was not hungry. That was the trouble. He killed for the fun of it, ten animals a day, and the forest was emptying out.' },
    { art: ['pt_deer', 'pt_lion'], who: 'pt_deer',
      text: '"Great king," said the animals, trembling together, "stop hunting us. We will send you one animal every single day. You will never have to lift a paw."' },
    { art: ['pt_lion'], who: 'pt_lion',
      text: '"Agreed," yawned Bhasuraka. "But if one day nobody comes — I will eat every last one of you."' },
    { art: ['pt_rabbit'], who: null,
      text: 'And so it went. One animal each day, walking to its own death. Until the day the lot fell to a very small, very slow, very thoughtful rabbit.' },
    { art: ['pt_rabbit'], who: 'pt_rabbit', mood: 'think',
      text: '"I am small," said the rabbit to himself, walking as slowly as he possibly could. "I cannot fight him. I cannot outrun him. But I have all morning to think — and he has none."',
      ask: {
        q: 'The rabbit is far too small to fight. What would you do?',
        options: ['Run away and hide forever', 'Arrive very late and make him angry', 'Bring a friend to help fight'],
        answer: 1,
        right: 'Exactly what the rabbit did. An angry lion stops thinking — and that was the whole plan.',
        wrong: 'The rabbit tried something braver. He arrived very, very late — because an angry lion stops thinking.'
      } },
    { art: ['pt_lion', 'pt_rabbit'], who: 'pt_lion', mood: 'wow',
      text: '"YOU ARE LATE!" roared Bhasuraka. "And you are barely a mouthful!"' },
    { art: ['pt_rabbit', 'pt_lion'], who: 'pt_rabbit',
      text: '"Forgive me, king. Five rabbits were sent. But another lion caught us on the road and ate four. He said he is the real king of this forest. He said you are nobody."' },
    { art: ['pt_lion'], who: 'pt_lion', mood: 'wow',
      text: '"ANOTHER LION? Take me to him. NOW."' },
    { art: ['pt_rabbit', 'pt_lion'], who: null,
      text: 'The rabbit led him to an old stone well, deep and still. "He lives in there," he whispered. Bhasuraka leaned over the edge — and there he was. The other lion. Glaring straight up at him.' },
    { art: ['pt_lion'], who: null, mood: 'wow',
      text: 'Bhasuraka roared. The well roared back, louder. So he jumped in to fight him. And that was the end of Bhasuraka — who had never once in his life looked at himself and understood what he was seeing.' },
    { art: ['pt_rabbit'], who: 'mithu',
      text: 'The rabbit walked home slowly. He had all the time in the world now.' }
  ],
  moral: 'Cleverness is a kind of strength. And a bully is often beaten by his own temper.',
  source: 'Panchatantra, Book I (Mitra-bheda), Sanskrit, c. 300 BCE–500 CE.'
},

{
  id: 'pt.monkey-crocodile',
  collection: 'panchatantra',
  badge: 'katha',
  title: 'The Monkey Who Kept His Heart in a Tree',
  hook: 'The best friend you ever had. And his wife, who wanted you for dinner.',
  hero: 'pt_monkey',
  cast: ['pt_monkey', 'pt_crocodile'],
  minutes: 4,
  place: ['IN-WB'],
  words_hi: [['बंदर', 'bandar', 'monkey'], ['नदी', 'nadi', 'river'], ['दोस्त', 'dost', 'friend']],
  scenes: [
    { art: ['pt_monkey'], who: null,
      text: 'On the bank of a wide river grew a jamun tree, heavy with purple fruit. In it lived a monkey who had more fruit than he could ever eat, and nobody to share it with.' },
    { art: ['pt_crocodile', 'pt_monkey'], who: 'pt_monkey',
      text: 'One day a crocodile hauled himself up onto the bank to rest. "You look tired," said the monkey, and dropped him a handful of jamuns. "Try these."' },
    { art: ['pt_monkey', 'pt_crocodile'], who: null,
      text: 'They became friends the way you do — slowly, over fruit, every afternoon for months. The crocodile started carrying some home to his wife.' },
    { art: ['pt_crocodile'], who: null, mood: 'think',
      text: '"If the fruit is this sweet," his wife said one evening, "imagine the monkey. He has eaten nothing but sweetness his whole life. I want his heart."' },
    { art: ['pt_crocodile'], who: 'pt_crocodile', mood: 'sad',
      text: '"He is my friend," said the crocodile. "He is my dinner," said his wife, "or I am not your wife." And the crocodile — who was weak in exactly the way that gets people killed — went back to the tree.' },
    { art: ['pt_crocodile', 'pt_monkey'], who: 'pt_crocodile',
      text: '"Come to my home across the river," he said. "My wife wants to thank you." The monkey, who could not swim a stroke, climbed onto his back with total trust.' },
    { art: ['pt_monkey', 'pt_crocodile'], who: null,
      text: 'Halfway across, in the deepest water, the crocodile stopped. "I have to tell you something," he said. "My wife wants to eat your heart."',
      ask: {
        q: "You're in the middle of a river, on the back of someone who wants your heart. What now?",
        options: ['Jump off and try to swim', 'Beg him to turn back', 'Tell him you left your heart in the tree'],
        answer: 2,
        right: 'Perfect. The monkey did not panic — he made the crocodile need him.',
        wrong: 'The monkey did something stranger. He laughed, and said: "Why didn\'t you SAY so? I left my heart in the tree."'
      } },
    { art: ['pt_monkey'], who: 'pt_monkey', mood: 'wow',
      text: '"Oh! Why didn\'t you say so before we left?" laughed the monkey. "We monkeys keep our hearts hanging in the tree. It is far too precious to carry about. Take me back and I will fetch it for you."' },
    { art: ['pt_crocodile'], who: null,
      text: 'And the crocodile — who had believed every word the monkey had ever said, and saw no reason to stop now — turned around and swam him all the way back.' },
    { art: ['pt_monkey', 'pt_crocodile'], who: 'pt_monkey',
      text: 'The monkey went up that tree faster than he had ever climbed anything. From the top branch he called down: "My heart is where it has always been — inside me. Go home. And do not come back."' }
  ],
  moral: 'Keep your wits about you, especially with people you love. Panic is what the trap is waiting for.',
  source: 'Panchatantra, Book IV (Labdha-praṇāśam).'
},

{
  id: 'pt.talkative-tortoise',
  collection: 'panchatantra',
  badge: 'katha',
  title: 'The Tortoise Who Had to Have the Last Word',
  hook: 'Two friends, one stick, and a mouth that would not stay shut.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'pt_heron'],
  minutes: 3,
  place: ['IN-RJ'],
  words_hi: [['कछुआ', 'kachhua', 'tortoise'], ['आकाश', 'aakash', 'sky'], ['चुप', 'chup', 'quiet']],
  scenes: [
    { art: ['pt_tortoise'], who: null,
      text: 'In a lake near Ujjain lived a tortoise named Kambugriva, and two geese who were his dearest friends. Kambugriva had exactly one fault. He could not stop talking. Not for a moment. Not for anything.' },
    { art: ['pt_heron', 'pt_tortoise'], who: 'pt_heron', mood: 'sad',
      text: 'One summer the rains failed. The lake shrank to mud. "We must fly to a bigger lake," said the geese. "But you cannot fly, and we cannot leave you."' },
    { art: ['pt_tortoise'], who: 'pt_tortoise', mood: 'wow',
      text: '"I have an idea!" cried Kambugriva. "Find a stick. You each hold an end in your beak. I will bite the middle. And we fly."' },
    { art: ['pt_heron', 'pt_tortoise'], who: 'pt_heron',
      text: '"It will work," said the geese slowly, "on one condition. Whatever you see, whatever anyone says — you must not open your mouth. Not once. You will fall."' },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      text: 'Up they went. Over the mud, over the fields, over the road — and the whole town came running out to look, pointing and shouting at the astonishing thing in the sky.' },
    { art: ['pt_tortoise'], who: null,
      text: '"Look at that!" they yelled. "The birds are so clever! Look what the clever birds have invented!" And Kambugriva, dangling from his stick, felt something hot rise in his chest.',
      ask: {
        q: 'They are giving the birds all the credit — and it was HIS idea. What should he do?',
        options: ['Shout that it was his idea', 'Stay quiet and land first', 'Wave a leg at them'],
        answer: 1,
        right: 'Right. And that is exactly what he could not manage to do.',
        wrong: 'That is what he should have done. It is not what he did.'
      } },
    { art: ['pt_tortoise'], who: 'pt_tortoise', mood: 'wow',
      text: '"IT WAS MY IDEA!" roared Kambugriva.' },
    { art: ['pt_tortoise'], who: null, mood: 'sad',
      text: 'It was a very good idea. It was, in fact, the last one he ever had.' }
  ],
  moral: 'There is a time to speak and a time to keep your mouth shut. Knowing the difference is most of wisdom.',
  source: 'Panchatantra, Book I. The tale travelled into Aesop, the Arabian Nights and beyond.'
},

{
  id: 'pt.blue-jackal',
  collection: 'panchatantra',
  badge: 'katha',
  title: 'The Jackal Who Turned Blue',
  hook: 'He fell in a vat of dye and came out a king. For a while.',
  hero: 'pt_jackal',
  cast: ['pt_jackal', 'pt_lion'],
  minutes: 3,
  place: ['IN-GJ'],
  words_hi: [['नीला', 'neela', 'blue'], ['राजा', 'raja', 'king'], ['सच', 'sach', 'truth']],
  scenes: [
    { art: ['pt_jackal'], who: null,
      text: 'A hungry jackal called Chandarava crept into a town at night looking for scraps. The dogs found him first. He ran — through a gate, through a yard, and straight into a dyer\'s enormous vat.' },
    { art: ['pt_jackal'], who: null, mood: 'wow',
      text: 'He climbed out at dawn, dripping, and every hair on him was a deep and glorious indigo blue. No animal in the forest had ever seen such a colour on a living creature.' },
    { art: ['pt_lion', 'pt_jackal'], who: 'pt_jackal',
      text: '"KNEEL," said Chandarava, who was quick. "I have been sent down from heaven to be your king. Behold my colour. Have you ever seen its like?" They had not. The lion knelt. The tiger knelt. Everyone knelt.' },
    { art: ['pt_jackal'], who: null,
      text: 'He ruled beautifully. He kept lions as ministers and tigers as guards. And he drove every jackal out of the forest, because jackals were common, and he was not — and because they might recognise him.' },
    { art: ['pt_jackal'], who: null,
      text: 'It went on for months. Then one evening, far off beyond the trees, a pack of jackals began to howl at the moon.',
      ask: {
        q: 'Every jackal in the world howls when it hears that sound. What will he do?',
        options: ['Stay silent — his life depends on it', 'Howl back', 'Order the guards to chase them off'],
        answer: 1,
        right: 'You knew. Some things are stronger than a plan.',
        wrong: 'He tried. But his throat had other ideas.'
      } },
    { art: ['pt_jackal'], who: null, mood: 'sad',
      text: 'His head went back before he could stop it. And out of the king of the forest came a long, unmistakable, perfectly ordinary jackal howl. The lions looked at each other. And Chandarava ran for his life, blue as ever.' }
  ],
  moral: 'You can change your colour. Changing what you are is a great deal harder — and pretending is exhausting.',
  source: 'Panchatantra, Book I.'
},

/* ======================================================= AKBAR & BIRBAL === */
{
  id: 'ab.shorter-line',
  collection: 'birbal',
  badge: 'katha',
  title: 'The Line Nobody Could Shorten',
  hook: 'Make this line shorter. Do not touch it.',
  hero: 'birbal',
  cast: ['akbar', 'birbal', 'courtier'],
  minutes: 3,
  place: ['IN-UP'],
  words_hi: [['रेखा', 'rekha', 'line'], ['छोटा', 'chhota', 'small'], ['बड़ा', 'bada', 'big']],
  scenes: [
    { art: ['akbar'], who: null,
      text: 'The Emperor Akbar liked to set his court impossible problems, mostly because he liked watching Birbal solve them. One morning he drew a long line across the floor with a piece of chalk.' },
    { art: ['akbar'], who: 'akbar',
      text: '"Make this line shorter," said Akbar. "But you may not rub out any part of it. You may not touch it at all."' },
    { art: ['courtier', 'akbar'], who: 'courtier', mood: 'think',
      text: 'The ministers walked around it. They crouched down and squinted at it. One suggested covering the end with a cloth, which the Emperor pointed out was still touching it. Nobody could do anything at all.' },
    { art: ['birbal'], who: null,
      text: 'Then Birbal walked up, took the chalk, and did one thing.',
      ask: {
        q: 'You may not touch the line. But you have chalk. What do you do?',
        options: ['Draw a much longer line beside it', 'Draw a box around it', 'Rub out just a tiny bit'],
        answer: 0,
        right: 'That is exactly it. He never touched the first line at all.',
        wrong: 'Birbal did something simpler — he drew a much LONGER line right beside it.'
      } },
    { art: ['birbal', 'akbar'], who: 'birbal',
      text: 'He drew a second line right beside the first — much, much longer. Then he stepped back and bowed. "Your line, Jahanpanah, is now the shorter of the two. I did not touch it."' },
    { art: ['akbar'], who: 'akbar', mood: 'wow',
      text: 'Akbar laughed until he had to sit down.' }
  ],
  moral: 'You do not always have to attack the problem. Sometimes you just change what it stands next to.',
  source: 'Akbar–Birbal folk tradition. Birbal (Mahesh Das, 1528–1586) was a real courtier of Akbar; the tales grew around him for centuries afterwards.'
},

{
  id: 'ab.khichdi',
  collection: 'birbal',
  badge: 'katha',
  title: "Birbal's Khichdi",
  hook: 'A poor man stood all night in a freezing river. Then the Emperor refused to pay him.',
  hero: 'birbal',
  cast: ['akbar', 'birbal'],
  minutes: 4,
  place: ['IN-UP'],
  words_hi: [['पानी', 'paani', 'water'], ['ठंडा', 'thanda', 'cold'], ['आग', 'aag', 'fire']],
  scenes: [
    { art: ['akbar'], who: 'akbar',
      text: 'It was the coldest week of the year. "A thousand gold coins," announced Akbar, "to anyone who can stand in the palace lake all night, up to his neck, with no fire and no blanket."' },
    { art: ['courtier'], who: null,
      text: 'A poor man came forward. He had a family to feed and nothing else to sell. He walked into the black water at sunset and stood there, all night, shaking, until the sun came up.' },
    { art: ['akbar'], who: 'akbar', mood: 'think',
      text: '"How did you survive?" asked Akbar. "There was a lamp burning in a window far away, Jahanpanah," the man said. "I looked at it all night." "Then you were warmed by the lamp!" said a minister. "He cheated. No payment."' },
    { art: ['akbar', 'birbal'], who: null,
      text: 'The Emperor, who was tired and not thinking clearly, agreed. The man was sent away with nothing. Birbal said not one word — and did not come to court the next day.',
      ask: {
        q: 'Birbal wants to show the Emperor he was wrong — without insulting him in front of the court. What would you do?',
        options: ['Argue with him at court', 'Write him a letter', 'Make him wait for something, and let him work it out'],
        answer: 2,
        right: 'Birbal never told the Emperor he was wrong. He arranged for him to notice it himself.',
        wrong: 'Birbal did something better than arguing. He invited the Emperor to lunch.'
      } },
    { art: ['birbal', 'akbar'], who: 'birbal',
      text: 'When the Emperor sent for him, Birbal replied that he was cooking khichdi for the royal lunch and could not possibly leave it. Akbar, curious and by now quite hungry, came to see for himself.' },
    { art: ['akbar', 'birbal'], who: null, mood: 'wow',
      text: 'In the courtyard Birbal sat beside a small fire. High above it, dangling from a pole a good four feet up, hung the pot of khichdi.' },
    { art: ['akbar'], who: 'akbar',
      text: '"Birbal. The pot is four feet above the flame. That khichdi will never cook." "Of course it will, Jahanpanah," said Birbal. "If a lamp in a window a mile away can warm a man standing in a lake all night — then this fire can certainly cook my lunch."' },
    { art: ['akbar', 'birbal'], who: null,
      text: 'Akbar went very quiet. Then he sent for the poor man and paid him double.' }
  ],
  moral: 'The best way to change someone\'s mind is to let them find the answer themselves.',
  source: 'Akbar–Birbal folk tradition.'
},

{
  id: 'ab.crows',
  collection: 'birbal',
  badge: 'katha',
  title: 'How Many Crows in the Kingdom?',
  hook: 'An impossible question, answered exactly.',
  hero: 'birbal',
  cast: ['akbar', 'birbal', 'pt_crow'],
  minutes: 3,
  place: ['IN-UP'],
  words_hi: [['कौआ', 'kauva', 'crow'], ['गिनना', 'ginna', 'to count'], ['कितने', 'kitne', 'how many']],
  scenes: [
    { art: ['akbar', 'pt_crow'], who: 'akbar', mood: 'think',
      text: 'Akbar was watching crows squabble on the palace wall when a thought struck him. "Birbal," he said. "How many crows are there in my kingdom?"' },
    { art: ['birbal'], who: null,
      text: 'It was the sort of question that has no answer. The court smiled, because for once they were sure Birbal was finished.',
      ask: {
        q: 'Nobody can count every crow in an empire. What is the one thing you can do?',
        options: ['Say it cannot be done', 'Give an exact number, confidently', 'Ask for ten years to count them'],
        answer: 1,
        right: 'Yes — and the trick is entirely in what he said next.',
        wrong: 'Birbal did the boldest thing. He gave an exact number.'
      } },
    { art: ['birbal', 'akbar'], who: 'birbal',
      text: '"Ninety-five thousand, four hundred and sixty-three, Jahanpanah."' },
    { art: ['akbar'], who: 'akbar', mood: 'wow',
      text: '"And if my men count them and find MORE than that?"' },
    { art: ['birbal'], who: 'birbal',
      text: '"Then the extra crows are visiting relatives from the neighbouring kingdom, Jahanpanah."' },
    { art: ['akbar', 'birbal'], who: 'akbar',
      text: '"And if they find fewer?" "Then some of ours have gone visiting their relatives." Akbar looked at him for a long moment, and then gave up and laughed.' }
  ],
  moral: 'Confidence is not the same as knowledge — but a question with no answer deserves an answer with no holes.',
  source: 'Akbar–Birbal folk tradition.'
},

/* ============================================================ MYTHOLOGY === */
{
  id: 'ka.ganesha-race',
  collection: 'mythology',
  badge: 'katha',
  title: 'The Race Around the World',
  hook: 'A mango, two brothers, and the cleverest lap ever run.',
  hero: 'ganesha',
  cast: ['ganesha', 'shiva'],
  minutes: 3,
  place: ['IN-MH'],
  words_hi: [['आम', 'aam', 'mango'], ['दौड़', 'daud', 'race'], ['दुनिया', 'duniya', 'world']],
  scenes: [
    { art: ['shiva'], who: null,
      text: 'A sage once brought a single golden mango to Kailash — a fruit of wisdom, meant for one person only. Shiva and Parvati had two sons: Ganesha, round and thoughtful, and Kartikeya, quick and fierce.' },
    { art: ['shiva', 'ganesha'], who: 'shiva',
      text: '"There is one mango and two of you," said Shiva. "So — a race. Whoever goes around the whole world and returns here first may have it."' },
    { art: ['ganesha'], who: null, mood: 'think',
      text: 'Kartikeya leapt onto his peacock and was gone over the mountains before the sentence was finished. Ganesha looked down at his own short legs, and at the very small mouse he rode. Then he sat down and thought.',
      ask: {
        q: 'Your brother rides a peacock. You ride a mouse. How do you win a race around the world?',
        options: ['Take a shortcut', 'Set off anyway and hope', 'Ask what "the whole world" really means'],
        answer: 2,
        right: 'That is the move. Ganesha did not run a better race — he asked a better question.',
        wrong: 'Ganesha did something cleverer. He asked himself what "the whole world" actually meant.'
      } },
    { art: ['ganesha', 'shiva'], who: null,
      text: 'Ganesha stood up, walked slowly to his mother and father, and walked all the way around them. Once. Twice. Three times. Then he bowed and held out his hand.' },
    { art: ['ganesha'], who: 'ganesha',
      text: '"My whole world is right here," he said. "I have been around it three times."' },
    { art: ['shiva', 'ganesha'], who: null, mood: 'wow',
      text: 'Shiva gave him the mango. Kartikeya arrived some considerable time later, out of breath, having actually been around the entire world — which is why, in many families, this is told with a great deal of sympathy for Kartikeya.' }
  ],
  moral: 'The clever answer and the loving answer are sometimes the same answer.',
  source: 'A widely-told Puranic tale. Versions differ by region — in some the prize is a fruit of immortality, in others wisdom.'
},

{
  id: 'ka.hanuman-leap',
  collection: 'mythology',
  badge: 'katha',
  title: "Hanuman's Leap",
  hook: 'A hundred miles of open sea, and someone who had forgotten he could fly.',
  hero: 'hanuman',
  cast: ['hanuman', 'rama'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['समुद्र', 'samudra', 'sea'], ['छलांग', 'chhalaang', 'leap'], ['याद', 'yaad', 'memory']],
  scenes: [
    { art: ['rama', 'hanuman'], who: null,
      text: 'Sita had been carried away across the water to Lanka. The army of vanaras stood on the last rock of the mainland and looked at a hundred miles of open sea, and every one of them knew they could not cross it.' },
    { art: ['hanuman'], who: null, mood: 'sad',
      text: 'Hanuman sat at the back, saying nothing. As a child he had leapt at the sun thinking it was a mango, and been struck down for it — and along with the fall he had lost the memory of what he could do.' },
    { art: ['hanuman'], who: null,
      text: 'The old bear Jambavan came and sat beside him.',
      ask: {
        q: 'Hanuman can cross the sea. He simply does not remember it. What does Jambavan need to do?',
        options: ['Order him to jump', 'Remind him who he is', 'Find another way across'],
        answer: 1,
        right: 'That is the whole story. Nobody gave Hanuman his strength — they gave him back the memory of it.',
        wrong: 'Jambavan did not command him. He reminded him.'
      } },
    { art: ['hanuman'], who: null,
      text: '"Do you not know what you are?" said Jambavan. "Son of the wind. You leapt at the sun before you could walk. You are the strongest creature on this shore, and you are sitting at the back."' },
    { art: ['hanuman'], who: null, mood: 'wow',
      text: 'And as he listened, Hanuman began to grow. He climbed the mountain at the water\'s edge, and the rock cracked under his feet. He looked at the horizon. And he jumped.' },
    { art: ['hanuman'], who: null,
      text: 'He went so high the trees on the mountain were torn up behind him and flew along in his wake, and the sea beneath him flattened into a bright road. Somewhere over the middle of it a mountain rose out of the water to offer him a rest. He touched it politely, thanked it, and kept going.' },
    { art: ['hanuman', 'rama'], who: 'mithu',
      text: 'This is why, when Indian children are frightened of something too big for them, someone will often say: remember Hanuman. He was never given anything he did not already have.' }
  ],
  moral: 'Most of the time you are not short of strength. You are short of the memory of your own strength.',
  source: 'Ramayana, Sundara Kanda — the fifth book, the one traditionally read for courage.'
},

{
  id: 'ka.buddha-mustard',
  collection: 'mythology',
  badge: 'katha',
  title: 'The Mustard Seed',
  hook: 'A mother asked for her son back. She was given a very strange errand.',
  hero: 'buddha',
  cast: ['buddha'],
  minutes: 3,
  place: ['IN-BR'],
  words_hi: [['बीज', 'beej', 'seed'], ['घर', 'ghar', 'house'], ['दुख', 'dukh', 'sorrow']],
  scenes: [
    { art: ['buddha'], who: null,
      text: 'A woman called Kisa Gotami lost her only child. She would not accept it. She carried him through the town asking every single person for medicine to bring him back, and everyone turned away — until one old man said: "Go to the Buddha."' },
    { art: ['buddha'], who: 'buddha',
      text: '"I can help you," said the Buddha. "Bring me a handful of mustard seed." She turned to run. "But it must come from a house," he said, "where nobody has ever died."' },
    { art: ['buddha'], who: null,
      text: 'She went to the first house. They gladly offered her mustard seed — every kitchen in India has mustard seed. "And has anyone died in this house?" she asked. The woman\'s face changed. "My husband. Last spring."',
      ask: {
        q: 'She has a whole town left to ask. What do you think she found?',
        options: ['One house with no death in it', 'No such house anywhere', 'The Buddha was tricking her'],
        answer: 1,
        right: 'There was no such house. There has never been such a house.',
        wrong: 'She found no such house. There has never been one.'
      } },
    { art: ['buddha'], who: null,
      text: 'House after house after house. Everyone had mustard seed. Nobody had a house that death had never entered. A grandmother. A brother. A baby. A friend. By evening she had walked the whole town and her hands were empty.' },
    { art: ['buddha'], who: null,
      text: 'She sat down at the edge of the road. And somewhere in that long day of other people\'s losses, without noticing it happening, she had stopped being alone.' },
    { art: ['buddha'], who: 'mithu',
      text: 'She went back to the Buddha with no mustard seed at all, and became one of his students.' }
  ],
  moral: 'Grief feels like the only one of its kind. It never is — and that is the beginning of comfort.',
  source: 'Therigatha and the Pali commentaries; one of the best-known teaching stories in the Buddhist tradition.'
},

{
  id: 'ka.mahavira-elephant',
  collection: 'mythology',
  badge: 'katha',
  title: 'Six Blind Men and an Elephant',
  hook: 'Six men, one elephant, and six answers that were all completely right.',
  hero: 'mahavira',
  cast: ['mahavira', 'pt_elephant'],
  minutes: 3,
  place: ['IN-BR'],
  words_hi: [['हाथी', 'haathi', 'elephant'], ['सच', 'sach', 'truth'], ['छूना', 'chhuna', 'to touch']],
  scenes: [
    { art: ['pt_elephant'], who: null,
      text: 'Six men who had been blind from birth were brought to an elephant and asked to say what it was like. Each of them reached out and touched a different part.' },
    { art: ['pt_elephant'], who: null,
      text: '"A thick snake," said the one holding the trunk. "A fan," said the one at the ear. "A tree trunk," said the one with his arms round a leg. "A wall." "A spear." "A rope," said the last one, who had found the tail.' },
    { art: ['pt_elephant'], who: null,
      text: 'They argued. Then they shouted. Each of them could feel that he was right, because each of them was.',
      ask: {
        q: 'Who is telling the truth?',
        options: ['The one holding the trunk', 'None of them', 'All of them — and none of them completely'],
        answer: 2,
        right: 'That is exactly the Jain answer, and it has a name.',
        wrong: 'The answer is stranger: all of them are right, and not one of them is right completely.'
      } },
    { art: ['mahavira'], who: 'mahavira',
      text: 'The Jain teachers call this *anekantavada* — many-sidedness. Truth has more sides than any one person can hold at once. What you touched is real. It is simply not all of it.' },
    { art: ['mahavira'], who: 'mithu',
      text: 'Which is why, in Jain tradition, sentences often begin with *syat* — "in some way". In some way it is a rope. Try starting an argument like that.' }
  ],
  moral: 'You can be completely right and still be missing most of the elephant.',
  source: 'A parable found across Jain, Buddhist and Hindu texts; anekantavada is a core Jain teaching.'
}
];

window.IND_COLLECTIONS = [
  { id: 'panchatantra', name: 'Panchatantra', note: 'The oldest story collection in the world, and still the funniest.', avatar: 'pt_jackal' },
  { id: 'birbal',       name: 'Akbar & Birbal', note: 'The cleverest man in the cleverest court.', avatar: 'birbal' },
  { id: 'mythology',    name: 'Great Stories', note: 'Ramayana, Puranas, the Buddha and Mahavira.', avatar: 'hanuman' }
];
