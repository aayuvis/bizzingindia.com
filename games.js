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
    '.mela-stage:before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent3),var(--accent2));opacity:.5}',
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
    '.mela-grid{display:grid;grid-template-columns:repeat(var(--n,4),1fr);gap:8px}',
    '.mela-dot{position:relative;aspect-ratio:1/1;min-width:34px;padding:0;cursor:pointer;border-radius:50%;',
    'background:var(--surface);border:1px solid var(--line);transition:transform .12s ease,background .12s ease,border-color .12s ease}',
    '.mela-dot:hover:not(:disabled){border-color:var(--accent);transform:scale(1.06)}',
    '.mela-dot:focus-visible{outline:3px solid var(--accent2);outline-offset:3px}',
    '.mela-dot:disabled{cursor:default}',
    '.mela-dot .pip{position:absolute;inset:16%;border-radius:50%;background:transparent;transition:background .12s ease}',
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
    '.mela-bindi .face{position:absolute;inset:0;display:grid;place-items:center;font-size:34px;color:var(--c,#c33);opacity:0}',
    '.mela-bindi .back{position:absolute;inset:0;display:grid;place-items:center;font-size:24px;color:var(--muted);background:var(--card2,var(--ground))}',
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
    '.mela-bowl i{position:absolute;inset:0;border-radius:0 0 40px 40px;background:var(--c);opacity:.9;',
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
     ================================================================== */

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

  /* quizGame(host, spec, done)
     spec = {
       title, kicker, count,
       build()      -> [round]  (fresh each play)
       round = { artHTML, kicker, question, taleHTML, options:[{t,s}], answer:int,
                 teachHTML, speakText }
       hint         -> string shown under the options
     } */
  function quizGame(host, spec, done) {
    var sc = scope();
    var ref = shell(host, spec.title, spec.kicker, spec.count);
    var rounds = spec.build();
    var idx = 0, firstTry = 0, score = 0, kauris = 0, finished = false, plays = 1;
    var current = null, tried = false;

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

    function choose(btn) {
      if (!btn || btn.disabled || !current) return;
      var i = parseInt(btn.getAttribute('data-i'), 10);
      if (i === current.answer) {
        var els = optionEls();
        for (var k = 0; k < els.length; k++) { els[k].disabled = true; if (k !== i) els[k].classList.add('is-off'); }
        btn.classList.add('is-right');
        btn.classList.remove('is-off');
        if (!tried) { firstTry++; score += 100; kauris += 2; }
        else { score += 45; kauris += 1; }
        ref.say(one(CHEERS), 'good');
        reveal();
      } else {
        tried = true;
        btn.disabled = true;
        btn.classList.add('is-off');
        ref.say(one(NUDGES), 'warm');
        sc.later(function () { moveFocus(1); }, 40);
      }
    }

    function reveal() {
      var box = ref.stage.querySelector('.mela-teachbox');
      if (!box) return;
      var last = idx >= rounds.length - 1;
      box.innerHTML =
        '<div class="mela-teach">' + current.teachHTML + '</div>' +
        '<div class="mela-row"><button type="button" class="mela-btn" data-go="next">' +
          (last ? 'See how I did' : 'Next') + '</button></div>';
      var b = box.querySelector('[data-go="next"]');
      sc.later(function () { focusSoft(b); }, 60);
    }

    function render() {
      if (sc.dead) return;
      current = rounds[idx];
      tried = false;
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
        '<p class="mela-hint">' + esc(spec.hint || 'Tap an answer — or use the arrow keys and press Enter. Number keys work too.') + '</p>' +
        '<div class="mela-teachbox"></div>';
      sc.later(function () {
        var first = ref.stage.querySelector('.mela-opt');
        if (first) focusSoft(first);
      }, 60);
    }

    function finish() {
      if (finished) return;
      var perfectish = firstTry;
      ref.mark(rounds.length, 'end');
      ref.say('');
      ref.stage.innerHTML =
        '<div class="mela-done">' +
          '<div class="mela-art">' + mascotHTML(firstTry >= Math.ceil(rounds.length / 2) ? 'wow' : 'happy', 104) + '</div>' +
          '<h3>' + esc(one(CHEERS)) + '</h3>' +
          '<p>You got <b>' + perfectish + ' of ' + rounds.length + '</b> right on the very first try — and you finished every single one.</p>' +
          '<div class="mela-tally">' +
            '<span class="mela-chip"><b>' + score + '</b> points</span>' +
            '<span class="mela-chip"><b>' + kauris + '</b> kauris</span>' +
          '</div>' +
          '<div class="mela-row">' +
            '<button type="button" class="mela-btn" data-go="out">Back to the Mela</button>' +
            '<button type="button" class="mela-btn ghost" data-go="again">Play again</button>' +
          '</div>' +
        '</div>';
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="out"]')); }, 60);
    }

    function replay() {
      rounds = spec.build();
      idx = 0; current = null; plays++;
      var pipHTML = '';
      for (var i = 0; i < rounds.length; i++) pipHTML += '<span class="mela-pip"></span>';
      if (ref.pips) ref.pips.innerHTML = pipHTML;
      render();
    }

    function bail(win) {
      if (finished) return;
      finished = true;
      sc.kill();
      if (typeof done === 'function') done({ win: !!win, score: score, kauris: kauris });
    }

    sc.on(ref.stage, 'click', function (e) {
      var t = e.target;
      var opt = t.closest ? t.closest('.mela-opt') : null;
      if (opt) { choose(opt); return; }
      var go = t.closest ? t.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'next') { idx++; render(); }
      else if (what === 'say') { if (current) speak(current.speakText); }
      else if (what === 'again') { replay(); }
      else if (what === 'out') { bail(true); }
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead || !ref.stage) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); moveFocus(1); return; }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); moveFocus(-1); return; }
      if (/^[1-9]$/.test(e.key)) {
        var els = optionEls(), n = parseInt(e.key, 10) - 1;
        if (els[n] && !els[n].disabled) { e.preventDefault(); choose(els[n]); }
      }
    });

    render();
    return teardownOf(sc, function () { finished = true; });
  }

  /* ==================================================================
     GAME 1 · RANGOLI RUSH
     A rangoli is drawn on a dot grid, then the chalk dust blows away and
     the child draws it back. Every pattern is built by mirroring, so the
     real lesson is: remember half (or a quarter) and reflect the rest.
     ================================================================== */

  var RG_COLOURS = ['var(--accent2)', 'var(--accent3)', 'var(--good)', 'var(--accent)'];

  /* ============== RANGOLI RUSH: THE HUNDRED THRESHOLDS ==============
     A hundred levels, remembered between sittings, three a sitting.
     Most levels are the memory rangoli — in COLOUR (the palette under
     the grid chooses what your finger lays down), growing from a 4x4
     mirror to a 9x9 four-fold festival threshold. And EVERY FOURTH
     level is a twist from a pool of ten little games, each with its own
     Indian heart:

       kolam   · Kolam Loop      — one unbroken line through numbered dots
       rain    · Phoolon ki Baarish — catch petals in their own colour's bowl
       diya    · Diya Raat       — diyas flicker in an order; light them back
       mehndi  · Mehndi Mirror   — half the hand is drawn; finish the other
       toran   · Toran Thread    — what hangs next on the doorway string?
       chakra  · Chakra Wheel    — the wheel turns in a pattern; fill the gap
       genda   · Genda Ginti     — marigolds scatter for a blink; how many?
       bindi   · Bindi Milan     — turn the bindi cards, find the pairs
       taal    · Tabla Taal      — dha dhin ta tin: repeat the bols in order
       repair  · Rangoli Repair  — three dots broke the symmetry; find them

     The twists repeat deeper with the ladder — the same game at level 84
     is not the game it was at level 4. */
  var RG_LKEY = 'india.rangoli.lvl';
  var RG_TWISTS = ['kolam', 'rain', 'diya', 'mehndi', 'toran', 'chakra', 'genda', 'bindi', 'taal', 'repair'];
  var RG_TW_NAME = { kolam: 'Kolam Loop', rain: 'Phoolon ki Baarish', diya: 'Diya Raat',
    mehndi: 'Mehndi Mirror', toran: 'Toran Thread', chakra: 'Chakra Wheel', genda: 'Genda Ginti',
    bindi: 'Bindi Milan', taal: 'Tabla Taal', repair: 'Rangoli Repair' };
  var RG_MEM_TAG = ['A mirror rangoli', 'Chalk and colour', 'The courtyard grid', 'A four-fold rangoli',
    'The festival threshold', 'Grandmother’s pattern', 'The dawn rangoli'];

  function rgIsTwist(i) { return (i + 1) % 4 === 0; }
  function rgLevel(i) {
    if (rgIsTwist(i)) {
      var slot = Math.floor((i + 1) / 4) - 1;              /* 0..24 across 100 */
      var kind = RG_TWISTS[slot % RG_TWISTS.length];
      return { kind: kind, d: 1 + Math.floor(slot / RG_TWISTS.length),
               label: 'Twist — ' + RG_TW_NAME[kind] };
    }
    var m = i - Math.floor(i / 4);                          /* 0..74 memory steps */
    var n = Math.min(9, 4 + Math.floor(m / 9));
    return {
      kind: 'mem', n: n,
      mode: m < 6 ? 'v' : 'vh',
      colors: Math.min(4, 2 + Math.floor(m / 10)),
      seeds: Math.max(3, Math.min(Math.floor(n * n / 6), 3 + Math.floor(m / 4))),
      label: RG_MEM_TAG[Math.floor(m / 11) % RG_MEM_TAG.length],
      note: m < 6 ? 'Left and right match — remember one half, and the COLOURS matter: pick below, then dot.'
                  : 'Folded twice: left-right AND top-bottom. One quarter remembered is the whole rangoli.'
    };
  }
  function rgLoad() {
    try { return Math.max(0, parseInt(W.localStorage.getItem(RG_LKEY) || '0', 10) || 0); }
    catch (e) { return 0; }
  }
  function rgSave(v) { try { W.localStorage.setItem(RG_LKEY, String(v)); } catch (e) {} }

  function rangoliPattern(cfg) {
    var n = cfg.n, half = Math.ceil(n / 2), map = {}, tries = 0, ci = 0;
    var nc = Math.min(cfg.colors || 2, RG_COLOURS.length);
    function put(r, c, colour) {
      if (r < 0 || c < 0 || r >= n || c >= n) return;
      map[r + ',' + c] = colour;
    }
    var seeds = 0;
    while (seeds < cfg.seeds && tries < 400) {
      tries++;
      var r = Math.floor(Math.random() * (cfg.mode === 'vh' ? half : n));
      var c = Math.floor(Math.random() * half);
      if (map[r + ',' + c]) continue;
      var colour = RG_COLOURS[ci % nc]; ci++;
      put(r, c, colour);
      put(r, n - 1 - c, colour);
      if (cfg.mode === 'vh') { put(n - 1 - r, c, colour); put(n - 1 - r, n - 1 - c, colour); }
      seeds++;
    }
    return map;
  }

  function rangoli(host, opts, done) {
    var sc = scope();
    var ref = shell(host, 'Rangoli Rush', 'Mela · a hundred thresholds', 3);
    var slow = reducedMotion();
    var SLOTS = 3;
    var slot = 0, lvl = rgLoad(), score = 0, kauris = 0, passedN = 0, finished = false;
    var cfg = null, pattern = null, mine = null, phase = 'show', attempt = 1, peeks = 0, resume = null;
    var palIdx = 0, tw = null, lvlResult = null;

    function keys(map) { var k = [], q; for (q in map) if (map.hasOwnProperty(q)) k.push(q); return k; }
    function nColors() { return Math.min(cfg.colors || 2, RG_COLOURS.length); }

    /* ---- the ladder header: level count, progress bar, this decade ---- */
    function ladderHTML(cur) {
      var pct = Math.min(100, cur);
      var d0 = Math.floor(cur / 10) * 10;
      var h = '<div class="mela-ladder" aria-label="Level ' + (cur + 1) + ' of 100">' +
        '<b class="mela-lvln">Level ' + (cur + 1) + '<i> of 100</i></b>' +
        '<span class="mela-lbar"><i style="width:' + pct + '%"></i></span>' +
        '<span class="mela-decade">';
      for (var i = d0; i < d0 + 10; i++) {
        h += '<span class="mela-diya' + (i < cur ? ' lit' : i === cur ? ' now' : '') +
          (rgIsTwist(i) ? ' twist' : '') + '">' + (rgIsTwist(i) ? '✦' : '') + '</span>';
      }
      return h + '</span></div>';
    }
    function head(question, extraKicker) {
      return ladderHTML(lvl) +
        '<p class="mela-kicker" style="text-align:center">' + esc(cfg.label) + (extraKicker || '') + '</p>' +
        '<h3 class="mela-q">' + esc(question) + '</h3>';
    }
    function rowNext(pass) {
      return '<button type="button" class="mela-btn" data-go="lvlnext">' + (pass ? 'Level cleared →' : 'On we go') + '</button>';
    }
    function starLine(stars) { return stars ? Array(stars + 1).join('⭐') : 'no star yet'; }
    /* every twist ends through this one door */
    function twistDone(pass, stars, pts, msg) {
      lvlResult = { pass: pass, stars: stars };
      score += pts; kauris += stars;
      var rowEl = ref.stage.querySelector('.mela-row');
      if (rowEl) rowEl.innerHTML = rowNext(pass);
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (cEl) cEl.textContent = '+' + pts + ' points · ' + starLine(stars);
      ref.say(msg, pass ? 'good' : 'warm');
      phase = 'twdone';
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="lvlnext"]')); }, 60);
    }

    function paletteHTML() {
      var h = '<div class="mela-pal" role="radiogroup" aria-label="Pick a colour">';
      for (var i = 0; i < nColors(); i++) {
        h += '<button type="button" class="mela-sw' + (i === palIdx ? ' on' : '') + '" data-sw="' + i +
          '" style="--c:' + RG_COLOURS[i] + '" role="radio" aria-checked="' + (i === palIdx) +
          '" aria-label="Colour ' + (i + 1) + '"></button>';
      }
      return h + '<span class="tiny muted">pick, then dot · keys 1–' + nColors() + '</span></div>';
    }
    function boardHTML(n, mode, tag) {
      var h = '<div class="mela-boardwrap"><div class="mela-grid" role="group" aria-label="Rangoli dot grid" style="--n:' + n + '">';
      for (var r = 0; r < n; r++) {
        for (var c = 0; c < n; c++) {
          h += '<button type="button" class="mela-dot" data-k="' + r + ',' + c + '" tabindex="' +
               (r === 0 && c === 0 ? '0' : '-1') + '" aria-pressed="false" aria-label="Row ' + (r + 1) + ', dot ' + (c + 1) + '">' +
               '<span class="pip"></span></button>';
        }
      }
      h += '</div><div class="mela-axis v"></div>' + (mode === 'vh' ? '<div class="mela-axis h"></div>' : '') + '</div>';
      return h;
    }
    function dot(k) { return ref.stage.querySelector('.mela-dot[data-k="' + k + '"]'); }
    function allDots() { return ref.stage.querySelectorAll('.mela-dot'); }
    function setAxis(on) {
      var ax = ref.stage.querySelectorAll('.mela-axis');
      for (var i = 0; i < ax.length; i++) ax[i].className = 'mela-axis ' + (ax[i].classList.contains('h') ? 'h' : 'v') + (on ? ' on' : '');
    }
    function paintShow() {
      var ds = allDots(), i;
      for (i = 0; i < ds.length; i++) {
        var d = ds[i], k = d.getAttribute('data-k');
        d.className = 'mela-dot' + (pattern[k] ? ' lit' : '');
        d.style.setProperty('--c', pattern[k] || 'transparent');
        d.disabled = true;
        d.setAttribute('aria-pressed', pattern[k] ? 'true' : 'false');
      }
      setAxis(true);
    }
    function paintMine() {
      var ds = allDots(), i;
      for (i = 0; i < ds.length; i++) {
        var d = ds[i], k = d.getAttribute('data-k');
        d.className = 'mela-dot' + (mine[k] ? ' mine' : '');
        d.style.setProperty('--c', mine[k] || 'var(--accent2)');
        d.disabled = false;
        d.setAttribute('aria-pressed', mine[k] ? 'true' : 'false');
      }
      setAxis(false);
    }
    function frame(question, mainLabel, mainGo, ghostLabel, ghostGo, hint, extra) {
      ref.stage.innerHTML =
        head(question) +
        boardHTML(cfg.n, cfg.mode) +
        (extra || '') +
        '<p class="mela-count" data-role="count"></p>' +
        '<div class="mela-row">' +
          '<button type="button" class="mela-btn" data-go="' + mainGo + '">' + esc(mainLabel) + '</button>' +
          (ghostLabel ? '<button type="button" class="mela-btn ghost" data-go="' + ghostGo + '">' + esc(ghostLabel) + '</button>' : '') +
        '</div>' +
        '<p class="mela-hint">' + esc(hint) + '</p>';
    }
    function countLine() {
      var el = ref.stage.querySelector('[data-role="count"]');
      if (!el) return;
      var need = keys(pattern).length, got = keys(mine).length;
      el.textContent = phase === 'draw' ? (got + ' of ' + need + ' dots placed') : '';
    }

    /* ------------------------------------------- the memory levels ---- */
    function showPhase() {
      phase = 'show';
      var need = keys(pattern).length;
      frame('Look carefully…', 'I have got it', 'ready', '', '', cfg.note);
      paintShow();
      ref.say('Chalk dust — ' + need + ' dots in ' + nColors() + ' colours. It blows away in a moment.', 'warm');
      var left = Math.max(3, Math.round(need * 0.6) + 2);
      var el = ref.stage.querySelector('[data-role="count"]');
      if (el) el.textContent = 'Blows away in ' + left + '…';
      var tick = sc.every(function () {
        if (detached(host)) { sc.kill(); return; }
        left--;
        var e2 = ref.stage.querySelector('[data-role="count"]');
        if (e2) e2.textContent = left > 0 ? 'Blows away in ' + left + '…' : '';
        if (left <= 0) { W.clearInterval(tick); drawPhase(); }
      }, slow ? 1400 : 1000);
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="ready"]')); }, 60);
    }
    function peekPhase() {
      phase = 'show';
      resume = mine;
      frame('Here it is again…', 'Got it', 'ready', '', '', cfg.note);
      paintShow();
      ref.say('Take your time.', 'warm');
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="ready"]')); }, 60);
      sc.later(function () { if (phase === 'show') drawPhase(); }, slow ? 4200 : 3200);
    }
    function drawPhase() {
      phase = 'draw';
      if (resume) { mine = resume; resume = null; }
      var need = keys(pattern).length;
      frame('Now draw it back — in colour', 'Check my rangoli', 'check', 'Show me again', 'peek',
            'Pick a colour below, then tap the dots. Same colour again lifts a dot. ' + need + ' dots to lay.',
            paletteHTML());
      paintMine();
      countLine();
      ref.say('');
      sc.later(function () {
        var first = ref.stage.querySelector('.mela-dot');
        if (first) { first.setAttribute('tabindex', '0'); focusSoft(first); }
      }, 60);
    }
    function checkPhase() {
      phase = 'checked';
      var need = keys(pattern), got = keys(mine), i, hit = 0, wrongC = 0, extra = 0;
      var ds = allDots();
      for (i = 0; i < ds.length; i++) {
        var d = ds[i], k = d.getAttribute('data-k');
        var inP = !!pattern[k], inM = !!mine[k];
        d.disabled = true;
        d.style.setProperty('--c', pattern[k] || 'var(--muted)');
        d.className = 'mela-dot' + (inP && inM && pattern[k] === mine[k] ? ' hit'
          : inP && inM ? ' near' : inP ? ' miss' : inM ? ' extra' : '');
      }
      for (i = 0; i < got.length; i++) {
        if (!pattern[got[i]]) extra++;
        else if (pattern[got[i]] === mine[got[i]]) hit++;
        else wrongC++;
      }
      var acc = need.length ? (hit + wrongC * 0.5) / (need.length + extra) : 1;
      var perfect = hit === need.length && extra === 0 && wrongC === 0;
      var pass = acc >= 0.6;
      var stars = perfect && attempt === 1 && peeks === 0 ? 3 : perfect ? 2 : pass ? 1 : 0;
      var pts = Math.round(100 * acc);
      score += pts; kauris += (stars || (acc >= 0.35 ? 1 : 0));
      var qEl = ref.stage.querySelector('.mela-q');
      if (qEl) qEl.textContent = perfect ? 'Exactly right — colours and all' : 'Here is the rangoli again';
      var msg = perfect
        ? 'Perfect. Every dot back in its own colour.'
        : hit + ' of ' + need.length + ' dots right in the right colour' +
          (wrongC ? ', ' + wrongC + ' in the wrong colour' : '') +
          (extra ? ', ' + extra + ' extra' : '') + '.';
      ref.stage.querySelector('.mela-row').innerHTML = rowNext(pass) +
        (perfect ? '' : '<button type="button" class="mela-btn ghost" data-go="retry">Try this one again</button>');
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (cEl) cEl.textContent = '+' + pts + ' points · ' + starLine(stars);
      ref.say(perfect ? one(CHEERS) + ' ' + msg : msg, perfect ? 'good' : 'warm');
      setAxis(true);
      lvlResult = { pass: pass, stars: stars };
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="lvlnext"]')); }, 60);
    }
    function toggle(d) {
      if (phase !== 'draw' || !d) return;
      var k = d.getAttribute('data-k');
      var col = RG_COLOURS[palIdx];
      if (mine[k] === col) { delete mine[k]; d.className = 'mela-dot'; d.style.setProperty('--c', 'var(--accent2)'); d.setAttribute('aria-pressed', 'false'); }
      else { mine[k] = col; d.className = 'mela-dot mine'; d.style.setProperty('--c', col); d.setAttribute('aria-pressed', 'true'); }
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
      var sws = ref.stage.querySelectorAll('.mela-sw');
      for (var k2 = 0; k2 < sws.length; k2++) {
        sws[k2].className = 'mela-sw' + (k2 === i ? ' on' : '');
        sws[k2].setAttribute('aria-checked', String(k2 === i));
      }
    }

    /* ====================== THE TEN TWISTS ====================== */
    var TW = {};

    /* -- kolam: one unbroken line through numbered dots -- */
    TW.kolam = { start: function () {
      var k = 6 + 2 * Math.min(4, cfg.d + 1), R = 130, pts = [], i;
      for (i = 0; i < k; i++) {
        var a = (i / k) * Math.PI * 2 - Math.PI / 2;
        var r = i % 2 ? R * 0.58 : R;
        pts.push({ x: 170 + Math.cos(a) * r, y: 160 + Math.sin(a) * r, n: i + 1 });
      }
      tw = { pts: pts, next: 1, miss: 0 };
      ref.stage.innerHTML = head('One unbroken line — tap 1, then 2, then on') +
        '<div class="mela-boardwrap"><svg class="mela-kolam" viewBox="0 0 340 320">' +
        '<g class="mela-klines"></g>' +
        pts.map(function (pt) {
          return '<g class="mela-kdot" data-tw="' + pt.n + '" role="button" tabindex="0" aria-label="Dot ' + pt.n + '">' +
            '<circle class="kd-hit" cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="26"/>' +
            '<circle class="kd" cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="11"/>' +
            '<text x="' + pt.x.toFixed(1) + '" y="' + (pt.y + 4.5).toFixed(1) + '" text-anchor="middle">' + pt.n + '</text></g>';
        }).join('') + '</svg></div>' +
        '<p class="mela-count" data-role="count">next: 1</p><div class="mela-row"></div>' +
        '<p class="mela-hint">Kolam lines are drawn in one unbroken loop before the door. Tab and Enter work too.</p>';
      ref.say('Start at 1 — the loop closes back where it began.', 'warm');
      sc.later(function () { focusSoft(ref.stage.querySelector('.mela-kdot')); }, 60);
    }, act: function (n) {
      var el = ref.stage.querySelector('.mela-kdot[data-tw="' + n + '"]');
      if (n !== tw.next) {
        tw.miss++;
        if (el) { el.classList.remove('shake'); void el.getBBox; el.classList.add('shake'); }
        ref.say('The line wants dot ' + tw.next + ' next.', 'warm');
        return;
      }
      if (el) el.classList.add('done');
      var lines = ref.stage.querySelector('.mela-klines');
      var a = tw.pts[(n - 2 + tw.pts.length) % tw.pts.length], b = tw.pts[n - 1];
      if (n > 1 && lines) lines.innerHTML += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>';
      tw.next++;
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (tw.next <= tw.pts.length) { if (cEl) cEl.textContent = 'next: ' + tw.next; return; }
      var z = tw.pts[tw.pts.length - 1], f = tw.pts[0];
      if (lines) lines.innerHTML += '<line x1="' + z.x + '" y1="' + z.y + '" x2="' + f.x + '" y2="' + f.y + '"/>' +
        '<polygon class="bloom" points="' + tw.pts.map(function (pt) { return pt.x + ',' + pt.y; }).join(' ') + '"/>';
      var stars = tw.miss === 0 ? 3 : tw.miss <= 2 ? 2 : 1;
      twistDone(true, stars, 80 - tw.miss * 10,
        tw.miss === 0 ? 'One unbroken line — a true kolam!' : 'The loop closed, with ' + tw.miss + ' stumble' + (tw.miss > 1 ? 's' : '') + '.');
    } };

    /* -- rain: catch petals in the matching bowl -- */
    TW.rain = { start: function () {
      var target = 9 + cfg.d * 3;
      tw = { target: target, caught: 0, missed: 0, dur: (slow ? 2900 : 2400) - cfg.d * 150,
             petal: null, raf: null, overAt: Date.now() + 40000 };
      var bowls = '';
      for (var i = 0; i < 4; i++) {
        bowls += '<button type="button" class="mela-bowl" data-tw="' + i + '" style="--c:' + RG_COLOURS[i] +
          '" aria-label="Bowl ' + (i + 1) + '"><i></i><b>' + (i + 1) + '</b></button>';
      }
      ref.stage.innerHTML = head('Catch ' + target + ' petals — each in its own colour’s bowl') +
        '<div class="mela-rainbox"><span class="mela-petal" hidden></span></div>' +
        '<div class="mela-bowls">' + bowls + '</div>' +
        '<p class="mela-count" data-role="count">caught 0 · 3 drops allowed</p><div class="mela-row"></div>' +
        '<p class="mela-hint">Tap the bowl of the petal’s colour before it lands. Keys 1–4 work too.</p>';
      function drop() {
        if (phase !== 'twist') return;
        tw.petal = { c: Math.floor(Math.random() * 4), born: Date.now(), x: 14 + Math.random() * 72 };
        var el = ref.stage.querySelector('.mela-petal');
        if (el) { el.hidden = false; el.style.setProperty('--c', RG_COLOURS[tw.petal.c]); el.style.left = tw.petal.x + '%'; el.style.top = '-24px'; }
      }
      tw.drop = drop;
      function loop() {
        if (phase !== 'twist' || sc.dead) return;
        var now = Date.now();
        var box = ref.stage.querySelector('.mela-rainbox');
        var el = ref.stage.querySelector('.mela-petal');
        if (tw.petal && box && el) {
          var f = (now - tw.petal.born) / tw.dur;
          el.style.top = (f * (box.clientHeight - 6) - 24) + 'px';
          if (f >= 1) miss('it landed');
        }
        if (now > tw.overAt) return end();
        tw.raf = W.requestAnimationFrame(loop);
      }
      function miss(why) {
        tw.missed++;
        var cEl = ref.stage.querySelector('[data-role="count"]');
        if (cEl) cEl.textContent = 'caught ' + tw.caught + ' · ' + Math.max(0, 3 - tw.missed) + ' left · ' + why;
        if (tw.missed >= 3) return end();
        drop();
      }
      tw.miss = miss;
      function end() {
        if (phase !== 'twist') return;
        if (tw.raf) W.cancelAnimationFrame(tw.raf);
        var el = ref.stage.querySelector('.mela-petal'); if (el) el.hidden = true;
        var pass = tw.caught >= Math.ceil(tw.target * 0.6);
        var stars = tw.caught >= tw.target ? 3 : pass ? 2 : tw.caught >= 4 ? 1 : 0;
        twistDone(pass, stars, tw.caught * 8,
          pass ? 'The bowls are full of colour!' : 'Slippery petals — the bowls will wait.');
      }
      tw.end = end;
      drop(); loop();
    }, act: function (i) {
      if (!tw.petal) return;
      if (i === tw.petal.c) {
        tw.caught++;
        tw.dur = Math.max(1100, tw.dur - 70);
        var cEl = ref.stage.querySelector('[data-role="count"]');
        if (cEl) cEl.textContent = 'caught ' + tw.caught + ' · ' + (3 - tw.missed) + ' drops allowed';
        if (tw.caught >= tw.target + 4) return tw.end();
        tw.drop();
      } else tw.miss('wrong bowl');
    } };

    /* -- diya: the lamps flicker in an order; light them back -- */
    TW.diya = { start: function () {
      var N = 5, rounds = 2 + Math.min(2, cfg.d), base = 2 + cfg.d;
      tw = { N: N, round: 0, rounds: rounds, base: base, seq: [], at: 0, miss: 0, showing: true };
      var lamps = '';
      for (var i = 0; i < N; i++) {
        lamps += '<button type="button" class="mela-diyabig" data-tw="' + i + '" aria-label="Diya ' + (i + 1) + '">' +
          '<span class="flame"></span><span class="cup"></span><b>' + (i + 1) + '</b></button>';
      }
      ref.stage.innerHTML = head('The diyas flicker in an order — light them back') +
        '<div class="mela-diyarow">' + lamps + '</div>' +
        '<p class="mela-count" data-role="count"></p><div class="mela-row"></div>' +
        '<p class="mela-hint">Watch the flames, then tap the diyas in the same order. Keys 1–5 work too.</p>';
      TW.diya.show();
    }, show: function () {
      tw.round++; tw.at = 0; tw.showing = true;
      tw.seq = [];
      for (var i = 0; i < tw.base + tw.round - 1; i++) tw.seq.push(Math.floor(Math.random() * tw.N));
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (cEl) cEl.textContent = 'round ' + tw.round + ' of ' + tw.rounds + ' · watch…';
      ref.say('Watch the flames…', 'warm');
      var step = 0;
      (function flash() {
        if (phase !== 'twist' || sc.dead) return;
        var all = ref.stage.querySelectorAll('.mela-diyabig');
        for (var j = 0; j < all.length; j++) all[j].classList.remove('lit');
        if (step >= tw.seq.length) {
          tw.showing = false;
          if (cEl) cEl.textContent = 'round ' + tw.round + ' of ' + tw.rounds + ' · your turn — ' + tw.seq.length + ' diyas';
          ref.say('Now you — in the same order.');
          return;
        }
        var el = all[tw.seq[step]];
        if (el) el.classList.add('lit');
        step++;
        sc.later(function () {
          for (var j2 = 0; j2 < all.length; j2++) all[j2].classList.remove('lit');
          sc.later(flash, slow ? 340 : 220);
        }, slow ? 900 : 620);
      })();
    }, act: function (i) {
      if (tw.showing) return;
      var all = ref.stage.querySelectorAll('.mela-diyabig');
      if (i === tw.seq[tw.at]) {
        if (all[i]) all[i].classList.add('lit');
        sc.later(function () { if (all[i]) all[i].classList.remove('lit'); }, 260);
        tw.at++;
        if (tw.at >= tw.seq.length) {
          if (tw.round >= tw.rounds) {
            var stars = tw.miss === 0 ? 3 : tw.miss === 1 ? 2 : 1;
            return twistDone(true, stars, 60 + (tw.rounds - tw.miss) * 15,
              tw.miss === 0 ? 'Every diya in its turn — the whole row burns!' : 'The row burns bright.');
          }
          sc.later(function () { if (phase === 'twist') TW.diya.show(); }, 700);
        }
      } else {
        tw.miss++;
        ref.say('Not that one — watch once more.', 'warm');
        if (tw.miss >= 3) return twistDone(false, 0, 20, 'The wind took the flames — next sitting they burn.');
        sc.later(function () { if (phase === 'twist') { tw.round--; TW.diya.show(); } }, 650);
      }
    } };

    /* -- mehndi: the left hand is drawn; mirror it onto the right -- */
    TW.mehndi = { start: function () {
      cfg.n = 6; cfg.mode = 'v'; cfg.colors = Math.min(3, 1 + cfg.d);
      var seeds = 4 + cfg.d;
      pattern = rangoliPattern({ n: 6, seeds: seeds, mode: 'v', colors: cfg.colors });
      tw = { placed: {} };
      ref.stage.innerHTML = head('Half the mehndi is drawn — finish the other hand') +
        boardHTML(6, 'v') +
        '<p class="mela-count" data-role="count"></p>' +
        '<div class="mela-row"><button type="button" class="mela-btn" data-go="twcheck">Check the mirror</button></div>' +
        '<p class="mela-hint">The LEFT side stays painted. Tap the RIGHT side to mirror it — each dot takes its partner’s colour by itself.</p>';
      var ds = allDots();
      for (var i = 0; i < ds.length; i++) {
        var d = ds[i], k = d.getAttribute('data-k'), c = +k.split(',')[1];
        var left = c < 3;
        if (left) {
          d.className = 'mela-dot' + (pattern[k] ? ' lit' : '');
          d.style.setProperty('--c', pattern[k] || 'transparent');
          d.disabled = true;
        } else {
          d.className = 'mela-dot';
          d.style.setProperty('--c', 'var(--accent2)');
        }
      }
      setAxis(true);
      ref.say('Mehndi is a mirror — what the left hand has, the right hand answers.', 'warm');
    }, tap: function (d) {
      var k = d.getAttribute('data-k'), parts = k.split(','), r = +parts[0], c = +parts[1];
      if (c < 3) return;
      var mk = r + ',' + (5 - c);
      var want = pattern[mk] || null;
      if (tw.placed[k]) {
        delete tw.placed[k];
        d.className = 'mela-dot'; d.style.setProperty('--c', 'var(--accent2)');
        return;
      }
      tw.placed[k] = want || RG_COLOURS[0];
      d.className = 'mela-dot mine';
      d.style.setProperty('--c', tw.placed[k]);
    }, check: function () {
      var hit = 0, extra = 0, needN = 0, k, r, c;
      for (k in pattern) {
        if (!pattern.hasOwnProperty(k)) continue;
        c = +k.split(',')[1];
        if (c >= 3) { needN++; if (tw.placed[k]) hit++; }
      }
      for (k in tw.placed) if (tw.placed.hasOwnProperty(k) && !pattern[k]) extra++;
      var pass = needN ? (hit / (needN + extra)) >= 0.7 : true;
      var perfect = hit === needN && !extra;
      var ds = allDots();
      for (var i = 0; i < ds.length; i++) {
        var d = ds[i]; k = d.getAttribute('data-k'); c = +k.split(',')[1];
        if (c < 3) continue;
        d.disabled = true;
        d.style.setProperty('--c', pattern[k] || 'var(--muted)');
        d.className = 'mela-dot' + (pattern[k] && tw.placed[k] ? ' hit' : pattern[k] ? ' miss' : tw.placed[k] ? ' extra' : '');
      }
      twistDone(pass, perfect ? 3 : pass ? 2 : 0, hit * 12,
        perfect ? 'Both hands match — shaadi-ready mehndi!' : hit + ' of ' + needN + ' mirrored true.');
    } };

    /* -- toran: what hangs next on the doorway string? -- */
    TW.toran = { start: function () {
      var MOT = ['🌼', '🍃', '🪔', '🌸', '🍋'];
      tw = { MOT: MOT, round: 0, rounds: 4, hits: 0, misses: 0 };
      ref.stage.innerHTML = head('The toran is being strung — what hangs next?') +
        '<div class="mela-toran"><div class="mela-torstring" data-role="tor"></div></div>' +
        '<div class="mela-toropts" data-role="toropts"></div>' +
        '<p class="mela-count" data-role="count"></p><div class="mela-row"></div>' +
        '<p class="mela-hint">A toran repeats its pattern across the doorway. Read the string, tap what comes next. Keys 1–3.</p>';
      TW.toran.round();
    }, round: function () {
      tw.round++;
      var ulen = 2 + Math.min(2, Math.floor((cfg.d + tw.round) / 3));
      var unit = [], i;
      for (i = 0; i < ulen; i++) unit.push(tw.MOT[Math.floor(Math.random() * tw.MOT.length)]);
      if (ulen > 1 && unit[0] === unit[1]) unit[1] = tw.MOT[(tw.MOT.indexOf(unit[1]) + 1) % tw.MOT.length];
      var reps = 2 + (ulen === 2 ? 1 : 0);
      var seq = [];
      for (i = 0; i < reps * ulen + (ulen - 1); i++) seq.push(unit[i % ulen]);
      tw.answer = unit[seq.length % ulen];
      var el = ref.stage.querySelector('[data-role="tor"]');
      if (el) el.innerHTML = seq.map(function (m) { return '<span>' + m + '</span>'; }).join('') + '<span class="q">?</span>';
      var opts = [tw.answer], guard = 0;
      while (opts.length < 3 && guard++ < 40) {
        var cand = tw.MOT[Math.floor(Math.random() * tw.MOT.length)];
        if (opts.indexOf(cand) < 0) opts.push(cand);
      }
      opts.sort(function () { return Math.random() - 0.5; });
      var oEl = ref.stage.querySelector('[data-role="toropts"]');
      if (oEl) oEl.innerHTML = opts.map(function (m, j) {
        return '<button type="button" class="mela-torbtn" data-tw="' + m + '" aria-label="Choice ' + (j + 1) + '">' + m + '</button>';
      }).join('');
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (cEl) cEl.textContent = 'string ' + tw.round + ' of ' + tw.rounds;
    }, act: function (m) {
      if (m === tw.answer) { tw.hits++; ref.say('It hangs just right.', 'good'); }
      else { tw.misses++; ref.say('The pattern wanted ' + tw.answer + '.', 'warm'); }
      if (tw.round >= tw.rounds) {
        var pass = tw.hits >= 3;
        return twistDone(pass, tw.hits === 4 ? 3 : pass ? 2 : tw.hits >= 2 ? 1 : 0, tw.hits * 20,
          pass ? 'The doorway is dressed!' : 'The string slipped — another day.');
      }
      TW.toran.round();
    } };

    /* -- chakra: the wheel turns in a pattern; fill the missing wedge -- */
    TW.chakra = { start: function () {
      tw = { round: 0, rounds: 3, hits: 0 };
      ref.stage.innerHTML = head('The chakra turns in a pattern — fill the missing wedge') +
        '<div class="mela-boardwrap"><svg class="mela-chakra" viewBox="0 0 300 300" data-role="wheel"></svg></div>' +
        '<div class="mela-toropts" data-role="chopts"></div>' +
        '<p class="mela-count" data-role="count"></p><div class="mela-row"></div>' +
        '<p class="mela-hint">Go around the wheel — the colours repeat in a circle. Which colour completes it? Keys 1–3.</p>';
      TW.chakra.round();
    }, round: function () {
      tw.round++;
      var W8 = 8, period = tw.round + cfg.d >= 4 ? 4 : 2;
      var pal = [];
      while (pal.length < period) {
        var c2 = RG_COLOURS[Math.floor(Math.random() * 4)];
        if (pal.indexOf(c2) < 0) pal.push(c2);
      }
      var gap = Math.floor(Math.random() * W8);
      tw.answer = pal[gap % period];
      var svg = ref.stage.querySelector('[data-role="wheel"]');
      var out = '', i;
      for (i = 0; i < W8; i++) {
        var a0 = (i / W8) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / W8) * Math.PI * 2 - Math.PI / 2;
        var x0 = 150 + Math.cos(a0) * 120, y0 = 150 + Math.sin(a0) * 120;
        var x1 = 150 + Math.cos(a1) * 120, y1 = 150 + Math.sin(a1) * 120;
        out += '<path d="M150 150L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'A120 120 0 0 1 ' +
          x1.toFixed(1) + ' ' + y1.toFixed(1) + 'Z" fill="' + (i === gap ? 'var(--card)' : pal[i % period]) +
          '" stroke="var(--card)" stroke-width="4"' + (i === gap ? ' stroke-dasharray="6 6" stroke="var(--muted)"' : '') + '/>';
      }
      out += '<circle cx="150" cy="150" r="26" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>';
      if (svg) svg.innerHTML = out;
      var opts = [tw.answer], guard = 0;
      while (opts.length < 3 && guard++ < 40) {
        var cand = RG_COLOURS[Math.floor(Math.random() * 4)];
        if (opts.indexOf(cand) < 0) opts.push(cand);
      }
      opts.sort(function () { return Math.random() - 0.5; });
      var oEl = ref.stage.querySelector('[data-role="chopts"]');
      if (oEl) oEl.innerHTML = opts.map(function (c3, j) {
        return '<button type="button" class="mela-sw big" data-tw="' + esc(c3) + '" style="--c:' + c3 +
          '" aria-label="Colour choice ' + (j + 1) + '"></button>';
      }).join('');
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (cEl) cEl.textContent = 'wheel ' + tw.round + ' of ' + tw.rounds;
    }, act: function (c4) {
      if (c4 === tw.answer) { tw.hits++; ref.say('The wheel is whole.', 'good'); }
      else ref.say('Follow the circle round — it repeats.', 'warm');
      if (tw.round >= tw.rounds) {
        var pass = tw.hits >= 2;
        return twistDone(pass, tw.hits === 3 ? 3 : pass ? 2 : tw.hits ? 1 : 0, tw.hits * 25,
          pass ? 'Three wheels, turning true.' : 'The wheel wobbled — it will turn again.');
      }
      TW.chakra.round();
    } };

    /* -- genda: marigolds scatter for a blink; how many? -- */
    TW.genda = { start: function () {
      tw = { round: 0, rounds: 4, hits: 0 };
      ref.stage.innerHTML = head('Genda phool scatter — count them in a blink') +
        '<div class="mela-genda" data-role="genda"></div>' +
        '<div class="mela-toropts" data-role="gopts"></div>' +
        '<p class="mela-count" data-role="count"></p><div class="mela-row"></div>' +
        '<p class="mela-hint">The marigolds show for a moment. How many were there? Keys 1–3.</p>';
      TW.genda.round();
    }, round: function () {
      tw.round++;
      var k = 3 + Math.floor(Math.random() * (3 + cfg.d * 2));
      tw.answer = k;
      var box = ref.stage.querySelector('[data-role="genda"]');
      var out = '', i;
      for (i = 0; i < k; i++) {
        out += '<span style="left:' + (8 + Math.random() * 84) + '%;top:' + (10 + Math.random() * 70) + '%">🌼</span>';
      }
      if (box) box.innerHTML = out;
      var oEl = ref.stage.querySelector('[data-role="gopts"]');
      if (oEl) oEl.innerHTML = '';
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (cEl) cEl.textContent = 'look… (' + tw.round + ' of ' + tw.rounds + ')';
      sc.later(function () {
        if (phase !== 'twist') return;
        if (box) box.innerHTML = '<b class="q">?</b>';
        var opts = [k, k + 1, Math.max(1, k - 1)].sort(function () { return Math.random() - 0.5; });
        if (oEl) oEl.innerHTML = opts.map(function (n2, j) {
          return '<button type="button" class="mela-torbtn num" data-tw="' + n2 + '" aria-label="Choice ' + (j + 1) + '">' + n2 + '</button>';
        }).join('');
        if (cEl) cEl.textContent = 'how many marigolds?';
      }, slow ? 2600 : 1400 + Math.min(600, k * 90));
    }, act: function (n2) {
      if (+n2 === tw.answer) { tw.hits++; ref.say('Counted like a mali!', 'good'); }
      else ref.say('There were ' + tw.answer + '.', 'warm');
      if (tw.round >= tw.rounds) {
        var pass = tw.hits >= 3;
        return twistDone(pass, tw.hits === 4 ? 3 : pass ? 2 : tw.hits >= 2 ? 1 : 0, tw.hits * 20,
          pass ? 'The mali’s eye — sharp as a thorn.' : 'The flowers fooled you today.');
      }
      TW.genda.round();
    } };

    /* -- bindi: turn the cards, find the pairs -- */
    TW.bindi = { start: function () {
      var SHAPES = ['●', '◆', '✦', '✿', '▲', '❀'];
      var nPairs = 4 + Math.min(2, cfg.d);
      var cards = [], i;
      for (i = 0; i < nPairs; i++) {
        var c5 = RG_COLOURS[i % 4], sh = SHAPES[i % SHAPES.length];
        cards.push({ p: i, c: c5, sh: sh }, { p: i, c: c5, sh: sh });
      }
      cards.sort(function () { return Math.random() - 0.5; });
      tw = { cards: cards, open: [], found: 0, flips: 0, lock: false, nPairs: nPairs };
      ref.stage.innerHTML = head('Turn the bindi cards — find every pair') +
        '<div class="mela-bindis" style="--bn:' + (nPairs <= 4 ? 4 : 4) + '">' +
        cards.map(function (cd, j) {
          return '<button type="button" class="mela-bindi" data-tw="' + j + '" aria-label="Card ' + (j + 1) + '">' +
            '<span class="face" style="--c:' + cd.c + '">' + cd.sh + '</span><span class="back">ॐ</span></button>';
        }).join('') + '</div>' +
        '<p class="mela-count" data-role="count">pairs 0 of ' + nPairs + '</p><div class="mela-row"></div>' +
        '<p class="mela-hint">Two cards a turn. A matching pair stays open. Tab and Enter work too.</p>';
    }, act: function (j) {
      if (tw.lock) return;
      j = +j;
      var el = ref.stage.querySelector('.mela-bindi[data-tw="' + j + '"]');
      if (!el || el.classList.contains('open') || el.classList.contains('got')) return;
      el.classList.add('open');
      tw.open.push(j);
      if (tw.open.length < 2) return;
      tw.flips++;
      var a = tw.cards[tw.open[0]], b = tw.cards[tw.open[1]];
      var ea = ref.stage.querySelector('.mela-bindi[data-tw="' + tw.open[0] + '"]');
      var eb = ref.stage.querySelector('.mela-bindi[data-tw="' + tw.open[1] + '"]');
      tw.open = [];
      if (a.p === b.p) {
        if (ea) ea.classList.add('got'); if (eb) eb.classList.add('got');
        tw.found++;
        var cEl = ref.stage.querySelector('[data-role="count"]');
        if (cEl) cEl.textContent = 'pairs ' + tw.found + ' of ' + tw.nPairs;
        if (tw.found >= tw.nPairs) {
          var perfectF = tw.flips <= tw.nPairs + 1;
          twistDone(true, perfectF ? 3 : tw.flips <= tw.nPairs + 3 ? 2 : 1, 90 - (tw.flips - tw.nPairs) * 6,
            perfectF ? 'A memory like a mirror!' : 'Every bindi met its match.');
        }
      } else {
        tw.lock = true;
        sc.later(function () {
          if (ea) ea.classList.remove('open'); if (eb) eb.classList.remove('open');
          tw.lock = false;
        }, slow ? 1100 : 750);
      }
    } };

    /* -- taal: dha dhin ta tin — repeat the bols -- */
    TW.taal = { start: function () {
      var BOLS = ['Dha', 'Dhin', 'Ta', 'Tin'];
      tw = { BOLS: BOLS, round: 0, rounds: 2, seq: [], at: 0, miss: 0, showing: true };
      ref.stage.innerHTML = head('The tabla speaks — answer the same bols') +
        '<div class="mela-taalrow">' +
        BOLS.map(function (bl, i) {
          return '<button type="button" class="mela-pad" data-tw="' + i + '" style="--c:' + RG_COLOURS[i] +
            '" aria-label="' + bl + '"><i></i><b>' + bl + '</b><u>' + (i + 1) + '</u></button>';
        }).join('') + '</div>' +
        '<p class="mela-count" data-role="count"></p><div class="mela-row"></div>' +
        '<p class="mela-hint">Watch the pads sound in order, then play them back. Keys 1–4.</p>';
      TW.taal.show();
    }, show: function () {
      tw.round++; tw.at = 0; tw.showing = true; tw.seq = [];
      var len = 3 + cfg.d + tw.round;
      for (var i = 0; i < len; i++) tw.seq.push(Math.floor(Math.random() * 4));
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (cEl) cEl.textContent = 'taal ' + tw.round + ' of ' + tw.rounds + ' · listen…';
      var step = 0;
      (function beat() {
        if (phase !== 'twist' || sc.dead) return;
        var pads = ref.stage.querySelectorAll('.mela-pad');
        for (var j = 0; j < pads.length; j++) pads[j].classList.remove('hitp');
        if (step >= tw.seq.length) {
          tw.showing = false;
          if (cEl) cEl.textContent = 'taal ' + tw.round + ' of ' + tw.rounds + ' · your hands — ' + tw.seq.length + ' bols';
          return;
        }
        var el = pads[tw.seq[step]];
        if (el) el.classList.add('hitp');
        step++;
        sc.later(function () {
          for (var j2 = 0; j2 < pads.length; j2++) pads[j2].classList.remove('hitp');
          sc.later(beat, slow ? 260 : 150);
        }, slow ? 700 : 430);
      })();
    }, act: function (i) {
      if (tw.showing) return;
      i = +i;
      var pads = ref.stage.querySelectorAll('.mela-pad');
      if (i === tw.seq[tw.at]) {
        if (pads[i]) { pads[i].classList.add('hitp'); sc.later(function () { if (pads[i]) pads[i].classList.remove('hitp'); }, 200); }
        tw.at++;
        if (tw.at >= tw.seq.length) {
          if (tw.round >= tw.rounds) {
            var stars = tw.miss === 0 ? 3 : tw.miss === 1 ? 2 : 1;
            return twistDone(true, stars, 70 - tw.miss * 15, 'Wah ustad, wah!');
          }
          sc.later(function () { if (phase === 'twist') TW.taal.show(); }, 700);
        }
      } else {
        tw.miss++;
        ref.say('The taal broke — listen once more.', 'warm');
        if (tw.miss >= 3) return twistDone(false, 0, 20, 'The tabla rests — the taal will come.');
        sc.later(function () { if (phase === 'twist') { tw.round--; TW.taal.show(); } }, 650);
      }
    } };

    /* -- repair: three dots broke the symmetry — find them -- */
    TW.repair = { start: function () {
      cfg.n = 6 + Math.min(2, cfg.d); cfg.mode = 'vh';
      pattern = rangoliPattern({ n: cfg.n, seeds: 5 + cfg.d, mode: 'vh', colors: 3 });
      /* corrupt three mirrored spots with a wrong colour */
      var ks = keys(pattern);
      tw = { broken: {}, found: 0, taps: 0 };
      var guard = 0;
      while (keys(tw.broken).length < 3 && guard++ < 80) {
        var k = ks[Math.floor(Math.random() * ks.length)];
        if (tw.broken[k]) continue;
        var others = RG_COLOURS.filter(function (c6) { return c6 !== pattern[k]; });
        tw.broken[k] = others[Math.floor(Math.random() * others.length)];
      }
      ref.stage.innerHTML = head('Three dots broke the symmetry — find them') +
        boardHTML(cfg.n, 'vh') +
        '<p class="mela-count" data-role="count">found 0 of 3 · 6 taps</p><div class="mela-row"></div>' +
        '<p class="mela-hint">The rangoli should mirror left-right AND top-bottom. Three dots wear the wrong colour — tap them.</p>';
      var ds = allDots();
      for (var i = 0; i < ds.length; i++) {
        var d = ds[i], dk = d.getAttribute('data-k');
        var col = tw.broken[dk] || pattern[dk];
        d.className = 'mela-dot' + (col ? ' lit tap' : '');
        d.style.setProperty('--c', col || 'transparent');
        d.disabled = !col;
      }
      setAxis(true);
    }, tap: function (d) {
      var k = d.getAttribute('data-k');
      if (d.classList.contains('hit') || d.classList.contains('extra')) return;
      tw.taps++;
      if (tw.broken[k]) {
        tw.found++;
        d.className = 'mela-dot lit hit';
        d.style.setProperty('--c', pattern[k]);
        ref.say('Mended — the mirror holds again.', 'good');
      } else {
        d.className = 'mela-dot lit extra';
        ref.say('That one is true. Check its mirror twin.', 'warm');
      }
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (cEl) cEl.textContent = 'found ' + tw.found + ' of 3 · ' + Math.max(0, 6 - tw.taps) + ' taps';
      if (tw.found >= 3) {
        var stars = tw.taps <= 3 ? 3 : tw.taps <= 5 ? 2 : 1;
        return twistDone(true, stars, 90 - (tw.taps - 3) * 10, 'All three mended — the rangoli breathes.');
      }
      if (tw.taps >= 6) {
        return twistDone(false, tw.found ? 1 : 0, tw.found * 20, 'Two eyes were not enough today — the mirror keeps its secret.');
      }
    } };

    /* --------------------------------------------- the ladder itself ---- */
    function levelUp() {
      var res = lvlResult || { pass: false, stars: 0 };
      if (res.pass) {
        passedN++;
        if (lvl === rgLoad()) rgSave(lvl + 1);
        lvl++;
      }
      slot++;
      ref.mark(slot > SLOTS ? SLOTS : slot, slot >= SLOTS ? 'end' : undefined);
      if (lvl >= 100 && res.pass) return finish(true);
      if (slot >= SLOTS) return finish(false);
      var nxt = rgLevel(lvl);
      ref.stage.innerHTML =
        '<div class="mela-done">' +
          ladderHTML(lvl) +
          '<h3>' + (res.pass ? 'Level up!' : 'Level ' + (lvl + 1) + ' holds its ground') + '</h3>' +
          '<p>' + (res.pass
            ? (res.stars >= 3 ? 'Three stars — flawless. ' : res.stars ? starLine(res.stars) + ' — cleared. ' : 'Cleared. ') +
              'The ladder remembers between sittings.'
            : 'Not this time — the same level waits, and it will fall.') + '</p>' +
          '<div class="mela-row"><button type="button" class="mela-btn" data-go="startlvl">' +
          (nxt.kind === 'mem' ? 'Next rangoli' : 'The twist — ' + RG_TW_NAME[nxt.kind] + '!') + '</button></div>' +
        '</div>';
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="startlvl"]')); }, 60);
    }

    function startLevel() {
      cfg = rgLevel(lvl);
      lvlResult = null;
      palIdx = 0;
      tw = null;
      if (cfg.kind !== 'mem') { phase = 'twist'; TW[cfg.kind].start(); return; }
      pattern = rangoliPattern(cfg);
      mine = {}; attempt = 1; peeks = 0; resume = null;
      showPhase();
    }

    function finish(summit) {
      if (finished) return;
      ref.say('');
      ref.stage.innerHTML =
        '<div class="mela-done">' +
          ladderHTML(lvl) +
          '<div class="mela-art">' + (motifHTML('lotus') || mascotHTML('happy', 100)) + '</div>' +
          '<h3>' + (summit ? 'The hundredth threshold!' : esc(one(CHEERS))) + '</h3>' +
          '<p>' + (summit
            ? 'A hundred rangolis, kolams, taals and torans — the whole courtyard bows.'
            : passedN + ' of ' + SLOTS + ' levels cleared this sitting. You stand at level ' + (rgLoad() + 1) + ' of 100 — the ladder keeps your place.') + '</p>' +
          '<div class="mela-tally">' +
            '<span class="mela-chip"><b>' + score + '</b> points</span>' +
            '<span class="mela-chip"><b>' + kauris + '</b> kauris</span>' +
          '</div>' +
          '<div class="mela-row">' +
            '<button type="button" class="mela-btn" data-go="out">Back to the Mela</button>' +
            '<button type="button" class="mela-btn ghost" data-go="again">Climb on</button>' +
          '</div>' +
        '</div>';
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="out"]')); }, 60);
    }

    function bail(win) {
      if (finished) return;
      finished = true;
      if (tw && tw.raf) W.cancelAnimationFrame(tw.raf);
      sc.kill();
      if (typeof done === 'function') done({ win: !!win, score: score, kauris: kauris });
    }

    sc.on(ref.stage, 'click', function (e) {
      var t = e.target;
      var sw = t.closest ? t.closest('.mela-sw[data-sw]') : null;
      if (sw) { pickColor(parseInt(sw.getAttribute('data-sw'), 10)); return; }
      var twEl = t.closest ? t.closest('[data-tw]') : null;
      if (twEl && phase === 'twist' && cfg && TW[cfg.kind] && TW[cfg.kind].act) {
        TW[cfg.kind].act(twEl.getAttribute('data-tw'));
        return;
      }
      var d = t.closest ? t.closest('.mela-dot') : null;
      if (d) {
        if (phase === 'twist' && cfg.kind === 'mehndi') { TW.mehndi.tap(d); return; }
        if (phase === 'twist' && cfg.kind === 'repair') { TW.repair.tap(d); return; }
        toggle(d);
        return;
      }
      var go = t.closest ? t.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'ready') { drawPhase(); }
      else if (what === 'check') { checkPhase(); }
      else if (what === 'twcheck') { if (cfg.kind === 'mehndi') TW.mehndi.check(); }
      else if (what === 'peek') { peeks++; peekPhase(); }
      else if (what === 'retry') { attempt++; mine = {}; peeks++; peekPhase(); }
      else if (what === 'lvlnext') { levelUp(); }
      else if (what === 'startlvl') { startLevel(); }
      else if (what === 'again') { slot = 0; passedN = 0; lvl = rgLoad(); ref.mark(0); startLevel(); }
      else if (what === 'out') { bail(true); }
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead || !ref.stage) return;
      if (detached(host)) { sc.kill(); return; }
      var t = e.target;
      if (phase === 'twist' && e.key >= '1' && e.key <= '9') {
        var kind = cfg && cfg.kind;
        if (kind === 'rain' || kind === 'taal') { if (+e.key <= 4) { e.preventDefault(); TW[kind].act(+e.key - 1); } return; }
        if (kind === 'diya') { if (+e.key <= 5) { e.preventDefault(); TW.diya.act(+e.key - 1); } return; }
        if (kind === 'toran' || kind === 'genda' || kind === 'chakra') {
          var btns = ref.stage.querySelectorAll('[data-role="toropts"] [data-tw],[data-role="gopts"] [data-tw],[data-role="chopts"] [data-tw]');
          var bi = +e.key - 1;
          if (btns[bi]) { e.preventDefault(); TW[kind].act(btns[bi].getAttribute('data-tw')); }
          return;
        }
      }
      if (phase === 'twist' && e.key === 'Enter') {
        var twk = t && t.getAttribute && t.getAttribute('data-tw');
        if (twk !== null && twk !== undefined && cfg && TW[cfg.kind] && TW[cfg.kind].act) { e.preventDefault(); TW[cfg.kind].act(twk); return; }
      }
      if (phase === 'draw' && e.key >= '1' && e.key <= '4') { e.preventDefault(); pickColor(+e.key - 1); return; }
      var d = t && t.classList && t.classList.contains('mela-dot') ? t : null;
      if (d && phase === 'draw') {
        if (e.key === 'ArrowRight') { e.preventDefault(); moveDot(d, 0, 1); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); moveDot(d, 0, -1); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveDot(d, 1, 0); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); moveDot(d, -1, 0); return; }
      }
      if (e.key === 'Enter' && phase === 'draw' && !d) {
        var chk = ref.stage.querySelector('[data-go="check"]');
        if (chk) { e.preventDefault(); checkPhase(); }
      }
    });

    startLevel();
    return teardownOf(sc, function () { finished = true; });
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

  function statehunt(host, opts, done) {
    var pool = stateData();
    var COUNT = Math.min(6, pool.length);

    function build() {
      var picks = pickN(pool, COUNT), rounds = [], i;
      for (i = 0; i < picks.length; i++) {
        var s = picks[i];
        var kind = (s.capQ && Math.random() < 0.45) ? 'capital' : 'clue';
        var others = [], j;
        for (j = 0; j < pool.length; j++) if (pool[j].name !== s.name) others.push(pool[j]);
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
      count: COUNT,
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

  function festival(host, opts, done) {
    var COUNT = 8;

    function build() {
      var picks = pickN(FESTIVALS, COUNT), rounds = [], i, j;
      for (i = 0; i < picks.length; i++) {
        var f = picks[i];
        /* rotate the question kind so a run covers when / where / why */
        var kinds = ['when', 'why', 'where'];
        var kind = kinds[i % kinds.length];
        if (kind === 'where' && !f.whereQ) kind = (i % 2) ? 'when' : 'why';

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
      count: COUNT,
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

  function jataka(host, opts, done) {
    var COUNT = 6;

    function build() {
      var picks = pickN(JATAKAS, COUNT), rounds = [], i, j;
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
      count: COUNT,
      twoUp: false,
      hint: 'Read it, or have it read to you. Then tap a lesson — arrow keys and Enter work too.',
      build: build
    }, done);
  }

  /* ==================================================================
     REGISTRY
     ================================================================== */

  W.IND_GAMES = [
    { id: 'rangoli', name: 'Rangoli Rush', icon: 'star', minutes: 4,
      blurb: 'A hundred thresholds. The rangoli flashes, then blows away — draw it back in colour. Every fourth level is a twist from a pool of ten: kolam loops, petal rain, diya raat, mehndi mirrors, toran threads, chakra wheels, genda counting, bindi pairs, tabla taal, rangoli repair. The ladder remembers your place.',
      engine: rangoli },
    { id: 'statehunt', name: 'State Hunt', icon: 'map', minutes: 4,
      blurb: 'A capital, a fort, a rhino, a mountain. Which state is it? Six stops on a yatra across India.',
      engine: statehunt },
    /* off the Mela shelf, ON the festival pages: Moral Science and Utsav
       carry its door — a festival game belongs beside the festivals */
    { id: 'festival', name: 'Festival Frenzy', icon: 'lamp', minutes: 4, hide: true,
      blurb: 'Twelve festivals, one year. Match each one to its month, its home state and the reason people keep it.',
      engine: festival },
    { id: 'jataka', name: 'Jataka Jump', icon: 'book', minutes: 3,
      blurb: 'Very short animal fables from the Jataka tales. Hear the story, then find the lesson hiding in it.',
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
})();
