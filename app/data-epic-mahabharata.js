/* Bizzing India — THE MAHABHARATA, serialised.

   Shape (identical to data-epic-ramayana.js so one component renders both):

     window.IND_EPIC_MAHABHARATA = {
       id, title, subtitle, blurb, badge, avatar, source,
       books:    [ {id, name, meaning, note} ],
       episodes: [ {n, book, title, hook, minutes, cast[], cards[], ends_on,
                    words_hi[3], gate} ]
     }

   A card is { who, text }. `who` is an avatar id from window.IND_AVATAR_NAMES
   (avatars.js), or 'mithu' for the parrot, or null for the storyteller's own voice.

   CASTING NOTE (the same problem data-saga.js flags). The art set has no Bhishma,
   no Karna, no Draupadi, no Arjuna, no Kunti, no Gandhari. Rather than dress a
   Panchatantra animal or a stock courtier up as Bhishma, those figures are staged
   in the storyteller's voice with their dialogue quoted inside it — which is how
   data-stories.js already tells most of its scenes. `courtier` and `guard` appear
   only where the scene genuinely is a court or a doorway and the speaker genuinely
   is a courtier or a doorkeeper. `krishna`, `ganesha`, `shiva` and `hanuman` are
   used only where those figures are actually present. Several forest episodes
   therefore carry an empty cast, on purpose.

   EDITORIAL (docs/05, binding — this epic is harder than the Ramayana):

   · Badge is katha throughout. This is a told story and it says so.
   · NOBODY IS A CARTOON. Duryodhana has a real grievance and is told it is real.
     Karna is the most sympathetic person in the poem and fights on the wrong side.
     Yudhishthira gambles away his own family. Bhishma keeps a vow at everyone
     else's expense. Drona does something indefensible to a boy. Krishna advises
     things that are hard to defend and the file does not defend them. Flattening
     any of this into goodies and baddies would be a retelling of a different poem.
   · NO SCRIPTURE IS QUOTED. Not one Sanskrit line, not one verse, not one
     translator's sentence presented as the text. All dialogue here is the
     storyteller's own retold speech, in the idiom of data-stories.js. The Gita
     episode says outright that the actual seven hundred verses live on the verse
     shelf, in Sanskrit, read by a person — and that nobody should hand a child a
     made-up version of them.
   · NO CASTE VOCABULARY, anywhere, per the age table in docs/05 §3. Karna's birth
     and the tournament, and Ekalavya at the school, are told so that the child can
     see exactly what is happening to these two people without being handed a word
     to file it under. Drona is not excused and not editorialised at. Both are
     gated at 9.
   · The dice game and the hall are gated at 10. Nothing is described in detail;
     Draupadi's question is left standing, unanswered, because in the poem it is.
   · The war is loss, not spectacle. No gore. Gandhari counts.
   · Where the manuscript traditions disagree, the file says so rather than picking
     a side quietly. That happens five times and each is flagged in the cards.
   · No dates. No inscriptions. No archaeology. This is a story, told as a story.
*/

window.IND_EPIC_MAHABHARATA = {

  id: 'mahabharata',
  title: 'The Mahabharata',
  subtitle: 'The one about the family',
  blurb: 'A hundred cousins on one side, five on the other, one throne, and not a ' +
         'single person in it who is only good or only bad. It is the longest poem ' +
         'anybody has ever written, and it is a family argument.',
  badge: 'katha',
  avatar: 'krishna',

  /* Collection floor, matching data-epic-ramayana.js. Every episode here also
     carries its own `gate`, which is never lower than this one — the Mahabharata
     does not have a five-year-old episode in it. */
  age_gate: 7,

  source: 'Attributed to the poet Vyasa, who is also a character inside his own poem. ' +
          'Scholars work from the Critical Edition assembled over decades at the ' +
          'Bhandarkar Oriental Research Institute in Pune by comparing hundreds of ' +
          'manuscripts; it is shorter than the Mahabharata most families actually know, ' +
          'because many loved episodes appear in some manuscript traditions and not in ' +
          'others. Beside it stand the great regional Mahabharatas — Villiputturar in ' +
          'Tamil, Nannaya, Tikkana and Errana in Telugu, Sarala Das in Odia, Kashiram ' +
          'Das in Bengali, and many more — plus hundreds of folk, theatre and village ' +
          'versions in which the story goes differently: Draupadi is a goddess with her ' +
          'own temples and festivals in parts of Tamil Nadu, and Ekalavya, Karna and ' +
          'Duryodhana are each told with sympathy somewhere. This retelling is in the ' +
          'storyteller\'s own words throughout. No verse of any text is quoted.',

  books: [
    { id: 'adi', name: 'Adi Parva', meaning: 'The Book of the Beginning',
      note: 'How the family got into this. A river, a vow, a hundred and five cousins, and every promise that is going to break later.' },
    { id: 'sabha', name: 'Sabha Parva', meaning: 'The Book of the Assembly Hall',
      note: 'One building, one game of dice, and one question that nobody in the room can answer.' },
    { id: 'vana', name: 'Vana Parva', meaning: 'The Book of the Forest',
      note: 'Twelve years of exile, and the longest book in the poem — wandering, arguing, and stories inside the story.' },
    { id: 'virata', name: 'Virata Parva', meaning: 'The Book of Virata',
      note: 'The thirteenth year, spent in plain sight in somebody else\'s palace, pretending to be nobody at all.' },
    { id: 'udyoga', name: 'Udyoga Parva', meaning: 'The Book of the Effort',
      note: 'The last chance to stop it. Messengers ride both ways, and everybody says no.' },
    { id: 'bhishma', name: 'Bhishma Parva', meaning: 'The Book of Bhishma',
      note: 'The first ten days. The Bhagavad Gita sits inside this book, before a single arrow is shot.' },
    { id: 'drona', name: 'Drona Parva', meaning: 'The Book of Drona',
      note: 'Days eleven to fifteen, when both sides begin breaking the rules they wrote themselves.' },
    { id: 'karna', name: 'Karna Parva', meaning: 'The Book of Karna',
      note: 'Two days. The friend and the brother, neither of whom was ever told they were brothers.' },
    { id: 'shalya', name: 'Shalya Parva', meaning: 'The Book of Shalya',
      note: 'The eighteenth day, a lake, and the end of the fighting — though not the end of the dying.' },
    { id: 'stri', name: 'Stri Parva', meaning: 'The Book of the Women',
      note: 'The morning after. The mothers and the wives walk out onto the field, and the poem hands them the story.' },
    { id: 'mahaprasthanika', name: 'Mahaprasthanika Parva', meaning: 'The Book of the Great Journey',
      note: 'Years afterwards. Five brothers, one mountain, one dog, and the last test of all.' }
  ],

  episodes: [

/* ==================================================== ADI PARVA (1–11) ===== */

{
  n: 1, book: 'adi',
  title: 'The Poet Who Needed a Scribe',
  hook: 'A poem so long that no writer alive could keep up with it.',
  minutes: 4,
  cast: ['ganesha'],
  gate: 7,
  cards: [
    { who: null, text: 'There was a poet called Vyasa, and he had a poem in his head that would not fit inside anybody\'s mouth. It was about his own family. That is the first strange thing about the Mahabharata — the man telling it is standing inside it, and some of the people in it are his own grandchildren.' },
    { who: null, text: 'He needed somebody to write it down. Not a fast writer. An impossibly fast writer, because the poem was not coming to him line by line. It was coming the way rain comes.' },
    { who: 'ganesha', text: '"I will write it," said Ganesha. "On one condition. Your pen may not stop. If you pause to think, I put the pen down and we are finished."' },
    { who: null, text: 'Vyasa agreed, and added a condition of his own. "You may not write a single line until you have understood it." And then, whenever he needed a moment to catch his breath, he tied a knot in the poem so complicated that even Ganesha had to sit back and work it out.' },
    { who: null, text: 'That is how the story goes. It is loved everywhere and it is not in every manuscript — the oldest copies scholars have gathered up do not all agree that it happened. This is going to keep happening, and each time it does, we will say so.' },
    { who: null, text: 'Here is what the poem is about. There is a throne. There are two sets of cousins who both have a claim on it. There is one game of dice, one very bad afternoon in a hall, and eighteen days of war at the end of it.' },
    { who: null, text: 'And here is what you need to know before you start. There is no monster in this book. There is nobody in it you can simply decide to hate and be done with.' },
    { who: null, text: 'The kindest man in the whole poem fights on the wrong side, and knows it. The most truthful man in it tells exactly one lie, and it decides a war. The wisest man in it sits in a room and says nothing at the worst possible moment.' },
    { who: null, text: 'A hundred cousins on one side. Five on the other. And every single one of them is somebody\'s brother, somebody\'s son, somebody\'s teacher. That is the trouble with a family argument. There is nowhere to stand that is outside it.' },
    { who: 'mithu', text: '"People have been arguing about who was right for a very, very long time," said Mithu, "and nobody has finished. Which means you are allowed to join in."' }
  ],
  ends_on: 'Long before the cousins, before the throne, before any of it — a king walked down to a river and fell in love.',
  words_hi: [['कहानी', 'kahani', 'story'], ['कवि', 'kavi', 'poet'], ['लिखना', 'likhna', 'to write']]
},

{
  n: 2, book: 'adi',
  title: 'The River Who Married a King',
  hook: 'She said yes. She said he must never ask her why she did anything.',
  minutes: 5,
  cast: [],
  gate: 8,
  cards: [
    { who: null, text: 'King Shantanu of Hastinapura was walking by the Ganga one morning when he saw a woman standing in the shallow water, and he stopped walking, and that was more or less that.' },
    { who: null, text: '"Marry me," he said. She looked at him for a while. "I will," she said. "On one condition. You will never ask me why I do anything. Not once, not about anything. The day you ask, I leave."' },
    { who: null, text: 'He agreed, the way people agree to conditions when they are happy. They were married. A year later there was a son.' },
    { who: null, text: 'At dawn she carried the baby down to the river, and gave him to the water, and came back with her arms empty. The king had promised. He said nothing at all.' },
    { who: null, text: 'Seven times. Seven sons. Seven mornings at the water. He kept his promise every single time, and every single time it took something out of him that did not come back.' },
    { who: null, text: 'The eighth baby was born. She stood up with him and walked towards the door, and Shantanu was on his feet before he could stop himself. "Stop. Who are you? What are you doing to my children?"' },
    { who: null, text: '"I am Ganga," she said, without turning round. "And you have asked. So now I will tell you, and then I will go, because that was the bargain."' },
    { who: null, text: 'She told him that the seven were not babies at all but eight old bright beings who had done something foolish and been sentenced to be born as people. They had begged her to carry them and to let them go quickly, and she had said yes, because she loved them.' },
    { who: null, text: '"This one is the eighth. He has to stay. He has to live a whole long life, and it is going to be a hard one." She looked at the king for the last time. "I will keep him and I will have him taught, and one day I will bring him back to you."' },
    { who: null, text: 'She walked into the water with the baby and the king was left standing on the bank, a married man with no wife and eight sons and none of them in the house.' },
    { who: null, text: 'Years later a young man came up out of the river with her. "Your son," she said. "He has been taught by the best teachers alive, and there is nothing left for them to teach him." His name was Devavrata. Shantanu made him crown prince that week.' },
    { who: 'mithu', text: '"So that is where this family starts," said Mithu. "A promise kept far too long, and a question asked far too late. Remember that shape. This whole poem is built out of promises."' }
  ],
  ends_on: 'Shantanu falls in love a second time. This time the price is paid by his son.',
  words_hi: [['नदी', 'nadi', 'river'], ['राजा', 'raja', 'king'], ['वचन', 'vachan', 'a given word']]
},

{
  n: 3, book: 'adi',
  title: 'The Terrible Promise',
  hook: 'To make his father happy he gave up a throne. It was not enough.',
  minutes: 5,
  cast: [],
  gate: 8,
  cards: [
    { who: null, text: 'Years later, by a different stretch of water, Shantanu met a ferryman\'s daughter called Satyavati, and stopped walking again. He went to her father and asked for her.' },
    { who: null, text: '"Yes," said the ferryman, who was nobody\'s fool. "On one condition. Her son will be king after you. Not your son. Hers."' },
    { who: null, text: 'Shantanu had already made Devavrata crown prince in front of the whole court. He went home, said nothing to anybody, and stopped eating. Kings are not always good at explaining themselves.' },
    { who: null, text: 'Devavrata got it out of the charioteer in the end, and took a horse down to the ferry-landing himself, and stood in front of the fisherman with his hands open.' },
    { who: null, text: '"Give her to my father," he said. "I give up the throne. I will not be king. That is a prince talking, and I do not take it back."' },
    { who: null, text: 'The fisherman was not satisfied. "And your sons?" he said. "You will have sons. They will grow up hearing what their father gave away, and one day they will come and take it back."' },
    { who: null, text: 'There was a long pause at the water\'s edge. And then the young man said the sentence that this entire poem hangs from.' },
    { who: null, text: '"Then I will not marry. I will never have a child. There will be no sons of mine to want anything from anybody. Are we finished?"' },
    { who: null, text: 'From that day nobody called him Devavrata. They called him Bhishma — the one who took the terrible vow. His father, who could not undo it, gave him the only gift he had left: Bhishma would never die until he himself decided it was time.' },
    { who: null, text: 'He kept it. That is the thing to hold on to. He kept it for an entire long life, through four generations of a family that used him, and he never once bent it a finger\'s width.' },
    { who: null, text: 'And because he had also promised to protect the throne of Hastinapura whoever happened to be sitting on it, he would one day stand in a hall and say nothing while something unforgivable happened in front of him — and then take the field against boys he had taught to walk.' },
    { who: 'mithu', text: '"He never broke his word," said Mithu. "Not once, not for anyone. Grown-ups still argue about whether that makes him the best man in the poem or the saddest one."' }
  ],
  ends_on: 'Somewhere else entirely, a girl is given a gift she has not been told how to use.',
  words_hi: [['प्रतिज्ञा', 'pratigya', 'a vow'], ['सिंहासन', 'sinhasan', 'throne'], ['बेटा', 'beta', 'son']]
},

{
  n: 4, book: 'adi',
  title: 'The Boy in the Basket',
  hook: 'She was thirteen. She wanted to know if it worked. It worked.',
  minutes: 5,
  cast: [],
  gate: 9,
  cards: [
    { who: null, text: 'In a kingdom to the south, a girl called Pritha was given the job of looking after guests. One of the guests was a sage with a famously short temper, and she looked after him so well, for so long, that he went away pleased — which almost never happened.' },
    { who: null, text: 'He left her a gift on his way out: a few words she could say to call any of the shining ones down to her, and they would have to come. Then he left. Nobody explained to her what that actually meant. She was thirteen.' },
    { who: null, text: 'She said the words one morning at her window, looking at the sun, mostly to find out whether they worked. They worked. And by that evening Pritha was holding a baby, and she was thirteen years old, and she was not married, and she was completely alone with it.' },
    { who: null, text: 'The baby had two things nobody could explain. Golden armour that was part of his skin, and earrings to match, and both of them had been there when he arrived.' },
    { who: null, text: 'She put him in a basket, and lined it, and pushed it out into the river before it got light. Then she went back to the palace and got on with her life for the next forty years and told nobody, ever, at all.' },
    { who: null, text: 'The basket washed up a long way downstream, where a man who drove chariots for a living had come down to the water. He carried it home to his wife Radha, who had wanted a child for years and had stopped saying so out loud.' },
    { who: null, text: 'They called him Karna and they raised him in the chariot-drivers\' lane, and he grew up big, and quiet, and unbelievably good with a bow, in a place where nobody was supposed to be good with a bow.' },
    { who: null, text: 'And all his life, from the very beginning, people looked at what he could do and then asked him who his father was — and every time, the answer was going to be wrong. Not wrong as in untrue. Wrong as in the wrong sort of answer.' },
    { who: null, text: 'He never once said a word against Adhiratha and Radha. Not when it would have helped him. Not when it cost him everything. He was their son and he said so in rooms where it made people snigger.' },
    { who: 'mithu', text: '"Keep him in your head," said Mithu, quietly. "You are going to meet him again in about ten minutes, walking into a stadium, and the whole poem turns on what happens to him there."' }
  ],
  ends_on: 'Pritha grows up, and is married, and is given a new name: Kunti.',
  words_hi: [['सूरज', 'sooraj', 'sun'], ['टोकरी', 'tokri', 'basket'], ['कवच', 'kavach', 'armour']]
},

{
  n: 5, book: 'adi',
  title: 'A Hundred and Five Cousins',
  hook: 'One prince cannot see. One queen decides that she will not either.',
  minutes: 6,
  cast: ['courtier'],
  gate: 8,
  cards: [
    { who: null, text: 'Satyavati got her wish and her sons got the throne, and then both of them died young without children, and the family that Bhishma had given up everything to protect was suddenly one generation from ending.' },
    { who: null, text: 'She asked Bhishma to marry. "No," he said. That was the whole conversation, and she knew it would be. So she sent instead for her eldest son, born long before she ever met a king — the poet Vyasa. That is how the next two boys came into the family.' },
    { who: null, text: 'The elder was Dhritarashtra, who was born blind, and who was strong enough to break an iron bar in his hands. The younger was Pandu. And because a blind man was not made king in those days, the throne went to the younger brother, and the elder brother sat and watched it happen.' },
    { who: null, text: 'Dhritarashtra was married to a princess called Gandhari. On the day she understood that her husband would never see anything, she took a length of cloth and tied it over her own eyes, and she did not take it off again for the rest of her life.' },
    { who: null, text: 'People argue about that too. Was it the greatest act of love in the book, or was it a way of refusing to look at anything, ever, including her own children? The poem does not tell you. It just puts her there, in the room, not looking, for sixty years.' },
    { who: null, text: 'They had a hundred sons. The eldest was Duryodhana, and from the hour he was born there were people in that palace muttering that he should be sent away — which is not a thing a child ever entirely stops hearing.' },
    { who: null, text: 'Pandu, the king, married twice: Kunti, and a princess called Madri. And then he did something in a forest that he should not have done, and a dying sage told him he would not live to hold a child of his own. So he gave up the crown, and walked into the forest, and the two queens went with him.' },
    { who: null, text: 'Which is where Kunti finally had to tell somebody about the words the sage had given her when she was thirteen. Not all of it. Just the useful part.' },
    { who: null, text: 'So there were five boys born in the forest. Yudhishthira, who came out already worrying about whether things were fair. Bhima, who was enormous. Arjuna, who was quick. And the twins, Nakula and Sahadeva, who were Madri\'s.' },
    { who: 'courtier', text: '"They came to us out of the trees," an old courtier said, years later. "Five boys in bark clothes with a widow, and their father dead, and every one of them better at something than every boy already in the palace. What did anybody think was going to happen?"' },
    { who: null, text: 'A hundred cousins on one side of the courtyard. Five on the other. All of them living in the same house, eating the same food, taught by the same teachers, and every single one of them a prince.' },
    { who: 'mithu', text: '"A hundred and five children," said Mithu. "And not one grown-up in that palace with the nerve to sit them down and sort it out early, while it was still small."' }
  ],
  ends_on: 'It does not stay small.',
  words_hi: [['पट्टी', 'patti', 'a cloth band'], ['सौ', 'sau', 'a hundred'], ['पाँच', 'paanch', 'five']]
},

{
  n: 6, book: 'adi',
  title: 'The Cousins Who Could Not Be Friends',
  hook: 'Nobody in the palace ever told Duryodhana he was wrong. That was the problem.',
  minutes: 5,
  cast: [],
  gate: 8,
  cards: [
    { who: null, text: 'Bhima was the difficulty. Not because he was cruel — because he was fourteen and built like a door and did not know his own strength, and he thought a hundred cousins was the funniest thing that had ever happened to him.' },
    { who: null, text: 'He would climb a tree with all of them in it and shake the branch until they fell out like fruit. He would hold four of them underwater in the river and count. He always let go. They always came up. And every single time, a hundred boys walked home dripping and humiliated in front of the whole city.' },
    { who: null, text: 'Duryodhana went to his uncle Shakuni, his mother\'s brother, who had come to Hastinapura for the wedding and somehow never gone home. Shakuni listened to everything. Shakuni was extremely good at listening.' },
    { who: null, text: '"Say it out loud," said Shakuni. "All of it. Nobody will hear you but me."' },
    { who: null, text: '"My father is the elder brother," said Duryodhana. "My father was passed over because of his eyes, which he did not choose. I was born in this house. That throne came to me down the older line and everybody in this court knows it."' },
    { who: null, text: '"And those five walked in out of a forest in bark clothes with no father, and the whole city came out to look at them, and my grandfather cried. Tell me which part of that is fair. Go on. Tell me one part."' },
    { who: null, text: 'Here is the thing the poem does that most stories will not do for you. It does not tell him he is wrong. He is not entirely wrong. He has a real complaint, and he has had it since he was small, and not one grown-up in that palace ever sat down and dealt with it honestly.' },
    { who: null, text: 'What they did instead was tell him to stop making a fuss, and go on adoring the cousins, in front of him, for years.' },
    { who: null, text: 'And then one summer there was a picnic by the river. Bhima ate enough for six people, as usual, and went to sleep on the bank, as usual. And when he woke up he was in deep water in the dark, a long way down.' },
    { who: null, text: 'He came home three days later, covered in weed, twice as strong as he had gone out and in a filthy mood. Nobody was punished. Nobody was even asked. The palace decided, the way palaces do, that it was better not to have found out.' },
    { who: 'mithu', text: '"That is the whole war, right there, in a boy who was never once told no and a boy who was never once told sorry," said Mithu. "It just takes another forty years to arrive."' }
  ],
  ends_on: 'And then a stranger walks into the palace to teach them all how to fight.',
  words_hi: [['भाई', 'bhai', 'brother'], ['गुस्सा', 'gussa', 'anger'], ['ताकत', 'taakat', 'strength']]
},

{
  n: 7, book: 'adi',
  title: 'The Ring in the Well',
  hook: 'A hundred and five princes could not get a ball out of a hole in the ground.',
  minutes: 5,
  cast: [],
  gate: 7,
  cards: [
    { who: null, text: 'The princes were playing outside the walls when the ball went down a well. It was a deep, dry, old well, and they lay on their stomachs round the rim, a hundred and five of them, and achieved absolutely nothing for a very long time.' },
    { who: null, text: 'A thin man in poor clothes had been watching from the shade. "Princes," he said. "Sons of the greatest house in the world. Defeated by a hole."' },
    { who: null, text: 'He picked a blade of grass, said something over it, and dropped it. It went down and stuck in the ball. Then he dropped a second blade, which stuck in the first. Then a third. He built a chain of grass down that well and pulled the ball out with it while the princes watched with their mouths open.' },
    { who: null, text: 'Then he took a ring off his own finger, threw it down the well, and got that out too, just to make the point twice. "Go and tell Bhishma what you saw," he said, and sat back down in the shade.' },
    { who: null, text: 'Bhishma came at a run, because he already knew who it had to be. His name was Drona, and he was probably the finest teacher of weapons alive, and he was standing outside the palace in torn clothes because he had nothing.' },
    { who: null, text: 'Here is the piece of Drona you need. When he was young his closest friend was a boy called Drupada, who used to say they would share everything when he was king. Years later Drona, hungry, went to remind him. Drupada laughed at him in front of his whole court, and said that kings are not friends with poor men, and had him shown out.' },
    { who: null, text: 'Drona never got over it. Not for one day of his life. He was a magnificent teacher and a proud, sore, unforgiving man, and both of those were always true at the same time.' },
    { who: null, text: 'He took the school. And of all of them, the one who could do what he could do was Arjuna, who practised in the dark just to find out whether he could, and who followed him about like a dog.' },
    { who: null, text: 'One day Drona hung a wooden bird in a tree and called them up one at a time. "Aim at the eye," he said. "Now tell me what you see."' },
    { who: null, text: '"I see the tree, the branch, the bird, you, my brothers—" "Step back," said Drona. He said it eleven times. Then Arjuna came up and drew.' },
    { who: null, text: '"What do you see?" "The eye." "And the bird?" "No. The eye." "And the tree, and me, and your brothers?" "There is only the eye," said Arjuna, and Drona said, very quietly, "Shoot," and that was the end of the lesson.' },
    { who: 'mithu', text: '"Best teacher in the world," said Mithu. "Hold on to that. You are about to need it, and it is not going to help."' }
  ],
  ends_on: 'A boy from the forest has been standing at the edge of that school for some time, listening.',
  words_hi: [['गेंद', 'gend', 'ball'], ['घास', 'ghaas', 'grass'], ['चिड़िया', 'chidiya', 'bird']]
},
{
  n: 8, book: 'adi',
  title: 'Ekalavya',
  hook: 'He taught himself. Then his teacher came and found out.',
  minutes: 6,
  cast: [],
  gate: 9,
  cards: [
    { who: null, text: 'A boy came out of the forest to Drona\'s school. His father was the head of a forest people who lived beyond the fields, and his name was Ekalavya, and he had walked a long way.' },
    { who: null, text: 'He put his head on the ground in front of Drona. "Teach me the bow," he said. "I will do anything. I will sweep. I will carry. I have wanted this since I was small."' },
    { who: null, text: '"No," said Drona. He said it mildly, the way you decline a second helping. "This is the school of the princes of Hastinapura. You are a forest chief\'s son. Go home."' },
    { who: null, text: 'That is the sentence. Read it again if you like. It is not shouted and it is not explained and nobody in the courtyard objects to it, and the boy who has walked for days stands up and walks back out through the gate.' },
    { who: null, text: 'He did not go home in a rage. He went into the forest and he made a figure of Drona out of clay and river mud, roughly, the way you would, having seen a man once. He put it under a tree. He put flowers on it in the morning.' },
    { who: null, text: 'And then he taught himself, in front of it, for years. Alone. No teacher, no corrections, nobody to tell him he was improving. Just a clay man under a tree and a boy who would not stop.' },
    { who: null, text: 'Years later a royal hunting party came through that part of the forest, and one of the dogs ran ahead and started barking, on and on, at something in the trees.' },
    { who: null, text: 'The barking stopped. The dog came trotting back to the princes with its mouth held wide open and seven arrows in it, fitted so precisely between its teeth that it could not close its jaws — and not one drop of blood anywhere on the animal.' },
    { who: null, text: 'Arjuna went white. He had spent his whole life being told he was the finest archer in the world, and he had just been shown something he could not do. Drona took one look at the dog and went into the trees to find whoever had done it.' },
    { who: null, text: 'The boy was on his feet before they reached him, and down on the ground at Drona\'s feet before anybody could speak. "You came," he said. "Teacher."' },
    { who: null, text: '"Who taught you?" said Drona. Ekalavya pointed at the clay figure under the tree, with the flowers on it, and said, "You did."' },
    { who: null, text: 'And Drona looked at him and said, "Then I will have my teacher\'s fee. I will have the thumb of your right hand."' },
    { who: null, text: 'The boy did not argue and did not hesitate and did not ask why. He cut off his right thumb and put it in his teacher\'s hands, and then he bowed, and Arjuna was the finest archer in the world again by the time they rode home.' },
    { who: 'mithu', text: '"That is the story," said Mithu. "The poem does not say Drona was right and it does not say he was wrong. It just writes down what he did and moves on, and it has been sitting there ever since. It is one of the most argued-over pages in all of Indian literature — and you are allowed to argue with it too."' }
  ],
  ends_on: 'The school is finished. Drona announces a tournament, and the whole city buys a seat.',
  words_hi: [['अंगूठा', 'angootha', 'thumb'], ['मिट्टी', 'mitti', 'clay'], ['गुरु', 'guru', 'teacher']]
},

{
  n: 9, book: 'adi',
  title: 'The Young Man at the Gate',
  hook: 'He could do everything Arjuna could do. Then they asked him his father\'s name.',
  minutes: 6,
  cast: ['courtier', 'guard'],
  gate: 9,
  cards: [
    { who: null, text: 'They built an arena outside Hastinapura and the whole city came — Bhishma in the front row with Dhritarashtra beside him, Kunti and Gandhari up in the covered gallery, and not a spare inch of ground anywhere. Yudhishthira was elegant with a spear, and the twins rode. Then Bhima and Duryodhana came out with maces and went at each other so hard that the crowd split straight down the middle and started shouting for different cousins, and Drona had to send his own son in to pull them apart.' },
    { who: null, text: 'Then Arjuna came out and the arena stopped arguing. He put out fire with water arrows and made water with fire ones. He shot twenty-one arrows into a moving cow-horn. People stood on their seats.' },
    { who: null, text: 'And into all that noise, through the gate, walked a young man nobody knew, in golden armour that seemed to be part of him, with earrings to match.' },
    { who: 'guard', text: '"He did not stop at the gate," a guard said afterwards, still baffled. "They all stop at the gate. He walked straight past me like he had been coming here his whole life."' },
    { who: null, text: 'He went to the middle and did everything Arjuna had just done. Not roughly. Exactly. The arena went completely silent, which is a much bigger compliment than cheering.' },
    { who: null, text: '"Anything he can do, I can do," he said to Drona. "Give me him."' },
    { who: null, text: 'Duryodhana was on his feet with both arms in the air. Arjuna\'s face had gone still. And then one of the old teachers stepped forward and asked the polite, ordinary, procedural question that you have to ask before two men fight in front of a king.' },
    { who: 'courtier', text: '"Name your father," said Kripa, "and name your kingdom. A prince may only be matched with a prince. That is the rule and it is nobody\'s fault."' },
    { who: null, text: 'The young man opened his mouth and nothing came out. In the gallery, Kunti had gone the colour of the cloth she was holding, and had put her hand on the rail, and had said nothing at all.' },
    { who: null, text: 'And then Duryodhana walked down into the arena, in front of everybody, and said: "Then I will fix it. I do not care whose son he is. I have watched him shoot. The kingdom of Anga is mine to give and I am giving it to him. Now. Somebody fetch water and a crown."' },
    { who: null, text: 'They crowned him on the spot, in the dust, while the arena watched. And into the middle of it walked an old charioteer, shaking, who had heard the noise and come to find his boy — and Karna went straight over and put his head on the old man\'s feet in front of thirty thousand people.' },
    { who: null, text: 'Somebody laughed. Bhima said something about the chariot-drivers\' lane that he would still be paying for eighteen years later. And Karna, who had a kingdom now and had never had anything, turned and looked at Duryodhana with an expression he kept for the rest of his life.' },
    { who: null, text: 'Then the sun went down, and by the rules the fight could not be held, and everybody went home. It was the kindest thing anybody does in this entire poem. It was also the thing that bought the war.' },
    { who: 'mithu', text: '"Duryodhana meant it," said Mithu. "That is what makes it hard. He was not being clever. He saw somebody being turned away at a door and he opened it, and after that Karna would have walked into fire for him — and eventually he did."' }
  ],
  ends_on: 'The city has now seen who the best of them are. That turns out to be dangerous.',
  words_hi: [['निशाना', 'nishana', 'aim'], ['धनुष', 'dhanush', 'bow'], ['नाम', 'naam', 'name']]
},

{
  n: 10, book: 'adi',
  title: 'The House Made of Lac',
  hook: 'A beautiful new palace, built in one summer, that smelled faintly of oil.',
  minutes: 5,
  cast: ['courtier'],
  gate: 9,
  cards: [
    { who: null, text: 'After the tournament the city made its feelings clear, loudly, in the streets: make Yudhishthira the crown prince. He was the eldest of that generation. He was fair. People liked him.' },
    { who: null, text: 'Dhritarashtra did it, because he had to. And then he went and sat with his son, who did not say a single word for two days, and eventually Duryodhana said, "You gave away my throne in a corridor because a crowd shouted at you," and his father did not have an answer.' },
    { who: null, text: 'So a plan was made. There was a festival in a town called Varanavata. Someone suggested the five brothers might enjoy it. Dhritarashtra, who did not ask a single question about whose idea it was, said what a lovely thought.' },
    { who: null, text: 'A man called Purochana went ahead to build them a guest house. It went up fast, and it was beautiful, and it was made of resin and lacquer and dry reed and rope soaked in oil, painted over so you could not tell.' },
    { who: null, text: 'On the morning they left, their uncle Vidura walked beside the chariot for a while and said something odd, in an old forest way of talking, about how a creature that digs itself a second door out of its burrow lives through the fire.' },
    { who: 'courtier', text: '"Yudhishthira thanked him for the advice about the weather," a courtier remembered, "loudly, so the escort could hear. And then he got in the chariot and did not sleep properly for a year."' },
    { who: null, text: 'They arrived. Bhima put his hand on a wall and smelled his fingers and said, "This house is going to burn." Yudhishthira said, "I know. We will live in it anyway, or they will simply build us another one."' },
    { who: null, text: 'A quiet man came in a few nights later and started digging, and they went on smiling at Purochana and admiring the paintwork for a whole year while a tunnel went down under the floor and out under the wall.' },
    { who: null, text: 'On the night they chose, the house went up. It went up so fast that the town could not get near it, and by morning there was nothing left of it at all, and the whole kingdom was told that the five sons of Pandu and their mother had died in an accident.' },
    { who: null, text: 'The poem is honest about this: other people died in that fire, and it does not pretend the brothers came out of it clean. It is the first thing in the book that nobody involved ever explains properly.' },
    { who: null, text: 'They came up out of the tunnel in the dark, into a forest, six people with nothing. And they walked, and they kept walking, and Bhima carried his mother when she could not go on.' },
    { who: 'mithu', text: '"Everyone in India thought they were dead," said Mithu. "So did their cousins. So, for the next while, the five most famous princes alive get to be nobody. It suits some of them better than others."' }
  ],
  ends_on: 'A king in another country announces a contest for his daughter, and one of the prizes is a bow nobody can bend.',
  words_hi: [['आग', 'aag', 'fire'], ['घर', 'ghar', 'house'], ['सुरंग', 'surang', 'tunnel']]
},

{
  n: 11, book: 'adi',
  title: 'The Fish in the Water',
  hook: 'Do not look up at the target. Look down at its reflection, and shoot.',
  minutes: 6,
  cast: ['courtier'],
  gate: 8,
  cards: [
    { who: null, text: 'King Drupada — yes, that Drupada, Drona\'s old friend — had a daughter called Draupadi, and he set a contest for her that was designed so that exactly one man in the world could win it.' },
    { who: null, text: 'A wooden fish turned on a pole high up under the roof. On the floor beneath it stood a shallow bowl of water. You had to bend a bow that most men could not lift, look only at the reflection in the water, and put an arrow through the fish\'s eye.' },
    { who: null, text: 'Kings came from everywhere. Most of them could not string the bow. Some could not lift it. The hall watched a great many extremely important men go pink and sit down again.' },
    { who: null, text: 'Then Karna stood up and walked out, and the hall went quiet, because everyone there had heard what he had done at that tournament, and everyone there could see that he was going to do it.' },
    { who: null, text: 'And something was said in that hall that stopped him. Here the manuscripts genuinely disagree with each other. In many tellings Draupadi herself refuses him out loud. In others it is somebody else, and in the oldest copies scholars have compared, it is not the same page at all.' },
    { who: null, text: 'What every version agrees on is this: Karna put the bow down, and turned round, and walked back to his seat, and sat, in front of every king in the world. Again.' },
    { who: null, text: 'Then a thin young man in the cheap seats stood up. Everybody assumed he was a poor student, because he looked like one, and there was some laughing. He strung it, glanced once into the bowl of water, and shot without looking up.' },
    { who: null, text: 'Chaos. Half the kings in the hall decided a contest they had lost had been unfair, which is a very old habit, and there was a fight in the courtyard, and a very large young man pulled a tree out of the ground to make his point, and after that the discussion ended.' },
    { who: null, text: 'They walked home to the potter\'s house they were staying in, with Draupadi walking behind, and Arjuna called out from the doorway the way boys do — "Ma, look what we got today!"' },
    { who: null, text: 'And Kunti, who was inside, and who was busy, and who had five sons who came home with fruit and firewood and fish, said without turning round, "Well, whatever it is, share it between you." And then she turned round.' },
    { who: null, text: 'So Draupadi married all five brothers. It is unusual and the poem knows perfectly well that it is unusual — it actually stops the whole story and has an argument about it for a while, with several people objecting, before it lets itself go on.' },
    { who: null, text: 'And Drupada, who had wanted one son-in-law and had somehow acquired five, got the thing he had actually wanted all along, which was the five best fighters in the world on his side of any future argument with Drona.' },
    { who: 'mithu', text: '"And in Hastinapura," said Mithu, "somebody came running into the hall to say that the cousins everyone had buried a year ago had just turned up at a wedding. You can imagine the faces."' }
  ],
  ends_on: 'The dead princes are alive, and the kingdom now has to be cut in half.',
  words_hi: [['मछली', 'machhli', 'fish'], ['परछाई', 'parchhai', 'reflection'], ['तीर', 'teer', 'arrow']]
},

/* ================================================== SABHA PARVA (12–15) ==== */

{
  n: 12, book: 'sabha',
  title: 'The Hall With Floors Like Water',
  hook: 'They were given the half of the kingdom that nobody wanted. Then they made it beautiful.',
  minutes: 5,
  cast: ['courtier'],
  gate: 8,
  cards: [
    { who: null, text: 'Dhritarashtra split the kingdom. The brothers got the half that was scrub and rock and old forest, with no city on it and nothing growing, and the family kept Hastinapura. Yudhishthira said thank you and went, and Bhima did not speak for a week.' },
    { who: null, text: 'And then they built a city on it. It took years. They called it Indraprastha, and by the end of it people were coming a long way just to walk down the streets and look.' },
    { who: null, text: 'The best builder in the world made them a hall for it, and he had a sense of humour. The floors in one part were polished stone so smooth and so dark that they looked like standing water. In another part there was standing water so still that it looked like polished floor.' },
    { who: null, text: 'Yudhishthira held a great ceremony to be recognised as the senior king, and invited everyone, and the whole family came from Hastinapura, and it was — for about four days — the happiest this family ever is.' },
    { who: null, text: 'Bhima ran the kitchens. Krishna, who was a cousin on their mother\'s side and Arjuna\'s closest friend, asked for the job of washing the guests\' feet at the door, and took it, and did it, which people talked about for years.' },
    { who: null, text: 'And Duryodhana walked through the hall, looking at all of it, at what his cousins had made out of the worst land in the kingdom — and stepped confidently onto a floor that turned out to be water, and went in up to his chest.' },
    { who: null, text: 'Somebody laughed. In a great many tellings it is Draupadi, up on the balcony, and in some of them she says something about blind fathers and blind sons. The oldest manuscripts are not so sure it was her at all.' },
    { who: 'courtier', text: '"It does not matter who," said one of the courtiers who was there. "It was a room full of servants and kings, and he came up out of that water in front of all of them with his crown floating away, and he heard it."' },
    { who: null, text: 'He did not shout. He did not throw anybody out. He climbed out, changed his clothes, came back and sat down and was perfectly polite for the rest of the visit, which was much worse.' },
    { who: null, text: 'On the road home he said to Shakuni: "I have sat in that hall. I am not going to be able to eat until it is mine, and I cannot take it from them in a fight, because Bhima will pull my arms off."' },
    { who: 'mithu', text: '"And Shakuni," said Mithu, "who had been waiting for exactly this sentence for about thirty years, said: then do not fight him. Invite him to play a game. He cannot say no to a game. It is the one thing in the world that man cannot do."' }
  ],
  ends_on: 'An invitation goes out to Indraprastha. It is beautifully worded, and it is for a game of dice.',
  words_hi: [['शहर', 'shahar', 'city'], ['महल', 'mahal', 'palace'], ['हँसी', 'hansi', 'laughter']]
},

{
  n: 13, book: 'sabha',
  title: 'The Game',
  hook: 'He could stop at any time. That is what makes it unbearable to read.',
  minutes: 6,
  cast: ['courtier'],
  gate: 10,
  cards: [
    { who: null, text: 'The invitation came from Dhritarashtra, an uncle to a nephew, and it was for a friendly game in the new hall at Hastinapura. Vidura carried it, and hated carrying it, and said so on the way in and was told to be quiet.' },
    { who: null, text: 'By the custom of the time a king who was invited to play did not refuse. Yudhishthira knew what it was. He went anyway. He said afterwards that he could not have refused and stayed a king, and people have been picking that answer apart ever since.' },
    { who: null, text: 'Shakuni threw for Duryodhana. He was the best dice player anybody had ever seen, and there are tellings in which the dice themselves were his and did what he told them. Yudhishthira threw for himself, and he was not.' },
    { who: null, text: 'Pearls first. Then gold. Then the chariots, the horses, the elephants, the cattle. Each time Shakuni said, quite gently, "I have won," and each time Yudhishthira said, "Again."' },
    { who: null, text: 'Vidura stood up in the middle of it and said, out loud, in front of the whole court, that this was not a game, that it was a robbery with a board in front of it, and that Dhritarashtra should end it now. Dhritarashtra told him to sit down.' },
    { who: null, text: 'Then the villages. Then the city. Then the whole kingdom that had been built out of scrub with their own hands, in one throw, gone.' },
    { who: null, text: 'And here is where the poem stops being about dice. He staked his youngest brother. And lost him. And then Sahadeva. And then Nakula, and then Arjuna, and then Bhima, and each time the hall got quieter and each time he picked the dice up again.' },
    { who: null, text: 'Four brothers, standing there, watching themselves being lost by somebody they would have died for, saying nothing, because he was the eldest and that was the rule they lived by.' },
    { who: null, text: '"You have nothing left," said Shakuni pleasantly. "Except yourself." And Yudhishthira staked himself, and lost.' },
    { who: null, text: 'And then Shakuni said, in exactly the same pleasant voice: "You still have your wife."' },
    { who: null, text: 'The hall made a noise. Old men were on their feet. And Yudhishthira — who is the best man in this poem, who cannot tell a lie, who has spent his whole life worrying about what is fair — put Draupadi on the board and threw the dice and lost her.' },
    { who: null, text: 'Both of those things are true and the poem will not let you drop either one. He was the best of them. He could not put the dice down. If you have ever watched a grown-up you love do something they cannot stop doing, you already understand this page better than most people.' },
    { who: 'mithu', text: '"Nobody in that room is enjoying this now," said Mithu. "Not even Duryodhana. But he has won, and he is not going to stop, and he sends a man to go and fetch her."' }
  ],
  ends_on: 'She does not come. She sends the messenger back with a question instead.',
  words_hi: [['पासा', 'pasa', 'dice'], ['खेल', 'khel', 'game'], ['हार', 'haar', 'a loss']]
},

{
  n: 14, book: 'sabha',
  title: 'Draupadi\'s Question',
  hook: 'One question, asked in a room full of the greatest men alive. None of them could answer it.',
  minutes: 6,
  cast: ['courtier', 'guard'],
  gate: 10,
  cards: [
    { who: null, text: 'The messenger went to the women\'s rooms and told her, and she did not scream and did not weep. She asked him a question and sent him back with it, and the question is the sharpest thing in the whole poem.' },
    { who: null, text: '"Go and ask my husband this. When he staked me — had he already lost himself? Because if he had, then he was not his own man. And a man who does not own himself cannot stake anybody else. So ask the hall: whose was I, at that moment?"' },
    { who: null, text: 'The messenger carried it back and said it out loud, and the hall had no answer. Yudhishthira sat and looked at the floor and did not speak. He never answers it. Not that day, not in the forest, not in thirteen years.' },
    { who: null, text: 'So Duryodhana sent his brother Duhshasana to bring her by force, and he did, and she was dragged into the hall in front of her husbands and her elders and everybody in the kingdom who mattered.' },
    { who: null, text: 'What happened next in that hall is the reason people still say the name of this family with their jaw set. We are not going to describe it. In many tellings something stops it; the manuscripts do not all tell it the same way. What every version agrees on is what the room did, which is nothing.' },
    { who: null, text: 'She asked her question again, standing up, to the whole hall. And she asked it of the one man there whose whole life was made of keeping his word.' },
    { who: null, text: '"The law about who owns what is subtle," said Bhishma slowly, "and I cannot see the bottom of it. I do not know the answer to your question." An old man who had never once been unsure of anything, saying that, in that room.' },
    { who: null, text: 'Vidura said plainly that she had not been lost and was being wronged, and was ignored. And then one of the hundred stood up — Vikarna, Duryodhana\'s own brother — and said his brother was in the wrong and the woman had not been lawfully staked. The hundred are not one lump. Remember him.' },
    { who: 'courtier', text: 'And it was Karna who shouted him down. Karna, who had been turned away at a gate himself, said the cruellest thing said in that hall all day, and he said it to her. The most sympathetic person in this poem is on the wrong side of this room, doing the worst thing he ever does.' },
    { who: null, text: 'Bhima made an oath about Duhshasana\'s hands so violent that the court flinched. Draupadi untied her hair and said it would stay untied until she had a reason to bind it up again, and everybody there understood exactly what she meant.' },
    { who: null, text: 'And then jackals started calling in the courtyard in broad daylight, and the old blind king, who had let all of it happen because it was his son doing it, got frightened.' },
    { who: null, text: '"Ask me for anything," said Dhritarashtra. She asked for her husbands\' freedom. "Ask again." She asked for their weapons and their chariots back. "Ask a third time." And she said no.' },
    { who: null, text: '"I have asked twice, and a person may ask twice," she said. "Whatever else we need, my husbands can fetch for themselves." She got it. She walked out of that hall with everything she had come to get, and the question still lying on the floor.' },
    { who: 'mithu', text: '"Nobody answered her," said Mithu, quietly. "Not that day. Not since. It is still sitting there in the middle of the poem, and every single thing that happens afterwards happens because of it."' }
  ],
  ends_on: 'They are free. They are packed. They are already at the gate — and Duryodhana asks his father for one more throw.',
  words_hi: [['सवाल', 'sawal', 'question'], ['जवाब', 'jawab', 'answer'], ['सभा', 'sabha', 'assembly hall']]
},
{
  n: 15, book: 'sabha',
  title: 'One More Throw',
  hook: 'The blind king gave it all back. Then he let his son ask for one more game.',
  minutes: 4,
  cast: ['courtier'],
  gate: 9,
  cards: [
    { who: null, text: 'They were on the road. The chariots were loaded. The kingdom had been handed back, the brothers were free, and for about an hour it looked as if the whole disaster was going to end in an apology and a long silence at family dinners.' },
    { who: null, text: 'Then Duryodhana went to his father, with Shakuni behind him, and said what people say when they are winning and have been made to stop: "You gave it all back. In one afternoon you gave away everything I won. Do you know what they will do with it?"' },
    { who: null, text: 'Gandhari came and stood in that room, with the cloth over her eyes, and said the only completely sensible sentence anybody says in the entire Sabha Parva.' },
    { who: null, text: '"Send him away," she said. "Today. He is my son and I have carried him and I am telling you he is going to burn this house down with all of us inside it. You can still do it this morning. You will not be able to do it next year."' },
    { who: null, text: '"I cannot," said Dhritarashtra. "He is my son."' },
    { who: null, text: 'That is the whole tragedy in six words, and every parent who reads it feels the floor go. He was not a wicked man. He was a man who could never once say no to his child, and the price of that was counted out at the end in bodies.' },
    { who: null, text: 'So a messenger caught the brothers on the road and brought them back for one game. One throw. And the stake was not a kingdom this time, it was a rule.' },
    { who: null, text: 'The loser would go into the forest for twelve years. And then a thirteenth year, living somewhere in the world in disguise — and if anybody recognised them in that thirteenth year, the whole thing started again from the beginning.' },
    { who: null, text: 'Yudhishthira sat down and picked the dice up. Again. Knowing exactly who he was playing, exactly how it had gone the day before, and exactly what it had already cost his wife.' },
    { who: null, text: 'He lost.' },
    { who: null, text: 'They changed into bark and deerskin in the courtyard and walked out through the city they had grown up in, and the people of Hastinapura came out and lined the road and cried, and nobody in the palace came to the gate.' },
    { who: 'mithu', text: '"Thirteen years," said Mithu. "Draupadi walked out with her hair loose, exactly as she had promised. And Vidura resigned from his own family and went with them for a while, because he could not stand to stay."' }
  ],
  ends_on: 'Twelve years of forest. And a wife who is not going to let her husband forget one single day of it.',
  words_hi: [['तेरह', 'terah', 'thirteen'], ['जंगल', 'jangal', 'forest'], ['साल', 'saal', 'year']]
},

/* ================================================== VANA PARVA (16–19) ===== */

{
  n: 16, book: 'vana',
  title: 'The Longest Argument in the Forest',
  hook: '"I am not asking you to be a good man. I am asking you to be angry for one hour."',
  minutes: 5,
  cast: ['hanuman'],
  gate: 9,
  cards: [
    { who: null, text: 'The Vana Parva is the longest book in the whole poem, and almost nothing happens in it. Twelve years of walking, and camping, and listening to other people\'s stories, and having the same argument over and over again around a fire.' },
    { who: null, text: 'The argument is this. Draupadi and Bhima want to go back and take the kingdom now. Yudhishthira gave his word for thirteen years and will not move. And Arjuna, mostly, sits between them and says nothing, which does not help.' },
    { who: null, text: '"You are not even angry," Draupadi said to him one night. "That is the part I cannot forgive. I was dragged into a hall. You sat and looked at the floor. And now we are in a wood eating roots and you are calm."' },
    { who: null, text: '"I am not asking you to be a good man," she said. "You are a good man, everybody knows, it is the only thing anyone ever says about you. I am asking you to be angry for one hour. Just one."' },
    { who: null, text: '"If I am good only when it pays," said Yudhishthira, "then I was never good, I was only lucky. I gave my word for thirteen years. I am not going to spend thirteen years explaining to people why my word does not count."' },
    { who: null, text: '"Thirteen years," said Bhima, poking the fire. "I could do the whole thing in an afternoon. Give me the afternoon."' },
    { who: null, text: 'Nobody wins that argument. It goes on for twelve years, and it is the most honest picture of a family under pressure anybody has ever written, and every part of it is somebody being right.' },
    { who: null, text: 'One thing did happen. Draupadi wanted a particular flower she had seen come down a stream, and Bhima went off up the mountain to find where it grew, shouting and knocking trees over the way he did.' },
    { who: null, text: 'An old monkey was lying across the path with its tail stretched right over it, and would not move. "Step over me," it said. "I am old." "I will not step over you, that is rude. Move it." "Move it yourself, boy. I am tired."' },
    { who: 'hanuman', text: 'Bhima bent down to flick the tail aside with one hand, and could not shift it. Then both hands. Then everything he had. And the old monkey watched him with great interest and said, "Yes. It is like that sometimes."' },
    { who: null, text: 'Bhima stopped and looked at him properly and went down on the path. "You are Hanuman." "And you are my brother," said Hanuman. "Sons of the wind, both of us. Go and get the flower. And when your day comes, look up at your brother\'s chariot. I will be on the flag."' },
    { who: 'mithu', text: '"Twelve years," said Mithu. "And out of all of it, that is the bit the grandmothers always tell. A very large man losing a fight with a tail."' }
  ],
  ends_on: 'Arjuna goes north on his own, to ask a mountain for a weapon.',
  words_hi: [['हवा', 'hawa', 'wind'], ['पूँछ', 'poonchh', 'tail'], ['धीरज', 'dheeraj', 'patience']]
},

{
  n: 17, book: 'vana',
  title: 'The Hunter on the Mountain',
  hook: 'Two arrows hit the same boar at the same moment. Both archers claimed it.',
  minutes: 5,
  cast: ['shiva'],
  gate: 8,
  cards: [
    { who: null, text: 'Arjuna went north by himself, up past the snow line, to ask for weapons they were going to need. He stood on one leg for a long time and ate almost nothing and did not speak, and the mountain took its time about noticing.' },
    { who: null, text: 'Then a wild boar came crashing through the scrub straight at him, and he had a bow in his hands before he had finished thinking about it, and he shot.' },
    { who: null, text: 'So did somebody else. Two arrows, one boar, the same instant. And out of the trees came a huge hunter with a bow, in skins, with a woman walking behind him, entirely at home up there where nobody lives.' },
    { who: null, text: '"My kill," said the hunter cheerfully. "I saw it first." "You did not," said Arjuna, who had been standing on one leg for weeks and was not in a reasonable frame of mind. "It came at me. It is mine."' },
    { who: null, text: 'They argued about a pig on a mountainside like two boys at a village fair. Then they shot at each other, and then they wrestled, and Arjuna — the finest archer alive, the one who only ever sees the eye — lost.' },
    { who: null, text: 'He lost his arrows, which came back empty. He lost his bow. He lost the fight with his hands. He ended up flat on the stones with nothing left, which had never once happened to him in his life.' },
    { who: null, text: 'So he did the only thing he had left. He scraped a little heap of earth together into a rough shape, the way you would make a figure at home, and he picked the flowers that grow up there and put them on its head, and bowed.' },
    { who: null, text: 'And when he looked up, the flowers were sitting on the hunter\'s head.' },
    { who: null, text: 'He got up very slowly. "You," he said. And Shiva laughed at him, standing there in his skins with the flowers on, and said, "You fought me for an hour and you were not bad."' },
    { who: 'shiva', text: '"Nobody comes up here to be told they are wonderful," said Shiva. "You came up to be beaten. Now you have been, so you can be given something." And he gave him the weapon that Arjuna would carry all the way to the last day and, in the end, would not use.' },
    { who: null, text: 'Arjuna stayed away five years in all. He learned things, and he was taught to dance and to sing by the musicians of the sky, which sounds like a joke and turns out — exactly one book later — to be the thing that saves all five of them.' },
    { who: 'mithu', text: '"Nothing in this poem is wasted," said Mithu. "Not even the dancing lessons. Especially not the dancing lessons."' }
  ],
  ends_on: 'Down on the plain, a man in golden armour is about to be asked for it.',
  words_hi: [['पहाड़', 'pahaad', 'mountain'], ['शिकारी', 'shikari', 'hunter'], ['फूल', 'phool', 'flower']]
},

{
  n: 18, book: 'vana',
  title: 'What Karna Would Not Refuse',
  hook: 'Everybody knew his one rule. That is exactly why it could be used against him.',
  minutes: 5,
  cast: [],
  gate: 9,
  cards: [
    { who: null, text: 'Karna had a rule, and the whole country knew it. After his morning prayers at the water, he did not refuse anybody anything. Whatever you asked for, if you asked him then, you got it.' },
    { who: null, text: 'It was not a boast. It was the one thing he had made entirely by himself, without a father\'s name or a kingdom given to him by somebody else. It was his, and it was the only thing that was.' },
    { who: null, text: 'And he had that armour. Not worn — grown. It was part of his skin, it had been there since the basket, and nothing anybody could throw would go through it. Which was a serious problem for anybody who might one day have to fight him.' },
    { who: null, text: 'So the sun woke him in a dream. "Listen to me. Tomorrow morning a poor man is going to come to you at the water and ask for your armour. He is not a poor man. He is Indra, and he has a son who is going to have to face you one day, and he is frightened."' },
    { who: null, text: '"Say no. Once. Just this one morning, for me. It will cost you nothing and it will save your life."' },
    { who: null, text: '"No," said Karna.' },
    { who: null, text: '"I have exactly one thing in this world that is mine," he said. "Not my name. Not my kingdom, which was a gift. Just this — that nobody who asks me in the morning walks away with empty hands. If I keep the armour and lose that, what is left standing at the water? Let him have the skin. Leave me the rule."' },
    { who: null, text: 'The sun, who could not talk him out of it, did what the parents of extremely stubborn children do, and negotiated. "Then at least ask him for something back. He will owe you. Ask for the spear."' },
    { who: null, text: 'In the morning a poor man came to the water and asked, and Karna cut the armour away from his own body, which hurt in a way the poem does not dwell on, and handed it over dripping and smiling and said, "Take it. And now I will ask you for something."' },
    { who: null, text: 'He got a spear that would kill any one person in the world, once, and then be finished. One throw, one life, and then nothing. He carried it for years and thought about it every single day.' },
    { who: 'mithu', text: '"Remember the spear," said Mithu. "One throw. He is going to have to choose, and the choosing is going to cost him everything, and he still will not break his rule. Not once, all the way to the end."' }
  ],
  ends_on: 'Back in the forest, five brothers are extremely thirsty, and there is a lake.',
  words_hi: [['दान', 'daan', 'giving'], ['सुबह', 'subah', 'morning'], ['ढाल', 'dhaal', 'shield']]
},

{
  n: 19, book: 'vana',
  title: 'The Voice in the Lake',
  hook: 'Four brothers went to fetch water. Four brothers did not come back.',
  minutes: 5,
  cast: [],
  gate: 8,
  cards: [
    { who: null, text: 'Late in the twelve years they were deep in dry country, chasing a deer that had run off with a holy man\'s fire sticks, and they lost it, and then they lost the water, and then they were in real trouble.' },
    { who: null, text: 'Nakula climbed a tree and saw green, and went off to bring water back, and did not come back. Sahadeva went to look for him and did not come back. Arjuna went. Bhima went. Nobody came back.' },
    { who: null, text: 'So Yudhishthira went, and found a beautiful clear lake, and his four brothers lying on the bank around it, not moving. No wound on any of them. No mark. No sign of anybody having been there at all.' },
    { who: null, text: 'He knelt down and put his hands in the water, and a voice came out of the lake. "That water is mine. They drank without answering me. You may drink after you answer, and not before."' },
    { who: null, text: '"Then ask," said Yudhishthira, who was the thirstiest man in the world, kneeling between his four dead brothers, and who did not argue about it for even one second. That is why this episode is his.' },
    { who: null, text: '"What is faster than the wind?" "The mind." "What travels alone?" "The sun." "What do you leave behind when you go?" "Everything except what you did."' },
    { who: null, text: 'On and on. Riddles about kindness, about anger, about what makes a person rich, about what a man loses when he stops listening. He answered every one, kneeling in the mud, without once looking at the water.' },
    { who: null, text: '"Last one," said the voice. "What is the most astonishing thing in the whole world?"' },
    { who: null, text: '"That every day," said Yudhishthira, "people watch other people die. And every day they get up and live as though it is never going to happen to them. There is nothing stranger than that anywhere."' },
    { who: null, text: '"Correct," said the voice. "Choose one of your brothers. I will give you one. He will get up and the other three will not."' },
    { who: null, text: 'Yudhishthira did not even take long. "Nakula." Not Bhima, who was the strongest. Not Arjuna, who was the war. "My father had two wives. I am alive, and I am Kunti\'s. One of Madri\'s sons should be alive too. If I am going to spend my life talking about what is fair I should probably start at home."' },
    { who: null, text: 'And the voice said that this was the answer it had come for, and all four brothers sat up at once, complaining and asking what had happened, and the thing in the lake turned out to be Dharma himself, who was Yudhishthira\'s own father.' },
    { who: 'mithu', text: '"Remember the dog at the gate, later on," said Mithu. "This is not the last time somebody stops him at a doorway and asks him a question. And it is not the last time he gives up the thing he wants most, in one sentence, without arguing."' }
  ],
  ends_on: 'Twelve years are up. Now they have to be invisible for one more.',
  words_hi: [['झील', 'jheel', 'lake'], ['प्यास', 'pyaas', 'thirst'], ['पहेली', 'paheli', 'riddle']]
},

/* ================================================= VIRATA PARVA (20–21) ==== */

{
  n: 20, book: 'virata',
  title: 'The Year Nobody Knew Them',
  hook: 'The five greatest fighters alive spent a year as a cook, a dancing teacher and two grooms.',
  minutes: 6,
  cast: ['courtier'],
  gate: 9,
  cards: [
    { who: null, text: 'The thirteenth year had to be spent somewhere in the world where nobody recognised them. If anyone did, the whole thirteen started again. So they picked the court of an old king called Virata, walked in through the front door, and asked for jobs.' },
    { who: null, text: 'First they had to hide the weapons. They wrapped them in cloth and tied them high in a tree near the burning ground and told the local people it was a body, because nobody goes near one of those, which is the only reason it worked.' },
    { who: null, text: 'Yudhishthira became Kanka, a quiet gentleman who played dice with the king. He was extremely good at it now. He had had a lot of time to think about dice.' },
    { who: null, text: 'Bhima became Ballava the cook, and he was a genuinely brilliant cook, and he also won every wrestling match in the kingdom by accident and had to be told to stop.' },
    { who: null, text: 'The twins took the horses and the cattle. And Arjuna — the greatest archer in the world, who had once been taught to sing and dance by the musicians of the sky, and had thought it a waste of time — put on bangles and a long braid, took the name Brihannala, and became the teacher of dance to the princess.' },
    { who: null, text: 'And Draupadi, who had been queen of the finest city in the world, became Sairandhri, a hairdresser to the queen, on the condition that she serve no one else and be asked nothing about herself.' },
    { who: null, text: 'It very nearly worked. The one thing they had not planned for was that the queen\'s brother, who ran that kingdom in everything but name, would not leave Draupadi alone.' },
    { who: null, text: 'She went to Yudhishthira. He told her to endure it, because of the year, because of the thirteen, because of the word he had given. He failed her a second time, in a smaller room, with less excuse.' },
    { who: null, text: 'So she went to Bhima at night in the kitchen, and Bhima did not tell her to endure anything. That man was found dead in the dancing hall in the morning, and the entire court took one look and quietly decided not to ask a single question about it.' },
    { who: 'courtier', text: '"We told the king it must have been a spirit," said one of Virata\'s ministers afterwards, "because the alternative was that we had a cook who could do that, and nobody wanted to think about the cook."' },
    { who: null, text: 'Draupadi got through the year. But she got through it as a servant, being told to wait, by the man who had already staked her once — and the poem never once suggests she should be grateful about it.' },
    { who: 'mithu', text: '"Eleven months down," said Mithu. "A few days left. And then the army of Hastinapura turns up at the border to steal Virata\'s cows, which is the single unluckiest piece of timing in Indian literature."' }
  ],
  ends_on: 'Every fighting man in the kingdom is away at the other border. There is one person left in the palace who says he can drive a chariot.',
  words_hi: [['रसोई', 'rasoi', 'kitchen'], ['नाच', 'naach', 'dance'], ['छिपना', 'chhipna', 'to hide']]
},

{
  n: 21, book: 'virata',
  title: 'The Prince Who Ran Away',
  hook: 'He had been telling everyone for years how he would fight. Then he saw the army.',
  minutes: 5,
  cast: [],
  gate: 8,
  cards: [
    { who: null, text: 'Duryodhana had worked out roughly where they must be, and came to raid Virata\'s cattle partly for the cattle and mostly to flush them out before the thirteenth year ended. The whole family came: Bhishma, Drona, Karna, all of them.' },
    { who: null, text: 'Virata and his army were away at the far border. The only person left in the palace was his son, Prince Uttara, who had spent his whole life explaining at dinner exactly what he would do if he ever got the chance.' },
    { who: null, text: '"I would go out this minute," he announced to the women\'s hall, "if only I had a charioteer. There is simply nobody left who can drive."' },
    { who: null, text: 'And the princess, who had been having dance lessons for eleven months, said brightly: "Brihannala can drive. Brihannala told me. Take Brihannala."' },
    { who: null, text: 'So the prince of the kingdom rode out to face the greatest army in the world with a dance teacher in bangles holding the reins, which is exactly the sort of thing this poem does when it has been serious for too long.' },
    { who: null, text: 'They came over the rise and Uttara saw it. The whole line of it. Bhishma\'s banner. Drona\'s. Karna\'s. And he dropped his bow in the chariot and jumped down and ran, actually ran, back towards the city, with his arms going.' },
    { who: null, text: 'Brihannala caught him by the hair, in the open, in front of an army, and walked him back to the chariot. "Get in. You do not have to fight. You are going to drive."' },
    { who: null, text: 'They stopped at a burning ground where something long was wrapped in cloth up in a tree. "Fetch that down." "That is a body." "It is not a body. Fetch it down."' },
    { who: null, text: 'The boy climbed the tree and unwrapped a bow that he had heard about in songs since he was four years old, and turned round very slowly to look at his dance teacher.' },
    { who: null, text: 'And out across the field the sound of that bowstring reached the old men, and Bhishma turned to Drona, and Drona said, "That is Arjuna. Count the days again if it makes you feel better. I already have. The year is over."' },
    { who: null, text: 'One man, one terrified boy driving, against all of them. He did not kill anybody. He simply took the army apart, put them all to sleep with one arrow at the end, and had Uttara collect the cattle and drive home.' },
    { who: 'mithu', text: '"And when they got back," said Mithu, "the prince stood in front of his father and said: I did not win that. Not one bit of it. Which, after everything he had said at dinner for years, is the bravest thing anybody does in this whole book."' }
  ],
  ends_on: 'The hiding is over. Now messengers start riding, and there is one last chance to stop it.',
  words_hi: [['रथ', 'rath', 'chariot'], ['डर', 'dar', 'fear'], ['पेड़', 'ped', 'tree']]
},
/* ================================================= UDYOGA PARVA (22–24) ==== */

{
  n: 22, book: 'udyoga',
  title: 'Both Cousins Come Asking',
  hook: 'One of them chose the army. One of them chose the man who would not fight.',
  minutes: 4,
  cast: ['krishna'],
  gate: 8,
  cards: [
    { who: null, text: 'Everybody now went looking for allies, and the two cousins had the same idea on the same day, which is how they both ended up in Krishna\'s room in Dwaraka while he was asleep.' },
    { who: null, text: 'Duryodhana got there first and took the chair at the head of the bed, because he was a king and that is where a king sits. Arjuna came in after and sat down on the floor at the foot, and waited.' },
    { who: null, text: 'Krishna woke up and saw Arjuna first, because that is who was in front of him.' },
    { who: 'krishna', text: '"You are both welcome," he said, "and you have both come for the same thing, and I am related to both of you. So here is what I have. On one side, my whole army — every soldier I have. On the other side, me. Alone. And I will not pick up a weapon or fight for one minute of this war."' },
    { who: null, text: '"I saw Arjuna first, and he is the younger. He chooses first. Argue with me about it later."' },
    { who: null, text: 'Duryodhana sat forward. He had already done the sum. An entire army against one man who had just publicly promised not to fight — there was no possible way Arjuna took the man.' },
    { who: null, text: '"You," said Arjuna. "I will take you."' },
    { who: null, text: 'Duryodhana was out of the door before anybody could change their mind, absolutely delighted, and honestly you cannot blame him. He had come for soldiers and he had got all of them, and it had cost him nothing.' },
    { who: 'krishna', text: '"You have just chosen a man who will not lift a weapon," said Krishna, when they were alone. "You could have had the army. Are you sure?"' },
    { who: null, text: '"I did not choose a weapon," said Arjuna. "I chose you. I want you where I can hear you."' },
    { who: 'mithu', text: '"So Krishna went to that war as a charioteer," said Mithu. "Holding reins, not weapons. Which is why the most famous conversation in Indian literature happens in a chariot, between the man driving and the man behind him."' }
  ],
  ends_on: 'One last messenger goes to Hastinapura, to ask for the smallest thing anybody has asked for yet.',
  words_hi: [['दोस्त', 'dost', 'friend'], ['सेना', 'sena', 'army'], ['चुनना', 'chunna', 'to choose']]
},

{
  n: 23, book: 'udyoga',
  title: 'Five Villages',
  hook: 'They came down from a kingdom to five villages. He would not give them one.',
  minutes: 5,
  cast: ['krishna', 'courtier'],
  gate: 9,
  cards: [
    { who: null, text: 'Krishna went to Hastinapura himself, as a messenger, to try to stop it. The whole city came out onto the road to see him come in, which tells you how badly ordinary people wanted this not to happen.' },
    { who: null, text: 'He stood up in that hall — the same hall — and put the case in front of them plainly. Thirteen years had been served, exactly as agreed, down to the last day. The kingdom was owed back. It was not a favour. It was the terms.' },
    { who: null, text: 'Duryodhana said no.' },
    { who: null, text: 'So Krishna came down. Not the kingdom, then. Half of it. No. A province, then. No. And in the end he stood in the middle of the greatest court in the world and asked, for the sake of peace, for five villages. One for each brother. That was the final offer.' },
    { who: 'courtier', text: '"Bhishma begged him," said one of the courtiers who was in the room. "Drona begged him. His own father asked him. Vidura told him what would happen to us all. And Karna, who never once told him what he wanted to hear, told him to take it."' },
    { who: null, text: '"Not five villages," said Duryodhana. "Not one village. Not one field. Not as much earth as you could stand a needle up in. They can come and take it if they think it is theirs."' },
    { who: null, text: 'And he was not simply being greedy, and this is the part that matters. He believed that kingdom was his. He had believed it since he was small. He had been told so by his uncle every day for thirty years, and never once made to sit still and hear anything else. By the time he says that sentence, he cannot hear it.' },
    { who: null, text: 'Then somebody in the hall gave an order to seize the messenger, which is about as low as a court can go, and there was a moment of real horror in that room — and Krishna simply walked out through all of it and got into his chariot.' },
    { who: 'krishna', text: '"I have done what I came to do," he said at the gate. "Nobody will be able to say afterwards that there was no other way. There was. It was five villages. It was in this room this morning and every one of you watched it go."' },
    { who: null, text: 'On the way out of the city he stopped, and asked for someone to be brought to him privately. And the man who came out to the chariot was Karna.' },
    { who: 'mithu', text: '"What Krishna says to him at that gate," said Mithu, "is the hardest offer in the whole poem. And Karna is not the only person who comes looking for him that week."' }
  ],
  ends_on: 'His mother has waited forty years to tell him. She picks this week.',
  words_hi: [['गाँव', 'gaanv', 'village'], ['सुई', 'sui', 'needle'], ['ज़मीन', 'zameen', 'land']]
},

{
  n: 24, book: 'udyoga',
  title: 'Kunti at the Water',
  hook: 'She stood in the sun behind him and waited for him to finish praying.',
  minutes: 5,
  cast: [],
  gate: 9,
  cards: [
    { who: null, text: 'Karna prayed at the water every morning, facing the sun, and did not turn round for anybody until he had finished. So Kunti stood behind him in the heat, in the open, and waited, and he did not know she was there.' },
    { who: null, text: 'When he finished he turned round and found the mother of the five men he was about to fight standing in the sun with her head uncovered, and he bowed and gave her his proper name — the son of the chariot driver and Radha — because that is who he had decided long ago that he was.' },
    { who: null, text: '"No," she said. "Listen. I was thirteen. There were words a man had given me and I did not understand what they did. I said them at a window, looking at the sun, to see if they were real."' },
    { who: null, text: '"You were born that evening with the armour already on you. I put you in a basket and I pushed you into the river before it was light, and I have not said one word about it to any living person since, and I am saying it now."' },
    { who: null, text: 'He did not shout. That is the terrible part. Everybody in this poem shouts eventually except him, in this one conversation.' },
    { who: null, text: '"You had forty years," he said. "You had the whole afternoon in that arena, when they asked me my father\'s name in front of thirty thousand people and I stood there with nothing to say. You were in the gallery. I have been told where you were sitting."' },
    { who: null, text: '"And you say it now. In the week before a war. You have not come to me as my mother. You have come as their mother."' },
    { who: null, text: 'She did not deny it. That is one of the bravest things in the book. She had come for exactly that, and she stood there and let him say it.' },
    { who: null, text: '"I will not leave Duryodhana," he said. "He gave me a kingdom on a day when nobody in the world would give me the time. Whatever he is — and I know what he is — he did that, and I will not be the man who walks away the week it gets expensive."' },
    { who: null, text: '"But I will give you this. You came for five sons and you will go home with five. I will not touch Yudhishthira. Not Bhima, not Nakula, not Sahadeva. Only Arjuna. One of us will be alive at the end and you will still have five."' },
    { who: null, text: 'And Kunti walked back to the camp with that, and told nobody, and went on saying nothing for as long as it took, which by now she was extremely good at.' },
    { who: 'mithu', text: '"There are two people on that battlefield who know Karna is a brother," said Mithu. "Krishna and Kunti. Neither of them tells the five men holding the weapons. You are allowed to have opinions about that."' }
  ],
  ends_on: 'Eighteen armies come to a flat plain called Kurukshetra, and camp on opposite sides of it.',
  words_hi: [['माँ', 'maa', 'mother'], ['आँसू', 'aansu', 'tears'], ['सच', 'sach', 'truth']]
},

/* ================================================ BHISHMA PARVA (25–27) ==== */

{
  n: 25, book: 'bhishma',
  title: 'The Night Before',
  hook: 'They wrote the rules of the war themselves. Then they broke every one.',
  minutes: 5,
  cast: ['hanuman', 'krishna'],
  gate: 9,
  cards: [
    { who: null, text: 'Kurukshetra is flat, and dry, and enormous, and by the end of that week there were eighteen armies camped on it — eleven on one side and seven on the other, which tells you how the odds looked to anybody counting tents.' },
    { who: null, text: 'The night before, the elders from both camps met in the middle and wrote down the rules, together, in daylight, agreed by everybody.' },
    { who: null, text: 'No fighting after sunset. One against one, and never more. Nobody who has lost his chariot. Nobody who has put his weapon down. Nobody who is running, nobody asleep, nobody who is not a soldier. Charioteers, animals and camp people are not touched.' },
    { who: null, text: 'They meant it when they wrote it. Keep the list in your head. Almost every single line of it gets broken in the next eighteen days, mostly by the side the poem is following.' },
    { who: null, text: 'In the morning Arjuna\'s chariot went out with Krishna holding the reins, and on the flag above it sat an old monkey who had promised, years ago, on a forest path, to be there.' },
    { who: 'hanuman', text: '"I said I would come," said Hanuman, settling himself. "Nobody down there is going to enjoy the noise I make."' },
    { who: null, text: 'And then, before anything started, Yudhishthira took his armour off. He put down his weapons, got out of his chariot, and started walking, alone, across the empty ground towards the other army.' },
    { who: null, text: 'His brothers thought he had lost his nerve. His own soldiers thought he was surrendering. He walked the whole way in silence and went to Bhishma and put his head on the old man\'s feet.' },
    { who: null, text: '"I am going to fight you," he said. "Give me your permission." And Bhishma, who had taught him to walk, put a hand on his head and said, "If you had not come, I would have been ashamed of you. Fight. I am tied to that throne, not to the boy sitting on it. Ask me later how to beat me, and I will tell you."' },
    { who: null, text: 'He did the same at Drona. The same at Kripa. Every one of them gave him their blessing and told him to come back and ask again when he needed the answer, and then went and stood in the line opposite him.' },
    { who: null, text: 'Then the conches went, all along both lines, and eighteen armies stood up. And Arjuna leaned forward and said, "Take me out into the middle. I want to see who I have come to fight."' },
    { who: 'mithu', text: '"That," said Mithu, "is the last ordinary sentence anybody says for a while."' }
  ],
  ends_on: 'Krishna drives him out between the two armies and stops the chariot, and Arjuna looks.',
  words_hi: [['मैदान', 'maidan', 'field'], ['शंख', 'shankh', 'conch'], ['नियम', 'niyam', 'rule']]
},

{
  n: 26, book: 'bhishma',
  title: 'A Talk Between Friends',
  hook: 'He put the bow down between two armies and said he could not do it.',
  minutes: 6,
  cast: ['krishna'],
  gate: 10,
  cards: [
    { who: null, text: 'The chariot stopped in the middle, between the two lines, with everybody watching. And Arjuna, who had wanted this war for thirteen years, stood up and looked along the other side properly for the first time.' },
    { who: null, text: 'His grandfather. The teacher who had taught him to hold a bow. Kripa, who had taught him before that. Cousins he had grown up with. Boys he had wrestled. Men whose houses he had eaten in.' },
    { who: null, text: 'And his hands started shaking, and he sat down in the chariot, and put the bow on the floor of it.' },
    { who: null, text: '"That is my grandfather," he said. "That is the man who put this bow in my hands and told me to look at the eye. What exactly am I supposed to win here? A kingdom I have to sit and eat in, with all their families at the table?"' },
    { who: null, text: '"I would rather they killed me. I mean that. Let them come. I am not going to do this."' },
    { who: null, text: 'And what happens next is not a general shouting at a soldier. It is one friend talking to another friend, in the middle of a field, with two armies standing still, about the hardest question there is: what do you do when every single thing you can do is bad?' },
    { who: 'krishna', text: 'Krishna did not shout. He asked him questions. He started by pointing out the thing Arjuna had not noticed — that sitting down in the chariot is not stepping out of the world. It is a choice, with a price, and other people pay it too. There is no square on that field marked innocent.' },
    { who: null, text: 'He talked about doing the work in front of you, and doing it as well as you can, and then letting go of owning what comes of it — because nobody, ever, owns what comes of it.' },
    { who: null, text: 'He talked about the part of a person that a weapon cannot get at. He talked about doing your own job badly rather than somebody else\'s job beautifully. And he told him, at the end, to think about all of it and then decide for himself — which is not the sentence anybody expects.' },
    { who: null, text: 'And somewhere in that chariot something happened that Arjuna could never afterwards describe to anybody, and he was frightened, and he asked for his friend back, and got him.' },
    { who: null, text: 'That conversation is the Bhagavad Gita. Seven hundred verses, sitting quietly inside a war book, before a single arrow is shot. What you have just read is the shape of it, in our words — the verses themselves are in Sanskrit and you will find them on the verse shelf, read out one at a time by a person. Nobody should ever hand you a made-up version of those.' },
    { who: null, text: 'People have argued about this conversation for a very long time, including about whether it settles anything at all. Gandhi read the whole battlefield as a picture of a fight going on inside one person. Other readers have always taken it as exactly what it looks like. It has carried both for centuries.' },
    { who: 'mithu', text: '"Two friends," said Mithu. "One of them does not want to fight, and the other one has to talk to him with an army waiting on either side. That is what it is, underneath. It is about doing the right thing when the right thing is hard and you would much rather go home."' }
  ],
  ends_on: 'Arjuna picks the bow up. And then the poem stops talking about right and wrong and starts counting days.',
  words_hi: [['मन', 'man', 'mind'], ['काम', 'kaam', 'work'], ['हिम्मत', 'himmat', 'courage']]
},

{
  n: 27, book: 'bhishma',
  title: 'The Fall of Bhishma',
  hook: 'He could not be beaten. So they went and asked him how to beat him.',
  minutes: 5,
  cast: [],
  gate: 10,
  cards: [
    { who: null, text: 'For nine days Bhishma held the whole field. He was old enough to be everybody\'s grandfather and there was nothing anybody on the other side could do about him, and every evening Yudhishthira came back to his tent and sat with his head in his hands.' },
    { who: null, text: 'So on the ninth night the five of them walked across to the other camp, unarmed, at night, and went into the tent of the man who was destroying them. Nobody stopped them. Everybody in both armies understood exactly what this family was.' },
    { who: null, text: '"You said to come and ask," said Yudhishthira. "I am asking."' },
    { who: null, text: '"Yes," said Bhishma. "I did say that." And he sat and told them, calmly, how to end him, because he had promised to answer and because he was extremely tired.' },
    { who: null, text: 'There was a warrior on their side called Shikhandi, who had been born a girl and was now a man, and against whom Bhishma had decided long ago that he would never raise a bow. Put Shikhandi in front, he said, and put Arjuna behind him.' },
    { who: null, text: 'They walked back to their own camp in the dark, and nobody spoke, and Arjuna was sick that night. It is the worst thing he is ever asked to do and it is not close.' },
    { who: null, text: 'On the tenth day they did it. Bhishma saw Shikhandi in front of him and lowered his bow and kept it lowered, exactly as he had said he would, and the arrows came over Shikhandi\'s shoulder.' },
    { who: null, text: 'He went down. He did not reach the ground. There were so many arrows in him that he came to rest on them, held up above the earth, and the whole war stopped, on both sides, at once, without anybody giving an order.' },
    { who: null, text: 'They came and stood round him, everybody, from both armies, and somebody ran for silk cushions to put under his head, and the old man laughed at them.' },
    { who: null, text: '"Not those. A soldier\'s pillow." And Arjuna, crying, put three arrows in the ground under his grandfather\'s head. "That is right," said Bhishma. "That is from my own family."' },
    { who: null, text: 'Then he said he was thirsty, and they brought water in a jar and he would not take it, so Arjuna shot one arrow into the earth beside him and clean water came up out of the ground, and the old man drank and said, "Now you are showing off," and closed his eyes.' },
    { who: null, text: 'And he did not die. He had been given the choosing of his own hour when he was young, and he decided to wait — so he lay on that field, on those arrows, all through the rest of the war and for a long time after it, while both sides came and sat with him and asked him questions.' },
    { who: 'mithu', text: '"A whole life spent keeping one promise," said Mithu, "and he spends the end of it lying in a field, being visited. If you want to know what this poem thinks about vows — it is all in that picture, and it does not say a word."' }
  ],
  ends_on: 'Drona takes command. And on the thirteenth day he builds a shape that only two men alive know how to get out of.',
  words_hi: [['दादा', 'dada', 'grandfather'], ['पानी', 'paani', 'water'], ['इंतज़ार', 'intezaar', 'waiting']]
},
/* ================================================== DRONA PARVA (28–29) ==== */

{
  n: 28, book: 'drona',
  title: 'The Boy Inside the Wheel',
  hook: 'He knew how to get in. Nobody had ever told him how to get out.',
  minutes: 5,
  cast: [],
  gate: 10,
  cards: [
    { who: null, text: 'On the thirteenth day Drona set out a formation shaped like a turning wheel, with the army spiralling inward, and there were only two men on the other side who knew how to break into it — Krishna and Arjuna. So the other camp arranged for both of them to be drawn far away to the south, and then closed the wheel.' },
    { who: null, text: 'And Abhimanyu, who was sixteen years old, and who was Arjuna\'s son, said he could get in.' },
    { who: null, text: 'The story goes that he had learned it before he was born, listening from inside his mother while his father explained it — and that she had fallen asleep before the part about coming out again. So he had half of it. He had always had exactly half of it.' },
    { who: null, text: '"I can open it," he said. "I cannot close it behind me. Come in with me and stay close and we are all fine."' },
    { who: null, text: 'He went in like a stone through water, and the wheel opened, and his uncles came in behind him — and then the door shut. One man held that gap and none of the others could get through it, and the boy was inside, on his own, with the whole army.' },
    { who: null, text: 'They could not beat him fairly, so they stopped trying. Six of the greatest warriors alive came at one sixteen-year-old at the same time, which was against the first rule on the list they had all written together in daylight ten days before.' },
    { who: null, text: 'They broke his bow. Then his chariot. Then his sword. He was fighting with a chariot wheel held over his head at the end, on foot, in the middle of all of them.' },
    { who: null, text: 'The poem does not make any of this exciting. It slows down and it goes quiet and it makes you watch, and then it stops, and that is the whole point of the page.' },
    { who: null, text: 'Arjuna came back at evening, and the camp was too quiet, and everybody found somewhere else to look. He had to ask three times before anybody would tell him.' },
    { who: null, text: 'What he did next is the moment this war stops being a war and becomes something else. He swore that he would kill the man who had held that gap before the sun went down the next day, and that if he failed he would walk into fire himself.' },
    { who: null, text: 'And after that the rules on the list came off, one at a time, on both sides, and this is where every reader has to notice that it is our side taking them off.' },
    { who: 'mithu', text: '"Two nights before, everybody stopped fighting to bring an old man water," said Mithu. "That is how fast it goes. Nobody wakes up in the morning and decides to become the sort of person who does this. It happens in about a week, one reasonable step at a time."' }
  ],
  ends_on: 'The next problem is Drona, and there is only one thing in the world that will make him put his bow down.',
  words_hi: [['चक्र', 'chakra', 'a circle'], ['घेरा', 'ghera', 'a ring'], ['सोलह', 'solah', 'sixteen']]
},

{
  n: 29, book: 'drona',
  title: 'Three Words in a Loud Room',
  hook: 'The one man in the poem who had never lied. And the war needed exactly one lie.',
  minutes: 5,
  cast: ['krishna', 'royal_elephant'],
  gate: 10,
  cards: [
    { who: null, text: 'By the fifteenth day Drona could not be stopped. He was old, and he was the best teacher of weapons who had ever lived, and he was going through the army he had taught like a man mowing.' },
    { who: null, text: 'There was exactly one thing on earth that would make him stop, and everybody knew what it was. He had a son called Ashwatthama, and he loved him past all sense, and if he believed his son was dead he would put the bow down where he stood.' },
    { who: null, text: 'So somebody said it out loud in the tent, and everybody looked at Yudhishthira, because there was no point telling Drona a lie unless it came from the one man in the world who had never told one.' },
    { who: 'krishna', text: '"He will not believe me," said Krishna. "He will not believe Bhima. He will believe you, and only you, and he will believe you the first time. That is what your whole life has bought."' },
    { who: null, text: 'Yudhishthira said no. And then he said no again. And then he stood there while the day went on and people he had grown up with were carried past the tent, and he stopped saying no, and that is the actual moment, not what comes after.' },
    { who: 'royal_elephant', text: 'They found a way to make it nearly true. There was an elephant in the army whose name happened to be Ashwatthama. Bhima went and killed the elephant, and then walked up and down the line shouting that Ashwatthama was dead, and the drums were enormous.' },
    { who: null, text: 'Drona did not believe a word of it. He rode straight across to the one person whose word he would take, and stood in front of him with the noise all around, and asked.' },
    { who: null, text: '"Ashwatthama is dead," said Yudhishthira. And then, in a voice that would not have carried three feet in that noise, he added: "...the elephant."' },
    { who: null, text: 'Drona did not hear it. Nobody heard it. He got down off his chariot in the middle of a battle, put his bow on the floor of it, sat down, and closed his eyes, and stopped being in the war at all.' },
    { who: null, text: 'And Drupada\'s son, who had been born into this family\'s quarrel and raised for precisely this one moment, came and did it while the old man was sitting there, and nobody on either side felt anything you could call victory.' },
    { who: null, text: 'The best man in the poem told his one lie, and it worked, and the poem never lets him have it back. It is not on the list of things he is forgiven for. He carries it to the very last page, and it is waiting for him there.' },
    { who: 'mithu', text: '"Ask yourself the question the poem is actually asking," said Mithu. "Not was it a lie. Of course it was. The question is whether a true sentence said in a voice nobody can hear is any better — and whether he knew the answer while he was saying it."' }
  ],
  ends_on: 'Karna takes command. And on the seventeenth day the two of them finally face each other.',
  words_hi: [['झूठ', 'jhooth', 'a lie'], ['हाथी', 'haathi', 'elephant'], ['ढोल', 'dhol', 'drum']]
},

/* ================================================== KARNA PARVA (30) ======= */

{
  n: 30, book: 'karna',
  title: 'The Wheel in the Mud',
  hook: 'He asked for the rule. He was told exactly where the rules had gone.',
  minutes: 6,
  cast: ['krishna'],
  gate: 10,
  cards: [
    { who: null, text: 'Karna took command, and he had one day and a night of it, and he was every bit as good as everybody had always been afraid he was.' },
    { who: null, text: 'He kept his word to Kunti the whole way through. He had Yudhishthira in front of him and let him go. He had Bhima and let him go. Four times he could have ended it and four times he stepped back, and nobody on his own side ever understood why.' },
    { who: null, text: 'And he had used the spear. The one throw he had bought with his own skin, the one he had been saving for Arjuna for years — he had been forced to spend it the night before, on somebody else, to save Duryodhana. He knew what that meant when he did it.' },
    { who: null, text: 'On the seventeenth day the two chariots finally came together, and it was the fight the whole poem has been walking towards since a boy walked into an arena and asked for a match.' },
    { who: null, text: 'And then his chariot wheel went into the ground. Soft earth, a bad line, an ordinary accident, and the wheel sank to the axle and the horses could not pull it out.' },
    { who: null, text: 'He reached for the great weapon he had been taught, and the words for it would not come. He had been cursed once, long ago, over something small, that at the moment he most needed it he would not be able to remember — and he stood in his chariot with his mind completely blank.' },
    { who: null, text: 'So he put his bow down, and got out, and put his shoulder to the wheel, and called across to the other chariot: "Wait. A man on foot with no weapon. That is the rule. We wrote it. Wait until I am up."' },
    { who: null, text: 'And Arjuna waited, because of course he did.' },
    { who: 'krishna', text: '"The rule," said Krishna. "Say it again. Where was the rule when six of you closed a wheel round a boy of sixteen and broke his bow? Where was it in that hall, when a woman asked a question and you were in the room, and you spoke, and you did not speak kindly? You cannot pick the afternoon you start keeping the rules."' },
    { who: null, text: '"Shoot, Arjuna."' },
    { who: null, text: 'And he did. And you are allowed to find that unbearable, because it is meant to be. The poem puts the two worst things it knows side by side on one page and does not tell you which one is worse. That is not the poem failing. That is the poem.' },
    { who: null, text: 'Nobody on the field knew what they had just done. It is only afterwards, weeks later, in a tent, that anybody says the word brother out loud, and by then it is a thing you can only be told, not a thing you can do anything about.' },
    { who: null, text: 'And Duryodhana — who does not cry when he loses his kingdom, or his brothers, or the war, or his own life — sat down on the ground when he heard, and cried like a child, and could not be got up for a long time.' },
    { who: 'mithu', text: '"That is the only time in the whole book he cries," said Mithu. "Not for a throne. For his friend. Whatever else you decide about him, do not lose that."' }
  ],
  ends_on: 'One cousin left, one day left, and a lake with a man hiding at the bottom of it.',
  words_hi: [['पहिया', 'pahiya', 'wheel'], ['कीचड़', 'keechad', 'mud'], ['बोझ', 'bojh', 'a weight']]
},

/* ================================================= SHALYA PARVA (31) ======= */

{
  n: 31, book: 'shalya',
  title: 'The Last Day',
  hook: 'They found him at the bottom of a lake, and called him out.',
  minutes: 5,
  cast: [],
  gate: 10,
  cards: [
    { who: null, text: 'On the eighteenth day there was almost nothing left of either army, and Duryodhana was alone. Every one of his brothers was gone. Bhishma was lying on his arrows. Drona was gone. Karna was gone. Shakuni, who had started it, was gone.' },
    { who: null, text: 'He walked away from the field with his mace and went into a lake and lay down at the bottom of it, in the cold water, and stayed there. Not hiding, he said afterwards. Resting. There is nobody left to fight beside, he said, so what exactly am I hurrying for.' },
    { who: null, text: 'They found him. They stood on the bank and called him out, and Bhima said things that were designed to work, and after a while the water broke and he came up with the mace on his shoulder.' },
    { who: null, text: '"One at a time," he said. "Any of you. Pick one and send him and I will fight him and then the next, and if I am still standing, the kingdom is mine and you can all go home."' },
    { who: null, text: 'Bhima went. And they were very evenly matched, more evenly than anybody had expected, and it went on and on until it was clear that Bhima was not going to win it fairly.' },
    { who: null, text: 'So somebody on the bank tapped his own thigh, where everybody could see it, and Bhima understood, and struck below the waist, which was against the rules of that particular fight and every man watching knew it.' },
    { who: null, text: 'Duryodhana went down. And Balarama, Krishna\'s own brother, who had taught both of those men to use a mace, walked off that bank in a fury and would not speak to anybody, because he had watched his students cheat.' },
    { who: null, text: 'And Duryodhana lay on the ground and made the last speech, and the poem gives it to him straight, with nobody correcting him at the end of it.' },
    { who: null, text: '"I ruled the whole earth. I had friends who stayed. I gave away what I wanted to give away and I never once asked anybody to make me smaller. I am dying on a field with my brothers, not in a bed. Now tell me — what exactly have any of you won?"' },
    { who: null, text: 'Nobody answered. And then, in the night, while the winning camp was asleep, something happened that took from them nearly everything they had left. It was done to sleeping people. The book that tells it is called the Book of the Sleeping, and there is nothing anywhere in it that anybody would call a victory.' },
    { who: null, text: 'Draupadi lost all five of her sons in that one night, after all of it, after thirteen years, at the end. And when the man who had done it was caught and brought in front of her, she asked for him to be let go, because his mother was alive, and she had just found out what that was.' },
    { who: 'mithu', text: '"Eighteen days," said Mithu. "Eleven armies and seven armies. And at the end of it about a dozen people are still standing on that field, and every single one of them wishes they were not."' }
  ],
  ends_on: 'In the morning the women come out of the city and walk onto the field.',
  words_hi: [['गदा', 'gada', 'mace'], ['रात', 'raat', 'night'], ['राख', 'raakh', 'ash']]
},

/* ==================================================== STRI PARVA (32) ====== */

{
  n: 32, book: 'stri',
  title: 'Gandhari Counts',
  hook: 'She had a hundred sons. She walked the whole field to find them.',
  minutes: 6,
  cast: [],
  gate: 10,
  cards: [
    { who: null, text: 'This is the shortest book in the poem and it is the one people cannot read out loud. The fighting is over. The women come out of Hastinapura at first light and walk onto the field, and the poem hands them the whole story and stands back.' },
    { who: null, text: 'They had been in the city for eighteen days, hearing drums. Now they are outside, in the grey light, looking for particular people among a great many.' },
    { who: null, text: 'Gandhari walked out with the cloth still over her eyes, holding somebody\'s arm, and she went across that field and found her sons. All of them. One after another, in order, the way you would count something.' },
    { who: null, text: 'A hundred. She had made a hundred choices about names. She had told a hundred children not to run in the corridor. She had been warned, once, in a room, on a morning when it could still have been stopped, and she had said the warning out loud herself, and been overruled by a man who could not say no.' },
    { who: null, text: 'And then she turned round to the one person on that field who could have prevented all of it.' },
    { who: null, text: '"You could have stopped this," she said to Krishna. "Not at the end. At any hour of any one of those eighteen days, and before that, in the hall, and before that, at the dice. You are the only person here who could have, and you did not."' },
    { who: null, text: 'He did not argue with her. He stood there and let her say it, and let her curse him, and took it, and the poem does not put one word in his mouth to make it easier. If you were waiting for somebody to let Krishna off, this is the page where it does not happen.' },
    { who: null, text: 'Then Kunti walked over to her own five sons, who had won, and who were standing about not knowing what to do with their hands, and told them who Karna was.' },
    { who: null, text: 'Yudhishthira did not shout either. He asked her when she had known, and she said, since before he was born. He asked why she had not said, and there was no answer that could be given standing on that field.' },
    { who: null, text: '"Then he was my elder brother," he said. "And I have spent my life at war with my brother. And you watched, and you said nothing, for forty years." And then, because there was nothing left to do with any of it, he lost his temper and laid a curse on all women — that no woman should ever be able to keep a secret again.' },
    { who: null, text: 'It is a small and bitter and completely unfair thing to say, and the poem writes it down exactly as it happened and does not defend it. That is what this book does. It writes down what people actually say on the worst morning of their lives.' },
    { who: null, text: 'And then the two mothers — the blindfolded one who had lost a hundred, and the one who had lost one and could never say so — went to the water together with the rest of the women, and did what has to be done for the dead, side by side, for everybody, without sorting them into sides.' },
    { who: 'mithu', text: '"That is the last thing that happens in the war," said Mithu. "Two mothers at a river, doing exactly the same thing for exactly the same reason. It took eighteen days and a hundred thousand people to get to something they could have done in the first week."' }
  ],
  ends_on: 'They rule for years afterwards. It is not happy. And then, one morning, they start walking north.',
  words_hi: [['गिनना', 'ginna', 'to count'], ['माफ़ी', 'maafi', 'forgiveness'], ['चुप', 'chup', 'quiet']]
},

/* ========================================= MAHAPRASTHANIKA PARVA (33) ===== */

{
  n: 33, book: 'mahaprasthanika',
  title: 'The Dog at the Gate',
  hook: 'Everything he wanted was on the other side of the gate. He would not go in.',
  minutes: 5,
  cast: [],
  gate: 9,
  cards: [
    { who: null, text: 'They ruled for a long time, and it was fine, and it was quiet, and nobody in the palace ever quite got the field out of their head. And then one morning they took off the crowns, left them on a chair, and walked out of the city going north, with Draupadi, on foot.' },
    { who: null, text: 'A dog joined them somewhere on the road out. Nobody invited it and nobody sent it away. It simply fell in beside them and kept up, the way dogs do.' },
    { who: null, text: 'They went up into the mountains, and up past the snow, and one by one they fell on the way. Draupadi first. Then Sahadeva, then Nakula, then Arjuna, then Bhima. Each time, Yudhishthira kept walking and did not look back, because he had been told that this was the road and you do not stop on it.' },
    { who: null, text: 'The dog kept up. It did not fall. It walked beside him the whole way to the top, with its head down, in the cold.' },
    { who: null, text: 'At the top there was a chariot waiting, and Indra himself standing in it, and the whole sky lit up behind him. "Get in," he said. "You walked the road. You are the only one who did. It is all yours."' },
    { who: null, text: '"Thank you," said Yudhishthira. "Wait a moment while I lift the dog in."' },
    { who: null, text: '"The dog does not come," said Indra. "There are no dogs up there. It is not that sort of place."' },
    { who: null, text: '"Then it is not a place I want," said Yudhishthira. "That animal has walked every step I have walked. Nobody asked it to. It stayed when my wife did not last, and my brothers did not last. I am not going to buy a seat in heaven by leaving something on a mountain because it followed me."' },
    { who: null, text: '"You would give up all of it? For a dog?" "I would give up all of it for anything that trusted me," he said. "There is no version of this where I get in without him. Drive on if you like."' },
    { who: null, text: 'And the dog stood up, and it was Dharma — his own father, the same one who had been in the lake all those years ago with a voice and a set of riddles, back for one last question at one last doorway.' },
    { who: null, text: 'It was not over even then. He went up and found Duryodhana sitting comfortably in heaven and his own brothers nowhere in sight, and was told where they were, and turned round without a word and went to them and said he would stay there instead. "If they are here, I am here." And then that lifted too, because it had been the last test, and everybody was where they should be.' },
    { who: 'mithu', text: '"So it ends where it began," said Mithu. "With a question at a doorway and a man who answers it honestly and loses everything he wanted, and it turns out that is the answer."' },
    { who: null, text: 'That is the Mahabharata. It has taken you thirty-three sittings and it took the poet a lifetime, and there are whole books of it we have not touched. There are Mahabharatas in Tamil and Telugu and Odia and Bengali where these people say different things, and village versions where Draupadi is a goddess with her own temple, and Karna is the hero, and Duryodhana has one too.' },
    { who: 'mithu', text: '"Go and ask somebody old in your family which bit they were told when they were your age," said Mithu. "I promise you it will not be exactly the one you just heard. That is not a mistake. That is how this poem has stayed alive."' }
  ],
  ends_on: 'Ask your family. Somebody in it knows a version of this that nobody has written down.',
  words_hi: [['कुत्ता', 'kutta', 'dog'], ['दरवाज़ा', 'darwaza', 'door'], ['साथ', 'saath', 'together']]
}

  ]
};
