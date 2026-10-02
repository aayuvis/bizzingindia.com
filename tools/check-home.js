#!/usr/bin/env node
/* Bizzing India — Home, in the family's anatomy (FIX-INDIA B1, B2, B3, A3, A5; family
   standard §2, §4, §14). docs/24-home.md says why each one exists.

     anatomy   Home is the five parts in order — greeting (with the ring and the word of the
               hour beside it), ONE Continue card, today's three, and at most six ways in —
               and nothing else
     primary   exactly one filled primary button on Home, and it is Continue — desktop and phone
     fold      on a 390×844 phone the Continue button is fully on screen, above the tab bar
     onenext   Continue and #/continue are one function: for a new child, a story left
               part-way, a language lesson and a course stop, both open the same screen —
               and the story opens at the scene the child left
     progress  where the child is sits next to Continue: rank, a bar, and the map's place
               count read from the map itself (the audit found 34 here and 36 on the map)
     firstlearn the landing's "Read it" plays tonight's story with no setup at all; its end
               asks for the setup, the story stays read and its place lit, and a real story
               is one tap from the end of setup
     demo      ?demo is a labelled sample child with weeks of progress, and the real
               household on the device is byte-for-byte untouched after using it

   Each was watched to fail by breaking the thing it holds (docs/24-home.md).
   Run:  node tools/check-home.js            # all of them
         node tools/check-home.js --only fold
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');

const APP = path.join(__dirname, '..', 'app');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml',
  '.woff2':'font/woff2', '.webmanifest':'application/manifest+json', '.ico':'image/x-icon',
  '.mp3':'audio/mpeg', '.webp':'image/webp' };
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
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
const tap = async (p, sel) => { await p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no ' + s); e.click(); }, sel); await p.waitForTimeout(350); };
const home = async p => { await tap(p, '.navtab[data-v="home"]'); };
const profile = p => p.evaluate(() => JSON.parse(localStorage.getItem('bi_v1') || 'null'));
const filled = p => p.evaluate(() => [...document.querySelectorAll('#main .btn')]
  .filter(b => !b.classList.contains('ghost') && getComputedStyle(b).display !== 'none')
  .map(b => (b.getAttribute('data-act') || '') + ':' + b.textContent.trim()));

check('anatomy', 'Home is greeting · one Continue · today\'s three · ≤ 6 ways in, and nothing else', async ({ p }) => {
  const a = await p.evaluate(() => {
    const m = document.getElementById('main');
    const top = [...m.children].filter(x => x.offsetParent !== null || getComputedStyle(x).display !== 'none');
    return {
      top: top.map(x => x.className.split(' ')[0] || x.tagName),
      greet: !!m.querySelector('.hm .hm-greet .bubble'), ring: !!m.querySelector('.hm .hm-ring .goring'),
      word: !!m.querySelector('.hm .hm-word'), cont: m.querySelectorAll('.contcard').length,
      three: m.querySelectorAll('.hm-three > *').length, ways: m.querySelectorAll('.ways > *').length
    };
  });
  if (!a.greet || !a.ring || !a.word) throw new Error('the greeting row is missing a part: ' + JSON.stringify(a));
  if (a.cont !== 1) throw new Error(a.cont + ' Continue cards on Home — there must be exactly one');
  if (a.three < 1 || a.three > 3) throw new Error('today\'s three has ' + a.three + ' cards');
  if (a.ways < 1 || a.ways > 6) throw new Error(a.ways + ' ways in — the standard allows six at most');
  const allowed = ['hm', 'card', 'hm-head', 'grid', 'ways', 'deckwrap', 'DIV'];
  const extra = a.top.filter(c => allowed.indexOf(c) < 0);
  /* a `card` at the top level may only be the language ask */
  const cards = await p.evaluate(() => [...document.getElementById('main').children]
    .filter(x => x.classList.contains('card') && !x.classList.contains('hm-tongue')).length);
  if (extra.length || cards) throw new Error('Home carries blocks outside the anatomy: ' + JSON.stringify(a.top));
});

check('primary', 'exactly one filled primary button on Home — Continue — on desktop and phone', async ({ p }) => {
  for (const vp of [DESK, PHONE]) {
    await p.setViewportSize(vp); await p.waitForTimeout(250);
    const f = await filled(p);
    if (f.length !== 1 || f[0].indexOf('cont:') !== 0)
      throw new Error(`at ${vp.width}px Home has ${f.length} filled buttons: ${JSON.stringify(f)}`);
  }
});

check('fold', 'at 390×844 the Continue button is on screen, above the tab bar', async ({ p }) => {
  const m = await p.evaluate(() => {
    const b = document.querySelector('#main [data-act="cont"]').getBoundingClientRect();
    const nav = document.querySelector('.nav'), ns = nav && getComputedStyle(nav);
    const navTop = nav && ns.position === 'fixed' ? nav.getBoundingClientRect().top : innerHeight;
    return { top: b.top, bottom: b.bottom, navTop, vh: innerHeight };
  });
  if (m.top < 0 || m.bottom > m.navTop)
    throw new Error(`Continue is at ${Math.round(m.top)}–${Math.round(m.bottom)}px; the tab bar starts at ${Math.round(m.navTop)}px`);
}, { vp: PHONE });

/* the screen Continue opens, and the screen #/continue opens, FROM THE SAME STORAGE: opening
   a course stop marks it seen and moves the frontier on, so the second door is walked from
   a restored copy of what the first door saw */
const dump = p => p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
const probe = p => p.evaluate(() => ({ hash: location.hash,
  q: !!document.querySelector('#main > .backlink[data-act="pack"]'),
  dots: document.querySelectorAll('.reader .dots i.on').length }));
async function bothDoors(p, ctx, base, why) {
  await home(p);
  const snap = await dump(p);
  await tap(p, '#main [data-act="cont"]');
  const a = await probe(p);
  await p.evaluate(o => { localStorage.clear(); Object.keys(o).forEach(k => localStorage.setItem(k, o[k])); }, snap);
  /* a REAL load: a goto that changes only the hash is a same-document navigation, and the
     second door would run on the first door's memory */
  await p.goto('about:blank');
  await p.goto(base + '#/continue', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  const b = await probe(p);
  if (a.hash !== b.hash || a.q !== b.q || a.dots !== b.dots)
    throw new Error(`${why}: Continue opened ${JSON.stringify(a)} but #/continue opened ${JSON.stringify(b)}`);
  return a;
}
check('onenext', 'Continue and #/continue open the same next thing, every time', async ({ p, ctx, base }) => {
  /* a new child: tonight's story, the same one the landing offered */
  const fresh = await bothDoors(p, ctx, base, 'a new child');
  if (!/^#\/story\//.test(fresh.hash)) throw new Error('a new child\'s Continue is not a story: ' + fresh.hash);
  /* a story left part-way comes back at the scene it was left on */
  await tap(p, '[data-act="next"]'); await tap(p, '[data-act="next"]');
  const left = await p.evaluate(() => document.querySelectorAll('.reader .dots i.on').length);
  const mid = await bothDoors(p, ctx, base, 'a story left part-way');
  if (mid.dots !== left) throw new Error(`the story was left on scene ${left} and Continue opened scene ${mid.dots}`);
  /* a language lesson, started more recently, is the next thing now — and it opens under way */
  await tap(p, '.navtab[data-v="bhasha"]');
  await tap(p, '[data-act="pack"][data-id="hi"]');
  await tap(p, '.bh-next');
  const lang = await bothDoors(p, ctx, base, 'a language lesson');
  if (lang.hash !== '#/pack/hi' || !lang.q) throw new Error('Continue did not open the Hindi lesson under way: ' + JSON.stringify(lang));
  /* a course stop, walked last */
  await p.evaluate(() => { location.hash = '#/paath/neeti-course'; }); await p.waitForTimeout(500);
  await tap(p, '[data-pa="lesson"]');
  const course = await bothDoors(p, ctx, base, 'a course stop');
  if (!/^#\/paathl\//.test(course.hash)) throw new Error('Continue did not open the course stop: ' + course.hash);
});

check('progress', 'rank, a bar and the map\'s own place count sit next to Continue', async ({ p }) => {
  const m = await p.evaluate(() => {
    const w = document.querySelector('.hm-where'), c = document.querySelector('.contcard');
    const total = Object.keys((window.IND_MAP && window.IND_MAP.paths) || {}).length;
    const wr = w && w.getBoundingClientRect(), cr = c && c.getBoundingClientRect();
    return { has: !!w, text: w ? w.textContent : '', total, meters: w ? w.querySelectorAll('.meter').length : 0,
             beside: !!(wr && cr && Math.abs(wr.top - cr.top) < 4 && wr.left > cr.right - 2) };
  });
  if (!m.has) throw new Error('no "where you are" card on Home');
  if (!m.beside) throw new Error('"where you are" is not beside the Continue card');
  if (!/Shishya|Vidyarthi|Sadhak|Khoji|Pandit|Vidwan|Acharya|Rishi/.test(m.text)) throw new Error('no rank shown beside Continue');
  if (m.meters < 2) throw new Error('rank and map need a bar each; found ' + m.meters);
  if (m.text.indexOf('of ' + m.total + ' places') < 0) throw new Error(`the place count is not the map's ${m.total}: "${m.text.slice(0, 80)}"`);
}, { vp: DESK });

check('firstlearn', 'Read it plays a story before any setup; setup keeps it; a story is one tap after setup', async ({ p }) => {
  const id = await p.evaluate(() => { const b = document.querySelector('.herocard [data-act="guest"]'); return b && b.getAttribute('data-id'); });
  if (!id) throw new Error('the landing\'s "Read it" does not open a story');
  await tap(p, '.herocard [data-act="guest"]');
  const g = await p.evaluate(() => ({ reader: !!document.querySelector('.reader'), started: (JSON.parse(localStorage.getItem('bi_v1') || '{}')).started || null,
    onboard: !!document.getElementById('nm') }));
  if (!g.reader || g.started || g.onboard) throw new Error('"Read it" did not play the story before setup: ' + JSON.stringify(g));
  for (let i = 0; i < 40; i++) {
    const end = await p.$('[data-act="begin"].lg');
    if (end) break;
    const ans = await p.$('[data-act="answer"]');
    if (ans && !(await p.$('[data-act="next"]'))) { await ans.click(); await p.waitForTimeout(200); continue; }
    await tap(p, '[data-act="next"]');
  }
  await tap(p, '[data-act="begin"].lg');
  if (!(await p.$('#nm'))) throw new Error('the story\'s end does not lead to setup');
  await skipOnboarding(p);
  const S = await profile(p);
  if (!S.started || !S.read[id]) throw new Error('the guest\'s story was not kept through setup');
  const sto = await p.evaluate(i => { const all = []; ['IND_STORIES','IND_STORIES_REGIONAL','IND_STORIES_MORE','IND_STORIES_SOUTH','IND_STORIES_NORTH','IND_STORIES_EAST','IND_STORIES_WEST','IND_STORIES_NE_A','IND_STORIES_NE_B','IND_STORIES_MODERN','IND_STORIES_VIGYAN','IND_STORIES_DASHAVATARA','IND_STORIES_DEVASURA'].forEach(k => (window[k] || []).forEach(s => all.push(s)));
    const s = all.filter(x => x.id === i)[0]; return s && (s.place || [])[0]; }, id);
  if (sto && !S.lit[sto.replace('IN-', '')]) throw new Error('the guest\'s story did not light its place');
  /* within three taps of finishing setup: one, Continue */
  await tap(p, '#main [data-act="cont"]');
  if (!(await p.$('.reader'))) throw new Error('Continue after setup did not open a story');
}, { fresh: true });

check('demo', '?demo is a labelled sample with progress, and the real household is untouched', async ({ p, base }) => {
  const before = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  if (!before.bi_v1) throw new Error('the harness has no real child to protect');
  await p.goto(base + '?demo', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  const d = await p.evaluate(() => ({ bar: (document.querySelector('.demobar') || {}).textContent || '',
    pill: !!document.querySelector('.hm-greet .sample'), name: (document.querySelector('.hm-hi h2') || {}).textContent || '',
    coins: window.BI ? window.BI.coins() : 0, rank: window.BI ? window.BI.level() : 0,
    heard: Object.keys((JSON.parse(localStorage.getItem('bi_v1')) || {}).read || {}).length,
    days: window.BI ? window.BI.goodDays() : 0 }));
  if (!/Sample/.test(d.bar) || !d.pill) throw new Error('the sample is not labelled "Sample"');
  if (d.heard < 10 || d.coins <= 0 || d.rank < 1 || d.days < 1)
    throw new Error('the sample has no believable progress: ' + JSON.stringify(d));
  /* use it: Continue, a right answer's worth of coins, the grown-ups' PIN */
  await tap(p, '#main [data-act="cont"]');
  await p.evaluate(() => window.BI && window.BI.earn('answer', 'demo'));
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  const after = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const changed = Object.keys(Object.assign({}, before, after)).filter(k => k !== 'bi_device' && before[k] !== after[k]);
  if (changed.length) throw new Error('the demo touched the real household: ' + changed.join(', '));
  const real = await p.evaluate(() => (document.querySelector('.hm-hi h2') || {}).textContent || '');
  if (/Meera|Sample/.test(real)) throw new Error('the real app now shows the sample child');
});

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const vp = c.vp || DESK;
    const ctx = await browser.newContext({ viewport: vp, serviceWorkers: 'block',
      isMobile: vp.width < 500, hasTouch: vp.width < 500 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      if (!c.fresh) await skipOnboarding(p);
      await p.waitForTimeout(300);
      await c.fn({ p, ctx, base });
      if (errs.length) throw new Error('page error: ' + errs[0]);
      console.log(`  ok   ${c.id.padEnd(10)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(10)} ${c.what}\n         ${String(e.message).split('\n')[0]}`); fail++;
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
