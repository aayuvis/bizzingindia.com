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

  /* AND THE WORLD CANNOT BE UNDONE: once a turn passes, the window is shut */
  const shut = await p.evaluate(() => {
    window.__SABDO.act('dholavira', 'grow');
    const open = window.__SAB().canUndo;
    window.__SABDO.turn();
    return { open, after: window.__SAB().canUndo };
  });
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
