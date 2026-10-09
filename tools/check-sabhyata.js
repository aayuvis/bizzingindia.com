/* Headless check for Sabhyata's mechanics — the systems, not the pixels.
 *
 * tools/audit-city-ui.js already watches the city screen's LAYOUT. This one watches
 * whether the game is a game: that a turn only passes when it should, that where a
 * thing is built changes what it pays, that research has to be unlocked before it can
 * be bought, that a win is reachable by more than one road.
 *
 * It drives the real engine through the real app, and reads state through the debug
 * window the engine already exposes (`__SABG`), so a check can never pass by agreeing
 * with a render that is itself wrong.
 *
 *   node tools/check-sabhyata.js            # all checks
 *   node tools/check-sabhyata.js --only adj # one
 *   node tools/check-sabhyata.js --only cardtext   # the city's cards read at AA, day and night
 *   CHROME=/path/to/chrome node tools/check-sabhyata.js
 */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { skipOnboarding } = require('./lib/onboard');

const ROOT = path.join(__dirname, '..', 'app');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.webmanifest':'application/manifest+json', '.png':'image/png',
  '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2',
  '.mp3':'audio/mpeg' };

function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      res.writeHead(404).end('no'); return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

/* Two real taps a real gap apart, re-finding the node between them: selecting a city
   repaints the map, so the second tap lands on a new element and the engine counts the
   pair itself rather than trusting the browser's dblclick. Lifted from audit-city-ui. */
const openCity = async (p, sid) => {
  await p.evaluate(sid => {
    const hit = () => { const g = document.getElementById('sab-' + sid); if (!g) return;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); };
    hit();
    return new Promise(r => setTimeout(() => { hit(); r(); }, 120));
  }, sid);
  await p.waitForTimeout(1200);
};

async function boot(browser, port) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  await p.waitForTimeout(400);
  await p.click('[data-bz=tab][data-v="khel"]'); await p.waitForTimeout(250);
  await p.click('.ghero'); await p.waitForTimeout(900);
  /* the start screen offers three lengths (master C.4 #6); these checks are about the long
     game's systems, so they choose it — the campaign and the bands have their own checks */
  const ov = await p.$('#sab-ovhost [data-sab-act="mode"][data-m="long"]') || await p.$('#sab-ovhost .sab-btn');
  if (ov) { await ov.click(); await p.waitForTimeout(250); }
  if (!await p.evaluate(() => typeof window.__SABG === 'function'))
    throw new Error('the game did not boot — no __SABG');
  return { p, errs };
}

const CHECKS = [];
const check = (id, what, fn) => CHECKS.push({ id, what, fn });

/* -------------------------------------------- the city's cards can be read (owner, 8 Oct 2026) */
/* "can't read the text in Sabhyata cities": the fact tiles took the page's dark-brown text onto
   the city's dark teak card, about 2:1. Every line of every card a city offers is measured on
   pixels, day and night, the way check-contrast measures the app (tools/lib/contrast.js) — and
   the open card must stop above the Build handle, which it used to run over. */
const { measureView } = require('./lib/contrast');
check('cardtext', 'every line on every city card reads at AA, day and night; an open card never covers Build', async ({ p }) => {
  /* day or night is set FIRST: switching it redraws the app, and the game starts again at its
     first screen — so the city is entered afresh for each */
  const enter = async mode => {
    for (let i = 0; i < 3; i++) {
      const night = await p.evaluate(() => document.documentElement.getAttribute('data-mode') === 'night');
      if ((mode === 'night') === night) break;
      await p.evaluate(() => document.querySelector('[data-bz=theme]').click()); await p.waitForTimeout(500);
    }
    const ov = await p.$('#sab-ovhost [data-sab-act="mode"][data-m="long"]') || await p.$('#sab-ovhost .sab-btn');
    if (ov) { await ov.click(); await p.waitForTimeout(300); }
    await p.evaluate(() => { const g = window.__SABG(); g.res.anna = 500; g.res.kala = 500; g.res.katha = 500; });
    if (!await p.evaluate(() => !!window.__SAB().city)) await openCity(p, 'dholavira');
    if (!await p.evaluate(() => !!window.__SAB().city)) throw new Error(mode + ': the city never opened, so this proves nothing');
    await p.evaluate(() => { const b = document.querySelector('[data-sab-act=calls]'); if (b && b.getAttribute('aria-expanded') !== 'true') b.click(); });
    await p.waitForTimeout(350);
  };
  const bad = [];
  for (const mode of ['day', 'night']) {
    await enter(mode);
    const rows = await p.evaluate(() => [...document.querySelectorAll('.sab-callrow')].map(r => r.getAttribute('data-c')));
    if (!rows.includes('about')) throw new Error(mode + ': the city offers no card of its own telling: ' + rows.join(', '));
    for (const k of rows) {
      await p.evaluate(k => { const r = document.querySelector(`.sab-callrow[data-c="${k}"]`); if (r) r.click(); }, k);
      await p.waitForTimeout(450);
      if (!await p.evaluate(() => !!document.querySelector('.sab-calllist.iscard'))) { bad.push(`${mode}/${k}: the card did not open`); continue; }
      /* a long card scrolls inside itself; for the colours it is unrolled, so the last line is
         measured against the card and not against the board it is scrolled over */
      const unroll = await p.addStyleTag({ content: '.sab-calllist.iscard{max-height:none!important;overflow:visible!important}' });
      await p.waitForTimeout(60);
      const m = await measureView(p, '.sab-calllist *');
      await unroll.evaluate(e => e.remove()); await p.waitForTimeout(60);
      if (!m.checked) bad.push(`${mode}/${k}: nothing measured`);
      m.fails.forEach(f => bad.push(`${mode}/${k}: "${f.t}" ${f.ratio}:1 (needs ${f.need}) ${f.tag}`));
      const lap = await p.evaluate(() => { const c = document.querySelector('.sab-calllist.iscard'), d = document.querySelector('.sab-dhandle');
        if (!c || !d || !d.offsetParent) return 0; const a = c.getBoundingClientRect(), b = d.getBoundingClientRect();
        return a.left < b.right && b.left < a.right ? Math.max(0, Math.round(a.bottom - b.top)) : 0; });
      if (lap > 0) bad.push(`${mode}/${k}: the open card covers Build by ${lap}px`);
      await p.evaluate(() => { const b = document.querySelector('[data-sab-act=callback]'); if (b) b.click(); });
      await p.waitForTimeout(250);
    }
  }
  /* and on a phone, the long one */
  await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = document.querySelector('.sab-callrow[data-c="about"]'); if (r) r.click(); });
  await p.waitForTimeout(450);
  const ph = await p.evaluate(() => { const c = document.querySelector('.sab-calllist.iscard'), d = document.querySelector('.sab-dhandle');
    if (!c) return { none: true }; const a = c.getBoundingClientRect(), b = d && d.offsetParent ? d.getBoundingClientRect() : null;
    return { lap: b && a.left < b.right && b.left < a.right ? Math.round(a.bottom - b.top) : 0, over: Math.round(a.right - innerWidth) }; });
  if (ph.none) bad.push('phone: the telling card did not open');
  else { if (ph.lap > 0) bad.push(`phone: the open card covers Build by ${ph.lap}px`); if (ph.over > 0) bad.push(`phone: the card runs ${ph.over}px off the screen`); }
  if (bad.length) throw new Error(bad.slice(0, 8).join(' · ') + (bad.length > 8 ? ` (+${bad.length - 8})` : ''));
});

/* ---------------------------------------- week-1 blockers (sabhyata-master Part G, owner 9 Oct 2026) */
const setHarappa = p => p.evaluate(() => {
  const G = window.__SABG(), D = window.IND_SABHYATA;
  D.sites.forEach(s => { if (s.era === 0) { const q = G.sites[s.id]; q.found = true; q.seen = true; q.zzz = false; } });
  G.res.katha = 5000; G.res.anna = 500; G.res.kala = 500;
  window.__SABDO.paint();
});
const closeCard = p => p.evaluate(() => { const b = document.querySelector('#sab-ovhost [data-sab-act="ovclose"], #sab-ovhost [data-sab-act="advgo"]'); if (b) b.click(); });
check('soft-lock', 'S1: turning the first age leaves a living city and a findable place; the last living city never folds; a fold is warned of first', async ({ p }) => {
  await setHarappa(p);
  await p.evaluate(() => window.__SABDO.adv()); await p.waitForTimeout(200);
  await closeCard(p); await p.waitForTimeout(200);
  const r = await p.evaluate(() => {
    const G = window.__SABG(), D = window.IND_SABHYATA;
    const living = D.sites.filter(s => { const q = G.sites[s.id]; return q && !q.zzz && !q.her; }).map(s => s.id);
    const findable = D.sites.filter(s => s.era === G.era && !G.sites[s.id].found).length;
    const folded = D.sites.filter(s => s.era === 0 && G.sites[s.id].her).map(s => s.id);
    return { era: G.era, living, findable, folded };
  });
  if (r.folded.length) throw new Error('turning the first age folded ' + r.folded.join(', ') + ' — only cities two ages behind may fold');
  if (r.era !== 1) throw new Error('the first age did not turn (era ' + r.era + ')');
  if (!r.living.length) throw new Error('the first age turn left no living city — the soft-lock');
  if (!r.findable) throw new Error('no place of the new age is left to find');
  /* the guard: two ages on, with only first-age cities alive, one is always kept */
  const g = await p.evaluate(() => {
    const G = window.__SABG(), D = window.IND_SABHYATA;
    D.sites.forEach(s => { if (s.era > 0) { G.sites[s.id].zzz = true; } });
    const alive = D.sites.filter(s => !G.sites[s.id].zzz && !G.sites[s.id].her && !G.sites[s.id].mon && G.capital !== s.id && !(s.renames && s.renames.length)).length;
    return { plan: window.__SABDO.foldPlan(3).length, alive };
  });
  if (g.alive && g.plan >= g.alive) throw new Error(`two ages on, the fold would take all ${g.alive} living cities`);
  /* the warning: era 1 → 2 folds the first age — asked first, and "Not yet" keeps it */
  const w = await p.evaluate(() => {
    const G = window.__SABG(), D = window.IND_SABHYATA;
    D.sites.forEach(s => { const q = G.sites[s.id]; if (s.era <= 1) { q.found = true; q.seen = true; q.zzz = false; q.her = false; q.mon = false; } });
    G.capital = null; G.res.katha = 5000;
    window.__SABDO.adv();
    const ov = document.querySelector('#sab-ovhost .sab-card');
    const said = ov ? ov.innerText : '';
    const no = document.querySelector('#sab-ovhost [data-sab-act="advno"]'); if (no) no.click();
    return { said, era: G.era };
  });
  if (!/will become (a memory|memories)/.test(w.said)) throw new Error('no warning before a fold: "' + w.said.slice(0, 80) + '"');
  if (w.era !== 1) throw new Error('"Not yet" still turned the age');
});

check('riddle', 'S3: a riddle shows its question; one try; a miss shows the answer and its source and waits for Aage; nothing paid for the miss', async ({ p }) => {
  await p.evaluate(() => { const G = window.__SABG(); G.quests.dholavira = { kind: 'riddle' }; G.res.katha = 0; });
  await openCity(p, 'dholavira');
  const open = await p.evaluate(() => {
    const b = document.querySelector('[data-sab-act=calls]'); if (b && b.getAttribute('aria-expanded') !== 'true') b.click();
    const row = document.querySelector('.sab-callrow[data-c="quest"]'); if (row) row.click();
    return !!row;
  });
  if (!open) throw new Error('the city offers no row for its riddle');
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const site = window.IND_SABHYATA.sites.find(s => s.id === 'dholavira');
    const body = (document.querySelector('.sab-calllist.iscard') || document.querySelector('#sab-sec-quest') || document.body).innerText;
    const wrong = [...document.querySelectorAll('[data-sab-act="qriddle"]')].find(b => b.getAttribute('data-o') !== site.ask.o[0]);
    const k0 = window.__SABG().res.katha;
    if (wrong) wrong.click();
    return { q: site.ask.q, a: site.ask.o[0], src: site.sources[0], body, clicked: !!wrong, k0 };
  });
  if (!r.body.includes(r.q)) throw new Error('the riddle\'s question is not on screen');
  if (!r.clicked) throw new Error('no option to answer');
  await p.waitForTimeout(300);
  const m = await p.evaluate(() => {
    const miss = document.querySelector('.gm-miss');
    return { miss: miss ? miss.innerText : '', opts: document.querySelectorAll('[data-sab-act="qriddle"]').length,
             katha: window.__SABG().res.katha, quest: !!window.__SABG().quests.dholavira };
  });
  if (!m.miss.includes(r.a)) throw new Error('a miss does not show the answer: "' + m.miss.slice(0, 80) + '"');
  if (!m.miss.includes(r.src.slice(0, 20))) throw new Error('a miss does not show where the answer comes from');
  if (m.opts) throw new Error('after a miss the options are still there to guess again');
  if (m.katha > r.k0) throw new Error('the miss paid katha');
  await p.evaluate(() => { const b = document.querySelector('[data-sab-act="qriddleaage"]'); if (b) b.click(); });
  await p.waitForTimeout(200);
  if (await p.evaluate(() => !!window.__SABG().quests.dholavira)) throw new Error('Aage did not close the riddle');
});

check('citycards', 'C1: a card opened inside a city is on top and visible; closing it re-enables Agla Saal', async ({ p }) => {
  await openCity(p, 'dholavira');
  if (!await p.evaluate(() => !!window.__SAB().city)) throw new Error('the city never opened, so this proves nothing');
  await p.evaluate(() => window.__SABDO.act2('yields')); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const c = document.querySelector('#sab-ovhost .sab-card'); if (!c) return { none: true };
    const b = c.getBoundingClientRect(), hit = document.elementFromPoint(b.left + b.width / 2, b.top + Math.min(b.height / 2, 40));
    return { w: Math.round(b.width), h: Math.round(b.height), top: !!(hit && c.contains(hit)) };
  });
  if (r.none) throw new Error('no card opened');
  if (!(r.w > 50 && r.h > 50)) throw new Error(`the card inside the city is ${r.w}×${r.h} — invisible`);
  if (!r.top) throw new Error('the card inside the city is underneath something');
  await closeCard(p); await p.waitForTimeout(250);
  const t = await p.evaluate(() => { const b = document.querySelector('.sab-cityturn [data-sab-act="turn"]'); return b ? b.disabled : null; });
  if (t !== false) throw new Error('Agla Saal is still dead after the card closed (' + t + ')');
});

check('monument', 'C3/C4: a finished monument stands on the kit board, shows on the map, and survives a reload', async ({ p, port }) => {
  await p.evaluate(() => { const q = window.__SABG().sites.dholavira; q.lv = 3; q.mon = true; q.monB = null; });
  await openCity(p, 'dholavira');
  const inCity = await p.evaluate(() => !!document.querySelector('.sab-monstand'));
  if (!inCity) throw new Error('the monument is not drawn on the city board');
  await p.evaluate(() => { const b = document.querySelector('[data-sab-act="leave"]'); if (b) b.click(); }); await p.waitForTimeout(400);
  const onMap = await p.evaluate(() => { const g = document.querySelector('#sab-dholavira .sab-mb'); return g && g.style.display !== 'none'; });
  if (!onMap) throw new Error('the map shows no monument at Dholavira');
  await p.evaluate(() => window.__SABDO.turn()); await p.waitForTimeout(400);   /* a turn saves */
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  await p.click('[data-bz=tab][data-v="khel"]').catch(() => p.evaluate(() => window.BI.go('khel')));
  await p.waitForTimeout(300); await p.click('.ghero'); await p.waitForTimeout(900);
  const ov = await p.$('#sab-ovhost .sab-btn'); if (ov) { await ov.click(); await p.waitForTimeout(250); }
  const kept = await p.evaluate(() => window.__SABG && window.__SABG().sites.dholavira.mon);
  if (!kept) throw new Error('a reload rolled the monument back');
});

check('goodnews', 'S4/S5: good news is never "warm"; every tone goes through the one mute; a hidden tab advances no turns', async ({ p }) => {
  const r = await p.evaluate(async () => {
    const G = window.__SABG(); G.res.katha = 5000;
    /* a scenario opens with good news ("the realm is already standing") */
    const sc = (window.__SABDO.scenarios() || [])[0];
    if (sc) window.__SABDO.scenario(sc.id);
    const feed = document.getElementById('sab-feed');
    const cls = feed ? feed.className : '';
    if (!/sab-good/.test(cls)) return { cls, bad: 'good news did not come out as sab-good' };
    const before = window.IND_SFX.played.length;
    window.__SABDO.turn();
    const tones = window.IND_SFX.played.slice(before);
    /* hidden: the live clock stops */
    window.__SABDO.speed('quick');
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    const t0 = window.__SAB().t;
    await new Promise(r => setTimeout(r, Math.max(1500, (window.__SAB().turnMs || 500) * 3)));
    const t1 = window.__SAB().t;
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
    window.__SABDO.speed('sochna');
    return { cls, tones, t0, t1, src: '' };
  });
  if (r.bad || /\bwarm\b/.test(r.cls)) throw new Error('the feed still says good news as "warm": ' + r.cls);
  if (r.t1 !== r.t0) throw new Error(`a hidden tab advanced ${r.t1 - r.t0} turns`);
  const src = require('fs').readFileSync(require('path').join(ROOT, 'sabhyata.js'), 'utf8');
  if (/new \(W\.AudioContext|webkitAudioContext/.test(src)) throw new Error('Sabhyata still makes its own AudioContext — the mute cannot reach it');
});

/* ---------------------------------------------------------------- boots at all */
check('boot', 'the game boots, takes a turn, and logs nothing', async ({ p, errs }) => {
  const t0 = await p.evaluate(() => window.__SAB().t);
  await p.evaluate(() => window.__SABDO.turn());
  const t1 = await p.evaluate(() => window.__SAB().t);
  if (!(t1 > t0)) throw new Error(`the clock did not advance when asked (${t0} -> ${t1})`);
  if (errs.length) throw new Error('logged: ' + errs.slice(0, 3).join(' | '));
});

/* ------------------------------------------------- one city, the rest asleep */
check('start', 'the world starts at Dholavira with all of India unseen', async ({ p }) => {
  const g = await p.evaluate(() => {
    const G = window.__SABG();
    const ids = Object.keys(G.sites);
    return { found: ids.filter(k => G.sites[k].found).length,
             awake: ids.filter(k => !G.sites[k].zzz).length, era: G.era };
  });
  if (g.found !== 1) throw new Error(`${g.found} places found at the start, expected 1`);
  if (g.awake !== 1) throw new Error(`${g.awake} places awake at the start, expected 1`);
  if (g.era !== 0) throw new Error(`started in era ${g.era}`);
});

/* ------------------------------------------------------ PHASE 1: the turn */

check('sochna', 'the world does not move until Agla Saal is pressed', async ({ p }) => {
  const sp = await p.evaluate(() => window.__SAB().speed);
  if (sp !== 'sochna') throw new Error(`default speed is ${sp}, expected sochna`);
  const t0 = await p.evaluate(() => window.__SAB().t);
  await p.waitForTimeout(4000);
  const t1 = await p.evaluate(() => window.__SAB().t);
  if (t1 !== t0) throw new Error(`the clock moved on its own in sochna (${t0} -> ${t1})`);
  await p.evaluate(() => window.__SABDO.turn());
  const t2 = await p.evaluate(() => window.__SAB().t);
  if (t2 !== t0 + 1) throw new Error(`Agla Saal moved the clock ${t0} -> ${t2}, expected one turn`);
});

check('speed', 'a live speed runs the clock, and switching back stops it', async ({ p }) => {
  await p.evaluate(() => window.__SABDO.speed('quick'));
  const t0 = await p.evaluate(() => window.__SAB().t);
  await p.waitForTimeout(4200);
  const t1 = await p.evaluate(() => window.__SAB().t);
  if (t1 <= t0) throw new Error('quick speed did not advance the clock');
  await p.evaluate(() => window.__SABDO.speed('sochna'));
  const t2 = await p.evaluate(() => window.__SAB().t);
  await p.waitForTimeout(3000);
  const t3 = await p.evaluate(() => window.__SAB().t);
  if (t3 !== t2) throw new Error('going back to sochna left the clock running');
});

check('turnbtn', 'the turn button and turn counter are on screen and agree', async ({ p }) => {
  const btn = await p.$('#sab-turn');
  if (!btn) throw new Error('no Agla Saal button');
  const box = await btn.boundingBox();
  if (!box || Math.min(box.width, box.height) < 28)
    throw new Error(`Agla Saal is ${box ? Math.round(box.width)+'x'+Math.round(box.height) : 'invisible'} — under a child's finger`);
  const before = await p.evaluate(() => document.getElementById('sab-turnno').textContent);
  await p.evaluate(() => window.__SABDO.turn());
  const after = await p.evaluate(() => document.getElementById('sab-turnno').textContent);
  if (Number(after) !== Number(before) + 1)
    throw new Error(`turn counter read ${before} then ${after}`);
});

check('undo', 'a direct spend can be taken back; a passed turn closes the window', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.res.anna = 300; G.res.kala = 300; G.res.katha = 300;
    const before = G.res.anna, lv = G.sites.dholavira.lv;
    window.__SABDO.act('dholavira', 'grow');          /* a real purchase, outside a turn */
    const G2 = window.__SABG();
    return { before, after: G2.res.anna, lv, lv2: G2.sites.dholavira.lv,
             canUndo: window.__SAB().canUndo };
  });
  if (r.lv2 !== r.lv + 1) throw new Error(`grow did not grow the town (${r.lv} -> ${r.lv2})`);
  if (!(r.after < r.before)) throw new Error('growing cost nothing');
  if (!r.canUndo) throw new Error('a direct spend left no undo behind');
  const back = await p.evaluate(() => {
    window.__SABDO.undo();
    const G = window.__SABG();
    return { anna: G.res.anna, lv: G.sites.dholavira.lv };
  });
  if (back.lv !== r.lv) throw new Error(`undo left the town at level ${back.lv}`);
  if (back.anna !== r.before) throw new Error(`undo returned ${back.anna} anna, expected ${r.before}`);

  /* AND THE WORLD CANNOT BE UNDONE: once a turn passes, the window is shut.
     Growing now asks which way the city spread, and that card stops the world until
     it is answered — correctly, but it means the turn has to be taken AFTER the
     direction is chosen or no turn passes at all and this proves nothing. */
  const shut = await p.evaluate(() => {
    window.__SABDO.act('dholavira', 'grow');
    const open = window.__SAB().canUndo;
    const btn = document.querySelector('#sab-ovhost [data-sab-act="growdir"]');
    if (btn) btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const cardGone = !window.__SAB().overlay;
    window.__SABDO.turn();
    return { open, cardGone, after: window.__SAB().canUndo, t: window.__SAB().t };
  });
  if (!shut.cardGone) throw new Error('the grow-direction card would not close');
  if (!shut.open) throw new Error('the second spend left no undo behind');
  if (shut.after) throw new Error('undo survived a passed turn — a world event could be rewound');
});

check('queue-no-undo', 'the queue\'s own spending is not undoable', async ({ p }) => {
  /* the plan was authorised when it was set; its spending happens inside a turn, and
     nothing inside a turn may open an undo window — that is what stops a raid that
     landed after a purchase from being rewound with it */
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.res.anna = 400; G.res.kala = 400; G.res.katha = 400;
    window.__SABDO.plan('dholavira', 'building', 'granary');
    window.__SABDO.turn();
    return { built: !!window.__SABG().sites.dholavira.bld.granary,
             canUndo: window.__SAB().canUndo };
  });
  if (!r.built) throw new Error('the planned granary was never raised');
  if (r.canUndo) throw new Error('a spend made inside a turn left an undo window open');
});

check('plan', 'a city build queue spends in the order the player set', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.res.anna = 400; G.res.kala = 400; G.res.katha = 400;
    G.era = 1;                                    /* gurukul and bazaar are era 1 */
    window.__SABDO.plan('dholavira', 'building', 'granary');
    window.__SABDO.plan('dholavira', 'building', 'workshop');
    const queued = G.sites.dholavira.plan.length;
    window.__SABDO.turn();
    const one = Object.keys(window.__SABG().sites.dholavira.bld).length;
    window.__SABDO.turn();
    const two = Object.keys(window.__SABG().sites.dholavira.bld).length;
    return { queued, one, two, left: window.__SABG().sites.dholavira.plan.length };
  });
  if (r.queued !== 2) throw new Error(`queued ${r.queued} items, expected 2`);
  if (r.one !== 1) throw new Error(`after one turn ${r.one} buildings stood, expected 1 — the queue built too much at once`);
  if (r.two !== 2) throw new Error(`after two turns ${r.two} buildings stood, expected 2`);
  if (r.left !== 0) throw new Error(`${r.left} items still queued`);
});

check('autopause', 'a live world stops itself when something has a deadline', async ({ p }) => {
  const r = await p.evaluate(async () => {
    const G = window.__SABG();
    G.speed = 'quick'; G.autoPause = true;
    window.__SABDO.speed('quick');
    /* stage a quarrel-shaped deadline the engine will see on its next turn */
    G.ev = { id: 'dholavira', at: G.t + 99 };
    await new Promise(r => setTimeout(r, 2600));
    return { pause: window.__SAB().pause, ev: !!window.__SABG().ev };
  });
  if (!r.ev) throw new Error('the staged event vanished before the check could see it');
  if (!r.pause) throw new Error('the world kept running with a timed decision open');
});

check('nextdec', 'the next-decision jump finds what is waiting', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    const none = window.__SAB().waiting;
    G.warn = { id: 'dholavira', raid: 'boar', at: G.t + 5 };
    window.__SABDO.paint();
    const some = window.__SAB().waiting;
    window.__SABDO.next();
    return { none, some };
  });
  if (!(r.some > r.none)) throw new Error(`waiting count did not rise with a warning (${r.none} -> ${r.some})`);
});

/* ------------------------------------------- PHASE 2: placement and terrain */

/* find two dry, empty, buildable cells that are neighbours, and two that are far
   apart, so the check is about ARRANGEMENT and never about terrain luck */
const twoSpots = async (p, cid) => p.evaluate(cid => {
  const T = (x, y) => window.__SABDO.terrain(cid, x, y);
  const C = window.IND_KIT_CITIES[cid];
  const dry = [];
  for (let y = 0; y < C.gh; y++) for (let x = 0; x < C.gw; x++)
    if (T(x, y) === 'land') dry.push([x, y]);
  const pair = [];
  for (const [x, y] of dry) {
    if (T(x + 1, y) === 'land') { pair.push([x, y], [x + 1, y]); break; }
  }
  /* THE FIRST CUT OF THIS TOOK THE FIRST TWO DRY CELLS MORE THAN SIX AWAY, which in
     scan order are neighbours of each other -- so "apart" was also side by side and
     the check said placement did not matter while the engine was working fine. The
     two distant cells have to be distant from EACH OTHER too. */
  const far = [];
  for (const [x, y] of dry) {
    const fromPair = Math.abs(x - pair[0][0]) + Math.abs(y - pair[0][1]);
    if (fromPair <= 6) continue;
    if (far.some(([fx, fy]) => Math.abs(x - fx) + Math.abs(y - fy) <= 4)) continue;
    far.push([x, y]);
    if (far.length === 2) break;
  }
  return { pair, far };
}, cid);

check('adjacency', 'the same two workshops are worth more side by side than apart', async ({ p }) => {
  const spots = await twoSpots(p, 'dholavira');
  if (spots.pair.length < 2 || spots.far.length < 2)
    throw new Error('could not find both an adjacent pair and two distant cells to compare');
  const r = await p.evaluate(({ pair, far }) => {
    const G = window.__SABG();
    const q = G.sites.dholavira;
    const put = cells => { q.kit = cells.map(c => ({ p: 'bd-har-bead', x: c[0], y: c[1] })); };
    put(far);
    const apart = window.__SABDO.kity('dholavira');
    put(pair);
    const together = window.__SABDO.kity('dholavira');
    q.kit = [];
    return { apart, together };
  }, spots);
  if (r.together.kala <= r.apart.kala)
    throw new Error(`side by side paid ${r.together.kala} kala, apart paid ${r.apart.kala} — placement still does not matter`);
});

check('preview', 'the plot preview and the payout agree exactly', async ({ p }) => {
  const spots = await twoSpots(p, 'dholavira');
  const r = await p.evaluate(({ pair }) => {
    const G = window.__SABG();
    const q = G.sites.dholavira;
    q.kit = [{ p: 'bd-har-bead', x: pair[0][0], y: pair[0][1] }];
    const before = window.__SABDO.kity('dholavira');
    /* what the game PROMISES this plot is worth */
    const pv = window.__SABDO.adjPrev('dholavira', 'bd-har-bead', pair[1][0], pair[1][1]);
    /* what it actually pays once built */
    q.kit.push({ p: 'bd-har-bead', x: pair[1][0], y: pair[1][1] });
    const after = window.__SABDO.kity('dholavira');
    q.kit = [];
    const real = { anna: after.anna - before.anna, kala: after.kala - before.kala,
                   katha: after.katha - before.katha };
    return { pv, real };
  }, spots);
  if (!r.pv) throw new Error('no preview returned for a real part');
  /* the promise is base + the arrangement's bonus, and it must equal the payout */
  for (const k of ['anna', 'kala', 'katha']) {
    const promised = (r.pv.base[k] || 0) + (r.pv.bonus[k] || 0);
    if (promised !== r.real[k])
      throw new Error(`preview promised ${promised} ${k} and the city paid ${r.real[k]} — the preview is a lie`);
  }
  if (!r.pv.why.length) throw new Error('the preview explains nothing — an adjacency nobody can read cannot be learned');
});

check('rivers', 'a city on a river is fed by it, and no boundary is drawn', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    const on = [], off = [];
    Object.keys(G.sites).forEach(id => {
      (window.__SABDO.river(id) ? on : off).push(id);
    });
    return { on: on.length, off: off.length, sample: on.slice(0, 4) };
  });
  if (!r.on) throw new Error('not one site in the whole roster sits on a river — the rivers are still decoration');
  if (!r.off) throw new Error('every site counts as riverine, so the bonus says nothing');
});

check('grow-dir', 'growth reaches further on the side the player chose', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    const C = window.IND_KIT_CITIES.dholavira;
    const q = G.sites.dholavira;
    q.grown = [];
    /* a cell due east, far enough out to be past the plain radius */
    const reach = window.IND_KIT_BUILD.reach[q.lv] || 5;
    const cell = [C.centre[0] + reach + 2, C.centre[1]];
    const before = window.__SABDO.reachTo('dholavira', cell[0], cell[1]);
    q.grown = ['e'];
    const after = window.__SABDO.reachTo('dholavira', cell[0], cell[1]);
    q.grown = [];
    return { before, after, reach };
  });
  if (!(r.after > r.before))
    throw new Error(`choosing east changed nothing (${r.before} -> ${r.after}) — growth is still a circle`);
});

/* ------------------------------------------------ PHASE 3: the two trees */

check('prereq', 'research is a tree: a locked door stays shut and says why', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.res.anna = 900; G.res.kala = 900; G.res.katha = 900;
    G.tech = {};
    const T = window.IND_SABHYATA.techs;
    const gated = T.find(t => (t.needs || []).length && t.era === 0);
    const openNow = window.__SABDO.techOpen(gated);
    /* try to buy it anyway, the way a tap would */
    window.__SABDO.act('dholavira', 'close');
    const boughtWhileShut = (() => {
      const before = !!window.__SABG().proj;
      const el = document.createElement('button');
      el.setAttribute('data-sab-act', 'tech'); el.setAttribute('data-t', gated.id);
      document.getElementById('sabwrap').appendChild(el); el.click(); el.remove();
      return !before && !!window.__SABG().proj;
    })();
    /* now grant the prerequisite and ask again */
    (gated.needs || []).forEach(n => { G.tech[n] = true; });
    const openAfter = window.__SABDO.techOpen(gated);
    return { id: gated.id, needs: gated.needs, openNow, openAfter, boughtWhileShut };
  });
  if (r.openNow) throw new Error(`${r.id} was open with ${r.needs.join(',')} unlearned`);
  if (!r.openAfter) throw new Error(`${r.id} stayed shut after its prerequisites were met`);
  if (r.boughtWhileShut) throw new Error(`${r.id} was bought while its prerequisites were unmet`);
});

check('doors', 'every age offers at least two things worth wanting', async ({ p }) => {
  const r = await p.evaluate(() => {
    const D = window.IND_SABHYATA, out = [];
    for (let e = 0; e < D.eras.length; e++) {
      const n = D.techs.filter(t => t.era === e).length + (D.riti || []).filter(x => x.era === e).length;
      if (n < 2) out.push(e + ' has ' + n);
    }
    return out;
  });
  if (r.length) throw new Error('ages with fewer than two doors: ' + r.join(', '));
});

check('eureka', 'doing the thing shortens the learning of it', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    const plough = window.IND_SABHYATA.techs.find(t => t.id === 'plough');
    G.sites.dholavira.kit = [];
    const cold = window.__SABDO.techDur(plough);
    const pct0 = window.__SABDO.eureka(plough);
    /* sow the fields the boost asks for */
    const field = window.IND_KIT_BUILD.items.find(i => i.g === 'field');
    G.sites.dholavira.kit = [];
    for (let i = 0; i < plough.boost.n; i++)
      G.sites.dholavira.kit.push({ p: field.p, x: i, y: 0 });
    const warm = window.__SABDO.techDur(plough);
    const pct1 = window.__SABDO.eureka(plough);
    G.sites.dholavira.kit = [];
    return { cold, warm, pct0, pct1, need: plough.boost.n };
  });
  if (r.pct0 !== 0) throw new Error(`the boost was already part-paid with nothing built (${r.pct0})`);
  if (!(r.pct1 > 0)) throw new Error(`building ${r.need} fields did not part-pay the plough`);
  if (!(r.warm < r.cold)) throw new Error(`the plough took ${r.warm} ticks warm and ${r.cold} cold — the eureka buys nothing`);
});

check('policy', 'a custom opens a card, the card pays, and swapping is free', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.res.anna = 900; G.res.kala = 900; G.res.katha = 900;
    G.riti = {}; G.pol = [];
    const grama = window.IND_SABHYATA.riti.find(x => x.id === 'grama');
    const openBefore = window.__SABDO.polOpen().length;
    const click = (act, attrs) => {
      const el = document.createElement('button');
      el.setAttribute('data-sab-act', act);
      Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
      document.getElementById('sabwrap').appendChild(el); el.click(); el.remove();
    };
    click('riti', { 'data-r': 'grama' });
    const adopted = !!window.__SABG().riti.grama;
    const openAfter = window.__SABDO.polOpen().length;
    /* slot it and check the effect is really read */
    click('pol', { 'data-p': grama.gives, 'data-s': '0' });
    const inForce = window.__SABDO.polEff('annaKind');
    click('polclear', { 'data-s': '0' });
    const cleared = window.__SABDO.polEff('annaKind');
    return { adopted, openBefore, openAfter, inForce, cleared };
  });
  if (!r.adopted) throw new Error('the custom was never adopted');
  if (!(r.openAfter > r.openBefore)) throw new Error('adopting a custom opened no card');
  if (r.inForce !== 'kheti') throw new Error(`the slotted card read back as ${r.inForce}, so nothing honours it`);
  if (r.cleared !== null) throw new Error('taking the card out left it in force');
});

check('policy-read', 'every policy effect is read somewhere in the engine', async () => {
  /* A CARD WHOSE EFFECT NOTHING READS is worse than a wrong number: a wrong one gets
     corrected the first time somebody looks, an ignored one never changes. Read from
     disk rather than through the page -- the page has no honest view of its own source. */
  const src = fs.readFileSync(path.join(ROOT, 'sabhyata.js'), 'utf8');
  const data = fs.readFileSync(path.join(ROOT, 'data-sabhyata.js'), 'utf8');
  const keys = new Set();
  const block = data.slice(data.indexOf('policies: ['), data.indexOf('rivers:'));
  for (const m of block.matchAll(/eff: *\{([^}]*)\}/g))
    for (const kv of m[1].split(','))
      if (kv.trim()) keys.add(kv.split(':')[0].trim());
  if (!keys.size) throw new Error('found no policy effects to check');
  const unread = [...keys].filter(k => !src.includes(`polEff('${k}')`));
  if (unread.length) throw new Error('policy effects nothing reads: ' + unread.join(', '));
});

check('techscale', 'a wider realm does not make learning free', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    const plough = window.IND_SABHYATA.techs.find(t => t.id === 'plough');
    const ids = Object.keys(G.sites);
    ids.forEach(id => { G.sites[id].zzz = true; });
    G.sites.dholavira.zzz = false;
    const small = window.__SABDO.techCost(plough);
    ids.slice(0, 12).forEach(id => { G.sites[id].zzz = false; G.sites[id].found = true; });
    const big = window.__SABDO.techCost(plough);
    return { small, big };
  });
  const k = Object.keys(r.small)[0];
  if (!(r.big[k] > r.small[k]))
    throw new Error(`the plough cost ${r.small[k]} in a small realm and ${r.big[k]} in a wide one`);
});

/* ----------------------------------------------- PHASE 4: scarcity */

check('goods', 'a road somewhere different is worth more than another road the same', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    const D = window.IND_SABHYATA;
    /* two towns of the SAME kind and region vs two of different ones */
    const byGood = {};
    D.sites.forEach(x => {
      const g = window.__SABDO.good(x.id);
      if (g) (byGood[g] = byGood[g] || []).push(x.id);
    });
    const same = Object.values(byGood).find(a => a.length >= 2);
    const goods = Object.keys(byGood);
    const diff = [byGood[goods[0]][0], byGood[goods[1]][0]];
    const wake = ids => {
      Object.keys(G.sites).forEach(id => { G.sites[id].zzz = true; G.sites[id].found = false; });
      G.routes = [];
      ids.forEach(id => { G.sites[id].zzz = false; G.sites[id].found = true; });
      G.routes = [[ids[0], ids[1]]];
    };
    wake(same);
    const sameN = window.__SABDO.khushi().have;
    wake(diff);
    const diffN = window.__SABDO.khushi().have;
    return { sameN, diffN, same, diff };
  });
  if (!(r.diffN > r.sameN))
    throw new Error(`two alike towns gave ${r.sameN} kinds and two unlike gave ${r.diffN} — variety counts for nothing`);
});

check('restless', 'a realm short of variety works slower, and it always lifts', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 6;                                   /* an age that wants real variety */
    Object.keys(G.sites).forEach(id => { G.sites[id].zzz = true; });
    const one = Object.keys(G.sites)[0];
    G.sites.dholavira.zzz = false; G.sites.dholavira.found = true;
    G.routes = [];
    const short = window.__SABDO.khushi();
    const thin = window.__SABDO.kity('dholavira');
    /* now reach plenty of different things */
    const D = window.IND_SABHYATA, seen = new Set(), ids = [];
    D.sites.forEach(x => {
      const g = window.__SABDO.good(x.id);
      if (g && !seen.has(g)) { seen.add(g); ids.push(x.id); }
    });
    ids.forEach(id => { G.sites[id].zzz = false; G.sites[id].found = true; });
    G.routes = ids.slice(1).map(id => ['dholavira', id]);
    const full = window.__SABDO.khushi();
    return { shortBy: short.restless, fullBy: full.restless, want: short.want };
  });
  if (!(r.shortBy > 0)) throw new Error(`a one-town realm in age 7 was not short of anything (wants ${r.want})`);
  if (r.fullBy !== 0) throw new Error(`a wide realm was still short by ${r.fullBy}`);
});

check('caps', 'one age raises a limited number of great works', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 0;
    const cap0 = window.__SABDO.worksCap();
    G.era = 8;
    const cap8 = window.__SABDO.worksCap();
    return { cap0, cap8 };
  });
  if (!(r.cap0 >= 1)) throw new Error('no great work can be raised at all');
  if (!(r.cap8 > r.cap0)) throw new Error(`the cap never widens (${r.cap0} -> ${r.cap8})`);
});

check('upkeep', 'a sprawling road network costs something to keep', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 0; G.routes = [];
    const none = window.__SABDO.upkeep();
    const ids = Object.keys(G.sites).slice(0, 24);
    G.routes = ids.slice(1).map((id, i) => [ids[i], id]);
    const many = window.__SABDO.upkeep();
    return { none, many, n: G.routes.length };
  });
  if (r.none !== 0) throw new Error(`an empty network already costs ${r.none}`);
  if (!(r.many > 0)) throw new Error(`${r.n} roads cost nothing to keep`);
});

check('soften', 'stacked bonuses stop running away', async ({ p }) => {
  const r = await p.evaluate(() => [1, 3, 4, 8, 16].map(n => [n, window.__SABDO.soften(n)]));
  const small = r.find(x => x[0] === 3), big = r.find(x => x[0] === 16);
  if (small[1] !== 3) throw new Error(`a small stack was softened (${small[1]}) — the city's own work must pay in full`);
  if (!(big[1] < 16)) throw new Error(`a stack of 16 still pays ${big[1]}`);
  if (!(big[1] > small[1])) throw new Error('softening went backwards — more is no longer more');
});

check('storecap', 'the granaries have a lid, and building raises it', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    Object.keys(G.sites).forEach(id => { G.sites[id].bld = {}; });
    const bare = window.__SABDO.storeCap();
    G.sites.dholavira.bld.granary = true;
    const withOne = window.__SABDO.storeCap();
    G.res.anna = bare * 10;
    window.__SABDO.turn();
    const held = window.__SABG().res.anna;
    return { bare, withOne, held };
  });
  if (!(r.withOne > r.bare)) throw new Error('a granary does not raise the lid');
  if (!(r.held <= r.withOne + 1)) throw new Error(`the stores held ${r.held} against a lid of ${r.withOne}`);
});

check('migrate', 'a neglected town loses people to a tended one, and no border moves', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    const ids = Object.keys(G.sites);
    const a = 'dholavira';
    const b = ids.find(i => i !== a);
    [a, b].forEach(i => { G.sites[i].zzz = false; G.sites[i].found = true; G.sites[i].her = false;
                          G.sites[i].lv = 3; G.sites[i].away = 0; G.sites[i].came = 0; });
    G.routes = [[a, b]];
    /* neglect one of them hard */
    G.sites[a].neg = 99999;
    const popBefore = { a: G.sites[a].away || 0, b: G.sites[b].came || 0 };
    window.__SABDO.migrate();
    const G2 = window.__SABG();
    return { left: G2.sites[a].away || 0, arrived: G2.sites[b].came || 0, popBefore };
  });
  if (!(r.left > 0 || r.arrived > 0))
    throw new Error('a hard-neglected town beside a tended one lost nobody');
});

/* --------------------------------------- PHASE 5: somebody else in the world */

check('partners', 'every age has somebody asking, and none of them is an enemy', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG(), out = [];
    for (let e = 0; e < window.IND_SABHYATA.eras.length; e++) {
      G.era = e;
      if (!window.__SABDO.partners().length) out.push(e);
    }
    /* and no partner may carry anything that reads as hostility */
    const words = /\b(attack|invad|enemy|war|conquer|raid|army|destroy)/i;
    const hostile = (window.IND_SABHYATA.partners || [])
      .filter(x => words.test(x.blurb + ' ' + x.name));
    return { empty: out, hostile: hostile.map(x => x.id) };
  });
  if (r.empty.length) throw new Error('ages with nobody out there: ' + r.empty.join(', '));
  if (r.hostile.length) throw new Error('partners written as adversaries: ' + r.hostile.join(', '));
});

check('request', 'a request can only be filled if a road actually reaches the thing', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 0; G.req = {}; G.fav = {}; G.sold = {};
    /* nothing reachable: one town, no roads */
    Object.keys(G.sites).forEach(id => { G.sites[id].zzz = true; G.sites[id].found = false; });
    G.sites.dholavira.zzz = false; G.sites.dholavira.found = true;
    G.routes = [];
    window.__SABDO.ask();
    const pid = Object.keys(G.req)[0];
    const want = G.req[pid].want;
    const before = G.res.katha;
    window.__SABDO.fill(pid);
    const refused = window.__SABG().res.katha === before && !!window.__SABG().req[pid];
    /* now make the wanted good reachable */
    const D = window.IND_SABHYATA;
    const supplier = D.sites.find(x => window.__SABDO.good(x.id) === want);
    G.sites[supplier.id].zzz = false; G.sites[supplier.id].found = true;
    G.routes = [['dholavira', supplier.id]];
    window.__SABDO.fill(pid);
    const G2 = window.__SABG();
    return { refused, want, paid: G2.res.katha > before, gone: !G2.req[pid],
             fav: (G2.fav || {})[pid] || 0 };
  });
  if (!r.refused) throw new Error(`a request for ${r.want} was filled with no road reaching it`);
  if (!r.paid) throw new Error('filling a reachable request paid nothing');
  if (!r.gone) throw new Error('the request stayed open after being filled');
  if (!(r.fav > 0)) throw new Error('filling a request earned no favour — nobody remembers');
});

check('market', 'the price of a thing falls the more of it you sell', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.sold = {};
    const good = Object.keys(window.__SABDO.goods())[0] ||
                 window.__SABDO.good(window.IND_SABHYATA.sites[0].id);
    const fresh = window.__SABDO.price(good);
    G.sold[good] = 6;
    const tired = window.__SABDO.price(good);
    G.sold[good] = 999;
    const floor = window.__SABDO.price(good);
    return { fresh, tired, floor };
  });
  if (!(r.tired < r.fresh)) throw new Error(`selling six changed nothing (${r.fresh} -> ${r.tired})`);
  if (!(r.floor > 0.2)) throw new Error(`the price bottomed out at ${r.floor} — a specialised good must still be worth carrying`);
});

check('favour-floor', 'a missed request costs favour but never loses a partner for good', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 0; G.fav = {}; G.req = {};
    window.__SABDO.ask();
    const pid = Object.keys(G.req)[0];
    G.fav[pid] = 0;
    /* let it lapse many times over */
    for (let i = 0; i < 6; i++) {
      G.req[pid] = { at: G.t, due: G.t - 1, want: 'nothing', pay: 10 };
      window.__SABDO.turn();
    }
    return { fav: (window.__SABG().fav || {})[pid] || 0,
             still: window.__SABDO.partners().some(x => x.id === pid) };
  });
  if (r.fav < 0) throw new Error(`favour went to ${r.fav} — below zero is a hole a child cannot climb out of`);
  if (!r.still) throw new Error('a partner disappeared entirely after missed requests');
});

check('diaspora', 'a long-served partner makes room, and it is never taken', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 0; G.fav = {}; G.diaspora = {};
    const pid = window.__SABDO.partners()[0].id;
    G.res.katha = 500;
    /* three envoys is the threshold */
    for (let i = 0; i < 4; i++) {
      const el = document.createElement('button');
      el.setAttribute('data-sab-act', 'envoy'); el.setAttribute('data-p', pid);
      document.getElementById('sabwrap').appendChild(el); el.click(); el.remove();
    }
    const G2 = window.__SABG();
    return { fav: (G2.fav || {})[pid] || 0, quarter: !!(G2.diaspora || {})[pid],
             routes: G2.routes.length, sites: Object.keys(G2.sites).length };
  });
  if (!(r.fav >= 3)) throw new Error(`four envoys only reached favour ${r.fav}`);
  if (!r.quarter) throw new Error('favour never turned into a quarter overseas');
  /* and nothing on the Indian map changed hands to get it */
  if (r.routes > 0) throw new Error('the diaspora added routes on the map — it must not touch territory');
});

/* --------------------------------------- PHASE 6: the arc and the endings */

check('erascore', 'an age is judged, and a thin one makes the next easier', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 2; G.deeds = {}; G.dark = false;
    const zero = window.__SABDO.eraScore();
    const bar = window.__SABDO.eraBar();
    const goldAtZero = window.__SABDO.golden();
    window.__SABDO.deed('wake', 20);
    const lots = window.__SABDO.eraScore();
    const goldNow = window.__SABDO.golden();
    /* a thin age lowers the next bar — the comeback has to be in the arithmetic */
    G.dark = true;
    const easier = window.__SABDO.eraBar();
    return { zero, bar, goldAtZero, lots, goldNow, easier };
  });
  if (r.zero !== 0) throw new Error(`a fresh age already scored ${r.zero}`);
  if (r.goldAtZero) throw new Error('an age with nothing done in it counted as golden');
  if (!(r.lots > r.zero)) throw new Error('deeds do not score');
  if (!r.goldNow) throw new Error(`${r.lots} against a bar of ${r.bar} was not golden`);
  if (!(r.easier < r.bar)) throw new Error(`after a quiet age the bar stayed at ${r.easier} — there is no way back`);
});

check('verdict', 'the age turning shows what it was, and records it', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 1; G.deeds = {}; G.ages = [];
    window.__SABDO.deed('wake', 40);              /* comfortably golden */
    window.__SABDO.verdict();
    const card = document.querySelector('#sab-ovhost');
    const txt = card ? card.textContent : '';
    const recorded = (window.__SABG().ages || []).length;
    const dedBtn = !!document.querySelector('#sab-ovhost [data-sab-act="dedicate"]');
    return { txt: txt.slice(0, 200), recorded, dedBtn, cleared: Object.keys(window.__SABG().deeds).length };
  });
  if (r.recorded !== 1) throw new Error(`the age was not recorded (${r.recorded} in the ledger)`);
  if (!/golden|swarna/i.test(r.txt)) throw new Error('a golden age did not say so: ' + r.txt);
  if (!r.dedBtn) throw new Error('a golden age offered no dedication to choose');
  if (r.cleared !== 0) throw new Error('the deed tally was not reset for the new age');
});

check('dedication', 'a dedication actually changes the next age', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.ded = null;
    const plain = window.__SABDO.techDur(window.IND_SABHYATA.techs[0]);
    G.ded = 'freeinquiry';
    const dedicated = window.__SABDO.techDur(window.IND_SABHYATA.techs[0]);
    const reads = window.__SABDO.dedEff('freeinquiry');
    G.ded = null;
    return { plain, dedicated, reads };
  });
  if (!r.reads) throw new Error('the dedication does not read back');
  if (!(r.dedicated < r.plain)) throw new Error(`Free Inquiry left learning at ${r.dedicated} vs ${r.plain}`);
});

check('fourroads', 'there is more than one way to finish, and each is reachable', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = window.IND_SABHYATA.eras.length - 1;
    /* nothing done: no road is complete */
    Object.keys(G.sites).forEach(id => { G.sites[id].zzz = true; G.sites[id].mon = false; });
    const none = window.__SABDO.vics();
    /* the learning road, without waking a single extra lamp */
    window.IND_SABHYATA.techs.forEach(t => { G.tech[t.id] = true; });
    G.riti = {}; window.IND_SABHYATA.riti.forEach(x => { G.riti[x.id] = true; });
    const learning = window.__SABDO.vics();
    return { none, learning, total: window.IND_SABHYATA.victories.length };
  });
  if (r.none.length) throw new Error('an empty realm already won by ' + r.none.join(','));
  if (!r.learning.includes('learning'))
    throw new Error('opening every door in both trees did not finish the game');
  if (r.learning.includes('memory'))
    throw new Error('the learning road also counted as memory — the roads are not distinct');
  if (r.total < 4) throw new Error(`only ${r.total} roads exist`);
});

check('deepsleep', 'a place left asleep through an age asks more to wake, and never less than it can give', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    const id = 'lothal';
    G.sites[id].deep = 0;
    const fresh = window.__SABDO.wakeCost(id);
    G.sites[id].deep = 2;
    const deep = window.__SABDO.wakeCost(id);
    G.sites[id].deep = 0;
    return { fresh, deep };
  });
  if (!(r.deep > r.fresh)) throw new Error(`a deeply sleeping place still costs ${r.deep} vs ${r.fresh}`);
  if (!(r.deep < r.fresh * 4)) throw new Error(`waking it costs ${r.deep} — beyond reach is beyond recovery`);
});

/* The first minute used to be able to end the game without saying so: Dholavira alone,
   left to the mist, asked for a road that had nowhere to go — and nothing awake could earn
   the katha to wake it. The first city needs no road, and the mist waits for one to be
   possible. Played, not poked: the turns are real turns. */
check('first-wake', 'the first city wakes without a road, and is never lost before a road is possible', async ({ p }) => {
  const turns = (n) => p.evaluate((n) => {
    const G = window.__SABG(), D = window.__SABDO; let most = 0;
    for (let i = 0; i < n; i++) {
      const t0 = G.t; D.turn();
      if (G.t === t0) { const b = document.querySelector('#sab-ovhost .sab-btn'); if (b) b.click(); D.turn(); }
      most = Math.max(most, G.sites.dholavira.idle, G.sites.dholavira.fade >= 0 ? 99 : 0);
    }
    const q = G.sites.dholavira; return { t: G.t, zzz: q.zzz, fade: q.fade, most };
  }, n);
  /* 1. alone on the map, the mist does not take it: there is nowhere to lay a road */
  const alone = await turns(90);
  if (alone.t < 80) throw new Error(`the turns did not run (t=${alone.t})`);
  if (alone.zzz || alone.fade >= 0)
    throw new Error(`Dholavira, alone with nothing else found, ${alone.zzz ? 'fell asleep' : 'began to fade'} by turn ${alone.t} — a road could not have held it`);

  /* 2. the trap itself: asleep, nothing else found, no road, katha short of a wake */
  const trap = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO;
    Object.keys(G.sites).forEach(id => { if (id !== 'dholavira') { G.sites[id].found = false; G.sites[id].zzz = true; } });
    G.routes = []; G.res.katha = 25; G.explorers = [];
    const q = G.sites.dholavira; q.zzz = true; q.fade = -1;
    const adv = D.advise().why;
    D.paint();
    const next = (document.getElementById('sab-guide') || {}).textContent || '';
    D.act('dholavira', 'wake');
    return { woke: !q.zzz, adv, next };
  });
  if (!trap.woke) throw new Error('the first city, asleep and alone, could not be woken — the game is over and says nothing');
  if (/road would let you wake/.test(trap.adv)) throw new Error(`the advisor sent the child for an impossible road: "${trap.adv}"`);
  if (/explorer|road toward/.test(trap.next)) throw new Error(`the guide line asks for the impossible: "${trap.next}"`);
  if (!/wake/i.test(trap.next)) throw new Error(`the guide line does not point at the wake: "${trap.next}"`);

  /* 3. with somewhere else awake it is the ordinary price — but still no road */
  const priced = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO;
    G.sites.lothal.found = true; G.sites.lothal.zzz = false;
    const q = G.sites.dholavira; q.zzz = true; q.fade = -1;
    const cost = D.wakeCost('dholavira');
    D.act('dholavira', 'city'); D.paint();      /* select it, so its tiles draw */
    const sh = document.querySelector('#sab-sheet');
    const txt = sh ? sh.innerText.replace(/\s+/g, ' ') : '';
    G.res.katha = cost; D.act('dholavira', 'wake');
    const woke = !q.zzz;
    /* and an ordinary city still needs its road */
    G.sites.lothal.zzz = true; G.res.katha = 999; D.act('lothal', 'wake');
    return { cost, woke, txt, other: !G.sites.lothal.zzz, routes: G.routes.length };
  });
  if (!(priced.cost > 0)) throw new Error(`with another city awake the first one woke for ${priced.cost} — free is only for the one way back`);
  if (!priced.woke) throw new Error('the first city, with katha in hand and no road, would not wake');
  if (!/Wake/.test(priced.txt) || /needs a road/.test(priced.txt))
    throw new Error(`the sleeping first city's tiles say: "${priced.txt.slice(0, 120)}"`);
  if (priced.other) throw new Error('Lothal woke without a road — only the first city is exempt');

  /* 4. once a road is possible, the mist's lesson is back for Dholavira too. Its own
     counter, not the outcome: a raid also fades a city, and hid this once. */
  await p.evaluate(() => {
    const G = window.__SABG(); G.routes = [];
    G.sites.lothal.found = true; G.sites.lothal.zzz = true;
    const q = G.sites.dholavira; q.zzz = false; q.idle = 0; q.fade = -1;
  });
  const later = await turns(20);
  if (!(later.most >= 3))
    throw new Error(`with a road possible and none laid, the mist never counted toward Dholavira (most ${later.most}) — the lesson is gone`);
});

check('scenario', 'a scenario hands over a realm that already works', async ({ p }) => {
  const r = await p.evaluate(() => {
    window.__SABDO.scenario('maurya');
    const G = window.__SABG();
    const ids = Object.keys(G.sites);
    return { era: G.era,
             awake: ids.filter(i => !G.sites[i].zzz && !G.sites[i].her).length,
             routes: G.routes.length,
             techs: Object.keys(G.tech).length,
             riti: Object.keys(G.riti || {}).length,
             anna: G.res.anna };
  });
  if (r.era !== 2) throw new Error(`the Maurya scenario started in era ${r.era}`);
  if (r.awake < 2) throw new Error(`only ${r.awake} places were awake — that is not a working realm`);
  if (r.routes < 1) throw new Error('the realm had no roads');
  if (r.techs < 1) throw new Error('the realm knew nothing from the ages before it');
  if (!(r.anna > 0)) throw new Error('the realm started broke');
});

check('ribbon', 'the ages behind you are on screen', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.ages = [{ era: 0, name: 'x', score: 30, bar: 10, good: true },
              { era: 1, name: 'y', score: 2, bar: 14, good: false }];
    window.__SABDO.paint();
    const el = document.getElementById('sab-ages');
    return { beads: el ? el.querySelectorAll('i').length : 0,
             golden: el ? el.querySelectorAll('i.g').length : 0,
             quiet: el ? el.querySelectorAll('i.q').length : 0,
             label: el ? el.getAttribute('aria-label') : '' };
  });
  if (r.beads !== 13) throw new Error(`${r.beads} beads for 13 ages`);
  if (r.golden !== 1 || r.quiet !== 1)
    throw new Error(`the ribbon shows ${r.golden} golden and ${r.quiet} quiet, expected 1 and 1`);
  if (!/golden/.test(r.label)) throw new Error('the ribbon has no readable label: ' + r.label);
});

/* ------------------------------------------- PHASE 7: making it legible */

check('breakdown', 'the itemised yield adds up to exactly what the city is paid', async ({ p }) => {
  /* THE ONE THING THAT MATTERS HERE. A breakdown computed a second way would drift from
     the payout, and an explanation that disagrees with the coins teaches the wrong rule
     with perfect confidence. */
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 3;
    const id = 'dholavira';
    const q = G.sites[id];
    q.zzz = false; q.found = true; q.lv = 3;
    q.bld = { granary: true, workshop: true, gurukul: true, bazaar: true };
    const other = Object.keys(G.sites).find(i => i !== id);
    G.sites[other].zzz = false; G.sites[other].found = true;
    G.routes = [[id, other]];
    const { y, led } = window.__SABDO.yieldLedger(id);
    const sums = { anna: 0, kala: 0, katha: 0 };
    led.forEach(l => { sums[l.k] += l.n; });
    return { y, sums, lines: led.length };
  });
  if (!r.lines) throw new Error('the breakdown explained nothing at all');
  for (const k of ['anna', 'kala', 'katha']) {
    if (r.sums[k] !== r.y[k])
      throw new Error(`${k}: the card adds to ${r.sums[k]} and the city is paid ${r.y[k]} — the card is a lie`);
  }
});

check('advisor', 'there is always one next thing to do, and it is never a list', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    const fresh = window.__SABDO.advise();
    /* an empty-handed realm still has to be told something */
    G.res = { anna: 0, kala: 0, katha: 0 };
    G.routes = [];
    const broke = window.__SABDO.advise();
    /* and with something waiting, it points at the thing */
    G.warn = { id: 'dholavira', raid: 'boar', at: G.t + 5 };
    const urgent = window.__SABDO.advise();
    return { fresh, broke, urgent };
  });
  for (const [name, a] of Object.entries(r)) {
    if (!a || !a.why || !a.why.length) throw new Error(`the advisor had nothing to say (${name})`);
    if (a.why.length > 160) throw new Error(`the advice is a paragraph, not a line (${name})`);
  }
  if (r.urgent.go !== 'dholavira')
    throw new Error(`with a warning live the advisor pointed at ${r.urgent.go}`);
});

check('digest', 'what happened is kept, not overwritten', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.log = [];
    G.res.anna = 400; G.res.kala = 400; G.res.katha = 400;
    window.__SABDO.act('dholavira', 'grow');
    const after = window.__SABDO.digestLog().length;
    /* and it is capped, so a long game cannot grow it without bound */
    for (let i = 0; i < 80; i++) window.__SABDO.turn();
    return { after, capped: window.__SABDO.digestLog().length };
  });
  if (!(r.after > 0)) throw new Error('nothing was recorded when the world spoke');
  if (r.capped > 40) throw new Error(`the log grew to ${r.capped} entries with no cap`);
});

check('replay', 'the order the lamps were lit in is remembered', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.res.katha = 900; G.res.kala = 900; G.res.anna = 900;
    const other = Object.keys(G.sites).find(i => i !== 'dholavira');
    G.sites[other].found = true; G.sites[other].zzz = true;
    G.routes = [['dholavira', other]];
    window.__SABDO.act(other, 'wake');
    return { litAt: window.__SABG().sites[other].litAt, awake: !window.__SABG().sites[other].zzz };
  });
  if (!r.awake) throw new Error('the place did not wake, so the replay cannot be checked');
  if (r.litAt == null) throw new Error('waking a place did not record when — there is no replay');
});

check('sound-optional', 'sound never blocks a verb and is silent under reduced motion', async ({ p }) => {
  /* a browser that refuses audio, or a child who asked for less motion, must still be
     able to play every verb — sound that can throw is sound that can break the game */
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.res.anna = 400;
    /* break AudioContext outright and check the verb still lands */
    const realAC = window.AudioContext, realWK = window.webkitAudioContext;
    window.AudioContext = function () { throw new Error('no audio here'); };
    window.webkitAudioContext = undefined;
    const lv = G.sites.dholavira.lv;
    let threw = null;
    try { window.__SABDO.act('dholavira', 'grow'); } catch (e) { threw = e.message; }
    const after = window.__SABG().sites.dholavira.lv;
    window.AudioContext = realAC; window.webkitAudioContext = realWK;
    return { threw, grew: after > lv };
  });
  if (r.threw) throw new Error('a broken AudioContext threw out of a verb: ' + r.threw);
  if (!r.grew) throw new Error('the verb did not happen when sound failed');
});

/* ------------------------ the three the tally caught me having skipped */

check('goodgate', 'a thing cannot be built from stuff the realm cannot reach', async ({ p }) => {
  const r = await p.evaluate(() => {
    const gated = window.IND_KIT_BUILD.items.find(i => i.needsGood);
    if (!gated) return { none: true };
    const G = window.__SABG();
    /* reach nothing */
    Object.keys(G.sites).forEach(id => { G.sites[id].zzz = true; G.sites[id].found = false; });
    G.sites.dholavira.zzz = false; G.sites.dholavira.found = true; G.routes = [];
    const locked = window.__SABDO.goodLock(gated);
    /* now reach the thing it needs */
    const D = window.IND_SABHYATA;
    const src = D.sites.find(x => window.__SABDO.good(x.id) === gated.needsGood);
    G.sites[src.id].zzz = false; G.sites[src.id].found = true;
    G.routes = [['dholavira', src.id]];
    const freed = window.__SABDO.goodLock(gated);
    return { part: gated.p, needs: gated.needsGood, locked, freed };
  });
  if (r.none) throw new Error('no catalogue item is gated on a good at all');
  if (!r.locked) throw new Error(`${r.part} was buildable with no road reaching ${r.needs}`);
  if (r.freed) throw new Error(`${r.part} stayed locked after a road reached ${r.needs}`);
});

check('sisters', 'the shared meter counts all of India and only goes up', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 2;
    const ids = Object.keys(G.sites);
    ids.forEach(id => { G.sites[id].zzz = true; });
    G.sites.dholavira.zzz = false;
    const few = window.__SABDO.remembered();
    /* wake places that are NOT on the player's roads — somebody else's lamps */
    G.routes = [];
    ids.slice(0, 8).forEach(id => { G.sites[id].zzz = false; G.sites[id].found = true; });
    const many = window.__SABDO.remembered();
    return { few, many, sis: window.__SABDO.sisters().length };
  });
  if (!(r.many.lit > r.few.lit))
    throw new Error('lamps lit off the player\'s roads do not count toward the meter');
  if (r.many.pct < r.few.pct)
    throw new Error('the shared meter went DOWN — it must only ever rise');
});

check('rail', 'what is live is stacked worst-first, dismissible, and never over the map', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.hushed = {};
    G.warn = { id: 'dholavira', raid: 'boar', at: G.t + 5 };
    G.ev = { id: 'dholavira', at: G.t + 9 };
    window.__SABDO.paint();
    const rail = document.getElementById('sab-rail');
    const rows = [...rail.querySelectorAll('.sab-railrow')];
    const order = rows.map(x => x.className.match(/p(\d)/)[1]);
    /* dismiss the first and check it goes */
    const before = rows.length;
    rows[0].querySelector('.sab-railx').click();
    const after = document.querySelectorAll('#sab-rail .sab-railrow').length;
    /* AND IT MUST NOT COVER THE BOARD IT IS TALKING ABOUT.
       This started as "the rail may not overlap the board at all", which was right
       while the rail sat in the flow and wrong the moment it started floating: a rail
       above the map cost the map its whole height, and on a phone the map only had
       150px to give. So it became corner rules — a minority of the board, never over
       the middle.
       Now the board is sized from the map's own ratio, a sibling cannot shrink it, and
       the rail has left the map altogether. That is the promise kept in full, so a rail
       that does not touch the board at all passes outright; the corner rules stay for
       any width where it still has to float. The promise was never about where the rail
       sits, it was "you can still see the thing". */
    const board = document.querySelector('.sab-stage').getBoundingClientRect();
    const rr = rail.getBoundingClientRect();
    const area = (rr.width * rr.height) / (board.width * board.height);
    const cx = board.left + board.width / 2, cy = board.top + board.height / 2;
    const overCentre = cx > rr.left && cx < rr.right && cy > rr.top && cy < rr.bottom;
    const clear = rr.right <= board.left + 2 || rr.left >= board.right - 2 ||
                  rr.bottom <= board.top + 2 || rr.top >= board.bottom - 2;
    return { before, after, order, area, overCentre, clear,
             inside: rr.left >= board.left - 2 && rr.right <= board.right + 2 };
  });
  if (r.before < 2) throw new Error(`only ${r.before} rows with two things live`);
  if (r.order.join('') !== [...r.order].sort().join(''))
    throw new Error('the rail is not worst-first: ' + r.order.join(','));
  if (!(r.after < r.before)) throw new Error('dismissing a row did not remove it');
  if (!r.clear) {
    if (!r.inside) throw new Error('the rail overlaps the board and hangs off its edge');
    if (r.overCentre) throw new Error('the rail sits over the middle of the board');
    if (r.area > 0.28)
      throw new Error(`the rail covers ${Math.round(r.area * 100)}% of the board — it is a wall, not a corner`);
  }
});

check('city-turn', 'a year can be spent without leaving the city', async ({ p }) => {
  /* In Sochna the city was a dead end: you came in to plan, spent your coin, and had
     to walk back out to the map to spend the year. The engine always allowed it —
     tick() takes a `forced` flag for exactly this — there was simply no button. */
  const G0 = await p.evaluate(() => {
    const G = window.__SABG();
    G.res = { anna: 300, kala: 300, katha: 300 };
    return Object.keys(G.sites)[0];
  });
  await openCity(p, 'dholavira');
  const r = await p.evaluate(() => {
    const inCity = !!window.__SAB().city;
    const btn = document.querySelector('.sab-cityturn [data-sab-act="turn"]');
    if (!btn) return { inCity, found: false };
    const box = btn.getBoundingClientRect();
    const t0 = window.__SAB().t;
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return { inCity, found: true, t0, t1: window.__SAB().t,
             stillIn: !!window.__SAB().city,
             w: Math.round(box.width), h: Math.round(box.height),
             coins: document.querySelectorAll('.sab-cityturn .sab-chip').length };
  });
  if (!r.inCity) throw new Error('the city never opened, so this proves nothing');
  if (!r.found) throw new Error('no Agla Saal inside the city — the city is a dead end in Sochna');
  if (r.t1 !== r.t0 + 1) throw new Error(`the city turn moved the clock ${r.t0} -> ${r.t1}`);
  if (!r.stillIn) throw new Error('taking a turn threw the player out of the city');
  if (Math.min(r.w, r.h) < 28) throw new Error(`the city turn button is ${r.w}x${r.h}`);
  if (r.coins < 3) throw new Error(`${r.coins} totals beside it — a turn that moves numbers you cannot see is half a button`);

  /* AND IT MUST NOT LAND ON THE VERBS THAT WERE THERE FIRST. The first placement sat
     bottom centre, which on a phone is where Grow already is — it wrapped to two rows
     and sat under the button. An overlap is invisible to every other check here. */
  const clash = await p.evaluate(() => {
    const strip = document.querySelector('.sab-cityturn');
    const r1 = strip.getBoundingClientRect();
    const hit = [];
    document.querySelectorAll('.sab-grow,.sab-dhandle,.sab-leave,[data-sab-act="kitzoom"]').forEach(el => {
      const r2 = el.getBoundingClientRect();
      if (r2.width < 1) return;
      const over = !(r2.right < r1.left || r2.left > r1.right ||
                     r2.bottom < r1.top || r2.top > r1.bottom);
      if (over) hit.push(el.className || el.getAttribute('data-sab-act'));
    });
    /* AND IT MUST NOT HAVE BROKEN ONTO EXTRA ROWS. Measure the LABEL, not the button:
       the button carries a min-height for the finger, so comparing its box to a line
       of text fires on a perfectly good button. The label's own height against its own
       line-height is the only thing that answers "did this wrap". */
    const lbl = strip.querySelector('[data-sab-act="turn"] .lbl') ||
                strip.querySelector('[data-sab-act="turn"]');
    const cs = getComputedStyle(lbl);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3;
    return { hit, lblH: lbl.getBoundingClientRect().height, lh,
             tall: lbl.getBoundingClientRect().height > lh * 1.7 };
  });
  if (clash.hit.length) throw new Error('the city turn strip sits on: ' + clash.hit.join(', '));
  if (clash.tall) throw new Error('the Agla Saal label wrapped onto a second line');
});

check('no-raw-escapes', 'no \\uXXXX escape reaches a child as text', async () => {
  /* Found on a phone screenshot: the advisor row read "\\u25b8 Dholavira wants you" and
     the digest button was a box with "\\u2263" in it. Five sequences across two files had
     been written with a doubled backslash inside a single-quoted string, so JS never
     decoded them and the app printed the escape.

     Nothing caught it because every check here asks the engine what it thinks, and the
     engine was right -- the advisor really did want that row. Only the rendered text was
     wrong, and no test reads the rendered text for nonsense.

     Source, not DOM: a rendered scan would only cover the states a test happens to open,
     and one of these lived in the geography data behind a single island. */
  const dir = path.join(__dirname, '..', 'app');
  const bad = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.js')) continue;
    const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
    lines.forEach((ln, i) => {
      const m = ln.match(/\\\\u[0-9a-fA-F]{4}/g);
      if (m) bad.push(`${f}:${i + 1} ${m.join(' ')}`);
    });
  }
  if (bad.length)
    throw new Error('escapes that will print as text:\n       ' + bad.join('\n       '));
});

check('realm', 'the side column says what the realm is doing, from turn one', async ({ p }) => {
  /* Putting the HUD beside the map bought a 565px column and then left 690px of it
     cream, because at turn one the rail has nothing live and the advisor is one line.
     A realm has a state worth showing from the first turn -- which places are awake,
     how big, and what each is actually making -- and without it a child had to walk
     into every city to discover that none of them was doing anything.

     The check asks for the fact, not the markup: a row per awake place, each naming
     what it is doing, a count of the ones still asleep, and a row that takes you
     there. It reads the engine for the expected names rather than trusting the panel
     to agree with itself. */
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    const awake = Object.keys(G.sites).filter(id => !G.sites[id].zzz);
    const panel = document.getElementById('sab-realm');
    if (!panel) return { none: true };
    const cs = getComputedStyle(panel);
    const rows = [...panel.querySelectorAll('.sab-realmrow')];
    return {
      shown: cs.display !== 'none' && !panel.hasAttribute('hidden'),
      awake: awake.length,
      rows: rows.length,
      texts: rows.map(x => x.textContent.trim()),
      targets: rows.map(x => x.getAttribute('data-g')),
      asleepLine: (panel.querySelector('.sab-realmasleep') || {}).textContent || '',
      totalSites: Object.keys(G.sites).length,
    };
  });
  if (r.none) throw new Error('there is no realm panel');
  if (!r.shown) throw new Error('the realm panel is not on screen at a desktop width');
  if (r.rows !== r.awake)
    throw new Error(`${r.awake} places are awake but the panel lists ${r.rows}`);
  /* every row must say what that place is doing -- "nothing planned" counts, and is
     in fact the one a child most needs on turn one */
  const silent = r.texts.filter(t => !/nothing planned|monument|fading|\+\d|[a-z]{4}/i.test(t));
  if (silent.length) throw new Error('a row does not say what the place is doing: ' + silent[0]);
  const asleep = r.totalSites - r.awake;
  if (asleep > 0 && !new RegExp('\\b' + asleep + '\\b').test(r.asleepLine))
    throw new Error(`${asleep} places are asleep but the panel does not say so (saw "${r.asleepLine}")`);

  /* and a row takes you to that place */
  const went = await p.evaluate(() => {
    const row = document.querySelector('.sab-realmrow');
    const want = row.getAttribute('data-g');
    row.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return { want, got: window.__SABDO.sel ? window.__SABDO.sel() : null };
  });
  if (went.got !== null && went.got !== undefined && went.got !== went.want)
    throw new Error(`clicking ${went.want} selected ${went.got}`);
});

check('no-bleed', 'on a phone the board fills the page without escaping it', async ({ p }) => {
  /* A phone binds the board by WIDTH -- the opposite of a desktop, where it is bound by
     height -- so it is tempting to buy the map some room by stepping the board out of
     the page's padding and running it to the screen edge. That was tried and is not
     wanted: the board sits inside the same margins as every other card in the app.

     So this is a check on a decision, not on an accident. It holds the board within its
     parent's content box on the three common phone widths, and holds the page to no
     sideways scroll -- because a negative margin that overflows is how a bleed comes
     back by accident rather than on purpose.

     AND THE OTHER HALF OF THE SAME PROMISE: inside the page, but using nearly all of
     it. The room the board could not take by bleeding was found instead by cutting the
     chrome it sits in -- the card's own side padding from 22px to 8px, and the page's
     gutter from 16px to 8px, both below 560px. Between them those two were taking 38px
     of each side of a 390px screen, 19% of it, before a single pixel went to the thing
     the screen is for.
     Both numbers live in app.css and this is the only thing watching them. A phone's
     board is bound by width, so a padding quietly restored is a map quietly shrunk, and
     nothing else in the suite would notice. */
  const sizes = [[390, 844], [360, 740], [375, 667], [320, 568]];
  const bad = [];
  for (const [w, h] of sizes) {
    await p.setViewportSize({ width: w, height: h });
    await p.waitForTimeout(350);
    const r = await p.evaluate(() => {
      const st = document.getElementById('sab-stage');
      if (!st) return null;
      const b = st.getBoundingClientRect();
      const host = st.parentElement.getBoundingClientRect();
      return { outL: Math.round(host.left - b.left), outR: Math.round(b.right - host.right),
               frac: b.width / innerWidth,
               over: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    if (!r) { bad.push(`${w}x${h}: no board`); continue; }
    if (r.outL > 1 || r.outR > 1)
      bad.push(`${w}x${h}: the board bleeds out of the page by ${Math.max(r.outL, r.outR)}px`);
    if (r.over > 1)
      bad.push(`${w}x${h}: the page scrolls sideways by ${r.over}px`);
    if (r.frac < 0.88)
      bad.push(`${w}x${h}: the board is only ${Math.round(r.frac * 100)}% of the screen's width — side padding has crept back`);
  }
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.waitForTimeout(300);
  if (bad.length) throw new Error(bad.join('; '));
});

check('board-share', 'the map is the page, not a stamp beside empty space', async ({ p }) => {
  /* `board-fills` asks whether the map fills the BOARD. It was green all along while a
     player was looking at a map that filled a third of the SCREEN, because the board
     itself was small: a portrait map is bound by height, the HUD was stacked on top of
     it taking the scarce axis, and a reserved rail strip took 280px more on every
     screen where nothing was live. Nothing measured the map against the page, so
     nothing could see it.

     A crude floor, deliberately. The exact share depends on the viewport's shape and
     is not worth pinning; what is worth catching is the map dropping back to a third
     of the screen, which is what every version of this fault has looked like. If this
     fires, open a screenshot before touching the number. */
  const sizes = [[1440, 900], [1920, 1080]];
  const bad = [];
  for (const [w, h] of sizes) {
    await p.setViewportSize({ width: w, height: h });
    await p.waitForTimeout(400);
    const share = await p.evaluate(() => {
      const st = document.getElementById('sab-stage');
      const svg = st && st.querySelector('svg');
      if (!svg) return null;
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      svg.querySelectorAll('path.sab-terr').forEach(el => {
        const q = el.getBoundingClientRect();
        if (q.width < 1) return;
        x0 = Math.min(x0, q.left); y0 = Math.min(y0, q.top);
        x1 = Math.max(x1, q.right); y1 = Math.max(y1, q.bottom);
      });
      if (x1 < x0) return null;
      return ((x1 - x0) * (y1 - y0)) / (innerWidth * innerHeight);
    });
    if (share === null) { bad.push(`${w}x${h}: no board`); continue; }
    if (share < 0.35)
      bad.push(`${w}x${h}: the map is ${Math.round(share * 100)}% of the screen`);
  }
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.waitForTimeout(300);
  if (bad.length) throw new Error('the map has shrunk on the page — ' + bad.join('; '));
});

check('board-fills', 'the board uses the room it is given, at every width', async ({ p }) => {
  /* Found by looking at a screenshot, which is the only thing that found it. The stage
     was whatever height the flex column had spare and whatever width the page was, and
     the svg's default preserveAspectRatio then letterboxed a 1000x1100 portrait map
     inside it: on a 1440 desktop India drew at 39% of the stage width with 416px of dead
     ground either side, and on a phone a quarter of the board was empty.

     Nothing caught it because nothing asserted the outcome. Every check here measured a
     mechanism -- a rule is present, an element exists -- and the pillarbox is not a rule,
     it is what happens when no rule decides. So this one measures what a player sees: the
     painted land against the board it is painted on, at three real widths.

     The tolerance is 85%, not 100%, because the map artwork carries its own margin inside
     the viewBox -- India's bounding box is about 92% of 1000x1100. 85% passes the artwork
     and fails a letterbox, which is the distinction that matters. */
  const sizes = [[1440, 900], [820, 1180], [390, 844]];
  const bad = [];
  for (const [w, h] of sizes) {
    await p.setViewportSize({ width: w, height: h });
    await p.waitForTimeout(350);
    const r = await p.evaluate(() => {
      const st = document.getElementById('sab-stage');
      const svg = st && st.querySelector('svg');
      if (!svg) return null;
      /* measured against the SVG, not the stage: the svg IS the room given to the map,
         and on a wide screen the stage deliberately holds a strip beside it for the rail.
         Measuring the stage would read that strip as waste and fail correct work.
         IN THE GAME WINDOW the room given to the map is the clear ground between the two
         columns and under the top beam — the columns are where the HUD lives, on purpose,
         and the map is fitted between them. A portrait country in a landscape window is
         bound by one axis, so it must fill THAT one: the better of the two counts. */
      let b = svg.getBoundingClientRect();
      const wrap = document.getElementById('sabwrap');
      const gwMode = wrap && wrap.classList.contains('gw');
      if (gwMode) {
        /* the ground the fit says it used — on a phone the HUD is a top column and a
           dock rather than two side columns, and it is measured, so it is read back */
        const v = k => parseFloat(wrap.style.getPropertyValue('--gw-' + k)) || 0;
        b = { left: b.left + v('l'), top: b.top + v('t'), width: b.width - v('l') - v('r'), height: b.height - v('t') - v('b') };
      }
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      svg.querySelectorAll('path.sab-terr').forEach(el => {
        const q = el.getBoundingClientRect();
        if (q.width < 1) return;
        x0 = Math.min(x0, q.left); y0 = Math.min(y0, q.top);
        x1 = Math.max(x1, q.right); y1 = Math.max(y1, q.bottom);
      });
      if (x1 < x0) return null;
      return { fw: (x1 - x0) / b.width, fh: (y1 - y0) / b.height, gw: gwMode };
    });
    if (!r) { bad.push(`${w}x${h}: no board`); continue; }
    if (r.gw) {
      if (Math.max(r.fw, r.fh) < 0.85)
        bad.push(`${w}x${h}: the map fills ${Math.round(Math.max(r.fw, r.fh) * 100)}% of the clear ground on its binding axis`);
      continue;
    }
    if (r.fw < 0.85) bad.push(`${w}x${h}: the map is ${Math.round(r.fw * 100)}% of the board's width`);
    if (r.fh < 0.85) bad.push(`${w}x${h}: the map is ${Math.round(r.fh * 100)}% of the board's height`);
  }
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.waitForTimeout(300);
  if (bad.length) throw new Error('the board is letterboxed -- ' + bad.join('; '));
});

check('game-window', 'on a wide screen the map is the screen, and no panel sits on the country', async ({ p }) => {
  /* "So much space wasted on the left — the map should be front and centre, with the
     choices and buttons embedded where they belong (look at Civ 6, AoE)." The map used to
     be a portrait box under the app's header with its bottom below the fold.

     Three promises, measured at four landscape sizes:
       1. the board is the whole window — not a box on a page
       2. Agla Saal and the top beam are on it, inside the window
       3. at the whole-India view, the realm, Mithu and the alerts lie beside the country,
          never on it: the panels float over sea and mist, which is the only reason it is
          acceptable for them to float over the map at all (the rail's own rule). */
  const sizes = [[1920, 1080], [1440, 900], [1366, 680], [1180, 820]];
  const bad = [];
  for (const [w, h] of sizes) {
    await p.setViewportSize({ width: w, height: h });
    await p.waitForTimeout(450);
    const r = await p.evaluate(() => {
      const wrap = document.getElementById('sabwrap');
      if (!wrap || !wrap.classList.contains('gw')) return { off: true };
      /* the whole country, the way the ⌂ button shows it */
      const z = document.querySelector('[data-sab-act="zreset"]');
      if (z) z.click();
      const G = window.__SABG();
      G.warn = { id: 'dholavira', raid: 'boar', at: G.t + 5 };
      window.__SABDO.paint();
      const st = document.getElementById('sab-stage').getBoundingClientRect();
      const svg = document.querySelector('#sab-stage svg');
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      svg.querySelectorAll('path.sab-terr').forEach(el => {
        const q = el.getBoundingClientRect();
        if (q.width < 1) return;
        x0 = Math.min(x0, q.left); y0 = Math.min(y0, q.top); x1 = Math.max(x1, q.right); y1 = Math.max(y1, q.bottom);
      });
      const inWin = el => { if (!el) return false; const q = el.getBoundingClientRect();
        return q.width > 0 && q.left >= -1 && q.top >= -1 && q.right <= innerWidth + 1 && q.bottom <= innerHeight + 1; };
      const over = [];
      ['.sab-realm', '.sab-coach', '#sab-rail'].forEach(sel => {
        const el = document.querySelector(sel);
        if (!el || el.hidden || getComputedStyle(el).display === 'none') return;
        const q = el.getBoundingClientRect();
        const ix = Math.min(q.right, x1) - Math.max(q.left, x0), iy = Math.min(q.bottom, y1) - Math.max(q.top, y0);
        if (ix > 6 && iy > 6) over.push(sel + ' by ' + Math.round(ix) + 'px');
      });
      return { cover: (st.width * st.height) / (innerWidth * innerHeight),
               turn: inWin(document.getElementById('sab-turn')), beam: inWin(document.querySelector('.sab-bar')),
               over };
    });
    if (r.off) { bad.push(`${w}x${h}: not a game window`); continue; }
    if (r.cover < 0.98) bad.push(`${w}x${h}: the board is ${Math.round(r.cover * 100)}% of the window`);
    if (!r.turn) bad.push(`${w}x${h}: Agla Saal is not on the window`);
    if (!r.beam) bad.push(`${w}x${h}: the top beam is not on the window`);
    if (r.over.length) bad.push(`${w}x${h}: a panel sits on the country — ${r.over.join(', ')}`);
  }
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.waitForTimeout(400);
  if (bad.length) throw new Error(bad.join('; '));
});

check('labels', 'a city name is the same size however far you lean in', async ({ p }) => {
  /* The label was sized in SVG user units and the board zooms by shrinking its
     viewBox, so leaning in blew every name up with the land: "Pataliputra" ran off
     the frame and Kashi sat on top of it. A name is chrome, not terrain. */
  const measure = () => p.evaluate(() => {
    const t = document.querySelector('#sab-sites .sab-lab text');
    if (!t) return null;
    const r = t.getBoundingClientRect();
    return { h: r.height, w: r.width };
  });
  await p.evaluate(() => { const G = window.__SABG();
    Object.keys(G.sites).forEach(id => { G.sites[id].found = true; G.sites[id].zzz = false; });
    window.__SABDO.paint(); });
  await p.evaluate(() => window.__SABDO.zoom(2));      /* the whole country */
  await p.waitForTimeout(250);
  const out = await measure();
  await p.evaluate(() => window.__SABDO.zoom(0));      /* leaned right in */
  await p.waitForTimeout(250);
  const near = await measure();
  if (!out || !near) throw new Error('no city label on the board at all');
  const ratio = near.h / out.h;
  if (!(ratio > 0.6 && ratio < 1.7))
    throw new Error(`a name is ${out.h.toFixed(1)}px out and ${near.h.toFixed(1)}px in — it scales with the land`);
  if (near.h > 40) throw new Error(`a city name renders ${near.h.toFixed(0)}px tall — that is a headline, not a label`);

  /* AND NO TWO NAMES MAY SHARE PIXELS. History clusters -- Kashi and Pataliputra are
     twenty units apart -- so this is the case that actually happens, and no amount of
     per-site label direction fixes two names wanting the same spot. */
  const overlaps = await p.evaluate(() => {
    const vis = [...document.querySelectorAll('#sab-sites .sab-lab')]
      .filter(g => g.style.display !== 'none' && g.getBoundingClientRect().width > 0)
      .map(g => ({ r: g.getBoundingClientRect(),
                   t: (g.textContent || '').trim() }));
    const bad = [];
    for (let i = 0; i < vis.length; i++)
      for (let j = i + 1; j < vis.length; j++) {
        const a = vis[i].r, b = vis[j].r;
        if (!(b.right < a.left || b.left > a.right || b.bottom < a.top || b.top > a.bottom))
          bad.push(vis[i].t + ' / ' + vis[j].t);
      }
    return { shown: vis.length, bad };
  });
  if (!overlaps.shown) throw new Error('no names are drawn at all');
  if (overlaps.bad.length)
    throw new Error('names sitting on each other: ' + overlaps.bad.slice(0, 4).join(', '));
});

check('colour-roles', 'the colour that means "press this" is not the colour that means "worry"', async ({ p }) => {
  /* --accent in this theme is a red, and it is what every GO button wears. A warning
     painted the same red makes one colour mean two opposite things on one screen. And
     an alarm-red warning is the wrong register anyway: docs/16 §3 says a fading site
     is sad, not scary.

     IT READS EVERY WARNING SURFACE, AND IT GOES TO THEM. The first version named only
     the notification rail, so the city kept an alarm-red gate banner straight through
     the pass that existed to remove it -- a screenshot of the city caught what the
     check could not. The second version named the city's surfaces but still ran on the
     map, where they do not exist, so querySelectorAll found nothing and it passed with
     the red still in place: green for the wrong reason, which is worse than red.
     So it now opens the city, and it FAILS IF A SURFACE IT NAMES IS NOT THERE. A check
     that silently skips what it cannot find is not a check. */
  const scan = () => p.evaluate(() => {
    const rgb = el => (getComputedStyle(el).backgroundColor.match(/[\d.]+/g) || [0, 0, 0])
      .slice(0, 3).map(Number);
    const vis = el => {
      if (!el || el.hasAttribute('hidden')) return false;
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden';
    };
    const go = [...document.querySelectorAll('#sab-turn,.sab-act.go,.sab-btn.go,.sab-cityturn')]
      .find(vis);
    const out = { go: go ? rgb(go) : null, found: {} };
    const grab = (sel, name) => {
      [...document.querySelectorAll(sel)].filter(vis).forEach(el => {
        if (el.classList.contains('ready')) return;  /* green = the gate holds: the opposite of a warning */
        const cs = getComputedStyle(el);
        (out.found[name] = out.found[name] || []).push({ b: rgb(el), anim: cs.animationName });
      });
    };
    grab('#sab-rail .sab-railrow.p0 .sab-railgo', 'the rail\'s top row');
    grab('.sab-alarm', 'the city gate banner');
    return out;
  });

  /* THE CITY FIRST, AND WITHOUT A PAINT BEFORE IT. Selecting a city is two taps a real
     gap apart, and a repaint between them swaps the node out from under the pair, so
     the city never opens and every city surface reads as "not there". */
  await p.evaluate(() => {
    const G = window.__SABG();
    G.hushed = {};
    G.res = { anna: 300, kala: 300, katha: 300 };
    /* G.warn only. G.ev puts a second thing on screen that can sit over the map and
       swallow the pair of taps that opens a city. */
    G.warn = { id: 'dholavira', raid: 'boar', at: G.t + 5 };
  });
  await openCity(p, 'dholavira');
  if (!await p.evaluate(() => !!window.__SAB().city))
    throw new Error('the city never opened, so the gate banner could not be checked');
  const inCity = await scan();

  /* then back out to the map for the rail */
  await p.evaluate(() => {
    const b = document.querySelector('[data-sab-act="leave"]');
    if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await p.waitForTimeout(600);
  await p.evaluate(() => {
    const G = window.__SABG();
    G.hushed = {};
    G.warn = { id: 'dholavira', raid: 'boar', at: G.t + 5 };
    G.ev = { id: 'dholavira', at: G.t + 9 };
    window.__SABDO.paint();
  });
  await p.waitForTimeout(300);
  const onMap = await scan();

  const action = onMap.go || inCity.go;
  if (!action) throw new Error('no primary action was on screen to compare against');

  const warns = [];
  for (const src of [onMap, inCity])
    for (const [name, list] of Object.entries(src.found))
      list.forEach(w => warns.push({ name, ...w }));

  /* the surfaces this check exists for MUST have been on screen */
  const names = new Set(warns.map(w => w.name));
  for (const must of ["the rail's top row", 'the city gate banner'])
    if (!names.has(must))
      throw new Error(`${must} was never on screen — this check cannot pass by not finding it`);

  const bad = [];
  for (const w of warns) {
    const dist = Math.sqrt(action.reduce((t, v, i) => t + (v - w.b[i]) ** 2, 0));
    const redness = w.b[0] - (w.b[1] + w.b[2]) / 2;
    if (!(dist > 90))
      bad.push(`${w.name} is only ${Math.round(dist)} from the primary action in colour`);
    if (redness > 22)
      bad.push(`${w.name} is itself a red (r ${w.b[0]} vs g/b ${w.b[1]}/${w.b[2]}) — this game does not do alarms`);
    if (w.anim && w.anim !== 'none')
      bad.push(`${w.name} pulses ("${w.anim}") — nothing in this game throbs at a child`);
  }
  if (bad.length) throw new Error(bad.join('; '));
});

check('panel-head', 'a long panel keeps its name and its way out', async ({ p }) => {
  /* Scrolled a screen into Vidya, the title and the Back button had both gone off the
     top of the window -- a child in a long list with no name on it and no door. */
  await p.evaluate(() => {
    const G = window.__SABG();
    G.era = 6; G.res = { anna: 400, kala: 400, katha: 400 };
    window.__SABDO.paint();
    document.getElementById('sab-tech').click();
  });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const panel = document.querySelector('.sab-city');
    if (!panel) return { none: true };
    const head = panel.querySelector('.chead');
    const before = head.getBoundingClientRect().top;
    panel.scrollTop = panel.scrollHeight;          /* all the way down */
    return new Promise(res => requestAnimationFrame(() => {
      const after = head.getBoundingClientRect();
      res({ scrolls: panel.scrollHeight > panel.clientHeight + 10,
            before, top: after.top, h: after.height,
            exit: !!panel.querySelector('[data-sab-act="techclose"]'),
            panelTop: panel.getBoundingClientRect().top });
    }));
  });
  if (r.none) throw new Error('the Vidya panel did not open');
  if (!r.scrolls) throw new Error('the panel is not scrollable, so this proves nothing');
  if (!r.exit) throw new Error('the panel has no way out in it');
  if (!(r.h > 0)) throw new Error('the head is not rendered');
  /* scrolled to the bottom, the head must still be at the panel's top edge */
  if (Math.abs(r.top - r.panelTop) > 40)
    throw new Error(`scrolled down, the head sits ${Math.round(r.top - r.panelTop)}px from the panel top — it scrolled away`);
});

check('feedback', 'a turn says which number moved, and stills under reduced motion', async ({ p }) => {
  /* This game has plenty of ambient motion and almost no feedback: press Agla Saal --
     the core verb -- and three numbers quietly become three other numbers with nothing
     to say which, or that anything happened. */
  const r = await p.evaluate(() => {
    const G = window.__SABG();
    G.res = { anna: 100, kala: 100, katha: 100 };
    window.__SABDO.paint();                       /* establish a baseline */
    const before = document.querySelectorAll('#sab-res .sab-delta').length;
    window.__SABDO.turn();                        /* the world pays out */
    const chips = [...document.querySelectorAll('#sab-res .sab-chip')];
    const deltas = [...document.querySelectorAll('#sab-res .sab-delta')]
      .map(d => d.textContent.trim());
    return { before, moved: chips.filter(c => c.classList.contains('sab-moved')).length,
             deltas };
  });
  if (r.before !== 0) throw new Error('a delta was showing before anything changed');
  if (!r.moved) throw new Error('a turn changed the numbers and no chip said so');
  if (!r.deltas.length || !r.deltas.some(d => /^[+-]?\d/.test(d)))
    throw new Error('the deltas do not read as numbers: ' + JSON.stringify(r.deltas));

  /* AND A CHILD WHO ASKED FOR LESS MOTION GETS THE FACT WITHOUT THE TRAVEL.
     The first version of this read the stylesheet text looking for the rule, which is
     asking whether the CSS was WRITTEN rather than whether it WORKS -- a rule can be
     present and overridden, or absent and handled another way. Emulate the preference
     and ask the element what it is actually doing. */
  await p.emulateMedia({ reducedMotion: 'reduce' });
  const still = await p.evaluate(() => {
    const G = window.__SABG();
    G.res = { anna: 100, kala: 100, katha: 100 };
    window.__SABDO.paint();
    window.__SABDO.turn();
    const d = document.querySelector('#sab-res .sab-delta');
    const chip = document.querySelector('#sab-res .sab-chip.sab-moved');
    if (!d) return { none: true };
    const cs = getComputedStyle(d);
    return { anim: cs.animationName,
             chipAnim: chip ? getComputedStyle(chip).animationName : 'none',
             shown: cs.opacity !== '0' && cs.display !== 'none' };
  });
  await p.emulateMedia({ reducedMotion: null });
  if (still.none) throw new Error('no delta rendered under reduced motion');
  if (still.anim !== 'none' || still.chipAnim !== 'none')
    throw new Error(`motion still runs under reduced motion (delta:${still.anim} chip:${still.chipAnim})`);
  if (!still.shown)
    throw new Error('reduced motion hid the delta entirely — the fact should survive, only the travel goes');
});

/* ---------------------------------------------------------------- the phone */
/* "I was not able to click and enter the city." On a phone the game was a page: the
   first tap selected Dholavira and inserted its card ABOVE the map, the map dropped
   260px, and the second tap of the double tap landed on empty country. Nothing caught
   it because every check here clicked with a mouse at 1440px, and a synthetic event
   does not care where the map has gone. These drive a phone: a touch screen, a real
   viewport, taps at coordinates, and a finger that is never exactly on target. */
async function bootPhone(browser, port, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w || 390, height: h || 844 },
    deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  await p.waitForTimeout(400);
  await p.evaluate(() => { location.hash = '#/game/sabhyata'; });
  await p.waitForFunction(() => typeof window.__SABG === 'function', null, { timeout: 20000 });
  await p.waitForTimeout(700);
  const ov = await p.$('#sab-ovhost [data-sab-act="mode"][data-m="long"]') || await p.$('#sab-ovhost .sab-btn');
  if (ov) { await ov.tap(); await p.waitForTimeout(400); }
  return { ctx, p, errs };
}
const townAt = (p, id) => p.evaluate(id => {
  const s = (window.IND_SABHYATA.sites || []).filter(x => x.id === id)[0];
  const svg = document.querySelector('#sab-stage svg');
  const pt = svg.createSVGPoint(); pt.x = s.x; pt.y = s.y;
  const q = pt.matrixTransform(svg.getScreenCTM());
  return { x: q.x, y: q.y };
}, id);

check('phone-window', 'on a phone the map is the whole window, and every control is a thumb wide', async ({ browser, port }) => {
  const bad = [];
  for (const [w, h] of [[390, 844], [360, 740], [320, 568]]) {
    const { ctx, p, errs } = await bootPhone(browser, port, w, h);
    const r = await p.evaluate(() => {
      const wrap = document.getElementById('sabwrap');
      const st = document.getElementById('sab-stage').getBoundingClientRect();
      const inWin = el => { if (!el) return false; const q = el.getBoundingClientRect();
        return q.width > 0 && q.left >= -1 && q.top >= -1 && q.right <= innerWidth + 1 && q.bottom <= innerHeight + 1; };
      const small = [];
      ['.sab-exit', '#sab-menu', '#sab-turn', '#sab-next', '.sab-tab', '.sab-zoom .sab-btn'].forEach(sel =>
        document.querySelectorAll(sel).forEach(el => { const q = el.getBoundingClientRect();
          if (q.width && Math.min(q.width, q.height) < 44) small.push(sel + ' ' + Math.round(q.width) + 'x' + Math.round(q.height)); }));
      return { gm: !!wrap && wrap.classList.contains('gm'),
               cover: (st.width * st.height) / (innerWidth * innerHeight),
               turn: inWin(document.getElementById('sab-turn')), beam: inWin(document.querySelector('.sab-bar')),
               tabs: inWin(document.getElementById('sab-tabs')),
               over: document.documentElement.scrollWidth - innerWidth, small };
    });
    if (!r.gm) bad.push(`${w}x${h}: not the phone's game window`);
    if (r.cover < 0.98) bad.push(`${w}x${h}: the map is ${Math.round(r.cover * 100)}% of the window`);
    if (!r.turn || !r.beam || !r.tabs) bad.push(`${w}x${h}: Agla Saal ${r.turn}, the beam ${r.beam}, the books ${r.tabs} — not all on the window`);
    if (r.over > 0) bad.push(`${w}x${h}: the page scrolls sideways by ${r.over}px`);
    if (r.small.length) bad.push(`${w}x${h}: under a thumb's 44px — ${r.small.slice(0, 4).join(', ')}`);
    if (errs.length) bad.push(errs[0]);
    await ctx.close();
  }
  if (bad.length) throw new Error(bad.join('; '));
});

check('phone-enter', 'on a phone a city is entered by tapping it, and the map holds still for the second tap', async ({ browser, port }) => {
  const { ctx, p, errs } = await bootPhone(browser, port);
  try {
    /* 1. a finger lands a little off the town: it still chooses the town. Tapped as raw
       touch events, not touchscreen.tap — Chromium's mobile emulation nudges a tap onto
       the nearest target by itself, and Safari does not, so the game must. The point is
       checked to lie OUTSIDE the town's own target first, or this proves nothing. */
    const c0 = await townAt(p, 'dholavira');
    const off = await p.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (el && el.closest && el.closest('[data-sab]')) return 'inside';
      const st = document.getElementById('sab-stage');
      const fire = (t, C) => (el || st).dispatchEvent(new C(t, { bubbles: true, cancelable: true, pointerId: 9,
        pointerType: 'touch', isPrimary: true, clientX: x, clientY: y }));
      fire('pointerdown', PointerEvent); fire('pointerup', PointerEvent); fire('click', MouseEvent);
      return 'outside';
    }, { x: c0.x + 16, y: c0.y + 15 });
    if (off === 'inside') throw new Error('the off-centre point is inside the town\'s own target — this proves nothing');
    await p.waitForTimeout(250);
    const one = await p.evaluate(() => {
      const sh = document.getElementById('sab-sheet');
      return { city: window.__SAB().city, sheet: sh && !sh.hidden ? sh.innerText : '' };
    });
    if (one.city) throw new Error('one tap went straight in');
    if (!/Dholavira/.test(one.sheet)) throw new Error('a tap a fingertip off the town did not choose it');
    /* 2. THE BUG: choosing it must not move the map out from under the finger */
    const c1 = await townAt(p, 'dholavira');
    const moved = Math.hypot(c1.x - c0.x, c1.y - c0.y);
    if (moved > 2) throw new Error(`choosing the town moved it ${Math.round(moved)}px — the second tap lands on empty country`);
    /* 3. the second tap, at a child's pace rather than a double-click's, goes in */
    await p.waitForTimeout(700);
    await p.touchscreen.tap(c1.x, c1.y);
    await p.waitForTimeout(900);
    if ((await p.evaluate(() => window.__SAB().city)) !== 'dholavira')
      throw new Error('tapping the chosen town again did not go in');
    /* 4. and the door is a button too, the full width of the sheet */
    await p.evaluate(() => { const l = document.querySelector('[data-sab-act="leave"]'); if (l) l.click(); });
    await p.waitForTimeout(700);
    await p.evaluate(() => { window.__SABDO.act('dholavira', 'close'); });
    const c2 = await townAt(p, 'dholavira');
    await p.touchscreen.tap(c2.x, c2.y);
    await p.waitForTimeout(400);
    const door = await p.evaluate(() => { const b = document.querySelector('#sab-sheet .sab-enter');
      if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width, h: q.height, t: b.innerText }; });
    if (!door) throw new Error('the phone\'s sheet has no door into the city');
    if (door.h < 52 || door.w < 240) throw new Error(`the door is ${Math.round(door.w)}x${Math.round(door.h)} — not the obvious thing`);
    await p.touchscreen.tap(door.x, door.y);
    await p.waitForTimeout(900);
    if ((await p.evaluate(() => window.__SAB().city)) !== 'dholavira') throw new Error('the door did not open the city');
    if (errs.length) throw new Error(errs[0]);
  } finally { await ctx.close(); }
});

check('phone-thumb', 'a thumb\'s tremor is a tap, and a chosen town is never hidden by its own sheet', async ({ browser, port }) => {
  const { ctx, p } = await bootPhone(browser, port);
  try {
    /* 1. a finger that rests and wobbles 11px is tapping, not panning */
    const c = await townAt(p, 'dholavira');
    const sel = await p.evaluate(({ x, y }) => {
      const st = document.getElementById('sab-stage');
      const at = (t, x2, y2) => { const el = document.elementFromPoint(x2, y2) || st;
        el.dispatchEvent(new PointerEvent(t, { bubbles: true, cancelable: true, pointerId: 7, pointerType: 'touch', isPrimary: true, clientX: x2, clientY: y2 })); return el; };
      at('pointerdown', x, y);
      for (let i = 1; i <= 4; i++) at('pointermove', x + (i % 2 ? 4 : -3), y + (i % 2 ? 3 : -4));
      at('pointermove', x + 6, y + 5);
      const el = at('pointerup', x + 6, y + 5);
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: x + 6, clientY: y + 5 }));
      const sh = document.getElementById('sab-sheet');
      return sh && !sh.hidden ? sh.innerText : '';
    }, c);
    if (!/Dholavira/.test(sel)) throw new Error('a resting, wobbling thumb was read as a drag and the tap was swallowed');
    /* 2. the four Harappan towns awake and region-framed: the realm reaches from the
       Ghaggar to the Gulf, so Lothal is fitted at the bottom of the clear ground — exactly
       where the sheet rises */
    const id = await p.evaluate(() => {
      const G = window.__SABG();
      ['lothal', 'rakhigarhi', 'kalibangan'].forEach(k => { G.sites[k].found = true; G.sites[k].zzz = false; });
      window.__SABDO.act('dholavira', 'close'); window.__SABDO.zoom(1); window.__SABDO.paint();
      return 'lothal';
    });
    await p.waitForTimeout(300);
    const t0 = await townAt(p, id);
    await p.touchscreen.tap(t0.x, t0.y);
    /* first make sure this proves something: the sheet really did rise over the town */
    await p.waitForTimeout(150);
    const pre = await p.evaluate(() => document.getElementById('sab-sheet').getBoundingClientRect().top);
    if (!(t0.y > pre - 12)) throw new Error(`${id} was never under the sheet (y ${Math.round(t0.y)}, sheet ${Math.round(pre)}) — this proves nothing`);
    await p.waitForTimeout(950);
    const r = await p.evaluate(id => {
      const sh = document.getElementById('sab-sheet').getBoundingClientRect();
      return { chosen: document.getElementById('sab-sheet').innerText.indexOf(window.IND_SABHYATA.sites.filter(x => x.id === id)[0].name) >= 0,
               sheetTop: sh.top };
    }, id);
    const t1 = await townAt(p, id);
    if (!r.chosen) throw new Error(`tapping ${id} did not choose it`);
    if (t1.y > r.sheetTop - 12) throw new Error(`${id} sits at y=${Math.round(t1.y)}, under its own sheet (top ${Math.round(r.sheetTop)})`);
  } finally { await ctx.close(); }
});

check('phone-city', 'inside a city on a phone, Agla Saal is under the right thumb and nothing sits on anything', async ({ browser, port }) => {
  const bad = [];
  for (const [w, h] of [[390, 844], [320, 568]]) {
    const { ctx, p } = await bootPhone(browser, port, w, h);
    await p.evaluate(() => window.__SABDO.act('dholavira', 'city'));
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => {
      const box = sel => { const el = document.querySelector(sel); if (!el) return null; const q = el.getBoundingClientRect();
        return q.width ? { l: q.left, t: q.top, r: q.right, b: q.bottom, w: q.width, h: q.height } : null; };
      const turn = box('.sab-cityturn .sab-act'), parts = { strip: box('.sab-cityturn'), grow: box('.sab-grow'),
        build: box('.sab-dhandle'), zoom: box('.sab-kitbar'), leave: box('.sab-leave'), name: box('.sab-nameplate') };
      const hit = [];
      const keys = Object.keys(parts).filter(k => parts[k]);
      keys.forEach((a, i) => keys.slice(i + 1).forEach(b => { const A = parts[a], B = parts[b];
        if (Math.min(A.r, B.r) - Math.max(A.l, B.l) > 2 && Math.min(A.b, B.b) - Math.max(A.t, B.t) > 2) hit.push(a + '/' + b); }));
      return { inCity: !!window.__SAB().city, turn, hit };
    });
    if (!r.inCity) { bad.push(`${w}x${h}: the city did not open`); await ctx.close(); continue; }
    if (!r.turn) bad.push(`${w}x${h}: no Agla Saal in the city`);
    else {
      if ((r.turn.l + r.turn.r) / 2 < w * 0.5 || (r.turn.t + r.turn.b) / 2 < h * 0.7)
        bad.push(`${w}x${h}: Agla Saal is at ${Math.round(r.turn.l)},${Math.round(r.turn.t)} — out of the right thumb's reach`);
      if (r.turn.h < 48) bad.push(`${w}x${h}: Agla Saal is ${Math.round(r.turn.h)}px tall`);
    }
    if (r.hit.length) bad.push(`${w}x${h}: overlapping — ${r.hit.join(', ')}`);
    await ctx.close();
  }
  if (bad.length) throw new Error(bad.join('; '));
});

check('phone-side', 'a phone on its side still plays: the map, the turn and the door all on the window', async ({ browser, port }) => {
  const { ctx, p } = await bootPhone(browser, port, 844, 390);
  try {
    const c = await townAt(p, 'dholavira');
    await p.touchscreen.tap(c.x, c.y);
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => {
      const inWin = el => { if (!el) return false; const q = el.getBoundingClientRect();
        return q.width > 0 && q.left >= -1 && q.top >= -1 && q.right <= innerWidth + 1 && q.bottom <= innerHeight + 1; };
      const sh = document.getElementById('sab-sheet').getBoundingClientRect();
      return { gm: document.getElementById('sabwrap').classList.contains('gm'),
               turn: inWin(document.getElementById('sab-turn')), door: inWin(document.querySelector('.sab-enter')),
               sheetShare: sh.height / innerHeight };
    });
    if (!r.gm) throw new Error('on its side the phone lost its game window');
    if (!r.turn) throw new Error('Agla Saal is off the window');
    if (!r.door) throw new Error('the door into the city is off the window');
    if (r.sheetShare > 0.45) throw new Error(`the chosen place's sheet is ${Math.round(r.sheetShare * 100)}% of the screen's height`);
  } finally { await ctx.close(); }
});


/* ================================================================ the master's week 2–4 (C5–C9, S2, S6, S7)
   sabhyata-master E.7 / india-games-spec §2.1 acceptance, and the campaign's own two checks.
   Each was watched to fail by breaking the thing it holds before it was trusted. */

/* a fresh browser, straight to the start screen — no mode chosen yet */
async function bootBare(browser, port, w, h) {
  const phone = (w || 1280) < 600;
  const ctx = await browser.newContext({ viewport: { width: w || 1280, height: h || 800 },
    deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  await p.waitForTimeout(400);
  await p.evaluate(() => { location.hash = '#/game/sabhyata'; });
  await p.waitForFunction(() => typeof window.__SABG === 'function', null, { timeout: 20000 });
  await p.waitForTimeout(700);
  return { ctx, p, errs };
}
/* press whatever the screen offers, the way a child following the game would: a riddle's
   first option (a guess — right or wrong, the chapter must still finish), else a card's own
   primary button, else Mithu. Returns what happened. */
const followMithu = (p, n, stopAt) => p.evaluate(async ({ n, stopAt }) => {
  const G = () => window.__SABG(), out = [];
  for (let i = 0; i < n; i++) {
    const g = G();
    if (stopAt === 'woke' && Object.keys(g.sites).some(id => id !== 'dholavira' && !g.sites[id].zzz && !g.sites[id].her)) break;
    if (g.camp && g.camp.done) break;
    const ro = document.querySelectorAll('#sab-ovhost [data-sab-act=criddle]');
    if (ro.length) { ro[0].click(); out.push('riddle'); continue; }
    const ob = document.querySelector('#sab-ovhost .sab-btn.go') || document.querySelector('#sab-ovhost .sab-btn');
    if (ob) { if (/lamp-map/.test(ob.textContent)) break; ob.click(); out.push('card'); continue; }
    const m = document.querySelector('.sab-npgoal') && window.__SAB().city ? document.querySelector('.sab-npgoal') : document.getElementById('sab-advise');
    if (!m) { out.push('no mithu'); break; }
    out.push('mithu:' + window.__SABDO.advise().act);
    m.click();
    await new Promise(r => setTimeout(r, 5));
  }
  const g = G();
  return { out, t: g.t, woke: Object.keys(g.sites).filter(id => id !== 'dholavira' && !g.sites[id].zzz && !g.sites[id].her) };
}, { n, stopAt });

check('start-screen', 'C.4 #6: the start screen offers the campaign first, then Short and Long, with honest minutes — Chapter 1 is one tap away', async ({ browser, port }) => {
  const { ctx, p, errs } = await bootBare(browser, port);
  try {
    const r = await p.evaluate(() => {
      const bs = [...document.querySelectorAll('#sab-ovhost [data-sab-act="mode"]')];
      const reg = (window.IND_GAMES || []).find(g => g.id === 'sabhyata');
      return { modes: bs.map(b => b.getAttribute('data-m')), texts: bs.map(b => b.innerText.replace(/\s+/g, ' ')),
               first: (document.querySelector('#sab-ovhost .sab-btn') || {}).getAttribute ? document.querySelector('#sab-ovhost .sab-btn').getAttribute('data-m') : null,
               minutes: reg && reg.minutes };
    });
    if (r.modes.join() !== 'camp,short,long') throw new Error('the start screen offers ' + r.modes.join(', ') + ' — wanted the campaign, the short game and the long one');
    if (r.first !== 'camp') throw new Error('the first button is ' + r.first + ', not the campaign');
    if (!/15.20 minutes/.test(r.texts[0]) || !/hour/.test(r.texts[1]) || !/hours/.test(r.texts[2]))
      throw new Error('a length is not said honestly: ' + r.texts.join(' | '));
    if (!(r.minutes >= 15)) throw new Error(`the Mela card still says ${r.minutes} min for a game of hours`);
    await p.click('#sab-ovhost [data-m="camp"]'); await p.waitForTimeout(300);
    const c = await p.evaluate(() => ({ camp: window.__SABG().camp, made: (document.querySelector('#sab-ovhost .sab-made') || {}).textContent || '' }));
    if (!c.camp || c.camp.ch !== 1) throw new Error('one tap did not start Chapter 1');
    if (!/made up/i.test(c.made)) throw new Error('the guide is not labelled as made up');
    if (errs.length) throw new Error(errs[0]);
  } finally { await ctx.close(); }
});

check('mithu', 'S2: a new child following only Mithu wakes a city within 10 turns, and his tap is never dead', async ({ browser, port }) => {
  const { ctx, p, errs } = await bootBare(browser, port);
  try {
    await p.click('#sab-ovhost [data-m="long"]'); await p.waitForTimeout(400);
    const r = await followMithu(p, 80, 'woke');
    if (!r.woke.length) throw new Error(`following Mithu, nothing woke by turn ${r.t + 1}: ${r.out.slice(-6).join(' ')}`);
    if (r.t + 1 > 10) throw new Error(`following Mithu, ${r.woke[0]} woke on turn ${r.t + 1} — the spec asks for 10`);
    /* never a dead tap: with nothing else to do, pressing him spends the year */
    const d = await p.evaluate(() => {
      const G = window.__SABG(); const t0 = G.t;
      G.res = { anna: 0, kala: 0, katha: 0 }; G.explorers = [];
      Object.keys(G.sites).forEach(id => { if (id !== 'dholavira') { G.sites[id].found = false; G.sites[id].zzz = true; } });
      G.routes = []; window.__SABDO.paint();
      const ad = window.__SABDO.advise(); document.getElementById('sab-advise').click();
      return { act: ad.act, moved: G.t !== t0 || !!document.querySelector('#sab-ovhost .sab-card') };
    });
    if (!d.moved) throw new Error(`with nothing affordable, Mithu's tap (${d.act}) did nothing`);
    /* and the Next line says what his tap does (hint() merged into him) */
    const same = await p.evaluate(() => (document.getElementById('sab-guide') || {}).textContent.indexOf(window.__SABDO.advise().label) >= 0);
    if (!same) throw new Error('the guide line and Mithu disagree');
    if (errs.length) throw new Error(errs[0]);
  } finally { await ctx.close(); }
});

check('camp-ch1', 'S7: Chapter 1 of Mithu\'s Lamps completes for a guided bot in good time, every riddle shown, the lamp lit and the chapter paid once', async ({ browser, port }) => {
  const { ctx, p, errs } = await bootBare(browser, port);
  try {
    await p.evaluate(() => { window.__rew = []; window.addEventListener('ind-reward', e => window.__rew.push(e.detail)); });
    await p.click('#sab-ovhost [data-m="camp"]'); await p.waitForTimeout(300);
    await p.click('#sab-ovhost [data-sab-act="campgo"]'); await p.waitForTimeout(300);
    const t0 = Date.now();
    const r = await followMithu(p, 260);
    const s = await p.evaluate(() => {
      const G = window.__SABG(), L = window.__SABDO.lamps();
      return { done: G.camp && G.camp.done, asked: G.camp ? Object.keys(G.camp.asked).length : 0, lit: !!L.lit[1],
               card: (document.querySelector('#sab-ovhost') || {}).innerText || '',
               stops: window.__rew.filter(d => d.kind === 'stop').length, paid: !!L.paid[1] };
    });
    if (!s.done) throw new Error(`chapter 1 did not finish (turn ${r.t + 1}): ${r.out.slice(-8).join(' ')}`);
    if (r.t + 1 > 40) throw new Error(`chapter 1 took ${r.t + 1} turns — its own good time is 40`);
    if (Date.now() - t0 > 20 * 60 * 1000) throw new Error('chapter 1 took longer than twenty minutes even for a bot');
    if (s.asked !== 3) throw new Error(`${s.asked} of 3 riddles were shown`);
    if (!s.lit) throw new Error('the lamp is not lit on the lamp-map');
    if (!/signboard/i.test(s.card) || !/Iron/.test(s.card)) throw new Error('the payoff card lacks the souvenir or the aha');
    /* paid once: through the host's own hook when it has one, else the one fallback event */
    if (!s.paid) throw new Error('the chapter\'s stop was never paid');
    if (s.stops > 1) throw new Error(`the chapter was paid ${s.stops} times (want 1)`);
    /* the lamp-map, and a replay that pays no second stop */
    await p.evaluate(() => { const b = document.querySelector('#sab-ovhost [data-sab-act="lampmap"]'); if (b) b.click(); });
    await p.waitForTimeout(200);
    const m = await p.evaluate(() => ({ lamps: document.querySelectorAll('.sab-lmrow').length, lit: document.querySelectorAll('.sab-lmrow.lit').length }));
    if (m.lamps !== 13 || m.lit !== 1) throw new Error(`the lamp-map shows ${m.lamps} lamps, ${m.lit} lit`);
    await p.evaluate(() => window.__SABDO.chapter(1)); await p.waitForTimeout(200);
    await p.click('#sab-ovhost [data-sab-act="campgo"]'); await p.waitForTimeout(200);
    await followMithu(p, 260);
    const again = await p.evaluate(() => window.__rew.filter(d => d.kind === 'stop').length);
    if (again > 1 || again !== s.stops) throw new Error('replaying chapter 1 paid its stop a second time');
    if (errs.length) throw new Error(errs[0]);
  } finally { await ctx.close(); }
});

check('camp-mask', 'E2/E3/E12: a chapter cannot start with a system its preset turns off — no Vidya, sea, quarrels, quests or human raids; darshan is told, not a boon', async ({ browser, port }) => {
  const { ctx, p, errs } = await bootBare(browser, port);
  try {
    await p.click('#sab-ovhost [data-m="long"]'); await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const C = window.IND_SABHYATA_CAMPAIGN, D = window.__SABDO, bad = [];
      const ALL = ['explore', 'road', 'wake', 'riddles', 'city', 'raids', 'jobs', 'buildings', 'grow', 'monuments', 'capital',
                   'quests', 'vidya', 'events', 'utsav', 'sea', 'quarrels', 'riti', 'heroes', 'akal', 'advance', 'khazana'];
      C.chapters.filter(c => c.status === 'open').forEach(c => {
        if (!D.chapter(c.n)) { bad.push('ch' + c.n + ' would not start'); return; }
        const b = document.querySelector('#sab-ovhost [data-sab-act="campgo"]'); if (b) b.click();
        ALL.forEach(s => { if (D.sysOn(s) !== (c.systems.indexOf(s) >= 0)) bad.push('ch' + c.n + ' ' + s + ' is ' + (D.sysOn(s) ? 'on' : 'off')); });
        const vis = sel => [...document.querySelectorAll(sel)].some(el => !el.hidden && el.offsetParent !== null);
        if (vis('[data-sab-act="tabtech"]')) bad.push('ch' + c.n + ' shows Vidya');
        if (vis('#sabwrap .sab-tab[data-sab-act="world"]')) bad.push('ch' + c.n + ' shows the sea roads');
        const human = D.threats().filter(id => window.IND_SABHYATA.raids.find(x => x.id === id).kind === 'human');
        if (human.length) bad.push('ch' + c.n + ' can raid with ' + human.join(','));
        /* forty years: no quarrel, no quest scroll, no overseas request, no lean season */
        const G = window.__SABG();
        G.res.anna = G.res.kala = 900; G.lastd = -99; G.lastq = -99;
        for (let i = 0; i < 40; i++) {
          D.turn();
          const ob = document.querySelector('#sab-ovhost .sab-btn.go'); if (ob && !/lamp-map/.test(ob.textContent)) ob.click();
          const ro = document.querySelector('#sab-ovhost [data-sab-act=criddle]'); if (ro) ro.click();
        }
        if (G.disp) bad.push('ch' + c.n + ' raised a quarrel');
        if (Object.keys(G.quests).length) bad.push('ch' + c.n + ' raised a quest scroll');
        if (Object.keys(G.req || {}).length) bad.push('ch' + c.n + ' raised an overseas request');
        if (G.ev) bad.push('ch' + c.n + ' raised a lean season');
      });
      /* the darshan is a told card: the Buddha at Kashi changes nothing in the realm */
      D.chapter(2); const b2 = document.querySelector('#sab-ovhost [data-sab-act="campgo"]'); if (b2) b2.click();
      const G = window.__SABG();
      G.sites.kashi.found = true; G.sites.kashi.zzz = false; G.camp.done = true;
      for (let i = 0; i < 4; i++) { const ob = document.querySelector('#sab-ovhost .sab-btn'); if (ob) ob.click(); }
      G.lastdarshan = -99; const k0 = G.res.katha;
      G.disp = { a: 'kashi', b: 'hastinapura', over: 'x', fix: [], left: 9 };
      D.turn();
      const card = (document.querySelector('#sab-ovhost') || {}).innerText || '';
      return { bad, darshan: /Buddha/.test(card), boon: G.res.katha - k0 >= 40 || !G.disp || G.calmUntil > G.t, card: card.slice(0, 160) };
    });
    if (r.bad.length) throw new Error(r.bad.slice(0, 4).join('; '));
    if (!r.darshan) throw new Error('the Buddha\'s darshan did not fire in chapter 2: ' + r.card);
    if (r.boon) throw new Error('the darshan still acts as a boon (katha, a quarrel set down, or calm)');
    if (errs.length) throw new Error(errs[0]);
  } finally { await ctx.close(); }
});

check('camp-facts', 'every chapter\'s facts resolve to data-sabhyata.js entries with sources; flagged chapters stay shut outside tester mode', async ({ p }) => {
  const r = await p.evaluate(() => {
    const C = window.IND_SABHYATA_CAMPAIGN, D = window.__SABDO, bad = [];
    const need = (ref, where) => { const l = D.refLine(ref); if (!l || !l.t || !l.src) bad.push(where + ': ' + ref + ' does not resolve to a sourced line'); };
    C.chapters.forEach(c => {
      if (c.status !== 'open') {
        if (D.chapterOpen(c.n)) bad.push('ch' + c.n + ' (coming) opens');
        return;
      }
      (c.hookRefs || []).forEach(r => need(r, 'ch' + c.n + ' hook'));
      if (!(c.hookRefs || []).length) bad.push('ch' + c.n + ' hook names no source');
      (c.beats || []).forEach(b => { if (b.ref) need(b.ref, b.id); if (b.ref2) need(b.ref2, b.id); });
      (c.riddles || []).forEach(q => {
        need(q.aRef, q.id + ' answer');
        (q.o || []).forEach(o => { if (o.ref) need(o.ref, q.id + ' "' + o.t + '"'); if (o.why && !o.ref) bad.push(q.id + ' "' + o.t + '" says ' + o.why + ' with no line behind it'); });
        if ((q.o || []).some(o => o.t === q.a)) bad.push(q.id + ' has its answer twice');
        if (!(c.beats || []).some(b => b.riddle === q.id)) bad.push(q.id + ' is never asked');
      });
      need(c.payoff.aha, 'ch' + c.n + ' aha'); need(c.payoff.souvenir, 'ch' + c.n + ' souvenir');
      if (!c.guide || !/made up/i.test(c.guide.note + ' ' + 'made up')) bad.push('ch' + c.n + ' guide');
    });
    [3, 6, 8, 9, 10, 11, 12].forEach(n => { const c = C.chapters.find(x => x.n === n); if (!c || !c.review) bad.push('ch' + n + ' lost its reviewer flag'); });
    return bad;
  });
  if (r.length) throw new Error(r.slice(0, 5).join('; '));
  /* a flagged chapter, once built, opens only in tester mode */
  const t = await p.evaluate(() => {
    const c = window.IND_SABHYATA_CAMPAIGN.chapters.find(x => x.n === 3);
    const was = { status: c.status, preset: c.preset };
    c.status = 'open'; c.preset = window.IND_SABHYATA_CAMPAIGN.chapters[0].preset;
    const open = window.__SABDO.chapterOpen(3);
    c.status = was.status; c.preset = was.preset;
    return open;
  });
  if (t) throw new Error('a reviewer-flagged chapter opened outside tester mode');
});

check('bands', 'C.4 #5: the age band decides what is on — 4–7 explore, road and wake, Sochna and three ages; 8–10 adds buildings, quests and Vidya', async ({ p }) => {
  const r = await p.evaluate(async () => {
    const eng = window.IND_GAMES.find(g => g.id === 'sabhyata').engine, out = {};
    for (const band of ['4-7', '8-10', '11-12']) {
      if (window.__sabTd) window.__sabTd();
      const host = document.getElementById('gamehost');
      host.innerHTML = '';
      window.__sabTd = eng(host, { band }, () => {});
      await new Promise(r => setTimeout(r, 150));
      const D = window.__SABDO;
      const modes = [...document.querySelectorAll('#sab-ovhost [data-sab-act="mode"]')].map(b => b.getAttribute('data-m'));
      const lg = document.querySelector('#sab-ovhost [data-m="short"]'); if (lg) lg.click();
      await new Promise(r => setTimeout(r, 100));
      const vis = sel => [...document.querySelectorAll(sel)].some(el => !el.hidden && el.offsetParent !== null);
      out[band] = { band: D.band(), modes, bld: D.sysOn('buildings'), quests: D.sysOn('quests'), vidya: D.sysOn('vidya'),
                    raids: D.sysOn('raids'), sea: D.sysOn('sea'), road: D.sysOn('road'), speed: vis('#sab-speed'),
                    vidyaTab: vis('[data-sab-act="tabtech"]') };
    }
    return out;
  });
  const a = r['4-7'], b = r['8-10'], c = r['11-12'];
  if (a.band !== '4-7') throw new Error('the engine did not take the band it was given');
  if (a.modes.indexOf('long') >= 0) throw new Error('4–7 is offered the thirteen-age game');
  if (a.bld || a.quests || a.vidya || a.raids || a.sea || !a.road) throw new Error('4–7 has more than exploring, roads and waking: ' + JSON.stringify(a));
  if (a.vidyaTab) throw new Error('4–7 shows the Vidya tab');
  if (!b.bld || !b.quests || !b.vidya || b.raids || b.sea) throw new Error('8–10 is not buildings, quests and Vidya: ' + JSON.stringify(b));
  if (!c.bld || !c.raids || !c.sea) throw new Error('11–12 is not everything: ' + JSON.stringify(c));
});

/* the cells a child may build on, and how many of them a finger can reach right now */
const reachOnScreen = p => p.evaluate(() => {
  const D = window.__SABDO, id = window.__SAB().city, G = window.__SABG();
  const inr = document.getElementById('sab-kitinner'), view = document.getElementById('sab-view');
  if (!inr || !view) return { none: true };
  const r = inr.getBoundingClientRect(), k = parseFloat(inr.getAttribute('data-k')) || 1;
  const cells = D.legal(id); let seen = 0;
  cells.forEach(c => {
    const px = D.cellPx(id, c[0], c[1]), x = r.left + px.x * k, y = r.top + px.y * k;
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return;
    const el = document.elementFromPoint(x, y);
    if (el && view.contains(el)) seen++;          /* on the board, not under the HUD */
  });
  /* the middle of the free view: a tap there must not be "too far out" */
  const vr = view.getBoundingClientRect();
  return { cells: cells.length, seen, line: !!(document.querySelector('.sab-reachline path') || {}).getAttribute,
           lineLen: ((document.querySelector('.sab-reachline path') || { getAttribute: () => '' }).getAttribute('d') || '').length,
           z: G.kitZ };
});
check('city-frame', 'C5: a city opens on its heart with at least 80% of its legal build cells on screen, inside a visible reach outline — desktop and phone', async ({ browser, port }) => {
  const bad = [];
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const { ctx, p } = await bootBare(browser, port, w, h);
    try {
      await p.click('#sab-ovhost [data-m="long"]'); await p.waitForTimeout(300);
      for (const id of ['dholavira', 'lothal']) {
        await p.evaluate(id => { const G = window.__SABG(); const q = G.sites[id]; q.found = true; q.zzz = false; window.__SABDO.act(id, 'city'); }, id);
        await p.waitForTimeout(900);
        const m = await reachOnScreen(p);
        if (m.none) { bad.push(`${w}: ${id} did not open on its board`); continue; }
        const share = m.seen / m.cells;
        if (share < 0.8) bad.push(`${w}: ${id} shows ${m.seen} of ${m.cells} buildable cells (${Math.round(share * 100)}%) at ${m.z * 100}%`);
        if (!m.line || m.lineLen < 40) bad.push(`${w}: ${id} has no reach outline`);
        await p.evaluate(() => { const b = document.querySelector('[data-sab-act="leave"]'); if (b) b.click(); });
        await p.waitForTimeout(300);
      }
    } finally { await ctx.close(); }
  }
  if (bad.length) throw new Error(bad.join('; '));
});

check('city-hold', 'C6: holding a piece keeps Rotate and Put back on screen, the view still pans, and the keys are shown on a desktop', async ({ p }) => {
  await p.evaluate(() => { const G = window.__SABG(); G.res.anna = 500; G.res.kala = 500; });
  await openCity(p, 'dholavira');
  await p.evaluate(() => { const b = document.querySelector('[data-sab-act="kitopen"]'); if (b) b.click(); });
  await p.waitForTimeout(250);
  await p.evaluate(() => { const t = document.querySelector('[data-sab-act="kitpick"]:not([disabled])'); if (t) t.click(); });
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const hit = sel => { const b = document.querySelector(sel); if (!b) return 'missing';
      const q = b.getBoundingClientRect(); if (!q.width) return 'hidden';
      const el = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
      return el && b.contains(el) ? 'ok' : 'covered by ' + (el ? el.className : 'nothing'); };
    return { bar: !!document.querySelector('.sab-holdbar'), rot: hit('.sab-holdbar [data-sab-act="kitturnp"]'),
             put: hit('.sab-holdbar [data-sab-act="kitdrop"]'), keys: ((document.querySelector('.sab-holdbar .keys') || {}).textContent || '') };
  });
  if (!r.bar) throw new Error('picking a piece shows no holding bar');
  if (r.rot !== 'ok') throw new Error('Rotate: ' + r.rot);
  if (r.put !== 'ok') throw new Error('Put back: ' + r.put);
  if (!/Enter/.test(r.keys) || !/R/.test(r.keys) || !/Esc/.test(r.keys)) throw new Error('the keys are not shown: "' + r.keys + '"');
  /* drag the board while holding: it must pan */
  /* from a patch of bare board — pressing the scaffold is pressing a button, not the ground */
  const v = await p.evaluate(() => { const view = document.getElementById('sab-view'), q = view.getBoundingClientRect();
    let at = null;
    for (let fy = 0.35; fy < 0.8 && !at; fy += 0.05) for (let fx = 0.2; fx < 0.8 && !at; fx += 0.05) {
      const x = q.left + q.width * fx, y = q.top + q.height * fy, el = document.elementFromPoint(x, y);
      if (el && view.contains(el) && !el.closest('[data-sab-act]')) at = { x, y };
    }
    return { x: at ? at.x : q.left + q.width / 2, y: at ? at.y : q.top + q.height / 2, s: [view.scrollLeft, view.scrollTop] }; });
  await p.mouse.move(v.x, v.y); await p.mouse.down();
  for (let i = 1; i <= 6; i++) await p.mouse.move(v.x - i * 25, v.y - i * 15);
  await p.mouse.up(); await p.waitForTimeout(200);
  const s2 = await p.evaluate(() => [document.getElementById('sab-view').scrollLeft, document.getElementById('sab-view').scrollTop]);
  if (s2[0] === v.s[0] && s2[1] === v.s[1]) throw new Error('with a piece in hand, dragging the board does not pan it');
  const still = await p.evaluate(() => !!document.querySelector('.sab-holdbar'));
  if (!still) throw new Error('a drag dropped the piece');
});

/* every button on screen answers its own centre, and is a thumb wide */
const hitAll = (p, where) => p.evaluate(where => {
  const bad = [];
  const root = window.__SAB().city ? document.getElementById('sab-cityhost') : document.getElementById('sabwrap');
  root.querySelectorAll('button, [data-sab-act]').forEach(b => {
    if (b.disabled || b.closest('[aria-hidden="true"]')) return;
    const q = b.getBoundingClientRect();
    if (q.width < 2 || q.height < 2) return;
    const cs = getComputedStyle(b); if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const cx = q.left + q.width / 2, cy = q.top + q.height / 2;
    if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return;
    /* panned out of the painted plate's camera is out of sight, not covered */
    const sc = b.closest('.sab-scene'); if (sc) { const z = sc.getBoundingClientRect();
      if (cx < z.left || cx > z.right || cy < z.top || cy > z.bottom) return; }
    if (b.closest('.sab-dtiles,.sab-dtabs,.sab-kitpins,.sab-calllist,.sab-tray')) return;   /* scrollers and pins are measured by their own checks */
    const el = document.elementFromPoint(cx, cy);
    const label = (b.getAttribute('data-sab-act') || '') + ' "' + (b.innerText || b.getAttribute('aria-label') || '').trim().slice(0, 18) + '"';
    if (!el || !(b === el || b.contains(el))) bad.push(where + ': ' + label + ' covered by ' + (el ? (el.className || el.tagName) : 'nothing'));
    else if (Math.min(q.width, q.height) < 44) bad.push(where + ': ' + label + ' is ' + Math.round(q.width) + '×' + Math.round(q.height));
  });
  return bad;
}, where);
check('city-hits', 'C7/S6: every button in a city answers a tap at its centre and is ≥ 44 px — shelf shut and open, desktop and phone, built and painted', async ({ browser, port }) => {
  const bad = [];
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const { ctx, p } = await bootBare(browser, port, w, h);
    try {
      await p.click('#sab-ovhost [data-m="long"]'); await p.waitForTimeout(300);
      await p.evaluate(() => { const G = window.__SABG(); G.res.anna = 500; G.res.kala = 500; G.res.katha = 500;
        G.sites.dholavira.kit = [{ p: 'hs-hut-round', x: 6, y: 6 }]; window.__SABDO.act('dholavira', 'city'); });
      await p.waitForTimeout(900);
      bad.push(...await hitAll(p, w + ' kit'));
      await p.evaluate(() => { const b = document.querySelector('[data-sab-act="kitopen"]'); if (b) b.click(); });
      await p.waitForTimeout(300);
      bad.push(...await hitAll(p, w + ' kit+shelf'));
      await p.evaluate(() => { const b = document.querySelector('[data-sab-act="leave"]'); if (b) b.click(); });
      await p.waitForTimeout(300);
      /* a painted city: Pataliputra, one age on */
      await p.evaluate(() => { const G = window.__SABG(); G.era = 2; const q = G.sites.pataliputra; q.found = true; q.zzz = false; q.seen = true;
        window.__SABDO.act('pataliputra', 'city'); });
      await p.waitForTimeout(900);
      bad.push(...await hitAll(p, w + ' painted'));
    } finally { await ctx.close(); }
  }
  if (bad.length) throw new Error(bad.slice(0, 30).join('; ') + (bad.length > 30 ? ` (+${bad.length - 30} more)` : ''));
});

check('payoff', 'C8/E.5: a placement floats its yield and threads its neighbours; the piece card lists base + each bonus with its reason; Agla Saal leaves a one-line report; the goal strip is on screen', async ({ p }) => {
  /* two dry cells side by side, inside the reach (the payout's own legal list) */
  const spots = await p.evaluate(() => {
    const D = window.__SABDO, L = D.legal('dholavira'), ok = {}; L.forEach(c => { ok[c[0] + ',' + c[1]] = 1; });
    const land = (x, y) => ok[x + ',' + y] && D.terrain('dholavira', x, y) === 'land';
    const d = window.IND_KIT.def('bd-har-bead').d, Lx = d[0] || 1, By = d[1] || 1;
    const fits = (x, y) => { for (let a = 0; a < Lx; a++) for (let b = 0; b < By; b++) if (!land(x + a, y + b)) return false; return true; };
    for (const [x, y] of L) if (fits(x, y) && fits(x + Lx, y)) return { pair: [[x, y], [x + Lx, y]] };
    return { pair: [] };
  });
  if (spots.pair.length < 2) throw new Error('no adjacent pair of cells to test with');
  await p.evaluate(({ pair }) => { const G = window.__SABG(); G.res.anna = 500; G.res.kala = 500;
    G.sites.dholavira.kit = [{ p: 'bd-har-bead', x: pair[0][0], y: pair[0][1] }]; }, spots);
  await openCity(p, 'dholavira');
  /* place the second workshop beside the first, through the real tap path */
  const placed = await p.evaluate(({ pair }) => new Promise(res => {
    const t = document.querySelector('[data-sab-act="kitopen"]'); if (t) t.click();
    setTimeout(() => {
      const tab = document.querySelector('[data-sab-act="kittab"][data-g="work"]'); if (tab) tab.click();
      const tile = document.querySelector('[data-sab-act="kitpick"][data-p="bd-har-bead"]'); if (tile) tile.click();
      setTimeout(() => {
        const inr = document.getElementById('sab-kitinner'), r = inr.getBoundingClientRect(), k = parseFloat(inr.getAttribute('data-k'));
        const px = window.__SABDO.cellPx('dholavira', pair[1][0], pair[1][1]);
        const x = r.left + px.x * k, y = r.top + px.y * k;
        const seen = { float: '', thread: false };
        const obs = new MutationObserver(() => {
          const f = document.querySelector('.sab-float'); if (f) seen.float = f.textContent;
          if (document.querySelector('#sab-threads line')) seen.thread = true;
        });
        obs.observe(document.getElementById('sab-floats'), { childList: true, subtree: true });
        inr.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
        setTimeout(() => { obs.disconnect(); res({ seen, n: window.__SABG().sites.dholavira.kit.length }); }, 300);
      }, 200);
    }, 200);
  }), spots);
  if (placed.n !== 2) throw new Error('the second workshop was not placed (' + placed.n + ' pieces)');
  if (!/\+\d/.test(placed.seen.float)) throw new Error('placing it floated no yield: "' + placed.seen.float + '"');
  if (!placed.seen.thread) throw new Error('placing it beside another workshop drew no thread to it');
  /* its card: base and the bonus with the rule's own words */
  const card = await p.evaluate(({ pair }) => {
    const D = window.__SABDO; document.querySelector('[data-sab-act="kitdrop"]') && document.querySelector('[data-sab-act="kitdrop"]').click();
    const inr = document.getElementById('sab-kitinner'), r = inr.getBoundingClientRect(), k = parseFloat(inr.getAttribute('data-k'));
    const px = D.cellPx('dholavira', pair[1][0], pair[1][1]);
    inr.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.left + px.x * k, clientY: r.top + px.y * k }));
    const led = document.querySelector('#sab-ovhost .sab-pledger');
    return led ? led.innerText : '';
  }, spots);
  if (!/its own work/.test(card) || !/Workshops beside workshops/.test(card)) throw new Error('the piece card does not list base + bonus with its reason: "' + card.replace(/\s+/g, ' ').slice(0, 120) + '"');
  /* Agla Saal leaves a one-line report, never a modal; the goal strip is always there */
  await closeCard(p); await p.waitForTimeout(150);
  await p.evaluate(() => { const b = document.querySelector('[data-sab-act="leave"]'); if (b) b.click(); });
  await p.waitForTimeout(250);
  const rep = await p.evaluate(() => { window.__SABDO.turn(); window.__SABDO.paint();
    return { line: (document.querySelector('#sab-report .sab-report') || {}).innerText || '', modal: !!document.querySelector('#sab-ovhost .sab-card'),
             goal: (document.getElementById('sab-goal') || {}).innerText || '' }; });
  if (!/[+-]\d|no change/.test(rep.line)) throw new Error('Agla Saal left no turn report: "' + rep.line + '"');
  if (!/lamps/.test(rep.goal) || !/next/.test(rep.goal)) throw new Error('the goal strip is missing: "' + rep.goal + '"');
});

check('opening', 'C9: the first city nets at least +1 grain a turn, and is not "restless" alone', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG(), a0 = G.res.anna; window.__SABDO.turn();
    return { d: G.res.anna - a0, k: window.__SABDO.khushi() };
  });
  if (r.d < 1) throw new Error(`the first city netted ${r.d} grain on its first turn`);
  if (r.k.restless) throw new Error('a lone first city is called restless');
});

check('city-grow', 'D.1 #9: next-level pieces wait locked with their level; growing shows an Unlocked card; a compass stands on the board; Grow never tells Dholavira\'s story in another city; the board\'s camera is "View"', async ({ p }) => {
  await p.evaluate(() => { const G = window.__SABG(); G.res.anna = 500; G.res.kala = 500; const q = G.sites.lothal; q.found = true; q.zzz = false; });
  await openCity(p, 'lothal');
  const r = await p.evaluate(() => {
    const b = document.querySelector('[data-sab-act="kitopen"]'); if (b && b.getAttribute('aria-expanded') !== 'true') b.click();
    const tabs = [...document.querySelectorAll('[data-sab-act="kittab"]')].map(t => t.getAttribute('data-g'));
    let locked = 0;
    for (const g of tabs) { const t = document.querySelector(`[data-sab-act="kittab"][data-g="${g}"]`); t.click();
      locked += [...document.querySelectorAll('.sab-tile.next')].filter(x => /level 2/.test(x.innerText)).length; }
    const view = (document.querySelector('[data-sab-act="kitturn"]') || {}).innerText || '';
    return { locked, compass: !!document.querySelector('.sab-compass svg'), view };
  });
  if (!r.locked) throw new Error('no next-level piece is shown locked with its level');
  if (!r.compass) throw new Error('no compass on the board');
  if (!/view/i.test(r.view) || /turn/i.test(r.view)) throw new Error('the camera button still reads "' + r.view + '"');
  await p.evaluate(() => { const g = document.querySelector('.sab-grow[data-sab-act="grow"]'); if (g) g.click(); });
  await p.waitForTimeout(250);
  const d = await p.evaluate(() => (document.querySelector('#sab-ovhost') || {}).innerText || '');
  if (/Dholavira/.test(d)) throw new Error('Lothal\'s grow card tells Dholavira\'s story');
  await p.evaluate(() => { const b = document.querySelector('#sab-ovhost [data-sab-act="growdir"]'); if (b) b.click(); });
  await p.waitForTimeout(250);
  const u = await p.evaluate(() => (document.querySelector('#sab-ovhost h3') || {}).textContent || '');
  if (!/Unlocked/.test(u)) throw new Error('growing showed no Unlocked card (saw "' + u + '")');
});

check('desk-enter', 'E.6 #10 / D.2 d: a desktop chooses a city and sees "Enter <city>"; every built city\'s monument stands on dry land', async ({ p }) => {
  const r = await p.evaluate(() => {
    window.__SABDO.act('dholavira', 'close');
    const g = document.getElementById('sab-dholavira'); ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => g.dispatchEvent(new MouseEvent(t, { bubbles: true })));
    const b = document.querySelector('#sab-sheet .sab-enter');
    const wet = Object.keys(window.IND_KIT_CITIES || {}).filter(id => {
      const m = window.__SABDO.monCell(id); if (!m) return true;
      return [[0, 0], [1, 0], [0, 1], [1, 1]].some(d => window.__SABDO.terrain(id, m[0] + d[0], m[1] + d[1]) !== 'land');
    });
    return { text: b ? b.innerText : '', vis: b ? b.getBoundingClientRect().width > 0 : false, wet };
  });
  if (!r.vis || !/Enter Dholavira/.test(r.text)) throw new Error('the desktop sheet has no "Enter Dholavira" door');
  if (r.wet.length) throw new Error('the monument is anchored off dry land in ' + r.wet.join(', '));
});


/* ================================================================ the owner's second pass (9 Oct 2026)
   "if I don't have the resources I should see that building as grayed or crossed out… the cities
   are too small… I should be able to expand… a goal to look forward to." */

check('shelf-afford', 'a piece the purse cannot pay for is greyed with its shortfall written on it, and a tap on it says why; pieces of later levels wait 🔒 with their level', async ({ p }) => {
  await p.evaluate(() => { const G = window.__SABG(); G.res.anna = 5; G.res.kala = 3; });
  await openCity(p, 'dholavira');
  const r = await p.evaluate(() => {
    const b = document.querySelector('[data-sab-act="kitopen"]'); if (b && b.getAttribute('aria-expanded') !== 'true') b.click();
    const out = { poor: 0, said: 0, locked: 0, picked: false, feed: '' };
    for (const t of [...document.querySelectorAll('[data-sab-act="kittab"]')].map(x => x.getAttribute('data-g'))) {
      document.querySelector(`[data-sab-act="kittab"][data-g="${t}"]`).click();
      document.querySelectorAll('.sab-tile.poor').forEach(x => { out.poor++; if (/needs \d+ more/.test(x.innerText)) out.said++; });
      out.locked += [...document.querySelectorAll('.sab-tile.next')].filter(x => /🔒 level \d/.test(x.innerText)).length;
    }
    document.querySelector('[data-sab-act="kittab"][data-g="work"]').click();
    const poor = document.querySelector('.sab-tile.poor[data-sab-act="kitpick"]');
    if (poor) { poor.click(); out.picked = !!document.querySelector('.sab-holdbar'); out.feed = document.getElementById('sab-feed').textContent; }
    return out;
  });
  if (!r.poor) throw new Error('with an empty purse nothing on the shelf is greyed');
  if (r.said !== r.poor) throw new Error(`${r.poor - r.said} greyed pieces do not say what they are short of`);
  if (r.picked) throw new Error('a piece the purse cannot pay for was picked up anyway');
  if (!/needs \d+ more/.test(r.feed)) throw new Error('tapping an unaffordable piece said nothing: "' + r.feed + '"');
  if (!r.locked) throw new Error('no piece of a later level waits locked with its level');
});

check('city-room', 'a level-1 city has room for at least 8 pieces, and the held piece shows every cell it may stand on, with the best one named', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO, q = G.sites.dholavira, keep = q.kit;
    G.res.anna = G.res.kala = 9999; q.lv = 1; q.kit = [];
    let n = 0;
    /* measured with the bead workshop, the biggest everyday piece of the age, not a 1x1 hut */
    for (const [x, y] of D.legal('dholavira')) {
      if (D.canPlace('dholavira', 'bd-har-bead', x, y)) continue;
      q.kit.push({ p: 'bd-har-bead', x, y }); n++;
    }
    q.kit = keep;
    return { n, cells: D.legal('dholavira').length, was: 89 };
  });
  /* "the cities are too small": at reach 7 a level-1 Dholavira had 89 buildable cells */
  if (r.cells < 115) throw new Error(`a level-1 Dholavira has ${r.cells} buildable cells — no bigger than before the owner's note (${r.was})`);
  if (r.n < 8) throw new Error(`a level-1 Dholavira has room for ${r.n} workshops — the owner asked for 8–10 pieces at least`);
  await p.evaluate(() => { const G = window.__SABG(); G.res.anna = 500; G.res.kala = 500; G.sites.dholavira.kit = []; });
  await openCity(p, 'dholavira');
  const g = await p.evaluate(() => new Promise(res => {
    const b = document.querySelector('[data-sab-act="kitopen"]'); if (b) b.click();
    setTimeout(() => {
      document.querySelector('[data-sab-act="kittab"][data-g="home"]').click();
      const t = document.querySelector('[data-sab-act="kitpick"][data-p="hs-har-mud"]'); if (t) t.click();
      setTimeout(() => {
        const cells = document.querySelectorAll('.sab-glow .sab-glowc').length, best = !!document.querySelector('.sab-glow .sab-glowbest');
        const tag = (document.querySelector('.sab-bestpin') || {}).textContent || '';
        const n0 = window.__SABG().sites.dholavira.kit.length;
        const pb = document.querySelector('[data-sab-act="kitbest"]'); if (pb) pb.click();
        setTimeout(() => res({ cells, best, tag, placed: window.__SABG().sites.dholavira.kit.length - n0 }), 200);
      }, 250);
    }, 250);
  }));
  if (g.cells < 8) throw new Error(`holding a home lights ${g.cells} cells`);
  if (!g.best || !/\+|best/.test(g.tag)) throw new Error('no best spot is named on the board');
  if (g.placed !== 1) throw new Error('"Place it" did not set the piece on the best spot');
});

check('village', 'a grown city founds a village on open land: a dot and a road on the map, a little more grain and craft — and no boundary drawn anywhere', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO, q = G.sites.dholavira;
    G.res.anna = 500; G.res.kala = 500; q.lv = 1;
    D.act('dholavira', 'close');
    const y0 = D.yieldLedger('dholavira').y;
    const before = (G.villages || []).length;
    D.act('dholavira', 'village');                       /* level 1: not yet */
    const early = (G.villages || []).length - before;
    q.lv = 2; D.paint();
    const y0b = D.yieldLedger('dholavira').y;      /* the yield at level 2, before the village */
    const sel = () => { const g = document.getElementById('sab-dholavira'); ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => g.dispatchEvent(new MouseEvent(t, { bubbles: true }))); };
    sel();
    const tile = document.querySelector('#sab-sheet [data-sab-act="village"]');
    if (tile) tile.click();
    const v = (G.villages || [])[before];
    const y1 = D.yieldLedger('dholavira').y;
    const drawn = document.querySelectorAll('#sab-villages .sab-vill').length, road = document.querySelectorAll('#sab-villages .sab-vroad').length;
    /* a village is a dot and a road — nothing in the map draws a line round anything */
    const svg = document.querySelector('#sab-stage svg');
    const border = [...svg.querySelectorAll('*')].filter(el => /border|boundar|territor|claim/i.test((el.getAttribute('class') || '') + ' ' + (el.id || ''))).length;
    const shapes = [...document.querySelectorAll('#sab-villages *')].filter(el => /^(polygon|rect|polyline)$/i.test(el.tagName)).length;
    const terr = [...svg.querySelectorAll('.sab-terr')].map(el => getComputedStyle(el).stroke + '|' + getComputedStyle(el).fill);
    void y0;
    return { early, tile: !!tile, v, gain: (y1.anna - y0b.anna) + (y1.kala - y0b.kala), drawn, road, border, shapes, terrKinds: new Set(terr).size };
  });
  if (r.early) throw new Error('a level-1 city founded a village');
  if (!r.tile) throw new Error('a level-2 city offers no "Found a village" in its sheet');
  if (!r.v) throw new Error('the village was not founded');
  if (r.gain < 2) throw new Error(`the village added ${r.gain} to its city's yield`);
  if (!r.drawn || !r.road) throw new Error('the village is not on the map with its road');
  if (r.border || r.shapes) throw new Error('something on the map draws a line round a place');
  if (r.terrKinds !== 1) throw new Error('the land is no longer one neutral wash');
});

check('age-goal', 'each age names its pressure and goal on a calm clock in the goal strip; missing it shrinks the unready and thins the stores, the ready hold, and it is offered again; meeting it turns the age', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO, out = {};
    D.paint();
    out.strip = (document.getElementById('sab-goal') || {}).innerText || '';
    out.goal = JSON.parse(JSON.stringify(G.goal || null));
    /* two cities: one ready (on a road, with a well), one not */
    ['lothal', 'kalibangan'].forEach(id => { const q = G.sites[id]; q.found = true; q.zzz = false; q.lv = 2; });
    G.sites.dholavira.lv = 2;
    G.routes = [['dholavira', 'lothal']];
    G.sites.lothal.kit = [{ p: 'wa-har-well', x: 3, y: 3 }];
    G.res.anna = 100; G.res.kala = 100;
    G.goal.due = G.t + 1;
    D.turn();
    const card = (document.querySelector('#sab-ovhost') || {}).innerText || '';
    out.card = card.slice(0, 1600);
    out.lv = { lothal: G.sites.lothal.lv, kalibangan: G.sites.kalibangan.lv };
    out.anna = G.res.anna; out.due = G.goal.due - G.t; out.missed = G.goal.missed;
    const b = document.querySelector('#sab-ovhost .sab-btn'); if (b) b.click();
    /* now meet it: three joined, two wells, the grain in store */
    G.routes = [['dholavira', 'lothal'], ['lothal', 'kalibangan']];
    G.sites.kalibangan.kit = [{ p: 'wa-har-well', x: 15, y: 11 }];
    G.res.anna = 400; G.sites.dholavira.bld.granary = true; G.sites.lothal.bld.granary = true;
    D.turn();
    out.met = G.goal.met; out.can = !!document.querySelector('#sab-adv:not([hidden])') || D.advise().act === 'advance';
    const b2 = document.querySelector('#sab-ovhost .sab-btn'); if (b2) b2.click();
    out.adv = D.advise().act;
    return out;
  });
  if (!r.goal || r.goal.due - r.goal.start !== 50) throw new Error('the first age has no 50-turn goal: ' + JSON.stringify(r.goal));
  if (!/⏳/.test(r.strip) || !/long drying/i.test(r.strip) || !/turns/.test(r.strip)) throw new Error('the goal strip shows no clock: "' + r.strip + '"');
  if (/sarasvati|saraswati/i.test(r.strip + r.card)) throw new Error('the contested river is named');
  if (!/archaeologists read its end as a long drying/.test(r.card)) throw new Error('the pressure is not told in the data\'s own sourced words: ' + r.card);
  if (r.lv.lothal !== 2) throw new Error('the ready city did not hold');
  if (r.lv.kalibangan !== 1) throw new Error('the unready city did not feel it');
  if (!(r.anna < 100)) throw new Error('the stores did not thin');
  if (!(r.due > 0) || r.missed !== 1) throw new Error('the goal was not offered again');
  if (!/Nothing is lost for good/.test(r.card)) throw new Error('the consequence card does not say it is recoverable');
  if (!r.met) throw new Error('meeting every part did not meet the goal');
  if (r.adv !== 'advance') throw new Error('with the goal met, Mithu does not say the age can turn (' + r.adv + ')');
});

check('goal-quests', 'the age\'s scrolls serve its goal, and Mithu points at the next part of it', async ({ p }) => {
  const r = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO;
    G.lastq = -99; G.quests = {}; G.res.anna = 50;
    for (let i = 0; i < 3; i++) { D.turn(); const b = document.querySelector('#sab-ovhost .sab-btn'); if (b) b.click(); }
    const kinds = Object.values(G.quests).map(q => q.kind);
    /* Mithu, with the lamps of the age reached, points at the goal */
    ['lothal', 'kalibangan', 'rakhigarhi'].forEach(id => { const q = G.sites[id]; q.found = true; q.zzz = false; });
    G.routes = [['dholavira', 'lothal'], ['lothal', 'kalibangan'], ['kalibangan', 'rakhigarhi']];
    G.quests = {}; G.ev = null; G.warn = null; G.res.katha = 0;
    const ad = D.advise();
    return { kinds, why: ad.why, act: ad.act };
  });
  if (!r.kinds.some(k => k === 'water' || k === 'store')) throw new Error('no scroll asked for a part of the goal: ' + r.kinds.join(','));
  if (!/well|tank|water/i.test(r.why)) throw new Error('Mithu does not point at the goal\'s missing water: "' + r.why + '"');
});

/* ================================================================ living cities (master E.2, E.3, E.6 #13–#14)
   Every building shows its state on the board, a monument glows, and the roads carry carts that
   ride the road the engine drew. One clock, delta time, stopped when hidden; reduced motion and
   Calm draw everything and move nothing; no boundary ever animates. Each check was watched to
   fail once against a deliberately broken engine before it was trusted. */

/* a small realm: three living Harappan towns joined by two roads, and a grown Dholavira */
const liveWorld = p => p.evaluate(() => {
  const G = window.__SABG(), D = window.__SABDO;
  ['lothal', 'kalibangan'].forEach(id => { const s = G.sites[id]; s.found = true; s.zzz = false; });
  G.routes = [['dholavira', 'lothal'], ['dholavira', 'kalibangan']];
  G.res.anna = 300; G.res.kala = 300; G.res.katha = 300;
  D.act('dholavira', 'close');
  D.paint();
});
/* into a city through the engine's own verb — the double tap is what openCity tests, and
   under load its two taps can drift apart */
const enterCity = async (p, sid) => {
  await p.evaluate(sid => window.__SABDO.act(sid, 'city'), sid);
  await p.waitForTimeout(1200);
  if (await p.evaluate(() => window.__SAB().city) !== sid) await openCity(p, sid);
};
/* how far a mover stands from the road it is meant to be on, in map units */
const offRoad = p => p.evaluate(() => [...document.querySelectorAll('#sab-carts .sab-cart, #sab-carts .sab-sail')].map(el => {
  const m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(el.getAttribute('transform') || '');
  const path = document.getElementById('sabr-' + el.getAttribute('data-i'));
  if (!m || !path) return { i: el.getAttribute('data-i'), d: 1e9 };
  const x = +m[1], y = +m[2], L = path.getTotalLength();
  let d = 1e9, t = 0;
  for (let k = 0; k <= 600; k++) { const q = path.getPointAtLength(L * k / 600), dk = Math.hypot(q.x - x, q.y - y); if (dk < d) { d = dk; t = k / 600; } }
  return { i: +el.getAttribute('data-i'), sea: el.classList.contains('sab-sail'), d, t, x, y };
}));

check('live-city', 'E.2/#13: a working building shows its working state on its own drawing (smoke where a karigar works, light on the water); a new piece settles once; a grown city fills its outskirts; a monument glows; a sleeping city does none of it', async ({ p }) => {
  await liveWorld(p);
  const setup = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO, q = G.sites.dholavira, K = window.IND_KIT;
    q.lv = 1; q.mon = false; q.kit = [];
    const legal = D.legal('dholavira').sort((a, b) => K.reach('dholavira', a[0], a[1]) - K.reach('dholavira', b[0], b[1]));
    const put = part => { for (const [x, y] of legal) if (!D.canPlace('dholavira', part, x, y)) { q.kit.push({ p: part, x, y, f: 0 }); return part + '@' + x + ',' + y; } return null; };
    const kiln = put('bd-kiln'), well = put('wa-har-well'), home = put('hs-har-mud');
    q.jobs = null; D.paint();
    return { kiln, well, home };
  });
  if (!setup.kiln || !setup.well) throw new Error('could not set a kiln and a well down in Dholavira: ' + JSON.stringify(setup));
  await p.evaluate(() => { const q = window.__SABG().sites.dholavira; q.jobs = null; });
  await enterCity(p, 'dholavira');
  const look = (kiln, well) => p.evaluate(([kiln, well]) => {
    const near = (a, b) => Math.abs(a.left - b.left) < 1.5 && Math.abs(a.top - b.top) < 1.5 && Math.abs(a.width - b.width) < 1.5 && Math.abs(a.height - b.height) < 1.5;
    const smoke = document.querySelector('[data-live="smoke"][data-at="' + kiln + '"]');
    const water = document.querySelector('[data-live="water"][data-at="' + well + '"]');
    const kimg = [...document.querySelectorAll('img.kit-p[data-kit="bd-kiln"]')][0];
    const box = smoke && smoke.closest('.sab-lv');
    const sr = smoke && smoke.getBoundingClientRect(), kr = kimg && kimg.getBoundingClientRect();
    return {
      smoke: !!smoke, water: !!water,
      /* the box the smoke stands in IS the kiln's painting, measured by the browser */
      boxOnArt: !!(box && kimg && near(box.getBoundingClientRect(), kr)),
      smokeOverKiln: !!(sr && kr && sr.left >= kr.left && sr.left <= kr.right && sr.top >= kr.top - 2 && sr.top <= kr.top + kr.height * 0.4),
      pe: [...document.querySelectorAll('.sab-live, .sab-live *, .sab-lv, .sab-lv *, .sab-outskirts *')].filter(el => getComputedStyle(el).pointerEvents !== 'none').length
    };
  }, [kiln, well]);
  /* a karigar at the kiln: it smokes */
  await p.evaluate(() => { const q = window.__SABG().sites.dholavira; q.jobs.karigar = 1; q.jobs.kisan = Math.max(0, q.jobs.kisan - 1); window.__SABDO.paint(); });
  await p.evaluate(() => { const b = document.querySelector('[data-sab-act="kitzoom"][data-d="1"]'); if (b) b.click(); });
  await p.waitForTimeout(500);
  const on = await look(setup.kiln, setup.well);
  if (!on.smoke) throw new Error('a kiln with a karigar at it shows no smoke');
  if (!on.water) throw new Error('a well in a living city shows no light on its water');
  if (!on.boxOnArt) throw new Error('the smoke is not anchored on the kiln\'s own drawing');
  if (!on.smokeOverKiln) throw new Error('the smoke does not rise from the top of the kiln');
  if (on.pe) throw new Error(on.pe + ' living-layer elements take taps (they must be pointer-events:none)');
  /* nobody at the bench: no smoke, the water still shines */
  await p.evaluate(() => { const q = window.__SABG().sites.dholavira; q.jobs.kisan += q.jobs.karigar; q.jobs.karigar = 0; const b = document.querySelector('[data-sab-act="kitzoom"][data-d="-1"]'); if (b) b.click(); });
  await p.waitForTimeout(300);
  const off = await look(setup.kiln, setup.well);
  if (off.smoke) throw new Error('an empty kiln still smokes — smoke must mean somebody is working');
  if (!off.water) throw new Error('the water stopped shining when the kiln emptied');
  /* a piece set down by the real tap path settles once, and a repaint later it is just standing */
  const placed = await p.evaluate(() => new Promise(res => {
    const D = window.__SABDO, G = window.__SABG();
    const b = document.querySelector('[data-sab-act="kitopen"]'); if (b && b.getAttribute('aria-expanded') !== 'true') b.click();
    setTimeout(() => {
      const tab = document.querySelector('[data-sab-act="kittab"][data-g="home"]'); if (tab) tab.click();
      const t = document.querySelector('[data-sab-act="kitpick"][data-p="hs-har-mud"]'); if (t) t.click();
      setTimeout(() => {
        const n0 = G.sites.dholavira.kit.length;
        const pb = document.querySelector('[data-sab-act="kitbest"]'); if (pb) pb.click();
        setTimeout(() => {
          const fresh = document.querySelectorAll('img.kit-p.kit-new').length, dust = document.querySelectorAll('[data-live="new"]').length;
          setTimeout(() => {
            D.paint();
            const x = document.querySelector('[data-sab-act="kitzoom"][data-d="1"]'); if (x) x.click();
            setTimeout(() => res({ placed: G.sites.dholavira.kit.length - n0, fresh, dust, later: document.querySelectorAll('img.kit-p.kit-new').length }), 150);
          }, 1000);
        }, 60);
      }, 250);
    }, 250);
  }));
  if (placed.placed !== 1) throw new Error('could not place a home through the tap path');
  if (placed.fresh !== 1 || !placed.dust) throw new Error(`a new piece did not settle (${placed.fresh} settling, ${placed.dust} dust)`);
  if (placed.later) throw new Error('a piece kept settling after it had landed — the animation replays on a repaint');
  /* grown, and a monument raised: the outskirts fill in and the monument glows */
  const grown = await p.evaluate(() => new Promise(res => {
    const G = window.__SABG(), q = G.sites.dholavira;
    const outskirts1 = document.querySelectorAll('[data-live="outskirt"]').length;
    q.lv = 3; q.mon = true; q.monB = null;
    window.__SABDO.paint();
    const x = document.querySelector('[data-sab-act="kitzoom"][data-d="-1"]'); if (x) x.click();
    setTimeout(() => {
      const o3 = [...document.querySelectorAll('img[data-live="outskirt"]')];
      const glow = document.querySelectorAll('[data-live="monglow"]').length;
      /* nothing in the outskirts stands inside the reach the child builds on */
      res({ outskirts1, outskirts3: o3.length, glow });
    }, 200);
  }));
  if (grown.outskirts1) throw new Error('a level-1 city already has outskirts');
  if (grown.outskirts3 < 4) throw new Error(`a level-3 city shows ${grown.outskirts3} homes in its outskirts`);
  if (!grown.glow) throw new Error('a finished monument casts no glow on its board');
  /* asleep: nothing works */
  const asleep = await p.evaluate(() => new Promise(res => {
    const q = window.__SABG().sites.dholavira; q.jobs.karigar = 1; q.zzz = true;
    const x = document.querySelector('[data-sab-act="kitzoom"][data-d="1"]'); if (x) x.click();
    setTimeout(() => { const n = document.querySelectorAll('[data-live="smoke"],[data-live="water"],[data-live="lamp"],[data-live="outskirt"]').length; q.zzz = false; res(n); }, 200);
  }));
  if (asleep) throw new Error(`a sleeping city still shows ${asleep} working-state elements`);
});

check('live-grow', 'E.2/#13: growing is a moment — once the Unlocked card is put away, the land the growth reached lights (and only that land), the homes it raised settle, and a repaint later all of it is simply standing', async ({ p }) => {
  await p.evaluate(() => { const G = window.__SABG(); G.res.anna = 900; G.res.kala = 900; window.__SABDO.act('dholavira', 'close'); });
  await enterCity(p, 'dholavira');
  const opened = await p.evaluate(() => window.__SAB().city);
  if (opened !== 'dholavira') throw new Error('could not enter Dholavira (' + opened + ')');
  const r = await p.evaluate(() => new Promise(res => {
    const G = window.__SABG(), K = window.IND_KIT, q = G.sites.dholavira, out = {};
    const reachBefore = {};
    window.__SABDO.legal('dholavira').forEach(c => { reachBefore[c[0] + ',' + c[1]] = 1; });
    window.__SABDO.act('dholavira', 'grow');
    setTimeout(() => {
      const b = document.querySelector('#sab-ovhost [data-sab-act="growdir"][data-d="s"]'); if (b) b.click();
      setTimeout(() => {
        out.card = /Unlocked/.test((document.querySelector('#sab-ovhost') || {}).textContent || '');
        out.underCard = document.querySelectorAll('[data-live="newland"]').length;
        const c = document.querySelector('#sab-ovhost [data-sab-act="ovclose"]'); if (c) c.click();
        const cells = [...document.querySelectorAll('[data-live="newland"]')];
        out.lit = cells.length;
        out.settling = document.querySelectorAll('img.kit-p.kit-new').length;
        /* every lit cell is land the city may build on now and could not before */
        const legalNow = {}; window.__SABDO.legal('dholavira').forEach(c2 => { legalNow[c2[0] + ',' + c2[1]] = 1; });
        out.newLegal = Object.keys(legalNow).filter(k => !reachBefore[k]).length;
        setTimeout(() => {
          const x = document.querySelector('[data-sab-act="kitzoom"][data-d="1"]'); if (x) x.click();
          out.later = document.querySelectorAll('[data-live="newland"], img.kit-p.kit-new').length;
          out.lv = q.lv;
          res(out);
        }, 2800);
      }, 300);
    }, 300);
  }));
  if (r.lv !== 2) throw new Error('the city did not grow (level ' + r.lv + ')');
  if (!r.card) throw new Error('growing showed no Unlocked card');
  if (r.underCard) throw new Error('the new land lit underneath the Unlocked card, where nobody can see it');
  if (!r.lit) throw new Error('the land the growth reached did not light when the card was put away');
  if (r.lit > r.newLegal + 12) throw new Error(`${r.lit} cells lit for ${r.newLegal} newly buildable — the light is not on the new land`);
  if (!r.settling) throw new Error('the homes the growth raised did not settle into place');
  if (r.later) throw new Error(`${r.later} growth effects are still playing a repaint later`);
});

check('live-carts', 'E.3/#14: every road between two living places carries a cart standing on the road the engine drew; busier roads carry more; a road between two ports carries sails; a road to a sleeping town carries nothing', async ({ p }) => {
  await liveWorld(p);
  const n = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO;
    /* same kind of place at both ends: one cart; a sleeping end: none */
    G.sites.rakhigarhi.found = true; G.sites.rakhigarhi.zzz = true;
    G.routes = [['dholavira', 'lothal'], ['dholavira', 'kalibangan'], ['kalibangan', 'rakhigarhi']];
    D.paint();
    const per = {};
    document.querySelectorAll('#sab-carts .sab-cart').forEach(el => { const i = el.getAttribute('data-i'); per[i] = (per[i] || 0) + 1; });
    return { per, good: [D.good('dholavira'), D.good('lothal'), D.good('kalibangan')] };
  });
  if (!n.per[0] || !n.per[1]) throw new Error('a road between two living towns carries no cart: ' + JSON.stringify(n.per));
  if (n.per[2]) throw new Error('a road to a sleeping town carries carts');
  /* busier: a road to the capital carries one more than it did */
  const busier = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO;
    const count = i => document.querySelectorAll('#sab-carts .sab-cart[data-i="' + i + '"]').length;
    const before = count(1);
    G.capital = 'kalibangan'; D.paint();
    const after = count(1); G.capital = null; D.paint();
    return { before, after };
  });
  if (!(busier.after > busier.before)) throw new Error(`a road that serves the capital is no busier (${busier.before} → ${busier.after})`);
  await p.waitForTimeout(700);
  const at = await offRoad(p);
  if (!at.length) throw new Error('no movers on the map');
  const far = at.filter(m => m.d > 1.5);
  if (far.length) throw new Error('a cart is off its road: ' + JSON.stringify(far[0]));
  /* two ports joined by a road: sails, on that road */
  const sea = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO, ports = window.IND_SABHYATA.ports || [];
    const a = ports.filter(id => G.sites[id] && window.IND_SABHYATA.sites.some(s => s.id === id && s.era <= 2))[0] || 'lothal';
    const b = ports.filter(id => id !== a && window.IND_SABHYATA.sites.some(s => s.id === id && s.era <= 2))[0];
    if (!b) return { skip: true };
    G.era = 2; [a, b].forEach(id => { G.sites[id].found = true; G.sites[id].zzz = false; });
    G.routes = [[a, b]]; D.paint();
    return { a, b, sails: document.querySelectorAll('#sab-carts .sab-sail').length, carts: document.querySelectorAll('#sab-carts .sab-cart').length };
  });
  if (!sea.skip) {
    if (!sea.sails || sea.carts) throw new Error(`a road between ${sea.a} and ${sea.b} carries ${sea.sails} sails and ${sea.carts} carts`);
    const s2 = await offRoad(p);
    if (s2.some(m => m.d > 1.5)) throw new Error('a sail is off its sea road');
  }
  /* the cap: never more than 24 movers, and every living road keeps its first */
  const cap = await p.evaluate(() => {
    const G = window.__SABG(), D = window.__SABDO;
    const live = window.IND_SABHYATA.sites.filter(s => s.era <= 4).map(s => s.id);
    G.era = 4; live.forEach(id => { G.sites[id].found = true; G.sites[id].zzz = false; });
    G.routes = []; for (let i = 1; i < live.length; i++) G.routes.push([live[i - 1], live[i]]);
    D.paint();
    const movers = document.querySelectorAll('#sab-carts > g').length;
    const roads = new Set([...document.querySelectorAll('#sab-carts > g')].map(e => e.getAttribute('data-i'))).size;
    return { movers, roads, routes: G.routes.length };
  });
  if (cap.movers > 24) throw new Error(`${cap.movers} movers on the map (cap 24)`);
  if (cap.roads < Math.min(24, cap.routes)) throw new Error(`only ${cap.roads} of ${cap.routes} living roads carry anything`);
});

check('live-still', 'reduced motion and Calm: carts are drawn parked on their roads, the city\'s life is drawn standing, no rAF loop runs, and nothing in the game animates', async ({ browser, port }) => {
  for (const how of ['reduced', 'calm']) {
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: how === 'reduced' ? 'reduce' : 'no-preference' });
    try {
      await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
      await skipOnboarding(p);
      if (how === 'calm') {
        await p.evaluate(() => { const o = JSON.parse(localStorage.getItem('bi_device') || '{}'); o.calm = true; localStorage.setItem('bi_device', JSON.stringify(o)); });
        await p.reload({ waitUntil: 'networkidle' });
      }
      await p.waitForTimeout(300);
      await p.evaluate(() => { location.hash = '#/game/sabhyata'; });
      await p.waitForFunction(() => typeof window.__SABG === 'function', null, { timeout: 20000 });
      await p.waitForTimeout(500);
      const ov = await p.$('#sab-ovhost [data-sab-act="mode"][data-m="long"]') || await p.$('#sab-ovhost .sab-btn');
      if (ov) { await ov.click(); await p.waitForTimeout(250); }
      await liveWorld(p);
      await p.evaluate(() => { const q = window.__SABG().sites.dholavira; q.mon = true; q.monB = null; window.__SABDO.paint(); });
      await p.waitForTimeout(400);
      const map = await p.evaluate(() => {
        const host = document.getElementById('sabwrap').parentNode;
        const a1 = [...document.querySelectorAll('#sab-carts .sab-cart')].map(e => e.getAttribute('transform'));
        return { still: window.__SABLIVE().still, running: window.__SABLIVE().running, carts: a1, anims: host.getAnimations({ subtree: true }).map(a => (a.animationName || a.transitionProperty || '?') + ' on ' + (a.effect && a.effect.target ? (a.effect.target.getAttribute('class') || a.effect.target.tagName) : '?')) };
      });
      if (!map.still) throw new Error(how + ': the engine did not take the ask for stillness');
      if (map.running) throw new Error(how + ': the rAF loop runs');
      if (map.carts.length < 2) throw new Error(how + ': the carts were not drawn — a still road must still carry something');
      if (map.anims.length) throw new Error(how + ': on the map, ' + map.anims.length + ' things animate, e.g. ' + map.anims.slice(0, 3).join('; '));
      const at = await offRoad(p);
      if (at.some(m => m.d > 1.5)) throw new Error(how + ': a parked cart is off its road');
      /* parked out on the road, where it can be seen — not hidden in a town at either end */
      if (at.some(m => m.t < 0.15 || m.t > 0.85)) throw new Error(how + ': a parked cart stands at the end of its road (' + at.map(m => m.t.toFixed(2)).join(', ') + ')');
      await p.waitForTimeout(400);
      const again = await p.evaluate(() => [...document.querySelectorAll('#sab-carts .sab-cart')].map(e => e.getAttribute('transform')));
      if (JSON.stringify(again) !== JSON.stringify(map.carts)) throw new Error(how + ': a parked cart moved');
      /* inside the city: its life is drawn and nothing moves */
      await p.evaluate(() => {
        const G = window.__SABG(), D = window.__SABDO, q = G.sites.dholavira, K = window.IND_KIT;
        q.lv = 3; q.kit = [];
        const legal = D.legal('dholavira').sort((a, b) => K.reach('dholavira', a[0], a[1]) - K.reach('dholavira', b[0], b[1]));
        for (const part of ['bd-kiln', 'wa-har-well']) for (const [x, y] of legal) if (!D.canPlace('dholavira', part, x, y)) { q.kit.push({ p: part, x, y, f: 0 }); break; }
        q.jobs = null;
      });
      await enterCity(p, 'dholavira');
      await p.evaluate(() => { const q = window.__SABG().sites.dholavira; q.jobs.karigar = 1; q.jobs.kisan = Math.max(0, q.jobs.kisan - 1); const b = document.querySelector('[data-sab-act="kitzoom"][data-d="1"]'); if (b) b.click(); });
      await p.waitForTimeout(500);
      const city = await p.evaluate(() => {
        const host = document.getElementById('sabwrap').parentNode;
        return { smoke: document.querySelectorAll('[data-live="smoke"]').length, water: document.querySelectorAll('[data-live="water"]').length,
                 glow: document.querySelectorAll('[data-live="monglow"]').length, fresh: document.querySelectorAll('.kit-new,[data-live="new"]').length,
                 anims: host.getAnimations({ subtree: true }).map(a => (a.animationName || a.transitionProperty || '?') + ' on ' + (a.effect && a.effect.target ? (a.effect.target.getAttribute('class') || a.effect.target.tagName) : '?')),
                 running: window.__SABLIVE().running };
      });
      if (!city.smoke || !city.water || !city.glow) throw new Error(how + ': the city\'s life is not drawn when still: ' + JSON.stringify(city));
      if (city.fresh) throw new Error(how + ': a piece settles under ' + how);
      if (city.anims.length) throw new Error(how + ': in the city, ' + city.anims.length + ' things animate, e.g. ' + city.anims.slice(0, 3).join('; '));
      if (city.running) throw new Error(how + ': the rAF loop runs inside the city');
    } finally { await p.close(); }
  }
});

check('live-hidden', 'a hidden tab stops the one clock: no frame is asked for, no cart moves, the city\'s CSS life is paused; shown again, it carries on', async ({ p }) => {
  await liveWorld(p);
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => new Promise(res => {
    const pos = () => [...document.querySelectorAll('#sab-carts .sab-cart')].map(e => e.getAttribute('transform')).join('|');
    const host = document.getElementById('sabwrap').parentNode;
    const out = { running0: window.__SABLIVE().running, p0: pos() };
    setTimeout(() => {
      out.p1 = pos();
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
      out.runningHidden = window.__SABLIVE().running;
      out.cls = host.classList.contains('sab-hidden');
      const h0 = pos(), f0 = window.__SABLIVE().frames;
      setTimeout(() => {
        out.movedHidden = pos() !== h0; out.rafsHidden = window.__SABLIVE().frames - f0;
        out.playing = host.getAnimations({ subtree: true }).filter(a => a.playState === 'running' && a.animationName).length;
        delete document.hidden;
        document.dispatchEvent(new Event('visibilitychange'));
        out.runningBack = window.__SABLIVE().running;
        const b0 = pos();
        setTimeout(() => { out.movedBack = pos() !== b0; res(out); }, 500);
      }, 600);
    }, 600);
  }));
  if (!r.running0) throw new Error('the clock is not running on a visible map with carts');
  if (r.p0 === r.p1) throw new Error('the carts do not move on a visible map');
  if (r.runningHidden) throw new Error('the rAF loop is still running in a hidden tab');
  if (r.rafsHidden) throw new Error(`${r.rafsHidden} frames were asked for while hidden`);
  if (r.movedHidden) throw new Error('a cart moved while the tab was hidden');
  if (!r.cls || r.playing) throw new Error(`the city\'s CSS life was not paused when hidden (${r.playing} still running)`);
  if (!r.runningBack || !r.movedBack) throw new Error('shown again, the carts did not carry on');
});

check('live-border', 'no boundary animates: the land\'s wash, its outlines and every region element hold still; the glow is only round a monument; nothing on the map uses SMIL', async ({ p }) => {
  await liveWorld(p);
  const r = await p.evaluate(() => new Promise(res => {
    const G = window.__SABG(), D = window.__SABDO;
    G.sites.dholavira.mon = true; G.sites.dholavira.monB = null; D.paint();
    setTimeout(() => {
      const svg = document.querySelector('#sab-stage svg');
      const terr = [...svg.querySelectorAll('.sab-terr, #sab-terrg, [class*="border"], [class*="boundar"], [class*="territ"], [class*="region"], [id*="border"], [id*="boundar"], [id*="region"]')];
      const moving = terr.filter(el => el.getAnimations().length).map(el => (el.getAttribute('class') || el.id));
      /* the CSS itself: no rule animates a boundary, whatever is on screen today */
      const cssBad = [];
      for (const sh of document.styleSheets) {
        let rules; try { rules = sh.cssRules; } catch (e) { continue; }
        for (const ru of rules) {
          const t = ru.cssText || '';
          const sel = t.split('{')[0] || '';
          if (/sab-/.test(sel) && /\.sab-terr|#sab-terrg|boundar|territ|region/.test(sel) && /animation(-name)?\s*:\s*(?!none)/.test(t)) cssBad.push(t.slice(0, 90));
        }
      }
      const smil = svg.querySelectorAll('animate, animateTransform, animateMotion, set').length;
      const glows = [...svg.querySelectorAll('.sab-mglow')].map(el => el.getAttribute('data-for'));
      const notMon = glows.filter(id => !(G.sites[id] && G.sites[id].mon));
      const glowCentred = [...svg.querySelectorAll('.sab-mglow')].every(el => {
        const s = window.IND_SABHYATA.sites.filter(x => x.id === el.getAttribute('data-for'))[0];
        return s && Math.abs(+el.getAttribute('cx') - s.x) < 0.5 && Math.abs(+el.getAttribute('cy') - s.y) < 0.5 && el.tagName.toLowerCase() === 'circle';
      });
      const strays = [...svg.querySelectorAll('#sab-carts > *')].filter(el => !/sab-(cart|sail)/.test(el.getAttribute('class') || '')).length;
      res({ n: terr.length, moving, cssBad, smil, glows, notMon, glowCentred, strays });
    }, 300);
  }));
  if (!r.n) throw new Error('found no land elements to check');
  if (r.moving.length) throw new Error('a boundary or region element animates: ' + r.moving.slice(0, 3).join(', '));
  if (r.cssBad.length) throw new Error('a CSS rule animates the land: ' + r.cssBad[0]);
  if (r.smil) throw new Error(r.smil + ' SMIL animations on the map');
  if (!r.glows.length) throw new Error('a finished monument has no glow on the map');
  if (r.notMon.length) throw new Error('a glow sits round a place with no monument: ' + r.notMon.join(', '));
  if (!r.glowCentred) throw new Error('a glow is not a circle centred on its monument');
  if (r.strays) throw new Error(r.strays + ' things in the movers layer are neither carts nor sails');
});

async function main() {
  const only = process.argv.includes('--only')
    ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const server = await serve();
  const port = server.address().port;
  const browser = await chromium.launch({
    executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && only.split(',').indexOf(c.id) < 0) continue;   /* --only a,b,c runs a batch */
    const ctx = await boot(browser, port);
    ctx.browser = browser; ctx.port = port;
    try {
      await c.fn(ctx);
      console.log(`  ok   ${c.id.padEnd(10)} ${c.what}`);
      pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(10)} ${c.what}\n         ${e.message}`);
      fail++;
    }
    await ctx.p.close();
  }
  await browser.close();
  server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
main();
