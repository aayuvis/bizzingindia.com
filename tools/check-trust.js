#!/usr/bin/env node
/* Bizzing India — the trust fixes (FIX-INDIA "Fix first", family standard §4 and §7).
   ==================================================================================
   Four things a parent should never have to discover:

     back      browser Back from inside the app never leaves it (the audit's map →
               about:blank), and a shared #/<view> link opens that view
     continue  #/continue — the Hive's door — opens the one next thing
     pin       nothing that changes the child sits on the child's page: starting again,
               backups and the report card are behind a PIN the screen calls a deterrent,
               and leaving the grown-ups' page locks it again
     tester    the developer unlock does not exist outside tester mode (?tester=1)
     sources   every Dharma object carries sources[], and the faith page shows them
     report    the grown-ups' page shows the Paathshala report — objectives, never minutes

   Every check drives the real app in a real browser, and each was watched to fail by
   breaking the thing it holds (see docs/22-trust.md).

   Run:  node tools/check-trust.js            # all of them
         node tools/check-trust.js --only pin
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

const CHECKS = [];
const check = (id, what, fn) => CHECKS.push({ id, what, fn });
const where = p => p.evaluate(() => ({ url: location.href, hash: location.hash,
  view: (document.querySelector('[data-bz=tab][aria-current="page"]') || {}).getAttribute ? document.querySelector('[data-bz=tab][aria-current="page"]').getAttribute('data-v') : null,
  app: !!document.getElementById('app') }));

check('back', 'Back never leaves the app, and a shared link opens its screen', async ({ p, base }) => {
  /* the audit's own walk: into the map, then a state, then Back, Back, Back */
  await p.evaluate(() => document.querySelector('[data-bz=tab][data-v="map"]').click());
  await p.waitForTimeout(400);
  const onMap = await where(p);
  if (onMap.hash !== '#/map') throw new Error(`the map has no route of its own (hash "${onMap.hash}")`);
  await p.evaluate(() => document.querySelector('[data-bz=tab][data-v="paath"]').click());
  await p.waitForTimeout(400);
  await p.goBack(); await p.waitForTimeout(400);
  const back1 = await where(p);
  if (!back1.url.startsWith(base) || back1.hash !== '#/map')
    throw new Error(`Back from Paathshala did not return to the map (landed on ${back1.url})`);
  await p.goBack(); await p.waitForTimeout(400);
  const back2 = await where(p);
  if (!back2.url.startsWith(base) || !back2.app)
    throw new Error(`Back from the map left the app (landed on ${back2.url})`);
  /* a link from outside: opens on its screen, and Back from it stays inside */
  await p.goto(base + '#/stories', { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const linked = await where(p);
  /* the story shelves live inside Paathshala now (FIX-INDIA C1), so that tab lights */
  if (!/#\/stories$/.test(linked.hash) || linked.view !== 'paath') throw new Error(`#/stories opened ${linked.hash} under ${linked.view || 'nothing'}`);
  await p.goBack(); await p.waitForTimeout(500);
  const out = await where(p);
  if (!out.url.startsWith(base) || !out.app)
    throw new Error(`Back from a linked screen left the app (landed on ${out.url})`);
  /* HOME IS THE ROOT (FIX-INDIA §1): the audit's "repeated Back from Home landed on #/neeti".
     Out to Moral Science and the map, Home again — and Back, Back, Back stays on Home. */
  await p.goto(base + '#/home', { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  await p.evaluate(() => window.BI.go('neeti')); await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('[data-bz=tab][data-v="map"]').click()); await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('[data-bz=tab][data-v="home"]').click()); await p.waitForTimeout(500);
  for (let i = 0; i < 3; i++) {
    await p.goBack().catch(() => {}); await p.waitForTimeout(450);
    const h = await where(p);
    if (!h.url.startsWith(base) || h.hash !== '#/home' || h.view !== 'home')
      throw new Error(`Back ${i + 1} from Home landed on ${h.url} (tab ${h.view})`);
  }
});

check('continue', '#/continue opens the one next thing', async ({ p, base }) => {
  await p.goto(base + '#/continue', { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const r = await where(p);
  if (!r.view || r.view === 'home') throw new Error('#/continue opened home, not a next step');
  if (r.hash === '#/continue') throw new Error('#/continue was not resolved to a real screen');
});

check('pin', 'starting again, backups and the report are behind a PIN', async ({ p }) => {
  await p.evaluate(() => window.BI.go('me')); await p.waitForTimeout(400);
  const me = await p.evaluate(() => ({
    reset: !!document.querySelector('#main [data-act="reset"]'),
    dev: !!document.querySelector('#main [data-act="devmode"]'),
    backup: !!document.querySelector('#main [data-act="backup"]'),
    door: !!document.querySelector('#main [data-act="go"][data-v="grown"]') }));
  if (me.reset) throw new Error('"Start again" is on the child\'s own page');
  if (me.dev) throw new Error('the developer unlock is on the child\'s own page');
  if (me.backup) throw new Error('backups are on the child\'s own page');
  if (!me.door) throw new Error('there is no door to the grown-ups\' page');
  await p.evaluate(() => document.querySelector('#main [data-act="go"][data-v="grown"]').click());
  await p.waitForTimeout(400);
  const gate = await p.evaluate(() => ({ pad: document.querySelectorAll('.pinkey').length,
    reset: !!document.querySelector('#main [data-act="reset"]'),
    says: /deterrent, not security/.test(document.querySelector('#main').innerText) }));
  if (gate.reset) throw new Error('the grown-ups\' page opened without a PIN');
  if (gate.pad < 10) throw new Error('no PIN keypad on the grown-ups\' door');
  if (!gate.says) throw new Error('the PIN screen does not say it is a deterrent, not security');
  /* set 2468 by touch, confirm it by keyboard — both ways in (house rule) */
  for (const d of '2468') { await p.evaluate(d => document.querySelector(`.pinkey[data-d="${d}"]`).click(), d); await p.waitForTimeout(60); }
  for (const d of '2468') { await p.keyboard.press(d); await p.waitForTimeout(60); }
  await p.waitForTimeout(300);
  const open = await p.evaluate(() => !!document.querySelector('#main [data-act="reset"]'));
  if (!open) throw new Error('the PIN, typed twice, did not open the grown-ups\' page');
  /* leaving locks it; a wrong PIN does not open it; the right one does */
  await p.evaluate(() => window.BI.go('home')); await p.waitForTimeout(300);
  await p.evaluate(() => window.BI.go('grown')); await p.waitForTimeout(300);
  for (const d of '1111') { await p.keyboard.press(d); await p.waitForTimeout(60); }
  await p.waitForTimeout(300);
  if (await p.evaluate(() => !!document.querySelector('#main [data-act="reset"]')))
    throw new Error('a wrong PIN opened the grown-ups\' page');
  for (const d of '2468') { await p.keyboard.press(d); await p.waitForTimeout(60); }
  await p.waitForTimeout(300);
  if (!await p.evaluate(() => !!document.querySelector('#main [data-act="reset"]')))
    throw new Error('the right PIN did not open the grown-ups\' page after leaving it');
});

check('tester', 'the developer unlock exists only in tester mode', async ({ p, base }) => {
  const look = () => p.evaluate(() => !!document.querySelector('[data-act="devmode"]'));
  /* the grown-ups' page, opened, without tester mode */
  await p.evaluate(() => { window.BI.S.pin = null; });
  await p.evaluate(() => window.BI.go('grown')); await p.waitForTimeout(300);
  for (const d of '13571357') { await p.keyboard.press(d); await p.waitForTimeout(50); }
  await p.waitForTimeout(300);
  if (await look()) throw new Error('the developer unlock is on the grown-ups\' page without tester mode');
  /* and a profile carrying S.dev from before is switched off at boot */
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('bi_v1')); s.dev = true; localStorage.setItem('bi_v1', JSON.stringify(s)); });
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  if (await p.evaluate(() => !!window.BI.S.dev)) throw new Error('S.dev stayed on outside tester mode');
  /* in tester mode it is there */
  await p.goto(base + '?tester=1', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => window.BI.go('grown')); await p.waitForTimeout(300);
  for (const d of '1357') { await p.keyboard.press(d); await p.waitForTimeout(50); }
  await p.waitForTimeout(300);
  if (!await look()) throw new Error('tester mode did not show the developer unlock');
  await p.goto(base + '?tester=0', { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
});

check('sources', 'every Dharma object carries sources, and its page shows them', async ({ p }) => {
  const r = await p.evaluate(() => (window.IND_DHARMA.faiths || []).map(f => ({ id: f.id, n: (f.sources || []).length })));
  const bare = r.filter(x => x.n < 2);
  if (bare.length) throw new Error('faiths with fewer than two sources: ' + bare.map(x => x.id).join(', '));
  for (const f of r) {
    await p.evaluate(id => window.BI.go('faith', id), f.id); await p.waitForTimeout(250);
    const shown = await p.evaluate(() => {
      const box = [...document.querySelectorAll('#main .card')].find(c => /Where this comes from/.test(c.innerText));
      return box ? box.querySelectorAll('li').length : 0;
    });
    if (shown !== f.n) throw new Error(`${f.id}: the page shows ${shown} sources, the data holds ${f.n}`);
  }
});

check('report', 'the grown-ups\' page shows what the child can now do, from the course record', async ({ p }) => {
  await p.evaluate(() => window.BI.go('grown')); await p.waitForTimeout(300);
  /* a fresh profile: the PIN is chosen, then typed again */
  for (const d of '13571357') { await p.keyboard.press(d); await p.waitForTimeout(50); }
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const card = [...document.querySelectorAll('#main .card')].find(c => /can do now/.test(c.innerText));
    if (!card) return { none: true };
    const rows = window.IND_PAATH_UI && window.IND_PAATH_UI.report ? window.IND_PAATH_UI.report() : null;
    return { text: card.innerText, rows, minutes: /\bminutes?\b/i.test(card.innerText.replace(/never from minutes/i, '')) };
  });
  if (r.none) throw new Error('there is no report card on the grown-ups\' page');
  if (!Array.isArray(r.rows)) throw new Error('the Paathshala report was never called');
  if (r.minutes) throw new Error('the report card reports minutes');
  for (const row of r.rows)
    if (r.text.indexOf(row.name) < 0) throw new Error(`${row.name} is in the course record but not on the report card`);
});

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, serviceWorkers: 'block' });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      await skipOnboarding(p);
      await p.waitForTimeout(300);
      await c.fn({ p, base });
      if (errs.length) throw new Error('page error: ' + errs[0]);
      console.log(`  ok   ${c.id.padEnd(9)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(9)} ${c.what}\n         ${String(e.message).split('\n')[0]}`); fail++;
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
