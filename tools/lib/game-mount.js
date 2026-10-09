/* tools/lib/game-mount.js — serve app/ and mount one engine from window.IND_GAMES straight into
   the real page, the way the host does: entry.engine(host, opts, done). Shared by
   check-carrom.js and check-pallanguzhi.js, so the two checks boot the app the same way. */
const fs = require('fs');
const path = require('path');
const http = require('http');

const APP = path.join(__dirname, '..', '..', 'app');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
function serve(port) {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(APP, p);
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404).end('no'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((r, j) => { s.on('error', j); s.listen(port || 0, '127.0.0.1', () => r(s)); });
}

/* mount `id` into a fresh host in the page; opts are passed through; done() lands in window.__done */
async function mount(p, id, file, opts) {
  await p.evaluate(async ({ id, file, opts }) => {
    const has = () => (window.IND_GAMES || []).some(g => g.id === id);
    if (!has()) {
      await new Promise((res, rej) => { const s = document.createElement('script'); s.src = file; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
    }
    const g = window.IND_GAMES.filter(x => x.id === id)[0];
    if (window.__td) { try { window.__td(); } catch (e) {} }
    let host = document.getElementById('tsthost'); if (host) host.remove();
    host = document.createElement('div'); host.id = 'tsthost';
    host.style.cssText = 'max-width:960px;margin:12px auto;padding:0 8px';
    (document.querySelector('main') || document.body).appendChild(host);
    window.__done = null; window.__doneCalls = 0;
    window.__td = g.engine(host, opts || {}, r => { window.__done = r; window.__doneCalls++; });
  }, { id, file, opts: opts || {} });
  await p.waitForTimeout(250);
}
module.exports = { serve, mount, APP };
