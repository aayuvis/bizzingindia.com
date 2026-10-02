#!/usr/bin/env node
/* Bizzing India — WCAG AA contrast in every world and in day and night (FIX-INDIA L5;
   family standard §12). docs/27-platform.md says why.

   For every world theme × day/night × the screens a child lives on, every visible piece of
   text is measured against the background actually behind it: the element's own colour and
   opacity, composited over each translucent layer down to the first solid one. Normal text
   needs 4.5:1, large text (24px, or 18.66px bold) 3:1. Text that sits straight on a picture
   cannot be measured this way, so it must carry a scrim or a halo (a text-shadow) — that is
   checked instead.

   Also holds the rest of the accessibility line: focus is visible (a focused button draws an
   outline or a ring), reduced motion stops the decorative animation, and every button has a
   name a screen reader can say.

   Run:  node tools/check-contrast.js            # every world, day and night
         node tools/check-contrast.js --world delhi6
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');

const APP = path.join(__dirname, '..', 'app');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml',
  '.woff2':'font/woff2', '.webmanifest':'application/manifest+json', '.ico':'image/x-icon',
  '.mp3':'audio/mpeg', '.webp':'image/webp' };
function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(APP, p);
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404).end('no'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

const VIEWS = [['home'], ['stories'], ['bhasha'], ['pack', 'hi'], ['paath'], ['paath', 'neeti-course'], ['neeti'], ['khel'], ['me'], ['aaj']];

/* THE MEASURE IS PIXELS. Walking up the CSS backgrounds was wrong for this app: a caption
   on a painting sits over an <img> with a scrim element or a ::after gradient, none of which
   is an ancestor's background, and the first version reported 2,420 failures that were white
   on a dark scrim. So: list every piece of text, hide the text (not its halo), take a
   screenshot, and sample what is really behind each one — the worst case of it, the 90th
   percentile toward the text's own lightness, so text over a busy picture is judged by the
   picture's brightest (or darkest) part, not its average. */
function collect() {
  const parse = c => { const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const v = m[1].split(',').map(x => parseFloat(x)); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
  const items = [];
  for (const el of document.querySelectorAll('[data-bz=header] *, [data-bz=tabbar] *, #main *')) {
    if (!el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    if (el.closest('svg, [aria-hidden="true"], .worldfrieze, button[disabled], .sr-only, #celebrate')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    /* the text's own box: a range around its text nodes, not the element's padding */
    const rg = document.createRange(); let box = null;
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) {
      rg.selectNodeContents(n); const r = rg.getBoundingClientRect();
      if (r.width && r.height) box = box ? { l: Math.min(box.l, r.left), t: Math.min(box.t, r.top), r: Math.max(box.r, r.right), b: Math.max(box.b, r.bottom) }
                                         : { l: r.left, t: r.top, r: r.right, b: r.bottom };
    }
    if (!box || box.r - box.l < 2 || box.b - box.t < 4) continue;
    if (box.b < 0 || box.t > innerHeight * 6) continue;
    let op = 1, x = el; while (x && x.nodeType === 1) { op *= parseFloat(getComputedStyle(x).opacity); x = x.parentElement; }
    if (op < 0.05) continue;
    const fg = parse(cs.color); if (!fg || fg.a * op < 0.05) continue;
    items.push({ box: { l: box.l + scrollX, t: box.t + scrollY, r: box.r + scrollX, b: box.b + scrollY },
      fg: { r: fg.r, g: fg.g, b: fg.b, a: fg.a * op }, size: parseFloat(cs.fontSize), bold: parseInt(cs.fontWeight, 10) >= 700,
      halo: !!(cs.textShadow && cs.textShadow !== 'none'), t: (el.textContent || '').trim().slice(0, 40),
      tag: el.tagName + '.' + String(el.className || '').split(' ').slice(0, 2).join('.') });
  }
  return items;
}
async function judge({ items, png }) {
  const img = new Image(); img.src = 'data:image/png;base64,' + png;
  await new Promise(r => { img.onload = r; });
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const lum = (r, gg, b) => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
  const out = [];
  for (const it of items) {
    const x0 = Math.max(0, Math.floor(it.box.l)), y0 = Math.max(0, Math.floor(it.box.t));
    const w = Math.min(c.width - x0, Math.ceil(it.box.r - it.box.l)), h = Math.min(c.height - y0, Math.ceil(it.box.b - it.box.t));
    if (w < 2 || h < 2) continue;
    const d = g.getImageData(x0, y0, w, h).data, L = [];
    let sr = 0, sg = 0, sb = 0, n = 0;
    for (let i = 0; i < d.length; i += 4 * 3) { L.push(lum(d[i], d[i + 1], d[i + 2])); sr += d[i]; sg += d[i + 1]; sb += d[i + 2]; n++; }
    if (!n) continue;
    const avg = { r: sr / n, g: sg / n, b: sb / n };
    const a = it.fg.a, fr = it.fg.r * a + avg.r * (1 - a), fgc = it.fg.g * a + avg.g * (1 - a), fb = it.fg.b * a + avg.b * (1 - a);
    const Lf = lum(fr, fgc, fb);
    L.sort((p, q) => p - q);
    const light = Lf > lum(avg.r, avg.g, avg.b);
    /* the worst 10% of the background, toward the text's own lightness */
    /* a halo is the mitigation for a busy picture: halo'd text is judged on the median */
    const Lb = it.halo ? L[Math.floor(L.length * 0.5)] : light ? L[Math.floor(L.length * 0.9)] : L[Math.floor(L.length * 0.1)];
    const ratio = (Math.max(Lf, Lb) + 0.05) / (Math.min(Lf, Lb) + 0.05);
    const need = (it.size >= 24 || (it.size >= 18.66 && it.bold)) ? 3 : 4.5;
    if (ratio < need - 0.01) out.push({ t: it.t, ratio: Math.round(ratio * 100) / 100, need, tag: it.tag, halo: it.halo });
  }
  return out;
}
const HIDE = '*{color:transparent!important;-webkit-text-fill-color:transparent!important;caret-color:transparent!important}' +
  '::placeholder{color:transparent!important}';
async function measureView(p) {
  const items = await p.evaluate(collect);
  await p.addStyleTag({ content: HIDE }).then(h => p.evaluate(e => { e.id = '__hide'; }, h));
  await p.waitForTimeout(60);
  const png = (await p.screenshot({ fullPage: true })).toString('base64');
  await p.evaluate(() => { const e = document.getElementById('__hide'); if (e) e.remove(); });
  const fails = await p.evaluate(judge, { items, png });
  return { checked: items.length, fails };
}

(async () => {
  const onlyW = process.argv.includes('--world') ? process.argv[process.argv.indexOf('--world') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(base, { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  /* every world opened for the audit — tester mode is a device setting and rewrites nothing */
  const worlds = await p.evaluate(() => ((window.IND_WORLDS && window.IND_WORLDS.list) || []).map(w => w.id));
  let fails = 0, artBad = 0, checked = 0;
  const report = [];
  for (const w of worlds) {
    if (onlyW && w !== onlyW) continue;
    for (const mode of ['day', 'night']) {
      await p.evaluate(([w, mode]) => {
        window.BI.S.world = w;
        const isNight = document.documentElement.getAttribute('data-mode') === 'night';
        if ((mode === 'night') !== isNight) document.querySelector('[data-bz=theme]').click();
        window.BI.render();
      }, [w, mode]);
      for (const [v, a] of VIEWS) {
        await p.evaluate(([v, a]) => window.BI.go(v, a), [v, a]); await p.waitForTimeout(250);
        const m = await measureView(p);
        checked += m.checked;
        m.fails.forEach(f => { fails++; report.push(`${w}/${mode}/${v}${a ? '/' + a : ''}: "${f.t}" ${f.ratio}:1 (needs ${f.need}) ${f.tag}${f.halo ? ' [halo]' : ''}`); });
      }
    }
  }
  /* focus visible, reduced motion, named buttons — once */
  await p.evaluate(() => window.BI.go('home')); await p.waitForTimeout(300);
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
  const focus = await p.evaluate(() => { const e = document.activeElement, s = e && getComputedStyle(e);
    return e && e !== document.body ? { ok: (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none'), what: e.tagName + '.' + e.className } : { ok: false, what: 'nothing focused' }; });
  if (!focus.ok) report.push('focus is not visible on ' + focus.what);
  const unnamed = await p.evaluate(() => [...document.querySelectorAll('button, a[href], [role="button"]')].filter(b => b.offsetParent !== null &&
    !(b.getAttribute('aria-label') || (b.textContent || '').trim() || b.getAttribute('title') || (b.querySelector('img[alt]:not([alt=""])')))).map(b => b.outerHTML.slice(0, 60)));
  unnamed.forEach(u => report.push('a control with no name: ' + u));
  const rctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
  const rp = await rctx.newPage();
  await rp.goto(base, { waitUntil: 'networkidle' }); await skipOnboarding(rp); await rp.waitForTimeout(400);
  const moving = await rp.evaluate(() => [...document.querySelectorAll('*')].filter(e => { const s = getComputedStyle(e);
    return s.animationName && s.animationName !== 'none' && s.animationPlayState === 'running' && parseFloat(s.animationDuration) > 0.01 &&
      (s.animationIterationCount === 'infinite'); }).map(e => e.tagName + '.' + String(e.className).split(' ')[0]).slice(0, 5));
  moving.forEach(m => report.push('reduced motion asked for, and this keeps animating: ' + m));
  await rctx.close();

  if (process.env.CONTRAST_DUMP) fs.writeFileSync(process.env.CONTRAST_DUMP, report.join('\n'));
  report.slice(0, 60).forEach(r => console.log('  ' + r));
  if (report.length > 60) console.log(`  … and ${report.length - 60} more`);
  console.log(`\n${checked} pieces of text measured in ${worlds.length} worlds × day and night; ` +
    `${fails} below AA; focus ${focus.ok ? 'visible' : 'NOT visible'}; ` +
    `${unnamed.length} unnamed controls; ${moving.length} endless animations under reduced motion`);
  if (errs.length) console.log('page error: ' + errs[0]);
  await browser.close(); server.close();
  process.exit(report.length || errs.length ? 1 : 0);
})();
