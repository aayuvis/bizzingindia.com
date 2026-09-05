/* THE RETURNING CHILD — the test every other suite could not have caught.
 *
 * Every suite here uses a FRESH browser, so every suite tested a first visit.
 * A real player arrives with a service worker and a core cache from the LAST
 * deploy already installed, and that turned out to be a completely different
 * app: the browser only installs a new worker when the worker's SCRIPT
 * changes, and sw.js was the one file a deploy never edited. The worker that
 * shipped weeks ago kept running, kept answering with the build it was born
 * with, and no number of reloads moved it. A deployed fix simply never
 * arrived.
 *
 * Run it against a real pair of builds:
 *   git worktree add /tmp/ghp-old <an older gh-pages commit>
 *   ln -s /tmp/ghp-old /tmp/serve && python3 -m http.server 8155 -d /tmp/serve
 *   node tools/test-upgrade-path.js
 * It flips /tmp/serve to the working app/ mid-run, which is the deploy.
 */
const { chromium } = require('playwright');
const fs = require('fs');
let fails = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS' : 'FAIL') + '  ' + n + (x !== undefined ? '  [' + x + ']' : '')); if (!ok) fails++; };
const use = v => { try { fs.unlinkSync('/tmp/serve'); } catch (e) {} fs.symlinkSync(v, '/tmp/serve'); };
(async () => {
  use('/tmp/ghp-old');
  const ctx = await chromium.launchPersistentContext('/tmp/pw-profile4', {
    executablePath: '/opt/pw-browsers/chromium', viewport: { width: 1280, height: 900 } });
  const p = ctx.pages()[0] || await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8155/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(5000);
  const old = await p.evaluate(() => self.IND_BUILD);
  check('a child arrives and the old build installs its worker', !!old, old);

  use('/home/user/bizzingindia.com/app');
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(3000);
  const now = await p.evaluate(() => self.IND_BUILD);
  check('the new build reaches them on the next visit', now !== old, old + ' -> ' + now);

  /* the new worker precaches ~130 files before it activates, and only then
     does it sweep the old cache — poll rather than guess how long that takes */
  let cs = [], stale = [];
  for (let i = 0; i < 20; i++) {
    await p.waitForTimeout(3000);
    cs = await p.evaluate(() => caches.keys());
    stale = cs.filter(k => k.indexOf('ind-core-') === 0 && k.indexOf(now) < 0);
    if (!stale.length && cs.some(k => k.indexOf('ind-core-' + now) === 0)) break;
  }
  check('and the old core cache is reclaimed, not left to pile up',
        !stale.length, stale.join(', ') || JSON.stringify(cs));

  /* now play it */
  await p.evaluate(() => {
    const st = {};
    window.IND_SABHYATA.sites.forEach(s2 => {
      st[s2.id] = { lv: 3, zzz: s2.era > 1, fade: -1, idle: 0, seen: s2.era <= 1, found: s2.era <= 1,
                    bld: { gurukul: 1 }, mon: false, neg: 0,
                    jobs: { kisan: 5, karigar: 1, kathakar: 1, rakshak: 0 }, hero: null };
    });
    localStorage.setItem('india.sabhyata.v2', JSON.stringify({
      era: 1, res: { anna: 900, kala: 900, katha: 900 }, sites: st, routes: [], t: 40,
      utsav: 0, ev: null, score: 0, won: false,
      quests: { lothal: { kind: 'riddle', id: 'q1', born: 10 } }, qdone: 0, lastq: 0, tech: {},
      proj: null, rt: 0, warn: null, wonders: {}, capital: null, disp: null, lastd: 0,
      quizAt: {}, quizN: 0, kingdoms: {}, lastraid: 0, explorers: [] }));
  });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.click('[data-act="begin"]').catch(()=>{});
  await p.waitForTimeout(250);
  const nm = await p.$('#nm'); if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(450);
  await p.click('.navtab[data-v="khel"]').catch(()=>{}); await p.waitForTimeout(350);
  await p.click('.ghero').catch(()=>{}); await p.waitForTimeout(900);
  const shut = async () => { for (let i=0;i<6;i++){const bt=await p.$('#sab-ovhost [data-sab-act="ovclose"], #sab-ovhost .sab-btn'); if(!bt)return; await bt.click({timeout:1200}).catch(()=>{}); await p.waitForTimeout(180);} };
  await shut();
  await p.evaluate(() => {
    const hit = () => { const g = document.getElementById('sab-lothal'); if (!g) return;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); };
    hit(); return new Promise(r2 => setTimeout(() => { hit(); r2(); }, 120));
  });
  await p.waitForTimeout(1500); await shut();
  const sc = await p.evaluate(() => {
    const s2 = document.querySelector('.sab-scene');
    return { cls: s2 ? s2.className : 'NO SCENE', bell: !!document.querySelector('.sab-bell') };
  });
  check('the city they open is the new one', /iskit/.test(sc.cls) && /full/.test(sc.cls) && sc.bell, sc.cls);
  const bell = await p.$('.sab-bell');
  if (bell) {
    await bell.click(); await p.waitForTimeout(450);
    const rows = await p.evaluate(() => [...document.querySelectorAll('.sab-callrow')].map(x => x.getAttribute('data-c')));
    check('the bell lists its calls', rows.length >= 3, rows.join(', '));
    await p.locator('.sab-callrow[data-c="quest"]').click({ timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(800);
    const after = await p.evaluate(() => {
      const s2 = document.querySelector('.sab-scene');
      const ov = document.querySelector('#sab-ovhost .sab-card');
      return { card: ov ? (ov.textContent||'').replace(/\s+/g,' ').trim().slice(0,45) : null,
               cls: s2 ? s2.className : 'NO SCENE' };
    });
    check('clicking the scroll opens its card', !!after.card, after.card || 'no card');
    check('and the old scrolling city does NOT come back over it',
          /iskit/.test(after.cls) && /full/.test(after.cls), after.cls);
  }
  check('no errors', !errs.length, errs.slice(0, 2).join(' | ') || 'none');
  await ctx.close();
  console.log(fails ? '\n' + fails + ' FAILURES' : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})().catch(e=>{console.error('ERR',e && e.message);process.exit(2)});
