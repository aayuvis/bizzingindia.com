/* bizzing-activity.js — the family's activity feed, so the Hive can count a child's minutes
   and milestones without the child typing anything (FAMILY-STANDARD §13).

   A plain-script port of integration/bizzing-activity.js in aayuvis/Bizzing_Schedule (that
   file is an ES module; this app loads classic scripts until the Vite migration, docs/07).
   SAME KEY, SAME SHAPE, SAME RULES — if one changes, change the other:

     localStorage['bizzing.activity'] = { v:1, s:[ { a:'india', d:'2026-10-02', t:1020,
                                                     m:18, who:'Asha' }, … ] }
     app id, local date, start minute, ACTIVE minutes, the child's first name. A milestone
     is the same row with m:0 and ev:'band'|'world'|'stop'|'mastery' and a label.

   ACTIVE means the tab is visible AND the child touched, clicked, typed or scrolled in the
   last two minutes; only whole minutes are written. Kept 120 days, 4,000 rows at most.
   Never transmitted: no network code exists in this file.

   window.IND_ACTIVITY = { trackActivity(app, getName) -> stop(), trackMilestone(app, who, ev, label) } */
(function (W, D) {
  'use strict';
  var KEY = 'bizzing.activity';
  var IDLE = 2 * 60 * 1000, TICK = 15 * 1000, GAP = 5 * 60 * 1000, KEEP_DAYS = 120, MAX = 4000;
  var APPS = /^(bee|maths|geography|india|finance)$/;
  function pad(n) { return String(n).length < 2 ? '0' + n : String(n); }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  function load() {
    try { var o = JSON.parse(W.localStorage.getItem(KEY) || 'null'); return o && Array.isArray(o.s) ? o : { v: 1, s: [] }; }
    catch (e) { return { v: 1, s: [] }; }
  }
  function store(o) {
    var cutoff = ymd(new Date(Date.now() - KEEP_DAYS * 864e5));
    o.s = o.s.filter(function (x) { return x.d >= cutoff; }).slice(-MAX);
    try { W.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  function trackActivity(app, getName) {
    getName = getName || function () { return null; };
    if (!APPS.test(app)) return function () {};
    var lastInput = Date.now(), activeMs = 0, lastTick = Date.now(), session = null, lastActive = 0;
    var poke = function () { lastInput = Date.now(); };
    var EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];
    EVENTS.forEach(function (e) { W.addEventListener(e, poke, { passive: true, capture: true }); });

    var tick = function () {
      var now = Date.now(), dt = now - lastTick;
      lastTick = now;
      if (D.visibilityState !== 'visible' || now - lastInput > IDLE || dt > TICK * 3) return;
      activeMs += dt;
      if (activeMs < 60000) return;          /* whole minutes only */
      activeMs -= 60000;
      var o = load(), d = new Date(), who = String(getName() || '').trim() || undefined;
      /* the same session if it is the same app, child and day, and < 5 min since last active */
      if (!session || now - lastActive > GAP || session.d !== ymd(d) || session.who !== who) {
        session = { a: app, d: ymd(d), t: d.getHours() * 60 + d.getMinutes(), m: 0 };
        if (who) session.who = who;
        o.s.push(session);
      } else {
        var i = -1;
        o.s.forEach(function (x, k) { if (x.a === session.a && x.d === session.d && x.t === session.t && x.who === session.who) i = k; });
        if (i >= 0) session = o.s[i]; else o.s.push(session);
      }
      session.m += 1;
      lastActive = now;
      store(o);
    };
    var timer = setInterval(tick, TICK);
    return function () {
      clearInterval(timer);
      EVENTS.forEach(function (e) { W.removeEventListener(e, poke, { capture: true }); });
    };
  }

  /* a band, world, stop or mastery reached — m is 0 so it never counts as minutes */
  function trackMilestone(app, who, ev, label) {
    if (!APPS.test(app) || !/^(band|world|stop|mastery)$/.test(ev)) return;
    var d = new Date(), o = load();
    var row = { a: app, d: ymd(d), t: d.getHours() * 60 + d.getMinutes(), m: 0, ev: ev, label: String(label).slice(0, 80) };
    if (who) row.who = String(who).trim();
    o.s.push(row);
    store(o);
  }

  W.IND_ACTIVITY = { trackActivity: trackActivity, trackMilestone: trackMilestone, KEY: KEY };
})(window, document);
