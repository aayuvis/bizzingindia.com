/* THE RIVER OF TIME: one tap must travel, and every dot must say when.
 *
 * Travelling to an age was broken from the day it was written and no test
 * here went near it: timeZone was assigned in the handler and declared
 * nowhere, and this file is strict, so the second tap on a dot threw a
 * ReferenceError and died silently. The first tap only popped a tooltip. So
 * pressing a dot showed you a name and pressing it again did nothing at all,
 * for every age, forever.
 */
const { chromium } = require('playwright');
let fails = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS' : 'FAIL') + '  ' + n + (x !== undefined ? '  [' + x + ']' : '')); if (!ok) fails++; };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const [n,w,h] of [['phone',390,844],['desktop',1440,900]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: true });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8150/', { waitUntil: 'networkidle' });
    await p.click('[data-act="begin"]').catch(()=>{});
    await p.waitForTimeout(250);
    const nm = await p.$('#nm'); if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
    await p.waitForTimeout(500);
    /* on a phone the nav collapses and India hides behind "More" */
    await p.evaluate(() => {
      const t = document.querySelector('.navtab[data-v="map"]');
      if (t && t.offsetParent !== null) { t.click(); return; }
      const more = [...document.querySelectorAll('.navtab')].find(x => /More/.test(x.textContent));
      if (more) more.click();
    });
    await p.waitForTimeout(500);
    await p.evaluate(() => {
      const t = document.querySelector('.navtab[data-v="map"], [data-v="map"]');
      if (t) t.click();
    });
    await p.waitForTimeout(1100);
    console.log('\n=== ' + n + ' ===');
    const dots = await p.evaluate(() => [...document.querySelectorAll('.tmdot')].map(d => ({
      id: d.getAttribute('data-id'),
      label: d.getAttribute('aria-label') || '',
      box: (() => { const r = d.getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) }; })()
    })));
    check('the river has its ages', dots.length > 10, dots.length + ' dots');
    /* the band carries no date labels — fifteen of them staggered along one
       line is clutter, not orientation — but every dot must still SAY when it
       was to anyone listening rather than looking */
    check('every dot still names its age and its dates to a screen reader',
          /* every age but one is a span of years; the last one is "now" */
          dots.every(d => d.label.length > 8 && /\d|now|today/i.test(d.label)),
          dots.map(d => d.label).slice(0, 2).join(' | '));
    check('and the band is not littered with them',
          await p.evaluate(() => document.querySelectorAll('.tmwhen').length === 0));
    check('every dot is a real tap target', dots.every(d => d.box.w >= 24 && d.box.h >= 24),
          Math.min(...dots.map(d => d.box.w)) + 'px smallest');
    /* ONE tap must travel */
    const target = dots.find(d => d.id === 'maurya') || dots[3];
    const before = await p.evaluate(() => location.hash + '|' + (document.querySelector('.tmdot.on') || {}).dataset?.id);
    await p.locator('.tmdot[data-id="' + target.id + '"]').click({ timeout: 3000 }).catch(()=>{});
    await p.waitForTimeout(900);
    const after = await p.evaluate(() => ({
      on: (document.querySelector('.tmdot.on') || {}).getAttribute ? document.querySelector('.tmdot.on').getAttribute('data-id') : null,
      mapShown: !!document.querySelector('#sab-stage, .tm-map, svg'),
      body: document.body.textContent.slice(0, 0)
    }));
    check('ONE tap travels to that age', after.on === target.id, before + ' -> ' + after.on);
    check('and a map is on the screen', after.mapShown);
    check('no errors', !errs.length, errs.slice(0,2).join(' | ') || 'none');
    await p.screenshot({ path: 'tl-' + n + '.png' });
    await p.close();
  }
  await b.close();
  console.log(fails ? '\n' + fails + ' FAILURES' : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})().catch(e=>{console.error('SUITE ERROR',e);process.exit(2)});
