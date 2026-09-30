#!/usr/bin/env node
/* Bizzing India — author the workshop tasks, with every fact READ OFF THE CORPUS.
   ==================================================================================
   The copy in here is written by a person. The FACTS are not: a festival's months, an
   era's dates, what a kinship word means, how a Hindi word is spelled in Devanagari —
   every one of those is looked up in the data file that owns it, at generation time.

   That is not tidiness, it is docs/05. "Never write history from memory" and "Devanagari
   is set correctly or not at all" are the two easiest rules in this repo to break by
   typing a plausible thing, and a task file is nothing BUT plausible things: forty short
   strings that each look right. A generator cannot misremember a matra.

   Run:  node tools/gen-paath-tasks.js          # write them into app/data-paath.js
         node tools/gen-paath-tasks.js --dry    # print what it would write
*/
const fs = require('fs');
const path = require('path');
const APP = path.join(__dirname, '..', 'app');

global.window = global.window || {};
['bhasha.js', 'data-geo.js', 'data-itihaas.js', 'data-utsav.js', 'data-rishtey.js', 'data-geet.js',
 'data-neeti.js', 'data-states.js', 'data-epic-ramayana.js', 'data-epic-mahabharata.js',
 'data-shlok.js', 'data-paath.js'].forEach(f => require(path.join(APP, f)));
const W = global.window;

/* ------------------------------------------------------------------ the corpus */
const lex = {};
(W.IND_PACKS.hi.lexicon || []).forEach(x => { lex[x.roman] = x; });
const word = r => {
  const w = lex[r];
  if (!w) throw new Error(`no "${r}" in the Hindi lexicon — do not type one in`);
  return w;
};
const era = id => {
  const e = (W.IND_ITIHAAS.eras || []).find(x => x.id === id);
  if (!e) throw new Error(`no era "${id}"`);
  return e;
};
const fest = id => {
  const f = (W.IND_UTSAV.festivals || []).find(x => x.id === id);
  if (!f) throw new Error(`no festival "${id}"`);
  return f;
};
const kin = id => {
  const k = (W.IND_RISHTEY.terms || []).find(x => x.id === id);
  if (!k) throw new Error(`no kinship term "${id}"`);
  return k;
};
const val = id => {
  const v = (W.IND_NEETI.values || []).find(x => x.id === id);
  if (!v) throw new Error(`no value "${id}"`);
  return v;
};
const song = id => {
  const g = (W.IND_GEET.songs || []).concat(W.IND_GEET.bhajans || []).find(x => x.id === id);
  if (!g) throw new Error(`no song "${id}"`);
  return g;
};
const ep = (which, n) => {
  const list = which === 'r' ? W.IND_EPIC_RAMAYANA.episodes : W.IND_EPIC_MAHABHARATA.episodes;
  const e = (list || []).find(x => x.n === n);
  if (!e) throw new Error(`no ${which} episode ${n}`);
  return e;
};
const state = code => {
  const s = W.IND_STATES[code];
  if (!s) throw new Error(`no state "${code}"`);
  return s;
};
/* a state's NAME comes from the geo data; data-states.js carries only the code */
const stName = code => {
  const g = W.IND_GEO.states[code];
  if (!g || !g.name) throw new Error(`no name for state "${code}" in data-geo.js`);
  return g.name;
};
const river = id => {
  const r = (W.IND_GEO.rivers || []).find(x => x.id === id);
  if (!r) throw new Error(`no river "${id}"`);
  return r;
};
/* an epic's books carry a real name ("Bala Kanda"); an episode carries only the key */
const book = (which, key) => {
  const E = which === 'r' ? W.IND_EPIC_RAMAYANA : W.IND_EPIC_MAHABHARATA;
  const b = (E.books || []).find(x => x.id === key);
  if (!b) throw new Error(`no ${which} book "${key}"`);
  return b.name;
};
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const letter = ch => {
  const sc = W.IND_SCRIPTS.devanagari;
  const l = [].concat(sc.consonants || [], sc.vowels || []).find(x => (x.char || x) === ch);
  if (!l) throw new Error(`"${ch}" is not in the Devanagari script table`);
  return l;
};

/* the months a festival falls in, said the way the app says them elsewhere */
const months = id => fest(id).months.join(' or ');
/* a song's own vocabulary, which is where its Devanagari comes from */
const songWord = (sid, roman) => {
  const w = (song(sid).words || []).find(x => x.roman === roman);
  if (!w) throw new Error(`"${roman}" is not in the vocabulary of ${sid}`);
  return w;
};

/* ------------------------------------------------------------------ the tasks */
/* Keyed by project id. The copy is authored; every fact comes from above. */
const T = {};
const write = (pid, roman, title, say) => {
  const w = word(roman);
  T[pid] = { k: 'write', title, say, target: w.word, roman: w.roman, clue: w.en };
};
const trace = (pid, ch, title, say) => { letter(ch); T[pid] = { k: 'trace', letter: ch, title, say }; };
const own = (pid, title, clue, say) => { T[pid] = { k: 'writeOwn', title, clue, say }; };
const order = (pid, title, say, items) => { T[pid] = { k: 'order', title, say, items: items.slice(), answer: items.slice() }; };
const match = (pid, title, say, pairs) => { T[pid] = { k: 'match', title, say, pairs }; };

/* ===== 1. HINDI, FROM ZERO — the script is the whole point, so it is typed and traced */
own('h1p', 'Write your name here first', 'Your own name, in Devanagari',
  'Use the letters below — they are the Devanagari board, not a phone keyboard, because ' +
  'a consonant and then a sign hung on it IS how the writing works. Then write it on paper.');
trace('h2p', 'क', 'Form the letter first',
  'Trace it until the shape is yours, then go and find it in the kitchen. The canvas ' +
  'measures the FORM of the letter — it does not know the order the strokes should go in, ' +
  'and it says so.');
write('h3p', 'doodh', 'One word first',
  'The course holds this one, so the app can mark it properly. Get it right here, then ' +
  'write the whole list on paper.');
write('h4p', 'ghar', 'Label one thing here first',
  'Start with the word you are going to stick on the front door. Then make the other nine.');
trace('h5p', 'म', 'The one with the long tail',
  'म turns up in माँ, in मैं and in नमस्ते. Trace it before you go hunting for it.');
match('h6p', 'Pair the word with what it means',
  'Six words from the course. Tap one on the left, then tap what it means.',
  ['maa', 'paani', 'kitaab', 'dost', 'gaana', 'skool']
    .map(r => [word(r).word, word(r).en]));
write('h7p', 'dhanyavaad', 'The one you will use most',
  'A long word with a conjunct in it — this is the one that shows you can really write.');
own('h8p', 'Write one sentence about yourself', 'Anything true, in Devanagari',
  'The app cannot know whether it is true, and it will not pretend to. It checks that ' +
  'every sign is hung on a letter — that the writing is put together right.');
match('h9p', 'Which side of the family?',
  'Every word here is a relative. Pair each one with who they are.',
  ['dada', 'nani', 'chacha', 'bua', 'mama', 'mausi'].map(id => [kin(id).hi, kin(id).en]));
own('h10p', 'Write the thing you want to say', 'In Devanagari, as long as you like',
  'The last one is yours. Say it out loud to somebody afterwards — that is the half no ' +
  'app can do for you.');

/* ===== 2. NEETI — twelve values across four traditions */
match('n1p', 'Pair the word with what it asks of you',
  'Six of the twelve. Tap a word, then tap what it means.',
  ['ahimsa', 'satya', 'karuna', 'seva', 'sahas', 'kshama'].map(id => [val(id).term, val(id).en]));
match('n2p', 'The other six',
  'The rest of the twelve, the same way.',
  ['dhairya', 'buddhi', 'vidya', 'kritagyata', 'namrata', 'vachan'].map(id => [val(id).term, val(id).en]));
write('n3p', 'shabd', 'Write the word for it',
  'A promise is made of these. One word, in Devanagari, before you write yours on paper.');
match('n4p', 'Which value is the story about?',
  'Each of these is a value this course teaches. Pair it with the plain English.',
  ['seva', 'namrata', 'dhairya', 'kritagyata'].map(id => [val(id).roman, val(id).en]));
own('n5p', 'Write the one you are going to try', 'The value you picked, in Devanagari',
  'The app checks the writing, not the choice. The choice is nobody else’s.');
match('n6p', 'The hard ones',
  'These four pull against each other in real life. Pair each with what it means first.',
  ['satya', 'karuna', 'vachan', 'kshama'].map(id => [val(id).term, val(id).en]));
write('n7p', 'dost', 'One word first',
  'Most of these values are about somebody else. Write the word for that somebody.');
own('n8p', 'Write what you did', 'One line, in Devanagari',
  'A bead is for something you DID. Nobody checks it and nothing scores it — this box ' +
  'just makes sure the writing is put together right.');

/* ===== 3. RISHTEY — the words themselves are the subject */
match('r1p', 'The four grandparents',
  'Tap a word, then tap whose parent they are. This is the one English cannot do.',
  ['dada', 'dadi', 'nana', 'nani'].map(id => [kin(id).hi, kin(id).en]));
match('r2p', "Your father's side",
  'Every one of these is on one side of the family only. Pair them up.',
  ['taya', 'tai', 'chacha', 'chachi', 'bua', 'phupha'].map(id => [kin(id).hi, kin(id).en]));
match('r3p', "Your mother's side",
  'The other side. Notice that the words are completely different — that is the lesson.',
  ['mama', 'mami', 'mausi', 'mausa'].map(id => [kin(id).hi, kin(id).en]));
match('r4p', 'Older or younger?',
  'Hindi makes you say which. Pair each word with exactly who it means.',
  ['bhaiya', 'didi', 'taya', 'chacha'].map(id => [kin(id).hi, kin(id).en]));
write('r5p', 'parivaar', 'Write the word for all of them',
  'One word covers the whole tree you are about to draw.');
match('r6p', 'Say it to the right person',
  'Four you will actually use at a wedding. Pair each with who it is.',
  ['nana', 'nani', 'mama', 'mami'].map(id => [kin(id).hi, kin(id).en]));
own('r7p', 'Write your own family word', 'Whatever your family actually says',
  'Many families use a word that is not on any list — a Tamil one, a Gujarati one, or ' +
  'one only your house uses. Write it here. The app checks the script, never the word.');

/* ===== 4. THE STORY OF INDIA — the timeline is the corpus, in its own order */
order('i1p', 'Put the four in order first',
  'Oldest at the top. The course holds this order, so the app marks it — and then you go ' +
  'and play the age you just placed.',
  ['harappa', 'vedic', 'maurya', 'gupta'].map(id => era(id).title));
match('i2p', 'When was it?',
  'Four ages and four spans of time. Pair each age with when it was.',
  ['harappa', 'buddha-age', 'maurya', 'gupta'].map(id => [era(id).title, era(id).when]));
order('i3p', 'The next four, in order',
  'The south and the temple builders sit alongside the north, not after it — but these ' +
  'four still have an order.',
  ['gupta', 'chola', 'sultanate-mughal', 'marathas-sikhs'].map(id => era(id).title));
match('i4p', 'Match the age to its span',
  'The later half of the river. Pair each with when it was.',
  ['chola', 'temple-builders', 'sultanate-mughal', 'marathas-sikhs'].map(id => [era(id).title, era(id).when]));
order('i5p', 'The whole river, in order',
  'All eight. This is the one to get right before you make the timeline on paper.',
  ['harappa', 'vedic', 'buddha-age', 'maurya', 'gupta', 'chola', 'sultanate-mughal', 'marathas-sikhs']
    .map(id => era(id).title));
match('i6p', 'Which age?',
  'Four spans of years. Put the right age against each.',
  ['vedic', 'souths', 'colonial', 'modern'].map(id => [era(id).when, era(id).title]));
order('i7p', 'The last four',
  'The part your grandparents lived through, and the part you are living in.',
  ['colonial', 'freedom', 'modern', 'naya-bharat'].map(id => era(id).title));
write('i8p', 'kahaani', 'Write the word first',
  'History is not the same thing as a story, and this course spends a whole part on the ' +
  'difference. Write the word for the other one.');
order('i9p', 'Put these in order',
  'Three of them are within a lifetime of each other. The order still matters.',
  ['colonial', 'freedom', 'modern'].map(id => era(id).title));
own('i10p', 'Write what you would carve', 'One line, in Devanagari',
  'Ashoka had his put on rock so it would outlast him. Write yours here first.');

/* ===== 5. MY INDIA — every name, capital, language and river from data-geo / data-states.
   The first draft of this block had a monsoon-onset order typed from memory. It is true
   as it happens, and that is exactly the trap: it was not in the corpus, it had no
   source, and docs/05 does not have an exception for facts that turn out right. */
match('b1p', 'Which state is this the capital of?',
  'Four capitals. Pair each with its state.',
  ['RJ', 'TN', 'WB', 'KL'].map(code => [W.IND_GEO.states[code].capital, stName(code)]));
order('b2p', 'Follow the Ganga',
  'From the glacier to the sea — put the states in the order the river reaches them.',
  river('ganga').states.map(stName));
own('b3p', 'Write the city you are tracking', 'A city in India, in Devanagari',
  'The one whose weather you are about to follow for a month. The app checks the writing; ' +
  'only you and your family know which city matters to you.');
match('b4p', 'The north',
  'Four northern capitals. Pair each with its state.',
  /* not Haryana: it shares Chandigarh with Punjab, and two identical prompts cannot be
     told apart — the tasks check caught it on its first run */
  ['UP', 'PB', 'HP', 'UK'].map(code => [W.IND_GEO.states[code].capital, stName(code)]));
match('b5p', 'Which state speaks it?',
  'Four southern states and the first language each lists. Pair them.',
  ['TN', 'KL', 'KA', 'AP'].map(code => {
    const l = (W.IND_STATES[code].languages || [])[0];
    if (!l) throw new Error(`${code} lists no language`);
    return [l, stName(code)];
  }));
match('b6p', 'The east and the north-east',
  'Four capitals nobody at school asks about. Pair each with its state.',
  ['AS', 'ML', 'NL', 'MZ'].map(code => [W.IND_GEO.states[code].capital, stName(code)]));
own('b7p', 'Write where your family is from', 'A place name, in Devanagari',
  'A village, a city, a state — whatever your family says when somebody asks. The app ' +
  'checks the writing; only your family knows the place.');

/* ===== 6. THE TWO EPICS — the episode order is the corpus's own */
order('e1p', 'Put the Ramayana in order',
  'Four episodes from the first book. The app holds their order, so it marks this.',
  [1, 2, 3, 4].map(n => ep('r', n).title));
order('e2p', 'Leaving Ayodhya',
  'The four that turn a coronation into an exile.',
  [5, 6, 7, 8].map(n => ep('r', n).title));
match('e3p', 'Which book?',
  'Every episode sits in a book of the epic. Pair them up.',
  [1, 5, 9, 13].map(n => [ep('r', n).title, book('r', ep('r', n).book)]));
order('e4p', 'The Mahabharata begins',
  'Four episodes, in the order the epic tells them.',
  [1, 2, 3, 4].map(n => ep('m', n).title));
order('e5p', 'The cousins',
  'How a family becomes two sides.',
  [4, 5, 6, 7].map(n => ep('m', n).title));
match('e6p', 'Which parva?',
  'The Mahabharata is built in parvas. Pair each episode with the one it is in.',
  [1, 12, 16, 22].map(n => [ep('m', n).title, book('m', ep('m', n).book)]));
write('e7p', 'desh', 'Write the word first',
  'Both epics are about who gets to rule one. Write the word.');
order('e8p', 'The later Ramayana',
  'Four more, in order.',
  [9, 10, 11, 12].map(n => ep('r', n).title));
order('e9p', 'The later Mahabharata',
  'Four more, in order.',
  [8, 9, 10, 11].map(n => ep('m', n).title));
own('e10p', 'Write the name of the one you argued for', 'A character’s name, in Devanagari',
  'Neither epic has a simple hero and this course does not pretend otherwise. Write who ' +
  'you ended up defending.');

/* ===== 7. THE INDIAN YEAR — months come from the festival data, never from memory */
match('u1p', 'When does it fall?',
  'Four festivals and four times of year. Pair them.',
  ['lohri', 'holi', 'diwali', 'onam'].map(id => [fest(id).name, months(id)]));
match('u2p', 'Whose festival?',
  'Every one of these is somebody\u2019s. Pair each with the tradition it belongs to.',
  ['eid-ul-fitr', 'guru-nanak-gurpurab', 'mahavir-jayanti', 'buddha-purnima']
    .map(id => [fest(id).name, cap(fest(id).faith)]));
order('u3p', 'Put the year in order',
  'Four festivals, starting in January. The app holds when each one falls.',
  ['lohri', 'holi', 'raksha-bandhan', 'diwali'].map(id => fest(id).name));
match('u4p', 'The harvests',
  'Four harvest festivals, four months. Pair them.',
  /* not Nuakhai: it falls in the same months as Onam, which makes two right answers look
     like one — caught by the tasks check */
  ['pongal', 'baisakhi', 'onam', 'wangala'].map(id => [fest(id).name, months(id)]));
match('u5p', 'The ones from the north-east',
  'Festivals this app carries that most lists leave out.',
  ['chapchar-kut', 'wangala', 'bihu', 'losar'].map(id => [fest(id).name, months(id)]));
order('u6p', 'The autumn run',
  'These four come one after another. Put them in order.',
  ['ganesh-chaturthi', 'navratri', 'vijayadashami', 'diwali'].map(id => fest(id).name));
own('u7p', 'Write the one your family keeps', 'A festival name, in Devanagari',
  'Thirty-eight are in this course and yours may not be one of them. Write it anyway.');

/* ===== 8. SONGS AND SOUNDS — every word comes out of the song's own vocabulary */
match('g1p', 'What does the word mean?',
  'Four words out of one rhyme. Pair each with what it means.',
  ['machhli', 'jal', 'rani', 'jeevan'].map(r => {
    const w = songWord('machhli-jal-ki-rani', r);
    return [w.term, w.en];
  }));
write('g2p', 'paani', 'Write the word first',
  'The rhyme is about a fish in it. Write the everyday word before you sing the old one.');
match('g3p', 'The words of the moon song',
  'Four words from Chanda mama door ke. Pair each with what it means.',
  ['chanda', 'mama', 'door', 'pue'].map(r => {
    try { const w = songWord('chanda-mama-door-ke', r); return [w.term, w.en]; }
    catch (e) { return null; }
  }).filter(Boolean));
own('g4p', 'Write a line of the one you were sung', 'One line, in any Indian script you can type',
  'The app has Devanagari on the board. If your rhyme is in another script it will say ' +
  'so rather than mark it wrong — and that is the honest answer.');
write('g5p', 'gaana', 'Write the word first',
  'One word for the whole thing you are collecting.');
match('g6p', 'Which rhyme?',
  'Four rhymes by their first line. Pair each with what it is about.',
  [['Machhli jal ki rani hai', 'a fish'], ['Chanda mama door ke', 'the moon'],
   ['Hathi raja kahan chale', 'an elephant'], ['Nani teri morni ko mor le gaye', 'a peahen']]
    .map(([t, about], i) => {
      const id = ['machhli-jal-ki-rani', 'chanda-mama-door-ke', 'hathi-raja-kahan-chale',
                  'nani-teri-morni'][i];
      if (song(id).title !== t) throw new Error(`${id} is titled "${song(id).title}", not "${t}"`);
      return [t, about];
    }));
own('g7p', 'Write down the one nobody wrote down', 'Whatever they sang you',
  'Somebody in your family knows one that is not in any book. This is the only copy of ' +
  'it there will ever be, so write it while they are still here to correct you.');

/* ===== 9. VIGYAN — each task sits on the part it belongs to.
   The first draft ranked "a stepwell" against "a stupa" by size, which has no single
   answer — Rani ki Vav is longer than Sanchi's stupa is wide, and a small stupa is
   smaller than either. A task that can mark a right child wrong is worse than no task. */
write('v1p', 'shoonya', 'Write it first',
  'The whole of part one is about this word. Write it before you explain it to somebody.');
match('v2p', 'When was it?',
  'The sky was measured in several ages. Pair each with when it was.',
  ['harappa', 'vedic', 'gupta', 'chola'].map(id => [era(id).title, era(id).when]));
order('v3p', 'Put these in order',
  'Four ages of Indian metalwork and making, oldest first.',
  ['harappa', 'buddha-age', 'gupta', 'chola'].map(id => era(id).title));
order('v4p', 'How to check a claim',
  'The project is to check one yourself. Put the steps in the order you would do them.',
  ['Somebody says it happened', 'Ask where they heard it',
   'Look for something you can touch or read', 'Say how sure you are']);
order('v5p', 'Four ages of building',
  'From the first brick cities to the domes. Put them in order.',
  ['harappa', 'maurya', 'temple-builders', 'sultanate-mughal'].map(id => era(id).title));
order('v6p', 'The last three',
  'Rockets come late in the river. Put the ages they belong to in order.',
  ['freedom', 'modern', 'naya-bharat'].map(id => era(id).title));
own('v7p', 'Write who you are writing to', 'A name, in Devanagari',
  'The scientist you picked. The app checks the writing — it cannot know who they are, ' +
  'and it will not pretend to.');
own('v8p', 'Write what you are not sure about', 'One line, in Devanagari',
  'This part is about claims grown-ups still argue over. Writing down what you do NOT ' +
  'know is the part of science that nobody teaches.');

/* ===== 10. ARJUNA'S QUESTIONS — five sourced verses, and not a word beyond them */
order('q1p', 'Put the war in order',
  'Three episodes of the Mahabharata that lead to the chariot stopping.',
  [25, 26, 27].map(n => ep('m', n).title));
write('q2p', 'kal', 'Write the word first',
  'Hindi uses one word for yesterday and for tomorrow. Arjuna is standing between them.');
match('q3p', 'The words for family',
  'The Gita happens because the two armies are one family. Before part 3, pair each word ' +
  'with who it means.',
  ['dada', 'chacha', 'bhaiya', 'mama'].map(id => [kin(id).hi, kin(id).en]));
own('q4p', 'Write down your question', 'One question, in Devanagari',
  'This course is called Arjuna’s Questions. Part 13 says out loud that it cannot ' +
  'answer most of yours. Write one anyway and take it to somebody who has read all of it.');
write('q5p', 'gaana', 'Write the word first',
  'Verse 2.47 is about doing the thing rather than counting the prize. Write the word ' +
  'for a thing people do for its own sake.');
write('q6p', 'gussa', 'Write the word first',
  'Verse 2.63 is about this one.');
write('q7p', 'dost', 'Write the word first',
  'Verse 6.5 says you can be your own. Write the word.');
own('q8p', 'Write what "enough" looks like for you', 'One line, in Devanagari',
  'Verse 6.17 is about not too much of anything. Nobody can mark this and nobody will.');
match('q9p', 'The same quality, three traditions',
  'Part 9 takes the qualities in 12.13 and asks where else they turn up. Pair each value ' +
  'with what it means.',
  ['karuna', 'kshama', 'namrata', 'satya'].map(id => [val(id).term, val(id).en]));
own('q10p', 'Write one of the five', 'Any of the five verses, in Devanagari',
  'You have heard them read. Copying a verse by hand is how people have learned them for ' +
  'two thousand years. The app checks the script, not the verse — it will not tell you ' +
  'that you got a sacred text right or wrong.');
/* NOT AN ORDER TASK. The first draft asked a child to put "a real battle" and "the fight
   inside you" in order — which ranks two readings of a sacred text, on a course docs/21
   says must represent the disagreement fairly in both directions. The child writes the
   one THEY find convincing, and nothing marks it. */
own('q11p', 'Write the reading you find more convincing', 'One line, in Devanagari',
  'Part 11 shows two old readings and does not pick one. Neither does the app — it checks ' +
  'only that the writing is put together right.');
own('q12p', 'Write what you think Gandhi meant', 'One line, in Devanagari',
  'Part 12 shows a disagreement that is still going. Your line is yours.');
own('q13p', 'Write the question this course did not answer', 'One question, in Devanagari',
  'This is the project of the part that is honest about its own gaps. Keep the list.');
own('q14p', 'Write your own battlefield', 'One line, in Devanagari',
  'The last one. It is not about a war.');

/* ------------------------------------------------------------------ write it out */
function lit(v, indent) {
  const pad = ' '.repeat(indent);
  if (Array.isArray(v)) {
    const inner = v.map(x => lit(x, indent + 2)).join(',\n' + pad + '  ');
    return '[\n' + pad + '  ' + inner + '\n' + pad + ']';
  }
  if (v && typeof v === 'object') {
    const keys = Object.keys(v);
    return '{ ' + keys.map(k => `${k}: ${lit(v[k], indent)}`).join(', ') + ' }';
  }
  return JSON.stringify(v);
}
/* a pair is short enough to sit on one line and much easier to read that way */
function pairLit(p, indent) {
  return '[' + JSON.stringify(p[0]) + ', ' + JSON.stringify(p[1]) + ']';
}
function taskLit(t, indent) {
  const pad = ' '.repeat(indent);
  const out = [`k: ${JSON.stringify(t.k)}`, `title: ${JSON.stringify(t.title)}`];
  if (t.clue) out.push(`clue: ${JSON.stringify(t.clue)}`);
  if (t.target) out.push(`target: ${JSON.stringify(t.target)}`);
  if (t.roman) out.push(`roman: ${JSON.stringify(t.roman)}`);
  if (t.letter) out.push(`letter: ${JSON.stringify(t.letter)}`);
  out.push(`say: ${JSON.stringify(t.say)}`);
  let body = 'task: { ' + out.join(',\n' + pad + '        ') ;
  if (t.items) {
    body += ',\n' + pad + '        items: [' + t.items.map(x => JSON.stringify(x)).join(',\n' + pad + '                ') + ']';
    body += ',\n' + pad + '        answer: [' + t.answer.map(x => JSON.stringify(x)).join(',\n' + pad + '                 ') + ']';
  }
  if (t.pairs) {
    body += ',\n' + pad + '        pairs: [' + t.pairs.map(p => pairLit(p)).join(',\n' + pad + '                ') + ']';
  }
  return body + ' },';
}

const file = path.join(APP, 'data-paath.js');
let src = fs.readFileSync(file, 'utf8');
let added = 0, replaced = 0, missing = [];
Object.keys(T).forEach(pid => {
  const t = T[pid];
  /* Find the project literal, then the first `m: <minutes>,` inside it, and put the task
     straight after that. Done as plain string work rather than one clever regex: the
     literals are laid out three different ways in this file and a pattern that handles
     all three is a pattern nobody can read six months from now. */
  const at = src.indexOf(`project: { id: '${pid}'`);
  if (at < 0) { missing.push(pid); return; }
  const mm = /\bm: \d+,/.exec(src.slice(at, at + 400));
  if (!mm) { missing.push(pid); return; }
  const m = { index: at, 0: src.slice(at, at + mm.index + mm[0].length) };
  const indent = ' '.repeat((src.slice(0, at).split('\n').pop() || '').length);
  /* Strip an existing task first, so this is idempotent — BY COUNTING BRACES, not by a
     lazy regex. The first version used /task: \{[\s\S]*?\n\s*\},/ and a task whose
     literal does not happen to end on its own line ran on to the next `},` in the file,
     silently deleting the nine modules after it. It never reached disk, because the run
     then failed to place those nine and exited before writing — but the next person's
     version might not, so this counts. */
  const after = src.slice(m.index + m[0].length);
  const start = /^\s*task: \{/.exec(after);
  let cut = 0;
  if (start) {
    let depth = 0, i = start.index + start[0].length - 1;
    for (; i < after.length; i++) {
      const ch = after.charAt(i);
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (!depth) break; }
      /* a brace inside a string is not a brace; none of these literals have one, and
         this check makes sure that stays true rather than assuming it */
      else if ((ch === "'" || ch === '"') && depth) {
        const q = ch;
        for (i++; i < after.length && after.charAt(i) !== q; i++)
          if (after.charAt(i) === '\\') i++;
      }
    }
    if (depth) throw new Error(`${pid}: an existing task literal does not close`);
    cut = i + 1;
    if (after.charAt(cut) === ',') cut++;
  }
  const lit2 = '\n' + indent + '  ' + taskLit(t, indent.length + 2);
  if (cut) { src = src.slice(0, m.index + m[0].length) + lit2 + after.slice(cut); replaced++; }
  else { src = src.slice(0, m.index + m[0].length) + lit2 + after; added++; }
});

if (missing.length) { console.error('could not place: ' + missing.join(', ')); process.exit(1); }

/* PROVE IT BEFORE IT REACHES DISK. This rewrites a 1,400-line data file by string
   surgery, and the first version of the strip above could silently delete nine modules.
   So the new source is parsed and counted here — same courses, same modules, same
   projects, and a task on every one we meant — and only then written. A generator that
   can corrupt the thing it generates has to check its own work. */
const before = { courses: W.IND_PAATH.courses.length,
                 modules: W.IND_PAATH.courses.reduce((a, c) => a + c.modules.length, 0),
                 projects: new Set() };
W.IND_PAATH.courses.forEach(c => c.modules.forEach(m => before.projects.add(m.project.id)));

const box = {};
try { new Function('window', src)(box); }
catch (e) { console.error('the rewritten file does not parse: ' + e.message); process.exit(1); }
const P2 = box.IND_PAATH;
const after2 = { courses: P2.courses.length,
                 modules: P2.courses.reduce((a, c) => a + c.modules.length, 0),
                 projects: new Set() };
P2.courses.forEach(c => c.modules.forEach(m => after2.projects.add(m.project.id)));
const faults = [];
if (after2.courses !== before.courses) faults.push(`courses went ${before.courses} -> ${after2.courses}`);
if (after2.modules !== before.modules) faults.push(`modules went ${before.modules} -> ${after2.modules}`);
[...before.projects].forEach(id => { if (!after2.projects.has(id)) faults.push(`project ${id} disappeared`); });
Object.keys(T).forEach(pid => {
  let got = null;
  P2.courses.forEach(c => c.modules.forEach(m => { if (m.project.id === pid) got = m.project.task; }));
  if (!got) faults.push(`${pid} has no task after the rewrite`);
  else if (got.k !== T[pid].k) faults.push(`${pid} came out as "${got.k}", not "${T[pid].k}"`);
});
if (faults.length) { console.error('REFUSING TO WRITE:\n  ' + faults.join('\n  ')); process.exit(1); }

const n = Object.keys(T).length;
if (process.argv.includes('--dry')) {
  console.log(`would write ${added} new and ${replaced} replaced — ${n} tasks, ` +
    `${after2.modules} modules intact`);
} else {
  fs.writeFileSync(file, src);
  console.log(`wrote ${n} tasks into app/data-paath.js (${added} new, ${replaced} replaced); ` +
    `${after2.courses} courses and ${after2.modules} modules intact`);
}
