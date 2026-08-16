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

   House rules honoured throughout:
     · EVERY game plays fully with keyboard AND with touch/mouse.
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
     ================================================================== */

  var CSS = [
    '.arc-wrap{display:flex;flex-direction:column;gap:var(--space-lg);color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    '.arc-hud{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-lg);flex-wrap:wrap}',
    '.arc-hud b{display:block;font:800 19px/1.15 var(--display,Georgia,serif);letter-spacing:-.01em}',
    '.arc-kicker{display:block;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}',
    '.arc-stage{background:var(--bg2);border:1px solid var(--line);border-radius:var(--radius-lg);padding:var(--space-lg);position:relative;overflow:hidden}',
    '.arc-stage:before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent3),var(--accent2));opacity:.5}',
    '.arc-feed{min-height:22px;margin:0;text-align:center;font-size:14.5px;font-weight:600;color:var(--muted)}',
    '.arc-feed.good{color:var(--good)}',
    '.arc-feed.warm{color:var(--accent2)}',
    '.arc-hint{font-size:12.5px;color:var(--muted);text-align:center;margin:10px 0 0}',
    '.arc-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:12px}',
    '.arc-btn{cursor:pointer;min-height:46px;padding:11px 22px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:var(--bg2);font:700 15px var(--body,inherit)}',
    '.arc-btn.ghost{background:transparent;color:var(--text);border-color:var(--line)}',
    '.arc-btn:hover:not(:disabled){filter:brightness(1.06)}',
    '.arc-btn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.arc-btn:disabled{opacity:.5;cursor:default}',

    /* intro & finish cards */
    '.arc-intro{text-align:center;max-width:520px;margin:0 auto}',
    '.arc-intro h3{font:800 22px var(--display,Georgia,serif);margin:4px 0 8px}',
    '.arc-intro p{margin:0 0 8px;font-size:15px;line-height:1.6;color:var(--text)}',
    '.arc-intro .arc-heritage{color:var(--muted);font-size:14px;font-style:italic}',
    '.arc-art{display:flex;justify-content:center;margin:2px auto 8px}',
    '.arc-art img,.arc-art svg{display:block;width:92px;height:92px;border-radius:20px}',
    '.arc-done{text-align:center}',
    '.arc-done h3{font:800 24px var(--display,Georgia,serif);margin:6px 0 4px}',
    '.arc-done p{margin:0 0 4px;font-size:15.5px;line-height:1.55;color:var(--muted)}',
    '.arc-tally{display:inline-flex;gap:14px;flex-wrap:wrap;justify-content:center;margin:12px 0 2px}',
    '.arc-chip{background:var(--surface2);border:1px solid var(--line);border-radius:999px;padding:7px 16px;font:700 14px var(--body,inherit)}',
    '.arc-chip b{color:var(--accent2);font-size:17px}',

    /* shared game HUD: player chips + a die */
    '.arc-players{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;margin:0 0 10px}',
    '.arc-pl{display:inline-flex;gap:7px;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:5px 13px;font:700 13.5px var(--body,inherit)}',
    '.arc-pl .swatch{width:13px;height:13px;border-radius:50%;flex:none}',
    '.arc-pl.you .swatch{background:var(--accent)}',
    '.arc-pl.gattu .swatch{background:var(--accent2)}',
    '.arc-pl.now{border-color:var(--accent);box-shadow:0 0 0 3px var(--surface2)}',
    '.arc-die{width:42px;height:42px;border-radius:11px;background:var(--surface);border:1px solid var(--line);display:grid;place-items:center;font-size:30px;line-height:1;color:var(--text);user-select:none}',

    /* -------- Saap-Sidi board -------- */
    '.arc-sswrap{position:relative;width:min(100%,420px);margin:0 auto;border:1px solid var(--line);border-radius:var(--radius-md);overflow:hidden}',
    '.arc-ssgrid{display:grid;grid-template-columns:repeat(10,1fr)}',
    '.arc-sscell{aspect-ratio:1/1;background:var(--surface);display:flex;align-items:flex-start;justify-content:flex-start;padding:2px 0 0 3px;font:600 8.5px/1 var(--body,inherit);color:var(--muted)}',
    '.arc-sscell.alt{background:var(--surface2)}',
    '.arc-sscell.lad{box-shadow:inset 0 0 0 2px var(--good)}',
    '.arc-sscell.snk{box-shadow:inset 0 0 0 2px var(--accent3)}',
    '.arc-ssoverlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}',
    '.arc-ssoverlay .lad{stroke:var(--good);stroke-width:1.1;fill:none;stroke-linecap:round;opacity:.85}',
    '.arc-ssoverlay .snkb{stroke:var(--accent3);stroke-width:1.6;fill:none;stroke-linecap:round;opacity:.8}',
    '.arc-ssoverlay .snkh{fill:var(--accent3);opacity:.9}',
    '.arc-ssoverlay .snke{fill:var(--surface)}',
    '.arc-tok{position:absolute;width:6.5%;aspect-ratio:1/1;border-radius:50%;transform:translate(-50%,-50%);',
    'transition:left .13s linear,top .13s linear;box-shadow:0 1px 4px rgba(0,0,0,.28);pointer-events:none;z-index:3}',
    '.arc-tok.you{background:var(--accent);border:2px solid var(--bg2)}',
    '.arc-tok.gattu{background:var(--accent2);border:2px solid var(--bg2);overflow:hidden}',
    '.arc-tok.gattu img{width:100%;height:100%;object-fit:cover;display:block}',

    /* -------- Ludo board -------- */
    '.arc-lwrap{width:min(100%,420px);margin:0 auto}',
    '.arc-lsvg{display:block;width:100%;height:auto}',
    '.arc-ltok{transition:transform .3s ease;cursor:default}',
    '.arc-ltok .hit{pointer-events:all}',
    '.arc-ltok .dot{stroke:var(--bg2);stroke-width:.08}',
    '.arc-ltok.you .dot{fill:var(--accent)}',
    '.arc-ltok.gattu .dot{fill:var(--accent2)}',
    '.arc-ltok .ring{fill:none;stroke:var(--accent3);stroke-width:.09;opacity:0}',
    '.arc-ltok.live{cursor:pointer}',
    '.arc-ltok.live .ring{opacity:.6;animation:arc-pulse 1s ease-in-out infinite alternate}',
    '.arc-ltok.sel .ring{opacity:1;stroke-width:.15;animation:none}',

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
  var DIE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  /* The child's profile lives at window.BI.S — but games must not assume the
     shell exists (a bare host is a legal way to mount an engine). */
  function profile() {
    try { return (W.BI && W.BI.S) || {}; } catch (e) { return {}; }
  }
  function playerName() {
    var n = profile().name;
    return (typeof n === 'string' && n.trim()) ? n.trim() : 'You';
  }

  /* Gattu the mascot: raster art when the manifest has him, inline SVG
     mascot as fallback, nothing when standalone. */
  function gattuSrc() {
    try { return (W.IND_ART_SRC && W.IND_ART_SRC('gattu')) || ''; } catch (e) { return ''; }
  }
  function gattuHTML(size) {
    var src = gattuSrc();
    if (src) return '<img src="' + esc(src) + '" width="' + (size || 92) + '" height="' + (size || 92) + '" alt="">';
    if (W.GATTU) {
      var g = W.GATTU('happy');
      if (g) return g.replace('<svg ', '<svg width="' + (size || 92) + '" height="' + (size || 92) + '" ');
    }
    return '';
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

  /* Shared chrome: title bar + stage + polite live region, mirroring the
     mela shell so the two shelves feel like one carnival. */
  function frame(host, title, kicker) {
    injectCSS();
    host.innerHTML =
      '<div class="arc-wrap">' +
        '<div class="arc-hud">' +
          '<div><span class="arc-kicker">' + esc(kicker) + '</span><b>' + esc(title) + '</b></div>' +
        '</div>' +
        '<div class="arc-stage"></div>' +
        '<p class="arc-feed" role="status" aria-live="polite"></p>' +
      '</div>';
    var ref = {
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

  function introHTML(heritage, how1, how2) {
    return '<div class="arc-intro">' +
      '<div class="arc-art">' + gattuHTML(92) + '</div>' +
      '<p>' + how1 + '</p><p>' + how2 + '</p>' +
      '<p class="arc-heritage">' + heritage + '</p>' +
      '<div class="arc-row">' +
        '<button type="button" class="arc-btn" data-go="start">Play</button>' +
        '<button type="button" class="arc-btn ghost" data-go="leave">Back to the Mela</button>' +
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
     a grin — no scolding, ever. */
  var SS_SNAKES = [
    { head: 27, tail: 9,  name: 'Krodh',   gloss: 'a stomp of temper — deep breath, little slide, on we go' },
    { head: 43, tail: 18, name: 'Jhooth',  gloss: 'a fib — it slips you back a bit, no harm done' },
    { head: 56, tail: 37, name: 'Lalach',  gloss: 'grabbing more — and dropping the lot, wheee' },
    { head: 75, tail: 32, name: 'Aalas',   gloss: 'couldn’t be bothered — the board slid for you instead' },
    { head: 96, tail: 65, name: 'Ghamand', gloss: 'showing off — it wobbles the ladder, down and onward' }
  ];

  /* Square 1 sits bottom-left; each row snakes back the other way
     (boustrophedon), so 100 lands top-left. */
  function ssRC(sq) {
    var i = sq - 1, br = Math.floor(i / 10), c = i % 10;
    if (br % 2 === 1) c = 9 - c;
    return { row: 9 - br, col: c };
  }
  function ssXY(sq) {
    var rc = ssRC(sq);
    return { x: (rc.col + 0.5) * 10, y: (rc.row + 0.5) * 10 };
  }
  function r2(n) { return Math.round(n * 100) / 100; }

  function ssLadderPath(foot, top) {
    var A = ssXY(foot), B = ssXY(top);
    var dx = B.x - A.x, dy = B.y - A.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / L * 1.5, ny = dx / L * 1.5;
    /* two rails and evenly spaced rungs — clean geometry, not clip-art */
    var d = 'M' + r2(A.x + nx) + ' ' + r2(A.y + ny) + 'L' + r2(B.x + nx) + ' ' + r2(B.y + ny) +
            'M' + r2(A.x - nx) + ' ' + r2(A.y - ny) + 'L' + r2(B.x - nx) + ' ' + r2(B.y - ny);
    var n = Math.max(3, Math.round(L / 6));
    for (var i = 1; i < n; i++) {
      var t = i / n, px = A.x + dx * t, py = A.y + dy * t;
      d += 'M' + r2(px + nx) + ' ' + r2(py + ny) + 'L' + r2(px - nx) + ' ' + r2(py - ny);
    }
    return '<path class="lad" d="' + d + '"/>';
  }
  function ssSnakePath(head, tail) {
    var A = ssXY(head), B = ssXY(tail);
    var dx = B.x - A.x, dy = B.y - A.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / L, ny = dx / L, w = Math.max(3.5, Math.min(8, L / 4));
    var c1x = A.x + dx * 0.3 + nx * w, c1y = A.y + dy * 0.3 + ny * w;
    var c2x = A.x + dx * 0.7 - nx * w, c2y = A.y + dy * 0.7 - ny * w;
    /* a single S-curve body plus a small round head with two eye dots */
    return '<path class="snkb" d="M' + r2(A.x) + ' ' + r2(A.y) +
      'C' + r2(c1x) + ' ' + r2(c1y) + ' ' + r2(c2x) + ' ' + r2(c2y) + ' ' + r2(B.x) + ' ' + r2(B.y) + '"/>' +
      '<circle class="snkh" cx="' + r2(A.x) + '" cy="' + r2(A.y) + '" r="2.3"/>' +
      '<circle class="snke" cx="' + r2(A.x - 0.8) + '" cy="' + r2(A.y - 0.6) + '" r="0.45"/>' +
      '<circle class="snke" cx="' + r2(A.x + 0.8) + '" cy="' + r2(A.y - 0.6) + '" r="0.45"/>';
  }

  function saapsidi(host, opts, done) {
    var sc = scope();
    var RM = reducedMotion();
    var ref = frame(host, 'Saap-Sidi', 'Mela · Gyan Chaupar, the original board');
    var mode = 'intro';                 /* intro | play | over */
    var phase = 'idle';                 /* roll (yours) | busy */
    var pos = { you: 1, gattu: 1 };
    var moved = 0;                      /* squares the child's token walked — the score */
    var finished = false;

    var ladAt = {}, snkAt = {}, i;
    for (i = 0; i < SS_LADDERS.length; i++) ladAt[SS_LADDERS[i].foot] = SS_LADDERS[i];
    for (i = 0; i < SS_SNAKES.length; i++) snkAt[SS_SNAKES[i].head] = SS_SNAKES[i];

    function endGame(win) {
      if (finished) return;
      finished = true;
      sc.kill();
      if (typeof done === 'function') done({ win: !!win, score: moved, kauris: win ? 3 : 1 });
    }

    function boardHTML() {
      var cells = '', dr, c;
      for (dr = 0; dr < 10; dr++) {
        var br = 9 - dr;
        for (c = 0; c < 10; c++) {
          var sq = br * 10 + (br % 2 === 0 ? c + 1 : 10 - c);
          var cls = 'arc-sscell' + (((dr + c) % 2) ? ' alt' : '') +
                    (ladAt[sq] ? ' lad' : '') + (snkAt[sq] ? ' snk' : '');
          cells += '<div class="' + cls + '">' + sq + '</div>';
        }
      }
      var art = '', k;
      for (k = 0; k < SS_LADDERS.length; k++) art += ssLadderPath(SS_LADDERS[k].foot, SS_LADDERS[k].top);
      for (k = 0; k < SS_SNAKES.length; k++) art += ssSnakePath(SS_SNAKES[k].head, SS_SNAKES[k].tail);
      var gimg = gattuSrc();
      return '<div class="arc-sswrap">' +
        '<div class="arc-ssgrid" aria-hidden="true">' + cells + '</div>' +
        '<svg class="arc-ssoverlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + art + '</svg>' +
        '<div class="arc-tok you" data-tok="you" aria-hidden="true"></div>' +
        '<div class="arc-tok gattu" data-tok="gattu" aria-hidden="true">' +
          (gimg ? '<img src="' + esc(gimg) + '" alt="">' : '') + '</div>' +
      '</div>';
    }

    function renderPlay() {
      mode = 'play';
      ref.stage.innerHTML =
        '<div class="arc-players">' +
          '<span class="arc-pl you now" data-pl="you"><span class="swatch"></span><span data-t>' + esc(playerName()) + ' · 1</span></span>' +
          '<span class="arc-die" data-die aria-hidden="true">⚀</span>' +
          '<span class="arc-pl gattu" data-pl="gattu"><span class="swatch"></span><span data-t>Gattu · 1</span></span>' +
        '</div>' +
        boardHTML() +
        '<div class="arc-row">' +
          '<button type="button" class="arc-btn" data-go="roll">Roll the die</button>' +
          '<button type="button" class="arc-btn ghost" data-go="leave">Leave</button>' +
        '</div>' +
        '<p class="arc-hint">Space or Enter rolls, too. Land on a green square and a virtue lifts you; ' +
        'a marked red square is a little slip. Roll past 100 and you bounce back off the top.</p>';
      place();
      phase = 'roll';
      ref.say('Your roll first — shabaash pehle aap!');
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="roll"]')); }, 60);
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
        var xy = ssXY(pos[side]);
        var dx = same ? (side === 'you' ? -1.9 : 1.9) : 0;
        var dy = same ? (side === 'you' ? -1.2 : 1.2) : 0;
        el.style.left = (xy.x + dx) + '%';
        el.style.top = (xy.y + dy) + '%';
      }
      var yc = ref.stage.querySelector('[data-pl="you"] [data-t]');
      var gc = ref.stage.querySelector('[data-pl="gattu"] [data-t]');
      if (yc) yc.textContent = playerName() + ' · ' + pos.you;
      if (gc) gc.textContent = 'Gattu · ' + pos.gattu;
      var yp = ref.stage.querySelector('[data-pl="you"]');
      var gp = ref.stage.querySelector('[data-pl="gattu"]');
      if (yp) yp.className = 'arc-pl you' + (phase === 'roll' || turnIsYou ? ' now' : '');
      if (gp) gp.className = 'arc-pl gattu' + (!turnIsYou && mode === 'play' ? ' now' : '');
    }
    var turnIsYou = true;

    function setRollEnabled(on) {
      var b = ref.stage.querySelector('[data-go="roll"]');
      if (b) b.disabled = !on;
    }
    function showDie(v) {
      var el = ref.stage.querySelector('[data-die]');
      if (el) el.textContent = DIE_FACES[v] || '';
    }

    /* The token walks square by square; under prefers-reduced-motion it
       simply appears at the end of the path. */
    function walk(side, path, then) {
      if (!path.length) { then(); return; }
      if (RM) {
        pos[side] = path[path.length - 1];
        place();
        sc.later(then, 80);
        return;
      }
      var i = 0;
      (function step() {
        if (sc.dead || detached(host)) { sc.kill(); return; }
        pos[side] = path[i];
        place();
        i++;
        if (i < path.length) sc.later(step, 130);
        else sc.later(then, 160);
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
      el.style.transition = 'left .7s ease, top .7s ease';
      pos[side] = sq; place();
      sc.later(function () { if (el) el.style.transition = ''; then(); }, 760);
    }

    function takeTurn(side) {
      phase = 'busy';
      turnIsYou = side === 'you';
      place();
      var v = rollDie();
      showDie(v);
      var cur = pos[side], path = [], sq;
      var bounced = cur + v > 100;
      if (!bounced) {
        for (sq = cur + 1; sq <= cur + v; sq++) path.push(sq);
      } else {
        for (sq = cur + 1; sq <= 100; sq++) path.push(sq);
        for (sq = 99; sq >= 200 - cur - v; sq--) path.push(sq);
      }
      if (side === 'you') moved += path.length;
      var who = side === 'you' ? 'You' : 'Gattu';
      var landing = path[path.length - 1];
      ref.say(who + ' rolled ' + v + (bounced ? ' — bounced off 100, back to ' + landing + '.' : ' — square ' + landing + '.'),
              side === 'you' ? '' : 'warm');
      walk(side, path, function () { settle(side, landing); });
    }

    function settle(side, sq) {
      var who = side === 'you' ? 'You' : 'Gattu';
      if (ladAt[sq]) {
        var l = ladAt[sq];
        ref.say(l.name + ' — ' + l.gloss + '. A ladder! ' + who + ' climb' + (side === 'you' ? '' : 's') + ' ' + sq + ' → ' + l.top + '.', 'good');
        sc.later(function () { glide(side, l.top, function () { after(side, l.top); }); }, 500);
        return;
      }
      if (snkAt[sq]) {
        var s = snkAt[sq];
        ref.say(s.name + ' — ' + s.gloss + '. A slide, ' + sq + ' → ' + s.tail + ' — smile, onwards!', 'warm');
        sc.later(function () { glide(side, s.tail, function () { after(side, s.tail); }); }, 500);
        return;
      }
      after(side, sq);
    }

    function after(side, sq) {
      if (sq === 100) { finishScreen(side === 'you'); return; }
      if (side === 'you') {
        sc.later(function () { if (mode === 'play') takeTurn('gattu'); }, 800);
      } else {
        sc.later(function () {
          if (mode !== 'play') return;
          phase = 'roll';
          turnIsYou = true;
          place();
          setRollEnabled(true);
          ref.say('Your roll.');
        }, 550);
      }
    }

    function finishScreen(win) {
      mode = 'over';
      phase = 'idle';
      ref.say('');
      ref.stage.innerHTML = doneHTML(
        win ? one(CHEERS) : 'Gattu got there first',
        win ? 'Square 100! The ladders liked you today — every one of them was a virtue with a name.'
            : 'The snakes were hungry today. No matter — every ladder is still exactly where it was.',
        [[String(moved), 'squares walked'], [String(win ? 3 : 1), 'kauris']]
      );
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="out"]')); }, 60);
      /* done fires when the child taps out — same rhythm as the mela games */
      winFlag = win;
    }
    var winFlag = false;

    function reset() {
      pos = { you: 1, gattu: 1 };
      moved = 0;
      turnIsYou = true;
      renderPlay();
    }

    function showIntro() {
      mode = 'intro';
      ref.stage.innerHTML = introHTML(
        'This game is Indian: it began centuries ago as <b>Gyan Chaupar</b> — Moksha Patam — ' +
        'where the ladders were virtues and the snakes were slips. “Snakes and Ladders” is the export.',
        'Roll the die and race Gattu to square <b>100</b>. Ladders lift you, snakes slide you back — with a smile.',
        'Roll more than you need and you bounce back off 100.'
      );
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="start"]')); }, 60);
    }

    sc.on(ref.stage, 'click', function (e) {
      var go = e.target.closest ? e.target.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'start') renderPlay();
      else if (what === 'roll') { if (phase === 'roll') { setRollEnabled(false); takeTurn('you'); } }
      else if (what === 'leave') leaveVia(function () { endGame(false); });
      else if (what === 'again') reset();
      else if (what === 'out') endGame(winFlag);
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key !== ' ' && e.key !== 'Enter' && e.key !== 'Spacebar') return;
      /* A focused button already handles its own Enter/Space click; this
         catch-all only fires when focus is elsewhere, so the promise in the
         hint — Enter starts, Space rolls — holds wherever focus wandered. */
      var onBtn = e.target && e.target.closest && e.target.closest('button');
      if (onBtn) return;
      if (mode === 'intro') { e.preventDefault(); renderPlay(); return; }
      if (mode === 'play' && phase === 'roll') {
        e.preventDefault();
        setRollEnabled(false);
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
     home column and the 8 standard safe stars.

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

  function lStar(cx, cy, r) {
    /* a soft four-point star drawn with quadratics — reads at any size */
    return 'M' + r2(cx) + ' ' + r2(cy - r) +
      'Q' + r2(cx) + ' ' + r2(cy) + ' ' + r2(cx + r) + ' ' + r2(cy) +
      'Q' + r2(cx) + ' ' + r2(cy) + ' ' + r2(cx) + ' ' + r2(cy + r) +
      'Q' + r2(cx) + ' ' + r2(cy) + ' ' + r2(cx - r) + ' ' + r2(cy) +
      'Q' + r2(cx) + ' ' + r2(cy) + ' ' + r2(cx) + ' ' + r2(cy - r) + 'Z';
  }

  function lBoardSVG() {
    var s = '<svg class="arc-lsvg" viewBox="0 0 15 15" role="img" aria-label="Ludo board — your tokens against Gattu’s">';
    s += '<rect x="0.1" y="0.1" width="14.8" height="14.8" rx="0.7" fill="var(--surface)" stroke="var(--line)" stroke-width="0.12"/>';
    var i, c;
    /* ring cells */
    for (i = 0; i < L_RING.length; i++) {
      c = L_RING[i];
      var tint = i === L_START.you ? 'var(--accent)' : i === L_START.gattu ? 'var(--accent2)' : 'none';
      s += '<rect x="' + c[0] + '" y="' + c[1] + '" width="1" height="1" fill="' +
           (tint === 'none' ? 'var(--surface)' : tint) + '"' +
           (tint !== 'none' ? ' fill-opacity="0.35"' : '') +
           ' stroke="var(--line)" stroke-width="0.05"/>';
    }
    /* home columns */
    var sides = ['you', 'gattu'], sd;
    for (sd = 0; sd < 2; sd++) {
      var col = L_HOMECOL[sides[sd]], tint2 = sd === 0 ? 'var(--accent)' : 'var(--accent2)';
      for (i = 0; i < col.length; i++) {
        s += '<rect x="' + col[i][0] + '" y="' + col[i][1] + '" width="1" height="1" fill="' + tint2 +
             '" fill-opacity="0.3" stroke="var(--line)" stroke-width="0.05"/>';
      }
    }
    /* yards */
    s += '<rect x="0.4" y="0.4" width="5.2" height="5.2" rx="0.6" fill="var(--accent)" fill-opacity="0.16" stroke="var(--accent)" stroke-opacity="0.4" stroke-width="0.1"/>';
    s += '<rect x="9.4" y="9.4" width="5.2" height="5.2" rx="0.6" fill="var(--accent2)" fill-opacity="0.16" stroke="var(--accent2)" stroke-opacity="0.4" stroke-width="0.1"/>';
    /* the other two corners stay quiet — a two-player table, honestly laid */
    s += '<rect x="9.4" y="0.4" width="5.2" height="5.2" rx="0.6" fill="var(--surface2)" stroke="var(--line)" stroke-width="0.08"/>';
    s += '<rect x="0.4" y="9.4" width="5.2" height="5.2" rx="0.6" fill="var(--surface2)" stroke="var(--line)" stroke-width="0.08"/>';
    for (sd = 0; sd < 2; sd++) {
      var slots = L_YARD[sides[sd]], sc2 = sd === 0 ? 'var(--accent)' : 'var(--accent2)';
      for (i = 0; i < slots.length; i++) {
        s += '<circle cx="' + slots[i][0] + '" cy="' + slots[i][1] + '" r="0.55" fill="var(--surface)" stroke="' + sc2 + '" stroke-width="0.09"/>';
      }
    }
    /* centre: each player's triangle points home */
    s += '<polygon points="6,6 6,9 7.5,7.5" fill="var(--accent)" fill-opacity="0.6"/>';
    s += '<polygon points="9,6 9,9 7.5,7.5" fill="var(--accent2)" fill-opacity="0.6"/>';
    s += '<polygon points="6,6 9,6 7.5,7.5" fill="var(--surface2)"/>';
    s += '<polygon points="6,9 9,9 7.5,7.5" fill="var(--surface2)"/>';
    s += '<rect x="6" y="6" width="3" height="3" fill="none" stroke="var(--line)" stroke-width="0.07"/>';
    /* the 8 standard safe stars */
    for (var idx in L_SAFE) {
      if (!L_SAFE.hasOwnProperty(idx)) continue;
      c = L_RING[+idx];
      s += '<path d="' + lStar(c[0] + 0.5, c[1] + 0.5, 0.34) + '" fill="none" stroke="var(--muted)" stroke-width="0.07"/>';
    }
    /* tokens live in their own layer so a repaint never rebuilds the board */
    s += '<g data-toks>';
    var t;
    for (sd = 0; sd < 2; sd++) {
      for (t = 0; t < 4; t++) {
        s += '<g class="arc-ltok ' + sides[sd] + '" data-side="' + sides[sd] + '" data-i="' + t + '">' +
          '<circle class="hit" r="0.55" fill="transparent"/>' +
          '<circle class="ring" r="0.47"/>' +
          '<circle class="dot" r="0.34"/>' +
        '</g>';
      }
    }
    s += '</g></svg>';
    return s;
  }

  function ludo(host, opts, done) {
    var sc = scope();
    var RM = reducedMotion();
    var ref = frame(host, 'Ludo', 'Mela · Pachisi’s grandchild');
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
      return { x: 6.85 + ti * 0.45, y: side === 'you' ? 7.15 : 7.85 };
    }

    function renderPlay() {
      mode = 'play';
      ref.stage.innerHTML =
        '<div class="arc-players">' +
          '<span class="arc-pl you now" data-pl="you"><span class="swatch"></span><span data-t></span></span>' +
          '<span class="arc-die" data-die aria-hidden="true">⚀</span>' +
          '<span class="arc-pl gattu" data-pl="gattu"><span class="swatch"></span><span data-t></span></span>' +
        '</div>' +
        '<div class="arc-lwrap">' + lBoardSVG() + '</div>' +
        '<div class="arc-row">' +
          '<button type="button" class="arc-btn" data-go="roll">Roll the die</button>' +
          '<button type="button" class="arc-btn ghost" data-go="leave">Leave</button>' +
        '</div>' +
        '<p class="arc-hint">Space or Enter rolls. A 6 lets a token out and rolls again. When more than one ' +
        'token can move, tap a glowing one — or cycle with the arrow keys or Tab and press Enter.</p>';
      phase = 'roll';
      paint();
      ref.say('Your turn — roll for a six to come out of the yard.');
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="roll"]')); }, 60);
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
        var off = n > 1 ? (slot - (n - 1) / 2) * 0.3 : 0;
        el.style.transform = 'translate(' + r2(xy.x + off) + 'px,' + r2(xy.y) + 'px)';
        var live = phase === 'choose' && side === 'you' && movable.indexOf(ti) >= 0;
        el.setAttribute('class', 'arc-ltok ' + side + (live ? ' live' : '') +
          (live && movable[sel] === ti ? ' sel' : ''));
      }
      var yc = ref.stage.querySelector('[data-pl="you"] [data-t]');
      var gc = ref.stage.querySelector('[data-pl="gattu"] [data-t]');
      if (yc) yc.textContent = playerName() + ' · ' + homeCount('you') + ' home';
      if (gc) gc.textContent = 'Gattu · ' + homeCount('gattu') + ' home';
      var yp = ref.stage.querySelector('[data-pl="you"]');
      var gp = ref.stage.querySelector('[data-pl="gattu"]');
      var yourTurn = phase === 'roll' || phase === 'choose';
      if (yp) yp.className = 'arc-pl you' + (yourTurn ? ' now' : '');
      if (gp) gp.className = 'arc-pl gattu' + (!yourTurn && mode === 'play' ? ' now' : '');
      var b = ref.stage.querySelector('[data-go="roll"]');
      if (b) b.disabled = phase !== 'roll';
      var d = ref.stage.querySelector('[data-die]');
      if (d) d.textContent = DIE_FACES[die] || '⚀';
    }

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
      die = rollDie();
      paint();
      movable = calcMovable('you', die);
      if (!movable.length) {
        ref.say('You rolled ' + die + ' — nothing can move (the last step needs the exact number). Passing…', 'warm');
        sc.later(function () { if (mode === 'play') gattuTurn(); }, 1000);
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
      ref.say('You rolled ' + die + ' — ' + movable.length + ' tokens can move. Tap one, or arrows then Enter.');
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
      ref.say('Token ' + (ti + 1) + ', ' + describe('you', ti) + ' — Enter moves it.');
    }

    function moveTok(side, ti) {
      var p = T[side][ti];
      T[side][ti] = p === -1 ? 0 : p + die;
      paint();
      sc.later(function () { resolve(side, ti); }, RM ? 80 : 380);
    }

    function resolve(side, ti) {
      if (mode !== 'play') return;
      var who = side === 'you' ? 'You' : 'Gattu';
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
            if (q >= 0 && q <= 50 && ringIdx(opp, q) === idx) { T[opp][i] = -1; caught++; }
          }
        }
      }
      if (caught) {
        paint();
        ref.say(side === 'you'
          ? 'Caught! Gattu’s token trots back to its yard.'
          : 'Oh! Gattu caught your token — back to the yard, it will come round again.',
          side === 'you' ? 'good' : 'warm');
      } else if (p === L_HOME_P) {
        ref.say(who + ' brought a token home! ' + (side === 'you' ? one(CHEERS) : ''), side === 'you' ? 'good' : 'warm');
      }
      if (homeCount(side) === 4) { finishScreen(side === 'you'); return; }
      var delay = caught || p === L_HOME_P ? 900 : 420;
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
            sc.later(gattuRoll, 650);
          }
        }, delay);
        return;
      }
      if (die === 6) {
        ref.say((side === 'you' ? 'Three sixes — that’s the lot! ' : 'Three sixes for Gattu — done. ') + '', 'warm');
      }
      sc.later(function () {
        if (mode !== 'play') return;
        if (side === 'you') gattuTurn();
        else {
          sixes = 0;
          phase = 'roll';
          paint();
          ref.say('Your turn.');
        }
      }, delay);
    }

    /* ---- Gattu's turn: same fair die, simple honest preferences ---- */
    function gattuTurn() {
      sixes = 0;
      phase = 'busy';
      paint();
      sc.later(gattuRoll, 600);
    }
    function gattuRoll() {
      if (mode !== 'play' || sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      die = rollDie();
      paint();
      var m = calcMovable('gattu', die);
      if (!m.length) {
        ref.say('Gattu rolled ' + die + ' — no move. Your turn.', 'warm');
        sc.later(function () {
          if (mode !== 'play') return;
          sixes = 0; phase = 'roll'; paint();
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
      ref.say('Gattu rolled ' + die + '.', 'warm');
      sc.later(function () { if (mode === 'play') moveTok('gattu', best); }, 500);
    }

    function finishScreen(win) {
      mode = 'over';
      phase = 'idle';
      winFlag = win;
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
      ref.stage.innerHTML = introHTML(
        'Ludo is <b>Pachisi</b> in a British suit — families across India were racing tokens round ' +
        'the cross-and-circle board centuries before the boxed version sailed out.',
        'Roll a <b>6</b> to bring a token out, race all four round the ring and up your home path. ' +
        'Landing on Gattu sends him back — except on the eight starred squares.',
        'The last step home needs the exact number. A 6 always rolls again (three in a row is the lot).'
      );
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="start"]')); }, 60);
    }

    sc.on(ref.stage, 'click', function (e) {
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
      if (e.key !== ' ' && e.key !== 'Enter' && e.key !== 'Spacebar') return;
      var onBtn = e.target && e.target.closest && e.target.closest('button');
      if (onBtn) return;
      if (mode === 'intro') { e.preventDefault(); renderPlay(); return; }
      if (mode === 'play' && phase === 'roll') {
        e.preventDefault();
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
