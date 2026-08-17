/* Bizzing India — the Dashavatara, the ten descents of Vishnu.

   Every object here carries badge 'katha' — a story as it is told (docs/05 §1).
   That badge is doing real work in this file. These are Puranic narratives held
   sacred by hundreds of millions of people, and the app's job is to tell them
   the way they are told at home, from the inside, without one word of "actually"
   and without one word of "only a legend" (docs/05 §4).

   FOUR RULES THIS FILE KEEPS, and the reasons:

   1. WHICH TEN IS NOT SETTLED, and the app never pretends otherwise (docs/05 §5).
      The commonest list runs Matsya, Kurma, Varaha, Narasimha, Vamana,
      Parashurama, Rama, Krishna, the Buddha, Kalki. Many Vaishnava traditions —
      and a great many families in Bengal, Odisha and among Gaudiya Vaishnavas —
      place BALARAMA ninth instead of the Buddha. Some lists count both and drop
      another. The Bhagavata Purana gives a longer list of its own in one place
      and then says plainly that the descents are past counting. The framing
      story ('dv.what-is-an-avatar') says all of this out loud, and the ninth-
      avatar story says it again where a child will actually meet it.

   2. THE NINTH IS SENSITIVE and ships needs_review: true (docs/05 §6). Many
      Hindu traditions honour the Buddha as an avatar of Vishnu. Buddhists
      overwhelmingly do NOT describe him that way — for Buddhists he is a
      teacher who woke up, not a god's descent. Both things are true about what
      people believe, and a children's app must not resolve that by picking a
      side or by quietly omitting one. A named human reviewer signs this one off.

   3. NOTHING IS INVENTED. No date is given for Kalki, because none is known and
      the tradition itself does not fix one — he is spoken of in the future
      tense throughout, which is how the stories speak of him. No scripture is
      quoted; where a text is the source it is NAMED in the source line instead,
      because a made-up verse in a child's mouth is unforgivable and a real one
      needs a translation credit this file cannot give.

   4. NOBODY IS A MONSTER. Hiranyakashipu is a proud emperor, Hiranyaksha a
      strong warrior, Mahabali a beloved king whom Kerala still welcomes home
      every Onam, and Prahlada — born an asura — is one of the best-loved
      devotees in all the stories (docs/05 §7). The Narasimha story keeps its
      violence entirely offstage: this is a four-to-twelve app and the point of
      that story for a child is that a promise was kept, not what a lion did.

   Scene shape is the house one (see data-stories.js):
     art   avatar ids to stage (left, right)
     who   speaker id, 'mithu' for the teller, or null for narration
     text  what is told
     mood  think | wow | sad
     ask   { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_DASHAVATARA = [

/* ================================================== WHAT AN AVATAR IS ===== */
{
  id: 'dv.what-is-an-avatar',
  collection: 'dashavatara',
  badge: 'katha',
  title: 'The Word That Means Coming Down',
  hook: 'Ten times, the stories say, someone came down. Here is what that word actually means — and why nobody agrees on the list.',
  hero: 'vishnu',
  cast: ['vishnu', 'mithu'],
  minutes: 3,
  words_hi: [['अवतार', 'avatar', 'a coming-down'], ['दस', 'das', 'ten'], ['रक्षा', 'raksha', 'protection']],
  scenes: [
    { art: ['vishnu'], who: 'mithu',
      text: 'You already know the word. When you make a little person in a game and send them into the world, you call it your avatar. That word is Sanskrit, and it is much older than any game. Avatara. It means a coming-down.' },
    { art: ['vishnu'], who: null,
      text: 'In the stories of Vishnu, when the world tips too far — when something has gone so wrong that nobody inside the world can fix it — Vishnu comes down INTO the world to set it right. Not watching from above. Down here, in a body, inside the trouble with everyone else.' },
    { art: ['matsya', 'kurma'], who: null, mood: 'think',
      text: 'And here is the part children usually notice first and grown-ups usually skip. He does not come down as a king every time. The first time he is a FISH. Then a tortoise. Then a boar. A lion-headed one. A small boy. Only later, a prince.' },
    { art: ['matsya'], who: 'mithu', mood: 'think',
      text: 'Water first, then a creature that lives in water and on land, then a land animal, then half-animal and half-human, then a small human, then a full one. Some people notice that this looks a little like the order life itself arrived in. Whether the storytellers meant that is something people enjoy arguing about — nobody can say for certain, so nobody should pretend to.' },
    { art: ['vishnu'], who: null,
      text: 'They are usually counted as ten. Dasha means ten; avatara means the coming-down. Dashavatara.',
      ask: {
        q: 'So — is the list of ten the same everywhere in India?',
        options: ['Yes, all ten are fixed and everyone agrees', 'No. Different traditions count differently', 'There are only three'],
        answer: 1,
        right: 'Correct, and it matters. Ask at home which ten your family counts — you may get a different answer from your friend, and you will both be right about your own tradition.',
        wrong: 'Not quite — and this is worth knowing. Different traditions count differently, and each is right about its own telling.'
      } },
    { art: ['balarama', 'buddha'], who: 'mithu',
      text: 'Most lists say: Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Krishna, the Buddha, Kalki. But many families — especially in Bengal, Odisha, and in several Vaishnava traditions — count BALARAMA, Krishna’s elder brother, in the ninth place instead. Some count both.' },
    { art: ['vishnu'], who: null,
      text: 'And one of the oldest books that tells these stories, the Bhagavata Purana, lists a much longer set in one place, and then says something lovely: that the comings-down are beyond counting, the way you cannot count the streams that come off a lake.' },
    { art: ['kalki'], who: 'mithu',
      text: 'Nine are spoken of as already having happened. The tenth, Kalki, is spoken of in the future — someone still to come. Nobody in the tradition fixes a date for that, so nobody here will either. Turn the page and we will start where all the stories start: with water.' }
  ],
  moral: 'Avatara means a coming-down. And the list of ten is not one list — it is several, and your family has its own.',
  source: 'The Dashavatara as given in the Bhagavata Purana, the Garuda Purana and the Agni Purana, which differ from one another; the Bhagavata’s own longer enumeration and its statement that the descents are innumerable. The Balarama-for-Buddha variation is standard in Gaudiya Vaishnava and much eastern Indian practice. The resemblance to an evolutionary order is a modern observation, offered here as an observation and not as a claim about what the storytellers intended.'
},

/* ============================================================ 1 · MATSYA === */
{
  id: 'dv.matsya',
  collection: 'dashavatara',
  badge: 'katha',
  title: 'The Fish Who Kept Outgrowing the Bowl',
  hook: 'A tiny fish asks a king for help. Then it needs a bigger bowl. Then a bigger one.',
  hero: 'matsya',
  cast: ['matsya', 'mithu'],
  minutes: 4,
  words_hi: [['मछली', 'machhli', 'fish'], ['पानी', 'paani', 'water'], ['नाव', 'naav', 'boat']],
  scenes: [
    { art: ['matsya'], who: null,
      text: 'A king called Manu was standing in a river, letting the water run over his hands, when something very small swam into his palm and stayed there. A fish, no longer than his thumb.' },
    { art: ['matsya'], who: 'matsya',
      text: '"Please do not put me back," said the fish. "The big fish eat the small ones. Keep me safe, and one day I will keep you safe."' },
    { art: ['matsya'], who: null, mood: 'think',
      text: 'Manu smiled and carried it home in a little pot. By morning the fish filled the pot. He moved it to a large jar. By evening it filled the jar. He moved it to a tank. It filled the tank. He carried it to a lake, and the lake was not enough either.' },
    { art: ['matsya'], who: 'mithu', mood: 'wow',
      text: 'A pot, a jar, a tank, a lake — and every single time, still too small. At what point would you have started to wonder what exactly you were carrying?' },
    { art: ['matsya'], who: null,
      text: 'Manu carried it at last to the sea. And there the fish grew until it was the size of the horizon, with a golden horn rising from its head, and Manu understood who had swum into his hands.',
      ask: {
        q: 'The fish is about to warn him about something. What do you think is coming?',
        options: ['A war', 'A great flood', 'A very long winter'],
        answer: 1,
        right: 'Yes. A flood — and a boat, and a rope, and that golden horn.',
        wrong: 'It is a flood. Which is why the story has been about water from the very first line.'
      } },
    { art: ['matsya'], who: 'matsya', mood: 'think',
      text: '"A great flood is coming," said Matsya. "Build a boat. Take the seeds of every plant, and the seven sages, and whatever must not be lost. When the water rises, tie your boat to my horn."' },
    { art: ['matsya'], who: null,
      text: 'The rain came. The rivers joined the fields, and the fields joined the sea, until there was no shore anywhere in the world. And through all of it a boat went steadily on, tied by a long rope to a golden horn, with everything that would be needed afterwards packed carefully inside.' },
    { art: ['matsya'], who: 'mithu',
      text: 'Almost every part of the world keeps a flood story. This is the one told here — and notice what the fish asks Manu to save. Not gold. Seeds, and people who know things. The two things you cannot make again from nothing.' }
  ],
  moral: 'The smallest thing that asks you for help may be the thing that carries you.',
  source: 'The Matsya avatara as told in the Matsya Purana, the Bhagavata Purana (Canto 8) and, in an earlier form, in the Shatapatha Brahmana, where Manu and the fish already appear.'
},

/* ============================================================= 2 · KURMA === */
{
  id: 'dv.kurma',
  collection: 'dashavatara',
  badge: 'katha',
  title: 'The Tortoise Under the Mountain',
  hook: 'Devas on one side, asuras on the other, and a whole mountain used as a stirring stick. It sank.',
  hero: 'kurma',
  cast: ['kurma', 'vishnu', 'bali', 'indra', 'mithu'],
  minutes: 5,
  words_hi: [['कछुआ', 'kachhua', 'tortoise'], ['समुद्र', 'samudra', 'ocean'], ['पर्वत', 'parvat', 'mountain']],
  scenes: [
    { art: ['indra', 'bali'], who: null,
      text: 'The devas had lost their strength. Somewhere at the bottom of the ocean of milk lay amrita, the nectar that ends dying — but the ocean does not simply hand things over. It would have to be churned, the way milk is churned for butter, and no one side was strong enough to churn an ocean.' },
    { art: ['bali', 'indra'], who: 'mithu', mood: 'think',
      text: 'So the devas went to the asuras. Their half-brothers. The ones they were usually against. And the asuras said yes.' },
    { art: ['kurma'], who: null,
      text: 'For a churning stick they took Mount Mandara. For a rope they took Vasuki, the great serpent, wound around the mountain — asuras holding the head, devas holding the tail. And they pulled, one side and then the other, and the mountain turned in the sea.' },
    { art: ['kurma'], who: null, mood: 'sad',
      text: 'And the mountain began to sink. There was nothing under it. It was pushing itself down into the soft floor of the ocean, and the whole enormous effort was about to end in mud.',
      ask: {
        q: 'A mountain is sinking into the seabed. What could possibly hold it up?',
        options: ['A bigger mountain', 'Something enormous, patient and flat-backed', 'A very long rope'],
        answer: 1,
        right: 'A tortoise. Vishnu came down as Kurma and put his shell under the whole mountain.',
        wrong: 'A tortoise, as it turns out. Vishnu came down as Kurma and took the mountain on his shell.'
      } },
    { art: ['kurma'], who: null, mood: 'wow',
      text: 'Vishnu came down as Kurma, a tortoise the size of an island, and settled under Mandara, and held. The mountain stopped sinking. The churning went on — for a very long time, with the serpent-rope creaking and both sides heaving.' },
    { art: ['kurma', 'lakshmi'], who: null,
      text: 'And the ocean began to give things up. A wish-granting cow. A white horse. A white elephant. A tree that flowers forever. The moon. Lakshmi herself rose out of it. And at last, the amrita.' },
    { art: ['bali', 'indra'], who: 'mithu', mood: 'think',
      text: 'Then, of course, both sides wanted all of it, and that argument is a story of its own. But hold on to this bit: the devas could not do it alone. Neither could the asuras. Every good thing that came out of that ocean came out because two sides who did not like each other pulled the same rope.' },
    { art: ['kurma'], who: 'mithu',
      text: 'And the one holding everything up said nothing at all, the whole time, from underneath.' }
  ],
  moral: 'The one who carries the weight is often the one you cannot see.',
  source: 'The Samudra Manthan and the Kurma avatara as told in the Bhagavata Purana (Canto 8), the Vishnu Purana and the Mahabharata’s Adi Parva. The list of treasures raised from the ocean varies between tellings.'
},

/* ============================================================ 3 · VARAHA === */
{
  id: 'dv.varaha',
  collection: 'dashavatara',
  badge: 'katha',
  title: 'The Boar Who Lifted the Earth',
  hook: 'The whole world sank to the bottom of the sea. Somebody had to go down and get it.',
  hero: 'varaha',
  cast: ['varaha', 'hiranyaksha', 'mithu'],
  minutes: 4,
  words_hi: [['पृथ्वी', 'prithvi', 'earth'], ['सूअर', 'suar', 'boar'], ['गहरा', 'gehra', 'deep']],
  scenes: [
    { art: ['hiranyaksha'], who: null,
      text: 'Hiranyaksha was an asura of enormous strength, and he was proud of it in the way that strong people sometimes are — he wanted somewhere to put it. So he took the whole earth and carried it down under the cosmic ocean, and left it there, and dared anyone to come and take it back.' },
    { art: ['varaha'], who: null, mood: 'think',
      text: 'Now think about the shape of that problem. The earth is not on the surface. It is at the very bottom, in the dark, under all the water there is. You do not need someone who can fight. You need someone who can DIG.' },
    { art: ['varaha'], who: null, mood: 'wow',
      text: 'And Vishnu came down as Varaha — a boar. Which sounds like a strange choice until you have watched a boar work. A boar’s whole body is built around a snout and two tusks that turn earth over. He went into the water like a thrown stone.',
      ask: {
        q: 'Why a boar, of all the shapes he could have taken?',
        options: ['Because boars are frightening', 'Because a boar is made for digging and lifting earth', 'Because boars can breathe under water'],
        answer: 1,
        right: 'Exactly. The form fits the job. That is true of every one of the ten.',
        wrong: 'Because a boar is a digging animal — a snout and two tusks made for turning earth over. In these stories the form always fits the job.'
      } },
    { art: ['varaha', 'hiranyaksha'], who: null,
      text: 'Hiranyaksha was waiting for him down there, and they fought — a long fight, between two who were both genuinely mighty. The story does not sneer at Hiranyaksha. It says he was a worthy opponent, and it means it.' },
    { art: ['varaha'], who: null, mood: 'wow',
      text: 'And then Varaha put his tusks under the earth and lifted. Up through all that dark water, up and up, with the whole world balanced on two tusks — and set it back down gently on the surface where it belonged.' },
    { art: ['varaha'], who: 'mithu', mood: 'think',
      text: 'You can still see this one carved into rock. At Udayagiri in Madhya Pradesh there is a Varaha cut into a cliff about sixteen hundred years ago, huge, with the earth lifted on his shoulder. People have been telling this story for a very long time.' },
    { art: ['varaha'], who: 'mithu',
      text: 'And the shape of it never changes: the world got lost somewhere deep, and somebody was willing to go all the way down after it.' }
  ],
  moral: 'When something precious is lost in the deep, what you need is not the strongest — it is the one built to dig.',
  source: 'The Varaha avatara as told in the Bhagavata Purana (Canto 3), the Vishnu Purana and the Varaha Purana. The rock-cut Varaha panel at Udayagiri Caves, Madhya Pradesh, is dated to the early fifth century CE by an inscription at the site.'
},

/* ========================================================= 4 · NARASIMHA === */
{
  id: 'dv.narasimha',
  collection: 'dashavatara',
  badge: 'katha',
  title: 'Not Day, Not Night, Not Inside, Not Outside',
  hook: 'A king made himself almost impossible to harm. Almost. His own son had already found the gap.',
  hero: 'narasimha',
  cast: ['narasimha', 'prahlada', 'hiranyakashipu', 'mithu'],
  minutes: 5,
  words_hi: [['वरदान', 'vardaan', 'a boon'], ['खंभा', 'khambha', 'pillar'], ['भक्त', 'bhakt', 'a devoted one']],
  scenes: [
    { art: ['hiranyakashipu'], who: null,
      text: 'Hiranyakashipu was an emperor of the asuras, and after long, long effort he was granted a boon — and he had thought about the wording very carefully indeed. He asked that he not be killed by day nor by night; not indoors nor outdoors; not on the ground nor in the sky; not by man nor by animal; not by any weapon.' },
    { art: ['hiranyakashipu'], who: 'mithu', mood: 'think',
      text: 'Read that again. It is not a stupid wish. It is a very clever one — he has closed every door he can think of. Which is exactly what makes the story interesting.' },
    { art: ['prahlada'], who: null,
      text: 'And then his own small son, Prahlada, turned out to love Vishnu. Quietly, completely, and without any argument about it. His father could not understand it, and the more he tried to shake it out of the boy the calmer the boy became.' },
    { art: ['prahlada', 'hiranyakashipu'], who: 'hiranyakashipu',
      text: '"Where is this Vishnu of yours, then?" his father demanded at last, furious. "Show me. Is he in this hall? Is he in this pillar?"' },
    { art: ['prahlada'], who: 'prahlada',
      text: '"He is in the pillar," said Prahlada. "He is everywhere. There is nowhere he is not."',
      ask: {
        q: 'His father is about to strike the pillar. What is Prahlada risking here?',
        options: ['Nothing — he knows exactly what will happen', 'Everything. He is a small boy telling a furious emperor no', 'A telling-off'],
        answer: 1,
        right: 'That is the heart of it. His courage is real precisely because he could not know.',
        wrong: 'Everything. He is a small boy saying no to the most powerful person alive — and that is what makes it brave rather than easy.'
      } },
    { art: ['narasimha'], who: null, mood: 'wow',
      text: 'The emperor struck the pillar. And out of it came a form that was neither a man nor an animal — a lion’s head on a man’s body, Narasimha. He took Hiranyakashipu at twilight, which is not day and not night. On a threshold, which is not indoors and not outdoors. Across his lap, which is not the ground and not the sky. With his claws, which are not a weapon.' },
    { art: ['narasimha', 'prahlada'], who: 'mithu', mood: 'think',
      text: 'Every single door, and the story walks through the gap between them. That is why children remember this one — it is a riddle, and the riddle is the whole point.' },
    { art: ['narasimha', 'prahlada'], who: null,
      text: 'And then the terrible form went quiet, because Prahlada came and stood in front of it, unafraid. The stories say the boy’s calm was the only thing that settled him. Narasimha is worshipped as a protector — the one who arrives when a promise has to be kept.' },
    { art: ['prahlada'], who: 'mithu',
      text: 'One last thing worth carrying. Prahlada was an asura, son of an asura, and he is one of the best-loved devotees in all of these stories. Asura has never meant evil. It has only ever meant which family you were born into.' }
  ],
  moral: 'A promise made carefully is still a promise. And the bravest person in this story is the smallest one in it.',
  source: 'The Narasimha avatara and the Prahlada narrative as told in the Bhagavata Purana (Canto 7), the Vishnu Purana and the Narasimha Purana. The violence of the killing is standard in the tradition and is deliberately kept offstage here for this age band.'
},

/* ============================================================ 5 · VAMANA === */
{
  id: 'dv.vamana',
  collection: 'dashavatara',
  badge: 'katha',
  title: 'Three Steps, and a King Who Kept His Word',
  hook: 'A small boy asks a great king for three paces of land. The king says yes. He should have counted whose paces.',
  hero: 'vamana',
  cast: ['vamana', 'bali', 'shukracharya', 'mithu'],
  minutes: 5,
  place: ['IN-KL'],
  words_hi: [['वचन', 'vachan', 'a given word'], ['दान', 'daan', 'a giving'], ['तीन', 'teen', 'three']],
  scenes: [
    { art: ['bali'], who: null,
      text: 'Mahabali was an asura king, and he was a good one. That is not a twist in this story; it is the starting point. Under Bali nobody lied, nobody was hungry, nobody was cheated, and nobody locked a door. His people adored him. They still do.' },
    { art: ['bali'], who: 'mithu', mood: 'think',
      text: 'He was also the most generous man alive. He had made a vow: at his great sacrifice, whoever asked him for anything would get it. Anything. He would not send a single person away.' },
    { art: ['vamana', 'bali'], who: null,
      text: 'And into the sacrifice walked a small brahmin boy, carrying a wooden umbrella. Vamana. He asked for three paces of land — as much ground as he could cover in three steps.' },
    { art: ['shukracharya', 'bali'], who: 'shukracharya', mood: 'think',
      text: 'Bali’s teacher, the great guru Shukracharya, saw what was standing in front of them and went white. "My king. Do not promise this one. That is not a child."' },
    { art: ['bali'], who: 'bali',
      text: '"He has asked," said Bali. "And I said that whoever asks will receive. Guruji — if I break my word to a small boy asking for three steps, what exactly have I been all these years?"',
      ask: {
        q: 'Bali has been warned. He can still say no. Should he?',
        options: ['Yes — he has been warned, and a warning changes things', 'No. A promise you only keep when it is safe is not a promise'],
        answer: 1,
        right: 'That is Bali’s own answer, and it is why he is loved rather than pitied.',
        wrong: 'Bali did not think so. A promise you keep only when it costs nothing was never a promise — and that is why he is remembered with love, not pity.'
      } },
    { art: ['vamana'], who: null, mood: 'wow',
      text: 'So Bali poured the water that seals a gift. And the small boy began to grow. One step covered the whole earth. The second step covered the whole sky. And there was nowhere left for the third.' },
    { art: ['bali', 'vamana'], who: 'bali',
      text: 'Bali did not argue, and he did not run. He knelt, and he bowed his head, and he said: "There is one place left. Put your third step here."' },
    { art: ['bali', 'vamana'], who: 'mithu', mood: 'think',
      text: 'And that — not the growing, not the two enormous steps — is the moment the whole story is built around. He was not tricked into keeping his word. He kept it after he knew.' },
    { art: ['bali'], who: null,
      text: 'So Vamana set his foot on Bali’s head and sent him down to rule another realm. But he granted him one thing: once every year, Mahabali may come home and see his people.' },
    { art: ['bali'], who: 'mithu', mood: 'wow',
      text: 'And in Kerala they have been getting ready for that visit for centuries. Onam is Mahabali coming home. Flower carpets at every door, a feast on a banana leaf, boat races on the backwaters — all of it to show him that his people are still doing well. An asura king. Welcomed home by an entire state, every single year, with flowers.' }
  ],
  moral: 'A promise you keep only when it is cheap was never a promise. Bali kept his after he knew the cost.',
  source: 'The Vamana avatara and the Bali narrative as told in the Bhagavata Purana (Canto 8), the Vamana Purana and the Vishnu Purana. Onam is celebrated across Kerala in the Malayalam month of Chingam as the annual homecoming of Mahabali; the festival is the Government of Kerala’s official state festival.'
},

/* ======================================================= 6 · PARASHURAMA === */
{
  id: 'dv.parashurama',
  collection: 'dashavatara',
  badge: 'katha',
  title: 'The Sage Who Carried an Axe',
  hook: 'A man of learning, given a weapon. The stories are honest about what that cost him.',
  hero: 'parashurama',
  cast: ['parashurama', 'shiva', 'mithu'],
  minutes: 4,
  place: ['IN-KL', 'IN-GA'],
  words_hi: [['परशु', 'parashu', 'an axe'], ['क्रोध', 'krodh', 'anger'], ['क्षमा', 'kshama', 'forgiveness']],
  scenes: [
    { art: ['parashurama'], who: null,
      text: 'Parashurama was born into a family of sages, and he was a scholar before he was anything else. The axe he is named for — parashu — was given to him by Shiva. That is an unusual combination, and the stories know it: a man trained to think, holding a weapon.' },
    { art: ['parashurama'], who: null, mood: 'sad',
      text: 'Kings in his time had begun to take whatever they wanted from whoever had it. One of them robbed his family and killed his father. And Parashurama, who had been raised to argue with words, picked up the axe instead.' },
    { art: ['parashurama'], who: 'mithu', mood: 'think',
      text: 'What follows is the part of the Dashavatara that grown-ups tell most carefully, and I am going to tell it the same way. He went after those kings for a very long time. The stories do not say he was right. They say he could not stop.' },
    { art: ['parashurama'], who: null,
      text: 'His own teachers eventually told him what he already knew: that anger, even anger that began as justice, becomes its own thing after a while and stops listening to the reason that started it.',
      ask: {
        q: 'His anger began as a fair one. Does that make where it ended fair too?',
        options: ['Yes — it started fair, so it stayed fair', 'No. A fair beginning does not make everything after it fair'],
        answer: 1,
        right: 'That is what the story is for. It is the one avatara told as a warning rather than a rescue.',
        wrong: 'The story says no. A fair beginning does not make everything that comes after it fair — which is exactly why this one is remembered as a warning.'
      } },
    { art: ['parashurama'], who: null,
      text: 'So he stopped. He gave away all the land he had taken — every last field of it — and went to the mountains, and spent the rest of an extremely long life teaching. He is one of the ones the stories say has not died. He is simply somewhere, still, being quiet.' },
    { art: ['parashurama'], who: 'mithu',
      text: 'Along the western coast — in Kerala, in Konkan, in Goa — there are old traditions that say Parashurama threw his axe into the sea and the sea drew back, and that is the land people live on there. Coastal families have been telling that about their own ground for centuries.' },
    { art: ['parashurama'], who: 'mithu', mood: 'think',
      text: 'Ten comings-down, and one of them is about a good man who could not put a weapon down for far too long. It would have been easy to leave that one out. Nobody did.' }
  ],
  moral: 'Anger that begins as justice does not stay justice on its own. Someone has to choose to put it down.',
  source: 'The Parashurama narrative as told in the Bhagavata Purana, the Vishnu Purana and the Mahabharata, where he also appears as a teacher of Bhishma, Drona and Karna. The traditions of the western coastal land being reclaimed by Parashurama are recorded in the Kerala Mahatmyam and the Sahyadrikhanda of the Skanda Purana and are held as origin traditions in Kerala, Konkan and Goa.'
},

/* ============================================================== 7 · RAMA === */
{
  id: 'dv.rama',
  collection: 'dashavatara',
  badge: 'katha',
  title: 'The Seventh: the One Who Kept the Rules',
  hook: 'This one is so big it has its own book. Here is why it stands seventh in the ten.',
  hero: 'rama',
  cast: ['rama', 'sita', 'hanuman', 'mithu'],
  minutes: 3,
  place: ['IN-UP'],
  words_hi: [['मर्यादा', 'maryada', 'the proper limit'], ['वनवास', 'vanvaas', 'life in the forest'], ['धनुष', 'dhanush', 'a bow']],
  scenes: [
    { art: ['rama'], who: 'mithu',
      text: 'The seventh coming-down is Rama, and his story is not a story in this shelf — it is a whole book, twenty-four nights of it, waiting for you under The Ramayana. So here we will only ask the question this collection asks of each of the ten: what shape did he come down in, and why that one?' },
    { art: ['rama'], who: null, mood: 'think',
      text: 'Matsya was a fish. Kurma was a tortoise. Varaha a boar, Narasimha half a lion, Vamana a small boy who grew. Rama is different. Rama is entirely, completely a man. No extra arms. No growing. Nothing that a person could not be.' },
    { art: ['rama', 'sita'], who: null,
      text: 'And the whole story turns on that. He is asked to go into the forest for fourteen years by a promise his father made, and he goes — as a man goes, on foot, with nothing. He does not fix it from above. He walks it.' },
    { art: ['rama'], who: 'mithu', mood: 'think',
      text: 'The word people use for him is maryada — the proper limit, the line you keep to. Maryada Purushottama: the one who kept within the line. It is not a word about power at all. It is a word about restraint.',
      ask: {
        q: 'Why might the seventh coming-down be an ordinary human being?',
        options: ['Because it is easier to draw', 'Because the hard thing this time was not strength — it was keeping to what is right', 'Because he had run out of animals'],
        answer: 1,
        right: 'Yes. A fish can hold a boat. Only a person can be asked to keep their word for fourteen years.',
        wrong: 'Because what was needed this time was not strength. A fish can hold up a boat; only a person can keep a promise for fourteen years in a forest.'
      } },
    { art: ['hanuman', 'rama'], who: 'mithu',
      text: 'Go and read it properly when you are ready. It is long, and nobody finishes it in a night — your grandparents are still not finished.' }
  ],
  moral: 'Seventh in the ten, and the first one who is simply a person. That is the point of him.',
  source: 'Rama as the seventh avatara in the standard Dashavatara lists of the Bhagavata, Garuda and Agni Puranas. The narrative itself is told in this app under The Ramayana, following Valmiki with the regional retellings noted there.'
},

/* =========================================================== 8 · KRISHNA === */
{
  id: 'dv.krishna',
  collection: 'dashavatara',
  badge: 'katha',
  title: 'The Eighth: the One Who Would Not Be Serious',
  hook: 'A baby who stole butter, a boy who lifted a hill, a friend who drove a chariot. All the same person.',
  hero: 'krishna',
  cast: ['krishna', 'balarama', 'mithu'],
  minutes: 4,
  place: ['IN-UP', 'IN-GJ'],
  words_hi: [['माखन', 'makhan', 'butter'], ['बांसुरी', 'bansuri', 'a flute'], ['सखा', 'sakha', 'a friend']],
  scenes: [
    { art: ['krishna'], who: null,
      text: 'The eighth comes down as a baby, in a prison, on a night of pouring rain, and is carried across a flooded river to safety in a cowherd village. And then he does something none of the others do. He stays a child, and he is naughty.' },
    { art: ['krishna'], who: 'mithu', mood: 'think',
      text: 'That is genuinely unusual. Matsya does not play. Kurma does not tease anyone. But Krishna steals butter, unties calves, hides the milkmaids’ clothes in a tree, and is caught constantly and forgiven constantly. Whole libraries of songs are about nothing but this.' },
    { art: ['krishna'], who: null,
      text: 'When the village was going to hold its usual grand offering to Indra, the deva of rain, Krishna asked why. Why not to the hill that actually feeds the cows, and the cows themselves? So they did — and Indra, insulted, sent a storm to drown them.' },
    { art: ['krishna'], who: null, mood: 'wow',
      text: 'And a boy lifted the hill Govardhan on one finger and held it up like an umbrella for seven days, and everyone — every person, every cow — stood under it and stayed dry.',
      ask: {
        q: 'What is a small boy holding up a hill actually saying to a great deva?',
        options: ['That he is stronger', 'That the ones who feed you deserve your thanks, whoever is powerful', 'That it rains too much'],
        answer: 1,
        right: 'Yes — and Indra himself comes down at the end of that story and says so.',
        wrong: 'That the ones who actually feed you deserve the thanks — the hill, the cows, the people. Indra comes down at the end of that story and agrees.'
      } },
    { art: ['krishna', 'balarama'], who: null,
      text: 'He grows up. He leaves the village, which is its own sadness and its own set of songs. He founds a city at Dwarka on the coast of Gujarat. And in the Mahabharata he refuses to fight at all — he drives Arjuna’s chariot instead, and talks to him, and that conversation became the Bhagavad Gita.' },
    { art: ['krishna'], who: 'mithu', mood: 'think',
      text: 'Baby, thief, hill-lifter, flute player, friend, charioteer, teacher. Not stages he passed through and left behind — people worship every one of them at the same time, in different houses, in different states, today.' },
    { art: ['krishna'], who: 'mithu',
      text: 'His brother Balarama, with the plough, is standing right beside him in most of these stories. Hold on to that — you will meet him next, and in many families he is counted in the ten himself.' }
  ],
  moral: 'The eighth came down and refused to be solemn about it. That is not a smaller kind of holiness.',
  source: 'Krishna as the eighth avatara in the standard Dashavatara lists. The Vrindavan narratives, Govardhan and Dwarka are told in the Bhagavata Purana (Canto 10), the Harivamsha and the Vishnu Purana; the Gita is Bhishma Parva of the Mahabharata.'
},

/* ============================================ 9 · THE CONTESTED NINTH ====== */
{
  id: 'dv.the-ninth',
  collection: 'dashavatara',
  badge: 'katha',
  needs_review: true,
  title: 'The Ninth, Which Not Everyone Counts the Same Way',
  hook: 'Ask two families who the ninth is and you may get two answers. Both are honest. Here is why.',
  hero: 'balarama',
  cast: ['balarama', 'buddha', 'mithu'],
  minutes: 4,
  words_hi: [['हल', 'hal', 'a plough'], ['करुणा', 'karuna', 'compassion'], ['परंपरा', 'parampara', 'a tradition handed down']],
  scenes: [
    { art: ['balarama', 'buddha'], who: 'mithu',
      text: 'Every collection has one page where the honest thing to say is "people differ." This is that page, and it comes ninth.' },
    { art: ['balarama'], who: null,
      text: 'In many traditions — very widely in Bengal and Odisha, and among Gaudiya Vaishnavas — the ninth is BALARAMA. Krishna’s elder brother: fair-skinned where Krishna is dark, carrying a plough, immensely strong, and famous for a temper that goes off like weather and clears just as fast.' },
    { art: ['balarama'], who: 'mithu', mood: 'think',
      text: 'The plough is not a decoration. Balarama is the farmer among them — the one whose weapon is the tool that turns a field over. At Puri in Odisha he rides out in the Rath Yatra beside Jagannath and Subhadra every year, in his own chariot, in front of enormous crowds.' },
    { art: ['buddha'], who: null,
      text: 'And in many other Hindu traditions the ninth is THE BUDDHA — Siddhartha Gautama, who left a palace, and looked hard at why living hurts, and taught a way through it that has since gone right around the world.' },
    { art: ['buddha'], who: 'mithu', mood: 'think',
      text: 'Now here is the part that matters most, and I want to say it plainly. Buddhists themselves do not describe the Buddha that way. In Buddhism he is not a god’s coming-down at all: he is a human being who woke up, and whose whole teaching is that you can do the same. That is not a small difference and it should not be smoothed over.',
      ask: {
        q: 'Two traditions describe the same person differently. What is the honest thing to do?',
        options: ['Decide which one is correct', 'Say what each tradition holds, and say whose it is', 'Leave the whole thing out'],
        answer: 1,
        right: 'That is what this page is trying to do. Whose belief it is matters as much as what the belief says.',
        wrong: 'Say what each tradition holds, and name whose it is. Leaving it out would be its own kind of untruthfulness, and picking a winner is not ours to do.'
      } },
    { art: ['balarama', 'buddha'], who: 'mithu',
      text: 'So: some lists say Balarama. Some say the Buddha. Some count both and leave someone else out. Some traditions count a local figure instead — in parts of Maharashtra and Karnataka you will hear Vithoba named, and in Odisha, Jagannath.' },
    { art: ['vishnu'], who: 'mithu',
      text: 'Ask at home which ninth your family counts. That is not a trick question and there is no right answer to bring back — it is just a real thing to know about your own people. Then come back for the tenth, which nobody has met yet.' }
  ],
  moral: 'When two traditions differ, the honest thing is to say so — and to name whose belief is whose.',
  source: 'The Balarama-as-ninth list is standard in Gaudiya Vaishnavism and in much of eastern India; the Buddha-as-ninth list appears in the Bhagavata Purana, the Agni Purana and the Garuda Purana. Buddhist tradition does not accept the avatara framing. Vithoba and Jagannath are identified with Vishnu in the regional traditions of Maharashtra/Karnataka and Odisha respectively. Balarama’s chariot at the Puri Rath Yatra is Taladhwaja. needs_review: this page describes a living difference between two faiths about the same figure and requires named human review before publish (docs/05 §6).'
},

/* ============================================================= 10 · KALKI == */
{
  id: 'dv.kalki',
  collection: 'dashavatara',
  badge: 'katha',
  title: 'The Tenth, Who Has Not Come Yet',
  hook: 'Nine have been. One has not. This is the only story in the collection told in the future tense.',
  hero: 'kalki',
  cast: ['kalki', 'mithu'],
  minutes: 3,
  words_hi: [['भविष्य', 'bhavishya', 'the future'], ['घोड़ा', 'ghoda', 'a horse'], ['आशा', 'aasha', 'hope']],
  scenes: [
    { art: ['kalki'], who: 'mithu',
      text: 'Every story you have read in this collection happened, in the telling — a fish came, a tortoise held, a boy took three steps. This one has not. The tenth is still ahead.' },
    { art: ['kalki'], who: null,
      text: 'Kalki is spoken of as arriving at the end of a long, tired age, on a white horse, with a bright sword — to end what has gone wrong and start the whole thing over, clean.' },
    { art: ['kalki'], who: 'mithu', mood: 'think',
      text: 'And now I have to be careful with you, because this is exactly the sort of story people are tempted to add to. When is it? Nobody knows. The tradition does not fix a date, and I am not going to invent one for you. Anyone who tells you they know the year is telling you something the stories do not say.' },
    { art: ['kalki'], who: null,
      text: 'What the stories do describe is the age before he comes: a time when promises stop meaning much, when people take more than they give, when the strong stop feeling they owe anybody anything.',
      ask: {
        q: 'If that is the age, what is the story really asking of the people living in it?',
        options: ['To wait quietly for someone to come and fix it', 'To be the kind of person the age is short of'],
        answer: 1,
        right: 'That is the reading most teachers give it. A story about someone coming is rarely a story about waiting.',
        wrong: 'Most teachers read it the other way round. A story about rescue is very rarely an instruction to sit still.'
      } },
    { art: ['kalki'], who: 'mithu',
      text: 'Ten comings-down. A fish, a tortoise, a boar, a lion-form, a small boy, a sage with an axe, a prince who kept his word, a child who would not be solemn, a ninth that different families count differently — and one still to come, on a white horse, at a time nobody has been told.' },
    { art: ['vishnu'], who: 'mithu', mood: 'think',
      text: 'And the whole set says the same thing over and over in different shapes: when the world tips too far, it does not get fixed from a long way off. Something comes down INTO it. Usually small. Usually not what anybody was expecting.' }
  ],
  moral: 'The last one has not happened. Which makes it the only one in the collection that is still up to us.',
  source: 'The Kalki avatara as described in the Bhagavata Purana (Canto 12), the Vishnu Purana and the Kalki Purana. No date is given here because the tradition fixes none; descriptions of the Kali Yuga preceding him are as given in those texts.'
}

];

window.IND_COLLECTIONS_DASHAVATARA = [
  { id: 'dashavatara', name: 'The Ten Avatars', avatar: 'vishnu',
    note: 'Ten times, the stories say, someone came down — as a fish, a tortoise, a boar, a boy. Which ten depends on who you ask, and this collection says so.' }
];
