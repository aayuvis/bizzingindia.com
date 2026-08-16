/* Bizzing India — story content, Northeast & Himalaya tranche B.

   Same shape as data-stories.js / data-stories-regional.js / data-stories-more.js,
   on its own globals so every set can be loaded and merged independently:
   window.IND_STORIES_NE_B, window.IND_COLLECTIONS_NE_B.

   Twenty-eight tales: Manipur, Nagaland, Arunachal Pradesh and Sikkim, seven each.
   Every story names the specific people and tradition it comes from — Meitei, Ao,
   Angami, Adi, Nyishi, Galo, Apatani, Monpa, Lepcha, Bhutia. These are distinct
   peoples with distinct languages; nothing here is "a Northeast tale."

   Indigenous faiths — Donyi-Polo of the Tani peoples, the Meitei tradition of the
   umang lai, the Lepcha reverence for Kangchenjunga — are presented from the
   inside, with the same dignity as every other faith in this app (docs/05 §4).

   Softening notes, declared per story in its own source line rather than quietly
   rewriting the tradition: Sandrembi's tale is far harsher in the old tellings;
   the Khamba-Thoibi epic runs past the wedding into sorrow and this telling stops
   at the feast; the parting of the sun-sisters Bomong and Bong is gentler here
   than in the old Adi tellings.

   Words in Meitei, Lepcha, Adi and other languages are glossed warmly in the
   story text itself; words_hi stays Hindi, as everywhere else in the app.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is said / told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_NE_B = [

/* ============================================================ MANIPUR ====== */
{
  id: 'fk.sandrembi',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'Sandrembi and the Grey Dove',
  hook: 'Two sisters, one pond, and a mother who was never quite gone.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_tortoise', 'pt_crow'],
  minutes: 5,
  place: ['IN-MN'],
  words_hi: [['बहन', 'behen', 'sister'], ['तालाब', 'taalaab', 'pond'], ['कबूतर', 'kabootar', 'dove']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In a Meitei village in Manipur lived two girls under one roof: Sandrembi, and her stepsister Chaisra. It was the sort of house where one girl got the new phanek — the wrap that Meitei women wear — and the other girl got the mending. Sandrembi got the mending.' },
    { art: ['courtier', 'pt_tortoise'], who: null, mood: 'sad',
      text: 'Sandrembi\'s own mother was gone. But in the pond behind the house there was a tortoise who had not been there before — and who knew Sandrembi\'s name, and her mother\'s voice, and everything a mother knows. Sandrembi went to the pond every evening and told her the whole day.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'One morning the king of that country came by the water while the girls were out with their fishing baskets. Chaisra pushed to the front at once. Sandrembi did not notice him at all — she was busy giving half her catch to an old woman who had caught nothing, which was a thing she simply did.' },
    { art: ['courtier', 'pt_tortoise'], who: 'pt_tortoise',
      text: 'The king noticed. Kings notice more than they let on. And when he asked for Sandrembi, she went first to the pond. "Go," said the tortoise from the water. "And when you are a queen, stay the girl who shared the fish. That is all I have ever wanted of you."' },
    { art: ['guard'], who: null, mood: 'sad',
      text: 'Sandrembi was a good queen, and Chaisra\'s mother could not bear it. Jealousy did what jealousy does: it found a way. One morning the queen was simply gone, and Chaisra sat in her place wearing her clothes — and over the palace a grey dove flew in circles and would not leave.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      text: 'The king felt the wrongness before he could name it. The woman in the queen\'s clothes did not hum the little pond song. She did not send fish to old women. She looked like the queen the way a picture looks like a person.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      text: 'And every day the grey dove came to his window, and sang, and would not be shooed.',
      ask: {
        q: 'A dove keeps coming to the king\'s window and it will not go away. What should he do?',
        options: ['Shoo it — it is only a bird', 'Listen to it properly', 'Send it to the kitchens'],
        answer: 1,
        right: 'He listened. And inside the song there were words — small, far-off words, like someone calling across water.',
        wrong: 'He did the wiser thing: he listened properly. And inside the song there were words — small and far-off, like someone calling across water.'
      } },
    { art: ['pt_crow', 'courtier'], who: null, mood: 'wow',
      text: 'It was the pond song. The one his queen used to hum with her hands in the rice. He held out his wrist and the dove came down onto it, light as a held breath, and looked at him with an eye he knew.' },
    { art: ['courtier', 'pt_tortoise'], who: null,
      text: 'He carried the dove to the pond behind her old house. The tortoise rose in the dark water and the dove came down to meet her, and between the mother in the water and the love on the bank, the shape came right again — and Sandrembi stood on the grass in the morning sun.' },
    { art: ['courtier'], who: null,
      text: 'Chaisra and her mother went home. The old tellings say much more about what happened to them, and it is harsh, and I do not tell it that way. They went home. That is enough.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Sandrembi is the girl every Meitei grandmother measures kindness by. And the queen went on sharing her fish, exactly as promised — because being turned into a dove and back had not changed anything that mattered.' }
  ],
  moral: 'Kindness keeps its shape. Whatever shape the world puts you in, it shows through.',
  source: 'Sandrembi and Chaisra — a Meitei phunga wari (fireside tale) of Manipur, one of the best-loved of them. The old tellings are far harsher, to Sandrembi and to Chaisra both; this telling is softened, and says so.'
},

{
  id: 'fk.khamba-thoibi',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'Khamba, Thoibi and the Great Bull',
  hook: 'An orphan boy, a princess, a wrestling match and one enormous bull. Moirang still sings about it.',
  hero: 'guard',
  cast: ['guard', 'courtier', 'pt_bull'],
  minutes: 5,
  place: ['IN-MN'],
  words_hi: [['कुश्ती', 'kushti', 'wrestling'], ['साँड़', 'saand', 'bull'], ['वीर', 'veer', 'brave']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'On the shore of the great Loktak lake stands Moirang, which in the old days was a kingdom of its own, with its own god — Thangjing — and its own singers. The singers play the pena, a little fiddle with a voice like a mosquito and a memory a thousand years long. This is the story they sing most.' },
    { art: ['guard'], who: null,
      text: 'Khamba had no father and no mother. He had one sister, Khamnu, who raised him on next to nothing and absolutely no nonsense, and he grew up poor, polite, and strong enough to carry a boat on his back — which in Moirang people noticed.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'Thoibi was the princess of Moirang, and she met Khamba at the lake, the way half the stories in Manipur begin. They talked about nothing much. Then they talked about everything. That part of the story takes the pena singers a whole evening, and they do not hurry it.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'But another man wanted to marry Thoibi — Nongban, who was rich, and used to winning. So it came to a contest, because Moirang settled things with contests, and Moirang took its sport seriously: you won, you lost, you bowed, and you ate together after.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'At the festival of Thangjing they wrestled. Drums, dust, the whole town on its feet. Nongban was strong and knew it. Khamba was strong and stood very still, and waited, and when the moment came he took the grip, turned his hips, and set Nongban down on the grass like a full water pot — firmly, and spilling nothing.' },
    { art: ['courtier'], who: null,
      text: 'Nongban got up and dusted himself off. But there was one test left, and it was not a game. In the hills above Moirang there was a bull called Kao — enormous, wild for years, and too much for every rope and every loud brave man who had gone up after him.' },
    { art: ['guard', 'pt_bull'], who: null, mood: 'think',
      text: 'Khamba stood at the edge of the trees and looked at the bull, and the bull turned and looked at him. And Khamba was carrying something up that hill that nobody else had ever brought.',
      ask: {
        q: 'Every man who has faced the bull has faced it with ropes and shouting. What has Khamba got that they had not?',
        options: ['Stronger ropes', 'His father\'s name', 'A faster horse'],
        answer: 1,
        right: 'Yes. Long ago, before it went wild, the bull had belonged to Khamba\'s father.',
        wrong: 'Something better than any of that. Long ago, before it went wild, the bull had belonged to Khamba\'s father.'
      } },
    { art: ['guard', 'pt_bull'], who: 'guard',
      text: 'He walked out slow, hands open, no rope showing. And he spoke his father\'s name, and the old calling words his sister had taught him, the ones the bull had heard every morning as a calf. The great ears turned. The great head came down. Kao stood still, remembering.' },
    { art: ['pt_bull', 'guard'], who: null, mood: 'wow',
      text: 'Khamba led him down into Moirang on a slack rope, walking beside him like an old friend, and the town was so quiet you could hear the lake — and then so loud you could not hear anything at all.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Khamba and Thoibi were married in front of the whole of Moirang, with Thoibi in the finest phanek ever woven, and a feast that fed everybody including Nongban. The pena singers were composing before the rice was served.' },
    { art: ['guard'], who: 'mithu',
      text: 'They have been singing it ever since, and the Khamba-Thoibi dance is danced for Thangjing at Moirang to this day. The whole epic is long — it runs on past the wedding, into sorrow. But a telling is allowed to stop at the feast, and this one does.' }
  ],
  moral: 'Strength wins a wrestling match. Remembering who you are — and whose — brings the bull home.',
  source: 'Khamba and Thoibi, the great epic of Moirang, sung in Manipur by Meitei pena singers as part of the Moirang cycle. The full epic runs far past the wedding and ends in sorrow; this telling stops at the feast, and says so.'
},

{
  id: 'fk.loktak-ima',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Lake That Holds Everything Up',
  hook: 'A lake where the islands float, the huts float, and the deer dance on the water. Ask a grandmother why.',
  hero: 'pt_deer',
  cast: ['pt_deer', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-MN'],
  words_hi: [['झील', 'jheel', 'lake'], ['हिरण', 'hiran', 'deer'], ['घास', 'ghaas', 'grass']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'From the hills, Loktak looks like a piece of sky that fell into the valley and decided to stay. It is the biggest lake in the Northeast, and it is scattered all over with rings and cushions of green — phumdi, the Meitei word for them. Floating meadows. Grass and soil and roots, woven into rafts.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'A girl called Sana went out by boat to stay with her grandmother, whose hut stood on one of them — a floating hut on a floating meadow, with a floating vegetable patch by the door. Her grandmother\'s whole house was somewhere slightly different every morning.' },
    { art: ['guard', 'courtier'], who: 'courtier',
      text: '"Abok," said Sana — grandmother — "why do the islands float? Islands are supposed to stay down." Her grandmother went on mending her net. "Because of who the lake is," she said. "We call her Ima Loktak. Ima means mother. A mother holds up what she loves."' },
    { art: ['guard'], who: null,
      text: 'Sana thought about that all day, while the fishers lifted their nets out of water the colour of tea, and the mist walked about between the huts, and the whole village rose and fell very gently, like something breathing.' },
    { art: ['pt_deer'], who: null, mood: 'wow',
      text: 'Then her grandmother took her south, to the end of the lake where the floating meadow is so old and so thick it carries a whole grassland on its back. Keibul Lamjao, it is called — the only floating national park on the earth. And on it lives the sangai.' },
    { art: ['pt_deer'], who: null,
      text: 'The sangai is a deer with antlers like swept branches, found nowhere else in the world but here. And it does not walk the way other deer walk. It steps high and soft and careful, lifting each foot like a dancer — which is why Manipur calls it the dancing deer.',
      ask: {
        q: 'The sangai walks on ground that gives underneath it. Why does it look like it is dancing?',
        options: ['It is showing off', 'It steps lightly so the floating ground will hold it', 'It is frightened of the water'],
        answer: 1,
        right: 'Just so. Light feet on a floating world. The Meitei say you could do worse than learn to live like that.',
        wrong: 'Nothing frightens it here. It steps lightly so the floating ground will hold — light feet on a floating world. You could do worse than learn to live like that.'
      } },
    { art: ['pt_deer', 'guard'], who: 'guard',
      text: '"The old people say the sangai is the tie between us and the land," said her grandmother. "Harm the deer, and you have cut something in yourself. There was a time when so few were left you could count them like family members. Manipur guarded them back, one by one."' },
    { art: ['pt_deer'], who: null,
      text: 'They watched a stag pick his way across the meadow at dusk, the ground swaying under him no more than a boat sways, his feet reading it the whole time. He never once looked down.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The scientists will tell you a phumdi is a mat of roots and soil that breathes with the seasons, sinking and rising. The grandmothers will tell you Ima holds it up. Stand on one at dawn, and I promise you both answers feel true.' }
  ],
  moral: 'Walk lightly on whatever is holding you up — it is holding you up.',
  source: 'Loktak lake and its phumdis, the floating huts of its fishers, and the sangai deer of Keibul Lamjao — from the Meitei fisher tradition of Manipur, where the lake is called Ima Loktak, Mother Loktak. Keibul Lamjao really is the only floating national park in the world.'
},

{
  id: 'fk.sagol-kangjei',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Game That Rode Out of Manipur',
  hook: 'Seven riders, seven ponies, one ball — and the whole world learned it from here.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-MN'],
  words_hi: [['घोड़ा', 'ghoda', 'horse'], ['गेंद', 'gend', 'ball'], ['खेल', 'khel', 'game']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In the middle of Imphal there is a grass field that people call the oldest polo ground in the world. Mapal Kangjeibung, it is named. And the game played on it is older than anybody\'s counting: sagol kangjei — sagol for the pony, kangjei for the stick.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'The Meitei say the game did not begin with people at all. It began with the gods. Marjing, the god of horses, keeper of a winged pony called Samadon Ayangba, brought the game — and the old accounts say the very first match was played by gods, seven a side, before anyone on earth had thought of it.' },
    { art: ['guard'], who: null,
      text: 'Then people played it, on the Manipuri pony — a small, quick, sturdy creature that can turn on a leaf. The pony is honoured in Manipur, and not as a beast of burden. It is not for the plough and not for the cart. It is for the game.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'Seven a side. A ball cut from bamboo root. Cane sticks, a flying gallop, and no argument about whose game it was, because it was everybody\'s — kings played commoners on that ground, and the pony did not care which was which.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      text: 'Then, more than a hundred and fifty years ago, visitors came — British officers, in the eighteen-fifties — and stood at the edge of the field with their mouths open. Grown men on flying ponies, playing a game with more speed in it than anything they had ever brought from home.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'The visitors asked to be taught. And some people in the town said what people always say: it is ours. Keep it.',
      ask: {
        q: 'Strangers want to learn the town\'s own game. What do the players do?',
        options: ['Keep it secret', 'Teach them properly', 'Let them watch but never play'],
        answer: 1,
        right: 'They taught them. A game gets bigger by being given away — and this one went around the entire world.',
        wrong: 'The players decided otherwise. They taught them properly — and the game went around the entire world.'
      } },
    { art: ['courtier'], who: null,
      text: 'The visitors carried it off and called it polo. They made clubs — first near these hills, then in Calcutta, then in England — and from England it spread to every continent there is. Every polo field on earth is a grandchild of that grass in Imphal.' },
    { art: ['guard'], who: null,
      text: 'And on Mapal Kangjeibung they still play it the old way, seven a side, on Manipuri ponies. Above Imphal, on Marjing\'s hill, stands a great statue of a winged pony, looking out over the valley where it all started.' },
    { art: ['guard'], who: 'mithu',
      text: 'So if you ever see polo — on a screen, in a picture, anywhere — you can lean over and say: that rode out of Manipur. Because it did.' }
  ],
  moral: 'A thing shared is not a thing lost. Manipur gave away a game, and now the whole world plays it.',
  source: 'Sagol kangjei, the Manipuri polo of the Meitei people, and the tradition of Marjing, god of horses, with his winged pony Samadon Ayangba. That modern polo spread worldwide from Manipur and Cachar through clubs founded in the 1850s–60s is history; Mapal Kangjeibung in Imphal is called the oldest polo ground in the world.'
},

{
  id: 'fk.tapta',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'Tapta',
  hook: 'The tiger was not afraid of anything in the hills. Then he heard about Tapta.',
  hero: 'pt_lion',
  cast: ['pt_lion', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-MN'],
  words_hi: [['बाघ', 'baagh', 'tiger'], ['छत', 'chhat', 'roof'], ['टप-टप', 'tap-tap', 'drip-drip']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'On the edge of a Meitei village lived an old woman in a hut with a thatch roof, and the thatch had seen better years. One night it rained the way it rains in Manipur — which is to say, as though the sky had decided to move in.' },
    { art: ['pt_lion'], who: null,
      text: 'A tiger came down out of the hills that night to see what he could find, and stopped under the eaves of the hut to get out of the wet. Through the wall he could hear the old woman inside, talking to herself, the way people who live alone do.' },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      text: '"Tiger?" she was saying. "I am not afraid of tiger. Bear? Pff. Elephant? Let him come. It is TAPTA I cannot stand. Tapta gets in everywhere. Tapta finds you wherever you sit. Move the bed and Tapta follows you. Ah — here it comes again — TAPTA!"' },
    { art: ['pt_lion'], who: null, mood: 'think',
      text: 'The tiger went very cold, and it was not the rain. Something that outranked tiger, bear AND elephant. Something that got in everywhere and found you wherever you sat. And it was in the house with her, right now.',
      ask: {
        q: 'The tiger has never heard of Tapta. What is Tapta, actually?',
        options: ['A monster bigger than a tiger', 'The drip coming through the roof', 'A spirit of the hills'],
        answer: 1,
        right: 'That is all it was. Tap… tap… tapta — rain coming through old thatch. The tiger did not know that.',
        wrong: 'Nothing of the kind. It was the drip coming through the thatch — tap, tap, tapta. The tiger did not know that.'
      } },
    { art: ['guard'], who: null,
      text: 'Now, that same black wet night, a thief came creeping to the old woman\'s lean-to, meaning to steal her cow. It was far too dark to see. He felt about, found something big and warm and furry, and — being a thief in a hurry — climbed straight up onto its back to ride it away.' },
    { art: ['pt_lion', 'guard'], who: 'pt_lion', mood: 'wow',
      text: 'Something has LANDED ON MY BACK, thought the tiger. In the dark. Without a sound. It finds you wherever you sit. "TAPTA HAS GOT ME!" — and he went from standing still to full gallop in one heartbeat.' },
    { art: ['guard', 'pt_lion'], who: null,
      text: 'And so they went through the night, flat out: the thief hanging on with both hands thinking, this is the fastest cow in Manipur — and the tiger flying over ditches thinking, Tapta rides me, Tapta rides me, and if I stop it will eat me. Neither one of them dared let go.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'At first light the thief looked down and saw stripes. He made a sound no one has spelled correctly to this day, went straight up into a fig tree, and stayed there until noon. The tiger, feeling the terrible weight leave his back, ran faster — and some say he is running still.' },
    { art: ['courtier'], who: null,
      text: 'The old woman woke to a quiet, rinsed morning. Her cow was exactly where it should be. She never knew she had been guarded all night by the most frightening word in the hills — which was hers.' },
    { art: ['pt_lion'], who: 'mithu',
      text: 'Meitei children ask for Tapta on rainy nights especially, because it is better with the drip actually going. Fear is mostly a thing you have not looked at in the light yet.' }
  ],
  moral: 'The scariest thing in the dark is usually a small thing you have not seen in daylight yet.',
  source: 'Tapta — a Meitei phunga wari (fireside tale) of Manipur, beloved on rainy nights; kin tellings of the "terrible drip" are told across India. Many versions.'
},

{
  id: 'fk.phunga-wari',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Fire Where the Stories Live',
  hook: 'In a Meitei kitchen there is a hearth, and around the hearth there is a rule: this is where the stories happen.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-MN'],
  words_hi: [['चूल्हा', 'chulha', 'hearth'], ['कहानी', 'kahani', 'story'], ['सर्दी', 'sardi', 'winter']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In a Meitei house the kitchen fire has a name of its own: the phunga. And the stories told around it have a name of their own too — phunga wari, which means, exactly, hearthside tales. Pebet is one. Sandrembi is one. Tapta is one. They all live at the fire.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'In the cold month the Meitei calendar calls Wakching, the evenings turn long and the valley fog comes down, and that is the season the phunga earns its keep. Dinner done, the children fold themselves in close, smallest nearest the warmth.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: 'Grandmother had rules, and the rules were old. The fire is fed before anybody is told anything. Stories come after dinner, "because a story on an empty stomach gets interrupted." And nobody asks how a story ends. It ends when it ends.' },
    { art: ['courtier'], who: null,
      text: 'And the hearth itself is not furniture. Every winter, at Emoinu Eratpa, the best of the kitchen is set out for Emoinu, the kindly goddess of the hearth and of plenty — because in a Meitei home, somebody lives at the fire, in the way that matters.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'One night the littlest boy wanted the story right now, before the wood was in.',
      ask: {
        q: 'Little brother wants the story to start before the fire is fed. What does grandmother say?',
        options: ['Story first, fire later', 'The fire eats first', 'No story tonight'],
        answer: 1,
        right: '"The fire eats first," she says. "It has been holding this family up since before your grandfather could walk. Feed it, then sit."',
        wrong: 'She says the old rule: "The fire eats first. It has held this family up since before your grandfather could walk. Feed it, then sit."'
      } },
    { art: ['courtier', 'guard'], who: null,
      text: 'So the wood went in, and the flames sat up, and grandmother began — Pebet tonight, because the littlest liked the part with the thorn bush. Halfway through, he was asleep against his sister\'s arm, and was carried to bed still holding a fistful of her sleeve.' },
    { art: ['guard'], who: 'guard',
      text: '"The story waits," said grandmother, banking the fire. "It stops exactly where it stopped, until tomorrow." She had learned it at a phunga herself, from her own grandmother, who had learned it at another one. A story is a fire that is fed by being given away.' },
    { art: ['courtier'], who: 'mithu',
      text: 'If your family has a place where the stories happen — a kitchen, a balcony, the back seat on a long drive — that is your phunga. Ask for a story there tonight and see what comes out.' }
  ],
  moral: 'Feed the fire, feed the family, then feed the story. A house that keeps all three stays warm.',
  source: 'The phunga, the hearth of a Meitei kitchen in Manipur, and phunga wari, the hearthside tales told around it; Emoinu, goddess of hearth and plenty, is honoured at Emoinu Eratpa each winter. As lived in many Meitei families — homes differ, and that is as it should be.'
},

{
  id: 'fk.lai-haraoba',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Dance That Remembers the Making',
  hook: 'The dancers\' hands kept making small, careful shapes. Her grandfather could read every one.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-MN'],
  words_hi: [['नाच', 'naach', 'dance'], ['हाथ', 'haath', 'hand'], ['याद', 'yaad', 'memory']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Every year, when the season comes, a Meitei neighbourhood holds Lai Haraoba at the shrine of its own old god — one of the umang lai, the deities of the sacred groves. The name means the merrymaking of the gods. Not the fearing. The merrymaking.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'A girl called Ibemma went with her grandfather. The pena players were playing — the little fiddle with the long memory — and the maibis, the priestesses, were dancing in a slow line, and their hands were making small, careful, exact shapes, over and over.' },
    { art: ['guard', 'courtier'], who: 'guard',
      text: '"Watch the hands," her grandfather whispered. "Now they are making the body — see, the head, then the ribs, then the joints, one by one. Now the house — the posts going up, the beams across, the thatch coming down over it."' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'The hands went on. They planted cotton. They picked it. They spun it into thread, and the thread into cloth, and the cloth went — in one lovely last gesture — around a person\'s shoulders. The whole of getting dressed, from seed to shawl, inside one dance.' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'Ibemma watched the hands begin again.',
      ask: {
        q: 'The dancers\' hands keep making the same small shapes in order. What are the hands doing?',
        options: ['Decorating the dance', 'Telling how the world and the everyday things were made', 'Keeping the beat for the drummers'],
        answer: 1,
        right: 'Yes. It is the making of everything, told with hands — the body, the house, the cloth. The dance is a memory.',
        wrong: 'They are doing something bigger: telling how the world and the everyday things were made. The dance is a memory.'
      } },
    { art: ['guard'], who: 'guard',
      text: '"Writing things down is one way of remembering," said her grandfather. "This is another. Older. Nobody has to be able to read it — you only have to keep dancing it, and nothing is lost."' },
    { art: ['courtier', 'guard'], who: null,
      text: 'The whole neighbourhood was there — the aunties with flasks of tea, the boys pretending not to be interested and watching anyway, the god invited down to enjoy it all, because that is what the festival is: the gods, being given a good time by their own people.' },
    { art: ['guard'], who: 'guard',
      text: 'On the walk home her grandfather said: "When you plant something, or weave something, or build a roof — you are doing the holy things slowly. The maibis do them beautifully, once a year, so that everyone remembers what the ordinary work is."' },
    { art: ['courtier'], who: 'mithu',
      text: 'Lai Haraoba is kept across Manipur every year, and the maibis carry the whole of it — far more than fits in any telling of mine. If you ever get to watch it, do what the grandfather said. Watch the hands.' }
  ],
  moral: 'Planting, weaving, building a roof — the everyday things are worth a dance. That is why there is one.',
  source: 'Lai Haraoba, the Meitei festival for the umang lai in Manipur, whose maibi dances retell the making of the world and the crafts of daily life. Presented from the inside, as its keepers hold it; the full meaning belongs to the maibis and the tradition, and this is only a window on it.'
},

/* =========================================================== NAGALAND ===== */
{
  id: 'fk.ao-six-stones',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Six Stones and the River',
  hook: 'The Ao say their whole people came out of the earth at six stones — and then, one day, crossed a river and became themselves.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['पत्थर', 'patthar', 'stone'], ['नदी', 'nadi', 'river'], ['पुल', 'pul', 'bridge']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Ask an Ao elder in Nagaland where the Ao people began, and you will not get a vague answer. You will get a place. Chungliyimti, on its ridge above the Dikhu river — and at Chungliyimti, six stones. Longterok, the Ao call them: the six stones.' },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'Out of the earth at those stones, the telling goes, came the first ancestors — three men and three women, up into the daylight of the hills. Not from somewhere else. From here. The Ao are a people whose beginning has an address.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'At Chungliyimti they learned the whole of living: which seed goes in when, how a village council sits, which songs belong to which season. They grew many. And a ridge, however good, only holds so many houses and so many fields.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'Across the Dikhu river lay hills nobody had taken — green, folded, empty as a held breath. But the Dikhu is quick and cold, and there was no way over. So they made one: a bridge of woven cane, hung from bank to bank, the kind these hills still know how to build.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      text: 'The evening before the crossing, the families sat late around the fires deciding what a person carries into a country where nothing is ready.',
      ask: {
        q: 'You can only carry so much across a swinging cane bridge. What do you take into a brand-new country?',
        options: ['Everything you can lift', 'The seed and the stories', 'Nothing — start completely fresh'],
        answer: 1,
        right: 'That is what they took. Seed for the first field, and the stories that told them who they were. Everything else can be built.',
        wrong: 'The elders chose differently: seed for the first field, and the stories that told them who they were. Everything else can be built.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'They crossed — children on backs, seed baskets tied tight, the bridge swaying like a slow drum under a whole people. And those who went over took a name from the going. Ao, in their tongue, carries the sense of "those who went across."' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Not everyone crossed. Some stayed on the old side of the water, and their children\'s children live there still, other peoples with their own names and their own tellings. The river did not divide family from stranger. It only wrote down where each family stood that morning.' },
    { art: ['guard'], who: null,
      text: 'On the new side, the Ao spread along the ridges and built their villages high, where the air is clean and you can see who is coming, and every village kept the story of the stones — because a people who know where they began are very hard to scatter.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Longterok is still there, at Chungliyimti, and the Ao still name it as the place of beginning. Six stones, one river, one crossing. Some peoples inherit a kingdom. The Ao inherited a direction.' }
  ],
  moral: 'Carry the seed and the story, and you can start again anywhere.',
  source: 'Ao Naga oral tradition of Nagaland — the emergence of the first ancestors at Longterok, the six stones of Chungliyimti, and the crossing of the Dikhu river. Many tellings; details differ between villages and clans.'
},

{
  id: 'fk.makhel-pear',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Tree Where Everyone Said Goodbye',
  hook: 'Before they parted, they planted a tree — so that no matter how far the families walked, there would be one place that remembered they were one.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['पेड़', 'ped', 'tree'], ['वादा', 'vaada', 'promise'], ['रिश्ता', 'rishta', 'kinship']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'The Angami of Nagaland — and their kin, the Chakhesang, the Mao, the Poumai and others, who together call themselves Tenyimia — tell of a village where, long ago, all of them lived as one people. Makhel, it is called. It sits just over today\'s state line, but lines on maps are young, and this story is old.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'At Makhel they were one hearth-people: one language, one way of planting, weddings within shouting distance of everybody\'s grandmother. And they did well — so well that the fields ran out before the children did.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'The elders sat, the way elders sit when the news is big. The hills around were wide and empty and could feed everyone — but only if the people stopped being one village and became many. Which meant the unthinkable: parting.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      text: 'And parting frightened them more than hunger did. Not the walking — the forgetting. Give it three generations, somebody said, and our children\'s children will pass each other on a path and not know they are kin.',
      ask: {
        q: 'The families must scatter into the hills. How do you part without losing each other?',
        options: ['Promise to never part at all', 'Plant a living witness and swear before it', 'Draw a map of who went where'],
        answer: 1,
        right: 'That is what they did. A wild pear tree, set in the earth at Makhel — a witness with roots.',
        wrong: 'There were no maps then, and never-parting was not possible. They planted a living witness — a wild pear tree, set in the earth at Makhel — and swore before it.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      text: 'Before the tree they made their word: we are one, however far we walk. The tree will stand here and know it. And some tellings add a quiet promise on top — that one day, when the time is right, the scattered families will gather again at this spot.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Then they went — clan by clan, up different valleys, over different passes. In time their speech drifted apart, their weaves took different patterns, their villages got different names for the same moon. They became the many peoples they are today.' },
    { art: ['guard'], who: null,
      text: 'But the pear tree stood. And here is the part that should raise the hair on your arms: it stands now. And when a branch of that old tree falls, villages that trace themselves to Makhel — across all those hills, in all those languages — keep a day of rest for it, like family marking family news.' },
    { art: ['courtier'], who: null,
      text: 'Think of that. A message that needs no wire and no letter: the tree at Makhel has lost a branch, and hillsides a week\'s walk apart go quiet on the same day, because a promise made before anyone\'s great-great-grandmother is still being kept.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Peoples part. Languages drift. That is not a tragedy — it is how one village becomes a dozen nations of the hills. The trick the Tenyimia knew is to leave one living thing standing that remembers you were one.' }
  ],
  moral: 'If you must scatter, plant something first that remembers you together.',
  source: 'Angami and wider Tenyimia oral tradition — the dispersal of the peoples from Makhel and the wild pear tree planted there as witness; villages tracing descent from Makhel still observe a day of rest when a branch falls. Many tellings across the Tenyimia communities of Nagaland and beyond.'
},

{
  id: 'fk.naga-rooster-sun',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Rooster Who Keeps the Sun\'s Appointment',
  hook: 'The sun stopped rising on time. The animals sent their loudest. They should have sent their politest.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'pt_lion', 'pt_elephant'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['सूरज', 'sooraj', 'sun'], ['सुबह', 'subah', 'morning'], ['मुर्गा', 'murga', 'rooster']],
  scenes: [
    { art: ['pt_elephant'], who: null,
      text: 'In the Angami country around Kohima they tell that once, long ago, the sun lost her timekeeping. Nobody had ever told her when morning was — she had always guessed. And one season, tired and huffy after some slight the tellings disagree about, she stopped guessing. She rose late. Then later. Then hardly at all.' },
    { art: ['pt_elephant'], who: null, mood: 'sad',
      text: 'The hills went grey and stayed grey. The rice sulked in the fields. People got up in the dark, worked in the dark, and started forgetting which meal was which. Something had to be done, and the animals — as usual — held a meeting about it.' },
    { art: ['pt_lion'], who: 'pt_lion', mood: 'wow',
      text: '"She has overslept," said the tiger. "I will wake her." And he climbed the highest ridge and roared at the sky until the bamboo rattled. The sun pulled the clouds over her head like a blanket and did not so much as stir.' },
    { art: ['pt_elephant'], who: 'pt_elephant',
      text: 'The elephant trumpeted from the valley floor. The bear huffed. The great hornbill clapped his wings like falling trees. It was the loudest morning in the history of the hills, and it produced no morning whatsoever.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      text: 'At the back of the meeting stood the rooster, who was small, and had been listening instead of shouting.',
      ask: {
        q: 'All the loud ones have failed. Who can wake the sun without making her crosser?',
        options: ['Somebody even louder', 'Somebody polite, who asks instead of demands', 'Nobody — light more fires'],
        answer: 1,
        right: 'Yes. The rooster went up alone — and he did not shout at her. He asked.',
        wrong: 'Louder had been tried. The rooster went up alone — and he did not shout at her. He asked.'
      } },
    { art: ['pt_crow'], who: 'pt_crow',
      text: 'The rooster climbed to the ridge, faced east, and said, at a reasonable volume: "Grandmother Sun. Nobody has ever helped you keep the time, and that was our fault, not yours. Suppose I call you? Every morning, without fail. You would never have to guess again."' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      text: 'There was a long pause. Then the clouds thinned, just a little, the way a blanket lifts when someone under it is listening. "Every morning?" said the sun. "Without fail?" "Without fail," said the rooster. "It will be the whole of my job, and I will do it proudly."' },
    { art: ['pt_crow', 'pt_elephant'], who: null,
      text: 'And that was the bargain. He calls; she comes. It is why the rooster stands so straight and wears his comb like a little red flag — he is not showing off, he is on duty. And it is why, in an Angami village, the first crow of the rooster is the real start of the day, whatever any clock says.' },
    { art: ['pt_crow'], who: 'mithu',
      text: 'Across the passes in Meghalaya, the Khasi tell their own kin story of a rooster and a hidden sun — this app carries that one too. Hills share weather, and stories travel the same passes people do. Each people tells it its own way, and each way is its own.' }
  ],
  moral: 'What loudness cannot do, a polite offer of help often can.',
  source: 'Told in the Naga hills; this telling follows versions from the Angami country around Kohima, Nagaland. The Khasi of Meghalaya tell a kin tale of their own, carried elsewhere in this app. Many versions.'
},

{
  id: 'fk.hornbill-honour',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'Why the Hornbill Feather Is Earned',
  hook: 'Of all the birds in the forest, why does the greatest honour in the Naga hills belong to this one?',
  hero: 'pt_crow',
  cast: ['pt_crow', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['पंख', 'pankh', 'feather'], ['सम्मान', 'sammaan', 'honour'], ['वचन', 'vachan', 'word / promise']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In the old dress of the Naga hills, a feather was not decoration. A hornbill feather, black and white and banded like a signature, was worn in the headdress — and not by whoever wanted one. It was earned, and everyone in the village knew exactly who had earned it and how.' },
    { art: ['courtier', 'guard'], who: 'guard',
      text: 'A boy asked his grandfather about it, because grandfathers are for that. "Peacocks are brighter," he said. "Eagles are fiercer. Why is the honour feather a hornbill\'s?" His grandfather said: "Because of what the hornbill does that nobody watches. Come. I will show you a nest."' },
    { art: ['pt_crow'], who: null,
      text: 'High in a great old tree there was a hole, and the hole was walled up with mud until only a slit was left. "The mother is inside," said his grandfather. "She sealed herself in, with the eggs. She will not come out for months. She cannot come out. She has given up the whole sky on purpose."' },
    { art: ['pt_crow', 'guard'], who: null, mood: 'wow',
      text: 'And as they watched, the great male came beating up the valley — a metre of black and white with a wingbeat you can hear before you see him — and landed at the slit, and passed in fruit, one piece at a time, from his own throat. Then he flew off to find more.' },
    { art: ['guard'], who: 'guard',
      text: '"He does that all day," said the grandfather. "Every day. For months. If he stops, they starve — there is no second chance and no one else coming. Rain, wind, lean weeks when fruit is scarce: he comes anyway. Nobody applauds. The forest does not even notice."' },
    { art: ['pt_crow'], who: null, mood: 'think',
      text: 'The boy looked at the slit in the tree for a long time.',
      ask: {
        q: 'So why is the hornbill\'s the honour feather — of all the birds?',
        options: ['Because it is the biggest bird', 'Because it keeps faith when nobody is watching', 'Because its feathers are the prettiest'],
        answer: 1,
        right: 'That is the answer his grandfather wanted. The feather stands for a promise kept in private, every day, for as long as it takes.',
        wrong: 'Bigger and prettier birds exist. The feather stands for what the hornbill keeps: a promise, in private, every day, for as long as it takes.'
      } },
    { art: ['courtier', 'guard'], who: 'guard',
      text: '"So when a man wore that feather," said his grandfather, "the village was saying: this one\'s word holds like the hornbill\'s. He will come back with the fruit. In these hills that was worth more than gold, because in these hills we lived by each other\'s word."' },
    { art: ['pt_crow'], who: null,
      text: 'Months later the boy saw the mud wall broken open and the whole family out on the branch — the mother thin and glorious, the young ones loud, the father looking, frankly, exhausted. Nobody gave him a feather. He was the feather.' },
    { art: ['pt_crow'], who: 'mithu',
      text: 'All of that about the nest is true natural history — you can look it up, and you should, because it is even better in the details. The Naga peoples watched it first, centuries before any book did, and decided it deserved the highest shelf. They were right.' }
  ],
  moral: 'The highest honours are for promises kept when nobody is watching.',
  source: 'The great hornbill is honoured across the Naga communities of Nagaland, and its feathers marked earned honour in the old dress. The bird\'s faithfulness at the sealed nest is real natural history. Told here the way elders explain it; tellings and customs differ between communities.'
},

{
  id: 'fk.hornbill-kisama',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Festival of Festivals',
  hook: 'Every December, on one hillside, all the peoples of Nagaland build their houses side by side — on purpose.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_crow'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['त्योहार', 'tyohaar', 'festival'], ['ढोल', 'dhol', 'drum'], ['पड़ोसी', 'padosi', 'neighbour']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'Nagaland is not one people. It is many — Ao, Angami, Sumi, Lotha, Konyak, Chakhesang, Rengma, and more — each with its own language, its own weave, its own festivals, its own way of building a house. A Konyak and an Angami are as different as a Tamil and a Punjabi, and just as sure about it.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'For most of the year, each people keeps its own feasts in its own hills. But in December, something else happens. On a hillside called Kisama, near Kohima, a village stands that belongs to no one people — because it belongs to all of them. A morung, a great house, for each community, side by side in one row.' },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'This is the Hornbill Festival. For ten days the whole state comes to Kisama: log drums answering each other across the slope, dancers in a dozen different reds and blacks, wrestlers, singers, fire-makers, and food from every kitchen tradition in the hills, all cooking at once.' },
    { art: ['courtier', 'guard'], who: 'guard',
      text: 'A girl came with her father, and stood in the middle of it, turning slowly. "I can hear five languages from this exact spot," she said. "Six," said her father. "The aunties behind you switched."' },
    { art: ['courtier'], who: null, mood: 'think',
      text: 'And she asked the good question, the one worth a story.',
      ask: {
        q: 'How can one festival belong to so many different peoples at once?',
        options: ['Because they are all really the same underneath', 'Because it is named for something every one of them honours', 'Because somebody makes them attend'],
        answer: 1,
        right: 'Yes — the hornbill. Every community here is distinct, and every one of them honours that bird. The festival stands on the one thing all the different houses share.',
        wrong: 'Not sameness — these are genuinely different peoples, and nobody is made to come. It is named for the hornbill, the bird every one of them honours. The festival stands on the one thing all the different houses share.'
      } },
    { art: ['pt_crow'], who: null,
      text: 'The hornbill flies through the songs and stories of every Naga people — each one differently, and that is the point. The festival did not ask anyone to become alike. It asked everyone to bring what they already were, and put it in a row where the others could admire it.' },
    { art: ['guard', 'courtier'], who: null,
      text: 'So the girl ate Konyak food outside an Ao morung while Chakhesang drummers played, and nobody thought that was strange, because for ten days in December that is exactly what Kisama is for.' },
    { art: ['courtier'], who: null,
      text: 'When they left, her father bought her a shawl — from a weaver of a community not their own, who explained the pattern, and what it meant, and who was allowed to wear it at home, and why this plainer one was the right one for a guest. She kept it for years. She keeps it still.' },
    { art: ['courtier'], who: 'mithu',
      text: 'The Hornbill Festival is young — it began in the year 2000 — but the idea inside it is old: different is not divided. If you are ever in Nagaland in December, go. Stand in the middle. Count the languages.' }
  ],
  moral: 'You do not have to become alike to stand side by side.',
  source: 'The Hornbill Festival, held each December since 2000 at Kisama heritage village near Kohima, Nagaland, where the state\'s many distinct communities — Ao, Angami, Sumi, Lotha, Konyak, Chakhesang and others — each keep a morung on one hillside. The bird it is named for is honoured by all of them, each in their own tradition.'
},

{
  id: 'fk.cat-tiger-lesson',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Lesson the Cat Kept Back',
  hook: 'The cat taught the tiger everything he knows. Not everything she knows.',
  hero: 'pt_lion',
  cast: ['pt_lion', 'pt_jackal'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['बिल्ली', 'billi', 'cat'], ['गुरु', 'guru', 'teacher'], ['सबक', 'sabak', 'lesson']],
  scenes: [
    { art: ['pt_jackal'], who: null,
      text: 'In the Naga hills they tell that the tiger was not born knowing how to be a tiger. Once, long ago, he was just big — big and clumsy, all thump and crash, going hungry in a forest full of dinner. And the finest hunter in those hills was somebody the size of your two hands: the cat.' },
    { art: ['pt_lion', 'pt_jackal'], who: 'pt_lion',
      text: 'The tiger came to her, enormous and embarrassed. "Teach me," he said. "I have the claws and I have the shoulders and I catch nothing at all." And the cat, who took teaching seriously, looked him over and said: "Very well. Lesson one: stop walking like a landslide."' },
    { art: ['pt_jackal', 'pt_lion'], who: null,
      text: 'She taught him properly, the way a good teacher does. The soft walk, paw by paw. The freeze, and the patience inside the freeze. The low flow through the grass. The gathering of the back legs, and the spring. He was a good student, and she told him so, which teachers should.' },
    { art: ['pt_lion'], who: null, mood: 'wow',
      text: 'Season by season the tiger got better, and then he got magnificent. He moved like smoke. He waited like a stone. The whole forest reorganised itself around the fact of him. And somewhere in there, he began to look at his small teacher differently.' },
    { art: ['pt_lion', 'pt_jackal'], who: 'pt_lion', mood: 'think',
      text: '"It is odd," said the tiger one day, flexing, "that I should owe so much to somebody so small." And he decided — the way the too-strong sometimes do — that he no longer needed to be polite to her. "These hills are mine now," he said, and sprang, to show her exactly how well she had taught him.',
      ask: {
        q: 'The tiger knows every lesson the cat taught. Is she out of tricks?',
        options: ['Yes — he learned everything', 'No — a wise teacher keeps one lesson back', 'She will have to outrun him'],
        answer: 1,
        right: 'Just so. Straight up the nearest tree she went — the one thing she had never taught him.',
        wrong: 'She was not out of tricks, and no one outruns a tiger. Straight up the nearest tree she went — the one thing she had never taught him.'
      } },
    { art: ['pt_jackal'], who: null, mood: 'wow',
      text: 'His paws hit the empty grass. He looked left, right — then up. And there was his teacher, settled comfortably on a branch, washing an ear, entirely out of reach.' },
    { art: ['pt_lion', 'pt_jackal'], who: 'pt_lion',
      text: '"You never taught me the climb," said the tiger, from below. "No," agreed the cat. "I kept that one. I have been keeping it for exactly this afternoon." And she finished her ear at leisure while the biggest of all her students sat at the bottom of the tree and thought about his manners.' },
    { art: ['pt_jackal'], who: null,
      text: 'That is why, to this day, the cat climbs and the tiger cannot — and why, some elders add with a smile, a cat always looks so pleased with herself. She is the only teacher whose worst student never caught her.' },
    { art: ['pt_jackal'], who: 'mithu',
      text: 'The elders tell it to two people at once, you know: to the student — do not turn on the one who taught you — and to the teacher: give generously, but keep one branch for yourself.' }
  ],
  moral: 'Honour your teacher — she knows one thing more than she taught you.',
  source: 'Told among several Naga communities of Nagaland, with kin tellings across the hills of the Northeast and beyond. Many versions; in all of them, the cat keeps the climb.'
},

{
  id: 'fk.sungkong-drum',
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Drum the Whole Village Pulled',
  hook: 'A drum the size of a house, carved from one tree, with a voice the next valley can hear — and no one person can move it an inch.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['ढोल', 'dhol', 'drum'], ['आवाज़', 'awaaz', 'voice'], ['रस्सी', 'rassi', 'rope']],
  scenes: [
    { art: ['courtier'], who: null,
      text: 'In an Ao village in Nagaland, the biggest voice does not belong to any person. It belongs to the sungkong — the log drum. A whole great tree, felled, hollowed and carved into a boat-shaped drum longer than several men lying head to foot, that speaks for the village across the valleys.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'Making one begins with respect. The tree is chosen carefully and asked properly — the old rites are said over it before an axe ever touches it — because you do not just take a giant. You invite one.' },
    { art: ['guard'], who: null,
      text: 'The carvers work where the tree fell, up in the forest: hollowing the belly, shaping the head, cutting the long slit that will be its mouth. And then comes the problem that makes this story a story. The finished drum weighs as much as a house. And it is a day\'s haul from home.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      text: 'A boy on his first drum-hauling looked at the great thing lying in the leaves, and at the coils of cane rope, and did the arithmetic of a sensible child.',
      ask: {
        q: 'No ten men can move it. No twenty. How does a drum the size of a house get home?',
        options: ['Elephants', 'Everybody — every hand in the village, pulling to one song', 'Roll it down the river'],
        answer: 1,
        right: 'Everybody. On rollers, on rattan ropes as thick as your arm, to a hauling song that keeps five hundred backs pulling in the same half-second.',
        wrong: 'There are no elephants up here and the river goes the wrong way. It comes home because everybody pulls — every hand in the village, on rattan ropes, to one song.'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      text: 'And that is the day the boy never forgot. The whole village on the ropes — men, women, everyone with a grip — and the drum-hauling song rolling out ahead of them, and on each chorus five hundred people pulling as one person, and the giant sliding forward another arm\'s length on its rollers.' },
    { art: ['courtier'], who: null,
      text: 'It took all day, and it was the best day of the year. Because a village that has hauled a drum together knows something about itself afterwards: there is nothing on this ridge we cannot move, if we pull on the same word.' },
    { art: ['guard', 'courtier'], who: 'courtier',
      text: 'Home, and set in its place of honour, the drum began its real work. Different beats for different news: one rhythm for danger, one for a feast, one for triumph, one for calling the village in. "It is a voice," the boy\'s grandfather told him. "Learn its words like anybody\'s words."' },
    { art: ['guard'], who: null,
      text: 'And so a child of that village grew up bilingual in a language with no mouth — lying in bed, reading the valley by drumbeat: that is only practice; that is a feast at the far village; that, sit up, is news.' },
    { art: ['guard'], who: 'mithu',
      text: 'The Ao call theirs the sungkong; the Konyak and other peoples keep great log drums of their own, each tradition its own. You can still see them in the hills — and at festivals, still hear one. When it speaks, you will understand immediately why nobody interrupts.' }
  ],
  moral: 'A village that pulls on one rope, to one song, can move anything it needs to.',
  source: 'The sungkong, the great log drum of Ao Naga villages in Nagaland — carved from a single tree with rites of respect, hauled home by the whole village with hauling songs, its distinct beats carrying distinct messages. The Konyak and other Naga communities keep their own log-drum traditions. Many tellings.'
},

/* @@ARUNACHAL@@ */

];

window.IND_COLLECTIONS_NE_B = [
  { id: 'desh-ne-b', name: 'Hills of the Dawn', note: 'Manipur, Nagaland, Arunachal and Sikkim — twenty-eight tales from the peoples of the eastern hills, each credited by name.', avatar: 'pt_deer' }
];
