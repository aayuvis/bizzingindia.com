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
     · loanwords     a word whose gloss IS its romanisation (ghee, dosa,
                     kurta) leaks in BOTH text modes — so it is only ever
                     dealt as Suno, where no text of it appears.

   House rules, same as games.js: keyboard AND touch always; reduced
   motion respected; no lives, no shaming — a wrong first answer holds on
   the miss card (the right pairing, warmly) until Aage, and goes back
   into the child's Bhasha review queue (games spec §4.2). Every native
   word carries a lang attribute so app.css :lang() sets it in its real
   face, and Urdu runs right-to-left. Parivaar, the family words, deals
   from the Rishtey data in the family's language.

   Contract (docs/32): pushes one entry into window.IND_GAMES after
   games.js, plus the cover fields (tag / c / c2 / scene); reports every
   word through opts.answer and the round through done(). Plain script. */

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
    '.sh-opt.is-warm{border-style:dashed;border-color:var(--accent2)}',
    '.sh-small{font-size:13px;color:var(--muted)}',
    /* the pre-readers' picture options (§4.2.3): two by two at every width, big enough for a small finger */
    '.sh-opts.sh-pics{grid-template-columns:1fr 1fr}',
    '.sh-opt.sh-pic{position:relative;justify-content:center;min-height:116px;padding:12px}',
    '.sh-pic .sh-num{position:absolute;top:8px;left:8px}',
    '.sh-pic-art{display:grid;place-items:center;width:84px;height:84px}',
    '.sh-pic-art img,.sh-pic-art svg,.sh-pic-ans img,.sh-pic-ans svg{display:block;width:100%;height:100%;object-fit:contain}',
    '.sh-ink{display:grid;place-items:center;width:100%;height:100%}',
    '.sh-pic-ans{display:block;width:72px;height:72px;margin:0 auto 4px}',
    '@media(max-width:400px){.sh-opt.sh-pic{min-height:104px}.sh-pic-art{width:76px;height:76px}}',
    /* THE MISS CARD (docs/32) */
    '.sh-wrap .gm-miss{margin-top:12px;background:var(--surface2);border:1px solid var(--line);border-left:4px solid var(--accent2);border-radius:var(--radius-lg);padding:var(--space-lg);font-size:15.5px;line-height:1.7;text-align:center}',
    '.sh-wrap .gm-ans{font-weight:600}',
    '.sh-wrap .gm-teach{margin:6px 0 10px}',
    '.sh-chip:disabled{opacity:.45;cursor:default}',
    /* the phone: the start, Next and Aage row sits above the tab bar, never under it (games spec §4.2.4) */
    '@media(max-width:720px){.sh-dock{position:sticky;bottom:calc(74px + env(safe-area-inset-bottom));z-index:6;background:var(--bg2);border-radius:var(--radius-lg);padding:4px 0}',
    '.sh-dock .sh-row{margin-top:4px}}',

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
    /* the one mute holds here too: a muted app starts no audio at all (games spec §1.5, T9) */
    try { if (W.IND_AUDIO && W.IND_AUDIO.state && W.IND_AUDIO.state.muted) return; } catch (e) {}
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
      /* stamped so a re-recorded clip actually reaches a returning child */
      var a = new W.Audio('voice/' + key + '.mp3?v=' + (W.IND_BUILD || '1'));
      audioEl = a;
      a.onerror = tts;
      /* the music steps back while the word is said (ducking, as the app's own voice does) */
      if (W.IND_AUDIO && W.IND_AUDIO.duck) {
        W.IND_AUDIO.duck(true);
        var undk = function () { try { W.IND_AUDIO.duck(false); } catch (e) {} };
        a.addEventListener('ended', undk); a.addEventListener('pause', undk); a.addEventListener('error', undk);
      }
      var p = a.play();
      if (p && p.catch) p.catch(function () { /* autoplay gate — the replay button is the recovery */ });
    } catch (e) { tts(); }
  }

  /* ==================================================================
     ROUND BUILDING — ten questions dealt from one lexicon
     ================================================================== */

  function lowEn(e) { return String(e.en || '').toLowerCase(); }

  /* The loanword guard. English borrowed half the Indian kitchen, so the
     lexicons hold rows where gloss and romanisation are the same word —
     घी "ghee", தோசை "dosa", کرتا "kurta". Ask those as text and the answer
     is printed in the question: word→meaning shows the roman, and there is
     the gloss; meaning→word shows the gloss, and there is the roman. The
     one mode where they cannot leak is Suno — no text of the word appears
     at all — so that is the only mode that may deal them. */
  function textLeaks(entry) {
    var r = String(entry.roman || '').toLowerCase();
    var e = lowEn(entry);
    if (r.length > 1 && e.indexOf(r) >= 0) return true;
    if (e.length > 1 && r.indexOf(e) >= 0) return true;
    return false;
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

  /* ==================================================================
     PICTURES FOR PRE-READERS (games spec §4.2.3). A child of 4–7 may not
     read English, so in band 4-7 the meaning options are pictures — and a
     word is only ever offered as a picture when the app already holds a
     drawing of exactly that meaning: the painted tales animals (art/pt_*,
     Mor), the city kit's painted animals and things (art/kit), the app's
     own line icons (art.js IND_ICONS), a paint swatch for a colour word and
     a count of dots for a number word. Nothing here is an emoji and nothing
     is drawn for the occasion. A gloss that names two things (ox and bull,
     sun and sunshine) gets no picture rather than a guess.

     Keyed by the gloss's head word ("lion — the Gir lion" → lion), so a
     tenth pack with the same meanings is pictured with no edit here.
     ================================================================== */

  var PIC_IMG = {
    elephant: 'art/pt_elephant.png', lion: 'art/av/sm/pt_lion.webp', monkey: 'art/av/sm/pt_monkey.webp',
    crow: 'art/av/sm/pt_crow.webp', tortoise: 'art/av/sm/pt_tortoise.webp', rabbit: 'art/av/sm/pt_rabbit.webp',
    mouse: 'art/av/sm/pt_mouse.webp', deer: 'art/pt_deer.png', crocodile: 'art/pt_crocodile.png',
    peacock: 'art/av/sm/mor.webp', parrot: 'art/mithu.png',
    cow: 'art/kit/an-cow/0.png', horse: 'art/kit/an-horse/0.png', camel: 'art/kit/an-camel/0.png',
    goat: 'art/kit/an-goat/0.png', buffalo: 'art/kit/an-buffalo/0.png', dog: 'art/kit/an-dog/3.png',
    tree: 'art/kit/tr-mango/1.png', boat: 'art/kit/vh-boat-river/0.png'
  };
  /* the app's own line icons, each in a colour that reads on a light card and a dark one */
  var PIC_ICON = {
    sun: ['sun', '#d98a0b'], moon: ['moon', '#6f7fc8'], star: ['star', '#d9a514'], cloud: ['cloud', '#5f8fb0'],
    house: ['home', '#c0563a'], home: ['home', '#c0563a'], book: ['book', '#2f8a7a'], bus: ['bus', '#d0702a'],
    shirt: ['shirt', '#4a6fd0'], heart: ['heart', '#d0453b'], clock: ['clock', '#7a6a9a']
  };
  var PIC_SWATCH = {
    red: '#d3302a', blue: '#2f5fd0', green: '#2e9a4a', yellow: '#f2c21b', black: '#1b1b1b', white: '#ffffff',
    pink: '#f28dbb', purple: '#7d3fb8', brown: '#7b4a26', orange: '#f07d1a', grey: '#8a8a8a', gray: '#8a8a8a'
  };
  var NUM_WORD = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };

  /* "lion — the Gir lion" → "lion"; "orange (the colour)" → "orange"; "wind, air" → "wind" */
  function glossHead(entry) {
    return String(entry.en || '').toLowerCase().split(/\s+[—–(]|,|;/)[0].replace(/[^a-z ]/g, '').trim();
  }
  /* The picture for one lexicon row, or null. `key` is what makes two pictures the same picture:
     two options may never share one, so two words drawn alike can never both be on screen. */
  function picOf(entry) {
    if (!entry) return null;
    var h = glossHead(entry);
    if (entry.theme === 'colours') return PIC_SWATCH[h] ? { kind: 'swatch', key: 'sw:' + h, label: h, fill: PIC_SWATCH[h] } : null;
    if (entry.theme === 'numbers') {
      var n = typeof entry.value === 'number' ? entry.value : NUM_WORD[h];
      return n >= 1 && n <= 10 && n === Math.floor(n) ? { kind: 'dots', key: 'n:' + n, label: h || String(n), n: n } : null;
    }
    if (PIC_IMG[h]) return { kind: 'img', key: 'img:' + h, label: h, src: PIC_IMG[h] };
    if (PIC_ICON[h] && W.IND_ICONS && W.IND_ICONS[PIC_ICON[h][0]]) return { kind: 'icon', key: 'ic:' + PIC_ICON[h][0], label: h, icon: PIC_ICON[h][0], ink: PIC_ICON[h][1] };
    return null;
  }
  /* ten-frame dots: rows of five, the way a child counts on fingers */
  function dotsSVG(n) {
    var s = '<svg viewBox="0 0 100 64" aria-hidden="true" focusable="false">', rows = n > 5 ? 2 : 1, k = 0, r, c;
    for (r = 0; r < rows; r++) {
      var inRow = rows === 1 ? n : (r === 0 ? 5 : n - 5), y = rows === 1 ? 32 : 18 + r * 28, x0 = 50 - (inRow - 1) * 9;
      for (c = 0; c < inRow; c++, k++) s += '<circle cx="' + (x0 + c * 18) + '" cy="' + y + '" r="7.2" fill="#e0452d" stroke="#7a1f12" stroke-width="1.4"/>';
    }
    return s + '</svg>';
  }
  /* a dab of paint, not a perfect circle — and ringed, so white shows on a light card and black on a dark one */
  function swatchSVG(fill) {
    return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
      '<path d="M50 9c18 0 37 9 39 29 2 17-6 33-20 42-12 8-31 9-44 0C11 71 6 54 11 38 16 21 32 9 50 9z" fill="' + fill + '" stroke="#6b6152" stroke-width="3"/>' +
      '<path d="M30 30c6-7 15-10 24-9" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/></svg>';
  }
  function picHTML(p, size) {
    if (!p) return '';
    var px = size || 84;
    if (p.kind === 'img') return '<img src="' + esc(p.src) + '" width="' + px + '" height="' + px + '" alt="" draggable="false" decoding="async">';
    if (p.kind === 'icon') return '<span class="sh-ink" style="color:' + p.ink + '">' + W.IND_ICON(p.icon, px) + '</span>';
    if (p.kind === 'swatch') return swatchSVG(p.fill);
    return dotsSVG(p.n);
  }
  /* is there enough to picture at all? Fewer than four, and the round plays in words — and says nothing */
  function picturable(lex) {
    var keys = {}, n = 0, i, p;
    for (i = 0; i < lex.length; i++) { p = picOf(lex[i]); if (p && !keys[p.key]) { keys[p.key] = 1; n++; } }
    return n >= 4;
  }
  /* three picture distractors: same theme first, every picture different, every meaning different */
  function picDistractors(target, lex) {
    var tp = picOf(target), keys = {}, seen = {}, same = [], other = [], out = [], i, c, p;
    keys[tp.key] = 1; seen[lowEn(target)] = 1;
    for (i = 0; i < lex.length; i++) {
      c = lex[i];
      if (c.word === target.word || !(p = picOf(c))) continue;
      (c.theme === target.theme ? same : other).push(c);
    }
    var bag = shuffle(same).concat(shuffle(other));
    for (i = 0; i < bag.length && out.length < 3; i++) {
      p = picOf(bag[i]);
      if (keys[p.key] || seen[lowEn(bag[i])]) continue;
      keys[p.key] = 1; seen[lowEn(bag[i])] = 1; out.push(bag[i]);
    }
    return out.length === 3 ? out : null;
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

  /* ==================================================================
     THE BHASHA REVIEW QUEUE (games spec §4.2.1)
     The child's own Leitner cards live in BI.S.lang[pack].srs, moved only by
     IND_SRS.review. Shabd reads what is due or has slipped there, deals
     about half the round from it, and writes a miss back — so "you will meet
     it again" is a fact: the word is in Bhasha's "Words that slipped" deck
     once its gap is over. A right answer moves a card only when the card was
     already due (a later day); same-day practice never counts as learning.
     Without the app around it (a standalone load), nothing is read or
     written, and the claim is not made.
     ================================================================== */

  var DAY_MS = 24 * 3600 * 1000;
  function bhashaLive() {
    return !!(W.BI && W.BI.S && W.BI.S.lang && W.IND_SRS && W.IND_SRS.review && W.IND_STORE && W.IND_STORE.saveProfile);
  }
  function langRec(packId, make) {
    if (!bhashaLive()) return null;
    var L = W.BI.S.lang, rec = L[packId];
    if (!rec && make) rec = L[packId] = { asked: 0, correct: 0, srs: {}, stages: {}, window: [] };
    if (rec && !rec.srs) rec.srs = {};
    return rec || null;
  }
  /* due words for this pack, as lexicon rows: slipped-and-ready first, then real reviews due */
  function dueWords(pack, lex, now) {
    var rec = langRec(pack.id, false), out = [], seen = {}, byWord = {}, i;
    if (!rec) return out;
    for (i = 0; i < lex.length; i++) byWord[lex[i].word] = lex[i];
    function add(key) {
      var w = String(key).indexOf('word:') === 0 ? key.slice(5) : null;
      if (w && byWord[w] && !seen[w]) { seen[w] = 1; out.push(byWord[w]); }
    }
    try {
      if (W.IND_BHASHA && W.IND_BHASHA.slipped) {
        var sl = W.IND_BHASHA.slipped(pack.id, rec, now);
        for (i = 0; i < sl.length; i++) if (sl[i].ready) add(sl[i].key);
      }
      var cards = [], k;
      for (k in rec.srs) if (rec.srs.hasOwnProperty(k) && k.indexOf('word:') === 0 && W.IND_SRS.box(rec.srs[k]) >= 1) cards.push(rec.srs[k]);
      var due = W.IND_SRS.due(cards, now);
      for (i = 0; i < due.length; i++) add(due[i].key);
    } catch (e) {}
    return out;
  }
  /* the write-back; returns true when the card really went into the queue */
  function writeBack(packId, word, right, now) {
    var rec = langRec(packId, !right);
    if (!rec) return false;
    var key = 'word:' + word, card = rec.srs[key];
    if (right) {
      /* credit only a card that was waiting for today: a later-day check, Bhasha's own rule */
      if (!card || typeof card.due !== 'number' || card.due > now) return false;
      if (card.last && Math.floor(card.last / DAY_MS) === Math.floor(now / DAY_MS)) return false;
    } else if (!card) card = rec.srs[key] = { key: key };
    try {
      W.IND_SRS.review(card, !!right, now);
      W.IND_STORE.saveProfile(W.BI.S);
      return true;
    } catch (e) { return false; }
  }

  /* ==================================================================
     ROUND BUILDING — ten questions dealt from one lexicon
     ================================================================== */

  /* what each level means in Shabd (docs/32): how far into the word chest, and which ways */
  var LEVELS = [
    'everyday words: read them and hear them',
    'the first 150 words, three ways',
    'the first 300 words, three ways',
    'the whole word chest, three ways',
    'the whole chest: find the word, and Suno'
  ];
  var REACH = [60, 150, 300, 100000, 100000];
  var MODES = [
    ['a', 'c', 'a', 'c', 'a', 'c', 'a', 'c', 'a', 'c'],
    ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a'],
    ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a'],
    ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'b'],
    ['b', 'c', 'b', 'c', 'a', 'b', 'c', 'b', 'c', 'b']
  ];

  function buildRound(pack, level, pre) {
    var lex = [], L = pack.lexicon || [], i, w, now = Date.now();
    for (i = 0; i < L.length; i++) {
      w = L[i];
      if (w && w.word && w.roman && w.en) lex.push(w);
    }
    if (lex.length < 8) return null;
    level = level || 3;

    /* About half the round is the child's own due and slipped words (any reach);
       the rest is new at the chosen level — the lexicons are ordered by the
       everyday ramp, so the level is how far into it a round reaches. */
    var reach = lex.slice(0, Math.min(REACH[level - 1], lex.length));
    var rec = langRec(pack.id, false), srs = (rec && rec.srs) || {};
    var targets = [], used = {}, fromReview = {};
    var due = dueWords(pack, lex, now);
    for (i = 0; i < due.length && targets.length < 5; i++) {
      if (!used[due[i].word]) { used[due[i].word] = 1; fromReview[due[i].word] = 1; targets.push(due[i]); }
    }
    function grab(pool, unseenOnly) {
      var bag = shuffle(pool), k;
      for (k = 0; k < bag.length; k++) {
        if (used[bag[k].word]) continue;
        if (unseenOnly && srs['word:' + bag[k].word]) continue;
        used[bag[k].word] = 1; return bag[k];
      }
      return null;
    }
    while (targets.length < 10) { w = grab(reach, true) || grab(reach, false) || grab(lex, false); if (!w) break; targets.push(w); }

    /* the level's mix of the three ways, shuffled, then the loanword fix-up:
       a leaking target trades places with a Suno target that does not need
       the shelter, or simply becomes Suno when nobody can trade. */
    var modes = shuffle(MODES[level - 1]).slice(0, targets.length);
    for (i = 0; i < targets.length; i++) {
      if (modes[i] !== 'c' && textLeaks(targets[i])) {
        var swapped = false;
        for (var j = 0; j < targets.length; j++) {
          if (modes[j] === 'c' && !textLeaks(targets[j])) {
            modes[j] = modes[i]; modes[i] = 'c'; swapped = true; break;
          }
        }
        if (!swapped) modes[i] = 'c';
      }
    }

    /* PRE-READERS (band 4-7, games spec §4.2.3): wherever the options would be English meanings
       — Read it (a) and Suno (c) — they are pictures, when the pack holds four or more pictured
       words. A slot whose word has no picture takes an unseen pictured word instead; a word the
       child's review queue asked for is kept, and traded with a pictured word in a text slot
       only when it cannot leak there. Whatever is left unpictured plays as it always did. */
    var pics = pre ? picturable(lex) : false;
    if (pics) {
      var pool = reach.filter(function (x) { return picOf(x); }), all = lex.filter(function (x) { return picOf(x); });
      /* the loanword guard still holds: Read it shows the roman, so a word that leaks there never goes there */
      var nextPic = function (mode) {
        var bags = [shuffle(pool), shuffle(all), shuffle(pool)], b, k2, x;
        for (b = 0; b < 3; b++) for (k2 = 0; k2 < bags[b].length; k2++) {
          x = bags[b][k2];
          if (used[x.word] || (b < 2 && srs['word:' + x.word]) || (mode === 'a' && textLeaks(x))) continue;
          used[x.word] = 1; return x;
        }
        return null;
      };
      for (i = 0; i < targets.length; i++) {
        if (modes[i] === 'b' || picOf(targets[i])) continue;
        if (fromReview[targets[i].word]) {
          for (var j2 = 0; j2 < targets.length; j2++) {
            if (modes[j2] === 'b' && picOf(targets[j2]) && !textLeaks(targets[i])) {
              var tt = targets[i]; targets[i] = targets[j2]; targets[j2] = tt; break;
            }
          }
          continue;
        }
        var np = nextPic(modes[i]);
        if (np) targets[i] = np;
      }
    }

    var qs = [];
    for (i = 0; i < targets.length; i++) {
      var t = targets[i], pd = pics && modes[i] !== 'b' && picOf(t) ? picDistractors(t, lex) : null;
      var opts = shuffle([t].concat(pd || distractorsFor(modes[i], t, lex)));
      var answer = 0;
      for (var k = 0; k < opts.length; k++) if (opts[k].word === t.word) answer = k;
      qs.push({ kind: 'word', id: pack.id + ':' + t.word, mode: modes[i], target: t, options: opts, answer: answer,
                review: !!fromReview[t.word], pic: !!pd });
    }
    return qs;
  }

  /* ==================================================================
     Parivaar — the family words (games spec §4.2.2), from the Rishtey
     data (data-rishtey.js). Its family-tree slots and its options are
     shuffled; each word plays its own clip where the pack has one.
     The words differ by language and by family — Nani, Ammamma, Didima —
     so the pack follows the language chosen and says "in many families";
     it never says one word is the only one. Items are the term ids, so
     the host's once-per-id-per-day rule caps what replaying can pay.
     ================================================================== */

  var PV_LANGS = ['hi', 'pa', 'ta', 'bn', 'gu', 'te'];
  /* the Rishtey data's own words for a term in a language: Hindi/Urdu from `hi`,
     the others from `also` ("ਦਾਦਾ dada" → script, roman) */
  function pvWord(term, lang) {
    if (!term) return null;
    if (lang === 'hi') return term.hi ? { word: term.hi, roman: term.roman } : null;
    var a = term.also && term.also[lang];
    if (!a) return null;
    var m = String(a).match(/^(.*?)\s+([A-Za-z][A-Za-z '\-]*)$/);
    return m ? { word: m[1], roman: m[2] } : null;
  }
  function pvTerms() { return (W.IND_RISHTEY && W.IND_RISHTEY.terms) || []; }
  function pvTerm(id) { var t = pvTerms(); for (var i = 0; i < t.length; i++) if (t[i].id === id) return t[i]; return null; }
  function pvAvailable(lang) {
    if (PV_LANGS.indexOf(lang) < 0 || !W.IND_RISHTEY) return false;
    return pvSlots(lang, 3).length >= 4;
  }
  function pvSlots(lang, level) {
    var tree = (W.IND_RISHTEY && W.IND_RISHTEY.tree) || [], out = [], i, t;
    for (i = 0; i < tree.length; i++) {
      t = pvTerm(tree[i].answer);
      if (!t || !pvWord(t, lang)) continue;
      if (level === 1 && t.tier > 1) continue;
      out.push({ slot: tree[i].slot, term: t });
    }
    return out;
  }
  function buildParivaar(pack, level) {
    var lang = pack.id, slots = shuffle(pvSlots(lang, level || 3)).slice(0, 10);
    if (slots.length < 4) return null;
    var lex = pack.lexicon || [], byWord = {}, i, k;
    for (i = 0; i < lex.length; i++) byWord[lex[i].word] = lex[i];
    var all = pvTerms(), qs = [];
    for (i = 0; i < slots.length; i++) {
      var t = slots[i].term, w = pvWord(t, lang);
      var same = [], other = [], seen = {};
      seen[w.word] = 1;
      for (k = 0; k < all.length; k++) {
        var o = all[k], ow = pvWord(o, lang);
        if (o.id === t.id || !ow || seen[ow.word]) continue;
        (o.gen === t.gen ? same : other).push({ term: o, w: ow });
      }
      var picks = shuffle(same).concat(shuffle(other)), ds = [];
      for (k = 0; k < picks.length && ds.length < 3; k++) {
        if (seen[picks[k].w.word]) continue;
        seen[picks[k].w.word] = 1; ds.push(picks[k]);
      }
      if (ds.length < 3) continue;
      var opts = shuffle([{ term: t, w: w }].concat(ds)).map(function (x) {
        var lx = byWord[x.w.word];
        return { word: x.w.word, roman: x.w.roman, en: x.term.en, id: x.term.id, audio: lx ? lx.audio : null };
      });
      var answer = 0;
      for (k = 0; k < opts.length; k++) if (opts[k].id === t.id) answer = k;
      qs.push({ kind: 'parivaar', id: t.id, mode: 'p', slot: slots[i].slot, term: t,
                target: opts[answer], options: opts, answer: answer });
    }
    return qs.length >= 4 ? qs : null;
  }

  /* ==================================================================
     THE ENGINE
     It reports to the host (docs/32): one answer() per word at its first
     attempt, and done({win, score, asked, firstTryRight, level, levelNext}).
     The host plays the right/wrong sounds; this file only says the words.
     ================================================================== */

  function shabd(host, opts, done) {
    opts = opts || {};
    injectCSS();
    var sc = scope();
    var finished = false;
    var level = parseInt(opts.level, 10); if (!(level >= 1 && level <= 5)) level = 3;

    /* Verify seam (tools smoke test drives the round through this). It
       holds the answer index — which the DOM never does; the on-screen
       rule is the one that matters, and this object paints no pixels. */
    var ST = { phase: 'intro', pack: null, kind: 'words', i: 0, total: 0, mode: null, answer: -1, id: null,
               locked: false, score: 0, asked: 0, wroteBack: 0, result: null };
    host.__shState = ST;
    host.__shPicOf = picOf;   /* the same seam: which words have a picture, for the check */

    var PK = null, QS = null, score = 0, asked = 0, wrote = 0, result = null;
    var tonguePid = tonguePackId();
    var scopeKind = opts.scope && opts.scope.mode === 'parivaar' ? 'parivaar' : null;
    var selPack = tonguePid || 'hi';
    var kind = scopeKind || 'words';
    /* the pre-readers' band: meanings are shown as pictures where the app has them (§4.2.3) */
    var pre = opts.band === '4-7';

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
      ST.phase = 'intro'; ST.pack = selPack; ST.kind = kind;
      var ids = packIds(), chips = '', i, p;
      for (i = 0; i < ids.length; i++) {
        p = packOf(ids[i]);
        chips += '<button type="button" class="sh-chip' + (ids[i] === selPack ? ' on' : '') + '" data-go="pick" data-id="' + esc(ids[i]) + '" aria-pressed="' + (ids[i] === selPack) + '">' +
          '<span lang="' + esc(packLang(p)) + '"' + packDirAttr(p) + '>' + esc(packNative(p)) + '</span>' +
          '<span class="sh-chip-en">' + esc(packEn(p)) + '</span></button>';
      }
      var pvOk = pvAvailable(selPack), sp = packOf(selPack);
      if (kind === 'parivaar' && !pvOk) kind = 'words';
      stage.innerHTML =
        '<div class="sh-prompt">' +
          '<span class="sh-pkick">Ten words · three ways to meet them</span>' +
          '<h3 class="sh-q">Which language shall we play in?</h3>' +
        '</div>' +
        '<div class="sh-chips" role="group" aria-label="Choose a language pack">' + chips + '</div>' +
        (tonguePid
          ? '<p class="sh-lead">Your family&rsquo;s language leads.</p>'
          : '<p class="sh-lead">Every pack is the same game — pick the one your family speaks, or try a new one.</p>') +
        '<div class="sh-chips" role="group" aria-label="What to play">' +
          '<button type="button" class="sh-chip' + (kind === 'words' ? ' on' : '') + '" data-go="kind" data-kind="words" aria-pressed="' + (kind === 'words') + '">Words</button>' +
          '<button type="button" class="sh-chip' + (kind === 'parivaar' ? ' on' : '') + '" data-go="kind" data-kind="parivaar" aria-pressed="' + (kind === 'parivaar') + '"' + (pvOk ? '' : ' disabled') + '>' +
            'Parivaar <span class="sh-chip-en">family words</span></button>' +
        '</div>' +
        (pvOk ? '' : '<p class="sh-lead">Parivaar is not in ' + esc(sp ? packEn(sp) : selPack) + ' yet — ask your family what they call everyone.</p>') +
        /* the Rishtey data says its non-Hindi words still want a native speaker's check: say so */
        (pvOk && kind === 'parivaar' && selPack !== 'hi'
          ? '<p class="sh-lead">These ' + esc(packEn(sp)) + ' family words have not been checked by a ' + esc(packEn(sp)) +
            ' speaker yet, and in many families the words are different &mdash; ask yours what they say.</p>' : '') +
        '<div class="sh-dock"><div class="sh-row"><button type="button" class="sh-btn" data-go="start">Let&rsquo;s play</button></div></div>' +
        '<p class="sh-hint">Tap an answer &mdash; or press 1&ndash;4 (A&ndash;D work too), then Enter for the next word. In Suno, R plays the word again.</p>';
      sc.later(function () { focusSoft(stage.querySelector('[data-go="start"]')); }, 60);
    }

    /* ---------------------------------------------------- QUESTIONS --- */

    function start() {
      PK = packOf(selPack) || packOf(tonguePid) || packOf(packIds()[0]);
      if (!PK) { renderNoPacks(); return; }
      QS = kind === 'parivaar' ? buildParivaar(PK, level) : buildRound(PK, level, pre);
      if (!QS) { renderNoPacks(); return; }
      score = 0; asked = 0; wrote = 0; result = null;
      ST.score = 0; ST.asked = 0; ST.total = QS.length; ST.pack = PK.id; ST.kind = kind; ST.result = null;
      ST.review = QS.filter(function (q) { return q.review; }).map(function (q) { return q.target.word; });
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
    function familiesOf() { return PK.id === 'hi' ? 'Hindi- and Urdu-speaking' : packEn(PK) + '-speaking'; }

    function renderQ(i) {
      if (sc.dead) return;
      var q = QS[i];
      if (!q) return renderDone();
      ST.phase = 'q'; ST.i = i; ST.mode = q.mode; ST.answer = q.answer; ST.id = q.id; ST.locked = false; ST.pic = !!q.pic;
      markPips(i);
      say('');

      var kick = q.kind === 'parivaar'
        ? 'Family word ' + (i + 1) + ' of ' + QS.length + ' · in many ' + familiesOf() + ' families'
        : 'Word ' + (i + 1) + ' of ' + QS.length + ' · ' +
          (q.mode === 'a' ? 'Read it' : q.mode === 'b' ? 'Find the word' : 'Suno — listen') + (q.review ? ' · from your review' : '');

      /* THE PROMPT. Mode by mode, this block is the leak surface:
           a — the word and its roman; its meaning is nowhere.
           b — the meaning; the word, its roman and its SOUND are nowhere.
           c — nothing of the word at all, only the replay button.
           p — the place in the family tree, in English; no word, no sound. */
      var prompt = '<div class="sh-prompt"><span class="sh-pkick">' + esc(kick) + '</span>';
      if (q.mode === 'p') {
        prompt += '<h3 class="sh-q">What do you call</h3><div class="sh-meaning">' + esc(q.slot) + '?</div>';
      } else if (q.mode === 'a') {
        prompt += '<div class="sh-big">' + wordSpan(q.target, '') + '</div>' +
          '<div class="sh-roman">' + esc(q.target.roman) + '</div>' +
          '<h3 class="sh-q">' + (q.pic ? 'Which picture is it?' : 'What does it mean?') + '</h3>' +
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
      var optsH = '<div class="sh-opts' + (q.pic ? ' sh-pics' : '') + '" role="group" aria-label="' + (q.pic ? 'Choose a picture' : 'Choose an answer') + '">', k, o;
      for (k = 0; k < q.options.length; k++) {
        o = q.options[k];
        /* A PICTURE OPTION carries no word on screen. Its name for a screen reader is its own
           meaning — every option named the same way, so the names say nothing about which is
           right; the child heard the word, the name is the picture's. */
        if (q.pic) {
          var pp = picOf(o);
          optsH += '<button type="button" class="sh-opt sh-pic" data-i="' + k + '" aria-label="' + (k + 1) + ': ' + esc(pp.label) + '">' +
            '<span class="sh-num" aria-hidden="true">' + (k + 1) + '</span><span class="sh-pic-art" aria-hidden="true">' + picHTML(pp, 84) + '</span></button>';
          continue;
        }
        optsH += '<button type="button" class="sh-opt" data-i="' + k + '">' +
          '<span class="sh-num" aria-hidden="true">' + (k + 1) + '</span><span class="sh-opt-t">';
        if (q.mode === 'a') {
          optsH += esc(o.en);
        } else if (q.mode === 'b' || q.mode === 'p') {
          optsH += wordSpan(o, 'sh-opt-word') + '<span class="sh-opt-s">' + esc(o.roman) + '</span>';
        } else {
          optsH += wordSpan(o, 'sh-opt-word');
        }
        optsH += '</span></button>';
      }
      optsH += '</div>';

      stage.innerHTML = prompt + optsH +
        '<p class="sh-hint">Tap ' + (q.pic ? 'a picture' : 'an answer') + ' &mdash; or press 1&ndash;4 (A&ndash;D work too), then Enter for the next word.' + (q.mode === 'c' || q.pic ? ' R plays the word again.' : '') + '</p>' +
        '<div class="sh-teach-slot"></div>';

      /* Warm audio on show — modes a and c only. In meaning→word and in the
         family tree the clip IS the answer, so they stay silent until lock-in. */
      if (q.mode === 'a' || q.mode === 'c') sc.later(function () { sayEntry(q.target, PK); }, 150);

      sc.later(function () { focusSoft(stage.querySelector('.sh-opt')); }, 60);
    }

    function replayAudio() {
      var q = QS && QS[ST.i];
      if (!q) return;
      if ((q.mode === 'b' || q.mode === 'p') && !ST.locked) return;   /* the leak rule, enforced twice */
      sayEntry(q.target, PK);
    }

    /* ONE VERDICT PER WORD, at its first and only attempt */
    function choose(n) {
      if (ST.phase !== 'q' || ST.locked) return;
      var q = QS[ST.i], els = optionEls();
      if (!q || !els[n]) return;
      ST.locked = true;
      var right = n === q.answer, k, now = Date.now();
      for (k = 0; k < els.length; k++) {
        els[k].disabled = true;
        if (k === q.answer) els[k].classList.add('is-right');
        else if (k === n) els[k].classList.add('is-warm');
      }
      asked++; ST.asked = asked;
      if (right) { score++; ST.score = score; }
      var queued = false;
      if (q.kind === 'word') queued = writeBack(PK.id, q.target.word, right, now);
      if (queued && !right) { wrote++; ST.wroteBack = wrote; }
      if (typeof opts.answer === 'function') {
        try {
          opts.answer({ id: q.id, right: right, firstTry: true, objective: null,
                        skill: q.kind === 'parivaar' ? 'shabd.parivaar' : 'shabd.' + ({ a: 'read', b: 'find', c: 'suno' })[q.mode] });
        } catch (e) {}
      }
      /* The reward beat: the right word says its own name. In meaning→word and
         Parivaar this is the FIRST time the clip plays, by design. */
      if (q.mode !== 'a' && (q.kind === 'word' || q.target.audio)) sc.later(function () { sayEntry(q.target, PK); }, 150);

      var last = ST.i >= QS.length - 1;
      var slot = stage.querySelector('.sh-teach-slot');
      var pair = wordSpan(q.target, '') + ' &middot; ' + esc(q.target.roman) + ' &mdash; &ldquo;' + esc(q.target.en) + '&rdquo;';
      /* a picture question shows the right picture with the word, on the miss card and after a right one */
      if (q.pic) pair = '<span class="sh-pic-ans" aria-hidden="true">' + picHTML(picOf(q.target), 72) + '</span>' + pair;
      if (slot) {
        if (right) {
          say(one(CHEERS), 'good');
          slot.innerHTML = '<div class="sh-teach">' + pair +
              (q.kind === 'parivaar' && q.term.note ? '<br><span class="sh-small">' + esc(q.term.note) + '</span>' : '') + '</div>' +
            '<div class="sh-dock"><div class="sh-row"><button type="button" class="sh-btn" data-go="next">' +
              (last ? 'See how I did' : 'Next word') + '</button></div></div>';
        } else {
          /* THE MISS CARD (docs/32): it holds until Aage */
          say('', '');
          var teach = q.kind === 'parivaar'
            ? (q.term.note ? q.term.note + ' ' : '') + 'In many families the word is different — ask yours what they say.'
            : (queued ? 'It goes into your Bhasha review — you will meet it again in Words that slipped.'
                      : 'Read it once more, and say it out loud.');
          slot.innerHTML =
            '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">' + pair + '</span>' +
              '<p class="gm-teach">' + esc(teach) + '</p>' +
              '<button type="button" class="sh-btn gm-aage" data-gm="aage">Aage &rarr;</button></div>';
        }
        /* the teach line uses a bare span; give the word its size */
        var tw = slot.querySelector('span[lang]');
        if (tw) tw.style.fontSize = '1.25em';
      }
      sc.later(function () { focusSoft(stage.querySelector('[data-go="next"], [data-gm="aage"]')); }, 60);
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
      var ratio = asked ? score / asked : 0;
      result = { win: asked > 0 && ratio >= 0.5, score: score, asked: asked, firstTryRight: score, level: level,
                 levelNext: ratio >= 0.8 ? Math.min(5, level + 1) : ratio < 0.5 ? Math.max(1, level - 1) : level };
      ST.result = result;
      var pv = QS[0] && QS[0].kind === 'parivaar';
      stage.innerHTML =
        '<div class="sh-done">' +
          '<h3>' + esc(ratio >= 0.8 ? one(CHEERS) : ratio >= 0.5 ? 'Well played!' : 'Every word, met.') + '</h3>' +
          '<p>You knew <b>' + score + ' of ' + QS.length + '</b> on the first try, in ' +
            '<span lang="' + esc(packLang(PK)) + '"' + packDirAttr(PK) + '>' + esc(packNative(PK)) + '</span>.</p>' +
          (pv ? '<p>Use one of these words on your next family call.</p>'
              : wrote ? '<p>' + wrote + (wrote === 1 ? ' word goes' : ' words go') + ' into your Bhasha review, to meet again in a day or two.</p>' : '') +
          '<div class="sh-dock"><div class="sh-row">' +
            '<button type="button" class="sh-btn" data-go="out">Finish</button>' +
          '</div></div>' +
        '</div>';
      sc.later(function () { focusSoft(stage.querySelector('[data-go="out"]')); }, 60);
    }

    function bail() {
      if (finished || !result) return;
      finished = true;
      hushAudio();
      sc.kill();
      host.__shDone = result;
      if (typeof done === 'function') done(result);
    }

    /* ----------------------------------------------------- CONTROLS --- */
    /* Touch/mouse and keyboard land on the same verbs: choose, replay, next.
       Neither input is the "real" one. */

    sc.on(stage, 'click', function (e) {
      var t = e.target;
      var opt = t.closest ? t.closest('.sh-opt') : null;
      if (opt) { choose(parseInt(opt.getAttribute('data-i'), 10)); return; }
      var gm = t.closest ? t.closest('[data-gm="aage"]') : null;
      if (gm) { next(); return; }
      var go = t.closest ? t.closest('[data-go]') : null;
      if (!go || go.disabled) return;
      var what = go.getAttribute('data-go');
      if (what === 'pick') { selPack = go.getAttribute('data-id'); renderIntro(); }
      else if (what === 'kind') { kind = go.getAttribute('data-kind') === 'parivaar' ? 'parivaar' : 'words'; renderIntro(); }
      else if (what === 'start') { start(); }
      else if (what === 'replay') { replayAudio(); }
      else if (what === 'next') { next(); }
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

    if (scopeKind && pvAvailable(selPack)) start();
    else renderIntro();

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
    sub: 'words in your family’s language',
    icon: 'script',
    minutes: 3,
    blurb: 'Ten words from your family’s language — read them, hear them, match them. Nine packs, one game, and Parivaar: the family words.',
    tag: 'Words',
    teaches: true,
    levels: LEVELS,
    c: '#8b3fd6',
    c2: '#ef7d3a',
    scene: SCENE,
    engine: shabd
  });
})();
