/* Bizzing India — THE MELA (mini-games).

   The carnival. Four playable engines, each a drill wearing a costume:
     rangoli    · Rangoli Rush   — pattern, symmetry, memory
     statehunt  · Yatra / State Hunt — states, capitals, signatures
     festival   · Festival Frenzy — festival ↔ region ↔ month ↔ why
     jataka     · Jataka Jump    — hear the tale, pick the moral

   Idiom, copied from Bizzing Bee's saga engines and non-negotiable here:
     window.IND_GAMES = [ { id, name, blurb, icon, minutes, engine(host, opts, done) } ]
       host  — a DOM element the engine fills
       opts  — config bag, may be empty
       done  — call once with { win, score, kauris } when the game ends
       return — a teardown function (also exposed as .destroy for saga callers)

   House rules honoured throughout:
     · EVERY game plays fully with keyboard AND with touch/mouse.
     · prefers-reduced-motion is respected.
     · No lives, no hearts, no shaming. A wrong tap is a nudge and another go.
     · The answer is never printed on screen before it is earned.
     · No hardcoded colour except where the art itself carries meaning.

   Plain script, no modules, no build. Art helpers (IND_AVATAR, IND_ICON,
   IND_MOTIF, GATTU, IND_MAP) are used only when present. */

(function () {
  'use strict';

  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document || null;

  /* ==================================================================
     STYLE — injected once, everything scoped under .mela-
     ================================================================== */

  var CSS = [
    '.mela-wrap{display:flex;flex-direction:column;gap:var(--space-lg);color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    '.mela-hud{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-lg);flex-wrap:wrap}',
    '.mela-hud b{display:block;font:800 19px/1.15 var(--display,Georgia,serif);letter-spacing:-.01em}',
    '.mela-kicker{display:block;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}',
    '.mela-pips{display:flex;gap:6px;align-items:center;padding-bottom:3px}',
    '.mela-pip{width:11px;height:11px;border-radius:50%;border:1px solid var(--line);background:var(--surface)}',
    '.mela-pip.on{background:var(--accent);border-color:var(--accent)}',
    '.mela-pip.now{border-color:var(--accent);box-shadow:0 0 0 3px var(--surface2)}',

    '.mela-stage{background:var(--bg2);border:1px solid var(--line);border-radius:var(--radius-lg);padding:var(--space-lg);position:relative;overflow:hidden}',
    '.mela-stage:before{content:"";position:absolute;top:0;right:0;bottom:auto;left:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent3),var(--accent2));opacity:.5}',
    '.mela-art{display:flex;justify-content:center;width:min(100%,148px);margin:2px auto 6px}',
    '.mela-art svg{display:block;width:100%;height:auto}',
    '.mela-q{font:700 20px/1.3 var(--display,Georgia,serif);margin:2px 0 4px;text-align:center}',
    '.mela-tale{font-size:16px;line-height:1.65;color:var(--text);background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-lg);padding:var(--space-lg);margin:6px 0 10px}',
    '.mela-hint{font-size:12.5px;color:var(--muted);text-align:center;margin:10px 0 0}',
    '.mela-feed{min-height:22px;margin:0;text-align:center;font-size:14.5px;font-weight:600;color:var(--muted)}',
    '.mela-feed.good{color:var(--good)}',
    '.mela-feed.warm{color:var(--accent2)}',

    '.mela-opts{display:grid;gap:10px;grid-template-columns:1fr;margin-top:10px}',
    '@media(min-width:520px){.mela-opts.two{grid-template-columns:1fr 1fr}}',
    '.mela-opt{display:flex;align-items:center;gap:10px;text-align:left;width:100%;min-height:54px;padding:10px 14px;cursor:pointer;',
    'background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-lg);color:var(--text);font:600 16px/1.35 var(--body,inherit);transition:transform .12s ease,border-color .12s ease,background .12s ease}',
    '.mela-opt:hover:not(:disabled){border-color:var(--accent);transform:translateY(-2px)}',
    '.mela-opt:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.mela-num{flex:0 0 auto;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--surface2);border:1px solid var(--line);font:700 12px var(--body,inherit);color:var(--muted)}',
    '.mela-opt-t{flex:1}',
    '.mela-opt-s{display:block;font-weight:500;font-size:13px;color:var(--muted);margin-top:2px}',
    '.mela-opt.is-right{background:var(--surface2);border-color:var(--good);color:var(--text)}',
    '.mela-opt.is-right .mela-num{background:var(--good);border-color:var(--good);color:var(--bg2)}',
    '.mela-opt.is-off{opacity:.45;cursor:default}',
    '.mela-opt:disabled{cursor:default;transform:none}',

    '.mela-teach{margin-top:12px;background:var(--surface2);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:var(--radius-lg);padding:var(--space-lg);font-size:15px;line-height:1.6}',
    '.mela-teach b{color:var(--accent2)}',
    '.mela-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:12px}',
    '.mela-btn{cursor:pointer;min-height:46px;padding:11px 22px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:var(--bg2);font:700 15px var(--body,inherit)}',
    '.mela-btn.ghost{background:transparent;color:var(--text);border-color:var(--line)}',
    '.mela-btn:hover{filter:brightness(1.06)}',
    '.mela-btn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.mela-btn:disabled{opacity:.5;cursor:default}',

    /* rangoli board */
    '.mela-boardwrap{position:relative;width:min(100%,340px);margin:8px auto 0}',
    '.mela-wrap[data-theme-rg] .mela-boardwrap{background:var(--rg-ground);padding:12px;border-radius:16px}',
    '.mela-wrap[data-theme-rg] .mela-dot{background:var(--rg-dot);border-color:transparent}',
    '.mela-grid{display:grid;grid-template-columns:repeat(var(--n,4),1fr);gap:8px}',
    '.mela-dot{position:relative;aspect-ratio:1/1;min-width:34px;padding:0;cursor:pointer;border-radius:50%;',
    'background:var(--surface);border:1px solid var(--line);transition:transform .12s ease,background .12s ease,border-color .12s ease}',
    '.mela-dot:hover:not(:disabled){border-color:var(--accent);transform:scale(1.06)}',
    '.mela-dot:focus-visible{outline:3px solid var(--accent2);outline-offset:3px}',
    '.mela-dot:disabled{cursor:default}',
    '.mela-dot .pip{position:absolute;top:16%;right:16%;bottom:16%;left:16%;border-radius:50%;background:transparent;transition:background .12s ease}',
    '.mela-dot.lit{border-color:transparent}',
    '.mela-dot.lit .pip{background:var(--c,var(--accent))}',
    '.mela-dot.mine{border-color:var(--accent2)}',
    '.mela-dot.mine .pip{background:var(--accent2)}',
    '.mela-dot.hit .pip{background:var(--c,var(--accent))}',
    '.mela-dot.hit{border-color:transparent;box-shadow:0 0 0 2px var(--good) inset}',
    '.mela-dot.miss{border-style:dashed;border-color:var(--accent)}',
    '.mela-dot.miss .pip{background:var(--c,var(--accent));opacity:.3}',
    '.mela-dot.extra{border-color:var(--muted);opacity:.6}',
    '.mela-dot.extra .pip{background:var(--muted);opacity:.5}',
    '.mela-axis{position:absolute;pointer-events:none;opacity:0;transition:opacity .2s ease}',
    '.mela-axis.on{opacity:.65}',
    '.mela-axis.v{left:50%;top:-4px;bottom:-4px;border-left:2px dashed var(--accent3)}',
    '.mela-axis.h{top:50%;left:-4px;right:-4px;border-top:2px dashed var(--accent3)}',
    '.mela-count{text-align:center;font:700 13px var(--body,inherit);color:var(--muted);margin:10px 0 0;letter-spacing:.04em}',

    /* mini map */
    '.mela-mini{display:block;width:100%;max-width:190px;height:auto;max-height:210px;margin:10px auto 0}',
    '.mela-mini .land{fill:var(--surface2);stroke:var(--line);stroke-width:2}',
    '.mela-mini .hit{fill:var(--accent);stroke:var(--accent2);stroke-width:2}',

    /* result card */
    '.mela-done{text-align:center}',
    '.mela-done h3{font:800 24px var(--display,Georgia,serif);margin:6px 0 4px}',
    '.mela-done p{margin:0 0 4px;font-size:15.5px;line-height:1.55;color:var(--muted)}',
    '.mela-tally{display:inline-flex;gap:14px;flex-wrap:wrap;justify-content:center;margin:12px 0 2px}',
    '.mela-chip{background:var(--surface2);border:1px solid var(--line);border-radius:999px;padding:7px 16px;font:700 14px var(--body,inherit)}',
    '.mela-chip b{color:var(--accent2);font-size:17px}',

    '.mela-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    /* rangoli: the hundred thresholds — ladder header, palette, ten twists */
    '.mela-ladder{display:flex;gap:10px;align-items:center;justify-content:center;margin:0 0 10px;flex-wrap:wrap}',
    '.mela-lvln{font:800 14px var(--display,Georgia,serif)}',
    '.mela-lvln i{font-style:normal;font-weight:600;color:var(--muted);font-size:11px}',
    '.mela-lbar{flex:1;max-width:220px;height:8px;border-radius:4px;background:var(--card2,var(--ground));border:1px solid var(--line);overflow:hidden}',
    '.mela-lbar i{display:block;height:100%;background:linear-gradient(90deg,var(--accent2),var(--accent));border-radius:4px}',
    '.mela-decade{display:flex;gap:5px}',
    '.mela-diya{width:13px;height:13px;border-radius:50%;border:2px solid var(--line);display:grid;place-items:center;font-size:7px;color:var(--muted)}',
    '.mela-diya.lit{background:var(--accent2);border-color:var(--accent2)}',
    '.mela-diya.now{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 25%,transparent)}',
    '.mela-diya.twist{border-radius:4px}',
    /* diya raat */
    '.mela-diyarow{display:flex;gap:16px;justify-content:center;margin:18px 0}',
    '.mela-diyabig{position:relative;width:64px;height:74px;border:0;background:none;cursor:pointer;padding:0}',
    '.mela-diyabig .cup{position:absolute;left:6px;right:6px;bottom:8px;height:30px;border-radius:0 0 26px 26px;background:#a4502e;border:2px solid #6e2f18}',
    '.mela-diyabig .flame{position:absolute;left:50%;top:8px;width:16px;height:24px;transform:translateX(-50%);border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:radial-gradient(circle at 50% 70%,#ffd98a,#e8862b);opacity:.25}',
    '.mela-diyabig.lit .flame{opacity:1;box-shadow:0 0 18px 6px rgba(255,217,138,.6)}',
    '.mela-diyabig b{position:absolute;left:50%;bottom:-4px;transform:translateX(-50%);font:800 11px var(--body,system-ui);color:var(--muted)}',
    '.mela-diyabig:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:12px}',
    /* toran + shared option rows */
    '.mela-toran{display:flex;justify-content:center;margin:14px 0 6px}',
    '.mela-torstring{display:flex;gap:8px;padding:14px 20px 10px;border-top:4px solid #7a5320;border-radius:4px;font-size:30px}',
    '.mela-torstring .q{color:var(--accent);font-weight:800}',
    '.mela-toropts{display:flex;gap:14px;justify-content:center;margin:10px 0}',
    '.mela-torbtn{min-width:60px;min-height:56px;font-size:28px;border:2px solid var(--line);border-radius:16px;background:var(--card);cursor:pointer}',
    '.mela-torbtn.num{font:800 22px var(--body,system-ui);color:var(--text)}',
    '.mela-torbtn:hover{border-color:var(--accent)}',
    '.mela-torbtn:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    /* chakra */
    '.mela-chakra{width:min(300px,86%);display:block;margin:0 auto}',
    '.mela-sw.big{width:56px;height:56px}',
    /* genda */
    '.mela-genda{position:relative;height:220px;border:1px dashed var(--line);border-radius:14px;background:var(--card2,var(--ground));margin:10px 0;overflow:hidden}',
    '.mela-genda span{position:absolute;font-size:30px}',
    '.mela-genda .q{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:800 44px var(--display,Georgia,serif);color:var(--muted)}',
    /* bindi pairs */
    '.mela-bindis{display:grid;grid-template-columns:repeat(4,minmax(56px,86px));gap:10px;justify-content:center;margin:12px 0}',
    '.mela-bindi{position:relative;aspect-ratio:3/4;border:2px solid var(--line);border-radius:12px;background:var(--card);cursor:pointer;padding:0;overflow:hidden}',
    '.mela-bindi .face{position:absolute;top:0;right:0;bottom:0;left:0;display:grid;place-items:center;font-size:34px;color:var(--c,#c33);opacity:0}',
    '.mela-bindi .back{position:absolute;top:0;right:0;bottom:0;left:0;display:grid;place-items:center;font-size:24px;color:var(--muted);background:var(--card2,var(--ground))}',
    '.mela-bindi.open .face,.mela-bindi.got .face{opacity:1}',
    '.mela-bindi.open .back,.mela-bindi.got .back{opacity:0}',
    '.mela-bindi.got{border-color:var(--good);cursor:default}',
    '.mela-bindi:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    /* tabla taal */
    '.mela-taalrow{display:flex;gap:14px;justify-content:center;margin:18px 0}',
    '.mela-pad{position:relative;width:82px;height:82px;border-radius:50%;border:4px solid color-mix(in srgb,var(--c) 60%,#000 18%);background:radial-gradient(circle at 50% 38%,#f0e0c8,#caa87a 70%);cursor:pointer;padding:0}',
    '.mela-pad i{position:absolute;left:50%;top:50%;width:26px;height:26px;border-radius:50%;transform:translate(-50%,-50%);background:#2c2018}',
    '.mela-pad b{position:absolute;left:50%;bottom:-22px;transform:translateX(-50%);font:800 12px var(--body,system-ui);color:var(--text2)}',
    '.mela-pad u{position:absolute;right:4px;top:2px;text-decoration:none;font:700 10px var(--body,system-ui);color:var(--muted)}',
    '.mela-pad.hitp{box-shadow:0 0 0 6px var(--c);transform:scale(1.05)}',
    '.mela-pad:focus-visible{outline:3px solid var(--accent);outline-offset:3px}',
    '.mela-dot.tap{cursor:pointer}',
    '.mela-pal{display:flex;gap:10px;align-items:center;justify-content:center;margin:10px 0 2px}',
    '.mela-sw{width:44px;height:44px;border-radius:50%;border:3px solid var(--line);background:var(--c,#ccc);cursor:pointer;padding:0}',
    '.mela-sw.on{border-color:var(--text);box-shadow:0 0 0 4px color-mix(in srgb,var(--text) 18%,transparent)}',
    '.mela-sw:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.mela-dot.near{border-color:var(--accent2)}',
    '.mela-dot.near .pip{background:var(--c);opacity:.45}',
    '.mela-kolam{width:min(360px,92%);display:block;margin:0 auto}',
    '.mela-kdot{cursor:pointer}',
    '.mela-kdot .kd-hit{fill:transparent}',
    '.mela-kdot .kd{fill:var(--card);stroke:var(--accent);stroke-width:3}',
    '.mela-kdot text{font:800 12px var(--body,system-ui);fill:var(--text)}',
    '.mela-kdot.done .kd{fill:var(--accent)}',
    '.mela-kdot.done text{fill:#fff}',
    '.mela-kdot.shake{animation:melashake .3s}',
    '@keyframes melashake{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}',
    '.mela-kdot:focus-visible .kd{stroke-width:6}',
    '.mela-klines line{stroke:var(--accent);stroke-width:3.5;stroke-linecap:round}',
    '.mela-klines .bloom{fill:var(--accent2);opacity:.25;stroke:none}',
    '.mela-rainbox{position:relative;height:300px;border:1px solid var(--line);border-radius:14px;',
    'background:linear-gradient(180deg,var(--card),var(--card2,var(--ground)));overflow:hidden;margin:8px 0 10px}',
    '.mela-petal{position:absolute;width:30px;height:30px;border-radius:50% 50% 50% 4px;background:var(--c,#e88);',
    'transform:rotate(45deg);box-shadow:inset -4px -4px 0 rgba(0,0,0,.12)}',
    '.mela-bowls{display:flex;gap:12px;justify-content:center}',
    '.mela-bowl{position:relative;width:72px;height:52px;border:0;cursor:pointer;background:none;padding:0}',
    '.mela-bowl i{position:absolute;top:0;right:0;bottom:0;left:0;border-radius:0 0 40px 40px;background:var(--c);opacity:.9;',
    'border:3px solid color-mix(in srgb,var(--c) 60%,#000 20%)}',
    '.mela-bowl b{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%);color:#fff;font:800 15px var(--body,system-ui)}',
    '.mela-bowl:focus-visible{outline:3px solid var(--accent);outline-offset:3px}',
    '@media(prefers-reduced-motion:reduce){.mela-wrap *,.mela-wrap *:before,.mela-wrap *:after{animation:none!important;transition:none!important}',
    '.mela-opt:hover:not(:disabled),.mela-dot:hover:not(:disabled){transform:none}}'
  ].join('');

  var cssDone = false;
  function injectCSS() {
    if (cssDone || !D) return;
    cssDone = true;
    if (D.getElementById('mela-css')) return;
    var s = D.createElement('style');
    s.id = 'mela-css';
    s.appendChild(D.createTextNode(CSS));
    (D.head || D.documentElement).appendChild(s);
  }

  /* ==================================================================
     SMALL HELPERS
     ================================================================== */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pickN(a, n) { return shuffle(a).slice(0, n); }
  function one(a) { return a[Math.floor(Math.random() * a.length)]; }

  function reducedMotion() {
    try { return !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }
  function focusSoft(el) {
    if (!el || !el.focus) return;
    try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (e2) {} }
  }
  function canSpeak() {
    return !!(W.IND_SAY || (W.speechSynthesis && W.SpeechSynthesisUtterance));
  }
  function speak(text) {
    try {
      if (W.IND_SAY) { W.IND_SAY(text); return true; }
      if (W.speechSynthesis && W.SpeechSynthesisUtterance) {
        W.speechSynthesis.cancel();
        var u = new W.SpeechSynthesisUtterance(text);
        u.rate = 0.92; u.pitch = 1.02; u.lang = 'en-IN';
        W.speechSynthesis.speak(u);
        return true;
      }
    } catch (e) {}
    return false;
  }
  function hushSpeech() { try { if (W.speechSynthesis) W.speechSynthesis.cancel(); } catch (e) {} }

  function avatarHTML(id, size) {
    if (W.IND_AVATAR) { var a = W.IND_AVATAR(id, size || 92); if (a) return a; }
    if (W.IND_MOTIF && W.IND_MOTIF.lotus) return W.IND_MOTIF.lotus;
    return '';
  }
  function mascotHTML(mood, size) {
    if (W.GATTU) {
      var g = W.GATTU(mood || 'happy');
      if (g) return g.replace('<svg ', '<svg width="' + (size || 96) + '" height="' + (size || 96) + '" ');
    }
    return avatarHTML('ganesha', size || 96);
  }
  function motifHTML(name) {
    return (W.IND_MOTIF && W.IND_MOTIF[name]) ? W.IND_MOTIF[name] : '';
  }

  /* Praise, never scolding. */
  var CHEERS = ['Shabaash!', 'Bahut khoob!', 'Wah!', 'Ekdum sahi!', 'Very good!', 'Kya baat!'];
  var NUDGES = [
    'Not that one — try another.',
    'Have another go, you are close.',
    'Keep thinking — pick again.',
    'Try one more.'
  ];

  /* Shared chrome: title bar, progress pips, stage, polite live region. */
  function shell(host, title, kicker, nPips) {
    injectCSS();
    var pips = '';
    for (var i = 0; i < nPips; i++) pips += '<span class="mela-pip"></span>';
    host.innerHTML =
      '<div class="mela-wrap">' +
        '<div class="mela-hud">' +
          '<div><span class="mela-kicker">' + esc(kicker) + '</span><b>' + esc(title) + '</b></div>' +
          '<div class="mela-pips" aria-hidden="true">' + pips + '</div>' +
        '</div>' +
        '<div class="mela-stage"></div>' +
        '<p class="mela-feed" role="status" aria-live="polite"></p>' +
      '</div>';
    var ref = {
      stage: host.querySelector('.mela-stage'),
      pips: host.querySelector('.mela-pips'),
      feed: host.querySelector('.mela-feed')
    };
    ref.say = function (msg, tone) {
      if (!ref.feed) return;
      ref.feed.textContent = msg || '';
      ref.feed.className = 'mela-feed' + (tone ? ' ' + tone : '');
    };
    ref.mark = function (i, state) {
      if (!ref.pips) return;
      var all = ref.pips.children;
      for (var k = 0; k < all.length; k++) {
        all[k].className = 'mela-pip' + (k < i ? ' on' : '') + (k === i && state !== 'end' ? ' now' : '');
      }
    };
    return ref;
  }

  /* A run-scope for timers and listeners so teardown is always clean. */
  function scope() {
    var timers = [], offs = [], dead = false;
    return {
      get dead() { return dead; },
      later: function (fn, ms) {
        if (dead) return 0;
        var t = W.setTimeout(function () { if (!dead) fn(); }, ms);
        timers.push(t); return t;
      },
      every: function (fn, ms) {
        if (dead) return 0;
        var t = W.setInterval(function () { if (!dead) fn(); }, ms);
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
        hushSpeech();
      }
    };
  }

  /* A shell may throw the host away without calling teardown (a plain back
     button does exactly that). The engines notice and clean themselves up
     rather than leaving a document-level key handler behind. */
  function detached(host) {
    return !!(D && D.body && host && host.nodeType === 1 && !D.body.contains(host));
  }

  function teardownOf(sc, extra) {
    var fn = function () { sc.kill(); if (extra) { try { extra(); } catch (e) {} } };
    fn.destroy = fn;   /* saga callers use .destroy() */
    return fn;
  }

  /* ==================================================================
     CHOICE BOARD — the shared quiz machine
     Used by statehunt, festival and jataka. Full keyboard support:
     Tab / arrows to move, Enter or Space to choose, 1–4 as shortcuts.

     It reports to the host (docs/32, games spec §1.1): one answer() per
     item at its first attempt, and done({win, score, asked, firstTryRight,
     level, levelNext}). A wrong first answer HOLDS on the miss card —
     "Not quite.", the right answer, its teach — until Aage (§1.4). There
     is no elimination: nothing is greyed out one guess at a time.
     ================================================================== */

  var QZ_CSS = [
    '.mela-wrap .gm-miss{margin-top:12px;background:var(--surface2);border:1px solid var(--line);border-left:4px solid var(--accent2);border-radius:var(--radius-lg);padding:var(--space-lg);font-size:15.5px;line-height:1.6}',
    '.mela-wrap .gm-ans{font-weight:700}',
    '.mela-wrap .gm-teach{margin:6px 0 10px}',
    '.mela-opt.is-warm{border-style:dashed;border-color:var(--accent2)}',
    '@media(max-width:720px){.mela-wrap .mela-teachbox:not(:empty){position:sticky;bottom:calc(74px + env(safe-area-inset-bottom));z-index:6;background:var(--bg2);border-radius:var(--radius-lg)}}'
  ].join('');
  function injectQuizCSS() {
    if (!D || D.getElementById('mela-quiz-css')) return;
    var s = D.createElement('style');
    s.id = 'mela-quiz-css';
    s.appendChild(D.createTextNode(QZ_CSS));
    (D.head || D.documentElement).appendChild(s);
  }

  function optionsHTML(opts, twoUp) {
    var h = '<div class="mela-opts' + (twoUp ? ' two' : '') + '" role="group" aria-label="Choose an answer">';
    for (var i = 0; i < opts.length; i++) {
      h += '<button type="button" class="mela-opt" data-i="' + i + '">' +
             '<span class="mela-num" aria-hidden="true">' + (i + 1) + '</span>' +
             '<span class="mela-opt-t">' + esc(opts[i].t) +
               (opts[i].s ? '<span class="mela-opt-s">' + esc(opts[i].s) + '</span>' : '') +
             '</span></button>';
    }
    return h + '</div>';
  }

  function quizLevel(opts) { var l = parseInt(opts && opts.level, 10); return l >= 1 && l <= 5 ? l : 3; }
  function scopeSet(opts) { return (opts && opts.scope && opts.scope.set && opts.scope.set.length) ? opts.scope.set.map(String) : null; }

  /* quizGame(host, spec, done)
     spec = {
       title, kicker, count, level, answer (the host's report fn),
       build()      -> [round]  (fresh each play)
       round = { id, skill, artHTML, kicker, question, taleHTML, options:[{t,s}], answer:int,
                 teachHTML, teachText, speakText }
       hint         -> string shown under the options
     } */
  function quizGame(host, spec, done) {
    var sc = scope();
    injectQuizCSS();
    var rounds = spec.build();
    var ref = shell(host, spec.title, spec.kicker, rounds.length);
    var idx = 0, firstTryRight = 0, asked = 0, finished = false, result = null;
    var current = null, phase = 'ask';

    function hook() {
      host.__melaState = { phase: phase, idx: idx, total: rounds.length, id: current ? current.id : null,
                           answer: current ? current.answer : -1, asked: asked, firstTryRight: firstTryRight, result: result };
    }
    function optionEls() {
      return ref.stage ? ref.stage.querySelectorAll('.mela-opt') : [];
    }

    function moveFocus(dir) {
      var els = optionEls(), live = [], i;
      for (i = 0; i < els.length; i++) if (!els[i].disabled) live.push(els[i]);
      if (!live.length) return;
      var at = -1;
      for (i = 0; i < live.length; i++) if (live[i] === (D && D.activeElement)) at = i;
      var next = at < 0 ? 0 : (at + dir + live.length) % live.length;
      focusSoft(live[next]);
    }

    /* ONE VERDICT PER ITEM, at its first and only attempt */
    function choose(btn) {
      if (phase !== 'ask' || !btn || btn.disabled || !current) return;
      var i = parseInt(btn.getAttribute('data-i'), 10), right = i === current.answer;
      var els = optionEls();
      for (var k = 0; k < els.length; k++) {
        els[k].disabled = true;
        if (k === current.answer) els[k].classList.add('is-right');
        else if (k === i) els[k].classList.add('is-warm');
      }
      asked++;
      if (right) firstTryRight++;
      if (typeof spec.answer === 'function') {
        try { spec.answer({ id: current.id, right: right, firstTry: true, skill: current.skill, objective: null }); } catch (e) {}
      }
      phase = right ? 'told' : 'miss';
      if (right) ref.say(one(CHEERS), 'good');
      else ref.say('', '');
      reveal(right, i);
      hook();
    }

    function reveal(right) {
      var box = ref.stage.querySelector('.mela-teachbox');
      if (!box) return;
      var last = idx >= rounds.length - 1;
      if (right) {
        box.innerHTML =
          '<div class="mela-teach">' + current.teachHTML + '</div>' +
          '<div class="mela-row"><button type="button" class="mela-btn" data-go="next">' +
            (last ? 'See how I did' : 'Next') + '</button></div>';
      } else {
        /* THE MISS CARD (docs/32): it holds — nothing new renders until Aage */
        box.innerHTML =
          '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">' + esc(current.options[current.answer].t) + '</span>' +
            '<p class="gm-teach">' + esc(current.teachText) + '</p>' +
            '<button type="button" class="mela-btn gm-aage" data-gm="aage">Aage →</button></div>' +
          (current.teachHTML && /mela-mini/.test(current.teachHTML) ? '<div class="mela-teach">' + current.teachHTML + '</div>' : '');
      }
      var b = box.querySelector('[data-go="next"], [data-gm="aage"]');
      sc.later(function () { focusSoft(b); }, 60);
    }

    function advance() {
      if (phase !== 'told' && phase !== 'miss') return;
      idx++;
      render();
    }

    function render() {
      if (sc.dead) return;
      current = rounds[idx];
      phase = 'ask';
      ref.mark(idx);
      if (!current) return finish();
      ref.say('');
      ref.stage.innerHTML =
        (current.artHTML ? '<div class="mela-art">' + current.artHTML + '</div>' : '') +
        '<p class="mela-kicker" style="text-align:center">' + esc(current.kicker) + '</p>' +
        '<h3 class="mela-q">' + esc(current.question) + '</h3>' +
        (current.taleHTML ? '<div class="mela-tale">' + current.taleHTML + '</div>' : '') +
        (current.speakText && canSpeak()
          ? '<div class="mela-row"><button type="button" class="mela-btn ghost" data-go="say">' +
            (W.IND_ICON ? W.IND_ICON('sound', 18) : '') + ' Read it to me</button></div>' : '') +
        optionsHTML(current.options, spec.twoUp) +
        '<p class="mela-hint">' + esc(spec.hint || 'Tap an answer — or use the arrow keys and press Enter. Number keys 1–4 work too.') + '</p>' +
        '<div class="mela-teachbox"></div>';
      hook();
      sc.later(function () {
        var first = ref.stage.querySelector('.mela-opt');
        if (first) focusSoft(first);
      }, 60);
    }

    function finish() {
      if (finished || phase === 'end') return;
      phase = 'end';
      var n = rounds.length, ratio = asked ? firstTryRight / asked : 0, lv = spec.level || 3;
      result = { win: asked > 0 && ratio >= 0.5, score: firstTryRight, asked: asked, firstTryRight: firstTryRight,
                 level: lv, levelNext: ratio >= 0.8 ? Math.min(5, lv + 1) : ratio < 0.5 ? Math.max(1, lv - 1) : lv };
      ref.mark(n, 'end');
      ref.say('');
      /* the headline is read from the score: no "Shabaash" on a round that went the other way (§1.7) */
      ref.stage.innerHTML =
        '<div class="mela-done">' +
          '<div class="mela-art">' + mascotHTML(ratio >= 0.5 ? 'wow' : 'happy', 104) + '</div>' +
          '<h3>' + esc(ratio >= 0.8 ? one(CHEERS) : ratio >= 0.5 ? 'Well played!' : 'Every one of them taught.') + '</h3>' +
          '<p>You knew <b>' + firstTryRight + ' of ' + n + '</b> on the first try.</p>' +
          '<div class="mela-row">' +
            '<button type="button" class="mela-btn" data-go="out">Finish</button>' +
          '</div>' +
        '</div>';
      hook();
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="out"]')); }, 60);
    }

    function bail() {
      if (finished || !result) return;
      finished = true;
      host.__melaDone = result;
      sc.kill();
      if (typeof done === 'function') done(result);
    }

    sc.on(ref.stage, 'click', function (e) {
      var t = e.target;
      var opt = t.closest ? t.closest('.mela-opt') : null;
      if (opt) { choose(opt); return; }
      var gm = t.closest ? t.closest('[data-gm="aage"]') : null;
      if (gm) { advance(); return; }
      var go = t.closest ? t.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'next') advance();
      else if (what === 'say') { if (current) speak(current.speakText); }
      else if (what === 'out') bail();
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead || !ref.stage) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'Enter' && (phase === 'told' || phase === 'miss')) {
        /* a focused button fires its own click on Enter — stay out of its way */
        if (e.target && e.target.tagName === 'BUTTON' && host.contains(e.target)) return;
        e.preventDefault(); advance(); return;
      }
      if (phase !== 'ask') return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); moveFocus(1); return; }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); moveFocus(-1); return; }
      if (/^[1-4]$/.test(e.key)) {
        var els = optionEls(), n = parseInt(e.key, 10) - 1;
        if (els[n] && !els[n].disabled) { e.preventDefault(); choose(els[n]); }
      }
    });

    render();
    return teardownOf(sc, function () { finished = true; });
  }

  /* ==================================================================
     GAME 1 · RANGOLI RUSH (games spec §4.5)
     A pattern is laid in chalk on a doorway's threshold, the dust blows
     away, and the child lays it back. Every pattern is built by folding,
     so the real lesson is: remember half (or a quarter) and reflect the
     rest. A hundred levels, three a sitting, the ladder kept per child.

     Every fourth level is a regional tradition, credited on its card by
     its name and region (the folk-art rule, CLAUDE.md), and each can be
     failed: kolam (Tamil Nadu) — trace the hidden order of one continuous
     line; muggu (Andhra Pradesh, Telangana) — turned four ways round its
     centre; alpana (Bengal) — curves on a grid; mandana (Rajasthan) —
     geometric, on a wall plate; rangoli (Maharashtra, Gujarat and widely).

     It teaches, so it reports (docs/32): ONE answer per level attempt —
     {id:'level-N', right, firstTry, skill:'memory.pattern'}, right only when
     the level is cleared at the first try with no second look — and a
     miss holds on the board until Aage. A clear needs 80% of the dots right
     in the right colour, so a random dotter clears nothing (R2).
     ================================================================== */

  var RG_COLOURS = ['var(--rg1, var(--accent2))', 'var(--rg2, var(--accent3))', 'var(--rg3, var(--good))', 'var(--rg4, var(--accent))'];
  /* colour is never the only signal: each chalk wears its own mark */
  var RG_MARKS = ['dot', 'ring', 'petal', 'star'];
  /* THE THEMES a child can open with coins (economy.js EXTRAS, kind 'theme'): the chalk colours and
     the ground they are drawn on, from the tradition each is named for. Without one, the threshold's own. */
  var RG_THEMES = {
    'theme-rangoli-kolam':  { c: ['#fbf6ea', '#f2c14e', '#e0452d', '#86b85c'], ground: '#7d3520', dot: '#96452a' },
    'theme-rangoli-diwali': { c: ['#f59e0b', '#fcd34d', '#e4572e', '#f472b6'], ground: '#1d1838', dot: '#2c2752' }
  };
  var RG_LKEY = 'india.rangoli.lvl';
  /* the five traditions, credited as the spec names them; nothing here is typed from memory */
  var RG_TRAD = [
    { id: 'kolam',   name: 'Kolam',   region: 'Tamil Nadu',                    how: 'a continuous line drawn around the dots' },
    { id: 'muggu',   name: 'Muggu',   region: 'Andhra Pradesh and Telangana',  how: '' },
    { id: 'alpana',  name: 'Alpana',  region: 'Bengal',                        how: 'freehand curves on a grid' },
    { id: 'mandana', name: 'Mandana', region: 'Rajasthan',                     how: 'geometric, on a wall' },
    { id: 'rangoli', name: 'Rangoli', region: 'Maharashtra, Gujarat and widely', how: '' }
  ];
  var RG_BANDS = ['levels 1–20 · small mirrors', 'levels 21–40 · folded twice', 'levels 41–60 · bigger courtyards',
    'levels 61–80 · four colours', 'levels 81–100 · the festival threshold'];
  var RG_MEM_TAG = ['A mirror rangoli', 'Chalk and colour', 'The courtyard grid', 'A four-fold rangoli',
    'The festival threshold', 'Grandmother’s pattern', 'The dawn rangoli'];
  var RG_CLEAR = 0.8;

  function rgIsTwist(i) { return (i + 1) % 4 === 0; }
  function rgBand(i) { return Math.min(5, 1 + Math.floor(i / 20)); }
  function rgLevel(i) {
    if (rgIsTwist(i)) {
      var slot = Math.floor((i + 1) / 4) - 1;              /* 0..24 across 100 */
      var t = RG_TRAD[slot % RG_TRAD.length], d = 1 + Math.floor(slot / RG_TRAD.length);
      var cfg = { kind: t.id, trad: t, d: d, label: t.name + ' · ' + t.region };
      if (t.id === 'muggu')   { cfg.n = Math.min(8, 6 + Math.floor(d / 2)); cfg.mode = 'rot'; cfg.colors = Math.min(3, 1 + d); cfg.seeds = 3 + d; cfg.given = true;
                                cfg.note = 'It turns four ways round its centre. One quarter stays on the floor — lay the other three.'; }
      if (t.id === 'alpana')  { cfg.n = 7; cfg.mode = 'curve'; cfg.colors = 1; cfg.d = d;
                                cfg.note = 'Curves in one white line, mirrored. Remember where the curve touched the grid.'; }
      if (t.id === 'mandana') { cfg.n = 7; cfg.mode = 'geo'; cfg.colors = 1; cfg.wall = true;
                                cfg.note = 'Lines and corners on the wall. Remember the shape, then lay it dot by dot.'; }
      if (t.id === 'rangoli') { cfg.n = Math.min(9, 6 + d); cfg.mode = 'vh'; cfg.colors = 4; cfg.seeds = 4 + d * 2;
                                cfg.note = 'Four colours, folded twice — one quarter remembered is the whole of it.'; }
      return cfg;
    }
    var m = i - Math.floor(i / 4);                          /* 0..74 memory steps */
    var n = Math.min(9, 4 + Math.floor(m / 9));
    return {
      kind: 'mem', n: n,
      mode: m < 6 ? 'v' : 'vh',
      colors: Math.min(4, 2 + Math.floor(m / 10)),
      seeds: Math.max(3, Math.min(Math.floor(n * n / 6), 3 + Math.floor(m / 4))),
      label: RG_MEM_TAG[Math.floor(m / 11) % RG_MEM_TAG.length],
      note: m < 6 ? 'Left and right match — remember one half, and the colours matter: pick below, then dot.'
                  : 'Folded twice: left-right and top-bottom. One quarter remembered is the whole rangoli.'
    };
  }
  /* the child's own level, through the app's Store seam (one child's, never the household's) */
  function rgLoad() {
    try { return Math.max(0, parseInt((W.IND_STORE ? W.IND_STORE.kidGet(RG_LKEY) : W.localStorage.getItem(RG_LKEY)) || '0', 10) || 0); }
    catch (e) { return 0; }
  }
  function rgSave(v) { try { if (W.IND_STORE) W.IND_STORE.kidSet(RG_LKEY, String(v)); else W.localStorage.setItem(RG_LKEY, String(v)); } catch (e) {} }

  function rangoliPattern(cfg) {
    var n = cfg.n, half = Math.ceil(n / 2), map = {}, tries = 0, ci = 0, r, c;
    var nc = Math.min(cfg.colors || 2, RG_COLOURS.length);
    function put(r2_, c2_, colour) { if (r2_ >= 0 && c2_ >= 0 && r2_ < n && c2_ < n) map[r2_ + ',' + c2_] = colour; }
    if (cfg.mode === 'curve') {
      /* two mirrored curves through the grid: a lotus arc and a vine */
      var ph = Math.random() * Math.PI * 2, amp = 1.2 + Math.random() * 0.9;
      for (c = 0; c < half; c++) {
        r = Math.round(1.6 + amp * Math.sin(ph + c * 1.1) + c * 0.55);
        put(r, c, RG_COLOURS[0]); put(r, n - 1 - c, RG_COLOURS[0]);
        if (cfg.d > 1) { var r3 = Math.round(n - 2 - amp * Math.cos(ph + c * 0.9)); put(r3, c, RG_COLOURS[0]); put(r3, n - 1 - c, RG_COLOURS[0]); }
      }
      return map;
    }
    if (cfg.mode === 'geo') {
      /* a diamond and a square ring, or two diamonds — straight lines and corners */
      var k = 2 + Math.floor(Math.random() * 2), mid = (n - 1) / 2, sq = Math.random() < 0.5;
      for (r = 0; r < n; r++) for (c = 0; c < n; c++) {
        var dd = Math.abs(r - mid) + Math.abs(c - mid);
        if (dd === k) put(r, c, RG_COLOURS[0]);
        if (sq && Math.max(Math.abs(r - mid), Math.abs(c - mid)) === 3 && (r + c) % 2 === 0) put(r, c, RG_COLOURS[0]);
        if (!sq && dd === 1) put(r, c, RG_COLOURS[0]);
      }
      return map;
    }
    var seeds = 0;
    while (seeds < cfg.seeds && tries < 400) {
      tries++;
      r = Math.floor(Math.random() * (cfg.mode === 'v' ? n : half));
      c = Math.floor(Math.random() * half);
      if (map[r + ',' + c]) continue;
      var colour = RG_COLOURS[ci % nc]; ci++;
      put(r, c, colour);
      if (cfg.mode === 'rot') { put(c, n - 1 - r, colour); put(n - 1 - r, n - 1 - c, colour); put(n - 1 - c, r, colour); }
      else {
        put(r, n - 1 - c, colour);
        if (cfg.mode === 'vh') { put(n - 1 - r, c, colour); put(n - 1 - r, n - 1 - c, colour); }
      }
      seeds++;
    }
    return map;
  }

  /* the painted threshold: a floor plate (red oxide by day, indigo by night) with a doorway sill,
     chalk dots with grain, and the marks — all CSS and inline SVG, no image */
  var RG_GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .22 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";
  var RG_CSS = [
    '.rg-wrap{--rg1:#fff6e2;--rg2:#f4b53a;--rg3:#8fd06f;--rg4:#86bdf5;--floor:#9b4426;--floor2:#7a321b;--sill:#5b3418;--chalk:#fff8ea}',
    '[data-mode="night"] .rg-wrap{--floor:#2c2246;--floor2:#1b1530;--sill:#120d22;--chalk:#f4ecff}',
    '.rg-wrap[data-theme-rg]{--floor:var(--rg-ground);--floor2:var(--rg-ground)}',
    '.rg-stagebox{max-width:560px;margin:0 auto}',
    '.rg-wrap .mela-btn{color:#fff}.rg-wrap .mela-btn.ghost{color:var(--text)}',
    /* what a child must tap stays above the tab bar on a phone (docs/32 Stage) */
    '.rg-stagebox>.mela-row:not(:empty),.rg-miss .gm-miss{position:sticky;bottom:calc(var(--rg-bar,0px) + 6px);z-index:3}',
    '.rg-stagebox>.mela-row:not(:empty){width:max-content;max-width:100%;margin:10px auto 0;padding:6px;border-radius:999px;background:color-mix(in srgb,var(--card) 90%,transparent);box-shadow:0 4px 14px rgba(20,10,40,.12)}',
    '.rg-wrap>.mela-stage{overflow:visible}',
    '@media(max-width:520px){.rg-wrap>.mela-hud{display:none}.rg-wrap>.mela-stage{padding:10px}}',
    '.rg-card{text-align:center;margin:0 0 8px}',
    '.rg-trad{display:inline-flex;flex-direction:column;align-items:center;gap:1px;padding:6px 16px;border-radius:14px;background:var(--card);border:1px solid var(--line2)}',
    '.rg-trad b{font:800 16px var(--display,Georgia,serif);color:var(--text)}',
    '.rg-trad span{font-size:12.5px;color:var(--text2)}',
    '.rg-plate{position:relative;margin:6px auto 0;width:min(100%,430px);padding:34px 18px 20px;border-radius:10px 10px 18px 18px;',
      'background:' + RG_GRAIN + ',radial-gradient(ellipse at 50% 0%,rgba(255,226,170,.28),transparent 62%),linear-gradient(180deg,var(--floor),var(--floor2));',
      'box-shadow:inset 0 0 0 1px rgba(0,0,0,.25),inset 0 -10px 24px rgba(0,0,0,.25),0 12px 30px rgba(40,15,5,.25)}',
    /* the doorway: a carved sill along the top, two posts, and a diya at each end */
    '.rg-plate:before{content:"";position:absolute;left:-6px;right:-6px;top:0;height:20px;border-radius:8px 8px 3px 3px;',
      'background:repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 14px,rgba(0,0,0,.08) 14px 16px),linear-gradient(180deg,#8a5a2b,var(--sill));box-shadow:0 3px 6px rgba(0,0,0,.35)}',
    '.rg-diya{position:absolute;top:-10px;width:22px;height:20px;z-index:1}',
    '.rg-diya.l{left:6px}.rg-diya.r{right:6px}',
    '.rg-diya i{position:absolute;left:50%;top:0;width:8px;height:12px;transform:translateX(-50%);border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(circle at 50% 72%,#fff3b0,#f39c2b);box-shadow:0 0 12px 4px rgba(255,190,90,.55)}',
    '.rg-diya b{position:absolute;left:0;right:0;bottom:0;height:9px;border-radius:0 0 11px 11px;background:#b5562e;box-shadow:inset 0 2px 0 rgba(255,255,255,.25)}',
    '.rg-plate.wall{border-radius:16px;padding:26px 18px 22px;background:' + RG_GRAIN + ',linear-gradient(180deg,#c0633a,#a24b28)}',
    '[data-mode="night"] .rg-plate.wall{background:' + RG_GRAIN + ',linear-gradient(180deg,#6d3523,#4d2316)}',
    '.rg-plate.wall:before{left:12px;right:12px;height:12px;top:8px;border-radius:999px;background:repeating-linear-gradient(90deg,#fff6e2 0 6px,transparent 6px 12px);opacity:.75;box-shadow:none}',
    '.rg-grid{display:grid;grid-template-columns:repeat(var(--n,4),1fr);gap:4px}',
    '.rg-dot{position:relative;aspect-ratio:1/1;min-width:30px;padding:0;border:0;background:transparent;cursor:pointer;border-radius:50%;display:grid;place-items:center}',
    '.rg-wrap .rg-dot.mela-dot{background:transparent;border:0;box-shadow:none;opacity:1;transform:none;min-width:30px}',
    '.rg-dot:before{content:"";width:22%;height:22%;border-radius:50%;background:radial-gradient(circle at 40% 35%,var(--chalk),rgba(255,248,234,.55) 70%,transparent 72%);opacity:.85}',
    '.rg-dot:disabled{cursor:default}',
    '.rg-dot:focus-visible{outline:3px solid #ffd36b;outline-offset:1px}',
    '.rg-dot svg{position:absolute;top:8%;right:8%;bottom:8%;left:8%;width:84%;height:84%;overflow:visible;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35))}',
    '.rg-dot svg .m{fill:var(--c);stroke:rgba(255,255,255,.55);stroke-width:.8}',
    '.rg-dot svg .m.ring{fill:none;stroke:var(--c);stroke-width:3.6}',
    '.rg-dot.lit:before,.rg-dot.mine:before,.rg-dot.hit:before,.rg-dot.near:before{opacity:0}',
    '.rg-dot.hit svg{filter:drop-shadow(0 0 0 #fff) drop-shadow(0 0 3px rgba(255,255,255,.9))}',
    '.rg-dot.hit:after{content:"";position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;box-shadow:inset 0 0 0 2.5px #9be8a5}',
    '.rg-dot.near:after{content:"";position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;box-shadow:inset 0 0 0 2.5px #ffd36b}',
    '.rg-dot.miss svg{opacity:.55}.rg-dot.miss:after{content:"";position:absolute;top:2px;right:2px;bottom:2px;left:2px;border-radius:50%;border:2px dashed rgba(255,255,255,.8)}',
    '.rg-dot.extra:after{content:"\\00d7";position:absolute;top:0;right:0;bottom:0;left:0;display:grid;place-items:center;font:800 18px var(--body,sans-serif);color:rgba(255,255,255,.85)}',
    '.rg-dot.given{cursor:default}.rg-dot.given svg{opacity:.9}',
    '.rg-axis{position:absolute;pointer-events:none;opacity:0;transition:opacity .2s ease}',
    '.rg-axis.on{opacity:.55}',
    '.rg-axis.v{left:50%;top:26px;bottom:14px;border-left:2px dashed var(--chalk)}',
    '.rg-axis.h{top:calc(50% + 7px);left:14px;right:14px;border-top:2px dashed var(--chalk)}',
    '.rg-over{position:absolute;left:18px;right:18px;top:34px;bottom:20px;pointer-events:none}',
    '.rg-over svg{width:100%;height:100%;overflow:visible}',
    '.rg-over path{fill:none;stroke:var(--chalk);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;opacity:.9}',
    '.rg-pal{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;margin:12px 0 2px}',
    '.rg-sw{width:48px;height:48px;border-radius:50%;border:3px solid var(--line2);background:var(--c);cursor:pointer;padding:0;display:grid;place-items:center;position:relative}',
    '.rg-sw svg{width:24px;height:24px}.rg-sw svg .m{fill:rgba(20,10,30,.55)}.rg-sw svg .m.ring{fill:none;stroke:rgba(20,10,30,.55);stroke-width:3.6}',
    '.rg-sw u{position:absolute;right:-4px;bottom:-4px;width:18px;height:18px;border-radius:50%;background:var(--card);border:1px solid var(--line2);font:800 10px/16px var(--body,sans-serif);text-decoration:none;color:var(--text2)}',
    '.rg-sw.on{border-color:var(--text);box-shadow:0 0 0 4px var(--accent-soft)}',
    '.rg-sw:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.rg-kolam{display:block;width:100%;height:auto}',
    '.rg-kdot{cursor:pointer}.rg-kdot .kh{fill:transparent}',
    '.rg-kdot .kd{fill:var(--chalk);stroke:rgba(0,0,0,.25);stroke-width:1}',
    '.rg-kdot.done .kd{fill:#ffd36b}',
    '.rg-kdot.first .kd{fill:#ffb347;stroke:#fff;stroke-width:2}',
    '.rg-kdot.shake{animation:melashake .3s}',
    '.rg-kdot:focus{outline:none}.rg-kdot:focus-visible .kd{stroke:#ffd36b;stroke-width:4}',
    '.rg-kline{fill:none;stroke:var(--chalk);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}',
    '.rg-miss{margin:12px auto 0;max-width:430px;text-align:left}',
    '.rg-wrap .gm-miss{background:var(--card);border:1px solid var(--line2);border-left:4px solid var(--accent3);border-radius:14px;padding:12px 14px}',
    '.rg-wrap .gm-miss .gm-teach{margin:6px 0 10px;font-size:14px;color:var(--text2)}',
    '.rg-wrap .gm-miss .gm-ans{color:var(--text)}',
    '@media(max-width:480px){.rg-plate{padding:30px 10px 14px}.rg-grid{gap:2px}.rg-over{left:10px;right:10px;top:30px;bottom:14px}}',
    '@media(prefers-reduced-motion:reduce){.rg-wrap *{animation:none!important;transition:none!important}}'
  ].join('');
  function rgCSS() {
    if (!D || D.getElementById('rg-css')) return;
    var s = D.createElement('style'); s.id = 'rg-css';
    s.appendChild(D.createTextNode(RG_CSS));
    (D.head || D.documentElement).appendChild(s);
  }
  function rgMarkSVG(ci) {
    var k = RG_MARKS[ci] || 'dot', s = '<svg viewBox="0 0 20 20" aria-hidden="true">';
    if (k === 'dot') s += '<circle class="m" cx="10" cy="10" r="7"/>';
    else if (k === 'ring') s += '<circle class="m ring" cx="10" cy="10" r="5.6"/>';
    else if (k === 'petal') s += '<path class="m" d="M10 1.5C15.5 6.5 15.5 13.5 10 18.5C4.5 13.5 4.5 6.5 10 1.5Z"/>';
    else {
      var d = '', i;
      for (i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 3.6 : 8.8; d += (i ? 'L' : 'M') + (10 + Math.cos(a) * rr).toFixed(2) + ' ' + (10 + Math.sin(a) * rr).toFixed(2); }
      s += '<path class="m" d="' + d + 'Z"/>';
    }
    return s + '</svg>';
  }

  function rangoli(host, opts, done) {
    opts = opts || {};
    var sc = scope();
    rgCSS();
    var ref = shell(host, 'Rangoli Rush', 'Art and memory · a hundred thresholds', 3);
    var wrap = host.querySelector('.mela-wrap');
    if (wrap) wrap.classList.add('rg-wrap');
    var theme = RG_THEMES[opts.skin || ''];
    if (theme && wrap) {
      wrap.setAttribute('data-theme-rg', opts.skin);
      theme.c.forEach(function (c, i) { wrap.style.setProperty('--rg' + (i + 1), c); });
      wrap.style.setProperty('--rg-ground', theme.ground); wrap.style.setProperty('--rg-dot', theme.dot);
    }
    var slow = !!opts.reduced || reducedMotion();
    var SLOTS = 3;
    var saved = rgLoad(), lvl = saved;
    /* the host's level chip names a band of twenty; a band below the ladder replays it, a band
       above starts at its first level. The ladder itself only ever moves forward. */
    if (opts.level >= 1 && opts.level <= 5 && rgBand(lvl) !== opts.level) lvl = (opts.level - 1) * 20;
    var slot = 0, score = 0, passedN = 0, finished = false, asked = 0, firstRight = 0, reported = {};
    var cfg = null, pattern = null, mine = null, phase = 'show', attempt = 1, peeks = 0, resume = null;
    var palIdx = 0, kol = null, lvlResult = null, gen = 0, raf = 0;

    function keys(map) { var k = [], q; for (q in map) if (map.hasOwnProperty(q)) k.push(q); return k; }
    function nColors() { return Math.min(cfg.colors || 2, RG_COLOURS.length); }
    function ci(colour) { return Math.max(0, RG_COLOURS.indexOf(colour)); }
    function isGiven(k) {
      if (!cfg.given) return false;
      var p = k.split(','), h = Math.ceil(cfg.n / 2);
      return +p[0] < Math.floor(cfg.n / 2) && +p[1] < h;
    }

    /* ---- the ladder header and the level card ---- */
    function ladderHTML(cur) {
      var d0 = Math.floor(cur / 10) * 10;
      var h = '<div class="mela-ladder" aria-label="Level ' + (cur + 1) + ' of 100">' +
        '<b class="mela-lvln">Level ' + (cur + 1) + '<i> of 100</i></b>' +
        '<span class="mela-lbar"><i style="width:' + Math.min(100, cur) + '%"></i></span><span class="mela-decade">';
      for (var i = d0; i < d0 + 10; i++) {
        h += '<span class="mela-diya' + (i < cur ? ' lit' : i === cur ? ' now' : '') + (rgIsTwist(i) ? ' twist' : '') + '">' + (rgIsTwist(i) ? '✦' : '') + '</span>';
      }
      return h + '</span></div>';
    }
    function cardHTML() {
      if (cfg.trad) return '<div class="rg-card"><span class="rg-trad"><b>' + esc(cfg.trad.name) + '</b><span>' + esc(cfg.trad.region) +
        (cfg.trad.how ? ' · ' + esc(cfg.trad.how) : '') + '</span></span></div>';
      return '<p class="mela-kicker" style="text-align:center">' + esc(cfg.label) + '</p>';
    }
    function head(question) {
      return ladderHTML(lvl) + cardHTML() + '<h3 class="mela-q">' + esc(question) + '</h3>';
    }
    function plateOpen() {
      return '<div class="rg-plate' + (cfg.wall ? ' wall' : '') + '">' +
        (cfg.wall ? '' : '<span class="rg-diya l" aria-hidden="true"><i></i><b></b></span><span class="rg-diya r" aria-hidden="true"><i></i><b></b></span>');
    }
    function boardHTML() {
      var n = cfg.n, h = plateOpen() + '<div class="rg-grid" role="group" aria-label="Chalk dots on the threshold" style="--n:' + n + '">';
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
        h += '<button type="button" class="rg-dot mela-dot" data-k="' + r + ',' + c + '" tabindex="' + (r === 0 && c === 0 ? '0' : '-1') +
          '" aria-pressed="false" aria-label="Row ' + (r + 1) + ', dot ' + (c + 1) + '"></button>';
      }
      h += '</div>' + (cfg.mode === 'curve' || cfg.mode === 'geo' ? '<div class="rg-over" aria-hidden="true"></div>' : '') +
        '<div class="rg-axis v"></div>' + (cfg.mode === 'vh' || cfg.mode === 'rot' ? '<div class="rg-axis h"></div>' : '') + '</div>';
      return h;
    }
    function dot(k) { return ref.stage.querySelector('.rg-dot[data-k="' + k + '"]'); }
    function allDots() { return ref.stage.querySelectorAll('.rg-dot'); }
    function setAxis(on) {
      var ax = ref.stage.querySelectorAll('.rg-axis');
      for (var i = 0; i < ax.length; i++) ax[i].classList.toggle('on', !!on);
    }
    function paintDot(d, cls, colour) {
      d.className = 'rg-dot mela-dot' + (cls ? ' ' + cls : '');
      d.style.setProperty('--c', colour || 'transparent');
      d.innerHTML = colour && cls !== 'extra' ? rgMarkSVG(ci(colour)) : '';
    }
    /* the curve or the shape, drawn through the dots it touches (alpana, mandana) */
    function overlay(on) {
      var o = ref.stage.querySelector('.rg-over');
      if (!o) return;
      if (!on) { o.innerHTML = ''; return; }
      var n = cfg.n, pts = keys(pattern).map(function (k) { var p = k.split(','); return [+p[1], +p[0]]; });
      var cx = function (c) { return ((c + 0.5) / n * 100).toFixed(2); };
      var path = '';
      if (cfg.mode === 'curve') {
        var byCol = {};
        pts.forEach(function (p) { (byCol[p[0]] = byCol[p[0]] || []).push(p[1]); });
        [0, 1].forEach(function (lane) {
          var line = [];
          for (var c = 0; c < n; c++) if (byCol[c]) { var rs = byCol[c].slice().sort(function (a, b) { return a - b; }); line.push([c, rs[lane ? rs.length - 1 : 0]]); }
          if (line.length > 1) {
            path += 'M' + cx(line[0][0]) + ' ' + cx(line[0][1]);
            for (var j = 1; j < line.length; j++) {
              var a = line[j - 1], b = line[j];
              path += 'Q' + cx(a[0] + 0.5) + ' ' + cx((a[1] + b[1]) / 2 - 0.6) + ' ' + cx(b[0]) + ' ' + cx(b[1]);
            }
          }
        });
      } else {
        /* straight lines between neighbouring dots of the shape */
        var on2 = {}, mid = (n - 1) / 2;
        pts.forEach(function (p) { on2[p[0] + ',' + p[1]] = 1; });
        var dd = function (x, y) { return Math.abs(x - mid) + Math.abs(y - mid); };
        var ring = function (x, y) { return Math.max(Math.abs(x - mid), Math.abs(y - mid)) === 3; };
        pts.forEach(function (p) {
          [[1, 1], [1, -1], [2, 0], [0, 2]].forEach(function (dv) {
            var x = p[0] + dv[0], y = p[1] + dv[1];
            if (!on2[x + ',' + y]) return;
            /* a diamond's edge joins dots at one distance from the centre; a square's, dots on its ring */
            if (dv[0] && dv[1] ? dd(x, y) !== dd(p[0], p[1]) : !(ring(x, y) && ring(p[0], p[1]))) return;
            path += 'M' + cx(p[0]) + ' ' + cx(p[1]) + 'L' + cx(x) + ' ' + cx(y);
          });
        });
      }
      o.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="' + path + '" vector-effect="non-scaling-stroke"/></svg>';
    }
    function paintShow() {
      var ds = allDots();
      for (var i = 0; i < ds.length; i++) {
        var d = ds[i], k = d.getAttribute('data-k');
        paintDot(d, pattern[k] ? 'lit' : '', pattern[k]);
        d.disabled = true;
        d.setAttribute('aria-pressed', pattern[k] ? 'true' : 'false');
      }
      setAxis(true); overlay(true);
    }
    function paintMine() {
      var ds = allDots();
      for (var i = 0; i < ds.length; i++) {
        var d = ds[i], k = d.getAttribute('data-k');
        if (isGiven(k)) { paintDot(d, pattern[k] ? 'lit given' : 'given', pattern[k]); d.disabled = true; continue; }
        paintDot(d, mine[k] ? 'mine' : '', mine[k]);
        d.disabled = false;
        d.setAttribute('aria-pressed', mine[k] ? 'true' : 'false');
      }
      setAxis(false); overlay(false);
    }
    function paletteHTML() {
      if (nColors() < 2) return '';
      var h = '<div class="rg-pal" role="radiogroup" aria-label="Pick a chalk">';
      for (var i = 0; i < nColors(); i++) {
        h += '<button type="button" class="rg-sw' + (i === palIdx ? ' on' : '') + '" data-sw="' + i + '" style="--c:' + RG_COLOURS[i] +
          '" role="radio" aria-checked="' + (i === palIdx) + '" aria-label="Chalk ' + (i + 1) + ', the ' + RG_MARKS[i] + '">' + rgMarkSVG(i) + '<u>' + (i + 1) + '</u></button>';
      }
      return h + '</div>';
    }
    /* the shell's tab bar, measured rather than guessed, so the action row can sit above it */
    function barH() {
      try {
        var el = D.elementFromPoint(Math.floor(W.innerWidth / 2), W.innerHeight - 6);
        while (el && el !== D.body && el !== D.documentElement) {
          var cs = W.getComputedStyle(el);
          if (cs.position === 'fixed' || cs.position === 'sticky') { var r = el.getBoundingClientRect(); if (r.top > W.innerHeight * 0.5) return Math.max(0, W.innerHeight - r.top); }
          el = el.parentElement;
        }
      } catch (e) {}
      return 0;
    }
    function markBar() { if (wrap) wrap.style.setProperty('--rg-bar', barH() + 'px'); }
    sc.on(W, 'resize', markBar);
    function layout(question, mainLabel, mainGo, ghostLabel, ghostGo, hint, extra) {
      ref.stage.innerHTML = '<div class="rg-stagebox">' + head(question) + boardHTML() + (extra || '') +
        '<p class="mela-count" data-role="count"></p>' +
        '<div class="mela-row">' +
          (mainLabel ? '<button type="button" class="mela-btn" data-go="' + mainGo + '">' + esc(mainLabel) + '</button>' : '') +
          (ghostLabel ? '<button type="button" class="mela-btn ghost" data-go="' + ghostGo + '">' + esc(ghostLabel) + '</button>' : '') +
        '</div><div class="rg-miss"></div>' +
        '<p class="mela-hint">' + esc(hint) + '</p></div>';
      markBar();
    }
    function need() { return keys(pattern).filter(function (k) { return !isGiven(k); }); }
    function countLine() {
      var el = ref.stage.querySelector('[data-role="count"]');
      if (!el) return;
      var nd = need().length, got = keys(mine).length;
      el.textContent = phase !== 'draw' ? ''
        : got <= nd ? (got + ' of ' + nd + ' dots placed')
        : (nd + ' of ' + nd + ' dots placed, and ' + (got - nd) + ' extra — tap ' + (got - nd === 1 ? 'it' : 'them') + ' again to lift');
    }

    /* ---- THE CLOCK (R1): one countdown, on requestAnimationFrame with real elapsed time, owned
       by a generation number. "I have got it" ends it, and nothing a stale timer does can reach
       a board that has moved on — drawPhase() runs only from the show it belongs to. ---- */
    function stopClock() { gen++; if (raf && W.cancelAnimationFrame) W.cancelAnimationFrame(raf); raf = 0; }
    function countdown(secs, g) {
      var left = secs * 1000, last = null;
      function tick(ts) {
        if (g !== gen || phase !== 'show' || sc.dead) return;
        if (detached(host)) { sc.kill(); return; }
        if (last !== null) left -= Math.min(100, ts - last);          /* a hidden tab gets no credit */
        last = ts;
        var el = ref.stage.querySelector('[data-role="count"]');
        if (el) el.textContent = left > 0 ? 'The dust blows away in ' + Math.ceil(left / 1000) + '…' : '';
        if (left <= 0) { drawPhase(g); return; }
        raf = W.requestAnimationFrame(tick);
      }
      if (opts.calm) {
        var el0 = ref.stage.querySelector('[data-role="count"]');
        if (el0) el0.textContent = 'Take your time — press “I have got it” when you are ready.';
        return;
      }
      raf = W.requestAnimationFrame(tick);
    }
    function showPhase() {
      stopClock();
      phase = 'show';
      var g = gen, nd = keys(pattern).length;
      layout('Look carefully…', resume ? 'Got it' : 'I have got it', 'ready', '', '', cfg.note);
      paintShow();
      ref.say(nColors() > 1 ? nd + ' dots in ' + nColors() + ' chalks — each chalk has its own mark.' : nd + ' dots in one chalk.');
      countdown(resume ? (slow ? 4 : 3) : Math.max(3, Math.round(nd * 0.5) + 2) + (slow ? 2 : 0), g);
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="ready"]')); }, 60);
    }
    function drawPhase(g) {
      if (g !== gen || phase !== 'show') return;      /* only the show it belongs to may end */
      stopClock();
      phase = 'draw';
      if (resume) { mine = resume; resume = null; }
      layout(cfg.given ? 'Lay the other three quarters' : 'Now lay it back', 'Check my ' + (cfg.trad ? cfg.trad.name.toLowerCase() : 'rangoli'), 'check',
        'Show me again', 'peek',
        (nColors() > 1 ? 'Pick a chalk below (or 1–' + nColors() + '), then tap the dots. ' : 'Tap the dots. ') + 'Tap a dot again to lift it. Enter checks.',
        paletteHTML());
      paintMine();
      countLine();
      ref.say('');
      sc.later(function () {
        var first = ref.stage.querySelector('.rg-dot:not(:disabled)');
        if (first) { first.setAttribute('tabindex', '0'); focusSoft(first); }
      }, 60);
    }
    function report(right) {
      var id = 'level-' + (lvl + 1);
      if (reported[lvl]) return;
      reported[lvl] = true;
      asked++; if (right) firstRight++;
      if (typeof opts.answer === 'function') {
        try { opts.answer({ id: id, right: !!right, firstTry: true, skill: 'memory.pattern', objective: null }); } catch (e) {}
      }
    }
    function checkPhase() {
      if (phase !== 'draw') return;
      stopClock();
      phase = 'checked';
      var nd = need(), got = keys(mine), i, hit = 0, wrongC = 0, extra = 0;
      var ds = allDots();
      for (i = 0; i < ds.length; i++) {
        var d = ds[i], k = d.getAttribute('data-k');
        d.disabled = true;
        if (isGiven(k)) continue;
        var inP = !!pattern[k], inM = !!mine[k];
        if (inP && inM && pattern[k] === mine[k]) paintDot(d, 'hit', pattern[k]);
        else if (inP && inM) paintDot(d, 'near', pattern[k]);
        else if (inP) paintDot(d, 'miss', pattern[k]);
        else if (inM) paintDot(d, 'extra', mine[k]);
        else paintDot(d, '', null);
      }
      for (i = 0; i < got.length; i++) {
        if (!pattern[got[i]]) extra++;
        else if (pattern[got[i]] === mine[got[i]]) hit++;
        else wrongC++;
      }
      var acc = nd.length ? hit / (nd.length + extra + wrongC) : 0;
      settle(acc >= RG_CLEAR, hit === nd.length && !extra && !wrongC, acc,
        hit + ' of ' + nd.length + ' dots right in the right chalk' + (wrongC ? ', ' + wrongC + ' in another chalk' : '') + (extra ? ', ' + extra + ' extra' : '') + '.');
      setAxis(true); overlay(true);
    }
    /* every level, dots or kolam, ends through this one door */
    function settle(cleared, perfect, acc, line) {
      var first = attempt === 1 && peeks === 0;
      report(cleared && first);
      var pts = first ? Math.max(0, Math.round(100 * acc)) : 0;    /* a retry is for learning: it never scores */
      score += pts;
      var stars = perfect && first ? 3 : perfect ? 2 : cleared ? 1 : 0;
      lvlResult = { pass: cleared, stars: stars };
      var qEl = ref.stage.querySelector('.mela-q');
      if (qEl) qEl.textContent = cleared ? (perfect ? 'Exactly right — every chalk in its place' : 'Cleared — the threshold is dressed') : 'Here it is again';
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (cEl) cEl.textContent = [pts ? '+' + pts + ' points' : '', stars ? Array(stars + 1).join('★') : ''].filter(Boolean).join(' · ');
      var row = ref.stage.querySelector('.mela-row'), miss = ref.stage.querySelector('.rg-miss');
      if (cleared) {
        if (row) row.innerHTML = '<button type="button" class="mela-btn" data-go="lvlnext">Level cleared →</button>';
        if (miss) miss.innerHTML = '';
        ref.say(line);
        sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="lvlnext"]')); }, 60);
      } else {
        if (row) row.innerHTML = '';
        if (miss) miss.innerHTML = '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">' + esc(line) +
          ' The ' + (cfg.trad ? cfg.trad.name.toLowerCase() : 'rangoli') + ' is back on the board.</span>' +
          '<p class="gm-teach">' + esc(teachLine()) + '</p>' +
          '<div class="mela-row" style="justify-content:flex-start;margin-top:0"><button type="button" class="btn mela-btn gm-aage" data-gm="aage">Aage →</button>' +
          '<button type="button" class="mela-btn ghost" data-go="retry">Try this one again</button></div></div>';
        ref.say('');
        sc.later(function () { focusSoft(ref.stage.querySelector('[data-gm="aage"]')); }, 60);
      }
    }
    function teachLine() {
      if (cfg.kind === 'kolam') return 'The line goes round the dots in one order. Watch where it turns, and follow it from the bright dot.';
      if (cfg.mode === 'rot') return 'Turn the quarter you were given a quarter-turn at a time — each turn lands on the next corner.';
      if (cfg.mode === 'curve') return 'The two halves mirror each other: follow the curve down one side, and the other side copies it.';
      if (cfg.mode === 'geo') return 'Count the dots from the centre to each corner: a diamond is the same count every way.';
      return cfg.mode === 'v' ? 'Remember one half and its chalks — the mirror makes the other.' : 'Remember one quarter: fold it left-right, then top-bottom.';
    }
    function toggle(d) {
      if (phase !== 'draw' || !d || d.disabled) return;
      var k = d.getAttribute('data-k'), col = RG_COLOURS[palIdx];
      if (mine[k] === col) { delete mine[k]; paintDot(d, '', null); d.setAttribute('aria-pressed', 'false'); }
      else { mine[k] = col; paintDot(d, 'mine', col); d.setAttribute('aria-pressed', 'true'); }
      countLine();
    }
    function moveDot(from, dr, dc) {
      var pq = (from.getAttribute('data-k') || '0,0').split(',');
      var r = Math.min(cfg.n - 1, Math.max(0, parseInt(pq[0], 10) + dr));
      var c = Math.min(cfg.n - 1, Math.max(0, parseInt(pq[1], 10) + dc));
      var next = dot(r + ',' + c);
      if (!next) return;
      var ds = allDots();
      for (var i = 0; i < ds.length; i++) ds[i].setAttribute('tabindex', '-1');
      next.setAttribute('tabindex', '0');
      focusSoft(next);
    }
    function pickColor(i) {
      if (i < 0 || i >= nColors()) return;
      palIdx = i;
      var sws = ref.stage.querySelectorAll('.rg-sw');
      for (var k = 0; k < sws.length; k++) { sws[k].classList.toggle('on', k === i); sws[k].setAttribute('aria-checked', String(k === i)); }
    }

    /* ---- KOLAM: one continuous line around the dots; the order is shown, then hidden ---- */
    function kolamStart() {
      var k = 8 + 2 * Math.min(4, cfg.d), steps = [3, 5, 7].filter(function (s) { return gcd(s, k) === 1 && s < k / 2; });
      var step = steps[Math.min(steps.length - 1, cfg.d - 1)] || 3, i;
      var pts = [];
      for (i = 0; i < k; i++) {
        var a = (i / k) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 112 : 132;
        pts.push({ x: 170 + Math.cos(a) * r, y: 158 + Math.sin(a) * r });
      }
      var order = [], at = 0;
      for (i = 0; i < k; i++) { order.push(at); at = (at + step) % k; }
      kol = { pts: pts, order: order, next: 1, miss: 0 };
      kolamBoard();
      kolamShow();
    }
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    function kolamBoard() {
      ref.stage.innerHTML = '<div class="rg-stagebox">' + head('Watch the line go round — then trace it') + plateOpen() +
        '<svg class="rg-kolam" viewBox="0 0 340 320" role="group" aria-label="Kolam dots"><path class="rg-kline" d=""/>' +
        kol.pts.map(function (pt, j) {
          return '<g class="rg-kdot" data-kd="' + j + '" role="button" tabindex="' + (j === kol.order[0] ? '0' : '-1') + '" aria-label="Dot ' + (j + 1) + '">' +
            '<circle class="kh" cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="24"/>' +
            '<circle class="kd" cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="8"/></g>';
        }).join('') + '</svg></div>' +
        '<p class="mela-count" data-role="count"></p><div class="mela-row"></div><div class="rg-miss"></div>' +
        '<p class="mela-hint">Tap the dots in the order the line went — Tab and Enter work too. Two slips are allowed; a third ends the level.</p></div>';
    }
    function kolamPath(n) {
      var d = '';
      for (var j = 0; j < n; j++) { var p = kol.pts[kol.order[j % kol.order.length]]; d += (j ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }
      return d;
    }
    function kolamShow() {
      stopClock();
      phase = 'show';
      var g = gen, n = 0, total = kol.order.length + 1;
      var line = ref.stage.querySelector('.rg-kline');
      var el = ref.stage.querySelector('[data-role="count"]');
      if (el) el.textContent = 'Watch the line…';
      ref.say('The line starts at the bright dot.');
      markKolam();
      (function grow() {
        if (g !== gen || phase !== 'show' || sc.dead) return;
        n++;
        if (line) line.setAttribute('d', kolamPath(Math.min(n, total)));
        if (n < total) { sc.later(grow, slow ? 700 : 480); return; }
        sc.later(function () {
          if (g !== gen || phase !== 'show') return;
          phase = 'trace';
          if (line) line.setAttribute('d', '');
          kol.next = 1;
          markKolam();
          if (el) el.textContent = 'Now trace it from the bright dot · ' + (kol.order.length - 1) + ' dots to go';
          ref.say('Your turn — the order is hidden now.');
          focusSoft(ref.stage.querySelector('.rg-kdot.first'));
        }, slow ? 1600 : 1100);
      })();
    }
    function markKolam() {
      var gs = ref.stage.querySelectorAll('.rg-kdot');
      for (var j = 0; j < gs.length; j++) {
        var idx = +gs[j].getAttribute('data-kd'), pos = kol.order.indexOf(idx);
        gs[j].setAttribute('class', 'rg-kdot' + (idx === kol.order[0] ? ' first' : '') + (phase === 'trace' && pos > 0 && pos < kol.next ? ' done' : ''));
      }
    }
    function kolamTap(idx) {
      if (phase !== 'trace') return;
      var want = kol.order[kol.next], line = ref.stage.querySelector('.rg-kline');
      var g = ref.stage.querySelector('.rg-kdot[data-kd="' + idx + '"]');
      if (idx === kol.order[0] && kol.next === kol.order.length) want = idx;
      if (idx !== want) {
        kol.miss++;
        if (g) { g.classList.remove('shake'); void g.getBoundingClientRect(); g.classList.add('shake'); }
        if (kol.miss >= 3) return kolamEnd(false);
        ref.say('Not that one — ' + (3 - kol.miss) + ' slip' + (3 - kol.miss === 1 ? '' : 's') + ' left.');
        return;
      }
      kol.next++;
      if (line) line.setAttribute('d', kolamPath(kol.next));
      markKolam();
      var el = ref.stage.querySelector('[data-role="count"]');
      if (kol.next > kol.order.length) return kolamEnd(true);
      if (el) el.textContent = kol.next === kol.order.length ? 'Close the loop — back to the bright dot' : (kol.order.length - kol.next) + ' dots to go';
    }
    function kolamEnd(ok) {
      phase = 'checked';
      var line = ref.stage.querySelector('.rg-kline');
      if (line) line.setAttribute('d', kolamPath(kol.order.length + 1));
      var acc = ok ? Math.max(0, 1 - kol.miss * 0.15) : Math.max(0, (kol.next - 1) / kol.order.length - 0.3);
      settle(ok, ok && kol.miss === 0, acc, ok ? (kol.miss ? 'The loop closed, with ' + kol.miss + ' slip' + (kol.miss > 1 ? 's' : '') + '.' : 'One unbroken line — the loop closed true.')
        : 'Three slips — ' + (kol.next - 1) + ' of ' + kol.order.length + ' turns traced.');
    }

    /* --------------------------------------------- the ladder itself ---- */
    function levelUp() {
      var res = lvlResult || { pass: false, stars: 0 };
      if (res.pass) {
        passedN++;
        if (lvl + 1 > rgLoad()) rgSave(lvl + 1);
        lvl++;
      }
      slot++;
      ref.mark(slot > SLOTS ? SLOTS : slot, slot >= SLOTS ? 'end' : undefined);
      if (lvl >= 100 && res.pass) return finish(true);
      if (slot >= SLOTS) return finish(false);
      var nxt = rgLevel(lvl);
      ref.stage.innerHTML = '<div class="mela-done">' + ladderHTML(lvl) +
          '<h3>' + (res.pass ? 'Level up!' : 'Level ' + (lvl + 1) + ' waits') + '</h3>' +
          '<p>' + (res.pass ? 'Cleared. The ladder remembers between sittings.' : 'The same level comes round again — look for the fold.') + '</p>' +
          '<div class="mela-row"><button type="button" class="mela-btn" data-go="startlvl">' +
          (nxt.trad ? nxt.trad.name + ' · ' + nxt.trad.region : 'Next rangoli') + ' →</button></div></div>';
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="startlvl"]')); }, 60);
    }
    function startLevel() {
      stopClock();
      cfg = rgLevel(lvl);
      lvlResult = null; palIdx = 0; kol = null; attempt = 1; peeks = 0; resume = null;
      if (cfg.kind === 'kolam') { kolamStart(); return; }
      pattern = rangoliPattern(cfg);
      if (!need().length) pattern = rangoliPattern(cfg);
      mine = {};
      showPhase();
    }
    function finish(summit) {
      if (finished) return;
      stopClock();
      phase = 'over';
      ref.say('');
      ref.stage.innerHTML = '<div class="mela-done">' + ladderHTML(lvl) +
          '<div class="mela-art">' + (motifHTML('lotus') || mascotHTML('happy', 100)) + '</div>' +
          '<h3>' + (summit ? 'The hundredth threshold!' : passedN ? 'Thresholds dressed' : 'The chalk will wait') + '</h3>' +
          '<p>' + (summit ? 'A hundred thresholds — kolam, muggu, alpana, mandana and rangoli.'
            : passedN + ' of ' + SLOTS + ' levels cleared this sitting. You stand at level ' + (rgLoad() + 1) + ' of 100 — the ladder keeps your place.') + '</p>' +
          '<div class="mela-tally"><span class="mela-chip"><b>' + score + '</b> points</span></div>' +
          '<div class="mela-row"><button type="button" class="mela-btn" data-go="out">Finish</button>' +
          '<button type="button" class="mela-btn ghost" data-go="again">Climb on</button></div></div>';
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="out"]')); }, 60);
    }
    function bail(win) {
      if (finished) return;
      finished = true;
      stopClock();
      sc.kill();
      if (typeof done === 'function') done({ win: !!win, score: score, asked: asked, firstTryRight: firstRight, level: rgBand(lvl) });
    }

    sc.on(ref.stage, 'click', function (e) {
      var t = e.target;
      var sw = t.closest ? t.closest('.rg-sw[data-sw]') : null;
      if (sw) { pickColor(parseInt(sw.getAttribute('data-sw'), 10)); return; }
      var kd = t.closest ? t.closest('.rg-kdot') : null;
      if (kd) { kolamTap(+kd.getAttribute('data-kd')); return; }
      var d = t.closest ? t.closest('.rg-dot') : null;
      if (d) { toggle(d); return; }
      if (t.closest && t.closest('[data-gm="aage"]')) { levelUp(); return; }
      var go = t.closest ? t.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'ready') drawPhase(gen);
      else if (what === 'check') checkPhase();
      else if (what === 'peek') { if (phase === 'draw') { peeks++; resume = mine; showPhase(); } }
      else if (what === 'retry') {
        attempt++;
        if (cfg.kind === 'kolam') { kol.next = 1; kol.miss = 0; kolamBoard(); kolamShow(); }
        else { mine = {}; resume = {}; showPhase(); }
      }
      else if (what === 'lvlnext') levelUp();
      else if (what === 'startlvl') startLevel();
      else if (what === 'again') { slot = 0; passedN = 0; lvl = rgLoad(); ref.mark(0); startLevel(); }
      else if (what === 'out') bail(passedN > 0);
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead || !ref.stage) return;
      if (detached(host)) { sc.kill(); return; }
      var t = e.target;
      if (phase === 'trace' && (e.key === 'Enter' || e.key === ' ')) {
        var kd = t && t.closest && t.closest('.rg-kdot');
        if (kd) { e.preventDefault(); kolamTap(+kd.getAttribute('data-kd')); }
        return;
      }
      if (phase === 'checked' && e.key === 'Enter' && !(t && t.closest && t.closest('button'))) {
        var aage = ref.stage.querySelector('[data-gm="aage"]'), nx = ref.stage.querySelector('[data-go="lvlnext"]');
        if (aage || nx) { e.preventDefault(); levelUp(); }
        return;
      }
      if (phase === 'draw' && e.key >= '1' && e.key <= '4') { e.preventDefault(); pickColor(+e.key - 1); return; }
      var d = t && t.classList && t.classList.contains('rg-dot') ? t : null;
      if (d && phase === 'draw') {
        if (e.key === 'ArrowRight') { e.preventDefault(); moveDot(d, 0, 1); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); moveDot(d, 0, -1); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveDot(d, 1, 0); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); moveDot(d, -1, 0); return; }
      }
      if (e.key === 'Enter' && phase === 'draw' && !d && !(t && t.closest && t.closest('button'))) { e.preventDefault(); checkPhase(); }
    });

    startLevel();
    /* test handle for tools/check-rangoli.js: what the board holds, never shown */
    host.__rangoli = { get phase() { return phase; }, get pattern() { return pattern; }, get cfg() { return cfg; }, get lvl() { return lvl; },
      get kolam() { return kol; }, jump: function (i) { lvl = i; startLevel(); } };
    return teardownOf(sc, function () { finished = true; stopClock(); });
  }

  /* ==================================================================
     GAME 2 · YATRA / STATE HUNT
     Data comes from window.IND_GEO when the app supplies it; otherwise
     this built-in set. Every clue is written so it never names its own
     state — the answer is never on screen before it is earned.
     ================================================================== */

  var STATES = [
    { code: 'RJ', name: 'Rajasthan', capital: 'Jaipur', capQ: true,
      clues: ['Camels cross the Thar, India’s biggest desert, right here.',
              'Amber Fort and a whole city painted pink stand in this state.'] },
    { code: 'KL', name: 'Kerala', capital: 'Thiruvananthapuram', capQ: true,
      clues: ['Long snake boats race down the backwaters here every Onam.',
              'Ships have come to this coast for black pepper for two thousand years.'] },
    { code: 'TN', name: 'Tamil Nadu', capital: 'Chennai', capQ: true,
      clues: ['The Chola kings built the huge stone temple at Thanjavur here a thousand years ago.',
              'Bharatanatyam is danced here, and Pongal is the big harvest festival.'] },
    { code: 'WB', name: 'West Bengal', capital: 'Kolkata', capQ: true,
      clues: ['Tigers that can swim live in the Sundarbans mangrove forest here.',
              'Durga Puja fills the streets of this state’s cities every autumn.'] },
    { code: 'GJ', name: 'Gujarat', capital: 'Gandhinagar', capQ: true,
      clues: ['The last wild lions in Asia live in the Gir forest here.',
              'People dance garba in circles for nine nights here.'] },
    { code: 'MH', name: 'Maharashtra', capital: 'Mumbai', capQ: true,
      clues: ['Monks carved and painted the Ajanta and Ellora caves out of solid rock here.',
              'Shivaji built hill forts across this state.'] },
    { code: 'PB', name: 'Punjab', capital: 'Chandigarh', capQ: false,
      clues: ['Harmandir Sahib, the Golden Temple, shines in the city of Amritsar here.',
              'Five rivers water the wheat fields of this state — its name means “five waters”.'] },
    { code: 'AS', name: 'Assam', capital: 'Dispur', capQ: true,
      clues: ['Most of the world’s one-horned rhinos live in the Kaziranga grasslands here.',
              'The mighty Brahmaputra river braids across this state.'] },
    { code: 'KA', name: 'Karnataka', capital: 'Bengaluru', capQ: true,
      clues: ['The stone ruins of Hampi stand among giant boulders here.',
              'Mysuru’s palace lights up for ten nights of Dasara in this state.'] },
    { code: 'UP', name: 'Uttar Pradesh', capital: 'Lucknow', capQ: true,
      clues: ['The Taj Mahal at Agra and the river steps of Varanasi are both in this state.',
              'The Ganga runs right across it, and Holi is played hardest in its Braj towns.'] },
    { code: 'MP', name: 'Madhya Pradesh', capital: 'Bhopal', capQ: true,
      clues: ['The Great Stupa at Sanchi, from Ashoka’s time, stands here.',
              'Tigers pad through the Kanha and Bandhavgarh forests in this state.'] },
    { code: 'OR', name: 'Odisha', capital: 'Bhubaneswar', capQ: true,
      clues: ['The Sun Temple at Konark is carved as a giant chariot with stone wheels here.',
              'Pattachitra painters work on cloth scrolls in this state, near the temple town of Puri.'] },
    { code: 'SK', name: 'Sikkim', capital: 'Gangtok', capQ: true,
      clues: ['Kanchenjunga, the highest mountain in India, rises in this little state.',
              'Every farm here grows food organically — the first state in India to do it.'] },
    { code: 'GA', name: 'Goa', capital: 'Panaji', capQ: true,
      clues: ['It is the smallest state in India, with beaches and old Portuguese churches.',
              'Christmas here means star lanterns over the doorways and trays of kuswar sweets.'] },
    { code: 'BR', name: 'Bihar', capital: 'Patna', capQ: true,
      clues: ['The Buddha woke up under a tree at Bodh Gaya in this state.',
              'Nalanda, one of the oldest universities in the world, taught here.'] },
    { code: 'ML', name: 'Meghalaya', capital: 'Shillong', capQ: true,
      clues: ['Villagers here grow bridges out of living rubber-tree roots.',
              'Mawsynram and Cherrapunji here are among the rainiest places on Earth.'] }
  ];

  /* Boundaries that are legally regulated in India and contested elsewhere are
     never a game token — see the map rule in CLAUDE.md. Kept out of the pool. */
  var GEO_SKIP = { JK: 1, LA: 1 };

  function leaksName(text, name) {
    var words = String(name).split(/[^A-Za-z]+/), i;
    for (i = 0; i < words.length; i++) {
      if (words[i].length < 4) continue;
      if (new RegExp('\\b' + words[i] + '\\b', 'i').test(String(text))) return true;
    }
    return false;
  }

  /* The app's own geography table (window.IND_GEO.states, keyed by the state
     codes in map-data.js) is the source of truth when it is loaded; the built-in
     list above is the standalone fallback, and lends its second clue where the
     codes match so the teach panel never repeats the question. */
  function stateData() {
    var geo = W.IND_GEO && W.IND_GEO.states;
    if (geo) {
      var extra = {}, claimed = {}, list = [], i, code, g;
      for (i = 0; i < STATES.length; i++) extra[STATES[i].code] = STATES[i];
      for (code in geo) {
        if (!geo.hasOwnProperty(code)) continue;
        g = geo[code];
        if (!g || !g.name || !g.capital || !g.fact) continue;
        if (g.type && g.type !== 'state') continue;   /* "which state" must mean a state */
        if (g.pending || GEO_SKIP[code]) continue;
        var clues = extra[code] ? extra[code].clues.slice() : [];
        if (!leaksName(g.fact, g.name)) clues.push(g.fact);
        if (!clues.length) continue;
        claimed[g.capital] = (claimed[g.capital] || 0) + 1;
        list.push({ code: code, name: g.name, capital: g.capital, capQ: true, clues: clues });
      }
      /* a capital two states share (Chandigarh) can never be a fair question */
      for (i = 0; i < list.length; i++) if (claimed[list[i].capital] > 1) list[i].capQ = false;
      if (list.length >= 8) return list;
    }
    return STATES;
  }

  function miniMap(code) {
    var M = W.IND_MAP;
    if (!M || !M.paths || !code || !M.paths[code]) return '';
    return '<svg class="mela-mini" viewBox="' + esc(M.viewBox || '0 0 1000 1100') + '" role="img" aria-label="Where it is on the map of India">' +
      (M.outline ? '<path class="land" d="' + M.outline + '"/>' : '') +
      '<path class="hit" d="' + M.paths[code] + '"/></svg>';
  }

  /* The map still under the mist — no state picked out, so nothing leaks. */
  function blankMap() {
    var M = W.IND_MAP;
    if (!M || !M.outline) return motifHTML('lotus');
    return '<svg class="mela-mini" viewBox="' + esc(M.viewBox || '0 0 1000 1100') + '" aria-hidden="true">' +
      '<path class="land" d="' + M.outline + '"/></svg>';
  }

  /* The state's OWN shape, cropped to its bounding box — the silhouette is
     the clue, and a silhouette leaks no name. (The whole-India blank map
     told a child nothing; the founder called it out.) */
  function stateShape(code) {
    var M = W.IND_MAP;
    var b = M && M.bbox && M.bbox[code];
    if (!b || !M.paths || !M.paths[code]) return blankMap();
    var pad = Math.max(b[2], b[3]) * 0.09;
    return '<svg class="mela-mini shape" viewBox="' + (b[0] - pad).toFixed(1) + ' ' + (b[1] - pad).toFixed(1) +
      ' ' + (b[2] + pad * 2).toFixed(1) + ' ' + (b[3] + pad * 2).toFixed(1) +
      '" role="img" aria-label="The shape of a state, for you to name">' +
      '<path class="hit" d="' + M.paths[code] + '"/></svg>';
  }

  /* what each level means here (docs/32): how many stops, and how many are capitals */
  var SH_LEVELS = ['four stops, mostly capitals', 'six stops, capitals and clues', 'six stops, mostly clues',
                   'eight stops, clues', 'ten stops, clues from every state'];
  var SH_COUNT = [4, 6, 6, 8, 10], SH_CAP = [0.8, 0.5, 0.3, 0.15, 0.1];

  function statehunt(host, opts, done) {
    opts = opts || {};
    var level = quizLevel(opts), only = scopeSet(opts);
    var pool = stateData();
    if (only) { var sp = pool.filter(function (x) { return only.indexOf(x.code) >= 0 || only.indexOf(x.name) >= 0; }); if (sp.length) pool = sp; }
    var COUNT = Math.min(SH_COUNT[level - 1], pool.length);
    var wantKind = opts.scope && opts.scope.mode;

    function build() {
      var picks = pickN(pool, COUNT), rounds = [], i;
      var all = stateData();
      for (i = 0; i < picks.length; i++) {
        var s = picks[i];
        var kind = wantKind === 'capital' && s.capQ ? 'capital' : wantKind === 'clue' ? 'clue'
          : (s.capQ && Math.random() < SH_CAP[level - 1]) ? 'capital' : 'clue';
        var others = [], j;
        for (j = 0; j < all.length; j++) if (all[j].name !== s.name) others.push(all[j]);
        var distract = pickN(others, 3);
        var options = shuffle([s].concat(distract));
        var answer = 0, k;
        for (k = 0; k < options.length; k++) if (options[k].name === s.name) answer = k;
        var optList = [];
        for (k = 0; k < options.length; k++) optList.push({ t: options[k].name });

        /* one clue asks, a different clue teaches — never the same sentence twice */
        var ci = Math.floor(Math.random() * s.clues.length);
        var clue = s.clues[ci];
        var other = s.clues.length > 1 ? s.clues[(ci + 1) % s.clues.length] : clue;
        rounds.push({
          id: s.code, skill: 'statehunt.' + kind,
          teachText: s.name + ' — its capital is ' + s.capital + '. ' + (kind === 'capital' ? clue : other),
          artHTML: stateShape(s.code),
          kicker: 'Stop ' + (i + 1) + ' of ' + picks.length,
          question: kind === 'capital'
            ? 'Which state has its capital at ' + s.capital + '?'
            : 'Which state is this?',
          taleHTML: kind === 'capital' ? '' : '<p style="margin:0">' + esc(clue) + '</p>',
          options: optList,
          answer: answer,
          speakText: kind === 'capital' ? 'Which state has its capital at ' + s.capital + '?' : clue,
          teachHTML: '<b>' + esc(s.name) + '</b> — capital <b>' + esc(s.capital) + '</b>.<br>' +
                     esc(kind === 'capital' ? clue : other) +
                     miniMap(s.code)
        });
      }
      return rounds;
    }

    return quizGame(host, {
      title: 'State Hunt',
      kicker: 'Mela · a yatra across India',
      count: COUNT, level: level, answer: opts.answer,
      twoUp: true,
      hint: 'Tap a state — or use the arrow keys and Enter. Number keys 1–4 work too.',
      build: build
    }, done);
  }

  /* ==================================================================
     GAME 3 · FESTIVAL FRENZY
     Twelve festivals: Hindu, Buddhist, Jain, Sikh, Muslim, Christian and
     national. Presented from the inside, never ranked, never compared.
     "Ask your family" is the honest answer to most of them.
     ================================================================== */

  var FESTIVALS = [
    { id: 'diwali', name: 'Diwali',
      when: 'October or November', months: ['october', 'november'],
      where: 'In most of India, and wherever Indian families live', whereQ: false,
      why: 'Rows of little lamps call the light back on the darkest night', whyKey: 'light',
      teach: 'Many families in the north remember Rama coming home to Ayodhya; many light lamps for Lakshmi; Jain families remember Mahavira; Sikh families keep the same night as Bandi Chhor Divas. Ask your family which story yours tells.',
      motif: 'diya' },
    { id: 'holi', name: 'Holi',
      when: 'February or March', months: ['february', 'march'],
      where: 'Across the north — the Braj towns are famous for it', whereQ: false,
      why: 'Colour, water and sweets to welcome the spring', whyKey: 'spring',
      teach: 'The night before is Holika Dahan, a bonfire; the next morning is all colour, water balloons and gujiya. Playing gently, and only with people who want to play, is part of the fun.',
      motif: 'warli' },
    { id: 'pongal', name: 'Pongal',
      when: 'Mid-January', months: ['january'],
      where: 'Tamil Nadu', whereQ: true,
      why: 'A thank-you to the sun, the rain and the cattle for the harvest', whyKey: 'harvest',
      teach: 'It lasts four days. Rice and milk are boiled in a new pot until they spill over — the spilling is the lucky part — and everyone calls out “Pongalo Pongal!”',
      motif: '' },
    { id: 'onam', name: 'Onam',
      when: 'August or September', months: ['august', 'september'],
      where: 'Kerala', whereQ: true,
      why: 'The harvest, and a much-loved old king’s yearly visit home', whyKey: 'harvest',
      teach: 'Families lay pookalam carpets of flower petals at the door, race long snake boats, and share a sadya feast served on a banana leaf, welcoming King Mahabali back for the day.',
      motif: 'lotus' },
    { id: 'navratri', name: 'Navratri',
      when: 'September or October', months: ['september', 'october'],
      where: 'Gujarat dances garba for it; Bengal keeps the same days as Durga Puja', whereQ: false,
      why: 'Nine nights for the Goddess', whyKey: 'goddess',
      teach: 'Nine nights, nine forms of the Goddess. In Gujarat everyone dances garba and dandiya in circles; in Bengal the same days are Durga Puja, with enormous decorated pandals.',
      avatar: 'durga' },
    { id: 'baisakhi', name: 'Baisakhi (Vaisakhi)',
      when: '13 or 14 April', months: ['april'],
      where: 'Punjab', whereQ: true,
      why: 'The spring harvest — and for Sikhs, the founding of the Khalsa', whyKey: 'khalsa',
      teach: 'Farmers cut the rabi harvest and dance bhangra and gidda. For Sikhs it is also the day Guru Gobind Singh founded the Khalsa at Anandpur Sahib in 1699.',
      avatar: 'khanda' },
    { id: 'gurunanak', name: 'Guru Nanak Gurpurab',
      when: 'Usually November', months: ['november'],
      where: 'Punjab, and Sikh sangats everywhere', whereQ: false,
      why: 'The birthday of Guru Nanak, the first Sikh Guru', whyKey: 'birthday',
      teach: 'Gurdwaras hold an unbroken reading of the Guru Granth Sahib, a nagar kirtan walks singing through the streets, and langar — a free meal that anybody at all may eat — is served to everyone.',
      avatar: 'harmandir' },
    { id: 'buddha', name: 'Buddha Purnima',
      when: 'April or May, on the full moon', months: ['april', 'may'],
      where: 'Bodh Gaya, Sikkim, Ladakh and Buddhist communities everywhere', whereQ: false,
      why: 'The Buddha’s birth, his awakening and his passing — all on one full-moon day', whyKey: 'buddha',
      teach: 'Monasteries are washed and hung with flags, people bring flowers and lamps, and many families eat only vegetarian food and give to those who need it.',
      avatar: 'buddha' },
    { id: 'mahavir', name: 'Mahavir Jayanti',
      when: 'March or April', months: ['march', 'april'],
      where: 'Jain communities, especially in Gujarat, Rajasthan and Bihar', whereQ: false,
      why: 'The birth of Mahavira, who taught ahimsa — never harming any living thing', whyKey: 'ahimsa',
      teach: 'Jain families visit the temple, join a gentle procession and listen to Mahavira’s teaching. Many spend the day doing something kind for animals.',
      avatar: 'mahavira' },
    { id: 'eid', name: 'Eid al-Fitr',
      when: 'It moves every year — it follows the moon', months: [],
      where: 'All over India — Delhi, Hyderabad, Lucknow, Kerala and everywhere else', whereQ: false,
      why: 'The month of fasting in Ramadan is complete', whyKey: 'fast',
      teach: 'The date slides about eleven days earlier each year, because the Islamic calendar counts moons. Families pray in the morning, give to people in need, share sheer khurma, and children collect Eidi.',
      motif: '' },
    { id: 'christmas', name: 'Christmas in Goa',
      when: '25 December', months: ['december'],
      /* whereQ is deliberately off: the festival's own name says Goa, and
         Christmas is just as big in Kerala, Mumbai and the Northeast. */
      where: 'Goa above all — and Kerala, Mumbai and the Northeast keep it too', whereQ: false,
      why: 'The birth of Jesus', whyKey: 'birth',
      teach: 'Families go to midnight Mass, hang big paper star lanterns over the doorway, and bake a tray of kuswar sweets to carry round to the neighbours — whoever the neighbours are.',
      motif: '' },
    { id: 'republic', name: 'Republic Day',
      when: '26 January', months: ['january'],
      where: 'All over India; the big parade is in New Delhi', whereQ: false,
      why: 'The day India’s Constitution came into force', whyKey: 'constitution',
      teach: 'On 26 January 1950 the Constitution came into force and India became a republic. Schools raise the flag, and a parade of every state’s tableau rolls through New Delhi.',
      motif: 'peacock' }
  ];

  var FEST_PLACES = ['Tamil Nadu', 'Kerala', 'Punjab', 'Goa', 'Assam', 'Rajasthan', 'West Bengal', 'Sikkim'];

  function monthsClash(a, b) {
    for (var i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++) if (a[i] === b[j]) return true;
    return false;
  }

  var FE_LEVELS = ['six festivals: when they come', 'eight festivals: when, and why', 'eight festivals: when, why and where',
                   'ten festivals: when, why and where', 'all twelve festivals'];
  var FE_COUNT = [6, 8, 8, 10, 12];

  function festival(host, opts, done) {
    opts = opts || {};
    var level = quizLevel(opts), only = scopeSet(opts);
    var src = FESTIVALS;
    if (only) { var fp = FESTIVALS.filter(function (x) { return only.indexOf(x.id) >= 0; }); if (fp.length) src = fp; }
    var COUNT = Math.min(FE_COUNT[level - 1], src.length);
    var kinds = level === 1 ? ['when'] : level === 2 ? ['when', 'why'] : ['when', 'why', 'where'];
    if (opts.scope && /^(when|why|where)$/.test(opts.scope.mode || '')) kinds = [opts.scope.mode];

    function build() {
      var picks = pickN(src, COUNT), rounds = [], i, j;
      for (i = 0; i < picks.length; i++) {
        var f = picks[i];
        /* rotate the question kind so a run covers when / where / why */
        var kind = kinds[i % kinds.length];
        if (kind === 'where' && !f.whereQ) kind = kinds.length > 1 ? ((i % 2) ? 'when' : 'why') : 'when';

        var optList = [], answer = 0, q = '', speakText = '';

        if (kind === 'when') {
          var whens = [];
          for (j = 0; j < FESTIVALS.length; j++) {
            var g = FESTIVALS[j];
            if (g.id === f.id) continue;
            if (g.when === f.when) continue;
            if (monthsClash(g.months, f.months)) continue;
            whens.push(g.when);
          }
          var pickWhen = pickN(whens, 2);
          var allWhen = shuffle([f.when].concat(pickWhen));
          for (j = 0; j < allWhen.length; j++) {
            optList.push({ t: allWhen[j] });
            if (allWhen[j] === f.when) answer = j;
          }
          q = 'When do families celebrate ' + f.name + '?';
        } else if (kind === 'where') {
          var places = [];
          for (j = 0; j < FEST_PLACES.length; j++) if (FEST_PLACES[j] !== f.where) places.push(FEST_PLACES[j]);
          var allP = shuffle([f.where].concat(pickN(places, 3)));
          for (j = 0; j < allP.length; j++) {
            optList.push({ t: allP[j] });
            if (allP[j] === f.where) answer = j;
          }
          q = 'Which state keeps ' + f.name + ' as its own big festival?';
        } else {
          var whys = [];
          for (j = 0; j < FESTIVALS.length; j++) {
            if (FESTIVALS[j].id === f.id) continue;
            if (FESTIVALS[j].whyKey === f.whyKey) continue;
            whys.push(FESTIVALS[j].why);
          }
          var allW = shuffle([f.why].concat(pickN(whys, 2)));
          for (j = 0; j < allW.length; j++) {
            optList.push({ t: allW[j] });
            if (allW[j] === f.why) answer = j;
          }
          q = 'Why do people celebrate ' + f.name + '?';
        }
        speakText = q;

        /* Art only where it is genuinely apt. Eid, Christmas and Pongal get
           none rather than a borrowed symbol that means nothing. */
        var art = f.avatar ? avatarHTML(f.avatar, 88) : (f.motif ? motifHTML(f.motif) : '');
        rounds.push({
          id: f.id + '.' + kind, skill: 'festival.' + kind,
          teachText: f.name + ' · ' + f.when + '. ' + f.where + '. ' + f.teach,
          artHTML: art,
          kicker: 'Festival ' + (i + 1) + ' of ' + picks.length,
          question: q,
          taleHTML: '',
          options: optList,
          answer: answer,
          speakText: speakText,
          teachHTML: '<b>' + esc(f.name) + '</b> · ' + esc(f.when) + '<br>' +
                     esc(f.where) + '.<br>' + esc(f.teach)
        });
      }
      return rounds;
    }

    return quizGame(host, {
      title: 'Festival Frenzy',
      kicker: 'Mela · a year of festivals',
      count: COUNT, level: level, answer: opts.answer,
      twoUp: false,
      hint: 'Tap your answer — or use the arrow keys and Enter. Number keys work too.',
      build: build
    }, done);
  }

  /* ==================================================================
     GAME 4 · JATAKA JUMP
     Jataka tales are told in the Buddhist tradition as stories of the
     Buddha's earlier lives, usually as an animal. They are Katha — a
     story as it is told — and every one of them ends in a lesson.
     ================================================================== */

  var JATAKAS = [
    { id: 'monkey', avatar: 'pt_monkey', title: 'The Monkey and the Crocodile',
      tale: 'A monkey lived in a rose-apple tree by the river, and a crocodile who wanted his heart offered him a ride to the far bank. Halfway across the crocodile told him why. “Oh dear,” said the monkey, “I leave my heart hanging in the tree — take me back for it.” The crocodile swam back, and the monkey went up his tree and stayed there.',
      moral: 'A quick, calm head can get you out of trouble',
      others: ['Rivers are dangerous places for monkeys', 'Never make friends with anybody at all'] },
    { id: 'tortoise', avatar: 'pt_tortoise', title: 'The Talkative Tortoise',
      tale: 'Two geese carried their friend the tortoise to a new lake, holding a stick that he gripped in his mouth. “Keep it shut,” they warned him. But when children below shouted and pointed, the tortoise opened his mouth to answer back — and down he came.',
      moral: 'There are moments when the wise thing is to say nothing',
      others: ['Flying is not for tortoises', 'Geese make unreliable friends'] },
    { id: 'goose', avatar: 'pt_heron', title: 'The Golden Goose',
      tale: 'A goose with golden feathers visited a poor family and left one shining feather each time, and slowly they had enough. Then the mother thought: why wait? She caught the goose and pulled out every feather at once. Every plucked feather turned plain white, and the goose flew away for good.',
      moral: 'Grabbing everything at once can lose you what you were given',
      others: ['Birds should be kept indoors', 'Gold is the most useful thing in the world'] },
    { id: 'deer', avatar: 'pt_deer', title: 'The Banyan Deer',
      tale: 'A king hunted in a park full of deer, and each day one deer’s turn came. When the lot fell to a mother doe, the golden deer-king walked out and laid his own head down in her place. The king, astonished, put down his bow and made the whole park safe for every animal in it.',
      moral: 'A real leader takes the hardest part first',
      others: ['Kings always get their way in the end', 'It is safer to live far from people'] },
    { id: 'quails', avatar: 'pt_crow', title: 'The Quarrelling Quails',
      tale: 'A hunter kept catching quails in his net, until the quails learned to push upward all together and carry the net into a thorn bush. It worked every time — until the day they began to argue about who was pushing hardest, and stood there arguing while the hunter walked up.',
      moral: 'Together you are strong; quarrelling undoes it',
      others: ['Nets are impossible to escape', 'The loudest bird is usually right'] },
    { id: 'crane', avatar: 'pt_heron', title: 'The Crane and the Crab',
      tale: 'A crane told the fish of a drying pond that he knew a deep cool lake, and carried them off one by one — though none of them ever arrived. Then the crab asked for a lift, and held tight round the crane’s neck all the way, so the crane had no choice but to set him down safely in the water.',
      moral: 'A trick that hurts others comes back round to you',
      others: ['Crabs are stronger than birds', 'Ponds should never be allowed to dry up'] },
    { id: 'rabbit', avatar: 'pt_rabbit', title: 'The Rabbit Who Heard a Thud',
      tale: 'A rabbit dozing under a palm tree heard a heavy THUD and shouted that the earth was breaking up. Deer, boar and buffalo all ran with him, until the lion stopped the stampede and asked to be shown the exact spot. It was a ripe fruit, fallen in the grass.',
      moral: 'Check a scary story before you pass it on',
      others: ['Lions are the fastest runners in the forest', 'Never sleep under a palm tree'] },
    { id: 'donkey', avatar: 'pt_lion', title: 'The Donkey in the Lion Skin',
      tale: 'A trader threw a lion skin over his donkey and let him eat in other people’s barley fields, and the farmers ran away every time. It went beautifully — right up until the donkey, feeling pleased with himself, opened his mouth and brayed.',
      moral: 'A costume can hide you, but your own voice tells the truth',
      others: ['Lions are afraid of farmers', 'Barley is the best food for a donkey'] }
  ];

  var JA_LEVELS = ['three tales', 'four tales', 'six tales', 'seven tales', 'all eight tales'];
  var JA_COUNT = [3, 4, 6, 7, 8];

  function jataka(host, opts, done) {
    opts = opts || {};
    var level = quizLevel(opts), only = scopeSet(opts);
    var src = JATAKAS;
    if (only) { var jp = JATAKAS.filter(function (x) { return only.indexOf(x.id) >= 0; }); if (jp.length) src = jp; }
    var COUNT = Math.min(JA_COUNT[level - 1], src.length);

    function build() {
      var picks = pickN(src, COUNT), rounds = [], i, j;
      for (i = 0; i < picks.length; i++) {
        var f = picks[i];
        var choices = shuffle([f.moral].concat(f.others));
        var answer = 0;
        var optList = [];
        for (j = 0; j < choices.length; j++) {
          optList.push({ t: choices[j] });
          if (choices[j] === f.moral) answer = j;
        }
        rounds.push({
          id: f.id, skill: 'jataka.moral',
          teachText: f.title + ': ' + f.moral + '. Jataka tales are told in the Buddhist tradition as stories of the Buddha’s earlier lives.',
          artHTML: avatarHTML(f.avatar, 92),
          kicker: 'Tale ' + (i + 1) + ' of ' + picks.length + ' · ' + f.title,
          question: 'What is this story telling us?',
          taleHTML: '<p style="margin:0">' + esc(f.tale) + '</p>',
          options: optList,
          answer: answer,
          speakText: f.title + '. ' + f.tale,
          teachHTML: '<b>' + esc(f.title) + '</b><br>' + esc(f.moral) + '.<br>' +
                     'Jataka tales are told in the Buddhist tradition as stories of the Buddha’s earlier lives, ' +
                     'usually as an animal — which is why the animals in them are the ones doing the thinking.'
        });
      }
      return rounds;
    }

    return quizGame(host, {
      title: 'Jataka Jump',
      kicker: 'Mela · hear the tale, find the lesson',
      count: COUNT, level: level, answer: opts.answer,
      twoUp: false,
      hint: 'Read it, or have it read to you. Then tap a lesson — arrow keys and Enter work too.',
      build: build
    }, done);
  }

  /* ==================================================================
     REGISTRY
     ================================================================== */

  W.IND_GAMES = [
    { id: 'rangoli', name: 'Rangoli Rush', sub: 'remember the threshold', icon: 'star', minutes: 4, tag: 'Art',
      teaches: true,
      levels: RG_BANDS,
      blurb: 'A hundred thresholds. The chalk pattern shows, the dust blows away — lay it back, every chalk in its place. Every fourth level is a tradition, credited by region: kolam, muggu, alpana, mandana, rangoli. The ladder remembers your place.',
      engine: rangoli },
    { id: 'statehunt', name: 'State Hunt', sub: 'which state is it?', icon: 'map', minutes: 4,
      blurb: 'A capital, a fort, a rhino, a mountain. Which state is it? Stops on a yatra across India.',
      teaches: true, levels: SH_LEVELS,
      engine: statehunt },
    /* ON the Mela shelf AND on the festival pages (FIX-INDIA §1: it was missing from the
       Play grid, reachable only from Utsav) */
    { id: 'festival', name: 'Festival Frenzy', sub: 'a year of festivals', icon: 'lamp', minutes: 4,
      blurb: 'Twelve festivals, one year. Match each one to its month, its home state and the reason people keep it.',
      teaches: true, levels: FE_LEVELS,
      engine: festival },
    { id: 'jataka', name: 'Jataka Jump', sub: 'hear the tale, find the lesson', icon: 'book', minutes: 3,
      blurb: 'Very short animal fables from the Jataka tales. Hear the story, then find the lesson hiding in it.',
      teaches: true, levels: JA_LEVELS,
      engine: jataka }
  ];

  /* Small convenience seam for the shell — never required by the contract. */
  W.IND_MELA = {
    list: W.IND_GAMES,
    get: function (id) {
      for (var i = 0; i < W.IND_GAMES.length; i++) if (W.IND_GAMES[i].id === id) return W.IND_GAMES[i];
      return null;
    },
    play: function (id, host, opts, done) {
      var g = W.IND_MELA.get(id);
      if (!g || !host) return null;
      return g.engine(host, opts || {}, done || function () {});
    },
    injectCSS: injectCSS
  };

  injectCSS();

  /* EACH GAME'S TWO LINES for the host's frame — how to play it, and what it practises — for the
     games that predate a registration's own `how` / `practised` (docs/32). The host's frameOf() reads
     them on a game's page and on Play; build-feed reads them for a game's card (tools/lib/corpus.js). */
  W.IND_GAME_FRAME = {
    rangoli:      ['Watch the pattern, then draw it back in colour before it blows away.',
                   'Pattern memory and symmetry — remember half, complete the whole.'],
    statehunt:    ['Read the clue — a capital, a fort, an animal, a mountain — and pick the state it points to.',
                   'Where India’s states are, and what each is known for.'],
    festival:     ['Match each festival to its month, its home state and the reason people keep it.',
                   'Twelve festivals: when they fall, where, and why.'],
    jataka:       ['Hear the fable, then pick the lesson hiding in it.',
                   'Finding the lesson inside a Jataka tale.'],
    saapsidi:     ['Roll, count your squares, and climb the ladders to 100.',
                   'Counting on a hundred-square board. Played for fun, so it pays no coins.'],
    ludo:         ['Roll, choose a token, and bring all four home before Gattu — or play Saap-Sidi inside it.',
                   'Counting moves and choosing which token to move. Played for fun.'],
    kancha:       ['Slide to aim, pull back, and flick — whatever leaves the ring is yours.',
                   'Aim and judging distance. A street game, played for fun.'],
    pallanguzhi:  ['Pick one of your pits; its shells are sown one by one around the board.',
                   'Counting ahead — which pit will end where you want it to.'],
    gutte:        ['Toss the mother stone, snatch the stones the rung asks for, and catch her.',
                   'Timing and counting. A courtyard game, played for fun.'],
    carrom:       ['Aim the striker, choose the strength, and pocket your pieces.',
                   'Angles and aim. Played for fun.'],
    gyanpati:     ['Fifteen questions, easy to hard. Pick an answer and lock it in.',
                   'What you know about India — and the ones you met for the first time today.'],
    triviamaster: ['Ten questions from the topics you switch on.',
                   'Quick recall across maps, history, festivals, food and the epics.'],
    shabd:        ['Hear or read the word, then pick what it means.',
                   'Words in your family’s language, and what they mean.'],
    sabhyata:     ['Build, grow and learn — each era asks for one thing.',
                   'How India’s first cities grew, era by era.'],
    /* the cards coming in, one in for one out (games spec §3.1) — each engine may say it better
       with its own `how` / `practised` */
    naksha:       ['Read what to find, then tap it on the map of India.',
                   'Where India’s states, capitals and rivers are — on the map itself.'],
    panchang:     ['Turn the year and set each festival in its month.',
                   'When festivals fall, and how one season has many names.'],
    kaalnadi:     ['Set history in order along the River of Time — tap or drag a card onto its stretch of river; on a keyboard, arrows and Enter.',
                   'Chronology and evidence — what came first, and how we know.'],
    akshar:       ['Hear a letter, put its vowel sign on, build a word — tap or drag the tiles; on a keyboard, number keys and Enter.',
                   'Reading your family’s script — letters, vowel signs, words and joined letters.'],
    katha:        ['Put a tale back in order, say what happens next, and find its lesson — tap two panels to swap; on a keyboard, Space, arrows and Enter.',
                   'Reading a story closely — order, prediction, who said it, and the lesson.'],
    saga:         ['Follow Gattu and Mithu; each chapter is played as one of the games.',
                   'Bringing back what the mist made a village forget, skill by skill.']
  };

  /* THE NOTE ON A GAME THE OWNER OPENED BEFORE REVIEW (9 Oct 2026; docs/32): the host's game page
     shows it under the how-to. It lives here, in the games group, so the first screen never carries it. */
  W.IND_GAME_UNCHECKED = function (g, esc) {
    return '<p class="gf-unchecked" role="note"><b>Not yet checked by its reviewer.</b> Everything in this game comes from the ' +
      'app\u2019s own sourced pages, and nothing is written from memory \u2014 but ' + esc(g.open.who || 'the person who checks what this app tells children') +
      ' has not checked it yet. The family who made this app opened it anyway. Ask a grown-up if anything seems wrong.</p>';
  };
})();
