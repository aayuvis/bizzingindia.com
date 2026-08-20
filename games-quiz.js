/* Bizzing India — THE MELA (quiz stalls).

   Two stalls, one question factory:
     gyanpati     · Kaun Banega Gyanpati? — the ladder quiz
     triviamaster · Trivia Master        — mixed rounds by category

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
    '.qz-stage{background:var(--bg2);border:1px solid var(--line);border-radius:var(--radius-lg);padding:var(--space-lg);position:relative;overflow:hidden}',
    '.qz-stage:before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent3),var(--accent2));opacity:.5}',
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
    '.qz-lbtn{cursor:pointer;min-height:40px;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--text);font:700 12.5px var(--body,inherit)}',
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
    '.qz-streak{text-align:center;font:700 13px var(--body,inherit);color:var(--accent2);margin:6px 0 0;letter-spacing:.04em}',

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
                'The ' + r.symbols.animal.toLowerCase() + ' is ' + s.name + '’s own animal.');
          }
          if (r.symbols && r.symbols.bird) {
            add('khazana', 'easy', 'bird:' + s.code,
                'Which bird is the state bird of ' + s.name + '?',
                r.symbols.bird, birds,
                'Nani says: it begins with "' + r.symbols.bird.charAt(0) + '", beta.',
                'The ' + r.symbols.bird.toLowerCase() + ' is ' + s.name + '’s own bird.');
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

  /* four options, letters A–D, answer index recorded */
  function dealOptions(q) {
    var opts = shuffle([q.a].concat(pickN(q.pool, 3))), i, ans = 0;
    for (i = 0; i < opts.length; i++) if (opts[i] === q.a) ans = i;
    return { options: opts, answer: ans };
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

  /* ==================================================================
     GAME 1 · KAUN BANEGA GYANPATI?
     Fifteen rungs, easy to hard, kauris doubling all the way up. Safe
     havens after Q5 and Q10. Walking away with the pot is a win — the
     copy says so warmly, because knowing when to stop is also gyan.
     ================================================================== */

  var LADDER = (function () {
    var l = [], v = 10, i;
    for (i = 0; i < 15; i++) { l.push(v); v *= 2; }
    return l;   /* 10 · 20 · 40 … 163840 */
  })();
  var HAVENS = [4, 9];   /* 0-based: after Q5 and Q10 the pot is safe */

  function gyanpati(host, opts, done) {
    var sc = scope();
    injectCSS();
    var slow = reducedMotion();
    var bands = bandLists(buildBank());
    /* five from each band; a thin band borrows from its neighbour so the
       ladder still stands while the data files are filling out */
    var qs = pickFresh(bands.easy, 5).concat(pickFresh(bands.mid, 5), pickFresh(bands.hard, 5));
    if (qs.length < 15) {
      var spare = pickFresh(bands.mid.concat(bands.easy, bands.hard), 45), si = 0, have = {}, qi;
      for (qi = 0; qi < qs.length; qi++) have[qs[qi].key] = 1;
      while (qs.length < 15 && si < spare.length) {
        if (!have[spare[si].key]) { qs.push(spare[si]); have[spare[si].key] = 1; }
        si++;
      }
    }
    var total = Math.min(15, qs.length);
    qs = qs.slice(0, total);

    var idx = 0, secured = 0, finished = false, railOpen = false;
    var phase = 'ask', selected = -1, deal = null, current = null;
    var lifelines = { fifty: false, nani: false, gattu: false };
    var lifeArmed = false;
    var result = null;

    if (!total) {
      host.innerHTML = '<div class="qz-wrap"><div class="qz-stage"><p class="qz-sub">The question stalls are ' +
        'still being set up — come back when the data has loaded.</p></div></div>';
      return teardownOf(sc);
    }

    function hook() {
      host.__qzState = {
        game: 'gyanpati', phase: phase, qIndex: idx, total: total,
        question: current ? current.q : '', options: deal ? deal.options : [],
        answerIndex: deal ? deal.answer : -1, selected: selected,
        pot: idx > 0 || secured > 0 ? LADDER[secured - 1] || 0 : 0,
        secured: secured, lifelines: { fifty: lifelines.fifty, nani: lifelines.nani, gattu: lifelines.gattu },
        ladder: LADDER.slice(0, total), result: result
      };
    }

    function railHTML() {
      var h = '<div class="qz-rail' + (railOpen ? ' open' : '') + '" aria-label="Kauri ladder">', i;
      for (i = total - 1; i >= 0; i--) {
        var cls = 'qz-rung' + (HAVENS.indexOf(i) >= 0 ? ' haven' : '') +
                  (i < secured ? ' past' : '') + (i === idx && phase !== 'end' ? ' now' : '');
        h += '<div class="' + cls + '"><span>' + (i + 1) + '</span><span>🐚 ' + inr(LADDER[i]) +
             (HAVENS.indexOf(i) >= 0 ? ' ◆' : '') + '</span></div>';
      }
      return h + '</div>';
    }

    function feedEl() { return host.querySelector('.qz-feed'); }
    function say(msg, tone) {
      var f = feedEl();
      if (!f) return;
      f.textContent = msg || '';
      f.className = 'qz-feed' + (tone ? ' ' + tone : '');
    }
    function optionEls() { return host.querySelectorAll('.qz-opt'); }

    function frame(inner) {
      host.innerHTML =
        '<div class="qz-wrap">' +
          '<div class="qz-hud">' +
            '<div><span class="qz-kicker">Mela · the ladder quiz</span><b>Kaun Banega Gyanpati?</b></div>' +
            '<div style="display:flex;gap:8px;align-items:center">' +
              '<span class="qz-pot">Pot 🐚 <b>' + inr(secured ? LADDER[secured - 1] : 0) + '</b></span>' +
              '<button type="button" class="qz-railbtn" data-go="rail" aria-expanded="' + railOpen + '">Ladder</button>' +
            '</div>' +
          '</div>' +
          '<div class="qz-body">' +
            '<div class="qz-main"><div class="qz-stage">' + inner + '</div>' +
              '<p class="qz-feed" role="status" aria-live="polite"></p></div>' +
            railHTML() +
          '</div>' +
        '</div>';
    }

    function ask() {
      phase = 'ask'; selected = -1; lifeArmed = false;
      current = qs[idx];
      deal = dealOptions(current);
      ASKED[current.key] = 1;
      frame(
        '<p class="qz-sub">Sawaal ' + (idx + 1) + ' of ' + total + ' · for 🐚 ' + inr(LADDER[idx]) + '</p>' +
        '<h3 class="qz-q">' + esc(current.q) + '</h3>' +
        optionsHTML(deal.options) +
        '<div class="qz-life" role="group" aria-label="Lifelines">' +
          '<button type="button" class="qz-lbtn" data-life="fifty"' + (lifelines.fifty ? ' disabled' : '') + '>1 · Aadha-Aadha</button>' +
          '<button type="button" class="qz-lbtn" data-life="nani"' + (lifelines.nani ? ' disabled' : '') + '>2 · Poochho Nani</button>' +
          '<button type="button" class="qz-lbtn" data-life="gattu"' + (lifelines.gattu ? ' disabled' : '') + '>3 · Gattu ka Guess</button>' +
        '</div>' +
        '<div class="qz-row"><button type="button" class="qz-btn" data-go="lock" disabled>Lock karo</button></div>' +
        '<p class="qz-hint">A–D or 1–4 pick · Enter locks · L then 1–3 for a lifeline · or just tap.</p>');
      hook();
      sc.later(function () { focusSoft(host.querySelector('.qz-opt')); }, 60);
    }

    function select(i) {
      if (phase !== 'ask' || !deal) return;
      var els = optionEls();
      if (!els[i] || els[i].disabled) return;
      selected = i;
      for (var k = 0; k < els.length; k++) els[k].classList.toggle('sel', k === i);
      var lockBtn = host.querySelector('[data-go="lock"]');
      if (lockBtn) lockBtn.disabled = false;
      say(LETTERS[i] + ' chuna. Pakka? Lock karo.', '');
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
      sc.later(reveal, slow ? 30 : 1600);
    }

    function reveal() {
      if (sc.dead || phase !== 'locked') return;
      var els = optionEls(), right = selected === deal.answer, k;
      for (k = 0; k < els.length; k++) {
        els[k].classList.remove('lock');
        if (k === deal.answer) els[k].classList.add('is-right');
        else if (k === selected) els[k].classList.add('is-warm');
        else els[k].classList.add('is-off');
      }
      if (right) {
        secured = idx + 1;
        var pot = host.querySelector('.qz-pot b');
        if (pot) pot.textContent = inr(LADDER[secured - 1]);
        say(one(CHEERS) + ' 🐚 ' + inr(LADDER[idx]) + ' in the pot.', 'good');
        if (secured >= total) return crown();
        offer();
      } else {
        drop();
      }
    }

    /* 'Le lo kauri, ya aage?' — after each correct answer the child may walk
       away with the pot. Walking away is a win, and the copy treats it so. */
    function offer() {
      phase = 'offer';
      var row = host.querySelector('.qz-row');
      if (row) {
        row.innerHTML =
          '<button type="button" class="qz-btn ghost" data-go="walk">Le lo kauri 🐚 ' + inr(LADDER[secured - 1]) + '</button>' +
          '<button type="button" class="qz-btn" data-go="aage">Aage! Sawaal ' + (secured + 1) + '</button>';
      }
      var hint = host.querySelector('.qz-hint');
      if (hint) hint.textContent = 'Le lo kauri, ya aage? Tab moves · Enter presses · K takes the pot home.';
      hook();
      sc.later(function () { focusSoft(host.querySelector('[data-go="aage"]')); }, 60);
    }

    /* A miss above a haven drops to the haven, kindly. No shaming — the
       right answer is taught, the pot that was safe stays safe. */
    function drop() {
      phase = 'end';
      var haven = secured >= 10 ? 10 : secured >= 5 ? 5 : 0;
      var kauris = haven ? haven : 1;
      result = { win: false, score: secured, kauris: Math.min(15, kauris) };
      var teachBox = D.createElement('div');
      teachBox.className = 'qz-teach';
      teachBox.innerHTML = esc(current.teach || 'It was ' + current.a + '.');
      var stage = host.querySelector('.qz-stage');
      if (stage) stage.appendChild(teachBox);
      say(haven
        ? 'Not this one — but your haven holds. 🐚 ' + inr(LADDER[haven - 1]) + ' stays yours, warm and safe.'
        : 'Not this one — but every sawaal you met today is one you now know.', 'warm');
      endCard('Kya khel tha!',
        haven ? 'You climbed to rung ' + secured + ' and the rung-' + haven + ' haven caught you, just as it promised.'
              : 'You climbed ' + secured + ' rung' + (secured === 1 ? '' : 's') + ' on your first visit. The ladder will be here tomorrow.');
    }

    function walk() {
      if (phase !== 'offer') return;
      phase = 'end';
      result = { win: true, score: secured, kauris: Math.min(15, secured) };
      say('', '');
      endCard('Wah — samajhdaar!',
        'You took the pot and walked, smiling, with 🐚 ' + inr(LADDER[secured - 1]) + '. ' +
        'Knowing when to say "bas, le lo kauri" is its own kind of gyan — that is a real win.');
    }

    function crown() {
      phase = 'end';
      result = { win: true, score: secured, kauris: 15 };
      say(one(CHEERS), 'good');
      endCard('GYANPATI!',
        'All ' + total + ' rungs. The whole ladder, 🐚 ' + inr(LADDER[total - 1]) + ' in the pot, and a new Gyanpati at the Mela.');
    }

    function endCard(title, line) {
      var stage = host.querySelector('.qz-stage');
      if (!stage) return;
      var doneBox = D.createElement('div');
      doneBox.className = 'qz-done';
      doneBox.innerHTML =
        '<h3>' + esc(title) + '</h3><p>' + esc(line) + '</p>' +
        '<div class="qz-chips">' +
          '<span class="qz-chip"><b>' + result.score + '</b> rung' + (result.score === 1 ? '' : 's') + '</span>' +
          '<span class="qz-chip"><b>' + result.kauris + '</b> kauris</span>' +
        '</div>' +
        '<div class="qz-row">' +
          '<button type="button" class="qz-btn" data-go="out">Back to the Mela</button>' +
          '<button type="button" class="qz-btn ghost" data-go="again">Climb again</button>' +
        '</div>';
      stage.appendChild(doneBox);
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

    function replay() {
      var b2 = bandLists(buildBank());
      qs = pickFresh(b2.easy, 5).concat(pickFresh(b2.mid, 5), pickFresh(b2.hard, 5));
      total = Math.min(15, qs.length);
      qs = qs.slice(0, total);
      idx = 0; secured = 0; result = null;
      if (total) ask();
    }

    /* lifelines ------------------------------------------------------- */
    function fireLife(which) {
      if (phase !== 'ask' || !deal || lifelines[which]) return;
      lifelines[which] = true;
      var btn = host.querySelector('[data-life="' + which + '"]');
      if (btn) btn.disabled = true;
      lifeArmed = false;
      var els = optionEls(), i;

      if (which === 'fifty') {
        /* Aadha-Aadha: two wrong doors close */
        var wrongs = [];
        for (i = 0; i < els.length; i++) if (i !== deal.answer && !els[i].disabled) wrongs.push(i);
        wrongs = pickN(wrongs, 2);
        for (i = 0; i < wrongs.length; i++) {
          els[wrongs[i]].disabled = true;
          els[wrongs[i]].classList.add('is-off');
          if (selected === wrongs[i]) { selected = -1; els[wrongs[i]].classList.remove('sel'); }
        }
        say('Aadha-Aadha! Two doors close — two remain.', 'warm');
      } else if (which === 'nani') {
        /* Poochho Nani: a warm nudge built from the fact's own data —
           the leak check already promised it never says the answer */
        say((current.hint || 'Nani smiles: think of what we read together, beta.'), 'warm');
      } else if (which === 'gattu') {
        /* Gattu ka Guess: his confidence slides with the climb —
           sure-footed near the ground, honest about wobbling near the top */
        var p = 0.85 - 0.4 * (idx / Math.max(1, total - 1));
        var open = [];
        for (i = 0; i < els.length; i++) if (!els[i].disabled) open.push(i);
        var pickIdx;
        if (Math.random() < p || open.length === 1) pickIdx = deal.answer;
        else {
          var wrongOpen = [];
          for (i = 0; i < open.length; i++) if (open[i] !== deal.answer) wrongOpen.push(open[i]);
          pickIdx = wrongOpen.length ? one(wrongOpen) : deal.answer;
        }
        var conf = Math.max(35, Math.min(95, Math.round(p * 100 + (Math.random() * 10 - 5))));
        say('Gattu taps ' + LETTERS[pickIdx] + ' — "main ' + conf + '% sure hoon!"', 'warm');
      }
      hook();
    }

    /* input ----------------------------------------------------------- */
    sc.on(host, 'click', function (e) {
      var t = e.target;
      var opt = t.closest ? t.closest('.qz-opt') : null;
      if (opt && !opt.disabled) { select(parseInt(opt.getAttribute('data-i'), 10)); return; }
      var lf = t.closest ? t.closest('[data-life]') : null;
      if (lf && !lf.disabled) { fireLife(lf.getAttribute('data-life')); return; }
      var go = t.closest ? t.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'lock') lock();
      else if (what === 'aage') { if (phase === 'offer') { idx++; ask(); } }
      else if (what === 'walk') walk();
      else if (what === 'rail') {
        railOpen = !railOpen;
        var rail = host.querySelector('.qz-rail');
        if (rail) rail.classList.toggle('open', railOpen);
        go.setAttribute('aria-expanded', String(railOpen));
      }
      else if (what === 'again') replay();
      else if (what === 'out') bail();
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      var key = e.key;

      if (phase === 'ask') {
        if (lifeArmed && /^[1-3]$/.test(key)) {
          e.preventDefault();
          fireLife(['fifty', 'nani', 'gattu'][parseInt(key, 10) - 1]);
          return;
        }
        if (key === 'l' || key === 'L') {
          e.preventDefault(); lifeArmed = true;
          say('Lifeline? Press 1, 2 or 3.', '');
          return;
        }
        if (key === 'Escape' && lifeArmed) { lifeArmed = false; say('', ''); return; }
        lifeArmed = false;
        if (/^[a-dA-D]$/.test(key)) { e.preventDefault(); select(key.toLowerCase().charCodeAt(0) - 97); return; }
        if (/^[1-4]$/.test(key)) { e.preventDefault(); select(parseInt(key, 10) - 1); return; }
        if (key === 'Enter' && selected >= 0) {
          /* Enter on a focused option button would also "click" it — that is
             a select, which is harmless; an explicit Enter anywhere locks */
          e.preventDefault(); lock(); return;
        }
      } else if (phase === 'offer') {
        if (key === 'k' || key === 'K') { e.preventDefault(); walk(); return; }
        /* Enter falls through to the focused button — Aage by default */
      }
    });

    ask();
    return teardownOf(sc, function () { finished = true; });
  }

  /* ==================================================================
     GAME 2 · TRIVIA MASTER
     Rounds of ten across the categories the child switches on. Untimed
     by default; the 60-second sprint appears from age nine. A wrong tap
     earns the right fact told warmly in one line — the teaching beat.
     ================================================================== */

  var CATS = [
    { id: 'naksha',    label: 'Naksha · maps & states' },
    { id: 'itihaas',   label: 'Itihaas · history' },
    { id: 'utsav',     label: 'Utsav · festivals' },
    { id: 'khazana',   label: 'Khazana · food & symbols' },
    { id: 'mahakavya', label: 'Mahakavya · the epics' }
  ];
  var ROUND = 10;

  function triviamaster(host, opts, done) {
    var sc = scope();
    injectCSS();
    var slow = reducedMotion();
    var bank = buildBank();
    var on = {}, i;
    for (i = 0; i < CATS.length; i++) on[CATS[i].id] = bank[CATS[i].id].length > 0;
    var sprintable = kidAge() >= 9;
    var sprint = false;

    var phase = 'setup', qs = [], idx = 0, deal = null, current = null;
    var score = 0, streak = 0, best = 0, pts = 0, answered = false;
    var timeLeft = 60, timer = 0, finished = false, result = null;

    function onCount() {
      var n = 0, c;
      for (c in on) if (on.hasOwnProperty(c) && on[c]) n++;
      return n;
    }

    function hook() {
      host.__qzState = {
        game: 'triviamaster', phase: phase, qIndex: idx, total: qs.length,
        question: current ? current.q : '', options: deal ? deal.options : [],
        answerIndex: deal ? deal.answer : -1,
        cats: on, sprint: sprint, score: score, streak: streak, points: pts,
        result: result
      };
    }

    function say(msg, tone) {
      var f = host.querySelector('.qz-feed');
      if (!f) return;
      f.textContent = msg || '';
      f.className = 'qz-feed' + (tone ? ' ' + tone : '');
    }

    /* ---- setup: category chips, at least two on ---------------------- */
    function setup() {
      phase = 'setup';
      var chips = '', c;
      for (i = 0; i < CATS.length; i++) {
        c = CATS[i];
        var n = bank[c.id].length;
        chips += '<button type="button" class="qz-cat" data-cat="' + c.id + '" aria-pressed="' +
                 (!!on[c.id]) + '"' + (n ? '' : ' disabled') + '>' + (i + 1) + ' · ' + esc(c.label) +
                 ' (' + n + ')</button>';
      }
      host.innerHTML =
        '<div class="qz-wrap">' +
          '<div class="qz-hud"><div><span class="qz-kicker">Mela · mixed sawaal</span>' +
          '<b>Trivia Master</b></div></div>' +
          '<div class="qz-stage">' +
            '<h3 class="qz-q">Pick your categories</h3>' +
            '<p class="qz-sub">Ten questions, mixed from whatever you switch on. At least two, yatri.</p>' +
            '<div class="qz-cats" role="group" aria-label="Categories">' + chips + '</div>' +
            (sprintable
              ? '<div class="qz-cats"><button type="button" class="qz-cat" data-go="sprint" aria-pressed="' + sprint + '">' +
                '⏱ 60-second sprint</button></div>'
              : '') +
            '<div class="qz-row"><button type="button" class="qz-btn" data-go="start"' +
              (onCount() >= 2 ? '' : ' disabled') + '>Shuru karo</button></div>' +
            '<p class="qz-hint">Tap a chip — or press its number. Enter starts. Tab moves everywhere.</p>' +
          '</div>' +
          '<p class="qz-feed" role="status" aria-live="polite"></p>' +
        '</div>';
      hook();
      sc.later(function () { focusSoft(host.querySelector('.qz-cat')); }, 60);
    }

    function toggleCat(id) {
      if (phase !== 'setup') return;
      if (!bank[id] || !bank[id].length) return;
      on[id] = !on[id];
      var btn = host.querySelector('[data-cat="' + id + '"]');
      if (btn) btn.setAttribute('aria-pressed', String(on[id]));
      var start = host.querySelector('[data-go="start"]');
      if (start) start.disabled = onCount() < 2;
      say(onCount() < 2 ? 'Pick at least two categories, yatri — mixing is the fun part.' : '', 'warm');
      hook();
    }

    /* round-robin across the chosen categories so a round really mixes */
    function buildRound() {
      var lists = [], c, i2;
      for (i2 = 0; i2 < CATS.length; i2++) {
        c = CATS[i2].id;
        if (on[c] && bank[c].length) lists.push(pickFresh(bank[c], ROUND));
      }
      var out = [], li = 0, guard = 0;
      while (out.length < ROUND && guard < 200) {
        guard++;
        var list = lists[li % lists.length];
        li++;
        if (list && list.length) out.push(list.shift());
        else {
          var empty = true;
          for (i2 = 0; i2 < lists.length; i2++) if (lists[i2].length) empty = false;
          if (empty) break;
        }
      }
      return out;
    }

    function start() {
      if (onCount() < 2) return;
      qs = buildRound();
      if (!qs.length) { say('The stalls are still filling up — try other categories.', 'warm'); return; }
      idx = 0; score = 0; streak = 0; best = 0; pts = 0; result = null;
      timeLeft = 60;
      if (timer) { W.clearInterval(timer); timer = 0; }
      if (sprint) {
        timer = sc.every(function () {
          if (detached(host)) { sc.kill(); return; }
          timeLeft--;
          var t = host.querySelector('[data-role="timer"]');
          if (t) t.textContent = '⏱ ' + timeLeft + 's';
          if (timeLeft <= 0) { W.clearInterval(timer); timer = 0; finish(); }
        }, 1000);
      }
      ask();
    }

    function catLabel(id) {
      for (var i2 = 0; i2 < CATS.length; i2++) if (CATS[i2].id === id) return CATS[i2].label;
      return '';
    }

    function ask() {
      if (idx >= qs.length) return finish();
      phase = 'ask'; answered = false;
      current = qs[idx];
      deal = dealOptions(current);
      ASKED[current.key] = 1;
      var mult = 1 + 0.1 * Math.min(8, streak);
      host.innerHTML =
        '<div class="qz-wrap">' +
          '<div class="qz-hud">' +
            '<div><span class="qz-kicker">Mela · mixed sawaal</span><b>Trivia Master</b></div>' +
            '<div style="display:flex;gap:8px;align-items:center">' +
              (sprint ? '<span class="qz-pot" data-role="timer">⏱ ' + timeLeft + 's</span>' : '') +
              '<span class="qz-pot">' + score + ' / ' + qs.length + ' · <b>' + pts + '</b> pts</span>' +
            '</div>' +
          '</div>' +
          '<div class="qz-stage">' +
            '<p class="qz-sub">Sawaal ' + (idx + 1) + ' of ' + qs.length + ' · ' + esc(catLabel(current.cat)) + '</p>' +
            '<h3 class="qz-q">' + esc(current.q) + '</h3>' +
            optionsHTML(deal.options) +
            (streak >= 2 ? '<p class="qz-streak">Streak ×' + streak + ' · points ×' + mult.toFixed(1) + '</p>' : '') +
            '<div class="qz-row" data-role="next"></div>' +
            '<p class="qz-hint">Tap an answer — or press 1–4 or A–D. Tab moves, Enter presses.</p>' +
          '</div>' +
          '<p class="qz-feed" role="status" aria-live="polite"></p>' +
        '</div>';
      hook();
      sc.later(function () { focusSoft(host.querySelector('.qz-opt')); }, 60);
    }

    function answer(i2) {
      if (phase !== 'ask' || answered || !deal) return;
      var els = host.querySelectorAll('.qz-opt');
      if (!els[i2] || els[i2].disabled) return;
      answered = true;
      phase = 'told';
      var right = i2 === deal.answer, k;
      for (k = 0; k < els.length; k++) {
        els[k].disabled = true;
        if (k === deal.answer) els[k].classList.add('is-right');
        else if (k === i2) els[k].classList.add('is-warm');
        else els[k].classList.add('is-off');
      }
      if (right) {
        streak++; if (streak > best) best = streak;
        score++;
        pts += Math.round(10 * (1 + 0.1 * Math.min(8, streak - 1)));
        say(one(CHEERS) + (streak >= 3 ? ' Streak ×' + streak + '!' : ''), 'good');
      } else {
        streak = 0;
        /* the teaching beat: the right fact, warmly, in one line */
        say(current.teach || ('It is ' + current.a + ' — now it is yours to keep.'), 'warm');
      }
      var last = idx >= qs.length - 1;
      var row = host.querySelector('[data-role="next"]');
      if (row) row.innerHTML = '<button type="button" class="qz-btn" data-go="next">' +
        (last ? 'See how I did' : 'Next') + '</button>';
      hook();
      if (sprint) sc.later(next, slow ? 500 : 900);
      else sc.later(function () { focusSoft(host.querySelector('[data-go="next"]')); }, 60);
    }

    function next() {
      if (phase !== 'told') return;
      idx++;
      ask();
    }

    function finish() {
      if (phase === 'end') return;
      phase = 'end';
      if (timer) { W.clearInterval(timer); timer = 0; }
      result = { win: score >= 7, score: score, kauris: 1 + Math.floor(score / 3) };
      host.innerHTML =
        '<div class="qz-wrap">' +
          '<div class="qz-hud"><div><span class="qz-kicker">Mela · mixed sawaal</span>' +
          '<b>Trivia Master</b></div></div>' +
          '<div class="qz-stage"><div class="qz-done">' +
            '<h3>' + esc(one(CHEERS)) + '</h3>' +
            '<p>' + score + ' of ' + qs.length + ' right' +
              (best >= 3 ? ', with a best streak of ' + best : '') +
              (sprint ? ', at sprint speed' : '') +
              '. Every question you met today is one you now know.</p>' +
            '<div class="qz-chips">' +
              '<span class="qz-chip"><b>' + pts + '</b> points</span>' +
              '<span class="qz-chip"><b>' + result.kauris + '</b> kauris</span>' +
            '</div>' +
            '<div class="qz-row">' +
              '<button type="button" class="qz-btn" data-go="out">Back to the Mela</button>' +
              '<button type="button" class="qz-btn ghost" data-go="again">Another round</button>' +
            '</div>' +
          '</div></div>' +
          '<p class="qz-feed" role="status" aria-live="polite"></p>' +
        '</div>';
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

    /* input ----------------------------------------------------------- */
    sc.on(host, 'click', function (e) {
      var t = e.target;
      var cat = t.closest ? t.closest('[data-cat]') : null;
      if (cat && !cat.disabled) { toggleCat(cat.getAttribute('data-cat')); return; }
      var opt = t.closest ? t.closest('.qz-opt') : null;
      if (opt && !opt.disabled) { answer(parseInt(opt.getAttribute('data-i'), 10)); return; }
      var go = t.closest ? t.closest('[data-go]') : null;
      if (!go) return;
      var what = go.getAttribute('data-go');
      if (what === 'sprint') {
        sprint = !sprint;
        go.setAttribute('aria-pressed', String(sprint));
        hook();
      }
      else if (what === 'start') start();
      else if (what === 'next') next();
      else if (what === 'again') setup();
      else if (what === 'out') bail();
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      var key = e.key;
      if (phase === 'setup') {
        var n = parseInt(key, 10);
        if (n >= 1 && n <= CATS.length) { e.preventDefault(); toggleCat(CATS[n - 1].id); return; }
        if (key === 'Enter' && !(e.target && e.target.closest && e.target.closest('.qz-cat,[data-go]'))) {
          e.preventDefault(); start(); return;
        }
      } else if (phase === 'ask') {
        if (/^[a-dA-D]$/.test(key)) { e.preventDefault(); answer(key.toLowerCase().charCodeAt(0) - 97); return; }
        if (/^[1-4]$/.test(key)) { e.preventDefault(); answer(parseInt(key, 10) - 1); return; }
      } else if (phase === 'told') {
        if (key === 'Enter' && !(e.target && e.target.closest && e.target.closest('[data-go]'))) {
          e.preventDefault(); next(); return;
        }
      }
    });

    setup();
    return teardownOf(sc, function () { finished = true; });
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

  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push(
    { id: 'gyanpati', name: 'Kaun Banega Gyanpati?', icon: 'star', minutes: 6,
      blurb: 'Fifteen rungs, kauris doubling all the way up. Three lifelines, two safe havens — and walking away with the pot is winning too.',
      tag: 'ladder quiz', c: '#3b1d6e', c2: '#8b5cf6', scene: SCENE_GYAN,
      engine: gyanpati },
    { id: 'triviamaster', name: 'Trivia Master', icon: 'game', minutes: 4,
      blurb: 'Ten mixed questions from the categories you switch on — maps, history, festivals, food, epics. Streaks stack the points.',
      tag: 'mixed trivia', c: '#0f5e6e', c2: '#2dd4bf', scene: SCENE_TRIVIA,
      engine: triviamaster }
  );
})();
