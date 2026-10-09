#!/usr/bin/env node
/* Bizzing India — Naksha, the map game (games spec §4.3, §8 T10; docs/32).

     register   the IND_GAMES entry is docs/32's: teaches, five levels, review false, icon map
     N5         the neighbours in app/data-naksha.js are reproduced, pair for pair, from the
                outlines in map-data.js by tools/build-naksha.js — and are symmetric
     N3         every state's outline on the board IS map-data.js's (J&K whole, the national
                outline untouched), in four locales; nothing in the engine reads a locale
     N2 / T10   across whole rounds (rights, misses, the cursor, zoom), no boundary path's d,
                stroke, stroke-width, stroke-opacity or dash changes, and none animates
     N1         a random tapper (seeded) scores under 10% at L1
     N4         the arrow keys reach all 37 states and territories, Lakshadweep included
     keyboard   a whole L1 round played with the keyboard alone ends in done() with asked = 10
     holds      a wrong tap holds: "Not quite.", the right state warm and named, the tapped one
                grey and named; no new prompt for 3 s; a second tap is not a second answer;
                Enter is Aage. The engine never plays right/wrong itself (the host does)
     leak       L2 (capitals): no capital dot and no answer's name on screen before the tap;
                the dot after it. L1 offers no letter jump (it would spell the answer)
     neighbours L4: every neighbour tapped is one right answer, reported once
     touch      on a touch phone a tap answers and the zoom buttons zoom without moving a border
     phone      390 × 844: the map, the zoom buttons and Aage sit above the tab bar, nothing
                sideways; targets ≥ 44 px
     night      the prompt and the miss card read at ≥ 4.5:1 in day and in night
     clock      a right answer's beat does not run while the tab is hidden
     copy       no streak copy ("in a row", "streak", × multipliers) in the engine

   Each check was watched to fail by breaking the thing it holds — see the end of this file.
   Run:  CHROME=/opt/pw-browsers/chromium NODE_PATH=…/node_modules node tools/check-naksha.js [--only N2] [--shots DIR]
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');
const { computeNeighbours } = require('./build-naksha');

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

/* in the page: mount the engine where the host would, with a stub opts that records */
const PAGE_HELPERS = () => {
  window.__mount = function (o) {
    if (window.__td) { try { window.__td(); } catch (e) {} window.__td = null; }
    const old = document.querySelector('#gamehost');
    const h = document.createElement('div'); h.id = 'gamehost';
    if (old) old.replaceWith(h); else document.querySelector('#main').appendChild(h);
    const rec = window.__rec = { answers: [], done: null };
    const g = window.IND_GAMES.filter(x => x.id === 'naksha')[0];
    window.__td = g.engine(h, Object.assign({ level: 1, band: '8-10', scope: null, calm: false, reduced: false, skin: null,
      answer: r => rec.answers.push(r) }, o || {}), r => { rec.done = r; });
  };
  window.__byName = function (n) {
    const G = window.IND_GEO.states;
    return Object.keys(G).filter(c => G[c].name === n)[0] || null;
  };
  /* what the prompt asks for, worked out the way a child would — from the words on screen */
  window.__want = function () {
    const q = document.querySelector('.nk-q'); if (!q) return null;
    const b = q.querySelector('b'), t = b ? b.textContent : '';
    const mode = document.querySelector('.nk').getAttribute('data-mode');
    const G = window.IND_GEO.states;
    if (mode === 'find') return [window.__byName(t)];
    if (mode === 'capital') return Object.keys(G).filter(c => G[c].capital === t);
    if (mode === 'neighbours') return window.IND_NAKSHA.neighbours[window.__byName(t)];
    return null;
  };
  window.__pt = function (c) {
    const M = window.IND_MAP, a = c === 'LD' ? M.capitals.LD : M.anchors[c];
    const svg = document.querySelector('.nk-map'), m = svg.getScreenCTM(), p = svg.createSVGPoint();
    p.x = a[0]; p.y = a[1];
    const q = p.matrixTransform(m);
    return { x: q.x, y: q.y };
  };
  window.__snap = function () {
    return [...document.querySelectorAll('.nk-st, .nk-outline')].map(e => {
      const cs = getComputedStyle(e);
      return [e.getAttribute('data-c') || 'outline', e.getAttribute('d') || [e.getAttribute('cx'), e.getAttribute('cy'), e.getAttribute('r')].join(','),
        cs.stroke, cs.strokeWidth, cs.strokeOpacity, cs.strokeDasharray, cs.animationName, /[1-9]/.test(cs.transitionDuration) ? cs.transitionProperty : 'none'].join('|');
    });
  };
};

async function boot(p, base, o) {
  await p.goto(base + (o && o.q || ''), { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  await p.evaluate(() => window.IND_LOAD(['map', 'content', 'games']));
  await p.waitForFunction(() => (window.IND_GAMES || []).some(g => g.id === 'naksha') && window.IND_MAP && window.IND_GEO && window.IND_NAKSHA, null, { timeout: 30000 });
  await p.evaluate(() => window.BI.go('game', 'naksha')).catch(() => {});
  await p.waitForTimeout(500);
  await p.evaluate(PAGE_HELPERS);
}
const mount = (p, o) => p.evaluate(o => window.__mount(o), o || {});
const rec = p => p.evaluate(() => window.__rec);
const tapCode = async (p, c) => { const pt = await p.evaluate(c => window.__pt(c), c); await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(40); };
const aage = async p => { await p.evaluate(() => { const b = document.querySelector('#gamehost .gm-aage'); if (b) b.click(); }); await p.waitForTimeout(30); };

/* a seeded random, so a "random" bot is the same bot every run */
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ------------------------------------------------------------------------------------------ */

check('register', 'the IND_GAMES entry is docs/32’s', async ({ p }) => {
  const g = await p.evaluate(() => { const g = window.IND_GAMES.filter(x => x.id === 'naksha')[0]; return g && Object.assign({}, g, { engine: typeof g.engine }); });
  if (!g) throw new Error('naksha is not registered');
  const bad = [];
  if (g.name !== 'Naksha') bad.push('name'); if (g.sub !== 'find it on the map') bad.push('sub');
  if (g.teaches !== true) bad.push('teaches'); if (g.review !== false) bad.push('review');
  if (!Array.isArray(g.levels) || g.levels.length !== 5 || g.levels.some(l => typeof l !== 'string' || !l)) bad.push('levels');
  if (g.icon !== 'map') bad.push('icon'); if (g.minutes !== 4) bad.push('minutes'); if (g.engine !== 'function') bad.push('engine');
  if (bad.length) throw new Error('wrong fields: ' + bad.join(', '));
});

check('N5', 'neighbours are generated from the outlines and reproduced here, pair for pair', async () => {
  const src = fs.readFileSync(path.join(APP, 'data-naksha.js'), 'utf8');
  const window = {}; new Function('window', src)(window);
  const shipped = window.IND_NAKSHA.neighbours, fresh = computeNeighbours().neighbours;
  const a = JSON.stringify(shipped), b = JSON.stringify(fresh);
  if (a !== b) {
    const diff = Object.keys(Object.assign({}, shipped, fresh)).filter(c => JSON.stringify(shipped[c]) !== JSON.stringify(fresh[c]));
    throw new Error('app/data-naksha.js is not what the geometry gives (rerun node tools/build-naksha.js): ' + diff.join(' '));
  }
  for (const c of Object.keys(fresh)) for (const n of fresh[c]) if (!(fresh[n] || []).includes(c)) throw new Error(c + ' touches ' + n + ' but not back');
  if (!/GENERATED by tools\/build-naksha\.js/.test(src)) throw new Error('data-naksha.js does not say it is generated');
  const islands = ['AN'].filter(c => (fresh[c] || []).length);
  if (islands.length) throw new Error('an island has land neighbours: ' + islands);
});

check('N3', 'every outline is map-data.js’s — J&K whole, the national outline untouched — in four locales', async ({ browser, base }) => {
  const eng = fs.readFileSync(path.join(APP, 'games-naksha.js'), 'utf8');
  if (/navigator\.language|toLocale|Intl\.|\.locale\b/.test(eng)) throw new Error('the engine reads a locale — no region-varying geometry');
  const ref = {};
  for (const locale of ['en-IN', 'en-US', 'ur-PK', 'zh-CN']) {
    const ctx = await browser.newContext({ viewport: DESK, serviceWorkers: 'block', locale });
    const p = await ctx.newPage();
    await boot(p, base); await mount(p, { level: 1 });
    const r = await p.evaluate(() => {
      const M = window.IND_MAP, bad = [];
      document.querySelectorAll('.nk-st[data-c]').forEach(e => { const c = e.getAttribute('data-c'); if (c !== 'LD' && e.getAttribute('d') !== M.paths[c]) bad.push(c); });
      const jk = document.querySelector('.nk-st[data-c="JK"]'), ol = document.querySelector('.nk-outline');
      return { bad, jk: jk && jk.getAttribute('d'), ol: ol && ol.getAttribute('d'), okJK: jk && jk.getAttribute('d') === M.paths.JK, okOL: ol && ol.getAttribute('d') === M.outline,
        n: document.querySelectorAll('.nk-st[data-c]').length };
    });
    await ctx.close();
    if (r.bad.length) throw new Error(locale + ': outlines differ from map-data.js: ' + r.bad.join(' '));
    if (!r.okJK) throw new Error(locale + ': J&K is not map-data.js’s outline');
    if (!r.okOL) throw new Error(locale + ': the national outline is not map-data.js’s');
    if (r.n !== 37) throw new Error(locale + ': ' + r.n + ' territories on the board, not 37');
    if (ref.jk && (ref.jk !== r.jk || ref.ol !== r.ol)) throw new Error(locale + ' draws J&K or India differently from another locale');
    ref.jk = r.jk; ref.ol = r.ol;
  }
});

check('N2', 'across whole rounds no boundary path’s d or stroke changes, and none animates', async ({ p }) => {
  for (const level of [1, 2, 4]) {
    await mount(p, { level });
    const base0 = await p.evaluate(() => window.__snap());
    const anim = base0.filter(s => { const f = s.split('|'); return f[6] !== 'none' || f[7] !== 'none'; });
    if (anim.length) throw new Error('a boundary animates or transitions: ' + anim[0].slice(0, 80));
    let steps = 0, miss = 0;
    for (let i = 0; i < 40 && !(await rec(p)).done; i++) {
      const want = await p.evaluate(() => window.__want());
      /* alternate: a wrong tap, then right ones, so both the grey and the warm fills are seen */
      const all = await p.evaluate(() => Object.keys(window.IND_MAP.paths));
      const tgt = await p.evaluate(() => { const e = document.querySelector('.nk-st.nk-tgt'); return e && e.getAttribute('data-c'); });
      const wrong = all.find(c => !want.includes(c) && c !== 'LD' && !['CH', 'DL', 'DD', 'DN', 'GA', 'PY', 'SK'].includes(c) && c !== tgt);
      if (i % 3 === 1) { await tapCode(p, wrong); if (await p.$('#gamehost .gm-miss')) miss++; else throw new Error('tapping ' + wrong + ' for ' + want + ' showed no miss card'); }
      else for (const c of want) { await tapCode(p, c); if (await p.$('#gamehost .gm-miss')) break; }
      await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight');
      await p.evaluate(() => document.querySelector('.nk-zb[data-nk="zin"]').click());
      const now = await p.evaluate(() => window.__snap());
      const changed = now.filter((s, k) => s !== base0[k]);
      if (changed.length) throw new Error(`L${level}: a boundary changed mid-round: ` + changed[0].slice(0, 120));
      await p.evaluate(() => document.querySelector('.nk-zb[data-nk="zreset"]').click());
      await aage(p); steps++;
    }
    const r = await rec(p);
    if (!r.done) throw new Error(`L${level}: the round never ended`);
    if (!miss) throw new Error(`L${level}: no miss was exercised in ${steps} steps; done ${JSON.stringify(r.done)}`);
  }
});

check('N1', 'a random tapper scores under 10% at L1', async ({ p }) => {
  const R = rng(1009);
  let asked = 0, right = 0;
  for (let round = 0; round < 5; round++) {
    await mount(p, { level: 1 });
    const all = await p.evaluate(() => Object.keys(window.IND_MAP.paths).concat(['LD']));
    for (let i = 0; i < 12 && !(await rec(p)).done; i++) {
      await tapCode(p, all[Math.floor(R() * all.length)]);
      await aage(p);
    }
    const r = await rec(p);
    if (!r.done) throw new Error('a round did not finish');
    asked += r.done.asked; right += r.done.firstTryRight;
    if (r.answers.length !== r.done.asked) throw new Error('answer() count ' + r.answers.length + ' ≠ asked ' + r.done.asked);
  }
  const pct = right / asked;
  console.log(`         random tapper: ${right}/${asked} = ${(pct * 100).toFixed(1)}% (chance per tap 1/37 = 2.7%)`);
  if (pct >= 0.10) throw new Error(`a random tapper scored ${(pct * 100).toFixed(1)}% at L1`);
});

check('N4', 'the arrow keys reach all 37 states and territories', async ({ p }) => {
  await mount(p, { level: 2 });
  const seen = new Set();
  for (let i = 0; i < 40; i++) {
    await p.keyboard.press('ArrowRight');
    const c = await p.evaluate(() => { const e = document.querySelector('.nk-cur[data-cur]'); return e && e.getAttribute('data-cur'); });
    if (c) seen.add(c);
  }
  const all = await p.evaluate(() => Object.keys(window.IND_GEO.states));
  const missing = all.filter(c => !seen.has(c));
  if (all.length !== 37) throw new Error(all.length + ' territories in data-geo, not 37');
  if (missing.length) throw new Error('not reachable by keyboard: ' + missing.join(' '));
  /* ↑ ↓ move too, and a letter jumps from L2 */
  await p.keyboard.press('k');
  const k = await p.evaluate(() => document.querySelector('.nk-cur').getAttribute('data-cur'));
  if (!/^K/.test(await p.evaluate(c => window.IND_GEO.states[c].name, k))) throw new Error('the letter K did not jump to a K state');
});

check('keyboard', 'a whole L1 round with the keyboard alone', async ({ p }) => {
  await mount(p, { level: 1 });
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  for (let i = 0; i < 12 && !(await rec(p)).done; i++) {
    const want = (await p.evaluate(() => window.__want()))[0];
    for (let s = 0; s < 40; s++) {
      const c = await p.evaluate(() => { const e = document.querySelector('.nk-cur[data-cur]'); return e && e.getAttribute('data-cur'); });
      if (c === want) break;
      await p.keyboard.press('ArrowRight');
    }
    await p.keyboard.press('Enter'); await p.waitForTimeout(30);
    await p.keyboard.press('Enter'); await p.waitForTimeout(30);
  }
  const r = await rec(p);
  if (!r.done) throw new Error('the keyboard round did not finish');
  if (r.done.asked !== 10 || r.done.firstTryRight !== 10) throw new Error('keyboard round: ' + JSON.stringify(r.done));
  if (r.done.levelNext !== 2) throw new Error('10/10 should offer level 2, got ' + r.done.levelNext);
  /* at L1 a letter does not jump — it would spell out the state asked for */
  await mount(p, { level: 1 });
  await p.keyboard.press('r');
  if (await p.$('.nk-cur')) throw new Error('a letter jumped the cursor at L1');
});

check('holds', 'a wrong tap holds with the miss card until Aage; the engine plays no right/wrong', async ({ p }) => {
  await p.evaluate(() => { window.IND_SFX && (window.IND_SFX.played.length = 0); });
  await mount(p, { level: 1 });
  const want = (await p.evaluate(() => window.__want()))[0];
  const q0 = await p.evaluate(() => document.querySelector('.nk-q').textContent);
  const wrong = want === 'RJ' ? 'MP' : 'RJ';
  await tapCode(p, wrong);
  const m = await p.evaluate((a) => {
    const miss = document.querySelector('#gamehost .gm-miss');
    return { miss: !!miss, text: miss ? miss.textContent : '', ans: !!document.querySelector('#gamehost .gm-miss .gm-ans'),
      teach: !!document.querySelector('#gamehost .gm-miss .gm-teach'), aage: !!document.querySelector('#gamehost .gm-miss .gm-aage[data-gm="aage"]'),
      grey: document.querySelector('.nk-st[data-c="' + a.wrong + '"]').classList.contains('nk-no'),
      warm: document.querySelector('.nk-st[data-c="' + a.want + '"]').classList.contains('nk-ok'),
      labels: [...document.querySelectorAll('.nk-over .nk-lab')].map(t => t.textContent).join('|') };
  }, { want, wrong });
  if (!m.miss || !/Not quite\./.test(m.text) || !m.ans || !m.teach || !m.aage) throw new Error('no full miss card: ' + JSON.stringify(m));
  if (!m.grey || !m.warm) throw new Error('the tapped state is not grey or the right one not warm');
  const names = await p.evaluate(a => [window.IND_GEO.states[a.want].name, window.IND_GEO.states[a.wrong].name], { want, wrong });
  if (!m.labels.includes(names[0]) || !m.labels.includes(names[1])) throw new Error('both states are not named on the map: ' + m.labels);
  await p.waitForTimeout(3000);
  await tapCode(p, want);
  const r = await rec(p), q1 = await p.evaluate(() => document.querySelector('.nk-q').textContent);
  if (q1 !== q0 || !(await p.$('#gamehost .gm-miss'))) throw new Error('the miss did not hold: a new prompt rendered before Aage');
  if (r.answers.length !== 1 || r.answers[0].right !== false || r.answers[0].firstTry !== true) throw new Error('answers after a miss and a retry: ' + JSON.stringify(r.answers));
  await p.keyboard.press('Enter');
  const q2 = await p.evaluate(() => document.querySelector('.nk-q').textContent);
  if (q2 === q0) throw new Error('Enter did not press Aage');
  /* a right answer: one report, the beat, then the next — and no sound from the engine */
  const w2 = (await p.evaluate(() => window.__want()))[0];
  await tapCode(p, w2);
  const r2 = await rec(p);
  if (r2.answers.length !== 2 || r2.answers[1].right !== true || r2.answers[1].skill !== 'naksha.find' || !r2.answers[1].id) throw new Error('a right answer reported: ' + JSON.stringify(r2.answers[1]));
  const played = await p.evaluate(() => (window.IND_SFX ? window.IND_SFX.played : []).filter(k => k === 'right' || k === 'wrong'));
  if (played.length) throw new Error('the engine played ' + played.join(', ') + ' itself');
});

check('leak', 'L2 shows no capital dot and no answer before the tap; the dot after it', async ({ p }) => {
  for (let round = 0; round < 3; round++) {
    await mount(p, { level: 2 });
    const want = await p.evaluate(() => window.__want());
    const pre = await p.evaluate(w => ({ dot: !!document.querySelector('.nk-cap'), text: document.querySelector('#gamehost').innerText,
      name: window.IND_GEO.states[w[0]].name, labels: document.querySelector('.nk-over').textContent }), want);
    if (pre.dot) throw new Error('the capital dot shows before the tap');
    if (pre.text.includes(pre.name) || pre.labels.includes(pre.name)) throw new Error('the answer, ' + pre.name + ', is on screen before the tap');
    await tapCode(p, want[0]);
    if (!(await p.$('.nk-cap'))) throw new Error('no capital dot after the tap');
  }
});

check('neighbours', 'L4: each neighbour found once, one report for the whole item', async ({ p }) => {
  await mount(p, { level: 4 });
  const want = await p.evaluate(() => window.__want());
  if (!want || want.length < 2) throw new Error('an L4 item with fewer than two neighbours');
  for (const c of want) { await tapCode(p, c); await tapCode(p, c); }
  const r = await rec(p);
  if (r.answers.length !== 1 || !r.answers[0].right || r.answers[0].skill !== 'naksha.neighbours') throw new Error('L4 reports: ' + JSON.stringify(r.answers));
  const warm = await p.evaluate(w => w.every(c => document.querySelector('.nk-st[data-c="' + c + '"]').classList.contains('nk-ok')), want);
  if (!warm) throw new Error('found neighbours are not tinted');
});

check('touch', 'on a touch phone a tap answers; zoom buttons zoom and no border moves', async ({ browser, base }) => {
  const ctx = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  try {
    await boot(p, base); await mount(p, { level: 1 });
    const want = (await p.evaluate(() => window.__want()))[0];
    const pt = await p.evaluate(c => window.__pt(c), want);
    await p.touchscreen.tap(pt.x, pt.y); await p.waitForTimeout(80);
    const r = await rec(p);
    if (r.answers.length !== 1 || !r.answers[0].right) throw new Error('a touch tap on ' + want + ' did not answer it: ' + JSON.stringify(r.answers));
    const s0 = await p.evaluate(() => window.__snap()), vb0 = await p.evaluate(() => document.querySelector('.nk-map').getAttribute('viewBox'));
    const zb = await p.$('.nk-zb[data-nk="zin"]'); const bb = await zb.boundingBox();
    await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(80);
    const vb1 = await p.evaluate(() => document.querySelector('.nk-map').getAttribute('viewBox'));
    if (vb1 === vb0) throw new Error('the zoom button did not zoom');
    const s1 = await p.evaluate(() => window.__snap());
    if (JSON.stringify(s0) !== JSON.stringify(s1)) throw new Error('zooming changed a boundary path');
  } finally { await ctx.close(); }
});

check('phone', '390 × 844: the map, the zoom and Aage above the tab bar; nothing sideways; targets ≥ 44 px', async ({ browser, base }) => {
  const ctx = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  try {
    await boot(p, base); await mount(p, { level: 1 });
    await p.waitForTimeout(300);
    const want = (await p.evaluate(() => window.__want()))[0];
    await tapCode(p, want === 'RJ' ? 'MP' : 'RJ');
    const m = await p.evaluate(() => {
      const bar = document.querySelector('[data-bz=tabbar]'), barTop = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
      const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: b.top, b: b.bottom, h: b.height, w: b.width }; };
      const small = [...document.querySelectorAll('#gamehost button')].filter(b => { const x = b.getBoundingClientRect(); return x.width && (x.width < 44 || x.height < 44); }).map(b => b.className);
      return { barTop, map: r('.nk-mapbox'), aage: r('#gamehost .gm-aage'), zoom: r('.nk-zoom'), q: r('.nk-q'), small,
        over: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth };
    });
    if (m.over > 0) throw new Error('the page is ' + m.over + 'px wider than the phone');
    for (const k of ['map', 'aage', 'zoom', 'q']) {
      const b = m[k]; if (!b) throw new Error('no ' + k);
      if (b.t < 0 || b.b > m.barTop + 0.5) throw new Error(`${k} is off-screen or under the tab bar (${Math.round(b.t)}–${Math.round(b.b)}, bar at ${Math.round(m.barTop)})`);
    }
    if (m.small.length) throw new Error('targets under 44 px: ' + m.small.join(', '));
    if (shotDir) await p.screenshot({ path: path.join(shotDir, 'naksha-phone-miss.png') });
  } finally { await ctx.close(); }
});

function lum(c) {
  const m = String(c).match(/[\d.]+/g).map(Number);
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
}
check('night', 'the prompt and the miss card read at ≥ 4.5:1, day and night', async ({ p }) => {
  for (const night of [false, true]) {
    await p.evaluate(n => { if (n) document.documentElement.setAttribute('data-mode', 'night'); else document.documentElement.removeAttribute('data-mode'); }, night);
    await mount(p, { level: 2 });
    const want = await p.evaluate(() => window.__want());
    await tapCode(p, want[0] === 'RJ' ? 'MP' : 'RJ');
    const cs = await p.evaluate(() => {
      const g = (s, prop) => { const e = document.querySelector(s); return e ? getComputedStyle(e)[prop] : null; };
      return [[g('.nk-q', 'color'), g('.nk-ask', 'backgroundColor')], [g('.nk-fb .gm-ans', 'color'), g('.nk-fb .gm-miss', 'backgroundColor')],
        [g('.nk-fb .gm-teach', 'color'), g('.nk-fb .gm-miss', 'backgroundColor')]];
    });
    for (const [fg, bg] of cs) {
      if (!fg || !bg) throw new Error('missing element for contrast');
      const a = lum(fg), b = lum(bg), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      if (ratio < 4.5) throw new Error(`${night ? 'night' : 'day'}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
    }
    if (shotDir) await p.screenshot({ path: path.join(shotDir, `naksha-desk-${night ? 'night' : 'day'}.png`) });
  }
  await p.evaluate(() => document.documentElement.removeAttribute('data-mode'));
});

check('clock', 'a right answer’s beat does not run while the tab is hidden', async ({ p }) => {
  await mount(p, { level: 1 });
  const want = (await p.evaluate(() => window.__want()))[0];
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  await tapCode(p, want);
  const q0 = await p.evaluate(() => document.querySelector('.nk-q').textContent);
  await p.waitForTimeout(3000);
  const q1 = await p.evaluate(() => document.querySelector('.nk-q').textContent);
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
  if (q1 !== q0) throw new Error('the game moved on while the tab was hidden');
  await p.waitForTimeout(2600);
  const q2 = await p.evaluate(() => document.querySelector('.nk-q').textContent);
  if (q2 === q0) throw new Error('the game did not move on once the tab came back');
});

check('copy', 'no streak copy in the engine', async () => {
  const s = fs.readFileSync(path.join(APP, 'games-naksha.js'), 'utf8');
  const m = s.match(/in a row|streak|×\s*\d|\d\s*×|multiplier|biggest/i);
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

/* PROVED BY BREAKING (each was watched to fail first):
     N5        a pair deleted from app/data-naksha.js
     N3        J&K's d trimmed by one point in the engine before drawing
     N2        `.nk-st.nk-ok` given a stroke; and a stroke transition on .nk-st
     N1        the bot always tapping the answer
     N4        Lakshadweep left out of the keyboard order
     holds     the miss card auto-advancing like a right answer
     leak      the capital dot drawn before the tap
     phone     the feedback card placed under the map instead of over it
     clock     the beat counted with Date.now() instead of the paused rAF delta */
