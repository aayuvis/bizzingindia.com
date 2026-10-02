#!/usr/bin/env node
/* Bizzing India — the Bhasha path, as a child walks it.
   ==================================================================================
   The eight rungs were each one pool — Shabd held 507 words and said "2 new words ·
   Go" — and a child could not see where they were inside a rung or how far there was
   to go. A rung is walked as UNITS and a unit as LESSONS of four now (bhasha.js §THE
   PATH, WALKED). This holds the three promises that makes:

     1. the path is DERIVED — every lesson's things come out of its rung, none is lost
        and none appears twice, and the letters follow the varnamala's own rows
     2. a lesson TEACHES ITS OWN — a lesson session introduces only its four things,
        while review from earlier lessons still comes back inside it
     3. a child can SEE where they are — the next lesson says what is in it before it
        starts, and every beat says which lesson it is

   Every check was watched to fail first.

   Run:  node tools/check-bhasha-path.js
         node tools/check-bhasha-path.js --only varnamala
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');

const APP = path.join(__dirname, '..', 'app');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml',
  '.woff2':'font/woff2', '.webmanifest':'application/manifest+json', '.ico':'image/x-icon',
  '.mp3':'audio/mpeg' };
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

/* the engine, loaded bare — the same files the page loads, in the same order */
global.window = global.window || {};
['bhasha.js', 'data-bhasha-hi-grammar.js', 'data-bhasha-hi-sentences.js']
  .forEach(f => { const p = path.join(APP, f); if (fs.existsSync(p)) require(p); });
const B = global.window.IND_BHASHA;

const CHECKS = [];
const check = (id, what, fn) => CHECKS.push({ id, what, fn });

/* ================================================================== DERIVED */

check('covers', 'every rung is walked whole — nothing lost, nothing twice', async () => {
  const bad = [];
  const hi = global.window.IND_PACKS.hi;
  hi.stages.forEach(s => {
    const units = B.path('hi', s.id);
    const seen = new Map();
    units.forEach(u => u.lessons.forEach(l => l.keys.forEach(k => seen.set(k, (seen.get(k) || 0) + 1))));
    const twice = [...seen].filter(([, n]) => n > 1).map(([k]) => k);
    if (twice.length) bad.push(`${s.id} teaches ${twice.slice(0, 3).join(', ')} in two lessons`);
    /* against the engine's own unit list for the rung, which is what a session drills */
    const all = units.reduce((a, u) => a + u.size, 0);
    if (seen.size !== all) bad.push(`${s.id}: units hold ${all} things but lessons ${seen.size}`);
    if (!units.length) bad.push(`${s.id} has no path at all`);
  });
  if (bad.length) throw new Error(bad.join('; '));
});

check('sizes', 'a lesson is a sitting — never one thing, never more than a sitting holds',
  async () => {
  /* Seventeen greetings in fours once left फिर मिलेंगे on its own as a whole lesson. A
     tail of one folds back into the lesson before it now; this holds that, and the top. */
  const bad = [];
  const cap = B.LESSON_N + 1;
  global.window.IND_PACKS.hi.stages.forEach(s => B.path('hi', s.id).forEach(u => u.lessons.forEach(l => {
    if (u.size > 1 && l.keys.length < 2) bad.push(`${l.id} holds one thing`);
    if (l.keys.length > cap) bad.push(`${l.id} holds ${l.keys.length}, more than a sitting`);
  })));
  if (bad.length) throw new Error(bad.slice(0, 6).join('; '));
});

check('varnamala', 'the letters follow the varnamala’s own rows', async () => {
  /* The vowels, then the क row, the च row, the ट row, the त row, the प row — the order
     Devanagari has been taught in for a very long time, read off the script module's
     own `group` field. This app did not decide it and must not quietly reorder it. */
  const sc = global.window.IND_SCRIPTS.devanagari;
  const want = ['svar'];
  sc.consonants.forEach(c => { if (want.indexOf(c.group) < 0) want.push(c.group); });
  const got = B.path('hi', 's1').map(u => u.id.split('.')[1]);
  if (got.join(',') !== want.join(','))
    throw new Error(`rows came out as ${got.join(' ')}, the script says ${want.join(' ')}`);
  const first = B.path('hi', 's1')[0].lessons[0].items.join('');
  if (first !== sc.vowels.slice(0, 4).map(v => v.char).join(''))
    throw new Error(`Varnamala does not open on the first four vowels (it opens on ${first})`);
});

check('grammar-units', 'a sentence unit is named for what it teaches', async () => {
  /* "Sentences, part 3" says nothing. Every s4 sentence carries its grammar point and
     the grammar bank names each one — so the units are those names, not numbers. */
  const units = B.path('hi', 's4');
  const numbered = units.filter(u => /part \d/i.test(u.title));
  if (numbered.length) throw new Error(`${numbered.length} sentence units are numbered, not named: ` +
    numbered.slice(0, 3).map(u => u.title).join(', '));
  if (units.length < 5) throw new Error(`only ${units.length} sentence units — the grammar points did not load`);
});

/* ================================================================== TEACHING */

check('own-four', 'a lesson introduces only its own things, and review still comes back',
  async () => {
  /* OUT OF ORDER, ON PURPOSE. The first version of this tested lesson 2 straight after
     lesson 1 — and lesson 2's words are simply the next four unseen in list order, so it
     passed with the narrowing ripped out. The trail lets a child tap AHEAD, so the real
     test is lesson 3 while lesson 2 is still unseen: without narrowing, the session would
     introduce lesson 2's words instead. */
  const units = B.path('hi', 's0');
  const L1 = units[0].lessons[0], L2 = units[0].lessons[1], L3 = units[0].lessons[2];
  const rec = { srs: {}, window: [], band: 1 };
  L1.keys.forEach(k => { rec.srs[k] = { key: k, box: 1, due: 0, last: Date.now() - 2 * 86400000 }; });
  const plan = B.session('hi', 's0', rec, { now: Date.now(), only: L3.keys });
  const intro = plan.specs.filter(x => x.kind === 'introduce').map(x => x.key);
  const stray = intro.filter(k => L3.keys.indexOf(k) < 0);
  if (stray.length) throw new Error(`lesson 3 introduced ${stray.join(', ')}` +
    (stray.some(k => L2.keys.indexOf(k) >= 0) ? ' — lesson 2’s words, in order, not its own' : ''));
  if (intro.length !== L3.keys.length)
    throw new Error(`lesson 3 introduced ${intro.length} of its ${L3.keys.length} things`);
  /* THE SPACING HALF. A lesson that only ever drilled its own four is a flashcard deck;
     words met in an earlier lesson have to come back inside this one. */
  const back = plan.specs.filter(x => x.kind !== 'introduce' && L1.keys.indexOf(x.key) >= 0);
  if (!back.length) throw new Error('nothing from lesson 1 came back inside lesson 3 — no spacing');
});

check('done-derived', 'a lesson is done because the cards say so, and only then', async () => {
  const L = B.path('hi', 's0')[0].lessons[0];
  const srs = {};
  if (B.lessonDone(L, srs)) throw new Error('an untouched lesson reads as done');
  L.keys.slice(0, -1).forEach(k => { srs[k] = { key: k, box: 1 }; });
  if (B.lessonDone(L, srs)) throw new Error('a lesson with one thing never answered right reads as done');
  srs[L.keys[L.keys.length - 1]] = { key: L.keys[L.keys.length - 1], box: 0 };
  if (B.lessonDone(L, srs)) throw new Error('a card in box 0 (met, never right) counted');
  srs[L.keys[L.keys.length - 1]].box = 1;
  if (!B.lessonDone(L, srs)) throw new Error('every card in box 1 and it still does not read as done');
});

/* ================================================================== THE SCREEN */

async function openPack(browser, port, w, h) {
  const p = await browser.newPage({ viewport: { width: w || 1440, height: h || 1000 } });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  await p.evaluate(() => document.querySelector('[data-bz=tab][data-v="bhasha"]').click());
  await p.waitForTimeout(500);
  await p.evaluate(() => [...document.querySelectorAll('[data-act="pack"]')]
    .find(e => e.getAttribute('data-id') === 'hi').click());
  await p.waitForTimeout(800);
  return { p, errs };
}

check('next-says', 'the next lesson says what is in it before it starts', async ({ browser, port }) => {
  const { p, errs } = await openPack(browser, port);
  const r = await p.evaluate(() => {
    const n = document.querySelector('.bh-next');
    return n ? { text: n.innerText, deva: n.querySelectorAll('.bh-preview .deva').length,
                 act: n.getAttribute('data-act') } : null;
  });
  await p.close();
  if (!r) throw new Error('there is no next-lesson card');
  if (r.act !== 'blesson') throw new Error(`the next card starts "${r.act}", not a lesson`);
  if (!/lesson \d+ of \d+/i.test(r.text)) throw new Error('the next card does not say which lesson');
  if (r.deva < 2) throw new Error(`the next card previews ${r.deva} things — it should show what it teaches`);
  if (errs.length) throw new Error(errs[0]);
});

check('where', 'every beat of a lesson says which lesson it is', async ({ browser, port }) => {
  const { p, errs } = await openPack(browser, port);
  await p.evaluate(() => document.querySelector('.bh-next').click());
  await p.waitForTimeout(700);
  const seen = [];
  for (let i = 0; i < 3; i++) {
    const w = await p.evaluate(() => (document.querySelector('.bh-where') || {}).innerText || '');
    seen.push(w);
    const got = await p.$('[data-act="gotit"]');
    if (!got) break;
    await got.click(); await p.waitForTimeout(350);
  }
  await p.close();
  if (!seen[0]) throw new Error('the first beat does not say where it is');
  if (!/lesson 1 of \d+/i.test(seen[0])) throw new Error(`the first beat says "${seen[0]}"`);
  if (!/new 1 of \d+/i.test(seen[0])) throw new Error('the first new thing does not say it is the first of a set');
  if (errs.length) throw new Error(errs[0]);
});

check('advances', 'finishing a lesson moves the next-lesson card on', async ({ browser, port }) => {
  /* the record says lesson 1 is met; the card must now offer lesson 2 by name */
  const { p, errs } = await openPack(browser, port);
  const L1 = B.path('hi', 's0')[0].lessons[0], L2 = B.path('hi', 's0')[0].lessons[1];
  await p.evaluate(keys => {
    const S = JSON.parse(localStorage.getItem('bi_v1'));
    S.lang = S.lang || {}; S.lang.hi = S.lang.hi || { asked: 0, correct: 0, stages: {}, srs: {}, window: [] };
    S.lang.hi.srs = S.lang.hi.srs || {};
    keys.forEach(k => { S.lang.hi.srs[k] = { key: k, box: 1, due: Date.now() + 864e5, last: Date.now() }; });
    localStorage.setItem('bi_v1', JSON.stringify(S));
  }, L1.keys);
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  await p.evaluate(() => document.querySelector('[data-bz=tab][data-v="bhasha"]').click());
  await p.waitForTimeout(400);
  await p.evaluate(() => [...document.querySelectorAll('[data-act="pack"]')]
    .find(e => e.getAttribute('data-id') === 'hi').click());
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => ({
    next: (document.querySelector('.bh-next') || {}).getAttribute
      ? document.querySelector('.bh-next').getAttribute('data-l') : null,
    done: document.querySelectorAll('.bh-step.done').length }));
  await p.close();
  if (r.next !== L2.id) throw new Error(`with lesson 1 met the next card offers ${r.next}, not ${L2.id}`);
  if (r.done < 1) throw new Error('the trail does not show lesson 1 as done');
  if (errs.length) throw new Error(errs[0]);
});

check('touch', 'a phone can hit every disc and nothing scrolls sideways', async ({ browser, port }) => {
  const { p, errs } = await openPack(browser, port, 390, 844);
  const r = await p.evaluate(() => {
    const small = [];
    document.querySelectorAll('.bh-node, .bh-uhead, .bh-uchip, .bh-next, .bh-tot').forEach(e => {
      const q = e.getBoundingClientRect();
      if (q.width < 1) return;
      if (Math.min(q.width, q.height) < 32) small.push(e.className + ' ' + Math.round(q.width) + 'x' + Math.round(q.height));
    });
    return { small, over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
             buttons: [...document.querySelectorAll('.bh-node, .bh-uhead')].every(e => e.tagName === 'BUTTON') };
  });
  await p.close();
  if (r.over > 1) throw new Error(`the path scrolls sideways by ${r.over}px on a phone`);
  if (r.small.length) throw new Error('under 32px: ' + r.small.slice(0, 4).join(', '));
  if (!r.buttons) throw new Error('a lesson disc or unit is not a real button — keyboard cannot reach it');
  if (errs.length) throw new Error(errs[0]);
});

/* ------------------------------------------------------------------ the runner */
async function main() {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const needs = CHECKS.some(c => (!only || c.id === only) && ['next-says', 'where', 'advances', 'touch'].includes(c.id));
  let server = null, browser = null, port = 0;
  if (needs) {
    const { chromium } = require('playwright');
    server = await serve(); port = server.address().port;
    browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  }
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    try { await c.fn({ browser, port }); console.log(`  ok   ${c.id.padEnd(13)} ${c.what}`); pass++; }
    catch (e) { console.log(`  FAIL ${c.id.padEnd(13)} ${c.what}\n         ${e.message}`); fail++; }
  }
  if (browser) await browser.close();
  if (server) server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
main();
