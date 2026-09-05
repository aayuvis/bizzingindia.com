/* WHERE IS EACH WORKER, REALLY?
   The same question the shadows needed, answered the same way: measure, do not
   look. For every figure on the board, find the piece it was drawn for and
   report the gap between the figure's feet and that piece's own standing
   point. Draws the piece footprints over the board too, so the picture and the
   numbers can be checked against each other. */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  await p.goto('http://localhost:8150/', { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    const K = window.IND_KIT, C = window.IND_KIT_CITIES.rakhigarhi, free = [];
    for (let r = 1; r < 10; r++) for (let dx=-r;dx<=r;dx++) for (let dy=-r;dy<=r;dy++) {
      if (Math.max(Math.abs(dx),Math.abs(dy))!==r) continue;
      const x=C.centre[0]+dx, y=C.centre[1]+dy;
      if (x<0||y<0||x>=C.gw||y>=C.gh) continue;
      if (K.terrain('rakhigarhi',x,y)!=='land') continue;
      if ((C.wild||[]).some(w => w.x===x && w.y===y)) continue;
      free.push([x,y]);
    }
    const kit = [], tiles = {}, take = n => free.splice(0, n);
    take(6).forEach(([x,y]) => { kit.push({p:'cr-wheat',x,y,f:0}); tiles[x+','+y]='cr-wheat'; });
    take(2).forEach(([x,y]) => kit.push({p:'bd-har-bead',x,y,f:0}));
    take(1).forEach(([x,y]) => kit.push({p:'bd-har-hall',x,y,f:0}));
    take(1).forEach(([x,y]) => kit.push({p:'wl-har-wall',x,y,f:0}));
    const st = {};
    window.IND_SABHYATA.sites.forEach(s => {
      st[s.id] = { lv: 3, zzz: s.era > 1, fade: -1, idle: 0, seen: s.era <= 1, found: s.era <= 1,
                   bld: {}, mon: true, neg: 0, jobs: { kisan: 5, karigar: 3, kathakar: 2, rakshak: 2 },
                   hero: null, kit: [], tiles: {} };
    });
    st.rakhigarhi.kit = kit; st.rakhigarhi.tiles = tiles;
    st.rakhigarhi.bld = { workshop: 1, prakara: 1 };
    localStorage.setItem('india.sabhyata.v2', JSON.stringify({
      era: 1, res: { anna: 9000, kala: 9000, katha: 9000 }, sites: st, routes: [], t: 40,
      utsav: 0, ev: null, score: 0, won: false, quests: {}, qdone: 0, lastq: 0,
      tech: { brick: true, iron: true, panchayat: true, plough: true },
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
    const hit = () => { const g = document.getElementById('sab-rakhigarhi'); if (!g) return;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); };
    hit(); return new Promise(r => setTimeout(() => { hit(); r(); }, 120));
  });
  await p.waitForTimeout(1100); await shut();

  const report = await p.evaluate(() => {
    const K = window.IND_KIT, cid = 'rakhigarhi', C = window.IND_KIT_CITIES[cid];
    const q = window.__SABG().sites[cid], rot = window.__SABG().kitRot || 0, HEAD = 5;
    const ox = (rot % 2 ? C.gw : C.gh) * K.W, oy = HEAD * K.RISE;
    const inr = document.getElementById('sab-kitinner');
    /* every standing point a piece has, in board px */
    const stand = [];
    const add = (part, x, y, L, B) => {
      const c = K.turn(x, y, L, B, rot, C.gw, C.gh), a = K.anchor(c.x, c.y, c.L, c.B);
      stand.push({ part, x: a.x + ox, y: a.y + oy });
    };
    q.kit.forEach(b => { const d = K.def(b.p); add(b.p, b.x, b.y, (d&&d.d[0])||1, (d&&d.d[1])||1); });
    Object.keys(q.tiles||{}).forEach(k => { const xy = k.split(','); add(q.tiles[k], +xy[0], +xy[1], 1, 1); });
    /* draw the standing points so the picture can be checked too */
    const mark = document.createElement('div');
    mark.style.cssText = 'position:absolute;inset:0;pointer-events:none';
    mark.innerHTML = stand.map(s2 => '<i style="position:absolute;left:' + s2.x + 'px;top:' + s2.y +
      'px;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;background:#ff2d6f;' +
      'box-shadow:0 0 0 1px #fff"></i>').join('');
    inr.appendChild(mark);
    /* each worker's feet, in the same board px */
    /* MEASURE AGAINST THE PIECE IT WAS DRAWN FOR, not the nearest one.
       Standing points sit about a tile apart, so "nearest" would call a
       worker correct whenever they landed on the wrong neighbour. Every
       figure carries the cell it belongs to. */
    const ws = [...document.querySelectorAll('.sab-kworker')].map(w => ({
      src: (w.getAttribute('src')||'').split('/').pop().replace('.png',''),
      at: w.getAttribute('data-at'), cell: w.getAttribute('data-cell'),
      x: parseFloat(w.style.left), y: parseFloat(w.style.top)
    }));
    const byCell = {};
    q.kit.forEach(b => { const d = K.def(b.p);
      const c = K.turn(b.x, b.y, (d&&d.d[0])||1, (d&&d.d[1])||1, rot, C.gw, C.gh);
      const a = K.anchor(c.x, c.y, c.L, c.B);
      byCell[b.x + ',' + b.y] = { x: a.x + ox, y: a.y + oy }; });
    Object.keys(q.tiles||{}).forEach(k => { const xy = k.split(',');
      const c = K.turn(+xy[0], +xy[1], 1, 1, rot, C.gw, C.gh);
      const a = K.anchor(c.x, c.y, 1, 1);
      byCell[k] = { x: a.x + ox, y: a.y + oy }; });
    const gaps = ws.map(w => {
      const own = byCell[w.cell];
      if (!own) return { who: w.src, on: w.at, off: 999, note: 'no such cell' };
      return { who: w.src, on: w.at,
               off: +Math.hypot(own.x - w.x, own.y - w.y).toFixed(1) };
    });
    return JSON.stringify({ pieces: stand.length, workers: ws.length, gaps }, null, 0);
  });
  const r = JSON.parse(report);
  console.log(r.pieces + ' standing points, ' + r.workers + ' workers');
  const byJob = {};
  r.gaps.forEach(g => { (byJob[g.who] = byJob[g.who] || []).push(g); });
  Object.keys(byJob).forEach(j => {
    const g = byJob[j];
    console.log('  ' + j.padEnd(11) + g.length + ' — nearest piece: ' +
      [...new Set(g.map(x => x.on))].join(', ') +
      '  worst off by ' + Math.max(...g.map(x => x.off)).toFixed(1) + 'px');
  });
  /* the deliberate lift is half a tile (16px) plus up to 13px of jitter
     when two share a spot, so anything past ~34px is a worker adrift */
  const bad = r.gaps.filter(g => g.off > 34);
  console.log(bad.length ? bad.length + ' workers are not standing on anything' : 'every worker stands on a piece');
  await p.screenshot({ path: 'crowd-diag.png' });
  /* and a close look at the board itself, which is the only way to judge
     whether a figure reads as a person doing a job */
  const box = await p.evaluate(() => {
    const v = document.querySelector('.sab-view') || document.querySelector('.sab-scene');
    const r = v.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
  });
  await p.screenshot({ path: 'crowd-board.png', clip: box });
  /* zoomed in, the way a child on a phone would see it */
  await p.evaluate(() => { const z = document.querySelector('[data-sab-act="kitzoom"][data-d="1"]');
    if (z) { z.click(); z.click(); } });
  await p.waitForTimeout(600);
  await p.screenshot({ path: 'crowd-zoom.png', clip: box });
  await b.close();
  process.exit(bad.length ? 1 : 0);
})().catch(e=>{console.error(e);process.exit(2)});
