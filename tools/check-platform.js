#!/usr/bin/env node
/* Bizzing India — the platform (FIX-INDIA N2, N3, L4, M1, M2; family standard §7, §11, §12, §15).
   docs/27-platform.md says why each one exists.

     weight   a phone's first screen — a returning child's Home, and the landing — transfers
              ≤ 1.5 MB, of which JavaScript ≤ 400 KB gzipped (measured as GitHub Pages serves:
              text gzipped, pictures as they are), and no route group loads for Home
     routes   a story loads the stories and not the games; the language path loads Bhasha
              and not the games; every screen still paints once its group is in
     index    shell-index.js says exactly what the data files say (it is generated; stale fails)
     report   the grown-ups' report card is Time · Progress · Mastery: active minutes from the
              Hive's feed, steps along the path, and what the child can do with the DAY each
              was shown — and minutes never appear under Mastery
     phone    at 390 × 844 no screen is wider than the phone, the tab bar is thumb-high with
              44px targets, map labels render ≥ 10px, and the time line's ends are not cut off
     thirdparty  nothing is fetched from anywhere but the app's own origin (standard §5, §15)
     gate     deploy.sh refuses to publish a tree tools/test.sh has not passed

   Each was watched to fail by breaking the thing it holds (docs/27-platform.md).
   Run:  node tools/check-platform.js            # all of them
         node tools/check-platform.js --only weight
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const zlib = require('zlib');
const { execFileSync } = require('child_process');
const { skipOnboarding } = require('./lib/onboard');

const ROOT = path.join(__dirname, '..'), APP = path.join(ROOT, 'app');
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
const PHONE = { width: 390, height: 844 }, DESK = { width: 1280, height: 860 };
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
const TEXT = /\.(js|css|html|json|svg|webmanifest)$/;
/* what a file costs on the wire from GitHub Pages: text is gzipped, pictures are not */
const gz = {};
function wire(rel) {
  const f = path.join(APP, rel.split('?')[0]);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return { bytes: 0, js: 0 };
  if (!(f in gz)) gz[f] = TEXT.test(f) ? zlib.gzipSync(fs.readFileSync(f), { level: 9 }).length : fs.statSync(f).size;
  return { bytes: gz[f], js: /\.js$/.test(f) ? gz[f] : 0 };
}
async function firstScreen(p, base, url) {
  const reqs = [];
  const on = r => { const u = r.url(); if (u.startsWith(base)) reqs.push(u.slice(base.length) || 'index.html'); };
  p.on('request', on);
  await p.goto(base + (url || ''), { waitUntil: 'load' });
  await p.waitForTimeout(700);                    /* the first screen, before the warm-up at 1.5 s */
  p.off('request', on);
  const seen = {}; let bytes = 0, js = 0;
  reqs.forEach(u => { const k = u.split('?')[0]; if (seen[k]) return; seen[k] = 1; const w = wire(k); bytes += w.bytes; js += w.js; });
  const groups = await p.evaluate(() => window.IND_GROUPS().filter(g => window.IND_HAS(g)));
  return { bytes, js, n: Object.keys(seen).length, groups, files: Object.keys(seen) };
}

check('weight', 'a phone\'s first screen ≤ 1.5 MB, JavaScript ≤ 400 KB gzipped, no route group for Home', async ({ p, base }) => {
  /* a returning child */
  await p.goto(base, { waitUntil: 'networkidle' }); await skipOnboarding(p);
  const home = await firstScreen(p, base, '');
  const landing = await (async () => {
    const ctx2 = await p.context().browser().newContext({ viewport: PHONE, serviceWorkers: 'block', isMobile: true });
    const q = await ctx2.newPage(); const r = await firstScreen(q, base, ''); await ctx2.close(); return r;
  })();
  const kb = n => Math.round(n / 1024) + ' KB';
  for (const [nm, r] of [['Home', home], ['the landing', landing]]) {
    if (r.bytes > 1.5 * 1048576) throw new Error(`${nm}'s first screen transfers ${kb(r.bytes)} (budget 1.5 MB)`);
    if (r.js > 400 * 1024) throw new Error(`${nm}'s first screen runs ${kb(r.js)} of JavaScript gzipped (budget 400 KB)`);
  }
  if (home.groups.length) throw new Error('Home loaded route groups before its first screen: ' + home.groups.join(', '));
  console.log(`         Home ${kb(home.bytes)} (JS ${kb(home.js)}, ${home.n} files) · landing ${kb(landing.bytes)} (JS ${kb(landing.js)})`);
}, { vp: PHONE, fresh: true });

check('routes', 'a story loads the stories, not the games; the language path loads Bhasha; each screen paints', async ({ p, base }) => {
  await p.goto(base, { waitUntil: 'networkidle' }); await skipOnboarding(p);
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(200);
  await p.evaluate(() => window.BI.go('stories'));
  const a = await p.evaluate(() => window.IND_GROUPS().filter(g => window.IND_HAS(g)));
  if (a.indexOf('content') < 0) throw new Error('the stories opened without the stories group');
  if (a.indexOf('games') >= 0 || a.indexOf('bhasha') >= 0) throw new Error('the stories loaded unrelated groups: ' + a.join(', '));
  const painted = await p.evaluate(() => document.querySelectorAll('#main .bigdoor, #main .mdoor, #main .rail').length);
  if (!painted) throw new Error('the stories screen did not paint once its group arrived');
  await p.evaluate(() => window.BI.go('pack', 'hi'));
  const b = await p.evaluate(() => window.IND_GROUPS().filter(g => window.IND_HAS(g)));
  if (b.indexOf('bhasha') < 0) throw new Error('the Hindi path opened without the Bhasha group');
  if (b.indexOf('games') >= 0) throw new Error('the Hindi path loaded the games');
  if (!(await p.$('.bh-hero, .bh-next'))) throw new Error('the Hindi path did not paint');
}, { vp: DESK, fresh: true, noWarm: true });

check('index', 'shell-index.js says exactly what the data files say', async () => {
  const { build } = require('./gen-shell-index');
  const want = build();
  const src = fs.readFileSync(path.join(APP, 'shell-index.js'), 'utf8');
  const have = JSON.parse(src.slice(src.indexOf('=') + 1).trim().replace(/;$/, ''));
  for (const k of Object.keys(want)) if (JSON.stringify(want[k]) !== JSON.stringify(have[k]))
    throw new Error(`shell-index.js is stale in "${k}" — run node tools/gen-shell-index.js (stamp.sh does)`);
});

check('report', 'the report card is Time · Progress · Mastery, with the day each thing was shown', async ({ p }) => {
  /* evidence: a course objective whose test was passed a day after its teaching, and seven
     active minutes in the Hive's feed today */
  await p.evaluate(() => window.IND_LOAD(['paath']));
  await p.evaluate(() => {
    const S = window.BI.S, C = window.IND_PAATH.courses.find(c => !c.premium), m = C.modules[0];
    const lid = l => m.id + '.' + l.n.slice(0, 18), seen = {};
    m.lessons.forEach(l => { if (l.k !== 'c') seen[lid(l)] = 20261001; });
    S.paath = S.paath || { v: 1, c: {} };
    S.paath.c[C.id] = { at: 20261001, seen, made: {}, note: {}, m: { [m.id]: { on: 20261002, tries: 1 } } };
    window.BI.Store.saveProfile(S);
    const d = new Date(), pad = n => (n < 10 ? '0' : '') + n, ymd = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    localStorage.setItem('bizzing.activity', JSON.stringify({ v: 1, s: [{ a: 'india', d: ymd, t: 600, m: 7, who: S.name }] }));
  });
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(300);
  await p.evaluate(() => window.BI.go('grown')); await p.waitForTimeout(300);
  for (const d of '24682468') { await p.keyboard.press(d); await p.waitForTimeout(40); }
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const g = document.querySelector('.reportgrid'); if (!g) return null;
    const t = s => (g.querySelector(s) || {}).innerText || '';
    return { time: t('.rc-time'), progress: t('.rc-progress'), mastery: t('.rc-mastery'),
      order: [...g.children].map(c => c.className.split(' ').filter(x => /^rc-/.test(x))[0]) };
  });
  if (!r) throw new Error('there is no report card on the grown-ups\' page');
  if (r.order.join() !== 'rc-time,rc-progress,rc-mastery') throw new Error('the three measures are not Time · Progress · Mastery: ' + r.order.join());
  if (!/\b7\b/.test(r.time) || !/active/i.test(r.time)) throw new Error('Time does not show the 7 active minutes from the feed: ' + r.time.slice(0, 80));
  if (!/Stories finished/.test(r.progress) || !/stop \d+ \/ \d+/.test(r.progress)) throw new Error('Progress does not show steps along the path');
  if (!/shown 2026-10-02/.test(r.mastery)) throw new Error('Mastery does not show the objective with the day it was shown: ' + r.mastery.slice(0, 120));
  if (/\bmin(ute)?s?\b/i.test(r.mastery)) throw new Error('minutes appear under Mastery');
  const rep = await p.evaluate(() => window.IND_REPORT());
  if (!rep || rep.app !== 'india' || !rep.time || !rep.progress || !Array.isArray(rep.mastery)) throw new Error('IND_REPORT() is not in the family\'s three measures');
}, { vp: DESK });

check('phone', 'at 390 × 844: nothing wider than the phone, thumb-high 44px tabs, readable map labels, whole time line', async ({ p }) => {
  const VIEWS = [['home'], ['stories'], ['map'], ['state', 'KL'], ['bhasha'], ['pack', 'hi'], ['paath'], ['paath', 'neeti-course'],
    ['neeti'], ['khel'], ['game', 'statehunt'], ['itihaas'], ['epics'], ['utsav'], ['me'], ['worlds'], ['aaj'], ['tongue'],
    ['dharma'], ['geet'], ['rishtey'], ['shlok'], ['cards'], ['nani'], ['gully'], ['people']];
  for (const [v, a] of VIEWS) {
    await p.evaluate(([v, a]) => window.BI.go(v, a), [v, a]); await p.waitForTimeout(250);
    const w = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
    if (w > 390) throw new Error(`#/${v}${a ? '/' + a : ''} is ${w}px wide on a 390px phone`);
  }
  await p.evaluate(() => window.BI.go('map')); await p.waitForTimeout(500);
  const m = await p.evaluate(() => {
    const nav = document.querySelector('[data-bz=tabbar]'), tabs = [...nav.querySelectorAll('a')].filter(t => t.offsetParent);
    const labels = [...document.querySelectorAll('#main svg text.tlab')].filter(t => getComputedStyle(t).display !== 'none' && t.getBoundingClientRect().height);
    const tl = document.querySelector('.tmtick.tm-l'), tr = document.querySelector('.tmtick.tm-r');
    return { fixed: getComputedStyle(nav).position, navTop: nav.getBoundingClientRect().top, vh: innerHeight,
      minTab: Math.min.apply(null, tabs.map(t => t.getBoundingClientRect().height)), tabs: tabs.length,
      labels: labels.length, minLabel: Math.min.apply(null, labels.map(t => t.getBoundingClientRect().height)),
      tl: tl ? tl.getBoundingClientRect().left : null, tr: tr ? tr.getBoundingClientRect().right : null };
  });
  if (m.fixed !== 'fixed' || m.navTop < m.vh * 0.8) throw new Error('the tab bar is not at the bottom of the phone, in thumb reach');
  if (m.minTab < 44) throw new Error(`a tab is ${m.minTab}px tall — under the 44px a thumb needs`);
  if (!m.labels || m.minLabel < 10) throw new Error(`map labels render at ${m.minLabel}px on a phone (${m.labels} shown)`);
  if (m.tl == null || m.tl < 0 || m.tr > 390) throw new Error(`the time line's ends are cut off (${m.tl}…${m.tr})`);
}, { vp: PHONE });

check('thirdparty', 'no request leaves the app\'s own origin — boot, warm-up, and every main screen', async ({ p, base }) => {
  const out = [];
  p.on('request', r => { const u = r.url(); if (!u.startsWith(base) && !/^(data|blob|about):/.test(u)) out.push(u); });
  await p.goto(base, { waitUntil: 'networkidle' }); await skipOnboarding(p);
  for (const v of [['home'], ['stories'], ['map'], ['bhasha'], ['pack', 'hi'], ['paath'], ['khel'], ['neeti'], ['me'], ['aaj']]) {
    await p.evaluate(([v, a]) => window.BI.go(v, a), v); await p.waitForTimeout(250);
  }
  await p.waitForTimeout(2500);                       /* the warm-up included */
  if (out.length) throw new Error(out.length + ' third-party requests: ' + [...new Set(out)].slice(0, 3).join(' '));
}, { vp: DESK, fresh: true });

check('gate', 'npm test records what it passed and CI runs it on every push; a deploy is never held by it', async () => {
  /* a snapshot of the tree is tested against its repository (BIZZING_REPO, as test.sh does) */
  const ROOT = process.env.BIZZING_REPO || path.join(__dirname, '..');
  const gitDir = execFileSync('git', ['rev-parse', '--absolute-git-dir'], { cwd: ROOT }).toString().trim();
  const mark = path.join(gitDir, 'bizzing-gate'), saved = fs.existsSync(mark) ? fs.readFileSync(mark, 'utf8') : null;
  const run = () => { try { execFileSync('bash', ['tools/gate.sh'], { cwd: ROOT, stdio: 'pipe' }); return 0; } catch (e) { return e.status || 1; } };
  try {
    fs.writeFileSync(mark, 'not-this-tree not-this-tree\n');
    if (run() === 0) throw new Error('the gate opened for a tree that never passed');
    const want = execFileSync('git', ['rev-parse', 'HEAD:app'], { cwd: ROOT }).toString().trim() + ' ' +
                 execFileSync('git', ['rev-parse', 'HEAD:tools'], { cwd: ROOT }).toString().trim();
    fs.writeFileSync(mark, want + '\n');
    if (run() !== 0) throw new Error('the gate stayed shut for the tree that passed');
    /* the owner's call (3 Oct): pushes come from one chat, so the suite runs in CI on every
       push rather than holding the deploy. Both halves are held: CI really runs it on the
       branch, and deploy.sh never exits on it. */
    const ci = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'test.yml'), 'utf8');
    if (!/push:/.test(ci) || !/bash tools\/test\.sh/.test(ci)) throw new Error('CI does not run tools/test.sh on push');
    const dep = fs.readFileSync(path.join(ROOT, 'tools', 'deploy.sh'), 'utf8');
    if (/gate\.sh[^\n]*\|\|[^\n]*exit/.test(dep)) throw new Error('deploy.sh is held by the gate again');
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    if (!pkg.scripts || !/tools\/test\.sh/.test(pkg.scripts.test || '')) throw new Error('npm test does not run tools/test.sh');
  } finally {
    if (saved == null) { try { fs.unlinkSync(mark); } catch (e) {} } else fs.writeFileSync(mark, saved);
  }
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
    const ctx = await browser.newContext({ viewport: vp, serviceWorkers: 'block', isMobile: vp.width < 500, hasTouch: vp.width < 500 });
    const p = await ctx.newPage();
    if (c.noWarm) await p.addInitScript(() => { Object.defineProperty(window, 'IND_WARM', { configurable: true, set() {}, get() { return function () {}; } }); });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      if (!c.fresh) { await p.goto(base, { waitUntil: 'networkidle' }); await skipOnboarding(p); await p.waitForTimeout(300); }
      await c.fn({ p, ctx, base });
      if (errs.length) throw new Error('page error: ' + errs[0]);
      console.log(`  ok   ${c.id.padEnd(8)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(8)} ${c.what}\n         ${String(e.message).split('\n')[0]}`); fail++;
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
