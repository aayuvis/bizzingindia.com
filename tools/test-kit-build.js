/* The builder: a city from zero. */
const { chromium } = require('playwright');
let fails = 0;
const check = (n, ok, x) => { console.log((ok?'PASS':'FAIL')+'  '+n+(x!==undefined?'  ['+x+']':'')); if(!ok) fails++; };
const openShelf = async (p) => { if (!(await p.$('.sab-drawer'))) { await p.evaluate(() => { const h=document.querySelector('.sab-dhandle'); if(h) h.dispatchEvent(new MouseEvent('click',{bubbles:true})); }); await p.waitForTimeout(260); } };
const tap = (p, sel) => p.evaluate(sel => { const el=document.querySelector(sel); if(!el) return false;
  for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) el.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true})); return true; }, sel);
/* the shelf is tabbed: open it, go to the group the thing lives in, take it */
const pick = async (p, pid) => {
  await p.evaluate(async (pid) => {
    const click = el => el && el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
    if (!document.querySelector('.sab-drawer')) click(document.querySelector('.sab-dhandle'));
  }, pid);
  await p.waitForTimeout(240);
  const g = await p.evaluate(pid => {
    const it = window.IND_KIT_BUILD.items.find(i => i.p === pid); return it ? it.g : null; }, pid);
  await p.evaluate(g => {
    const t = document.querySelector('.sab-dtab[data-g="' + g + '"]');
    if (t) t.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
  }, g);
  await p.waitForTimeout(240);
  return await p.evaluate(pid => {
    const t = document.querySelector('.sab-tile[data-p="' + pid + '"]');
    if (!t) return false;
    t.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
    return true;
  }, pid);
};
/* everything the shelf would show, across every tab. Each tab click repaints
   the city, so the node list has to be re-read every time rather than walked. */
const allOffered = async (p) => {
  const tabs = await p.evaluate(() =>
    [...document.querySelectorAll('.sab-dtab')].map(t => t.getAttribute('data-g')));
  const out = [];
  for (const g of tabs) {
    await p.evaluate(g => {
      const t = document.querySelector('.sab-dtab[data-g="' + g + '"]');
      if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }, g);
    await p.waitForTimeout(160);
    const got = await p.evaluate(() =>
      [...document.querySelectorAll('.sab-tile')].map(x => x.getAttribute('data-p')));
    out.push(...got);
  }
  return out;
};
const peek = p => p.evaluate(() => window.__SAB ? window.__SAB() : null);
const G = p => p.evaluate(() => window.__SABG ? window.__SABG() : null);

async function openCity(p, sid) {
  await tap(p, '#sab-' + sid); await p.waitForTimeout(400);
  await tap(p, '[data-sab-act="city"]'); await p.waitForTimeout(1400);
}
/* place the held piece on a cell by clicking its true screen point */
async function place(p, cx, cy) {
  return await p.evaluate(([cx,cy]) => {
    const K=window.IND_KIT, inr=document.getElementById('sab-kitinner');
    const C=window.IND_KIT_CITIES[window.__SAB().city];
    const rot=window.__SABG().kitRot||0, HEAD=5;
    const c=K.turn(cx,cy,1,1,rot,C.gw,C.gh), a=K.anchor(c.x,c.y,1,1);
    const ox=(rot%2?C.gw:C.gh)*K.W, oy=HEAD*K.RISE;
    const k=parseFloat(inr.getAttribute('data-k'))||1;
    const r=inr.getBoundingClientRect();
    const ev={bubbles:true,cancelable:true,clientX:r.left+(a.x+ox)*k,clientY:r.top+(a.y+oy-16)*k};
    inr.dispatchEvent(new MouseEvent('click',ev));
    return true;
  }, [cx,cy]);
}

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1340, height: 1100 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8150/?kit=1', { waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(()=>{});
  const nm = await p.$('#nm'); if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(400);
  await p.click('.navtab[data-v="khel"]'); await p.waitForTimeout(250);
  await p.click('.ghero'); await p.waitForTimeout(700);
  const over = await p.$('#sab-ovhost .sab-btn'); if (over) { await over.click(); await p.waitForTimeout(250); }
  /* give her coin to build with */
  await p.evaluate(() => { const g=window.__SABG(); g.res.anna=400; g.res.kala=400; g.res.katha=400; });
  await openCity(p, 'dholavira');

  /* ---- 1 · the city starts as land, not as a city ---- */
  const st0 = await p.evaluate(() => ({
    built: (window.__SABG().sites.dholavira.kit||[]).length,
    pieces: document.querySelectorAll('.sab-kitboard .kit-p').length,
    shop: document.querySelectorAll('.sab-dhandle').length,
    far: document.querySelectorAll('.kit-far').length
  }));
  check('a new city has nothing built on it', st0.built === 0, st0.built);
  check('but the land is not bare — trees are already there', st0.pieces > 0, st0.pieces);
  check('the board carries a build handle, not a page of rows', st0.shop === 1, st0.shop);
  check('land beyond the reach is dimmed', st0.far > 0, st0.far);

  /* ---- 2 · pick, hold, place ---- */
  await pick(p, 'cr-millet'); await p.waitForTimeout(500);
  check('picking a thing puts it in her hands', await p.evaluate(() => {
    const h = document.querySelector('.sab-dhandle b'); return !!h && h.textContent !== 'Build'; }));
  check('and the shelf gets out of the way of the land', !(await p.$('.sab-drawer')));
  const before = await p.evaluate(() => window.__SABG().res.anna);
  /* find the free land cells this city may actually build on */
  const land = await p.evaluate(() => {
    const K=window.IND_KIT, cid=window.__SAB().city, C=window.IND_KIT_CITIES[cid];
    const out=[];
    for (let y=0;y<C.gh;y++) for (let x=0;x<C.gw;x++)
      if (K.terrain(cid,x,y)==='land' && K.reach(cid,x,y)<=7) out.push([x,y]);
    return out;
  });
  console.log('      (free land within reach: ' + land.length + ' cells)');
  await place(p, land[0][0], land[0][1]); await p.waitForTimeout(700);
  const after = await p.evaluate(() => ({
    anna: window.__SABG().res.anna,
    kit: window.__SABG().sites.dholavira.kit.length,
    tiles: Object.keys(window.__SABG().sites.dholavira.tiles||{}).length
  }));
  check('setting it down costs what it said', after.anna === before - 6, before + ' -> ' + after.anna);
  check('and the city now has one thing built', after.kit === 1, after.kit);
  check('a field becomes the ground, not a box on it', after.tiles === 1, after.tiles);

  /* ---- 3 · it pays out, every turn ---- */
  const y = await p.evaluate(() => {
    const D=window.IND_SABHYATA; return window.__SABG().sites.dholavira.kit.length; });
  await pick(p, 'hs-har-room'); await p.waitForTimeout(400);
  const pop0 = await p.evaluate(() => { const m=document.querySelector('.sab-nameplate span'); return m?m.textContent:''; });
  await place(p, land[3][0], land[3][1]); await p.waitForTimeout(700);
  const pop1 = await p.evaluate(() => { const m=document.querySelector('.sab-nameplate span'); return m?m.textContent:''; });
  check('a home adds a praja to the city', pop0 !== pop1, pop1.slice(0,26));

  /* ---- the age builds in its own idiom ---- */
  await p.evaluate(() => { const d=document.querySelector('[data-sab-act="kitdrop"]');
    if (d) d.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    if (!document.querySelector('.sab-drawer')) {
      const h=document.querySelector('.sab-dhandle'); if(h) h.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
  await p.waitForTimeout(350);
  const era0 = await allOffered(p);
  const later = ['hs-hut-round','bd-granary','wa-well','bd-shrine-small','bd-workshop','wl-mud'];
  check('era 0 is offered nothing from a later age',
        !later.some(x => era0.indexOf(x) >= 0),
        later.filter(x => era0.indexOf(x) >= 0).join(' ') || 'clean');
  check('and is offered the Indus set instead',
        ['hs-har-room','hs-har-mud','wa-har-well','wl-har-wall','bd-har-bead','bd-har-store']
          .every(x => era0.indexOf(x) >= 0), era0.filter(x=>x.indexOf('-har-')>0).join(' '));
  check('Dholavira alone builds on dressed stone', era0.indexOf('hs-har-stone') >= 0);
  const ghosts = await p.evaluate(() =>
    [...document.querySelectorAll('.sab-plot')].filter(e => !e.classList.contains('built')).length);
  check('and the old plot row no longer offers a later age on the board', ghosts === 0, ghosts + ' ghost plots');

  /* ---- 4 · the rules bite ---- */
  await pick(p, 'hs-har-room'); await p.waitForTimeout(300);
  await place(p, land[3][0], land[3][1]); await p.waitForTimeout(500);
  const k2 = await p.evaluate(() => window.__SABG().sites.dholavira.kit.length);
  check('nothing may stand on top of something else', k2 === 2, k2);
  await place(p, 0, 0); await p.waitForTimeout(500);
  const k3 = await p.evaluate(() => window.__SABG().sites.dholavira.kit.length);
  check('and nothing may be built beyond the reach', k3 === 2, k3);

  /* ---- 5 · keyboard builds too (house rule) ---- */
  await pick(p, 'cr-millet'); await p.waitForTimeout(300);
  await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowDown');
  await p.waitForTimeout(300);
  await p.keyboard.press('Enter'); await p.waitForTimeout(700);
  const k4 = await p.evaluate(() => window.__SABG().sites.dholavira.kit.length);
  check('the arrows and Enter build without a mouse', k4 === 3, k4);

  /* ---- 6 · zoom and scroll ---- */
  await tap(p, '[data-sab-act="kitzoom"][data-d="1"]'); await p.waitForTimeout(900);
  const z = await p.evaluate(() => ({ z: window.__SABG().kitZ,
    scrollable: (() => { const s=document.querySelector('.sab-scene'); return s.scrollWidth > s.clientWidth + 4; })() }));
  check('the board zooms in', z.z > 1, z.z);
  check('and once bigger than its window, the city scrolls', z.scrollable, z.scrollable);
  const look = await p.evaluate(() => {
    const s=document.querySelector('.sab-scene');
    return { l: Math.round(s.scrollLeft), t: Math.round(s.scrollTop) };
  });
  check('and it looks at the city, not at an empty corner', look.l > 0 || look.t > 0,
        'scroll ' + look.l + ',' + look.t);

  /* ---- 7 · the menu is the city's own, and grows with it ---- */
  await p.evaluate(() => { const h=document.querySelector('.sab-dhandle'); if(h) h.dispatchEvent(new MouseEvent('click',{bubbles:true})); });
  await p.waitForTimeout(300);
  const at1 = await allOffered(p);
  check('a level-1 city is not shown level-2 things', at1.indexOf('wa-reservoir') < 0, at1.length + ' items at lv1');
  await p.evaluate(() => { window.__SABG().sites.dholavira.lv = 2; });
  await tap(p, '[data-sab-act="kitturn"]'); await p.waitForTimeout(900);
  await p.evaluate(() => { if(!document.querySelector('.sab-drawer')){const h=document.querySelector('.sab-dhandle'); if(h) h.dispatchEvent(new MouseEvent('click',{bubbles:true}));} });
  await p.waitForTimeout(300);
  const at2 = await allOffered(p);
  check('grown to level 2, Dholavira is offered its own reservoirs',
        at2.indexOf('wa-reservoir') >= 0, at2.length + ' items at lv2');
  await p.evaluate(() => { const d=document.querySelector('[data-sab-act="kitdrop"]');
    if (d) d.dispatchEvent(new MouseEvent('click',{bubbles:true})); });
  await p.waitForTimeout(300);
  check('and the reach grew with it', await p.evaluate(() => {
    const h = document.querySelector('.sab-dhint'); return !!h && /reach 10/.test(h.textContent); }));
  /* a great work belongs to one city only */
  const elsewhere = await p.evaluate(() => {
    const D=window.IND_KIT_BUILD.items.find(i=>i.p==='wa-reservoir');
    return D && D.only && D.only.length === 1 && D.only[0] === 'dholavira';
  });
  check('and to no other city, ever', elsewhere);

  /* ---- 8 · every city grows its own, and grows it everywhere ---- */
  const crops = await p.evaluate(() => {
    const c = window.IND_KIT_BUILD.items.filter(i => i.g === 'field' && i.only);
    return { n: c.length, cities: c.map(x => x.only[0]), parts: c.map(x => x.p),
             many: c.every(x => x.many) };
  });
  check('every city is given a crop of its own', crops.n === 8, crops.cities.join(' '));
  check('and no two cities share one', new Set(crops.parts).size === 8, crops.parts.join(' '));
  check('a crop may be sown all over its own city', crops.many);
  const sown = await p.evaluate(() => window.__SABG().sites.dholavira.kit.filter(b=>b.p==='cr-millet').length);
  check('Dholavira sows bajra, not wheat', sown >= 1, sown + ' millet fields');
  const painted = await p.evaluate(() => (window.IND_KIT_GROUND||[]).filter(g=>g.indexOf('cr-')===0).length);
  check('every crop has a painted field to stand on', painted >= 8, painted + ' crop fields');

  /* ---- 9 · nothing floats: the shadow comes from the ART, not the cell ---- */
  const feet = await p.evaluate(() => {
    const K = window.IND_KIT, out = {};
    /* a footprint-sized shadow sticks out past the walls, because the drawing
       does not fill its cell; an art-sized one cannot */
    out.tight = K.shadowFor(100, 200, 64);
    out.wide  = K.shadowFor(100, 200, 192);
    out.nudge = [[1,1],[2,1],[1,3],[3,2]].map(([L,B]) => K.artNudge(L, B));
    out.gone  = typeof K.shadowAt;
    return out;
  });
  check('the shadow is sized from the drawing, not the footprint',
        feet.tight.w < 64 && Math.abs(feet.wide.w / feet.tight.w - 3) < 0.01,
        feet.tight.w + ' / ' + feet.wide.w);
  check('and it sits under where the drawing ends',
        feet.tight.x === 100 && feet.tight.y < 200 && 200 - feet.tight.y < 6,
        JSON.stringify(feet.tight));
  check('the footprint-derived shadow is gone for good', feet.gone === 'undefined');
  check('a long piece is still nudged onto its own vertex',
        feet.nudge[0] === 0 && feet.nudge[1] === 16 && feet.nudge[2] === -32 && feet.nudge[3] === 16,
        feet.nudge.join(' '));
  const onboard = await p.evaluate(() => {
    const inr = document.getElementById('sab-kitinner');
    const k = parseFloat(inr.getAttribute('data-k')) || 1;
    const r = inr.getBoundingClientRect();
    const out = [];
    inr.querySelectorAll('img.kit-p').forEach(im => {
      const ir = im.getBoundingClientRect();
      let best = 1e9;
      inr.querySelectorAll('.kit-shadow').forEach(sd => {
        const sr = sd.getBoundingClientRect();
        const d = Math.hypot((sr.left+sr.right)/2 - (ir.left+ir.right)/2,
                             (sr.top+sr.bottom)/2 - ir.bottom);
        if (d < best) best = d;
      });
      out.push(best / k);
    });
    return out;
  });
  check('every piece on the board has a shadow at its feet',
        onboard.length > 0 && onboard.every(d => d < 14),
        onboard.length + ' pieces, worst ' + Math.max(...onboard).toFixed(1) + 'px off');

  await p.screenshot({ path: 'build-1.png' });
  console.log('errors:', errs.slice(0,4).join(' | ') || 'none');
  await b.close();
  console.log(fails ? '\n' + fails + ' FAILURES' : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('SUITE', e.message); process.exit(2); });
