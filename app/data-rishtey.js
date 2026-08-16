/* Bizzing India — Rishtey: the kinship words.

   WHY THIS EXISTS (docs/11): Indian kinship is precise where English is vague. Your
   father's brother is chacha; your mother's brother is mama; your father's elder brother
   is taya. Roughly thirty exact words, each encoding a whole relationship — whose side,
   older or younger, by blood or by marriage.

   A child growing up outside India has one word for all of it: "uncle". They cannot
   address a relative correctly on a video call, which is a small humiliation at both ends.
   This is the most immediately usable thing in the entire product: learn it on Saturday,
   use it on Sunday's call, and a grandmother hears her grandchild say `nani` properly.

   The terms below are Hindi/Urdu (the largest single diaspora set). `also` carries the
   equivalent in other languages so the pillar is not Hindi-only — per CLAUDE.md, never
   imply Hindi = Indian. Those variants need a native check before launch; the ones marked
   `unsure` especially. */

window.IND_RISHTEY = {
  intro: 'In English, everybody is “uncle”. In India there is an exact word for each ' +
         'person — which side of the family, older or younger, by blood or by marriage. ' +
         'Learn these and you can greet anyone on the next call properly.',

  /* side: p = father's side, m = mother's side, o = own generation / down */
  terms: [
    /* ---- grandparents: the ones that matter most, learn these first ---- */
    { id:'dada',   hi:'दादा',   roman:'dada',   en:"Father's father",  side:'p', gen:2, tier:1,
      also:{ pa:'ਦਾਦਾ dada', ta:'தாத்தா thatha', bn:'ঠাকুরদা thakurda', gu:'દાદા dada', te:'తాత thatha' } },
    { id:'dadi',   hi:'दादी',   roman:'dadi',   en:"Father's mother",  side:'p', gen:2, tier:1,
      also:{ pa:'ਦਾਦੀ dadi', ta:'பாட்டி paatti', bn:'ঠাকুমা thakuma', gu:'દાદી dadi', te:'నాన్నమ్మ nannamma' } },
    { id:'nana',   hi:'नाना',   roman:'nana',   en:"Mother's father",  side:'m', gen:2, tier:1,
      also:{ pa:'ਨਾਨਾ nana', ta:'தாத்தா thatha', bn:'দাদু dadu', gu:'નાના nana', te:'తాత thatha' } },
    { id:'nani',   hi:'नानी',   roman:'nani',   en:"Mother's mother",  side:'m', gen:2, tier:1,
      also:{ pa:'ਨਾਨੀ nani', ta:'பாட்டி paatti', bn:'দিদিমা didima', gu:'નાની nani', te:'అమ్మమ్మ ammamma' } },

    /* ---- father's side ---- */
    { id:'taya',   hi:'ताऊ',    roman:'tau / taya', en:"Father's ELDER brother", side:'p', gen:1, tier:2,
      note:'Older than your father. That is the whole difference from chacha.' },
    { id:'tai',    hi:'ताई',    roman:'tai',    en:"Tau's wife",       side:'p', gen:1, tier:3 },
    { id:'chacha', hi:'चाचा',   roman:'chacha', en:"Father's YOUNGER brother", side:'p', gen:1, tier:1,
      note:'Younger than your father.',
      also:{ pa:'ਚਾਚਾ chacha', ta:'சித்தப்பா chithappa', bn:'কাকা kaka', gu:'કાકા kaka', te:'బాబాయి babai' } },
    { id:'chachi', hi:'चाची',   roman:'chachi', en:"Chacha's wife",    side:'p', gen:1, tier:2 },
    { id:'bua',    hi:'बुआ',    roman:'bua',    en:"Father's sister",  side:'p', gen:1, tier:1,
      also:{ pa:'ਭੂਆ bhua', ta:'அத்தை aththai', bn:'পিসি pishi', gu:'ફોઈ foi', te:'అత్త atta' } },
    { id:'phupha', hi:'फूफा',   roman:'phupha', en:"Bua's husband",    side:'p', gen:1, tier:3 },

    /* ---- mother's side ---- */
    { id:'mama',   hi:'मामा',   roman:'mama',   en:"Mother's brother", side:'m', gen:1, tier:1,
      note:'Careful — this is not the English “mama”. It is your mother’s brother.',
      also:{ pa:'ਮਾਮਾ mama', ta:'மாமா maama', bn:'মামা mama', gu:'મામા mama', te:'మామయ్య mamayya' } },
    { id:'mami',   hi:'मामी',   roman:'mami',   en:"Mama's wife",      side:'m', gen:1, tier:2 },
    { id:'mausi',  hi:'मौसी',   roman:'mausi',  en:"Mother's sister",  side:'m', gen:1, tier:1,
      also:{ pa:'ਮਾਸੀ masi', ta:'சித்தி chithi', bn:'মাসি mashi', gu:'માસી masi', te:'పిన్ని pinni' } },
    { id:'mausa',  hi:'मौसा',   roman:'mausa',  en:"Mausi's husband",  side:'m', gen:1, tier:3 },

    /* ---- your own generation ---- */
    { id:'bhaiya', hi:'भैया',   roman:'bhaiya', en:'Elder brother',    side:'o', gen:0, tier:1,
      note:'You call an elder brother bhaiya, not by his name. Same for a cousin who is older.' },
    { id:'didi',   hi:'दीदी',   roman:'didi',   en:'Elder sister',     side:'o', gen:0, tier:1,
      also:{ pa:'ਭੈਣ ਜੀ bhainji', ta:'அக்கா akka', bn:'দিদি didi', gu:'બહેન behen', te:'అక్క akka' } },
    { id:'bhai',   hi:'भाई',    roman:'bhai',   en:'Brother',          side:'o', gen:0, tier:2 },
    { id:'behan',  hi:'बहन',    roman:'behan',  en:'Sister',           side:'o', gen:0, tier:2 },
    { id:'chachera', hi:'चचेरा भाई', roman:'chachera bhai', en:"Chacha's son — your cousin",
      side:'p', gen:0, tier:3,
      note:'Indian has a different word for a cousin from each side. English just says “cousin”.' },
    { id:'mamera',  hi:'ममेरा भाई', roman:'mamera bhai',  en:"Mama's son — your cousin",
      side:'m', gen:0, tier:3 },

    /* ---- looking down the tree: what THEY call you ---- */
    { id:'beta',   hi:'बेटा',   roman:'beta',   en:'Son — and what any elder calls a boy fondly',
      side:'o', gen:-1, tier:1,
      note:'An aunty in a shop will call you beta. It is affection, not a mistake.' },
    { id:'beti',   hi:'बेटी',   roman:'beti',   en:'Daughter — and the same, fondly', side:'o', gen:-1, tier:1 },
    { id:'bhatija',hi:'भतीजा',  roman:'bhatija',en:"Brother's son — what your chacha calls you",
      side:'p', gen:-1, tier:3 },
    { id:'bhanja', hi:'भांजा',  roman:'bhanja', en:"Sister's son — what your mama calls you",
      side:'m', gen:-1, tier:3 },
    { id:'pota',   hi:'पोता',   roman:'pota',   en:"Son's son — what your dada calls you",
      side:'p', gen:-2, tier:2 },
    { id:'nati',   hi:'नाती',   roman:'nati',   en:"Daughter's son — what your nana calls you",
      side:'m', gen:-2, tier:2 }
  ],

  /* The tree the child fills in with real people. Answer = the term id. */
  tree: [
    { slot:'Your father’s father',            answer:'dada'   },
    { slot:'Your father’s mother',            answer:'dadi'   },
    { slot:'Your mother’s father',            answer:'nana'   },
    { slot:'Your mother’s mother',            answer:'nani'   },
    { slot:'Your father’s younger brother',   answer:'chacha' },
    { slot:'Your father’s elder brother',     answer:'taya'   },
    { slot:'Your father’s sister',            answer:'bua'    },
    { slot:'Your mother’s brother',           answer:'mama'   },
    { slot:'Your mother’s sister',            answer:'mausi'  },
    { slot:'Your elder sister',                    answer:'didi'   },
    { slot:'Your elder brother',                   answer:'bhaiya' },
    { slot:'What your dada calls you (if you are a boy)', answer:'pota' }
  ],

  /* One question a week to take to a grandparent. docs/11 §4.3 — this is the method the
     parent does not have, and it turns learning into an actual conversation. */
  ask: [
    'Ask Nani what her street sounded like on the morning of a festival.',
    'Ask Dada what he ate at school, and who he sat with.',
    'Ask Nana which river was nearest his house, and whether he swam in it.',
    'Ask Dadi what song her mother sang to her.',
    'Ask any grandparent what they were frightened of when they were your age.',
    'Ask Nani what she wanted to be, before she was a grown-up.',
    'Ask Dada about the first time he saw a train, or a plane, or the sea.',
    'Ask what your parent was like as a child. Ask for one embarrassing story.',
    'Ask which festival was the biggest where they grew up, and what happened on that day.',
    'Ask a grandparent to say your name the way their mother said theirs.'
  ]
};
