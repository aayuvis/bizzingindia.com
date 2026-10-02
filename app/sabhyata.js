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

  /* THE CLOCK IS A SETTING NOW, AND ONE OF ITS SETTINGS STOPS IT.
     Three seconds was the right answer to "the numbers move faster than a child can
     read them" and the wrong answer to "I am not making strategic decisions", because
     both have the same cause: a clock that runs whether or not anyone has decided
     anything. A world that moves on its own can only ever be reacted to — every
     quarrel, raid and lean season arrives as an interruption, and the player spends
     the game putting out fires they did not choose.

     SOCHNA — thinking — is the default: nothing happens until Agla Saal is pressed.
     That is the whole difference between a strategy game and a game of catch. The
     live speeds stay for anyone who wants the world breathing on its own, and the
     old three seconds is still one of them. */
  var SPEEDS = [
    { id: 'sochna',   name: 'Sochna',   ms: 0,    what: 'the world waits for you' },
    { id: 'slow',     name: 'Slow',     ms: 4500, what: 'a turn every 4.5 seconds' },
    { id: 'standard', name: 'Standard', ms: 3000, what: 'a turn every 3 seconds' },
    { id: 'quick',    name: 'Quick',    ms: 1800, what: 'a turn every 1.8 seconds' }
  ];
  var SPEED_BY = {}; SPEEDS.forEach(function (x) { SPEED_BY[x.id] = x; });
  var SPEED_DEFAULT = 'sochna';

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
    /* THE BOARD TAKES WHAT IS LEFT, and what is left is nearly everything. The wrap
       is a column that knows its own height, so `flex:1` on the stage means "all the
       room nobody else claimed" instead of "as tall as the picture happens to be". */
    '.sab-wrap{display:flex;flex-direction:column;gap:6px;min-height:min(86vh,940px);color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    /* The stage knows its own size now (it is the map's ratio), so it must not also be
       told a height by flex-grow: when both axes are definite, aspect-ratio is simply
       ignored, which is how a phone kept a quarter of its board empty while the desktop
       rule appeared to work. Height leads, width follows it, and max-width takes over
       on anything narrow. */
    '.sab-wrap>.sab-stage{flex:0 0 auto}',
    /* the side wrapper does not exist as far as a narrow layout is concerned */
    '.sab-side{display:contents}',
    '.sab-bar,.sab-tray,#sab-cityhost{order:0}',
    '.sab-stage{order:1}',
    '.sab-rail,.sab-strip,.sab-realm,.sab-advise,.sab-guide,.sab-help{order:2}',
    /* one line, and it does not wrap into two */
    '.sab-bar{flex:0 0 auto}',
    '.sab-strip{flex:0 0 auto}',
    /* the fold-away drawer for everything that is not the map */
    '.sab-more{display:flex;flex-wrap:wrap;gap:6px;padding:8px;border-radius:14px;background:var(--card);box-shadow:0 1px 2px rgba(30,20,64,.07),0 8px 26px rgba(30,20,64,.10)}',
    '.sab-more[hidden]{display:none}',
    /* ONE LINE RUNS THE GAME. Era, coins, the selected place and every verb
       share a single strip; on a narrow screen it wraps, on a monitor it is
       one line. The era and the coins are information and stay flat. */
    '.sab-era{display:flex;flex-direction:column;justify-content:center;padding-right:4px}',
    '.sab-era b{display:block;font:800 14.5px/1.1 var(--display,Georgia,serif);white-space:nowrap}',
    '.sab-era span{font-size:9px;color:var(--muted);font-weight:700;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}',
    '.sab-res{display:flex;gap:5px;flex-wrap:nowrap;min-width:0;overflow:hidden}',
    /* NUMBERS ARE REFERENCE, NOT ACTION. Four chips with the same lift and shadow as
       the buttons made the bar read as eight things to press, of which six do nothing
       when pressed. They sit flat now and the eye goes past them to the verb. */
    '.sab-chip{display:inline-flex;align-items:center;gap:3px;padding:4px 8px;border:0;border-radius:999px;background:var(--card2,var(--card));box-shadow:none;font-weight:800;font-size:12.5px;white-space:nowrap;color:var(--text2,var(--text))}',
    '.sab-chip small{font-weight:600;color:var(--muted)}',
    '.sab-restless{background:#fdf0e6;cursor:pointer}',
    /* the chip that moved, and by how much */
    '.sab-chip{position:relative}',
    '.sab-chip.sab-moved{animation:sabbump .5s cubic-bezier(.2,.8,.3,1.2)}',
    '.sab-delta{position:absolute;left:50%;top:-2px;transform:translateX(-50%);font:900 11px/1 var(--body,system-ui,sans-serif);' +
      'color:var(--accent3,#2f6f5e);pointer-events:none;animation:sabfloat 1.1s ease-out forwards}',
    '.sab-delta.down{color:var(--muted)}',
    '@keyframes sabbump{0%{transform:scale(1)}38%{transform:scale(1.11)}100%{transform:scale(1)}}',
    '@keyframes sabfloat{0%{opacity:0;transform:translate(-50%,4px)}' +
      '22%{opacity:1}100%{opacity:0;transform:translate(-50%,-16px)}}',
    /* THE PRESS IS ACKNOWLEDGED. A button that does something big should feel like it
       was pressed, or a child presses it twice. */
    '.sab-act.go:active{transform:scale(.96)}',
    '.sab-act{transition:transform .12s ease}',
    /* a row that arrives should arrive, not blink into being */
    '.sab-railrow{animation:sabslide .22s ease-out}',
    '@keyframes sabslide{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:none}}',
    /* AND ALL OF IT STOPS when a child has asked for less motion. Feedback is the one
       kind worth keeping, so the delta still appears — it simply does not travel. */
    '@media (prefers-reduced-motion: reduce){' +
      '.sab-chip.sab-moved,.sab-railrow{animation:none}' +
      '.sab-act{transition:none}' +
      '.sab-delta{animation:none;opacity:1;transform:translate(-50%,-14px)}' +
    '}',
    /* A CHIP THAT CAN BE TAPPED IS A BUTTON and takes a button's target, however
       small the numbers beside it get. Shrinking the resource chips for the phone
       took khushi down to 25px with it — it is the one chip that opens something. */
    '.sab-chip[data-sab-act]{min-height:40px;padding-left:10px;padding-right:10px}',
    /* PINNED TO THE CITY FRAME, bottom centre, where a thumb already is and where the
       board has its emptiest ground. It keeps clear of Build (bottom left), Grow
       (bottom right) and the zoom row. */
    /* IT MUST NOT WRAP AND IT MUST NOT LAND ON ANYTHING. The first cut sat bottom
       centre, which on a phone is exactly where Grow already is: the coins broke to
       two rows, "Agla Saal" broke to two lines with its count clipped off, and the
       whole thing sat under the Grow button. nowrap everywhere, and on a narrow
       screen it moves to the clear column under the map button instead of fighting
       for the bottom edge with the two verbs that were there first. */
    '.sab-cityturn{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:6;' +
      'display:flex;align-items:center;gap:6px;padding:5px;border-radius:999px;white-space:nowrap;' +
      'flex-wrap:nowrap;background:color-mix(in srgb,var(--card) 94%,transparent);' +
      'box-shadow:0 2px 6px rgba(30,20,64,.14),0 10px 30px rgba(30,20,64,.18)}',
    '.sab-cityres{gap:3px;flex-wrap:nowrap}',
    '.sab-cityturn .sab-chip{box-shadow:none;background:transparent;font-size:12.5px;padding:2px 5px;white-space:nowrap}',
    '.sab-cityturn .sab-act{min-height:42px;white-space:nowrap}',
    '.sab-cityturn .sab-act .lbl{flex-direction:row;gap:5px;align-items:baseline}',
    '.sab-cityturn .sab-act em{font-style:normal;font-weight:800;opacity:.85;font-size:11px}',
    '@media (max-width:620px){' +
      '.sab-cityturn{left:8px;right:auto;top:108px;bottom:auto;transform:none;gap:3px;padding:4px;' +
        'flex-direction:column;align-items:stretch;border-radius:16px}' +
      '.sab-cityres{justify-content:center}' +
      '.sab-cityturn .sab-chip{font-size:11.5px;padding:1px 3px}' +
      '.sab-cityturn .sab-act{min-height:38px;font-size:12px;padding:5px 9px;justify-content:center}' +
      '.sab-cityturn .sab-act em{display:none}' +
    '}',
    '.sab-ages{display:flex;align-items:center;gap:2.5px;border:0;background:none;padding:6px 4px;min-height:44px;cursor:pointer;flex:0 1 auto;min-width:0;overflow:hidden}',
    '.sab-ages i{width:7px;height:7px;border-radius:50%;background:var(--line);display:block}',
    '.sab-ages i.g{background:var(--accent2)}',
    '.sab-ages i.q{background:var(--muted);opacity:.6}',
    '.sab-ages i.now{background:var(--accent);box-shadow:0 0 0 2px rgba(0,0,0,.06)}',
    '.sab-advise{flex:0 0 auto;display:flex;gap:6px;align-items:stretch;margin:0}',
    '.sab-advisebtn{flex:1;display:flex;gap:7px;align-items:center;text-align:left;border:0;border-radius:12px;background:var(--card);box-shadow:0 1px 2px rgba(30,20,64,.08);padding:9px 11px;min-height:44px;font:inherit;color:var(--text);cursor:pointer}',
    '.sab-advisebtn em{font-style:normal;font-weight:900;color:var(--accent2)}',
    '.sab-advisebtn span{font-size:12.5px;font-weight:700}',
    '.sab-brk{padding:7px 0;border-bottom:1px solid var(--line)}',
    '.sab-brk b{display:block;font-size:15px}',
    '.sab-brk span{display:block;font-size:11.5px;color:var(--muted);font-weight:700}',
    '.sab-brk i{font-style:normal;font-weight:600}',
    /* THE RAIL sits above the board, never over it */
    /* FLOATING, TOP RIGHT, over sea. Narrow enough to leave the land visible behind
       it and capped so it can never become a wall down the side of the board. */
    '.sab-rail{display:flex;flex-direction:column;gap:4px;width:auto}',
    '.sab-realm{display:none;flex-direction:column;gap:4px}',
    '.sab-realmhd{font:800 11px/1.2 var(--body);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:2px 0 0}',
    '.sab-realmrow{display:flex;align-items:baseline;gap:8px;text-align:left;border:0;width:100%;' +
      'background:var(--card);border-radius:10px;padding:7px 11px;min-height:40px;cursor:pointer;' +
      'box-shadow:0 1px 2px rgba(30,20,64,.07)}',
    '.sab-realmrow b{font:800 12.5px/1.3 var(--body);color:var(--text);white-space:nowrap}',
    '.sab-realmrow i{font:700 10.5px/1.3 var(--body);color:var(--muted);font-style:normal;white-space:nowrap}',
    '.sab-realmrow s{flex:1;text-align:right;font:700 11px/1.3 var(--body);color:var(--muted);' +
      'text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sab-realmrow.idle s{color:var(--accent2)}',
    '.sab-realmasleep{font:700 11px/1.35 var(--body);color:var(--muted);padding:2px 2px 0}',
    '.sab-railgo{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    /* ON A PHONE A RAIL THAT WRAPS TO FIVE LINES IS A WALL ACROSS THE COUNTRY. It keeps
       one line each and the rest is the tap. */
    '@media (max-width:620px){' +
      '.sab-railgo{font-size:11.5px;padding:6px 9px;min-height:34px}' +
      '.sab-railx{width:34px;min-height:34px;font-size:13px}}',
    '.sab-rail[hidden]{display:none}',
    '.sab-railgo,.sab-railx{backdrop-filter:saturate(1.2)}',
    '.sab-railrow{display:flex;gap:4px;align-items:stretch}',
    '.sab-railgo{flex:1;text-align:left;border:0;border-radius:10px;background:var(--card);box-shadow:0 1px 2px rgba(30,20,64,.08);padding:8px 11px;min-height:40px;font:700 12px/1.3 var(--body,system-ui,sans-serif);color:var(--text);cursor:pointer}',
    /* ==================================================================
       COLOUR MEANS ONE THING AT A TIME
       ==================================================================
       Two problems, and the second is the editorial one.

       In this app's warm theme --accent is #c63c28, a red, and it is what every GO
       button wears: Agla Saal, Grow, the primary of every card. I then made the rail's
       top row red too. So on one screen red meant both "press this" and "worry about
       this", and a child has no way to tell those apart by colour -- which is the only
       thing colour is for.

       And an alarm-red warning is the wrong register for this game entirely. docs/16
       §3: no combat, no lives, no shaming; a fading site is SAD, NOT SCARY, and
       Vismriti follows docs/04 -- soft-edged, slow, never a face. A boar in the wheat
       is not an emergency. The mist is grey, so urgency here is the mist's own grey
       with weight behind it: a solid edge, a darker ground, heavier type. It reads as
       "this wants you" without once reading as "something terrible is happening".

       Red is left to mean exactly one thing: this is the thing to press. */
    '.sab-railrow .sab-railgo{border-left:4px solid transparent}',
    '.sab-railrow.p0 .sab-railgo{background:#eceaf0;color:var(--text);border-left-color:#6f6880;font-weight:800}',
    '.sab-railrow.p1 .sab-railgo{background:#f6f1e8;border-left-color:var(--accent2)}',
    '.sab-railrow.p2 .sab-railgo{border-left-color:rgba(120,110,140,.45)}',
    '.sab-railx{border:0;border-radius:10px;background:var(--card);box-shadow:0 1px 2px rgba(30,20,64,.08);width:40px;min-height:40px;font-size:15px;font-weight:800;color:var(--muted);cursor:pointer}',
    /* the road somebody overseas is waiting on */
    '.sab-route.asked{stroke:#d9a23d;stroke-width:4.5}',
    '@media (prefers-reduced-motion: reduce){.sab-route.asked{stroke-dasharray:none}}',
    '.sab-btn{min-height:44px;padding:8px 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--text);font:700 14px var(--body,system-ui);cursor:pointer}',
    '.sab-btn:disabled{opacity:.45;cursor:default}',
    '.sab-btn.go{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.sab-btn:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',

    /* [hidden] LOSES TO AN AUTHOR display RULE, AND IT COST THIS FILE THREE TIMES —
       the rail, then a hidden tray that kept 14 pixels and read as a mystery progress
       bar above the map, then the New era button, which stayed on screen as an empty
       red blob because the branch that hides it never sets its text. Three is enough:
       the rule goes in once, for everything under the wrapper, rather than being
       remembered for each new element. `hidden` is not a suggestion. */
    '.sab-wrap [hidden],.sab-wrap[hidden]{display:none !important}',
    /* THE STAGE IS THE MAP'S OWN SHAPE. It used to be whatever height the column had
       spare and whatever width the page was, and the svg's default preserveAspectRatio
       (xMidYMid meet) then pillarboxed a 1000x1100 portrait map inside it. On a 1440
       desktop that drew India at 39% of the stage width with 416px of dead ground on
       each side; on a phone it wasted a quarter of the height. Giving the stage the
       viewBox's own ratio means there is no letterbox to waste, at any size.
       Two rules used to set this svg's height and the second won by source order, so
       `height:100%` in the first was dead text that read as if it were doing the job.
       They are one rule now.
       WIDTH IS THE ONLY DIAL, and it is a min() of both limits. aspect-ratio is ignored
       outright when width and height are both definite, so setting a height as well
       silently reinstates the letterbox on whichever orientation it does not suit --
       that cost two rounds here, one wasting a phone's height and one a tablet's.
       min(100%, 72vh*10/11) is bound by the page on a phone and by the viewport on a
       desktop, and the height follows from the ratio in both. */
    '.sab-stage{position:relative;background:var(--ground2);border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;display:flex;aspect-ratio:10/11;width:min(100%,calc(72vh*10/11));height:auto;margin-inline:auto}',
    '.sab-stage>svg{flex:1 1 auto;display:block;width:100%;height:100%}',
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

    '.sab-feed{min-height:0;margin:0;font-size:13.5px;font-weight:600;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sab-feed:empty{display:none}',
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
    /* THE BAR WRAPS; THE GLOBALS DID NOT, and adding the turn strip to them pushed a
       390px phone 146px sideways. A row that cannot wrap inside a row that can is a
       row that overflows the moment anything is added to it. */
    '.sab-globals{display:flex;gap:8px;margin-left:auto;flex-wrap:wrap;justify-content:flex-end;min-width:0}',
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
    '.sab-act.sq[disabled]{opacity:.35}',
    '.sab-speed{border:0;border-radius:999px;background:var(--card);box-shadow:0 1px 2px rgba(30,20,64,.07);font:800 12px/1 var(--body,system-ui,sans-serif);color:var(--text);padding:7px 8px;min-height:44px}',
    /* THE PLOT PREVIEW sits with the held piece, above the shelf, because that is
       where the eye already is while a child is deciding where to put it. */
    '.sab-plotpv{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0 0;padding:7px 10px;border-radius:12px;background:var(--card);box-shadow:0 1px 2px rgba(30,20,64,.08);font-size:12px}',
    '.sab-plotpv.no{background:#fbeceb}',
    '.sab-plotpv b{font-size:13.5px;font-weight:900}',
    '.sab-plotpv i{font-style:normal;color:var(--muted);font-weight:700;margin-left:4px}',
    '.sab-pvwhy{flex:1 1 100%;color:var(--muted);line-height:1.35}',
    '.sab-pvno{color:#8a3a2e;font-weight:700}',
    /* the trees: a locked row is shown and greyed, never hidden */
    '.sab-work.sab-shut{opacity:.55}',
    /* THE AGE IS THE RUNG. Without it the two trees are one column of twenty-three
       rows and the ladder a child is climbing is invisible. */
    '.sab-rung{margin:12px 0 4px;font:800 11px/1 var(--body,system-ui,sans-serif);letter-spacing:.09em;' +
      'text-transform:uppercase;color:var(--muted)}',
    '.sab-rung.next{opacity:.55}',
    '.sab-works>.sab-rung:first-child{margin-top:2px}',
    /* AND A THING THAT WAITS ON ANOTHER HANGS OFF IT. A dependency written as a
       sentence ("after Iron Tools") is a fact a child has to hold in their head while
       looking somewhere else; indented, with a rule running back up to what it waits
       on, it is a shape they can see. */
    '.sab-work.sab-branch{margin-left:18px;position:relative}',
    '.sab-work.sab-branch::before{content:"";position:absolute;left:-12px;top:-7px;bottom:50%;' +
      'width:10px;border-left:2px solid var(--line);border-bottom:2px solid var(--line);' +
      'border-bottom-left-radius:8px}',
    '.sab-need{display:block;font-size:11px;font-weight:800;color:var(--muted);margin-top:2px}',
    '.sab-eu{display:block;font-size:11px;font-weight:800;color:var(--accent2);margin-top:2px}',
    '.sab-slots{display:flex;flex-direction:column;gap:8px;margin-top:4px}',
    '.sab-slot{padding:9px 11px;border-radius:12px;background:var(--card);box-shadow:0 1px 2px rgba(30,20,64,.08)}',
    '.sab-slot b{display:block;font-size:13.5px}',
    '.sab-slot>span{display:block;font-size:11.5px;color:var(--muted);margin:1px 0 6px}',
    '.sab-polpick{display:flex;flex-wrap:wrap;gap:6px}',
    '.sab-polpick .sab-btn{font-size:11.5px;padding:6px 9px;min-height:32px}',
    /* AGLA SAAL IS THE BIGGEST THING ON THE BAR, because in Sochna pressing it is
       the game. It carries a count of what is still waiting, so a child learns to
       clear the board before spending the year. */
    '#sab-turn{font-size:14px;padding:7px 14px;min-height:44px}',
    /* on a phone the strip keeps every target a finger can hit and drops the words
       it can do without — the house rule is 44px, not 44px on a monitor */
    /* ON A PHONE the numbers keep their icons and drop their per-turn tails: four
       chips reading "260 +44/turn of 180" is a sentence, and a sentence does not fit
       on one line beside a turn button that has to stay thumb-sized. */
    '@media (max-width:620px){' +
      '.sab-speed{font-size:11px;padding:7px 4px}' +
      '#sab-turn{font-size:13px;padding:7px 10px}' +
      '.sab-chip{font-size:12px;padding:3px 7px}' +
      '.sab-chip small{display:none}' +
      '.sab-era span{display:none}' +
      '.sab-wrap{min-height:min(88vh,860px)}' +
      /* the ages ribbon is the one thing on the line that can be read later: it is a
         history, not a decision, and it stays one tap away under the menu */
      '.sab-ages{display:none}' +
      '.sab-act.sq{width:40px;min-height:40px}' +
    '}',
    '#sab-turn em{font-style:normal;opacity:.8;font-weight:800;margin-left:6px}',
    '.sab-tico{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;flex:none;' +
      'background:var(--accent-soft,rgba(91,63,214,.1));color:var(--accent)}',
    '.sab-badge{position:absolute;top:-6px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;' +
      'background:var(--accent2);color:#fff;font:800 12px/21px var(--body,system-ui);border:2px solid var(--card);box-shadow:0 2px 6px rgba(0,0,0,.18)}',
    '.sab-badge.hot{background:var(--accent3)}',
    '@keyframes sabflash{0%,100%{box-shadow:0 4px 14px rgba(30,20,64,.06)}35%{box-shadow:0 0 0 4px color-mix(in srgb,var(--accent2) 55%,transparent),0 4px 14px rgba(30,20,64,.06)}}',
    '.sab-flash{animation:sabflash 1s ease 2}',

    /* z-index 80: the built city is a fixed surface at 70, and a card raised
       from inside it has to land ON it rather than behind it */
    '.sab-over{position:fixed;top:0;right:0;bottom:0;left:0;display:flex;align-items:flex-start;justify-content:center;background:color-mix(in srgb,var(--ground) 82%,transparent);padding:18px;z-index:80;overflow:auto}',
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
    /* THE PANEL SCROLLS, NOT THE PAGE.
       `position:sticky` on the head did nothing, and it could not: sticky pins to the
       nearest scrolling ancestor, and the scrolling ancestor here was the document —
       so a screen into Vidya the whole panel, title and exit included, had simply gone
       up past the top of the window. A child was in a long list with no name on it and
       no door, which is the thing sticky was supposed to prevent.

       Bounding the panel makes it its own scroller: the head stays because there is now
       something for it to stay inside, and the page behind stops sliding the game away. */
    '.sab-city{background:var(--card);border:0;border-radius:20px;padding:12px 12px 16px;box-shadow:0 2px 6px rgba(30,20,64,.05),0 14px 40px rgba(30,20,64,.08);max-height:min(82vh,900px);overflow:auto;overscroll-behavior:contain}',
    /* THE HEAD STAYS. A screen into Vidya, the title and the way out had both gone off
       the top: a child was in a long list with no name on it and no door. */
    '.sab-city .chead{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;position:sticky;top:0;z-index:5;' +
      'background:var(--card);padding:6px 0 8px;box-shadow:0 8px 12px -8px rgba(30,20,64,.18)}',
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
      /* A DESKTOP HAS ROOM FOR THE RAIL BESIDE THE MAP, so it stops being an overlay.
         While the board was letterboxed the rail happened to land in the dead ground
         and cleared the land by accident; taking the letterbox away put it over the
         northeast. Reserving the strip as padding means the map's own box ends where
      /* A PORTRAIT MAP ON A LANDSCAPE SCREEN IS BOUND BY HEIGHT, so height is what to
         spend: the width follows from the map's own ratio, and that is the only way a
         1000x1100 map gets bigger on a wide screen without being cropped.
         There is no reserved strip here any more. The rail used to float over the board
         and pass F bought it room by taking 280px of board -- on every screen, whether
         or not anything was live. The rail is simply not on the map now. */
      '.sab-stage{width:min(100%,calc(84vh*10/11))}' +
    '}',
    /* THE HUD GOES BESIDE THE MAP, NOT ABOVE IT, ONCE THERE IS ROOM.
       India is taller than it is wide, so on a landscape screen the board is bound by
       height and can never fill the width without being cropped -- and cropping India
       is not on the table. Stacking the bar on top then spent the one axis that was
       actually scarce: the board lost ~110px of height to a row that had 500px of
       empty space beside it, and the map sat narrow in the middle of a wide card with
       dead ground either side. That is what "the map is a quarter of the page" is.
       Beside it, the bar costs the board nothing and the board takes the whole column.
       Below 1100px there is no room for a second column and the bar goes back on top. */
    '@media (min-width: 1100px){' +
      /* THE BOARD'S COLUMN IS SIZED HERE, NOT BY THE BOARD. An `auto` column sizes to
         its content while the stage sizes itself from `100%` of that column, which is
         circular: the pair collapsed to 609px and the map got SMALLER than it had been
         stacked. The column is the dial now and the stage simply fills it. */
      '.sab-wrap{display:grid;' +
        'grid-template-columns:min(64vw,calc(96vh*10/11)) minmax(240px,1fr);' +
        'column-gap:12px;align-content:start;grid-auto-rows:min-content}' +
      '.sab-wrap>.sab-stage{grid-column:1;grid-row:1;align-self:start;width:100%}' +
      '.sab-side{display:flex;flex-direction:column;gap:8px;grid-column:2;grid-row:1;' +
        'align-self:start;position:sticky;top:138px}' +
      '.sab-realm{display:flex}' +

      '.sab-wrap>.sab-tray,.sab-wrap>#sab-cityhost{grid-column:1/-1;grid-row:1}' +
      /* a column, not a strip: it may wrap now, and the turn button is the widest thing */
      '.sab-bar{flex-wrap:wrap;row-gap:8px}' +
      '.sab-bar .sab-gap{display:none}' +
      '.sab-globals{flex-wrap:wrap}' +
      '.sab-stage{width:100%}' +
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
    /* A LOCKED THING IS SHOWN, NOT HIDDEN. Greyed, with the research that
       would open it in place of the price, so the shop is where a child finds
       out what the plough is FOR. */
    '.sab-tile.locked{opacity:.55;cursor:default;border-style:dashed}',
    '.sab-tile.locked .art img{filter:grayscale(1)}',
    '.sab-tile .c.lock{color:#d8c9a8;font-weight:700;max-width:70px;overflow:hidden;',
    '  text-overflow:ellipsis;white-space:nowrap}',
    /* people are counted, not bought: the tile carries the same two buttons
       the corner chips do, sized for a thumb like everything else here */
    '.sab-ptile{flex:0 0 78px}',
    '.sab-ptile .pmrow{display:flex;gap:4px;margin-top:1px}',
    '.sab-ptile .pm{min-width:26px;min-height:22px;border-radius:7px;',
    '  border:1px solid rgba(255,255,255,.34);background:rgba(255,255,255,.08);',
    '  color:#f6efe1;font:800 12px/1 var(--body);cursor:pointer;padding:0}',
    '.sab-ptile .pm:disabled{opacity:.35;cursor:default}',
    '.sab-ptile .pm:hover:not(:disabled){border-color:var(--accent2)}',
    /* the card a building opens */
    '.sab-pcart{display:block;margin:6px auto 2px;max-width:120px;max-height:96px;object-fit:contain}',
    '.sab-pgive{font:800 14px/1.3 var(--body);color:#7fd6a8;margin:4px 0 2px}',
    '.sab-pgive span{font:600 11px/1 var(--body);color:var(--muted)}',
    '.sab-pcrews{margin-top:8px;border-top:1px solid var(--line);padding-top:6px;text-align:left}',
    '.sab-pcrew{display:flex;align-items:center;gap:8px;padding:4px 0}',
    '.sab-pcrew img{width:30px;height:30px;object-fit:contain;flex:0 0 30px}',
    '.sab-pcrew>span{flex:1 1 auto;min-width:0}',
    '.sab-pcrew b{display:block;font:800 12px/1.2 var(--body)}',
    '.sab-pcrew i{display:block;font:400 10.5px/1.3 var(--body);color:var(--muted);font-style:normal}',
    '.sab-pcrew .pmrow{flex:0 0 auto;display:flex;align-items:center;gap:5px}',
    '.sab-pcrew .pmrow em{font:800 13px/1 var(--body);font-style:normal;min-width:14px;text-align:center}',
    '.sab-pcrew .pm{min-width:30px;min-height:30px;border-radius:8px;',
    '  border:1px solid var(--line);background:transparent;color:inherit;',
    '  font:800 15px/1 var(--body);cursor:pointer;padding:0}',
    '.sab-pcrew .pm:disabled{opacity:.35;cursor:default}',
    /* the crew, standing on the board where they work. Anchored at the south
       corner of the cell, so the sprite is nudged up by its own height and
       half a tile left to sit ON the diamond rather than beside it. */
    '.sab-kcrowd{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}',
    '.sab-kworker{position:absolute;width:38px;height:48px;object-fit:contain;',
    '  object-position:50% 100%;transform:translate(-50%,-100%);',
    '  filter:drop-shadow(0 2px 2px rgba(24,16,34,.45))}',
    '.sab-tile.poor{opacity:.5}',
    '.sab-tile:disabled{opacity:.35;cursor:default}',
    '@media (max-width:560px){.sab-tile{flex:0 0 68px}}',
    /* The built board gets a WINDOW, not the whole page. Bounded height means
       the board scrolls inside it, the build handle at its bottom edge is
       always reachable, and the city never pushes everything else off screen. */
    /* THE BUILT CITY IS THE WHOLE SCREEN.
       It used to be a panel with a page under it: the board at the top and the
       master builder's question somewhere below the fold, so the city was a
       thing you scrolled past to reach its own questions. Nothing hangs under
       it now — the tellings and the works are tabs, the questions are the
       bell — so it takes the window, and the window does not scroll. */
    '.sab-scene.iskit.full{position:fixed;top:0;right:0;bottom:0;left:0;z-index:70;margin:0;border:0;',
    '  border-radius:0;height:100vh;height:100dvh;max-height:none;background:#e6dbc2}',
    '.sab-scene.iskit.full .sab-view{height:100%}',
    'body.sab-full{overflow:hidden}',
    /* A FIXED ELEMENT IS ONLY AS HIGH AS THE CONTEXT IT IS TRAPPED IN.
       #gamehost carries z-index:1, so the city's own z-index:70 was being
       compared against its siblings INSIDE gamehost and capped at 1 — and the
       sticky topbar, at 40 in the context above, painted straight over a city
       that was supposed to be the whole screen. Dropping gamehost's index
       while a city is open lets the city compete with the bar directly. It is
       put back the moment the city closes. */
    'body.sab-full #gamehost{z-index:auto}',
    /* the wrapper's own padding is all that is left under a full city */
    'body.sab-full .sab-city{padding:0}',
    /* a way out that does not depend on knowing about Escape */
    '.sab-leave{position:absolute;left:8px;top:8px;z-index:9;display:flex;align-items:center;gap:6px;',
    '  min-height:36px;padding:0 12px;border-radius:11px;cursor:pointer;font:800 12px/1 var(--body);',
    '  border:1px solid rgba(255,255,255,.35);background:rgba(24,16,34,.72);color:#f6efe1}',
    '.sab-leave:hover{border-color:var(--accent2)}',
    '.sab-leave:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    /* THE BELL — how many things in this city want a decision */
    '.sab-bell{position:absolute;left:8px;top:52px;z-index:9;min-width:36px;min-height:36px;',
    '  border-radius:11px;cursor:pointer;font:800 16px/1 var(--body);',
    '  border:1px solid rgba(255,255,255,.35);background:rgba(24,16,34,.72);color:#f6efe1}',
    '.sab-bell:hover{border-color:var(--accent2)}',
    '.sab-bell:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.sab-bell.hot{border-color:var(--accent);box-shadow:0 0 0 2px rgba(230,160,60,.35)}',
    '.sab-bell u{text-decoration:none;position:absolute;right:-5px;top:-5px;background:var(--accent);',
    '  color:#2a1a10;border-radius:7px;padding:1px 4px;font:800 9px/1.3 var(--body)}',
    /* NO BACKDROP FILTER, NO SCROLL BOX. Both were decoration, and both are
       ways an overlay can stop taking taps on an engine I cannot test here —
       a blurred backdrop inside a position:fixed ancestor has a long history
       of eating pointer events in WebKit. The background is nearly opaque
       anyway, and six rows fit the shortest screen without scrolling. */
    '.sab-calllist{position:absolute;left:8px;top:94px;z-index:12;width:min(278px,72vw);',
    '  display:flex;flex-direction:column;gap:4px;padding:7px;border-radius:13px;',
    '  border:1px solid rgba(255,255,255,.28);background:#241429}',
    '.sab-callhead{font:800 9.5px/1 var(--body);letter-spacing:.09em;text-transform:uppercase;',
    '  color:var(--accent2);padding:3px 6px 5px}',
    /* A ROW IS A DOOR AND HAS TO LOOK LIKE ONE: an icon, what pressing it
       does, a line saying why, and a chevron. The first version was a bare
       phrase on a dark strip, which reads as a caption — something to be told,
       not something to press. */
    '.sab-callrow{display:flex;align-items:center;gap:9px;min-height:46px;padding:5px 9px;',
    '  border-radius:10px;cursor:pointer;text-align:left;color:#f6efe1;font:inherit;',
    '  border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07)}',
    '.sab-callrow:hover{border-color:var(--accent2);background:rgba(255,255,255,.12)}',
    '.sab-callrow:active{transform:translateY(1px)}',
    '.sab-callrow:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.sab-callrow .ic{flex:0 0 auto;display:flex;opacity:.9}',
    '.sab-callrow .tx{flex:1 1 auto;min-width:0}',
    '.sab-callrow b{display:block;font:700 12.5px/1.25 var(--body);',
    '  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sab-callrow i{display:block;font:400 10px/1.3 var(--body);font-style:normal;opacity:.68;',
    '  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sab-callrow em{flex:0 0 auto;font-style:normal;color:var(--accent);font-size:11px}',
    '.sab-callrow .go{flex:0 0 auto;font:700 17px/1 var(--body);opacity:.5}',
    '.sab-callrow.hot{background:rgba(230,160,60,.18);border-color:rgba(230,160,60,.5)}',
    /* the card, in the panel's own place */
    '.sab-calllist.iscard{width:min(340px,86vw);max-height:calc(100% - 118px);overflow:auto;',
    '  -webkit-overflow-scrolling:touch}',
    '.sab-callback{align-self:flex-start;min-height:34px;padding:0 10px;border-radius:9px;',
    '  border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:#f6efe1;',
    '  font:700 11px/1 var(--body);cursor:pointer;margin-bottom:2px}',
    '.sab-callback:hover{border-color:var(--accent2)}',
    '.sab-cardtitle{margin:2px 4px 4px;font:800 15px/1.25 var(--display,Georgia,serif);color:#f6efe1}',
    '.sab-cardbody{padding:0 4px 4px;color:#f6efe1;font-size:12.5px;line-height:1.5}',
    '.sab-cardbody p{margin:6px 0}',
    '.sab-cardbody .sab-btn{margin:4px 0}',
    '.sab-cardbody .sab-cfact{background:rgba(255,255,255,.06);border-radius:9px;padding:7px 9px;',
    '  margin:6px 0;font-size:12px;line-height:1.5}',
    '.sab-cardbody img{max-width:100%;border-radius:9px}',
    '.sab-cardbody .mch{display:inline-block;margin:2px 3px 2px 0;padding:3px 7px;border-radius:8px;',
    '  background:rgba(255,255,255,.08);font:700 10.5px/1.3 var(--body)}',
    '.sab-cardbody .sab-treshint{background:rgba(230,160,60,.14);border-radius:9px;padding:7px 9px;',
    '  margin:6px 0;font-size:11.5px;font-style:italic}',
    '.sab-scene.iskit{overflow:hidden;position:relative;',
    '  height:min(66vh,620px);min-height:340px;touch-action:none}',
    '@media (max-width:560px){.sab-scene.iskit{height:min(60vh,480px)}}',
    '.sab-view{position:absolute;top:0;right:0;bottom:0;left:0;overflow:auto;-webkit-overflow-scrolling:touch;',
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
    /* on a phone the left edge is the leave button, the bell and the list it
       opens, so the city's name goes to the other side */
    '  .sab-scene.tight .sab-nameplate{left:auto;right:8px;top:8px;bottom:auto;transform:none;',
    '    max-width:56vw;text-align:right;padding:4px 10px}',
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
    /* the layer that holds whatever is placed by board percentage: sized to
       the board, so it moves and grows with it, but NOT inside the scaled
       box, so a label does not shrink to nothing at 60% */
    '.sab-kitpins{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}',
    '.sab-kitpins>*{pointer-events:auto}',
    '.sab-kitpins .sab-plots{pointer-events:none}',
    /* the plate's crop rules are for a painting; the board sets its own height
       from the grid, and a max-height cuts the south half of the city off */
    '.sab-scene.iskit .sab-hero{aspect-ratio:auto;max-height:none}',
    '.sab-scene.iskit{background:#e6dbc2}',
    '.kit-f{position:absolute;display:block;pointer-events:none;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}',
    '.kit-g{position:absolute;transform:translate(-50%,-100%);pointer-events:none}',
    '.kit-p{position:absolute;transform:translate(-50%,-100%);pointer-events:none}',
    '.kit-shadow{position:absolute;transform:translate(-50%,-50%);border-radius:50%;background:rgba(20,12,26,.26);pointer-events:none;filter:blur(1.5px)}',
    '.sab-scene .sab-hero{margin:0;border:0;border-radius:0}',
    '.sab-praja{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}',
    /* A WALKER PINNED TO A ROAD. The keyframes carry left/top along the
       plate's own traced street, so the sprite's feet land on the road. */
    '.sab-walker.onroad,.sab-stand.onroad,.sab-cross.onroad{bottom:auto;transform:translate(-50%,-100%)}',
    '.sab-walker.onroad,.sab-cross.onroad{left:auto}',
    /* the green places breathe under the paint — a soft leaf wash, never a
       shape a child must read, just the land looking alive */
    '.sab-greens{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;' +
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
    /* THE CITY'S TWO WARNINGS, IN THE MIST'S REGISTER AND NOT AN ALARM'S.
       Pass C took alarm red off the notification rail and left these two behind,
       which a screenshot of the city caught: the gate banner and this chip were the
       same red as Agla Saal, so on one screen red meant both `worry about this` and
       `press this` -- the exact fault pass C existed to fix, on a surface its check
       did not look at. The check reads every warning surface now, not one.
       The pulse went with it. docs/16 §3: no combat, no lives, no shaming, and a
       fading site is SAD, NOT SCARY. A throbbing red chip is an alarm in costume,
       and a boar in the wheat is not an emergency.
       Grey with weight behind it says `this wants you`. Green still means the gate
       holds, which is not an alarm but its opposite, so it stays. */
    '.sab-raksha{display:flex;flex-direction:column;align-items:flex-start;gap:1px;border:0;cursor:pointer;' +
      'padding:5px 12px;border-radius:12px;color:#fff;text-align:left;' +
      'background:rgba(74,70,88,.94)}',
    '.sab-raksha.ready{background:rgba(24,110,66,.94);animation:none}',
    '.sab-raksha b{font:800 12.5px/1.15 var(--body);white-space:nowrap}',
    '.sab-raksha span{font:700 10px/1.15 var(--body);opacity:.92;white-space:nowrap}',
    '.sab-raksha{min-height:34px;padding:0 10px}',
    /* display:flex on the class outranks the browser's own [hidden] rule, so
       the empty alarm chip sat in the bar for ever. Same trap as the gully
       game covers; same one-line answer. */
    '.sab-raksha[hidden]{display:none}',
    '.sab-alarm{position:absolute;left:50%;top:8px;transform:translateX(-50%);z-index:7;pointer-events:none;' +
      'display:grid;justify-items:center;gap:1px;padding:6px 14px;border-radius:12px;text-align:center;' +
      'background:rgba(74,70,88,.94);color:#fff;box-shadow:0 4px 14px rgba(30,24,44,.38);max-width:88%}',
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
    '.sab-projbar i{position:absolute;top:0;right:0;bottom:0;left:0;width:var(--pc,0%);background:var(--accent2);' +
      'border-radius:99px;transition:width .6s linear}',
    '.sab-projbar b{position:absolute;right:-30px;top:-3px;font:800 10.5px var(--body);color:var(--accent)}',
    '.sab-scaffold{position:absolute;left:50%;bottom:16%;height:52%;width:auto;transform:translateX(-50%);' +
      'pointer-events:none;filter:drop-shadow(0 4px 10px rgba(0,0,0,.35))}',
    /* THE BUILD PLOTS — Civ\'s own move, made native: tap a plot on the city
       painting and the building rises there, permanently. Unbuilt plots are
       ghost outlines with the cost; built ones stand in colour with a name
       chip. Real buttons in DOM order — keyboard and touch both, >=44px. */
    '.sab-plots{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}',
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

    /* ==================================================================
       THE GAME WINDOW — the map is the screen, and the controls sit on it
       ==================================================================
       On a landscape screen the map used to be a portrait box under the app's
       header, its bottom below the fold, beside a column of cream holding a few
       lines. "So much space wasted; the map should be front and centre" — and the
       references were Civ 6 and Age of Empires, and this game's own city view,
       which already took the whole window. Now the map does too.

       ONE MATERIAL, NOT SIX KINDS OF PILL. The first cut floated a dozen dark
       rounded boxes of different heights, radii and greys, and the verdict was
       fair: better layout, badly designed parts. Every control here is now made
       of the same two things — lacquered teak and a brass edge — at one control
       height (44), two radii (12 controls, 16 panels), one type ramp, and line
       icons instead of emoji. Red is still only "press this" (Agla Saal, a
       primary verb); brass is structure; green and amber are numbers going up and
       things waiting.

         top      a full-width beam: the way out, the age and the turn, the
                  stores with what each makes a turn, the three books, the
                  ages, the menu — Civ's top bar, in one row
         left     YOUR REALM, a row a place; at the bottom, the place you chose,
                  with its verbs as equal tiles (Civ's unit panel)
         right    MITHU's one suggestion, the alerts stacked above the turn, and
                  Agla Saal as a big brass-rimmed disc where End Turn lives
         middle   India, fitted to the ground BETWEEN the columns, so at the
                  opening view a panel lies over sea or mist, never the country

       Below 900px wide, or on a portrait screen, none of this applies and the
       page layout above is unchanged — the phone is a separate decision. */
    'body.sab-mapfull{overflow:hidden}',
    'body.sab-mapfull #gamehost{z-index:auto}',
    '.sab-wrap{--teak:linear-gradient(180deg,rgba(58,37,26,.95),rgba(38,24,17,.95));--teak-flat:rgba(44,28,20,.94);' +
      '--brass:#d4a650;--brass-soft:rgba(212,166,80,.42);--brass-faint:rgba(212,166,80,.18);' +
      '--hud-tx:#f8f0e1;--hud-mute:rgba(248,240,225,.64);--hud-up:#a9df9e;--hud-down:#f0b49a;' +
      '--hud-lift:inset 0 1px 0 rgba(255,255,255,.07),0 8px 22px rgba(18,9,4,.34)}',
    /* THE CITY WEARS IT TOO. The city view was the first full-window screen in this
       game and its controls were grey glass — the map's teak and brass beside them
       would make two games. Every control on the city's own frame now takes the same
       material, on every screen size, because the city is full-window on a phone too. */
    '.sab-scene.iskit .sab-leave,.sab-scene.iskit .sab-bell,.sab-scene.iskit .sab-dhandle,' +
      '.sab-scene.iskit .sab-grow,.sab-scene.iskit .sab-kitbar button,.sab-scene.iskit .sab-kitbar .z,' +
      '.sab-scene.iskit .sab-calllist{background:var(--teak);border:1px solid var(--brass-soft);color:var(--hud-tx);' +
      'box-shadow:var(--hud-lift);backdrop-filter:none}',
    '.sab-scene.iskit .sab-leave:hover,.sab-scene.iskit .sab-bell:hover,.sab-scene.iskit .sab-dhandle:hover,' +
      '.sab-scene.iskit .sab-kitbar button:hover{border-color:var(--brass)}',
    '.sab-scene.iskit .sab-grow.can{background:linear-gradient(180deg,#d4552f,#a8341c);border-color:#ecc977;color:#fff}',
    '.sab-scene.iskit .sab-grow em{color:#f3d48c}',
    '.sab-scene.iskit .sab-grow.can em{color:#ffe2a0}',
    '.sab-scene.iskit .sab-nameplate{background:var(--teak);border:1px solid var(--brass-soft);color:var(--hud-tx);' +
      'box-shadow:var(--hud-lift)}',
    '.sab-scene.iskit .sab-nameplate span{color:var(--hud-mute);opacity:1}',
    '.sab-scene.iskit .sab-cityturn{background:var(--teak);border:1px solid var(--brass-soft);box-shadow:var(--hud-lift)}',
    '.sab-scene.iskit .sab-cityturn .sab-chip{color:var(--hud-tx)}',
    '.sab-scene.iskit .sab-cityturn .sab-chip small{color:var(--hud-up)}',
    '.sab-scene.iskit .sab-cityturn .sab-act.go{border:2px solid #ecc977}',
    '.sab-wrap.gw{position:fixed;top:0;right:0;bottom:0;left:0;z-index:70;display:block;min-height:0;margin:0;' +
      'background:var(--ground2);' +
      '--teak:linear-gradient(180deg,rgba(58,37,26,.95),rgba(38,24,17,.95));--teak-flat:rgba(44,28,20,.94);' +
      '--brass:#d4a650;--brass-soft:rgba(212,166,80,.42);--brass-faint:rgba(212,166,80,.18);' +
      '--hud-tx:#f8f0e1;--hud-mute:rgba(248,240,225,.64);--hud-up:#a9df9e;--hud-down:#f0b49a;' +
      '--hud-lift:inset 0 1px 0 rgba(255,255,255,.07),0 8px 22px rgba(18,9,4,.34)}',
    '.sab-wrap.gw>.sab-stage{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;min-height:0;max-height:none;' +
      'aspect-ratio:auto;margin:0;border:0;border-radius:0}',
    '.sab-wrap.gw .sab-side{display:contents}',
    /* the shared material */
    '.sab-wrap.gw .sab-panel,.sab-wrap.gw .sab-realm,.sab-wrap.gw .sab-coach,.sab-wrap.gw .sab-tray,' +
      '.sab-wrap.gw .sab-railrow,.sab-wrap.gw .sab-zoom,.sab-wrap.gw .sab-feed,.sab-wrap.gw .sab-more{' +
      'background:var(--teak);border:1px solid var(--brass-soft);border-radius:16px;color:var(--hud-tx);' +
      'box-shadow:var(--hud-lift)}',
    '.sab-wrap.gw .sab-cap{display:block;font:800 10px/1 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--brass)}',
    /* ---- THE TOP BEAM ---- */
    '.sab-wrap.gw .sab-bar{position:absolute;top:0;left:0;right:0;height:56px;z-index:6;display:flex;' +
      'align-items:center;gap:6px;flex-wrap:nowrap;padding:0 10px;background:var(--teak);border:0;' +
      'border-bottom:1px solid var(--brass-soft);border-radius:0;color:var(--hud-tx);' +
      'box-shadow:inset 0 -3px 0 rgba(0,0,0,.18),0 6px 18px rgba(18,9,4,.28)}',
    '.sab-wrap.gw .sab-bar>*{flex:0 0 auto}',
    /* hairline brass dividers between the beam's groups */
    '.sab-wrap.gw .sab-exit,.sab-wrap.gw .sab-era+.sab-era,.sab-wrap.gw #sab-res{position:relative;margin-right:8px}',
    '.sab-wrap.gw .sab-exit::after,.sab-wrap.gw .sab-era+.sab-era::after,.sab-wrap.gw #sab-res::after{content:"";' +
      'position:absolute;right:-8px;top:10px;bottom:10px;width:1px;background:var(--brass-faint)}',
    '.sab-exit,.sab-tabs{display:none}',
    '.sab-wrap.gw .sab-exit{display:flex;align-items:center;gap:5px;height:40px;padding:0 12px 0 8px;border-radius:12px;' +
      'border:1px solid transparent;background:none;color:var(--hud-tx);font:800 13px/1 var(--body);cursor:pointer}',
    '.sab-wrap.gw .sab-exit:hover{border-color:var(--brass-soft);background:rgba(255,255,255,.05)}',
    '.sab-wrap.gw .sab-era{display:flex;flex-direction:column;justify-content:center;gap:3px;padding:0 6px;height:56px}',
    '.sab-wrap.gw .sab-era b{font:800 16px/1 var(--display,Georgia,serif);color:var(--hud-tx)}',
    '.sab-wrap.gw .sab-era span{font:700 10px/1 var(--body);letter-spacing:.12em;color:var(--brass)}',
    '.sab-wrap.gw .sab-era+.sab-era{align-items:center;padding:0 8px}',
    '.sab-wrap.gw .sab-era+.sab-era b{font:800 18px/1 var(--body);font-variant-numeric:tabular-nums}',
    /* the stores: a brass coin for each, the number, and what it makes a turn */
    '.sab-wrap.gw #sab-res{display:flex;align-items:center;gap:4px;flex:0 1 auto;flex-wrap:nowrap;min-width:0;overflow:hidden;' +
      'background:none;border:0;padding:0}',
    '.sab-wrap.gw #sab-res .sab-chip{gap:7px;height:40px;padding:0 10px 0 4px;background:none;color:var(--hud-tx);' +
      'font:800 15px/1 var(--body);font-variant-numeric:tabular-nums;border-radius:12px}',
    '.sab-wrap.gw #sab-res .sab-chip small{font:700 11px/1 var(--body);color:var(--hud-up)}',
    '.sab-wrap.gw #sab-res .sab-chip small.neg{color:var(--hud-down)}',
    '.sab-wrap.gw #sab-res .sab-chip small.cap{color:var(--hud-mute)}',
    '.sab-wrap.gw #sab-res .sab-chip[data-sab-act]{cursor:pointer;min-height:40px}',
    '.sab-wrap.gw #sab-res .sab-chip[data-sab-act]:hover{background:rgba(255,255,255,.05)}',
    '.sab-wrap.gw #sab-res .sab-restless small{color:var(--brass)}',
    '.sab-ri{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;flex:none;font-style:normal}',
    '.sab-wrap.gw .sab-ri{width:28px;height:28px}',
    '.sab-wrap.gw .sab-ri{background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.18),rgba(255,255,255,0) 60%),#5a3a24;' +
      'border:1.5px solid var(--brass);color:#f3d48c}',
    '.sab-wrap.gw .sab-gap{display:block;flex:1 1 auto}',
    /* the three books */
    '.sab-wrap.gw .sab-tabs{display:flex;gap:2px}',
    '.sab-tab{display:flex;align-items:center;gap:7px;height:40px;padding:0 12px;border:1px solid transparent;border-radius:12px;' +
      'background:none;color:var(--hud-tx);font:800 13px/1 var(--body);cursor:pointer;white-space:nowrap}',
    '.sab-tab svg{color:var(--brass)}',
    '.sab-tab:hover{border-color:var(--brass-soft);background:rgba(255,255,255,.05)}',
    '.sab-tab[aria-pressed="true"]{border-color:var(--brass);background:rgba(212,166,80,.16)}',
    '.sab-tab:focus-visible,.sab-exit:focus-visible{outline:3px solid var(--accent);outline-offset:2px}',
    '.sab-wrap.gw .sab-globals{flex:0 0 auto;flex-wrap:nowrap;margin-left:4px;gap:4px;align-items:center}',
    '.sab-wrap.gw .sab-ages{height:40px;min-height:0;padding:0 10px;border-radius:12px;background:none;border:1px solid transparent}',
    '.sab-wrap.gw .sab-ages:hover{border-color:var(--brass-soft)}',
    '.sab-wrap.gw .sab-ages i{width:8px;height:8px;background:rgba(255,255,255,.18)}',
    '.sab-wrap.gw .sab-ages i.g{background:var(--brass)}',
    '.sab-wrap.gw .sab-ages i.q{background:rgba(255,255,255,.5)}',
    '.sab-wrap.gw .sab-ages i.now{background:#fff;box-shadow:0 0 0 2px var(--accent)}',
    '.sab-wrap.gw #sab-menu{width:40px;height:40px;min-height:0;border-radius:12px;background:none;' +
      'border:1px solid var(--brass-soft);color:var(--hud-tx);box-shadow:none}',
    '.sab-wrap.gw #sab-menu:hover,.sab-wrap.gw #sab-menu[aria-expanded="true"]{background:rgba(212,166,80,.16)}',
    '.sab-wrap.gw .sab-more{position:absolute;top:60px;right:10px;width:max-content;max-width:440px;padding:8px;' +
      'justify-content:flex-end;z-index:9}',
    '.sab-wrap.gw .sab-more .sab-act,.sab-wrap.gw .sab-more .sab-speed{background:rgba(255,255,255,.06);' +
      'color:var(--hud-tx);border:1px solid var(--brass-faint);box-shadow:none}',
    /* ONE ROW, ALWAYS. What gives way first is what is also somewhere else: the ages
       ribbon (it is The ages, under the menu), then the books' labels (the icons
       stay), then the per-turn small print. */
    '@media (max-width:1299px){.sab-wrap.gw .sab-ages{display:none}}',
    '@media (max-width:1180px){.sab-wrap.gw .sab-tab span{display:none}.sab-wrap.gw .sab-tab{padding:0 10px}' +
      '.sab-wrap.gw .sab-exit span{display:none}}',
    '@media (max-width:1040px){.sab-wrap.gw #sab-res .sab-chip small{display:none}' +
      '.sab-wrap.gw .sab-era span{display:none}}',
    /* ---- AGLA SAAL: where End Turn lives, and as big ---- */
    '.sab-wrap.gw #sab-turn{position:fixed;right:20px;bottom:20px;z-index:8;width:128px;height:128px;' +
      'min-height:0;padding:0;border-radius:50%;justify-content:center;' +
      'background:radial-gradient(circle at 38% 30%,#e0683f,#b8391f 58%,#8f2a15) #b8391f;color:#fff;' +
      'border:3px solid #ecc977;' +
      'box-shadow:0 0 0 5px rgba(38,24,17,.92),0 0 0 6px var(--brass-soft),0 14px 34px rgba(18,9,4,.45),' +
      'inset 0 2px 0 rgba(255,255,255,.25),inset 0 -6px 14px rgba(0,0,0,.22)}',
    '.sab-wrap.gw #sab-turn:hover{transform:translateY(-2px);filter:brightness(1.05)}',
    '.sab-wrap.gw #sab-turn:disabled{filter:grayscale(.6);opacity:.6;transform:none}',
    '.sab-wrap.gw #sab-turn .lbl{align-items:center;text-align:center;gap:5px;font:900 18px/1.05 var(--display,Georgia,serif);' +
      'text-shadow:0 1px 2px rgba(0,0,0,.25)}',
    '.sab-wrap.gw #sab-turn .lbl em{display:block;padding:3px 8px;border-radius:999px;background:rgba(38,24,17,.55);' +
      'font:800 11px/1.1 var(--body);color:#fbe6b5;text-shadow:none}',
    '.sab-wrap.gw #sab-next{position:fixed;right:166px;bottom:34px;z-index:8;width:54px;min-height:54px;height:54px;' +
      'border-radius:50%;background:var(--teak);border:2px solid var(--brass);color:var(--hud-tx);box-shadow:var(--hud-lift)}',
    '.sab-wrap.gw #sab-next:disabled{opacity:.42}',
    '.sab-wrap.gw #sab-adv{position:fixed;right:20px;bottom:168px;z-index:8;width:128px;justify-content:center;' +
      'border:2px solid #ecc977}',
    /* zoom: in the board's corner on the page layout; beside the turn in the game window */
    '.sab-zoom{position:absolute;right:10px;bottom:10px;display:flex;gap:6px;z-index:3}',
    '.sab-wrap.gw .sab-zoom{position:absolute;right:232px;bottom:34px;z-index:6;display:flex;gap:0;padding:0;overflow:hidden;' +
      'border-radius:14px}',
    '.sab-wrap.gw .sab-zoom .sab-btn{width:46px;min-height:52px;padding:0;border:0;border-radius:0;background:none;' +
      'color:var(--hud-tx);display:grid;place-items:center}',
    '.sab-wrap.gw .sab-zoom .sab-btn+.sab-btn{border-left:1px solid var(--brass-faint)}',
    '.sab-wrap.gw .sab-zoom .sab-btn:hover{background:rgba(255,255,255,.07)}',
    /* ---- RIGHT: Mithu, then the alerts ---- */
    '.sab-coach{display:contents}',
    '.sab-wrap.gw .sab-coach{position:absolute;top:68px;right:10px;width:var(--gw-w,280px);z-index:5;' +
      'display:flex;flex-direction:column;gap:0;padding:12px 12px 10px}',
    '.sab-wrap.gw .sab-coach::before{content:"Mithu says";display:block;margin:0 2px 8px;' +
      'font:800 10px/1 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--brass)}',
    '.sab-wrap.gw .sab-advise .sab-btn{display:none}',
    '.sab-wrap.gw .sab-advisebtn{width:100%;min-height:0;padding:8px 10px;border-radius:12px;gap:9px;' +
      'background:rgba(255,255,255,.06);border:1px solid var(--brass-faint);color:var(--hud-tx);box-shadow:none}',
    '.sab-wrap.gw .sab-advisebtn:hover{border-color:var(--brass)}',
    '.sab-wrap.gw .sab-advisebtn span{font:700 13px/1.4 var(--body)}',
    '.sab-wrap.gw .sab-advisebtn em{color:var(--brass);font-size:12px}',
    '.sab-wrap.gw .sab-guide{margin:9px 2px 0;padding:9px 0 0;border:0;border-top:1px solid var(--brass-faint);' +
      'border-radius:0;background:none;box-shadow:none;color:var(--hud-mute);font:600 12.5px/1.45 var(--body)}',
    '.sab-wrap.gw .sab-guide b{color:#f3d48c}',
    '.sab-wrap.gw .sab-rail{position:absolute;right:10px;bottom:170px;width:var(--gw-w,280px);z-index:5;gap:6px;' +
      'justify-content:flex-end}',
    '.sab-wrap.gw .sab-railrow{display:flex;align-items:stretch;gap:0;overflow:hidden;border-radius:14px;padding:0}',
    '.sab-wrap.gw .sab-railrow .sab-railgo{flex:1;min-height:46px;padding:8px 12px;border:0;border-left:4px solid var(--brass-soft);' +
      'border-radius:0;background:none;color:var(--hud-tx);box-shadow:none;font:700 12.5px/1.35 var(--body)}',
    '.sab-wrap.gw .sab-railrow .sab-railx{width:40px;min-height:46px;border:0;border-left:1px solid var(--brass-faint);' +
      'border-radius:0;background:none;color:var(--hud-mute);box-shadow:none}',
    '.sab-wrap.gw .sab-railrow .sab-railgo:hover,.sab-wrap.gw .sab-railrow .sab-railx:hover{background:rgba(255,255,255,.06)}',
    /* worry is the mist's own grey-violet with weight, never red (COLOUR MEANS ONE THING) */
    '.sab-wrap.gw .sab-railrow.p0{background:#4a4262}',
    '.sab-wrap.gw .sab-railrow.p0 .sab-railgo{background:#4a4262;border-left-color:#cfc6e6;font-weight:800}',
    '.sab-wrap.gw .sab-railrow.p1 .sab-railgo{border-left-color:var(--brass)}',
    /* the news line: top centre, between the columns, gone when there is none */
    '.sab-wrap.gw .sab-strip{position:absolute;top:68px;left:50%;transform:translateX(-50%);z-index:5;' +
      'max-width:min(560px,calc(100% - 2 * var(--gw-p,300px) - 20px));pointer-events:none}',
    '.sab-wrap.gw .sab-feed{padding:10px 18px;border-radius:999px;font:700 13px/1.3 var(--body);color:var(--hud-tx)}',
    '.sab-wrap.gw .sab-feed.warm{color:var(--hud-up)}',
    '.sab-wrap.gw .sab-feed.mist{color:#f3d48c}',
    /* ---- LEFT: your realm ---- */
    '.sab-wrap.gw .sab-realm{position:absolute;top:68px;left:10px;width:var(--gw-w,280px);z-index:5;gap:4px;' +
      'max-height:calc(100% - 68px - 200px);overflow:auto;padding:12px 10px 10px;scrollbar-width:thin;' +
      'scrollbar-color:var(--brass-soft) transparent}',
    '.sab-wrap.gw .sab-realmhd{margin:0 4px 6px;color:var(--brass);font:800 10px/1 var(--body);letter-spacing:.16em}',
    '.sab-wrap.gw .sab-realmrow{min-height:42px;padding:8px 10px;border-radius:11px;background:rgba(255,255,255,.05);' +
      'border:1px solid transparent;box-shadow:none}',
    '.sab-wrap.gw .sab-realmrow:hover{border-color:var(--brass-soft);background:rgba(255,255,255,.08)}',
    '.sab-wrap.gw .sab-realmrow b{color:var(--hud-tx);font:800 13px/1.3 var(--body)}',
    '.sab-wrap.gw .sab-realmrow i{color:var(--hud-mute)}',
    '.sab-wrap.gw .sab-realmrow s{color:var(--hud-mute)}',
    '.sab-wrap.gw .sab-realmrow.idle s{color:#f3c56c}',
    '.sab-wrap.gw .sab-realmasleep{margin:6px 4px 0;color:var(--hud-mute);font:600 11.5px/1.4 var(--body)}',
    /* ---- THE CHOSEN PLACE: Civ's unit panel. Its verbs are equal tiles, each an
       icon in a brass ring with its name and its price — one shape, so the eye
       compares the choices rather than the buttons. ---- */
    '.sab-wrap.gw .sab-tray{position:absolute;left:10px;bottom:10px;z-index:6;flex-wrap:nowrap;align-items:stretch;gap:6px;' +
      'max-width:calc(100% - 20px - 360px);padding:10px 10px 10px 14px;border-left:4px solid var(--brass)}',
    '.sab-wrap.gw .sab-tray .sab-who{min-width:150px;max-width:210px;padding:2px 12px 2px 0;margin-right:4px;' +
      'border-right:1px solid var(--brass-faint);justify-content:center;gap:4px}',
    '.sab-wrap.gw .sab-tray .sab-who b{color:var(--hud-tx);font:800 19px/1.1 var(--display,Georgia,serif)}',
    '.sab-wrap.gw .sab-tray .sab-who span{color:var(--hud-mute);font:600 11.5px/1.4 var(--body);letter-spacing:0}',
    '.sab-wrap.gw .sab-tray .sab-act{flex-direction:column;justify-content:flex-start;gap:5px;width:84px;min-height:84px;' +
      'padding:8px 4px 7px;border-radius:13px;background:rgba(255,255,255,.05);border:1px solid var(--brass-faint);' +
      'color:var(--hud-tx);box-shadow:none;text-align:center}',
    '.sab-wrap.gw .sab-tray .sab-act:hover:not(:disabled){border-color:var(--brass);background:rgba(255,255,255,.09);transform:translateY(-1px)}',
    '.sab-wrap.gw .sab-tray .sab-act .sab-tico{width:38px;height:38px;border-radius:50%;background:#5a3a24;' +
      'border:1.5px solid var(--brass);color:#f3d48c}',
    '.sab-wrap.gw .sab-tray .sab-act .lbl{align-items:center;text-align:center;font:800 12px/1.15 var(--body);gap:2px}',
    '.sab-wrap.gw .sab-tray .sab-act .lbl em{color:var(--hud-mute);font:700 10px/1.2 var(--body);white-space:normal}',
    '.sab-wrap.gw .sab-tray .sab-act.go{background:linear-gradient(180deg,#d4552f,#a8341c);border-color:#ecc977;color:#fff}',
    '.sab-wrap.gw .sab-tray .sab-act.go .sab-tico{background:rgba(255,255,255,.16);border-color:#ffe2a0;color:#fff}',
    '.sab-wrap.gw .sab-tray .sab-act.go .lbl em{color:rgba(255,255,255,.85)}',
    '.sab-wrap.gw .sab-tray .sab-act.sq{position:absolute;top:-12px;right:-12px;width:30px;min-height:30px;height:30px;' +
      'padding:0;border-radius:50%;background:var(--teak-flat);border:1.5px solid var(--brass);font-size:13px}',
    '.sab-wrap.gw .sab-tray .sab-badge{top:-5px;right:-5px}',
    /* a book (Vidya, or a city that is not a full scene) opens under the beam */
    '.sab-wrap.gw #sab-cityhost:not(:empty){position:absolute;top:56px;left:0;right:0;bottom:0;z-index:7;' +
      'overflow:auto;padding:12px 16px 16px;background:var(--ground)}',
    /* and the city scene keeps the whole window, above all of this */
    '.sab-wrap.gw .sab-scene.iskit.full{z-index:70}',

    /* ==================================================================
       THE PHONE. The same window, the same teak and brass, arranged for a thumb.
       ==================================================================
         top      the beam (the way out, the age, the turn, the menu) and under it
                  the four stores; then Mithu's one line and anything live. One
                  column, measured by the map so the country is fitted below it.
         middle   India, edge to edge. Zoom is a brass rail on the right edge.
         bottom   the dock: the three books on the left, Agla Saal on the right —
                  where a right thumb already rests. A chosen place's sheet rises
                  above the dock, OVER the map, never pushing it: the map that
                  moved under the second tap is the bug this layout exists to fix.
       Nothing here is a different game: every button is the desktop's button. */
    '.sab-wrap.gw.gm{--dock:calc(72px + env(safe-area-inset-bottom,0px));--tw:136px}',
    '.sab-wrap.gm::after{content:"";position:absolute;left:0;right:0;bottom:0;height:var(--dock);z-index:5;' +
      'background:var(--teak);border-top:1px solid var(--brass-soft);box-shadow:0 -6px 18px rgba(18,9,4,.28)}',
    /* the top column: beam, stores, Mithu, the rail, the news line */
    '.sab-wrap.gm .sab-side{display:flex;flex-direction:column;align-items:stretch;gap:6px;position:absolute;' +
      'top:0;left:0;right:0;z-index:6;pointer-events:none;padding:0 0 4px}',
    '.sab-wrap.gm .sab-side>*{pointer-events:auto}',
    '.sab-wrap.gm .sab-bar{position:relative;order:0;height:auto;flex-wrap:wrap;column-gap:2px;row-gap:0;' +
      'padding:env(safe-area-inset-top,0px) 6px 0}',
    '.sab-wrap.gm .sab-exit{width:44px;height:44px;padding:0;justify-content:center;margin-right:2px}',
    '.sab-wrap.gm .sab-exit span{display:none}',
    '.sab-wrap.gm .sab-era{height:50px;padding:0 4px;min-width:0}',
    '.sab-wrap.gm .sab-era:first-of-type{flex:0 1 auto}',
    '.sab-wrap.gm .sab-era b{font-size:15.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sab-wrap.gm .sab-era span{display:block;font-size:9.5px;letter-spacing:.08em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sab-wrap.gm .sab-era+.sab-era{padding:0 6px}',
    '.sab-wrap.gm .sab-era+.sab-era b{font-size:17px}',
    '.sab-wrap.gm .sab-ages,.sab-wrap.gm .sab-guide,.sab-wrap.gm .sab-realm{display:none}',
    '.sab-wrap.gm .sab-globals{margin-left:0}',
    '.sab-wrap.gm #sab-menu{width:44px;height:44px}',
    '.sab-wrap.gm #sab-res{order:5;flex:1 0 100%;height:42px;margin:0;justify-content:space-between;overflow:visible;' +
      'border-top:1px solid var(--brass-faint)}',
    '.sab-wrap.gm #sab-res::after{display:none}',
    '.sab-wrap.gm #sab-res .sab-chip{height:40px;min-height:40px;gap:5px;padding:0 6px 0 2px;font-size:14.5px}',
    '.sab-wrap.gm #sab-res .sab-chip small{display:inline;font-size:10.5px}',
    '.sab-wrap.gm #sab-res .sab-chip small.cap{display:none}',
    '.sab-wrap.gm .sab-ri{width:24px;height:24px}',
    '.sab-wrap.gm .sab-more{top:calc(100% + 6px);left:8px;right:8px;width:auto;max-width:none;justify-content:flex-start}',
    '.sab-wrap.gm .sab-more .sab-act,.sab-wrap.gm .sab-more .sab-speed{flex:1 1 calc(50% - 6px);min-height:46px;justify-content:center}',
    /* Mithu: one line of advice, the whole width, and the rail under it */
    '.sab-wrap.gm .sab-coach{order:1;position:relative;top:auto;right:auto;width:auto;margin:0 8px;padding:7px 8px 8px;' +
      'display:flex;border-radius:14px}',
    '.sab-wrap.gm .sab-coach::before{margin:0 2px 5px;font-size:9px}',
    '.sab-wrap.gm .sab-advisebtn{min-height:40px;padding:6px 9px}',
    '.sab-wrap.gm .sab-advisebtn span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px}',
    '.sab-wrap.gm .sab-rail{order:2;position:relative;right:auto;bottom:auto;width:auto;margin:0 8px;gap:4px}',
    '.sab-wrap.gm .sab-rail:empty{display:none}',
    '.sab-wrap.gm .sab-railrow:nth-child(n+3){display:none}',
    '.sab-wrap.gm .sab-railrow .sab-railgo{min-height:42px;padding:7px 10px;font-size:12.5px}',
    '.sab-wrap.gm .sab-railrow .sab-railx{width:44px;min-height:42px}',
    '.sab-wrap.gm .sab-strip{order:3;position:relative;top:auto;left:auto;transform:none;max-width:none;margin:0 8px;' +
      'display:flex;justify-content:center}',
    '.sab-wrap.gm .sab-feed{padding:7px 14px;font-size:12.5px;max-width:100%}',
    /* the dock: the three books, the next thing, Agla Saal */
    '.sab-wrap.gm .sab-tabs{position:fixed;left:4px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:8;gap:0}',
    '.sab-wrap.gm .sab-tab{flex-direction:column;justify-content:center;gap:4px;width:62px;height:56px;padding:0;' +
      'font:800 10.5px/1 var(--body)}',
    '.sab-wrap.gm .sab-tab span{display:block}',
    '.sab-wrap.gm #sab-turn{right:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);width:var(--tw);height:56px;' +
      'border-radius:18px;box-shadow:0 0 0 3px rgba(38,24,17,.92),0 0 0 4px var(--brass-soft),0 10px 24px rgba(18,9,4,.45),' +
      'inset 0 2px 0 rgba(255,255,255,.25),inset 0 -5px 10px rgba(0,0,0,.2)}',
    '.sab-wrap.gm #sab-turn .lbl{font-size:17px;gap:3px}',
    '.sab-wrap.gm #sab-turn .lbl em{padding:2px 7px;font-size:10px}',
    '.sab-wrap.gm #sab-next{right:calc(var(--tw) + 16px);bottom:calc(env(safe-area-inset-bottom,0px) + 12px);' +
      'width:48px;height:48px;min-height:48px}',
    '.sab-wrap.gm #sab-adv{right:auto;left:50%;transform:translateX(-50%);top:auto;' +
      'bottom:calc(var(--dock) + 12px);width:auto;padding:0 20px;min-height:52px;z-index:9}',
    /* zoom: a brass rail on the right edge, clear of the sheet and the thumb */
    '.sab-wrap.gm .sab-zoom{right:8px;bottom:auto;top:50%;transform:translateY(-30%);flex-direction:column;border-radius:14px}',
    '.sab-wrap.gm .sab-zoom .sab-btn{width:46px;min-height:46px;height:46px}',
    '.sab-wrap.gm .sab-zoom .sab-btn+.sab-btn{border-left:0;border-top:1px solid var(--brass-faint)}',
    /* the chosen place: a sheet over the bottom of the map, never pushing it */
    '.sab-wrap.gm .sab-tray{left:0;right:0;bottom:var(--dock);max-width:none;flex-wrap:wrap;gap:8px;' +
      'padding:14px 12px 12px;border:0;border-top:2px solid var(--brass);border-radius:20px 20px 0 0;' +
      'box-shadow:0 -10px 30px rgba(18,9,4,.38);animation:sabsheet .22s ease-out}',
    '@keyframes sabsheet{from{transform:translateY(24px);opacity:.4}to{transform:none;opacity:1}}',
    '.sab-wrap.gm .sab-tray .sab-who{flex:1 0 100%;min-width:0;max-width:none;padding:0 46px 2px 2px;margin:0;border:0}',
    '.sab-wrap.gm .sab-tray .sab-who b{font-size:21px}',
    '.sab-wrap.gm .sab-tray .sab-who span{font-size:12px}',
    '.sab-wrap.gm .sab-tray .sab-act{flex:1 1 0;width:auto;min-width:68px;min-height:78px}',
    '.sab-wrap.gm .sab-tray .sab-act.sq{flex:none;top:10px;right:10px;width:44px;min-width:0;height:44px;min-height:44px;' +
      'display:grid;place-items:center;justify-content:center;align-content:center;padding:0;font-size:17px;line-height:1}',
    /* the zoom rail stands aside while a place is chosen: on a short phone it would
       sit on the sheet's own door and its way out */
    '.sab-wrap.gm #sab-sheet:not([hidden])~#sab-stage .sab-zoom{display:none}',
    /* THE DOOR */
    '.sab-enter{display:none}',
    '.sab-wrap.gm .sab-enter{display:flex;align-items:center;gap:12px;flex:1 0 100%;min-height:60px;padding:8px 14px 8px 10px;' +
      'border-radius:16px;border:2px solid #ecc977;cursor:pointer;text-align:left;color:#fff;' +
      'background:radial-gradient(circle at 30% 20%,#e0683f,#b8391f 60%,#8f2a15);' +
      'box-shadow:0 6px 16px rgba(18,9,4,.35),inset 0 2px 0 rgba(255,255,255,.22)}',
    '.sab-wrap.gm .sab-enter .sab-tico{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;flex:none;' +
      'background:rgba(255,255,255,.16);border:1.5px solid #ffe2a0;color:#fff}',
    '.sab-wrap.gm .sab-enter .lbl{flex:1;display:flex;flex-direction:column;gap:3px;font:900 18px/1.1 var(--display,Georgia,serif)}',
    '.sab-wrap.gm .sab-enter .lbl em{font:700 11.5px/1.2 var(--body);font-style:normal;color:#ffe2a0}',
    '.sab-wrap.gm .sab-enter:active{transform:translateY(1px);filter:brightness(.96)}',
    '.sab-wrap.gm .sab-enter:focus-visible{outline:3px solid #ffe2a0;outline-offset:2px}',
    /* a book opens between the beam and the dock */
    '.sab-wrap.gm #sab-cityhost:not(:empty){top:calc(92px + env(safe-area-inset-top,0px));bottom:var(--dock);padding:12px 12px 16px}',
    '.sab-wrap.gm .sab-over{padding:12px 10px}',
    /* small phones: the books keep their names; Agla Saal gives a little */
    '@media (max-width:379px){.sab-wrap.gw.gm{--tw:122px}.sab-wrap.gm .sab-tab{width:56px;font-size:10px}' +
      '.sab-wrap.gm #sab-next{width:44px;height:44px;min-height:44px}.sab-wrap.gm #sab-turn .lbl{font-size:16px}}',
    '@media (max-width:339px){.sab-wrap.gm .sab-tab{width:46px}.sab-wrap.gm .sab-tab span{display:none}' +
      '.sab-wrap.gm #sab-res .sab-chip small{display:none}}',
    /* A TABLET HELD UPRIGHT gets the phone's arrangement with the phone's widths: a
       sheet the width of the screen put Enter 700px from end to end. */
    '@media (min-width:600px) and (orientation:portrait){' +
      '.sab-wrap.gm .sab-tray{right:auto;left:8px;width:min(560px,calc(100% - 16px))}' +
      '.sab-wrap.gm .sab-coach,.sab-wrap.gm .sab-rail{width:min(560px,calc(100% - 16px))}' +
      '.sab-wrap.gm #sab-res{justify-content:flex-start;gap:28px}' +
    '}',
    /* A PHONE ON ITS SIDE has height to spare nowhere: the stores join the beam, Mithu
       keeps one line, and the sheet becomes a strip. */
    '@media (orientation:landscape) and (max-height:520px){' +
      '.sab-wrap.gw.gm{--dock:calc(62px + env(safe-area-inset-bottom,0px))}' +
      '.sab-wrap.gm .sab-bar{flex-wrap:nowrap;padding-left:max(6px,env(safe-area-inset-left,0px))}' +
      '.sab-wrap.gm .sab-era{height:46px}' +
      '.sab-wrap.gm #sab-res{order:0;flex:0 1 auto;height:46px;border-top:0;justify-content:flex-start}' +
      '.sab-wrap.gm .sab-coach::before{display:none}' +
      '.sab-wrap.gm .sab-coach{padding:4px 6px;max-width:560px}' +
      '.sab-wrap.gm .sab-advisebtn span{-webkit-line-clamp:1}' +
      '.sab-wrap.gm .sab-railrow:nth-child(n+2){display:none}' +
      '.sab-wrap.gm .sab-tabs,.sab-wrap.gm #sab-turn{bottom:calc(env(safe-area-inset-bottom,0px) + 3px)}' +
      '.sab-wrap.gm #sab-next{bottom:calc(env(safe-area-inset-bottom,0px) + 7px)}' +
      '.sab-wrap.gm .sab-tray{flex-wrap:nowrap;overflow-x:auto;padding:10px 56px 10px 12px;align-items:stretch}' +
      '.sab-wrap.gm .sab-tray .sab-who{flex:0 0 auto;max-width:170px;padding:0 10px 0 2px;border-right:1px solid var(--brass-faint)}' +
      '.sab-wrap.gm .sab-enter{flex:0 0 auto;min-height:0;width:auto}' +
      '.sab-wrap.gm .sab-enter .lbl{font-size:16px}' +
      '.sab-wrap.gm .sab-tray .sab-act{flex:0 0 auto;width:84px;min-height:0}' +
      '.sab-wrap.gm #sab-cityhost:not(:empty){top:calc(48px + env(safe-area-inset-top,0px))}' +
    '}',

    /* THE CITY, FOR A THUMB. Agla Saal used to sit top-left in a box under the way
       out — on a phone, the one corner a right thumb cannot reach. On a narrow screen
       the city now keeps the map's own arrangement: the way out and the name across
       the top, zoom a rail on the right edge, Build bottom-left, and bottom-right the
       stores with Agla Saal under them and Grow above — the verbs a turn is made of,
       where the thumb already is. */
    '@media (max-width:620px){' +
      '.sab-scene.tight.iskit .sab-cityturn{left:auto;right:8px;top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);' +
        'width:auto;min-width:156px;padding:6px;gap:4px;border-radius:18px}' +
      '.sab-scene.tight.iskit .sab-cityturn .sab-act{min-height:52px;font-size:16px;border-radius:14px}' +
      '.sab-scene.tight.iskit .sab-cityturn .sab-act em{display:inline}' +
      '.sab-scene.tight.iskit .sab-grow{right:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 118px);min-height:46px;font-size:12.5px}' +
      '.sab-scene.tight.iskit .sab-dhandle{left:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);min-height:52px;' +
        'padding:0 16px 0 12px;font-size:14px;max-width:calc(100% - 190px)}' +
      '.sab-scene.tight.iskit .sab-kitbar{top:50%;bottom:auto;right:8px;transform:translateY(-50%);flex-direction:column;' +
        'flex-wrap:nowrap;gap:4px}' +
      '.sab-scene.tight.iskit .sab-kitbar button,.sab-scene.tight.iskit .sab-kitbar .z{min-width:44px;min-height:44px}' +
    '}',
    '@media (prefers-reduced-motion: reduce){.sab-route.live,.sab-lamp,.sab-exwalk image,' +
      '.sab-mistdrift ellipse,.sab-diya,.sab-swirl,.sab-ringfx,.sab-walker,.sab-bird,' +
      '.sab-plot.rise img,.sab-moor,.sab-station img,.sab-herostand img,.sab-cbadge,.sab-scafbtn.can img,.sab-trespot .glint,' +
      '.sab-smoke,.sab-cross,.sab-plot .pbell,.sab-yatri.walking img,.sab-stand,' +
      '.sab-greens polygon,.sab-raksha{animation:none}' +
      '.sab-trespot .glint{opacity:.55}.sab-cam{transition:none}.sab-tray,.sab-wrap.gm .sab-tray{animation:none}}'   /* still findable when nothing may move */
  ].join('\n');

  var cssIn = false;
  function injectCSS() {
    if (cssIn) return; cssIn = true;
    var s = D.createElement('style'); s.textContent = CSS; D.head.appendChild(s);
  }

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* through the app's Store seam: a save belongs to ONE child of the household */
  var ST = function () { return window.IND_STORE || { kidGet: function (k) { return localStorage.getItem(k); }, kidSet: function (k, v) { localStorage.setItem(k, v); }, kidDel: function (k) { localStorage.removeItem(k); } }; };
  function load() { try { return JSON.parse(ST().kidGet(SAVE_KEY) || 'null'); } catch (e) { return null; } }
  function save(g) { try { ST().kidSet(SAVE_KEY, JSON.stringify(g)); } catch (e) {} }
  function wipe() { try { ST().kidDel(SAVE_KEY); } catch (e) {} }

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
    var RI = { anna: 'wheat', kala: 'hammer', katha: 'scroll' };

    /* ---- game state: a plain JSON snapshot, deliberately ---- */
    var G = null;
    var FIRST = 'dholavira';     /* where every journey begins — see needsRoad() */
    function fresh() {
      var st = {};
      SITES.forEach(function (s) { st[s.id] = { lv: 1, zzz: s.era > 0 || s.id !== FIRST, fade: -1, idle: 0, seen: false,
                                                bld: {}, mon: false, neg: 0, jobs: null, hero: null,
                                                /* `plan` is the city's build queue — see queueStep() */
                                                plan: [],
                                                found: s.id === FIRST }; });
      st[FIRST].seen = true;
      return { era: 0, res: { anna: T.startRes.anna, kala: T.startRes.kala, katha: T.startRes.katha },
               sites: st, routes: [], t: 0, utsav: 0, ev: null, score: 0, won: false,
               quests: {}, qdone: 0, lastq: 0,
               tech: {}, proj: null, rt: 0, warn: null, wonders: {}, capital: null, disp: null, lastd: 0, quizAt: {}, quizN: 0,
               kingdoms: {}, lastraid: 0, explorers: [],
               darshan: {}, sutra: {}, tre: {}, lastakal: 0, lastdarshan: 0, calmUntil: 0,
               /* the clock is the player's now: which speed, and whether the world
                  stops itself when something is waiting on a decision */
               speed: SPEED_DEFAULT, autoPause: true,
               /* the second tree, the cards it opens, and what is in force */
               riti: {}, pol: [], peaceMade: 0,
               /* the world beyond the map: who is asking, who is pleased, what has
                  been sold often enough to be cheap, and where there is a street of
                  ours overseas */
               req: {}, fav: {}, sold: {}, diaspora: {},
               /* the age's own tally, whether the last age was thin, what a golden age
                  dedicated itself to, and the record of the ages already passed */
               deeds: {}, dark: false, ded: null, ages: [], log: [], hushed: {},
               delta: null };
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
    /* THE FIRST CITY NEEDS NO ROAD. "A story has to travel to be heard" is why a
       sleeping town waits for a road — but Dholavira is where the story starts, so
       nothing has to travel to it. Before this, a child who let it drift into the mist
       in the first minute, with nothing else yet found, was asked for a road that had
       nowhere to go: no road, no explorer from a sleeping city, no katha with nothing
       awake to earn it. A game over that never said so. */
    function needsRoad(id) { return id !== FIRST && !connected(id); }
    /* a road could be laid from here: somewhere else is on the map (tryRoute's own rule) */
    function roadable(id) { return SITES.some(function (o) { return o.id !== id && onMap(o); }); }
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
    var RITI = DATA.riti || [], POLS = DATA.policies || [];
    var POL_BY = {}; POLS.forEach(function (x) { POL_BY[x.id] = x; });
    var TECH_BY = {}; TECHS.forEach(function (x) { TECH_BY[x.id] = x; });
    var RITI_BY = {}; RITI.forEach(function (x) { RITI_BY[x.id] = x; });

    /* ==================================================================
       THE TREES — what is open, what it costs, and what doing the thing is worth
       ==================================================================
       Research was a flat list gated only by the age, so "open" meant nothing except
       "old enough", and the order was never forced by anything. `needs` makes it a
       tree, and the tree is what turns a shopping list into a route. */
    function techOpenFor(t) {
      if (!t || t.era > G.era) return false;
      return (t.needs || []).every(function (n) { return !!G.tech[n]; });
    }
    function ritiOpenFor(r) {
      if (!r || r.era > G.era) return false;
      return (r.needs || []).every(function (n) { return !!(G.riti || {})[n]; });
    }
    function techMissing(t) {
      return (t.needs || []).filter(function (n) { return !G.tech[n]; })
        .map(function (n) { return TECH_BY[n] ? TECH_BY[n].name : n; });
    }
    function ritiMissing(r) {
      return (r.needs || []).filter(function (n) { return !(G.riti || {})[n]; })
        .map(function (n) { return RITI_BY[n] ? RITI_BY[n].name : n; });
    }

    /* A WIDE REALM SHOULD NOT MAKE LEARNING FREE. Costs were flat, so by the middle
       ages a big network bought every door the turn it opened and the tree stopped
       being a choice. The price now rises gently with how much there is to teach. */
    function techScale() {
      var woke = SITES.filter(function (x) { return inEra(x) && awake(x.id); }).length;
      return 1 + Math.max(0, woke - 3) * 0.06;
    }
    function techCost(t) {
      var c = costOf(t.cost, 'tech'), out = {};
      Object.keys(c).forEach(function (k) { out[k] = Math.round(c[k] * techScale()); });
      return out;
    }

    /* ==================================================================
       EUREKA — doing the thing part-learns the thing
       ==================================================================
       The best teaching mechanic in the genre, and it belongs in a learning app more
       than it does in a strategy game: a child who has sown three fields has already
       met the reason the plough matters, and the research should say so rather than
       asking them to read it off a card. Every `boost` in the data names something
       countable, and every name below is counted — a boost whose `of` nothing reads
       would silently never fire. */
    function eurekaCount(of) {
      var n = 0;
      if (of === 'routes') return G.routes.length;
      if (of === 'woken') return SITES.filter(function (x) { return inEra(x) && awake(x.id); }).length;
      if (of === 'monuments') return SITES.filter(function (x) { return G.sites[x.id].mon; }).length;
      if (of === 'ports') return G.routes.filter(function (r) {
        return PORTS.indexOf(r[0]) >= 0 || PORTS.indexOf(r[1]) >= 0; }).length;
      if (of === 'peace') return G.peaceMade || 0;
      /* otherwise it is a build group: count the pieces of that group on every board */
      SITES.forEach(function (x) {
        if (!inEra(x)) return;
        (G.sites[x.id].kit || []).forEach(function (b) {
          var it = BY_PART[b.p]; if (it && it.g === of) n++;
        });
      });
      return n;
    }
    /* how much of this research is already paid for by what the player has done */
    function eurekaPct(t) {
      if (!t || !t.boost) return 0;
      var have = eurekaCount(t.boost.of);
      if (have < t.boost.n) return 0;
      return Math.min(0.9, t.boost.by);
    }

    /* ==================================================================
       POLICIES — reversible, because a child should be able to change their mind
       ================================================================== */
    function polSlots() { return 1 + Math.floor(Object.keys(G.riti || {}).length / 3); }
    function polHeld() { return (G.pol || []).filter(Boolean); }
    function polEff(key) {
      var v = 0, seen = false;
      polHeld().forEach(function (pid) {
        var c = POL_BY[pid];
        if (c && c.eff && c.eff[key] != null) { seen = true; v = c.eff[key]; }
      });
      return seen ? v : null;
    }
    function polOpen() {
      return RITI.filter(function (r) { return (G.riti || {})[r.id]; })
                 .map(function (r) { return r.gives; });
    }

    /* ==================================================================
       GOODS AND KHUSHI — variety, not volume
       ==================================================================
       Every city produced the same three numbers, so one more road was worth exactly
       what any other road was worth: eight farming towns beat four farms, two
       workshops and two schools, which is the opposite of the lesson a trade game
       should teach. A good is a category (the city's own kind, crossed with the part
       of the country it stands in) and a realm's contentment is how many DIFFERENT
       ones its roads reach. */
    var REGIONS = DATA.regions || {}, GOODNM = DATA.goodNames || {};
    /* what a catalogue item still owes the realm in goods, or null */
    function goodLock(it) {
      if (!it || !it.needsGood) return null;
      return canSupply(it.needsGood) ? null : it.needsGood;
    }
    function goodOf(id) {
      var x = byId[id]; if (!x) return null;
      var nm = GOODNM[x.kind], rg = REGIONS[x.state];
      return (nm && rg) ? (nm + ' of the ' + rg) : null;
    }
    /* which goods the realm can actually reach: a city on no road trades with nobody,
       so its good does not count -- that is what makes a road to somewhere DIFFERENT
       the interesting move rather than another road to somewhere the same. */
    function goodsReached() {
      var out = {};
      SITES.forEach(function (x) {
        if (!inEra(x) || !awake(x.id)) return;
        if (!connected(x.id) && G.capital !== x.id) return;
        var g = goodOf(x.id); if (g) out[g] = (out[g] || 0) + 1;
      });
      return out;
    }
    function khushiWant() {
      var arr = DATA.khushi || [];
      return arr[Math.min(G.era, arr.length - 1)] || 1;
    }
    function khushiHave() { return Object.keys(goodsReached()).length; }
    /* short of variety the realm grows restless. It is never shamed and always
       fixable by reaching somewhere new -- docs/16: a fading thing is sad, not scary. */
    function restless() { return Math.max(0, khushiWant() - khushiHave()); }

    /* WHY IS IT SEVEN — the card. Built from the ledger yieldOf fills on its own pass,
       so what a child reads and what the city pays can never disagree. */
    function yieldCard(id) {
      var x = byId[id]; if (!x) return;
      var led = [], y = yieldOf(x, led);
      if (!y) {
        showOverlay('<h3>' + esc(nameOf(x)) + '</h3><p>It is asleep, and earns nothing until it is woken.</p>' +
          '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Back</button></div>');
        return;
      }
      var rows = ['anna', 'kala', 'katha'].map(function (k) {
        var mine = led.filter(function (l) { return l.k === k && l.n; });
        if (!mine.length && !y[k]) return '';
        return '<div class="sab-brk"><b>' + ICON[k] + ' ' + y[k] + '</b>' +
          mine.map(function (l) {
            return '<span>' + (l.n > 0 ? '+' : '') + l.n + ' <i>' + esc(l.why) + '</i></span>';
          }).join('') + '</div>';
      }).filter(Boolean).join('');
      var appetite = Math.round(popOf(id) * T.eat * (polEff('eat') || 1) * 10) / 10;
      showOverlay('<div class="mono" style="color:var(--accent2)">where the numbers come from</div>' +
        '<h3>' + esc(nameOf(x)) + ' — every turn</h3>' +
        rows +
        '<p class="tiny" style="color:var(--muted)">And ' + popOf(id) + ' praja eat ' + appetite +
        ' 🌾 a turn. Everything above is one pass of the same arithmetic the city is paid by — ' +
        'if this card and the coins ever disagree, the card is the bug.</p>' +
        '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">I see</button></div>');
    }

    /* ==================================================================
       THE TURN'S OWN REPORT, AND THE ONE THING TO DO NEXT
       ==================================================================
       The feed is a single line and the world keeps talking over it, so everything that
       happened in a turn was announced and then immediately overwritten. A digest keeps
       the turn's three most important facts where they can be read at leisure.

       And the advisor answers the question the founder's note was really asking. "I'm
       not making strategic decisions" is partly a systems problem, which the other
       forty-nine items address, and partly this: a child who does not know what the
       game wants next does nothing, and doing nothing looks exactly like a game with
       nothing in it. */
    function digest(line) {
      if (!G.log) G.log = [];
      G.log.unshift({ t: G.t, s: line });
      if (G.log.length > 40) G.log.length = 40;
    }
    /* ONE suggestion, never a list: a list is another thing to read. */
    function advise() {
      var L = decisionList();
      if (L.length) return { why: nameOf(byId[L[0].id]) + ' wants you — ' + L[0].why, go: L[0].id };
      var zz = SITES.filter(function (x) { return onMap(x) && !awake(x.id) && !needsRoad(x.id); })[0];
      if (zz) return { why: (connected(zz.id) ? 'A road already reaches ' + nameOf(zz) + '.'
                                              : nameOf(zz) + ' is where the story began — it needs no road.') +
                            ' Wake it and its story is yours.', go: zz.id };
      var far = SITES.filter(function (x) { return onMap(x) && !awake(x.id); })[0];
      if (far) return { why: nameOf(far) + ' is found but unreached — a road would let you wake it.', go: far.id };
      if (hiddenSites().length && G.res.anna >= T.exploreCost)
        return { why: 'There is country nobody has walked yet. Send an explorer.', go: null };
      if (restless())
        return { why: 'The realm is restless — reach somewhere unlike home and it lifts.', go: null };
      var open = TECHS.filter(function (t) { return techOpenFor(t) && !G.tech[t.id] && canPay(techCost(t)); })[0];
      if (open && !G.proj) return { why: 'The school could begin ' + open.name + '.', go: null };
      var ask = Object.keys(G.req || {})[0];
      if (ask && canSupply(G.req[ask].want)) return { why: 'Somebody overseas is waiting on a road you already have.', go: null };
      if (canAdvance()) return { why: 'Every lamp of this age is lit. The age can turn.', go: null };
      return { why: 'Grow a town, or lay a road — everything else follows from those two.', go: null };
    }

    /* ==================================================================
       A SHORTER GAME — starting somewhere other than the beginning
       ==================================================================
       Thirteen ages is a beautiful shape and far too long for one sitting with a
       nine-year-old: the only way in was Dholavira, 3300 BCE, with all of India unseen,
       and anything past the third age was simply never reached by most players. A
       scenario hands over a realm that already works and starts the clock in the middle,
       which is also the only way a child ever sees the later ages at all.

       It builds the realm out of the SAME rules the long game does — the sites of those
       ages woken, roads between them, the era's own techs learned — rather than a
       hand-written save, so a scenario can never drift from the game it is a slice of. */
    var SCENARIOS = [
      { id: 'maurya', era: 2, name: 'The Great Sabha',
        blurb: 'Begin with the Mauryan roads already laid and the script already cut. About twenty minutes.' },
      { id: 'chola',  era: 4, name: 'Temples and the Sea',
        blurb: 'Begin in the south with the ports open and the sea roads busy. About twenty minutes.' }
    ];
    function startScenario(id) {
      var sc = null; SCENARIOS.forEach(function (x) { if (x.id === id) sc = x; });
      if (!sc) return;
      G = fresh();
      G.era = sc.era;
      /* everything of this age and before is found and awake */
      var live = [];
      SITES.forEach(function (x) {
        if (x.era > G.era) return;
        var q = G.sites[x.id];
        q.found = true; q.seen = true;
        /* the ages fold the old cities into memory exactly as advance() would */
        if (x.era <= G.era - 2 && !x.renames) { q.her = true; q.mon = true; }
        else { q.zzz = false; live.push(x.id); }
      });
      /* a road network, built by the game's own rule: nearest neighbour outward */
      for (var i = 1; i < live.length; i++) G.routes.push([live[i - 1], live[i]]);
      /* the learning of the ages already passed */
      TECHS.forEach(function (t) { if (t.era < G.era) G.tech[t.id] = true; });
      RITI.forEach(function (r) { if (r.era < G.era) G.riti[r.id] = true; });
      G.pol = polOpen().slice(0, polSlots());
      G.res = { anna: 120, kala: 120, katha: 80 };
      sel = null; city = null; techOpen = false; overlay = null;
      armClock(); shell(); fitFound();
      say(sc.name + ' — the realm is already standing. Take it on.', 'warm');
    }

    /* ==================================================================
       THE AGE'S OWN VERDICT — era score, golden ages, and the way back
       ==================================================================
       Thirteen ages passed with no opinion about any of them: clear the gate and the age
       was simply over, so the middle of a five-thousand-year game had no stakes at all.
       You could not lose and you could not excel, only continue.

       THE COMEBACK IS IN THE ARITHMETIC, and that is the part that matters. A thin age
       lowers the bar for the next one, so a bad stretch is the setup for a good one
       rather than the start of a slide. A game for children has to build that in rather
       than hope for it. */
    var DEEDS = DATA.deeds || [], DEDS = DATA.dedications || [], VICS = DATA.victories || [];
    var DEED_BY = {}; DEEDS.forEach(function (d) { DEED_BY[d.id] = d; });

    function deed(id, n) {
      if (!G.deeds) G.deeds = {};
      G.deeds[id] = (G.deeds[id] || 0) + (n || 1);
    }
    function eraScore() {
      var t = 0;
      Object.keys(G.deeds || {}).forEach(function (k) {
        var d = DEED_BY[k]; if (d) t += d.n * G.deeds[k];
      });
      return t;
    }
    function eraBar() {
      var arr = DATA.eraBar || [];
      var base = arr[Math.min(G.era, arr.length - 1)] || 20;
      return Math.max(6, base - (G.dark ? Math.round(base * 0.3) : 0));
    }
    function golden() { return eraScore() >= eraBar(); }
    function dedEff(id) { return G.ded === id; }

    /* ==================================================================
       FOUR ROADS TO AN ENDING
       ==================================================================
       One victory — light every lamp — is a completion checklist: one thing to do and
       one order to do it in, so nothing chosen along the way changes how you win. */
    function vicMemory() { return allAwake(); }
    function vicLearning() {
      return TECHS.every(function (t) { return !!G.tech[t.id]; }) &&
             RITI.every(function (r) { return !!(G.riti || {})[r.id]; });
    }
    function vicSea() {
      var portsOk = PORTS.every(function (id) {
        return !byId[id] || !inEra(byId[id]) || connected(id) || isHer(id);
      });
      return portsOk && (DATA.partners || []).every(function (x) {
        return (G.diaspora || {})[x.id];
      });
    }
    function vicStone() {
      var eras = {};
      SITES.forEach(function (x) { if (G.sites[x.id].mon) eras[x.era] = 1; });
      for (var e = 0; e <= G.era; e++) if (!eras[e]) return false;
      return true;
    }
    function victoriesWon() {
      var out = [];
      if (vicMemory()) out.push('memory');
      if (vicLearning()) out.push('learning');
      if (vicSea()) out.push('sea');
      if (vicStone()) out.push('stone');
      return out;
    }

    /* ==================================================================
       PARTNERS — somebody else who wants something, and remembers
       ==================================================================
       The only force in this game with any intent was the mist, and the mist wants one
       thing and never negotiates, so every decision the player made was against
       arithmetic. Partners are overseas and are never enemies (docs/16 §1 refuses the
       external enemy, and rightly): they ask, they pay, they remember, and they can be
       disappointed. That is intent, and it is enough of it.

       FAVOUR is the memory. It rises when a request is filled and drifts down when one
       is missed — never below zero, because a partner who can be lost for good is a
       punishment a child cannot come back from, and this game does not do those. */
    var PARTNERS = DATA.partners || [];
    function partnersNow() {
      return PARTNERS.filter(function (x) { return G.era >= x.era[0] && G.era <= x.era[1]; });
    }
    function favour(id) { return (G.fav || {})[id] || 0; }
    function canSupply(want) { return !!goodsReached()[want]; }

    /* A REQUEST IS A DEADLINE WITH A REASON. It asks for a good — something your roads
       may or may not reach — which is what makes reaching WIDE pay twice: once in
       khushi, once here. */
    function askPartner() {
      var live = partnersNow().filter(function (x) { return !(G.req || {})[x.id]; });
      if (!live.length) return;
      var pick = live[Math.floor(Math.random() * live.length)];
      if (!G.req) G.req = {};
      G.req[pick.id] = { at: G.t, due: G.t + 18, want: pick.wants,
                         pay: 30 + G.era * 5 };
      say(pick.name + ' sends word — they are asking for ' + pick.wants + '.', 'warm');
    }
    /* filling one, which is only possible if a road actually reaches the thing */
    function fillRequest(pid) {
      var r = (G.req || {})[pid], pd = null;
      PARTNERS.forEach(function (x) { if (x.id === pid) pd = x; });
      if (!r || !pd) return;
      if (!canSupply(r.want)) { say('No road of yours reaches ' + r.want + ' yet.', ''); return; }
      var price = marketPrice(r.want);
      var paid = Math.round(r.pay * price);
      G.res.katha += paid; G.score += 30; deed('fill');
      if (!G.fav) G.fav = {};
      G.fav[pid] = favour(pid) + 1;
      G.sold = G.sold || {};
      G.sold[r.want] = (G.sold[r.want] || 0) + 1;      /* the market notices */
      delete G.req[pid];
      say(pd.name + ' is well pleased — ' + paid + ' 📜, and they will ask again.', 'warm');
      maybeDiaspora(pid);
    }

    /* THE PRICE OF A THING FALLS AS YOU SELL MORE OF IT. Supply and demand, which is
       the one bit of economics a ten-year-old can feel rather than be told, and a
       bridge to the sibling app about money. Never below a third: a good you have
       specialised in should still be worth carrying. */
    function marketPrice(good) {
      var sold = (G.sold || {})[good] || 0;
      return Math.max(0.34, 1 - sold * 0.08);
    }

    /* DIASPORA — growth that is emphatically not territory. A partner who has been
       well served long enough asks for a quarter of its own, and thereafter sends a
       gift home every few turns. Nothing is settled, claimed or coloured; somebody
       else's city has an Indian street in it, which is how this actually happened. */
    function maybeDiaspora(pid) {
      if (favour(pid) < 3) return;
      if (!G.diaspora) G.diaspora = {};
      if (G.diaspora[pid]) return;
      G.diaspora[pid] = { at: G.t };
      var pd = null; PARTNERS.forEach(function (x) { if (x.id === pid) pd = x; });
      G.score += 60;
      showOverlay('<div class="mono" style="color:var(--accent2)">a street of your own, far away</div>' +
        '<h3>' + esc(pd ? pd.name : '') + ' makes room</h3>' +
        '<p>Traders from your roads have been coming so long that ' + esc(pd ? pd.name : 'they') +
        ' has given them a quarter of their own — a street where your language is spoken and ' +
        'your festivals are kept. Nothing was taken to get it. It sends something home every few turns, ' +
        'for as long as it stands.</p>' +
        '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Good</button></div>');
    }
    function diasporaGift() {
      var n = Object.keys(G.diaspora || {}).length;
      if (!n) return;
      if (G.t % 10 !== 0) return;
      G.res.katha += n * 3; G.res.kala += n * 2;
      say('Word and goods home from ' + n + ' quarter' + (n > 1 ? 's' : '') + ' overseas.', 'warm');
    }

    /* ==================================================================
       THE SISTER REALMS — the one competitor that is not one
       ==================================================================
       The genre's tension comes from other players wanting what you want. Every version
       of that which fits on this map is forbidden and should be: a rival janapada that
       can be beaten is the external enemy docs/16 §1 refuses, and it is somebody's
       ancestor besides.

       So the sisters are janapadas whose lamps are not yours to light and whose troubles
       are not yours to cause. They ask for help, and the SHARED METER only ever goes up
       — theirs rising lifts yours too. It is the shape of competition with the sign
       flipped: you watch somebody else's number and you are glad when it moves. That is
       a thing worth teaching a nine-year-old about neighbours, and it costs the design
       nothing, because the mist was always the only adversary this game needed. */
    function sisters() {
      /* drawn from the roster itself: places of this age that are not on your roads.
         They are not entities with saves — they are the rest of India, getting on with
         it, which is exactly what they were historically. */
      return SITES.filter(function (x) {
        return inEra(x) && found(x.id) && !connected(x.id) && !awake(x.id);
      }).slice(0, 3);
    }
    function remembered() {
      var lit = SITES.filter(function (x) { return inEra(x) && awake(x.id); }).length;
      var all = SITES.filter(function (x) { return inEra(x); }).length || 1;
      return { lit: lit, all: all, pct: Math.round(lit / all * 100) };
    }

    /* ==================================================================
       WHAT A REALM CAN DO AT ONCE
       ==================================================================
       Nothing capped the number of great works in flight, so a rich realm started
       every monument in the same turn and the decision "which city does the great
       thing this age" never came up. */
    function worksCap() { return 1 + Math.floor(G.era / 4); }
    function worksRunning() {
      return SITES.filter(function (x) { return G.sites[x.id].monB; }).length;
    }

    /* DIMINISHING RETURNS. Every bonus in this game was additive and permanent, and
       the kingdom's +1 of everything to every connected city meant the mid-game
       collapsed into inevitability: there was no decision left because everything was
       already paid for. The sum of the STACKED bonuses (not the city's own work) is
       softened once it runs away. */
    function soften(n) {
      if (n <= 4) return n;
      return 4 + Math.round((n - 4) * 0.6);
    }

    /* UPKEEP. A road cost kala once and then nothing for five thousand years, so a
       sprawling network was strictly better than a considered one and pruning was
       never a move. Roads past the first few ask a little grain each turn. */
    function upkeep() {
      var free = 4 + G.era;
      return Math.max(0, G.routes.length - free) * 0.2;
    }

    /* AND THE STORES HAVE A LID. Hoarding anna was strictly optimal -- nothing ever
       asked the player to spend -- so the granaries were a wall to stand behind
       rather than a thing to use. */
    function storeCap() {
      var g = 0;
      SITES.forEach(function (x) { if (inEra(x) && G.sites[x.id].bld.granary) g++; });
      return 120 + G.era * 20 + g * 40 + (polEff('noFade') ? 60 : 0);
    }
    /* THE FOUR JOBS ARE NOT FOUR ANY MORE. Every count, split and shrink used
       to name kisan/karigar/kathakar/rakshak in a literal array, in six
       places, so adding a role meant finding all six. Read the roster once. */
    var JOB_IDS = Object.keys(DATA.jobs);

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
      anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13H3a9 9 0 0018 0h-2M8 10h8"/>',
      list:   '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
      menu:   '<path d="M4 7h16M4 12h16M4 17h16"/>',
      next:   '<path d="M5 12h13M13 7l5 5-5 5"/>',
      plus:   '<path d="M12 5v14M5 12h14"/>',
      minus:  '<path d="M5 12h14"/>',
      whole:  '<path d="M4 11l8-7 8 7M6 10v10h12V10"/>',
      heart:  '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.7A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
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
      /* THE DATA DECIDES, AND ONLY THE DATA. A city has a built board if a
         board was drawn for it; there is no mode to be in and nothing to
         remember. Twenty-three cities keep their paintings because no kit has
         been made for them yet, which is a gap in the art and not a setting. */
      return !!(W.IND_KIT && W.IND_KIT_CITIES &&
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

    /* ==================================================================
       A CITY GROWS IN A DIRECTION
       ==================================================================
       Reach was a radius: grow, and the buildable circle widened evenly on every
       side. Nothing about that is a decision — there is no version of it a player can
       get wrong, so there is no version they can get right. Settling toward the water
       or away from it, along the road or up the rise, is the oldest strategic choice a
       town makes, and Dholavira's own three nested parts are the evidence.

       So each level gained asks WHICH WAY, and the chosen side reaches further. This
       is not a boundary: nothing is drawn, coloured or claimed, and the ground is the
       same neutral wash it always was. It is which way the streets went. */
    var DIRS = [{ id: 'n', name: 'north' }, { id: 'e', name: 'east' },
                { id: 's', name: 'south' }, { id: 'w', name: 'west' }];
    var DIR_BONUS = 5;
    function dirOfCell(id, cx, cy) {
      var C = (W.IND_KIT_CITIES || {})[id];
      if (!C || !C.centre) return null;
      var dx = cx - C.centre[0], dy = cy - C.centre[1];
      if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'e' : 'w';
      return dy >= 0 ? 's' : 'n';
    }
    function reachTo(id, cx, cy) {
      var q = G.sites[id], grown = q.grown || [], d = dirOfCell(id, cx, cy);
      return reachOf(id) + (d && grown.indexOf(d) >= 0 ? DIR_BONUS : 0);
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

    /* WHAT RESEARCH STILL OWES THIS ITEM. Returns the tech's name if it is
       not finished yet, else null. The shop SHOWS a locked thing rather than
       hiding it: a child who cannot see the forge has no reason to want iron,
       and research that unlocks nothing visible is research nobody does. */
    function techLock(it) {
      if (!it || !it.tech || G.tech[it.tech]) return null;
      var t = null;
      TECHS.forEach(function (t2) { if (t2.id === it.tech) t = t2; });
      return t ? t.name : it.tech;
    }

    /* Does this city have the thing that houses this kind of person? A role
       already on the payroll always counts as open — the gate decides what may
       be ADDED, never what is taken away from a save made before it existed. */
    function jobOpen(id, jid) {
      var role = null;
      (BUILD.jobs || []).forEach(function (r) { if (r.j === jid) role = r; });
      if (!role) return false;
      var x = byId[id], q = G.sites[id];
      if (x.era < role.era[0] || x.era > role.era[1]) return (q.jobs && q.jobs[jid] > 0);
      if (!role.need) return true;
      if ((q.jobs && q.jobs[jid] > 0)) return true;
      var got = false;
      (role.need.bld || []).forEach(function (b) { if (q.bld && q.bld[b]) got = true; });
      if (!got && role.need.part && kitOn(id)) {
        role.need.part.forEach(function (pp) { if (builtCount(id, pp) > 0) got = true; });
      }
      return got;
    }
    /* what a city is still missing before it can put this kind of person to
       work — said as a thing to build, because that is the answer */
    function jobNeed(id, jid) {
      var role = null;
      (BUILD.jobs || []).forEach(function (r) { if (r.j === jid) role = r; });
      if (!role || !role.need) return '';
      var names = [];
      (role.need.bld || []).forEach(function (b) { if (BLD[b]) names.push(BLD[b].name || b); });
      (role.need.part || []).forEach(function (pp) {
        var d = W.IND_KIT && W.IND_KIT.def(pp); if (d) names.push(d.name);
      });
      if (!names.length) return '';
      return 'needs ' + names.slice(0, 3).join(', or ');
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
      if (K2.reach(id, cx, cy) > reachTo(id, cx, cy)) return 'too far out — the city has not grown that way yet';
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
      var tl = techLock(it);
      if (tl) return 'nobody here knows how yet — study ' + tl + ' first';
      /* AND SOME THINGS NEED STUFF THE REALM HAS TO REACH FIRST.
         Research gated what a city KNEW how to make; nothing gated what it had to make
         it FROM, so a shipyard could be raised in a realm whose roads touched no timber
         and a kiln in one that reached no clay. `needs` on a catalogue item names a good
         (see regions/goodNames) and the road network has to reach it. It is the same
         scarcity khushi measures, asked as a hard question rather than a soft one. */
      var gl = goodLock(it);
      if (gl) return 'nothing on your roads brings ' + gl + ' yet';
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
    /* ==================================================================
       ADJACENCY — what a thing is worth depends on what stands next to it
       ==================================================================
       The board looked like a city-builder and behaved like a form: kitYield()
       summed every piece's `give` and never read its coordinates, so a workshop
       paid the same in the middle of the bazaar as alone in the sand. Every rule
       lives in data-kit-build.js `adjacency` next to the claim it makes about how
       a city worked; this is only the arithmetic.

       ONE FUNCTION ANSWERS BOTH QUESTIONS, and it has to. "What does this city
       earn?" and "what would this piece earn if I put it here?" must never be able
       to disagree, or the preview becomes a lie that teaches the wrong rule. So
       adjacency takes an optional extra piece and is called speculatively by the
       plot preview with exactly the code the yield uses. */
    var ADJ = BUILD.adjacency || [];

    /* ==================================================================
       THE RIVERS DO SOMETHING NOW
       ==================================================================
       data-sabhyata.js drew every great river of India from its real course and then
       said, in its own comment, "Terrain only — nothing interactive, nothing
       gamified." That was the boundary rule being applied one step too far. What
       CLAUDE.md forbids is a BORDER that draws, pulses, moves or gets conquered; a
       river that waters the town beside it is not a border, it is the reason the town
       is there. Every janapada on the map is on a river because that is where you
       could grow enough to have a city at all, and a game about Indian civilization
       in which the Ganga is wallpaper has thrown away its best teacher.

       So: a site within RIVER_NEAR map-units of a real course is riverine. It earns
       one more anna, and a drought cannot close its throat (see akal). Nothing is
       coloured, nothing is claimed, and the geometry is the same neutral wash it
       always was. */
    var RIVER_NEAR = 26;          /* map units — the map is ~1000 across */
    var riverCache = {};
    /* distance from a point to a segment, which is the only honest way to ask
       "is this town ON the river" of a polyline traced from a real course */
    function segDist(px, py, ax, ay, bx, by) {
      var dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
      var t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
      var cx = ax + t * dx, cy = ay + t * dy;
      return Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
    }
    function onRiver(id) {
      if (riverCache[id] != null) return riverCache[id];
      var s2 = byId[id];
      if (!s2) return (riverCache[id] = null);
      var best = Infinity, which = null;
      (DATA.rivers || []).forEach(function (r) {
        for (var i = 0; i < r.p.length - 1; i++) {
          var d = segDist(s2.x, s2.y, r.p[i][0], r.p[i][1], r.p[i + 1][0], r.p[i + 1][1]);
          if (d < best) { best = d; which = r.n; }
        }
      });
      return (riverCache[id] = (best <= RIVER_NEAR ? which : null));
    }
    /* what the river is worth to this city, in anna. Zero is an answer. */
    function riverAnna(id) { return onRiver(id) ? 1 : 0; }

    /* every cell a piece covers. Footprints come from the part's own dims, read the
       same way canPlace() reads them, so a thing can never occupy cells for placement
       and different cells for payment. */
    function footprint(b) {
      var K2 = W.IND_KIT, def = K2 && K2.def(b.p), out = [];
      var L = (def && def.d[0]) || 1, B = (def && def.d[1]) || 1, a, c;
      for (a = 0; a < L; a++) for (c = 0; c < B; c++) out.push([b.x + a, b.y + c]);
      return out;
    }
    function groupOf(b) { var it = BY_PART[b.p]; return it ? it.g : null; }

    /* WHAT STANDS NEXT TO WHAT. Built once per question rather than per piece: a
       city with forty pieces was forty scans of forty pieces, every turn, for every
       city. */
    function adjMap(pieces) {
      var at = {};
      pieces.forEach(function (b) {
        var g = groupOf(b); if (!g) return;
        footprint(b).forEach(function (c) {
          var k = c[0] + ',' + c[1];
          (at[k] || (at[k] = [])).push({ g: g, b: b });
        });
      });
      return at;
    }
    var NB = [[1, 0], [-1, 0], [0, 1], [0, -1]];   /* orthogonal; a channel does not run diagonally */

    /* what one piece earns from where it stands. `at` is the occupancy map of every
       OTHER piece, so a piece never counts itself as its own neighbour. */
    function adjFor(id, b, at) {
      var out = { anna: 0, kala: 0, katha: 0, watch: 0 }, why = [];
      var g = groupOf(b); if (!g) return { pay: out, why: why };
      var K2 = W.IND_KIT, mine = {};
      footprint(b).forEach(function (c) { mine[c[0] + ',' + c[1]] = 1; });
      ADJ.forEach(function (r) {
        if (r.g !== g) return;
        var hits = 0, seen = {};
        footprint(b).forEach(function (c) {
          if (r.ter) {
            /* terrain is asked of the cell the piece STANDS on, not its neighbours */
            if (K2 && K2.terrain(id, c[0], c[1]) === r.ter) hits++;
            return;
          }
          NB.forEach(function (d) {
            var nx = c[0] + d[0], ny = c[1] + d[1], k = nx + ',' + ny;
            if (mine[k]) return;                   /* its own other half is not a neighbour */
            (at[k] || []).forEach(function (o) {
              if (o.g !== r.of) return;
              var oid = o.b.p + '@' + o.b.x + ',' + o.b.y;
              if (seen[oid]) return;               /* a 2x2 neighbour is ONE neighbour */
              seen[oid] = 1; hits++;
            });
          });
        });
        if (!hits) return;
        var n = Math.min(hits, r.cap || 1);
        Object.keys(r.pay).forEach(function (k) { out[k] += r.pay[k] * n; });
        why.push({ n: n, why: r.why, pay: r.pay });
      });
      return { pay: out, why: why };
    }

    /* the city's whole adjacency purse, and optionally what one more piece would add */
    function adjTotal(id, extra) {
      var q = kitOf(id), pieces = q.kit.slice();
      if (extra) pieces.push(extra);
      var at = adjMap(pieces);
      var out = { anna: 0, kala: 0, katha: 0, watch: 0 };
      pieces.forEach(function (b) {
        var r = adjFor(id, b, at);
        ['anna', 'kala', 'katha', 'watch'].forEach(function (k) { out[k] += r.pay[k]; });
      });
      return out;
    }
    /* WHAT THIS PLOT WOULD BE WORTH — the preview, answered by the same arithmetic
       that pays out, including what the new piece does for its neighbours and not
       only what they do for it. */
    function adjPreview(id, part, cx, cy) {
      var it = BY_PART[part]; if (!it) return null;
      var before = adjTotal(id);
      var cand = { p: part, x: cx, y: cy };
      var after = adjTotal(id, cand);
      var own = adjFor(id, cand, adjMap(kitOf(id).kit));
      var d = {};
      ['anna', 'kala', 'katha', 'watch'].forEach(function (k) { d[k] = after[k] - before[k]; });
      return { base: it.give || {}, bonus: d, why: own.why };
    }

    function kitYield(id) {
      var q = kitOf(id), out = { anna: 0, kala: 0, katha: 0 };
      q.kit.forEach(function (b) {
        var it = BY_PART[b.p]; if (!it || !it.give) return;
        ['anna', 'kala', 'katha'].forEach(function (k) {
          if (it.give[k]) out[k] += it.give[k];
        });
      });
      /* and what the arrangement itself is worth */
      var a = adjTotal(id);
      out.anna += a.anna; out.kala += a.kala; out.katha += a.katha;
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
      var q = kitOf(id), n = adjTotal(id).watch;   /* wall joined to wall is a rampart */
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

    function kitBoard(id, pins) {
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
      /* PINNED TO THE BOARD, NOT TO THE FRAME.
         The monument, the treasure and the plot markers are placed at a
         PERCENTAGE OF THE BOARD — kitPt returns exactly that. They used to be
         hung on .sab-cam, which is the frame: the frame does not change when
         you zoom but the board does, so every zoom slid the monument across
         the city and it ended up standing in the water. They live inside
         .sab-kitboard now, which fit() sizes to the board exactly, so a
         percentage means what it says at every zoom. */
      return '<div class="sab-hero sab-kitboard"><div class="sab-kitinner" id="sab-kitinner"' +
        ' data-z="' + (G.kitZ || 1) + '" style="width:' + r.w + 'px;height:' + r.h +
        'px">' + r.html + kitCrowd(id) + '</div>' +
        (pins ? '<div class="sab-kitpins">' + pins + '</div>' : '') + '</div>';
    }

    /* THE PRAJA STAND ON THE WORK THEY DO.
       The crew was four numbers on four chips: a child moved a person from the
       fields to the workshop and nothing on the board moved. Now every
       assigned worker is drawn AT one of the buildings that employs them —
       kisan out among the crops, karigar at the kiln, a dwarpal on his gate —
       so moving a person moves a person, and a workshop with nobody in it
       looks like a workshop with nobody in it.

       They are painted on, not played: aria-hidden, no pointer events, so
       tapping a worker opens the building underneath them, which is what a
       child means by tapping a worker. */
    function kitCrowd(id) {
      var K2 = W.IND_KIT, C = (W.IND_KIT_CITIES || {})[id];
      if (!K2 || !C) return '';
      var q2 = kitOf(id), jt = jobsOf(id), rot = G.kitRot || 0;
      var ox = (rot % 2 ? C.gw : C.gh) * K2.W, oy = KIT_HEAD * K2.RISE;
      /* every built thing, and every sown field, as a place somebody could be */
      var placed = q2.kit.map(function (b) {
        var d = K2.def(b.p);
        return { p: b.p, x: b.x, y: b.y, L: (d && d.d[0]) || 1, B: (d && d.d[1]) || 1 };
      });
      Object.keys(q2.tiles || {}).forEach(function (key) {
        var xy = key.split(',');
        placed.push({ p: q2.tiles[key], x: +xy[0], y: +xy[1], L: 1, B: 1 });
      });
      var out = '';
      (BUILD.jobs || []).forEach(function (r) {
        var n = jt[r.j] || 0, sp = spOf(r.j);
        if (!n || !sp) return;
        var spots = placed.filter(function (b) {
          return (r.at || []).some(function (a2) {
            return a2.slice(-1) === '-' ? b.p.indexOf(a2) === 0 : a2 === b.p;
          });
        });
        if (!spots.length) return;
        /* spread them over the places there are; more workers than benches
           means they double up, which is what a crowded workshop looks like */
        for (var i = 0; i < Math.min(n, 12); i++) {
          var b2 = spots[i % spots.length];
          /* A PIECE STANDS ON THE SOUTH VERTEX OF ITS OWN FOOTPRINT, bottom
             centre, which is what translate(-50%,-100%) means on .kit-p. A
             worker has to be hung the same way or they are not on the ground
             at all — a pixel offset put the first lot in mid-air over the
             wrong cell. Turn the real footprint, take its anchor, then lift
             half a tile so they stand in the middle of the front edge rather
             than balanced on its corner. */
          var c2 = K2.turn(b2.x, b2.y, b2.L, b2.B, rot, C.gw, C.gh);
          var a2 = K2.anchor(c2.x, c2.y, c2.L, c2.B);
          /* two on one spot must not be one on top of the other */
          var jig = Math.floor(i / spots.length);
          var px = a2.x + ox + (jig ? (jig % 2 ? 13 : -13) : 0);
          var py = a2.y + oy - K2.H + (jig ? -5 * Math.ceil(jig / 2) : 0);
          out += '<img class="sab-kworker" src="' + sp + '" alt=""' +
            ' data-at="' + b2.p + '" data-cell="' + b2.x + ',' + b2.y + '"' +
            ' style="left:' + px.toFixed(1) + 'px;top:' + py.toFixed(1) + 'px">';
        }
      });
      return out ? '<div class="sab-kcrowd" aria-hidden="true">' + out + '</div>' : '';
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
      /* PEOPLE ARE A SHELF IN THE SHOP. Arranging the crew used to live only
         on four chips pinned to the corners of the board, which is a fine
         place to SEE them and a poor place to discover them — nothing there
         says a workshop is what buys you a karigar. They get a tab, with the
         locked ones showing what to build. */
      var crew = (BUILD.jobs || []).filter(function (r) {
        var x2 = byId[id];
        return x2.era >= r.era[0] && x2.era <= r.era[1] && spOf(r.j);
      }).map(function (r) { return { job: r, g: 'people' }; });
      if (crew.length) byG.people = crew;
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
      /* WHAT THIS PLOT IS WORTH, before the coin is spent.
         An adjacency rule that cannot be seen is a rule a child can only discover by
         accident, and most never will — so the moment a piece is held over a cell the
         board says what it would pay there and WHY, in the rule's own words. Every
         number comes from adjPreview(), which is the same arithmetic that pays out;
         a preview computed a second way would eventually disagree with the city and
         teach the wrong lesson with total confidence. */
      var pv = (held && hold.cell) ? adjPreview(id, hold.p, hold.cell.x, hold.cell.y) : null;
      var note = '';
      if (pv) {
        var bad = canPlace(id, BY_PART[hold.p], hold.cell.x, hold.cell.y);
        var sum = ['anna', 'kala', 'katha'].map(function (k) {
          var tot = (pv.base[k] || 0) + (pv.bonus[k] || 0);
          if (!tot) return '';
          return '<b>' + ICON[k] + ' +' + tot + '</b>' +
                 (pv.bonus[k] ? '<i>' + (pv.base[k] || 0) + ' + ' + pv.bonus[k] + ' for where it stands</i>' : '');
        }).filter(Boolean).join('');
        note = '<div class="sab-plotpv' + (bad ? ' no' : '') + '">' +
          (bad ? '<span class="sab-pvno">' + esc(bad) + '</span>'
               : (sum || '<span class="sab-pvno">Nothing extra here \u2014 try it beside something.</span>')) +
          (bad ? '' : pv.why.map(function (w) {
            return '<span class="sab-pvwhy">' + esc(w.why) + (w.n > 1 ? ' \u00d7' + w.n : '') + '</span>';
          }).join('')) + '</div>';
      }
      /* the lift button lives with the shelf, because moving a thing is the same
         decision as placing it, made a second time with more information */
      var moveBtn = q.kit && q.kit.length
        ? '<button class="sab-grow' + (G.moving ? ' can' : '') + '" data-sab-act="kitmove"' +
          ' aria-label="Lift something already built and put it somewhere better \u2014 ' +
          'it costs a third of its price">' + (G.moving ? '\u2716 Stop lifting' : '\u21f2 Move a building') +
          '<em>a third of its price</em></button>'
        : '';
      if (!open) return handle + note + moveBtn + grow;
      handle += note + moveBtn;

      var tabs = groups.map(function (g) {
        return '<button class="sab-dtab' + (g[0] === tab ? ' on' : '') +
          '" data-sab-act="kittab" data-g="' + g[0] + '"' +
          ' aria-label="' + esc(g[1]) + ' \u2014 ' + esc(g[2]) + '">' + esc(g[1]) +
          '<i>' + byG[g[0]].length + '</i></button>';
      }).join('');

      var jt = jobsOf(id), popNow = popOf(id), busy = 0;
      JOB_IDS.forEach(function (j2) { busy += jt[j2]; });

      var tiles = byG[tab].map(function (it) {
        /* A PERSON IS NOT A PIECE. They cost no coin — the scarce thing is a
           free pair of hands — so their tile counts heads and carries the
           same two buttons the corner chips do, and says what to build when
           the city has nowhere to put them yet. */
        if (it.job) {
          var r = it.job, jd = DATA.jobs[r.j], open2 = jobOpen(id, r.j);
          var have = jt[r.j] || 0;
          var canAdd = open2 && (busy < popNow || (jt.kisan > 0 && r.j !== 'kisan'));
          return '<div class="sab-tile sab-ptile' + (open2 ? '' : ' locked') + '"' +
            ' role="group" aria-label="' + esc(jd.name) + '. ' + esc(jd.what) +
            (open2 ? '' : '. ' + esc(jobNeed(id, r.j))) + '">' +
            '<span class="art"><img src="' + spOf(r.j) + '" alt="">' +
            (have ? '<u>' + have + '</u>' : '') + '</span>' +
            '<b>' + esc(jd.name) + '</b>' +
            (open2
              ? '<span class="pmrow">' +
                  '<button class="pm" data-sab-act="job" data-j="' + r.j + '" data-d="-1"' +
                  (have ? '' : ' disabled') + ' aria-label="One fewer ' + esc(jd.name) + '">\u2212</button>' +
                  '<button class="pm" data-sab-act="job" data-j="' + r.j + '" data-d="1"' +
                  (canAdd ? '' : ' disabled') + ' aria-label="One more ' + esc(jd.name) + '">+</button>' +
                '</span>'
              : '<span class="c lock">' + esc(jobNeed(id, r.j)) + '</span>') +
            (r.j === 'kisan' || !jd.guard ? '' : '<span class="g">+' + jd.guard + '\ud83d\udee1\ufe0f</span>') +
            '</div>';
        }
        var def = W.IND_KIT.def(it.p), n = builtCount(id, it.p);
        var done = it.only && !it.many && n >= 1;
        var lock = techLock(it);
        var poor = !done && !lock && !canPay(costOf(it.cost, 'building'));
        var give = ['anna', 'kala', 'katha'].filter(function (k) { return it.give && it.give[k]; })
          .map(function (k) { return '+' + it.give[k] + ICON[k]; }).join(' ');
        if (it.pop) give += (give ? ' ' : '') + '+' + it.pop + '\ud83d\udc64';
        return '<button class="sab-tile' + (hold && hold.p === it.p ? ' on' : '') +
          (poor ? ' poor' : '') + (lock ? ' locked' : '') +
          '" data-sab-act="kitpick" data-p="' + it.p + '"' +
          (done || lock ? ' disabled' : '') +
          ' aria-label="' + esc(def ? def.name : it.p) + '. ' + esc(it.what) +
          ' Costs ' + esc(costStr(costOf(it.cost, 'building'))) +
          (done ? '. Already built.' : lock ? '. Locked until the city studies ' + esc(lock) + '.'
                : poor ? '. Not enough yet.' : '') + '">' +
          /* a crop's tile shows the crop: the piece art for a field is the flat
             ground tile, which tells a child nothing about what they are sowing */
          '<span class="art' + (it.tile ? ' crop' : '') + '"><img src="' +
          ((it.tile && W.IND_KIT.hasField(it.p) ? 'art/kit/_ground/' + it.p + '.jpg'
            : W.IND_KIT.src(it.p, 0)) || '') + '" alt="">' +
          (n ? '<u>' + n + '</u>' : '') + '</span>' +
          '<b>' + esc(def ? def.name : it.p) + '</b>' +
          (lock ? '<span class="c lock">\ud83d\udd12 ' + esc(lock) + '</span>'
                : '<span class="c">' + esc(costStr(costOf(it.cost, 'building'))) + '</span>') +
          (give && !lock ? '<span class="g">' + give + '</span>' : '') + '</button>';
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


    /* ================================================================
       THE CALLS — everything in this city that wants a decision.

       These used to be a column of cards UNDER the board, so the city was a
       page you scrolled: the board at the top, and the master builder's
       question somewhere below the fold. On the built board the city is the
       whole screen and nothing hangs beneath it, so each of these is raised
       when it is asked for — from the bell, which says how many are waiting.

       Each builder returns { t: what to call it, h: the card itself } and is
       used BOTH ways: the painted plates still lay them out down the page, the
       built board raises them one at a time. One copy of the markup, so the
       two cannot drift apart.
       ================================================================ */
    function callHero(id) {
      var s2 = byId[id], q2 = G.sites[id], hd = DATA.heroes[s2.kind];
      var hface = spOf({ kheti: 'hero-annadata', shilpa: 'hero-sthapati', vidya: 'hero-acharya' }[s2.kind]);
      var king2 = inKingdomOf(id);
      var h2 = (hface ? '<img class="sab-heroface" src="' + hface + '" alt="">' : '') +
        '<p><b>' + esc(hd.deed) + '</b> — ' + esc(hd.deedWhat) + '.</p>' +
        '<button class="sab-btn go" data-sab-act="deed">Ask for the great deed</button>';
      if (G.era >= T.kingdomEra && !king2)
        h2 += '<button class="sab-btn" style="margin-left:8px" data-sab-act="crown"' +
          (reach(id).filter(function (o) { return awake(o); }).length + 1 >= T.kingdomMin ? '' : ' disabled') +
          '>Or: crown ' + esc(s2.name) + ' — found a kingdom</button>' +
          '<p class="tiny" style="color:var(--muted);margin:8px 0 0">A crown needs ' + T.kingdomMin +
          ' awake towns joined by roads. Every town the roads reach shares the kingdom’s strength (+1 of everything).</p>';
      return { t: motif('peacock', 22) + esc(hd.name) + ' is here · ' + esc(hd.gift), h: h2 };
    }
    function callQuarrel(id) {
      var s2 = byId[id], other = byId[G.disp.a === id ? G.disp.b : G.disp.a];
      return { t: 'the panchayat sits · ' + G.disp.left + 's',
        h: '<p>' + esc(s2.name) + ' and ' + esc(other.name) + ' have quarrelled over ' + esc(G.disp.over) +
          '. The road between them carries nothing until it is settled.</p>' +
          (G.tech.panchayat
            ? '<button class="sab-btn go" data-sab-act="peace" data-i="-1">Let the five settle it (free — the Panchayat)</button>'
            : G.disp.fix.map(function (f, i) {
                var c = costOf(f.cost, 'peace');
                return '<button class="sab-btn go" style="margin:4px 6px 0 0" data-sab-act="peace" data-i="' + i + '"' +
                  (canPay(c) ? '' : ' disabled') + '>' + esc(f.what) + ' (' + costStr(c) + ')</button>';
              }).join('')) };
    }
    function callGuru(id) {
      var cd = Math.max(0, (G.quizAt[id] || -999) + T.quizCd - G.t);
      return { t: 'the gurukul',
        h: (quiz && quiz.at === id
          ? '<p>' + (quiz.of !== id ? 'About <b>' + esc(byId[quiz.of].name) + '</b>: ' : '') + esc(askList(byId[quiz.of])[quiz.qi || 0].q) + '</p>' +
            riddleOptions(byId[quiz.of], quiz.qi).map(function (o) {
              return '<button class="sab-btn" style="display:block;width:100%;text-align:left;margin:6px 0" data-sab-act="quiz" data-o="' + esc(o) + '">' + esc(o) + '</button>';
            }).join('') +
            (riddleWrong ? '<p class="tiny" style="color:var(--muted)">Not that one — think of the city’s own telling. Another go.</p>' : '')
          : '<p>The teacher will take a question' + (G.tech.script ? ' about any woken city' : '') + '.</p>' +
            '<button class="sab-btn" data-sab-act="quizstart"' + (cd > 0 ? ' disabled' : '') + '>' +
            (cd > 0 ? 'The teacher rests (' + cd + 's)' : 'Ask me one (+' +
              ((G.tech.script ? T.quizFarPay : T.quizPay) * (G.tech.press ? 2 : 1)) + ' 📜)') + '</button>') };
    }
    function callQuest(id) {
      var s2 = byId[id], qq2 = G.quests[id];
      var h2 = '<p>' + esc(questText(qq2, s2)) + '</p>';
      if (qq2.kind === 'carry') {
        h2 += '<button class="sab-btn go" data-sab-act="qcarry"' +
          (connected(id) && G.res.kala >= T.eventAsk ? '' : ' disabled') + '>Bring it in (' + T.eventAsk + ' 🛠️)</button>' +
          (!connected(id) ? '<p class="tiny" style="color:var(--muted);margin:8px 0 0">It needs a road into the city first.</p>' : '');
      } else if (qq2.kind === 'utsav') {
        h2 += '<button class="sab-btn go" data-sab-act="qutsav"' +
          (G.utsav <= 0 && G.res.anna >= utsavCost().anna && G.res.kala >= utsavCost().kala ? '' : ' disabled') +
          '>Hold the utsav here (' + utsavCost().anna + ' 🌾 + ' + utsavCost().kala + ' 🛠️)</button>';
      } else if (qq2.kind === 'riddle') {
        h2 += riddleOptions(s2).map(function (o) {
          return '<button class="sab-btn" style="display:block;width:100%;text-align:left;margin:6px 0" ' +
            'data-sab-act="qriddle" data-o="' + esc(o) + '">' + esc(o) + '</button>';
        }).join('') + (riddleWrong ? '<p class="tiny" style="color:var(--muted)">Not that one — the city’s own telling has it. Another go.</p>' : '');
      } else {
        h2 += '<p class="tiny" style="color:var(--muted)">This one is done out on the map — the scroll will close itself.</p>';
      }
      return { t: esc(FOLK[s2.kind]) + ' asks', h: h2 };
    }
    /* The city's own turn strip: what you have, and the year. Deliberately the same
       markup and the same handler as the bar's - a second Agla Saal that behaved even
       slightly differently from the first would be a worse bug than not having one. */
    function cityTurnBar() {
      var waiting = decisionList().length;
      return '<div class="sab-cityturn">' +
        '<div class="sab-res sab-cityres">' + ['anna', 'kala', 'katha'].map(function (k) {
          return '<span class="sab-chip">' + ICON[k] + ' ' + Math.floor(G.res[k]) + '</span>';
        }).join('') + '</div>' +
        '<button class="sab-act txt go" data-sab-act="turn"' + (G.won || overlay ? ' disabled' : '') +
        ' aria-label="Spend a year, without leaving this city">' +
        '<span class="lbl">Agla Saal \u25b8' + (waiting ? '<em>' + waiting + ' waiting</em>' : '') +
        '</span></button></div>';
    }

    /* WHAT THE CITY IS FAMOUS FOR — its three works and the monument. */
    function callWorks(id) {
      var s2 = byId[id], q2 = G.sites[id];
      var mc = costOf(T.monCost[s2.era], 'monument');
      return { t: 'what this city is for',
        h: '<div class="sab-mile">' +
          (s2.works || []).slice(0, 2).map(function (w2, i2) {
            return '<span class="mch' + (q2.lv > i2 ? ' done' : (q2.lv === i2 ? ' next' : '')) + '">' +
              (q2.lv > i2 ? '✓ ' : '') + esc(w2) + '</span>';
          }).join('') +
          '<span class="mch' + (q2.mon ? ' star' : (q2.lv >= 3 ? ' next' : '')) + '">★ ' +
          esc(s2.works[2]) + '</span></div>' +
          (q2.mon
            ? '<p class="tiny" style="color:var(--muted)">The monument stands — +2 📜 every turn, and the mist can never touch this town.</p>'
            : q2.lv >= 3
              ? '<p>The city is big enough. Raise it on the scaffolding out there, or here:</p>' +
                '<button class="sab-btn go" data-sab-act="mon"' + (canPay(mc) ? '' : ' disabled') +
                '>Build the monument (' + costStr(mc) + ')</button>'
              : '<p class="tiny" style="color:var(--muted)">A level-3 city may raise its monument. Grow first.</p>') };
    }
    /* THE CITY'S OWN TELLING — the facts, and the whisper that hides a treasure. */
    function callAbout(id) {
      var s2 = byId[id], q2 = G.sites[id];
      if (!q2.seen) return { t: esc(nameOf(s2)), h: '<p class="tiny" style="color:var(--muted)">Nobody has walked here yet.</p>' };
      var trez = (DATA.treasures || {})[id];
      return { t: esc(nameOf(s2)),
        h: (W.IND_CITY_PHOTO_HTML ? W.IND_CITY_PHOTO_HTML(id) : '') +
          '<div class="sab-cfact">' + esc(s2.fact) + '</div>' +
          (s2.more || []).map(function (mf) { return '<div class="sab-cfact">' + esc(mf) + '</div>'; }).join('') +
          (trez && !(q2.tre && q2.tre.got)
            ? '<div class="sab-treshint">🔍 ' + esc(FOLK[s2.kind]) + ' whispers: “' +
              esc(trez.hint) + '”</div>' : '') +
          (q2.mon ? '' : '<p class="tiny" style="color:var(--muted)">The city as it could be — raise the monument, ' +
            'the scaffolding comes down, and the colours come back.</p>') };
    }
    /* Which of them are waiting, cheaply — the bell only needs to count.

       SAY WHAT THE ROW DOES, in the words a child would use. The first go at
       this named each one the way the game's own voice names it — "the master
       builder asks", "what this city is for", "its telling" — and a list of
       three of those is a riddle, not a menu: nothing tells you what happens
       if you press one. A row is a door; label it with the room. */
    function callList(id) {
      var q2 = G.sites[id], s2 = byId[id], nm2 = esc(nameOf(s2)), out = [];
      if (G.quests[id])
        out.push({ k: 'quest', t: 'Answer a question', s: 'from ' + esc(FOLK[s2.kind]),
                   i: 'scroll', hot: true });
      if (inDispute(id))
        out.push({ k: 'quarrel', t: 'Settle a quarrel', s: 'the road is shut until you do',
                   i: 'peace', hot: true });
      if (q2.hero && !q2.hero.gone && !q2.hero.used)
        out.push({ k: 'hero', t: 'Meet ' + esc(DATA.heroes[s2.kind].name),
                   s: esc(DATA.heroes[s2.kind].gift), i: 'crown', hot: true });
      if (q2.bld.gurukul) {
        var cd2 = (G.quizAt[id] || -999) + T.quizCd - G.t;
        out.push({ k: 'guru', t: 'Ask the teacher',
                   s: cd2 > 0 ? 'resting for ' + cd2 + 's' : 'earn \ud83d\udcdc by answering',
                   i: 'scroll', hot: !!(quiz && quiz.at === id) || cd2 <= 0 });
      }
      out.push({ k: 'works', t: 'What ' + nm2 + ' is famous for',
                 s: 'its three great works', i: 'hammer', hot: false });
      out.push({ k: 'about', t: 'About ' + nm2,
                 s: 'what really happened here', i: 'road', hot: false });
      return out;
    }
    function callCard(id, k) {
      if (k === 'hero') return callHero(id);
      if (k === 'quarrel') return callQuarrel(id);
      if (k === 'guru') return callGuru(id);
      if (k === 'quest') return callQuest(id);
      if (k === 'works') return callWorks(id);
      return callAbout(id);
    }
    var openCall = null;   /* the call on screen, so acting on it redraws it */
    /* WHAT WENT WRONG, WHERE IT WENT WRONG.
       A row that does nothing is the worst thing this list can do, and the way
       it happens is a handler throwing halfway: the panel stays open, the card
       never appears, and nothing anywhere says so. Anything thrown while
       opening a card is caught, written to the diagnostics ring a parent can
       copy, and shown IN the panel where the finger already is. */
    var callErr = '';
    function callTrouble(where, err) {
      callErr = where + ': ' + ((err && err.message) || err || 'something went wrong');
      try { if (W.IND_DIAG && W.IND_DIAG.push) W.IND_DIAG.push('city', callErr); } catch (e3) {}
    }
    /* A ROW ANSWERS THE TAP ITSELF.
       Everything else in this game is driven by one delegated click on the
       host, and everywhere else that is fine. These rows are reported dead on
       a real device while every headless engine I have here says they are
       pressed and answered — so the click is going missing somewhere I cannot
       see. Rather than keep guessing at which engine and which property, the
       rows take pointerdown and pointerup themselves: press on the row, lift
       on the same row, and it opens. The click that may or may not follow is
       ignored, so it can never open twice. */
    var callDown = null, callTapAt = 0;
    /* Anything that answers a call — a riddle option, a peace offer, a quiz —
       has to leave the card showing the ANSWER rather than the question it
       just replaced. Called by those actions once the state has moved. */
    function refreshCall() {
      if (!openCall || !city || !G.callAt) return;
      var still = callList(openCall.id).some(function (c) { return c.k === openCall.k; });
      if (!still) { G.callAt = null; openCall = null; }
    }
    /* THE CARD OPENS WHERE THE LIST WAS.
       It used to be raised as a modal over the whole screen, which put the
       overlay host, its z-index and its stacking context between a child's
       finger and the answer — three things that can each go wrong on an engine
       I cannot test here, and the failure looks identical to a dead button.
       The panel is already on screen and already works: the card takes its
       place, with a way back to the list. Nothing new has to render for it. */
    function showCall(id, k) {
      callErr = '';
      openCall = { id: id, k: k };
      G.callAt = k;
      G.callsOpen = false;
    }
    /* THE BELL. Hidden work, visibly counted: how many things in this city are
       waiting on the child, and one tap to see them. */
    function kitCalls(id) {
      var list = callList(id);
      var hot = list.filter(function (c) { return c.hot; }).length;
      var open2 = !!G.callsOpen;
      var at = G.callAt, card = null;
      if (at) {
        /* the card, built where it is shown — and if building it throws, the
           panel says so instead of the tap seeming to do nothing at all */
        try { card = callCard(id, at); }
        catch (e4) { callTrouble('opening ' + at, e4); card = null; }
      }
      var bell = '<button class="sab-bell' + (hot ? ' hot' : '') + '" data-sab-act="calls"' +
        ' aria-expanded="' + (open2 || !!at) + '" aria-label="' +
        (hot ? hot + ' thing' + (hot > 1 ? 's' : '') + ' in this city are waiting on you'
             : 'Things to do in this city') +
        '">\u2630' + (hot ? '<u>' + hot + '</u>' : '') + '</button>';

      if (at) {
        return bell + '<div class="sab-calllist iscard" role="group" aria-label="' +
          esc(nameOf(byId[id])) + '">' +
          '<button class="sab-callback" data-sab-act="callback">\u2190 things to do</button>' +
          (card
            ? '<h4 class="sab-cardtitle">' + card.t + '</h4>' +
              '<div class="sab-cardbody">' + card.h + '</div>'
            : '<div class="sab-cardbody"><p>Sorry — this one would not open.</p>' +
              '<p class="tiny" style="opacity:.7">' + esc(callErr) + '</p>' +
              '<p class="tiny" style="opacity:.7">A grown-up can copy this from ' +
              'Me \u2192 Grown-ups and send it on.</p></div>') +
          '</div>';
      }
      return bell +
        (open2 ? '<div class="sab-calllist" role="group" aria-label="Things to do in ' +
          esc(nameOf(byId[id])) + '">' +
          '<div class="sab-callhead">Things to do here</div>' +
          list.map(function (c) {
            return '<button class="sab-callrow' + (c.hot ? ' hot' : '') +
              '" data-sab-act="call" data-c="' + c.k + '">' +
              '<span class="ic">' + ic(c.i, 18) + '</span>' +
              '<span class="tx"><b>' + c.t + '</b><i>' + c.s + '</i></span>' +
              (c.hot ? '<em>\u25cf</em>' : '') + '<span class="go">\u203a</span></button>';
          }).join('') + '</div>' : '');
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
    /* what waking THIS place costs, which is no longer one number for the whole map */
    function wakeCost(id) {
      var q = G.sites[id] || {};
      /* with nothing else awake there is nowhere to earn katha, so the first city,
         the one way back, asks nothing — never destroyed, always recoverable (docs/16) */
      if (id === FIRST && !SITES.some(function (x) {
        return x.id !== FIRST && inEra(x) && awake(x.id) && !isHer(x.id); })) return 0;
      return Math.round(T.wakeCost * (1 + (q.deep || 0) * 0.4));
    }
    function costOf(c, kind) {
      var f = 1;
      if (kind === 'building' && G.tech.brick) f = 2 / 3;
      if (kind === 'monument' && G.tech.temple) f = 2 / 3;
      if (kind === 'route' && G.tech.roads) f = 1 / 2;
      if (kind === 'route' && G.tech.railway) f = f / 2;     /* iron roads stack */
      if (kind === 'utsav' && G.tech.chahbagh) f = 1 / 2;    /* the town is already outdoors */
      /* and what the realm has decided to be — the other half of polEff's promise */
      if (kind === 'route' && polEff('routeCut')) f *= polEff('routeCut');
      if (kind === 'utsav' && polEff('utsavCut')) f *= polEff('utsavCut');
      var out = {};
      Object.keys(c).forEach(function (k) { out[k] = Math.ceil(c[k] * f); });
      return out;
    }
    function canPay(c) { return Object.keys(c).every(function (k) { return G.res[k] >= c[k]; }); }
    /* EVERY SPEND THE PLAYER MAKES MEETS HERE, and that had to be made true before
       undo could work: six of them used to reach into G.res directly — grow, wake,
       utsav, explore, the era advance and the quest cart — so an undo hooked here
       would silently have covered half the game. One door for money leaving is worth
       having on its own; it is also the only place a snapshot belongs.

       The world's own appetite (the per-turn eating in tick) deliberately does NOT
       come through here: the mist and the granary are not purchases, and nothing that
       happens to the player may ever be undone by them. */
    function pay(c) {
      undoPoint();
      Object.keys(c).forEach(function (k) { G.res[k] -= c[k]; });
    }
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
      /* `away` and `came` are migration's ledger: pop is otherwise derived from the
         level and the board, so people leaving had nowhere to be recorded. */
      return Math.max(2, 2 + q.lv * 2 + (q.bld.granary ? 1 : 0) +
             (kitOn(id) ? kitPop(id) : 0) - (q.away || 0) + (q.came || 0));
    }
    /* default split, and the top-up rule when the town grows: new hands farm first —
       which is also the deadlock guarantee: kisan exist from the first minute */
    function jobsOf(id) {
      var q = G.sites[id], x = byId[id], pop = popOf(id);
      if (!q.jobs) {
        q.jobs = { kisan: 2, karigar: 0, kathakar: 1, rakshak: 0 };
        q.jobs[JOB_OF_KIND[x.kind]] += pop - 3 > 0 ? 1 : 0;
      }
      /* a save written before a role existed has no count for it */
      JOB_IDS.forEach(function (j2) { if (typeof q.jobs[j2] !== 'number') q.jobs[j2] = 0; });
      var total = 0;
      JOB_IDS.forEach(function (j2) { total += q.jobs[j2]; });
      if (total < pop) { q.jobs.kisan += pop - total; total = pop; }  /* newcomers farm */
      while (total > pop) {                                   /* shrink fairly */
        var big = JOB_IDS.slice().sort(function (a, b) { return q.jobs[b] - q.jobs[a]; })[0];
        q.jobs[big]--; total--;
      }
      return q.jobs;
    }
    /* ==================================================================
       MIGRATION — pressure without a border
       ==================================================================
       The genre's version of this flips cities between empires when one side's culture
       outweighs the other's, and it is the one mechanic here that could not be ported
       as it stands: it is territory changing hands, drawn on a map, which CLAUDE.md
       forbids outright. What is worth keeping is the PRESSURE -- that a place nobody
       tends loses its people to a place somebody does.

       So it runs on this game's own fiction instead of on food. A dusty or fading town
       loses a pair of hands to a thriving town its own road reaches. Nothing is
       conquered, nothing changes colour, nobody is shamed: somebody walks down a road
       that already exists, toward the town that is being looked after. And it reverses
       the moment the neglected town is tended again, because `away` is a ledger and not
       a wound. */
    function migrate() {
      var leaving = null, going = null;
      SITES.forEach(function (x) {
        if (!inEra(x) || !awake(x.id)) return;
        var q = G.sites[x.id];
        if (q.her) return;
        var sad = dusty(x.id) || q.fade >= 0;
        if (sad && popOf(x.id) > 2 && !leaving) leaving = x.id;
      });
      if (!leaving) return;
      /* somewhere its own road actually goes */
      var near = reach(leaving) || [];
      near.forEach(function (id) {
        if (going || id === leaving) return;
        var q2 = G.sites[id];
        if (!awake(id) || q2.her || dusty(id) || q2.fade >= 0) return;
        going = id;
      });
      if (!going) return;
      var ql = G.sites[leaving], qg = G.sites[going];
      ql.away = (ql.away || 0) + 1;
      qg.came = (qg.came || 0) + 1;
      ql.jobs = null; qg.jobs = null;          /* re-split both crews */
      say('A family walks from ' + nameOf(byId[leaving]) + ' to ' + nameOf(byId[going]) +
          ' — tend a town and its people stay.', 'mist');
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
    /* ==================================================================
       WHY IS IT SEVEN? — the yield, itemised
       ==================================================================
       Every rule in this game meets in yieldOf, and a child was shown only its answer.
       A number with no derivation cannot be played to: you cannot tell whether the road
       or the granary or the plough did that, so you cannot decide what to do next, and
       the whole system stays a black box that hands out coins. The genre's answer is a
       tooltip that takes the number apart, and it is most of how players ever learn how
       any of it works.

       The ledger is filled by the SAME PASS that computes the total — a second function
       that explained the first would drift from it, and an explanation that disagrees
       with the payout teaches the wrong rule with perfect confidence. */
    function yieldOf(x, led) {
      var note = led ? function (k, n, why) {
        if (!n) return;
        led.push({ k: k, n: n, why: why });
      } : function () {};
      var q = G.sites[x.id];
      /* a heritage city asks nothing and gives one thing: its monument keeps
         telling its story. Stone remembers — that rule outlives the city. */
      if (q.her) return q.mon ? { anna: 0, kala: 0, katha: 1 } : null;
      if (q.zzz || q.fade >= 0) return null;
      var conn = connected(x.id) && !inDispute(x.id);
      var out = { anna: 0, kala: 0, katha: 0 };
      var j = jobsOf(x.id), spec = JOB_OF_KIND[x.kind];
      var kA = j.kisan * (spec === 'kisan' ? 2 : 1);
      var kB = j.karigar * (spec === 'karigar' ? 2 : 1);
      var kC = j.kathakar * (spec === 'kathakar' ? 2 : 1);
      out.anna += kA; out.kala += kB; out.katha += kC;
      note('anna', kA, j.kisan + ' kisan' + (spec === 'kisan' ? ' \u00d72, this city\u2019s own trade' : ''));
      note('kala', kB, j.karigar + ' karigar' + (spec === 'karigar' ? ' \u00d72, this city\u2019s own trade' : ''));
      note('katha', kC, j.kathakar + ' kathakar' + (spec === 'kathakar' ? ' \u00d72, this city\u2019s own trade' : ''));
      if (conn) ['anna', 'kala', 'katha'].forEach(function (k) {
        if (out[k]) { out[k] += 1; note(k, 1, 'on a road'); }
      });
      /* WHAT THE CITY ITSELF MAKES is above this line; everything below is a BONUS
         stacked on top, and those are what ran away. They are gathered and softened
         together so no single one has to be nerfed and the city's own hands always
         pay in full. */
      var st = { anna: 0, kala: 0, katha: 0 };
      if (q.hero && !q.hero.gone) st[YIELD[x.kind]] += 2;
      if (inKingdomOf(x.id)) { st.anna += 1; st.kala += 1; st.katha += 1; }
      /* what was BUILT on the board pays out too — a wheat field is not
         scenery, it is one more 🌾 every turn for as long as it is sown */
      if (kitOn(x.id)) {
        var ky = kitYield(x.id);
        out.anna += ky.anna; out.kala += ky.kala; out.katha += ky.katha;
        var adjp = adjTotal(x.id);
        note('anna', ky.anna - adjp.anna, 'what is built here');
        note('kala', ky.kala - adjp.kala, 'what is built here');
        note('katha', ky.katha - adjp.katha, 'what is built here');
        note('anna', adjp.anna, 'how it is arranged');
        note('kala', adjp.kala, 'how it is arranged');
        note('katha', adjp.katha, 'how it is arranged');
      }
      /* THE RIVER FEEDS THE TOWN BESIDE IT — terrain, not territory */
      out.anna += riverAnna(x.id); note('anna', riverAnna(x.id), 'on the ' + (onRiver(x.id) || 'river'));
      /* WHAT THE REALM HAS DECIDED TO BE. Every policy effect is read here or in
         costOf, so a card can never be a promise nothing keeps. */
      if (polEff('annaKind') === x.kind) out.anna += 1;
      if (polEff('kalaKind') === x.kind) out.kala += 1;
      if (polEff('katha')) out.katha += polEff('katha');
      if (conn && polEff('kathaRouted')) out.katha += polEff('kathaRouted');
      if (conn && dedEff('pilgrimage')) out.katha += 1;    /* the age dedicated to walking */
      if (conn && polEff('kalaRouted')) out.kala += polEff('kalaRouted');
      if (conn && polEff('port') && PORTS.indexOf(x.id) >= 0) {
        var pb = polEff('port');
        out.anna += pb; out.kala += pb; out.katha += pb;
      }
      if (polEff('kingdom') && inKingdomOf(x.id)) {
        out.anna += polEff('kingdom'); out.katha += polEff('kingdom');
      }
      if (q.bld.granary) { out.anna += 1; note('anna', 1, 'the granary'); }
      if (q.bld.workshop) { out.kala += 1; note('kala', 1, 'the workshop'); }
      if (q.bld.gurukul) { out.katha += 1; note('katha', 1, 'the gurukul'); }
      if (q.bld.bazaar && conn) { st.anna += 1; st.kala += 1; st.katha += 1; }
      if (G.tech.plough && x.kind === 'kheti') out.anna += 1;
      if (G.tech.iron && x.kind === 'shilpa') out.kala += 1;
      if (G.tech.zero && x.kind === 'vidya') out.katha += 1;
      if (G.tech.monsoon && conn && PORTS.indexOf(x.id) >= 0) { out.anna += 2; out.kala += 2; out.katha += 2; }
      /* the later ladder's doors */
      if (G.tech.paper && x.kind === 'vidya') out.katha += 1;
      if (G.tech.charkha && x.kind === 'shilpa') out.kala += 1;
      if (G.tech.ship && conn && PORTS.indexOf(x.id) >= 0) { out.anna += 1; out.kala += 1; out.katha += 1; }
      if (G.tech.harit && x.kind === 'kheti') out.anna += 2;
      /* the stacked bonuses, softened once they run away */
      out.anna += soften(st.anna); out.kala += soften(st.kala); out.katha += soften(st.katha);
      note('anna', soften(st.anna), 'the hero, the crown and the bazaar' + (st.anna > 4 ? ' (softened)' : ''));
      note('kala', soften(st.kala), 'the hero, the crown and the bazaar' + (st.kala > 4 ? ' (softened)' : ''));
      note('katha', soften(st.katha), 'the hero, the crown and the bazaar' + (st.katha > 4 ? ' (softened)' : ''));
      /* A REALM SHORT OF VARIETY IS RESTLESS, and a restless town works slower. Never
         a punishment that cannot be undone: reach somewhere unlike home and it lifts. */
      if (restless()) {
        var rf = Math.max(0.5, 1 - restless() * 0.15);
        note('anna', -(out.anna - Math.floor(out.anna * rf)), 'restless \u2014 short of ' + restless() + ' kinds of thing');
        note('kala', -(out.kala - Math.floor(out.kala * rf)), 'restless');
        note('katha', -(out.katha - Math.floor(out.katha * rf)), 'restless');
        out.anna = Math.floor(out.anna * rf); out.kala = Math.floor(out.kala * rf);
        out.katha = Math.floor(out.katha * rf);
      }
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
      /* "enter the city" only ever names a city that can be entered: a sleeping one cannot */
      var hero1 = SITES.filter(function (x) { var q2 = G.sites[x.id]; return inEra(x) && awake(x.id) && q2.hero && !q2.hero.used && !q2.hero.gone; })[0];
      if (hero1) return 'A great one waits in <b>' + esc(hero1.name) + '</b> — enter the city and ask for the deed.';
      var qid = Object.keys(G.quests).filter(function (id) { return awake(id); })[0];
      if (qid) return 'A scroll waits at <b>' + esc(byId[qid].name) + '</b> — enter the city and take the quest.';
      var hid2 = hiddenSites();
      /* an explorer leaves from an awake city — never send a child to do it from a sleeping one */
      if (hid2.length && !G.explorers.length &&
          SITES.some(function (x) { return inEra(x) && awake(x.id) && !isHer(x.id); }))
        return 'Somewhere out in the mist lies <b>' + (hid2.length === 1 ? 'one more place' : 'more of India') +
          '</b> — select a city and send an explorer (' + T.exploreCost + ' \ud83c\udf3e).';
      if (G.explorers.length) return 'Your explorer is out walking the mist — the fog opens where the lamp goes.';
      var zz = SITES.filter(function (x) { return onMap(x) && !awake(x.id); })[0];
      if (zz) {
        if (needsRoad(zz.id)) return 'Build a road toward <b>' + esc(zz.name) + '</b> — it sleeps under the mist.';
        if (G.res.katha >= wakeCost(zz.id)) return '<b>' + esc(zz.name) + '</b> ' + (connected(zz.id) ? 'is reached' : 'needs no road') +
          ' — wake it (' + (wakeCost(zz.id) ? wakeCost(zz.id) + ' \ud83d\udcdc' : 'free') + ').';
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

    function say(t, cls) {
      if (t) digest(t); feed = t; feedCls = cls || ''; paintFeed(); }

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
      /* A NAME IS THE SAME SIZE WHEREVER YOU ARE STANDING.
         The label was 24 SVG user units, and the board zooms by shrinking its viewBox
         — so leaning in blew every name up with the land under it. At the framing the
         game used to open on, "Dholavira" rendered sixty pixels tall, "Pataliputra"
         ran off the right edge, and Kashi sat on top of it. Nothing about that is a
         legibility choice; it is a unit mistake.

         The name now hangs in its own group, translated to the dot and scaled by the
         inverse of the zoom, so BOTH the type size and its distance from the lamp are
         constant on screen. The offsets below are therefore in screen units. */
      var lab = s.lab || 'n', ox = 0, oy = -r - 14, anc = 'middle';
      if (lab === 's') { oy = r + 30; }
      if (lab === 'e') { ox = r + 10; oy = 8; anc = 'start'; }
      if (lab === 'w') { ox = -r - 10; oy = 8; anc = 'end'; }
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
        '<g class="sab-lab" transform="translate(' + s.x + ',' + s.y + ')">' +
        '<text x="' + ox + '" y="' + oy + '" text-anchor="' + anc + '">' + esc(s.name) + '</text></g>' +
        '</g>';
    }
    function routeSVG(r, i) {
      var a = byId[r[0]], b = byId[r[1]];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 24;   /* a gentle bow, like a road, not a wire */
      var d = 'M' + a.x + ' ' + a.y + ' Q' + mx + ' ' + my + ' ' + b.x + ' ' + b.y;
      /* A ROAD THAT IS CARRYING SOMETHING LOOKS LIKE IT.
         Carts already roll every route — the founder's note above ensureCarts is right
         that a cart on a route IS the meaning of a route. What was invisible was the
         REQUEST: a partner asking for the workshops of the south told the player
         nothing about which of their own roads mattered this season. The road that
         reaches an asked-for good now carries a warm thread, so the ask is a thing you
         can see on the map instead of a line of text in a panel. */
      var asked = '';
      var wants = {};
      Object.keys(G.req || {}).forEach(function (pid) { wants[G.req[pid].want] = 1; });
      if (wants[goodOf(r[0])] || wants[goodOf(r[1])]) asked = ' asked';
      return '<path class="sab-bed" d="' + d + '"/><path class="sab-route live' + asked +
        '" id="sabr-' + i + '" d="' + d + '"/>';
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
        '<mask id="sabfog"><rect x="-3000" y="-3000" width="7000" height="7100" fill="#fff"/>' +
        '<g id="sab-fogholes"></g></mask>' +
        '<rect id="sab-fogrect" x="-3000" y="-3000" width="7000" height="7100" fill="#8d93a5" opacity=".62" ' +
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
    /* THE GAME WINDOW (CSS: "THE GAME WINDOW"). On a wide landscape screen the board is
       the whole window and the HUD floats on it in two side columns and a top strip. The
       window then takes the stage's own shape at every zoom level, and what it FITS is
       not the stage but the clear ground between the columns — so at the opening view
       no panel lies on the country. */
    /* THE PHONE IS A GAME WINDOW TOO (CSS: "THE PHONE"). Below the landscape desktop the
       game used to be a page: header, title card, a two-row HUD, and a map in what was
       left. Selecting a city inserted its card ABOVE the map, the map dropped 260px, and
       the second tap of the double tap landed on empty country — on a phone a city could
       not be entered at all. Now every screen gets the whole window; `gm` is the phone's
       arrangement of it, the HUD a column at the top and a dock at the bottom. */
    var gw = false, gm = false, GW_TOP = 66, GW_BOT = 24;
    function gwSide() { return Math.round(Math.max(220, Math.min(310, (W.innerWidth || 1200) * 0.21))); }
    function gwSet() {
      var wrapEl = D.getElementById('sabwrap');
      if (!wrapEl) return;
      var iw = W.innerWidth || 0, ih = W.innerHeight || 1;
      gw = !dead;
      gm = gw && !(iw >= 900 && iw / ih >= 1.15);
      wrapEl.classList.toggle('gw', gw);
      wrapEl.classList.toggle('gm', gm);
      D.body.classList.toggle('sab-mapfull', gw);
      var P = gwSide();
      wrapEl.style.setProperty('--gw-p', P + 'px');
      wrapEl.style.setProperty('--gw-w', (P - 20) + 'px');
    }
    /* THE CLEAR GROUND: the part of the window no panel covers. On a wide screen it is
       between the two columns and under the beam, fixed numbers. On a phone the top
       column grows and shrinks with what Mithu is saying, and the chosen place's sheet
       rises over the bottom of the map — so there it is measured, every time. */
    function gwIns() {
      if (!gm) { var P = gwSide(); return { l: P, r: P, t: GW_TOP, b: GW_BOT }; }
      var st = D.getElementById('sab-stage');
      if (!st) return { l: 10, r: 10, t: 150, b: 90 };
      var sr = st.getBoundingClientRect(), top = sr.top, bot = sr.bottom;
      var sd = D.querySelector('#sabwrap .sab-side');
      if (sd) top = Math.max(top, sd.getBoundingClientRect().bottom);
      ['#sab-turn', '#sab-tabs', '#sab-sheet'].forEach(function (q) {
        var el = D.querySelector('#sabwrap ' + q);
        if (!el || el.hidden) return;
        var r = el.getBoundingClientRect();
        if (r.height) bot = Math.min(bot, r.top);
      });
      return { l: 10, r: 10, t: Math.max(0, top - sr.top) + 8, b: Math.max(0, sr.bottom - bot) + 8 };
    }
    function gwFit(b) {
      var st1 = D.getElementById('sab-stage');
      var Wd = st1 ? st1.clientWidth : 0, Ht = st1 ? st1.clientHeight : 0;
      if (!Wd || !Ht) return;
      var I = gwIns(), aw = Math.max(160, Wd - I.l - I.r), ah = Math.max(160, Ht - I.t - I.b);
      var s = Math.min(aw / (b.x1 - b.x0), ah / (b.y1 - b.y0));
      VZ.w = Wd / s; VZ.h = Ht / s;
      VZ.x = (b.x0 + b.x1) / 2 - (I.l + aw / 2) / s;
      VZ.y = (b.y0 + b.y1) / 2 - (I.t + ah / 2) / s;
      /* said where a check can read it: the ground the map was fitted to */
      var wr = D.getElementById('sabwrap');
      if (wr) ['l', 'r', 't', 'b'].forEach(function (k) { wr.style.setProperty('--gw-' + k, Math.round(I[k]) + 'px'); });
    }
    function gwZoom(at) {
      if (zlevel === 2) { gwFit({ x0: 0, y0: 0, x1: 1000, y1: 1100 }); return; }
      var b = revealedBox(), cx, cy, r;
      if (zlevel === 0) {
        cx = at ? at.x : VZ.x + VZ.w / 2; cy = at ? at.y : VZ.y + VZ.h / 2; r = 150;
      } else {
        /* never closer than a region is: one lamp in the Rann is not a view of India */
        cx = (b.x0 + b.x1) / 2; cy = (b.y0 + b.y1) / 2;
        r = Math.max(260, (b.x1 - b.x0) / 2, (b.y1 - b.y0) / 2);
        gwFit({ x0: cx - Math.max(260, (b.x1 - b.x0) / 2), y0: cy - Math.max(260, (b.y1 - b.y0) / 2),
                x1: cx + Math.max(260, (b.x1 - b.x0) / 2), y1: cy + Math.max(260, (b.y1 - b.y0) / 2) });
        return;
      }
      gwFit({ x0: cx - r, y0: cy - r, x1: cx + r, y1: cy + r });
    }
    function vasp() {
      if (gw) {
        var stg = D.getElementById('sab-stage');
        return stg && stg.clientWidth ? stg.clientHeight / stg.clientWidth : 0.6;
      }
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
      if (gw) { gwZoom(at); vzClamp(); vzApply(); return; }
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
    /* THE MAP OPENS ON THE MAP. It used to open at zlevel 1, framed on the handful of
       places found so far — which in the first age is one city in the Rann and reads as
       a picture of Gujarat rather than a game about India. A child cannot plan a road to
       somewhere they cannot see. Region framing still follows discoveries; it just no
       longer starts by throwing the country away. */
    function fitFound(force) {
      if (force || zlevel === 1) zoomTo(1);
    }
    function openFraming() {
      var b = revealedBox();
      zoomTo((b.x1 - b.x0) > 520 ? 1 : 2);
    }
    var rsTm = null;
    function onResize() {
      clearTimeout(rsTm);
      rsTm = setTimeout(function () {
        if (dead) return;
        var was = gw, wasM = gm; gwSet();
        if (was !== gw || wasM !== gm) zoomTo(zlevel); else { vzClamp(); vzApply(); }
      }, 200);
    }
    W.addEventListener('resize', onResize);
    var panning = null, swallowClick = false;
    /* THE INVERSE OF THE ZOOM — MEASURED, NOT ASSUMED.
       The first cut used VZ.w / 1000, which is the right answer only when the board is
       width-constrained. It is not: the map is 1000x1100 in a frame far wider than it
       is tall, so preserveAspectRatio fits it by HEIGHT and the pixels-per-unit come
       off VZ.h. Dividing by the wrong axis left the names still growing as you leaned
       in — 18px out, 48px in — with a scale attribute on every one of them that looked
       exactly right.

       So ask the element. `meet` scales by whichever axis binds, and the ratio between
       what binds now and what bound at the full view IS the number wanted, whatever
       shape the frame happens to be. */
    function labScale() {
      var svg = D.querySelector('#sab-stage svg');
      if (!svg) return 1;
      var r = svg.getBoundingClientRect();
      if (!r.width || !r.height || !VZ.w || !VZ.h) return 1;
      var now = Math.min(r.width / VZ.w, r.height / VZ.h);
      var full = Math.min(r.width / 1000, r.height / 1100);
      if (!now || !full) return 1;
      /* CLAMPED AT THE TOP ONLY. The floor was 0.28 and it was the whole reason the
         names still grew: leaned right in, constant size wants 0.127, so the floor was
         holding every label at twice the size it should be — a limit put there to stop
         a name dwarfing the country, which is a risk at the far-OUT end and nowhere
         near the far-in one. The ceiling is the one that does that job. */
      return Math.max(0.08, Math.min(1.15, full / now));
    }
    /* AND NAMES THIN OUT WHEN THEY WOULD PILE UP — measured, not guessed at.
       The first cut hid names by whether the place was awake, which does nothing about
       the case that actually happens: Kashi and Pataliputra are twenty units apart and
       both awake, so both names drew, on top of each other. History clusters, and no
       amount of per-site label DIRECTION fixes two names wanting the same pixels.

       So the boxes are measured on screen and a name that would land on one already
       placed simply does not draw. Rank decides who wins, and the ranking is what the
       player is thinking about: the one you selected, then the one being warned about,
       then awake places, then the rest. A name is never shortened or shrunk to fit —
       a half-legible label is worse than the lamp on its own, and the lamp is always
       still there to tap. */
    function applyLabels() {
      var k = labScale(), i, g = D.querySelectorAll('#sab-sites .sab-lab');
      var items = [];
      for (i = 0; i < g.length; i++) {
        var host2 = g[i].parentNode, id2 = host2 && host2.getAttribute('data-sab');
        var s2 = id2 && byId[id2];
        if (!s2) continue;
        g[i].setAttribute('transform', 'translate(' + s2.x + ',' + s2.y + ') scale(' + k.toFixed(3) + ')');
        g[i].style.display = '';                    /* measure them all shown */
        var vis = onMap(s2) && getComputedStyle(host2).display !== 'none';
        var rank = !vis ? 9
                 : sel === id2 ? 0
                 : (G.warn && G.warn.id === id2) ? 1
                 : awake(id2) ? 2 : 3;
        items.push({ g: g[i], rank: rank, vis: vis });
      }
      items.sort(function (a, b) { return a.rank - b.rank; });
      var placed = [];
      items.forEach(function (it) {
        if (!it.vis) { it.g.style.display = 'none'; return; }
        var r = it.g.getBoundingClientRect();
        if (!r.width) { it.g.style.display = 'none'; return; }
        var clash = placed.some(function (o) {
          return !(o.right < r.left - 2 || o.left > r.right + 2 ||
                   o.bottom < r.top - 2 || o.top > r.bottom + 2);
        });
        if (clash) { it.g.style.display = 'none'; return; }
        placed.push(r);
      });
    }
    function vzApply() {
      var svg = D.querySelector('#sab-stage svg');
      if (svg) svg.setAttribute('viewBox', VZ.x.toFixed(1) + ' ' + VZ.y.toFixed(1) + ' ' + VZ.w.toFixed(1) + ' ' + VZ.h.toFixed(1));
      applyLabels();
    }
    function vzClamp() {
      VZ.h = VZ.w * vasp();
      if (gw) {
        /* the fence, measured against the clear ground: you can pan until the edge of
           what you have revealed reaches the edge of a column, and no further */
        var stc = D.getElementById('sab-stage');
        var Wc = stc ? stc.clientWidth : 0, Hc = stc ? stc.clientHeight : 0;
        if (!Wc || !Hc) return;
        var sc = Wc / VZ.w, Ic = gwIns();
        var bf = zlevel === 2 ? { x0: 0, y0: 0, x1: 1000, y1: 1100 } : revealedBox();
        var sl = Ic.l / sc, sr = (Wc - Ic.r) / sc, stp = Ic.t / sc, sbt = (Hc - Ic.b) / sc;
        if (sr - sl >= bf.x1 - bf.x0) VZ.x = (bf.x0 + bf.x1) / 2 - (sl + sr) / 2;
        else VZ.x = Math.max(bf.x0 - sl, Math.min(bf.x1 - sr, VZ.x));
        if (sbt - stp >= bf.y1 - bf.y0) VZ.y = (bf.y0 + bf.y1) / 2 - (stp + sbt) / 2;
        else VZ.y = Math.max(bf.y0 - stp, Math.min(bf.y1 - sbt, VZ.y));
        return;
      }
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
    /* A FINGER IS NOT A MOUSE. The drag used to be measured as the sum of every
       wobble, so a thumb resting on a lamp for a quarter-second "dragged" 9px and the
       tap was swallowed as a pan. It is the distance from where the finger landed now,
       and a finger is allowed more tremor than a mouse. */
    var lastPtr = 'mouse';
    function onPointerDown(e) {
      lastPtr = e.pointerType || 'mouse';
      var stage = D.getElementById('sab-stage');
      if (!stage || !stage.contains(e.target)) return;
      if (panning === null) panning = { id: e.pointerId, cx: e.clientX, cy: e.clientY,
                                        sx: e.clientX, sy: e.clientY, moved: 0,
                                        slop: lastPtr === 'mouse' ? 8 : 14 };
    }
    function onPointerMove(e) {
      if (!panning || e.pointerId !== panning.id) return;
      var svg = D.querySelector('#sab-stage svg'); if (!svg) return;
      var r = svg.getBoundingClientRect();
      var dx = (e.clientX - panning.cx) / r.width * VZ.w;
      var dy = (e.clientY - panning.cy) / r.height * VZ.h;
      panning.moved = Math.max(panning.moved, Math.abs(e.clientX - panning.sx) + Math.abs(e.clientY - panning.sy));
      panning.cx = e.clientX; panning.cy = e.clientY;
      if (panning.moved > panning.slop) {
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
        /* ==============================================================
           ONE STRIP, THEN THE MAP.
           ==============================================================
           The screenshots settled this. On a 390px phone the board was getting
           150 pixels of 1700 — NINE PER CENT of the screen — because everything
           above it stacked: era block, bead ribbon, four resource chips wrapping
           to two rows, a red warning, four buttons, four more buttons, Agla Saal
           on a line of its own, two rail rows and a progress bar. Five of those
           strips I added myself while fixing the systems, each one reasonable on
           its own, and together they pushed the game off the screen.

           A strategy game is its map. Everything that is not the map now lives on
           ONE line, or inside it, or behind a button — and the board takes every
           pixel that is left. The verbs that used to sit in the bar moved into the
           selection tray, where they were always more at home: they act on a place,
           and you have to have chosen a place for them to mean anything. */
        /* ONE COLUMN, ONE STICKY. On a wide screen every one of these sits beside the
           map, and the column is pinned as a unit. Pinning the bar alone looked right
           and was not: a sticky element's containing block is this wrapper, not its own
           grid row, so the bar slid down over the rail and the realm as the page
           scrolled -- the flow had no overlap at all, which is why only a screenshot
           showed it. display:contents dissolves this div on narrow screens, where the
           children go back to being the wrap's own flex items and `order` puts the bar
           above the map and everything else below it, exactly as before. */
        '<div class="sab-side">' +
        '<div class="sab-bar">' +
          /* the way out, for when the game is the whole window (it is hidden otherwise:
             the page's own back link is right above the board) */
          '<button class="sab-exit" data-act="go" data-v="mela" aria-label="Leave Sabhyata for the Mela">' +
            ic('back', 18) + '<span>Mela</span></button>' +
          '<div class="sab-era"><span id="sab-eradate"></span><b id="sab-eraname"></b></div>' +
          /* TIME WAS INVISIBLE. The era's dates were on screen and the turn was not,
             so nothing told a child the world had moved. Dates stay RANGES per
             docs/16 §3 — an interpolated single year would be a precision the
             evidence does not have — so the turn count carries the passing time. */
          '<div class="sab-era"><span>Turn</span><b id="sab-turnno">1</b></div>' +
          '<div class="sab-res" id="sab-res" aria-live="off"></div>' +
          /* THE WARNING USED TO BE SAID TWICE — a red chip here and the rail's own top
             row, the same sentence in two places on one screen. The rail keeps it,
             because the rail is where everything else that wants you already is. */
          '<span class="sab-gap"></span>' +
          /* THE THREE BOOKS, on the strip when there is room for them — Civ keeps its
             research and its civics one click away at the top, not under a menu */
          '<div class="sab-tabs" id="sab-tabs">' +
            '<button class="sab-tab" data-sab-act="tabtech" id="sab-tabtech" aria-pressed="false" aria-label="Vidya">' +
              ic('book', 18) + '<span>Vidya</span></button>' +
            '<button class="sab-tab" data-sab-act="world" aria-label="Sea roads">' + ic('anchor', 18) + '<span>Sea roads</span></button>' +
            '<button class="sab-tab" data-sab-act="digest" aria-label="Happenings">' + ic('list', 18) + '<span>Happenings</span></button>' +
          '</div>' +
          '<div class="sab-globals">' +
            '<button class="sab-act txt go" id="sab-adv" hidden></button>' +
            /* THE ONLY THREE THINGS THAT EARN A PLACE ON THE LINE: what needs you,
               what is behind you, and the turn. Everything else is one tap away
               under the menu, which is what a menu is for. */
            '<button class="sab-act sq" id="sab-next" aria-label="The next thing that needs you">' + ic('next', 22) + '</button>' +
            '<button class="sab-ages" id="sab-ages" data-sab-act="timeline" aria-label="The ages behind you"></button>' +
            '<button class="sab-act sq" id="sab-menu" aria-expanded="false" aria-label="More">' + ic('menu', 20) + '</button>' +
            '<button class="sab-act txt go" id="sab-turn"></button>' +
          '</div>' +
          /* the rest, folded away: opened by the menu, closed by anything else */
          '<div class="sab-more" id="sab-more" hidden>' +
            '<button class="sab-act txt" id="sab-tech">Vidya</button>' +
            '<button class="sab-act txt" id="sab-world">Sea roads</button>' +
            '<button class="sab-act txt" data-sab-act="digest">Happenings</button>' +
            '<button class="sab-act txt" data-sab-act="timeline">The ages</button>' +
            '<button class="sab-act txt" id="sab-undo" disabled>↶ Undo</button>' +
            '<button class="sab-act txt" id="sab-pause" aria-pressed="false">⏸ Pause</button>' +
            '<button class="sab-act txt" id="sab-restart">↺ Start again</button>' +
            '<select class="sab-speed" id="sab-speed" aria-label="How fast the world moves">' +
              SPEEDS.map(function (x) { return '<option value="' + x.id + '">' + x.name + '</option>'; }).join('') +
            '</select>' +
          '</div>' +
        '</div>' +
        /* BESIDE THE MAP, NOT OVER IT. The rail used to float in the board's corner,
           because when the board was flex-sized anything above it cost the board that
           height and a phone's map only had 150px to give. The board is sized from the
           map's own ratio now, so a sibling cannot shrink it, and the rail can stop
           sitting on the country it is talking about. */
        '<div class="sab-rail" id="sab-rail"></div>' +
        '<div class="sab-strip">' +
          '<p class="sab-feed" id="sab-feed" aria-live="polite"></p>' +
        '</div>' +
        /* WHAT YOU HAVE, AT A GLANCE. The side column held a 130px bar in 864px of
           room; the rest was cream. A realm has a state worth showing from turn one --
           which places are awake, how big, and what each is actually making -- and
           without it a child had to enter every city to find out that none of them was
           doing anything. */
        '<div class="sab-realm" id="sab-realm" hidden></div>' +
        /* MITHU'S LINE. One suggestion, never a list — a list is another thing to read.
           This answers the half of "I'm not making strategic decisions" that is not a
           systems problem: a child who cannot tell what the game wants next does
           nothing, and doing nothing looks exactly like a game with nothing in it. */
        '<div class="sab-coach">' +
        '<div class="sab-advise"><button id="sab-advise" class="sab-advisebtn" data-sab-act="advise"></button>' +
          '<button class="sab-btn" data-sab-act="digest" aria-label="What has been happening">≣</button></div>' +
        '<p class="sab-guide" id="sab-guide"></p>' +
        '</div>' +
        '</div>' +
        /* THE RAIL. The feed is one line and the world talks over it, so a warning, a
           quarrel and a request arriving together left two of them unseen. The rail
           stacks what is live, worst first, each one dismissible, and it sits ABOVE the
           map rather than on it — a notification over the board covers the thing it is
           telling you about, which is the one place it must never be. */
        '<div class="sab-tray" id="sab-sheet" hidden></div>' +
        '<div id="sab-cityhost"></div>' +
        '<div class="sab-stage" id="sab-stage">' + board() +
          '<div class="sab-zoom">' +
          '<button class="sab-btn" data-sab-act="zin" aria-label="Zoom in">' + ic('plus', 20) + '</button>' +
          '<button class="sab-btn" data-sab-act="zout" aria-label="Zoom out">' + ic('minus', 20) + '</button>' +
          '<button class="sab-btn" data-sab-act="zreset" aria-label="Whole map">' + ic('whole', 20) + '</button></div>' +
          '<div id="sab-ovhost"></div></div>' +
        '<p class="sab-help" hidden>Tap a lamp, or move between them with the arrow keys — Enter chooses, ' +
          '<b>1–4</b> fire an action (<b>4</b> steps inside the city), <b>Esc</b> cancels, <b>P</b> pauses. ' +
          'Routes keep a place safe from the mist; <b>!</b> is a quest, <b>\u26a1</b> a quarrel for your panchayat, <b>\u2605</b> the capital. ' +
          'Cities gather dust if nobody visits — and a monument, once raised, is never forgotten.</p>' +
        '</div>';
      gwSet();
      paintAll();
    }

    /* ---- patch painters ---- */
    function paintHud() {
      var e = ERAS[G.era];
      /* THE ALARM LIVES IN THE BAR. The feed is one line and the world keeps
         talking; a threat on its way must stay on screen until it lands, and
         tapping it takes you straight to the city that needs hands. */
      D.getElementById('sab-eraname').textContent = e.name;
      D.getElementById('sab-eradate').textContent = 'Era ' + (G.era + 1) + ' of ' + ERAS.length + ' · ' + e.dates;
      var tn = D.getElementById('sab-turnno');
      if (tn) tn.textContent = String(G.t + 1);
      var ag = D.getElementById('sab-ages');
      if (ag) {
        var past = G.ages || [];
        ag.innerHTML = ERAS.map(function (_, i) {
          var rec = past.filter(function (a6) { return a6.era === i; })[0];
          var cls = rec ? (rec.good ? 'g' : 'q') : (i === G.era ? 'now' : '');
          return '<i class="' + cls + '"></i>';
        }).join('');
        ag.setAttribute('aria-label', past.length + ' ages behind you, ' +
          past.filter(function (a7) { return a7.good; }).length + ' of them golden');
        /* and what this age is dedicated to, if anything */
        var dn2 = '';
        DEDS.forEach(function (d) { if (d.id === G.ded) dn2 = d.name; });
        ag.title = 'Score this age: ' + eraScore() + ' of ' + eraBar() +
          (dn2 ? ' · dedicated to ' + dn2 : '') + (G.dark ? ' · the last age was quiet, so this bar is lower' : '');
      }
      /* THE TURN BUTTON. In Sochna it is the only thing that moves the world, so it
         says what is still unanswered; on a live speed there is nothing to press and
         it steps one turn early for anyone who wants to hurry. */
      var tb = D.getElementById('sab-turn');
      if (tb) {
        var waiting = decisionList().length;
        tb.innerHTML = '<span class="lbl">Agla Saal ▸' +
          (waiting ? '<em>' + waiting + ' waiting</em>' : '') + '</span>';
        tb.disabled = !!(G.won || overlay);
        tb.title = turnMs() ? 'Take the next turn now' : 'The world waits — press to spend a year';
      }
      var sp = D.getElementById('sab-speed');
      if (sp && sp.value !== G.speed) sp.value = G.speed;
      var ub = D.getElementById('sab-undo');
      if (ub) ub.disabled = !canUndo();
      var nb = D.getElementById('sab-next');
      if (nb) nb.disabled = !decisionList().length;
      /* WORST FIRST, and only what is actually live */
      var rail = D.getElementById('sab-rail');
      if (rail) {
        var items = [];
        if (G.warn && byId[G.warn.id]) {
          var dw = defenceOf(G.warn.id);
          /* SHORT ENOUGH TO READ AT A GLANCE. A rail row that wraps and then truncates
             mid-sentence ("Something comes to… Dholavira — 6 turns,") is worse than no
             row at all: it costs the board its space and still does not say the thing. */
          items.push({ p: 0, k: 'warn', go: G.warn.id,
            t: '⚠ ' + nameOf(byId[G.warn.id]) + ' · ' +
               Math.max(0, G.warn.at - G.t) + ' turns · gate ' + dw.total });
        }
        if (G.disp) items.push({ p: 1, k: 'disp', go: G.disp.a,
          t: '⚡ ' + nameOf(byId[G.disp.a]) + ' & ' + nameOf(byId[G.disp.b]) + ' · panchayat' });
        if (G.ev && byId[G.ev.id]) items.push({ p: 2, k: 'ev', go: G.ev.id,
          t: '🌾 ' + nameOf(byId[G.ev.id]) + ' · asking for grain' });
        Object.keys(G.req || {}).forEach(function (pid) {
          var pn2 = ''; PARTNERS.forEach(function (x) { if (x.id === pid) pn2 = x.name; });
          items.push({ p: 3, k: 'req:' + pid, go: null,
            t: '⚓ ' + pn2 + ' · ' + G.req[pid].want +
               (canSupply(G.req[pid].want) ? '' : ' (no road)') });
        });
        SITES.forEach(function (x) {
          if (!onMap(x) || !awake(x.id)) return;
          if (G.sites[x.id].fade >= 0)
            items.push({ p: 2, k: 'fade:' + x.id, go: x.id, t: '🌫 ' + nameOf(x) + ' · the mist' });
        });
        items = items.filter(function (i2) { return !(G.hushed || {})[i2.k]; })
                     .sort(function (a9, b9) { return a9.p - b9.p; }).slice(0, 4);
        rail.innerHTML = items.map(function (i3) {
          return '<div class="sab-railrow p' + i3.p + '">' +
            '<button class="sab-railgo" data-sab-act="railgo" data-g="' + (i3.go || '') + '">' +
            esc(i3.t) + '</button>' +
            '<button class="sab-railx" data-sab-act="hush" data-k="' + esc(i3.k) + '" aria-label="Dismiss">×</button>' +
            '</div>';
        }).join('');
        rail.hidden = !items.length;
      }

      /* THE REALM, AT A GLANCE. Every awake place, how big, and what it is actually
         making. Built from the same fields the city view reads -- nothing here is a
         second copy of the truth, and a row that says "nothing planned" is telling a
         child the one thing they could not otherwise learn without entering the city
         and looking. The sleeping places are a count, not a list: they are the game's
         subject, and naming them all would give away a map the mist is still keeping. */
      var realm = D.getElementById('sab-realm');
      if (realm) {
        var ids = Object.keys(G.sites).filter(awake);
        ids.sort(function (a1, b1) {
          if ((G.capital === a1) !== (G.capital === b1)) return G.capital === a1 ? -1 : 1;
          return (G.sites[b1].lv || 0) - (G.sites[a1].lv || 0);
        });
        var asleep = Object.keys(G.sites).length - ids.length;
        realm.innerHTML =
          '<p class="sab-realmhd">' + ids.length +
            (ids.length === 1 ? ' place awake' : ' places awake') + '</p>' +
          ids.map(function (id4) {
            var q4 = G.sites[id4], doing = '', idle = '';
            if (q4.mon || q4.monB) doing = 'raising a monument';
            else if (q4.plan && q4.plan.length) {
              var h4 = q4.plan[0];
              doing = h4.kind === 'monument' ? 'a monument, when it can'
                    : (BLD[h4.id] ? BLD[h4.id].name : 'something');
              if (q4.plan.length > 1) doing += ' +' + (q4.plan.length - 1);
            } else { doing = 'nothing planned'; idle = ' idle'; }
            if (q4.fade >= 0) { doing = 'fading'; idle = ' idle'; }
            return '<button class="sab-realmrow' + idle + '" data-sab-act="railgo" data-g="' +
              esc(id4) + '" aria-label="' + esc(nameOf(byId[id4])) + ' — ' + esc(doing) + '">' +
              '<b>' + esc(nameOf(byId[id4])) + (G.capital === id4 ? ' \u2605' : '') + '</b>' +
              '<i>lv ' + (q4.lv || 1) + ' \u00b7 ' + popOf(id4) + '</i>' +
              '<s>' + esc(doing) + '</s></button>';
          }).join('') +
          (asleep ? '<p class="sab-realmasleep">and ' + asleep +
            (asleep === 1 ? ' place still asleep in the mist' :
                            ' places still asleep in the mist') + '</p>' : '');
        realm.hidden = !ids.length;
      }
      var av = D.getElementById('sab-advise');
      if (av) {
        var ad = advise();
        av.innerHTML = '<em>▸</em><span>' + esc(ad.why) + '</span>';
        av.setAttribute('data-go', ad.go || '');
      }
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
      /* ==============================================================
         THE NUMBERS SAY WHICH ONE MOVED.
         ==============================================================
         There is plenty of ambient motion in this game already — walkers, smoke,
         a swaying tree — and almost none of it is FEEDBACK. Press Agla Saal, the
         core verb of the whole game, and three numbers quietly become three other
         numbers with nothing to say which, or by how much, or that anything
         happened at all. A turn that changes the world without acknowledging the
         press is a button a child stops trusting.

         So a chip that changed carries the delta for a moment and lifts. It is the
         cheapest possible version of the thing, and it is the difference between a
         turn landing and a turn being taken on faith. */
      var dl = (G.delta && G.delta.at === G.t) ? G.delta : null;
      D.getElementById('sab-res').innerHTML = ['anna', 'kala', 'katha'].map(function (k) {
        var d = Math.round(net[k] * 10) / 10;
        var lid = (k === 'anna') ? ' <small class="cap">of ' + storeCap() + '</small>' : '';
        var now = Math.floor(G.res[k]);
        var moved = dl ? dl[k] : 0;
        /* a line icon in a coin, not an emoji: the bar is the one place every
           number on screen is read from, so it gets the drawn set */
        return '<span class="sab-chip' + (moved ? ' sab-moved' : '') + '" aria-label="' + k + '">' +
          '<i class="sab-ri">' + ic(RI[k], 15) + '</i>' + now +
          ' <small' + (d < 0 ? ' class="neg"' : '') + '>' + (d >= 0 ? '+' : '') + d + '/turn</small>' + lid +
          (moved ? '<b class="sab-delta' + (moved > 0 ? '' : ' down') + '">' +
            (moved > 0 ? '+' : '') + moved + '</b>' : '') + '</span>';
      }).join('') +
      /* KHUSHI ON THE BAR. Variety is now a thing the realm can be short of, and a
         number the player cannot see is a rule they cannot play to. */
      (function () {
        var w = khushiWant(), h = khushiHave(), r2 = restless();
        return '<span class="sab-chip' + (r2 ? ' sab-restless' : '') + '"' +
          ' data-sab-act="khushi" title="' + esc(Object.keys(goodsReached()).join(', ') || 'nothing reached yet') + '">' +
          '<i class="sab-ri">' + ic('heart', 15) + '</i>' + h + '/' + w + ' <small>' + (r2 ? 'restless' : 'content') + '</small></span>';
      })();
      var adv = D.getElementById('sab-adv');
      /* SHOWN ONLY WHEN IT CAN BE PRESSED. It used to sit there greyed for most of
         every age — a permanent slot on a one-line bar, spent on something actionable
         perhaps twice an hour. */
      if (G.era < ERAS.length - 1 && canAdvance()) {
        adv.hidden = false;
        adv.disabled = false;
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
        return '<g class="sab-exwalk" style="transition:transform ' + ((turnMs() || TICK_MS) / 1000) + 's linear;transform:translate(' +
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
    /* ==================================================================
       SOUND — one short tone a verb, and nothing else
       ==================================================================
       Connecting two places is the core verb of this whole game and it felt like
       nothing: no weight, no confirmation, no difference between a road laid and a tap
       that missed. Synthesised rather than sampled on purpose — the corpus is already
       760MB of narration and art, and this needs no byte of it.

       It follows prefers-reduced-motion, because a child who has asked for less motion
       has usually asked for less of everything, and it is off until the first real tap
       so no page ever makes a noise a child did not ask for. */
    var AC = null, muted = false;
    var TONES = { road: [392, 0.09], wake: [523, 0.16], grow: [330, 0.1],
                  build: [294, 0.07], learn: [659, 0.14], peace: [440, 0.13],
                  turn: [247, 0.06], no: [180, 0.08] };
    function blip(kind) {
      if (REDUCED || muted) return;
      var t = TONES[kind]; if (!t) return;
      try {
        if (!AC) AC = new (W.AudioContext || W.webkitAudioContext)();
        var o = AC.createOscillator(), g = AC.createGain();
        o.type = 'triangle'; o.frequency.value = t[0];
        g.gain.value = 0.0001;
        o.connect(g); g.connect(AC.destination);
        var now = AC.currentTime;
        g.gain.exponentialRampToValueAtTime(0.06, now + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, now + t[1]);
        o.start(now); o.stop(now + t[1] + 0.02);
      } catch (e) { muted = true; }      /* a browser that refuses is simply silent */
    }

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
        b.push(tile('yields', 'book', 'Why?', 'where the numbers come from', true));
        b.push(tile('wake', 'sun', 'Wake', needsRoad(sel) ? 'needs a road' : wakeCost(sel) ? wakeCost(sel) + ' 📜' : 'free',
          { go: true, disabled: needsRoad(sel) }));
      } else {
        b.push(tile('route', 'road', 'Route', costStr(costOf({ kala: T.routeCost }, 'route'))));
        b.push(tile('utsav', 'lamp', 'Utsav',
          G.utsav > 0 ? G.utsav + 's' : utsavCost().anna + ' \ud83c\udf3e + ' + utsavCost().kala + ' \ud83d\udee0\ufe0f',
          { disabled: G.utsav > 0 }));
        /* No Enter-city button ON A DESKTOP: the city itself is the button. Double-click
           it, or press Enter with it selected. A tile that says "enter the thing you
           just tapped" is a tile that should not exist — where there is a mouse.
           ON A PHONE IT MUST EXIST. A double tap is invisible until somebody tells you,
           and a city a child cannot find the door to is a game with no inside. So the
           phone's sheet leads with the door, the full width of the thumb. */
        var waiting = cityJobsWaiting(sel).length;
        if (gm)
          b.splice(1, 0, '<button class="sab-enter" data-sab-act="city">' +
            '<span class="sab-tico">' + ic('temple', 20) + '</span>' +
            '<span class="lbl">Enter ' + esc(nameOf(byId[sel])) +
              (waiting ? '<em>' + waiting + (waiting === 1 ? ' thing waits' : ' things wait') + ' inside</em>'
                       : inDispute(sel) ? '<em>a quarrel waits inside</em>' : '') + '</span>' +
            ic('next', 20) + '</button>');
        else if (waiting || inDispute(sel))
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
      /* which names are worth showing changes when a place wakes or is selected, not
         only when the view moves — so the declutter runs on every repaint too */
      applyLabels();
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
          JOB_IDS.forEach(function (jid) {
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
        /* Turn the board a quarter, and step the zoom. The built/painted
           switch used to sit at the front of this row; it is gone with the
           mode it flipped. */
        var kitbar = '';
        if (KITC) {
          kitbar = '<div class="sab-kitbar">' +
            '<button data-sab-act="kitturn" aria-label="Turn the board a quarter">' +
            '<i>\u27f3</i><u>turn</u></button>' +
            '<button data-sab-act="kitzoom" data-d="-1" aria-label="Zoom out">\u2212</button>' +
            '<span class="z">' + Math.round((G.kitZ || 1) * 100) + '%</span>' +
            '<button data-sab-act="kitzoom" data-d="1" aria-label="Zoom in">+</button>' +
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
        var totalJ = 0;
        JOB_IDS.forEach(function (j2) { totalJ += j[j2]; });
        /* THE CREW IS WHAT THE CITY HAS BUILT FOR. Four corners were four
           roles because there were only ever four; now a role stands here
           once its building does, and a city that has raised no wall simply
           has no watch to arrange. */
        /* ON THE BUILT BOARD THE CREW IS NOT A ROW OF CHIPS.
           The chips were the only way to arrange people, so they were pinned
           over the city however much of it they covered — and as soon as
           there were more than four roles they began colliding with each
           other. The built board has two better places for the same thing:
           the People shelf in the shop, where a child DISCOVERS that a
           workshop is what buys a karigar, and the figures standing on the
           work itself. So the chips stay where they are still the only
           answer: the painted plates, which have no shop. */
        var CREW = KITC ? [] : JOB_IDS.filter(function (jid) {
          return (jobOpen(id, jid) || j[jid] > 0) && spOf(jid);
        });
        /* WHERE THEY STAND, FOR HOWEVER MANY THERE ARE. The four corners were
           hand-written per role, which only works while the roles are four.
           Narrow lays them across the top in one strip; wide runs them down
           the two sides, left column first, so a fifth and sixth have a place
           to be without anything moving that already had one. */
        var stPos = function (i2) {
          if (narrow) {
            var per = Math.max(1, Math.min(CREW.length, 4));
            var col = i2 % per, row = Math.floor(i2 / per);
            return 'left:' + (0.5 + col * (98 / per)).toFixed(1) + '%;top:' +
                   (1 + row * 21) + '%';
          }
          var side = i2 % 2, tier = Math.floor(i2 / 2);
          var top = (KITC && G.kitOpen ? 6 : 15) + tier * 27;
          return 'left:' + (side ? '81%' : '1.5%') + ';top:' + top + '%';
        };
        var stations = CREW.map(function (jid, i2) {
          var spw = spOf(jid); if (!spw) return '';
          var jd = DATA.jobs[jid];
          var canUp = totalJ < pop || (j.kisan > 0 && jid !== 'kisan');
          return '<div class="sab-station" style="' + stPos(i2) + '">' +
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
        h += '<div class="sab-scene' + (KITC ? ' iskit full' : '') +
          (KITC && G.kitOpen ? ' shelfup' : '') + (narrow ? ' tight' : '') + '">' +
          (KITC ? '<button class="sab-leave" data-sab-act="leave"' +
            ' aria-label="Leave ' + esc(nameOf(s)) + ' and go back to the map">' +
            '\u2190 <span>the map</span></button>' : '') +
          /* ==============================================================
             THE TURN BELONGS IN HERE TOO.
             ==============================================================
             The founder's note, and they are right: the city had no Agla Saal. In
             Sochna that makes the city a dead end - you come in to plan, you spend
             your coin, and then you have to walk back out to the map to spend the
             year. tick() has taken a `forced` flag since the day Sochna was built
             precisely so a turn could be asked for from inside a city ("you plan in
             the city, then spend the turn", says the comment); I wrote the machinery
             and never put the button anywhere a child could reach it.

             The coins come with it, and that is not scope creep: this is the screen
             where nearly all the spending happens, and it showed no totals at all. A
             turn button that moves numbers you cannot see is half a button. */
          cityTurnBar() +
          (atlas && !KITC ? '<style>' + roadKeyframes(id) + '</style>' : '') +
          (KITC ? '<div class="sab-view" id="sab-view">' : '') +
          '<div class="sab-cam" id="sab-cam" style="transform:' + camStr() + '">' +
          (KITC ? kitBoard(id, scaf + treHunt + '<div class="sab-plots">' + plots + '</div>' + yatri)
                : '<img class="sab-hero' + (q.mon ? '' : ' dim') + '" src="' + heroArt + '" alt="">') +
          (KITC ? '' : greenLayer(id)) +
          '<div class="sab-praja" aria-hidden="true">' + breath + walkers + birds + moor + '</div>' +
          (KITC ? '' : scaf + treHunt + '<div class="sab-plots">' + plots + '</div>' + yatri) +
          '</div>' + (KITC ? '</div>' : '') +
          plate + stations + badges + (KITC ? kitCalls(id) : '') +
          (KITC ? kitDrawer(id) : growBtn(id)) + '</div>' +
          (KITC ? '' : treHint +
            (q.mon ? '' : '<div class="sab-herocap">The city as it could be — raise the monument, ' +
              'the scaffolding comes down, and the colours come back.</div>'));
      }
      var king = inKingdomOf(id);
      if (king && !KITC) h += '<div class="sab-herocap" style="font-weight:800;color:var(--accent)">' +
        motif('lotus', 20) + esc(G.kingdoms[king].name) + (king === id ? ' — this is the seat' : '') + '</div>';
      /* with a plate, the stations ARE the people UI — the tiles stay only
         for a city with no painting to stand them on */
      if (!heroArt) h += '<div class="mono" style="margin-top:4px">The people · ' + pop + ' praja · eat ' +
        (pop * T.eat) + ' \ud83c\udf3e each turn</div><div class="sab-jobs" id="sab-sec-people">' +
        JOB_IDS.filter(function (jid) { return jobOpen(id, jid) || j[jid] > 0; }).map(function (jid) {
          var jd = DATA.jobs[jid];
          var up = 0;
          JOB_IDS.forEach(function (j2) { up += j[j2]; });
          up = up < pop;
          return '<div class="sab-job">' +
            '<span class="sab-tico" style="width:28px;height:28px;border-radius:9px">' +
            ic({ kisan: 'wheat', karigar: 'hammer', kathakar: 'scroll', rakshak: 'shield',
                 dwarpal: 'shield', dhanurdhar: 'shield' }[jid] || 'shield', 18) + '</span>' +
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
      if (q.hero && !q.hero.gone && !KITC) {
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
      if (inDispute(id) && !KITC) {
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
      if (heroArt && !KITC) {
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
      } else if (!KITC)
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
      if (q.bld.gurukul && !KITC) {
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
      if (qq && !KITC) {
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
      if (q.seen && !KITC) {
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
      /* WHERE YOU WERE LOOKING SURVIVES THE REPAINT.
         paintCity replaces the whole city, so .sab-view is a NEW element every
         time and its scroll starts at zero — which means hiring a worker,
         placing a hut or opening the bell threw the camera back to the empty
         top-left corner of the land. Harmless while the board was a small
         panel at 100%; unusable full-screen at 200%. */
      var vOld = D.getElementById('sab-view');
      var keepV = vOld ? { l: vOld.scrollLeft, t: vOld.scrollTop } : null;
      hostEl.innerHTML = open ? cityHTML(city) : '';
      if (keepV) {
        /* AFTER THE BOARD IS SIZED, NOT BEFORE. fit() is what gives the board
           its width and height; until it has run the fresh view has nothing to
           scroll, so a scrollLeft set here is clamped straight back to zero.
           Fit first, restore second, and once more on the next frame because
           the images inside are still arriving. */
        var put = function () {
          var vNew = D.getElementById('sab-view');
          if (!vNew) return;
          if (W.IND_KIT) W.IND_KIT.fit(D);
          vNew.scrollLeft = keepV.l; vNew.scrollTop = keepV.t;
        };
        put();
        if (W.requestAnimationFrame) W.requestAnimationFrame(put);
      }
      /* THE BUILT CITY TAKES THE WINDOW, so the page behind it must not
         scroll under it — a fixed surface over a scrolling page is how you
         get a city that slides away when a thumb brushes the edge. */
      try {
        D.body.classList.toggle('sab-full', !!(open && kitOn(city)));
      } catch (e0) {}
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
         the half you were about to look at.
         ASKED OF THE CITY, NOT THE MODE. Eight cities have a board and the
         other twenty-three are still paintings; asking the global flag took
         the camera away from every one of those paintings the moment the kit
         became the default, and the yatri walked out of frame. */
      if (kitOn(city)) return 'scale(1) translate(0,0)';
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
      /* A LOCKED THING IS SHOWN, NOT HIDDEN — the same rule the build shelf already
         follows. A tree whose branches appear only once you can afford them is a list
         with extra steps; seeing what the plough leads to is most of why a child
         wants the plough. So everything in this age and the next is on screen, and
         what is locked says what would open it. */
      var rows = TECHS.slice().sort(function (a, b) { return a.era - b.era; }).map(function (t, i2, arr) {
        if (t.era > G.era + 1) return '';
        /* THE AGE IS THE RUNG, so the ladder has to be visible as one. A flat column of
           twenty-three rows with "after Iron Tools" written on some of them is an
           annotated list; item 23 asked for a tree, and this is where it was owed. */
        var head = (i2 === 0 || arr[i2 - 1].era !== t.era)
          ? '<div class="sab-rung' + (t.era > G.era ? ' next' : '') + '">' +
            esc(ERAS[t.era] ? ERAS[t.era].name : 'Age ' + (t.era + 1)) +
            (t.era > G.era ? ' \u00b7 not yet' : '') + '</div>'
          : '';
        var have = !!G.tech[t.id], c = techCost(t);
        var soon = t.era > G.era;
        var shut = !soon && !techOpenFor(t);
        var va = artOf('vidya-' + t.id);
        var busy = G.proj && G.proj.id === t.id;
        var eu = eurekaPct(t);
        /* a thing that waits on another sits under it and hangs off it: the
           relationship is the point, and a sentence is the weakest way to draw one */
        return head + '<div class="sab-work' + (have ? ' built' : busy ? ' now atwork' : ' now') +
          (soon || shut ? ' sab-shut' : '') + ((t.needs || []).length ? ' sab-branch' : '') + '">' +
          (va ? '<img class="sab-vthumb" src="' + va + '" alt=""' + (have ? '' : ' style="filter:grayscale(.8)"') + '>' : '<i>' + (have ? '✓' : '?') + '</i>') +
          '<span><b>' + esc(t.name) + '</b> · <span class="tiny" style="color:var(--muted)">' + esc(t.what) + '</span>' +
          (soon ? '<span class="sab-need">next age</span>'
                : shut ? '<span class="sab-need">after ' + esc(techMissing(t).join(' and ')) + '</span>' : '') +
          (!have && !soon && !shut && eu ? '<span class="sab-eu">⚡ you already know ' +
             Math.round(eu * 100) + '% of this — ' + eurekaCount(t.boost.of) + ' built</span>' : '') +
          (busy ? '<span class="sab-projbar" style="--pc:' + (projPct() * 100).toFixed(1) + '%">' +
            '<i></i><b>' + Math.round(projPct() * 100) + '%</b></span>' : '') + '</span>' +
          '<span style="flex:1"></span>' +
          (have ? '' : busy ? '<span class="tiny" style="color:var(--accent);font-weight:800">at work</span>'
            : soon || shut ? ''
            : '<button class="sab-btn" data-sab-act="tech" data-t="' + t.id + '"' +
            (canPay(c) && !G.proj ? '' : ' disabled') + '>' + costStr(c) + '</button>') +
          '</div>';
      }).join('');

      /* ---- RITI: the second tree ---- */
      var ritiRows = RITI.slice().sort(function (a, b) { return a.era - b.era; }).map(function (r, i3, arr3) {
        if (r.era > G.era + 1) return '';
        var rhead = (i3 === 0 || arr3[i3 - 1].era !== r.era)
          ? '<div class="sab-rung' + (r.era > G.era ? ' next' : '') + '">' +
            esc(ERAS[r.era] ? ERAS[r.era].name : 'Age ' + (r.era + 1)) +
            (r.era > G.era ? ' \u00b7 not yet' : '') + '</div>'
          : '';
        var have = !!(G.riti || {})[r.id], soon = r.era > G.era;
        var shut = !soon && !ritiOpenFor(r);
        var c = costOf(r.cost, 'riti');
        var card = POL_BY[r.gives] || {};
        return rhead + '<div class="sab-work' + (have ? ' built' : ' now') + (soon || shut ? ' sab-shut' : '') +
          ((r.needs || []).length ? ' sab-branch' : '') + '">' +
          '<i>' + (have ? '✓' : '○') + '</i>' +
          '<span><b>' + esc(r.name) + '</b> · <span class="tiny" style="color:var(--muted)">' +
          esc(r.what) + '</span>' +
          '<span class="tiny" style="color:var(--accent2);font-weight:800">opens “' + esc(card.name || '') + '”</span>' +
          (soon ? '<span class="sab-need">next age</span>'
                : shut ? '<span class="sab-need">after ' + esc(ritiMissing(r).join(' and ')) + '</span>' : '') +
          '</span><span style="flex:1"></span>' +
          (have || soon || shut ? '' :
            '<button class="sab-btn" data-sab-act="riti" data-r="' + r.id + '"' +
            (canPay(c) ? '' : ' disabled') + '>' + costStr(c) + '</button>') +
          '</div>';
      }).join('');

      /* ---- THE SLOTS. Swapping is free; the cost was the custom, not the card. ---- */
      var open = polOpen();
      var slots = '';
      var n = polSlots(), i;
      for (i = 0; i < n; i++) {
        var inSlot = (G.pol || [])[i];
        var card2 = POL_BY[inSlot];
        slots += '<div class="sab-slot">' +
          '<b>' + (card2 ? esc(card2.name) : 'empty') + '</b>' +
          (card2 ? '<span>' + esc(card2.what) + '</span>' +
                   '<button class="sab-btn" data-sab-act="polclear" data-s="' + i + '">take out</button>'
                 : '<span>Slot ' + (i + 1) + ' — put a custom to work.</span>') +
          '<div class="sab-polpick">' + open.filter(function (pid3) {
            return pid3 !== inSlot;
          }).map(function (pid3) {
            var cd = POL_BY[pid3] || {};
            return '<button class="sab-btn" data-sab-act="pol" data-p="' + pid3 + '" data-s="' + i + '"' +
              ' title="' + esc(cd.what || '') + '">' + esc(cd.name || pid3) + '</button>';
          }).join('') + '</div></div>';
      }
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
        '<div class="mono" style="margin-top:8px">Vidya — what the age knows how to do</div>' +
        '<div class="sab-works">' + rows + '</div>' +
        '<div class="mono" style="margin-top:12px">Riti — how your realm does things</div>' +
        '<div class="sab-works">' + ritiRows + '</div>' +
        '<div class="mono" style="margin-top:12px">In force — ' + polSlots() +
          ' slot' + (polSlots() > 1 ? 's' : '') + ', and swapping costs nothing</div>' +
        '<div class="sab-slots">' + slots + '</div>' +
        '<p class="tiny" style="color:var(--muted)">Two trees run at once and the coins never stretch to both, ' +
        'so the order is the strategy. Build the thing first and the learning comes quicker — ' +
        'three fields and the plough half teaches itself.</p>' +
        '</div>';
    }
    var techOpened = false;
    function paintTech() {
      var hostEl = D.getElementById('sab-cityhost');
      var stage = D.getElementById('sab-stage');
      stage.style.display = (techOpen || city) ? 'none' : '';
      hostEl.innerHTML = techOpen ? techHTML() : (city ? hostEl.innerHTML : '');
      var tt = D.getElementById('sab-tabtech');
      if (tt) tt.setAttribute('aria-pressed', String(!!techOpen));
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
      if (!html) { openPiece = null; openCall = null; }
      D.getElementById('sab-ovhost').innerHTML =
        html ? '<div class="sab-over"><div class="sab-card" role="dialog" aria-modal="true">' + html + '</div></div>' : '';
      if (html) { var f = D.querySelector('#sab-ovhost .sab-btn'); if (f) f.focus({ preventScroll: true }); }
    }

    /* ================================================================
       ACTIONS
       ================================================================ */
    /* SOME VERBS ARE THE REALM'S, NOT A PLACE'S. act() requires a selected lamp, which
       is right for grow and route and wrong for the sea roads: the world is not
       somewhere on the map. act2 reaches the same dispatcher without pretending a
       city is selected. */
    function act2(name) {
      var el = D.createElement('button');
      el.setAttribute('data-sab-act', name);
      D.getElementById('sabwrap').appendChild(el);
      el.click(); el.remove();
    }

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
        /* A CITY OPENS LEANED IN. At 100% the whole board fits and every
           building is a thumbnail; the city is a place you stand in, so it
           opens at 200% and you pan. The buttons take you back out. */
        if (G.kitZ == null) G.kitZ = 2;
        /* AND LOOKING AT SOMETHING. Leaned in to 200%, a board scrolled to 0,0
           opens on the empty corner of the land with the town somewhere off
           the bottom right. Look at the MONUMENT — in a city with nothing
           built yet the build heart is bare ground, and opening on a screen of
           empty sand tells a child nothing about where they are. The monument
           in its scaffolding is the one thing every city has from the start.
           Its cell is whatever cell its traced plate point falls in. */
        if (kitOn(sel) && W.IND_KIT) {
          var A0 = (W.IND_PLATES || {})[sel], at0 = null;
          if (A0 && A0.mon) {
            var c0 = W.IND_KIT.cellOf(A0.mon[0], A0.mon[1]);
            if (c0) at0 = [c0.x, c0.y];
          }
          W.IND_KIT.lookSoon(sel, G.kitRot || 0, KIT_HEAD, at0);
        }
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
        pay({ anna: T.exploreCost }); G.score += 10; touch(sel);
        G.explorers.push({ from: sel, target: near.id, x: s.x, y: s.y });
        say('An explorer sets out from ' + s.name + ', lamp in hand, into the mist.', 'warm');
      }
      if (name === 'grow' && !q.zzz && q.lv < T.maxLevel) {
        var cost = T.growCost[q.lv];
        if (G.res.anna < cost) return say('Not enough anna yet — the fields are still filling.', '');
        pay({ anna: cost }); blip('grow'); q.lv++; G.score += 10; touch(sel);
        fxAt(s.x, s.y, 'grow');
        /* AND IT GROWS SOMEWHERE. The level is the reward; the direction is the
           decision, and it is asked at the moment it is earned. */
        showOverlay('<h3>' + esc(nameOf(s)) + ' grows — which way?</h3>' +
          '<p>The town may build further out on the side you choose. Dholavira itself ' +
          'was laid out in three nested parts, wall within wall — a city goes the ' +
          'way it decides to go.</p>' +
          '<div class="row">' + DIRS.map(function (d2) {
            var had = (q.grown || []).indexOf(d2.id) >= 0;
            return '<button class="sab-btn' + (had ? '' : ' go') +
              '" data-sab-act="growdir" data-d="' + d2.id + '" data-c="' + sel + '">' +
              d2.name.charAt(0).toUpperCase() + d2.name.slice(1) + (had ? ' ✓' : '') +
              '</button>';
          }).join('') + '</div>');
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
        pay(utsavCost());
        G.res.katha += T.utsavKatha; G.utsav = T.utsavCd; G.score += 15; touch(sel);
        SITES.forEach(function (t) { var w = G.sites[t.id]; if (w.fade >= 0) { w.fade = -1; w.idle = 0; } });
        fxAt(s.x, s.y, 'utsav');
        say('Utsav at ' + s.name + '! Songs carry far — the mist pulls back from every fading lamp.', 'warm');
        var uq = G.quests[sel];
        if (uq && uq.kind === 'utsav') finishQuest(sel, 'The whole town danced.');
      }
      if (name === 'wake' && q.zzz) {
        if (needsRoad(sel)) return say(s.name + ' needs a road first — a story has to travel to be heard.', '');
        if (G.res.katha < wakeCost(sel)) return say((G.sites[sel].deep ? 'This one has slept through an age and asks more — ' : '') +
          'not enough katha yet. Stories are earned by helping and holding utsavs.', '');
        pay({ katha: wakeCost(sel) }); deed('wake'); G.sites[sel].deep = 0;
        G.sites[sel].litAt = G.t; blip('wake');    /* for the replay */ q.zzz = false; q.fade = -1; q.idle = 0; q.neg = 0; G.score += 25;
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
      pay(rc); deed('road'); blip('road'); G.routes.push([a, b]); G.score += 15;
      targeting = false; touch(a); touch(b);
      var q = G.sites[a]; q.idle = 0; if (q.fade >= 0) q.fade = -1;
      var p = G.sites[b]; p.idle = 0; if (p.fade >= 0) p.fade = -1;
      say('A road now runs between ' + byId[a].name + ' and ' + byId[b].name + '. Connected places thrive.', 'warm');
      paintAll(); paintFog();
    }

    /* ==================================================================
       THE AGE IS JUDGED BEFORE THE NEXT ONE BEGINS
       ==================================================================
       This is the one screen the game was most missing. The advance used to hand over an
       aha card and move on, so nothing ever said what the last five hundred years had
       been like, and the arc a child had actually lived was invisible. */
    function ageVerdict(after) {
      var sc = eraScore(), bar = eraBar(), good = sc >= bar;
      var name = ERAS[G.era].name;
      var lines = Object.keys(G.deeds || {}).map(function (k) {
        var d = DEED_BY[k]; if (!d) return '';
        return '<li class="tiny">' + G.deeds[k] + ' × ' + esc(d.what) +
               ' <span style="color:var(--muted)">(' + (d.n * G.deeds[k]) + ')</span></li>';
      }).filter(Boolean).join('');
      /* record it, so the timeline can be drawn from what really happened */
      if (!G.ages) G.ages = [];
      G.ages.push({ era: G.era, name: name, score: sc, bar: bar, good: good });
      G.dark = !good;
      G.deeds = {};

      if (!good) {
        G.ded = null;
        showOverlay('<div class="mono" style="color:var(--muted)">andhera — a thin age</div>' +
          '<h3>' + esc(name) + ' passes quietly</h3>' +
          '<ul style="margin:6px 0;padding-left:18px">' + (lines || '<li class="tiny">very little was done</li>') + '</ul>' +
          '<p>' + sc + ' against ' + bar + '. The mist moves a little faster for a while — ' +
          '<b>and the next age asks less of you</b>, so a quiet age is where a great one starts. ' +
          'Nothing has been lost that cannot be woken.</p>' +
          '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">On, then</button></div>');
        if (after) after();
        return;
      }
      showOverlay('<div class="mono" style="color:var(--accent2)">swarna yug — a golden age</div>' +
        '<h3>' + esc(name) + ' will be remembered</h3>' +
        '<ul style="margin:6px 0;padding-left:18px">' + lines + '</ul>' +
        '<p>' + sc + ' against ' + bar + '. Choose what this age is remembered FOR — ' +
        'it holds for the whole of the next one.</p>' +
        '<div class="row">' + DEDS.map(function (d) {
          return '<button class="sab-btn go" data-sab-act="dedicate" data-d="' + d.id + '"' +
            ' title="' + esc(d.what) + '">' + esc(d.name) + '</button>';
        }).join('') + '</div>');
      if (after) after();
    }

    function advance() {
      if (!canAdvance()) return;
      pay({ katha: ERAS[G.era].katha });
      ageVerdict();
      var aha = ERAS[G.era].aha;
      var AHA_ART = ['vidya-iron', 'vidya-script', 'vidya-zero', 'vidya-monsoon',
                     'vidya-paper', 'vidya-charkha', 'vidya-chahbagh', 'vidya-ship',
                     'vidya-railway', 'vidya-swadeshi', 'vidya-samvidhan', 'vidya-khula'];
      var ea = artOf(AHA_ART[G.era]);
      G.era++; G.score += 50;
      void ea;
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
      if (G.won || G.era < ERAS.length - 1) return;
      var roads = victoriesWon();
      if (!roads.length) return;
      G.won = true; G.roads = roads; wipe();
      grant(60, 'India remembers');
      var vnames = roads.map(function (r5) {
        var v = null; VICS.forEach(function (x) { if (x.id === r5) v = x; });
        return v ? v.name : r5;
      });
      showOverlay(mascot('gattu', 'happy', 110) +
        '<div class="mono" style="color:var(--accent2)">' + esc(vnames.join(' · ')) + '</div>' +
        '<h3>India remembers.</h3>' +
        '<p>From the first brick of Dholavira to this morning’s countdown at Sriharikota — ' +
        'every lamp lit, every road walked, and the mist gone back to the sea. ' +
        'Five thousand years, and not one of these places was taken: every one was reached, ' +
        'and the ones that grew quiet are remembered by their stones.</p>' +
        '<p class="tiny">You got here by ' +
        (vnames.length > 1 ? 'more than one road at once: ' : 'the road of ') +
        esc(vnames.join(', ')) + '. There are ' + VICS.length +
        ' and they do not need the same realm.</p>' +
        ((G.ages || []).length ? '<p class="tiny">' +
          (G.ages.filter(function (a5) { return a5.good; }).length) + ' of your ' +
          G.ages.length + ' ages were golden.</p>' : '') +
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
      /* EVERY KIND OF WATCHER, WEIGHED. A rakshak on the wall and a dwarpal
         at the gate are each worth one; a dhanurdhar in the tower is worth
         two. The weight rides on the role in DATA.jobs, so a new role is a
         data change and not an engine change. */
      var jj2 = jobsOf(id), own = 0;
      JOB_IDS.forEach(function (j2) { own += jj2[j2] * (DATA.jobs[j2].guard || 0); });
      /* AND THE TOWERS THEMSELVES. kitWatch has been summing the `watch` on
         built pieces since the kit shipped and nothing ever read it, so a
         watchtower cost 26 kala and did nothing at all. It counts now. */
      var wall = (q2.bld.prakara ? T.wallGuard : 0) + (q2.bld.durg ? T.fortGuard : 0) +
                 (kitOn(id) ? kitWatch(id) : 0);
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
      var lead = (wonderGuard(tgt.id, 'watch') ? T.warnTower : T.warnTicks) * (polEff('warn') || 1);
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
    function techDur(t) {
      var base = T.techTicks + T.techEra * G.era;
      var cut = Math.max(T.techFloor, 1 - schools() * T.techSchool);
      if (polEff('techCut')) cut *= polEff('techCut');
      if (dedEff('freeinquiry')) cut *= 0.67;    /* the age dedicated to asking */
      /* THE EUREKA IS TIME, NOT COIN. Paying less would say "this was cheap"; finishing
         sooner says "you already knew half of this", which is the true thing. */
      cut *= (1 - eurekaPct(t));
      return Math.max(3, Math.round(base * cut));
    }
    /* WHERE THE WALLS STAND DECIDES HOW FAST THE MONUMENT RISES.
       docs/16 already says the fort shelters a monument still rising — it was true in
       the fiction and nowhere in the arithmetic. A guard piece beside the monument's
       own cell now speeds the work, which gives the walls a placement decision of
       their own: a rampart put where it happened to fit protects nothing in
       particular, and a rampart put around the great work is why the great cities of
       every age raised one first. */
    function monShelter(id) {
      var A = (W.IND_PLATES || {})[id], K2 = W.IND_KIT;
      if (!A || !A.mon || !K2) return 0;
      var c = K2.cellOf(A.mon[0], A.mon[1]);
      if (!c) return 0;
      var at = adjMap(kitOf(id).kit), n = 0, seen = {};
      NB.concat([[0, 0]]).forEach(function (d) {
        (at[(c.x + d[0]) + ',' + (c.y + d[1])] || []).forEach(function (o) {
          if (o.g !== 'guard') return;
          var k = o.b.p + '@' + o.b.x + ',' + o.b.y;
          if (seen[k]) return; seen[k] = 1; n++;
        });
      });
      return Math.min(n, 2);
    }
    function monDur(id) {
      var s2 = byId[id];
      var base = T.monTicks + T.monEra * s2.era;
      var cut = Math.max(T.monFloor, 1 - jobsOf(id).karigar * T.monHand);
      cut *= (1 - 0.12 * monShelter(id));      /* walls around the work */
      if (dedEff('monumentality')) cut *= 0.67;   /* the age dedicated to stone */
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
        G.tech[G.proj.id] = true; G.proj = null; G.score += 30; deed('tech'); blip('learn');
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
        touch(done.id); G.score += 60; G.res.katha += 10; deed('mon');
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
    function tick(forced) {
      /* the works advance wherever the player is standing — pause is pause,
         but a city screen no longer freezes the masons and the school */
      if (!(pause || G.won || dead)) progressWorks();
      if (G.won || dead) return;
      /* A CARD ON SCREEN STOPS THE WORLD, ALWAYS. Everything else is only a
         default: `forced` is Agla Saal, and a turn asked for from inside a city
         is the whole point of Sochna — you plan in the city, then spend the turn. */
      if (overlay) return;
      if (!forced && (pause || city || techOpen)) return;
      /* past here the turn is really happening: the undo window closes, and nothing
         inside the turn may open a new one (see undoPoint) */
      tickSeq++; inTick = true;
      /* WHAT THIS TURN DID, measured across the whole turn rather than diffed in the
         painter. The first cut compared each paint against the last one's numbers,
         which looked right and could not work: paintHud runs twice per turn (once at
         the end of tick, once from paintAll), and the second run diffed against the
         values the first had just stored, wiping the marker every time. A delta
         belongs to the turn that earned it. */
      var res0 = { anna: Math.floor(G.res.anna), kala: Math.floor(G.res.kala),
                   katha: Math.floor(G.res.katha) };
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
        void q;
        if (!q.zzz && !q.her) eaten += popOf(s.id) * T.eat * (polEff('eat') || 1);
      });
      eaten += upkeep();                     /* the roads ask a little grain too */
      if (eaten) {
        if (G.res.anna >= eaten) G.res.anna -= eaten;
        else {
          G.res.anna = 0;
          SITES.forEach(function (s) { var q = G.sites[s.id]; if (inEra(s) && !q.zzz) q.neg = Math.max(q.neg, negLimit(s.id)); });
          say('The granaries are empty and every town feels it — put more hands to farming.', 'mist');
        }
      }

      /* THE STORES HAVE A LID, so grain is a thing to use rather than a wall to
         stand behind. Overflow is not lost quietly — it is said out loud, because a
         number that stops moving with no explanation reads as a bug. */
      var cap = storeCap();
      if (G.res.anna > cap) {
        G.res.anna = cap;
        if (!G.saidCap || G.t - G.saidCap > 30) {
          G.saidCap = G.t;
          say('The granaries are full to the roof — spend it, or build somewhere to keep it.', '');
        }
      }

      /* THE WORLD ASKS, AND FORGETS IF IT IS IGNORED. Favour drifts down on a missed
         request and never goes below zero — a partner lost for good is a punishment a
         child cannot come back from, and this game does not do those. */
      if (G.t % 14 === 0) askPartner();
      Object.keys(G.req || {}).forEach(function (pid) {
        var r = G.req[pid];
        if (G.t < r.due) return;
        delete G.req[pid];
        if (G.fav && G.fav[pid]) G.fav[pid] = Math.max(0, G.fav[pid] - 1);
        var pn = ''; PARTNERS.forEach(function (x) { if (x.id === pid) pn = x.name; });
        say(pn + ' waited, and the ships went elsewhere this season. They will ask again.', 'mist');
      });
      diasporaGift();

      /* PRAJA MOVE. A town that cannot feed itself loses a pair of hands to one that
         can. This is population pressure with no border anywhere near it: nobody is
         conquered, nothing changes colour, somebody just walks to where there is food. */
      if (G.t % 8 === 0) migrate();

      /* THE PLANS RUN. A city with a queue spends the realm's coin on its own
         next thing, in the order the player set, the moment it can afford it. */
      SITES.forEach(function (s) { if (inEra(s)) planStep(s.id); });

      /* EXPLORERS WALK. Each turn they cover a stretch of country, the fog opening
         around their lamp; arriving, the place is FOUND — visible, asleep, ready
         for a road. Discovery is its own reward: the finding pays katha. */
      if (G.explorers.length) {
        var arrived = [], found2 = null;
        G.explorers.forEach(function (ex) {
          var t2 = byId[ex.target];
          if (!t2 || found(ex.target)) { ex.done = true; return; }
          var dx = t2.x - ex.x, dy = t2.y - ex.y, d = Math.sqrt(dx * dx + dy * dy);
          var spd = T.exploreSpeed * (G.tech.satellite ? 2 : 1) * (dedEff('exodus') ? 2 : 1);
          if (d <= spd) { ex.x = t2.x; ex.y = t2.y; ex.done = true; arrived.push(ex.target); }
          else { ex.x += dx / d * spd; ex.y += dy / d * spd; }
          if (!found2) found2 = scoutLook(ex);      /* one wonder a turn, at most */
        });
        G.explorers = G.explorers.filter(function (ex) { return !ex.done; });
        arrived.forEach(function (id) {
          var q2 = G.sites[id]; q2.found = true;
          G.res.katha += 15 * (dedEff('exodus') ? 2 : 1); G.score += 20;
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
        /* THE FULL KOSH — something kept back. While there is grain in the stores no
           town slides toward the mist; empty them and the promise lapses, which is
           the point of a treasury rather than a blessing. */
        if (polEff('noFade') && G.res.anna > 0) { q.idle = 0; if (q.fade >= 0) q.fade = -1; return; }
        if (dedEff('penseverance')) { q.idle = 0; if (q.fade >= 0) q.fade = -1; return; }
        if (connected(s.id)) { q.idle = 0; if (q.fade >= 0 && !G.ev) q.fade = -1; return; }
        /* "A road would hold it" — so the mist waits until a road COULD: a city alone
           on the map, with nowhere yet to build to, is not punished for it */
        if (!roadable(s.id)) { q.idle = 0; if (q.fade >= 0) q.fade = -1; return; }
        if (q.fade >= 0) {
          q.fade++;
          if (q.fade >= T.fadeLen) {
            /* DEEP SLEEP. Nothing could really be lost, so nothing was ever tense: a
               town slept and woke for the same price it always cost. A place left to
               sleep through a whole age settles deeper and asks more to wake — still
               never destroyed, still always recoverable, which is the line docs/16
               draws and this stays inside. */
            if (q.zzz) q.deep = (q.deep || 0) + 1;
            q.zzz = true; q.fade = -1;
            showOverlay(mascot('vismriti', null, 90) + '<h3>' + esc(s.name) + ' sleeps.</h3>' +
              '<p>Vismriti has drifted over its lamps — for now. ' + (s.id === FIRST
                ? 'Nothing is lost: this is where the story began, and it wakes without a road.'
                : 'Nothing is lost that a road and a story cannot bring back.') + '</p>' +
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

      /* THE WORLD STOPS ITSELF when something has a deadline on it. On a live speed
         the clock used to answer these three on the player's behalf — the grain went
         unsent, the quarrel festered, the blow landed — and losing to a timer you did
         not notice is not a decision anybody made. Sochna has no need of it. */
      if (G.autoPause && turnMs() && !pause) {
        var pd = pendingDecision();
        if (pd) { pause = true; syncPauseBtn(); say('The world waits \u2014 ' + pd + '.', 'warm'); }
      }

      G.delta = { at: G.t,
                  anna: Math.floor(G.res.anna) - res0.anna,
                  kala: Math.floor(G.res.kala) - res0.kala,
                  katha: Math.floor(G.res.katha) - res0.katha };
      if (G.t % 5 === 0) save(G);
      inTick = false;
      paintHud(); SITES.forEach(paintSite); paintGuide();
    }

    function helpEvent() {
      if (!G.ev) return;
      if (G.res.anna < T.eventAsk) return say('Not enough grain to send — grow the fields.', '');
      pay({ anna: T.eventAsk }); G.res.katha += T.eventKatha; G.score += 20;
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
    /* where a place is on the glass, through the svg's own transform */
    function siteScreen(s) {
      var svg = D.querySelector('#sab-stage svg');
      if (!svg || !svg.getScreenCTM || !svg.createSVGPoint) return null;
      var m = svg.getScreenCTM(); if (!m) return null;
      var pt = svg.createSVGPoint(); pt.x = s.x; pt.y = s.y;
      return pt.matrixTransform(m);
    }
    /* A LAMP IS A FINGER WIDE, NOT A PIXEL WIDE. A town drawn 30px across on a phone
       is a target a thumb misses as often as it hits, and a miss on the map clears the
       choice. A tap that lands on no place takes the nearest one within a fingertip —
       the same 44px every other touch target in the family is held to. */
    var TAP_R = 30;
    function nearSite(e) {
      if (!e || typeof e.clientX !== 'number') return null;
      var stage = D.getElementById('sab-stage');
      if (!stage || !stage.contains(e.target) || actAt(e.target)) return null;
      var best = null, bd = TAP_R * TAP_R;
      SITES.forEach(function (s) {
        if (!onMap(s)) return;
        var p = siteScreen(s); if (!p) return;
        var dx = p.x - e.clientX, dy = p.y - e.clientY, d2 = dx * dx + dy * dy;
        if (d2 <= bd) { bd = d2; best = s.id; }
      });
      return best;
    }
    /* THE CHOSEN PLACE STAYS IN SIGHT. On a phone its sheet rises over the bottom of
       the map, so a town near the bottom would be chosen and then hidden by its own
       card. After the double-tap window (moving sooner would pull the second tap off
       the town) the map glides it into the clear ground. */
    var revealTm = null;
    function revealSel(id) {
      clearTimeout(revealTm);
      revealTm = setTimeout(function () {
        if (dead || city || sel !== id || !byId[id]) return;
        var st = D.getElementById('sab-stage'), p = siteScreen(byId[id]);
        if (!st || !p) return;
        var sr = st.getBoundingClientRect(), I = gwIns(), pad = 28;
        var x0 = sr.left + I.l + pad, x1 = sr.right - I.r - pad, y0 = sr.top + I.t + pad, y1 = sr.bottom - I.b - pad;
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1) return;
        var sc = st.clientWidth / VZ.w;
        var dx = (p.x < x0 || p.x > x1) ? (p.x - (x0 + x1) / 2) / sc : 0;
        var dy = (p.y < y0 || p.y > y1) ? (p.y - (y0 + y1) / 2) / sc : 0;
        var from = { x: VZ.x, y: VZ.y };
        VZ.x += dx; VZ.y += dy; vzClamp();
        var to = { x: VZ.x, y: VZ.y };
        if (REDUCED || !W.requestAnimationFrame) { vzApply(); return; }
        VZ.x = from.x; VZ.y = from.y;
        var t0 = 0;
        var step = function (ts) {
          if (dead) return;
          if (!t0) t0 = ts;
          var k = Math.min(1, (ts - t0) / 260), e2 = 1 - Math.pow(1 - k, 3);
          VZ.x = from.x + (to.x - from.x) * e2; VZ.y = from.y + (to.y - from.y) * e2; vzApply();
          if (k < 1) W.requestAnimationFrame(step);
        };
        W.requestAnimationFrame(step);
      }, 480);
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
       scrollbars are not how anyone does that. Drag the board to pan, with a
       finger or with the mouse. ZOOM IS THE + AND \u2212 BUTTONS AND NOTHING
       ELSE — see the note by kitWheel's grave for why the wheel, the pinch
       and the double-tap all lost it. */
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

    /* One step of the + or \u2212 button. No pointer position any more:
       with the buttons the only way in, the thing to hold still is the middle
       of the view, which is what kitZoomTo does when it is given nothing. */
    function kitStep(d) {
      var i = ZOOMS.indexOf(G.kitZ || 1); if (i < 0) i = 2;
      kitZoomTo(ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, i + d))]);
    }

    var drag = null;

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
    /* ZOOM IS A DECISION, NOT A TWITCH — the same rule the realm map was
       given, for the same reason, now that the city board has a zoom of its
       own. The wheel and the pinch stepped the level, so a trackpad scroll or
       a clumsy two-finger drag kept yanking the city nearer and farther
       mid-thought, and a double-tap meant to enter a building zoomed instead.
       Zooming belongs to the + and \u2212 buttons and to nothing else. The
       wheel scrolls the page like everywhere else, and any number of fingers
       on the board can only pan it.

       This does NOT cost the keyboard its zoom (house rule: every game works
       by key as well as by finger). The buttons are real buttons — Tab reaches
       them and Enter presses them — so both hands still work; what is gone is
       zooming BY ACCIDENT. */

    /* A tap on the board is a placement, not a walk. The board's own scale
       lives on the element, so the sum works at every zoom and every turn. */
    /* THE CARD A BUILDING OPENS.
       A thing a child paid for and placed should be able to say what it is
       afterwards. This is that: the piece's own art, what it is, what it pays
       every turn, and — the part that makes a building matter — who it lets
       the city put to work, with the same two buttons that arrange the crew
       anywhere else. Ends with the count, so the answer to "why build a
       second workshop" is visible rather than asserted. */
    var openPiece = null;   /* the card on screen, so hiring from it redraws it */
    function showPiece(id, pc) {
      var it = BY_PART[pc.p], def = W.IND_KIT && W.IND_KIT.def(pc.p);
      if (!def) return;
      openPiece = { id: id, pc: pc };
      var q2 = G.sites[id], jt = jobsOf(id), popNow = popOf(id), busy = 0;
      JOB_IDS.forEach(function (j2) { busy += jt[j2]; });
      var give = '';
      if (it && it.give) {
        give = ['anna', 'kala', 'katha'].filter(function (k2) { return it.give[k2]; })
          .map(function (k2) { return '+' + it.give[k2] + ' ' + ICON[k2]; }).join('  ');
      }
      var extra = [];
      if (it && it.pop) extra.push('+' + it.pop + ' \ud83d\udc64 room to live');
      if (it && it.watch) extra.push('+' + it.watch + ' \ud83d\udee1\ufe0f on the gate');
      if (it && it.bld && BLD[it.bld]) extra.push('counts as a ' + (BLD[it.bld].name || it.bld));

      /* who this building is the reason for */
      var here = (BUILD.jobs || []).filter(function (r) {
        return (r.at || []).some(function (a2) {
          return a2.slice(-1) === '-' ? pc.p.indexOf(a2) === 0 : a2 === pc.p;
        });
      });
      var crewHtml = here.filter(function (r) { return spOf(r.j); }).map(function (r) {
        var jd = DATA.jobs[r.j], have = jt[r.j] || 0, open2 = jobOpen(id, r.j);
        var canAdd = open2 && (busy < popNow || (jt.kisan > 0 && r.j !== 'kisan'));
        return '<div class="sab-pcrew">' +
          '<img src="' + spOf(r.j) + '" alt="">' +
          '<span><b>' + esc(jd.name) + '</b><i>' + esc(jd.what) + '</i></span>' +
          '<span class="pmrow">' +
            '<button class="pm" data-sab-act="job" data-j="' + r.j + '" data-d="-1"' +
            (have ? '' : ' disabled') + ' aria-label="One fewer ' + esc(jd.name) + '">\u2212</button>' +
            '<em>' + have + '</em>' +
            '<button class="pm" data-sab-act="job" data-j="' + r.j + '" data-d="1"' +
            (canAdd ? '' : ' disabled') + ' aria-label="One more ' + esc(jd.name) + '">+</button>' +
          '</span></div>';
      }).join('');

      var n = builtCount(id, pc.p);
      showOverlay(
        '<div class="mono" style="color:var(--accent2)">' + esc(nameOf(byId[id])) + '</div>' +
        '<h3>' + esc(def.name) + '</h3>' +
        '<img class="sab-pcart" src="' + (W.IND_KIT.src(pc.p, 0) || '') + '" alt="">' +
        (it ? '<p>' + esc(it.what) + '</p>' : '') +
        (give ? '<p class="sab-pgive">' + give + ' <span>every turn</span></p>' : '') +
        (extra.length ? '<p class="tiny" style="color:var(--muted)">' + esc(extra.join(' \u00b7 ')) + '</p>' : '') +
        (crewHtml ? '<div class="sab-pcrews"><div class="mono">Who works here</div>' + crewHtml + '</div>' : '') +
        (n > 1 ? '<p class="tiny" style="color:var(--muted)">' + n + ' of these stand in the city.</p>' : '') +
        '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Back to the city</button></div>');
    }

    /* which built thing stands on this cell, if any */
    function pieceAt(id, cx, cy) {
      var q2 = kitOf(id), K2 = W.IND_KIT, found = null;
      q2.kit.forEach(function (b) {
        var d = K2.def(b.p); if (!d) return;
        var L = d.d[0] || 1, B = d.d[1] || 1;
        if (cx >= b.x && cx < b.x + L && cy >= b.y && cy < b.y + B) found = b;
      });
      if (found) return found;
      var t = q2.tiles && q2.tiles[cx + ',' + cy];
      return t ? { p: t, x: cx, y: cy, tile: true } : null;
    }

    /* lift a built piece for a third of what it cost, and hold it like a new one */
    function liftPiece(id, b) {
      var it = BY_PART[b.p];
      var fee = {};
      Object.keys((it && it.cost) || {}).forEach(function (k) {
        var v = Math.ceil(it.cost[k] / 3); if (v) fee[k] = v;
      });
      if (Object.keys(fee).length && !canPay(fee))
        return say('Lifting it costs ' + costStr(fee) + ' — not yet.', '');
      if (Object.keys(fee).length) pay(fee);
      var q = kitOf(id);
      q.kit = q.kit.filter(function (o) { return !(o.p === b.p && o.x === b.x && o.y === b.y); });
      hold = { p: b.p, cell: { x: b.x, y: b.y }, f: b.f || 0 };
      G.moving = false;
      touch(id);
      say('Lifted. Put it somewhere it is worth more.', 'warm');
      paintCity(); paintAll();
    }

    function kitTap(e) {
      if (!city || !kitOn(city)) return false;
      var inr = D.getElementById('sab-kitinner');
      if (!inr || !inr.contains(e.target)) return false;
      var r = inr.getBoundingClientRect();
      var k = parseFloat(inr.getAttribute('data-k')) || 1;
      var cell = W.IND_KIT.cellAtPx(city, (e.clientX - r.left) / k,
                                    (e.clientY - r.top) / k,
                                    G.kitRot || 0, 1, KIT_HEAD);
      if (!cell) return true;
      /* HANDS EMPTY, A TAP ASKS WHAT THIS IS. Everything a child had bought
         and put down was mute afterwards — the shop said what it would give
         and then the board never mentioned it again. Tapping one opens its
         card: what it is, what it pays every turn, and who it lets the city
         put to work. */
      if (!hold) {
        var pc = pieceAt(city, cell.x, cell.y);
        /* in move mode a tap LIFTS rather than explains */
        if (pc && G.moving) { liftPiece(city, pc); return true; }
        if (pc) showPiece(city, pc);
        return true;
      }
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

    /* the nearest thing with an action on it, SVG icons included */
    function actAt(el) {
      while (el && el !== host) {
        if (el.getAttribute && el.getAttribute('data-sab-act')) return el;
        el = el.parentNode;
      }
      return null;
    }
    function callRowAt(el) {
      var a = actAt(el);
      return a && a.getAttribute('data-sab-act') === 'call' ? a : null;
    }
    function onCallDown(e) { callDown = city ? callRowAt(e.target) : null; }
    function onCallUp(e) {
      var row = callDown; callDown = null;
      if (!row || !city) return;
      if (callRowAt(e.target) !== row) return;    /* lifted somewhere else */
      callTapAt = Date.now();
      try { showCall(city, row.getAttribute('data-c')); }
      catch (e5) { callTrouble('opening', e5); G.callAt = row.getAttribute('data-c'); }
      paintCity();
    }

    function onClick(e) {
      if (swallowClick) { swallowClick = false; return; }   /* that was a drag, not a tap */
      if (kitTap(e)) return;
      /* WALK IT, DO NOT ASK closest().
         Element.closest does not exist on SVG elements in some engines, and
         half the controls in this game have an SVG icon inside them — so a tap
         that landed on the icon rather than the padding fell straight through
         the `e.target.closest ? ... : null` guard and did nothing at all. A
         parentNode walk works on every node there is. */
      var actEl = actAt(e.target);
      if (!actEl || actEl.id !== 'sab-menu') closeMore();
      if (actEl) {
        var a = actEl.getAttribute('data-sab-act');
        if (a === 'tabtech') { D.getElementById('sab-tech').click(); return; }
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
          /* a role the city has not built the home for cannot be ADDED to;
             one already on the payroll may still be moved off */
          if (dd > 0 && !jobOpen(city, jid)) {
            say(DATA.jobs[jid].name + ' has nowhere to work yet — ' + jobNeed(city, jid) + '.', 'mist');
            return;
          }
          var total = 0;
          JOB_IDS.forEach(function (j2) { total += jj[j2]; });
          if (dd > 0 && total < popOf(city)) jj[jid]++;
          else if (dd > 0 && jj.kisan > 0 && jid !== 'kisan') { jj.kisan--; jj[jid]++; }   /* full town: new hands come off the fields */
          else if (dd < 0 && jj[jid] > 0) { jj[jid]--; jj.kisan++; }                        /* freed hands farm */
          touch(city); paintCity(); paintAll();
          /* hiring from a building's own card has to change that card, or the
             count under your thumb sits there stale and the button looks dead */
          if (openPiece && overlay) showPiece(openPiece.id, openPiece.pc);
          return;
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
          G.res.katha += T.reward.peace * (polEff('peace') || 1); G.score += 40;
          G.peaceMade = (G.peaceMade || 0) + 1; deed('peace'); blip('peace');
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
        /* WHICH WAY THE CITY GREW */
        if (a === 'growdir') {
          var gd = actEl.getAttribute('data-d'), gc2 = actEl.getAttribute('data-c');
          var gq = G.sites[gc2];
          if (gq) {
            if (!gq.grown) gq.grown = [];
            if (gq.grown.indexOf(gd) < 0) gq.grown.push(gd);
            var dn = '';
            DIRS.forEach(function (d3) { if (d3.id === gd) dn = d3.name; });
            say(nameOf(byId[gc2]) + ' spreads ' + dn + ' — there is room to build that way now.', 'warm');
          }
          overlay = null; D.getElementById('sab-ovhost').innerHTML = '';
          paintAll(); if (city) paintCity();
          return;
        }
        /* ==============================================================
           MOVING WHAT IS ALREADY BUILT
           ==============================================================
           A deliberate divergence, and the adjacency rules are what force it. Civ
           will not let you move a district, and that is a fair bargain with an adult
           who knew the rule when they placed it. A child meets the rule FOR THE FIRST
           TIME by placing something in the wrong spot — that is how they learn it —
           and a board where the first four lessons are permanent is a board they stop
           touching. So a thing can be lifted and set down again for a third of its
           price: enough that where it goes still matters, little enough that finding
           out is not a punishment. */
        if (a === 'kitmove' && city) {
          G.moving = !G.moving;
          if (G.moving) hold = null;
          say(G.moving ? 'Tap something you have built to lift it — it costs a third of its price to set down again.'
                       : '', '');
          paintCity(); return;
        }
        /* ADOPTING A CUSTOM, and slotting the card it opens */
        if (a === 'riti') {
          var rid2 = actEl.getAttribute('data-r'), rd = RITI_BY[rid2];
          if (!rd || (G.riti || {})[rid2]) return;
          if (!ritiOpenFor(rd)) { say(rd.name + ' waits on ' + ritiMissing(rd).join(' and ') + '.', ''); return; }
          var rc = costOf(rd.cost, 'riti');
          if (!canPay(rc)) return;
          pay(rc);
          if (!G.riti) G.riti = {};
          G.riti[rid2] = true; G.score += 25; deed('riti');
          say(rd.name + ' — the realm takes it up. ' + (POL_BY[rd.gives] || {}).name +
              ' is yours to slot.', 'warm');
          paintTech(); paintAll(); return;
        }
        if (a === 'pol') {
          var pidw = actEl.getAttribute('data-p'), slot = +actEl.getAttribute('data-s') || 0;
          if (!G.pol) G.pol = [];
          if (polOpen().indexOf(pidw) < 0) return;
          /* swapping is free, on purpose: a nine-year-old must be able to change
             their mind about how their realm works */
          var was = G.pol.indexOf(pidw);
          if (was >= 0) G.pol[was] = null;
          G.pol[slot] = pidw;
          say((POL_BY[pidw] || {}).name + ' — in force.', 'warm');
          paintTech(); paintAll(); return;
        }
        if (a === 'polclear') {
          var cs = +actEl.getAttribute('data-s') || 0;
          if (G.pol) G.pol[cs] = null;
          paintTech(); paintAll(); return;
        }
        /* THE WORLD PANEL — who is out there and what they are asking for */
        if (a === 'turn') { stepTurn(); return; }
        if (a === 'railgo') {
          var rg = actEl.getAttribute('data-g');
          if (rg && byId[rg]) { sel = rg; targeting = false; zoomTo(byId[rg]); paintAll(); }
          return;
        }
        if (a === 'hush') {
          if (!G.hushed) G.hushed = {};
          /* G.t + 1, NOT G.t. Storing the turn number as the marker meant a row
             dismissed on turn 0 stored 0, which is falsy, so the filter that hides
             hushed rows never hid it — the button appeared to do nothing, and only on
             the first turn of a game, which is the one turn every child sees. Keeping
             the turn (rather than `true`) leaves room for hushes that expire. */
          G.hushed[actEl.getAttribute('data-k')] = G.t + 1;
          paintAll(); return;
        }
        if (a === 'sisters') {
          var sis = sisters(), rem = remembered();
          showOverlay('<div class="mono" style="color:var(--accent2)">the rest of India</div>' +
            '<h3>' + rem.lit + ' of ' + rem.all + ' lamps lit — ' + rem.pct + '%</h3>' +
            '<p>These places are not yours to light and their troubles are not yours to cause. ' +
            'The meter counts every lamp in India, not only the ones on your roads, and it only ' +
            'ever goes up — so somebody else waking a town is good news here.</p>' +
            (sis.length ? '<ul style="margin:6px 0;padding-left:18px">' + sis.map(function (x) {
              return '<li class="tiny"><b>' + esc(nameOf(x)) + '</b> sleeps, off your roads.</li>';
            }).join('') + '</ul>' : '<p class="tiny">Every place you have found is on a road of yours.</p>') +
            '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Back</button></div>');
          return;
        }
        if (a === 'advise') {
          var go = actEl.getAttribute('data-go');
          /* the line is the advice; the tap is a shortcut only when there is somewhere
             to be taken. Sending a child to an unrelated panel would be worse than
             doing nothing. */
          if (go && byId[go]) { sel = go; targeting = false; zoomTo(byId[go]); paintAll(); }
          return;
        }
        if (a === 'digest') {
          var lg = (G.log || []).slice(0, 12).map(function (l) {
            return '<li class="tiny"><b>turn ' + (l.t + 1) + '</b> · ' + esc(l.s) + '</li>';
          }).join('');
          /* AND THE REPLAY: which lamp lit when, which is the emotional payoff of a
             game that spans five thousand years and was nowhere on screen. */
          var lit = SITES.filter(function (x) { return G.sites[x.id].litAt != null; })
            .sort(function (a8, b8) { return G.sites[a8.id].litAt - G.sites[b8.id].litAt; })
            .map(function (x) {
              return '<li class="tiny">turn ' + (G.sites[x.id].litAt + 1) + ' — <b>' +
                esc(nameOf(x)) + '</b> woke</li>';
            }).join('');
          showOverlay('<div class="mono" style="color:var(--accent2)">what has been happening</div>' +
            '<h3>The last dozen things</h3>' +
            '<ul style="margin:6px 0;padding-left:18px">' + (lg || '<li class="tiny">Nothing yet.</li>') + '</ul>' +
            (lit ? '<div class="mono" style="margin-top:10px">Every lamp, in the order you lit it</div>' +
                   '<ul style="margin:6px 0;padding-left:18px">' + lit + '</ul>' : '') +
            '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Back</button></div>');
          return;
        }
        if (a === 'yields') { yieldCard(actEl.getAttribute('data-c') || city || sel); return; }
        if (a === 'scen') {
          var sid3 = actEl.getAttribute('data-s');
          overlay = null; D.getElementById('sab-ovhost').innerHTML = '';
          wipe(); startScenario(sid3); return;
        }
        if (a === 'dedicate') {
          G.ded = actEl.getAttribute('data-d');
          var dd3 = null; DEDS.forEach(function (x) { if (x.id === G.ded) dd3 = x; });
          overlay = null; D.getElementById('sab-ovhost').innerHTML = '';
          say('This age is dedicated to ' + (dd3 ? dd3.name : '') + '. ' + (dd3 ? dd3.what : ''), 'warm');
          paintAll(); return;
        }
        if (a === 'timeline') {
          var past = (G.ages || []).map(function (a4) {
            return '<div class="sab-work' + (a4.good ? ' built' : '') + '">' +
              '<i>' + (a4.good ? '★' : '·') + '</i>' +
              '<span><b>' + esc(a4.name) + '</b> · <span class="tiny" style="color:var(--muted)">' +
              (a4.good ? 'a golden age' : 'a quiet age') + ' — ' + a4.score + ' of ' + a4.bar +
              '</span></span></div>';
          }).join('');
          showOverlay('<div class="mono" style="color:var(--accent2)">the ages behind you</div>' +
            '<h3>Five thousand years, so far</h3>' +
            '<div class="sab-works">' + (past ||
              '<div class="sab-work"><span>The first age is still going.</span></div>') + '</div>' +
            '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Back</button></div>');
          return;
        }
        if (a === 'world') {
          var rows2 = partnersNow().map(function (pd2) {
            var r3 = (G.req || {})[pd2.id];
            var can = canSupply(pd2.wants);
            var pr = Math.round(marketPrice(pd2.wants) * 100);
            return '<div class="sab-work' + (r3 ? ' now' : '') + '">' +
              '<i>' + (G.diaspora && G.diaspora[pd2.id] ? '⚑' : favour(pd2.id) ? '★' : '○') + '</i>' +
              '<span><b>' + esc(pd2.name) + '</b> · <span class="tiny" style="color:var(--muted)">' +
              esc(pd2.blurb) + '</span>' +
              '<span class="tiny" style="color:var(--accent2);font-weight:800">wants ' + esc(pd2.wants) +
              ' · paying ' + pr + '% · favour ' + favour(pd2.id) + '</span>' +
              (r3 ? '<span class="sab-need">asking now — ' + Math.max(0, r3.due - G.t) + ' turns left</span>'
                  : '') +
              '</span><span style="flex:1"></span>' +
              (r3 ? (can ? '<button class="sab-btn go" data-sab-act="fill" data-p="' + pd2.id + '">send it</button>'
                         : '<span class="tiny" style="color:var(--muted)">no road reaches it</span>')
                  : '<button class="sab-btn" data-sab-act="envoy" data-p="' + pd2.id + '"' +
                    (G.res.katha >= 20 ? '' : ' disabled') + '>envoy · 20 📜</button>') +
              '</div>';
          }).join('');
          showOverlay('<div class="mono" style="color:var(--accent2)">the sea roads</div>' +
            '<h3>Who is out there</h3>' +
            '<p class="tiny">Nobody here is an enemy and nobody can be. They ask, they pay, and they ' +
            'remember — and the price of a thing falls the more of it you sell, so a realm that reaches ' +
            'many different places is worth more than a big one.</p>' +
            '<div class="sab-works">' + (rows2 || '<div class="sab-work"><span>No ships this age.</span></div>') + '</div>' +
            '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">Back</button></div>');
          return;
        }
        if (a === 'fill') { fillRequest(actEl.getAttribute('data-p')); paintAll(); act('world'); return; }
        /* AN ENVOY IS FAVOUR BOUGHT WITH STORIES, not with grain — the only currency
           this game lets you spend on somebody else's goodwill. */
        if (a === 'envoy') {
          var ep = actEl.getAttribute('data-p');
          if (G.res.katha < 20) return;
          pay({ katha: 20 });
          if (!G.fav) G.fav = {};
          G.fav[ep] = favour(ep) + 1;
          var en = ''; PARTNERS.forEach(function (x) { if (x.id === ep) en = x.name; });
          say('An envoy sails for ' + en + ' with a season of stories. Favour ' + favour(ep) + '.', 'warm');
          maybeDiaspora(ep);
          paintAll(); act('world'); return;
        }
        if (a === 'khushi') {
          var gr = goodsReached(), ks = Object.keys(gr).sort();
          showOverlay('<div class="mono" style="color:var(--accent2)">khushi — what the roads reach</div>' +
            '<h3>' + khushiHave() + ' of ' + khushiWant() + ' kinds of thing</h3>' +
            '<p>A realm is content when its roads reach enough DIFFERENT places — not enough places. ' +
            'Eight farming towns are eight of the same thing; a farm, a workshop and a school are three. ' +
            (restless() ? 'Yours is short by ' + restless() + '. Reach somewhere unlike home and it lifts — ' +
              'nothing is lost meanwhile, the towns just work slower.'
                        : 'Yours has plenty, and every town works at full pace.') + '</p>' +
            (ks.length ? '<ul style="margin:6px 0 0;padding-left:18px">' + ks.map(function (k2) {
              return '<li class="tiny">' + esc(k2) + ' ×' + gr[k2] + '</li>'; }).join('') + '</ul>'
                       : '<p class="tiny">No road reaches anything yet.</p>') +
            '<div class="row"><button class="sab-btn go" data-sab-act="ovclose">I see</button></div>' +
            '<div class="row"><button class="sab-btn" data-sab-act="sisters">And the rest of India</button></div>');
          return;
        }
        if (a === 'kitturn') {
          G.kitRot = ((G.kitRot || 0) + 1) % 4;
          paintCity(); paintAll(); return;
        }
        /* zoom is the board's own, not the yatri camera's: a city you can
           build in is a city you must be able to lean into */
        if (a === 'kitzoom') { kitStep(+actEl.getAttribute('data-d') || 1); return; }
        if (a === 'calls' && city) {
          if (G.callAt) { G.callAt = null; openCall = null; G.callsOpen = true; }
          else G.callsOpen = !G.callsOpen;
          paintCity(); return;
        }
        if (a === 'callback' && city) {
          G.callAt = null; openCall = null; G.callsOpen = true; paintCity(); return;
        }
        if (a === 'call' && city) {
          /* the row already answered on pointerup; this is the click that
             followed it, and opening the same card twice would close it */
          if (Date.now() - callTapAt < 900) return;
          try { showCall(city, actEl.getAttribute('data-c')); }
          catch (e6) { callTrouble('opening', e6); G.callAt = actEl.getAttribute('data-c'); }
          paintCity(); return;
        }
        if (a === 'leave' && city) { city = null; riddleWrong = false; quiz = null; paintCity(); paintAll(); return; }
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
          if (worksRunning() >= worksCap()) {
            say('The realm can raise ' + worksCap() + ' great work' + (worksCap() > 1 ? 's' : '') +
                ' at a time, and the masons are all out. Which city gets this age is the decision.', '');
            return;
          }
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
            pay({ kala: T.eventAsk }); finishQuest(city, 'The carts roll in.');
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
          if (!techOpenFor(td)) { say(td.name + ' waits on ' + techMissing(td).join(' and ') + '.', ''); return; }
          var tc = techCost(td);
          if (!canPay(tc)) return;
          if (G.proj) { say('The school is already at work on ' +
            (function () { var o = ''; TECHS.forEach(function (t2) { if (t2.id === G.proj.id) o = t2.name; }); return o; })() +
            '. One thing at a time.', 'warm'); return; }
          pay(tc);
          G.proj = { id: tid, at: G.rt, dur: techDur(td) };
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
      var id = siteAt(e.target) || nearSite(e);
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
        /* ON A PHONE, A TAP ON THE PLACE YOU HAVE ALREADY CHOSEN GOES IN — at any
           pace. A double tap is a gesture you have to be told about; "tap it, then tap
           it again" is the one every phone already taught. */
        if (!again && lastPtr !== 'mouse' && sel === id && qd && !qd.zzz && !overlay) again = true;
        if (again && qd && !qd.zzz && qd.fade < 0) {
          lastTap = { id: null, t: 0 };
          sel = id; kbd = id; act('city');
          return;
        }
        sel = id; kbd = id; paintAll();
        if (gm) revealSel(id);
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
      /* THE TURN HAS A KEY, everywhere, even standing in a city — the house rule is
         that everything works by finger AND by key, and the turn is now the most
         used verb in the game. */
      if ((e.key === ' ' || e.key === 'Spacebar') && !overlay && !quiz) { eat(); stepTurn(); return; }
      if ((e.key === 'n' || e.key === 'N') && !overlay) { eat(); gotoNextDecision(); return; }
      if ((e.key === 'z' || e.key === 'Z') && !overlay) { eat(); undoNow(); return; }
      if (city) {
        /* Escape unwinds one thing at a time, innermost first: put the held
           piece back, then close the city. Closing the city while a child is
           holding a hut is not what Escape means. */
        if (e.key === 'Escape' && G.callAt) {
          eat(); G.callAt = null; openCall = null; G.callsOpen = true; paintCity(); return;
        }
        if (e.key === 'Escape' && G.callsOpen) { eat(); G.callsOpen = false; paintCity(); return; }
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
    function syncPauseBtn() {
      var b = D.getElementById('sab-pause');
      if (!b) return;
      b.textContent = pause ? '▶ Play' : '⏸ Pause';
      b.setAttribute('aria-label', pause ? 'Play' : 'Pause');
      b.setAttribute('aria-pressed', String(pause));
      b.hidden = !turnMs();          /* in Sochna there is nothing to pause */
    }
    function togglePause() {
      pause = !pause;
      syncPauseBtn();
      say(pause ? 'The world holds its breath.' : '', '');
    }

    /* ================================================================
       THE CLOCK — how long a turn is, and who decides it passes
       ================================================================ */
    function turnMs() { return (SPEED_BY[G.speed] || SPEED_BY.standard).ms; }
    function armClock() {
      if (timer) { clearInterval(timer); timer = null; }
      var ms = turnMs();
      if (ms) timer = setInterval(tick, ms);
    }
    function setSpeed(id) {
      if (!SPEED_BY[id]) return;
      G.speed = id;
      if (!turnMs()) pause = false;      /* a stopped world cannot also be paused */
      armClock(); syncPauseBtn(); paintAll();
      say(SPEED_BY[id].name + ' — ' + SPEED_BY[id].what + '.', '');
    }
    /* AGLA SAAL — next year. One turn, asked for, from wherever you are standing. */
    function stepTurn() {
      if (G.won || dead || overlay) return;
      blip('turn');
      tick(true);
      paintAll(); if (city) paintCity();
    }

    /* WHAT IS WAITING ON A DECISION THAT CAN BE MISSED. Not the whole bell: a
       monument you could start is not urgent, and stopping the world for it would
       stop the world for ever. These three have deadlines — the help that expires,
       the quarrel that festers, the blow that lands — and they are exactly the
       things the running clock used to decide on the player's behalf. */
    function pendingDecision() {
      if (G.ev) return 'a neighbour is asking for grain';
      if (G.disp) return 'a quarrel wants your panchayat';
      if (G.warn) return 'something is coming to ' + nameOf(byId[G.warn.id]);
      return null;
    }

    /* ================================================================
       UNDO — one spend, taken back
       ================================================================
       Civ does not have this and should not: an adult who mis-clicks has chosen
       badly and that is the game. A nine-year-old who mis-taps has been robbed of
       sixty anna by a finger, and the session ends there. So every purchase — and
       only a purchase, which is why the hook is inside pay() where all six of them
       meet — leaves a snapshot behind, good until the turn turns. In Sochna that is
       exactly as long as the decision itself. */
    /* AND IT MUST NOT REWIND THE WORLD. The first cut snapshotted inside pay() and
       allowed the undo for the rest of the turn, which meant a purchase made early in
       a turn could be taken back AFTER the raid that landed later in it — undoing the
       mist, which is precisely what this must never do. Two rules close it:

         · a snapshot is only taken OUTSIDE a turn, so the queue's own spending (which
           the player already authorised when they set the plan) leaves none, and
         · the snapshot dies the moment a turn passes, counted by a sequence number
           rather than G.t, so nothing that happened in a turn can ever be inside the
           window that undoes it.

       What is left is exactly the misclick: the spend you have not yet lived with. */
    var undoSnap = null, tickSeq = 0, inTick = false;
    function undoPoint() {
      if (inTick) return;
      try { undoSnap = { seq: tickSeq, g: JSON.parse(JSON.stringify(G)) }; } catch (e) { undoSnap = null; }
    }
    function canUndo() { return !!(undoSnap && undoSnap.seq === tickSeq && !G.won); }
    function undoNow() {
      if (!canUndo()) return;
      G = undoSnap.g; undoSnap = null;
      sel = null; targeting = false; hold = null;
      armClock(); paintAll(); if (city) paintCity();
      say('Taken back.', 'warm');
    }

    /* THE NEXT THING THAT WANTS YOU. Civ's blinking End Turn, which is really a
       promise: you will never have to hunt the map for what you forgot. */
    function decisionList() {
      var out = [];
      if (G.warn && byId[G.warn.id]) out.push({ id: G.warn.id, why: 'a warning' });
      if (G.disp) out.push({ id: G.disp.a, why: 'a quarrel' });
      SITES.forEach(function (s) {
        if (!onMap(s) || !awake(s.id)) return;
        var w = cityJobsWaiting(s.id);
        if (w.length) out.push({ id: s.id, why: w[0].name.toLowerCase() });
      });
      return out.filter(function (x, i, a) {
        return byId[x.id] && a.findIndex(function (y) { return y.id === x.id; }) === i;
      });
    }
    function gotoNextDecision() {
      var L = decisionList();
      if (!L.length) { say('Nothing is waiting — the realm is yours to shape.', 'warm'); return; }
      var next = L.find(function (x) { return x.id !== sel; }) || L[0];
      sel = next.id; targeting = false;
      zoomTo(byId[next.id]); paintAll();
      say(nameOf(byId[next.id]) + ' — ' + next.why + '.', '');
    }

    /* THE CITY'S PLAN — Civ's production queue, which is the difference between
       deciding once and deciding forty times. Buildings and the monument queue
       here because neither needs a cell chosen; what goes on the board is placed
       by hand, because placing it IS the decision (see the adjacency rules). */
    function planStep(id) {
      var q = G.sites[id];
      if (!q || q.zzz || q.her || !q.plan || !q.plan.length) return;
      var head = q.plan[0];
      if (head.kind === 'building') {
        var bd = BLD[head.id];
        if (!bd || q.bld[head.id] || bd.era > G.era) { q.plan.shift(); return planStep(id); }
        var c = costOf(bd.cost, 'building');
        if (!canPay(c)) return;
        pay(c); q.bld[head.id] = true; touch(id); G.score += 15; q.plan.shift();
        say(bd.name + ' raised in ' + nameOf(byId[id]) + ' — it was next in the plan.', 'warm');
      } else if (head.kind === 'monument') {
        /* a monument is the city's own work (monB), not the realm's research slot */
        if (q.mon || q.monB) { q.plan.shift(); return; }
        if (q.lv < 3) return;                       /* wait for the town to grow */
        var mc = costOf(T.monCost[byId[id].era], 'monument');
        if (!canPay(mc)) return;
        pay(mc); q.monB = { at: G.rt, dur: monDur(id) };
        touch(id); q.plan.shift();
        say('The foundation is laid at ' + nameOf(byId[id]) + ' \u2014 it was next in the plan.', 'warm');
      }
    }
    function planAdd(id, kind, what) {
      var q = G.sites[id]; if (!q) return;
      if (!q.plan) q.plan = [];
      if (q.plan.length >= 4) { say('Four things is a plan; five is a wish.', ''); return; }
      if (q.plan.some(function (x) { return x.kind === kind && x.id === what; })) return;
      q.plan.push({ kind: kind, id: what });
      say('Added to the plan at ' + nameOf(byId[id]) + '.', '');
    }

    /* ================================================================
       BOOT — resume a saved sabhyata or begin at Dholavira
       ================================================================ */
    var saved = load();
    G = (saved && !saved.won && saved.sites && saved.sites[FIRST]) ? saved : fresh();
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
    function closeMore() {
      var m = D.getElementById('sab-more');
      if (m && !m.hidden) {
        m.hidden = true;
        var b = D.getElementById('sab-menu');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    }
    function bindHud() {
      D.getElementById('sab-adv').addEventListener('click', advance);
      D.getElementById('sab-pause').addEventListener('click', function () { togglePause(); closeMore(); });
      D.getElementById('sab-turn').addEventListener('click', stepTurn);
      D.getElementById('sab-world').addEventListener('click', function () { closeMore(); act2('world'); });
      /* THE MENU. Everything that is not the map lives behind it, and it shuts the
         moment anything inside it is used — a drawer left hanging open is the same
         stolen screen the bar used to take, only now it is the player's fault. */
      D.getElementById('sab-menu').addEventListener('click', function (e2) {
        e2.stopPropagation();
        var m = D.getElementById('sab-more');
        m.hidden = !m.hidden;
        D.getElementById('sab-menu').setAttribute('aria-expanded', String(!m.hidden));
      });
      D.getElementById('sab-next').addEventListener('click', gotoNextDecision);
      D.getElementById('sab-undo').addEventListener('click', function () { undoNow(); closeMore(); });
      D.getElementById('sab-speed').addEventListener('change', function (e2) { setSpeed(e2.target.value); closeMore(); });
      D.getElementById('sab-tech').addEventListener('click', function () {
        closeMore();
        techOpen = !techOpen; if (techOpen) { city = null; quiz = null; } paintTech(); });
      D.getElementById('sab-restart').addEventListener('click', function () {
        city = null; techOpen = false; paintCity(); paintTech();
        showOverlay('<h3>Start the sabhyata again?</h3>' +
          '<p>The whole journey begins afresh at Dholavira, and this one is forgotten. There is no undo.</p>' +
          '<div class="row"><button class="sab-btn go" data-sab-act="restart2">Start again</button>' +
          '<button class="sab-btn" data-sab-act="ovclose">Keep playing</button></div>' +
          '<p class="tiny" style="color:var(--muted);margin-top:10px">Or begin in the middle, with a realm ' +
          'that already works — shorter, and the only way most players ever see the later ages:</p>' +
          '<div class="row">' + SCENARIOS.map(function (sc2) {
            return '<button class="sab-btn" data-sab-act="scen" data-s="' + sc2.id + '"' +
              ' title="' + esc(sc2.blurb) + '">' + esc(sc2.name) + '</button>';
          }).join('') + '</div>');
      });
      var st2 = D.getElementById('sab-stage');
      st2.addEventListener('pointerdown', onPointerDown);
    }
    bindHud();
    openFraming();
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
    host.addEventListener('pointermove', kitHover);
    host.addEventListener('pointerdown', kitPointerDown);
    host.addEventListener('pointerdown', onCallDown);
    host.addEventListener('pointerup', onCallUp);
    D.addEventListener('pointermove', kitPointerMove);
    D.addEventListener('pointerup', kitPointerUp);
    D.addEventListener('pointercancel', kitPointerUp);
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
    /* a check has to be able to PLAY, not just look: one turn, one speed, one undo */
    W.__SABDO = { turn: stepTurn, speed: setSpeed, undo: undoNow,
                  next: gotoNextDecision, plan: planAdd, paint: paintAll,
                  act: function (id, name) { sel = id; act(name); },
                  kity: kitYield, adjPrev: adjPreview, adj: adjTotal,
                  terrain: function (id, x, y) { return W.IND_KIT.terrain(id, x, y); },
                  river: riverAnna, reachTo: reachTo, monShelter: monShelter,
                  lift: liftPiece,
                  techOpen: techOpenFor, ritiOpen: ritiOpenFor, techCost: techCost,
                  eureka: eurekaPct, eurekaN: eurekaCount, techDur: techDur,
                  polEff: polEff, polSlots: polSlots, polOpen: polOpen,
                  good: goodOf, goods: goodsReached, khushi: function () {
                    return { want: khushiWant(), have: khushiHave(), restless: restless() }; },
                  worksCap: worksCap, worksRunning: worksRunning, upkeep: upkeep,
                  storeCap: storeCap, migrate: migrate, soften: soften,
                  partners: partnersNow, favour: favour, ask: askPartner,
                  fill: fillRequest, price: marketPrice, canSupply: canSupply,
                  act2: act2,
                  eraScore: eraScore, eraBar: eraBar, golden: golden, deed: deed,
                  verdict: ageVerdict, vics: victoriesWon, wakeCost: wakeCost,
                  dedEff: dedEff, scenario: startScenario, scenarios: function () { return SCENARIOS; },
                  advise: advise, yieldLedger: function (id) {
                    var led = []; var y = yieldOf(byId[id], led); return { y: y, led: led }; },
                  digestLog: function () { return G.log || []; },
                  goodLock: goodLock, sisters: sisters, remembered: remembered,
                  zoom: zoomTo, labScale: labScale,
                  canPlace: function (id, part, x, y) {
                    return canPlace(id, BY_PART[part], x, y); } };
    W.__SAB = function () {
      return { t: G.t, rt: G.rt, won: !!G.won, pause: pause, dead: dead,
               overlay: !!overlay, city: city, techOpen: techOpen, warn: G.warn,
               era: G.era, proj: G.proj,
               speed: G.speed, turnMs: turnMs(), canUndo: canUndo(),
               waiting: decisionList().length };
    };
    armClock();
    syncPauseBtn();
    if (!REDUCED) lifeRAF = requestAnimationFrame(lifeStep);

    return function teardown() {
      dead = true;
      /* the window goes back to being a page — including when the game is left from
         inside a full city, which used to leave the page unable to scroll */
      D.body.classList.remove('sab-mapfull');
      D.body.classList.remove('sab-full');
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
