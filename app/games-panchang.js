/* Bizzing India — PLAY · Panchang (games spec §4.4, docs/32).

   Festivals are WHEN, and a calendar is something you turn. A twelve-month wheel, drawn here
   (never painted), and five levels:

     L1 Kab?       Put the festival card on its month — drag it, or tap the card's month, or
                   walk the wheel with the arrows and press Enter.
     L2 Mausam     The harvest and new-year festivals only (the ones whose own entry says
                   harvest or new year), and the teach shows the other names the same
                   season goes by in other homes — one harvest moment, many names.
     L3 Chaand     The moon's drift — Eid placed in two years side by side. NOT SCORED and
                   not playable yet: data-utsav.js holds month windows only, no dated year,
                   and a date is never typed here from memory. The level says so.
     L4 Kyon?      What many families do — a line from the festival's own entry — and the
                   child picks the festival it belongs to.
     L5 Mera saal  The child picks the festivals their family keeps. "Ask your family."
                   Never scored, never pays, never stored: a family's festivals say what it
                   believes, and that stays in the room.

   EVERY FACT IS data-utsav.js. A festival's window is its own `months[]`; a placement is right
   when it lands inside that window. A festival whose window is the whole year (Eid follows a
   purely lunar calendar) is not asked at L1 — any month would be "right". L1 asks only
   one- and two-month windows, at least half of them one-month, so a child tapping at random
   lands under 15% (P1; tools/check-panchang.js holds it).

   EDITORIAL (binding, docs/05): faiths from the inside; every festival card is the same size,
   the same colours and the same type, and the order is shuffled — no festival is first,
   biggest or brightest by default. Never "the biggest festival". "In many families…", and
   "ask your family". Entries the data flags needs_review appear only in tester mode.

   The game registers review: true — the year's windows and the Kyon? lines go to the named
   reviewer first (games spec §7), so it opens in tester mode only until signed.

   Contract (docs/32): engine(host, opts, done); opts.answer() once per item at the first
   attempt; the host plays right/wrong. A miss HOLDS with the miss card until Aage. */

(function () {
  'use strict';
  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document;

  var CSS = [
    '.pc{position:relative;display:grid;grid-template-columns:minmax(0,1fr);gap:10px;padding:10px;border-radius:var(--radius-lg,18px);',
    '  background:var(--ground);color:var(--text);font-family:var(--body);-webkit-tap-highlight-color:transparent}',
    '.pc-side{display:flex;flex-direction:column;gap:10px;min-width:0}',
    '.pc-ask,.pc-note{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-md,14px);padding:10px 14px;box-shadow:var(--shadow)}',
    '.pc-note{font-size:14px;line-height:1.45;color:var(--text2)}.pc-note b{color:var(--text)}',
    '.pc-kick{display:flex;justify-content:space-between;gap:8px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}',
    '.pc-q{margin:4px 0 0;font:700 20px/1.3 var(--display)}',
    '.pc-sub{margin:6px 0 0;font-size:15px;line-height:1.45;color:var(--text2)}',
    '.pc-pips{display:flex;gap:5px;margin-top:8px}.pc-pip{flex:1;height:6px;border-radius:3px;background:var(--line2)}',
    '.pc-pip.on{background:var(--accent)}.pc-pip.now{background:var(--accent2)}',
    '.pc-wheelbox{position:relative;width:min(100%,var(--pc-h,560px));aspect-ratio:1/1;margin:0 auto}',
    '.pc-wheel{display:block;width:100%;height:100%;touch-action:manipulation;user-select:none;-webkit-user-select:none;outline:none}',
    '.pc-wheel:focus-visible .pc-rim{stroke:var(--accent);stroke-width:4}',
    '.pc-rim{fill:var(--card);stroke:var(--line2);stroke-width:2}',
    '.pc-m{fill:var(--card2);stroke:var(--card);stroke-width:3;cursor:pointer}',
    '@media (hover:hover){.pc-m:hover{fill:var(--accent);fill-opacity:.16}}',
    '.pc-m.pc-focus{fill:var(--accent);fill-opacity:.28}',
    '.pc-m.pc-win{fill:var(--accent2);fill-opacity:.62}',
    '.pc-m.pc-no{fill:var(--mist);fill-opacity:1}',
    '.pc-ml{fill:var(--text);font:700 15px var(--body);text-anchor:middle;pointer-events:none}',
    '.pc-mk{fill:var(--text);font:800 13px var(--body);text-anchor:middle;pointer-events:none}',
    '.pc-hub{fill:var(--ground);stroke:var(--line2);stroke-width:2}',
    '.pc-dot{fill:var(--accent);pointer-events:none}',
    '.pc-card{position:absolute;left:50%;top:50%;width:52%;transform:translate(-50%,-50%);box-sizing:border-box;padding:10px 12px;border-radius:16px;',
    '  background:var(--card);border:1px solid var(--line2);box-shadow:var(--shadow);text-align:center;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;color:var(--text)}',
    '.pc-card:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.pc-card.pc-drag{opacity:.35}',
    '.pc-fname{display:block;font:800 19px/1.2 var(--display)}',
    '.pc-fscript{display:block;margin-top:2px;font-size:17px;color:var(--text2)}',
    '.pc-fwhere{display:block;margin-top:4px;font-size:12.5px;line-height:1.35;color:var(--muted)}',
    '.pc-ghost{position:fixed;z-index:80;pointer-events:none;transform:translate(-50%,-50%);padding:8px 12px;border-radius:14px;background:var(--card);',
    '  border:2px solid var(--accent);box-shadow:var(--shadow-lg,var(--shadow));font:800 16px var(--display);color:var(--text)}',
    '.pc-hubtext{position:absolute;left:50%;top:50%;width:50%;transform:translate(-50%,-50%);text-align:center;font-size:14px;line-height:1.4;color:var(--text2)}',
    '.pc-hubtext b{display:block;font:800 18px/1.2 var(--display);color:var(--text);margin-bottom:4px}',
    '.pc-fb:empty{display:none}',
    '.pc-fb>div{background:var(--card);border:1px solid var(--line2);border-radius:var(--radius-md,14px);padding:10px 14px;box-shadow:var(--shadow-lg,var(--shadow))}',
    '.pc-fb .gm-miss{border-left:5px solid var(--mist)}.pc-fb .pc-yes{border-left:5px solid var(--accent2)}',
    '.pc-fb b{font-family:var(--display);font-size:18px}.pc-fb .gm-ans{font-size:16px}',
    '.pc-fb .gm-teach{margin:6px 0 8px;font-size:15px;line-height:1.45;color:var(--text2)}',
    '.pc-fb .gm-aage{min-height:44px;min-width:120px;font-size:16px}',
    /* Kyon? — four festival cards, identical in every way but their words */
    '.pc-quote{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-md,14px);padding:14px 16px;font-size:18px;line-height:1.5;box-shadow:var(--shadow)}',
    '.pc-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}',
    '.pc-opt{min-height:72px;padding:10px;border-radius:14px;border:2px solid var(--line2);background:var(--card);color:var(--text);cursor:pointer;',
    '  font:800 17px/1.25 var(--display);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}',
    '.pc-opt small{font:500 15px/1.3 var(--body);color:var(--text2)}',
    '.pc-opt:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.pc-opt .pc-num{font:700 12px var(--body);color:var(--muted)}',
    '.pc-opt.pc-win{background:var(--accent2);background:rgba(233,161,59,.35);border-color:var(--accent2)}',
    '.pc-opt.pc-no{background:var(--mist);border-color:var(--mist)}',
    /* Mera saal — every festival a chip of one size */
    '.pc-pick{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-md,14px);padding:10px;box-shadow:var(--shadow)}',
    '.pc-chips{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));grid-auto-rows:56px;gap:8px;max-height:var(--pc-chips,320px);overflow:auto;padding:2px}',
    '.pc-chip{height:56px;padding:4px 10px;border-radius:12px;border:2px solid var(--line2);background:var(--card);color:var(--text);cursor:pointer;font:700 14.5px/1.2 var(--body);text-align:left;overflow:hidden}',
    '.pc-chip[aria-pressed="true"]{border-color:var(--accent);background:var(--accent-soft)}',
    '.pc-chip:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.pc-done{min-height:48px;width:100%;margin-top:8px;font-size:16px}',
    '.pc-year{margin:6px 0 0;padding:0;list-style:none;font-size:14px;line-height:1.45}',
    '@media (min-width:900px){',
    '  .pc{grid-template-columns:minmax(220px,1fr) var(--pc-w,520px) minmax(220px,1fr);align-items:start;padding:16px;gap:16px}',
    '  .pc-left{grid-column:1;grid-row:1}.pc-mid{grid-column:2;grid-row:1}.pc-right{grid-column:3;grid-row:1}',
    '  .pc-wheelbox{width:100%}',
    '  .pc-q{font-size:24px}',
    '}',
    '@media (max-width:899px){',
    '  .pc{padding:6px;gap:6px}.pc-ask{padding:8px 12px}.pc-q{font-size:18px}',
    '  .pc-right>.pc-note{display:none}',
    '  .pc-fb>div{padding:8px 12px}.pc-fb b{font-size:16px}.pc-fb .gm-ans{font-size:15px}.pc-fb .gm-teach{font-size:14px;margin:4px 0 6px;line-height:1.4}',
    '  .pc-opt{min-height:56px;font-size:16px}.pc-quote{font-size:16px;padding:10px 12px}.pc-opts{gap:8px;margin-top:8px}',
    '  .pc-card{width:56%;padding:8px}.pc-fname{font-size:17px}.pc-fwhere{font-size:12px}',
    '  .pc-ml{font-size:17px}',
    '}',
    '@media (prefers-reduced-motion:no-preference){.pc-fb>div{animation:pcin .18s ease-out}}',
    '@keyframes pcin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}'
  ].join('\n');

  function injectCSS() {
    if (!D || D.getElementById('pc-css')) return;
    var s = D.createElement('style'); s.id = 'pc-css'; s.textContent = CSS; D.head.appendChild(s);
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

  /* the Gregorian months, from the platform rather than typed */
  var MONTHS = (function () {
    var out = [];
    for (var i = 0; i < 12; i++) {
      var d = new Date(2001, i, 15), L, S;
      try { L = d.toLocaleString('en-GB', { month: 'long' }); S = d.toLocaleString('en-GB', { month: 'short' }); } catch (e) { L = S = String(i + 1); }
      out.push({ long: L, short: S.replace(/\.$/, '').slice(0, 4) });
    }
    return out;
  })();
  function monthIdx(name) {
    for (var i = 0; i < 12; i++) if (MONTHS[i].long.toLowerCase() === String(name).toLowerCase()) return i;
    return -1;
  }
  function windowOf(f) {
    var w = [];
    (f.months || []).forEach(function (m) { var i = monthIdx(m); if (i >= 0 && w.indexOf(i) < 0) w.push(i); });
    return w.sort(function (a, b) { return a - b; });
  }
  function windowText(w) {
    var n = w.map(function (i) { return MONTHS[i].long; });
    if (w.length === 12) return 'any month of the year';
    return n.length < 2 ? n.join('') : n.slice(0, -1).join(', ') + ' or ' + n[n.length - 1];
  }

  /* a festival's own script, in its own face — and romanised where the app has no face */
  function scriptHTML(f) {
    if (!f.script) return '';
    var parts = String(f.script).split(/\s*·\s*/), out = [];
    parts.forEach(function (p) {
      var lang = langOf(p, f);
      if (lang) out.push('<span lang="' + lang + '">' + esc(p) + '</span>');
    });
    return out.join(' · ');
  }
  function langOf(s, f) {
    var c = s.charCodeAt(0), st = f.states || [];
    if (c >= 0x0900 && c <= 0x097F) return st[0] === 'MH' || (st.indexOf('MH') >= 0 && /·/.test(f.script)) ? 'mr' : 'hi';
    if (c >= 0x0980 && c <= 0x09FF) return st[0] === 'AS' ? 'as' : 'bn';
    if (c >= 0x0A00 && c <= 0x0A7F) return 'pa';
    if (c >= 0x0A80 && c <= 0x0AFF) return 'gu';
    if (c >= 0x0B00 && c <= 0x0B7F) return 'or';
    if (c >= 0x0B80 && c <= 0x0BFF) return 'ta';
    if (c >= 0x0C00 && c <= 0x0C7F) return 'te';
    if (c >= 0x0C80 && c <= 0x0CFF) return 'kn';
    if (c >= 0x0D00 && c <= 0x0D7F) return 'ml';
    if (c >= 0x0600 && c <= 0x06FF) return 'ur';
    return null;   /* Tibetan and anything else the app has no face for: the roman name stands */
  }
  function whereText(f) {
    var G = (W.IND_GEO && W.IND_GEO.states) || {};
    var n = (f.states || []).map(function (c) { return G[c] && G[c].name; }).filter(Boolean);
    if (!n.length) return '';
    return 'Kept in ' + (n.length > 3 ? n.slice(0, 3).join(', ') + ' and more' : n.length > 1 ? n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1] : n[0]);
  }

  var MODES = ['kab', 'mausam', 'chaand', 'kyon', 'mera'];
  var MODE_ALIAS = { kab: 'kab', when: 'kab', mausam: 'mausam', season: 'mausam', harvest: 'mausam', chaand: 'chaand', moon: 'chaand',
    kyon: 'kyon', why: 'kyon', mera: 'mera', 'mera saal': 'mera', mine: 'mera', my: 'mera' };
  var MODE_NAME = { kab: 'Kab? · when', mausam: 'Mausam · the season', chaand: 'Chaand · the moon', kyon: 'Kyon? · why', mera: 'Mera saal · my year' };
  var PRACTISE = {
    kab: 'The shape of the year — which months each festival can fall in.',
    mausam: 'The harvest and new-year festivals, and how one season has many names across India.',
    chaand: 'Which festivals follow the moon, and why their dates walk through the year.',
    kyon: 'What families do for each festival — from the festival’s own tradition.',
    mera: 'Your own family’s year. Nothing here is marked: ask your family.'
  };
  var HARVEST = /harvest|new year|new-year|year begins|first day of the year/i;

  function panchang(host, opts, done) {
    opts = opts || {};
    injectCSS();
    var U = W.IND_UTSAV;
    var dead = false, finished = false;
    function finish(res) { if (finished) return; finished = true; teardown(); done(res); }
    var tester = !!opts.tester;
    try { tester = tester || /[?&]tester=1\b/.test(W.location.search) || !!(W.IND_STORE && W.IND_STORE.loadDevice && W.IND_STORE.loadDevice('tester', false) === true); } catch (e) {}

    var level = Math.max(1, Math.min(5, parseInt(opts.level, 10) || 1));
    var scope = opts.scope && (opts.scope.mode || opts.scope.set) ? opts.scope : null;
    var mode = scope && MODE_ALIAS[String(scope.mode || '').toLowerCase()] || MODES[level - 1];
    if (scope && typeof scope.mode === 'number') mode = MODES[Math.max(1, Math.min(5, scope.mode)) - 1];
    var only = scope && scope.set && scope.set.length ? scope.set : null;

    /* every festival the game may show: a window from data, reviewed or in tester mode */
    var FEST = ((U && U.festivals) || []).filter(function (f) {
      return f && f.id && f.name && windowOf(f).length && (!f.needs_review || tester) && (!only || only.indexOf(f.id) >= 0);
    });
    var BY = {}; FEST.forEach(function (f) { BY[f.id] = f; });

    function leaksName(text, f) {
      var t = String(text || '').toLowerCase(), words = [];
      String(f.name + ' ' + (f.roman || '') + ' ' + f.id.replace(/-/g, ' ')).split(/[^A-Za-zĀ-ſḀ-ỿ]+/).forEach(function (w) {
        if (w.length >= 4 && !/^(india|purab|jayanti|puja|guru|maha|singh|gobind|chaturthi|purnima|yatra)$/i.test(w)) words.push(w.toLowerCase());
      });
      if (f.script && text && String(text).indexOf(f.script) >= 0) return true;
      return words.some(function (w) { return t.indexOf(w) >= 0; });
    }

    /* ------------------------------------------------------------------ rounds */
    var items = [];
    if (mode === 'kab') {
      var singles = shuffle(FEST.filter(function (f) { return windowOf(f).length === 1; }));
      var doubles = shuffle(FEST.filter(function (f) { return windowOf(f).length === 2; }));
      var s = Math.min(singles.length, 5), pick = singles.slice(0, s).concat(doubles.slice(0, 10 - s));
      if (pick.length < 10) pick = pick.concat(singles.slice(s, s + 10 - pick.length));
      /* hold the round to the P1 line: the windows' total may be at most 1.6 a card */
      var tot = function (a) { return a.reduce(function (n, f) { return n + windowOf(f).length; }, 0); };
      while (pick.length > 1 && tot(pick) > 1.6 * pick.length) {
        var di = -1; for (var q = pick.length - 1; q >= 0; q--) if (windowOf(pick[q]).length > 1) { di = q; break; }
        if (di < 0) break; pick.splice(di, 1);
      }
      items = shuffle(pick).map(function (f) { return wheelItem(f, 'panchang.when'); });
    } else if (mode === 'mausam') {
      var hv = FEST.filter(function (f) { var w = windowOf(f).length; return w >= 1 && w <= 3 && HARVEST.test((f.kid || '') + ' ' + (f.big || '')); });
      items = shuffle(hv).slice(0, 10).map(function (f) {
        var it = wheelItem(f, 'panchang.season'), w = windowOf(f);
        var sib = hv.filter(function (g) { return g !== f && windowOf(g).some(function (m) { return w.indexOf(m) >= 0; }); });
        it.extra = sib.length ? 'One season, many names: in the same months other homes keep ' +
          listOf(sib.slice(0, 4).map(function (g) { return g.name; })) + '.' : '';
        return it;
      });
    } else if (mode === 'kyon') {
      var ky = FEST.map(function (f) {
        var line = firstSentence(f.kid);
        if (line.length < 40 && f.kid) { var two = /^(.+?[.!?]\s+.+?[.!?])(\s|$)/.exec(String(f.kid).trim()); if (two) line = two[1]; }
        return { f: f, line: line };
      }).filter(function (x) { return x.line && !leaksName(x.line, x.f); });
      items = shuffle(ky).slice(0, 10).map(function (x) {
        var others = shuffle(ky.filter(function (y) { return y.f !== x.f; })).slice(0, 3).map(function (y) { return y.f; });
        return { id: 'why:' + x.f.id, f: x.f, skill: 'panchang.why', line: x.line, options: shuffle([x.f].concat(others)) };
      });
    }
    function wheelItem(f, skill) { return { id: (skill === 'panchang.when' ? 'when:' : 'season:') + f.id, f: f, win: windowOf(f), skill: skill }; }
    function listOf(n) { return n.length < 2 ? n.join('') : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1]; }

    /* ------------------------------------------------------------------ the wheel */
    var CX = 200, CY = 200, R1 = 196, R0 = 120;
    function pt(r, a) { return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; }
    function sectorD(i) {
      var a0 = (-105 + 30 * i) * Math.PI / 180, a1 = a0 + Math.PI / 6;
      var p1 = pt(R1, a0), p2 = pt(R1, a1), p3 = pt(R0, a1), p4 = pt(R0, a0);
      return 'M' + p1[0].toFixed(2) + ',' + p1[1].toFixed(2) + ' A' + R1 + ',' + R1 + ' 0 0 1 ' + p2[0].toFixed(2) + ',' + p2[1].toFixed(2) +
        ' L' + p3[0].toFixed(2) + ',' + p3[1].toFixed(2) + ' A' + R0 + ',' + R0 + ' 0 0 0 ' + p4[0].toFixed(2) + ',' + p4[1].toFixed(2) + ' Z';
    }
    function wheelSVG() {
      var s = '<svg class="pc-wheel" viewBox="0 0 400 400" tabindex="0" role="application" aria-label="A twelve-month wheel, January at the top. Arrow keys turn to a month, Enter places the card.">' +
        '<circle class="pc-rim" cx="200" cy="200" r="199"/>';
      for (var i = 0; i < 12; i++) {
        var lp = pt((R0 + R1) / 2, (-90 + 30 * i) * Math.PI / 180);
        s += '<path class="pc-m" data-m="' + i + '" d="' + sectorD(i) + '"><title>' + esc(MONTHS[i].long) + '</title></path>' +
          '<text class="pc-ml" x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + 5).toFixed(1) + '">' + esc(MONTHS[i].short) + '</text>' +
          '<text class="pc-mk" data-mk="' + i + '" x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + 22).toFixed(1) + '"></text>' +
          '<g class="pc-dots" data-dots="' + i + '"></g>';
      }
      return s + '<circle class="pc-hub" cx="200" cy="200" r="' + (R0 - 4) + '"/></svg>';
    }
    function cardHTML(f) {
      var sc = scriptHTML(f), wh = whereText(f);
      return '<span class="pc-fname">' + esc(f.name) + '</span>' + (sc ? '<span class="pc-fscript">' + sc + '</span>' : '') +
        (wh ? '<span class="pc-fwhere">' + esc(wh) + '</span>' : '');
    }

    /* ------------------------------------------------------------------ the stage */
    var center = '';
    if (mode === 'kab' || mode === 'mausam') {
      center = '<div class="pc-wheelbox">' + wheelSVG() + '<div class="pc-card" tabindex="-1" aria-live="polite"></div></div>';
    } else if (mode === 'chaand') {
      center = '<div class="pc-wheelbox">' + wheelSVG() + '<div class="pc-hubtext"><b>Coming</b>once the year’s dates are checked</div></div>';
    } else if (mode === 'kyon') {
      center = '<div class="pc-kyon"><div class="pc-quote" aria-live="polite"></div><div class="pc-opts" role="group" aria-label="Which festival?"></div></div>';
    } else {
      center = '<div class="pc-wheelbox">' + wheelSVG() + '<div class="pc-hubtext"><b class="pc-yn">0</b>festivals in your year</div></div>';
    }
    host.innerHTML =
      '<div class="pc" data-level="' + level + '" data-mode="' + mode + '">' +
        '<div class="pc-side pc-left"><div class="pc-ask" aria-live="polite"><div class="pc-kick"><span>' + esc(MODE_NAME[mode]) + '</span><span class="pc-count"></span></div>' +
          '<p class="pc-q"></p><p class="pc-sub" hidden></p><div class="pc-pips" aria-hidden="true"></div></div></div>' +
        '<div class="pc-mid">' + center + '</div>' +
        '<div class="pc-side pc-right"><div class="pc-note"><b>What you are practising:</b> ' + esc(PRACTISE[mode]) + '</div>' +
          '<div class="pc-fb" aria-live="assertive"></div></div>' +
      '</div>';
    var root = host.querySelector('.pc'), qEl = host.querySelector('.pc-q'), subEl = host.querySelector('.pc-sub');
    var pipsEl = host.querySelector('.pc-pips'), countEl = host.querySelector('.pc-count'), fb = host.querySelector('.pc-fb');
    var wheel = host.querySelector('.pc-wheel'), card = host.querySelector('.pc-card'), box = host.querySelector('.pc-wheelbox');
    var SEC = host.querySelectorAll('.pc-m');

    /* The stage fits the screen it is on: on a desk the wheel takes the height below the frame;
       on a phone the stage sits under the sticky header with room kept for the miss card, so
       Aage is never under the tab bar (games spec §1.6, T18). */
    var scrolled = false;
    function edges() {
      var bar = D.querySelector('[data-bz=tabbar]'), hdr = D.querySelector('[data-bz=header]');
      var barTop = W.innerHeight, hb = 0;
      if (bar && getComputedStyle(bar).display !== 'none') { var r = bar.getBoundingClientRect(); if (r.height) barTop = r.top; }
      if (hdr) hb = Math.max(0, hdr.getBoundingClientRect().bottom);
      return { bar: barTop, hdr: hb };
    }
    function fit() {
      if (dead || !root.isConnected) return;
      var wide = W.innerWidth >= 900, e = edges(), ask = host.querySelector('.pc-ask'), askH = ask.getBoundingClientRect().height;
      var chips = host.querySelector('.pc-chips'), w;
      if (wide) {
        var topDoc = root.getBoundingClientRect().top + (W.scrollY || 0);
        var h = Math.max(400, Math.min(620, W.innerHeight - topDoc - 40));
        w = Math.min(mode === 'kyon' ? 560 : h, root.clientWidth - 2 * 220 - 64);
        root.style.setProperty('--pc-w', Math.round(w) + 'px');
        if (chips) root.style.setProperty('--pc-chips', Math.max(160, W.innerHeight - (chips.getBoundingClientRect().top + (W.scrollY || 0)) - 90 + 0) + 'px');
      } else {
        var reserve = (mode === 'kab' || mode === 'mausam') ? 150 : 0;
        w = Math.min(W.innerWidth - 24, e.bar - e.hdr - askH - reserve - 32);
        if (chips) root.style.setProperty('--pc-chips', Math.max(150, e.bar - e.hdr - askH - 80 - 40) + 'px');
      }
      root.style.setProperty('--pc-h', Math.max(220, Math.round(w)) + 'px');
      if (!wide && !scrolled) {
        scrolled = true;
        var rr = root.getBoundingClientRect();
        if (rr.bottom > e.bar || rr.top < e.hdr) W.scrollBy(0, rr.top - e.hdr - 6);
      }
    }

    /* on a phone the card below the wheel is scrolled up to sit above the tab bar */
    function reveal() {
      if (dead || W.innerWidth >= 900) return;
      var e = edges(), r = fb.getBoundingClientRect();
      if (r.height && r.bottom > e.bar - 6) W.scrollBy(0, r.bottom - (e.bar - 6));
    }

    /* ------------------------------------------------------------------ play */
    var idx = -1, it = null, judged = false, hold = false, asked = 0, firstRight = 0, focusM = -1, kb = false;
    function pips() {
      var h = '';
      for (var i = 0; i < items.length; i++) h += '<i class="pc-pip' + (i < idx ? ' on' : i === idx ? ' now' : '') + '"></i>';
      pipsEl.innerHTML = h; countEl.textContent = items.length ? (idx + 1) + ' of ' + items.length : '';
    }
    function clearWheel() {
      Array.prototype.forEach.call(SEC, function (e) { e.classList.remove('pc-win', 'pc-no', 'pc-focus'); });
      Array.prototype.forEach.call(host.querySelectorAll('.pc-mk'), function (e) { e.textContent = ''; });
    }
    function next() {
      stopWait();
      if (dead) return;
      idx++;
      if (idx >= items.length) {
        var pct = asked ? firstRight / asked : 0;
        finish({ win: asked > 0 && pct >= 0.5, score: firstRight, asked: asked, firstTryRight: firstRight, level: level,
          levelNext: asked ? (pct < 0.5 ? Math.max(1, level - 1) : pct >= 0.8 ? Math.min(5, level + 1) : level) : level });
        return;
      }
      it = items[idx]; judged = false; hold = false; fb.innerHTML = '';
      pips();
      if (mode === 'kyon') {
        qEl.textContent = 'Which festival is this?';
        subEl.hidden = false; subEl.textContent = 'In many families…';
        host.querySelector('.pc-quote').textContent = it.line;
        host.querySelector('.pc-opts').innerHTML = it.options.map(function (f, i) {
          return '<button type="button" class="pc-opt" data-pc="opt" data-id="' + esc(f.id) + '"><span class="pc-num">' + (i + 1) + '</span>' +
            esc(f.name) + '</button>';
        }).join('');
        return;
      }
      clearWheel(); focusM = -1;
      qEl.textContent = mode === 'mausam' ? 'A harvest or new-year festival. Which month does it come in?' : 'Which month does it come in?';
      subEl.hidden = false;
      subEl.textContent = 'Drag the card to its month, or tap the month.';
      card.innerHTML = cardHTML(it.f);
      card.setAttribute('aria-label', it.f.name + '. Choose its month.');
    }
    function report(right) {
      asked++; if (right) firstRight++;
      if (typeof opts.answer === 'function') { try { opts.answer({ id: it.id, right: right, firstTry: true, skill: it.skill, objective: null }); } catch (e) {} }
    }
    function teachOf(f) { return firstSentence(f.kid); }
    function place(m) {
      if (dead || !it || judged || hold || m < 0 || m > 11 || !it.win) return;
      judged = true;
      var right = it.win.indexOf(m) >= 0;
      report(right);
      it.win.forEach(function (i) { SEC[i].classList.add('pc-win'); });
      Array.prototype.forEach.call(SEC, function (e) { e.classList.remove('pc-focus'); });
      var mk = host.querySelector('[data-mk="' + m + '"]');
      if (right) {
        if (mk) mk.textContent = '✓';
        fb.innerHTML = '<div class="pc-yes" role="status"><span class="gm-ans"><b>' + esc(it.f.name) + '</b> falls in ' + esc(windowText(it.win)) + '.</span>' +
          '<p class="gm-teach">' + esc(it.extra || teachOf(it.f)) + '</p>' +
          '<button type="button" class="btn gm-aage" data-gm="aage">Aage →</button></div>';
        reveal(); wait(2200);
      } else {
        hold = true;
        SEC[m].classList.add('pc-no'); if (mk) mk.textContent = '✕';
        fb.innerHTML = '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">' + esc(it.f.name) + ' falls in <b>' + esc(windowText(it.win)) + '</b>, not ' + esc(MONTHS[m].long) + '.</span>' +
          '<p class="gm-teach">' + esc(it.extra || teachOf(it.f)) + '</p>' +
          '<button type="button" class="btn gm-aage" data-gm="aage">Aage →</button></div>';
        reveal();
        var b = fb.querySelector('.gm-aage'); if (b && kb) try { b.focus({ preventScroll: true }); } catch (e) {}
      }
    }
    function choose(id) {
      if (dead || !it || judged || hold || mode !== 'kyon') return;
      judged = true;
      var right = id === it.f.id;
      report(right);
      Array.prototype.forEach.call(host.querySelectorAll('.pc-opt'), function (b) {
        var bid = b.getAttribute('data-id');
        if (bid === it.f.id) b.classList.add('pc-win');
        else if (bid === id) b.classList.add('pc-no');
        b.setAttribute('aria-disabled', 'true');
      });
      var teach = it.f.name + ' falls in ' + windowText(windowOf(it.f)) + '. ' + (it.f.ask || '');
      if (right) {
        fb.innerHTML = '<div class="pc-yes" role="status"><span class="gm-ans">Yes — many families do this for <b>' + esc(it.f.name) + '</b>.</span>' +
          '<p class="gm-teach">' + esc(teach) + '</p><button type="button" class="btn gm-aage" data-gm="aage">Aage →</button></div>';
        reveal(); wait(2400);
      } else {
        hold = true;
        fb.innerHTML = '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">That is what many families do for <b>' + esc(it.f.name) + '</b>.</span>' +
          '<p class="gm-teach">' + esc(teach) + '</p><button type="button" class="btn gm-aage" data-gm="aage">Aage →</button></div>';
        reveal();
        var b = fb.querySelector('.gm-aage'); if (b && kb) try { b.focus({ preventScroll: true }); } catch (e) {}
      }
    }
    function aage() {
      if (dead) return;
      if (mode === 'chaand') { finish({ win: false, score: 0, asked: 0, firstTryRight: 0, level: level, levelNext: level, unscored: true }); return; }
      if (mode === 'mera') { finish({ win: false, score: 0, asked: 0, firstTryRight: 0, level: level, levelNext: level, unscored: true }); return; }
      if (!items.length) { finish({ win: false, score: 0, asked: 0, firstTryRight: 0, level: level, levelNext: level }); return; }
      if (hold || judged) next();
    }

    /* the beat after a right answer: rAF with delta time, stopped while hidden */
    var timer = null, raf = 0, last = 0;
    function wait(ms) { timer = { left: ms }; last = 0; raf = W.requestAnimationFrame(tick); }
    function stopWait() { timer = null; if (raf) W.cancelAnimationFrame(raf); raf = 0; }
    function tick(t) {
      raf = 0;
      if (!timer || dead) return;
      if (D.hidden) { last = 0; raf = W.requestAnimationFrame(tick); return; }
      if (last) timer.left -= Math.min(100, t - last);
      last = t;
      if (timer.left <= 0) { next(); return; }
      raf = W.requestAnimationFrame(tick);
    }
    function onVis() { last = 0; }

    /* ------------------------------------------------------------ drag, tap, keys */
    function monthAt(cx, cy) {
      if (!wheel) return -1;
      var r = wheel.getBoundingClientRect(), s = r.width / 400;
      var x = (cx - r.left) / s - CX, y = (cy - r.top) / s - CY, d = Math.hypot(x, y);
      if (d < R0 * 0.92 || d > R1 + 40) return -1;
      var a = Math.atan2(y, x) * 180 / Math.PI + 90 + 15;
      return ((Math.floor(((a % 360) + 360) % 360 / 30)) % 12);
    }
    var drag = null;
    function cardDown(e) {
      if (judged || hold || !it || (e.button != null && e.button > 0)) return;
      e.preventDefault();
      try { card.setPointerCapture(e.pointerId); } catch (er) {}
      drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, ghost: null };
    }
    function cardMove(e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.ghost && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 8) {
        drag.ghost = D.createElement('div'); drag.ghost.className = 'pc-ghost'; drag.ghost.textContent = it.f.name;
        D.body.appendChild(drag.ghost); card.classList.add('pc-drag');
      }
      if (drag.ghost) {
        drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px';
        var m = monthAt(e.clientX, e.clientY);
        Array.prototype.forEach.call(SEC, function (s, i) { s.classList.toggle('pc-focus', i === m); });
      }
    }
    function cardUp(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var g = drag.ghost; drag = null;
      card.classList.remove('pc-drag');
      if (g) { g.remove(); var m = monthAt(e.clientX, e.clientY); kb = false; if (m >= 0) place(m); else Array.prototype.forEach.call(SEC, function (s) { s.classList.remove('pc-focus'); }); }
    }
    function cardCancel() { if (drag && drag.ghost) drag.ghost.remove(); drag = null; if (card) card.classList.remove('pc-drag'); }
    function click(e) {
      var t = e.target.closest ? e.target.closest('[data-gm],[data-pc],.pc-m') : null;
      if (!t || !host.contains(t)) return;
      if (t.hasAttribute('data-gm')) { aage(); return; }
      var a = t.getAttribute('data-pc');
      if (t.classList.contains('pc-m')) {
        var m = parseInt(t.getAttribute('data-m'), 10);
        kb = e.detail === 0;
        if (mode === 'kab' || mode === 'mausam') place(m);
        else if (mode === 'mera') showMonth(m);
        return;
      }
      if (a === 'opt') { kb = e.detail === 0; choose(t.getAttribute('data-id')); }
      else if (a === 'chip') toggleChip(t);
      else if (a === 'done') aage();
    }
    function moveFocus(to) {
      kb = true;
      focusM = ((to % 12) + 12) % 12;
      Array.prototype.forEach.call(SEC, function (s, i) { s.classList.toggle('pc-focus', i === focusM); });
      subEl.hidden = false; subEl.textContent = 'On the wheel: ' + MONTHS[focusM].long + '. Press Enter to place it there.';
    }
    function key(e) {
      if (dead || !host.isConnected || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      var inHost = t && host.contains(t);
      if (t && !inHost && t !== D.body && t.tagName !== 'HTML' && /^(A|BUTTON)$/.test(t.tagName)) return;
      var k = e.key;
      if (hold || (judged && timer)) {
        if (k === 'Enter' || k === ' ' || (k === 'ArrowRight' && mode !== 'kyon')) { e.preventDefault(); aage(); }
        return;
      }
      if (mode === 'chaand') { if (k === 'Enter') { e.preventDefault(); aage(); } return; }
      if (mode === 'mera') return;   /* chips and Done are buttons: Tab and Enter work natively */
      if (mode === 'kyon') {
        if (/^[1-4]$/.test(k)) { var o = host.querySelectorAll('.pc-opt')[+k - 1]; if (o) { e.preventDefault(); kb = true; choose(o.getAttribute('data-id')); } return; }
        var opts2 = host.querySelectorAll('.pc-opt'), cur = Array.prototype.indexOf.call(opts2, D.activeElement);
        if (/^Arrow/.test(k)) {
          e.preventDefault();
          var step = k === 'ArrowRight' ? 1 : k === 'ArrowLeft' ? -1 : k === 'ArrowDown' ? 2 : -2;
          var nx = cur < 0 ? 0 : Math.max(0, Math.min(opts2.length - 1, cur + step));
          if (opts2[nx]) opts2[nx].focus();
        }
        return;   /* Enter on a focused option is its own click */
      }
      if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); moveFocus(focusM < 0 ? 0 : focusM + 1); }
      else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); moveFocus(focusM < 0 ? 11 : focusM - 1); }
      else if ((k === 'Enter' || k === ' ') && focusM >= 0 && !(t && t.tagName === 'BUTTON' && inHost)) { e.preventDefault(); kb = true; place(focusM); }
    }

    /* ------------------------------------------------------------ Mera saal */
    var mine = {};
    function toggleChip(b) {
      var id = b.getAttribute('data-id');
      if (mine[id]) delete mine[id]; else mine[id] = true;
      b.setAttribute('aria-pressed', mine[id] ? 'true' : 'false');
      if (W.IND_SFX) W.IND_SFX.play('tap');
      drawMine();
    }
    function drawMine() {
      var per = []; for (var i = 0; i < 12; i++) per.push([]);
      Object.keys(mine).forEach(function (id) { var f = BY[id]; if (f) windowOf(f).forEach(function (m) { per[m].push(f); }); });
      for (var m = 0; m < 12; m++) {
        var g = host.querySelector('[data-dots="' + m + '"]'), n = Math.min(per[m].length, 6), s = '';
        var a = (-90 + 30 * m) * Math.PI / 180;
        for (var j = 0; j < n; j++) { var p = pt(R0 + 12, a + (j - (n - 1) / 2) * 0.07); s += '<circle class="pc-dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4"/>'; }
        if (g) g.innerHTML = s;
        SEC[m].classList.toggle('pc-win', per[m].length > 0);
      }
      var yn = host.querySelector('.pc-yn'); if (yn) yn.textContent = String(Object.keys(mine).length);
      var yr = host.querySelector('.pc-year');
      if (yr) yr.innerHTML = per.map(function (fs, i) {
        return fs.length ? '<li><b>' + esc(MONTHS[i].long) + ':</b> ' + esc(fs.map(function (f) { return f.name; }).join(', ')) + '</li>' : '';
      }).join('') || '<li>Tap the festivals your family keeps.</li>';
    }
    function showMonth(m) {
      var fs = Object.keys(mine).map(function (id) { return BY[id]; }).filter(function (f) { return f && windowOf(f).indexOf(m) >= 0; });
      subEl.hidden = false;
      subEl.textContent = MONTHS[m].long + (fs.length ? ': ' + fs.map(function (f) { return f.name; }).join(', ') : ': nothing picked for this month yet.');
    }

    /* ------------------------------------------------------------ set the stage */
    if (mode === 'chaand') {
      var note = (U && U.calendarNote) || {}, eidLine = '';
      String(note.text || '').split(/(?<=[.!?])\s+/).forEach(function (s2) { if (/\bEid\b/.test(s2) && !eidLine) eidLine = s2; });
      qEl.textContent = 'Which festivals follow the moon?';
      subEl.hidden = false;
      subEl.textContent = 'This level puts Eid on the wheel in two years side by side, so you can watch it walk. It opens once the year’s dates are checked — this app never types a festival date from memory.';
      fb.innerHTML = '<div class="pc-yes" role="status"><span class="gm-ans"><b>Coming soon.</b></span>' +
        (eidLine ? '<p class="gm-teach">' + esc(eidLine) + '</p>' : '') +
        (note.childLine ? '<p class="gm-teach">' + esc(note.childLine) + '</p>' : '') +
        '<button type="button" class="btn gm-aage" data-gm="aage">Aage →</button></div>';
      hold = true;
    } else if (mode === 'mera') {
      qEl.textContent = 'Which festivals does your family keep?';
      subEl.hidden = false;
      subEl.textContent = 'Tap every one your year holds. Not sure? Ask your family — every home keeps its own year.';
      var right = host.querySelector('.pc-right');
      right.insertAdjacentHTML('afterbegin', '<div class="pc-note"><b>Our year</b><ul class="pc-year"></ul></div>');
      host.querySelector('.pc-left').insertAdjacentHTML('beforeend',
        '<div class="pc-pick"><div class="pc-chips" role="group" aria-label="Festivals">' + shuffle(FEST).map(function (f) {
          return '<button type="button" class="pc-chip" data-pc="chip" data-id="' + esc(f.id) + '" aria-pressed="false">' + esc(f.name) + '</button>';
        }).join('') + '</div><button type="button" class="btn pc-done" data-pc="done">This is our year</button></div>');
      drawMine();
    } else if (!items.length) {
      qEl.textContent = 'Nothing to ask here yet.';
      fb.innerHTML = '<div class="pc-yes"><p class="gm-teach">The festival data has not loaded.</p><button type="button" class="btn gm-aage" data-gm="aage">Aage →</button></div>';
      hold = true;
    }

    if (card) {
      card.addEventListener('pointerdown', cardDown);
      card.addEventListener('pointermove', cardMove);
      card.addEventListener('pointerup', cardUp);
      card.addEventListener('pointercancel', cardCancel);
    }
    host.addEventListener('click', click);
    D.addEventListener('keydown', key);
    D.addEventListener('visibilitychange', onVis);
    W.addEventListener('resize', fit);
    function teardown() {
      if (dead) return; dead = true;
      stopWait(); cardCancel();
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
    if (items.length) next(); else pips();
    fit();
    W.requestAnimationFrame(fit);
    return teardown;
  }

  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push({
    id: 'panchang',
    name: 'Panchang',
    sub: 'turn the festival year',
    blurb: 'A twelve-month wheel and the festivals of every home — when they come, what families do, and your own year.',
    icon: 'clock',
    minutes: 4,
    tag: 'Utsav',
    teaches: true,
    levels: ['when: the month', 'harvest and new year', 'the moon (coming)', 'what families do', 'my year (never marked)'],
    review: true,
    c: '#c2563a',
    c2: '#e9a13b',
    engine: panchang
  });
})();
