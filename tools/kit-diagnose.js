/* Draw each placed piece's TRUE footprint diamond over the board, so the gap
   between art, shadow and cell is measurable rather than argued about. */
const { chromium } = require('playwright');
const tap = (p, sel) => p.evaluate(sel => { const el=document.querySelector(sel); if(!el) return false;
  for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) el.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true})); return true; }, sel);
const pick = async (p, pid) => {
  await p.evaluate(() => { if (!document.querySelector('.sab-drawer')) {
    const h=document.querySelector('.sab-dhandle'); if(h) h.dispatchEvent(new MouseEvent('click',{bubbles:true})); } });
  await p.waitForTimeout(130);
  const g = await p.evaluate(pid => { const i=window.IND_KIT_BUILD.items.find(z=>z.p===pid); return i?i.g:null; }, pid);
  await p.evaluate(g => { const t=document.querySelector('.sab-dtab[data-g="'+g+'"]'); if(t) t.dispatchEvent(new MouseEvent('click',{bubbles:true})); }, g);
  await p.waitForTimeout(130);
  await p.evaluate(pid => { const t=document.querySelector('.sab-tile[data-p="'+pid+'"]'); if(t) t.dispatchEvent(new MouseEvent('click',{bubbles:true})); }, pid);
};
const put = async (p, cx, cy) => p.evaluate(([cx,cy]) => {
  const K=window.IND_KIT, inr=document.getElementById('sab-kitinner');
  const C=window.IND_KIT_CITIES[window.__SAB().city], rot=window.__SABG().kitRot||0;
  const c=K.turn(cx,cy,1,1,rot,C.gw,C.gh), a=K.anchor(c.x,c.y,1,1);
  const ox=(rot%2?C.gw:C.gh)*K.W, k=parseFloat(inr.getAttribute('data-k'))||1;
  const r=inr.getBoundingClientRect();
  inr.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,
    clientX:r.left+(a.x+ox)*k, clientY:r.top+(a.y+5*K.RISE-16)*k}));
}, [cx,cy]);

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1340, height: 1100 }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:8150/?kit=1', { waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(()=>{});
  const nm = await p.$('#nm'); if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(400);
  await p.click('.navtab[data-v="khel"]'); await p.waitForTimeout(250);
  await p.click('.ghero'); await p.waitForTimeout(700);
  const over = await p.$('#sab-ovhost .sab-btn'); if (over) { await over.click(); await p.waitForTimeout(250); }
  await p.evaluate(() => { const g=window.__SABG(); g.res.anna=900; g.res.kala=900; g.res.katha=900; });
  await tap(p, '#sab-dholavira'); await p.waitForTimeout(400);
  await tap(p, '[data-sab-act="city"]'); await p.waitForTimeout(1400);
  const land = await p.evaluate(() => {
    const K=window.IND_KIT, cid=window.__SAB().city, C=window.IND_KIT_CITIES[cid], o=[];
    for (let y=0;y<C.gh;y++) for (let x=0;x<C.gw;x++)
      if (K.terrain(cid,x,y)==='land' && K.reach(cid,x,y)<=7) o.push([x,y]);
    return o; });
  for (const [pid,i] of [['hs-har-room',2],['wa-har-well',8],['bd-har-store',14],['hs-har-court',22]]) {
    await pick(p, pid); await p.waitForTimeout(110); await put(p, land[i][0], land[i][1]); await p.waitForTimeout(180);
  }
  await tap(p, '[data-sab-act="kitdrop"]'); await p.waitForTimeout(300);
  await tap(p, '[data-sab-act="kitzoom"][data-d="1"]'); await p.waitForTimeout(400);
  await tap(p, '[data-sab-act="kitzoom"][data-d="1"]'); await p.waitForTimeout(800);

  /* overlay: every built piece's footprint diamond in red, art bbox in cyan */
  const report = await p.evaluate(() => {
    const K=window.IND_KIT, inr=document.getElementById('sab-kitinner');
    const cid=window.__SAB().city, C=window.IND_KIT_CITIES[cid];
    const rot=window.__SABG().kitRot||0, HEAD=5;
    const svgNS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(svgNS,'svg');
    svg.setAttribute('style','position:absolute;left:0;top:0;overflow:visible;z-index:9999;pointer-events:none');
    svg.setAttribute('width', inr.style.width); svg.setAttribute('height', inr.style.height);
    inr.appendChild(svg);
    const out=[];
    (window.__SABG().sites[cid].kit||[]).forEach(bt => {
      const d=K.def(bt.p); if(!d) return;
      const L=d.d[0]||1, B=d.d[1]||1;
      const c=K.turn(bt.x,bt.y,L,B,rot,C.gw,C.gh);
      const ox=(rot%2?C.gw:C.gh)*K.W, oy=HEAD*K.RISE;
      const pt=(a,b)=>[(a-b)*K.W+ox,(a+b)*K.H+oy];
      const S=pt(c.x+c.L,c.y+c.B), N=pt(c.x,c.y), E=pt(c.x+c.L,c.y), W2=pt(c.x,c.y+c.B);
      const poly=document.createElementNS(svgNS,'polygon');
      poly.setAttribute('points',[N,E,S,W2].map(q=>q.join(',')).join(' '));
      poly.setAttribute('fill','none');
      poly.setAttribute('stroke','none');
      svg.appendChild(poly);
      /* the art element for this piece */
      const img=[...inr.querySelectorAll('img.kit-p')].find(im=>im.getAttribute('data-kit')===bt.p);
      const k=parseFloat(inr.getAttribute('data-k'))||1;
      const ir=inr.getBoundingClientRect();
      let art=null;
      if (img) { const r=img.getBoundingClientRect();
        art={ bottom:(r.bottom-ir.top)/k, cx:((r.left+r.right)/2-ir.left)/k, h:r.height/k, w:r.width/k }; }
      const sh=[...inr.querySelectorAll('.kit-shadow')];
      out.push({ p:bt.p, LxB:L+'x'+B, southY:S[1], southX:S[0],
                 artBottom: art? +art.bottom.toFixed(1):null,
                 artCx: art? +art.cx.toFixed(1):null,
                 gap: art? +(art.bottom - S[1]).toFixed(1):null });
    });
    return out;
  });
  console.log(JSON.stringify(report, null, 1));
  await p.evaluate(() => { const C=window.IND_KIT_CITIES[window.__SAB().city];
    window.IND_KIT.lookAt(window.__SAB().city, window.__SABG().kitRot||0, 5, C.centre); });
  await p.waitForTimeout(400);
  const sc = await p.evaluate(() => { const s=document.querySelector('.sab-scene'); const r=s.getBoundingClientRect();
    return {x:Math.max(0,Math.round(r.left)),y:Math.max(0,Math.round(r.top)),width:Math.round(r.width),height:Math.round(r.height)}; });
  await p.screenshot({ path: 'diag2.png', clip: sc });
  await b.close();
})().catch(e => { console.error('SUITE', e.message); process.exit(1); });
