/* Bizzing India — pack downloads (offline audio & art) and the diagnostics ring.
 *
 * THE DOWNLOADER. A pack (pack-manifest.js) is fetched file by file into the
 * SAME Cache API bucket the service worker serves media from ('ind-media-v1'),
 * so a downloaded clip and a clip heard once online are the same thing to the
 * player. Progress is a counted loop, resumable by construction: files already
 * in the cache are skipped, so a download that died at 60% costs 40% to finish.
 * Removal deletes exactly the pack's files and nothing else.
 *
 * THE DIAGNOSTICS RING. window.onerror and unhandledrejection append to a small
 * localStorage ring (50 entries). No network, no service, no child data — it is
 * for a parent pressing "copy" and pasting into an email, and for us reading a
 * build id next to a stack line. This is the whole of "error reporting" until
 * there is a server to report to.
 */
(function () {
  'use strict';
  var W = window, D = document;
  var MEDIA = 'ind-media-v1';
  var BUILD = function () { return W.IND_BUILD || '1'; };

  /* ---------------- diagnostics ring ---------------- */
  var DIAG_KEY = 'india.diag.v1';
  function diagPush(kind, msg) {
    try {
      var ring = JSON.parse(localStorage.getItem(DIAG_KEY) || '[]');
      ring.push({ t: Date.now(), b: W.IND_BUILD || 'dev', k: kind, m: String(msg).slice(0, 400) });
      while (ring.length > 50) ring.shift();
      localStorage.setItem(DIAG_KEY, JSON.stringify(ring));
    } catch (e) {}
  }
  W.addEventListener('error', function (e) {
    diagPush('error', (e.message || '') + ' @' + (e.filename || '').split('/').pop() + ':' + (e.lineno || 0));
  });
  W.addEventListener('unhandledrejection', function (e) {
    diagPush('promise', (e.reason && (e.reason.message || e.reason)) || 'unhandled rejection');
  });
  W.IND_DIAG = {
    list: function () { try { return JSON.parse(localStorage.getItem(DIAG_KEY) || '[]'); } catch (e) { return []; } },
    text: function () {
      return this.list().map(function (r) {
        return new Date(r.t).toISOString() + ' [' + r.b + '] ' + r.k + ': ' + r.m;
      }).join('\n') || 'no errors recorded';
    },
    clear: function () { try { localStorage.removeItem(DIAG_KEY); } catch (e) {} }
  };

  /* ---------------- the pack downloader ---------------- */
  var live = {};   /* packId -> { done, total, stop } while a download runs */

  function url(f) { return f + '?v=' + BUILD(); }

  W.IND_DL = {
    supported: function () { return 'caches' in W; },
    active: function (id) { return live[id] || null; },

    /* how much of a pack is already in the cache — also the "is it downloaded" test */
    status: function (id, cb) {
      var p = (W.IND_PACKS_DL || {})[id];
      if (!p || !this.supported()) return cb({ have: 0, total: p ? p.n : 0 });
      caches.open(MEDIA).then(function (c) {
        return c.keys().then(function (keys) {
          var mine = {};
          keys.forEach(function (rq) {
            var path = new URL(rq.url).pathname.replace(/^.*?\/(voice|art)\//, '$1/');
            mine[path.split('?')[0]] = true;
          });
          var have = p.files.reduce(function (a, f) { return a + (mine[f] ? 1 : 0); }, 0);
          cb({ have: have, total: p.n, done: have >= p.n });
        });
      }).catch(function () { cb({ have: 0, total: p.n }); });
    },

    download: function (id, onProgress, onDone) {
      var p = (W.IND_PACKS_DL || {})[id];
      if (!p || live[id] || !this.supported()) return;
      if (W.IND_ENT && !W.IND_ENT.canDownload(id)) return;   /* the gate — UI shows the pass card instead */
      var st = live[id] = { done: 0, total: p.n, stop: false };
      caches.open(MEDIA).then(function (c) {
        var i = 0, WORKERS = 6;
        function next() {
          if (st.stop || i >= p.files.length) return Promise.resolve();
          var f = p.files[i++];
          return c.match(url(f), { ignoreSearch: true }).then(function (hit) {
            if (hit) return;
            return fetch(url(f)).then(function (r) {
              if (r && r.ok) return c.put(url(f), r);
            }).catch(function () {});
          }).then(function () {
            st.done++;
            if (onProgress && st.done % 10 === 0) onProgress(st.done, st.total);
            return next();
          });
        }
        var lanes = [];
        for (var k = 0; k < WORKERS; k++) lanes.push(next());
        return Promise.all(lanes);
      }).then(function () {
        var stopped = st.stop;
        delete live[id];
        if (onDone) onDone(!stopped);
      });
    },

    cancel: function (id) { if (live[id]) live[id].stop = true; },

    remove: function (id, cb) {
      var p = (W.IND_PACKS_DL || {})[id];
      if (!p || !this.supported()) return cb && cb();
      caches.open(MEDIA).then(function (c) {
        return Promise.all(p.files.map(function (f) {
          return c.delete(url(f), { ignoreSearch: true });
        }));
      }).then(function () { cb && cb(); });
    },

    /* how much the browser is holding for us, for the storage line in Grown-ups */
    estimate: function (cb) {
      if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(function (e) {
          cb({ used: e.usage || 0, quota: e.quota || 0 });
        }).catch(function () { cb(null); });
      } else cb(null);
    }
  };
})();
