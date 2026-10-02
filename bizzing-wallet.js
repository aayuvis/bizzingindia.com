/* bizzing-wallet.js — Bizzing coins, the one family currency (FAMILY-STANDARD §1).

   A plain-script port of integration/bizzing-wallet.js in aayuvis/Bizzing_Schedule
   (that file is an ES module; this app loads classic scripts until the Vite migration,
   docs/07). SAME RULES, SAME KEY, SAME SHAPE — if one changes, change the other:

     • Only the standard events pay, at the standard amounts: answer 1 · stop 5 ·
       contest 10 · mastery 20. Nothing pays for time, logins, streaks, dice or luck —
       there is no event for them.
     • 100 coins per app per child per day, at most.
     • No randomness anywhere: spend() takes a fixed price.
     • Never transmitted; no network code exists in this file.

   localStorage['bizzing.wallet'] = { v:1, kids: { "<first name, lower case>":
     { coins, ledger:[{ a, t, n, why }] } } }. Append-only ledger, trimmed to 2,000.

   window.IND_WALLET = { earn, spend, balance, migrateFrom, ledger, EARN, DAILY_CAP } */
(function (W) {
  'use strict';
  var KEY = 'bizzing.wallet';
  var APPS = /^(bee|maths|geography|india|finance)$/;
  var EARN = { answer: 1, stop: 5, contest: 10, mastery: 20 };
  var DAILY_CAP = 100, MAX = 2000;

  function day(t) { var d = new Date(t); return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); }
  function kidKey(who) { return String(who || '').trim().toLowerCase(); }
  function load() {
    try { var o = JSON.parse(W.localStorage.getItem(KEY) || 'null'); if (o && o.v === 1 && o.kids) return o; } catch (e) {}
    return { v: 1, kids: {} };
  }
  function save(o) { try { W.localStorage.setItem(KEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function kid(o, who) { var k = kidKey(who); return k ? (o.kids[k] || (o.kids[k] = { coins: 0, ledger: [] })) : null; }

  function balance(who) { var k = load().kids[kidKey(who)]; return k ? k.coins : 0; }

  /* the coins actually paid (0 if the event is unknown or the cap is reached) */
  function earn(app, who, event, now) {
    now = now || Date.now();
    if (!APPS.test(app) || !(event in EARN)) return 0;
    var o = load(), k = kid(o, who);
    if (!k) return 0;
    var today = k.ledger.filter(function (x) { return x.a === app && x.n > 0 && x.why !== 'migrated' && day(x.t) === day(now); })
                        .reduce(function (a, x) { return a + x.n; }, 0);
    var n = Math.min(EARN[event], Math.max(0, DAILY_CAP - today));
    if (!n) return 0;
    k.coins += n;
    k.ledger.push({ a: app, t: now, n: n, why: event });
    if (k.ledger.length > MAX) k.ledger.splice(0, k.ledger.length - MAX);
    save(o);
    return n;
  }

  /* a fixed-price purchase; true if paid */
  function spend(app, who, price, why, now) {
    now = now || Date.now();
    if (!APPS.test(app) || price !== Math.floor(price) || price <= 0) return false;
    var o = load(), k = kid(o, who);
    if (!k || k.coins < price) return false;
    k.coins -= price;
    k.ledger.push({ a: app, t: now, n: -price, why: String(why).slice(0, 60) });
    if (k.ledger.length > MAX) k.ledger.splice(0, k.ledger.length - MAX);
    save(o);
    return true;
  }

  /* one-time 1:1 migration of the app's old currency */
  function migrateFrom(app, who, amount, now) {
    now = now || Date.now();
    if (!APPS.test(app) || amount !== Math.floor(amount) || amount <= 0) return 0;
    var o = load(), k = kid(o, who);
    if (!k || k.ledger.some(function (x) { return x.a === app && x.why === 'migrated'; })) return 0;
    k.coins += amount;
    k.ledger.push({ a: app, t: now, n: amount, why: 'migrated' });
    save(o);
    return amount;
  }

  function ledger(who) { var k = load().kids[kidKey(who)]; return k ? k.ledger.slice() : []; }

  W.IND_WALLET = { earn: earn, spend: spend, balance: balance, migrateFrom: migrateFrom, ledger: ledger,
                   EARN: EARN, DAILY_CAP: DAILY_CAP, KEY: KEY };
})(window);
