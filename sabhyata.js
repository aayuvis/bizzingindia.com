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

  /* v2: jobs, fog, explorers and kingdoms changed the save's meaning — a clean
     start at Dholavira is kinder than a half-migrated world (founder's call). */
  var SAVE_KEY = 'india.sabhyata.v2';
  /* A TURN IS THREE SECONDS. At one second the coins piled up faster than a child
     could decide what they meant — the numbers moved and the game did not. Every
     per-turn constant below reads as turns, so slowing the clock slowed the whole
     world by the same breath. */
  var TICK_MS = 3000;

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
    quizCd:     25,                 /* seconds between questions per city */

    eat:        0.25,               /* anna per citizen per turn — the balance */
    raidEvery:  45,                 /* seconds between raids, somewhere */
    raidBase:   6,                  /* what an unwatched raid carries off, +4 per era */
    raidGuard:  2,                  /* rakshaks needed to fend a raid off entirely */
    heroAt:     3,                  /* city level where a great one may rise */
    exploreCost: 20,                /* anna — provisions for the road */
    exploreSpeed: 55,               /* map-units an explorer walks each turn */
    kingdomEra: 1,                  /* kingdoms begin with the janapadas */
    kingdomMin: 3                   /* cities (incl. the seat) a crown needs connected */
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
    '.sab-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border:0;border-radius:999px;background:var(--card);box-shadow:0 1px 2px rgba(30,20,64,.07),0 3px 10px rgba(30,20,64,.06);font-weight:800;font-size:14px}',
    '.sab-chip small{font-weight:600;color:var(--muted)}',
    '.sab-btn{min-height:44px;padding:8px 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--text);font:700 14px var(--body,system-ui);cursor:pointer}',
    '.sab-btn:disabled{opacity:.45;cursor:default}',
    '.sab-btn.go{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.sab-btn:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',

    '.sab-stage{position:relative;background:var(--ground2);border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden}',
    '.sab-stage svg{display:block;width:100%;height:auto;max-height:64vh}',
    '.sab-terr{fill:var(--mist);stroke:var(--line);stroke-width:1;pointer-events:none}',
    '.sab-river{fill:none;stroke:#7ba6c9;stroke-width:4.5;stroke-linecap:round;opacity:.6;pointer-events:none}',

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

    /* THE VERB TILES. The action row was a strip of long bordered buttons — "long
       banner actions" was the exact complaint. Verbs are square-ish tiles now: a
       stroke icon in a soft accent chip, the word, the cost — hover lifts, press
       settles, a marigold badge counts what waits inside. */
    '.sab-sheet{display:grid;grid-template-columns:repeat(auto-fill,minmax(82px,1fr));gap:8px;align-items:stretch}',
    '.sab-shead{grid-column:1/-1;display:flex;align-items:baseline;gap:8px;margin:2px 2px -2px}',
    '.sab-shead b{font:800 17px/1.1 var(--display,Georgia,serif)}',
    '.sab-shead span{font-size:12px;color:var(--muted);font-weight:600}',
    '.sab-tile{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;' +
      'padding:8px 6px 7px;border:0;border-radius:14px;cursor:pointer;color:var(--text);' +
      'background:linear-gradient(165deg,var(--card),var(--card2,var(--card)));' +
      'box-shadow:0 1px 2px rgba(30,20,64,.06),0 6px 18px rgba(30,20,64,.07);' +
      'font:700 12px/1.2 var(--body,system-ui);transition:transform .15s,box-shadow .15s}',
    '.sab-tile:hover{transform:translateY(-2px);box-shadow:0 4px 8px rgba(30,20,64,.08),0 12px 26px rgba(30,20,64,.10)}',
    '.sab-tile:active{transform:scale(.97)}',
    '.sab-tile:disabled{opacity:.4;cursor:default;transform:none}',
    '.sab-tile:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.sab-tile.go{background:linear-gradient(165deg,var(--accent),color-mix(in srgb,var(--accent) 78%,#000 8%));color:#fff}',
    '.sab-tile.go .sab-tico{background:rgba(255,255,255,.18);color:#fff}',
    '.sab-tile .cost{font-size:10.5px;font-weight:600;color:inherit;opacity:.75}',
    '.sab-tico{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;flex:none;' +
      'background:var(--accent-soft,rgba(91,63,214,.1));color:var(--accent)}',
    '.sab-badge{position:absolute;top:-6px;right:-6px;min-width:21px;height:21px;padding:0 5px;border-radius:999px;' +
      'background:var(--accent2);color:#fff;font:800 12px/21px var(--body,system-ui);border:2px solid var(--card);box-shadow:0 2px 6px rgba(0,0,0,.18)}',
    '.sab-badge.hot{background:var(--accent3)}',
    '@keyframes sabflash{0%,100%{box-shadow:0 4px 14px rgba(30,20,64,.06)}35%{box-shadow:0 0 0 4px color-mix(in srgb,var(--accent2) 55%,transparent),0 4px 14px rgba(30,20,64,.06)}}',
    '.sab-flash{animation:sabflash 1s ease 2}',

    '.sab-over{position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;background:color-mix(in srgb,var(--ground) 82%,transparent);padding:18px;z-index:4;overflow:auto}',
    '.sab-over .sab-card{margin:auto}',
    '.sab-card{max-width:430px;background:var(--card);border:0;border-radius:22px;padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.25)}',
    '.sab-card h3{margin:0 0 8px;font:800 20px/1.2 var(--display,Georgia,serif)}',
    '.sab-card p{margin:0 0 12px;font-size:15px;line-height:1.55}',
    '.sab-card .row{display:flex;gap:8px;flex-wrap:wrap}',

    '.sab-help{font-size:12.5px;color:var(--muted)}',
    '.sab-guide{margin:0;font-size:13.5px;font-weight:700;color:var(--text2,var(--text));background:color-mix(in srgb,var(--card) 72%,transparent);border:0;border-radius:14px;padding:8px 12px;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--accent) 16%,transparent)}',
    '.sab-guide b{color:var(--accent)}',

    /* the quest scroll on the map: a small marigold badge riding the lamp */
    '.sab-qb circle{fill:var(--accent2);stroke:#fff;stroke-width:2}',
    '.sab-qb text{font:800 15px var(--body,system-ui);fill:#fff;stroke:none;text-anchor:middle}',
    '.sab-db circle{fill:var(--accent3);stroke:#fff;stroke-width:2}',
    '.sab-db text{font:800 12px var(--body,system-ui);fill:#fff;stroke:none;text-anchor:middle}',
    '.sab-cb circle{fill:var(--accent);stroke:#fff;stroke-width:2}',
    '.sab-cb text{font:800 12px var(--body,system-ui);fill:#fff;stroke:none;text-anchor:middle}',

    /* THE CITY, FROM INSIDE — a full-stage panel, not a small modal */
    '.sab-city{background:var(--card);border:0;border-radius:22px;padding:16px 16px 20px;box-shadow:0 2px 6px rgba(30,20,64,.05),0 14px 40px rgba(30,20,64,.08)}',
    '.sab-city .chead{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}',
    '.sab-city h3{margin:0;font:800 24px/1.1 var(--display,Georgia,serif)}',
    '.sab-city .mono{font-size:11.5px;color:var(--muted);font-weight:700;letter-spacing:.08em;text-transform:uppercase}',
    '.sab-works{display:flex;flex-direction:column;gap:6px;margin:12px 0}',
    '.sab-work{display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:10px 13px;border:0;border-radius:16px;background:var(--card2,var(--card));box-shadow:0 1px 2px rgba(30,20,64,.05),0 4px 14px rgba(30,20,64,.06);font-size:14.5px;opacity:.5}',
    '.sab-work.built{opacity:1;font-weight:700}',
    '.sab-work.now{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft,rgba(0,0,0,.05))}',
    '.sab-work i{font-style:normal;width:22px;height:22px;border-radius:50%;border:2px solid var(--line);display:inline-flex;align-items:center;justify-content:center;font-size:12px;flex:none}',
    /* the praja: four compact tiles, not four banners — icon, name, a count flanked
       by round +/- , the explainer as a whisper underneath */
    '.sab-jobs{display:grid;grid-template-columns:repeat(auto-fit,minmax(122px,1fr));gap:8px;margin:8px 0}',
    '.sab-job{display:flex;flex-direction:column;gap:4px;align-items:center;text-align:center;padding:9px 8px;border-radius:14px;' +
      'background:linear-gradient(165deg,var(--card),var(--card2,var(--card)));box-shadow:0 1px 2px rgba(30,20,64,.06),0 6px 18px rgba(30,20,64,.07)}',
    '.sab-job b{font:800 13.5px var(--body,system-ui)}',
    '.sab-job .row2{display:flex;align-items:center;gap:10px}',
    '.sab-job .n{font:800 20px var(--display,Georgia,serif);min-width:26px}',
    '.sab-job .pm{width:44px;height:44px;border-radius:50%;border:0;background:var(--accent-soft,rgba(91,63,214,.1));color:var(--accent);font:800 20px/1 var(--body,system-ui);cursor:pointer;box-shadow:0 1px 3px rgba(30,20,64,.1)}',
    '.sab-job .pm:disabled{opacity:.35;cursor:default}',
    '.sab-job .what{font-size:11px;color:var(--muted);line-height:1.35}',
    '.sab-work.built i{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.sab-quest{background:linear-gradient(165deg,var(--card),color-mix(in srgb,var(--accent2) 7%,var(--card)));border:0;border-left:4px solid var(--accent2);border-radius:16px;padding:12px 14px;margin:6px 0;box-shadow:0 4px 14px rgba(30,20,64,.06)}',
    '.sab-quest .who{font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent2)}',
    '.sab-quest p{margin:6px 0 10px;font-size:15px;line-height:1.5}',
    '.sab-cfact{font-size:14px;line-height:1.55;color:var(--text2,var(--text));background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:12px;margin:6px 0}',
    '.sab-hero{width:100%;aspect-ratio:3/1.35;object-fit:cover;border-radius:var(--radius-lg);border:1px solid var(--line);margin:10px 0 2px;display:block}',
    '.sab-hero.dim{filter:grayscale(.85) sepia(.15) brightness(.92)}',
    '.sab-herocap{font-size:12px;color:var(--muted);margin:4px 0 8px}',
    '.sab-vthumb{width:112px;height:75px;object-fit:cover;border-radius:10px;border:1px solid var(--line);flex:none}',
    '.sab-cardart{width:100%;max-height:150px;object-fit:cover;border-radius:14px;margin:0 0 10px;display:block}',
    /* DESKTOP FIT. On a monitor the HUD, the action row, the map and the guide should
       share one screen without the page scrolling — the map gives a little height and
       the paintings stop being posters. Phones keep the tall map. */
    '@media (min-width: 900px){' +
      '.sab-wrap{gap:8px}' +
      '.sab-stage svg{max-height:44vh}' +
      '.sab-hero{max-height:180px;aspect-ratio:auto}' +
      '.sab-cardart{max-height:170px;object-fit:cover}' +
      '.sab-vthumb{width:96px;height:64px}' +
    '}',
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
                                                bld: {}, mon: false, neg: 0, jobs: null, hero: null,
                                                found: s.id === 'dholavira' }; });
      st.dholavira.seen = true;
      return { era: 0, res: { anna: T.startRes.anna, kala: T.startRes.kala, katha: T.startRes.katha },
               sites: st, routes: [], t: 0, utsav: 0, ev: null, score: 0, won: false,
               quests: {}, qdone: 0, lastq: 0,
               tech: {}, capital: null, disp: null, lastd: 0, quizAt: {}, quizN: 0,
               kingdoms: {}, lastraid: 0, explorers: [] };
    }

    /* ---- rules helpers ---- */
    function inEra(s) { return s.era <= G.era; }
    function found(id) { var q = G.sites[id]; return q && q.found; }
    function onMap(s) { return inEra(s) && found(s.id); }
    function hiddenSites() { return SITES.filter(function (x) { return inEra(x) && !found(x.id); }); }
    function connected(id) {
      return G.routes.some(function (r) { return r[0] === id || r[1] === id; });
    }
    function awake(id) { var q = G.sites[id]; return q && !q.zzz; }
    function routed(a, b) {
      return G.routes.some(function (r) { return (r[0] === a && r[1] === b) || (r[0] === b && r[1] === a); });
    }
    function eraDone() {
      return SITES.every(function (s) { return !inEra(s) || (found(s.id) && awake(s.id)); });
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

    /* THE PAINTINGS (tools/gen-sabhyata-art.py). Each city's painting shows it at its
       height with its monument at the centre — and the game shows it DESATURATED until
       the monument is raised. The same picture, remembered into colour: the whole game
       in one CSS filter. Art is optional by construction: no manifest entry, no img. */
    /* stroke icons: the app's own IND_ICON set where it fits, plus a few drawn for
       the game in the identical idiom (24-box, 1.7 stroke, round caps) */
    var SAB_PATHS = {
      wheat:  '<path d="M12 21V8M12 8c-3 0-5-2-5-5 3 0 5 2 5 5zM12 8c3 0 5-2 5-5-3 0-5 2-5 5zM12 13c-3 0-5-2-5-5 3 0 5 2 5 5zM12 13c3 0 5-2 5-5-3 0-5 2-5 5z"/>',
      hammer: '<path d="M14 4l6 6-2 2-6-6zM12 6L4 14l3 3 8-8M6.5 16.5L4 21"/>',
      scroll: '<path d="M6 4h10a2 2 0 012 2v12a2 2 0 002 2H8a2 2 0 01-2-2V4zM6 4a2 2 0 00-2 2v2h4M9 9h6M9 13h6"/>',
      shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
      peace:  '<path d="M7 12l3 3 7-7M4 15c2 4 5 6 8 6s6-2 8-6"/>',
      road:   '<path d="M4 20C8 14 16 10 20 4M9 6l2 2M14 17l2 2"/>',
      crown:  '<path d="M4 17l1-9 4.5 4L12 5l2.5 7L19 8l1 9zM4 20h16"/>'
    };
    function ic(name, size) {
      if (SAB_PATHS[name])
        return '<svg viewBox="0 0 24 24" width="' + (size || 22) + '" height="' + (size || 22) +
          '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          SAB_PATHS[name] + '</svg>';
      return W.IND_ICON ? W.IND_ICON(name, size || 22) : '';
    }

    /* what waits inside a city — the number on the Enter tile, and the in-city nav */
    function cityJobsWaiting(id) {
      var out = [];
      if (inDispute(id)) out.push({ act: 'cjump', t: 'sab-sec-quarrel', icon: 'peace', name: 'Panchayat', hot: true });
      if (G.quests[id]) out.push({ act: 'cjump', t: 'sab-sec-quest', icon: 'scroll', name: 'Quest' });
      var q = G.sites[id];
      if (q && !q.zzz) {
        if (q.lv >= 3 && !q.mon && canPay(costOf(T.monCost[byId[id].era], 'monument')))
          out.push({ act: 'cjump', t: 'sab-sec-works', icon: 'temple', name: 'Monument' });
        if (q.bld.gurukul && (G.quizAt[id] || -999) + T.quizCd - G.t <= 0)
          out.push({ act: 'cjump', t: 'sab-sec-guru', icon: 'book', name: 'Teacher' });
        if (q.hero) out.push({ act: 'cjump', t: 'sab-sec-hero', icon: 'star', name: 'Great one' });
      }
      return out;
    }

    function artOf(id) {
      var m = W.IND_SABHYATA_ART || [];
      return m.indexOf(id) >= 0 ? 'art/sabhyata/' + id + '.jpg' : null;
    }
    /* THE APP'S OWN ART, REUSED (the founder's note: reuse what is already here).
       Mithu the storyteller opens the game and takes the bow, Vismriti itself appears
       when the mist takes a town, the motif set dresses the kingdom and hero cards,
       and the icon glyphs replace loose emoji where a fit exists. All guarded — the
       game renders fine without any of them, same as every Mela engine. */
    function mascot(kind, mood, size) {
      var fn = kind === 'mithu' ? W.MITHU : kind === 'vismriti' ? W.VISMRITI : W.GATTU;
      if (!fn) return '';
      return '<div style="width:' + size + 'px;margin:0 auto 6px">' + fn(mood) + '</div>';
    }
    function motif(name, size) {
      return (W.IND_MOTIF && W.IND_MOTIF[name])
        ? '<span style="display:inline-block;width:' + size + 'px;vertical-align:middle">' + W.IND_MOTIF[name] + '</span> ' : '';
    }
    function glyph(name, fallback) {
      return W.IND_ICON ? W.IND_ICON(name, 16) : fallback;
    }

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

    /* ================================================================
       THE PRAJA. A city is its people: 2 + 2·level of them (+1 with a
       granary), each with a job the player allocates — kisan, karigar,
       kathakar, rakshak. Workers in the city's own speciality count
       double (Lothal breeds bead-makers), rakshaks earn nothing and are
       worth everything when the boar find the wheat, and every citizen
       eats. Production minus appetite is the whole balance of the game.
       ================================================================ */
    var JOB_OF_KIND = { kheti: 'kisan', shilpa: 'karigar', vidya: 'kathakar' };
    function popOf(id) {
      var q = G.sites[id];
      return 2 + q.lv * 2 + (q.bld.granary ? 1 : 0);
    }
    /* default split, and the top-up rule when the town grows: new hands farm first —
       which is also the deadlock guarantee: kisan exist from the first minute */
    function jobsOf(id) {
      var q = G.sites[id], x = byId[id], pop = popOf(id);
      if (!q.jobs) {
        q.jobs = { kisan: 2, karigar: 0, kathakar: 1, rakshak: 0 };
        q.jobs[JOB_OF_KIND[x.kind]] += pop - 3 > 0 ? 1 : 0;
      }
      var total = q.jobs.kisan + q.jobs.karigar + q.jobs.kathakar + q.jobs.rakshak;
      if (total < pop) q.jobs.kisan += pop - total;          /* newcomers farm */
      while (total > pop) {                                   /* shrink fairly */
        var big = ['kisan', 'karigar', 'kathakar', 'rakshak'].sort(function (a, b) { return q.jobs[b] - q.jobs[a]; })[0];
        q.jobs[big]--; total--;
      }
      return q.jobs;
    }
    function inKingdomOf(id) {
      var seats = Object.keys(G.kingdoms);
      for (var i = 0; i < seats.length; i++) {
        if (seats[i] === id || reach(seats[i]).indexOf(id) >= 0) return seats[i];
      }
      return null;
    }
    /* everything a road can reach from here — a kingdom is a connected realm */
    function reach(from) {
      var seen = {}, queue = [from];
      while (queue.length) {
        var at = queue.pop();
        G.routes.forEach(function (r) {
          var next = r[0] === at ? r[1] : r[1] === at ? r[0] : null;
          if (next && !seen[next]) { seen[next] = true; queue.push(next); }
        });
      }
      return Object.keys(seen);
    }

    /* ---- what a city actually brings in each turn, all rules in one place ---- */
    function yieldOf(x) {
      var q = G.sites[x.id];
      if (q.zzz || q.fade >= 0) return null;
      var conn = connected(x.id) && !inDispute(x.id);
      var out = { anna: 0, kala: 0, katha: 0 };
      var j = jobsOf(x.id), spec = JOB_OF_KIND[x.kind];
      out.anna += j.kisan * (spec === 'kisan' ? 2 : 1);
      out.kala += j.karigar * (spec === 'karigar' ? 2 : 1);
      out.katha += j.kathakar * (spec === 'kathakar' ? 2 : 1);
      if (conn) ['anna', 'kala', 'katha'].forEach(function (k) { if (out[k]) out[k] += 1; });
      if (q.hero && !q.hero.gone) out[YIELD[x.kind]] += 2;
      if (inKingdomOf(x.id)) { out.anna += 1; out.kala += 1; out.katha += 1; }
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
      var sleeping = SITES.filter(function (x) { return onMap(x) && !awake(x.id); });
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
      var hero1 = SITES.filter(function (x) { var q2 = G.sites[x.id]; return inEra(x) && q2.hero && !q2.hero.used && !q2.hero.gone; })[0];
      if (hero1) return 'A great one waits in <b>' + esc(hero1.name) + '</b> — enter the city and ask for the deed.';
      var qid = Object.keys(G.quests)[0];
      if (qid) return 'A scroll waits at <b>' + esc(byId[qid].name) + '</b> — enter the city and take the quest.';
      var hid2 = hiddenSites();
      if (hid2.length && !G.explorers.length)
        return 'Somewhere out in the mist lies <b>' + (hid2.length === 1 ? 'one more place' : 'more of India') +
          '</b> — select a city and send an explorer (' + T.exploreCost + ' \ud83c\udf3e).';
      if (G.explorers.length) return 'Your explorer is out walking the mist — the fog opens where the lamp goes.';
      var zz = SITES.filter(function (x) { return onMap(x) && !awake(x.id); })[0];
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
        /* the rivers: smoothed polylines in the terrain layer — under the fog, over
           the wash, never interactive. A child who follows the Ganga finds Kashi. */
        '<g>' + (DATA.rivers || []).map(function (rv) {
          var d2 = 'M' + rv.p[0][0] + ' ' + rv.p[0][1];
          for (var ri = 1; ri < rv.p.length - 1; ri++) {
            var mx2 = (rv.p[ri][0] + rv.p[ri + 1][0]) / 2, my2 = (rv.p[ri][1] + rv.p[ri + 1][1]) / 2;
            d2 += ' Q' + rv.p[ri][0] + ' ' + rv.p[ri][1] + ' ' + mx2 + ' ' + my2;
          }
          var lp = rv.p[rv.p.length - 1];
          d2 += ' L' + lp[0] + ' ' + lp[1];
          return '<path class="sab-river" d="' + d2 + '"><title>' + esc(rv.n) + '</title></path>';
        }).join('') + '</g>' +
        /* THE FOG IS VISMRITI'S OWN. Undiscovered land sits under a grey veil with
           holes of clear light punched around every found place and every walking
           explorer — the world is revealed by going and looking, which is the whole
           point of the explorers. The mask is rebuilt each paint; twenty circles. */
        '<mask id="sabfog"><rect x="-200" y="-200" width="1400" height="1500" fill="#fff"/>' +
        '<g id="sab-fogholes"></g></mask>' +
        '<rect id="sab-fogrect" x="-200" y="-200" width="1400" height="1500" fill="#8d93a5" opacity=".62" ' +
          'mask="url(#sabfog)" pointer-events="none"/>' +
        '<g id="sab-routes">' + G.routes.map(routeSVG).join('') + '</g>' +
        '<g id="sab-explorers"></g>' +
        '<g id="sab-sites">' + SITES.map(siteSVG).join('') + '</g>' +
        '</svg>';
    }

    /* ================================================================
       ZOOM AND PAN. The board is a viewBox window onto the 1000x1100
       map: wheel or pinch to zoom (anchored under the pointer, the way
       maps behave), drag to pan, corner buttons and + - 0 for keyboards.
       A drag longer than a thumb-tremor swallows the click it ends with,
       so panning across a lamp does not select it.
       ================================================================ */
    var VZ = { x: 0, y: 0, w: 1000, h: 1100 };
    /* THE MAP OPENS ZOOMED TO YOUR WORLD, not to all of India — a fresh game is one
       lamp in the fog, and a whole-subcontinent view makes it a dot in a grey sea.
       Fit the found sites (plus a walking explorer) with generous margin; the whole
       map is one \u2302 away. */
    function fitFound() {
      var pts = SITES.filter(onMap).map(function (x) { return [x.x, x.y]; });
      G.explorers.forEach(function (ex) { pts.push([ex.x, ex.y]); });
      if (!pts.length) return;
      var xs = pts.map(function (q2) { return q2[0]; }), ys = pts.map(function (q2) { return q2[1]; });
      var cx = (Math.min.apply(0, xs) + Math.max.apply(0, xs)) / 2;
      var cy = (Math.min.apply(0, ys) + Math.max.apply(0, ys)) / 2;
      var span = Math.max(Math.max.apply(0, xs) - Math.min.apply(0, xs),
                          (Math.max.apply(0, ys) - Math.min.apply(0, ys)) / 1.1);
      VZ.w = Math.max(430, Math.min(1000, span + 340));
      VZ.h = VZ.w * 1.1;
      VZ.x = cx - VZ.w / 2; VZ.y = cy - VZ.h / 2;
      vzClamp(); vzApply();
    }
    var panning = null, swallowClick = false, pinch = null;
    function vzApply() {
      var svg = D.querySelector('#sab-stage svg');
      if (svg) svg.setAttribute('viewBox', VZ.x.toFixed(1) + ' ' + VZ.y.toFixed(1) + ' ' + VZ.w.toFixed(1) + ' ' + VZ.h.toFixed(1));
    }
    function vzClamp() {
      VZ.w = Math.max(240, Math.min(1000, VZ.w)); VZ.h = VZ.w * 1.1;
      VZ.x = Math.max(-60, Math.min(1060 - VZ.w, VZ.x));
      VZ.y = Math.max(-60, Math.min(1160 - VZ.h, VZ.y));
    }
    function vzPoint(e) {
      var svg = D.querySelector('#sab-stage svg'), r = svg.getBoundingClientRect();
      return { x: VZ.x + (e.clientX - r.left) / r.width * VZ.w,
               y: VZ.y + (e.clientY - r.top) / r.height * VZ.h };
    }
    function vzZoom(factor, at) {
      var w2 = Math.max(240, Math.min(1000, VZ.w * factor));
      var k = w2 / VZ.w;
      VZ.x = at.x - (at.x - VZ.x) * k;
      VZ.y = at.y - (at.y - VZ.y) * k;
      VZ.w = w2; vzClamp(); vzApply();
    }
    function onWheel(e) {
      e.preventDefault();
      vzZoom(e.deltaY > 0 ? 1.18 : 1 / 1.18, vzPoint(e));
    }
    function onPointerDown(e) {
      var stage = D.getElementById('sab-stage');
      if (!stage || !stage.contains(e.target)) return;
      if (pinch === null && panning === null) panning = { id: e.pointerId, cx: e.clientX, cy: e.clientY, moved: 0 };
      else if (panning && e.pointerId !== panning.id && !pinch) {
        pinch = { a: panning.id, b: e.pointerId, ax: panning.cx, ay: panning.cy, bx: e.clientX, by: e.clientY };
      }
    }
    function onPointerMove(e) {
      if (pinch) {
        if (e.pointerId === pinch.a) { pinch.ax = e.clientX; pinch.ay = e.clientY; }
        if (e.pointerId === pinch.b) { pinch.bx = e.clientX; pinch.by = e.clientY; }
        var d = Math.hypot(pinch.ax - pinch.bx, pinch.ay - pinch.by);
        if (pinch.d0 === undefined) { pinch.d0 = d; pinch.w0 = VZ.w; return; }
        if (d > 8) {
          var mid = vzPoint({ clientX: (pinch.ax + pinch.bx) / 2, clientY: (pinch.ay + pinch.by) / 2 });
          var w2 = Math.max(240, Math.min(1000, pinch.w0 * pinch.d0 / d));
          var k = w2 / VZ.w;
          VZ.x = mid.x - (mid.x - VZ.x) * k; VZ.y = mid.y - (mid.y - VZ.y) * k; VZ.w = w2;
          vzClamp(); vzApply(); swallowClick = true;
        }
        return;
      }
      if (!panning || e.pointerId !== panning.id) return;
      var svg = D.querySelector('#sab-stage svg'); if (!svg) return;
      var r = svg.getBoundingClientRect();
      var dx = (e.clientX - panning.cx) / r.width * VZ.w;
      var dy = (e.clientY - panning.cy) / r.height * VZ.h;
      panning.moved += Math.abs(e.clientX - panning.cx) + Math.abs(e.clientY - panning.cy);
      panning.cx = e.clientX; panning.cy = e.clientY;
      if (panning.moved > 8) {
        VZ.x -= dx; VZ.y -= dy; vzClamp(); vzApply();
        swallowClick = true;
      }
    }
    function onPointerUp(e) {
      if (pinch && (e.pointerId === pinch.a || e.pointerId === pinch.b)) pinch = null;
      if (panning && e.pointerId === panning.id) panning = null;
      if (!panning && !pinch) setTimeout(function () { swallowClick = false; }, 0);
    }

    function shell() {
      host.innerHTML = '<div class="sab-wrap" id="sabwrap">' +
        '<div class="sab-hud">' +
          '<div class="sab-era"><span id="sab-eradate"></span><b id="sab-eraname"></b></div>' +
          '<div class="sab-res" id="sab-res" aria-live="off"></div>' +
          '<div style="display:flex;gap:8px">' +
            '<button class="sab-btn go" id="sab-adv" hidden></button>' +
            '<button class="sab-btn" id="sab-tech">Vidya</button>' +
            '<button class="sab-btn" id="sab-restart" aria-label="Start again">\u21ba</button>' +
            '<button class="sab-btn" id="sab-pause" aria-pressed="false">Pause</button>' +
          '</div>' +
        '</div>' +
        '<div class="sab-sheet" id="sab-sheet" hidden></div>' +
        '<div id="sab-cityhost"></div>' +
        '<div class="sab-stage" id="sab-stage">' + board() +
          '<div style="position:absolute;right:10px;bottom:10px;display:flex;gap:6px;z-index:3">' +
          '<button class="sab-btn" data-sab-act="zin" aria-label="Zoom in">+</button>' +
          '<button class="sab-btn" data-sab-act="zout" aria-label="Zoom out">\u2212</button>' +
          '<button class="sab-btn" data-sab-act="zreset" aria-label="Whole map">\u2302</button></div>' +
          '<div id="sab-ovhost"></div></div>' +
        '<p class="sab-feed" id="sab-feed" aria-live="polite"></p>' +
        '<p class="sab-guide" id="sab-guide"></p>' +
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
      var net = { anna: 0, kala: 0, katha: 0 };
      SITES.forEach(function (x) {
        if (!inEra(x)) return;
        var y = yieldOf(x);
        if (y) { net.anna += y.anna; net.kala += y.kala; net.katha += y.katha; }
        if (!G.sites[x.id].zzz) net.anna -= popOf(x.id) * T.eat;
      });
      D.getElementById('sab-res').innerHTML = ['anna', 'kala', 'katha'].map(function (k) {
        var d = Math.round(net[k] * 10) / 10;
        return '<span class="sab-chip">' + ICON[k] + ' ' + Math.floor(G.res[k]) +
          ' <small>' + (d >= 0 ? '+' : '') + d + '/turn</small></span>';
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
      var q = G.sites[s.id], vis = onMap(s);
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
    function paintFog() {
      var holes = D.getElementById('sab-fogholes');
      if (!holes) return;
      var out = SITES.filter(onMap).map(function (x) {
        return '<circle cx="' + x.x + '" cy="' + x.y + '" r="120" fill="#000"/>';
      });
      /* a road is a corridor of clear light for its whole length — with holes only at
         the towns, the middle of every route drowned in grey and "the roads have
         disappeared". Lines AND lights, as designed. */
      G.routes.forEach(function (r) {
        var a = byId[r[0]], b2 = byId[r[1]];
        var mx = (a.x + b2.x) / 2, my = (a.y + b2.y) / 2 - 24;
        out.push('<path d="M' + a.x + ' ' + a.y + ' Q' + mx + ' ' + my + ' ' + b2.x + ' ' + b2.y +
          '" fill="none" stroke="#000" stroke-width="90" stroke-linecap="round"/>');
      });
      G.explorers.forEach(function (ex) {
        out.push('<circle cx="' + ex.x.toFixed(1) + '" cy="' + ex.y.toFixed(1) + '" r="80" fill="#000"/>');
      });
      holes.innerHTML = out.join('');
    }
    function paintExplorers() {
      var g = D.getElementById('sab-explorers');
      if (!g) return;
      g.innerHTML = G.explorers.map(function (ex) {
        return '<g style="transition:transform ' + (TICK_MS / 1000) + 's linear;transform:translate(' +
            ex.x.toFixed(1) + 'px,' + ex.y.toFixed(1) + 'px)">' +
          '<circle r="8" fill="var(--accent3)" stroke="#fff" stroke-width="2"/>' +
          '<circle r="3" cy="-10" fill="#ffd76e"/>' +
          '</g>';
      }).join('');
    }
    function paintRoutes() {
      var gEl = D.getElementById('sab-routes');
      if (gEl) gEl.innerHTML = G.routes.map(routeSVG).join('');
    }
    /* the tile helper: icon chip, word, cost — with an optional waiting-count badge */
    function tile(act, icon, name, cost, opts) {
      opts = opts || {};
      return '<button class="sab-tile' + (opts.go ? ' go' : '') + '" data-sab-act="' + act + '"' +
        (opts.attrs || '') + (opts.disabled ? ' disabled' : '') + '>' +
        (opts.badge ? '<span class="sab-badge' + (opts.hot ? ' hot' : '') + '">' + opts.badge + '</span>' : '') +
        '<span class="sab-tico">' + ic(icon, 24) + '</span>' +
        '<span>' + name + '</span>' +
        (cost ? '<span class="cost">' + cost + '</span>' : '') +
        '</button>';
    }

    function paintSheet() {
      var sh = D.getElementById('sab-sheet');
      if (!sh) return;

      /* IN THE CITY, THE ROW BECOMES THE CITY'S OWN NAV: the way back, and a tile
         for each thing waiting inside — the same list the Enter badge counted. */
      if (city) {
        var waits = cityJobsWaiting(city);
        sh.hidden = false;
        sh.innerHTML = '<div class="sab-shead"><b>' + esc(byId[city].name) + '</b><span>inside the city</span></div>' +
          tile('leave', 'back', 'Back to map', '', { go: true }) +
          waits.map(function (w2) {
            return tile(w2.act, w2.icon, w2.name, '', { attrs: ' data-t="' + w2.t + '"', badge: '!', hot: w2.hot });
          }).join('');
        return;
      }

      if (!sel) { sh.hidden = true; sh.innerHTML = ''; return; }
      var s = byId[sel], q = G.sites[sel];
      var b = [];
      b.push('<div class="sab-shead"><b>' + esc(s.name) + '</b><span>' +
        (q.zzz ? 'asleep under the mist'
               : ICON[YIELD[s.kind]] + ' level ' + q.lv +
                 (G.capital === sel ? ' · the capital' : '') +
                 (connected(sel) ? ' · on a route' : ' · alone') +
                 (dusty(sel) ? ' · dusty' : '') +
                 (inDispute(sel) ? ' · in a quarrel' : '')) +
        (targeting ? ' — now choose the other end of the road' : '') + '</span></div>');
      if (q.zzz) {
        /* the dead end the explorer walked into: a found, sleeping city offered only
           Wake — which needs a road — and no way to build one. Roads are undirected,
           so the sleeping town can start its own: Reach it, then Wake it. */
        b.push(tile('route', 'road', 'Reach it', costStr(costOf({ kala: T.routeCost }, 'route'))));
        b.push(tile('wake', 'sun', 'Wake', connected(sel) ? T.wakeCost + ' \ud83d\udcdc' : 'needs a road',
          { go: true, disabled: !connected(sel) }));
      } else {
        if (q.lv < T.maxLevel) b.push(tile('grow', 'tree', 'Grow', T.growCost[q.lv] + ' \ud83c\udf3e'));
        b.push(tile('route', 'road', 'Route', costStr(costOf({ kala: T.routeCost }, 'route'))));
        b.push(tile('utsav', 'lamp', 'Utsav',
          G.utsav > 0 ? G.utsav + 's' : T.utsavCost.anna + ' \ud83c\udf3e + ' + T.utsavCost.kala + ' \ud83d\udee0\ufe0f',
          { disabled: G.utsav > 0 }));
        var waiting = cityJobsWaiting(sel).length;
        b.push(tile('city', 'temple', 'Enter city', waiting ? 'a scroll waits!' : '',
          { go: true, badge: waiting || '', hot: inDispute(sel) }));
        if (hiddenSites().length)
          b.push(tile('explore', 'run', 'Explorer', T.exploreCost + ' \ud83c\udf3e'));
      }
      b.push(tile('close', 'back', 'Close', ''));
      sh.hidden = false; sh.innerHTML = b.join('');
    }
    function paintGuide() {
      var el = D.getElementById('sab-guide');
      if (el) el.innerHTML = 'Next: ' + hint();
    }
    function paintAll() {
      paintHud(); SITES.forEach(paintSite); paintRoutes(); paintFog(); paintExplorers();
      paintSheet(); paintFeed(); paintGuide();
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
      var heroArt = artOf(id);
      if (heroArt) h += '<img class="sab-hero' + (q.mon ? '' : ' dim') + '" src="' + heroArt + '" alt="">' +
        (q.mon ? '' : '<div class="sab-herocap">The city as it could be — raise the monument and the colours come back.</div>');

      /* THE PEOPLE — allocation is the strategy. Kisan feed, karigar craft, kathakar
         tell, rakshak watch; the city's own trade counts double, and everyone eats. */
      var j = jobsOf(id), pop = popOf(id), spec = JOB_OF_KIND[s.kind];
      var king = inKingdomOf(id);
      if (king) h += '<div class="sab-herocap" style="font-weight:800;color:var(--accent)">' +
        motif('lotus', 20) + esc(G.kingdoms[king].name) + (king === id ? ' — this is the seat' : '') + '</div>';
      h += '<div class="mono" style="margin-top:4px">The people · ' + pop + ' praja · eat ' +
        (pop * T.eat) + ' \ud83c\udf3e each turn</div><div class="sab-jobs" id="sab-sec-people">' +
        Object.keys(DATA.jobs).map(function (jid) {
          var jd = DATA.jobs[jid];
          var up = j.kisan + j.karigar + j.kathakar + j.rakshak < pop;
          return '<div class="sab-job">' +
            '<span class="sab-tico">' + ic({ kisan: 'wheat', karigar: 'hammer', kathakar: 'scroll', rakshak: 'shield' }[jid], 24) + '</span>' +
            '<b>' + esc(jd.name) + (jid === spec ? ' \u00d72' : '') + '</b>' +
            '<span class="row2">' +
            '<button class="pm" data-sab-act="job" data-j="' + jid + '" data-d="-1"' + (j[jid] ? '' : ' disabled') + '>\u2212</button>' +
            '<span class="n">' + j[jid] + '</span>' +
            '<button class="pm" data-sab-act="job" data-j="' + jid + '" data-d="1"' + (up ? '' : ' disabled') + '>+</button>' +
            '</span>' +
            '<span class="what">' + esc(jd.what) + '</span>' +
            '</div>';
        }).join('') + '</div>';

      /* A GREAT ONE, when one has risen here */
      if (q.hero && !q.hero.gone) {
        var hd = DATA.heroes[s.kind];
        h += '<div class="sab-quest" id="sab-sec-hero" style="border-color:var(--accent)"><div class="who" style="color:var(--accent)">' +
          motif('peacock', 22) + esc(hd.name) + ' is here · ' + esc(hd.gift) + '</div>';
        if (!q.hero.used) {
          h += '<p><b>' + esc(hd.deed) + '</b> — ' + esc(hd.deedWhat) + '.</p>' +
            '<button class="sab-btn go" data-sab-act="deed">Ask for the great deed</button>';
          if (G.era >= T.kingdomEra && !king)
            h += '<button class="sab-btn" style="margin-left:8px" data-sab-act="crown"' +
              (reach(id).filter(function (o) { return awake(o); }).length + 1 >= T.kingdomMin ? '' : ' disabled') +
              '>Or: crown ' + esc(s.name) + ' — found a kingdom</button>' +
              '<p class="tiny" style="color:var(--muted);margin:8px 0 0">A crown needs ' + T.kingdomMin +
              ' awake towns joined by roads. Every town the roads reach shares the kingdom\u2019s strength (+1 of everything).</p>';
        } else {
          h += '<p class="tiny" style="color:var(--muted)">Their great deed is done; they stay for the gift.</p>';
        }
        h += '</div>';
      }

      /* THE QUARREL COMES FIRST. If this town is in a dispute, the panchayat sits
         before anything else gets built — that is what a panchayat is for. */
      if (inDispute(id)) {
        var other = byId[G.disp.a === id ? G.disp.b : G.disp.a];
        h += '<div class="sab-quest" id="sab-sec-quarrel" style="border-color:var(--accent3)"><div class="who" style="color:var(--accent3)">the panchayat sits · ' +
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
      h += '<div class="sab-works" id="sab-sec-works">' + (s.works || []).slice(0, 2).map(function (w, i) {
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
        h += '<div class="sab-quest" id="sab-sec-guru"><div class="who">the gurukul</div>' +
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
        h += '<div class="sab-quest" id="sab-sec-quest"><div class="who">' + esc(FOLK[s.kind]) + ' asks</div>' +
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
    /* THE CITY IS A PAGE, NOT A POPUP. It used to render absolutely positioned
       inside the map box — overflow hidden, 64vh tall — so its details could not
       scroll and the buttons at the bottom were simply unreachable on a phone.
       It renders in normal document flow now, the map hidden while you are inside:
       the page itself scrolls, like every other screen in the app. Autofocus runs
       on the way IN only — refocusing on every repaint threw keyboard users back
       to the top button, which read as "the buttons are inaccessible". */
    var cityOpened = false, cityReturnY = 0;
    function paintCity() {
      var hostEl = D.getElementById('sab-cityhost');
      var stage = D.getElementById('sab-stage');
      var open = !!city;
      stage.style.display = open ? 'none' : '';
      /* replacing a block this large lets the browser's scroll anchoring re-guess
         the position — a job tap mid-panel lurched the page 400px. Pin it. */
      var keepY = W.scrollY;
      hostEl.innerHTML = open ? cityHTML(city) : '';
      paintSheet();   /* the sheet is the city's nav while inside */
      /* pin on repaint AND on the way out — swapping a page-sized block either way
         lets scroll anchoring re-guess, and "leave" was landing the page at 0 */
      if (open && cityOpened) W.scrollTo(0, keepY);
      if (open && !cityOpened) {
        cityOpened = true; cityReturnY = keepY;
        var f = hostEl.querySelector('.sab-btn'); if (f) f.focus({ preventScroll: true });
        hostEl.scrollIntoView({ block: 'start' });
      }
      if (!open && cityOpened) {
        cityOpened = false;
        /* walking out shows you the map — deliberately. The page collapses to the
           top as the panel unmounts, and the map lives there; scrolling the stage
           into view makes that the designed landing rather than an accident. */
        requestAnimationFrame(function () {
          var st3 = D.getElementById('sab-stage');
          if (st3) st3.scrollIntoView({ block: 'nearest' });
        });
      }
    }

    /* ---- THE VIDYA PANEL: the tech tree, two doors an era ---- */
    var techOpen = false;
    function techHTML() {
      var rows = TECHS.map(function (t) {
        if (t.era > G.era) return '';
        var have = !!G.tech[t.id], c = costOf(t.cost, 'tech');
        var va = artOf('vidya-' + t.id);
        return '<div class="sab-work' + (have ? ' built' : ' now') + '">' +
          (va ? '<img class="sab-vthumb" src="' + va + '" alt=""' + (have ? '' : ' style="filter:grayscale(.8)"') + '>' : '<i>' + (have ? '✓' : '?') + '</i>') +
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
    var techOpened = false;
    function paintTech() {
      var hostEl = D.getElementById('sab-cityhost');
      var stage = D.getElementById('sab-stage');
      stage.style.display = (techOpen || city) ? 'none' : '';
      hostEl.innerHTML = techOpen ? techHTML() : (city ? hostEl.innerHTML : '');
      if (techOpen && !techOpened) {
        techOpened = true;
        var f = hostEl.querySelector('.sab-btn'); if (f) f.focus({ preventScroll: true });
        hostEl.scrollIntoView({ block: 'start' });
      }
      if (!techOpen) techOpened = false;
    }

    /* ---- overlays: fact cards, era cards, endings, resume ---- */
    function showOverlay(html) {
      overlay = html;
      D.getElementById('sab-ovhost').innerHTML =
        html ? '<div class="sab-over"><div class="sab-card" role="dialog" aria-modal="true">' + html + '</div></div>' : '';
      if (html) { var f = D.querySelector('#sab-ovhost .sab-btn'); if (f) f.focus({ preventScroll: true }); }
    }

    /* ================================================================
       ACTIONS
       ================================================================ */
    function act(name) {
      if (!sel || G.won) return;
      var s = byId[sel], q = G.sites[sel];
      if (name === 'close') { sel = null; targeting = false; paintAll(); return; }
      if (name === 'city' && !q.zzz) { city = sel; riddleWrong = false; touch(sel); paintCity(); return; }
      if (name === 'explore' && !q.zzz) {
        var hid = hiddenSites();
        if (!hid.length) return say('There is nothing left unfound in this age.', '');
        if (G.res.anna < T.exploreCost) return say('An explorer needs provisions — ' + T.exploreCost + ' anna for the road.', '');
        /* the explorer walks toward the NEAREST unfound place; where they arrive is
           discovered, and the fog opens along their path as they go */
        var near = null, best = 1e9;
        hid.forEach(function (t2) {
          var dx = t2.x - s.x, dy = t2.y - s.y, d2 = dx * dx + dy * dy;
          if (d2 < best) { best = d2; near = t2; }
        });
        G.res.anna -= T.exploreCost; G.score += 10; touch(sel);
        G.explorers.push({ from: sel, target: near.id, x: s.x, y: s.y });
        say('An explorer sets out from ' + s.name + ', lamp in hand, into the mist.', 'warm');
      }
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
        if (!q.seen) { q.seen = true;
          var wa = artOf(sel);
          showOverlay((wa ? '<img class="sab-cardart" src="' + wa + '" alt="">' : '') +
            '<h3>' + esc(s.name) + '</h3><p>' + esc(s.fact) + '</p>' +
            '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Onward</button></div>'); }
      }
      paintAll(); maybeEnd();
    }

    function tryRoute(target) {
      var a = sel, b = target;
      if (!a || a === b || !onMap(byId[b])) return;
      if (routed(a, b)) { targeting = false; return say('That road is already walked.', ''); }
      var rc = costOf({ kala: T.routeCost }, 'route');
      if (!canPay(rc)) { targeting = false; return say('Not enough kala for this road.', ''); }
      pay(rc); G.routes.push([a, b]); G.score += 15;
      targeting = false; touch(a); touch(b);
      var q = G.sites[a]; q.idle = 0; if (q.fade >= 0) q.fade = -1;
      var p = G.sites[b]; p.idle = 0; if (p.fade >= 0) p.fade = -1;
      say('A road now runs between ' + byId[a].name + ' and ' + byId[b].name + '. Connected places thrive.', 'warm');
      paintAll(); paintFog();
    }

    function advance() {
      if (!canAdvance()) return;
      G.res.katha -= ERAS[G.era].katha;
      var aha = ERAS[G.era].aha;
      var AHA_ART = ['vidya-iron', 'vidya-script', 'vidya-zero', 'vidya-monsoon'];
      var ea = artOf(AHA_ART[G.era]);
      G.era++; G.score += 50;
      var next = ERAS[G.era];
      showOverlay((ea ? '<img class="sab-cardart" src="' + ea + '" alt="">' : '') +
        '<h3>' + esc(aha.title) + '</h3><p>' + esc(aha.text) + '</p>' +
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
      showOverlay(mascot('gattu', 'happy', 110) + '<h3>India remembers.</h3>' +
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

      /* yields minus appetite — every rule lives in yieldOf, so the HUD, the city
         screen and the tests all read the same arithmetic. Anna floors at zero and
         a hungry turn makes every city dusty at once: the granaries come first. */
      var eaten = 0;
      SITES.forEach(function (s) {
        if (!inEra(s)) return;
        var y = yieldOf(s);
        if (y) { G.res.anna += y.anna; G.res.kala += y.kala; G.res.katha += y.katha; }
        var q = G.sites[s.id];
        if (!q.zzz) eaten += popOf(s.id) * T.eat;
      });
      if (eaten) {
        if (G.res.anna >= eaten) G.res.anna -= eaten;
        else {
          G.res.anna = 0;
          SITES.forEach(function (s) { var q = G.sites[s.id]; if (inEra(s) && !q.zzz) q.neg = Math.max(q.neg, negLimit(s.id)); });
          say('The granaries are empty and every town feels it — put more hands to farming.', 'mist');
        }
      }

      /* EXPLORERS WALK. Each turn they cover a stretch of country, the fog opening
         around their lamp; arriving, the place is FOUND — visible, asleep, ready
         for a road. Discovery is its own reward: the finding pays katha. */
      if (G.explorers.length) {
        var arrived = [];
        G.explorers.forEach(function (ex) {
          var t2 = byId[ex.target];
          if (!t2 || found(ex.target)) { ex.done = true; return; }
          var dx = t2.x - ex.x, dy = t2.y - ex.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d <= T.exploreSpeed) { ex.x = t2.x; ex.y = t2.y; ex.done = true; arrived.push(ex.target); }
          else { ex.x += dx / d * T.exploreSpeed; ex.y += dy / d * T.exploreSpeed; }
        });
        G.explorers = G.explorers.filter(function (ex) { return !ex.done; });
        arrived.forEach(function (id) {
          var q2 = G.sites[id]; q2.found = true; G.res.katha += 15; G.score += 20;
          var s2 = byId[id];
          showOverlay('<h3>' + esc(s2.name) + ' — found!</h3>' +
            '<p>Your explorer walks into ' + esc(s2.name) + ' through the thinning mist. It sleeps — ' +
            'reach it with a road, and wake it with its own story. The finding alone is worth 15 \ud83d\udcdc.</p>' +
            '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Onward</button></div>');
          say(s2.name + ' is found!', 'warm');
        });
        if (arrived.length) fitFound();
        paintFog(); paintExplorers();
      }

      /* RAIDS. The wilds test the towns — boar in the wheat, an elephant herd at the
         stores, locusts, storms, a push of the mist itself. Never people: every
         human raider is somebody's ancestor, and this game does not do enemies with
         faces. Rakshaks fend a raid off completely, and the fending is always
         gentle — drums, torches, lanterns, mended fences. */
      if (G.t - G.lastraid >= T.raidEvery) {
        var towns = SITES.filter(function (x) { return inEra(x) && awake(x.id); });
        if (towns.length) {
          var tgt = towns[(G.t * 17) % towns.length];
          var pool = DATA.raids.filter(function (r) { return r.minEra <= G.era; });
          var raid = pool[(G.t * 5) % pool.length];
          var guards = jobsOf(tgt.id).rakshak;
          G.lastraid = G.t;
          if (guards >= T.raidGuard || G.sites[tgt.id].mon) {
            G.res.katha += 10; G.score += 10;
            say(raid.what + ' at ' + tgt.name + ' — but ' + raid.fended + '. The story is worth 10 \ud83d\udcdc.', 'warm');
          } else if (raid.hits === 'fade') {
            var qf = G.sites[tgt.id]; if (qf.fade < 0) qf.fade = 0;
            say(raid.what + ' at ' + tgt.name + ' — with no rakshaks on watch, the lamps gutter. Reach it!', 'mist');
          } else {
            var loss = T.raidBase + G.era * 4 - guards * 3;
            G.res[raid.hits] = Math.max(0, G.res[raid.hits] - Math.max(0, loss));
            var qt = G.sites[tgt.id]; qt.neg = Math.max(qt.neg, negLimit(tgt.id));
            say(raid.what + ' at ' + tgt.name + ' — ' + Math.max(0, loss) + ' ' + ICON[raid.hits] +
                ' carried off. A rakshak or two on watch would have turned them.', 'mist');
          }
        }
      }

      /* A GREAT ONE RISES. A level-3 town may produce a hero — a role, never a named
         ruler: the Annadata, the Sthapati, the Acharya. One great deed each, and a
         quiet gift while they stay. */
      SITES.forEach(function (s) {
        var q = G.sites[s.id];
        if (!inEra(s) || q.zzz || q.hero || q.lv < T.heroAt) return;
        var hd = DATA.heroes[s.kind];
        q.hero = { used: false, gone: false };
        say(hd.name + ' has risen in ' + s.name + '! Enter the city — a great deed waits.', 'warm');
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
          if (q.fade >= T.fadeLen) { q.zzz = true; q.fade = -1;
            showOverlay(mascot('vismriti', null, 90) + '<h3>' + esc(s.name) + ' sleeps.</h3>' +
              '<p>Vismriti has drifted over its lamps — for now. Nothing is lost that a road and a story cannot bring back.</p>' +
              '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Reach it again</button></div>');
            say('The mist has taken ' + s.name + ' — for now. Reach it again.', 'mist'); }
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
    function onMouseDown(e) {
      var id = siteAt(e.target);
      if (id) {
        e.preventDefault();
        var g = D.getElementById('sab-' + id);
        if (g) g.focus({ preventScroll: true });
      }
    }
    function onClick(e) {
      if (swallowClick) { swallowClick = false; return; }   /* that was a drag, not a tap */
      var actEl = e.target.closest ? e.target.closest('[data-sab-act]') : null;
      if (actEl) {
        var a = actEl.getAttribute('data-sab-act');
        if (a === 'zin')  { vzZoom(1 / 1.35, { x: VZ.x + VZ.w / 2, y: VZ.y + VZ.h / 2 }); return; }
        if (a === 'zout') { vzZoom(1.35, { x: VZ.x + VZ.w / 2, y: VZ.y + VZ.h / 2 }); return; }
        if (a === 'zreset') { VZ = { x: 0, y: 0, w: 1000, h: 1100 }; vzApply(); return; }
        if (a === 'cjump') {
          var sec = D.getElementById(actEl.getAttribute('data-t'));
          if (sec) {
            sec.scrollIntoView({ block: 'center', behavior: 'smooth' });
            sec.classList.remove('sab-flash'); void sec.offsetWidth;
            sec.classList.add('sab-flash');
          }
          return;
        }
        if (a === 'leave') { city = null; riddleWrong = false; quiz = null; paintCity(); paintAll(); return; }
        if (a === 'job' && city) {
          var jj = jobsOf(city), jid = actEl.getAttribute('data-j'), dd = Number(actEl.getAttribute('data-d'));
          var total = jj.kisan + jj.karigar + jj.kathakar + jj.rakshak;
          if (dd > 0 && total < popOf(city)) jj[jid]++;
          else if (dd > 0 && jj.kisan > 0 && jid !== 'kisan') { jj.kisan--; jj[jid]++; }   /* full town: new hands come off the fields */
          else if (dd < 0 && jj[jid] > 0) { jj[jid]--; jj.kisan++; }                        /* freed hands farm */
          touch(city); paintCity(); paintAll(); return;
        }
        if (a === 'deed' && city) {
          var qh = G.sites[city], sh = byId[city];
          if (!qh.hero || qh.hero.used) return;
          var hd = DATA.heroes[sh.kind];
          qh.hero.used = true; touch(city); G.score += 50;
          if (sh.kind === 'kheti') {
            G.res.anna += 120;
            SITES.forEach(function (x) { var w = G.sites[x.id]; if (w) w.neg = 0; });
            say(hd.name + ' brings the Golden Harvest — +120 \ud83c\udf3e, and every town stands proud again.', 'warm');
          } else if (sh.kind === 'shilpa') {
            if (!qh.mon && qh.lv >= 3) { qh.mon = true; G.res.katha += 10;
              say(hd.name + ' raises ' + sh.works[2] + ' in a single season. Stone remembers.', 'warm');
            } else { G.res.kala += 100; say(hd.name + ' fills the workshops instead — +100 \ud83d\udee0\ufe0f.', 'warm'); }
          } else {
            var un2 = TECHS.filter(function (t) { return t.era <= G.era && !G.tech[t.id]; })[0];
            if (un2) { G.tech[un2.id] = true; say(hd.name + ' teaches ' + un2.name + ' to everyone, freely. ' + un2.what, 'warm'); }
            else { G.res.katha += 100; say(hd.name + ' tells the whole age\u2019s stories in one sitting — +100 \ud83d\udcdc.', 'warm'); }
          }
          paintCity(); paintAll(); return;
        }
        if (a === 'crown' && city) {
          var qc = G.sites[city], sc = byId[city];
          if (!qc.hero || qc.hero.used || G.era < T.kingdomEra || inKingdomOf(city)) return;
          if (reach(city).filter(function (o) { return awake(o); }).length + 1 < T.kingdomMin) return;
          qc.hero.used = true; touch(city); G.score += 80;
          G.kingdoms[city] = { name: 'The Kingdom of ' + sc.name, t: G.t };
          say('\ud83d\udc51 ' + sc.name + ' is crowned! Every town its roads reach now shares the kingdom\u2019s strength.', 'warm');
          paintCity(); paintAll(); return;
        }
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
        if (a === 'restart2') { wipe(); G = fresh(); sel = null; kbd = null; targeting = false;
          overlay = null; VZ = { x: 0, y: 0, w: 1000, h: 1100 };
          shell(); bindHud(); fitFound(); say('A new dawn at Dholavira.', 'warm'); return; }
        if (a === 'ovclose') { showOverlay(null); paintAll(); maybeEnd(); return; }
        if (a === 'finish') { showOverlay(null); if (typeof done === 'function') done({ win: true, score: G.score, kauris: 25 }); return; }
        return act(a);
      }
      var id = siteAt(e.target);
      if (id) {
        if (G.ev && id === G.ev.id) return helpEvent();
        if (targeting) return tryRoute(id);
        sel = id; kbd = id; paintAll();
        return;
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
      if (k === '+' || k === '=') { eat(); vzZoom(1 / 1.35, { x: VZ.x + VZ.w / 2, y: VZ.y + VZ.h / 2 }); return; }
      if (k === '-' || k === '_') { eat(); vzZoom(1.35, { x: VZ.x + VZ.w / 2, y: VZ.y + VZ.h / 2 }); return; }
      if (k === '0') { eat(); VZ = { x: 0, y: 0, w: 1000, h: 1100 }; vzApply(); return; }
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
      if (sel && k === '5') { eat(); act('explore'); return; }
      if (sel && k >= '1' && k <= '4') {
        eat();
        var q = G.sites[sel];
        if (q.zzz) { if (k === '1') act('wake'); return; }
        if (k === '1') act('grow'); if (k === '2') act('route'); if (k === '3') act('utsav');
        if (k === '4') act('city');
      }
    }
    function step(dir) {
      var vis = order.filter(function (id) { return onMap(byId[id]); });
      var i = vis.indexOf(kbd); i = i < 0 ? 0 : (i + dir + vis.length) % vis.length;
      kbd = vis[i];
      /* keyboard is the one place the reveal is WANTED: arrows move you to a lamp,
         and a lamp you cannot see is not navigation. Pointer focus never scrolls. */
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
    G.kingdoms = G.kingdoms || {}; G.lastraid = G.lastraid || 0; G.explorers = G.explorers || [];
    SITES.forEach(function (x) { var q = G.sites[x.id]; if (q) { q.bld = q.bld || {}; q.mon = !!q.mon; q.neg = q.neg || 0;
      q.jobs = q.jobs || null; q.hero = q.hero || null;
      /* saves from before the fog: what the era had already brought in counts as found */
      if (q.found === undefined) q.found = x.era <= G.era; } });
    shell();
    if (saved && saved === G) {
      say('Welcome back. The lamps kept burning while you were away.', 'warm');
    } else {
      showOverlay(mascot('mithu', 'talk', 96) + '<h3>Sabhyata — the first city</h3>' +
        '<p>Dholavira is awake, and the rest of India sleeps under Vismriti, the Forgetting. ' +
        'All of India but this one city sleeps unseen under the fog. Send explorers out to find the ' +
        'others, then build roads to reach them, and wake the land one lamp at a time. ' +
        'Step <i>into</i> a city to build granaries, gurukuls and monuments, settle quarrels, raise a capital and take quest scrolls. ' +
        'Nothing here is ever conquered — only reached.</p>' +
        '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Light the first lamp</button></div>');
    }
    /* HUD buttons are re-created whenever shell() rebuilds the DOM (a restart does),
       so their listeners bind per-shell — bound once at boot, a restarted game's
       HUD was a row of dead buttons. */
    function bindHud() {
      D.getElementById('sab-adv').addEventListener('click', advance);
      D.getElementById('sab-pause').addEventListener('click', togglePause);
      D.getElementById('sab-tech').addEventListener('click', function () {
        techOpen = !techOpen; if (techOpen) { city = null; quiz = null; } paintTech(); });
      D.getElementById('sab-restart').addEventListener('click', function () {
        city = null; techOpen = false; paintCity(); paintTech();
        showOverlay('<h3>Start the sabhyata again?</h3>' +
          '<p>The whole journey begins afresh at Dholavira, and this one is forgotten. There is no undo.</p>' +
          '<div class="row"><button class="sab-btn go" data-sab-act="restart2">Start again</button>' +
          '<button class="sab-btn" data-sab-act="ovclose">Keep playing</button></div>');
      });
      var st2 = D.getElementById('sab-stage');
      st2.addEventListener('wheel', onWheel, { passive: false });
      st2.addEventListener('pointerdown', onPointerDown);
    }
    bindHud();
    fitFound();
    host.addEventListener('mousedown', onMouseDown);
    host.addEventListener('click', onClick);
    D.addEventListener('pointermove', onPointerMove);
    D.addEventListener('pointerup', onPointerUp);
    D.addEventListener('pointercancel', onPointerUp);
    /* keys live on the document: focus often rests on the page body, and a game whose
       keyboard only works after a click is a game with no keyboard (house rule). The
       teardown removes it, and `dead` guards the gap. */
    D.addEventListener('keydown', onKey, true);
    timer = setInterval(tick, TICK_MS);

    return function teardown() {
      dead = true;
      clearInterval(timer);
      if (G && !G.won) save(G);
      host.removeEventListener('mousedown', onMouseDown);
      host.removeEventListener('click', onClick);
      D.removeEventListener('pointermove', onPointerMove);
      D.removeEventListener('pointerup', onPointerUp);
      D.removeEventListener('pointercancel', onPointerUp);
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
    /* the cover is the game's own Kashi painting with the lamp-road drawn over it */
    scene: '<svg viewBox="0 0 100 70" aria-hidden="true" preserveAspectRatio="xMidYMid slice">' +
      '<image href="art/sabhyata/kashi.jpg" x="0" y="0" width="100" height="70" preserveAspectRatio="xMidYMid slice"/>' +
      '<path d="M20 52 Q35 30 52 38 Q70 46 82 24" fill="none" stroke="#fff3d0" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>' +
      '<circle cx="20" cy="52" r="5" fill="#ffd76e"/><circle cx="52" cy="38" r="4" fill="#ffd76e"/>' +
      '<circle cx="82" cy="24" r="6" fill="#fff3d0"/><circle cx="82" cy="24" r="10" fill="none" stroke="#fff3d0" stroke-opacity=".5"/></svg>',
    engine: sabhyata
  });
})();
