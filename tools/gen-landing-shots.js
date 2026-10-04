#!/usr/bin/env node
/* THE LANDING'S THREE PICTURES (owner, 4 Oct 2026: "allow screenshots"; v4 A1): what a child
   actually does here — a story, the map, a language lesson — photographed from the app itself,
   never drawn or mocked up. The sample child (?demo) is used, so no real household is in them.

   node tools/gen-landing-shots.js      → app/art/landing/{story,map,lesson}.webp
   Rerun after a visible change to the reader, the map or Bhasha. check-home firstlearn holds
   that there are exactly these three, lazy, described, below the hero and each ≤ 40 KB.
   Needs Pillow (python3) to write WebP. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const APP = path.join(__dirname, '..', 'app'), OUT = path.join(APP, 'art', 'landing');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.mp3': 'audio/mpeg' };
const W = 390, H = 720, OUT_W = 300;

function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
    const f = path.join(APP, p);
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404).end('no'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = await serve(), base = `http://127.0.0.1:${srv.address().port}/`;
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: 'block', reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(base + '?demo', { waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.IND_DEMO && window.BI, null, { timeout: 20000 });
  /* the sample's banner is for a visitor to the demo, not part of the screen a child sees */
  await p.addStyleTag({ content: '.demobar { display: none !important; }' });
  const settle = async () => { await p.evaluate(() => window.BI.ready && window.BI.ready()); await p.waitForLoadState('networkidle'); await p.waitForTimeout(900); };
  const shoot = async name => {
    const png = path.join(OUT, name + '.png');
    await p.screenshot({ path: png });
    execFileSync('python3', ['-c', `
from PIL import Image
im = Image.open(${JSON.stringify(png)}).convert('RGB')
im = im.resize((${OUT_W}, round(im.height * ${OUT_W} / im.width)), Image.LANCZOS)
im.save(${JSON.stringify(path.join(OUT, name + '.webp'))}, 'WEBP', quality=72, method=6)
`]);
    fs.unlinkSync(png);
  };
  /* 1 · a story: a scene with its painting and its words, before any question */
  const sid = await p.evaluate(() => (window.BI.allStories().filter(s => s.id === 'pt.lion-rabbit')[0] || window.BI.allStories()[0]).id);
  await p.evaluate(id => { const b = document.createElement('button'); b.setAttribute('data-act', 'story'); b.setAttribute('data-id', id); document.body.appendChild(b); b.click(); b.remove(); }, sid);
  await settle(); await p.evaluate(() => window.scrollTo(0, 0));
  await shoot('story');
  /* 2 · the map, with the sample child's lit places */
  await p.evaluate(() => window.BI.go('map')); await settle();
  await p.evaluate(() => { const m = document.querySelector('.mapcard'); if (m) window.scrollTo(0, m.getBoundingClientRect().top + scrollY - 70); });
  await p.waitForTimeout(400);
  await shoot('map');
  /* 3 · a Hindi lesson, a question on screen */
  await p.evaluate(() => window.BI.go('pack', 'hi')); await settle();
  await p.evaluate(() => { const n = document.querySelector('.bh-next'); if (n) n.click(); }); await settle();
  await p.evaluate(() => window.scrollTo(0, 0));
  await shoot('lesson');
  await b.close(); srv.close();
  for (const n of ['story', 'map', 'lesson']) console.log(n + '.webp ' + Math.round(fs.statSync(path.join(OUT, n + '.webp')).size / 1024) + ' KB');
})().catch(e => { console.error(e); process.exit(1); });
