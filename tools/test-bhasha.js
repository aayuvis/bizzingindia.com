/* Smoke test for app/bhasha.js — fake window, load, verify Unicode, run every
   generator against BOTH scripts, print for eyeballing. */
"use strict";
var fs = require('fs'), vm = require('vm');
var W = {};
global.window = W;
var src = fs.readFileSync(require('path').join(__dirname, '..', 'app', 'bhasha.js'), 'utf8');
vm.runInThisContext(src, { filename: 'bhasha.js' });

var S = W.IND_SCRIPTS, P = W.IND_PACKS, B = W.IND_BHASHA, SRS = W.IND_SRS;
var fails = 0, checks = 0;
function cps(s) { var o = [], i; for (i = 0; i < s.length; i++) o.push(s.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0')); return o.join('+'); }
function eq(label, got, want) {
  checks++;
  if (got !== want) { fails++; console.log('  FAIL ' + label + '\n       got  ' + got + '\n       want ' + want); }
}
function ok(label, cond, extra) { checks++; if (!cond) { fails++; console.log('  FAIL ' + label + (extra ? ' — ' + extra : '')); } }

/* ================= 1. UNICODE VERIFICATION ================= */
console.log('\n=== UNICODE VERIFICATION ===');

function checkList(label, list, field, want) {
  var got = list.map(function (x) { return cps(x[field]); }).join(' ');
  eq(label, got, want.join(' '));
  if (got !== want.join(' ')) {
    list.forEach(function (x, i) {
      if (cps(x[field]) !== want[i]) console.log('        [' + i + '] ' + x[field] + '  ' + cps(x[field]) + ' != ' + want[i]);
    });
  }
}

/* --- Devanagari (block 0900–097F) --- */
var D = S.devanagari;
checkList('dev.vowels (13 svar)', D.vowels, 'char',
  ['0905', '0906', '0907', '0908', '0909', '090A', '090B', '090F', '0910', '0913', '0914', '0905+0902', '0905+0903']);
checkList('dev.consonants (33 vyanjan)', D.consonants, 'char',
  ['0915', '0916', '0917', '0918', '0919', '091A', '091B', '091C', '091D', '091E',
   '091F', '0920', '0921', '0922', '0923', '0924', '0925', '0926', '0927', '0928',
   '092A', '092B', '092C', '092D', '092E', '092F', '0930', '0932', '0935',
   '0936', '0937', '0938', '0939']);
checkList('dev.matras (12)', D.matras, 'sign',
  ['093E', '093F', '0940', '0941', '0942', '0943', '0947', '0948', '094B', '094C', '0902', '0903']);
checkList('dev.numerals (0-9)', D.numerals, 'char',
  ['0966', '0967', '0968', '0969', '096A', '096B', '096C', '096D', '096E', '096F']);
eq('dev.virama', cps(D.virama), '094D');
/* Nukta letters are held DECOMPOSED (base + U+093C), which is the NFC form:
   U+0958–U+095F are Unicode composition exclusions, so NFC never recomposes
   them. Holding them any other way would give the same letter two different
   string forms and break tile matching in wordBuild. */
checkList('dev.nuktaLetters (NFC, base+nukta)', D.nuktaLetters, 'char',
  ['0915+093C', '0916+093C', '0917+093C', '091C+093C', '0921+093C', '0922+093C', '092B+093C']);

/* --- Gurmukhi (block 0A00–0A7F) --- */
var G = S.gurmukhi;
checkList('gur.bearers (3)', G.bearers, 'char', ['0A73', '0A05', '0A72']);
checkList('gur.vowels (10)', G.vowels, 'char',
  ['0A05', '0A06', '0A07', '0A08', '0A09', '0A0A', '0A0F', '0A10', '0A13', '0A14']);
checkList('gur.consonants (32)', G.consonants, 'char',
  ['0A38', '0A39', '0A15', '0A16', '0A17', '0A18', '0A19', '0A1A', '0A1B', '0A1C', '0A1D', '0A1E',
   '0A1F', '0A20', '0A21', '0A22', '0A23', '0A24', '0A25', '0A26', '0A27', '0A28',
   '0A2A', '0A2B', '0A2C', '0A2D', '0A2E', '0A2F', '0A30', '0A32', '0A35', '0A5C']);
checkList('gur.matras (9 laga)', G.matras, 'sign',
  ['0A3E', '0A3F', '0A40', '0A41', '0A42', '0A47', '0A48', '0A4B', '0A4C']);
checkList('gur.numerals (0-9)', G.numerals, 'char',
  ['0A66', '0A67', '0A68', '0A69', '0A6A', '0A6B', '0A6C', '0A6D', '0A6E', '0A6F']);
eq('gur.virama', cps(G.virama), '0A4D');
checkList('gur.signs (bindi/tippi/addak)', G.signs, 'sign', ['0A02', '0A70', '0A71']);
/* same rule for Gurmukhi: U+0A33/0A36/0A59–0A5E are composition exclusions.
   U+0A5C RRA is NOT — it is an independent letter and stays precomposed. */
checkList('gur.nuktaLetters (NFC, base+bindi)', G.nuktaLetters, 'char',
  ['0A38+0A3C', '0A16+0A3C', '0A17+0A3C', '0A1C+0A3C', '0A2B+0A3C', '0A32+0A3C']);
eq('gur RRA stays precomposed U+0A5C', cps(G.consonants[31].char), '0A5C');
eq('gur.painti length (35)', G.painti.length, 35);

/* --- block containment + conjunct composition + audio-key uniqueness --- */
function blockOf(id) { return id === 'devanagari' ? [0x0900, 0x097F] : [0x0A00, 0x0A7F]; }
Object.keys(S).forEach(function (k) {
  var sc = S[k], lo = blockOf(k)[0], hi = blockOf(k)[1], keys = {}, dupes = [], bad = [];
  function scan(list, field) {
    (list || []).forEach(function (x) {
      var t = x[field] || '';
      for (var i = 0; i < t.length; i++) { var c = t.charCodeAt(i); if (c !== 0x20 && (c < lo || c > hi)) bad.push(t + ' has U+' + cps(t.charAt(i))); }
      if (x.audio) { if (keys[x.audio]) dupes.push(x.audio); keys[x.audio] = 1; }
    });
  }
  scan(sc.vowels, 'char'); scan(sc.consonants, 'char'); scan(sc.matras, 'sign');
  scan(sc.numerals, 'char'); scan(sc.nuktaLetters, 'char'); scan(sc.hardConjuncts, 'char');
  scan(sc.signs, 'sign'); scan(sc.bearers, 'char');
  ok(k + ': every glyph inside its Unicode block', bad.length === 0, bad.join(', '));
  ok(k + ': audio keys unique', dupes.length === 0, dupes.join(', '));

  /* a conjunct must literally be parts[0] + virama + parts[1] */
  var badCj = [];
  sc.hardConjuncts.forEach(function (c) {
    var built = c.parts.join(sc.virama);
    if (built !== c.char) badCj.push(c.char + ' (' + cps(c.char) + ') != ' + built + ' (' + cps(built) + ')');
    if (!c.char.split('').some(function (ch, i) { return B.isCombiningMark(c.char.charCodeAt(i)); })) badCj.push(c.char + ' has no virama');
  });
  ok(k + ': hardConjuncts compose from their parts', badCj.length === 0, badCj.join(' | '));

  /* matra examples must be base + that sign */
  var badEx = [];
  sc.matras.forEach(function (m) { if (m.example.slice(1) !== m.sign) badEx.push(m.name + ':' + cps(m.example)); });
  ok(k + ': matra examples are base+sign', badEx.length === 0, badEx.join(', '));
});

/* --- lexicon integrity --- */
Object.keys(P).forEach(function (id) {
  var pack = P[id], sc = B.script(pack), lo = blockOf(sc.id)[0], hi = blockOf(sc.id)[1];
  var bad = [], seen = {}, dup = [], themes = {};
  pack.lexicon.forEach(function (w) {
    for (var i = 0; i < w.word.length; i++) {
      var c = w.word.charCodeAt(i);
      if (c !== 0x20 && (c < lo || c > hi)) bad.push(w.word + '/' + w.roman + ' has U+' + cps(w.word.charAt(i)));
    }
    if (seen[w.word]) dup.push(w.word); seen[w.word] = 1;
    themes[w.theme] = (themes[w.theme] || 0) + 1;
    if (!w.en || !w.roman || !w.audio) bad.push(w.word + ' missing a field');
  });
  ok(id + ': lexicon glyphs all in ' + sc.id + ' block', bad.length === 0, bad.join(', '));
  ok(id + ': no duplicate words', dup.length === 0, dup.join(', '));
  /* The eight founding themes must all survive; a pack may carry more. Hindi has grown to
     seventeen and pinning the count to eight would fail every time the pack improves. */
  var CORE = ['greetings', 'family', 'food', 'body', 'home', 'animals', 'colours', 'numbers'];
  var missingTheme = CORE.filter(function (t) { return !themes[t]; });
  ok(id + ': the eight core themes are all present', missingTheme.length === 0, missingTheme.join(', '));
  console.log('  ' + id + ': ' + pack.lexicon.length + ' words  ' + JSON.stringify(themes));
});
/* The packs no longer mirror each other and should not be forced to: Hindi has been taken
   to 507 words across seventeen themes while Punjabi is still at its founding 74. What must
   hold is that every theme Punjabi HAS also exists in Hindi, so the smaller pack is a subset
   of the larger and never invents a theme of its own. */
var hT = {}, pT = {};
P.hi.lexicon.forEach(function (w) { hT[w.theme] = (hT[w.theme] || 0) + 1; });
P.pa.lexicon.forEach(function (w) { pT[w.theme] = (pT[w.theme] || 0) + 1; });
var orphan = Object.keys(pT).filter(function (t) { return !hT[t]; });
ok('every Punjabi theme exists in Hindi too', orphan.length === 0, orphan.join(', '));
console.log('  hi themes: ' + Object.keys(hT).length + '  pa themes: ' + Object.keys(pT).length);
/* number words must cover 1-10 in both packs */
[['hi', P.hi], ['pa', P.pa]].forEach(function (p) {
  /* 1-10 must be there; a pack that also teaches 11-20 or 100 is better, not broken. */
  var vals = p[1].lexicon.filter(function (w) { return w.theme === 'numbers'; })
    .map(function (w) { return w.value; }).filter(function (v) { return typeof v === 'number'; });
  var missingNum = [1,2,3,4,5,6,7,8,9,10].filter(function (n) { return vals.indexOf(n) < 0; });
  ok(p[0] + ': numbers cover at least 1-10', missingNum.length === 0, 'missing ' + missingNum.join(','));
});
/* spot-check the codepoints of the trickiest words by hand */
console.log('\n=== SPOT-CHECKED WORDS ===');
[['माँ', '092E+093E+0901', 'ma + aa-matra + chandrabindu'],
 ['कुत्ता', '0915+0941+0924+094D+0924+093E', 'ku + t + virama + t + aa'],
 ['नमस्ते', '0928+092E+0938+094D+0924+0947', 'na ma s virama ta e'],
 ['चिड़िया', '091A+093F+0921+093C+093F+092F+093E', 'DDA + nukta, the NFC form of ड़'],
 ['सफ़ेद', '0938+092B+093C+0947+0926', 'PHA + nukta, the NFC form of फ़'],
 ['ਮਾਂ', '0A2E+0A3E+0A02', 'ma + kanna + bindi'],
 ['ਕੁੱਤਾ', '0A15+0A41+0A71+0A24+0A3E', 'ka + aunkar + ADDAK + ta + kanna'],
 ['ਅੰਬ', '0A05+0A70+0A2C', 'aira + TIPPI + babba'],
 ['ਸ੍ਰੀ', '0A38+0A4D+0A30+0A40', 'sassa + virama + rara (subjoined) + bihari'],
 ['ਖਿੜਕੀ', '0A16+0A3F+0A5C+0A15+0A40', 'RARRA is U+0A5C'],
 ['ਮੇਜ਼', '0A2E+0A47+0A1C+0A3C', 'JA + bindi, the NFC form of ਜ਼']].forEach(function (t) {
  console.log('  ' + t[0] + '  ' + cps(t[0]) + '   (' + t[2] + ')');
  eq('codepoints of ' + t[0], cps(t[0]), t[1]);
  var inLex = P.hi.lexicon.concat(P.pa.lexicon).some(function (w) { return w.word.indexOf(t[0]) >= 0; });
  ok(t[0] + ' appears in a lexicon', inLex);
});

/* --- every string in the data must be NFC, or the same letter ends up with
       two string forms and tile matching silently fails --- */
var nonNfc = [];
(function walk(o, path) {
  if (typeof o === 'string') { if (o !== o.normalize('NFC')) nonNfc.push(path + ' = ' + o); return; }
  if (o && typeof o === 'object') { for (var k in o) walk(o[k], path + '.' + k); }
}(W.IND_SCRIPTS, 'IND_SCRIPTS'));
(function walk(o, path) {
  if (typeof o === 'string') { if (o !== o.normalize('NFC')) nonNfc.push(path + ' = ' + o); return; }
  if (o && typeof o === 'object') { for (var k in o) walk(o[k], path + '.' + k); }
}(W.IND_PACKS, 'IND_PACKS'));
ok('every string in IND_SCRIPTS/IND_PACKS is NFC', nonNfc.length === 0, nonNfc.join('; '));

/* --- clustering --- */
console.log('\n=== GRAPHEME CLUSTERING ===');
/* expected tile counts — conjuncts deliberately stay ONE tile (a child reads
   क्ष as one thing), and a matra always travels with its base letter */
[['पानी', 2], ['कुत्ता', 2], ['क्षमा', 2], ['नमस्ते', 3], ['चिड़िया', 3],
 ['ਪਾਣੀ', 2], ['ਪੜ੍ਹਨਾ', 3], ['ਕੁੱਤਾ', 2], ['ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', 8]].forEach(function (t) {
  var c = B.clusters(t[0]);
  console.log('  ' + t[0] + '  ->  [' + c.join('] [') + ']  (' + c.length + ')');
  if (t[1]) ok('clusters(' + t[0] + ') = ' + t[1], c.length === t[1], 'got ' + c.length);
  ok('clusters round-trip ' + t[0], c.join('') === t[0]);
});

/* ================= 2. EXERCISE GENERATORS, BOTH SCRIPTS ================= */
function show(q) {
  console.log('  ' + JSON.stringify(q, null, 1).replace(/\n/g, '\n  '));
}
function hdr(t) { console.log('\n--- ' + t + ' ' + new Array(Math.max(2, 60 - t.length)).join('-')); }

[['devanagari', 'hi'], ['gurmukhi', 'pa']].forEach(function (pair) {
  var sid = pair[0], pid = pair[1], sc = S[sid], pk = P[pid];
  console.log('\n\n########## ' + sc.name + ' / ' + pk.name.en + ' (' + pk.name.native + ') ##########');

  hdr('barakhadi');
  var bk = B.barakhadi(sid, sc.consonants[2].char);
  console.log('  base ' + bk.base + ' (' + bk.baseName + '), ' + bk.cols + ' cells:');
  console.log('  ' + bk.cells.map(function (c) { return c.syllable + '=' + c.roman; }).join('  '));
  ok(sid + ' barakhadi cell count', bk.cols === (sid === 'devanagari' ? 12 : 10), 'got ' + bk.cols);
  ok(sid + ' barakhadi cells compose correctly',
    bk.cells.every(function (c) { return c.inherent ? c.syllable === bk.base : c.syllable === bk.base + c.matra; }));

  hdr('matraAttach');
  var ma = B.matraAttach(sid, { seed: 'demo1' });
  console.log('  base=' + ma.base + '  wants=' + ma.promptRoman + '  target=' + ma.target + ' (' + cps(ma.target) + ')');
  console.log('  options: ' + ma.options.map(function (o) { return '[' + o.sign + ' ' + o.name + '/' + o.position + ']'; }).join(' ') + '  answer=' + ma.answer + ' idx=' + ma.answerIndex);
  ok(sid + ' matraAttach answer is in options', ma.answerIndex >= 0);
  ok(sid + ' matraAttach target = base+matra', ma.target === ma.base + ma.matra);
  ok(sid + ' matraAttach options distinct', new Set(ma.options.map(function (o) { return o.sign; })).size === ma.options.length);

  hdr('soundMatch (letter)');
  var sm = B.soundMatch(sid, { seed: 'demo2' });
  console.log('  play ' + sm.audio + ' -> options ' + sm.options.map(function (o) { return o.char + '(' + o.name + ')'; }).join(' ') + '  answer=' + sm.answer + ' idx=' + sm.answerIndex);
  ok(sid + ' soundMatch answer present', sm.answerIndex >= 0);
  ok(sid + ' soundMatch 4 distinct options', new Set(sm.options.map(function (o) { return o.char; })).size === 4);
  var sm2 = B.soundMatch(sid, { seed: 'demo3', kind: 'syllable' });
  console.log('  [syllable] play ' + sm2.audio + ' -> ' + sm2.options.map(function (o) { return o.char; }).join(' ') + '  answer=' + sm2.answer);
  var sm3 = B.soundMatch(sid, { seed: 'demo4', kind: 'numeral' });
  console.log('  [numeral]  play ' + sm3.audio + ' -> ' + sm3.options.map(function (o) { return o.char + '(' + o.name + ')'; }).join(' ') + '  answer=' + sm3.answer);

  hdr('wordBuild');
  var wb = B.wordBuild(pid, { seed: 'demo5' });
  console.log('  word=' + wb.word + ' (' + wb.roman + ' = ' + wb.en + ', ' + wb.theme + ')  audio=' + wb.audio);
  console.log('  tiles: [' + wb.tiles.join('] [') + ']   answer: [' + wb.answer.join('] [') + ']');
  ok(sid + ' wordBuild answer rejoins to the word', wb.answer.join('') === wb.word);
  ok(sid + ' wordBuild tiles contain every answer tile',
    wb.answer.every(function (t) { return wb.tiles.indexOf(t) >= 0; }));
  ok(sid + ' wordBuild has decoys', wb.tiles.length > wb.answer.length);

  hdr('oddOneOut (all three strategies)');
  ['family', 'length', 'kind'].forEach(function (st) {
    var oo = B.oddOneOut(sid, { seed: 'odd-' + st, strategy: st });
    console.log('  [' + st + '] ' + oo.items.map(function (i) { return i.char + '(' + i.name + ')'; }).join('  ') + '   answer=' + oo.answer + ' idx=' + oo.answerIndex);
    console.log('           why: ' + oo.why);
    ok(sid + ' oddOneOut/' + st + ' answer present', oo.answerIndex >= 0);
    ok(sid + ' oddOneOut/' + st + ' 4 distinct items', new Set(oo.items.map(function (i) { return i.char; })).size === 4);
  });

  hdr('conjunctSplit');
  var cj = B.conjunctSplit(sid, { seed: 'demo6' });
  console.log('  ' + cj.conjunct + ' (' + cps(cj.conjunct) + ', ' + cj.conjunctName + ', as in ' + cj.word + ')  -> ' + cj.answer.join(' + '));
  console.log('  tiles: ' + cj.tiles.map(function (t) { return t.char; }).join(' '));
  ok(sid + ' conjunctSplit parts are in the tiles',
    cj.answer.every(function (p) { return cj.tiles.some(function (t) { return t.char === p; }); }));

  hdr('listenPoint (stage 0, no script)');
  var lp = B.listenPoint(pid, { seed: 'demo7' });
  console.log('  play ' + lp.audio + ' (' + lp.answerWord + '/' + lp.roman + ')  -> ' + lp.options.map(function (o) { return o.en; }).join(' | ') + '  answer="' + lp.answer + '" idx=' + lp.answerIndex);
  ok(sid + ' listenPoint answer present', lp.answerIndex >= 0);

  hdr('readAloud');
  var ra = B.readAloud(pid, { seed: 'demo8' });
  console.log('  ' + ra.word + ' [' + ra.clusters.join('][') + ']  ' + ra.roman + ' = ' + ra.en + '  audio=' + ra.audio);

  hdr('nextQuestion across the ladder');
  pk.stages.forEach(function (st) {
    var q = B.nextQuestion(pid, st.id, 'seed-' + st.id);
    var summary = q.type === 'barakhadi' ? ('base ' + q.base + ' x' + q.cols)
      : q.type === 'wordBuild' ? (q.word + ' -> ' + q.tiles.length + ' tiles')
      : q.type === 'matraAttach' ? (q.base + ' + ? = ' + q.promptRoman)
      : q.type === 'listenPoint' ? (q.audio + ' -> ' + q.options.length + ' meanings')
      : q.type === 'conjunctSplit' ? (q.conjunct + ' -> ' + q.answer.join('+'))
      : q.type === 'oddOneOut' ? (q.items.map(function (i) { return i.char; }).join(' '))
      : (q.audio + ' -> ' + (q.options || []).map(function (o) { return o.char; }).join(' '));
    console.log('  ' + st.id + ' ' + st.name.padEnd(11) + ' ' + q.type.padEnd(14) + ' ' + summary);
    ok(pid + ' ' + st.id + ' returns a question', !!q && !!q.type);
    ok(pid + ' ' + st.id + ' type is allowed for the stage', st.types.indexOf(q.type) >= 0, q.type + ' not in ' + st.types.join(','));
  });

  hdr('determinism');
  var a = JSON.stringify(B.nextQuestion(pid, 's2', 42)), b = JSON.stringify(B.nextQuestion(pid, 's2', 42));
  ok(pid + ' same seed -> same question', a === b);
  ok(pid + ' different seed -> different question', a !== JSON.stringify(B.nextQuestion(pid, 's2', 43)));
  console.log('  seed 42 twice: identical = ' + (a === b));
});

/* one full question object printed raw, so the shape is eyeballable */
hdr('raw question object (pa / s2)');
show(B.nextQuestion('pa', 's2', 'raw-demo'));

/* ================= 3. SRS ================= */
console.log('\n\n########## SRS ##########');
var items = B.srsItems('pa');
console.log('  pa srsItems: ' + items.length + ' (e.g. ' + items[0].key + ', ' + items[45].key + ', ' + items[items.length - 1].key + ')');
ok('srsItems non-empty', items.length > 100);
var t0 = 1700000000000;
var card = { key: 'letter:ਕ' };
eq('new card box', SRS.box(card), 0);
SRS.review(card, true, t0);  eq('after 1 right, box', card.box, 1);
SRS.review(card, true, t0);  eq('after 2 right, box', card.box, 2);
SRS.review(card, false, t0); eq('after a miss, box drops one (never to nothing)', card.box, 1);
ok('due is scheduled forward', card.due > t0);
ok('streak resets on a miss', card.streak === 0);
console.log('  card after 2 right + 1 miss: ' + JSON.stringify(card));
var list = [{ key: 'a', box: 0, due: t0 - 1000 }, { key: 'b', box: 3, due: t0 + 86400000 }, { key: 'c' }];
var due = SRS.due(list, t0);
eq('due() picks the overdue and the unseen', due.map(function (d) { return d.key; }).join(','), 'a,c');
console.log('  due(list): ' + due.map(function (d) { return d.key; }).join(', '));
console.log('  progress: ' + JSON.stringify(SRS.progress([{ box: 6 }, { box: 4 }, { box: 0 }])));

/* ================= result ================= */
console.log('\n' + (fails ? 'FAILED ' + fails + ' of ' + checks + ' checks' : 'ALL ' + checks + ' CHECKS PASSED'));
process.exit(fails ? 1 : 0);
