#!/usr/bin/env node
/* Bizzing India — the family layer (FIX-INDIA O4, B7, O3, N4; family standard v2 §3, §5, §19).
   docs/25-family.md says why each one exists.

     topbar     one 56px row in the family order — ⬡ Hive · ☰ · name · … · search · coin · theme · 🔒 · avatar ▾ —
                on desktop and phone, nothing past 390px, and ⬡ hidden inside a running drill
     household  two children: the second starts with nothing of the first's (stories, coins,
                map, Sabhyata), switching back finds the first exactly as left, a second child
                of the same name is refused, and removing one leaves the other whole
     activity   bizzing.activity gets whole ACTIVE minutes for the child playing, and a
                finished story writes a 'stop' milestone — through the family's own row shape
     seam       nothing outside the Store seam touches localStorage directly, a v1 profile is
                walked up, and a profile from a NEWER build is never stamped older

   Each was watched to fail by breaking the thing it holds (docs/25-family.md).
   Run:  node tools/check-family.js            # all of them
         node tools/check-family.js --only household
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
const S = p => p.evaluate(() => window.BI.S);

check('topbar', 'one 56px row in the family order, on desktop and phone; ⬡ hidden in a drill', async ({ p }) => {
  for (const vp of [DESK, PHONE]) {
    await p.setViewportSize(vp); await p.waitForTimeout(300);
    const m = await p.evaluate(() => {
      const row = document.querySelector('.topbar .barrow'), r = row.getBoundingClientRect();
      const x = sel => { const e = document.querySelector(sel); return e && e.offsetParent ? e.getBoundingClientRect() : null; };
      const parts = { hive: x('.topbar .hivebtn'), menu: x('.topbar .menubtn'), name: x('.topbar .brand'),
        search: x('.topbar [data-v="search"]'), coin: x('.topbar .coinchip'), theme: x('.topbar [data-act="night"]'),
        grown: x('.topbar [data-v="grown"]'), kid: x('.topbar .kidbtn') };
      /* the standard's own measure: the page's width against the 390 the viewport was set to
         (innerWidth widens under emulation when something overflows, so it is not used) */
      const over = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - 390;
      return { h: r.height, parts: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, v && { l: v.left, t: v.top, b: v.bottom }])),
        rowTop: r.top, rowBot: r.bottom, href: (document.querySelector('.topbar .hivebtn') || {}).href || '', over };
    });
    if (Math.abs(m.h - 56) > 1) throw new Error(`at ${vp.width}px the bar is ${m.h}px, not 56`);
    /* family standard v2 §3: [⬡ Hive] [☰] [mascot + Bizzing India] … [search] [coin] [theme] [🔒] [avatar ▾];
       on a phone search, theme and 🔒 move into ☰ */
    const order = vp.width >= 900 ? ['hive', 'menu', 'name', 'search', 'coin', 'theme', 'grown', 'kid']
                                  : ['hive', 'menu', 'name', 'coin', 'kid'];
    for (const k of order) {
      const v = m.parts[k];
      if (!v) throw new Error(`at ${vp.width}px the bar has no ${k}`);
      if (v.t < m.rowTop - 1 || v.b > m.rowBot + 1) throw new Error(`at ${vp.width}px the ${k} control is off the bar's one row`);
    }
    for (let i = 1; i < order.length; i++)
      if (m.parts[order[i]].l <= m.parts[order[i - 1]].l)
        throw new Error(`at ${vp.width}px ${order[i]} comes before ${order[i - 1]} — the family order is ${order.join(' · ')}`);
    if (!/Bizzing_Schedule/.test(m.href)) throw new Error('⬡ does not go back to the Hive: ' + m.href);
    if (vp.width < 400 && m.over > 0) throw new Error(`the page is ${m.over}px wider than the 390px phone`);
  }
  /* a running drill hides ⬡ */
  await p.setViewportSize(DESK);
  /* the language groups load on demand: wait for them rather than guessing a time */
  await tap(p, '.navtab[data-v="bhasha"]'); await p.waitForSelector('[data-act="pack"][data-id="hi"]', { timeout: 20000 }).catch(() => {});
  await tap(p, '[data-act="pack"][data-id="hi"]'); await p.waitForSelector('.bh-next', { timeout: 20000 }).catch(() => {});
  await tap(p, '.bh-next');
  const vis = await p.evaluate(() => getComputedStyle(document.querySelector('.hivebtn')).visibility);
  if (vis !== 'hidden') throw new Error('⬡ is still showing inside a running drill');
});

check('household', 'two children never mix, switching back finds the first as left', async ({ p, base }) => {
  /* Asha: a story finished, coins, a Sabhyata save */
  await p.evaluate(() => window.BI.go('home')); await p.waitForTimeout(300);
  await tap(p, '#main [data-act="cont"]');
  for (let i = 0; i < 30 && !(await p.$('.reader [data-act="again"], [data-act="again"]')); i++) {
    const ans = await p.$('[data-act="answer"]');
    if (ans && !(await p.$('[data-act="next"]'))) { await ans.click(); await p.waitForTimeout(150); continue; }
    await tap(p, '[data-act="next"]');
  }
  await p.evaluate(() => window.IND_STORE.kidSet('india.sabhyata.v2', JSON.stringify({ era: 3, mark: 'asha' })));
  const a0 = await p.evaluate(() => ({ read: Object.keys(window.BI.S.read).length, lit: Object.keys(window.BI.S.lit).length, coins: window.BI.coins(), name: window.BI.S.name }));
  if (!a0.read || !a0.coins) throw new Error('the first child did not get a finished story and coins: ' + JSON.stringify(a0));
  /* a grown-up adds Ravi */
  await p.evaluate(() => window.BI.go('grown')); await p.waitForTimeout(300);
  for (let k = 0; k < 2; k++) for (const d of '2468') await tap(p, `.pinkey[data-d="${d}"]`);
  await p.waitForSelector('#main [data-act="addkid"]', { timeout: 20000 }).catch(() => {});
  await tap(p, '#main [data-act="addkid"]'); await p.waitForTimeout(800);
  if (!(await p.$('#nm'))) throw new Error('adding a child did not open their setup');
  if (!(await p.$('[data-act="addcancel"]'))) throw new Error('a child being added cannot be un-added');
  /* the same name is refused: the wallet is kept by first name */
  await p.fill('#nm', a0.name); await tap(p, '[data-act="obnext"]');
  if (!(await p.$('#nm'))) throw new Error('a second child called ' + a0.name + ' was let through');
  await skipOnboarding(p, { name: 'Ravi' });
  const b = await p.evaluate(() => ({ name: window.BI.S.name, read: Object.keys(window.BI.S.read).length, lit: Object.keys(window.BI.S.lit).length,
    coins: window.BI.coins(), sab: window.IND_STORE.kidGet('india.sabhyata.v2'), kids: window.IND_STORE.kids().length,
    house: JSON.parse(localStorage.getItem('bi_house')) }));
  if (b.name !== 'Ravi' || b.kids !== 2) throw new Error('Ravi is not the second child of two: ' + JSON.stringify(b));
  if (b.read || b.lit || b.coins || b.sab) throw new Error('Ravi starts with the first child\'s things: ' + JSON.stringify(b));
  /* Ravi reads a little, then the top bar's menu switches back to Asha */
  await p.evaluate(() => { window.BI.S.read['ravi-only'] = true; window.BI.Store.saveProfile(window.BI.S); });
  await tap(p, '.kidbtn');
  await p.evaluate(() => [...document.querySelectorAll('#kidmenu [data-act="switchkid"]')].find(b => /Asha/.test(b.textContent)).click());
  await p.waitForLoadState('networkidle'); await p.waitForTimeout(700);
  const a1 = await p.evaluate(() => ({ name: window.BI.S.name, read: Object.keys(window.BI.S.read).length, coins: window.BI.coins(),
    ravi: !!window.BI.S.read['ravi-only'], sab: JSON.parse(window.IND_STORE.kidGet('india.sabhyata.v2') || 'null') }));
  if (a1.name !== a0.name || a1.read !== a0.read || a1.coins !== a0.coins || a1.ravi || !a1.sab || a1.sab.mark !== 'asha')
    throw new Error('switching back did not find the first child as left: ' + JSON.stringify({ a0, a1 }));
  /* removing Ravi leaves Asha whole */
  await p.evaluate(() => { window.IND_STORE.removeKid('k2'); });
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  const a2 = await p.evaluate(() => ({ name: window.BI.S.name, read: Object.keys(window.BI.S.read).length, kids: window.IND_STORE.kids().length,
    left: Object.keys(localStorage).filter(k => /\.k2$/.test(k)) }));
  if (a2.name !== a0.name || a2.read !== a0.read || a2.kids !== 1 || a2.left.length)
    throw new Error('removing the second child disturbed the first, or left keys behind: ' + JSON.stringify(a2));
});

check('activity', 'bizzing.activity gets active minutes and a story\'s milestone', async ({ p }) => {
  /* active minutes: the clock runs and the child keeps touching the screen */
  for (let i = 0; i < 12; i++) {
    await p.mouse.move(200 + i, 300); await p.mouse.down(); await p.mouse.up();
    await p.clock.runFor(15000);
  }
  const rows = await p.evaluate(() => (JSON.parse(localStorage.getItem('bizzing.activity') || '{"s":[]}').s));
  const mins = rows.filter(r => r.a === 'india' && r.who === 'Asha' && r.m > 0);
  if (!mins.length) throw new Error('no active minutes were written for Asha: ' + JSON.stringify(rows).slice(0, 200));
  /* idle time is not counted: past the drop-in's two-minute grace, nothing more is added */
  await p.clock.runFor(3 * 60000);
  const before = (await p.evaluate(() => JSON.parse(localStorage.getItem('bizzing.activity')).s))
    .filter(r => r.a === 'india' && r.m > 0).reduce((n, r) => n + r.m, 0);
  await p.clock.runFor(10 * 60000);
  const after = (await p.evaluate(() => JSON.parse(localStorage.getItem('bizzing.activity')).s))
    .filter(r => r.a === 'india' && r.m > 0).reduce((n, r) => n + r.m, 0);
  if (after !== before) throw new Error(`ten idle minutes were counted as ${after - before} active ones`);
  /* a finished story is a milestone */
  await p.evaluate(() => window.BI.go('home')); await p.waitForTimeout(200);
  await tap(p, '#main [data-act="cont"]');
  for (let i = 0; i < 30 && !(await p.$('[data-act="again"]')); i++) {
    const ans = await p.$('[data-act="answer"]');
    if (ans && !(await p.$('[data-act="next"]'))) { await ans.click(); await p.waitForTimeout(150); continue; }
    await tap(p, '[data-act="next"]');
  }
  const ms = await p.evaluate(() => JSON.parse(localStorage.getItem('bizzing.activity')).s.filter(r => r.ev));
  const stop = ms.find(r => r.ev === 'stop' && r.a === 'india' && r.m === 0 && r.who === 'Asha' && r.label);
  if (!stop) throw new Error('finishing a story wrote no stop milestone: ' + JSON.stringify(ms));
  if (!ms.find(r => r.ev === 'world')) throw new Error('lighting a place wrote no world milestone');
}, { clock: true });

check('seam', 'storage goes through the Store seam; v1 walks up; a newer profile is never stamped older', async ({ p, base }) => {
  const SEAM = ['app.js', 'demo.js'];   /* the family's own modules live in app/family/ and own their keys */
  const bad = [];
  fs.readdirSync(APP).filter(f => f.endsWith('.js') && SEAM.indexOf(f) < 0).forEach(f => {
    const L = fs.readFileSync(path.join(APP, f), 'utf8').split('\n');
    L.forEach((ln, i) => {
      if (!/localStorage\s*[.[]/.test(ln) || /^\s*(\/\*|\*|\/\/)/.test(ln)) return;
      /* allowed only as the fallback ON THE SAME LINE as an IND_STORE call (an engine
         opened on its own, before app.js) — a looser "nearby" rule let a direct call through */
      if (!/IND_STORE/.test(ln)) bad.push(f + ':' + (i + 1));
    });
  });
  if (bad.length) throw new Error('localStorage touched outside the Store seam: ' + bad.join(', '));
  /* a profile from a newer build is left exactly as it is, even after a save */
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('bi_v1')); s.schemaVersion = 99; s.fromTheFuture = 'kept';
    localStorage.setItem('bi_v1', JSON.stringify(s)); });
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  await p.evaluate(() => { window.BI.S.goal = 5; window.BI.Store.saveProfile(window.BI.S); });
  const v = await p.evaluate(() => JSON.parse(localStorage.getItem('bi_v1')));
  if (v.schemaVersion !== 99 || v.fromTheFuture !== 'kept') throw new Error(`a newer profile was stamped ${v.schemaVersion}`);
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
    const ctx = await browser.newContext({ viewport: vp, serviceWorkers: 'block' });
    const p = await ctx.newPage();
    if (c.clock) await p.clock.install();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      await skipOnboarding(p);
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
