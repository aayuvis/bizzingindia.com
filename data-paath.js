/* Bizzing India — Paathshala: the courses.

   WHY A COURSE LAYER AT ALL, when the app already holds 375 stories, 2,820 Hindi
   passages, 91 songs, 46 sourced verses, 38 festivals and two epics: because a corpus
   is not a curriculum. A child can wander this app for a year and a parent still cannot
   answer "what has she learned?". A course answers that, and it answers it the way
   Bizzing Finance's docs/05 says to — objectives, prerequisites, and ASSESSMENT KEPT
   SEPARATE FROM TEACHING — because the check that happens straight after a card measures
   attention, not learning.

   THE ECONOMICS, STATED PLAINLY. Ten courses at 21-30 hours is 240 hours of child time.
   It is NOT 240 hours of authoring, and if anyone tries to make it so the project dies —
   that failure is already written down in the sibling repo. The hours come from:

       ~40%  teaching        (new, and the only part that costs authoring)
       ~35%  practice        (generated from the corpus this app already owns)
       ~25%  projects        (a paragraph of brief -> an afternoon of child)

   So a 24-hour course is roughly eight to ten hours of genuinely new writing. Projects
   are the cheapest hours in the whole product and the only ones that leave something a
   family keeps.

   ============================ THE EDITORIAL RULES ============================
   docs/05 is binding here exactly as everywhere else, and two of its rules do the most
   work in this file:

     1. NEVER A VERSE FROM MEMORY. A course may only quote a shlok that already exists,
        sourced, in data-shlok.js. Where a course wants a verse it does not have, the
        lesson carries `needsVerse: true` and says so on screen. It does not guess, and
        it does not paraphrase something and set it in quotation marks. The Gita course
        is built on the FIVE Gita verses this app actually has, and admits it.

     2. NOTHING SENSITIVE SHIPS UNREVIEWED. Caste, Partition, communal conflict, colonial
        violence and contested chronology are for a human author with a named reviewer.
        Those modules carry `needsReview` naming what must be signed off. The engine
        renders them as "being written" rather than pretending.

   AND THE ONE THIS TAB COULD MOST EASILY BREAK: faiths are presented from the inside and
   never ranked. There is a Gita course because families ask for one. There is no implied
   hierarchy in which it is the Indian moral text — Neeti carries ethics across Jain,
   Buddhist, Tamil, Sikh and Hindu sources together, and Utsav treats Eid, Christmas,
   Losar and Navroz as the Indian festivals they are.

   ON THE NAME. Paathshala, not "Courses", and not a Hindi word chosen because Hindi:
   पाठशाला / পাঠশালা / પાઠશાળા / ಪಾಠಶಾಲೆ / பாடசாலை all mean the same thing in the same
   way, because the root is shared. docs/05 §8 forbids implying Hindi = Indian, and a
   word that every one of those households already owns is the opposite of that.

   ============================ THE SHAPE ============================
   A course is modules; a module is four lessons and one project. Every module states ONE
   objective as something the child can DO, and the module's last lesson is the check for
   it — a different surface from the one it was taught on, because doing it where you
   learned it is practice and doing it somewhere nobody asked is the evidence.

   A lesson is compact on purpose; this file would be five thousand lines otherwise:

       k    't' teach · 'p' practice · 'c' check
       n    its name
       m    minutes
       o    what the child can do afterwards
       use  what it draws from the corpus:
              st  story ids (data-stories-*.js)     sh  shlok ids (data-shlok.js)
              ge  song ids (data-geet.js)           ut  festival ids (data-utsav.js)
              ri  kinship ids (data-rishtey.js)     it  era ids (data-itihaas.js)
              va  value ids (data-neeti.js)         dh  faith ids (data-dharma.js)
              bh  a count of Bhasha passages        sa  opens Sabhyata

   Every id in `use` is checked against the real corpus by tools/check-paath.js. A lesson
   that points at a story this app does not have is a lesson that renders empty, and that
   is exactly the kind of rot a data file grows quietly.

   Hours are modules x 3, and the check enforces it — a course that claims 30 hours and
   holds seven modules is lying to a parent about what they bought.
*/

window.IND_PAATH = {

  intro: 'A course is a path through what is already here — with something to make at the ' +
         'end of every part, and a way to know it stuck.',

  /* what a grown-up is told, and why it is not "minutes spent" */
  parentNote: 'Progress here is measured by what a child can do, not by how long they were ' +
              'on the screen. Each part ends with a check on a different day and a different ' +
              'screen from the one it was taught on, because remembering something an hour ' +
              'later is attention, and remembering it a week later is learning.',

  courses: [

    /* ================================================================ 1 · HINDI */
    {
      id: 'hindi-zero', name: 'Hindi, from Zero', sub: 'Sounds to conversation',
      hours: 30, ages: [5, 12], badge: 'aaj', icon: 'script', colour: '#3D7DF0',
      premium: true, ready: 85,
      blurb: 'Start at the sound a letter makes and finish able to hold a short conversation ' +
             'with someone who has been waiting to have it with you.',
      why: 'This is the deepest thing the app owns — the engine, the passages and the ' +
           'recorded voices already exist. What was missing was an order to meet them in, ' +
           'and a reason to speak out loud to a person rather than a screen.',
      note: 'Hindi first because the corpus is deepest there. The same course shape runs on ' +
            'Bengali, Gujarati, Kannada, Marathi, Tamil, Telugu and Urdu — those are data ' +
            'files, not rewrites, and the ladder below is language-agnostic by design.',
      modules: [
        { id: 'h1', name: 'The shape of the sound', hours: 3,
          objective: 'hear a Hindi sound and point to the letter that makes it',
          lessons: [
            { k: 't', n: 'Why the line on top', m: 25, o: 'name the shirorekha and say what it joins', use: {} },
            { k: 't', n: 'The first ten letters', m: 25, o: 'read क through ञ aloud', use: { bh: 20 } },
            { k: 'p', n: 'Sound to shape', m: 20, o: 'match ten sounds to ten letters', use: { bh: 30 } },
            { k: 'c', n: 'A week later', m: 15, o: 'do it again cold, on a different screen', use: { bh: 20 } } ],
          project: { id: 'h1p', name: 'Your name, written properly', m: 95,
            brief: 'Write your own name in Devanagari, big, on paper. Get the line on top ' +
                   'unbroken and running the whole way. Then write one more name — somebody ' +
                   'in your house who will be pleased to see it.',
            made: 'two names, on paper, in your own hand' } },
        { id: 'h2', name: 'The rest of the letters', hours: 3,
          objective: 'read any consonant in the set without stopping to think',
          lessons: [
            { k: 't', n: 'The middle rows', m: 25, o: 'read ट through न', use: { bh: 20 } },
            { k: 't', n: 'The last rows', m: 25, o: 'read प through ह', use: { bh: 20 } },
            { k: 'p', n: 'The whole board', m: 20, o: 'read all thirty-three in any order', use: { bh: 40 } },
            { k: 'c', n: 'Cold read', m: 15, o: 'read a row you have not been shown today', use: { bh: 20 } } ],
          project: { id: 'h2p', name: 'A letter hunt at home', m: 95,
            brief: 'Find five things in your house with Hindi writing on them — a packet, a ' +
                   'bag of rice, a calendar, a book. Photograph or copy out one letter from ' +
                   'each and say which it is.',
            made: 'five letters found in the wild, not on a screen' } },
        { id: 'h3', name: 'Matras — the vowels that move', hours: 3,
          objective: 'add the right matra to a consonant to make the word you meant',
          lessons: [
            { k: 't', n: 'A letter is never alone', m: 25, o: 'explain what a matra does', use: { bh: 20 } },
            { k: 't', n: 'The ten marks', m: 25, o: 'name each matra and its sound', use: { bh: 30 } },
            { k: 'p', n: 'Build the word', m: 20, o: 'spell twenty spoken words', use: { bh: 40 } },
            { k: 'c', n: 'Say it, spell it', m: 15, o: 'spell words nobody has drilled today', use: { bh: 20 } } ],
          project: { id: 'h3p', name: 'The shopping list', m: 95,
            brief: 'Write a real shopping list in Hindi — six things your family actually ' +
                   'buys. Take it to the shop, or to whoever does the shopping, and read it ' +
                   'to them.',
            made: 'a list someone else used' } },
        { id: 'h4', name: 'Your first hundred words', hours: 3,
          objective: 'use a hundred everyday words without translating in your head first',
          lessons: [
            { k: 't', n: 'The house', m: 25, o: 'name twenty things in a room', use: { bh: 30 } },
            { k: 't', n: 'The kitchen and the street', m: 25, o: 'name thirty more', use: { bh: 30 } },
            { k: 'p', n: 'Point and say', m: 20, o: 'name fifty things in under three minutes', use: { bh: 50 } },
            { k: 'c', n: 'Cold recall', m: 15, o: 'produce forty from memory, not recognition', use: { bh: 40 } } ],
          project: { id: 'h4p', name: 'Label the house', m: 95,
            brief: 'Make paper labels in Hindi for ten things in your home and stick them on. ' +
                   'Leave them up for a week. See who else in the house starts reading them.',
            made: 'ten labels, up on the walls' } },
        { id: 'h5', name: 'Putting two words together', hours: 3,
          objective: 'make a sentence that says who did what',
          lessons: [
            { k: 't', n: 'Who, what, does', m: 25, o: 'order a Hindi sentence correctly', use: { bh: 30 } },
            { k: 't', n: 'Is and are', m: 25, o: 'use है and हैं in the right place', use: { bh: 30 } },
            { k: 'p', n: 'Make ten', m: 20, o: 'build ten sentences from given words', use: { bh: 40 } },
            { k: 'c', n: 'Your own ten', m: 15, o: 'write ten sentences nobody gave you words for', use: { bh: 20 } } ],
          project: { id: 'h5p', name: 'Five sentences about your day', m: 95,
            brief: 'Write five true sentences in Hindi about what you actually did today. ' +
                   'Not practice sentences — true ones. Read them to somebody at dinner.',
            made: 'the first thing you wrote in Hindi that was about you' } },
        { id: 'h6', name: 'Asking for things', hours: 3,
          objective: 'ask a question and understand the answer',
          lessons: [
            { k: 't', n: 'The question words', m: 25, o: 'use क्या, कौन, कहाँ, कब, क्यों', use: { bh: 30 } },
            { k: 't', n: 'Asking politely', m: 25, o: 'ask for something the way you would want to be asked', use: { bh: 30 } },
            { k: 'p', n: 'Twenty questions', m: 20, o: 'ask and answer twenty', use: { bh: 40 } },
            { k: 'c', n: 'A real exchange', m: 15, o: 'hold a four-turn exchange', use: { bh: 20 } } ],
          project: { id: 'h6p', name: 'Order the food', m: 95,
            brief: 'Order something in Hindi — at a restaurant, a shop, or from whoever cooks ' +
                   'at home. Out loud, to a person. It can go wrong. That is fine and it is ' +
                   'the point.',
            made: 'the first time you used it on someone who was not expecting it' } },
        { id: 'h7', name: 'Yesterday and tomorrow', hours: 3,
          objective: 'say what happened and what is going to happen',
          lessons: [
            { k: 't', n: 'It already happened', m: 25, o: 'use the past for ten common verbs', use: { bh: 40 } },
            { k: 't', n: 'It has not happened yet', m: 25, o: 'use the future for the same ten', use: { bh: 40 } },
            { k: 'p', n: 'Move the sentence in time', m: 20, o: 'shift a sentence between three times', use: { bh: 40 } },
            { k: 'c', n: 'Tell a small story', m: 15, o: 'tell three sentences of something that happened', use: { bh: 20 } } ],
          project: { id: 'h7p', name: 'What I did on the weekend', m: 95,
            brief: 'Six sentences in Hindi about your weekend, in the past tense. Send them ' +
                   'as a voice note to a grandparent or an aunt. Keep their reply.',
            made: 'a voice note that got a reply' } },
        { id: 'h8', name: 'Reading something real', hours: 3,
          objective: 'read a short real passage and say what it was about',
          lessons: [
            { k: 't', n: 'Reading past the words you do not know', m: 25, o: 'get the sense without every word', use: { bh: 30 } },
            { k: 't', n: 'A story in Hindi', m: 25, o: 'read a story you already know in English', use: { st: ['pt.lion-rabbit'], bh: 20 } },
            { k: 'p', n: 'Three passages', m: 20, o: 'read three and answer about each', use: { bh: 60 } },
            { k: 'c', n: 'One you have not seen', m: 15, o: 'read cold and retell it', use: { bh: 20 } } ],
          project: { id: 'h8p', name: 'Read to someone smaller', m: 95,
            brief: 'Read a whole short story in Hindi out loud to someone younger than you — ' +
                   'a cousin, a sibling, a neighbour. If there is nobody younger, read it to ' +
                   'whoever will sit still.',
            made: 'the first time you were the one reading' } },
        { id: 'h9', name: 'Talking to a grown-up', hours: 3,
          objective: 'hold a real conversation for two minutes',
          lessons: [
            { k: 't', n: 'आप and तुम', m: 25, o: 'choose the right one for the person in front of you', use: { bh: 30 } },
            { k: 't', n: 'Keeping it going', m: 25, o: 'ask a second question instead of stopping', use: { bh: 30 } },
            { k: 'p', n: 'Two minutes', m: 20, o: 'keep an exchange alive for two minutes', use: { bh: 40 } },
            { k: 'c', n: 'With someone new', m: 15, o: 'do it with a person you have not practised on', use: { bh: 20 } } ],
          project: { id: 'h9p', name: 'Interview a grandparent, in Hindi', m: 95,
            brief: 'Ask five questions in Hindi to a grandparent or an elder, and record the ' +
                   'answers. Ask about when they were your age. You will not understand all ' +
                   'of it. Keep the recording anyway.',
            made: 'a recording of their voice answering you',
            share: true } },
        { id: 'h10', name: 'Standing on your own', hours: 3,
          objective: 'use Hindi for a whole day without being asked to',
          lessons: [
            { k: 't', n: 'When you get stuck', m: 25, o: 'say "how do you say..." and keep going', use: { bh: 20 } },
            { k: 't', n: 'Words this app did not teach you', m: 25, o: 'work out a word from its parts', use: { bh: 30 } },
            { k: 'p', n: 'A whole conversation', m: 20, o: 'run five minutes without English', use: { bh: 40 } },
            { k: 'c', n: 'The long check', m: 15, o: 'everything from all ten parts, cold', use: { bh: 60 } } ],
          project: { id: 'h10p', name: 'One Hindi day', m: 95,
            brief: 'Pick a Saturday. Speak only Hindi at home for it — as much as you can, ' +
                   'badly, with gaps. Get the grown-ups to play. Write down three things you ' +
                   'could not say, and go and learn them.',
            made: 'a list of the three things you still cannot say, which is the best homework there is' } }
      ],
      assignments: [
        { id: 'ha1', name: 'The word of the week', family: true,
          brief: 'Every week, one new Hindi word goes on the fridge. Whoever uses it most in ' +
                 'the house that week picks the next one.' },
        { id: 'ha2', name: 'The family voice note', family: true,
          brief: 'Once a fortnight, send one voice note in Hindi to a relative who does not ' +
                 'live with you. Any length. Even one sentence.' }
      ],
      sources: ['data-bhasha-hi-*.js — passages, grammar, dialogues and sentences, with the ' +
                'script engine documented in docs/09-language-engine.md']
    },

    /* ================================================================ 2 · NEETI */
    {
      id: 'neeti-course', name: 'Neeti — Moral Science', sub: 'Twelve values, four traditions',
      hours: 24, ages: [6, 12], badge: 'katha', icon: 'star', colour: '#E4A11B',
      premium: false, ready: 70,
      blurb: 'The values your parents got from stories, taught the way they got them — one ' +
             'value, several traditions, and something to actually do about it this week.',
      why: 'The founder\'s own complaint: parents miss the moral values that came through ' +
           'stories heard from nana-nani. The stories are not the product. The value is the ' +
           'product, and the story is how it travels.',
      note: 'Each value is met in more than one tradition on purpose. Ahimsa is Jain, ' +
            'Buddhist, Hindu and Gandhian and the four did not travel the same distance with ' +
            'it. Saying so is the lesson.',
      modules: [
        { id: 'n1', name: 'Ahimsa — not harming', hours: 3,
          objective: 'spot harm that nobody would call harm, and stop it',
          lessons: [
            { k: 't', n: 'Four traditions, one idea', m: 25, o: 'say how far each tradition took it', use: { va: ['ahimsa'], dh: ['jain', 'buddhist'] } },
            { k: 't', n: 'Harm you do with words', m: 25, o: 'name three harms that leave no mark', use: { va: ['ahimsa'], st: ['pt.blue-jackal'] } },
            { k: 'p', n: 'Was that harm?', m: 20, o: 'judge ten situations', use: { va: ['ahimsa'] } },
            { k: 'c', n: 'Your own week', m: 15, o: 'find one in your own week', use: {} } ],
          project: { id: 'n1p', name: 'The week of not harming', m: 95,
            brief: 'Seven days. Each day, one thing you did not do that you would normally ' +
                   'have done — a word you did not say, a creature you moved instead. Write ' +
                   'one line a day. Seven lines is the whole project.',
            made: 'seven lines that are only true if you did the thing' } },
        { id: 'n2', name: 'Satya — truth', hours: 3,
          objective: 'tell the truth when the lie would be easier and nobody would know',
          lessons: [
            { k: 't', n: 'Not lying is the easy half', m: 25, o: 'explain letting someone believe something false', use: { va: ['satya'] } },
            { k: 't', n: 'The king who gave everything away', m: 25, o: 'retell Harishchandra and say what it cost', use: { va: ['satya'], st: ['pt.blue-jackal'] } },
            { k: 'p', n: 'True, false, or hiding', m: 20, o: 'sort ten statements', use: { va: ['satya'] } },
            { k: 'c', n: 'The hard one', m: 15, o: 'judge a case where truth hurts someone', use: {} } ],
          project: { id: 'n2p', name: 'The thing you have not said', m: 95,
            brief: 'There is something small you have let someone believe that is not quite ' +
                   'true. Go and correct it. Then write down what happened — including if it ' +
                   'went badly.',
            made: 'one corrected belief, and an honest note about it' } },
        { id: 'n3', name: 'Karuna — kindness', hours: 3,
          objective: 'do a kindness nobody will find out about',
          lessons: [
            { k: 't', n: 'Kindness with nothing in it for you', m: 25, o: 'tell the two apart', use: { va: ['karuna'] } },
            { k: 't', n: 'The mustard seed', m: 25, o: 'retell what the Buddha did instead of fixing it', use: { va: ['karuna'], dh: ['buddhist'] } },
            { k: 'p', n: 'Who needs what', m: 20, o: 'match a need to the right kindness', use: { va: ['karuna'] } },
            { k: 'c', n: 'The quiet kind', m: 15, o: 'pick the kindness that costs you something', use: {} } ],
          project: { id: 'n3p', name: 'The secret kindness', m: 95,
            brief: 'Do one kind thing this week that the person will never trace back to you. ' +
                   'Tell nobody. Write it here — this is the only place it exists.',
            made: 'something only you and this page know' } },
        { id: 'n4', name: 'Seva — service', hours: 3,
          objective: 'do work for people you will never meet',
          lessons: [
            { k: 't', n: 'The langar', m: 25, o: 'explain why everyone sits on the same floor', use: { va: ['seva'], dh: ['sikh'] } },
            { k: 't', n: 'Work nobody sees', m: 25, o: 'name three jobs that only get noticed when undone', use: { va: ['seva'] } },
            { k: 'p', n: 'Whose job is it', m: 20, o: 'sort chores by who benefits', use: { va: ['seva'] } },
            { k: 'c', n: 'Pick one up', m: 15, o: 'take a job that was not yours', use: {} } ],
          project: { id: 'n4p', name: 'Take one job off someone', m: 95,
            brief: 'Find a job in your house that somebody does every day without being ' +
                   'thanked. Do it for a week. Do not announce it. See how long it takes ' +
                   'anyone to notice.',
            made: 'a week of somebody else\'s work, quietly done' } },
        { id: 'n5', name: 'Dhairya — patience', hours: 3,
          objective: 'wait for something you badly want, on purpose',
          lessons: [
            { k: 't', n: 'The slow way is sometimes the only way', m: 25, o: 'give an example from your own life', use: { va: ['dhairya'] } },
            { k: 't', n: 'The tortoise who could not stay quiet', m: 25, o: 'say what the tortoise could not do', use: { va: ['dhairya'], st: ['pt.talkative-tortoise'] } },
            { k: 'p', n: 'Now or later', m: 20, o: 'choose in ten cases and say why', use: { va: ['dhairya'] } },
            { k: 'c', n: 'A real wait', m: 15, o: 'wait out something small', use: {} } ],
          project: { id: 'n5p', name: 'Grow something', m: 95,
            brief: 'Plant a seed — methi, moong, anything that sprouts. Water it. Do not dig ' +
                   'it up to look. Draw it once a week for a month.',
            made: 'four drawings of the same plant, a week apart' } },
        { id: 'n6', name: 'Sahas — courage', hours: 3,
          objective: 'do the frightening right thing in a small way',
          lessons: [
            { k: 't', n: 'Courage is not not-being-afraid', m: 25, o: 'define it properly', use: { va: ['sahas'] } },
            { k: 't', n: 'The little ones who moved an elephant', m: 25, o: 'retell how the small won', use: { va: ['sahas'], st: ['pt.elephants-rabbits'] } },
            { k: 'p', n: 'Brave or reckless', m: 20, o: 'tell them apart in ten cases', use: { va: ['sahas'] } },
            { k: 'c', n: 'The one that is yours', m: 15, o: 'name a thing you are avoiding', use: {} } ],
          project: { id: 'n6p', name: 'The thing you have been avoiding', m: 95,
            brief: 'One small thing you have been putting off because it is uncomfortable — ' +
                   'an apology, a question, a phone call. Do it this week. Write what you ' +
                   'expected and what actually happened.',
            made: 'the gap between what you feared and what happened' } },
        { id: 'n7', name: 'Kshama — forgiving', hours: 3,
          objective: 'let go of one thing you have been keeping',
          lessons: [
            { k: 't', n: 'Forgiving is not saying it was fine', m: 25, o: 'separate the two', use: { va: ['kshama'] } },
            { k: 't', n: 'Anger, and the nine seconds after', m: 25, o: 'recite what anger does, in order', use: { va: ['kshama'], sh: ['gita-2-63'] } },
            { k: 'p', n: 'Keep or let go', m: 20, o: 'judge ten grudges', use: { va: ['kshama'] } },
            { k: 'c', n: 'One of yours', m: 15, o: 'name one you are still carrying', use: {} } ],
          project: { id: 'n7p', name: 'The list you burn', m: 95,
            brief: 'Write down everything you are still annoyed about. All of it. Then go ' +
                   'through and mark the ones that are not worth carrying any more. Tear off ' +
                   'that part and throw it away.',
            made: 'a shorter list than you started with' } },
        { id: 'n8', name: 'Vachan — keeping your word', hours: 3,
          objective: 'keep a promise that turns out to be inconvenient',
          lessons: [
            { k: 't', n: 'A promise is a thing you made', m: 25, o: 'explain why it survives your mood', use: { va: ['vachan'] } },
            { k: 't', n: 'The promises in the epics', m: 25, o: 'name two that cost everything', use: { va: ['vachan'] } },
            { k: 'p', n: 'Should you have promised', m: 20, o: 'judge ten promises at the point they were made', use: { va: ['vachan'] } },
            { k: 'c', n: 'Yours, kept', m: 15, o: 'report on one you kept', use: {} } ],
          project: { id: 'n8p', name: 'One promise, four weeks', m: 95,
            brief: 'Make one small promise to your family that lasts a month — something ' +
                   'weekly, something small enough to actually keep. Write it down where ' +
                   'they can see it. Then keep it.',
            made: 'four weeks of a thing you said you would do',
            share: true } }
      ],
      assignments: [
        { id: 'na1', name: 'Ask what they were taught', family: true,
          brief: 'Ask a grandparent which of these twelve they were taught hardest, and which ' +
                 'story it came with. Write down the story. It may not be in this app.' },
        { id: 'na2', name: 'The value of the month', family: true,
          brief: 'The house picks one value a month. At dinner on the last day, everyone says ' +
                 'one time they managed it and one time they did not.' }
      ],
      sources: ['data-neeti.js — twelve values with their traditions and stories',
                'data-shlok.js — Thirukkural, Dhammapada and Gita verses, each with attribution']
    },

    /* ================================================================ 3 · RISHTEY */
    {
      id: 'rishtey-course', name: 'Rishtey', sub: 'Who everyone is, and how to talk to them',
      hours: 21, ages: [4, 10], badge: 'aaj', icon: 'parent', colour: '#C0567E',
      premium: false, ready: 60,
      blurb: 'English has "uncle". Indian families have eleven of them, and each one tells ' +
             'you exactly whose brother he is and which side he came from.',
      why: 'docs/11 says build this first, and that nobody has done it. A diaspora child ' +
           'who cannot name the relationship cannot enter the conversation — and the ' +
           'conversation is where everything else in this app came from.',
      note: 'Every term is given in several languages, because a Tamil child and a Bengali ' +
            'child are not learning the same word for the same person, and pretending ' +
            'otherwise is the failure docs/05 §8 exists to stop.',
      modules: [
        { id: 'r1', name: 'The two sides of a family', hours: 3,
          objective: 'say whether someone is from your mother\'s side or your father\'s',
          lessons: [
            { k: 't', n: 'Why it matters which side', m: 25, o: 'explain what the word tells you', use: { ri: ['dada', 'nana'] } },
            { k: 't', n: 'Dada and Nana', m: 25, o: 'use both correctly', use: { ri: ['dada', 'dadi', 'nana', 'nani'] } },
            { k: 'p', n: 'Which side', m: 20, o: 'place ten people correctly', use: { ri: ['dada', 'nana', 'dadi', 'nani'] } },
            { k: 'c', n: 'Your own four', m: 15, o: 'name your own grandparents properly', use: {} } ],
          project: { id: 'r1p', name: 'The first branch', m: 95,
            brief: 'Draw your four grandparents with the right word under each. Ask someone ' +
                   'to check it. Getting it wrong at this stage is normal and is the reason ' +
                   'for the project.',
            made: 'the first four names of a family tree' } },
        { id: 'r2', name: 'Your father\'s brothers and sisters', hours: 3,
          objective: 'name everyone on your father\'s side',
          lessons: [
            { k: 't', n: 'Taya and Chacha', m: 25, o: 'say which is older', use: { ri: ['taya', 'chacha', 'tai', 'chachi'] } },
            { k: 't', n: 'Bua and Phupha', m: 25, o: 'use both', use: { ri: ['bua', 'phupha'] } },
            { k: 'p', n: 'Older or younger', m: 20, o: 'choose the right word from the age', use: { ri: ['taya', 'chacha'] } },
            { k: 'c', n: 'A family you do not know', m: 15, o: 'label a stranger\'s tree', use: {} } ],
          project: { id: 'r2p', name: 'Your father\'s side', m: 95,
            brief: 'Add your father\'s brothers and sisters to the tree, with the right word ' +
                   'for each. If you do not know who is older, this is the project: go and ' +
                   'ask.',
            made: 'a branch you had to ask about' } },
        { id: 'r3', name: 'Your mother\'s brothers and sisters', hours: 3,
          objective: 'name everyone on your mother\'s side',
          lessons: [
            { k: 't', n: 'Mama and Mami', m: 25, o: 'use both', use: { ri: ['mama', 'mami'] } },
            { k: 't', n: 'Mausi and Mausa', m: 25, o: 'use both', use: { ri: ['mausi', 'mausa'] } },
            { k: 'p', n: 'Both sides at once', m: 20, o: 'sort twenty relatives', use: { ri: ['mama', 'mausi', 'chacha', 'bua'] } },
            { k: 'c', n: 'Cold', m: 15, o: 'do it a week later', use: {} } ],
          project: { id: 'r3p', name: 'Your mother\'s side', m: 95,
            brief: 'Add your mother\'s brothers and sisters. Your tree now has two sides and ' +
                   'they use different words. Say one sentence out loud about why.',
            made: 'both sides, correctly named' } },
        { id: 'r4', name: 'Cousins are not one word', hours: 3,
          objective: 'say exactly which kind of cousin someone is',
          lessons: [
            { k: 't', n: 'Chachera and Mamera', m: 25, o: 'tell them apart', use: { ri: ['chachera', 'mamera'] } },
            { k: 't', n: 'Bhaiya and Didi', m: 25, o: 'use the respect words for older', use: { ri: ['bhaiya', 'didi', 'bhai', 'behan'] } },
            { k: 'p', n: 'Name that cousin', m: 20, o: 'label fifteen cousins', use: { ri: ['chachera', 'mamera'] } },
            { k: 'c', n: 'At a real wedding', m: 15, o: 'work out a cousin from a description', use: {} } ],
          project: { id: 'r4p', name: 'The cousin map', m: 95,
            brief: 'Every cousin you have, with the right word. Send it to one of them and ' +
                   'ask if you got theirs right.',
            made: 'a cousin map somebody else checked' } },
        { id: 'r5', name: 'The same person, five languages', hours: 3,
          objective: 'name a relative in your own family language',
          lessons: [
            { k: 't', n: 'Thatha, Dada, Dadu, Ajoba', m: 25, o: 'say your family\'s word', use: { ri: ['dada', 'nana'] } },
            { k: 't', n: 'What your house actually says', m: 25, o: 'use the word your household uses', use: { ri: ['mama', 'mausi'] } },
            { k: 'p', n: 'Across the languages', m: 20, o: 'match terms across four languages', use: { ri: ['dada', 'nana', 'chacha', 'mama'] } },
            { k: 'c', n: 'In your own', m: 15, o: 'do the whole tree in your family language', use: {} } ],
          project: { id: 'r5p', name: 'Your family\'s own words', m: 95,
            brief: 'Ask what your family actually calls each relative — it may not match any ' +
                   'list. Write those words on your tree instead. Your family\'s version wins.',
            made: 'a tree in your family\'s own words, not a textbook\'s' } },
        { id: 'r6', name: 'Talking to elders', hours: 3,
          objective: 'greet and address an elder the way your family expects',
          lessons: [
            { k: 't', n: 'Aap, always', m: 25, o: 'use the respectful form', use: { bh: 20 } },
            { k: 't', n: 'What to ask someone old', m: 25, o: 'ask three questions worth asking', use: {} },
            { k: 'p', n: 'Four exchanges', m: 20, o: 'run four openings', use: { bh: 20 } },
            { k: 'c', n: 'On the phone', m: 15, o: 'open a phone call properly', use: {} } ],
          project: { id: 'r6p', name: 'The phone call', m: 95,
            brief: 'Phone one relative you do not usually speak to. Greet them properly. Ask ' +
                   'them two real questions. Ten minutes is plenty.',
            made: 'one phone call that surprised somebody' } },
        { id: 'r7', name: 'The whole tree', hours: 3,
          objective: 'explain your family to somebody who has never met them',
          lessons: [
            { k: 't', n: 'Where everyone came from', m: 25, o: 'name the places your family is from', use: {} },
            { k: 't', n: 'The one everyone tells stories about', m: 25, o: 'retell one family story', use: {} },
            { k: 'p', n: 'Walk the tree', m: 20, o: 'go from you to any relative naming each step', use: { ri: ['dada', 'nana', 'chacha', 'mama', 'bua', 'mausi'] } },
            { k: 'c', n: 'Explain it to a stranger', m: 15, o: 'describe your family in two minutes', use: {} } ],
          project: { id: 'r7p', name: 'The family tree, finished', m: 95,
            brief: 'Make the whole thing properly — big paper, every name, the right word ' +
                   'under each, and the place each branch came from. Put it on a wall. This ' +
                   'is the thing you will still have in twenty years.',
            made: 'a family tree on a wall',
            share: true } }
      ],
      assignments: [
        { id: 'ra1', name: 'One new relative a week', family: true,
          brief: 'Each week, learn one relative you could not name before — who they are, ' +
                 'where they live, and one thing about them.' },
        { id: 'ra2', name: 'Record one elder', family: true,
          brief: 'Record one elder telling one story. Any story. The recording is the point, ' +
                 'not the story.' }
      ],
      sources: ['data-rishtey.js — 26 kinship terms',
                'docs/11-what-is-missing.md §4.1 — why this pillar exists']
    },

    /* ================================================================ 4 · ITIHAAS */
    {
      id: 'itihaas-course', name: 'The Story of India', sub: 'Harappa to now',
      hours: 30, ages: [8, 12], badge: 'itihaas', icon: 'chart', colour: '#7A6BD8',
      premium: true, ready: 55,
      blurb: 'Five thousand years, told as what the evidence actually shows — with a city ' +
             'of your own to run while you learn how cities worked.',
      why: 'A diaspora child gets India as a sequence of festivals and a flag. This is the ' +
           'spine underneath: who was here, what they built, what we can prove and what we ' +
           'only think.',
      note: 'This is the course where the editorial rules bite hardest. Everything here is ' +
            'badged Itihaas, which means sources[] on every claim. Where the evidence is ' +
            'contested the lesson says so rather than picking a side.',
      needsReview: ['Module 8 (colonial rule) and module 9 (freedom and Partition) are ' +
                    'drafted but will not publish without a named historian reviewing them. ' +
                    'docs/05 §6 — Partition, communal conflict and colonial violence are for ' +
                    'a human author with a named reviewer.'],
      modules: [
        { id: 'i1', name: 'The first cities', hours: 3,
          objective: 'say three things Harappan cities had that surprise people',
          lessons: [
            { k: 't', n: 'Drains before palaces', m: 25, o: 'name what they built first', use: { it: ['harappa'] } },
            { k: 't', n: 'The writing nobody can read', m: 25, o: 'explain why undeciphered matters', use: { it: ['harappa'] } },
            { k: 'p', n: 'What did they have', m: 20, o: 'sort ten claims into proved and guessed', use: { it: ['harappa'] } },
            { k: 'c', n: 'Build one', m: 15, o: 'lay out a city and justify the order', use: { sa: true } } ],
          project: { id: 'i1p', name: 'Run Dholavira', m: 95,
            brief: 'Play the first age of Sabhyata. Get a city to level three. Then write ' +
                   'three sentences on what you built first and why — and whether the real ' +
                   'Harappans would have agreed.',
            made: 'a working city and a defence of your choices' } },
        { id: 'i2', name: 'The age of questions', hours: 3,
          objective: 'explain what the Buddha and Mahavira were both arguing with',
          lessons: [
            { k: 't', n: 'Two princes who walked out', m: 25, o: 'say what each gave up', use: { it: ['buddha', 'mahavira'] } },
            { k: 't', n: 'What they disagreed about', m: 25, o: 'name one real difference', use: { dh: ['buddhist', 'jain'] } },
            { k: 'p', n: 'Whose idea', m: 20, o: 'attribute ten ideas correctly', use: { dh: ['buddhist', 'jain', 'hindu'] } },
            { k: 'c', n: 'The harder sort', m: 15, o: 'do it with ideas that are close', use: {} } ],
          project: { id: 'i2p', name: 'The argument, staged', m: 95,
            brief: 'With one other person, take one question both traditions answered and ' +
                   'argue it out — each of you from the inside of your side, fairly. Ten ' +
                   'minutes. No winner.',
            made: 'an argument you could not win, honestly held' } },
        { id: 'i3', name: 'Ashoka', hours: 3,
          objective: 'explain what the edicts say and why a king would write them on rocks',
          lessons: [
            { k: 't', n: 'The war he won', m: 25, o: 'say what Kalinga cost', use: { it: ['ashoka', 'maurya'] } },
            { k: 't', n: 'Writing on rocks', m: 25, o: 'say what an edict is and where they are', use: { it: ['ashoka'] } },
            { k: 'p', n: 'Edict or not', m: 20, o: 'tell a real edict from a made-up one', use: { it: ['ashoka'] } },
            { k: 'c', n: 'Your own edict', m: 15, o: 'write one and defend it', use: {} } ],
          project: { id: 'i3p', name: 'Your rock edict', m: 95,
            brief: 'Write an edict for your own household — the rules you would carve in ' +
                   'stone and be judged by two thousand years later. Put it somewhere it can ' +
                   'be seen.',
            made: 'rules you would still stand behind in public' } },
        { id: 'i4', name: 'Numbers, stars and surgery', hours: 3,
          objective: 'name three things worked out here before anywhere else',
          lessons: [
            { k: 't', n: 'Aryabhata', m: 25, o: 'say what he claimed about the earth', use: { it: ['aryabhata', 'gupta'] } },
            { k: 't', n: 'Zero is an idea, not a nothing', m: 25, o: 'explain why zero is hard', use: { it: ['gupta'] } },
            { k: 'p', n: 'Who first', m: 20, o: 'place ten discoveries in time', use: { it: ['aryabhata', 'gupta'] } },
            { k: 'c', n: 'Prove it', m: 15, o: 'say what the evidence is for one claim', use: {} } ],
          project: { id: 'i4p', name: 'Do the maths they did', m: 95,
            brief: 'Work out the circumference of a circle the way it was done then, with ' +
                   'string and a ruler. Compare your answer to pi. Write down how close you ' +
                   'got.',
            made: 'your own value for pi, measured not looked up' } },
        { id: 'i5', name: 'The south, which is not a footnote', hours: 3,
          objective: 'say what the Cholas did that the north did not',
          lessons: [
            { k: 't', n: 'A navy', m: 25, o: 'say how far Chola ships went', use: { it: ['souths', 'chola'] } },
            { k: 't', n: 'Temples as institutions', m: 25, o: 'explain what a temple ran besides worship', use: { it: ['temple-builders'] } },
            { k: 'p', n: 'North and south at the same time', m: 20, o: 'place both on one timeline', use: { it: ['chola', 'gupta'] } },
            { k: 'c', n: 'The map test', m: 15, o: 'place ten southern sites', use: {} } ],
          project: { id: 'i5p', name: 'Follow a Chola ship', m: 95,
            brief: 'Trace one Chola voyage on a map, from the Coromandel coast to wherever it ' +
                   'reached. Mark what was carried each way.',
            made: 'a trade route with cargo on it' } },
        { id: 'i6', name: 'Sultanates and Mughals', hours: 3,
          objective: 'explain what changed in India\'s buildings, food and words',
          lessons: [
            { k: 't', n: 'Arrivals that stayed', m: 25, o: 'name three things that arrived and stayed', use: { it: ['sultanate-mughal'] } },
            { k: 't', n: 'Akbar\'s experiment', m: 25, o: 'say what he tried and whether it lasted', use: { it: ['akbar', 'birbal', 'tansen'] } },
            { k: 'p', n: 'Where did that word come from', m: 20, o: 'trace ten everyday words', use: { bh: 20 } },
            { k: 'c', n: 'Read a building', m: 15, o: 'date a building from its features', use: {} } ],
          project: { id: 'i6p', name: 'The words in your kitchen', m: 95,
            brief: 'Find ten words your family uses for food and work out where each came ' +
                   'from — Persian, Arabic, Portuguese, Sanskrit, English. Most kitchens hold ' +
                   'four languages.',
            made: 'a kitchen with its languages labelled' } },
        { id: 'i7', name: 'The Marathas and the Sikhs', hours: 3,
          objective: 'explain how two very different powers rose at the same time',
          lessons: [
            { k: 't', n: 'Shivaji\'s forts', m: 25, o: 'say why hill forts changed the maths', use: { it: ['shivaji', 'marathas-sikhs'] } },
            { k: 't', n: 'A faith that became a state', m: 25, o: 'trace the Gurus to the Khalsa', use: { dh: ['sikh'], it: ['marathas-sikhs'] } },
            { k: 'p', n: 'Two maps, one century', m: 20, o: 'place both at the same moment', use: { it: ['marathas-sikhs'] } },
            { k: 'c', n: 'Cold', m: 15, o: 'put the century in order a week later', use: {} } ],
          project: { id: 'i7p', name: 'Build a hill fort', m: 95,
            brief: 'Make a model fort — cardboard, mud, anything — on a slope. Then explain ' +
                   'why attacking it uphill is a bad idea. That explanation is the project.',
            made: 'a fort and the reason it works' } },
        { id: 'i8', name: 'Company and Crown', hours: 3,
          objective: 'explain how a trading company ended up governing',
          needsReview: 'colonial economics and violence — named reviewer required',
          lessons: [
            { k: 't', n: 'A company with an army', m: 25, o: 'say how a trader got soldiers', use: { it: ['colonial'] } },
            { k: 't', n: 'What left the country', m: 25, o: 'name what was taken and how it was counted', use: { it: ['colonial'] } },
            { k: 'p', n: 'Follow the cloth', m: 20, o: 'trace cotton out and back', use: { it: ['colonial'] } },
            { k: 'c', n: 'Read a source', m: 15, o: 'say who wrote a document and what they wanted', use: {} } ],
          project: { id: 'i8p', name: 'Follow one thing', m: 95,
            brief: 'Pick one thing — cotton, indigo, tea, salt. Trace where it grew, where it ' +
                   'went, who was paid and who was not. One page.',
            made: 'one commodity, followed all the way' } },
        { id: 'i9', name: 'Freedom', hours: 3,
          objective: 'explain that there was more than one way people fought for it',
          needsReview: 'Partition — named reviewer required before publish',
          lessons: [
            { k: 't', n: 'More than one road', m: 25, o: 'name three different approaches', use: { it: ['gandhi', 'bhagat', 'ambedkar'] } },
            { k: 't', n: 'The women', m: 25, o: 'name four and what each did', use: { it: ['lakshmibai', 'sarojini'] } },
            { k: 't', n: 'Ambedkar\'s argument', m: 25, o: 'say what he said freedom had to include', use: { it: ['ambedkar'] } },
            { k: 'c', n: 'Who said what', m: 15, o: 'attribute ten positions', use: { it: ['gandhi', 'ambedkar', 'bhagat'] } } ],
          project: { id: 'i9p', name: 'The one nobody names', m: 95,
            brief: 'Find one person in the freedom movement who is not on any poster. Write ' +
                   'half a page on what they did. Say where you found it.',
            made: 'a name, with a source' } },
        { id: 'i10', name: 'The country you were born into', hours: 3,
          objective: 'connect one thing in your own life to something in this course',
          lessons: [
            { k: 't', n: 'Rockets and rupees', m: 25, o: 'name three things built since 1947', use: { it: ['modern', 'kalam', 'kalpana'] } },
            { k: 't', n: 'The ones your age know', m: 25, o: 'say what Gukesh, Neeraj and Falguni did', use: { it: ['gukesh', 'neeraj', 'falguni'] } },
            { k: 'p', n: 'The whole timeline', m: 20, o: 'order twenty events across 5,000 years', use: { it: ['harappa', 'ashoka', 'gupta', 'chola', 'akbar', 'gandhi', 'modern'] } },
            { k: 'c', n: 'The long check', m: 15, o: 'do it cold, a week later', use: {} } ],
          project: { id: 'i10p', name: 'Your family in the timeline', m: 95,
            brief: 'Find out where your own family was during three of the things in this ' +
                   'course. Put them on the timeline. Most families can reach 1947. Some can ' +
                   'reach much further.',
            made: 'your family, on the same line as the rest of it',
            share: true } }
      ],
      assignments: [
        { id: 'ia1', name: 'One source a week', family: true,
          brief: 'Each week, find one real photograph, document or object from any period in ' +
                 'this course. Say where it is kept.' }
      ],
      sources: ['data-itihaas.js — 34 anchored figures and eras, each with its own sources',
                'data-sabhyata.js — the strategy game used as the laboratory for modules 1 and 7']
    },

    /* ================================================================ 5 · BHUGOL */
    {
      id: 'bhugol-course', name: 'My India', sub: 'Every state, and why it is like that',
      hours: 21, ages: [6, 12], badge: 'itihaas', icon: 'map', colour: '#2F9E6E',
      premium: false, ready: 80,
      blurb: 'Not a list of capitals. Why the food changes when the rain changes, and why ' +
             'the rivers decided where everybody lives.',
      why: 'Geography is the one subject where a diaspora child is genuinely behind — they ' +
           'have never been rained on by a monsoon or seen the Deccan out of a train window.',
      note: 'Boundaries here are the Survey of India depiction everywhere, for every user. ' +
            'No boundary is ever animated, gamified or moved as a reward. docs/05.',
      modules: [
        { id: 'b1', name: 'The shape of the place', hours: 3,
          objective: 'draw India from memory with the big features in roughly the right place',
          lessons: [
            { k: 't', n: 'Mountains at the top, sea on three sides', m: 25, o: 'explain what that does to the weather', use: {} },
            { k: 't', n: 'The Deccan', m: 25, o: 'say what a plateau is and why it is dry', use: {} },
            { k: 'p', n: 'Place the features', m: 20, o: 'put ten features on a blank map', use: {} },
            { k: 'c', n: 'From memory', m: 15, o: 'draw it without the map in front of you', use: {} } ],
          project: { id: 'b1p', name: 'The map from memory', m: 95,
            brief: 'Draw India from memory. Then compare it with the real one and mark what ' +
                   'you got wrong. The wrong bits are the interesting part.',
            made: 'your India, and the corrections' } },
        { id: 'b2', name: 'The rivers decided everything', hours: 3,
          objective: 'say why a city is where it is',
          lessons: [
            { k: 't', n: 'Where the water goes', m: 25, o: 'trace five big rivers', use: {} },
            { k: 't', n: 'Why cities sit on rivers', m: 25, o: 'give three reasons', use: { it: ['harappa'] } },
            { k: 'p', n: 'Which river', m: 20, o: 'match ten cities to their river', use: {} },
            { k: 'c', n: 'A city you have not been taught', m: 15, o: 'predict its river', use: {} } ],
          project: { id: 'b2p', name: 'Follow one river', m: 95,
            brief: 'Pick a river. Follow it from where it starts to where it ends, naming ' +
                   'every state and three cities. Say what it is used for on the way.',
            made: 'one river, end to end' } },
        { id: 'b3', name: 'The monsoon', hours: 3,
          objective: 'explain why the rain arrives when it does',
          lessons: [
            { k: 't', n: 'The wind turns around', m: 25, o: 'explain the reversal', use: {} },
            { k: 't', n: 'What a late monsoon does', m: 25, o: 'name three consequences', use: {} },
            { k: 'p', n: 'Wet or dry', m: 20, o: 'predict rainfall from position', use: {} },
            { k: 'c', n: 'Explain it to someone', m: 15, o: 'teach the monsoon in two minutes', use: {} } ],
          project: { id: 'b3p', name: 'A month of weather', m: 95,
            brief: 'Track the weather where you live for a month AND the weather in one ' +
                   'Indian city your family is from. Put them side by side.',
            made: 'two months of weather, compared' } },
        { id: 'b4', name: 'The north', hours: 3,
          objective: 'say what the northern states share and where they differ',
          lessons: [
            { k: 't', n: 'The plain', m: 25, o: 'explain why it feeds so many people', use: {} },
            { k: 't', n: 'The mountain states', m: 25, o: 'name them and say what is different', use: {} },
            { k: 'p', n: 'Place the states', m: 20, o: 'place all northern states', use: {} },
            { k: 'c', n: 'Cold placement', m: 15, o: 'do it a week later', use: {} } ],
          project: { id: 'b4p', name: 'A state dossier', m: 95,
            brief: 'Pick one northern state. One page: where it is, what grows, what is ' +
                   'spoken, one festival, one dish, one person. Sources at the bottom.',
            made: 'a state, properly researched' } },
        { id: 'b5', name: 'The south', hours: 3,
          objective: 'name the four southern states and one thing each is known for',
          lessons: [
            { k: 't', n: 'Four states, four languages', m: 25, o: 'match language to state', use: {} },
            { k: 't', n: 'Coast, ghats, plateau', m: 25, o: 'explain the three bands', use: {} },
            { k: 'p', n: 'Place and name', m: 20, o: 'place all four with capitals', use: {} },
            { k: 'c', n: 'Which is which', m: 15, o: 'identify from a description', use: {} } ],
          project: { id: 'b5p', name: 'A southern dossier', m: 95,
            brief: 'Same as before, one southern state. If your family is from the south, ' +
                   'pick one that is not yours.',
            made: 'a second state, and a wider map' } },
        { id: 'b6', name: 'The east and the north-east', hours: 3,
          objective: 'name the north-eastern states, which most people cannot',
          lessons: [
            { k: 't', n: 'The eight', m: 25, o: 'name all eight', use: {} },
            { k: 't', n: 'The wettest place on earth', m: 25, o: 'say where and why', use: {} },
            { k: 'p', n: 'The hard eight', m: 20, o: 'place them correctly', use: {} },
            { k: 'c', n: 'A week later', m: 15, o: 'still name all eight', use: {} } ],
          project: { id: 'b6p', name: 'The state nobody names', m: 95,
            brief: 'Pick the north-eastern state you knew least about. Find one festival, ' +
                   'one food and one living person from there. Say where you found each.',
            made: 'a place you could not have named a month ago' } },
        { id: 'b7', name: 'The west, and the whole thing', hours: 3,
          objective: 'place every state and say one true thing about each',
          lessons: [
            { k: 't', n: 'Desert and coast together', m: 25, o: 'explain the contrast', use: {} },
            { k: 't', n: 'Where the ports are', m: 25, o: 'say why trade went west', use: { it: ['harappa'] } },
            { k: 'p', n: 'All of them', m: 20, o: 'place every state', use: {} },
            { k: 'c', n: 'The long check', m: 15, o: 'every state, cold', use: {} } ],
          project: { id: 'b7p', name: 'Where your family is from', m: 95,
            brief: 'Map every place your family has lived, as far back as anyone can remember ' +
                   '— villages, cities, the countries since. Draw the line between them.',
            made: 'your family\'s own map, which exists nowhere else',
            share: true } }
      ],
      assignments: [
        { id: 'ba1', name: 'A state a week', family: true,
          brief: 'One state a week at dinner — whoever finds the most surprising fact wins.' }
      ],
      sources: ['data-states.js and data-bhugol.js — states, rivers, features',
                'docs/07 §7 — the map rules, including the boundary rule that governs this course']
    },

    /* ================================================================ 6 · EPICS */
    {
      id: 'epics-course', name: 'The Two Epics', sub: 'Ramayana and Mahabharata, as literature',
      hours: 30, ages: [7, 12], badge: 'katha', icon: 'tree', colour: '#D2691E',
      premium: true, ready: 85,
      blurb: 'The two long ones, read properly — including the awkward bits, and including ' +
             'the fact that there is no single version of either.',
      why: 'Most children meet these as a cartoon with the difficulty taken out. The ' +
           'difficulty is the literature.',
      note: 'Badged Katha throughout — a story told as a story, never presented as history. ' +
            'Regional tellings are treated as equals, not variants of a correct one: Kamban, ' +
            'Krittibasi, Ranganatha and Sarala are not corruptions of Valmiki.',
      modules: [
        { id: 'e1', name: 'Why there is no one Ramayana', hours: 3,
          objective: 'name three tellings and one way they differ',
          lessons: [
            { k: 't', n: 'Three hundred Ramayanas', m: 25, o: 'say why more than one exists', use: {} },
            { k: 't', n: 'The same scene, two tellings', m: 25, o: 'compare one episode across two', use: {} },
            { k: 'p', n: 'Which telling', m: 20, o: 'identify a telling from a detail', use: {} },
            { k: 'c', n: 'Cold compare', m: 15, o: 'compare a scene you have not been shown', use: {} } ],
          project: { id: 'e1p', name: 'Ask which one your family knows', m: 95,
            brief: 'Ask three relatives to tell you the same scene. Write down where their ' +
                   'versions differ. They will disagree, and none of them is wrong.',
            made: 'three versions of one scene, from your own family' } },
        { id: 'e2', name: 'Ayodhya, and a promise', hours: 3,
          objective: 'explain why Rama goes, in terms of the promise rather than the villain',
          lessons: [
            { k: 't', n: 'The boon called in', m: 25, o: 'explain what Kaikeyi is owed', use: { va: ['vachan'] } },
            { k: 't', n: 'Nobody here is simple', m: 25, o: 'give one sympathetic reading of Kaikeyi', use: {} },
            { k: 'p', n: 'Who owes what', m: 20, o: 'map the obligations', use: { va: ['vachan'] } },
            { k: 'c', n: 'Argue the other side', m: 15, o: 'defend the character you dislike', use: {} } ],
          project: { id: 'e2p', name: 'Kaikeyi\'s case', m: 95,
            brief: 'Write half a page defending Kaikeyi as well as you possibly can. You do ' +
                   'not have to believe it. You have to make it good.',
            made: 'the best case for someone you were told was wrong' } },
        { id: 'e3', name: 'The forest', hours: 3,
          objective: 'retell the middle of the Ramayana in the right order',
          lessons: [
            { k: 't', n: 'Fourteen years', m: 25, o: 'say what exile actually involved', use: {} },
            { k: 't', n: 'Shurpanakha, and what follows', m: 25, o: 'say honestly what happens and what it starts', use: {} },
            { k: 'p', n: 'Order the forest', m: 20, o: 'sequence twelve events', use: {} },
            { k: 'c', n: 'Retell it', m: 15, o: 'tell the middle in five minutes', use: {} } ],
          project: { id: 'e3p', name: 'Map the exile', m: 95,
            brief: 'Draw the route — Ayodhya to Lanka — with the main stops. Many of these ' +
                   'places are real and you can find them. Mark which are and which are not.',
            made: 'a route map with the real places marked' } },
        { id: 'e4', name: 'Hanuman', hours: 3,
          objective: 'say what Hanuman is for in the story, beyond the leaping',
          lessons: [
            { k: 't', n: 'The one who is sent', m: 25, o: 'explain the role of a messenger', use: {} },
            { k: 't', n: 'Not knowing your own strength', m: 25, o: 'say what the forgetting is about', use: {} },
            { k: 'p', n: 'Whose line', m: 20, o: 'attribute ten lines', use: {} },
            { k: 'c', n: 'A new scene', m: 15, o: 'predict how he would act', use: {} } ],
          project: { id: 'e4p', name: 'Stage the leap', m: 95,
            brief: 'With whoever will join in, act out one scene — costumes optional, a ' +
                   'narrator required. Record it on a phone. Three minutes.',
            made: 'a recording of a scene you performed',
            share: true } },
        { id: 'e5', name: 'Lanka, and coming home', hours: 3,
          objective: 'say what the ending costs, including the part that is uncomfortable',
          lessons: [
            { k: 't', n: 'Ravana is not stupid', m: 25, o: 'name three things he is good at', use: {} },
            { k: 't', n: 'The homecoming, and after', m: 25, o: 'say what happens to Sita and why people argue about it', use: {} },
            { k: 'p', n: 'Order the end', m: 20, o: 'sequence the final act', use: {} },
            { k: 'c', n: 'The whole arc', m: 15, o: 'tell the Ramayana in ten minutes', use: {} } ],
          project: { id: 'e5p', name: 'Write the ending you would give it', m: 95,
            brief: 'Some tellings end differently. Write the ending you think the story ' +
                   'deserves, and one paragraph on why you changed it.',
            made: 'your own ending, and your reasons' } },
        { id: 'e6', name: 'A family that could not share', hours: 3,
          objective: 'explain the quarrel the Mahabharata is actually about',
          lessons: [
            { k: 't', n: 'Who is who', m: 25, o: 'lay out the family', use: { ri: ['chacha', 'taya', 'bhaiya'] } },
            { k: 't', n: 'The dice game', m: 25, o: 'say what is lost and in what order', use: {} },
            { k: 'p', n: 'The family tree', m: 20, o: 'build the Kuru tree', use: { ri: ['dada', 'chacha', 'bhaiya'] } },
            { k: 'c', n: 'Cold', m: 15, o: 'rebuild it a week later', use: {} } ],
          project: { id: 'e6p', name: 'The Kuru family tree', m: 95,
            brief: 'Draw it. All of it. Use the same kinship words you learned in Rishtey — ' +
                   'they are the right ones and they make the quarrel make sense.',
            made: 'the most complicated family tree you will ever draw' } },
        { id: 'e7', name: 'Nobody is only good', hours: 3,
          objective: 'name one wrong thing done by a character you were told is good',
          lessons: [
            { k: 't', n: 'Karna', m: 25, o: 'say why he is the hardest one', use: {} },
            { k: 't', n: 'The teachers who fail', m: 25, o: 'say what Drona does to Eklavya', use: {} },
            { k: 'p', n: 'Good, bad, or neither', m: 20, o: 'judge ten acts, not people', use: {} },
            { k: 'c', n: 'Your own reckoning', m: 15, o: 'rank four characters and defend it', use: {} } ],
          project: { id: 'e7p', name: 'Put someone on trial', m: 95,
            brief: 'Pick one character. Write the case against them and the case for them, ' +
                   'both properly. Then say which you believe.',
            made: 'both sides of one person' } },
        { id: 'e8', name: 'The war', hours: 3,
          objective: 'say what the epic thinks about its own war',
          lessons: [
            { k: 't', n: 'Eighteen days', m: 25, o: 'name the turning points', use: {} },
            { k: 't', n: 'The rules, and the breaking of them', m: 25, o: 'name three rules broken and by whom', use: {} },
            { k: 'p', n: 'Order the war', m: 20, o: 'sequence the eighteen days', use: {} },
            { k: 'c', n: 'Who won what', m: 15, o: 'say what winning cost', use: {} } ],
          project: { id: 'e8p', name: 'Count the cost', m: 95,
            brief: 'List who is alive at the end of the Mahabharata. It is a short list. ' +
                   'Write two sentences on what that is saying.',
            made: 'a very short list, and what it means' } },
        { id: 'e9', name: 'What the epics are for', hours: 3,
          objective: 'say what each epic is arguing about',
          lessons: [
            { k: 't', n: 'One asks what a good man is', m: 25, o: 'state the Ramayana\'s question', use: {} },
            { k: 't', n: 'The other asks what to do when everyone is wrong', m: 25, o: 'state the Mahabharata\'s question', use: {} },
            { k: 'p', n: 'Which epic', m: 20, o: 'attribute ten dilemmas', use: {} },
            { k: 'c', n: 'A dilemma of your own', m: 15, o: 'bring one and say which epic it belongs to', use: {} } ],
          project: { id: 'e9p', name: 'Your own dilemma', m: 95,
            brief: 'Write down one real choice you have faced where both options were ' +
                   'somewhat wrong. Say which epic would recognise it.',
            made: 'your own life, in the same shape as the epics' } },
        { id: 'e10', name: 'Telling it yourself', hours: 3,
          objective: 'tell a whole episode well enough that someone listens',
          lessons: [
            { k: 't', n: 'How a teller holds a room', m: 25, o: 'name three things good tellers do', use: {} },
            { k: 't', n: 'Where to stop', m: 25, o: 'find the right place to end', use: {} },
            { k: 'p', n: 'Tell three', m: 20, o: 'tell three short episodes', use: {} },
            { k: 'c', n: 'To a real audience', m: 15, o: 'tell one to someone who has not asked', use: {} } ],
          project: { id: 'e10p', name: 'Become the teller', m: 95,
            brief: 'Tell one full episode out loud to your family, from memory, no notes. ' +
                   'Ten minutes. This is what your grandparents did, and it is how you got ' +
                   'these stories at all.',
            made: 'the first time you were the one telling it',
            share: true } }
      ],
      assignments: [
        { id: 'ea1', name: 'One episode a week, out loud', family: true,
          brief: 'One episode read aloud at home each week, by a different person each time.' }
      ],
      sources: ['data-epic-ramayana.js and data-epic-mahabharata.js — both epics, with the ' +
                'regional tellings named where they differ']
    },

    /* ================================================================ 7 · UTSAV */
    {
      id: 'utsav-course', name: 'The Indian Year', sub: 'Thirty-eight festivals, every faith',
      hours: 21, ages: [4, 10], badge: 'aaj', icon: 'star', colour: '#E4572E',
      premium: false, ready: 75,
      blurb: 'A year of festivals — and the reason each one is when it is, which is almost ' +
             'always the harvest, the moon, or somebody arriving.',
      why: 'A diaspora child gets three festivals and misses the shape of the year. The ' +
           'shape is the point: the year has a rhythm and everyone is in it.',
      note: 'Eid, Christmas, Navroz, Losar and Gurpurab are Indian festivals in this course, ' +
            'not "other" ones. A child from any of those households must find their own year ' +
            'here.',
      modules: [
        { id: 'u1', name: 'Why a festival is when it is', hours: 3,
          objective: 'say whether a festival follows the sun, the moon, or a harvest',
          lessons: [
            { k: 't', n: 'The moon calendar', m: 25, o: 'explain why dates move', use: { ut: ['diwali', 'eid-ul-fitr'] } },
            { k: 't', n: 'The ones that never move', m: 25, o: 'say why Sankranti is fixed', use: { ut: ['makar-sankranti', 'pongal'] } },
            { k: 'p', n: 'Moon or sun', m: 20, o: 'sort fifteen festivals', use: { ut: ['diwali', 'holi', 'pongal', 'christmas-india'] } },
            { k: 'c', n: 'Predict a date', m: 15, o: 'say roughly when one falls next year', use: {} } ],
          project: { id: 'u1p', name: 'Build the year', m: 95,
            brief: 'Draw a circle for the year and put twenty festivals on it in the right ' +
                   'place. Mark which ones your family actually keeps.',
            made: 'a year with your family marked on it' } },
        { id: 'u2', name: 'Harvest, everywhere, at once', hours: 3,
          objective: 'name four harvest festivals in four regions and what they share',
          lessons: [
            { k: 't', n: 'Pongal, Bihu, Lohri, Onam', m: 25, o: 'place each in its region', use: { ut: ['pongal', 'bihu', 'lohri', 'onam'] } },
            { k: 't', n: 'Why the same week', m: 25, o: 'connect to the crop calendar', use: { ut: ['makar-sankranti'] } },
            { k: 'p', n: 'Which region', m: 20, o: 'match festival to place', use: { ut: ['pongal', 'bihu', 'lohri', 'onam', 'nuakhai'] } },
            { k: 'c', n: 'A new one', m: 15, o: 'place a harvest festival you were not taught', use: {} } ],
          project: { id: 'u2p', name: 'Cook one harvest dish', m: 95,
            brief: 'Make one dish from a harvest festival that is not your family\'s — ' +
                   'pongal, pitha, til laddoo. Cook it with a grown-up. Eat it.',
            made: 'a dish from somebody else\'s festival' } },
        { id: 'u3', name: 'Spring', hours: 3,
          objective: 'say what Holi is actually about beyond the colour',
          lessons: [
            { k: 't', n: 'Holi and Hola Mohalla', m: 25, o: 'say how the two differ', use: { ut: ['holi', 'hola-mohalla'] } },
            { k: 't', n: 'The new years', m: 25, o: 'name four regional new years in one month', use: { ut: ['ugadi-gudi-padwa', 'baisakhi', 'poila-boishakh', 'puthandu'] } },
            { k: 'p', n: 'Whose new year', m: 20, o: 'match each to its region', use: { ut: ['ugadi-gudi-padwa', 'vishu', 'poila-boishakh', 'navroz'] } },
            { k: 'c', n: 'Cold', m: 15, o: 'do it a week later', use: {} } ],
          project: { id: 'u3p', name: 'Four new years', m: 95,
            brief: 'Find out how four different Indian communities greet each other at their ' +
                   'new year. Learn to say all four. Use one on the day.',
            made: 'four greetings, used on the right day' } },
        { id: 'u4', name: 'The monsoon festivals', hours: 3,
          objective: 'connect a festival to the weather it sits in',
          lessons: [
            { k: 't', n: 'Teej and the rain', m: 25, o: 'say what is being celebrated', use: { ut: ['teej'] } },
            { k: 't', n: 'Raksha Bandhan', m: 25, o: 'say what the thread means', use: { ut: ['raksha-bandhan'], ri: ['bhaiya', 'behan'] } },
            { k: 'p', n: 'Which season', m: 20, o: 'place fifteen festivals in a season', use: { ut: ['teej', 'ratha-yatra', 'janmashtami'] } },
            { k: 'c', n: 'Explain one', m: 15, o: 'explain a festival to someone who has never heard of it', use: {} } ],
          project: { id: 'u4p', name: 'Make a rakhi and send it', m: 95,
            brief: 'Make one by hand and send it to a cousin — including a cousin you have ' +
                   'never met. Post costs very little and arriving is the whole thing.',
            made: 'something posted to a relative' } },
        { id: 'u5', name: 'The big autumn', hours: 3,
          objective: 'explain why autumn is the loudest part of the year',
          lessons: [
            { k: 't', n: 'Navratri, Durga Puja, Dussehra', m: 25, o: 'say how three regions keep the same nine nights', use: { ut: ['navratri', 'durga-puja', 'vijayadashami'] } },
            { k: 't', n: 'Diwali is not one festival', m: 25, o: 'name what the five days are', use: { ut: ['diwali'] } },
            { k: 'p', n: 'Name the day', m: 20, o: 'identify each of the five days', use: { ut: ['diwali'] } },
            { k: 'c', n: 'Cold', m: 15, o: 'do it a week later', use: {} } ],
          project: { id: 'u5p', name: 'Run one day of Diwali', m: 95,
            brief: 'Take charge of one of the five days at home. Decide what happens, tell ' +
                   'everyone, and run it. A grown-up may help but you are in charge.',
            made: 'a day of a festival that you ran' } },
        { id: 'u6', name: 'The festivals that are not Hindu', hours: 3,
          objective: 'name six Indian festivals from six different faiths',
          lessons: [
            { k: 't', n: 'Eid in India', m: 25, o: 'say what happens and where it is biggest', use: { ut: ['eid-ul-fitr'] } },
            { k: 't', n: 'Gurpurab, Christmas, Losar, Navroz, Paryushana', m: 25, o: 'name what each marks', use: { ut: ['guru-nanak-gurpurab', 'christmas-india', 'losar', 'navroz', 'paryushana'] } },
            { k: 'p', n: 'Whose festival', m: 20, o: 'match fifteen to their tradition', use: { ut: ['eid-ul-fitr', 'christmas-india', 'mahavir-jayanti', 'buddha-purnima'] } },
            { k: 'c', n: 'Cold', m: 15, o: 'do it a week later', use: {} } ],
          project: { id: 'u6p', name: 'Go to one that is not yours', m: 95,
            brief: 'Go to a festival your family does not keep, or if you cannot, ask ' +
                   'somebody who does keep it to tell you how their house does it. Write down ' +
                   'what surprised you.',
            made: 'a festival seen from inside somebody else\'s year' } },
        { id: 'u7', name: 'Your own year', hours: 3,
          objective: 'run a festival, properly, for your household',
          lessons: [
            { k: 't', n: 'What a festival needs', m: 25, o: 'name the parts: food, people, a reason', use: {} },
            { k: 't', n: 'Keeping it far from home', m: 25, o: 'say what changes in the diaspora', use: {} },
            { k: 'p', n: 'The whole year', m: 20, o: 'place all thirty-eight', use: { ut: ['lohri', 'holi', 'onam', 'diwali', 'eid-ul-fitr', 'christmas-india'] } },
            { k: 'c', n: 'The long check', m: 15, o: 'the full year, cold', use: {} } ],
          project: { id: 'u7p', name: 'The family festival calendar', m: 95,
            brief: 'Make a calendar for the coming year with every festival your family keeps ' +
                   'AND three you would like to try. Put it on the fridge. Then keep it.',
            made: 'a calendar the house actually uses',
            share: true } }
      ],
      assignments: [
        { id: 'ua1', name: 'Phone someone on their festival', family: true,
          brief: 'Whenever a festival comes that a friend or relative keeps and you do not, ' +
                 'phone them on the day.' }
      ],
      sources: ['data-utsav.js — 38 festivals across faiths and regions']
    },

    /* ================================================================ 8 · GEET */
    {
      id: 'geet-course', name: 'Songs and Sounds', sub: 'The rhymes everybody\'s mother sang',
      hours: 21, ages: [4, 9], badge: 'katha', icon: 'sound', colour: '#4FBF8B',
      premium: false, ready: 75,
      blurb: 'Ninety-one songs, tongue twisters and counting rhymes — the ones that get into ' +
             'a child before they can read and stay for sixty years.',
      why: 'Song is how language enters a small child, and it is the single thing diaspora ' +
           'parents report losing first. You cannot teach a lullaby from a worksheet.',
      note: 'Not a Hindi course wearing a hat: the songs run across languages, and the last ' +
            'module is explicitly about the family\'s own.',
      modules: [
        { id: 'g1', name: 'The first rhymes', hours: 3,
          objective: 'sing three rhymes from memory, in time',
          lessons: [
            { k: 't', n: 'Machhli jal ki rani', m: 25, o: 'sing it through', use: { ge: ['machhli-jal-ki-rani'] } },
            { k: 't', n: 'Chanda mama', m: 25, o: 'sing it through', use: { ge: ['chanda-mama-door-ke'] } },
            { k: 'p', n: 'Keep the beat', m: 20, o: 'clap the beat while singing', use: { ge: ['machhli-jal-ki-rani', 'chanda-mama-door-ke'] } },
            { k: 'c', n: 'Without help', m: 15, o: 'sing one with no words on screen', use: {} } ],
          project: { id: 'g1p', name: 'Sing to someone smaller', m: 95,
            brief: 'Sing one rhyme to a baby or a small child. If there is no baby, sing it ' +
                   'to a grown-up, who will pretend to mind and will not.',
            made: 'the first time you passed one on' } },
        { id: 'g2', name: 'Counting and choosing', hours: 3,
          objective: 'use a counting rhyme to pick somebody, properly',
          lessons: [
            { k: 't', n: 'Akkad bakkad', m: 25, o: 'use it to choose', use: { ge: ['akkad-bakkad'] } },
            { k: 't', n: 'Atkan chatkan', m: 25, o: 'sing it', use: { ge: ['atkan-chatkan'] } },
            { k: 'p', n: 'Pick a person', m: 20, o: 'run the count correctly', use: { ge: ['akkad-bakkad'] } },
            { k: 'c', n: 'In a real game', m: 15, o: 'use it to start an actual game', use: {} } ],
          project: { id: 'g2p', name: 'Teach it in the playground', m: 95,
            brief: 'Teach one counting rhyme to friends who do not know it, and use it to ' +
                   'pick who is "it". Report whether it caught on.',
            made: 'a rhyme running in a playground that had never heard it' } },
        { id: 'g3', name: 'The lullabies', hours: 3,
          objective: 'sing one lullaby slowly enough to actually settle somebody',
          lessons: [
            { k: 't', n: 'Lalla lalla lori', m: 25, o: 'sing it at lullaby speed', use: { ge: ['lalla-lalla-lori'] } },
            { k: 't', n: 'What a lullaby is doing', m: 25, o: 'say why they are all slow', use: {} },
            { k: 'p', n: 'Slow it down', m: 20, o: 'sing the same song at three speeds', use: { ge: ['lalla-lalla-lori'] } },
            { k: 'c', n: 'From memory, slowly', m: 15, o: 'sing one right through', use: {} } ],
          project: { id: 'g3p', name: 'Ask for the one you were sung', m: 95,
            brief: 'Ask your mother, father or grandparent which lullaby was sung to YOU. ' +
                   'Learn it. Record them singing it if they will.',
            made: 'the song that was sung over you, in their voice',
            share: true } },
        { id: 'g4', name: 'Animal songs', hours: 3,
          objective: 'sing four animal songs and do the actions',
          lessons: [
            { k: 't', n: 'Hathi raja', m: 25, o: 'sing with the actions', use: { ge: ['hathi-raja-kahan-chale'] } },
            { k: 't', n: 'Bandar mama and the thirsty crow', m: 25, o: 'sing both', use: { ge: ['bandar-mama-pajama', 'ek-kauwa-pyaasa'] } },
            { k: 'p', n: 'Actions and words together', m: 20, o: 'do both at once without stopping', use: { ge: ['hathi-raja-kahan-chale'] } },
            { k: 'c', n: 'Lead it', m: 15, o: 'lead a group through one', use: {} } ],
          project: { id: 'g4p', name: 'The crow experiment', m: 95,
            brief: 'The thirsty crow drops pebbles to raise the water. Do it — a jar, some ' +
                   'water, some stones. Measure how far it rises. The song was right.',
            made: 'a song, proved with a measuring jug' } },
        { id: 'g5', name: 'Tongue twisters', hours: 3,
          objective: 'say three twisters fast without falling over',
          lessons: [
            { k: 't', n: 'Why they are hard', m: 25, o: 'say which sounds fight each other', use: {} },
            { k: 't', n: 'Three to learn', m: 25, o: 'say three cleanly at slow speed', use: {} },
            { k: 'p', n: 'Faster each time', m: 20, o: 'get through one at speed', use: {} },
            { k: 'c', n: 'Under pressure', m: 15, o: 'do it in front of somebody', use: {} } ],
          project: { id: 'g5p', name: 'The twister contest', m: 95,
            brief: 'Run a contest at home. Everybody tries. Time them. The grown-ups will be ' +
                   'worse than they expect, which is the entertainment.',
            made: 'a leaderboard, and some humbled adults' } },
        { id: 'g6', name: 'Songs with a game in them', hours: 3,
          objective: 'run a singing game with a group',
          lessons: [
            { k: 't', n: 'Poshampa', m: 25, o: 'run the game', use: { ge: ['poshampa'] } },
            { k: 't', n: 'Gol gol rani', m: 25, o: 'run it', use: { ge: ['gol-gol-rani'] } },
            { k: 'p', n: 'Lead both', m: 20, o: 'teach the rules to somebody', use: { ge: ['poshampa', 'gol-gol-rani'] } },
            { k: 'c', n: 'With strangers', m: 15, o: 'run one with children who do not know it', use: {} } ],
          project: { id: 'g6p', name: 'Run the games at a gathering', m: 95,
            brief: 'Next time there are children at your house, you run the games. Two ' +
                   'singing games, start to finish. You are in charge.',
            made: 'a room of children you organised' } },
        { id: 'g7', name: 'Your family\'s own songs', hours: 3,
          objective: 'sing one song in your family\'s language',
          lessons: [
            { k: 't', n: 'The same song, four languages', m: 25, o: 'hear one rhyme across languages', use: { ge: ['chanda-mama-door-ke'] } },
            { k: 't', n: 'What your house sings', m: 25, o: 'name a song only your family sings', use: {} },
            { k: 'p', n: 'Learn it properly', m: 20, o: 'get the words right', use: {} },
            { k: 'c', n: 'Sing it to them', m: 15, o: 'sing it back to whoever taught you', use: {} } ],
          project: { id: 'g7p', name: 'The family songbook', m: 95,
            brief: 'Collect every song anybody in your family can sing — words written down, ' +
                   'language named, who sings it. Even half-remembered ones. Especially ' +
                   'those: they are the ones about to be lost.',
            made: 'a songbook that did not exist before you made it',
            share: true } }
      ],
      assignments: [
        { id: 'ga1', name: 'One song a week in the car', family: true,
          brief: 'One song a week, sung in the car or at bath time. Rotate who picks.' }
      ],
      sources: ['data-geet.js — 91 songs, rhymes and twisters with recorded voices',
                'data-tongue.js — the mother-tongue list this course leans on']
    },

    /* ================================================================ 9 · VIGYAN */
    {
      id: 'vigyan-course', name: 'Vigyan', sub: 'Indian science, done not read',
      hours: 24, ages: [8, 12], badge: 'itihaas', icon: 'chart', colour: '#1F8A9E',
      premium: true, ready: 50,
      blurb: 'Zero, surgery, metallurgy, rockets — and every module ends with you actually ' +
             'building or measuring the thing.',
      why: 'Indian science gets taught to children as a list of firsts to be proud of. A ' +
           'list is not science. Doing it is.',
      note: 'Every claim here is badged Itihaas and carries its source. Where a popular claim ' +
            'is not well evidenced, the lesson says so — a course about evidence that is ' +
            'careless with evidence teaches the opposite of what it says.',
      needsReview: ['Module 8 touches contested claims about ancient technology. A reviewer ' +
                    'with a history-of-science background must sign it before publish.'],
      modules: [
        { id: 'v1', name: 'Zero', hours: 3,
          objective: 'explain why a symbol for nothing was hard to invent',
          lessons: [
            { k: 't', n: 'Counting without it', m: 25, o: 'try arithmetic in Roman numerals', use: { it: ['gupta'] } },
            { k: 't', n: 'Place value', m: 25, o: 'explain what the position does', use: { it: ['aryabhata'] } },
            { k: 'p', n: 'Do it the hard way', m: 20, o: 'multiply without zero', use: {} },
            { k: 'c', n: 'Explain it', m: 15, o: 'teach place value to somebody younger', use: {} } ],
          project: { id: 'v1p', name: 'Multiply like a Roman', m: 95,
            brief: 'Multiply 47 by 23 in Roman numerals. Actually do it. Time yourself. Then ' +
                   'do it normally and compare the times. That gap is the invention.',
            made: 'a measured reason zero mattered' } },
        { id: 'v2', name: 'Measuring the sky', hours: 3,
          objective: 'measure something you cannot reach',
          lessons: [
            { k: 't', n: 'Aryabhata\'s claim', m: 25, o: 'say what he said and how he could tell', use: { it: ['aryabhata'] } },
            { k: 't', n: 'Shadows as instruments', m: 25, o: 'explain how a shadow gives a height', use: {} },
            { k: 'p', n: 'Similar triangles', m: 20, o: 'work a height from a shadow', use: {} },
            { k: 'c', n: 'Something new', m: 15, o: 'measure a thing nobody set for you', use: {} } ],
          project: { id: 'v2p', name: 'Measure a building with a stick', m: 95,
            brief: 'Use a stick and its shadow to work out the height of a building or a ' +
                   'tree. Then check it another way. Write down both numbers, including if ' +
                   'they disagree.',
            made: 'a height you measured without touching it' } },
        { id: 'v3', name: 'Metal', hours: 3,
          objective: 'explain why the Delhi iron pillar has not rusted away',
          lessons: [
            { k: 't', n: 'The pillar', m: 25, o: 'say what it is and how old', use: { st: ['fk.iron-pillar'] } },
            { k: 't', n: 'Why iron rusts, and why that one does less', m: 25, o: 'give the chemical reason', use: { st: ['fk.iron-pillar'] } },
            { k: 'p', n: 'Rust conditions', m: 20, o: 'predict which nail rusts first', use: {} },
            { k: 'c', n: 'Explain the pillar', m: 15, o: 'explain it without hand-waving', use: {} } ],
          project: { id: 'v3p', name: 'The rust experiment', m: 95,
            brief: 'Four nails: dry, wet, salty water, and oiled. Leave them a week. ' +
                   'Photograph each day. Then say which condition the pillar is closest to.',
            made: 'a week of photographs and a conclusion' } },
        { id: 'v4', name: 'Surgery, long ago', hours: 3,
          objective: 'say what Sushruta described, and what the evidence for it is',
          lessons: [
            { k: 't', n: 'The compendium', m: 25, o: 'say what the text is and when it is dated', use: {} },
            { k: 't', n: 'What can be proved', m: 25, o: 'separate the text from the practice', use: {} },
            { k: 'p', n: 'Evidence or claim', m: 20, o: 'sort ten statements', use: {} },
            { k: 'c', n: 'Judge a new claim', m: 15, o: 'assess a claim you have not seen', use: {} } ],
          project: { id: 'v4p', name: 'Check a claim yourself', m: 95,
            brief: 'Find a claim online about ancient Indian science. Trace it to a source. ' +
                   'Often you cannot. Write down where the trail ends — that is the finding.',
            made: 'one claim, traced as far as it goes' } },
        { id: 'v5', name: 'Building things that stand up', hours: 3,
          objective: 'explain why a stepwell and a temple stay up',
          lessons: [
            { k: 't', n: 'Corbels and arches', m: 25, o: 'tell them apart', use: { it: ['temple-builders'] } },
            { k: 't', n: 'Water architecture', m: 25, o: 'say what a stepwell solves', use: { it: ['harappa'] } },
            { k: 'p', n: 'Which will stand', m: 20, o: 'predict which structure holds', use: {} },
            { k: 'c', n: 'Build one', m: 15, o: 'build a corbelled arch that stands', use: {} } ],
          project: { id: 'v5p', name: 'Build an arch', m: 95,
            brief: 'Build a corbelled arch from blocks or books that holds its own weight. ' +
                   'It will fall several times. Photograph the one that stands.',
            made: 'an arch that stands, after the ones that did not' } },
        { id: 'v6', name: 'Rockets', hours: 3,
          objective: 'explain what makes a rocket go up',
          lessons: [
            { k: 't', n: 'Mysore, and the first war rockets', m: 25, o: 'say what was new about them', use: {} },
            { k: 't', n: 'Kalam and the space programme', m: 25, o: 'name three Indian missions', use: { it: ['kalam', 'kalpana'] } },
            { k: 'p', n: 'Action and reaction', m: 20, o: 'explain thrust properly', use: {} },
            { k: 'c', n: 'Predict a flight', m: 15, o: 'say which design flies further and why', use: {} } ],
          project: { id: 'v6p', name: 'Launch something', m: 95,
            brief: 'Build a bottle rocket — water and air, outside, with a grown-up. Change ' +
                   'ONE thing between launches and measure the difference. That is the ' +
                   'experiment; the launch is just the fun.',
            made: 'two launches and one variable' } },
        { id: 'v7', name: 'The people doing it now', hours: 3,
          objective: 'name three living Indian scientists and what they work on',
          lessons: [
            { k: 't', n: 'Not all of them are men', m: 25, o: 'name four women in Indian science', use: { it: ['kalpana'] } },
            { k: 't', n: 'What a scientist actually does all day', m: 25, o: 'describe the boring 90%', use: {} },
            { k: 'p', n: 'Match the field', m: 20, o: 'match ten people to their work', use: {} },
            { k: 'c', n: 'Find one yourself', m: 15, o: 'find a scientist nobody told you about', use: {} } ],
          project: { id: 'v7p', name: 'Write to a scientist', m: 95,
            brief: 'Find a working Indian scientist whose work interests you and write them ' +
                   'one short, real question. Send it. Many answer. Keep the reply.',
            made: 'a letter sent to a stranger who does this for a living',
            share: true } },
        { id: 'v8', name: 'How to know what is true', hours: 3,
          objective: 'tell a sourced claim from a confident one',
          needsReview: 'contested claims about ancient technology — reviewer required',
          lessons: [
            { k: 't', n: 'Where a fact comes from', m: 25, o: 'name three kinds of source', use: {} },
            { k: 't', n: 'Claims that got ahead of the evidence', m: 25, o: 'give an example and say what is actually known', use: {} },
            { k: 'p', n: 'Sort twenty claims', m: 20, o: 'grade twenty by evidence', use: {} },
            { k: 'c', n: 'The long check', m: 15, o: 'everything, cold', use: {} } ],
          project: { id: 'v8p', name: 'The science fair entry', m: 95,
            brief: 'Take any experiment from this course, do it properly with a control, and ' +
                   'write it up: question, method, result, what you would do differently. ' +
                   'Enter it somewhere if you can.',
            made: 'a real write-up with a control in it',
            share: true } }
      ],
      assignments: [
        { id: 'va1', name: 'One measurement a week', family: true,
          brief: 'Measure one thing a week that nobody asked you to measure, and write the ' +
                 'number down.' }
      ],
      sources: ['data-stories-vigyan.js — the science stories',
                'data-itihaas.js — Aryabhata, the Gupta period, Kalam and Kalpana Chawla']
    },

    /* ================================================================ 10 · GITA */
    /* THE FLAGSHIP, AND THE MOST CONSTRAINED THING IN THIS FILE.
       Fourteen parts, and not one of them quotes a verse this app cannot attribute.
       Everything here is built from three sourced places and nothing else:
         · the five Gita verses in data-shlok.js, with chapter and verse
         · episode 26 of data-epic-mahabharata.js, which retells the conversation in the
           storyteller's own words and says outright that the seven hundred verses live on
           the verse shelf and that nobody should hand a child a made-up version
         · the parva list and cast of the same file
       The chapter NAMES of the Gita are not in this app except chapter 2's, so there is
       no eighteen-chapter map here. An eighteen-chapter map would be seventeen names
       written from memory, which is the exact thing docs/05 §3 forbids. Part 13 says so
       to the child rather than hiding it. */
    {
      id: 'gita-course', name: 'Arjuna\'s Questions', sub: 'The Gita, as the questions a boy asks',
      hours: 42, ages: [9, 12], badge: 'dharma', icon: 'star', colour: '#8E6AC8',
      premium: true, ready: 40,
      blurb: 'A soldier puts his bow down between two armies and says he cannot do it. What ' +
             'his friend says back is the longest argument in Indian literature about doing ' +
             'the right thing when the right thing is unbearable.',
      why: 'Families ask for this more than for anything else. Taught as doctrine it is ' +
           'unusable at this age and unfair to the households that do not share it. Taught ' +
           'as Arjuna\'s questions it is a course about hard choices, which every child ' +
           'already has, and it can be honest about how much of the text it is not showing.',
      note: 'Presented from the inside, as a Hindu text that Hindus hold sacred — and NOT as ' +
            'the Indian moral text. Neeti carries ethics across Jain, Buddhist, Tamil and ' +
            'Sikh sources, and it is the one to reach for if you want ethics without one ' +
            'tradition\'s frame.',
      /* what leaves the screen. The print pack renders these. */
      /* NO COUNTS IN THIS SENTENCE. It said "five verse cards in Devanagari" while seven
         rendered in three scripts, because module 9 cites a Thirukkural and a Dhammapada
         verse on purpose. A number written by hand beside a number generated by code
         will disagree eventually; the pack counts its own cards. */
      takeHome: 'verse cards with transliteration and attribution, a question to ask at the ' +
                'table for every part, something to do at home for every part, and every ' +
                'project brief with room to write on.',
      needsReview: ['THIS COURSE DOES NOT PUBLISH WITHOUT A NAMED REVIEWER from within the ' +
                    'tradition. docs/05 §6 — doctrinal content is for a human author with a ' +
                    'named reviewer, and nothing here is an exception.',
                    'ONLY FIVE GITA VERSES EXIST SOURCED IN THIS APP (2.47, 2.63, 6.5, 6.17, ' +
                    '12.13) out of seven hundred. Part 13 tells the child this outright. ' +
                    'Nothing in this file quotes, paraphrases-as-quotation or reconstructs a ' +
                    'verse, and no chapter is named that this app cannot attribute. ' +
                    'docs/21-gita.md carries the worklist for sourcing more.'],
      modules: [
        { id: 'q1', name: 'The war this interrupts', hours: 3,
          objective: 'say what is about to happen when the chariot stops',
          talk: 'If two sides of one family went to war, whose side would our family have been on — and would that have been the right one?',
          home: 'Find out the longest argument in your own family that anybody still remembers. Who stopped talking to whom, and for how long?',
          lessons: [
            { k: 't', n: 'Eighteen days that have not started', m: 25, o: 'say where in the Mahabharata this sits', use: { mb: [26] } },
            { k: 't', n: 'Thirteen years of wanting it', m: 25, o: 'say why Arjuna wanted this war', use: { mb: [25, 26] } },
            { k: 'p', n: 'Before or after', m: 20, o: 'place ten events either side of the chariot stopping', use: { mb: [25, 26, 27] } },
            { k: 'c', n: 'Set the scene', m: 15, o: 'describe the moment to somebody who knows nothing', use: {} } ],
          project: { id: 'q1p', name: 'Draw the field', m: 95,
            brief: 'Draw the two armies with the chariot stopped between them. Put the names ' +
                   'you know on both sides. You will find you know people on each.',
            made: 'a battlefield with your own labels on it' } },
        { id: 'q2', name: 'A man who does not want to fight', hours: 3,
          objective: 'say what Arjuna\'s problem actually is',
          talk: 'Has anyone here ever refused to do something everybody expected you to do?',
          home: 'Ask a grown-up about a time they said no when saying yes would have been easier.',
          lessons: [
            { k: 't', n: 'He looks along the other side', m: 25, o: 'say what he sees that he had not seen', use: { mb: [26] } },
            { k: 't', n: 'This is not cowardice', m: 25, o: 'explain the difference', use: { mb: [26] } },
            { k: 'p', n: 'Frightened or unwilling', m: 20, o: 'tell them apart in ten cases', use: {} },
            { k: 'c', n: 'State the problem', m: 15, o: 'state the dilemma in your own words', use: {} } ],
          project: { id: 'q2p', name: 'Your own impossible choice', m: 95,
            brief: 'Write down one time you had to choose and both choices were bad. Not a ' +
                   'made-up one. This is the thing the whole course is about, and part 14 ' +
                   'comes back to it.',
            made: 'your own version of the problem' } },
        { id: 'q3', name: 'The family on both sides', hours: 3,
          objective: 'name who is standing opposite, and what each one is to Arjuna',
          talk: 'Who in our family would you find it hardest to argue with, and why?',
          home: 'Draw our family tree as far as anybody can remember, using the proper words.',
          lessons: [
            { k: 't', n: 'His grandfather, his teacher, his cousins', m: 25, o: 'name three and the relation', use: { mb: [26], ri: ['dada', 'bhaiya'] } },
            { k: 't', n: 'The right word for each', m: 25, o: 'use the kinship terms correctly', use: { ri: ['dada', 'taya', 'chacha', 'bhaiya', 'mama'] } },
            { k: 'p', n: 'Who is what', m: 20, o: 'label the Kuru tree', use: { ri: ['dada', 'chacha', 'bhaiya', 'chachera'] } },
            { k: 'c', n: 'Cold', m: 15, o: 'rebuild the tree a week later', use: {} } ],
          project: { id: 'q3p', name: 'The two-sided tree', m: 95,
            brief: 'Draw the Kuru family with the right kinship word under every name, and ' +
                   'colour which side each stood on. The quarrel makes sense once you can ' +
                   'see it.',
            made: 'a family tree with a war drawn through it' } },
        { id: 'q4', name: 'Where the seven hundred verses are', hours: 3,
          objective: 'say what the Gita is, physically, and where it sits',
          talk: 'Is it better to read a little of something properly, or all of it badly?',
          home: 'Find out whether anybody in our family owns a copy, and in which language.',
          lessons: [
            { k: 't', n: 'A conversation inside a war book', m: 25, o: 'say which parva holds it', use: { sh: ['gita'], mb: [26] } },
            { k: 't', n: 'Why this app shows you five', m: 25, o: 'explain why a made-up verse is worse than no verse', use: { sh: ['gita'] } },
            { k: 'p', n: 'Sourced or not', m: 20, o: 'tell an attributed verse from an unattributed claim', use: { sh: ['gita-2-47', 'kural-1', 'dhp-1'] } },
            { k: 'c', n: 'Check a claim', m: 15, o: 'assess a quotation you find somewhere else', use: {} } ],
          project: { id: 'q4p', name: 'Find a real copy', m: 95,
            brief: 'Find an actual printed Gita — a house, a library, a temple, a shop. ' +
                   'Photograph or write down the publisher, the translator and the year. ' +
                   'That is what attribution looks like.',
            made: 'a real edition, with its translator named' } },
        { id: 'q5', name: 'Do the work, not the prize', hours: 3,
          objective: 'explain what it means to act without acting for the result',
          talk: 'What is one thing we do in this house only because of what we get for it?',
          home: 'For one week, do a chore without telling anyone you did it.',
          lessons: [
            { k: 't', n: 'The verse everyone knows', m: 25, o: 'say what 2.47 actually says', use: { sh: ['gita-2-47'] } },
            { k: 't', n: 'And the excuse it is not', m: 25, o: 'say why this is not permission to stop', use: { sh: ['gita-2-47'] } },
            { k: 'p', n: 'Result or work', m: 20, o: 'sort ten motives', use: { sh: ['gita-2-47'] } },
            { k: 'c', n: 'A case of your own', m: 15, o: 'apply it to something in your week', use: {} } ],
          project: { id: 'q5p', name: 'One week, no scoreboard', m: 95,
            brief: 'Pick something you usually do for the marks, the praise or the win. Do it ' +
                   'for a week without telling anyone how it went. Write down whether it got ' +
                   'better or worse.',
            made: 'a week of work with the prize taken out' } },
        { id: 'q6', name: 'Anger', hours: 3,
          objective: 'trace what anger does, step by step',
          talk: 'Where on the chain does each of us usually lose it — and who is best at stopping early?',
          home: 'Put the chain on the fridge. Anyone may point at it, including at a grown-up.',
          lessons: [
            { k: 't', n: 'The chain', m: 25, o: 'recite the sequence in 2.63 in order', use: { sh: ['gita-2-63'] } },
            { k: 't', n: 'Nine seconds', m: 25, o: 'name the point where it can still be stopped', use: { sh: ['gita-2-63'], va: ['kshama'] } },
            { k: 'p', n: 'Where in the chain', m: 20, o: 'place ten moments on the chain', use: { sh: ['gita-2-63'] } },
            { k: 'c', n: 'Your own chain', m: 15, o: 'map one of your own losses of temper', use: {} } ],
          project: { id: 'q6p', name: 'The anger log', m: 95,
            brief: 'For two weeks, write one line every time you lose your temper — what ' +
                   'started it and where on the chain you could have stopped. Nobody else ' +
                   'reads this.',
            made: 'two weeks of evidence about yourself' } },
        { id: 'q7', name: 'Your own friend or your own enemy', hours: 3,
          objective: 'explain what it means to be your own worst opponent',
          talk: 'Name one habit of your own that is working against you. Everyone answers, including the grown-ups.',
          home: 'Pick the smallest one and keep a four-week chart on the wall.',
          lessons: [
            { k: 't', n: 'Lift yourself', m: 25, o: 'say what 6.5 asks of you', use: { sh: ['gita-6-5'] } },
            { k: 't', n: 'The habits that are against you', m: 25, o: 'name three of your own', use: { sh: ['gita-6-5'] } },
            { k: 'p', n: 'Friend or enemy', m: 20, o: 'sort ten habits', use: { sh: ['gita-6-5'] } },
            { k: 'c', n: 'Pick one to change', m: 15, o: 'name one and a plan', use: {} } ],
          project: { id: 'q7p', name: 'Beat one habit', m: 95,
            brief: 'Pick the smallest habit that is working against you. Four weeks. Mark ' +
                   'every day you beat it and every day you did not. Both marks count.',
            made: 'four weeks of honest marks' } },
        { id: 'q8', name: 'Not too much of anything', hours: 3,
          objective: 'explain what an even mind is and what it is not',
          talk: 'What does this family overdo? Food, screens, work, worrying — pick one each.',
          home: 'Everyone picks one thing to keep moderate for a week, and reports on Sunday.',
          lessons: [
            { k: 't', n: 'Same in heat and cold', m: 25, o: 'say what 6.17 recommends', use: { sh: ['gita-6-17'] } },
            { k: 't', n: 'Not feeling nothing', m: 25, o: 'separate steadiness from numbness', use: { sh: ['gita-6-17'] } },
            { k: 'p', n: 'Steady or shut down', m: 20, o: 'tell them apart in ten cases', use: { sh: ['gita-6-17'] } },
            { k: 'c', n: 'Under something real', m: 15, o: 'notice your own reaction to a setback', use: {} } ],
          project: { id: 'q8p', name: 'The moderate week', m: 95,
            brief: '6.17 is about not overdoing things — food, sleep, work, play. Pick one ' +
                   'and keep it moderate for a week. Write what was hard about it.',
            made: 'one week of not overdoing one thing' } },
        { id: 'q9', name: 'What a good person is like', hours: 3,
          objective: 'list the qualities in 12.13 and find one in someone you know',
          talk: 'Who do we know who has one of these without ever mentioning it?',
          home: 'Write the half-page about them and actually give it to them.',
          lessons: [
            { k: 't', n: 'The list', m: 25, o: 'name the qualities in 12.13', use: { sh: ['gita-12-13'] } },
            { k: 't', n: 'Where else this list appears', m: 25, o: 'find the same qualities in another tradition', use: { va: ['karuna', 'ahimsa'], sh: ['kural-1', 'dhp-1'] } },
            { k: 'p', n: 'Spot the quality', m: 20, o: 'identify qualities in described behaviour', use: { sh: ['gita-12-13'] } },
            { k: 'c', n: 'In a real person', m: 15, o: 'name someone you know and which quality', use: {} } ],
          project: { id: 'q9p', name: 'The person you know', m: 95,
            brief: 'Write half a page about someone you actually know who has one of these ' +
                   'qualities, with the thing they did that proves it. Then give it to them.',
            made: 'something you gave to a person about themselves',
            share: true } },
        { id: 'q10', name: 'The sound of it', hours: 3,
          objective: 'recite one verse in Sanskrit, correctly, from memory',
          talk: 'Who in this family can still recite something they learned at seven?',
          home: 'Learn one verse together. Ten minutes a day, out loud, for a week.',
          lessons: [
            { k: 't', n: 'What the sound is doing', m: 25, o: 'say why these were made to be heard', use: { sh: ['gita-2-47'] } },
            { k: 't', n: 'Reading the transliteration', m: 25, o: 'read a verse from its Roman spelling', use: { sh: ['gita-2-47', 'gita-2-63'] } },
            { k: 'p', n: 'Say it with the voice', m: 20, o: 'keep up with the recording', use: { sh: ['gita-2-47', 'gita-6-5'] } },
            { k: 'c', n: 'From memory', m: 15, o: 'recite one without the text', use: { sh: ['gita-2-47'] } } ],
          project: { id: 'q10p', name: 'Recite it to somebody', m: 95,
            brief: 'Learn one of the five by heart — the sound, not just the meaning — and ' +
                   'recite it to a grandparent or an elder. This is how these travelled for ' +
                   'three thousand years before anybody printed one.',
            made: 'a verse you carry without a book',
            share: true } },
        { id: 'q11', name: 'Two readings, both old', hours: 3,
          objective: 'hold two readings of the same passage without collapsing them',
          talk: 'Can two people read the same thing and both be right? When does that stop being true?',
          home: 'Ask three adults what the Gita means to them. Write all three down, uncorrected.',
          lessons: [
            { k: 't', n: 'A battlefield, or a person', m: 25, o: 'state both readings', use: { mb: [26] } },
            { k: 't', n: 'It has carried both for centuries', m: 25, o: 'say why neither killed the other', use: { mb: [26], sh: ['gita'] } },
            { k: 'p', n: 'Whose reading', m: 20, o: 'attribute five readings', use: {} },
            { k: 'c', n: 'Your own reading', m: 15, o: 'say which you find most honest and why', use: {} } ],
          project: { id: 'q11p', name: 'Ask three people', m: 95,
            brief: 'Ask three adults what the Gita means to them. Write down all three ' +
                   'answers without arguing with any of them. They will not agree, and the ' +
                   'disagreement is the finding.',
            made: 'three answers, none corrected' } },
        { id: 'q12', name: 'Gandhi read it as non-violence', hours: 3,
          objective: 'explain how a battlefield text became a handbook for not fighting',
          talk: 'Is it fair to read a book against what it seems to say?',
          home: 'Find one thing Gandhi actually wrote about it. Note where you found it.',
          lessons: [
            { k: 't', n: 'The whole field as one person', m: 25, o: 'state Gandhi\'s reading', use: { it: ['gandhi'], mb: [26] } },
            { k: 't', n: 'Ahimsa, and how far it travels', m: 25, o: 'connect it to the value', use: { va: ['ahimsa'], it: ['gandhi'] } },
            { k: 'p', n: 'Which reading fits', m: 20, o: 'match readings to passages', use: { va: ['ahimsa'] } },
            { k: 'c', n: 'Argue the other side', m: 15, o: 'make the case against Gandhi\'s reading, fairly', use: {} } ],
          project: { id: 'q12p', name: 'The case against your own view', m: 95,
            brief: 'Whichever reading you prefer, write the best possible case for the other ' +
                   'one. Half a page. You do not have to believe it — you have to make it ' +
                   'good enough that somebody who holds it would recognise themselves.',
            made: 'the strongest version of a view you do not hold' } },
        { id: 'q13', name: 'What this course does not teach you', hours: 3,
          objective: 'say honestly how much of the Gita you have and have not met',
          needsVerse: true,
          talk: 'What else do we think we know that we have only met five pieces of?',
          home: 'Go to a real copy and look at how many chapters there are. Count them yourself.',
          lessons: [
            { k: 't', n: 'Five of seven hundred', m: 25, o: 'say what fraction you have seen', use: { sh: ['gita'] } },
            { k: 't', n: 'Why there is no chapter map here', m: 25, o: 'explain why naming from memory is not allowed', use: { sh: ['gita'] } },
            { k: 'p', n: 'Known or assumed', m: 20, o: 'sort ten statements about the text', use: { sh: ['gita', 'gita-2-47'] } },
            { k: 'c', n: 'Say what you do not know', m: 15, o: 'list three things about it you cannot yet answer', use: {} } ],
          project: { id: 'q13p', name: 'Your own list of questions', m: 95,
            brief: 'Write down every question about the Gita this course did not answer. ' +
                   'Take the list to somebody who has read all of it. That list is worth ' +
                   'more than a summary you were handed.',
            made: 'a list of what you still want to know' } },
        { id: 'q14', name: 'Back to your own battlefield', hours: 3,
          objective: 'apply one idea from the course to a real choice of your own',
          talk: 'Everyone say one hard choice they are carrying right now. No advice given — just said out loud.',
          home: 'Put the five verses somewhere they can be seen for a month.',
          lessons: [
            { k: 't', n: 'What Arjuna does at the end', m: 25, o: 'say what he decides and who decides it', use: { mb: [26] } },
            { k: 't', n: 'Think about it, then choose for yourself', m: 25, o: 'say why that last instruction is unusual', use: { mb: [26] } },
            { k: 'p', n: 'Which idea fits', m: 20, o: 'match five dilemmas to five ideas', use: { sh: ['gita-2-47', 'gita-2-63', 'gita-6-5'] } },
            { k: 'c', n: 'The long check', m: 15, o: 'all five verses and what each is about, cold', use: { sh: ['gita-2-47', 'gita-2-63', 'gita-6-5', 'gita-6-17', 'gita-12-13'] } } ],
          project: { id: 'q14p', name: 'Your own charioteer', m: 95,
            brief: 'Go back to the impossible choice you wrote in part 2. Write what you ' +
                   'would say to yourself about it now. You may not have changed your mind. ' +
                   'Say that if so — the Gita\'s own last instruction is to think about it ' +
                   'and then decide for yourself.',
            made: 'the same question, answered by someone fourteen parts older',
            share: true } }
      ],
      assignments: [
        { id: 'qa1', name: 'One verse learned by heart', family: true,
          brief: 'Learn one of the five properly — the Sanskrit, the sound, and what it ' +
                 'means. Recite it to whoever in your family will be pleased.' },
        { id: 'qa2', name: 'The question at dinner', family: true,
          brief: 'Each part of this course carries one question to ask at the table. Ask it ' +
                 'on the night you finish that part. Nobody has to answer well.' },
        { id: 'qa3', name: 'Ask somebody who disagrees', family: true,
          brief: 'Find one adult who reads this text differently from the adults in your ' +
                 'house, and ask them why. Listen without arguing.' }
      ],
      sources: ['data-shlok.js — the five sourced Gita verses (2.47, 2.63, 6.5, 6.17, ' +
                '12.13), each with chapter and verse attribution, and the collection note ' +
                'placing the Gita inside the Bhishma Parva of the Mahabharata',
                'data-epic-mahabharata.js episode 26 "A Talk Between Friends" — the ' +
                'conversation retold in the storyteller\'s own words, which states outright ' +
                'that the verses themselves are in Sanskrit on the verse shelf and that ' +
                'nobody should hand a child a made-up version of them',
                'data-epic-mahabharata.js — the parva list, for where the Gita sits',
                'docs/21-gita.md — what is sourced, what is blocked, and the worklist for a ' +
                'human reviewer']
    },
  ]
};
