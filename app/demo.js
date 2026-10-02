/* demo.js — ?demo opens a SAMPLE child, in a sandbox (family standard §14; docs/24).

   Loaded FIRST, before anything reads storage. With ?demo in the address, this swaps the
   page's localStorage for an in-memory one, so everything the app writes in the demo —
   the profile, the family wallet, the Hive's activity feed, a course's record — goes into
   memory and is gone when the tab closes. The real household on this device is never read
   and never written; that is the whole promise, and it is kept by construction rather than
   by remembering to check a flag at every write.

   If the swap cannot be made, there is no demo: window.IND_DEMO stays unset and the page
   is the ordinary app. A demo that might write to the real child is worse than none.

   The sample child herself is built by app.js (seedDemo), because that is where the
   story list and the language path live; this file only provides the sandbox. */
(function (W) {
  'use strict';
  if (!/[?&]demo(?:=[^&]*)?(?:&|$)/.test(W.location.search)) return;
  var mem = {};
  var box = {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
    setItem: function (k, v) { mem[k] = String(v); },
    removeItem: function (k) { delete mem[k]; },
    clear: function () { mem = {}; },
    key: function (i) { return Object.keys(mem)[i] || null; }
  };
  Object.defineProperty(box, 'length', { get: function () { return Object.keys(mem).length; } });
  try {
    Object.defineProperty(W, 'localStorage', { configurable: true, get: function () { return box; } });
  } catch (e) { return; }
  if (W.localStorage !== box) return;
  W.IND_DEMO = { sandbox: true };
})(window);
