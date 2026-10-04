#!/usr/bin/env node
/* THE WHOLE GITA, A YEAR — the advanced Gita course (owner, 4 Oct 2026: "split into two courses…
   Arjuna's Questions is the basic Gita course, then an advanced one", "more a 1 year course").

   Generated, never typed: every week is a run of real verses out of tools/build-gita.js's output
   (app/data-gita-NN.js), so a week can only point at a verse that exists, and the 700 are covered
   exactly once, in order. The course is the Paathshala engine's like any other — learn, practise,
   test on another day, then make something — and its page is the year journey (layout: 'year').

   THE YEAR. 52 weeks of about three hours (two learning stops, a practice round, a test, a thing to
   make — the engine's own 25 + 25 + 20 + 15 + 95 minutes). Each chapter gets weeks in proportion to
   its verses (largest remainder, at least one each), and a week never crosses a chapter, so a week
   is "Chapter 2 · verses 31–44" and needs exactly one chapter's data on screen.

   node tools/build-gita-year.js     → app/data-paath-gita-year.js
   Rerun after tools/build-gita.js. check-paath `year` holds the coverage and the shape. */
'use strict';
const fs = require('fs'), path = require('path');
const APP = path.join(__dirname, '..', 'app');
const WEEKS = 52;

global.window = {};
require(path.join(APP, 'data-gita.js'));
const G = window.IND_GITA;
const V = {};
for (let c = 1; c <= 18; c++) { require(path.join(APP, 'data-gita-' + String(c).padStart(2, '0') + '.js')); V[c] = window.IND_GITA_V[c]; }
const CH = G.chapters;

/* weeks per chapter: largest remainder over the verse counts, at least one each */
const total = CH.reduce((a, c) => a + c.verses, 0);
const raw = CH.map(c => c.verses * WEEKS / total);
const wk = raw.map(x => Math.max(1, Math.floor(x)));
let left = WEEKS - wk.reduce((a, b) => a + b, 0);
raw.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { wk[i]++; left--; } });
while (left < 0) { const i = wk.indexOf(Math.max(...wk)); wk[i]--; left++; }

/* the opening words of a verse, in its own script: what a child learns to recognise it by */
const opening = x => {
  const line = String(x.sa).split('\n')[0].replace(/[।॥|]/g, ' ').trim();
  const w = line.split(/\s+/);
  let o = w[0];
  for (let i = 1; i < w.length && (o + ' ' + w[i]).length <= 22; i++) o += ' ' + w[i];
  return o + (o.length < line.length ? '…' : '');
};
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const TALK = [
  'Is there anyone at home who knows a verse from this chapter by heart? Ask them to say it, and when they learned it.',
  'Which of this week’s verses would you ask a grandparent about — and what would you ask?',
  'Read your favourite verse of the week aloud at dinner. What does each person at the table think it means?',
  'Has anyone in your family heard this chapter chanted somewhere — a temple, a wedding, a recording? Ask where.'
];
const HOME = [
  'Say this week’s verse at the same time every day — before school, or before bed.',
  'Teach one line of this week’s verse to someone at home, the way the guru taught you.',
  'Write the number of your verse on a card and put it where you will see it every morning.',
  'Chant along with the guru once a day this week, a little more of it from memory each time.'
];
const SPEAKS = { krishna: 'Krishna', arjuna: 'Arjuna', sanjaya: 'Sanjaya', dhritarashtra: 'Dhritarashtra' };

const modules = [];
let n = 0;
CH.forEach((c, ci) => {
  const vs = V[c.n], k = wk[ci];
  for (let j = 0; j < k; j++) {
    const a0 = Math.round(j * vs.length / k), b0 = Math.round((j + 1) * vs.length / k);
    const wv = vs.slice(a0, b0), a = wv[0].v, b = wv[wv.length - 1].v;
    const ref = x => c.n + '.' + x.v, ids = wv.map(ref);
    const half = Math.ceil(wv.length / 2), h1 = wv.slice(0, half), h2 = wv.slice(half);
    const id = 'c' + String(c.n).padStart(2, '0') + String.fromCharCode(97 + j);
    const who = [...new Set(wv.map(x => SPEAKS[x.sp]).filter(Boolean))];
    /* four verses of the week, spread through it, with different openings, to put in order */
    const pick = [], seen = new Set();
    for (let t = 0; t < 5 && pick.length < 4; t++) {
      const x = wv[Math.min(wv.length - 1, Math.round(t * (wv.length - 1) / 4))];
      const o = opening(x);
      if (!seen.has(o) && !pick.includes(x)) { seen.add(o); pick.push(x); }
    }
    for (const x of wv) { if (pick.length >= 4) break; const o = opening(x); if (!seen.has(o)) { seen.add(o); pick.push(x); } }
    pick.sort((p, q) => p.v - q.v);
    const answer = pick.map(opening);
    const items = answer.slice().sort((p, q) => hash(id + p) - hash(id + q));
    if (items.join() === answer.join()) items.push(items.shift());
    const range = (x, y) => x.v === y.v ? c.n + '.' + x.v : c.n + '.' + x.v + '–' + y.v;
    modules.push({
      id, ch: c.n, from: a, to: b, verses: wv.length,
      name: k === 1 ? 'Chapter ' + c.n + ' · all ' + wv.length + ' verses' : 'Chapter ' + c.n + ' · verses ' + a + '–' + b,
      hours: 3,
      objective: 'tell what chapter ' + c.n + ', verses ' + a + ' to ' + b + ', say, and recite one of them from memory',
      talk: TALK[n % TALK.length],
      home: HOME[n % HOME.length],
      speakers: who,
      lessons: [
        { k: 't', n: 'Hear and read ' + range(h1[0], h1[h1.length - 1]), m: 25,
          o: 'hear, read and say in your own words ' + range(h1[0], h1[h1.length - 1]), use: { gv: h1.map(ref) } },
        { k: 't', n: (h2.length ? 'Then ' + range(h2[0], h2[h2.length - 1]) : 'Again, all of it'), m: 25,
          o: 'hear, read and say in your own words ' + (h2.length ? range(h2[0], h2[h2.length - 1]) : range(h1[0], h1[h1.length - 1])),
          use: { gv: (h2.length ? h2 : h1).map(ref) } },
        { k: 'p', n: 'Which verse says it?', m: 20, o: 'know each verse of the week by its opening words', use: { gv: ids } },
        { k: 'c', n: 'Test yourself', m: 15, o: 'tell what this week’s verses say, on a later day', use: {} }
      ],
      project: {
        id: id + 'p', name: 'Say one by heart', m: 95,
        brief: 'Choose one verse from ' + range(wv[0], wv[wv.length - 1]) + '. Learn it with the guru’s Repeat step until you ' +
               'can say it without looking, record yourself, and say it to someone at home.',
        made: 'one verse of this week, said from memory to someone at home',
        task: { k: 'order', title: 'Put four of this week’s verses in the order they come',
                say: 'Tap them in the order they come in the chapter — first to last.', items, answer }
      }
    });
    n++;
  }
});
if (modules.length !== WEEKS) throw new Error(modules.length + ' weeks, not ' + WEEKS);
const covered = modules.reduce((s, m) => s + m.verses, 0);
if (covered !== 700) throw new Error(covered + ' verses covered, not 700');

const COURSE = {
  id: 'gita-year', level: 'Advanced', layout: 'year',
  name: 'The Whole Gita', sub: 'Advanced · a year, all 700 verses',
  hours: WEEKS * 3, ages: [10, 12], badge: 'dharma', icon: 'star', colour: '#C9822B',
  cover: 'art/epic/mahabharata-26-10.jpg', coverAlt: 'Krishna and Arjuna on the chariot, between the two armies',
  premium: true, ready: 100,
  blurb: 'All eighteen chapters, a week at a time: hear each verse chanted, read it in its own script, ' +
         'know what it says, and carry one home by heart every week. Fifty-two weeks, seven hundred verses.',
  why: 'Families who finish Arjuna’s Questions ask for the whole text. This walks all of it in order, ' +
       'with nothing added: the verses, their two published translations, and a reading in plain words.',
  note: 'Presented from the inside, as a text Hindus hold sacred. The plain readings are computer drafts, ' +
        'labelled as such, until a person who reads Sanskrit has checked them.',
  takeHome: 'a question to ask at the table and something to do at home for every week, and every week’s ' +
            'brief with room to write the verse you chose.',
  needsReview: ['Not yet checked by a Sanskrit reader. Every verse is taken from published editions and two ' +
                'published translations, and nothing is written from memory, but nobody who reads Sanskrit has ' +
                'signed it off yet — it is open now because the family who made this app chose to open it before that check.',
                'The plain reading under each verse was drafted by a computer from those two translations and checked ' +
                'by a second computer; a person has not checked them yet. The chanting is a computer voice until a ' +
                'family records its own.'],
  door: { v: 'gita', label: 'Wander all eighteen chapters freely' },
  sources: ['The Bhagavad Gita, all seven hundred verses in Devanagari, from published editions, cross-checked',
            'Annie Besant, The Bhagavad-Gita, 4th edition (1922)',
            'Swami Swarupananda, Srimad-Bhagavad-Gita (1909), and his chapter titles'],
  chapters: CH.map((c, i) => ({ n: c.n, name: c.name, iast: c.iast, title: c.title, verses: c.verses, weeks: wk[i] })),
  modules
};

const out = '/* GENERATED by tools/build-gita-year.js from the Gita data — do not hand-edit.\n' +
  '   The advanced Gita course: 52 weeks, every one of the 700 verses once, in order.\n' +
  '   It goes in as Course 2, right after the basic one (Arjuna\'s Questions). */\n' +
  '(function () {\n  var P = window.IND_PAATH; if (!P) return;\n  var C = ' + JSON.stringify(COURSE) + ';\n' +
  '  var at = 0; P.courses.forEach(function (c, i) { if (c.id === \'gita-course\') at = i + 1; });\n' +
  '  if (!P.courses.some(function (c) { return c.id === C.id; })) P.courses.splice(at, 0, C);\n})();\n';
fs.writeFileSync(path.join(APP, 'data-paath-gita-year.js'), out);
console.log('gita-year: ' + modules.length + ' weeks, ' + covered + ' verses, ' + (out.length / 1024).toFixed(0) + ' KB · weeks per chapter ' + wk.join(' '));
