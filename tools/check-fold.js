#!/usr/bin/env node
/* Bizzing India — is the core content above the fold?
   ==================================================================================
   A screen that opens with four paragraphs of explanation and a stat row has buried the
   thing the child came for. This measures, on the real app, HOW MANY PIXELS each view
   spends before its first piece of core content — the first plate, the first story, the
   first part, the first control the child would actually touch.

   It is a measurement, not a taste: the budget is one screenful of the viewport below
   the sticky bar. Anything above that is preamble, and preamble is the one thing in a
   children's app that nobody reads.

   Run:  node tools/check-fold.js            # measure and enforce
         node tools/check-fold.js --report   # just print the table
*/
const fs = require('fs');
const path = require('path');
const http = require('http');

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
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      res.writeHead(404).end('no'); return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

/* WHAT COUNTS AS CORE, per view. Each is the first thing a child would touch — never a
   heading, never a stat, never an explanation. If a view is not listed it is not measured,
   because a selector guessed by someone who has not looked at the view proves nothing. */
const VIEWS = [
  { tab: 'paath',   core: '.pa-card',        what: 'the first course plate' },
  { tab: 'stories', core: '.pickbar, .bigdoor', what: 'the first story door' },
  { tab: 'map',     core: '.mapsvg',         what: 'the map' },
  { tab: 'bhasha',  core: '.tile[data-act="pack"]', what: 'the first language pack' },
  { tab: 'neeti',   core: '.tile[data-act="go"], .tile[data-act="cards"]', what: 'the first value door' },
  { tab: 'khel',    core: '.ghero, .gcover', what: 'the first game' },
  { tab: 'home',    core: '.card.ask, .greet, .card', what: 'the first card' },
];

const SIZES = [[1440, 900, 'desktop'], [390, 844, 'phone']];

/* pixels of title and explanation a view may spend before its first piece of content */
const BUDGET = 280;

async function boot(browser, port, w, h) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(() => {});
  const nm = await p.$('#nm');
  if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(500);
  return p;
}

async function measure(p, v) {
  /* click the real tab — setting location.hash alone does not always route, and a check
     that silently measured the previous view would be worse than no check */
  const routed = await p.evaluate(tab => {
    const t = document.querySelector(`.navtab[data-v="${tab}"]`);
    if (!t) return false;
    t.click(); return true;
  }, v.tab);
  if (!routed) return { missing: true, why: 'no tab in the bar for ' + v.tab };
  await p.waitForTimeout(800);
  return p.evaluate(sel => {
    const bar = document.querySelector('.topbar');
    const barH = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
    const el = [...document.querySelectorAll(sel)]
      .find(e => { const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4; });
    if (!el) return { missing: true, barH };
    const r = el.getBoundingClientRect();
    /* distance from the bottom of the sticky bar to the top of the first core thing,
       at scroll position zero */
    return { barH, top: Math.round(r.top + window.scrollY - barH),
             fold: window.innerHeight - barH };
  }, v.core);
}

(async () => {
  const reportOnly = process.argv.includes('--report');
  const { chromium } = require('playwright');
  const s = await serve(), port = s.address().port;
  const b = await chromium.launch({
    executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });

  const rows = [];
  for (const [w, h, name] of SIZES) {
    const p = await boot(b, port, w, h);
    for (const v of VIEWS) {
      const m = await measure(p, v);
      rows.push({ view: '#/' + v.tab, what: v.what, size: name, ...m });
    }
    await p.close();
  }
  await b.close(); s.close();

  console.log('\n  view        size      preamble   fold   what');
  console.log('  ' + '-'.repeat(68));
  const bad = [];
  rows.forEach(r => {
    if (r.missing) {
      console.log(`  ${r.view.padEnd(12)}${r.size.padEnd(10)}  (not found: ${r.why || r.what})`);
      bad.push(`${r.view} on ${r.size}: nothing matched "${r.what}"`);
      return;
    }
    /* TWO BUDGETS, and the second is the one that bites.
       The core content must start inside the first screenful — a hero plate may be big,
       because a plate is content, but a hero that pushes the core past the fold has
       stopped being content and become a lid.
       And preamble must stay under BUDGET. A phone's first screenful below the bar is
       ~725px; spending more than ~40% of it on a title and an explanation before a child
       reaches anything is the fault this whole file exists for. Negative means the core
       starts level with or above the bar, which is its own bug — Home's pinned language
       ask measured -67px because it had the map popup's class and was being pulled under
       the sticky bar and half off the left edge. */
    const over = r.top > r.fold || r.top > BUDGET || r.top < 0;
    console.log(`  ${r.view.padEnd(12)}${r.size.padEnd(10)}${String(r.top).padStart(6)}px` +
      `${String(r.fold).padStart(7)}px   ${r.what}${over ? '   << OVER' : ''}`);
    if (over) bad.push(r.top < 0
      ? `${r.view} on ${r.size}: ${r.what} starts ${r.top}px — it is under the sticky bar`
      : `${r.view} on ${r.size}: ${r.what} starts ${r.top}px down, ` +
        `${r.top - Math.min(BUDGET, r.fold)}px past the budget of ` +
        `${Math.min(BUDGET, r.fold)}px`);
  });
  console.log('');
  if (reportOnly) return;
  if (bad.length) { console.log('  FAIL\n   - ' + bad.join('\n   - ') + '\n'); process.exit(1); }
  console.log('  ok — every view opens on its own content\n');
})();
