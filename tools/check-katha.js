#!/usr/bin/env node
/* Bizzing India — Katha Chain, a tale put back together (games spec §5.3, §7; docs/32).

     flags      C3 every tale dealt — and every tale a distractor is taken from — carries
                katha_chain: true in data-katha-chain.js, and every flag names a real story
     badge      C2 no Itihaas (and no Aaj) story is ever dealt; nothing sacred is in a cast
     random     C1 a random orderer scores under 15% at L2: exactly (every panel set is 4+ long),
                and in played rounds of random swaps
     morals     C4 every moral distractor is another flagged tale's own moral, word for word,
                never the tale's own; L3's wrong events are other tales' real panels
     words      every panel, line and event on screen is the story data's own words
     unnumbered no panel carries its place in the order (Katha Chain never numbers panels)
     miss       a wrong first answer holds with the miss card until Aage; Enter is Aage
     keys       an L5 round (1–3, Enter) and an L2 item (Space, arrows, Enter) by keyboard alone
     touch      an L2 round by tapping two panels to swap; a panel dragged onto another
     levels     every level plays to done() with a perfect bot, one answer() per item
     phone      390×844: nothing off the side, Lock karo above the tab bar, targets ≥ 44px
     gate       review: true, opened by the owner (9 Oct 2026): every child plays, the page says so;
                take `open` away and the reviewer's wait returns
     shots      desktop and phone, day and night (KC_SHOTS)

   Each was watched to fail by breaking the thing it holds (see the commit).
   Run:  node tools/check-katha.js [--only <id>]
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const os = require('os');
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
const DESK = { width: 1280, height: 800 }, PHONE = { width: 390, height: 844 };
const SHOTS = process.env.KC_SHOTS || path.join(os.tmpdir(), 'katha-shots');
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));

async function mount(p, opts) {
  await p.evaluate(() => window.BI.go('game', 'katha'));
  await p.waitForSelector('#gamehost', { timeout: 20000 });
  await p.evaluate(({ opts }) => {
    const old = document.getElementById('gamehost'), h = old.cloneNode(false);
    old.replaceWith(h);
    window.__ans = []; window.__done = null;
    const g = window.IND_GAMES.find(x => x.id === 'katha');
    window.__td = g.engine(h, Object.assign({ level: 1, band: '8-10', scope: null }, opts, { answer: r => window.__ans.push(r) }), r => { window.__done = r; });
  }, { opts: opts || {} });
  await p.waitForSelector('.kc', { timeout: 20000 });
  await p.waitForTimeout(100);
}
const phase = p => p.evaluate(() => document.getElementById('gamehost').__kcState.phase);
async function waitPhase(p, want, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < (ms || 4000)) { if (await p.evaluate(() => !!window.__done)) return 'done'; const ph = await phase(p); if (want.includes(ph)) return ph; await p.waitForTimeout(60); }
  return phase(p);
}
const item = p => p.evaluate(() => {
  const it = document.getElementById('gamehost').__kcState.item; if (!it) return null;
  const o = { kind: it.kind, n: it.panels ? it.panels.length : 0 };
  if (it.options) { o.pick = it.answer; o.wrong = (it.answer + 1) % it.options.length; }
  return o;
});
/* bring the order row to the right order (or leave it wrong) by swapping, as a child would */
async function order(p, right, how) {
  const press = sel => how === 'tap' ? p.tap(sel) : p.click(sel);
  if (right) {
    const n = await p.$$eval('.kc-row .kc-panel', e => e.length);
    for (let i = 0; i < n; i++) {
      const at = await p.evaluate(i => { const h = document.getElementById('gamehost'), it = h.__kcState.item;
        const texts = [...document.querySelectorAll('.kc-row .kc-panel')].map(e => e.getAttribute('aria-label'));
        const want = 'Panel: ' + window.IND_GAMES.find(x => x.id === 'katha').__short(it.panels[i].text);
        return texts.indexOf(want); }, i);
      if (at !== i) { await press(`.kc-row [data-slot="${at}"] .kc-text`); await press(`.kc-row [data-slot="${i}"] .kc-text`); }
    }
  }
  await press('[data-kc="lock"]');
}
async function play(p, right, how) {
  const it = await item(p);
  if (it.kind === 'order') await order(p, right, how);
  else await (how === 'tap' ? p.tap(`[data-opt="${right ? it.pick : it.wrong}"]`) : p.click(`[data-opt="${right ? it.pick : it.wrong}"]`));
  if ((await waitPhase(p, ['miss', 'right'], 1500)) === 'miss') await p.click('[data-gm="aage"]');
}
async function playOut(p, right, how) {
  for (let n = 0; n < 12; n++) {
    if ((await waitPhase(p, ['ask', 'done'], 4000)) === 'done') return;
    await play(p, typeof right === 'function' ? right(n) : right, how);
  }
}
/* build many rounds of a level in the page and hand back what was dealt */
const deal = (p, L, times) => p.evaluate(({ L, times }) => {
  const e = window.IND_GAMES.find(x => x.id === 'katha').engine, out = [];
  for (let t = 0; t < times; t++) e.build(L, t % 2 ? '4-7' : '8-10').forEach(it => out.push({
    kind: it.kind, story: it.story.id, n: it.panels ? it.panels.length : 0, start: it.start ? it.start.map(x => it.panels.indexOf(x)) : null,
    panels: it.panels ? it.panels.map(x => x.text) : null,
    from: it.options ? it.options.map(o => o.from || null) : [], texts: it.options ? it.options.map(o => o.text || o.label) : [], answer: it.answer, line: it.line || null }));
  return out;
}, { L, times });

check('flags', 'C3: every tale dealt, and every distractor\'s tale, is flagged katha_chain', async ({ p }) => {
  const r = await p.evaluate(() => {
    const F = window.IND_KATHA_CHAIN.katha_chain, all = [];
    for (const k in window) if (/^IND_STORIES/.test(k) && Array.isArray(window[k])) all.push(...window[k]);
    const ids = new Set(all.map(s => s.id));
    return { ghost: Object.keys(F).filter(id => !ids.has(id)), notTrue: Object.keys(F).filter(id => F[id] !== true), n: Object.keys(F).length, signed: window.IND_KATHA_CHAIN.signedBy };
  });
  if (r.ghost.length) throw new Error('flags name stories that do not exist: ' + r.ghost.join(', '));
  if (r.notTrue.length || r.n < 10) throw new Error('flag list malformed: ' + JSON.stringify(r));
  const F = await p.evaluate(() => window.IND_KATHA_CHAIN.katha_chain);
  for (let L = 1; L <= 5; L++) {
    const d = await deal(p, L, 6);
    if (!d.length) throw new Error('L' + L + ' dealt nothing');
    const bad = d.filter(it => F[it.story] !== true || it.from.some(f => f && F[f] !== true));
    if (bad.length) throw new Error('L' + L + ' dealt an unflagged tale: ' + JSON.stringify(bad[0]).slice(0, 160));
  }
});

check('badge', 'C2: no Itihaas or Aaj story is dealt; nothing sacred in a cast', async ({ p }) => {
  const r = await p.evaluate(() => {
    const e = window.IND_GAMES.find(x => x.id === 'katha').engine, T = e.tales();
    const sacred = new Set(); window.IND_AVATAR_PACKS.forEach(pk => { if (pk.shelf === 'sacred') (pk.ids || []).concat(pk.arch || []).forEach(i => sacred.add(i)); });
    return { n: T.length, bad: T.filter(s => s.badge !== 'katha').map(s => s.id + ':' + s.badge), sac: T.filter(s => s.cast.some(c => sacred.has(c))).map(s => s.id),
      /* the door holds even if the flag list were wrong: flag an Itihaas story and it is still refused */
      held: (() => { const all = []; for (const k in window) if (/^IND_STORIES/.test(k) && Array.isArray(window[k])) all.push(...window[k]);
        const it = all.find(s => s.badge === 'itihaas'); window.IND_KATHA_CHAIN.katha_chain[it.id] = true;
        const leak = e.tales().some(s => s.id === it.id); delete window.IND_KATHA_CHAIN.katha_chain[it.id]; return leak; })() };
  });
  if (r.n < 10) throw new Error('only ' + r.n + ' tales');
  if (r.bad.length) throw new Error('non-Katha tales dealt: ' + r.bad.join(', '));
  if (r.sac.length) throw new Error('a sacred figure is in a dealt cast: ' + r.sac.join(', '));
  if (r.held) throw new Error('an Itihaas story flagged by mistake was dealt');
});

check('random', 'C1: a random orderer scores under 15% at L2', async ({ p }) => {
  const d = await deal(p, 2, 10);
  const short = d.filter(it => it.n < 4);
  if (short.length) throw new Error('an L2 tale has only ' + short[0].n + ' panels');
  const exact = d.reduce((a, it) => a + 1 / [1, 1, 2, 6, 24, 120, 720][it.n], 0) / d.length;
  if (!(exact < 0.15)) throw new Error('exact random rate ' + exact);
  if (d.some(it => it.start.every((x, i) => x === i))) throw new Error('an L2 item starts already in order');
  let right = 0, n = 0;
  for (let r = 0; r < 4; r++) {
    await mount(p, { level: 2 });
    for (let k = 0; k < 6; k++) {
      if ((await waitPhase(p, ['ask', 'done'], 4000)) === 'done') break;
      const m = await p.$$eval('.kc-row .kc-panel', e => e.length);
      for (let s = 0; s < 3; s++) { const a = Math.floor(Math.random() * m), b = Math.floor(Math.random() * m); if (a !== b) { await p.click(`.kc-row [data-slot="${a}"] .kc-text`); await p.click(`.kc-row [data-slot="${b}"] .kc-text`); } }
      await p.click('[data-kc="lock"]');
      if ((await waitPhase(p, ['miss', 'right'], 1500)) === 'miss') await p.click('[data-gm="aage"]');
    }
    await p.waitForTimeout(1300);
    const a = await p.evaluate(() => window.__ans); right += a.filter(x => x.right).length; n += a.length;
  }
  console.log(`         random orderer: exact ${(exact * 100).toFixed(1)}%, played ${right}/${n}`);
  if (n < 12 || right / n >= 0.3) throw new Error(`played random orderer ${right}/${n}`);
});

check('morals', 'C4: every moral distractor is another flagged tale\'s own moral; wrong events are other tales\' panels', async ({ p }) => {
  const morals = await p.evaluate(() => { const o = {}; for (const k in window) if (/^IND_STORIES/.test(k) && Array.isArray(window[k])) window[k].forEach(s => { o[s.id] = s.moral; }); return o; });
  const d5 = await deal(p, 5, 6);
  for (const it of d5) {
    it.from.forEach((f, i) => {
      if (morals[f] !== it.texts[i]) throw new Error(it.story + ': option ' + i + ' is not ' + f + '\'s moral');
      if (i === it.answer ? f !== it.story : f === it.story) throw new Error(it.story + ': the moral options are crossed');
    });
    if (new Set(it.texts).size !== 3) throw new Error(it.story + ': two options are the same moral');
  }
  const d3 = await deal(p, 3, 6);
  const panels = await p.evaluate(() => { const o = {}; const e = window.IND_GAMES.find(x => x.id === 'katha').engine; e.tales().forEach(s => { o[s.id] = e.beats(s).map(b => b.text); }); return o; });
  for (const it of d3) it.from.forEach((f, i) => {
    if (!panels[f] || !panels[f].some(t => t.startsWith(it.texts[i].replace(/\s+$/, '').slice(0, 40)))) throw new Error(it.story + ': event ' + i + ' is not a panel of ' + f);
    if ((i === it.answer) !== (f === it.story)) throw new Error(it.story + ': the event options are crossed');
  });
});

check('words', 'every panel and line on screen is the story data\'s own words', async ({ p }) => {
  const texts = await p.evaluate(() => { const o = []; const e = window.IND_GAMES.find(x => x.id === 'katha').engine; e.tales().forEach(s => s.scenes.forEach(sc => o.push(sc.text))); return o; });
  for (const L of [1, 2, 3, 4]) {
    await mount(p, { level: L });
    const shown = await p.$$eval('.kc-text, .kc-read p, .kc-line', e => e.map(x => x.textContent.replace(/^“|”$/g, '').trim()));
    if (!shown.length) throw new Error('L' + L + ' showed no story text');
    const bad = shown.filter(s => !texts.some(t => t.includes(s)));
    if (bad.length) throw new Error('L' + L + ' shows words not in the story data: "' + bad[0].slice(0, 60) + '"');
  }
});

check('unnumbered', 'no panel carries its place in the order', async ({ p }) => {
  for (const L of [1, 2]) {
    await mount(p, { level: L });
    const r = await p.evaluate(() => [...document.querySelectorAll('.kc-panel')].map(e => ({ t: e.innerText, a: [...e.attributes].map(a => a.name + '=' + a.value).join(' ') })));
    for (const x of r) {
      if (/(^|\s)(1st|2nd|3rd|[1-5]\.|#\d)(\s|$)/.test(x.t) || /\b\d\s*$/.test(x.t.split('\n')[0] || '')) throw new Error('a panel shows a number: ' + x.t.slice(0, 40));
      if (/data-(order|index|answer|right)/.test(x.a)) throw new Error('a panel carries its order in an attribute: ' + x.a);
    }
  }
});

check('miss', 'a wrong first answer holds with the miss card until Aage', async ({ p }) => {
  for (const L of [2, 3, 5]) {
    await mount(p, { level: L });
    const it = await item(p);
    if (it.kind === 'order') await p.click('[data-kc="lock"]'); else await p.click(`[data-opt="${it.wrong}"]`);
    await p.waitForTimeout(2000);
    const m = await p.evaluate(() => { const c = document.querySelector('.gm-miss'); return c && { t: /Not quite\./.test(c.textContent), a: !!c.querySelector('.gm-ans'), teach: !!c.querySelector('.gm-teach'), n: window.__ans.length, r: window.__ans[0] && window.__ans[0].right, step: document.querySelector('.kc-count').textContent }; });
    if (!m || !m.t || !m.a || !m.teach) throw new Error('L' + L + ': no full miss card ' + JSON.stringify(m));
    if (m.n !== 1 || m.r !== false || m.step !== '1 of ' + m.step.split(' of ')[1]) throw new Error('L' + L + ': the miss did not hold ' + JSON.stringify(m));
    await p.keyboard.press('Enter'); await p.waitForTimeout(250);
    if (await p.$('.gm-miss')) throw new Error('L' + L + ': Enter did not press Aage');
  }
});

check('keys', 'an L5 round by number keys, and an L2 item by Space, arrows and Enter', async ({ p }) => {
  await mount(p, { level: 5 });
  for (let n = 0; n < 8; n++) {
    if ((await waitPhase(p, ['ask', 'done'], 4000)) === 'done') break;
    const it = await item(p);
    await p.keyboard.press(String((n % 2 ? it.pick : it.wrong) + 1));
    if ((await waitPhase(p, ['miss', 'right'], 1500)) === 'miss') await p.keyboard.press('Enter');
  }
  await p.waitForTimeout(1400);
  const d = await p.evaluate(() => ({ d: window.__done, a: window.__ans }));
  if (!d.d || d.d.asked !== d.a.length || d.d.firstTryRight !== d.a.filter(x => x.right).length) throw new Error('L5 keyboard round: ' + JSON.stringify(d.d));
  /* L2 by keys: walk each panel to its place with Space + arrows, then Enter locks */
  await mount(p, { level: 2 });
  const n = await p.$$eval('.kc-row .kc-panel', e => e.length);
  for (let i = 0; i < n; i++) {
    const at = await p.evaluate(i => { const it = document.getElementById('gamehost').__kcState.item, s = window.IND_GAMES.find(x => x.id === 'katha').__short;
      return [...document.querySelectorAll('.kc-row .kc-panel')].map(e => e.getAttribute('aria-label')).indexOf('Panel: ' + s(it.panels[i].text)); }, i);
    if (at === i) continue;
    await p.focus(`.kc-row [data-slot="${at}"]`); await p.keyboard.press(' ');
    for (let k = at; k > i; k--) await p.keyboard.press('ArrowLeft');
    await p.keyboard.press(' ');
  }
  await p.focus('.kc-row [data-slot="0"]'); await p.keyboard.press('Enter');
  await p.waitForTimeout(200);
  const a = await p.evaluate(() => window.__ans);
  if (a.length !== 1 || !a[0].right) throw new Error('the keyboard-ordered tale was not judged right: ' + JSON.stringify(a));
});

check('touch', 'an L2 round by tapping two panels to swap; a panel dragged onto another', async ({ p }) => {
  await mount(p, { level: 2 });
  await playOut(p, true, 'tap');
  await p.waitForTimeout(1400);
  const d = await p.evaluate(() => window.__done);
  if (!d || d.asked < 3 || d.firstTryRight !== d.asked) throw new Error('the tapped L2 round: ' + JSON.stringify(d));
  await mount(p, { level: 2 });
  const before = await p.$$eval('.kc-row .kc-panel', e => e.map(x => x.getAttribute('aria-label')));
  const a = await (await p.$('.kc-row [data-slot="0"] .kc-text')).boundingBox(), b = await (await p.$('.kc-row [data-slot="1"] .kc-text')).boundingBox();
  await p.mouse.move(a.x + 10, a.y + 5); await p.mouse.down(); await p.mouse.move(a.x + 30, a.y + 25, { steps: 4 });
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(150);
  const after = await p.$$eval('.kc-row .kc-panel', e => e.map(x => x.getAttribute('aria-label')));
  if (after[0] !== before[1] || after[1] !== before[0]) throw new Error('dragging panel 1 onto panel 2 did not swap them');
}, { touch: true });

check('levels', 'every level plays to done() with a perfect bot, one answer() per item', async ({ p }) => {
  for (let L = 1; L <= 5; L++) {
    await mount(p, { level: L });
    await playOut(p, true);
    await p.waitForTimeout(1400);
    const d = await p.evaluate(() => ({ d: window.__done, a: window.__ans }));
    if (!d.d || d.d.level !== L || d.d.asked !== d.a.length || d.d.firstTryRight !== d.d.asked || d.d.levelNext !== Math.min(5, L + 1)) throw new Error('L' + L + ': ' + JSON.stringify(d.d));
    if (new Set(d.a.map(x => x.id)).size !== d.a.length) throw new Error('L' + L + ': an item reported twice');
  }
});

check('phone', '390×844: nothing off the side, Lock karo above the tab bar, targets ≥ 44px', async ({ p }) => {
  for (let L = 1; L <= 5; L++) {
    await mount(p, { level: L });
    const r = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('.kc button, .kc [data-slot]').forEach(el => {
        const b = el.getBoundingClientRect(); if (!b.width) return;
        if (b.left < -1 || b.right > innerWidth + 1) out.push('off the side: ' + el.className);
        if (b.height < 44 || b.width < 44) out.push('small: ' + el.className + ' ' + Math.round(b.width) + '×' + Math.round(b.height));
      });
      if (Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > innerWidth) out.push('page wider than the phone');
      const bar = document.querySelector('.bz-tabbar'), floor = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
      const lk = document.querySelector('[data-kc="lock"]');
      if (lk) { const b = lk.getBoundingClientRect(); if (b.bottom > floor || b.top < 0) out.push('Lock karo under the tab bar at ' + Math.round(b.top)); }
      return out;
    });
    if (r.length) throw new Error('L' + L + ': ' + r.slice(0, 3).join(' · '));
  }
}, { vp: PHONE });

check('gate', 'review: true and owner-opened (9 Oct 2026) — every child plays it, its page says so; without `open` the wait returns', async ({ p }) => {
  const reg = await p.evaluate(() => { const g = window.IND_GAMES.find(x => x.id === 'katha'); return { review: g.review, open: g.open, teaches: g.teaches, levels: g.levels.length, sub: typeof g.sub }; });
  if (reg.review !== true || reg.teaches !== true || reg.levels !== 5 || reg.sub !== 'string') throw new Error('registry: ' + JSON.stringify(reg));
  if (!reg.open || reg.open.by !== 'owner' || reg.open.to !== 'everyone' || !reg.open.on || !reg.open.why) throw new Error('no owner `open` record: ' + JSON.stringify(reg.open));
  await p.evaluate(() => window.IND_STORE.saveDevice('tester', false));
  try {
    await p.evaluate(() => window.BI.go('game', 'katha')); await p.waitForTimeout(500);
    const hg = await p.evaluate(() => ({ frame: !!document.getElementById('gamehost'), note: (document.querySelector('#gframe .gf-unchecked') || {}).textContent || '' }));
    if (!hg.frame || !/Not yet checked/.test(hg.note)) throw new Error('outside tester mode the host did not open Katha Chain with its note: ' + JSON.stringify(hg));
    await mount(p, { level: 2 });
    const w = await p.evaluate(() => ({ wait: !!document.querySelector('.kc-wait'), panel: !!document.querySelector('.kc-panel') }));
    if (w.wait || !w.panel) throw new Error('owner-opened, but outside tester mode no tale was dealt: ' + JSON.stringify(w));
    await p.evaluate(() => { const g = window.IND_GAMES.find(x => x.id === 'katha'); window.__open = g.open; delete g.open; });
    await mount(p, { level: 2 });
    const w2 = await p.evaluate(() => ({ wait: !!document.querySelector('.kc-wait'), panel: !!document.querySelector('.kc-panel') }));
    await p.evaluate(() => { const g = window.IND_GAMES.find(x => x.id === 'katha'); g.open = window.__open; });
    if (!w2.wait || w2.panel) throw new Error('without the owner\'s `open`, an unsigned tale was dealt: ' + JSON.stringify(w2));
  } finally { await p.evaluate(() => window.IND_STORE.saveDevice('tester', true)); }
});

check('shots', 'desktop and phone, day and night', async ({ p }) => {
  fs.mkdirSync(SHOTS, { recursive: true });
  for (const [vp, tag] of [[DESK, 'desk'], [PHONE, 'phone']]) for (const night of [false, true]) for (const L of [1, 2, 4, 5]) {
    await p.setViewportSize(vp);
    await mount(p, { level: L });
    await p.evaluate(n => { if (n) document.documentElement.setAttribute('data-mode', 'night'); else document.documentElement.removeAttribute('data-mode'); }, night);
    await p.evaluate(() => document.querySelector('.kc').scrollIntoView({ block: 'start' }));
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(SHOTS, `kc-L${L}-${tag}-${night ? 'night' : 'day'}.png`) });
  }
  console.log('         screenshots in ' + SHOTS);
});

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/?tester=1`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await browser.newContext({ viewport: c.vp || DESK, serviceWorkers: 'block', hasTouch: !!c.touch });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      await skipOnboarding(p);
      await p.evaluate(() => window.IND_LOAD(['content', 'voice', 'games']));
      await c.fn({ p, ctx, base });
      if (errs.length) throw new Error('page error: ' + errs[0]);
      console.log(`  ok   ${c.id.padEnd(10)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(10)} ${c.what}\n         ${process.env.FULLERR ? e.message : String(e.message).split('\n')[0]}`); fail++;
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
