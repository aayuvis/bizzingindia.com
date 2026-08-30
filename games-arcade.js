/* Bizzing India — THE MELA, arcade shelf: the board games.

   Two boards, both Indian by birth, and both say so on their intro card:

     saapsidi · Saap-Sidi — began centuries ago as Gyan Chaupar / Moksha Patam,
                where every ladder was a virtue and every snake a slip. The
                English "Snakes and Ladders" is the export. Here the ladders
                get their old names back (Daya, Seva, Satya, Himmat, Vidya)
                and the snakes are gentle slips (Krodh, Jhooth, Lalach, Aalas,
                Ghamand) — a slide and a smile, never a lecture. Nothing
                religious beyond that: no moksha framing, this is for kids.

     ludo     · Ludo — Pachisi in a British suit. The cross-and-circle race
                is centuries older than the boxed export.

   Contract, identical to games.js and honoured exactly:
     entry = { id, name, blurb, icon, minutes, engine(host, opts, done) }
     engine fills host, calls done({win, score, kauris}) once, returns teardown.
   Extended cover contract for the arcade shelf: each entry also carries
     tag         — short chip ('Board' / 'Race')
     c, c2       — two hexes for the cover gradient
     scene       — a self-animating 48×48 SVG string; all motion lives inside
                   the SVG via inline animations whose @keyframes are in the
                   injected CSS below (arc- prefix), so the shelf needs nothing.

   THE 2026 REDESIGN. The first build of these two boards was rejected flat,
   and deservedly: half its CSS pointed at tokens that do not exist in
   tokens.css (--surface, --bg2), so cells painted transparent and the whole
   thing read as a spreadsheet. This version draws both boards as crafted
   objects:
     · Saap-Sidi is one warm painted board — cream-and-marigold checker in a
       terracotta frame, tapered patterned snakes with real heads, wooden
       ladders with perspective rails, a diya glowing on square 100, and the
       virtue/slip names lettered at each foot and head.
     · Ludo is the classic four-colour cross, drawn from the app's own tokens:
       two live quadrants (indigo and marigold), two greyed elegantly, star
       safe cells, a centre rosette, ringed avatar tokens.
     · Both boards MEASURE the viewport on mount and scale themselves so the
       whole board + die + player chips fit without page scroll, phones up.
     · The die is a real die — pips, a tumble — and the child's own buddy
       avatar rides in their token.

   House rules honoured throughout:
     · EVERY game plays fully with keyboard AND with touch/mouse, with no
       prior click needed (focus lands on the primary control on mount and a
       document-level Space/Enter catch-all backs it up).
     · prefers-reduced-motion is respected (walks jump, nothing pulses).
     · No lives, no shaming. Gattu rolls the same fair die you do.
     · Teardown removes every document/window listener and timer.

   Registers by PUSHING into window.IND_GAMES — this file loads after games.js
   and never redefines the array. Plain script, no modules, no build. */

(function () {
  'use strict';

  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document || null;
  /* games.js owns the registry; with no array there is nothing to join. */
  if (!W.IND_GAMES) return;

  /* ==================================================================
     STYLE — injected once, everything scoped under .arc-
     Only tokens that actually exist in tokens.css are referenced:
     --ground --card --card2 --line --line2 --text --text2 --muted
     --accent --accent-soft --accent2 --accent3 --good --mist
     --display --body --radius-* --space-* --shadow
     The Saap-Sidi board interior uses literal warm pigments on purpose:
     it is a painted wooden object and stays the same board in every world
     and at night, the way a real one on the shelf would.
     ================================================================== */

  var CSS = [
    '.arc-wrap{display:flex;flex-direction:column;gap:10px;color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    '.arc-top{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:34px}',
    '.arc-top b{display:block;font:800 18px/1.1 var(--display,Georgia,serif);letter-spacing:-.01em}',
    '.arc-kicker{display:block;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}',
    '.arc-leave{flex:none;cursor:pointer;border:1px solid var(--line2);background:var(--card);color:var(--text2);border-radius:999px;padding:7px 14px;font:700 13px var(--body,inherit)}',
    '.arc-leave:hover{border-color:var(--accent);color:var(--accent)}',
    '.arc-leave:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.arc-stage{position:relative}',

    /* the one calm status line — whose turn, what rolled, what next */
    '.arc-feed{min-height:40px;margin:0;display:flex;align-items:center;justify-content:center;text-align:center;font:600 14.5px/1.35 var(--body,inherit);color:var(--text2)}',
    '.arc-feed.good{color:var(--good)}',
    '.arc-feed.warm{color:var(--accent3)}',
    '.arc-hint{font-size:12.5px;color:var(--muted);text-align:center;margin:10px 0 0}',
    '.arc-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:12px}',
    '.arc-btn{cursor:pointer;min-height:46px;padding:11px 22px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:#fff;font:700 15px var(--body,inherit)}',
    '.arc-btn.ghost{background:var(--card);color:var(--text);border-color:var(--line2)}',
    '.arc-btn:hover:not(:disabled){filter:brightness(1.06)}',
    '.arc-btn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.arc-btn:disabled{opacity:.5;cursor:default}',

    /* intro & finish cards */
    '.arc-intro{text-align:center;max-width:520px;margin:0 auto}',
    '.arc-intro p{margin:0 0 8px;font-size:15px;line-height:1.6;color:var(--text)}',
    '.arc-intro .arc-heritage{color:var(--muted);font-size:14px;font-style:italic}',
    '.arc-art{display:flex;justify-content:center;margin:2px auto 10px}',
    '.arc-art img,.arc-art svg{display:block;width:92px;height:92px;border-radius:20px}',
    '.arc-done{text-align:center}',
    '.arc-done h3{font:800 24px var(--display,Georgia,serif);margin:6px 0 4px}',
    '.arc-done p{margin:0 0 4px;font-size:15.5px;line-height:1.55;color:var(--muted)}',
    '.arc-tally{display:inline-flex;gap:14px;flex-wrap:wrap;justify-content:center;margin:12px 0 2px}',
    '.arc-chip{background:var(--card2);border:1px solid var(--line);border-radius:999px;padding:7px 16px;font:700 14px var(--body,inherit)}',
    '.arc-chip b{color:var(--accent3);font-size:17px}',

    /* shared in-game bar: player chip · die · player chip */
    '.arc-bar{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:nowrap;margin:0 0 10px}',
    '.arc-pl{display:inline-flex;gap:8px;align-items:center;background:var(--card2);border:1.5px solid var(--line);border-radius:999px;padding:4px 13px 4px 5px;color:var(--text2);min-width:0}',
    '.arc-pl .face{flex:none;width:30px;height:30px;border-radius:50%;overflow:hidden;background:#fff;display:grid;place-items:center;font:800 14px var(--body,inherit);color:#fff}',
    '.arc-pl .face img{width:100%;height:100%;object-fit:cover;display:block}',
    '.arc-pl.you .face{box-shadow:0 0 0 2px var(--accent)}',
    '.arc-pl.you .face span{background:var(--accent)}',
    '.arc-pl.gattu .face{box-shadow:0 0 0 2px var(--accent2)}',
    '.arc-pl .tag{display:flex;flex-direction:column;min-width:0}',
    '.arc-pl [data-n]{font:700 11.5px/1.25 var(--body,inherit);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:11ch;color:var(--muted)}',
    '.arc-pl [data-t]{font:800 13.5px/1.25 var(--body,inherit);white-space:nowrap;color:var(--text2)}',
    '.arc-pl.now{border-color:var(--accent);background:var(--accent-soft)}',
    '.arc-pl.now [data-n],.arc-pl.now [data-t]{color:var(--text)}',
    '.arc-pl.gattu.now{border-color:var(--accent2)}',
    /* on short screens the title row bows out during play — the board is the title */
    '@media(max-height:760px){.arc-wrap.playing .arc-top{display:none}}',

    /* the die — a physical object: pips, bevel, tumble */
    '.arc-die{flex:none;position:relative;width:54px;height:54px;border-radius:14px;border:1px solid rgba(60,40,10,.22);cursor:pointer;padding:0;',
      'background:linear-gradient(148deg,#fffdf6 8%,#f4ecd8 60%,#e7dabd 100%);',
      'box-shadow:0 4px 10px rgba(30,20,70,.20),inset 0 2px 3px rgba(255,255,255,.9),inset 0 -4px 7px rgba(120,85,25,.18)}',
    '.arc-die:disabled{cursor:default;filter:saturate(.6);opacity:.72;box-shadow:0 2px 5px rgba(30,20,70,.14),inset 0 -3px 6px rgba(120,85,25,.12)}',
    '.arc-die:focus-visible{outline:3px solid var(--accent2);outline-offset:3px}',
    '.arc-die:not(:disabled):hover{filter:brightness(1.04)}',
    '.arc-die.ready:not(:disabled){animation:arc-nudge 1.6s ease-in-out infinite}',
    '.arc-die.roll{animation:arc-tumble .55s cubic-bezier(.35,.9,.4,1)}',
    '.arc-pip{position:absolute;width:19%;height:19%;border-radius:50%;transform:translate(-50%,-50%);',
      'background:radial-gradient(circle at 36% 32%,#4d3f6e 0%,#241a3f 70%);box-shadow:inset 0 1px 2px rgba(0,0,0,.55),0 1px 0 rgba(255,255,255,.5)}',
    '@keyframes arc-tumble{0%{transform:rotate(0) translateY(0) scale(1)}22%{transform:rotate(-16deg) translateY(-9px) scale(1.08)}',
      '52%{transform:rotate(11deg) translateY(2px) scale(.97)}78%{transform:rotate(-5deg) translateY(-2px)}100%{transform:rotate(0) translateY(0) scale(1)}}',
    '@keyframes arc-nudge{0%,100%{box-shadow:0 4px 10px rgba(30,20,70,.20),inset 0 2px 3px rgba(255,255,255,.9),inset 0 -4px 7px rgba(120,85,25,.18),0 0 0 0 var(--accent-soft)}',
      '50%{box-shadow:0 4px 10px rgba(30,20,70,.20),inset 0 2px 3px rgba(255,255,255,.9),inset 0 -4px 7px rgba(120,85,25,.18),0 0 0 7px var(--accent-soft)}}',

    /* -------- Saap-Sidi board -------- */
    '.arc-sswrap{position:relative;width:100%;max-width:480px;margin:0 auto;border-radius:12px;box-shadow:var(--shadow-lg,0 12px 40px rgba(30,20,70,.12))}',
    '.arc-sswrap svg{display:block;width:100%;height:auto;border-radius:12px}',
    '.arc-ssnum{font:700 3px var(--body,sans-serif);fill:#96702f;user-select:none}',
    '.arc-ssnum.hot{fill:#7c4a1d}',
    '.arc-sslabel{font:800 2.5px var(--body,sans-serif);user-select:none}',

    /* tokens: ringed avatar discs riding above the painted board */
    '.arc-tok{position:absolute;width:8.6%;aspect-ratio:1/1;transform:translate(-50%,-56%);pointer-events:none;',
      'transition:left .13s linear,top .13s linear}',
    '.arc-tok.you{z-index:5}.arc-tok.gattu{z-index:4}',
    '.arc-tokface{width:100%;height:100%;border-radius:50%;overflow:hidden;background:#fff;display:grid;place-items:center;',
      'font:800 13px var(--body,inherit);color:#fff;',
      'box-shadow:0 0 0 2px #fff,0 3px 7px rgba(40,20,5,.4)}',
    '.arc-tok.you .arc-tokface{border:2.5px solid var(--accent)}',
    '.arc-tok.gattu .arc-tokface{border:2.5px solid var(--accent2)}',
    '.arc-tokface img{width:100%;height:100%;object-fit:cover;display:block}',
    '.arc-tokface span{width:100%;height:100%;display:grid;place-items:center}',
    '.arc-tok.you .arc-tokface span{background:var(--accent)}',
    '.arc-tok.gattu .arc-tokface span{background:var(--accent2)}',

    /* the moment banner: a virtue lifts / a slip slides — said plainly */
    '.arc-toast{position:absolute;left:50%;bottom:5%;transform:translate(-50%,10px);opacity:0;z-index:6;pointer-events:none;',
      'transition:opacity .28s ease,transform .28s ease;background:rgba(43,26,11,.93);color:#ffe9c2;',
      'border:1px solid rgba(230,185,92,.55);border-radius:12px;padding:7px 15px;max-width:92%;',
      'font:600 12.5px/1.45 var(--body,inherit);text-align:center}',
    '.arc-toast b{display:block;font-weight:800;font-size:12.5px;letter-spacing:.05em}',
    '.arc-toast.lad b{color:#9fe6b7}',
    '.arc-toast.snk b{color:#ffb89b}',
    '.arc-toast.show{opacity:1;transform:translate(-50%,0)}',

    /* -------- Ludo board -------- */
    '.arc-lwrap{width:100%;max-width:480px;margin:0 auto}',
    '.arc-lsvg{display:block;width:100%;height:auto}',
    '.arc-ltok{transition:transform .16s linear}',
    '.arc-ltok.ride{transition:transform .75s cubic-bezier(.4,0,.25,1)}',
    '.arc-ltok .hit{pointer-events:all}',
    '.arc-ltok .halo{fill:none;stroke:var(--accent3);stroke-width:.1;opacity:0}',
    '.arc-ltok.live{cursor:pointer}',
    '.arc-ltok.live .halo{opacity:.75;animation:arc-halo 1s ease-in-out infinite alternate}',
    '.arc-ltok.sel .halo{opacity:1;stroke-width:.16;animation:none}',
    '@keyframes arc-halo{from{stroke-opacity:.35}to{stroke-opacity:1}}',

    /* -------- cover-scene keyframes (the shelf injects the SVG strings;
       the motion is defined here so the covers animate anywhere) -------- */
    '@keyframes arc-pulse{from{opacity:.35}to{opacity:.95}}',
    '@keyframes arc-climb{0%{transform:translate(0,0) rotate(0deg);opacity:0}12%{opacity:1}',
    '50%{transform:translate(5px,-13px) rotate(180deg)}88%{opacity:1}100%{transform:translate(10px,-26px) rotate(360deg);opacity:0}}',
    '@keyframes arc-sway{from{transform:translateX(-1.4px)}to{transform:translateX(1.4px)}}',
    '@keyframes arc-hop{0%{transform:translate(0,0);opacity:0}10%{transform:translate(0,0);opacity:1}',
    '25%{transform:translate(9px,-5px)}40%{transform:translate(18px,0)}60%{transform:translate(27px,-5px)}',
    '80%{transform:translate(36px,0);opacity:1}100%{transform:translate(36px,0);opacity:0}}',
    '@keyframes arc-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',

    '@media(prefers-reduced-motion:reduce){.arc-wrap *,.arc-wrap *:before,.arc-wrap *:after{animation:none!important;transition:none!important}',
    '.arc-anim{animation:none!important}}'
  ].join('');

  var cssDone = false;
  function injectCSS() {
    if (cssDone || !D) return;
    cssDone = true;
    if (D.getElementById('arc-css')) return;
    var s = D.createElement('style');
    s.id = 'arc-css';
    s.appendChild(D.createTextNode(CSS));
    (D.head || D.documentElement).appendChild(s);
  }

  /* ==================================================================
     SMALL HELPERS — same shapes as games.js; duplicated because that
     file exports engines, not utilities, and a cross-file dependency on
     its internals would rot silently.
     ================================================================== */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function one(a) { return a[Math.floor(Math.random() * a.length)]; }
  function reducedMotion() {
    try { return !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }
  function focusSoft(el) {
    if (!el || !el.focus) return;
    try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (e2) {} }
  }
  function rollDie() { return 1 + Math.floor(Math.random() * 6); }
  function r2(n) { return Math.round(n * 100) / 100; }

  /* The child's profile lives at window.BI.S — but games must not assume the
     shell exists (a bare host is a legal way to mount an engine). */
  function profile() {
    try { return (W.BI && W.BI.S) || {}; } catch (e) { return {}; }
  }
  function playerName() {
    var n = profile().name;
    return (typeof n === 'string' && n.trim()) ? n.trim() : 'You';
  }
  function artSrc(id) {
    try { return (W.IND_ART_SRC && W.IND_ART_SRC(id)) || ''; } catch (e) { return ''; }
  }
  /* The child's chosen buddy, and THE PIECE RULE (docs/05, the companion
     framework): a fictional tales-shelf character may BE the token in a
     child's hands — the tortoise races, the jackal jumps. A sacred figure or
     a real person stays AT the child's side: their face appears in the
     player chip (a companion, a witness), but the token on the board is the
     child's own — never Ganesha down a snake. */
  function buddySrc() { return artSrc(profile().buddy || 'ganesha'); }
  function buddyTier() {
    try {
      return (W.IND_BUDDY_TIER && W.IND_BUDDY_TIER(profile().buddy || 'ganesha')) || 'tales';
    } catch (e) { return 'tales'; }
  }
  function pieceSrc() { return buddyTier() === 'tales' ? buddySrc() : ''; }
  function gattuSrc() { return artSrc('gattu'); }
  function gattuHTML(size) {
    var src = gattuSrc();
    if (src) return '<img src="' + esc(src) + '" width="' + (size || 92) + '" height="' + (size || 92) + '" alt="">';
    if (W.GATTU) {
      var g = W.GATTU('happy');
      if (g) return g.replace('<svg ', '<svg width="' + (size || 92) + '" height="' + (size || 92) + '" ');
    }
    return '';
  }
  /* Small round face for chips and tokens; falls back to an initial disc. */
  function faceHTML(src, initial) {
    if (src) return '<img src="' + esc(src) + '" alt="">';
    return '<span>' + esc((initial || 'Y').charAt(0).toUpperCase()) + '</span>';
  }

  /* Run-scope for timers and listeners so teardown is always clean. */
  function scope() {
    var timers = [], offs = [], dead = false;
    return {
      get dead() { return dead; },
      later: function (fn, ms) {
        if (dead) return 0;
        var t = W.setTimeout(function () { if (!dead) fn(); }, ms);
        timers.push(t); return t;
      },
      on: function (target, type, fn, capture) {
        if (!target || !target.addEventListener) return;
        target.addEventListener(type, fn, capture || false);
        offs.push(function () { target.removeEventListener(type, fn, capture || false); });
      },
      kill: function () {
        if (dead) return;
        dead = true;
        for (var i = 0; i < timers.length; i++) { W.clearTimeout(timers[i]); W.clearInterval(timers[i]); }
        for (var j = 0; j < offs.length; j++) { try { offs[j](); } catch (e) {} }
        timers = []; offs = [];
      }
    };
  }

  /* A shell may throw the host away without calling teardown (a plain back
     button does exactly that). Notice, and clean up rather than leaving a
     document-level key handler behind. */
  function detached(host) {
    return !!(D && D.body && host && host.nodeType === 1 && !D.body.contains(host));
  }
  function teardownOf(sc, extra) {
    var fn = function () { sc.kill(); if (extra) { try { extra(); } catch (e) {} } };
    fn.destroy = fn;
    return fn;
  }

  /* Leave mid-game: hand control back to the shell, which unmounts us
     through our own teardown. Standalone (no shell), end honestly instead. */
  function leaveVia(endFn) {
    if (W.BI && typeof W.BI.go === 'function') { W.BI.go('mela'); return; }
    endFn();
  }

  var CHEERS = ['Shabaash!', 'Bahut khoob!', 'Wah!', 'Kya baat!'];

  /* Shared chrome: one compact title row (with the way out), the stage, and
     the single always-legible status line underneath. */
  function frame(host, title, kicker) {
    injectCSS();
    host.innerHTML =
      '<div class="arc-wrap">' +
        '<div class="arc-top">' +
          '<div><span class="arc-kicker">' + esc(kicker) + '</span><b>' + esc(title) + '</b></div>' +
          '<button type="button" class="arc-leave" data-go="leave">Mela</button>' +
        '</div>' +
        '<div class="arc-stage"></div>' +
        '<p class="arc-feed" role="status" aria-live="polite"></p>' +
      '</div>';
    var ref = {
      wrap: host.querySelector('.arc-wrap'),
      stage: host.querySelector('.arc-stage'),
      feed: host.querySelector('.arc-feed')
    };
    ref.say = function (msg, tone) {
      if (!ref.feed) return;
      ref.feed.textContent = msg || '';
      ref.feed.className = 'arc-feed' + (tone ? ' ' + tone : '');
    };
    return ref;
  }

  /* The board must fit the viewport WITH the die and chips — measured, not
     hoped. The board is square, so surplus page height converts 1:1 into a
     narrower board. A fixed bar pinned to the bottom of the viewport (the
     shell's mobile tab bar) is measured and respected, never guessed.
     Re-runs on every resize/orientation change. */
  function bottomBarH() {
    try {
      var el = D.elementFromPoint(Math.floor(W.innerWidth / 2), W.innerHeight - 6);
      while (el && el !== D.body && el !== D.documentElement) {
        var cs = W.getComputedStyle(el);
        if (cs.position === 'fixed' || cs.position === 'sticky') {
          var r = el.getBoundingClientRect();
          if (r.top > W.innerHeight * 0.5) return Math.max(0, W.innerHeight - r.top);
        }
        el = el.parentElement;
      }
    } catch (e) {}
    return 0;
  }
  function boardFitter(sc, host, ref, wrapSel) {
    function fit() {
      if (sc.dead || detached(host)) return;
      var wrap = ref.stage.querySelector(wrapSel);
      if (!wrap) return;
      try { W.scrollTo(0, 0); } catch (e) {}
      wrap.style.width = '100%';
      var rect = wrap.getBoundingClientRect();
      var natural = rect.width;
      var topAbs = rect.top + (W.pageYOffset || 0);
      var feedH = ref.feed ? ref.feed.offsetHeight : 40;
      var avail = W.innerHeight - topAbs - bottomBarH() - feedH - 16;
      var w = Math.max(228, Math.min(natural, avail));
      if (w < natural) wrap.style.width = r2(w) + 'px';
    }
    sc.on(W, 'resize', fit);
    return function () { fit(); sc.later(fit, 80); sc.later(fit, 300); };
  }

  /* ---- the die: pips + tumble ---- */
  var PIPS = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[27, 27], [50, 50], [73, 73]],
    4: [[31, 31], [69, 31], [31, 69], [69, 69]],
    5: [[29, 29], [71, 29], [50, 50], [29, 71], [71, 71]],
    6: [[31, 26], [69, 26], [31, 50], [69, 50], [31, 74], [69, 74]]
  };
  function dieBtnHTML() {
    return '<button type="button" class="arc-die ready" data-go="roll" aria-label="Roll the die">' + pipsHTML(6) + '</button>';
  }
  function pipsHTML(v) {
    var p = PIPS[v] || PIPS[6], out = '', i;
    for (i = 0; i < p.length; i++) {
      out += '<span class="arc-pip" style="left:' + p[i][0] + '%;top:' + p[i][1] + '%"></span>';
    }
    return out;
  }
  function dieShow(ref, v) {
    var b = ref.stage.querySelector('.arc-die');
    if (b) b.innerHTML = pipsHTML(v);
  }
  /* Tumble, flashing random faces, then settle on the real roll. */
  function dieRoll(sc, ref, RM, v, then) {
    var b = ref.stage.querySelector('.arc-die');
    if (RM || !b) { dieShow(ref, v); sc.later(then, 60); return; }
    b.classList.remove('ready');
    b.classList.add('roll');
    var i;
    for (i = 1; i <= 4; i++) {
      (function (k) { sc.later(function () { dieShow(ref, rollDie()); }, k * 85); })(i);
    }
    sc.later(function () { dieShow(ref, v); }, 430);
    sc.later(function () { if (b) b.classList.remove('roll'); then(); }, 560);
  }
  function dieEnable(ref, on) {
    var b = ref.stage.querySelector('.arc-die');
    if (b) { b.disabled = !on; b.classList.toggle('ready', !!on); }
  }

  function barHTML(youNote, gattuNote) {
    return '<div class="arc-bar">' +
      '<span class="arc-pl you now" data-pl="you"><span class="face">' + faceHTML(buddySrc(), playerName()) + '</span>' +
        '<span class="tag"><span data-n>' + esc(playerName()) + '</span><span data-t>' + esc(youNote) + '</span></span></span>' +
      dieBtnHTML() +
      '<span class="arc-pl gattu" data-pl="gattu"><span class="face">' + faceHTML(gattuSrc(), 'G') + '</span>' +
        '<span class="tag"><span data-n>Gattu</span><span data-t>' + esc(gattuNote) + '</span></span></span>' +
    '</div>';
  }
  function barUpdate(ref, youText, gattuText, youNow, gattuNow) {
    var yc = ref.stage.querySelector('[data-pl="you"] [data-t]');
    var gc = ref.stage.querySelector('[data-pl="gattu"] [data-t]');
    if (yc) yc.textContent = youText;
    if (gc) gc.textContent = gattuText;
    var yp = ref.stage.querySelector('[data-pl="you"]');
    var gp = ref.stage.querySelector('[data-pl="gattu"]');
    if (yp) yp.className = 'arc-pl you' + (youNow ? ' now' : '');
    if (gp) gp.className = 'arc-pl gattu' + (gattuNow ? ' now' : '');
  }

  function introHTML(heritage, how1, how2) {
    return '<div class="arc-intro">' +
      '<div class="arc-art">' + gattuHTML(92) + '</div>' +
      '<p>' + how1 + '</p><p>' + how2 + '</p>' +
      '<p class="arc-heritage">' + heritage + '</p>' +
      '<div class="arc-row">' +
        '<button type="button" class="arc-btn" data-go="start">Play</button>' +
      '</div>' +
      '<p class="arc-hint">Enter starts. Space or Enter rolls the die once you are in.</p>' +
    '</div>';
  }

  function doneHTML(headline, body, chips) {
    var tally = '';
    for (var i = 0; i < chips.length; i++) {
      tally += '<span class="arc-chip"><b>' + chips[i][0] + '</b> ' + esc(chips[i][1]) + '</span>';
    }
    return '<div class="arc-done">' +
      '<div class="arc-art">' + gattuHTML(96) + '</div>' +
      '<h3>' + esc(headline) + '</h3>' +
      '<p>' + body + '</p>' +
      '<div class="arc-tally">' + tally + '</div>' +
      '<div class="arc-row">' +
        '<button type="button" class="arc-btn" data-go="out">Back to the Mela</button>' +
        '<button type="button" class="arc-btn ghost" data-go="again">Play again</button>' +
      '</div>' +
    '</div>';
  }

  /* ==================================================================
     GAME 1 · SAAP-SIDI  (Gyan Chaupar / Moksha Patam)

     The board this game descends from was Indian long before it was
     English: in Gyan Chaupar every ladder was a named virtue and every
     snake a named slip, and the whole point was that the two were
     teachable. We keep the names and the gentleness, and drop the
     export's blank moralising. A snake here is a slide and a smile.
     ================================================================== */

  /* Ladders: foot → top, each a virtue with a one-line meaning. */
  var SS_LADDERS = [
    { foot: 4,  top: 25, name: 'Daya',   gloss: 'kindness — a hand held out lifts you with it' },
    { foot: 13, top: 46, name: 'Seva',   gloss: 'helping — pitch in and up you go' },
    { foot: 33, top: 68, name: 'Satya',  gloss: 'the truth — it stands steady, like a ladder' },
    { foot: 50, top: 91, name: 'Himmat', gloss: 'courage — one brave step climbs a long way' },
    { foot: 62, top: 81, name: 'Vidya',  gloss: 'learning — every new thing you learn lifts you' }
  ];
  /* Snakes: head → tail, each a slip. The lines are written to be said with
     a grin — no scolding, ever. Each snake wears its own pigment. */
  var SS_SNAKES = [
    { head: 27, tail: 9,  name: 'Krodh',   gloss: 'a stomp of temper — deep breath, little slide, on we go',
      body: '#c1502f', dark: '#8e3218', belly: '#f4cda6' },
    { head: 43, tail: 18, name: 'Jhooth',  gloss: 'a fib — it slips you back a bit, no harm done',
      body: '#2f7d7a', dark: '#1c5a57', belly: '#c2e5da' },
    { head: 56, tail: 37, name: 'Lalach',  gloss: 'grabbing more — and dropping the lot, wheee',
      body: '#c08a2a', dark: '#8f6116', belly: '#f4e0ad' },
    { head: 75, tail: 32, name: 'Aalas',   gloss: 'couldn’t be bothered — the board slid for you instead',
      body: '#5f6cae', dark: '#404b85', belly: '#ced5f0' },
    { head: 96, tail: 65, name: 'Ghamand', gloss: 'showing off — it wobbles the ladder, down and onward',
      body: '#96477c', dark: '#6d2c58', belly: '#ebc8dd' }
  ];

  /* Square 1 sits bottom-left; each row snakes back the other way
     (boustrophedon), so 100 lands top-left. */
  function ssRC(sq) {
    var i = sq - 1, br = Math.floor(i / 10), c = i % 10;
    if (br % 2 === 1) c = 9 - c;
    return { row: 9 - br, col: c };
  }
  /* Centre of a square in board units: 10-unit cells inside a 4-unit frame,
     viewBox 0 0 108 108. */
  function ssXYu(sq) {
    var rc = ssRC(sq);
    return { x: 4 + (rc.col + 0.5) * 10, y: 4 + (rc.row + 0.5) * 10 };
  }
  function ssPct(v) { return r2(v / 108 * 100); }

  /* ---- painted-board art builders ---- */

  function ssPoly(pts) {
    var d = 'M' + r2(pts[0][0]) + ' ' + r2(pts[0][1]), i;
    for (i = 1; i < pts.length; i++) d += 'L' + r2(pts[i][0]) + ' ' + r2(pts[i][1]);
    return d + 'Z';
  }

  /* A ladder with perspective: rails converge and thin toward the top,
     rungs evenly spaced and shortening, a soft cast shadow underneath. */
  function ssLadderSVG(foot, top) {
    var A = ssXYu(foot), B = ssXYu(top);
    var dx = B.x - A.x, dy = B.y - A.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / L, ny = dx / L;
    var g0 = 2.0, g1 = 1.35;            /* half-gap between rails: wide foot, narrow top */
    var w0 = 0.62, w1 = 0.44;           /* rail thickness foot → top */
    function rail(sgn) {
      return ssPoly([
        [A.x + nx * (sgn * g0 - w0 / 2), A.y + ny * (sgn * g0 - w0 / 2)],
        [A.x + nx * (sgn * g0 + w0 / 2), A.y + ny * (sgn * g0 + w0 / 2)],
        [B.x + nx * (sgn * g1 + w1 / 2), B.y + ny * (sgn * g1 + w1 / 2)],
        [B.x + nx * (sgn * g1 - w1 / 2), B.y + ny * (sgn * g1 - w1 / 2)]
      ]);
    }
    var rails = rail(1) + ' ' + rail(-1);
    var railPath = '<path d="' + rail(1) + '"/><path d="' + rail(-1) + '"/>';
    var rungs = '', k = Math.max(4, Math.round(L / 5.2)), i;
    for (i = 1; i < k; i++) {
      var t = i / k, cx = A.x + dx * t, cy = A.y + dy * t;
      var half = (g0 + (g1 - g0) * t) - 0.12;
      rungs += '<line x1="' + r2(cx + nx * half) + '" y1="' + r2(cy + ny * half) +
               '" x2="' + r2(cx - nx * half) + '" y2="' + r2(cy - ny * half) + '"/>';
    }
    return '<g>' +
      '<g transform="translate(0.55 0.85)" fill="rgba(70,40,10,.16)"><path d="' + rails + '"/></g>' +
      '<g stroke="#96601f" stroke-width="0.52" stroke-linecap="round">' + rungs + '</g>' +
      '<g fill="#b4783a" stroke="#7c4f1c" stroke-width="0.14" stroke-linejoin="round">' + railPath + '</g>' +
    '</g>';
  }

  /* A snake with a life of its own: a tapered body sampled along a wavy
     centreline, diamond-patterned back, pale belly stripe, a real head
     with eyes and a forked tongue, all anchored head-square to tail-square. */
  function ssSnakeSVG(sn, idx) {
    var A = ssXYu(sn.head), B = ssXYu(sn.tail);
    var dx = B.x - A.x, dy = B.y - A.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / L, ny = dx / L;
    var waves = Math.max(1, Math.round(L / 24));
    var amp = Math.max(3.0, Math.min(7.0, L * 0.13));
    var ph = (idx % 2) ? Math.PI * 0.85 : 0.25;
    var N = 30, pts = [], i, t;
    for (i = 0; i <= N; i++) {
      t = i / N;
      var wob = Math.sin(t * Math.PI * 2 * waves + ph) * amp * Math.sin(Math.PI * t);
      pts.push([A.x + dx * t + nx * wob, A.y + dy * t + ny * wob]);
    }
    function tangentAt(i2) {
      var p0 = pts[Math.max(0, i2 - 1)], p1 = pts[Math.min(N, i2 + 1)];
      var tx = p1[0] - p0[0], ty = p1[1] - p0[1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
      return { ux: tx / tl, uy: ty / tl, px: -ty / tl, py: tx / tl };
    }
    function widthAt(t2) { return 2.1 * Math.pow(1 - t2, 0.9) + 0.38; }
    function outline(f) {
      var Ls = [], Rs = [], j;
      for (j = 0; j <= N; j++) {
        var tg = tangentAt(j), w = widthAt(j / N) * f;
        Ls.push([pts[j][0] + tg.px * w, pts[j][1] + tg.py * w]);
        Rs.push([pts[j][0] - tg.px * w, pts[j][1] - tg.py * w]);
      }
      var d = 'M' + r2(Ls[0][0]) + ' ' + r2(Ls[0][1]);
      for (j = 1; j <= N; j++) d += 'L' + r2(Ls[j][0]) + ' ' + r2(Ls[j][1]);
      for (j = N; j >= 0; j--) d += 'L' + r2(Rs[j][0]) + ' ' + r2(Rs[j][1]);
      return d + 'Z';
    }
    var body = outline(1), belly = outline(0.4);
    /* diamond spots along the spine */
    var spots = '';
    for (i = 3; i < N - 1; i += 3) {
      var tg2 = tangentAt(i), w2 = widthAt(i / N);
      var s1 = w2 * 0.62, s2 = w2 * 0.44, px2 = pts[i][0], py2 = pts[i][1];
      spots += '<path d="' + ssPoly([
        [px2 + tg2.ux * s1, py2 + tg2.uy * s1],
        [px2 + tg2.px * s2, py2 + tg2.py * s2],
        [px2 - tg2.ux * s1, py2 - tg2.uy * s1],
        [px2 - tg2.px * s2, py2 - tg2.py * s2]
      ]) + '"/>';
    }
    /* head at the head square, looking away from the body */
    var t0 = tangentAt(0);
    var hdx = -t0.ux, hdy = -t0.uy;                 /* out of the board toward the head cell edge */
    var hx = A.x + hdx * 0.5, hy = A.y + hdy * 0.5;
    var ang = r2(Math.atan2(hdy, hdx) * 180 / Math.PI);
    var hnx = -hdy, hny = hdx;
    var e1x = hx + hdx * 0.55 + hnx * 0.92, e1y = hy + hdy * 0.55 + hny * 0.92;
    var e2x = hx + hdx * 0.55 - hnx * 0.92, e2y = hy + hdy * 0.55 - hny * 0.92;
    var tipx = hx + hdx * 2.35, tipy = hy + hdy * 2.35;
    var midx = hx + hdx * 3.5, midy = hy + hdy * 3.5;
    var f1x = midx + hdx * 0.9 + hnx * 0.5, f1y = midy + hdy * 0.9 + hny * 0.5;
    var f2x = midx + hdx * 0.9 - hnx * 0.5, f2y = midy + hdy * 0.9 - hny * 0.5;
    return '<g opacity="0.96">' +
      '<path d="' + body + '" transform="translate(0.5 0.8)" fill="rgba(60,30,10,.15)"/>' +
      '<path d="' + body + '" fill="' + sn.body + '" stroke="' + sn.dark + '" stroke-width="0.2" stroke-linejoin="round"/>' +
      '<path d="' + belly + '" fill="' + sn.belly + '" opacity="0.55"/>' +
      '<g fill="' + sn.dark + '" opacity="0.5">' + spots + '</g>' +
      '<path d="M' + r2(tipx) + ' ' + r2(tipy) + 'L' + r2(midx) + ' ' + r2(midy) +
        'M' + r2(midx) + ' ' + r2(midy) + 'L' + r2(f1x) + ' ' + r2(f1y) +
        'M' + r2(midx) + ' ' + r2(midy) + 'L' + r2(f2x) + ' ' + r2(f2y) +
        '" stroke="#cf3b28" stroke-width="0.3" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="' + r2(hx) + '" cy="' + r2(hy) + '" rx="2.5" ry="1.9" transform="rotate(' + ang + ' ' + r2(hx) + ' ' + r2(hy) + ')"' +
        ' fill="' + sn.body + '" stroke="' + sn.dark + '" stroke-width="0.2"/>' +
      '<circle cx="' + r2(e1x) + '" cy="' + r2(e1y) + '" r="0.56" fill="#fffbe9"/>' +
      '<circle cx="' + r2(e2x) + '" cy="' + r2(e2y) + '" r="0.56" fill="#fffbe9"/>' +
      '<circle cx="' + r2(e1x + hdx * 0.16) + '" cy="' + r2(e1y + hdy * 0.16) + '" r="0.27" fill="#2a1608"/>' +
      '<circle cx="' + r2(e2x + hdx * 0.16) + '" cy="' + r2(e2y + hdy * 0.16) + '" r="0.27" fill="#2a1608"/>' +
    '</g>';
  }

  /* Name chips at ladder feet and snake heads — the old names, quietly. */
  function ssLabelSVG(sq, text, kind) {
    var rc = ssRC(sq);
    var cw = text.length * 1.5 + 2.2, ch = 3.3;
    var cx = 4 + rc.col * 10 + 5, cy = 4 + rc.row * 10 + 8.55;
    cx = Math.max(4 + cw / 2 + 0.3, Math.min(104 - cw / 2 - 0.3, cx));
    var col = kind === 'lad' ? '#1e7a4c' : '#a8452b';
    return '<g>' +
      '<rect x="' + r2(cx - cw / 2) + '" y="' + r2(cy - ch / 2) + '" width="' + r2(cw) + '" height="' + ch +
        '" rx="1.6" fill="#fffcf2" opacity="0.94" stroke="' + col + '" stroke-width="0.16"/>' +
      '<text class="arc-sslabel" x="' + r2(cx) + '" y="' + r2(cy + 0.88) + '" text-anchor="middle" fill="' + col + '">' +
        esc(text) + '</text>' +
    '</g>';
  }

  /* The diya on square 100 — the little lamp the whole climb is for. */
  function ssDiyaSVG() {
    return '<g>' +
      '<circle cx="9" cy="9.4" r="3.9" fill="#f6c04a" opacity="0.35"/>' +
      '<circle cx="9" cy="9.4" r="2.6" fill="#ffd873" opacity="0.4"/>' +
      '<path d="M9 6.1C10 7.3 9.9 8.7 9 9.3C8.1 8.7 8 7.3 9 6.1Z" fill="#f0912b"/>' +
      '<path d="M9 7.1C9.5 7.8 9.45 8.6 9 8.95C8.55 8.6 8.5 7.8 9 7.1Z" fill="#ffe08a"/>' +
      '<path d="M5.7 9.9Q9 10.7 12.3 9.9Q11.6 12.4 9 12.6Q6.4 12.4 5.7 9.9Z" fill="#a8452b"/>' +
      '<path d="M5.7 9.9Q9 10.85 12.3 9.9" fill="none" stroke="#7c2d1a" stroke-width="0.22"/>' +
    '</g>';
  }

  function ssBoardSVG() {
    var s = '<svg viewBox="0 0 108 108" role="img" aria-label="Saap-Sidi board — 100 squares, ladders of virtue, snakes of little slips">';
    /* terracotta frame with a gold pinstripe */
    s += '<rect x="0" y="0" width="108" height="108" rx="3.4" fill="#a3492b"/>';
    s += '<rect x="0" y="0" width="108" height="108" rx="3.4" fill="none" stroke="rgba(60,20,5,.35)" stroke-width="0.5"/>';
    s += '<rect x="2.4" y="2.4" width="103.2" height="103.2" rx="1.8" fill="none" stroke="#e6b95c" stroke-width="0.5"/>';
    s += '<rect x="4" y="4" width="100" height="100" fill="#fdf3dd"/>';
    /* the checker, with soft green washes at ladder feet and rose at snake heads */
    var ladAt = {}, snkAt = {}, i;
    for (i = 0; i < SS_LADDERS.length; i++) ladAt[SS_LADDERS[i].foot] = 1;
    for (i = 0; i < SS_SNAKES.length; i++) snkAt[SS_SNAKES[i].head] = 1;
    var dr, c;
    for (dr = 0; dr < 10; dr++) {
      var br = 9 - dr;
      for (c = 0; c < 10; c++) {
        var sq = br % 2 === 0 ? br * 10 + c + 1 : br * 10 + (10 - c);
        var x = 4 + c * 10, y = 4 + dr * 10;
        var fill = ((dr + c) % 2) ? '#f6dfae' : '#fdf3dd';
        s += '<rect x="' + x + '" y="' + y + '" width="10" height="10" fill="' + fill + '" stroke="#ecd6a2" stroke-width="0.16"/>';
        if (ladAt[sq]) s += '<rect x="' + x + '" y="' + y + '" width="10" height="10" fill="#2f8f5f" opacity="0.16"/>';
        if (snkAt[sq]) s += '<rect x="' + x + '" y="' + y + '" width="10" height="10" fill="#c65a3a" opacity="0.14"/>';
        if (sq === 100) {
          s += ssDiyaSVG();
          s += '<text class="arc-ssnum hot" x="' + (x + 1) + '" y="' + (y + 3.2) + '" font-size="2.4">100</text>';
        } else {
          s += '<text class="arc-ssnum' + ((ladAt[sq] || snkAt[sq]) ? ' hot' : '') + '" x="' + (x + 1) + '" y="' + (y + 3.4) + '">' + sq + '</text>';
        }
      }
    }
    /* art: ladders under snakes, name chips on top of both */
    for (i = 0; i < SS_LADDERS.length; i++) s += ssLadderSVG(SS_LADDERS[i].foot, SS_LADDERS[i].top);
    for (i = 0; i < SS_SNAKES.length; i++) s += ssSnakeSVG(SS_SNAKES[i], i);
    for (i = 0; i < SS_LADDERS.length; i++) s += ssLabelSVG(SS_LADDERS[i].foot, SS_LADDERS[i].name, 'lad');
    for (i = 0; i < SS_SNAKES.length; i++) s += ssLabelSVG(SS_SNAKES[i].head, SS_SNAKES[i].name, 'snk');
    s += '</svg>';
    return s;
  }

  function saapsidi(host, opts, done) {
    var sc = scope();
    var RM = reducedMotion();
    var ref = frame(host, 'Saap-Sidi', 'Mela · Gyan Chaupar, the original board');
    var refit = boardFitter(sc, host, ref, '.arc-sswrap');
    var mode = 'intro';                 /* intro | play | over */
    var phase = 'idle';                 /* roll (yours) | busy */
    var pos = { you: 1, gattu: 1 };
    var moved = 0;                      /* squares the child's token walked — the score */
    var finished = false, winFlag = false;
    var turnIsYou = true;

    var ladAt = {}, snkAt = {}, i;
    for (i = 0; i < SS_LADDERS.length; i++) ladAt[SS_LADDERS[i].foot] = SS_LADDERS[i];
    for (i = 0; i < SS_SNAKES.length; i++) snkAt[SS_SNAKES[i].head] = SS_SNAKES[i];

    function endGame(win) {
      if (finished) return;
      finished = true;
      sc.kill();
      if (typeof done === 'function') done({ win: !!win, score: moved, kauris: win ? 3 : 1 });
    }

    function tokHTML(side) {
      var src = side === 'you' ? pieceSrc() : gattuSrc();   /* the piece rule */
      var xy = ssXYu(1);
      return '<div class="arc-tok ' + side + '" data-tok="' + side + '" aria-hidden="true" ' +
        'style="left:' + ssPct(xy.x) + '%;top:' + ssPct(xy.y) + '%">' +
        '<div class="arc-tokface">' + faceHTML(src, side === 'you' ? playerName() : 'G') + '</div>' +
      '</div>';
    }

    function renderPlay() {
      mode = 'play';
      ref.wrap.classList.add('playing');
      ref.stage.innerHTML =
        barHTML('Square 1', 'Square 1') +
        '<div class="arc-sswrap">' +
          ssBoardSVG() +
          tokHTML('gattu') + tokHTML('you') +
          '<div class="arc-toast" data-toast aria-hidden="true"><b></b><span></span></div>' +
        '</div>';
      place();
      refit();
      phase = 'roll';
      ref.say('Your roll first — tap the die, or press Space.');
      sc.later(function () { focusSoft(ref.stage.querySelector('.arc-die')); }, 60);
    }

    function tokEl(side) { return ref.stage.querySelector('.arc-tok[data-tok="' + side + '"]'); }

    /* Position both tokens; when they share a square, nudge them apart so
       neither hides the other. */
    function place() {
      var same = pos.you === pos.gattu;
      var sides = ['you', 'gattu'], s;
      for (s = 0; s < 2; s++) {
        var side = sides[s], el = tokEl(side);
        if (!el) continue;
        var xy = ssXYu(pos[side]);
        var dx = same ? (side === 'you' ? -1.7 : 1.7) : 0;
        var dy = same ? (side === 'you' ? -1.1 : 1.1) : 0;
        el.style.left = ssPct(xy.x + dx) + '%';
        el.style.top = ssPct(xy.y + dy) + '%';
      }
      barUpdate(ref,
        'Square ' + pos.you,
        'Square ' + pos.gattu,
        mode === 'play' && turnIsYou,
        mode === 'play' && !turnIsYou);
    }

    /* One little hop of the token body — squash on landing. */
    function hop(side) {
      if (RM) return;
      var el = tokEl(side);
      var face = el && el.querySelector('.arc-tokface');
      if (!face || !face.animate) return;
      try {
        face.animate([
          { transform: 'translateY(0) scale(1,1)' },
          { transform: 'translateY(-34%) scale(.93,1.08)', offset: 0.45 },
          { transform: 'translateY(0) scale(1.09,.9)', offset: 0.82 },
          { transform: 'translateY(0) scale(1,1)' }
        ], { duration: 150, easing: 'ease-out' });
      } catch (e) {}
    }

    function toast(kind, title, text) {
      var el = ref.stage.querySelector('[data-toast]');
      if (!el) return;
      el.className = 'arc-toast ' + kind + ' show';
      el.querySelector('b').textContent = title;
      el.querySelector('span').textContent = text;
      sc.later(function () { if (el) el.classList.remove('show'); }, 3200);
    }

    /* The token walks square by square with a hop per step; under
       prefers-reduced-motion it simply appears at the end of the path. */
    function walk(side, path, then) {
      if (!path.length) { then(); return; }
      if (RM) {
        pos[side] = path[path.length - 1];
        place();
        sc.later(then, 80);
        return;
      }
      var i2 = 0;
      (function step() {
        if (sc.dead || detached(host)) { sc.kill(); return; }
        pos[side] = path[i2];
        place();
        hop(side);
        i2++;
        if (i2 < path.length) sc.later(step, 150);
        else sc.later(then, 180);
      })();
    }

    /* Snake and ladder rides are one smooth glide, not a walk. */
    function glide(side, sq, then) {
      var el = tokEl(side);
      if (RM || !el) {
        pos[side] = sq; place();
        sc.later(then, 80);
        return;
      }
      el.style.transition = 'left .75s cubic-bezier(.45,0,.25,1), top .75s cubic-bezier(.45,0,.25,1)';
      pos[side] = sq; place();
      sc.later(function () { if (el) el.style.transition = ''; then(); }, 800);
    }

    function takeTurn(side) {
      phase = 'busy';
      turnIsYou = side === 'you';
      dieEnable(ref, false);
      place();
      var v = rollDie();
      var who = side === 'you' ? playerName() : 'Gattu';
      ref.say(who + ' rolls…', side === 'you' ? '' : 'warm');
      dieRoll(sc, ref, RM, v, function () {
        var cur = pos[side], path = [], sq;
        var bounced = cur + v > 100;
        if (!bounced) {
          for (sq = cur + 1; sq <= cur + v; sq++) path.push(sq);
        } else {
          for (sq = cur + 1; sq <= 100; sq++) path.push(sq);
          for (sq = 99; sq >= 200 - cur - v; sq--) path.push(sq);
        }
        if (side === 'you') moved += path.length;
        var landing = path[path.length - 1];
        ref.say(who + ' rolled ' + v + (bounced ? ' — bounced off 100, back to ' + landing + '.' : ' — off to square ' + landing + '.'),
                side === 'you' ? '' : 'warm');
        walk(side, path, function () { settle(side, landing); });
      });
    }

    function settle(side, sq) {
      var who = side === 'you' ? playerName() : 'Gattu';
      if (ladAt[sq]) {
        var l = ladAt[sq];
        toast('lad', 'Sidi · ' + l.name, l.gloss);
        ref.say(who + ' found ' + l.name + ' — up the ladder, ' + sq + ' → ' + l.top + '!', 'good');
        hop(side);
        sc.later(function () { glide(side, l.top, function () { after(side, l.top); }); }, 620);
        return;
      }
      if (snkAt[sq]) {
        var s = snkAt[sq];
        toast('snk', 'Saap · ' + s.name, s.gloss);
        ref.say(who + ' met ' + s.name + ' — a little slide, ' + sq + ' → ' + s.tail + '. Smile, onwards!', 'warm');
        sc.later(function () { glide(side, s.tail, function () { after(side, s.tail); }); }, 620);
        return;
      }
      after(side, sq);
    }

    function after(side, sq) {
      if (sq === 100) { finishScreen(side === 'you'); return; }
      if (side === 'you') {
        sc.later(function () { if (mode === 'play') takeTurn('gattu'); }, 850);
      } else {
        sc.later(function () {
          if (mode !== 'play') return;
          phase = 'roll';
          turnIsYou = true;
          place();
          dieEnable(ref, true);
          ref.say('Your roll — Space or tap the die.');
        }, 550);
      }
    }

    function finishScreen(win) {
      mode = 'over';
      phase = 'idle';
      winFlag = win;
      ref.wrap.classList.remove('playing');
      ref.say('');
      ref.stage.innerHTML = doneHTML(
        win ? one(CHEERS) : 'Gattu got there first',
        win ? 'Square 100 — the diya is lit! The ladders liked you today; every one of them was a virtue with a name.'
            : 'The snakes were hungry today. No matter — every ladder is still exactly where it was.',
        [[String(moved), 'squares walked'], [String(win ? 3 : 1), 'kauris']]
      );
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="out"]')); }, 60);
    }

    function reset() {
      pos = { you: 1, gattu: 1 };
      moved = 0;
      turnIsYou = true;
      renderPlay();
    }

    function showIntro() {
      mode = 'intro';
      ref.wrap.classList.remove('playing');
      ref.stage.innerHTML = introHTML(
        'This game is Indian: it began centuries ago as <b>Gyan Chaupar</b> — Moksha Patam — ' +
        'where the ladders were virtues and the snakes were slips. “Snakes and Ladders” is the export.',
        'Roll the die and race Gattu to square <b>100</b>, where the diya is lit. ' +
        'Ladders lift you, snakes slide you back — with a smile.',
        'Roll more than you need and you bounce back off 100.'
      );
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="start"]')); }, 60);
    }

    sc.on(ref.wrap, 'click', function (e) {
      var go = e.target.closest ? e.target.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'start') renderPlay();
      else if (what === 'roll') { if (phase === 'roll') takeTurn('you'); }
      else if (what === 'leave') leaveVia(function () { endGame(false); });
      else if (what === 'again') reset();
      else if (what === 'out') endGame(winFlag);
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      /* A focused button already handles its own Enter/Space click; this
         catch-all only fires when focus is elsewhere, so the promise in the
         hint — Enter starts, Space rolls — holds wherever focus wandered. */
      var onBtn = e.target && e.target.closest && e.target.closest('button');
      if (onBtn) return;
      /* while playing, no game key may scroll the page out from under the board */
      var gameKey = e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter' ||
                    e.key.indexOf('Arrow') === 0;
      if (mode === 'play' && gameKey) e.preventDefault();
      if (e.key !== ' ' && e.key !== 'Enter' && e.key !== 'Spacebar') return;
      if (mode === 'intro') { e.preventDefault(); renderPlay(); return; }
      if (mode === 'over') { e.preventDefault(); endGame(winFlag); return; }
      if (mode === 'play' && phase === 'roll') {
        takeTurn('you');
      }
    });

    showIntro();
    return teardownOf(sc, function () { finished = true; });
  }

  /* ==================================================================
     GAME 2 · LUDO  (Pachisi in a British suit)

     The cross-and-circle board is centuries older than the boxed export —
     Pachisi and Chaupar were played across India long before a patent
     office ever saw the word "Ludo". Two players here: the child and
     Gattu, four tokens each, the classic 52-cell ring with a 6-square
     home column and the 8 standard safe stars. All four quadrants are
     drawn — the empty two sit greyed, like chairs kept at the table.

     Geometry: a 15×15 grid drawn as SVG. The ring below is the standard
     track enumerated clockwise from (0,6); each player's start is 13
     cells from the last, and the 8 safe cells are the 4 starts plus the
     4 stars eight steps ahead of each start.
     ================================================================== */

  var L_RING = (function () {
    var r = [], i;
    for (i = 0; i < 6; i++) r.push([i, 6]);        /* 0-5   left arm, top row  */
    for (i = 5; i >= 0; i--) r.push([6, i]);        /* 6-11  up the left of top arm */
    r.push([7, 0]);                                 /* 12    top edge */
    for (i = 0; i < 6; i++) r.push([8, i]);         /* 13-18 down the right of top arm */
    for (i = 9; i < 15; i++) r.push([i, 6]);        /* 19-24 right arm, top row */
    r.push([14, 7]);                                /* 25    right edge */
    for (i = 14; i >= 9; i--) r.push([i, 8]);       /* 26-31 right arm, bottom row */
    for (i = 9; i < 15; i++) r.push([8, i]);        /* 32-37 down the bottom arm */
    r.push([7, 14]);                                /* 38    bottom edge */
    for (i = 14; i >= 9; i--) r.push([6, i]);       /* 39-44 up the bottom arm */
    for (i = 5; i >= 0; i--) r.push([i, 8]);        /* 45-50 left arm, bottom row */
    r.push([0, 7]);                                 /* 51    left edge */
    return r;
  })();
  var L_START = { you: 1, gattu: 27 };
  var L_SAFE = { 1: 1, 9: 1, 14: 1, 22: 1, 27: 1, 35: 1, 40: 1, 48: 1 };
  /* Home columns run along row 7 toward the centre; the sixth square is the
     centre itself. Progress p: -1 in the yard, 0..50 on the ring, 51..55 in
     the column, 56 home. Exact roll to land on 56 — the classic rule. */
  var L_HOMECOL = {
    you:   [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
    gattu: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]]
  };
  var L_YARD = {
    you:   [[2, 2], [4, 2], [2, 4], [4, 4]],
    gattu: [[11, 11], [13, 11], [11, 13], [13, 13]]
  };
  var L_HOME_P = 56;
  /* the two greyed chairs at the table */
  var L_GREY_STARTS = [14, 40];
  var L_GREY_COLS = [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 13], [7, 12], [7, 11], [7, 10], [7, 9]];
  var L_GREY_YARDS = [[11, 2], [13, 2], [11, 4], [13, 4], [2, 11], [4, 11], [2, 13], [4, 13]];

  /* A proper five-point star, filled. */
  function lStar5(cx, cy, R) {
    var d = '', i, r = R * 0.42;
    for (i = 0; i < 10; i++) {
      var ang = -Math.PI / 2 + i * Math.PI / 5;
      var rad = (i % 2 === 0) ? R : r;
      d += (i === 0 ? 'M' : 'L') + r2(cx + Math.cos(ang) * rad) + ' ' + r2(cy + Math.sin(ang) * rad);
    }
    return d + 'Z';
  }

  function lQuadrant(x, y, tone, op, nests, ringTone) {
    var s = '<rect x="' + x + '" y="' + y + '" width="6" height="6" rx="0.7" fill="' + tone + '"' +
            (op < 1 ? ' opacity="' + op + '"' : '') + '/>';
    s += '<rect x="' + (x + 0.95) + '" y="' + (y + 0.95) + '" width="4.1" height="4.1" rx="0.55" fill="var(--card)"/>';
    for (var i = 0; i < nests.length; i++) {
      s += '<circle cx="' + nests[i][0] + '" cy="' + nests[i][1] + '" r="0.6" fill="var(--card)" stroke="' + ringTone + '" stroke-width="0.14"/>' +
           '<circle cx="' + nests[i][0] + '" cy="' + nests[i][1] + '" r="0.34" fill="' + ringTone + '" opacity="0.16"/>';
    }
    return s;
  }

  function lTokenSVG(side, ti, src, clipId) {
    var y0 = L_YARD[side][ti];
    var ring = side === 'you' ? 'var(--accent)' : 'var(--accent2)';
    var body;
    if (src) {
      body = '<circle r="0.5" fill="#fff"/>' +
        '<image href="' + esc(src) + '" x="-0.4" y="-0.4" width="0.8" height="0.8" clip-path="url(#' + clipId + ')"/>' +
        '<circle r="0.5" fill="none" stroke="' + ring + '" stroke-width="0.13"/>' +
        '<circle r="0.5" fill="none" stroke="#fff" stroke-width="0.05" stroke-opacity="0.85"/>';
    } else {
      body = '<circle r="0.5" fill="' + ring + '" stroke="#fff" stroke-width="0.09"/>';
    }
    return '<g class="arc-ltok ' + side + '" data-side="' + side + '" data-i="' + ti + '"' +
      ' transform="translate(' + y0[0] + ',' + y0[1] + ')">' +
      '<ellipse cx="0" cy="0.44" rx="0.36" ry="0.13" fill="rgba(20,10,40,.28)"/>' +
      '<circle class="halo" r="0.66"/>' +
      body +
      '<circle class="hit" r="0.62" fill="transparent"/>' +
    '</g>';
  }

  function lBoardSVG() {
    var uid = 'arcl' + Math.floor(Math.random() * 1e6);
    var s = '<svg class="arc-lsvg" viewBox="-0.6 -0.6 16.2 16.2" role="img" aria-label="Ludo board — your tokens against Gattu’s">';
    s += '<defs><clipPath id="' + uid + '"><circle r="0.4"/></clipPath></defs>';
    s += '<rect x="-0.45" y="-0.45" width="15.9" height="15.9" rx="0.9" fill="var(--card2)" stroke="var(--line2)" stroke-width="0.1"/>';
    var i, c;
    /* ring cells with subtle borders */
    for (i = 0; i < L_RING.length; i++) {
      c = L_RING[i];
      s += '<rect x="' + c[0] + '" y="' + c[1] + '" width="1" height="1" rx="0.12" fill="var(--card)" stroke="var(--line2)" stroke-width="0.045"/>';
    }
    /* start cells: yours indigo, Gattu's marigold, the grey chairs pale */
    c = L_RING[L_START.you];
    s += '<rect x="' + c[0] + '" y="' + c[1] + '" width="1" height="1" rx="0.12" fill="var(--accent)"/>';
    c = L_RING[L_START.gattu];
    s += '<rect x="' + c[0] + '" y="' + c[1] + '" width="1" height="1" rx="0.12" fill="var(--accent2)"/>';
    for (i = 0; i < L_GREY_STARTS.length; i++) {
      c = L_RING[L_GREY_STARTS[i]];
      s += '<rect x="' + c[0] + '" y="' + c[1] + '" width="1" height="1" rx="0.12" fill="var(--mist)" opacity="0.55"/>';
    }
    /* home columns — live ones saturated, grey ones sleeping */
    for (i = 0; i < L_HOMECOL.you.length; i++) {
      c = L_HOMECOL.you[i];
      s += '<rect x="' + c[0] + '" y="' + c[1] + '" width="1" height="1" rx="0.12" fill="var(--accent)" opacity="0.82"/>';
      c = L_HOMECOL.gattu[i];
      s += '<rect x="' + c[0] + '" y="' + c[1] + '" width="1" height="1" rx="0.12" fill="var(--accent2)" opacity="0.82"/>';
    }
    for (i = 0; i < L_GREY_COLS.length; i++) {
      c = L_GREY_COLS[i];
      s += '<rect x="' + c[0] + '" y="' + c[1] + '" width="1" height="1" rx="0.12" fill="var(--mist)" opacity="0.4"/>';
    }
    /* four quadrants — all drawn, two of them greyed elegantly */
    s += lQuadrant(0, 0, 'var(--accent)', 1, L_YARD.you, 'var(--accent)');
    s += lQuadrant(9, 9, 'var(--accent2)', 1, L_YARD.gattu, 'var(--accent2)');
    s += lQuadrant(9, 0, 'var(--mist)', 0.55, [[11, 2], [13, 2], [11, 4], [13, 4]], 'var(--mist)');
    s += lQuadrant(0, 9, 'var(--mist)', 0.55, [[2, 11], [4, 11], [2, 13], [4, 13]], 'var(--mist)');
    /* centre: the four home triangles and a rosette */
    s += '<rect x="6" y="6" width="3" height="3" fill="var(--card)"/>';
    s += '<polygon points="6,6 6,9 7.5,7.5" fill="var(--accent)"/>';
    s += '<polygon points="9,6 9,9 7.5,7.5" fill="var(--accent2)"/>';
    s += '<polygon points="6,6 9,6 7.5,7.5" fill="var(--mist)" opacity="0.55"/>';
    s += '<polygon points="6,9 9,9 7.5,7.5" fill="var(--mist)" opacity="0.55"/>';
    s += '<rect x="6" y="6" width="3" height="3" fill="none" stroke="var(--line2)" stroke-width="0.06"/>';
    s += '<circle cx="7.5" cy="7.5" r="0.62" fill="var(--card)" stroke="var(--line2)" stroke-width="0.05"/>';
    for (i = 0; i < 8; i++) {
      var a = i * Math.PI / 4;
      s += '<circle cx="' + r2(7.5 + Math.cos(a) * 0.42) + '" cy="' + r2(7.5 + Math.sin(a) * 0.42) + '" r="0.1" fill="var(--accent3)"/>';
    }
    s += '<circle cx="7.5" cy="7.5" r="0.18" fill="var(--accent2)"/>';
    /* the 8 safe cells wear stars: white on coloured starts, quiet outlines elsewhere */
    for (var idx in L_SAFE) {
      if (!L_SAFE.hasOwnProperty(idx)) continue;
      c = L_RING[+idx];
      var onStart = +idx === L_START.you || +idx === L_START.gattu;
      var onGrey = L_GREY_STARTS.indexOf(+idx) >= 0;
      s += '<path d="' + lStar5(c[0] + 0.5, c[1] + 0.5, 0.34) + '"' +
        (onStart ? ' fill="#fff" fill-opacity="0.92"'
                 : onGrey ? ' fill="var(--card)" fill-opacity="0.8"'
                          : ' fill="none" stroke="var(--muted)" stroke-width="0.07" stroke-linejoin="round"') + '/>';
    }
    /* tokens live in their own layer so a repaint never rebuilds the board */
    s += '<g data-toks>';
    var ySrc = pieceSrc(), gSrc = gattuSrc(), t;            /* the piece rule */
    for (t = 0; t < 4; t++) s += lTokenSVG('you', t, ySrc, uid);
    for (t = 0; t < 4; t++) s += lTokenSVG('gattu', t, gSrc, uid);
    s += '</g></svg>';
    return s;
  }

  function ludo(host, opts, done) {
    var sc = scope();
    var RM = reducedMotion();
    var ref = frame(host, 'Ludo', 'Mela · Pachisi’s grandchild');
    var refit = boardFitter(sc, host, ref, '.arc-lwrap');
    var mode = 'intro';                    /* intro | play | over */
    var phase = 'idle';                    /* roll | choose | busy */
    var T = { you: [-1, -1, -1, -1], gattu: [-1, -1, -1, -1] };
    var die = 0, sixes = 0, movable = [], sel = 0;
    var finished = false, winFlag = false;

    function endGame(win) {
      if (finished) return;
      finished = true;
      sc.kill();
      var home = homeCount('you');
      if (typeof done === 'function') done({ win: !!win, score: home * 13, kauris: win ? 4 : 1 });
    }
    function homeCount(side) {
      var n = 0;
      for (var i = 0; i < 4; i++) if (T[side][i] === L_HOME_P) n++;
      return n;
    }
    function ringIdx(side, p) { return (L_START[side] + p) % 52; }

    function xyOf(side, ti) {
      var p = T[side][ti];
      if (p === -1) { var y = L_YARD[side][ti]; return { x: y[0], y: y[1] }; }
      if (p <= 50) { var c = L_RING[ringIdx(side, p)]; return { x: c[0] + 0.5, y: c[1] + 0.5 }; }
      if (p < L_HOME_P) { var h = L_HOMECOL[side][p - 51]; return { x: h[0] + 0.5, y: h[1] + 0.5 }; }
      /* finished tokens rest in the centre, each side keeping to its half */
      return { x: 6.9 + ti * 0.4, y: side === 'you' ? 7.08 : 7.92 };
    }

    function renderPlay() {
      mode = 'play';
      ref.wrap.classList.add('playing');
      ref.stage.innerHTML =
        barHTML('0 home', '0 home') +
        '<div class="arc-lwrap">' + lBoardSVG() + '</div>';
      phase = 'roll';
      paint();
      refit();
      ref.say('Your turn — roll a six to bring a token out. Space rolls.');
      sc.later(function () { focusSoft(ref.stage.querySelector('.arc-die')); }, 60);
    }

    function tokEls() { return ref.stage.querySelectorAll('.arc-ltok'); }

    function paint() {
      var els = tokEls(), i;
      /* group by resting spot so shared cells fan out instead of stacking */
      var at = {}, key, list;
      var sides = ['you', 'gattu'], sd, t;
      for (sd = 0; sd < 2; sd++) for (t = 0; t < 4; t++) {
        var p = T[sides[sd]][t];
        key = p === -1 || p === L_HOME_P ? sides[sd] + ':' + p + ':' + t
            : 'c' + xyOf(sides[sd], t).x + ',' + xyOf(sides[sd], t).y;
        (at[key] = at[key] || []).push(sides[sd] + t);
      }
      for (i = 0; i < els.length; i++) {
        var el = els[i], side = el.getAttribute('data-side'), ti = +el.getAttribute('data-i');
        var xy = xyOf(side, ti);
        var p2 = T[side][ti];
        key = p2 === -1 || p2 === L_HOME_P ? side + ':' + p2 + ':' + ti : 'c' + xy.x + ',' + xy.y;
        list = at[key] || [];
        var slot = list.indexOf(side + ti), n = list.length;
        var off = n > 1 ? (slot - (n - 1) / 2) * 0.28 : 0;
        el.setAttribute('transform', 'translate(' + r2(xy.x + off) + ',' + r2(xy.y) + ')');
        var live = phase === 'choose' && side === 'you' && movable.indexOf(ti) >= 0;
        var cls = 'arc-ltok ' + side + (live ? ' live' : '') +
          (live && movable[sel] === ti ? ' sel' : '') +
          (el.getAttribute('class').indexOf('ride') >= 0 ? ' ride' : '');
        el.setAttribute('class', cls);
      }
      barUpdate(ref,
        homeCount('you') + ' home',
        homeCount('gattu') + ' home',
        mode === 'play' && (phase === 'roll' || phase === 'choose'),
        mode === 'play' && phase === 'busy' && !yourMove);
      dieEnable(ref, phase === 'roll');
      if (die) dieShow(ref, die);
    }
    var yourMove = true;                 /* whose action the busy phase belongs to */

    function calcMovable(side, v) {
      var m = [], i, p;
      for (i = 0; i < 4; i++) {
        p = T[side][i];
        if (p === -1) { if (v === 6) m.push(i); }
        else if (p < L_HOME_P && p + v <= L_HOME_P) m.push(i);
      }
      return m;
    }

    function describe(side, ti) {
      var p = T[side][ti];
      if (p === -1) return 'in the yard';
      if (p <= 50) return 'on the ring, ' + (51 - p) + ' from the turn';
      if (p < L_HOME_P) return 'on the home path';
      return 'home';
    }

    /* ---- your turn ---- */
    function youRoll() {
      if (phase !== 'roll') return;
      phase = 'busy';
      yourMove = true;
      die = rollDie();
      dieEnable(ref, false);
      ref.say('You roll…');
      dieRoll(sc, ref, RM, die, function () {
        movable = calcMovable('you', die);
        if (!movable.length) {
          ref.say('You rolled ' + die + ' — nothing can move (the last step needs the exact number). Gattu’s turn.', 'warm');
          sc.later(function () { if (mode === 'play') gattuTurn(); }, 1100);
          return;
        }
        if (movable.length === 1) {
          ref.say('You rolled ' + die + ' — only one token can go.');
          sc.later(function () { if (mode === 'play') moveTok('you', movable[0]); }, 450);
          return;
        }
        phase = 'choose';
        sel = 0;
        paint();
        ref.say('You rolled ' + die + ' — pick a glowing token: tap it, or arrows then Enter.');
      });
    }

    function confirmSel() {
      if (phase !== 'choose') return;
      var ti = movable[sel];
      phase = 'busy';
      paint();
      moveTok('you', ti);
    }
    function cycleSel(dir) {
      if (phase !== 'choose') return;
      sel = (sel + dir + movable.length) % movable.length;
      paint();
      var ti = movable[sel];
      ref.say('You rolled ' + die + ' — token ' + (ti + 1) + ', ' + describe('you', ti) + '. Enter moves it.');
    }

    /* Tokens walk the ring cell by cell rather than teleporting. */
    function moveTok(side, ti) {
      phase = 'busy';
      yourMove = side === 'you';
      var p = T[side][ti], steps = [], s;
      if (p === -1) steps = [0];
      else for (s = p + 1; s <= p + die; s++) steps.push(s);
      if (RM) {
        T[side][ti] = steps[steps.length - 1];
        paint();
        sc.later(function () { resolve(side, ti); }, 80);
        return;
      }
      var i = 0;
      (function step() {
        if (sc.dead || detached(host)) { sc.kill(); return; }
        T[side][ti] = steps[i];
        paint();
        i++;
        if (i < steps.length) sc.later(step, 165);
        else sc.later(function () { resolve(side, ti); }, 400);
      })();
    }

    /* A capture rides home on a long smooth glide — the beat is visible. */
    function sendHome(side, ti) {
      var el = null, els = tokEls(), i;
      for (i = 0; i < els.length; i++) {
        if (els[i].getAttribute('data-side') === side && +els[i].getAttribute('data-i') === ti) { el = els[i]; break; }
      }
      T[side][ti] = -1;
      if (el && !RM) {
        el.setAttribute('class', el.getAttribute('class') + ' ride');
        paint();
        sc.later(function () {
          if (el) el.setAttribute('class', el.getAttribute('class').replace(' ride', ''));
        }, 800);
      } else {
        paint();
      }
    }

    function resolve(side, ti) {
      if (mode !== 'play') return;
      var who = side === 'you' ? playerName() : 'Gattu';
      var p = T[side][ti];
      var opp = side === 'you' ? 'gattu' : 'you';
      var caught = 0;
      /* a landing on the open ring sends the other side's tokens home —
         unless the cell is one of the 8 safe stars */
      if (p >= 0 && p <= 50) {
        var idx = ringIdx(side, p);
        if (!L_SAFE[idx]) {
          for (var i = 0; i < 4; i++) {
            var q = T[opp][i];
            if (q >= 0 && q <= 50 && ringIdx(opp, q) === idx) { sendHome(opp, i); caught++; }
          }
        }
      }
      if (caught) {
        ref.say(side === 'you'
          ? 'Caught! Gattu’s token rides back to its yard. ' + one(CHEERS)
          : 'Oh! Gattu caught your token — back to the yard, it will come round again.',
          side === 'you' ? 'good' : 'warm');
      } else if (p === L_HOME_P) {
        ref.say(who + ' brought a token home! ' + (side === 'you' ? one(CHEERS) : ''), side === 'you' ? 'good' : 'warm');
      }
      if (homeCount(side) === 4) { finishScreen(side === 'you'); return; }
      var delay = caught || p === L_HOME_P ? 1000 : 420;
      if (die === 6 && sixes < 2) {
        /* a six rolls again — but three sixes in a row is the lot */
        sixes++;
        sc.later(function () {
          if (mode !== 'play') return;
          if (side === 'you') {
            phase = 'roll';
            paint();
            ref.say('A six — roll again!', 'good');
          } else {
            ref.say('Gattu rolled a six — he goes again.', 'warm');
            sc.later(gattuRoll, 700);
          }
        }, delay);
        return;
      }
      if (die === 6) {
        ref.say(side === 'you' ? 'Three sixes — that’s the lot!' : 'Three sixes for Gattu — done.', 'warm');
      }
      sc.later(function () {
        if (mode !== 'play') return;
        if (side === 'you') gattuTurn();
        else {
          sixes = 0;
          phase = 'roll';
          paint();
          ref.say('Your turn — Space rolls.');
        }
      }, delay);
    }

    /* ---- Gattu's turn: same fair die, simple honest preferences ---- */
    function gattuTurn() {
      sixes = 0;
      phase = 'busy';
      yourMove = false;
      paint();
      ref.say('Gattu’s turn…', 'warm');
      sc.later(gattuRoll, 650);
    }
    function gattuRoll() {
      if (mode !== 'play' || sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      die = rollDie();
      yourMove = false;
      dieRoll(sc, ref, RM, die, function () {
        var m = calcMovable('gattu', die);
        if (!m.length) {
          ref.say('Gattu rolled ' + die + ' — no move. Your turn.', 'warm');
          sc.later(function () {
            if (mode !== 'play') return;
            sixes = 0; phase = 'roll'; paint();
            ref.say('Your turn — Space rolls.');
          }, 900);
          return;
        }
        /* prefer capture > release-on-6 > advance the furthest token */
        var best = m[0], bestScore = -1, i;
        for (i = 0; i < m.length; i++) {
          var ti = m[i], p = T.gattu[ti], s;
          if (p === -1) s = 200;
          else {
            var np = p + die;
            s = p;
            if (np <= 50 && !L_SAFE[ringIdx('gattu', np)]) {
              for (var j = 0; j < 4; j++) {
                var q = T.you[j];
                if (q >= 0 && q <= 50 && ringIdx('you', q) === ringIdx('gattu', np)) s = 400;
              }
            }
          }
          if (s > bestScore) { bestScore = s; best = ti; }
        }
        ref.say('Gattu rolled ' + die + ' — moving…', 'warm');
        sc.later(function () { if (mode === 'play') moveTok('gattu', best); }, 480);
      });
    }

    function finishScreen(win) {
      mode = 'over';
      phase = 'idle';
      winFlag = win;
      ref.wrap.classList.remove('playing');
      ref.say('');
      var home = homeCount('you');
      ref.stage.innerHTML = doneHTML(
        win ? 'All four home! ' + one(CHEERS) : 'Gattu’s four got home first',
        win ? 'A clean run round the ring — Gattu bows and fans you with his ears.'
            : 'You brought ' + home + ' token' + (home === 1 ? '' : 's') + ' home — the ring will turn your way next time.',
        [[String(home * 13), 'points'], [String(win ? 4 : 1), 'kauris']]
      );
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="out"]')); }, 60);
    }

    function reset() {
      T = { you: [-1, -1, -1, -1], gattu: [-1, -1, -1, -1] };
      die = 0; sixes = 0; movable = []; sel = 0;
      renderPlay();
    }

    function showIntro() {
      mode = 'intro';
      ref.wrap.classList.remove('playing');
      ref.stage.innerHTML = introHTML(
        'Ludo is <b>Pachisi</b> in a British suit — families across India were racing tokens round ' +
        'the cross-and-circle board centuries before the boxed version sailed out.',
        'Roll a <b>6</b> to bring a token out, race all four round the ring and up your home path. ' +
        'Landing on Gattu sends him back — except on the eight starred squares.',
        'The last step home needs the exact number. A 6 always rolls again (three in a row is the lot).'
      );
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="start"]')); }, 60);
    }

    sc.on(ref.wrap, 'click', function (e) {
      var tok = e.target.closest ? e.target.closest('.arc-ltok') : null;
      if (tok && phase === 'choose' && tok.getAttribute('data-side') === 'you') {
        var ti = +tok.getAttribute('data-i');
        var at = movable.indexOf(ti);
        if (at >= 0) { sel = at; confirmSel(); }
        return;
      }
      var go = e.target.closest ? e.target.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'start') renderPlay();
      else if (what === 'roll') youRoll();
      else if (what === 'leave') leaveVia(function () { endGame(false); });
      else if (what === 'again') reset();
      else if (what === 'out') endGame(winFlag);
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (phase === 'choose') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
          e.preventDefault(); cycleSel(1); return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
          e.preventDefault(); cycleSel(-1); return;
        }
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault(); confirmSel(); return;
        }
        return;
      }
      var onBtn = e.target && e.target.closest && e.target.closest('button');
      if (onBtn) return;
      /* while playing, no game key may scroll the page out from under the board */
      var gameKey = e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter' ||
                    e.key.indexOf('Arrow') === 0;
      if (mode === 'play' && gameKey) e.preventDefault();
      if (e.key !== ' ' && e.key !== 'Enter' && e.key !== 'Spacebar') return;
      if (mode === 'intro') { e.preventDefault(); renderPlay(); return; }
      if (mode === 'over') { e.preventDefault(); endGame(winFlag); return; }
      if (mode === 'play' && phase === 'roll') {
        youRoll();
      }
    });

    showIntro();
    return teardownOf(sc, function () { finished = true; });
  }

  /* ==================================================================
     COVER SCENES — self-animating 48×48 SVG for the arcade shelf.
     The icon acts out its game: on Saap-Sidi a die tumbles up the ladder
     while the snake sways; on Ludo a token hops cell by cell across the
     cross. Motion lives inside the SVG (inline animations, keyframes in
     the injected CSS above), and .arc-anim goes still under
     prefers-reduced-motion.
     ================================================================== */

  var SS_SCENE =
    '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M15 43 21 7"/><path d="M23 43 29 7"/>' +
      '<path d="M17 35h8"/><path d="M18.4 27h8"/><path d="M19.8 19h8"/><path d="M21.2 11h8"/>' +
      '<g class="arc-anim" style="animation:arc-sway 1.6s ease-in-out infinite alternate">' +
        '<path d="M35 8c7 4-2 10 4 15 5 4 1 10-4 12"/>' +
        '<circle cx="35" cy="8" r="2.6" fill="#fff" stroke="none"/>' +
      '</g>' +
      '<g class="arc-anim" style="animation:arc-climb 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center">' +
        '<rect x="6" y="33" width="9" height="9" rx="2"/>' +
        '<circle cx="10.5" cy="37.5" r="1.1" fill="#fff" stroke="none"/>' +
      '</g>' +
    '</svg>';

  var LUDO_SCENE =
    '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M18 4h12v14h14v12H30v14H18V30H4V18h14Z"/>' +
      '<path d="M24 18v-4"/><path d="M18 24h-4"/><path d="M30 24h4"/><path d="M24 30v4"/>' +
      '<circle class="arc-anim" style="animation:arc-hop 2.6s ease-in-out infinite" cx="6" cy="24" r="3.2"/>' +
      '<g class="arc-anim" style="animation:arc-spin 5s linear infinite;transform-box:fill-box;transform-origin:center">' +
        '<rect x="20" y="20" width="8" height="8" rx="1.8"/>' +
        '<circle cx="24" cy="24" r="1" fill="#fff" stroke="none"/>' +
      '</g>' +
    '</svg>';

  /* ==================================================================
     REGISTRY — push, never replace: games.js owns the array.
     ================================================================== */

  W.IND_GAMES.push(
    { id: 'saapsidi', name: 'Saap-Sidi', icon: 'game', minutes: 5, tag: 'Board',
      c: '#149a6d', c2: '#e8912d',
      blurb: 'The board that began as Gyan Chaupar: every ladder a virtue, every snake a little slip. Race Gattu to 100.',
      scene: SS_SCENE,
      engine: saapsidi },
    { id: 'ludo', name: 'Ludo', icon: 'game', minutes: 8, tag: 'Race',
      c: '#3b6fd4', c2: '#d94f3d',
      blurb: 'Pachisi in a British suit — the cross-and-circle race is centuries older than the box. Four tokens home before Gattu.',
      scene: LUDO_SCENE,
      engine: ludo }
  );

  injectCSS();
})();
