#!/usr/bin/env node
/* Bizzing India — Panchang, the festival-year wheel (games spec §4.4, §8 T12; docs/32).

     register   the IND_GAMES entry is docs/32's — and review: true (the year's windows and the
                Kyon? lines go to the named reviewer; tester mode until signed, spec §7)
     P2         every festival the game shows is a data-utsav.js entry, and the window it marks
                right is exactly that entry's months[] — nothing typed. REPORTS what is blocked:
                data-utsav carries no sources[] and no dated year
     P1         a random placer (seeded) scores under 15% at L1, and every L1 round's own odds
                (its windows over twelve) are under 15% — the round builder holds the line
     P3         the drift test (T12): app/data-festival-dates.js — each year's date from that year's
                DoPT O.M., every date sourced with a URL, its weekday and Saka date worked out again
                here — puts each moon holiday EARLIER every year than the year before (9–13 days, so
                a mis-copied date shows); the game's "about N days" is the data's own average, and
                re-dating the holidays in the page moves it (nothing typed). Lazy, in the games group
     L3         a whole Chaand round by mouse: four dates evenly spaced, the right one at any of the
                four places, no rule on screen before the answer, one report each (panchang.moon)
     L3miss     a wrong date holds: the listed date, "decided by the moon's sighting; the
                government list may move by a day", the drift, the O.M.; Enter is Aage; the 2018
                Bakrid change is told from its own record
     L3keys     a whole Chaand round with the number keys and Enter alone
     L3touch    a whole Chaand round by touch on a phone; question, dates and Aage above the tab bar
     P4         equal weight: every festival card the same size, colour and type; the first card
                changes from round to round; no "biggest" anywhere in the engine
     holds      a month outside the window holds: "Not quite.", the window shown, no new card
                for 3 s, a second tap is not a second answer, Enter is Aage; no right/wrong sound
                from the engine
     keyboard   a whole L1 round with the arrows and Enter alone; L4 with the number keys
     drag       a card dragged onto its month is placed there
     touch      on a touch phone a tap on a month places the card
     mera       L5 is never scored: picks, Done, no answer(), score 0, nothing written to storage
     phone      390 × 844: the wheel, the card and Aage above the tab bar; nothing sideways; ≥ 44 px
     night      the prompt and the miss card read at ≥ 4.5:1 in day and in night
     clock      a right answer's beat does not run while the tab is hidden
     copy       no streak copy, no "biggest"/"main festival" in the engine

   Run:  CHROME=/opt/pw-browsers/chromium NODE_PATH=…/node_modules node tools/check-panchang.js [--only P1] [--shots DIR]
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');

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

const PAGE_HELPERS = () => {
  window.__mount = function (o) {
    if (window.__td) { try { window.__td(); } catch (e) {} window.__td = null; }
    const old = document.querySelector('#gamehost');
    const h = document.createElement('div'); h.id = 'gamehost';
    if (old) old.replaceWith(h); else document.querySelector('#main').appendChild(h);
    const rec = window.__rec = { answers: [], done: null };
    const g = window.IND_GAMES.filter(x => x.id === 'panchang')[0];
    window.__td = g.engine(h, Object.assign({ level: 1, band: '8-10', scope: null, calm: false, reduced: false, skin: null, tester: true,
      answer: r => rec.answers.push(r) }, o || {}), r => { rec.done = r; });
  };
  const MONTHS = [];
  for (let i = 0; i < 12; i++) MONTHS.push(new Date(2001, i, 15).toLocaleString('en-GB', { month: 'long' }));
  window.__fest = function (id) { return window.IND_UTSAV.festivals.filter(f => f.id === id)[0]; };
  window.__win = function (f) { return (f.months || []).map(m => MONTHS.indexOf(m)).filter(i => i >= 0); };
  /* the card on the wheel, read the way a child reads it: by its name */
  window.__card = function () {
    const n = document.querySelector('.pc-card .pc-fname'); if (!n) return null;
    return window.IND_UTSAV.festivals.filter(f => f.name === n.textContent)[0] || null;
  };
  window.__sec = function (m) { return document.querySelector('.pc-m[data-m="' + m + '"]'); };
  window.__secPt = function (m) {
    const svg = document.querySelector('.pc-wheel'), r = svg.getBoundingClientRect(), s = r.width / 400;
    const a = (-90 + 30 * m) * Math.PI / 180, R = 158;
    return { x: r.left + (200 + R * Math.cos(a)) * s, y: r.top + (200 + R * Math.sin(a)) * s };
  };
};

async function boot(p, base) {
  await p.goto(base + '?tester=1', { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  await p.evaluate(() => window.IND_LOAD(['map', 'content', 'games']));
  await p.waitForFunction(() => (window.IND_GAMES || []).some(g => g.id === 'panchang') && window.IND_UTSAV && window.IND_FESTIVAL_DATES, null, { timeout: 30000 });
  await p.evaluate(() => window.BI.go('game', 'panchang')).catch(() => {});
  await p.waitForTimeout(500);
  await p.evaluate(PAGE_HELPERS);
}
const mount = (p, o) => p.evaluate(o => window.__mount(o), o || {});
const rec = p => p.evaluate(() => window.__rec);
const aage = p => p.evaluate(() => { const b = document.querySelector('#gamehost .gm-aage'); if (b) b.click(); });
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

check('register', 'the IND_GAMES entry is docs/32’s, review: true', async ({ p }) => {
  const g = await p.evaluate(() => { const g = window.IND_GAMES.filter(x => x.id === 'panchang')[0]; return g && Object.assign({}, g, { engine: typeof g.engine }); });
  if (!g) throw new Error('panchang is not registered');
  const bad = [];
  if (g.name !== 'Panchang') bad.push('name'); if (g.sub !== 'turn the festival year') bad.push('sub');
  if (g.teaches !== true) bad.push('teaches'); if (g.review !== true) bad.push('review (the spec sends it to the reviewer)');
  if (!Array.isArray(g.levels) || g.levels.length !== 5) bad.push('levels'); if (g.engine !== 'function') bad.push('engine');
  if (bad.length) throw new Error('wrong fields: ' + bad.join(', '));
});

check('P2', 'every festival shown is data-utsav’s, and the window marked right is its own months[]', async ({ p }) => {
  const seen = new Set();
  for (const level of [1, 2]) for (let round = 0; round < 4; round++) {
    await mount(p, { level });
    for (let i = 0; i < 12 && !(await rec(p)).done; i++) {
      const r = await p.evaluate(() => {
        const f = window.__card(); if (!f) return { none: document.querySelector('.pc-card .pc-fname') && document.querySelector('.pc-card .pc-fname').textContent };
        const w = window.__win(f);
        /* place it at its window's first month, then read which sectors the engine marked */
        window.__sec(w[0]).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
        const marked = [...document.querySelectorAll('.pc-m.pc-win')].map(e => +e.getAttribute('data-m')).sort((a, b) => a - b);
        return { id: f.id, w: w.slice().sort((a, b) => a - b), marked, months: f.months };
      });
      if (r.none) throw new Error('a card names a festival data-utsav.js does not hold: ' + r.none);
      if (!r.w.length) throw new Error(r.id + ' has no window in data-utsav.js');
      if (JSON.stringify(r.w) !== JSON.stringify(r.marked)) throw new Error(r.id + ': the wheel marked ' + r.marked + ' but its months[] are ' + r.months);
      seen.add(r.id);
      await aage(p);
    }
  }
  const last = await rec(p);
  if (last.answers.some(a => !a.right)) throw new Error('a placement inside its own window was marked wrong');
  const blocked = await p.evaluate(() => window.IND_UTSAV.festivals.filter(f => f.sources && f.sources.length).length);
  console.log(`         ${seen.size} festivals checked against months[]. BLOCKED ON DATA: ${blocked} of ${await p.evaluate(() => window.IND_UTSAV.festivals.length)} entries carry sources[]; no entry carries a dated year`);
});

check('P1', 'a random placer scores under 15% at L1, and every round’s own odds are under 15%', async ({ p }) => {
  /* The hard guarantee is each round's own odds (its windows over twelve), asserted below for
     every round. The played total is a second look, made reproducible: the bot AND the deck are
     seeded, so a pass here is the same pass every run rather than a lucky draw. */
  const R = rng(4242);
  await p.evaluate(() => { let s = 77; Math.random = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; });
  let asked = 0, right = 0, worst = 0;
  for (let round = 0; round < 40; round++) {
    await mount(p, { level: 1 });
    for (let i = 0; i < 12 && !(await rec(p)).done; i++) {
      const m = Math.floor(R() * 12);
      await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), m);
      await aage(p);
    }
    const r = await rec(p);
    if (!r.done) throw new Error('a round did not finish');
    asked += r.done.asked; right += r.done.firstTryRight;
    const odds = await p.evaluate(ids => ids.map(id => window.__win(window.__fest(id.split(':')[1])).length / 12), r.answers.map(a => a.id));
    const mean = odds.reduce((a, b) => a + b, 0) / odds.length;
    worst = Math.max(worst, mean);
    if (mean >= 0.15) throw new Error(`round ${round}: a random placer's odds are ${(mean * 100).toFixed(1)}%`);
  }
  const pct = right / asked;
  console.log(`         random placer: ${right}/${asked} = ${(pct * 100).toFixed(1)}%; the worst round's odds ${(worst * 100).toFixed(1)}%`);
  if (pct >= 0.15) throw new Error(`a random placer scored ${(pct * 100).toFixed(1)}%`);
});

/* ------------------------------------------------------------------ L3 Chaand: the moon's drift */

/* the Indian national (Saka) calendar's month starts, in Gregorian days — to work a listed Saka
   date out again from its Gregorian date. Chaitra 1 is 22 March, 21 March in a leap year. */
const SAKA = [['Magha', 0, 21], ['Phalguna', 1, 20], ['Chaitra', 2, null], ['Vaisakha', 3, 21], ['Jyaishtha', 4, 22], ['Ashadha', 5, 22],
  ['Sravana', 6, 23], ['Bhadra', 7, 23], ['Asvina', 8, 23], ['Kartika', 9, 23], ['Agrahayana', 10, 22], ['Pausha', 11, 22]];
function sakaOf(iso) {
  const [y, m, d] = iso.split('-').map(Number), leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0, t = Date.UTC(y, m - 1, d);
  let best = null;
  for (const [nm, mo, day] of SAKA) { const st = Date.UTC(y, mo, day == null ? (leap ? 21 : 22) : day); if (st <= t && (!best || st > best.st)) best = { nm, st }; }
  if (!best) best = { nm: 'Pausha', st: Date.UTC(y - 1, 11, 22) };
  return best.nm + ' ' + String((t - best.st) / 864e5 + 1).padStart(2, '0');
}
const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function loadDates() { const w = {}; new Function('window', fs.readFileSync(path.join(APP, 'data-festival-dates.js'), 'utf8'))(w); return w.IND_FESTIVAL_DATES; }
/* the drift, worked out here on its own from the data: days earlier, year on year, averaged */
function driftOf(FD) {
  const gaps = [];
  for (const h of FD.holidays.filter(h => h.calendar === 'hijri')) {
    const ds = h.dates.slice().sort((a, b) => a.year - b.year);
    for (let i = 1; i < ds.length; i++) if (ds[i].year === ds[i - 1].year + 1) {
      const a = new Date(ds[i - 1].date + 'T00:00:00Z'), b = new Date(ds[i].date + 'T00:00:00Z');
      gaps.push({ id: h.id, y: ds[i].year, by: Math.round((Date.UTC(b.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()) - b.getTime()) / 864e5) });
    }
  }
  return { gaps, days: Math.round(gaps.reduce((n, g) => n + g.by, 0) / gaps.length) };
}

check('P3', 'the drift test: dated years from the sourced lists, each year earlier than the last, the figure worked out from them', async ({ p }) => {
  const FD = loadDates(), bad = [];
  const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
  const games = (html.match(/<template id="lazy-games">[\s\S]*?<\/template>/) || [''])[0];
  if (!/src="data-festival-dates\.js/.test(games)) throw new Error('data-festival-dates.js is not in the lazy games group');
  if (/src="data-festival-dates\.js/.test(html.replace(/<template[\s\S]*?<\/template>/g, ''))) throw new Error('data-festival-dates.js is a shell script — it must load lazily');
  const good = x => x && /^https?:\/\/[^\s/]+\.[^\s/]+\//.test(x.url || '') && x.title && x.publisher && x.accessed;
  for (const y of Object.keys(FD.lists)) { const L = FD.lists[y]; if (!L.om || !L.issued || !(L.sources || []).some(good)) bad.push(y + ': the year’s O.M. has no number, date or source'); }
  if (!(FD.why && FD.why.text && FD.why.sources.some(good))) bad.push('the why line has no source');
  if (!(FD.moonRule && FD.moonRule.sources.some(good))) bad.push('the moon rule has no source');
  for (const h of FD.holidays) {
    if (!(h.sources || []).some(good)) bad.push(h.id + ': no source');
    for (const d of h.dates) {
      if (!(d.sources || []).some(good)) bad.push(h.id + ' ' + d.year + ': no source with a URL');
      if (!/^\d{4}-\d\d-\d\d$/.test(d.date) || +d.date.slice(0, 4) !== d.year) bad.push(h.id + ' ' + d.year + ': date ' + d.date);
      if (d.day && WEEK[new Date(d.date + 'T00:00:00Z').getUTCDay()] !== d.day) bad.push(h.id + ' ' + d.date + ' is not a ' + d.day);
      if (d.saka && sakaOf(d.date) !== d.saka) bad.push(h.id + ' ' + d.date + ' is ' + sakaOf(d.date) + ', not ' + d.saka + ' (Saka)');
      (d.moved || []).forEach(m => { if (!(m.sources || []).some(good)) bad.push(h.id + ' ' + d.year + ': a change of date with no source'); });
    }
  }
  const moon = FD.holidays.filter(h => h.calendar === 'hijri');
  if (moon.length < 2) bad.push('fewer than two moon-calendar holidays');
  const { gaps, days } = driftOf(FD);
  if (gaps.length < 10) bad.push('only ' + gaps.length + ' year-on-year pairs');
  /* P3: year + 1 is EARLIER than year, every time — by about the same, so a mis-copied date shows */
  gaps.forEach(g => { if (!(g.by >= 9 && g.by <= 13)) bad.push(g.id + ' ' + g.y + ': ' + (g.by > 0 ? g.by + ' days earlier' : -g.by + ' days LATER') + ' than the year before'); });
  if (bad.length) throw new Error(bad.slice(0, 4).join('; '));
  /* the engine says the same figure, and only because the data says it */
  await mount(p, { level: 3 });
  const shown = await p.evaluate(() => +document.querySelector('.pc').getAttribute('data-drift'));
  if (shown !== days) throw new Error('the game says ' + shown + ' days; the data gives ' + days);
  const eng = fs.readFileSync(path.join(APP, 'games-panchang.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const typed = eng.match(/\b(1[01]|ten|eleven)\b[^'\n]{0,12}days?/i);
  if (typed) throw new Error('a drift typed into the engine: "' + typed[0] + '"');
  await p.evaluate(() => {
    /* the same holidays, re-dated 20 days apart: the game must follow the data, not a typed figure */
    window.IND_FESTIVAL_DATES = JSON.parse(JSON.stringify(window.IND_FESTIVAL_DATES));
    window.IND_FESTIVAL_DATES.holidays.forEach(h => { if (h.calendar === 'hijri') h.dates.forEach((d, i) => {
      const t = new Date(Date.UTC(d.year, 10, 30) - 20 * i * 864e5);
      d.date = d.year + '-' + String(t.getUTCMonth() + 1).padStart(2, '0') + '-' + String(t.getUTCDate()).padStart(2, '0');
    }); });
  });
  await mount(p, { level: 3 });
  const moved = await p.evaluate(() => +document.querySelector('.pc').getAttribute('data-drift'));
  if (moved !== 20) throw new Error('re-dated 20 days apart, the game still says ' + moved + ' — the figure is not worked out from the data');
  console.log(`         ${gaps.length} year-on-year pairs from ${Object.keys(FD.lists).length} O.M.s; every one earlier, ${Math.min(...gaps.map(g => g.by))}–${Math.max(...gaps.map(g => g.by))} days; the game says "about ${days} days"`);
});

/* in the page: the moon item on screen, read the way a child reads it — the holiday, the year asked */
const MOON_HELPERS = () => {
  const MONTHS = [];
  for (let i = 0; i < 12; i++) MONTHS.push(new Date(2001, i, 15).toLocaleString('en-GB', { month: 'long' }));
  window.__moon = function () {
    const q = document.querySelector('.pc-q').textContent, y = +((/in (\d{4})\?/.exec(q) || [])[1]);
    const b = document.querySelector('.pc-quote b'); if (!b) return null;
    const h = window.IND_FESTIVAL_DATES.holidays.filter(h => h.name === b.textContent)[0];
    const d = h && h.dates.filter(d => d.year === y)[0]; if (!d) return null;
    const t = new Date(d.date + 'T00:00:00Z'), txt = t.getUTCDate() + ' ' + MONTHS[t.getUTCMonth()];
    const opts = [...document.querySelectorAll('.pc-opt')].map(o => o.textContent.replace(/^[1-4]/, ''));
    const ts = opts.map(o => Date.parse(o + ' ' + y + ' 00:00:00 UTC'));
    return { right: opts.indexOf(txt), opts, txt, year: y, id: h.id, gaps: ts.slice(1).map((v, i) => Math.round((v - ts[i]) / 864e5)) };
  };
};

check('L3', 'a whole Chaand round by mouse: four dates evenly spaced, the right one anywhere, one report each', async ({ p }) => {
  await p.evaluate(MOON_HELPERS);
  const at = new Set();
  let total = 0;
  for (let round = 0; round < 2; round++) {
    await mount(p, { level: 3 });
    const n = await p.evaluate(() => document.querySelectorAll('.pc-pip').length);
    if (n < 6) throw new Error('an L3 round of ' + n);
    for (let i = 0; i < 10 && !(await rec(p)).done; i++) {
      const m = await p.evaluate(() => window.__moon());
      if (!m || m.right < 0) throw new Error('the right date is not among the options: ' + JSON.stringify(m));
      if (new Set(m.gaps).size !== 1) throw new Error('the four dates are not evenly spaced (one would stand out): ' + m.opts.join(', '));
      const pre = await p.evaluate(() => document.querySelector('#gamehost').innerText);
      if (/about \d+ days|days earlier/i.test(pre)) throw new Error('the rule is on screen before the answer');
      at.add(m.right);
      await p.evaluate(i => document.querySelectorAll('.pc-opt')[i].click(), m.right);
      const yes = await p.evaluate(() => { const y = document.querySelector('#gamehost .pc-yes'); return y ? y.innerText : ''; });
      if (!/Yes/.test(yes) || !/moon’s sighting; the government list may move by a day/.test(yes) || !/DoPT O\.M\./.test(yes)) throw new Error('a right date shows no full card: ' + yes);
      await aage(p);
    }
    const r = await rec(p);
    if (!r.done || r.done.asked !== n || r.done.firstTryRight !== n) throw new Error('L3 round: ' + JSON.stringify(r.done));
    if (r.answers.some(a => a.skill !== 'panchang.moon' || !a.right || !/^moon:/.test(a.id))) throw new Error('reports: ' + JSON.stringify(r.answers.slice(0, 2)));
    if (new Set(r.answers.map(a => a.id)).size !== n) throw new Error('an item asked twice in one round');
    total += n;
  }
  if (at.size < 3) throw new Error('over ' + total + ' items the right date sat only at ' + [...at].map(x => x + 1).join(', '));
});

check('L3miss', 'a wrong date holds: the listed date, the moon line, the O.M.; no new item until Aage', async ({ p }) => {
  await p.evaluate(MOON_HELPERS);
  await p.evaluate(() => { window.IND_SFX && (window.IND_SFX.played.length = 0); });
  await mount(p, { level: 3 });
  const m = await p.evaluate(() => window.__moon());
  const wrong = (m.right + 1) % 4;
  const q0 = await p.evaluate(() => document.querySelector('.pc-q').textContent + document.querySelector('.pc-quote').textContent);
  await p.evaluate(i => document.querySelectorAll('.pc-opt')[i].click(), wrong);
  const c = await p.evaluate(() => {
    const miss = document.querySelector('#gamehost .gm-miss');
    return { text: miss ? miss.innerText : '', ans: miss && miss.querySelector('.gm-ans') ? miss.querySelector('.gm-ans').innerText : '',
      aage: !!(miss && miss.querySelector('.gm-aage[data-gm="aage"]')), win: document.querySelectorAll('.pc-opt.pc-win').length, no: document.querySelectorAll('.pc-opt.pc-no').length,
      dots: document.querySelectorAll('.pc-mdot').length };
  });
  if (!/Not quite\./.test(c.text) || !c.aage) throw new Error('no full miss card: ' + c.text);
  if (!c.ans.includes(m.txt) || !c.ans.includes(String(m.year))) throw new Error('the miss card does not give the listed date: ' + c.ans);
  if (!/Decided by the moon’s sighting; the government list may move by a day\./.test(c.text)) throw new Error('the miss card does not say the moon decides');
  if (!/Source: Government of India holiday list for \d{4} — DoPT O\.M\. F\.No\./.test(c.text)) throw new Error('the miss card names no O.M.');
  const days = driftOf(loadDates()).days;
  if (!new RegExp('about ' + days + ' days earlier').test(c.text)) throw new Error('the miss card does not give the worked-out drift (' + days + ')');
  if (c.win !== 1 || c.no !== 1 || c.dots !== 2) throw new Error('the right date, the pick and both years are not marked: ' + JSON.stringify(c));
  if (shotDir) { await p.waitForTimeout(300); await p.screenshot({ path: path.join(shotDir, 'panchang-desk-L3-miss.png') }); }
  await p.waitForTimeout(3000);
  await p.evaluate(i => document.querySelectorAll('.pc-opt')[i].click(), m.right);
  const r = await rec(p);
  const q1 = await p.evaluate(() => document.querySelector('.pc-q').textContent + document.querySelector('.pc-quote').textContent);
  if (q1 !== q0 || !(await p.$('#gamehost .gm-miss'))) throw new Error('the miss did not hold');
  if (r.answers.length !== 1 || r.answers[0].right || r.answers[0].skill !== 'panchang.moon') throw new Error('answers: ' + JSON.stringify(r.answers));
  await p.keyboard.press('Enter');
  if ((await p.evaluate(() => document.querySelector('.pc-q').textContent + document.querySelector('.pc-quote').textContent)) === q0) throw new Error('Enter did not press Aage');
  const played = await p.evaluate(() => (window.IND_SFX ? window.IND_SFX.played : []).filter(k => k === 'right' || k === 'wrong'));
  if (played.length) throw new Error('the engine played ' + played.join(', '));
  /* a holiday the list moved after the moon was sighted says so, from its own record (Bakrid, 2018) */
  let told = false;
  for (let k = 0; k < 12 && !told; k++) {
    await mount(p, { level: 3, scope: { mode: 'chaand', set: ['id-ul-zuha'] } });
    for (let i = 0; i < 4 && !(await rec(p)).done && !told; i++) {
      const mm = await p.evaluate(() => window.__moon());
      await p.evaluate(i => document.querySelectorAll('.pc-opt')[i].click(), mm.right);
      if (mm.year === 2019) {
        const t = await p.evaluate(() => document.querySelector('#gamehost .pc-fb').innerText);
        if (!/In 2018 the list was changed after it came out: to 23 August, then to 22 August\./.test(t)) throw new Error('the 2018 Bakrid change is not told: ' + t);
        told = true;
      }
      await aage(p);
    }
  }
  if (!told) throw new Error('the 2018 → 2019 Bakrid pair never came up in twelve rounds');
});

check('L3keys', 'a whole Chaand round with the number keys and Enter alone', async ({ p }) => {
  await p.evaluate(MOON_HELPERS);
  await mount(p, { level: 3 });
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  for (let i = 0; i < 10 && !(await rec(p)).done; i++) {
    const m = await p.evaluate(() => window.__moon());
    await p.keyboard.press(String(m.right + 1)); await p.waitForTimeout(20);
    await p.keyboard.press('Enter'); await p.waitForTimeout(20);
  }
  const r = await rec(p);
  if (!r.done || r.done.asked < 6 || r.done.firstTryRight !== r.done.asked) throw new Error('L3 by keys: ' + JSON.stringify(r.done));
});

check('L3touch', 'a whole Chaand round on a touch phone; the question, the dates and Aage above the tab bar', async ({ browser, base }) => {
  const ctx = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  try {
    await boot(p, base); await p.evaluate(MOON_HELPERS); await mount(p, { level: 3 });
    await p.waitForTimeout(250);
    const tapEl = async (sel, i) => { const el = (await p.$$(sel))[i || 0]; await el.scrollIntoViewIfNeeded(); const bb = await el.boundingBox(); await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(60); };
    const lay = () => p.evaluate(() => {
      const bar = document.querySelector('[data-bz=tabbar]'), barTop = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
      const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: b.top, b: b.bottom }; };
      const small = [...document.querySelectorAll('#gamehost button')].filter(b => { const x = b.getBoundingClientRect(); return x.width && (x.width < 44 || x.height < 44); }).map(b => b.className);
      return { barTop, q: r('.pc-q'), opts: r('.pc-opts'), wheel: r('.pc-wheel'), aage: r('#gamehost .gm-aage'), small, over: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth };
    });
    const before = await lay();
    for (const k of ['q', 'opts', 'wheel']) { const b = before[k]; if (!b || b.t < 0 || b.b > before.barTop + 0.5) throw new Error(`before an answer, ${k} is off-screen or under the tab bar (${b && Math.round(b.t)}–${b && Math.round(b.b)}, bar ${Math.round(before.barTop)})`); }
    let first = true;
    for (let i = 0; i < 10 && !(await rec(p)).done; i++) {
      const m = await p.evaluate(() => window.__moon());
      await tapEl('.pc-opt', first ? (m.right + 2) % 4 : m.right);
      if (first) {
        const after = await lay();
        if (after.over > 0) throw new Error('the page is ' + after.over + 'px wider than the phone');
        if (!after.aage || after.aage.t < 0 || after.aage.b > after.barTop + 0.5) throw new Error('Aage is off-screen or under the tab bar after a miss');
        if (after.small.length) throw new Error('targets under 44 px: ' + after.small.join(', '));
        if (shotDir) await p.screenshot({ path: path.join(shotDir, 'panchang-phone-L3-miss.png') });
        first = false;
      }
      if (await p.$('#gamehost .gm-aage')) await tapEl('#gamehost .gm-aage');
    }
    const r = await rec(p);
    if (!r.done || r.done.asked < 6 || r.done.firstTryRight !== r.done.asked - 1) throw new Error('touch L3 round: ' + JSON.stringify(r.done));
  } finally { await ctx.close(); }
});

check('P4', 'every festival card the same size, colour and type; no default first; no "biggest"', async ({ p }) => {
  const firsts = { kyon: new Set(), mera: new Set(), kab: new Set() };
  for (let i = 0; i < 6; i++) {
    for (const [level, sel, key] of [[4, '.pc-opt', 'kyon'], [5, '.pc-chip', 'mera']]) {
      await mount(p, { level });
      const r = await p.evaluate(sel => {
        const els = [...document.querySelectorAll(sel)];
        const sig = els.map(e => { const c = getComputedStyle(e), b = e.getBoundingClientRect();
          return [Math.round(b.width), Math.round(b.height), c.backgroundColor, c.color, c.fontSize, c.fontWeight, c.fontFamily, c.borderColor, c.opacity].join('|'); });
        return { n: els.length, kinds: [...new Set(sig)], first: els[0] && els[0].textContent };
      }, sel);
      if (r.n < 4) throw new Error(key + ': only ' + r.n + ' cards');
      if (r.kinds.length !== 1) throw new Error(key + ': the cards differ: ' + r.kinds.slice(0, 2).join('  vs  '));
      firsts[key].add(r.first);
    }
    await mount(p, { level: 1 });
    firsts.kab.add(await p.evaluate(() => document.querySelector('.pc-card .pc-fname').textContent));
  }
  for (const k of Object.keys(firsts)) if (firsts[k].size < 2) throw new Error(k + ': the same festival comes first every time: ' + [...firsts[k]]);
  const s = fs.readFileSync(path.join(APP, 'games-panchang.js'), 'utf8').replace(/^\s*\/\*[\s\S]*?\*\//m, '');
  const m = s.replace(/never "the biggest festival"/gi, '').match(/biggest|main festival|most important|greatest festival/i);
  if (m) throw new Error('ranking copy in the engine: ' + m[0]);
});

check('holds', 'a month outside the window holds with the miss card until Aage; no right/wrong from the engine', async ({ p }) => {
  await p.evaluate(() => { window.IND_SFX && (window.IND_SFX.played.length = 0); });
  await mount(p, { level: 1 });
  const f = await p.evaluate(() => { const f = window.__card(); return { id: f.id, w: window.__win(f) }; });
  const wrong = [...Array(12).keys()].find(m => !f.w.includes(m));
  await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), wrong);
  const m = await p.evaluate(w => {
    const miss = document.querySelector('#gamehost .gm-miss');
    return { text: miss ? miss.textContent : '', ans: !!document.querySelector('.gm-miss .gm-ans'), teach: !!document.querySelector('.gm-miss .gm-teach'),
      aage: !!document.querySelector('.gm-miss .gm-aage[data-gm="aage"]'), grey: window.__sec(w).classList.contains('pc-no'),
      win: [...document.querySelectorAll('.pc-m.pc-win')].length };
  }, wrong);
  if (!/Not quite\./.test(m.text) || !m.ans || !m.teach || !m.aage) throw new Error('no full miss card: ' + JSON.stringify(m));
  if (!m.grey || m.win !== f.w.length) throw new Error('the miss does not show the pick grey and the window warm');
  await p.waitForTimeout(3000);
  await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), f.w[0]);
  const still = await p.evaluate(() => window.__card().id);
  const r = await rec(p);
  if (still !== f.id || !(await p.$('#gamehost .gm-miss'))) throw new Error('the miss did not hold');
  if (r.answers.length !== 1 || r.answers[0].right || r.answers[0].skill !== 'panchang.when') throw new Error('answers: ' + JSON.stringify(r.answers));
  await p.keyboard.press('Enter');
  if ((await p.evaluate(() => window.__rec.answers.length)) !== 1 || (await p.$('#gamehost .gm-miss'))) throw new Error('Enter did not press Aage');
  const played = await p.evaluate(() => (window.IND_SFX ? window.IND_SFX.played : []).filter(k => k === 'right' || k === 'wrong'));
  if (played.length) throw new Error('the engine played ' + played.join(', '));
});

check('keyboard', 'a whole L1 round with the arrows and Enter alone; L4 with the number keys', async ({ p }) => {
  await mount(p, { level: 1 });
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  for (let i = 0; i < 12 && !(await rec(p)).done; i++) {
    const w = await p.evaluate(() => window.__win(window.__card()));
    for (let s = 0; s < 13; s++) {
      const f = await p.evaluate(() => { const e = document.querySelector('.pc-m.pc-focus'); return e ? +e.getAttribute('data-m') : -1; });
      if (w.includes(f)) break;
      await p.keyboard.press('ArrowRight');
    }
    await p.keyboard.press('Enter'); await p.waitForTimeout(20);
    await p.keyboard.press('Enter'); await p.waitForTimeout(20);
  }
  const r = await rec(p);
  if (!r.done || r.done.firstTryRight !== r.done.asked || r.done.asked < 8) throw new Error('keyboard round: ' + JSON.stringify(r.done));
  await mount(p, { level: 4 });
  for (let i = 0; i < 12 && !(await rec(p)).done; i++) {
    const k = await p.evaluate(() => {
      const q = document.querySelector('.pc-quote').textContent;
      const f = window.IND_UTSAV.festivals.filter(f => f.kid && f.kid.indexOf(q) === 0)[0];
      const o = [...document.querySelectorAll('.pc-opt')].map(b => b.getAttribute('data-id'));
      return o.indexOf(f.id) + 1;
    });
    await p.keyboard.press(String(k)); await p.waitForTimeout(20);
    await p.keyboard.press('Enter'); await p.waitForTimeout(20);
  }
  const r4 = await rec(p);
  if (!r4.done || r4.done.firstTryRight !== r4.done.asked || r4.answers.some(a => a.skill !== 'panchang.why')) throw new Error('L4 by number keys: ' + JSON.stringify(r4.done));
});

check('drag', 'a card dragged onto its month is placed there', async ({ p }) => {
  await mount(p, { level: 1 });
  const w = await p.evaluate(() => window.__win(window.__card()));
  const c = await (await p.$('.pc-card')).boundingBox();
  const to = await p.evaluate(m => window.__secPt(m), w[0]);
  await p.mouse.move(c.x + c.width / 2, c.y + c.height / 2); await p.mouse.down();
  await p.mouse.move(c.x + c.width / 2 + 20, c.y + c.height / 2 + 5, { steps: 3 });
  await p.mouse.move(to.x, to.y, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(60);
  const r = await rec(p);
  if (r.answers.length !== 1 || !r.answers[0].right) throw new Error('the drag did not place the card in its month: ' + JSON.stringify(r.answers));
  if (await p.$('.pc-ghost')) throw new Error('the drag ghost was left behind');
});

check('touch', 'on a touch phone a tap on a month places the card', async ({ browser, base }) => {
  const ctx = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  try {
    await boot(p, base); await mount(p, { level: 1 });
    const w = await p.evaluate(() => window.__win(window.__card()));
    const pt = await p.evaluate(m => window.__secPt(m), w[0]);
    await p.touchscreen.tap(pt.x, pt.y); await p.waitForTimeout(60);
    const r = await rec(p);
    if (r.answers.length !== 1 || !r.answers[0].right) throw new Error('a touch on the month did not place it: ' + JSON.stringify(r.answers));
  } finally { await ctx.close(); }
});

check('mera', 'L5 is never scored, pays nothing and stores nothing', async ({ p }) => {
  const k0 = await p.evaluate(() => Object.keys(localStorage).sort().join(','));
  await mount(p, { level: 5 });
  await p.evaluate(() => [...document.querySelectorAll('.pc-chip')].slice(0, 4).forEach(b => b.click()));
  const t = await p.evaluate(() => ({ pressed: document.querySelectorAll('.pc-chip[aria-pressed="true"]').length, ask: /ask your family/i.test(document.querySelector('#gamehost').innerText),
    lit: document.querySelectorAll('.pc-m.pc-win').length }));
  if (t.pressed !== 4 || !t.ask || !t.lit) throw new Error('Mera saal did not take the picks or say "ask your family": ' + JSON.stringify(t));
  await p.evaluate(() => document.querySelector('.pc-done').click());
  const r = await rec(p);
  if (r.answers.length) throw new Error('Mera saal reported answers');
  if (!r.done || r.done.score !== 0 || r.done.asked !== 0) throw new Error('Mera saal finished as ' + JSON.stringify(r.done));
  const k1 = await p.evaluate(() => Object.keys(localStorage).sort().join(','));
  const v = await p.evaluate(() => Object.keys(localStorage).filter(k => /panchang|mera/i.test(k) || /lohri|diwali|pongal|eid-ul|christmas/i.test(localStorage.getItem(k) || '')));
  if (v.length) throw new Error('a family’s festivals were written to storage: ' + v.join(','));
  if (k0 !== k1 && /panchang/i.test(k1)) throw new Error('new storage keys: ' + k1);
});

check('phone', '390 × 844: the wheel, the card and Aage above the tab bar; nothing sideways; ≥ 44 px', async ({ browser, base }) => {
  const ctx = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  try {
    await boot(p, base);
    for (const level of [1, 4, 5]) {
      await mount(p, { level }); await p.waitForTimeout(200);
      if (level === 1) {
        const w = await p.evaluate(() => window.__win(window.__card()));
        const wrong = [...Array(12).keys()].find(m => !w.includes(m));
        await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), wrong);
      }
      if (level === 4) await p.evaluate(() => document.querySelector('.pc-opt').click());
      const m = await p.evaluate(level => {
        const bar = document.querySelector('[data-bz=tabbar]'), barTop = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
        const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: b.top, b: b.bottom }; };
        const small = [...document.querySelectorAll('#gamehost button')].filter(b => { const x = b.getBoundingClientRect(); return x.width && (x.width < 44 || x.height < 44); }).map(b => b.className);
        const need = level === 1 ? ['.pc-wheel', '.pc-card', '#gamehost .gm-aage', '.pc-q'] : level === 4 ? ['.pc-quote', '.pc-opts', '#gamehost .gm-aage'] : ['.pc-q', '.pc-chips', '.pc-done'];
        return { barTop, need: need.map(s => [s, r(s)]), small, over: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth };
      }, level);
      if (m.over > 0) throw new Error(`L${level}: the page is ${m.over}px wider than the phone`);
      for (const [s, b] of m.need) {
        if (!b) throw new Error(`L${level}: no ${s}`);
        if (b.t < 0 || b.b > m.barTop + 0.5) throw new Error(`L${level}: ${s} is off-screen or under the tab bar (${Math.round(b.t)}–${Math.round(b.b)}, bar ${Math.round(m.barTop)})`);
      }
      if (m.small.length) throw new Error(`L${level}: targets under 44 px: ` + m.small.join(', '));
      if (shotDir) await p.screenshot({ path: path.join(shotDir, `panchang-phone-L${level}.png`) });
    }
  } finally { await ctx.close(); }
});

function lum(c) {
  const m = String(c).match(/[\d.]+/g).map(Number);
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
}
check('night', 'the prompt, the card and the miss card read at ≥ 4.5:1, day and night', async ({ p }) => {
  for (const night of [false, true]) {
    await p.evaluate(n => { if (n) document.documentElement.setAttribute('data-mode', 'night'); else document.documentElement.removeAttribute('data-mode'); }, night);
    await mount(p, { level: 1 });
    const w = await p.evaluate(() => window.__win(window.__card()));
    await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), [...Array(12).keys()].find(m => !w.includes(m)));
    await p.waitForTimeout(250);
    const cs = await p.evaluate(() => {
      const g = (s, prop) => { const e = document.querySelector(s); return e ? getComputedStyle(e)[prop] : null; };
      return [[g('.pc-q', 'color'), g('.pc-ask', 'backgroundColor')], [g('.pc-fname', 'color'), g('.pc-card', 'backgroundColor')],
        [g('.pc-fb .gm-ans', 'color'), g('.pc-fb .gm-miss', 'backgroundColor')], [g('.pc-ml', 'fill'), g('.pc-m', 'fill')]];
    });
    for (const [fg, bg] of cs) {
      if (!fg || !bg) throw new Error('missing element for contrast');
      const a = lum(fg), b = lum(bg), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      if (ratio < 4.5) throw new Error(`${night ? 'night' : 'day'}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
    }
    if (shotDir) await p.screenshot({ path: path.join(shotDir, `panchang-desk-${night ? 'night' : 'day'}.png`) });
  }
  for (const level of [4, 5]) {
    await mount(p, { level }); await p.waitForTimeout(200);
    if (shotDir) await p.screenshot({ path: path.join(shotDir, `panchang-desk-L${level}.png`) });
  }
  await p.evaluate(() => document.documentElement.removeAttribute('data-mode'));
});

check('clock', 'a right answer’s beat does not run while the tab is hidden', async ({ p }) => {
  await mount(p, { level: 1 });
  const w = await p.evaluate(() => window.__win(window.__card()));
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  const c0 = await p.evaluate(() => window.__card().id);
  await p.evaluate(m => window.__sec(m).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), w[0]);
  await p.waitForTimeout(3200);
  const c1 = await p.evaluate(() => window.__card().id);
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
  if (c1 !== c0) throw new Error('the game moved on while the tab was hidden');
  await p.waitForTimeout(2800);
  if ((await p.evaluate(() => window.__card().id)) === c0 && !(await rec(p)).done) throw new Error('the game did not move on once the tab came back');
});

check('copy', 'no streak copy in the engine', async () => {
  const s = fs.readFileSync(path.join(APP, 'games-panchang.js'), 'utf8');
  const m = s.match(/in a row|streak|×\s*\d|\d\s*×|multiplier/i);
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

/* PROVED BY BREAKING (each watched to fail, then restored):
     P1        a round of two-month windows only, no one-month cards — "a random placer's odds are 16.7%"
     holds     the miss card moving on by itself like a right answer — "the miss did not hold"
     P3        2026's Id-ul-Fitr mis-copied as 1 April — "not a Saturday… Chaitra 11, not Phalguna
               30… 1 days LATER than the year before"; the drift typed as 11 in the engine — "re-dated
               20 days apart, the game still says 11"
     L3        the right date always first — "sat only at 1"; the distractors spaced off last year's
               date — "the four dates are not evenly spaced"
     L3miss    the moon line dropped — "the miss card does not say the moon decides"
     L3keys    the number keys left to Kyon? only — "L3 by keys: null"
     L3touch   the dates padded down the phone — "wheel is off-screen or under the tab bar"
     facts     (tools/check-facts.js) the Beas's URLs stripped — "river "beas" has no source with a URL"
   Caught real faults while the game was built: phone (Aage under the tab bar), P4 (Mera saal's
   chips one height for one-line names and another for two). */
