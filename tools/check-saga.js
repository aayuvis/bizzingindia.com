#!/usr/bin/env node
/* Bizzing India — the saga, Gattu aur Vismriti (games spec §2.2, G1–G5; docs/32).

     data      G4: no `kauris` field or reward field remains in data-saga.js; every chapter names
               its engine and an explicit scope { mode, set }; saga.js reaches the wallet only
               through the host's earn('answer') and earn('stop'), and touches no storage itself
     gate      G5: the act is unsigned, so the saga is tester-mode only — without ?tester=1 its
               Play card is hidden (review:true) and #/saga says why; with it, both open
     scope     G2: every chapter launches its engine from IND_GAMES with the chapter's opts as
               `scope`, plus level, band, answer, calm and reduced (a spy on every engine call)
     journey   G1: Act 1 end to end with a perfect bot — on a desktop by mouse and keyboard, on a
               390 × 844 phone by touch — every place colours in, Back walks chapter → map, every
               action sits above the tab bar, every tap target ≥ 44 px, nothing scrolls sideways
     pay       `stop` 5 once per chapter per child (a second telling pays no second stop; a second
               child is paid their own); `answer` 1 per first-try right, ≤ 10 a round, once per
               item a day; nothing for watching a scene
     random    G3: a guess-until-it-lights bot restores no chapter and earns nothing; a seeded
               random guesser is judged on first tries only — every round's verdict is exactly
               the 50% rule on its first answers; an engine that reports points, not answers,
               restores nothing; the mist thins (never past its cap) and the level drops, never
               below 1 — nobody loses anything
     real      the shipped engines mount inside a chapter and tear down cleanly (no page error)

   Each was watched to fail by breaking the thing it holds (see the commit that added it).
   Run:  CHROME=/opt/pw-browsers/chromium node tools/check-saga.js [--only journey] [--shots DIR]
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
const SHOTS = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
const shot = async (p, name) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, name + '.png') }); } };

/* ------------------------------------------------------------------ the stub engines
   Each replaces a chapter engine in IND_GAMES with a contract-shaped one: N items of four
   options, one answer() per item at its first attempt, a miss holds until the right one is
   tapped (a retry never reports again), and done({asked, firstTryRight}) from its end button.
   `mode: 'points'` reports no answers and done({score: points, asked}) — an engine that has
   not learned the contract, scoring 100 a right the way the old Mela did. Every call is spied. */
async function stubEngines(p, o) {
  await p.evaluate(o => {
    window.__spy = [];
    const make = id => function (host, opts, done) {
      window.__spy.push({ id, level: opts.level, band: opts.band, scope: JSON.parse(JSON.stringify(opts.scope)),
        answer: typeof opts.answer, calm: typeof opts.calm, reduced: typeof opts.reduced });
      const N = o.n || 6, items = [];
      for (let k = 0; k < N; k++) items.push({ id: id + '-' + k, right: (k * 3 + 1) % 4 });
      let i = 0, tried = false, first = 0, pts = 0;
      const draw = () => {
        if (i >= N) { host.innerHTML = '<div class="stub-end"><button class="mela-btn" data-go="out">Back to the Mela</button></div>'; return; }
        host.innerHTML = '<div class="stub" data-i="' + i + '" data-right="' + items[i].right + '"><p>Item ' + (i + 1) + '</p>' +
          [0, 1, 2, 3].map(k => '<button class="stub-opt" style="min-height:48px;display:block;width:100%;margin:6px 0" data-k="' + k + '">Option ' + (k + 1) + '</button>').join('') + '</div>';
      };
      const click = e => {
        const b = e.target.closest('.stub-opt');
        if (b) {
          const k = +b.dataset.k, it = items[i], ok = k === it.right;
          if (!tried && o.mode !== 'points') opts.answer({ id: it.id, right: ok, firstTry: true, skill: 'stub.' + id, objective: null });
          if (ok) { if (!tried) { first++; pts += 100; } else pts += 45; i++; tried = false; draw(); }
          else tried = true;
          return;
        }
        if (e.target.closest('[data-go="out"]')) {
          done(o.mode === 'points' ? { win: true, score: pts, asked: N } : { win: first * 2 >= N, score: first, asked: N, firstTryRight: first });
        }
      };
      const key = e => { if (/^[1-4]$/.test(e.key) && host.isConnected) { const b = host.querySelector('.stub-opt[data-k="' + (+e.key - 1) + '"]'); if (b) { e.preventDefault(); b.click(); } } };
      host.addEventListener('click', click); document.addEventListener('keydown', key);
      draw();
      return () => { host.removeEventListener('click', click); document.removeEventListener('keydown', key); host.innerHTML = ''; };
    };
    (window.IND_SAGA.chapters).forEach(c => { const g = window.IND_GAMES.find(x => x.id === c.engine); if (g) g.engine = make(c.engine); });
  }, o || {});
}

/* ------------------------------------------------------------------ driving a chapter */
const T = async (p, sel, touch) => {
  const el = p.locator(sel).first();
  await el.waitFor({ state: 'visible', timeout: 8000 });
  if (touch) await el.tap(); else await el.click();
  await p.waitForTimeout(60);
};
/* everything a child must tap is on screen, above the tab bar, and at least 44 px */
async function reachable(p, sel, why) {
  const r = await p.evaluate(s => {
    const els = [...document.querySelectorAll(s)].filter(e => e.offsetParent !== null);
    const bar = document.querySelector('[data-bz=tabbar]'), br = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect() : null;
    const limit = br ? br.top : innerHeight;
    return els.map(e => { const b = e.getBoundingClientRect(); return { t: (e.textContent || '').trim().slice(0, 24), top: b.top, bottom: b.bottom, w: b.width, h: b.height, limit }; });
  }, sel);
  if (!r.length) throw new Error(why + ': nothing matches ' + sel);
  r.forEach(b => {
    if (b.bottom > b.limit + 0.5 || b.top < 0) throw new Error(`${why}: "${b.t}" is at ${Math.round(b.top)}–${Math.round(b.bottom)}, outside the screen above the tab bar (${Math.round(b.limit)})`);
    if (b.h < 44 || b.w < 44) throw new Error(`${why}: "${b.t}" is ${Math.round(b.w)}×${Math.round(b.h)}, under 44 px`);
  });
}
async function sideways(p, why) {
  const over = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
  if (over > 1) throw new Error(`${why}: the page scrolls sideways by ${over}px`);
}
/* bot: 'perfect' | 'wrong' (every item wrong first, then right) | a function(i) → option */
async function playChapter(p, n, bot, o) {
  o = o || {};
  const touch = !!o.touch;
  /* in by the map, as a child comes: a new visit is a new telling */
  await p.evaluate(() => window.BI.go('saga')); await p.waitForSelector('#main .sg-map', { timeout: 15000 });
  await p.evaluate(n => window.BI.go('saga', n), n);
  await p.waitForSelector(`#sg-root[data-n="${n}"]`, { timeout: 15000 });
  /* the scene: panel by panel (or the keyboard's arrow), then "Your turn" */
  for (let k = 0; k < 12; k++) {
    if ((await p.$('#sg-root[data-phase="ready"]'))) break;
    if (o.check) await reachable(p, '#sg-root .sg-act .btn', `chapter ${n} scene`);
    if (o.keys) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(60); continue; }
    if (await p.$('#sg-root .sg-act [data-sg="ready"].sg-primary')) await T(p, '#sg-root .sg-act [data-sg="ready"].sg-primary', touch);
    else await T(p, '#sg-root [data-sg="next"]', touch);
  }
  if (o.shots && n === 1) await shot(p, o.shots + '-ready');
  if (o.check) await reachable(p, '#sg-root .sg-act .btn, #sg-root .sg-lv', `chapter ${n} ready`);
  if (o.level) { if (o.keys) await p.keyboard.press(String(o.level)); else await T(p, `#sg-root [data-sg="lvl"][data-l="${o.level}"]`, touch); }
  if (o.keys) { await p.focus('#sg-root [data-sg="begin"]'); await p.keyboard.press('Enter'); }
  else await T(p, '#sg-root [data-sg="begin"]', touch);
  await p.waitForSelector('#sg-host .stub, #sg-host .mela-wrap', { timeout: 8000 });
  /* the round */
  for (let k = 0; k < 60; k++) {
    const st = await p.evaluate(() => { const s = document.querySelector('#sg-host .stub'); return s ? { i: +s.dataset.i, right: +s.dataset.right } : null; });
    if (!st) break;
    if (o.shots && n === 2 && st.i === 1) await shot(p, o.shots + '-round');
    if (o.check && st.i === 0) await reachable(p, '#sg-host .stub-opt', `chapter ${n} round`);
    let pick = bot === 'perfect' ? st.right : bot === 'wrong' ? (st.right + 1) % 4 : bot(st);
    if (o.keys) await p.keyboard.press(String(pick + 1)); else await T(p, `#sg-host .stub-opt[data-k="${pick}"]`, touch);
    const still = await p.evaluate(i => { const s = document.querySelector('#sg-host .stub'); return s && +s.dataset.i === i; }, st.i);
    if (still) { if (o.keys) await p.keyboard.press(String(st.right + 1)); else await T(p, `#sg-host .stub-opt[data-k="${st.right}"]`, touch); }
  }
  const lab = await p.evaluate(() => (document.querySelector('#sg-host [data-go="out"]') || {}).textContent || '');
  if (/Mela/.test(lab)) throw new Error('the engine\'s end button still says "Back to the Mela" inside the saga');
  await T(p, '#sg-host [data-go="out"]', touch);
  await p.waitForSelector('#sg-root[data-phase="result"]', { timeout: 8000 });
  await p.waitForTimeout(80);
  return p.evaluate(() => ({ won: !!document.querySelector('#sg-root .sg-result.won'), text: document.querySelector('#sg-root .sg-result').innerText }));
}
const ledger = (p, who) => p.evaluate(w => {
  const o = JSON.parse(localStorage.getItem('bizzing.wallet') || '{"kids":{}}'), k = o.kids[w] || { ledger: [] };
  return k.ledger.filter(x => x.a === 'india').map(x => x.why);
}, who || 'asha');
const count = (xs, w) => xs.filter(x => x === w).length;
async function sagaReady(p) {
  await p.evaluate(() => window.BI.go('saga'));
  await p.waitForSelector('#sg-root .sg-map', { timeout: 20000 });
  await p.evaluate(() => window.IND_LOAD(['content', 'voice', 'map', 'bhasha']));
}

/* ================================================================== the checks */

check('data', 'G4: no kauris, no reward field; every chapter names its engine and an explicit scope; pay only through earn', async () => {
  const src = fs.readFileSync(path.join(APP, 'data-saga.js'), 'utf8');
  if (/kauri/i.test(src)) throw new Error('data-saga.js still mentions kauris — a second currency (games spec §1.2, G4)');
  global.window = {}; new Function('window', src)(global.window);
  const S = global.window.IND_SAGA, SC = global.window.IND_SAGA_SCRIPT; delete global.window;
  if (!S || !S.chapters || !S.chapters.length) throw new Error('IND_SAGA has no chapters');
  S.chapters.forEach(c => {
    if ('reward' in c) throw new Error(`chapter ${c.n} still has a reward field`);
    if (!c.engine || typeof c.engine !== 'string') throw new Error(`chapter ${c.n} names no engine`);
    if (!c.opts || typeof c.opts.mode !== 'string' || !Array.isArray(c.opts.set)) throw new Error(`chapter ${c.n}'s opts are not an explicit scope { mode, set }: ${JSON.stringify(c.opts)}`);
    if (!c.skill) throw new Error(`chapter ${c.n} does not say what it practises`);
    if (c.badge !== 'katha') throw new Error(`chapter ${c.n} is not badged katha`);
    const s = SC[c.script];
    if (!s || !s.intro.length || !s.win.length || !s.lose.length) throw new Error(`chapter ${c.n} has no scene, win or lose beats`);
    [].concat(s.intro, s.win, s.lose).forEach(b => { if (['gattu', 'mithu', 'vismriti'].indexOf(b[0]) < 0) throw new Error(`chapter ${c.n}: "${b[0]}" speaks — Act 1's cast is Gattu, Mithu and the mist`); });
  });
  if (S.acts.some(a => a.badge !== 'katha')) throw new Error('an act is not badged katha');
  const ui = fs.readFileSync(path.join(APP, 'saga.js'), 'utf8');
  if (/kauri/i.test(ui)) throw new Error('saga.js mentions kauris');
  if (/localStorage|IND_WALLET|sessionStorage|indexedDB/.test(ui.replace(/\/\*[\s\S]*?\*\//g, ''))) throw new Error('saga.js reaches storage or the wallet directly — only the host\'s earn() and state() may');
  const earns = [...ui.matchAll(/\bH\.earn\('([a-z]+)'/g)].map(m => m[1]);
  if (!earns.length || earns.some(e => e !== 'answer' && e !== 'stop')) throw new Error('saga.js earns something other than answer and stop: ' + earns.join(', '));
  if (/earn\((?!'answer'|'stop')/.test(ui.replace(/\/\*[\s\S]*?\*\//g, '').replace(/H\.earn/g, 'earn'))) throw new Error('saga.js calls earn() with a computed or other event');
});

check('gate', 'G5: unsigned, so tester mode only — without ?tester=1 no Play card and #/saga says why; with it, both open', async ({ p, base, browser }) => {
  await p.evaluate(() => window.IND_LOAD(['games']));
  const g = await p.evaluate(() => { const x = (window.IND_GAMES || []).find(g => g.id === 'saga'); return x && { review: x.review, hide: x.hide, teaches: x.teaches, name: x.name, sub: x.sub, eng: typeof x.engine }; });
  if (!g) throw new Error('the saga registers no IND_GAMES card');
  if (g.review !== true || g.hide !== true) throw new Error('outside tester mode the saga card is offered: ' + JSON.stringify(g));
  if (g.teaches !== true || g.eng !== 'function' || !/Gattu aur Vismriti/.test(g.name) || !g.sub) throw new Error('the card is not the flagship\'s: ' + JSON.stringify(g));
  await p.evaluate(() => window.BI.go('play')); await p.waitForTimeout(500);
  if (await p.$('#main [data-id="saga"]')) throw new Error('the Play hub offers the saga outside tester mode');
  await p.evaluate(() => window.BI.go('saga')); await p.waitForTimeout(500);
  const hold = await p.evaluate(() => ({ hold: !!document.querySelector('#main .sg-hold'), map: !!document.querySelector('#main .sg-map'), door: !!document.querySelector('#main .sg-hold [data-act="go"]') }));
  if (!hold.hold || hold.map || !hold.door) throw new Error('#/saga outside tester mode: ' + JSON.stringify(hold));
  await p.evaluate(() => window.BI.go('saga', 1)); await p.waitForTimeout(300);
  if (await p.$('#sg-root[data-n="1"]')) throw new Error('#/saga/1 opens a chapter outside tester mode');
  /* tester mode: the same device with ?tester=1 */
  await p.goto(base + '?tester=1', { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
  await p.evaluate(() => window.IND_LOAD(['games']));
  const t = await p.evaluate(() => { const x = window.IND_GAMES.find(g => g.id === 'saga'); return { review: x.review, hide: x.hide }; });
  if (t.hide !== false) throw new Error('in tester mode the saga card is still hidden');
  if (t.review !== true) throw new Error('tester mode is not a sign-off: review must stay true until the act is signed');
  await p.evaluate(() => window.BI.go('play')); await p.waitForTimeout(500);
  if (!(await p.$('#main [data-id="saga"]'))) throw new Error('the Play hub does not offer the saga in tester mode');
  /* the card opens the saga map inside the game frame, and its places are routes */
  await p.click('#main [data-id="saga"]'); await p.waitForTimeout(600);
  /* a teaching card with levels opens on the host's level chip (games spec §1.3): Start it. The
     host no longer folds its how-to under a finger (it waits for the release), so the tap on a
     place lands where it was aimed without waiting for the fold. */
  if (await p.$('#gamehost [data-gmh="start"]')) { await p.click('#gamehost [data-gmh="start"]'); await p.waitForTimeout(600); }
  const inhost = await p.evaluate(() => ({ map: !!document.querySelector('#gamehost .sg-map'), links: [...document.querySelectorAll('#gamehost .sg-pin[href]')].map(a => a.getAttribute('href')) }));
  if (!inhost.map || inhost.links.indexOf('#/saga/1') < 0) throw new Error('the Play card does not open the saga map: ' + JSON.stringify(inhost));
  await p.click('#gamehost .sg-pin[href="#/saga/1"]'); await p.waitForTimeout(500);
  const h = await p.evaluate(() => location.hash);
  if (h !== '#/saga/1' || !(await p.$('#sg-root[data-n="1"]'))) throw new Error('a place on the card\'s map does not open its chapter: ' + h);
  await p.goBack(); await p.waitForTimeout(500);
  if (!(await p.evaluate(() => /^#\/game\/saga/.test(location.hash)))) throw new Error('Back from a chapter did not return to the card');
});

check('scope', 'G2: every chapter launches its engine with its own opts as scope, and level, band, answer, calm, reduced', async ({ p }) => {
  await sagaReady(p); await stubEngines(p);
  const S = await p.evaluate(() => window.IND_SAGA.chapters.map(c => ({ n: c.n, engine: c.engine, opts: c.opts })));
  for (const c of S) {
    await p.evaluate(() => { window.__spy = []; });
    const r = await playChapter(p, c.n, 'perfect', { level: 1 + (c.n % 5) });
    if (!r.won) throw new Error(`a perfect round did not restore chapter ${c.n}`);
    const spy = await p.evaluate(() => window.__spy);
    if (spy.length !== 1) throw new Error(`chapter ${c.n} called ${spy.length} engines`);
    const s = spy[0];
    if (s.id !== c.engine) throw new Error(`chapter ${c.n} launched ${s.id}, not ${c.engine}`);
    if (JSON.stringify(s.scope) !== JSON.stringify(c.opts)) throw new Error(`chapter ${c.n}'s scope was ${JSON.stringify(s.scope)}, not its opts ${JSON.stringify(c.opts)}`);
    if (s.level !== 1 + (c.n % 5)) throw new Error(`chapter ${c.n} played at level ${s.level}, not the chosen ${1 + (c.n % 5)}`);
    if (['4-7', '8-10', '11-12'].indexOf(s.band) < 0 || s.answer !== 'function' || s.calm !== 'boolean' || s.reduced !== 'boolean')
      throw new Error(`chapter ${c.n}'s opts break the contract: ${JSON.stringify(s)}`);
  }
});

check('journey', 'G1: Act 1 end to end — desktop by mouse and keys, phone by touch; colour returns; Back; the fold; 44 px', async ({ p, base, browser }) => {
  for (const vp of [DESK, PHONE]) {
    const phone = vp === PHONE;
    const ctx = await browser.newContext({ viewport: vp, serviceWorkers: 'block', isMobile: phone, hasTouch: phone });
    const q = await ctx.newPage(); const errs = []; q.on('pageerror', e => errs.push(e.message));
    await q.goto(base + '?tester=1', { waitUntil: 'networkidle' }); await skipOnboarding(q); await q.waitForTimeout(300);
    await sagaReady(q); await stubEngines(q);
    const tag = phone ? 'phone' : 'desk';
    await shot(q, tag + '-map-0');
    if (phone) { await reachable(q, '#main .sg-pin:not(.locked), #main .sg-go', 'the phone map'); await sideways(q, 'the phone map'); }
    const n = await q.evaluate(() => window.IND_SAGA.chapters.length);
    for (let k = 1; k <= n; k++) {
      /* a locked place says how it opens, and opens nothing */
      if (k < n) {
        const lk = await q.evaluate(k => !!document.querySelector(`#main .sg-pin.locked[data-n="${k + 1}"]`), k);
        if (!lk && k === 1) throw new Error('chapter 2 is open before chapter 1 is remembered');
      }
      /* the scene: a panel at a time, 🪔 on it */
      await q.evaluate(k => window.BI.go('saga', k), k); await q.waitForSelector(`#sg-root[data-n="${k}"]`);
      const sc = await q.evaluate(() => ({ badge: (document.querySelector('#sg-root .sg-head .badge.katha') || {}).textContent || '', panels: document.querySelectorAll('#sg-root .sg-panel').length }));
      if (!/🪔/.test(sc.badge)) throw new Error(`chapter ${k}'s scene carries no 🪔 Katha badge`);
      if (k === 1) await shot(q, tag + '-scene');
      const r = await playChapter(q, k, 'perfect', { touch: phone, keys: !phone && k === 2, check: phone, shots: tag, level: 2 });
      if (!r.won) throw new Error(`${tag}: a perfect round did not restore chapter ${k}: ${r.text.slice(0, 120)}`);
      if (phone) { await reachable(q, '#sg-root .sg-act .btn', `chapter ${k} result`); await sideways(q, `chapter ${k} result`); }
      const badgeR = await q.evaluate(() => !!document.querySelector('#sg-root .sg-head .badge.katha'));
      if (!badgeR) throw new Error(`chapter ${k}'s result has no 🪔 badge`);
      if (k === 1) { await q.waitForTimeout(500); await shot(q, tag + '-restored'); }
      /* Back walks to the map */
      if (k === 1) {
        await q.evaluate(() => window.BI.go('saga')); await q.waitForSelector('#main .sg-map');
        await q.evaluate(() => window.BI.go('saga', 2)); await q.waitForSelector('#sg-root[data-n="2"]');
        await q.goBack(); await q.waitForTimeout(400);
        const w = await q.evaluate(() => ({ h: location.hash, map: !!document.querySelector('#main .sg-map') }));
        if (w.h !== '#/saga' || !w.map) throw new Error('Back from a chapter did not walk to the saga map: ' + JSON.stringify(w));
      }
    }
    await q.evaluate(() => window.BI.go('saga')); await q.waitForSelector('#main .sg-map');
    /* the last place lifts as the child arrives: drawn grey, then its colour comes back (≈ 2 s) */
    const grey = await q.evaluate(() => { const f = document.querySelector('#main .sg-map [data-fog="5"]'); return f && getComputedStyle(f).opacity; });
    if (grey === '0') throw new Error(`${tag}: the place just told was already in colour — the child never sees it come back`);
    await q.waitForFunction(() => [...document.querySelectorAll('#main .sg-map .sg-fog')].every(f => getComputedStyle(f).opacity === '0'), null, { timeout: 8000 }).catch(() => {});
    const m = await q.evaluate(() => ({ mist: document.querySelectorAll('#main .sg-map .sg-pl.mist').length, done: document.querySelectorAll('#main .sg-pin.done').length,
      fog: [...document.querySelectorAll('#main .sg-map .sg-fog')].filter(f => getComputedStyle(f).opacity !== '0').length, whole: !!document.querySelector('#main .sg-whole') }));
    if (m.mist || m.fog || m.done !== n || !m.whole) throw new Error(`${tag}: after the act the map still has mist: ${JSON.stringify(m)}`);
    await shot(q, tag + '-map-done');
    if (phone) { await reachable(q, '#main .sg-pin', 'the told map'); await sideways(q, 'the told map'); }
    /* night: the words stay readable */
    await q.evaluate(() => { window.BI.Store.saveDevice('night', true); window.BI.Store.saveDevice('theme', 'dark'); });
    await q.reload({ waitUntil: 'networkidle' }); await q.waitForTimeout(300);
    await q.evaluate(() => window.BI.go('saga', 3));
    await q.waitForSelector('#sg-root[data-n="3"]', { timeout: 20000 });
    if (!(await q.evaluate(() => document.documentElement.getAttribute('data-mode') === 'night'))) throw new Error('could not switch the app to night');
    const c = await q.evaluate(() => { const e = document.querySelector('#sg-root .sg-panel.now p') || document.querySelector('#sg-root .sg-panel.now .sg-fade');
      const s = getComputedStyle(e), bg = getComputedStyle(e.closest('.sg-panel')); return { fg: s.color, bg: bg.backgroundColor + ' ' + bg.backgroundImage }; });
    await shot(q, tag + '-night');
    const lum = rgb => { const v = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map(x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; };
    const bgs = (c.bg.match(/rgba?\([^)]+\)/g) || []).filter(x => !/,\s*0\)$/.test(x));
    bgs.forEach(b => { const L1 = lum(c.fg), L2 = lum(b), ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
      if (ratio < 4.5) throw new Error(`${tag} night: panel text ${c.fg} on ${b} is ${ratio.toFixed(2)}:1`); });
    if (errs.length) throw new Error(`${tag}: page error: ${errs[0]}`);
    await ctx.close();
  }
}, { timeout: 240000 });

check('pay', 'stop 5 once per chapter per child; answer 1 per first-try right, ≤ 10 a round, once per item a day; nothing for a scene', async ({ p }) => {
  await sagaReady(p); await stubEngines(p, { n: 14 });
  const L0 = await ledger(p);
  /* reading the scene and leaving pays nothing */
  await p.evaluate(() => window.BI.go('saga', 1)); await p.waitForSelector('#sg-root[data-n="1"]');
  for (let k = 0; k < 8; k++) { const nx = await p.$('#sg-root [data-sg="next"]'); if (!nx) break; await nx.click(); await p.waitForTimeout(40); }
  if ((await ledger(p)).length !== L0.length) throw new Error('reading a scene paid coins');
  /* a perfect 14-item round: 10 answer coins (the round's cap) and one stop */
  await playChapter(p, 1, 'perfect');
  let L = await ledger(p);
  const a1 = count(L, 'answer') - count(L0, 'answer'), s1 = count(L, 'stop') - count(L0, 'stop');
  if (a1 !== 10) throw new Error(`a 14-right round paid ${a1} answer coins, not the round's cap of 10`);
  if (s1 !== 1) throw new Error(`restoring chapter 1 paid ${s1} stops, not 1`);
  if (L.some(w => w !== 'answer' && w !== 'stop')) throw new Error('the saga paid an event other than answer and stop: ' + L.join(','));
  /* telling it again: the place is already remembered (no stop); of the 14 items, the 10 paid
     today pay nothing more, and only the 4 the cap held back are paid now — then nothing at all */
  await playChapter(p, 1, 'perfect');
  const L2 = await ledger(p);
  if (count(L2, 'stop') !== count(L, 'stop')) throw new Error('a second telling of a remembered chapter paid stop again');
  if (count(L2, 'answer') - count(L, 'answer') !== 4) throw new Error(`the second telling paid ${count(L2, 'answer') - count(L, 'answer')} answers, not the 4 items never paid today`);
  await playChapter(p, 1, 'perfect');
  const L3 = await ledger(p);
  if (count(L3, 'answer') !== count(L2, 'answer') || count(L3, 'stop') !== count(L2, 'stop')) throw new Error('the same items paid twice in a day');
  /* a second child is paid their own stop for the same chapter: their record is their own */
  await p.evaluate(() => { const S = window.BI.S; window.__mine = JSON.stringify(S.saga); S.saga = {}; S.name = 'Ravi'; });
  await playChapter(p, 1, 'perfect');
  const Lr = await ledger(p, 'ravi');
  if (count(Lr, 'stop') !== 1) throw new Error(`a second child restoring chapter 1 was paid ${count(Lr, 'stop')} stops`);
  if (count(await ledger(p), 'stop') !== count(L, 'stop')) throw new Error('the second child\'s restore paid the first child');
});

check('random', 'G3: guessing restores nothing — first tries only, the 50% rule exactly, points are not answers; the mist thins, the level drops, nothing is lost', async ({ p }) => {
  await sagaReady(p); await stubEngines(p, { n: 10 });
  const n = await p.evaluate(() => window.IND_SAGA.chapters.length);
  /* a fresh record at level 3, so the level rule has room to step down */
  await p.evaluate(() => { const S = window.BI.S; S.saga = { lvl: 3 }; });
  const L0 = await ledger(p);
  /* 1 · the guess-until-it-lights bot (the old frame counted every one of these as right) */
  for (let t = 0; t < 4; t++) {
    const r = await playChapter(p, 1, 'wrong');
    if (r.won) throw new Error('a bot that was wrong on every first try restored chapter 1');
  }
  const s = await p.evaluate(() => window.BI.S.saga);
  if (s.done && s.done[1]) throw new Error('chapter 1 was marked remembered');
  if (s.thin[1] !== 3) throw new Error(`four tellings thinned the mist to ${s.thin[1]}, not its cap of 3`);
  if (s.lvl !== 1) throw new Error(`the level is ${s.lvl} after four misses from 3 — it should step down to 1 and stop`);
  const L1 = await ledger(p);
  if (L1.length !== L0.length) throw new Error('the wrong bot earned coins: ' + L1.slice(L0.length).join(','));
  /* 2 · a seeded random guesser: each verdict is exactly the rule on its first answers */
  let seed = 20261009; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  let restores = 0, rounds = 0;
  for (let k = 1; k <= n; k++) {
    if (k > 1) await p.evaluate(k => { const s = window.BI.S.saga; s.done[k - 1] = s.done[k - 1] || 'test'; }, k);
    for (let t = 0; t < 2; t++) {
      let firsts = 0, asked = 0;
      const r = await playChapter(p, k, st => { const pick = Math.floor(rnd() * 4); asked++; if (pick === st.right) firsts++; return pick; });
      rounds++;
      const rule = asked >= 3 && firsts / asked >= 0.5;
      if (r.won !== rule) throw new Error(`chapter ${k}: ${firsts}/${asked} first tries, and the round was ${r.won ? '' : 'not '}restored`);
      if (!new RegExp('\\b' + firsts + ' of ' + asked + '\\b').test(r.text)) throw new Error(`chapter ${k}: the result does not say ${firsts} of ${asked}: ${r.text.slice(0, 100)}`);
      if (r.won) restores++;
    }
  }
  console.log(`         random guesser: ${restores} of ${rounds} rounds reached 50% on first tries by luck`);
  /* 3 · an engine that reports points, not answers: never mistaken for rights */
  await p.evaluate(() => { window.BI.S.saga = { lvl: 1 }; });
  await stubEngines(p, { n: 6, mode: 'points' });
  const r3 = await playChapter(p, 1, 'perfect');
  if (r3.won) throw new Error('an engine reporting 600 points over 6 items restored a chapter — points are not first-try rights');
  if (!/could not tell/.test(r3.text)) throw new Error('a round with no answers did not say it could not tell: ' + r3.text.slice(0, 120));
});

check('real', 'the shipped engines mount inside a chapter and tear down cleanly', async ({ p }) => {
  await sagaReady(p);
  const chs = await p.evaluate(() => window.IND_SAGA.chapters.map(c => ({ n: c.n, engine: window.IND_SAGA_UI.engineOf(c.n) })));
  await p.evaluate(() => { window.BI.S.saga = { done: { 1: 'x', 2: 'x', 3: 'x', 4: 'x' } }; });
  for (const c of chs) {
    if (!c.engine) throw new Error(`chapter ${c.n} has no engine on this device`);
    await p.evaluate(n => window.BI.go('saga', n), c.n); await p.waitForSelector(`#sg-root[data-n="${c.n}"]`);
    await p.click('#sg-root .sg-skip').catch(() => {});
    await p.waitForSelector('#sg-root [data-sg="begin"]', { timeout: 5000 });
    await p.click('#sg-root [data-sg="begin"]');
    await p.waitForSelector('#sg-host .mela-wrap, #sg-host > *', { timeout: 8000 });
    await p.waitForTimeout(300);
    const kids = await p.evaluate(() => document.querySelector('#sg-host').children.length);
    if (!kids) throw new Error(`chapter ${c.n}'s ${c.engine} drew nothing`);
    if (c.n === 3) await shot(p, 'desk-real-festival');
    await p.evaluate(() => window.BI.go('saga')); await p.waitForSelector('#main .sg-map');
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
    const ctx = await browser.newContext({ viewport: DESK, serviceWorkers: 'block' });
    const p = await ctx.newPage();
    p.setDefaultTimeout(15000);
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      /* G5 is checked without tester mode; everything else plays the unsigned act in it */
      await p.goto(base + (c.id === 'gate' ? '' : '?tester=1'), { waitUntil: 'networkidle' });
      await skipOnboarding(p);
      await p.waitForTimeout(300);
      await c.fn({ p, ctx, base, browser });
      if (errs.length) throw new Error('page error: ' + errs[0]);
      console.log(`  ok   ${c.id.padEnd(8)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(8)} ${c.what}\n         ${String(e.message).split("\n")[0]}`); if (process.env.DEBUG) console.log(e.stack); fail++;
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
