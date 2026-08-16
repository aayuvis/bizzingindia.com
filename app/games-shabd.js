/* Bizzing India — THE MELA · Shabd Challenge.

   The word stall. Ten words from ONE language pack, three ways round:

     word  → meaning   see it in its own script, pick the English
     meaning → word    see the English, pick the word in script
     suno  → word      HEAR it, pick the word you heard

   The question bank is never written here — it is the pack lexicons in
   bhasha.js and the data-bhasha-* files, derived fresh each round. Which
   pack? The family's tongue leads when its pack exists (BI.S.tongue via
   data-tongue.js); otherwise the intro offers every pack and Hindi is
   only the preselected chip, never a silent assumption — CLAUDE.md rule
   8 (Hindi != Indian) is load-bearing in a vocabulary game.

   THE LEAK RULES, because this is the game they were written for:
     · word→meaning  the English gloss never appears before the answer.
     · meaning→word  NO audio before lock-in. The clip says the word out
                     loud; playing it would hand the answer over. The
                     right word's clip plays AFTER, as the reward beat.
     · suno          the word never appears as text in the prompt, and no
                     romanisation under the options — the child heard the
                     sound; roman letters would spell it out for them.
     · meaning→word targets whose English gloss contains their own
                     romanisation (loanwords: "roti — roti, bread") are
                     re-dealt to word→meaning, where nothing leaks.

   House rules, same as games.js: keyboard AND touch always; reduced
   motion respected; no lives, no shaming — a wrong tap shows the right
   pairing warmly and moves on (the SRS in Bhasha is the drill; this is
   the fair). Every native word carries a lang attribute so app.css
   :lang() sets it in its real face, and Urdu runs right-to-left.

   Contract: pushes one entry into window.IND_GAMES after games.js, plus
   the cover fields (tag / c / c2 / scene). Plain script, no modules. */

(function () {
  'use strict';

  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document || null;

  /* ==================================================================
     STYLE — injected once, everything scoped under .sh-
     ================================================================== */

  var CSS = [
    '.sh-wrap{display:flex;flex-direction:column;gap:var(--space-lg);color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    '.sh-hud{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-lg);flex-wrap:wrap}',
    '.sh-hud b{display:block;font:800 19px/1.15 var(--display,Georgia,serif)}',
    '.sh-kicker{display:block;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}',
    '.sh-pips{display:flex;gap:6px;align-items:center;padding-bottom:3px}',
    '.sh-pip{width:11px;height:11px;border-radius:50%;border:1px solid var(--line);background:var(--surface)}',
    '.sh-pip.on{background:var(--accent);border-color:var(--accent)}',
    '.sh-pip.now{border-color:var(--accent);box-shadow:0 0 0 3px var(--surface2)}',

    '.sh-stage{background:var(--bg2);border:1px solid var(--line);border-radius:var(--radius-lg);padding:var(--space-lg)}',
    '.sh-prompt{text-align:center}',
    '.sh-pkick{display:block;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);text-align:center;margin:0 0 4px}',
    /* The big word. Size and line-height per the Devanagari rule in CLAUDE.md —
       the :lang() rules in app.css pick the face; nothing here letter-spaces. */
    '.sh-big{font-size:clamp(32px,9vw,44px);line-height:1.7;font-weight:700;margin:2px 0 0}',
    '.sh-roman{color:var(--muted);font-size:15px;margin:2px 0 6px}',
    '.sh-meaning{font:700 23px/1.45 var(--display,Georgia,serif);margin:8px 0 4px}',
    '.sh-q{font:700 18px/1.35 var(--display,Georgia,serif);margin:6px 0 2px}',

    '.sh-opts{display:grid;gap:10px;grid-template-columns:1fr;margin-top:12px}',
    '@media(min-width:520px){.sh-opts{grid-template-columns:1fr 1fr}}',
    '.sh-opt{display:flex;align-items:center;gap:10px;text-align:left;width:100%;min-height:56px;padding:10px 14px;cursor:pointer;',
    'background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-lg);color:var(--text);font:600 16px/1.4 var(--body,inherit);transition:transform .12s ease,border-color .12s ease}',
    '.sh-opt:hover:not(:disabled){border-color:var(--accent);transform:translateY(-2px)}',
    '.sh-opt:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.sh-opt:disabled{cursor:default;transform:none}',
    '.sh-num{flex:0 0 auto;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--surface2);border:1px solid var(--line);font:700 12px var(--body,inherit);color:var(--muted)}',
    '.sh-opt-t{flex:1}',
    '.sh-opt-word{display:block;font-size:23px;line-height:1.7;font-weight:700}',
    '.sh-opt-s{display:block;font-weight:500;font-size:13px;color:var(--muted);margin-top:1px}',
    '.sh-opt.is-right{background:var(--surface2);border-color:var(--good)}',
    '.sh-opt.is-right .sh-num{background:var(--good);border-color:var(--good);color:var(--bg2)}',
    '.sh-opt.is-off{opacity:.45}',

    '.sh-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:12px}',
    '.sh-btn{cursor:pointer;min-height:46px;padding:11px 22px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:var(--bg2);font:700 15px var(--body,inherit)}',
    '.sh-btn.ghost{background:transparent;color:var(--text);border-color:var(--line)}',
    '.sh-btn:hover{filter:brightness(1.06)}',
    '.sh-btn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',

    '.sh-hint{font-size:12.5px;color:var(--muted);text-align:center;margin:10px 0 0}',
    '.sh-feed{min-height:22px;margin:0;text-align:center;font-size:14.5px;font-weight:600;color:var(--muted)}',
    '.sh-feed.good{color:var(--good)}',
    '.sh-feed.warm{color:var(--accent2)}',
    '.sh-teach{margin-top:12px;background:var(--surface2);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:var(--radius-lg);padding:var(--space-lg);font-size:15px;line-height:1.7;text-align:center}',
    '.sh-teach b{font-size:1.25em}',

    /* intro: the pack chips */
    '.sh-chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:10px 0 2px}',
    '.sh-chip{cursor:pointer;min-height:42px;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--text);font:600 14px/1.5 var(--body,inherit)}',
    '.sh-chip .sh-chip-en{font-weight:500;font-size:12px;color:var(--muted);margin-left:4px}',
    '.sh-chip.on{border-color:var(--accent);background:var(--surface2);box-shadow:0 0 0 2px var(--accent) inset}',
    '.sh-chip:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.sh-lead{text-align:center;font-size:14px;color:var(--muted);margin:8px 0 0}',

    '.sh-done{text-align:center}',
    '.sh-done h3{font:800 24px var(--display,Georgia,serif);margin:6px 0 4px}',
    '.sh-done p{margin:0 0 4px;font-size:15.5px;line-height:1.55;color:var(--muted)}',
    '.sh-tally{display:inline-flex;gap:14px;flex-wrap:wrap;justify-content:center;margin:12px 0 2px}',
    '.sh-chipstat{background:var(--surface2);border:1px solid var(--line);border-radius:999px;padding:7px 16px;font:700 14px var(--body,inherit)}',
    '.sh-chipstat b{color:var(--accent2);font-size:17px}',

    '@media(prefers-reduced-motion:reduce){.sh-wrap *,.sh-wrap *:before,.sh-wrap *:after{animation:none!important;transition:none!important}',
    '.sh-opt:hover:not(:disabled){transform:none}}'
  ].join('');

  var cssDone = false;
  function injectCSS() {
    if (cssDone || !D) return;
    cssDone = true;
    if (D.getElementById('sh-css')) return;
    var s = D.createElement('style');
    s.id = 'sh-css';
    s.appendChild(D.createTextNode(CSS));
    (D.head || D.documentElement).appendChild(s);
  }

  /* ==================================================================
     SMALL HELPERS — same idiom as games.js, re-scoped because that
     file's helpers live inside its own closure.
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
  function one(a) { return a[Math.floor(Math.random() * a.length)]; }
  function focusSoft(el) {
    if (!el || !el.focus) return;
    try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (e2) {} }
  }
  function detached(host) {
    return !!(D && D.body && host && host.nodeType === 1 && !D.body.contains(host));
  }
  function scope() {
    var timers = [], offs = [], dead = false;
    return {
      get dead() { return dead; },
      later: function (fn, ms) {
        if (dead) return 0;
        var t = W.setTimeout(function () { if (!dead) fn(); }, ms);
        timers.push(t); return t;
      },
      on: function (target, type, fn) {
        if (!target || !target.addEventListener) return;
        target.addEventListener(type, fn, false);
        offs.push(function () { target.removeEventListener(type, fn, false); });
      },
      kill: function () {
        if (dead) return;
        dead = true;
        for (var i = 0; i < timers.length; i++) W.clearTimeout(timers[i]);
        for (var j = 0; j < offs.length; j++) { try { offs[j](); } catch (e) {} }
        timers = []; offs = [];
      }
    };
  }

  /* Praise, never scolding. */
  var CHEERS = ['Shabaash!', 'Bahut khoob!', 'Ekdum sahi!', 'Very good!', 'Kya baat!'];
  var STREAK3 = 'Wah! Three in a row!';

  /* ==================================================================
     PACKS — which languages this stall can deal from
     ================================================================== */

  /* Display order for the chips. Anything registered in IND_PACKS that is
     not named here still shows, appended — a tenth pack is a data change
     in bhasha land, never an edit here. */
  var PACK_ORDER = ['hi', 'pa', 'bn', 'mr', 'te', 'ta', 'gu', 'kn', 'ur'];

  function packIds() {
    var P = W.IND_PACKS || {}, out = [], i, k;
    for (i = 0; i < PACK_ORDER.length; i++) if (P[PACK_ORDER[i]]) out.push(PACK_ORDER[i]);
    for (k in P) if (P.hasOwnProperty(k) && out.indexOf(k) < 0) out.push(k);
    return out;
  }
  function packOf(id) { return (W.IND_PACKS || {})[id] || null; }
  function packNative(p) { return (p.name && p.name.native) || p.id; }
  function packEn(p) { return (p.name && p.name.en) || p.id; }
  /* Pack ids double as BCP-47 codes for all nine packs — that is what the
     :lang() rules in app.css key on, so the lang attribute is just the id. */
  function packLang(p) { return p.id; }
  function packDirAttr(p) {
    var s = W.IND_SCRIPTS && W.IND_SCRIPTS[p.script];
    return (s && s.direction === 'rtl') ? ' dir="rtl"' : '';
  }

  /* The family's tongue, if the app knows it AND a pack exists for it.
     data-tongue.js maps tongue → pack (Malayalam etc. have no pack yet). */
  function tonguePackId() {
    var tid = W.BI && W.BI.S && W.BI.S.tongue;
    if (!tid) return null;
    var t = W.IND_TONGUE && W.IND_TONGUE.get ? W.IND_TONGUE.get(tid) : null;
    var pid = (t && t.pack) || tid;
    return packOf(pid) ? pid : null;
  }

  /* ==================================================================
     AUDIO — the app.js speak() pattern, re-made small.
     MP3 first (voice/<key>.mp3 — clips exist for every pack's words),
     speechSynthesis with the pack's language tag as the net under it.
     Never silent on purpose; a word game with a mute Suno is broken.
     ================================================================== */

  var audioEl = null;
  function hushAudio() {
    if (audioEl) { try { audioEl.pause(); } catch (e) {} audioEl = null; }
    try { if (W.speechSynthesis) W.speechSynthesis.cancel(); } catch (e) {}
  }
  function sayEntry(entry, pack) {
    if (!entry) return;
    hushAudio();
    function tts() {
      try {
        if (W.speechSynthesis && W.SpeechSynthesisUtterance) {
          var u = new W.SpeechSynthesisUtterance(entry.word);
          u.lang = packLang(pack) + '-IN';
          u.rate = 0.8;   /* a word being taught, not narration */
          W.speechSynthesis.speak(u);
        }
      } catch (e) {}
    }
    var key = entry.audio;
    if (W.IND_BHASHA && W.IND_BHASHA.audioFor) key = W.IND_BHASHA.audioFor(key, pack);
    if (!key) return tts();
    try {
      var a = new W.Audio('voice/' + key + '.mp3');
      audioEl = a;
      a.onerror = tts;
      var p = a.play();
      if (p && p.catch) p.catch(function () { /* autoplay gate — the replay button is the recovery */ });
    } catch (e) { tts(); }
  }

  /* ==================================================================
     ROUND BUILDING — ten questions dealt from one lexicon
     ================================================================== */

  function lowEn(e) { return String(e.en || '').toLowerCase(); }

  /* Loanword guard for meaning→word: if the gloss contains the word's own
     romanisation ("roti, bread" for roti), showing the gloss shows the
     answer. Those targets go to word→meaning instead. */
  function romanLeaks(entry) {
    var r = String(entry.roman || '').toLowerCase();
    return r.length > 1 && lowEn(entry).indexOf(r) >= 0;
  }

  /* First grapheme cluster, for Suno's "visually distinct" rule — a learner
     picking by eye should not face four words that all open with the same
     letter. bhasha.js exports the real Indic clusterer; first char is the
     fallback if this file ever runs alone. */
  function firstCluster(word) {
    if (W.IND_BHASHA && W.IND_BHASHA.clusters) {
      var c = W.IND_BHASHA.clusters(word);
      if (c && c.length) return c[0];
    }
    return String(word).charAt(0);
  }

  /* Three distractors for one target. Same theme first (a food word among
     food words is a fair question), other themes when thin. A distractor
     never shares the target's meaning — two right answers is a broken
     question, not a hard one. */
  function distractorsFor(mode, target, lex) {
    var sameTheme = [], others = [], picks = [], seen = {}, i, c;
    seen[lowEn(target)] = 1;
    for (i = 0; i < lex.length; i++) {
      c = lex[i];
      if (c.word === target.word) continue;
      (c.theme === target.theme ? sameTheme : others).push(c);
    }
    function ok(cd) {
      if (seen[lowEn(cd)]) return false;
      if (mode === 'b' && cd.roman && lowEn(target).indexOf(String(cd.roman).toLowerCase()) >= 0) return false;
      if (mode === 'c') {
        var f = firstCluster(cd.word);
        if (f === firstCluster(target.word)) return false;
        for (var m = 0; m < picks.length; m++) if (firstCluster(picks[m].word) === f) return false;
      }
      return true;
    }
    function take(pool, strict) {
      var bag = shuffle(pool), k;
      for (k = 0; k < bag.length && picks.length < 3; k++) {
        if (strict && !ok(bag[k])) continue;
        if (!strict && seen[lowEn(bag[k])]) continue;
        picks.push(bag[k]); seen[lowEn(bag[k])] = 1;
      }
    }
    take(sameTheme, true); take(others, true);
    /* thin lexicon: relax the look-alike rule before we relax correctness */
    if (picks.length < 3) { take(sameTheme, false); take(others, false); }
    return picks;
  }

  function buildRound(pack) {
    var lex = [], L = pack.lexicon || [], i, w;
    for (i = 0; i < L.length; i++) {
      w = L[i];
      if (w && w.word && w.roman && w.en) lex.push(w);
    }
    if (lex.length < 8) return null;

    /* Difficulty ramps inside the round: the first half deals from the
       first 150 rows — the everyday ramp the lexicons are ordered by —
       and the back half deals from anywhere. */
    var ramp = lex.slice(0, Math.min(150, lex.length));
    var targets = [], used = {};
    function grab(pool) {
      var bag = shuffle(pool), k;
      for (k = 0; k < bag.length; k++) if (!used[bag[k].word]) { used[bag[k].word] = 1; return bag[k]; }
      return null;
    }
    for (i = 0; i < 5; i++) { w = grab(ramp); if (w) targets.push(w); }
    while (targets.length < 10) { w = grab(lex); if (!w) break; targets.push(w); }

    /* 4 : 3 : 3 across the three modes, shuffled, then the loanword fix-up */
    var modes = shuffle(['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a']).slice(0, targets.length);
    for (i = 0; i < targets.length; i++) {
      if (modes[i] === 'b' && romanLeaks(targets[i])) {
        var swapped = false;
        for (var j = 0; j < targets.length; j++) {
          if (modes[j] === 'a' && !romanLeaks(targets[j])) { modes[j] = 'b'; modes[i] = 'a'; swapped = true; break; }
        }
        if (!swapped) modes[i] = 'a';
      }
    }

    var qs = [];
    for (i = 0; i < targets.length; i++) {
      var t = targets[i];
      var opts = shuffle([t].concat(distractorsFor(modes[i], t, lex)));
      var answer = 0;
      for (var k = 0; k < opts.length; k++) if (opts[k].word === t.word) answer = k;
      qs.push({ mode: modes[i], target: t, options: opts, answer: answer });
    }
    return qs;
  }

  /* ==================================================================
     THE ENGINE
     ================================================================== */

  function shabd(host, opts, done) {
    injectCSS();
    var sc = scope();
    var finished = false;

    /* Verify seam (tools smoke test drives the round through this). It
       holds the answer index — which the DOM never does; the on-screen
       rule is the one that matters, and this object paints no pixels. */
    var ST = { phase: 'intro', pack: null, i: 0, total: 0, mode: null, answer: -1, locked: false, score: 0 };
    host.__shState = ST;

    var PK = null, QS = null, score = 0, streak = 0;
    var tonguePid = tonguePackId();
    var selPack = tonguePid || 'hi';

    host.innerHTML =
      '<div class="sh-wrap">' +
        '<div class="sh-hud">' +
          '<div><span class="sh-kicker">Mela · words in your language</span><b>Shabd Challenge</b></div>' +
          '<div class="sh-pips" aria-hidden="true"></div>' +
        '</div>' +
        '<div class="sh-stage"></div>' +
        '<p class="sh-feed" role="status" aria-live="polite"></p>' +
      '</div>';
    var stage = host.querySelector('.sh-stage');
    var pips = host.querySelector('.sh-pips');
    var feed = host.querySelector('.sh-feed');

    function say(msg, tone) {
      if (!feed) return;
      feed.textContent = msg || '';
      feed.className = 'sh-feed' + (tone ? ' ' + tone : '');
    }
    function markPips(i, end) {
      if (!pips || !QS) return;
      var h = '', k;
      for (k = 0; k < QS.length; k++) {
        h += '<span class="sh-pip' + (k < i ? ' on' : '') + (k === i && !end ? ' now' : '') + '"></span>';
      }
      pips.innerHTML = h;
    }
    function optionEls() { return stage.querySelectorAll('.sh-opt'); }
    function moveFocus(dir) {
      var els = optionEls(), live = [], i, at = -1;
      for (i = 0; i < els.length; i++) if (!els[i].disabled) live.push(els[i]);
      if (!live.length) return;
      for (i = 0; i < live.length; i++) if (live[i] === (D && D.activeElement)) at = i;
      focusSoft(live[at < 0 ? 0 : (at + dir + live.length) % live.length]);
    }

    /* ------------------------------------------------------- INTRO ---- */

    function renderIntro() {
      ST.phase = 'intro'; ST.pack = selPack;
      var ids = packIds(), chips = '', i, p;
      for (i = 0; i < ids.length; i++) {
        p = packOf(ids[i]);
        chips += '<button type="button" class="sh-chip' + (ids[i] === selPack ? ' on' : '') + '" data-go="pick" data-id="' + esc(ids[i]) + '">' +
          '<span lang="' + esc(packLang(p)) + '"' + packDirAttr(p) + '>' + esc(packNative(p)) + '</span>' +
          '<span class="sh-chip-en">' + esc(packEn(p)) + '</span></button>';
      }
      stage.innerHTML =
        '<div class="sh-prompt">' +
          '<span class="sh-pkick">Ten words · three ways to meet them</span>' +
          '<h3 class="sh-q">Which language shall we play in?</h3>' +
        '</div>' +
        '<div class="sh-chips" role="group" aria-label="Choose a language pack">' + chips + '</div>' +
        (tonguePid
          ? '<p class="sh-lead">Your family&rsquo;s language leads.</p>'
          : '<p class="sh-lead">Every pack is the same game — pick the one your family speaks, or try a new one.</p>') +
        '<div class="sh-row"><button type="button" class="sh-btn" data-go="start">Let&rsquo;s play</button></div>' +
        '<p class="sh-hint">Tap an answer &mdash; or press 1&ndash;4 (A&ndash;D work too), then Enter for the next word. In Suno, R plays the word again.</p>';
      sc.later(function () { focusSoft(stage.querySelector('[data-go="start"]')); }, 60);
    }

    /* ---------------------------------------------------- QUESTIONS --- */

    function start() {
      PK = packOf(selPack) || packOf('hi');
      if (!PK) { renderNoPacks(); return; }
      QS = buildRound(PK);
      if (!QS) { renderNoPacks(); return; }
      score = 0; streak = 0;
      ST.score = 0; ST.total = QS.length; ST.pack = PK.id;
      renderQ(0);
    }

    function renderNoPacks() {
      /* Standalone load, or a pack too thin to deal from. Friendly, honest. */
      stage.innerHTML = '<div class="sh-prompt"><h3 class="sh-q">The word chest has not arrived yet.</h3>' +
        '<p class="sh-lead">This stall deals from the Bhasha language packs &mdash; come back when they are loaded.</p></div>';
    }

    function wordSpan(entry, cls) {
      return '<span class="' + cls + '" lang="' + esc(packLang(PK)) + '"' + packDirAttr(PK) + '>' + esc(entry.word) + '</span>';
    }
    function soundLabel(txt) {
      return (W.IND_ICON ? W.IND_ICON('sound', 18) + ' ' : '') + txt;
    }

    function renderQ(i) {
      if (sc.dead) return;
      var q = QS[i];
      if (!q) return renderDone();
      ST.phase = 'q'; ST.i = i; ST.mode = q.mode; ST.answer = q.answer; ST.locked = false;
      markPips(i);
      say('');

      var kick = 'Word ' + (i + 1) + ' of ' + QS.length + ' · ' +
        (q.mode === 'a' ? 'Read it' : q.mode === 'b' ? 'Find the word' : 'Suno — listen');

      /* THE PROMPT. Mode by mode, this block is the leak surface:
           a — the word and its roman; its meaning is nowhere.
           b — the meaning; the word, its roman and its SOUND are nowhere.
           c — nothing of the word at all, only the replay button. */
      var prompt = '<div class="sh-prompt"><span class="sh-pkick">' + esc(kick) + '</span>';
      if (q.mode === 'a') {
        prompt += '<div class="sh-big">' + wordSpan(q.target, '') + '</div>' +
          '<div class="sh-roman">' + esc(q.target.roman) + '</div>' +
          '<h3 class="sh-q">What does it mean?</h3>' +
          '<div class="sh-row" style="margin-top:6px"><button type="button" class="sh-btn ghost" data-go="replay">' + soundLabel('Hear it again') + '</button></div>';
      } else if (q.mode === 'b') {
        prompt += '<div class="sh-meaning">&ldquo;' + esc(q.target.en) + '&rdquo;</div>' +
          '<h3 class="sh-q">Which word means this?</h3>';
      } else {
        prompt += '<h3 class="sh-q">What did you hear?</h3>' +
          '<div class="sh-row" style="margin-top:6px"><button type="button" class="sh-btn ghost" data-go="replay">' + soundLabel('Play it again') + '</button></div>';
      }
      prompt += '</div>';

      /* THE OPTIONS. Suno shows script only — the roman would spell out
         the sound the child just heard and hand the answer over. */
      var optsH = '<div class="sh-opts" role="group" aria-label="Choose an answer">', k, o;
      for (k = 0; k < q.options.length; k++) {
        o = q.options[k];
        optsH += '<button type="button" class="sh-opt" data-i="' + k + '">' +
          '<span class="sh-num" aria-hidden="true">' + (k + 1) + '</span><span class="sh-opt-t">';
        if (q.mode === 'a') {
          optsH += esc(o.en);
        } else if (q.mode === 'b') {
          optsH += wordSpan(o, 'sh-opt-word') + '<span class="sh-opt-s">' + esc(o.roman) + '</span>';
        } else {
          optsH += wordSpan(o, 'sh-opt-word');
        }
        optsH += '</span></button>';
      }
      optsH += '</div>';

      stage.innerHTML = prompt + optsH +
        '<p class="sh-hint">Tap an answer &mdash; or press 1&ndash;4 (A&ndash;D work too), then Enter for the next word. In Suno, R plays the word again.</p>' +
        '<div class="sh-teach-slot"></div>';

      /* Warm audio on show — modes a and c only. In meaning→word the clip
         IS the answer, so mode b stays silent until lock-in. */
      if (q.mode !== 'b') sc.later(function () { sayEntry(q.target, PK); }, 150);

      sc.later(function () { focusSoft(stage.querySelector('.sh-opt')); }, 60);
    }

    function replayAudio() {
      var q = QS && QS[ST.i];
      if (!q) return;
      if (q.mode === 'b' && !ST.locked) return;   /* the leak rule, enforced twice */
      sayEntry(q.target, PK);
    }

    function choose(n) {
      if (ST.phase !== 'q' || ST.locked) return;
      var q = QS[ST.i], els = optionEls();
      if (!q || !els[n]) return;
      ST.locked = true;
      var right = n === q.answer, k;
      for (k = 0; k < els.length; k++) {
        els[k].disabled = true;
        if (k === q.answer) els[k].classList.add('is-right');
        else els[k].classList.add('is-off');
      }
      if (right) {
        score++; streak++; ST.score = score;
        say(streak > 0 && streak % 3 === 0 ? STREAK3 : one(CHEERS), 'good');
      } else {
        streak = 0;
        say('Not this time — here it is.', 'warm');
      }
      /* The reward beat: the right word says its own name. In mode b this
         is the FIRST time the clip plays, by design. */
      if (q.mode !== 'a') sc.later(function () { sayEntry(q.target, PK); }, 150);

      var last = ST.i >= QS.length - 1;
      var slot = stage.querySelector('.sh-teach-slot');
      if (slot) {
        slot.innerHTML =
          '<div class="sh-teach">' +
            (right ? '' : 'It was ') + wordSpan(q.target, '') + ' &middot; ' + esc(q.target.roman) +
            ' &mdash; &ldquo;' + esc(q.target.en) + '&rdquo;' +
            (right ? '' : '. You will meet it again.') +
          '</div>' +
          '<div class="sh-row"><button type="button" class="sh-btn" data-go="next">' +
            (last ? 'See how I did' : 'Next word') + '</button></div>';
        /* the teach line uses a bare span; give the word its size */
        var tw = slot.querySelector('.sh-teach span[lang]');
        if (tw) tw.style.fontSize = '1.25em';
      }
      sc.later(function () { focusSoft(stage.querySelector('[data-go="next"]')); }, 60);
    }

    function next() {
      if (ST.phase !== 'q' || !ST.locked) return;
      hushAudio();
      renderQ(ST.i + 1);
    }

    /* --------------------------------------------------------- DONE --- */

    function renderDone() {
      ST.phase = 'done'; ST.score = score;
      markPips(QS.length, true);
      say('');
      var kauris = 1 + Math.floor(score / 3);
      stage.innerHTML =
        '<div class="sh-done">' +
          '<h3>' + esc(score >= 7 ? one(CHEERS) : 'Well played!') + '</h3>' +
          '<p>You matched <b>' + score + ' of ' + QS.length + '</b> words in ' +
            '<span lang="' + esc(packLang(PK)) + '"' + packDirAttr(PK) + '>' + esc(packNative(PK)) + '</span>' +
            ' — every word you met today is one the mist gets back a little less of.</p>' +
          '<div class="sh-tally">' +
            '<span class="sh-chipstat"><b>' + score + '</b> / ' + QS.length + '</span>' +
            '<span class="sh-chipstat"><b>' + kauris + '</b> kauris</span>' +
          '</div>' +
          '<div class="sh-row">' +
            '<button type="button" class="sh-btn" data-go="out">Back to the Mela</button>' +
            '<button type="button" class="sh-btn ghost" data-go="again">Play again</button>' +
          '</div>' +
        '</div>';
      sc.later(function () { focusSoft(stage.querySelector('[data-go="out"]')); }, 60);
    }

    function bail() {
      if (finished) return;
      finished = true;
      hushAudio();
      sc.kill();
      if (typeof done === 'function') {
        done({ win: score >= 7, score: score, kauris: 1 + Math.floor(score / 3) });
      }
    }

    /* ----------------------------------------------------- CONTROLS --- */
    /* Touch/mouse and keyboard land on the same three verbs: choose,
       replay, next. Neither input is the "real" one. */

    sc.on(stage, 'click', function (e) {
      var t = e.target;
      var opt = t.closest ? t.closest('.sh-opt') : null;
      if (opt) { choose(parseInt(opt.getAttribute('data-i'), 10)); return; }
      var go = t.closest ? t.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'pick') { selPack = go.getAttribute('data-id'); renderIntro(); }
      else if (what === 'start') { start(); }
      else if (what === 'replay') { replayAudio(); }
      else if (what === 'next') { next(); }
      else if (what === 'again') { start(); }
      else if (what === 'out') { bail(); }
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      var k = e.key;

      if (ST.phase === 'q') {
        if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); moveFocus(1); return; }
        if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); moveFocus(-1); return; }
        var n = -1;
        if (/^[1-4]$/.test(k)) n = parseInt(k, 10) - 1;
        else if (/^[a-dA-D]$/.test(k)) n = k.toLowerCase().charCodeAt(0) - 97;
        if (n >= 0) { if (!ST.locked) { e.preventDefault(); choose(n); } return; }
        if (k === 'r' || k === 'R') { e.preventDefault(); replayAudio(); return; }
        if (k === 'Enter') {
          /* a focused button fires its own click on Enter — stay out of the way */
          var ae = D.activeElement;
          if (ae && host.contains(ae) && ae.tagName === 'BUTTON') return;
          if (ST.locked) { e.preventDefault(); next(); }
          return;
        }
      } else if (ST.phase === 'intro' && k === 'Enter') {
        var ae2 = D.activeElement;
        if (ae2 && host.contains(ae2) && ae2.tagName === 'BUTTON') return;
        e.preventDefault(); start();
      }
    });

    renderIntro();

    var teardown = function () {
      finished = true;   /* torn down without done() — never call it late */
      hushAudio();
      sc.kill();
    };
    teardown.destroy = teardown;
    return teardown;
  }

  /* ==================================================================
     COVER — the stall front. Letter tiles flipping between scripts:
     अ, த, ਅ take turns on one tile, because no single script is "the"
     Indian script. Self-contained keyframes, shsc- namespaced so four
     sibling covers can share one page. Stroke #ffffff per the cover
     contract; the gradient behind it comes from c/c2.
     ================================================================== */

  var SCENE =
    '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<style>' +
        '@keyframes shsc-flip{0%,30%{opacity:1}36%,96%{opacity:0}100%{opacity:1}}' +
        '@keyframes shsc-pulse{0%,100%{opacity:.35}50%{opacity:.9}}' +
        '.shsc-g{animation:shsc-flip 6s linear infinite}' +
        '.shsc-g2{animation-delay:-4s}' +
        '.shsc-g3{animation-delay:-2s}' +
        '.shsc-u{animation:shsc-pulse 3s ease-in-out infinite}' +
        '@media(prefers-reduced-motion:reduce){.shsc-g,.shsc-u{animation:none}}' +
      '</style>' +
      '<rect x="9" y="6" width="30" height="30" rx="6" stroke="#fff" stroke-width="2"/>' +
      '<text class="shsc-g" lang="hi" x="24" y="29" text-anchor="middle" font-size="17" fill="#fff">अ</text>' +
      '<text class="shsc-g shsc-g2" lang="ta" x="24" y="29" text-anchor="middle" font-size="17" fill="#fff" opacity="0">த</text>' +
      '<text class="shsc-g shsc-g3" lang="pa" x="24" y="29" text-anchor="middle" font-size="17" fill="#fff" opacity="0">ਅ</text>' +
      '<line class="shsc-u" x1="14" y1="42" x2="34" y2="42" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';

  /* ==================================================================
     REGISTRY — after games.js, guarded so a standalone load still works.
     IND_MELA.list points at the same array, so a push lands there too.
     ================================================================== */

  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push({
    id: 'shabd',
    name: 'Shabd Challenge',
    icon: 'script',
    minutes: 3,
    blurb: 'Ten words from your family’s language — read them, hear them, match them. Nine packs, one game.',
    tag: 'Words',
    c: '#8b3fd6',
    c2: '#ef7d3a',
    scene: SCENE,
    engine: shabd
  });
})();
