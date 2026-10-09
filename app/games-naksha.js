/* Bizzing India — PLAY · Naksha (games spec §4.3, docs/32).

   A child finds India on the map with their own finger. Five levels, one board:

     L1 Dhoondho   "Tap Rajasthan." The big states first, the name in the prompt.
     L2 Rajdhani   "Tap the state whose capital is Bhubaneswar." The capital's dot appears
                   only AFTER the tap — before it, the dot would be the answer.
     L3 Pehchaano  A clue from data-states.js / data-geo.js (a state animal, a place, a dish),
                   with every clue that names its own state dropped.
     L4 Padosi     "Tap every state that touches Madhya Pradesh." The neighbours are
                   app/data-naksha.js, computed from the outlines by tools/build-naksha.js.
     L5 Nadi       Rivers in order. The states a river passes are lit and named; the child taps
                   them in the order the river flows through them, going downstream. The order
                   is app/data-rivers.js, each course read from a government source (CWC,
                   India-WRIS, the states' own pages) and checked against the map's own
                   neighbours. The names are on the map, the ORDER is the question, so the
                   prompt never lists them. No river line is drawn — the map data has none, and
                   a line typed here would be a boundary-like mark nobody sourced.

   THE MAP RULES (CLAUDE.md, binding). The outlines are map-data.js's, byte for byte: the
   Survey of India depiction, J&K whole, for every child in every locale. No border ever draws
   itself, pulses, moves or is "won": a found state's FILL tints softly and its outline never
   changes (tools/check-naksha.js snapshots every path's d and stroke across a whole round).
   The keyboard cursor and the callouts round the tiny territories are separate marks laid
   over the map, never a change to a boundary.

   Contract (docs/32): engine(host, opts, done). opts.answer() once per item at the first
   attempt; the host plays right/wrong from those reports. A wrong first tap HOLDS with the
   miss card until Aage. Keyboard: arrows walk a cursor over the states in reading order,
   Enter taps, a letter jumps (from L2 — at L1 it would spell out the answer), + and − zoom.
   Touch: one tap answers, pinch zooms, a drag pans. Plain script, no modules. */

(function () {
  'use strict';
  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document;

  var CSS = [
    '.nk{position:relative;display:grid;grid-template-columns:minmax(0,1fr);gap:10px;padding:10px;border-radius:var(--radius-lg,18px);',
    '  background:var(--ground);color:var(--text);font-family:var(--body);-webkit-tap-highlight-color:transparent}',
    '.nk-side{display:flex;flex-direction:column;gap:10px;min-width:0}',
    '.nk-ask{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-md,14px);padding:10px 14px;box-shadow:var(--shadow)}',
    '.nk-kick{display:flex;justify-content:space-between;gap:8px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}',
    '.nk-q{margin:4px 0 0;font:700 20px/1.3 var(--display);color:var(--text)}',
    '.nk-q b{color:var(--accent-ink,var(--accent))}',
    '.nk-clue{margin:6px 0 0;font-size:16px;line-height:1.45;color:var(--text2)}',
    '.nk-pips{display:flex;gap:5px;margin-top:8px}',
    '.nk-pip{flex:1;height:6px;border-radius:3px;background:var(--line2)}',
    '.nk-pip.on{background:var(--accent)}',
    '.nk-pip.now{background:var(--accent2)}',
    '.nk-note{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-md,14px);padding:10px 14px;font-size:14px;line-height:1.45;color:var(--text2)}',
    '.nk-note b{color:var(--text)}',
    '.nk-mapbox{position:relative;width:min(100%,calc(var(--nk-h,640px)*1000/1100));margin:0 auto;aspect-ratio:1000/1100;border-radius:var(--radius-md,14px);',
    '  background:var(--card);box-shadow:var(--shadow),inset 0 0 0 1px var(--line2);overflow:hidden}',
    '.nk-map{display:block;width:100%;height:100%;touch-action:none;user-select:none;-webkit-user-select:none;cursor:pointer;outline:none}',
    '.nk-map:focus-visible{box-shadow:inset 0 0 0 3px var(--accent)}',
    '.nk-sea{fill:var(--accent-soft)}',
    '.nk-outline{fill:var(--ground);stroke:none}',
    '.nk-st{fill:var(--ground);stroke:var(--text2);stroke-opacity:.55;stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round}',
    '.nk-st.nk-tgt{fill:var(--accent);fill-opacity:.32}',
    '.nk-st.nk-ok{fill:var(--accent2);fill-opacity:.62}',
    '.nk-st.nk-no{fill:var(--mist);fill-opacity:1}',
    '@media (hover:hover){.nk-st:not(.nk-ok):not(.nk-no):not(.nk-tgt):hover{fill:var(--accent);fill-opacity:.14}}',
    '.nk-call{fill:none;stroke:var(--accent);stroke-opacity:.3;stroke-dasharray:3 3;vector-effect:non-scaling-stroke;pointer-events:none}',
    '.nk-cur{fill:none;stroke:var(--accent);stroke-width:3;vector-effect:non-scaling-stroke;pointer-events:none}',
    '.nk-cur2{fill:none;stroke:var(--card);stroke-width:6;vector-effect:non-scaling-stroke;pointer-events:none}',
    '.nk-lab{fill:var(--text);stroke:var(--card);stroke-width:4px;paint-order:stroke;stroke-linejoin:round;font-family:var(--body);font-weight:800;text-anchor:middle;pointer-events:none}',
    '.nk-cap{fill:var(--accent3,var(--accent));stroke:var(--card);stroke-width:2;vector-effect:non-scaling-stroke;pointer-events:none}',
    /* a ROW across the top right: over the empty corner outside the outline at every size, where a column
       stood on Arunachal Pradesh and took the taps meant for it (the Brahmaputra starts there) */
    '.nk-zoom{position:absolute;top:8px;right:8px;display:flex;flex-direction:row;gap:6px;z-index:2}',
    '.nk-zb{width:44px;height:44px;border-radius:50%;border:1px solid var(--line2);background:var(--card);color:var(--text);font:800 20px/1 var(--body);',
    '  display:grid;place-items:center;cursor:pointer;box-shadow:var(--shadow);padding:0}',
    '.nk-zb:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.nk-fb:empty{display:none}',
    '.nk-fb>div{background:var(--card);border:1px solid var(--line2);border-radius:var(--radius-md,14px);padding:10px 14px;box-shadow:var(--shadow-lg,var(--shadow));color:var(--text)}',
    '.nk-fb .gm-miss{border-left:5px solid var(--mist)}',
    '.nk-fb .nk-yes{border-left:5px solid var(--accent2)}',
    '.nk-fb b{font-family:var(--display);font-size:18px}',
    '.nk-fb .gm-ans{font-size:16px}',
    '.nk-fb .gm-teach{margin:6px 0 8px;font-size:15px;line-height:1.45;color:var(--text2)}',
    '.nk-fb .gm-aage{min-height:44px;min-width:120px;font-size:16px}',
    '.nk-fb .nk-src{font-size:13px;margin-top:-4px;color:var(--muted)}',
    '.nk-soon{font-size:13px;color:var(--muted);margin:6px 0 0}',
    '.nk-legend{display:flex;flex-direction:column;gap:6px;font-size:13.5px;color:var(--text2)}',
    '.nk-legend i{display:inline-block;width:18px;height:12px;border-radius:3px;margin-right:8px;vertical-align:-1px;border:1px solid var(--line2)}',
    '.nk-legend .l-ok{background:var(--accent2)}.nk-legend .l-no{background:var(--mist)}.nk-legend .l-tgt{background:var(--accent);opacity:.5}',
    '@media (min-width:900px){',
    '  .nk{grid-template-columns:minmax(220px,1fr) var(--nk-w,520px) minmax(220px,1fr);align-items:start;padding:16px;gap:16px}\n  .nk-mapbox{width:100%}',
    '  .nk-left{grid-column:1;grid-row:1}.nk-mid{grid-column:2;grid-row:1}.nk-right{grid-column:3;grid-row:1}',
    '  .nk-q{font-size:24px}',
    '}',
    '@media (max-width:899px){',
    '  .nk{padding:6px;gap:6px;border-radius:var(--radius-md,14px)}',
    '  .nk-ask{padding:8px 12px}.nk-q{font-size:18px}.nk-clue{font-size:15px;margin-top:4px}',
    '  .nk-right{position:absolute;left:12px;right:12px;bottom:12px;z-index:3}',
    '  .nk-right .nk-note,.nk-legend{display:none}',
    '  .nk-fb>div{padding:8px 12px}.nk-fb b{font-size:16px}.nk-fb .gm-ans{font-size:15px}',
    '  .nk-fb .gm-teach{font-size:14px;margin:4px 0 6px;line-height:1.4}',
    '}',
    '@media (prefers-reduced-motion:no-preference){.nk-fb>div{animation:nkin .18s ease-out}}',
    '@keyframes nkin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}'
  ].join('\n');

  function injectCSS() {
    if (!D || D.getElementById('nk-css')) return;
    var s = D.createElement('style'); s.id = 'nk-css'; s.textContent = CSS; D.head.appendChild(s);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function firstSentence(s) {
    s = String(s || '').trim();
    var m = /^(.+?[.!?])(\s|$)/.exec(s);
    return m ? m[1] : s;
  }

  /* area of a path, for "the big states first" */
  function areaOf(d) {
    var total = 0;
    String(d).split(/M/).forEach(function (part) {
      var n = (part.match(/-?\d+(?:\.\d+)?/g) || []).map(Number), a = 0, k;
      for (k = 0; k + 3 < n.length; k += 2) a += n[k] * n[k + 3] - n[k + 2] * n[k + 1];
      if (n.length >= 6) a += n[n.length - 2] * n[1] - n[0] * n[n.length - 1];
      total += Math.abs(a) / 2;
    });
    return total;
  }

  var MODES = ['find', 'capital', 'clue', 'neighbours', 'river'];
  var MODE_ALIAS = { dhoondho: 'find', find: 'find', rajdhani: 'capital', capital: 'capital', capitals: 'capital',
    pehchaano: 'clue', clue: 'clue', clues: 'clue', padosi: 'neighbours', neighbours: 'neighbours', neighbors: 'neighbours',
    nadi: 'river', river: 'river', rivers: 'river', yatra: 'yatra', route: 'yatra' };
  var MODE_NAME = { find: 'Dhoondho · find it', capital: 'Rajdhani · capitals', clue: 'Pehchaano · clues',
    neighbours: 'Padosi · neighbours', river: 'Nadi · rivers', yatra: 'Yatra · the journey' };
  var PRACTISE = {
    find: 'Where each state sits on the map — its shape and its place.',
    capital: 'Each state’s capital city, and where the state is.',
    clue: 'What each state is known for — its animals, places and food.',
    neighbours: 'Which states share a border. The neighbours come from the map’s own outlines.',
    river: 'Where India’s rivers run — the states each one passes, in order, going downstream. Every course comes from a government source.',
    yatra: 'A journey across India, one state after the next.'
  };
  var TINY_MAX = 40;   /* map units: a territory smaller than this gets an enlarged hit zone and a callout */

  function naksha(host, opts, done) {
    opts = opts || {};
    injectCSS();
    var M = W.IND_MAP, GEO = (W.IND_GEO && W.IND_GEO.states) || {}, ST = W.IND_STATES || {};
    var NB = (W.IND_NAKSHA && W.IND_NAKSHA.neighbours) || {};
    var finished = false, dead = false;
    function finish(res) { if (finished) return; finished = true; teardown(); done(res); }
    if (!M || !M.paths) {
      host.innerHTML = '<div class="nk"><div class="nk-ask"><p class="nk-q">The map has not loaded yet.</p></div></div>';
      return function () {};
    }

    var level = Math.max(1, Math.min(5, parseInt(opts.level, 10) || 1));
    var scope = opts.scope && (opts.scope.mode || opts.scope.set) ? opts.scope : null;
    var mode = scope && MODE_ALIAS[String(scope.mode || '').toLowerCase()] || MODES[level - 1];
    if (scope && typeof scope.mode === 'number') mode = MODES[Math.max(1, Math.min(5, scope.mode)) - 1];
    var only = scope && scope.set && scope.set.length ? scope.set.slice() : null;

    /* ---------------------------------------------------------------- territories */
    var CODES = Object.keys(M.paths).filter(function (c) { return GEO[c]; });
    var hasLD = !!(GEO.LD && M.capitals && M.capitals.LD);
    var ALL = CODES.concat(hasLD ? ['LD'] : []);
    function name(c) { return (GEO[c] && GEO[c].name) || c; }
    function anchor(c) {
      if (c === 'LD') return [M.capitals.LD[0], M.capitals.LD[1]];
      var a = (M.anchors || {})[c]; if (a) return [a[0], a[1]];
      var b = (M.bbox || {})[c]; return b ? [b[0] + b[2] / 2, b[1] + b[3] / 2] : [500, 550];
    }
    var AREA = {};
    ALL.forEach(function (c) { AREA[c] = c === 'LD' ? 0 : areaOf(M.paths[c]); });
    var TINY = ALL.filter(function (c) {
      if (c === 'LD' || c === 'PY') return true;
      var b = (M.bbox || {})[c]; return b && Math.max(b[2], b[3]) < TINY_MAX;
    });
    /* the keyboard's reading order: rows of the map, top to bottom, each left to right */
    var ORDER = ALL.slice().sort(function (a, b) {
      var A = anchor(a), B = anchor(b), ra = Math.floor(A[1] / 70), rb = Math.floor(B[1] / 70);
      return ra !== rb ? ra - rb : A[0] - B[0];
    });

    /* ------------------------------------------------------- leak rules for clues */
    function leakWords(c, nameOnly) {
      var g = GEO[c] || {}, out = [];
      String(g.name || '').split(/[^A-Za-z]+/).forEach(function (w) {
        if (w.length >= 4 && !/^(pradesh|islands|nagar|haveli|and)$/i.test(w)) out.push(w.slice(0, Math.min(5, w.length)));
      });
      if (!nameOnly) String(g.capital || (ST[c] || {}).capital || '').split(/[^A-Za-z]+/).forEach(function (w) {
        if (w.length >= 4 && !/^(summer|winter)$/i.test(w)) out.push(w);
      });
      return out;
    }
    function leaks(text, c, nameOnly) {
      var t = String(text || '').toLowerCase();
      return leakWords(c, nameOnly).some(function (w) { return t.indexOf(w.toLowerCase()) >= 0; });
    }

    /* ---------------------------------------------------------------- the round */
    var ITEMS_N = 10, RIVER_N = 8;
    function build() {
      var pool, items = [];
      if (mode === 'find') {
        pool = (only || ALL.slice().sort(function (a, b) { return AREA[b] - AREA[a]; }).slice(0, 18))
          .filter(function (c) { return ALL.indexOf(c) >= 0; });
        /* big states first: ten of the eighteen largest, the largest asked first */
        items = shuffle(pool).slice(0, ITEMS_N).sort(function (a, b) { return AREA[b] - AREA[a]; }).map(function (c) {
          return { id: 'find:' + c, accept: [c], answer: c, skill: 'naksha.find',
            q: 'Tap <b>' + esc(name(c)) + '</b>.', speak: 'Tap ' + name(c),
            teach: firstSentence((GEO[c] || {}).fact) };
        });
      } else if (mode === 'capital') {
        var count = {};
        ALL.forEach(function (c) { var k = (GEO[c] || {}).capital; if (k) count[k] = (count[k] || 0) + 1; });
        pool = (only || ALL).filter(function (c) {
          var cap = (GEO[c] || {}).capital;
          return cap && count[cap] === 1 && !/[·(]/.test(cap) && !leaks(cap, c, true) && M.capitals && M.capitals[c];
        });
        items = shuffle(pool).slice(0, ITEMS_N).map(function (c) {
          var cap = GEO[c].capital;
          return { id: 'capital:' + c, accept: [c], answer: c, skill: 'naksha.capital', cap: c,
            q: 'Tap the state whose capital is <b>' + esc(cap) + '</b>.', speak: 'Tap the state whose capital is ' + cap,
            ans: esc(cap) + ' is the capital of <b>' + esc(name(c)) + '</b>.',
            teach: firstSentence((GEO[c] || {}).fact) };
        });
      } else if (mode === 'clue') {
        pool = (only || ALL).map(function (c) {
          var s = ST[c] || {}, g = GEO[c] || {}, cl = [];
          if (s.symbols && s.symbols.animal) cl.push('Its state animal is the ' + s.symbols.animal + '.');
          if (s.symbols && s.symbols.bird) cl.push('Its state bird is the ' + s.symbols.bird + '.');
          (s.places || []).forEach(function (p) { if (p && p.name && p.what) cl.push(p.name + ' is here — ' + p.what.charAt(0).toLowerCase() + p.what.slice(1)); });
          (s.food || []).slice(0, 2).forEach(function (f) { if (f && f.dish && f.what) cl.push('Families here make ' + f.dish + ': ' + f.what.charAt(0).toLowerCase() + f.what.slice(1)); });
          if (g.fact) cl.push(g.fact);
          cl = cl.filter(function (t) { return !leaks(t, c); });
          return { c: c, clues: cl };
        }).filter(function (x) { return x.clues.length; });
        items = shuffle(pool).slice(0, ITEMS_N).map(function (x) {
          var cl = shuffle(x.clues);
          return { id: 'clue:' + x.c, accept: [x.c], answer: x.c, skill: 'naksha.clue',
            q: 'Which state is this? Tap it.', clue: cl[0], speak: cl[0],
            teach: cl[1] || firstSentence((GEO[x.c] || {}).fact) };
        });
      } else if (mode === 'neighbours') {
        pool = (only || CODES).filter(function (c) { var n = NB[c] || []; return n.length >= 2 && n.length <= 6; });
        items = shuffle(pool).slice(0, 6).map(function (c) {
          return { id: 'neighbours:' + c, accept: NB[c].slice(), answer: c, multi: true, target: c, skill: 'naksha.neighbours',
            q: 'Tap every state that touches <b>' + esc(name(c)) + '</b>.', speak: 'Tap every state that touches ' + name(c),
            teach: name(c) + ' shares a border with ' + listNames(NB[c]) + '.' };
        });
      } else if (mode === 'river') {
        /* RIVERS IN ORDER (data-rivers.js). A river is asked only if it is sourced (a source with
           a URL), every state on its course is on this map, and it passes at least two. The
           round leans on the longer courses: up to five of three or more states, then two-state
           ones to fill it. */
        var RV = (W.IND_RIVERS && W.IND_RIVERS.rivers) || [];
        pool = RV.filter(function (r) {
          if (!r || !r.id || !r.name || !r.course || r.course.length < 2) return false;
          if (!(r.sources || []).some(function (x) { return x && /^https?:\/\//.test(x.url || ''); })) return false;
          if (r.course.some(function (c, i, a) { return CODES.indexOf(c) < 0 || a.indexOf(c) !== i; })) return false;
          return !only || only.indexOf(r.id) >= 0 || only.indexOf(r.name) >= 0;
        });
        var longer = shuffle(pool.filter(function (r) { return r.course.length >= 3; }));
        var two = shuffle(pool.filter(function (r) { return r.course.length === 2; }));
        var pickR = longer.slice(0, 5);
        pickR = pickR.concat(two.slice(0, RIVER_N - pickR.length));
        if (pickR.length < RIVER_N) pickR = pickR.concat(longer.slice(5, 5 + RIVER_N - pickR.length));
        items = shuffle(pickR).map(function (r) {
          return { id: 'river:' + r.id, river: r, accept: r.course.slice(), lit: r.course.slice(), answer: r.course[0], multi: true, ordered: true,
            skill: 'naksha.river',
            q: 'The <b>' + esc(r.name) + '</b> flows through the lit states. Tap them in order, going downstream.',
            speak: 'The ' + r.name + ' flows through the lit states. Tap them in order, going downstream.',
            teach: r.teach || '', src: (r.sources[0] || {}).publisher || '' };
        });
      } else if (mode === 'yatra') {
        var route = (only || []).filter(function (c) { return ALL.indexOf(c) >= 0; });
        if (route.length >= 2) items = [{ id: 'yatra:' + route.join('-'), accept: route, answer: route[0], multi: true, ordered: true,
          skill: 'naksha.yatra', q: 'Tap the journey in order: ' + route.map(function (c) { return '<b>' + esc(name(c)) + '</b>'; }).join(' → ') + '.',
          speak: 'Tap the journey in order', teach: 'The journey runs ' + route.map(name).join(', then ') + '.' }];
      }
      return items;
    }
    function listNames(cs) {
      var n = cs.map(name);
      return n.length < 2 ? n.join('') : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1];
    }

    var items = build();
    var idx = -1, it = null, judged = false, hold = false, found = {}, asked = 0, firstRight = 0, tapped = [];
    var kb = false, cursor = -1;

    /* ---------------------------------------------------------------- the board */
    var vb = String(M.viewBox || '0 0 1000 1100').split(/[\s,]+/).map(Number);
    var FULL = { x: vb[0], y: vb[1], w: vb[2], h: vb[3] }, view = { x: FULL.x, y: FULL.y, w: FULL.w, h: FULL.h };
    var paths = CODES.map(function (c) {
      return '<path class="nk-st" data-c="' + c + '" d="' + M.paths[c] + '"><title>' + (mode === 'find' ? 'A state' : esc(name(c))) + '</title></path>';
    }).join('');
    var ld = hasLD ? '<circle class="nk-st nk-mark" data-c="LD" cx="' + M.capitals.LD[0] + '" cy="' + M.capitals.LD[1] + '" r="6"/>' : '';
    var calls = TINY.map(function (c) { var a = anchor(c); return '<circle class="nk-call" data-for="' + c + '" cx="' + a[0] + '" cy="' + a[1] + '" r="20"/>'; }).join('');

    host.innerHTML =
      '<div class="nk" data-level="' + level + '" data-mode="' + mode + '">' +
        '<div class="nk-side nk-left">' +
          '<div class="nk-ask" aria-live="polite"><div class="nk-kick"><span>' + esc(MODE_NAME[mode] || 'Naksha') + '</span><span class="nk-count"></span></div>' +
            '<p class="nk-q"></p><p class="nk-clue" hidden></p><div class="nk-pips" aria-hidden="true"></div>' +
          '</div>' +
          '<div class="nk-note nk-legend" aria-hidden="true">' +
            (mode === 'river' ? '<span><i class="l-tgt"></i>the river’s states, still to order</span><span><i class="l-ok"></i>1 · 2 · 3 the order it flows</span>'
              : '<span><i class="l-ok"></i>✓ the right state</span><span><i class="l-no"></i>✕ the state you tapped</span>') +
            (mode === 'neighbours' ? '<span><i class="l-tgt"></i>the state asked about</span>' : '') +
            '<span>Keys: arrows move · Enter taps' + (mode === 'find' ? '' : ' · a letter jumps') + ' · + − zoom</span></div>' +
        '</div>' +
        '<div class="nk-mid">' +
          '<div class="nk-mapbox">' +
            '<svg class="nk-map" viewBox="' + FULL.x + ' ' + FULL.y + ' ' + FULL.w + ' ' + FULL.h + '" tabindex="0" role="application" ' +
              'aria-label="Map of India, the Survey of India depiction. Arrow keys move between states, Enter chooses.">' +
              '<rect class="nk-sea" x="' + (FULL.x - 2000) + '" y="' + (FULL.y - 2000) + '" width="' + (FULL.w + 4000) + '" height="' + (FULL.h + 4000) + '"/>' +
              '<path class="nk-outline" d="' + M.outline + '"/>' +
              '<g class="nk-states">' + paths + ld + '</g>' +
              '<g class="nk-calls">' + calls + '</g>' +
              '<g class="nk-over"></g>' +
            '</svg>' +
            '<div class="nk-zoom"><button type="button" class="nk-zb" data-nk="zin" aria-label="Zoom in">+</button>' +
              '<button type="button" class="nk-zb" data-nk="zout" aria-label="Zoom out">−</button>' +
              '<button type="button" class="nk-zb" data-nk="zreset" aria-label="Whole map">⤢</button></div>' +
          '</div>' +
        '</div>' +
        '<div class="nk-side nk-right">' +
          '<div class="nk-note"><b>What you are practising:</b> ' + esc(PRACTISE[mode] || '') + '</div>' +
          '<div class="nk-fb" aria-live="assertive"></div>' +
        '</div>' +
      '</div>';

    var root = host.querySelector('.nk'), svg = host.querySelector('.nk-map'), over = host.querySelector('.nk-over');
    var fb = host.querySelector('.nk-fb'), qEl = host.querySelector('.nk-q'), clueEl = host.querySelector('.nk-clue');
    var pipsEl = host.querySelector('.nk-pips'), countEl = host.querySelector('.nk-count'), box = host.querySelector('.nk-mapbox');
    var EL = {};
    Array.prototype.forEach.call(host.querySelectorAll('.nk-st'), function (e) { EL[e.getAttribute('data-c')] = e; });

    if (!items.length) {
      qEl.innerHTML = 'Nothing to ask here yet.';
      fb.innerHTML = '<div class="nk-yes"><p class="gm-teach">The data this level needs has not loaded.</p>' +
        '<button type="button" class="btn gm-aage" data-gm="aage">Aage →</button></div>';
      hold = true;
    }

    /* ----------------------------------------------------- fitting the screen */
    /* The stage fits the screen it is on. On a desk the map takes the height below the frame;
       on a phone the stage sits just under the sticky header and everything a child must tap
       stays above the tab bar (games spec §1.6, T18). */
    var scrolled = false;
    function edges() {
      var bar = D.querySelector('[data-bz=tabbar]'), hdr = D.querySelector('[data-bz=header]');
      var barTop = W.innerHeight, hb = 0;
      if (bar && getComputedStyle(bar).display !== 'none') { var r = bar.getBoundingClientRect(); if (r.height) barTop = r.top; }
      if (hdr) hb = Math.max(0, hdr.getBoundingClientRect().bottom);
      return { bar: barTop, hdr: hb };
    }
    function fit() {
      if (dead || !box.isConnected) return;
      var wide = W.innerWidth >= 900, e = edges(), h, w;
      if (wide) {
        var topDoc = root.getBoundingClientRect().top + (W.scrollY || 0);
        h = Math.max(440, Math.min(780, W.innerHeight - topDoc - 40));
        w = Math.min(h * 1000 / 1100, root.clientWidth - 2 * 220 - 2 * 16 - 32);
        h = w * 1100 / 1000;
        root.style.setProperty('--nk-w', Math.round(w) + 'px');
      } else {
        var askH = host.querySelector('.nk-left').getBoundingClientRect().height;
        h = Math.max(300, e.bar - e.hdr - askH - 6 - 12 - 14);
      }
      root.style.setProperty('--nk-h', Math.round(h) + 'px');
      if (!wide && !scrolled) {
        scrolled = true;
        var rr = root.getBoundingClientRect();
        if (rr.bottom > e.bar || rr.top < e.hdr) W.scrollBy(0, rr.top - e.hdr - 6);
      }
      overlay();
    }
    /* on a phone the card sits over the map: over the north when the answer is in the south */
    function placeCard() {
      var right = host.querySelector('.nk-right');
      if (!right) return;
      if (W.innerWidth >= 900 || !it) { right.style.top = ''; right.style.bottom = ''; return; }
      var a = anchor(it.target || it.answer), low = a[1] > view.y + view.h * 0.5;
      if (low) { right.style.top = (box.offsetTop + 8) + 'px'; right.style.bottom = 'auto'; }
      else { right.style.top = ''; right.style.bottom = ''; }
    }
    function k() {
      var r = svg.getBoundingClientRect();
      return Math.min(r.width / view.w, r.height / view.h) || 0.4;
    }
    function setView(v) {
      var w = Math.max(FULL.w / 6, Math.min(FULL.w, v.w)), h = w * FULL.h / FULL.w;
      var x = Math.max(FULL.x - w * 0.1, Math.min(FULL.x + FULL.w - w * 0.9, v.x));
      var y = Math.max(FULL.y - h * 0.1, Math.min(FULL.y + FULL.h - h * 0.9, v.y));
      if (w >= FULL.w) { x = FULL.x; y = FULL.y; }
      view = { x: x, y: y, w: w, h: h };
      svg.setAttribute('viewBox', x.toFixed(1) + ' ' + y.toFixed(1) + ' ' + w.toFixed(1) + ' ' + h.toFixed(1));
      overlay();
    }
    function zoomAt(f, cx, cy) {
      var w = view.w / f, h = w * FULL.h / FULL.w;
      if (cx == null) { cx = view.x + view.w / 2; cy = view.y + view.h / 2; }
      setView({ x: cx - (cx - view.x) * (w / view.w), y: cy - (cy - view.y) * (h / view.h), w: w, h: h });
    }
    function zoneR(c) { return Math.min(36, 18 / k()); }

    /* ------------------------------------------------- the marks laid over the map */
    var marks = [];   /* {c, kind:'ok'|'no'|'tgt'} labels to draw */
    function overlay() {
      if (!over) return;
      var kk = k(), fs = 14 / kk, out = '';
      Array.prototype.forEach.call(host.querySelectorAll('.nk-call'), function (e) { e.setAttribute('r', zoneR(e.getAttribute('data-for')).toFixed(1)); });
      if (it && it.cap && judged) {
        var cp = M.capitals[it.cap];
        out += '<circle class="nk-cap" cx="' + cp[0] + '" cy="' + cp[1] + '" r="' + (6 / kk).toFixed(1) + '"/>' +
          '<text class="nk-lab" x="' + cp[0] + '" y="' + (cp[1] + 20 / kk).toFixed(1) + '" font-size="' + (13 / kk).toFixed(1) + '">' + esc(cp[2]) + '</text>';
      }
      marks.forEach(function (m) {
        var a = anchor(m.c), up = (it && judged && it.cap && it.cap === m.c) ? fs * 1.5 : 0;
        out += '<text class="nk-lab" x="' + a[0] + '" y="' + (a[1] + fs * 0.35 - up).toFixed(1) + '" font-size="' + fs.toFixed(1) + '"' + (m.n ? ' data-n="' + m.n + '"' : '') + '>' +
          (m.kind === 'no' ? '✕ ' : m.kind === 'ok' ? (m.n ? m.n + ' · ' : '✓ ') : '') + esc(name(m.c)) + '</text>';
      });
      if (kb && cursor >= 0) {
        var c = ORDER[cursor], a = anchor(c), r = 15 / kk;
        out += '<circle class="nk-cur2" cx="' + a[0] + '" cy="' + a[1] + '" r="' + r.toFixed(1) + '"/>' +
          '<circle class="nk-cur" data-cur="' + c + '" cx="' + a[0] + '" cy="' + a[1] + '" r="' + r.toFixed(1) + '"/>';
        if (mode !== 'find' && !marks.some(function (m) { return m.c === c; }))
          out += '<text class="nk-lab" x="' + a[0] + '" y="' + (a[1] - r - 6 / kk).toFixed(1) + '" font-size="' + fs.toFixed(1) + '">' + esc(name(c)) + '</text>';
      }
      over.innerHTML = out;
    }

    /* ---------------------------------------------------------------- items */
    function pips() {
      var h = '';
      for (var i = 0; i < items.length; i++) h += '<i class="nk-pip' + (i < idx ? ' on' : i === idx ? ' now' : '') + '"></i>';
      pipsEl.innerHTML = h;
      countEl.textContent = (idx + 1) + ' of ' + items.length;
    }
    function clearBoard() {
      ALL.forEach(function (c) { if (EL[c]) EL[c].classList.remove('nk-ok', 'nk-no', 'nk-tgt'); });
      marks = []; found = {}; tapped = [];
    }
    function next() {
      timer = null;
      if (dead) return;
      idx++;
      if (idx >= items.length) {
        var pct = asked ? firstRight / asked : 0;
        finish({ win: asked > 0 && pct >= 0.5, score: firstRight, asked: asked, firstTryRight: firstRight, level: level,
          levelNext: asked ? (pct < 0.5 ? Math.max(1, level - 1) : pct >= 0.8 ? Math.min(5, level + 1) : level) : level });
        return;
      }
      it = items[idx]; judged = false; hold = false;
      clearBoard(); fb.innerHTML = '';
      qEl.innerHTML = it.q + (it.multi && (!it.ordered || it.lit) ? ' <span class="nk-found">(' + 0 + ' of ' + it.accept.length + ')</span>' : '');
      if (it.clue) { clueEl.hidden = false; clueEl.textContent = it.clue; } else { clueEl.hidden = true; clueEl.textContent = ''; }
      if (it.target) { EL[it.target].classList.add('nk-tgt'); marks.push({ c: it.target, kind: 'tgt' }); }
      /* a river's states are lit and named — never in the river's order: shuffled, so even the
         order the labels sit in the page (what a screen reader reads) says nothing */
      if (it.lit) shuffle(it.lit).forEach(function (c) { if (EL[c]) EL[c].classList.add('nk-tgt'); marks.push({ c: c, kind: 'lit' }); });
      pips(); overlay();
    }
    function report(right) {
      asked++; if (right) firstRight++;
      if (typeof opts.answer === 'function') {
        try { opts.answer({ id: it.id, right: right, firstTry: true, skill: it.skill, objective: null }); } catch (e) {}
      }
    }
    function setMark(c, kind, n) {
      for (var i = 0; i < marks.length; i++) if (marks[i].c === c) { marks[i].kind = kind; marks[i].n = n || 0; return; }
      marks.push({ c: c, kind: kind, n: n || 0 });
    }
    function riverOrder() { return it.accept.map(function (c) { return '<b>' + esc(name(c)) + '</b>'; }).join(' → '); }
    function ordinal(n) { return n + (n % 10 === 1 && n % 100 !== 11 ? 'st' : n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th'); }
    function tapRiver(c) {
      if (found[c]) return;
      if (it.lit.indexOf(c) < 0) {
        /* not on the river's way: not an answer, just a pointer back to the lit states */
        clueEl.hidden = false; clueEl.textContent = name(c) + ' is not on the ' + it.river.name + '’s way — tap one of the lit states.';
        return;
      }
      clueEl.hidden = true; clueEl.textContent = '';
      var k = Object.keys(found).length;
      if (c === it.accept[k]) {
        found[c] = true;
        if (EL[c]) { EL[c].classList.remove('nk-tgt'); EL[c].classList.add('nk-ok'); }
        setMark(c, 'ok', k + 1);
        var fe = qEl.querySelector('.nk-found'); if (fe) fe.textContent = '(' + (k + 1) + ' of ' + it.accept.length + ')';
        if (W.IND_SFX && k + 1 < it.accept.length) W.IND_SFX.play('tap');
        overlay();
        if (k + 1 >= it.accept.length) { judged = true; report(true); showRight(); }
        return;
      }
      judged = true; report(false); showMiss(c);
    }
    function tapCode(c) {
      if (dead || !it || hold || judged || !c) return;
      if (it.lit) { tapRiver(c); return; }
      if (it.multi) {
        if (c === it.target || found[c]) return;
        var want = it.ordered ? it.accept[Object.keys(found).length] : null;
        var ok = it.ordered ? c === want : it.accept.indexOf(c) >= 0;
        if (ok) {
          found[c] = true; EL[c] && EL[c].classList.add('nk-ok'); marks.push({ c: c, kind: 'ok' });
          var nf = Object.keys(found).length;
          var fe = qEl.querySelector('.nk-found'); if (fe) fe.textContent = '(' + nf + ' of ' + it.accept.length + ')';
          if (W.IND_SFX && nf < it.accept.length) W.IND_SFX.play('tap');
          overlay();
          if (nf >= it.accept.length) { judged = true; report(true); showRight(); }
          return;
        }
        judged = true; report(false); showMiss(c); return;
      }
      judged = true;
      var right = it.accept.indexOf(c) >= 0;
      report(right);
      if (right) { EL[c] && EL[c].classList.add('nk-ok'); marks.push({ c: c, kind: 'ok' }); showRight(); }
      else showMiss(c);
    }
    function srcLine() { return it.src ? '<p class="gm-teach nk-src">Source: ' + esc(it.src) + '.</p>' : ''; }
    function showRight() {
      var ans = it.ans || ('<b>' + esc(name(it.answer)) + '</b>' + (it.multi ? '' : ' — yes.'));
      if (it.multi) ans = 'All of them — <b>' + esc(listNames(it.accept)) + '</b>.';
      if (it.lit) ans = 'Yes — the ' + esc(it.river.name) + ' flows ' + riverOrder() + '.';
      placeCard();
      fb.innerHTML = '<div class="nk-yes" role="status"><span class="gm-ans">' + ans + '</span>' +
        (it.teach ? '<p class="gm-teach">' + esc(it.teach) + '</p>' : '') + srcLine() +
        '<button type="button" class="btn gm-aage" data-gm="aage">Aage →</button></div>';
      overlay();
      wait(1800);
    }
    function showMiss(c) {
      hold = true;
      if (it.lit) {
        /* the whole course, numbered in its order; the card says where the tapped state comes */
        var k = Object.keys(found).length, at = it.accept.indexOf(c);
        it.accept.forEach(function (x, i) { if (EL[x]) { EL[x].classList.remove('nk-tgt'); EL[x].classList.add('nk-ok'); } setMark(x, 'ok', i + 1); });
        var lead = k === 0 ? 'The ' + esc(it.river.name) + ' starts in <b>' + esc(name(it.accept[0])) + '</b>'
          : 'After ' + esc(name(it.accept[k - 1])) + ' the ' + esc(it.river.name) + ' reaches <b>' + esc(name(it.accept[k])) + '</b>';
        placeCard();
        fb.innerHTML = '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">' + lead + ' — ' + esc(name(c)) + ' comes ' + ordinal(at + 1) +
          '. In order: ' + riverOrder() + '.</span>' +
          (it.teach ? '<p class="gm-teach">' + esc(it.teach) + '</p>' : '') + srcLine() +
          '<button type="button" class="btn gm-aage" data-gm="aage">Aage →</button></div>';
        overlay();
        var bR = fb.querySelector('.gm-aage'); if (bR && kb) try { bR.focus({ preventScroll: true }); } catch (e) {}
        return;
      }
      if (EL[c]) EL[c].classList.add('nk-no');
      marks.push({ c: c, kind: 'no' });
      var show = it.multi ? it.accept.filter(function (x) { return !found[x]; }) : it.accept;
      show.forEach(function (x) { if (EL[x]) EL[x].classList.add('nk-ok'); marks.push({ c: x, kind: 'ok' }); });
      var ans;
      if (it.multi && it.ordered) ans = 'Next on the journey was <b>' + esc(name(it.accept[Object.keys(found).length])) + '</b>, not ' + esc(name(c)) + '.';
      else if (it.multi) ans = esc(name(c)) + ' does not touch ' + esc(name(it.target)) + '. Its neighbours are <b>' + esc(listNames(it.accept)) + '</b>.';
      else if (it.ans) ans = 'That is ' + esc(name(c)) + '. ' + it.ans;
      else ans = 'That is ' + esc(name(c)) + '. <b>' + esc(name(it.answer)) + '</b> is the warm one.';
      placeCard();
      fb.innerHTML = '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">' + ans + '</span>' +
        (it.teach ? '<p class="gm-teach">' + esc(it.teach) + '</p>' : '') +
        '<button type="button" class="btn gm-aage" data-gm="aage">Aage →</button></div>';
      overlay();
      var b = fb.querySelector('.gm-aage'); if (b && kb) try { b.focus({ preventScroll: true }); } catch (e) {}
    }
    function aage() {
      if (dead) return;
      if (hold || judged || !items.length) { if (!items.length) { finish({ win: false, score: 0, asked: 0, firstTryRight: 0, level: level, levelNext: level }); return; } stopWait(); next(); }
    }

    /* the beat after a right answer: requestAnimationFrame with delta time, stopped while hidden */
    var timer = null, raf = 0, last = 0;
    function wait(ms) { timer = { left: ms }; last = 0; raf = W.requestAnimationFrame(tick); }
    function stopWait() { timer = null; if (raf) W.cancelAnimationFrame(raf); raf = 0; }
    function tick(t) {
      raf = 0;
      if (!timer || dead) return;
      if (D.hidden) { last = 0; raf = W.requestAnimationFrame(tick); return; }
      if (last) timer.left -= Math.min(100, t - last);
      last = t;
      if (timer.left <= 0) { stopWait(); next(); return; }
      raf = W.requestAnimationFrame(tick);
    }
    function onVis() { last = 0; }

    /* ------------------------------------------------------------ touch and mouse */
    function toMap(cx, cy) {
      var m = svg.getScreenCTM(); if (!m) return null;
      var p = svg.createSVGPoint(); p.x = cx; p.y = cy;
      return p.matrixTransform(m.inverse());
    }
    /* The state under the finger — but a tiny territory's enlarged zone wins near it. The
       zone never reaches more than halfway to the anchor of the state the finger is in, so
       Haryana's own middle is always Haryana and never Delhi. */
    function inFill(e, pt) {
      try { return e.isPointInFill(new DOMPoint(pt.x, pt.y)); } catch (er) {
        try { var sp = svg.createSVGPoint(); sp.x = pt.x; sp.y = pt.y; return e.isPointInFill(sp); } catch (er2) { return false; }
      }
    }
    function codeAt(pt) {
      var inside = null, i;
      for (i = 0; i < CODES.length; i++) if (EL[CODES[i]] && inFill(EL[CODES[i]], pt)) { inside = CODES[i]; break; }
      if (inside && TINY.indexOf(inside) >= 0) return inside;
      var best = null, bd = Infinity;
      TINY.forEach(function (c) {
        var a = anchor(c), d = Math.hypot(a[0] - pt.x, a[1] - pt.y), r = zoneR(c);
        if (inside) { var b = anchor(inside); r = Math.min(r, 0.5 * Math.hypot(a[0] - b[0], a[1] - b[1])); }
        if (d <= r && d < bd) { best = c; bd = d; }
      });
      return best || inside;
    }
    var ptrs = {}, gesture = null;
    function pd(e) {
      if (e.button != null && e.button > 0) return;
      try { svg.setPointerCapture(e.pointerId); } catch (er) {}
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY };
      var ids = Object.keys(ptrs);
      if (ids.length === 1) gesture = { kind: 'tap', view: view };
      else if (ids.length === 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]];
        gesture = { kind: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, view: view, mid: toMap((a.x + b.x) / 2, (a.y + b.y) / 2) };
      }
    }
    function pm(e) {
      var p = ptrs[e.pointerId]; if (!p || !gesture) return;
      p.x = e.clientX; p.y = e.clientY;
      var ids = Object.keys(ptrs);
      if (gesture.kind === 'pinch' && ids.length >= 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        var f = d / gesture.d0, v = gesture.view, w = v.w / f, h = w * FULL.h / FULL.w, m = gesture.mid;
        if (m) setView({ x: m.x - (m.x - v.x) * (w / v.w), y: m.y - (m.y - v.y) * (h / v.h), w: w, h: h });
        e.preventDefault(); return;
      }
      var moved = Math.hypot(p.x - p.x0, p.y - p.y0);
      if (gesture.kind === 'tap' && moved > 10 && view.w < FULL.w - 1) gesture.kind = 'pan';
      if (gesture.kind === 'pan') {
        var kk = k();
        setView({ x: gesture.view.x - (p.x - p.x0) / kk, y: gesture.view.y - (p.y - p.y0) / kk, w: gesture.view.w, h: gesture.view.h });
        e.preventDefault();
      }
    }
    function pu(e) {
      var p = ptrs[e.pointerId]; delete ptrs[e.pointerId];
      if (!p || !gesture) return;
      var g = gesture;
      if (!Object.keys(ptrs).length) gesture = null;
      if (g.kind === 'tap' && Math.hypot(p.x - p.x0, p.y - p.y0) <= 10) {
        kb = false;
        var pt = toMap(e.clientX, e.clientY);
        if (pt) tapCode(codeAt(pt));
      }
    }
    function pc(e) { delete ptrs[e.pointerId]; if (!Object.keys(ptrs).length) gesture = null; }
    function wheel(e) {
      if (!e.ctrlKey) return;   /* a plain wheel scrolls the page; a pinch on a trackpad arrives as ctrl+wheel */
      e.preventDefault();
      var pt = toMap(e.clientX, e.clientY);
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, pt && pt.x, pt && pt.y);
    }
    function click(e) {
      var b = e.target.closest && e.target.closest('[data-nk],[data-gm]');
      if (!b || !host.contains(b)) return;
      var a = b.getAttribute('data-nk') || b.getAttribute('data-gm');
      if (a === 'zin') zoomAt(1.5); else if (a === 'zout') zoomAt(1 / 1.5); else if (a === 'zreset') setView(FULL);
      else if (a === 'aage') aage();
    }

    /* ---------------------------------------------------------------- keyboard */
    function moveCursor(to) {
      kb = true;
      cursor = (to + ORDER.length) % ORDER.length;
      var a = anchor(ORDER[cursor]);
      if (a[0] < view.x || a[0] > view.x + view.w || a[1] < view.y || a[1] > view.y + view.h)
        setView({ x: a[0] - view.w / 2, y: a[1] - view.h / 2, w: view.w, h: view.h });
      overlay();
    }
    function vertical(dir) {
      if (cursor < 0) return moveCursor(0);
      var a = anchor(ORDER[cursor]), best = -1, bs = Infinity;
      ORDER.forEach(function (c, i) {
        if (i === cursor) return;
        var b = anchor(c), dy = (b[1] - a[1]) * dir, dx = Math.abs(b[0] - a[0]);
        if (dy <= 8) return;
        var s = dy + dx * 2;
        if (s < bs) { bs = s; best = i; }
      });
      if (best >= 0) moveCursor(best);
    }
    function key(e) {
      if (dead || !host.isConnected || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      var inHost = t && host.contains(t);
      if (t && t.tagName === 'BUTTON' && inHost && (e.key === 'Enter' || e.key === ' ')) {
        if (!t.hasAttribute('data-gm')) return;   /* a zoom button: its own click */
      }
      if (t && t !== D.body && !inHost && t.tagName !== 'HTML') {
        /* focus is on the app's own chrome (a tab, the menu): leave its keys alone */
        if (/^(A|BUTTON)$/.test(t.tagName)) return;
      }
      var kk = e.key;
      if (hold || (judged && timer)) {
        if (kk === 'Enter' || kk === ' ' || kk === 'ArrowRight') { e.preventDefault(); aage(); }
        return;
      }
      if (!items.length) { if (kk === 'Enter') { e.preventDefault(); aage(); } return; }
      if (kk === 'ArrowRight') { e.preventDefault(); moveCursor(cursor + 1); }
      else if (kk === 'ArrowLeft') { e.preventDefault(); moveCursor(cursor < 0 ? ORDER.length - 1 : cursor - 1); }
      else if (kk === 'ArrowDown') { e.preventDefault(); vertical(1); }
      else if (kk === 'ArrowUp') { e.preventDefault(); vertical(-1); }
      else if (kk === 'Enter' || kk === ' ') { if (cursor >= 0) { e.preventDefault(); kb = true; tapCode(ORDER[cursor]); } }
      else if (kk === '+' || kk === '=') { e.preventDefault(); zoomAt(1.5); }
      else if (kk === '-' || kk === '_') { e.preventDefault(); zoomAt(1 / 1.5); }
      else if (kk === '0') { e.preventDefault(); setView(FULL); }
      else if (/^[a-z]$/i.test(kk) && mode !== 'find') {
        /* a letter jumps to the next state of that name — not at L1, where it would spell the answer */
        var L = kk.toLowerCase();
        for (var s = 1; s <= ORDER.length; s++) {
          var i = (Math.max(cursor, -1) + s + ORDER.length) % ORDER.length;
          if (name(ORDER[i]).toLowerCase().charAt(0) === L) { e.preventDefault(); moveCursor(i); break; }
        }
      }
    }

    svg.addEventListener('pointerdown', pd);
    svg.addEventListener('pointermove', pm);
    svg.addEventListener('pointerup', pu);
    svg.addEventListener('pointercancel', pc);
    svg.addEventListener('wheel', wheel, { passive: false });
    host.addEventListener('click', click);
    D.addEventListener('keydown', key);
    D.addEventListener('visibilitychange', onVis);
    W.addEventListener('resize', fit);

    function teardown() {
      if (dead) return; dead = true;
      stopWait();
      D.removeEventListener('keydown', key);
      D.removeEventListener('visibilitychange', onVis);
      W.removeEventListener('resize', fit);
      host.removeEventListener('click', click);
      if (ro) ro.disconnect();
    }

    var ro = null;
    if (W.ResizeObserver && host.parentNode) {
      var pend = 0;
      ro = new W.ResizeObserver(function () { if (!pend) pend = W.requestAnimationFrame(function () { pend = 0; fit(); }); });
      ro.observe(host.parentNode);
    }
    fit();
    if (items.length) next();
    W.requestAnimationFrame(function () { fit(); });
    return teardown;
  }

  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push({
    id: 'naksha',
    name: 'Naksha',
    sub: 'find it on the map',
    blurb: 'Find India on the map with your own finger — states, capitals, clues, neighbours and rivers.',
    icon: 'map',
    minutes: 4,
    tag: 'Bhugol',
    teaches: true,
    levels: ['big states by name', 'capitals', 'clues', 'neighbours', 'rivers in order'],
    review: false,
    c: '#2f8f6b',
    c2: '#e9a13b',
    engine: naksha
  });
})();
