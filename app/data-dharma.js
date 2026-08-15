/* Bizzing India — Dharma: the faiths of India, taught to children through stories.

   EDITORIAL (docs/05, binding):
   - Each tradition is presented AS ITS ADHERENTS UNDERSTAND AND PRACTISE IT. Never ranked,
     never compared to judge. The comparison rows below are "these traditions all talk about
     this" — interesting, never evaluative.
   - The Sikh Gurus are never depicted. Sikh cards use the Khanda and Harmandir Sahib.
   - Badges: katha = a story as it is told · itihaas = what evidence shows · aaj = how it
     lives today.
   - "In many families…" and "ask your family" are used deliberately: internal diversity is
     the point, and it doubles as the conversation prompt home.
   - Nothing here is a scripture quotation unless it is attributed and accurate. */

window.IND_DHARMA = {

  intro: 'Four of the world’s great traditions began in India, and they have lived side by ' +
         'side here for a very long time. Each of these is told the way the people who follow ' +
         'it would tell it — because that is the only honest way to learn about someone’s faith.',

  faiths: [
    /* ------------------------------------------------------------- HINDUISM */
    {
      id: 'hindu',
      name: 'Hinduism',
      avatar: 'ganesha',
      tag: 'The oldest living tradition, and the least tidy',
      blurb: 'Not one book, not one founder, not one way. A family of paths that has been ' +
             'argued about, sung about and lived in for thousands of years.',
      ideas: [
        { term: 'Dharma', say: 'DHUR-muh',
          kid: 'Doing the right thing for who you are and where you are. A doctor’s dharma and a child’s dharma are not the same.' },
        { term: 'Karma', say: 'KUR-muh',
          kid: 'What you do comes back. Not as a punishment — more like an echo.' },
        { term: 'Many paths', say: '',
          kid: 'One of the oldest Hindu ideas is that people reach the same truth by different roads. That is why there are so many ways to be Hindu.' },
        { term: 'The divine in everything', say: '',
          kid: 'Rivers, mountains, trees and animals can all be sacred. That is why the Ganga is called a mother, not a thing.' }
      ],
      texts: ['Vedas — the oldest, first sung aloud and memorised, not written',
              'Upanishads — the big questions',
              'Ramayana and Mahabharata — the two great epics',
              'Puranas — where most of the stories kids know come from',
              'Bhagavad Gita — a talk about doing right when it is hard'],
      festivals: ['Diwali', 'Holi', 'Navratri &amp; Durga Puja', 'Ganesh Chaturthi', 'Pongal &amp; Onam', 'Janmashtami'],
      stories: ['ka.ganesha-race', 'ka.hanuman-leap'],
      lesson: {
        badge: 'katha',
        title: 'Why Ganesha wrote with his own tusk',
        text: 'When the Mahabharata was to be written down, the sage Vyasa needed a scribe who ' +
              'could keep up. Ganesha agreed — on one condition: Vyasa must never pause. ' +
              'Halfway through, Ganesha’s pen broke. Rather than stop and lose the poem, he ' +
              'snapped off one of his own tusks and kept writing.',
        moral: 'Some things are worth breaking a piece of yourself for. Choose them carefully.'
      },
      variety: 'A Tamil, Bengali, Gujarati and Punjabi Hindu childhood look genuinely ' +
               'different — different festivals matter most, different names for the same ' +
               'deity, different food on the plate. Ask your family which is yours.'
    },

    /* ------------------------------------------------------------- BUDDHISM */
    {
      id: 'buddhist',
      name: 'Buddhism',
      avatar: 'buddha',
      tag: 'It started with a prince who could not stop asking questions',
      blurb: 'Siddhartha Gautama grew up inside a palace where nothing sad was allowed in. ' +
             'When he finally saw illness, old age and death, he left to find out why anyone ' +
             'suffers — and what can be done about it.',
      ideas: [
        { term: 'The Four Noble Truths', say: '',
          kid: 'Life has suffering in it. Suffering has causes. It can end. And there is a way to end it.' },
        { term: 'The Eightfold Path', say: '',
          kid: 'Eight habits — how you speak, what you do, how you earn, how you pay attention. Practice, not belief.' },
        { term: 'Ahimsa &amp; compassion', say: 'uh-HIM-sa',
          kid: 'Try not to cause harm, to anyone, including yourself.' },
        { term: 'Sangha', say: 'SUNG-ha',
          kid: 'The community. You are not supposed to do this alone.' }
      ],
      texts: ['Tripitaka — the "three baskets", first memorised, later written on palm leaves',
              'Jataka tales — 547 stories of the Buddha’s earlier lives, mostly about animals',
              'Dhammapada — short verses, still quoted every day'],
      festivals: ['Buddha Purnima', 'Losar', 'Kathina'],
      stories: ['ka.buddha-mustard'],
      lesson: {
        badge: 'katha',
        title: 'The monkey who counted the bridge',
        text: 'A Jataka tale. A troop of monkeys was trapped on the far side of a river with ' +
              'hunters closing in. Their leader stretched himself between two trees and made ' +
              'his own body the bridge. Every monkey crossed over him. He was the last one ' +
              'left, and he did not make it.',
        moral: 'A leader is the one who crosses last.'
      },
      variety: 'Buddhism spread from India across Asia and changed as it went — Ladakh, ' +
               'Sikkim and Arunachal look different from Sri Lanka, which looks different ' +
               'from Japan. In India today it is also the faith Dr Ambedkar chose in 1956.'
    },

    /* --------------------------------------------------------------- JAINISM */
    {
      id: 'jain',
      name: 'Jainism',
      avatar: 'mahavira',
      tag: 'The tradition that took not-harming further than anyone',
      blurb: 'Jains have thought harder about harm than almost anybody. Not just "don’t be ' +
             'cruel" — but how you walk, what you eat, and even how sure you are allowed to be ' +
             'that you are right.',
      ideas: [
        { term: 'Ahimsa', say: 'uh-HIM-sa',
          kid: 'Not harming — carried all the way. Some Jain monks sweep the path in front of them so they do not step on an insect.' },
        { term: 'Anekantavada', say: 'un-EY-kaant-uh-vaad',
          kid: 'Many-sidedness. Everyone is holding one part of the elephant. You are right, and you are not right about all of it.' },
        { term: 'Aparigraha', say: 'up-uh-REE-gruh-huh',
          kid: 'Not grabbing. Owning less on purpose, so less of you is tied up in things.' },
        { term: 'The 24 Tirthankaras', say: 'teerth-un-KAR-uh',
          kid: 'Twenty-four teachers who made a crossing-place. Mahavira was the twenty-fourth, not the first.' }
      ],
      texts: ['Agamas — the teachings of Mahavira, carried orally for centuries',
              'Tattvartha Sutra — accepted across Jain traditions',
              'Kalpa Sutra — read aloud during Paryushan'],
      festivals: ['Paryushan', 'Mahavir Jayanti', 'Diwali (as Mahavira’s liberation)'],
      stories: ['ka.mahavira-elephant'],
      lesson: {
        badge: 'aaj',
        title: 'Michhami Dukkadam',
        text: 'At the end of Paryushan, Jains go to everyone they know — family, friends, ' +
              'people they have fallen out with — and say <i>Michhami Dukkadam</i>: if I have ' +
              'hurt you, knowingly or not, I ask your forgiveness. It happens every single ' +
              'year, and it is not optional.',
        moral: 'Saying sorry properly is a habit you can build, not a feeling you wait for.'
      },
      variety: 'Shravanabelagola’s great statue, Palitana’s hill of temples, Ranakpur’s 1,444 ' +
               'pillars — no two carved the same. Jains are a small community that built some ' +
               'of the most extraordinary things in India.'
    },

    /* --------------------------------------------------------------- SIKHISM */
    {
      id: 'sikh',
      name: 'Sikhi',
      avatar: 'khanda',
      tag: 'One God, one human family, and a free kitchen that never closes',
      blurb: 'Sikhi began in Punjab about 550 years ago with Guru Nanak, and grew through ten ' +
             'Gurus. Its ideas are famously practical: work honestly, share what you have, ' +
             'remember God, and treat everyone as equal — then go and prove it at lunch.',
      ideas: [
        { term: 'Ik Onkar', say: 'ik OHN-kaar',
          kid: 'There is one. The very first words of the Guru Granth Sahib, and everything else follows from it.' },
        { term: 'Seva', say: 'SAY-vaa',
          kid: 'Service. Washing dishes at the gurdwara counts as worship. That is not a metaphor.' },
        { term: 'Langar', say: 'LUNG-ar',
          kid: 'The free kitchen. Anyone may eat, everyone sits in the same row on the floor, and nobody asks who you are.' },
        { term: 'The five Ks', say: '',
          kid: 'Kesh, kangha, kara, kachhera, kirpan — five things a member of the Khalsa keeps, each with a meaning.' }
      ],
      texts: ['Guru Granth Sahib — not a book about the faith but the living Guru itself, ' +
              'which is why it is carried, seated and attended with such care',
              'It includes verses by Hindu and Muslim saints alongside the Gurus’'],
      festivals: ['Vaisakhi', 'Guru Nanak Gurpurab', 'Bandi Chhor Divas'],
      stories: [],
      lesson: {
        badge: 'aaj',
        title: 'The langar at Harmandir Sahib',
        text: 'At the Golden Temple in Amritsar, tens of thousands of people are fed every ' +
              'single day, free, by volunteers. Rich and poor sit in the same row on the same ' +
              'floor and eat the same food. The building has four doors, one on each side, so ' +
              'that anyone may come in from any direction.',
        moral: 'You can argue about equality, or you can build a room where it is simply true.'
      },
      variety: 'Most Sikh families outside India came from Punjab within the last century — ' +
               'to Canada, Britain, the US, Australia — and the gurdwara is usually the first ' +
               'thing a new community builds. Ask your family when yours arrived.',
      note: 'You will not find a picture of a Guru anywhere in this app. Many Sikhs hold that ' +
            'the Gurus should not be depicted, and a children’s app has no business deciding ' +
            'that question. We use the Khanda and Harmandir Sahib instead.'
    }
  ],

  /* Interesting, never evaluative. See docs/05 §2. */
  shared: {
    title: 'Things they all talk about',
    rows: [
      { idea: 'Karma', hindu: 'What you do comes back to you.', buddhist: 'Intention matters as much as the act.',
        jain: 'Karma sticks to the soul like dust; you can stop adding to it.', sikh: 'You reap what you sow — and grace matters too.' },
      { idea: 'Ahimsa', hindu: 'A high virtue.', buddhist: 'Central to the path.',
        jain: 'The whole way of living.', sikh: 'Protect the weak; force only as a last resort.' },
      { idea: 'How to live well', hindu: 'Do your dharma.', buddhist: 'Walk the Eightfold Path.',
        jain: 'Harm less, own less, be less certain.', sikh: 'Work, share, remember.' }
    ],
    caveat: 'These four words look similar in a table and are not the same thing in life. ' +
            'That is normal. Grown-ups have been discussing the differences for two thousand years.'
  },

  weave: {
    title: 'And the rest of the weave',
    text: 'India is also home to Muslims, Christians, Jews and Parsis, and has been for a ' +
          'very long time — Sufi dargahs where everyone comes, churches in Kerala said to be ' +
          'founded by St Thomas, a synagogue in Cochin, and the Parsis of Mumbai who arrived ' +
          'from Persia over a thousand years ago. A child in Edison or Slough or Brampton sits ' +
          'next to classmates from all of them.'
  }
};
