/* Bizzing India — PLAY · Katha Chain, a tale put back together (games spec §5.3; docs/32).

   Prove you read the story by putting it back together.

     L1 Chitra Kadi  three picture panels, each with its own narration: put them in order
     L2 Kadi         four or five panels of a short tale: put them in order
     L3 Aage kya?    read up to a turn; what happens next? One true event, two real events
                     from OTHER tales
     L4 Kisne kaha?  a line from the tale: who said it? (only lines the data attributes)
     L5 Seekh        the lesson: three true morals, two of them from other tales

   EDITORIAL (docs/05, binding):
   - Only 🪔 Katha tales, and only those app/data-katha-chain.js flags `katha_chain: true` —
     a list chosen by explicit rule (collection + badge), reviewed, never inferred here. An
     Itihaas story is never shuffled into fiction; an Aaj story is not used. Sacred narratives
     are never chopped into panels. The badge is on every round.
   - Every panel, line, event and moral is the story data's own words (data-stories*.js);
     panels are cut at sentence ends, never rewritten. Narration is the app's recorded clip.
   - Panels are never numbered (that would hand over the order). The painting is the app's
     own story art; a folk-art tradition is credited only where the story data names one.
   - The flags await the named reviewer: review: true, tester mode only until signed.

   Contract: docs/32. One answer() per item at its first attempt; the host plays right/wrong.
   Keyboard AND touch: drag a panel onto another or tap two to swap; Space picks up, arrows
   move, Space puts down; number keys pick options; Enter presses Aage. */
(function () {
  'use strict';
  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document;

  var CSS = [
    '.kc{--kc-curtain:#a5262c;--kc-curtain2:#6e1418;--kc-stage:#f6e7c8;--kc-stage2:#ecd3a3;--kc-panel:#fffaf0;--kc-ink:#2a1608;--kc-gold:#e2a93b;',
    'position:relative;isolation:isolate;overflow:clip;border-radius:var(--radius-xl,22px);padding:clamp(14px,2.6vw,28px) clamp(16px,6vw,72px);min-height:min(78vh,720px);display:flex;flex-direction:column;gap:14px;',
    'background:radial-gradient(120% 90% at 50% 0%,var(--kc-stage),var(--kc-stage2));color:var(--kc-ink);font-family:var(--body);-webkit-tap-highlight-color:transparent}',
    '[data-mode="night"] .kc{--kc-curtain:#6b1a1f;--kc-curtain2:#3e0c0f;--kc-stage:#2c2318;--kc-stage2:#1d1610;--kc-panel:#221b3d;--kc-ink:#f6ead0}',
    /* the kathputli stage: two curtains and a pelmet, drawn — symmetric to the pixel */
    '.kc:before,.kc:after{content:"";position:absolute;top:0;bottom:0;width:clamp(10px,4.5vw,56px);z-index:-1;',
    'background:repeating-linear-gradient(90deg,var(--kc-curtain) 0 10px,var(--kc-curtain2) 10px 14px,var(--kc-curtain) 14px 22px)}',
    '.kc:before{left:0;border-radius:0 0 40% 0}.kc:after{right:0;border-radius:0 0 0 40%}',
    '.kc-pelmet{position:absolute;left:0;right:0;top:0;height:14px;z-index:-1;background:repeating-radial-gradient(circle at 12px -2px,var(--kc-gold) 0 9px,transparent 10px 24px),linear-gradient(var(--kc-curtain2),var(--kc-curtain))}',
    '.kc-head{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;text-align:center;padding-top:8px}',
    '.kc-badge{display:inline-flex;gap:6px;align-items:center;padding:4px 12px;border-radius:999px;background:var(--kc-panel);border:1px solid rgba(0,0,0,.15);font:700 13px/1.3 var(--body);color:var(--kc-ink)}',
    '.kc-mode{margin:0;font:800 clamp(18px,2.4vw,24px)/1.2 var(--display);color:var(--kc-ink)}',
    '.kc-step{font:600 13px var(--body);opacity:.8}',
    '.kc-board{flex:1;display:flex;flex-direction:column;gap:14px;justify-content:center;align-items:center;width:100%;max-width:1060px;margin:0 auto}',
    '.kc-tale{display:flex;align-items:center;gap:14px;max-width:760px;width:100%;background:var(--kc-panel);border-radius:18px;padding:10px 14px;box-shadow:var(--shadow)}',
    '.kc-tale img{width:96px;height:64px;object-fit:cover;border-radius:10px;flex:0 0 auto}',
    '.kc-tale h3{margin:0;font:800 18px/1.25 var(--display)}',
    '.kc-tale p{margin:2px 0 0;font:500 14px/1.45 var(--body);opacity:.85}',
    '.kc-q{text-align:center;font:700 clamp(16px,2vw,19px)/1.4 var(--display);margin:0}',
    '.kc-row{display:grid;gap:12px;width:100%;grid-template-columns:repeat(var(--n,4),minmax(0,1fr))}',
    '@media (max-width:700px){.kc-row{grid-template-columns:1fr}}',
    '.kc-panel{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;min-height:150px;padding:10px 12px 12px;border-radius:16px;background:var(--kc-panel);color:var(--kc-ink);',
    'border:3px solid var(--kc-gold);box-shadow:var(--shadow);text-align:center;font:500 14.5px/1.5 var(--body);cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}',
    '@media (max-width:700px){.kc-panel{flex-direction:row;min-height:64px;text-align:left}.kc-panel .kc-pic{flex:0 0 auto}}',
    '.kc-panel .kc-pic{display:flex;gap:2px;justify-content:center;min-height:64px;align-items:center}',
    '.kc-panel .kc-pic svg{width:58px;height:58px}',
    '.kc-panel.big .kc-pic svg{width:86px;height:86px}',
    '.kc-panel.sel{outline:4px solid var(--accent);outline-offset:2px}',
    '.kc-panel.lift{transform:translateY(-5px);box-shadow:var(--shadow-lg)}',
    '.kc-panel.ok{border-color:var(--good)}.kc-panel.no{border-color:var(--bad)}',
    '.kc-panel.ghost{opacity:.35}',
    '.kc-panel:focus-visible,.kc-opt:focus-visible,.kc-btn:focus-visible,.kc-say:focus-visible{outline:3px solid var(--accent);outline-offset:3px}',
    '.kc-say{min-width:44px;min-height:44px;border-radius:999px;border:2px solid var(--kc-gold);background:transparent;color:var(--kc-ink);cursor:pointer;font:700 13px var(--body)}',
    '.kc-text{flex:1}',
    '.kc-read{max-width:760px;width:100%;display:flex;flex-direction:column;gap:8px}',
    '.kc-read p{margin:0;background:var(--kc-panel);border-radius:14px;padding:10px 14px;font:500 15px/1.6 var(--body);box-shadow:var(--shadow)}',
    '.kc-line{max-width:680px;width:100%;background:var(--kc-panel);border-radius:18px;padding:16px 20px;font:600 italic 18px/1.6 var(--display);text-align:center;box-shadow:var(--shadow);border:3px solid var(--kc-gold)}',
    '.kc-opts{display:grid;gap:10px;max-width:760px;width:100%}',
    '.kc-opts.who{grid-template-columns:repeat(3,minmax(0,1fr))}',
    '.kc-opt{display:flex;align-items:center;gap:12px;min-height:56px;padding:10px 14px;text-align:left;border-radius:16px;background:var(--kc-panel);color:var(--kc-ink);border:2px solid rgba(0,0,0,.15);font:600 15px/1.45 var(--body);cursor:pointer;box-shadow:var(--shadow)}',
    '.kc-opts.who .kc-opt{flex-direction:column;text-align:center;justify-content:center}',
    '.kc-opt svg{width:72px;height:72px}',
    '.kc-opt .kc-n{flex:0 0 28px;height:28px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(0,0,0,.2);font:800 13px var(--body)}',
    '.kc-opt.ok{border-color:var(--good);box-shadow:0 0 0 3px var(--good)}',
    '.kc-act{position:sticky;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:2;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}',
    '@media (max-width:720px){.kc-act{bottom:calc(78px + env(safe-area-inset-bottom,0px))}}',
    '.kc-btn{min-height:48px;min-width:120px;padding:10px 22px;border-radius:999px;border:2px solid var(--accent);background:var(--accent);color:#fff;font:800 16px var(--body);cursor:pointer;box-shadow:var(--shadow)}',
    '.kc-hint{text-align:center;font:500 12.5px/1.45 var(--body);margin:0;opacity:.85;max-width:62ch}',
    '.kc-ok{text-align:center;font:800 17px var(--display);color:var(--good);margin:0}',
    '.kc-credit{font:500 11.5px var(--body);opacity:.75;text-align:center;margin:0}',
    '.kc .gm-miss{max-width:680px;width:100%;background:var(--card);color:var(--text);border:2px solid var(--accent2);border-radius:var(--radius-lg,18px);padding:14px 18px;text-align:center;font:500 15px/1.55 var(--body);box-shadow:var(--shadow-lg)}',
    '.kc .gm-miss b{font:800 18px var(--display)}',
    '.kc .gm-ans{display:block;margin:6px 0 2px;font-weight:700}',
    '.kc .gm-teach{margin:6px 0 10px;color:var(--text2);font-size:14px}',
    '.kc .gm-aage{min-height:48px;padding:10px 26px;border-radius:999px;border:2px solid var(--accent);background:var(--accent);color:#fff;font:800 16px var(--body);cursor:pointer}',
    '.kc-drag{position:fixed;z-index:9999;pointer-events:none;opacity:.92;transform:rotate(-2deg)}',
    '.kc-wait{max-width:560px;margin:auto;text-align:center;background:var(--kc-panel);border-radius:18px;padding:22px}',
    '@media (prefers-reduced-motion:reduce){.kc *{transition:none!important;animation:none!important}.kc-panel.lift{transform:none}}'
  ].join('');
  function injectCSS() {
    if (!D || D.getElementById('kc-css')) return;
    var s = D.createElement('style'); s.id = 'kc-css'; s.textContent = CSS;
    (D.head || D.documentElement).appendChild(s);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function tester() { try { return !!(W.IND_STORE && W.IND_STORE.loadDevice('tester', false) === true); } catch (e) { return false; } }
  function tap() { try { if (W.IND_SFX) W.IND_SFX.play('tap'); } catch (e) {} }
  function focusSoft(el) { if (el && el.focus) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } } }
  function muted() { try { return !!(W.IND_SFX_MUTED && W.IND_SFX_MUTED()); } catch (e) { return false; } }

  /* ------------------------------------------------------------- the tales */
  function allStories() {
    var out = [], k;
    for (k in W) { if (/^IND_STORIES/.test(k) && Array.isArray(W[k])) out = out.concat(W[k]); }
    return out;
  }
  function flags() { return (W.IND_KATHA_CHAIN && W.IND_KATHA_CHAIN.katha_chain) || {}; }
  /* the ONLY door: flagged by the reviewed list AND badged katha in the story itself */
  function tales() {
    var F = flags();
    return allStories().filter(function (s) { return s && F[s.id] === true && s.badge === 'katha' && !s.needs_review && s.scenes && s.scenes.length >= 4; });
  }
  function slug(s) { return String(s.id).replace(/\./g, '-'); }
  /* panels: the told scenes, never Mithu's moral; cut at a sentence end, never rewritten */
  function beats(s) {
    var out = [];
    s.scenes.forEach(function (sc, i) { if (sc.who !== 'mithu' && sc.text) out.push({ i: i, text: sc.text, art: sc.art || [], who: sc.who }); });
    return out;
  }
  function short(t, max) {
    var parts = String(t).match(/[^.!?…]+[.!?…]+["”’)]*\s*|[^.!?…]+$/g) || [t], out = '';
    for (var i = 0; i < parts.length; i++) { if (out && (out + parts[i]).length > (max || 150)) break; out += parts[i]; }
    return out.trim();
  }
  function pick(list, n) {
    if (list.length < n) return null;
    var idx = [], i;
    for (i = 0; i < n; i++) idx.push(Math.round(i * (list.length - 1) / (n - 1)));
    var got = idx.map(function (j) { return list[j]; });
    var seen = {}; for (i = 0; i < got.length; i++) { var k = short(got[i].text, 120); if (seen[k]) return null; seen[k] = 1; }
    return got;
  }
  function clipKey(s, i) { return 'st/' + slug(s) + '-' + i; }
  function hasVoice(k) { return !!(W.IND_VOICE && W.IND_VOICE.indexOf(k) >= 0); }
  var audioEl = null;
  function hush() { if (audioEl) { try { audioEl.pause(); } catch (e) {} audioEl = null; } }
  function play(key) {
    if (!key || muted() || !hasVoice(key)) return false;
    hush();
    try { var a = new W.Audio('voice/' + key + '.mp3?v=' + (W.IND_BUILD || '1')); audioEl = a; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
    return true;
  }
  function pic(ids, size) {
    var h = '';
    (ids || []).slice(0, 2).forEach(function (id) { if (W.IND_AVATAR) h += W.IND_AVATAR(id, size || 58); });
    return h;
  }
  function art(s) { var k = slug(s); return (W.IND_STORY_ART && W.IND_STORY_ART.indexOf(k) >= 0) ? 'art/story/' + k + '.jpg' : null; }

  /* WHO SAID IT — only where the data itself attributes the line: the scene's `who` is the
     speaker AND the words beside the quote name that same character. The label is the word
     the story itself uses ("said the monkey"), never a name this file supplies. */
  var NAMES = {
    pt_lion: /lion/i, pt_rabbit: /rabbit|hare/i, pt_deer: /deer|stag/i, pt_monkey: /monkey/i, pt_crocodile: /crocodile/i,
    pt_tortoise: /tortoise/i, pt_heron: /heron|crane|goose|geese/i, pt_crow: /crow|woodpecker|partridge|quail|parrot/i,
    pt_jackal: /jackal/i, pt_bull: /bull|ox/i, pt_elephant: /elephant/i, pt_mouse: /mouse|mice/i,
    akbar: /Akbar/, birbal: /Birbal/, tansen: /Tansen/
  };
  function lines(s) {
    var out = [];
    s.scenes.forEach(function (sc) {
      if (!sc.who || !NAMES[sc.who] || !sc.text) return;
      var m = /^([^“"]{0,60})[“"]([^”"]{14,170})[”"]\s*([^“"]{0,48})/.exec(sc.text);
      if (!m) return;
      var near = (m[1] + ' ' + m[3]), hit = near.match(NAMES[sc.who]);
      if (!hit) return;
      var word = hit[0];
      var label = /^[A-Z]/.test(word) && sc.who.indexOf('pt_') ? word : 'The ' + word.toLowerCase();
      out.push({ story: s, who: sc.who, label: label, line: m[2].trim().replace(/[,;:]$/, '') });
    });
    return out;
  }
  function moralOf(s) { return String(s.moral || '').trim(); }
  function tagsOf(id) {
    var N = W.IND_NEETI_STORIES || {}, t = [], k;
    for (k in N) if (N.hasOwnProperty(k) && (N[k] || []).indexOf(id) >= 0) t.push(k);
    return t;
  }

  var MODES = ['Chitra Kadi', 'Kadi', 'Aage kya?', 'Kisne kaha?', 'Seekh'];
  var MODE_EN = ['put the pictures in order', 'put the tale in order', 'what happens next?', 'who said it?', 'the lesson'];
  var ROUND = [3, 4, 5, 6, 5];

  function build(L, band, onlyIds) {
    var T = tales(), out = [];
    if (onlyIds && onlyIds.length) T = T.filter(function (s) { return onlyIds.indexOf(s.id) >= 0 || onlyIds.indexOf(s.collection) >= 0; });
    var all = tales();
    var bag = shuffle(T), n = ROUND[L - 1];
    if (L === 1 || L === 2) {
      var np = L === 1 ? 3 : (band === '4-7' ? 4 : 5);
      bag.forEach(function (s) {
        if (out.length >= n) return;
        var p = pick(beats(s), np); if (!p) return;
        out.push({ kind: 'order', story: s, panels: p, start: derange(p), id: 'kc' + L + ':' + s.id });
      });
    } else if (L === 3) {
      bag.forEach(function (s) {
        if (out.length >= n) return;
        var b = beats(s); if (b.length < 5) return;
        var t = 2 + Math.floor(Math.random() * (b.length - 4));
        var truth = short(b[t + 1].text, 140), rel = (t + 1) / b.length;
        var pool = [];
        all.forEach(function (o) {
          if (o.id === s.id) return;
          var ob = beats(o); if (ob.length < 4) return;
          var j = Math.max(1, Math.min(ob.length - 1, Math.round(rel * ob.length)));
          pool.push({ text: short(ob[j].text, 140), same: o.collection === s.collection, from: o.id });
        });
        pool = shuffle(pool).sort(function (a, b2) { return (b2.same ? 1 : 0) - (a.same ? 1 : 0); });
        var dis = []; pool.forEach(function (x) { if (dis.length < 2 && x.text !== truth && !dis.some(function (y) { return y.text === x.text; })) dis.push(x); });
        if (dis.length < 2) return;
        var opts = shuffle([{ text: truth, from: s.id }].concat(dis));
        out.push({ kind: 'next', story: s, before: [b[t - 1], b[t]], options: opts, answer: opts.map(function (o) { return o.from; }).indexOf(s.id), id: 'kc3:' + s.id + ':' + t });
      });
    } else if (L === 4) {
      var LN = []; all.forEach(function (s) { LN = LN.concat(lines(s)); });
      var mine = []; T.forEach(function (s) { mine = mine.concat(lines(s)); });
      shuffle(mine).forEach(function (l) {
        if (out.length >= n) return;
        var labels = [l.label.toLowerCase()];
        var others = shuffle(LN.filter(function (o) { return o.label.toLowerCase() !== l.label.toLowerCase(); }))
          .sort(function (a, b2) { return (b2.story === l.story ? 1 : 0) - (a.story === l.story ? 1 : 0); });
        var opts = [{ who: l.who, label: l.label }];
        others.forEach(function (o) { if (opts.length < 3 && labels.indexOf(o.label.toLowerCase()) < 0) { labels.push(o.label.toLowerCase()); opts.push({ who: o.who, label: o.label }); } });
        if (opts.length < 3) return;
        /* the line may not name any option — that would be the answer in the question */
        if (opts.some(function (o) { return new RegExp('\\b' + o.label.replace(/^The /, '').toLowerCase().replace(/[^a-z]/g, '') + 's?\\b', 'i').test(l.line); })) return;
        opts = shuffle(opts);
        out.push({ kind: 'who', story: l.story, line: l.line, options: opts, answer: opts.map(function (o) { return o.label; }).indexOf(l.label), id: 'kc4:' + l.story.id + ':' + l.line.slice(0, 24) });
      });
    } else if (L === 5) {
      bag.forEach(function (s) {
        if (out.length >= n) return;
        var mo = moralOf(s); if (!mo) return;
        var tg = tagsOf(s.id);
        var dis = shuffle(all.filter(function (o) {
          return o.id !== s.id && moralOf(o) && moralOf(o) !== mo && !tagsOf(o.id).some(function (x) { return tg.indexOf(x) >= 0; });
        })).slice(0, 2);
        if (dis.length < 2) return;
        var opts = shuffle([s].concat(dis));
        out.push({ kind: 'moral', story: s, options: opts.map(function (o) { return { text: moralOf(o), from: o.id }; }), answer: opts.indexOf(s), id: 'kc5:' + s.id });
      });
    }
    return out;
  }
  function derange(p) {
    for (var t = 0; t < 30; t++) { var s = shuffle(p); if (s.some(function (x, i) { return x !== p[i]; })) return s; }
    return p.slice().reverse();
  }

  function engine(host, opts, done) {
    injectCSS();
    opts = opts || {};
    var level = Math.max(1, Math.min(5, parseInt(opts.level, 10) || 1));
    var scope = opts.scope || null;
    if (scope && scope.mode) { var mi = MODES.map(function (m) { return m.toLowerCase(); }).indexOf(String(scope.mode).toLowerCase()); if (mi >= 0) level = mi + 1; else if (+scope.mode >= 1 && +scope.mode <= 5) level = +scope.mode; }
    var report = typeof opts.answer === 'function' ? opts.answer : function () {};
    var dead = false, finished = false, asked = 0, ftr = 0, items = [], k = 0, state = null, offs = [], rafs = [];
    var ST = host.__kcState = { level: level, phase: 'start', item: null };

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

    host.innerHTML = '<div class="kc" data-level="' + level + '"><div class="kc-pelmet" aria-hidden="true"></div>' +
      '<div class="kc-head"><span class="kc-badge" title="Katha — a story as it is told">🪔 Katha</span>' +
      '<h2 class="kc-mode">' + esc(MODES[level - 1]) + ' <span class="kc-step" style="font-size:14px">· ' + esc(MODE_EN[level - 1]) + '</span></h2>' +
      '<span class="kc-step kc-count" aria-live="polite"></span></div><div class="kc-board"></div></div>';
    var root = host.querySelector('.kc'), board = root.querySelector('.kc-board'), stepEl = root.querySelector('.kc-count');

    if (REG.review && !(REG.open && REG.open.by) && !tester() && !opts.preview) {
      board.innerHTML = '<div class="kc-wait" role="status"><h3 class="kc-mode">The tales are with their reviewer</h3>' +
        '<p class="kc-hint" style="font-size:15px">Which stories may be cut into panels is a reviewer\'s call, and it has not been made yet. Read the tales in Stories meanwhile.</p>' +
        '<div class="kc-act"><button class="kc-btn" data-kc="leave">Back</button></div></div>';
      on(board, 'click', function (e) { if (e.target.closest('[data-kc="leave"]')) finish(); });
      return teardown;
    }
    items = build(level, opts.band, scope && scope.set);
    if (!items.length) {
      board.innerHTML = '<div class="kc-wait" role="status"><h3 class="kc-mode">No tale for this yet</h3>' +
        '<p class="kc-hint" style="font-size:15px">The stories have not loaded, or none of the chosen tales has enough for this level.</p>' +
        '<div class="kc-act"><button class="kc-btn" data-kc="leave">Back</button></div></div>';
      on(board, 'click', function (e) { if (e.target.closest('[data-kc="leave"]')) finish(); });
      return teardown;
    }

    function judge(it, right, skill) {
      if (it.reported) return;
      it.reported = true; asked++; if (right) ftr++;
      try { report({ id: it.id, right: !!right, firstTry: true, skill: skill, objective: null }); } catch (e) {}
    }
    function finish() {
      if (finished) return;
      finished = true;
      var r = asked ? ftr / asked : 0;
      var nx = !asked ? level : r >= 0.8 ? Math.min(5, level + 1) : r >= 0.5 ? level : Math.max(1, level - 1);
      cleanup();
      if (typeof done === 'function') done({ win: asked > 0 && r >= 0.5, score: ftr, asked: asked, firstTryRight: ftr, level: level, levelNext: nx });
    }
    function next() { hush(); k++; if (k >= items.length) finish(); else show(); }
    function rightBeat(html) {
      ST.phase = 'right';
      var act = board.querySelector('.kc-act'); if (act) act.innerHTML = '';
      board.insertAdjacentHTML('beforeend', '<p class="kc-ok" role="status">Sahi! ' + (html || '') + '</p>');
      wait(1200, next);
    }
    function miss(ans, teach) {
      ST.phase = 'miss';
      var act = board.querySelector('.kc-act'); if (act) act.innerHTML = '';
      board.insertAdjacentHTML('beforeend', '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">' + ans + '</span>' +
        '<p class="gm-teach">' + teach + '</p><button class="btn gm-aage" data-gm="aage">Aage →</button></div>');
      var mc = board.querySelector('.gm-miss'); if (mc && mc.scrollIntoView) { try { mc.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch (e) {} }
      focusSoft(board.querySelector('.gm-aage'));
    }
    function taleHead(s) {
      var a = art(s);
      return '<div class="kc-tale">' + (a ? '<img src="' + esc(a) + '" alt="" loading="lazy">' : '') +
        '<div><span class="kc-badge">🪔 Katha</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.hook) + '</p></div></div>' +
        (s.art_credit ? '<p class="kc-credit">' + esc(s.art_credit) + '</p>' : '');
    }
    function panelHTML(s, p, i, big) {
      var key = clipKey(s, p.i), voice = hasVoice(key);
      return '<div class="kc-panel' + (big ? ' big' : '') + '" role="listitem" tabindex="0" data-slot="' + i + '" aria-label="Panel: ' + esc(short(p.text, 150)) + '">' +
        '<span class="kc-pic" aria-hidden="true">' + pic(p.art, big ? 86 : 58) + '</span>' +
        '<span class="kc-text">' + esc(short(p.text, big ? 110 : 150)) + '</span>' +
        (voice ? '<button type="button" class="kc-say" data-say="' + esc(key) + '" aria-label="Hear this panel">🔊</button>' : '') + '</div>';
    }

    function show() {
      if (dead) return;
      var it = items[k]; state = { item: it, sel: null, held: null };
      ST.phase = 'ask'; ST.item = it;
      stepEl.textContent = (k + 1) + ' of ' + items.length;
      var s = it.story;
      if (it.kind === 'order') {
        state.order = it.start.slice();
        board.innerHTML = taleHead(s) + '<p class="kc-q">' + (level === 1 ? 'Tap 🔊 to hear each picture. Then put them in the order the tale tells them.' : 'Put the tale back in order — what happened first goes first.') + '</p>' +
          '<div class="kc-row" style="--n:' + it.panels.length + '" role="list" aria-label="Panels, first on the left"></div>' +
          '<div class="kc-act"><button class="kc-btn" data-kc="lock">Lock karo</button></div>' +
          '<p class="kc-hint">Drag a panel onto another to swap them, or tap two panels. Keys: Space picks a panel up, arrows move it, Space puts it down, Enter locks.</p>';
        paint();
      } else if (it.kind === 'next') {
        board.innerHTML = taleHead(s) + '<div class="kc-read">' + it.before.map(function (b) { return '<p>' + esc(short(b.text, 220)) + '</p>'; }).join('') + '</div>' +
          '<p class="kc-q">What happens next?</p><div class="kc-opts" role="group">' + it.options.map(function (o, i) {
            return '<button type="button" class="kc-opt" data-opt="' + i + '"><span class="kc-n">' + (i + 1) + '</span><span>' + esc(o.text) + '</span></button>';
          }).join('') + '</div><p class="kc-hint">Tap one — or press 1, 2 or 3.</p>';
      } else if (it.kind === 'who') {
        board.innerHTML = taleHead(s) + '<p class="kc-q">Who said this?</p><blockquote class="kc-line">“' + esc(it.line) + '”</blockquote>' +
          '<div class="kc-opts who" role="group">' + it.options.map(function (o, i) {
            return '<button type="button" class="kc-opt" data-opt="' + i + '"><span class="kc-n">' + (i + 1) + '</span>' + pic([o.who], 72) + '<span>' + esc(o.label) + '</span></button>';
          }).join('') + '</div><p class="kc-hint">Tap one — or press 1, 2 or 3.</p>';
      } else if (it.kind === 'moral') {
        var b = beats(s), sum = pick(b, 3) || b.slice(0, 3);
        board.innerHTML = taleHead(s) + '<div class="kc-read">' + sum.map(function (x) { return '<p>' + esc(short(x.text, 160)) + '</p>'; }).join('') + '</div>' +
          '<p class="kc-q">What is the lesson of this tale?</p><div class="kc-opts" role="group">' + it.options.map(function (o, i) {
            return '<button type="button" class="kc-opt" data-opt="' + i + '"><span class="kc-n">' + (i + 1) + '</span><span>' + esc(o.text) + '</span></button>';
          }).join('') + '</div><p class="kc-hint">All three are true lessons — only one is this tale\'s. Tap it, or press 1, 2 or 3.</p>';
      }
      focusSoft(board.querySelector('.kc-panel, .kc-opt'));
    }
    function paint() {
      var it = state.item, row = board.querySelector('.kc-row');
      row.innerHTML = state.order.map(function (p, i) { return panelHTML(it.story, p, i, level === 1); }).join('');
      [].forEach.call(row.children, function (el, i) { if (state.held === i) el.classList.add('lift'); if (state.sel === i) el.classList.add('sel'); });
    }
    function swap(a, b) { if (a == null || b == null || a === b) return; var o = state.order, t = o[a]; o[a] = o[b]; o[b] = t; tap(); }
    function lock() {
      var it = state.item; if (it.reported || ST.phase !== 'ask') return;
      var ok = state.order.every(function (p, i) { return p === it.panels[i]; });
      judge(it, ok, 'katha.sequence');
      var row = board.querySelector('.kc-row');
      state.order = it.panels.slice(); state.sel = state.held = null; paint();
      [].forEach.call(row.children, function (el) { el.classList.add(ok ? 'ok' : 'no'); el.setAttribute('tabindex', '-1'); });
      if (ok) rightBeat('That is how the tale goes.');
      else {
        var hinge = it.panels[1] ? short(it.panels[1].text, 90) : '';
        miss('Here is the tale in its order, left to right.', 'The line that gives it away: “' + esc(hinge) + '” — that comes after the opening, and before the turn.');
      }
    }
    function pickOpt(i) {
      var it = state && state.item; if (!it || it.reported || ST.phase !== 'ask' || !it.options || !it.options[i]) return;
      var ok = i === it.answer;
      judge(it, ok, it.kind === 'next' ? 'katha.predict' : it.kind === 'who' ? 'katha.speaker' : 'katha.moral');
      [].forEach.call(board.querySelectorAll('[data-opt]'), function (el, j) { el.disabled = true; if (j === it.answer) el.classList.add('ok'); });
      var right = it.options[it.answer];
      if (it.kind === 'next') {
        if (ok) rightBeat('That is what happens next.');
        else miss('Next: “' + esc(right.text) + '”', 'The other two happen too — in other tales.');
      } else if (it.kind === 'who') {
        if (ok) rightBeat(esc(right.label) + ' said it.');
        else miss(esc(right.label) + ' said it.', 'Listen for who is speaking in “' + esc(it.story.title) + '”.');
      } else {
        if (ok) rightBeat('That is the lesson of “' + esc(it.story.title) + '”.');
        else miss('“' + esc(right.text) + '”', 'The other two are true lessons too — from other tales.');
      }
    }

    var drag = null, dragMoved = false;
    function onClick(e) {
      var t = e.target;
      if (t.closest('[data-gm="aage"]')) { if (ST.phase === 'miss') next(); return; }
      if (t.closest('[data-kc="leave"]')) { finish(); return; }
      var sy = t.closest('[data-say]'); if (sy) { e.stopPropagation(); play(sy.getAttribute('data-say')); return; }
      if (dragMoved) { dragMoved = false; return; }
      var it = state && state.item; if (!it) return;
      var op = t.closest('[data-opt]'); if (op) { pickOpt(+op.getAttribute('data-opt')); return; }
      if (it.kind === 'order' && ST.phase === 'ask') {
        if (t.closest('[data-kc="lock"]')) { lock(); return; }
        var sl = t.closest('[data-slot]');
        if (sl) {
          var i = +sl.getAttribute('data-slot');
          if (state.sel != null && state.sel !== i) { swap(state.sel, i); state.sel = null; }
          else if (state.sel === i) state.sel = null;
          else { state.sel = i; tap(); }
          paint(); focusSoft(board.querySelectorAll('.kc-panel')[i]);
        }
      }
    }
    function onDown(e) {
      if (ST.phase !== 'ask' || !state || state.item.kind !== 'order' || e.target.closest('[data-say]')) return;
      var el = e.target.closest('[data-slot]'); if (!el) return;
      drag = { el: el, x: e.clientX, y: e.clientY, ghost: null, slot: +el.getAttribute('data-slot') };
    }
    function onMove(e) {
      if (!drag) return;
      if (!drag.ghost && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 8) {
        var r = drag.el.getBoundingClientRect();
        drag.ghost = drag.el.cloneNode(true); drag.ghost.classList.add('kc-drag'); drag.ghost.style.width = r.width + 'px';
        drag.ox = drag.x - r.left; drag.oy = drag.y - r.top; D.body.appendChild(drag.ghost); drag.el.classList.add('ghost');
      }
      if (drag.ghost) {
        e.preventDefault();
        drag.ghost.style.left = (e.clientX - drag.ox) + 'px'; drag.ghost.style.top = (e.clientY - drag.oy) + 'px';
        [].forEach.call(board.querySelectorAll('.kc-panel.sel'), function (x) { x.classList.remove('sel'); });
        var o = over(e.clientX, e.clientY); if (o) o.classList.add('sel');
      }
    }
    function over(x, y) { var u = D.elementFromPoint(x, y); return u ? u.closest('.kc-row [data-slot]') : null; }
    function onUp(e) {
      if (!drag) return;
      var d = drag; drag = null;
      if (!d.ghost) return;
      dragMoved = true; d.ghost.remove();
      var o = over(e.clientX, e.clientY);
      if (o) swap(d.slot, +o.getAttribute('data-slot'));
      state.sel = null; paint();
      W.setTimeout(function () { dragMoved = false; }, 0);
    }
    function onKey(e) {
      if (dead) return;
      if (!host.isConnected) { teardown(); return; }
      var key = e.key, it = state && state.item;
      if (ST.phase === 'miss') { if (key === 'Enter' || key === ' ') { e.preventDefault(); next(); } return; }
      if (ST.phase !== 'ask' || !it) return;
      if (/^[1-4]$/.test(key) && it.options) { e.preventDefault(); pickOpt(+key - 1); return; }
      var ae = D.activeElement;
      if (it.kind === 'order') {
        var ps = [].slice.call(board.querySelectorAll('.kc-panel')), pi = ps.indexOf(ae && ae.closest ? ae.closest('.kc-panel') : null);
        if (key === ' ' && pi >= 0 && !(ae && ae.hasAttribute('data-say'))) { e.preventDefault(); state.held = state.held === pi ? null : pi; tap(); paint(); focusSoft(board.querySelectorAll('.kc-panel')[pi]); return; }
        if (/Arrow/.test(key) && pi >= 0) {
          e.preventDefault();
          var to = Math.max(0, Math.min(ps.length - 1, pi + (/Right|Down/.test(key) ? 1 : -1)));
          if (state.held === pi) { swap(pi, to); state.held = to; paint(); }
          focusSoft(board.querySelectorAll('.kc-panel')[to]); return;
        }
        if (key === 'Enter' && !(ae && ae.tagName === 'BUTTON')) { e.preventDefault(); lock(); }
        return;
      }
      if (/Arrow/.test(key)) {
        var all = [].slice.call(board.querySelectorAll('[data-opt]')), ai = all.indexOf(ae);
        e.preventDefault(); focusSoft(all[ai < 0 ? 0 : (ai + (/Right|Down/.test(key) ? 1 : -1) + all.length) % all.length]);
      }
    }
    on(root, 'click', onClick);
    on(root, 'pointerdown', onDown);
    on(W, 'pointermove', onMove, { passive: false });
    on(W, 'pointerup', onUp);
    on(D, 'keydown', onKey);
    show();

    function cleanup() {
      dead = true; hush();
      offs.forEach(function (f) { try { f(); } catch (e) {} }); offs = [];
      rafs.forEach(function (id) { try { W.cancelAnimationFrame(id); } catch (e) {} });
      var g = D.querySelector('.kc-drag'); if (g) g.remove();
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
    id: 'katha', name: 'Katha Chain', sub: 'put a tale back together, and find its lesson',
    blurb: 'Panchatantra, Jataka, Tenali and Birbal — put the panels in order, guess what happens next, and pick the lesson.',
    icon: 'book', minutes: 4, tag: 'Kahani', c: '#a5262c', c2: '#e2a93b',
    teaches: true, review: true,
    /* OPENED BY THE OWNER BEFORE REVIEW (9 Oct 2026): still unsigned, open to every child */
    open: { to: 'everyone', by: 'owner', on: '2026-10-09', who: 'a reviewer of the tales',
      why: 'Owner, 9 Oct 2026: \u201copen them all to everyone now, like the gita\u201d \u2014 the publisher\u2019s decision, never a reviewer\u2019s sign-off.' },
    levels: ['three pictures in order', 'a tale in order', 'what happens next', 'who said it', 'the lesson'],
    engine: needs(['content', 'voice'], function () { return !!(W.IND_STORIES && W.IND_NEETI_STORIES && W.IND_KATHA_CHAIN); }, engine)
  };
  REG.__short = function (t) { return short(t, 150); };   /* the check reads panels as the screen reader does */
  REG.engine.tales = tales; REG.engine.build = build; REG.engine.lines = lines; REG.engine.beats = beats;
  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push(REG);
})();
