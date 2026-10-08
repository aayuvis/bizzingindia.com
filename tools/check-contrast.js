#!/usr/bin/env node
/* Bizzing India — WCAG AA contrast in every world and in day and night (FIX-INDIA L5;
   family standard §12). docs/27-platform.md says why.

   For every world theme × day/night × the screens a child lives on, every visible piece of
   text is measured against the background actually behind it: the element's own colour and
   opacity, composited over each translucent layer down to the first solid one. Normal text
   needs 4.5:1, large text (24px, or 18.66px bold) 3:1. Text that sits straight on a picture
   cannot be measured this way, so it must carry a scrim or a halo (a text-shadow) — that is
   checked instead.

   Also holds the rest of the accessibility line: focus is visible (a focused button draws an
   outline or a ring), reduced motion stops the decorative animation, and every button has a
   name a screen reader can say.

   Run:  node tools/check-contrast.js            # every world, day and night
         node tools/check-contrast.js --world delhi6
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

const VIEWS = [['home'], ['stories'], ['bhasha'], ['pack', 'hi'], ['paath'], ['paath', 'neeti-course'], ['neeti'], ['khel'], ['me'], ['aaj'], ['feed'],
  /* a state page: its hero chips sit on a painting, and were white on white at night (v4, Kerala) */
  ['state', 'KL']];

/* THE MEASURE IS PIXELS — tools/lib/contrast.js says how, and check-sabhyata `cardtext` uses it too. */
const { measureView } = require('./lib/contrast');

(async () => {
  const onlyW = process.argv.includes('--world') ? process.argv[process.argv.indexOf('--world') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(base, { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  /* every world opened for the audit — tester mode is a device setting and rewrites nothing */
  const worlds = await p.evaluate(() => ((window.IND_WORLDS && window.IND_WORLDS.list) || []).map(w => w.id));
  let fails = 0, artBad = 0, checked = 0;
  const report = [];
  for (const w of worlds) {
    if (onlyW && w !== onlyW) continue;
    for (const mode of ['day', 'night']) {
      await p.evaluate(([w, mode]) => {
        window.BI.S.world = w;
        const isNight = document.documentElement.getAttribute('data-mode') === 'night';
        if ((mode === 'night') !== isNight) document.querySelector('[data-bz=theme]').click();
        window.BI.render();
      }, [w, mode]);
      for (const [v, a] of VIEWS) {
        await p.evaluate(([v, a]) => window.BI.go(v, a), [v, a]); await p.waitForTimeout(250);
        const m = await measureView(p);
        checked += m.checked;
        m.fails.forEach(f => { fails++; report.push(`${w}/${mode}/${v}${a ? '/' + a : ''}: "${f.t}" ${f.ratio}:1 (needs ${f.need}) ${f.tag}${f.halo ? ' [halo]' : ''}`); });
      }
    }
  }
  /* focus visible, reduced motion, named buttons — once */
  await p.evaluate(() => window.BI.go('home')); await p.waitForTimeout(300);
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
  const focus = await p.evaluate(() => { const e = document.activeElement, s = e && getComputedStyle(e);
    return e && e !== document.body ? { ok: (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none'), what: e.tagName + '.' + e.className } : { ok: false, what: 'nothing focused' }; });
  if (!focus.ok) report.push('focus is not visible on ' + focus.what);
  const unnamed = await p.evaluate(() => [...document.querySelectorAll('button, a[href], [role="button"]')].filter(b => b.offsetParent !== null &&
    !(b.getAttribute('aria-label') || (b.textContent || '').trim() || b.getAttribute('title') || (b.querySelector('img[alt]:not([alt=""])')))).map(b => b.outerHTML.slice(0, 60)));
  unnamed.forEach(u => report.push('a control with no name: ' + u));
  const rctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
  const rp = await rctx.newPage();
  await rp.goto(base, { waitUntil: 'networkidle' }); await skipOnboarding(rp); await rp.waitForTimeout(400);
  const moving = await rp.evaluate(() => [...document.querySelectorAll('*')].filter(e => { const s = getComputedStyle(e);
    return s.animationName && s.animationName !== 'none' && s.animationPlayState === 'running' && parseFloat(s.animationDuration) > 0.01 &&
      (s.animationIterationCount === 'infinite'); }).map(e => e.tagName + '.' + String(e.className).split(' ')[0]).slice(0, 5));
  moving.forEach(m => report.push('reduced motion asked for, and this keeps animating: ' + m));
  await rctx.close();

  if (process.env.CONTRAST_DUMP) fs.writeFileSync(process.env.CONTRAST_DUMP, report.join('\n'));
  report.slice(0, 60).forEach(r => console.log('  ' + r));
  if (report.length > 60) console.log(`  … and ${report.length - 60} more`);
  console.log(`\n${checked} pieces of text measured in ${worlds.length} worlds × day and night; ` +
    `${fails} below AA; focus ${focus.ok ? 'visible' : 'NOT visible'}; ` +
    `${unnamed.length} unnamed controls; ${moving.length} endless animations under reduced motion`);
  if (errs.length) console.log('page error: ' + errs[0]);
  await browser.close(); server.close();
  process.exit(report.length || errs.length ? 1 : 0);
})();
