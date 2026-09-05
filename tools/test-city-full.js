/* THE CITY IS THE WHOLE SCREEN, AND EVERYTHING IT HAS TO SAY IS IN IT.
   Nothing hangs under the board any more: the tellings and the works are
   raised from the bell, the questions with them. So the things worth checking
   are that nothing is left below, that the surface really is the window (and
   really is on top of the app's own bar), that it opens leaned in and looking
   at something, and that where you are looking survives a repaint. */
const { chromium } = require('playwright');
let fails = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS' : 'FAIL') + '  ' + n + (x !== undefined ? '  [' + x + ']' : '')); if (!ok) fails++; };
const VIEWS = [['phone', 390, 844], ['desktop', 1440, 900]];

async function boot(b, v) {
  const p = await b.newPage({ viewport: { width: v[1], height: v[2] } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8150/', { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    const st = {};
    window.IND_SABHYATA.sites.forEach(s => {
      st[s.id] = { lv: 3, zzz: s.era > 1, fade: -1, idle: 0, seen: s.era <= 1, found: s.era <= 1,
                   bld: { gurukul: 1 }, mon: false, neg: 0,
                   jobs: { kisan: 5, karigar: 1, kathakar: 1, rakshak: 0 }, hero: null };
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
  await shut(p);
  return { p, errs };
}
const shut = async p => {
  for (let i = 0; i < 5; i++) {
    const bt = await p.$('#sab-ovhost [data-sab-act="ovclose"], #sab-ovhost .sab-btn');
    if (!bt) return;
    await bt.click({ timeout: 1500 }).catch(()=>{});
    await p.waitForTimeout(170);
  }
};
const open = async (p, id) => {
  await p.evaluate(id => {
    const hit = () => { const g = document.getElementById('sab-' + id); if (!g) return;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); };
    hit(); return new Promise(r => setTimeout(() => { hit(); r(); }, 120));
  }, id);
  await p.waitForTimeout(1300); await shut(p);
};
const card = p => p.evaluate(() => {
  const c = document.querySelector('#sab-ovhost .sab-card');
  return c ? (c.textContent || '').replace(/\s+/g, ' ').trim() : null;
});
const view = p => p.evaluate(() => {
  const v = document.getElementById('sab-view');
  return v ? { l: Math.round(v.scrollLeft), t: Math.round(v.scrollTop),
               sw: v.scrollWidth, cw: v.clientWidth, sh: v.scrollHeight, ch: v.clientHeight } : null;
});

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const v of VIEWS) {
    const { p, errs } = await boot(b, v);
    console.log('\n=== ' + v[0] + ' ' + v[1] + 'x' + v[2] + ' ===');
    await open(p, 'lothal');

    const geo = await p.evaluate(() => {
      const sc = document.querySelector('.sab-scene');
      const r = sc.getBoundingClientRect();
      const host = document.getElementById('sab-cityhost');
      /* WHAT IS LEFT UNDER THE BOARD. Count real content, not the wrapper's
         padding: the scene is position:fixed and out of flow, so its wrapper
         collapses to whatever ELSE is in it, which should be nothing. */
      let below = 0;
      const wrap = sc.parentElement;
      if (wrap) [...wrap.children].forEach(c => { if (c !== sc) below += c.offsetHeight; });
      if (host) [...host.children].forEach(c => { if (c !== wrap && c !== sc) below += c.offsetHeight; });
      /* is the app's own sticky bar painting over the city? */
      const bar = document.querySelector('.topbar');
      const mid = document.elementFromPoint(Math.round(innerWidth / 2), 30);
      return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top),
               full: sc.classList.contains('full'),
               locked: document.body.classList.contains('sab-full'),
               below,
               barOnTop: !!(bar && mid && bar.contains(mid)),
               zoom: window.__SABG().kitZ };
    });
    check('the city fills the window', geo.full && geo.w === v[1] && geo.h === v[2] && geo.top === 0,
          JSON.stringify({ w: geo.w, h: geo.h, top: geo.top }));
    check('and nothing is left hanging under it', geo.below === 0, geo.below + 'px below');
    check('the page behind it cannot scroll', geo.locked);
    check("the app's own bar is not painting over it", !geo.barOnTop);
    check('it opens leaned in', geo.zoom === 2, geo.zoom + '×');

    const vw = await view(p);
    check('the board fills the frame both ways', !!vw && vw.sw >= vw.cw && vw.sh >= vw.ch,
          vw ? vw.sw + 'x' + vw.sh + ' in ' + vw.cw + 'x' + vw.ch : 'no view');
    check('and it opens looking at the city, not at a corner', !!vw && (vw.l > 0 || vw.t > 0),
          vw ? 'scrolled to ' + vw.l + ',' + vw.t : 'no view');

    /* the bell, and everything that used to be a card down the page */
    check('there is a bell', await p.evaluate(() => !!document.querySelector('.sab-bell')));
    await p.evaluate(() => document.querySelector('.sab-bell').click());
    await p.waitForTimeout(400);
    const rows = await p.evaluate(() =>
      [...document.querySelectorAll('.sab-callrow')].map(r => r.getAttribute('data-c')));
    check('it lists what the city has to say', rows.indexOf('works') >= 0 && rows.indexOf('about') >= 0,
          rows.join(', '));
    check('including the gurukul, which is a thing to do', rows.indexOf('guru') >= 0, rows.join(', '));

    /* WHERE YOU WERE LOOKING SURVIVES A REPAINT — opening the bell is one */
    const vw2 = await view(p);
    check('opening the bell did not throw the camera back to the corner',
          !!vw2 && Math.abs(vw2.l - vw.l) < 4 && Math.abs(vw2.t - vw.t) < 4,
          vw ? vw.l + ',' + vw.t + ' -> ' + vw2.l + ',' + vw2.t : '');

    await p.evaluate(() => document.querySelector('.sab-callrow[data-c="about"]').click());
    await p.waitForTimeout(500);
    const c1 = await card(p);
    check('the telling opens as a card, not a page', !!c1 && /Lothal/.test(c1), (c1 || 'no card').slice(0, 70));
    check('and it carries the facts that used to sit below', !!c1 && c1.length > 120, (c1 || '').length + ' chars');
    await shut(p);

    await p.evaluate(() => document.querySelector('.sab-bell').click());
    await p.waitForTimeout(350);
    await p.evaluate(() => document.querySelector('.sab-callrow[data-c="works"]').click());
    await p.waitForTimeout(500);
    const c2 = await card(p);
    check('so do the works', !!c2 && /monument/i.test(c2), (c2 || 'no card').slice(0, 70));
    await shut(p);

    check('and there is a way out that is not a keyboard shortcut',
          await p.evaluate(() => !!document.querySelector('.sab-leave')));
    await p.evaluate(() => document.querySelector('.sab-leave').click());
    await p.waitForTimeout(500);
    check('which leaves', await p.evaluate(() => !window.__SAB().city));
    check('and unlocks the page again',
          await p.evaluate(() => !document.body.classList.contains('sab-full')));
    check('no errors', !errs.length, errs.slice(0, 2).join(' | ') || 'none');
    await p.close();
  }
  await b.close();
  console.log(fails ? '\n' + fails + ' FAILURES' : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('SUITE ERROR', e); process.exit(2); });
