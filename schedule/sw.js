/* sw.js — offline-first, the family rule.

   Freshness follows the URL: a Vite-hashed asset is immutable, so cache-first;
   everything else (the page, the manifest, the art) is network-first with the
   cache as the fallback. Serving a cached index.html cache-first once shipped a
   blank page in Bizzing Finance (it asked for hashed assets a deploy had
   deleted), so the page is never cache-first. Bump CACHE when the strategy
   changes.

   Scope: this worker lives at /bizzingindia.com/schedule/ and only answers for
   that path. Bizzing India's own worker sits one level up; the more specific
   scope wins, so each app keeps its own offline copy. */

const CACHE = 'bizzing-schedule-v1';
const ENTRY = ['./', './index.html', './manifest.webmanifest', './icon-192.png'];
const immutable = (url) => /\/assets\/.+-[A-Za-z0-9_-]{8,}\.[a-z0-9]+$/.test(url.pathname);

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(ENTRY.map((u) => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('bizzing-schedule-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});
const put = (req, res) => {
  if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); }
  return res;
};
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (immutable(url)) { e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => put(req, r)))); return; }
  e.respondWith(fetch(new Request(req.url, { cache: 'reload', credentials: 'same-origin' })).then((r) => put(req, r)).catch(() =>
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))));
});
/* A tap on a nudge brings the app forward. */
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((ws) => (ws[0] ? ws[0].focus() : self.clients.openWindow('./'))));
});
