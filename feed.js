/* Bizzing India — My Feed's adapter (docs/30-feed.md; FAMILY-STANDARD §6a).

   THERE IS ONE ENGINE, and it is the family's: family/bizzing-feed.js, copied byte for byte from
   Bizzing_Schedule and handed to the classic scripts by family/bridge.js as
   window.IND_FEED_ENGINE. It ranks, tiers by level, mixes and ENDS. This file only says what
   India knows about a child, in the engine's words:

     level      the Gurukul rank Home shows as "Your level" (Shishya 0 … Rishi 7)
     levelName  the rank's own name: "Coming up on Khoji", "To keep: from Shishya"
     signals    the last stories read (the story, its place, its collection), games and lessons,
                the languages started, the family's language, the places lit, the world chosen
     due        a word or letter with a miss on record whose gap is over — the same rule as Words
                that slipped, read straight from the language record — keyed "<lang>|<srs key>"
     unlocked   a card behind a language rung opens when that rung is reached (or its word slipped)
     skip       a story already read is not news: its opening and hook never come back
     extra      the level fit: a card that opened at the rung the child has just reached

   Pure: no DOM, no storage, no clock of its own. tools/check-feed.js runs this same file in node
   with the same engine. */
(function (W) {
  'use strict';
  var DAY = 864e5;
  var WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  /* the world a child chose says something about what they like; the topic each one leans to */
  var WORLD_TOPIC = { diwali: 'festival:diwali', pujo: 'festival:durga-puja', holi: 'festival:holi', cricket: 'game:triviamaster',
    madhubani: 'place:BR', mumbai: 'place:MH', rajasthan: 'place:RJ', taj: 'place:UP', dallake: 'place:JK',
    delhi6: 'place:DL', truck: 'place:PB', bollywood: 'place:MH', antariksh: 'coll:vigyan', dance: 'festival:onam', patterns: 'game:rangoli' };
  function engine(ctx) { return (ctx && ctx.engine) || W.IND_FEED_ENGINE; }

  /* the index is columns and dictionaries (tools/build-feed.js); this makes it items */
  function decode(ix) {
    if (ix.items) return ix.items;
    var bands = ix.bands;
    ix.items = ix.rows.map(function (r) {
      var u = r[5] ? String(r[5]).split(':') : null;
      return { id: r[0], kind: ix.kinds[r[1]], badge: ix.badges[r[2]],
        bands: bands.filter(function (b, i) { return r[3] & (1 << i); }),
        level: r[4] < 0 ? null : r[4], unlock: u ? { lang: u[0], rung: +u[1] } : null,
        topics: r[6].map(function (t) { return ix.topics[t]; }), g: ix.groups[r[7]], key: r[8] || null,
        play: !!(r[9] & 1), news: !!(r[9] & 2) };
    });
    return ix.items;
  }

  /* the child's band from their age: the app's own three (onboarding's OB_AGES) */
  function bandOf(age) { age = age || 8; return age <= 7 ? '4-7' : age <= 9 ? '8-9' : '10-12'; }

  /* what slipped, read straight from the language record: a miss on file, not yet secure,
     its gap over (the same rule as Bhasha's own deck, without needing the engine loaded) */
  function slippedOf(lang, now) {
    var out = [];
    Object.keys(lang || {}).forEach(function (id) {
      var srs = (lang[id] || {}).srs || {};
      Object.keys(srs).forEach(function (key) {
        var c = srs[key];
        if (!c || !(c.lapses > 0) || (c.box || 0) >= 4 || (c.due || 0) > now) return;
        out.push({ lang: id, key: key, at: c.streak === 0 ? (c.last || 0) : 0 });
      });
    });
    return out;
  }

  /* what the child has been doing lately, strongest first, as the engine's signals */
  function signalsOf(child, names) {
    var out = [];
    var put = function (t, w, why) { out.push({ topic: t, w: w, why: why }); };
    (child.recent || []).slice(0, 8).forEach(function (r, i) {
      var fresh = Math.max(1, 6 - i);
      if (r.k === 'story' && r.id) {
        put('story:' + r.id, fresh + 2, 'Because you read ' + (r.t || 'that story'));
        if (r.place) put('place:' + r.place, fresh, 'Because you read ' + (r.t || 'a story') + ', set in ' + (names[r.place] || r.place));
        if (r.coll) put('coll:' + r.coll, fresh - 1, 'More like ' + (r.t || 'what you read'));
      }
      if (r.k === 'game' && r.id) put('game:' + r.id, fresh - 2, 'You played ' + (r.t || 'it'));
      if (r.k === 'lesson' && r.lang) put('lang:' + r.lang, fresh, 'You are learning ' + (names['lang:' + r.lang] || r.lang));
    });
    (child.langs || []).forEach(function (l) { put('lang:' + l, 3, 'You are learning ' + (names['lang:' + l] || l)); });
    if (child.tongue) put('lang:' + child.tongue, 2, 'In your family’s language, ' + (names['lang:' + child.tongue] || child.tongue));
    Object.keys(child.lit || {}).forEach(function (p) { put('place:' + p, 1, 'You lit ' + (names[p] || p) + ' on the map'); });
    if (WORLD_TOPIC[child.world]) put(WORLD_TOPIC[child.world], 1, 'Because your world is ' + (names['world:' + child.world] || child.world));
    return out;
  }

  /* ONE OBJECT, AT MOST TWO CARDS A SESSION (v4 V4: one Mahabharata night came three times —
     as the episode, its hook and its moment). A card's object is read from its id: the cards
     cut from one story, one epic night, one verse, one era, one festival, one state or one street
     game share it (tools/build-feed.js names them so); every other card is its own object. */
  var FAMILY = { st: 's', sh: 's', sm: 's', sl: 's', sp: 's', sw: 's*', ep: 'e', eh: 'e', em: 'e', ew: 'e',
    vs: 'v', vm: 'v', vy: 'v', ih: 'i', ik: 'i', ib: 'i', iw: 'i', fe: 'f', fd: 'f*', fv: 'f*', pf: 'f',
    pl: 'p', pt: 'p*', pp: 'p*', pd: 'p*', pq: 'p', pc: 'p', gu: 'g', gs: 'g', ga: 'g*' };
  var PER_OBJECT = 2;
  function objectOf(id) {
    var m = /^([a-z]{2})-(.+)$/.exec(String(id)), f = m && FAMILY[m[1]];
    if (!f) return String(id);
    return f.charAt(0) + ':' + (f.length > 1 ? m[2].replace(/-\d+$/, '') : m[2]);
  }

  /* child = { band, level, read:{id}, rungs:{lang:n}, langs:[], tongue, world, recent:[…], lang, seen:{id:day}, lit }
     ctx   = { now, items (decoded), names, ranks:[…], limit, engine } */
  function feedFor(child, ctx) {
    var E = engine(ctx), now = ctx.now, names = ctx.names || {}, ranks = ctx.ranks || [];
    var rungs = child.rungs || {}, read = child.read || {};
    var due = {};
    slippedOf(child.lang, now).forEach(function (s) {
      due[s.lang + '|' + s.key] = s.at ? 'A word that slipped on ' + WEEKDAY[new Date(s.at).getDay()] + ' — its gap is over' : 'A word that slipped — its gap is over';
    });
    var byId = {}; ctx.items.forEach(function (it) { byId[it.id] = it; });
    /* the engine is the family's and is not edited here: it is asked again with an object's third
       card set aside, until no object has more than two — so its own tiers and kinds still hold */
    var aside = {}, signals = signalsOf(child, names), list;
    for (var round = 0; round < 8; round++) {
      list = E.feedFor({
        items: ctx.items, band: child.band, now: now, limit: ctx.limit, seen: child.seen || {},
        level: child.level == null ? null : child.level,
        levelName: function (n) { return ranks[n] || ('Level ' + (n + 1)); },
        signals: signals, due: due,
        unlocked: function (it) { var u = it.unlock; return !u || (rungs[u.lang] || 0) >= u.rung || !!(it.key && due[it.key]); },
        skip: function (it) { return !!aside[it.id] || (it.news && read[(it.topics[0] || '').replace('story:', '')]); },
        extra: function (it) {
          var u = it.unlock;
          if (u && (rungs[u.lang] || 0) === u.rung) return { s: 4, why: 'New: you reached Rung ' + u.rung + ' in ' + (names['lang:' + u.lang] || u.lang) };
          return null;
        },
        fallbackWhy: 'New for you'
      });
      var per = {}, over = false;
      list.forEach(function (x) { var o = objectOf(x.id); per[o] = (per[o] || 0) + 1; if (per[o] > PER_OBJECT) { aside[x.id] = 1; over = true; } });
      if (!over) break;
    }
    return list.map(function (x) { var it = byId[x.id]; return { id: x.id, kind: x.kind, g: it.g, why: x.why, tier: x.tier, level: it.level, score: x.score }; });
  }

  /* the options of a question, in an order taken from the card's id (the engine's own rule) */
  function order(id, n, ctx) { return engine(ctx).order(id, n); }

  var API = { feedFor: feedFor, decode: decode, bandOf: bandOf, slippedOf: slippedOf, signalsOf: signalsOf, order: order, objectOf: objectOf, PER_OBJECT: PER_OBJECT };
  W.IND_FEED = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : this);
