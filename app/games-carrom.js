/* Bizzing India — heritage game: CARROM (games spec §4.7, docs/32).

   India's living-room board game, the one that comes out when the cousins visit. You play the
   white coins; Gattu plays black. The family rules, simplified honestly for a child.

   "Not smooth, difficult UX-wise" (owner, 8 Oct 2026). The physics was good; the HANDLING was
   not. This build is the handling:

     · FULL-SCREEN during a match: the stage takes the viewport with a small ✕ and the score;
       on a 390 × 844 phone the board is ≥ 360 px (≥ 94% of the width), the striker's hit area
       ≥ 44 px; landscape puts the board at full height with the controls beside it. ✕ or Esc
       pauses back into the app's normal frame.
     · ONE GESTURE, ONE JOB, in a real player's order:
         Place  drag the striker (or anywhere behind your line) — it only slides, never fires
         Aim    tap or drag anywhere ahead — the line runs to the first coin it meets, with a
                ghost striker at contact and a short arrow for where that coin goes
         Shoot  pull the POWER PAD under the board to the right, let go — fill + 0–100 number,
                never under the finger
         Cancel slide back into the pad's ✕ end, or lift outside the pad — zero power
       Desktop: the mouse points to aim, the wheel fine-tunes, hold and release on the board to
       shoot. Keys: ←/→ place, ↑/↓ aim 1° (Shift 0.25°), hold Space for power, Esc cancels.
       ‹ › nudge 0.5°. The flick sling survives only as a setting, anchored on the striker, with
       the same cancel.
     · SMOOTH: fixed 120 Hz physics drawn with interpolation between steps; coins ease to rest
       (exponential + linear friction); a pocket drop (off under reduced motion); no layout or
       fit() during play; Gattu thinks under 0.8 s on the one RAF clock.
     · A three-step first-shot coach (Place → Aim → Shoot), once, replayable from "?".
     · Sounds through window.IND_SFX only (striker click, coin knock, wall thud, pocket drop).
     · Gattu's wobble is deterministic (a seeded sequence) and widens after the child loses two
       in a row, narrows after two wins. A Short match (first to five coins) is offered.
     · Heritage play (docs/32): it reports no answers and pays nothing — "played for fun".

   Physics: fixed 120 Hz steps inside RAF, circle-circle elastic collisions with positional
   correction iterated 4× per step, wall restitution, a hard speed cap and a sleep threshold.
   At the capped speed a body moves 1 board-unit per step — well under a coin radius — so
   nothing can tunnel through a wall even at full power. Every timer is on the same RAF clock
   with delta time, and the loop stops while the page is hidden. */

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
    'html.gm-fullscreen,html.gm-fullscreen body{overflow:hidden!important;overscroll-behavior:none}',
    '.car-wrap{--car-bg1:#3a2410;--car-bg2:#170c04;--car-ink:#fff6e6;position:relative;display:flex;flex-direction:column;gap:8px;color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}',
    'html[data-mode="night"] .car-wrap{--car-bg1:#1c1428;--car-bg2:#08050e}',
    '.car-wrap.car-full{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1200;gap:0;color:var(--car-ink);padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);' +
      'background:radial-gradient(60% 50% at 50% 45%,rgba(255,196,120,.14),transparent 70%),radial-gradient(rgba(255,226,180,.06) 1.2px,transparent 1.6px) 0 0/24px 24px,radial-gradient(120% 90% at 50% 30%,var(--car-bg1),var(--car-bg2))}',
    '.car-top{display:none;align-items:center;gap:8px;padding:4px 8px;height:52px;box-sizing:border-box;flex:none}',
    '.car-full .car-top{display:flex}',
    '.car-ib{flex:none;min-width:44px;height:44px;border-radius:999px;border:1.5px solid rgba(255,236,200,.35);background:rgba(255,236,200,.1);color:var(--car-ink);font:800 17px/1 var(--body,system-ui);cursor:pointer;padding:0 10px}',
    '.car-ib:focus-visible,.car-nudge:focus-visible,.car-pad:focus-visible{outline:3px solid #fff;outline-offset:2px}',
    '.car-score{flex:1;display:flex;gap:6px;justify-content:center;align-items:center;flex-wrap:nowrap;min-width:0;overflow:hidden}',
    '.car-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,236,200,.1);border:1px solid rgba(255,236,200,.25);border-radius:999px;padding:5px 10px;font:700 13px var(--body,inherit);white-space:nowrap;color:var(--car-ink)}',
    '.car-chip b{font-size:15px}',
    '.car-dot{width:12px;height:12px;border-radius:50%;border:1px solid rgba(0,0,0,.35);display:inline-block;flex:none}',
    '.car-dot.w{background:radial-gradient(circle at 35% 30%,#fffbe9,#e3cd9d)}',
    '.car-dot.b{background:radial-gradient(circle at 35% 30%,#7a634c,#20150c);border-color:rgba(255,255,255,.4)}',
    '.car-dot.q{background:radial-gradient(circle at 35% 30%,#e05a44,#8e1f14)}',
    '.car-main{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;min-height:0}',
    '.car-full .car-main{justify-content:center;padding:4px 6px 8px}',
    '.car-full.car-land .car-main{flex-direction:row;gap:20px}',
    '.car-side{display:flex;flex-direction:column;gap:8px;align-items:stretch;width:100%}',
    '.car-full .car-side{max-width:var(--car-bw,560px)}',
    '.car-full.car-land .car-side{width:300px;flex:none}',
    '.car-wrap:not(.car-full) .car-side{display:none}',
    '.car-stage{position:relative;line-height:0;flex:none}',
    '.car-canvas{display:block;border-radius:14px;box-shadow:0 2px 6px rgba(40,20,5,.25),0 18px 44px rgba(0,0,0,.45);touch-action:none;cursor:crosshair;outline:none}',
    '.car-wrap:not(.car-full) .car-canvas{max-width:100%;height:auto!important}',
    '.car-canvas:focus-visible{outline:2px solid var(--accent2,#e9a13b);outline-offset:3px}',
    '.car-canvas.grab{cursor:grab}',
    '.car-ctl{display:flex;align-items:stretch;gap:8px;width:100%}',
    '.car-nudge{flex:none;width:48px;min-height:60px;border-radius:14px;border:1.5px solid rgba(255,236,200,.3);background:rgba(255,236,200,.08);color:var(--car-ink);font:800 26px/1 var(--body,system-ui);cursor:pointer;touch-action:manipulation}',
    '.car-pad{position:relative;flex:1;min-width:0;height:60px;border-radius:16px;overflow:hidden;touch-action:none;cursor:ew-resize;' +
      'background:linear-gradient(180deg,#2a1708,#3a2210);border:1.5px solid rgba(255,214,150,.35);box-shadow:inset 0 2px 8px rgba(0,0,0,.5)}',
    '.car-padx{position:absolute;left:0;top:0;bottom:0;width:52px;display:grid;place-items:center;font:800 20px/1 var(--body,system-ui);color:#ffb4a4;background:rgba(217,79,61,.16);border-right:1px dashed rgba(255,180,160,.4);z-index:2}',
    '.car-pad.at-x .car-padx{background:rgba(217,79,61,.6);color:#fff}',
    '.car-padfill{position:absolute;left:52px;top:0;bottom:0;width:0;background:linear-gradient(90deg,#1fa971,#e9a13b 60%,#d94f3d);opacity:.9;transform-origin:left}',
    '.car-padlbl{position:absolute;left:62px;right:12px;top:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:8px;font:700 14px/1.2 var(--body,system-ui);color:rgba(255,240,215,.85);pointer-events:none;text-align:center}',
    '.car-pad.on .car-padlbl{opacity:0}',
    '.car-padgrip{position:absolute;left:58px;top:12px;bottom:12px;width:10px;border-radius:5px;background:repeating-linear-gradient(180deg,rgba(255,236,200,.55) 0 2px,transparent 2px 6px)}',
    '.car-pow{position:fixed;left:0;top:0;z-index:1210;pointer-events:none;min-width:58px;padding:7px 12px;border-radius:999px;background:#fff6e0;color:#2a1606;font:900 22px/1 var(--body,system-ui);text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.4);display:none}',
    '.car-pow.on{display:block}',
    '.car-pow.x{background:#d94f3d;color:#fff}',
    '.car-feed{min-height:22px;margin:0;text-align:center;font-size:14px;font-weight:700;color:var(--muted);line-height:1.35}',
    '.car-full .car-feed{color:var(--car-ink);text-shadow:0 1px 2px rgba(0,0,0,.6)}',
    '.car-feed.tone-y{color:#7be0a9}',
    '.car-feed.tone-h{color:#ffd27a}',
    '.car-wrap:not(.car-full) .car-feed.tone-y{color:var(--good,#1fa971)}',
    '.car-wrap:not(.car-full) .car-feed.tone-h{color:var(--accent2,#c07a12)}',
    '.car-over{position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;z-index:5;display:grid;place-items:center;background:rgba(26,14,5,.55);border-radius:16px;padding:12px;line-height:1.4;backdrop-filter:blur(2px)}',
    '.car-full .car-over{top:0;right:0;bottom:0;left:0;border-radius:0}',
    '.car-over[hidden]{display:none}',
    '.car-panel{display:flex;flex-direction:column;background:var(--card,#fff);color:var(--text,#2a1a0c);border:1px solid var(--line);border-radius:var(--radius-lg,16px);box-shadow:var(--shadow-lg,0 12px 40px rgba(0,0,0,.2));padding:16px 18px;max-width:430px;max-height:100%;text-align:left}',
    '.car-panel h3{font:800 20px var(--display,Georgia,serif);margin:0 0 8px}',
    '.car-panel p{margin:0 0 8px;font-size:14px;line-height:1.5}',
    '.car-panel ul{margin:0 0 6px;padding-left:18px;font-size:13.5px;line-height:1.5;overflow:auto;min-height:0}',
    '.car-panel li{margin:0 0 5px}',
    '.car-panel label{display:flex;gap:10px;align-items:center;font:600 14px/1.4 var(--body,system-ui);min-height:44px;cursor:pointer}',
    '.car-panel input[type=checkbox]{width:22px;height:22px}',
    '.car-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px;flex:none}',
    '.car-btn{cursor:pointer;min-height:44px;padding:10px 20px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:#fff;font:700 15px var(--body,inherit)}',
    '.car-btn.ghost{background:transparent;color:var(--text);border-color:var(--line2,var(--line))}',
    '.car-btn:hover{filter:brightness(1.06)}',
    '.car-btn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    /* the coach: three bubbles with arrows, over the board, never in the way of a tap */
    '.car-coach{position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;z-index:4}',
    '.car-coach[hidden]{display:none}',
    '.car-tip{position:absolute;max-width:270px;background:#fff6e0;color:#2a1606;border-radius:14px;padding:10px 12px;box-shadow:0 10px 30px rgba(0,0,0,.45);font:700 14.5px/1.4 var(--body,system-ui);pointer-events:auto;transform:translate(-50%,-100%)}',
    '.car-tip b{color:#9c2f1d}',
    '.car-tip:after{content:"";position:absolute;left:50%;bottom:-9px;margin-left:-9px;border:9px solid transparent;border-bottom:0;border-top-color:#fff6e0}',
    '.car-tip .car-tiprow{display:flex;gap:8px;justify-content:flex-end;margin-top:6px}',
    '.car-tip button{min-height:44px;padding:0 14px;border-radius:999px;border:1.5px solid #c9a670;background:transparent;font:800 13px var(--body,system-ui);color:#2a1606;cursor:pointer}',
    '@keyframes car-bob{0%,100%{margin-top:0}50%{margin-top:-6px}}',
    '.car-tip{animation:car-bob 1.4s ease-in-out infinite}',
    '@media(max-width:440px){.car-top{gap:6px;padding:4px 6px}.car-score{gap:4px}.car-chip{padding:4px 7px;gap:4px;font-size:12px}.car-chip b{font-size:13.5px}.car-qt{display:none}.car-padlbl{font-size:13px}}',
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
     SMALL HELPERS
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
  function scope() {
    var offs = [], dead = false;
    return {
      get dead() { return dead; },
      on: function (target, type, fn, opts) {
        if (!target || !target.addEventListener) return;
        target.addEventListener(type, fn, opts || false);
        offs.push(function () { target.removeEventListener(type, fn, opts || false); });
      },
      kill: function () {
        if (dead) return;
        dead = true;
        for (var j = 0; j < offs.length; j++) { try { offs[j](); } catch (e) {} }
        offs = [];
      }
    };
  }
  function detached(host) {
    return !!(D.body && host && host.nodeType === 1 && !D.body.contains(host));
  }
  /* deterministic sequences: the wood grain, and Gattu's wobble (nothing random anywhere) */
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
  function kidStore() {
    var S = W.IND_STORE;
    return {
      get: function (k, d) { try { var v = S && S.kidGet ? S.kidGet(k) : null; return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
      set: function (k, v) { try { if (S && S.kidSet) S.kidSet(k, JSON.stringify(v)); } catch (e) {} }
    };
  }
  /* every sound through the family's one path; a kind it does not know falls back to one it does */
  function sfx(kind, fallback) {
    var S = W.IND_SFX;
    if (!S || !S.play) return;
    var k = S.KINDS && S.KINDS.indexOf(kind) >= 0 ? kind : fallback;
    if (k) S.play(k);
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
  var FR_LIN = 20, FR_EXP = 0.2;  /* friction: linear + exponential, so a  */
                                  /* coin eases to rest instead of a cliff */
  var MAXV = 120;                 /* hard speed cap: 1 unit/step           */
  var WALL_E = 0.72;
  var COIN_E = 0.9;
  var SLEEP = 1.2;                /* below this speed a body goes to rest  */
  var DEG = Math.PI / 180;
  /* layout of the full-screen stage, in CSS px — constants, so fit() never measures in play */
  var TOPH = 52, CTLH = 68, FEEDH = 30, SIDEW = 300;
  var WOBBLE = [0.085, 0.066, 0.05, 0.038, 0.028];   /* Gattu's aim spread by level, radians */

  var INK = '#9c2f1d';
  var WOOD_HI = '#f2e0ba', WOOD_LO = '#e2c48d';

  function captureDist(r) { return RP - r * 0.35; }

  /* A BOARD FROM THE SHOP (FIX-INDIA K4): only the wood changes. */
  var SKINS = { 'board-rosewood': ['#c9955f', '#a8703f'], 'board-teak': ['#f7ead0', '#ecd6a9'] };

  /* ==================================================================
     THE ENGINE
     ================================================================== */

  function carrom(host, opts, done) {
    injectCSS();
    opts = opts || {};
    var sk = SKINS[opts.skin || ''] || ['#f2e0ba', '#e2c48d'];
    WOOD_HI = sk[0]; WOOD_LO = sk[1];
    var sc = scope();
    var reduced = !!opts.reduced || reducedMotion();
    var calmMode = !!opts.calm;
    var finished = false, full = false;
    var rafId = 0, lastT = 0, acc = 0, vclock = 0, waits = [];
    var store = kidStore();
    var mem = store.get('carrom.gattu', { lvl: 2, run: [] });
    var slingOn = !!store.get('carrom.sling', false);
    var coached = !!store.get('carrom.coached', false);
    var matchNo = store.get('carrom.matches', 0) | 0;
    var wob = rng(9001 + matchNo * 7919);

    /* ---------------------------------------------------------- markup */
    host.innerHTML =
      '<div class="car-wrap">' +
        '<div class="car-top">' +
          '<button type="button" class="car-ib" data-go="pause" aria-label="Pause and leave full screen">&#10005;</button>' +
          '<div class="car-score">' +
            '<span class="car-chip"><i class="car-dot w"></i><span data-nm="you">You</span> <b data-r="you">0</b></span>' +
            '<span class="car-chip" aria-label="the queen"><i class="car-dot q"></i><span class="car-qt" data-r="queen">queen</span></span>' +
            '<span class="car-chip"><i class="car-dot b"></i><span data-nm="gattu">Gattu</span> <b data-r="gattu">0</b></span>' +
          '</div>' +
          '<button type="button" class="car-ib" data-go="coach" aria-label="How to shoot">?</button>' +
          '<button type="button" class="car-ib" data-go="settings" aria-label="Settings">&#9881;</button>' +
        '</div>' +
        '<div class="car-main">' +
          '<div class="car-stage">' +
            '<canvas class="car-canvas" tabindex="0" aria-label="Carrom board. Drag the striker or press Left and Right to place it; tap ahead, point with the mouse, or press Up and Down to aim; pull the power pad or hold Space to shoot; Escape cancels."></canvas>' +
          '</div>' +
          '<div class="car-side">' +
            '<div class="car-ctl">' +
              '<button type="button" class="car-nudge" data-nudge="-1" aria-label="Turn the aim left a little">&#8249;</button>' +
              '<div class="car-pad" role="slider" tabindex="-1" aria-label="Power pad: pull to the right, let go to shoot; slide back to the cross to cancel" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
                '<span class="car-padx" aria-hidden="true">&#10005;</span>' +
                '<span class="car-padfill"></span>' +
                '<span class="car-padgrip" aria-hidden="true"></span>' +
                '<span class="car-padlbl">Pull &rarr; to shoot</span>' +
              '</div>' +
              '<button type="button" class="car-nudge" data-nudge="1" aria-label="Turn the aim right a little">&#8250;</button>' +
            '</div>' +
            '<p class="car-feed" role="status" aria-live="polite"></p>' +
          '</div>' +
          '<div class="car-coach" hidden></div>' +
        '</div>' +
        '<div class="car-pow" aria-hidden="true">0</div>' +
        '<div class="car-over"></div>' +
      '</div>';

    var wrapEl = host.querySelector('.car-wrap');
    var mainEl = host.querySelector('.car-main');
    var canvas = host.querySelector('.car-canvas');
    var over = host.querySelector('.car-over');
    var feed = host.querySelector('.car-feed');
    var pad = host.querySelector('.car-pad');
    var padFill = host.querySelector('.car-padfill');
    var powEl = host.querySelector('.car-pow');
    var coachEl = host.querySelector('.car-coach');
    var ctx = canvas.getContext('2d');
    var dpr = 1, cssSize = 0;
    var board = null;

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

    var lastSay = '';
    function say(msg, tone) {
      if (!feed) return;
      msg = msg || '';
      var cls = 'car-feed' + (tone ? ' tone-' + tone : '');
      if (msg === lastSay && feed.className === cls) return;
      lastSay = msg;
      feed.textContent = msg;
      feed.className = cls;
    }
    /* one RAF clock for every wait: hidden tab, no time passes */
    function wait(ms, fn) { waits.push({ at: vclock + ms, fn: fn }); }

    /* ------------------------------------------------------- game state
       Exposed on the host as __carState so the checks read real positions; nothing in the app
       reads it. */
    var st = {
      bodies: [], phase: 'intro', turn: 'you', shooter: 'you',
      sx: 50, aimA: -Math.PI / 2, charge: 0, charging: false, chargeBy: null,
      gSx: null, gT0: 0, gPlan: null,
      shotPocketed: [], queenBy: null, queenPending: false, queenCovered: null,
      rollT: 0, winner: null, result: null, pops: [],
      short: false, shots: 0, fired: 0, cancels: 0,
      dbg: { hole: null, ghost: null, pow: null, fits: 0, work: [], slow: [] }
    };
    host.__carState = st;

    var vs = 'gattu';
    function human(side) { return side === 'you' || vs === '2p'; }
    function baseY(side) { return side === 'you' ? YOU_Y : GATTU_Y; }
    function nmS(side) {
      return side === 'you' ? (vs === '2p' ? 'Player 1' : 'You') : (vs === '2p' ? 'Player 2' : 'Gattu');
    }
    function colr(side) { return side === 'you' ? 'white' : 'black'; }
    /* "ahead" is up-board for white, down-board for black; the aim never points back */
    function clampAim(a, side) {
      if (side === 'you') { if (a > 0) a = a > Math.PI / 2 ? -Math.PI + 0.12 : -0.12; return clamp(a, -Math.PI + 0.12, -0.12); }
      if (a < 0) a = a < -Math.PI / 2 ? Math.PI - 0.12 : 0.12;
      return clamp(a, 0.12, Math.PI - 0.12);
    }

    /* ----------------------------------------------------------- board */
    function body(kind, owner, x, y) { return { kind: kind, owner: owner, x: x, y: y, px: x, py: y, vx: 0, vy: 0, r: RC, m: 1, dead: false }; }
    function buildCoins() {
      var bodies = [body('queen', null, 50, 50)], i, a;
      for (i = 0; i < 6; i++) {
        a = i * Math.PI / 3;
        bodies.push(body('coin', (i % 2 === 0) ? 'you' : 'gattu', 50 + 5.45 * Math.cos(a), 50 + 5.45 * Math.sin(a)));
      }
      for (i = 0; i < 6; i++) {
        a = i * Math.PI / 3 + Math.PI / 6;
        bodies.push(body('coin', (i % 2 === 0) ? 'gattu' : 'you', 50 + 10.9 * Math.cos(a), 50 + 10.9 * Math.sin(a)));
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
      return { x: 50, y: 50 };
    }
    function revive(b) {
      var p = findFreeSpot();
      b.dead = false; b.x = b.px = p.x; b.y = b.py = p.y; b.vx = 0; b.vy = 0;
    }
    function reviveOneCoin(owner) {
      for (var i = 0; i < st.bodies.length; i++) {
        var b = st.bodies[i];
        if (b.kind === 'coin' && b.owner === owner && b.dead) { revive(b); return true; }
      }
      return false;
    }

    /* --------------------------------------------------------- physics */
    var knockAt = -1, thudAt = -1;
    function capture(b, pk) {
      if (!reduced) {
        st.pops.push({ x0: b.x, y0: b.y, px: pk[0], py: pk[1], kind: b.kind, owner: b.owner, r: b.r, t: vclock });
      }
      sfx('pocket', 'coin');
      b.dead = true; b.vx = 0; b.vy = 0; b.x = b.px = -999; b.y = b.py = -999;
      st.shotPocketed.push({ kind: b.kind, owner: b.owner });
    }
    function physStep(dt) {
      var bs = st.bodies, i, j, b, c;
      for (i = 0; i < bs.length; i++) {
        b = bs[i];
        if (b.dead) continue;
        b.px = b.x; b.py = b.y;
        var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (sp > 0) {
          var ns = sp - (FR_LIN + FR_EXP * sp) * dt;
          if (ns < 0) ns = 0;
          if (ns > MAXV) ns = MAXV;
          var k = ns / sp;
          b.vx *= k; b.vy *= k;
        }
        b.x += b.vx * dt; b.y += b.vy * dt;
      }
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
            var ov = rr - d;
            b.x -= nx * ov * (im1 / tot); b.y -= ny * ov * (im1 / tot);
            c.x += nx * ov * (im2 / tot); c.y += ny * ov * (im2 / tot);
            var vn = (c.vx - b.vx) * nx + (c.vy - b.vy) * ny;
            if (vn < 0) {
              if (-vn > 14 && st.rollT - knockAt > 0.06) { knockAt = st.rollT; sfx('knock', 'tap'); }
              var imp = -(1 + COIN_E) * vn / tot;
              b.vx -= imp * im1 * nx; b.vy -= imp * im1 * ny;
              c.vx += imp * im2 * nx; c.vy += imp * im2 * ny;
            }
          }
          for (j = 0; j < POCKETS.length; j++) {
            var qx = POCKETS[j][0] - b.x, qy = POCKETS[j][1] - b.y;
            var cd = captureDist(b.r);
            if (qx * qx + qy * qy < cd * cd) { capture(b, POCKETS[j]); break; }
          }
          if (b.dead) continue;
          var hit = 0;
          if (b.x < b.r) { b.x = b.r; if (b.vx < 0) { hit = -b.vx; b.vx = -b.vx * WALL_E; } }
          if (b.x > U - b.r) { b.x = U - b.r; if (b.vx > 0) { hit = b.vx; b.vx = -b.vx * WALL_E; } }
          if (b.y < b.r) { b.y = b.r; if (b.vy < 0) { hit = -b.vy; b.vy = -b.vy * WALL_E; } }
          if (b.y > U - b.r) { b.y = U - b.r; if (b.vy > 0) { hit = b.vy; b.vy = -b.vy * WALL_E; } }
          if (hit > 18 && st.rollT - thudAt > 0.08) { thudAt = st.rollT; sfx('thud', 'tap'); }
        }
      }
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
    function settle() {
      for (var i = 0; i < st.bodies.length; i++) { var b = st.bodies[i]; b.px = b.x; b.py = b.y; }
    }

    /* ------------------------------------------------------------ turns */
    function fire(x, y, angle, speed, shooter) {
      speed = clamp(speed, 8, MAXV);
      var s = body('striker', shooter, clamp(x, RS, U - RS), y);
      s.r = RS; s.m = 1.6; s.vx = Math.cos(angle) * speed; s.vy = Math.sin(angle) * speed;
      st.bodies.push(s);
      st.shooter = shooter; st.shotPocketed = []; st.rollT = 0; knockAt = thudAt = -1;
      st.phase = 'rolling'; acc = 0;
      st.gSx = null; st.gPlan = null;
      st.charge = 0; st.charging = false; st.chargeBy = null;
      st.shots++; if (human(shooter)) st.fired++; else st.dbg.thinkMs = vclock - (st.dbg.think0 || vclock);
      powerUI();
      sfx('click', 'tap');
      if (!calmMode && human(shooter) && W.navigator && W.navigator.vibrate) { try { W.navigator.vibrate(10); } catch (e) {} }
      if (coachStep === 3) coachDone();
    }
    function playerFire() {
      if (st.phase !== 'aim' || !human(st.turn)) return;
      say('');
      fire(st.sx, baseY(st.turn), st.aimA, MAXV * (0.16 + 0.84 * st.charge), st.turn);
    }
    function cancelShot(why) {
      if (!st.charging && !st.charge && !drag) return false;
      st.charging = false; st.charge = 0; st.chargeBy = null; st.cancels++;
      drag = null; padDrag = null;
      pad.classList.remove('on', 'at-x');
      powerUI();
      say(why || 'Cancelled — no shot.', '');
      return true;
    }
    function scoreOf(side) { return (6 - aliveCount(side)); }

    function resolveShot() {
      for (var i = st.bodies.length - 1; i >= 0; i--) {
        if (st.bodies[i].kind === 'striker') st.bodies.splice(i, 1);
      }
      settle();
      var s = st.shooter, o = s === 'you' ? 'gattu' : 'you';
      var own = 0, opp = 0, queenIn = false, strikerIn = false;
      for (i = 0; i < st.shotPocketed.length; i++) {
        var p = st.shotPocketed[i];
        if (p.kind === 'striker') strikerIn = true;
        else if (p.kind === 'queen') queenIn = true;
        else if (p.owner === s) own++;
        else opp++;
      }
      var who = nmS(s), msg = '', tone = '';
      if (strikerIn) {
        if (queenIn) { revive(queenBody()); st.queenBy = null; st.queenPending = false; }
        if (st.queenPending && st.queenBy === s) { revive(queenBody()); st.queenBy = null; st.queenPending = false; }
        var gave = reviveOneCoin(s);
        msg = (vs === '2p' ? who + ' sank the striker — foul! ' : s === 'you' ? 'Oops — the striker went in. ' : 'Gattu sank the striker! ') +
              (gave ? 'One ' + colr(s) + ' comes back to the middle.' : 'Nothing to give back.');
        tone = 'h';
        st.turn = o;
      } else {
        if (queenIn) {
          st.queenBy = s;
          if (own > 0) { st.queenPending = false; st.queenCovered = s; msg = who + ' pocketed the queen AND covered her — three points!'; tone = human(s) ? 'y' : 'h'; }
          else { st.queenPending = true; msg = who + ' pocketed the queen! Cover her: a ' + colr(s) + ' must drop on the very next shot.'; tone = 'h'; }
        } else if (st.queenPending && st.queenBy === s) {
          if (own > 0) { st.queenPending = false; st.queenCovered = s; msg = 'Covered! The queen stays with ' + (vs === '2p' ? who : (s === 'you' ? 'you' : 'Gattu')) + ' — three points.'; tone = human(s) ? 'y' : 'h'; }
          else { revive(queenBody()); st.queenBy = null; st.queenPending = false; msg = 'No cover, so the queen climbs back out to the middle.'; tone = 'h'; }
        }
        if (!msg) {
          if (own > 0) {
            msg = vs === '2p' ? 'Shabaash! ' + who + ' sank ' + own + ' ' + colr(s) + (own > 1 ? 's' : '') + ' — shoot again.'
              : s === 'you' ? 'Shabaash! ' + own + ' white' + (own > 1 ? 's' : '') + ' in — shoot again.'
              : 'Gattu sank ' + own + ' black' + (own > 1 ? 's' : '') + ' — he shoots again.';
            tone = human(s) ? 'y' : '';
          } else if (opp > 0) {
            msg = vs === '2p' ? 'A ' + colr(o) + ' went in — that one counts for ' + nmS(o) + '. Their turn.'
              : s === 'you' ? 'A black went in — that one counts for Gattu. His turn.'
              : 'Gattu knocked a white in — it counts for you! Your turn.';
            tone = s === 'you' ? 'h' : 'y';
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
      var goal = st.short ? 5 : 6;
      if (scoreOf(s) >= goal) return endMatch(s, msg);
      if (scoreOf(o) >= goal) return endMatch(o, msg);
      if (vs === '2p' && st.turn !== s) {
        msg += ' Hand the board — ' + nmS(st.turn) + ' (' + colr(st.turn) + ') shoots from the ' + (st.turn === 'you' ? 'bottom' : 'top') + '.';
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
       His easiest honest shot (a coin with a clear-ish line to a pocket), aimed with a wobble from
       a seeded sequence — the same match plays the same way — whose width is his level. */
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
    function wobble(w) { return (wob() + wob() - 1) * w; }
    function planGattu() {
      var targets = [], i, j, k, b;
      for (i = 0; i < st.bodies.length; i++) {
        b = st.bodies[i];
        if (b.dead) continue;
        if (b.kind === 'coin' && b.owner === 'gattu') targets.push(b);
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
          var gx = t.x - dCPx * (t.r + RS), gy = t.y - dCPy * (t.r + RS);
          if (gx < RS || gx > U - RS || gy < GATTU_Y + 2) continue;
          for (k = SXMIN; k <= SXMAX; k += 7) {
            var sgx = gx - k, sgy = gy - GATTU_Y;
            var lenSG = Math.sqrt(sgx * sgx + sgy * sgy);
            if (lenSG < 4) continue;
            var quality = (sgx / lenSG) * dCPx + (sgy / lenSG) * dCPy;
            if (quality < 0.3) continue;
            var blk = blockers(k, GATTU_Y, gx, gy, t) + blockers(t.x, t.y, pk[0], pk[1], t);
            var score = quality * 3 - lenSG * 0.01 - lenCP * 0.012 - blk * 1.5 - (t.kind === 'queen' ? 0.4 : 0);
            if (!best || score > best.score) {
              best = { score: score, sx: k, a: Math.atan2(sgy, sgx), v: clamp(34 + lenSG * 0.55 + lenCP * 0.9, 42, 108) };
            }
          }
        }
      }
      var w = WOBBLE[clamp(mem.lvl | 0, 0, WOBBLE.length - 1)];
      if (best) {
        best.a += wobble(w);
        best.v = clamp(best.v + wobble(12), 40, 110);
        return best;
      }
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
      return { sx: fx, a: Math.atan2(ty - GATTU_Y, tx - fx) + wobble(w * 1.6), v: 70 };
    }
    /* he decides at once (cheap, and nothing is laid out), thinks visibly for under 0.8 s, slides,
       and shoots — all on the RAF clock */
    function gattuTurn() {
      st.phase = 'think';
      st.dbg.think0 = vclock;
      var plan = planGattu();
      say('Gattu is thinking…');
      wait(reduced ? 200 : 320, function () {
        if (st.phase !== 'think') return;
        st.gPlan = plan; st.gSx = plan.sx; st.gT0 = vclock;
        wait(reduced ? 200 : 380, function () {
          if (st.phase !== 'think') return;
          say('');
          fire(plan.sx, GATTU_Y, plan.a, plan.v, 'gattu');
        });
      });
    }

    /* ------------------------------------------------------- match flow */
    function refreshHud() {
      var y = host.querySelector('[data-r="you"]'), g = host.querySelector('[data-r="gattu"]');
      var ny = host.querySelector('[data-nm="you"]'), ng = host.querySelector('[data-nm="gattu"]');
      var goal = st.short ? 5 : 6;
      if (ny) ny.textContent = vs === '2p' ? 'P1' : 'You';
      if (ng) ng.textContent = vs === '2p' ? 'P2' : 'Gattu';
      if (y) y.textContent = scoreOf('you') + '/' + goal;
      if (g) g.textContent = scoreOf('gattu') + '/' + goal;
      var q = host.querySelector('[data-r="queen"]');
      if (q) {
        q.textContent = st.queenCovered ? ('with ' + (vs === '2p' ? (st.queenCovered === 'you' ? 'P1' : 'P2') : st.queenCovered === 'you' ? 'you' : 'Gattu'))
          : st.queenPending ? 'cover her!' : 'queen';
      }
    }
    function goFull(on) {
      full = !!on;
      wrapEl.classList.toggle('car-full', full);
      try { D.documentElement.classList.toggle('gm-fullscreen', full); } catch (e) {}
      fit();
    }
    function startMatch(mode) {
      if (mode === '2p') vs = '2p'; else vs = 'gattu';
      st.short = mode === 'short';
      buildCoins();
      st.queenBy = null; st.queenPending = false; st.queenCovered = null;
      st.winner = null; st.result = null;
      st.turn = 'you'; st.shooter = 'you';
      st.sx = 50; st.aimA = -Math.PI / 2; st.charge = 0; st.charging = false;
      st.gSx = null; st.gPlan = null; st.shotPocketed = []; st.pops = [];
      st.phase = 'aim';
      over.hidden = true;
      goFull(true);
      refreshHud();
      say(vs === '2p' ? 'Player 1 shoots first — white, from the bottom.'
        : st.short ? 'Short match: first to five coins. You are white.' : 'Your shot — you are white.');
      focusSoft(canvas);
      if (!coached) coachStart();
    }
    function endMatch(winner, lastMsg) {
      st.winner = winner;
      st.phase = 'over';
      coachHide();
      var score = scoreOf('you') + (st.queenCovered === 'you' ? 3 : 0);
      st.result = { win: winner === 'you', score: score };
      if (vs === 'gattu') {
        /* two results in a row move his wobble one notch, then the count starts again */
        var r = winner === 'you' ? 'win' : 'loss';
        var run = (mem.run || []).concat([r]).slice(-2), lvl = mem.lvl | 0;
        if (run.length === 2 && run[0] === run[1]) { lvl = clamp(lvl + (r === 'win' ? 1 : -1), 0, WOBBLE.length - 1); run = []; }
        mem = { lvl: lvl, run: run };
        store.set('carrom.gattu', mem);
      }
      matchNo++; store.set('carrom.matches', matchNo);
      say(lastMsg || '');
      over.innerHTML =
        '<div class="car-panel" role="dialog" aria-label="Game over">' +
          '<h3>' + (vs === '2p' ? nmS(winner) + ' got there first — shabaash!'
              : winner === 'you' ? 'Shabaash — the whites are home!' : 'Gattu got there first') + '</h3>' +
          '<p>' + (vs === '2p' ? 'A proper living-room match' + (st.queenCovered ? ' — and the queen was covered.' : '.')
              : winner === 'you' ? (st.short ? 'Five whites pocketed' : 'Every white pocketed') + (st.queenCovered === 'you' ? ', and the queen covered too.' : '.')
              : 'He got there first this time — another game?') + '</p>' +
          '<p><b>' + score + '</b> point' + (score === 1 ? '' : 's') + ' — a coin is 1, the covered queen is 3.</p>' +
          '<div class="car-row">' +
            '<button type="button" class="car-btn" data-go="again">Play again</button>' +
            '<button type="button" class="car-btn ghost" data-go="out">Finish</button>' +
          '</div>' +
        '</div>';
      over.hidden = false;
      wait(60, function () { focusSoft(over.querySelector('[data-go="again"]')); });
    }
    var lastMode = 'gattu';
    function bail() {
      if (finished) return;
      finished = true;
      var r = st.result || { win: false, score: scoreOf('you') };
      try { D.documentElement.classList.remove('gm-fullscreen'); } catch (e) {}
      sc.kill();
      W.cancelAnimationFrame(rafId);
      if (typeof done === 'function') done({ win: !!r.win, score: r.score, asked: 0, firstTryRight: 0,
        level: opts.level || 1, levelNext: opts.level || 1 });
    }
    function showIntro() {
      over.innerHTML =
        '<div class="car-panel" role="dialog" aria-label="Carrom">' +
          '<h3>Carrom</h3>' +
          '<p>India’s living-room game. The family rules, made simple:</p>' +
          '<ul>' +
            '<li>You are <b>white</b>, Gattu is black. Pocket one of yours and you shoot again.</li>' +
            '<li>Cover the red <b>queen</b>: drop a white on the same or the very next shot, or she climbs back out.</li>' +
            '<li>Striker in a pocket is a foul — one of your coins comes back.</li>' +
          '</ul>' +
          '<div class="car-row"><button type="button" class="car-btn" data-go="start">Play Gattu</button>' +
          '<button type="button" class="car-btn ghost" data-go="short">Short match — first to five</button>' +
          '<button type="button" class="car-btn ghost" data-go="start2">2 players</button></div>' +
        '</div>';
      over.hidden = false;
      wait(60, function () { focusSoft(over.querySelector('[data-go="start"]')); });
    }
    function pause() {
      cancelShot('');
      coachHide();
      st.paused = st.phase;
      goFull(false);
      over.innerHTML = '<div class="car-panel" role="dialog" aria-label="Paused"><h3>Paused</h3>' +
        '<p>The board waits exactly as you left it.</p>' +
        '<div class="car-row"><button type="button" class="car-btn" data-go="resume">Resume</button>' +
        '<button type="button" class="car-btn ghost" data-go="out">Finish</button></div></div>';
      over.hidden = false;
      wait(60, function () { focusSoft(over.querySelector('[data-go="resume"]')); });
    }
    function settings() {
      cancelShot('');
      over.innerHTML = '<div class="car-panel" role="dialog" aria-label="Settings"><h3>Settings</h3>' +
        '<label><input type="checkbox" data-set="sling"' + (slingOn ? ' checked' : '') + '> Flick sling: pull back from the striker to shoot (slide back onto it to cancel)</label>' +
        '<div class="car-row"><button type="button" class="car-btn" data-go="closeset">Done</button></div></div>';
      over.hidden = false;
      wait(60, function () { focusSoft(over.querySelector('[data-set]')); });
    }

    /* ==================================================================
       RENDERING
       ================================================================== */

    /* The board's size comes from the viewport and constants, not from measuring the page —
       and only on start, on a pause or resume, and on resize. Never during play. */
    function fit() {
      var vw = W.innerWidth || 390, vh = W.innerHeight || 700, size;
      if (full) {
        var land = vw > vh * 1.08;
        wrapEl.classList.toggle('car-land', land);
        if (land) size = Math.min(vh - TOPH - 20, vw - SIDEW - 44);
        else size = Math.min(vw - 12, vh - TOPH - CTLH - FEEDH - 28, 900);
      } else {
        wrapEl.classList.remove('car-land');
        size = Math.min(host.clientWidth || 360, 560);
      }
      size = Math.floor(Math.max(200, size));
      wrapEl.style.setProperty('--car-bw', size + 'px');
      var d = W.devicePixelRatio || 1;
      if (size === cssSize && d === dpr && board) return;
      cssSize = size; dpr = d;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      buildBoardLayer();
      st.dbg.fits++;
    }

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

    function rayLimit(x, y, dx, dy, max) {
      var t = max;
      if (dx > 0.0001) t = Math.min(t, (U - RS - x) / dx);
      if (dx < -0.0001) t = Math.min(t, (RS - x) / dx);
      if (dy > 0.0001) t = Math.min(t, (U - RS - y) / dy);
      if (dy < -0.0001) t = Math.min(t, (RS - y) / dy);
      return Math.max(0, t);
    }
    /* the aim's first contact: the nearest piece the striker's path meets, where the striker is
       then (the ghost), and which way that piece goes */
    function firstContact(x, y, a) {
      var dx = Math.cos(a), dy = Math.sin(a), best = null;
      for (var i = 0; i < st.bodies.length; i++) {
        var b = st.bodies[i];
        if (b.dead || b.kind === 'striker') continue;
        var R = RS + b.r, ox = b.x - x, oy = b.y - y, t = ox * dx + oy * dy;
        if (t <= 0) continue;
        var d2 = ox * ox + oy * oy - t * t;
        if (d2 >= R * R) continue;
        var th = t - Math.sqrt(R * R - d2);
        if (!best || th < best.t) best = { t: th, b: b };
      }
      var wall = rayLimit(x, y, dx, dy, 200);
      if (!best || best.t > wall) return { t: wall, b: null, gx: x + dx * wall, gy: y + dy * wall };
      var gx = x + dx * best.t, gy = y + dy * best.t;
      var cx = best.b.x - gx, cy = best.b.y - gy, cl = Math.sqrt(cx * cx + cy * cy) || 1;
      return { t: best.t, b: best.b, gx: gx, gy: gy, ax: cx / cl, ay: cy / cl };
    }
    function easeOutCubic(t) { var u = 1 - t; return 1 - u * u * u; }
    function upp() { return VIEW / (cssSize || 1); }   /* board units per CSS px */

    function draw(alpha) {
      var i, b;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (board) ctx.drawImage(board, 0, 0);
      unitsTransform(ctx);

      if (st.pops.length) {
        var keep = [];
        for (i = 0; i < st.pops.length; i++) {
          var pop = st.pops[i], age = (vclock - pop.t) / 380;
          if (age < 1) {
            var e = age * age;
            var px2 = pop.x0 + (pop.px - pop.x0) * Math.min(1, e * 1.6);
            var py2 = pop.y0 + (pop.py - pop.y0) * Math.min(1, e * 1.6);
            var rr2 = pop.r * (1 - 0.75 * e);
            if (pop.kind === 'striker') drawStrikerAt(px2, py2, 1 - e);
            else drawCoinAt(px2, py2, rr2, pop.kind, pop.owner, 1 - e);
            keep.push(pop);
          }
        }
        st.pops = keep;
      }

      for (i = 0; i < st.bodies.length; i++) {
        b = st.bodies[i];
        if (b.dead) continue;
        var x = b.px + (b.x - b.px) * alpha, y = b.py + (b.y - b.py) * alpha;
        bodyShadow(x, y, b.r);
        if (b.kind === 'striker') drawStrikerAt(x, y);
        else drawCoinAt(x, y, b.r, b.kind, b.owner);
      }

      if (st.phase === 'think' && st.gPlan) {
        var gt = reduced ? 1 : Math.min(1, (vclock - st.gT0) / 320);
        var gx = 50 + (st.gPlan.sx - 50) * easeOutCubic(gt);
        bodyShadow(gx, GATTU_Y, RS);
        drawStrikerAt(gx, GATTU_Y);
        if (gt >= 1) {
          var gl = rayLimit(st.gPlan.sx, GATTU_Y, Math.cos(st.gPlan.a), Math.sin(st.gPlan.a), 20);
          ctx.save();
          ctx.setLineDash([1.6, 2.6]);
          ctx.strokeStyle = 'rgba(64,30,12,.45)'; ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(st.gPlan.sx + Math.cos(st.gPlan.a) * (RS + 0.8), GATTU_Y + Math.sin(st.gPlan.a) * (RS + 0.8));
          ctx.lineTo(st.gPlan.sx + Math.cos(st.gPlan.a) * gl, GATTU_Y + Math.sin(st.gPlan.a) * gl);
          ctx.stroke();
          ctx.restore();
        }
      }

      st.dbg.hole = null; st.dbg.ghost = null;
      if (st.phase === 'aim' && human(st.turn)) {
        var by = baseY(st.turn);
        bodyShadow(st.sx, by, RS);
        drawStrikerAt(st.sx, by);
        var ca = Math.cos(st.aimA), sa = Math.sin(st.aimA);
        var fc = firstContact(st.sx, by, st.aimA);
        ctx.save();
        /* the finger never covers the line: a hole is cut round an aiming touch */
        if (drag && drag.mode === 'aim' && drag.touch && drag.bx != null) {
          var hr = 30 * upp();
          st.dbg.hole = { x: drag.bx, y: drag.by, r: hr, px: 30 };
          ctx.beginPath();
          ctx.rect(-M, -M, VIEW, VIEW);
          ctx.arc(drag.bx, drag.by, hr, 0, TAU, true);
          ctx.clip('evenodd');
        }
        var x0 = st.sx + ca * (RS + 0.9), y0 = by + sa * (RS + 0.9);
        ctx.setLineDash([1.8, 2.2]);
        if (!reduced) ctx.lineDashOffset = -(vclock / 90) % 4;
        ctx.strokeStyle = 'rgba(64,30,12,.7)'; ctx.lineWidth = 0.75; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(fc.gx, fc.gy); ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = pal.acc; ctx.globalAlpha = 0.85; ctx.lineWidth = 0.55;
        ctx.beginPath(); ctx.arc(fc.gx, fc.gy, RS, 0, TAU); ctx.stroke();
        ctx.globalAlpha = 0.18; ctx.fillStyle = pal.acc; ctx.fill();
        ctx.globalAlpha = 1;
        st.dbg.ghost = { x: fc.gx, y: fc.gy, hit: !!fc.b };
        if (fc.b) {
          /* where that coin will go: a short arrow from its centre */
          var ax0 = fc.b.x + fc.ax * (fc.b.r + 0.6), ay0 = fc.b.y + fc.ay * (fc.b.r + 0.6);
          var ax1 = fc.b.x + fc.ax * (fc.b.r + 8), ay1 = fc.b.y + fc.ay * (fc.b.r + 8);
          ctx.strokeStyle = '#1f7a4f'; ctx.lineWidth = 0.75;
          ctx.beginPath(); ctx.moveTo(ax0, ay0); ctx.lineTo(ax1, ay1); ctx.stroke();
          var an = Math.atan2(fc.ay, fc.ax);
          ctx.beginPath();
          ctx.moveTo(ax1, ay1);
          ctx.lineTo(ax1 - Math.cos(an - 0.5) * 1.8, ay1 - Math.sin(an - 0.5) * 1.8);
          ctx.moveTo(ax1, ay1);
          ctx.lineTo(ax1 - Math.cos(an + 0.5) * 1.8, ay1 - Math.sin(an + 0.5) * 1.8);
          ctx.stroke();
        }
        ctx.restore();
        /* slide chevrons while the striker is idle: "this moves sideways" */
        if (!st.charge && !drag) {
          var wb = reduced ? 0 : Math.sin(vclock / 320) * 0.5;
          ctx.save();
          ctx.strokeStyle = pal.acc; ctx.globalAlpha = 0.6;
          ctx.lineWidth = 0.75; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          var cxL = st.sx - RS - 2.6 - wb, cxR = st.sx + RS + 2.6 + wb;
          if (st.sx > SXMIN + 0.5) { ctx.beginPath(); ctx.moveTo(cxL + 1.1, by - 1.6); ctx.lineTo(cxL - 0.5, by); ctx.lineTo(cxL + 1.1, by + 1.6); ctx.stroke(); }
          if (st.sx < SXMAX - 0.5) { ctx.beginPath(); ctx.moveTo(cxR - 1.1, by - 1.6); ctx.lineTo(cxR + 0.5, by); ctx.lineTo(cxR - 1.1, by + 1.6); ctx.stroke(); }
          ctx.restore();
        }
        /* the sling (a setting): its pull, drawn back from the striker */
        if (drag && drag.mode === 'sling') {
          ctx.save();
          ctx.strokeStyle = drag.cancel ? 'rgba(217,79,61,.9)' : 'rgba(40,20,8,.45)';
          ctx.lineWidth = 0.6; ctx.setLineDash([1, 1.4]);
          ctx.beginPath(); ctx.moveTo(st.sx, by); ctx.lineTo(drag.bx, drag.by); ctx.stroke();
          ctx.restore();
        }
      }
    }

    /* the pad's fill and the number, written only when they change; the number floats above
       the finger, never under it (CR5) */
    var powShown = -1, powPos = null;
    function powerUI() {
      var v = Math.round(st.charge * 100), on = st.charging || st.charge > 0 || !!padDrag;
      if (v !== powShown) {
        powShown = v;
        padFill.style.width = 'calc((100% - 52px) * ' + st.charge.toFixed(3) + ')';
        pad.setAttribute('aria-valuenow', String(v));
        powEl.textContent = padDrag && padDrag.x ? '✕' : String(v);
      }
      powEl.classList.toggle('x', !!(padDrag && padDrag.x));
      powEl.classList.toggle('on', on);
      pad.classList.toggle('on', on);
      if (on && powPos) {
        powEl.style.transform = 'translate(' + Math.round(powPos.x - 29) + 'px,' + Math.round(powPos.y) + 'px)';
        st.dbg.pow = { x: powPos.x, y: powPos.y + 18 };
      } else st.dbg.pow = null;
    }

    /* ---------------------------------------------------------- the loop */
    function loop(ts) {
      rafId = 0;
      if (sc.dead) return;
      var w0 = W.performance.now(), ph0 = st.phase;
      if (detached(host)) { teardown(); return; }
      var dt = lastT ? Math.min(0.1, (ts - lastT) / 1000) : 1 / 60;
      lastT = ts;
      vclock += dt * 1000;
      for (var i = 0; i < waits.length;) {
        if (waits[i].at <= vclock) { var w = waits.splice(i, 1)[0]; w.fn(); } else i++;
      }
      if (st.charging && st.phase === 'aim' && human(st.turn)) {
        var c0 = st.charge;
        st.charge = Math.min(1, st.charge + dt * 0.8);
        tick(c0, st.charge);
        powerUI();
      }
      if (st.phase === 'rolling') {
        acc += dt;
        var guard = 0;
        while (acc >= DT && guard < 12) { physStep(DT); acc -= DT; st.rollT += DT; guard++; }
        if (guard >= 12) acc = 0;
        if (st.rollT > 9) { for (var k = 0; k < st.bodies.length; k++) { st.bodies[k].vx = 0; st.bodies[k].vy = 0; } }
        if (!anyMoving()) { acc = 0; resolveShot(); }
      }
      draw(st.phase === 'rolling' ? clamp(acc / DT, 0, 1) : 1);
      /* what this frame cost the engine — read by tools/check-carrom.js (CR4), never shown */
      if (st.phase !== 'intro') {
        var wk = W.performance.now() - w0;
        st.dbg.work.push(wk); if (st.dbg.work.length > 4000) st.dbg.work.shift();
        if (wk > 12) st.dbg.slow.push([Math.round(wk), ph0 + '>' + st.phase]);
      }
      if (!sc.dead && D.visibilityState !== 'hidden') rafId = W.requestAnimationFrame(loop);
    }
    function kick() { if (!rafId && !sc.dead) { lastT = 0; rafId = W.requestAnimationFrame(loop); } }
    sc.on(D, 'visibilitychange', function () {
      if (D.visibilityState === 'hidden') { if (rafId) W.cancelAnimationFrame(rafId); rafId = 0; lastT = 0; }
      else kick();
    });
    /* a light haptic tick each quarter of power, where the device allows it */
    function tick(a, b2) {
      if (calmMode || !W.navigator || !W.navigator.vibrate) return;
      if (Math.floor(a * 4) !== Math.floor(b2 * 4)) { try { W.navigator.vibrate(6); } catch (e) {} }
    }

    /* ==================================================================
       INPUT — one gesture, one job
       ================================================================== */
    function toBoard(e) {
      var r2 = cRect || canvas.getBoundingClientRect();
      return { x: (e.clientX - r2.left) / r2.width * VIEW - M, y: (e.clientY - r2.top) / r2.height * VIEW - M };
    }
    var cRect = null;     /* measured once per gesture, at pointerdown */
    var drag = null, padDrag = null;
    function aimable() { return st.phase === 'aim' && human(st.turn) && over.hidden; }
    function onStriker(p) {
      var dx = p.x - st.sx, dy = p.y - baseY(st.turn), hit = Math.max(RS * 1.5, 24 * upp());
      return dx * dx + dy * dy <= hit * hit;
    }
    function behindLine(p) {
      var by = baseY(st.turn);
      return st.turn === 'you' ? p.y > by - RS * 0.6 : p.y < by + RS * 0.6;
    }
    function aimAt(p) {
      var by = baseY(st.turn), dx = p.x - st.sx, dy = p.y - by;
      if (dx * dx + dy * dy < 4) return;
      st.aimA = clampAim(Math.atan2(dy, dx), st.turn);
      coachSaw('aim');
    }
    function place(x) {
      var nx = clamp(x, SXMIN, SXMAX);
      if (Math.abs(nx - st.sx) > 0.01) { st.sx = nx; coachSaw('place'); }
    }

    sc.on(canvas, 'pointerdown', function (e) {
      focusSoft(canvas);
      if (!aimable()) return;
      cRect = canvas.getBoundingClientRect();
      var p = toBoard(e), touch = e.pointerType !== 'mouse';
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      if (onStriker(p) || behindLine(p)) {
        /* PLACE: the striker slides with the finger and can never fire — unless the sling is
           switched on in settings and the pull comes back off the striker itself */
        drag = { mode: 'place', id: e.pointerId, dx: onStriker(p) ? st.sx - p.x : 0, sling: slingOn && onStriker(p), touch: touch };
        if (!drag.dx) place(p.x);
        return;
      }
      if (!touch) {
        /* desktop: the mouse already points; hold and release here to shoot */
        aimAt(p);
        drag = { mode: 'mouse', id: e.pointerId };
        st.charging = true; st.chargeBy = 'mouse'; st.charge = 0;
        powPos = { x: e.clientX, y: e.clientY - 66 };
        powerUI();
        return;
      }
      drag = { mode: 'aim', id: e.pointerId, touch: true, bx: p.x, by: p.y };
      aimAt(p);
    });
    sc.on(canvas, 'pointermove', function (e) {
      if (!drag) {
        /* point-to-aim: a mouse hovering ahead of the striker turns the aim to it */
        if (e.pointerType === 'mouse' && aimable() && !st.charging) {
          var r2 = canvas.getBoundingClientRect();
          cRect = r2;
          var q = toBoard(e);
          canvas.classList.toggle('grab', onStriker(q) || behindLine(q));
          if (!onStriker(q) && !behindLine(q)) aimAt(q);
        }
        return;
      }
      if (e.pointerId !== drag.id || st.phase !== 'aim') return;
      var p = toBoard(e);
      if (drag.mode === 'place') {
        var by = baseY(st.turn);
        var back = st.turn === 'you' ? p.y - by : by - p.y;
        if (drag.sling && back > RS * 2.6) { drag = { mode: 'sling', id: drag.id, bx: p.x, by: p.y, cancel: false }; }
        else { place(p.x + drag.dx); return; }
      }
      if (drag.mode === 'aim') { drag.bx = p.x; drag.by = p.y; aimAt(p); return; }
      if (drag.mode === 'sling') {
        var by2 = baseY(st.turn), dx = st.sx - p.x, dy = by2 - p.y, len = Math.sqrt(dx * dx + dy * dy);
        drag.bx = p.x; drag.by = p.y;
        drag.cancel = len < RS * 1.4;
        if (len > 1.2) st.aimA = clampAim(Math.atan2(dy, dx), st.turn);
        var c0 = st.charge;
        st.charge = drag.cancel ? 0 : clamp((len - 3) / 26, 0, 1);
        tick(c0, st.charge);
        powPos = { x: e.clientX, y: e.clientY - 80 };
        powerUI();
      }
    });
    function canvasUp(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var was = drag; drag = null;
      var r2 = cRect || canvas.getBoundingClientRect();
      var inside = e.clientX >= r2.left && e.clientX <= r2.right && e.clientY >= r2.top && e.clientY <= r2.bottom;
      if (was.mode === 'mouse') {
        if (e.type === 'pointerup' && inside && st.charge > 0.03) playerFire();
        else cancelShot();
      } else if (was.mode === 'sling') {
        if (e.type === 'pointerup' && inside && !was.cancel && st.charge > 0.05) playerFire();
        else cancelShot();
      }
      powPos = null; powerUI();
    }
    sc.on(canvas, 'pointerup', canvasUp);
    sc.on(canvas, 'pointercancel', canvasUp);
    sc.on(canvas, 'pointerleave', function (e) { if (e.pointerType === 'mouse' && !drag) canvas.classList.remove('grab'); });
    sc.on(canvas, 'wheel', function (e) {
      if (!aimable()) return;
      e.preventDefault();
      st.aimA = clampAim(st.aimA + (e.deltaY > 0 ? 0.5 : -0.5) * DEG, st.turn);
    }, { passive: false });

    /* THE POWER PAD: pull right from wherever you touch, let go to shoot; slide back into the ✕
       end, or lift outside the pad, and nothing happens */
    var padRect = null;
    sc.on(pad, 'pointerdown', function (e) {
      if (!aimable()) return;
      e.preventDefault();
      padRect = pad.getBoundingClientRect();
      if (e.clientX < padRect.left + 52) return;
      try { pad.setPointerCapture(e.pointerId); } catch (err) {}
      padDrag = { id: e.pointerId, x0: e.clientX, x: false };
      st.charge = 0; st.charging = false; st.chargeBy = 'pad';
      powPos = { x: e.clientX, y: padRect.top - 52 };
      powerUI();
      coachSaw('pad');
    });
    sc.on(pad, 'pointermove', function (e) {
      if (!padDrag || e.pointerId !== padDrag.id) return;
      var atX = e.clientX < padRect.left + 52;
      padDrag.x = atX;
      pad.classList.toggle('at-x', atX);
      var c0 = st.charge;
      st.charge = atX ? 0 : clamp((e.clientX - padDrag.x0) / Math.max(120, (padRect.width - 52) * 0.75), 0, 1);
      tick(c0, st.charge);
      powPos = { x: clamp(e.clientX, padRect.left + 40, padRect.right - 30), y: padRect.top - 52 };
      powerUI();
    });
    function padUp(e) {
      if (!padDrag || e.pointerId !== padDrag.id) return;
      var was = padDrag; padDrag = null;
      pad.classList.remove('at-x');
      var r = padRect, slack = 24;
      var inside = e.clientX >= r.left + 52 && e.clientX <= r.right + slack && e.clientY >= r.top - slack && e.clientY <= r.bottom + slack;
      if (e.type === 'pointerup' && inside && !was.x && st.charge > 0.04) playerFire();
      else if (st.charge > 0 || was.x || !inside) cancelShot();
      powPos = null; powerUI();
    }
    sc.on(pad, 'pointerup', padUp);
    sc.on(pad, 'pointercancel', padUp);

    /* ‹ › nudge the aim half a degree */
    sc.on(host, 'click', function (e) {
      var n = e.target.closest ? e.target.closest('[data-nudge]') : null;
      if (n && aimable()) { st.aimA = clampAim(st.aimA + (+n.getAttribute('data-nudge')) * 0.5 * DEG, st.turn); coachSaw('aim'); return; }
      var t = e.target.closest ? e.target.closest('[data-go]') : null;
      if (!t) return;
      var what = t.getAttribute('data-go');
      if (what === 'start') { lastMode = 'gattu'; startMatch('gattu'); }
      else if (what === 'short') { lastMode = 'short'; startMatch('short'); }
      else if (what === 'start2') { lastMode = '2p'; startMatch('2p'); }
      else if (what === 'again') startMatch(lastMode);
      else if (what === 'out') bail();
      else if (what === 'pause') pause();
      else if (what === 'resume') { over.hidden = true; goFull(true); focusSoft(canvas); }
      else if (what === 'coach') { cancelShot(''); coachStart(); }
      else if (what === 'settings') settings();
      else if (what === 'closeset') { over.hidden = true; focusSoft(canvas); }
    });
    sc.on(host, 'change', function (e) {
      if (e.target && e.target.getAttribute && e.target.getAttribute('data-set') === 'sling') {
        slingOn = !!e.target.checked; store.set('carrom.sling', slingOn);
      }
    });

    /* KEYS, document-level so they work with no click first */
    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { teardown(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'Escape') {
        if (st.charging || st.charge || drag || padDrag) { e.preventDefault(); cancelShot(); return; }
        if (full && over.hidden && st.phase !== 'over') { e.preventDefault(); pause(); }
        return;
      }
      if (!aimable()) return;
      var fine = e.shiftKey;
      if (e.key === 'ArrowLeft') { e.preventDefault(); place(st.sx - (fine ? 0.25 : 1)); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); place(st.sx + (fine ? 0.25 : 1)); }
      else if (e.key === 'ArrowUp' || e.key === 'a' || e.key === 'A') { e.preventDefault(); st.aimA = clampAim(st.aimA - (fine ? 0.25 : 1) * DEG, st.turn); coachSaw('aim'); }
      else if (e.key === 'ArrowDown' || e.key === 'd' || e.key === 'D') { e.preventDefault(); st.aimA = clampAim(st.aimA + (fine ? 0.25 : 1) * DEG, st.turn); coachSaw('aim'); }
      else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat && !st.charging) {
          st.charging = true; st.chargeBy = 'key'; st.charge = 0;
          var pr = pad.getBoundingClientRect();
          powPos = { x: pr.left + pr.width / 2, y: pr.top - 52 };
          coachSaw('pad');
        }
      }
    });
    sc.on(D, 'keyup', function (e) {
      if (sc.dead) return;
      if ((e.key === ' ' || e.code === 'Space') && st.charging && st.chargeBy === 'key') {
        e.preventDefault();
        st.charging = false;
        if (st.charge > 0.03) playerFire(); else cancelShot();
        powPos = null; powerUI();
      }
    });
    var rsT = 0;
    sc.on(W, 'resize', function () { clearTimeout(rsT); rsT = setTimeout(fit, 100); });

    /* ==================================================================
       THE COACH — Place → Aim → Shoot, once, replayable from "?"
       ================================================================== */
    var coachStep = 0, coachMark = null;
    function coachStart() {
      if (st.phase !== 'aim' || !human(st.turn)) { coachStep = 0; return; }
      coachStep = 1; coachMark = { sx: st.sx, a: st.aimA };
      coachShow();
    }
    function coachShow() {
      if (!coachStep) { coachEl.hidden = true; return; }
      var cr = { left: canvas.offsetLeft, top: canvas.offsetTop, w: cssSize };
      var s = cssSize / VIEW, x, y, html;
      var byPx = (baseY(st.turn) + M) * s + cr.top, sxPx = (st.sx + M) * s + cr.left;
      if (coachStep === 1) {
        x = sxPx; y = byPx - 22;
        html = '<b>1 · Place.</b> Drag the striker along your line (or ← →). It only slides — it never shoots.';
      } else if (coachStep === 2) {
        x = cr.left + cr.w / 2; y = cr.top + cr.w * 0.36;
        html = '<b>2 · Aim.</b> Tap where you want it to go' + (W.matchMedia && W.matchMedia('(pointer:fine)').matches ? ', or just point with the mouse' : '') + '. The line stops at the first coin it meets.';
      } else {
        var pr = pad.offsetParent === mainEl ? pad : null;
        var side = host.querySelector('.car-side');
        x = side.offsetLeft + side.offsetWidth / 2; y = side.offsetTop - 8;
        html = '<b>3 · Shoot.</b> Pull the pad to the right and let go (or hold Space). Slide back to ✕ to cancel.';
      }
      coachEl.innerHTML = '<div class="car-tip" role="note" style="left:' + Math.round(x) + 'px;top:' + Math.round(y) + 'px">' + html +
        '<div class="car-tiprow"><button type="button" data-coach="skip">Skip</button>' +
        (coachStep < 3 ? '<button type="button" data-coach="next">Next</button>' : '') + '</div></div>';
      coachEl.hidden = false;
      var tip = coachEl.firstChild, tw = tip.offsetWidth, mw = mainEl.clientWidth;
      if (x - tw / 2 < 6) tip.style.left = (tw / 2 + 6) + 'px';
      if (x + tw / 2 > mw - 6) tip.style.left = (mw - tw / 2 - 6) + 'px';
    }
    function coachSaw(what) {
      if (!coachStep) return;
      if (coachStep === 1 && what === 'place' && Math.abs(st.sx - coachMark.sx) > 3) { coachStep = 2; coachMark.a = st.aimA; wait(250, coachShow); }
      else if (coachStep === 2 && what === 'aim' && Math.abs(st.aimA - coachMark.a) > 2 * DEG) { coachStep = 3; wait(450, coachShow); }
      else if (coachStep < 3 && what === 'pad') { coachStep = 3; coachShow(); }
    }
    function coachHide() { coachEl.hidden = true; coachEl.innerHTML = ''; }
    function coachDone() {
      coachStep = 0; coachHide();
      if (!coached) { coached = true; store.set('carrom.coached', true); }
    }
    sc.on(coachEl, 'click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-coach]') : null;
      if (!t) return;
      if (t.getAttribute('data-coach') === 'skip') coachDone();
      else { coachStep++; coachMark = { sx: st.sx, a: st.aimA }; coachShow(); }
    });

    /* ------------------------------------------------------------- boot */
    buildCoins();
    refreshHud();
    fit();
    showIntro();
    kick();

    function teardown() {
      if (teardown.done) return;
      teardown.done = true;
      finished = true;
      try { D.documentElement.classList.remove('gm-fullscreen'); } catch (e) {}
      clearTimeout(rsT);
      sc.kill();
      if (rafId) W.cancelAnimationFrame(rafId);
      rafId = 0;
      try { delete host.__carState; } catch (e) { host.__carState = null; }
    }
    teardown.destroy = teardown;
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
    sub: 'place, aim and pocket the coins',
    icon: 'game',
    minutes: 5,
    tag: 'Flick',
    c: '#7a4a21',
    c2: '#c99b62',
    scene: SCENE,
    teaches: false,
    review: false,
    blurb: 'India\u2019s living-room board. Place the striker, aim, pull the power pad \u2014 pocket your whites and cover the red queen. Gattu plays black.',
    engine: carrom
  });
})();
