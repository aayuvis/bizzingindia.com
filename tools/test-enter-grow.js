/* Two questions a child asks: how do I get in, and where do I grow it?
   Driven with plain click events at a real double-click cadence, because that
   is what the app's own handler counts — and it keeps the run honest about
   which city failed rather than hanging on one. */
const { chromium } = require('playwright');
let fails = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS' : 'FAIL') + '  ' + n + (x !== undefined ? '  [' + x + ']' : '')); if (!ok) fails++; };

const boot = async (p, url) => {
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    const st = {};
    window.IND_SABHYATA.sites.forEach(s => {
      st[s.id] = { lv: 1, zzz: s.era > 1, fade: -1, idle: 0, seen: s.era <= 1, found: s.era <= 1,
                   bld: {}, mon: false, neg: 0,
                   jobs: { kisan: 2, karigar: 1, kathakar: 1, rakshak: 0 }, hero: null };
    });
    localStorage.setItem('india.sabhyata.v2', JSON.stringify({
      era: 0, res: { anna: 900, kala: 900, katha: 900 }, sites: st, routes: [], t: 40,
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
  await shut(p);
};
/* anything the world puts up between turns is dismissed, so it never counts
   as "the city would not open" */
const shut = async p => {
  for (let i = 0; i < 5; i++) {
    const bt = await p.$('#sab-ovhost [data-sab-act="ovclose"], #sab-ovhost .sab-btn');
    if (!bt) return;
    await bt.click({ timeout: 1500 }).catch(()=>{});
    await p.waitForTimeout(180);
  }
};
/* two clicks on the site node at a real double-click cadence */
const dbl = (p, id, gap) => p.evaluate(([id, gap]) => new Promise(res => {
  const fire = () => {
    const el = document.querySelector('#sab-' + id + ' .hit') || document.querySelector('#sab-' + id);
    if (!el) return false;
    for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
      el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true }));
    return true;
  };
  if (!fire()) return res('no node');
  setTimeout(() => res(fire() ? 'ok' : 'node went away'), gap);
}), [id, gap]);
const inCity = p => p.evaluate(() => {
  const s = document.querySelector('.sab-scene');
  const n = document.querySelector('.sab-nameplate b');
  return s ? (n ? n.textContent.replace(/[^\w ]/g, '').trim() : 'city') : null;
});
const growBox = p => p.evaluate(() => {
  const g = document.querySelector('[data-sab-act="grow"]');
  if (!g) return null;
  const r = g.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height),
           off: r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.left < -1 || r.top < -1 };
});
const leave = async p => {
  for (let i = 0; i < 3 && await inCity(p); i++) { await p.keyboard.press('Escape'); await p.waitForTimeout(350); }
  await shut(p);
};

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  /* one build now: there is no mode to run this twice for */
  for (const [label, url] of [['the app', 'http://localhost:8150/']]) {
    for (const [vp, w, h] of [['phone', 390, 844], ['desktop', 1200, 900]]) {
      const p = await b.newPage({ viewport: { width: w, height: h } });
      p.on('pageerror', e => console.log('PAGEERROR', e.message));
      await boot(p, url);
      const cities = await p.evaluate(() =>
        window.IND_SABHYATA.sites.filter(s => s.era <= 1).map(s => s.id));
      console.log('\n=== ' + label + ' / ' + vp + ' ===');
      const cold = [], noGrow = [], spill = [];
      for (const id of cities) {
        await dbl(p, id, 120);
        await p.waitForTimeout(650);
        const where = await inCity(p);
        if (!where) { cold.push(id); await leave(p); continue; }
        const g = await growBox(p);
        if (!g || !g.w || !g.h) noGrow.push(id + (g ? ' (0x0)' : ' (absent)'));
        else if (g.off) spill.push(id);
        await leave(p);
      }
      if (cold.length) console.log('  did not open cold: ' + cold.join(', '));
      if (noGrow.length) console.log('  no Grow: ' + noGrow.join(', '));
      check('every waking city opens on ONE cold double-tap', !cold.length,
            (cities.length - cold.length) + '/' + cities.length);
      check('and every one of them offers Grow', !noGrow.length,
            (cities.length - cold.length - noGrow.length) + ' with Grow');
      check('with Grow inside the frame', !spill.length, spill.join(', ') || 'none spilling');
      await p.close();
    }
  }
  await b.close();
  console.log(fails ? '\n' + fails + ' FAILURES' : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('SUITE ERROR', e); process.exit(2); });
