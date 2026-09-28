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
 *   CHROME=/path/to/chrome node tools/check-sabhyata.js
 */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

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
  await p.click('[data-act="begin"]').catch(() => {});
  const nm = await p.$('#nm');
  if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(400);
  await p.click('.navtab[data-v="khel"]'); await p.waitForTimeout(250);
  await p.click('.ghero'); await p.waitForTimeout(900);
  const ov = await p.$('#sab-ovhost .sab-btn');
  if (ov) { await ov.click(); await p.waitForTimeout(250); }
  if (!await p.evaluate(() => typeof window.__SABG === 'function'))
    throw new Error('the game did not boot — no __SABG');
  return { p, errs };
}

const CHECKS = [];
const check = (id, what, fn) => CHECKS.push({ id, what, fn });

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
         Measuring the stage would read that strip as waste and fail correct work. */
      const b = svg.getBoundingClientRect();
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      svg.querySelectorAll('path.sab-terr').forEach(el => {
        const q = el.getBoundingClientRect();
        if (q.width < 1) return;
        x0 = Math.min(x0, q.left); y0 = Math.min(y0, q.top);
        x1 = Math.max(x1, q.right); y1 = Math.max(y1, q.bottom);
      });
      if (x1 < x0) return null;
      return { fw: (x1 - x0) / b.width, fh: (y1 - y0) / b.height };
    });
    if (!r) { bad.push(`${w}x${h}: no board`); continue; }
    if (r.fw < 0.85) bad.push(`${w}x${h}: the map is ${Math.round(r.fw * 100)}% of the board's width`);
    if (r.fh < 0.85) bad.push(`${w}x${h}: the map is ${Math.round(r.fh * 100)}% of the board's height`);
  }
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.waitForTimeout(300);
  if (bad.length) throw new Error('the board is letterboxed -- ' + bad.join('; '));
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

async function main() {
  const only = process.argv.includes('--only')
    ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const server = await serve();
  const port = server.address().port;
  const browser = await chromium.launch({
    executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await boot(browser, port);
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
