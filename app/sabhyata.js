/* Bizzing India — SABHYATA (सभ्यता), the civilization game.

   An Age-of-Empires-shaped game rebuilt around this project's own rules (docs/16):

     · You win by CONNECTING, never conquering. Growth is lines and lights — routes
       between real places — and no boundary is drawn, coloured or moved, ever. The
       map underneath is one neutral terrain wash (CLAUDE.md, the boundary rules).
     · The enemy is VISMRITI, the Forgetting — the app's own grey mist. No people,
       no army, no faces. A place the mist takes falls ASLEEP; nothing is destroyed,
       and waking it back is the game.
     · Collaboration is a verb: events ask you to send grain down your own roads,
       and helping is always the profitable move.

   Content comes from data-sabhyata.js (real sites, projected coordinates, sourced
   facts). Registered in window.IND_GAMES like every Mela engine — host, done,
   teardown — and honours the house rules: full keyboard AND touch play,
   prefers-reduced-motion, no lives, no shaming.

   STORAGE. The app's Store seam lives inside app.js's closure and is not reachable
   from a Mela engine, so the save uses its own localStorage key with the same
   swallow-errors discipline. When the Vite migration makes the seam importable
   (docs/07 §1), this moves behind it — the snapshot shape is already seam-friendly.

   Plain script, no modules, no build. */

(function () {
  'use strict';

  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document || null;
  if (!D) return;

  var SAVE_KEY = 'india.sabhyata.v1';
  var TICK_MS = 1000;

  /* ---- tuning, in one place ---- */
  var T = {
    startRes:   { anna: 40, kala: 40, katha: 0 },
    growCost:   [0, 25, 60],        /* to reach level 2, level 3 */
    maxLevel:   3,
    routeCost:  30,                 /* kala */
    wakeCost:   35,                 /* katha */
    utsavCost:  { anna: 20, kala: 20 },
    utsavKatha: 40,
    utsavCd:    60,                 /* seconds */
    fadeIdle:   30,                 /* awake+unconnected seconds before fading starts */
    fadeLen:    25,                 /* fading seconds before sleep */
    eventEvery: 40,                 /* mean seconds between help events */
    eventAsk:   25,                 /* anna asked for */
    eventKatha: 30,                 /* katha earned by helping */
    eventLen:   20                  /* seconds to answer */
  };

  /* ==================================================================
     STYLE — injected once, scoped under .sab-
     ================================================================== */
  var CSS = [
    '.sab-wrap{display:flex;flex-direction:column;gap:10px;color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    '.sab-hud{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}',
    '.sab-era b{display:block;font:800 18px/1.15 var(--display,Georgia,serif)}',
    '.sab-era span{font-size:11.5px;color:var(--muted);font-weight:700;letter-spacing:.08em;text-transform:uppercase}',
    '.sab-res{display:flex;gap:8px;flex-wrap:wrap}',
    '.sab-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border:1px solid var(--line);border-radius:999px;background:var(--card);font-weight:800;font-size:14px}',
    '.sab-chip small{font-weight:600;color:var(--muted)}',
    '.sab-btn{min-height:44px;padding:8px 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--text);font:700 14px var(--body,system-ui);cursor:pointer}',
    '.sab-btn:disabled{opacity:.45;cursor:default}',
    '.sab-btn.go{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.sab-btn:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',

    '.sab-stage{position:relative;background:var(--ground2);border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden}',
    '.sab-stage svg{display:block;width:100%;height:auto;max-height:64vh}',
    '.sab-terr{fill:var(--mist);stroke:var(--line);stroke-width:1;pointer-events:none}',

    /* a road is two strokes: a quiet solid bed, and marigold beads walking it —
       one animated stroke alone vanished into the land at map scale */
    '.sab-bed{fill:none;stroke:var(--accent2);stroke-width:7;stroke-linecap:round;opacity:.35}',
    '.sab-route{fill:none;stroke:var(--accent2);stroke-width:5;stroke-linecap:round;stroke-dasharray:1 12}',
    '.sab-route.live{animation:sabflow 1.6s linear infinite}',
    '@keyframes sabflow{to{stroke-dashoffset:-13}}',

    /* THE TAP TARGET IS THE LAMP, NOT THE LABEL. The group's natural hit area is its
       bounding box — mist halo plus a west-hanging name — whose centre can sit out at
       sea, which is where a fat thumb aimed "at Muziris" actually lands. One generous
       invisible circle on the dot takes every pointer; nothing else in the group does. */
    '.sab-site{cursor:pointer;pointer-events:none}',
    '.sab-site .hit{pointer-events:all}',
    '.sab-site:focus{outline:none}',
    '.sab-site circle.core{fill:var(--accent);stroke:#fff;stroke-width:2.5}',
    '.sab-site.asleep circle.core{fill:var(--muted);opacity:.55}',
    '.sab-site.fading circle.core{fill:var(--accent2)}',
    '.sab-site text{font:800 24px var(--body,system-ui);fill:var(--text);paint-order:stroke;stroke:var(--card);stroke-width:5px;pointer-events:none}',
    '.sab-site.asleep text{opacity:.6}',
    '.sab-site .ring{fill:none;stroke:var(--accent);stroke-width:2;opacity:.8}',
    '.sab-site.sel circle.core{stroke:var(--accent3);stroke-width:5}',
    '.sab-site.kbd circle.halo{fill:none;stroke:var(--accent3);stroke-width:3;stroke-dasharray:6 6}',
    '.sab-mist{fill:url(#sabmist);pointer-events:none}',
    '.sab-lamp{animation:sablamp 2.6s ease-in-out infinite}',
    '@keyframes sablamp{0%,100%{opacity:.85}50%{opacity:1}}',

    '.sab-feed{min-height:22px;margin:0;font-size:14.5px;font-weight:600;color:var(--muted)}',
    '.sab-feed.warm{color:var(--good)}',
    '.sab-feed.mist{color:var(--accent2)}',

    '.sab-sheet{display:flex;gap:8px;flex-wrap:wrap;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:10px}',
    '.sab-sheet b{font:800 15px var(--display,Georgia,serif);margin-right:2px}',
    '.sab-sheet .tiny{width:100%;color:var(--muted);font-size:12.5px}',

    '.sab-over{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--ground) 82%,transparent);padding:18px;z-index:4}',
    '.sab-card{max-width:460px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.25)}',
    '.sab-card h3{margin:0 0 8px;font:800 20px/1.2 var(--display,Georgia,serif)}',
    '.sab-card p{margin:0 0 12px;font-size:15px;line-height:1.55}',
    '.sab-card .row{display:flex;gap:8px;flex-wrap:wrap}',

    '.sab-help{font-size:12.5px;color:var(--muted)}',
    '@media (prefers-reduced-motion: reduce){.sab-route.live,.sab-lamp{animation:none}}'
  ].join('\n');

  var cssIn = false;
  function injectCSS() {
    if (cssIn) return; cssIn = true;
    var s = D.createElement('style'); s.textContent = CSS; D.head.appendChild(s);
  }

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
  function save(g) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(g)); } catch (e) {} }
  function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

  /* ==================================================================
     THE ENGINE
     ================================================================== */
  function sabhyata(host, opts, done) {
    injectCSS();
    var DATA = W.IND_SABHYATA, M = W.IND_MAP;
    if (!DATA || !M) { host.innerHTML = '<div class="sab-card">Sabhyata could not load its data.</div>'; return function () {}; }

    var SITES = DATA.sites, ERAS = DATA.eras;
    var byId = {}; SITES.forEach(function (s) { byId[s.id] = s; });
    /* keyboard order: roughly north-west to south-east, the direction history moved here */
    var order = SITES.slice().sort(function (a, b) { return (a.y - b.y) || (a.x - b.x); }).map(function (s) { return s.id; });

    var YIELD = { kheti: 'anna', shilpa: 'kala', vidya: 'katha' };
    var ICON = { anna: '🌾', kala: '🛠️', katha: '📜' };

    /* ---- game state: a plain JSON snapshot, deliberately ---- */
    var G = null;
    function fresh() {
      var st = {};
      SITES.forEach(function (s) { st[s.id] = { lv: 1, zzz: s.era > 0 || s.id !== 'dholavira', fade: -1, idle: 0, seen: false }; });
      st.dholavira.seen = true;
      return { era: 0, res: { anna: T.startRes.anna, kala: T.startRes.kala, katha: T.startRes.katha },
               sites: st, routes: [], t: 0, utsav: 0, ev: null, score: 0, won: false };
    }

    /* ---- rules helpers ---- */
    function inEra(s) { return s.era <= G.era; }
    function connected(id) {
      return G.routes.some(function (r) { return r[0] === id || r[1] === id; });
    }
    function awake(id) { var q = G.sites[id]; return q && !q.zzz; }
    function routed(a, b) {
      return G.routes.some(function (r) { return (r[0] === a && r[1] === b) || (r[0] === b && r[1] === a); });
    }
    function eraDone() {
      return SITES.every(function (s) { return !inEra(s) || awake(s.id); });
    }
    function canAdvance() {
      return G.era < ERAS.length - 1 && eraDone() && G.res.katha >= ERAS[G.era].katha;
    }
    function allAwake() { return SITES.every(function (s) { return awake(s.id); }); }

    /* ---- transient ui state (not saved) ---- */
    var sel = null, targeting = false, kbd = null, feed = '', feedCls = '', overlay = null, pause = false;
    var timer = null, dead = false;

    function say(t, cls) { feed = t; feedCls = cls || ''; paintFeed(); }

    /* ================================================================
       RENDER — the board is drawn once; ticks only PATCH attributes.
       Rebuilding 20 nodes of SVG every second made older tablets sweat,
       and it also stole focus mid-keyboard-navigation, which broke the
       house keyboard rule in the ugliest possible way.
       ================================================================ */
    function siteSVG(s) {
      var q = G.sites[s.id];
      var r = 9 + q.lv * 2;
      /* Labels take a direction per site (data `lab`): history clusters — three lamps
         within twenty pixels around Pataliputra, two on the Odisha coast — and twenty
         names all set above their dots read as one smear exactly where the game is
         most alive. Checked against the rendered board, not assumed. */
      var lab = s.lab || 'n', lx = s.x, ly = s.y - r - 14, anc = 'middle';
      if (lab === 's') { ly = s.y + r + 30; }
      if (lab === 'e') { lx = s.x + r + 10; ly = s.y + 8; anc = 'start'; }
      if (lab === 'w') { lx = s.x - r - 10; ly = s.y + 8; anc = 'end'; }
      return '<g class="sab-site" id="sab-' + s.id + '" data-sab="' + s.id + '" tabindex="-1" role="button" aria-label="' + esc(s.name) + '">' +
        '<circle class="hit" cx="' + s.x + '" cy="' + s.y + '" r="' + (r + 18) + '" fill="none"/>' +
        '<circle class="halo" cx="' + s.x + '" cy="' + s.y + '" r="' + (r + 12) + '" fill="none"/>' +
        '<circle class="mistv sab-mist" cx="' + s.x + '" cy="' + s.y + '" r="46"/>' +
        '<circle class="ring r2" cx="' + s.x + '" cy="' + s.y + '" r="' + (r + 5) + '"/>' +
        '<circle class="ring r3" cx="' + s.x + '" cy="' + s.y + '" r="' + (r + 10) + '"/>' +
        '<circle class="core sab-lamp" cx="' + s.x + '" cy="' + s.y + '" r="' + r + '"/>' +
        '<text x="' + lx + '" y="' + ly + '" text-anchor="' + anc + '">' + esc(s.name) + '</text>' +
        '</g>';
    }
    function routeSVG(r, i) {
      var a = byId[r[0]], b = byId[r[1]];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 24;   /* a gentle bow, like a road, not a wire */
      var d = 'M' + a.x + ' ' + a.y + ' Q' + mx + ' ' + my + ' ' + b.x + ' ' + b.y;
      return '<path class="sab-bed" d="' + d + '"/><path class="sab-route live" id="sabr-' + i + '" d="' + d + '"/>';
    }

    function board() {
      var terr = Object.keys(M.paths).map(function (c) {
        return '<path class="sab-terr" d="' + M.paths[c] + '"/>';
      }).join('');
      return '<svg viewBox="' + (M.viewBox || '0 0 1000 1100') + '" role="application" aria-label="Sabhyata board — the map of India">' +
        '<defs><radialGradient id="sabmist"><stop offset="0%" stop-color="#9aa0a6" stop-opacity=".85"/>' +
        '<stop offset="100%" stop-color="#9aa0a6" stop-opacity="0"/></radialGradient></defs>' +
        /* one neutral wash for every state — terrain, not territory. Nothing here is
           interactive, nothing changes colour, and no line ever moves: the boundary
           rules are absolute, and this game keeps clear of them by construction. */
        '<g>' + terr + '</g>' +
        '<g id="sab-routes">' + G.routes.map(routeSVG).join('') + '</g>' +
        '<g id="sab-sites">' + SITES.map(siteSVG).join('') + '</g>' +
        '</svg>';
    }

    function shell() {
      host.innerHTML = '<div class="sab-wrap" id="sabwrap">' +
        '<div class="sab-hud">' +
          '<div class="sab-era"><span id="sab-eradate"></span><b id="sab-eraname"></b></div>' +
          '<div class="sab-res" id="sab-res" aria-live="off"></div>' +
          '<div style="display:flex;gap:8px">' +
            '<button class="sab-btn go" id="sab-adv" hidden></button>' +
            '<button class="sab-btn" id="sab-pause" aria-pressed="false">Pause</button>' +
          '</div>' +
        '</div>' +
        '<div class="sab-stage" id="sab-stage">' + board() + '<div id="sab-ovhost"></div></div>' +
        '<p class="sab-feed" id="sab-feed" aria-live="polite"></p>' +
        '<div class="sab-sheet" id="sab-sheet" hidden></div>' +
        '<p class="sab-help">Tap a lamp, or move between them with the arrow keys — Enter chooses, ' +
          '<b>1–4</b> fire an action, <b>Esc</b> cancels, <b>P</b> pauses. Routes are how a place stays safe from the mist.</p>' +
        '</div>';
      paintAll();
    }

    /* ---- patch painters ---- */
    function paintHud() {
      var e = ERAS[G.era];
      D.getElementById('sab-eraname').textContent = e.name;
      D.getElementById('sab-eradate').textContent = 'Era ' + (G.era + 1) + ' · ' + e.dates;
      D.getElementById('sab-res').innerHTML = ['anna', 'kala', 'katha'].map(function (k) {
        return '<span class="sab-chip">' + ICON[k] + ' ' + Math.floor(G.res[k]) +
          ' <small>' + DATA.resources[k].name + '</small></span>';
      }).join('');
      var adv = D.getElementById('sab-adv');
      if (G.era < ERAS.length - 1) {
        adv.hidden = false;
        adv.disabled = !canAdvance();
        adv.textContent = 'New era — ' + ERAS[G.era].katha + ' 📜';
      } else adv.hidden = true;
    }
    function paintFeed() {
      var f = D.getElementById('sab-feed');
      if (f) { f.textContent = feed; f.className = 'sab-feed ' + feedCls; }
    }
    function paintSite(s) {
      var g = D.getElementById('sab-' + s.id); if (!g) return;
      var q = G.sites[s.id], vis = inEra(s);
      g.style.display = vis ? '' : 'none';
      if (!vis) return;
      g.setAttribute('class', 'sab-site' +
        (q.zzz ? ' asleep' : (q.fade >= 0 ? ' fading' : '')) +
        (sel === s.id ? ' sel' : '') + (kbd === s.id ? ' kbd' : ''));
      g.setAttribute('tabindex', '0');
      var r = 9 + q.lv * 2;
      g.querySelector('.core').setAttribute('r', r);
      g.querySelector('.r2').style.display = (!q.zzz && q.lv >= 2) ? '' : 'none';
      g.querySelector('.r3').style.display = (!q.zzz && q.lv >= 3) ? '' : 'none';
      var m = g.querySelector('.mistv');
      m.style.display = (q.zzz || q.fade >= 0) ? '' : 'none';
      m.setAttribute('opacity', q.zzz ? 1 : Math.min(1, q.fade / T.fadeLen).toFixed(2));
    }
    function paintRoutes() {
      var gEl = D.getElementById('sab-routes');
      if (gEl) gEl.innerHTML = G.routes.map(routeSVG).join('');
    }
    function paintSheet() {
      var sh = D.getElementById('sab-sheet');
      if (!sel) { sh.hidden = true; sh.innerHTML = ''; return; }
      var s = byId[sel], q = G.sites[sel];
      var b = [];
      b.push('<b>' + esc(s.name) + '</b>');
      if (q.zzz) {
        b.push('<span class="sab-chip">asleep under the mist</span>');
        b.push('<button class="sab-btn go" data-sab-act="wake">1 · Wake — tell its story (' + T.wakeCost + ' 📜)</button>');
      } else {
        b.push('<span class="sab-chip">' + ICON[YIELD[s.kind]] + ' level ' + q.lv + (connected(sel) ? ' · on a route' : ' · alone') + '</span>');
        if (q.lv < T.maxLevel) b.push('<button class="sab-btn" data-sab-act="grow">1 · Grow (' + T.growCost[q.lv] + ' 🌾)</button>');
        b.push('<button class="sab-btn" data-sab-act="route">2 · Route (' + T.routeCost + ' 🛠️)</button>');
        b.push('<button class="sab-btn" data-sab-act="utsav"' + (G.utsav > 0 ? ' disabled' : '') + '>3 · Utsav ' +
          (G.utsav > 0 ? '(' + G.utsav + 's)' : '(' + T.utsavCost.anna + ' 🌾 + ' + T.utsavCost.kala + ' 🛠️)') + '</button>');
      }
      b.push('<button class="sab-btn" data-sab-act="close">Close</button>');
      if (targeting) b.push('<span class="tiny">Now choose the other end of the route — tap a lamp, or arrows + Enter.</span>');
      sh.hidden = false; sh.innerHTML = b.join('');
    }
    function paintAll() {
      paintHud(); SITES.forEach(paintSite); paintRoutes(); paintSheet(); paintFeed();
    }

    /* ---- overlays: fact cards, era cards, endings, resume ---- */
    function showOverlay(html) {
      overlay = html;
      D.getElementById('sab-ovhost').innerHTML =
        html ? '<div class="sab-over"><div class="sab-card" role="dialog" aria-modal="true">' + html + '</div></div>' : '';
      if (html) { var f = D.querySelector('#sab-ovhost .sab-btn'); if (f) f.focus(); }
    }

    /* ================================================================
       ACTIONS
       ================================================================ */
    function act(name) {
      if (!sel || G.won) return;
      var s = byId[sel], q = G.sites[sel];
      if (name === 'close') { sel = null; targeting = false; paintAll(); return; }
      if (name === 'grow' && !q.zzz && q.lv < T.maxLevel) {
        var cost = T.growCost[q.lv];
        if (G.res.anna < cost) return say('Not enough anna yet — the fields are still filling.', '');
        G.res.anna -= cost; q.lv++; G.score += 10;
        say(s.name + ' grows. The lamps burn a little brighter.', 'warm');
      }
      if (name === 'route') {
        if (G.res.kala < T.routeCost) return say('Routes take kala — grow a craft town, or wait for the workshops.', '');
        targeting = true; say('Choose where the road from ' + s.name + ' should go.', '');
      }
      if (name === 'utsav' && G.utsav <= 0) {
        if (G.res.anna < T.utsavCost.anna || G.res.kala < T.utsavCost.kala)
          return say('An utsav needs both grain and craft — the whole village brings something.', '');
        G.res.anna -= T.utsavCost.anna; G.res.kala -= T.utsavCost.kala;
        G.res.katha += T.utsavKatha; G.utsav = T.utsavCd; G.score += 15;
        SITES.forEach(function (t) { var w = G.sites[t.id]; if (w.fade >= 0) { w.fade = -1; w.idle = 0; } });
        say('Utsav at ' + s.name + '! Songs carry far — the mist pulls back from every fading lamp.', 'warm');
      }
      if (name === 'wake' && q.zzz) {
        if (!connected(sel)) return say(s.name + ' needs a road first — a story has to travel to be heard.', '');
        if (G.res.katha < T.wakeCost) return say('Not enough katha — stories are earned by helping and holding utsavs.', '');
        G.res.katha -= T.wakeCost; q.zzz = false; q.fade = -1; q.idle = 0; G.score += 25;
        say(s.name + ' wakes!', 'warm');
        if (!q.seen) { q.seen = true; showOverlay('<h3>' + esc(s.name) + '</h3><p>' + esc(s.fact) + '</p>' +
          '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Onward</button></div>'); }
      }
      paintAll(); maybeEnd();
    }

    function tryRoute(target) {
      var a = sel, b = target;
      if (!a || a === b || !inEra(byId[b])) return;
      if (routed(a, b)) { targeting = false; return say('That road is already walked.', ''); }
      if (G.res.kala < T.routeCost) { targeting = false; return say('Not enough kala for this road.', ''); }
      G.res.kala -= T.routeCost; G.routes.push([a, b]); G.score += 15;
      targeting = false;
      var q = G.sites[a]; q.idle = 0; if (q.fade >= 0) q.fade = -1;
      var p = G.sites[b]; p.idle = 0; if (p.fade >= 0) p.fade = -1;
      say('A road now runs between ' + byId[a].name + ' and ' + byId[b].name + '. Connected places thrive.', 'warm');
      paintAll();
    }

    function advance() {
      if (!canAdvance()) return;
      G.res.katha -= ERAS[G.era].katha;
      var aha = ERAS[G.era].aha;
      G.era++; G.score += 50;
      var next = ERAS[G.era];
      showOverlay('<h3>' + esc(aha.title) + '</h3><p>' + esc(aha.text) + '</p>' +
        '<p><b>' + esc(next.name) + '</b> · ' + esc(next.dates) + '<br>' + esc(next.note) + '</p>' +
        '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Begin</button></div>');
      say('New places wait under the mist. Reach them.', 'mist');
      paintAll();
    }

    function maybeEnd() {
      /* never over the top of an open card: waking the LAST lamp shows that place's
         own fact, and the ending was painting straight over it — the one story a
         child had waited twenty lamps for, swallowed by the applause. The close
         button calls back here, so the ending is only ever deferred, not lost. */
      if (overlay) return;
      if (G.won || G.era < ERAS.length - 1 || !allAwake()) return;
      G.won = true; wipe();
      showOverlay('<h3>India remembers.</h3>' +
        '<p>Every lamp is lit, every road is walked, and the mist has gone back to the sea. ' +
        'Five thousand years, and not one of these places was taken — every one was reached.</p>' +
        '<div class="row"><button class="sab-btn go" data-sab-act="finish">Take a bow</button></div>');
    }

    /* ================================================================
       THE TICK — one second of the world
       ================================================================ */
    function tick() {
      if (pause || overlay || G.won || dead) return;
      G.t++;
      if (G.utsav > 0) G.utsav--;

      /* yields */
      SITES.forEach(function (s) {
        if (!inEra(s)) return;
        var q = G.sites[s.id];
        if (q.zzz || q.fade >= 0) return;
        G.res[YIELD[s.kind]] += q.lv * (connected(s.id) ? 2 : 1);
      });

      /* the mist: an awake place left alone starts to fade; a fading place sleeps.
         Connected places are safe — that is the whole lesson of the game. */
      SITES.forEach(function (s) {
        if (!inEra(s)) return;
        var q = G.sites[s.id];
        if (q.zzz) return;
        if (connected(s.id)) { q.idle = 0; if (q.fade >= 0 && !G.ev) q.fade = -1; return; }
        if (q.fade >= 0) {
          q.fade++;
          if (q.fade >= T.fadeLen) { q.zzz = true; q.fade = -1; say('The mist has taken ' + s.name + ' — for now. Reach it again.', 'mist'); }
        } else {
          q.idle++;
          if (q.idle >= T.fadeIdle) { q.fade = 0; say('The mist is drifting over ' + s.name + '. A road would hold it.', 'mist'); }
        }
      });

      /* help events — the collaboration verb. Only connected places ask, because the
         request travels by road, and helping pays better than anything else. */
      if (!G.ev && G.t % T.eventEvery === Math.floor(T.eventEvery / 2)) {
        var cands = SITES.filter(function (s) { return inEra(s) && awake(s.id) && connected(s.id); });
        if (cands.length > 1) {
          var pick = cands[(G.t * 7) % cands.length];
          G.ev = { id: pick.id, left: T.eventLen };
          say('A lean season at ' + pick.name + ' — send ' + T.eventAsk + ' 🌾 down the road? (press H, or tap it)', 'mist');
        }
      }
      if (G.ev) {
        G.ev.left--;
        if (G.ev.left <= 0) {
          var q2 = G.sites[G.ev.id];
          if (q2 && !q2.zzz && q2.fade < 0) q2.fade = 0;
          say('The lean season passes hard at ' + byId[G.ev.id].name + '. The mist creeps closer.', 'mist');
          G.ev = null;
        }
      }

      if (G.t % 5 === 0) save(G);
      paintHud(); SITES.forEach(paintSite);
    }

    function helpEvent() {
      if (!G.ev) return;
      if (G.res.anna < T.eventAsk) return say('Not enough grain to send — grow the fields.', '');
      G.res.anna -= T.eventAsk; G.res.katha += T.eventKatha; G.score += 20;
      say(byId[G.ev.id].name + ' eats well, and the story of the help travels further than the grain. +' + T.eventKatha + ' 📜', 'warm');
      G.ev = null; paintHud();
    }

    /* ================================================================
       INPUT — every action reachable by touch AND by keyboard.
       ================================================================ */
    function siteAt(el) {
      while (el && el !== host) { if (el.getAttribute && el.getAttribute('data-sab')) return el.getAttribute('data-sab'); el = el.parentNode; }
      return null;
    }
    function onClick(e) {
      var actEl = e.target.closest ? e.target.closest('[data-sab-act]') : null;
      if (actEl) {
        var a = actEl.getAttribute('data-sab-act');
        if (a === 'ovclose') { showOverlay(null); paintAll(); maybeEnd(); return; }
        if (a === 'finish') { showOverlay(null); if (typeof done === 'function') done({ win: true, score: G.score, kauris: 25 }); return; }
        return act(a);
      }
      var id = siteAt(e.target);
      if (id) {
        if (G.ev && id === G.ev.id) return helpEvent();
        if (targeting) return tryRoute(id);
        sel = id; kbd = id; paintAll(); return;
      }
      if (targeting) { targeting = false; say('Road put away.', ''); paintSheet(); }
    }
    function onKey(e) {
      if (dead) return;
      if (overlay) { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); var f = D.querySelector('#sab-ovhost [data-sab-act]'); if (f) f.click(); } return; }
      var k = e.key;
      if (k === 'p' || k === 'P') { e.preventDefault(); return togglePause(); }
      if (k === 'h' || k === 'H') { e.preventDefault(); return helpEvent(); }
      if (k === 'Escape') { e.preventDefault(); targeting = false; sel = null; paintAll(); return; }
      if (k === 'Enter' || k === ' ') {
        if (kbd) { e.preventDefault();
          if (targeting) return tryRoute(kbd);
          sel = kbd; paintAll(); }
        return;
      }
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'Tab' && !e.shiftKey) { e.preventDefault(); step(1); return; }
      if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'Tab') { e.preventDefault(); step(-1); return; }
      if (sel && k >= '1' && k <= '3') {
        e.preventDefault();
        var q = G.sites[sel];
        if (q.zzz) { if (k === '1') act('wake'); return; }
        if (k === '1') act('grow'); if (k === '2') act('route'); if (k === '3') act('utsav');
      }
    }
    function step(dir) {
      var vis = order.filter(function (id) { return inEra(byId[id]); });
      var i = vis.indexOf(kbd); i = i < 0 ? 0 : (i + dir + vis.length) % vis.length;
      kbd = vis[i];
      var el = D.getElementById('sab-' + kbd); if (el) el.focus();
      SITES.forEach(paintSite);
    }
    function togglePause() {
      pause = !pause;
      var b = D.getElementById('sab-pause');
      b.textContent = pause ? 'Play' : 'Pause';
      b.setAttribute('aria-pressed', String(pause));
      say(pause ? 'The world holds its breath.' : '', '');
    }

    /* ================================================================
       BOOT — resume a saved sabhyata or begin at Dholavira
       ================================================================ */
    var saved = load();
    G = (saved && !saved.won && saved.sites && saved.sites.dholavira) ? saved : fresh();
    shell();
    if (saved && saved === G) {
      say('Welcome back. The lamps kept burning while you were away.', 'warm');
    } else {
      showOverlay('<h3>Sabhyata — the first city</h3>' +
        '<p>Dholavira is awake, and the rest of India sleeps under Vismriti, the Forgetting. ' +
        'Grow your city, build roads, and wake the land one lamp at a time. ' +
        'Nothing here is ever conquered — only reached.</p>' +
        '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Light the first lamp</button></div>');
    }
    var advBtn = D.getElementById('sab-adv');
    advBtn.addEventListener('click', advance);
    D.getElementById('sab-pause').addEventListener('click', togglePause);
    host.addEventListener('click', onClick);
    /* keys live on the document: focus often rests on the page body, and a game whose
       keyboard only works after a click is a game with no keyboard (house rule). The
       teardown removes it, and `dead` guards the gap. */
    D.addEventListener('keydown', onKey);
    timer = setInterval(tick, TICK_MS);

    return function teardown() {
      dead = true;
      clearInterval(timer);
      if (G && !G.won) save(G);
      host.removeEventListener('click', onClick);
      D.removeEventListener('keydown', onKey);
    };
  }

  /* ==================================================================
     REGISTRY — push, never replace: games.js owns the array.
     ================================================================== */
  if (!W.IND_GAMES) W.IND_GAMES = [];
  W.IND_GAMES.push({
    id: 'sabhyata', name: 'Sabhyata', icon: 'map', minutes: 12, tag: 'Civilization',
    c: '#8a5a2b', c2: '#d9a23d',
    blurb: 'Grow the first cities, wake five thousand years of India lamp by lamp — and hold back the Forgetting. Nothing is conquered here; everything is reached.',
    scene: '<svg viewBox="0 0 100 70" aria-hidden="true"><path d="M20 52 Q35 30 52 38 Q70 46 82 24" fill="none" stroke="#fff3d0" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/><circle cx="20" cy="52" r="6" fill="#ffd76e"/><circle cx="52" cy="38" r="5" fill="#ffd76e"/><circle cx="82" cy="24" r="7" fill="#fff3d0"/><circle cx="82" cy="24" r="11" fill="none" stroke="#fff3d0" stroke-opacity=".5"/></svg>',
    engine: sabhyata
  });
})();
