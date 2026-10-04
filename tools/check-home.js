#!/usr/bin/env node
/* Bizzing India — Home, in the family's anatomy (FIX-INDIA B1, B2, B3, A3, A5; family
   standard §2, §4, §14). docs/24-home.md says why each one exists.

     anatomy   Home is Bee's three rows from family/bizzing-shell.js — greeting · ring · word
               of the hour / ONE Continue · the map / tip · quote — and a footer, nothing else
     primary   exactly one filled primary button on Home, and it is Continue — desktop and phone
     fold      on a 390×844 phone the Continue button is fully on screen, above the tab bar
     onenext   Continue and #/continue are one function: for a new child, a story left
               part-way, a language lesson and a course stop, both open the same screen —
               and the story opens at the scene the child left
     progress  where the child is sits next to Continue: rank, a bar, and the map's place
               count read from the map itself (the audit found 34 here and 36 on the map)
     firstlearn the landing's "Read it" plays tonight's story with no setup at all; its end
               asks for the setup, the story stays read and its place lit, and a real story
               is one tap from the end of setup
     demo      ?demo is a labelled sample child with weeks of progress, and the real
               household on the device is byte-for-byte untouched after using it

   Each was watched to fail by breaking the thing it holds (docs/24-home.md).
   Run:  node tools/check-home.js            # all of them
         node tools/check-home.js --only fold
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
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
const tap = async (p, sel) => { await p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no ' + s); e.click(); }, sel); await p.waitForTimeout(350); };
const home = async p => { await tap(p, '[data-bz=tab][data-v="home"]'); };
const profile = p => p.evaluate(() => JSON.parse(localStorage.getItem('bi_v1') || 'null'));
const filled = p => p.evaluate(() => [...document.querySelectorAll('#main .btn, #main .bz-btn')]
  .filter(b => !b.classList.contains('ghost') && !b.classList.contains('out') && getComputedStyle(b).display !== 'none')
  .map(b => (b.getAttribute('data-act') || '') + ':' + b.textContent.trim()));

check('anatomy', 'Home is Bee\'s three rows — greeting · ring · word of the hour / Continue · the map / tip · quote — and a footer, nothing else', async ({ p }) => {
  const a = await p.evaluate(() => {
    const m = document.getElementById('main'), h = m.querySelector('[data-bz=home]');
    const kids = sel => h ? [...h.querySelectorAll(sel)].map(x => x.getAttribute('data-bz')) : [];
    return { top: [...m.children].map(x => x.getAttribute('data-bz') || x.className || x.tagName),
      home: h ? [...h.children].map(x => x.getAttribute('data-bz') || x.className) : [],
      r1: kids('[data-bz=r1] > *'), r2: kids('[data-bz=r2] > *'), r3: kids('[data-bz=r3] > *'),
      ring: !!m.querySelector('[data-bz=ring] .goring'), cont: m.querySelectorAll('[data-bz=continue][data-act="cont"]').length };
  });
  if (JSON.stringify(a.top) !== '["home"]') throw new Error('Home carries blocks outside Bee\'s home: ' + JSON.stringify(a.top));
  if (JSON.stringify(a.home) !== '["r1","r2","r3","bz-foot"]') throw new Error('Home is not three rows and a footer: ' + JSON.stringify(a.home));
  if (JSON.stringify(a.r1) !== '["greet","ring","hour"]') throw new Error('row 1 is not greeting · ring · word of the hour: ' + JSON.stringify(a.r1));
  if (JSON.stringify(a.r2) !== '["next","second"]') throw new Error('row 2 is not Continue · the second journey: ' + JSON.stringify(a.r2));
  if (JSON.stringify(a.r3) !== '["tip","quote"]') throw new Error('row 3 is not tip · quote: ' + JSON.stringify(a.r3));
  if (!a.ring) throw new Error('the ring tile has no ring');
  if (a.cont !== 1) throw new Error(a.cont + ' Continue buttons on Home — there must be exactly one');
});

check('primary', 'exactly one filled primary button on Home — Continue — on desktop and phone', async ({ p }) => {
  for (const vp of [DESK, PHONE]) {
    await p.setViewportSize(vp); await p.waitForTimeout(250);
    const f = await filled(p);
    if (f.length !== 1 || f[0].indexOf('cont:') !== 0)
      throw new Error(`at ${vp.width}px Home has ${f.length} filled buttons: ${JSON.stringify(f)}`);
  }
});

check('fold', 'at 390×844 the Continue button is on screen, above the tab bar', async ({ p }) => {
  const m = await p.evaluate(() => {
    const b = document.querySelector('#main [data-act="cont"]').getBoundingClientRect();
    const nav = document.querySelector('[data-bz=tabbar]'), ns = nav && getComputedStyle(nav);
    const navTop = nav && ns.position === 'fixed' ? nav.getBoundingClientRect().top : innerHeight;
    return { top: b.top, bottom: b.bottom, navTop, vh: innerHeight };
  });
  if (m.top < 0 || m.bottom > m.navTop)
    throw new Error(`Continue is at ${Math.round(m.top)}–${Math.round(m.bottom)}px; the tab bar starts at ${Math.round(m.navTop)}px`);
}, { vp: PHONE });

/* the screen Continue opens, and the screen #/continue opens, FROM THE SAME STORAGE: opening
   a course stop marks it seen and moves the frontier on, so the second door is walked from
   a restored copy of what the first door saw */
const dump = p => p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
const probe = p => p.evaluate(() => ({ hash: location.hash,
  q: !!document.querySelector('#main > .backlink[data-act="pack"]'),
  dots: document.querySelectorAll('.reader .dots i.on').length }));
async function bothDoors(p, ctx, base, why) {
  await home(p);
  const snap = await dump(p);
  await tap(p, '#main [data-act="cont"]');
  const a = await probe(p);
  await p.evaluate(o => { localStorage.clear(); Object.keys(o).forEach(k => localStorage.setItem(k, o[k])); }, snap);
  /* a REAL load: a goto that changes only the hash is a same-document navigation, and the
     second door would run on the first door's memory */
  await p.goto('about:blank');
  await p.goto(base + '#/continue', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  const b = await probe(p);
  if (a.hash !== b.hash || a.q !== b.q || a.dots !== b.dots)
    throw new Error(`${why}: Continue opened ${JSON.stringify(a)} but #/continue opened ${JSON.stringify(b)}`);
  return a;
}
check('onenext', 'Continue and #/continue open the same next thing, every time', async ({ p, ctx, base }) => {
  /* a new child: tonight's story, the same one the landing offered */
  const fresh = await bothDoors(p, ctx, base, 'a new child');
  if (!/^#\/story\//.test(fresh.hash)) throw new Error('a new child\'s Continue is not a story: ' + fresh.hash);
  /* a story left part-way comes back at the scene it was left on */
  await tap(p, '[data-act="next"]'); await tap(p, '[data-act="next"]');
  const left = await p.evaluate(() => document.querySelectorAll('.reader .dots i.on').length);
  const mid = await bothDoors(p, ctx, base, 'a story left part-way');
  if (mid.dots !== left) throw new Error(`the story was left on scene ${left} and Continue opened scene ${mid.dots}`);
  /* a language lesson, started more recently, is the next thing now — and it opens under way */
  await tap(p, '[data-bz=tab][data-v="bhasha"]');
  await tap(p, '[data-act="pack"][data-id="hi"]');
  await tap(p, '.bh-next');
  const lang = await bothDoors(p, ctx, base, 'a language lesson');
  if (lang.hash !== '#/pack/hi' || !lang.q) throw new Error('Continue did not open the Hindi lesson under way: ' + JSON.stringify(lang));
  /* a course stop, walked last */
  await p.evaluate(() => { location.hash = '#/paath/neeti-course'; }); await p.waitForTimeout(500);
  await tap(p, '[data-pa="lesson"]');
  const course = await bothDoors(p, ctx, base, 'a course stop');
  if (!/^#\/paathl\//.test(course.hash)) throw new Error('Continue did not open the course stop: ' + course.hash);
});

/* THE PLATES GO TO NIGHT (audit, 03-home-night): Home's story and map plates stayed in daylight
   on a night page. Measured on the screen's own pixels: at night each plate is at most 60% as
   bright as by day. And the Continue card says what finishing does once, not twice (03-home-new). */
async function plateLum(p) {
  const out = [];
  for (const sel of ['[data-bz=next] .bz-plate', '[data-bz=second] .bz-plate']) {
    const el = await p.$(sel); if (!el) { out.push(null); continue; }
    const png = (await el.screenshot()).toString('base64');
    out.push(await p.evaluate(async b64 => {
      const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
      const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data; let t = 0;
      for (let i = 0; i < d.length; i += 4) t += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      return t / (d.length / 4) / 255;
    }, png));
  }
  return out;
}
check('night', 'at night Home\'s plates dim with the page; Continue says what finishing does once', async ({ p }) => {
  await p.evaluate(() => window.BI.go('home')); await p.waitForTimeout(500);
  const t = await p.evaluate(() => { const n = document.querySelector('[data-bz=next]'); return n ? n.innerText : ''; });
  const chip = await p.evaluate(() => (document.querySelector('[data-bz=next] .bz-chiprow span') || {}).textContent || '');
  if (chip && t.split(chip).length > 2) throw new Error(`the Continue card says "${chip}" twice`);
  const day = await plateLum(p);
  await p.click('[data-bz=theme]'); await p.waitForTimeout(600);
  if ((await p.evaluate(() => document.documentElement.getAttribute('data-mode'))) !== 'night') throw new Error('the moon did not turn night on');
  const night = await plateLum(p);
  await p.click('[data-bz=theme]'); await p.waitForTimeout(300);
  ['story', 'map'].forEach((w, i) => {
    if (day[i] == null || night[i] == null) throw new Error(`no ${w} plate on Home`);
    if (night[i] > 0.6 * day[i]) throw new Error(`the ${w} plate is ${Math.round(night[i] / day[i] * 100)}% as bright at night as by day — still daylight`);
  });
});

check('progress', 'rank, a bar and the map\'s own place count sit on Home, the map beside Continue', async ({ p }) => {
  /* Home draws before the map group loads (docs/27); its count must still be the MAP's */
  await p.evaluate(() => window.IND_LOAD && window.IND_LOAD(['map']));
  const m = await p.evaluate(() => {
    const w = document.querySelector('[data-bz=second]'), c = document.querySelector('[data-bz=next]'), r = document.querySelector('[data-bz=ring]');
    const total = Object.keys((window.IND_MAP && window.IND_MAP.paths) || {}).length;
    const wr = w && w.getBoundingClientRect(), cr = c && c.getBoundingClientRect();
    return { has: !!w, text: w ? w.textContent : '', rank: r ? r.textContent : '', total,
             meters: document.querySelectorAll('[data-bz=r2] .bz-prog').length,
             beside: !!(wr && cr && Math.abs(wr.top - cr.top) < 4 && wr.left > cr.right - 2) };
  });
  if (!m.has) throw new Error('no map journey on Home');
  if (!m.beside) throw new Error('the map is not beside the Continue card');
  if (!/Shishya|Vidyarthi|Sadhak|Khoji|Pandit|Vidwan|Acharya|Rishi/.test(m.rank)) throw new Error('no rank shown in the ring tile');
  if (m.meters < 2) throw new Error('Continue and the map need a bar each; found ' + m.meters);
  if (m.text.indexOf('of ' + m.total + ' places') < 0) throw new Error(`the place count is not the map's ${m.total}: "${m.text.slice(0, 80)}"`);
}, { vp: DESK });

/* THE NEXT PLACE GLOWS — ITS FILL, NEVER ITS BOUNDARY (owner, 4 Oct 2026; v4 D8): on the map the
   one state Continue's story will light is marked, it is the state the companion stands on, and
   nothing about it moves: no animation or transition of its own, and its outline is drawn exactly
   as its neighbours' are. Once lit, it no longer glows. */
check('frontier', 'the map marks the state the next story lights — by its fill, static, the outline untouched', async ({ p }) => {
  const look = () => p.evaluate(async () => { window.BI.go('map'); if (window.BI.ready) await window.BI.ready(); await new Promise(r => setTimeout(r, 400));
    const g = [...document.querySelectorAll('.mapsvg .terrg.next')], plain = document.querySelector('.mapsvg .terrg:not(.next):not(.home):not(.on) .terr');
    const one = g[0], t = one && one.querySelector('.terr'), m = one && one.querySelector('.mist');
    const cs = t && getComputedStyle(t), ps = plain && getComputedStyle(plain), ms = m && getComputedStyle(m);
    const you = document.querySelector('.mapyou'), yr = you && you.getBoundingClientRect(), tr = t && t.getBoundingClientRect();
    return { n: g.length, code: one && one.getAttribute('data-code'),
      stroke: cs && [cs.stroke, cs.strokeWidth].join(' '), plain: ps && [ps.stroke, ps.strokeWidth].join(' '),
      moves: [cs, ms].filter(Boolean).some(x => (x.animationName && x.animationName !== 'none') || parseFloat(x.transitionDuration) > 0 && x.transitionProperty !== 'opacity'),
      mistMoves: !!(ms && ((ms.animationName && ms.animationName !== 'none') || parseFloat(ms.transitionDuration) > 0)),
      washed: !!(ms && ms.display !== 'none' && +ms.opacity > 0.05),
      under: !!(yr && tr && yr.left + yr.width / 2 >= tr.left && yr.left + yr.width / 2 <= tr.right && yr.top + yr.height / 2 >= tr.top && yr.top + yr.height / 2 <= tr.bottom),
      legend: (document.querySelector('.maplegend') || {}).textContent || '', lit: Object.keys(window.BI.S.lit || {}) }; });
  const a = await look();
  if (a.n !== 1) throw new Error(`${a.n} states glow; the next one alone should`);
  if (a.lit.includes(a.code)) throw new Error('a state already lit glows as the next one');
  if (!a.washed) throw new Error('the next state has no wash on its fill');
  if (a.stroke !== a.plain) throw new Error(`the next state's outline is drawn differently (${a.stroke} vs ${a.plain}) — the boundary is never the mark`);
  if (a.moves || a.mistMoves) throw new Error('the glow moves — an animation or transition of its own');
  if (!a.under) throw new Error('the glowing state is not where the companion stands');
  if (!/glowing/.test(a.legend)) throw new Error('the legend does not say what the glow means');
  /* light it: it stops glowing */
  await p.evaluate(c => { window.BI.S.lit[c] = true; }, a.code);
  const b = await look();
  if (b.code === a.code) throw new Error('a lit state still glows');
}, { vp: DESK });

check('firstlearn', 'Read it plays a story in the landing itself, before any setup; setup keeps it; a story is one tap after setup', async ({ p }) => {
  /* THE THREE PHOTOGRAPHS (owner, 4 Oct 2026: "allow screenshots"; v4 A1): the landing names the
     ages it is for, and shows three photographs of the app — a story, the map, a lesson — below
     the hero, lazy, from tools/gen-landing-shots.js. Three, not a gallery; never a feature grid. */
  const shots = await p.evaluate(() => { const h = document.querySelector('.hero'), hb = h ? h.getBoundingClientRect().bottom : 0;
    const im = [...document.querySelectorAll('.lshots img')];
    return { ages: /4 to 12|4–12/.test((document.querySelector('.hero') || {}).textContent || ''),
      n: im.length, src: im.map(i => i.getAttribute('src')), lazy: im.every(i => i.getAttribute('loading') === 'lazy'),
      alt: im.every(i => (i.getAttribute('alt') || '').length > 10), below: im.every(i => i.getBoundingClientRect().top >= hb - 1),
      other: [...document.querySelectorAll('#app img, .wrap img')].filter(i => !i.closest('.lshots') && /art\/landing\//.test(i.getAttribute('src') || '')).length }; });
  if (!shots.ages) throw new Error('the landing does not say the ages it is for');
  if (shots.n !== 3 || shots.src.join() !== 'art/landing/story.webp,art/landing/map.webp,art/landing/lesson.webp')
    throw new Error('the landing should show three photographs — a story, the map, a lesson: ' + shots.src.join(', '));
  if (!shots.lazy || !shots.alt || !shots.below || shots.other) throw new Error('the photographs must be lazy, described, and below the hero: ' + JSON.stringify(shots));
  for (const f of shots.src) if (!fs.existsSync(path.join(APP, f)) || fs.statSync(path.join(APP, f)).size > 40 * 1024)
    throw new Error(f + ' is missing or over 40 KB — run node tools/gen-landing-shots.js');
  const id = await p.evaluate(() => { const b = document.querySelector('.herocard [data-act="guest"]'); return b && b.getAttribute('data-id'); });
  if (!id) throw new Error('the landing\'s "Read it" does not open a story');
  await tap(p, '.herocard [data-act="guest"]');
  /* the stories load on demand (docs/27); on a busy machine that is more than 350ms */
  await p.waitForSelector('.reader', { timeout: 20000 }).catch(() => {});
  const g = await p.evaluate(() => ({ reader: !!document.querySelector('.reader'), started: (JSON.parse(localStorage.getItem('bi_v1') || '{}')).started || null,
    onboard: !!document.getElementById('nm') }));
  if (!g.reader || g.started || g.onboard) throw new Error('"Read it" did not play the story before setup: ' + JSON.stringify(g));
  /* THE LANDING WORKS AS A PAGE (owner, 3 Oct 2026; Bizzing Bee's hero lets a stranger spell a real
     word): the story plays INSIDE the landing's own card, beside Start free, on the same page —
     not on a screen of its own — and the landing is the thing itself: no mock-ups, no grid of
     feature claims (its three photographs are checked above) */
  const L = await p.evaluate(() => ({ inHero: !!document.querySelector('.herocard .reader'), start: !!document.querySelector('.hero [data-act="begin"]'),
    grid: document.querySelectorAll('.grid.g3 .card').length,
    shots: [...document.querySelectorAll('img')].map(i => i.getAttribute('src') || '').filter(s => /shot|screen|mock/i.test(s)) }));
  if (!L.inHero || !L.start) throw new Error('the story did not play inside the landing, beside Start free: ' + JSON.stringify(L));
  if (L.grid || L.shots.length) throw new Error('the landing is a brochure: ' + L.grid + ' feature cards, screenshots ' + L.shots.join(', '));
  /* the story's own end card, in the hero — not the landing's Start free beside it */
  for (let i = 0; i < 40; i++) {
    const end = await p.$('#herolive [data-act="begin"].lg');
    if (end) break;
    const ans = await p.$('[data-act="answer"]');
    if (ans && !(await p.$('[data-act="next"]'))) { await ans.click(); await p.waitForTimeout(200); continue; }
    await tap(p, '[data-act="next"]');
  }
  await tap(p, '#herolive [data-act="begin"].lg');
  if (!(await p.$('#nm'))) throw new Error('the story\'s end does not lead to setup');
  await skipOnboarding(p);
  const S = await profile(p);
  if (!S.started || !S.read[id]) throw new Error('the guest\'s story was not kept through setup');
  const sto = await p.evaluate(i => { const all = []; ['IND_STORIES','IND_STORIES_REGIONAL','IND_STORIES_MORE','IND_STORIES_SOUTH','IND_STORIES_NORTH','IND_STORIES_EAST','IND_STORIES_WEST','IND_STORIES_NE_A','IND_STORIES_NE_B','IND_STORIES_MODERN','IND_STORIES_VIGYAN','IND_STORIES_DASHAVATARA','IND_STORIES_DEVASURA'].forEach(k => (window[k] || []).forEach(s => all.push(s)));
    const s = all.filter(x => x.id === i)[0]; return s && (s.place || [])[0]; }, id);
  if (sto && !S.lit[sto.replace('IN-', '')]) throw new Error('the guest\'s story did not light its place');
  /* within three taps of finishing setup: one, Continue */
  await tap(p, '#main [data-act="cont"]');
  if (!(await p.$('.reader'))) throw new Error('Continue after setup did not open a story');
}, { fresh: true });

check('demo', '?demo is a labelled sample with progress, and the real household is untouched', async ({ p, base }) => {
  /* one settled real boot first: a boot may write its own baseline, and that is not the demo */
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  const before = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  if (!before.bi_v1) throw new Error('the harness has no real child to protect');
  await p.goto(base + '?demo', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  const d = await p.evaluate(() => ({ bar: (document.querySelector('.demobar') || {}).textContent || '',
    pill: /sample/.test((document.querySelector('[data-bz=greet] strong') || {}).textContent || ''), name: (document.querySelector('[data-bz=greet] strong') || {}).textContent || '',
    coins: window.BI ? window.BI.coins() : 0, rank: window.BI ? window.BI.level() : 0,
    heard: Object.keys((JSON.parse(localStorage.getItem('bi_v1')) || {}).read || {}).length,
    days: window.BI ? window.BI.goodDays() : 0 }));
  if (!/Sample/.test(d.bar) || !d.pill) throw new Error('the sample is not labelled "Sample"');
  if (d.heard < 10 || d.coins <= 0 || d.rank < 1 || d.days < 1)
    throw new Error('the sample has no believable progress: ' + JSON.stringify(d));
  /* use it: Continue, a right answer's worth of coins, the grown-ups' PIN */
  await tap(p, '#main [data-act="cont"]');
  await p.evaluate(() => window.BI && window.BI.earn('answer', 'demo'));
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  const after = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const changed = Object.keys(Object.assign({}, before, after)).filter(k => k !== 'bi_device' && before[k] !== after[k]);
  if (changed.length) throw new Error('the demo touched the real household: ' + changed.join(', '));
  const real = await p.evaluate(() => (document.querySelector('[data-bz=greet] strong') || {}).textContent || '');
  if (/Meera|· sample/.test(real)) throw new Error('the real app now shows the sample child');
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
    const ctx = await browser.newContext({ viewport: vp, serviceWorkers: 'block',
      isMobile: vp.width < 500, hasTouch: vp.width < 500 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      if (!c.fresh) await skipOnboarding(p);
      await p.waitForTimeout(300);
      await c.fn({ p, ctx, base });
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
