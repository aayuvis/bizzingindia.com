/* Bizzing India — Sanskaar: the values, and the stories that carry them.

   WHY THIS IS THE SPINE (docs/11, docs/12):
   The founder's own words: parents miss "the moral values that we had through the stories —
   religious, mythological and/or literary — that we heard, read in school, and were recited
   by nana-nani." Stories are not the product. Stories are the DELIVERY MECHANISM. The value
   is the product.

   So this file inverts the usual arrangement. Instead of a story that happens to end with a
   moral, a VALUE is the front door, and behind it stand four or five stories from different
   traditions that all teach it — a Jataka and a Jain parable and a Panchatantra fable and a
   real person who lived it. A child meets ahimsa four ways in one sitting, from four
   traditions, and nobody had to rank them.

   THREE CHANNELS, because that is how the parent got it:
     heard   — narrated aloud (we have this)
     read    — read-along (we have this)
     recited — said back out loud (this is what Shlok and `say` are for)

   EDITORIAL (docs/05): traditions are never ranked. Placing a Buddhist and a Jain story under
   one value says "these traditions all cared about this", never "they agree" and never "one
   got it right". The `note` field on a value is where that nuance is stated plainly. */

window.IND_SANSKAAR = {
  intro: 'Every one of these was taught to your parents the same way — not as a lesson, but ' +
         'as a story someone told them. Pick a value and meet it four different ways.',

  values: [
    {
      id: 'ahimsa', term: 'अहिंसा', roman: 'Ahimsa', en: 'Not harming',
      avatar: 'mahavira', colour: '#4fbf8b',
      kid: 'Try not to hurt anything — not people, not animals, not even with words.',
      big: 'The idea that non-harm is not just avoiding cruelty but a whole way of living: ' +
           'what you eat, how you speak, how you walk.',
      note: 'Jains carried this furthest of anyone. Buddhists made it central. Hindus call it ' +
            'a high virtue. Gandhi turned it into a way of changing a country. Four different ' +
            'traditions, one idea, four different distances travelled with it.',
      stories: ['ka.mahavira-elephant', 'ka.buddha-mustard'],
      person: { avatar: 'gandhi', name: 'Mohandas Gandhi',
                did: 'Took ahimsa out of the temple and used it against an empire — and it worked.' },
      verse: 'Thirukkural, Chapter 32 — on not causing pain',
      doit: 'Today: move a spider outside instead of anything else.'
    },
    {
      id: 'satya', term: 'सत्य', roman: 'Satya', en: 'Truth',
      avatar: 'rama', colour: '#3D7DF0',
      kid: 'Say the true thing, especially when the untrue thing would be easier.',
      big: 'Not only not-lying, but not letting someone believe something false because it ' +
           'suits you.',
      note: 'Harishchandra gives away everything rather than break his word; the Buddha lists ' +
            'right speech in the Eightfold Path; the Guru Granth Sahib says truth is high but ' +
            'truthful living is higher.',
      stories: ['pt.blue-jackal', 'ab.crows'],
      person: { avatar: 'ambedkar', name: 'B. R. Ambedkar',
                did: 'Told India uncomfortable truths about itself, and then wrote them into ' +
                     'the Constitution.' },
      verse: 'Mundaka Upanishad — सत्यमेव जयते, truth alone triumphs. It is on your passport.',
      doit: 'Today: own up to one small thing before anyone finds out.'
    },
    {
      id: 'karuna', term: 'करुणा', roman: 'Karuna', en: 'Compassion',
      avatar: 'buddha', colour: '#B14FC4',
      kid: 'When somebody is hurting, notice — and do something, even something small.',
      big: 'Compassion is not pity. Pity looks down; compassion sits beside.',
      note: 'The Buddha taught that everyone you meet is carrying something. The Sikh langar ' +
            'is compassion built as a building. Mother Teresa did it in Calcutta.',
      stories: ['ka.buddha-mustard', 'pt.monkey-crocodile'],
      person: { avatar: 'sarojini', name: 'Sarojini Naidu',
                did: 'Wrote poems about ordinary people nobody was writing about, then spent ' +
                     'her life arguing for them.' },
      verse: 'Dhammapada — on hatred never being ended by hatred',
      doit: 'Today: find the person nobody is sitting with, and sit with them.'
    },
    {
      id: 'seva', term: 'सेवा', roman: 'Seva', en: 'Service',
      avatar: 'khanda', colour: '#e9a13b',
      kid: 'Do something useful for somebody else and do not tell anyone you did it.',
      big: 'Service as worship — the idea that washing dishes for strangers is not lesser ' +
           'than praying, but the same thing.',
      note: 'This is the Sikh idea taken furthest. At any gurdwara, anyone may eat, everyone ' +
            'sits in the same row, and volunteers cook. Every tradition here has a version.',
      stories: [],
      person: { avatar: 'kalpana', name: 'Kalpana Chawla',
                did: 'Went to space and spent her letters home encouraging other girls to aim ' +
                     'at things nobody had told them they could have.' },
      verse: 'Guru Granth Sahib — on the hands that serve',
      doit: 'Today: clear somebody else’s plate without being asked.'
    },
    {
      id: 'dhairya', term: 'धैर्य', roman: 'Dhairya', en: 'Patience & keeping on',
      avatar: 'pt_tortoise', colour: '#1fa971',
      kid: 'The slow way still gets there. Most things are just doing it again tomorrow.',
      big: 'Perseverance as a skill you build, not a mood you happen to be in.',
      note: 'The tortoise beats the hare in Aesop; in the Jatakas the same lesson is told with ' +
            'a quail and an elephant. These stories travelled between cultures for centuries.',
      stories: ['pt.talkative-tortoise'],
      person: { avatar: 'aryabhata', name: 'Aryabhata',
                did: 'Worked out that the Earth spins and got the length of a year nearly ' +
                     'right, with no telescope and no calculator.' },
      verse: 'Hindi proverb — बूँद बूँद से घड़ा भरता है, drop by drop the pot fills',
      doit: 'Today: the thing you gave up on last week. Ten minutes of it.'
    },
    {
      id: 'buddhi', term: 'बुद्धि', roman: 'Buddhi', en: 'Cleverness',
      avatar: 'birbal', colour: '#5b3fd6',
      kid: 'Being small is fine. Thinking first is what wins.',
      big: 'Wit as a form of strength — and specifically as the weapon of the person with no ' +
           'other weapons.',
      note: 'Almost every Indian tale where a small creature beats a big one is teaching this. ' +
            'It is the most Indian moral there is: the rabbit, the jackal, Birbal, Tenali.',
      stories: ['pt.lion-rabbit', 'ab.shorter-line', 'ab.khichdi', 'ka.ganesha-race'],
      person: { avatar: 'chanakya', name: 'Chanakya',
                did: 'Advised a boy nobody had heard of, and together they built an empire.' },
      verse: 'Panchatantra opening — on wisdom being the one thing nobody can steal',
      doit: 'Today: before answering, count to three.'
    },
    {
      id: 'sahas', term: 'साहस', roman: 'Sahas', en: 'Courage',
      avatar: 'lakshmibai', colour: '#d94f3d',
      kid: 'Being frightened and doing it anyway. That is the whole thing.',
      big: 'Courage is not the absence of fear. Hanuman had to be reminded what he could do.',
      note: 'Notice that the most famous courage story in India is about someone who had ' +
            'forgotten his own strength and needed a friend to remind him.',
      stories: ['ka.hanuman-leap'],
      person: { avatar: 'lakshmibai', name: 'Rani Lakshmibai',
                did: 'Rode out at twenty-nine against an empire, with her son on her back.' },
      verse: 'Ramayana, Sundara Kanda — the book traditionally read for courage',
      doit: 'Today: say the thing you have been not saying.'
    },
    {
      id: 'kshama', term: 'क्षमा', roman: 'Kshama', en: 'Forgiveness',
      avatar: 'mahavira', colour: '#2fa89b',
      kid: 'Let it go. Then say so out loud, to their face.',
      big: 'Forgiveness as an annual practice rather than a feeling you wait to arrive.',
      note: 'At the end of Paryushan every Jain says Michhami Dukkadam to everyone they know: ' +
            'if I have hurt you, knowingly or not, forgive me. Every year. Not optional.',
      stories: [],
      person: { avatar: 'ashoka', name: 'Ashoka',
                did: 'Had his own regret carved into rock, all over his empire, so nobody ' +
                     'could pretend it had not happened.' },
      verse: 'Michhami Dukkadam — the Jain words of asking',
      doit: 'Today: say sorry for the old thing. Properly, not sideways.'
    },
    {
      id: 'vidya', term: 'विद्या', roman: 'Vidya', en: 'Loving to learn',
      avatar: 'saraswati', colour: '#7c5cff',
      kid: 'Wanting to know is not a chore. It is the fun part.',
      big: 'Learning as something sacred — which is why Saraswati holds a book and a veena, ' +
           'not a weapon.',
      note: 'India built Nalanda and Takshashila when much of the world had no universities. ' +
            'The Vedas were held in memory for centuries before anyone wrote them down.',
      stories: [],
      person: { avatar: 'kalam', name: 'A. P. J. Abdul Kalam',
                did: 'Sold newspapers as a boy, built rockets, became President, and kept ' +
                     'saying the point was the children.' },
      verse: 'A subhashita — a book, a mind and a friend grow only by being opened',
      doit: 'Today: ask one question you think is too obvious to ask.'
    },
    {
      id: 'kritagyata', term: 'कृतज्ञता', roman: 'Kritagyata', en: 'Gratitude',
      avatar: 'pt_mouse', colour: '#e9a13b',
      kid: 'Somebody did something for you. Notice it out loud.',
      big: 'The Thirukkural says a kindness done at the right moment is bigger than the world.',
      note: 'In the Ramayana even a squirrel helping to build a bridge is remembered — which ' +
            'is the point of that story.',
      stories: [],
      person: { avatar: 'tagore', name: 'Rabindranath Tagore',
                did: 'Wrote a hundred songs of thanks for ordinary things, and gave away the ' +
                     'money from his Nobel Prize to a school.' },
      verse: 'Thirukkural 101 — on a kindness done in time',
      doit: 'Today: thank someone who is used to not being thanked.'
    },
    {
      id: 'namrata', term: 'नम्रता', roman: 'Namrata', en: 'Humility',
      avatar: 'pt_jackal', colour: '#8a5da6',
      kid: 'Pretending to be more than you are is exhausting, and it never lasts.',
      big: 'And its sharper cousin: being sure you are right is usually the first mistake.',
      note: 'The Jains have a word for this — anekantavada, many-sidedness. Everyone is ' +
            'holding one part of the elephant.',
      stories: ['pt.blue-jackal', 'ka.mahavira-elephant', 'ka.ganesha-race'],
      person: { avatar: 'shivaji', name: 'Shivaji',
                did: 'Took his mother’s advice his whole life and said so publicly.' },
      verse: 'A subhashita — the tree heavy with fruit bends lowest',
      doit: 'Today: say "I don’t know" once, out loud, and mean it.'
    },
    {
      id: 'vachan', term: 'वचन', roman: 'Vachan', en: 'Keeping your word',
      avatar: 'rama', colour: '#c9762a',
      kid: 'If you said you would, then you do — even when nobody would notice.',
      big: 'Rama goes to the forest for fourteen years because his father made a promise. The ' +
           'whole epic turns on somebody keeping a word they could have broken.',
      note: 'Ask a grown-up whether they think Rama was right to go. Families genuinely ' +
            'disagree about this one, and that is allowed.',
      stories: [],
      person: { avatar: 'bhagat', name: 'Bhagat Singh',
                did: 'Said what he would do, and then did it, at twenty-three.' },
      verse: 'Ramayana, Ayodhya Kanda',
      doit: 'Today: the small thing you promised and forgot. Do it now.'
    }
  ]
};
