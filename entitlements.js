/* Bizzing India — the ENTITLEMENT SEAM (the family plan).
 *
 * CLAUDE.md rule: entitlements are SERVER-AUTHORITATIVE — read from the DB via
 * RLS, never a client flag. This file is the seam that rule will be honoured
 * through: every gate in the app asks IND_ENT and nothing else, so when Supabase
 * lands, has() swaps its backing store and no caller changes. Until then the
 * plan state lives on-device, deny-by-default, and only tester mode can set it —
 * there are no redeem codes in client code. The real check is a server round-trip.
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

  /* NO PASS CODES IN THIS FILE (FIX-INDIA §1, R7; family standard §15). There used to be two
     demo codes here, in plain text, in a file every visitor downloads — which made them not a
     gate but a password printed on the door. A plan is granted by the family server when it
     exists (one server for every Bizzing app, FIX-INDIA §5); until then the only way to turn
     the family plan on is tester mode, on a device a grown-up put into tester mode. */

  var FREE_PACKS = { 'lang-hi': true };

  function state() {
    /* the household's, not a child's: through the Store seam's family keys */
    try { return JSON.parse((W.IND_STORE ? W.IND_STORE.famGet(KEY) : localStorage.getItem(KEY)) || 'null'); } catch (e) { return null; }
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
    /* The server's job. There is no server yet, so nothing redeems — and nothing in this file
       can be typed to open anything. */
    redeem: function () { return false; },
    /* tester mode only (app.js checks tester() before calling): the plan a grown-up is
       walking the product as. Never reachable from a child's screen. */
    testerPlan: function (on) {
      try { if (on) { var v = JSON.stringify({ plan: 'family', by: 'tester', at: Date.now() });
                      if (W.IND_STORE) W.IND_STORE.famSet(KEY, v); else localStorage.setItem(KEY, v); }
            else this.clear(); } catch (e) {}
    },
    clear: function () { try { if (W.IND_STORE) W.IND_STORE.famDel(KEY); else localStorage.removeItem(KEY); } catch (e) {} },
    planName: function () {
      var s = state();
      return s && s.plan === 'family' ? 'The family plan' : null;
    }
  };

})();
