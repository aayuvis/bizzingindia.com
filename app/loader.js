/* loader.js — the corpus, per route (FIX-INDIA N2; family standard §11; docs/27).

   The page used to load 94 scripts — 11.7 MB, 3.15 MB gzipped — before Home could paint,
   most of it stories, epics and a Hindi reading corpus a child on Home was not reading.
   Now index.html loads a small shell, and each group of the rest sits in a
   <template id="lazy-<group>"> until a screen asks for it:

     IND_LOAD(['content', 'map'])  -> a Promise, resolved when every script has RUN

   Scripts inside a group run in page order (async=false keeps insertion order), a group
   asked for twice is fetched once, and a group that fails says which file. After the child's
   first tap, the rest are warmed in the background (never on a data-saver or 2G connection),
   so the next screen is usually already there — the same bytes the offline cache wants. */
(function (W, D) {
  'use strict';
  var done = {}, pend = {};
  function srcs(g) {
    var t = D.getElementById('lazy-' + g);
    if (!t || !t.content) return [];
    return [].map.call(t.content.querySelectorAll('script'), function (s) { return s.getAttribute('src'); });
  }
  function one(src) {
    return new Promise(function (ok, no) {
      var s = D.createElement('script');
      s.src = src; s.async = false;
      s.onload = function () { ok(); };
      s.onerror = function () { no(new Error('could not load ' + src)); };
      D.head.appendChild(s);
    });
  }
  function groups() {
    return [].map.call(D.querySelectorAll('template[id^="lazy-"]'), function (t) { return t.id.slice(5); });
  }
  W.IND_GROUPS = groups;
  W.IND_HAS = function (g) { return !!done[g]; };
  W.IND_LOAD = function (gs) {
    gs = [].concat(gs || []);
    return Promise.all(gs.map(function (g) {
      if (done[g]) return null;
      if (!pend[g]) {
        pend[g] = Promise.all(srcs(g).map(one)).then(function () {
          done[g] = true;
          try { W.dispatchEvent(new CustomEvent('ind-group', { detail: g })); } catch (e) {}
        })
          .catch(function (e) { pend[g] = null; throw e; });
      }
      return pend[g];
    }));
  };
  /* THE WARM-UP WAITS FOR A TAP (audit R2/R3, 3 Oct 2026). It used to start 1.5 s after the
     first screen, tap or no tap: a phone that opened the app and was put down had fetched every
     story and both epics, 6.1 MB in 4 s, against a first-load budget of 1.5 MB. Now nothing
     beyond the shell moves until the child has touched something (or pressed a key), and then
     the page warms its groups in the order a child is likeliest to go, and tells the service
     worker to fill the offline cache with the rest. Never on a data-saver or 2G connection. */
  var touched = false, waiting = [];
  function slow() {
    var c = W.navigator && W.navigator.connection;
    return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
  }
  function swWarm() {
    try {
      var sw = W.navigator.serviceWorker;
      if (sw && sw.controller) sw.controller.postMessage('warm');
      else if (sw && sw.ready) sw.ready.then(function (r) { if (r.active) r.active.postMessage('warm'); });
    } catch (e) {}
  }
  function first() {
    if (touched) return;
    touched = true;
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { W.removeEventListener(t, first, true); });
    var q = waiting; waiting = [];
    q.forEach(function (f) { f(); });
    if (!slow()) swWarm();
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { W.addEventListener(t, first, { capture: true, passive: true }); });
  W.IND_TOUCHED = function () { return touched; };
  W.IND_WARM = function (order, delay) {
    if (slow()) return;
    var run = function () {
      setTimeout(function () {
        (order || groups()).reduce(function (p, g) {
          return p.then(function () { return W.IND_LOAD(g).catch(function () {}); });
        }, Promise.resolve());
      }, delay == null ? 1500 : delay);
    };
    if (touched) run(); else waiting.push(run);
  };
})(window, document);
