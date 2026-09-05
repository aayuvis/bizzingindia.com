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
                  { anna: 80, kala: 80, katha: 60 },
                  { anna: 85, kala: 85, katha: 65 },
                  { anna: 90, kala: 90, katha: 70 },
                  { anna: 95, kala: 95, katha: 75 },
                  { anna: 100, kala: 100, katha: 80 },
                  { anna: 105, kala: 105, katha: 85 },
                  { anna: 110, kala: 110, katha: 90 },
                  { anna: 115, kala: 115, katha: 95 },
                  { anna: 120, kala: 120, katha: 100 } ],
    akalEvery:  70,                 /* seconds between droughts, somewhere (era 2+) */
    akalLen:    40,                 /* turns an akal holds unless a stepwell stands */
    quizPay:    10,                 /* gurukul trivia, own city */
    quizFarPay: 15,                 /* with Brahmi script, about other cities */
    quizCd:     25,                 /* seconds between questions per city */

    eat:        0.25,               /* anna per citizen per turn — the balance */
    /* RAKSHA — the defence of the realm, the game's new spine.
       Fewer raids, each one an event: dust on the horizon first, then the
       blow. What arrives has a STRENGTH; what meets it is the watch on the
       gate, the rampart, the fort, and whatever the neighbours can send down
       a road in time. Lose and the city is hurt in ways you can see. */
    raidEvery:  30,                 /* ticks between one threat and the next */
    warnTicks:  7,                  /* dust on the horizon before the blow */
    warnTower:  13,                 /* with a watchtower wonder, twice the warning */
    raidBase:   6,                  /* coins carried off at strength 1, before era */
    wallGuard:  2,                  /* a prakara is worth this many rakshaks */
    fortGuard:  4,                  /* a durg is worth this many */
    helpRange:  260,                /* map units a neighbour's rakshaks can march */
    keyWeight:  3,                  /* capital, seats and ports are hit this much more */
    sackSleep:  3,                  /* sackings a city can take before it sleeps */
    /* NOTHING GREAT IS INSTANT. Research and monuments now take time — the
       one change that turns paying into planning. Both run on their own
       clock, which keeps ticking while you stand in a city or the Vidya
       panel, so a build you started is a build you can watch. */
    techTicks:  8,                  /* base ticks to learn a thing (+2 an era) */
    techEra:    2,
    techSchool: 0.22,               /* each gurukul shortens it, to a floor */
    techFloor:  0.34,
    monTicks:   12,                 /* base ticks to raise a monument (+2 an era) */
    monEra:     2,
    monHand:    0.07,               /* each karigar in the city speeds the work */
    monFloor:   0.5,
    monStages:  3,                  /* foundation, walls, the top stone */
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
    /* ONE LINE RUNS THE GAME. Era, coins, the selected place and every verb
       share a single strip; on a narrow screen it wraps, on a monitor it is
       one line. The era and the coins are information and stay flat. */
    '.sab-era{display:flex;flex-direction:column;justify-content:center;padding-right:4px}',
    '.sab-era b{display:block;font:800 14.5px/1.1 var(--display,Georgia,serif);white-space:nowrap}',
    '.sab-era span{font-size:9px;color:var(--muted);font-weight:700;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}',
    '.sab-res{display:flex;gap:8px;flex-wrap:wrap}',
    '.sab-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 9px;border:0;border-radius:999px;background:var(--card);box-shadow:0 1px 2px rgba(30,20,64,.07),0 3px 10px rgba(30,20,64,.06);font-weight:800;font-size:12.5px}',
    '.sab-chip small{font-weight:600;color:var(--muted)}',
    '.sab-btn{min-height:44px;padding:8px 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--text);font:700 14px var(--body,system-ui);cursor:pointer}',
    '.sab-btn:disabled{opacity:.45;cursor:default}',
    '.sab-btn.go{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.sab-btn:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',

    '.sab-stage{position:relative;background:var(--ground2);border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden}',
    '.sab-stage svg{display:block;width:100%;height:auto;max-height:72vh}',
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

    /* ONE BAR OF VERBS. There were two rows of buttons — the HUD's own
       (New era, Vidya, restart, pause) and the selection's big tiles below.
       They share a single compact bar now: the selection's name and state
       stand flat and boxless on the left (info wears no button clothes),
       the selection's verbs follow as small round pills — icon chip, word,
       cost tucked underneath — and the game's own verbs keep the right
       edge, always in reach. */
    '.sab-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;row-gap:6px}',
    '.sab-res{display:flex;gap:6px;flex-wrap:wrap;padding-right:4px}',
    /* THE SELECTION TRAY, the second line: it exists only while a place is
       chosen — tap a lamp and it slides in under the game strip, wearing the
       accent's rule so it clearly belongs to the lamp, not to the game. */
    '.sab-tray{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:6px 12px;' +
      'border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:14px;' +
      'background:var(--card);box-shadow:0 2px 8px rgba(30,20,64,.06);animation:sabtray .22s ease}',
    '@keyframes sabtray{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}',
    '.sab-gap{flex:1}',
    '.sab-globals{display:flex;gap:8px;margin-left:auto}',
    '.sab-who{display:flex;flex-direction:column;justify-content:center;padding:0 10px 0 2px;max-width:300px}',
    '.sab-who b{font:800 15.5px/1.1 var(--display,Georgia,serif);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sab-who span{font-size:10.5px;color:var(--muted);font-weight:700;letter-spacing:.02em}',
    '.sab-act{position:relative;display:inline-flex;align-items:center;gap:7px;min-height:44px;padding:4px 13px 4px 8px;' +
      'border:1px solid var(--line);border-radius:999px;cursor:pointer;color:var(--text);background:var(--card);' +
      'box-shadow:0 1px 3px rgba(30,20,64,.08);font:700 12.5px/1.15 var(--body,system-ui);' +
      'transition:transform .15s,box-shadow .15s}',
    '.sab-act:hover{transform:translateY(-1px);box-shadow:0 4px 10px rgba(30,20,64,.13)}',
    '.sab-act:active{transform:scale(.97)}',
    '.sab-act:disabled{opacity:.4;cursor:default;transform:none}',
    '.sab-act:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.sab-act .sab-tico{width:27px;height:27px;border-radius:999px}',
    '.sab-act .lbl{display:flex;flex-direction:column;align-items:flex-start;text-align:left}',
    '.sab-act .lbl em{font-style:normal;font-size:9.5px;font-weight:700;color:var(--muted);white-space:nowrap}',
    '.sab-act.go{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.sab-act.go .sab-tico{background:rgba(255,255,255,.2);color:#fff}',
    '.sab-act.go .lbl em{color:rgba(255,255,255,.85)}',
    '.sab-act.txt{padding:4px 15px}',   /* the game's own text verbs (Vidya) */
    '.sab-act.sq{width:44px;justify-content:center;padding:4px;font-size:16px}',   /* icon verbs: pause, restart, close */
    '.sab-tico{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;flex:none;' +
      'background:var(--accent-soft,rgba(91,63,214,.1));color:var(--accent)}',
    '.sab-badge{position:absolute;top:-6px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;' +
      'background:var(--accent2);color:#fff;font:800 12px/21px var(--body,system-ui);border:2px solid var(--card);box-shadow:0 2px 6px rgba(0,0,0,.18)}',
    '.sab-badge.hot{background:var(--accent3)}',
    '@keyframes sabflash{0%,100%{box-shadow:0 4px 14px rgba(30,20,64,.06)}35%{box-shadow:0 0 0 4px color-mix(in srgb,var(--accent2) 55%,transparent),0 4px 14px rgba(30,20,64,.06)}}',
    '.sab-flash{animation:sabflash 1s ease 2}',

    '.sab-over{position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;background:color-mix(in srgb,var(--ground) 82%,transparent);padding:18px;z-index:4;overflow:auto}',
    '.sab-over .sab-card{margin:auto}',
    /* the fact / era / wake cards: SMALL on purpose — a note held up over the
       game, not a page replacing it. The map stays visible around them. */
    '.sab-card{max-width:min(560px,86vw);background:var(--card);border:0;border-radius:18px;padding:14px 18px;box-shadow:0 14px 40px rgba(0,0,0,.25)}',
    '.sab-card h3{margin:0 0 6px;font:800 16.5px/1.2 var(--display,Georgia,serif)}',
    '.sab-card p{margin:0 0 9px;font-size:13.5px;line-height:1.5}',
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
    '.sab-city{background:var(--card);border:0;border-radius:20px;padding:12px 12px 16px;box-shadow:0 2px 6px rgba(30,20,64,.05),0 14px 40px rgba(30,20,64,.08)}',
    '.sab-city .chead{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}',
    '.sab-city h3{margin:0;font:800 20px/1.1 var(--display,Georgia,serif)}',
    '.sab-city .mono{font-size:11.5px;color:var(--muted);font-weight:700;letter-spacing:.08em;text-transform:uppercase}',
    '.sab-works{display:flex;flex-direction:column;gap:5px;margin:8px 0}',
    '.sab-work{display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:7px 11px;border:0;border-radius:13px;background:var(--card2,var(--card));box-shadow:0 1px 2px rgba(30,20,64,.05),0 4px 14px rgba(30,20,64,.06);font-size:13.5px;opacity:.5}',
    '.sab-work.built{opacity:1;font-weight:700}',
    '.sab-work.now{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft,rgba(0,0,0,.05))}',
    '.sab-work i{font-style:normal;width:22px;height:22px;border-radius:50%;border:2px solid var(--line);display:inline-flex;align-items:center;justify-content:center;font-size:12px;flex:none}',
    /* the praja: four compact tiles, not four banners — icon, name, a count flanked
       by round +/- , the explainer as a whisper underneath */
    '.sab-jobs{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:7px;margin:6px 0}',
    '.sab-job{display:flex;flex-direction:column;gap:3px;align-items:center;text-align:center;padding:7px 6px;border-radius:12px;' +
      'background:linear-gradient(165deg,var(--card),var(--card2,var(--card)));box-shadow:0 1px 2px rgba(30,20,64,.06),0 6px 18px rgba(30,20,64,.07)}',
    '.sab-job b{font:800 12px var(--body,system-ui)}',
    '.sab-job .row2{display:flex;align-items:center;gap:10px}',
    '.sab-job .n{font:800 17px var(--display,Georgia,serif);min-width:22px}',
    '.sab-job .pm{width:40px;height:40px;border-radius:50%;border:0;background:var(--accent-soft,rgba(91,63,214,.1));color:var(--accent);font:800 20px/1 var(--body,system-ui);cursor:pointer;box-shadow:0 1px 3px rgba(30,20,64,.1)}',
    '.sab-job .pm:disabled{opacity:.35;cursor:default}',
    '.sab-job .what{font-size:10px;color:var(--muted);line-height:1.3}',
    '.sab-work.built i{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.sab-quest{background:linear-gradient(165deg,var(--card),color-mix(in srgb,var(--accent2) 7%,var(--card)));border:0;border-left:4px solid var(--accent2);border-radius:14px;padding:9px 12px;margin:5px 0;box-shadow:0 4px 14px rgba(30,20,64,.06)}',
    '.sab-quest .who{font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent2)}',
    '.sab-quest p{margin:6px 0 10px;font-size:15px;line-height:1.5}',
    '.sab-cfact{font-size:14px;line-height:1.55;color:var(--text2,var(--text));background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:12px;margin:6px 0}',
    '.sab-hero{width:100%;aspect-ratio:3/1.35;object-fit:cover;border-radius:var(--radius-lg);border:1px solid var(--line);margin:10px 0 2px;display:block}',
    '.sab-hero.dim{filter:grayscale(.85) sepia(.15) brightness(.92)}',
    '.sab-herocap{font-size:12px;color:var(--muted);margin:4px 0 8px}',
    '.sab-vthumb{width:112px;height:75px;object-fit:cover;border-radius:10px;border:1px solid var(--line);flex:none}',
    '.sab-cardart{width:100%;max-height:96px;object-fit:cover;border-radius:12px;margin:0 0 8px;display:block}',
    /* DESKTOP FIT. On a monitor the HUD, the action row, the map and the guide should
       share one screen without the page scrolling — the map gives a little height and
       the paintings stop being posters. Phones keep the tall map. */
    '@media (min-width: 900px){' +
      '.sab-wrap{gap:8px}' +
      '.sab-stage svg{max-height:70vh}' +
      '.sab-hero{max-height:180px;aspect-ratio:auto}' +
      '.sab-cardart{max-height:170px;object-fit:cover}' +
      '.sab-vthumb{width:96px;height:64px}' +
    '}',
    /* ============ SABHYATA ALIVE — the sprite and motion layer ============ */
    /* towns as painted sprites that grow with level; the lamp stays lit at
       their foot. Selection and keyboard cues move to the halo ring. */
    '.sab-cityimg{pointer-events:none;filter:drop-shadow(0 3px 3px rgba(30,20,64,.28))}',
    '.sab-site.asleep .sab-cityimg{filter:grayscale(.92) brightness(.9);opacity:.7}',
    '.sab-site.dustyv .sab-cityimg{filter:grayscale(.45) brightness(.95) drop-shadow(0 3px 3px rgba(30,20,64,.2))}',
    /* a remembered city: golden, quiet, and never in anyone\'s way */
    '.sab-site.hercity .sab-cityimg{filter:sepia(.55) saturate(.75) brightness(1.03) drop-shadow(0 2px 3px rgba(160,120,40,.35));opacity:.9}',
    '.sab-site.hercity circle.core{fill:#c9a24b;animation-duration:5s}',
    '.sab-site.hercity circle.halo{stroke:#c9a24b;stroke-width:2;opacity:.5}',
    '.sab-site.hercity text{opacity:.75}',
    '.sab-site.sel circle.halo{stroke:var(--accent3);stroke-width:3.5;opacity:.9}',
    /* the movers: carts on roads, boats on rivers, walkers in the mist */
    '.sab-cart image,.sab-boat image,.sab-exwalk image{pointer-events:none}',
    '.sab-exwalk image{animation:sabbob 1.05s ease-in-out infinite}',
    '@keyframes sabbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}',
    /* Vismriti breathes: two soft wisps drifting inside the fog’s own mask */
    '.sab-mistdrift ellipse{animation:sabdrift 46s ease-in-out infinite alternate}',
    '.sab-mistdrift ellipse:nth-child(2){animation-duration:61s;animation-delay:-20s}',
    '@keyframes sabdrift{from{transform:translate(-60px,20px)}to{transform:translate(70px,-30px)}}',
    /* event sparks: diyas rising at an utsav, a grey swirl for the mist, rings for growth */
    '.sab-diya{animation:sabdiya 2.4s ease-out forwards}',
    '@keyframes sabdiya{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(-75px) scale(.7)}}',
    '.sab-swirl{animation:sabswirl 2.8s ease-in-out forwards}',
    '@keyframes sabswirl{0%{opacity:0;transform:scale(.4) rotate(0deg)}30%{opacity:.75}100%{opacity:0;transform:scale(1.5) rotate(150deg)}}',
    '.sab-ringfx{fill:none;stroke:var(--accent2);stroke-width:3;animation:sabringfx 1.6s ease-out forwards}',
    '@keyframes sabringfx{from{opacity:.9;transform:scale(.3)}to{opacity:0;transform:scale(2.2)}}',
    /* the city painting becomes a stage: praja walk it, birds cross it,
       the unbuilt monument stands in bamboo */
    '.sab-scene{position:relative;overflow:hidden;border-radius:var(--radius-lg);border:1px solid var(--line);margin:10px 0 2px}',
    /* the kit board is a fixed-size diamond scaled to the scene, so every
       percent the game already speaks in still means the same place */
    '.sab-kitbar{position:absolute;right:8px;top:8px;z-index:7;display:flex;gap:6px;align-items:center;',
    '  flex-wrap:wrap;justify-content:flex-end;max-width:calc(100% - 16px)}',
    '.sab-kitbar .z{font:700 11px/1 var(--body);color:#f6efe1;background:rgba(24,16,34,.72);',
    '  min-height:36px;display:flex;align-items:center;justify-content:center;padding:0 7px;',
    '  border-radius:9px;min-width:44px;font-variant-numeric:tabular-nums}',
    /* the shop: one row per thing, and every row says its price and its point */
    /* the handle sits on the board; the shelf slides over its bottom third */
    '.sab-dhandle{position:absolute;left:8px;bottom:8px;z-index:8;display:flex;align-items:center;',
    '  min-height:40px;',
    '  gap:7px;border:1px solid rgba(255,255,255,.35);background:rgba(24,16,34,.82);color:#f6efe1;',
    '  font:800 12.5px/1 var(--body);padding:9px 13px 9px 10px;border-radius:11px;cursor:pointer;',
    '  backdrop-filter:blur(5px);max-width:62%}',
    '.sab-dhandle img{width:26px;height:26px;object-fit:contain;object-position:50% 100%}',
    '.sab-dhandle em{font-style:normal;font-size:15px;line-height:1}',
    '.sab-dhandle b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sab-dhandle:hover{border-color:var(--accent2)}',
    '.sab-dhandle:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    /* A shelf that covers the city is a shelf you cannot build on. It is now
       a band you can see the board through, and only as tall as its tiles. */
    '.sab-drawer{position:absolute;left:0;right:0;bottom:0;z-index:9;',
    '  display:flex;flex-direction:column;background:rgba(18,12,26,.34);',
    '  backdrop-filter:blur(4px) saturate(1.15);',
    '  border-top:1px solid rgba(255,255,255,.13);border-radius:13px 13px 0 0;color:#f6efe1;',
    /* the board shows through, so the text needs its own contrast rather than
       a panel behind it */
    '  text-shadow:0 1px 3px rgba(12,8,18,.95),0 0 10px rgba(12,8,18,.7)}',
    '.sab-dhead{display:flex;align-items:center;gap:5px;padding:5px 6px 3px}',
    '.sab-dtabs{display:flex;gap:5px;overflow-x:auto;flex:1;scrollbar-width:none}',
    '.sab-dtabs::-webkit-scrollbar{display:none}',
    '.sab-dtab{flex:0 0 auto;border:1px solid rgba(255,255,255,.26);background:rgba(18,12,26,.42);',
    '  color:#e4d9c4;font:700 10.5px/1 var(--body);min-height:32px;padding:0 10px;',
    '  border-radius:8px;cursor:pointer;white-space:nowrap}',
    '.sab-dtab i{font-style:normal;opacity:.6;margin-left:5px}',
    '.sab-dtab.on{background:var(--accent);border-color:var(--accent);color:#2a1a10}',
    '.sab-dtab:focus-visible,.sab-dclose:focus-visible,.sab-tile:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.sab-dclose{flex:0 0 auto;border:0;background:none;color:#d9cdb8;font-size:16px;cursor:pointer;',
    '  min-width:36px;min-height:32px}',
    '.sab-dhint{flex:0 0 auto;font:700 10px/1 var(--body);color:#a2937c;white-space:nowrap}',
    '.sab-drow{padding:0 7px 5px}',
    '.sab-drow .sab-grow{width:100%;justify-content:center}',
    /* Grow lives with the city it grows, not on the realm map beside Route */
    '.sab-grow{position:absolute;right:8px;bottom:8px;z-index:8;display:flex;align-items:center;',
    '  min-height:40px;',
    '  gap:8px;border:1px solid rgba(255,255,255,.3);background:rgba(24,16,34,.82);color:#f6efe1;',
    '  font:800 12.5px/1 var(--body);padding:9px 12px;border-radius:11px;cursor:pointer;',
    '  backdrop-filter:blur(5px)}',
    '.sab-grow em{font-style:normal;font-weight:700;color:var(--accent2)}',
    '.sab-grow.can{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent) inset}',
    '.sab-grow:disabled{opacity:.5;cursor:default}',
    '.sab-grow:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.sab-drawer .sab-grow{position:static;flex:0 0 auto;min-height:32px;padding:0 10px;',
    '  font-size:10.5px;border-radius:8px;gap:6px;background:rgba(18,12,26,.5)}',
    '.sab-dhold{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:0 8px 5px;font-size:11.5px}',
    '.sab-dhold .sab-btn{padding:4px 8px;font-size:10.5px}',
    '.sab-dtiles{display:flex;gap:6px;overflow-x:auto;padding:1px 7px 7px;',
    '  scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}',
    '.sab-tile{flex:0 0 74px;scroll-snap-align:start;display:grid;gap:1px;justify-items:center;',
    '  border:1px solid rgba(255,255,255,.22);background:rgba(18,12,26,.42);color:#f6efe1;',
    '  border-radius:9px;padding:5px 3px 5px;cursor:pointer;font:inherit;text-align:center}',
    '.sab-tile .art{position:relative;width:42px;height:34px;display:flex;align-items:flex-end;justify-content:center}',
    '.sab-tile .art img{max-width:42px;max-height:34px;object-fit:contain}',
    '.sab-tile .art.crop{border-radius:8px;overflow:hidden;height:44px;width:52px}',
    '.sab-tile .art.crop img{width:52px;height:44px;max-width:none;max-height:none;',
    '  object-fit:cover;object-position:50% 50%}',
    '.sab-tile .art u{position:absolute;right:-3px;top:-3px;text-decoration:none;font:800 9px/1 var(--body);',
    '  background:var(--accent);color:#2a1a10;border-radius:6px;padding:1px 3px}',
    '.sab-tile b{font:800 9.5px/1.15 var(--body);max-width:70px;overflow:hidden;',
    '  text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
    '.sab-tile .c{font:700 9.5px/1 var(--body);color:var(--accent2);white-space:nowrap}',
    '.sab-tile .g{font:700 9px/1 var(--body);color:#7fd6a8;white-space:nowrap}',
    '.sab-tile.on{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent) inset}',
    '.sab-tile.poor{opacity:.5}',
    '.sab-tile:disabled{opacity:.35;cursor:default}',
    '@media (max-width:560px){.sab-tile{flex:0 0 68px}}',
    /* The built board gets a WINDOW, not the whole page. Bounded height means
       the board scrolls inside it, the build handle at its bottom edge is
       always reachable, and the city never pushes everything else off screen. */
    '.sab-scene.iskit{overflow:hidden;position:relative;',
    '  height:min(66vh,620px);min-height:340px;touch-action:none}',
    '@media (max-width:560px){.sab-scene.iskit{height:min(60vh,480px)}}',
    '.sab-view{position:absolute;inset:0;overflow:auto;-webkit-overflow-scrolling:touch;',
    '  cursor:grab;scrollbar-width:thin}',
    '.sab-view.grabbing{cursor:grabbing}',
    '.sab-view.placing{cursor:crosshair}',
    '.sab-scene.iskit .sab-cam{transform:none!important}',
    /* A four-year-old's finger is the smallest thing that has to hit these,
       so nothing on the board is under 36px in its short dimension. */
    '.sab-kitbar button{border:1px solid rgba(255,255,255,.35);background:rgba(24,16,34,.72);',
    '  color:#f6efe1;font:700 11px/1 var(--body);letter-spacing:.06em;text-transform:uppercase;',
    '  min-height:36px;min-width:36px;padding:0 11px;border-radius:9px;cursor:pointer;',
    '  backdrop-filter:blur(4px)}',
    '.sab-kitbar button:hover{border-color:var(--accent2)}',
    '.sab-kitbar button i{font-style:normal;font-size:13px}',
    '.sab-kitbar button u{text-decoration:none;margin-left:5px}',
    /* NARROW: the bar keeps its icons and drops its words, the crew stands in
       a strip across the top, and the city gets the rest of the screen. */
    '@media (max-width:700px){',
    /* These sit earlier in the sheet than the rules they are correcting, so
       every one of them is written against .sab-scene.tight — a plain
       .sab-nameplate here loses to the .sab-nameplate defined further down,
       and the banner stayed in the middle of the top edge on a phone. */
    '  .sab-scene.tight .sab-kitbar button u{display:none}',
    '  .sab-scene.tight .sab-kitbar button{padding:0 9px}',
    '  .sab-scene.tight .sab-kitbar .z{min-width:40px;font-size:10px}',
    '  .sab-scene.tight .sab-kitbar{top:auto;bottom:8px;right:8px}',
    /* bottom-left is where the zoom bar lives on a phone, so the banner goes
       just under the crew strip instead of underneath the buttons */
    '  .sab-scene.tight .sab-nameplate{left:8px;right:auto;top:23%;bottom:auto;',
    '    max-width:56%;transform:none;text-align:left;padding:4px 10px}',
    '  .sab-scene.tight .sab-nameplate b{font-size:13px}',
    '  .sab-scene.tight .sab-dhandle{left:8px;bottom:54px;min-height:38px;padding:0 11px}',
    '  .sab-scene.tight .sab-grow{right:8px;bottom:8px;min-height:38px;font-size:11px}',
    '  .sab-scene.tight.iskit .sab-grow{bottom:54px}',
    '  .sab-scene.tight .sab-station{transform:scale(.82);transform-origin:0 0}',
    '  .sab-scene.tight.shelfup .sab-nameplate,',
    '  .sab-scene.tight.shelfup .sab-kitbar{display:none}',
    '  .sab-scene.iskit{height:min(46vh,380px);min-height:280px}',
    '  .sab-scene.tight .sab-cbadge{display:none}',
    '}',
    '.sab-kitboard{position:relative;width:100%;display:block;overflow:hidden;',
    '  background:radial-gradient(ellipse 72% 58% at 50% 58%,#e8dcc4 0%,#d8c9ab 78%)}',
    '.sab-kitinner{position:absolute;left:0;top:0;transform-origin:0 0}',
    /* the plate's crop rules are for a painting; the board sets its own height
       from the grid, and a max-height cuts the south half of the city off */
    '.sab-scene.iskit .sab-hero{aspect-ratio:auto;max-height:none}',
    '.sab-scene.iskit{background:#e6dbc2}',
    '.kit-f{position:absolute;display:block;pointer-events:none;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}',
    '.kit-g{position:absolute;transform:translate(-50%,-100%);pointer-events:none}',
    '.kit-p{position:absolute;transform:translate(-50%,-100%);pointer-events:none}',
    '.kit-shadow{position:absolute;transform:translate(-50%,-50%);border-radius:50%;background:rgba(20,12,26,.26);pointer-events:none;filter:blur(1.5px)}',
    '.sab-scene .sab-hero{margin:0;border:0;border-radius:0}',
    '.sab-praja{position:absolute;inset:0;pointer-events:none}',
    /* A WALKER PINNED TO A ROAD. The keyframes carry left/top along the
       plate's own traced street, so the sprite's feet land on the road. */
    '.sab-walker.onroad,.sab-stand.onroad,.sab-cross.onroad{bottom:auto;transform:translate(-50%,-100%)}',
    '.sab-walker.onroad,.sab-cross.onroad{left:auto}',
    /* the green places breathe under the paint — a soft leaf wash, never a
       shape a child must read, just the land looking alive */
    '.sab-greens{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;' +
      'mix-blend-mode:soft-light}',
    '.sab-greens polygon{fill:#3f9c5c;opacity:.26;animation:sabgreen 7s ease-in-out infinite alternate}',
    '@keyframes sabgreen{from{opacity:.18}to{opacity:.34}}',
    '.sab-walker{position:absolute;left:-14%;bottom:2%;height:12%;width:auto;' +
      'filter:drop-shadow(0 2px 2px rgba(0,0,0,.3));' +
      'animation:sabwalk 18s linear infinite,sabwbob .7s ease-in-out infinite alternate}',
    '@keyframes sabwalk{from{left:-14%}to{left:104%}}',
    '@keyframes sabwbob{from{transform:translateY(0)}to{transform:translateY(-1.5%)}}',
    /* the bamboo climbs: stage one is a frame, stage three is nearly a
       monument, and the bar beneath fills as the masons work */
    /* the alarm: red while the gate is short, green the moment it is enough */
    /* the bar's own alarm: red while the gate is short, green when it holds */
    '.sab-raksha{display:flex;flex-direction:column;align-items:flex-start;gap:1px;border:0;cursor:pointer;' +
      'padding:5px 12px;border-radius:12px;background:#96201288;color:#fff;text-align:left;' +
      'background:rgba(150,32,18,.94);animation:sabpulse 1.6s ease-in-out infinite}',
    '.sab-raksha.ready{background:rgba(24,110,66,.94);animation:none}',
    '.sab-raksha b{font:800 12.5px/1.15 var(--body);white-space:nowrap}',
    '.sab-raksha span{font:700 10px/1.15 var(--body);opacity:.92;white-space:nowrap}',
    '.sab-raksha{min-height:34px;padding:0 10px}',
    /* display:flex on the class outranks the browser's own [hidden] rule, so
       the empty alarm chip sat in the bar for ever. Same trap as the gully
       game covers; same one-line answer. */
    '.sab-raksha[hidden]{display:none}',
    '@keyframes sabpulse{0%,100%{box-shadow:0 0 0 0 rgba(200,60,30,.55)}50%{box-shadow:0 0 0 7px rgba(200,60,30,0)}}',
    '.sab-alarm{position:absolute;left:50%;top:8px;transform:translateX(-50%);z-index:7;pointer-events:none;' +
      'display:grid;justify-items:center;gap:1px;padding:6px 14px;border-radius:12px;text-align:center;' +
      'background:rgba(150,32,18,.93);color:#fff;box-shadow:0 4px 14px rgba(40,10,4,.4);max-width:88%}',
    '.sab-alarm.ready{background:rgba(24,110,66,.93)}',
    '.sab-alarm b{font:800 13px/1.2 var(--body);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}',
    '.sab-alarm span{font:700 10.5px/1.2 var(--body);opacity:.9}',
    '.sab-scafbtn.building{cursor:pointer}',
    '.sab-scafbtn.building img{transition:transform .8s ease,opacity .8s ease;transform-origin:50% 100%}',
    '.sab-scafbtn.st1 img{transform:scaleY(.62);opacity:.82}',
    '.sab-scafbtn.st2 img{transform:scaleY(.82);opacity:.92}',
    '.sab-scafbtn.st3 img{transform:scaleY(1)}',
    '.sab-scafbtn.building em{background:linear-gradient(90deg,var(--accent2) var(--pc,0%),' +
      'rgba(255,255,255,.85) var(--pc,0%));color:var(--text);font-weight:800}',
    '.sab-work.atwork{outline:2px solid var(--accent2);outline-offset:-2px}',
    '.sab-projbar{display:block;margin-top:5px;height:9px;border-radius:99px;background:var(--line);' +
      'position:relative;overflow:hidden;max-width:190px}',
    '.sab-projbar i{position:absolute;inset:0;width:var(--pc,0%);background:var(--accent2);' +
      'border-radius:99px;transition:width .6s linear}',
    '.sab-projbar b{position:absolute;right:-30px;top:-3px;font:800 10.5px var(--body);color:var(--accent)}',
    '.sab-scaffold{position:absolute;left:50%;bottom:16%;height:52%;width:auto;transform:translateX(-50%);' +
      'pointer-events:none;filter:drop-shadow(0 4px 10px rgba(0,0,0,.35))}',
    /* THE BUILD PLOTS — Civ\'s own move, made native: tap a plot on the city
       painting and the building rises there, permanently. Unbuilt plots are
       ghost outlines with the cost; built ones stand in colour with a name
       chip. Real buttons in DOM order — keyboard and touch both, >=44px. */
    '.sab-plots{position:absolute;inset:0;pointer-events:none}',
    '.sab-plot{pointer-events:auto;position:absolute;bottom:2%;width:15%;min-width:48px;min-height:44px;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:2px;' +
      'padding:3px 2px;border:0;background:none;cursor:pointer;font:700 10px/1.15 var(--body,system-ui);color:#fff}',
    '.sab-plot img{width:88%;height:auto;max-height:54px;object-fit:contain;' +
      'filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))}',
    '.sab-plot img.ghost{opacity:.68;filter:grayscale(1) brightness(1.3) drop-shadow(0 2px 3px rgba(0,0,0,.3))}',
    '.sab-plot:not(:disabled):not(.built):hover img.ghost{opacity:.95;filter:grayscale(.4) brightness(1.15) drop-shadow(0 2px 5px rgba(0,0,0,.4))}',
    '.sab-plot i{font-style:normal;background:rgba(22,17,44,.6);padding:1px 7px;border-radius:999px;white-space:nowrap;text-shadow:none}',
    '.sab-plot em{font-style:normal;background:rgba(255,251,238,.9);color:#4a3810;padding:1px 7px;border-radius:999px;font-size:9.5px}',
    '.sab-plot:disabled{cursor:default;opacity:.55}',
    '.sab-plot.built{pointer-events:none}',
    '.sab-plot:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:12px}',
    '.sab-plot.rise img{animation:sabrise .9s cubic-bezier(.2,.8,.3,1.15)}',
    '@keyframes sabrise{from{transform:translateY(26px) scale(.4);opacity:0}to{transform:none;opacity:1}}',
    /* a port city keeps a boat moored at the edge of its painting */
    '.sab-moor{position:absolute;right:2%;bottom:3%;height:15%;width:auto;pointer-events:none;' +
      'filter:drop-shadow(0 2px 3px rgba(0,0,0,.35));animation:sabmoor 4.5s ease-in-out infinite}',
    '@keyframes sabmoor{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-2.5px) rotate(1.5deg)}}',

    /* ============ THE CITY, SCENE-FIRST (the Civ screen) ============
       Inside a city the painting is no longer a banner — it is the whole
       game surface. Full 3:2 frame; the people, the decisions and the doors
       all live ON it; the text below is the detail layer, not the game. */
    '.sab-scene .sab-hero{aspect-ratio:3/2;max-height:none}',
    '@media (min-width:900px){.sab-scene .sab-hero{max-height:480px;width:100%;object-fit:cover}}',
    /* the city banner, Civ-style, top centre */
    '.sab-nameplate{position:absolute;top:2.2%;left:50%;transform:translateX(-50%);text-align:center;' +
      'background:rgba(22,17,44,.58);color:#fff;padding:5px 16px;border-radius:999px;pointer-events:none;max-width:78%}',
    '.sab-nameplate b{font:800 15px/1.15 var(--display,Georgia,serif);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sab-nameplate span{font-size:10px;font-weight:700;opacity:.92;letter-spacing:.03em}',
    /* job stations: the four kinds of praja stand at their corners of the
       city, count on their shoulder — tap one to reach the allocation tiles */
    '.sab-station{pointer-events:auto;position:absolute;width:17%;min-width:56px;min-height:52px;border:0;' +
      'background:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;padding:0;' +
      'color:#fff;font:700 10px var(--body,system-ui)}',
    '.sab-station img{height:46px;width:auto;filter:drop-shadow(0 2px 3px rgba(0,0,0,.42));animation:sabbob 1.7s ease-in-out infinite}',
    '.sab-station b{position:absolute;top:-6px;right:16%;min-width:21px;height:21px;border-radius:999px;padding:0 4px;' +
      'background:var(--accent);color:#fff;font:800 12px/21px var(--body,system-ui);border:2px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,.3)}',
    '.sab-station i{font-style:normal;background:rgba(22,17,44,.6);padding:1px 7px;border-radius:999px;white-space:nowrap}',
    '.sab-station:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:12px}',
    /* the calls of the moment ride the sky: quest, quarrel, great one */
    '.sab-cbadge{pointer-events:auto;position:absolute;top:11%;min-width:48px;min-height:48px;border:0;border-radius:14px;' +
      'cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px 9px;' +
      'background:rgba(255,251,238,.94);box-shadow:0 3px 10px rgba(0,0,0,.28);font:800 9.5px var(--body,system-ui);' +
      'color:var(--text);animation:sabbadge 2.2s ease-in-out infinite}',
    '.sab-cbadge em{font-style:normal;font-size:19px;line-height:1.1}',
    '.sab-cbadge.hot{background:var(--accent3);color:#fff;animation:sabbadgehot 1.1s ease-in-out infinite}',
    '.sab-cbadge:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '@keyframes sabbadge{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
    '@keyframes sabbadgehot{0%,100%{transform:scale(1)}50%{transform:scale(1.09)}}',
    /* the scaffold IS the build-the-monument button; it glows when the coins reach */
    '.sab-scafbtn{pointer-events:auto;position:absolute;left:50%;bottom:16%;height:52%;transform:translateX(-50%);' +
      'border:0;background:none;padding:0;cursor:pointer}',
    '.sab-scafbtn:disabled{cursor:default}',
    '.sab-scafbtn img{height:100%;width:auto;filter:drop-shadow(0 4px 10px rgba(0,0,0,.35))}',
    '.sab-scafbtn.can img{animation:sabglow 1.6s ease-in-out infinite}',
    '@keyframes sabglow{0%,100%{filter:drop-shadow(0 4px 10px rgba(0,0,0,.35))}50%{filter:drop-shadow(0 0 20px rgba(255,215,110,.95))}}',
    '.sab-scafbtn em{position:absolute;left:50%;bottom:-7px;transform:translateX(-50%);font-style:normal;' +
      'background:rgba(255,251,238,.94);color:#4a3810;padding:2px 9px;border-radius:999px;' +
      'font:700 10px var(--body,system-ui);white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.25)}',
    '.sab-scafbtn:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:12px}',
    /* hearth smoke, and a cart crossing the street — the town breathes */
    '.sab-smoke{position:absolute;width:22px;height:22px;border-radius:50%;pointer-events:none;' +
      'background:radial-gradient(circle,rgba(244,242,248,.55),rgba(244,242,248,0) 68%);animation:sabsmoke 6.5s ease-in infinite}',
    '@keyframes sabsmoke{0%{opacity:0;transform:translateY(0) scale(.45)}20%{opacity:.75}100%{opacity:0;transform:translateY(-54px) scale(1.7)}}',
    '.sab-cross{position:absolute;bottom:13.5%;left:-24%;height:15%;width:auto;pointer-events:none;' +
      'filter:drop-shadow(0 2px 3px rgba(0,0,0,.35));animation:sabwalk 38s linear infinite}',
    /* the great one standing in the city, and their face on the hero card */
    '.sab-herostand img{height:52px;animation:sabglow 2.2s ease-in-out infinite}',
    '.sab-heroface{width:62px;height:auto;float:left;margin:0 10px 4px 0;' +
      'filter:drop-shadow(0 2px 4px rgba(30,20,64,.25))}',
    /* khazana: the treasure spot and the whispered hint */
    '.sab-trespot{pointer-events:auto;position:absolute;width:46px;height:46px;margin:-23px 0 0 -23px;' +
      'border:0;background:none;cursor:pointer;display:grid;place-items:center}',
    '.sab-trespot .glint{font-size:13px;color:#ffe9a8;opacity:0;text-shadow:0 0 6px rgba(255,215,110,.9);' +
      'animation:sabglint 5s ease-in-out infinite}',
    '@keyframes sabglint{0%,72%,100%{opacity:0;transform:scale(.6) rotate(0deg)}80%{opacity:.95;transform:scale(1.15) rotate(40deg)}88%{opacity:0;transform:scale(.6) rotate(80deg)}}',
    '.sab-trespot:focus-visible{outline:3px solid var(--accent2);outline-offset:-6px;border-radius:50%}',
    '.sab-treshint{font-size:12px;color:var(--muted);margin:4px 0 0;font-style:italic}',
    /* standers: most praja stand about their work, swaying gently */
    '.sab-stand{position:absolute;width:auto;filter:drop-shadow(0 2px 2px rgba(0,0,0,.3));' +
      'animation:sabsway 5s ease-in-out infinite;transform-origin:50% 100%}',
    '@keyframes sabsway{0%,100%{transform:rotate(-1.4deg)}50%{transform:rotate(1.4deg)}}',
    /* the stations carry the \u2212/+ now \u2014 the allocation lives on the plate */
    '.sab-station .srow{display:flex;gap:5px;margin-top:2px}',
    '.sab-station .pm{min-width:40px;min-height:40px;border:0;border-radius:13px;cursor:pointer;' +
      'background:rgba(255,251,238,.94);color:#4a3810;font:800 17px/1 var(--body,system-ui);' +
      'box-shadow:0 2px 6px rgba(0,0,0,.28)}',
    '.sab-station .pm:disabled{opacity:.45;cursor:default}',
    '.sab-station .pm:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    /* milestone chips: one quiet line where three tall rows stood */
    '.sab-mile{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 4px}',
    '.mch{font:700 11.5px/1.3 var(--body,system-ui);padding:5px 11px;border-radius:999px;' +
      'border:1px solid var(--line);color:var(--muted);background:var(--card,#fff)}',
    '.mch.done{color:var(--accent);border-color:var(--accent)}',
    '.mch.next{color:var(--text);border-color:var(--accent2);box-shadow:0 0 0 2px rgba(240,180,80,.25)}',
    '.mch.star{color:var(--accent2);border-color:var(--accent2);font-weight:800}',
    /* the crown badge wears its price; a disabled badge stands quiet */
    '.sab-cbadge u{text-decoration:none;font-style:normal;font-size:8px;line-height:1.1;opacity:.85}',
    '.sab-cbadge.cap{animation:none}',   /* permanent chrome holds still */
    '.sab-cbadge:disabled{opacity:.55;cursor:default;animation:none}',
    /* WALK MODE: the yatri stands ON the plate and walks where you tap;
       the camera (a gentle zoom on the whole painted world) eases after
       them, clamped so the plate always fills the frame edge to edge.
       UI chrome (nameplate, stations, badges) lives OUTSIDE the camera
       so nothing a child must tap ever crops away. */
    '.sab-cam{position:relative;transform-origin:50% 60%;transition:transform 1.1s ease;will-change:transform}',
    '.sab-cam .sab-hero{display:block}',
    '.sab-yatri{position:absolute;width:0;height:0;z-index:6;pointer-events:none}',
    '.sab-yatri img{position:absolute;left:-15px;bottom:-3px;height:48px;width:auto;' +
      'filter:drop-shadow(0 3px 5px rgba(0,0,0,.45))}',
    '.sab-yatri.flip{transform:scaleX(-1)}',
    '.sab-yatri.walking img{animation:sabtrot .45s ease-in-out infinite alternate}',
    '@keyframes sabtrot{from{transform:translateY(0)}to{transform:translateY(-4px)}}',
    /* the built gurukul is the teacher\'s own door — a bell rings when ready */
    '.sab-plot.teach{pointer-events:auto}',
    '.sab-plot .pbell{position:absolute;top:-8px;right:8%;font-size:13px;background:var(--accent2);border-radius:999px;' +
      'width:24px;height:24px;line-height:24px;text-align:center;border:2px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,.3);' +
      'animation:sabbadge 1.5s ease-in-out infinite}',
    '.sab-bird{position:absolute;top:10%;left:-8%;width:26px;opacity:.8;animation:sabfly 24s linear infinite}',
    '@keyframes sabfly{0%{left:-8%;top:14%}50%{top:6%}100%{left:104%;top:11%}}',
    /* the age tints the land, gently — terrain wash only, never territory */
    '#sab-terrg{transition:filter 2s}',
    '.sab-e1 #sab-terrg{filter:sepia(.06) saturate(1.04)}',
    '.sab-e2 #sab-terrg{filter:sepia(.1) hue-rotate(-6deg) saturate(1.06)}',
    '.sab-e3 #sab-terrg{filter:sepia(.05) hue-rotate(4deg) saturate(1.1)}',
    '.sab-e4 #sab-terrg{filter:saturate(1.14) brightness(1.02)}',
    '.sab-e5 #sab-terrg{filter:sepia(.08) hue-rotate(-4deg) saturate(1.08)}',
    '.sab-e6 #sab-terrg{filter:sepia(.12) saturate(1.1) brightness(1.01)}',
    '.sab-e7 #sab-terrg{filter:sepia(.06) hue-rotate(5deg) saturate(1.12)}',
    '.sab-e8 #sab-terrg{filter:hue-rotate(-7deg) saturate(1.08)}',
    '.sab-e9 #sab-terrg{filter:sepia(.1) saturate(.98) brightness(.99)}',
    '.sab-e10 #sab-terrg{filter:sepia(.04) saturate(1.06) brightness(1.01)}',
    '.sab-e11 #sab-terrg{filter:hue-rotate(4deg) saturate(1.12) brightness(1.02)}',
    '.sab-e12 #sab-terrg{filter:saturate(1.18) brightness(1.04)}',

    '@media (prefers-reduced-motion: reduce){.sab-route.live,.sab-lamp,.sab-exwalk image,' +
      '.sab-mistdrift ellipse,.sab-diya,.sab-swirl,.sab-ringfx,.sab-walker,.sab-bird,' +
      '.sab-plot.rise img,.sab-moor,.sab-station img,.sab-herostand img,.sab-cbadge,.sab-scafbtn.can img,.sab-trespot .glint,' +
      '.sab-smoke,.sab-cross,.sab-plot .pbell,.sab-yatri.walking img,.sab-stand,' +
      '.sab-greens polygon,.sab-raksha{animation:none}' +
      '.sab-trespot .glint{opacity:.55}.sab-cam{transition:none}.sab-tray{animation:none}}'   /* still findable when nothing may move */
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
               tech: {}, proj: null, rt: 0, warn: null, wonders: {}, capital: null, disp: null, lastd: 0, quizAt: {}, quizN: 0,
               kingdoms: {}, lastraid: 0, explorers: [],
               darshan: {}, sutra: {}, tre: {}, lastakal: 0, lastdarshan: 0, calmUntil: 0 };
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
    /* CITIES RENAME ACROSS THE AGES — that is the truth of Indian cities:
       Pataliputra answers to Patna, Kashi to Banaras to Varanasi, Bombay to
       Mumbai. nameOf() gives the name the current age uses; the old names
       are announced when the age turns, never erased. */
    function nameOf(s) {
      var n = s.name;
      (s.renames || []).forEach(function (r) { if (r.era <= G.era) n = r.name; });
      return n;
    }
    /* HERITAGE — the answer to "too many cities". Two full ages after its own,
       an awake city folds into memory: its people walk to a living neighbour
       (which grows), its monument keeps shining and still earns katha, and
       nothing there needs tending again. The causes are the ages themselves —
       rivers shift, rains move, roads go elsewhere — NEVER war (docs/05 §7:
       the only antagonist in this game is the impersonal mist). */
    function isHer(id) { var q = G.sites[id]; return !!(q && q.her); }
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
      if (isHer(id)) return out;      /* memory has no chores */
      if (inDispute(id)) out.push({ act: 'cjump', t: 'sab-sec-quarrel', icon: 'peace', name: 'Panchayat', hot: true });
      if (G.quests[id]) out.push({ act: 'cjump', t: 'sab-sec-quest', icon: 'scroll', name: 'Quest' });
      var q = G.sites[id];
      if (q && !q.zzz) {
        if (q.lv >= 3 && !q.mon && canPay(costOf(T.monCost[byId[id].era], 'monument')))
          out.push({ act: 'mon', t: 'sab-sec-works', icon: 'temple', name: 'Monument' });
        if (q.bld.gurukul && (G.quizAt[id] || -999) + T.quizCd - G.t <= 0)
          out.push({ act: 'quizstart', t: 'sab-sec-guru', icon: 'book', name: 'Teacher' });
        if (q.hero) out.push({ act: 'cjump', t: 'sab-sec-hero', icon: 'star', name: 'Great one' });
      }
      return out;
    }

    function artOf(id) {
      var m = W.IND_SABHYATA_ART || [];
      return m.indexOf(id) >= 0 ? 'art/sabhyata/' + id + '.jpg' : null;
    }
    /* THE SPRITES (tools/gen-sabhyata-sprites.py) — the little painted figures
       that make the board live: carts on the roads, boats on the rivers,
       walking explorers, towns that visibly grow, praja crossing their own
       city painting. Same fallback contract as the paintings: no manifest
       entry, no sprite, and the plain shapes carry on — a missing file is a
       quieter board, never a broken one. All motion is the game's own
       (transform animation over a fixed still), never generated. */
    function spOf(id) {
      var m = W.IND_SABHYATA_SPRITES || [];
      return m.indexOf(id) >= 0 ? 'art/sabhyata/sp/' + id + '.png' : null;
    }
    /* THE COMPANION COMES ALONG (the character framework): the child's chosen
       buddy joins the yatra. A fictional tales-shelf buddy IS the walking
       piece — the tortoise explores India. A sacred figure or a real person
       travels AT the explorer's side as a small companion chip, never as the
       piece. */
    function buddyPiece() {
      try {
        var bid = (W.BI && W.BI.S && W.BI.S.buddy) || null;
        if (!bid || !W.IND_ART_SRC) return null;
        var src = W.IND_ART_SRC(bid);
        if (!src) return null;
        return { src: src, tier: (W.IND_BUDDY_TIER && W.IND_BUDDY_TIER(bid)) || 'tales' };
      } catch (e) { return null; }
    }
    /* mid-run rewards go to the shell's economy through one capped event */
    function grant(n, why) {
      try { W.dispatchEvent(new CustomEvent('ind-reward', { detail: { n: n, why: why } })); } catch (e) {}
    }
    /* THE DIORAMAS (tools/gen-sabhyata-dioramas.py): the same city as a tilted
       board-game plate — high three-quarter view, terrain to the edges, the
       monument at the centre by compositional contract. The city scene prefers
       the plate; the eye-level painting stays as the fallback and as the card
       art on wake overlays. */
    /* THE TEST RENDERER. With the kit switched on, a city is not a painting
       with sprites pinned to it — it is built, cell by cell, out of the parts
       in tools/city-kit.json. Everything the game already knows stays true:
       the building sites, the monument and the yatri are traced in plate
       percent, and kitPt puts each one on the very cell the ground under it
       was built from, so nothing drifts. Off by default; ?kit=1 turns it on
       and the painted plate comes straight back when it is off. */
    function kitOn(id) {
      return !!(W.IND_KIT_MODE && W.IND_KIT && W.IND_KIT_CITIES &&
                W.IND_KIT_CITIES[id] && W.IND_KIT.def('hs-hut-round'));
    }

    /* ============================================================
       THE CITY IS BUILT, NOT FOUND.
       The land is free — its ground, its water, its streets, its trees. Every
       building on it was bought by a child and put somewhere on purpose, and
       every one of them gives the city something back every turn. What is on
       offer is the city's own: its age, how far it has grown, what it is FOR,
       and in a few cases the one thing only that city ever had.
       ============================================================ */
    /* How much room there is. Asked in two places — the city render and the
       shelf, which are different functions — so it is one helper, not a local
       that only one of them can see. */
    function tightScreen() { return (W.innerWidth || 1024) < 700; }

    var BUILD = W.IND_KIT_BUILD || { items: [], groups: [], reach: {} };
    var BY_PART = {};
    (BUILD.items || []).forEach(function (it) { BY_PART[it.p] = it; });

    function kitOf(id) {                    /* what this city has built */
      var q = G.sites[id];
      if (!q.kit) q.kit = [];
      if (!q.tiles) q.tiles = {};
      return q;
    }

    function reachOf(id) {
      var q = G.sites[id];
      return (BUILD.reach && BUILD.reach[q.lv]) || 5;
    }

    /* Everything a child may be shown for THIS city, right now. Four gates,
       and the last one is the reason Dholavira's reservoirs are not on
       Vaishali's menu. */
    function offered(id) {
      var q = G.sites[id], x = byId[id];
      return (BUILD.items || []).filter(function (it) {
        if (x.era < it.era[0] || x.era > it.era[1]) return false;
        if (G.era < it.era[0]) return false;
        if (q.lv < it.lv) return false;
        if (it.kind !== '*' && it.kind !== x.kind) return false;
        if (it.only && it.only.indexOf(id) < 0) return false;
        return true;
      });
    }

    function builtCount(id, p) {
      var q = kitOf(id), n = 0;
      q.kit.forEach(function (b) { if (b.p === p) n++; });
      return n;
    }

    /* Can this piece stand on this cell? Six ways to say no, and the caller
       shows the child whichever one applies rather than a dead tap. */
    function canPlace(id, it, cx, cy) {
      var K2 = W.IND_KIT, q = kitOf(id), def = K2 && K2.def(it.p);
      if (!def) return 'no such piece';
      if (K2.reach(id, cx, cy) > reachOf(id)) return 'too far out — the city has not grown that way yet';
      var L = def.d[0] || 1, B = def.d[1] || 1, a, b2;
      for (a = 0; a < L; a++) {
        for (b2 = 0; b2 < B; b2++) {
          var t = K2.terrain(id, cx + a, cy + b2);
          if (!t) return 'off the edge of the land';
          if (it.on === 'road' && t !== 'road') return 'this one belongs on the street';
          if (it.on !== 'road' && t === 'road') return 'not across the street';
          if (t === 'water') return 'that is water';
          if (it.on === 'shore' && K2.terrain(id, cx, cy) !== 'shore')
            return 'it must touch the water';
          if (occupied(id, cx + a, cy + b2)) return 'something already stands there';
        }
      }
      /* `only` fences a thing to its city; `many` says the city may have as
         many as it likes. A crop belongs to one city AND is sown all over it. */
      if (it.only && !it.many && builtCount(id, it.p) >= 1)
        return 'a city has only one of these';
      if (!canPay(costOf(it.cost, 'building'))) return 'not enough yet';
      return null;
    }

    function occupied(id, cx, cy) {
      var q = kitOf(id), K2 = W.IND_KIT, hit = false;
      var all = q.kit.concat(((W.IND_KIT_CITIES || {})[id] || {}).wild || []);
      all.forEach(function (b) {
        if (hit) return;
        var d = K2.def(b.p); if (!d) return;
        var L = d.d[0] || 1, B = d.d[1] || 1;
        if (cx >= b.x && cx < b.x + L && cy >= b.y && cy < b.y + B) hit = true;
      });
      return hit;
    }

    /* what the built city adds, every turn, forever */
    function kitYield(id) {
      var q = kitOf(id), out = { anna: 0, kala: 0, katha: 0 };
      q.kit.forEach(function (b) {
        var it = BY_PART[b.p]; if (!it || !it.give) return;
        ['anna', 'kala', 'katha'].forEach(function (k) {
          if (it.give[k]) out[k] += it.give[k];
        });
      });
      return out;
    }

    function kitPop(id) {
      var q = kitOf(id), n = 0;
      q.kit.forEach(function (b) {
        var it = BY_PART[b.p]; if (it && it.pop) n += it.pop;
      });
      return n;
    }

    function kitWatch(id) {
      var q = kitOf(id), n = 0;
      q.kit.forEach(function (b) {
        var it = BY_PART[b.p]; if (it && it.watch) n += it.watch;
      });
      return n;
    }

    /* the piece the child is holding, and where it would land */
    var hold = null;    /* { p, cell:{x,y}, f } */
    var lastTap = { id: null, t: 0 };   /* for the double tap, counted by us */

    function kitPt(id, at) {
      if (!at || !kitOn(id)) return at;
      return W.IND_KIT.mapPct(id, at[0], at[1], G.kitRot || 0, KIT_HEAD);
    }

    var KIT_HEAD = 5;   /* sky above the tallest piece, in height units */

    function kitBoard(id) {
      var q = kitOf(id);
      var ghost = null;
      if (hold && hold.cell) {
        ghost = { p: hold.p, x: hold.cell.x, y: hold.cell.y, f: hold.f || 0,
                  ok: !canPlace(id, BY_PART[hold.p], hold.cell.x, hold.cell.y) };
      }
      var r = W.IND_KIT.city(id, {
        rot: G.kitRot || 0, scale: 1, headroom: KIT_HEAD, pad: 0,
        built: q.kit, tiles: q.tiles, reach: reachOf(id), ghost: ghost
      });
      return '<div class="sab-hero sab-kitboard"><div class="sab-kitinner" id="sab-kitinner"' +
        ' data-z="' + (G.kitZ || 1) + '" style="width:' + r.w + 'px;height:' + r.h +
        'px">' + r.html + '</div></div>';
    }

    /* THE SHOP IS A DRAWER, not a page. Forty-three rows down the page pushed
       the city off the screen, and you cannot place a thing you cannot see.
       So: a handle on the board, and when it is pulled, one shelf of icon
       tiles across the bottom — art, name, price, what it gives. The board
       stays visible above it, because the board is the point. */
    /* GROWING IS A CITY THING, AND EVERY CITY CAN DO IT.
       It used to sit on the realm map beside Route and Utsav, which are realm
       things; a level is the city's own reach and its own menu, so it is
       decided while looking at the city. Moving it, though, it was parked
       inside the build shelf — and the build shelf only exists on the kit
       board, for eight cities, behind ?kit=1. Everywhere else growing simply
       vanished. It lives on its own now, so the city view can always show it
       whatever is drawing the city. */
    function growBtn(id) {
      var q = kitOf(id), x = byId[id];
      if (!q || q.lv >= T.maxLevel || q.zzz || q.her) return '';
      var gc = costOf({ anna: T.growCost[q.lv] }, 'grow');
      return '<button class="sab-grow' + (canPay(gc) ? ' can' : '') +
        '" data-sab-act="grow"' + (canPay(gc) ? '' : ' disabled') +
        ' aria-label="Grow ' + esc(nameOf(x)) + ' to level ' + (q.lv + 1) +
        ' — the land it may build on widens, and more is offered. Costs ' +
        esc(costStr(gc)) + '">\u2b06 Grow to level ' + (q.lv + 1) +
        '<em>' + esc(costStr(gc)) + '</em></button>';
    }

    function kitDrawer(id) {
      var q = kitOf(id), x = byId[id], list = offered(id);
      var narrow = tightScreen();
      /* a city with nothing left on offer still has a level to gain, so the
         shelf standing empty must not take Grow down with it */
      if (!list.length) return growBtn(id);
      var open = !!G.kitOpen;
      var byG = {};
      list.forEach(function (it) { (byG[it.g] = byG[it.g] || []).push(it); });
      var groups = (BUILD.groups || []).filter(function (g) { return byG[g[0]]; });
      if (!groups.length) return growBtn(id);
      var tab = (G.kitTab && byG[G.kitTab]) ? G.kitTab : groups[0][0];
      var held = hold ? W.IND_KIT.def(hold.p) : null;

      var grow = growBtn(id);

      var handle = '<button class="sab-dhandle' + (open ? ' open' : '') +
        '" data-sab-act="kitopen" aria-expanded="' + open + '"' +
        ' aria-label="' + (open ? 'Close the build shelf' : 'Open the build shelf \u2014 ' +
          list.length + ' things this city may build') + '">' +
        (held ? '<img src="' + (W.IND_KIT.src(hold.p, 0) || '') + '" alt="">' : '<em>\u271a</em>') +
        '<b>' + (held ? esc(held.name) : 'Build') + '</b></button>';
      if (!open) return handle + grow;

      var tabs = groups.map(function (g) {
        return '<button class="sab-dtab' + (g[0] === tab ? ' on' : '') +
          '" data-sab-act="kittab" data-g="' + g[0] + '"' +
          ' aria-label="' + esc(g[1]) + ' \u2014 ' + esc(g[2]) + '">' + esc(g[1]) +
          '<i>' + byG[g[0]].length + '</i></button>';
      }).join('');

      var tiles = byG[tab].map(function (it) {
        var def = W.IND_KIT.def(it.p), n = builtCount(id, it.p);
        var done = it.only && !it.many && n >= 1;
        var poor = !done && !canPay(costOf(it.cost, 'building'));
        var give = ['anna', 'kala', 'katha'].filter(function (k) { return it.give && it.give[k]; })
          .map(function (k) { return '+' + it.give[k] + ICON[k]; }).join(' ');
        if (it.pop) give += (give ? ' ' : '') + '+' + it.pop + '\ud83d\udc64';
        return '<button class="sab-tile' + (hold && hold.p === it.p ? ' on' : '') +
          (poor ? ' poor' : '') + '" data-sab-act="kitpick" data-p="' + it.p + '"' +
          (done ? ' disabled' : '') +
          ' aria-label="' + esc(def ? def.name : it.p) + '. ' + esc(it.what) +
          ' Costs ' + esc(costStr(costOf(it.cost, 'building'))) +
          (done ? '. Already built.' : poor ? '. Not enough yet.' : '') + '">' +
          /* a crop's tile shows the crop: the piece art for a field is the flat
             ground tile, which tells a child nothing about what they are sowing */
          '<span class="art' + (it.tile ? ' crop' : '') + '"><img src="' +
          ((it.tile && W.IND_KIT.hasField(it.p) ? 'art/kit/_ground/' + it.p + '.jpg'
            : W.IND_KIT.src(it.p, 0)) || '') + '" alt="">' +
          (n ? '<u>' + n + '</u>' : '') + '</span>' +
          '<b>' + esc(def ? def.name : it.p) + '</b>' +
          '<span class="c">' + esc(costStr(costOf(it.cost, 'building'))) + '</span>' +
          (give ? '<span class="g">' + give + '</span>' : '') + '</button>';
      }).join('');

      return handle +
        '<div class="sab-drawer" id="sab-sec-build" role="group" aria-label="Build">' +
          /* On a phone the tab row cannot carry the reach readout and Grow as
             well; squeezed onto one line the tabs shrank to two letters. There,
             Grow takes its own line and the readout goes, because the tabs are
             what the row is for. */
          '<div class="sab-dhead"><div class="sab-dtabs">' + tabs + '</div>' +
          (narrow ? '' : '<span class="sab-dhint" title="How far from the city\u2019s heart it may build">lv ' +
            q.lv + ' \u00b7 reach ' + reachOf(id) + '</span>' + grow) +
          '<button class="sab-dclose" data-sab-act="kitopen" aria-label="Close the build shelf">\u2715</button></div>' +
          (narrow && grow ? '<div class="sab-drow">' + grow + '</div>' : '') +
          (held ? '<div class="sab-dhold" role="status">Holding <b>' + esc(held.name) +
            '</b> \u00b7 tap the land' +
            '<button class="sab-btn" data-sab-act="kitturnp">Turn</button>' +
            '<button class="sab-btn" data-sab-act="kitdrop">Put back</button></div>' : '') +
          '<div class="sab-dtiles">' + tiles + '</div>' +
        '</div>';
    }

    function dioOf(id) {
      var m = W.IND_SABHYATA_DIO || [];
      return m.indexOf(id) >= 0 ? 'art/sabhyata/dio/' + id + '.jpg' : null;
    }
    /* per-city anchor tuning against the plates: where the contract and the
       painting disagree (a monument that landed off-centre, a moor that wants
       the other bank), the override wins. Styles are inline CSS fragments. */
    /* ==================================================================
       THE PLATE ATLAS — data-plates.js traced off every painting.

       Before this, the praja were scattered at random percentages and strolled
       in straight lines across roofs, water and fields alike. Now every plate
       carries its own vector map: the roads are the only ground anyone walks,
       the greens breathe where the painter put greenery, and the monument
       rises on its painted spot. A plate with no atlas keeps the old free
       walk, so a new painting is never broken.
       ================================================================== */
    function plateOf(id) {
      var A = W.IND_PLATES || {};
      var a = A[id];
      return (a && a.roads && a.roads.length) ? a : null;
    }
    var SNAP = 2.4;      /* road points this close are the same junction */
    var graphCache = {};
    function roadGraph(id) {
      if (graphCache[id]) return graphCache[id];
      var a = plateOf(id); if (!a) return null;
      var nodes = [], adj = [];
      function nodeAt(x, y) {
        for (var i = 0; i < nodes.length; i++) {
          if (Math.abs(nodes[i][0] - x) < SNAP && Math.abs(nodes[i][1] - y) < SNAP) return i;
        }
        nodes.push([x, y]); adj.push([]); return nodes.length - 1;
      }
      a.roads.forEach(function (rd) {
        var prev = -1;
        rd.forEach(function (pt) {
          var i = nodeAt(pt[0], pt[1]);
          if (prev >= 0 && prev !== i) {
            var w = Math.hypot(nodes[i][0] - nodes[prev][0], nodes[i][1] - nodes[prev][1]);
            adj[prev].push({ to: i, w: w }); adj[i].push({ to: prev, w: w });
          }
          prev = i;
        });
      });
      return (graphCache[id] = { nodes: nodes, adj: adj });
    }
    function nearestNode(g, x, y) {
      var best = -1, bd = 1e9;
      for (var i = 0; i < g.nodes.length; i++) {
        var d = Math.hypot(g.nodes[i][0] - x, g.nodes[i][1] - y);
        if (d < bd) { bd = d; best = i; }
      }
      return { i: best, d: bd };
    }
    /* Dijkstra over the little road graph — a few dozen nodes, so it is
       instant and the walk always follows a street that exists */
    function roadPath(g, a, b) {
      if (a === b) return [a];
      var N = g.nodes.length, dist = [], prev = [], seen = [], i;
      for (i = 0; i < N; i++) { dist.push(1e9); prev.push(-1); seen.push(false); }
      dist[a] = 0;
      for (var k = 0; k < N; k++) {
        var u = -1, bd = 1e9;
        for (i = 0; i < N; i++) if (!seen[i] && dist[i] < bd) { bd = dist[i]; u = i; }
        if (u < 0 || u === b) break;
        seen[u] = true;
        for (i = 0; i < g.adj[u].length; i++) {
          var e = g.adj[u][i];
          if (dist[u] + e.w < dist[e.to]) { dist[e.to] = dist[u] + e.w; prev[e.to] = u; }
        }
      }
      if (dist[b] >= 1e9) return null;
      var out = [], c = b;
      while (c >= 0) { out.unshift(c); c = prev[c]; }
      return out;
    }
    /* one @keyframes per road, so a walker paces a real street in pure CSS —
       no per-frame JS, and a repaint never resets anybody mid-stride */
    function roadKeyframes(id) {
      var a = plateOf(id); if (!a) return '';
      return a.roads.map(function (rd, ri) {
        var L = 0, d = [0], i;
        for (i = 1; i < rd.length; i++) {
          L += Math.hypot(rd[i][0] - rd[i - 1][0], rd[i][1] - rd[i - 1][1]); d.push(L);
        }
        if (!L) return '';
        var fwd = rd.map(function (pt, i2) {
          return (d[i2] / L * 50).toFixed(2) + '%{left:' + pt[0] + '%;top:' + pt[1] + '%}';
        }).join('');
        var back = rd.slice().reverse().map(function (pt, i2) {
          var dd = L - d[rd.length - 1 - i2];
          return (50 + dd / L * 50).toFixed(2) + '%{left:' + pt[0] + '%;top:' + pt[1] + '%}';
        }).join('');
        return '@keyframes sabrd-' + id + '-' + ri + '{' + fwd + back + '}';
      }).join('');
    }
    /* the green places breathe: a soft leaf-coloured wash over the polygons
       the painter filled with garden, grove, field and orchard */
    function greenLayer(id) {
      var a = (W.IND_PLATES || {})[id];
      if (!a || !a.greens || !a.greens.length) return '';
      return '<svg class="sab-greens" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
        a.greens.map(function (poly, i) {
          return '<polygon points="' + poly.map(function (pt) { return pt[0] + ',' + pt[1]; }).join(' ') +
            '" style="animation-delay:-' + (i * 1.7).toFixed(1) + 's"/>';
        }).join('') + '</svg>';
    }
    var DIO_TUNE = {
      /* Ajanta's "monument" is the cave crescent in the upper half of its
         plate; the bamboo stands against the cliff, not in the gorge */
      ajanta: { scaf: 'bottom:34%;height:42%' }
    };
    /* respect the system's reduced-motion ask: the world stands calm and the
       game plays identically — every mover is presentation, never state */
    var REDUCED = !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches);
    /* which built buildings this sitting has already seen standing, so the
       rise animation greets a NEW building once and never replays on a loaded
       save or a routine repaint */
    var bldSeen = null;
    function bldSeenInit() {
      if (bldSeen) return;
      bldSeen = {};
      SITES.forEach(function (s2) {
        var q2 = G.sites[s2.id];
        if (q2 && q2.bld) {
          for (var b2 in q2.bld) { if (q2.bld[b2]) bldSeen[s2.id + ':' + b2] = 1; }
        }
      });
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
      if (kind === 'route' && G.tech.railway) f = f / 2;     /* iron roads stack */
      if (kind === 'utsav' && G.tech.chahbagh) f = 1 / 2;    /* the town is already outdoors */
      var out = {};
      Object.keys(c).forEach(function (k) { out[k] = Math.ceil(c[k] * f); });
      return out;
    }
    function canPay(c) { return Object.keys(c).every(function (k) { return G.res[k] >= c[k]; }); }
    function pay(c) { Object.keys(c).forEach(function (k) { G.res[k] -= c[k]; }); }
    /* the utsav's price goes through the same discount door as everything
       else — the Char Bagh halves it */
    function utsavCost() { return costOf(T.utsavCost, 'utsav'); }
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
      return !q.zzz && !q.her && !q.mon && G.capital !== id && q.neg >= negLimit(id);
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
      /* every home built is one more pair of hands — the reason a child
         builds huts before they build anything clever */
      return 2 + q.lv * 2 + (q.bld.granary ? 1 : 0) +
             (W.IND_KIT_MODE ? kitPop(id) : 0);
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
      /* a heritage city asks nothing and gives one thing: its monument keeps
         telling its story. Stone remembers — that rule outlives the city. */
      if (q.her) return q.mon ? { anna: 0, kala: 0, katha: 1 } : null;
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
      /* what was BUILT on the board pays out too — a wheat field is not
         scenery, it is one more 🌾 every turn for as long as it is sown */
      if (W.IND_KIT_MODE) {
        var ky = kitYield(x.id);
        out.anna += ky.anna; out.kala += ky.kala; out.katha += ky.katha;
      }
      if (q.bld.granary) out.anna += 1;
      if (q.bld.workshop) out.kala += 1;
      if (q.bld.gurukul) out.katha += 1;
      if (q.bld.bazaar && conn) { out.anna += 1; out.kala += 1; out.katha += 1; }
      if (G.tech.plough && x.kind === 'kheti') out.anna += 1;
      if (G.tech.iron && x.kind === 'shilpa') out.kala += 1;
      if (G.tech.zero && x.kind === 'vidya') out.katha += 1;
      if (G.tech.monsoon && conn && PORTS.indexOf(x.id) >= 0) { out.anna += 2; out.kala += 2; out.katha += 2; }
      /* the later ladder's doors */
      if (G.tech.paper && x.kind === 'vidya') out.katha += 1;
      if (G.tech.charkha && x.kind === 'shilpa') out.kala += 1;
      if (G.tech.ship && conn && PORTS.indexOf(x.id) >= 0) { out.anna += 1; out.kala += 1; out.katha += 1; }
      if (G.tech.harit && x.kind === 'kheti') out.anna += 2;
      /* what the land itself gives, once a scout has found it */
      var wg = wonderYield(x.id);
      out.anna += wg.anna; out.kala += wg.kala; out.katha += wg.katha;
      if (q.mon) out.katha += 2;
      if (G.capital === x.id) { out.anna += 1; out.kala += 1; out.katha += 1; }
      /* an akal (drought) halves the fields until the rains return */
      if (q.dry > 0) out.anna = Math.floor(out.anna / 2);
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
        return inEra(x) && awake(x.id) && !isHer(x.id) && !G.quests[x.id];
      });
      if (!homes.length) return;
      var here = homes[(G.t * 13) % homes.length];
      var kinds = [];
      var sleeping = SITES.filter(function (x) { return onMap(x) && !awake(x.id); });
      var unroaded = SITES.filter(function (x) {
        return inEra(x) && awake(x.id) && !isHer(x.id) && x.id !== here.id && !routed(here.id, x.id);
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
      var m3 = SITES.filter(function (x) { return inEra(x) && awake(x.id) && !isHer(x.id) && G.sites[x.id].lv >= 3 && !G.sites[x.id].mon; })[0];
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
      /* the town is a painted sprite when one exists — the circles stay for the
         hit area, the halo cues and the lamp glowing at its foot; the sprite
         itself grows with level in paintSite */
      var csp = spOf('city1');
      return '<g class="sab-site" id="sab-' + s.id + '" data-sab="' + s.id + '" tabindex="-1" role="button" aria-label="' + esc(s.name) + '">' +
        '<circle class="hit" cx="' + s.x + '" cy="' + s.y + '" r="' + (r + 18) + '" fill="none"/>' +
        '<circle class="halo" cx="' + s.x + '" cy="' + s.y + '" r="' + (r + 12) + '" fill="none"/>' +
        '<circle class="mistv sab-mist" cx="' + s.x + '" cy="' + s.y + '" r="46"/>' +
        '<circle class="ring r2" cx="' + s.x + '" cy="' + s.y + '" r="' + (r + 5) + '"/>' +
        '<circle class="ring r3" cx="' + s.x + '" cy="' + s.y + '" r="' + (r + 10) + '"/>' +
        (csp ? '<image class="sab-cityimg" href="' + csp + '" x="' + (s.x - 24) + '" y="' + (s.y - 36) +
          '" width="48" height="40" preserveAspectRatio="xMidYMax meet"/>' : '') +
        '<circle class="core sab-lamp" cx="' + s.x + '" cy="' + (csp ? s.y + 8 : s.y) + '" r="' + (csp ? 5 : r) + '"/>' +
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
           rules are absolute, and this game keeps clear of them by construction.
           (The era filter on the GROUP is a light grade over the whole wash at once —
           one filter, every state identical, still nothing territorial.) */
        '<g id="sab-terrg">' + terr + '</g>' +
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
          return '<path class="sab-river" id="sabrv-' + esc(rv.n).replace(/\s+/g, '-') + '" d="' + d2 + '">' +
            '<title>' + esc(rv.n) + '</title></path>';
        }).join('') + '</g>' +
        /* the boats live UNDER the fog on purpose: a river the mist still holds
           carries its trade unseen, and clearing the fog reveals a world that
           was already moving — which is the truest thing this game says */
        '<g id="sab-boats"></g>' +
        /* THE FOG IS VISMRITI'S OWN. Undiscovered land sits under a grey veil with
           holes of clear light punched around every found place and every walking
           explorer — the world is revealed by going and looking, which is the whole
           point of the explorers. The mask is rebuilt each paint; twenty circles. */
        '<mask id="sabfog"><rect x="-200" y="-200" width="1400" height="1500" fill="#fff"/>' +
        '<g id="sab-fogholes"></g></mask>' +
        '<rect id="sab-fogrect" x="-200" y="-200" width="1400" height="1500" fill="#8d93a5" opacity=".62" ' +
          'mask="url(#sabfog)" pointer-events="none"/>' +
        /* Vismriti breathes: two blurred wisps drifting inside the fog's own
           mask, so the grey is weather rather than paint */
        '<g class="sab-mistdrift" mask="url(#sabfog)" pointer-events="none">' +
          '<ellipse cx="300" cy="380" rx="260" ry="150" fill="#fff" opacity=".1" style="filter:blur(40px)"/>' +
          '<ellipse cx="680" cy="700" rx="300" ry="170" fill="#6d7387" opacity=".12" style="filter:blur(46px)"/>' +
        '</g>' +
        '<g id="sab-routes">' + G.routes.map(routeSVG).join('') + '</g>' +
        '<g id="sab-carts"></g>' +
        '<g id="sab-explorers"></g>' +
        '<g id="sab-sites">' + SITES.map(siteSVG).join('') + '</g>' +
        '<g id="sab-fx" pointer-events="none"></g>' +
        '</svg>';
    }

    /* ================================================================
       ZOOM AND PAN. The board is a viewBox window onto the 1000x1100
       map: the corner buttons (and + - 0 on a keyboard) step the zoom,
       drag to pan. A drag longer than a thumb-tremor swallows the click
       it ends with, so panning across a lamp does not select it.
       ================================================================ */
    var VZ = { x: 0, y: 0, w: 1000, h: 1100 };
    /* THE MAP OPENS ZOOMED TO YOUR WORLD, not to all of India — a fresh game is one
       lamp in the fog, and a whole-subcontinent view makes it a dot in a grey sea.
       Fit the found sites (plus a walking explorer) with generous margin; the whole
       map is one \u2302 away. */
    /* THREE LEVELS OF ZOOM, no in-between (the founder's spec): NEAR is one
       neighbourhood of lamps, REGION frames everything revealed so far, ALL is
       the whole subcontinent — mostly Vismriti's grey until you have earned it.
       The map opens at REGION and stays zoomed in; the buttons and the
       keyboard STEP between the levels instead of free-scaling, and the
       drag pan is fenced to the land you have revealed — the mist is not a
       place you can wander, only a place you can send explorers into. */
    var zlevel = 1;                       /* 0 near · 1 region · 2 all */
    /* THE WINDOW MATCHES THE BOX. The viewBox was always portrait (h = w*1.1),
       so on a wide desktop the map letterboxed into a narrow strip between
       grey gutters. At NEAR and REGION the window now takes the stage's own
       shape (clamped: never wider than 2:1, never taller than portrait), so
       the land fills the full width. ALL stays portrait — whole India is a
       portrait country. Phones compute >1.1 and clamp back to 1.1: unchanged. */
    function vasp() {
      if (zlevel === 2) return 1.1;
      var st = D.getElementById('sab-stage');
      var w2 = st ? st.clientWidth : 0;
      if (!w2) return 1.1;
      return Math.max(0.5, Math.min(1.1, (W.innerHeight * 0.66) / w2));
    }
    function revealedBox() {
      var pts = SITES.filter(onMap).map(function (x) { return [x.x, x.y]; });
      G.explorers.forEach(function (ex) { pts.push([ex.x, ex.y]); });
      if (!pts.length) pts = [[500, 550]];
      var xs = pts.map(function (q2) { return q2[0]; }), ys = pts.map(function (q2) { return q2[1]; });
      var M2 = 150;                       /* breathing room past the last lamp */
      return { x0: Math.max(-60, Math.min.apply(0, xs) - M2),
               y0: Math.max(-60, Math.min.apply(0, ys) - M2),
               x1: Math.min(1060, Math.max.apply(0, xs) + M2),
               y1: Math.min(1160, Math.max.apply(0, ys) + M2) };
    }
    function zoomTo(level, at) {
      zlevel = Math.max(0, Math.min(2, level));
      if (zlevel === 2) { VZ = { x: 0, y: 0, w: 1000, h: 1100 }; vzApply(); return; }
      var b = revealedBox();
      var cx = at ? at.x : VZ.x + VZ.w / 2, cy = at ? at.y : VZ.y + VZ.h / 2;
      if (zlevel === 0) {
        VZ.w = 280;
      } else {
        var span = Math.max(b.x1 - b.x0 - 100, (b.y1 - b.y0 - 100) / vasp());
        VZ.w = Math.max(380, Math.min(1000, span + 180));
        cx = (b.x0 + b.x1) / 2; cy = (b.y0 + b.y1) / 2;
      }
      VZ.h = VZ.w * vasp();
      VZ.x = cx - VZ.w / 2; VZ.y = cy - VZ.h / 2;
      vzClamp(); vzApply();
    }
    /* region fit — the map's home framing; also called when explorers arrive
       somewhere new, but only while the player IS at region level, so a chosen
       near or all view is never yanked away mid-look */
    function fitFound(force) {
      if (force || zlevel === 1) zoomTo(1);
    }
    var rsTm = null;
    function onResize() {
      clearTimeout(rsTm);
      rsTm = setTimeout(function () { if (!dead) { vzClamp(); vzApply(); } }, 200);
    }
    W.addEventListener('resize', onResize);
    var panning = null, swallowClick = false;
    function vzApply() {
      var svg = D.querySelector('#sab-stage svg');
      if (svg) svg.setAttribute('viewBox', VZ.x.toFixed(1) + ' ' + VZ.y.toFixed(1) + ' ' + VZ.w.toFixed(1) + ' ' + VZ.h.toFixed(1));
    }
    function vzClamp() {
      VZ.h = VZ.w * vasp();
      /* the pan fence: at near and region the view stays over revealed land;
         only ALL roams the whole map */
      var bx = zlevel === 2 ? { x0: -60, y0: -60, x1: 1060, y1: 1160 } : revealedBox();
      if (VZ.w >= bx.x1 - bx.x0) VZ.x = (bx.x0 + bx.x1 - VZ.w) / 2;
      else VZ.x = Math.max(bx.x0, Math.min(bx.x1 - VZ.w, VZ.x));
      if (VZ.h >= bx.y1 - bx.y0) VZ.y = (bx.y0 + bx.y1 - VZ.h) / 2;
      else VZ.y = Math.max(bx.y0, Math.min(bx.y1 - VZ.h, VZ.y));
      /* a wide window centred on a western cluster can hang off the map
         sheet; slide it back over the land (never past the sheet's edges) */
      if (zlevel !== 2) {
        if (VZ.w < 1120) VZ.x = Math.max(-60, Math.min(1060 - VZ.w, VZ.x));
        if (VZ.h < 1220) VZ.y = Math.max(-60, Math.min(1160 - VZ.h, VZ.y));
      }
    }
    function vzPoint(e) {
      var svg = D.querySelector('#sab-stage svg'), r = svg.getBoundingClientRect();
      return { x: VZ.x + (e.clientX - r.left) / r.width * VZ.w,
               y: VZ.y + (e.clientY - r.top) / r.height * VZ.h };
    }
    /* ZOOM IS A DECISION, NOT A TWITCH. The wheel and the pinch used to
       step the level, and a trackpad scroll or a clumsy two-finger drag kept
       yanking the world nearer and farther mid-thought. Zooming now belongs
       to the + \u2212 \u2302 buttons (and their keyboard twins); the wheel
       scrolls the page like everywhere else, and any number of fingers on
       the map can only pan it.
       ================================================================ */
    function onPointerDown(e) {
      var stage = D.getElementById('sab-stage');
      if (!stage || !stage.contains(e.target)) return;
      if (panning === null) panning = { id: e.pointerId, cx: e.clientX, cy: e.clientY, moved: 0 };
    }
    function onPointerMove(e) {
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
      if (panning && e.pointerId === panning.id) panning = null;
      if (!panning) setTimeout(function () { swallowClick = false; }, 0);
    }

    function shell() {
      host.innerHTML = '<div class="sab-wrap" id="sabwrap">' +
        '<div class="sab-bar">' +
          '<div class="sab-era"><span id="sab-eradate"></span><b id="sab-eraname"></b></div>' +
          '<div class="sab-res" id="sab-res" aria-live="off"></div>' +
          '<button class="sab-raksha" id="sab-raksha" hidden></button>' +
          '<span class="sab-gap"></span>' +
          '<div class="sab-globals">' +
            '<button class="sab-act txt go" id="sab-adv" hidden></button>' +
            '<button class="sab-act txt" id="sab-tech">Vidya</button>' +
            '<button class="sab-act sq" id="sab-restart" aria-label="Start again">\u21ba</button>' +
            '<button class="sab-act sq" id="sab-pause" aria-pressed="false" aria-label="Pause">⏸</button>' +
          '</div>' +
        '</div>' +
        '<div class="sab-tray" id="sab-sheet" hidden></div>' +
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
      /* THE ALARM LIVES IN THE BAR. The feed is one line and the world keeps
         talking; a threat on its way must stay on screen until it lands, and
         tapping it takes you straight to the city that needs hands. */
      var rk = D.getElementById('sab-raksha');
      if (rk) {
        if (G.warn && byId[G.warn.id]) {
          var rr = null; (DATA.raids || []).forEach(function (r4) { if (r4.id === G.warn.raid) rr = r4; });
          var dd2 = defenceOf(G.warn.id);
          var nd2 = (rr ? rr.str : 5) + Math.floor(G.era / 3) + (keyCity(G.warn.id) ? 2 : 0);
          rk.hidden = false;
          rk.className = 'sab-raksha' + (dd2.total >= nd2 ? ' ready' : '');
          rk.innerHTML = '<b>\u26a0 ' + esc(nameOf(byId[G.warn.id])) + '</b><span>' +
            esc(rr ? rr.warn : 'something comes') + ' \u00b7 ' + Math.max(0, G.warn.at - G.t) +
            ' turns \u00b7 gate ' + dd2.total + '/' + nd2 + '</span>';
          rk.setAttribute('data-sab-act', 'gowarn');
          rk.setAttribute('aria-label', (rr ? rr.warn : 'A threat') + ' at ' +
            nameOf(byId[G.warn.id]) + ' — the gate holds ' + dd2.total + ' of ' + nd2 + '; open the city');
        } else { rk.hidden = true; rk.removeAttribute('data-sab-act'); }
      }
      D.getElementById('sab-eraname').textContent = e.name;
      D.getElementById('sab-eradate').textContent = 'Era ' + (G.era + 1) + ' · ' + e.dates;
      /* the age grades the light on the land — one filter on the whole wash */
      var svgEl = D.querySelector('#sab-stage svg');
      if (svgEl) svgEl.setAttribute('class', 'sab-e' + G.era);
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
        adv.innerHTML = '<span class="lbl">New era<em>' + ERAS[G.era].katha + ' 📜</em></span>';
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
        (q.her ? ' hercity' : '') +
        (dusty(s.id) ? ' dustyv' : '') +
        (sel === s.id ? ' sel' : '') + (kbd === s.id ? ' kbd' : ''));
      g.setAttribute('tabindex', '0');
      g.setAttribute('aria-label', nameOf(s));
      var lbl = g.querySelector('text');
      if (lbl && lbl.textContent !== nameOf(s)) lbl.textContent = nameOf(s);   /* the ages rename cities */
      var r = 9 + q.lv * 2;
      var img = g.querySelector('.sab-cityimg');
      if (img) {
        /* the town grows on the land: hamlet, town, walled city — the one
           visual the whole game turns on, so it lives on the map itself */
        var stage = q.zzz ? 1 : Math.min(3, Math.max(1, q.lv));
        var su = spOf('city' + stage);
        if (su) img.setAttribute('href', su);
        var iw = 40 + q.lv * 10, ih = iw * 0.84;
        img.setAttribute('width', iw); img.setAttribute('height', ih);
        img.setAttribute('x', s.x - iw / 2); img.setAttribute('y', s.y - ih + 8);
        /* the cues follow the sprite's true size */
        g.querySelector('.halo').setAttribute('r', iw / 2 + 5);
        g.querySelector('.hit').setAttribute('r', Math.max(r + 18, iw / 2 + 10));
        var txt = g.querySelector('text');
        if (txt) {
          var lab2 = s.lab || 'n';
          if (lab2 === 'n') txt.setAttribute('y', s.y - ih + 8 - 8);
          if (lab2 === 's') txt.setAttribute('y', s.y + 34);
          if (lab2 === 'e') txt.setAttribute('x', s.x + iw / 2 + 8);
          if (lab2 === 'w') txt.setAttribute('x', s.x - iw / 2 - 8);
        }
        g.querySelector('.core').setAttribute('r', 5);
        g.querySelector('.r2').style.display = 'none';
        g.querySelector('.r3').style.display = 'none';
      } else {
        g.querySelector('.core').setAttribute('r', r);
        g.querySelector('.r2').style.display = (!q.zzz && q.lv >= 2) ? '' : 'none';
        g.querySelector('.r3').style.display = (!q.zzz && q.lv >= 3) ? '' : 'none';
      }
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
      var esp = spOf('explorer'), bp = buddyPiece();
      g.innerHTML = G.explorers.map(function (ex) {
        var body;
        if (bp && bp.tier === 'tales') {
          /* the buddy IS the yatri — the tortoise walks India */
          body = '<circle r="16" cy="-13" fill="#ffd76e" opacity=".18"/>' +
            '<image href="' + bp.src + '" x="-15" y="-30" width="30" height="30" preserveAspectRatio="xMidYMax meet"/>';
        } else {
          body = (esp
            ? '<circle r="16" cy="-14" fill="#ffd76e" opacity=".18"/>' +
              '<image href="' + esp + '" x="-13" y="-30" width="26" height="32" preserveAspectRatio="xMidYMax meet"/>'
            : '<circle r="8" fill="var(--accent3)" stroke="#fff" stroke-width="2"/>' +
              '<circle r="3" cy="-10" fill="#ffd76e"/>') +
            /* a sacred or real companion travels alongside, never as the piece */
            (bp ? '<circle r="10" cx="17" cy="-27" fill="#fffbee" stroke="#c9a24b" stroke-width="1.5"/>' +
                  '<image href="' + bp.src + '" x="9" y="-35" width="16" height="16"/>' : '');
        }
        return '<g class="sab-exwalk" style="transition:transform ' + (TICK_MS / 1000) + 's linear;transform:translate(' +
            ex.x.toFixed(1) + 'px,' + ex.y.toFixed(1) + 'px)">' + body + '</g>';
      }).join('');
    }
    function paintRoutes() {
      var gEl = D.getElementById('sab-routes');
      if (gEl) gEl.innerHTML = G.routes.map(routeSVG).join('');
      cartN = -1;   /* the cart flock re-syncs to the new road count */
    }

    /* ================================================================
       THE LIVING BOARD. Carts shuttle the roads, boats work the rivers,
       and events throw sparks — all presentation, never state: the same
       game plays underneath, and prefers-reduced-motion stills all of it.
       One rAF, throttled to ~30fps, that only touches transforms.
       ================================================================ */
    var lifeRAF = 0, lifeSkip = false, cartN = -1, boatsN = -1;
    function ensureCarts() {
      var g = D.getElementById('sab-carts'); if (!g) return;
      var sp = spOf('cart');
      if (!sp || REDUCED) { if (cartN !== 0) { g.innerHTML = ''; cartN = 0; } return; }
      if (cartN === G.routes.length) return;
      cartN = G.routes.length;
      var out = '';
      for (var i = 0; i < cartN; i++) {
        out += '<g class="sab-cart" data-i="' + i + '">' +
          '<image href="' + sp + '" x="-19" y="-27" width="38" height="29" preserveAspectRatio="xMidYMax meet"/></g>';
      }
      g.innerHTML = out;
    }
    /* THE RIVERS RUN QUIET (the founder's call). Boats shuttling every river
       under the fog pulled the eye off the land and taught nothing; the water
       keeps its shimmer and nothing sails it. The carts still roll the roads,
       because a cart on a route IS the meaning of a route — and a port city
       still keeps its one moored boat, standing still, as the mark of a port. */
    function ensureBoats() {
      var g = D.getElementById('sab-boats');
      if (g && g.innerHTML) { g.innerHTML = ''; }
      boatsN = 0;
    }
    function moveAlong(el, path, ts, period, phase) {
      var L = path.getTotalLength(); if (!L) return;
      var t = ((ts + phase) % (2 * period)) / period;          /* 0..2, ping-pong */
      var p = t < 1 ? t : 2 - t, dir = t < 1 ? 1 : -1;
      var a = path.getPointAtLength(p * L);
      var b = path.getPointAtLength(Math.min(1, Math.max(0, p + 0.02 * dir)) * L);
      var hx = (b.x - a.x) * dir;
      el.setAttribute('transform', 'translate(' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) +
        ') scale(' + (hx >= 0 ? 1 : -1) + ' 1)');
    }
    function lifeStep(ts) {
      lifeRAF = requestAnimationFrame(lifeStep);
      lifeSkip = !lifeSkip; if (lifeSkip) return;              /* ~30fps is plenty for a cart */
      if (REDUCED || pause || city || techOpen || G.won) return;
      ensureCarts(); ensureBoats();
      var carts = D.querySelectorAll('#sab-carts .sab-cart'), i, el, path;
      for (i = 0; i < carts.length; i++) {
        el = carts[i]; path = D.getElementById('sabr-' + el.getAttribute('data-i'));
        if (path) moveAlong(el, path, ts, 24000 + (i % 5) * 3400, i * 4700);
      }
    }
    /* event sparks at a point on the board — fire and forget, self-removing */
    function fxAt(x, y, kind) {
      if (REDUCED) return;
      var g = D.getElementById('sab-fx'); if (!g) return;
      var el = D.createElementNS('http://www.w3.org/2000/svg', 'g');
      el.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
      var out = '', i;
      if (kind === 'utsav' || kind === 'glory') {
        for (i = 0; i < 6; i++) {
          out += '<g transform="translate(' + (((i * 37) % 52) - 26) + ',0)">' +
            '<circle class="sab-diya" r="3.2" fill="' + (kind === 'glory' ? '#ffe9a8' : '#ffd76e') +
            '" style="animation-delay:' + (i * 0.14) + 's"/></g>';
        }
        out += '<circle class="sab-ringfx" r="18" style="stroke:' +
          (kind === 'glory' ? '#e8b64c' : 'var(--accent2)') + '"/>';
      } else if (kind === 'mist') {
        out = '<circle class="sab-swirl" r="26" fill="#8d93a5" opacity=".5" style="filter:blur(5px)"/>' +
          '<circle class="sab-swirl" r="38" fill="#6d7387" opacity=".35" style="filter:blur(8px);animation-delay:.3s"/>';
      } else {  /* grow */
        out = '<circle class="sab-ringfx" r="18"/>';
      }
      el.innerHTML = out;
      g.appendChild(el);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3400);
    }
    /* the pill helper: icon chip, word with the cost tucked under it — and an
       optional waiting-count badge. Compact on purpose: every verb fits one bar. */
    function tile(act, icon, name, cost, opts) {
      opts = opts || {};
      return '<button class="sab-act' + (opts.go ? ' go' : '') + '" data-sab-act="' + act + '"' +
        (opts.attrs || '') + (opts.disabled ? ' disabled' : '') +
        (cost ? ' aria-label="' + name + ' — ' + cost + '"' : '') + '>' +
        (opts.badge ? '<span class="sab-badge' + (opts.hot ? ' hot' : '') + '">' + opts.badge + '</span>' : '') +
        '<span class="sab-tico">' + ic(icon, 16) + '</span>' +
        '<span class="lbl">' + name + (cost ? '<em>' + cost + '</em>' : '') + '</span>' +
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
        var qc2 = G.sites[city];
        sh.innerHTML = '<div class="sab-who"><b>' + esc(nameOf(byId[city])) +
          (G.capital === city ? ' ★' : '') + '</b><span>lv ' + qc2.lv +
          (connected(city) ? ' · on the roads' : ' · no road yet') +
          (dusty(city) ? ' · dusty' : '') + '</span></div>' +
          tile('leave', 'back', 'Map', '', { go: true }) +
          waits.map(function (w2) {
            return tile(w2.act, w2.icon, w2.name, '', { attrs: ' data-t="' + w2.t + '"', badge: '!', hot: w2.hot });
          }).join('');
        return;
      }

      if (!sel) { sh.hidden = true; sh.innerHTML = ''; return; }
      var s = byId[sel], q = G.sites[sel];
      var b = [];
      b.push('<div class="sab-who"><b>' + esc(nameOf(s)) + '</b><span>' +
        (q.her ? 'a remembered city — its monument keeps its story'
               : q.zzz ? 'asleep under the mist'
               : ICON[YIELD[s.kind]] + ' level ' + q.lv +
                 (G.capital === sel ? ' · the capital' : '') +
                 (connected(sel) ? ' · on a route' : ' · alone') +
                 (q.dry > 0 ? ' · AKAL — the rains hold off' : '') +
                 (dusty(sel) ? ' · dusty' : '') +
                 (inDispute(sel) ? ' · in a quarrel' : '')) +
        (targeting ? ' — now choose the other end of the road' : '') + '</span></div>');
      if (q.her) {
        b.push(tile('city', 'lamp', 'Visit the memory', '', { go: true }));
      } else if (q.zzz) {
        /* the dead end the explorer walked into: a found, sleeping city offered only
           Wake — which needs a road — and no way to build one. Roads are undirected,
           so the sleeping town can start its own: Reach it, then Wake it. */
        b.push(tile('route', 'road', 'Reach it', costStr(costOf({ kala: T.routeCost }, 'route'))));
        b.push(tile('wake', 'sun', 'Wake', connected(sel) ? T.wakeCost + ' \ud83d\udcdc' : 'needs a road',
          { go: true, disabled: !connected(sel) }));
      } else {
        b.push(tile('route', 'road', 'Route', costStr(costOf({ kala: T.routeCost }, 'route'))));
        b.push(tile('utsav', 'lamp', 'Utsav',
          G.utsav > 0 ? G.utsav + 's' : utsavCost().anna + ' \ud83c\udf3e + ' + utsavCost().kala + ' \ud83d\udee0\ufe0f',
          { disabled: G.utsav > 0 }));
        /* No Enter-city button: the city itself is the button. Double-click
           it, or press Enter with it selected. A tile that says "enter the
           thing you just tapped" is a tile that should not exist. */
        var waiting = cityJobsWaiting(sel).length;
        if (waiting || inDispute(sel))
          b.push(tile('city', 'temple', waiting ? 'A scroll waits' : 'A quarrel',
            'open ' + esc(nameOf(byId[sel])),
            { go: true, badge: waiting || '\u26a1', hot: inDispute(sel) }));
        if (hiddenSites().length)
          b.push(tile('explore', 'run', 'Explorer', T.exploreCost + ' \ud83c\udf3e'));
      }
      b.push('<button class="sab-act sq" data-sab-act="close" aria-label="Close">✕</button>');
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
    var av = { x: 50, y: 84 };   /* the yatri's feet, in plate % */
    var walkTimer = null;
    var riddleWrong = false;
    var quiz = null;       /* { at: gurukul city, of: city the question is about } */

    /* the riddle's options are shuffled by a per-city seed so the right answer's
       POSITION never leaks; the right answer's TEXT the child earned from the
       fact card when the city woke. */
    function askList(s) { return [s.ask].concat(s.asks || []); }
    function riddleOptions(s, qi) {
      var o = askList(s)[qi || 0].o.slice(), seed = s.name.length * 7 + s.x + (qi || 0) * 131;
      for (var i = o.length - 1; i > 0; i--) {
        var j = Math.floor((seed = (seed * 9301 + 49297) % 233280) / 233280 * (i + 1));
        var t = o[i]; o[i] = o[j]; o[j] = t;
      }
      return o;
    }

    function cityHTML(id) {
      var s = byId[id], q = G.sites[id], qq = G.quests[id];
      var y = yieldOf(s);
      /* no header row: the bar names the city and its state, the nameplate on
         the plate carries the level, the praja and the yields — a third telling
         of "Dholavira" earned nothing but height */
      var h = '<div class="sab-city" role="dialog" aria-label="' + esc(nameOf(s)) + '">';
      /* THE PEOPLE — allocation is the strategy. Kisan feed, karigar craft, kathakar
         tell, rakshak watch; the city's own trade counts double, and everyone eats.
         (Computed here because the painting below SHOWS them.) */
      var j = jobsOf(id), pop = popOf(id), spec = JOB_OF_KIND[s.kind];

      /* THE PAINTING IS A STAGE. The city's own praja walk across it — one
         figure per assigned worker, so moving a person onto a job visibly
         puts a person on the street — birds cross the sky, and until the
         monument is raised it stands in bamboo scaffolding over the dimmed
         scene. Presentation only (aria-hidden, pointer-events none): the
         same game, now watchable. Walk phases are clocked off real time so
         the 3s repaints never reset anyone mid-stride. */
      var heroArt = dioOf(id) || artOf(id);
      var atlas = plateOf(id);
      var KITC = kitOn(id);
      /* How much room there is decides where the crew stands and how much the
         banner says, so it is asked once, before anything is laid out. */
      var narrow = tightScreen();
      if (KITC) heroArt = heroArt || 'kit';
      var tune = (dioOf(id) && DIO_TUNE[id]) || {};
      if (heroArt) {
        var walkers = '', wi = 0, nowS = Date.now() / 1000;
        /* the kit board already stands its own praja on its own roads, drawn
           at the board's scale; pinning raster sprites over them would be two
           crowds in two sizes on one street */
        if (!q.zzz && !KITC) {
          /* THE PRAJA KEEP TO THE STREETS. Every walker is pinned to one of
             the plate's own traced roads and paces it end to end; the rest
             stand at spots that lie ON a road or in the plaza. Nobody crosses
             a roof, a field or the water any more. */
          var stops = [];
          if (atlas) {
            atlas.roads.forEach(function (rd) {
              for (var si = 0; si < rd.length; si += 2) stops.push(rd[si]);
            });
            if (atlas.plaza) { stops.push(atlas.plaza); stops.push(atlas.plaza); }
          }
          ['kisan', 'karigar', 'kathakar', 'rakshak'].forEach(function (jid) {
            var spw = spOf(jid); if (!spw) return;
            for (var k = 0; k < Math.min(j[jid], 5) && wi < 12; k++) {
              wi++;
              var ht = 9 + (wi % 4) * 2;
              if (!REDUCED && wi % 3 === 0 && atlas) {
                var ri = wi % atlas.roads.length;
                var dur = 54 + ((wi * 11) % 34);
                walkers += '<img class="sab-walker onroad" src="' + spw + '" alt="" style="' +
                  'animation-name:sabrd-' + id + '-' + ri + ',sabwbob;' +
                  'animation-duration:' + dur + 's,1.4s;' +
                  'animation-delay:-' + ((nowS + wi * 3.7) % dur).toFixed(2) + 's,0s;' +
                  'height:' + ht + '%">';
              } else if (!REDUCED && wi % 3 === 0) {
                var dur2 = 48 + ((wi * 9) % 28);
                walkers += '<img class="sab-walker" src="' + spw + '" alt="" style="' +
                  'animation-duration:' + dur2 + 's,1.4s;' +
                  'animation-delay:-' + ((nowS + wi * 3.7) % dur2).toFixed(2) + 's,0s;' +
                  'bottom:' + (1.5 + (wi % 5) * 2.2) + '%;height:' + ht + '%">';
              } else if (stops.length) {
                var sp2 = stops[(wi * 7) % stops.length];
                walkers += '<img class="sab-stand onroad" src="' + spw + '" alt="" style="' +
                  'left:' + sp2[0] + '%;top:' + sp2[1] + '%;height:' + ht + '%;' +
                  'animation-delay:-' + ((nowS + wi) % 5).toFixed(1) + 's">';
              } else {
                walkers += '<img class="sab-stand" src="' + spw + '" alt="" style="' +
                  'left:' + (7 + ((wi * 17) % 80)) + '%;' +
                  'bottom:' + (2 + (wi % 5) * 2.4) + '%;height:' + ht + '%;' +
                  'animation-delay:-' + ((nowS + wi) % 5).toFixed(1) + 's">';
              }
            }
          });
        }
        var birds = REDUCED ? '' :
          '<svg class="sab-bird" viewBox="0 0 24 12" style="animation-duration:26s;animation-delay:-' +
            (nowS % 26).toFixed(1) + 's"><path d="M2 8 Q7 2 12 7 Q17 2 22 8" fill="none" stroke="#2e2e40" stroke-width="1.6" stroke-linecap="round"/></svg>' +
          '<svg class="sab-bird" viewBox="0 0 24 12" style="width:19px;animation-duration:34s;animation-delay:-' +
            ((nowS + 12) % 34).toFixed(1) + 's;opacity:.6"><path d="M2 8 Q7 2 12 7 Q17 2 22 8" fill="none" stroke="#2e2e40" stroke-width="1.6" stroke-linecap="round"/></svg>';
        /* THE SCAFFOLD IS THE BUTTON. At level 3 the bamboo itself is how you
           raise the monument — it glows when the coins reach, wears its cost,
           and one tap brings it down and the colours back. Below level 3 it
           stands quiet with the reason on it. */
        var scaf = '';
        if (!q.mon && spOf('scaffold')) {
          var mc0 = costOf(T.monCost[s.era], 'monument');
          /* the atlas knows where the monument belongs on this painting */
          var mpt = atlas ? kitPt(id, atlas.mon) : null;
          var scafCSS = (tune.scaf && !KITC) ? tune.scaf
            : (mpt ? 'left:' + mpt[0].toFixed(2) + '%;top:' + mpt[1].toFixed(2) +
                '%;bottom:auto;transform:translate(-50%,' + (KITC ? '-84%' : '-62%') + ')' +
                (KITC ? ';height:20%' : '') : '');
          var scafStyle = scafCSS ? ' style="' + scafCSS + '"' : '';
          if (q.monB) {
            /* THE WORK IN HAND. The bamboo climbs in three visible stages and
               the bar under it fills — a monument is a season's labour now,
               and a raid at the wrong moment costs you a stage. */
            var stg = monStage(id);
            scaf = '<button class="sab-scafbtn building st' + stg + '"' +
              ' style="' + scafCSS + ';--pc:' + (monPct(id) * 100).toFixed(1) + '%"' +
              ' data-sab-act="cjump" data-t="sab-sec-works"' +
              ' aria-label="' + esc(s.works[2]) + ' — rising, stage ' + stg + ' of ' + T.monStages + '">' +
              '<img src="' + spOf('scaffold') + '" alt=""><em>raising \u00b7 stage ' + stg +
              ' of ' + T.monStages + '</em></button>';
          } else if (q.lv >= 3) {
            scaf = '<button class="sab-scafbtn' + (canPay(mc0) ? ' can' : '') + '"' + scafStyle + ' data-sab-act="mon"' +
              (canPay(mc0) ? '' : ' disabled') +
              ' aria-label="Begin the monument — ' + esc(s.works[2]) + ' (' + costStr(mc0) + ')">' +
              '<img src="' + spOf('scaffold') + '" alt=""><em>' +
              (canPay(mc0) ? 'Begin it! ' : '') + costStr(mc0) + '</em></button>';
          } else {
            scaf = '<button class="sab-scafbtn"' + scafStyle + ' data-sab-act="cjump" data-t="sab-sec-works"' +
              ' aria-label="' + esc(s.works[2]) + ' — a level-3 city may raise it">' +
              '<img src="' + spOf('scaffold') + '" alt=""><em>grows at level 3</em></button>';
          }
        }
        /* DUST ON THE HORIZON. When something is coming for this city the
           plate says so, names it, and counts the watch it has against the
           watch it needs — twenty seconds to put hands on the gate. */
        var alarm = '';
        if (G.warn && G.warn.id === id) {
          var wr = null; (DATA.raids || []).forEach(function (r3) { if (r3.id === G.warn.raid) wr = r3; });
          var dfn = defenceOf(id);
          var need = (wr ? wr.str : 5) + Math.floor(G.era / 3) + (keyCity(id) ? 2 : 0);
          alarm = '<div class="sab-alarm' + (dfn.total >= need ? ' ready' : '') + '" role="status">' +
            '<b>\u26a0 ' + esc(wr ? wr.warn : 'Something is coming') + '</b>' +
            '<span>' + Math.max(0, G.warn.at - G.t) + ' turns \u00b7 the gate holds ' + dfn.total +
            ' of ' + need + (dfn.help ? ' (' + dfn.help + ' marching in)' : '') + '</span></div>';
        }
        /* the city banner, the four stations, and the calls of the moment */
        /* the test switch: flip the renderer without leaving the city, and
           turn the board, so the painted plate and the built one can be
           judged against each other on the same turn */
        var kitbar = '';
        if (W.IND_KIT && W.IND_KIT_CITIES && W.IND_KIT_CITIES[id]) {
          kitbar = '<div class="sab-kitbar">' +
            '<button data-sab-act="kittoggle" aria-label="Switch between the painted plate and the built board">' +
            '<i>' + (KITC ? '\u25c9' : '\u25cb') + '</i><u>' + (KITC ? 'built' : 'painted') + '</u></button>' +
            (KITC ? '<button data-sab-act="kitturn" aria-label="Turn the board a quarter">' +
              '<i>\u27f3</i><u>turn</u></button>' +
              '<button data-sab-act="kitzoom" data-d="-1" aria-label="Zoom out">\u2212</button>' +
              '<span class="z">' + Math.round((G.kitZ || 1) * 100) + '%</span>' +
              '<button data-sab-act="kitzoom" data-d="1" aria-label="Zoom in">+</button>' : '') +
            '</div>';
        }
        /* The banner said the city's name AND its whole ledger. Given a
           phone's width that ledger wrapped into twenty lines and the banner
           grew to fill the board. It says the name and the size there; the
           ledger is on the row under the board, where there is room for it. */
        var yieldStr = y ? ['anna', 'kala', 'katha'].filter(function (k2) { return y[k2]; })
          .map(function (k2) { return '+' + y[k2] + ' ' + ICON[k2]; }).join(' ') : '';
        var plate = alarm + kitbar + '<div class="sab-nameplate"><b>' +
          esc(nameOf(s)) + (G.capital === id ? ' \u2605' : '') + '</b><span>' +
          (narrow
            ? 'lv ' + q.lv + ' \u00b7 ' + pop + ' praja'
            : 'lv ' + q.lv + ' \u00b7 ' + pop + ' praja \u00b7 eat ' + (pop * T.eat) + ' ' +
              ICON.anna + (yieldStr ? ' \u00b7 ' + yieldStr : '')) +
          '</span></div>'
        /* THE STATIONS ARE THE ALLOCATION. The four kinds of praja stand at
           their corners wearing the live count — and the −/+ that used to
           live in tiles below now hang right on their shoulders. What each
           job does rides the aria-label; the tiles below are gone. */
        /* WHERE THE CREW STANDS depends on how much room there is. On a wide
           screen they take the four corners and leave the city the middle. On
           a phone four corner blocks ARE the screen — the board came out a
           thin strip between them — so they stand in one row across the top
           and the whole board below is the city. The lower pair also had to
           climb out from under the shelf, which on a phone buried them. */
        var ST_POS = narrow
          ? { kathakar: 'left:0.5%;top:1%', rakshak: 'left:24.5%;top:1%',
              kisan: 'left:48.5%;top:1%', karigar: 'left:72.5%;top:1%' }
          : (KITC && G.kitOpen
              ? { kisan: 'left:1.5%;top:44%', karigar: 'left:81%;top:44%',
                  kathakar: 'left:1.5%;top:6%', rakshak: 'left:81%;top:6%' }
              : { kisan: 'left:1.5%;bottom:26%', karigar: 'left:81%;bottom:26%',
                  kathakar: 'left:1.5%;top:15%', rakshak: 'left:81%;top:15%' });
        var totalJ = j.kisan + j.karigar + j.kathakar + j.rakshak;
        var stations = ['kisan', 'karigar', 'kathakar', 'rakshak'].map(function (jid) {
          var spw = spOf(jid); if (!spw) return '';
          var jd = DATA.jobs[jid];
          var canUp = totalJ < pop || (j.kisan > 0 && jid !== 'kisan');
          return '<div class="sab-station" style="' + ST_POS[jid] + '">' +
            '<img src="' + spw + '" alt=""><b>' + j[jid] + '</b>' +
            '<i>' + esc(jd.name) + (jid === spec ? ' ×2' : '') + '</i>' +
            '<span class="srow">' +
            '<button class="pm" data-sab-act="job" data-j="' + jid + '" data-d="-1"' + (j[jid] ? '' : ' disabled') +
            ' aria-label="One fewer ' + esc(jd.name) + ' — ' + esc(jd.what) + '">−</button>' +
            '<button class="pm" data-sab-act="job" data-j="' + jid + '" data-d="1"' + (canUp ? '' : ' disabled') +
            ' aria-label="One more ' + esc(jd.name) + ' — ' + esc(jd.what) + '">+</button>' +
            '</span></div>';
        }).join('');
        /* the great one stands IN the city, glowing gently, one tap from
           their deed — a painted role, present on the land like everything
           else that matters here */
        var herostand = '';
        if (q.hero && !q.hero.gone) {
          var hsp = spOf({ kheti: 'hero-annadata', shilpa: 'hero-sthapati', vidya: 'hero-acharya' }[s.kind]);
          if (hsp) herostand = '<button class="sab-station sab-herostand" style="left:20%;bottom:31%"' +
            ' data-sab-act="cjump" data-t="sab-sec-hero"' +
            ' aria-label="' + esc(DATA.heroes[s.kind].name) + ' is here — see their deed">' +
            '<img src="' + hsp + '" alt=""><i>' + esc(DATA.heroes[s.kind].name) + '</i></button>';
        }
        var badges = herostand;
        if (inDispute(id)) badges += '<button class="sab-cbadge hot" style="right:2%" data-sab-act="cjump" ' +
          'data-t="sab-sec-quarrel" aria-label="A quarrel — the panchayat sits"><em>⚡</em>panchayat</button>';
        if (qq) badges += '<button class="sab-cbadge" style="right:' + (inDispute(id) ? 17 : 2) + '%" ' +
          'data-sab-act="cjump" data-t="sab-sec-quest" aria-label="A quest waits"><em>📜</em>quest</button>';
        if (q.hero && !q.hero.gone) badges += '<button class="sab-cbadge" style="left:2%;top:2.5%" ' +
          'data-sab-act="cjump" data-t="sab-sec-hero" aria-label="A great one is here"><em>★</em>great one</button>';
        /* THE SEAT OF THE REALM, on the sky: the capital card below is gone —
           the crown badge wears the price and does the deed. */
        if (G.capital !== id) badges += '<button class="sab-cbadge cap" style="right:2%;top:2.5%" data-sab-act="cap"' +
          (canPay(T.capCost) ? '' : ' disabled') +
          ' aria-label="Make ' + esc(nameOf(s)) + ' the capital (' + costStr(T.capCost) + ').' +
          (G.capital ? ' The capital is at ' + esc(nameOf(byId[G.capital])) + '.'
                     : ' A capital never gathers dust, never quarrels, and adds +1 of everything.') + '">' +
          '<em>👑</em>capital<u>' + costStr(T.capCost) + '</u></button>';
        /* hearth smoke and a cart on the street — the town breathes */
        var breath = '';
        if (!REDUCED && !q.zzz) {
          breath = '<span class="sab-smoke" style="left:26%;top:34%;animation-delay:-' + (nowS % 6.5).toFixed(1) + 's"></span>' +
            '<span class="sab-smoke" style="left:57%;top:28%;animation-delay:-' + ((nowS + 2.3) % 6.5).toFixed(1) + 's"></span>' +
            '<span class="sab-smoke" style="left:74%;top:38%;animation-delay:-' + ((nowS + 4.1) % 6.5).toFixed(1) + 's"></span>' +
            (spOf('cart') ? (function () {
              /* THE CART KEEPS TO THE CART ROAD. It used to slide dead
                 straight across the picture at a fixed height, over walls,
                 water and rooftops alike; now it rolls the plate's widest
                 traced street — which on every plate is the one the painter
                 drew for carts. */
              if (atlas) {
                var wide = 0, ws = -1;
                atlas.roads.forEach(function (rd, ri2) {
                  var xs = rd.map(function (pt) { return pt[0]; });
                  var span = Math.max.apply(null, xs) - Math.min.apply(null, xs);
                  if (span > ws) { ws = span; wide = ri2; }
                });
                return '<img class="sab-cross onroad" src="' + spOf('cart') + '" alt="" style="' +
                  'animation-name:sabrd-' + id + '-' + wide + ';animation-duration:64s;' +
                  'animation-delay:-' + ((nowS + 9) % 64).toFixed(1) + 's">';
              }
              return '<img class="sab-cross" src="' + spOf('cart') + '" alt="" style="animation-delay:-' +
                ((nowS + 9) % 38).toFixed(1) + 's">';
            })() : '');
        }
        /* THE BUILD PLOTS. The buildings were rows of text under the painting;
           now the painting is the build board — Civ's own move. An unbuilt
           plot is a ghost of the thing with its cost, a real button firing
           the same 'build' action as the rows below (which stay: they carry
           the full explanations). A built one stands on the scene for good,
           and rises once, the first time this sitting sees it. */
        bldSeenInit();
        /* THE BUILDINGS STAND WHERE THEY BELONG. A row of plots along the
           bottom edge put the granary on the street; the atlas now carries a
           site for each one, read off the painting — the granary in the
           middle of the largest field, the stepwell by the water, the bazaar
           on the longest street, the rampart at the town's outer edge, the
           fort inside the gate. Plates without an atlas keep the old row. */
        var plots = '', PLOT_X = [0.5, 14.4, 28.3, 42.2, 56.1, 70, 84];
        var spots = (atlas && atlas.spots) || null;
        Object.keys(BLD).filter(function (b2) {
          if (BLD[b2].era > G.era) return false;
          /* With the shelf on the board, an unbuilt plot is a second shop
             that does not know the era rules: it was still offering era-0
             Dholavira a thatched granary. What is BUILT keeps its plot,
             because that plot is the door you tap to use it. */
          if (KITC && !q.bld[b2]) return false;
          return true;
        }).slice(0, 7).forEach(function (bid, pi) {
            var bd = BLD[bid], bsp = spOf(bid), left = PLOT_X[pi];
            var at = kitPt(id, spots && spots[bid]);
            var pos = at ? 'left:' + at[0] + '%;top:' + at[1] + '%;bottom:auto;transform:translate(-50%,-100%)'
                         : 'left:' + left + '%';
            var art2 = bsp ? '<img' + (q.bld[bid] ? '' : ' class="ghost"') + ' src="' + bsp + '" alt="">'
                           : '<span style="font-size:26px">' + bd.icon + '</span>';
            if (q.bld[bid]) {
              var rise = !bldSeen[id + ':' + bid];
              bldSeen[id + ':' + bid] = 1;
              /* the built gurukul is a door, not a decoration: tap it to ask
                 the teacher — the bell rings when a question is ready */
              if (bid === 'gurukul') {
                var ready = (G.quizAt[id] || -999) + T.quizCd - G.t <= 0;
                plots += '<button class="sab-plot built teach' + (rise && !REDUCED ? ' rise' : '') +
                  '" style="' + pos + '" data-sab-act="' + (ready ? 'quizstart' : 'cjump') + '"' +
                  (ready ? '' : ' data-t="sab-sec-guru"') +
                  ' aria-label="The gurukul — ' + (ready ? 'the teacher will take a question' : 'the teacher rests') + '">' +
                  art2 + (ready && !REDUCED ? '<b class="pbell">🔔</b>' : '') +
                  '<i>' + esc(bd.name) + '</i></button>';
              } else {
                plots += '<div class="sab-plot built' + (rise && !REDUCED ? ' rise' : '') +
                  '" style="' + pos + '" title="' + esc(bd.what) + '">' + art2 +
                  '<i>' + esc(bd.name) + '</i></div>';
              }
            } else {
              var c2 = costOf(bd.cost, 'building');
              plots += '<button class="sab-plot" style="' + pos + '" data-sab-act="build" data-b="' + bid + '"' +
                (canPay(c2) ? '' : ' disabled') +
                ' aria-label="Build the ' + esc(bd.name) + ' — ' + esc(bd.what) + '">' + art2 +
                '<i>' + esc(bd.name) + '</i><em>' + costStr(c2) + '</em></button>';
            }
          });
        /* a port keeps its boat moored — the city's kind, visible at a glance */
        var moor = (PORTS.indexOf(id) >= 0 && spOf('boat'))
          ? '<img class="sab-moor" src="' + spOf('boat') + '" alt="">' : '';
        /* KHAZANA — the city's hidden treasure. A real artifact (sourced),
           tucked at a spot on the plate: the folk whisper a hint below the
           scene, a faint glint betrays it to a patient eye, and it can only
           be found while the city LIVES — the fold takes unfound treasures
           into memory with it. The spot is a real >=44px button, reachable
           by tab as well as by hunting (accessibility is not a spoiler). */
        var trez = (DATA.treasures || {})[id], treHunt = '', treHint = '';
        if (trez && !G.tre[id]) {
          treHunt = '<button class="sab-trespot" style="left:' + trez.x + '%;top:' + trez.y + '%"' +
            ' data-sab-act="khazana" aria-label="Search here"><span class="glint">✦</span></button>';
          treHint = '<div class="sab-treshint">🔍 ' + esc(FOLK[s.kind]) + ' whispers: “' +
            esc(trez.hint) + '”</div>';
        }
        /* WALK MODE: the child's yatri (a tales-shelf buddy walks as the
           piece; sacred and real figures never do — the explorer walks
           instead) stands on the plate. Tap the plate or press the arrows
           and they WALK there; the camera follows; walking onto the glint
           digs the khazana. */
        var yb2 = buddyPiece();
        var ySrc2 = (yb2 && yb2.tier === 'tales' && yb2.src) || spOf('explorer');
        var yatri = ySrc2 ? '<div class="sab-yatri" id="sab-yatri" style="left:' + av.x +
          '%;top:' + av.y + '%"><img src="' + ySrc2 + '" alt=""></div>' : '';
        var yav = kitPt(id, [av.x, av.y]);
        if (KITC) yatri = ySrc2 ? '<div class="sab-yatri" id="sab-yatri" style="left:' +
          yav[0].toFixed(2) + '%;top:' + yav[1].toFixed(2) + '%"><img src="' + ySrc2 +
          '" alt=""></div>' : '';
        /* THE BOARD SCROLLS; THE HUD DOES NOT. With everything in one
           scrolling box the city's own nameplate drifted up the screen and
           hung in the middle of it. The board now lives in its own scroller
           and the nameplate, the stations, the shelf and the zoom sit on top
           of it, pinned to the frame. */
        h += '<div class="sab-scene' + (KITC ? ' iskit' : '') +
          (KITC && G.kitOpen ? ' shelfup' : '') + (narrow ? ' tight' : '') + '">' +
          (atlas && !KITC ? '<style>' + roadKeyframes(id) + '</style>' : '') +
          (KITC ? '<div class="sab-view" id="sab-view">' : '') +
          '<div class="sab-cam" id="sab-cam" style="transform:' + camStr() + '">' +
          (KITC ? kitBoard(id)
                : '<img class="sab-hero' + (q.mon ? '' : ' dim') + '" src="' + heroArt + '" alt="">') +
          (KITC ? '' : greenLayer(id)) +
          '<div class="sab-praja" aria-hidden="true">' + breath + walkers + birds + moor + '</div>' +
          scaf + treHunt + '<div class="sab-plots">' + plots + '</div>' + yatri +
          '</div>' + (KITC ? '</div>' : '') +
          plate + stations + badges + (KITC ? kitDrawer(id) : growBtn(id)) + '</div>' + treHint +
          (q.mon ? '' : '<div class="sab-herocap">The city as it could be — raise the monument, ' +
            'the scaffolding comes down, and the colours come back.</div>');
      }
      var king = inKingdomOf(id);
      if (king) h += '<div class="sab-herocap" style="font-weight:800;color:var(--accent)">' +
        motif('lotus', 20) + esc(G.kingdoms[king].name) + (king === id ? ' — this is the seat' : '') + '</div>';
      /* with a plate, the stations ARE the people UI — the tiles stay only
         for a city with no painting to stand them on */
      if (!heroArt) h += '<div class="mono" style="margin-top:4px">The people · ' + pop + ' praja · eat ' +
        (pop * T.eat) + ' \ud83c\udf3e each turn</div><div class="sab-jobs" id="sab-sec-people">' +
        Object.keys(DATA.jobs).map(function (jid) {
          var jd = DATA.jobs[jid];
          var up = j.kisan + j.karigar + j.kathakar + j.rakshak < pop;
          return '<div class="sab-job">' +
            '<span class="sab-tico" style="width:28px;height:28px;border-radius:9px">' + ic({ kisan: 'wheat', karigar: 'hammer', kathakar: 'scroll', rakshak: 'shield' }[jid], 18) + '</span>' +
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
        /* the great one has a FACE now — an invented role, painted, never a
           real person (docs/05: roles may be pieces; people may not) */
        var hface = spOf({ kheti: 'hero-annadata', shilpa: 'hero-sthapati', vidya: 'hero-acharya' }[s.kind]);
        if (q.hero.used) {
          /* the deed is done: one quiet chip, not a whole card — the gift
             still reads, and the page gets its air back */
          h += '<div class="sab-mile" id="sab-sec-hero"><span class="mch star">★ ' +
            esc(hd.name) + ' stays · ' + esc(hd.gift) + '</span></div>';
        } else {
        h += '<div class="sab-quest" id="sab-sec-hero" style="border-color:var(--accent)">' +
          (hface ? '<img class="sab-heroface" src="' + hface + '" alt="">' : '') +
          '<div class="who" style="color:var(--accent)">' +
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
        }
        h += '</div>';
        }
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
      /* THE MILESTONES, AS CHIPS. The works rows and the monument row were
         three tall boxes retelling what the plate already shows (the scaffold
         IS the monument button); one line of chips keeps the story. The full
         rows remain for a city with no painting. */
      if (heroArt) {
        h += '<div class="sab-mile" id="sab-sec-works">' +
          (s.works || []).slice(0, 2).map(function (w2, i2) {
            return '<span class="mch' + (q.lv > i2 ? ' done' : (q.lv === i2 ? ' next' : '')) + '"' +
              (q.lv === i2 ? ' title="grow the city to build this"' : '') + '>' +
              (q.lv > i2 ? '✓ ' : '') + esc(w2) + '</span>';
          }).join('') +
          (q.mon
            ? '<span class="mch star" title="the monument stands — +2 📜, and the mist cannot touch this town">★ ' + esc(s.works[2]) + '</span>'
            : '<span class="mch' + (q.lv >= 3 ? ' next' : '') + '" title="' +
              (q.lv >= 3 ? 'raise it on the scaffold above' : 'a level-3 city may raise its monument') +
              '">★ ' + esc(s.works[2]) + '</span>') +
          '</div>';
      } else
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
      /* the plate's plots ARE the build board (all five buildings fit);
         the rows stay only for a city with no painting */
      if (!heroArt) h += '<div class="mono" style="margin-top:4px">Build</div><div class="sab-jobs" id="sab-sec-build">' +
        Object.keys(BLD).map(function (bid) {
          var bd = BLD[bid];
          if (bd.era > G.era) return '';
          var bicon = '<span class="sab-tico" style="width:28px;height:28px;border-radius:9px;font-size:15px">' + bd.icon + '</span>';
          if (q.bld[bid]) return '<div class="sab-job" style="opacity:.8" title="' + esc(bd.what) + '">' + bicon +
            '<b>' + esc(bd.name) + '</b><span class="what">\u2713 built</span></div>';
          var c = costOf(bd.cost, 'building');
          return '<div class="sab-job" title="' + esc(bd.what) + '">' + bicon +
            '<b>' + esc(bd.name) + '</b>' +
            '<button class="sab-btn" style="min-height:40px;padding:6px 10px;font-size:12px" data-sab-act="build" data-b="' + bid + '"' +
            (canPay(c) ? '' : ' disabled') + '>' + costStr(c) + '</button>' +
            '<span class="what">' + esc(bd.what) + '</span>' +
            '</div>';
        }).join('') + '</div>';

      /* THE CAPITAL — one city carries the realm. Moving it is how it always was:
         the Magadha kings left Rajagriha for Pataliputra when the river roads mattered
         more than the hills. */
      if (G.capital !== id && !heroArt) {
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
            ? '<p>' + (quiz.of !== id ? 'About <b>' + esc(byId[quiz.of].name) + '</b>: ' : '') + esc(askList(byId[quiz.of])[quiz.qi || 0].q) + '</p>' +
              riddleOptions(byId[quiz.of], quiz.qi).map(function (o) {
                return '<button class="sab-btn" style="display:block;width:100%;text-align:left;margin:6px 0" data-sab-act="quiz" data-o="' + esc(o) + '">' + esc(o) + '</button>';
              }).join('') +
              (riddleWrong ? '<p class="tiny" style="color:var(--muted)">Not that one — think of the city\u2019s own telling. Another go.</p>' : '')
            : '<p>The teacher will take a question' + (G.tech.script ? ' about any woken city' : '') + '.</p>' +
              '<button class="sab-btn" data-sab-act="quizstart"' + (cd > 0 ? ' disabled' : '') + '>' +
              (cd > 0 ? 'The teacher rests (' + cd + 's)' : 'Ask me one (+' +
                ((G.tech.script ? T.quizFarPay : T.quizPay) * (G.tech.press ? 2 : 1)) + ' 📜)') + '</button>') +
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
            (G.utsav <= 0 && G.res.anna >= utsavCost().anna && G.res.kala >= utsavCost().kala ? '' : ' disabled') +
            '>Hold the utsav here (' + utsavCost().anna + ' 🌾 + ' + utsavCost().kala + ' 🛠️)</button>';
        } else if (qq.kind === 'riddle') {
          h += riddleOptions(s).map(function (o) {
            return '<button class="sab-btn" style="display:block;width:100%;text-align:left;margin:6px 0" ' +
              'data-sab-act="qriddle" data-o="' + esc(o) + '">' + esc(o) + '</button>';
          }).join('') + (riddleWrong ? '<p class="tiny" style="color:var(--muted)">Not that one — the city\u2019s own telling below has it. Another go.</p>' : '');
        } else {
          h += '<p class="tiny" style="color:var(--muted)">This one is done out on the map — the scroll will close itself.</p>';
        }
        h += '</div>';
      }
      if (q.seen) {
        h += (window.IND_CITY_PHOTO_HTML ? window.IND_CITY_PHOTO_HTML(id) : '') +
          '<div class="sab-cfact">' + esc(s.fact) + '</div>';
        (s.more || []).forEach(function (mf) {
          h += '<div class="sab-cfact">' + esc(mf) + '</div>';
        });
      }
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
        /* the way out lives on the bar now — land the focus on its Map pill */
        var f = D.querySelector('#sab-sheet .sab-act') || hostEl.querySelector('button');
        if (f) f.focus({ preventScroll: true });
        /* the topbar is sticky: without a scroll margin the nameplate and the
           sky badges land underneath it and the city seems to have no name */
        var hdr = D.querySelector('.topbar');
        hostEl.style.scrollMarginTop = hdr ? (hdr.getBoundingClientRect().height + 8) + 'px' : '96px';
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

    /* ================================================================
       WALK MODE — the yatri, the camera, and walking-as-touching.
       The camera is scale(1.22) + a translate that chases the yatri,
       CLAMPED so the plate always covers the frame (when the yatri
       pushes an edge, that edge sits flush — the build plots at the
       bottom stay reachable). Touch walks, arrows walk (both, house
       rule), and arriving within reach of the treasure spot digs it.
       ================================================================ */
    var CAM_S = 1.22;
    function camStr() {
      /* the painted plate is a wide picture and wants a camera pushed into it;
         the built board IS the city, edge to edge, and cropping it throws away
         the half you were about to look at */
      if (W.IND_KIT_MODE) return 'scale(1) translate(0,0)';
      var fit = function (p, o) {
        var t = (0.5 - o) / CAM_S + o - p / 100;
        var lo = o + (1 - o) / CAM_S - 1, hi = o - o / CAM_S;
        return (Math.max(lo, Math.min(hi, t)) * 100).toFixed(2);
      };
      return 'scale(' + CAM_S + ') translate(' + fit(av.x, 0.5) + '%,' + fit(av.y, 0.6) + '%)';
    }
    function camFollow() {
      var cam = D.getElementById('sab-cam');
      if (cam) cam.style.transform = camStr();
    }
    function arrive() {
      if (!city) return;
      var tz = (DATA.treasures || {})[city];
      if (tz && !G.tre[city] && Math.hypot(tz.x - av.x, tz.y - av.y) < 9) findKhazana();
    }
    /* THE YATRI WALKS THE STREETS. A tap is a destination, not a teleport:
       the nearest road node to where you stand is joined to the nearest node
       to where you tapped, Dijkstra finds the way between them, and the walk
       follows that street. The last few steps may leave the road — you step
       off the path to reach a doorway or dig a khazana — but never more than
       a short hop. A plate with no atlas keeps the old straight line. */
    var walkQ = null;
    function walkStep() {
      var el = D.getElementById('sab-yatri');
      if (!el || !walkQ || !walkQ.length) {
        walkQ = null; walkTimer = null;
        if (el) el.classList.remove('walking');
        arrive(); return;
      }
      var pt = walkQ.shift();
      var dx = pt[0] - av.x, dist = Math.hypot(dx, pt[1] - av.y);
      if (dx) el.classList.toggle('flip', dx < 0);
      av.x = pt[0]; av.y = pt[1];
      var dur = Math.max(0.18, dist / 26);
      el.style.transition = 'left ' + dur + 's linear,top ' + dur + 's linear';
      el.classList.add('walking');
      el.style.left = av.x + '%'; el.style.top = av.y + '%';
      camFollow();
      walkTimer = setTimeout(walkStep, dur * 1000 + 30);
    }
    function walkTo(px, py) {
      var el = D.getElementById('sab-yatri');
      if (!el || !city) return;
      px = Math.max(3, Math.min(97, px)); py = Math.max(8, Math.min(96, py));
      if (walkTimer) { clearTimeout(walkTimer); walkTimer = null; }
      walkQ = null;
      var route = [], g = roadGraph(city);
      if (g && g.nodes.length) {
        var from = nearestNode(g, av.x, av.y), to = nearestNode(g, px, py);
        var path = roadPath(g, from.i, to.i);
        if (path) {
          for (var i = 0; i < path.length; i++) route.push(g.nodes[path[i]].slice());
          /* the last hop off the street, kept short so nobody wanders */
          if (to.d > 1.5) {
            var last = route[route.length - 1];
            var hop = Math.min(to.d, 10) / to.d;
            route.push([last[0] + (px - last[0]) * hop, last[1] + (py - last[1]) * hop]);
          }
        }
      }
      if (!route.length) route = [[px, py]];
      if (REDUCED) {   /* no motion: they simply stand at the end of the road */
        var end = route[route.length - 1];
        el.style.transition = 'none';
        if (end[0] !== av.x) el.classList.toggle('flip', end[0] < av.x);
        av.x = end[0]; av.y = end[1];
        el.style.left = av.x + '%'; el.style.top = av.y + '%';
        camFollow(); arrive(); return;
      }
      walkQ = route;
      walkStep();
    }
    function findKhazana() {
      if (!city || G.tre[city]) return;
      var tz = (DATA.treasures || {})[city];
      if (!tz) return;
      G.tre[city] = true; G.score += 30; G.res.katha += 20;
      grant(20, 'khazana \u2014 ' + tz.name);
      var tzs = byId[city];
      fxAt(tzs.x, tzs.y, 'glory');
      showOverlay('<div class="mono" style="color:var(--accent2)">\u2726 khazana \u2014 found!</div>' +
        '<h3>' + esc(tz.name) + '</h3><p>' + esc(tz.what) + '</p>' +
        '<p class="tiny" style="color:var(--accent);font-weight:700">\ud83e\ude99 +20 \u00b7 +20 \ud83d\udcdc \u2014 a story worth keeping</p>' +
        '<p class="tiny" style="color:var(--muted)">' + esc(tz.src) + '</p>' +
        '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Into the pothi</button></div>');
      say('Khazana! ' + tz.name + ' found at ' + nameOf(tzs) + '.', 'warm');
      paintCity();
    }

    /* ---- THE VIDYA PANEL: the tech tree, two doors an era ---- */
    var techOpen = false;
    function techHTML() {
      var rows = TECHS.map(function (t) {
        if (t.era > G.era) return '';
        var have = !!G.tech[t.id], c = costOf(t.cost, 'tech');
        var va = artOf('vidya-' + t.id);
        var busy = G.proj && G.proj.id === t.id;
        return '<div class="sab-work' + (have ? ' built' : busy ? ' now atwork' : ' now') + '">' +
          (va ? '<img class="sab-vthumb" src="' + va + '" alt=""' + (have ? '' : ' style="filter:grayscale(.8)"') + '>' : '<i>' + (have ? '✓' : '?') + '</i>') +
          '<span><b>' + esc(t.name) + '</b> · <span class="tiny" style="color:var(--muted)">' + esc(t.what) + '</span>' +
          (busy ? '<span class="sab-projbar" style="--pc:' + (projPct() * 100).toFixed(1) + '%">' +
            '<i></i><b>' + Math.round(projPct() * 100) + '%</b></span>' : '') + '</span>' +
          '<span style="flex:1"></span>' +
          (have ? '' : busy ? '<span class="tiny" style="color:var(--accent);font-weight:800">at work</span>'
            : '<button class="sab-btn" data-sab-act="tech" data-t="' + t.id + '"' +
            (canPay(c) && !G.proj ? '' : ' disabled') + '>' + costStr(c) + '</button>') +
          '</div>';
      }).join('');
      /* SUTRAS — the threads through the ages, drawn as malas filling bead by
         bead. Only threads the player has actually met appear: an arc is a
         discovery, not a checklist handed out in advance. */
      var threads = (DATA.sutras || []).map(function (t3) {
        var got = t3.beats.filter(function (_, bi) { return G.sutra[t3.id + ':' + bi]; }).length;
        if (!got) return '';
        var whole = got === t3.beats.length;
        return '<div class="sab-work' + (whole ? ' built' : ' now') + '">' +
          '<i>' + (whole ? '✓' : got) + '</i>' +
          '<span><b>' + esc(t3.name) + '</b> · <span style="letter-spacing:2px">' +
          t3.beats.map(function (_, bi) {
            return '<span style="color:' + (G.sutra[t3.id + ':' + bi] ? 'var(--accent2)' : 'var(--line)') + '">●</span>';
          }).join('') + '</span>' +
          (whole ? ' <span class="tiny" style="color:var(--muted)">— the mala is complete</span>' : '') +
          '</span></div>';
      }).join('');
      return '<div class="sab-city" role="dialog" aria-label="Vidya — what the age knows">' +
        '<div class="chead"><h3>Vidya</h3><span class="mono">what the age knows how to do</span>' +
        '<span style="flex:1"></span><button class="sab-btn" data-sab-act="techclose">Back to the map</button></div>' +
        (threads
          ? '<div class="mono" style="margin-top:8px">Sutras — the threads through the ages</div>' +
            '<div class="sab-works">' + threads + '</div>'
          : '') +
        (function () {
          var tot = Object.keys(DATA.treasures || {}).length;
          if (!tot) return '';
          var got2 = Object.keys(G.tre || {}).length;
          return '<div class="mono" style="margin-top:8px">Khazana — ' + got2 + ' of ' + tot +
            ' treasures found</div><p class="tiny" style="color:var(--muted);margin:2px 0 8px">' +
            'Every living city hides one real thing. The folk whisper where; a patient eye catches the glint. ' +
            'A city folded into memory keeps its unfound khazana forever.</p>';
        })() +
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
      if (name === 'city' && q.her) {
        /* a heritage city opens as a remembrance, not a to-do list */
        showOverlay('<div class="mono" style="color:var(--accent2)">a remembered city</div>' +
          '<h3>' + esc(nameOf(s)) + '</h3>' +
          (artOf(sel) ? '<img class="sab-cardart" src="' + artOf(sel) + '" alt="">' : '') +
          '<p>' + esc(s.fact) + '</p>' +
          '<p class="tiny" style="color:var(--muted)">The ages turned and its people walked on — but ' +
          (q.mon ? 'its monument still stands, and stone remembers: +1 📜 each turn, forever.'
                 : 'its stones still hold the story.') + '</p>' +
          '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Leave a lamp</button></div>');
        return;
      }
      if (name === 'city' && !q.zzz) { city = sel; riddleWrong = false;
        /* Contained, a board half again as wide as it is tall sits inside a
           phone's frame as a postage stamp with grey all round. A phone opens
           the city already leaning in, and pans; a desktop sees all of it. */
        /* the board is half again as wide as it is tall, so on a phone even a
           width-filling zoom leaves bands top and bottom; 2x covers the frame
           and the child pans from there */
        if (G.kitZ == null) G.kitZ = (W.innerWidth || 1024) < 700 ? 2 : 1;
        av = { x: 50, y: 84 };   /* you arrive at the city gate, street-side */
        if (walkTimer) { clearTimeout(walkTimer); walkTimer = null; }
        touch(sel); paintCity(); return; }
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
        fxAt(s.x, s.y, 'grow');
        say(s.name + ' grows \u2014 the land it may build on widens, and the '
            + 'shelf has more on it.', 'warm');
        if (city === sel) paintCity();
      }
      if (name === 'route') {
        if (!canPay(costOf({ kala: T.routeCost }, 'route'))) return say('Routes take kala — grow a craft town, or wait for the workshops.', '');
        targeting = true; say('Choose where the road from ' + s.name + ' should go.', '');
      }
      if (name === 'utsav' && G.utsav <= 0) {
        if (G.res.anna < utsavCost().anna || G.res.kala < utsavCost().kala)
          return say('An utsav needs both grain and craft — the whole village brings something.', '');
        G.res.anna -= utsavCost().anna; G.res.kala -= utsavCost().kala;
        G.res.katha += T.utsavKatha; G.utsav = T.utsavCd; G.score += 15; touch(sel);
        SITES.forEach(function (t) { var w = G.sites[t.id]; if (w.fade >= 0) { w.fade = -1; w.idle = 0; } });
        fxAt(s.x, s.y, 'utsav');
        say('Utsav at ' + s.name + '! Songs carry far — the mist pulls back from every fading lamp.', 'warm');
        var uq = G.quests[sel];
        if (uq && uq.kind === 'utsav') finishQuest(sel, 'The whole town danced.');
      }
      if (name === 'wake' && q.zzz) {
        if (!connected(sel)) return say(s.name + ' needs a road first — a story has to travel to be heard.', '');
        if (G.res.katha < T.wakeCost) return say('Not enough katha — stories are earned by helping and holding utsavs.', '');
        G.res.katha -= T.wakeCost; q.zzz = false; q.fade = -1; q.idle = 0; q.neg = 0; G.score += 25;
        fxAt(s.x, s.y, 'utsav');
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
      var AHA_ART = ['vidya-iron', 'vidya-script', 'vidya-zero', 'vidya-monsoon',
                     'vidya-paper', 'vidya-charkha', 'vidya-chahbagh', 'vidya-ship',
                     'vidya-railway', 'vidya-swadeshi', 'vidya-samvidhan', 'vidya-khula'];
      var ea = artOf(AHA_ART[G.era]);
      G.era++; G.score += 50;
      var next = ERAS[G.era];
      grant(40, 'a new age — ' + next.name);   /* a pitara draw's worth, into the child's pocket */

      /* THE AGE TURNS OVER THE CITIES TOO. One full age behind, an awake city
         folds into memory: the rains move, the rivers shift, the roads go
         elsewhere — its people walk to the nearest living neighbour, which
         grows, and its monument keeps shining forever. Capitals are exempt
         (some places are carried), and NOTHING here is a war: the causes are
         the ages themselves, which is the truth of most of these cities. */
      var folded = [];
      SITES.forEach(function (s) {
        var q = G.sites[s.id];
        /* three things carry a city across the ages: its MONUMENT (raised
           stone is never forgotten — the game's oldest promise, now the
           strategic reason to build one), its CONTINUITY (a city with later
           names, like Kashi-Banaras-Varanasi, never stopped being lived in),
           and the CROWN (the capital is carried). Everything else, two full
           ages behind, folds gently into memory. */
        if (!q || q.zzz || q.her || q.mon || (s.renames && s.renames.length) ||
            s.era > G.era - 1 || G.capital === s.id) return;
        q.her = true; q.fade = -1; q.idle = 0; q.neg = 0; q.dry = 0;
        if (G.quests[s.id]) delete G.quests[s.id];
        if (q.hero) q.hero.gone = true;
        /* the people walk to the nearest living city, and it grows */
        var near = null, best = 1e9;
        SITES.forEach(function (o) {
          var qo = G.sites[o.id];
          if (o.id === s.id || !qo || qo.zzz || qo.her || !found(o.id)) return;
          var dx = o.x - s.x, dy = o.y - s.y, d2 = dx * dx + dy * dy;
          if (d2 < best) { best = d2; near = o; }
        });
        if (near && G.sites[near.id].lv < T.maxLevel) G.sites[near.id].lv++;
        folded.push({ from: s, to: near });
      });
      /* names change with the age — the city is the same city */
      var renamed = [];
      SITES.forEach(function (s) {
        (s.renames || []).forEach(function (r) { if (r.era === G.era && found(s.id)) renamed.push(s); });
      });

      var lines = '';
      if (folded.length) {
        lines += '<p class="tiny" style="color:var(--muted)">' + folded.map(function (f) {
          return 'The ages turn at <b>' + esc(f.from.name) + '</b> — its people walk to ' +
            (f.to ? '<b>' + esc(nameOf(f.to)) + '</b>' : 'the living towns') +
            (G.sites[f.from.id].mon ? ', and its monument keeps telling its story' : '') + '.';
        }).join(' ') + '</p>';
      }
      if (renamed.length) {
        lines += '<p class="tiny" style="color:var(--muted)">' + renamed.map(function (s) {
          return '<b>' + esc(s.name) + '</b> now answers to <b>' + esc(nameOf(s)) + '</b> — the city is the same city.';
        }).join(' ') + '</p>';
      }
      showOverlay((ea ? '<img class="sab-cardart" src="' + ea + '" alt="">' : '') +
        '<h3>' + esc(aha.title) + '</h3><p>' + esc(aha.text) + '</p>' +
        '<p><b>' + esc(next.name) + '</b> · ' + esc(next.dates) + '<br>' + esc(next.note) + '</p>' + lines +
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
      grant(60, 'India remembers');
      showOverlay(mascot('gattu', 'happy', 110) + '<h3>India remembers.</h3>' +
        '<p>From the first brick of Dholavira to this morning’s countdown at Sriharikota — ' +
        'every lamp lit, every road walked, and the mist gone back to the sea. ' +
        'Five thousand years, and not one of these places was taken: every one was reached, ' +
        'and the ones that grew quiet are remembered by their stones.</p>' +
        '<div class="row"><button class="sab-btn go" data-sab-act="finish">Take a bow</button></div>');
    }

    /* ================================================================
       THE TICK — one second of the world
       ================================================================ */
    /* ==================================================================
       RAKSHA — the warning, the blow, and what stands in its way.

       House rule, unchanged and load-bearing: nothing here has a face. A
       threat is a banner on the horizon, a line of dust, a rising river.
       What the player sees is the NAME of a real pressure of the age and
       twenty seconds to do something about it.
       ================================================================== */
    function keyCity(id) {
      if (G.capital === id) return true;
      if (G.kingdoms && G.kingdoms[id]) return true;
      return PORTS.indexOf(id) >= 0;
    }
    /* every watcher this city can call on when the dust rises */
    function defenceOf(id) {
      var q2 = G.sites[id]; if (!q2) return { own: 0, wall: 0, help: 0, total: 0, from: [] };
      var own = jobsOf(id).rakshak;
      var wall = (q2.bld.prakara ? T.wallGuard : 0) + (q2.bld.durg ? T.fortGuard : 0);
      /* the neighbours march: half the idle watch of every city joined to this
         one by a road short enough to cross in time. Roads are defence. */
      var help = 0, from = [], me = byId[id];
      (G.routes || []).forEach(function (r2) {
        var other = r2[0] === id ? r2[1] : (r2[1] === id ? r2[0] : null);
        if (!other || !G.sites[other] || G.sites[other].zzz) return;
        var o = byId[other];
        if (Math.hypot(o.x - me.x, o.y - me.y) > T.helpRange) return;
        var sent = Math.floor(jobsOf(other).rakshak / 2);
        if (sent > 0) { help += sent; from.push(nameOf(o)); }
      });
      return { own: own, wall: wall, help: help, total: own + wall + help, from: from };
    }
    function threatPool() {
      return (DATA.raids || []).filter(function (r2) {
        return r2.era[0] <= G.era && G.era <= r2.era[1];
      });
    }
    /* DUST ON THE HORIZON. The city is named, the banner is named, and the
       clock starts — this is the twenty seconds the whole defence game
       lives inside. */
    function raiseWarning() {
      var towns = SITES.filter(function (x) { return inEra(x) && awake(x.id) && !isHer(x.id); });
      if (!towns.length) return;
      /* the great cities are the prize: weight them and they come under
         pressure the way real capitals and ports did */
      var bag = [];
      towns.forEach(function (x) {
        var w = keyCity(x.id) ? T.keyWeight : 1;
        for (var i = 0; i < w; i++) bag.push(x);
      });
      var tgt = bag[(G.t * 17 + bag.length) % bag.length];
      var pool = threatPool(); if (!pool.length) return;
      var raid = pool[(G.t * 5) % pool.length];
      /* a park wonder keeps the beasts off; a watchtower doubles the warning */
      if (raid.kind === 'beast' && wonderGuard(tgt.id, 'beast')) return;
      var lead = wonderGuard(tgt.id, 'watch') ? T.warnTower : T.warnTicks;
      G.warn = { id: tgt.id, raid: raid.id, at: G.t + lead, lead: lead };
      G.lastraid = G.t;
      fxAt(tgt.x, tgt.y, 'mist');
      say('\u26a0 ' + raid.warn + ' \u2014 ' + nameOf(tgt) + ' has a little time. ' +
          'Put rakshaks on the gate, or raise a wall.', 'mist');
      paintAll();
    }
    /* THE BLOW. Held, and the city has a story worth telling; not held, and
       it is hurt in ways a child can see on the plate. */
    function strikeNow() {
      var w = G.warn; G.warn = null;
      if (!w) return;
      var tgt = byId[w.id], q2 = G.sites[w.id];
      if (!tgt || !q2 || q2.zzz || isHer(w.id)) { paintAll(); return; }
      var raid = null; (DATA.raids || []).forEach(function (r2) { if (r2.id === w.raid) raid = r2; });
      if (!raid) { paintAll(); return; }
      var d = defenceOf(w.id);
      var str = raid.str + Math.floor(G.era / 3) + (keyCity(w.id) ? 2 : 0);
      if (d.total >= str) {
        var pay2 = 10 + str * 2;
        G.res.katha += pay2; G.score += 15;
        q2.held = (q2.held || 0) + 1;
        fxAt(tgt.x, tgt.y, 'utsav');
        say(raid.what + ' at ' + nameOf(tgt) + ' \u2014 but ' + raid.fended +
            (d.help ? ', and ' + d.from.join(' and ') + ' sent watchers down the road' : '') +
            '. The story is worth ' + pay2 + ' \ud83d\udcdc.', 'warm');
        paintAll(); if (city === w.id) paintCity();
        return;
      }
      /* it is through the gate */
      var short = str - d.total;
      var hurt = [];
      fxAt(tgt.x, tgt.y, 'mist');
      if (raid.hits === 'fade') { if (q2.fade < 0) q2.fade = 0; hurt.push('the lamps gutter'); }
      else {
        /* the loot is felt at any wealth: a flat bite for a young realm and a
           share of the store for a fat one, so a sacking always costs a season */
        var flat = (T.raidBase + G.era * 3) * short / 2;
        var share = G.res[raid.hits] * 0.07 * short;
        var loss = Math.min(G.res[raid.hits] * 0.45, Math.max(3, flat + share)) | 0;
        if (keyCity(w.id)) loss = Math.min(G.res[raid.hits] * 0.6, loss * 2) | 0;
        G.res[raid.hits] = Math.max(0, G.res[raid.hits] - loss);
        hurt.push(loss + ' ' + ICON[raid.hits] + ' carried off');
      }
      /* a building is thrown down — the fort is the last thing to go */
      var order = ['bazaar', 'workshop', 'gurukul', 'granary', 'stepwell', 'prakara', 'durg'];
      for (var bi = 0; bi < order.length; bi++) {
        if (q2.bld[order[bi]]) {
          delete q2.bld[order[bi]];
          if (bldSeen) delete bldSeen[w.id + ':' + order[bi]];
          hurt.push('the ' + DATA.buildings[order[bi]].name.toLowerCase() + ' is thrown down');
          break;
        }
      }
      /* and a monument still rising loses a stage — unless a fort shelters it */
      if (q2.monB && !q2.bld.durg) {
        var back = Math.round(q2.monB.dur / T.monStages);
        q2.monB.at = Math.min(G.rt, q2.monB.at + back);
        hurt.push('the scaffolding comes down a stage');
      }
      q2.neg = Math.max(q2.neg, negLimit(w.id));
      q2.sack = (q2.sack || 0) + 1;
      if (q2.sack >= T.sackSleep) {
        q2.zzz = true; q2.sack = 0; q2.jobs = null;
        say(raid.what + ' at ' + nameOf(tgt) + ' \u2014 ' + hurt.join(', ') +
            '. Sacked three times over, the city has gone quiet. Wake it again when you can.', 'mist');
      } else {
        say(raid.what + ' at ' + nameOf(tgt) + ' \u2014 ' + hurt.join(', ') +
            '. It needed ' + str + ' on the gate and had ' + d.total +
            '. Rakshaks, a prakara, a road from a neighbour \u2014 any of them would have held it.', 'mist');
      }
      paintAll(); if (city === w.id) paintCity();
    }
    /* ==================================================================
       THE WONDERS OF THE LAND — Bhugol, walked into the game.

       A hundred and twenty two of the four hundred real places on the
       physical map are marked as wonders. They lie hidden on the Sabhyata
       board until a scout walks near one; then it opens its own picture card,
       joins the realm, and gives the nearest city a standing gift for the
       rest of the game. A waterfall turns a wheel; a park keeps the beasts
       off; a lake means the drought never bites; a peak is a watchtower that
       sees the dust two turns early. Nothing is invented: every gift is the
       thing that place actually does for the country around it.
       ================================================================== */
    var WONDER_GIFT = { anna: 'anna', kala: 'kala', katha: 'katha', akal: 'akal', watch: 'watch',
                        beast: 'beast' };
    var WONDER_SAY = {
      anna: '+2 \ud83c\udf3e to the nearest city, every turn',
      kala: '+2 \ud83d\udee0\ufe0f to the nearest city, every turn',
      katha: '+2 \ud83d\udcdc to the nearest city, every turn',
      akal: 'the nearest city never thirsts again',
      watch: 'a watchtower \u2014 the dust is seen twice as early'
    };
    var WONDER_FIND = 90;      /* map units a scout's eye carries */
    function wonderList() {
      var B = W.IND_BHUGOL;
      if (!B) return [];
      if (!wonderList._c) wonderList._c = B.features.filter(function (f) { return f.w; });
      return wonderList._c;
    }
    function wonderById(wid) {
      var l = wonderList();
      for (var i = 0; i < l.length; i++) if (l[i].id === wid) return l[i];
      return null;
    }
    /* a park found is a park that keeps the beasts out of the wheat */
    function giftKind(f) { return f.w === 'anna' && f.t === 'park' ? 'beast' : f.w; }
    function nearestCity(f) {
      var best = null, bd = 1e9;
      SITES.forEach(function (s2) {
        if (!inEra(s2) || !awake(s2.id)) return;
        var d = Math.hypot(s2.x - f.x, s2.y - f.y);
        if (d < bd) { bd = d; best = s2; }
      });
      return best;
    }
    /* the standing gift a city collects from every wonder near it */
    function wonderYield(id) {
      var out = { anna: 0, kala: 0, katha: 0 };
      var me = byId[id]; if (!me) return out;
      Object.keys(G.wonders || {}).forEach(function (wid) {
        var f = wonderById(wid); if (!f) return;
        if (Math.hypot(f.x - me.x, f.y - me.y) > 150) return;
        var k = f.w;
        if (k === 'anna' || k === 'kala' || k === 'katha') out[k] += 2;
      });
      return out;
    }
    function wonderDry(id) {   /* a lake or a wetland: this city never thirsts */
      var me = byId[id]; if (!me) return false;
      var hit = false;
      Object.keys(G.wonders || {}).forEach(function (wid) {
        var f = wonderById(wid); if (!f) return;
        if (f.w === 'akal' && Math.hypot(f.x - me.x, f.y - me.y) <= 150) hit = true;
      });
      return hit;
    }
    /* every step a scout takes, it looks around */
    function scoutLook(ex) {
      var found = null;
      wonderList().some(function (f) {
        if (G.wonders[f.id]) return false;
        if ((f.we || 0) > G.era) return false;              /* not known in this age yet */
        if (Math.hypot(f.x - ex.x, f.y - ex.y) > WONDER_FIND) return false;
        found = f; return true;
      });
      if (!found) return null;
      G.wonders[found.id] = G.t;
      G.res.katha += 20; G.score += 25;
      var near = nearestCity(found);
      var pic = (W.IND_BHUGOL_PHOTOS || {})[found.id];
      var art2 = pic ? 'art/bhugol/ph/' + pic.file
        : ((W.IND_BHUGOL_ART || []).indexOf(found.id) >= 0 ? 'art/bhugol/' + found.id + '.jpg' : null);
      var kind = giftKind(found);
      showOverlay('<div class="mono" style="color:var(--accent2)">\u2726 a wonder of the land</div>' +
        '<h3>' + esc(found.n) + '</h3>' +
        (art2 ? '<img class="sab-cardart" src="' + art2 + '" alt="">' : '') +
        '<p>' + esc(found.f) + '</p>' +
        '<p class="tiny" style="color:var(--accent);font-weight:700">+20 \ud83d\udcdc \u2014 and ' +
        (kind === 'beast' ? 'no beast troubles ' + (near ? esc(nameOf(near)) : 'the towns near it') + ' again'
                          : (WONDER_SAY[kind] || 'a gift for the land')) + '</p>' +
        '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Wonderful</button></div>');
      say('Your scout has found ' + found.n + '!', 'warm');
      return found;
    }

    /* a wonder's standing gift, once the scouts have found it (Bhugol) */
    function wonderGuard(id, kind) {
      var W2 = G.wonders || {};
      var me = byId[id]; if (!me) return false;
      var hit = false;
      Object.keys(W2).forEach(function (wid) {
        var f = wonderById(wid); if (!f) return;
        if (WONDER_GIFT[f.t] !== kind) return;
        if (Math.hypot(f.x - me.x, f.y - me.y) <= 150) hit = true;
      });
      return hit;
    }

    /* ---- the works in hand: what is being learned, what is being raised ---- */
    function schools() {
      var k = 0;
      SITES.forEach(function (s2) { var q2 = G.sites[s2.id]; if (q2 && q2.bld && q2.bld.gurukul) k++; });
      return k;
    }
    function techDur() {
      var base = T.techTicks + T.techEra * G.era;
      var cut = Math.max(T.techFloor, 1 - schools() * T.techSchool);
      return Math.max(4, Math.round(base * cut));
    }
    function monDur(id) {
      var s2 = byId[id];
      var base = T.monTicks + T.monEra * s2.era;
      var cut = Math.max(T.monFloor, 1 - jobsOf(id).karigar * T.monHand);
      return Math.max(6, Math.round(base * cut));
    }
    function projPct() {
      if (!G.proj) return 0;
      return Math.max(0, Math.min(1, (G.rt - G.proj.at) / G.proj.dur));
    }
    function monPct(id) {
      var q2 = G.sites[id];
      if (!q2 || !q2.monB) return 0;
      return Math.max(0, Math.min(1, (G.rt - q2.monB.at) / q2.monB.dur));
    }
    function monStage(id) { return Math.min(T.monStages, Math.floor(monPct(id) * T.monStages) + 1); }
    /* one beat of the workshops and the school, whatever screen is open */
    function progressWorks() {
      G.rt++;
      if (G.proj && projPct() >= 1) {
        var td = null; TECHS.forEach(function (t2) { if (t2.id === G.proj.id) td = t2; });
        G.tech[G.proj.id] = true; G.proj = null; G.score += 30;
        if (td) say(td.name + ' — learned at last! ' + td.what, 'warm');
        if (techOpen) paintTech();
        paintAll();
      }
      var done = null;
      SITES.forEach(function (s2) {
        var q2 = G.sites[s2.id];
        if (q2 && q2.monB && !q2.mon && monPct(s2.id) >= 1) { q2.mon = true; q2.monB = null; done = s2; }
      });
      if (done) {
        touch(done.id); G.score += 60; G.res.katha += 10;
        grant(15, 'a monument raised');
        say(done.works[2].charAt(0).toUpperCase() + done.works[2].slice(1) + ' — ' + nameOf(done) +
            ' has raised its monument. Stone remembers.', 'warm');
        if (city === done.id) paintCity();
        paintAll();
      } else if (city && G.sites[city] && G.sites[city].monB) {
        paintBuildBar();
      } else if (G.proj && techOpen) {
        paintProjBar();
      }
    }
    /* cheap in-place refreshes so a full repaint never fights the animation */
    function paintBuildBar() {
      var el = D.querySelector('.sab-scafbtn'); if (!el || !city) return;
      var pc = monPct(city), st2 = monStage(city);
      el.className = 'sab-scafbtn building st' + st2;
      var em = el.querySelector('em');
      if (em) em.textContent = 'raising \u00b7 stage ' + st2 + ' of ' + T.monStages;
      el.style.setProperty('--pc', (pc * 100).toFixed(1) + '%');
    }
    function paintProjBar() {
      var el = D.querySelector('.sab-projbar'); if (!el) return;
      el.style.setProperty('--pc', (projPct() * 100).toFixed(1) + '%');
      var lab = el.querySelector('b');
      if (lab) lab.textContent = Math.round(projPct() * 100) + '%';
    }
    function tick() {
      /* the works advance wherever the player is standing — pause is pause,
         but a city screen no longer freezes the masons and the school */
      if (!(pause || G.won || dead)) progressWorks();
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
        if (!q.zzz && !q.her) eaten += popOf(s.id) * T.eat;
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
        var arrived = [], found2 = null;
        G.explorers.forEach(function (ex) {
          var t2 = byId[ex.target];
          if (!t2 || found(ex.target)) { ex.done = true; return; }
          var dx = t2.x - ex.x, dy = t2.y - ex.y, d = Math.sqrt(dx * dx + dy * dy);
          var spd = T.exploreSpeed * (G.tech.satellite ? 2 : 1);   /* an eye in the sky finds the way */
          if (d <= spd) { ex.x = t2.x; ex.y = t2.y; ex.done = true; arrived.push(ex.target); }
          else { ex.x += dx / d * spd; ex.y += dy / d * spd; }
          if (!found2) found2 = scoutLook(ex);      /* one wonder a turn, at most */
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
      if (G.warn && G.t >= G.warn.at) { strikeNow(); }
      else if (!G.warn && G.t - G.lastraid >= T.raidEvery && !(G.calmUntil > G.t)) {   /* ahimsa holds */
        raiseWarning();
      }

      /* AKAL — the rains fail somewhere. Impersonal like everything else that
         tests this world: the fields halve until the clouds come back, a
         stepwell makes a town immune, and nobody is ever to blame. */
      if (G.era >= 2 && G.t - (G.lastakal || 0) >= T.akalEvery) {
        var dryable = SITES.filter(function (x) {
          var qx = G.sites[x.id];
          return inEra(x) && awake(x.id) && !isHer(x.id) && x.kind === 'kheti' &&
            !qx.bld.stepwell && !wonderDry(x.id) && !(qx.dry > 0);
        });
        if (dryable.length) {
          var dt = dryable[(G.t * 13) % dryable.length];
          G.sites[dt.id].dry = T.akalLen;
          G.lastakal = G.t;
          fxAt(dt.x, dt.y, 'mist');
          say('The rains hold off over ' + nameOf(dt) + ' — an akal. The fields bring in half until the clouds return; a stepwell would have held water.', 'mist');
        } else G.lastakal = G.t;
      }
      SITES.forEach(function (s) {
        var qd = G.sites[s.id];
        if (qd && qd.dry > 0) {
          qd.dry--;
          if (qd.dry === 0) say('The clouds break over ' + nameOf(s) + ' — the akal ends and the fields drink.', 'warm');
        }
      });

      /* DARSHAN — a great one passes through, and the world receives them.
         Fired once each, era-gated, at their own city; a card with its frame
         badge and sources, and a boon the player never owns or spends. */
      /* one card roughly every 45 real seconds — G.t is a 3-second tick */
      if (!overlay && G.t - (G.lastdarshan || 0) >= 15) {
        var dar = (DATA.darshan || []).filter(function (d) {
          return !G.darshan[d.id] && d.era <= G.era && G.sites[d.site] &&
            found(d.site) && awake(d.site) && !isHer(d.site);
        })[0];
        if (dar) {
          G.darshan[dar.id] = true; G.lastdarshan = G.t; G.score += 30;
          var ds = byId[dar.site], b3 = dar.boon || {};
          if (b3.katha) G.res.katha += b3.katha;
          if (b3.anna) G.res.anna += b3.anna;
          if (b3.kind === 'peace' && G.disp) { G.disp = null; G.lastd = G.t; }
          if (b3.kind === 'calm') G.calmUntil = G.t + (b3.len || 40) * 3;
          if (b3.kind === 'shine') SITES.forEach(function (s2) {
            var q3 = G.sites[s2.id];
            if (q3 && !q3.zzz) { if (q3.fade >= 0) q3.fade = -1; q3.idle = 0; q3.neg = 0; }
          });
          fxAt(ds.x, ds.y, 'utsav');
          showOverlay('<div class="mono" style="color:var(--accent2)">' +
            (dar.frame === 'katha' ? '🪔 katha — as it is told' : '📜 itihaas — what evidence shows') + '</div>' +
            '<h3>' + esc(dar.name) + '</h3><p>' + esc(dar.text) + '</p>' +
            '<p class="tiny" style="color:var(--accent);font-weight:700">' + esc(dar.boonLine) + '</p>' +
            '<p class="tiny" style="color:var(--muted)">' + esc((dar.sources || []).join(' · ')) + '</p>' +
            '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Carry it onward</button></div>');
          say('A darshan at ' + nameOf(ds) + '.', 'warm');
        } else {
          /* SUTRA BEATS — the threads through the ages. Each thread fires its
             beads strictly IN ORDER, at its own era and city, on the same
             gentle cadence as the darshans; a finished mala pays a pitara
             draw. The card carries the frame badge, the beads and the source,
             so the arc teaches the way everything here teaches. */
          var nt = null, nb = null, ni = 0;
          (DATA.sutras || []).some(function (t3) {
            var i3 = 0;
            while (G.sutra[t3.id + ':' + i3]) i3++;
            var b4 = t3.beats[i3];
            if (b4 && b4.era <= G.era && G.sites[b4.site] && found(b4.site) &&
                (awake(b4.site) || isHer(b4.site))) { nt = t3; nb = b4; ni = i3; return true; }
            return false;
          });
          if (nt) {
            G.sutra[nt.id + ':' + ni] = true; G.lastdarshan = G.t;
            G.score += 25; G.res.katha += 25;
            var wholeMala = nt.beats.every(function (_, bi) { return G.sutra[nt.id + ':' + bi]; });
            if (wholeMala) grant(40, 'a thread complete — ' + nt.name);
            var bs = byId[nb.site];
            fxAt(bs.x, bs.y, 'utsav');
            var dots = nt.beats.map(function (_, bi) {
              return '<span style="color:' + (G.sutra[nt.id + ':' + bi] ? 'var(--accent2)' : 'var(--line)') + '">●</span>';
            }).join(' ');
            showOverlay('<div class="mono" style="color:var(--accent2)">' +
              (nb.frame === 'katha' ? '🪔 katha — as it is told' : '📜 itihaas — what evidence shows') + '</div>' +
              '<h3>' + esc(nt.name) + '</h3>' +
              '<div style="font-size:12px;margin:0 0 8px">' + dots +
              ' <span class="tiny" style="color:var(--muted)">bead ' + (ni + 1) + ' of ' + nt.beats.length + '</span></div>' +
              '<p>' + esc(nb.text) + '</p>' +
              '<p class="tiny" style="color:var(--accent);font-weight:700">+25 📜 — a thread worth telling' +
              (wholeMala ? ' · the mala is complete! 🪙 +40' : '') + '</p>' +
              '<p class="tiny" style="color:var(--muted)">' + esc(nb.src) + '</p>' +
              '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Carry it onward</button></div>');
            say('A thread continues at ' + nameOf(bs) + ' — ' + nt.name + '.', 'warm');
          }
        }
      }

      /* A GREAT ONE RISES. A level-3 town may produce a hero — a role, never a named
         ruler: the Annadata, the Sthapati, the Acharya. One great deed each, and a
         quiet gift while they stay. */
      SITES.forEach(function (s) {
        var q = G.sites[s.id];
        if (!inEra(s) || q.zzz || q.her || q.hero || q.lv < T.heroAt) return;
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
          return awake(r[0]) && awake(r[1]) && !isHer(r[0]) && !isHer(r[1]) && G.capital !== r[0] && G.capital !== r[1];
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
        if (q.zzz || q.her) return;                 /* memory does not fade twice */
        if (G.tech.satellite) { q.idle = 0; if (q.fade >= 0) q.fade = -1; return; }   /* nothing found is ever lost again */
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
        var cands = SITES.filter(function (s) { return inEra(s) && awake(s.id) && !isHer(s.id) && connected(s.id); });
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

      /* the ending must not wait for a click: a world that becomes complete
         by simply living completes (maybeEnd guards itself against overlays) */
      maybeEnd();

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
    /* PAN AND ZOOM. A city you build in is a city you move around inside, and
       scrollbars are not how anyone does that. Drag the board to pan; wheel or
       pinch to zoom about the pointer; +/- and double-click as well, because
       every game here works by finger AND by key. */
    var ZOOMS = [0.6, 0.85, 1, 1.4, 2, 2.8];

    function kitView() { return D.getElementById('sab-view'); }

    function kitZoomTo(z, ax, ay) {
      var v = kitView(); if (!v) return;
      var old = G.kitZ || 1;
      z = Math.max(ZOOMS[0], Math.min(ZOOMS[ZOOMS.length - 1], z));
      if (Math.abs(z - old) < 0.001) return;
      /* keep the point under the pointer under the pointer */
      var r = v.getBoundingClientRect();
      var px = (ax == null ? r.width / 2 : ax - r.left) + v.scrollLeft;
      var py = (ay == null ? r.height / 2 : ay - r.top) + v.scrollTop;
      G.kitZ = z;
      paintCity();
      var v2 = kitView(); if (!v2) return;
      W.IND_KIT.fit(D);
      var k = z / old;
      v2.scrollLeft = px * k - (ax == null ? r.width / 2 : ax - r.left);
      v2.scrollTop = py * k - (ay == null ? r.height / 2 : ay - r.top);
    }

    function kitStep(d, ax, ay) {
      var i = ZOOMS.indexOf(G.kitZ || 1); if (i < 0) i = 2;
      kitZoomTo(ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, i + d))], ax, ay);
    }

    var drag = null, pinch = null;

    function kitPointerDown(e) {
      var v = kitView();
      if (!v || !city || !kitOn(city) || hold) return;
      if (e.target.closest && e.target.closest('[data-sab-act]')) return;
      if (!v.contains(e.target)) return;
      drag = { x: e.clientX, y: e.clientY, sl: v.scrollLeft, st: v.scrollTop, moved: 0 };
      v.classList.add('grabbing');
    }
    function kitPointerMove(e) {
      if (!drag) return;
      var v = kitView(); if (!v) { drag = null; return; }
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.moved = Math.max(drag.moved, Math.abs(dx) + Math.abs(dy));
      v.scrollLeft = drag.sl - dx;
      v.scrollTop = drag.st - dy;
      if (drag.moved > 6) swallowClick = true;   /* a drag is not a tap */
    }
    function kitPointerUp() {
      var v = kitView();
      if (v) v.classList.remove('grabbing');
      drag = null;
    }
    function kitWheel(e) {
      var v = kitView();
      if (!v || !city || !kitOn(city) || !v.contains(e.target)) return;
      e.preventDefault();
      kitStep(e.deltaY < 0 ? 1 : -1, e.clientX, e.clientY);
    }
    function kitTouch(e) {
      var v = kitView();
      if (!v || !city || !kitOn(city)) return;
      if (e.touches && e.touches.length === 2) {
        var a = e.touches[0], b2 = e.touches[1];
        var d = Math.hypot(a.clientX - b2.clientX, a.clientY - b2.clientY);
        var mx = (a.clientX + b2.clientX) / 2, my = (a.clientY + b2.clientY) / 2;
        if (!pinch) { pinch = { d: d, z: G.kitZ || 1 }; }
        else if (d > 0) {
          e.preventDefault();
          kitZoomTo(pinch.z * (d / pinch.d), mx, my);
        }
      } else { pinch = null; }
    }

    /* A tap on the board is a placement, not a walk. The board's own scale
       lives on the element, so the sum works at every zoom and every turn. */
    function kitTap(e) {
      if (!city || !hold || !kitOn(city)) return false;
      var inr = D.getElementById('sab-kitinner');
      if (!inr || !inr.contains(e.target)) return false;
      var r = inr.getBoundingClientRect();
      var k = parseFloat(inr.getAttribute('data-k')) || 1;
      var cell = W.IND_KIT.cellAtPx(city, (e.clientX - r.left) / k,
                                    (e.clientY - r.top) / k,
                                    G.kitRot || 0, 1, KIT_HEAD);
      if (!cell) return true;
      var it = BY_PART[hold.p];
      var why = canPlace(city, it, cell.x, cell.y);
      if (why) { say('Not there — ' + why + '.', ''); paintCity(); return true; }
      pay(costOf(it.cost, 'building'));
      var q2 = kitOf(city);
      if (it.tile) {                     /* a field IS the ground it replaces */
        q2.tiles[cell.x + ',' + cell.y] = it.p;
      }
      q2.kit.push({ p: it.p, x: cell.x, y: cell.y, f: hold.f || 0 });
      if (it.bld) q2.bld[it.bld] = true;   /* the seven keep their old powers */
      G.score += 6;
      touch(city);
      say((W.IND_KIT.def(it.p) || {}).name + ' stands in ' + nameOf(byId[city]) + '.', 'warm');
      if (!canPay(costOf(it.cost, 'building'))) hold = null;   /* out of coin: hands empty */
      paintCity(); paintAll();
      return true;
    }

    /* the held piece follows the finger, so a child sees where it will land */
    function kitHover(e) {
      if (!city || !hold || !kitOn(city)) return;
      var inr = D.getElementById('sab-kitinner');
      if (!inr || !inr.contains(e.target)) return;
      var r = inr.getBoundingClientRect();
      var k = parseFloat(inr.getAttribute('data-k')) || 1;
      var cell = W.IND_KIT.cellAtPx(city, (e.clientX - r.left) / k,
                                    (e.clientY - r.top) / k,
                                    G.kitRot || 0, 1, KIT_HEAD);
      if (!cell) return;
      if (hold.cell && hold.cell.x === cell.x && hold.cell.y === cell.y) return;
      hold.cell = cell;
      paintCity();
    }

    function onClick(e) {
      if (swallowClick) { swallowClick = false; return; }   /* that was a drag, not a tap */
      if (kitTap(e)) return;
      var actEl = e.target.closest ? e.target.closest('[data-sab-act]') : null;
      if (actEl) {
        var a = actEl.getAttribute('data-sab-act');
        if (a === 'zin')  { zoomTo(zlevel - 1, sel && byId[sel] ? byId[sel] : null); return; }
        if (a === 'zout') { zoomTo(zlevel + 1); return; }
        if (a === 'zreset') { zoomTo(2); return; }
        var flashSec = function (secId) {
          if (!secId) return;
          var sec = D.getElementById(secId);
          if (sec) {
            sec.scrollIntoView({ block: 'center', behavior: 'smooth' });
            sec.classList.remove('sab-flash'); void sec.offsetWidth;
            sec.classList.add('sab-flash');
          }
        };
        if (a === 'cjump') { flashSec(actEl.getAttribute('data-t')); return; }
        if (a === 'leave') { city = null; riddleWrong = false; quiz = null; paintCity(); paintAll(); return; }
        if (a === 'khazana' && city && !G.tre[city]) {
          /* the glint calls: the yatri walks to the spot and digs on
             arrival (tab to it and press Enter, and they walk the same
             walk). Only if there is no yatri to send does the find
             happen in place. */
          var tz = (DATA.treasures || {})[city];
          if (tz) { if (D.getElementById('sab-yatri')) walkTo(tz.x, tz.y); else findKhazana(); }
          return;
        }
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
        /* the renderer switch. It lives on the game object so a reload keeps
           whichever board the child was looking at, and it repaints in place
           rather than reopening the city. */
        if (a === 'kittoggle') {
          W.IND_KIT_MODE = !W.IND_KIT_MODE;
          try { localStorage.setItem('ind.kit', W.IND_KIT_MODE ? '1' : '0'); } catch (e2) {}
          paintCity(); paintAll(); return;
        }
        if (a === 'kitturn') {
          G.kitRot = ((G.kitRot || 0) + 1) % 4;
          paintCity(); paintAll(); return;
        }
        /* zoom is the board's own, not the yatri camera's: a city you can
           build in is a city you must be able to lean into */
        if (a === 'kitzoom') { kitStep(+actEl.getAttribute('data-d') || 1); return; }
        if (a === 'kitpick') {
          var pid2 = actEl.getAttribute('data-p');
          hold = (hold && hold.p === pid2) ? null : { p: pid2, cell: null, f: 0 };
          if (hold) G.kitOpen = false;   /* hands full: out of the way of the land */
          paintCity(); return;
        }
        if (a === 'kitdrop') { hold = null; paintCity(); return; }
        if (a === 'kitopen') { G.kitOpen = !G.kitOpen; paintCity(); return; }
        if (a === 'kittab') { G.kitTab = actEl.getAttribute('data-g'); paintCity(); return; }
        if (a === 'kitturnp') { if (hold) hold.f = ((hold.f || 0) + 1) % 4; paintCity(); return; }
        if (a === 'gowarn') {
          if (!G.warn || !byId[G.warn.id]) return;
          sel = G.warn.id; targeting = false;
          act('city'); return;
        }
        if (a === 'mon' && city) {
          flashSec(actEl.getAttribute('data-t'));
          var qm = G.sites[city], sm = byId[city];
          if (qm.mon || qm.lv < 3) return;
          var mc = costOf(T.monCost[sm.era], 'monument');
          if (!canPay(mc)) return;
          if (qm.monB) return;
          pay(mc);
          qm.monB = { at: G.rt, dur: monDur(city) };
          var hands = jobsOf(city).karigar;
          say('The foundation is laid at ' + sm.name + '. ' +
            (hands ? hands + ' karigar' + (hands > 1 ? 's' : '') + ' on the work — put more hands here and it rises faster.'
                   : 'No karigars here yet — assign some and the work speeds up.'), 'warm');
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
          flashSec(actEl.getAttribute('data-t'));
          var pool = [];
          SITES.forEach(function (x) {
            if (!G.sites[x.id].seen || !x.ask) return;
            if (!G.tech.script && x.id !== city) return;
            for (var qi2 = 0; qi2 < askList(x).length; qi2++) pool.push({ id: x.id, qi: qi2 });
          });
          if (!pool.length) return;
          var pick2 = pool[(G.quizN + G.t) % pool.length];
          quiz = { at: city, of: pick2.id, qi: pick2.qi }; riddleWrong = false; G.quizN++;
          paintCity(); return;
        }
        if (a === 'quiz' && city && quiz) {
          var po = actEl.getAttribute('data-o'), qs = byId[quiz.of];
          if (po === askList(qs)[quiz.qi || 0].o[0]) {
            var payq = quiz.of === city ? T.quizPay : T.quizFarPay;
            if (G.tech.press) payq *= 2;   /* a thousand copies by morning */
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
          if (G.proj) { say('The school is already at work on ' +
            (function () { var o = ''; TECHS.forEach(function (t2) { if (t2.id === G.proj.id) o = t2.name; }); return o; })() +
            '. One thing at a time.', 'warm'); return; }
          pay(tc);
          G.proj = { id: tid, at: G.rt, dur: techDur() };
          say(td.name + ' — the school begins. ' + (schools() ? schools() + ' gurukul' + (schools() > 1 ? 's' : '') +
            ' at work; it' : 'It') + ' will take a while.', 'warm');
          paintTech(); paintAll(); return;
        }
        if (a === 'techclose') { techOpen = false; paintTech(); paintAll(); return; }
        if (a === 'restart2') { wipe(); G = fresh(); sel = null; kbd = null; targeting = false; bldSeen = null;
          overlay = null; VZ = { x: 0, y: 0, w: 1000, h: 1100 };
          shell(); bindHud(); zlevel = 1; fitFound(true); say('A new dawn at Dholavira.', 'warm'); return; }
        if (a === 'ovclose') { showOverlay(null); paintAll(); maybeEnd(); return; }
        if (a === 'finish') { showOverlay(null); if (typeof done === 'function') done({ win: true, score: G.score, kauris: 25 }); return; }
        return act(a);
      }
      /* inside a city, the plate itself is ground: tap it and the yatri
         walks there. The camera rect (transformed) maps the tap back to
         plate coordinates exactly, because the transform is scale+pan. */
      if (city) {
        var scn = e.target.closest ? e.target.closest('.sab-scene') : null;
        if (scn) {
          var camEl = D.getElementById('sab-cam');
          var rr = (camEl || scn).getBoundingClientRect();
          if (rr.width) walkTo((e.clientX - rr.left) / rr.width * 100,
                               (e.clientY - rr.top) / rr.height * 100);
        }
        return;
      }
      var id = siteAt(e.target);
      if (id) {
        if (G.ev && id === G.ev.id) return helpEvent();
        if (targeting) return tryRoute(id);
        /* ENTERING IS A DOUBLE TAP, AND WE COUNT IT OURSELVES.
           The browser's own dblclick could not be used: selecting a city
           repaints the map, which replaces the very node the second click
           would have landed on, so no dblclick ever fired on a city that
           was not ALREADY selected — a child had to double-click twice, once
           to select and once to enter, which is not what double-click means.
           Timing the two taps here works whatever the repaint does, and gives
           touch the same gesture, which dblclick never reliably did. */
        var now = Date.now();
        var again = lastTap.id === id && now - lastTap.t < 450;
        lastTap = { id: id, t: now };
        var qd = G.sites[id];
        if (again && qd && !qd.zzz && qd.fade < 0) {
          lastTap = { id: null, t: 0 };
          sel = id; kbd = id; act('city');
          return;
        }
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
        /* Escape unwinds one thing at a time, innermost first: put the held
           piece back, then close the city. Closing the city while a child is
           holding a hut is not what Escape means. */
        if (e.key === 'Escape' && hold) { eat(); hold = null; paintCity(); return; }
        if (e.key === 'Escape') { eat(); city = null; riddleWrong = false; quiz = null; paintCity(); paintAll(); return; }
        /* the arrows walk the yatri — the keyboard walks too (house rule) */
        /* HOLDING A PIECE, THE ARROWS MOVE IT. Every game here works by
           finger AND by key, and a builder that only takes taps is half a
           builder. Enter sets it down, Esc puts it back, R turns it. */
        if (hold && kitOn(city)) {
          var C2 = (W.IND_KIT_CITIES || {})[city];
          if (!hold.cell) hold.cell = { x: C2.centre[0], y: C2.centre[1] };
          var mv = { ArrowLeft: [-1, 0], ArrowRight: [1, 0],
                     ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
          if (mv) {
            eat();
            hold.cell.x = Math.max(0, Math.min(C2.gw - 1, hold.cell.x + mv[0]));
            hold.cell.y = Math.max(0, Math.min(C2.gh - 1, hold.cell.y + mv[1]));
            paintCity();
            W.IND_KIT.lookSoon(city, G.kitRot || 0, KIT_HEAD, [hold.cell.x, hold.cell.y]);
            return;
          }
          if (e.key === 'Enter' || e.key === ' ') {
            eat();
            var inr2 = D.getElementById('sab-kitinner');
            if (inr2) {
              var rr = inr2.getBoundingClientRect(),
                  kk = parseFloat(inr2.getAttribute('data-k')) || 1,
                  cc = W.IND_KIT.turn(hold.cell.x, hold.cell.y, 1, 1,
                                      G.kitRot || 0, C2.gw, C2.gh),
                  an = W.IND_KIT.anchor(cc.x, cc.y, 1, 1),
                  ox2 = ((G.kitRot || 0) % 2 ? C2.gw : C2.gh) * W.IND_KIT.W;
              kitTap({ target: inr2, clientX: rr.left + (an.x + ox2) * kk,
                       clientY: rr.top + (an.y + KIT_HEAD * W.IND_KIT.RISE - 16) * kk });
            }
            return;
          }
          if (e.key === 'r' || e.key === 'R') { eat(); hold.f = ((hold.f || 0) + 1) % 4; paintCity(); return; }
          if (e.key === 'Escape') { eat(); hold = null; paintCity(); return; }
        }
        if (e.key === 'ArrowLeft')  { eat(); walkTo(av.x - 12, av.y); return; }
        if (e.key === 'ArrowRight') { eat(); walkTo(av.x + 12, av.y); return; }
        if (e.key === 'ArrowUp')    { eat(); walkTo(av.x, av.y - 10); return; }
        if (e.key === 'ArrowDown')  { eat(); walkTo(av.x, av.y + 10); return; }
        return;   /* inside the city, buttons are tabbable and Esc is the door */
      }
      if (techOpen) {
        if (e.key === 'Escape') { eat(); techOpen = false; paintTech(); paintAll(); }
        return;
      }
      if (overlay) { if (e.key === 'Enter' || e.key === 'Escape') { eat(); var f = D.querySelector('#sab-ovhost [data-sab-act]'); if (f) f.click(); } return; }
      var k = e.key;
      if (k === '+' || k === '=') { eat(); zoomTo(zlevel - 1, kbd && byId[kbd] ? byId[kbd] : null); return; }
      if (k === '-' || k === '_') { eat(); zoomTo(zlevel + 1); return; }
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
      b.textContent = pause ? '▶' : '⏸';
      b.setAttribute('aria-label', pause ? 'Play' : 'Pause');
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
    G.rt = G.rt || 0; if (G.proj === undefined) G.proj = null;
    if (G.warn === undefined) G.warn = null; G.wonders = G.wonders || {};
    G.kingdoms = G.kingdoms || {}; G.lastraid = G.lastraid || 0; G.explorers = G.explorers || [];
    /* the later ages' fields, absent on older saves — and the later ages'
       CITIES, which an old save has never heard of: they arrive asleep under
       the mist, exactly as a fresh world would hold them */
    G.darshan = G.darshan || {}; G.sutra = G.sutra || {}; G.tre = G.tre || {}; G.lastakal = G.lastakal || 0;
    G.lastdarshan = G.lastdarshan || 0; G.calmUntil = G.calmUntil || 0;
    SITES.forEach(function (s) {
      if (!G.sites[s.id]) G.sites[s.id] = { lv: 1, zzz: true, fade: -1, idle: 0, seen: false,
        found: false, bld: {}, mon: false, neg: 0, jobs: null, hero: null };
      var q = G.sites[s.id];
      q.her = q.her || false; q.dry = q.dry || 0;
    });
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
      st2.addEventListener('pointerdown', onPointerDown);
    }
    bindHud();
    fitFound();
    host.addEventListener('mousedown', onMouseDown);
    host.addEventListener('click', onClick);
    D.addEventListener('pointermove', onPointerMove);
    /* crossing the phone/desktop breakpoint changes where the crew stands and
       what the banner says, so the city is repainted when it happens */
    var lastNarrow = (W.innerWidth || 1024) < 700, rsz = null;
    W.addEventListener('resize', function () {
      clearTimeout(rsz);
      rsz = setTimeout(function () {
        var n = (W.innerWidth || 1024) < 700;
        if (n !== lastNarrow) { lastNarrow = n; if (city) paintCity(); }
        if (W.IND_KIT) W.IND_KIT.fit(D);
      }, 160);
    });
    /* crossing the phone/desktop breakpoint changes where the crew stands and
       how much the banner says, so the city is repainted when it happens */
    var lastNarrow = (W.innerWidth || 1024) < 700, rsz = null;
    W.addEventListener('resize', function () {
      clearTimeout(rsz);
      rsz = setTimeout(function () {
        var n = (W.innerWidth || 1024) < 700;
        if (n !== lastNarrow) { lastNarrow = n; if (city) paintCity(); }
        if (W.IND_KIT) W.IND_KIT.fit(D);
      }, 160);
    });
    host.addEventListener('pointermove', kitHover);
    host.addEventListener('pointerdown', kitPointerDown);
    D.addEventListener('pointermove', kitPointerMove);
    D.addEventListener('pointerup', kitPointerUp);
    D.addEventListener('pointercancel', kitPointerUp);
    host.addEventListener('wheel', kitWheel, { passive: false });
    host.addEventListener('touchmove', kitTouch, { passive: false });
    host.addEventListener('touchend', function () { pinch = null; });
    /* double-tap the board zooms in, the way every map does */
    host.addEventListener('dblclick', function (e) {
      var v = kitView();
      if (v && city && kitOn(city) && v.contains(e.target) && !hold) {
        e.preventDefault(); kitStep(1, e.clientX, e.clientY);
      }
    });
    /* Going into a city is handled in onClick, which counts the two taps
       itself — see the note there on why the browser's dblclick cannot do it.
       A dblclick listener is still wanted for one thing only: stopping the
       browser selecting the label text under a fast double tap. */
    host.addEventListener('dblclick', function (e) {
      if (!city && siteAt(e.target)) e.preventDefault();
    });
    D.addEventListener('pointerup', onPointerUp);
    D.addEventListener('pointercancel', onPointerUp);
    /* keys live on the document: focus often rests on the page body, and a game whose
       keyboard only works after a click is a game with no keyboard (house rule). The
       teardown removes it, and `dead` guards the gap. */
    D.addEventListener('keydown', onKey, true);
    /* a debug window, not an API — the same idiom the carrom board uses, so a
       headless check can read the real clock instead of guessing at pixels */
    W.__SABG = function () { return G; };
    W.__SAB = function () {
      return { t: G.t, rt: G.rt, won: !!G.won, pause: pause, dead: dead,
               overlay: !!overlay, city: city, techOpen: techOpen, warn: G.warn,
               era: G.era, proj: G.proj };
    };
    timer = setInterval(tick, TICK_MS);
    if (!REDUCED) lifeRAF = requestAnimationFrame(lifeStep);

    return function teardown() {
      dead = true;
      clearInterval(timer);
      if (lifeRAF) cancelAnimationFrame(lifeRAF);
      if (G && !G.won) save(G);
      host.removeEventListener('mousedown', onMouseDown);
      host.removeEventListener('click', onClick);
      D.removeEventListener('pointermove', onPointerMove);
      D.removeEventListener('pointerup', onPointerUp);
      D.removeEventListener('pointercancel', onPointerUp);
      D.removeEventListener('keydown', onKey, true);
      W.removeEventListener('resize', onResize);
      clearTimeout(rsTm);
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
