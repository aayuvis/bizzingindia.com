#!/usr/bin/env node
/* Bizzing India — CARROM's handling (games spec §4.7, CR1–CR6; docs/32).

     registry heritage play: teaches:false, an English sub, no levels
     CR1      on 390 × 844 a match is full-screen, the board ≥ 360 px (≥ 94% of the width), the
              striker's hit area ≥ 44 px; landscape keeps the board at full height; Esc / ✕ pause
              back into the app's frame and Resume returns
     CR2      200 striker drags with up to ±20 px of downward drift (touch) and 40 with a mouse
              fire 0 shots — Place can never shoot
     CR3      every shot can be cancelled: slide into the pad's ✕, lift outside the pad, Esc on a
              held Space, release a mouse hold off the board — and a real pull still shoots
     CR4      a scripted match: no fit() or layout after the start, no engine frame over 50 ms,
              and the RAF gaps reported (the machine's own load is printed beside them)
     CR5      the aim line has a hole round an aiming finger, and the power number is never under
              the finger on the pad
     CR6      the mouse points to aim, the wheel and ‹ › turn 0.5°, ↑/↓ 1° (Shift 0.25°), ←/→
              place, hold-and-release on the board shoots, and the keyboard alone finishes a match
     coach    Place → Aim → Shoot, once, advancing on what the child does; "?" brings it back
     gattu    he thinks under 0.8 s on the game's own clock; sounds go through IND_SFX and never
              as an answer; done() reports no answers and no pay

   Each check was watched to fail by breaking the thing it holds.
   Run:  CHROME=/opt/pw-browsers/chromium NODE_PATH=… node tools/check-carrom.js [--only CR2]
*/
const os = require('os');
const { serve, mount } = require('./lib/game-mount');
const { skipOnboarding } = require('./lib/onboard');

const DESK = { width: 1280, height: 800 }, PHONE = { width: 390, height: 844 }, LAND = { width: 844, height: 390 };
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
const Z = (p, fn, arg) => p.evaluate(fn, arg);
const S = p => Z(p, () => { const s = document.getElementById('tsthost').__carState; return { phase: s.phase, turn: s.turn, sx: s.sx, aimA: s.aimA, charge: s.charge, fired: s.fired, shots: s.shots, cancels: s.cancels, dbg: { hole: s.dbg.hole, ghost: s.dbg.ghost, fits: s.dbg.fits, thinkMs: s.dbg.thinkMs } }; });
async function start(p, mode, coach) {
  if (!coach) await Z(p, () => window.IND_STORE.kidSet('carrom.coached', 'true'));
  await mount(p, 'carrom', 'games-carrom.js');
  await Z(p, m => document.querySelector('#tsthost [data-go="' + m + '"]').click(), mode || 'start');
  await p.waitForTimeout(250);
}
const geo = p => Z(p, () => {
  const c = document.querySelector('.car-canvas').getBoundingClientRect(), s = document.getElementById('tsthost').__carState;
  const k = c.width / 116, by = s.turn === 'you' ? 82 : 18;
  const pd = document.querySelector('.car-pad').getBoundingClientRect();
  return { c: { l: c.left, t: c.top, w: c.width, h: c.height }, k, striker: { x: c.left + (s.sx + 8) * k, y: c.top + (by + 8) * k }, pad: { l: pd.left, t: pd.top, w: pd.width, h: pd.height } };
});
/* a touch pointer, dispatched the way a finger's would be (Playwright's mouse is a mouse) */
const touch = (p, sel, type, x, y) => Z(p, a => {
  const el = document.querySelector(a.sel);
  el.dispatchEvent(new PointerEvent(a.type, { bubbles: true, cancelable: true, pointerId: 9, pointerType: 'touch', clientX: a.x, clientY: a.y, isPrimary: true, buttons: a.type === 'pointerup' ? 0 : 1 }));
}, { sel, type, x, y });

check('registry', 'heritage play: teaches:false, an English sub, no levels', async ({ p }) => {
  await mount(p, 'carrom', 'games-carrom.js');
  const g = await Z(p, () => { const g = window.IND_GAMES.filter(x => x.id === 'carrom'); return { n: g.length, teaches: g[0].teaches, sub: g[0].sub, levels: g[0].levels }; });
  if (g.n !== 1 || g.teaches !== false || !g.sub || g.levels) throw new Error(JSON.stringify(g));
});

check('CR1', 'on 390 × 844 the match is full-screen, the board ≥ 360 px, the striker’s hit area ≥ 44 px; landscape at full height; Esc pauses', async ({ p, ctx }) => {
  await start(p);
  const g = await geo(p);
  const m = await Z(p, () => { const r = document.querySelector('.car-wrap').getBoundingClientRect(); return { full: document.querySelector('.car-wrap').classList.contains('car-full'), lock: document.documentElement.classList.contains('gm-fullscreen'), r: [r.left, r.top, r.width, r.height] }; });
  if (!m.full || !m.lock || m.r.join() !== '0,0,390,844') throw new Error('not full-screen: ' + JSON.stringify(m));
  if (g.c.w < 360 || g.c.w < 390 * 0.94) throw new Error('the board is ' + g.c.w + ' px wide');
  if (g.c.t < 0 || g.c.t + g.c.h > 844 || g.pad.t + g.pad.h > 844) throw new Error('the board or the pad is off the screen');
  /* the hit area: a finger 22 px off the striker's centre still grabs it (≥ 44 px across) */
  const s0 = (await S(p)).sx;
  await touch(p, '.car-canvas', 'pointerdown', g.striker.x + 22, g.striker.y);
  await touch(p, '.car-canvas', 'pointermove', g.striker.x + 52, g.striker.y);
  await touch(p, '.car-canvas', 'pointerup', g.striker.x + 52, g.striker.y);
  const s1 = await S(p);
  if (!(s1.sx > s0 + 5)) throw new Error('a touch 22 px from the striker’s centre did not grab it (' + s0.toFixed(1) + ' → ' + s1.sx.toFixed(1) + ')');
  if (s1.fired) throw new Error('grabbing the striker fired');
  await p.screenshot({ path: OUT + 'carrom-phone.png' });
  await p.keyboard.press('Escape');
  const ps = await Z(p, () => ({ full: document.querySelector('.car-wrap').classList.contains('car-full'), lock: document.documentElement.classList.contains('gm-fullscreen'), card: !document.querySelector('.car-over').hidden }));
  if (ps.full || ps.lock || !ps.card) throw new Error('Esc did not pause back into the frame');
  await Z(p, () => document.querySelector('[data-go="resume"]').click());
  if (!(await Z(p, () => document.querySelector('.car-wrap').classList.contains('car-full')))) throw new Error('Resume did not return to full-screen');
  /* landscape: the board at full height */
  const q = await ctx.newPage();
  await q.setViewportSize(LAND);
  await q.goto(p.url(), { waitUntil: 'networkidle' }); await skipOnboarding(q); await q.waitForTimeout(200);
  await start(q);
  const lg = await geo(q);
  if (lg.c.h < (390 - 52) * 0.92) throw new Error('landscape board is ' + lg.c.h + ' px tall of 390');
  if (lg.pad.l < lg.c.l + lg.c.w) throw new Error('landscape pad is not beside the board');
  await q.screenshot({ path: OUT + 'carrom-land.png' });
  await q.close();
}, { vp: PHONE, touch: true });

check('CR2', 'Place never fires: 200 touch drags with ±20 px downward drift and 40 mouse drags → 0 shots', async ({ p }) => {
  await start(p);
  let seed = 17; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let moved = 0;
  for (let k = 0; k < 200; k++) {
    const g = await geo(p);
    const x0 = g.striker.x + (rnd() - 0.5) * 16, y0 = g.striker.y + (rnd() - 0.5) * 16;
    const dx = (rnd() - 0.5) * 140, drift = (rnd() * 2 - 1) * 20;
    const before = (await S(p)).sx;
    await touch(p, '.car-canvas', 'pointerdown', x0, y0);
    for (let s = 1; s <= 5; s++) await touch(p, '.car-canvas', 'pointermove', x0 + dx * s / 5, y0 + Math.abs(drift) * s / 5 * (drift < 0 ? -0.2 : 1));
    await touch(p, '.car-canvas', 'pointerup', x0 + dx, y0 + drift);
    if (Math.abs((await S(p)).sx - before) > 0.5) moved++;
  }
  for (let k = 0; k < 40; k++) {
    const g = await geo(p);
    await p.mouse.move(g.striker.x, g.striker.y); await p.mouse.down();
    await p.mouse.move(g.striker.x + (rnd() - 0.5) * 120, g.striker.y + rnd() * 20, { steps: 4 });
    await p.mouse.up();
  }
  const s = await S(p);
  if (s.fired || s.phase !== 'aim') throw new Error(s.fired + ' shots fired by dragging the striker');
  if (moved < 150) throw new Error('only ' + moved + ' of 200 drags moved the striker — the drag is not reaching it');
}, { vp: PHONE, touch: true });

check('CR3', 'every shot can be cancelled — the pad’s ✕, lifting off the pad, Esc on Space, a mouse released off the board — and a real pull shoots', async ({ p }) => {
  await start(p);
  let g = await geo(p);
  const py = g.pad.t + g.pad.h / 2, x0 = g.pad.l + 70;
  /* slide back into ✕ */
  await touch(p, '.car-pad', 'pointerdown', x0, py);
  await touch(p, '.car-pad', 'pointermove', x0 + 150, py);
  if (!((await S(p)).charge > 0.3)) throw new Error('pulling the pad sets no power');
  await touch(p, '.car-pad', 'pointermove', g.pad.l + 20, py);
  await touch(p, '.car-pad', 'pointerup', g.pad.l + 20, py);
  let s = await S(p);
  if (s.fired || s.charge) throw new Error('sliding into ✕ still shot (' + s.fired + ', power ' + s.charge + ')');
  /* lift outside the pad */
  await touch(p, '.car-pad', 'pointerdown', x0, py);
  await touch(p, '.car-pad', 'pointermove', x0 + 150, py);
  await touch(p, '.car-pad', 'pointermove', x0 + 150, py - 220);
  await touch(p, '.car-pad', 'pointerup', x0 + 150, py - 220);
  s = await S(p);
  if (s.fired || s.charge) throw new Error('lifting off the pad still shot');
  /* Esc on a held Space */
  await p.keyboard.down(' '); await p.waitForTimeout(350);
  if (!((await S(p)).charge > 0)) throw new Error('holding Space sets no power');
  await p.keyboard.press('Escape'); await p.keyboard.up(' ');
  s = await S(p);
  if (s.fired || s.charge) throw new Error('Esc did not cancel a held Space');
  if (!(await Z(p, () => document.querySelector('.car-wrap').classList.contains('car-full')))) throw new Error('Esc on a held shot paused the game instead of only cancelling');
  /* and a real pull, released on the pad, shoots — so the check can see a shot when there is one */
  g = await geo(p);
  await touch(p, '.car-pad', 'pointerdown', x0, py);
  await touch(p, '.car-pad', 'pointermove', x0 + 120, py);
  await touch(p, '.car-pad', 'pointerup', x0 + 120, py);
  s = await S(p);
  if (s.fired !== 1) throw new Error('a pull released on the pad did not shoot');
}, { vp: PHONE, touch: true });

check('CR3m', 'desktop: a mouse hold on the board released off it is cancelled', async ({ p }) => {
  await start(p);
  const g = await geo(p);
  await p.mouse.move(g.c.l + g.c.w * 0.4, g.c.t + g.c.h * 0.4); await p.mouse.down(); await p.waitForTimeout(300);
  await p.mouse.move(g.c.l + g.c.w + 120, g.c.t + 20, { steps: 3 }); await p.mouse.up();
  const s = await S(p);
  if (s.fired || s.charge) throw new Error('a mouse hold released off the board still shot');
}, { vp: DESK });

check('CR4', 'a scripted match: no fit() after the start, no engine frame over 50 ms (RAF gaps reported)', async ({ p }) => {
  await start(p, 'short');
  const fits0 = (await S(p)).dbg.fits;
  await Z(p, () => { window.__gaps = []; let l = 0; (function f(ts) { if (l) window.__gaps.push(ts - l); l = ts; if (!window.__stopGaps) requestAnimationFrame(f); })(performance.now()); document.getElementById('tsthost').__carState.dbg.work.length = 0; });
  const t0 = Date.now();
  let turns = 0;
  while (Date.now() - t0 < 25000) {
    const s = await S(p);
    if (s.phase === 'over') break;
    if (s.phase === 'aim' && s.turn === 'you') {
      for (let k = 0; k < (turns % 5); k++) await p.keyboard.press(turns % 2 ? 'ArrowUp' : 'ArrowDown');
      await p.keyboard.down(' '); await p.waitForTimeout(250 + (turns % 4) * 150); await p.keyboard.up(' ');
      turns++;
    }
    await p.waitForTimeout(150);
  }
  const r = await Z(p, () => { window.__stopGaps = 1; const w = document.getElementById('tsthost').__carState.dbg.work.slice(); return { gaps: window.__gaps.slice(5), work: w, slow: document.getElementById('tsthost').__carState.dbg.slow.slice(-6), fits: document.getElementById('tsthost').__carState.dbg.fits }; });
  const q = (a, f) => { const b = a.slice().sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.floor(b.length * f))] || 0; };
  const load = os.loadavg()[0].toFixed(1);
  console.log(`         ${turns} shots · ${r.work.length} engine frames: work p50 ${q(r.work, .5).toFixed(2)} max ${q(r.work, 1).toFixed(1)} ms · RAF gaps p50 ${q(r.gaps, .5).toFixed(1)} p95 ${q(r.gaps, .95).toFixed(1)} max ${q(r.gaps, 1).toFixed(1)} ms (load ${load} on ${os.cpus().length} cpus)`);
  if (r.slow.length) console.log('         slowest engine frames: ' + r.slow.map(x => x[0] + 'ms ' + x[1]).join(' · '));
  if (turns < 2) throw new Error('the scripted match never got to shoot');
  if (r.fits !== fits0) throw new Error('fit() ran ' + (r.fits - fits0) + ' times during play');
  if (q(r.work, 1) > 50) throw new Error('an engine frame took ' + q(r.work, 1).toFixed(1) + ' ms');
  /* the RAF gap itself is the machine's as much as the game's: held strictly when asked */
  if (process.env.STRICT_FRAMES && q(r.gaps, 1) > 50) throw new Error('a frame gap of ' + q(r.gaps, 1).toFixed(1) + ' ms');
}, { vp: DESK });

check('CR5', 'the aim line has a hole round an aiming finger; the power number is never under the finger', async ({ p }) => {
  await start(p);
  const g = await geo(p);
  const ax = g.c.l + g.c.w * 0.3, ay = g.c.t + g.c.h * 0.35;
  await touch(p, '.car-canvas', 'pointerdown', ax, ay);
  await touch(p, '.car-canvas', 'pointermove', ax + 10, ay + 4);
  await p.waitForTimeout(80);
  const s = await S(p);
  const fx = (ax + 10 - g.c.l) / g.k - 8, fy = (ay + 4 - g.c.t) / g.k - 8;
  if (!s.dbg.hole) throw new Error('no hole is cut round the aiming finger');
  if (Math.hypot(s.dbg.hole.x - fx, s.dbg.hole.y - fy) > 0.5 || s.dbg.hole.r * g.k < 22) throw new Error('the hole is not round the finger, or under 22 px: ' + JSON.stringify(s.dbg.hole));
  const aim = Math.atan2(fy - (82), fx - s.sx);
  if (Math.abs(aim - s.aimA) > 0.02) throw new Error('the aim does not point at the finger');
  await touch(p, '.car-canvas', 'pointerup', ax + 10, ay + 4);
  const px = g.pad.l + 90, py = g.pad.t + g.pad.h / 2;
  await touch(p, '.car-pad', 'pointerdown', px, py);
  await touch(p, '.car-pad', 'pointermove', px + 110, py);
  await p.waitForTimeout(60);
  const pw = await Z(p, () => { const e = document.querySelector('.car-pow'), r = e.getBoundingClientRect(); return { on: e.classList.contains('on'), r: [r.left, r.top, r.right, r.bottom], txt: e.textContent }; });
  if (!pw.on || !/^\d+$/.test(pw.txt)) throw new Error('no power number while pulling: ' + JSON.stringify(pw));
  const fxp = px + 110, dx = Math.max(pw.r[0] - fxp, 0, fxp - pw.r[2]), dy = Math.max(pw.r[1] - py, 0, py - pw.r[3]);
  if (Math.hypot(dx, dy) < 22) throw new Error('the power number sits under the finger: ' + pw.r.map(Math.round));
  await touch(p, '.car-pad', 'pointermove', g.pad.l + 10, py);
  await touch(p, '.car-pad', 'pointerup', g.pad.l + 10, py);
}, { vp: PHONE, touch: true });

check('CR6', 'desktop: the mouse points to aim, wheel and ‹ › 0.5°, ↑/↓ 1° (Shift 0.25°), ←/→ place, hold-and-release shoots', async ({ p }) => {
  await start(p);
  const g = await geo(p);
  const tx = g.c.l + g.c.w * 0.7, ty = g.c.t + g.c.h * 0.3;
  await p.mouse.move(tx, ty, { steps: 3 });
  let s = await S(p);
  const want = Math.atan2((ty - g.c.t) / g.k - 8 - 82, (tx - g.c.l) / g.k - 8 - s.sx);
  if (Math.abs(want - s.aimA) > 0.01) throw new Error('pointing does not aim: ' + s.aimA.toFixed(3) + ' vs ' + want.toFixed(3));
  const a0 = s.aimA, d = x => Math.round(x * 180 / Math.PI * 100) / 100;
  await p.mouse.wheel(0, 100); await p.waitForTimeout(50);
  let a1 = (await S(p)).aimA;
  if (Math.abs(d(a1 - a0) - 0.5) > 0.01) throw new Error('the wheel turned ' + d(a1 - a0) + '°');
  await Z(p, () => document.querySelector('[data-nudge="-1"]').click());
  let a2 = (await S(p)).aimA;
  if (Math.abs(d(a2 - a1) + 0.5) > 0.01) throw new Error('‹ turned ' + d(a2 - a1) + '°');
  await p.mouse.move(g.c.l + g.c.w + 100, g.c.t + 10);
  await p.keyboard.press('ArrowUp'); let a3 = (await S(p)).aimA;
  if (Math.abs(d(a3 - a2) + 1) > 0.01) throw new Error('↑ turned ' + d(a3 - a2) + '°');
  await p.keyboard.press('Shift+ArrowDown'); let a4 = (await S(p)).aimA;
  if (Math.abs(d(a4 - a3) - 0.25) > 0.01) throw new Error('Shift+↓ turned ' + d(a4 - a3) + '°');
  const x0 = (await S(p)).sx; await p.keyboard.press('ArrowLeft');
  if (Math.abs((await S(p)).sx - (x0 - 1)) > 0.01) throw new Error('← did not place the striker one unit left');
  await p.mouse.move(tx, ty); await p.mouse.down(); await p.waitForTimeout(400); await p.mouse.up();
  s = await S(p);
  if (s.fired !== 1) throw new Error('hold and release on the board did not shoot');
  const played = await Z(p, () => window.IND_SFX ? window.IND_SFX.played.slice() : []);
  if (!played.length) throw new Error('the shot made no sound through IND_SFX');
  if (played.some(k => k === 'right' || k === 'wrong')) throw new Error('carrom played an answer sound');
}, { vp: DESK });

check('CR6k', 'the keyboard alone finishes a Short match (and Gattu thinks under 0.8 s)', async ({ p }) => {
  await start(p, 'short');
  const t0 = Date.now();
  let think = [];
  while (Date.now() - t0 < 240000) {
    const s = await Z(p, () => { const s = document.getElementById('tsthost').__carState; return { phase: s.phase, turn: s.turn, think: s.dbg.thinkMs, sx: s.sx, aimA: s.aimA,
      coins: s.bodies.filter(b => b.kind === 'coin' && b.owner === 'you' && !b.dead).map(b => [b.x, b.y]) }; });
    if (s.think != null) think.push(s.think);
    if (s.phase === 'over') break;
    if (s.phase === 'aim' && s.turn === 'you' && s.coins.length) {
      /* aim straight at the nearest white with ↑/↓ (Shift for the last bit), then hold Space */
      const c = s.coins.sort((a, b) => (Math.abs(a[0] - 50) + (82 - a[1])) - (Math.abs(b[0] - 50) + (82 - b[1])))[0];
      const want = Math.atan2(c[1] - 82, c[0] - s.sx);
      let diff = (want - s.aimA) * 180 / Math.PI;
      const big = Math.trunc(diff), small = Math.round((diff - big) / 0.25);
      for (let k = 0; k < Math.abs(big) && k < 170; k++) await p.keyboard.press(big > 0 ? 'ArrowDown' : 'ArrowUp');
      for (let k = 0; k < Math.abs(small); k++) await p.keyboard.press(small > 0 ? 'Shift+ArrowDown' : 'Shift+ArrowUp');
      await p.keyboard.down(' '); await p.waitForTimeout(700); await p.keyboard.up(' ');
    }
    await p.waitForTimeout(200);
  }
  const s = await S(p);
  if (s.phase !== 'over') throw new Error('the keyboard match did not finish in 4 minutes');
  think = think.filter(x => x != null);
  if (!think.length || Math.max(...think) > 820) throw new Error('Gattu thought ' + Math.max(...think) + ' ms of game time');
  /* finish: the frame comes back, done() is heritage */
  await Z(p, () => document.querySelector('.car-over [data-go="out"]').click());
  const d = await Z(p, () => ({ d: window.__done, n: window.__doneCalls, lock: document.documentElement.classList.contains('gm-fullscreen') }));
  if (d.n !== 1 || d.lock) throw new Error('done() ' + d.n + ' times, full-screen left on: ' + d.lock);
  if (d.d.asked !== 0 || d.d.firstTryRight !== 0 || 'kauris' in d.d) throw new Error('done() reports answers or pay: ' + JSON.stringify(d.d));
}, { vp: DESK });

check('coach', 'the first-shot coach: Place → Aim → Shoot, advancing on what the child does, once; "?" replays it', async ({ p }) => {
  await start(p, 'start', true);
  const step0 = () => Z(p, () => { const t = document.querySelector('.car-coach:not([hidden]) .car-tip'); return t ? t.textContent.slice(0, 9) : ''; });
  /* the coach moves on the game's own clock, which a loaded machine slows: wait for it, briefly */
  let want = '';
  const step = async () => { for (let k = 0; k < 40; k++) { const s = await step0(); if (!want || s.indexOf(want) === 0) return s; await p.waitForTimeout(150); } return step0(); };
  if (!/^1 · Place/.test(await step())) throw new Error('the coach does not open on Place: ' + await step());
  for (let k = 0; k < 5; k++) await p.keyboard.press('ArrowRight');
  want = '2 · Aim';
  if (!/^2 · Aim/.test(await step())) throw new Error('placing did not move the coach to Aim: ' + await step());
  for (let k = 0; k < 4; k++) await p.keyboard.press('ArrowUp');
  want = '3 · Shoot';
  if (!/^3 · Shoot/.test(await step())) throw new Error('aiming did not move the coach to Shoot: ' + await step());
  await p.keyboard.down(' '); await p.waitForTimeout(300); await p.keyboard.up(' ');
  want = '';
  await p.waitForTimeout(100);
  if (await step0()) throw new Error('the coach stays after the first shot');
  if ((await Z(p, () => window.IND_STORE.kidGet('carrom.coached'))) !== 'true') throw new Error('the coach is not remembered');
  for (let w = 0; w < 120; w++) { const s = await S(p); if (s.phase === 'aim' && s.turn === 'you') break; await p.waitForTimeout(150); }
  await Z(p, () => document.querySelector('[data-go="coach"]').click());
  if (!/^1 · Place/.test(await step0())) throw new Error('"?" does not replay the coach');
}, { vp: DESK });

const OUT = process.env.SHOTS ? process.env.SHOTS.replace(/\/?$/, '/') : os.tmpdir() + '/';
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
