/* THE CITY MUST NOT MOVE UNDER ITS OWN MONUMENT.
   Everything placed by board percentage — the monument in its scaffolding,
   the plot markers, the treasure, the yatri — has to keep the same cell at
   every zoom. It did not: those pins hung on the frame, which does not change
   size when you zoom, while the board does, so each step slid the monument
   across the city until it stood in the water.

   Measured as a fraction of the BOARD, which is the only frame of reference
   that means anything here. */
const { chromium } = require('playwright');
let fails = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS' : 'FAIL') + '  ' + n + (x !== undefined ? '  [' + x + ']' : '')); if (!ok) fails++; };

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8150/', { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    const st = {};
    window.IND_SABHYATA.sites.forEach(s => {
      st[s.id] = { lv: 2, zzz: s.era > 1, fade: -1, idle: 0, seen: s.era <= 1, found: s.era <= 1,
                   bld: {}, mon: false, neg: 0,
                   jobs: { kisan: 4, karigar: 1, kathakar: 1, rakshak: 0 }, hero: null };
    });
    localStorage.setItem('india.sabhyata.v2', JSON.stringify({
      era: 1, res: { anna: 900, kala: 900, katha: 900 }, sites: st, routes: [], t: 40,
      utsav: 0, ev: null, score: 0, won: false, quests: {}, qdone: 0, lastq: 0, tech: {},
      proj: null, rt: 0, warn: null, wonders: {}, capital: null, disp: null, lastd: 0,
      quizAt: {}, quizN: 0, kingdoms: {}, lastraid: 0, explorers: [] }));
  });
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(()=>{});
  await p.waitForTimeout(150);
  const nm = await p.$('#nm'); if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(350);
  await p.click('.navtab[data-v="khel"]'); await p.waitForTimeout(250);
  await p.click('.ghero'); await p.waitForTimeout(650);
  const shut = async () => { for (let i=0;i<5;i++){const bt=await p.$('#sab-ovhost .sab-btn'); if(!bt)return; await bt.click().catch(()=>{}); await p.waitForTimeout(170);} };
  await shut();
  await p.evaluate(() => {
    const hit = () => { const g = document.getElementById('sab-lothal'); if (!g) return;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); };
    hit(); return new Promise(r => setTimeout(() => { hit(); r(); }, 120));
  });
  await p.waitForTimeout(1000); await shut();
  check('the built board is open', await p.evaluate(() => !!document.querySelector('.sab-scene.iskit')));

  /* where the monument sits, as a fraction of the board it stands on */
  const where = () => p.evaluate(() => {
    const board = document.querySelector('.sab-kitboard');
    const mon = document.querySelector('.sab-scafbtn');
    if (!board || !mon) return null;
    const br = board.getBoundingClientRect(), mr = mon.getBoundingClientRect();
    if (!br.width || !br.height) return null;
    return { x: +(((mr.left + mr.width / 2) - br.left) / br.width).toFixed(4),
             y: +(((mr.top + mr.height / 2) - br.top) / br.height).toFixed(4),
             h: +(mr.height / br.height).toFixed(4) };
  });
  const zoomTo = async d => {
    await p.evaluate(d => {
      const b2 = document.querySelector('[data-sab-act="kitzoom"][data-d="' + d + '"]');
      if (b2) b2.click();
    }, d);
    await p.waitForTimeout(650);
  };
  const first = await where();
  check('the monument is on the board', !!first, JSON.stringify(first));
  /* NOT MOVING WOULD ALSO BE TRUE OF A MONUMENT NAILED TO THE MIDDLE.
     So check it stands where the city's own atlas puts it — kitPt run the
     same way the renderer runs it — before believing the rest. */
  const want = await p.evaluate(() => {
    const cid = window.__SAB().city, K = window.IND_KIT;
    const A = (window.IND_PLATES || {})[cid];
    if (!A || !A.mon) return null;
    const pt = K.mapPct(cid, A.mon[0], A.mon[1], window.__SABG().kitRot || 0, 5);
    return { x: +(pt[0] / 100).toFixed(4), y: +(pt[1] / 100).toFixed(4), raw: A.mon };
  });
  if (want) {
    console.log('  atlas says (' + want.x + ',' + want.y + ') from plate point ' + JSON.stringify(want.raw));
    /* the button is translated -50%,-84% of its own height, so its CENTRE is
       above the anchor by a third of its height — compare x, and y loosely */
    check('and it stands where the atlas puts it, not in the middle',
          Math.abs(first.x - want.x) < 0.02,
          'drawn at ' + first.x + ', atlas says ' + want.x);
  } else {
    console.log('  (this city has no traced monument point to check against)');
  }
  const seen = [{ z: await p.evaluate(() => window.__SABG().kitZ || 1), ...first }];
  for (const d of [1, 1, -1, -1, -1]) {
    await zoomTo(d);
    const w = await where();
    if (w) seen.push({ z: await p.evaluate(() => window.__SABG().kitZ || 1), ...w });
  }
  console.log('  ' + seen.map(s => s.z + '× (' + s.x + ',' + s.y + ') h' + s.h).join('  '));
  const dx = Math.max(...seen.map(s => Math.abs(s.x - first.x)));
  const dy = Math.max(...seen.map(s => Math.abs(s.y - first.y)));
  const dh = Math.max(...seen.map(s => Math.abs(s.h - first.h)));
  /* half a per cent of the board is a rounding wobble; a whole one is a slide */
  check('it keeps its place at every zoom', dx < 0.01 && dy < 0.01,
        'drifted ' + (dx * 100).toFixed(2) + '% across, ' + (dy * 100).toFixed(2) + '% down');
  check('and keeps its size relative to the board', dh < 0.01,
        'grew ' + (dh * 100).toFixed(2) + '% of the board');
  check('no errors', !errs.length, errs.slice(0, 2).join(' | ') || 'none');
  await b.close();
  console.log(fails ? '\n' + fails + ' FAILURES' : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('SUITE ERROR', e); process.exit(2); });
