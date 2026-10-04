#!/usr/bin/env node
/* tools/check-gita.js — the Gita module holds to what it says (docs/21, app/gita.js).

     count     700 verses, the vulgate's count in every chapter, nothing missing or doubled
     source    every verse is its source's text, except the readings resolutions.json lists — and
               each of those is what the build says it is
     roman     IAST and the easy spelling are the converter's, from that Devanagari, every line;
               the converter agrees with an independent library on the letters
     english   every verse has Besant's English; Swarupananda's, where present, says its range
     titles    chapter titles are Swarupananda's, the foreword's lines are word for word his
     voice     every verse the manifest calls chanted has its file, its line times, and the
               distance the screen quotes is the one measured against THIS text (a corrected
               verse whose chant is stale fails here)
     art       every painting it names exists and none has lettering painted in
     guru      the guru's words are guru.json's, each spoken from exactly those words, and none is a gloss
     code      the microphone opens only from Record, its track stops on stop, nothing is uploaded,
               nothing pays coins, nothing writes mastery
     gate      not signed off → the module does not open outside tester mode, and says why
     screen    tester mode: the journey, a chapter and a verse paint; all six steps; the keys (1–6,
               arrows, space); touch; the computer-voice label; the chapter's raga; 390 px wide
   Run: node tools/check-gita.js [id] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..'), APP = path.join(ROOT, 'app'), SRC = path.join(__dirname, 'gita-src');
const { iast, simple, heardDistance } = require('./lib/sanskrit');
const COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 34, 27, 20, 24, 28, 78];
const only = process.argv[2];

function load() {
  const w = {}; global.window = w;
  for (const f of ['data-gita.js', 'data-gita-voice.js'].concat(COUNTS.map((_, i) => 'data-gita-' + String(i + 1).padStart(2, '0') + '.js'))) {
    delete require.cache[path.join(APP, f)]; require(path.join(APP, f));
  }
  return w;
}
const W = load();
const G = W.IND_GITA, V = W.IND_GITA_V, VO = W.IND_GITA_VOICE || {};
const all = () => { const o = []; for (let c = 1; c <= 18; c++) (V[c] || []).forEach(x => o.push([c, x])); return o; };
const norm = s => String(s).normalize('NFC').toLowerCase().replace(/[^a-zāīūṛṝḷḹṃḥṅñṭḍṇśṣ]/g, '');
function lev(a, b) {
  let p = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) { const c = [i]; for (let j = 1; j <= b.length; j++) c.push(Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0))); p = c; }
  return p[b.length];
}
function chantDev(x) {
  const lines = x.sa.split('\n'); let d = lines;
  if (x.spl && x.spp === 'before') d = [x.spl].concat(lines); else if (x.spl) d = [lines[0], x.spl].concat(lines.slice(1));
  return d;
}

const CHECKS = [];
const check = (id, what, fn) => CHECKS.push({ id, what, fn });

check('count', '700 verses, the vulgate count in each of 18 chapters, numbered 1..n', () => {
  if (G.chapters.length !== 18) throw new Error(G.chapters.length + ' chapters');
  let t = 0;
  COUNTS.forEach((n, i) => {
    const vs = V[i + 1] || [];
    if (vs.length !== n || G.chapters[i].verses !== n) throw new Error(`chapter ${i + 1}: ${vs.length} verses / index says ${G.chapters[i].verses}, the vulgate has ${n}`);
    vs.forEach((x, k) => { if (x.v !== k + 1) throw new Error(`chapter ${i + 1}: verse ${k + 1} is numbered ${x.v}`); });
    t += n;
  });
  if (t !== 700) throw new Error(t + ' verses');
});

check('source', 'each verse is the source text, or a listed correction of it — never typed', () => {
  const A = JSON.parse(fs.readFileSync(path.join(SRC, 'gita_700.json'), 'utf8'));
  const R = {}; JSON.parse(fs.readFileSync(path.join(SRC, 'resolutions.json'), 'utf8')).forEach(r => { R[r.ref] = r; });
  const flat = s => String(s).replace(/[\s।॥|]+/g, ' ').trim();
  let bad = [];
  for (const e of A) {
    const x = V[e.ch][e.v - 1], r = R[e.ch + '.' + e.v];
    const want = r && r.to ? r.to : e.sa;
    if (flat(x.sa) !== flat(want)) bad.push(e.ch + '.' + e.v);
    if (r && r.to && flat(r.from) !== flat(e.sa)) bad.push(e.ch + '.' + e.v + ' (resolution starts from another text)');
  }
  if (bad.length) throw new Error(bad.length + ' verses are not their source: ' + bad.slice(0, 6).join(', '));
  const held = Object.values(R).filter(r => r.kept);
  held.forEach(r => { const x = V[+r.ref.split('.')[0]][+r.ref.split('.')[1] - 1]; if (!x.rv) throw new Error(r.ref + ' is held for a reviewer but its screen does not say so'); });
});

check('roman', 'IAST and the easy spelling are converted from the Devanagari, line for line; a second converter agrees', () => {
  const A = JSON.parse(fs.readFileSync(path.join(SRC, 'gita_700.json'), 'utf8'));
  let bad = [], lib = 0;
  for (const [c, x] of all()) {
    if (x.iast !== iast(x.sa)) bad.push(c + '.' + x.v + ' iast');
    if (x.read !== simple(iast(x.sa))) bad.push(c + '.' + x.v + ' read');
    if (x.sa.split('\n').length !== x.iast.split('\n').length) bad.push(c + '.' + x.v + ' lines');
    if (x.spl && (x.spli !== iast(x.spl) || x.splr !== simple(iast(x.spl)))) bad.push(c + '.' + x.v + ' speaker line');
    const e = A.find(y => y.ch === c && y.v === x.v);
    /* the library writes candrabindu as ~, IAST as m̐: compare letters with both dropped */
    const n2 = s => norm(String(s).replace(/m̐|~/g, ''));
    if (e && e.iast_lib && n2(iast(e.sa.replace(/[।॥]/g, ' '))) === n2(e.iast_lib)) lib++;
  }
  if (bad.length) throw new Error(bad.length + ' lines not the converter\'s: ' + bad.slice(0, 6).join(', '));
  if (lib < 700) throw new Error('the converter and the independent library disagree on ' + (700 - lib) + ' verses');
});

check('english', 'every verse has Besant\'s English; Swarupananda\'s grouped verses say their range', () => {
  const A = JSON.parse(fs.readFileSync(path.join(SRC, 'gita_700.json'), 'utf8'));
  for (const [c, x] of all()) {
    if (!x.en || x.en.length < 12) throw new Error(c + '.' + x.v + ' has no English');
    const e = A.find(y => y.ch === c && y.v === x.v);
    if (x.en !== String(e.en).trim()) throw new Error(c + '.' + x.v + ' English is not the source\'s');
    if ((e.en_swarupananda_range || null) !== x.en2r) throw new Error(c + '.' + x.v + ' range lost');
  }
});

/* A CHILD'S READING (owner, 4 Oct 2026: "draft, flagged needs_review"): every one drafted by a
   computer from Besant and Swarupananda only, still flagged, still passing the lint against its own
   verse's English, and the page says so wherever one is shown. The Gita stays in tester mode. */
check('readings', 'each child\'s reading is flagged, from the two translations only, lint-clean, and labelled on the page', () => {
  const G = fs.existsSync(path.join(SRC, 'gloss.json')) ? JSON.parse(fs.readFileSync(path.join(SRC, 'gloss.json'), 'utf8')) : {};
  const { lint } = require('./lib/gita-gloss-lint.js');
  let shown = 0;
  for (const [c, x] of all()) {
    if (!x.kid) continue; shown++;
    const g = G[c + '-' + x.v];
    if (!g || g.kid !== x.kid) throw new Error(c + '.' + x.v + ' shows a reading that is not gloss.json\'s');
    if (!g.needs_review || g.by !== 'computer-drafted' || String(g.from) !== 'Besant 1922,Swarupananda 1909') throw new Error(c + '.' + x.v + ' reading is not flagged as an unchecked computer draft from the two translations');
    const w = lint(x.kid, x.en, x.en2); if (w.length) throw new Error(c + '.' + x.v + ' reading: ' + w.join('; '));
  }
  const ui = fs.readFileSync(path.join(APP, 'gita.js'), 'utf8');
  if (shown && !/drafted by a computer from the two translations below, and not yet checked by a person/.test(ui)) throw new Error('readings are shown without saying who drafted them');
  console.log('         ' + shown + ' of 700 verses have a child\'s reading, every one an unchecked draft');
});

check('titles', 'chapter titles are Swarupananda\'s; the foreword is quoted word for word; no unsourced summaries', () => {
  const F = JSON.parse(fs.readFileSync(path.join(SRC, 'swarupananda-front.json'), 'utf8'));
  G.chapters.forEach((c, i) => { if (c.title !== F.titles[i]) throw new Error('chapter ' + (i + 1) + ' title is not Swarupananda\'s'); if (c.summary || c.meaning) throw new Error('chapter ' + (i + 1) + ' carries an unsourced summary'); });
  const raw = path.join(require('os').tmpdir(), 'nope');
  if ((G.foreword.quotes || []).length !== 8) throw new Error('the foreword quotes changed');
  /* the words are checked against the page itself where the mirror is on this machine */
  const page = process.env.SWARUPANANDA_FOREWORD;
  if (page && fs.existsSync(page)) {
    const t = fs.readFileSync(page, 'utf8').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, m => ({ '&acirc;': 'â', '&amp;': '&' })[m] || m).replace(/\s+/g, ' ');
    G.foreword.quotes.forEach(q => { if (t.indexOf(q) < 0) throw new Error('not in the foreword: ' + q.slice(0, 50)); });
  }
  void raw;
});

check('voice', 'each chant has its file and line times, and the quoted distance is against THIS text', () => {
  const CH = fs.existsSync(path.join(SRC, 'chant.json')) ? JSON.parse(fs.readFileSync(path.join(SRC, 'chant.json'), 'utf8')) : {};
  const crypto = require('crypto');
  let bad = [];
  for (const [c, x] of all()) {
    const id = c + '-' + x.v, vo = VO[id];
    if (!vo) continue;
    const human = !!vo[4], f = path.join(APP, 'voice', 'gita', human ? 'human' : '', id + '.mp3');
    if (!fs.existsSync(f)) { bad.push(id + ' no file'); continue; }
    const dev = chantDev(x);
    if (!Array.isArray(vo[3]) || vo[3].length !== dev.length) bad.push(id + ' line times do not match its ' + dev.length + ' lines');
    else vo[3].forEach((s, i) => { if (!(s[1] > s[0]) || (i && s[0] < vo[3][i - 1][1] - 0.01) || s[1] > vo[0] + 0.05) bad.push(id + ' line ' + i + ' times'); });
    if (human) continue;
    const rec = CH[id];
    if (!rec) { bad.push(id + ' not in chant.json'); continue; }
    const wantI = iast(dev.join('\n').replace(/[।॥]/g, ' ')), fair = heardDistance(rec.heard, wantI);
    if (vo[1] !== fair.dist || vo[2] !== fair.of) bad.push(id + ' screen quotes another distance than the listener\'s transcript gives');
    const want = norm(wantI);
    if (rec.txt && rec.txt !== crypto.createHash('sha1').update(dev.join('\n')).digest('hex').slice(0, 12)) bad.push(id + ' was chanted from another text — re-chant it');
    else if (!rec.txt && (want.length !== rec.of || lev(norm(rec.heard), want) !== rec.dist)) bad.push(id + ' was chanted from another text — re-chant it');
  }
  if (bad.length) throw new Error(bad.length + ': ' + bad.slice(0, 6).join('; '));
});

check('guru', 'the guru\'s lines are guru.json\'s, each spoken from those exact words, none a gloss', () => {
  const J = JSON.parse(fs.readFileSync(path.join(SRC, 'guru.json'), 'utf8')); delete J._;
  const GV = JSON.parse(fs.readFileSync(path.join(SRC, 'guru-voice.json'), 'utf8'));
  const sha = t => require('crypto').createHash('sha1').update(t).digest('hex').slice(0, 12);
  if (JSON.stringify(G.guru) !== JSON.stringify(J)) throw new Error('data-gita.js carries other words than guru.json — rerun build-gita');
  for (const k of Object.keys(J)) {
    if (!GV[k] || GV[k].txt !== sha(J[k])) throw new Error(k + ' was spoken from other words — rerun tools/gita-guru.py --only ' + k);
    if (!fs.existsSync(path.join(APP, 'voice', 'gita', 'guru', k + '.mp3'))) throw new Error(k + ' has no clip');
    if (GV[k].d !== 0) throw new Error(k + ': the listener heard ' + GV[k].d + ' words differently');
    if (G.guruVoiced.indexOf(k) < 0) throw new Error(k + ' is not offered as spoken');
  }
  ['sp-krishna', 'sp-arjuna', 'sp-sanjaya', 'sp-dhritarashtra'].forEach(k => { if (!J[k]) throw new Error('no line for ' + k); });
  /* instructions, not doctrine: the guru never says what a verse means */
  const gloss = Object.entries(J).filter(([k, t]) => /\b(it teaches|this verse teaches|means that|the lesson|God|soul|duty|dharma|karma)\b/i.test(t) && k !== 'mean');
  if (gloss.length) throw new Error('the guru glosses: ' + gloss.map(g => g[0]).join(', '));
});

check('art', 'every painting named exists and none has lettering painted in', () => {
  const src = fs.readFileSync(path.join(APP, 'gita.js'), 'utf8');
  const m = src.match(/var ART = \{([\s\S]*?)\};/);
  const ids = [...m[1].matchAll(/'(\d+-\d+)'/g)].map(x => x[1]);
  const LETTERED = ['26-0', '26-2', '26-7', '25-3'];
  ids.forEach(id => {
    if (!fs.existsSync(path.join(APP, 'art', 'epic', 'mahabharata-' + id + '.jpg'))) throw new Error(id + ' does not exist');
    if (LETTERED.indexOf(id) >= 0) throw new Error(id + ' has lettering painted into it');
  });
});

check('code', 'the mic opens only from Record and stops; nothing uploaded; no coins; no mastery', () => {
  const s = fs.readFileSync(path.join(APP, 'gita.js'), 'utf8');
  const gum = s.split('getUserMedia(').length - 1;
  if (gum !== 1) throw new Error(gum + ' calls to getUserMedia');
  const recFn = s.slice(s.indexOf('function recStart'), s.indexOf('function recStop'));
  if (recFn.indexOf('getUserMedia(') < 0) throw new Error('the microphone opens outside recStart');
  if (!/onstop = function \(\) \{\s*stream\.getTracks\(\)\.forEach\(function \(t\) \{ t\.stop\(\); \}\)/.test(recFn)) throw new Error('the track is not stopped first thing on stop');
  const callers = (s.match(/recStart\(\)/g) || []).length - (s.match(/function recStart\(\)/g) || []).length;
  if (callers !== 1 || !/case 'recstart': recStart\(\)/.test(s)) throw new Error('recStart is called from somewhere other than the Record button');
  if (/\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket/.test(s)) throw new Error('gita.js talks to the network');
  if (/\bearn\(|IND_WALLET|ledger|IND_ECONOMY/.test(s)) throw new Error('gita.js pays or writes mastery');
  if (!/kind: 'gita'/.test(s)) throw new Error('recordings are not marked as the Gita\'s');
  const app = fs.readFileSync(path.join(APP, 'app.js'), 'utf8');
  if (!/c\.kind !== 'gita'/.test(app)) throw new Error('the Gita\'s recordings would show on Nani\'s shelf');
});

/* ------------------------------------------------------------------ the screen */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.mp3': 'audio/mpeg' };
function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(APP, p);
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404).end('no'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}
const DESK = { width: 1280, height: 860 }, PHONE = { width: 390, height: 844 };
const firstChanted = () => Object.keys(VO).filter(k => !VO[k][4]).sort((a, b) => { const [c1, v1] = a.split('-').map(Number), [c2, v2] = b.split('-').map(Number); return c1 - c2 || v1 - v2; })[0];

check('gate', 'not signed off: a child cannot open it, and is told why; nothing of the verse is shown', async ({ p, base }) => {
  if (G.review && G.review.status === 'reviewed' && G.review.by) return;
  for (const r of [['gita'], ['gitach', '2'], ['gitav', '2.47']]) {
    await p.evaluate(a => window.BI.go(a[0], a[1]), r); await p.waitForTimeout(700);
    const t = await p.evaluate(() => ({ text: document.getElementById('main').innerText, verse: !!document.querySelector('[data-gverse], .gt-grid, .gt-chtile') }));
    if (t.verse) throw new Error('#/' + r.join('/') + ' opened for a child before review');
    if (!/checking it first/.test(t.text)) throw new Error('#/' + r.join('/') + ' does not say why it is closed');
    if (/कर्मण्येवाधिकारस्ते/.test(t.text)) throw new Error('verse text shown behind the gate');
  }
  await p.evaluate(() => window.BI.go('verses', 'gita')); await p.waitForTimeout(500);
  const door = await p.evaluate(() => !!document.querySelector('[data-v="gita"]'));
  if (door) throw new Error('the Gita shelf offers the door outside tester mode');
});

check('screen', 'tester: journey, chapter, verse; six steps; keys; label; raga; fits 390', async ({ p, base }) => {
  const vid = firstChanted();
  if (!vid) throw new Error('no verse is chanted yet');
  const arg = vid.replace('-', '.'), ch = +vid.split('-')[0];
  for (const vp of [DESK, PHONE]) {
    await p.setViewportSize(vp);
    await p.goto(base + '?tester=1#/gita', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
    const j = await p.evaluate(() => ({ tiles: document.querySelectorAll('.gt-chtile').length, guru: !!document.querySelector('.gt-guru'), deva: [...document.querySelectorAll('.gt-chtile .deva')].every(e => e.getAttribute('lang') === 'sa') }));
    if (j.tiles !== 18 || !j.guru || !j.deva) throw new Error('journey: ' + JSON.stringify(j));
    await p.evaluate(c => window.BI.go('gitach', String(c)), ch); await p.waitForTimeout(600);
    const c = await p.evaluate(() => ({ n: document.querySelectorAll('.gt-vn').length, head: (document.querySelector('.gt-chname') || {}).innerText }));
    if (c.n !== COUNTS_CH) throw new Error('chapter shows ' + c.n + ' verses');
    await p.evaluate(a => window.BI.go('gitav', a), arg); await p.waitForTimeout(700);
    const v = await p.evaluate(() => ({ lines: document.querySelectorAll('[data-gl]').length, label: (document.querySelector('.gt-src') || {}).innerText || '',
      steps: document.querySelectorAll('[data-ga="step"]').length, music: window.IND_AUDIO && window.IND_AUDIO.wanted && window.IND_AUDIO.wanted(),
      wide: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth, sa: [...document.querySelectorAll('.gt-sa')].every(e => e.getAttribute('lang') === 'sa') }));
    if (!v.lines || !v.sa) throw new Error('the verse is not set in Devanagari with lang=sa');
    if (!/computer voice/.test(v.label) || !/second program listened/.test(v.label)) throw new Error('the computer voice is not labelled: ' + v.label.slice(0, 80));
    if (v.music !== THEME_CH) throw new Error('music is ' + v.music + ', the chapter\'s raga is ' + THEME_CH);
    if (v.wide > 0) throw new Error(vp.width + 'px: ' + v.wide + 'px sideways scroll');
    /* the keys: 1–6 choose a step */
    for (const [k, s] of [['2', 'read'], ['3', 'mean'], ['4', 'repeat'], ['5', 'record'], ['6', 'remember'], ['1', 'listen']]) {
      await p.keyboard.press(k); await p.waitForTimeout(150);
      const st = await p.evaluate(() => (document.querySelector('[data-gstep]') || {}).getAttribute && document.querySelector('[data-gstep]').getAttribute('data-gstep'));
      if (st !== s) throw new Error('key ' + k + ' gave ' + st);
    }
    /* touch: a tap chooses a step too */
    await p.click('[data-ga="step"][data-s="mean"]'); await p.waitForTimeout(150);
    const en = await p.evaluate(() => (document.querySelector('.gt-en') || {}).innerText || '');
    if (en.length < 12) throw new Error('the meaning step has no English');
    await p.click('[data-ga="step"][data-s="listen"]'); await p.waitForTimeout(150);
  }
  /* space plays the chant, and the right arrow walks to the next verse */
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  /* the guided way: the guru first says who is speaking, THEN the chant */
  await p.keyboard.press(' '); await p.waitForTimeout(800);
  const g1 = await p.evaluate(() => ({ voice: !!window.IND_GITA_UI._t.ui.voice, on: !!document.querySelector('[data-ga="play"].on') }));
  if (!g1.voice || g1.on) throw new Error('space did not start with the guru introducing the verse: ' + JSON.stringify(g1));
  await p.waitForFunction(() => !!document.querySelector('[data-ga="play"].on'), null, { timeout: 20000 }).catch(() => {});
  const pl = await p.evaluate(() => ({ on: !!document.querySelector('[data-ga="play"].on'), voice: !!window.IND_GITA_UI._t.ui.voice }));
  if (!pl.on || pl.voice) throw new Error('after the guru, the chant did not play: ' + JSON.stringify(pl));
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(600);
  const h = await p.evaluate(() => location.hash);
  const [c0, v0] = vid.split('-').map(Number), next = v0 < COUNTS[c0 - 1] ? c0 + '.' + (v0 + 1) : (c0 + 1) + '.1';
  if (h !== '#/gitav/' + encodeURIComponent(next)) throw new Error('→ went to ' + h);
  const after = await p.evaluate(() => !!document.querySelector('[data-ga="play"].on'));
  if (after) throw new Error('the chant kept playing on the next verse');
});
let COUNTS_CH = 0, THEME_CH = '';

(async () => {
  let pass = 0, fail = 0, browser = null, server = null, base = '';
  const fv = firstChanted();
  if (fv) {
    COUNTS_CH = COUNTS[+fv.split('-')[0] - 1];
    const m = fs.readFileSync(path.join(APP, 'gita.js'), 'utf8').match(/var THEME = \{([\s\S]*?)\};/);
    THEME_CH = (m[1].match(new RegExp('\\b' + fv.split('-')[0] + ": '(\\w+)'")) || [])[1];
  }
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const browserCheck = /async/.test(c.fn.toString().slice(0, 12));
    let ctx = null;
    try {
      if (browserCheck) {
        if (!browser) {
          const { chromium } = require('playwright');
          const { skipOnboarding } = require('./lib/onboard.js');
          server = await serve(); base = `http://127.0.0.1:${server.address().port}/`;
          browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
          browser._skip = skipOnboarding;
        }
        ctx = await browser.newContext({ viewport: DESK, serviceWorkers: 'block', hasTouch: true });
        const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
        await p.goto(base + '?tester=0', { waitUntil: 'networkidle' }); await browser._skip(p, { age: 11 }); await p.waitForTimeout(300);
        await c.fn({ p, ctx, base });
        if (errs.length) throw new Error('page error: ' + errs[0]);
      } else c.fn();
      console.log(`  ok   ${c.id.padEnd(9)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(9)} ${c.what}\n         ${String(e.message).split('\n')[0]}`); fail++;
    }
    if (ctx) await ctx.close();
  }
  if (browser) await browser.close(); if (server) server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
