/* Bizzing India — Mela game: CARROM.

   India's living-room board game, the one that comes out when the cousins visit.
   You play the white coins; Gattu plays black. The rules here are the family
   rules, simplified honestly for a child — see the intro card, which says so
   out loud rather than pretending to be tournament carrom.

   Contract (identical to games.js, which owns window.IND_GAMES — this file
   loads after it and pushes):
     { id, name, blurb, icon, minutes, engine(host, opts, done) }
     engine fills host, calls done({win, score, kauris}) exactly once, and
     returns a teardown that removes every listener and cancels every RAF/timer.
   Plus the cover extras the Mela cards use: tag, c/c2 gradient hexes, and a
   self-animating 48×48 scene SVG.

   House rules honoured:
     · Plays fully with keyboard AND touch/mouse. Three ways to slide the
       striker (drag it, the slider under the board, ←/→), each mirrored in
       the others, and the arrows work the moment the match starts — the key
       handler lives on the document and the canvas is focused on start, so
       no click-first is ever needed.
     · The board is sized to fit BOTH the width and the height that is really
       free under the app chrome, so the whole board plus its controls sit on
       one screen with no scrolling mid-game — phone or laptop.
     · prefers-reduced-motion skips the decorative pocket-drop animation, the
       aim chevron pulse and Gattu's slide-in tween — never the physics
       itself; the game IS motion.
     · No lives, no shaming. Gattu winning is "another game?", not a failure.

   Physics: fixed 120 Hz steps inside RAF, circle-circle elastic collisions with
   positional correction iterated 4× per step, wall restitution, linear friction
   to rest, a hard speed cap and a sleep threshold. At the capped speed a body
   moves 1 board-unit per step — well under a coin radius — so nothing can
   tunnel through a wall even at full power.

   Rendering: the static board (wood frame with grain, inlaid baselines and
   end circles, centre rosette, pocket wells, corner arrow decals) is painted
   once per resize into an offscreen layer at devicePixelRatio, then blitted
   every frame; only the coins, striker, aim line and power arc are live. */

(function () {
  'use strict';

  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document || null;
  if (!D) return;

  var TAU = Math.PI * 2;

  /* ==================================================================
     STYLE — injected once, everything scoped under .car-
     ================================================================== */

  var CSS = [
    '.car-wrap{position:relative;display:flex;flex-direction:column;gap:10px;color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    '.car-hud{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}',
    '.car-title{display:block;font:800 18px/1.1 var(--display,Georgia,serif);letter-spacing:-.01em}',
    '.car-kicker{display:block;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}',
    '.car-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}',
    '.car-chip{display:inline-flex;align-items:center;gap:6px;background:var(--card2);border:1px solid var(--line);border-radius:999px;padding:4px 10px;font:700 12.5px var(--body,inherit)}',
    '.car-dot{width:11px;height:11px;border-radius:50%;border:1px solid rgba(0,0,0,.35);display:inline-block;flex:none}',
    '.car-dot.w{background:radial-gradient(circle at 35% 30%,#fffbe9,#e3cd9d)}',
    '.car-dot.b{background:radial-gradient(circle at 35% 30%,#5a4634,#20150c)}',
    '.car-dot.q{background:radial-gradient(circle at 35% 30%,#e05a44,#8e1f14)}',
    '.car-stage{position:relative;align-self:center;line-height:0}',
    '.car-canvas{display:block;border-radius:14px;box-shadow:0 2px 6px rgba(40,20,5,.25),0 14px 34px rgba(40,20,5,.28);touch-action:none;cursor:crosshair;outline:none}',
    '.car-canvas:focus-visible{outline:2px solid var(--accent2,#e9a13b);outline-offset:3px}',
    /* the rules / result card covers the whole game column, not just the board,
       so it never has to scroll inside a small phone-sized square */
    '.car-over{position:absolute;inset:-4px;z-index:3;display:grid;place-items:center;background:rgba(26,14,5,.55);border-radius:16px;padding:12px;line-height:1.4;backdrop-filter:blur(2px)}',
    '.car-over[hidden]{display:none}',
    /* flex column with the list as the only scrollable part, so the Play /
       result buttons are always on screen even on a short phone */
    '.car-panel{display:flex;flex-direction:column;background:var(--card,#fff);border:1px solid var(--line);border-radius:var(--radius-lg,16px);box-shadow:var(--shadow-lg,0 12px 40px rgba(0,0,0,.2));padding:16px 18px;max-width:430px;max-height:100%;text-align:left}',
    '.car-panel h3{font:800 20px var(--display,Georgia,serif);margin:0 0 8px}',
    '.car-panel p{margin:0 0 8px;font-size:14px;line-height:1.5}',
    '.car-panel ul{margin:0 0 6px;padding-left:18px;font-size:13.5px;line-height:1.5;overflow:auto;min-height:0}',
    '.car-panel li{margin:0 0 5px}',
    '.car-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px;flex:none}',
    '.car-btn{cursor:pointer;min-height:44px;padding:10px 22px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:#fff;font:700 15px var(--body,inherit)}',
    '.car-btn.ghost{background:transparent;color:var(--text);border-color:var(--line2,var(--line))}',
    '.car-btn:hover{filter:brightness(1.06)}',
    '.car-btn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    /* the striker slider — the third, always-visible way to slide the striker.
       Track drawn as a wooden groove, thumb as a small striker. */
    '.car-ctl{display:flex;align-items:center;gap:8px;margin:0 auto;width:100%;max-width:560px}',
    '.car-arr{flex:none;font-size:12px;color:var(--muted);line-height:1;user-select:none}',
    '.car-slider{-webkit-appearance:none;appearance:none;flex:1;min-width:0;height:28px;margin:0;background:transparent;cursor:pointer}',
    '.car-slider::-webkit-slider-runnable-track{height:8px;border-radius:999px;background:linear-gradient(90deg,#c69d66,#ecd6a8 30%,#ecd6a8 70%,#c69d66);border:1px solid rgba(90,52,24,.5)}',
    '.car-slider::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fffdf2,#e7d2a4);border:2.5px solid var(--accent,#5b3fd6);margin-top:-9px;box-shadow:0 2px 5px rgba(40,20,5,.35)}',
    '.car-slider::-moz-range-track{height:8px;border-radius:999px;background:linear-gradient(90deg,#c69d66,#ecd6a8 30%,#ecd6a8 70%,#c69d66);border:1px solid rgba(90,52,24,.5)}',
    '.car-slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fffdf2,#e7d2a4);border:2.5px solid var(--accent,#5b3fd6);box-shadow:0 2px 5px rgba(40,20,5,.35)}',
    '.car-slider:disabled{opacity:.35;cursor:default}',
    '.car-slider:focus-visible{outline:3px solid var(--accent2);outline-offset:2px;border-radius:999px}',
    '.car-hint{font-size:12px;color:var(--muted);text-align:center;margin:0;line-height:1.45}',
    '.car-hint b{color:var(--text2,inherit);font-weight:700}',
    '.car-feed{min-height:19px;margin:0;text-align:center;font-size:13.5px;font-weight:600;color:var(--muted)}',
    '.car-feed.good{color:var(--good)}',
    '.car-feed.warm{color:var(--accent2)}',
    /* Phones: tighter chrome, so the height freed goes to the board itself. */
    '@media(max-width:480px){' +
      '.car-wrap{gap:8px}' +
      '.car-kicker{display:none}' +
      '.car-title{font-size:16px}' +
      '.car-chip{padding:3px 8px;font-size:11.5px;gap:5px}' +
      '.car-dot{width:10px;height:10px}' +
      '.car-hint{font-size:11px;line-height:1.35}' +
      '.car-feed{font-size:12.5px;min-height:17px}' +
      '.car-panel{padding:12px 14px}' +
      '.car-panel h3{font-size:17px}' +
      '.car-panel p{font-size:12.5px;margin:0 0 6px}' +
      '.car-panel ul{font-size:12.5px;line-height:1.45}' +
    '}',
    /* Decorative easing only — the canvas physics is untouched by this rule. */
    '@media(prefers-reduced-motion:reduce){.car-wrap *,.car-wrap *:before,.car-wrap *:after{animation:none!important;transition:none!important}}'
  ].join('');

  var cssDone = false;
  function injectCSS() {
    if (cssDone) return;
    cssDone = true;
    if (D.getElementById('car-css')) return;
    var s = D.createElement('style');
    s.id = 'car-css';
    s.appendChild(D.createTextNode(CSS));
    (D.head || D.documentElement).appendChild(s);
  }

  /* ==================================================================
     SMALL HELPERS — local copies; games.js keeps its own private.
     ================================================================== */

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function reducedMotion() {
    try { return !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }
  function focusSoft(el) {
    if (!el || !el.focus) return;
    try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (e2) {} }
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
      on: function (target, type, fn, opts) {
        if (!target || !target.addEventListener) return;
        target.addEventListener(type, fn, opts || false);
        offs.push(function () { target.removeEventListener(type, fn, opts || false); });
      },
      kill: function () {
        if (dead) return;
        dead = true;
        for (var i = 0; i < timers.length; i++) { W.clearTimeout(timers[i]); }
        for (var j = 0; j < offs.length; j++) { try { offs[j](); } catch (e) {} }
        timers = []; offs = [];
      }
    };
  }

  /* A shell may throw the host away without calling teardown (a plain back
     button does exactly that). Notice, and clean up rather than leaving a
     document-level key handler and a RAF loop running behind. */
  function detached(host) {
    return !!(D.body && host && host.nodeType === 1 && !D.body.contains(host));
  }

  /* Deterministic little PRNG for the wood grain, so the board looks the
     same after every resize instead of reshuffling its streaks. */
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  }

  function rrectPath(c, x, y, w, h, r) {
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  /* ==================================================================
     BOARD CONSTANTS — the playing field is 0..100 board units square.
     ================================================================== */

  var U = 100;                    /* field size in board units             */
  var M = 8;                      /* drawn wooden frame, units each side   */
  var VIEW = U + 2 * M;
  var RC = 2.6, RS = 3.5;         /* coin and striker radii                */
  var RP = 4.6;                   /* pocket radius (drawn and captured)    */
  var PC = 4.6;                   /* pocket centre inset from each wall    */
  var POCKETS = [[PC, PC], [U - PC, PC], [PC, U - PC], [U - PC, U - PC]];
  var YOU_Y = 82, GATTU_Y = 18;   /* the two striker baselines             */
  var SXMIN = 22, SXMAX = 78;     /* striker travel along a baseline       */
  var DT = 1 / 120;               /* fixed physics step                    */
  var FRICTION = 30;              /* linear deceleration, units/s²         */
  var MAXV = 120;                 /* hard speed cap: 1 unit/step — no wall */
  var WALL_E = 0.72;              /* can ever be tunnelled at this cap     */
  var COIN_E = 0.9;
  var SLEEP = 2.2;                /* below this speed a body goes to rest  */

  /* Board palette — the physical object. UI chrome colours come from the
     app's tokens (read at mount); the wood itself is the wood. */
  var INK = '#9c2f1d';            /* the inlay red every real board uses   */
  var WOOD_HI = '#f2e0ba', WOOD_LO = '#e2c48d';

  /* A body falls in when its centre is well inside the pocket circle; the
     bigger striker needs to be deeper in, same as on a real board. */
  function captureDist(r) { return RP - r * 0.35; }

  /* ==================================================================
     THE ENGINE
     ================================================================== */

  function carrom(host, opts, done) {
    injectCSS();
    var sc = scope();
    var reduced = reducedMotion();
    var finished = false;
    var rafId = 0, lastT = 0, acc = 0;

    /* ---------------------------------------------------------- markup */
    host.innerHTML =
      '<div class="car-wrap">' +
        '<div class="car-hud">' +
          '<div><span class="car-kicker">Mela &middot; flick &amp; pocket</span>' +
          '<b class="car-title">Carrom</b></div>' +
          '<div class="car-chips">' +
            '<span class="car-chip"><i class="car-dot w"></i><span data-nm="you">You</span> <b data-r="you">6</b></span>' +
            '<span class="car-chip"><i class="car-dot b"></i><span data-nm="gattu">Gattu</span> <b data-r="gattu">6</b></span>' +
            '<span class="car-chip"><i class="car-dot q"></i><span data-r="queen">in the middle</span></span>' +
          '</div>' +
        '</div>' +
        '<div class="car-stage">' +
          '<canvas class="car-canvas" tabindex="0" aria-label="Carrom board. Drag the striker or press Left and Right to slide it, pull back anywhere on the board or hold Space to aim and shoot."></canvas>' +
        '</div>' +
        '<div class="car-ctl">' +
          '<span class="car-arr" aria-hidden="true">&#9664;</span>' +
          '<input type="range" class="car-slider" min="' + SXMIN + '" max="' + SXMAX + '" step="1" value="50" aria-label="Striker position along your baseline">' +
          '<span class="car-arr" aria-hidden="true">&#9654;</span>' +
        '</div>' +
        '<p class="car-hint"><b>Drag the striker</b> (or the slider, or &#8592;&#8594;) to slide &middot; <b>pull back</b> anywhere to aim, let go to shoot &middot; or A/D + hold Space</p>' +
        '<p class="car-feed" role="status" aria-live="polite"></p>' +
        '<div class="car-over"></div>' +
      '</div>';

    var wrapEl = host.querySelector('.car-wrap');
    var stage = host.querySelector('.car-stage');
    var canvas = host.querySelector('.car-canvas');
    var over = host.querySelector('.car-over');
    var slider = host.querySelector('.car-slider');
    var feed = host.querySelector('.car-feed');
    var ctx = canvas.getContext('2d');
    var dpr = 1, cssSize = 0;
    var board = null;              /* the pre-rendered static board layer  */

    /* UI accent colours from the app's design tokens, with safe fallbacks. */
    var pal = (function () {
      try {
        var cs = W.getComputedStyle(host);
        var v = function (n, f) { var x = (cs.getPropertyValue(n) || '').trim(); return x || f; };
        return { acc: v('--accent', '#5b3fd6'), acc2: v('--accent2', '#e9a13b'),
                 acc3: v('--accent3', '#d94f3d'), good: v('--good', '#1fa971') };
      } catch (e) {
        return { acc: '#5b3fd6', acc2: '#e9a13b', acc3: '#d94f3d', good: '#1fa971' };
      }
    })();

    function say(msg, tone) {
      if (!feed) return;
      feed.textContent = msg || '';
      feed.className = 'car-feed' + (tone ? ' ' + tone : '');
    }

    /* ------------------------------------------------------- game state
       Exposed on the host as __carState so headless checks can read real
       positions instead of screenshot-guessing. It is a debug window, not
       an API — nothing in the app reads it. */
    var st = {
      bodies: [],            /* {kind:'coin'|'queen'|'striker', owner, x,y,vx,vy,r,m,dead} */
      phase: 'intro',        /* intro | aim | think | rolling | over */
      turn: 'you',
      shooter: 'you',
      sx: 50,                /* your striker position along the baseline    */
      aimA: -Math.PI / 2,    /* aim angle, radians; -PI/2 points up-board   */
      charge: 0, charging: false,
      gSx: null,             /* where Gattu has placed his striker           */
      gT0: 0,                /* when he started sliding it there             */
      gPlan: null,
      shotPocketed: [],
      queenBy: null, queenPending: false, queenCovered: null,
      rollT: 0,
      winner: null, result: null,
      pops: []               /* decorative pocket-drop animations            */
    };
    host.__carState = st;

    /* pass-and-play: 'gattu' plays himself; '2p' hands the board across
       the carpet — white shoots from the bottom, black from the top */
    var vs = 'gattu';
    function human(side) { return side === 'you' || vs === '2p'; }
    function baseY(side) { return side === 'you' ? YOU_Y : GATTU_Y; }
    function nmS(side) {
      return side === 'you' ? (vs === '2p' ? 'Player 1' : 'You')
                            : (vs === '2p' ? 'Player 2' : 'Gattu');
    }
    function colr(side) { return side === 'you' ? 'white' : 'black'; }

    /* ----------------------------------------------------------- board */
    function buildCoins() {
      var bodies = [];
      bodies.push({ kind: 'queen', owner: null, x: 50, y: 50, vx: 0, vy: 0, r: RC, m: 1, dead: false });
      var i, a;
      /* classic rosette, sized to our 13 coins: 6 touching the queen,
         6 more in a second ring, colours alternating so each side has 6 */
      for (i = 0; i < 6; i++) {
        a = i * Math.PI / 3;
        bodies.push({ kind: 'coin', owner: (i % 2 === 0) ? 'you' : 'gattu',
          x: 50 + 5.45 * Math.cos(a), y: 50 + 5.45 * Math.sin(a), vx: 0, vy: 0, r: RC, m: 1, dead: false });
      }
      for (i = 0; i < 6; i++) {
        a = i * Math.PI / 3 + Math.PI / 6;
        bodies.push({ kind: 'coin', owner: (i % 2 === 0) ? 'gattu' : 'you',
          x: 50 + 10.9 * Math.cos(a), y: 50 + 10.9 * Math.sin(a), vx: 0, vy: 0, r: RC, m: 1, dead: false });
      }
      st.bodies = bodies;
    }

    function aliveCount(owner) {
      var n = 0;
      for (var i = 0; i < st.bodies.length; i++) {
        var b = st.bodies[i];
        if (b.kind === 'coin' && b.owner === owner && !b.dead) n++;
      }
      return n;
    }
    function queenBody() {
      for (var i = 0; i < st.bodies.length; i++) if (st.bodies[i].kind === 'queen') return st.bodies[i];
      return null;
    }

    /* Somewhere near the centre with room to stand — for returned coins. */
    function findFreeSpot() {
      function clear(x, y) {
        for (var i = 0; i < st.bodies.length; i++) {
          var b = st.bodies[i];
          if (b.dead) continue;
          var dx = b.x - x, dy = b.y - y;
          if (dx * dx + dy * dy < (b.r + RC + 0.6) * (b.r + RC + 0.6)) return false;
        }
        return true;
      }
      if (clear(50, 50)) return { x: 50, y: 50 };
      for (var ring = 1; ring < 12; ring++) {
        for (var k = 0; k < 10; k++) {
          var a = k * Math.PI / 5 + ring * 0.5;
          var x = 50 + ring * 3.2 * Math.cos(a), y = 50 + ring * 3.2 * Math.sin(a);
          if (x > 16 && x < 84 && y > 24 && y < 76 && clear(x, y)) return { x: x, y: y };
        }
      }
      return { x: 50, y: 50 };  /* never reached on a 13-coin board */
    }

    function revive(body) {
      var p = findFreeSpot();
      body.dead = false; body.x = p.x; body.y = p.y; body.vx = 0; body.vy = 0;
    }
    function reviveOneCoin(owner) {
      for (var i = 0; i < st.bodies.length; i++) {
        var b = st.bodies[i];
        if (b.kind === 'coin' && b.owner === owner && b.dead) { revive(b); return true; }
      }
      return false;
    }

    /* --------------------------------------------------------- physics */
    function performanceNow() {
      return (W.performance && W.performance.now) ? W.performance.now() : Date.now();
    }
    function capture(b, pk) {
      if (!reduced) {
        st.pops.push({ x0: b.x, y0: b.y, px: pk[0], py: pk[1],
                       kind: b.kind, owner: b.owner, r: b.r, t: performanceNow() });
      }
      b.dead = true; b.vx = 0; b.vy = 0; b.x = -999; b.y = -999;
      st.shotPocketed.push({ kind: b.kind, owner: b.owner });
    }

    function physStep(dt) {
      var bs = st.bodies, i, j, b, c;
      /* integrate with linear friction */
      for (i = 0; i < bs.length; i++) {
        b = bs[i];
        if (b.dead) continue;
        var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (sp > 0) {
          var ns = sp - FRICTION * dt;
          if (ns < 0) ns = 0;
          if (ns > MAXV) ns = MAXV;
          var k = ns / sp;
          b.vx *= k; b.vy *= k;
        }
        b.x += b.vx * dt; b.y += b.vy * dt;
      }
      /* resolve collisions a few times per step — the iteration is what keeps
         a full-power break into a packed rosette stable instead of exploding */
      for (var it = 0; it < 4; it++) {
        for (i = 0; i < bs.length; i++) {
          b = bs[i];
          if (b.dead) continue;
          for (j = i + 1; j < bs.length; j++) {
            c = bs[j];
            if (c.dead) continue;
            var dx = c.x - b.x, dy = c.y - b.y;
            var rr = b.r + c.r, d2 = dx * dx + dy * dy;
            if (d2 >= rr * rr) continue;
            var d = Math.sqrt(d2) || 0.001;
            var nx = dx / d, ny = dy / d;
            var im1 = 1 / b.m, im2 = 1 / c.m, tot = im1 + im2;
            /* clamp the overlap out first, weighted by mass */
            var ov = rr - d;
            b.x -= nx * ov * (im1 / tot); b.y -= ny * ov * (im1 / tot);
            c.x += nx * ov * (im2 / tot); c.y += ny * ov * (im2 / tot);
            /* then the elastic impulse, only if still approaching */
            var vn = (c.vx - b.vx) * nx + (c.vy - b.vy) * ny;
            if (vn < 0) {
              var imp = -(1 + COIN_E) * vn / tot;
              b.vx -= imp * im1 * nx; b.vy -= imp * im1 * ny;
              c.vx += imp * im2 * nx; c.vy += imp * im2 * ny;
            }
          }
          /* pockets before walls: a coin rolling into a corner drops in,
             it does not bounce off the corner of the frame */
          for (j = 0; j < POCKETS.length; j++) {
            var px = POCKETS[j][0] - b.x, py = POCKETS[j][1] - b.y;
            var cd = captureDist(b.r);
            if (px * px + py * py < cd * cd) { capture(b, POCKETS[j]); break; }
          }
          if (b.dead) continue;
          if (b.x < b.r) { b.x = b.r; if (b.vx < 0) b.vx = -b.vx * WALL_E; }
          if (b.x > U - b.r) { b.x = U - b.r; if (b.vx > 0) b.vx = -b.vx * WALL_E; }
          if (b.y < b.r) { b.y = b.r; if (b.vy < 0) b.vy = -b.vy * WALL_E; }
          if (b.y > U - b.r) { b.y = U - b.r; if (b.vy > 0) b.vy = -b.vy * WALL_E; }
        }
      }
      /* sleep and cap */
      for (i = 0; i < bs.length; i++) {
        b = bs[i];
        if (b.dead) continue;
        var s2 = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (s2 < SLEEP) { b.vx = 0; b.vy = 0; }
        else if (s2 > MAXV) { b.vx *= MAXV / s2; b.vy *= MAXV / s2; }
      }
    }

    function anyMoving() {
      for (var i = 0; i < st.bodies.length; i++) {
        var b = st.bodies[i];
        if (!b.dead && (b.vx !== 0 || b.vy !== 0)) return true;
      }
      return false;
    }

    /* ------------------------------------------------------------ turns */
    function fire(x, y, angle, speed, shooter) {
      speed = clamp(speed, 8, MAXV);
      st.bodies.push({ kind: 'striker', owner: shooter, r: RS, m: 1.6,
        x: clamp(x, RS, U - RS), y: y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, dead: false });
      st.shooter = shooter;
      st.shotPocketed = [];
      st.rollT = 0;
      st.phase = 'rolling';
      st.gSx = null; st.gPlan = null;
      st.charge = 0; st.charging = false;
    }

    function playerFire() {
      say('');
      fire(st.sx, baseY(st.turn), st.aimA, MAXV * (0.18 + 0.82 * st.charge), st.turn);
    }

    function resolveShot() {
      /* the striker is lifted off the board after every shot, like at home */
      for (var i = st.bodies.length - 1; i >= 0; i--) {
        if (st.bodies[i].kind === 'striker') st.bodies.splice(i, 1);
      }
      var s = st.shooter, o = s === 'you' ? 'gattu' : 'you';
      var own = 0, opp = 0, queenIn = false, strikerIn = false;
      for (i = 0; i < st.shotPocketed.length; i++) {
        var p = st.shotPocketed[i];
        if (p.kind === 'striker') strikerIn = true;
        else if (p.kind === 'queen') queenIn = true;
        else if (p.owner === s) own++;
        else opp++;
      }

      var who = nmS(s);
      var msg = '', tone = '';

      if (strikerIn) {
        /* foul: the striker went in — the queen (if she fell this shot) and one
           of the shooter's pocketed coins climb back out, and the turn passes */
        if (queenIn) { revive(queenBody()); st.queenBy = null; st.queenPending = false; }
        if (st.queenPending && st.queenBy === s) {
          revive(queenBody()); st.queenBy = null; st.queenPending = false;
        }
        var gave = reviveOneCoin(s);
        msg = (vs === '2p' ? who + ' sank the striker — foul! '
               : s === 'you' ? 'Oops — the striker went in. ' : 'Gattu sank the striker! ') +
              (gave ? 'One ' + colr(s) + ' comes back to the middle.' : 'Nothing to give back — lucky.');
        tone = 'warm';
        st.turn = o;
      } else {
        if (queenIn) {
          st.queenBy = s;
          if (own > 0) {
            st.queenPending = false; st.queenCovered = s;
            msg = who + ' pocketed the queen AND covered her — three points!';
            tone = human(s) ? 'good' : 'warm';
          } else {
            st.queenPending = true;
            msg = who + ' pocketed the queen! Cover her: a ' + colr(s) + ' must drop on the very next shot.';
            tone = 'warm';
          }
        } else if (st.queenPending && st.queenBy === s) {
          if (own > 0) {
            st.queenPending = false; st.queenCovered = s;
            msg = 'Covered! The queen stays with ' + (vs === '2p' ? who : (s === 'you' ? 'you' : 'Gattu')) + ' — three points.';
            tone = human(s) ? 'good' : 'warm';
          } else {
            revive(queenBody()); st.queenBy = null; st.queenPending = false;
            msg = 'No cover, so the queen climbs back out to the middle.';
            tone = 'warm';
          }
        }
        if (!msg) {
          if (own > 0) {
            msg = vs === '2p'
              ? 'Shabaash! ' + who + ' sank ' + own + ' ' + colr(s) + (own > 1 ? 's' : '') + ' — shoot again.'
              : s === 'you'
              ? 'Shabaash! ' + own + ' white' + (own > 1 ? 's' : '') + ' in — shoot again.'
              : 'Gattu sank ' + own + ' black' + (own > 1 ? 's' : '') + ' — he shoots again.';
            tone = human(s) ? 'good' : '';
          } else if (opp > 0) {
            msg = vs === '2p'
              ? 'A ' + colr(o) + ' went in — that one counts for ' + nmS(o) + '. Their turn.'
              : s === 'you'
              ? 'A black went in — that one counts for Gattu. His turn.'
              : 'Gattu knocked a white in — it counts for you! Your turn.';
            tone = vs === '2p' ? 'warm' : s === 'you' ? 'warm' : 'good';
          } else {
            msg = vs === '2p' ? 'Nothing dropped — ' + nmS(o) + '’s turn.'
              : s === 'you' ? 'Nothing dropped — Gattu’s turn.' : 'Gattu missed — your turn.';
          }
        } else if (own > 0) {
          msg += human(s) ? ' Shoot again.' : ' He shoots again.';
        }
        st.turn = own > 0 ? s : o;
      }

      refreshHud();

      /* first to clear their colour wins; the queen is a 3-point bonus for
         whoever pocketed-and-covered her */
      if (aliveCount(s) === 0) return endMatch(s, msg);
      if (aliveCount(o) === 0) return endMatch(o, msg);

      if (vs === '2p' && st.turn !== s) {
        msg += ' Hand the board — ' + nmS(st.turn) + ' (' + colr(st.turn) + ') shoots from the ' +
               (st.turn === 'you' ? 'bottom' : 'top') + '.';
      }
      say(msg, tone);
      if (human(st.turn)) {
        st.phase = 'aim';
        st.sx = 50;
        st.aimA = st.turn === 'you' ? -Math.PI / 2 : Math.PI / 2;
        st.charge = 0; st.charging = false;
      } else {
        gattuTurn();
      }
    }

    /* --------------------------------------------------------- Gattu AI
       Gattu looks for his easiest honest shot: one of his own coins with a
       clear-ish line from his baseline to a pocket, then aims with a little
       wobble so he misses believably. He always has a fallback, so he can
       never stall the game. */
    function segDist(px, py, ax, ay, bx, by) {
      var vx = bx - ax, vy = by - ay, wx = px - ax, wy = py - ay;
      var L = vx * vx + vy * vy;
      var t = L ? clamp((wx * vx + wy * vy) / L, 0, 1) : 0;
      var dx = wx - t * vx, dy = wy - t * vy;
      return Math.sqrt(dx * dx + dy * dy);
    }
    function blockers(ax, ay, bx, by, skip) {
      var n = 0;
      for (var i = 0; i < st.bodies.length; i++) {
        var b = st.bodies[i];
        if (b.dead || b === skip || b.kind === 'striker') continue;
        if (segDist(b.x, b.y, ax, ay, bx, by) < b.r + RS - 0.6) n++;
      }
      return n;
    }
    function wobble(w) { return (Math.random() + Math.random() - 1) * w; }

    function planGattu() {
      var targets = [], i, j, k, b;
      for (i = 0; i < st.bodies.length; i++) {
        b = st.bodies[i];
        if (b.dead) continue;
        if (b.kind === 'coin' && b.owner === 'gattu') targets.push(b);
        /* he only eyes the queen once he has a coin in hand to cover with */
        else if (b.kind === 'queen' && (6 - aliveCount('gattu')) > 0) targets.push(b);
      }
      var best = null;
      for (i = 0; i < targets.length; i++) {
        var t = targets[i];
        for (j = 0; j < POCKETS.length; j++) {
          var pk = POCKETS[j];
          var cx = pk[0] - t.x, cy = pk[1] - t.y;
          var lenCP = Math.sqrt(cx * cx + cy * cy) || 0.001;
          var dCPx = cx / lenCP, dCPy = cy / lenCP;
          /* the ghost point: where the striker's centre must be at contact */
          var gx = t.x - dCPx * (t.r + RS), gy = t.y - dCPy * (t.r + RS);
          if (gx < RS || gx > U - RS || gy < GATTU_Y + 2) continue;
          for (k = SXMIN; k <= SXMAX; k += 7) {
            var sgx = gx - k, sgy = gy - GATTU_Y;
            var lenSG = Math.sqrt(sgx * sgx + sgy * sgy);
            if (lenSG < 4) continue;
            var quality = (sgx / lenSG) * dCPx + (sgy / lenSG) * dCPy;
            if (quality < 0.3) continue;   /* too thin a cut to be his "easy" shot */
            var blk = blockers(k, GATTU_Y, gx, gy, t) + blockers(t.x, t.y, pk[0], pk[1], t);
            var score = quality * 3 - lenSG * 0.01 - lenCP * 0.012 - blk * 1.5 -
                        (t.kind === 'queen' ? 0.4 : 0);
            if (!best || score > best.score) {
              best = { score: score, sx: k, a: Math.atan2(sgy, sgx),
                       v: clamp(34 + lenSG * 0.55 + lenCP * 0.9, 42, 108) };
            }
          }
        }
      }
      if (best) {
        best.a += wobble(0.045);
        best.v = clamp(best.v + wobble(12), 40, 110);
        return best;
      }
      /* fallback: just knock his nearest coin (or anything) toward the middle */
      var near = null, nd = 1e9;
      for (i = 0; i < st.bodies.length; i++) {
        b = st.bodies[i];
        if (b.dead || b.kind === 'striker') continue;
        if (b.kind === 'coin' && b.owner !== 'gattu') continue;
        var dd = (b.y - GATTU_Y) * (b.y - GATTU_Y) + (b.x - 50) * (b.x - 50);
        if (dd < nd) { nd = dd; near = b; }
      }
      var tx = near ? near.x : 50, ty = near ? near.y : 50;
      var fx = clamp(tx, SXMIN, SXMAX);
      return { sx: fx, a: Math.atan2(ty - GATTU_Y, tx - fx) + wobble(0.08), v: 70 };
    }

    function gattuTurn() {
      st.phase = 'think';
      say('Gattu is thinking…');
      /* his shot has a visible beat now: he decides, his striker slides
         along the baseline into place (tweened in draw()), his aim line
         appears, then the flick — all timers live in the scope, so teardown
         mid-think leaves nothing behind */
      sc.later(function () {
        if (st.phase !== 'think' || detached(host)) return;
        var plan = planGattu();
        st.gPlan = plan;
        st.gSx = plan.sx;
        st.gT0 = performanceNow();
        sc.later(function () {
          if (st.phase !== 'think' || detached(host)) return;
          say('');
          fire(plan.sx, GATTU_Y, plan.a, plan.v, 'gattu');
        }, reduced ? 420 : 700);
      }, 600 + Math.random() * 400);
    }

    /* ------------------------------------------------------- match flow */
    function refreshHud() {
      var y = host.querySelector('[data-r="you"]'), g = host.querySelector('[data-r="gattu"]');
      var ny = host.querySelector('[data-nm="you"]'), ng = host.querySelector('[data-nm="gattu"]');
      if (ny) ny.textContent = vs === '2p' ? 'P1' : 'You';
      if (ng) ng.textContent = vs === '2p' ? 'P2' : 'Gattu';
      var q = host.querySelector('[data-r="queen"]');
      if (y) y.textContent = String(aliveCount('you'));
      if (g) g.textContent = String(aliveCount('gattu'));
      if (q) {
        q.textContent = st.queenCovered
          ? ('with ' + (vs === '2p' ? (st.queenCovered === 'you' ? 'P1' : 'P2')
                        : st.queenCovered === 'you' ? 'you' : 'Gattu'))
          : st.queenPending ? 'needs a cover!'
          : 'in the middle';
      }
    }

    function startMatch() {
      buildCoins();
      st.queenBy = null; st.queenPending = false; st.queenCovered = null;
      st.winner = null; st.result = null;
      st.turn = 'you'; st.shooter = 'you';
      st.sx = 50; st.aimA = -Math.PI / 2; st.charge = 0; st.charging = false;
      st.gSx = null; st.gPlan = null; st.shotPocketed = []; st.pops = [];
      st.phase = 'aim';
      over.hidden = true;
      refreshHud();
      say(vs === '2p' ? 'Player 1 shoots first — white, from the bottom. Slide, aim, flick.'
                      : 'Your shot — you are white. Slide, aim, flick.');
      /* arrows must work with no click-first: hand the board the focus */
      focusSoft(canvas);
    }

    function endMatch(winner, lastMsg) {
      st.winner = winner;
      st.phase = 'over';
      var score = (6 - aliveCount('you')) + (st.queenCovered === 'you' ? 3 : 0);
      st.result = { win: winner === 'you', score: score };
      say(lastMsg || '');
      over.innerHTML =
        '<div class="car-panel" role="dialog" aria-label="Game over">' +
          '<h3>' + (vs === '2p'
              ? nmS(winner) + ' cleared the ' + colr(winner) + 's — shabaash!'
              : winner === 'you' ? 'Shabaash — the whites are home!' : 'Gattu cleared his blacks first') + '</h3>' +
          '<p>' + (vs === '2p'
              ? 'A proper living-room match' + (st.queenCovered ? ' — and the queen was covered.' : '.') + ' Again?'
              : winner === 'you'
              ? 'Every white coin pocketed' + (st.queenCovered === 'you' ? ', and the queen covered too.' : '.')
              : 'He got there first this time — another game?') + '</p>' +
          '<p><b>' + score + '</b> point' + (score === 1 ? '' : 's') +
            ' &mdash; a coin is 1, the covered queen is 3.</p>' +
          '<div class="car-row">' +
            '<button type="button" class="car-btn" data-go="out">Back to the Mela</button>' +
            '<button type="button" class="car-btn ghost" data-go="again">Play again</button>' +
          '</div>' +
        '</div>';
      over.hidden = false;
      sc.later(function () { focusSoft(over.querySelector('[data-go="out"]')); }, 60);
    }

    function bail() {
      if (finished) return;
      finished = true;
      var r = st.result || { win: false, score: 0 };
      sc.kill();
      W.cancelAnimationFrame(rafId);
      if (typeof done === 'function') done({ win: r.win, score: r.score, kauris: r.win ? 4 : 1 });
    }

    function showIntro() {
      over.innerHTML =
        '<div class="car-panel" role="dialog" aria-label="How to play carrom">' +
          '<h3>Carrom</h3>' +
          '<p>India’s living-room game &mdash; the board that comes out when the cousins visit. The family rules, made simple:</p>' +
          '<ul>' +
            '<li>You are <b>white</b>, Gattu is black. Pocket one of yours and you shoot again.</li>' +
            '<li>Cover the red <b>queen</b>: drop a white on the same or the very next shot, or she climbs back out.</li>' +
            '<li>Striker in a pocket is a foul &mdash; one of your coins comes back.</li>' +
            '<li>Clear your six first to win. A coin is 1 point, the covered queen is 3.</li>' +
          '</ul>' +
          '<div class="car-row"><button type="button" class="car-btn" data-go="start">Play Gattu</button>' +
          '<button type="button" class="car-btn ghost" data-go="start2">Pass &amp; play — 2 players</button></div>' +
        '</div>';
      over.hidden = false;
      sc.later(function () { focusSoft(over.querySelector('[data-go="start"]')); }, 60);
    }

    /* ==================================================================
       RENDERING
       ================================================================== */

    /* ------------------------------------------------------------- fit
       The board must fit BOTH the width of the card AND the height that is
       genuinely free: below the app header and everything above the canvas,
       above the slider/hint/feed and the phone tab bar. Measured, not
       guessed, so the whole game sits on one screen with no scrolling. */
    function fit() {
      var availW = wrapEl.clientWidth || host.clientWidth || 320;
      var vh = W.innerHeight || 640;
      var sr = stage.getBoundingClientRect();
      var scrollY = W.pageYOffset || (D.documentElement && D.documentElement.scrollTop) || 0;
      var docTop = sr.top + scrollY;               /* stage offset from document top */
      var wr = wrapEl.getBoundingClientRect();
      var below = Math.max(0, wr.bottom - sr.bottom);  /* slider + hint + feed + gaps */
      var reserve = 12;                            /* card padding + breathing room  */
      var nav = D.querySelector('.topbar .nav');   /* the phone bottom tab bar        */
      if (nav) {
        var nr = nav.getBoundingClientRect();
        if (nr.height && nr.top > vh * 0.55 && nr.top < vh) reserve += vh - nr.top;
      }
      /* the board is the game: let it take the whole card and most of the
         viewport (the 560 cap made a desktop board look like a coaster) */
      var size = Math.floor(Math.max(220, Math.min(availW, vh - docTop - below - reserve, 900)));
      var d = W.devicePixelRatio || 1;
      if (size === cssSize && d === dpr && board) return;
      cssSize = size; dpr = d;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      buildBoardLayer();
    }

    /* --------------------------------------------- the static board layer
       Painted once per resize at full devicePixelRatio: wood, inlays,
       pockets, decals. Blitted every frame under the live pieces. */
    function unitsTransform(c) {
      var scale = (canvas.width / dpr) / VIEW;
      c.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * scale * M, dpr * scale * M);
    }

    function buildBoardLayer() {
      board = D.createElement('canvas');
      board.width = canvas.width; board.height = canvas.height;
      var c = board.getContext('2d');
      unitsTransform(c);
      var r = rng(20260816), i;

      /* ---- the frame: dark sheesham, mitred, with grain and a bevel ---- */
      var fg = c.createLinearGradient(-M, -M, U + M, U + M);
      fg.addColorStop(0, '#7c4c22');
      fg.addColorStop(0.35, '#5e3315');
      fg.addColorStop(0.65, '#6d3f1c');
      fg.addColorStop(1, '#512b10');
      c.beginPath(); rrectPath(c, -M, -M, VIEW, VIEW, 4);
      c.fillStyle = fg; c.fill();

      /* frame grain: long streaks running with each rail, clipped to the ring */
      c.save();
      c.beginPath(); rrectPath(c, -M, -M, VIEW, VIEW, 4);
      c.rect(0, 0, U, U);
      c.clip('evenodd');
      for (i = 0; i < 26; i++) {
        var gy = -M + r() * (2 * M) + (r() < 0.5 ? 0 : U);      /* top / bottom rails */
        c.beginPath();
        c.moveTo(-M, gy);
        c.bezierCurveTo(20, gy + (r() - 0.5) * 1.6, 70, gy + (r() - 0.5) * 1.6, U + M, gy);
        c.strokeStyle = r() < 0.5 ? 'rgba(30,14,4,' + (0.05 + r() * 0.09) + ')'
                                  : 'rgba(214,150,86,' + (0.04 + r() * 0.07) + ')';
        c.lineWidth = 0.25 + r() * 0.55;
        c.stroke();
        var gx = -M + r() * (2 * M) + (r() < 0.5 ? 0 : U);      /* left / right rails */
        c.beginPath();
        c.moveTo(gx, -M);
        c.bezierCurveTo(gx + (r() - 0.5) * 1.6, 20, gx + (r() - 0.5) * 1.6, 70, gx, U + M);
        c.strokeStyle = r() < 0.5 ? 'rgba(30,14,4,' + (0.05 + r() * 0.09) + ')'
                                  : 'rgba(214,150,86,' + (0.04 + r() * 0.07) + ')';
        c.lineWidth = 0.25 + r() * 0.55;
        c.stroke();
      }
      /* mitre seams at the corners */
      c.strokeStyle = 'rgba(25,11,3,.35)'; c.lineWidth = 0.35;
      c.beginPath(); c.moveTo(-M + 1, -M + 1); c.lineTo(-0.4, -0.4); c.stroke();
      c.beginPath(); c.moveTo(U + M - 1, -M + 1); c.lineTo(U + 0.4, -0.4); c.stroke();
      c.beginPath(); c.moveTo(-M + 1, U + M - 1); c.lineTo(-0.4, U + 0.4); c.stroke();
      c.beginPath(); c.moveTo(U + M - 1, U + M - 1); c.lineTo(U + 0.4, U + 0.4); c.stroke();
      c.restore();

      /* outer edge light, inner bevel down into the field */
      c.beginPath(); rrectPath(c, -M + 0.5, -M + 0.5, VIEW - 1, VIEW - 1, 3.6);
      c.strokeStyle = 'rgba(255,205,140,.16)'; c.lineWidth = 0.7; c.stroke();
      c.strokeStyle = 'rgba(255,215,160,.22)'; c.lineWidth = 0.5;
      c.strokeRect(-1.9, -1.9, U + 3.8, U + 3.8);
      c.strokeStyle = 'rgba(15,6,1,.55)'; c.lineWidth = 0.9;
      c.strokeRect(-0.55, -0.55, U + 1.1, U + 1.1);

      /* ---- the playing field: pale maple ply with soft grain ---- */
      var pg = c.createLinearGradient(0, 0, U, U);
      pg.addColorStop(0, WOOD_HI);
      pg.addColorStop(0.55, '#ecd4a6');
      pg.addColorStop(1, WOOD_LO);
      c.fillStyle = pg; c.fillRect(0, 0, U, U);
      c.save();
      c.beginPath(); c.rect(0, 0, U, U); c.clip();
      for (i = 0; i < 30; i++) {
        var x = r() * U;
        c.beginPath();
        c.moveTo(x, -2);
        c.bezierCurveTo(x + (r() - 0.5) * 4, 30, x + (r() - 0.5) * 4, 70, x + (r() - 0.5) * 3, U + 2);
        c.strokeStyle = 'rgba(160,112,52,' + (0.035 + r() * 0.05) + ')';
        c.lineWidth = 0.22 + r() * 0.5;
        c.stroke();
      }
      /* faint sheen falling from the top-left, then a vignette into the frame */
      var sheen = c.createLinearGradient(0, 0, U * 0.7, U);
      sheen.addColorStop(0, 'rgba(255,248,225,.30)');
      sheen.addColorStop(0.45, 'rgba(255,248,225,0)');
      c.fillStyle = sheen; c.fillRect(0, 0, U, U);
      var vg = c.createRadialGradient(50, 50, 34, 50, 50, 76);
      vg.addColorStop(0, 'rgba(96,56,16,0)');
      vg.addColorStop(1, 'rgba(96,56,16,.16)');
      c.fillStyle = vg; c.fillRect(0, 0, U, U);
      c.restore();

      /* ---- inlays: baselines with end circles, on all four sides ---- */
      var side, k;
      for (side = 0; side < 4; side++) {
        c.save();
        c.translate(50, 50); c.rotate(side * Math.PI / 2); c.translate(-50, -50);
        var y1 = YOU_Y, y2 = YOU_Y + 3.2, ym = YOU_Y + 1.6;
        c.strokeStyle = 'rgba(156,47,29,.85)'; c.lineWidth = 0.55;
        c.beginPath(); c.moveTo(SXMIN, y1); c.lineTo(SXMAX, y1); c.stroke();
        c.lineWidth = 0.8;
        c.beginPath(); c.moveTo(SXMIN, y2); c.lineTo(SXMAX, y2); c.stroke();
        for (k = 0; k < 2; k++) {
          var ex = k === 0 ? SXMIN : SXMAX;
          c.beginPath(); c.arc(ex, ym, 1.6, 0, TAU);
          c.fillStyle = 'rgba(184,53,44,.9)'; c.fill();
          c.strokeStyle = 'rgba(110,30,18,.9)'; c.lineWidth = 0.35; c.stroke();
          c.beginPath(); c.arc(ex, ym, 0.55, 0, TAU);
          c.fillStyle = 'rgba(250,235,205,.9)'; c.fill();
        }
        c.restore();
      }

      /* ---- centre circle and rosette ---- */
      c.strokeStyle = 'rgba(156,47,29,.75)'; c.lineWidth = 0.7;
      c.beginPath(); c.arc(50, 50, 12.5, 0, TAU); c.stroke();
      c.lineWidth = 0.3;
      c.beginPath(); c.arc(50, 50, 11.7, 0, TAU); c.stroke();
      for (i = 0; i < 8; i++) {                       /* small dots on the ring */
        var da = i * Math.PI / 4 + Math.PI / 8;
        c.beginPath(); c.arc(50 + 12.5 * Math.cos(da), 50 + 12.5 * Math.sin(da), 0.5, 0, TAU);
        c.fillStyle = 'rgba(156,47,29,.7)'; c.fill();
      }
      c.beginPath(); c.arc(50, 50, 5.6, 0, TAU);
      c.fillStyle = 'rgba(184,53,44,.10)'; c.fill();
      c.strokeStyle = 'rgba(156,47,29,.7)'; c.lineWidth = 0.45; c.stroke();
      c.save();                                        /* eight-petal rosette */
      c.translate(50, 50);
      c.fillStyle = 'rgba(156,47,29,.55)';
      for (i = 0; i < 8; i++) {
        c.save(); c.rotate(i * Math.PI / 4);
        c.beginPath();
        c.moveTo(1.05, 0);
        c.quadraticCurveTo(2.9, 1.65, 4.9, 0);
        c.quadraticCurveTo(2.9, -1.65, 1.05, 0);
        c.closePath(); c.fill();
        c.restore();
      }
      c.beginPath(); c.arc(0, 0, 1.02, 0, TAU); c.fillStyle = INK; c.fill();
      c.restore();

      /* ---- corner arrow decals, pointing at their pockets ---- */
      for (side = 0; side < 4; side++) {
        c.save();
        c.translate(50, 50); c.rotate(side * Math.PI / 2); c.translate(-50, -50);
        c.strokeStyle = 'rgba(156,47,29,.5)'; c.lineWidth = 0.55; c.lineCap = 'round';
        c.beginPath(); c.moveTo(26.2, 26.2); c.lineTo(16.2, 16.2); c.stroke();
        c.beginPath();                                  /* arrowhead at the pocket end */
        c.moveTo(15.4, 15.4);
        c.lineTo(18.6, 16.1); c.moveTo(15.4, 15.4); c.lineTo(16.1, 18.6);
        c.stroke();
        c.beginPath(); c.arc(28.0, 28.0, 1.5, 0, TAU);  /* the little tail circle */
        c.stroke();
        c.beginPath(); c.arc(28.0, 28.0, 0.42, 0, TAU); /* with its centre dot */
        c.fillStyle = 'rgba(156,47,29,.5)'; c.fill();
        c.restore();
      }

      /* ---- pocket wells, last so they sit over the inlays ---- */
      for (i = 0; i < POCKETS.length; i++) {
        var px = POCKETS[i][0], py = POCKETS[i][1];
        c.beginPath(); c.arc(px, py, RP + 1.0, 0, TAU);  /* turned inlay ring */
        c.strokeStyle = 'rgba(110,60,25,.5)'; c.lineWidth = 0.45; c.stroke();
        var wellg = c.createRadialGradient(px, py, RP * 0.15, px, py, RP);
        wellg.addColorStop(0, '#0c0603');
        wellg.addColorStop(0.72, '#20120a');
        wellg.addColorStop(1, '#3d2513');
        c.beginPath(); c.arc(px, py, RP, 0, TAU);
        c.fillStyle = wellg; c.fill();
        /* rim light on the side facing the middle of the board */
        var toC = Math.atan2(50 - py, 50 - px);
        c.beginPath(); c.arc(px, py, RP - 0.25, toC - 1.0, toC + 1.0);
        c.strokeStyle = 'rgba(240,205,150,.28)'; c.lineWidth = 0.45; c.stroke();
      }
    }

    /* ------------------------------------------------- piece painters */
    function bodyShadow(x, y, rr) {
      var sx2 = x + rr * 0.14, sy2 = y + rr * 0.3;
      var g = ctx.createRadialGradient(sx2, sy2, rr * 0.3, sx2, sy2, rr * 1.3);
      g.addColorStop(0, 'rgba(40,20,5,.30)');
      g.addColorStop(1, 'rgba(40,20,5,0)');
      ctx.beginPath(); ctx.arc(sx2, sy2, rr * 1.3, 0, TAU);
      ctx.fillStyle = g; ctx.fill();
    }

    function coinPalette(kind, owner) {
      if (kind === 'queen') return { hi: '#ea6a50', mid: '#c33a27', lo: '#7e1a10', rim: '#57110a', gr: 'rgba(255,225,205,.35)' };
      if (owner === 'you') return { hi: '#fffbe9', mid: '#f2e2bb', lo: '#d9bd85', rim: '#a8813f', gr: 'rgba(150,110,50,.45)' };
      return { hi: '#5c4936', mid: '#37281a', lo: '#1a0f07', rim: '#0b0603', gr: 'rgba(255,235,205,.14)' };
    }

    function drawCoinAt(x, y, rr, kind, owner, alpha) {
      var p = coinPalette(kind, owner);
      if (alpha != null) ctx.globalAlpha = alpha;
      var g = ctx.createRadialGradient(x - rr * 0.35, y - rr * 0.42, rr * 0.12, x, y, rr * 1.05);
      g.addColorStop(0, p.hi); g.addColorStop(0.55, p.mid); g.addColorStop(1, p.lo);
      ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU);
      ctx.fillStyle = g; ctx.fill();
      ctx.lineWidth = rr * 0.14; ctx.strokeStyle = p.rim; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, rr * 0.6, 0, TAU);   /* turned groove */
      ctx.lineWidth = rr * 0.09; ctx.strokeStyle = p.gr; ctx.stroke();
      ctx.beginPath(); ctx.arc(x - rr * 0.3, y - rr * 0.38, rr * 0.42, -2.6, -1.1);
      ctx.lineWidth = rr * 0.1; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.stroke();
      if (alpha != null) ctx.globalAlpha = 1;
    }

    function drawStrikerAt(x, y, alpha) {
      if (alpha != null) ctx.globalAlpha = alpha;
      var g = ctx.createRadialGradient(x - RS * 0.35, y - RS * 0.42, RS * 0.12, x, y, RS * 1.05);
      g.addColorStop(0, '#fffef6'); g.addColorStop(0.5, '#f5e8c6'); g.addColorStop(1, '#dcc290');
      ctx.beginPath(); ctx.arc(x, y, RS, 0, TAU);
      ctx.fillStyle = g; ctx.fill();
      ctx.lineWidth = 0.42; ctx.strokeStyle = '#a8813f'; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, RS * 0.76, 0, TAU);   /* the ring that says "striker" */
      ctx.lineWidth = 0.5; ctx.strokeStyle = pal.acc; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, RS * 0.48, 0, TAU);
      ctx.lineWidth = 0.26; ctx.strokeStyle = 'rgba(91,63,214,.4)'; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, RS * 0.16, 0, TAU);
      ctx.fillStyle = pal.acc; ctx.fill();
      ctx.beginPath(); ctx.arc(x - RS * 0.3, y - RS * 0.38, RS * 0.5, -2.6, -1.15);
      ctx.lineWidth = 0.3; ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.stroke();
      if (alpha != null) ctx.globalAlpha = 1;
    }

    /* how far the aim ray can travel before the striker's centre meets a wall */
    function rayLimit(x, y, dx, dy, max) {
      var t = max;
      if (dx > 0.0001) t = Math.min(t, (U - RS - x) / dx);
      if (dx < -0.0001) t = Math.min(t, (RS - x) / dx);
      if (dy > 0.0001) t = Math.min(t, (U - RS - y) / dy);
      if (dy < -0.0001) t = Math.min(t, (RS - y) / dy);
      return Math.max(0, t);
    }

    function easeOutCubic(t) { var u = 1 - t; return 1 - u * u * u; }

    /* ------------------------------------------------------------ draw */
    function draw() {
      var now = performanceNow();
      var i, b;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (board) ctx.drawImage(board, 0, 0);
      unitsTransform(ctx);

      /* pocket-drop animation: the pocketed piece slips into the well,
         shrinking and fading — decorative, skipped under reduced motion */
      if (st.pops.length) {
        var keep = [];
        for (i = 0; i < st.pops.length; i++) {
          var pop = st.pops[i], age = (now - pop.t) / 420;
          if (age < 1) {
            var e = age * age;
            var px2 = pop.x0 + (pop.px - pop.x0) * e;
            var py2 = pop.y0 + (pop.py - pop.y0) * e;
            var rr2 = pop.r * (1 - 0.8 * e);
            if (pop.kind === 'striker') drawStrikerAt(px2, py2, 1 - e);
            else drawCoinAt(px2, py2, rr2, pop.kind, pop.owner, 1 - e);
            keep.push(pop);
          }
        }
        st.pops = keep;
      }

      /* coins, queen, and (while rolling) the live striker */
      for (i = 0; i < st.bodies.length; i++) {
        b = st.bodies[i];
        if (b.dead) continue;
        bodyShadow(b.x, b.y, b.r);
        if (b.kind === 'striker') drawStrikerAt(b.x, b.y);
        else drawCoinAt(b.x, b.y, b.r, b.kind, b.owner);
      }

      /* Gattu lining up: his striker slides into place, then his aim line */
      if (st.phase === 'think' && st.gPlan) {
        var gt = reduced ? 1 : Math.min(1, (now - st.gT0) / 320);
        var gx = 50 + (st.gPlan.sx - 50) * easeOutCubic(gt);
        bodyShadow(gx, GATTU_Y, RS);
        drawStrikerAt(gx, GATTU_Y);
        if (gt >= 1) {
          var gl = rayLimit(st.gPlan.sx, GATTU_Y, Math.cos(st.gPlan.a), Math.sin(st.gPlan.a), 20);
          ctx.save();
          ctx.setLineDash([1.6, 2.6]);
          ctx.strokeStyle = 'rgba(64,30,12,.4)'; ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(st.gPlan.sx + Math.cos(st.gPlan.a) * (RS + 0.8), GATTU_Y + Math.sin(st.gPlan.a) * (RS + 0.8));
          ctx.lineTo(st.gPlan.sx + Math.cos(st.gPlan.a) * gl, GATTU_Y + Math.sin(st.gPlan.a) * gl);
          ctx.stroke();
          ctx.restore();
        }
      }

      /* your striker on the baseline with slide chevrons, the dashed
         trajectory with its ghost striker, and the power arc */
      if (st.phase === 'aim' && human(st.turn)) {
        var by = baseY(st.turn);
        bodyShadow(st.sx, by, RS);
        drawStrikerAt(st.sx, by);

        var ca = Math.cos(st.aimA), sa = Math.sin(st.aimA);
        var len = rayLimit(st.sx, by, ca, sa, 24 + st.charge * 26);
        var x0 = st.sx + ca * (RS + 0.9), y0 = by + sa * (RS + 0.9);
        var x1 = st.sx + ca * len, y1 = by + sa * len;
        ctx.save();
        ctx.setLineDash([1.8, 2.6]);
        if (!reduced) ctx.lineDashOffset = -(now / 90) % 4.4;
        ctx.strokeStyle = 'rgba(64,30,12,.55)'; ctx.lineWidth = 0.7; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.setLineDash([1.1, 1.6]);
        ctx.strokeStyle = pal.acc; ctx.globalAlpha = 0.75; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.arc(x1, y1, RS, 0, TAU); ctx.stroke();   /* ghost striker */
        ctx.globalAlpha = 0.35;
        ctx.beginPath(); ctx.arc(x1, y1, RS * 0.16, 0, TAU);
        ctx.fillStyle = pal.acc; ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();

        /* slide chevrons — quiet, but they say "this moves sideways" */
        if (st.charge === 0 && !drag) {
          var wob = reduced ? 0 : Math.sin(now / 320) * 0.5;
          ctx.save();
          ctx.strokeStyle = pal.acc; ctx.globalAlpha = 0.6;
          ctx.lineWidth = 0.75; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          var cxL = st.sx - RS - 2.6 - wob, cxR = st.sx + RS + 2.6 + wob;
          if (st.sx > SXMIN + 0.5) {
            ctx.beginPath();
            ctx.moveTo(cxL + 1.1, by - 1.6); ctx.lineTo(cxL - 0.5, by); ctx.lineTo(cxL + 1.1, by + 1.6);
            ctx.stroke();
          }
          if (st.sx < SXMAX - 0.5) {
            ctx.beginPath();
            ctx.moveTo(cxR - 1.1, by - 1.6); ctx.lineTo(cxR + 0.5, by); ctx.lineTo(cxR - 1.1, by + 1.6);
            ctx.stroke();
          }
          ctx.restore();
        }

        /* the power meter is an arc around the striker itself */
        if (st.charge > 0 || st.charging) {
          var mr = RS + 1.9;
          ctx.save();
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.arc(st.sx, by, mr, 0, TAU);
          ctx.strokeStyle = 'rgba(40,20,8,.18)'; ctx.lineWidth = 1.05; ctx.stroke();
          if (st.charge > 0.01) {
            ctx.beginPath(); ctx.arc(st.sx, by, mr, -Math.PI / 2, -Math.PI / 2 + st.charge * TAU);
            ctx.strokeStyle = st.charge < 0.45 ? pal.good : st.charge < 0.8 ? pal.acc2 : pal.acc3;
            ctx.lineWidth = 1.35; ctx.stroke();
          }
          ctx.restore();
        }
      }

      /* keep the slider honest with the real striker position */
      if (slider) {
        var v = String(Math.round(st.sx));
        if (slider.value !== v) slider.value = v;
        var dis = !(st.phase === 'aim' && human(st.turn));
        if (slider.disabled !== dis) slider.disabled = dis;
      }
    }

    /* ---------------------------------------------------------- the loop
       One RAF drives everything: charge growth, fixed-step physics while a
       shot is rolling, and the draw. Fixed 120 Hz steps accumulate against
       real time (clamped, so a background tab cannot demand a thousand
       steps at once), which is what keeps collisions deterministic-ish and
       stable at every frame rate. */
    function loop(ts) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var dt = lastT ? Math.min(0.05, (ts - lastT) / 1000) : 0.016;
      lastT = ts;
      if (st.charging && st.phase === 'aim' && human(st.turn)) {
        st.charge = Math.min(1, st.charge + dt * 0.8);
      }
      if (st.phase === 'rolling') {
        acc += dt;
        var guard = 0;
        while (acc >= DT && guard < 10) {
          physStep(DT);
          acc -= DT;
          st.rollT += DT;
          guard++;
        }
        /* watchdog: however weird the frame timing gets, a shot always ends */
        if (st.rollT > 9) {
          for (var i = 0; i < st.bodies.length; i++) { st.bodies[i].vx = 0; st.bodies[i].vy = 0; }
        }
        if (!anyMoving()) resolveShot();
      }
      draw();
      rafId = W.requestAnimationFrame(loop);
    }

    /* ------------------------------------------------------------ input
       Touch/mouse: grab the striker and it SLIDES with your finger — the
       whole striker is the handle. Pull back anywhere else on the board to
       aim (the shot goes opposite your pull, like a real flick) and let go
       to shoot. The slider under the board is a third, always-visible way
       to slide. Keyboard: ←/→ slide, A/D (or ↑/↓) aim, hold Space, release
       to shoot — live from the moment the match starts. */
    function toBoard(e) {
      var r2 = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - r2.left) / r2.width * VIEW - M,
        y: (e.clientY - r2.top) / r2.height * VIEW - M
      };
    }

    var drag = null;
    sc.on(canvas, 'pointerdown', function (e) {
      focusSoft(canvas);
      if (st.phase !== 'aim' || !human(st.turn)) return;
      var p = toBoard(e);
      var dx = p.x - st.sx, dy = p.y - baseY(st.turn);
      if (dx * dx + dy * dy < (RS * 3) * (RS * 3)) {
        /* grab the striker itself: it slides along the baseline — and the
           moment the pull comes BACK past the line, the grab becomes the
           sling, anchored on the striker. One thumb, both moves — which is
           what every hand that has played a phone carrom expects, and what
           "cannot control the striker" was: dragging back from it used to
           only slide it sideways. */
        drag = { mode: 'stick' };
      } else {
        drag = { mode: 'sling', x0: p.x, y0: p.y };  /* anywhere else: pull back to aim */
      }
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });
    sc.on(canvas, 'pointermove', function (e) {
      if (!drag || st.phase !== 'aim') return;
      var p = toBoard(e);
      if (drag.mode === 'stick') {
        /* "back" is away from the board: down for white, up for black */
        var by2 = baseY(st.turn);
        var back = st.turn === 'you' ? (p.y - by2 > RS * 2.6) : (by2 - p.y > RS * 2.6);
        if (back) {
          drag = { mode: 'sling', x0: st.sx, y0: by2 };   /* pulled back: now a sling */
        } else { st.sx = clamp(p.x, SXMIN, SXMAX); return; }
      }
      /* sling: the flick goes opposite the pull, scaled by how far you pull */
      var dx = drag.x0 - p.x, dy = drag.y0 - p.y;
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len > 1.2) st.aimA = Math.atan2(dy, dx);
      st.charge = clamp((len - 1.5) / 28, 0, 1);
    });
    function pointerEnd(e) {
      if (!drag) return;
      var was = drag; drag = null;
      if (was.mode === 'sling' && st.phase === 'aim' && human(st.turn)) {
        if (st.charge > 0.07) playerFire();
        else st.charge = 0;
      }
    }
    sc.on(canvas, 'pointerup', pointerEnd);
    sc.on(canvas, 'pointercancel', pointerEnd);

    /* the slider is a plain range input: full keyboard and touch for free */
    sc.on(slider, 'input', function () {
      if (st.phase === 'aim' && human(st.turn)) st.sx = clamp(+slider.value, SXMIN, SXMAX);
    });

    /* Document-level keys, so arrows work with no click-first anywhere. */
    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      /* on the intro / result cards, keys stay with the focused button */
      if (st.phase !== 'aim' || !human(st.turn)) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); st.sx = Math.max(SXMIN, st.sx - 2); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); st.sx = Math.min(SXMAX, st.sx + 2); }
      else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowUp') { e.preventDefault(); st.aimA -= 0.055; }
      else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowDown') { e.preventDefault(); st.aimA += 0.055; }
      else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat) { st.charging = true; }
      }
    });
    sc.on(D, 'keyup', function (e) {
      if (sc.dead) return;
      if ((e.key === ' ' || e.code === 'Space') && st.charging) {
        e.preventDefault();
        st.charging = false;
        if (st.phase === 'aim' && human(st.turn)) playerFire();
      }
    });

    sc.on(host, 'click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-go]') : null;
      if (!t) return;
      var what = t.getAttribute('data-go');
      if (what === 'start') { vs = 'gattu'; startMatch(); }
      else if (what === 'start2') { vs = '2p'; startMatch(); }
      else if (what === 'again') startMatch();
      else if (what === 'out') bail();
    });

    sc.on(W, 'resize', fit);

    /* ------------------------------------------------------------- boot */
    buildCoins();
    refreshHud();
    fit();
    showIntro();
    /* re-measure once fonts and layout settle — cheap, and it is what keeps
       the "fits on one screen" promise honest on a cold load */
    sc.later(fit, 120);
    rafId = W.requestAnimationFrame(loop);

    var teardown = function () {
      finished = true;
      sc.kill();
      W.cancelAnimationFrame(rafId);
      try { delete host.__carState; } catch (e) { host.__carState = null; }
    };
    teardown.destroy = teardown;   /* saga callers use .destroy() */
    return teardown;
  }

  /* ==================================================================
     COVER SCENE — 48×48, stroke #fff, self-animating: the striker slides
     along its baseline, then a coin drops into the corner pocket.
     ================================================================== */

  var SCENE =
    '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<style>' +
        '@keyframes car-slide{0%,12%{transform:translate(0,0)}42%,62%{transform:translate(14px,0)}100%{transform:translate(0,0)}}' +
        '@keyframes car-drop{0%,52%{transform:translate(0,0) scale(1);opacity:1}' +
          '78%{transform:translate(-8px,-8px) scale(1);opacity:1}' +
          '90%,100%{transform:translate(-8px,-8px) scale(.1);opacity:0}}' +
      '</style>' +
      '<rect x="5" y="5" width="38" height="38" rx="4" stroke="#fff" stroke-width="2"/>' +
      '<circle cx="10.5" cy="10.5" r="2.6" stroke="#fff" stroke-width="1.6"/>' +
      '<circle cx="37.5" cy="10.5" r="2.6" stroke="#fff" stroke-width="1.6"/>' +
      '<circle cx="10.5" cy="37.5" r="2.6" stroke="#fff" stroke-width="1.6"/>' +
      '<circle cx="37.5" cy="37.5" r="2.6" stroke="#fff" stroke-width="1.6"/>' +
      '<circle cx="24" cy="24" r="4.5" stroke="#fff" stroke-width="1.4" opacity=".55"/>' +
      '<path d="M15 33.5h18" stroke="#fff" stroke-width="1.4" opacity=".7"/>' +
      '<g style="animation:car-drop 3s ease-in infinite">' +
        '<circle cx="19" cy="19" r="2.4" stroke="#fff" stroke-width="1.8"/>' +
      '</g>' +
      '<g style="animation:car-slide 3s ease-in-out infinite">' +
        '<circle cx="17" cy="29.5" r="3.2" stroke="#fff" stroke-width="2"/>' +
      '</g>' +
    '</svg>';

  /* ==================================================================
     REGISTRY — games.js owns the array and loads first; guard anyway so
     this file also stands alone.
     ================================================================== */

  if (!W.IND_GAMES) W.IND_GAMES = [];
  W.IND_GAMES.push({
    id: 'carrom',
    name: 'Carrom',
    icon: 'game',
    minutes: 5,
    tag: 'Flick',
    c: '#7a4a21',
    c2: '#c99b62',
    scene: SCENE,
    blurb: 'India’s living-room board. Flick the striker, pocket your whites, cover the red queen — Gattu plays black.',
    engine: carrom
  });
})();
