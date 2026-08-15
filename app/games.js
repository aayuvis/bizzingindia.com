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
    '.mela-art{display:flex;justify-content:center;margin:2px 0 6px}',
    '.mela-art svg{display:block;max-width:min(100%,150px);max-height:150px;height:auto;width:auto}',
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

  var RG_ROUNDS = [
    { n: 4, seeds: 3, mode: 'v',  label: 'A mirror rangoli',   note: 'The left half and the right half match. Remember one half and flip it.' },
    { n: 5, seeds: 4, mode: 'v',  label: 'A wider mirror',     note: 'Still a mirror down the middle — the centre line can hold dots of its own.' },
    { n: 6, seeds: 3, mode: 'vh', label: 'A four-fold rangoli', note: 'This one folds twice: left to right AND top to bottom. Remember one quarter.' }
  ];

  function rangoliPattern(cfg) {
    var n = cfg.n, half = Math.ceil(n / 2), map = {}, tries = 0, ci = 0;
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
      var colour = RG_COLOURS[ci % RG_COLOURS.length]; ci++;
      put(r, c, colour);
      put(r, n - 1 - c, colour);
      if (cfg.mode === 'vh') { put(n - 1 - r, c, colour); put(n - 1 - r, n - 1 - c, colour); }
      seeds++;
    }
    return map;
  }

  function rangoli(host, opts, done) {
    var sc = scope();
    var ref = shell(host, 'Rangoli Rush', 'Mela · pattern & symmetry', RG_ROUNDS.length);
    var slow = reducedMotion();
    var idx = 0, score = 0, kauris = 0, finished = false;
    var cfg = null, pattern = null, mine = null, phase = 'show', attempt = 1, peeks = 0, resume = null;

    function keys(map) { var k = [], p; for (p in map) if (map.hasOwnProperty(p)) k.push(p); return k; }

    function boardHTML() {
      var h = '<div class="mela-boardwrap"><div class="mela-grid" role="group" aria-label="Rangoli dot grid" style="--n:' + cfg.n + '">';
      for (var r = 0; r < cfg.n; r++) {
        for (var c = 0; c < cfg.n; c++) {
          h += '<button type="button" class="mela-dot" data-k="' + r + ',' + c + '" tabindex="' +
               (r === 0 && c === 0 ? '0' : '-1') + '" aria-pressed="false" aria-label="Row ' + (r + 1) + ', dot ' + (c + 1) + '">' +
               '<span class="pip"></span></button>';
        }
      }
      h += '</div><div class="mela-axis v"></div>' + (cfg.mode === 'vh' ? '<div class="mela-axis h"></div>' : '') + '</div>';
      return h;
    }

    function dot(k) { return ref.stage.querySelector('.mela-dot[data-k="' + k + '"]'); }
    function allDots() { return ref.stage.querySelectorAll('.mela-dot'); }

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
        d.style.setProperty('--c', 'var(--accent2)');
        d.disabled = false;
        d.setAttribute('aria-pressed', mine[k] ? 'true' : 'false');
      }
      setAxis(false);
    }
    function setAxis(on) {
      var ax = ref.stage.querySelectorAll('.mela-axis');
      for (var i = 0; i < ax.length; i++) ax[i].className = 'mela-axis ' + (ax[i].classList.contains('h') ? 'h' : 'v') + (on ? ' on' : '');
    }

    function frame(kicker, question, mainLabel, mainGo, ghostLabel, ghostGo, hint) {
      ref.stage.innerHTML =
        '<p class="mela-kicker" style="text-align:center">' + esc(kicker) + '</p>' +
        '<h3 class="mela-q">' + esc(question) + '</h3>' +
        boardHTML() +
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

    function showPhase() {
      phase = 'show';
      var need = keys(pattern).length;
      frame('Rangoli ' + (idx + 1) + ' of ' + RG_ROUNDS.length + ' · ' + cfg.n + ' × ' + cfg.n + ' · ' + cfg.label,
            'Look carefully…', 'I have got it', 'ready', '', '',
            cfg.note);
      paintShow();
      ref.say('Chalk dust — ' + need + ' dots. It blows away in a moment.', 'warm');
      var secs = Math.max(3, Math.round(need * 0.55) + 2);
      var left = secs;
      var el = ref.stage.querySelector('[data-role="count"]');
      if (el) el.textContent = 'Blows away in ' + left + '…';
      var tick = sc.every(function () {
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
      frame('Rangoli ' + (idx + 1) + ' of ' + RG_ROUNDS.length + ' · a second look',
            'Here it is again…', 'Got it', 'ready', '', '', cfg.note);
      paintShow();
      ref.say('Take your time.', 'warm');
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="ready"]')); }, 60);
      sc.later(function () { if (phase === 'show') drawPhase(); }, slow ? 4200 : 3200);
    }

    function drawPhase() {
      phase = 'draw';
      if (resume) { mine = resume; resume = null; }
      var need = keys(pattern).length;
      frame('Rangoli ' + (idx + 1) + ' of ' + RG_ROUNDS.length + ' · your turn',
            'Now draw it back', 'Check my rangoli', 'check', 'Show me again', 'peek',
            'Tap the dots — or move with the arrow keys and press Space. ' + need + ' dots to place.');
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
      var need = keys(pattern), got = keys(mine), i, hit = 0, extra = 0;
      var ds = allDots();
      for (i = 0; i < ds.length; i++) {
        var d = ds[i], k = d.getAttribute('data-k');
        var inP = !!pattern[k], inM = !!mine[k];
        d.disabled = true;
        d.style.setProperty('--c', pattern[k] || 'var(--muted)');
        d.className = 'mela-dot' + (inP && inM ? ' hit' : inP ? ' miss' : inM ? ' extra' : '');
      }
      for (i = 0; i < got.length; i++) { if (pattern[got[i]]) hit++; else extra++; }
      setAxis(true);

      var acc = need.length ? hit / (need.length + extra) : 1;
      var perfect = hit === need.length && extra === 0;
      var earned = perfect ? (attempt === 1 && peeks === 0 ? 3 : 2) : (acc >= 0.6 ? 2 : 1);
      var pts = Math.round(100 * acc);
      score += pts; kauris += earned;

      var last = idx >= RG_ROUNDS.length - 1;
      var kEl = ref.stage.querySelector('.mela-kicker');
      if (kEl) kEl.textContent = 'Rangoli ' + (idx + 1) + ' of ' + RG_ROUNDS.length + ' · how it lined up';
      var qEl = ref.stage.querySelector('.mela-q');
      if (qEl) qEl.textContent = perfect ? 'Exactly right' : 'Here is the rangoli again';
      var msg = perfect
        ? 'Perfect. Every dot back where it belonged.'
        : hit + ' of ' + need.length + ' dots landed right' + (extra ? ', and ' + extra + ' extra crept in' : '') + '. Look at the dotted line — that is the mirror.';
      ref.stage.querySelector('.mela-row').innerHTML =
        '<button type="button" class="mela-btn" data-go="next">' + (last ? 'See how I did' : 'Next rangoli') + '</button>' +
        (perfect ? '' : '<button type="button" class="mela-btn ghost" data-go="retry">Try this one again</button>');
      var hintEl = ref.stage.querySelector('.mela-hint');
      if (hintEl) hintEl.textContent = cfg.note;
      var cEl = ref.stage.querySelector('[data-role="count"]');
      if (cEl) cEl.textContent = '+' + pts + ' points · +' + earned + ' kauris';
      ref.say(perfect ? one(CHEERS) + ' ' + msg : msg, perfect ? 'good' : 'warm');
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="next"]')); }, 60);
    }

    function startRound() {
      cfg = RG_ROUNDS[idx];
      if (!cfg) return finish();
      pattern = rangoliPattern(cfg);
      mine = {}; attempt = 1; peeks = 0; resume = null;
      ref.mark(idx);
      showPhase();
    }

    function finish() {
      if (finished) return;
      ref.mark(RG_ROUNDS.length, 'end');
      ref.say('');
      ref.stage.innerHTML =
        '<div class="mela-done">' +
          '<div class="mela-art">' + (motifHTML('lotus') || mascotHTML('happy', 100)) + '</div>' +
          '<h3>' + esc(one(CHEERS)) + '</h3>' +
          '<p>Three rangolis drawn from memory. Every one of them was a mirror — that is what made them rememberable.</p>' +
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

    function toggle(d) {
      if (phase !== 'draw' || !d) return;
      var k = d.getAttribute('data-k');
      if (mine[k]) { delete mine[k]; d.className = 'mela-dot'; d.setAttribute('aria-pressed', 'false'); }
      else { mine[k] = 1; d.className = 'mela-dot mine'; d.setAttribute('aria-pressed', 'true'); }
      countLine();
    }

    function moveDot(from, dr, dc) {
      var p = (from.getAttribute('data-k') || '0,0').split(',');
      var r = Math.min(cfg.n - 1, Math.max(0, parseInt(p[0], 10) + dr));
      var c = Math.min(cfg.n - 1, Math.max(0, parseInt(p[1], 10) + dc));
      var next = dot(r + ',' + c);
      if (!next) return;
      var ds = allDots();
      for (var i = 0; i < ds.length; i++) ds[i].setAttribute('tabindex', '-1');
      next.setAttribute('tabindex', '0');
      focusSoft(next);
    }

    function bail(win) {
      if (finished) return;
      finished = true;
      sc.kill();
      if (typeof done === 'function') done({ win: !!win, score: score, kauris: kauris });
    }

    sc.on(ref.stage, 'click', function (e) {
      var t = e.target;
      var d = t.closest ? t.closest('.mela-dot') : null;
      if (d) { toggle(d); return; }
      var go = t.closest ? t.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'ready') { drawPhase(); }
      else if (what === 'check') { checkPhase(); }
      else if (what === 'peek') { peeks++; peekPhase(); }
      else if (what === 'retry') { attempt++; mine = {}; peeks++; peekPhase(); }
      else if (what === 'next') { idx++; startRound(); }
      else if (what === 'again') { idx = 0; score = 0; kauris = 0; startRound(); }
      else if (what === 'out') { bail(true); }
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead || !ref.stage) return;
      var t = e.target;
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

    startRound();
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

  function stateData() {
    var src = W.IND_GEO;
    if (src && src.length) {
      var out = [], i;
      for (i = 0; i < src.length; i++) {
        var s = src[i];
        if (!s || !s.name || !s.capital) continue;
        var clues = s.clues || (s.fact ? [s.fact] : []);
        if (!clues.length) continue;
        out.push({ code: s.code || '', name: s.name, capital: s.capital,
                   capQ: s.capQ !== false, clues: clues });
      }
      if (out.length >= 6) return out;
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
          artHTML: blankMap(),
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
    { id: 'rangoli', name: 'Rangoli Rush', icon: 'star', minutes: 3,
      blurb: 'A rangoli flashes on the dot grid, then blows away. Draw it back — every pattern is a mirror, so remember half.',
      engine: rangoli },
    { id: 'statehunt', name: 'State Hunt', icon: 'map', minutes: 4,
      blurb: 'A capital, a fort, a rhino, a mountain. Which state is it? Six stops on a yatra across India.',
      engine: statehunt },
    { id: 'festival', name: 'Festival Frenzy', icon: 'lamp', minutes: 4,
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
