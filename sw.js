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

importScripts('build.js');                    /* defines self.IND_BUILD */
var CORE_CACHE = 'ind-core-' + (self.IND_BUILD || 'dev');

importScripts('sw-precache.js');              /* defines self.IND_PRECACHE (generated) */

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
     answer when the network is not there. Navigations fall back to the shell. */
  e.respondWith(
    fetch(req).then(function (r) {
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
