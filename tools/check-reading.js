#!/usr/bin/env node
/* tools/check-reading.js — the reading screens show their words (docs/31, the reading spread).

   Owner, 4 Oct 2026: "in the story panels the image occupies the top and the written word is all
   below the fold". Measured then: on a 1280×720 laptop an epic card showed a painting and not one
   line of its words; a Gita verse started 929px down a 720px screen. This holds the fix, on the
   story reader, an epic card and a Gita verse, at six screen sizes:

     words     the words start on the first screen with at least two lines showing — and on a
               landscape screen, in the top 55% of it (story and epic)
     turn      the page-turn is on the first screen (a scene that asks a question waits for its
               answer instead, and its question is on the first screen)
     picture   stacked, a painting takes 15–62% of the screen under the header: never the whole
               of it, never a strip; in the spread it stands BESIDE the words, never above them
     whole     on a phone the words are never clipped inside a box of their own
     sticker   nothing is drawn over a painting
     full      a painting opens full screen (click, Enter), zooms, and closes (Esc, ✕, outside),
               focus coming back to it; the page does not turn under it
     swipe     a real touch swipe turns the page both ways, and cannot get past a question
     keys      ← → turn an epic's pages through the same buttons
   Run: node tools/check-reading.js [id] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const APP = path.join(__dirname, '..', 'app');
const only = process.argv[2];
const SIZES = [['desktop', 1440, 900], ['laptop', 1280, 720], ['ipad-side', 1180, 820], ['ipad-up', 820, 1180], ['phone', 390, 760], ['phone-sm', 375, 667]];
const STORY = 'pt.monkey-crocodile';

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

/* what is on the first screen of a reading page */
const MEASURE = () => {
  const vh = innerHeight, bar = document.querySelector('[data-bz=tabbar]');
  const fold = bar && getComputedStyle(bar).position === 'fixed' && bar.getBoundingClientRect().top < vh ? bar.getBoundingClientRect().top : vh;
  const hdr = document.querySelector('[data-bz=header]') || document.querySelector('.bz-hdr');
  const top = hdr ? hdr.getBoundingClientRect().bottom : 0;
  const lines = [...document.querySelectorAll('#main .speech .sen, #main .speech .sdeva, #main .gt-sa')].filter(e => e.getBoundingClientRect().height);
  const lh = lines.length ? parseFloat(getComputedStyle(lines[0]).lineHeight) || 26 : 26;
  const wordsTop = lines.length ? Math.min(...lines.map(e => e.getBoundingClientRect().top)) : 1e9;
  const shown = lines.reduce((a, e) => { const r = e.getBoundingClientRect(); return a + Math.max(0, Math.min(r.bottom, fold) - Math.max(r.top, top)); }, 0);
  const turnEl = document.querySelector('#main [data-swipe="next"]');
  const opt = document.querySelector('#main .reader.asks .rfoot h3');
  const turn = turnEl ? turnEl.getBoundingClientRect() : null, o = opt ? opt.getBoundingClientRect() : null;
  /* any stage with a painting behind it, whatever its classes say — the old sticker path had none */
  const st = [...document.querySelectorAll('#main .stage')].filter(e => /url\(/.test(getComputedStyle(e).backgroundImage))[0] || document.querySelector('#main .gt-art');
  const sr = st ? st.getBoundingClientRect() : null;
  const pic = sr ? Math.max(0, Math.min(sr.bottom, fold) - Math.max(sr.top, top)) / Math.max(1, fold - top) : null;
  const sticker = st && st.classList.contains('stage') ? [...st.children].filter(c => c.getBoundingClientRect().height > 2).length : 0;
  const sp = document.querySelector('#main .speech');
  const words = document.querySelector('#main .speech, #main .gt-lines'), wr = words ? words.getBoundingClientRect() : null;
  return { vh, fold: Math.round(fold), top: Math.round(top), wordsTop: Math.round(wordsTop), lines: shown / lh, lh,
    beside: sr && wr ? sr.right <= wr.left + 1 : false,
    turn: turn ? turn.bottom <= fold + 1 && turn.top >= top - 1 : null, ask: !!document.querySelector('#main .reader.asks'),
    optTop: o ? Math.round(o.top) : null, pic, sticker, clipped: sp ? sp.scrollHeight - sp.clientHeight : 0,
    wide: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth };
};

async function openStory(p, scene) { await p.evaluate(a => window.BI.go('story', a), STORY + '|s' + scene); await p.waitForTimeout(700); }
async function openEpisode(p) {
  await p.evaluate(() => window.BI.go('epic', 'mahabharata')); await p.waitForTimeout(700);
  await p.click('[data-act="episode"]'); await p.waitForTimeout(800);
}
async function askScene(p) {
  for (let i = 1; i < 14; i++) { await openStory(p, i); if (await p.evaluate(() => !!document.querySelector('#main .reader.asks'))) return i; }
  throw new Error('no scene in ' + STORY + ' asks a question');
}

const CHECKS = [];
const check = (id, what, fn) => CHECKS.push({ id, what, fn });

check('words', 'six sizes: words on the first screen (≥ 2 lines; landscape story/epic in the top 55%), page-turn visible, picture beside or 15–62%, no sticker, nothing sideways', async ({ p }) => {
  const bad = [];
  const ask = await askScene(p);
  for (const [name, w, h] of SIZES) {
    await p.setViewportSize({ width: w, height: h });
    const land = w >= 640 && w / h >= 1.2;
    for (const [page, open] of [['story', () => openStory(p, 0)], ['ask', () => openStory(p, ask)], ['episode', () => openEpisode(p)],
      ['gita', async () => { await p.evaluate(() => window.BI.go('gitav', '2.47')); await p.waitForTimeout(800); }]]) {
      await open(); await p.evaluate(() => scrollTo(0, 0));
      /* the Gita's draft bar is tester-only furniture a child never sees: measure without it */
      await p.evaluate(() => document.querySelectorAll('#main .gt-draft').forEach(e => e.remove())); await p.waitForTimeout(250);
      const m = await p.evaluate(MEASURE), at = name + ' ' + page;
      if (m.wide > 0) bad.push(at + ': scrolls sideways by ' + m.wide + 'px');
      if (m.lines < 1.8) bad.push(at + ': ' + m.lines.toFixed(1) + ' lines of words on the first screen');
      if (land && page !== 'gita' && m.wordsTop > m.vh * 0.55) bad.push(at + ': words start at ' + m.wordsTop + 'px of ' + m.vh);
      if (page === 'ask') { if (m.optTop == null || m.optTop > m.fold - 24) bad.push(at + ': the question starts below the first screen (' + m.optTop + ')'); }
      else if (page !== 'gita' && !m.turn) bad.push(at + ': the page-turn is not on the first screen');
      if (land && m.pic != null && !m.beside) bad.push(at + ': the painting is not beside the words');
      if (!land && page !== 'gita' && m.pic != null && (m.pic < 0.15 || m.pic > 0.62)) bad.push(at + ': the painting is ' + Math.round(m.pic * 100) + '% of the screen');
      if (m.sticker) bad.push(at + ': ' + m.sticker + ' thing(s) drawn over the painting');
      if (w <= 720 && !land && m.clipped > 2) bad.push(at + ': the words are clipped inside their box by ' + m.clipped + 'px');
    }
  }
  if (bad.length) throw new Error(bad.length + ': ' + bad.slice(0, 5).join(' · '));
});

check('full', 'a painting opens full screen by click and by Enter; zooms; Esc, ✕ and outside close it; focus returns; the page does not turn under it', async ({ p }) => {
  for (const [w, h] of [[1280, 720], [390, 760]]) {
    await p.setViewportSize({ width: w, height: h });
    await openEpisode(p);
    const src = await p.evaluate(() => document.querySelector('#main .stage.painted').getAttribute('data-full'));
    await p.click('#main .stage.painted'); await p.waitForTimeout(200);
    let s = await p.evaluate(() => { const b = document.querySelector('.lbox'); return b && { img: b.querySelector('img').getAttribute('src'), focus: document.activeElement && document.activeElement.className, r: b.getBoundingClientRect() }; });
    if (!s || s.img !== src) throw new Error(w + 'px: a click did not open the painting full screen');
    if (s.r.width < w - 1 || s.r.height < h - 1) throw new Error(w + 'px: the full-screen view does not cover the screen');
    if (!/lbox-x/.test(s.focus || '')) throw new Error(w + 'px: focus did not move to ✕');
    const n0 = await p.evaluate(() => (document.querySelector('#main .deckn') || {}).textContent);
    await p.keyboard.press('ArrowRight'); await p.waitForTimeout(150);
    if (await p.evaluate(() => (document.querySelector('#main .deckn') || {}).textContent) !== n0) throw new Error('→ turned the page under the full-screen painting');
    await p.click('.lbox-img'); await p.waitForTimeout(150);
    if (!await p.evaluate(() => document.querySelector('.lbox.zoomed'))) throw new Error('a tap on the picture did not zoom it');
    await p.keyboard.press('Escape'); await p.waitForTimeout(150);
    s = await p.evaluate(() => ({ open: !!document.querySelector('.lbox'), focus: document.activeElement && document.activeElement.classList.contains('painted'), hash: location.hash }));
    if (s.open) throw new Error('Escape did not close it');
    if (!s.focus) throw new Error('focus did not come back to the painting');
    if (!/episode/.test(s.hash)) throw new Error('Escape on the full-screen painting also left the page: ' + s.hash);
    await p.keyboard.press('Enter'); await p.waitForTimeout(150);
    if (!await p.evaluate(() => !!document.querySelector('.lbox'))) throw new Error('Enter on the painting did not open it');
    await p.click('.lbox-x'); await p.waitForTimeout(150);
    if (await p.evaluate(() => !!document.querySelector('.lbox'))) throw new Error('✕ did not close it');
    await p.click('#main .stage.painted'); await p.waitForTimeout(150);
    await p.mouse.click(8, h - 8); await p.waitForTimeout(150);
    if (await p.evaluate(() => !!document.querySelector('.lbox'))) throw new Error('a tap outside the picture did not close it');
  }
  /* the story's painting and the Gita's open too */
  await p.setViewportSize({ width: 1280, height: 720 });
  for (const [go, sel] of [[() => openStory(p, 0), '#main .stage.painted'], [async () => { await p.evaluate(() => window.BI.go('gitav', '2.47')); await p.waitForTimeout(700); }, '#main .gt-art']]) {
    await go(); await p.click(sel); await p.waitForTimeout(150);
    if (!await p.evaluate(() => !!document.querySelector('.lbox img'))) throw new Error(sel + ' does not open full screen');
    await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  }
});

check('swipe', 'a real touch swipe turns an epic\'s page both ways and a Gita verse; it cannot get past a story\'s question', async ({ p, ctx }) => {
  await p.setViewportSize({ width: 390, height: 760 });
  const cdp = await ctx.newCDPSession(p);
  const swipe = async (dx) => {
    const y = 380, x0 = dx < 0 ? 320 : 70;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
    for (let k = 1; k <= 6; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + dx * k / 6, y: y + k }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await p.waitForTimeout(450);
  };
  await openEpisode(p);
  const card = () => p.evaluate(() => (document.querySelector('#main .deckn') || {}).textContent);
  const c0 = await card();
  await swipe(-200);
  const c1 = await card();
  if (c1 === c0) throw new Error('a left swipe did not turn the epic\'s page (' + c0 + ')');
  await swipe(200);
  if (await card() !== c0) throw new Error('a right swipe did not turn it back (' + (await card()) + ')');
  /* a mostly-vertical drag is a scroll, never a page turn */
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 600 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 120, y: 300 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await p.waitForTimeout(400);
  if (await card() !== c0) throw new Error('a scroll turned the page');
  const ask = await askScene(p);
  await swipe(-200);
  const still = await p.evaluate(() => ({ asks: !!document.querySelector('#main .reader.asks'), hash: location.hash }));
  if (!still.asks) throw new Error('a swipe got past scene ' + ask + '\'s question before it was answered');
  await p.evaluate(() => window.BI.go('gitav', '2.47')); await p.waitForTimeout(700);
  await swipe(-200);
  if (await p.evaluate(() => location.hash) !== '#/gitav/2.48') throw new Error('a left swipe on a Gita verse did not go to the next one');
  await swipe(200);
  if (await p.evaluate(() => location.hash) !== '#/gitav/2.47') throw new Error('a right swipe on a Gita verse did not go back');
});

check('keys', '← → turn an epic\'s pages through the same buttons', async ({ p }) => {
  await p.setViewportSize({ width: 1280, height: 720 });
  await openEpisode(p);
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  const card = () => p.evaluate(() => (document.querySelector('#main .deckn') || {}).textContent);
  const c0 = await card();
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(250);
  if (await card() === c0) throw new Error('→ did not turn the page');
  await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(250);
  if (await card() !== c0) throw new Error('← did not turn it back');
});

(async () => {
  let pass = 0, fail = 0, browser = null, server = null, base = '';
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    let ctx = null;
    try {
      if (!browser) {
        const { chromium } = require('playwright');
        server = await serve(); base = `http://127.0.0.1:${server.address().port}/`;
        browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
      }
      const { skipOnboarding } = require('./lib/onboard.js');
      ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, serviceWorkers: 'block', hasTouch: true });
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
      /* tester mode: the Gita verse is one of the reading screens, and it opens only there */
      await p.goto(base + '?tester=1', { waitUntil: 'networkidle' }); await skipOnboarding(p, { age: 11 }); await p.waitForTimeout(300);
      await c.fn({ p, ctx, base });
      if (errs.length) throw new Error('page error: ' + errs[0]);
      console.log(`  ok   ${c.id.padEnd(8)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(8)} ${c.what}\n         ${String(e.message).split('\n')[0]}`); fail++;
    }
    if (ctx) await ctx.close();
  }
  if (browser) await browser.close(); if (server) server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
