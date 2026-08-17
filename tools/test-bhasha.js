/* Smoke test for app/bhasha.js — fake window, load, verify Unicode, run every
   generator against BOTH scripts, print for eyeballing. */
"use strict";
var fs = require('fs'), vm = require('vm');
var W = {};
global.window = W;
var src = fs.readFileSync(require('path').join(__dirname, '..', 'app', 'bhasha.js'), 'utf8');
vm.runInThisContext(src, { filename: 'bhasha.js' });

/* Sibling pack files register through IND_BHASHA_KIT exactly as the browser
   loads them: bhasha.js first, then every app/data-bhasha-*.js in name
   order. A pack that only works when loaded by hand is not a pack. */
var appDir = require('path').join(__dirname, '..', 'app');
fs.readdirSync(appDir).filter(function (f) { return /^data-bhasha-.*\.js$/.test(f); })
  .sort().forEach(function (f) {
    vm.runInThisContext(fs.readFileSync(require('path').join(appDir, f), 'utf8'), { filename: f });
  });

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
/* The two founding scripts predate the `block` field; every script since
   declares its own Unicode range and is held to it. */
function blockOf(sc) {
  if (sc && sc.block) return sc.block;
  return (sc && sc.id) === 'devanagari' ? [0x0900, 0x097F] : [0x0A00, 0x0A7F];
}
Object.keys(S).forEach(function (k) {
  var sc = S[k], lo = blockOf(sc)[0], hi = blockOf(sc)[1], keys = {}, dupes = [], bad = [];
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
  (sc.hardConjuncts || []).forEach(function (c) {
    var built = c.parts.join(sc.virama);
    if (built !== c.char) badCj.push(c.char + ' (' + cps(c.char) + ') != ' + built + ' (' + cps(built) + ')');
    if (!c.char.split('').some(function (ch, i) { return B.isCombiningMark(c.char.charCodeAt(i)); })) badCj.push(c.char + ' has no virama');
  });
  ok(k + ': hardConjuncts compose from their parts', badCj.length === 0, badCj.join(' | '));

  /* matra examples must be base + that sign */
  var badEx = [];
  (sc.matras || []).forEach(function (m) { if (m.example.slice(1) !== m.sign) badEx.push(m.name + ':' + cps(m.example)); });
  ok(k + ': matra examples are base+sign', badEx.length === 0, badEx.join(', '));
});

/* --- lexicon integrity --- */
Object.keys(P).forEach(function (id) {
  var pack = P[id], sc = B.script(pack), lo = blockOf(sc)[0], hi = blockOf(sc)[1];
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
var hT = {};
P.hi.lexicon.forEach(function (w) { hT[w.theme] = (hT[w.theme] || 0) + 1; });
Object.keys(P).forEach(function (id) {
  if (id === 'hi') return;
  var t = {};
  P[id].lexicon.forEach(function (w) { t[w.theme] = 1; });
  var orphan = Object.keys(t).filter(function (x) { return !hT[x]; });
  ok('every ' + id + ' theme exists in Hindi too', orphan.length === 0, orphan.join(', '));
});
console.log('  hi themes: ' + Object.keys(hT).length);
/* number words must cover 1-10 in every pack */
Object.keys(P).map(function (id) { return [id, P[id]]; }).forEach(function (p) {
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

/* ============ 2b. EVERY PACK REGISTERED SINCE, generically ============ */
/* The founding pair is walked in depth above; every pack a data file has
   registered gets the same sweep, feature-gated on what its script has —
   an abjad with no matras must not be marked down for having no barakhadi. */
Object.keys(P).forEach(function (pid) {
  if (pid === 'hi' || pid === 'pa') return;
  var pk = P[pid], sc = B.script(pk);
  console.log('\n\n########## ' + sc.name + ' / ' + pk.name.en + ' (' + pk.name.native + ') ##########');
  var sid = sc.id;

  if (sc.matras && sc.matras.length) {
    var cols = sc.matras.filter(function (m) { return m.grid !== false; }).length + 1;
    var bk = B.barakhadi(sid, sc.consonants[2].char);
    ok(sid + ' barakhadi cell count', bk.cols === cols, 'got ' + bk.cols + ' want ' + cols);
    ok(sid + ' barakhadi cells compose correctly',
      bk.cells.every(function (c) { return c.inherent ? c.syllable === bk.base : c.syllable === bk.base + c.matra; }));
    var ma = B.matraAttach(sid, { seed: 'g-ma' });
    ok(sid + ' matraAttach answer is in options', ma.answerIndex >= 0);
    ok(sid + ' matraAttach target = base+matra', ma.target === ma.base + ma.matra);
  }

  var sm = B.soundMatch(sid, { seed: 'g-sm' });
  ok(sid + ' soundMatch answer present', sm.answerIndex >= 0);
  ok(sid + ' soundMatch 4 distinct options', new Set(sm.options.map(function (o) { return o.char; })).size === 4);

  var wb = B.wordBuild(pid, { seed: 'g-wb' });
  ok(sid + ' wordBuild answer rejoins to the word', wb.answer.join('') === wb.word);
  ok(sid + ' wordBuild tiles contain every answer tile',
    wb.answer.every(function (t) { return wb.tiles.indexOf(t) >= 0; }));

  ['family', 'length', 'kind'].forEach(function (st) {
    var oo = B.oddOneOut(sid, { seed: 'g-odd-' + st, strategy: st });
    ok(sid + ' oddOneOut/' + st + ' answer present', oo.answerIndex >= 0);
  });

  if (sc.hardConjuncts && sc.hardConjuncts.length) {
    var cj = B.conjunctSplit(sid, { seed: 'g-cj' });
    ok(sid + ' conjunctSplit parts are in the tiles',
      cj.answer.every(function (p) { return cj.tiles.some(function (t) { return t.char === p; }); }));
  }

  var lp = B.listenPoint(pid, { seed: 'g-lp' });
  ok(sid + ' listenPoint answer present', lp.answerIndex >= 0);

  pk.stages.forEach(function (st) {
    var q = B.nextQuestion(pid, st.id, 'g-seed-' + st.id);
    ok(pid + ' ' + st.id + ' returns a question', !!q && !!q.type);
    ok(pid + ' ' + st.id + ' type is allowed for the stage',
      !!q && st.types.indexOf(q.type) >= 0, (q && q.type) + ' not in ' + st.types.join(','));
  });

  var a = JSON.stringify(B.nextQuestion(pid, 's3', 42));
  ok(pid + ' same seed -> same question', a === JSON.stringify(B.nextQuestion(pid, 's3', 42)));
  console.log('  ' + pid + ': ' + pk.lexicon.length + ' words, ladder walked, determinism ok');
});

/* ====== 2c. THE EXAMPLE SENTENCES, THE MASK AND FILL-THE-BLANK (Phase 3) ==
   The audit's finding was that the lexicon had no sentence field and no word
   card existed. The sentences landed first; this is the check that the engine
   uses them honestly. The rule under every assertion here is CLAUDE.md's:
   never leak the answer in on-screen text. */
console.log('\n\n########## EXAMPLE SENTENCES / MASK / FILL-THE-BLANK ##########');

hdr('the sentence data itself');
var HS = B.sentences('hi');
ok('hi has an example sentence map', !!HS);
if (HS) {
  var lexHi = P.hi.lexicon, noSent = [], notOnce = [], notNfc = [];
  lexHi.forEach(function (w) {
    var e = HS[w.word];
    if (!e || !e.s || !e.roman || !e.en) { noSent.push(w.word); return; }
    /* THE GUARANTEE MASKING RESTS ON: exactly one verbatim occurrence. One
       is maskable honestly; two would leave the answer on screen after the
       mask, and none would mask nothing at all. */
    var n = 0, at = e.s.indexOf(w.word);
    while (at >= 0) { n++; at = e.s.indexOf(w.word, at + 1); }
    if (n !== 1) notOnce.push(w.word + ' x' + n);
    if (e.s.normalize('NFC') !== e.s) notNfc.push(w.word);
  });
  eq('every lexicon word has a sentence', noSent.length, 0);
  if (noSent.length) console.log('       missing: ' + noSent.slice(0, 8).join(' '));
  eq('every sentence contains its word verbatim exactly once', notOnce.length, 0);
  if (notOnce.length) console.log('       not once: ' + notOnce.slice(0, 8).join(' '));
  eq('every sentence is NFC', notNfc.length, 0);
  console.log('  ' + Object.keys(HS).length + ' sentences, one per lexicon word, each holding its word exactly once');

  var sf = B.sentence('hi', 'पानी');
  ok('sentence() resolves an entry', !!sf && !!sf.s);
  /* the clip key is DERIVED from the romanisation, never typed — that is
     what keeps a recording manifest from drifting off the pack */
  eq('sentence clip key is derived from the roman', sf.audio, 'hi/s-paani');
  eq('and sits beside the word key, not on top of it',
    B.audioFor(P.hi.lexicon.filter(function (w) { return w.word === 'पानी'; })[0].audio, 'hi'), 'hi/w-paani');
  eq('a space in the roman is stripped, exactly as the word key strips it',
    B.sentence('hi', 'शुभ रात्रि').audio, 'hi/s-shubhraatri');
  ok('a pack with no sentences written yet resolves to nothing', !B.sentences('pa') && !B.sentence('pa', P.pa.lexicon[0].word));
}

hdr('the mask');
var mk = B.mask('मैं रोज़ पानी पीता हूँ।', 'पानी');
ok('mask matches', mk.matched);
eq('mask removes the word', mk.text.indexOf('पानी'), -1);
eq('mask keeps the head', mk.before, 'मैं रोज़ ');
eq('mask keeps the tail', mk.after, ' पीता हूँ।');
eq('mask rejoins to the sentence when the blank is put back',
  mk.before + 'पानी' + mk.after, 'मैं रोज़ पानी पीता हूँ।');
/* THE SLOPPY-MASK TEST. A global replace would take the word out of the
   MIDDLE of a longer word too, deleting a piece of the sentence the child
   still needs to read. Exactly one occurrence goes, and it is the first. */
var mk2 = B.mask('आम आमरस से मीठा है।', 'आम');
eq('mask cuts one occurrence only, never every match',
  mk2.before + '[' + mk2.after + ']', '[ आमरस से मीठा है।]');
eq('a word that is not there masks nothing', B.mask('घर बड़ा है।', 'पानी').text, 'घर बड़ा है।');
ok('and says so rather than pretending', !B.mask('घर बड़ा है।', 'पानी').matched);
eq('an empty word masks nothing', B.mask('घर बड़ा है।', '').text, 'घर बड़ा है।');
eq('the blank is caller-chosen', B.mask('घर बड़ा है।', 'घर', '').text, ' बड़ा है।');

hdr('sentenceBlank');
(function () {
  var seen = 0, leaks = [], noAns = [], dupes = [], offTheme = [], inSentence = [], synonyms = [], i, s;
  for (i = 0; i < 160; i++) {
    var q = B.nextQuestion('hi', 's3', 'blank-' + i, { type: 'sentenceBlank' });
    if (q.type !== 'sentenceBlank') continue;
    seen++;
    /* 1. NOTHING THE CHILD CAN SEE BEFORE ANSWERING CONTAINS THE ANSWER.
       Every string the renderer draws pre-answer is searched for the word
       itself — the blanked sentence, its two halves, the English clue, the
       prompt — because that is the rule this whole phase turns on. */
    var shown = [q.blanked, q.before, q.after, q.en, q.prompt].join('   ');
    if (shown.indexOf(q.answerWord) >= 0) leaks.push(q.answerWord + ' in "' + q.blanked + '"');
    /* 2. the answer is among the options, and the index points at it */
    if (!(q.options[q.answerIndex] && q.options[q.answerIndex].word === q.answerWord)) noAns.push(q.answerWord);
    /* 3. four distinct options */
    var words = q.options.map(function (o) { return o.word; });
    if (new Set(words).size !== words.length || words.length !== 4) dupes.push(words.join(' '));
    for (s = 0; s < q.options.length; s++) {
      var o = q.options[s];
      if (o.word === q.answerWord) continue;
      /* 4. same theme — "roti vs chawal", never "roti vs Tuesday" */
      if (o.theme !== q.theme) offTheme.push(o.word + '/' + o.theme + ' vs ' + q.theme);
      /* 5. a distractor already standing in the sentence would be a second
            visible answer, and one that would ALSO fit the gap is not wrong */
      if (q.full.indexOf(o.word) >= 0) inSentence.push(o.word + ' in ' + q.full);
      if (o.word === q.answerWord) synonyms.push(o.word);
    }
    /* 6. the reward is held back until the answer is in */
    if (!q.full || q.full.indexOf(q.answerWord) < 0) noAns.push('full sentence lost ' + q.answerWord);
    if (q.audio || q.say) leaks.push('would speak ' + (q.audio || q.say) + ' before the answer');
  }
  ok('sentenceBlank generates', seen > 100, 'only ' + seen + ' of 160 draws');
  eq('the blanked sentence NEVER contains the answer word', leaks.length, 0);
  if (leaks.length) console.log('       ' + leaks.slice(0, 4).join('\n       '));
  eq('the answer is always among the options at answerIndex', noAns.length, 0);
  eq('four distinct options every time', dupes.length, 0);
  eq('every distractor comes from the answer’s own theme', offTheme.length, 0);
  if (offTheme.length) console.log('       ' + offTheme.slice(0, 4).join('\n       '));
  eq('no distractor is already standing in the sentence', inSentence.length, 0);
  eq('and none of them is the answer wearing another spelling', synonyms.length, 0);

  /* the synonym rule, made concrete: 'thanks' and 'thank you' both fit the
     same gap, so they must never be offered against each other */
  var syn = 0;
  for (i = 0; i < 240; i++) {
    var qs = B.sentenceBlank('hi', { seed: 'syn-' + i, word: 'धन्यवाद' });
    if (qs.type !== 'sentenceBlank') continue;
    if (qs.options.some(function (o) { return o.word === 'शुक्रिया'; })) syn++;
  }
  eq('a synonym that would also fit is never a distractor (dhanyavaad / shukriya)', syn, 0);

  /* PIN: the planner names the word, and the question drills THAT word */
  var pinned = B.nextQuestion('hi', 's3', 5, { item: 'रोटी', type: 'sentenceBlank' });
  eq('a pinned word is the word blanked', pinned.answerWord, 'रोटी');
  eq('and the item key the SRS moves is that word', pinned.itemKey, 'word:रोटी');
  eq('the pinned sentence is the pinned word’s own', pinned.full, B.sentence('hi', 'रोटी').s);
  eq('a multi-word entry blanks whole', B.sentenceBlank('hi', { seed: 'mw', word: 'हवाई जहाज़' }).blanked.indexOf('हवाई जहाज़'), -1);

  /* a pack with no sentences must fall back to something winnable rather
     than render an empty question — the same fallback readPassage makes */
  eq('a pack without sentences falls back to wordBuild', B.sentenceBlank('pa', { seed: 'fb' }).type, 'wordBuild');
  eq('and so does the stage that lists the type', ['wordBuild', 'listenPoint'].indexOf(
    B.nextQuestion('pa', 's3', 'fb2', { type: 'sentenceBlank' }).type) >= 0, true);

  var demo = B.nextQuestion('hi', 's3', 'blank-demo', { type: 'sentenceBlank' });
  console.log('  “' + demo.blanked + '”  (' + demo.en + ')');
  console.log('  options: ' + demo.options.map(function (o) { return o.word + '/' + o.roman; }).join('  ') +
    '   answer=' + demo.answerWord + ' idx=' + demo.answerIndex);
  console.log('  after the answer: ' + demo.full + '  ·  ' + demo.sentAudio);
}());

hdr('the stage that carries it');
eq('s3 lists sentenceBlank beside listenPoint and wordBuild',
  B.stage('hi', 's3').types.join(','), 'listenPoint,wordBuild,sentenceBlank');
ok('a pinned word can be drilled as a fill-the-blank',
  B.generators.sentenceBlank && (function () {
    var types = {}, i;
    for (i = 0; i < 40; i++) {
      var pl = B.session('hi', 's3', { srs: {}, window: [], band: 3, path: 'heritage' }, { seed: 'pin-' + i });
      pl.specs.forEach(function (sp) { if (sp.type) types[sp.type] = 1; });
    }
    return !!types.sentenceBlank;
  }()));

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

/* ================= 4. THE SESSION PLANNER (Phase 1-2) ================= */
console.log('\n\n########## SESSION PLANNER ##########');

var KEY_PREFIX = { s0: 'word:', s1: 'letter:', s2: 'matra:', s3: 'word:', s6: 'conjunct:', s7: 'letter:' };
var fresh = function () { return { srs: {}, window: [], band: 1, path: 'beginner' }; };

['hi', 'pa'].forEach(function (pid) {
  ['s1', 's2', 's3'].forEach(function (sid) {
    var st = fresh();
    var pl = B.session(pid, sid, st, { now: t0, seed: 'sess-' + pid + sid });
    ok(pid + '/' + sid + ' session returns a plan', !!pl && pl.specs.length > 0);
    var graded = pl.specs.filter(function (s) { return s.kind !== 'introduce'; });
    eq(pid + '/' + sid + ' plans exactly 12 graded beats', graded.length, 12);
    /* order is the ramp: the introduce beats are the FIRST items of
       stage.items, in list order */
    var stage = B.stage(pid, sid);
    var intros = pl.specs.filter(function (s) { return s.kind === 'introduce'; });
    ok(pid + '/' + sid + ' fresh profile introduces something', intros.length >= 1);
    var wantKeys = stage.items.slice(0, intros.length).map(function (it) {
      return KEY_PREFIX[sid] + (typeof it === 'object' ? (it.id || it.hi) : it);
    });
    eq(pid + '/' + sid + ' introduces follow stage.items order',
      intros.map(function (s) { return s.key; }).join(','), wantKeys.join(','));
    /* each introduction is followed straight away by two drills of that item */
    var i0 = pl.specs.indexOf(intros[0]);
    ok(pid + '/' + sid + ' a new item is drilled twice right after its intro',
      pl.specs[i0 + 1].kind === 'drill' && pl.specs[i0 + 1].key === intros[0].key &&
      pl.specs[i0 + 2].kind === 'drill' && pl.specs[i0 + 2].key === intros[0].key);
    /* every graded spec names a type the stage allows */
    var badT = graded.filter(function (s) { return stage.types.indexOf(s.type) < 0; });
    ok(pid + '/' + sid + ' plan types are legal for the stage', badT.length === 0,
      badT.map(function (s) { return s.type; }).join(','));
    /* deterministic for a given state and seed */
    eq(pid + '/' + sid + ' same seed -> same plan',
      JSON.stringify(B.session(pid, sid, fresh(), { now: t0, seed: 'sess-' + pid + sid })),
      JSON.stringify(pl));
  });
});

/* pinned questions actually drill the pinned item */
var pq = B.nextQuestion('hi', 's1', 7, { item: 'ख', type: 'soundMatch' });
eq('pinned soundMatch asks the pinned letter', pq.answer, 'ख');
eq('pinned soundMatch stamps its itemKey', pq.itemKey, 'letter:ख');
var pq2 = B.nextQuestion('hi', 's2', 7, { item: 'ी', type: 'matraAttach' });
eq('pinned matraAttach asks the pinned sign', pq2.matra, 'ी');
var pq3 = B.nextQuestion('hi', 's3', 7, { item: 'पानी', type: 'wordBuild' });
eq('pinned wordBuild builds the pinned word', pq3.word, 'पानी');
var pq4 = B.nextQuestion('hi', 's1', 7, { item: 'आ', type: 'oddOneOut' });
eq('pinned oddOneOut makes the pinned vowel the odd one', pq4.answer, 'आ');

/* 85% STEERING: a struggling window brings nothing new and leans on review;
   a soaring one brings extra */
var stBad = fresh();
stBad.window = [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0].map(function (v) { return { ok: v, nw: 1 }; });
B.stage('hi', 's1').items.slice(0, 6).forEach(function (ch, i) {
  stBad.srs['letter:' + ch] = { key: 'letter:' + ch, box: 1, seen: 3, due: t0 - 1000 };
});
var plBad = B.session('hi', 's1', stBad, { now: t0, seed: 'bad' });
eq('struggling window -> no new items', plBad.newN, 0);
ok('struggling window -> review-heavy', plBad.reviewN >= 4, 'reviewN=' + plBad.reviewN);
var stGood = fresh(); stGood.band = 2;
stGood.window = [1,1,1,1,1,1,1,1,1,1,1,1].map(function (v) { return { ok: 1, nw: 1 }; });
stGood.srs['letter:अ'] = { key: 'letter:अ', box: 3, seen: 4, due: t0 + 9e9 };  /* something seen, so the fresh-stage seeding stays out of it */
var plGood = B.session('hi', 's1', stGood, { now: t0, seed: 'good' });
eq('soaring window at band 2 -> an extra new item', plGood.newN, 3);

/* the review tail closes the session with SRS-due items */
var stDue = fresh();
stDue.srs['letter:अ'] = { key: 'letter:अ', box: 3, seen: 5, due: t0 - 5000 };
var plDue = B.session('hi', 's1', stDue, { now: t0, seed: 'due' });
var last = plDue.specs[plDue.specs.length - 1];
ok('a due card comes back as the closing review', last.kind === 'review' && last.key === 'letter:अ',
  JSON.stringify(last));

/* THE WHOLE ARC IN ONE PLAN: teach a new thing, drill THAT thing, close on
   review. This is the shape the rebuild exists to produce, asserted whole. */
(function () {
  var st = fresh();
  st.band = 2;
  /* some ground already held, one card of it overdue, so a review is owed */
  B.stage('hi', 's1').items.slice(0, 5).forEach(function (ch, i) {
    st.srs['letter:' + ch] = { key: 'letter:' + ch, box: i === 0 ? 3 : 1, seen: 4,
                               due: i === 0 ? t0 - 90000 : t0 + 9e8 };
  });
  var pl = B.session('hi', 's1', st, { now: t0, seed: 'arc' });
  var intro = pl.specs.filter(function (s) { return s.kind === 'introduce'; })[0];
  ok('the arc introduces', !!intro);
  var drills = pl.specs.filter(function (s) { return s.kind === 'drill' && s.key === intro.key; });
  ok('the arc drills the thing it just introduced', drills.length >= 2, 'drills=' + drills.length);
  var types = {}; drills.forEach(function (d) { types[d.type] = 1; });
  ok('those drills are not the same question twice', Object.keys(types).length >= 2,
    Object.keys(types).join(','));
  var revs = pl.specs.filter(function (s) { return s.kind === 'review'; });
  ok('the arc closes on review of what slipped', revs.length >= 1 && revs[0].key === 'letter:अ',
    JSON.stringify(revs.map(function (r) { return r.key; })));
  ok('review comes last, not first',
    pl.specs.indexOf(revs[0]) > pl.specs.indexOf(drills[drills.length - 1]));
}());

/* MISS REPLAY: a missed item re-enters the SAME session, once */
(function () {
  var pl = B.session('hi', 's1', fresh(), { now: t0, seed: 'replay' });
  var n = pl.specs.length;
  var missed = pl.specs.filter(function (s) { return s.kind === 'drill'; })[0];
  var at = pl.specs.indexOf(missed);
  B.replayMiss(pl, at, missed);
  eq('a miss puts one more beat in the plan', pl.specs.length, n + 1);
  var copies = pl.specs.filter(function (s, i) { return i > at && s.replay && s.key === missed.key; });
  eq('the replay drills the same item, once', copies.length, 1);
  ok('the replay lands later in the same session', pl.specs.indexOf(copies[0]) > at);
  B.replayMiss(pl, at, missed);
  eq('a second miss of the same beat does not breed a third copy', pl.specs.length, n + 1);
  var introSpec = pl.specs.filter(function (s) { return s.kind === 'introduce'; })[0];
  B.replayMiss(pl, 0, introSpec);
  eq('an introduce beat is never replayed (it was never graded)', pl.specs.length, n + 1);
  /* and the card itself drops a box — the other half of the rule */
  var c = { key: 'letter:क', box: 3 };
  SRS.review(c, false, t0);
  eq('a missed item drops one SRS box', c.box, 2);
  ok('and is due again within the session', c.due - t0 <= 2 * 86400000);
}());

/* TEST-OUT: six pinned questions spread across the whole ramp */
var plT = B.session('pa', 's2', fresh(), { testout: true, seed: 'to' });
eq('test-out plans six questions', plT.specs.length, 6);
ok('test-out reaches the far end of the ramp',
  plT.specs.some(function (s) { return s.key === 'matra:' + B.stage('pa', 's2').items.slice(-1)[0]; }));

/* THE BAND: climb fast (10 @ >=80% with new-ish), fall slow (12 @ <65%) */
function win(n, okFrac, nw) {
  var o = [], i; for (i = 0; i < n; i++) o.push({ ok: i < Math.round(n * okFrac) ? 1 : 0, nw: nw ? 1 : 0 });
  return o;
}
eq('band promotes on 10 good with new-ish', SRSBAND(1, win(10, 0.9, true)), 2);
eq('band will not promote on old cards alone', SRSBAND(1, win(10, 0.9, false)), 1);
eq('band will not promote on a short window', SRSBAND(1, win(8, 1, true)), 1);
eq('band demotes only on a full bad window', SRSBAND(3, win(12, 0.5, true)), 2);
eq('band holds at 11 bad answers', SRSBAND(3, win(11, 0.5, true)), 3);
eq('band holds in the middle', SRSBAND(2, win(12, 0.7, true)), 2);
eq('band caps at 5', SRSBAND(5, win(10, 1, true)), 5);
eq('band floors at 1', SRSBAND(1, win(12, 0.1, true)), 1);
function SRSBAND(b, w) { return B.bandStep(b, w); }

/* READINESS: boxes -> new / learning / review / mastered */
var rSrs = {
  'letter:अ': { key: 'letter:अ', box: 5, seen: 9 },
  'letter:आ': { key: 'letter:आ', box: 3, seen: 5 },
  'letter:इ': { key: 'letter:इ', box: 1, seen: 2 },
  'letter:ई': { key: 'letter:ई', box: 0, intro: t0 }
};
var rd = B.readiness('hi', 's1', rSrs);
eq('readiness total = the stage items', rd.total, 46);
eq('readiness mastered (box 5)', rd.mastered, 1);
eq('readiness review (box 3-4)', rd.review, 1);
eq('readiness learning (box 0 seen - 2)', rd.learning, 2);
eq('readiness unseen', rd.unseen, 42);

console.log('  session/band/readiness: planner walked for hi+pa s1-s3, steering, test-out, band, readiness');

/* ================= PHASE A: the seams are generic ================= */
/* The engine reached Hindi's sentences and dialogues through IND_HI_* globals
   that sentenceMap() and pickReply() special-cased by pack id. Invisible while
   only one pack had content; eight forgotten exceptions the moment the others
   land. These assert the exception cannot come back. */
(function () {
  /* Comments are stripped first: this asserts about CODE. A comment that
     records why the special case was removed must not fail the build for
     quoting the thing it removed. */
  var src = require('fs').readFileSync(__dirname + '/../app/bhasha.js', 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
  eq('no IND_HI_SENTENCES special-case in the engine', /IND_HI_SENTENCES/.test(src), false);
  eq('no IND_HI_DIALOGUES special-case in the engine', /IND_HI_DIALOGUES/.test(src), false);
  eq("no pack-id branch reaching content", /pack\.id === 'hi'/.test(src), false);
  /* and the generic route actually resolves */
  eq('hi sentences resolve through the shared bank', Object.keys(B.sentences('hi') || {}).length, 507);
  eq('hi dialogues resolve through the shared bank', (B.dialogues('hi') || []).length, 72);
  eq('a pack with no bank returns null, not a throw', B.dialogues('ta'), null);
  console.log('  phase A: sentence/dialogue banks are per-pack, no Hindi special case');
}());

/* ================= result ================= */
console.log('\n' + (fails ? 'FAILED ' + fails + ' of ' + checks + ' checks' : 'ALL ' + checks + ' CHECKS PASSED'));
process.exit(fails ? 1 : 0);
