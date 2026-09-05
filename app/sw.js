/* Bizzing India — the service worker: installable, and USEFUL OFFLINE.
 *
 * Offline-first is a hard requirement (CLAUDE.md, docs/07): the best moment this
 * app has is a bored child on a plane. Strategy, kept deliberately simple:
 *
 *   CORE  (~11MB: html, every script, styles, fonts, icons) — precached at install
 *         into 'core-<build>'; old core caches deleted on activate. Network-first
 *         on fetch so updates flow when online; cache answers when the network
 *         cannot.
 *   MEDIA (voice/, art/ — hundreds of MB) — NEVER precached. Cache-first into
 *         'ind-media-v1', filled two ways: opportunistically as clips and
 *         paintings are used, and in bulk by the pack downloader in the app
 *         (same cache name — the SW and the page share it). Survives updates.
 *
 * The build id is read from build.js (the stamp tools/stamp.sh maintains), so a
 * deploy that changes any core file ships a new core cache automatically and we
 * never hand-edit a version string here.
 */
'use strict';

var MEDIA_CACHE = 'ind-media-v1';

/* THE WORKER'S OWN BYTES MUST CHANGE EVERY BUILD. A browser installs a new
   worker only when this SCRIPT differs, and nothing in it used to. The page
   registers it as sw.js?v=<build>, which is a different script URL each time;
   this line is the belt to that pair of braces, and tools/stamp.sh rewrites
   it. It has to come FIRST, because the imports below hang off it. */
var SW_BUILD = '202609052153';

/* AND THE IMPORTS ARE STAMPED TOO. importScripts goes through the HTTP cache
   like anything else, so a fresh worker asking for a bare 'build.js' was
   handed the PREVIOUS build's copy — and then named its cache after it. The
   result was a worker that believed it was the old build: it wrote new files
   into the old cache, and its activate sweep found nothing to delete because
   the stale cache was, by its reckoning, the current one. Every deploy left
   another core cache behind. */
importScripts('build.js?v=' + SW_BUILD);      /* defines self.IND_BUILD */
var CORE_CACHE = 'ind-core-' + (self.IND_BUILD || 'dev');

importScripts('sw-precache.js?v=' + SW_BUILD); /* defines self.IND_PRECACHE (generated) */

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CORE_CACHE).then(function (c) {
      /* addAll is atomic and one 404 fails the install — fetch singly and keep
         going, because a missing optional file must not brick going offline */
      return Promise.all((self.IND_PRECACHE || []).map(function (u) {
        return fetch(u).then(function (r) {
          if (r && r.ok) return c.put(u, r);
        }).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k.indexOf('ind-core-') === 0 && k !== CORE_CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isMedia(path) {
  return path.indexOf('/voice/') >= 0 || path.indexOf('/art/') >= 0;
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (isMedia(url.pathname)) {
    /* cache-first: a clip already heard plays offline forever. ignoreSearch,
       because the app stamps ?v= on clips and the bytes are content-stable. */
    e.respondWith(
      caches.open(MEDIA_CACHE).then(function (c) {
        return c.match(req, { ignoreSearch: true }).then(function (hit) {
          if (hit) return hit;
          return fetch(req).then(function (r) {
            if (r && r.ok) c.put(req, r.clone());
            return r;
          });
        });
      })
    );
    return;
  }

  /* core: network-first so a deploy is live on next load; the cache is the
     answer when the network is not there. Navigations fall back to the shell.

     'reload' IS THE WHOLE POINT OF THE WORD NETWORK. A plain fetch() here is
     answered by the browser's own HTTP cache, which for a page served with a
     ten-minute max-age (and for one served with no cache headers at all, by
     heuristic) hands back the index.html from the last visit — so
     "network-first" quietly meant "last-time-first", and a deployed fix could
     not reach a returning child. cache:'reload' goes past it to the server and
     refreshes the HTTP cache on the way through. */
  e.respondWith(
    fetch(new Request(req.url, {
      cache: 'reload', credentials: 'same-origin', redirect: 'follow'
    })).then(function (r) {
      if (r && r.ok) {
        var copy = r.clone();
        caches.open(CORE_CACHE).then(function (c) { c.put(req, copy); });
      }
      return r;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('./index.html', { ignoreSearch: true });
      });
    })
  );
});
