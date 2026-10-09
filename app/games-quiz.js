/* Bizzing India — THE MELA (quiz stalls).

   One stall, one question factory (games spec §4.1):
     gyanpati     · Kaun Banega Gyanpati? — the ladder quiz, with Trivia Master's
                    category picker and 60-second sprint folded in
     triviamaster · kept only so an old link opens Gyanpati's category picker

   ON THE NAME. Gyanpati plays the beloved TV ladder-quiz FORMAT with our own
   name — 'Kaun Banega Crorepati' is a broadcaster's trademark, so the name is
   ours while the format (a public quiz-show shape) is honoured.

   EVERY question is DERIVED at runtime from the data files already loaded:
     IND_GEO      — state names, capitals, monuments
     IND_STATES   — symbols, food, places, trivia
     IND_ITIHAAS  — eras, moments, figures (gates respected, needs_review skipped)
     IND_UTSAV    — festivals and the months they can fall in (needs_review skipped)
     IND_EPIC_CAST — who's who in the two epics
   Nothing is hardcoded that the data already knows, so the quizzes grow as the
   data grows, and a missing global simply removes that category. Distractors
   always come from the SAME field of OTHER records — three other capitals,
   never three random words.

   House rules honoured throughout (same as games.js, non-negotiable):
     · EVERY game plays fully with keyboard AND with touch/mouse.
     · The answer is never printed in the question, the hint, or the feed
       before it is earned — a leak check enforces it at build time.
     · prefers-reduced-motion is respected; the dramatic pause is skipped.
     · No lives, no shaming. Walking away with the pot is a win and we say so.
     · Faiths are never ranked or judged; gated and needs_review content is
       filtered out of the banks entirely.

   Plain script, no modules, no build. Registers into window.IND_GAMES. */

(function () {
  'use strict';

  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document || null;

  /* ==================================================================
     STYLE — injected once, everything scoped under .qz-
     ================================================================== */

  var CSS = [
    '.qz-wrap{display:flex;flex-direction:column;gap:var(--space-lg);color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    '.qz-hud{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;flex-wrap:wrap}',
    '.qz-hud b{display:block;font:800 19px/1.15 var(--display,Georgia,serif);letter-spacing:-.01em}',
    '.qz-kicker{display:block;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}',
    '.qz-pot{background:var(--surface2);border:1px solid var(--line);border-radius:999px;padding:7px 14px;font:700 14px var(--body,inherit);white-space:nowrap}',
    '.qz-pot b{display:inline;font:inherit;color:var(--accent2)}',

    '.qz-body{display:flex;gap:var(--space-lg);align-items:flex-start;flex-wrap:wrap}',
    '.qz-main{flex:1 1 280px;min-width:0}',
    '.qz-stage{background:var(--bg2);border:1px solid var(--line);border-radius:var(--radius-lg);padding:var(--space-lg);position:relative}',
    '.qz-stage:before{content:"";position:absolute;top:0;right:0;bottom:auto;left:0;height:3px;border-radius:var(--radius-lg) var(--radius-lg) 0 0;background:linear-gradient(90deg,var(--accent),var(--accent3),var(--accent2));opacity:.5}',
    '.qz-q{font:700 19px/1.35 var(--display,Georgia,serif);margin:4px 0 8px;text-align:center}',
    '.qz-sub{font-size:12.5px;color:var(--muted);text-align:center;margin:0 0 8px}',

    '.qz-opts{display:grid;gap:10px;grid-template-columns:1fr;margin-top:10px}',
    '@media(min-width:560px){.qz-opts{grid-template-columns:1fr 1fr}}',
    '.qz-opt{display:flex;align-items:center;gap:10px;text-align:left;width:100%;min-height:52px;padding:10px 14px;cursor:pointer;',
    'background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-lg);color:var(--text);font:600 15.5px/1.35 var(--body,inherit);transition:transform .12s ease,border-color .12s ease,background .12s ease}',
    '.qz-opt:hover:not(:disabled){border-color:var(--accent);transform:translateY(-2px)}',
    '.qz-opt:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.qz-opt:disabled{cursor:default;transform:none}',
    '.qz-abcd{flex:0 0 auto;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--surface2);border:1px solid var(--line);font:700 12px var(--body,inherit);color:var(--muted)}',
    '.qz-opt.sel{border-color:var(--accent2);box-shadow:0 0 0 2px var(--accent2) inset}',
    '.qz-opt.sel .qz-abcd{background:var(--accent2);border-color:var(--accent2);color:var(--bg2)}',
    '.qz-opt.lock{animation:qz-pulse 1.1s ease infinite}',
    '@keyframes qz-pulse{0%,100%{box-shadow:0 0 0 2px var(--accent2) inset}50%{box-shadow:0 0 0 5px var(--accent2) inset}}',
    '.qz-opt.is-right{background:var(--surface2);border-color:var(--good)}',
    '.qz-opt.is-right .qz-abcd{background:var(--good);border-color:var(--good);color:var(--bg2)}',
    '.qz-opt.is-warm{border-style:dashed;border-color:var(--accent2)}',   /* the miss: a nudge, never a red X */
    '.qz-opt.is-off{opacity:.4}',

    '.qz-life{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:14px}',
    '.qz-lbtn{cursor:pointer;min-height:44px;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--text);font:700 12.5px var(--body,inherit)}',
    '.qz-lbtn:hover:not(:disabled){border-color:var(--accent)}',
    '.qz-lbtn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.qz-lbtn:disabled{opacity:.4;cursor:default;text-decoration:line-through}',
    '.qz-lbtn.armed{border-color:var(--accent2);box-shadow:0 0 0 2px var(--surface2)}',

    '.qz-feed{min-height:22px;margin:12px 0 0;text-align:center;font-size:14.5px;font-weight:600;color:var(--muted)}',
    '.qz-feed.good{color:var(--good)}',
    '.qz-feed.warm{color:var(--accent2)}',
    '.qz-hint{font-size:12.5px;color:var(--muted);text-align:center;margin:10px 0 0}',
    '.qz-teach{margin-top:12px;background:var(--surface2);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:var(--radius-lg);padding:var(--space-lg);font-size:15px;line-height:1.6}',
    '.qz-teach b{color:var(--accent2)}',
    '.qz-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:14px}',
    '.qz-btn{cursor:pointer;min-height:46px;padding:11px 22px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:var(--bg2);font:700 15px var(--body,inherit)}',
    '.qz-btn.ghost{background:transparent;color:var(--text);border-color:var(--line)}',
    '.qz-btn:hover:not(:disabled){filter:brightness(1.06)}',
    '.qz-btn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.qz-btn:disabled{opacity:.5;cursor:default}',

    /* the money-ladder rail — always visible on wide screens, a toggle on small */
    '.qz-rail{flex:0 0 158px;background:var(--bg2);border:1px solid var(--line);border-radius:var(--radius-lg);padding:12px;display:none}',
    '.qz-rail.open{display:block}',
    '@media(min-width:760px){.qz-rail{display:block}.qz-railbtn{display:none}}',
    '.qz-railbtn{cursor:pointer;min-height:36px;padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--text);font:700 12px var(--body,inherit)}',
    '.qz-railbtn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.qz-rung{display:flex;justify-content:space-between;gap:8px;padding:3px 8px;border-radius:8px;font:600 12.5px var(--body,inherit);color:var(--muted)}',
    '.qz-rung.haven{font-weight:800;color:var(--text)}',
    '.qz-rung.past{color:var(--good)}',
    '.qz-rung.now{background:var(--accent);color:var(--bg2)}',

    /* category chips (Trivia Master setup) */
    '.qz-cats{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:12px 0}',
    '.qz-cat{cursor:pointer;min-height:44px;padding:9px 16px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--muted);font:700 13.5px var(--body,inherit)}',
    '.qz-cat[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--bg2)}',
    '.qz-cat:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.qz-cat:disabled{opacity:.4;cursor:default}',
    '.qz-cat.all{border-style:dashed}',
    '.qz-modes{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:4px 0 10px}',
    '.qz-clock{font-variant-numeric:tabular-nums}',
    '.qz-note{font-size:13px;color:var(--muted);text-align:center;margin:8px 0 0}',

    /* THE MISS CARD (docs/32): "Not quite." in words, the right answer, its teach, and Aage */
    '.qz-wrap .gm-miss{margin-top:12px;background:var(--surface2);border:1px solid var(--line);border-left:4px solid var(--accent2);border-radius:var(--radius-lg);padding:var(--space-lg);font-size:15.5px;line-height:1.6;text-align:left}',
    '.qz-wrap .gm-miss b{color:var(--text)}',
    '.qz-wrap .gm-ans{font-weight:700;color:var(--text)}',
    '.qz-wrap .gm-teach{margin:6px 0 10px;color:var(--text)}',
    '.qz-wrap .gm-aage{min-height:46px}',

    /* the phone: the action row and lifelines sit on a strip above the tab bar (games spec §1.6, §4.1.5) */
    '@media(max-width:720px){.qz-dock{position:sticky;bottom:calc(74px + env(safe-area-inset-bottom));z-index:6;background:var(--bg2);border:1px solid var(--line);border-radius:var(--radius-lg);padding:8px;margin-top:12px;box-shadow:0 6px 22px rgba(30,20,70,.14)}',
    '.qz-dock .qz-life,.qz-dock .qz-row{margin-top:6px}}',

    '.qz-done{text-align:center}',
    '.qz-done h3{font:800 24px var(--display,Georgia,serif);margin:6px 0 4px}',
    '.qz-done p{margin:0 0 4px;font-size:15.5px;line-height:1.55;color:var(--muted)}',
    '.qz-chips{display:inline-flex;gap:14px;flex-wrap:wrap;justify-content:center;margin:12px 0 2px}',
    '.qz-chip{background:var(--surface2);border:1px solid var(--line);border-radius:999px;padding:7px 16px;font:700 14px var(--body,inherit)}',
    '.qz-chip b{color:var(--accent2);font-size:17px}',

    '@media(prefers-reduced-motion:reduce){.qz-wrap *,.qz-wrap *:before,.qz-wrap *:after{animation:none!important;transition:none!important}',
    '.qz-opt:hover:not(:disabled){transform:none}}'
  ].join('');

  var cssDone = false;
  function injectCSS() {
    if (cssDone || !D) return;
    cssDone = true;
    if (D.getElementById('qz-css')) return;
    var s = D.createElement('style');
    s.id = 'qz-css';
    s.appendChild(D.createTextNode(CSS));
    (D.head || D.documentElement).appendChild(s);
  }

  /* ==================================================================
     SMALL HELPERS — same idiom as games.js, kept local to this file
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
  function kidAge() {
    try { var a = W.BI && W.BI.S && +W.BI.S.age; return (a && a > 0) ? a : 8; }
    catch (e) { return 8; }
  }
  function firstSentence(t) {
    var m = String(t || '').match(/^[^.!?]*[.!?]?/);
    return m ? m[0].trim() : '';
  }
  function inr(n) {
    try { return n.toLocaleString('en-IN'); } catch (e) { return String(n); }
  }

  /* Does `text` give away `answer`? Word-boundary check on every meaningful
     word of the answer: 4+ letters always, 3 letters when they are a proper
     name in the original ("Goa", "Gir") rather than a stopword ("the"). */
  function leaks(text, answer) {
    var words = String(answer).split(/[^A-Za-z]+/), i, w;
    text = String(text || '');
    for (i = 0; i < words.length; i++) {
      w = words[i];
      if (w.length < 3) continue;
      if (w.length === 3 && w.charAt(0) === w.charAt(0).toLowerCase()) continue;
      if (new RegExp('\\b' + w + '\\b', 'i').test(text)) return true;
    }
    return false;
  }

  /* Praise, never scolding. */
  var CHEERS = ['Shabaash!', 'Bahut khoob!', 'Wah!', 'Ekdum sahi!', 'Kya baat!', 'Very good!'];

  /* run-scope for timers and listeners so teardown is always clean */
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
      on: function (target, type, fn) {
        if (!target || !target.addEventListener) return;
        target.addEventListener(type, fn, false);
        offs.push(function () { target.removeEventListener(type, fn, false); });
      },
      kill: function () {
        if (dead) return;
        dead = true;
        for (var i = 0; i < timers.length; i++) { W.clearTimeout(timers[i]); W.clearInterval(timers[i]); }
        for (var j = 0; j < offs.length; j++) { try { offs[j](); } catch (e) {} }
        timers = []; offs = [];
      }
    };
  }
  function detached(host) {
    return !!(D && D.body && host && host.nodeType === 1 && !D.body.contains(host));
  }
  function teardownOf(sc, extra) {
    var fn = function () { sc.kill(); if (extra) { try { extra(); } catch (e) {} } };
    fn.destroy = fn;
    return fn;
  }

  /* ==================================================================
     THE QUESTION FACTORY
     Every question: { key, cat, band, q, a, pool, hint, teach }
       key   — stable id so a session never repeats a question
       band  — 'easy' | 'mid' | 'hard' (drives the gyanpati ladder)
       pool  — every valid distractor; three are drawn fresh at ask time
       hint  — Nani's warm nudge, derived from the fact's own data,
               never revealing (the leak check applies to it too)
       teach — the one warm line told after a miss: the teaching beat
     ================================================================== */

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  /* Boundary-sensitive geometry is never a game token (see the map rule in
     CLAUDE.md and the same skip in games.js). And any region holding a
     pending sub-state (Telangana inside AP, Ladakh inside JK) is skipped
     for monument/place questions — the shipped geometry would make the
     "right" answer wrong on today's map, and we do not teach stale facts. */
  var GEO_SKIP = { JK: 1, LA: 1 };

  /* Session memory: a question shown once is not shown again until the
     fresh ones run out. Lives at file scope so it spans both stalls. */
  var ASKED = {};

  function geoList() {
    var geo = W.IND_GEO && W.IND_GEO.states, out = [], code, g;
    if (!geo) return out;
    for (code in geo) {
      if (!geo.hasOwnProperty(code) || GEO_SKIP[code]) continue;
      g = geo[code];
      if (!g || !g.name || !g.capital) continue;
      out.push({ code: code, name: g.name, capital: g.capital, fact: g.fact || '',
                 isState: !g.type || g.type === 'state' });
    }
    return out;
  }
  function pendingParents() {
    var p = (W.IND_GEO && W.IND_GEO.pending) || [], map = {}, i;
    for (i = 0; i < p.length; i++) if (p[i] && p[i].inside) map[p[i].inside] = 1;
    return map;
  }

  function buildBank() {
    var age = kidAge();
    var bank = { naksha: [], itihaas: [], utsav: [], khazana: [], mahakavya: [] };

    /* the single gate every question passes: distractors from the same field,
       deduped, at least three of them; and the answer never appears in the
       question or the hint. */
    function add(cat, band, key, q, a, pool, hint, teach) {
      a = String(a || ''); q = String(q || ''); hint = String(hint || '');
      if (!a || !q) return;
      var seen = {}, clean = [], i, p;
      for (i = 0; i < pool.length; i++) {
        p = String(pool[i] || '');
        if (!p || p.toLowerCase() === a.toLowerCase() || seen[p.toLowerCase()]) continue;
        seen[p.toLowerCase()] = 1;
        clean.push(p);
      }
      if (clean.length < 3) return;
      if (leaks(q, a) || (hint && leaks(hint, a))) return;
      bank[cat].push({ key: key, cat: cat, band: band, q: q, a: a, pool: clean,
                       hint: hint, teach: String(teach || '') });
    }

    var geo = geoList(), i, j, s;
    var names = [], caps = [], stateNames = [];
    for (i = 0; i < geo.length; i++) {
      names.push(geo[i].name);
      caps.push(geo[i].capital);
      if (geo[i].isState) stateNames.push(geo[i].name);
    }

    /* ---- NAKSHA · capitals (easy) ------------------------------------ */
    try {
      var capCount = {};
      for (i = 0; i < geo.length; i++) capCount[geo[i].capital] = (capCount[geo[i].capital] || 0) + 1;
      for (i = 0; i < geo.length; i++) {
        s = geo[i];
        if (!leaks(s.name, s.capital) && !leaks(s.capital, s.name)) {
          add('naksha', 'easy', 'cap:' + s.code,
              'Which city is the capital of ' + s.name + '?',
              s.capital, caps,
              'Nani says: the city you want begins with "' + s.capital.charAt(0) + '", beta.',
              s.capital + ' is the capital of ' + s.name + ' — mark it on your yatra map.');
        }
        /* a capital two states share (Chandigarh) can never be a fair question */
        if (s.isState && capCount[s.capital] === 1 && !leaks(s.capital, s.name)) {
          add('naksha', 'easy', 'caprev:' + s.code,
              'Which state has its capital at ' + s.capital + '?',
              s.name, stateNames,
              leaks(s.fact, s.name) ? 'Nani says: its name begins with "' + s.name.charAt(0) + '", beta.'
                                    : 'Nani says: ' + firstSentence(s.fact),
              s.capital + ' is the capital of ' + s.name + '.');
        }
      }
    } catch (e) {}

    /* ---- NAKSHA · monuments (mid) ------------------------------------ */
    try {
      var mons = (W.IND_GEO && W.IND_GEO.monuments) || [];
      var pend = pendingParents();
      var byCode = {};
      for (i = 0; i < geo.length; i++) byCode[geo[i].code] = geo[i];
      for (i = 0; i < mons.length; i++) {
        var m = mons[i];
        if (!m || !m.name || !m.state || pend[m.state] || GEO_SKIP[m.state]) continue;
        var home = byCode[m.state];
        if (!home) continue;
        add('naksha', 'mid', 'mon:' + m.id,
            'Where would you travel to stand in front of ' + m.name + '?',
            home.name, names,
            leaks(m.fact, home.name) ? 'Nani says: think of the map — it begins with "' + home.name.charAt(0) + '", beta.'
                                     : 'Nani says: ' + firstSentence(m.fact),
            m.name + ' stands in ' + home.name + (m.when ? ' — ' + m.when + '.' : '.'));
      }
    } catch (e) {}

    /* ---- NAKSHA · places and trivia from the state pages (mid) ------- */
    try {
      var ST = W.IND_STATES;
      if (ST) {
        for (i = 0; i < geo.length; i++) {
          s = geo[i];
          var rec = ST[s.code];
          if (!rec) continue;
          var places = (rec.places || []).slice(0, 2);
          for (j = 0; j < places.length; j++) {
            var pl = places[j];
            if (!pl || !pl.name || leaks(pl.name, s.name) || leaks(s.name, pl.name)) continue;
            add('naksha', 'mid', 'place:' + s.code + ':' + j,
                'Where in India would you go to see ' + pl.name + '?',
                s.name, names,
                (pl.what && !leaks(pl.what, s.name)) ? 'Nani says: ' + firstSentence(pl.what)
                                                     : 'Nani says: its capital is ' + (leaks(s.capital, s.name) ? 'a city beginning with "' + s.name.charAt(0) + '"' : s.capital) + ', beta.',
                pl.name + ' is in ' + s.name + (pl.what ? ' — ' + firstSentence(pl.what) : '.'));
          }
          var triv = (rec.trivia || []).slice(0, 2);
          for (j = 0; j < triv.length; j++) {
            if (!triv[j] || leaks(triv[j], s.name)) continue;
            add('naksha', 'mid', 'triv:' + s.code + ':' + j,
                'Where is this? ' + triv[j],
                s.name, names,
                leaks(s.capital, s.name) ? 'Nani says: it begins with "' + s.name.charAt(0) + '", beta.'
                                         : 'Nani says: its capital is ' + s.capital + ', beta.',
                'That one is ' + s.name + ' — capital ' + rec.capital + '.');
          }
        }
      }
    } catch (e) {}

    /* ---- KHAZANA · state animals, birds and dishes ------------------- */
    try {
      var ST2 = W.IND_STATES;
      if (ST2) {
        var animals = [], birds = [], dishes = [];
        for (i = 0; i < geo.length; i++) {
          var r0 = ST2[geo[i].code];
          if (!r0) continue;
          if (r0.symbols && r0.symbols.animal) animals.push(r0.symbols.animal);
          if (r0.symbols && r0.symbols.bird) birds.push(r0.symbols.bird);
          for (j = 0; j < (r0.food || []).length; j++) if (r0.food[j].dish) dishes.push(r0.food[j].dish);
        }
        for (i = 0; i < geo.length; i++) {
          s = geo[i];
          var r = ST2[s.code];
          if (!r) continue;
          if (r.symbols && r.symbols.animal) {
            add('khazana', 'easy', 'animal:' + s.code,
                'Which animal is the state animal of ' + s.name + '?',
                r.symbols.animal, animals,
                'Nani says: it begins with "' + r.symbols.animal.charAt(0) + '", beta.',
                s.name + '’s own state animal is the ' + r.symbols.animal + '.');
          }
          if (r.symbols && r.symbols.bird) {
            add('khazana', 'easy', 'bird:' + s.code,
                'Which bird is the state bird of ' + s.name + '?',
                r.symbols.bird, birds,
                'Nani says: it begins with "' + r.symbols.bird.charAt(0) + '", beta.',
                s.name + '’s own state bird is the ' + r.symbols.bird + '.');
          }
          var own = {};
          for (j = 0; j < (r.food || []).length; j++) own[String(r.food[j].dish).toLowerCase()] = 1;
          var foods = (r.food || []).slice(0, 2);
          for (j = 0; j < foods.length; j++) {
            var f = foods[j];
            if (!f || !f.dish || leaks(f.dish, s.name)) continue;
            var pool = [];
            for (var k = 0; k < dishes.length; k++) if (!own[dishes[k].toLowerCase()]) pool.push(dishes[k]);
            add('khazana', 'mid', 'food:' + s.code + ':' + j,
                'Which of these would you taste in ' + s.name + '?',
                f.dish, pool,
                (f.what && !leaks(f.what, f.dish)) ? 'Nani says: ' + firstSentence(f.what)
                                                   : 'Nani says: it begins with "' + f.dish.charAt(0) + '", beta.',
                f.dish + ' — ' + (f.what ? firstSentence(f.what) : s.name + '’s own plate.'));
          }
        }
      }
    } catch (e) {}

    /* ---- UTSAV · which months a festival can fall in ------------------
       Honest by construction: the data carries months, never dates, because
       most of these follow a lunar or lunisolar reckoning. So the question
       is "which of these months CAN it fall in", and every distractor is a
       month the data says it cannot. needs_review entries are skipped, and
       no festival is ever "the biggest" — each is simply itself. */
    try {
      var fests = (W.IND_UTSAV && W.IND_UTSAV.festivals) || [];
      for (i = 0; i < fests.length; i++) {
        var fe = fests[i];
        if (!fe || !fe.name || fe.needs_review === true) continue;
        var ms = fe.months || [];
        if (!ms.length || ms.length > 3) continue;   /* Eid walks the whole year — no fair distractors exist */
        var notIn = [], im;
        for (im = 0; im < MONTHS.length; im++) {
          var found = false;
          for (j = 0; j < ms.length; j++) if (String(ms[j]).toLowerCase() === MONTHS[im].toLowerCase()) found = true;
          if (!found) notIn.push(MONTHS[im]);
        }
        var kidLine = firstSentence(fe.kid);
        add('utsav', 'mid', 'fest:' + (fe.id || fe.name),
            'In which of these months can ' + fe.name + ' come round?',
            ms[0], notIn,
            (kidLine && !leaks(kidLine, fe.name)) ? 'Nani says: ' + kidLine
                                                  : 'Nani says: think of the season it belongs to, beta.',
            fe.name + ' can come in ' + ms.join(' or ') + ' — the day is set by the calendar your family keeps.');
      }
    } catch (e) {}

    /* ---- ITIHAAS · eras, moments, figures (hard) ----------------------
       The gates in the data are the law: anything gated above this child's
       age band stays out, and needs_review eras stay out entirely. On top of
       that, a keyword screen keeps quiz mechanics away from ground that
       editorial policy sends to a human author — a quiz buzzer is the wrong
       room for it even when the era itself is visible. */
    var SENSITIVE = /partition|caste|massacre|jallianwala|riot|execut|hanged|communal/i;
    try {
      var eras = (W.IND_ITIHAAS && W.IND_ITIHAAS.eras) || [];
      var vis = [], whens = [], figNames = [];
      for (i = 0; i < eras.length; i++) {
        var er = eras[i];
        if (!er || !er.title || !er.when) continue;
        if (er.needs_review === true) continue;
        if ((er.gate || 4) > age) continue;
        vis.push(er);
        whens.push(er.when);
        for (j = 0; j < (er.figures || []).length; j++) {
          if (er.figures[j] && er.figures[j].name) figNames.push(er.figures[j].name);
        }
      }
      for (i = 0; i < vis.length; i++) {
        var era = vis[i];
        add('itihaas', 'hard', 'era:' + era.id,
            '"' + era.title + '" — when does that sit on the river of time?',
            era.when, whens,
            (era.hook && !leaks(era.hook, era.when)) ? 'Nani says: ' + firstSentence(era.hook)
                                                     : 'Nani says: sail the river slowly, beta.',
            era.title + ' — ' + era.when + '. ' + firstSentence(era.hook || ''));

        var moms = era.moments || [];
        for (j = 0; j < moms.length; j++) {
          var mo = moms[j];
          if (!mo || !mo.when || !mo.what || !/\d/.test(mo.when)) continue;
          if (SENSITIVE.test(mo.what)) continue;
          /* the year must not already sit in the sentence */
          var yrs = String(mo.when).match(/\d{3,4}/g) || [], leakYr = false, y;
          for (y = 0; y < yrs.length; y++) if (mo.what.indexOf(yrs[y]) >= 0) leakYr = true;
          if (leakYr) continue;
          var mwPool = [];
          for (var v = 0; v < vis.length; v++) {
            if (vis[v].id === era.id) continue;
            for (var w2 = 0; w2 < (vis[v].moments || []).length; w2++) {
              var ow = vis[v].moments[w2] && vis[v].moments[w2].when;
              if (ow && /\d/.test(ow)) mwPool.push(ow);
            }
          }
          add('itihaas', 'hard', 'mom:' + era.id + ':' + j,
              'Around when did this happen? ' + mo.what,
              mo.when, mwPool,
              'Nani says: that is from the time of "' + era.title + '", beta.',
              mo.when + ' — in the days of ' + era.title + '.');
        }

        var figs = era.figures || [];
        for (j = 0; j < figs.length; j++) {
          var fg = figs[j];
          if (!fg || !fg.name || !fg.line) continue;
          if (SENSITIVE.test(fg.line)) continue;
          if (leaks(fg.line, fg.name)) continue;
          var fnPool = [];
          for (var fnI = 0; fnI < figNames.length; fnI++) {
            if (figNames[fnI] === fg.name) continue;
            if (leaks(fg.line, figNames[fnI])) continue;   /* a name the line mentions can't be a fair distractor */
            fnPool.push(figNames[fnI]);
          }
          add('itihaas', 'hard', 'fig:' + era.id + ':' + j,
              'Who is this? ' + fg.line,
              fg.name, fnPool,
              'Nani says: look in the time of "' + era.title + '", beta.',
              fg.name + ' — ' + firstSentence(fg.line));
        }
      }
    } catch (e) {}

    /* ---- MAHAKAVYA · who's who in the epics (hard) -------------------- */
    try {
      var cast = W.IND_EPIC_CAST;
      if (cast) {
        var byEpic = { ramayana: [], mahabharata: [] }, id2;
        for (id2 in cast) {
          if (!cast.hasOwnProperty(id2)) continue;
          var c = cast[id2];
          if (c && c.name && c.desc && byEpic[c.of]) byEpic[c.of].push(c);
        }
        var epics = ['ramayana', 'mahabharata'], epicLabel = { ramayana: 'Ramayana', mahabharata: 'Mahabharata' };
        for (i = 0; i < epics.length; i++) {
          var group = byEpic[epics[i]];
          for (j = 0; j < group.length; j++) {
            var ch = group[j];
            var aliasLeak = false, al = ch.alias || [];
            for (var a2 = 0; a2 < al.length; a2++) if (leaks(ch.desc, al[a2])) aliasLeak = true;
            if (aliasLeak || leaks(ch.desc, ch.name)) continue;
            var castPool = [];
            for (var cp = 0; cp < group.length; cp++) {
              if (group[cp].name === ch.name) continue;
              if (leaks(ch.desc, group[cp].name)) continue;   /* named in the clue — not a fair distractor */
              castPool.push(group[cp].name);
            }
            add('mahakavya', 'hard', 'epic:' + epics[i] + ':' + ch.name,
                'Who is this, in the ' + epicLabel[epics[i]] + '? ' + ch.desc,
                ch.name, castPool,
                'Nani says: the name begins with "' + ch.name.charAt(0) + '", beta.',
                ch.name + ' — ' + ch.desc);
          }
        }
      }
    } catch (e) {}

    return bank;
  }

  function bandLists(bank) {
    var out = { easy: [], mid: [], hard: [] }, cat, i;
    for (cat in bank) {
      if (!bank.hasOwnProperty(cat)) continue;
      for (i = 0; i < bank[cat].length; i++) out[bank[cat][i].band].push(bank[cat][i]);
    }
    return out;
  }


  /* prefer questions this session has not seen; fall back gracefully */
  function pickFresh(list, n) {
    var mixed = shuffle(list), fresh = [], seen = [], i;
    for (i = 0; i < mixed.length; i++) (ASKED[mixed[i].key] ? seen : fresh).push(mixed[i]);
    return fresh.concat(seen).slice(0, n);
  }

  /* ==================================================================
     DETERMINISM — nothing in the reward path is random (games spec §4.1.4)
     A question's three distractors, its 50:50 and Gattu's guess are all
     fixed by the question's own key: the same question gives the same
     result every time. Only the ORDER of the four options is shuffled,
     because a fixed order would teach a position, not a fact.
     ================================================================== */

  function hash(str) {
    var h = 2166136261, i;
    str = String(str);
    for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function byHash(list, salt) {
    return list.slice().sort(function (a, b) { return hash(salt + '|' + a) - hash(salt + '|' + b); });
  }

  /* four options, letters A–D, answer index recorded. The distractors are the
     question's own three (seeded by its key); the order is shuffled per ask. */
  function dealOptions(q) {
    var opts = shuffle([q.a].concat(byHash(q.pool, q.key + '|d').slice(0, 3))), i, ans = 0;
    for (i = 0; i < opts.length; i++) if (opts[i] === q.a) ans = i;
    return { options: opts, answer: ans };
  }

  /* 50:50 — the two wrong options it closes, as texts, fixed per question */
  function fiftyOff(q, options) {
    var wrong = [], i;
    for (i = 0; i < options.length; i++) if (options[i] !== q.a) wrong.push(options[i]);
    return byHash(wrong, q.key + '|5050').slice(0, 2);
  }
  /* Gattu ka Guess — right on a fixed schedule (about 6 questions in 10), and
     when he is wrong, wrong the same way every time. Returns the text he taps. */
  function gattuRight(q) { return hash(q.key + '|gattu') % 100 < 60; }
  function gattuPick(q, open) {
    if (gattuRight(q) || open.length < 2) return q.a;
    var wrong = [], i;
    for (i = 0; i < open.length; i++) if (open[i] !== q.a) wrong.push(open[i]);
    return byHash(wrong, q.key + '|g')[0];
  }
  /* Poochho Nani — one line out of the question's own teach text with the
     answer taken out of it; when masking cannot make it safe, the leak-checked
     hint built from the same record. Never the answer. */
  var NANI_SKIP = { mark: 1, your: 1, yatra: 1, that: 1, this: 1, with: 1, from: 1, days: 1, calendar: 1, family: 1,
                    keeps: 1, come: 1, round: 1, state: 1, animal: 1, bird: 1, capital: 1, stands: 1, time: 1, there: 1 };
  function naniClue(q) {
    var t = String(q.teach || ''), a = String(q.a), parts, i, p;
    if (t) {
      var low = t.toLowerCase(), al = a.toLowerCase(), at;
      while ((at = low.indexOf(al)) >= 0) { t = t.slice(0, at) + '…' + t.slice(at + a.length); low = t.toLowerCase(); }
      parts = a.split(/[\s,;:()–—-]+/);
      for (i = 0; i < parts.length; i++) {
        p = parts[i].replace(/[^A-Za-z0-9]/g, '');
        if (p.length < 3 && !/\d/.test(p)) continue;
        t = t.replace(new RegExp('\\b' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), '…');
      }
      t = firstSentence(t.replace(/^[\s…—–-]+/, '')) || t;
      var digits = a.match(/\d+/g) || [], bad = leaks(t, a);
      for (i = 0; i < digits.length; i++) if (t.indexOf(digits[i]) >= 0) bad = true;
      /* a clue has to add something: a teach line that only says the question back is no clue */
      var qw = String(q.q).toLowerCase(), fresh = 0, ws = t.toLowerCase().match(/[a-z]{4,}/g) || [];
      for (i = 0; i < ws.length; i++) if (qw.indexOf(ws[i]) < 0 && !NANI_SKIP[ws[i]]) fresh++;
      if (!bad && fresh >= 3) return 'Nani says: ' + t;
    }
    return q.hint || 'Nani smiles: think of what we read together, beta.';
  }

  var LETTERS = ['A', 'B', 'C', 'D'];

  function optionsHTML(opts) {
    var h = '<div class="qz-opts" role="group" aria-label="Choose an answer">', i;
    for (i = 0; i < opts.length; i++) {
      h += '<button type="button" class="qz-opt" data-i="' + i + '">' +
             '<span class="qz-abcd" aria-hidden="true">' + LETTERS[i] + '</span>' +
             '<span>' + esc(opts[i]) + '</span></button>';
    }
    return h + '</div>';
  }

  /* THE MISS CARD (docs/32, games spec §1.4) — the same markup in every engine */
  function missHTML(answer, teach) {
    return '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">' + esc(answer) + '</span>' +
      '<p class="gm-teach">' + esc(teach) + '</p>' +
      '<button type="button" class="qz-btn gm-aage" data-gm="aage" data-go="aage">Aage →</button></div>';
  }

  /* ==================================================================
     A CHILD'S OWN QUESTIONS, ON ANOTHER DAY (games spec §4.1.2)
     The ladder's first three rungs re-ask what this child missed on an
     earlier day: spaced retrieval, which is the point of asking again.
     Kept per child through the Store seam (IND_STORE.kidGet/kidSet);
     without it, nothing is remembered and nothing claims to be.
     ================================================================== */

  var MEM_KEY = 'india.gyanpati.v1';
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function memLoad() {
    try {
      if (!W.IND_STORE || !W.IND_STORE.kidGet) return null;
      var m = JSON.parse(W.IND_STORE.kidGet(MEM_KEY) || 'null');
      return (m && typeof m === 'object' && m.miss) ? m : { miss: {} };
    } catch (e) { return { miss: {} }; }
  }
  function memSave(m) {
    try {
      if (!m || !W.IND_STORE || !W.IND_STORE.kidSet) return false;
      var keys = Object.keys(m.miss);
      if (keys.length > 80) {
        keys.sort(function (a, b) { return m.miss[a] < m.miss[b] ? -1 : 1; });
        for (var i = 0; i < keys.length - 80; i++) delete m.miss[keys[i]];
      }
      W.IND_STORE.kidSet(MEM_KEY, JSON.stringify(m));
      return true;
    } catch (e) { return false; }
  }

  /* ==================================================================
     KAUN BANEGA GYANPATI? — the one quiz (games spec §4.1)
     Fifteen rungs, easy to hard; a miss is taught and waits for Aage.
     It absorbed Trivia Master: the category picker and, for the older
     children, a 60-second sprint. Nothing stacks, nothing multiplies.

     The engine reports to the host (docs/32): one answer() per rung at
     its first attempt, and done({win, score, asked, firstTryRight, level,
     levelNext, rung, lifelines}). `rung` is how high the climb went on
     first-try rights from the bottom with no lifeline; the host pays the
     ladder's `contest` from that, never from anything random.
     ================================================================== */

  var CATS = [
    { id: 'naksha',    label: 'Naksha',    en: 'maps & states' },
    { id: 'itihaas',   label: 'Itihaas',   en: 'history' },
    { id: 'utsav',     label: 'Utsav',     en: 'festivals' },
    { id: 'khazana',   label: 'Khazana',   en: 'food & symbols' },
    { id: 'mahakavya', label: 'Mahakavya', en: 'the epics' }
  ];
  /* how many easy · middle · hard rungs each level climbs */
  var MIX = { 1: [8, 5, 2], 2: [6, 5, 4], 3: [5, 5, 5], 4: [3, 5, 7], 5: [2, 5, 8] };
  var LEVELS = [
    'mostly easy rungs: capitals and state symbols',
    'easy into the middle: places and festivals',
    'the classic climb: five easy, five middle, five hard',
    'more middle and hard rungs',
    'the hard end: history and the epics'
  ];
  var SPRINT_MS = 60000;
  var BAND_RANK = { easy: 0, mid: 1, hard: 2 };

  function clampLevel(l) { l = parseInt(l, 10); return l >= 1 && l <= 5 ? l : 3; }
  function bandOfAge(a) { return a <= 7 ? '4-7' : a <= 10 ? '8-10' : '11-12'; }
  function inScope(q, scope) {
    if (!scope || !scope.set || !scope.set.length) return true;
    var id = String(q.key).split(':')[1];
    for (var i = 0; i < scope.set.length; i++) {
      var s = String(scope.set[i]);
      if (s === q.cat || s === q.key || s === id) return true;
    }
    return false;
  }

  function gyanpati(host, opts, done) {
    opts = opts || {};
    var sc = scope();
    injectCSS();
    var slow = !!opts.reduced || reducedMotion();
    var bank = buildBank();
    var HARD = opts.skin === 'mode-gyanpati-hard';
    var level = clampLevel(opts.level);
    var band = opts.band || bandOfAge(kidAge());
    /* the sprint is for the older children only, and never in Calm mode */
    var sprintable = !opts.calm && (band === '11-12' || (band === '8-10' && kidAge() >= 9));
    var scopeObj = (opts.scope && opts.scope.set && opts.scope.set.length) ? opts.scope : null;
    var on = {}, i;
    for (i = 0; i < CATS.length; i++) on[CATS[i].id] = bank[CATS[i].id].length > 0;
    var sprint = false;
    var mem = memLoad();

    var phase = 'setup', qs = [], total = 0, idx = 0, got = 0, marks = [], asked = 0;
    var selected = -1, deal = null, current = null, finished = false, railOpen = false, result = null;
    var lifelines = { fifty: false, nani: false, gattu: false }, lifeUsedOn = {}, anyLife = false, lifeArmed = false;
    var rung = 0, climbing = true, reviewN = 0;
    var clock = { left: SPRINT_MS, last: 0, raf: 0, held: false };

    function pool() {
      var out = [], c, k;
      for (k = 0; k < CATS.length; k++) {
        c = CATS[k].id;
        if (!on[c]) continue;
        for (var j = 0; j < bank[c].length; j++) if (inScope(bank[c][j], scopeObj)) out.push(bank[c][j]);
      }
      return out;
    }

    /* the ladder: yesterday's (or any earlier day's) misses first, then the climb */
    function plan() {
      var all = pool(), byBand = { easy: [], mid: [], hard: [] }, byKey = {}, k;
      for (k = 0; k < all.length; k++) { byBand[all[k].band].push(all[k]); byKey[all[k].key] = all[k]; }
      var review = [], t = today();
      if (mem && !HARD) {
        var old = Object.keys(mem.miss).filter(function (key) { return mem.miss[key] < t && byKey[key]; });
        old.sort(function (a, b) { return mem.miss[a] < mem.miss[b] ? -1 : mem.miss[a] > mem.miss[b] ? 1 : 0; });
        for (k = 0; k < old.length && review.length < 3; k++) review.push(byKey[old[k]]);
      }
      var have = {};
      for (k = 0; k < review.length; k++) have[review[k].key] = 1;
      var mix = HARD ? [0, 5, 10] : MIX[level], climb = [];
      function take(list, n) {
        var got2 = pickFresh(list.filter(function (q) { return !have[q.key]; }), n);
        for (var m = 0; m < got2.length; m++) { have[got2[m].key] = 1; climb.push(got2[m]); }
      }
      take(byBand.easy, mix[0]); take(byBand.mid, mix[1]); take(byBand.hard, mix[2]);
      /* a thin band borrows from its neighbours, so the ladder still stands */
      var want = 15 - review.length;
      if (climb.length < want) take(HARD ? byBand.mid.concat(byBand.hard) : all, want - climb.length);
      climb = climb.slice(0, want);
      climb.sort(function (a, b) { return BAND_RANK[a.band] - BAND_RANK[b.band]; });
      reviewN = review.length;
      qs = review.concat(climb);
      total = qs.length;
    }

    function hook() {
      host.__qzState = {
        game: 'gyanpati', ladder: HARD ? 'hard' : 'classic', level: level, sprint: sprint, sprintable: sprintable,
        cats: JSON.parse(JSON.stringify(on)), bands: qs.map(function (q) { return q.band; }), review: reviewN,
        phase: phase, qIndex: idx, total: total, key: current ? current.key : '',
        question: current ? current.q : '', options: deal ? deal.options : [],
        answerIndex: deal ? deal.answer : -1, selected: selected,
        correct: got, asked: asked, marks: marks.slice(), rung: rung, secured: idx,
        lifelines: { fifty: lifelines.fifty, nani: lifelines.nani, gattu: lifelines.gattu },
        timeLeft: sprint ? Math.ceil(clock.left / 1000) : null,
        result: result
      };
    }

    function say(msg, tone) {
      var f = host.querySelector('.qz-feed');
      if (!f) return;
      f.textContent = msg || '';
      f.className = 'qz-feed' + (tone ? ' ' + tone : '');
    }
    function optionEls() { return host.querySelectorAll('.qz-opt'); }

    function railHTML() {
      if (sprint) return '';
      var h = '<div class="qz-rail' + (railOpen ? ' open' : '') + '" aria-label="The ladder">', k;
      for (k = total - 1; k >= 0; k--) {
        var cls = 'qz-rung' + (marks[k] === 1 ? ' past' : '') + (k === idx && phase !== 'end' ? ' now' : '');
        h += '<div class="' + cls + '"><span>' + (k + 1) + '</span><span>' +
             (marks[k] === 1 ? '✓ knew it' : marks[k] === 0 ? 'learned it' : (k < reviewN ? 'again' : (qs[k] ? ({ easy: 'easy', mid: 'middle', hard: 'hard' })[qs[k].band] : ''))) +
             '</span></div>';
      }
      return h + '</div>';
    }

    function frame(inner) {
      host.innerHTML =
        '<div class="qz-wrap">' +
          '<div class="qz-hud">' +
            '<div><span class="qz-kicker">Mela · ' + (sprint ? 'the 60-second sprint' : HARD ? 'the hard ladder' : 'the ladder quiz') + '</span><b>Kaun Banega Gyanpati?</b></div>' +
            (phase === 'setup' ? '' :
            '<div style="display:flex;gap:8px;align-items:center">' +
              (sprint ? '<span class="qz-pot qz-clock" data-role="timer">⏱ ' + Math.ceil(clock.left / 1000) + 's</span>' : '') +
              '<span class="qz-pot">Knew <b>' + got + '</b>' + (sprint ? '' : ' of ' + total) + '</span>' +
              (sprint ? '' : '<button type="button" class="qz-railbtn" data-go="rail" aria-expanded="' + railOpen + '">Ladder</button>') +
            '</div>') +
          '</div>' +
          '<div class="qz-body">' +
            '<div class="qz-main"><div class="qz-stage">' + inner + '</div>' +
              '<p class="qz-feed" role="status" aria-live="polite"></p></div>' +
            (phase === 'setup' ? '' : railHTML()) +
          '</div>' +
        '</div>';
    }

    /* ---- setup: the category picker (from Trivia Master) and the sprint ---- */
    function onCount() { var n = 0; for (var c in on) if (on.hasOwnProperty(c) && on[c]) n++; return n; }
    function allOn() { for (var k = 0; k < CATS.length; k++) if (bank[CATS[k].id].length && !on[CATS[k].id]) return false; return true; }
    function setup() {
      phase = 'setup'; current = null; deal = null;
      plan();
      var chips = '', c, k;
      for (k = 0; k < CATS.length; k++) {
        c = CATS[k];
        var n = bank[c.id].length;
        chips += '<button type="button" class="qz-cat" data-cat="' + c.id + '" aria-pressed="' + (!!on[c.id]) + '"' +
                 (n ? '' : ' disabled') + '>' + (k + 1) + ' · ' + esc(c.label) + ' <span style="font-weight:500">· ' + esc(c.en) + '</span></button>';
      }
      chips += '<button type="button" class="qz-cat all" data-cat="all" aria-pressed="' + allOn() + '">6 · Sab kuch <span style="font-weight:500">· everything</span></button>';
      frame(
        '<h3 class="qz-q">What shall the questions be about?</h3>' +
        '<p class="qz-sub">Switch on one or more — or Sab kuch, everything.</p>' +
        '<div class="qz-cats" role="group" aria-label="Categories">' + chips + '</div>' +
        (sprintable
          ? '<div class="qz-modes" role="group" aria-label="How to play">' +
              '<button type="button" class="qz-cat" data-go="mode" data-mode="ladder" aria-pressed="' + !sprint + '">The ladder · 15 rungs</button>' +
              '<button type="button" class="qz-cat" data-go="mode" data-mode="sprint" aria-pressed="' + sprint + '">⏱ 60-second sprint</button>' +
            '</div>'
          : '') +
        '<div class="qz-dock"><div class="qz-row"><button type="button" class="qz-btn" data-go="start"' + (onCount() ? '' : ' disabled') + '>Shuru karo</button></div></div>' +
        '<p class="qz-hint">Tap a category — or press 1–6. Enter starts.</p>');
      hook();
      sc.later(function () { focusSoft(host.querySelector('[data-go="start"]')); }, 60);
    }

    function toggleCat(id) {
      if (phase !== 'setup') return;
      if (id === 'all') { for (var k = 0; k < CATS.length; k++) on[CATS[k].id] = bank[CATS[k].id].length > 0; }
      else {
        if (!bank[id] || !bank[id].length) return;
        on[id] = !on[id];
      }
      setup();
      var b = host.querySelector('[data-cat="' + id + '"]');
      if (b) focusSoft(b);
    }

    function start() {
      if (phase !== 'setup' || !onCount()) return;
      plan();
      if (!total) { say('Those stalls are still filling up — switch on another category.', 'warm'); return; }
      idx = 0; got = 0; asked = 0; marks = []; rung = 0; climbing = true; result = null;
      lifelines = { fifty: false, nani: false, gattu: false }; lifeUsedOn = {}; anyLife = false;
      if (sprint) {
        /* the sprint draws from everything switched on, in a fresh order, and keeps going */
        qs = shuffle(pool()); total = qs.length; reviewN = 0;
        clock.left = SPRINT_MS; clock.last = 0; clock.held = false;
        tick();
      }
      ask();
    }

    /* ---- the sprint's clock: requestAnimationFrame with delta time; a hidden tab
       and an open miss card change nothing (games spec §1.5) ---- */
    function tick() {
      if (sc.dead || !sprint || phase === 'end') return;
      clock.raf = W.requestAnimationFrame(function (now) {
        if (sc.dead || phase === 'end') return;
        if (detached(host)) { sc.kill(); return; }
        var hidden = D && D.hidden;
        if (clock.last && !hidden && !clock.held) clock.left -= Math.min(250, now - clock.last);
        clock.last = now;
        var t = host.querySelector('[data-role="timer"]');
        if (t) t.textContent = '⏱ ' + Math.max(0, Math.ceil(clock.left / 1000)) + 's';
        if (host.__qzState) host.__qzState.timeLeft = Math.max(0, Math.ceil(clock.left / 1000));
        if (clock.left <= 0) { finish(); return; }
        tick();
      });
    }
    sc.on(D, 'visibilitychange', function () { clock.last = 0; });

    function ask() {
      if (idx >= total) return finish();
      phase = 'ask'; selected = -1; lifeArmed = false;
      current = qs[idx];
      deal = dealOptions(current);
      ASKED[current.key] = 1;
      var kick = sprint ? 'Sawaal ' + (idx + 1)
        : 'Sawaal ' + (idx + 1) + ' of ' + total + ' · ' + (idx < reviewN ? 'one from another day' : ({ easy: 'easy', mid: 'middle', hard: 'hard' })[current.band]);
      frame(
        '<p class="qz-sub">' + esc(kick) + '</p>' +
        '<h3 class="qz-q">' + esc(current.q) + '</h3>' +
        optionsHTML(deal.options) +
        '<div class="qz-dock">' +
          (sprint ? '' :
          '<div class="qz-life" role="group" aria-label="Lifelines">' +
            '<button type="button" class="qz-lbtn" data-life="fifty"' + (lifelines.fifty ? ' disabled' : '') + '>1 · Aadha-Aadha</button>' +
            '<button type="button" class="qz-lbtn" data-life="nani"' + (lifelines.nani ? ' disabled' : '') + '>2 · Poochho Nani</button>' +
            '<button type="button" class="qz-lbtn" data-life="gattu"' + (lifelines.gattu ? ' disabled' : '') + '>3 · Gattu ka Guess</button>' +
          '</div>' +
          '<div class="qz-row"><button type="button" class="qz-btn" data-go="lock" disabled>Lock karo</button></div>') +
        '</div>' +
        '<p class="qz-hint">' + (sprint ? 'Tap an answer — or press 1–4 or A–D.' : 'A–D or 1–4 pick · Enter locks · L then 1–3 for a lifeline · or just tap.') + '</p>');
      hook();
      sc.later(function () { focusSoft(host.querySelector('.qz-opt')); }, 60);
    }

    function select(k) {
      if (phase !== 'ask' || !deal) return;
      var els = optionEls();
      if (!els[k] || els[k].disabled) return;
      if (sprint) { selected = k; return judge(); }
      selected = k;
      for (var m = 0; m < els.length; m++) els[m].classList.toggle('sel', m === k);
      var lockBtn = host.querySelector('[data-go="lock"]');
      if (lockBtn) lockBtn.disabled = false;
      say(LETTERS[k] + ' chuna. Pakka? Lock karo.', '');
      hook();
    }

    function lock() {
      if (phase !== 'ask' || selected < 0) return;
      phase = 'locked';
      var els = optionEls(), k;
      for (k = 0; k < els.length; k++) els[k].disabled = true;
      var lb = host.querySelector('[data-go="lock"]');
      if (lb) lb.disabled = true;
      els[selected].classList.add('lock');
      say('Locked… dhak-dhak…', '');
      hook();
      /* the dramatic pause — skipped under reduced motion */
      sc.later(judge, slow ? 30 : 1600);
    }

    /* ONE VERDICT PER RUNG, reported once at its first (and only) attempt */
    function judge() {
      if (sc.dead || (phase !== 'locked' && phase !== 'ask')) return;
      var els = optionEls(), right = selected === deal.answer, k;
      for (k = 0; k < els.length; k++) {
        els[k].disabled = true;
        els[k].classList.remove('lock');
        if (k === deal.answer) els[k].classList.add('is-right');
        else if (k === selected) els[k].classList.add('is-warm');
      }
      marks[idx] = right ? 1 : 0;
      asked++;
      if (right) got++;
      var usedLife = !!lifeUsedOn[idx];
      if (!sprint) {
        if (climbing && right && !usedLife) rung = idx + 1; else climbing = false;
      }
      /* the child's own record: a miss comes back on another day; a re-asked one, known, is let go */
      if (mem) {
        if (!right) mem.miss[current.key] = today();
        else if (mem.miss[current.key] && mem.miss[current.key] < today()) delete mem.miss[current.key];
        memSave(mem);
      }
      if (typeof opts.answer === 'function') {
        try {
          opts.answer({ id: current.key, right: right, firstTry: true, skill: 'gyanpati.' + current.cat,
                        objective: null, lifeline: usedLife, review: idx < reviewN });
        } catch (e) {}
      }
      var pot = host.querySelector('.qz-pot:not(.qz-clock) b');
      if (pot) pot.textContent = String(got);
      var dock = host.querySelector('.qz-dock');
      if (right) {
        say(one(CHEERS), 'good');
        if (sprint) {
          phase = 'told';
          hook();
          sc.later(function () { if (phase === 'told') { idx++; ask(); } }, slow ? 250 : 650);
          return;
        }
        phase = 'offer';
        if (dock) dock.innerHTML = '<div class="qz-row"><button type="button" class="qz-btn" data-go="aage">' +
          (idx + 1 >= total ? 'See the ladder' : 'Aage! Sawaal ' + (idx + 2)) + '</button></div>';
      } else {
        /* the miss card holds: no new question until Aage — and in a sprint the clock waits too */
        phase = 'miss';
        clock.held = true;
        say('', '');
        if (dock) dock.innerHTML = missHTML(current.a, current.teach || ('It is ' + current.a + '.'));
        else {
          var st = host.querySelector('.qz-stage');
          if (st) st.insertAdjacentHTML('beforeend', missHTML(current.a, current.teach || ('It is ' + current.a + '.')));
        }
      }
      var hint = host.querySelector('.qz-hint');
      if (hint) hint.textContent = 'Enter or tap Aage for the next sawaal.';
      hook();
      sc.later(function () { focusSoft(host.querySelector('[data-go="aage"]')); }, 60);
    }

    function aage() {
      if (phase !== 'offer' && phase !== 'miss') return;
      clock.held = false; clock.last = 0;
      idx++;
      if (idx >= total) return finish();
      ask();
    }

    function finish() {
      if (phase === 'end') return;
      phase = 'end';
      if (clock.raf && W.cancelAnimationFrame) W.cancelAnimationFrame(clock.raf);
      var firstTryRight = got;
      var ratio = asked ? firstTryRight / asked : 0;
      var levelNext = ratio >= 0.8 ? Math.min(5, level + 1) : ratio < 0.5 ? Math.max(1, level - 1) : level;
      result = { win: asked > 0 && ratio >= 0.5, score: firstTryRight, asked: asked, firstTryRight: firstTryRight,
                 level: level, levelNext: levelNext, rung: sprint ? 0 : rung, lifelines: anyLife, sprint: sprint,
                 correct: firstTryRight, total: asked };
      say('', '');
      var title = sprint ? (firstTryRight ? 'Time!' : 'Time — and every one taught.')
        : firstTryRight === total && total ? 'GYANPATI!' : ratio >= 0.8 ? 'Wah — nearly the whole ladder!' : ratio >= 0.5 ? 'Bahut khoob!' : 'The ladder, climbed.';
      var line = sprint
        ? 'You knew ' + firstTryRight + ' on the first try in sixty seconds.'
        : 'You knew ' + firstTryRight + ' of ' + total + ' on the first try.';
      var missed = asked - firstTryRight;
      var back = missed && mem && !sprint ? ' The ones you learned come back on the first rungs another day.' : '';
      frame(
        '<div class="qz-done">' +
          '<h3>' + esc(title) + '</h3><p>' + esc(line + back) + '</p>' +
          '<div class="qz-chips">' +
            '<span class="qz-chip"><b>' + firstTryRight + '</b> knew</span>' +
            '<span class="qz-chip"><b>' + missed + '</b> learned</span>' +
          '</div>' +
          '<div class="qz-row"><button type="button" class="qz-btn" data-go="out">Finish</button></div>' +
        '</div>');
      hook();
      sc.later(function () { focusSoft(host.querySelector('[data-go="out"]')); }, 60);
    }

    function bail() {
      if (finished || !result) return;
      finished = true;
      host.__qzDone = result;
      sc.kill();
      if (typeof done === 'function') done(result);
    }

    /* lifelines: deterministic, labelled for what they are ---------------- */
    function fireLife(which) {
      if (sprint || phase !== 'ask' || !deal || lifelines[which]) return;
      lifelines[which] = true; anyLife = true; lifeUsedOn[idx] = true;
      var btn = host.querySelector('[data-life="' + which + '"]');
      if (btn) btn.disabled = true;
      lifeArmed = false;
      var els = optionEls(), k;
      if (which === 'fifty') {
        var off = fiftyOff(current, deal.options);
        for (k = 0; k < els.length; k++) {
          if (off.indexOf(deal.options[k]) < 0) continue;
          els[k].disabled = true;
          els[k].classList.add('is-off');
          if (selected === k) { selected = -1; els[k].classList.remove('sel'); }
        }
        say('Aadha-Aadha! Two wrong doors close — two remain.', 'warm');
      } else if (which === 'nani') {
        say(naniClue(current), 'warm');
      } else if (which === 'gattu') {
        var open = [];
        for (k = 0; k < els.length; k++) if (!els[k].disabled) open.push(deal.options[k]);
        var pick = gattuPick(current, open), at = deal.options.indexOf(pick);
        say('Gattu guesses ' + LETTERS[at] + ' — but it is only a guess. Gattu is right about six times in ten.', 'warm');
      }
      hook();
    }

    /* input ----------------------------------------------------------- */
    sc.on(host, 'click', function (e) {
      var t = e.target;
      var cat = t.closest ? t.closest('[data-cat]') : null;
      if (cat && !cat.disabled) { toggleCat(cat.getAttribute('data-cat')); return; }
      var opt = t.closest ? t.closest('.qz-opt') : null;
      if (opt && !opt.disabled) { select(parseInt(opt.getAttribute('data-i'), 10)); return; }
      var lf = t.closest ? t.closest('[data-life]') : null;
      if (lf && !lf.disabled) { fireLife(lf.getAttribute('data-life')); return; }
      var gm = t.closest ? t.closest('[data-gm="aage"]') : null;
      if (gm) { aage(); return; }
      var go = t.closest ? t.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'lock') lock();
      else if (what === 'aage') aage();
      else if (what === 'start') start();
      else if (what === 'mode') {
        if (phase !== 'setup') return;
        sprint = sprintable && go.getAttribute('data-mode') === 'sprint';
        setup();
        focusSoft(host.querySelector('[data-mode="' + (sprint ? 'sprint' : 'ladder') + '"]'));
      }
      else if (what === 'rail') {
        railOpen = !railOpen;
        var rail = host.querySelector('.qz-rail');
        if (rail) rail.classList.toggle('open', railOpen);
        go.setAttribute('aria-expanded', String(railOpen));
      }
      else if (what === 'out') bail();
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      var key = e.key;
      var onButton = e.target && e.target.tagName === 'BUTTON' && host.contains(e.target);

      if (phase === 'setup') {
        var n = parseInt(key, 10);
        if (n >= 1 && n <= CATS.length) { e.preventDefault(); toggleCat(CATS[n - 1].id); return; }
        if (n === 6) { e.preventDefault(); toggleCat('all'); return; }
        if (key === 'Enter' && !onButton) { e.preventDefault(); start(); return; }
      } else if (phase === 'ask') {
        if (lifeArmed && /^[1-3]$/.test(key)) {
          e.preventDefault();
          fireLife(['fifty', 'nani', 'gattu'][parseInt(key, 10) - 1]);
          return;
        }
        if (!sprint && (key === 'l' || key === 'L')) {
          e.preventDefault(); lifeArmed = true;
          say('Lifeline? Press 1, 2 or 3.', '');
          return;
        }
        if (key === 'Escape' && lifeArmed) { lifeArmed = false; say('', ''); return; }
        lifeArmed = false;
        if (/^[a-dA-D]$/.test(key)) { e.preventDefault(); select(key.toLowerCase().charCodeAt(0) - 97); return; }
        if (/^[1-4]$/.test(key)) { e.preventDefault(); select(parseInt(key, 10) - 1); return; }
        if (key === 'Enter' && selected >= 0 && !sprint) { e.preventDefault(); lock(); return; }
      } else if (phase === 'offer' || phase === 'miss') {
        if (key === 'Enter' && !onButton) { e.preventDefault(); aage(); return; }
      }
    });

    if (scopeObj) { sprint = sprintable && scopeObj.mode === 'sprint'; plan(); start0(); }
    else setup();
    function start0() { phase = 'setup'; start(); }
    return teardownOf(sc, function () {
      finished = true;
      if (clock.raf && W.cancelAnimationFrame) W.cancelAnimationFrame(clock.raf);
    });
  }

  /* Trivia Master was folded into Gyanpati (games spec §3.1, §4.1): its category
     picker and its sprint live there now, and its points multiplier is gone. An
     old link still works — it opens Gyanpati's category picker. */
  function triviamaster(host, opts, done) {
    return gyanpati(host, opts, done);
  }

  /* ==================================================================
     REGISTRY — pushed, never assigned: games.js owns the array and
     the sibling stalls push into the same one.
     ================================================================== */

  /* Cover art: self-animating, self-contained. Class and keyframe names are
     prefixed because an SVG <style> block is document-wide. */
  var SCENE_GYAN =
    '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<style>@keyframes qzLadUp{0%,100%{opacity:.25}50%{opacity:1}}' +
      '.qzLr{animation:qzLadUp 2.4s ease-in-out infinite}' +
      '@media(prefers-reduced-motion:reduce){.qzLr{animation:none;opacity:.85}}</style>' +
      '<path d="M15 43V7M33 43V7" opacity=".55"/>' +
      '<path class="qzLr" style="animation-delay:0s"    d="M15 38h18"/>' +
      '<path class="qzLr" style="animation-delay:.45s"  d="M15 30h18"/>' +
      '<path class="qzLr" style="animation-delay:.9s"   d="M15 22h18"/>' +
      '<path class="qzLr" style="animation-delay:1.35s" d="M15 14h18"/>' +
      '<circle class="qzLr" style="animation-delay:1.8s" cx="24" cy="7" r="3.4"/>' +
    '</svg>';

  var SCENE_TRIVIA =
    '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<style>@keyframes qzWheel{to{transform:rotate(360deg)}}' +
      '.qzWg{transform-origin:24px 24px;animation:qzWheel 9s linear infinite}' +
      '@media(prefers-reduced-motion:reduce){.qzWg{animation:none}}</style>' +
      '<circle cx="24" cy="24" r="16" opacity=".4"/>' +
      '<g class="qzWg">' +
        '<circle cx="24" cy="8" r="4"/>' +
        '<circle cx="8.8" cy="19.1" r="4" opacity=".8"/>' +
        '<circle cx="14.6" cy="36.9" r="4" opacity=".6"/>' +
        '<circle cx="33.4" cy="36.9" r="4" opacity=".8"/>' +
        '<circle cx="39.2" cy="19.1" r="4" opacity=".6"/>' +
      '</g>' +
      '<circle cx="24" cy="24" r="3" fill="#fff" stroke="none"/>' +
    '</svg>';

  /* test seam for tools/check-quiz.js: the pure parts, so determinism can be
     checked without a browser race. Paints nothing; holds no child data. */
  W.IND_GYAN = { bank: buildBank, deal: dealOptions, fifty: fiftyOff, gattu: gattuPick, gattuRight: gattuRight,
                 nani: naniClue, leaks: leaks, MEM_KEY: MEM_KEY };

  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push(
    { id: 'gyanpati', name: 'Kaun Banega Gyanpati?', sub: 'the ladder quiz', icon: 'star', minutes: 6,
      blurb: 'Fifteen rungs, easy to hard, from the categories you pick, with three honest lifelines. The score is how many you knew; a miss is taught, never lost.',
      tag: 'ladder quiz', c: '#3b1d6e', c2: '#8b5cf6', scene: SCENE_GYAN,
      teaches: true, levels: LEVELS,
      engine: gyanpati },
    /* folded into Gyanpati; kept so an old link opens the category picker. The hub hides it. */
    { id: 'triviamaster', name: 'Trivia Master', sub: 'now inside Gyanpati', icon: 'game', minutes: 4, hide: true,
      blurb: 'Now part of Kaun Banega Gyanpati? — pick your categories there.',
      tag: 'mixed trivia', c: '#0f5e6e', c2: '#2dd4bf', scene: SCENE_TRIVIA,
      teaches: true, levels: LEVELS,
      engine: triviamaster }
  );
})();
