/* Bizzing India — the ENTITLEMENT SEAM (the Parivaar Pass).
 *
 * CLAUDE.md rule: entitlements are SERVER-AUTHORITATIVE — read from the DB via
 * RLS, never a client flag. This file is the seam that rule will be honoured
 * through: every gate in the app asks IND_ENT and nothing else, so when Supabase
 * lands, has() swaps its backing store and no caller changes. Until then the
 * pass state lives on-device, deny-by-default, and the redeem codes are DEMO
 * codes for walking the product — the real check is a server round-trip.
 *
 * WHAT IS FREE AND WHAT IS PASSED (docs/06):
 *   free  — every story read on screen, the map, the games, Hindi Bhasha,
 *           streaming audio while online, the Hindi language download (taster).
 *   pass  — OFFLINE AUDIO PACKS (the story library, the epics, the other eight
 *           languages) and the art packs. Offline is the paid shape of the
 *           product: it is what the plane, the car and the grandparent's spare
 *           room actually need.
 *
 * The developer unlock (S.dev) deliberately CANNOT open this — it opens the
 * sikke economy only. A paid gate a test switch can open is not a gate. */
(function () {
  'use strict';
  var W = window;
  var KEY = 'india.pass.v1';

  /* demo redeem codes — replaced by a server entitlement check (Supabase RLS)
     the day accounts exist. Kept few and unguessable enough for a demo. */
  var DEMO_CODES = { 'PARIVAAR': 'family', 'NANI2026': 'family' };

  var FREE_PACKS = { 'lang-hi': true };

  function state() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }

  W.IND_ENT = {
    hasPass: function () {
      var s = state();
      return !!(s && s.plan);
    },
    /* is this download pack open to this family? */
    canDownload: function (packId) {
      return !!FREE_PACKS[packId] || this.hasPass();
    },
    redeem: function (code) {
      code = String(code || '').trim().toUpperCase();
      var plan = DEMO_CODES[code];
      if (!plan) return false;
      try { localStorage.setItem(KEY, JSON.stringify({ plan: plan, code: code, at: Date.now() })); } catch (e) {}
      return true;
    },
    clear: function () { try { localStorage.removeItem(KEY); } catch (e) {} },
    planName: function () {
      var s = state();
      return s && s.plan === 'family' ? 'Parivaar Pass' : null;
    }
  };

  /* ?pass=CODE on the URL redeems and cleans itself off the address bar —
     for handing a working demo link to one person */
  try {
    var m = location.search.match(/[?&]pass=([^&]+)/);
    if (m && W.IND_ENT.redeem(decodeURIComponent(m[1]))) {
      history.replaceState(null, '', location.pathname + location.hash);
    }
  } catch (e) {}
})();
