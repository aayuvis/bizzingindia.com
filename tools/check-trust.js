#!/usr/bin/env node
/* Bizzing India — the trust fixes (FIX-INDIA "Fix first", family standard §4 and §7).
   ==================================================================================
   Four things a parent should never have to discover:

     back      browser Back from inside the app never leaves it (the audit's map →
               about:blank), and a shared #/<view> link opens that view
     deadends  a screen that names one thing, opened on nothing, is its shelf; opened on a thing
               that is not there, it shows the peacock and a door to the shelf — never a bare line
     continue  #/continue — the Hive's door — opens the one next thing
     pin       nothing that changes the child sits on the child's page: starting again,
               backups and the report card are behind a PIN the screen calls a deterrent,
               and leaving the grown-ups' page locks it again
     tester    the developer unlock does not exist outside tester mode (?tester=1)
     price     the family plan's price ($59 / ₹1,999 a year) is on the grown-ups' page only;
               no child's screen shows real money
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

/* NO DEAD ENDS (audit, 3 Oct 2026): #/value and #/verses with nothing after them showed the error
   page, #/kosh a bare "Pack not found." and #/kahani "This shelf is not here." — no peacock, no
   way on. Every screen that names one thing (HUB_OF in app.js) is opened twice: with nothing
   named it must be a real screen, never the oops card; with a name that is not there it must be
   the oops card, with the peacock, and a door to a screen that is not Home. */
check('deadends', 'a screen opened on nothing is its shelf; on a thing not there, the peacock and a door to the shelf', async ({ p, base }) => {
  const src = fs.readFileSync(path.join(APP, 'app.js'), 'utf8');
  const lit = src.match(/var HUB_OF = (\{[\s\S]*?\});/);
  if (!lit) throw new Error('app.js has no HUB_OF — the table of shelves is gone');
  const HUB = require('vm').runInNewContext('(' + lit[1] + ')');
  /* every render() case that reads view.arg must have a shelf */
  const takes = [...new Set([...src.matchAll(/case '([a-z0-9]+)':\s*h = V\.\w+\(view\.arg\)/g)].map(m => m[1]))];
  const OWN = { paath: 1, shop: 1, search: 1, lost: 1 };   /* with no arg these ARE the hub; lost IS the not-here page */
  const orphan = takes.filter(n => !HUB[n] && !OWN[n]);
  if (orphan.length) throw new Error('screens with no shelf to fall back to: ' + orphan.join(', '));
  await p.evaluate(() => window.IND_LOAD(window.IND_GROUPS()));
  const bad = [];
  for (const n of Object.keys(HUB)) {
    for (const [arg, want] of [['', 'shelf'], ['/zz-not-a-thing', 'oops']]) {
      const r = await p.evaluate(async h => {
        location.hash = h; await new Promise(ok => setTimeout(ok, 30));
        if (window.BI.ready) await window.BI.ready();
        const m = document.getElementById('main'), o = m.querySelector('.bz-oops');
        const b = o && [...o.querySelectorAll('[data-act="go"]')].map(x => x.getAttribute('data-v'));
        /* the Gita before its reviewer signs is a gate, not a dead end: it says why, with a door */
        const hold = m.querySelector('.gt-hold [data-act="go"]');
        if (hold) return { hold: true };
        return { oops: !!o, face: !!(o && o.querySelector('img, svg')), doors: b || [], text: m.innerText.slice(0, 120),
                 bare: /^(Pack not found\.|This shelf is not here\.)/.test(m.innerText.trim()) };
      }, '#/' + n + arg);
      if (r.hold) continue;
      if (r.bare) bad.push(`#/${n}${arg} says only "${r.text.slice(0, 30)}"`);
      else if (want === 'shelf' && r.oops) bad.push(`#/${n} with nothing named is the error page`);
      /* v4 audit: "Story not found." with no button slipped past a check that accepted any
         default. A name that is not there now gets the peacock and a door, every time. */
      else if (want === 'oops' && !r.oops) bad.push(`#/${n}${arg} shows "${r.text.slice(0, 40).replace(/\s+/g, ' ')}" instead of the peacock and a door`);
      else if (want === 'oops' && (!r.face || !r.doors.some(d => d && d !== 'home'))) bad.push(`#/${n}${arg} has no peacock or no door but Home`);
    }
  }
  /* an address the app does not have: said, with Home and Search — never silently Home */
  const lost = await p.evaluate(async () => {
    location.hash = '#/zz-no-such-page'; await new Promise(ok => setTimeout(ok, 30));
    if (window.BI.ready) await window.BI.ready();
    const o = document.querySelector('#main .bz-oops');
    return { oops: !!o, doors: o ? [...o.querySelectorAll('[data-act="go"]')].map(x => x.getAttribute('data-v')) : [] };
  });
  if (!lost.oops || lost.doors.indexOf('home') < 0) bad.push('#/zz-no-such-page is not said: ' + JSON.stringify(lost));
  if (bad.length) throw new Error(bad.length + ' dead ends: ' + bad.join(' · '));
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

/* THE PRICE IS FOR GROWN-UPS (owner, 3 Oct 2026: $59 a year, ₹1,999 in India). It is said on
   the grown-ups' page, behind the PIN, from the one place it is kept (IND_ENT.plan()) — and no
   screen a child can reach shows real money at all, not a ₹ or a $ next to a number. */
check('price', 'the family plan\'s price is on the grown-ups\' page, from IND_ENT.plan(); no child\'s screen shows real money', async ({ p }) => {
  const MONEY = /[₹$]\s?\d/;
  const bad = [];
  for (const [v, a] of [['home'], ['me'], ['shop', 'avatars'], ['shop', 'worlds'], ['shop', 'extras'], ['worlds'], ['collection'], ['settings'], ['help'], ['privacy'], ['play'], ['feed'], ['map'], ['paath']]) {
    await p.evaluate(([v, a]) => window.BI.go(v, a), [v, a]); await p.waitForTimeout(250);
    const t = await p.evaluate(() => document.body.innerText);
    const m = t.match(MONEY); if (m) bad.push(`#/${v}${a ? '/' + a : ''} shows "${t.slice(Math.max(0, m.index - 20), m.index + 12).replace(/\s+/g, ' ')}"`);
  }
  if (bad.length) throw new Error('real money on a child\'s screen: ' + bad.join(' · '));
  await p.evaluate(() => { window.BI.S.pin = null; });
  await p.evaluate(() => window.BI.go('grown')); await p.waitForTimeout(300);
  for (const d of '13571357') { await p.keyboard.press(d); await p.waitForTimeout(50); }
  await p.waitForTimeout(300);
  const g = await p.evaluate(() => { const c = document.querySelector('[data-plan]'), P = window.IND_ENT && window.IND_ENT.plan && window.IND_ENT.plan();
    return { text: c ? c.innerText : '', P }; });
  if (!g.P) throw new Error('IND_ENT.plan() is missing — the price has no one place');
  const y = '₹' + Number(g.P.INR.year).toLocaleString('en-IN'), u = '$' + g.P.USD.year;
  if (g.text.indexOf(y) < 0 || g.text.indexOf(u) < 0) throw new Error(`the grown-ups' page does not say ${y} and ${u}: "${g.text.slice(0, 120)}"`);
  if (g.P.INR.year !== 1999 || g.P.USD.year !== 59) throw new Error('the price is not the owner\'s ($59 / ₹1,999)');
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
