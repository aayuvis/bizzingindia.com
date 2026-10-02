/* Bizzing India — My Feed's engine (docs/30-feed.md). Pure: no DOM, no storage, no clock of
   its own. app.js hands it the child (read from the Store seam) and the day; it hands back an
   ordered list of cards, each with the plain-words reason it is there. tools/check-feed.js
   runs this same file in node.

   THE RULES IT KEEPS (owner, 2 Oct 2026; family standard §6, §14):
     - It ENDS. One session is LIMIT cards and then a finished card; nothing loads more.
     - Nothing is ranked by what holds attention. The score is what the child has been
       doing (context), what they are ready for (level fit), what is due again (a word that
       slipped, after its gap), and what they have not seen (novelty) — minus what they saw
       lately and minus a third card of the same kind in a row.
     - A card a child's band does not open never appears; nor does one their progress has
       not reached (a rung, a story read).
     - Every card says why it is there, in words a child and a parent can check. */
(function (W) {
  'use strict';
  var LIMIT = 20, MAX_PLAY = 5, MAX_KIND = 6, SPREAD = 1.5, WHY_COST = 1.6, MAX_WHY = 6;
  var DAY = 864e5;
  var WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  /* the world a child chose says something about what they like; the topic each one leans to */
  var WORLD_TOPIC = { diwali: 'festival:diwali', pujo: 'festival:durga-puja', holi: 'festival:holi', cricket: 'game:triviamaster',
    madhubani: 'place:BR', mumbai: 'place:MH', rajasthan: 'place:RJ', taj: 'place:UP', dallake: 'place:JK',
    delhi6: 'place:DL', truck: 'place:PB', bollywood: 'place:MH', antariksh: 'coll:vigyan', dance: 'festival:onam', patterns: 'game:rangoli' };

  function decode(index) {
    var K = index.keys;
    return index.rows.map(function (r) { var o = {}; K.forEach(function (k, i) { o[k] = r[i]; }); return o; });
  }
  /* a stable number from a string: the same card, the same day, the same jitter */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

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

  /* child = { band, read:{id}, rungs:{lang:n}, langs:[], tongue, world, recent:[{k,id,t,place,at}],
               lang (the Bhasha record), seen:{id:day}, readN } */
  function feedFor(child, ctx) {
    var now = ctx.now, today = Math.floor(now / DAY), items = ctx.items, limit = ctx.limit || LIMIT;
    var names = ctx.names || {};
    var slipped = {}; slippedOf(child.lang, now).forEach(function (s) { slipped[s.lang + '|' + s.key] = s; });
    /* what the child has been doing lately, strongest first */
    var ctxTopic = {};
    var put = function (t, w, why) { if (!ctxTopic[t] || ctxTopic[t].w < w) ctxTopic[t] = { w: w, why: why }; };
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

    var scored = [];
    items.forEach(function (it) {
      if ((it.bands || []).indexOf(child.band) < 0) return;                       /* never above the band */
      var u = it.unlock;
      if (u && u.lang && (child.rungs[u.lang] || 0) < u.rung) return;              /* not reached yet */
      if (u && u.read && (child.readN || 0) < u.read) return;
      var s = 0, why = null, best = 0;
      (it.topics || []).forEach(function (t) { var c = ctxTopic[t]; if (c && c.w > best) { best = c.w; why = c.why; } });
      s += best;
      /* level fit: a card that opened at the rung the child has just reached */
      if (u && u.lang && (child.rungs[u.lang] || 0) === u.rung) { s += 4; if (best < 4) why = 'New: you reached Rung ' + u.rung + ' in ' + (names['lang:' + u.lang] || u.lang); }
      /* due: a word or letter that slipped, its gap now over */
      var sl = it.key && it.topics && slipped[(it.topics[0] || '').replace('lang:', '') + '|' + it.key];
      if (sl) { s += 9; why = sl.at ? 'A word that slipped on ' + WEEKDAY[new Date(sl.at).getDay()] + ' — its gap is over' : 'A word that slipped — its gap is over'; }
      /* a story already read is not news: its opening never comes back as a card */
      if (it.kind === 'story' && child.read && it.topics && child.read[(it.topics[0] || '').replace('story:', '')]) return;
      /* novelty, and what was seen lately */
      var seen = child.seen && child.seen[it.id];
      if (seen == null) s += 2; else if (today - seen < 7) s -= 12; else s -= 2;
      s += (hash(it.id + ':' + today) % 1000) / 600;                             /* a little variety, same all day */
      scored.push({ it: it, s: s, why: why });
    });
    scored.sort(function (a, b) { return b.s - a.s; });

    /* a session: never three of a kind in a row, a few questions at most, a mix of kinds */
    var out = [], kinds = {}, whys = {}, plays = 0;
    var pool = scored.slice();
    while (out.length < limit && pool.length) {
      /* each card of a kind already in the session costs the next one of that kind a little,
         so a session is a mix by arithmetic, not by luck */
      var pick = -1, bestS = -Infinity;
      for (var i = 0; i < pool.length; i++) {
        var k = pool[i].it.kind, n = out.length;
        if (n >= 2 && out[n - 1].kind === k && out[n - 2].kind === k) continue;
        if (k === 'play' && plays >= MAX_PLAY) continue;
        if ((kinds[k] || 0) >= MAX_KIND) continue;
        /* and one reason is not the whole feed: a story just read leads a few cards, not twenty */
        var wn = pool[i].why ? (whys[pool[i].why] || 0) : 0;
        if (wn >= MAX_WHY) continue;
        var eff = pool[i].s - SPREAD * (kinds[k] || 0) - WHY_COST * wn;
        if (eff > bestS) { bestS = eff; pick = i; }
      }
      if (pick < 0) break;
      var p = pool.splice(pick, 1)[0];
      kinds[p.it.kind] = (kinds[p.it.kind] || 0) + 1; if (p.it.kind === 'play') plays++;
      if (p.why) whys[p.why] = (whys[p.why] || 0) + 1;
      out.push({ id: p.it.id, kind: p.it.kind, g: p.it.g, why: p.why, score: p.s });
    }
    return out;
  }

  /* the options of a question, in an order taken from the card's id — never the order they
     were written in (the right one is written first), never the same place every time */
  function order(id, n) {
    var idx = []; for (var i = 0; i < n; i++) idx.push(i);
    var h = hash(id);
    for (var j = n - 1; j > 0; j--) { var r = h % (j + 1); h = Math.floor(h / (j + 1)) + 7919 * j; var t = idx[j]; idx[j] = idx[r]; idx[r] = t; }
    return idx;
  }

  var API = { feedFor: feedFor, decode: decode, bandOf: bandOf, slippedOf: slippedOf, order: order, LIMIT: LIMIT, hash: hash };
  W.IND_FEED = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : this);
