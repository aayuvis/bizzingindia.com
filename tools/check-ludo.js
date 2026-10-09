#!/usr/bin/env node
/* Bizzing India — Ludo, with Saap-Sidi inside it (games spec §4.6, docs/32).

     L1 quick     Jaldi with two Gattus finishes in five minutes of the game's own clock, on
                  five fixed dice sequences (the page's clock is fast-forwarded, not skipped)
     L2 onemove   no tap is ever asked for when only one move is legal: a choice only ever
                  shows two or more moves, and a lone move makes itself (keyboard play)
     L3 family    four players passing one device finish a game, by touch alone
     L4 yard      with every token in the yard and no six, the line is "You need a 6 to
                  bring a token out" — never the exact-number reason
     L5 nocount   the engine reports no answers, draws no "N right", carries none of the
                  classes the old host read as answers, and pays nothing
     chips        a choice names each destination (safe star / captures / risky / reaches
                  home / comes out), and Gattu's tier moves one step after two games running
     sounds       the die, the steps, a token home: through IND_SFX, nowhere else
     saapsidi     the old link opens Ludo on its Saap-Sidi tab; the hub hides that entry; the
                  youngest band taps its own landing square, and a ladder's virtue is said aloud
                  with its meaning
     shots        desktop and phone, start screen and board, day and night — written to
                  /tmp/ludo-shots for a person to look at

   Each was watched to fail by breaking the thing it holds.
   Run:  CHROME=/opt/pw-browsers/chromium NODE_PATH=../node_modules node tools/check-ludo.js [--only id]
*/
const fs = require('fs');
const path = require('path');
const http = require('http');

const APP = path.join(__dirname, '..', 'app');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp' };
/* A bare stage: the engines mounted straight from window.IND_GAMES with stub opts, so the
   check holds the engine whatever the host around it is doing. */
const STAGE = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="fonts.css"><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="app.css">
<style>html,body{margin:0;background:var(--ground);color:var(--text);font-family:var(--body,system-ui)}#host{max-width:1100px;margin:0 auto;padding:16px}</style>
</head><body><div id="host"></div>
<script>
  var KV = {};
  window.IND_STORE = { kidGet: function (k) { return k in KV ? KV[k] : null; }, kidSet: function (k, v) { KV[k] = String(v); } };
  window.BI = { Store: { kids: function () { return [{ id: 'k1', name: 'Asha', buddy: 'pt_rabbit', active: true }, { id: 'k2', name: 'Ravi', buddy: 'pt_monkey', active: false }]; } }, S: { name: 'Asha', buddy: 'pt_rabbit' } };
  window.IND_ART_SRC = function (id) { return id === 'gattu' ? 'art/gattu.png' : /^pt_|^mor$/.test(id) ? 'art/av/' + id + '.webp' : ''; };
  window.IND_BUDDY_TIER = function (id) { return /^pt_/.test(id) ? 'tales' : 'people'; };
  window.__said = [];
  try { window.speechSynthesis.speak = function (u) { window.__said.push(u.text); }; } catch (e) {}
  window.mount = function (id, opts) {
    var host = document.getElementById('host'), g = (window.IND_GAMES || []).filter(function (x) { return x.id === id; })[0];
    if (window.__td) { try { window.__td(); } catch (e) {} }
    host.innerHTML = ''; window.__answers = []; window.__done = null;
    opts = opts || {}; opts.answer = function (r) { window.__answers.push(r); };
    window.__td = g.engine(host, opts, function (r) { window.__done = r; });
    return !!g;
  };
</script>
<script src="sfx.js"></script><script src="games.js"></script><script src="games-arcade.js"></script>
</body></html>`;
function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/__stage.html') { res.writeHead(200, { 'content-type': 'text/html' }).end(STAGE); return; }
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(APP, p);
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404).end('no'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(+process.env.PORT || 0, '127.0.0.1', () => r(s)));
}

const DESK = { width: 1280, height: 860 }, PHONE = { width: 390, height: 844 };
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
/* a fixed dice sequence: Math.random replaced by a seeded generator before anything loads */
const seeded = seed => `(function(){var s=${seed}>>>0;Math.random=function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};})();`;
const st = p => p.evaluate(() => { const L = document.getElementById('host').__ludo; return L ? { view: L.view, phase: L.phase, cur: L.cur,
  n: L.moves.length, bot: L.seats[L.cur] && L.seats[L.cur].kind === 'gattu', seats: L.seats.length } : null; });
const click = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no ' + s); e.click(); }, sel);
const feed = p => p.evaluate(() => (document.querySelector('.lu-feed') || {}).textContent || '');
const setSeatTo = async (p, i, name) => {
  for (let k = 0; k < 8; k++) {
    const nm = await p.evaluate(i => document.querySelectorAll('.lu-seat .lu-sname')[i].textContent, i);
    if (nm === name || nm.indexOf(name + ' ') === 0) return;
    await click(p, `[data-go="who"][data-v="${i}"]`);
  }
  throw new Error('seat ' + i + ' never became ' + name);
};

/* Play to the end on the page's own clock. `act` decides what a person does at each beat;
   `watch` sees every state. Returns the virtual milliseconds the game took. */
async function playOut(p, act, watch, limitMs) {
  let t = 0;
  while (t < limitMs) {
    const s = await st(p);
    if (!s || s.view !== 'play') return t;
    if (watch) await watch(s);
    if (!s.bot && (s.phase === 'roll' || s.phase === 'choose' || s.phase === 'count')) await act(s);
    await p.clock.runFor(250); t += 250;
  }
  return t;
}

check('quick', 'L1: Jaldi with two Gattus finishes in five minutes of game time, on five dice sequences', async ({ browser }) => {
  const times = [];
  for (const seed of [11, 23, 37, 41, 59]) {
    const ctx = await browser.newContext({ viewport: DESK });
    const p = await ctx.newPage();
    await p.addInitScript(seeded(seed));
    await p.clock.install();
    await p.goto(BASE + '__stage.html');
    await p.evaluate(() => mount('ludo', { band: '8-10' }));
    await click(p, '[data-go="len"][data-v="jaldi"]');
    await setSeatTo(p, 0, 'Gattu');
    await click(p, '.lu-start');
    const ms = await playOut(p, async () => { throw new Error('a person was asked to act in a game of two bots'); }, null, 15 * 60 * 1000 + 1);
    times.push(ms);
    const s = await st(p);
    if (!s || s.view !== 'over') throw new Error('seed ' + seed + ': two Gattus did not finish in 15 game minutes');
    await ctx.close();
  }
  const worst = Math.max.apply(null, times);
  if (worst > 5 * 60 * 1000) throw new Error('a Jaldi game took ' + (worst / 60000).toFixed(1) + ' min: ' + times.map(x => (x / 60000).toFixed(1)).join(', '));
  console.log('         Jaldi, two Gattus: ' + times.map(x => (x / 60000).toFixed(1) + ' min').join(' · '));
}, { own: true, needsStart: false });

/* the person's half of a keyboard game: Space rolls, a number key picks */
const keyboardHuman = (p, log) => async s => {
  if (s.phase === 'roll') { await p.evaluate(() => document.activeElement && document.activeElement.blur()); await p.keyboard.press('Space'); }
  else if (s.phase === 'choose') { log.choices++; await p.keyboard.press('1'); }
};

check('onemove', 'L2: a choice is only ever offered between two or more moves; a lone move makes itself (keyboard)', async ({ p }) => {
  await p.evaluate(() => mount('ludo', { band: '8-10' }));
  await click(p, '[data-go="len"][data-v="classic"]');
  await click(p, '.lu-start');
  const log = { choices: 0, lone: 0, bad: [] };
  let lastPhase = '';
  const ms = await playOut(p, keyboardHuman(p, log), async s => {
    if (s.phase === 'choose' && s.n < 2) log.bad.push('a choice of ' + s.n);
    const f = await feed(p);
    if (/one move, and it makes itself/.test(f) && lastPhase !== f) { log.lone++; lastPhase = f; }
  }, 40 * 60 * 1000);
  const s = await st(p);
  if (log.bad.length) throw new Error(log.bad[0] + ' — a tap was asked for with only one legal move');
  if (!log.lone) throw new Error('no lone move ever made itself in a whole game');
  if (!log.choices) throw new Error('no real choice came up in a whole Classic game');
  if (s.view !== 'over') throw new Error('the game did not finish in 40 game minutes (' + s.phase + ')');
  console.log(`         Classic vs Gattu: ${(ms / 60000).toFixed(1)} min, ${log.choices} choices, ${log.lone}+ lone moves made by themselves`);
}, { clock: true, seed: 7 });

check('family', 'L3: four players pass one device and finish a game, by touch alone', async ({ p }) => {
  await p.evaluate(() => mount('ludo', { band: '8-10' }));
  await click(p, '[data-go="len"][data-v="jaldi"]');
  await click(p, '[data-go="count"][data-v="4"]');
  await setSeatTo(p, 1, 'Grown-up');
  const seats = await p.evaluate(() => [...document.querySelectorAll('.lu-seat')].map(li => li.querySelector('.lu-sname').textContent + '|' + li.style.getPropertyValue('--sc')));
  if (seats.length !== 4) throw new Error(seats.length + ' seats, not four');
  if (new Set(seats.map(x => x.split('|')[1])).size !== 4) throw new Error('two seats share a colour: ' + seats.join(', '));
  if (new Set(seats.map(x => x.split('|')[0])).size !== 4) throw new Error('two seats share a name: ' + seats.join(', '));
  await click(p, '[data-go="col"][data-v="0"]');   /* a colour can be changed, to one nobody holds */
  const after = await p.evaluate(() => [...document.querySelectorAll('.lu-seat')].map(li => li.style.getPropertyValue('--sc')));
  if (new Set(after).size !== 4) throw new Error('changing a colour gave two seats one colour');
  await click(p, '.lu-start');
  const s0 = await st(p);
  if (s0.seats !== 4) throw new Error('the board seated ' + s0.seats);
  const turns = new Set();
  await playOut(p, async s => {
    turns.add(s.cur);
    if (s.phase === 'roll') await click(p, '.arc-die');
    else if (s.phase === 'choose') await click(p, '.lu-choice');
  }, null, 40 * 60 * 1000);
  const s = await st(p);
  if (s.view !== 'over') throw new Error('four players did not finish');
  if (turns.size !== 4) throw new Error('only ' + turns.size + ' of the four seats ever took a turn');
  const places = await p.evaluate(() => document.querySelectorAll('.lu-places li').length);
  if (places !== 4) throw new Error('the finish lists ' + places + ' places');
}, { clock: true, seed: 5 });

check('yard', 'L4: every token in the yard and no six says "You need a 6 to bring a token out"', async ({ p }) => {
  await p.evaluate(() => mount('ludo', { band: '8-10' }));
  await click(p, '[data-go="len"][data-v="classic"]');
  await click(p, '.lu-start');
  let seen = '';
  for (let k = 0; k < 60 && !seen; k++) {
    const s = await st(p);
    if (!s.bot && s.phase === 'roll') {
      await click(p, '.arc-die');
      await p.clock.runFor(900);
      const allIn = await p.evaluate(() => document.getElementById('host').__ludo.seats[0].T.every(x => x === -1));
      const f = await feed(p);
      if (allIn && !/rolled 6|six/.test(f) && !/roll again/.test(f)) seen = f;
      if (/exact number/.test(f) && allIn) throw new Error('with every token in the yard it said: ' + f);
    } else await p.clock.runFor(300);
  }
  if (!/^You need a 6 to bring a token out\.?$/.test(seen)) throw new Error('the yard line was: "' + seen + '"');
}, { clock: true, seed: 3 });

check('nocount', 'L5: no answers reported, no "N right", no answer classes, and done pays nothing', async ({ p }) => {
  await p.evaluate(() => mount('ludo', { band: '8-10' }));
  await click(p, '.lu-start');
  const bad = [];
  await playOut(p, async s => {
    if (s.phase === 'roll') await click(p, '.arc-die'); else if (s.phase === 'choose') await click(p, '.lu-choice');
  }, async () => {
    const m = await p.evaluate(() => {
      const h = document.getElementById('host');
      return { txt: /\b\d+\s+right\b|right this game/i.test(h.textContent), cls: !!h.querySelector('.good,.warm,.is-right,.is-warm,.gf-rights') };
    });
    if (m.txt) bad.push('a right-counter is drawn'); if (m.cls) bad.push('an answer class is on the board');
  }, 20 * 60 * 1000);
  if (bad.length) throw new Error(bad[0]);
  await click(p, '[data-go="out"]');
  const r = await p.evaluate(() => ({ a: window.__answers.length, d: window.__done }));
  if (r.a) throw new Error(r.a + ' answers reported by a game that has none');
  if (!r.d) throw new Error('Finish did not end the game');
  if (r.d.asked || r.d.firstTryRight || r.d.kauris) throw new Error('done carries a pay or answer field: ' + JSON.stringify(r.d));
  const reg = await p.evaluate(() => { const g = IND_GAMES.filter(x => x.id === 'ludo')[0]; return { t: g.teaches, sub: g.sub }; });
  if (reg.t !== false || !reg.sub) throw new Error('the ludo entry must say teaches:false and carry a sub');
}, { clock: true, seed: 9 });

check('chips', 'every destination named; Gattu\'s tier moves one step after two games running, deterministically', async ({ p }) => {
  await p.evaluate(() => mount('ludo', { band: '8-10' }));
  await click(p, '[data-go="len"][data-v="classic"]');
  await click(p, '.lu-start');
  /* a set position: a 5 from here offers a star, a capture, a risk and home */
  await p.evaluate(() => { const L = document.getElementById('host').__ludo; L.seats[0].T = [3, 10, 30, 51]; L.seats[1].T = [41, 5, -1, -1]; Math.random = () => 0.7; });
  await click(p, '.arc-die');
  await p.clock.runFor(1200);
  const L = await p.evaluate(() => ({ ch: [...document.querySelectorAll('.lu-choice')].map(b => b.textContent.replace(/^\d/, '')),
    marks: document.querySelectorAll('[data-marks] .lu-mark').length, phase: document.getElementById('host').__ludo.phase }));
  const want = ['safe star', 'captures Gattu', 'next to Gattu — risky', 'reaches home'];
  if (L.ch.join('|') !== want.join('|')) throw new Error('the four moves were named: ' + L.ch.join(' / '));
  if (L.marks !== 4) throw new Error(L.marks + ' destinations marked on the board for four chips');
  await p.keyboard.press('2'); await p.clock.runFor(3000);
  const T = await p.evaluate(() => document.getElementById('host').__ludo.seats.map(s => s.T.join(',')));
  if (T[1].split(',')[0] !== '-1') throw new Error('the capture did not send Gattu home: ' + T.join(' | '));
  /* the tier: two family wins → up one; two Gattu wins → down one; alternating → unchanged */
  const t = await p.evaluate(() => {
    const A = window.IND_GAMES_TEST.ludoAdapt, r = [];
    let m = { tier: 1, run: 0 }; A(m, true); r.push(m.tier); A(m, true); r.push(m.tier);
    m = { tier: 1, run: 0 }; A(m, false); A(m, false); r.push(m.tier);
    m = { tier: 1, run: 0 }; A(m, true); A(m, false); A(m, true); A(m, false); r.push(m.tier);
    m = { tier: 2, run: 0 }; A(m, true); A(m, true); r.push(m.tier);
    return r;
  });
  if (t.join() !== '1,2,0,1,2') throw new Error('tier walk ' + t.join() + ', wanted 1,2,0,1,2');
}, { clock: true, seed: 13 });

check('sounds', 'the die, the steps and a token home sound through IND_SFX', async ({ p }) => {
  await p.evaluate(() => mount('ludo', { band: '8-10' }));
  await click(p, '[data-go="len"][data-v="jaldi"]');
  await click(p, '.lu-start');
  await playOut(p, async s => {
    if (s.phase === 'roll') await click(p, '.arc-die'); else if (s.phase === 'choose') await click(p, '.lu-choice');
  }, null, 20 * 60 * 1000);
  const played = await p.evaluate(() => window.IND_SFX.played.slice());
  if (played.indexOf('tap') < 0) throw new Error('no die or step sound');
  if (played.indexOf('win') < 0 && played.indexOf('medal') < 0) throw new Error('no home or capture sound: ' + played.slice(-10).join(','));
  if (played.indexOf('right') >= 0 || played.indexOf('wrong') >= 0) throw new Error('the board played an answer sound');
  const src = fs.readFileSync(path.join(APP, 'games-arcade.js'), 'utf8');
  if (/AudioContext|new Audio\(/.test(src)) throw new Error('games-arcade.js makes its own sound');
  if (/in a row|streak/i.test(src)) throw new Error('streak copy in games-arcade.js');
}, { clock: true, seed: 17 });

check('saapsidi', 'the old link lands on Saap-Sidi; hidden from the hub; the youngest tap their square; a virtue said aloud', async ({ p }) => {
  const reg = await p.evaluate(() => { const g = IND_GAMES.filter(x => x.id === 'saapsidi')[0]; return g ? { hide: g.hide, t: g.teaches } : null; });
  if (!reg || reg.hide !== true || reg.t !== false) throw new Error('the saapsidi entry must stay, hidden, teaching nothing: ' + JSON.stringify(reg));
  await p.evaluate(() => mount('saapsidi', { band: '4-7' }));
  const tab = await p.evaluate(() => (document.querySelector('.lu-segb[aria-selected="true"]') || {}).textContent || '');
  if (!/Saap-Sidi/.test(tab)) throw new Error('the old link opened on ' + tab);
  await click(p, '.lu-start');
  /* a 3 from square 1 lands on 4 — Daya's ladder */
  await p.evaluate(() => { Math.random = () => 0.4; });
  await click(p, '.arc-die');
  await p.clock.runFor(900);
  let s = await st(p);
  if (s.phase !== 'count') throw new Error('the youngest band was not asked to count (' + s.phase + ')');
  const f = await feed(p);
  if (/\b4\b/.test(f.replace(/rolled \d|Count \d|square 1\b/g, ''))) throw new Error('the count line gives the answer away: ' + f);
  const tapSq = async sq => p.evaluate(sq => {
    const svg = document.querySelector('.lu-ssboard svg'), r = svg.getBoundingClientRect();
    const i = sq - 1, br = Math.floor(i / 10); let c = i % 10; if (br % 2) c = 9 - c; const row = 9 - br;
    const x = r.left + (4 + (c + 0.5) * 10) / 108 * r.width, y = r.top + (4 + (row + 0.5) * 10) / 108 * r.height;
    const el = document.elementFromPoint(x, y);
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
  }, sq);
  await tapSq(6); await p.clock.runFor(300);
  s = await st(p);
  if (s.phase !== 'count') throw new Error('a wrong square was taken as the landing');
  await tapSq(4); await p.clock.runFor(2500);
  const said = await p.evaluate(() => window.__said.slice());
  const f2 = await p.evaluate(() => document.querySelector('[data-toast]').textContent + ' ' + document.querySelector('.lu-feed').textContent);
  if (!said.some(x => /Daya/.test(x) && /kindness/.test(x))) throw new Error('Daya was not said aloud with its meaning: ' + JSON.stringify(said));
  if (!/kindness/.test(f2)) throw new Error('the meaning is not on screen: ' + f2);
  await p.clock.runFor(2500);
  const pos = await p.evaluate(() => document.getElementById('host').__ludo.seats[0].pos);
  if (pos !== 25) throw new Error('the ladder did not lift to 25 (at ' + pos + ')');
  /* keyboard: arrows move a square cursor, Enter picks */
  await p.evaluate(() => { Math.random = () => 0.1; });   /* rolls of 1 */
  for (let k = 0; k < 30; k++) { s = await st(p); if (!s.bot && s.phase === 'roll') break; await p.clock.runFor(400); }
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await p.keyboard.press('Space'); await p.clock.runFor(900);
  s = await st(p);
  if (s.phase !== 'count') throw new Error('keyboard roll did not ask to count');
  await p.keyboard.press('ArrowRight'); await p.keyboard.press('Enter'); await p.clock.runFor(1500);
  const pos2 = await p.evaluate(() => document.getElementById('host').__ludo.seats[0].pos);
  if (pos2 !== 26) throw new Error('keyboard counting landed on ' + pos2 + ', not 26');
}, { clock: true, seed: 1 });

check('shots', 'desktop and phone, start and board, day and night (written to /tmp/ludo-shots)', async ({ browser }) => {
  const out = '/tmp/ludo-shots'; fs.mkdirSync(out, { recursive: true });
  for (const [vp, tag] of [[DESK, 'desk'], [PHONE, 'phone']]) {
    for (const night of [false, true]) {
      const ctx = await browser.newContext({ viewport: vp });
      const p = await ctx.newPage();
      await p.addInitScript(seeded(21));
      await p.goto(BASE + '__stage.html');
      if (night) await p.evaluate(() => document.documentElement.setAttribute('data-mode', 'night'));
      const n = tag + (night ? '-night' : '');
      await p.evaluate(() => mount('ludo', { band: '8-10' }));
      await click(p, '[data-go="count"][data-v="3"]');
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${out}/${n}-setup.png`, fullPage: true });
      await click(p, '.lu-start');
      for (let k = 0; k < 400; k++) {
        const s = await st(p);
        if (s.phase === 'choose' && !s.bot) break;
        if (!s.bot && s.phase === 'roll') await click(p, '.arc-die');
        await p.waitForTimeout(120);
      }
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${out}/${n}-board.png`, fullPage: true });
      const over = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
      if (over > 0) throw new Error(n + ': the page is ' + over + 'px wider than the screen');
      await p.evaluate(() => mount('saapsidi', { band: '8-10' }));
      await click(p, '[data-go="count"][data-v="3"]');
      await click(p, '.lu-start');
      await p.waitForTimeout(400);
      await p.screenshot({ path: `${out}/${n}-saapsidi.png`, fullPage: true });
      await ctx.close();
    }
  }
}, { own: true });

let BASE = '';
(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  if (process.argv.includes('--serve')) { const sv = await serve(); console.log('stage on ' + sv.address().port); return; }
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port;
  BASE = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const errs = [];
    try {
      if (c.own) await c.fn({ browser });
      else {
        const ctx = await browser.newContext({ viewport: c.vp || DESK, serviceWorkers: 'block' });
        const p = await ctx.newPage();
        p.on('pageerror', e => errs.push(e.message));
        if (c.seed != null) await p.addInitScript(seeded(c.seed));
        if (c.clock) await p.clock.install();
        await p.goto(BASE + '__stage.html');
        try { await c.fn({ p, ctx }); } finally { await ctx.close(); }
      }
      if (errs.length) throw new Error('page error: ' + errs[0]);
      console.log(`  ok   ${c.id.padEnd(9)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(9)} ${c.what}\n         ${String(e.message).split('\n')[0]}`); fail++;
    }
  }
  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
