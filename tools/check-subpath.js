/* Boot the app from /bizzingindia.com/ — exactly where the project page lives — and prove it
   works there.
 *
 * This exists because the app is served from a SUBDIRECTORY, not from a domain root, and a
 * single root-absolute path anywhere in it would break silently for every visitor while
 * working perfectly for anyone testing at localhost:8000/. So the server here refuses to
 * answer anything outside the prefix and records what asked — a request that escapes the
 * project page is a failure, not a warning. That is how the missing favicon link was found:
 * with no icon link at all a browser asks the origin for /favicon.ico, which is
 * aayuvis.github.io/favicon.ico and nothing to do with this app.
 *
 * An HTTP 200 from Pages says a file was served. This says the app RUNS.
 *
 *   node tools/check-subpath.js
 *   CHROME=/path/to/chrome node tools/check-subpath.js   # if playwright has no browser
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = require('path').join(__dirname, '..', 'app');
const PREFIX = '/bizzingindia.com';
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg',
};

const missing = [];
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (!p.startsWith(PREFIX)) { missing.push('OUTSIDE PREFIX -> ' + req.url); res.writeHead(404).end('outside the project page'); return; }
  p = p.slice(PREFIX.length) || '/';
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    missing.push(req.url);
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${server.address().port}${PREFIX}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('requestfailed: ' + r.url()));
  page.on('response', r => { if (r.status() >= 400) errors.push('HTTP ' + r.status() + ' ' + r.url()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(6000);

  const shell = await page.evaluate(() => {
    const app = document.getElementById('app');
    return {
      title: document.title,
      children: app ? app.children.length : -1,
      textLen: app ? app.innerText.trim().length : 0,
      sample: app ? app.innerText.trim().slice(0, 220) : '',
      build: self.IND_BUILD || null,
      stories: (self.IND_STORIES && self.IND_STORIES.length) || null,
    };
  });

  console.log('URL              :', url);
  console.log('title            :', shell.title);
  console.log('build stamp      :', shell.build);
  console.log('#app children    :', shell.children);
  console.log('rendered text len:', shell.textLen);
  console.log('first text       :', JSON.stringify(shell.sample));
  console.log('404s while loading:', missing.length, missing.slice(0, 10));
  console.log('console errors   :', errors.length);
  errors.slice(0, 15).forEach(e => console.log('   !', e.slice(0, 200)));

  await page.screenshot({ path: process.env.SHOT || 'subpath.png', fullPage: false });
  await browser.close();
  server.close();

  const ok = shell.children > 0 && shell.textLen > 20 && missing.length === 0;
  console.log(ok ? '\nPASS: the app boots and renders from a subdirectory.' : '\nFAIL: see above.');
  process.exit(ok ? 0 : 1);
})();
