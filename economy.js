/* Bizzing India — what a child earns, and what it is for.
 *
 * ONE WALLET, ONE ENGINE (family standard §1, §8; FIX-INDIA §2). Coins are the family's
 * Bizzing coins (family/bizzing-wallet.js), the same wallet in every Bizzing app, earned
 * only at the standard amounts for learning. What they buy is decided by the family's
 * avatar engine (family/bizzing-avatars.js), which this file never re-implements: it only
 * tells the engine who this child is — what they own, which worlds are open, which
 * milestones their learning has reached — and asks it what a card says.
 *
 * ============================ THE HARD RULES ============================
 *
 * 1. COINS ARE EARNED, NEVER BOUGHT. There is no path from money to coins, and there must
 *    never be one. The family plan opens worlds; it never sells coins.
 *
 * 2. NOTHING IS RANDOM. A child chooses who to meet next, at a printed price; a Legendary
 *    also names the learning that opens it. No packs drawn blind, no chance, no trading.
 *
 * 3. SACRED FIGURES AND REAL PEOPLE ARE COLLECTIBLES BY THE OWNER'S DECISION (2 Oct 2026),
 *    with the family's guard-rails: a real person's card carries a one-line `about` from
 *    their own checked card, and no sacred figure is ever in a villains' pack or drawn as an
 *    antagonist (avatar-catalogue.js; India has no villains' pack at all). Everything a child
 *    held before the change is still theirs (Store v2_to_v3 in app.js).
 *
 * 4. WORLDS: the first two are open to everyone; every other world opens with the family
 *    plan, or one at a time for 240 coins (standard §7). All fifteen of India's worlds are
 *    offered under that one rule.
 *
 * Ownership lives on the profile through the Store seam: S.own.avatars (ids) and
 * S.own.worlds (world ids). The engine counts worlds by number; this file translates.
 */
(function () {
  'use strict';

  /* THE ORDER IS THE RULE: worlds 1–2 free; 1–6 each hold two avatar packs (avatar-catalogue.js) */
  var WORLD_ORDER = ['delhi6', 'madhubani', 'diwali', 'pujo', 'cricket', 'antariksh',
                     'mumbai', 'rajasthan', 'taj', 'holi', 'dallake', 'bollywood', 'truck', 'dance', 'patterns'];

  var SHELVES = [
    { id: 'sacred', name: 'The gods and the epics', note: 'From the faiths and the epics, as families keep them.' },
    { id: 'people', name: 'People who were really here', note: 'Every one of them has a card with what they actually did.' },
    { id: 'tales', name: 'Out of the tales', note: 'The animals of the story-books.' }
  ];

  /* EXTRAS — the cosmetic line (standard §1: outfits, frames, board skins). Fixed, printed
     prices; never a lesson, a stop or a core game. Frames go round the child's own face. */
  var EXTRAS = [
    { id: 'frame-rangoli', kind: 'frame', name: 'Rangoli frame', price: 60, note: 'Chalk dots and petals, round your face.' },
    { id: 'frame-toran',   kind: 'frame', name: 'Toran frame',   price: 80, note: 'Marigolds and mango leaves, as on a doorway.' },
    { id: 'frame-kolam',   kind: 'frame', name: 'Kolam frame',   price: 80, note: 'One unbroken line, looped round the dots.' },
    { id: 'frame-diya',    kind: 'frame', name: 'Diya frame',    price: 120, note: 'Little lamps that glow when the app is in night mode.' },
    { id: 'board-rosewood', kind: 'board', game: 'carrom', name: 'Rosewood carrom board', price: 100, note: 'A dark polished board for Carrom.' },
    { id: 'board-teak',    kind: 'board', game: 'carrom', name: 'Teak carrom board',     price: 100, note: 'A pale, warm board for Carrom.' }
  ];

  function eng() { return window.IND_AVATAR_ENGINE || null; }
  function wallet() { return window.IND_WALLET || null; }
  function coins(S) { var Wl = wallet(); return Wl ? Wl.balance(S && S.name) : 0; }
  function byId(id) { return (window.IND_AVATAR_BY_ID || {})[id] || null; }
  function worldNum(id) { var i = WORLD_ORDER.indexOf(id); return i < 0 ? 0 : i + 1; }
  function plan(S) { return (S && S.dev) || (window.IND_ENT && window.IND_ENT.hasPass()) ? 'family' : 'free'; }

  /* the milestones a child's learning has reached — app.js supplies the measure */
  var measure = function () { return []; };

  function ctx(S) {
    var own = (S && S.own) || {};
    return {
      owned: S && S.dev ? (window.IND_AVATARS || []).map(function (a) { return a.id; }) : (own.avatars || []),
      worlds: (own.worlds || []).map(worldNum).filter(Boolean),
      plan: plan(S),
      milestones: measure(S),
      who: S && S.name
    };
  }

  function packOf(id) {
    var P = window.IND_AVATAR_PACKS || [];
    for (var i = 0; i < P.length; i++) if (P[i].ids.indexOf(id) >= 0) return P[i];
    return null;
  }
  function shelfOf(packId) {
    var P = window.IND_AVATAR_PACKS || [];
    for (var i = 0; i < P.length; i++) if (P[i].id === packId) return P[i].shelf || 'tales';
    return 'tales';
  }

  window.IND_ECONOMY = {
    WORLD_ORDER: WORLD_ORDER,
    SHELVES: SHELVES,
    EXTRAS: EXTRAS,
    coins: coins,
    packOf: packOf,
    shelfOf: shelfOf,
    worldNum: worldNum,
    plan: plan,
    ctx: ctx,
    setMeasure: function (fn) { if (typeof fn === 'function') measure = fn; },
    WORLD_PRICE: 240,
    FREE_WORLDS: 2,

    /* ---------------------------------------------------------------- worlds */
    worldOpen: function (S, id) {
      var E = eng(), n = worldNum(id);
      if (!n) return false;
      if (S && S.dev) return true;
      return E ? E.worldOpen(n, ctx(S)) : n <= 2;
    },
    worldPrice: function () { return eng() ? eng().WORLD_PRICE : 240; },
    /* what a locked world's tile says, in plain words (standard §8: "Opens with…") */
    worldSay: function (S, id) {
      if (this.worldOpen(S, id)) return 'Open';
      var p = this.worldPrice(), c = coins(S);
      return c >= p ? p + ' coins — tap to open it' : 'Opens with the family plan, or ' + p + ' coins · ' + (p - c) + ' more to go';
    },
    buyWorld: function (S, id) {
      var E = eng(), n = worldNum(id);
      if (!E || !n || this.worldOpen(S, id)) return false;
      if (!E.buyWorld('india', S.name, n, ctx(S))) return false;
      S.own.worlds.push(id);
      return true;
    },

    /* --------------------------------------------------------------- avatars */
    /* the engine's own words for a card: Free for everyone · 120 coins · 40 more to go ·
       First: Light ten places on the map · Opens with its world · Yours */
    stateOf: function (S, id) {
      var E = eng(), a = byId(id);
      if (!a) return { state: 'owned', say: '', tier: 'common', label: '' };
      if (S && S.dev) return { state: 'owned', say: 'Yours (tester mode)', tier: a.tier, label: E ? E.TIERS[a.tier].label : a.tier };
      if (!E) return { state: a.tier === 'common' ? 'owned' : 'world', say: '', tier: a.tier, label: a.tier };
      return E.stateOf(a, ctx(S));
    },
    avatarOpen: function (S, id) { return !byId(id) || this.stateOf(S, id).state === 'owned'; },
    buy: function (S, id) {
      var E = eng(), a = byId(id);
      if (!E || !a || this.avatarOpen(S, id)) return false;
      if (!E.buy('india', S.name, a, ctx(S))) return false;
      S.own.avatars.push(id);
      return true;
    },
    packHeld: function (S, packId) {
      var P = window.IND_AVATAR_PACKS || [], pack = null, i, n = 0, self = this;
      for (i = 0; i < P.length; i++) if (P[i].id === packId) pack = P[i];
      if (!pack) return 0;
      pack.ids.forEach(function (id) { if (self.avatarOpen(S, id)) n++; });
      return n;
    },

    /* ---------------------------------------------------------------- extras */
    extraOwned: function (S, id) { return ((S.own && S.own.extras) || []).indexOf(id) >= 0; },
    buyExtra: function (S, id) {
      var x = EXTRAS.filter(function (e) { return e.id === id; })[0], Wl = wallet();
      if (!x || !Wl || this.extraOwned(S, id)) return false;
      if (!(S && S.dev) && !Wl.spend('india', S.name, x.price, 'extra:' + id)) return false;
      S.own.extras = S.own.extras || [];
      S.own.extras.push(id);
      return true;
    },
    canAfford: function (S, n) { return !!(S && S.dev) || coins(S) >= n; }
  };
})();
