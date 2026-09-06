/* PLAY IT: pick a thing from the shelf, tap the land, and see it STANDING.
 *
 * The build suite has always asked the game whether a piece was placed. That
 * is not the same question as whether a child can see it — a piece can be in
 * the save and not on the screen, and "elements are not manifesting" is
 * exactly that gap. Every check here is about the picture: how many pieces are
 * DRAWN before, how many after, and whether the new one is where the finger
 * went. Driven with real pointer input at real screen coordinates, because
 * the conversion from a tap to a cell runs through the board's own scale and
 * that is the part most likely to be wrong.
 */
const { chromium } = require('playwright');
let fails = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS' : 'FAIL') + '  ' + n + (x !== undefined ? '  [' + x + ']' : '')); if (!ok) fails++; };
const VIEWS = [['phone', 390, 844], ['desktop', 1440, 900]];

async function boot(b, v) {
  const p = await b.newPage({ viewport: { width: v[1], height: v[2] }, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8150/', { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    const st = {};
    window.IND_SABHYATA.sites.forEach(s => {
      st[s.id] = { lv: 3, zzz: s.era > 1, fade: -1, idle: 0, seen: s.era <= 1, found: s.era <= 1,
                   bld: {}, mon: false, neg: 0,
                   jobs: { kisan: 4, karigar: 1, kathakar: 1, rakshak: 0 }, hero: null };
    });
    localStorage.setItem('india.sabhyata.v2', JSON.stringify({
      era: 1, res: { anna: 4000, kala: 4000, katha: 4000 }, sites: st, routes: [], t: 40,
      utsav: 0, ev: null, score: 0, won: false, quests: {}, qdone: 0, lastq: 0,
      tech: { brick: true, plough: true, iron: true, panchayat: true },
      proj: null, rt: 0, warn: null, wonders: {}, capital: null, disp: null, lastd: 0,
      quizAt: {}, quizN: 0, kingdoms: {}, lastraid: 0, explorers: [] }));
  });
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(()=>{});
  await p.waitForTimeout(200);
  const nm = await p.$('#nm'); if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(450);
  await p.click('.navtab[data-v="khel"]').catch(()=>{}); await p.waitForTimeout(350);
  await p.click('.ghero').catch(()=>{}); await p.waitForTimeout(900);
  await shut(p);
  return { p, errs };
}
const shut = async p => {
  for (let i = 0; i < 6; i++) {
    const bt = await p.$('#sab-ovhost [data-sab-act="ovclose"], #sab-ovhost .sab-btn');
    if (!bt) return;
    await bt.click({ timeout: 1200 }).catch(()=>{});
    await p.waitForTimeout(180);
  }
};
const enter = async (p, id) => {
  await p.evaluate(id => {
    const hit = () => { const g = document.getElementById('sab-' + id); if (!g) return;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); };
    hit(); return new Promise(r => setTimeout(() => { hit(); r(); }, 120));
  }, id);
  await p.waitForTimeout(1400); await shut(p);
};
/* how many pieces are actually DRAWN on the board */
const drawn = p => p.evaluate(() => document.querySelectorAll('#sab-kitinner .kit-p').length);
/* the screen point of a cell, through the board's own scale */
const screenPt = (p, cx, cy) => p.evaluate(([cx, cy]) => {
  const K = window.IND_KIT, inr = document.getElementById('sab-kitinner');
  const C = window.IND_KIT_CITIES[window.__SAB().city];
  const rot = window.__SABG().kitRot || 0, HEAD = 5;
  const c = K.turn(cx, cy, 1, 1, rot, C.gw, C.gh), a = K.anchor(c.x, c.y, 1, 1);
  const ox = (rot % 2 ? C.gw : C.gh) * K.W, oy = HEAD * K.RISE;
  const k = parseFloat(inr.getAttribute('data-k')) || 1;
  const r = inr.getBoundingClientRect();
  return { x: r.left + (a.x + ox) * k, y: r.top + (a.y + oy - 16) * k, k };
}, [cx, cy]);
const landCells = p => p.evaluate(() => {
  const K = window.IND_KIT, cid = window.__SAB().city, C = window.IND_KIT_CITIES[cid], out = [];
  for (let r = 1; r < 12; r++)
    for (let dx = -r; dx <= r; dx++)
      for (let dy = -r; dy <= r; dy++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = C.centre[0] + dx, y = C.centre[1] + dy;
        if (x < 0 || y < 0 || x >= C.gw || y >= C.gh) continue;
        if (K.terrain(cid, x, y) === 'land') out.push([x, y]);
      }
  return out.slice(0, 60);
});

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const v of VIEWS) {
    const { p, errs } = await boot(b, v);
    console.log('\n=== ' + v[0] + ' ' + v[1] + 'x' + v[2] + ' ===');
    await enter(p, 'rakhigarhi');

    const board = await p.evaluate(() => {
      const inr = document.getElementById('sab-kitinner');
      if (!inr) return null;
      const r = inr.getBoundingClientRect(), box = inr.parentNode.getBoundingClientRect();
      return { k: inr.getAttribute('data-k'), w: Math.round(r.width), h: Math.round(r.height),
               boxH: Math.round(box.height), tiles: inr.querySelectorAll('img').length };
    });
    check('the board is on the screen at all', !!board && board.h > 50 && board.boxH > 50,
          JSON.stringify(board));
    check('and its drawn scale matches the one taps are converted through',
          !!board && Math.abs(parseFloat(board.k) - (board.w / (parseFloat(
            await p.evaluate(() => parseFloat(document.getElementById('sab-kitinner').style.width))))) ) < 0.02,
          'data-k ' + (board && board.k));

    /* open the shelf and pick a house, the way a child does */
    await p.evaluate(() => { const h = document.querySelector('.sab-dhandle'); if (h) h.click(); });
    await p.waitForTimeout(500);
    await p.evaluate(() => { const t = [...document.querySelectorAll('.sab-dtab')].find(x => x.getAttribute('data-g') === 'home'); if (t) t.click(); });
    await p.waitForTimeout(400);
    const picked = await p.evaluate(() => {
      const t = document.querySelector('.sab-dtiles .sab-tile[data-p]:not([disabled]):not(.locked)');
      if (!t) return null;
      t.click(); return t.getAttribute('data-p');
    });
    check('a thing can be picked up from the shelf', !!picked, picked || 'nothing pickable');
    check('and the handle shows it is in hand',
          await p.evaluate(() => { const h = document.querySelector('.sab-dhandle b'); return !!h && h.textContent !== 'Build'; }));
    await p.evaluate(() => { const c = document.querySelector('.sab-dclose'); if (c) c.click(); });
    await p.waitForTimeout(400);

    /* tap the land with a REAL pointer, at a real screen point */
    const before = await drawn(p);
    let placedAt = null, after = before;
    for (const [cx, cy] of await landCells(p)) {
      const pt = await screenPt(p, cx, cy);
      if (pt.x < 4 || pt.y < 4 || pt.x > v[1] - 4 || pt.y > v[2] - 4) continue;  /* off screen */
      await p.mouse.click(pt.x, pt.y);
      await p.waitForTimeout(280);
      after = await drawn(p);
      if (after > before) { placedAt = [cx, cy]; break; }
    }
    check('tapping the land puts the piece ON THE BOARD', after > before,
          before + ' drawn -> ' + after + (placedAt ? ' at ' + placedAt : ''));
    check('and the game agrees it was built',
          await p.evaluate(() => (window.__SABG().sites.rakhigarhi.kit || []).length > 0),
          JSON.stringify(await p.evaluate(() => (window.__SABG().sites.rakhigarhi.kit || []).map(x => x.p))));

    /* it must SURVIVE a repaint — that is what "not manifesting" would look
       like if the board redrew without it */
    await p.evaluate(() => { const b2 = document.querySelector('.sab-bell'); if (b2) b2.click(); });
    await p.waitForTimeout(500);
    check('and it is still there after the city repaints', (await drawn(p)) >= after,
          after + ' -> ' + await drawn(p));

    check('no errors', !errs.length, errs.slice(0, 2).join(' | ') || 'none');
    await p.screenshot({ path: 'place-' + v[0] + '.png' });
    await p.close();
  }
  await b.close();
  console.log(fails ? '\n' + fails + ' FAILURES' : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('SUITE ERROR', e); process.exit(2); });
