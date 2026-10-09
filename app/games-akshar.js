/* Bizzing India — PLAY · Akshar, letters in the family's own script (games spec §5.2; docs/32).

   A child reads and builds syllables in THEIR FAMILY'S script. It is never "Hindi = Indian":
   the family's tongue (data-tongue.js → its Bhasha pack) is the chip already chosen when the
   game opens, and Hindi is the default only when no other tongue is set (CLAUDE.md rule 8).

     L1 Suno aur Chuno  hear a letter, pick it from three — all large, in the script
     L2 Barakhadi       a consonant and a sound: put the right vowel sign on it
     L3 Shabd Banao     hear a word from the pack's own list; build it from syllable tiles
     L4 Jodakshar       two letters: which is the two of them joined? (the script's own conjuncts)
     L5 Likho           trace it — ONLY where likhna.js can draw the guide (Devanagari today);
                        no stroke order is invented for any script

   DATA: every letter, vowel sign, conjunct and word comes from the Bhasha script modules and
   packs (bhasha.js, data-bhasha-*.js) at run time; tracing is likhna.js. Nothing is typed here.

   THE RENDERING RULE (spec §5.2, critical). Every syllable or word a child SEES is one shaped
   text string — a single text node in an element carrying the language's `lang` (and
   dir="rtl" for Urdu), set in the script's real face by app.css's :lang() rules. The tiles are
   input only; the display is always shaped text, so the shirorekha stays unbroken, ि sits
   before its consonant and Tamil vowel signs reorder. Nothing here sets letter-spacing.
   The target is never on screen while it is being built: only its sound and its roman name.

   REVIEW: Devanagari is released. Every other script opens only in tester mode (?tester=1)
   until a native reader has checked its tiles and audio — the gate is in this engine.

   Contract: docs/32. One answer() per item at its first check; the host plays right/wrong. */
(function () {
  'use strict';
  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document;

  var CSS = [
    '.ak{--ak-slate:#26332f;--ak-slate2:#1c2623;--ak-frame:#9a6a3c;--ak-frame2:#6f4524;--ak-chalk:#f6f3e7;--ak-chalk2:#c9d3cc;--ak-tile:#fffaf0;--ak-tink:#2a1e08;',
    'position:relative;isolation:isolate;border-radius:var(--radius-xl,22px);padding:clamp(14px,2.6vw,28px);min-height:min(78vh,720px);display:flex;flex-direction:column;gap:14px;',
    'background:radial-gradient(130% 90% at 50% 10%,var(--ak-slate) 0%,var(--ak-slate2) 100%);color:var(--ak-chalk);',
    'box-shadow:inset 0 0 0 10px var(--ak-frame),inset 0 0 0 13px var(--ak-frame2),var(--shadow-lg);font-family:var(--body);-webkit-tap-highlight-color:transparent}',
    '.ak.leaf{--ak-slate:#e9cf93;--ak-slate2:#d8b46c;--ak-frame:#7a5426;--ak-frame2:#53360f;--ak-chalk:#2b1a07;--ak-chalk2:#5d4320;',
    'background:repeating-linear-gradient(180deg,transparent 0 46px,rgba(90,60,20,.16) 46px 48px),radial-gradient(130% 90% at 50% 10%,var(--ak-slate),var(--ak-slate2))}',
    '[data-mode="night"] .ak{--ak-slate:#1a2421;--ak-slate2:#111816;--ak-frame:#5e4128;--ak-frame2:#3e2a18}',
    '[data-mode="night"] .ak.leaf{--ak-slate:#5a4523;--ak-slate2:#3f3018;--ak-chalk:#f6ead0;--ak-chalk2:#d7c49c}',
    '.ak-head{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;text-align:center;padding-top:4px}',
    '.ak-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;border:1px solid currentColor;font:700 13px/1.3 var(--body);opacity:.92}',
    '.ak-mode{font:800 clamp(18px,2.4vw,24px)/1.2 var(--display);margin:0;color:var(--ak-chalk)}',
    '.ak-step{font:600 13px var(--body);color:var(--ak-chalk2)}',
    '.ak-board{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;width:100%;max-width:880px;margin:0 auto}',
    '.ak-q{text-align:center;font:700 clamp(17px,2.2vw,21px)/1.4 var(--display);margin:0;color:var(--ak-chalk)}',
    '.ak-q small{display:block;font:500 14px/1.5 var(--body);color:var(--ak-chalk2)}',
    /* the big shaped display: ONE text node, its lang on the same element */
    '.ak-show{min-width:min(320px,80vw);min-height:150px;display:flex;align-items:center;justify-content:center;padding:6px 26px;border-radius:20px;border:3px dashed var(--ak-chalk2);text-align:center}',
    '.ak-show.on{border-style:solid;border-color:var(--ak-chalk)}',
    '.ak-show.drop{border-color:#ffd77a;box-shadow:0 0 0 4px rgba(255,215,122,.3)}',
    '.ak-glyph{font-size:clamp(64px,13vw,104px);line-height:1.7;color:var(--ak-chalk);font-weight:600;white-space:nowrap}',
    '.ak-word{font-size:clamp(44px,9vw,72px);line-height:1.8;color:var(--ak-chalk);font-weight:600;white-space:nowrap}',
    '.ak-empty{font:600 15px/1.5 var(--body);color:var(--ak-chalk2)}',
    '.ak-tiles{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:720px}',
    '.ak-tile{min-width:72px;min-height:72px;padding:4px 14px;border-radius:16px;border:2px solid rgba(0,0,0,.18);background:var(--ak-tile);color:var(--ak-tink);cursor:pointer;',
    'display:inline-flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 0 rgba(0,0,0,.25);touch-action:none;user-select:none;-webkit-user-select:none}',
    '.ak-tile .ak-t{font-size:38px;line-height:1.7;font-weight:600}',
    '.ak-tile .ak-k{font:800 12px var(--body);color:#7a6a50;align-self:flex-start;margin-top:6px}',
    '.ak-tile.big{min-width:110px;min-height:110px}.ak-tile.big .ak-t{font-size:64px}',
    '.ak [lang="ur"].ak-t,.ak [lang="ur"].ak-glyph,.ak [lang="ur"].ak-word{line-height:2.3}',
    '@media (min-width:721px){.ak-tile.big{min-width:140px;min-height:140px}.ak-tile.big .ak-t{font-size:80px}.ak-tile{min-width:84px;min-height:84px}.ak-tile .ak-t{font-size:44px}}',
    '.ak-tile.used{opacity:.3}',
    '.ak-tile.sel{outline:4px solid #ffd77a;outline-offset:2px}',
    '.ak-tile.ok{box-shadow:0 0 0 4px var(--good)}',
    '.ak-tile:focus-visible,.ak-btn:focus-visible,.ak-chip:focus-visible,.ak-slot:focus-visible{outline:3px solid #ffd77a;outline-offset:3px}',
    '.ak-slots{display:flex;gap:10px;justify-content:center}',
    '.ak-slot{width:64px;height:12px;border-radius:999px;background:var(--ak-chalk2);opacity:.45;border:0}',
    '.ak-slot.full{opacity:1;background:var(--ak-chalk)}',
    '.ak-plus{font:800 34px var(--body);color:var(--ak-chalk2)}',
    '.ak-sum{display:flex;align-items:center;gap:14px;justify-content:center;flex-wrap:wrap}',
    '.ak-act{position:sticky;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:2;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}',
    '@media (max-width:720px){.ak-act{bottom:calc(78px + env(safe-area-inset-bottom,0px))}}',
    '.ak-btn{min-height:48px;min-width:120px;padding:10px 22px;border-radius:999px;border:2px solid #ffd77a;background:#ffd77a;color:#2a1e08;font:800 16px var(--body);cursor:pointer;box-shadow:0 4px 0 rgba(0,0,0,.25)}',
    '.ak-btn.ghost{background:transparent;color:var(--ak-chalk);border-color:var(--ak-chalk2);box-shadow:none}',
    '.ak-btn:disabled{opacity:.45;cursor:default}',
    '.ak-hint{text-align:center;font:500 12.5px/1.5 var(--body);color:var(--ak-chalk2);margin:0;max-width:60ch}',
    '.ak-ok{text-align:center;font:800 18px var(--display);color:#9ff0c4;margin:0}',
    '.ak.leaf .ak-ok{color:#1b6b43}',
    '.ak-chips{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:760px}',
    '.ak-chip{min-height:56px;padding:6px 16px;border-radius:999px;border:2px solid var(--ak-chalk2);background:transparent;color:var(--ak-chalk);cursor:pointer;display:inline-flex;align-items:center;gap:8px;font:600 14px var(--body)}',
    '.ak-chip .ak-cn{font-size:22px;line-height:1.7}',
    '.ak-chip.on{background:var(--ak-chalk);color:var(--ak-slate2);border-color:var(--ak-chalk)}',
    '.ak-chip .ak-lock{font:700 11px var(--body);opacity:.8}',
    '.ak-note{max-width:560px;text-align:center;font:500 14.5px/1.6 var(--body);color:var(--ak-chalk);background:rgba(0,0,0,.18);border-radius:14px;padding:10px 14px;margin:0}',
    '.ak.leaf .ak-note{background:rgba(255,255,255,.35)}',
    '.ak .gm-miss{max-width:600px;width:100%;background:var(--card);color:var(--text);border:2px solid var(--accent2);border-radius:var(--radius-lg,18px);padding:14px 18px;text-align:center;font:500 15px/1.6 var(--body);box-shadow:var(--shadow-lg)}',
    '.ak .gm-miss b{font:800 18px var(--display)}',
    '.ak .gm-ans{display:block;margin:4px 0}',
    '.ak .gm-ans [lang]{font-size:44px;line-height:1.8;font-weight:600}',
    '.ak .gm-teach{margin:4px 0 10px;color:var(--text2);font-size:14px}',
    '.ak .gm-aage{min-height:48px;padding:10px 26px;border-radius:999px;border:2px solid var(--accent);background:var(--accent);color:#fff;font:800 16px var(--body);cursor:pointer}',
    '.ak-trace{position:relative;width:min(360px,82vw);aspect-ratio:1;border-radius:18px;background:rgba(255,255,255,.92);overflow:hidden}',
    '.ak-trace canvas{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;touch-action:none}',
    '.ak-trace .tpen{position:absolute;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;border:2px solid var(--accent);pointer-events:none}',
    '.ak-trace .tpen.on{background:var(--accent)}',
    '.ak-drag{position:fixed;z-index:9999;pointer-events:none;opacity:.92}',
    '@media (max-width:640px){.ak-tile{min-width:64px;min-height:64px}.ak-tile .ak-t{font-size:32px}.ak-tile.big{min-width:96px;min-height:96px}.ak-tile.big .ak-t{font-size:54px}.ak-show{min-height:120px}}',
    '@media (prefers-reduced-motion:reduce){.ak *{transition:none!important;animation:none!important}}'
  ].join('');
  function injectCSS() {
    if (!D || D.getElementById('ak-css')) return;
    var s = D.createElement('style'); s.id = 'ak-css'; s.textContent = CSS;
    (D.head || D.documentElement).appendChild(s);
  }

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function tester() { try { return !!(W.IND_STORE && W.IND_STORE.loadDevice('tester', false) === true); } catch (e) { return false; } }
  function tap() { try { if (W.IND_SFX) W.IND_SFX.play('tap'); } catch (e) {} }
  function focusSoft(el) { if (el && el.focus) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } } }
  function muted() { try { return !!(W.IND_SFX_MUTED && W.IND_SFX_MUTED()); } catch (e) { return false; } }

  /* ------------------------------------------------------------ scripts and packs */
  var ORDER = ['hi', 'mr', 'pa', 'bn', 'gu', 'ta', 'te', 'kn', 'ur'];
  function packs() {
    var P = W.IND_PACKS || {}, out = [], k;
    ORDER.forEach(function (id) { if (P[id]) out.push(P[id]); });
    for (k in P) if (P.hasOwnProperty(k) && ORDER.indexOf(k) < 0) out.push(P[k]);
    return out;
  }
  function scriptOf(p) { return p && W.IND_SCRIPTS ? W.IND_SCRIPTS[p.script] : null; }
  function isDeva(p) { return !!(p && /^devanagari/.test(p.script)); }
  /* released: Devanagari. Everything else waits for a native reader (tester mode only). */
  function open(p) { return isDeva(p) || tester(); }
  function rtl(p) { var s = scriptOf(p); return !!(s && s.direction === 'rtl'); }
  /* likhna.js draws its guide in the Devanagari face only — that is the whole of the stroke
     data this app has, so tracing exists for Devanagari and for nothing else (A4) */
  function canTrace(p) { return isDeva(p) && !!(W.IND_LIKHNA && W.IND_LIKHNA.mount); }
  /* the family's tongue → its pack. null when the tongue has no pack (Malayalam, Odia…) */
  function tonguePack(opts) {
    var tid = (opts && opts.tongue) || (W.BI && W.BI.S && W.BI.S.tongue) || null;
    if (!tid) return { set: false, pack: null };
    var t = W.IND_TONGUE && W.IND_TONGUE.get ? W.IND_TONGUE.get(tid) : null;
    var pid = (t && t.pack) || tid;
    return { set: true, tongue: t, pack: (W.IND_PACKS || {})[pid] ? pid : null };
  }
  function lang(p) { return p.id; }
  function textEl(p, txt, cls, tag) {
    /* THE rendering rule: one element, one text node, its lang (and dir) on it */
    return '<' + (tag || 'span') + ' class="' + cls + '" lang="' + esc(lang(p)) + '"' + (rtl(p) ? ' dir="rtl"' : '') + ' data-ak-text>' + esc(txt) + '</' + (tag || 'span') + '>';
  }
  function hasVoice(k) { return !!k && (!W.IND_VOICE || W.IND_VOICE.indexOf(k) >= 0); }

  var audioEl = null;
  function hush() { if (audioEl) { try { audioEl.pause(); } catch (e) {} audioEl = null; } try { if (W.speechSynthesis) W.speechSynthesis.cancel(); } catch (e) {} }
  function say(key, text, p) {
    if (muted()) return;
    hush();
    function tts() {
      try {
        if (!text || !W.speechSynthesis || !W.SpeechSynthesisUtterance) return;
        var u = new W.SpeechSynthesisUtterance(text); u.lang = lang(p) + '-IN'; u.rate = 0.8; W.speechSynthesis.speak(u);
      } catch (e) {}
    }
    /* the pack's own voice first ('hi/l-13' → 'mr/l-13' for Marathi), then the script's */
    var cands = [];
    if (key) { if (W.IND_BHASHA && W.IND_BHASHA.audioFor) cands.push(W.IND_BHASHA.audioFor(key, p)); cands.push(key); }
    key = null;
    for (var i = 0; i < cands.length; i++) if (hasVoice(cands[i])) { key = cands[i]; break; }
    if (!key) return tts();
    try {
      var a = new W.Audio('voice/' + key + '.mp3?v=' + (W.IND_BUILD || '1'));
      audioEl = a; a.onerror = tts;
      var pr = a.play(); if (pr && pr.catch) pr.catch(function () {});
    } catch (e) { tts(); }
  }

  /* ------------------------------------------------------------ item builders */
  var VOWELISH = /^[aeiouāīūṛ]/i;
  function letters(s) {
    return (s.vowels || []).filter(function (v) { return !v.sign; }).concat(s.consonants || [])
      .filter(function (x) { return x && x.char && x.name; });
  }
  function consonantsFor(s) {
    return (s.consonants || []).filter(function (c) { return c.r && !VOWELISH.test(c.r) && !/[ʿ’']/.test(c.r); });
  }
  function matrasFor(s) {
    return (s.matras || []).filter(function (m) { return m.grid !== false && m.vowel && VOWELISH.test(m.vowel); });
  }
  function words(p) {
    var B = W.IND_BHASHA;
    return (p.lexicon || []).filter(function (w) {
      if (!w.word || /\s|[-–—]/.test(w.word) || !w.en) return false;
      var c = B.clusters(w.word); return c.length >= 2 && c.length <= 3;
    });
  }
  function gloss(en) { return String(en).split(/\s[—–-]\s|\s\(/)[0]; }

  function build(L, p, n) {
    var s = scriptOf(p), out = [], i;
    if (!s) return out;
    if (L === 1) {
      var ls = letters(s);
      shuffle(ls).slice(0, n).forEach(function (t) {
        var others = shuffle(ls.filter(function (x) { return x.char !== t.char; })).slice(0, 2);
        var o = shuffle([t].concat(others));
        out.push({ kind: 'hear', target: t, options: o, answer: o.indexOf(t), id: 'ak1:' + p.id + ':' + t.char });
      });
    } else if (L === 2) {
      var cs = consonantsFor(s).slice(0, 25), ms = matrasFor(s);
      if (ms.length < 3) return out;
      for (i = 0; i < n; i++) {
        var c = cs[Math.floor(Math.random() * cs.length)], m = ms[Math.floor(Math.random() * ms.length)];
        var tiles = shuffle([m].concat(shuffle(ms.filter(function (x) { return x.sign !== m.sign; })).slice(0, Math.min(3, ms.length - 1))));
        out.push({ kind: 'matra', cons: c, target: m, tiles: tiles, roman: c.r + m.vowel,
          audio: s.audioNs + '/bk-' + c.name + '-' + m.name, syll: c.char + m.sign, id: 'ak2:' + p.id + ':' + c.char + m.sign });
      }
    } else if (L === 3) {
      var ws = words(p), B = W.IND_BHASHA, pool = [];
      ws.forEach(function (w) { B.clusters(w.word).forEach(function (cl) { if (pool.indexOf(cl) < 0) pool.push(cl); }); });
      shuffle(ws.slice(0, 200)).slice(0, n).forEach(function (w) {
        var parts = B.clusters(w.word);
        var extra = shuffle(pool.filter(function (cl) { return parts.indexOf(cl) < 0; })).slice(0, 2);
        out.push({ kind: 'word', word: w, parts: parts, tiles: shuffle(parts.concat(extra)), id: 'ak3:' + p.id + ':' + w.word });
      });
    } else if (L === 4) {
      var cj = (s.hardConjuncts || []).filter(function (x) { return x.char && x.parts && x.parts.length === 2; });
      if (cj.length < 3) return out;
      shuffle(cj).slice(0, n).forEach(function (t) {
        var o = shuffle([t].concat(shuffle(cj.filter(function (x) { return x.char !== t.char && x.parts.join() !== t.parts.join(); })).slice(0, 2)));
        out.push({ kind: 'join', target: t, options: o, answer: o.indexOf(t), id: 'ak4:' + p.id + ':' + t.char });
      });
    } else if (L === 5) {
      if (!canTrace(p)) return out;
      shuffle(letters(s)).slice(0, n).forEach(function (t) { out.push({ kind: 'trace', target: t, id: 'ak5:' + p.id + ':' + t.char }); });
    }
    return out;
  }

  var MODES = ['Suno aur Chuno', 'Barakhadi', 'Shabd Banao', 'Jodakshar', 'Likho'];
  var MODE_EN = ['hear it, pick it', 'put the vowel sign on', 'build the word', 'join two letters', 'trace it'];
  var ROUND = [8, 8, 6, 6, 4];
  var SOUTH = { ta: 1, te: 1, kn: 1, ml: 1 };

  function engine(host, opts, done) {
    injectCSS();
    opts = opts || {};
    var level = Math.max(1, Math.min(5, parseInt(opts.level, 10) || 1));
    var report = typeof opts.answer === 'function' ? opts.answer : function () {};
    var dead = false, finished = false, asked = 0, ftr = 0, items = [], k = 0, state = null, offs = [], rafs = [], traceOff = null;
    var tp = tonguePack(opts);
    /* A5: the family's tongue leads; Hindi only when no tongue is set at all */
    var selId = tp.set ? tp.pack : 'hi';
    if (opts.scope && opts.scope.set && opts.scope.set.length && (W.IND_PACKS || {})[opts.scope.set[0]]) selId = opts.scope.set[0];
    if (opts.scope && opts.scope.mode && MODES.map(function (m) { return m.toLowerCase(); }).indexOf(String(opts.scope.mode).toLowerCase()) >= 0)
      level = MODES.map(function (m) { return m.toLowerCase(); }).indexOf(String(opts.scope.mode).toLowerCase()) + 1;
    var ST = host.__akState = { level: level, phase: 'intro', pack: selId, item: null };
    var P = null;

    function on(t, ev, fn, o) { t.addEventListener(ev, fn, o || false); offs.push(function () { t.removeEventListener(ev, fn, o || false); }); }
    function wait(ms, fn) {
      var acc = 0, last = null;
      function step(t) {
        if (dead) return;
        if (D.hidden) { last = null; rafs.push(W.requestAnimationFrame(step)); return; }
        if (last != null) acc += Math.min(100, t - last);
        last = t; if (acc >= ms) { fn(); return; }
        rafs.push(W.requestAnimationFrame(step));
      }
      rafs.push(W.requestAnimationFrame(step));
    }

    host.innerHTML = '<div class="ak" data-level="' + level + '"><div class="ak-head"><span class="ak-badge">Bhasha · Akshar</span>' +
      '<h2 class="ak-mode">' + esc(MODES[level - 1]) + ' <span class="ak-step" style="font-size:14px">· ' + esc(MODE_EN[level - 1]) + '</span></h2>' +
      '<span class="ak-step ak-count" aria-live="polite"></span></div><div class="ak-board"></div></div>';
    var root = host.querySelector('.ak'), board = root.querySelector('.ak-board'), stepEl = root.querySelector('.ak-count');

    function judge(it, right) {
      if (it.reported) return;
      it.reported = true; asked++; if (right) ftr++;
      try { report({ id: it.id, right: !!right, firstTry: true, skill: 'akshar.' + ['hear', 'barakhadi', 'word', 'conjunct', 'trace'][level - 1], objective: null }); } catch (e) {}
    }
    function finish() {
      if (finished) return;
      finished = true;
      var r = asked ? ftr / asked : 0;
      var next = !asked ? level : r >= 0.8 ? Math.min(5, level + 1) : r >= 0.5 ? level : Math.max(1, level - 1);
      cleanup();
      if (typeof done === 'function') done({ win: asked > 0 && r >= 0.5, score: ftr, asked: asked, firstTryRight: ftr, level: level, levelNext: next });
    }

    /* ----------------------------------------------------------------- intro */
    function intro() {
      ST.phase = 'intro'; stepEl.textContent = '';
      var ps = packs(), cur = (W.IND_PACKS || {})[selId] || null;
      root.classList.toggle('leaf', !!(cur && SOUTH[cur.id]));
      var chips = ps.map(function (p) {
        return '<button type="button" class="ak-chip' + (p.id === selId ? ' on' : '') + '" data-pack="' + esc(p.id) + '" aria-pressed="' + (p.id === selId) + '">' +
          textEl(p, (p.name && p.name.native) || p.id, 'ak-cn') + '<span>' + esc((p.name && p.name.en) || p.id) + '</span>' +
          (open(p) ? '' : '<span class="ak-lock">· with its reader</span>') + '</button>';
      }).join('');
      var note = '';
      if (tp.set && !tp.pack) note = 'Your family\'s language does not have its letters in the app yet. Pick any script to play — or ask your family which one they read.';
      else if (cur && !open(cur)) note = esc(cur.name.en) + ' letters open here once a native ' + esc(cur.name.en) + ' reader has checked them. Until then, choose another script to play — or come back soon.';
      else if (cur && level === 5 && !canTrace(cur)) note = 'Tracing needs the shape of each letter, and the app has that for Devanagari only. For ' + esc(cur.name.en) + ', play Jodakshar or Shabd Banao instead.';
      else if (cur && !build(level, cur, 1).length) note = 'The ' + esc(cur.name.en) + ' pack does not hold enough for ' + esc(MODES[level - 1]) + ' yet. Try another level.';
      var can = !!(cur && open(cur) && !note);
      board.innerHTML = '<p class="ak-q">Which letters shall we play with?<small>' + (tp.pack ? 'Your family\'s language is chosen.' : 'Choose the script your family reads.') + '</small></p>' +
        '<div class="ak-chips" role="group" aria-label="Scripts">' + chips + '</div>' +
        (note ? '<p class="ak-note" role="status">' + note + '</p>' : '') +
        '<div class="ak-act">' + (level === 5 && cur && open(cur) && !canTrace(cur) ? '<button class="ak-btn ghost" data-ak="lvl4">Play Jodakshar</button>' : '') +
        '<button class="ak-btn" data-ak="start"' + (can ? '' : ' disabled') + '>Shuru karo</button></div>';
    }
    function start() {
      P = (W.IND_PACKS || {})[selId];
      if (!P || !open(P)) return;
      items = build(level, P, ROUND[level - 1]);
      if (!items.length) { intro(); return; }
      ST.pack = P.id;
      root.classList.toggle('leaf', !!SOUTH[P.id]);
      k = 0; show();
    }

    /* ------------------------------------------------------------------ show */
    function show() {
      if (dead) return;
      var it = items[k]; state = { item: it, placed: [] };
      ST.phase = 'ask'; ST.item = it;
      stepEl.textContent = (k + 1) + ' of ' + items.length;
      var dirA = rtl(P) ? ' dir="rtl"' : '';
      if (it.kind === 'hear') {
        board.innerHTML = '<p class="ak-q">Listen — which one is it?<small>It says “' + esc(it.target.name) + '”.</small></p>' +
          '<button class="ak-btn ghost" data-ak="hear">🔊 Hear it again</button>' +
          '<div class="ak-tiles" role="group">' + it.options.map(function (o, i) {
            return '<button type="button" class="ak-tile big" data-opt="' + i + '"><span class="ak-k">' + (i + 1) + '</span>' + textEl(P, o.char, 'ak-t') + '</button>';
          }).join('') + '</div><p class="ak-hint">Tap the letter — or press 1, 2 or 3. R plays the sound again.</p>';
        wait(250, function () { say(it.target.audio, it.target.char, P); });
      } else if (it.kind === 'matra') {
        board.innerHTML = '<p class="ak-q">Make the sound “' + esc(it.roman) + '”.<small>Put the right vowel sign on the letter.</small></p>' +
          '<button class="ak-btn ghost" data-ak="hear">🔊 Hear it</button>' +
          '<div class="ak-show" data-drop="1" aria-live="polite">' + textEl(P, it.cons.char, 'ak-glyph') + '</div>' +
          '<div class="ak-tiles" role="group" aria-label="Vowel signs">' + it.tiles.map(function (m, i) {
            return '<button type="button" class="ak-tile" data-tile="' + i + '" aria-label="vowel sign ' + esc(m.name) + '"><span class="ak-k">' + (i + 1) + '</span>' + textEl(P, '◌' + m.sign, 'ak-t') + '</button>';
          }).join('') + '</div><div class="ak-act"><button class="ak-btn" data-ak="check" disabled>Check</button></div>' +
          '<p class="ak-hint">Drag a sign onto the letter, or tap it. Keys: 1–' + it.tiles.length + ' choose, Enter checks.</p>';
        wait(250, function () { say(it.audio, it.syll, P); });
      } else if (it.kind === 'word') {
        board.innerHTML = '<p class="ak-q">Build the word for “' + esc(gloss(it.word.en)) + '”.<small>Listen, then tap the pieces in order.</small></p>' +
          '<button class="ak-btn ghost" data-ak="hear">🔊 Hear it</button>' +
          '<div class="ak-show" data-drop="1" aria-live="polite"><span class="ak-empty">Your word goes here</span></div>' +
          '<div class="ak-slots"' + dirA + ' aria-hidden="true">' + it.parts.map(function () { return '<span class="ak-slot"></span>'; }).join('') + '</div>' +
          '<div class="ak-tiles" role="group" aria-label="Pieces"' + dirA + '>' + it.tiles.map(function (t, i) {
            return '<button type="button" class="ak-tile" data-tile="' + i + '"><span class="ak-k">' + (i + 1) + '</span>' + textEl(P, t, 'ak-t') + '</button>';
          }).join('') + '</div><div class="ak-act"><button class="ak-btn ghost" data-ak="back">Undo</button><button class="ak-btn" data-ak="check" disabled>Check</button></div>' +
          '<p class="ak-hint">Tap or drag the pieces in order. Keys: number keys place a piece, Backspace takes one back, Enter checks.</p>';
        wait(250, function () { say(it.word.audio, it.word.word, P); });
      } else if (it.kind === 'join') {
        board.innerHTML = '<p class="ak-q">These two letters join into one. Which is it?</p>' +
          '<div class="ak-sum">' + textEl(P, it.target.parts[0], 'ak-glyph') + '<span class="ak-plus" aria-hidden="true">+</span>' + textEl(P, it.target.parts[1], 'ak-glyph') + '</div>' +
          '<div class="ak-tiles" role="group">' + it.options.map(function (o, i) {
            return '<button type="button" class="ak-tile big" data-opt="' + i + '"><span class="ak-k">' + (i + 1) + '</span>' + textEl(P, o.char, 'ak-t') + '</button>';
          }).join('') + '</div><p class="ak-hint">Tap the joined letter — or press 1, 2 or 3.</p>';
      } else if (it.kind === 'trace') {
        board.innerHTML = '<p class="ak-q">Trace the letter.<small>It says “' + esc(it.target.name) + '”.</small></p>' +
          '<div class="ak-trace"><canvas id="tGuide" width="512" height="512"></canvas><canvas id="tInk" width="512" height="512" tabindex="0" role="application" aria-label="Tracing area"></canvas></div>' +
          '<p id="tSay" class="ak-hint">Trace with a finger, or use the arrow keys and the space bar.</p>' +
          '<div class="ak-act"><button class="ak-btn ghost" data-ak="clear">Clear</button><button class="ak-btn" data-ak="check">Check it</button></div>' +
          '<p class="ak-hint">This checks the shape of your letter, not the order you drew the strokes in. Devanagari has a proper order — a grown-up can show you that bit.</p>';
        try { traceOff = W.IND_LIKHNA.mount(it.target); } catch (e) { traceOff = null; }
        wait(250, function () { say(it.target.audio, it.target.char, P); });
      }
      focusSoft(board.querySelector('[data-opt],[data-tile],#tInk'));
    }

    /* ----------------------------------------------------------- feedback */
    function rightBeat(html) {
      ST.phase = 'right';
      var act = board.querySelector('.ak-act'); if (act) act.innerHTML = '';
      board.insertAdjacentHTML('beforeend', '<p class="ak-ok" role="status">Sahi! ' + (html || '') + '</p>');
      wait(1100, next);
    }
    function miss(ansHTML, teach, audio) {
      ST.phase = 'miss';
      var act = board.querySelector('.ak-act'); if (act) act.innerHTML = '';
      board.insertAdjacentHTML('beforeend', '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">' + ansHTML + '</span>' +
        '<p class="gm-teach">' + teach + '</p><button class="btn gm-aage" data-gm="aage">Aage →</button></div>');
      if (audio) wait(300, function () { say(audio[0], audio[1], P); });
      var mc = board.querySelector('.gm-miss'); if (mc && mc.scrollIntoView) { try { mc.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch (e) {} }
      focusSoft(board.querySelector('.gm-aage'));
    }
    function next() {
      if (traceOff) { try { traceOff(); } catch (e) {} traceOff = null; }
      hush(); k++;
      if (k >= items.length) finish(); else show();
    }

    function pickOpt(i) {
      var it = state && state.item; if (!it || it.reported || ST.phase !== 'ask' || !it.options || !it.options[i]) return;
      var ok = i === it.answer;
      judge(it, ok);
      [].forEach.call(board.querySelectorAll('[data-opt]'), function (el, j) { el.disabled = true; if (j === it.answer) el.classList.add('ok'); });
      if (it.kind === 'hear') {
        if (ok) rightBeat(textEl(P, it.target.char, '') + ' says “' + esc(it.target.name) + '”.');
        else miss(textEl(P, it.target.char, ''), 'This letter says “' + esc(it.target.name) + '”. Listen once more.', [it.target.audio, it.target.char]);
      } else {
        var t = it.target, inWord = t.word ? ' — you meet it in ' + textEl(P, t.word, '') : '';
        if (ok) rightBeat(textEl(P, t.parts[0], '') + ' + ' + textEl(P, t.parts[1], '') + ' = ' + textEl(P, t.char, '') + inWord);
        else miss(textEl(P, t.char, ''), textEl(P, t.parts[0], '') + ' + ' + textEl(P, t.parts[1], '') + ' join into ' + textEl(P, t.char, '') + ' (“' + esc(t.name) + '”)' + inWord + '.', [t.audio, t.char]);
      }
    }
    /* the built display — always ONE text node, set fresh, never tiles glued together */
    function paintBuilt() {
      var it = state.item, show = board.querySelector('.ak-show'); if (!show) return;
      if (it.kind === 'matra') {
        var m = state.placed[0];
        show.innerHTML = textEl(P, it.cons.char + (m ? m.sign : ''), 'ak-glyph');
        show.classList.toggle('on', !!m);
      } else {
        var txt = state.placed.map(function (i) { return it.tiles[i]; }).join('');
        show.innerHTML = txt ? textEl(P, txt, 'ak-word') : '<span class="ak-empty">Your word goes here</span>';
        show.classList.toggle('on', state.placed.length === it.parts.length);
        [].forEach.call(board.querySelectorAll('.ak-slot'), function (el, j) { el.classList.toggle('full', j < state.placed.length); });
        [].forEach.call(board.querySelectorAll('[data-tile]'), function (el, j) { el.classList.toggle('used', state.placed.indexOf(j) >= 0); el.disabled = state.placed.indexOf(j) >= 0; });
      }
      var ck = board.querySelector('[data-ak="check"]');
      if (ck) ck.disabled = it.kind === 'matra' ? !state.placed.length : state.placed.length !== it.parts.length;
    }
    function placeTile(i) {
      var it = state && state.item; if (!it || ST.phase !== 'ask' || !it.tiles || it.tiles[i] == null) return;
      if (it.kind === 'matra') {
        state.placed = [it.tiles[i]];
        [].forEach.call(board.querySelectorAll('[data-tile]'), function (el, j) { el.classList.toggle('sel', j === i); });
      } else {
        if (state.placed.indexOf(i) >= 0 || state.placed.length >= it.parts.length) return;
        state.placed.push(i);
      }
      tap(); paintBuilt();
    }
    function check() {
      var it = state && state.item; if (!it || ST.phase !== 'ask') return;
      if (it.kind === 'matra') {
        if (!state.placed.length) return;
        var ok = state.placed[0].sign === it.target.sign;
        judge(it, ok);
        if (ok) rightBeat(textEl(P, it.syll, '') + ' says “' + esc(it.roman) + '”.');
        else miss(textEl(P, it.syll, ''), textEl(P, it.cons.char, '') + ' with ' + textEl(P, '◌' + it.target.sign, '') + ' (' + esc(it.target.name) + ') says “' + esc(it.roman) + '”.', [it.audio, it.syll]);
      } else if (it.kind === 'word') {
        if (state.placed.length !== it.parts.length) return;
        var built = state.placed.map(function (i) { return it.tiles[i]; }).join('');
        var ok2 = built === it.word.word;
        judge(it, ok2);
        if (ok2) rightBeat(textEl(P, it.word.word, '') + ' · ' + esc(it.word.roman) + ' — “' + esc(gloss(it.word.en)) + '”');
        else miss(textEl(P, it.word.word, ''), esc(it.word.roman) + ' — “' + esc(gloss(it.word.en)) + '”. Its pieces, in order: ' + it.parts.map(function (x) { return textEl(P, x, ''); }).join(' · ') + '.', [it.word.audio, it.word.word]);
      } else if (it.kind === 'trace') {
        var res = null; try { res = W.IND_LIKHNA.check(); } catch (e) {}
        if (!res) return;   /* nothing drawn yet: likhna says so, nothing is judged */
        judge(it, res.pass);
        if (res.pass) rightBeat('That is the shape of ' + textEl(P, it.target.char, '') + '.');
        else miss(textEl(P, it.target.char, ''), (res.coverage < 0.72 ? 'Some of the letter was still uncovered — follow the whole grey shape.' : 'That went outside the letter a fair bit — try to stay on the grey.') + ' You can trace it again next time.');
      }
    }

    /* ------------------------------------------------------------ controls */
    var drag = null, dragMoved = false;
    function onClick(e) {
      var t = e.target;
      if (t.closest('[data-gm="aage"]')) { if (ST.phase === 'miss') next(); return; }
      if (dragMoved) { dragMoved = false; return; }
      var ch = t.closest('[data-pack]');
      if (ch && ST.phase === 'intro') { selId = ch.getAttribute('data-pack'); ST.pack = selId; tap(); intro(); focusSoft(board.querySelector('[data-pack="' + selId + '"]')); return; }
      var a = t.closest('[data-ak]');
      if (a) {
        var v = a.getAttribute('data-ak');
        if (v === 'start') start();
        else if (v === 'lvl4') { level = 4; ST.level = 4; root.querySelector('.ak-mode').innerHTML = esc(MODES[3]) + ' <span class="ak-step" style="font-size:14px">· ' + esc(MODE_EN[3]) + '</span>'; intro(); }
        else if (v === 'hear') { var it = state && state.item; if (it) { if (it.kind === 'hear') say(it.target.audio, it.target.char, P); else if (it.kind === 'matra') say(it.audio, it.syll, P); else if (it.kind === 'word') say(it.word.audio, it.word.word, P); } }
        else if (v === 'check') check();
        else if (v === 'back') { if (state && state.placed.length && ST.phase === 'ask') { state.placed.pop(); paintBuilt(); } }
        else if (v === 'clear') { try { W.IND_LIKHNA.clear(); } catch (e2) {} }
        return;
      }
      var op = t.closest('[data-opt]'); if (op) { pickOpt(+op.getAttribute('data-opt')); return; }
      var tl = t.closest('[data-tile]'); if (tl) { placeTile(+tl.getAttribute('data-tile')); return; }
    }
    function onDown(e) {
      if (ST.phase !== 'ask') return;
      var el = e.target.closest('[data-tile]'); if (!el || el.disabled) return;
      drag = { el: el, x: e.clientX, y: e.clientY, ghost: null };
    }
    function onMove(e) {
      if (!drag) return;
      if (!drag.ghost && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 8) {
        drag.ghost = drag.el.cloneNode(true); drag.ghost.classList.add('ak-drag'); D.body.appendChild(drag.ghost);
      }
      if (drag.ghost) {
        e.preventDefault();
        drag.ghost.style.left = (e.clientX - 36) + 'px'; drag.ghost.style.top = (e.clientY - 36) + 'px';
        var sh = board.querySelector('.ak-show'); if (sh) sh.classList.toggle('drop', overShow(e.clientX, e.clientY));
      }
    }
    function overShow(x, y) { var sh = board.querySelector('.ak-show'); if (!sh) return false; var r = sh.getBoundingClientRect(); return x >= r.left - 20 && x <= r.right + 20 && y >= r.top - 20 && y <= r.bottom + 20; }
    function onUp(e) {
      if (!drag) return;
      var d = drag; drag = null;
      if (!d.ghost) return;
      dragMoved = true; d.ghost.remove();
      var sh = board.querySelector('.ak-show'); if (sh) sh.classList.remove('drop');
      if (overShow(e.clientX, e.clientY)) placeTile(+d.el.getAttribute('data-tile'));
      W.setTimeout(function () { dragMoved = false; }, 0);
    }
    function onKey(e) {
      if (dead) return;
      if (!host.isConnected) { teardown(); return; }
      var key = e.key, it = state && state.item;
      if (ST.phase === 'miss') { if (key === 'Enter' || key === ' ') { e.preventDefault(); next(); } return; }
      if (ST.phase === 'intro') {
        if (/Arrow/.test(key)) {
          var cs = [].slice.call(board.querySelectorAll('[data-pack]')), ci = cs.indexOf(D.activeElement);
          e.preventDefault(); focusSoft(cs[ci < 0 ? 0 : (ci + (/Right|Down/.test(key) ? 1 : -1) + cs.length) % cs.length]);
        }
        return;
      }
      if (ST.phase !== 'ask' || !it) return;
      var ae = D.activeElement, onBtn = ae && ae.tagName === 'BUTTON' && root.contains(ae);
      if (/^[1-9]$/.test(key)) {
        var n = +key - 1;
        if (it.options) { e.preventDefault(); pickOpt(n); return; }
        if (it.tiles) { e.preventDefault(); placeTile(n); return; }
      }
      if ((key === 'r' || key === 'R') && it.kind !== 'join' && it.kind !== 'trace') { e.preventDefault(); var h = board.querySelector('[data-ak="hear"]'); if (h) h.click(); return; }
      if (key === 'Backspace' && it.kind === 'word') { e.preventDefault(); if (state.placed.length) { state.placed.pop(); paintBuilt(); } return; }
      if (key === 'Enter') {
        if (it.kind === 'trace') { if (!(onBtn)) { e.preventDefault(); check(); } return; }
        if (onBtn && ae.hasAttribute('data-tile')) return;   /* the button's own click places it */
        if (onBtn && !ae.hasAttribute('data-ak')) return;
        if (!onBtn && (it.kind === 'matra' || it.kind === 'word')) { e.preventDefault(); check(); }
        return;
      }
      if (/Arrow/.test(key) && it.kind !== 'trace') {
        var all = [].slice.call(board.querySelectorAll('[data-opt],[data-tile]:not(:disabled)')), ai = all.indexOf(ae);
        if (!all.length) return;
        e.preventDefault(); focusSoft(all[ai < 0 ? 0 : (ai + (/Right|Down/.test(key) ? 1 : -1) + all.length) % all.length]);
      }
    }
    on(root, 'click', onClick);
    on(root, 'pointerdown', onDown);
    on(W, 'pointermove', onMove, { passive: false });
    on(W, 'pointerup', onUp);
    on(D, 'keydown', onKey);
    intro();

    function cleanup() {
      dead = true; hush();
      if (traceOff) { try { traceOff(); } catch (e) {} traceOff = null; }
      offs.forEach(function (f) { try { f(); } catch (e) {} }); offs = [];
      rafs.forEach(function (id) { try { W.cancelAnimationFrame(id); } catch (e) {} });
      var g = D.querySelector('.ak-drag'); if (g) g.remove();
    }
    function teardown() { finished = true; cleanup(); }
    teardown.destroy = teardown;
    return teardown;
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
    id: 'akshar', name: 'Akshar', sub: 'build syllables in your family\'s own script',
    blurb: 'Hear a letter, put a vowel sign on, build a word, join two letters — in the script your family reads.',
    icon: 'script', minutes: 4, tag: 'Bhasha', c: '#2f5d50', c2: '#9a6a3c',
    teaches: true, review: false,   /* Devanagari is released; the engine gates every other script */
    levels: ['hear it, pick it', 'barakhadi: vowel signs', 'build a word', 'conjuncts', 'trace it'],
    engine: needs(['bhasha', 'voice'], function () { return !!(W.IND_PACKS && W.IND_BHASHA && W.IND_LIKHNA); }, engine)
  };
  REG.engine.packs = packs; REG.engine.open = open; REG.engine.canTrace = canTrace; REG.engine.tonguePack = tonguePack; REG.engine.build = build;
  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push(REG);
})();
