#!/usr/bin/env node
/* The Gita, all 700 verses, built from sources — never typed (CLAUDE.md editorial rules 2 and 3;
   docs/21-gita.md; owner, 3 Oct 2026: "an advanced gita learning module with all 700 shlokas").

   IN   tools/gita-src/gita_700.json   the merged edition (provenance per source in PROVENANCE.json):
                                       Sanskrit — gita/gita data/verse.json (Unlicense; the IIT Kanpur
                                       Gita Supersite text), 701→700 renumbered, encoding repaired;
                                       English — Annie Besant, 4th ed. 1922 (public domain), and
                                       Swami Swarupananda 1909 (public domain).
        tools/gita-src/crosscheck_sa.json   every verse against GRETIL, the DCS (BORI critical
                                       edition), vedicscriptures and Besant's own Devanagari; the 33
                                       where the base is outvoted by witnesses that agree.
        tools/gita-src/chapters.json   the chapters' Sanskrit names only (gita/gita, Unlicense). Its English
                                       titles and summaries are NOT used: they carry no source and argue one
                                       school's reading, which is not this app's to pick.
        tools/gita-src/swarupananda-front.json  the chapter titles and three lines of the foreword of
                                       Swarupananda's 1909 edition (public domain), checked verbatim.
        tools/gita-src/review.json     whether a person has signed it off (until then: tester mode only).
        tools/gita-src/guru.json + guru-voice.json  the guru's words, and which are spoken (tools/gita-guru.py).
        tools/gita-src/chant.json + chant-lines.json  the chanting, if made (tools/gita-chant.py,
                                       tools/gita-lines.py): how each verse was checked, and its line times.
   OUT  app/data-gita.js               the chapters (lazy group 'gita')
        app/data-gita-NN.js            each chapter's verses (lazy group 'gita-NN')
        app/data-gita-voice.js         which verses have a chant, how it was checked, where its lines fall
        tools/gita-src/resolutions.json  what was changed from the base, and on whose evidence

   A reading the base gets wrong is corrected only when witnesses that agree with each other
   outvote it AND one of them carries Devanagari to take it from; otherwise the base stands and
   the verse says it needs a reviewer. Two places where editions genuinely differ (8.7, 18.68)
   keep the vulgate base and say so. IAST and the plain reading are converted from the Devanagari
   here (tools/lib/sanskrit.js), so they cannot disagree with it.

   Run: node tools/build-gita.js */
'use strict';
const fs = require('fs'), path = require('path');
const { iast, simple, heardDistance } = require('./lib/sanskrit');
const SRC = path.join(__dirname, 'gita-src'), APP = path.join(__dirname, '..', 'app');
const ALL = JSON.parse(fs.readFileSync(path.join(SRC, 'gita_700.json'), 'utf8'));
const CX = JSON.parse(fs.readFileSync(path.join(SRC, 'crosscheck_sa.json'), 'utf8'));
const CH = JSON.parse(fs.readFileSync(path.join(SRC, 'chapters.json'), 'utf8'));
const FRONT = JSON.parse(fs.readFileSync(path.join(SRC, 'swarupananda-front.json'), 'utf8'));
const REVIEW = JSON.parse(fs.readFileSync(path.join(SRC, 'review.json'), 'utf8'));
const readIf = f => fs.existsSync(path.join(SRC, f)) ? JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8')) : {};
const CHANT = readIf('chant.json'), LINES = readIf('chant-lines.json');
/* THE GURU'S WORDS: shown and spoken word for word; a line counts as voiced only if its clip was
   made from these exact words (tools/gita-guru.py records a hash of them) */
const GURU = JSON.parse(fs.readFileSync(path.join(SRC, 'guru.json'), 'utf8')), GV = readIf('guru-voice.json');
delete GURU._;
const sha = t => require('crypto').createHash('sha1').update(t).digest('hex').slice(0, 12);
const GURU_VOICED = Object.keys(GURU).filter(k => GV[k] && GV[k].txt === sha(GURU[k]) && fs.existsSync(path.join(APP, 'voice', 'gita', 'guru', k + '.mp3')));
const COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 34, 27, 20, 24, 28, 78];
const GENUINE = { '8.7': 'asaṃśayam / asaṃśayaḥ', '18.68': 'imaṃ / idaṃ' };

const words = s => String(s).replace(/[।॥|]/g, ' ').split(/\s+/).filter(Boolean);
function lines(sa) { return String(sa).split('\n').map(l => l.replace(/[\s।॥|]+$/g, '').replace(/^\s+/, '')).filter(Boolean); }
function setOut(ls) { return ls.map((l, i) => l + (i === ls.length - 1 ? ' ॥' : ' ।')).join('\n'); }

/* put the witnesses' words into the base's own lines, word for word where the counts agree */
function substitute(baseLines, dev) {
  const per = baseLines.map(l => words(l)), flat = [].concat(...per), w = words(dev);
  if (w.length === flat.length) {
    let k = 0; return per.map(ws => ws.map(() => w[k++]).join(' '));
  }
  /* counts differ (a sandhi joined or split): keep the base's line breaks by the nearest split */
  if (per.length === 1) return [w.join(' ')];
  const target = per[0].join(' ').length / flat.join(' ').length;
  let best = 1, bd = 1e9;
  for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(' ').length / w.join(' ').length - target); if (d < bd) { bd = d; best = i; } }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
}

const review = {}; (CX.review || []).forEach(r => { review[r.ref] = r; });
const flat = s => String(s).normalize('NFC').toLowerCase().replace(/[^a-zāīūṛṝḷḹṃḥṅñṭḍṇśṣ]/g, '');
function wordWise(r, baseLines) {
  const dev = (r.readings || {}).V || (r.readings || {}).E, roman = ['C', 'D'].map(k => flat((r.readings || {})[k] || '')).filter(Boolean);
  if (!dev || roman.length < 2) return false;
  const a = words(baseLines.join(' ')), b = words(dev);
  if (a.length !== b.length) return false;
  const changed = b.filter((w, i) => w !== a[i]);
  return changed.length > 0 && changed.every(w => roman.every(R => R.indexOf(flat(iast(w))) >= 0));
}
const resolutions = [], byCh = {};
for (const e of ALL) {
  const ch = +e.ch, v = +e.v, ref = ch + '.' + v;
  let ls = lines(e.sa), rv = null;
  const r = review[ref];
  if (GENUINE[ref]) { rv = 'Editions differ here (' + GENUINE[ref] + '); this is the vulgate reading.'; resolutions.push({ ref, kept: 'base', why: rv }); }
  else if (r) {
    const groups = (r.agreement || []).slice().sort((a, b) => b.length - a.length), win = groups[0] || '';
    const dev = win.indexOf('E') >= 0 && r.readings.E ? r.readings.E : win.indexOf('V') >= 0 && r.readings.V ? r.readings.V : null;
    if (win.indexOf('A') < 0 && dev) {
      const before = setOut(ls); ls = substitute(ls, dev);
      resolutions.push({ ref, from: before, to: setOut(ls), witnesses: win, why: r.why });
    } else if (wordWise(r, ls)) {
      /* WORD BY WORD: the Devanagari witness can sit in a different group for a reason that has
         nothing to do with the dispute (18.71: V spells the nasal of शुभाँल् as the base does, so it
         is not grouped with GRETIL and the DCS) — yet on every word where it differs from the base,
         the IAST witnesses say what it says. Then its Devanagari is taken, and only then. */
      const before = setOut(ls); ls = substitute(ls, r.readings.V || r.readings.E);
      resolutions.push({ ref, from: before, to: setOut(ls), witnesses: 'word by word', why: 'every word where the Devanagari witness differs from the base is read the same way by the IAST witnesses' });
    } else { rv = 'The editions disagree here and none of the agreeing ones has Devanagari to take; a reviewer should check it.'; resolutions.push({ ref, kept: 'base', why: rv, groups }); }
  }
  const sa = setOut(ls);
  const spl = e.speaker_line && e.speaker_line !== 'None' ? String(e.speaker_line).trim() : null;
  (byCh[ch] = byCh[ch] || []).push({
    v, sp: e.speaker, spm: e.speaker_change_mid_verse || null, spl, spp: e.speaker_line_position || (spl ? 'before' : null),
    sa, iast: iast(sa), read: simple(iast(sa)),
    spli: spl ? iast(spl) : null, splr: spl ? simple(iast(spl)) : null,
    en: String(e.en || '').trim(), en2: String(e.en_swarupananda || '').trim() || null,
    /* Swarupananda sometimes translates two or three verses as one sentence: say which */
    en2r: e.en_swarupananda_range ? String(e.en_swarupananda_range) : null,
    rv
  });
}
/* the counts are the vulgate's, or nothing is written */
COUNTS.forEach((n, i) => { const got = (byCh[i + 1] || []).length; if (got !== n) throw new Error(`chapter ${i + 1}: ${got} verses, the vulgate has ${n}`); });
const total = Object.values(byCh).reduce((a, x) => a + x.length, 0);
if (total !== 700) throw new Error(total + ' verses, not 700');

const chapters = CH.slice().sort((a, b) => a.chapter_number - b.chapter_number).map(c => ({
  n: c.chapter_number, name: c.name, iast: iast(c.name), title: FRONT.titles[c.chapter_number - 1],
  verses: byCh[c.chapter_number].length,
  speakers: byCh[c.chapter_number].reduce((o, x) => { o[x.sp] = (o[x.sp] || 0) + 1; return o; }, {})
}));
/* chapters.json counts chapter 13 as 35: it numbers the extra opening question ("prakṛtiṃ puruṣaṃ caiva…") that some
   editions carry and the 700-verse vulgate does not. The verses themselves are the vulgate's, so their count is the count. */
CH.forEach(c => { const want = COUNTS[c.chapter_number - 1]; if (c.verses_count !== want && !(c.chapter_number === 13 && c.verses_count === 35)) throw new Error('chapters.json says ' + c.verses_count + ' verses for chapter ' + c.chapter_number); });

const HEAD = '/* GENERATED by tools/build-gita.js from tools/gita-src — do not hand-edit. Sanskrit: gita/gita (Unlicense; the IIT Kanpur\n' +
  '   Gita Supersite text), cross-checked against GRETIL, the DCS and Besant; English: Annie Besant 1922 and Swami Swarupananda 1909\n' +
  '   (both public domain). IAST and the plain reading are converted from the Devanagari (tools/lib/sanskrit.js). */\n';
fs.writeFileSync(path.join(APP, 'data-gita.js'), HEAD + 'window.IND_GITA = ' + JSON.stringify({
  source: 'Sanskrit: the vulgate text of the IIT Kanpur Gita Supersite via gita/gita (public domain), checked against three other editions. English: Annie Besant (1922) and Swami Swarupananda (1909), both public domain.',
  titles: FRONT.source, foreword: FRONT.foreword,
  review: { status: REVIEW.status, by: REVIEW.by, on: REVIEW.on },
  guru: GURU, guruVoiced: GURU_VOICED,
  chapters }) + ';\nwindow.IND_GITA_V = window.IND_GITA_V || {};\n');
/* THE CHANT MANIFEST: [seconds, letters the blind listener heard differently, letters, line segments, human?]
   A verse with no entry has no chant yet, and the player says so rather than reaching for a device voice. */
const VO = {};
for (const ch of Object.keys(byCh)) for (const x of byCh[ch]) {
  const id = ch + '-' + x.v, c = CHANT[id], l = LINES[id];
  if (!l || (!c && l.kind !== 'human')) continue;
  /* the figure the screen quotes is the FAIR one (an anusvāra heard as the nasal it is said as is
     right), measured here from the listener's own transcript against this very text */
  const dev = (x.spl ? (x.spp === 'before' ? [x.spl].concat(x.sa.split('\n')) : [x.sa.split('\n')[0], x.spl].concat(x.sa.split('\n').slice(1))) : x.sa.split('\n')).join('\n');
  const fair = c ? heardDistance(c.heard, iast(dev.replace(/[।॥]/g, ' '))) : null;
  VO[id] = [l.d, fair ? fair.dist : null, fair ? fair.of : null, l.seg, l.kind === 'human' ? 1 : 0];
}
fs.writeFileSync(path.join(APP, 'data-gita-voice.js'), '/* GENERATED by tools/build-gita.js from tools/gita-src/chant.json + chant-lines.json — do not hand-edit.\n' +
  '   Per verse: [seconds, letters a blind second listener heard differently (an anusvāra heard as the nasal it is said as\n' +
  '   counts as right), letters, [[start, end] per chanted line], human]. */\n' +
  'window.IND_GITA_VOICE = ' + JSON.stringify(VO) + ';\n');
for (const c of chapters) {
  const nn = String(c.n).padStart(2, '0');
  fs.writeFileSync(path.join(APP, 'data-gita-' + nn + '.js'), HEAD + '(window.IND_GITA_V = window.IND_GITA_V || {})[' + c.n + '] = ' + JSON.stringify(byCh[c.n]) + ';\n');
}
fs.writeFileSync(path.join(SRC, 'resolutions.json'), JSON.stringify(resolutions, null, 1) + '\n');
console.log('gita: %d verses in 18 chapters; %d readings corrected on witness evidence, %d held for a reviewer; %d chanted',
  total, resolutions.filter(r => r.to).length, resolutions.filter(r => r.kept).length, Object.keys(VO).length);
