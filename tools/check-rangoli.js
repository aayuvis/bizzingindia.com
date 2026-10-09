#!/usr/bin/env node
/* Bizzing India — Rangoli Rush (games spec §4.5, docs/32).

     r1         "I have got it" pressed early, then ten seconds of waiting, never changes a
                checked result — nor wipes a drawing in progress, nor a second look
     r2         a random dotter clears no level: memory, kolam, muggu, alpana, mandana, rangoli
     perfect    a child who lays it back exactly clears every kind, and the engine reports ONE
                answer per level attempt — {id:'level-N', right, firstTry, skill:'memory.pattern'}
                — and done({win, score, asked, firstTryRight, level})
     miss       a miss holds on the board with "Not quite" until Aage (Enter presses it); a retry
                is for learning: it never reports again and never scores
     traditions every fourth level names its tradition and region on the level card; a kolam's
                order is hidden once shown, and three slips fail it
     marks      each chalk wears its own mark (dot · ring · petal · star) on the board and in the
                palette — colour is never the only signal
     plate      a painted threshold: a floor with grain, a sill and two diyas, day and night
     levels     the registry says teaches, five level bands and a sub; the host's band chip
                starts its band, and the ladder only moves forward; keyboard draws and checks
     shots      desktop and phone, day and night — written to /tmp/rangoli-shots

   Engines are mounted straight from window.IND_GAMES with stub opts. Each check was watched
   to fail by breaking the thing it holds.
   Run:  CHROME=/opt/pw-browsers/chromium NODE_PATH=../node_modules node tools/check-rangoli.js [--only id]
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
const seeded = seed => `(function(){var s=${seed}>>>0;Math.random=function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};})();`;
const click = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no ' + s); e.click(); }, sel);
const RG = p => p.evaluate(() => { const R = document.getElementById('host').__rangoli; return { phase: R.phase, kind: R.cfg.kind, lvl: R.lvl,
  pattern: R.pattern, given: !!R.cfg.given, n: R.cfg.n, colors: R.cfg.colors || 2, kolam: R.kolam && { order: R.kolam.order } }; });
const stage = p => p.evaluate(() => document.querySelector('#host .mela-stage').innerHTML);
const jump = (p, i) => p.evaluate(i => document.getElementById('host').__rangoli.jump(i), i);
const COLS = ['var(--rg1, var(--accent2))', 'var(--rg2, var(--accent3))', 'var(--rg3, var(--good))', 'var(--rg4, var(--accent))'];
const tapK = (p, i) => p.evaluate(i => document.querySelector('.rg-kdot[data-kd="' + i + '"]').dispatchEvent(new MouseEvent('click', { bubbles: true })), i);

/* lay a pattern: exactly, or as a random dotter would */
async function lay(p, how) {
  const r = await RG(p);
  if (r.kind === 'kolam') {
    if (r.phase === 'show') await p.clock.runFor(15000);
    const o = r.kolam.order;
    const seq = how === 'exact' ? o.slice(1).concat([o[0]]) : null;
    for (let k = 0; k < 40; k++) {
      const s = await RG(p);
      if (s.phase !== 'trace') break;
      await tapK(p, seq ? seq[k] : Math.floor(Math.random() * o.length));
    }
    return;
  }
  if (r.phase === 'show') await click(p, '[data-go="ready"]');
  const isGiven = k => { if (!r.given) return false; const q = k.split(','); return +q[0] < Math.floor(r.n / 2) && +q[1] < Math.ceil(r.n / 2); };
  const want = Object.keys(r.pattern).filter(k => !isGiven(k));
  let plan;
  if (how === 'exact') plan = want.map(k => [k, COLS.indexOf(r.pattern[k])]);
  else {
    const all = []; for (let a = 0; a < r.n; a++) for (let b = 0; b < r.n; b++) if (!isGiven(a + ',' + b)) all.push(a + ',' + b);
    plan = []; const used = {};
    while (plan.length < want.length) { const k = all[Math.floor(Math.random() * all.length)]; if (used[k]) continue; used[k] = 1; plan.push([k, Math.floor(Math.random() * Math.min(4, r.colors))]); }
  }
  for (const [k, c] of plan) {
    await p.evaluate(([k, c]) => { const sw = document.querySelector('.rg-sw[data-sw="' + c + '"]'); if (sw) sw.click(); document.querySelector('.rg-dot[data-k="' + k + '"]').click(); }, [k, c]);
  }
  await click(p, '[data-go="check"]');
}
const cleared = p => p.evaluate(() => !!document.querySelector('[data-go="lvlnext"]'));
const LEVELS = [0, 1, 2, 3, 7, 11, 15, 19, 24, 40, 60, 63, 79, 98];

check('r1', 'R1: "I have got it" early, then ten seconds, never changes a checked result (nor a drawing, nor a second look)', async ({ p }) => {
  await p.evaluate(() => mount('rangoli', { band: '8-10' }));
  /* R1 as the spec words it: "I have got it" at once, checked at once, then ten seconds */
  await click(p, '[data-go="ready"]');
  await p.evaluate(() => [...document.querySelectorAll('.rg-dot')].slice(0, 2).forEach(d => d.click()));
  await click(p, '[data-go="check"]');
  const a = await stage(p);
  await p.clock.runFor(10000);
  if (await stage(p) !== a) throw new Error('the checked result changed while nobody touched it');
  /* a drawing in progress is not wiped by the show's old countdown */
  await jump(p, 0);
  await click(p, '[data-go="ready"]');
  await p.evaluate(() => [...document.querySelectorAll('.rg-dot')].slice(0, 2).forEach(d => d.click()));
  await p.clock.runFor(10000);
  const r0 = await RG(p);
  if (r0.phase !== 'draw') throw new Error('ten seconds after "I have got it" the board went to ' + r0.phase);
  const laid = await p.evaluate(() => document.querySelectorAll('.rg-dot[aria-pressed="true"]').length);
  if (laid !== 2) throw new Error('the drawing was wiped: ' + laid + ' dots left of 2');
  /* a second look, ended early, then checked: still holds */
  await jump(p, 1);
  await click(p, '[data-go="ready"]');
  await click(p, '[data-go="peek"]');
  await click(p, '[data-go="ready"]');
  await click(p, '[data-go="check"]');
  const b = await stage(p);
  await p.clock.runFor(10000);
  if (await stage(p) !== b) throw new Error('a checked result after a second look changed on its own');
}, { clock: true, seed: 4 });

check('r2', 'R2: a random dotter clears no level, of any kind', async ({ p }) => {
  await p.evaluate(() => mount('rangoli', { band: '8-10' }));
  let clears = 0, tried = 0;
  for (let round = 0; round < 3; round++) for (const i of LEVELS) {
    await jump(p, i);
    await lay(p, 'random');
    tried++;
    if (await cleared(p)) clears++;
  }
  if (clears) throw new Error('a random dotter cleared ' + clears + ' of ' + tried + ' levels');
  const rights = await p.evaluate(() => window.__answers.filter(a => a.right).length);
  if (rights) throw new Error('a random dotter was reported right ' + rights + ' times');
  console.log('         ' + tried + ' random attempts, ' + clears + ' cleared');
}, { clock: true, seed: 8 });

check('perfect', 'an exact drawer clears every kind; one answer per level attempt, and done says what was asked', async ({ p }) => {
  await p.evaluate(() => mount('rangoli', { band: '8-10' }));
  const kinds = new Set();
  for (const i of LEVELS) {
    await jump(p, i);
    const r = await RG(p); kinds.add(r.kind);
    await lay(p, 'exact');
    if (!(await cleared(p))) throw new Error('an exact ' + r.kind + ' at level ' + (i + 1) + ' did not clear');
  }
  ['mem', 'kolam', 'muggu', 'alpana', 'mandana', 'rangoli'].forEach(k => { if (!kinds.has(k)) throw new Error('never met a ' + k + ' level'); });
  const A = await p.evaluate(() => window.__answers);
  if (A.length !== LEVELS.length) throw new Error(A.length + ' answers for ' + LEVELS.length + ' level attempts');
  const bad = A.filter(a => !(a.right === true && a.firstTry === true && a.skill === 'memory.pattern' && /^level-\d+$/.test(a.id)));
  if (bad.length) throw new Error('a report out of shape: ' + JSON.stringify(bad[0]));
  /* a sitting's end: three levels, then Finish */
  await p.evaluate(() => mount('rangoli', { band: '8-10' }));
  for (let k = 0; k < 3; k++) { await lay(p, 'exact'); await click(p, '[data-go="lvlnext"]'); if (k < 2) await click(p, '[data-go="startlvl"]'); }
  await click(p, '[data-go="out"]');
  const d = await p.evaluate(() => window.__done);
  if (!d || d.asked !== 3 || d.firstTryRight !== 3 || d.level !== 1 || !d.win || d.kauris != null) throw new Error('done said ' + JSON.stringify(d));
}, { clock: true, seed: 12 });

check('miss', 'a miss holds with "Not quite" until Aage (Enter presses it); a retry never reports or scores', async ({ p }) => {
  await p.evaluate(() => mount('rangoli', { band: '8-10' }));
  await click(p, '[data-go="ready"]');
  await click(p, '[data-go="check"]');            /* nothing laid: a miss */
  const m = await p.evaluate(() => { const g = document.querySelector('.gm-miss'); return g ? { t: g.textContent, aage: !!g.querySelector('[data-gm="aage"]') } : null; });
  if (!m || !/Not quite/.test(m.t) || !m.aage) throw new Error('no miss card with Aage: ' + JSON.stringify(m));
  const a = await stage(p);
  await p.clock.runFor(10000);
  if (await stage(p) !== a) throw new Error('the miss did not hold');
  await click(p, '[data-go="retry"]');
  await lay(p, 'exact');
  const A = await p.evaluate(() => window.__answers);
  if (A.length !== 1 || A[0].right !== false) throw new Error('a retry reported again or turned the miss right: ' + JSON.stringify(A));
  const pts = await p.evaluate(() => document.querySelector('[data-role="count"]').textContent);
  if (/\+\d+ points/.test(pts)) throw new Error('a retry scored: ' + pts);
  /* Enter presses Aage on a fresh miss */
  await jump(p, 1); await click(p, '[data-go="ready"]'); await click(p, '[data-go="check"]');
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await p.keyboard.press('Enter');
  const after = await p.evaluate(() => !!document.querySelector('[data-go="startlvl"]'));
  if (!after) throw new Error('Enter did not press Aage');
}, { clock: true, seed: 6 });

check('traditions', 'every fourth level names its tradition and region; a kolam hides its order, and three slips fail it', async ({ p }) => {
  await p.evaluate(() => mount('rangoli', { band: '8-10' }));
  const want = [[3, 'Kolam', 'Tamil Nadu'], [7, 'Muggu', 'Andhra Pradesh'], [11, 'Alpana', 'Bengal'], [15, 'Mandana', 'Rajasthan'], [19, 'Rangoli', 'Maharashtra, Gujarat and widely']];
  for (const [i, name, region] of want) {
    await jump(p, i);
    const t = await p.evaluate(() => (document.querySelector('.rg-trad') || {}).textContent || '');
    if (t.indexOf(name) < 0 || t.indexOf(region) < 0) throw new Error('level ' + (i + 1) + ' card says "' + t + '", not ' + name + ' · ' + region);
  }
  await jump(p, 15);
  if (!(await p.evaluate(() => !!document.querySelector('.rg-plate.wall')))) throw new Error('the mandana is not on a wall plate');
  await jump(p, 3);
  await p.clock.runFor(15000);
  const r = await RG(p);
  if (r.phase !== 'trace') throw new Error('the kolam never handed over (' + r.phase + ')');
  const shown = await p.evaluate(() => document.querySelector('.rg-kline').getAttribute('d'));
  const nums = await p.evaluate(() => /\d/.test([...document.querySelectorAll('.rg-kdot')].map(g => g.textContent).join('')));
  if (shown || nums) throw new Error('the kolam order is still on the board when it is the child\'s turn');
  const wrong = r.kolam.order.filter(x => x !== r.kolam.order[1]);
  for (let k = 0; k < 3; k++) await tapK(p, wrong[1 + k]);
  if (!(await p.evaluate(() => !!document.querySelector('.gm-miss')))) throw new Error('three slips did not fail the kolam');
  const sc = await p.evaluate(() => document.querySelector('[data-role="count"]').textContent);
  if (/-\d/.test(sc)) throw new Error('points went below zero: ' + sc);
}, { clock: true, seed: 2 });

check('marks', 'each chalk wears its own mark on the board and in the palette', async ({ p }) => {
  await p.evaluate(() => mount('rangoli', { band: '8-10' }));
  await jump(p, 98);                                 /* four chalks */
  const m = await p.evaluate(() => {
    const by = {};
    document.querySelectorAll('.rg-dot.lit').forEach(d => { const c = d.style.getPropertyValue('--c'); const s = d.querySelector('svg .m'); by[c] = by[c] || {}; by[c][s ? s.tagName + s.getAttribute('class') : 'none'] = 1; });
    return Object.keys(by).map(c => [c, Object.keys(by[c]).concat(document.querySelector('.rg-dot.lit[style*="' + c.slice(0, 12) + '"] svg .m') ? [] : [])]);
  });
  const shapes = await p.evaluate(() => {
    const by = {};
    document.querySelectorAll('.rg-dot.lit').forEach(d => { const c = d.style.getPropertyValue('--c'); by[c] = d.querySelector('svg').innerHTML.replace(/[\d.]+/g, ''); });
    return by;
  });
  if (m.length < 3) throw new Error('only ' + m.length + ' chalks on a four-chalk board');
  if (m.some(x => x[1].length !== 1)) throw new Error('one chalk wears two marks');
  const v = Object.values(shapes);
  if (new Set(v).size !== v.length) throw new Error('two chalks share a mark');
  await click(p, '[data-go="ready"]');
  const pal = await p.evaluate(() => [...document.querySelectorAll('.rg-sw')].map(b => (b.querySelector('svg') || {}).innerHTML || ''));
  if (pal.length !== 4 || new Set(pal.map(x => x.replace(/[\d.]+/g, ''))).size !== 4) throw new Error('the palette does not show four marks');
}, { clock: true, seed: 10 });

check('plate', 'a painted threshold: grain, a sill and two diyas, and a different floor by night', async ({ p }) => {
  await p.evaluate(() => mount('rangoli', { band: '8-10' }));
  const day = await p.evaluate(() => { const pl = document.querySelector('.rg-plate'); const cs = getComputedStyle(pl);
    return { bg: cs.backgroundImage, floor: cs.getPropertyValue('--floor').trim(), diyas: pl.querySelectorAll('.rg-diya').length, sill: getComputedStyle(pl, ':before').height }; });
  if (!/data:image\/svg/.test(day.bg) || !/gradient/.test(day.bg)) throw new Error('the floor is not painted: ' + day.bg.slice(0, 80));
  if (day.diyas !== 2 || day.sill === 'auto' || parseFloat(day.sill) < 10) throw new Error('no doorway sill and diyas');
  await p.evaluate(() => document.documentElement.setAttribute('data-mode', 'night'));
  const night = await p.evaluate(() => getComputedStyle(document.querySelector('.rg-plate')).getPropertyValue('--floor').trim());
  if (!night || night === day.floor) throw new Error('the floor is the same by night');
}, { clock: true, seed: 3 });

check('levels', 'teaches, five bands and a sub; the band chip starts its band and the ladder only moves on; keyboard draws', async ({ p }) => {
  const g = await p.evaluate(() => { const x = IND_GAMES.filter(y => y.id === 'rangoli')[0]; return { t: x.teaches, l: x.levels, sub: x.sub }; });
  if (g.t !== true || !Array.isArray(g.l) || g.l.length !== 5 || !g.sub) throw new Error('registry: ' + JSON.stringify(g));
  await p.evaluate(() => { KV['india.rangoli.lvl'] = '5'; mount('rangoli', { band: '8-10', level: 3 }); });
  let r = await RG(p);
  if (r.lvl !== 40) throw new Error('band 3 started at level ' + (r.lvl + 1));
  await p.evaluate(() => { mount('rangoli', { band: '8-10', level: 1 }); });
  r = await RG(p);
  if (r.lvl !== 5) throw new Error('band 1 did not keep the child at their own level 6 (' + (r.lvl + 1) + ')');
  /* keyboard: Enter on the show's button, arrows to move, Space lays, 2 picks a chalk, Enter checks */
  await p.evaluate(() => { KV['india.rangoli.lvl'] = '0'; mount('rangoli', { band: '8-10' }); });
  await p.clock.runFor(200);
  await p.keyboard.press('Enter');
  await p.clock.runFor(200);
  r = await RG(p);
  if (r.phase !== 'draw') throw new Error('Enter on "I have got it" did not start the drawing (' + r.phase + ')');
  await p.keyboard.press('Space'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('2'); await p.keyboard.press('Space');
  const laid = await p.evaluate(() => [...document.querySelectorAll('.rg-dot[aria-pressed="true"]')].map(d => d.getAttribute('data-k') + d.style.getPropertyValue('--c')));
  if (laid.length !== 2 || laid[0].indexOf('0,0') !== 0 || laid[1].indexOf('0,1') !== 0 || laid[1].indexOf('rg2') < 0) throw new Error('keyboard laid ' + laid.join(' / '));
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await p.keyboard.press('Enter');
  r = await RG(p);
  if (r.phase !== 'checked') throw new Error('Enter did not check (' + r.phase + ')');
  /* the ladder saved only forward */
  await p.evaluate(() => { KV['india.rangoli.lvl'] = '30'; mount('rangoli', { band: '8-10', level: 1 }); });
  await lay(p, 'exact'); await click(p, '[data-go="lvlnext"]');
  const kept = await p.evaluate(() => KV['india.rangoli.lvl']);
  if (kept !== '30') throw new Error('replaying band 1 moved the saved ladder to ' + kept);
}, { clock: true, seed: 14 });

check('shots', 'desktop and phone, day and night (written to /tmp/rangoli-shots)', async ({ browser }) => {
  const out = '/tmp/rangoli-shots'; fs.mkdirSync(out, { recursive: true });
  for (const [vp, tag] of [[DESK, 'desk'], [PHONE, 'phone']]) for (const night of [false, true]) {
    const ctx = await browser.newContext({ viewport: vp });
    const p = await ctx.newPage();
    await p.addInitScript(seeded(31));
    await p.goto(BASE + '__stage.html');
    if (night) await p.evaluate(() => document.documentElement.setAttribute('data-mode', 'night'));
    const n = tag + (night ? '-night' : '');
    await p.evaluate(() => { KV['india.rangoli.lvl'] = '62'; mount('rangoli', { band: '8-10' }); });
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/${n}-show.png`, fullPage: true });
    await click(p, '[data-go="ready"]');
    await p.evaluate(() => [...document.querySelectorAll('.rg-dot')].filter((d, i) => i % 5 === 1).forEach(d => d.click()));
    await click(p, '[data-go="check"]');
    await p.waitForTimeout(200);
    await p.screenshot({ path: `${out}/${n}-checked.png`, fullPage: true });
    await jump(p, 3);
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `${out}/${n}-kolam.png`, fullPage: true });
    await jump(p, 15);
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/${n}-mandana.png`, fullPage: true });
    const over = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
    if (over > 0) throw new Error(n + ': the page is ' + over + 'px wider than the screen');
    await ctx.close();
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
