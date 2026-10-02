/* Screenshots of every Sabhyata surface, at three sizes, for looking at.
 *
 * The rule this exists to serve is the one in Bizzing-Videos' brief: assertions catch
 * what you thought to assert, a still catches what you did not. audit-city-ui.js proves
 * nothing overflows; it cannot tell you the screen is ugly, crowded, or that a child
 * would not know where to look first.
 *
 *   CHROME=/path/to/chrome node tools/shoot-sabhyata.js [outdir]
 */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { skipOnboarding } = require('./lib/onboard');

const ROOT = path.join(__dirname, '..', 'app');
const OUT = process.argv[2] || path.join(__dirname, '..', '.shots');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json',
  '.webmanifest':'application/manifest+json', '.png':'image/png', '.svg':'image/svg+xml',
  '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.mp3':'audio/mpeg' };

const serve = () => new Promise(r => {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  s.listen(0, '127.0.0.1', () => r(s));
});

const VIEWS = [{ n: 'phone', w: 390, h: 844 }, { n: 'tablet', w: 820, h: 1180 }, { n: 'desktop', w: 1440, h: 900 }];

async function boot(browser, port, v) {
  const p = await browser.newPage({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 2 });
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  await p.waitForTimeout(400);
  await p.click('[data-bz=tab][data-v="khel"]'); await p.waitForTimeout(250);
  await p.click('.ghero'); await p.waitForTimeout(900);
  const ov = await p.$('#sab-ovhost .sab-btn');
  if (ov) { await ov.click(); await p.waitForTimeout(250); }
  /* a realm with something in it — an empty world shows nothing about the interface */
  await p.evaluate(() => {
    const G = window.__SABG();
    G.res = { anna: 260, kala: 260, katha: 180 };
    G.era = 3;
    const ids = Object.keys(G.sites);
    ids.slice(0, 9).forEach(id => { G.sites[id].found = true; G.sites[id].zzz = false; G.sites[id].seen = true; });
    G.routes = ids.slice(1, 7).map((id, i) => [ids[i], id]);
    G.riti = { grama: true, shreni: true };
    G.pol = ['sanjha'];
    window.IND_SABHYATA.techs.slice(0, 4).forEach(t => { G.tech[t.id] = true; });
    G.ages = [{ era: 0, name: 'The First Cities', score: 30, bar: 10, good: true },
              { era: 1, name: 'Rivers and Kingdoms', score: 8, bar: 14, good: false },
              { era: 2, name: 'The Great Sabha', score: 40, bar: 18, good: true }];
    G.warn = { id: ids[0], raid: 'boar', at: G.t + 6 };
    G.req = { mesopotamia: { at: G.t, due: G.t + 14, want: 'workshops of the west', pay: 40 } };
    window.__SABDO.paint();
  });
  await p.waitForTimeout(700);
  return p;
}

const openCity = async (p, sid) => {
  await p.evaluate(sid => {
    const hit = () => { const g = document.getElementById('sab-' + sid); if (!g) return;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); };
    hit();
    return new Promise(r => setTimeout(() => { hit(); r(); }, 130));
  }, sid);
  await p.waitForTimeout(1400);
};

const panel = async (p, act) => {
  await p.evaluate(a => {
    const el = document.createElement('button');
    el.setAttribute('data-sab-act', a);
    document.getElementById('sabwrap').appendChild(el); el.click(); el.remove();
  }, act);
  await p.waitForTimeout(600);
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve(); const port = server.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  for (const v of VIEWS) {
    const p = await boot(browser, port, v);
    const shot = n => p.screenshot({ path: path.join(OUT, `${v.n}-${n}.png`) });
    await shot('01-map');
    await p.evaluate(() => { const g = document.getElementById('sab-' + Object.keys(window.__SABG().sites)[0]);
      if (g) for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); });
    await p.waitForTimeout(500);
    await shot('02-selected');
    /* Vidya is a tab on the game window's strip, and behind the menu on a phone */
    const vidya = async () => { await p.evaluate(() => { const b = document.getElementById('sab-tech'); if (b) b.click(); }); await p.waitForTimeout(700); };
    await vidya();
    await shot('03-vidya');
    await vidya();
    await panel(p, 'world');  await shot('04-world');
    await panel(p, 'ovclose');
    await panel(p, 'khushi'); await shot('05-khushi');
    await panel(p, 'ovclose');
    await panel(p, 'digest'); await shot('06-digest');
    await panel(p, 'ovclose');
    await openCity(p, Object.keys(await p.evaluate(() => window.__SABG().sites))[0]);
    await shot('07-city');
    await p.evaluate(() => { const b = document.querySelector('[data-sab-act="kitopen"]'); if (b) b.click(); });
    await p.waitForTimeout(700);
    await shot('08-city-shelf');
    await p.close();
    console.log(`${v.n}: 8 shots`);
  }
  await browser.close(); server.close();
  console.log('-> ' + OUT);
})();
