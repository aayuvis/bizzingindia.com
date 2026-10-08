/* Pixel contrast, shared by check-contrast and check-sabhyata `cardtext`: one way to measure,
   so a check that holds a game's panel cannot drift from the one that holds the app's pages. */
/* THE MEASURE IS PIXELS. Walking up the CSS backgrounds was wrong for this app: a caption
   on a painting sits over an <img> with a scrim element or a ::after gradient, none of which
   is an ancestor's background, and the first version reported 2,420 failures that were white
   on a dark scrim. So: list every piece of text, hide the text (not its halo), take a
   screenshot, and sample what is really behind each one — the worst case of it, the 90th
   percentile toward the text's own lightness, so text over a busy picture is judged by the
   picture's brightest (or darkest) part, not its average. */
function collect(scope) {
  const parse = c => { const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const v = m[1].split(',').map(x => parseFloat(x)); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
  const items = [];
  for (const el of document.querySelectorAll(scope || '[data-bz=header] *, [data-bz=tabbar] *, #main *')) {
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
async function measureView(p, scope) {
  const items = await p.evaluate(collect, scope || null);
  await p.addStyleTag({ content: HIDE }).then(h => p.evaluate(e => { e.id = '__hide'; }, h));
  await p.waitForTimeout(60);
  const png = (await p.screenshot({ fullPage: true })).toString('base64');
  await p.evaluate(() => { const e = document.getElementById('__hide'); if (e) e.remove(); });
  const fails = await p.evaluate(judge, { items, png });
  return { checked: items.length, fails };
}

module.exports = { measureView };
