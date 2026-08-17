/* Bizzing India — deva and asura stories, outside the two epics.

   Every object here carries badge 'katha' — a story as it is told (docs/05 §1).

   THE ONE THING TO UNDERSTAND BEFORE EDITING THIS FILE.

   "Asura" is not the Sanskrit word for demon, and this collection exists partly
   to stop a child growing up thinking it is. Devas and asuras are half-brothers
   in the telling — children of the same father, Kashyapa, by different mothers.
   They churn the same ocean together in the story that opens this file. They
   share teachers. They marry across. Prahlada is an asura and one of the most
   beloved devotees in the whole tradition. Mahabali is an asura and Kerala has
   welcomed him home every Onam for centuries. Shukracharya is an asura's guru
   and a revered sage. Banasura was a devotee of Shiva.

   So: NOBODY in this file is written as a monster, and nobody in the asura art
   is drawn as one (docs/05 §7, and the note at the top of avatars.js about the
   epic antagonists — same rule, same reason). Where an asura is on the wrong
   side of a story, he is on the wrong side of it as a person is: proud, or
   frightened, or unable to stop. Never because of what he was born as.

   TWO FLAGGED PAGES, and why:

   - 'ds.mahishasura' ships needs_review: true. Durga's victory over Mahishasura
     is one of the most loved stories in India and the whole of Durga Puja rests
     on it — and, separately and genuinely, several Adivasi communities
     (Asur, Santhal and others, chiefly in Jharkhand and West Bengal) hold
     Mahishasura as an ancestor-hero and mourn him. Both of those are real,
     living and held by real people. A children's app does not get to quietly
     pick one, and it does not get to publish that without a named reviewer.

   - 'ds.vritra' ships needs_review: true because it is the one page here
     resting on Rig Vedic material, where chronology and interpretation are
     genuinely contested among scholars, and docs/05 §6 puts contested
     chronology in front of a human every time.

   Nothing in this file is a Ramayana or a Mahabharata story; those have their
   own readers. Where a figure also appears in an epic it is noted, not retold.

   Scene shape is the house one (see data-stories.js).
*/

window.IND_STORIES_DEVASURA = [

/* ================================================== THE TWO FAMILIES ====== */
{
  id: 'ds.who-are-the-asuras',
  collection: 'devasura',
  badge: 'katha',
  title: 'The Word That Does Not Mean Demon',
  hook: 'Devas on one side, asuras on the other — and they are brothers. Start here or nothing else in this shelf makes sense.',
  hero: 'shukracharya',
  cast: ['indra', 'bali', 'shukracharya', 'prahlada', 'mithu'],
  minutes: 3,
  words_hi: [['देव', 'dev', 'a shining one'], ['असुर', 'asur', 'an asura'], ['भाई', 'bhai', 'brother']],
  scenes: [
    { art: ['indra', 'bali'], who: 'mithu',
      text: 'You are about to read a shelf of stories where devas and asuras are on opposite sides. So before anything else, one correction — because if you get this wrong, every story afterwards goes wrong with it.' },
    { art: ['bali'], who: 'mithu', mood: 'think',
      text: 'Asura does not mean demon. It never did. In the stories the devas and the asuras are HALF-BROTHERS — the same father, Kashyapa, different mothers. Same family. They are cousins arguing over the same house.' },
    { art: ['kurma'], who: null,
      text: 'When the ocean had to be churned for the nectar of life, neither side could do it alone. So they did it together — asuras holding the serpent’s head, devas holding the tail, pulling the same rope for a very long time. Everything good that came out of that ocean came out because they worked together.' },
    { art: ['prahlada'], who: null,
      text: 'And look who else is an asura. Prahlada, born to an asura emperor, is one of the best-loved devotees in the entire tradition. Mahabali, an asura king, is welcomed home to Kerala with flowers every single Onam. Shukracharya, the asuras’ own guru, is a great and revered sage.',
      ask: {
        q: 'So what actually separates a deva from an asura in these stories?',
        options: ['One kind is good and one kind is evil', 'Which family they were born into — and, story by story, which way they are facing', 'Devas are stronger'],
        answer: 1,
        right: 'That is it. It is a family name and a direction, not a verdict on what someone is made of.',
        wrong: 'It is a family name — and, in any given story, which way someone happens to be facing. It is never a verdict on what they are made of.'
      } },
    { art: ['indra'], who: 'mithu',
      text: 'The devas are not simply the good ones either, and the stories are quite happy to say so. Indra, king of the devas, gets proud, gets jealous, sends a storm at a village out of wounded pride, and has to be told off. He is in several of these stories being wrong.' },
    { art: ['shukracharya'], who: 'mithu', mood: 'think',
      text: 'Read them that way and they open up. These are not good-versus-evil stories. They are stories about two halves of one family, both powerful, both capable of getting it badly wrong, arguing for a very long time about who gets what.' }
  ],
  moral: 'Asura is a family, not a verdict. Nobody in these stories is evil by birth.',
  source: 'The common descent of devas and daityas/danavas from Kashyapa is given in the Bhagavata Purana, the Vishnu Purana and the Mahabharata’s Adi Parva. Prahlada, Bali, Shukracharya and Banasura are honoured figures within the tradition itself.'
},

/* ================================================== SAMUDRA MANTHAN ======= */
{
  id: 'ds.samudra-manthan',
  collection: 'devasura',
  badge: 'katha',
  title: 'The Day Both Sides Pulled the Same Rope',
  hook: 'A mountain for a stick, a serpent for a rope, and two sides who could not stand each other doing it together.',
  hero: 'kurma',
  cast: ['kurma', 'indra', 'bali', 'lakshmi', 'shiva', 'mithu'],
  minutes: 5,
  words_hi: [['मंथन', 'manthan', 'churning'], ['अमृत', 'amrit', 'the nectar of life'], ['विष', 'vish', 'poison']],
  scenes: [
    { art: ['indra'], who: null,
      text: 'The devas had lost their strength — the stories give different reasons, and every teller has a favourite. What they agree on is the fix: at the bottom of the ocean of milk lay amrita, the nectar that ends dying. And an ocean does not give things up for the asking.' },
    { art: ['indra', 'bali'], who: null, mood: 'think',
      text: 'It would have to be churned, the way a pot of milk is churned for butter — but the pot was an ocean, and no one side had the arms for it. So the devas went to the asuras and asked. And the asuras, who were not fools and could see a share in it, said yes.' },
    { art: ['kurma'], who: null,
      text: 'Mount Mandara for the churning stick. Vasuki the great serpent wound round it for the rope. Asuras took the head, devas took the tail, and they hauled — one side, then the other, then the first again, and the mountain turned in the sea.' },
    { art: ['kurma'], who: null, mood: 'wow',
      text: 'It sank, of course, straight into the soft floor of the ocean, and Vishnu came down as Kurma the tortoise and held it up on his shell so the work could go on. That is a story of its own and it is in The Ten Avatars.' },
    { art: ['shiva'], who: null, mood: 'sad',
      text: 'And then, before any treasure at all, the ocean gave up something nobody wanted. Halahala — a poison so terrible it began to spread through everything. And the whole enormous project was about to kill the world it was meant to save.',
      ask: {
        q: 'A poison is spreading and it will kill everyone. Somebody has to deal with it. What can anyone actually do?',
        options: ['Pour it back into the sea', 'Someone has to take it into themselves', 'Run'],
        answer: 1,
        right: 'Shiva drank it. Parvati held his throat so it went no further, and it stayed there — which is why he is called Neelkanth, the blue-throated one.',
        wrong: 'Someone had to take it into themselves. Shiva drank it, and Parvati held his throat so it went no further — and it stayed there. Neelkanth: the blue-throated one.'
      } },
    { art: ['shiva'], who: 'mithu', mood: 'think',
      text: 'Notice that Shiva is not on either side of this argument. He is not churning for a share. He simply arrives, swallows the worst thing in the story, and says nothing about it afterwards.' },
    { art: ['lakshmi'], who: null, mood: 'wow',
      text: 'After that, the ocean began to give. Kamadhenu the wish-granting cow. Uchaishravas the white horse. Airavata the white elephant. The parijata tree that never stops flowering. The moon. Dhanvantari, who brought medicine into the world. And Lakshmi herself, rising on a lotus.' },
    { art: ['bali', 'indra'], who: null,
      text: 'And at the very end, the amrita. And both sides, who had pulled the same rope for an age, immediately began to fight over it — which is a story for another page, and not a flattering one for anybody.' },
    { art: ['kurma'], who: 'mithu',
      text: 'Every good thing in that ocean — the medicine, the moon, the cow, Lakshmi, all of it — came up because two sides who disliked each other held on to opposite ends of the same rope. Nobody in the story ever says that out loud. The story just makes sure you saw it.' }
  ],
  moral: 'They could not do it apart. The trouble started the moment there was something to divide.',
  source: 'The Samudra Manthan as told in the Bhagavata Purana (Canto 8), the Vishnu Purana, the Mahabharata (Adi Parva) and the Ramayana (Bala Kanda). The list of ratnas raised from the ocean differs between tellings; the halahala and Shiva as Neelkanth are as given in the Puranic accounts.'
},

/* ==================================================== PRAHLADA =========== */
{
  id: 'ds.prahlada',
  collection: 'devasura',
  badge: 'katha',
  title: 'The Boy Who Would Not Change His Mind',
  hook: 'His father ruled everything. All he wanted was for his son to stop saying one name. The son would not.',
  hero: 'prahlada',
  cast: ['prahlada', 'hiranyakashipu', 'shukracharya', 'mithu'],
  minutes: 4,
  words_hi: [['भक्ति', 'bhakti', 'loving devotion'], ['डर', 'dar', 'fear'], ['सच', 'sach', 'truth']],
  scenes: [
    { art: ['hiranyakashipu'], who: null,
      text: 'Hiranyakashipu had made himself very nearly impossible to harm, and he ruled accordingly. There was one rule above all others in his empire: the name of Vishnu was not to be spoken.' },
    { art: ['prahlada'], who: null,
      text: 'And his own son said it. Not to be difficult. Prahlada simply loved Vishnu, from very small, the way some children love something before anybody teaches them to — and when he was asked about it he told the truth, because he had not yet learned that truth is sometimes dangerous.' },
    { art: ['shukracharya', 'prahlada'], who: null,
      text: 'His father sent him to the best teachers in the world — Shukracharya’s own sons — to have it schooled out of him. Prahlada listened politely to every lesson, learned it all, and went on saying the name.' },
    { art: ['prahlada', 'hiranyakashipu'], who: 'hiranyakashipu', mood: 'sad',
      text: '"I am the strongest being alive," his father said. "I have beaten everyone. Why will you not simply say MY name?"' },
    { art: ['prahlada'], who: 'prahlada',
      text: '"Because you are my father and I love you," said Prahlada. "And because he is everywhere, and you are only here."',
      ask: {
        q: 'His father has power over absolutely everything. What has Prahlada got?',
        options: ['A secret weapon', 'Nothing at all except that he will not say something he does not believe', 'Powerful friends'],
        answer: 1,
        right: 'That is the entire story. He has no army and no plan. He just does not move.',
        wrong: 'Nothing at all — except that he will not say a thing he does not believe. No army, no plan, no rescue arranged. He simply does not move.'
      } },
    { art: ['prahlada'], who: null, mood: 'think',
      text: 'The stories say his father tried, over and over, to frighten him out of it, and every time the boy came through calm, and every time the calm was more infuriating than the disobedience. Nothing was working, and the not-working was the worst part.' },
    { art: ['narasimha', 'prahlada'], who: null, mood: 'wow',
      text: 'How that ends — with a pillar, and a form that is neither man nor animal, at an hour that is neither day nor night — is told in The Ten Avatars, under Narasimha. What matters here is what happened afterwards.' },
    { art: ['narasimha', 'prahlada'], who: null,
      text: 'When the terrible lion-form had done what it came for and nobody could go near it, it was the boy who walked up to it. Not afraid. And the stories say it was Prahlada’s calm, and only that, which settled it.' },
    { art: ['prahlada'], who: 'mithu', mood: 'think',
      text: 'He became king after his father, and by every account he was a good one — and his grandson was Mahabali, whom Kerala still welcomes home each Onam. Three generations of asuras, and the two everyone remembers with love are the boy who would not lie and the king who would not break his word.' }
  ],
  moral: 'You do not need to be strong to be immovable. Prahlada had nothing but a thing he would not say.',
  source: 'The Prahlada narrative as told in the Bhagavata Purana (Canto 7) and the Vishnu Purana. Prahlada is the grandfather of Bali in these accounts. Holika, and the fire from which the Holi bonfire takes its name, belongs to this narrative and is told in this app under Utsav.'
},

/* ==================================================== MAHISHASURA ======== */
{
  id: 'ds.mahishasura',
  collection: 'devasura',
  badge: 'katha',
  needs_review: true,
  title: 'The One No God Could Beat',
  hook: 'He had asked to be safe from every god there was. He had not thought to say goddess.',
  hero: 'durga',
  cast: ['durga', 'mahishasura', 'indra', 'mithu'],
  minutes: 5,
  place: ['IN-WB'],
  words_hi: [['शक्ति', 'shakti', 'power'], ['देवी', 'devi', 'goddess'], ['वरदान', 'vardaan', 'a boon']],
  scenes: [
    { art: ['mahishasura'], who: null,
      text: 'Mahishasura was an asura king who could take the form of a buffalo, and after enormous effort he was granted a boon: that no man and no god could defeat him. He had thought about it, and he was satisfied. He had covered everything.' },
    { art: ['indra'], who: null, mood: 'sad',
      text: 'And he was right for a long while. He beat the devas out of their own heavens, one after another, and they had nowhere left to go and no answer at all — because they had checked the wording, and it held.' },
    { art: ['durga'], who: 'mithu', mood: 'think',
      text: 'Sit with the shape of that for a second. Every god had been ruled out by name. So the answer could not be any of them. It had to be something the wording had simply never considered.' },
    { art: ['durga'], who: null, mood: 'wow',
      text: 'So the devas gave up their own power — all of them, together, poured out at once — and out of that combined light rose Durga. Not sent. Not summoned. Made, out of everything they had, riding a lion, with a weapon in every hand: Shiva’s trident, Vishnu’s discus, Indra’s thunderbolt, each of them given by the one it belonged to.',
      ask: {
        q: 'His boon named men and gods. Why does it not stop her?',
        options: ['She is stronger than all of them', 'Because he never thought to say it about a goddess', 'Because boons stop working eventually'],
        answer: 1,
        right: 'Exactly. It is a story about the gap in a careful sentence — and about who gets left out of one.',
        wrong: 'Because he never thought to include her. It is a story about the gap in a very careful sentence, and about who tends to get left out of those.'
      } },
    { art: ['durga', 'mahishasura'], who: null,
      text: 'They fought for nine nights. He changed shape and changed again — buffalo, lion, man, elephant — and she matched every one of them. The stories do not make him ridiculous. He is a great and formidable king and it takes her nine nights.' },
    { art: ['durga'], who: null,
      text: 'On the tenth day it ended, and that day is Vijayadashami — the tenth, the day of victory. The nine nights before it are Navratri, and they are counted in houses across the whole country every year.' },
    { art: ['durga'], who: 'mithu',
      text: 'And in Bengal it becomes something else again. Durga Pujo: the goddess comes home to her parents for a few days with her children, whole neighbourhoods build pandals to receive her, and on the last day thousands walk her to the river to see her off. It is a homecoming as much as a victory.' },
    { art: ['mahishasura'], who: 'mithu', mood: 'think',
      text: 'One more thing, and it is true and it belongs here. Some Adivasi communities — among them the Asur people of Jharkhand, and others in West Bengal — hold Mahishasura as an ancestor and a hero, and mourn him at the very time others are celebrating. Both of those are real, and both are held by real people living now. Nobody here is going to tell you which family is wrong about their own ancestor.' }
  ],
  moral: 'He listed every enemy he could imagine. The answer came from the one he had not bothered to imagine.',
  source: 'The Mahishasura Mardini narrative as told in the Devi Mahatmya (Durgasaptashati), part of the Markandeya Purana, and in the Devi Bhagavata Purana. Navratri and Vijayadashami are observed nationally; Durga Puja in Kolkata was inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity in 2021. The veneration of Mahishasura as an ancestor-hero by the Asur and some other Adivasi communities is documented in contemporary anthropological and press accounts. needs_review: this page describes a living disagreement between communities about the same figure and requires named human review before publish (docs/05 §6).'
},

/* ==================================================== TARAKASURA ========= */
{
  id: 'ds.tarakasura',
  collection: 'devasura',
  badge: 'katha',
  title: 'Only a Child Not Yet Born',
  hook: 'He made himself safe from everyone alive. So the answer had to be somebody who was not.',
  hero: 'kartikeya',
  cast: ['kartikeya', 'tarakasura', 'shiva', 'parvati', 'mithu'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['बालक', 'baalak', 'a child'], ['भाला', 'bhaala', 'a spear'], ['मोर', 'mor', 'a peacock']],
  scenes: [
    { art: ['tarakasura'], who: null,
      text: 'Tarakasura asked for a boon with a very neat shape to it: that he could be defeated only by a son of Shiva. And at the time he asked, Shiva had no son, was not going to have one, and was sitting in the mountains with his eyes shut, some way past caring.' },
    { art: ['tarakasura'], who: 'mithu', mood: 'think',
      text: 'That is a clever wish. It does not say "nobody can beat me" — a wish like that gets refused. It names one person who does not exist and is not going to.' },
    { art: ['shiva'], who: null,
      text: 'So Tarakasura took the three worlds, and the devas went to look for the only door there was, and found it shut. Shiva was deep in meditation and had been for an age.' },
    { art: ['parvati', 'shiva'], who: null,
      text: 'It was Parvati who changed that, and not by being sent. She chose him, and she went to the mountains herself, and she waited — through cold and heat and years of it — with a patience the stories admire more than they admire anybody’s strength in this whole shelf.' },
    { art: ['kartikeya'], who: null, mood: 'wow',
      text: 'And their son was Kartikeya. Born from Shiva’s own fire, carried by Agni, cooled in the Ganga, raised for a while by six mothers — the six stars people call the Krittika — which is where his name comes from, and why he is shown with six faces.',
      ask: {
        q: 'The devas need a general. He is a small boy. What do they do?',
        options: ['Wait twenty years', 'Make him commander straight away', 'Find somebody older'],
        answer: 1,
        right: 'They hand the whole army to a child, and he takes it. In this story youth is not a problem to be got past.',
        wrong: 'They give the whole army to a child. In this story being young is not a thing to be got past first — it is the point.'
      } },
    { art: ['kartikeya', 'tarakasura'], who: null,
      text: 'They made him commander of the armies of the devas, and gave him the vel — a spear — and he rode out on a peacock and ended what nobody older had been able to touch.' },
    { art: ['kartikeya'], who: 'mithu',
      text: 'In the south he is Murugan, and he is not a minor figure there at all — he is one of the most loved of all. Six great temples in Tamil Nadu, the Arupadai Veedu, are his houses, and people walk to them carrying kavadi. Skanda, Subramanya, Shanmukha, Kartikeya, Murugan: all the same young commander.' },
    { art: ['kartikeya'], who: 'mithu', mood: 'think',
      text: 'Tarakasura ruled out every single person who existed. The stories answered him with somebody who did not exist yet — which is a rather good joke, and also, if you think about it, quite a hopeful one.' }
  ],
  moral: 'He made himself safe from everyone alive. Nobody is safe from who comes next.',
  source: 'The Tarakasura narrative and the birth of Kartikeya as told in the Shiva Purana, the Skanda Purana and Kalidasa’s Kumarasambhava. The Arupadai Veedu, the six abodes of Murugan in Tamil Nadu, are Palani, Swamimalai, Thiruchendur, Thiruthani, Pazhamudircholai and Thirupparamkunram.'
},

/* ==================================================== SHUKRACHARYA ======= */
{
  id: 'ds.shukracharya',
  collection: 'devasura',
  badge: 'katha',
  title: 'The Teacher Who Could Bring Anyone Back',
  hook: 'The asuras had one advantage the devas could not match: a guru who could raise the fallen. So the devas sent a student.',
  hero: 'shukracharya',
  cast: ['shukracharya', 'indra', 'mithu'],
  minutes: 4,
  words_hi: [['गुरु', 'guru', 'a teacher'], ['विद्या', 'vidya', 'knowledge'], ['शिष्य', 'shishya', 'a student']],
  scenes: [
    { art: ['shukracharya'], who: null,
      text: 'Shukracharya was the guru of the asuras, and he was one of the great scholars of any age. He had also, through immense effort, come to know the Sanjivani vidya — the knowledge that brings the dead back to life.' },
    { art: ['indra'], who: null, mood: 'think',
      text: 'Which made a war unwinnable. Devas fell and stayed fallen. Asuras fell and got up in the morning. The devas could win every single day and be no further forward.' },
    { art: ['shukracharya'], who: 'mithu',
      text: 'So the devas did something interesting. They did not steal it and they did not attack him. They sent him a student — Kacha, the son of their own guru — to ask to be taught.' },
    { art: ['shukracharya'], who: null,
      text: 'And Shukracharya, knowing perfectly well whose son had turned up at his door, took him in and taught him. Because he was a teacher, and a student had asked. The stories are quite clear that he knew.',
      ask: {
        q: 'He knows exactly who this boy is and who sent him. Why teach him?',
        options: ['He was fooled', 'Because a teacher who turns away a student because of whose son he is has stopped being a teacher', 'He wanted something in return'],
        answer: 1,
        right: 'That is how the tradition reads him. It is the reason an asura’s guru is a revered sage.',
        wrong: 'Because he was a teacher first. Turn a student away over whose son he is and you have stopped being one — which is exactly why the asuras’ guru is remembered as a great sage.'
      } },
    { art: ['shukracharya'], who: null, mood: 'sad',
      text: 'The asuras worked out what was happening and killed Kacha, more than once. And more than once Shukracharya brought him back — because his own daughter Devayani asked him to, and because he had said he would teach him.' },
    { art: ['shukracharya'], who: null, mood: 'wow',
      text: 'The last time, they burned him and mixed the ashes into Shukracharya’s own drink. So when the guru called Kacha back, the answer came from inside him — and to let his student live, he had to teach him the vidya then and there, and let the boy bring HIM back afterwards.' },
    { art: ['shukracharya'], who: 'mithu', mood: 'think',
      text: 'Which is the moment the knowledge left the asuras for good. Not stolen. Given away, by a teacher, in the only order that would let his student walk out alive.' },
    { art: ['shukracharya'], who: 'mithu',
      text: 'This is also the man who warned Mahabali not to promise three steps to a small boy — and was not listened to. He turns up all over these stories, usually being the cleverest person in the room and usually being ignored.' }
  ],
  moral: 'He taught the boy who had come to take everything from him, because a student had asked. That is what the word guru is for.',
  source: 'The Kacha and Devayani narrative as told in the Mahabharata, Adi Parva (the Sambhava Parva section), and retold in the Puranas. Shukracharya is identified with the planet Venus in Indian astronomy.'
},

/* ==================================================== BHASMASURA ========= */
{
  id: 'ds.bhasmasura',
  collection: 'devasura',
  badge: 'katha',
  title: 'The Gift He Wanted to Try Out',
  hook: 'He asked for a power he could use on anyone he touched. Then he looked around for someone to try it on.',
  hero: 'bhasmasura',
  cast: ['bhasmasura', 'shiva', 'vishnu', 'mithu'],
  minutes: 4,
  words_hi: [['हाथ', 'haath', 'a hand'], ['नाच', 'naach', 'a dance'], ['लालच', 'laalach', 'greed']],
  scenes: [
    { art: ['bhasmasura'], who: null,
      text: 'Bhasmasura did an enormous amount of hard work — years of it — and Shiva, who is famously easy to please and famously bad at asking follow-up questions, offered him a boon.' },
    { art: ['bhasmasura', 'shiva'], who: 'bhasmasura', mood: 'think',
      text: '"Let anything I put my hand on turn to ash."' },
    { art: ['shiva'], who: null,
      text: 'And Shiva said yes. He had said he would, and he does not go back on it. The stories treat this as a real weakness of his and do not tidy it away — he gives, and then has to live with what he has given.' },
    { art: ['bhasmasura', 'shiva'], who: null, mood: 'wow',
      text: 'And the very first thought Bhasmasura had — the very first — was to try it on Shiva. On the person who had just given it to him. So Shiva ran, which is not a sentence you often get to read, and Bhasmasura came after him.' },
    { art: ['vishnu'], who: 'mithu', mood: 'think',
      text: 'Now. Nobody can touch him, nobody can fight him, and he is not going to stop. There is exactly one thing left that works on a man like this, and it is not strength.',
      ask: {
        q: 'What is the one thing that will work on someone this pleased with himself?',
        options: ['A bigger weapon', 'His own vanity', 'A very fast horse'],
        answer: 1,
        right: 'Vanity. Vishnu came as Mohini, the most graceful dancer anyone had ever seen — and simply invited him to dance.',
        wrong: 'His own vanity. Vishnu came as Mohini, a dancer of extraordinary grace, and invited him to dance along.'
      } },
    { art: ['vishnu', 'bhasmasura'], who: null,
      text: 'Mohini danced, and Bhasmasura — who could not bear to be less impressive than anybody — copied every movement exactly. Turn for turn. Step for step. And Mohini, mid-dance, quite naturally, placed a hand on top of her own head.' },
    { art: ['bhasmasura'], who: null, mood: 'wow',
      text: 'And so did he. And that was the end of Bhasmasura, undone by nothing whatsoever except being unable to let someone else look better than him.' },
    { art: ['bhasmasura'], who: 'mithu',
      text: 'It is a funny story and it is meant to be. But notice what the boon actually was. He did not ask to protect anything, or build anything, or heal anyone. He asked for a power that only worked by ruining. And a wish like that has nowhere to go in the end but back at the person who made it.' }
  ],
  moral: 'He asked for a power that could only destroy. It did exactly what he asked.',
  source: 'The Bhasmasura and Mohini narrative as told in the Bhagavata Purana and the Shiva Purana, with regional variations in the details of the dance.'
},

/* ==================================================== BANASURA =========== */
{
  id: 'ds.banasura',
  collection: 'devasura',
  badge: 'katha',
  title: 'The Asura Who Guarded His Daughter Too Well',
  hook: 'A thousand arms, a fortress nobody could enter, and a daughter who fell in love anyway.',
  hero: 'banasura',
  cast: ['banasura', 'shiva', 'krishna', 'mithu'],
  minutes: 4,
  place: ['IN-AS'],
  words_hi: [['बेटी', 'beti', 'daughter'], ['सपना', 'sapna', 'a dream'], ['किला', 'kila', 'a fort']],
  scenes: [
    { art: ['banasura'], who: null,
      text: 'Banasura was Mahabali’s son, and like his father he was a king, and like his grandfather Prahlada he was devoted — in his case to Shiva. The stories say he had a thousand arms, and that he used them to play the drums while Shiva danced, which is the detail everybody remembers.' },
    { art: ['banasura', 'shiva'], who: null,
      text: 'Shiva was so pleased that he came and stood guard at Banasura’s own gate. Which meant Banasura’s fortress could not be entered by anybody at all, and Banasura — who was a very good drummer and a less good listener — began to find this boring, and complained that he had nobody left to fight.' },
    { art: ['banasura'], who: null, mood: 'think',
      text: 'He also had a daughter, Usha. And he kept her behind all of it — the thousand arms, the fortress, the god at the gate — because he had been warned about her future and had decided the answer was walls.' },
    { art: ['banasura'], who: null,
      text: 'Usha dreamed of a young man she had never met. Her friend Chitralekha, who could draw anybody, drew portraits until Usha pointed at one: Aniruddha, Krishna’s own grandson. And Chitralekha, who had other talents too, went and fetched him.',
      ask: {
        q: 'His daughter is in love, inside the safest fortress ever built. What has all that guarding actually achieved?',
        options: ['It kept her safe', 'Nothing at all — it only meant nobody told him', 'It stopped the dream'],
        answer: 1,
        right: 'Just so. He built walls high enough that the news could not get out either.',
        wrong: 'Nothing at all. The walls were high enough to keep the news in, so the first he knew of any of it was when it was far too late.'
      } },
    { art: ['banasura', 'krishna'], who: null,
      text: 'Banasura found Aniruddha inside his fortress and took him prisoner. And that brought Krishna to his gate — and Shiva was standing at that gate, having promised to defend it.' },
    { art: ['krishna', 'banasura'], who: 'mithu', mood: 'wow',
      text: 'So the story arrives somewhere genuinely uncomfortable: Krishna on one side, Shiva on the other, both keeping their word, and neither of them wrong. It is not a good-against-evil fight. It is two promises meeting.' },
    { art: ['banasura'], who: null,
      text: 'It ended without Banasura being destroyed. Shiva asked for his devotee’s life and it was granted; Banasura kept a few of his thousand arms and went back to drumming; and Usha and Aniruddha were married, which is how these things are settled in the end anyway.' },
    { art: ['banasura'], who: 'mithu',
      text: 'In Assam they will tell you where this happened — Tezpur, on the Brahmaputra, is held to be Banasura’s city Sonitpur, and the sculpted stone gateways at Da-Parbatia there have been standing since about the sixth century.' }
  ],
  moral: 'You cannot build a wall high enough to keep someone from growing up. He got a very good drummer and a very late surprise.',
  source: 'The Usha–Aniruddha and Banasura narrative as told in the Bhagavata Purana (Canto 10) and the Harivamsha. Tezpur in Assam is traditionally identified with Banasura’s Sonitpur; the Da-Parbatia doorframe there is dated by the Archaeological Survey of India to the Gupta period, around the sixth century CE.'
},

/* ==================================================== VRITRA ============= */
{
  id: 'ds.vritra',
  collection: 'devasura',
  badge: 'katha',
  needs_review: true,
  title: 'The One Who Held the Rivers',
  hook: 'The oldest story in this shelf by a long way. Somebody was keeping all the water, and the rivers were not running.',
  hero: 'vritra',
  cast: ['vritra', 'indra', 'mithu'],
  minutes: 4,
  words_hi: [['नदी', 'nadi', 'a river'], ['वज्र', 'vajra', 'the thunderbolt'], ['बादल', 'baadal', 'a cloud']],
  scenes: [
    { art: ['vritra'], who: 'mithu',
      text: 'This one is old. Older than every other story on this shelf — it is sung in the Rig Veda, which is among the oldest surviving compositions anywhere, and it was being recited out loud long before anybody wrote it down.' },
    { art: ['vritra'], who: null,
      text: 'Vritra is spoken of as an enormous serpent lying coiled around the waters, holding them. His name is built from a word that means to cover, or to enclose. And while he held them, the rivers did not run and nothing grew.' },
    { art: ['indra'], who: null, mood: 'think',
      text: 'Indra took the vajra — the thunderbolt — and went out to meet him. And it was not an easy thing; the hymns say so. Vritra is not small and he is not a joke. He is the biggest thing in the oldest songs.' },
    { art: ['indra', 'vritra'], who: null, mood: 'wow',
      text: 'And when Indra struck, the waters went free. The hymns describe them going out "like lowing cattle" — running downhill, all together, to the sea. That is the moment the whole thing is sung for.' },
    { art: ['vritra'], who: 'mithu', mood: 'think',
      text: 'Now, people have argued about what this song is describing for well over a century, and they are still arguing. Some read it as the monsoon: the clouds hold the water, the storm breaks them, the rivers fill. Some read it as rivers freed from ice, or from a rockfall. Some read it as being about nothing physical at all.',
      ask: {
        q: 'Scholars genuinely disagree about what this describes. What should a book say?',
        options: ['Pick the best one and state it', 'Say that people disagree, and say what the main readings are', 'Not mention the song'],
        answer: 1,
        right: 'Yes. "Grown-ups are still arguing about this one" is an honest sentence, and usually a thrilling one.',
        wrong: 'Say that people disagree and lay out the main readings. Picking one and stating it flatly would be pretending to a certainty nobody actually has.'
      } },
    { art: ['vritra'], who: null,
      text: 'Later tellings, in the Puranas and the Mahabharata, give Vritra a whole different life — in some he is a learned and devout being, and Indra comes off rather badly for how the fight was won. The story did not stay still. Very old stories rarely do.' },
    { art: ['indra'], who: 'mithu',
      text: 'What stayed, across all of it, is the shape: the water was being held, and somebody let it go. In a country that waits every year for a rain that has to arrive, that is not a small thing to have been singing about for three thousand years.' }
  ],
  moral: 'The water was held, and someone let it go. That is the oldest thing this shelf remembers.',
  source: 'The Vritra hymns of the Rig Veda, chiefly Mandala I; the later Vritra narratives in the Mahabharata (Udyoga Parva) and the Bhagavata Purana, which differ substantially from the Vedic account. The competing interpretations of the Vedic hymn — monsoon, ice-melt, and non-physical readings — are set out in the scholarly literature and are not settled. needs_review: Vedic chronology and interpretation are contested and require named human review before publish (docs/05 §6).'
},

/* ==================================================== GAJASURA / SHIVA === */
{
  id: 'ds.andhaka-gift',
  collection: 'devasura',
  badge: 'katha',
  title: 'The Asura Who Asked to Be Remembered',
  hook: 'He lost. Then he asked for something no one expected — and got it.',
  hero: 'shiva',
  cast: ['shiva', 'bhasmasura', 'mithu'],
  minutes: 3,
  words_hi: [['याद', 'yaad', 'memory'], ['माला', 'maala', 'a garland'], ['अंत', 'ant', 'an ending']],
  scenes: [
    { art: ['shiva'], who: 'mithu',
      text: 'Here is a small one that people often miss, and it says more about how these stories work than any of the big battles do.' },
    { art: ['shiva'], who: null,
      text: 'There is a pattern in the Shiva stories. An asura fights him — Andhaka, Gajasura, Jalandhara, and others depending on which telling you have — and loses. And then, at the end, the losing one is granted a last request. Not spared. Granted something.' },
    { art: ['shiva'], who: null, mood: 'think',
      text: 'And over and over the request is the same sort of thing. Let me be near you. Let people remember me when they remember you. Let something of mine be part of how you are worshipped.',
      ask: {
        q: 'He has just lost everything. Why ask for that, of all things?',
        options: ['To get his kingdom back', 'Because being remembered is what he actually wanted the whole time', 'To trick Shiva'],
        answer: 1,
        right: 'That is how the tradition reads it. The fight was never really about territory.',
        wrong: 'Because being remembered was what he was after all along. Read the requests back and you can see the fight was never quite about territory.'
      } },
    { art: ['shiva'], who: null,
      text: 'And Shiva gives it. Every time. In some tellings the defeated asura becomes one of his own attendants — a gana — and stands at the door of his own conqueror’s house forever, which is a stranger and kinder ending than any story needed to give.' },
    { art: ['shiva'], who: 'mithu', mood: 'think',
      text: 'Compare that with how most stories in the world end for the one who lost. Here the loser gets asked what he wants. That is not softness. It is a whole opinion about what an enemy is.' },
    { art: ['bali'], who: 'mithu',
      text: 'You have already seen it elsewhere on this shelf without noticing. Mahabali loses everything — and is given one day a year to come home, which an entire state has been celebrating ever since. Losing, in these stories, is very rarely the last thing that happens to you.' }
  ],
  moral: 'In these stories the one who loses is asked what he wants. That tells you what the fight was really about.',
  source: 'The pattern of a defeated asura receiving a boon, and of asuras becoming Shiva’s ganas, recurs across the Shiva Purana, Linga Purana and Kurma Purana in the Andhaka, Gajasura and Jalandhara narratives; details differ substantially between tellings, and this page describes the pattern rather than fixing on one version.'
}

];

window.IND_COLLECTIONS_DEVASURA = [
  { id: 'devasura', name: 'Devas & Asuras', avatar: 'bali',
    note: 'Two halves of one family, arguing for an age. Asura has never meant evil — and this shelf starts by saying so.' }
];
