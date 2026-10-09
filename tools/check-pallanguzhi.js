#!/usr/bin/env node
/* Bizzing India — PALLANGUZHI, the redesign (games spec §4.8, PZ1–PZ6; docs/32).

     registry  on the shelf as heritage play (teaches:false, a sub, no levels), credited to Tamil
               Nadu and the three other names it goes by, "ask your family"; Kancha and Gutte are
               gone from the registry and kept archived
     PZ1       on 390 × 844 the board is the screen: full-screen, upright, every pit ≥ 48 px, every
               count ≥ 16 px, the whole board on screen, Gattu's store at the top and yours below
     PZ2       the shells ARE the count: up to 12 drawn one by one; above 12 a heap and a badge
     PZ3       sowing drops one shell a pit, in order, ~140 ms apart, followable frame by frame
     PZ4       the preview's landing pit and capture equal the rules over 1,000 random boards, and
               a committed move leaves exactly the board the preview promised
     PZ5       two moves ahead beats Naya more than 70% of the time; greedy loses to Saathi
     PZ6       before the first move: only the board, its controls and (the first time) the coach
     keys      ←/→ between your pits, Space previews, Esc cancels, Enter sows; the screen-reader
               line says "Pit 3, 7 shells, lands in Gattu's pit 2"; your pits are rimmed
     touch     press shows the trail, lifting away cancels, a second tap sows
     adapt     Gattu steps up after two wins in a row and down after two losses, deterministically;
               openings rotate through the fixed list, each mirror-fair
     clock     a hidden tab changes nothing; the game pays nothing, reports nothing, plays no
               right/wrong sound, and leaving full-screen gives the page back

   Each check was watched to fail by breaking the thing it holds.
   Run:  CHROME=/opt/pw-browsers/chromium NODE_PATH=… node tools/check-pallanguzhi.js [--only PZ4]
*/
const { serve, mount } = require('./lib/game-mount');
const { skipOnboarding } = require('./lib/onboard');

const DESK = { width: 1280, height: 800 }, PHONE = { width: 390, height: 844 };
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
const FILE = 'games-gully.js';
const coached = p => p.evaluate(() => window.IND_STORE.kidSet('pz.coached', 'true'));
const go = async (p, opts) => { await mount(p, 'pallanguzhi', FILE, opts); await p.waitForTimeout(200); };
const Z = (p, fn, arg) => p.evaluate(fn, arg);
const idle = async p => { for (let i = 0; i < 200; i++) { if (!(await Z(p, () => document.getElementById('tsthost').__pz.busy()))) return; await p.waitForTimeout(50); } throw new Error('the board never settled'); };

/* an independent statement of the rules, written again here on purpose — the engine's PZ is not
   asked to check itself */
function refMove(pits, i) {
  const p = pits.slice(), N = p.length; let hand = p[i], j = i; p[i] = 0;
  while (hand > 0) { j = (j + 1) % N; p[j]++; hand--; }
  const nx = (j + 1) % N, by = (j + 2) % N; let cap = 0;
  if (p[nx] === 0 && p[by] > 0) { cap = p[by]; p[by] = 0; }
  return { pits: p, last: j, cap };
}

check('registry', 'heritage play on the shelf, credited and named; Kancha and Gutte gone from the registry, kept archived', async ({ p }) => {
  await go(p);
  const r = await Z(p, () => {
    const g = window.IND_GAMES.filter(x => x.id === 'pallanguzhi')[0];
    return { n: window.IND_GAMES.filter(x => x.id === 'pallanguzhi').length, teaches: g.teaches, sub: g.sub, levels: g.levels,
      blurb: g.blurb, ids: window.IND_GAMES.map(x => x.id), arch: Object.keys(window.IND_GAMES_ARCHIVE || {}) };
  });
  if (r.n !== 1) throw new Error(r.n + ' pallanguzhi entries');
  if (r.teaches !== false) throw new Error('teaches is ' + r.teaches + ', not false');
  if (!r.sub || /[ऀ-ॿ]/.test(r.sub)) throw new Error('no English sub: ' + r.sub);
  if (r.levels) throw new Error('a heritage game has no levels');
  for (const w of ['Tamil Nadu', 'Ali Guli Mane (Karnataka)', 'Vamana Guntalu (Andhra Pradesh)', 'Kuzhipara (Kerala)', 'ask your family'])
    if (r.blurb.toLowerCase().indexOf(w.toLowerCase()) < 0) throw new Error('the card does not name: ' + w);
  for (const gone of ['kancha', 'gutte']) {
    if (r.ids.indexOf(gone) >= 0) throw new Error(gone + ' is still registered');
    if (r.arch.indexOf(gone) < 0) throw new Error(gone + '’s engine is not kept in the archive');
  }
});

check('PZ1', 'on 390 × 844: full-screen and upright, pits ≥ 48 px, counts ≥ 16 px, the whole board on screen', async ({ p }) => {
  await coached(p); await go(p);
  const m = await Z(p, () => {
    const root = document.querySelector('.pz-root'), rr = root.getBoundingClientRect();
    const pits = [...document.querySelectorAll('.pz-stage > .pz-hits .pz-pit')].map(b => b.getBoundingClientRect());
    const counts = [...document.querySelectorAll('[data-count] text')].map(t => ({ fs: parseFloat(t.getAttribute('font-size')), h: t.getBBox().height, r: t.getBoundingClientRect() }));
    const board = document.querySelectorAll('.pz-stage svg rect[rx]')[1].getBoundingClientRect();
    const sY = document.querySelector('[data-store="you"]').getBoundingClientRect(), sG = document.querySelector('[data-store="gattu"]').getBoundingClientRect();
    const svg = document.querySelector('.pz-stage svg').getBoundingClientRect();
    return { full: root.classList.contains('pz-full'), rr: [rr.left, rr.top, rr.width, rr.height], lock: document.documentElement.classList.contains('gm-fullscreen'),
      pits: pits.map(b => [b.left, b.top, b.width, b.height]), counts, board: [board.left, board.top, board.right, board.bottom], sY: sY.top, sG: sG.top,
      tab: (() => { const t = document.querySelector('[data-bz=tab]'); if (!t) return null; const r = t.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e ? !!e.closest('.pz-root') : null; })() };
  });
  if (!m.full || !m.lock) throw new Error('not full-screen during play');
  if (m.rr[0] !== 0 || m.rr[1] !== 0 || m.rr[2] !== 390 || m.rr[3] !== 844) throw new Error('the stage is not the viewport: ' + m.rr);
  if (m.tab === false) throw new Error('the tab bar shows through the full-screen board');
  if (m.pits.length !== 7) throw new Error(m.pits.length + ' pits to tap');
  for (const b of m.pits) if (b[2] < 48 || b[3] < 48) throw new Error('a pit is ' + b[2].toFixed(0) + '×' + b[3].toFixed(0) + ' px');
  const xs = new Set(m.pits.map(b => Math.round(b[0])));
  if (xs.size !== 1) throw new Error('your pits are not one upright column on a phone');
  if (m.pits[0][1] <= m.pits[6][1]) throw new Error('your pit 1 is not nearest the thumb (bottom)');
  if (m.counts.length !== 14) throw new Error(m.counts.length + ' counts');
  for (const c of m.counts) if (c.fs < 16 || c.r.height < 11) throw new Error('a count is ' + c.fs + 'px');
  if (m.board[0] < 0 || m.board[1] < 0 || m.board[2] > 390 || m.board[3] > 844) throw new Error('the board runs off the screen: ' + m.board.map(Math.round));
  if (!(m.sG < m.sY)) throw new Error('Gattu’s store is not at the top');
  await p.screenshot({ path: OUT + 'pz-phone.png' });
}, { vp: PHONE, touch: true });

check('PZ2', 'up to 12 shells drawn one by one, a heap and a badge above that; the stores show the real heap', async ({ p }) => {
  await coached(p); await go(p);
  const bad = await Z(p, () => {
    const z = document.getElementById('tsthost').__pz, out = [];
    let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let t = 0; t < 30; t++) {
      /* small pits everywhere and two big ones that walk through 9…20, so every count from
         one shell to a heap is drawn (an earlier version flattened every pit to ≤ 9 and missed
         a board that drew one shell too few) */
      const pits = Array.from({ length: 14 }, () => Math.floor(rnd() * 4));
      const b1 = Math.floor(rnd() * 14); let b2 = Math.floor(rnd() * 14); if (b2 === b1) b2 = (b1 + 5) % 14;
      pits[b1] = 9 + (t % 12); pits[b2] = 5 + ((t * 5) % 9);
      let sum = pits.reduce((a, b) => a + b, 0);
      const you = Math.floor((70 - sum) / 2), gattu = 70 - sum - you;
      z.setState({ pits, store: { you, gattu }, turn: 'you', over: false, target: 36 });
      const L = z.board.L();
      const shells = [...document.querySelectorAll('.pz-stage .pz-shells use')].filter(u => u.style.display !== 'none').map(u => {
        const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(u.getAttribute('transform')); return [+m[1], +m[2]]; });
      const per = new Array(14).fill(0), st = { you: 0, gattu: 0 };
      shells.forEach(([x, y]) => {
        for (let i = 0; i < 14; i++) { const c = L.P[i]; if (((x - c.x) / L.rx) ** 2 + ((y - c.y) / L.ry) ** 2 <= 1.0001) { per[i]++; return; } }
        for (const w of ['you', 'gattu']) { const c = L.S[w]; if (((x - c.x) / c.rx) ** 2 + ((y - c.y) / c.ry) ** 2 <= 1.0001) { st[w]++; return; } }
      });
      for (let i = 0; i < 14; i++) {
        const badge = document.querySelector('[data-count="' + i + '"] text');
        if (+badge.textContent !== pits[i]) out.push('pit ' + i + ' badge says ' + badge.textContent + ' for ' + pits[i]);
        if (pits[i] <= 12 && per[i] !== pits[i]) out.push('pit ' + i + ': ' + per[i] + ' drawn for ' + pits[i]);
        if (pits[i] > 12 && per[i] < 12) out.push('pit ' + i + ': a heap of ' + pits[i] + ' shows only ' + per[i]);
        if (pits[i] > 12 && parseFloat(badge.getAttribute('font-size')) < 16) out.push('heap badge under 16px');
      }
      if (st.you !== you || st.gattu !== gattu) out.push('stores drawn ' + st.you + '/' + st.gattu + ' for ' + you + '/' + gattu);
      if (out.length) break;
    }
    return out;
  });
  if (bad.length) throw new Error(bad.slice(0, 3).join(' · '));
}, { vp: DESK });

check('PZ3', 'sowing drops one shell a pit, in order, about 140 ms apart — followable frame by frame', async ({ p }) => {
  await coached(p); await go(p);
  const r = await Z(p, async () => {
    const z = document.getElementById('tsthost').__pz;
    z.setState({ pits: [2, 3, 6, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5, 5], store: { you: 5, gattu: 0 }, turn: 'you', over: false, target: 36 });
    const read = () => [...document.querySelectorAll('[data-count] text')].map(t => +t.textContent);
    const frames = []; let prev = read();
    const n0 = z.drops.length;
    z.commit(2);
    await new Promise(res => { (function f() { const c = read(); const d = c.map((v, i) => v - prev[i]); if (d.some(x => x)) frames.push({ d }); prev = c; if (z.state().turn === 'you') requestAnimationFrame(f); else res(); })(); });
    return { frames, clock: z.drops.slice(n0) };
  });
  /* first frame: the pit empties into the hand; then one +1 at a time, in trail order */
  const drops = [];
  const clock = r.clock;
  for (const f of r.frames) {
    const plus = f.d.map((v, i) => [v, i]).filter(x => x[0] > 0), minus = f.d.filter(v => v < 0);
    if (minus.length && plus.length) throw new Error('a frame both lifted and dropped: ' + JSON.stringify(f.d));
    if (plus.length > 1 || (plus[0] && plus[0][0] !== 1)) throw new Error('more than one shell landed in one frame: ' + JSON.stringify(f.d));
    if (plus.length) drops.push({ pit: plus[0][1], t: f.t });
  }
  const want = [3, 4, 5, 6, 7, 8];
  if (drops.map(d => d.pit).join() !== want.join()) throw new Error('drops landed in ' + drops.map(d => d.pit) + ', not ' + want);
  /* the spacing is read on the game's own clock (RAF + delta time): a loaded machine drops
     frames, but a child's shells still land ~140 ms of game time apart, never in a burst */
  const cl = clock;
  if (cl.map(d => d.pit).join() !== want.join()) throw new Error('the game logged drops ' + cl.map(d => d.pit));
  for (let i = 1; i < cl.length; i++) {
    const gap = cl[i].t - cl[i - 1].t;
    if (gap < 100 || gap > 260) throw new Error('drop ' + i + ' came ' + gap.toFixed(0) + ' ms after the last (want ~140)');
  }
}, { vp: DESK });

check('PZ4', 'the preview’s landing and capture equal the rules on 1,000 random boards, and a sown move matches it', async ({ p }) => {
  await coached(p); await go(p, { reduced: true });
  const res = await Z(p, () => {
    const z = document.getElementById('tsthost').__pz, out = [];
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let t = 0; t < 1000; t++) {
      const pits = Array.from({ length: 14 }, () => (rnd() < 0.25 ? 0 : Math.floor(rnd() * 15)));
      if (!pits.slice(0, 7).some(x => x)) pits[Math.floor(rnd() * 7)] = 1 + Math.floor(rnd() * 9);
      /* a real board never holds more than its 70 shells */
      let sum = pits.reduce((a, b) => a + b, 0);
      while (sum > 70) { const j = Math.floor(rnd() * 14); if (pits[j] > (j < 7 && pits.slice(0, 7).filter(x => x).length === 1 && pits[j] === 1 ? 1 : 0)) { pits[j]--; sum--; } }
      const legal = pits.slice(0, 7).map((v, i) => v ? i : -1).filter(i => i >= 0);
      const i = legal[Math.floor(rnd() * legal.length)];
      z.setState({ pits, store: { you: 0, gattu: 0 }, turn: 'you', over: false, target: 999 });
      if (!pits[i]) { t--; continue; }
      z.preview(i);
      const last = document.querySelector('[data-ghost-last]'), cap = document.querySelector('[data-ghost-cap]');
      out.push({ pits, i, last: last ? +last.getAttribute('data-ghost-last') : -1, cap: cap ? +cap.getAttribute('data-ghost-cap') : 0,
        sr: document.querySelector('.pz-sr').textContent });
    }
    return out;
  });
  let bad = 0, first = '';
  for (const r of res) {
    const ref = refMove(r.pits, r.i);
    if (ref.last !== r.last || ref.cap !== r.cap) { bad++; if (!first) first = `pit ${r.i} of [${r.pits}]: preview lands ${r.last} +${r.cap}, rules say ${ref.last} +${ref.cap}`; }
  }
  if (res.length !== 1000) throw new Error(res.length + ' boards');
  if (bad) throw new Error(bad + ' of 1000 previews disagree — ' + first);
  /* and the board after a real move is the one promised */
  for (let k = 0; k < 6; k++) {
    const pits = [[3, 0, 5, 2, 7, 1, 4, 0, 6, 2, 3, 0, 5, 1], [1, 1, 0, 4, 0, 9, 2, 3, 0, 0, 7, 2, 2, 5], [0, 0, 13, 0, 1, 2, 3, 4, 5, 0, 6, 0, 1, 2],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], [2, 0, 1, 0, 3, 0, 1, 6, 0, 4, 0, 2, 9, 1], [4, 6, 5, 5, 5, 6, 4, 4, 6, 5, 5, 5, 6, 4]][k];
    const i = pits.slice(0, 7).findIndex(v => v > 0) + (k % 2 ? 0 : 0);
    await Z(p, a => { const z = document.getElementById('tsthost').__pz; z.setState({ pits: a.pits, store: { you: 0, gattu: 0 }, turn: 'you', over: false, target: 999 }); z.preview(a.i); z.commit(a.i); }, { pits, i });
    let s = null;
    for (let w = 0; w < 80; w++) { s = await Z(p, () => document.getElementById('tsthost').__pz.state()); if (s.turn === 'gattu' || s.over) break; await p.waitForTimeout(50); }
    const ref = refMove(pits, i);
    if (s.pits.join() !== ref.pits.join() || s.store.you !== ref.cap) throw new Error(`move ${k}: board after the move is [${s.pits}] +${s.store.you}, the preview promised [${ref.pits}] +${ref.cap}`);
    await idle(p);
  }
}, { vp: DESK });

check('PZ5', 'two moves ahead beats Naya more than 70% of the time, and greedy loses to Saathi', async ({ p }) => {
  await go(p);
  const r = await Z(p, () => {
    const PZ = window.IND_PZ;
    let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const lay = () => { const a = [0, 0, 0, 0, 0, 0, 0]; for (let k = 0; k < 35; k++) a[Math.floor(rnd() * 7)]++; return a; };
    function play(dYou, dG, layout, first) {
      let st = PZ.fresh(layout, 36); st.turn = first;
      for (let n = 0; n < 500 && !st.over; n++) st = PZ.apply(st, PZ.choose(st, st.turn === 'you' ? dYou : dG));
      return PZ.winner(st);
    }
    const rate = (a, b) => { let w = 0, g = 0; for (let k = 0; k < 150; k++) { const L = k < 6 ? PZ.OPENINGS[k] : lay(); for (const f of ['you', 'gattu']) { g++; if (play(a, b, L, f) === 'you') w++; } } return w / g; };
    return { lookVsNaya: rate(2, 1), nayaVsSaathi: rate(1, 2), depths: PZ.TIERS.map(t => t.depth) };
  });
  if (r.depths.join() !== '1,2,4') throw new Error('tiers are not greedy / two / four moves: ' + r.depths);
  if (!(r.lookVsNaya > 0.7)) throw new Error('two moves ahead beats Naya only ' + (r.lookVsNaya * 100).toFixed(1) + '%');
  if (!(r.nayaVsSaathi < 0.5)) throw new Error('greedy wins ' + (r.nayaVsSaathi * 100).toFixed(1) + '% against Saathi');
  console.log(`         two-ahead beats Naya ${(r.lookVsNaya * 100).toFixed(1)}% · greedy beats Saathi ${(r.nayaVsSaathi * 100).toFixed(1)}%`);
});

check('PZ6', 'before the first move only the board, its controls and (the first time) the coach', async ({ p }) => {
  for (const first of [true, false]) {
    if (!first) await coached(p);
    await go(p);
    const m = await Z(p, () => {
      const root = document.querySelector('.pz-root');
      const vis = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const words = [...root.querySelectorAll('h1,h2,h3,h4,p,ol,ul,li')].filter(vis).filter(e => !e.closest('.pz-coach') && (e.textContent || '').trim());
      return { coach: !document.querySelector('.pz-coach').hidden, over: !document.querySelector('.pz-over').hidden,
        words: words.map(e => e.className + ':' + e.textContent.trim().slice(0, 30)), full: root.classList.contains('pz-full'),
        steps: document.querySelectorAll('.pz-coach .pz-pit').length };
    });
    if (first && (!m.coach || m.steps !== 3)) throw new Error('a first game does not open on the coach’s tiny board');
    if (!first && m.coach) throw new Error('the coach comes back every game');
    if (m.over) throw new Error('a card covers the board before the first move');
    if (m.words.length) throw new Error('words before play: ' + m.words.join(' | '));
    if (!m.full) throw new Error('not full-screen');
  }
  /* the coach plays three moves: sow, a kasi, the round's end — and "?" brings it back */
  await Z(p, () => document.querySelector('[data-pz="coach"]').click());
  const lines = [];
  for (let s = 0; s < 3; s++) {
    await p.waitForTimeout(150);
    await Z(p, () => { const b = document.querySelector('.pz-coach .pz-pit[tabindex="0"]'); b.click(); });
    await p.waitForSelector('[data-pc="next"]:not([hidden])', { timeout: 6000 });
    lines.push(await Z(p, () => document.querySelector('.pz-coachline').textContent));
    await Z(p, () => document.querySelector('[data-pc="next"]').click());
  }
  if (!/sowing/i.test(lines[0]) || !/beyond/i.test(lines[1]) || !/round ended/i.test(lines[2])) throw new Error('the coach did not teach sow · kasi · round end: ' + lines.join(' / '));
  if (!(await Z(p, () => document.querySelector('.pz-coach').hidden))) throw new Error('the coach does not close on Play');
}, { vp: PHONE, touch: true });

check('keys', 'keyboard: ←/→ between your pits, Space previews, Esc cancels, Enter sows; the screen-reader line; your pits rimmed', async ({ p }) => {
  await coached(p); await go(p);
  await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight');
  const f = await Z(p, () => document.activeElement.getAttribute('data-pit'));
  if (f !== '2') throw new Error('→ twice lands on pit index ' + f);
  await p.keyboard.press(' ');
  const pv = await Z(p, () => ({ pv: document.querySelector('.pz-stage svg g[data-preview]') ? 1 : 0, sr: document.querySelector('.pz-sr').textContent }));
  if (!pv.pv) throw new Error('Space shows no preview');
  if (!/^Pit 3, \d+ shells?, lands in (your|Gattu’s) pit \d\b/.test(pv.sr)) throw new Error('screen-reader line: ' + pv.sr);
  await p.keyboard.press('Escape');
  if (await Z(p, () => !!document.querySelector('.pz-stage svg g[data-preview]'))) throw new Error('Esc does not cancel the preview');
  const before = await Z(p, () => document.getElementById('tsthost').__pz.state().pits.join());
  await p.keyboard.press('Enter');
  await p.waitForTimeout(150);
  const after = await Z(p, () => ({ busy: document.getElementById('tsthost').__pz.busy(), drops: document.getElementById('tsthost').__pz.drops.length }));
  if (!after.busy) throw new Error('Enter does not sow');
  const rims = await Z(p, () => [...document.querySelectorAll('.pz-stage svg ellipse')].filter(e => /pz-brass/.test(e.getAttribute('stroke') || '')).length);
  if (rims !== 7) throw new Error(rims + ' rimmed pits — yours are rimmed, Gattu’s are not');
  void before;
}, { vp: DESK });

check('touch', 'touch: a press shows the trail, lifting away cancels, a second tap sows', async ({ p }) => {
  await coached(p); await go(p);
  const pt = async (type, x, y, target) => Z(p, a => {
    const el = a.target ? document.querySelector(a.target) : document.elementFromPoint(a.x, a.y);
    el.dispatchEvent(new PointerEvent(a.type, { bubbles: true, cancelable: true, pointerId: 7, pointerType: 'touch', clientX: a.x, clientY: a.y, isPrimary: true }));
  }, { type, x, y, target });
  const b = await Z(p, () => { const r = document.querySelector('.pz-stage .pz-pit[data-pit="3"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.height }; });
  const pv = () => Z(p, () => document.querySelector('.pz-stage svg g[data-preview]') ? document.querySelector('.pz-stage svg g[data-preview]').getAttribute('data-preview') : null);
  await pt('pointerdown', b.x, b.y, '.pz-stage .pz-pit[data-pit="3"]');
  if ((await pv()) !== '3') throw new Error('pressing a pit shows no trail');
  await pt('pointerup', b.x, b.y - b.h * 3, '.pz-stage');
  if ((await pv()) !== null) throw new Error('lifting away does not cancel');
  if (await Z(p, () => document.getElementById('tsthost').__pz.busy())) throw new Error('lifting away sowed');
  await pt('pointerdown', b.x, b.y, '.pz-stage .pz-pit[data-pit="3"]');
  await pt('pointerup', b.x, b.y, '.pz-stage .pz-pit[data-pit="3"]');
  if (await Z(p, () => document.getElementById('tsthost').__pz.busy())) throw new Error('the first tap sowed — it should only preview');
  if ((await pv()) !== '3') throw new Error('the first tap left no preview');
  await pt('pointerdown', b.x, b.y, '.pz-stage .pz-pit[data-pit="3"]');
  await pt('pointerup', b.x, b.y, '.pz-stage .pz-pit[data-pit="3"]');
  await p.waitForTimeout(80);
  if (!(await Z(p, () => document.getElementById('tsthost').__pz.busy()))) throw new Error('the second tap did not sow');
}, { vp: PHONE, touch: true });

check('adapt', 'Gattu steps up after two wins, down after two losses, deterministically; openings rotate, each mirror-fair', async ({ p }) => {
  await go(p);
  const r = await Z(p, () => {
    const PZ = window.IND_PZ;
    let m = { tier: 0, run: [] }; const seq = [];
    for (const res of ['win', 'loss', 'win', 'win', 'win', 'win', 'loss', 'loss', 'loss', 'loss', 'loss', 'loss']) { m = PZ.adapt(m, res); seq.push(m.tier); }
    const st = PZ.fresh(PZ.OPENINGS[1], 36);
    const same = [1, 2, 3].map(() => PZ.choose(st, 4)).join();
    return { seq: seq.join(''), sums: PZ.OPENINGS.map(o => o.reduce((a, b) => a + b, 0)), same, n: PZ.OPENINGS.length };
  });
  if (r.seq !== '000112211000') throw new Error('tier sequence ' + r.seq);
  if (r.sums.some(s => s !== 35)) throw new Error('an opening is not 35 a side: ' + r.sums);
  if (new Set(r.same.split(',')).size !== 1) throw new Error('the same board got different moves');
  const opens = [];
  for (let k = 0; k < 3; k++) { await go(p); opens.push(await Z(p, () => document.getElementById('tsthost').__pz.state().pits.slice(0, 7).join(''))); }
  if (new Set(opens).size !== 3) throw new Error('openings do not rotate: ' + opens.join(' · '));
  const mirror = await Z(p, () => { const s = document.getElementById('tsthost').__pz.state().pits; return s.slice(0, 7).join() === s.slice(7).join(); });
  if (!mirror) throw new Error('an opening is not the same from Gattu’s seat');
});

check('clock', 'a hidden tab changes nothing; no pay, no answers, no right/wrong sound; ✕ gives the page back, done() is heritage', async ({ p }) => {
  await coached(p); await go(p);
  await Z(p, () => { window.IND_SFX.played.length = 0; document.getElementById('tsthost').__pz.commit(0); });
  await p.waitForTimeout(300);
  await Z(p, () => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  const a = await Z(p, () => [...document.querySelectorAll('[data-count] text')].map(t => t.textContent).join());
  await p.waitForTimeout(1500);
  const b = await Z(p, () => [...document.querySelectorAll('[data-count] text')].map(t => t.textContent).join());
  if (a !== b) throw new Error('the board moved while the tab was hidden');
  await Z(p, () => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' }); document.dispatchEvent(new Event('visibilitychange')); });
  await p.waitForTimeout(1500);
  const c = await Z(p, () => [...document.querySelectorAll('[data-count] text')].map(t => t.textContent).join());
  if (c === b) throw new Error('the board never resumed');
  await idle(p);
  const played = await Z(p, () => window.IND_SFX.played.slice());
  if (played.some(k => k === 'right' || k === 'wrong')) throw new Error('the engine played an answer sound: ' + played);
  if (!played.length) throw new Error('sowing made no sound through IND_SFX');
  await Z(p, () => document.querySelector('[data-pz="exit"]').click());
  const m = await Z(p, () => ({ full: document.querySelector('.pz-root').classList.contains('pz-full'), lock: document.documentElement.classList.contains('gm-fullscreen') }));
  if (m.full || m.lock) throw new Error('✕ did not give the page back');
  await Z(p, () => document.querySelector('.pz-over [data-go="out"]').click());
  const d = await Z(p, () => ({ d: window.__done, n: window.__doneCalls, w: window.IND_STORE && window.BI && window.BI.S ? 0 : 0 }));
  if (d.n !== 1) throw new Error('done() called ' + d.n + ' times');
  if (d.d.asked !== 0 || d.d.firstTryRight !== 0 || 'kauris' in d.d || 'sikke' in d.d) throw new Error('done() reports answers or pay: ' + JSON.stringify(d.d));
}, { vp: DESK });

const OUT = process.env.SHOTS ? process.env.SHOTS.replace(/\/?$/, '/') : require('os').tmpdir() + '/';
(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(+process.env.PORT || 0), base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && only.split(",").indexOf(c.id) < 0) continue;
    const ctx = await browser.newContext({ viewport: c.vp || DESK, serviceWorkers: 'block', hasTouch: !!c.touch });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      await skipOnboarding(p);
      await p.waitForTimeout(250);
      await c.fn({ p, ctx, base });
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
