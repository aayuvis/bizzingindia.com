#!/usr/bin/env node
/* Bizzing India — Akshar, letters in the family's own script (games spec §5.2, §8 T11; docs/32).

     shaping   A1/T11 every Indic or Urdu string on screen is ONE text node in an element that
               carries its own lang; none is letter-spaced; the display faces keep line-height
               ≥ 1.7 — across the five levels, a built syllable, a built word and the miss card
     width     A2 the built कि is exactly as wide as the shaped string कि (no tile seams) — and a
               glued pair of glyphs would not be, which is why the rule exists
     rtl       A3 an Urdu round builds right to left: dir="rtl" on every Urdu string, computed rtl
     trace     A4 tracing (L5) only where likhna.js can draw the guide: Devanagari opens the
               canvas, every other script says so and opens nothing
     tongue    A5 the family's tongue is the chosen chip; Hindi is never the default when another
               tongue is set; a tongue with no letters in the app chooses nothing
     gate      every script but Devanagari opens only in tester mode, inside the engine
     leak      the target is never on screen while it is being built (L2 syllable, L3 word)
     miss      a wrong first answer holds with the miss card until Aage; Enter is Aage
     keys      an L1 round and an L3 round by keyboard alone
     touch     an L3 round by tapping tiles; a vowel sign dragged onto its consonant (L2)
     levels    L1–L4 play to done() with a perfect bot; L5 judges a trace once, never an empty one
     phone     390×844: nothing off the side, Check above the tab bar, targets ≥ 44px
     shots     desktop and phone, day and night (AK_SHOTS)

   Each was watched to fail by breaking the thing it holds (see the commit).
   Run:  node tools/check-akshar.js [--only <id>]
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
const SHOTS = process.env.AK_SHOTS || path.join(os.tmpdir(), 'akshar-shots');
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));

async function mount(p, opts, tongue) {
  await p.evaluate(t => { window.BI.S.tongue = t; }, tongue === undefined ? null : tongue);
  await p.evaluate(() => window.BI.go('game', 'akshar'));
  await p.waitForSelector('#gamehost', { timeout: 20000 });
  await p.evaluate(({ opts }) => {
    const old = document.getElementById('gamehost'), h = old.cloneNode(false);
    old.replaceWith(h);
    window.__ans = []; window.__done = null;
    const g = window.IND_GAMES.find(x => x.id === 'akshar');
    window.__td = g.engine(h, Object.assign({ level: 1, band: '8-10', scope: null }, opts, { answer: r => window.__ans.push(r) }), r => { window.__done = r; });
  }, { opts: opts || {} });
  await p.waitForSelector('.ak', { timeout: 20000 });
}
async function start(p, pack) {
  if (pack) await p.click(`[data-pack="${pack}"]`);
  await p.click('[data-ak="start"]');
  await p.waitForTimeout(200);
}
const phase = p => p.evaluate(() => document.getElementById('gamehost').__akState.phase);
async function waitPhase(p, want, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < (ms || 4000)) { if (await p.evaluate(() => !!window.__done)) return 'done'; const ph = await phase(p); if (want.includes(ph)) return ph; await p.waitForTimeout(60); }
  return phase(p);
}
const item = p => p.evaluate(() => {
  const it = document.getElementById('gamehost').__akState.item; if (!it) return null;
  const o = { kind: it.kind };
  if (it.options) { o.pick = it.answer; o.wrong = (it.answer + 1) % it.options.length; }
  if (it.kind === 'matra') { o.pick = it.tiles.findIndex(m => m.sign === it.target.sign); o.wrong = it.tiles.findIndex(m => m.sign !== it.target.sign); o.syll = it.syll; }
  if (it.kind === 'word') { const used = []; o.seq = it.parts.map(pt => { const i = it.tiles.findIndex((t, j) => t === pt && !used.includes(j)); used.push(i); return i; }); o.word = it.word.word;
    /* a wrong build: a piece that is not in the word first, then the rest */
    const extra = it.tiles.findIndex(t => !it.parts.includes(t)); o.bad = [extra].concat(o.seq.slice(1)); }
  return o;
});
async function play(p, right, how) {
  const it = await item(p);
  const press = async sel => how === 'tap' ? p.tap(sel) : p.click(sel);
  if (it.kind === 'hear' || it.kind === 'join') await press(`[data-opt="${right ? it.pick : it.wrong}"]`);
  else if (it.kind === 'matra') { await press(`[data-tile="${right ? it.pick : it.wrong}"]`); await press('[data-ak="check"]'); }
  else if (it.kind === 'word') { const seq = right ? it.seq : it.bad; for (const i of seq) await press(`[data-tile="${i}"]`); await press('[data-ak="check"]'); }
  if ((await waitPhase(p, ['miss', 'right'], 1500)) === 'miss') await press('[data-gm="aage"]');
}
async function playOut(p, right, how) {
  for (let n = 0; n < 12; n++) {
    if ((await waitPhase(p, ['ask', 'done'], 4000)) === 'done') return;
    await play(p, typeof right === 'function' ? right(n) : right, how);
  }
}
/* A1 / T11: every Indic or Urdu run is one text node in an element with its own lang */
const SHAPE = () => {
  const RX = /[ऀ-෿؀-ۿ]/, bad = [];
  const w = document.createTreeWalker(document.querySelector('.ak'), NodeFilter.SHOW_TEXT);
  let n, count = 0;
  while ((n = w.nextNode())) {
    if (!RX.test(n.nodeValue)) continue;
    count++;
    const el = n.parentElement, cs = getComputedStyle(el);
    if (!el.getAttribute('lang')) bad.push('no lang on "' + n.nodeValue + '"');
    if (el.childNodes.length !== 1) bad.push('"' + n.nodeValue + '" shares its element with ' + (el.childNodes.length - 1) + ' other nodes');
    if (cs.letterSpacing !== 'normal' && parseFloat(cs.letterSpacing) !== 0) bad.push('letter-spacing ' + cs.letterSpacing + ' on "' + n.nodeValue + '"');
    if (/ak-glyph|ak-word|ak-t\b/.test(el.className) && parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) < 1.69) bad.push('line-height ' + cs.lineHeight + ' at ' + cs.fontSize + ' on "' + n.nodeValue + '"');
  }
  return { count, bad };
};

check('shaping', 'A1/T11: every syllable on screen is one text node with its lang; never letter-spaced', async ({ p }) => {
  const runs = [[1, 'hi'], [2, 'hi'], [3, 'hi'], [4, 'hi'], [2, 'ta'], [3, 'bn'], [4, 'gu'], [3, 'ur']];
  for (const [L, pk] of runs) {
    await mount(p, { level: L }, pk);
    let r = await p.evaluate(SHAPE);
    if (r.bad.length) throw new Error('intro: ' + r.bad[0]);
    await start(p);
    const it = await item(p);
    if (it.kind === 'matra') await p.click(`[data-tile="${it.wrong}"]`);
    if (it.kind === 'word') { await p.click(`[data-tile="${it.seq[0]}"]`); await p.click(`[data-tile="${it.seq[1]}"]`); }
    r = await p.evaluate(SHAPE);
    if (!r.count) throw new Error(`L${L} ${pk}: no script on screen at all`);
    if (r.bad.length) throw new Error(`L${L} ${pk}: ${r.bad[0]}`);
    /* and the miss card, which sets the answer in its script */
    await mount(p, { level: L }, pk); await start(p);
    const it2 = await item(p);
    if (it2.kind === 'hear' || it2.kind === 'join') await p.click(`[data-opt="${it2.wrong}"]`);
    else if (it2.kind === 'matra') { await p.click(`[data-tile="${it2.wrong}"]`); await p.click('[data-ak="check"]'); }
    else { for (const i of it2.bad) await p.click(`[data-tile="${i}"]`); await p.click('[data-ak="check"]'); }
    await p.waitForSelector('.gm-miss');
    r = await p.evaluate(SHAPE);
    if (r.bad.length) throw new Error(`L${L} ${pk} miss card: ${r.bad[0]}`);
  }
}, { tongueRuns: true });

check('width', 'A2: the built कि is as wide as the shaped string कि — no seams', async ({ p }) => {
  await mount(p, { level: 2 }, 'hi'); await start(p);
  await p.evaluate(() => {
    const it = document.getElementById('gamehost').__akState.item, S = window.IND_SCRIPTS.devanagari;
    it.cons = S.consonants.find(c => c.char === 'क'); it.tiles[0] = S.matras.find(m => m.sign === 'ि');
  });
  await p.click('[data-tile="0"]');
  await p.evaluate(() => document.fonts && document.fonts.ready);
  const m = await p.evaluate(() => {
    const el = document.querySelector('.ak-show [data-ak-text]');
    const range = document.createRange(); range.selectNodeContents(el);
    const built = range.getBoundingClientRect().width;
    const probe = document.createElement('span'); probe.className = el.className; probe.setAttribute('lang', 'hi'); probe.textContent = 'कि';
    el.parentNode.appendChild(probe); const r2 = document.createRange(); r2.selectNodeContents(probe); const shaped = r2.getBoundingClientRect().width; probe.remove();
    /* what glued tiles would draw: the consonant and the sign as two boxes side by side */
    const glued = document.createElement('span'); glued.className = el.className; glued.setAttribute('lang', 'hi');
    glued.innerHTML = '<span style="display:inline-block">क</span><span style="display:inline-block">ि</span>';
    el.parentNode.appendChild(glued); const gw = glued.getBoundingClientRect().width; glued.remove();
    return { text: el.textContent, nodes: el.childNodes.length, built, shaped, gw };
  });
  if (m.text !== 'कि' || m.nodes !== 1) throw new Error('the built syllable is not the one string कि: ' + JSON.stringify(m));
  if (Math.abs(m.built - m.shaped) > 0.5) throw new Error(`built ${m.built}px vs shaped ${m.shaped}px`);
  if (Math.abs(m.gw - m.shaped) < 1) throw new Error('glued glyphs measure the same as shaped text — the check cannot see a seam');
  console.log(`         कि built ${m.built.toFixed(1)}px = shaped ${m.shaped.toFixed(1)}px (glued would be ${m.gw.toFixed(1)}px)`);
});

check('rtl', 'A3: an Urdu round runs right to left', async ({ p }) => {
  for (const L of [1, 2, 3]) {
    await mount(p, { level: L }, 'ur'); await start(p);
    const it = await item(p);
    if (it.kind === 'word') { await p.click(`[data-tile="${it.seq[0]}"]`); await p.click(`[data-tile="${it.seq[1]}"]`); }
    if (it.kind === 'matra') await p.click(`[data-tile="${it.pick}"]`);
    const r = await p.evaluate(() => [...document.querySelectorAll('.ak [lang="ur"]')].map(e => ({ dir: e.getAttribute('dir'), cs: getComputedStyle(e).direction })));
    if (!r.length) throw new Error('L' + L + ': no Urdu on screen');
    const bad = r.filter(x => x.dir !== 'rtl' || x.cs !== 'rtl');
    if (bad.length) throw new Error('L' + L + ': ' + bad.length + ' Urdu strings are not right to left');
    if (L === 3) { const d = await p.evaluate(() => getComputedStyle(document.querySelector('.ak-tiles')).direction); if (d !== 'rtl') throw new Error('the Urdu tiles do not run right to left'); }
  }
});

check('trace', 'A4: tracing only where likhna.js can draw the guide', async ({ p }) => {
  const can = await p.evaluate(() => { const e = window.IND_GAMES.find(x => x.id === 'akshar').engine; return e.packs().map(pk => [pk.id, pk.script, e.canTrace(pk)]); });
  const wrong = can.filter(([id, sc, c]) => c !== /^devanagari/.test(sc));
  if (wrong.length) throw new Error('canTrace disagrees with the stroke data: ' + JSON.stringify(wrong));
  await mount(p, { level: 5 }, 'hi'); await start(p);
  if (!(await p.$('#tInk'))) throw new Error('Devanagari L5 opened no tracing canvas');
  for (const pk of ['ta', 'ur', 'bn']) {
    await mount(p, { level: 5 }, pk);
    const r = await p.evaluate(() => ({ canvas: !!document.querySelector('canvas'), dis: document.querySelector('[data-ak="start"]').disabled, note: (document.querySelector('.ak-note') || {}).textContent || '' }));
    if (r.canvas || !r.dis || !/Devanagari only/.test(r.note)) throw new Error(pk + ' L5: ' + JSON.stringify(r));
  }
});

check('tongue', 'A5: the family tongue is chosen; Hindi never the default when another is set', async ({ p }) => {
  const on = () => p.$$eval('.ak-chip.on', e => e.map(x => x.getAttribute('data-pack')));
  for (const [t, want] of [['ta', ['ta']], ['bn', ['bn']], ['mr', ['mr']], ['ur', ['ur']], ['ml', []], [null, ['hi']]]) {
    await mount(p, { level: 1 }, t);
    const got = await on();
    if (got.join() !== want.join()) throw new Error(`tongue ${t}: chosen ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
    if (t && t !== 'hi' && got.includes('hi')) throw new Error('Hindi chosen for a ' + t + ' family');
  }
  await mount(p, { level: 1 }, 'ml');
  if (!(await p.$eval('[data-ak="start"]', b => b.disabled))) throw new Error('a tongue with no letters in the app started a round in some other script');
});

check('gate', 'every script but Devanagari opens only in tester mode', async ({ p }) => {
  await p.evaluate(() => window.IND_STORE.saveDevice('tester', false));
  try {
    await mount(p, { level: 1 }, 'ta');
    const r = await p.evaluate(() => ({ dis: document.querySelector('[data-ak="start"]').disabled, lock: !!document.querySelector('[data-pack="ta"] .ak-lock'), hi: !!document.querySelector('[data-pack="hi"] .ak-lock') }));
    if (!r.dis || !r.lock || r.hi) throw new Error('outside tester mode: ' + JSON.stringify(r));
    await p.click('[data-ak="start"]', { force: true }); await p.waitForTimeout(150);
    if (await p.$('[data-opt]')) throw new Error('a Tamil round started outside tester mode');
    await start(p, 'hi');
    if (!(await p.$('[data-opt]'))) throw new Error('Devanagari did not open outside tester mode');
  } finally { await p.evaluate(() => window.IND_STORE.saveDevice('tester', true)); }
  await mount(p, { level: 1 }, 'ta');
  if (await p.$eval('[data-ak="start"]', b => b.disabled)) throw new Error('Tamil stays shut in tester mode');
});

check('leak', 'the target is never on screen while it is being built', async ({ p }) => {
  for (const [L, pk] of [[2, 'hi'], [2, 'pa'], [3, 'hi'], [3, 'ta'], [3, 'ur']]) {
    for (let r = 0; r < 3; r++) {
      await mount(p, { level: L }, pk); await start(p);
      const it = await item(p);
      const target = it.kind === 'matra' ? it.syll : it.word;
      const shown = await p.evaluate(t => document.querySelector('.ak').innerText.includes(t) || [...document.querySelectorAll('.ak [aria-label]')].some(e => e.getAttribute('aria-label').includes(t)), target);
      if (shown) throw new Error(`L${L} ${pk}: "${target}" is on screen before it is built`);
    }
  }
});

check('miss', 'a wrong first answer holds with the miss card until Aage', async ({ p }) => {
  for (const L of [1, 2, 3, 4]) {
    await mount(p, { level: L }, 'hi'); await start(p);
    const step = await p.$eval('.ak-count', e => e.textContent);
    const it = await item(p);
    if (it.kind === 'hear' || it.kind === 'join') await p.click(`[data-opt="${it.wrong}"]`);
    else if (it.kind === 'matra') { await p.click(`[data-tile="${it.wrong}"]`); await p.click('[data-ak="check"]'); }
    else { for (const i of it.bad) await p.click(`[data-tile="${i}"]`); await p.click('[data-ak="check"]'); }
    await p.waitForTimeout(2000);
    const m = await p.evaluate(() => { const c = document.querySelector('.gm-miss'); return c && { t: /Not quite\./.test(c.textContent), a: !!c.querySelector('.gm-ans [lang]'), teach: !!c.querySelector('.gm-teach'), n: window.__ans.length, r: window.__ans[0] && window.__ans[0].right, step: document.querySelector('.ak-count').textContent }; });
    if (!m || !m.t || !m.a || !m.teach) throw new Error('L' + L + ': the miss card is missing or incomplete ' + JSON.stringify(m));
    if (m.n !== 1 || m.r !== false || m.step !== step) throw new Error('L' + L + ': the miss did not hold ' + JSON.stringify(m));
    await p.keyboard.press('Enter'); await p.waitForTimeout(250);
    if (await p.$('.gm-miss')) throw new Error('L' + L + ': Enter did not press Aage');
  }
});

check('keys', 'an L1 and an L3 round by keyboard alone', async ({ p }) => {
  for (const L of [1, 3]) {
    await mount(p, { level: L }, 'hi');
    await p.focus('[data-ak="start"]'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    for (let n = 0; n < 12; n++) {
      if ((await waitPhase(p, ['ask', 'done'], 4000)) === 'done') break;
      const it = await item(p);
      if (it.kind === 'hear') await p.keyboard.press(String((n % 3 ? it.pick : it.wrong) + 1));
      else { for (const i of (n % 3 ? it.seq : it.bad)) await p.keyboard.press(String(i + 1)); await p.evaluate(() => document.activeElement && document.activeElement.blur()); await p.keyboard.press('Enter'); }
      if ((await waitPhase(p, ['miss', 'right'], 1500)) === 'miss') await p.keyboard.press('Enter');
    }
    await p.waitForTimeout(1300);
    const d = await p.evaluate(() => ({ d: window.__done, a: window.__ans }));
    if (!d.d || d.d.asked !== d.a.length || d.d.asked < 6) throw new Error('L' + L + ' keyboard round: ' + JSON.stringify(d.d));
    if (d.d.firstTryRight !== d.a.filter(x => x.right).length || !d.a.some(x => !x.right) || !d.a.some(x => x.right)) throw new Error('L' + L + ': the rights and misses do not add up');
  }
});

check('touch', 'an L3 round by tapping tiles; a vowel sign dragged onto its consonant', async ({ p }) => {
  await mount(p, { level: 3 }, 'hi');
  await p.tap('[data-ak="start"]'); await p.waitForTimeout(200);
  await playOut(p, true, 'tap');
  await p.waitForTimeout(1300);
  const d = await p.evaluate(() => window.__done);
  if (!d || d.firstTryRight !== d.asked || d.asked < 4) throw new Error('the tapped L3 round: ' + JSON.stringify(d));
  await mount(p, { level: 2 }, 'hi'); await start(p);
  const it = await item(p);
  await p.$eval('.ak-show', e => e.scrollIntoView({ block: 'center' }));
  const a = await (await p.$(`[data-tile="${it.pick}"]`)).boundingBox(), b = await (await p.$('.ak-show')).boundingBox();
  await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down();
  await p.mouse.move(a.x + 30, a.y - 20, { steps: 4 }); await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 }); await p.mouse.up();
  await p.waitForTimeout(150);
  const shown = await p.$eval('.ak-show [data-ak-text]', e => e.textContent);
  if (shown !== it.syll) throw new Error('the dragged sign did not land on the consonant: ' + shown);
  await p.click('[data-ak="check"]'); await p.waitForTimeout(150);
  const ans = await p.evaluate(() => window.__ans);
  if (ans.length !== 1 || !ans[0].right) throw new Error('the dragged build was not judged right');
}, { touch: true });

check('levels', 'L1–L4 to done() with a perfect bot; L5 judges a trace once, never an empty one', async ({ p }) => {
  for (const L of [1, 2, 3, 4]) {
    await mount(p, { level: L }, 'hi'); await start(p);
    await playOut(p, true);
    await p.waitForTimeout(1300);
    const d = await p.evaluate(() => ({ d: window.__done, a: window.__ans }));
    if (!d.d || d.d.level !== L || d.d.asked !== d.a.length || d.d.firstTryRight !== d.d.asked || d.d.levelNext !== Math.min(5, L + 1)) throw new Error('L' + L + ': ' + JSON.stringify(d.d));
    if (new Set(d.a.map(x => x.id)).size !== d.a.length) throw new Error('L' + L + ': an item reported twice');
  }
  await mount(p, { level: 5 }, 'hi'); await start(p);
  await p.click('[data-ak="check"]'); await p.waitForTimeout(150);
  if ((await p.evaluate(() => window.__ans.length)) !== 0) throw new Error('an empty canvas was judged');
  const c = await (await p.$('#tInk')).boundingBox();
  await p.mouse.move(c.x + 20, c.y + 20); await p.mouse.down(); await p.mouse.move(c.x + c.width - 20, c.y + c.height - 20, { steps: 10 }); await p.mouse.up();
  await p.click('[data-ak="check"]'); await p.waitForTimeout(200);
  await p.click('[data-ak="check"]').catch(() => {}); await p.waitForTimeout(100);
  const n = await p.evaluate(() => window.__ans.length);
  if (n !== 1) throw new Error('a trace was judged ' + n + ' times');
});

check('phone', '390×844: nothing off the side, Check above the tab bar, targets ≥ 44px', async ({ p }) => {
  for (const L of [1, 2, 3, 4, 5]) {
    await mount(p, { level: L }, 'hi'); await start(p);
    const r = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('.ak button').forEach(el => {
        const b = el.getBoundingClientRect(); if (!b.width) return;
        if (b.left < -1 || b.right > innerWidth + 1) out.push('off the side: ' + el.className);
        if (b.height < 44 || b.width < 44) out.push('small: ' + el.className + ' ' + Math.round(b.width) + '×' + Math.round(b.height));
      });
      if (Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > innerWidth) out.push('page wider than the phone');
      const bar = document.querySelector('.bz-tabbar'), floor = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
      const ck = document.querySelector('[data-ak="check"]');
      if (ck) { const b = ck.getBoundingClientRect(); if (b.bottom > floor || b.top < 0) out.push('Check is under the tab bar at ' + Math.round(b.top)); }
      return out;
    });
    if (r.length) throw new Error('L' + L + ': ' + r.slice(0, 3).join(' · '));
  }
}, { vp: PHONE });

check('shots', 'desktop and phone, day and night', async ({ p }) => {
  fs.mkdirSync(SHOTS, { recursive: true });
  for (const [vp, tag] of [[DESK, 'desk'], [PHONE, 'phone']]) for (const night of [false, true]) for (const [L, pk] of [[2, 'hi'], [3, 'ta'], [1, 'ur'], [5, 'hi']]) {
    await p.setViewportSize(vp);
    await mount(p, { level: L }, pk); await start(p);
    await p.evaluate(n => { if (n) document.documentElement.setAttribute('data-mode', 'night'); else document.documentElement.removeAttribute('data-mode'); }, night);
    const it = await item(p);
    if (it && it.kind === 'matra') await p.click(`[data-tile="${it.pick}"]`);
    if (it && it.kind === 'word') await p.click(`[data-tile="${it.seq[0]}"]`);
    await p.evaluate(() => document.querySelector('.ak').scrollIntoView({ block: 'start' }));
    await p.screenshot({ path: path.join(SHOTS, `ak-L${L}-${pk}-${tag}-${night ? 'night' : 'day'}.png`) });
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
      await p.evaluate(() => window.IND_LOAD(['bhasha', 'voice', 'games']));
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
