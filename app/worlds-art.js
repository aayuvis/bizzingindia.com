/* ============================================================================
   worlds-art.js — Worlds 2.0: fifteen EXPERIENCE worlds for Bizzing India.

   COMPLETELY SELF-CONTAINED. Injects its own CSS, mounts its own ambient DOM
   layer, reads <html data-world="…"> and reacts to changes by itself
   (MutationObserver). The shell talks to it only through:

     window.IND_WORLDS      — the manifest  { list:[…15], get(id) }
     window.IND_WORLDS_ART  — the engine    { mount(), unmount(), refresh() }

   Design rules honoured here (CLAUDE.md + docs/05):
   - Folk art credited: every world carries a `credit` naming tradition + place.
   - Nothing sacred as decor: Pujo never depicts or abstracts the murti;
     Diwali has no deities; Dance has no deity iconography (no Nataraja).
     Vocabularies are craft/street/festival language only.
   - Legal renames honoured: 'Cricket Fever' (never the league's trademark),
     'Antariksh' (never the agency's name or logo).
   - All animation is transform/opacity only (compositor-friendly for cheap
     family tablets); hashed negative delays desync everything.
   - TWO kill switches, both implemented now:
       @media (prefers-reduced-motion: reduce)  and  html[data-calm="1"]
   - Offline-first: zero network requests — every asset is an inline string.
   - The layer never intercepts clicks (pointer-events:none everywhere) and
     never causes layout shift (fixed positioning, z-index under the topbar).
   ============================================================================ */
(function () {
  'use strict';
  if (window.IND_WORLDS_ART && window.IND_WORLDS_ART.__loaded) return;

  /* ------------------------------------------------------------- colour utils */
  function hx(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mix(a, b, t) {
    var A = hx(a), B = hx(b), s = '#', i, v;
    for (i = 0; i < 3; i++) { v = Math.round(A[i] + (B[i] - A[i]) * t).toString(16); s += (v.length < 2 ? '0' : '') + v; }
    return s;
  }
  function rgba(h, a) { var c = hx(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function hashN(s, m) { var h = 0, i; for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000; return h % m; }
  /* hashed negative animation-delay so nothing on the page ever pulses in sync */
  function dly(seed, spreadMs, extraStyle) {
    return ' style="animation-delay:-' + (hashN(seed, spreadMs) / 1000).toFixed(2) + 's' + (extraStyle ? ';' + extraStyle : '') + '"';
  }
  function rep(n, fn) { var s = '', i; for (i = 0; i < n; i++) s += fn(i); return s; }
  function mtile(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")'; }

  /* ============================================================== THE MANIFEST
     Six token slots per world: ground / surface / ink / accent / accent2 /
     festive. The engine derives the rest of the app token set from these.
     `full:true`  = signature ambient scene shipped (tranche 1)
     `full:false` = foundation only: tokens + corner motif + tile
                    (living footer scene comes in tranche 2 — see TODO at EOF) */
  var W = [
    { id: 'delhi6', name: 'Delhi 6', region: 'Purani Dilli, Delhi', full: true,
      note: 'Jalebi spirals, wheeling kabootar and rickshaw bells in the lanes of Chandni Chowk.',
      credit: 'Purani Dilli street life — Chandni Chowk & the Red Fort sandstone, Delhi. Drawn in-house.',
      t: { ground: '#f8ecdd', surface: '#fffcf6', ink: '#3e1b10', accent: '#ba4a2a', accent2: '#e9a13b', festive: '#2e7d6e' } },

    { id: 'mumbai', name: 'Mumbai Bustle', region: 'Mumbai, Maharashtra', full: true,
      note: 'Local trains, dabbawala tiffins and a necklace of lights along Marine Drive.',
      credit: 'Mumbai city life — local trains, dabbawalas, monsoon and art-deco Marine Drive. Drawn in-house.',
      t: { ground: '#edf0f2', surface: '#fffdf6', ink: '#1d2733', accent: '#256d85', accent2: '#f2b90d', festive: '#d94e63' } },

    { id: 'pujo', name: 'Durga Pujo', region: 'Kolkata, West Bengal', full: true,
      /* SACRED-SAFE: only the pandal's bamboo-and-cloth craft, lights, dhaak
         and shiuli flowers. The murti is NEVER depicted or abstracted. */
      note: 'Bamboo pandals rising, string lights chasing and the heartbeat of the dhaak.',
      credit: 'Pandal craft of Durga Pujo — bamboo, cloth and lights, Kolkata, West Bengal. Drawn in-house; the murti is never pictured.',
      t: { ground: '#fbf1e8', surface: '#ffffff', ink: '#46150f', accent: '#c1272d', accent2: '#e8b00e', festive: '#ee7a3b' } },

    { id: 'dallake', name: 'Dal Lake', region: 'Srinagar, Kashmir', full: true,
      note: 'A shikara glides through mirror water while chinar leaves drift down.',
      credit: 'Dal Lake, shikara craft and Kashmiri papier-mâché florals — Srinagar, Kashmir. Drawn in-house.',
      t: { ground: '#e8eff2', surface: '#fcfdfd', ink: '#253844', accent: '#33718a', accent2: '#d9822b', festive: '#b04a3a' } },

    { id: 'rajasthan', name: 'Forts of Rajasthan', region: 'Rajasthan', full: true,
      note: 'Kites loop over jharokha windows and a camel caravan walks the golden sand.',
      credit: 'Jharokha stonework, bandhani and leheriya — Rajasthan. Drawn in-house.',
      t: { ground: '#f9eedc', surface: '#fffcf4', ink: '#40260d', accent: '#2d5f9e', accent2: '#dfa032', festive: '#d8447c' } },

    { id: 'madhubani', name: 'Madhubani', region: 'Mithila, Bihar', full: true,
      note: 'Fish, lotuses and suns, double-outlined, painted by women on village walls.',
      credit: 'In the idiom of Madhubani (Mithila) painting — Mithila, Bihar. A living tradition painted by Mithila women; rendered in-house until a Mithila artist is commissioned.',
      t: { ground: '#fdf1e6', surface: '#fffdfa', ink: '#3a1410', accent: '#c63c28', accent2: '#e2951f', festive: '#2f6f5e' } },

    { id: 'taj', name: 'Taj Mahal', region: 'Agra, Uttar Pradesh', full: false,
      note: 'Marble catching the dawn, flowers set in stone, a garden in perfect halves.',
      credit: 'Pietra-dura inlay and char-bagh geometry of the Taj Mahal — Agra, Uttar Pradesh. Drawn in-house.',
      t: { ground: '#f3efea', surface: '#fefdfb', ink: '#322b36', accent: '#8c5a74', accent2: '#c99a4b', festive: '#3e7c6f' } },

    { id: 'cricket', name: 'Cricket Fever', region: 'All of India', full: false,
      /* Deliberately team-agnostic and league-agnostic (no trademarks). */
      note: 'Floodlights on, scoreboard ticking, a six sailing over the rope.',
      credit: 'Cricket — India’s shared festival, every gully and maidan. Drawn in-house; no team or league marks.',
      t: { ground: '#eaf2ea', surface: '#ffffff', ink: '#14301d', accent: '#1e7a46', accent2: '#efb71e', festive: '#e0483f' } },

    { id: 'bollywood', name: 'Bollywood', region: 'Mumbai, Maharashtra', full: false,
      note: 'Hand-painted posters, marquee bulbs chasing and one dramatic shimmer.',
      credit: 'Hand-painted film-poster and marquee craft of Hindi cinema — Bombay’s poster painters. Drawn in-house.',
      t: { ground: '#fbedde', surface: '#fff9f0', ink: '#3a1030', accent: '#c42a6c', accent2: '#f0a519', festive: '#2c63a8' } },

    { id: 'antariksh', name: 'Antariksh', region: 'Sriharikota to the stars', full: false,
      /* No space-agency name, logo or insignia — our own rocket silhouette. */
      note: 'Countdown, lift-off — a rocket climbs from the coast into a field of stars.',
      credit: 'India’s space adventure — countdowns, launch arcs and tracking dishes. Drawn in-house; no agency marks.',
      t: { ground: '#e9edf6', surface: '#ffffff', ink: '#131c3a', accent: '#27407f', accent2: '#e8862b', festive: '#5b4fc0' } },

    { id: 'diwali', name: 'Diwali Nights', region: 'All of India', full: false,
      /* SACRED-SAFE: diyas, phuljhari, rangoli, toran — never deities as decor. */
      note: 'Rows of diyas flickering, phuljhari sparks and rangoli at every doorstep.',
      credit: 'Diya, rangoli and toran craft of Diwali — celebrated across India. Drawn in-house; no deities as decor.',
      t: { ground: '#fbeedc', surface: '#fffaf0', ink: '#43210b', accent: '#b3541e', accent2: '#f0ac29', festive: '#8a3a69' } },

    { id: 'holi', name: 'Holi Hai', region: 'All of India', full: false,
      note: 'Clouds of gulal blooming, pichkari arcs, white kurtas turning rainbow.',
      credit: 'Gulal and pichkari play of Holi — celebrated across India. Drawn in-house.',
      t: { ground: '#f6f3f7', surface: '#ffffff', ink: '#33203e', accent: '#c43ba0', accent2: '#efb61c', festive: '#2f9e62' } },

    { id: 'truck', name: 'Truck Art', region: 'Highway India', full: false,
      note: 'Marigolds, painted eyes and PHIR MILENGE on the tailboard of a singing truck.',
      credit: 'Indian truck art — painted-lorry workshops of Punjab, Rajasthan and Namakkal, Tamil Nadu. Rendered in-house until a truck-art ustaad is commissioned.',
      t: { ground: '#fdf3e3', surface: '#ffffff', ink: '#22263b', accent: '#0f6bb4', accent2: '#f2b211', festive: '#e0345c' } },

    { id: 'dance', name: 'Dances of India', region: 'Many traditions, all India', full: false,
      /* Generic dancer silhouettes across forms — never deity iconography. */
      note: 'Ghungroo bells, graceful mudras and footwork drawing its own rhythm line.',
      credit: 'Dance traditions of India — ghungroo, mudra and rhythm across many forms. Drawn in-house; no deity iconography.',
      t: { ground: '#f8ece4', surface: '#fffbf7', ink: '#3c1626', accent: '#a62b52', accent2: '#d99c27', festive: '#2f7a72' } },

    { id: 'patterns', name: 'Patterns of India', region: 'Many regions', full: false,
      note: 'Bandhani dots, ajrakh blocks, phulkari threads — India printed, tied and woven.',
      credit: 'Bandhani — Kutch & Rajasthan · Ajrakh — Kutch, Gujarat · Phulkari — Punjab · Kolam — Tamil Nadu · Ikat — Odisha & Telangana. Rendered in-house until artisans are commissioned.',
      t: { ground: '#f0ece4', surface: '#fffdf8', ink: '#2e2438', accent: '#29527a', accent2: '#c98a2b', festive: '#b23a48' } }
  ];

  /* ============================================================ TOKEN CSS
     Per world:
     1) --wa-* tokens on :root[data-world] — always on, drive the ambient art
        (night mode dims the layer instead of recolouring it).
     2) The app's own token names remapped, guarded with :not([data-mode="night"])
        so tokens.css's night block still wins at bedtime. */
  function tokenCSS() {
    var css = '', i, w, t;
    for (i = 0; i < W.length; i++) {
      w = W[i]; t = w.t;
      css += ':root[data-world="' + w.id + '"]{' +
        '--wa-ground:' + t.ground + ';--wa-surface:' + t.surface + ';--wa-ink:' + t.ink + ';' +
        '--wa-accent:' + t.accent + ';--wa-accent2:' + t.accent2 + ';--wa-festive:' + t.festive + ';}\n';
      css += ':root[data-world="' + w.id + '"]:not([data-mode="night"]){' +
        '--ground:' + t.ground + ';' +
        '--ground2:' + mix(t.ground, '#ffffff', 0.5) + ';' +
        '--dot:' + rgba(t.accent, 0.26) + ';' +
        '--card:' + t.surface + ';' +
        '--card2:' + mix(t.surface, t.ground, 0.5) + ';' +
        '--text:' + t.ink + ';' +
        '--text2:' + mix(t.ink, t.ground, 0.34) + ';' +
        '--muted:' + mix(t.ink, t.ground, 0.58) + ';' +
        '--accent:' + t.accent + ';' +
        '--accent-soft:' + rgba(t.accent, 0.1) + ';' +
        '--accent2:' + t.accent2 + ';' +
        '--accent3:' + t.festive + ';' +
        '--festive:' + t.festive + ';' +
        '--line:' + rgba(t.ink, 0.12) + ';' +
        '--line2:' + rgba(t.ink, 0.2) + ';}\n';
    }
    return css;
  }

  /* ------------------------------------------------ mask tiles (monochrome
     data-URI SVGs used as masks; the div's background-color = a --wa token,
     so bands re-tint for free when the world switches) */
  var M_TEMPLE = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='14' height='7'><path d='M0 7L7 0L14 7Z' fill='black'/></svg>");
  var M_WAVE = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='28' height='8'><path d='M0 5.5Q7 .5 14 5.5T28 5.5' stroke='black' stroke-width='2.4' fill='none'/></svg>");
  var M_ARCH = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='36' height='30'><path fill-rule='evenodd' d='M0 0h36v30H0zM7 30V15q0-6 4-7 1-5 7-5t7 5q4 1 4 7v15z' fill='black'/></svg>");
  var M_SCALLOP = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='18' height='9'><path d='M0 0h18v2a9 9 0 0 1-18 0z' fill='black'/></svg>");

  /* ================================================================ BASE CSS
     Layer plumbing, the shared keyframe vocabulary, motion classes, fills,
     per-world strips/bands, and BOTH kill switches. */
  function baseCSS() {
    return [
      /* ---- the layer: fixed, click-through, under the topbar (z 40) ---- */
      '.wa-layer{position:fixed;inset:0;z-index:30;pointer-events:none;overflow:hidden;contain:strict}',
      '.wa-layer *{pointer-events:none!important}',
      '.wa-top{position:absolute;left:0;right:0;top:var(--wa-top-off,0px);height:10px}',
      '.wa-corner{position:absolute;right:12px;top:calc(var(--wa-top-off,0px) + 16px);width:76px;height:76px;opacity:.5}',
      '.wa-corner svg{display:block;width:100%;height:100%}',
      '.wa-foot{position:absolute;left:0;right:0;bottom:var(--wa-foot-off,0px);height:74px}',
      '.wa-foot:empty{display:none}',
      '.wa-foot::before{content:"";position:absolute;inset:-14px 0 0 0;background:linear-gradient(to bottom,transparent,var(--ground) 72%);opacity:.9}',
      '.wa-scene{position:absolute;inset:0;overflow:hidden}',
      '.wa-spr{position:absolute}',
      '.wa-strip{position:absolute;inset:0}',
      '@media (max-width:760px){.wa-corner{width:54px;height:54px;right:8px;opacity:.42}}',
      'html[data-mode="night"] .wa-layer{opacity:.5}',

      /* ---- fills/strokes bound to the world tokens ---- */
      '.waf-a{fill:var(--wa-accent)}.waf-b{fill:var(--wa-accent2)}.waf-f{fill:var(--wa-festive)}',
      '.waf-i{fill:var(--wa-ink)}.waf-s{fill:var(--wa-surface)}.waf-g{fill:var(--wa-ground)}.waf-n{fill:none}',
      '.was-a{stroke:var(--wa-accent)}.was-b{stroke:var(--wa-accent2)}.was-f{stroke:var(--wa-festive)}',
      '.was-i{stroke:var(--wa-ink)}.was-s{stroke:var(--wa-surface)}',

      /* ============= the shared keyframe vocabulary (~120 lines) =============
         swim/cross · sway · flicker · drift/fall · draw-in · blink · pulse ·
         chase — every world's motion is a remix of these. transform/opacity
         only; nothing else is ever animated. */
      '@keyframes wa-cross{0%{transform:translateX(-340px)}100%{transform:translateX(105vw)}}',
      '@keyframes wa-crosshold{0%{transform:translateX(-340px)}42%{transform:translateX(105vw)}100%{transform:translateX(105vw)}}',
      '@keyframes wa-cross-sm{0%{transform:translateX(-44px)}100%{transform:translateX(120px)}}',
      '@keyframes wa-sway{from{transform:rotate(-2.4deg)}to{transform:rotate(2.4deg)}}',
      '@keyframes wa-bob{from{transform:translateY(-2px)}to{transform:translateY(2px)}}',
      '@keyframes wa-flap{from{transform:scaleY(1)}to{transform:scaleY(.5)}}',
      '@keyframes wa-flicker{0%,100%{opacity:.85}9%{opacity:.5}23%{opacity:.95}36%{opacity:.62}54%{opacity:1}72%{opacity:.55}87%{opacity:.9}}',
      '@keyframes wa-chase{0%,100%{opacity:.25}12%{opacity:1}30%{opacity:.35}}',
      '@keyframes wa-blink{0%,92%,100%{transform:scaleY(1)}94%,96%{transform:scaleY(.08)}}',
      '@keyframes wa-pulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.04);opacity:1}}',
      '@keyframes wa-tap{from{transform:rotate(-26deg)}to{transform:rotate(9deg)}}',
      '@keyframes wa-fall{0%,60%{transform:translate(0,-16px) rotate(0deg);opacity:0}64%{opacity:.9}',
      '  78%{transform:translate(-14px,26px) rotate(70deg)}92%{transform:translate(8px,58px) rotate(160deg);opacity:.8}',
      '  100%{transform:translate(2px,72px) rotate(200deg);opacity:0}}',
      '@keyframes wa-spin{to{transform:rotate(360deg)}}',
      '@keyframes wa-draw{to{stroke-dashoffset:0}}',
      '@keyframes wa-drift{from{transform:translateX(0)}to{transform:translateX(-50%)}}',
      '@keyframes wa-kite{0%,100%{transform:translate(0,0) rotate(-7deg)}25%{transform:translate(15px,-9px) rotate(6deg)}',
      '  50%{transform:translate(28px,4px) rotate(-4deg)}75%{transform:translate(10px,11px) rotate(7deg)}}',

      /* motion classes — override duration/delay per instance inline */
      '.wa-layer svg [class^="wam-"],.wa-layer svg [class*=" wam-"],.wa-tile [class^="wam-"],.wa-tile [class*=" wam-"]{transform-box:fill-box;transform-origin:50% 50%}',
      '.wam-cross{animation:wa-cross 40s linear infinite}',
      '.wam-crosshold{animation:wa-crosshold 30s linear infinite}',
      '.wam-cross-sm{animation:wa-cross-sm 10s linear infinite}',
      '.wam-sway{animation:wa-sway 4s ease-in-out infinite alternate}',
      '.wam-bob{animation:wa-bob 3s ease-in-out infinite alternate}',
      '.wam-flap{animation:wa-flap .5s ease-in-out infinite alternate}',
      '.wam-flick{animation:wa-flicker 2.8s linear infinite}',
      '.wam-chase{animation:wa-chase 2.6s linear infinite}',
      '.wam-blink{animation:wa-blink 7s linear infinite}',
      '.wam-pulse{animation:wa-pulse 6s ease-in-out infinite}',
      '.wam-tap{animation:wa-tap .62s ease-in-out infinite alternate;transform-origin:12% 88%}',
      '.wam-fall{animation:wa-fall 21s linear infinite}',
      '.wam-spin{animation:wa-spin 120s steps(16) infinite}',
      '.wam-kite{animation:wa-kite 11s ease-in-out infinite}',

      /* ---- top-edge strips ---- */
      '.wa-t-gen{position:absolute;left:0;right:0;top:0;height:4px;opacity:.5;' +
      '  background:linear-gradient(90deg,var(--wa-accent),var(--wa-accent2) 55%,var(--wa-festive))}',
      '.wa-t-delhi6{height:8px;opacity:.5;background:radial-gradient(circle at 8px -1px,var(--wa-accent) 0 6.5px,transparent 7px);' +
      '  background-size:16px 8px;background-repeat:repeat-x}',
      '.wa-t-mumbai{height:8px;opacity:.5;' +
      '  background-image:repeating-linear-gradient(90deg,var(--wa-ink) 0 8px,var(--wa-accent2) 8px 16px),' +
      '  repeating-linear-gradient(90deg,var(--wa-accent2) 0 8px,var(--wa-ink) 8px 16px);' +
      '  background-size:16px 4px,16px 4px;background-position:0 0,0 4px;background-repeat:repeat-x}',
      '.wa-t-pujo{height:9px;opacity:.6}',
      '.wa-t-pujo::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:var(--wa-accent)}',
      '.wa-t-pujo::after{content:"";position:absolute;left:0;right:0;top:3px;height:6px;background:var(--wa-accent);' +
      '  -webkit-mask-image:' + M_TEMPLE + ';mask-image:' + M_TEMPLE + ';-webkit-mask-size:14px 6px;mask-size:14px 6px;' +
      '  -webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;transform:scaleY(-1)}',
      '.wa-t-dallake{height:8px;opacity:.45;overflow:hidden}',
      '.wa-t-dallake i{position:absolute;top:0;bottom:0;left:0;width:200%;background:var(--wa-accent);' +
      '  -webkit-mask-image:' + M_WAVE + ';mask-image:' + M_WAVE + ';-webkit-mask-size:28px 8px;mask-size:28px 8px;' +
      '  -webkit-mask-repeat:repeat;mask-repeat:repeat;animation:wa-drift 26s linear infinite}',
      '.wa-t-rajasthan{height:7px;opacity:.5;background:repeating-linear-gradient(65deg,' +
      '  var(--wa-festive) 0 7px,var(--wa-surface) 7px 10px,var(--wa-accent2) 10px 17px,var(--wa-surface) 17px 20px)}',
      '.wa-t-madhubani{height:9px;opacity:.6;background:' +
      '  linear-gradient(var(--wa-accent),var(--wa-accent)) 0 0/100% 1.5px no-repeat,' +
      '  linear-gradient(var(--wa-accent),var(--wa-accent)) 0 7.5px/100% 1.5px no-repeat,' +
      '  radial-gradient(circle at 5px 4.5px,var(--wa-accent2) 0 1.6px,transparent 2px) 0 0/14px 9px repeat-x}',

      /* ---- footer bands ---- */
      '.wa-d6-wall{position:absolute;left:0;right:0;bottom:0;height:30px;opacity:.45;' +
      '  background-image:repeating-linear-gradient(90deg,var(--wa-accent) 0 16px,transparent 16px 27px),' +
      '  linear-gradient(var(--wa-accent),var(--wa-accent));' +
      '  background-size:100% 9px,100% 21px;background-position:0 0,0 9px;background-repeat:repeat-x,no-repeat}',
      '.wa-mb-sea{position:absolute;left:0;right:0;bottom:0;height:17px;opacity:.35;' +
      '  background:linear-gradient(var(--wa-accent),var(--wa-accent));border-top:2px solid var(--wa-ink)}',
      '.wa-mb-sea::after{content:"";position:absolute;inset:0;opacity:.5;' +
      '  background:repeating-linear-gradient(0deg,transparent 0 4px,var(--wa-surface) 4px 5px)}',
      '.wa-lights{position:absolute;left:0;right:0;bottom:12px;display:flex;justify-content:space-between;padding:0 2.5%}',
      '.wa-lights i{width:5px;height:5px;border-radius:50%;background:var(--wa-accent2);' +
      '  box-shadow:0 0 7px 1px var(--wa-accent2);animation:wa-chase 2.6s linear infinite}',
      '.wa-pj-lat{position:absolute;left:0;right:0;bottom:0;height:100%;opacity:.8}',
      '.wa-pj-lat::before{content:"";position:absolute;inset:0;opacity:.14;' +
      '  background:repeating-linear-gradient(56deg,var(--wa-ink) 0 2px,transparent 2px 26px),' +
      '  repeating-linear-gradient(-56deg,var(--wa-ink) 0 2px,transparent 2px 26px)}',
      '.wa-pj-lat::after{content:"";position:absolute;left:0;right:0;bottom:0;height:9px;opacity:.55;background:var(--wa-accent);' +
      '  -webkit-mask-image:' + M_SCALLOP + ';mask-image:' + M_SCALLOP + ';-webkit-mask-size:18px 9px;mask-size:18px 9px;' +
      '  -webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;transform:scaleY(-1)}',
      '.wa-pj-lights{position:absolute;left:0;right:0;bottom:34px;display:flex;justify-content:space-between;padding:0 3%}',
      '.wa-pj-lights i{width:6px;height:8px;border-radius:50% 50% 50% 50%/40% 40% 60% 60%;background:var(--wa-accent2);' +
      '  box-shadow:0 0 6px 1px var(--wa-accent2);animation:wa-chase 2.2s linear infinite}',
      '.wa-dl-water{position:absolute;left:0;right:0;bottom:0;height:24px;opacity:.35;background:var(--wa-accent)}',
      '.wa-dl-water::after{content:"";position:absolute;inset:0;opacity:.45;' +
      '  background:repeating-linear-gradient(0deg,transparent 0 5px,var(--wa-surface) 5px 6px)}',
      '.wa-rj-arch{position:absolute;left:0;right:0;bottom:0;height:30px;opacity:.45;background:var(--wa-accent2);' +
      '  -webkit-mask-image:' + M_ARCH + ';mask-image:' + M_ARCH + ';-webkit-mask-size:36px 30px;mask-size:36px 30px;' +
      '  -webkit-mask-repeat:repeat-x;mask-repeat:repeat-x}',
      '.wa-mh-frame{position:absolute;left:0;right:0;bottom:0;height:100%;opacity:.5}',
      '.wa-mh-frame::before{content:"";position:absolute;left:0;right:0;top:6px;height:8px;opacity:.6;' +
      '  background:repeating-linear-gradient(45deg,var(--wa-accent) 0 1.6px,transparent 1.6px 7px),' +
      '  repeating-linear-gradient(-45deg,var(--wa-accent) 0 1.6px,transparent 1.6px 7px);' +
      '  border-top:1.5px solid var(--wa-accent);border-bottom:1.5px solid var(--wa-accent)}',
      '.wa-mh-frame::after{content:"";position:absolute;left:0;right:0;bottom:0;height:8px;opacity:.6;' +
      '  background:repeating-linear-gradient(45deg,var(--wa-accent) 0 1.6px,transparent 1.6px 7px),' +
      '  repeating-linear-gradient(-45deg,var(--wa-accent) 0 1.6px,transparent 1.6px 7px);' +
      '  border-top:1.5px solid var(--wa-accent);border-bottom:1.5px solid var(--wa-accent)}',

      /* ---- picker tiles ---- */
      '.wa-tile{display:block;width:100%;height:100%}',

      /* ================= KILL SWITCHES — both live now =================
         1) OS-level reduced motion.  2) html[data-calm="1"], the future
         in-app Calm toggle. Every ambient + tile animation dies. */
      '@media (prefers-reduced-motion:reduce){.wa-layer *,.wa-tile *{animation:none!important;transition:none!important}}',
      'html[data-calm="1"] .wa-layer *,html[data-calm="1"] .wa-tile *{animation:none!important;transition:none!important}'
    ].join('\n');
  }

  /* ================================================================ SCENES
     Each full world: foot (≤6KB inline SVG/HTML, simple geometry + CSS motion),
     top (micro strip) and corner (accent). Foundation worlds: corner + generic
     strip now; living scenes are tranche 2. */

  /* --- shared small builders --- */
  function bird(x, y, s, seed) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<g class="wam-flap"' + dly(seed, 500) + '><path class="was-i waf-n" stroke-width="2.2" stroke-linecap="round" d="M0 7Q6 0 11 6Q16 0 22 7"/></g></g>';
  }
  function kite(x, y, s, cls, seed, dur) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="wam-kite"' +
      dly(seed, 9000, 'animation-duration:' + dur + 's') + '>' +
      '<path class="' + cls + '" d="M13 1L24 15L13 29L2 15Z"/>' +
      '<path class="was-s waf-n" stroke-width="1" d="M13 1V29M2 15H24"/>' +
      '<path class="was-i waf-n" stroke-width="1.2" d="M13 29Q9 34 13 40Q17 45 14 50"/>' +
      '<circle class="waf-b" cx="13.5" cy="35" r="1.6"/><circle class="waf-b" cx="14.8" cy="46" r="1.6"/>' +
      '</g></g>';
  }
  function marigold(cx, cy, r) {
    return '<g>' + rep(8, function (i) {
      var a = i * Math.PI / 4, x = cx + Math.cos(a) * r * 0.62, y = cy + Math.sin(a) * r * 0.62;
      return '<circle class="waf-b" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r * 0.42).toFixed(1) + '"/>';
    }) + '<circle class="waf-f" cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.34).toFixed(1) + '"/></g>';
  }

  /* --- DELHI 6 — kabootar wheel over the ramparts; a rickshaw waits --- */
  function footDelhi6() {
    return '<div class="wa-scene">' +
      '<div class="wa-d6-wall"></div>' +
      /* the flock — five kabootar wheeling across, wings desynced */
      '<svg class="wa-spr wam-cross" style="left:0;bottom:26px;width:150px;height:44px;animation-duration:32s;animation-delay:-12s" viewBox="0 0 150 44" aria-hidden="true">' +
      bird(2, 20, 1, 'd6a') + bird(32, 6, 0.85, 'd6b') + bird(62, 26, 0.75, 'd6c') +
      bird(92, 12, 1.05, 'd6d') + bird(124, 22, 0.7, 'd6e') +
      '</svg>' +
      /* a second, smaller flock on its own slower orbit */
      '<svg class="wa-spr wam-cross" style="left:0;bottom:44px;width:90px;height:30px;animation-duration:47s;animation-delay:-21s" viewBox="0 0 90 30" aria-hidden="true">' +
      bird(0, 16, 0.65, 'd6f') + bird(30, 4, 0.55, 'd6g') + bird(60, 12, 0.6, 'd6h') +
      '</svg>' +
      /* cycle-rickshaw waiting by the wall */
      '<svg class="wa-spr" style="left:4%;bottom:2px;width:76px;height:48px;opacity:.75" viewBox="0 0 76 48" aria-hidden="true">' +
      '<circle class="was-i waf-n" stroke-width="2.4" cx="18" cy="38" r="8"/>' +
      '<circle class="was-i waf-n" stroke-width="2.4" cx="60" cy="39" r="6.5"/>' +
      '<path class="waf-a" opacity=".85" d="M8 22Q8 9 20 9L34 9Q41 9 41 19L41 33L10 33Q8 30 8 22Z"/>' +
      '<path class="was-s waf-n" stroke-width="1.4" d="M12 13Q24 10 38 13"/>' +
      '<path class="was-i waf-n" stroke-width="2" stroke-linecap="round" d="M41 30L56 35M56 35L62 25M58 25H67M18 38L34 33"/>' +
      '</svg>' +
      /* jalebi steam curl near the rickshaw — a hint of the halwai lane */
      '<svg class="wa-spr wam-pulse" style="left:14%;bottom:20px;width:26px;height:26px;opacity:.5;animation-duration:5s" viewBox="0 0 26 26" aria-hidden="true">' +
      '<path class="was-b waf-n" stroke-width="5" stroke-linecap="round" d="M13 10a4 4 0 1 0 4 4a8 8 0 1 1-9-8"/>' +
      '</svg>' +
      '</div>';
  }
  function cornerDelhi6() { /* the jalebi — syrup-gold double coil */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<path class="was-b waf-n" stroke-width="9" stroke-linecap="round" d="M36 30a7 7 0 1 0 7 7a14 14 0 1 1-16-14a21 21 0 1 1-12 20"/>' +
      '<path class="was-a waf-n" opacity=".55" stroke-width="3.5" stroke-linecap="round" d="M36 30a7 7 0 1 0 7 7a14 14 0 1 1-16-14a21 21 0 1 1-12 20"/>' +
      '</svg>';
  }

  /* --- MUMBAI — the local crosses every ~30s; umbrellas bob; lights twinkle --- */
  function footMumbai() {
    return '<div class="wa-scene">' +
      '<div class="wa-mb-sea"></div>' +
      '<div class="wa-lights">' + rep(14, function (i) { return '<i' + dly('mbL' + i, 2600) + '></i>'; }) + '</div>' +
      /* the local train — crosses, then rests off-screen for the remainder */
      '<svg class="wa-spr wam-crosshold" style="left:0;bottom:15px;width:230px;height:32px;animation-delay:-4s" viewBox="0 0 230 32" aria-hidden="true">' +
      '<path class="waf-i" opacity=".82" d="M8 30V14Q8 5 20 5H226Q228 5 228 8V30Z"/>' +
      '<path class="waf-b" opacity=".9" d="M13 12h9v7h-9z"/>' +
      rep(7, function (i) { return '<rect class="waf-b" opacity=".92" x="' + (34 + i * 27) + '" y="11" width="15" height="8" rx="1.5"/>'; }) +
      '<rect class="waf-s" opacity=".3" x="8" y="24" width="220" height="2"/>' +
      '</svg>' +
      /* monsoon umbrellas on the promenade */
      rep(3, function (i) {
        var x = [9, 20, 30][i], c = ['waf-f', 'waf-a', 'waf-b'][i];
        return '<svg class="wa-spr" style="left:' + x + '%;bottom:0;width:26px;height:30px" viewBox="0 0 26 30" aria-hidden="true">' +
          '<g class="wam-bob"' + dly('mbU' + i, 3000, 'animation-duration:2.6s') + '>' +
          '<path class="' + c + '" d="M2 14Q13 1 24 14Q20 11 17.5 14Q15 11 13 14Q11 11 8.5 14Q6 11 2 14Z"/>' +
          '<path class="was-i waf-n" stroke-width="1.6" stroke-linecap="round" d="M13 14V26Q13 29 16 28"/>' +
          '</g></svg>';
      }) +
      '</div>';
  }
  function cornerMumbai() { /* art-deco sunburst fan, Marine Drive cream + gold */
    return '<svg viewBox="0 0 72 72" aria-hidden="true"><g opacity=".9">' +
      '<path class="was-b waf-n" stroke-width="2.5" d="M10 62A52 52 0 0 1 62 10"/>' +
      '<path class="was-a waf-n" stroke-width="2" d="M10 48A38 38 0 0 1 48 10"/>' +
      '<path class="was-b waf-n" stroke-width="2" d="M10 33A23 23 0 0 1 33 10"/>' +
      rep(5, function (i) {
        var a = Math.PI / 2 * (i + 0.5) / 5, x = 10 + Math.cos(a) * 56, y = 62 - Math.sin(a) * 56;
        return '<path class="was-i waf-n" stroke-width="1.3" opacity=".6" d="M10 62L' + x.toFixed(1) + ' ' + y.toFixed(1) + '"/>';
      }) +
      '</g></svg>';
  }

  /* --- DURGA PUJO — pandal lattice, chasing lights, tapping dhaak sticks.
         Sacred-safe: structure, light and rhythm only; the murti is never
         depicted or abstracted into decor. --- */
  function footPujo() {
    return '<div class="wa-scene">' +
      '<div class="wa-pj-lat"></div>' +
      '<div class="wa-pj-lights">' + rep(13, function (i) { return '<i style="animation-delay:' + (-i * 0.17).toFixed(2) + 's"></i>'; }) + '</div>' +
      /* the dhaak — barrel drum, sticks tapping in alternation */
      '<svg class="wa-spr" style="right:6%;bottom:4px;width:64px;height:52px" viewBox="0 0 64 52" aria-hidden="true">' +
      '<rect class="waf-b" opacity=".9" x="10" y="26" width="40" height="20" rx="9"/>' +
      '<ellipse class="waf-s was-i" stroke-width="1.5" cx="11.5" cy="36" rx="4" ry="10"/>' +
      '<ellipse class="waf-s was-i" stroke-width="1.5" cx="48.5" cy="36" rx="4" ry="10"/>' +
      '<path class="was-a waf-n" stroke-width="1.2" opacity=".6" d="M15 29L46 43M15 43L46 29M15 36H46"/>' +
      '<g class="wam-tap" style="animation-delay:-.1s"><path class="was-i waf-n" stroke-width="2.4" stroke-linecap="round" d="M22 24L10 8"/><circle class="waf-i" cx="10" cy="8" r="2.2"/></g>' +
      '<g class="wam-tap" style="animation-delay:-.41s"><path class="was-i waf-n" stroke-width="2.4" stroke-linecap="round" d="M40 24L52 8"/><circle class="waf-i" cx="52" cy="8" r="2.2"/></g>' +
      '</svg>' +
      /* one shiuli flower drifts down — the flower of the season */
      '<svg class="wa-spr" style="left:24%;top:-6px;width:22px;height:22px" viewBox="0 0 22 22" aria-hidden="true">' +
      '<g class="wam-fall"' + dly('pjshiuli', 9000) + '>' +
      rep(6, function (i) { return '<ellipse class="waf-s was-i" stroke-width=".5" cx="11" cy="5.4" rx="2.5" ry="4.6" transform="rotate(' + i * 60 + ' 11 11)"/>'; }) +
      '<circle class="waf-f" cx="11" cy="11" r="2.6"/>' +
      '</g></svg>' +
      '</div>';
  }
  function cornerPujo() { /* shiuli cluster — white petals, orange hearts */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<g class="wam-sway" style="animation-duration:5.5s;transform-origin:50% 90%">' +
      '<path class="was-f waf-n" stroke-width="1.6" d="M36 66Q34 48 28 36M36 66Q40 50 48 42"/>' +
      '<g>' + rep(6, function (i) { return '<ellipse class="waf-s was-i" stroke-width=".6" cx="28" cy="26" rx="3.6" ry="7" transform="rotate(' + i * 60 + ' 28 33)"/>'; }) +
      '<circle class="waf-f" cx="28" cy="33" r="3.6"/></g>' +
      '<g>' + rep(6, function (i) { return '<ellipse class="waf-s was-i" stroke-width=".6" cx="48" cy="30" rx="2.8" ry="5.4" transform="rotate(' + i * 60 + ' 48 35.4)"/>'; }) +
      '<circle class="waf-f" cx="48" cy="35.4" r="2.8"/></g>' +
      '</g></svg>';
  }

  /* --- DAL LAKE — a shikara glides with its reflection; a chinar leaf falls --- */
  function footDallake() {
    return '<div class="wa-scene">' +
      '<div class="wa-dl-water"></div>' +
      '<svg class="wa-spr wam-cross" style="left:0;bottom:0;width:180px;height:74px;animation-duration:58s;animation-delay:-26s" viewBox="0 0 180 74" aria-hidden="true">' +
      '<g id="wa-shk">' +
      '<path class="waf-i" opacity=".8" d="M8 44Q60 54 126 47Q160 44 172 34Q158 50 108 51Q40 52 8 44Z"/>' +
      '<path class="was-i waf-n" stroke-width="1.6" d="M64 46V26M116 45V26"/>' +
      '<path class="waf-a" opacity=".92" d="M56 26Q90 17 124 26L124 30Q90 22 56 30Z"/>' +
      '<path class="was-f waf-n" stroke-width="1.5" stroke-dasharray="1.5 4" d="M58 30.5Q90 23 122 30.5"/>' +
      '<circle class="waf-i" cx="34" cy="35" r="3.4"/><path class="was-i waf-n" stroke-width="1.8" d="M34 38L32 45"/>' +
      '<path class="was-i waf-n" stroke-width="1.7" stroke-linecap="round" d="M28 36L42 52"/>' +
      '</g>' +
      '<use href="#wa-shk" transform="translate(0,104) scale(1,-1)" opacity=".16"/>' +
      '</svg>' +
      /* the chinar leaf — one leaf, one long unhurried fall */
      '<svg class="wa-spr" style="left:68%;top:-8px;width:22px;height:22px;opacity:.9" viewBox="0 0 22 22" aria-hidden="true">' +
      '<g class="wam-fall"' + dly('dlleaf', 9000, 'animation-duration:19s') + '>' +
      '<path class="waf-b" d="M11 1L13.6 8L20 7L15 12L17.5 19L11 14.6L4.5 19L7 12L2 7L8.4 8Z"/>' +
      '<path class="was-f waf-n" stroke-width=".8" d="M11 4V14"/>' +
      '</g></svg>' +
      '</div>';
  }
  function cornerDallake() { /* papier-mâché floral medallion, walnut + saffron */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<circle class="was-f waf-n" stroke-width="2" cx="36" cy="36" r="26"/>' +
      rep(8, function (i) { return '<ellipse class="waf-b" opacity=".85" cx="36" cy="18" rx="4.6" ry="9" transform="rotate(' + i * 45 + ' 36 36)"/>'; }) +
      rep(8, function (i) { return '<circle class="waf-a" cx="36" cy="7.5" r="1.8" transform="rotate(' + (i * 45 + 22.5) + ' 36 36)"/>'; }) +
      '<circle class="waf-f" cx="36" cy="36" r="6"/><circle class="waf-s" cx="36" cy="36" r="2.4"/>' +
      '</svg>';
  }

  /* --- FORTS OF RAJASTHAN — kites loop over jharokhas; camels walk the sand --- */
  function footRajasthan() {
    return '<div class="wa-scene">' +
      '<div class="wa-rj-arch"></div>' +
      /* camel caravan — slow crossing, gentle gait-bob */
      '<svg class="wa-spr wam-cross" style="left:0;bottom:1px;width:170px;height:42px;animation-duration:75s;animation-delay:-32s" viewBox="0 0 170 42" aria-hidden="true">' +
      '<g class="wam-bob" style="animation-duration:1.15s"><g opacity=".62">' +
      '<path class="waf-i" d="M10 40V32Q10 25 18 24L30 23Q33 15 41 15Q49 15 52 21L58 21Q63 21 65 15L67 7Q68 4 71 4Q75 4 75 8L77 13V17L72 17L70 23Q68 28 61 28L58 28V40H54V30H36V40H32V30Q22 31 18 32V40Z"/>' +
      '<path class="was-f waf-n" stroke-width="1.6" d="M36 20Q44 17 50 20"/>' +
      '</g></g>' +
      '<g class="wam-bob" style="animation-duration:1.05s;animation-delay:-.4s"><g opacity=".62" transform="translate(88 8) scale(.82)">' +
      '<path class="waf-i" d="M10 40V32Q10 25 18 24L30 23Q33 15 41 15Q49 15 52 21L58 21Q63 21 65 15L67 7Q68 4 71 4Q75 4 75 8L77 13V17L72 17L70 23Q68 28 61 28L58 28V40H54V30H36V40H32V30Q22 31 18 32V40Z"/>' +
      '</g></g>' +
      '<path class="was-i waf-n" stroke-width="1" opacity=".5" d="M77 14Q84 12 92 15"/>' +
      '</svg>' +
      /* the kite pair — festive pink and Jodhpur blue */
      '<svg class="wa-spr" style="left:32%;top:-4px;width:120px;height:60px" viewBox="0 0 120 60" aria-hidden="true">' +
      kite(6, 2, 0.9, 'waf-f', 'rjk1', 10) + kite(66, 12, 0.68, 'waf-a', 'rjk2', 13) +
      '</svg>' +
      '</div>';
  }
  function cornerRajasthan() { /* bandhani dot-diamond on a leheriya-gold tile */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<rect class="waf-b" opacity=".28" x="12" y="12" width="48" height="48" rx="8" transform="rotate(45 36 36)"/>' +
      rep(5, function (r) {
        var counts = [1, 3, 5, 3, 1][r], y = 16 + r * 10;
        return rep(counts, function (c) {
          var x = 36 + (c - (counts - 1) / 2) * 10;
          return '<g><circle class="waf-f" cx="' + x + '" cy="' + y + '" r="3.4"/><circle class="waf-s" cx="' + x + '" cy="' + y + '" r="1.2"/></g>';
        });
      }) +
      '</svg>';
  }

  /* --- MADHUBANI — the twin fish swim the frieze, nose to tail, lapping --- */
  function mFish(seed, dur, y, sz, delay) {
    return '<svg class="wa-spr wam-cross" style="left:0;bottom:' + y + 'px;width:' + sz + 'px;height:' + Math.round(sz * 0.3) + 'px;animation-duration:' + dur + 's;animation-delay:' + delay + 's" viewBox="0 0 120 36" aria-hidden="true">' +
      '<g class="wam-bob" style="animation-duration:3.4s"' + '>' +
      /* tail (flexes) */
      '<g class="wam-sway" style="animation-duration:1.6s;transform-origin:90% 50%">' +
      '<path class="waf-b was-i" stroke-width="1.5" d="M12 18L1 8L4 18L1 28Z"/></g>' +
      /* double-outlined body — the Mithila kachni language */
      '<path class="waf-s was-i" stroke-width="2" d="M10 18Q32 3 72 6Q98 9 108 18Q98 27 72 30Q32 33 10 18Z"/>' +
      '<path class="was-a waf-n" stroke-width="1.2" d="M16 18Q34 7 70 10Q92 12 100 18Q92 24 70 26Q34 29 16 18Z"/>' +
      '<path class="was-b waf-n" stroke-width=".9" opacity=".9" d="M40 9L47 27M52 8L59 28M64 8L71 27"/>' +
      '<circle class="waf-i" cx="98" cy="16" r="2"/>' +
      '<path class="was-i waf-n" stroke-width="1" d="M104 14Q107 18 104 22"/>' +
      '</g></svg>';
  }
  function footMadhubani() {
    return '<div class="wa-scene">' +
      '<div class="wa-mh-frame"></div>' +
      mFish('mf1', 68, 18, 120, -12) +
      mFish('mf2', 86, 36, 92, -47) +
      '</div>';
  }
  function cornerMadhubani() { /* the rayed sun — geometric, faceless; ticks round in steps */
    return '<svg viewBox="0 0 72 72" aria-hidden="true"><g class="wam-spin">' +
      rep(16, function (i) { return '<path class="was-i waf-n" stroke-width="2" stroke-linecap="round" d="M36 3.5V10" transform="rotate(' + i * 22.5 + ' 36 36)"/>'; }) +
      '<circle class="was-a waf-n" stroke-width="1.6" stroke-dasharray="3 3" cx="36" cy="36" r="20"/>' +
      '</g>' +
      '<circle class="waf-b was-i" stroke-width="2" cx="36" cy="36" r="13"/>' +
      '<circle class="was-a waf-n" stroke-width="1.2" cx="36" cy="36" r="8.5"/>' +
      '</svg>';
  }

  /* --- foundation-world corner motifs (static now; alive in tranche 2) --- */
  function cornerTaj() { /* pietra-dura tulip inlay */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<path class="was-b waf-n" stroke-width="1.6" d="M36 66Q35 46 30 38"/>' +
      '<path class="waf-f" d="M36 62Q28 60 24 52Q34 52 38 58Z"/><path class="waf-f" d="M34 50Q42 48 46 40Q36 40 32 46Z"/>' +
      '<path class="waf-a" d="M30 36Q22 26 28 14Q32 22 31 30Q34 18 36 12Q38 18 41 30Q40 22 44 14Q50 26 42 36Q36 40 30 36Z"/>' +
      '<circle class="waf-b" cx="36" cy="13" r="2"/>' +
      '</svg>';
  }
  function cornerCricket() { /* the ball over the rope — team-agnostic */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<path class="was-i waf-n" stroke-width="1.4" stroke-dasharray="3 4" opacity=".55" d="M6 44Q26 8 62 20"/>' +
      '<circle class="waf-f" cx="52" cy="24" r="9"/>' +
      '<path class="was-s waf-n" stroke-width="1.2" stroke-dasharray="2 2" d="M45 19Q52 24 45 30M59 19Q52 24 59 30"/>' +
      '<path class="was-b waf-n" stroke-width="5" stroke-linecap="round" d="M8 62Q36 54 64 62"/>' +
      '</svg>';
  }
  function cornerBollywood() { /* marquee star, bulbs ringing it */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<path class="waf-b" d="M36 12L42 28L59 28L45 38L50 55L36 45L22 55L27 38L13 28L30 28Z"/>' +
      rep(8, function (i) { return '<circle class="waf-a" cx="36" cy="6" r="2.4" transform="rotate(' + i * 45 + ' 36 36)"/>'; }) +
      '<circle class="waf-f" opacity=".8" cx="36" cy="36" r="4"/>' +
      '</svg>';
  }
  function cornerAntariksh() { /* tracking dish + stars + satellite */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<path class="waf-s was-i" stroke-width="1.6" d="M14 40A16 16 0 0 1 40 24L27 37Z"/>' +
      '<path class="was-i waf-n" stroke-width="1.8" d="M24 42L20 62M16 62H30"/>' +
      '<circle class="waf-b" cx="44" cy="18" r="1.8"/>' +
      '<path class="waf-f" d="M56 34l1.4 3.4L61 39l-3.6 1.6L56 44l-1.4-3.4L51 39l3.6-1.6Z"/>' +
      '<path class="waf-f" d="M50 8l1 2.4 2.6 1.1-2.6 1.2-1 2.3-1-2.3-2.6-1.2 2.6-1.1Z"/>' +
      '<g><rect class="waf-a" x="58" y="54" width="7" height="5" rx="1"/>' +
      '<path class="was-a waf-n" stroke-width="1.4" d="M52 56.5h4M67 56.5h4M52 54v5M71 54v5"/></g>' +
      '</svg>';
  }
  function cornerDiwali() { /* one diya — flame static until tranche 2 */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<circle class="waf-b" opacity=".18" cx="36" cy="30" r="16"/>' +
      '<path class="waf-b" d="M36 16Q41.5 26 36 35Q30.5 26 36 16Z"/>' +
      '<path class="waf-f" d="M36 24Q38.5 29 36 33.5Q33.5 29 36 24Z"/>' +
      '<path class="waf-a" d="M14 42Q36 52 58 42L54 52Q36 60 18 52Z"/>' +
      '<path class="was-b waf-n" stroke-width="1.6" d="M17 45Q36 53 55 45"/>' +
      '</svg>';
  }
  function cornerHoli() { /* pichkari + gulal burst */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<g transform="rotate(-32 32 44)">' +
      '<rect class="waf-a" x="16" y="40" width="30" height="10" rx="4"/>' +
      '<rect class="waf-b" x="46" y="42.5" width="8" height="5" rx="2"/>' +
      '<rect class="was-i waf-n" stroke-width="1.6" x="8" y="42" width="8" height="6" rx="2"/></g>' +
      '<circle class="waf-f" opacity=".8" cx="56" cy="18" r="7"/>' +
      '<circle class="waf-b" opacity=".8" cx="44" cy="10" r="4.6"/>' +
      '<circle class="waf-a" opacity=".7" cx="62" cy="30" r="3.6"/>' +
      '<circle class="waf-f" cx="36" cy="20" r="1.8"/><circle class="waf-b" cx="64" cy="8" r="1.8"/>' +
      '</svg>';
  }
  function cornerTruck() { /* the painted eye with lashes + marigolds */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<path class="waf-s was-i" stroke-width="2.4" d="M8 34Q36 14 64 34Q36 50 8 34Z"/>' +
      '<circle class="waf-a" cx="36" cy="33" r="9"/><circle class="waf-i" cx="36" cy="33" r="4.2"/>' +
      '<circle class="waf-s" cx="38" cy="30.5" r="1.6"/>' +
      rep(5, function (i) { var x = 18 + i * 9; return '<path class="was-i waf-n" stroke-width="2" stroke-linecap="round" d="M' + x + ' ' + (23 - Math.sin((i + 0.5) / 5 * Math.PI) * 3) + 'L' + (x - 2) + ' ' + (15 - Math.sin((i + 0.5) / 5 * Math.PI) * 4) + '"/>'; }) +
      marigold(14, 58, 8) + marigold(58, 58, 8) +
      '</svg>';
  }
  function cornerDance() { /* generic dancer silhouette + ghungroo arc — no deity iconography */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<circle class="waf-i" cx="36" cy="12" r="5"/>' +
      '<path class="was-i waf-n" stroke-width="3.4" stroke-linecap="round" d="M36 17Q35 28 36 34M36 22Q26 24 18 18M36 22Q46 26 54 20"/>' +
      '<path class="waf-a" d="M24 52Q36 30 48 52Q36 58 24 52Z"/>' +
      '<path class="was-i waf-n" stroke-width="2.6" stroke-linecap="round" d="M30 54L28 62M42 54L44 62"/>' +
      rep(5, function (i) { var a = Math.PI * (0.15 + i * 0.175), x = 36 + Math.cos(a) * 26, y = 66 - Math.sin(a) * 10; return '<circle class="waf-b" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2"/>'; }) +
      '</svg>';
  }
  function cornerPatterns() { /* a block-print stamp; bandhani dots inside */
    return '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<rect class="was-i waf-n" stroke-width="2.4" x="14" y="18" width="44" height="44" rx="5"/>' +
      '<rect class="waf-b" opacity=".9" x="30" y="6" width="12" height="10" rx="2"/>' +
      '<rect class="was-a waf-n" stroke-width="1.4" stroke-dasharray="3 3" x="20" y="24" width="32" height="32" rx="3"/>' +
      rep(9, function (i) { var x = 28 + (i % 3) * 8, y = 32 + Math.floor(i / 3) * 8; return '<circle class="waf-f" cx="' + x + '" cy="' + y + '" r="2.4"/>'; }) +
      '</svg>';
  }

  /* ================================================================ TILES
     Small living scene per world for the picker (viewBox 96×64). Each uses
     the shared wam-* classes, so tiles obey both kill switches too. */
  function tile(id, inner) {
    /* each tile carries its OWN world tokens inline, so the picker shows every
       world in its own palette no matter which world is active */
    var t = null, i;
    for (i = 0; i < W.length; i++) if (W[i].id === id) { t = W[i].t; break; }
    var vars = t ? '--wa-ground:' + t.ground + ';--wa-surface:' + t.surface + ';--wa-ink:' + t.ink +
      ';--wa-accent:' + t.accent + ';--wa-accent2:' + t.accent2 + ';--wa-festive:' + t.festive + ';' : '';
    return '<svg class="wa-tile" style="' + vars + '" viewBox="0 0 96 64" preserveAspectRatio="xMidYMid meet" aria-hidden="true" data-wtile="' + id + '">' +
      '<rect class="waf-g" x="0" y="0" width="96" height="64" rx="8"/>' + inner + '</svg>';
  }
  var TILES = {
    delhi6: tile('delhi6',
      '<path class="waf-a" opacity=".4" d="M0 50h10v-5h8v5h10v-5h8v5h10v-5h8v5h10v-5h8v5h10v-5h8v5h6v14H0Z"/>' +
      '<g class="wam-cross-sm" style="animation-duration:9s">' + bird(6, 14, 0.62, 't6a') + bird(26, 6, 0.5, 't6b') + '</g>' +
      '<g transform="translate(64 4) scale(.42)">' +
      '<path class="was-b waf-n" stroke-width="9" stroke-linecap="round" d="M36 30a7 7 0 1 0 7 7a14 14 0 1 1-16-14a21 21 0 1 1-12 20"/>' +
      '<path class="was-a waf-n" opacity=".55" stroke-width="3.5" stroke-linecap="round" d="M36 30a7 7 0 1 0 7 7a14 14 0 1 1-16-14a21 21 0 1 1-12 20"/></g>'),
    mumbai: tile('mumbai',
      '<rect class="waf-a" opacity=".35" x="0" y="52" width="96" height="12"/>' +
      rep(6, function (i) { return '<circle class="waf-b wam-chase" cx="' + (12 + i * 14) + '" cy="49" r="2"' + dly('tmb' + i, 2600) + '/>'; }) +
      '<g class="wam-cross-sm" style="animation-duration:7s"><path class="waf-i" opacity=".85" d="M4 40V30Q4 25 10 25H60Q62 25 62 27V40Z"/>' +
      rep(4, function (i) { return '<rect class="waf-b" x="' + (12 + i * 12) + '" y="29" width="7" height="5" rx="1"/>'; }) + '</g>'),
    pujo: tile('pujo',
      '<path class="was-i waf-n" opacity=".25" stroke-width="1.2" d="M8 64L40 12M24 64L56 12M40 64L72 12M56 64L88 12M88 64L56 12M72 64L40 12M56 64L24 12M40 64L8 12"/>' +
      rep(6, function (i) { return '<circle class="waf-b wam-chase" cx="' + (13 + i * 14) + '" cy="20" r="2.4" style="animation-delay:' + (-i * 0.18).toFixed(2) + 's"/>'; }) +
      '<rect class="waf-b" x="34" y="38" width="28" height="15" rx="7"/>' +
      '<g class="wam-tap" style="animation-delay:-.1s"><path class="was-i waf-n" stroke-width="2" stroke-linecap="round" d="M42 37L34 26"/></g>' +
      '<g class="wam-tap" style="animation-delay:-.41s"><path class="was-i waf-n" stroke-width="2" stroke-linecap="round" d="M54 37L62 26"/></g>' +
      '<path class="waf-a" opacity=".55" d="M0 58h96v6H0z"/>'),
    dallake: tile('dallake',
      '<rect class="waf-a" opacity=".3" x="0" y="46" width="96" height="18"/>' +
      '<g class="wam-cross-sm" style="animation-duration:12s">' +
      '<path class="waf-i" opacity=".8" d="M6 44Q30 49 58 45Q72 43 78 38Q70 47 46 47Q20 47 6 44Z"/>' +
      '<path class="waf-b" d="M26 36Q42 31 58 36L58 38Q42 34 26 38Z"/>' +
      '<path class="was-i waf-n" stroke-width="1" d="M30 38V44M54 38V44"/></g>' +
      '<g class="wam-fall" style="animation-duration:12s"><path class="waf-b" transform="translate(60 4) scale(.7)" d="M11 1L13.6 8L20 7L15 12L17.5 19L11 14.6L4.5 19L7 12L2 7L8.4 8Z"/></g>'),
    rajasthan: tile('rajasthan',
      '<path class="waf-b" opacity=".45" d="M0 48h96v16H0zM10 48V38q0-6 5-7 1-4 6-4t6 4q5 1 5 7v10zM58 48V38q0-6 5-7 1-4 6-4t6 4q5 1 5 7v10z" fill-rule="evenodd"/>' +
      kite(14, 2, 0.62, 'waf-f', 'trk1', 9) + kite(56, 8, 0.5, 'waf-a', 'trk2', 12)),
    madhubani: tile('madhubani',
      '<rect class="was-a waf-n" stroke-width="1.4" x="4" y="4" width="88" height="56" rx="6"/>' +
      '<rect class="was-a waf-n" stroke-width=".8" x="8" y="8" width="80" height="48" rx="4"/>' +
      '<g class="wam-cross-sm" style="animation-duration:10s"><g transform="translate(0 20) scale(.62)">' +
      '<path class="waf-s was-i" stroke-width="2" d="M10 18Q32 3 72 6Q98 9 108 18Q98 27 72 30Q32 33 10 18Z"/>' +
      '<path class="was-a waf-n" stroke-width="1.2" d="M16 18Q34 7 70 10Q92 12 100 18Q92 24 70 26Q34 29 16 18Z"/>' +
      '<path class="waf-b was-i" stroke-width="1.5" d="M12 18L1 8L4 18L1 28Z"/>' +
      '<circle class="waf-i" cx="98" cy="16" r="2"/></g></g>' +
      '<g class="wam-spin" style="animation-duration:60s"><circle class="waf-b was-i" stroke-width="1.4" cx="78" cy="16" r="6"/>' +
      rep(8, function (i) { return '<path class="was-i waf-n" stroke-width="1.2" d="M78 6.5V9.5" transform="rotate(' + i * 45 + ' 78 16)"/>'; }) + '</g>'),
    taj: tile('taj',
      '<rect class="waf-b" opacity=".2" x="0" y="52" width="96" height="12"/>' +
      '<path class="waf-s was-i" stroke-width="1.4" d="M48 12Q56 20 56 28H40Q40 20 48 12Z"/>' +
      '<path class="was-i waf-n" stroke-width="1.2" d="M48 12V7"/>' +
      '<rect class="waf-s was-i" stroke-width="1.2" x="30" y="28" width="36" height="24"/>' +
      '<path class="waf-a" opacity=".65" d="M44 52V40q0-5 4-5t4 5v12z"/>' +
      '<path class="was-i waf-n" stroke-width="1.2" d="M24 20V52M72 20V52"/><circle class="waf-s was-i" stroke-width="1" cx="24" cy="18" r="2.4"/><circle class="waf-s was-i" stroke-width="1" cx="72" cy="18" r="2.4"/>' +
      '<g class="wam-pulse" style="animation-duration:7s"><path class="waf-f" d="M14 40q4-8 2-14M14 40q-4-8-2-14"/><circle class="waf-b" cx="13" cy="24" r="2.2"/></g>'),
    cricket: tile('cricket',
      '<rect class="waf-a" opacity=".25" x="0" y="50" width="96" height="14"/>' +
      '<path class="was-i waf-n" stroke-width="1.6" d="M14 50V22M10 18h8M9 22l10-8"/>' +
      '<circle class="waf-b wam-flick" cx="14" cy="16" r="5" opacity=".9"/>' +
      '<path class="was-i waf-n" stroke-width="1.2" stroke-dasharray="3 4" opacity=".6" d="M28 48Q52 10 88 22"/>' +
      '<g class="wam-bob"><circle class="waf-f" cx="74" cy="24" r="6"/><path class="was-s waf-n" stroke-width="1" stroke-dasharray="1.6 1.6" d="M70 20Q74 24 70 28M78 20Q74 24 78 28"/></g>' +
      '<path class="was-b waf-n" stroke-width="4" stroke-linecap="round" d="M30 58Q60 52 90 58"/>'),
    bollywood: tile('bollywood',
      '<rect class="was-b waf-n" stroke-width="2.4" x="10" y="10" width="76" height="44" rx="6"/>' +
      rep(7, function (i) { return '<circle class="waf-b wam-chase" cx="' + (16 + i * 10.6) + '" cy="6" r="2" style="animation-delay:' + (-i * 0.2).toFixed(1) + 's"/>'; }) +
      rep(7, function (i) { return '<circle class="waf-b wam-chase" cx="' + (16 + i * 10.6) + '" cy="58" r="2" style="animation-delay:' + (-(i * 0.2 + 0.7)).toFixed(1) + 's"/>'; }) +
      '<path class="waf-a" d="M48 18L52.5 30L65 30L55 37.5L58.5 50L48 42.5L37.5 50L41 37.5L31 30L43.5 30Z"/>' +
      '<g class="wam-pulse" style="animation-duration:4s"><path class="waf-f" opacity=".6" d="M28 22l2 4-4-1zM70 40l-2-4 4 1z"/></g>'),
    antariksh: tile('antariksh',
      '<rect class="waf-i" opacity=".08" x="0" y="0" width="96" height="64" rx="8"/>' +
      rep(6, function (i) { return '<circle class="waf-f wam-chase" cx="' + [12, 30, 52, 70, 86, 44][i] + '" cy="' + [10, 22, 8, 16, 28, 40][i] + '" r="1.4"' + dly('tan' + i, 2600) + '/>'; }) +
      '<path class="was-b waf-n" stroke-width="1.2" stroke-dasharray="2 3" opacity=".7" d="M10 58Q40 48 66 24"/>' +
      '<g class="wam-bob" style="animation-duration:4s"><g transform="translate(62 8) rotate(40 8 16)">' +
      '<path class="waf-s was-i" stroke-width="1" d="M8 0Q13 6 13 16H3Q3 6 8 0Z"/>' +
      '<path class="waf-a" d="M3 16L0 22L3 20ZM13 16L16 22L13 20Z"/>' +
      '<path class="waf-b wam-flick" d="M8 26Q10 21 8 17Q6 21 8 26Z" style="animation-duration:1.2s"/></g></g>'),
    diwali: tile('diwali',
      '<rect class="waf-i" opacity=".06" x="0" y="0" width="96" height="64" rx="8"/>' +
      rep(3, function (i) {
        var x = 20 + i * 28;
        return '<g transform="translate(' + x + ' 34)">' +
          '<circle class="waf-b wam-flick" opacity=".22" cx="0" cy="-6" r="9"' + dly('tdw' + i, 2800) + '/>' +
          '<path class="waf-b wam-flick" d="M0 -12Q3 -6 0 -1Q-3 -6 0 -12Z"' + dly('tdwf' + i, 2800) + '/>' +
          '<path class="waf-a" d="M-10 2Q0 7 10 2L8 8Q0 11 -8 8Z"/></g>';
      }) +
      '<path class="was-f waf-n" stroke-width="1.6" stroke-dasharray="2 4" d="M6 54Q48 62 90 54"/>'),
    holi: tile('holi',
      '<circle class="waf-f wam-pulse" opacity=".55" cx="26" cy="20" r="11"' + dly('th1', 6000) + '/>' +
      '<circle class="waf-a wam-pulse" opacity=".5" cx="62" cy="14" r="8"' + dly('th2', 6000) + '/>' +
      '<circle class="waf-b wam-pulse" opacity=".6" cx="80" cy="34" r="9"' + dly('th3', 6000) + '/>' +
      '<circle class="waf-f" cx="46" cy="8" r="2"/><circle class="waf-b" cx="14" cy="36" r="2.4"/><circle class="waf-a" cx="70" cy="46" r="2"/>' +
      '<path class="was-f waf-n" stroke-width="1.6" stroke-dasharray="2 4" opacity=".8" d="M12 56Q40 30 78 40"/>' +
      '<g transform="rotate(-24 22 52)"><rect class="waf-a" x="10" y="48" width="22" height="7" rx="3"/><rect class="waf-b" x="32" y="49.5" width="6" height="4" rx="1.6"/></g>'),
    truck: tile('truck',
      '<rect class="was-i waf-n" stroke-width="2.4" x="8" y="8" width="80" height="48" rx="5"/>' +
      '<path class="waf-b" opacity=".5" d="M8 14h80v6a12 6 0 0 1-16 0a12 6 0 0 1-16 0a12 6 0 0 1-16 0a12 6 0 0 1-16 0a12 6 0 0 1-16 0z"/>' +
      '<g class="wam-blink"><path class="waf-s was-i" stroke-width="1.6" d="M22 32Q32 24 42 32Q32 39 22 32Z"/><circle class="waf-a" cx="32" cy="31.5" r="3.4"/></g>' +
      '<g class="wam-blink" style="animation-delay:-3.2s"><path class="waf-s was-i" stroke-width="1.6" d="M54 32Q64 24 74 32Q64 39 54 32Z"/><circle class="waf-a" cx="64" cy="31.5" r="3.4"/></g>' +
      '<rect class="waf-f" x="20" y="44" width="56" height="9" rx="2"/>' +
      '<text x="48" y="51" text-anchor="middle" class="waf-s" style="font:700 6.5px sans-serif;letter-spacing:.12em">PHIR MILENGE</text>'),
    dance: tile('dance',
      '<circle class="waf-i" cx="48" cy="12" r="4"/>' +
      '<g class="wam-sway" style="animation-duration:2.4s;transform-origin:50% 80%">' +
      '<path class="was-i waf-n" stroke-width="2.8" stroke-linecap="round" d="M48 16Q47 24 48 29M48 20Q39 22 32 16M48 20Q57 23 64 17"/>' +
      '<path class="waf-a" d="M38 44Q48 26 58 44Q48 49 38 44Z"/>' +
      '<path class="was-i waf-n" stroke-width="2.2" stroke-linecap="round" d="M43 46L41 53M53 46L55 53"/></g>' +
      rep(5, function (i) { return '<circle class="waf-b wam-chase" cx="' + (18 + i * 15) + '" cy="58" r="2" style="animation-delay:' + (-i * 0.25).toFixed(2) + 's"/>'; }) +
      '<path class="was-f waf-n" stroke-width="1.4" stroke-dasharray="4 3" d="M10 61H86"/>'),
    patterns: tile('patterns',
      '<rect class="waf-b" opacity=".25" x="4" y="4" width="43" height="27"/>' +
      rep(6, function (i) { var x = 12 + (i % 3) * 12, y = 12 + Math.floor(i / 3) * 12; return '<g><circle class="waf-f" cx="' + x + '" cy="' + y + '" r="2.6"/><circle class="waf-s" cx="' + x + '" cy="' + y + '" r=".9"/></g>'; }) +
      '<rect class="waf-a" opacity=".85" x="49" y="4" width="43" height="27"/>' +
      '<path class="was-s waf-n" stroke-width="1.2" d="M57 8l6 6-6 6-6-6zM75 8l6 6-6 6-6-6zM66 17l6 6-6 6-6-6zM84 17l6 6-6 6-6-6z" opacity=".8"/>' +
      '<rect class="waf-f" opacity=".8" x="4" y="33" width="43" height="27"/>' +
      '<path class="was-b waf-n" stroke-width="2.2" d="M8 52l6-10 6 10 6-10 6 10 6-10 5 8" opacity=".9"/>' +
      '<rect class="waf-s" x="49" y="33" width="43" height="27"/>' +
      '<g class="wam-pulse" style="animation-duration:8s"><path class="was-i waf-n" stroke-width="1.4" d="M58 55c-6-6 4-12 6-6s12-4 6-6 4-12-6-6-12-4-6 6-4 12 6 6z" opacity=".7"/></g>' +
      rep(4, function (i) { return '<circle class="waf-i" cx="' + (62 + (i % 2) * 12) + '" cy="' + (43 + Math.floor(i / 2) * 10) + '" r="1.2"/>'; })),
    /* TODO(tranche-2): foundation tiles get their full choreographed
       micro-scenes when the remaining nine footer friezes land. */
  };

  /* ------------------------------------------------ scene registry --- */
  var SCENES = {
    delhi6: { top: '<div class="wa-strip wa-t-delhi6"></div>', corner: cornerDelhi6, foot: footDelhi6 },
    mumbai: { top: '<div class="wa-strip wa-t-mumbai"></div>', corner: cornerMumbai, foot: footMumbai },
    pujo: { top: '<div class="wa-strip wa-t-pujo"></div>', corner: cornerPujo, foot: footPujo },
    dallake: { top: '<div class="wa-strip wa-t-dallake"><i></i></div>', corner: cornerDallake, foot: footDallake },
    rajasthan: { top: '<div class="wa-strip wa-t-rajasthan"></div>', corner: cornerRajasthan, foot: footRajasthan },
    madhubani: { top: '<div class="wa-strip wa-t-madhubani"></div>', corner: cornerMadhubani, foot: footMadhubani },
    /* foundation worlds — tokens + corner + generic strip now; footer friezes
       in tranche 2 (see TODO list at end of file) */
    taj: { top: '<div class="wa-t-gen"></div>', corner: cornerTaj, foot: null },
    cricket: { top: '<div class="wa-t-gen"></div>', corner: cornerCricket, foot: null },
    bollywood: { top: '<div class="wa-t-gen"></div>', corner: cornerBollywood, foot: null },
    antariksh: { top: '<div class="wa-t-gen"></div>', corner: cornerAntariksh, foot: null },
    diwali: { top: '<div class="wa-t-gen"></div>', corner: cornerDiwali, foot: null },
    holi: { top: '<div class="wa-t-gen"></div>', corner: cornerHoli, foot: null },
    truck: { top: '<div class="wa-t-gen"></div>', corner: cornerTruck, foot: null },
    dance: { top: '<div class="wa-t-gen"></div>', corner: cornerDance, foot: null },
    patterns: { top: '<div class="wa-t-gen"></div>', corner: cornerPatterns, foot: null }
  };

  /* ============================================================ MANIFEST OUT */
  var list = W.map(function (w) {
    return {
      id: w.id, name: w.name, region: w.region, note: w.note, credit: w.credit,
      full: !!w.full, tokens: w.t, tile: TILES[w.id] || ''
    };
  });
  window.IND_WORLDS = {
    list: list,
    get: function (id) {
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return null;
    }
  };

  /* ============================================================ THE ENGINE */
  var mounted = false, layer = null, styleEl = null, obs = null,
    curWorld = null, slots = null, rafPending = false;

  function injectStyle() {
    if (styleEl && styleEl.parentNode) return;
    styleEl = document.createElement('style');
    styleEl.id = 'wa-style';
    styleEl.textContent = tokenCSS() + '\n' + baseCSS();
    document.head.appendChild(styleEl);
  }

  function measure() {
    if (!layer) return;
    var topOff = 0, footOff = 0, bar, nav;
    try {
      bar = document.querySelector('.topbar');
      if (bar) {
        var p = getComputedStyle(bar).position;
        if (p === 'sticky' || p === 'fixed') topOff = Math.round(bar.getBoundingClientRect().height);
      }
      nav = document.querySelector('.topbar .nav');
      if (nav && getComputedStyle(nav).position === 'fixed') footOff = Math.round(nav.getBoundingClientRect().height);
    } catch (e) { /* shell not present (tests, early boot) — offsets stay 0 */ }
    layer.style.setProperty('--wa-top-off', topOff + 'px');
    layer.style.setProperty('--wa-foot-off', footOff + 'px');
  }

  function apply() {
    if (!layer) return;
    measure();
    var id = document.documentElement.getAttribute('data-world') || '';
    if (id === curWorld) return;
    curWorld = id;
    var sc = SCENES[id];
    if (!sc) { /* unknown / legacy world id — layer goes quiet, tokens.css rules */
      slots.top.innerHTML = ''; slots.corner.innerHTML = ''; slots.foot.innerHTML = '';
      return;
    }
    slots.top.innerHTML = sc.top || '';
    slots.corner.innerHTML = sc.corner ? sc.corner() : '';
    slots.foot.innerHTML = sc.foot ? sc.foot() : '';
  }

  function onResize() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () { rafPending = false; measure(); });
  }

  function mount() {
    if (mounted) { apply(); return; }
    if (!document.body) return; /* caller will retry after DOMContentLoaded */
    injectStyle();
    layer = document.createElement('div');
    layer.className = 'wa-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = '<div class="wa-top"></div><div class="wa-corner"></div><div class="wa-foot"></div>';
    document.body.appendChild(layer);
    slots = {
      top: layer.querySelector('.wa-top'),
      corner: layer.querySelector('.wa-corner'),
      foot: layer.querySelector('.wa-foot')
    };
    obs = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].attributeName === 'data-world') { apply(); return; }
      } /* data-calm / data-mode are pure-CSS switches — nothing to rebuild */
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-world', 'data-calm', 'data-mode'] });
    window.addEventListener('resize', onResize);
    mounted = true;
    curWorld = null;
    apply();
  }

  function unmount() {
    if (!mounted) return;
    if (obs) { obs.disconnect(); obs = null; }
    window.removeEventListener('resize', onResize);
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    layer = null; styleEl = null; slots = null; curWorld = null; mounted = false;
  }

  window.IND_WORLDS_ART = { __loaded: true, mount: mount, unmount: unmount, refresh: apply };

  /* auto-mount, guarded — harmless if the shell later calls mount() itself */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { if (!mounted) mount(); });
  } else if (document.body) {
    mount();
  }

  /* ==========================================================================
     TODO — TRANCHE 2 (full ambient scenes for the nine foundation worlds):
     - taj:       footer = char-bagh water channel + distant dome whose hue
                  shifts with time of day (CSS var set from a coarse hour
                  bucket, still transform/opacity + colour tokens only);
                  inlay border draw-in via dashoffset.
     - cricket:   footer = rope boundary + a six sailing over it (rare-event
                  arc, ~2s in a 30s cycle), floodlight flicker, scoreboard
                  tick digits (steps()).
     - bollywood: footer = marquee bulb chase + film-reel sprocket border
                  scrolling; one lens-flare shimmer sweep (masked gradient).
     - antariksh: footer = PSLV-silhouette launch arc (dashoffset draw, then
                  hold), satellite blinking across a star field, tracking
                  dish slow sweep. No agency name or logo, ever.
     - diwali:    footer = diya row with desynced flame flicker, phuljhari
                  spark burst (rare event), toran scallop top strip.
     - holi:      footer = gulal clouds blooming (scale+opacity), pichkari
                  arc dot-trail; card-corner colour splashes.
     - truck:     footer = full tailboard: scallop border, letterboard
                  'PHIR MILENGE', blinking painted eyes, jingle chains
                  swaying with travelling phase; marigold garland top strip.
     - dance:     footer = dancer-silhouette chain with travelling sway wave
                  (delay-staggered), ghungroo dot-trail, footwork rhythm
                  line drawing itself (dashoffset).
     - patterns:  footer = rotating credited sampler strip (bandhani → ajrakh
                  → phulkari → kolam → ikat, cross-fading on a slow clock),
                  each swatch labelled in the About card with its region.
     Also tranche 2: per-world meter skins, empty-state scenes, one-shot
     view-change flourishes, and the 'About this art' tap target on the
     frieze (needs one shell hook: data-act="worldAbout").
     ========================================================================== */
})();
