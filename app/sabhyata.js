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
    eventLen:   20,                 /* seconds to answer */
    questMax:   3,                  /* live quest scrolls at once */
    questGap:   18,                 /* seconds between new scrolls appearing */
    reward: { carry: 40, road: 35, wake: 50, utsav: 35, riddle: 30, peace: 45 },  /* katha */

    negAfter:   75,                 /* seconds untouched before a city turns dusty (yields halve) */
    stepwellX:  3,                  /* stepwell stretches that */
    dispEvery:  50,                 /* seconds between quarrels */
    dispGrace:  75,                 /* unresolved this long and both towns start to fade */
    capCost:    { anna: 40, kala: 40 },
    monCost:    [ { anna: 40, kala: 40, katha: 20 },   /* monument cost by era */
                  { anna: 50, kala: 50, katha: 30 },
                  { anna: 60, kala: 60, katha: 40 },
                  { anna: 70, kala: 70, katha: 50 },
                  { anna: 80, kala: 80, katha: 60 } ],
    quizPay:    10,                 /* gurukul trivia, own city */
    quizFarPay: 15,                 /* with Brahmi script, about other cities */
    quizCd:     25                  /* seconds between questions per city */
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
    '.sab-guide{margin:0;font-size:14px;font-weight:700;color:var(--text2,var(--text));background:var(--card);border:1px dashed var(--line);border-radius:var(--radius-lg);padding:9px 12px}',
    '.sab-guide b{color:var(--accent)}',

    /* the quest scroll on the map: a small marigold badge riding the lamp */
    '.sab-qb circle{fill:var(--accent2);stroke:#fff;stroke-width:2}',
    '.sab-qb text{font:800 15px var(--body,system-ui);fill:#fff;stroke:none;text-anchor:middle}',
    '.sab-db circle{fill:var(--accent3);stroke:#fff;stroke-width:2}',
    '.sab-db text{font:800 12px var(--body,system-ui);fill:#fff;stroke:none;text-anchor:middle}',
    '.sab-cb circle{fill:var(--accent);stroke:#fff;stroke-width:2}',
    '.sab-cb text{font:800 12px var(--body,system-ui);fill:#fff;stroke:none;text-anchor:middle}',

    /* THE CITY, FROM INSIDE — a full-stage panel, not a small modal */
    '.sab-city{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;background:var(--ground2);overflow:auto;padding:16px}',
    '.sab-city .chead{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}',
    '.sab-city h3{margin:0;font:800 24px/1.1 var(--display,Georgia,serif)}',
    '.sab-city .mono{font-size:11.5px;color:var(--muted);font-weight:700;letter-spacing:.08em;text-transform:uppercase}',
    '.sab-works{display:flex;flex-direction:column;gap:6px;margin:12px 0}',
    '.sab-work{display:flex;align-items:center;gap:10px;padding:9px 12px;border:1px solid var(--line);border-radius:12px;background:var(--card);font-size:14.5px;opacity:.45}',
    '.sab-work.built{opacity:1;font-weight:700}',
    '.sab-work.now{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft,rgba(0,0,0,.05))}',
    '.sab-work i{font-style:normal;width:22px;height:22px;border-radius:50%;border:2px solid var(--line);display:inline-flex;align-items:center;justify-content:center;font-size:12px;flex:none}',
    '.sab-work.built i{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.sab-quest{background:var(--card);border:1px solid var(--accent2);border-radius:var(--radius-lg);padding:12px;margin:6px 0}',
    '.sab-quest .who{font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent2)}',
    '.sab-quest p{margin:6px 0 10px;font-size:15px;line-height:1.5}',
    '.sab-cfact{font-size:14px;line-height:1.55;color:var(--text2,var(--text));background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:12px;margin:6px 0}',
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
      SITES.forEach(function (s) { st[s.id] = { lv: 1, zzz: s.era > 0 || s.id !== 'dholavira', fade: -1, idle: 0, seen: false,
                                                bld: {}, mon: false, neg: 0 }; });
      st.dholavira.seen = true;
      return { era: 0, res: { anna: T.startRes.anna, kala: T.startRes.kala, katha: T.startRes.katha },
               sites: st, routes: [], t: 0, utsav: 0, ev: null, score: 0, won: false,
               quests: {}, qdone: 0, lastq: 0,
               tech: {}, capital: null, disp: null, lastd: 0, quizAt: {}, quizN: 0 };
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

    /* ================================================================
       QUESTS — the game's sense of direction. A folk of the city asks for
       something the verbs can already do; the scroll badge on the lamp is
       the "come here" and the reward is katha, the era-gating currency —
       so quests ARE the road to the next age, not a side dish.
       ================================================================ */
    var FOLK = { kheti: 'the granary keeper', shilpa: 'the master builder', vidya: 'the teacher' };
    var BLD = DATA.buildings, TECHS = DATA.techs, PORTS = DATA.ports || [];

    /* ---- money: one place understands discounts, affording and paying ---- */
    function costOf(c, kind) {
      var f = 1;
      if (kind === 'building' && G.tech.brick) f = 2 / 3;
      if (kind === 'monument' && G.tech.temple) f = 2 / 3;
      if (kind === 'route' && G.tech.roads) f = 1 / 2;
      var out = {};
      Object.keys(c).forEach(function (k) { out[k] = Math.ceil(c[k] * f); });
      return out;
    }
    function canPay(c) { return Object.keys(c).every(function (k) { return G.res[k] >= c[k]; }); }
    function pay(c) { Object.keys(c).forEach(function (k) { G.res[k] -= c[k]; }); }
    function costStr(c) {
      return Object.keys(c).map(function (k) { return c[k] + ' ' + ICON[k]; }).join(' + ');
    }

    /* a touched city is a remembered city: any deliberate act resets its neglect */
    function touch(id) { var q = G.sites[id]; if (q) q.neg = 0; }
    function negLimit(id) {
      var q = G.sites[id];
      return T.negAfter * (q.bld.stepwell ? T.stepwellX : 1);
    }
    function dusty(id) {
      var q = G.sites[id];
      return !q.zzz && !q.mon && G.capital !== id && q.neg >= negLimit(id);
    }
    function inDispute(id) { return G.disp && (G.disp.a === id || G.disp.b === id); }

    /* ---- what a city actually brings in each turn, all rules in one place ---- */
    function yieldOf(x) {
      var q = G.sites[x.id];
      if (q.zzz || q.fade >= 0) return null;
      var conn = connected(x.id) && !inDispute(x.id);
      var out = { anna: 0, kala: 0, katha: 0 };
      out[YIELD[x.kind]] += q.lv * (conn ? 2 : 1);
      if (q.bld.granary) out.anna += 1;
      if (q.bld.workshop) out.kala += 1;
      if (q.bld.gurukul) out.katha += 1;
      if (q.bld.bazaar && conn) { out.anna += 1; out.kala += 1; out.katha += 1; }
      if (G.tech.plough && x.kind === 'kheti') out.anna += 1;
      if (G.tech.iron && x.kind === 'shilpa') out.kala += 1;
      if (G.tech.zero && x.kind === 'vidya') out.katha += 1;
      if (G.tech.monsoon && conn && PORTS.indexOf(x.id) >= 0) { out.anna += 2; out.kala += 2; out.katha += 2; }
      if (q.mon) out.katha += 2;
      if (G.capital === x.id) { out.anna += 1; out.kala += 1; out.katha += 1; }
      if (dusty(x.id)) Object.keys(out).forEach(function (k) { out[k] = Math.floor(out[k] / 2); });
      return out;
    }

    function questText(qq, here) {
      var t = qq.target ? byId[qq.target] : null;
      if (qq.kind === 'road')   return 'Our traders ask for a road between ' + here.name + ' and ' + t.name + '.';
      if (qq.kind === 'wake')   return 'They say ' + t.name + ' sleeps under the mist. Reach it, and tell its story again.';
      if (qq.kind === 'carry')  return 'We need ' + T.eventAsk + ' kala of good craft brought in along the roads.';
      if (qq.kind === 'utsav')  return 'The season has been long. Hold an utsav here, in ' + here.name + ' itself.';
      if (qq.kind === 'riddle') return 'A question, traveller — answer it and the telling is yours to keep.';
      return '';
    }

    function spawnQuest() {
      if (Object.keys(G.quests).length >= T.questMax) return;
      if (G.t - G.lastq < T.questGap) return;
      var homes = SITES.filter(function (x) {
        return inEra(x) && awake(x.id) && !G.quests[x.id];
      });
      if (!homes.length) return;
      var here = homes[(G.t * 13) % homes.length];
      var kinds = [];
      var sleeping = SITES.filter(function (x) { return inEra(x) && !awake(x.id); });
      var unroaded = SITES.filter(function (x) {
        return inEra(x) && awake(x.id) && x.id !== here.id && !routed(here.id, x.id);
      });
      if (unroaded.length) kinds.push('road');
      if (sleeping.length) kinds.push('wake');
      if (connected(here.id)) kinds.push('carry', 'utsav');
      if (here.ask && G.sites[here.id].seen) kinds.push('riddle');
      if (!kinds.length) return;
      var kind = kinds[(G.t * 7 + here.name.length) % kinds.length];
      var target = kind === 'road' ? unroaded[(G.t * 3) % unroaded.length].id
                 : kind === 'wake' ? sleeping[(G.t * 3) % sleeping.length].id : null;
      G.quests[here.id] = { kind: kind, target: target };
      G.lastq = G.t;
      say(FOLK[here.kind] + ' of ' + here.name + ' has a request — the scroll is on the map.', 'warm');
    }

    function finishQuest(id, extra) {
      var qq = G.quests[id]; if (!qq) return;
      delete G.quests[id];
      var pay = T.reward[qq.kind] || 30;
      G.res.katha += pay; G.qdone++; G.score += 30;
      say((extra || 'Done!') + ' ' + byId[id].name + ' is glad — the story travels. +' + pay + ' \ud83d\udcdc', 'warm');
    }

    /* road/wake scrolls complete themselves the moment the world satisfies them */
    function checkQuests() {
      Object.keys(G.quests).forEach(function (id) {
        var qq = G.quests[id];
        if (qq.kind === 'road' && routed(id, qq.target)) finishQuest(id, 'The road is walked.');
        if (qq.kind === 'wake' && awake(qq.target)) finishQuest(id, byId[qq.target].name + ' is awake.');
      });
    }

    /* ---- the guide line: the game always says what it would do next ---- */
    function hint() {
      if (G.disp) return '<b>' + esc(byId[G.disp.a].name) + '</b> and <b>' + esc(byId[G.disp.b].name) +
        '</b> are quarrelling — enter either town and sit the panchayat (' + G.disp.left + 's).';
      var fading = SITES.filter(function (x) { return inEra(x) && G.sites[x.id].fade >= 0; })[0];
      if (fading) return 'The mist is over <b>' + esc(fading.name) + '</b> — route it, or hold an utsav.';
      if (G.ev) return '<b>' + esc(byId[G.ev.id].name) + '</b> asks for grain — tap it (or press H) to help.';
      var dust = SITES.filter(function (x) { return inEra(x) && dusty(x.id); })[0];
      if (dust) return '<b>' + esc(dust.name) + '</b> is dusty and earning half — visit it, grow it, or build there.';
      var qid = Object.keys(G.quests)[0];
      if (qid) return 'A scroll waits at <b>' + esc(byId[qid].name) + '</b> — enter the city and take the quest.';
      var zz = SITES.filter(function (x) { return inEra(x) && !awake(x.id); })[0];
      if (zz) {
        if (!connected(zz.id)) return 'Build a road toward <b>' + esc(zz.name) + '</b> — it sleeps under the mist.';
        if (G.res.katha >= T.wakeCost) return '<b>' + esc(zz.name) + '</b> is reached — wake it (' + T.wakeCost + ' \ud83d\udcdc).';
        return 'Earn katha to wake <b>' + esc(zz.name) + '</b> — quests and lean-season help pay best.';
      }
      var m3 = SITES.filter(function (x) { return inEra(x) && awake(x.id) && G.sites[x.id].lv >= 3 && !G.sites[x.id].mon; })[0];
      if (m3 && canPay(costOf(T.monCost[m3.era], 'monument')))
        return '<b>' + esc(m3.name) + '</b> could raise its monument — enter the city. Stone remembers.';
      var un = TECHS.filter(function (t) { return t.era <= G.era && !G.tech[t.id] && canPay(costOf(t.cost, 'tech')); })[0];
      if (un) return 'The age has learning to buy — open <b>Vidya</b> (' + esc(un.name) + ' is affordable).';
      if (canAdvance()) return 'The age is complete — press <b>New era</b>.';
      if (G.era < ERAS.length - 1)
        return (ERAS[G.era].katha - Math.floor(G.res.katha)) + ' more \ud83d\udcdc to the new era — quest scrolls are the fastest way.';
      return 'Every lamp of this age burns. Grow the cities tall.';
    }

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
        '<g class="sab-qb" style="display:none"><circle cx="' + (s.x + r + 4) + '" cy="' + (s.y - r - 4) + '" r="11"/>' +
        '<text x="' + (s.x + r + 4) + '" y="' + (s.y - r + 1) + '">!</text></g>' +
        '<g class="sab-db" style="display:none"><circle cx="' + (s.x - r - 4) + '" cy="' + (s.y - r - 4) + '" r="11"/>' +
        '<text x="' + (s.x - r - 4) + '" y="' + (s.y - r + 1) + '">\u26a1</text></g>' +
        '<g class="sab-cb" style="display:none"><circle cx="' + s.x + '" cy="' + (s.y + r + 8) + '" r="10"/>' +
        '<text x="' + s.x + '" y="' + (s.y + r + 13) + '">\u2605</text></g>' +
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
            '<button class="sab-btn" id="sab-tech">Vidya</button>' +
            '<button class="sab-btn" id="sab-pause" aria-pressed="false">Pause</button>' +
          '</div>' +
        '</div>' +
        '<div class="sab-stage" id="sab-stage">' + board() + '<div id="sab-ovhost"></div></div>' +
        '<p class="sab-feed" id="sab-feed" aria-live="polite"></p>' +
        '<p class="sab-guide" id="sab-guide"></p>' +
        '<div class="sab-sheet" id="sab-sheet" hidden></div>' +
        '<p class="sab-help">Tap a lamp, or move between them with the arrow keys — Enter chooses, ' +
          '<b>1–4</b> fire an action (<b>4</b> steps inside the city), <b>Esc</b> cancels, <b>P</b> pauses. ' +
          'Routes keep a place safe from the mist; <b>!</b> is a quest, <b>\u26a1</b> a quarrel for your panchayat, <b>\u2605</b> the capital. ' +
          'Cities gather dust if nobody visits — and a monument, once raised, is never forgotten.</p>' +
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
      var qb = g.querySelector('.sab-qb');
      if (qb) qb.style.display = G.quests[s.id] ? '' : 'none';
      var db = g.querySelector('.sab-db');
      if (db) db.style.display = inDispute(s.id) ? '' : 'none';
      var cb = g.querySelector('.sab-cb');
      if (cb) cb.style.display = G.capital === s.id ? '' : 'none';
      g.querySelector('.core').style.opacity = dusty(s.id) ? .55 : '';
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
        b.push('<span class="sab-chip">' + ICON[YIELD[s.kind]] + ' level ' + q.lv +
          (G.capital === sel ? ' · the capital' : '') +
          (connected(sel) ? ' · on a route' : ' · alone') +
          (dusty(sel) ? ' · dusty' : '') +
          (inDispute(sel) ? ' · in a quarrel' : '') + '</span>');
        if (q.lv < T.maxLevel) b.push('<button class="sab-btn" data-sab-act="grow">1 · Grow (' + T.growCost[q.lv] + ' 🌾)</button>');
        b.push('<button class="sab-btn" data-sab-act="route">2 · Route (' + costStr(costOf({ kala: T.routeCost }, 'route')) + ')</button>');
        b.push('<button class="sab-btn" data-sab-act="utsav"' + (G.utsav > 0 ? ' disabled' : '') + '>3 · Utsav ' +
          (G.utsav > 0 ? '(' + G.utsav + 's)' : '(' + T.utsavCost.anna + ' 🌾 + ' + T.utsavCost.kala + ' 🛠️)') + '</button>');
        b.push('<button class="sab-btn go" data-sab-act="city">4 · Enter the city' +
          (G.quests[sel] ? ' — a scroll waits!' : '') + '</button>');
      }
      b.push('<button class="sab-btn" data-sab-act="close">Close</button>');
      if (targeting) b.push('<span class="tiny">Now choose the other end of the route — tap a lamp, or arrows + Enter.</span>');
      sh.hidden = false; sh.innerHTML = b.join('');
    }
    function paintGuide() {
      var el = D.getElementById('sab-guide');
      if (el) el.innerHTML = 'Next: ' + hint();
    }
    function paintAll() {
      paintHud(); SITES.forEach(paintSite); paintRoutes(); paintSheet(); paintFeed(); paintGuide();
    }

    /* ================================================================
       THE CITY, FROM INSIDE. Tap "Enter the city" and the board gives way
       to the town itself: what stands at this level (the works, the real
       ones), the place's own telling to re-read, and whichever folk has a
       scroll. This panel is where carry and riddle quests are resolved —
       the ones that need a decision, not a road.
       ================================================================ */
    var city = null;       /* site id when inside a city */
    var riddleWrong = false;
    var quiz = null;       /* { at: gurukul city, of: city the question is about } */

    /* the riddle's options are shuffled by a per-city seed so the right answer's
       POSITION never leaks; the right answer's TEXT the child earned from the
       fact card when the city woke. */
    function riddleOptions(s) {
      var o = s.ask.o.slice(), seed = s.name.length * 7 + s.x;
      for (var i = o.length - 1; i > 0; i--) {
        var j = Math.floor((seed = (seed * 9301 + 49297) % 233280) / 233280 * (i + 1));
        var t = o[i]; o[i] = o[j]; o[j] = t;
      }
      return o;
    }

    function cityHTML(id) {
      var s = byId[id], q = G.sites[id], qq = G.quests[id];
      var y = yieldOf(s);
      var h = '<div class="sab-city" role="dialog" aria-label="' + esc(s.name) + '">' +
        '<div class="chead"><h3>' + esc(s.name) + (G.capital === id ? ' ★' : '') + '</h3>' +
        '<span class="mono">' + esc(ERAS[s.era].name) + ' · level ' + q.lv +
        (connected(id) ? ' · on the roads' : ' · no road yet') +
        (dusty(id) ? ' · DUSTY — half yields' : '') + '</span>' +
        '<span style="flex:1"></span>' +
        (y ? '<span class="sab-chip">brings in ' + ['anna','kala','katha'].filter(function (k) { return y[k]; })
              .map(function (k) { return '+' + y[k] + ' ' + ICON[k]; }).join(' ') + '</span>' : '') +
        '<button class="sab-btn" data-sab-act="leave">Back to the map</button></div>';

      /* THE QUARREL COMES FIRST. If this town is in a dispute, the panchayat sits
         before anything else gets built — that is what a panchayat is for. */
      if (inDispute(id)) {
        var other = byId[G.disp.a === id ? G.disp.b : G.disp.a];
        h += '<div class="sab-quest" style="border-color:var(--accent3)"><div class="who" style="color:var(--accent3)">the panchayat sits · ' +
          G.disp.left + 's</div>' +
          '<p>' + esc(s.name) + ' and ' + esc(other.name) + ' have quarrelled over ' + esc(G.disp.over) +
          '. The road between them carries nothing until it is settled.</p>' +
          (G.tech.panchayat
            ? '<button class="sab-btn go" data-sab-act="peace" data-i="-1">Let the five settle it (free — the Panchayat)</button>'
            : G.disp.fix.map(function (f, i) {
                var c = costOf(f.cost, 'peace');
                return '<button class="sab-btn go" style="margin:4px 6px 0 0" data-sab-act="peace" data-i="' + i + '"' +
                  (canPay(c) ? '' : ' disabled') + '>' + esc(f.what) + ' (' + costStr(c) + ')</button>';
              }).join('')) +
          '</div>';
      }
      h += '<div class="sab-works">' + (s.works || []).slice(0, 2).map(function (w, i) {
        return '<div class="sab-work' + (q.lv > i ? ' built' : '') + (q.lv === i + 1 ? ' now' : '') + '">' +
          '<i>' + (q.lv > i ? '✓' : (i + 1)) + '</i>' + esc(w) +
          (q.lv === i ? '<span style="flex:1"></span><span class="tiny" style="color:var(--muted)">grow the city to build this</span>' : '') +
          '</div>';
      }).join('') +
      /* THE MONUMENT — works[2], the thing this city is actually famous for. Building
         it is a decision, not a level-up side effect: it is expensive, it needs a
         level-3 town, and once it stands the city can never be forgotten — no dust,
         no mist. A monument is a memory made of stone. */
      (function () {
        var mc = costOf(T.monCost[s.era], 'monument');
        if (q.mon) return '<div class="sab-work built" style="border-color:var(--accent2)"><i>★</i>' +
          esc(s.works[2]) + '<span style="flex:1"></span><span class="tiny" style="color:var(--muted)">the monument stands — +2 📜, and the mist cannot touch this town</span></div>';
        return '<div class="sab-work' + (q.lv >= 3 ? ' now' : '') + '"><i>★</i>' + esc(s.works[2]) +
          '<span style="flex:1"></span>' +
          (q.lv >= 3
            ? '<button class="sab-btn go" data-sab-act="mon"' + (canPay(mc) ? '' : ' disabled') + '>Build the monument (' + costStr(mc) + ')</button>'
            : '<span class="tiny" style="color:var(--muted)">a level-3 city may raise its monument</span>') +
          '</div>';
      })() + '</div>';

      /* BUILD — the strategic coins: the same anna and kala also want to be roads,
         growth and peace, and that tension is the game. */
      h += '<div class="mono" style="margin-top:4px">Build</div><div class="sab-works">' +
        Object.keys(BLD).map(function (bid) {
          var bd = BLD[bid];
          if (bd.era > G.era) return '';
          if (q.bld[bid]) return '<div class="sab-work built"><i>' + bd.icon + '</i>' + esc(bd.name) +
            '<span style="flex:1"></span><span class="tiny" style="color:var(--muted)">' + esc(bd.what) + '</span></div>';
          var c = costOf(bd.cost, 'building');
          return '<div class="sab-work now"><i>' + bd.icon + '</i>' + esc(bd.name) +
            '<span class="tiny" style="color:var(--muted);flex:1"> ' + esc(bd.what) + '</span>' +
            '<button class="sab-btn" data-sab-act="build" data-b="' + bid + '"' + (canPay(c) ? '' : ' disabled') + '>' +
            costStr(c) + '</button></div>';
        }).join('') + '</div>';

      /* THE CAPITAL — one city carries the realm. Moving it is how it always was:
         the Magadha kings left Rajagriha for Pataliputra when the river roads mattered
         more than the hills. */
      if (G.capital !== id) {
        var cc = T.capCost;
        h += '<div class="sab-quest" style="border-style:dashed"><div class="who">the seat of the realm</div>' +
          '<p>' + (G.capital ? 'The capital is at ' + esc(byId[G.capital].name) + '. Moving it here costs the move itself.'
                             : 'The realm has no capital yet. A capital never gathers dust, never quarrels, and adds +1 of everything.') + '</p>' +
          '<button class="sab-btn" data-sab-act="cap"' + (canPay(cc) ? '' : ' disabled') + '>Make ' + esc(s.name) +
          ' the capital (' + costStr(cc) + ')</button></div>';
      }

      /* THE GURUKUL — trivia as a living income. Build it and the teacher takes
         questions; with Brahmi Script, questions about every woken city on the map. */
      if (q.bld.gurukul) {
        var cd = Math.max(0, (G.quizAt[id] || -999) + T.quizCd - G.t);
        h += '<div class="sab-quest"><div class="who">the gurukul</div>' +
          (quiz && quiz.at === id
            ? '<p>' + (quiz.of !== id ? 'About <b>' + esc(byId[quiz.of].name) + '</b>: ' : '') + esc(byId[quiz.of].ask.q) + '</p>' +
              riddleOptions(byId[quiz.of]).map(function (o) {
                return '<button class="sab-btn" style="display:block;width:100%;text-align:left;margin:6px 0" data-sab-act="quiz" data-o="' + esc(o) + '">' + esc(o) + '</button>';
              }).join('') +
              (riddleWrong ? '<p class="tiny" style="color:var(--muted)">Not that one — think of the city\u2019s own telling. Another go.</p>' : '')
            : '<p>The teacher will take a question' + (G.tech.script ? ' about any woken city' : '') + '.</p>' +
              '<button class="sab-btn" data-sab-act="quizstart"' + (cd > 0 ? ' disabled' : '') + '>' +
              (cd > 0 ? 'The teacher rests (' + cd + 's)' : 'Ask me one (+' + (G.tech.script ? T.quizFarPay : T.quizPay) + ' 📜)') + '</button>') +
          '</div>';
      }
      if (qq) {
        h += '<div class="sab-quest"><div class="who">' + esc(FOLK[s.kind]) + ' asks</div>' +
          '<p>' + esc(questText(qq, s)) + '</p>';
        if (qq.kind === 'carry') {
          h += '<button class="sab-btn go" data-sab-act="qcarry"' +
            (connected(id) && G.res.kala >= T.eventAsk ? '' : ' disabled') + '>Bring it in (' + T.eventAsk + ' 🛠️)</button>' +
            (!connected(id) ? '<p class="tiny" style="color:var(--muted);margin:8px 0 0">It needs a road into the city first.</p>' : '');
        } else if (qq.kind === 'utsav') {
          h += '<button class="sab-btn go" data-sab-act="qutsav"' +
            (G.utsav <= 0 && G.res.anna >= T.utsavCost.anna && G.res.kala >= T.utsavCost.kala ? '' : ' disabled') +
            '>Hold the utsav here (' + T.utsavCost.anna + ' 🌾 + ' + T.utsavCost.kala + ' 🛠️)</button>';
        } else if (qq.kind === 'riddle') {
          h += riddleOptions(s).map(function (o) {
            return '<button class="sab-btn" style="display:block;width:100%;text-align:left;margin:6px 0" ' +
              'data-sab-act="qriddle" data-o="' + esc(o) + '">' + esc(o) + '</button>';
          }).join('') + (riddleWrong ? '<p class="tiny" style="color:var(--muted)">Not that one — the city\u2019s own telling below has it. Another go.</p>' : '');
        } else {
          h += '<p class="tiny" style="color:var(--muted)">This one is done out on the map — the scroll will close itself.</p>';
        }
        h += '</div>';
      } else {
        h += '<div class="sab-quest" style="border-style:dashed;opacity:.75"><div class="who">the town square</div>' +
          '<p>No scroll here right now. The folk bring requests as the world turns.</p></div>';
      }
      if (q.seen) h += '<div class="sab-cfact">' + esc(s.fact) + '</div>';
      h += '</div>';
      return h;
    }
    function paintCity() {
      var hostEl = D.getElementById('sab-ovhost');
      var stage = D.getElementById('sab-stage');
      var open = !!city;
      hostEl.innerHTML = open ? cityHTML(city) : (overlay ? hostEl.innerHTML : '');
      if (open) { var f = hostEl.querySelector('.sab-btn'); if (f) f.focus(); }
      if (!open && overlay) showOverlay(overlay);
    }

    /* ---- THE VIDYA PANEL: the tech tree, two doors an era ---- */
    var techOpen = false;
    function techHTML() {
      var rows = TECHS.map(function (t) {
        if (t.era > G.era) return '';
        var have = !!G.tech[t.id], c = costOf(t.cost, 'tech');
        return '<div class="sab-work' + (have ? ' built' : ' now') + '"><i>' + (have ? '✓' : '?') + '</i>' +
          '<span><b>' + esc(t.name) + '</b> · <span class="tiny" style="color:var(--muted)">' + esc(t.what) + '</span></span>' +
          '<span style="flex:1"></span>' +
          (have ? '' : '<button class="sab-btn" data-sab-act="tech" data-t="' + t.id + '"' +
            (canPay(c) ? '' : ' disabled') + '>' + costStr(c) + '</button>') +
          '</div>';
      }).join('');
      return '<div class="sab-city" role="dialog" aria-label="Vidya — what the age knows">' +
        '<div class="chead"><h3>Vidya</h3><span class="mono">what the age knows how to do</span>' +
        '<span style="flex:1"></span><button class="sab-btn" data-sab-act="techclose">Back to the map</button></div>' +
        '<div class="sab-works">' + rows + '</div>' +
        '<p class="tiny" style="color:var(--muted)">Two doors open in every age, and the coins rarely stretch to both at once. The order you choose is the strategy.</p>' +
        '</div>';
    }
    function paintTech() {
      D.getElementById('sab-ovhost').innerHTML = techOpen ? techHTML() : '';
      if (techOpen) { var f = D.querySelector('#sab-ovhost .sab-btn'); if (f) f.focus(); }
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
      if (name === 'city' && !q.zzz) { city = sel; riddleWrong = false; touch(sel); paintCity(); return; }
      if (name === 'grow' && !q.zzz && q.lv < T.maxLevel) {
        var cost = T.growCost[q.lv];
        if (G.res.anna < cost) return say('Not enough anna yet — the fields are still filling.', '');
        G.res.anna -= cost; q.lv++; G.score += 10; touch(sel);
        say(s.name + ' grows. The lamps burn a little brighter.', 'warm');
      }
      if (name === 'route') {
        if (!canPay(costOf({ kala: T.routeCost }, 'route'))) return say('Routes take kala — grow a craft town, or wait for the workshops.', '');
        targeting = true; say('Choose where the road from ' + s.name + ' should go.', '');
      }
      if (name === 'utsav' && G.utsav <= 0) {
        if (G.res.anna < T.utsavCost.anna || G.res.kala < T.utsavCost.kala)
          return say('An utsav needs both grain and craft — the whole village brings something.', '');
        G.res.anna -= T.utsavCost.anna; G.res.kala -= T.utsavCost.kala;
        G.res.katha += T.utsavKatha; G.utsav = T.utsavCd; G.score += 15; touch(sel);
        SITES.forEach(function (t) { var w = G.sites[t.id]; if (w.fade >= 0) { w.fade = -1; w.idle = 0; } });
        say('Utsav at ' + s.name + '! Songs carry far — the mist pulls back from every fading lamp.', 'warm');
        var uq = G.quests[sel];
        if (uq && uq.kind === 'utsav') finishQuest(sel, 'The whole town danced.');
      }
      if (name === 'wake' && q.zzz) {
        if (!connected(sel)) return say(s.name + ' needs a road first — a story has to travel to be heard.', '');
        if (G.res.katha < T.wakeCost) return say('Not enough katha — stories are earned by helping and holding utsavs.', '');
        G.res.katha -= T.wakeCost; q.zzz = false; q.fade = -1; q.idle = 0; q.neg = 0; G.score += 25;
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
      var rc = costOf({ kala: T.routeCost }, 'route');
      if (!canPay(rc)) { targeting = false; return say('Not enough kala for this road.', ''); }
      pay(rc); G.routes.push([a, b]); G.score += 15;
      targeting = false; touch(a); touch(b);
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
      if (pause || overlay || city || techOpen || G.won || dead) return;   /* inside a city or the vidya panel, time waits */
      G.t++;
      if (G.utsav > 0) G.utsav--;

      /* yields — every rule lives in yieldOf, so the HUD, the city screen and the
         tests all read the same arithmetic */
      SITES.forEach(function (s) {
        if (!inEra(s)) return;
        var y = yieldOf(s);
        if (y) { G.res.anna += y.anna; G.res.kala += y.kala; G.res.katha += y.katha; }
      });

      /* NEGLECT. A city nobody has touched in a while turns dusty and brings in half —
         even a connected one. Roads keep the mist out; only attention keeps a town
         proud. Monuments and the capital are exempt: some places are remembered for
         you. The stepwell stretches the patience threefold. */
      SITES.forEach(function (s) {
        if (!inEra(s)) return;
        var q = G.sites[s.id];
        if (q.zzz) return;
        q.neg++;
        if (q.neg === negLimit(s.id) && !q.mon && G.capital !== s.id)
          say(s.name + ' is gathering dust — visit it, grow it, or give it work.', 'mist');
      });

      /* QUARRELS. Two towns that share a road fall out over something real — water,
         tolls, stall-space, an old promise. No armies and no winners: while it stands
         the road between them carries nothing, and the player is the panchayat. */
      if (!G.disp && G.t - G.lastd >= T.dispEvery) {
        var pairs = G.routes.filter(function (r) {
          return awake(r[0]) && awake(r[1]) && G.capital !== r[0] && G.capital !== r[1];
        });
        if (pairs.length) {
          var pr = pairs[(G.t * 11) % pairs.length];
          var tpl = DATA.disputes[(G.t * 7) % DATA.disputes.length];
          G.disp = { a: pr[0], b: pr[1], over: tpl.over, fix: tpl.fix, left: T.dispGrace };
          G.lastd = G.t;
          say(byId[pr[0]].name + ' and ' + byId[pr[1]].name + ' have quarrelled over ' + tpl.over +
              ' — enter either town and sit the panchayat.', 'mist');
        }
      }
      if (G.disp) {
        G.disp.left--;
        if (G.disp.left <= 0) {
          [G.disp.a, G.disp.b].forEach(function (id) {
            var q = G.sites[id]; if (!q.zzz && q.fade < 0) q.fade = 0;
          });
          say('The quarrel between ' + byId[G.disp.a].name + ' and ' + byId[G.disp.b].name +
              ' hardens, and the mist likes nothing better.', 'mist');
          G.lastd = G.t; G.disp = null;
        }
      }

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

      spawnQuest();
      checkQuests();

      if (G.t % 5 === 0) save(G);
      paintHud(); SITES.forEach(paintSite); paintGuide();
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
        if (a === 'leave') { city = null; riddleWrong = false; quiz = null; paintCity(); paintAll(); return; }
        if (a === 'peace' && city && inDispute(city)) {
          var di = Number(actEl.getAttribute('data-i'));
          if (di >= 0) { var fx = costOf(G.disp.fix[di].cost, 'peace'); if (!canPay(fx)) return; pay(fx); }
          var pa = byId[G.disp.a].name, pb = byId[G.disp.b].name;
          touch(G.disp.a); touch(G.disp.b);
          G.disp = null; G.lastd = G.t;
          G.res.katha += T.reward.peace; G.score += 40;
          say('The panchayat rises: ' + pa + ' and ' + pb + ' shake on it. Peace pays. +' + T.reward.peace + ' \ud83d\udcdc', 'warm');
          paintCity(); paintAll(); return;
        }
        if (a === 'build' && city) {
          var bid = actEl.getAttribute('data-b'), bd = BLD[bid], qy = G.sites[city];
          if (!bd || qy.bld[bid] || bd.era > G.era) return;
          var bc = costOf(bd.cost, 'building');
          if (!canPay(bc)) return;
          pay(bc); qy.bld[bid] = true; touch(city); G.score += 15;
          say(bd.name + ' raised in ' + byId[city].name + '.', 'warm');
          paintCity(); paintAll(); return;
        }
        if (a === 'mon' && city) {
          var qm = G.sites[city], sm = byId[city];
          if (qm.mon || qm.lv < 3) return;
          var mc = costOf(T.monCost[sm.era], 'monument');
          if (!canPay(mc)) return;
          pay(mc); qm.mon = true; touch(city); G.score += 60; G.res.katha += 10;
          say(sm.works[2].charAt(0).toUpperCase() + sm.works[2].slice(1) + ' — ' + sm.name +
              ' has raised its monument. Stone remembers.', 'warm');
          paintCity(); paintAll(); return;
        }
        if (a === 'cap' && city) {
          if (!canPay(T.capCost)) return;
          pay(T.capCost);
          var was = G.capital; G.capital = city; touch(city); G.score += 25;
          say(was
            ? 'The capital moves from ' + byId[was].name + ' to ' + byId[city].name + ', as it once moved to Pataliputra.'
            : byId[city].name + ' is the capital now. The realm has a heart.', 'warm');
          paintCity(); paintAll(); return;
        }
        if (a === 'quizstart' && city) {
          var pool = G.tech.script
            ? SITES.filter(function (x) { return G.sites[x.id].seen && x.ask; })
            : SITES.filter(function (x) { return x.id === city && G.sites[x.id].seen && x.ask; });
          if (!pool.length) return;
          var pick2 = pool[(G.quizN + G.t) % pool.length];
          quiz = { at: city, of: pick2.id }; riddleWrong = false; G.quizN++;
          paintCity(); return;
        }
        if (a === 'quiz' && city && quiz) {
          var po = actEl.getAttribute('data-o'), qs = byId[quiz.of];
          if (po === qs.ask.o[0]) {
            var payq = quiz.of === city ? T.quizPay : T.quizFarPay;
            G.res.katha += payq; G.score += 10; G.quizAt[city] = G.t; touch(city);
            say('Well answered — +' + payq + ' \ud83d\udcdc from the gurukul of ' + byId[city].name + '.', 'warm');
            quiz = null; riddleWrong = false;
          } else riddleWrong = true;
          paintCity(); paintAll(); return;
        }
        if (a === 'qcarry' && city) {
          if (G.res.kala >= T.eventAsk && connected(city)) {
            G.res.kala -= T.eventAsk; finishQuest(city, 'The carts roll in.');
            paintCity(); paintAll();
          }
          return;
        }
        if (a === 'qutsav' && city) {
          var keep = sel; sel = city; act('utsav'); sel = keep;
          paintCity(); return;
        }
        if (a === 'qriddle' && city) {
          var pick = actEl.getAttribute('data-o'), site = byId[city];
          if (pick === site.ask.o[0]) { riddleWrong = false; finishQuest(city, 'Well answered!'); }
          else { riddleWrong = true; }
          paintCity(); paintAll(); return;
        }
        if (a === 'tech') {
          var tid = actEl.getAttribute('data-t');
          var td = null; TECHS.forEach(function (t) { if (t.id === tid) td = t; });
          if (!td || G.tech[tid] || td.era > G.era) return;
          var tc = costOf(td.cost, 'tech');
          if (!canPay(tc)) return;
          pay(tc); G.tech[tid] = true; G.score += 30;
          say(td.name + '! ' + td.what, 'warm');
          paintTech(); paintAll(); return;
        }
        if (a === 'techclose') { techOpen = false; paintTech(); paintAll(); return; }
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
    /* Listens in the CAPTURE phase, because the app shell also listens on the document
       and its Escape means "go home" — attached before this engine existed, so bubble
       order cannot be won. Capture runs first; every key the game actually consumes is
       stopped there, and every key it does not falls through to the shell untouched.
       So Esc closes the city, then cancels a route, then clears the selection — and
       only with nothing left open does it hand you back to the app. A door, then a
       door, then the front door. */
    function onKey(e) {
      if (dead) return;
      var eat = function () { e.preventDefault(); e.stopPropagation(); };
      if (city) {
        if (e.key === 'Escape') { eat(); city = null; riddleWrong = false; quiz = null; paintCity(); paintAll(); }
        return;   /* inside the city, buttons are tabbable and Esc is the door */
      }
      if (techOpen) {
        if (e.key === 'Escape') { eat(); techOpen = false; paintTech(); paintAll(); }
        return;
      }
      if (overlay) { if (e.key === 'Enter' || e.key === 'Escape') { eat(); var f = D.querySelector('#sab-ovhost [data-sab-act]'); if (f) f.click(); } return; }
      var k = e.key;
      if (k === 'p' || k === 'P') { eat(); return togglePause(); }
      if (k === 'h' || k === 'H') { eat(); return helpEvent(); }
      if (k === 'Escape') {
        if (!targeting && !sel) return;            /* nothing open: the shell may take it home */
        eat(); targeting = false; sel = null; paintAll(); return;
      }
      if (k === 'Enter' || k === ' ') {
        if (kbd) { eat();
          if (targeting) return tryRoute(kbd);
          sel = kbd; paintAll(); }
        return;
      }
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'Tab' && !e.shiftKey) { eat(); step(1); return; }
      if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'Tab') { eat(); step(-1); return; }
      if (sel && k >= '1' && k <= '4') {
        eat();
        var q = G.sites[sel];
        if (q.zzz) { if (k === '1') act('wake'); return; }
        if (k === '1') act('grow'); if (k === '2') act('route'); if (k === '3') act('utsav');
        if (k === '4') act('city');
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
    /* saves from before the quest scrolls simply gain empty ones */
    G.quests = G.quests || {}; G.qdone = G.qdone || 0; G.lastq = G.lastq || 0;
    G.tech = G.tech || {}; G.capital = G.capital || null; G.disp = G.disp || null;
    G.lastd = G.lastd || 0; G.quizAt = G.quizAt || {}; G.quizN = G.quizN || 0;
    SITES.forEach(function (x) { var q = G.sites[x.id]; if (q) { q.bld = q.bld || {}; q.mon = !!q.mon; q.neg = q.neg || 0; } });
    shell();
    if (saved && saved === G) {
      say('Welcome back. The lamps kept burning while you were away.', 'warm');
    } else {
      showOverlay('<h3>Sabhyata — the first city</h3>' +
        '<p>Dholavira is awake, and the rest of India sleeps under Vismriti, the Forgetting. ' +
        'Grow your city, build roads, and wake the land one lamp at a time. ' +
        'Step <i>into</i> a city to build granaries, gurukuls and monuments, settle quarrels, raise a capital and take quest scrolls. ' +
        'Nothing here is ever conquered — only reached.</p>' +
        '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Light the first lamp</button></div>');
    }
    var advBtn = D.getElementById('sab-adv');
    advBtn.addEventListener('click', advance);
    D.getElementById('sab-tech').addEventListener('click', function () {
      techOpen = !techOpen; if (techOpen) { city = null; quiz = null; } paintTech(); });
    D.getElementById('sab-pause').addEventListener('click', togglePause);
    host.addEventListener('click', onClick);
    /* keys live on the document: focus often rests on the page body, and a game whose
       keyboard only works after a click is a game with no keyboard (house rule). The
       teardown removes it, and `dead` guards the gap. */
    D.addEventListener('keydown', onKey, true);
    timer = setInterval(tick, TICK_MS);

    return function teardown() {
      dead = true;
      clearInterval(timer);
      if (G && !G.won) save(G);
      host.removeEventListener('click', onClick);
      D.removeEventListener('keydown', onKey, true);
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
