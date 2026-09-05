/* UI audit of the city view: phone, tablet, desktop; shelf open and shut. */
const { chromium } = require('playwright');
const VIEWS = [
  { n: 'phone',   w: 390,  h: 844,  touch: true },
  { n: 'tablet',  w: 820,  h: 1180, touch: true },
  { n: 'desktop', w: 1440, h: 900,  touch: false },
];
const openCity = async (p, sid) => {
  await p.evaluate(sid => { const g=document.getElementById('sab-'+sid);
    for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
      g.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true}));
    g.dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true})); }, sid);
  await p.waitForTimeout(1500);
};
async function boot(b, v) {
  const p = await b.newPage({ viewport: { width: v.w, height: v.h }, hasTouch: v.touch,
                              deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8150/?kit=1', { waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(()=>{});
  const nm = await p.$('#nm'); if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(400);
  await p.click('.navtab[data-v="khel"]'); await p.waitForTimeout(250);
  await p.click('.ghero'); await p.waitForTimeout(700);
  const ov = await p.$('#sab-ovhost .sab-btn'); if (ov) { await ov.click(); await p.waitForTimeout(250); }
  await p.evaluate(() => { const g=window.__SABG(); g.res.anna=500; g.res.kala=500; g.res.katha=500; });
  await openCity(p, 'dholavira');
  await p.waitForTimeout(600);
  return { p, errs };
}
const probe = p => p.evaluate(() => {
  const R = el => el.getBoundingClientRect();
  const out = { issues: [] };
  const doc = document.documentElement;
  if (doc.scrollWidth > doc.clientWidth + 2)
    out.issues.push('page scrolls sideways by ' + (doc.scrollWidth - doc.clientWidth) + 'px');
  const scene = document.querySelector('.sab-scene');
  const sr = scene ? R(scene) : null;
  /* every tappable thing big enough for a child's finger */
  const small = [];
  document.querySelectorAll('button,[data-sab-act],a[href]').forEach(el => {
    const r = R(el);
    if (r.width < 1 || r.height < 1) return;              /* hidden */
    if (r.bottom < 0 || r.top > innerHeight) return;      /* offscreen */
    if (Math.min(r.width, r.height) < 28)
      small.push((el.getAttribute('data-sab-act')||el.className||el.tagName)
                 + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  });
  if (small.length) out.issues.push('tap targets under 28px: ' + small.slice(0,8).join(', ')
                                    + (small.length>8?' (+'+(small.length-8)+')':''));
  /* HUD inside the scene bounds */
  if (sr) {
    document.querySelectorAll('.sab-nameplate,.sab-station,.sab-kitbar,.sab-dhandle,.sab-grow,.sab-drawer')
      .forEach(el => {
        const r = R(el);
        if (r.width < 1) return;
        if (r.left < sr.left - 2 || r.right > sr.right + 2 || r.top < sr.top - 2 || r.bottom > sr.bottom + 2)
          out.issues.push((el.className.split(' ')[0]) + ' spills out of the board frame');
      });
  }
  /* stations must not sit under the shelf */
  const dr = document.querySelector('.sab-drawer');
  if (dr) {
    const d = R(dr);
    document.querySelectorAll('.sab-station,.sab-nameplate').forEach(el => {
      const r = R(el);
      if (r.bottom > d.top + 4 && r.top < d.bottom && r.right > d.left && r.left < d.right)
        out.issues.push((el.className.split(' ')[0]) + ' is buried under the build shelf');
    });
  }
  out.scene = sr ? { w: Math.round(sr.width), h: Math.round(sr.height) } : null;
  out.board = (() => { const v=document.querySelector('.sab-view'); if(!v) return null;
    return { cw: v.clientWidth, sw: v.scrollWidth, ch: v.clientHeight, sh: v.scrollHeight }; })();
  out.zoom = window.__SABG().kitZ || 1;
  return out;
});
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const v of VIEWS) {
    const { p, errs } = await boot(b, v);
    console.log('\n=== ' + v.n + ' ' + v.w + 'x' + v.h + ' ===');
    let r = await probe(p);
    console.log(' shut  scene', JSON.stringify(r.scene), 'board', JSON.stringify(r.board), 'zoom', r.zoom);
    r.issues.forEach(i => console.log('   ! ' + i));
    await p.screenshot({ path: 'aud-' + v.n + '-shut.png' });
    /* open the shelf */
    await p.evaluate(() => { const h=document.querySelector('.sab-dhandle'); if(h) h.click(); });
    await p.waitForTimeout(500);
    r = await probe(p);
    console.log(' open');
    r.issues.forEach(i => console.log('   ! ' + i));
    await p.screenshot({ path: 'aud-' + v.n + '-open.png' });
    if (errs.length) console.log('   JS ' + errs.slice(0,3).join(' | '));
    await p.close();
  }
  await b.close();
})().catch(e => { console.error('SUITE', e.message); process.exit(1); });
