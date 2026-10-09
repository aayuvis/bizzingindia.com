#!/usr/bin/env node
/* Bizzing India — Panchang, the festival-year wheel (games spec §4.4, §8 T12; docs/32).

     register   the IND_GAMES entry is docs/32's — and review: true (the year's windows and the
                Kyon? lines go to the named reviewer, spec §7), opened to every child by the owner
                before review (9 Oct 2026) with `open` — the host's page says so (check-games owner-open)
     P2         every festival the game shows is a data-utsav.js entry, and the window it marks
                right is exactly that entry's months[] — nothing typed. REPORTS what is blocked:
                data-utsav carries no sources[] and no dated year
     P1         a random placer (seeded) scores under 15% at L1, and every L1 round's own odds
                (its windows over twelve) are under 15% — the round builder holds the line
     P3         the Eid drift test — runs only if the data holds dated years for Eid; until then
                L3 must say it is coming, ask nothing and report nothing (asked 0)
     P4         equal weight: every festival card the same size, colour and type; the first card
                changes from round to round; no "biggest" anywhere in the engine
     holds      a month outside the window holds: "Not quite.", the window shown, no new card
                for 3 s, a second tap is not a second answer, Enter is Aage; no right/wrong sound
                from the engine
     keyboard   a whole L1 round with the arrows and Enter alone; L4 with the number keys
     drag       a card dragged onto its month is placed there
     touch      on a touch phone a tap on a month places the card
     mera       L5 is never scored: picks, Done, no answer(), score 0, nothing written to storage
     phone      390 × 844: the wheel, the card and Aage above the tab bar; nothing sideways; ≥ 44 px
     night      the prompt and the miss card read at ≥ 4.5:1 in day and in night
     clock      a right answer's beat does not run while the tab is hidden
     copy       no streak copy, no "biggest"/"main festival" in the engine

   Run:  CHROME=/opt/pw-browsers/chromium NODE_PATH=…/node_modules node tools/check-panchang.js [--only P1] [--shots DIR]
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');

const APP = path.join(__dirname, '..', 'app');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(APP, p);
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404).end('no'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  const port = +(process.env.PORT || 0);
  return new Promise(r => s.listen(port, '127.0.0.1', () => r(s)));
}

const DESK = { width: 1280, height: 800 }, PHONE = { width: 390, height: 844 };
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
const shotDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;

const PAGE_HELPERS = () => {
  window.__mount = function (o) {
    if (window.__td) { try { window.__td(); } catch (e) {} window.__td = null; }
    const old = document.querySelector('#gamehost');
    const h = document.createElement('div'); h.id = 'gamehost';
    if (old) old.replaceWith(h); else document.querySelector('#main').appendChild(h);
    const rec = window.__rec = { answers: [], done: null };
    const g = window.IND_GAMES.filter(x => x.id === 'panchang')[0];
    window.__td = g.engine(h, Object.assign({ level: 1, band: '8-10', scope: null, calm: false, reduced: false, skin: null, tester: true,
      answer: r => rec.answers.push(r) }, o || {}), r => { rec.done = r; });
  };
  const MONTHS = [];
  for (let i = 0; i < 12; i++) MONTHS.push(new Date(2001, i, 15).toLocaleString('en-GB', { month: 'long' }));
  window.__fest = function (id) { return window.IND_UTSAV.festivals.filter(f => f.id === id)[0]; };
  window.__win = function (f) { return (f.months || []).map(m => MONTHS.indexOf(m)).filter(i => i >= 0); };
  /* the card on the wheel, read the way a child reads it: by its name */
  window.__card = function () {
    const n = document.querySelector('.pc-card .pc-fname'); if (!n) return null;
    return window.IND_UTSAV.festivals.filter(f => f.name === n.textContent)[0] || null;
  };
  window.__sec = function (m) { return document.querySelector('.pc-m[data-m="' + m + '"]'); };
  window.__secPt = function (m) {
    const svg = document.querySelector('.pc-wheel'), r = svg.getBoundingClientRect(), s = r.width / 400;
    const a = (-90 + 30 * m) * Math.PI / 180, R = 158;
    return { x: r.left + (200 + R * Math.cos(a)) * s, y: r.top + (200 + R * Math.sin(a)) * s };
  };
};

async function boot(p, base) {
  await p.goto(base + '?tester=1', { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  await p.evaluate(() => window.IND_LOAD(['map', 'content', 'games']));
  await p.waitForFunction(() => (window.IND_GAMES || []).some(g => g.id === 'panchang') && window.IND_UTSAV, null, { timeout: 30000 });
  await p.evaluate(() => window.BI.go('game', 'panchang')).catch(() => {});
  await p.waitForTimeout(500);
  await p.evaluate(PAGE_HELPERS);
}
const mount = (p, o) => p.evaluate(o => window.__mount(o), o || {});
const rec = p => p.evaluate(() => window.__rec);
const aage = p => p.evaluate(() => { const b = document.querySelector('#gamehost .gm-aage'); if (b) b.click(); });
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

check('register', 'the IND_GAMES entry is docs/32’s, review: true, opened by the owner (9 Oct 2026)', async ({ p }) => {
  const g = await p.evaluate(() => { const g = window.IND_GAMES.filter(x => x.id === 'panchang')[0]; return g && Object.assign({}, g, { engine: typeof g.engine }); });
  if (!g) throw new Error('panchang is not registered');
  const bad = [];
  if (g.name !== 'Panchang') bad.push('name'); if (g.sub !== 'turn the festival year') bad.push('sub');
  if (g.teaches !== true) bad.push('teaches'); if (g.review !== true) bad.push('review (the spec sends it to the reviewer)');
  if (!g.open || g.open.by !== 'owner' || g.open.to !== 'everyone' || !g.open.on || !g.open.why) bad.push('open (the owner\'s decision, recorded)');
  if (!Array.isArray(g.levels) || g.levels.length !== 5) bad.push('levels'); if (g.engine !== 'function') bad.push('engine');
  if (bad.length) throw new Error('wrong fields: ' + bad.join(', '));
});

check('P2', 'every festival shown is data-utsav’s, and the window marked right is its own months[]', async ({ p }) => {
  const seen = new Set();
  for (const level of [1, 2]) for (let round = 0; round < 4; round++) {
    await mount(p, { level });
    for (let i = 0; i < 12 && !(await rec(p)).done; i++) {
      const r = await p.evaluate(() => {
        const f = window.__card(); if (!f) return { none: document.querySelector('.pc-card .pc-fname') && document.querySelector('.pc-card .pc-fname').textContent };
        const w = window.__win(f);
        /* place it at its window's first month, then read which sectors the engine marked */
        window.__sec(w[0]).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
        const marked = [...document.querySelectorAll('.pc-m.pc-win')].map(e => +e.getAttribute('data-m')).sort((a, b) => a - b);
        return { id: f.id, w: w.slice().sort((a, b) => a - b), marked, months: f.months };
      });
      if (r.none) throw new Error('a card names a festival data-utsav.js does not hold: ' + r.none);
      if (!r.w.length) throw new Error(r.id + ' has no window in data-utsav.js');
      if (JSON.stringify(r.w) !== JSON.stringify(r.marked)) throw new Error(r.id + ': the wheel marked ' + r.marked + ' but its months[] are ' + r.months);
      seen.add(r.id);
      await aage(p);
    }
  }
  const last = await rec(p);
  if (last.answers.some(a => !a.right)) throw new Error('a placement inside its own window was marked wrong');
  const blocked = await p.evaluate(() => window.IND_UTSAV.festivals.filter(f => f.sources && f.sources.length).length);
  console.log(`         ${seen.size} festivals checked against months[]. BLOCKED ON DATA: ${blocked} of ${await p.evaluate(() => window.IND_UTSAV.festivals.length)} entries carry sources[]; no entry carries a dated year`);
});

check('P1', 'a random placer scores under 15% at L1, and every round’s own odds are under 15%', async ({ p }) => {
  /* The hard guarantee is each round's own odds (its windows over twelve), asserted below for
     every round. The played total is a second look, made reproducible: the bot AND the deck are
     seeded, so a pass here is the same pass every run rather than a lucky draw. */
  const R = rng(4242);
  await p.evaluate(() => { let s = 77; Math.random = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; });
  let asked = 0, right = 0, worst = 0;
  for (let round = 0; round < 40; round++) {
    await mount(p, { level: 1 });
    for (let i = 0; i < 12 && !(await rec(p)).done; i++) {
      const m = Math.floor(R() * 12);
      await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), m);
      await aage(p);
    }
    const r = await rec(p);
    if (!r.done) throw new Error('a round did not finish');
    asked += r.done.asked; right += r.done.firstTryRight;
    const odds = await p.evaluate(ids => ids.map(id => window.__win(window.__fest(id.split(':')[1])).length / 12), r.answers.map(a => a.id));
    const mean = odds.reduce((a, b) => a + b, 0) / odds.length;
    worst = Math.max(worst, mean);
    if (mean >= 0.15) throw new Error(`round ${round}: a random placer's odds are ${(mean * 100).toFixed(1)}%`);
  }
  const pct = right / asked;
  console.log(`         random placer: ${right}/${asked} = ${(pct * 100).toFixed(1)}%; the worst round's odds ${(worst * 100).toFixed(1)}%`);
  if (pct >= 0.15) throw new Error(`a random placer scored ${(pct * 100).toFixed(1)}%`);
});

check('P3', 'the Eid drift — only if the data holds dated years; until then L3 asks and reports nothing', async ({ p }) => {
  const d = await p.evaluate(() => {
    const e = window.IND_UTSAV.festivals.filter(f => /eid/i.test(f.id))[0];
    return { eid: !!e, dated: !!(e && (e.dates || e.years)), months: e && e.months.length };
  });
  if (d.dated) throw new Error('the data now holds dated years for Eid — build the drift test (P3) and score L3');
  console.log(`         BLOCKED ON DATA: Eid's entry holds ${d.months} months and no dated year — the drift cannot be shown honestly`);
  await mount(p, { level: 3 });
  const t = await p.evaluate(() => document.querySelector('#gamehost').innerText);
  if (!/coming/i.test(t) || !/never types a festival date/i.test(t)) throw new Error('L3 does not say it is coming and why');
  await p.keyboard.press('Enter');
  const r = await rec(p);
  if (r.answers.length) throw new Error('L3 reported an answer');
  if (!r.done || r.done.asked !== 0 || r.done.score !== 0) throw new Error('L3 finished as ' + JSON.stringify(r.done));
});

check('P4', 'every festival card the same size, colour and type; no default first; no "biggest"', async ({ p }) => {
  const firsts = { kyon: new Set(), mera: new Set(), kab: new Set() };
  for (let i = 0; i < 6; i++) {
    for (const [level, sel, key] of [[4, '.pc-opt', 'kyon'], [5, '.pc-chip', 'mera']]) {
      await mount(p, { level });
      const r = await p.evaluate(sel => {
        const els = [...document.querySelectorAll(sel)];
        const sig = els.map(e => { const c = getComputedStyle(e), b = e.getBoundingClientRect();
          return [Math.round(b.width), Math.round(b.height), c.backgroundColor, c.color, c.fontSize, c.fontWeight, c.fontFamily, c.borderColor, c.opacity].join('|'); });
        return { n: els.length, kinds: [...new Set(sig)], first: els[0] && els[0].textContent };
      }, sel);
      if (r.n < 4) throw new Error(key + ': only ' + r.n + ' cards');
      if (r.kinds.length !== 1) throw new Error(key + ': the cards differ: ' + r.kinds.slice(0, 2).join('  vs  '));
      firsts[key].add(r.first);
    }
    await mount(p, { level: 1 });
    firsts.kab.add(await p.evaluate(() => document.querySelector('.pc-card .pc-fname').textContent));
  }
  for (const k of Object.keys(firsts)) if (firsts[k].size < 2) throw new Error(k + ': the same festival comes first every time: ' + [...firsts[k]]);
  const s = fs.readFileSync(path.join(APP, 'games-panchang.js'), 'utf8').replace(/^\s*\/\*[\s\S]*?\*\//m, '');
  const m = s.replace(/never "the biggest festival"/gi, '').match(/biggest|main festival|most important|greatest festival/i);
  if (m) throw new Error('ranking copy in the engine: ' + m[0]);
});

check('holds', 'a month outside the window holds with the miss card until Aage; no right/wrong from the engine', async ({ p }) => {
  await p.evaluate(() => { window.IND_SFX && (window.IND_SFX.played.length = 0); });
  await mount(p, { level: 1 });
  const f = await p.evaluate(() => { const f = window.__card(); return { id: f.id, w: window.__win(f) }; });
  const wrong = [...Array(12).keys()].find(m => !f.w.includes(m));
  await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), wrong);
  const m = await p.evaluate(w => {
    const miss = document.querySelector('#gamehost .gm-miss');
    return { text: miss ? miss.textContent : '', ans: !!document.querySelector('.gm-miss .gm-ans'), teach: !!document.querySelector('.gm-miss .gm-teach'),
      aage: !!document.querySelector('.gm-miss .gm-aage[data-gm="aage"]'), grey: window.__sec(w).classList.contains('pc-no'),
      win: [...document.querySelectorAll('.pc-m.pc-win')].length };
  }, wrong);
  if (!/Not quite\./.test(m.text) || !m.ans || !m.teach || !m.aage) throw new Error('no full miss card: ' + JSON.stringify(m));
  if (!m.grey || m.win !== f.w.length) throw new Error('the miss does not show the pick grey and the window warm');
  await p.waitForTimeout(3000);
  await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), f.w[0]);
  const still = await p.evaluate(() => window.__card().id);
  const r = await rec(p);
  if (still !== f.id || !(await p.$('#gamehost .gm-miss'))) throw new Error('the miss did not hold');
  if (r.answers.length !== 1 || r.answers[0].right || r.answers[0].skill !== 'panchang.when') throw new Error('answers: ' + JSON.stringify(r.answers));
  await p.keyboard.press('Enter');
  if ((await p.evaluate(() => window.__rec.answers.length)) !== 1 || (await p.$('#gamehost .gm-miss'))) throw new Error('Enter did not press Aage');
  const played = await p.evaluate(() => (window.IND_SFX ? window.IND_SFX.played : []).filter(k => k === 'right' || k === 'wrong'));
  if (played.length) throw new Error('the engine played ' + played.join(', '));
});

check('keyboard', 'a whole L1 round with the arrows and Enter alone; L4 with the number keys', async ({ p }) => {
  await mount(p, { level: 1 });
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  for (let i = 0; i < 12 && !(await rec(p)).done; i++) {
    const w = await p.evaluate(() => window.__win(window.__card()));
    for (let s = 0; s < 13; s++) {
      const f = await p.evaluate(() => { const e = document.querySelector('.pc-m.pc-focus'); return e ? +e.getAttribute('data-m') : -1; });
      if (w.includes(f)) break;
      await p.keyboard.press('ArrowRight');
    }
    await p.keyboard.press('Enter'); await p.waitForTimeout(20);
    await p.keyboard.press('Enter'); await p.waitForTimeout(20);
  }
  const r = await rec(p);
  if (!r.done || r.done.firstTryRight !== r.done.asked || r.done.asked < 8) throw new Error('keyboard round: ' + JSON.stringify(r.done));
  await mount(p, { level: 4 });
  for (let i = 0; i < 12 && !(await rec(p)).done; i++) {
    const k = await p.evaluate(() => {
      const q = document.querySelector('.pc-quote').textContent;
      const f = window.IND_UTSAV.festivals.filter(f => f.kid && f.kid.indexOf(q) === 0)[0];
      const o = [...document.querySelectorAll('.pc-opt')].map(b => b.getAttribute('data-id'));
      return o.indexOf(f.id) + 1;
    });
    await p.keyboard.press(String(k)); await p.waitForTimeout(20);
    await p.keyboard.press('Enter'); await p.waitForTimeout(20);
  }
  const r4 = await rec(p);
  if (!r4.done || r4.done.firstTryRight !== r4.done.asked || r4.answers.some(a => a.skill !== 'panchang.why')) throw new Error('L4 by number keys: ' + JSON.stringify(r4.done));
});

check('drag', 'a card dragged onto its month is placed there', async ({ p }) => {
  await mount(p, { level: 1 });
  const w = await p.evaluate(() => window.__win(window.__card()));
  const c = await (await p.$('.pc-card')).boundingBox();
  const to = await p.evaluate(m => window.__secPt(m), w[0]);
  await p.mouse.move(c.x + c.width / 2, c.y + c.height / 2); await p.mouse.down();
  await p.mouse.move(c.x + c.width / 2 + 20, c.y + c.height / 2 + 5, { steps: 3 });
  await p.mouse.move(to.x, to.y, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(60);
  const r = await rec(p);
  if (r.answers.length !== 1 || !r.answers[0].right) throw new Error('the drag did not place the card in its month: ' + JSON.stringify(r.answers));
  if (await p.$('.pc-ghost')) throw new Error('the drag ghost was left behind');
});

check('touch', 'on a touch phone a tap on a month places the card', async ({ browser, base }) => {
  const ctx = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  try {
    await boot(p, base); await mount(p, { level: 1 });
    const w = await p.evaluate(() => window.__win(window.__card()));
    const pt = await p.evaluate(m => window.__secPt(m), w[0]);
    await p.touchscreen.tap(pt.x, pt.y); await p.waitForTimeout(60);
    const r = await rec(p);
    if (r.answers.length !== 1 || !r.answers[0].right) throw new Error('a touch on the month did not place it: ' + JSON.stringify(r.answers));
  } finally { await ctx.close(); }
});

check('mera', 'L5 is never scored, pays nothing and stores nothing', async ({ p }) => {
  const k0 = await p.evaluate(() => Object.keys(localStorage).sort().join(','));
  await mount(p, { level: 5 });
  await p.evaluate(() => [...document.querySelectorAll('.pc-chip')].slice(0, 4).forEach(b => b.click()));
  const t = await p.evaluate(() => ({ pressed: document.querySelectorAll('.pc-chip[aria-pressed="true"]').length, ask: /ask your family/i.test(document.querySelector('#gamehost').innerText),
    lit: document.querySelectorAll('.pc-m.pc-win').length }));
  if (t.pressed !== 4 || !t.ask || !t.lit) throw new Error('Mera saal did not take the picks or say "ask your family": ' + JSON.stringify(t));
  await p.evaluate(() => document.querySelector('.pc-done').click());
  const r = await rec(p);
  if (r.answers.length) throw new Error('Mera saal reported answers');
  if (!r.done || r.done.score !== 0 || r.done.asked !== 0) throw new Error('Mera saal finished as ' + JSON.stringify(r.done));
  const k1 = await p.evaluate(() => Object.keys(localStorage).sort().join(','));
  const v = await p.evaluate(() => Object.keys(localStorage).filter(k => /panchang|mera/i.test(k) || /lohri|diwali|pongal|eid-ul|christmas/i.test(localStorage.getItem(k) || '')));
  if (v.length) throw new Error('a family’s festivals were written to storage: ' + v.join(','));
  if (k0 !== k1 && /panchang/i.test(k1)) throw new Error('new storage keys: ' + k1);
});

check('phone', '390 × 844: the wheel, the card and Aage above the tab bar; nothing sideways; ≥ 44 px', async ({ browser, base }) => {
  const ctx = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  try {
    await boot(p, base);
    for (const level of [1, 4, 5]) {
      await mount(p, { level }); await p.waitForTimeout(200);
      if (level === 1) {
        const w = await p.evaluate(() => window.__win(window.__card()));
        const wrong = [...Array(12).keys()].find(m => !w.includes(m));
        await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), wrong);
      }
      if (level === 4) await p.evaluate(() => document.querySelector('.pc-opt').click());
      const m = await p.evaluate(level => {
        const bar = document.querySelector('[data-bz=tabbar]'), barTop = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
        const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: b.top, b: b.bottom }; };
        const small = [...document.querySelectorAll('#gamehost button')].filter(b => { const x = b.getBoundingClientRect(); return x.width && (x.width < 44 || x.height < 44); }).map(b => b.className);
        const need = level === 1 ? ['.pc-wheel', '.pc-card', '#gamehost .gm-aage', '.pc-q'] : level === 4 ? ['.pc-quote', '.pc-opts', '#gamehost .gm-aage'] : ['.pc-q', '.pc-chips', '.pc-done'];
        return { barTop, need: need.map(s => [s, r(s)]), small, over: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth };
      }, level);
      if (m.over > 0) throw new Error(`L${level}: the page is ${m.over}px wider than the phone`);
      for (const [s, b] of m.need) {
        if (!b) throw new Error(`L${level}: no ${s}`);
        if (b.t < 0 || b.b > m.barTop + 0.5) throw new Error(`L${level}: ${s} is off-screen or under the tab bar (${Math.round(b.t)}–${Math.round(b.b)}, bar ${Math.round(m.barTop)})`);
      }
      if (m.small.length) throw new Error(`L${level}: targets under 44 px: ` + m.small.join(', '));
      if (shotDir) await p.screenshot({ path: path.join(shotDir, `panchang-phone-L${level}.png`) });
    }
  } finally { await ctx.close(); }
});

function lum(c) {
  const m = String(c).match(/[\d.]+/g).map(Number);
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
}
check('night', 'the prompt, the card and the miss card read at ≥ 4.5:1, day and night', async ({ p }) => {
  for (const night of [false, true]) {
    await p.evaluate(n => { if (n) document.documentElement.setAttribute('data-mode', 'night'); else document.documentElement.removeAttribute('data-mode'); }, night);
    await mount(p, { level: 1 });
    const w = await p.evaluate(() => window.__win(window.__card()));
    await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), [...Array(12).keys()].find(m => !w.includes(m)));
    await p.waitForTimeout(250);
    const cs = await p.evaluate(() => {
      const g = (s, prop) => { const e = document.querySelector(s); return e ? getComputedStyle(e)[prop] : null; };
      return [[g('.pc-q', 'color'), g('.pc-ask', 'backgroundColor')], [g('.pc-fname', 'color'), g('.pc-card', 'backgroundColor')],
        [g('.pc-fb .gm-ans', 'color'), g('.pc-fb .gm-miss', 'backgroundColor')]]
        /* every month's label on its own segment, in the state the miss left it (lit window, the
           wrong month, plain) — not just January's: a lit window anywhere must stay readable */
        .concat([...document.querySelectorAll('.pc-m')].map(m => {
          /* a translucent segment is seen over the rim: measure the colour on screen, not the raw fill */
          const c = s => (s.match(/[\d.]+/g) || []).map(Number), cs = getComputedStyle(m), op = +cs.fillOpacity;
          const f = c(cs.fill), r = c(getComputedStyle(document.querySelector('.pc-rim')).fill);
          const seen = f.slice(0, 3).map((v, i) => Math.round(v * op + r[i] * (1 - op)));
          return [getComputedStyle(m.nextElementSibling).fill, 'rgb(' + seen.join(', ') + ')'];
        }));
    });
    for (const [fg, bg] of cs) {
      if (!fg || !bg) throw new Error('missing element for contrast');
      const a = lum(fg), b = lum(bg), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      if (ratio < 4.5) throw new Error(`${night ? 'night' : 'day'}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
    }
    if (shotDir) await p.screenshot({ path: path.join(shotDir, `panchang-desk-${night ? 'night' : 'day'}.png`) });
  }
  for (const level of [4, 5]) {
    await mount(p, { level }); await p.waitForTimeout(200);
    if (shotDir) await p.screenshot({ path: path.join(shotDir, `panchang-desk-L${level}.png`) });
  }
  await p.evaluate(() => document.documentElement.removeAttribute('data-mode'));
});

check('clock', 'a right answer’s beat does not run while the tab is hidden', async ({ p }) => {
  await mount(p, { level: 1 });
  const w = await p.evaluate(() => window.__win(window.__card()));
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  const c0 = await p.evaluate(() => window.__card().id);
  await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), w[0]);
  await p.waitForTimeout(3200);
  const c1 = await p.evaluate(() => window.__card().id);
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
  if (c1 !== c0) throw new Error('the game moved on while the tab was hidden');
  /* the beat resumes once visible: poll for it (a loaded machine runs frames late), never a fixed sleep */
  for (let t = 0; t < 50; t++) {
    if ((await p.evaluate(() => window.__card().id)) !== c0 || (await rec(p)).done) return;
    await p.waitForTimeout(200);
  }
  throw new Error('the game did not move on once the tab came back');
});

check('copy', 'no streak copy in the engine', async () => {
  const s = fs.readFileSync(path.join(APP, 'games-panchang.js'), 'utf8');
  const m = s.match(/in a row|streak|×\s*\d|\d\s*×|multiplier/i);
  if (m) throw new Error('found "' + m[0] + '"');
});

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  if (shotDir) fs.mkdirSync(shotDir, { recursive: true });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await browser.newContext({ viewport: DESK, serviceWorkers: 'block' });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await boot(p, base);
      await c.fn({ p, ctx, base, browser });
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

/* PROVED BY BREAKING (each watched to fail, then restored):
     P1        a round of two-month windows only, no one-month cards — "a random placer's odds are 16.7%"
     holds     the miss card moving on by itself like a right answer — "the miss did not hold"
   Caught real faults while the game was built: phone (Aage under the tab bar), P4 (Mera saal's
   chips one height for one-line names and another for two). */
