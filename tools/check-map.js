/* Does the map fit on one screen, and are the capitals where they should be?
 *
 * WHY a script and not a look: "it fits" is a claim about a number — the bottom of the map
 * against the bottom of the viewport, minus the fixed nav bar that sits INSIDE the viewport
 * and has already made a fool of me once on the story reader. And "the dot is on the right
 * city" is a claim about geometry, which the browser can answer exactly by hit-testing the
 * dot against the state's own path.
 *
 * Run: node tools/check-map.js [--shot]
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SIZES = [
  ['desktop', 1280, 800],
  ['laptop', 1440, 720],
  ['phone', 390, 844],
  ['small phone', 360, 640],
];

async function main() {
  const shot = process.argv.includes('--shot');
  const pre = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(pre) ? { executablePath: pre } : {});
  const url = 'file://' + path.join(__dirname, '..', 'app', 'index.html');
  let bad = 0;

  for (const [label, w, h] of SIZES) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForFunction('window.BI && window.BI.go');
    await page.evaluate(() => {
      window.BI.S.started = true;
      window.BI.S.name = window.BI.S.name || 'Test';
      window.BI.S.age = window.BI.S.age || 8;
      /* a couple of states remembered, so the green dot is on screen to be measured */
      window.BI.S.lit = Object.assign({}, window.BI.S.lit, { RJ: 1, KL: 1, WB: 1 });
      window.BI.go('map');
    });
    await page.waitForTimeout(400);

    const m = await page.evaluate(() => {
      const svg = document.querySelector('.mapsvg');
      const nav = document.querySelector('.tabbar, .bottomnav, nav.tabs, footer nav');
      const r = svg.getBoundingClientRect();
      const navTop = nav ? nav.getBoundingClientRect().top : window.innerHeight;
      const caps = [...document.querySelectorAll('.mapsvg .cap')];
      return {
        top: Math.round(r.top), bottom: Math.round(r.bottom),
        width: Math.round(r.width), height: Math.round(r.height),
        floor: Math.round(Math.min(navTop, window.innerHeight)),
        docScroll: document.documentElement.scrollHeight - window.innerHeight,
        caps: caps.length,
        green: caps.filter(g => g.classList.contains('lit')).length,
      };
    });

    /* The map is allowed to sit above the fold; what must not happen is a map taller than
       the space it has, because then no single screen ever shows the shape of the country. */
    const room = m.floor - m.top;
    const fits = m.height <= room + 1;
    if (!fits) bad++;
    console.log(
      `${label.padEnd(12)} ${String(w).padStart(4)}x${h}  map ${m.width}x${m.height}` +
      `  room ${room}  ${fits ? 'fits' : 'OVERFLOWS by ' + (m.height - room)}` +
      `  caps ${m.caps} (${m.green} green)  page scroll ${m.docScroll}px`);
    if (errs.length) { bad++; console.log('   page errors: ' + errs.join(' | ')); }

    if (shot) {
      const out = path.join(__dirname, '..', '.shots', 'map-' + label.replace(/\s/g, '-') + '.png');
      fs.mkdirSync(path.dirname(out), { recursive: true });
      await page.screenshot({ path: out });
    }
    if (label === 'desktop') await hitTest(page);
    await page.close();
  }

  await browser.close();
  console.log(bad ? `\n${bad} problem(s)` : '\nmap fits every size');
  process.exit(bad ? 1 : 0);
}

/* Every capital dot must land inside the state whose capital it is. This asks the browser
   the same question a child's eye asks: what shape is under this point? */
async function hitTest(page) {
  const out = await page.evaluate(() => {
    const M = window.IND_MAP, svg = document.querySelector('.mapsvg');
    const pt = svg.createSVGPoint ? svg.createSVGPoint() : null;
    const paths = {};
    svg.querySelectorAll('g.terrg').forEach(g => {
      paths[g.getAttribute('data-code')] = g.querySelector('path.terr');
    });
    const wrong = [];
    let checked = 0;
    for (const [code, c] of Object.entries(M.capitals || {})) {
      const p = paths[code];
      if (!p) continue;                       /* no geometry yet — Telangana, Ladakh */
      checked++;
      pt.x = c[0]; pt.y = c[1];
      if (!p.isPointInFill(pt)) wrong.push(code + ' (' + c[2] + ')');
    }
    return { checked, wrong };
  });
  console.log(`   capital hit-test: ${out.checked - out.wrong.length}/${out.checked} dots inside their own state` +
    (out.wrong.length ? ' — OUTSIDE: ' + out.wrong.join(', ') : ''));
}

main().catch(e => { console.error(e); process.exit(1); });
