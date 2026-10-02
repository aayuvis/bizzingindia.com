/* loader.js — the corpus, per route (FIX-INDIA N2; family standard §11; docs/27).

   The page used to load 94 scripts — 11.7 MB, 3.15 MB gzipped — before Home could paint,
   most of it stories, epics and a Hindi reading corpus a child on Home was not reading.
   Now index.html loads a small shell, and each group of the rest sits in a
   <template id="lazy-<group>"> until a screen asks for it:

     IND_LOAD(['content', 'map'])  -> a Promise, resolved when every script has RUN

   Scripts inside a group run in page order (async=false keeps insertion order), a group
   asked for twice is fetched once, and a group that fails says which file. After the first
   screen has painted, the rest are warmed in the background (never on a data-saver
   connection), so the next screen is usually already there — the same bytes the offline
   cache was fetching anyway. */
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
  /* the warm-up: after the first screen, in the order a child is likeliest to go */
  W.IND_WARM = function (order, delay) {
    var c = W.navigator && W.navigator.connection;
    if (c && c.saveData) return;
    setTimeout(function () {
      (order || groups()).reduce(function (p, g) {
        return p.then(function () { return W.IND_LOAD(g).catch(function () {}); });
      }, Promise.resolve());
    }, delay == null ? 1500 : delay);
  };
})(window, document);
