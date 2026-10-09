#!/usr/bin/env node
/* Bizzing India — the family standard v2 and FIX-INDIA v2 (2 Oct 2026), held in a browser.

     strings     no "[object Object]" and no {placeholder} on any screen, desktop and phone;
                 every screen has a heading and a way back, and none is wider than a 390px phone
                 (standard §16, §22; FIX-INDIA C5, N12; the shell task)
     shelf       the Family Shelf and the Invite say true things: no account that does not exist
     passcodes   no pass code anywhere in the client, and nothing redeems (R7)
     rangoli     Rangoli Rush never says "8 of 6 dots"
     mela        Festival Frenzy is on the Play grid; Pallanguzhi and Gutte have their own covers
     scripts     every script chart is set in its own face — Urdu in Nastaliq — read from the
                 fonts Chrome actually used, never a fallback (standard §9)
     drawer      ☰ opens and closes by keyboard, holds the family order, traps focus, Esc closes
     tabs        six tabs from the family shell (My Feed last): a row on a desk, a bottom bar on a phone,
                 Home first and the map second, no More, the right tab lit (standard §4; C1)
     shell       checkShell (tools/lib/shell-check.mjs) measures the chrome and Home against
                 Bizzing Bee's numbers, desktop and phone, light and dark: it must be []
     settings    Settings in the five sections, in order; age band and daily target behind the PIN
     emoji       zero emoji inside buttons, tabs, nav, h1–h3 and chips (standard §9)
     avatars     validate(catalogue) is [], 96 = 12 × 8 at 2/3/2/1; all 80 kept; real people
                 carry an about; no sacred figure in a villains' pack; every Legendary's
                 milestone is measured (standard §8)
     shop        a Rare costs 120 through the wallet, a Legendary waits for its milestone, a
                 world opens for 240, and the coin chip shows the history in words (§1, §1.1)
     search      finds a story, a state, an era, a word and a festival, and opens them (C4)
     music       a loop for every world, Home and the games, 60–90 s; lazy; off in Calm mode;
                 ducks under the voice; paused when the page is hidden (§11; M4, M5)
     siblings    the avatar ▾ lists every child with their own face (C3)

   Each was watched to fail by breaking the thing it holds.
   Run:  node tools/check-standard.js            # all of them
         node tools/check-standard.js --only shop
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');

const APP = path.join(__dirname, '..', 'app');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml',
  '.woff2':'font/woff2', '.webmanifest':'application/manifest+json', '.ico':'image/x-icon',
  '.mp3':'audio/mpeg', '.webp':'image/webp', '.md':'text/markdown' };
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
const tap = async (p, sel) => { await p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no ' + s); e.click(); }, sel); await p.waitForTimeout(300); };
const go = async (p, v, a) => { await p.evaluate(([v, a]) => window.BI.go(v, a), [v, a]); await p.waitForTimeout(250); };
const BAD = /\[object Object\]|\{(child|relation|name|n|placeholder|[a-z_]+)\}|undefined|NaN\b/;

/* ------------------------------------------------------------------ strings (C5, N12) */
check('strings', 'no [object Object] or {placeholder} anywhere; a heading and a way back on every screen', async ({ p }) => {
  await p.evaluate(() => window.IND_LOAD(window.IND_GROUPS()));
  const routes = await p.evaluate(() => {
    const R = [], add = (v, a) => R.push([v, a == null ? null : a]);
    ['home', 'feed', 'map', 'paath', 'bhasha', 'khel', 'stories', 'neeti', 'epics', 'shelf', 'invite', 'nani', 'utsav', 'geet', 'dharma',
     'itihaas', 'shlok', 'gully', 'people', 'rishtey', 'me', 'worlds', 'tongue', 'collection', 'shop', 'medals', 'settings',
     'privacy', 'help', 'search', 'grown', 'aaj', 'cards', 'dvandva', 'ghar'].forEach(v => add(v));
    add('shop', 'worlds'); add('shop', 'extras'); add('search', 'kerala');
    const st = (window.IND_STORIES || [])[0]; if (st) add('story', st.id);
    add('state', 'KL'); add('chart', 'ur'); add('pack', 'hi'); add('kosh', 'hi');
    const era = ((window.IND_ITIHAAS || {}).eras || [])[0]; if (era) add('era', era.id);
    const f = ((window.IND_UTSAV || {}).festivals || [])[0]; if (f) add('festival', f.id);
    add('avcard', 'ganesha'); add('avcard', 'gandhi'); add('epic', 'ramayana');
    const c = ((window.IND_PAATH || {}).courses || [])[0]; if (c) add('paath', c.id);
    return R;
  });
  const bad = [];
  for (const vp of [DESK, PHONE]) {
    await p.setViewportSize(vp);
    for (const [v, a] of routes) {
      await p.evaluate(([v, a]) => window.BI.go(v, a), [v, a]);
      await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(120);
      const r = await p.evaluate(() => {
        const m = document.querySelector('#main'), t = m ? m.innerText : '';
        const hit = (t.match(/\[object Object\]|\{(child|relation|name|placeholder|[a-z_]{2,})\}/) || [])[0] || '';
        return { hit, wide: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth, head: !!m.querySelector('h1, h2') || !!m.querySelector('[data-bz=home] h3'), back: !!(m.querySelector('.backlink, [data-act="back"]') || document.querySelector('[data-bz=tab]')) };
      });
      if (vp.width < 400 && r.wide > 0) bad.push(`${vp.width}px #/${v}${a ? '/' + a : ''} is ${r.wide}px wider than the phone`);
      if (r.hit) bad.push(`${vp.width}px #/${v}${a ? '/' + a : ''} shows "${r.hit}"`);
      if (!r.head) bad.push(`${vp.width}px #/${v}${a ? '/' + a : ''} has no heading`);
      if (!r.back) bad.push(`${vp.width}px #/${v}${a ? '/' + a : ''} has no way back`);
    }
  }
  if (bad.length) throw new Error(bad.slice(0, 6).join(' · ') + (bad.length > 6 ? ` … and ${bad.length - 6} more` : ''));
});

check('shelf', 'the Family Shelf and the Invite claim no account that does not exist', async ({ p }) => {
  await go(p, 'shelf'); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(300);
  const a = await p.evaluate(() => document.querySelector('#main').innerText);
  if (/family[’']s account/i.test(a)) throw new Error('the shelf says recordings live in a family account');
  if (!/this device/i.test(a)) throw new Error('the shelf does not say where recordings live');
  await go(p, 'invite'); await p.waitForTimeout(300);
  const b = await p.evaluate(() => document.querySelector('#main').innerText);
  if (/No password and no account|Send to /i.test(b)) throw new Error('the invite still promises a link a grandparent can open');
  if (b.indexOf('Asha') < 0) throw new Error('the invite does not name the child');
  if (/\{child\}/.test(b)) throw new Error('the invite shows {child}');
});

check('passcodes', 'no pass code in client code, and nothing redeems', async ({ p }) => {
  const hits = [];
  const walk = d => fs.readdirSync(d).forEach(f => {
    const q = path.join(d, f);
    if (fs.statSync(q).isDirectory()) { if (!/^(art|voice|font)$/.test(f)) walk(q); return; }
    if (!/\.(js|html)$/.test(f)) return;
    const t = fs.readFileSync(q, 'utf8');
    if (/PARIVAAR|NANI2026|DEMO_CODES/.test(t)) hits.push(path.relative(APP, q));
  });
  walk(APP);
  if (hits.length) throw new Error('pass codes in client code: ' + hits.join(', '));
  const r = await p.evaluate(() => [window.IND_ENT.redeem('PARIVAAR'), window.IND_ENT.redeem('NANI2026'), window.IND_ENT.hasPass()]);
  if (r[0] || r[1] || r[2]) throw new Error('a typed code opened the family plan: ' + JSON.stringify(r));
});

check('rangoli', 'Rangoli Rush never counts more dots placed than the pattern has', async ({ p }) => {
  await go(p, 'game', 'rangoli'); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(800);
  /* a game with levels opens on the host's level chip first (games spec §1.3): start it */
  await p.evaluate(() => { const s = document.querySelector('#gamehost [data-gmh="start"]'); if (s) s.click(); });
  await p.waitForTimeout(300);
  await p.evaluate(() => { const b = document.querySelector('#gamehost [data-go="ready"]'); if (b) b.click(); });
  await p.waitForTimeout(400);
  const n = await p.evaluate(() => document.querySelectorAll('#gamehost .mela-dot').length);
  if (!n) throw new Error('the rangoli board never appeared');
  /* tap every dot on the board: far more than the pattern holds */
  await p.evaluate(() => [...document.querySelectorAll('#gamehost .mela-dot')].forEach(d => d.click()));
  await p.waitForTimeout(200);
  const t = await p.evaluate(() => (document.querySelector('#gamehost [data-role="count"]') || {}).textContent || '');
  const m = t.match(/(\d+) of (\d+) dots placed/);
  if (!m) throw new Error('the counter says nothing countable: "' + t + '"');
  if (+m[1] > +m[2]) throw new Error('the counter says "' + t + '"');
  if (!/extra/.test(t)) throw new Error('too many dots, and the counter does not say so: "' + t + '"');
});

/* The calendar slot: Festival Frenzy until Panchang is released, then Panchang (one in, one out,
   games spec §3.1). Gutte left Play (owner, 8 Oct 2026; its engine is archived), so only
   Pallanguzhi's cover is held here — and Gutte being gone is held by check-games `lineup`. */
check('mela', 'the festival calendar is on the Play grid; Pallanguzhi has a cover of its own; Gutte is gone', async ({ p }) => {
  await go(p, 'khel'); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(400);
  const r = await p.evaluate(() => ({
    festival: !!document.querySelector('#main .gcover[data-id="festival"], #main .gcover[data-id="panchang"]'),
    gutte: !!document.querySelector('#main .gcover[data-id="gutte"]'),
    art: ['pallanguzhi'].map(id => {
      const c = document.querySelector('#main .gcover[data-id="' + id + '"] .gart');
      return c ? c.classList.contains('art') && !!c.querySelector('svg.gcart') : false;
    }) }));
  if (!r.festival) throw new Error('neither Festival Frenzy nor Panchang is on the Play grid');
  if (!r.art[0]) throw new Error('Pallanguzhi still has a placeholder tile');
  if (r.gutte) throw new Error('Gutte is still on the Play grid — the owner removed it');
});

/* ------------------------------------------------------------------ scripts (§9) */
const FACE = { hi: /^Mukta( |$)/, mr: /^Mukta( |$)/, pa: /^Mukta Mahee/, ta: /^Mukta Malar/, gu: /^Mukta Vaani/,
  bn: /^Noto Sans Bengali/, te: /^Noto Sans Telugu/, kn: /^Noto Sans Kannada/, ur: /^Noto Nastaliq Urdu/ };
check('scripts', 'every script chart is set in its own face — Urdu in Nastaliq', async ({ p, ctx }) => {
  const cdp = await ctx.newCDPSession(p); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const packs = await p.evaluate(async () => { await window.IND_LOAD(['bhasha']); return Object.keys(window.IND_PACKS); });
  const bad = [];
  for (const id of packs) {
    if (!FACE[id]) { bad.push(id + ': no face is named for this script in the check'); continue; }
    await go(p, 'chart', id); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(700);
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '#main .glyph > span' });
    if (nodeIds.length < 10) { bad.push(id + ': the chart has ' + nodeIds.length + ' letters'); continue; }
    for (const n of nodeIds.slice(0, 24)) {
      const r = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: n });
      const wrong = r.fonts.filter(f => !FACE[id].test(f.familyName));
      if (wrong.length) { bad.push(id + ': set in ' + wrong.map(f => f.familyName).join(', ')); break; }
    }
  }
  if (bad.length) throw new Error(bad.join(' · '));
});

/* ------------------------------------------------------------------ drawer (§3) */
const DRAWER_ORDER = ['me', 'shop', 'collection', 'medals', 'feed', 'stories', 'neeti', 'epics', 'settings', 'grown', 'help', 'privacy', 'hive'];
const drawerOpen = p => p.evaluate(() => { const d = document.querySelector('[data-bz=drawer]'); return !!d && !d.hidden; });
const openMenu = async p => { if (!(await drawerOpen(p))) await tap(p, '[data-bz=menu]'); };
check('drawer', '☰ (the family shell\'s) opens by keyboard, holds the family order with India\'s four, keeps focus, Esc, the scrim and a row close it', async ({ p }) => {
  await p.focus('[data-bz=menu]'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const d = document.querySelector('[data-bz=drawer]');
    if (!d || d.hidden) return null;
    const rows = [...d.querySelectorAll('a[data-bz-dr]')].map(x => {
      const k = x.getAttribute('data-bz-dr');
      return k === 'app' ? (x.getAttribute('href') || '').replace('#/', '') : k === 'grownups' ? 'grown' : k;
    });
    const broken = [...d.querySelectorAll('a[data-bz-dr]')].filter(x => x.getAttribute('data-bz-dr') !== 'hive' && !/^#\//.test(x.getAttribute('href') || '')).map(x => x.getAttribute('href'));
    return { rows, broken, inside: d.contains(document.activeElement), modal: d.getAttribute('aria-modal'),
      expanded: document.querySelector('[data-bz=menu]').getAttribute('aria-expanded'), sound: !!d.querySelector('[data-bz-act=sound]') };
  });
  if (!r) throw new Error('Enter on ☰ did not open the drawer');
  if (JSON.stringify(r.rows) !== JSON.stringify(DRAWER_ORDER)) throw new Error('the drawer order is ' + r.rows.join(' · '));
  if (r.broken.length) throw new Error('a drawer row goes nowhere in the app: ' + r.broken.join(', '));
  if (!r.inside) throw new Error('focus did not move into the drawer');
  if (r.expanded !== 'true') throw new Error('☰ does not say it is open');
  if (!r.sound) throw new Error('the one mute is not in ☰');
  /* Tab from the last control comes back to the first */
  for (let i = 0; i < 30; i++) await p.keyboard.press('Tab');
  if (!(await p.evaluate(() => document.querySelector('[data-bz=drawer]').contains(document.activeElement))))
    throw new Error('Tab walked out of the open drawer');
  const hash0 = await p.evaluate(() => location.hash);
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  const after = await p.evaluate(() => ({ focus: document.activeElement && document.activeElement.getAttribute('data-bz') === 'menu', hash: location.hash }));
  if (await drawerOpen(p)) throw new Error('Esc did not close the drawer');
  if (!after.focus) throw new Error('focus did not return to ☰');
  if (after.hash !== hash0) throw new Error('Esc on the drawer also left the screen: ' + hash0 + ' → ' + after.hash);
  /* the scrim closes it too, and a row navigates */
  await openMenu(p); await tap(p, '[data-bz=scrim]');
  if (await drawerOpen(p)) throw new Error('the scrim did not close the drawer');
  await openMenu(p); await tap(p, '[data-bz=drawer] [data-bz-dr="shop"]');
  await p.waitForTimeout(300);
  if (!(await p.evaluate(() => location.hash === '#/shop')) || await drawerOpen(p))
    throw new Error('a drawer row did not open its screen and close the drawer');
  /* the sound button in ☰ is the one mute */
  const s0 = await p.evaluate(() => window.BI.soundOn ? window.BI.soundOn() : null);
  await openMenu(p); await tap(p, '[data-bz=drawer] [data-bz-act=sound]');
  const s1 = await p.evaluate(() => window.BI.soundOn ? window.BI.soundOn() : null);
  if (s0 !== null && s0 === s1) throw new Error('the sound button in ☰ did nothing');
  if (s0 !== null && s0 !== s1) await tap(p, '[data-bz=drawer] [data-bz-act=sound]');
  await p.keyboard.press('Escape');
});

/* ------------------------------------------------------------------ tabs (§4) */
check('tabs', 'six tabs from the family shell — Home, the map … Play, then My Feed last: a row on a desk, a bottom bar on a phone, no More', async ({ p }) => {
  for (const vp of [DESK, PHONE]) {
    await p.setViewportSize(vp); await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const desk = innerWidth >= 900;
      const t = [...document.querySelectorAll(desk ? '[data-bz=tabs] a' : '[data-bz=tabbar] a')].filter(x => x.offsetParent || getComputedStyle(x).position === 'fixed' || x.getBoundingClientRect().height);
      const bar = document.querySelector('[data-bz=tabbar]').getBoundingClientRect();
      return { desk, ids: t.map(x => x.getAttribute('data-v')), labels: t.map(x => x.textContent.trim()),
        h: t.map(x => x.getBoundingClientRect().height), cur: t.filter(x => x.getAttribute('aria-current') === 'page').map(x => x.getAttribute('data-v')),
        barBottom: bar.bottom, barH: bar.height, vh: innerHeight, more: [...document.querySelectorAll('a, button')].some(x => /^\s*More\s*$/.test(x.textContent) && x.offsetParent) };
    });
    if (JSON.stringify(r.ids) !== JSON.stringify(['home', 'map', 'paath', 'bhasha', 'khel', 'feed']))
      throw new Error(`at ${vp.width}px the tabs are ${r.ids.join(' · ')}`);
    if (JSON.stringify(r.labels) !== JSON.stringify(['Home', 'India', 'Paathshala', 'Bhasha', 'Play', 'My Feed']))
      throw new Error(`at ${vp.width}px the tab names are ${r.labels.join(' · ')}`);
    if (r.more) throw new Error('there is a More tab');
    if (r.h.some(h => h < 44)) throw new Error(`at ${vp.width}px a tab is under 44px tall`);
    if (JSON.stringify(r.cur) !== '["home"]') throw new Error(`at ${vp.width}px the current tab on Home is ${JSON.stringify(r.cur)}`);
    if (!r.desk && (Math.abs(r.barBottom - r.vh) > 1 || r.barH < 60)) throw new Error('the phone tabs are not a bottom bar');
  }
  /* a screen under a tab lights that tab */
  await p.setViewportSize(DESK);
  for (const [v, a, tab] of [['stories', null, 'paath'], ['state', 'KL', 'map'], ['kosh', 'hi', 'bhasha'], ['mela', null, 'khel']]) {
    await go(p, v, a);
    const cur = await p.evaluate(() => (document.querySelector('[data-bz=tabs] a[aria-current="page"]') || {}).getAttribute ? document.querySelector('[data-bz=tabs] a[aria-current="page"]').getAttribute('data-v') : '');
    if (cur !== tab) throw new Error(`#/${v} lights ${cur || 'no tab'}, not ${tab}`);
  }
  await go(p, 'home');
});

/* ------------------------------------------------------------------ shell (owner, 2 Oct 2026) */
/* Home and the chrome measured against Bizzing Bee's own numbers (tools/lib/shell-check.mjs, a
   byte-identical copy of Bizzing_Schedule's), with a child, desktop and phone, light and dark */
check('shell', 'the top bar, tabs, ☰ and Home measure as Bizzing Bee\'s — desktop and phone, light and dark', async ({ browser, base }) => {
  const { checkShell } = await import(require('url').pathToFileURL(path.join(__dirname, 'lib', 'shell-check.mjs')).href);
  const out = [];
  for (const dark of [false, true]) for (const phone of [false, true]) {
    const ctx = await browser.newContext({ viewport: phone ? { width: 390, height: 844 } : { width: 1280, height: 800 },
      isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 2 : 1, serviceWorkers: 'block' });
    const q = await ctx.newPage();
    await q.goto(base, { waitUntil: 'networkidle' }); await skipOnboarding(q);
    /* light with a new child's empty wallet, dark with a two-figure one: the coin chip must not move the search box */
    if (dark) await q.evaluate(() => { for (let i = 0; i < 8; i++) window.IND_WALLET.earn('india', window.BI.S.name, 'stop'); });
    await q.evaluate(() => window.BI.go('home'));
    if (dark) await q.evaluate(() => document.querySelector('[data-bz=theme]').click());
    await q.waitForTimeout(800);
    const f = await checkShell(q, { phone });
    const tag = (phone ? 'phone' : 'desktop') + (dark ? ' dark' : ' light');
    console.log('      checkShell ' + tag + ': ' + JSON.stringify(f));
    if (dark && !(await q.evaluate(() => document.documentElement.hasAttribute('data-bz-dark')))) f.push('dark mode does not set html[data-bz-dark]');
    f.forEach(x => out.push(tag + ': ' + x));
    await ctx.close();
  }
  if (out.length) throw new Error(out.join(' · '));
});

/* ------------------------------------------------------------------ settings (§5; Q4) */
check('settings', 'Settings in five sections in the family order; age band and daily target behind the PIN', async ({ p }) => {
  await openMenu(p); await tap(p, '[data-bz=drawer] [data-bz-dr="settings"]');
  const r = await p.evaluate(() => ({ secs: [...document.querySelectorAll('#main .setcard')].map(s => s.getAttribute('data-sec')),
    heads: [...document.querySelectorAll('#main .setcard h2')].map(h => h.textContent.trim()),
    head: !!document.querySelector('#main .sethead [data-act="back"]') && !!document.querySelector('#main .sethead [aria-label="Close settings"]'),
    max: getComputedStyle(document.querySelector('#main .setsheet')).maxWidth,
    controls: { fx: !!document.querySelector('[data-act="setfx"][role="switch"]'), music: !!document.querySelector('[data-act="setmusic"][role="switch"]'),
      vol: !!document.querySelector('input[type="range"][data-set="vol"]'), read: !!document.querySelector('[data-act="setread"]'),
      worlds: document.querySelectorAll('.setworld').length, theme: document.querySelectorAll('[data-act="settheme"]').length,
      text: document.querySelectorAll('[data-act="settext"]').length, motion: !!document.querySelector('[data-act="setmotion"]'),
      calm: !!document.querySelector('[data-act="setcalm"]') },
    foot: (document.querySelector('#main .setfoot') || {}).textContent || '',
    ageAbove: !!document.querySelector('#main [data-act="growage"], #main [data-act="goalset"]') }));
  if (JSON.stringify(r.secs) !== JSON.stringify(['me', 'sound', 'look', 'comfort', 'grown'])) throw new Error('the sections are ' + r.secs.join(' · '));
  if (!r.head) throw new Error('Settings has no [‹ Back] … [×] header');
  if (r.max !== '720px') throw new Error('the sheet is ' + r.max + ' wide, not 720px');
  const c = r.controls;
  if (!c.fx || !c.music || !c.vol || !c.read || !c.motion || !c.calm) throw new Error('a family control is missing: ' + JSON.stringify(c));
  if (c.worlds < 6 || c.theme !== 3 || c.text !== 3) throw new Error('Look is missing worlds, light/dark/device or S·M·L: ' + JSON.stringify(c));
  if (!/Privacy/.test(r.foot) || !/Build/.test(r.foot)) throw new Error('the footer lacks Privacy · About · version');
  if (r.ageAbove) throw new Error('the age band or the daily target is above the PIN');
  /* the home ring shows the target but cannot change it */
  await go(p, 'home');
  if (await p.$('#main [data-act="goalset"]')) throw new Error('the daily target can be changed from Home');
  /* behind the PIN they are there */
  await go(p, 'grown');
  for (const d of '13571357') { await p.keyboard.press(d); await p.waitForTimeout(40); }
  await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(400);
  const g = await p.evaluate(() => ({ age: document.querySelectorAll('#main [data-act="growage"]').length, goal: document.querySelectorAll('#main [data-act="goalset"]').length }));
  if (g.age !== 3 || g.goal !== 3) throw new Error('behind the PIN: ' + JSON.stringify(g));
  await tap(p, '#main [data-act="growage"][data-v="6"]');
  if ((await p.evaluate(() => window.BI.S.age)) !== 6) throw new Error('the age band did not change');
  /* the switches act: calm mode marks the page and stops the music */
  await go(p, 'settings'); await tap(p, '[data-act="setcalm"]');
  const calm = await p.evaluate(() => ({ attr: document.documentElement.getAttribute('data-calm'), music: window.IND_AUDIO.state.calm }));
  if (calm.attr !== '1' || !calm.music) throw new Error('Calm mode did not reach the page or the sound');
  await tap(p, '[data-act="settext"][data-v="L"]');
  if ((await p.evaluate(() => document.documentElement.getAttribute('data-text'))) !== 'L') throw new Error('text size did nothing');
});

/* ------------------------------------------------------------------ emoji (§9) */
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}\u{2B50}\u{2B55}\u{231A}-\u{23FF}]/u;
check('emoji', 'zero emoji inside controls, tabs, nav, headings and chips', async ({ p }) => {
  const bad = [];
  /* #/worlds and the map's chip were missed (audit, 3 Oct 2026: 13 🪙 prices on #/worlds, a 🪔 on
     the map) — because the screen was not on this list and a price is a .badge, a count a .pill */
  /* and the word rooms (v4: 🙏👪🍛 on 20 controls in Kosh and the Bhasha units) */
  for (const [v, a] of [['home'], ['map'], ['paath'], ['bhasha'], ['khel'], ['me'], ['shop'], ['collection'], ['settings'], ['medals'], ['search', 'goa'], ['worlds'],
                        ['kosh', 'hi'], ['kosh', 'ta'], ['pack', 'hi'], ['wordcard', 'hi:नमस्ते']]) {
    await go(p, v, a); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(200);
    await openMenu(p);
    const hits = await p.evaluate(src => {
      const re = new RegExp(src, 'u'), out = [];
      document.querySelectorAll('button, [role=tab], nav, h1, h2, h3, .chip, .pill, .badge').forEach(e => {
        const t = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('') + ' ' +
          [...e.querySelectorAll('span, b, i, em, small')].map(x => x.textContent).join(' ');
        if (re.test(t)) out.push((e.tagName + ' "' + e.textContent.trim().slice(0, 30) + '"'));
      });
      return out;
    }, EMOJI.source);
    await p.keyboard.press('Escape');
    hits.forEach(h => bad.push('#/' + v + ': ' + h));
  }
  if (bad.length) throw new Error(bad.length + ' emoji in controls: ' + [...new Set(bad)].slice(0, 6).join(' · '));
});

/* PAINTED WORLDS (audit U9/D3/D4, 3 Oct 2026): three of fifteen worlds had painted day and night
   plates and twelve were drawn shapes. Every world the child can choose has both, 1600 × 900,
   listed in the manifest the page reads, under the 420 KB a plate is allowed. */
check('plates', 'every world has a painted day and night plate, in the manifest, 1600 × 900, ≤ 420 KB, with a phone copy ≤ 120 KB', async ({ p }) => {
  const r = await p.evaluate(() => ({ list: ((window.IND_WORLDS || {}).list || []).map(w => w.id || w), bg: window.IND_WORLD_BG || [] }));
  if (r.list.length < 15) throw new Error('only ' + r.list.length + ' worlds');
  const bad = [];
  for (const id of r.list) for (const m of ['day', 'night']) {
    const f = path.join(APP, 'art', 'worlds', id + '-' + m + '.jpg');
    if (!fs.existsSync(f)) { bad.push(id + '-' + m + ' is not painted'); continue; }
    if (r.bg.indexOf(id + '-' + m) < 0) bad.push(id + '-' + m + ' is not in worlds-bg-manifest.js');
    const b = fs.readFileSync(f); let i = 2, w = 0, h = 0;
    while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const mk = b[i + 1]; if (mk >= 0xc0 && mk <= 0xc3) { h = b.readUInt16BE(i + 5); w = b.readUInt16BE(i + 7); break; } i += 2 + b.readUInt16BE(i + 2); }
    if (w !== 1600 || h !== 900) bad.push(`${id}-${m} is ${w}×${h}`);
    if (b.length > 420 * 1024) bad.push(`${id}-${m} is ${Math.round(b.length / 1024)} KB`);
    /* and its phone copy, no older than the plate (tools/gen-plate-sm.py) */
    const sm = path.join(APP, 'art', 'worlds', 'sm', id + '-' + m + '.jpg');
    if (!fs.existsSync(sm) || fs.statSync(sm).mtimeMs < fs.statSync(f).mtimeMs - 1000) bad.push(`${id}-${m} has no phone copy, or an older one — run python3 tools/gen-plate-sm.py`);
    else if (fs.statSync(sm).size > 120 * 1024) bad.push(`${id}-${m}'s phone copy is ${Math.round(fs.statSync(sm).size / 1024)} KB`);
    /* and the Worlds page's thumbnail of it (v4 D3/D4) */
    const th = path.join(APP, 'art', 'worlds', 'th', id + '-' + m + '.jpg');
    if (!fs.existsSync(th) || fs.statSync(th).mtimeMs < fs.statSync(sm).mtimeMs - 1000) bad.push(`${id}-${m} has no Worlds thumbnail, or an older one — run python3 tools/gen-plate-thumbs.py`);
    else if (fs.statSync(th).size > 40 * 1024) bad.push(`${id}-${m}'s thumbnail is ${Math.round(fs.statSync(th).size / 1024)} KB`);
  }
  /* THE WORLDS PAGE SHOWS THE PAINTINGS (v4: "flat vector insets of uneven size"): every world's
     card is its own plate, every one the same shape, and the picture of the mode on screen loads */
  for (const mode of ['day', 'night']) {
    await go(p, 'worlds'); await p.evaluate(m => document.documentElement.setAttribute('data-mode', m), mode);
    await p.evaluate(() => window.scrollTo(0, 99999)); await p.waitForTimeout(900); await p.evaluate(() => window.scrollTo(0, 0));
    const wv = await p.evaluate(() => [...document.querySelectorAll('#main .wpreview')].map(e => {
      const r = e.getBoundingClientRect(), im = [...e.querySelectorAll('img')].filter(i => getComputedStyle(i).display !== 'none');
      return { w: e.getAttribute('data-world'), plate: e.classList.contains('plate'), ratio: r.width / r.height,
               shown: im.map(i => i.getAttribute('src')), ok: im.length === 1 && im[0].complete && im[0].naturalWidth > 0 }; }));
    if (wv.length < r.list.length) bad.push(`#/worlds shows ${wv.length} thumbnails for ${r.list.length} worlds`);
    wv.filter(x => !x.plate).forEach(x => bad.push(`#/worlds: ${x.w} is a drawn inset, not its painting`));
    wv.filter(x => x.plate && Math.abs(x.ratio - 16 / 9) > 0.05).forEach(x => bad.push(`#/worlds: ${x.w} is ${x.ratio.toFixed(2)}:1, not 16:9`));
    wv.filter(x => x.plate && (!x.ok || !x.shown.every(s => s.indexOf('-' + mode + '.') > 0))).forEach(x => bad.push(`#/worlds (${mode}): ${x.w} shows ${x.shown.join(',') || 'no picture'}`));
  }
  await p.evaluate(() => document.documentElement.setAttribute('data-mode', 'day'));
  /* Home's plates are drawn from plate-size copies of the story paintings and banners
     (tools/gen-plate-thumbs.py): a painting with no copy would be a blank plate */
  for (const sub of ['story', 'banner']) {
    const dir = path.join(APP, 'art', sub);
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.jpg'))) {
      const sm = path.join(dir, 'sm', f);
      if (!fs.existsSync(sm) || fs.statSync(sm).mtimeMs < fs.statSync(path.join(dir, f)).mtimeMs - 1000) bad.push(`art/${sub}/${f} has no plate copy — run python3 tools/gen-plate-thumbs.py`);
    }
  }
  if (bad.length) throw new Error(bad.length + ': ' + bad.slice(0, 5).join('; '));
});

/* ------------------------------------------------------------------ avatars (§8) */
check('avatars', 'validate() is []: 96 in 12 × 8 at 2/3/2/1, all 80 kept, abouts, no sacred villain, every milestone measured', async ({ p }) => {
  const r = await p.evaluate(() => {
    const E = window.IND_AVATAR_ENGINE, C = window.IND_AVATARS, P = window.IND_AVATAR_PACKS;
    const villains = P.map((x, i) => /villain|demon|evil|baddie/i.test(x.name + ' ' + x.id) ? i + 1 : 0).filter(Boolean);
    return { errs: E.validate(C), sacred: E.sacredSafe(C, villains), villains: villains.length, n: C.length,
      ms: C.filter(a => a.tier === 'legendary').map(a => [a.id, !!(window.IND_LEGEND_MILESTONES[a.milestone.id] && window.IND_LEGEND_MILESTONES[a.milestone.id].ok)]),
      realNoAbout: C.filter(a => a.real && !(a.about && a.about.length > 20)).map(a => a.id),
      noArt: C.filter(a => !a.art).map(a => a.id), ids: C.map(a => a.id),
      prices: C.map(a => E.stateOf(a, { owned: [], worlds: [1, 2, 3, 4, 5, 6], milestones: [] })).filter(s => s.state === 'buy').map(s => s.price) };
  });
  if (r.errs.length) throw new Error('validate(): ' + r.errs.slice(0, 5).join(' · '));
  if (r.n !== 96) throw new Error(r.n + ' avatars');
  if (r.sacred.length) throw new Error(r.sacred.join(' · '));
  if (r.villains) throw new Error('a pack is named for villains');
  const unmeasured = r.ms.filter(x => !x[1]).map(x => x[0]);
  if (unmeasured.length) throw new Error('Legendaries whose milestone nothing measures: ' + unmeasured.join(', '));
  if (r.realNoAbout.length) throw new Error('real people with no about: ' + r.realNoAbout.join(', '));
  const kept = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', 'avatars-offered-2026-10-02.json'), 'utf8'));
  const lost = kept.filter(id => r.ids.indexOf(id) < 0);
  if (lost.length) throw new Error('offered before and gone now: ' + lost.join(', '));
  if (r.prices.some(x => [120, 250, 500].indexOf(x) < 0)) throw new Error('a card outside the tier prices: ' + [...new Set(r.prices)].join(','));
  /* the card files are real */
  const missing = r.ids.filter(id => !fs.existsSync(path.join(APP, 'art', id + '.png')) && !fs.existsSync(path.join(APP, 'art', 'av', id + '.webp')));
  if (missing.length) throw new Error('no art for ' + missing.join(', '));
});

/* ------------------------------------------------------------------ shop (§1, §1.1) */
check('shop', 'a Rare costs 120 through the wallet, a Legendary waits for its milestone, a world opens for 240, and the chip shows the history', async ({ p }) => {
  const who = await p.evaluate(() => window.BI.S.name);
  /* coins only through the standard events, as a child would earn them */
  await p.evaluate(who => { for (let d = 0; d < 9; d++) for (let i = 0; i < 20; i++) window.IND_WALLET.earn('india', who, 'stop', Date.now() - d * 864e5 - i); }, who);
  const bal0 = await p.evaluate(who => window.IND_WALLET.balance(who), who);
  if (bal0 !== 900) throw new Error('the wallet holds ' + bal0 + ' after nine days of the daily lid');
  await go(p, 'shop');
  const rare = await p.evaluate(() => { const a = window.IND_AVATARS.find(x => x.tier === 'rare' && x.pack <= 4); return a.id; });
  await p.evaluate(id => document.querySelector(`#main [data-act="buyav"][data-id="${id}"]`).click(), rare); await p.waitForTimeout(300);
  const after = await p.evaluate(([who, id]) => ({ bal: window.IND_WALLET.balance(who), own: window.BI.S.own.avatars.indexOf(id) >= 0,
    line: window.IND_WALLET.ledger(who).slice(-1)[0] }), [who, rare]);
  if (after.bal !== 780 || !after.own) throw new Error(`buying a Rare: balance ${after.bal}, owned ${after.own}`);
  if (after.line.why !== 'avatar:' + rare || after.line.n !== -120) throw new Error('the ledger line is ' + JSON.stringify(after.line));
  /* a Legendary waits for its learning, whatever the coins */
  const leg = await p.evaluate(() => { const a = window.IND_AVATARS.find(x => x.tier === 'legendary' && x.pack === 1);
    return { id: a.id, st: window.IND_ECONOMY.stateOf(window.BI.S, a.id) }; });
  if (leg.st.state !== 'milestone' || !/^First: /.test(leg.st.say)) throw new Error('a Legendary before its milestone says ' + JSON.stringify(leg.st));
  /* a locked world's card says how it opens; buying it costs exactly 240 */
  const w = await p.evaluate(() => window.IND_ECONOMY.worldSay(window.BI.S, 'diwali'));
  if (!/family plan|240/.test(w)) throw new Error('a locked world says "' + w + '"');
  await go(p, 'shop', 'worlds');
  await tap(p, '#main [data-act="buyworld"][data-w="diwali"]');
  const ww = await p.evaluate(who => ({ bal: window.IND_WALLET.balance(who), open: window.IND_ECONOMY.worldOpen(window.BI.S, 'diwali') }), who);
  if (ww.bal !== 540 || !ww.open) throw new Error('opening a world: ' + JSON.stringify(ww));
  /* the coin chip opens the history, written as words, with what coins are for */
  await tap(p, '[data-bz=coins]');
  const ws = await p.evaluate(() => { const s = document.querySelector('#walletsheet'); return s && { text: s.innerText, lines: s.querySelectorAll('.ws-list li').length }; });
  if (!ws) throw new Error('the coin chip does not open the wallet');
  if (ws.lines !== 30) throw new Error('the wallet shows ' + ws.lines + ' lines, not the last 30');
  if (!/opened the Diwali Nights world/.test(ws.text) || !/met /.test(ws.text) || !/earned only by learning/.test(ws.text))
    throw new Error('the wallet lines are not words: ' + ws.text.slice(0, 200));
  await p.keyboard.press('Escape');
  /* three kinds of thing to buy (K4) */
  await go(p, 'shop', 'extras');
  const ex = await p.evaluate(() => document.querySelectorAll('#main [data-act="buyextra"]').length);
  if (ex < 3) throw new Error('only ' + ex + ' extras');
});

/* BONUS MODES (owner, 4 Oct 2026: "coin-opened bonus modes"; v4 G9): a second way to play a game
   whose first way stays free and whole. Bought at its printed price through the one wallet, chosen
   — never drawn — and switched on and off in the game's own title card. The hard ladder really is
   harder; a Rangoli theme really changes the chalk. */
check('modes', 'a bonus mode costs its printed price, is chosen in the game, and does what it says; the free way stays', async ({ p }) => {
  const who = await p.evaluate(() => window.BI.S.name);
  await p.evaluate(who => { for (let d = 0; d < 4; d++) for (let i = 0; i < 20; i++) window.IND_WALLET.earn('india', who, 'stop', Date.now() - d * 864e5 - i); }, who);
  const X = await p.evaluate(() => window.IND_ECONOMY.EXTRAS.filter(x => x.kind === 'mode' || x.kind === 'theme').map(x => ({ id: x.id, game: x.game, price: x.price, kind: x.kind })));
  const games = await p.evaluate(async () => { if (window.IND_LOAD) await window.IND_LOAD(['games']); return (window.IND_GAMES || []).map(g => g.id); });
  if (!X.find(x => x.id === 'mode-gyanpati-hard') || X.filter(x => x.game === 'rangoli').length < 2) throw new Error('the hard ladder and the Rangoli themes are not on sale: ' + JSON.stringify(X));
  for (const x of X) if (!games.includes(x.game) || !(x.price > 0)) throw new Error(x.id + ' has no game or no printed price');
  /* a game with levels opens on the host's level chip (games spec §1.3): its Start mounts the engine */
  const startHost = async () => { await p.evaluate(() => { const s = document.querySelector('#gamehost [data-gmh="start"]'); if (s) s.click(); }); await p.waitForTimeout(500); };
  /* before buying: the free way, the classic ladder, and no picker */
  await go(p, 'game', 'gyanpati'); await p.waitForTimeout(500); await startHost();
  const free = await p.evaluate(() => ({ ways: !!document.querySelector('.gf-ways'), st: (document.getElementById('gamehost') || {}).__qzState }));
  if (free.ways) throw new Error('a picker of ways shows before anything is opened');
  if (!free.st || free.st.ladder !== 'classic' || free.st.bands.slice(0, 5).some(b => b !== 'easy')) throw new Error('the free ladder is not the classic one: ' + JSON.stringify(free.st && free.st.bands));
  /* buy it in the Shop, at the printed price */
  const bal0 = await p.evaluate(who => window.IND_WALLET.balance(who), who);
  await go(p, 'shop', 'extras');
  await p.evaluate(() => document.querySelector('#main [data-act="buyextra"][data-id="mode-gyanpati-hard"]').click()); await p.waitForTimeout(300);
  const bal1 = await p.evaluate(who => window.IND_WALLET.balance(who), who);
  const price = X.find(x => x.id === 'mode-gyanpati-hard').price;
  if (bal0 - bal1 !== price) throw new Error(`the hard ladder cost ${bal0 - bal1}, its price is ${price}`);
  /* in the game: the picker, and the hard ladder when chosen */
  await go(p, 'game', 'gyanpati'); await p.waitForTimeout(500); await startHost();
  const pick = await p.evaluate(() => [...document.querySelectorAll('.gf-ways [data-act="gameway"]')].map(b => b.getAttribute('data-id')));
  if (pick.length !== 2 || pick[0] !== '' || pick[1] !== 'mode-gyanpati-hard') throw new Error('the game does not offer the free way and the hard ladder: ' + JSON.stringify(pick));
  await p.evaluate(() => document.querySelector('.gf-ways [data-id="mode-gyanpati-hard"]').click()); await p.waitForTimeout(600); await startHost();
  const hard = await p.evaluate(() => (document.getElementById('gamehost') || {}).__qzState);
  if (!hard || hard.ladder !== 'hard' || hard.bands.includes('easy') || hard.bands.filter(b => b === 'hard').length < 10)
    throw new Error('the hard ladder is not hard: ' + JSON.stringify(hard && hard.bands));
  /* and back to the free way, one tap */
  await p.evaluate(() => document.querySelector('.gf-ways [data-id=""]').click()); await p.waitForTimeout(600); await startHost();
  const back = await p.evaluate(() => (document.getElementById('gamehost') || {}).__qzState);
  if (!back || back.ladder !== 'classic') throw new Error('the classic ladder did not come back');
  /* a Rangoli theme changes the chalk and the ground, and nothing else is needed to play */
  await go(p, 'shop', 'extras');
  await p.evaluate(() => document.querySelector('#main [data-act="buyextra"][data-id="theme-rangoli-kolam"]').click()); await p.waitForTimeout(300);
  await go(p, 'game', 'rangoli'); await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('.gf-ways [data-id="theme-rangoli-kolam"]').click()); await p.waitForTimeout(600); await startHost();
  const rg = await p.evaluate(() => { const w = document.querySelector('#gamehost .mela-wrap'); const cs = w && getComputedStyle(w);
    return { on: w && w.getAttribute('data-theme-rg'), c1: cs && cs.getPropertyValue('--rg1').trim(), ground: cs && cs.getPropertyValue('--rg-ground').trim() }; });
  if (rg.on !== 'theme-rangoli-kolam' || !rg.c1 || !rg.ground) throw new Error('the kolam theme did not reach the board: ' + JSON.stringify(rg));
});

/* ------------------------------------------------------------------ search (C4) */
check('search', 'one search finds a story, a state, an era, a word and a festival — and opens them', async ({ p }) => {
  /* the bar's own search box: type, Enter, and the results screen opens on it */
  await p.fill('[data-bz=search] input', 'Kerala'); await p.press('[data-bz=search] input', 'Enter');
  await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(400);
  if (!(await p.evaluate(() => /^#\/search\/Kerala/.test(location.hash) && !!document.querySelector('#sres .sres[data-v="state"]'))))
    throw new Error('the bar\'s search did not open the results for "Kerala": ' + (await p.evaluate(() => location.hash)));
  const probe = await p.evaluate(() => ({
    story: (window.IND_STORIES || [])[0], era: ((window.IND_ITIHAAS || {}).eras || [])[0],
    fest: ((window.IND_UTSAV || {}).festivals || [])[0], word: ((window.IND_PACKS.hi || {}).lexicon || [])[5] }));
  /* and by what a child actually types for history and verse (v4 C4): a dynasty, a person in
     an era, a verse collection */
  const want = [[probe.story.title, 'story'], ['Kerala', 'state'], [probe.era.title || probe.era.name, 'era'],
                [probe.word.word, 'wordcard'], [probe.fest.name, 'festival'],
                ['Maurya', 'era'], ['Chola', 'era'], ['Mughal', 'era'], ['Chanakya', 'era'], ['Thirukkural', 'verses'], ['Dhammapada', 'verses']];
  for (const [q, v] of want) {
    await p.fill('#sq', q); await p.waitForTimeout(250);
    const hit = await p.evaluate(v => !!document.querySelector(`#sres .sres[data-v="${v}"]`), v);
    if (!hit) throw new Error(`searching "${q}" found no ${v}`);
  }
  await p.fill('#sq', 'Kerala'); await p.waitForTimeout(200);
  await tap(p, '#sres .sres[data-v="state"]');
  await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(300);
  if (!(await p.evaluate(() => /^#\/state\//.test(location.hash)))) throw new Error('a result did not open its screen');
});

/* ------------------------------------------------------------------ music (§11) */
check('music', 'a loop for every world, Home and the games; lazy; off in Calm; ducks; paused when hidden', async ({ p, base }) => {
  /* a returning child's first screen, before any tap: no music bytes at all */
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  const first = await p.evaluate(() => !!window.IND_MUSIC || !![...document.scripts].find(s => /music\/engine/.test(s.src)));
  if (first) throw new Error('the music engine loaded before anything asked for it');
  await p.mouse.click(5, 300); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const M = window.IND_MUSIC;
    if (!M) return null;
    const worlds = window.IND_WORLDS.list.map(w => w.id);
    return { missing: worlds.concat(['home', 'games']).filter(id => !M.THEMES[id]),
      lens: Object.keys(M.THEMES).map(id => [id, M.length(id)]), playing: window.IND_AUDIO.playing(), level: window.IND_AUDIO.state };
  });
  if (!r) throw new Error('a tap on Home did not start the music');
  if (r.missing.length) throw new Error('no loop for ' + r.missing.join(', '));
  const off = r.lens.filter(x => x[1] < 60 || x[1] > 90);
  if (off.length) throw new Error('loops outside 60–90 s: ' + off.map(x => x[0] + ' ' + x[1].toFixed(1)).join(', '));
  if (r.playing !== 'home') throw new Error('Home plays ' + r.playing);
  await go(p, 'khel'); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(300);
  if ((await p.evaluate(() => window.IND_AUDIO.playing())) !== 'games') throw new Error('the Mela does not play the games loop');
  await go(p, 'map'); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(300);
  const wm = await p.evaluate(() => [window.IND_AUDIO.playing(), window.BI.S.world]);
  if (wm[0] !== wm[1]) throw new Error('the map plays ' + wm[0] + ' in the ' + wm[1] + ' world');
  /* ducking under the voice */
  await p.evaluate(() => window.IND_AUDIO.duck(true));
  const d = await p.evaluate(() => window.IND_AUDIO.ducked()); await p.evaluate(() => window.IND_AUDIO.duck(false));
  if (!d) throw new Error('the music does not duck');
  /* paused when the page is hidden */
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange')); });
  await p.waitForTimeout(300);
  const hid = await p.evaluate(() => ({ sus: window.IND_AUDIO.suspended(), attr: document.documentElement.hasAttribute('data-hidden') }));
  if (!hid.sus) throw new Error('the music kept playing in a hidden tab');
  if (!hid.attr) throw new Error('the page does not mark itself hidden for the animations');
  await p.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });
  /* off in Calm mode */
  await go(p, 'settings'); await tap(p, '[data-act="setcalm"]'); await p.waitForTimeout(300);
  if (await p.evaluate(() => window.IND_AUDIO.playing())) throw new Error('Calm mode left the music on');
  /* and the credits say where it comes from */
  const cr = fs.readFileSync(path.join(APP, 'music', 'CREDITS.md'), 'utf8');
  if (!/composed in code for Bizzing/i.test(cr)) throw new Error('music/CREDITS.md does not say how the music was made');
});

/* ------------------------------------------------------------------ siblings (C3) */
check('siblings', 'the avatar ▾ menu lists every child with their own face, and Add a child', async ({ p }) => {
  await p.evaluate(() => {
    const h = window.BI.Store.house(); h.order.push('k2'); h.next = 3; window.BI.Store.saveHouse(h);
    localStorage.setItem('bi_v1.k2', JSON.stringify({ schemaVersion: 3, name: 'Kabir', buddy: 'rocket', started: '2026-09-01', own: { avatars: [], worlds: [] }, lit: {}, read: {}, lang: {} }));
  });
  await tap(p, '[data-bz=kid]');
  const r = await p.evaluate(() => [...document.querySelectorAll('#kidmenu [data-act="switchkid"]')].map(b => ({ t: b.textContent, img: (b.querySelector('img') || {}).getAttribute ? b.querySelector('img').getAttribute('src') : '' })));
  if (r.length !== 2) throw new Error('the menu lists ' + r.length + ' children');
  if (!/Kabir/.test(r[1].t) || !/rocket/.test(r[1].img)) throw new Error('the second child is not shown with their own face: ' + JSON.stringify(r[1]));
  if (!(await p.$('#kidmenu [data-act="addkid"]'))) throw new Error('no Add a child');
  await p.keyboard.press('Escape');
  if (await p.$('#kidmenu')) throw new Error('Esc did not close the child menu');
});


/* ------------------------------------------------------------------ learning (E3, E6, F3, F4) */
check('teach', 'every Learn stop that used to say "open Bhasha" teaches here first', async ({ p }) => {
  await p.evaluate(() => window.IND_LOAD(['paath', 'bhasha', 'content', 'voice', 'map']));
  const r = await p.evaluate(() => {
    const out = [];
    window.IND_PAATH.courses.forEach(c => c.modules.forEach(m => m.lessons.forEach(l => {
      /* a Learn or Practise stop; a 'c' stop is the cold check, which is a test by design */
      if (!l.use || l.use.bh == null || l.k === 'c') return;
      const html = window.IND_PAATH_UI && window.IND_PAATH_UI.cards ? '' : '';
      out.push([c.id + '|' + m.id + '|' + l.n, l.n]);
    })));
    return out;
  });
  const bare = [];
  for (const [key] of r) {
    await p.evaluate(k => window.BI.go('paathl', k), key); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(120);
    /* walk the stop's cards to the one that used to redirect */
    let found = false;
    for (let i = 0; i < 8 && !found; i++) {
      found = await p.evaluate(() => !!document.querySelector('#main .teach'));
      if (!found) await p.evaluate(() => { const n = [...document.querySelectorAll('#main [data-pa]')].find(x => /next|start|begin|carry/i.test(x.textContent)); if (n) n.click(); });
      await p.waitForTimeout(120);
    }
    if (!found) { bare.push(key); continue; }
    const ok = await p.evaluate(() => { const t = document.querySelector('#main .teach'); return t.querySelectorAll('[data-act="say"]').length > 0 && /By the end of this stop/.test(t.innerText); });
    if (!ok) bare.push(key + ' (no sounds or goal)');
  }
  if (bare.length) throw new Error(bare.length + ' of ' + r.length + ' stops still only redirect: ' + bare.slice(0, 4).join(' · '));
});

check('mistakes', 'a missed word offers a hint that removes one wrong answer, and comes back in Words that slipped', async ({ p }) => {
  await go(p, 'pack', 'hi'); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(300);
  await p.evaluate(() => { const b = document.querySelector('.bh-next'); if (b) b.click(); }); await p.waitForTimeout(300);
  /* answer questions; miss the first multiple-choice one on purpose */
  let missed = false, hinted = null;
  for (let i = 0; i < 40; i++) {
    const st = await p.evaluate(() => {
      const opts = [...document.querySelectorAll('#main [data-act="ans"]')];
      return { opts: opts.length, hint: !!document.querySelector('#main [data-act="qhint"]'), next: !!document.querySelector('#main [data-act="qnext"]'),
        intro: !!document.querySelector('#main [data-act="gotit"]'), over: !!document.querySelector('#main .bh-done') };
    });
    if (st.over) break;
    if (st.hint && hinted === null) {
      const before = await p.evaluate(() => window.BI.quizState().q.answerIndex);
      await tap(p, '#main [data-act="qhint"]');
      hinted = await p.evaluate(a => { const g = document.querySelector('#main [data-gone="1"]'); return g ? (+g.getAttribute('data-i') === a ? 'RIGHT' : 'wrong') : 'none'; }, before);
    }
    if (st.next) { await tap(p, '#main [data-act="qnext"]'); continue; }
    if (st.opts) {
      await p.evaluate(miss => { const q = window.BI.quizState().q, a = q.answerIndex;
        const want = miss ? [...document.querySelectorAll('#main [data-act="ans"]')].map(b => +b.getAttribute('data-i')).find(i => i !== a && !document.querySelector('#main [data-act="ans"][data-i="' + i + '"][data-gone]')) : a;
        document.querySelector('#main [data-act="ans"][data-i="' + want + '"]').click(); }, !missed);
      missed = true; await p.waitForTimeout(1300); continue;
    }
    if (st.intro) { await tap(p, '#main [data-act="gotit"]'); continue; }
    /* a build or a trace question: let the engine answer it right, so the walk goes on */
    await p.evaluate(() => { const q = window.BI.quizState(); if (q.q) { q.pi++; } });
    await p.evaluate(() => { const B = window.BI; B.render(); }); await p.waitForTimeout(200);
  }
  if (!missed) throw new Error('no multiple-choice question to miss');
  if (hinted === null) throw new Error('the missed word came back without a hint');
  if (hinted !== 'wrong') throw new Error('the hint took away ' + hinted);
  /* a day later, the deck offers it back, and its session drills only what slipped */
  const deck = await p.evaluate(() => {
    const rec = window.BI.S.lang.hi, L = window.IND_BHASHA.slipped('hi', rec, Date.now() + 3 * 864e5);
    return L.map(x => x.key);
  });
  if (!deck.length) throw new Error('the slipped word is not in the deck');
  await p.evaluate(() => { const rec = window.BI.S.lang.hi; Object.values(rec.srs).forEach(c => { if (c.lapses) c.due = Date.now() - 1000; }); window.BI.quizState().q = null; });
  await go(p, 'home'); await go(p, 'pack', 'hi'); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(300);
  const card = await p.evaluate(() => { const c = document.querySelector('#main .slipped'); return c && { btn: !!c.querySelector('[data-act="slipped"]'), keys: (c.querySelector('[data-act="slipped"]') || { getAttribute() { return ''; } }).getAttribute('data-k') }; });
  if (!card) throw new Error('Words that slipped is not on the pack page');
  if (!card.btn) throw new Error('a due slipped word cannot be brought back');
  await tap(p, '#main [data-act="slipped"]');
  const plan = await p.evaluate(() => { const q = window.BI.quizState(); return { mode: q.mode, keys: [...new Set(q.plan.specs.map(s => s.key))] }; });
  const extra = plan.keys.filter(k => card.keys.split('|').indexOf(k) < 0);
  if (plan.mode !== 'slipped' || extra.length) throw new Error('the slipped session drilled other things: ' + JSON.stringify(plan));
});

/* ------------------------------------------------------------------ the rest of the v2 rows */
check('extras', 'saving for a Legendary on Home; the child on the map; certificates; painted covers; 512px art; nothing taken away', async ({ p, base }) => {
  await p.evaluate(() => window.IND_LOAD(['games']));
  await go(p, 'home');
  const goal = await p.evaluate(() => { const g = document.querySelector('#main [data-bz=home] .ind-save'); return g && g.innerText; });
  if (!goal || !/Saving for/i.test(goal) || !/500|240/.test(goal)) throw new Error('Home has nothing to save for: ' + goal);
  await go(p, 'map'); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(300);
  const pin = await p.evaluate(() => { const y = document.querySelector('#main .mapyou img'); return y && y.getAttribute('src'); });
  const bud = await p.evaluate(() => window.BI.S.buddy);
  if (!pin || pin.indexOf(bud) < 0) throw new Error('the child is not on the map: ' + pin);
  if (!(await p.$('#main .maplegend .sw-mist'))) throw new Error('the map legend does not say what a misty place is');
  /* certificates, made on the device from behind the PIN */
  await p.evaluate(() => { window.BI.S.medals = { story1: '2026-10-01' }; });
  await go(p, 'grown');
  for (const d of '13571357') { await p.keyboard.press(d); await p.waitForTimeout(40); }
  await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(400);
  const dl = p.waitForEvent('download', { timeout: 8000 }).catch(() => null);
  await tap(p, '#main [data-act="cert"]');
  const file = await dl;
  if (!file || !/\.png$/.test(file.suggestedFilename())) throw new Error('no certificate PNG was made');
  /* painted Mela covers, and the 96 as 512px WebP */
  const plates = await p.evaluate(() => window.IND_GAME_PLATES || []);
  const games = ['rangoli', 'statehunt', 'festival', 'jataka', 'saapsidi', 'ludo', 'kancha', 'pallanguzhi', 'gutte', 'carrom', 'gyanpati', 'triviamaster', 'shabd'];
  const nop = games.filter(g => plates.indexOf(g) < 0 || !fs.existsSync(path.join(APP, 'art', 'games', g + '.webp')));
  if (nop.length) throw new Error('games without a painted cover: ' + nop.join(', '));
  const ids = await p.evaluate(() => window.IND_AVATARS.map(a => a.id));
  const bad = ids.filter(id => { const f = path.join(APP, 'art', 'av', id + '.webp'); if (!fs.existsSync(f)) return true;
    const b = fs.readFileSync(f); const w = b.readUInt16LE(26) & 0x3fff; return b.toString('ascii', 12, 16) === 'VP8X' ? (1 + b.readUIntLE(24, 3)) !== 512 : false; });
  if (bad.length) throw new Error('avatars not as 512px WebP: ' + bad.slice(0, 5).join(', '));
  /* v2_to_v3: a child from before the 96 keeps every card and world they had */
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('bi_v1')); s.schemaVersion = 2; s.own = { avatars: [], packs: ['khel'], worlds: [] };
    s.buddy = 'pt_crow'; localStorage.setItem('bi_v1', JSON.stringify(s)); });
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  const g2 = await p.evaluate(() => { const S = window.BI.S, E = window.IND_ECONOMY;
    return { v: S.schemaVersion, krishna: E.avatarOpen(S, 'krishna'), crow: E.avatarOpen(S, 'pt_crow'), sachin: E.avatarOpen(S, 'sachin'),
      kurien: E.avatarOpen(S, 'kurien'), diwali: E.worldOpen(S, 'diwali') }; });
  if (g2.v !== 3 || !g2.krishna || !g2.crow || !g2.sachin || !g2.diwali) throw new Error('a returning child lost something: ' + JSON.stringify(g2));
  if (g2.kurien) throw new Error('the migration gave away a card the child never had');
});

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await browser.newContext({ viewport: c.vp || DESK, serviceWorkers: 'block' });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      await skipOnboarding(p);
      await p.waitForTimeout(300);
      await c.fn({ p, ctx, base, browser });
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
