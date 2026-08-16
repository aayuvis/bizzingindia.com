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
     · Plays fully with keyboard AND touch/mouse (the one-line hint says how).
     · prefers-reduced-motion skips the decorative pocket-drop flourish and all
       CSS easing — never the physics itself; the game IS motion.
     · No lives, no shaming. Gattu winning is "another game?", not a failure.

   Physics: fixed 120 Hz steps inside RAF, circle-circle elastic collisions with
   positional correction iterated 4× per step, wall restitution, linear friction
   to rest, a hard speed cap and a sleep threshold. At the capped speed a body
   moves 1 board-unit per step — well under a coin radius — so nothing can
   tunnel through a wall even at full power. */

(function () {
  'use strict';

  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document || null;
  if (!D) return;

  /* ==================================================================
     STYLE — injected once, everything scoped under .car-
     ================================================================== */

  var CSS = [
    '.car-wrap{display:flex;flex-direction:column;gap:12px;color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    '.car-hud{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}',
    '.car-title{display:block;font:800 19px/1.15 var(--display,Georgia,serif);letter-spacing:-.01em}',
    '.car-kicker{display:block;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}',
    '.car-chips{display:flex;gap:8px;flex-wrap:wrap;align-items:center}',
    '.car-chip{display:inline-flex;align-items:center;gap:6px;background:var(--surface2);border:1px solid var(--line);border-radius:999px;padding:5px 12px;font:700 13px var(--body,inherit)}',
    '.car-dot{width:12px;height:12px;border-radius:50%;border:1px solid rgba(0,0,0,.35);display:inline-block;flex:none}',
    '.car-dot.w{background:#f7ecd7}.car-dot.b{background:#33291f}.car-dot.q{background:#b8352c}',
    '.car-stage{position:relative;border-radius:var(--radius-lg);overflow:hidden;line-height:0}',
    '.car-canvas{display:block;width:100%;height:auto;touch-action:none;cursor:crosshair}',
    '.car-over{position:absolute;inset:0;display:grid;place-items:center;background:rgba(26,14,5,.62);padding:14px;line-height:1.4}',
    '.car-over[hidden]{display:none}',
    '.car-panel{background:var(--bg2);border:1px solid var(--line);border-radius:var(--radius-lg);padding:18px 20px;max-width:440px;max-height:100%;overflow:auto;text-align:left}',
    '.car-panel h3{font:800 20px var(--display,Georgia,serif);margin:0 0 8px}',
    '.car-panel p{margin:0 0 8px;font-size:14.5px;line-height:1.55}',
    '.car-panel ul{margin:0 0 10px;padding-left:18px;font-size:14px;line-height:1.55}',
    '.car-panel li{margin:0 0 5px}',
    '.car-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:10px}',
    '.car-btn{cursor:pointer;min-height:44px;padding:10px 22px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:var(--bg2);font:700 15px var(--body,inherit)}',
    '.car-btn.ghost{background:transparent;color:var(--text);border-color:var(--line)}',
    '.car-btn:hover{filter:brightness(1.06)}',
    '.car-btn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.car-gauge{height:10px;border-radius:999px;background:var(--surface2);border:1px solid var(--line);overflow:hidden}',
    '.car-gauge i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--good),var(--accent2),var(--accent))}',
    '.car-hint{font-size:12.5px;color:var(--muted);text-align:center;margin:0}',
    '.car-feed{min-height:20px;margin:0;text-align:center;font-size:14.5px;font-weight:600;color:var(--muted)}',
    '.car-feed.good{color:var(--good)}',
    '.car-feed.warm{color:var(--accent2)}',
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

  /* ==================================================================
     BOARD CONSTANTS — the playing field is 0..100 board units square.
     ================================================================== */

  var U = 100;                    /* field size in board units             */
  var M = 8;                      /* drawn wooden frame, units each side   */
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
            '<span class="car-chip"><i class="car-dot w"></i>You <b data-r="you">6</b></span>' +
            '<span class="car-chip"><i class="car-dot b"></i>Gattu <b data-r="gattu">6</b></span>' +
            '<span class="car-chip"><i class="car-dot q"></i><span data-r="queen">in the middle</span></span>' +
          '</div>' +
        '</div>' +
        '<div class="car-stage">' +
          '<canvas class="car-canvas" aria-label="Carrom board. Drag back from the striker to flick, or use the keyboard."></canvas>' +
          '<div class="car-over"></div>' +
        '</div>' +
        '<div class="car-gauge" aria-hidden="true"><i></i></div>' +
        '<p class="car-hint">Drag back from the striker and let go to flick &mdash; or Left/Right slide, A and D aim, hold Space and release to shoot.</p>' +
        '<p class="car-feed" role="status" aria-live="polite"></p>' +
      '</div>';

    var canvas = host.querySelector('.car-canvas');
    var over = host.querySelector('.car-over');
    var gauge = host.querySelector('.car-gauge i');
    var feed = host.querySelector('.car-feed');
    var ctx = canvas.getContext('2d');
    var dpr = 1, view = U + 2 * M;

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
      gSx: null,             /* Gattu's placed striker while he lines up    */
      shotPocketed: [],
      queenBy: null, queenPending: false, queenCovered: null,
      rollT: 0,
      winner: null, result: null,
      pops: []               /* decorative pocket-drop ripples              */
    };
    host.__carState = st;

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
    function capture(b) {
      if (!reduced) st.pops.push({ x: b.x, y: b.y, kind: b.kind, owner: b.owner, t: performanceNow() });
      b.dead = true; b.vx = 0; b.vy = 0; b.x = -999; b.y = -999;
      st.shotPocketed.push({ kind: b.kind, owner: b.owner });
    }
    function performanceNow() {
      return (W.performance && W.performance.now) ? W.performance.now() : Date.now();
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
            if (px * px + py * py < cd * cd) { capture(b); break; }
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
      st.gSx = null;
      st.charge = 0; st.charging = false;
    }

    function playerFire() {
      say('');
      fire(st.sx, YOU_Y, st.aimA, MAXV * (0.18 + 0.82 * st.charge), 'you');
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

      var who = s === 'you' ? 'You' : 'Gattu';
      var msg = '', tone = '';

      if (strikerIn) {
        /* foul: the striker went in — the queen (if she fell this shot) and one
           of the shooter's pocketed coins climb back out, and the turn passes */
        if (queenIn) { revive(queenBody()); st.queenBy = null; st.queenPending = false; }
        if (st.queenPending && st.queenBy === s) {
          revive(queenBody()); st.queenBy = null; st.queenPending = false;
        }
        var gave = reviveOneCoin(s);
        msg = (s === 'you' ? 'Oops — the striker went in. ' : 'Gattu sank the striker! ') +
              (gave ? 'One ' + (s === 'you' ? 'white' : 'black') + ' comes back to the middle.' : 'Nothing to give back — lucky.');
        tone = 'warm';
        st.turn = o;
      } else {
        if (queenIn) {
          st.queenBy = s;
          if (own > 0) {
            st.queenPending = false; st.queenCovered = s;
            msg = who + ' pocketed the queen AND covered her — three points!';
            tone = s === 'you' ? 'good' : 'warm';
          } else {
            st.queenPending = true;
            msg = who + ' pocketed the queen! Cover her: a ' + (s === 'you' ? 'white' : 'black') + ' must drop on the very next shot.';
            tone = 'warm';
          }
        } else if (st.queenPending && st.queenBy === s) {
          if (own > 0) {
            st.queenPending = false; st.queenCovered = s;
            msg = 'Covered! The queen stays with ' + (s === 'you' ? 'you' : 'Gattu') + ' — three points.';
            tone = s === 'you' ? 'good' : 'warm';
          } else {
            revive(queenBody()); st.queenBy = null; st.queenPending = false;
            msg = 'No cover, so the queen climbs back out to the middle.';
            tone = 'warm';
          }
        }
        if (!msg) {
          if (own > 0) {
            msg = s === 'you'
              ? 'Shabaash! ' + own + ' white' + (own > 1 ? 's' : '') + ' in — shoot again.'
              : 'Gattu sank ' + own + ' black' + (own > 1 ? 's' : '') + ' — he shoots again.';
            tone = s === 'you' ? 'good' : '';
          } else if (opp > 0) {
            msg = s === 'you'
              ? 'A black went in — that one counts for Gattu. His turn.'
              : 'Gattu knocked a white in — it counts for you! Your turn.';
            tone = s === 'you' ? 'warm' : 'good';
          } else {
            msg = s === 'you' ? 'Nothing dropped — Gattu’s turn.' : 'Gattu missed — your turn.';
          }
        } else if (own > 0) {
          msg += s === 'you' ? ' Shoot again.' : ' He shoots again.';
        }
        st.turn = own > 0 ? s : o;
      }

      refreshHud();

      /* first to clear their colour wins; the queen is a 3-point bonus for
         whoever pocketed-and-covered her */
      if (aliveCount(s) === 0) return endMatch(s, msg);
      if (aliveCount(o) === 0) return endMatch(o, msg);

      say(msg, tone);
      if (st.turn === 'you') {
        st.phase = 'aim';
        st.sx = 50; st.aimA = -Math.PI / 2; st.charge = 0; st.charging = false;
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
      /* a visible beat to line up, then the shot — both timers live in the
         scope, so teardown mid-think leaves nothing behind */
      sc.later(function () {
        if (st.phase !== 'think' || detached(host)) return;
        var plan = planGattu();
        st.gSx = plan.sx;
        sc.later(function () {
          if (st.phase !== 'think' || detached(host)) return;
          say('');
          fire(plan.sx, GATTU_Y, plan.a, plan.v, 'gattu');
        }, 420);
      }, 650 + Math.random() * 450);
    }

    /* ------------------------------------------------------- match flow */
    function refreshHud() {
      var y = host.querySelector('[data-r="you"]'), g = host.querySelector('[data-r="gattu"]');
      var q = host.querySelector('[data-r="queen"]');
      if (y) y.textContent = String(aliveCount('you'));
      if (g) g.textContent = String(aliveCount('gattu'));
      if (q) {
        q.textContent = st.queenCovered ? ('with ' + (st.queenCovered === 'you' ? 'you' : 'Gattu'))
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
      st.gSx = null; st.shotPocketed = []; st.pops = [];
      st.phase = 'aim';
      over.hidden = true;
      refreshHud();
      say('Your shot — you are white. Slide, aim, flick.');
    }

    function endMatch(winner, lastMsg) {
      st.winner = winner;
      st.phase = 'over';
      var score = (6 - aliveCount('you')) + (st.queenCovered === 'you' ? 3 : 0);
      st.result = { win: winner === 'you', score: score };
      say(lastMsg || '');
      over.innerHTML =
        '<div class="car-panel" role="dialog" aria-label="Game over">' +
          '<h3>' + (winner === 'you' ? 'Shabaash — the whites are home!' : 'Gattu cleared his blacks first') + '</h3>' +
          '<p>' + (winner === 'you'
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
          '<p>India’s living-room game &mdash; the board that comes out when the cousins visit. These are the family rules, simplified:</p>' +
          '<ul>' +
            '<li>You play <b>white</b>, Gattu plays black. Pocket one of yours and you shoot again.</li>' +
            '<li>The red <b>queen</b> must be covered &mdash; drop a white on the same or the very next shot, or she climbs back out to the middle.</li>' +
            '<li>Striker in a pocket is a foul: one of your pocketed coins comes back.</li>' +
            '<li>Clear your six first to win. A coin is 1 point, the covered queen is 3.</li>' +
          '</ul>' +
          '<div class="car-row"><button type="button" class="car-btn" data-go="start">Play</button></div>' +
        '</div>';
      over.hidden = false;
      sc.later(function () { focusSoft(over.querySelector('[data-go="start"]')); }, 60);
    }

    /* -------------------------------------------------------- rendering */
    function fit() {
      var stage = canvas.parentNode;
      var size = Math.max(220, Math.min(600, stage.clientWidth || host.clientWidth || 340));
      dpr = W.devicePixelRatio || 1;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.height = 'auto';
    }

    function drawStriker(x, y) {
      ctx.beginPath(); ctx.arc(x, y, RS, 0, Math.PI * 2);
      ctx.fillStyle = '#f3ecda'; ctx.fill();
      ctx.lineWidth = 0.7; ctx.strokeStyle = '#4a6fa5'; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, RS * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(74,111,165,.55)'; ctx.stroke();
    }

    function draw() {
      var size = canvas.width / dpr;
      var scale = size / view;
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * scale * M, dpr * scale * M);
      ctx.clearRect(-M, -M, view, view);

      /* frame and field — warm wood */
      ctx.fillStyle = '#6b4020';
      ctx.fillRect(-M, -M, view, view);
      ctx.fillStyle = '#5a3418';
      ctx.fillRect(-M * 0.45, -M * 0.45, U + M * 0.9, U + M * 0.9);
      ctx.fillStyle = '#e9c893';
      ctx.fillRect(0, 0, U, U);

      /* pockets */
      var i;
      for (i = 0; i < POCKETS.length; i++) {
        ctx.beginPath(); ctx.arc(POCKETS[i][0], POCKETS[i][1], RP, 0, Math.PI * 2);
        ctx.fillStyle = '#2a1a0e'; ctx.fill();
        ctx.beginPath(); ctx.arc(POCKETS[i][0], POCKETS[i][1], RP * 0.62, 0, Math.PI * 2);
        ctx.fillStyle = '#160d06'; ctx.fill();
      }

      /* baselines on all four sides, with the classic end circles */
      ctx.strokeStyle = 'rgba(146,44,26,.85)'; ctx.lineWidth = 0.7;
      var lines = [
        [[SXMIN, YOU_Y], [SXMAX, YOU_Y]], [[SXMIN, YOU_Y + 3.2], [SXMAX, YOU_Y + 3.2]],
        [[SXMIN, GATTU_Y], [SXMAX, GATTU_Y]], [[SXMIN, GATTU_Y - 3.2], [SXMAX, GATTU_Y - 3.2]],
        [[GATTU_Y, SXMIN], [GATTU_Y, SXMAX]], [[GATTU_Y - 3.2, SXMIN], [GATTU_Y - 3.2, SXMAX]],
        [[YOU_Y, SXMIN], [YOU_Y, SXMAX]], [[YOU_Y + 3.2, SXMIN], [YOU_Y + 3.2, SXMAX]]
      ];
      for (i = 0; i < lines.length; i++) {
        ctx.beginPath();
        ctx.moveTo(lines[i][0][0], lines[i][0][1]);
        ctx.lineTo(lines[i][1][0], lines[i][1][1]);
        ctx.stroke();
      }
      var ends = [
        [SXMIN, YOU_Y + 1.6], [SXMAX, YOU_Y + 1.6], [SXMIN, GATTU_Y - 1.6], [SXMAX, GATTU_Y - 1.6],
        [GATTU_Y - 1.6, SXMIN], [GATTU_Y - 1.6, SXMAX], [YOU_Y + 1.6, SXMIN], [YOU_Y + 1.6, SXMAX]
      ];
      for (i = 0; i < ends.length; i++) {
        ctx.beginPath(); ctx.arc(ends[i][0], ends[i][1], 2, 0, Math.PI * 2); ctx.stroke();
      }

      /* centre circle and rosette rings, plus the corner arrows */
      ctx.strokeStyle = 'rgba(146,44,26,.7)';
      ctx.beginPath(); ctx.arc(50, 50, 12.5, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(50, 50, 5.6, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(50, 50, 0.9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(146,44,26,.7)'; ctx.fill();
      ctx.strokeStyle = 'rgba(146,44,26,.35)';
      var dg = [[12, 12, 22, 22], [88, 12, 78, 22], [12, 88, 22, 78], [88, 88, 78, 78]];
      for (i = 0; i < dg.length; i++) {
        ctx.beginPath(); ctx.moveTo(dg[i][0], dg[i][1]); ctx.lineTo(dg[i][2], dg[i][3]); ctx.stroke();
      }

      /* decorative pocket-drop ripples — skipped under reduced motion */
      if (!reduced && st.pops.length) {
        var now = performanceNow(), keep = [];
        for (i = 0; i < st.pops.length; i++) {
          var pop = st.pops[i], age = (now - pop.t) / 260;
          if (age < 1) {
            ctx.beginPath(); ctx.arc(pop.x, pop.y, RC * (1 - age), 0, Math.PI * 2);
            ctx.fillStyle = pop.kind === 'queen' ? 'rgba(184,53,44,' + (1 - age) + ')'
              : pop.kind === 'striker' ? 'rgba(243,236,218,' + (1 - age) + ')'
              : pop.owner === 'you' ? 'rgba(247,236,215,' + (1 - age) + ')'
              : 'rgba(51,41,31,' + (1 - age) + ')';
            ctx.fill();
            keep.push(pop);
          }
        }
        st.pops = keep;
      }

      /* coins, queen, and (while rolling) the live striker */
      for (i = 0; i < st.bodies.length; i++) {
        var b = st.bodies[i];
        if (b.dead) continue;
        if (b.kind === 'striker') { drawStriker(b.x, b.y); continue; }
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.kind === 'queen' ? '#b8352c' : b.owner === 'you' ? '#f7ecd7' : '#33291f';
        ctx.fill();
        ctx.lineWidth = 0.55;
        ctx.strokeStyle = b.kind === 'queen' ? '#7c1d16' : b.owner === 'you' ? '#b98d4f' : '#120d08';
        ctx.stroke();
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = b.kind === 'queen' ? 'rgba(124,29,22,.6)'
          : b.owner === 'you' ? 'rgba(185,141,79,.55)' : 'rgba(120,100,80,.4)';
        ctx.stroke();
      }

      /* your striker on the baseline, with the aim line, while you line up */
      if (st.phase === 'aim' && st.turn === 'you') {
        drawStriker(st.sx, YOU_Y);
        var L = RS + 4 + st.charge * 26;
        var ex = st.sx + Math.cos(st.aimA) * L, ey = YOU_Y + Math.sin(st.aimA) * L;
        ctx.save();
        ctx.setLineDash([2.2, 2.4]);
        ctx.lineWidth = 0.9;
        ctx.strokeStyle = 'rgba(60,28,10,.6)';
        ctx.beginPath();
        ctx.moveTo(st.sx + Math.cos(st.aimA) * (RS + 1), YOU_Y + Math.sin(st.aimA) * (RS + 1));
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.setLineDash([]);
        var aa = st.aimA;
        ctx.beginPath();
        ctx.moveTo(ex + Math.cos(aa) * 2.4, ey + Math.sin(aa) * 2.4);
        ctx.lineTo(ex + Math.cos(aa + 2.6) * 2, ey + Math.sin(aa + 2.6) * 2);
        ctx.lineTo(ex + Math.cos(aa - 2.6) * 2, ey + Math.sin(aa - 2.6) * 2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(60,28,10,.6)';
        ctx.fill();
        ctx.restore();
      }

      /* Gattu's striker while he lines up his shot */
      if (st.phase === 'think' && st.gSx != null) drawStriker(st.gSx, GATTU_Y);

      if (gauge) gauge.style.width = Math.round(st.charge * 100) + '%';
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
      if (st.charging && st.phase === 'aim' && st.turn === 'you') {
        st.charge = Math.min(1, st.charge + dt * 0.75);
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

    /* ------------------------------------------------------------ input */
    function toBoard(e) {
      var r = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) / r.width * view - M,
        y: (e.clientY - r.top) / r.height * view - M
      };
    }

    var drag = null;
    sc.on(canvas, 'pointerdown', function (e) {
      if (st.phase !== 'aim' || st.turn !== 'you') return;
      var p = toBoard(e);
      var dx = p.x - st.sx, dy = p.y - YOU_Y;
      if (dx * dx + dy * dy < (RS * 2.6) * (RS * 2.6)) {
        drag = { mode: 'sling' };
      } else if (Math.abs(dy) < 8) {
        /* tap (or drag along) the baseline to place the striker */
        drag = { mode: 'place' };
        st.sx = clamp(p.x, SXMIN, SXMAX);
      }
      if (drag) {
        e.preventDefault();
        try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });
    sc.on(canvas, 'pointermove', function (e) {
      if (!drag || st.phase !== 'aim') return;
      var p = toBoard(e);
      if (drag.mode === 'place') { st.sx = clamp(p.x, SXMIN, SXMAX); return; }
      /* sling: pull back from the striker; the shot goes the opposite way */
      var dx = st.sx - p.x, dy = YOU_Y - p.y;
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len > 1.2) st.aimA = Math.atan2(dy, dx);
      st.charge = clamp((len - 2) / 26, 0, 1);
    });
    function pointerEnd(e) {
      if (!drag) return;
      var was = drag; drag = null;
      if (was.mode === 'sling' && st.phase === 'aim' && st.turn === 'you') {
        if (st.charge > 0.06) playerFire();
        else st.charge = 0;
      }
    }
    sc.on(canvas, 'pointerup', pointerEnd);
    sc.on(canvas, 'pointercancel', pointerEnd);

    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      /* on the intro / result cards, keys stay with the focused button */
      if (st.phase !== 'aim' || st.turn !== 'you') return;
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
        if (st.phase === 'aim' && st.turn === 'you') playerFire();
      }
    });

    sc.on(host, 'click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-go]') : null;
      if (!t) return;
      var what = t.getAttribute('data-go');
      if (what === 'start' || what === 'again') startMatch();
      else if (what === 'out') bail();
    });

    sc.on(W, 'resize', fit);

    /* ------------------------------------------------------------- boot */
    buildCoins();
    refreshHud();
    fit();
    showIntro();
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
