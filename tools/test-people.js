/* A BUILDING IS WHY THE CITY HAS SOMEBODY.
   Research opens buildings, buildings open people, people stand on the work
   they do, and tapping a building says all of that out loud. */
const { chromium } = require('playwright');
let fails = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS' : 'FAIL') + '  ' + n + (x !== undefined ? '  [' + x + ']' : '')); if (!ok) fails++; };

async function boot(b, mut) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8150/', { waitUntil: 'networkidle' });
  await p.evaluate(mut => {
    const st = {};
    window.IND_SABHYATA.sites.forEach(s => {
      st[s.id] = { lv: 3, zzz: s.era > 1, fade: -1, idle: 0, seen: s.era <= 1, found: s.era <= 1,
                   bld: {}, mon: false, neg: 0,
                   jobs: { kisan: 6, karigar: 0, kathakar: 0, rakshak: 0 }, hero: null };
    });
    const g = { era: 1, res: { anna: 4000, kala: 4000, katha: 4000 }, sites: st, routes: [], t: 40,
      utsav: 0, ev: null, score: 0, won: false, quests: {}, qdone: 0, lastq: 0, tech: {},
      proj: null, rt: 0, warn: null, wonders: {}, capital: null, disp: null, lastd: 0,
      quizAt: {}, quizN: 0, kingdoms: {}, lastraid: 0, explorers: [] };
    Object.assign(g, mut || {});
    localStorage.setItem('india.sabhyata.v2', JSON.stringify(g));
  }, mut);
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(()=>{});
  await p.waitForTimeout(150);
  const nm = await p.$('#nm'); if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(350);
  await p.click('.navtab[data-v="khel"]'); await p.waitForTimeout(250);
  await p.click('.ghero'); await p.waitForTimeout(650);
  await shut(p);
  return { p, errs };
}
const shut = async p => {
  for (let i = 0; i < 5; i++) {
    const bt = await p.$('#sab-ovhost [data-sab-act="ovclose"], #sab-ovhost .sab-btn');
    if (!bt) return;
    await bt.click({ timeout: 1500 }).catch(()=>{});
    await p.waitForTimeout(160);
  }
};
const open = async (p, id) => {
  await p.evaluate(id => {
    const hit = () => { const g = document.getElementById('sab-' + id); if (!g) return;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); };
    hit(); return new Promise(r => setTimeout(() => { hit(); r(); }, 120));
  }, id);
  await p.waitForTimeout(900); await shut(p);
};
const tab = async (p, g) => {
  await p.evaluate(g => {
    const h = document.querySelector('.sab-dhandle');
    if (h && !document.querySelector('.sab-drawer')) h.click();
  }, g);
  await p.waitForTimeout(350);
  const ok = await p.evaluate(g => {
    const t = [...document.querySelectorAll('.sab-dtab')].find(x => x.getAttribute('data-g') === g);
    if (!t) return false; t.click(); return true;
  }, g);
  await p.waitForTimeout(300);
  return ok;
};
const tiles = p => p.evaluate(() => [...document.querySelectorAll('.sab-dtiles .sab-tile')].map(t => ({
  p: t.getAttribute('data-p'), locked: t.classList.contains('locked'),
  person: t.classList.contains('sab-ptile'), text: (t.textContent||'').replace(/\s+/g,' ').trim().slice(0,44)
})));
/* PUT A PIECE DOWN SOMEWHERE IT WILL ACTUALLY GO.
   Naming a cell by hand does not survive contact with eight different maps —
   Dholavira's centre is (4,4) and the cell I first picked was open water. So
   the harness sweeps outward from the city's own heart for dry, in-reach land
   and keeps trying until the built count really rises. Anything else reports
   a click that was dispatched, not a building that stands. */
const cellsNear = p => p.evaluate(() => {
  const K = window.IND_KIT, cid = window.__SAB().city;
  const C = window.IND_KIT_CITIES[cid], out = [];
  for (let r = 1; r < 12; r++)
    for (let dx = -r; dx <= r; dx++)
      for (let dy = -r; dy <= r; dy++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = C.centre[0] + dx, y = C.centre[1] + dy;
        if (x < 0 || y < 0 || x >= C.gw || y >= C.gh) continue;
        if (K.terrain(cid, x, y) === 'land') out.push([x, y]);
      }
  return out.slice(0, 90);
});
const builtN = (p, part) => p.evaluate(part => {
  const g = window.__SABG(), q = g.sites[window.__SAB().city];
  return (q.kit || []).filter(b => b.p === part).length;
}, part);
const clickCell = (p, cx, cy) => p.evaluate(([cx, cy]) => {
  const K = window.IND_KIT, inr = document.getElementById('sab-kitinner');
  const C = window.IND_KIT_CITIES[window.__SAB().city];
  const rot = window.__SABG().kitRot || 0, HEAD = 5;
  const c = K.turn(cx, cy, 1, 1, rot, C.gw, C.gh), a = K.anchor(c.x, c.y, 1, 1);
  const ox = (rot % 2 ? C.gw : C.gh) * K.W, oy = HEAD * K.RISE;
  const k = parseFloat(inr.getAttribute('data-k')) || 1;
  const r = inr.getBoundingClientRect();
  inr.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true,
    clientX: r.left + (a.x + ox) * k, clientY: r.top + (a.y + oy - 16) * k }));
}, [cx, cy]);
async function place(p, part) {
  const pick = await p.evaluate(part => {
    const t = [...document.querySelectorAll('.sab-tile')].find(x => x.getAttribute('data-p') === part);
    if (!t) return 'no tile';
    if (t.disabled || t.classList.contains('locked')) return 'locked';
    t.click(); return 'held';
  }, part);
  if (pick !== 'held') return { how: pick };
  const before = await builtN(p, part);
  for (const [cx, cy] of await cellsNear(p)) {
    await clickCell(p, cx, cy);
    await p.waitForTimeout(140);
    if (await builtN(p, part) > before) return { how: 'ok', at: [cx, cy] };
  }
  return { how: 'refused everywhere' };
}
const card = p => p.evaluate(() => {
  const c = document.querySelector('#sab-ovhost .sab-card');
  return c ? (c.textContent || '').replace(/\s+/g, ' ').trim() : null;
});
const jobs = p => p.evaluate(() => window.__SABG().sites[window.__SAB().city].jobs);
const crowd = p => p.evaluate(() => document.querySelectorAll('.sab-kworker').length);

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  /* ---- 1 · research is visible in the shop, and it bites ---- */
  let { p, errs } = await boot(b, {});
  await open(p, 'dholavira');
  await tab(p, 'guard');
  let ts = await tiles(p);
  const wall = ts.find(t => t.p === 'wl-har-wall');
  check('an unresearched building is SHOWN, not hidden', !!wall, wall ? wall.text : ts.map(t=>t.p).join(','));
  check('and it is shown locked, naming the research', !!wall && wall.locked && /Brick/i.test(wall.text),
        wall && wall.text);
  const refused = await place(p, 'wl-har-wall');
  check('a locked building cannot be placed', refused.how === 'locked', refused.how);

  /* ---- 2 · people are a shelf, and gated by what stands ---- */
  const gotPeople = await tab(p, 'people');
  check('the shop has a People shelf', gotPeople);
  ts = await tiles(p);
  const byName = n => ts.find(t => new RegExp(n, 'i').test(t.text));
  check('kisan are always open', !!byName('kisan') && !byName('kisan').locked, byName('kisan') && byName('kisan').text);
  const kar = byName('karigar');
  check('karigar are locked until something is built for them', !!kar && kar.locked, kar && kar.text);
  check('and the tile says what to build', !!kar && /needs/i.test(kar.text), kar && kar.text);
  const before = await jobs(p);
  await p.evaluate(() => {
    const t = [...document.querySelectorAll('.sab-ptile')].find(x => /karigar/i.test(x.textContent));
    const plus = t && t.querySelector('[data-d="1"]'); if (plus) plus.click();
  });
  await p.waitForTimeout(300);
  check('a locked role cannot be hired', (await jobs(p)).karigar === before.karigar,
        JSON.stringify(await jobs(p)));

  /* ---- 3 · build the workshop and the karigar unlocks ---- */
  await tab(p, 'work');
  const put = await place(p, 'bd-har-bead');
  check('the bead workshop goes down', put.how === 'ok', put.how + ' ' + (put.at || ''));
  await p.waitForTimeout(400);
  await tab(p, 'people');
  ts = await tiles(p);
  const kar2 = ts.find(t => /karigar/i.test(t.text));
  check('now a karigar has somewhere to work', !!kar2 && !kar2.locked, kar2 && kar2.text);
  await p.evaluate(() => {
    const t = [...document.querySelectorAll('.sab-ptile')].find(x => /karigar/i.test(x.textContent));
    const plus = t && t.querySelector('[data-d="1"]'); if (plus) plus.click();
  });
  await p.waitForTimeout(400);
  check('and can be hired from the shop', (await jobs(p)).karigar > 0, JSON.stringify(await jobs(p)));

  /* ---- 4 · they stand on the work ---- */
  const n1 = await crowd(p);
  check('the praja are drawn on the board', n1 > 0, n1 + ' figures');
  await p.evaluate(() => {
    const t = [...document.querySelectorAll('.sab-ptile')].find(x => /karigar/i.test(x.textContent));
    const plus = t && t.querySelector('[data-d="1"]'); if (plus) plus.click();
  });
  await p.waitForTimeout(400);
  check('hiring another one puts another figure out', (await crowd(p)) > n1, n1 + ' -> ' + await crowd(p));

  /* ---- 5 · tapping the building says what it is ---- */
  await p.evaluate(() => { const c = document.querySelector('.sab-dclose'); if (c) c.click(); });
  await p.waitForTimeout(300);
  /* HANDS FULL MEANS PLACING. Buying a piece leaves it in hand so a child can
     put down a row of them, so a tap on the board is still "another one here"
     until the piece goes back. Escape empties the hands; only then does a tap
     mean "tell me about this". */
  await p.keyboard.press('Escape');
  await p.waitForTimeout(350);
  check('the city is still open after putting the piece back',
        await p.evaluate(() => !!window.__SAB().city));
  await clickCell(p, put.at[0], put.at[1]);
  await p.waitForTimeout(500);
  const c1 = await card(p);
  check('tapping a building opens its card', !!c1, (c1 || 'no card').slice(0, 60));
  check('the card says what it pays', !!c1 && /every turn/.test(c1));
  check('and who works there', !!c1 && /Who works here/i.test(c1) && /Karigar/.test(c1));
  const kb = (await jobs(p)).karigar;
  await p.evaluate(() => {
    const pl = document.querySelector('#sab-ovhost .sab-pcrew [data-d="1"]'); if (pl) pl.click();
  });
  await p.waitForTimeout(450);
  check('you can hire from the building itself', (await jobs(p)).karigar > kb,
        kb + ' -> ' + (await jobs(p)).karigar);
  const c2 = await card(p);
  check('and the card updates under your thumb', !!c2 && c2 !== c1);
  check('no errors', !errs.length, errs.slice(0, 2).join(' | ') || 'none');
  await p.close();

  /* ---- 6 · with the research done, the wall unlocks ---- */
  const r2 = await boot(b, { tech: { brick: true, iron: true, panchayat: true, plough: true } });
  await open(r2.p, 'dholavira');
  await tab(r2.p, 'guard');
  const ts2 = await tiles(r2.p);
  const wall2 = ts2.find(t => t.p === 'wl-har-wall');
  check('research done, the wall is buyable', !!wall2 && !wall2.locked, wall2 && wall2.text);
  const put2 = await place(r2.p, 'wl-har-wall');
  await r2.p.waitForTimeout(400);
  check('and it goes down', put2.how === 'ok', put2.how + ' ' + (put2.at || ''));
  await tab(r2.p, 'people');
  const ts3 = await tiles(r2.p);
  const rk = ts3.find(t => /rakshak/i.test(t.text));
  check('a wall is what buys the city a watch', !!rk && !rk.locked, rk && rk.text);
  check('no errors with research done', !r2.errs.length, r2.errs.slice(0, 2).join(' | ') || 'none');
  await r2.p.close();

  await b.close();
  console.log(fails ? '\n' + fails + ' FAILURES' : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('SUITE ERROR', e); process.exit(2); });
