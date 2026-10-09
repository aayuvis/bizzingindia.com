/* Bizzing India — PLAY · Kaal Nadi, the River of Time (games spec §5.1; docs/32).

   History is a river. A child who can put things in order, and say HOW WE KNOW, can read
   history. Five levels, one river:

     L1 Pehle–Baad   two cards: which came first?
     L2 Teen ki Kadi order three, earliest at the head of the river
     L3 Nadi par     five cards dropped onto the river's era banks — a card whose range
                     overlaps a bank is right on it (ranges are honoured, never rounded)
     L4 Kaise pata?  an age of the river and three kinds of evidence: which tells us?
     L5 Kadi todo    a row in time order with one card moved: find the one out of place

   EDITORIAL (docs/05, binding — this file writes no history):
   - Every card is a `moments[]` entry of app/data-itihaas.js, read at run time: its words,
     its `when` exactly as written, and its era's `sources[]`. Nothing is typed here. The
     year span used for ordering is PARSED from that `when` string; a `when` the parser
     cannot read ("the years after", "around the same time") is not dealt at all.
   - Contested chronology is never scored. A `when` the data marks as argued ("historians
     argue about exactly when", "the date is argued over") goes ONLY to the unscored
     "Historians are still arguing" lane, and no answer() is ever reported for it.
   - Sensitive topics are not in this game: an era the data gates to 11+, flags
     needs_review, or gives a partition_gate is left out whole (colonial, freedom and the
     contemporary era today), and any moment whose words touch Partition, caste, famine,
     communal or colonial violence is dropped too. A sorting game is the wrong form for them.
   - 📜 Itihaas on every card. The river's banks are data-sabhyata.js's own eras, with their
     own names and dates. The whole card set waits for the named reviewer (review: true):
     it opens only in tester mode until it is signed.

   Contract (docs/32): engine(host, opts, done); opts.level 1–5, opts.answer() once per item
   at its first attempt, done({win, score, asked, firstTryRight, level, levelNext}). The host
   plays right/wrong; this file never does. Keyboard AND touch: drag or tap a bank, arrows +
   Enter; number keys pick options; Enter presses Aage on the miss card. */
(function () {
  'use strict';
  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document;

  /* ================================================================ STYLE */
  var CSS = [
    '.kn{--kn-land:#e7efd9;--kn-land2:#d6e6c4;--kn-water:#7cc6e0;--kn-water2:#4aa3c8;--kn-foam:rgba(255,255,255,.55);--kn-card:#fffdf7;--kn-ink:#1e1440;--kn-bank:#f4ead2;--kn-bank-on:#ffe7a8;',
    'position:relative;isolation:isolate;border-radius:var(--radius-xl,22px);color:var(--text);font-family:var(--body);',
    'background:radial-gradient(120% 80% at 50% 0%,var(--kn-land) 0%,var(--kn-land2) 100%);padding:clamp(12px,2.4vw,26px);min-height:min(78vh,720px);display:flex;flex-direction:column;gap:14px;-webkit-tap-highlight-color:transparent}',
    '[data-mode="night"] .kn{--kn-land:#18261f;--kn-land2:#101a16;--kn-water:#1f5a78;--kn-water2:#163f57;--kn-foam:rgba(190,230,255,.18);--kn-card:#221b3d;--kn-ink:#f2eeff;--kn-bank:#2a2445;--kn-bank-on:#4a3a14}',
    '.kn-river{position:absolute;top:0;right:0;bottom:0;left:0;z-index:-1;pointer-events:none;overflow:hidden;border-radius:inherit}',
    '.kn-river svg{width:100%;height:100%;display:block}',
    '.kn-river .v{display:none}',
    '@media (max-width:640px){.kn-river .h{display:none}.kn-river .v{display:block}}',
    '.kn-head{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;text-align:center}',
    '.kn-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;background:var(--card);border:1px solid var(--line2);font:700 13px/1.3 var(--body);color:var(--text)}',
    '.kn-mode{font:800 clamp(18px,2.4vw,24px)/1.2 var(--display);margin:0}',
    '.kn-step{font:600 13px var(--body);color:var(--text2);background:var(--card);border:1px solid var(--line);border-radius:999px;padding:3px 10px}',
    '.kn-q{text-align:center;font:700 clamp(16px,2vw,19px)/1.4 var(--display);margin:2px auto 0;max-width:46ch;color:var(--text)}',
    '.kn-board{flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px;width:100%;max-width:1040px;margin:0 auto}',
    /* a card: what happened, with its badge; its when is NEVER on it before the answer */
    '.kn-card{position:relative;display:flex;flex-direction:column;gap:6px;text-align:left;min-height:96px;padding:14px 16px 14px;border-radius:var(--radius-lg,18px);',
    'background:var(--kn-card);color:var(--kn-ink);border:2px solid var(--line2);box-shadow:var(--shadow);font:600 15.5px/1.45 var(--body);cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none}',
    '.kn-card:focus-visible,.kn-bank:focus-visible,.kn-opt:focus-visible,.kn-btn:focus-visible{outline:3px solid var(--accent2);outline-offset:3px}',
    '.kn-card .kn-cb{font:700 11.5px/1 var(--body);letter-spacing:.06em;text-transform:uppercase;color:var(--text2)}',
    '.kn-card .kn-when{font:700 13px/1.3 var(--body);color:var(--accent-ink,var(--accent))}',
    '.kn-card.sel{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft),var(--shadow)}',
    '.kn-card.lift{transform:translateY(-4px) scale(1.02);border-color:var(--accent2)}',
    '.kn-card.ok{border-color:var(--good)}',
    '.kn-card.no{border-color:var(--bad)}',
    '.kn-card.ghost{opacity:.35}',
    '.kn-pair{display:grid;grid-template-columns:1fr 1fr;gap:18px}',
    '.kn-pair .kn-card{min-height:170px;padding:20px 22px;font-size:19px;line-height:1.5;justify-content:center}',
    '.kn-row{display:grid;gap:12px;grid-template-columns:repeat(var(--n,3),minmax(0,1fr))}',
    '@media (max-width:640px){.kn-pair,.kn-row{grid-template-columns:1fr}.kn-card{min-height:64px;font-size:15px}}',
    '.kn-flow{display:flex;align-items:center;justify-content:center;gap:8px;font:700 12.5px var(--body);color:var(--text2)}',
    '.kn-flow i{flex:1;max-width:240px;height:2px;background:linear-gradient(90deg,transparent,var(--kn-water2))}',
    '.kn-flow i:last-child{background:linear-gradient(90deg,var(--kn-water2),transparent)}',
    /* L3: the river and its banks, drawn by the app — never painted into a plate */
    '.kn-nadi{display:grid;gap:6px 8px;grid-template-columns:repeat(var(--nb2,14),minmax(0,1fr));grid-template-rows:auto 34px auto;align-items:stretch}',
    '.kn-stream{grid-row:2;grid-column:1/-1;border-radius:999px;background:linear-gradient(90deg,var(--kn-water2),var(--kn-water) 40%,var(--kn-water2));box-shadow:inset 0 0 0 2px var(--kn-foam);position:relative;overflow:hidden}',
    '.kn-stream:after{content:"";position:absolute;top:0;right:0;bottom:0;left:0;background:repeating-linear-gradient(100deg,transparent 0 22px,var(--kn-foam) 22px 24px,transparent 24px 46px);opacity:.6}',
    '.kn-bank{grid-column:var(--c) / span 2;min-height:64px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center;padding:6px 6px;border-radius:14px;',
    'background:var(--kn-bank);border:2px solid var(--line2);color:var(--text);font:700 12.5px/1.25 var(--body);cursor:pointer}',
    '.kn-bank small{font:600 11.5px/1.25 var(--body);color:var(--text2)}',
    '.kn-bank.top{grid-row:1}.kn-bank.bot{grid-row:3}',
    '.kn-bank.hot,.kn-bank:hover{border-color:var(--accent);background:var(--kn-bank-on)}',
    '.kn-bank.right{border-color:var(--good);box-shadow:0 0 0 3px color-mix(in srgb,var(--good) 30%,transparent)}',
    '.kn-bank .kn-pin{display:flex;gap:3px;justify-content:center;min-height:8px}',
    '.kn-bank .kn-pin b{width:8px;height:8px;border-radius:50%;background:var(--accent)}',
    '@media (max-width:640px){.kn-nadi{grid-template-columns:1fr 30px 1fr;grid-template-rows:repeat(var(--nb2,14),minmax(26px,auto));gap:6px 8px}',
    '.kn-stream{grid-column:2;grid-row:1/-1;background:linear-gradient(180deg,var(--kn-water2),var(--kn-water) 40%,var(--kn-water2))}',
    '.kn-bank.top,.kn-bank.bot{grid-row:var(--c) / span 2;min-height:46px}.kn-bank.top{grid-column:1}.kn-bank.bot{grid-column:3}}',
    '.kn-now{display:flex;justify-content:center}',
    '.kn-now .kn-card{max-width:560px;width:100%}',
    '.kn-lane{margin:4px auto 0;max-width:760px;width:100%;border:2px dashed var(--line2);border-radius:var(--radius-lg,18px);padding:10px 14px;background:color-mix(in srgb,var(--card) 82%,transparent);font:500 14px/1.5 var(--body);color:var(--text)}',
    '.kn-lane b{display:block;font:800 13px/1.3 var(--body);color:var(--text2);margin-bottom:2px}',
    /* L4 options */
    '.kn-opts{display:grid;gap:10px;grid-template-columns:1fr;max-width:680px;width:100%;margin:0 auto}',
    '.kn-opt{display:flex;align-items:center;gap:12px;min-height:56px;padding:10px 14px;text-align:left;border-radius:var(--radius-lg,18px);background:var(--card);color:var(--text);border:2px solid var(--line2);font:600 15px/1.4 var(--body);cursor:pointer}',
    '.kn-opt .kn-n{flex:0 0 28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--card2);border:1px solid var(--line2);font:800 13px var(--body);color:var(--text2)}',
    '.kn-opt:hover{border-color:var(--accent)}',
    '.kn-opt.ok{border-color:var(--good)}',
    '.kn-era{max-width:640px;margin:0 auto;text-align:center;background:var(--kn-card);color:var(--kn-ink);border-radius:var(--radius-lg,18px);border:2px solid var(--line2);padding:14px 18px;box-shadow:var(--shadow)}',
    '.kn-era h3{margin:4px 0 2px;font:800 22px/1.25 var(--display)}',
    '.kn-era p{margin:0;font:500 15px/1.5 var(--body);color:var(--text2)}',
    /* the action row: sticky above the tab bar on a phone */
    '.kn-act{position:sticky;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:2;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding-top:4px}',
    '@media (max-width:720px){.kn-act{bottom:calc(78px + env(safe-area-inset-bottom,0px))}}',
    '.kn-btn{min-height:48px;min-width:120px;padding:10px 22px;border-radius:999px;border:2px solid var(--accent);background:var(--accent);color:#fff;font:800 16px var(--body);cursor:pointer;box-shadow:var(--shadow)}',
    '.kn-btn.ghost{background:var(--card);color:var(--text);border-color:var(--line2)}',
    '.kn-btn:disabled{opacity:.45;cursor:default}',
    '.kn-hint{text-align:center;font:500 12.5px/1.4 var(--body);color:var(--text2);margin:0}',
    '.kn-ok{text-align:center;font:800 17px var(--display);color:var(--good);margin:0}',
    '.kn-ok span{display:block;font:500 14px/1.5 var(--body);color:var(--text2)}',
    /* the miss card (docs/32): holds until Aage */
    '.kn .gm-miss{max-width:640px;margin:0 auto;width:100%;background:var(--card);color:var(--text);border:2px solid var(--accent2);border-radius:var(--radius-lg,18px);padding:14px 18px;box-shadow:var(--shadow-lg);text-align:center;font:500 15px/1.55 var(--body)}',
    '.kn .gm-miss b{font:800 18px var(--display)}',
    '.kn .gm-ans{display:block;margin:6px 0 2px;font-weight:700}',
    '.kn .gm-teach{margin:6px 0 10px;color:var(--text2);font-size:14px}',
    '.kn .gm-aage{min-height:48px;padding:10px 26px;border-radius:999px;border:2px solid var(--accent);background:var(--accent);color:#fff;font:800 16px var(--body);cursor:pointer}',
    '.kn-drag{position:fixed;z-index:9999;pointer-events:none;max-width:320px;opacity:.92;transform:rotate(-2deg)}',
    '.kn-wait{max-width:560px;margin:auto;text-align:center;background:var(--card);border-radius:var(--radius-lg,18px);padding:22px;border:1px solid var(--line2)}',
    '@media (prefers-reduced-motion:reduce){.kn *{transition:none!important;animation:none!important}.kn-card.lift{transform:none}}',
    '.kn.calm .kn-stream:after{display:none}'
  ].join('');

  function injectCSS() {
    if (!D || D.getElementById('kn-css')) return;
    var s = D.createElement('style'); s.id = 'kn-css'; s.textContent = CSS;
    (D.head || D.documentElement).appendChild(s);
  }

  /* ================================================================ HELPERS */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function tester() { try { return !!(W.IND_STORE && W.IND_STORE.loadDevice('tester', false) === true); } catch (e) { return false; } }
  function tap() { try { if (W.IND_SFX) W.IND_SFX.play('tap'); } catch (e) {} }
  function focusSoft(el) { if (el && el.focus) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } } }

  /* ============================================================ THE CARD SET
     Read from the data on every call: nothing is cached across a data change. */

  var NOW = 2100;   /* "to now", "today": an open end, never a claimed year */
  var SENSITIVE = /\b(partition|caste|castes|famines?|riots?|massacres?|communal|killed|kills|uprising|violence|executions?|jail(ed|s)?)\b/i;
  var VAGUE = /same time|years after|centuries that follow|early centuries/i;

  /* "about 2600–1900 BCE" → {lo:-2600, hi:-1900, approx:true}. Years BCE are negative.
     Returns null for anything it cannot read honestly. Exported for the check. */
  function parseWhen(s) {
    s = String(s || '');
    if (!s || VAGUE.test(s)) return null;
    var approx = /about|around|c\.|sometime|by |onwards|from /i.test(s);
    var bce = /BCE/.test(s), m, lo, hi;
    var sign = function (n, isB) { return isB ? -n : n; };
    /* the Ns, the Ns and Ms, the Ns to Ms (decades and centuries) */
    if ((m = /the (\d{2,4})s(?:\s+(?:and|to)\s+(?:the\s+)?(\d{2,4})s)?/.exec(s))) {
      var a = +m[1], b = m[2] ? +m[2] : null;
      if (b != null && b < 100) b = Math.floor(a / 100) * 100 + b;       /* "1960s and 70s" */
      var span = function (n) { return n % 100 === 0 ? 99 : 9; };
      lo = sign(a, bce); hi = b != null ? sign(b + span(b), bce) : sign(a + span(a), bce);
      if (lo > hi) { var t = lo; lo = hi; hi = t; }
      return { lo: lo, hi: hi, approx: true };
    }
    /* an explicit range, with an era on either side: "300 BCE–200 CE", "1951–52" */
    if ((m = /(\d{2,4})\s*(BCE|CE)?\s*[–-]\s*(\d{2,4})\s*(BCE|CE)?/.exec(s))) {
      var x = +m[1], y = +m[3];
      var xb = m[2] ? m[2] === 'BCE' : (m[4] ? m[4] === 'BCE' : bce);
      var yb = m[4] ? m[4] === 'BCE' : xb;
      if (!xb && !yb && y < 100 && x >= 100) y = Math.floor(x / 100) * 100 + y;
      lo = sign(x, xb); hi = sign(y, yb);
      if (lo > hi) { var t2 = lo; lo = hi; hi = t2; }
      return { lo: lo, hi: hi, approx: approx };
    }
    /* a single year (the last 3–4 digit number: "15 August 1947", "December 2024") */
    var all = s.match(/\d{3,4}/g);
    if (all && all.length) {
      var yv = sign(+all[all.length - 1], bce);
      return { lo: yv, hi: yv, approx: approx };
    }
    return null;
  }
  /* "about" widens a point a little either way: the data says it is approximate, so the
     game must not mark a child wrong by a year the data never claimed. */
  function fuzz(r) {
    if (!r || !r.approx) return r;
    var f = r.lo < 0 ? 25 : 10;
    return { lo: r.lo - f, hi: r.hi + f, approx: true };
  }
  function contested(s) { return /argu/i.test(String(s || '')); }
  function eraOut(e) { return !!(e.needs_review || (e.gate && e.gate >= 11) || e.partition_gate); }

  function cardSet() {
    var I = W.IND_ITIHAAS, out = { cards: [], arguing: [], dropped: [] };
    if (!I || !I.eras) return out;
    I.eras.forEach(function (e) {
      (e.moments || []).forEach(function (m, i) {
        var id = e.id + '.' + i;
        var base = { id: id, era: e.id, eraTitle: e.title, what: m.what, when: m.when,
          sources: (e.sources || []).slice(), badge: 'itihaas' };
        if (eraOut(e)) { out.dropped.push({ id: id, why: 'era held for review' }); return; }
        if (SENSITIVE.test(m.what) || SENSITIVE.test(m.when)) { out.dropped.push({ id: id, why: 'sensitive' }); return; }
        if (!base.sources.length) { out.dropped.push({ id: id, why: 'no sources' }); return; }
        if (contested(m.when)) { base.contested = true; out.arguing.push(base); return; }
        var r = parseWhen(m.when);
        if (!r) { out.dropped.push({ id: id, why: 'no readable date' }); return; }
        base.lo = r.lo; base.hi = r.hi; base.approx = r.approx;
        var f = fuzz(r); base.flo = f.lo; base.fhi = f.hi;
        out.cards.push(base);
      });
    });
    return out;
  }
  /* the banks: data-sabhyata.js's eras, with their own names and dates */
  function banks() {
    var S = W.IND_SABHYATA, out = [];
    if (!S || !S.eras) return out;
    S.eras.forEach(function (e) {
      var d = String(e.dates || ''), r;
      if (/today|now/i.test(d)) { r = parseWhen(d.replace(/[–-]\s*(today|now)/i, '')); if (r) r = { lo: r.lo, hi: NOW }; }
      else r = parseWhen(d);
      if (r) out.push({ id: e.id, name: e.name, dates: d, lo: r.lo, hi: r.hi });
    });
    return out;
  }
  function overlaps(c, b) { return c.flo <= b.hi && c.fhi >= b.lo; }
  /* strictly before, with no overlap even after the "about" widening */
  function before(a, b) { return a.fhi < b.flo; }
  function clearOf(list, c) { for (var i = 0; i < list.length; i++) if (!(before(list[i], c) || before(c, list[i]))) return false; return true; }
  function pickApart(cards, n, tries) {
    for (var t = 0; t < (tries || 60); t++) {
      var bag = shuffle(cards), got = [];
      for (var i = 0; i < bag.length && got.length < n; i++) if (clearOf(got, bag[i])) got.push(bag[i]);
      if (got.length === n) return got.sort(function (a, b) { return a.lo - b.lo; });
    }
    return null;
  }
  function whenLine(c) { return c.when; }
  function srcLine(c) { return c.sources && c.sources.length ? c.sources[0] : ''; }

  /* ============================================================ THE ENGINE */
  var LEVELS = ['Pehle–Baad: which came first?', 'Teen ki Kadi: order three', 'Nadi par: place five on the river',
    'Kaise pata? How do we know?', 'Kadi todo: find the one out of order'];
  var MODES = ['pehle', 'kadi', 'nadi', 'kaise', 'todo'];
  var ROUND = [6, 5, 5, 6, 4];

  function engine(host, opts, done) {
    injectCSS();
    opts = opts || {};
    var level = Math.max(1, Math.min(5, parseInt(opts.level, 10) || 1));
    var scope = opts.scope || null;
    if (scope && scope.mode) { var mi = MODES.indexOf(scope.mode); if (mi >= 0) level = mi + 1; else if (+scope.mode >= 1 && +scope.mode <= 5) level = +scope.mode; }
    var report = typeof opts.answer === 'function' ? opts.answer : function () {};
    var calm = !!(opts.calm || opts.reduced);
    var dead = false, finished = false, asked = 0, ftr = 0, items = [], k = 0, state = null, offs = [], rafs = [];
    var ST = host.__knState = { level: level, phase: 'start', item: null };

    function on(t, ev, fn, o) { t.addEventListener(ev, fn, o || false); offs.push(function () { t.removeEventListener(ev, fn, o || false); }); }
    /* a pause that stops while the page is hidden (docs/32: one clock) */
    function wait(ms, fn) {
      var acc = 0, last = null;
      function step(t) {
        if (dead) return;
        if (D.hidden) { last = null; rafs.push(W.requestAnimationFrame(step)); return; }
        if (last != null) acc += Math.min(100, t - last);
        last = t;
        if (acc >= ms) { fn(); return; }
        rafs.push(W.requestAnimationFrame(step));
      }
      rafs.push(W.requestAnimationFrame(step));
    }

    host.innerHTML = '<div class="kn' + (calm ? ' calm' : '') + '" data-level="' + level + '">' + riverSVG() +
      '<div class="kn-head"><span class="kn-badge" title="Itihaas — what evidence shows">📜 Itihaas</span>' +
      '<h2 class="kn-mode">' + esc(LEVELS[level - 1]) + '</h2><span class="kn-step" aria-live="polite"></span></div>' +
      '<div class="kn-board"></div></div>';
    var root = host.querySelector('.kn'), board = root.querySelector('.kn-board'), stepEl = root.querySelector('.kn-step');

    /* REVIEW GATE: the card set opens only in tester mode until the reviewer signs (docs/05 §6) —
       or the owner opens it before review (REG.open, 9 Oct 2026), as now */
    if (REG.review && !(REG.open && REG.open.by) && !tester() && !opts.preview) {
      board.innerHTML = '<div class="kn-wait" role="status"><h3 class="kn-mode">The River of Time is with its reviewer</h3>' +
        '<p class="kn-hint" style="font-size:15px">Every card here comes from the app\'s history pages, and a historian has to ' +
        'check the whole set before it opens. It will be here soon.</p>' +
        '<div class="kn-act"><button class="kn-btn" data-kn="leave">Back</button></div></div>';
      on(board, 'click', function (e) { if (e.target.closest('[data-kn="leave"]')) finish(); });
      return teardown;
    }

    var SET = cardSet(), BANKS = banks();
    if (scope && scope.set && scope.set.length) {
      var want = {}; scope.set.forEach(function (x) { want[x] = 1; });
      SET.cards = SET.cards.filter(function (c) { return want[c.id] || want[c.era]; });
    }
    items = build(level);
    if (!items.length) {
      board.innerHTML = '<div class="kn-wait" role="status"><h3 class="kn-mode">Not enough cards for this level yet</h3>' +
        '<p class="kn-hint" style="font-size:15px">The history pages have not loaded, or this chapter has too few dated cards.</p>' +
        '<div class="kn-act"><button class="kn-btn" data-kn="leave">Back</button></div></div>';
      on(board, 'click', function (e) { if (e.target.closest('[data-kn="leave"]')) finish(); });
      return teardown;
    }

    function build(L) {
      var out = [], i, n = ROUND[L - 1], c = SET.cards;
      if (L === 1) for (i = 0; i < n; i++) { var p = pickApart(c, 2); if (p) out.push({ kind: 'pair', cards: shuffle(p), order: p }); }
      if (L === 2) for (i = 0; i < n; i++) { var q = pickApart(c, 3); if (q) out.push({ kind: 'order', cards: deranged(q), order: q }); }
      if (L === 3) {
        var bag = shuffle(c.filter(function (x) { return BANKS.some(function (b) { return overlaps(x, b); }); }));
        for (i = 0; i < Math.min(n, bag.length); i++) out.push({ kind: 'bank', card: bag[i] });
      }
      if (L === 4) {
        var eras = (W.IND_ITIHAAS && W.IND_ITIHAAS.eras || []).filter(function (e) { return !eraOut(e) && e.sources && e.sources.length; });
        if (scope && scope.set && scope.set.length) eras = eras.filter(function (e) { return scope.set.indexOf(e.id) >= 0 || SET.cards.some(function (x) { return x.era === e.id; }); });
        eras = shuffle(eras).slice(0, n);
        eras.forEach(function (e) {
          var right = e.sources[Math.floor(Math.random() * e.sources.length)];
          var others = [];
          (W.IND_ITIHAAS.eras || []).forEach(function (o) {
            if (o.id === e.id || eraOut(o)) return;
            (o.sources || []).forEach(function (s) { if (e.sources.indexOf(s) < 0 && others.indexOf(s) < 0) others.push(s); });
          });
          var opts3 = shuffle([right].concat(shuffle(others).slice(0, 2)));
          out.push({ kind: 'evidence', era: e, options: opts3, answer: opts3.indexOf(right) });
        });
      }
      if (L === 5) for (i = 0; i < n; i++) { var r = rowOutOfOrder(c); if (r) out.push(r); }
      return out;
    }
    function deranged(sorted) {
      for (var t = 0; t < 20; t++) { var s = shuffle(sorted); if (s.some(function (x, i) { return x !== sorted[i]; })) return s; }
      return sorted.slice().reverse();
    }
    /* a row in time order with ONE card moved two or more places: exactly one card can be
       lifted out to leave the rest in order, so the question has one answer */
    function rowOutOfOrder(c) {
      for (var t = 0; t < 40; t++) {
        var s = pickApart(c, 4); if (!s) return null;
        var from = Math.floor(Math.random() * 4), to = Math.floor(Math.random() * 4);
        if (Math.abs(from - to) < 2) continue;
        var row = s.slice(), mv = row.splice(from, 1)[0]; row.splice(to, 0, mv);
        var fixes = 0;
        for (var i = 0; i < row.length; i++) { var rest = row.filter(function (_, j) { return j !== i; }); if (rest.every(function (x, j) { return j === 0 || before(rest[j - 1], x); })) fixes++; }
        if (fixes === 1) return { kind: 'odd', row: row, odd: mv, order: s };
      }
      return null;
    }

    /* ----------------------------------------------------------- reporting */
    function judge(item, id, right, skill) {
      if (item.reported) return;
      item.reported = true; asked++; if (right) ftr++;
      try { report({ id: id, right: !!right, firstTry: true, skill: skill, objective: null }); } catch (e) {}
    }
    function finish() {
      if (finished) return;
      finished = true;
      var ratio = asked ? ftr / asked : 0;
      var next = !asked ? level : ratio >= 0.8 ? Math.min(5, level + 1) : ratio >= 0.5 ? level : Math.max(1, level - 1);
      ST.phase = 'done';
      cleanup();
      if (typeof done === 'function') done({ win: asked > 0 && ratio >= 0.5, score: ftr, asked: asked, firstTryRight: ftr, level: level, levelNext: next });
    }
    function advance() { k++; if (k >= items.length) finish(); else show(); }
    function rightBeat(line) {
      ST.phase = 'right';
      var act = board.querySelector('.kn-act');
      if (act) act.innerHTML = '';
      board.insertAdjacentHTML('beforeend', '<p class="kn-ok" role="status">Sahi! <span>' + line + '</span></p>');
      wait(calm ? 1400 : 1100, advance);
    }
    /* THE MISS CARD (docs/32): holds — nothing new renders until Aage */
    function miss(ans, teach) {
      ST.phase = 'miss';
      var act = board.querySelector('.kn-act');
      if (act) act.innerHTML = '';
      board.insertAdjacentHTML('beforeend', '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">' + ans + '</span>' +
        '<p class="gm-teach">' + teach + '</p><button class="btn gm-aage" data-gm="aage">Aage →</button></div>');
      var mc = board.querySelector('.gm-miss'); if (mc && mc.scrollIntoView) { try { mc.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch (e) {} }
      focusSoft(board.querySelector('.gm-aage'));
    }
    function cardHTML(c, extra, showWhen) {
      return '<button type="button" class="kn-card" data-id="' + esc(c.id) + '"' + (extra || '') + '>' +
        '<span class="kn-cb">📜 ' + esc(c.eraTitle) + '</span>' +
        '<span class="kn-what">' + esc(c.what) + '</span>' +
        (showWhen ? '<span class="kn-when">' + esc(whenLine(c)) + '</span>' : '') + '</button>';
    }
    function revealWhens() {
      [].forEach.call(board.querySelectorAll('.kn-card[data-id]'), function (el) {
        var c = byId(el.getAttribute('data-id'));
        if (c && !el.querySelector('.kn-when')) el.insertAdjacentHTML('beforeend', '<span class="kn-when">' + esc(whenLine(c)) + '</span>');
      });
    }
    function byId(id) { for (var i = 0; i < SET.cards.length; i++) if (SET.cards[i].id === id) return SET.cards[i]; for (var j = 0; j < SET.arguing.length; j++) if (SET.arguing[j].id === id) return SET.arguing[j]; return null; }
    function flowHTML() { return '<div class="kn-flow" aria-hidden="true"><i></i>earlier · the river flows · later<i></i></div>'; }

    /* ----------------------------------------------------------------- show */
    function show() {
      if (dead) return;
      var it = items[k]; state = { item: it, sel: [] };
      ST.phase = 'ask'; ST.item = it;
      stepEl.textContent = 'Card ' + (k + 1) + ' of ' + items.length;
      if (it.kind === 'pair') {
        board.innerHTML = '<p class="kn-q">Which came first?</p>' + flowHTML() +
          '<div class="kn-pair" role="group" aria-label="Two cards">' + it.cards.map(function (c, i) { return cardHTML(c, ' data-pick="' + i + '" aria-keyshortcuts="' + (i + 1) + '"'); }).join('') + '</div>' +
          '<p class="kn-hint">Tap the one that happened first — or press 1 or 2.</p>';
      } else if (it.kind === 'order') {
        state.order = it.cards.slice();
        board.innerHTML = '<p class="kn-q">Put these in order, the earliest first.</p>' + flowHTML() +
          '<div class="kn-row" style="--n:3" role="list" aria-label="Cards, earliest on the left"></div>' +
          '<div class="kn-act"><button class="kn-btn" data-kn="lock">Lock karo</button></div>' +
          '<p class="kn-hint">Drag a card onto another to swap them, or tap two cards. Keys: Space picks a card up, arrows move it, Space puts it down.</p>';
        paintRow();
      } else if (it.kind === 'bank') {
        var arg = SET.arguing.length ? SET.arguing[k % SET.arguing.length] : null;
        board.innerHTML = '<p class="kn-q">Where on the river does this belong?</p>' +
          '<div class="kn-now">' + cardHTML(it.card, ' data-drag="1"') + '</div>' + flowHTML() + nadiHTML() +
          (arg ? '<div class="kn-lane" data-arguing="' + esc(arg.id) + '"><b>Historians are still arguing · no right or wrong here</b>' +
            esc(arg.what) + ' <i>(' + esc(arg.when) + ')</i></div>' : '') +
          '<p class="kn-hint">Drag the card onto a bank, or tap a bank. Keys: arrows move along the river, Enter places.</p>';
      } else if (it.kind === 'evidence') {
        var e = it.era;
        board.innerHTML = '<div class="kn-era"><span class="kn-badge">📜 ' + esc(e.when) + '</span><h3>' + esc(e.title) + '</h3><p>' + esc(e.hook) + '</p></div>' +
          '<p class="kn-q">How do we know? Pick the evidence that tells us about this age.</p>' +
          '<div class="kn-opts" role="group">' + it.options.map(function (o, i) {
            return '<button type="button" class="kn-opt" data-opt="' + i + '"><span class="kn-n">' + (i + 1) + '</span><span>' + esc(o) + '</span></button>';
          }).join('') + '</div><p class="kn-hint">Tap one — or press 1, 2 or 3.</p>';
      } else if (it.kind === 'odd') {
        board.innerHTML = '<p class="kn-q">These should run earliest to latest. One card is in the wrong place — which?</p>' + flowHTML() +
          '<div class="kn-row" style="--n:4">' + it.row.map(function (c, i) { return cardHTML(c, ' data-pick="' + i + '"'); }).join('') + '</div>' +
          '<p class="kn-hint">Tap the card that is out of order — or press 1 to 4.</p>';
      }
      focusSoft(board.querySelector('.kn-card[data-pick], .kn-row .kn-card, .kn-bank, .kn-opt'));
    }

    /* ---------------------------------------------------------- L2 ordering */
    function paintRow() {
      var row = board.querySelector('.kn-row');
      row.innerHTML = state.order.map(function (c, i) {
        return cardHTML(c, ' role="listitem" data-slot="' + i + '"' + (state.held === i ? ' aria-grabbed="true"' : ''));
      }).join('');
      [].forEach.call(row.children, function (el, i) { if (state.held === i) el.classList.add('lift'); if (state.sel[0] === i) el.classList.add('sel'); });
    }
    function swap(a, b) {
      if (a === b || a == null || b == null) return;
      var o = state.order, t = o[a]; o[a] = o[b]; o[b] = t; tap();
    }
    function lockOrder() {
      var it = state.item, ok = state.order.every(function (c, i) { return c === it.order[i]; });
      judge(it, 'kn2:' + it.order.map(function (c) { return c.id; }).join('>'), ok, 'kaalnadi.order');
      board.querySelector('.kn-row').innerHTML = (ok ? state.order : it.order).map(function (c) { return cardHTML(c, ' disabled', true); }).join('');
      [].forEach.call(board.querySelectorAll('.kn-row .kn-card'), function (el) { el.classList.add(ok ? 'ok' : 'no'); });
      if (ok) rightBeat('Earliest to latest — and each card says how we know.');
      else miss('The river runs: ' + it.order.map(function (c) { return esc(c.what.split(/[—.]/)[0]) + ' (' + esc(c.when) + ')'; }).join(' → ') + '.',
        'How we know: ' + it.order.map(function (c) { return esc(srcLine(c)); }).join(' · ') + '.');
    }

    /* ------------------------------------------------------------ L3 banks */
    function nadiHTML() {
      var n = BANKS.length;
      return '<div class="kn-nadi" style="--nb2:' + (n + 1) + '" role="group" aria-label="The river of time, earliest first">' +
        '<div class="kn-stream" aria-hidden="true"></div>' +
        BANKS.map(function (b, i) {
          return '<button type="button" class="kn-bank ' + (i % 2 ? 'bot' : 'top') + '" style="--c:' + (i + 1) + '" data-bank="' + i + '">' +
            '<span>' + esc(b.name) + '</span><small>' + esc(b.dates) + '</small><span class="kn-pin" aria-hidden="true"></span></button>';
        }).join('') + '</div>';
    }
    function placeOn(bi) {
      var it = state.item, b = BANKS[bi]; if (!b || it.reported) return;
      var ok = overlaps(it.card, b);
      judge(it, 'kn3:' + it.card.id, ok, 'kaalnadi.era');
      var bankEls = board.querySelectorAll('.kn-bank');
      BANKS.forEach(function (bb, i) { if (overlaps(it.card, bb)) bankEls[i].classList.add('right'); });
      var pin = bankEls[bi] && bankEls[bi].querySelector('.kn-pin'); if (pin) pin.innerHTML = '<b></b>';
      var cardEl = board.querySelector('.kn-now .kn-card'); if (cardEl) { cardEl.disabled = true; cardEl.classList.add(ok ? 'ok' : 'no'); }
      revealWhens();
      var rightBanks = BANKS.filter(function (bb) { return overlaps(it.card, bb); }).map(function (bb) { return esc(bb.name) + ' (' + esc(bb.dates) + ')'; });
      if (ok) rightBeat(esc(it.card.when) + ' — ' + esc(b.name) + '. How we know: ' + esc(srcLine(it.card)) + '.');
      else miss('It happened ' + esc(it.card.when) + ' — on the bank of ' + rightBanks.join(' or ') + '.',
        'How we know: ' + esc(it.card.sources.join(' · ')) + '.');
    }

    /* ---------------------------------------------------------------- picks */
    function pick(i) {
      var it = state && state.item; if (!it || it.reported || ST.phase !== 'ask') return;
      if (it.kind === 'pair') {
        var c = it.cards[i]; if (!c) return;
        var ok = c === it.order[0];
        judge(it, 'kn1:' + it.order.map(function (x) { return x.id; }).join('<'), ok, 'kaalnadi.before');
        revealWhens();
        [].forEach.call(board.querySelectorAll('.kn-card'), function (el) { el.disabled = true; if (el.getAttribute('data-id') === it.order[0].id) el.classList.add('ok'); else if (!ok && +el.getAttribute('data-pick') === i) el.classList.add('no'); });
        if (ok) rightBeat(esc(it.order[0].when) + ' comes before ' + esc(it.order[1].when) + '.');
        else miss('First came: ' + esc(it.order[0].what) + ' (' + esc(it.order[0].when) + ').',
          'Then, ' + esc(it.order[1].when) + ': ' + esc(it.order[1].what) + ' How we know: ' + esc(srcLine(it.order[0])) + '.');
      } else if (it.kind === 'evidence') {
        if (i < 0 || i >= it.options.length) return;
        var ok2 = i === it.answer;
        judge(it, 'kn4:' + it.era.id + ':' + it.options[it.answer], ok2, 'kaalnadi.evidence');
        [].forEach.call(board.querySelectorAll('.kn-opt'), function (el, j) { el.disabled = true; if (j === it.answer) el.classList.add('ok'); });
        if (ok2) rightBeat('That is one of the ways we know about ' + esc(it.era.title) + '.');
        else miss('This one tells us: ' + esc(it.options[it.answer]) + '.', 'Everything we know about ' + esc(it.era.title) + ' comes from: ' + esc(it.era.sources.join(' · ')) + '.');
      } else if (it.kind === 'odd') {
        var c2 = it.row[i]; if (!c2) return;
        var ok3 = c2 === it.odd;
        judge(it, 'kn5:' + it.row.map(function (x) { return x.id; }).join(','), ok3, 'kaalnadi.order');
        revealWhens();
        [].forEach.call(board.querySelectorAll('.kn-card'), function (el) { el.disabled = true; if (el.getAttribute('data-id') === it.odd.id) el.classList.add(ok3 ? 'ok' : 'no'); });
        if (ok3) rightBeat(esc(it.odd.when) + ' — it belongs elsewhere on the river.');
        else miss('The card out of place is: ' + esc(it.odd.what) + ' (' + esc(it.odd.when) + ').',
          'In order: ' + it.order.map(function (c) { return esc(c.when); }).join(' → ') + '. How we know: ' + esc(srcLine(it.odd)) + '.');
      }
    }

    /* ----------------------------------------------------------- controls */
    function onClick(e) {
      var t = e.target;
      if (t.closest('[data-gm="aage"]')) { if (ST.phase === 'miss') advance(); return; }
      if (t.closest('[data-kn="leave"]')) { finish(); return; }
      if (dragMoved) { dragMoved = false; return; }
      var it = state && state.item; if (!it) return;
      var pk = t.closest('[data-pick]'); if (pk && (it.kind === 'pair' || it.kind === 'odd')) { pick(+pk.getAttribute('data-pick')); return; }
      var op = t.closest('[data-opt]'); if (op) { pick(+op.getAttribute('data-opt')); return; }
      var bk = t.closest('[data-bank]'); if (bk && it.kind === 'bank') { placeOn(+bk.getAttribute('data-bank')); return; }
      if (it.kind === 'order' && ST.phase === 'ask') {
        if (t.closest('[data-kn="lock"]')) { lockOrder(); return; }
        var sl = t.closest('[data-slot]');
        if (sl) {
          var i = +sl.getAttribute('data-slot');
          if (state.sel.length && state.sel[0] !== i) { swap(state.sel[0], i); state.sel = []; }
          else if (state.sel[0] === i) state.sel = [];
          else { state.sel = [i]; tap(); }
          paintRow(); focusSoft(board.querySelectorAll('.kn-row .kn-card')[i]);
        }
      }
    }
    /* drag: a card onto a bank (L3) or onto another card (L2). A tap stays a tap. */
    var drag = null, dragMoved = false;
    function onDown(e) {
      if (ST.phase !== 'ask' || !state) return;
      var it = state.item, el = null;
      if (it.kind === 'bank') el = e.target.closest('.kn-now .kn-card');
      else if (it.kind === 'order') el = e.target.closest('[data-slot]');
      if (!el) return;
      drag = { el: el, x: e.clientX, y: e.clientY, ghost: null, slot: el.getAttribute('data-slot') };
      dragMoved = false;
    }
    function onMove(e) {
      if (!drag) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.ghost && Math.abs(dx) + Math.abs(dy) > 8) {
        drag.ghost = drag.el.cloneNode(true); drag.ghost.classList.add('kn-drag');
        var r = drag.el.getBoundingClientRect(); drag.ox = drag.x - r.left; drag.oy = drag.y - r.top;
        drag.ghost.style.width = r.width + 'px'; D.body.appendChild(drag.ghost); drag.el.classList.add('ghost');
      }
      if (drag.ghost) {
        e.preventDefault();
        drag.ghost.style.left = (e.clientX - drag.ox) + 'px'; drag.ghost.style.top = (e.clientY - drag.oy) + 'px';
        [].forEach.call(board.querySelectorAll('.kn-bank.hot,.kn-row .kn-card.sel'), function (x) { x.classList.remove('hot', 'sel'); });
        var over = targetAt(e.clientX, e.clientY);
        if (over) over.classList.add(over.classList.contains('kn-bank') ? 'hot' : 'sel');
      }
    }
    function targetAt(x, y) {
      var under = D.elementFromPoint(x, y); if (!under) return null;
      return under.closest('.kn-bank') || under.closest('.kn-row [data-slot]');
    }
    function onUp(e) {
      if (!drag) return;
      var d = drag; drag = null;
      if (!d.ghost) return;
      dragMoved = true;
      d.ghost.remove(); d.el.classList.remove('ghost');
      var over = targetAt(e.clientX, e.clientY);
      if (over && over.hasAttribute('data-bank')) placeOn(+over.getAttribute('data-bank'));
      else if (over && over.hasAttribute('data-slot') && d.slot != null) { swap(+d.slot, +over.getAttribute('data-slot')); state.sel = []; paintRow(); }
      else if (state.item.kind === 'order') paintRow();
      W.setTimeout(function () { dragMoved = false; }, 0);
    }
    function onKey(e) {
      if (dead) return;
      if (!host.isConnected) { teardown(); return; }
      var key = e.key, it = state && state.item;
      if (ST.phase === 'miss') { if (key === 'Enter' || key === ' ') { e.preventDefault(); advance(); } return; }
      if (ST.phase !== 'ask' || !it) return;
      if (/^[1-4]$/.test(key) && (it.kind === 'pair' || it.kind === 'odd' || it.kind === 'evidence')) { e.preventDefault(); pick(+key - 1); return; }
      var foc = D.activeElement;
      if (it.kind === 'bank') {
        var bs = [].slice.call(board.querySelectorAll('.kn-bank')), at = bs.indexOf(foc);
        if (/Arrow(Right|Down)/.test(key)) { e.preventDefault(); focusSoft(bs[at < 0 ? 0 : Math.min(bs.length - 1, at + 1)]); return; }
        if (/Arrow(Left|Up)/.test(key)) { e.preventDefault(); focusSoft(bs[at < 0 ? 0 : Math.max(0, at - 1)]); return; }
        if (key === 'Enter' && at < 0) { e.preventDefault(); focusSoft(bs[0]); }
        return;
      }
      if (it.kind === 'order') {
        var cs = [].slice.call(board.querySelectorAll('.kn-row .kn-card')), ci = cs.indexOf(foc);
        if (key === ' ' && ci >= 0) { e.preventDefault(); state.held = state.held === ci ? null : ci; tap(); paintRow(); focusSoft(board.querySelectorAll('.kn-row .kn-card')[ci]); return; }
        if (/Arrow(Right|Left|Up|Down)/.test(key) && ci >= 0) {
          e.preventDefault();
          var to = Math.max(0, Math.min(cs.length - 1, ci + (/Right|Down/.test(key) ? 1 : -1)));
          if (state.held === ci) { swap(ci, to); state.held = to; paintRow(); }
          focusSoft(board.querySelectorAll('.kn-row .kn-card')[to]); return;
        }
        if (key === 'Enter' && ci >= 0) { e.preventDefault(); lockOrder(); }
        return;
      }
      if (/Arrow/.test(key)) {
        var all = [].slice.call(board.querySelectorAll('.kn-card[data-pick],.kn-opt')), ai = all.indexOf(foc);
        e.preventDefault(); focusSoft(all[ai < 0 ? 0 : (ai + (/Right|Down/.test(key) ? 1 : -1) + all.length) % all.length]);
      }
    }
    on(root, 'click', onClick);
    on(root, 'pointerdown', onDown);
    on(W, 'pointermove', onMove, { passive: false });
    on(W, 'pointerup', onUp);
    on(D, 'keydown', onKey);
    show();

    function cleanup() {
      dead = true;
      offs.forEach(function (f) { try { f(); } catch (e) {} }); offs = [];
      rafs.forEach(function (id) { try { W.cancelAnimationFrame(id); } catch (e) {} });
      var g = D.querySelector('.kn-drag'); if (g) g.remove();
    }
    function teardown() { finished = true; cleanup(); }
    teardown.destroy = teardown;
    return teardown;
  }

  /* the river under every level: flows left to right on a desk, top to bottom on a phone */
  function riverSVG() {
    return '<div class="kn-river" aria-hidden="true">' +
      '<svg class="h" viewBox="0 0 1000 600" preserveAspectRatio="none"><defs><linearGradient id="knw" x1="0" x2="1">' +
      '<stop offset="0" stop-color="var(--kn-water2)"/><stop offset=".5" stop-color="var(--kn-water)"/><stop offset="1" stop-color="var(--kn-water2)"/></linearGradient></defs>' +
      '<path d="M0 380 C 160 320, 300 460, 500 400 S 820 330, 1000 390 L1000 470 C 820 410, 680 520, 500 480 S 160 400, 0 460 Z" fill="url(#knw)" opacity=".55"/>' +
      '<path d="M0 420 C 180 370, 320 480, 500 440 S 820 380, 1000 430" fill="none" stroke="var(--kn-foam)" stroke-width="3"/></svg>' +
      '<svg class="v" viewBox="0 0 400 1000" preserveAspectRatio="none">' +
      '<path d="M170 0 C 230 160, 120 320, 200 500 S 160 820, 210 1000 L 260 1000 C 210 820, 250 640, 250 500 S 280 160, 230 0 Z" fill="var(--kn-water)" opacity=".5"/></svg></div>';
  }


  /* the data a round reads, loaded on demand when the host mounted this before its groups */
  function needs(groups, ready, eng) {
    var wrap = function (host, opts, done) {
      if (ready() || !W.IND_LOAD) return eng(host, opts, done);
      var td = null, gone = false;
      host.innerHTML = '<p role="status" style="text-align:center;padding:40px 0;color:var(--muted)">Opening…</p>';
      var go = function () { if (!gone && host.isConnected) td = eng(host, opts, done); };
      W.IND_LOAD(groups).then(go, go);
      var t = function () { gone = true; if (typeof td === 'function') td(); };
      t.destroy = t;
      return t;
    };
    return wrap;
  }

  var REG = {
    id: 'kaalnadi', name: 'Kaal Nadi', sub: 'put history in order on the River of Time',
    blurb: 'Cards from the app\'s history pages — set them in order, place them on the river, and say how we know.',
    icon: 'map', minutes: 4, tag: 'Itihaas', c: '#1f6f9f', c2: '#3aa0a0',
    teaches: true, review: true,
    /* OPENED BY THE OWNER BEFORE REVIEW: still review: true (nobody has signed), open to every child;
       the host says so on the game's page */
    open: { to: 'everyone', by: 'owner', on: '2026-10-09', who: 'a historian',
      why: 'Owner, 9 Oct 2026: \u201copen them all to everyone now, like the gita\u201d \u2014 the publisher\u2019s decision, never a reviewer\u2019s sign-off.' },
    levels: ['which came first', 'order three', 'on the river', 'how do we know', 'find the one out of order'],
    engine: needs(['content', 'games'], function () { return !!(W.IND_ITIHAAS && W.IND_SABHYATA); }, engine)
  };
  /* the check reads the card set the engine reads — one implementation */
  REG.engine.cardSet = cardSet; REG.engine.banks = banks; REG.engine.parseWhen = parseWhen; REG.engine.overlaps = overlaps;
  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push(REG);
})();
