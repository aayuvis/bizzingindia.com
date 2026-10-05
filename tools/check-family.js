#!/usr/bin/env node
/* Bizzing India — the family layer (FIX-INDIA O4, B7, O3, N4; family standard v2 §3, §5, §19).
   docs/25-family.md says why each one exists.

     topbar     the chrome is the family shell's (Bee's geometry is measured by check-standard
                `shell`): six tabs, ⬡ back to the Hive, nothing past 390px, ⬡ hidden in a drill
     household  two children: the second starts with nothing of the first's (stories, coins,
                map, Sabhyata), switching back finds the first exactly as left, a second child
                of the same name is refused, and removing one leaves the other whole
     activity   bizzing.activity gets whole ACTIVE minutes for the child playing, and a
                finished story writes a 'stop' milestone — through the family's own row shape
     seam       nothing outside the Store seam touches localStorage directly, a v1 profile is
                walked up, and a profile from a NEWER build is never stamped older
     collection Bee's Collection (owner, 5 Oct 2026): Medals · Avatars · Worlds as three tabs with
                their counts; twelve packs of eight, each naming its world, the app's own peacock
                first and free; every card carries
                exactly the one thing it can do — Wear, Wearing, its printed price, or nothing
                with the reason why; Wear by touch and by keys; ☰ Medals is the Medals tab;
                Print my cards prints only what is the child's own; nothing sideways on a phone
     dropins    the family's shared files in app/family/ (and tools/lib/shell-check.mjs) are
                byte for byte the ones recorded in tools/lib/family-dropins.json — and, where
                Bizzing_Schedule is checked out beside this repo, byte for byte its integration/

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

check('topbar', 'Bee\'s chrome from the family shell: 56px bar on a desk, 104px header on a phone, ⬡ back to the Hive, nothing wider than a phone; ⬡ hidden in a drill', async ({ p }) => {
  /* the geometry itself is held to Bee's numbers by checkShell in check-standard `shell`;
     this holds what is India's: the bar is the shell's, and the drill hides ⬡ */
  for (const vp of [DESK, PHONE]) {
    await p.setViewportSize(vp); await p.waitForTimeout(300);
    const m = await p.evaluate(() => {
      const bar = document.querySelector('[data-bz=bar]');
      const over = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth;
      const hd = document.querySelector('[data-bz=header]');
      return { h: bar ? bar.getBoundingClientRect().height : 0, hh: hd ? hd.getBoundingClientRect().height : 0, old: !!document.querySelector('.topbar, #drawer'),
        href: (document.querySelector('[data-bz=hive]') || {}).href || '', tabs: document.querySelectorAll('[data-bz=tab]').length, over };
    });
    /* Bee's numbers: a 56px bar on a desk; on a phone search drops under it and the header is 104 */
    if (vp.width >= 900 && Math.abs(m.h - 56) > 1) throw new Error(`at ${vp.width}px the bar is ${m.h}px, not 56`);
    if (vp.width < 900 && Math.abs(m.hh - 104) > 1) throw new Error(`at ${vp.width}px the header is ${m.hh}px, not Bee's 104`);
    if (m.old) throw new Error('the old top bar or drawer is still on the page beside the shell');
    if (m.tabs !== 6) throw new Error(m.tabs + ' tabs in the shell, not six');
    if (!/Bizzing_Schedule/.test(m.href)) throw new Error('⬡ does not go back to the Hive: ' + m.href);
    if (vp.width < 400 && m.over > 0) throw new Error(`the page is ${m.over}px wider than the 390px phone`);
  }
  /* a running drill hides ⬡ */
  await p.setViewportSize(DESK);
  /* the language groups load on demand: wait for them rather than guessing a time */
  await tap(p, '[data-bz=tab][data-v="bhasha"]'); await p.waitForSelector('[data-act="pack"][data-id="hi"]', { timeout: 20000 }).catch(() => {});
  await tap(p, '[data-act="pack"][data-id="hi"]'); await p.waitForSelector('.bh-next', { timeout: 20000 }).catch(() => {});
  await tap(p, '.bh-next'); await p.waitForTimeout(400);
  const vis = await p.evaluate(() => getComputedStyle(document.querySelector('[data-bz=hive]')).visibility);
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
  await tap(p, '[data-bz=kid]');
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

/* "Ensure clicking the top-right icon of the kid's avatar opens options like this" (owner,
   3 Oct, with Bee's menu): the children as big rows with their own faces and a tick on the one
   playing, a rule, then exactly My page — avatar, badges, collection · Settings · + Add a child
   (grown-ups). Read off the live menu on a desk and from a real tap on a phone. */
check('kidmenu', 'the avatar opens the family\'s menu: each child with a face and a tick, then My page, Settings, Add a child', async ({ p, ctx, base }) => {
  const seed = async (pg) => {
    await pg.evaluate(() => { const h = window.BI.Store.house(); if (h.order.indexOf('k2') < 0) { h.order.push('k2'); h.next = 3; window.BI.Store.saveHouse(h); }
      localStorage.setItem('bi_v1.k2', JSON.stringify({ schemaVersion: 3, name: 'Kabir', buddy: 'rocket', started: '2026-09-01', own: { avatars: [], worlds: [] }, lit: {}, read: {}, lang: {} })); });
    await pg.reload({ waitUntil: 'networkidle' }); await pg.waitForTimeout(500);
  };
  const read = (pg) => pg.evaluate(() => {
    const m = document.querySelector('#kidmenu .km-in'); if (!m) return null;
    const top = document.querySelector('[data-bz=kid] img'), r = m.getBoundingClientRect();
    return { kids: [...m.querySelectorAll('[data-act="switchkid"]')].map(b => ({ name: b.innerText.trim(), on: b.getAttribute('aria-checked') === 'true',
               tick: !!b.querySelector('.km-tick'), img: b.querySelector('img') ? b.querySelector('img').getAttribute('src') : '' })),
             lines: [...m.querySelectorAll('.km-row')].map(b => [b.innerText.replace(/\s+/g, ' ').trim(), b.getAttribute('data-act'), b.getAttribute('data-v')]),
             order: [...m.children].map(e => e.tagName === 'HR' ? 'rule' : e.classList.contains('km-kid') ? 'child' : 'line').join(' '),
             top: top ? top.getAttribute('src') : '', fits: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight };
  });
  const judge = (r, where) => {
    if (!r) throw new Error(where + ': the avatar opened nothing');
    if (r.order !== 'child child rule line line line') throw new Error(where + ': the menu reads ' + r.order);
    const on = r.kids.filter(k => k.on);
    if (on.length !== 1 || !on[0].tick || r.kids.some(k => !k.on && k.tick)) throw new Error(where + ': the tick is not on the one child playing — ' + JSON.stringify(r.kids));
    if (on[0].img !== r.top) throw new Error(where + `: the menu shows ${on[0].img} for the child the top bar shows as ${r.top}`);
    if (!/Kabir/.test(r.kids[1].name) || !/rocket/.test(r.kids[1].img)) throw new Error(where + ': the second child is not there with their own face');
    const want = [['My page — avatar, badges, collection', 'go', 'me'], ['Settings', 'go', 'settings'], ['+ Add a child grown-ups', 'addkid', null]];
    if (JSON.stringify(r.lines) !== JSON.stringify(want)) throw new Error(where + ': the lines are ' + JSON.stringify(r.lines));
    if (!r.fits) throw new Error(where + ': the menu runs off the screen');
  };
  await seed(p);
  await tap(p, '[data-bz=kid]');
  judge(await read(p), 'desk');
  /* every line goes where it says, and the menu closes behind it */
  for (const [v, h] of [['me', '#/me'], ['settings', '#/settings']]) {
    if (!(await p.$('#kidmenu'))) await tap(p, '[data-bz=kid]');
    await p.evaluate(v => document.querySelector('#kidmenu [data-v="' + v + '"]').click(), v);
    await p.waitForTimeout(500);
    const at = await p.evaluate(() => location.hash);
    if (at.indexOf(h) !== 0 || await p.$('#kidmenu')) throw new Error(`the ${v} line left the page at ${at}, menu ${await p.$('#kidmenu') ? 'still open' : 'closed'}`);
  }
  /* the child already playing: a tap just closes the menu, it never reloads */
  await tap(p, '[data-bz=kid]');
  await p.evaluate(() => { window.__still = 1; document.querySelector('#kidmenu .km-kid.on').click(); });
  await p.waitForTimeout(400);
  if (await p.$('#kidmenu')) throw new Error('tapping the child who is playing left the menu open');
  if (!(await p.evaluate(() => window.__still === 1))) throw new Error('tapping the child who is playing reloaded the page');
  /* a phone, a real tap */
  const pc = await ctx.browser().newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  try {
    const q = await pc.newPage();
    await q.goto(base, { waitUntil: 'networkidle' }); await skipOnboarding(q); await seed(q);
    await q.tap('[data-bz=kid]'); await q.waitForTimeout(400);
    judge(await read(q), 'phone');
  } finally { await pc.close(); }
});

/* THE SHELF IS NEVER BLANK (audit, 3 Oct 2026: "Night Collection: several avatar cards render
   blank until scrolled"). The cards drew 512px portraits at 96px, lazily — 3.3 MB arriving as the
   child scrolled, an empty frame until each came. Every card is drawn from its 192px copy
   (tools/gen-av-thumbs.py), all at once: at night, without a single scroll, every face is there. */
check('shelf', 'the Collection draws all 96 faces at once, from their small copies, without a scroll — at night too', async ({ p }) => {
  const AV = path.join(APP, 'art', 'av');
  const ids = fs.readdirSync(AV).filter(f => f.endsWith('.webp')).map(f => f.slice(0, -5));
  const miss = ids.filter(id => !fs.existsSync(path.join(AV, 'sm', id + '.webp')) ||
    fs.statSync(path.join(AV, 'sm', id + '.webp')).mtimeMs < fs.statSync(path.join(AV, id + '.webp')).mtimeMs - 1000);
  if (miss.length) throw new Error(`${miss.length} avatars have no small copy, or an older one (${miss.slice(0, 3).join(', ')}) — run python3 tools/gen-av-thumbs.py`);
  await p.click('[data-bz=theme]'); await p.waitForTimeout(300);
  /* WAIT ON THE PICTURES, NOT ON A CLOCK (v4: "34 of 96 blank at 1.5 s" when five suites ran
     side by side). The promise is "without a scroll": a face that waits for a scroll never
     arrives however long this waits, so waiting until every face has finished — or 12 s,
     on a machine with other work — holds the same promise without timing a busy disk. */
  await p.evaluate(() => window.BI.go('collection'));
  await p.waitForFunction(() => { const im = [...document.querySelectorAll('#main .bz-av-art img')];
    return im.length >= 90 && im.every(i => i.complete); }, null, { timeout: 12000, polling: 200 }).catch(() => {});
  const r = await p.evaluate(() => {
    const im = [...document.querySelectorAll('#main .bz-av-art img')];
    return { n: im.length, blank: im.filter(i => !i.complete || !i.naturalWidth).length,
             big: im.filter(i => i.naturalWidth > 256).length, night: document.documentElement.getAttribute('data-mode'), y: scrollY };
  });
  if (r.night !== 'night') throw new Error('could not switch to night');
  if (r.n < 90) throw new Error(`the Collection drew ${r.n} cards`);
  if (r.blank) throw new Error(`${r.blank} of ${r.n} cards are still blank, without a scroll, once the page has stopped loading them`);
  if (r.big) throw new Error(`${r.big} cards draw the full 512px portrait at 96px`);
});

/* ------------------------------------------------------------------ collection (owner, 5 Oct 2026) */
check('collection', 'Bee\'s Collection: three tabs with counts, 12 packs × 8 naming their world, one action per card, Wear by tap and by keys, Print my cards', async ({ p }) => {
  const look = () => p.evaluate(() => {
    const E = window.IND_ECONOMY, S = window.BI.S, A = window.IND_AVATARS;
    const tabs = [...document.querySelectorAll('#main .bz-colltab')].map(t => ({ t: t.textContent.trim(), on: t.classList.contains('on') }));
    const packs = [...document.querySelectorAll('#main .bz-pack')].map(pk => ({
      head: pk.querySelector('.bz-pack-h').textContent, n: (pk.querySelector('.bz-pack-n') || {}).textContent,
      cards: [...pk.querySelectorAll('.bz-av')].map(c => {
        const id = c.getAttribute('data-av'), st = E.stateOf(S, id);
        return { id, st: st.state, price: st.price, mine: S.buddy === id, say: (c.querySelector('.bz-av-say') || {}).textContent || '',
          wear: !!c.querySelector('.bz-av-btn[data-act=pick]'), on: !!c.querySelector('.bz-av-on'),
          buy: (c.querySelector('.bz-av-btn.buy') || {}).textContent || null, art: !!c.querySelector('.bz-av-art[data-act=go][data-v=avcard] img') };
      }) }));
    const over = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth;
    return { tabs, packs, over, total: A.length, owned: A.filter(a => E.avatarOpen(S, a.id)).length };
  });
  /* coins enough for one rare, so a card can be bought, and one card that cannot */
  await p.evaluate(() => window.BI.go('collection'));
  await p.waitForSelector('#main .bz-pack');
  let r = await look();
  const want = [/^Medals · \d+\/\d+$/, new RegExp('^Avatars · ' + r.owned + '/' + r.total + '$'), /^Worlds · \d+\/15$/];
  if (r.tabs.length !== 3 || !r.tabs.every((t, i) => want[i].test(t.t))) throw new Error('tabs: ' + JSON.stringify(r.tabs));
  if (!r.tabs[1].on) throw new Error('the Collection does not open on Avatars');
  if (r.packs.length !== 12) throw new Error(r.packs.length + ' packs');
  const bad = [];
  r.packs.forEach(pk => {
    if (pk.cards.length !== 8) bad.push(pk.head + ': ' + pk.cards.length + ' cards');
    if (!/\d\/8/.test(pk.n || '')) bad.push(pk.head + ': no n/8');
    if (!/Delhi 6|Madhubani|Diwali|Durga Pujo|Cricket|Antariksh/.test(pk.head)) bad.push(pk.head + ': names no world');
    pk.cards.forEach(c => {
      const acts = [c.wear, c.on, !!c.buy].filter(Boolean).length;
      if (!c.art) bad.push(c.id + ': the face does not open its card');
      if (c.st === 'owned' && (c.buy || acts !== 1)) bad.push(c.id + ': owned but ' + JSON.stringify(c));
      if (c.mine !== c.on) bad.push(c.id + ': Wearing says ' + c.on + ' for ' + (c.mine ? 'the' : 'not the') + ' face worn');
      if (c.st === 'buy' && (!c.buy || c.buy.trim() !== String(c.price))) bad.push(c.id + ': buy shows ' + c.buy + ', price ' + c.price);
      if ((c.st === 'world' || c.st === 'milestone') && (acts || !c.say.trim())) bad.push(c.id + ': locked, ' + JSON.stringify(c));
    });
  });
  /* the app's own peacock is a free avatar, first in the first pack (owner, 5 Oct 2026) */
  const first = r.packs[0].cards[0];
  if (!first || first.id !== 'mor' || first.st !== 'owned' || first.say.trim() !== 'Free for everyone')
    bad.push('the peacock is not the first, free card: ' + JSON.stringify(first));
  if (bad.length) throw new Error(bad.slice(0, 6).join(' · '));
  /* WEAR by touch: a common that is not worn */
  const pick = r.packs.flatMap(pk => pk.cards).filter(c => c.wear)[0];
  if (!pick) throw new Error('no card offers Wear');
  await p.evaluate(id => document.querySelector(`#main .bz-av[data-av="${id}"] .bz-av-btn[data-act=pick]`).dispatchEvent(new MouseEvent('click', { bubbles: true })), pick.id);
  await p.waitForTimeout(350);
  r = await look();
  const worn = r.packs.flatMap(pk => pk.cards).filter(c => c.on);
  if ((await S(p)).buddy !== pick.id || worn.length !== 1 || worn[0].id !== pick.id) throw new Error('Wear did not move Wearing to ' + pick.id + ': ' + worn.map(c => c.id));
  /* and by keys: Tab to another Wear button, Enter */
  const next = r.packs.flatMap(pk => pk.cards).filter(c => c.wear)[0];
  await p.focus(`#main .bz-av[data-av="${next.id}"] .bz-av-btn[data-act=pick]`); await p.keyboard.press('Enter'); await p.waitForTimeout(350);
  if ((await S(p)).buddy !== next.id) throw new Error('Enter on Wear did not wear ' + next.id);
  /* ☰ Medals opens the Medals tab, and its grid has no second title */
  await p.evaluate(() => window.BI.go('medals')); await p.waitForTimeout(300);
  const m = await p.evaluate(() => ({ on: (document.querySelector('#main .bz-colltab.on') || {}).textContent || '',
    cells: document.querySelectorAll('#main .mdcell').length, n: (window.IND_MEDALS || []).length,
    dup: [...document.querySelectorAll('#main .medalshelf h3')].length }));
  if (!/^Medals/.test(m.on.trim()) || !m.cells || m.dup) throw new Error('☰ Medals: ' + JSON.stringify(m));
  /* Print my cards: exactly the child's own, and on paper nothing of the app */
  await p.evaluate(() => window.BI.go('collection', 'avatars')); await p.waitForTimeout(250);
  await p.click('#main [data-v=avprint]'); await p.waitForTimeout(400);
  const own = (await look()).owned;
  await p.emulateMedia({ media: 'print' });
  const pr = await p.evaluate(() => ({ n: document.querySelectorAll('#main .avp').length,
    chrome: [...document.querySelectorAll('[data-bz=header], [data-bz=tabbar], #main .backlink')].filter(e => e.offsetParent !== null).length }));
  await p.emulateMedia({ media: 'screen' });
  if (pr.n !== own) throw new Error(`Print my cards drew ${pr.n} cards for ${own} owned`);
  if (pr.chrome) throw new Error(pr.chrome + ' pieces of the app print on the cards');
  /* a phone: nothing sideways, and each tab one line */
  await p.setViewportSize(PHONE); await p.evaluate(() => window.BI.go('collection')); await p.waitForTimeout(400);
  const ph = await p.evaluate(() => ({ over: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    tall: [...document.querySelectorAll('#main .bz-colltab')].map(t => t.getBoundingClientRect().height) }));
  if (ph.over > 1) throw new Error('the phone Collection scrolls sideways by ' + ph.over + 'px');
  if (ph.tall.some(h => h > 52)) throw new Error('a tab wraps on a phone: ' + ph.tall.join(', '));
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

/* ------------------------------------------------------------------ dropins (family standard §1, §6a) */
const crypto = require('crypto');
const DROPINS = require('./lib/family-dropins.json');
check('dropins', 'the family\'s shared files are its own, byte for byte', async () => {
  const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
  const here = f => (f === 'shell-check.mjs' ? path.join(__dirname, 'lib', f) : path.join(APP, 'family', f));
  const theirs = process.env.BIZZING_SCHEDULE || path.join(__dirname, '..', '..', 'Bizzing_Schedule');
  const bad = [];
  /* every family file in app/family/ is on the list: a new drop-in cannot arrive unrecorded */
  fs.readdirSync(path.join(APP, 'family')).filter(f => /^bizzing-/.test(f)).forEach(f => { if (!DROPINS[f]) bad.push(f + ' is not in family-dropins.json'); });
  for (const f of Object.keys(DROPINS)) {
    if (!fs.existsSync(here(f))) { bad.push(f + ' is missing'); continue; }
    if (sha(here(f)) !== DROPINS[f]) bad.push(f + ' was edited here');
    const t = path.join(theirs, 'integration', f);
    if (fs.existsSync(t) && sha(t) !== DROPINS[f]) bad.push(f + ' is not Bizzing_Schedule\'s current copy — copy it again');
  }
  if (bad.length) throw new Error(bad.join(' · '));
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
