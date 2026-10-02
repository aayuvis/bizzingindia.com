/* Bizzing India — SIKKE: what a child earns, and what it is for.
 *
 * THE PROBLEM THIS SOLVES. The app already paid out a currency for everything a child
 * did — a story finished, an episode, a game won, a verse said aloud, a deed on the mala
 * — and there was nothing whatsoever to spend it on. A number that only goes up and buys
 * nothing is not a reward, it is a decoration, and children work that out fast.
 *
 * So: sikke (सिक्के, coins) buy worlds and open avatar packs. Most of both start locked,
 * which is what makes the earning mean anything.
 *
 * ============================ THE THREE HARD RULES ============================
 *
 * 1. SIKKE ARE EARNED, NEVER BOUGHT. There is no path from money to sikke, and there
 *    must never be one. Random draws paid for with real money is a loot box; this app's
 *    audience is four to twelve; several jurisdictions treat that as gambling aimed at
 *    children, and it would sit squarely against the DPDP/COPPA posture the rest of the
 *    app holds. Earned-only keeps it a game. If a paid tier ever ships, it unlocks
 *    CONTENT through the server (CLAUDE.md: entitlements are server-authoritative) and
 *    it does not touch this file.
 *
 * 2. NOTHING SACRED IS EVER LOCKED, PRICED OR DRAWN. The deities, the Dashavatara, the
 *    pantheon and the epic casts are free and complete from the first minute. A child
 *    does not roll for Rama and does not save up for Ganesha. This is the same rule that
 *    already keeps stats and rarity off those cards (avatar-cards.js), applied to the
 *    economy, and it is why the locked list below is the SECULAR packs only.
 *
 * 3. NOTHING IS RANDOM (family standard §1). There used to be a pitara: a paid draw
 *    weighted by rarity. It never gave a duplicate and it published its rates, and it
 *    was still a chance bought with coins. Now a child CHOOSES who to meet next, at a
 *    printed price. A rare card is not bought at all: its card says the learning that
 *    opens it ("master 5 things"), and doing that opens it. (The real-people packs have
 *    no rarity on purpose — ranking Kalpana Chawla above someone else is the same
 *    mistake as scoring her.)
 *
 * 4. ONE WALLET FOR THE FAMILY. Coins live in bizzing-wallet.js — the same wallet Bee,
 *    Maths, Geography and Finance use — and are earned only at the standard amounts
 *    for learning. India's old sikke moved across 1:1, once (Store v1_to_v2).
 *
 * ==============================================================================
 * Storage lives on the profile through the Store seam, same as everything else, so it
 * moves to the server later without touching callers.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ WORLDS
     Three are free so the picker is a real choice on day one, and they are three
     genuinely different places rather than three variations on a street. The rest are
     priced by how much there is to look at, roughly a week of ordinary play apart. */
  var FREE_WORLDS = ['delhi6', 'madhubani', 'diwali'];
  var WORLD_PRICE = {
    holi: 120, pujo: 140, dallake: 140, rajasthan: 160, mumbai: 180,
    taj: 200, patterns: 200, dance: 220, truck: 220,
    cricket: 240, bollywood: 240, antariksh: 260, chitrakatha: 120
  };

  /* ------------------------------------------------------------------- PACKS
     `null` price = never purchasable and never locked. That is not an oversight; see
     rule 2. Everything sacred and every epic cast sits in that list.

     PRICE IS DERIVED FROM SIZE, not typed by hand. The packs are genuinely uneven --
     Akbar's Darbar is six cards and the Mahabharata is seventeen -- and the hand-written
     table charged 180 for the six and 280 for the sixteen, which is a child paying nearly
     the same money for a third of the cards. Nobody would have noticed until a
     nine-year-old did, out loud. So: a flat rate per card, and the price a pack shows is
     always exactly what is in it. Rounded to the nearest ten so the numbers stay
     countable on fingers. */
  var SACRED_OR_EPIC = ['devas', 'dashavatara', 'pantheon', 'ramayana', 'mahabharata', 'asuras'];
  var FREE_PACKS = ['panch'];                       /* the Panchatantra animals, to start with */
  var PACK_UNIT = 20;                               /* sikke per card in a pack */

  /* THE SHELVES. Twelve packs in one flat wall is not a collection, it is a list, and it
     is why the packs read as arbitrary -- a pack of ten scientists sat between two epic
     casts with nothing to say why. Three shelves, and each one answers a different
     question a child actually has: who is holy, who was real, and who is in the tales.
     A pack with no shelf falls into 'tales' rather than disappearing. */
  var SHELVES = [
    { id: 'sacred', name: 'The gods and the epics',
      note: 'Open to every child from the first minute. Never bought, never drawn for.' },
    { id: 'people', name: 'People who were really here',
      note: 'Every one of them has an Itihaas card with the evidence on it.' },
    { id: 'tales', name: 'Out of the tales',
      note: 'The animals and the courts of the story-books.' }
  ];

  var CARD_PRICE = 40;                              /* one card you choose, at a printed price */

  /* A RARE CARD IS EARNED BY LEARNING, never bought (family standard §1): its card names
     the milestone. "Mastered" counts the evidence the rank counts — course objectives
     learned under the day rule and Bhasha rungs mastered. The people packs carry no
     rarity at all, because a rarer real person is a ranking. */
  var RARE_NEEDS = { rare: 5, legendary: 15 };
  var FLAT_PACKS = ['great', 'khel', 'naya', 'vigyan'];

  function packOf(id) {
    var P = window.IND_AVATAR_PACKS || [];
    for (var i = 0; i < P.length; i++) if (P[i].ids.indexOf(id) >= 0) return P[i];
    return null;
  }

  /* how a card opens: a printed price, or (for a rare one) a named piece of learning */
  function cardRule(packId, avatarId) {
    var r = FLAT_PACKS.indexOf(packId) >= 0 ? 'common' : ((window.IND_AVATAR_RARITY || {})[avatarId] || 'common');
    if (RARE_NEEDS[r]) return { kind: 'learn', need: RARE_NEEDS[r], rarity: r,
      say: 'Opens when you have mastered ' + RARE_NEEDS[r] + ' things' };
    return { kind: 'price', price: CARD_PRICE, rarity: r };
  }

  /* the family wallet, by the child's first name; tester mode never charges */
  function wallet() { return window.IND_WALLET || null; }
  function coins(S) { var Wl = wallet(); return Wl ? Wl.balance(S && S.name) : 0; }

  function shelfOf(packId) {
    var P = window.IND_AVATAR_PACKS || [];
    for (var i = 0; i < P.length; i++) if (P[i].id === packId) return P[i].shelf || 'tales';
    return 'tales';
  }
  function packSize(packId) {
    var P = window.IND_AVATAR_PACKS || [];
    for (var i = 0; i < P.length; i++) if (P[i].id === packId) return (P[i].ids || []).length;
    return 0;
  }

  window.IND_ECONOMY = {
    FREE_WORLDS: FREE_WORLDS,
    WORLD_PRICE: WORLD_PRICE,
    FREE_PACKS: FREE_PACKS,
    PACK_UNIT: PACK_UNIT,
    SHELVES: SHELVES,
    shelfOf: shelfOf,
    packSize: packSize,
    SACRED_OR_EPIC: SACRED_OR_EPIC,
    CARD_PRICE: CARD_PRICE,
    cardRule: cardRule,
    coins: coins,
    packOf: packOf,

    /* Is this world open to this child? */
    worldOpen: function (S, id) {
      if (S.dev) return true;
      if (FREE_WORLDS.indexOf(id) >= 0) return true;
      return ((S.own && S.own.worlds) || []).indexOf(id) >= 0;
    },
    worldPrice: function (id) { return WORLD_PRICE[id] || 160; },

    /* A pack is "open" when it is sacred/epic (always), free, or bought outright. */
    packOpen: function (S, id) {
      if (S.dev) return true;
      if (SACRED_OR_EPIC.indexOf(id) >= 0) return true;
      if (FREE_PACKS.indexOf(id) >= 0) return true;
      return ((S.own && S.own.packs) || []).indexOf(id) >= 0;
    },
    packPrice: function (id) {
      if (SACRED_OR_EPIC.indexOf(id) >= 0) return null;
      var n = packSize(id);
      if (!n) return null;
      return Math.max(60, Math.round(n * PACK_UNIT / 10) * 10);
    },

    /* How many of a pack this child holds, and how many there are. The shop shows both
       on every pack, because "6 of 14" is the only honest way to price the rest of it --
       and because a pack you have nearly finished should look nearly finished. */
    packHeld: function (S, packId) {
      var P = window.IND_AVATAR_PACKS || [], pack = null, i, n = 0;
      for (i = 0; i < P.length; i++) if (P[i].id === packId) pack = P[i];
      if (!pack) return 0;
      for (i = 0; i < pack.ids.length; i++) if (this.avatarOpen(S, pack.ids[i])) n++;
      return n;
    },

    /* A single avatar can be held even when its pack is not bought — chosen one at a time,
       or opened by learning. Sacred and epic cards are held by everyone from the start. */
    avatarOpen: function (S, avatarId) {
      if (S.dev) return true;
      var pack = packOf(avatarId);
      if (!pack) return true;
      if (SACRED_OR_EPIC.indexOf(pack.id) >= 0) return true;
      if (FREE_PACKS.indexOf(pack.id) >= 0) return true;
      if (((S.own && S.own.packs) || []).indexOf(pack.id) >= 0) return true;
      return ((S.own && S.own.avatars) || []).indexOf(avatarId) >= 0;
    },

    /* Which cards in this pack the child does not have yet. */
    unheld: function (S, packId) {
      var P = window.IND_AVATAR_PACKS || [], pack = null, i;
      for (i = 0; i < P.length; i++) if (P[i].id === packId) pack = P[i];
      if (!pack) return [];
      var have = (S.own && S.own.avatars) || [];
      return pack.ids.filter(function (id) { return have.indexOf(id) < 0; });
    },

    /* The wallet. One place that knows how to spend, so no view can go negative — and it
       is the family's wallet, so a coin spent here is a coin gone in every Bizzing app. */
    canAfford: function (S, n) { return !!S.dev || coins(S) >= n; },
    spend: function (S, n, why) {
      if (S.dev) return true;                        /* tester mode never charges */
      var Wl = wallet();
      return !!(Wl && Wl.spend('india', S.name, n, why || 'shop'));
    }
  };
})();
