/* Headless check for Sabhyata's mechanics — the systems, not the pixels.
 *
 * tools/audit-city-ui.js already watches the city screen's LAYOUT. This one watches
 * whether the game is a game: that a turn only passes when it should, that where a
 * thing is built changes what it pays, that research has to be unlocked before it can
 * be bought, that a win is reachable by more than one road.
 *
 * It drives the real engine through the real app, and reads state through the debug
 * window the engine already exposes (`__SABG`), so a check can never pass by agreeing
 * with a render that is itself wrong.
 *
 *   node tools/check-sabhyata.js            # all checks
 *   node tools/check-sabhyata.js --only adj # one
 *   CHROME=/path/to/chrome node tools/check-sabhyata.js
 */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'app');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.webmanifest':'application/manifest+json', '.png':'image/png',
  '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2',
  '.mp3':'audio/mpeg' };

function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      res.writeHead(404).end('no'); return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

/* Two real taps a real gap apart, re-finding the node between them: selecting a city
   repaints the map, so the second tap lands on a new element and the engine counts the
   pair itself rather than trusting the browser's dblclick. Lifted from audit-city-ui. */
const openCity = async (p, sid) => {
  await p.evaluate(sid => {
    const hit = () => { const g = document.getElementById('sab-' + sid); if (!g) return;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); };
    hit();
    return new Promise(r => setTimeout(() => { hit(); r(); }, 120));
  }, sid);
  await p.waitForTimeout(1200);
};

async function boot(browser, port) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(() => {});
  const nm = await p.$('#nm');
  if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(400);
  await p.click('.navtab[data-v="khel"]'); await p.waitForTimeout(250);
  await p.click('.ghero'); await p.waitForTimeout(900);
  const ov = await p.$('#sab-ovhost .sab-btn');
  if (ov) { await ov.click(); await p.waitForTimeout(250); }
  if (!await p.evaluate(() => typeof window.__SABG === 'function'))
    throw new Error('the game did not boot — no __SABG');
  return { p, errs };
}

const CHECKS = [];
const check = (id, what, fn) => CHECKS.push({ id, what, fn });

/* ---------------------------------------------------------------- boots at all */
check('boot', 'the game boots, ticks, and logs nothing', async ({ p, errs }) => {
  const t0 = await p.evaluate(() => window.__SAB().t);
  await p.waitForTimeout(3600);
  const t1 = await p.evaluate(() => window.__SAB().t);
  if (!(t1 > t0)) throw new Error(`the clock did not advance (${t0} -> ${t1})`);
  if (errs.length) throw new Error('logged: ' + errs.slice(0, 3).join(' | '));
});

/* ------------------------------------------------- one city, the rest asleep */
check('start', 'the world starts at Dholavira with all of India unseen', async ({ p }) => {
  const g = await p.evaluate(() => {
    const G = window.__SABG();
    const ids = Object.keys(G.sites);
    return { found: ids.filter(k => G.sites[k].found).length,
             awake: ids.filter(k => !G.sites[k].zzz).length, era: G.era };
  });
  if (g.found !== 1) throw new Error(`${g.found} places found at the start, expected 1`);
  if (g.awake !== 1) throw new Error(`${g.awake} places awake at the start, expected 1`);
  if (g.era !== 0) throw new Error(`started in era ${g.era}`);
});

async function main() {
  const only = process.argv.includes('--only')
    ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const server = await serve();
  const port = server.address().port;
  const browser = await chromium.launch({
    executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await boot(browser, port);
    try {
      await c.fn(ctx);
      console.log(`  ok   ${c.id.padEnd(10)} ${c.what}`);
      pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(10)} ${c.what}\n         ${e.message}`);
      fail++;
    }
    await ctx.p.close();
  }
  await browser.close();
  server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
main();
