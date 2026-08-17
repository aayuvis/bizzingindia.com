/* ============================================================================
   worlds-art.js — WORLDS 3.0: page-scale ambient worlds for Bizzing India.

   WHAT CHANGED FROM 2.0 (which the user rejected as "not there"):
   2.0 mounted ONE thin layer — a 10px strip, a 76px corner doodle and a 74px
   frieze, all at the page edges. At a glance it was invisible.

   3.0 mounts TWO layers and uses the real estate the page actually has:

     .wa-back   z-index 0  — BEHIND all content (#app is z-index 1).
                             Full-bleed backdrop: big washes, gulal clouds,
                             night skies, giant watermark motifs.
     .wa-stage  z-index 30 — above the cards, below the topbar (z 40) and the
                             mobile nav (z 50). Three zones:
                               .wa-band  40–70px under the topbar
                               .wa-sky   the middle — a few drifters only
                               .wa-foot  160–240px — the world's stage

   Both layers are pointer-events:none and every descendant is forced
   pointer-events:none too, so the layer can never intercept a tap.

   DAY AND NIGHT ARE DIFFERENT WORLDS. Every scene ships a .wa-day group and a
   .wa-night group. <html data-mode="night"> cross-fades them in pure CSS and
   HARD-STOPS the animations of whichever group is hidden, so the animating-node
   budget is per-state, not cumulative. Worlds also re-skin the app's own tokens
   at night, so a Diwali night is warm-black and a Dal Lake night is ink-blue —
   never the same generic dark for all fifteen.

   BUDGET: at most ~14 concurrently animating nodes in any one state. Per-world
   counts are stated in each scene's comment. Only transform and opacity are
   animated — never width/height/top/left/filter/box-shadow. Chasing lights are
   built from 2–3 interleaved bulb ROWS (one animated node each) instead of
   twenty animated bulbs.

   EDITORIAL (CLAUDE.md + docs/05):
   - Folk art credited: every world carries a `credit` naming tradition + place.
   - Nothing sacred is decoration. Pujo is pandal craft, lights and dhaak — the
     murti is never depicted or abstracted. Diwali is diyas, rangoli, toran,
     phuljhari — no deities. Holi's night is the community bonfire and
     silhouetted people around it — no deity, no figure of worship.
   - Legal renames honoured: 'Cricket Fever', 'Antariksh' — no marks, no logos.
   - Offline-first: zero network requests. Every asset is an inline string.
   - TWO kill switches: prefers-reduced-motion AND html[data-calm="1"].
   ============================================================================ */
(function () {
  'use strict';
  if (window.IND_WORLDS_ART && window.IND_WORLDS_ART.__loaded) return;

  /* ------------------------------------------------------------- utilities */
  function hx(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mix(a, b, t) {
    var A = hx(a), B = hx(b), s = '#', i, v;
    for (i = 0; i < 3; i++) { v = Math.round(A[i] + (B[i] - A[i]) * t).toString(16); s += (v.length < 2 ? '0' : '') + v; }
    return s;
  }
  function rgba(h, a) { var c = hx(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function hashN(s, m) { var h = 0, i; for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000; return h % m; }
  /* hashed negative animation-delay so nothing on the page ever pulses in sync */
  function dly(seed, spreadMs) { return (-(hashN(seed, spreadMs) / 1000)).toFixed(2) + 's'; }
  function rep(n, fn) { var s = '', i; for (i = 0; i < n; i++) s += fn(i); return s; }
  /* A repeating mask tile as a data URI. It must be QUOTE-FREE: these strings
     are used inside inline style="…" attributes as well as in the stylesheet,
     and a single stray double-quote silently truncates the whole attribute
     (which is exactly how the drip band shipped invisible the first time).
     So percent-escape both quote characters and both parentheses. */
  function mtile(svg) {
    return 'url(data:image/svg+xml,' + encodeURIComponent(svg)
      .replace(/'/g, '%27').replace(/"/g, '%22')
      .replace(/\(/g, '%28').replace(/\)/g, '%29') + ')';
  }

  /* a soft round cloud of colour — the workhorse of every backdrop */
  function puff(o) {
    var c = o.c, mid = o.mid || 0.42;
    return '<i class="wa-puff ' + (o.cls || '') + '" style="left:' + o.l + ';top:' + o.t + ';width:' + o.w +
      ';height:' + (o.h || o.w) + ';background:radial-gradient(circle at 50% 50%,' + rgba(c, o.a) + ' 0%,' +
      rgba(c, o.a * 0.62) + ' ' + (mid * 100) + '%,' + rgba(c, 0) + ' 72%)' +
      (o.dur ? ';animation-duration:' + o.dur + 's' : '') +
      (o.dl ? ';animation-delay:' + o.dl : '') + '"></i>';
  }
  /* an absolutely-positioned SVG sprite; sizes use clamp() so one composition
     works from a 320px phone to a 1600px desktop without a media query */
  function spr(style, vb, inner, cls) {
    return '<svg class="wa-spr ' + (cls || '') + '" style="' + style + '" viewBox="' + vb +
      '" aria-hidden="true">' + inner + '</svg>';
  }
  /* interleaved bulb rows: `n` rows, each ONE animated node, phase-staggered.
     Three rows of dots offset by a third of the pitch read as a running chase
     for the cost of three animations instead of thirty. */
  function bulbs(o) {
    var n = o.rows || 3, pitch = o.pitch || 34, r = o.r || 2.6, s = '';
    for (var i = 0; i < n; i++) {
      s += '<i class="wa-bulbs wam-twinkle" style="top:' + (o.top || '0') + ';height:' + (o.h || '16px') +
        ';background-image:radial-gradient(circle at ' + (pitch / 2) + 'px 50%,' + rgba(o.c, 0.98) + ' 0 ' + r + 'px,' +
        rgba(o.c, 0.5) + ' ' + (r + 1.2) + 'px ' + (r + 3.4) + 'px,' + rgba(o.c, 0) + ' ' + (r + 5.5) + 'px);' +
        'background-size:' + (pitch * n) + 'px 100%;background-position:' + (i * pitch) + 'px 0;' +
        'animation-duration:' + (o.dur || 2.4) + 's;animation-delay:' + (-(i * (o.dur || 2.4) / n)).toFixed(2) + 's"></i>';
    }
    return s;
  }

  /* ============================================================== MANIFEST
     t  = the daylight palette (six slots)
     n  = the NIGHT palette — ground / card / accent / accent2 / festive.
          This is what makes "the world comes alive in dark" true at the token
          level: Diwali night is warm-black, Dal Lake night is ink-blue. */
  var W = [
    { id: 'delhi6', name: 'Delhi 6', region: 'Purani Dilli, Delhi', full: true,
      note: 'Jalebi spirals, wheeling kabootar and rickshaw bells in the lanes of Chandni Chowk.',
      credit: 'Purani Dilli street life — Chandni Chowk & the Red Fort sandstone, Delhi. Drawn in-house.',
      t: { ground: '#f8ecdd', surface: '#fffcf6', ink: '#3e1b10', accent: '#ba4a2a', accent2: '#e9a13b', festive: '#2e7d6e' },
      n: { ground: '#1a1009', card: '#26180e', accent: '#f0a55c', accent2: '#ffd08a', festive: '#5fbfa8' } },

    { id: 'mumbai', name: 'Mumbai Bustle', region: 'Mumbai, Maharashtra', full: true,
      note: 'Local trains, dabbawala tiffins and a necklace of lights along Marine Drive.',
      credit: 'Mumbai city life — local trains, dabbawalas, monsoon and art-deco Marine Drive. Drawn in-house.',
      t: { ground: '#edf0f2', surface: '#fffdf6', ink: '#1d2733', accent: '#256d85', accent2: '#f2b90d', festive: '#d94e63' },
      n: { ground: '#0a1119', card: '#121d29', accent: '#6fc6e0', accent2: '#ffcf4d', festive: '#ff8fa3' } },

    { id: 'pujo', name: 'Durga Pujo', region: 'Kolkata, West Bengal', full: true,
      /* SACRED-SAFE: bamboo-and-cloth pandal craft, lights, dhaak, shiuli.
         The murti is NEVER depicted or abstracted. */
      note: 'Bamboo pandals rising, string lights chasing and the heartbeat of the dhaak.',
      credit: 'Pandal craft of Durga Pujo — bamboo, cloth and lights, Kolkata, West Bengal. Drawn in-house; the murti is never pictured.',
      t: { ground: '#fbf1e8', surface: '#ffffff', ink: '#46150f', accent: '#c1272d', accent2: '#e8b00e', festive: '#ee7a3b' },
      n: { ground: '#1b0b0a', card: '#2a1210', accent: '#ff8f6b', accent2: '#ffd45e', festive: '#ffab5e' } },

    { id: 'dallake', name: 'Dal Lake', region: 'Srinagar, Kashmir', full: true,
      note: 'A shikara glides through mirror water while chinar leaves drift down.',
      credit: 'Dal Lake, shikara craft and Kashmiri papier-mâché florals — Srinagar, Kashmir. Drawn in-house.',
      t: { ground: '#e8eff2', surface: '#fcfdfd', ink: '#253844', accent: '#33718a', accent2: '#d9822b', festive: '#b04a3a' },
      n: { ground: '#060d14', card: '#0e1b26', accent: '#79c2dc', accent2: '#ffc077', festive: '#e08a76' } },

    { id: 'rajasthan', name: 'Forts of Rajasthan', region: 'Rajasthan', full: true,
      note: 'Kites loop over jharokha windows and a camel caravan walks the golden sand.',
      credit: 'Jharokha stonework, bandhani and leheriya — Rajasthan. Drawn in-house.',
      t: { ground: '#f9eedc', surface: '#fffcf4', ink: '#40260d', accent: '#2d5f9e', accent2: '#dfa032', festive: '#d8447c' },
      n: { ground: '#160f14', card: '#241722', accent: '#8fb4e8', accent2: '#ffc861', festive: '#ff86b4' } },

    { id: 'madhubani', name: 'Madhubani', region: 'Mithila, Bihar', full: true,
      note: 'Fish, lotuses and suns, double-outlined, painted by women on village walls.',
      credit: 'In the idiom of Madhubani (Mithila) painting — Mithila, Bihar. A living tradition painted by Mithila women; rendered in-house until a Mithila artist is commissioned.',
      t: { ground: '#fdf1e6', surface: '#fffdfa', ink: '#3a1410', accent: '#c63c28', accent2: '#e2951f', festive: '#2f6f5e' },
      n: { ground: '#170d0a', card: '#241511', accent: '#ef7f68', accent2: '#ffc06a', festive: '#63b79e' } },

    { id: 'taj', name: 'Taj Mahal', region: 'Agra, Uttar Pradesh', full: false,
      note: 'Marble catching the dawn, flowers set in stone, a garden in perfect halves.',
      credit: 'Pietra-dura inlay and char-bagh geometry of the Taj Mahal — Agra, Uttar Pradesh. Drawn in-house.',
      t: { ground: '#f3efea', surface: '#fefdfb', ink: '#322b36', accent: '#8c5a74', accent2: '#c99a4b', festive: '#3e7c6f' },
      n: { ground: '#110e14', card: '#1d1822', accent: '#d1a0bb', accent2: '#e8c88a', festive: '#7fc0b1' } },

    { id: 'cricket', name: 'Cricket Fever', region: 'All of India', full: false,
      /* Deliberately team-agnostic and league-agnostic (no trademarks). */
      note: 'Floodlights on, scoreboard ticking, a six sailing over the rope.',
      credit: 'Cricket — India’s shared festival, every gully and maidan. Drawn in-house; no team or league marks.',
      t: { ground: '#eaf2ea', surface: '#ffffff', ink: '#14301d', accent: '#1e7a46', accent2: '#efb71e', festive: '#e0483f' },
      n: { ground: '#07120c', card: '#0f2117', accent: '#4fd08a', accent2: '#ffd75e', festive: '#ff8f86' } },

    { id: 'bollywood', name: 'Bollywood', region: 'Mumbai, Maharashtra', full: false,
      note: 'Hand-painted posters, marquee bulbs chasing and one dramatic shimmer.',
      credit: 'Hand-painted film-poster and marquee craft of Hindi cinema — Bombay’s poster painters. Drawn in-house.',
      t: { ground: '#fbedde', surface: '#fff9f0', ink: '#3a1030', accent: '#c42a6c', accent2: '#f0a519', festive: '#2c63a8' },
      n: { ground: '#150818', card: '#231029', accent: '#ff77ab', accent2: '#ffc45e', festive: '#7ba6ef' } },

    { id: 'antariksh', name: 'Antariksh', region: 'Sriharikota to the stars', full: false,
      /* No space-agency name, logo or insignia — our own rocket silhouette. */
      note: 'Countdown, lift-off — a rocket climbs from the coast into a field of stars.',
      credit: 'India’s space adventure — countdowns, launch arcs and tracking dishes. Drawn in-house; no agency marks.',
      t: { ground: '#e9edf6', surface: '#ffffff', ink: '#131c3a', accent: '#27407f', accent2: '#e8862b', festive: '#5b4fc0' },
      n: { ground: '#050814', card: '#0e1428', accent: '#8fa6ef', accent2: '#ffab5e', festive: '#a394ff' } },

    { id: 'diwali', name: 'Diwali Nights', region: 'All of India', full: true,
      /* SACRED-SAFE: diyas, phuljhari, rangoli, toran — never deities as decor. */
      note: 'Rows of diyas flickering, phuljhari sparks and rangoli at every doorstep.',
      credit: 'Diya, rangoli and toran craft of Diwali — celebrated across India. Drawn in-house; no deities as decor.',
      t: { ground: '#fbeedc', surface: '#fffaf0', ink: '#43210b', accent: '#b3541e', accent2: '#f0ac29', festive: '#8a3a69' },
      n: { ground: '#140b05', card: '#22150b', accent: '#ffb454', accent2: '#ffd479', festive: '#e58ab5' } },

    { id: 'holi', name: 'Holi Hai', region: 'All of India', full: true,
      note: 'Clouds of gulal blooming, pichkari arcs, white kurtas turning rainbow.',
      credit: 'Gulal and pichkari play of Holi — celebrated across India. Drawn in-house.',
      t: { ground: '#f6f3f7', surface: '#ffffff', ink: '#33203e', accent: '#c43ba0', accent2: '#efb61c', festive: '#2f9e62' },
      n: { ground: '#140b1c', card: '#20122b', accent: '#ff8ad4', accent2: '#ffce5e', festive: '#5fd497' } },

    { id: 'truck', name: 'Truck Art', region: 'Highway India', full: false,
      note: 'Marigolds, painted eyes and PHIR MILENGE on the tailboard of a singing truck.',
      credit: 'Indian truck art — painted-lorry workshops of Punjab, Rajasthan and Namakkal, Tamil Nadu. Rendered in-house until a truck-art ustaad is commissioned.',
      t: { ground: '#fdf3e3', surface: '#ffffff', ink: '#22263b', accent: '#0f6bb4', accent2: '#f2b211', festive: '#e0345c' },
      n: { ground: '#0c0f1a', card: '#161b2b', accent: '#5cb3ee', accent2: '#ffcb52', festive: '#ff7d9c' } },

    { id: 'dance', name: 'Dances of India', region: 'Many traditions, all India', full: false,
      /* Generic dancer silhouettes across forms — never deity iconography. */
      note: 'Ghungroo bells, graceful mudras and footwork drawing its own rhythm line.',
      credit: 'Dance traditions of India — ghungroo, mudra and rhythm across many forms. Drawn in-house; no deity iconography.',
      t: { ground: '#f8ece4', surface: '#fffbf7', ink: '#3c1626', accent: '#a62b52', accent2: '#d99c27', festive: '#2f7a72' },
      n: { ground: '#15080f', card: '#231120', accent: '#ef7e9e', accent2: '#ffc85f', festive: '#63bdb2' } },

    { id: 'patterns', name: 'Patterns of India', region: 'Many regions', full: false,
      note: 'Bandhani dots, ajrakh blocks, phulkari threads — India printed, tied and woven.',
      credit: 'Bandhani — Kutch & Rajasthan · Ajrakh — Kutch, Gujarat · Phulkari — Punjab · Kolam — Tamil Nadu · Ikat — Odisha & Telangana. Rendered in-house until artisans are commissioned.',
      t: { ground: '#f0ece4', surface: '#fffdf8', ink: '#2e2438', accent: '#29527a', accent2: '#c98a2b', festive: '#b23a48' },
      n: { ground: '#0e0c14', card: '#1a1622', accent: '#87aede', accent2: '#e4b565', festive: '#e4808c' } }
  ];

  /* ============================================================== TOKEN CSS
     1) --wa-* art tokens, per world, per mode — the ambient layer's own palette.
     2) The app's own token names remapped, DAY and NIGHT, so a world is a
        different place at bedtime rather than the same generic dark.
        [data-world][data-mode] out-specifies tokens.css's [data-mode="night"]. */
  function tokenCSS() {
    var css = '', i, w, t, n;
    for (i = 0; i < W.length; i++) {
      w = W[i]; t = w.t; n = w.n;
      var sel = ':root[data-world="' + w.id + '"]';
      /* art tokens — day */
      css += sel + '{--wa-ground:' + t.ground + ';--wa-surface:' + t.surface + ';--wa-ink:' + t.ink +
        ';--wa-accent:' + t.accent + ';--wa-accent2:' + t.accent2 + ';--wa-festive:' + t.festive + ';}\n';
      /* art tokens — night (lights read warm and bright on a dark ground) */
      css += sel + '[data-mode="night"]{--wa-ground:' + n.ground + ';--wa-surface:' + mix(n.card, '#ffffff', 0.22) +
        ';--wa-ink:' + mix(n.ground, '#ffffff', 0.10) + ';--wa-accent:' + n.accent +
        ';--wa-accent2:' + n.accent2 + ';--wa-festive:' + n.festive + ';}\n';
      /* app tokens — day */
      css += sel + ':not([data-mode="night"]){' +
        '--ground:' + t.ground + ';--ground2:' + mix(t.ground, '#ffffff', 0.5) + ';' +
        '--dot:' + rgba(t.accent, 0.26) + ';--card:' + t.surface + ';' +
        '--card2:' + mix(t.surface, t.ground, 0.5) + ';--text:' + t.ink + ';' +
        '--text2:' + mix(t.ink, t.ground, 0.34) + ';--muted:' + mix(t.ink, t.ground, 0.58) + ';' +
        '--accent:' + t.accent + ';--accent-soft:' + rgba(t.accent, 0.1) + ';' +
        '--accent2:' + t.accent2 + ';--accent3:' + t.festive + ';--festive:' + t.festive + ';' +
        '--line:' + rgba(t.ink, 0.12) + ';--line2:' + rgba(t.ink, 0.2) + ';}\n';
      /* app tokens — night. Text stays near-white (contrast is not negotiable);
         only the grounds, cards and accents take the world's colour. */
      css += sel + '[data-mode="night"]{' +
        '--ground:' + n.ground + ';--ground2:' + mix(n.ground, '#ffffff', 0.06) + ';' +
        '--dot:' + rgba(n.accent, 0.12) + ';--card:' + n.card + ';' +
        '--card2:' + mix(n.card, n.ground, 0.5) + ';--mist:' + mix(n.card, '#ffffff', 0.14) + ';' +
        '--text:' + mix('#ffffff', n.ground, 0.05) + ';' +
        '--text2:' + mix('#ffffff', n.ground, 0.26) + ';--muted:' + mix('#ffffff', n.ground, 0.44) + ';' +
        '--accent:' + n.accent + ';--accent-soft:' + rgba(n.accent, 0.16) + ';' +
        '--accent2:' + n.accent2 + ';--accent3:' + n.festive + ';--festive:' + n.festive + ';' +
        '--line:rgba(255,255,255,.10);--line2:rgba(255,255,255,.18);}\n';
    }
    return css;
  }

  /* ---------------------------------------------------- repeating mask tiles */
  var M_TEMPLE = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='14' height='7'><path d='M0 7L7 0L14 7Z' fill='black'/></svg>");
  var M_WAVE = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='28' height='8'><path d='M0 5.5Q7 .5 14 5.5T28 5.5' stroke='black' stroke-width='2.4' fill='none'/></svg>");
  var M_ARCH = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='36' height='30'><path fill-rule='evenodd' d='M0 0h36v30H0zM7 30V15q0-6 4-7 1-5 7-5t7 5q4 1 4 7v15z' fill='black'/></svg>");
  var M_SCALLOP = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='18' height='9'><path d='M0 0h18v2a9 9 0 0 1-18 0z' fill='black'/></svg>");
  /* Holi: colour running down from the top edge in fat drips */
  var M_DRIP = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='62' height='54'><path fill='black' d='M0 0h62v13H0z" +
    "M8 11h11v15a5.5 5.5 0 0 1-11 0z M28 11h13v27a6.5 6.5 0 0 1-13 0z M49 11h9v9a4.5 4.5 0 0 1-9 0z'/></svg>");
  /* Diwali: one marigold-and-leaf swag of a toran, tiled across the band */
  var M_TORAN = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='84' height='46'><g fill='black'>" +
    "<path d='M0 3q42 26 84 3v6q-42 22-84-3z'/>" +
    "<circle cx='12' cy='12' r='6'/><circle cx='26' cy='18' r='6.5'/><circle cx='42' cy='20' r='7'/>" +
    "<circle cx='58' cy='18' r='6.5'/><circle cx='72' cy='12' r='6'/>" +
    "<path d='M20 20q6 12 0 22q-7-10 0-22zM42 27q7 14 0 19q-7-5 0-19zM64 20q6 12 0 22q-7-10 0-22z'/></g></svg>");
  /* Delhi 6: a shuttered-shop arcade edge */
  var M_ARCADE = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='40' height='22'><path fill='black' d='M0 22V8q0-8 20-8t20 8v14z'/></svg>");
  /* Mumbai: art-deco chevrons */
  var M_DECO = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='26' height='20'><path fill='black' d='M0 20L13 4l13 16h-6L13 12L6 20z'/></svg>");
  /* Madhubani: the kachni cross-hatch that fills every Mithila field */
  var M_KACHNI = mtile("<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><g stroke='black' stroke-width='1.1'><path d='M0 16L16 0'/><path d='M-4 4L4 -4'/><path d='M12 20L20 12'/></g></svg>");

  /* ================================================================ BASE CSS */
  function baseCSS() {
    return [
      /* ------------------------------------------------------- the two layers */
      '.wa-layer{position:fixed;inset:0;pointer-events:none;overflow:hidden;contain:strict}',
      '.wa-layer *{pointer-events:none!important}',
      '.wa-back{z-index:0}',                 /* behind #app (z-index 1) */
      '.wa-stage{z-index:30;--wa-band-h:62px;--wa-foot-h:212px}',   /* above cards, below topbar (40) and nav (50) */
      '@media (max-width:760px){.wa-stage{--wa-band-h:48px;--wa-foot-h:178px}}',
      '.wa-bd{position:absolute;inset:0;overflow:hidden}',
      /* .wa-air is the one full-bleed zone that lives IN FRONT of the cards.
         On a phone the cards leave only a 16px gutter, so a backdrop alone is
         invisible — the world has to breathe across the whole page. Everything
         here is a soft radial wash (never a hard edge, never type-sized
         detail) held at low alpha, so it tints the page like a colour gel and
         leaves body text at its normal contrast. */
      '.wa-air{position:absolute;inset:0;overflow:hidden}',
      '.wa-band{position:absolute;left:0;right:0;top:var(--wa-top-off,0px);height:var(--wa-band-h);overflow:hidden}',
      '.wa-sky{position:absolute;left:0;right:0;top:calc(var(--wa-top-off,0px) + var(--wa-band-h));' +
      '  bottom:calc(var(--wa-foot-off,0px) + var(--wa-foot-h) - 24px);overflow:hidden}',
      '.wa-foot{position:absolute;left:0;right:0;bottom:var(--wa-foot-off,0px);height:var(--wa-foot-h);overflow:hidden}',
      '.wa-band:empty,.wa-sky:empty,.wa-foot:empty,.wa-bd:empty,.wa-air:empty{display:none}',

      /* ------------------------------------------------- day / night groups
         Both groups always exist; CSS cross-fades them and HARD-STOPS the
         animations of the hidden one, so the node budget is per-state. */
      '.wa-day,.wa-night{position:absolute;inset:0;transition:opacity .55s ease}',
      '.wa-night{opacity:0}',
      'html[data-mode="night"] .wa-day{opacity:0}',
      'html[data-mode="night"] .wa-night{opacity:1}',
      'html[data-mode="night"] .wa-day *{animation:none!important}',
      'html:not([data-mode="night"]) .wa-night *{animation:none!important}',

      /* ------------------------------------------------------- primitives */
      '.wa-spr{position:absolute;display:block}',
      '.wa-puff{position:absolute;border-radius:50%}',
      '.wa-floor{position:absolute;left:0;right:0;bottom:0}',
      '.wa-fade{position:absolute;left:0;right:0;background:linear-gradient(to bottom,rgba(0,0,0,0),var(--ground))}',
      '.wa-row{position:absolute;left:0;right:0;display:flex;align-items:flex-end;justify-content:space-around}',
      '.wa-bulbs{position:absolute;left:-40px;right:-40px;background-repeat:repeat-x}',
      '.wa-tileband{position:absolute;left:0;right:0;background-repeat:repeat-x}',

      /* fills/strokes bound to the world tokens (re-tint for free on switch) */
      '.waf-a{fill:var(--wa-accent)}.waf-b{fill:var(--wa-accent2)}.waf-f{fill:var(--wa-festive)}',
      '.waf-i{fill:var(--wa-ink)}.waf-s{fill:var(--wa-surface)}.waf-g{fill:var(--wa-ground)}.waf-n{fill:none}',
      '.was-a{stroke:var(--wa-accent)}.was-b{stroke:var(--wa-accent2)}.was-f{stroke:var(--wa-festive)}',
      '.was-i{stroke:var(--wa-ink)}.was-s{stroke:var(--wa-surface)}',

      /* =================== the shared keyframe vocabulary ===================
         transform and opacity ONLY. Nothing here touches layout or filters. */
      '@keyframes wa-cross{0%{transform:translateX(-32vw)}100%{transform:translateX(112vw)}}',
      '@keyframes wa-crosshold{0%{transform:translateX(-38vw)}46%{transform:translateX(115vw)}100%{transform:translateX(115vw)}}',
      '@keyframes wa-cross-sm{0%{transform:translateX(-44px)}100%{transform:translateX(120px)}}',
      '@keyframes wa-drift{from{transform:translateX(0)}to{transform:translateX(-50%)}}',
      '@keyframes wa-sway{from{transform:rotate(-2.6deg)}to{transform:rotate(2.6deg)}}',
      '@keyframes wa-swayb{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}',
      '@keyframes wa-bob{from{transform:translateY(-4px)}to{transform:translateY(4px)}}',
      '@keyframes wa-flap{from{transform:scaleY(1)}to{transform:scaleY(.45)}}',
      '@keyframes wa-flicker{0%,100%{opacity:.86}9%{opacity:.5}23%{opacity:.97}36%{opacity:.6}54%{opacity:1}72%{opacity:.55}87%{opacity:.92}}',
      /* a real flame: leans, stretches and dips, never just fades */
      '@keyframes wa-flame{0%,100%{transform:scale(1,1) rotate(0deg);opacity:.95}' +
      '  17%{transform:scale(.9,1.16) rotate(-4deg);opacity:1}' +
      '  38%{transform:scale(1.06,.86) rotate(3deg);opacity:.8}' +
      '  61%{transform:scale(.94,1.1) rotate(2deg);opacity:1}' +
      '  81%{transform:scale(1.02,.94) rotate(-3deg);opacity:.86}}',
      '@keyframes wa-glow{0%,100%{transform:scale(1);opacity:.55}50%{transform:scale(1.14);opacity:.9}}',
      /* gulal: a cloud that BURSTS, spreads and thins out */
      '@keyframes wa-burst{0%{transform:scale(.28) translate3d(0,14px,0);opacity:0}' +
      '  12%{opacity:.95}28%{transform:scale(.86) translate3d(0,0,0);opacity:.85}' +
      '  70%{transform:scale(1.16) translate3d(6px,-12px,0);opacity:.45}' +
      '  100%{transform:scale(1.42) translate3d(14px,-26px,0);opacity:0}}',
      /* a splatter that flies in, LANDS, stains and slowly fades */
      '@keyframes wa-splat{0%{transform:scale(.1) translate3d(-40px,-52px,0);opacity:0}' +
      '  5%{opacity:1}8%{transform:scale(1.22) translate3d(0,0,0);opacity:1}' +
      '  12%{transform:scale(1) translate3d(0,0,0)}70%{transform:scale(1);opacity:.85}' +
      '  100%{transform:scale(1.04);opacity:0}}',
      '@keyframes wa-rise{0%{transform:translate3d(0,10px,0) scale(.7);opacity:0}' +
      '  18%{opacity:.95}70%{opacity:.6}100%{transform:translate3d(10px,-86px,0) scale(.35);opacity:0}}',
      '@keyframes wa-pop{0%{transform:scale(.12);opacity:0}6%{opacity:1}' +
      '  22%{transform:scale(1);opacity:.85}38%{transform:scale(1.2);opacity:0}100%{transform:scale(1.2);opacity:0}}',
      '@keyframes wa-twinkle{0%,100%{opacity:.22}30%{opacity:1}55%{opacity:.34}}',
      '@keyframes wa-pulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.05);opacity:1}}',
      '@keyframes wa-tap{from{transform:rotate(-26deg)}to{transform:rotate(9deg)}}',
      '@keyframes wa-blink{0%,92%,100%{transform:scaleY(1)}94%,96%{transform:scaleY(.08)}}',
      '@keyframes wa-spin{to{transform:rotate(360deg)}}',
      '@keyframes wa-fall{0%{transform:translate3d(0,-30px,0) rotate(0deg);opacity:0}' +
      '  8%{opacity:.95}50%{transform:translate3d(-34px,46vh,0) rotate(180deg)}' +
      '  92%{opacity:.7}100%{transform:translate3d(18px,92vh,0) rotate(400deg);opacity:0}}',
      '@keyframes wa-fallshort{0%{transform:translate3d(0,-24px,0) rotate(0deg);opacity:0}' +
      '  10%{opacity:.9}60%{transform:translate3d(-20px,86px,0) rotate(150deg)}' +
      '  100%{transform:translate3d(12px,168px,0) rotate(320deg);opacity:0}}',
      '@keyframes wa-kite{0%,100%{transform:translate3d(0,0,0) rotate(-8deg)}' +
      '  25%{transform:translate3d(6vw,-26px,0) rotate(7deg)}' +
      '  50%{transform:translate3d(12vw,10px,0) rotate(-5deg)}' +
      '  75%{transform:translate3d(5vw,28px,0) rotate(8deg)}}',
      '@keyframes wa-pump{0%,100%{transform:translateX(0)}50%{transform:translateX(20px)}}',
      '@keyframes wa-jet{0%,100%{transform:scale(.86,.9);opacity:.55}' +
      '  22%{transform:scale(1.04,1.06);opacity:1}60%{transform:scale(.95,1);opacity:.9}}',

      /* motion classes — duration/delay overridden per instance inline */
      '.wa-layer svg [class^="wam-"],.wa-layer svg [class*=" wam-"],.wa-tile [class^="wam-"],.wa-tile [class*=" wam-"]' +
      '{transform-box:fill-box;transform-origin:50% 50%}',
      '.wam-cross{animation:wa-cross 46s linear infinite}',
      '.wam-crosshold{animation:wa-crosshold 34s linear infinite}',
      '.wam-cross-sm{animation:wa-cross-sm 10s linear infinite}',
      '.wam-drift{animation:wa-drift 40s linear infinite}',
      '.wam-sway{animation:wa-sway 4.4s ease-in-out infinite alternate}',
      '.wam-swayb{animation:wa-swayb 3.2s ease-in-out infinite alternate}',
      '.wam-bob{animation:wa-bob 3.4s ease-in-out infinite alternate}',
      '.wam-flap{animation:wa-flap .5s ease-in-out infinite alternate}',
      '.wam-flick{animation:wa-flicker 2.8s linear infinite}',
      '.wam-flame{animation:wa-flame 1.5s ease-in-out infinite;transform-origin:50% 100%}',
      '.wam-glow{animation:wa-glow 4.2s ease-in-out infinite}',
      '.wam-burst{animation:wa-burst 11s ease-out infinite}',
      '.wam-splat{animation:wa-splat 15s linear infinite;transform-origin:50% 100%}',
      '.wam-rise{animation:wa-rise 3.6s linear infinite}',
      '.wam-pop{animation:wa-pop 9s ease-out infinite}',
      '.wam-twinkle{animation:wa-twinkle 2.4s ease-in-out infinite}',
      '.wam-pulse{animation:wa-pulse 6s ease-in-out infinite}',
      '.wam-tap{animation:wa-tap .62s ease-in-out infinite alternate;transform-origin:12% 88%}',
      '.wam-blink{animation:wa-blink 7s linear infinite}',
      '.wam-spin{animation:wa-spin 120s steps(24) infinite}',
      '.wam-fall{animation:wa-fall 26s linear infinite}',
      '.wam-fallshort{animation:wa-fallshort 15s linear infinite}',
      '.wam-kite{animation:wa-kite 15s ease-in-out infinite}',
      '.wam-pump{animation:wa-pump 1.5s ease-in-out infinite}',
      '.wam-jet{animation:wa-jet 1.5s ease-in-out infinite}',

      /* ---------------------------------------------------- picker tiles --- */
      '.wa-tile{display:block;width:100%;height:100%}',

      /* ================= KILL SWITCHES — both live =================
         1) OS-level reduced motion.  2) html[data-calm="1"], the in-app Calm
         toggle. Every ambient + tile animation and transition dies. */
      '@media (prefers-reduced-motion:reduce){.wa-layer *,.wa-tile *,.wa-layer,.wa-tile' +
      '{animation:none!important;transition:none!important}}',
      'html[data-calm="1"] .wa-layer *,html[data-calm="1"] .wa-tile *,' +
      'html[data-calm="1"] .wa-layer,html[data-calm="1"] .wa-tile' +
      '{animation:none!important;transition:none!important}'
    ].join('\n');
  }

  /* =========================================================== SHARED SHAPES */
  function bird(x, y, s, seed) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<g class="wam-flap" style="animation-delay:' + dly(seed, 500) + '">' +
      '<path class="was-i waf-n" stroke-width="2.2" stroke-linecap="round" d="M0 7Q6 0 11 6Q16 0 22 7"/></g></g>';
  }
  function kite(x, y, s, cls, seed, dur) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="wam-kite" style="animation-delay:' +
      dly(seed, 9000) + ';animation-duration:' + dur + 's">' +
      '<path class="' + cls + '" d="M13 1L24 15L13 29L2 15Z"/>' +
      '<path class="was-s waf-n" stroke-width="1" d="M13 1V29M2 15H24"/>' +
      '<path class="was-i waf-n" stroke-width="1.2" d="M13 29Q9 34 13 40Q17 45 14 50"/>' +
      '<circle class="waf-b" cx="13.5" cy="35" r="1.6"/><circle class="waf-b" cx="14.8" cy="46" r="1.6"/>' +
      '</g></g>';
  }
  function marigold(cx, cy, r, outer, inner) {
    return '<g>' + rep(8, function (i) {
      var a = i * Math.PI / 4, x = cx + Math.cos(a) * r * 0.62, y = cy + Math.sin(a) * r * 0.62;
      return '<circle fill="' + outer + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r * 0.44).toFixed(1) + '"/>';
    }) + '<circle fill="' + inner + '" cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.36).toFixed(1) + '"/></g>';
  }
  /* a clay diya. `lit` adds the flame + pool of light inside a .wa-night group. */
  function diya(seed, i) {
    return '<svg class="wa-spr" style="position:relative;width:clamp(34px,8vw,58px);height:auto" viewBox="0 0 60 52" aria-hidden="true">' +
      /* night: the pool of light on the ledge, then the flame */
      '<g class="wa-night">' +
      '<ellipse cx="30" cy="34" rx="29" ry="17" fill="rgba(255,168,54,.34)"/>' +
      '<ellipse cx="30" cy="30" rx="17" ry="12" fill="rgba(255,206,110,.42)"/>' +
      '<g ' + (i % 2 === 0 ? 'class="wam-flame" style="animation-duration:' +
      (1.25 + (i % 4) * 0.22).toFixed(2) + 's;animation-delay:' + dly(seed + i, 1400) + '"' : '') + '>' +
      '<path fill="#ff9d1c" d="M30 30Q39 18 30 2Q21 18 30 30Z"/>' +
      '<path fill="#ffdf7a" d="M30 28Q35 18 30 9Q25 18 30 28Z"/>' +
      '<path fill="#fff6d2" d="M30 27Q32.5 21 30 16Q27.5 21 30 27Z"/>' +
      '</g></g>' +
      /* the clay lamp itself — present in both modes */
      '<path fill="#3c1c0e" d="M28 34h4v-6h-4z"/>' +
      '<path fill="#b5581f" d="M3 32Q30 44 57 32L51 46Q30 53 9 46Z"/>' +
      '<path fill="#d9752f" d="M3 32Q30 42 57 32Q30 39 3 32Z"/>' +
      '<path fill="rgba(255,255,255,.25)" d="M8 35Q30 43 52 35L50 38Q30 45 10 38Z"/>' +
      '</svg>';
  }

  /* ======================================================================= */
  /*  SCENES — each world returns { bd, band, sky, foot }                    */
  /*  Every builder is a function so nothing is computed until a world is    */
  /*  actually shown.                                                        */
  /* ======================================================================= */
  var S = {};

  /* ======================================================================= */
  /*  HOLI HAI                                                               */
  /*  Colour is the whole point, so Holi ignores the token palette and uses  */
  /*  real gulal: magenta, saffron, green, blue, yellow.                     */
  /*  MEASURED animating nodes: DAY 15 · NIGHT 10.                           */
  /* ======================================================================= */
  var GUL = { m: '#e0219b', s: '#ff8a1f', g: '#11a869', b: '#2f7fe6', y: '#f9cf24', r: '#e63946' };

  /* BEHIND the cards: saturated colour, seen through every gutter and gap. */
  function holiBd() {
    return '<div class="wa-day">' +
      puff({ l: '-10%', t: '2%', w: 'clamp(260px,58vw,560px)', c: GUL.m, a: 0.85, cls: 'wam-burst', dur: 10, dl: '-1.2s' }) +
      puff({ l: '54%', t: '-6%', w: 'clamp(240px,54vw,520px)', c: GUL.s, a: 0.62 }) +
      puff({ l: '10%', t: '48%', w: 'clamp(280px,64vw,620px)', c: GUL.g, a: 0.72, cls: 'wam-burst', dur: 14, dl: '-9.1s' }) +
      puff({ l: '58%', t: '34%', w: 'clamp(250px,56vw,540px)', c: GUL.b, a: 0.55 }) +
      /* colour that landed earlier and simply stayed */
      puff({ l: '26%', t: '16%', w: 'clamp(200px,44vw,440px)', c: GUL.y, a: 0.5 }) +
      puff({ l: '0%', t: '70%', w: 'clamp(220px,48vw,480px)', c: GUL.m, a: 0.42 }) +
      puff({ l: '70%', t: '76%', w: 'clamp(200px,44vw,440px)', c: GUL.s, a: 0.4 }) +
      '</div>' +
      '<div class="wa-night">' +
      puff({ l: '18%', t: '44%', w: 'clamp(320px,76vw,820px)', c: '#ff7a1a', a: 0.5, cls: 'wam-glow', dur: 7 }) +
      puff({ l: '-10%', t: '4%', w: 'clamp(230px,52vw,500px)', c: '#7a2f8c', a: 0.6, cls: 'wam-burst', dur: 18, dl: '-3s' }) +
      puff({ l: '58%', t: '10%', w: 'clamp(220px,48vw,460px)', c: '#2f4f9e', a: 0.55, cls: 'wam-burst', dur: 21, dl: '-11s' }) +
      '</div>';
  }

  /* IN FRONT of the cards, held low: the page itself is dusted with colour. */
  function holiAir() {
    return '<div class="wa-day">' +
      puff({ l: '-14%', t: '0%', w: 'clamp(260px,60vw,580px)', c: GUL.m, a: 0.3, cls: 'wam-burst', dur: 10, dl: '-1.2s' }) +
      puff({ l: '52%', t: '-8%', w: 'clamp(250px,56vw,540px)', c: GUL.s, a: 0.28, cls: 'wam-burst', dur: 12.5, dl: '-6.4s' }) +
      puff({ l: '4%', t: '46%', w: 'clamp(300px,68vw,660px)', c: GUL.g, a: 0.24, cls: 'wam-burst', dur: 14, dl: '-9.1s' }) +
      puff({ l: '56%', t: '30%', w: 'clamp(270px,60vw,580px)', c: GUL.b, a: 0.24, cls: 'wam-burst', dur: 11.5, dl: '-4.3s' }) +
      /* twenty-eight powder specks riding the air — ONE animated node */
      spr('left:0;top:0;width:100%;height:100%', '0 0 100 100',
        '<g class="wam-drift" style="animation-duration:70s">' +
        rep(16, function (i) {
          var x = (i * 41) % 100, y = (i * 53) % 96, r = 0.24 + (i % 3) * 0.14;
          return '<circle cx="' + x + '" cy="' + y + '" r="' + r.toFixed(2) + '" fill="' +
            [GUL.m, GUL.s, GUL.g, GUL.b, GUL.y][i % 5] + '" opacity=".45"/>';
        }) + '</g>') +
      '</div>' +
      '<div class="wa-night">' +
      puff({ l: '16%', t: '40%', w: 'clamp(340px,80vw,880px)', c: '#ff7a1a', a: 0.16, cls: 'wam-glow', dur: 7 }) +
      /* embers riding the heat all the way up the page */
      spr('left:0;bottom:0;width:100%;height:100%', '0 0 100 100',
        '<g class="wam-rise" style="animation-duration:9s">' +
        rep(16, function (i) {
          return '<circle cx="' + (26 + (i * 31) % 50) + '" cy="' + (60 + (i * 17) % 40) + '" r="' +
            (0.4 + (i % 3) * 0.22).toFixed(2) + '" fill="' + (i % 3 ? '#ffb545' : '#ff6a1a') + '" opacity=".9"/>';
        }) + '</g>') +
      '</div>';
  }

  function holiBand() {
    /* fat drips of colour running down from under the topbar, plus a row of
       handprints — the two things a child paints first. */
    var grad = 'linear-gradient(90deg,' + GUL.m + ' 0 25%,' + GUL.s + ' 25% 50%,' +
      GUL.g + ' 50% 75%,' + GUL.b + ' 75% 100%)';
    var hand = '<path d="M13 40V22q0-4 3-4t3 4v8V10q0-4 3-4t3 4v18V6q0-4 3-4t3 4v22V12q0-4 3-4t3 4v26' +
      'q0 14-10 14T13 40Z"/>';
    return '<div class="wa-day">' +
      '<i class="wa-tileband" style="top:0;height:100%;background-image:' + grad + ';background-size:520px 100%;' +
      '-webkit-mask-image:' + M_DRIP + ';mask-image:' + M_DRIP + ';-webkit-mask-size:62px 54px;mask-size:62px 54px;' +
      '-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;opacity:.9"></i>' +
      spr('right:6%;top:34%;width:clamp(26px,6vw,40px);height:auto;opacity:.75;transform:rotate(9deg)',
        '0 0 48 56', '<g fill="' + GUL.g + '">' + hand + '</g>') +
      spr('left:8%;top:40%;width:clamp(22px,5vw,34px);height:auto;opacity:.7;transform:rotate(-14deg)',
        '0 0 48 56', '<g fill="' + GUL.b + '">' + hand + '</g>') +
      '</div>' +
      '<div class="wa-night">' +
      '<i class="wa-tileband" style="top:0;height:100%;background-image:' + grad + ';background-size:520px 100%;' +
      '-webkit-mask-image:' + M_DRIP + ';mask-image:' + M_DRIP + ';-webkit-mask-size:62px 54px;mask-size:62px 54px;' +
      '-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;opacity:.42"></i>' +
      '</div>';
  }

  function holiSky() {
    return '<div class="wa-day">' +
      /* a puff of gulal crossing the whole viewport at head height */
      spr('left:0;top:22%;width:clamp(90px,22vw,190px);height:auto;opacity:.75', '0 0 120 90',
        '<g class="wam-cross" style="animation-duration:52s">' +
        '<circle cx="40" cy="46" r="26" fill="' + GUL.m + '" opacity=".5"/>' +
        '<circle cx="66" cy="34" r="18" fill="' + GUL.y + '" opacity=".5"/>' +
        '<circle cx="72" cy="58" r="14" fill="' + GUL.g + '" opacity=".45"/>' +
        rep(9, function (i) {
          return '<circle cx="' + (16 + i * 11) + '" cy="' + (20 + (i * 29) % 56) + '" r="' + (1.6 + (i % 3)) +
            '" fill="' + [GUL.b, GUL.s, GUL.m][i % 3] + '" opacity=".65"/>';
        }) + '</g>') +
      '</div><div class="wa-night"></div>';
  }

  function holiFoot() {
    /* --- the pichkari: brass pump, a plunger that visibly PUMPS, and an arc
           of colour leaving the nozzle. Barrel and jet are separate groups so
           the barrel can be tilted without throwing the jet out of frame. --- */
    var jet = '<g class="wam-jet" style="transform-box:view-box;transform-origin:236px 132px">' +
      /* the solid core of the arc */
      rep(11, function (i) {
        var t = i / 10, x = 240 + t * 200, y = 132 - t * 96 + t * t * 46, r = 13 - i * 0.85;
        return '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + r.toFixed(1) +
          '" fill="' + [GUL.m, GUL.s, GUL.y][i % 3] + '" opacity=".92"/>';
      }) +
      /* spray flying off the arc */
      rep(10, function (i) {
        var t = i / 9, x = 262 + t * 190, y = 104 - t * 74 + t * t * 60 - (i % 3) * 9;
        return '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + (2.4 + (i % 3) * 1.6) +
          '" fill="' + [GUL.g, GUL.b, GUL.m][i % 3] + '" opacity=".85"/>';
      }) + '</g>';
    var pichkari = spr('left:1%;bottom:38px;width:clamp(190px,46vw,340px);height:auto', '0 0 470 264',
      '<g transform="rotate(-30 110 200)">' +
      '<g class="wam-pump"><rect x="4" y="176" width="20" height="50" rx="9" fill="#8a5a22"/>' +
      '<rect x="22" y="193" width="56" height="16" rx="8" fill="#e0bc72"/></g>' +
      '<rect x="70" y="172" width="152" height="58" rx="29" fill="#c9922f"/>' +
      '<rect x="70" y="179" width="152" height="15" rx="7" fill="#f2d488" opacity=".9"/>' +
      '<rect x="102" y="172" width="11" height="58" fill="#9a6c1c" opacity=".55"/>' +
      '<rect x="182" y="172" width="11" height="58" fill="#9a6c1c" opacity=".55"/>' +
      '<path fill="#a9761f" d="M220 182L252 192v18l-32 10z"/>' +
      '<circle cx="252" cy="201" r="10" fill="#c9922f"/></g>' +
      jet);
    /* --- painted faces peeking over the bottom edge of the page --- */
    function face(x, y, r, skin, hair, k) {
      var kurta = [GUL.y, '#bfe3ff', '#ffd9ec'][k % 3];
      return '<g transform="translate(' + x + ' ' + y + ')">' +
        '<path fill="' + kurta + '" d="M' + (-r * 1.7) + ' 104q4-' + (r * 1.5) + ' ' + (r * 1.7) + '-' + (r * 1.6) +
        'h' + (r * 1.4) + 'q' + (r * 1.6) + ' ' + (r * 0.1) + ' ' + (r * 1.7) + ' ' + (r * 1.6) + 'v40h' + (-r * 6.8) + 'z"/>' +
        '<circle cx="' + (-r * 0.7) + '" cy="' + (r * 1.9) + '" r="' + (r * 0.46) + '" fill="' + [GUL.g, GUL.m, GUL.b][k % 3] + '" opacity=".85"/>' +
        '<circle cx="' + (r * 0.95) + '" cy="' + (r * 2.3) + '" r="' + (r * 0.32) + '" fill="' + [GUL.b, GUL.s, GUL.g][k % 3] + '" opacity=".85"/>' +
        '<circle cx="0" cy="0" r="' + r + '" fill="' + skin + '"/>' +
        '<path fill="' + hair + '" d="M' + (-r) + ' -2a' + r + ' ' + r + ' 0 0 1 ' + (r * 2) + ' 0q-' + r + '-' + (r * 0.62) + '-' + (r * 2) + ' 0z"/>' +
        '<circle cx="' + (-r * 0.34) + '" cy="' + (-r * 0.06) + '" r="' + (r * 0.11) + '" fill="#2a1810"/>' +
        '<circle cx="' + (r * 0.34) + '" cy="' + (-r * 0.06) + '" r="' + (r * 0.11) + '" fill="#2a1810"/>' +
        '<path fill="none" stroke="#2a1810" stroke-width="' + (r * 0.1) + '" stroke-linecap="round" d="M' +
        (-r * 0.34) + ' ' + (r * 0.34) + 'q' + (r * 0.34) + ' ' + (r * 0.32) + ' ' + (r * 0.68) + ' 0"/>' +
        /* the smeared gulal — cheeks and forehead */
        '<ellipse cx="' + (-r * 0.6) + '" cy="' + (r * 0.26) + '" rx="' + (r * 0.36) + '" ry="' + (r * 0.22) +
        '" fill="' + [GUL.m, GUL.g, GUL.b][k % 3] + '" opacity=".88" transform="rotate(-16 ' + (-r * 0.6) + ' ' + (r * 0.26) + ')"/>' +
        '<ellipse cx="' + (r * 0.62) + '" cy="' + (r * 0.3) + '" rx="' + (r * 0.32) + '" ry="' + (r * 0.2) +
        '" fill="' + [GUL.y, GUL.b, GUL.s][k % 3] + '" opacity=".88" transform="rotate(14 ' + (r * 0.62) + ' ' + (r * 0.3) + ')"/>' +
        '<ellipse cx="' + (r * 0.1) + '" cy="' + (-r * 0.52) + '" rx="' + (r * 0.44) + '" ry="' + (r * 0.18) +
        '" fill="' + [GUL.s, GUL.m, GUL.y][k % 3] + '" opacity=".85"/>' +
        '</g>';
    }
    var faces = spr('right:1%;bottom:-4px;width:clamp(200px,50vw,370px);height:auto', '0 0 340 158',
      /* one arm up, mid-throw, with the gulal already leaving the hand */
      '<g class="wam-swayb" style="transform-box:view-box;transform-origin:252px 124px;animation-duration:2.1s">' +
      '<path fill="none" stroke="#a8703f" stroke-width="14" stroke-linecap="round" d="M252 120L272 56"/>' +
      '<circle cx="274" cy="46" r="14" fill="#a8703f"/>' +
      '<circle cx="274" cy="34" r="21" fill="' + GUL.m + '" opacity=".5"/>' +
      '<circle cx="290" cy="20" r="7" fill="' + GUL.y + '" opacity=".8"/>' +
      '<circle cx="258" cy="18" r="5" fill="' + GUL.g + '" opacity=".8"/></g>' +
      '<g class="wam-bob" style="transform-box:view-box;transform-origin:50% 100%;animation-duration:3.8s">' +
      face(62, 76, 37, '#c68e5e', '#221008', 0) +
      face(158, 64, 31, '#e0b087', '#2b1206', 1) +
      face(250, 84, 35, '#a86f42', '#1a0c06', 2) +
      '</g>');
    /* --- splatters that fly in, LAND, stain the ground and slowly fade --- */
    function splat(l, b, w, c, dur, delay) {
      return spr('left:' + l + ';bottom:' + b + ';width:' + w + ';height:auto',
        '0 0 100 100',
        '<g class="wam-splat" style="animation-duration:' + dur + 's;animation-delay:' + delay + '">' +
        '<path fill="' + c + '" opacity=".62" d="M50 12q14 2 20 14t16 14q8 10-2 20t-10 22q-4 12-18 8t-24 2' +
        'q-12 2-16-10t-14-18q-8-10 2-19t8-21q4-12 18-10t20-2z"/>' +
        '<circle cx="14" cy="18" r="6" fill="' + c + '" opacity=".75"/>' +
        '<circle cx="88" cy="26" r="4.5" fill="' + c + '" opacity=".75"/>' +
        '<circle cx="76" cy="90" r="7" fill="' + c + '" opacity=".65"/>' +
        '<circle cx="20" cy="86" r="4" fill="' + c + '" opacity=".65"/>' +
        '<circle cx="96" cy="60" r="3" fill="' + c + '" opacity=".6"/>' +
        '</g>');
    }
    return '<div class="wa-day">' +
      /* the ground the colour landed on */
      '<i class="wa-floor" style="height:70px;background:linear-gradient(to bottom,' + rgba(GUL.y, 0.2) + ',' + rgba(GUL.m, 0.26) + ')"></i>' +
      '<i class="wa-fade" style="bottom:60px;height:66px"></i>' +
      puff({ l: '4%', t: 'auto', w: 'clamp(140px,30vw,280px)', h: '64px', c: GUL.g, a: 0.42 }).replace('top:auto', 'bottom:2px') +
      puff({ l: '42%', t: 'auto', w: 'clamp(160px,34vw,320px)', h: '58px', c: GUL.b, a: 0.38 }).replace('top:auto', 'bottom:-4px') +
      puff({ l: '70%', t: 'auto', w: 'clamp(140px,30vw,260px)', h: '52px', c: GUL.s, a: 0.4 }).replace('top:auto', 'bottom:6px') +
      splat('20%', '36px', 'clamp(50px,12vw,92px)', GUL.m, 15, '-2s') +
      splat('54%', '62px', 'clamp(44px,10vw,78px)', GUL.g, 18, '-11s') +
      splat('36%', '14px', 'clamp(58px,14vw,108px)', GUL.b, 21, '-6.5s') +
      pichkari + faces +
      '</div>' +
      '<div class="wa-night">' +
      /* Holika Dahan eve: the community bonfire, people standing round it.
         Cultural, and deliberately never a deity or any figure of worship. */
      '<i class="wa-floor" style="height:64px;background:linear-gradient(to bottom,rgba(70,30,12,.3),rgba(22,9,4,.55))"></i>' +
      '<i class="wa-fade" style="bottom:54px;height:64px"></i>' +
      puff({ l: '50%', t: 'auto', w: 'clamp(320px,86vw,760px)', h: 'clamp(230px,52vw,480px)', c: '#ff8a1f', a: 0.55, cls: 'wam-glow', dur: 5.2 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-46px') +
      spr('left:50%;bottom:2px;width:clamp(290px,74vw,540px);height:auto;transform:translateX(-50%)', '0 0 420 230',
        '<g fill="#180b06" opacity=".92">' +
        '<g transform="translate(30 124)"><circle cx="0" cy="0" r="14"/><path d="M-16 90V24q0-17 16-17t16 17v66z"/></g>' +
        '<g transform="translate(86 140)"><circle cx="0" cy="0" r="12"/><path d="M-14 76V20q0-14 14-14t14 14v56z"/>' +
        '<path stroke="#180b06" stroke-width="8" stroke-linecap="round" fill="none" d="M11 26L34 4"/></g>' +
        '<g transform="translate(338 128)"><circle cx="0" cy="0" r="13"/><path d="M-15 86V22q0-16 15-16t15 16v64z"/></g>' +
        '<g transform="translate(390 144)"><circle cx="0" cy="0" r="11"/><path d="M-13 72V18q0-13 13-13t13 13v54z"/>' +
        '<path stroke="#180b06" stroke-width="7" stroke-linecap="round" fill="none" d="M-11 24L-32 6"/></g>' +
        '</g>' +
        '<g stroke="#3d1e0d" stroke-width="15" stroke-linecap="round">' +
        '<path d="M142 216L276 184M276 216L142 184M182 220L210 172M238 220L212 172"/></g>' +
        '<path class="wam-flame" style="animation-duration:1.7s;transform-box:view-box;transform-origin:209px 196px" fill="#e84a10" opacity=".95"' +
        ' d="M209 196q-62-34-48-98q5 26 22 33q-17-54 26-88q-7 47 24 62q26 12 21 47q-5 35-45 44z"/>' +
        '<path class="wam-flame" style="animation-duration:1.25s;animation-delay:-.4s;transform-box:view-box;transform-origin:209px 196px" fill="#ff9b1a"' +
        ' d="M209 196q-40-24-31-68q5 19 17 24q-10-38 19-61q-5 33 17 42q17 10 14 33q-5 26-36 30z"/>' +
        '<path class="wam-flame" style="animation-duration:.95s;animation-delay:-.8s;transform-box:view-box;transform-origin:209px 196px" fill="#ffe08a"' +
        ' d="M209 194q-22-14-17-40q4 12 10 14q-6-24 12-38q-4 21 10 26q11 7 8 21q-3 17-23 17z"/>' +
        '<g class="wam-rise" style="animation-duration:3.2s">' +
        rep(14, function (i) {
          return '<circle cx="' + (168 + (i * 37) % 84) + '" cy="' + (118 - (i * 13) % 62) + '" r="' +
            (1.8 + (i % 3) * 1.1) + '" fill="' + (i % 2 ? '#ffc45a' : '#ff7a1a') + '"/>';
        }) + '</g>') +
      '</div>';
  }
  S.holi = { bd: holiBd, air: holiAir, band: holiBand, sky: holiSky, foot: holiFoot };

  /* ======================================================================= */
  /*  DIWALI NIGHTS                                                          */
  /*  DAY   = preparation. Torans up, rangoli drawn, diyas set out UNLIT.    */
  /*  NIGHT = the event. Every flame lights, the rangoli glows, string       */
  /*          lights run, a phuljhari throws sparks, fireworks bloom.        */
  /*  MEASURED animating nodes: DAY 6 · NIGHT 14 (the cap). At night that is */
  /*  4 diya flames (every other lamp flickers, the rest burn steady), 2+2    */
  /*  bulb rows, 1 rangoli glow, 2 phuljhari, 2 fireworks and 1 wash.         */
  /* ======================================================================= */
  var DIY = { clay: '#b5581f', gold: '#f0ac29', flame: '#ffb454', mari: '#f28c1c', marid: '#d95f0c', leaf: '#2f7d4f' };

  function diwaliBd() {
    return '<div class="wa-day">' +
      /* late-afternoon sun, warm and low — the day before the night */
      puff({ l: '58%', t: '-16%', w: 'clamp(300px,64vw,680px)', c: '#ffd27a', a: 0.55, cls: 'wam-glow', dur: 9 }) +
      puff({ l: '-14%', t: '30%', w: 'clamp(240px,52vw,520px)', c: '#f0ac29', a: 0.2 }) +
      /* marigold petals coming loose from the torans */
      spr('left:0;top:0;width:100%;height:100%', '0 0 100 100',
        '<g class="wam-fall" style="animation-duration:24s">' +
        rep(10, function (i) {
          return '<ellipse cx="' + (8 + (i * 19) % 84) + '" cy="' + ((i * 11) % 18) + '" rx="1.5" ry="1" fill="' +
            (i % 2 ? DIY.mari : DIY.marid) + '" opacity=".8"/>';
        }) + '</g>') +
      spr('left:0;top:0;width:100%;height:100%', '0 0 100 100',
        '<g class="wam-fall" style="animation-duration:31s;animation-delay:-14s">' +
        rep(8, function (i) {
          return '<ellipse cx="' + (14 + (i * 23) % 76) + '" cy="' + ((i * 13) % 16) + '" rx="1.3" ry="0.9" fill="' +
            (i % 2 ? DIY.marid : DIY.mari) + '" opacity=".7"/>';
        }) + '</g>') +
      '</div>' +
      '<div class="wa-night">' +
      /* the night sky, and the far-off glow of a whole city lighting up */
      puff({ l: '50%', t: 'auto', w: 'clamp(400px,100vw,1200px)', h: 'clamp(220px,40vw,460px)', c: '#ff9d1c', a: 0.22 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-10%') +
      spr('left:0;top:0;width:100%;height:70%', '0 0 100 70',
        '<g>' + rep(26, function (i) {
          return '<circle cx="' + ((i * 41) % 100) + '" cy="' + ((i * 23) % 66) + '" r="' + (0.28 + (i % 3) * 0.16) +
            '" fill="#ffeec4" opacity="' + (0.4 + (i % 4) * 0.16).toFixed(2) + '"/>';
        }) + '</g>') +
      '</div>';
  }

  /* In front of the cards: daylight warmth, then the glow of a lit street. */
  function diwaliAir() {
    return '<div class="wa-day">' +
      puff({ l: '54%', t: '-20%', w: 'clamp(320px,70vw,760px)', c: '#ffc44f', a: 0.24, cls: 'wam-glow', dur: 9 }) +
      puff({ l: '-18%', t: '26%', w: 'clamp(260px,58vw,560px)', c: '#f0ac29', a: 0.1 }) +
      '</div>' +
      '<div class="wa-night">' +
      puff({ l: '50%', t: 'auto', w: 'clamp(420px,110vw,1300px)', h: 'clamp(240px,46vw,520px)', c: '#ff9d1c', a: 0.16, cls: 'wam-glow', dur: 8 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-8%') +
      puff({ l: '8%', t: '10%', w: 'clamp(200px,44vw,440px)', c: '#ffd479', a: 0.1 }) +
      puff({ l: '62%', t: '30%', w: 'clamp(200px,44vw,440px)', c: '#e58ab5', a: 0.1 }) +
      '</div>';
  }

  function diwaliBand() {
    var grad = 'linear-gradient(90deg,' + DIY.mari + ' 0 38%,' + DIY.leaf + ' 38% 62%,' + DIY.marid + ' 62% 100%)';
    var toran = '<i class="wa-tileband" style="top:0;height:100%;background-image:' + grad +
      ';background-size:168px 100%;-webkit-mask-image:' + M_TORAN + ';mask-image:' + M_TORAN +
      ';-webkit-mask-size:84px 46px;mask-size:84px 46px;-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x">' +
      '</i>';
    return '<div class="wa-day">' +
      '<div class="wam-bob" style="position:absolute;inset:0;animation-duration:5.5s">' + toran + '</div>' +
      '</div>' +
      '<div class="wa-night">' +
      '<div style="position:absolute;inset:0;opacity:.72">' + toran + '</div>' +
      /* string lights come on across the header */
      bulbs({ c: '#ffd07a', top: 'calc(100% - 22px)', h: '22px', pitch: 30, r: 2.8, rows: 2, dur: 2.2 }) +
      '</div>';
  }

  function diwaliSky() {
    function firework(l, t, w, c1, c2, dur, delay) {
      return spr('left:' + l + ';top:' + t + ';width:' + w + ';height:auto', '0 0 120 120',
        '<g class="wam-pop" style="animation-duration:' + dur + 's;animation-delay:' + delay + '">' +
        '<circle cx="60" cy="60" r="54" fill="' + rgba(c1, 0.22) + '"/>' +
        '<circle cx="60" cy="60" r="26" fill="' + rgba(c1, 0.3) + '"/>' +
        rep(16, function (i) {
          var a = i * Math.PI / 8, x = 60 + Math.cos(a) * 50, y = 60 + Math.sin(a) * 50;
          return '<path stroke="' + (i % 2 ? c1 : c2) + '" stroke-width="1.6" stroke-linecap="round" opacity=".7" fill="none" d="M' +
            (60 + Math.cos(a) * 18).toFixed(1) + ' ' + (60 + Math.sin(a) * 18).toFixed(1) + 'L' + x.toFixed(1) + ' ' + y.toFixed(1) + '"/>';
        }) +
        rep(16, function (i) {
          var a = i * Math.PI / 8;
          return '<circle cx="' + (60 + Math.cos(a) * 52).toFixed(1) + '" cy="' + (60 + Math.sin(a) * 52).toFixed(1) +
            '" r="1.9" fill="' + (i % 2 ? c2 : c1) + '" opacity=".8"/>';
        }) + '</g>');
    }
    return '<div class="wa-day"></div>' +
      '<div class="wa-night">' +
      firework('-6%', '2%', 'clamp(150px,36vw,300px)', '#ffd479', '#ff8ab0', 9, '-1s') +
      firework('66%', '10%', 'clamp(130px,32vw,260px)', '#8fd6ff', '#ffe08a', 11, '-6.5s') +
      '</div>';
  }

  function diwaliFoot() {
    var N = 7;                                   /* seven diyas → seven flames at night */
    var row = '<div class="wa-row" style="bottom:34px;padding:0 2%">' +
      rep(N, function (i) { return diya('dw', i); }) + '</div>';
    /* the rangoli, drawn big on the threshold */
    function rangoli() {
      var petals = rep(12, function (i) {
        return '<ellipse cx="150" cy="26" rx="13" ry="26" fill="' + [DIY.mari, '#c8397a', '#2f7d4f', '#f0ac29'][i % 4] +
          '" opacity=".9" transform="rotate(' + (i * 30) + ' 150 70) "/>';
      });
      var petals2 = rep(8, function (i) {
        return '<ellipse cx="150" cy="46" rx="9" ry="17" fill="' + ['#e8452a', '#f7d04a'][i % 2] +
          '" opacity=".95" transform="rotate(' + (i * 45 + 22) + ' 150 70)"/>';
      });
      var dots = rep(16, function (i) {
        var a = i * Math.PI / 8;
        return '<circle cx="' + (150 + Math.cos(a) * 128).toFixed(1) + '" cy="' + (70 + Math.sin(a) * 58).toFixed(1) +
          '" r="4" fill="#ffffff" opacity=".62"/>';
      });
      return spr('left:50%;bottom:-8px;width:clamp(160px,38vw,300px);height:auto;transform:translateX(-50%)',
        '0 0 300 140',
        /* night: the whole rangoli catches the lamplight */
        '<g class="wa-night"><ellipse class="wam-glow" style="transform-box:view-box;transform-origin:150px 70px;animation-duration:5s"' +
        ' cx="150" cy="70" rx="146" ry="66" fill="rgba(255,183,77,.34)"/></g>' +
        '<ellipse cx="150" cy="70" rx="140" ry="62" fill="rgba(255,255,255,.22)"/>' +
        '<ellipse cx="150" cy="70" rx="140" ry="62" fill="none" stroke="#ffffff" stroke-width="2.4" opacity=".5"/>' +
        petals + petals2 +
        '<circle cx="150" cy="70" r="16" fill="#f7d04a"/><circle cx="150" cy="70" r="8" fill="#e8452a"/>' +
        dots);
    }
    /* phuljhari — a sparkler held out over the threshold, night only */
    var phuljhari = spr('right:5%;bottom:44px;width:clamp(90px,22vw,170px);height:auto', '0 0 180 180',
      '<path stroke="#6b4a2a" stroke-width="7" stroke-linecap="round" fill="none" d="M158 176L96 74"/>' +
      '<g class="wam-flick" style="animation-duration:.28s;transform-box:view-box;transform-origin:92px 66px">' +
      '<circle cx="92" cy="66" r="15" fill="rgba(255,240,190,.6)"/>' +
      '<circle cx="92" cy="66" r="7" fill="#fffbe8"/>' +
      rep(18, function (i) {
        var a = i * Math.PI / 9, L = 22 + (i % 4) * 13;
        return '<path stroke="' + (i % 3 ? '#ffd873' : '#fff3c6') + '" stroke-width="2.4" stroke-linecap="round" fill="none" d="M' +
          (92 + Math.cos(a) * 12).toFixed(1) + ' ' + (66 + Math.sin(a) * 12).toFixed(1) + 'L' +
          (92 + Math.cos(a) * L).toFixed(1) + ' ' + (66 + Math.sin(a) * L).toFixed(1) + '"/>';
      }) + '</g>' +
      '<g class="wam-rise" style="animation-duration:2.4s">' +
      rep(9, function (i) {
        return '<circle cx="' + (74 + (i * 23) % 40) + '" cy="' + (64 + (i * 17) % 34) + '" r="' + (1.4 + (i % 3) * 0.7) +
          '" fill="#ffcf6b"/>';
      }) + '</g>');
    /* the threshold the diyas stand on — a warm stone ledge */
    var ledge = '<i class="wa-floor" style="height:30px;background:linear-gradient(to bottom,' +
      rgba(DIY.clay, 0.42) + ',' + rgba('#5a2a10', 0.5) + ');border-top:2px solid ' + rgba('#7a3c16', 0.6) + '"></i>';
    /* marigold garland draped along the ledge — static, both modes */
    var garland = '<i class="wa-tileband" style="bottom:24px;height:26px;background-image:linear-gradient(90deg,' +
      DIY.mari + ' 0 40%,' + DIY.leaf + ' 40% 60%,' + DIY.marid + ' 60% 100%);background-size:126px 100%;' +
      '-webkit-mask-image:' + M_TORAN + ';mask-image:' + M_TORAN + ';-webkit-mask-size:63px 34px;mask-size:63px 34px;' +
      '-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;opacity:.75"></i>';
    return '<i class="wa-fade" style="bottom:52px;height:70px"></i>' + ledge +
      '<div class="wam-bob" style="position:absolute;inset:0;animation-duration:6.5s">' + garland + '</div>' +
      rangoli() + row +
      '<div class="wa-day">' +
      /* unlit and waiting: a stack of spare diyas and the oil pot */
      spr('left:4%;bottom:34px;width:clamp(56px,14vw,110px);height:auto;opacity:.95', '0 0 120 90',
        '<path fill="' + DIY.clay + '" d="M8 44Q60 60 112 44L104 62Q60 74 16 62Z"/>' +
        '<path fill="#d9752f" d="M8 44Q60 56 112 44Q60 52 8 44Z"/>' +
        '<path fill="' + DIY.clay + '" d="M20 24Q60 38 100 24L94 40Q60 50 26 40Z"/>' +
        '<path fill="#d9752f" d="M20 24Q60 34 100 24Q60 31 20 24Z"/>' +
        '<path fill="#8a6a2a" d="M64 22c-10 0-16-8-16-16 0-8 16-22 16-22s16 14 16 22c0 8-6 16-16 16z" opacity=".0"/>') +
      '</div>' +
      '<div class="wa-night">' +
      /* a second string of lights along the ledge, and the sparkler */
      bulbs({ c: '#ffca6e', top: 'calc(100% - 78px)', h: '20px', pitch: 32, r: 2.6, rows: 2, dur: 2.6 }) +
      phuljhari +
      '</div>';
  }
  S.diwali = { bd: diwaliBd, air: diwaliAir, band: diwaliBand, sky: diwaliSky, foot: diwaliFoot };

  /* ======================================================================= */
  /*  DELHI 6 — the lanes of Chandni Chowk                                   */
  /*  DAY 6 animating nodes · NIGHT 6                                        */
  /* ======================================================================= */
  function d6Bd() {
    return '<div class="wa-day">' +
      puff({ l: '58%', t: '-14%', w: 'clamp(280px,62vw,640px)', c: '#e9a13b', a: 0.55, cls: 'wam-glow', dur: 11 }) +
      puff({ l: '-16%', t: '34%', w: 'clamp(260px,56vw,560px)', c: '#ba4a2a', a: 0.3 }) +
      puff({ l: '30%', t: '70%', w: 'clamp(240px,52vw,520px)', c: '#e9a13b', a: 0.32 }) +
      '</div><div class="wa-night">' +
      puff({ l: '50%', t: 'auto', w: 'clamp(400px,104vw,1200px)', h: 'clamp(200px,40vw,440px)', c: '#ffa844', a: 0.34 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-6%') +
      puff({ l: '-12%', t: '18%', w: 'clamp(240px,52vw,520px)', c: '#ff9a3c', a: 0.26, cls: 'wam-glow', dur: 9 }) +
      puff({ l: '62%', t: '8%', w: 'clamp(220px,48vw,460px)', c: '#7a4a1e', a: 0.4 }) +
      '</div>';
  }
  function d6Band() {
    var arcade = '<i class="wa-tileband" style="top:0;height:100%;background:var(--wa-accent);opacity:.55;' +
      '-webkit-mask-image:' + M_ARCADE + ';mask-image:' + M_ARCADE + ';-webkit-mask-size:40px 22px;mask-size:40px 22px;' +
      '-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;-webkit-mask-position:0 100%;mask-position:0 100%"></i>';
    return '<div class="wa-day">' + arcade + '</div>' +
      '<div class="wa-night">' + arcade +
      /* the bulb strings the lanes are strung with, all year round */
      bulbs({ c: '#ffc86a', top: 'calc(100% - 20px)', h: '20px', pitch: 26, r: 2.4, rows: 2, dur: 2.2 }) +
      '</div>';
  }
  function d6Sky() {
    var flock = function (dur, delay, w, top, op) {
      return spr('left:0;top:' + top + ';width:' + w + ';height:auto;opacity:' + op, '0 0 200 60',
        '<g class="wam-cross" style="animation-duration:' + dur + 's;animation-delay:' + delay + '">' +
        bird(2, 28, 1.5, 'd6a') + bird(46, 8, 1.25, 'd6b') + bird(88, 36, 1.1, 'd6c') +
        bird(130, 14, 1.55, 'd6d') + bird(172, 30, 1, 'd6e') + '</g>');
    };
    return '<div class="wa-day">' + flock(44, '-12s', 'clamp(150px,34vw,290px)', '14%', '.6') + '</div>' +
      '<div class="wa-night">' + flock(52, '-20s', 'clamp(130px,30vw,250px)', '20%', '.4') + '</div>';
  }
  function d6Foot() {
    /* the shutter-fronted lane: a rhythm of shopfronts, rickshaw, kadhai */
    var shutters = 'repeating-linear-gradient(90deg,' + rgba('#000000', 0.001) + ' 0 4px,' +
      'var(--wa-accent) 4px 46px,' + rgba('#000000', 0.001) + ' 46px 58px)';
    var rickshaw = spr('left:3%;bottom:6px;width:clamp(120px,30vw,220px);height:auto;opacity:.9', '0 0 160 100',
      '<circle class="was-i waf-n" stroke-width="5" cx="38" cy="78" r="17"/>' +
      '<circle class="was-i waf-n" stroke-width="5" cx="126" cy="80" r="14"/>' +
      '<path class="waf-a" opacity=".92" d="M16 44Q16 16 42 16L74 16Q88 16 88 38L88 66L20 66Q16 60 16 44Z"/>' +
      '<path class="was-s waf-n" stroke-width="3" d="M25 26Q52 20 80 26"/>' +
      '<path class="was-i waf-n" stroke-width="4.5" stroke-linecap="round" d="M88 60L118 72M118 72L131 50M122 50H145M38 78L72 66"/>' +
      '<circle class="waf-b" cx="146" cy="52" r="6"/>');
    var kadhai = spr('right:8%;bottom:8px;width:clamp(86px,21vw,150px);height:auto', '0 0 140 130',
      /* the halwai's kadhai, and one jalebi coil coming out of it */
      '<g class="wam-pulse" style="animation-duration:5s;transform-box:view-box;transform-origin:70px 60px">' +
      '<path class="was-b waf-n" stroke-width="6" stroke-linecap="round" opacity=".85" d="M70 26q-16 0-16 16t22 12q-26 6-26-16t28-20q26 2 26 24"/></g>' +
      '<path class="waf-i" opacity=".8" d="M14 74h112q-6 40-56 40T14 74Z"/>' +
      '<rect class="waf-i" opacity=".8" x="8" y="66" width="124" height="10" rx="5"/>' +
      '<path class="was-b waf-n" stroke-width="4" opacity=".6" d="M40 118h60"/>');
    var wall = '<i class="wa-floor" style="height:56px;background:' + shutters + ';opacity:.5"></i>' +
      '<i class="wa-floor" style="height:14px;background:var(--wa-ink);opacity:.35"></i>';
    return '<i class="wa-fade" style="bottom:48px;height:62px"></i>' + wall +
      '<div class="wa-day">' + rickshaw + kadhai +
      spr('left:0;bottom:64px;width:clamp(110px,26vw,210px);height:auto;opacity:.5', '0 0 200 50',
        '<g class="wam-cross" style="animation-duration:62s;animation-delay:-30s">' +
        bird(4, 22, 1.2, 'd6f') + bird(52, 6, 1, 'd6g') + bird(104, 26, 1.1, 'd6h') + '</g>') +
      '</div>' +
      '<div class="wa-night">' +
      /* every shutter behind a warm rectangle of light, and bulb strings
         zig-zagging over the lane — Chandni Chowk after dark */
      '<i class="wa-floor" style="height:44px;background:repeating-linear-gradient(90deg,' +
      'rgba(255,178,74,.001) 0 8px,rgba(255,178,74,.5) 8px 40px,rgba(255,178,74,.001) 40px 58px)"></i>' +
      bulbs({ c: '#ffcf7a', top: 'calc(100% - 96px)', h: '20px', pitch: 28, r: 2.6, rows: 2, dur: 2.6 }) +
      rickshaw + kadhai +
      spr('right:22%;bottom:52px;width:clamp(40px,10vw,70px);height:auto', '0 0 60 90',
        '<path stroke="#6b4a2a" stroke-width="3" fill="none" d="M30 0v16"/>' +
        '<g class="wam-flick" style="animation-duration:3.4s;transform-box:view-box;transform-origin:30px 46px">' +
        '<ellipse cx="30" cy="48" rx="27" ry="30" fill="rgba(255,180,80,.34)"/>' +
        '<path fill="#ffb454" d="M12 26h36l6 40H6z"/><path fill="#fff0c2" d="M22 34h16l3 24H19z"/></g>') +
      '</div>';
  }
  S.delhi6 = { bd: d6Bd, band: d6Band, sky: d6Sky, foot: d6Foot };

  /* ======================================================================= */
  /*  MUMBAI BUSTLE — the local, the sea, the necklace of lights             */
  /*  DAY 5 animating nodes · NIGHT 6                                        */
  /* ======================================================================= */
  function mbBd() {
    return '<div class="wa-day">' +
      puff({ l: '-14%', t: '-8%', w: 'clamp(280px,60vw,620px)', c: '#8fb8c9', a: 0.5 }) +
      puff({ l: '54%', t: '10%', w: 'clamp(260px,56vw,560px)', c: '#f2b90d', a: 0.24, cls: 'wam-glow', dur: 12 }) +
      puff({ l: '20%', t: '62%', w: 'clamp(280px,60vw,600px)', c: '#256d85', a: 0.26 }) +
      '</div><div class="wa-night">' +
      puff({ l: '50%', t: 'auto', w: 'clamp(420px,110vw,1300px)', h: 'clamp(180px,36vw,400px)', c: '#ffc94d', a: 0.26 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-4%') +
      puff({ l: '62%', t: '4%', w: 'clamp(140px,30vw,300px)', c: '#e8f0ff', a: 0.5, cls: 'wam-glow', dur: 14, mid: 0.2 }) +
      puff({ l: '-14%', t: '30%', w: 'clamp(260px,56vw,560px)', c: '#1e4a6b', a: 0.5 }) +
      '</div>';
  }
  function mbBand() {
    var deco = '<i class="wa-tileband" style="top:0;height:100%;background:linear-gradient(180deg,var(--wa-accent),var(--wa-accent2));' +
      'opacity:.6;-webkit-mask-image:' + M_DECO + ';mask-image:' + M_DECO + ';-webkit-mask-size:26px 20px;mask-size:26px 20px;' +
      '-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;-webkit-mask-position:0 100%;mask-position:0 100%"></i>';
    return '<div class="wa-day">' + deco + '</div>' +
      '<div class="wa-night">' + deco +
      bulbs({ c: '#7fe4ff', top: 'calc(100% - 18px)', h: '18px', pitch: 34, r: 2.2, rows: 2, dur: 3 }) +
      '</div>';
  }
  function mbSky() {
    return '<div class="wa-day">' +
      spr('left:0;top:10%;width:clamp(120px,28vw,230px);height:auto;opacity:.45', '0 0 200 60',
        '<g class="wam-cross" style="animation-duration:58s;animation-delay:-18s">' +
        bird(6, 26, 1.3, 'mbg1') + bird(58, 8, 1.1, 'mbg2') + bird(112, 30, 1.2, 'mbg3') + '</g>') +
      '</div><div class="wa-night"></div>';
  }
  function mbFoot() {
    /* the local: seven coaches, windows dark by day and lit at night */
    function train(lit) {
      var win = lit ? '#ffd463' : 'var(--wa-accent2)';
      return spr('left:0;bottom:44px;width:clamp(250px,62vw,470px);height:auto', '0 0 400 62',
        '<g class="wam-crosshold" style="animation-duration:' + (lit ? 40 : 34) + 's;animation-delay:-6s">' +
        '<path ' + (lit ? 'fill="#0d1826"' : 'class="waf-i"') + ' opacity=".92" d="M10 58V26Q10 8 34 8H392Q396 8 396 14V58Z"/>' +
        (lit ? '<rect x="10" y="24" width="386" height="20" fill="rgba(255,212,99,.16)"/>' : '') +
        '<rect fill="' + win + '" opacity=".95" x="18" y="20" width="18" height="14" rx="2"/>' +
        rep(9, function (i) { return '<rect fill="' + win + '" opacity=".95" x="' + (52 + i * 38) + '" y="20" width="24" height="14" rx="2"/>'; }) +
        '<rect class="waf-s" opacity=".28" x="10" y="46" width="386" height="4"/>' +
        rep(4, function (i) { return '<circle ' + (lit ? 'fill="#0d1826"' : 'class="waf-i"') + ' cx="' + (60 + i * 96) + '" cy="60" r="6"/>'; }) +
        '</g>');
    }
    var sea = '<i class="wa-floor" style="height:38px;background:var(--wa-accent);opacity:.4"></i>' +
      '<i class="wa-floor" style="height:38px;opacity:.5;background:var(--wa-surface);' +
      '-webkit-mask-image:' + M_WAVE + ';mask-image:' + M_WAVE + ';-webkit-mask-size:28px 8px;mask-size:28px 8px;' +
      '-webkit-mask-repeat:repeat;mask-repeat:repeat"></i>' +
      '<i class="wa-floor wam-drift" style="height:8px;bottom:30px;width:200%;left:0;right:auto;opacity:.6;' +
      'background:var(--wa-surface);-webkit-mask-image:' + M_WAVE + ';mask-image:' + M_WAVE +
      ';-webkit-mask-size:28px 8px;mask-size:28px 8px;-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;animation-duration:30s"></i>';
    var parapet = '<i class="wa-floor" style="bottom:38px;height:12px;background:var(--wa-ink);opacity:.3"></i>';
    return '<i class="wa-fade" style="bottom:50px;height:60px"></i>' + sea + parapet +
      '<div class="wa-day">' + train(false) +
      /* monsoon umbrellas on the promenade */
      rep(3, function (i) {
        var x = [8, 46, 78][i], c = ['waf-f', 'waf-a', 'waf-b'][i];
        return spr('left:' + x + '%;bottom:48px;width:clamp(30px,7vw,54px);height:auto', '0 0 26 32',
          '<g class="wam-bob" style="animation-duration:' + (2.6 + i * 0.5) + 's;animation-delay:' + dly('mbU' + i, 3000) + '">' +
          '<path class="' + c + '" d="M2 14Q13 1 24 14Q20 11 17.5 14Q15 11 13 14Q11 11 8.5 14Q6 11 2 14Z"/>' +
          '<path class="was-i waf-n" stroke-width="1.8" stroke-linecap="round" d="M13 14V27Q13 30 16 29"/></g>');
      }).slice(0, 100000) +
      '</div>' +
      '<div class="wa-night">' +
      /* the Queen's Necklace: two interleaved rows curving along the drive */
      bulbs({ c: '#ffe9a8', top: 'calc(100% - 62px)', h: '18px', pitch: 24, r: 2.4, rows: 2, dur: 3.2 }) +
      train(true) +
      /* the moon's road on the water */
      puff({ l: '50%', t: 'auto', w: 'clamp(60px,14vw,120px)', h: '40px', c: '#e8f0ff', a: 0.3 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:4px') +
      '</div>';
  }
  S.mumbai = { bd: mbBd, band: mbBand, sky: mbSky, foot: mbFoot };

  /* ======================================================================= */
  /*  DURGA PUJO — pandal craft only. SACRED-SAFE: the murti is never shown,  */
  /*  never abstracted, never implied. Bamboo, cloth, light and the dhaak.   */
  /*  DAY 4 animating nodes · NIGHT 7                                        */
  /* ======================================================================= */
  function pjBd() {
    return '<div class="wa-day">' +
      puff({ l: '-12%', t: '-6%', w: 'clamp(280px,60vw,600px)', c: '#ee7a3b', a: 0.36 }) +
      puff({ l: '56%', t: '20%', w: 'clamp(260px,56vw,560px)', c: '#e8b00e', a: 0.34 }) +
      puff({ l: '16%', t: '64%', w: 'clamp(280px,60vw,600px)', c: '#c1272d', a: 0.26 }) +
      '</div><div class="wa-night">' +
      puff({ l: '50%', t: 'auto', w: 'clamp(380px,96vw,1100px)', h: 'clamp(240px,48vw,520px)', c: '#ffb454', a: 0.42, cls: 'wam-glow', dur: 6.5 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-8%') +
      puff({ l: '-12%', t: '10%', w: 'clamp(240px,52vw,520px)', c: '#c1272d', a: 0.42 }) +
      puff({ l: '60%', t: '26%', w: 'clamp(220px,48vw,460px)', c: '#e8b00e', a: 0.3 }) +
      '</div>';
  }
  function pjBand() {
    var scallop = '<i class="wa-tileband" style="top:0;height:100%;background:linear-gradient(180deg,var(--wa-accent),var(--wa-festive));' +
      'opacity:.8;-webkit-mask-image:' + M_SCALLOP + ';mask-image:' + M_SCALLOP + ';-webkit-mask-size:26px 13px;mask-size:26px 13px;' +
      '-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;-webkit-mask-position:0 100%;mask-position:0 100%"></i>';
    var lattice = '<i class="wa-tileband" style="top:0;height:100%;opacity:.2;background:' +
      'repeating-linear-gradient(56deg,var(--wa-ink) 0 2px,rgba(0,0,0,0) 2px 22px),' +
      'repeating-linear-gradient(-56deg,var(--wa-ink) 0 2px,rgba(0,0,0,0) 2px 22px)"></i>';
    return '<div class="wa-day">' + lattice + scallop + '</div>' +
      '<div class="wa-night">' + lattice + scallop +
      bulbs({ c: '#ffd45e', top: 'calc(100% - 22px)', h: '22px', pitch: 22, r: 2.6, rows: 3, dur: 1.9 }) +
      '</div>';
  }
  function pjSky() {
    var shiuli = spr('left:0;top:0;width:100%;height:100%', '0 0 100 100',
      '<g class="wam-fall" style="animation-duration:22s">' +
      rep(9, function (i) {
        var x = 6 + (i * 21) % 88;
        return '<g transform="translate(' + x + ' ' + ((i * 7) % 14) + ')">' +
          rep(6, function (k) { return '<ellipse cx="0" cy="-.8" rx=".34" ry=".72" fill="#fffdf8" opacity=".5" transform="rotate(' + k * 60 + ')"/>'; }) +
          '<circle r="0.36" fill="#ee7a3b" opacity=".55"/></g>';
      }) + '</g>');
    return '<div class="wa-day">' + shiuli + '</div><div class="wa-night">' + shiuli + '</div>';
  }
  function pjFoot() {
    /* the pandal: bamboo frame, cloth drapes, a lit arch. NO murti inside —
       the interior is warm empty light and lattice, which is the craft. */
    var pandal = spr('left:50%;bottom:0;width:clamp(280px,74vw,560px);height:auto;transform:translateX(-50%)', '0 0 420 200',
      '<path class="waf-i" opacity=".14" d="M40 200V96q0-56 60-72Q210 0 320 24q60 16 60 72v104Z"/>' +
      /* bamboo frame */
      '<g class="was-i waf-n" stroke-width="4" opacity=".55">' +
      '<path d="M40 200V96q0-56 60-72Q210 0 320 24q60 16 60 72v104"/>' +
      '<path d="M76 200V104q0-40 44-54Q210 24 300 50q44 14 44 54v96"/>' +
      '<path d="M40 96h340M76 132h268M110 168h200"/></g>' +
      /* the arch mouth */
      '<path class="waf-ground" fill="var(--wa-ground)" opacity=".55" d="M150 200V132q0-38 60-38t60 38v68Z"/>' +
      '<path class="was-a waf-n" stroke-width="5" d="M150 200V132q0-38 60-38t60 38v68"/>' +
      /* cloth drapes */
      '<path class="waf-f" opacity=".7" d="M40 96h340l-10 26q-24-16-48 0t-48 0q-24-16-48 0t-48 0q-24-16-48 0t-48 0z"/>' +
      /* night: the arch fills with warm light — light, not a figure */
      '<g class="wa-night"><path fill="rgba(255,190,90,.5)" d="M152 198V132q0-36 58-36t58 36v66Z"/>' +
      '<ellipse class="wam-glow" style="transform-box:view-box;transform-origin:210px 160px;animation-duration:5.5s"' +
      ' cx="210" cy="160" rx="86" ry="60" fill="rgba(255,180,70,.34)"/></g>');
    var dhaak = spr('right:3%;bottom:8px;width:clamp(84px,20vw,150px);height:auto', '0 0 120 100',
      '<rect class="waf-b" opacity=".95" x="18" y="46" width="80" height="40" rx="18"/>' +
      '<ellipse class="waf-s was-i" stroke-width="3" cx="21" cy="66" rx="8" ry="20"/>' +
      '<ellipse class="waf-s was-i" stroke-width="3" cx="95" cy="66" rx="8" ry="20"/>' +
      '<path class="was-a waf-n" stroke-width="2.4" opacity=".6" d="M28 52L88 80M28 80L88 52M28 66H88"/>' +
      '<g class="wam-tap" style="animation-delay:-.1s"><path class="was-i waf-n" stroke-width="5" stroke-linecap="round" d="M42 42L18 8"/><circle class="waf-i" cx="18" cy="8" r="4.5"/></g>' +
      '<g class="wam-tap" style="animation-delay:-.41s"><path class="was-i waf-n" stroke-width="5" stroke-linecap="round" d="M76 42L100 8"/><circle class="waf-i" cx="100" cy="8" r="4.5"/></g>');
    return '<i class="wa-fade" style="bottom:44px;height:60px"></i>' +
      '<i class="wa-floor" style="height:26px;background:var(--wa-ink);opacity:.22"></i>' +
      pandal + dhaak +
      '<div class="wa-night">' +
      bulbs({ c: '#ffd45e', top: 'calc(100% - 104px)', h: '20px', pitch: 20, r: 2.4, rows: 3, dur: 1.7 }) +
      bulbs({ c: '#ff9d5e', top: 'calc(100% - 40px)', h: '18px', pitch: 30, r: 2.2, rows: 2, dur: 2.8 }) +
      '</div>';
  }
  S.pujo = { bd: pjBd, band: pjBand, sky: pjSky, foot: pjFoot };

  /* ======================================================================= */
  /*  DAL LAKE — mirror water by day, black glass and one lamp by night      */
  /*  DAY 5 animating nodes · NIGHT 5                                        */
  /* ======================================================================= */
  function dlBd() {
    return '<div class="wa-day">' +
      puff({ l: '-10%', t: '-10%', w: 'clamp(300px,64vw,660px)', c: '#8fb9cc', a: 0.5 }) +
      puff({ l: '56%', t: '6%', w: 'clamp(260px,56vw,560px)', c: '#d9822b', a: 0.2 }) +
      puff({ l: '10%', t: '58%', w: 'clamp(300px,64vw,640px)', c: '#33718a', a: 0.24 }) +
      '</div><div class="wa-night">' +
      puff({ l: '64%', t: '2%', w: 'clamp(120px,28vw,260px)', c: '#dbe9f7', a: 0.66, mid: 0.18, cls: 'wam-glow', dur: 16 }) +
      puff({ l: '-16%', t: '24%', w: 'clamp(280px,60vw,600px)', c: '#12304a', a: 0.6 }) +
      spr('left:0;top:0;width:100%;height:64%', '0 0 100 64',
        '<g class="wam-twinkle" style="animation-duration:6s">' +
        rep(24, function (i) {
          return '<circle cx="' + ((i * 43) % 100) + '" cy="' + ((i * 19) % 60) + '" r="' + (0.24 + (i % 3) * 0.14) + '" fill="#eaf3ff"/>';
        }) + '</g>') +
      '</div>';
  }
  function dlBand() {
    var wave = '<i class="wa-tileband wam-drift" style="top:0;height:100%;left:0;right:auto;width:200%;background:var(--wa-accent);opacity:.45;' +
      '-webkit-mask-image:' + M_WAVE + ';mask-image:' + M_WAVE + ';-webkit-mask-size:28px 10px;mask-size:28px 10px;' +
      '-webkit-mask-repeat:repeat;mask-repeat:repeat;animation-duration:34s"></i>';
    return '<div class="wa-day">' + wave + '</div><div class="wa-night">' +
      '<i class="wa-tileband" style="top:0;height:100%;left:0;right:auto;width:200%;background:var(--wa-accent);opacity:.14;' +
      '-webkit-mask-image:' + M_WAVE + ';mask-image:' + M_WAVE + ';-webkit-mask-size:28px 10px;mask-size:28px 10px;' +
      '-webkit-mask-repeat:repeat;mask-repeat:repeat"></i>' + '</div>';
  }
  function dlSky() {
    var leaves = spr('left:0;top:0;width:100%;height:100%', '0 0 100 100',
      '<g class="wam-fall" style="animation-duration:28s">' +
      rep(7, function (i) {
        return '<path fill="' + (i % 2 ? '#d9822b' : '#b04a3a') + '" opacity=".5" transform="translate(' +
          (8 + (i * 27) % 84) + ' ' + ((i * 9) % 12) + ') scale(.11)" ' +
          'd="M11 1L13.6 8L20 7L15 12L17.5 19L11 14.6L4.5 19L7 12L2 7L8.4 8Z"/>';
      }) + '</g>');
    return '<div class="wa-day">' + leaves + '</div><div class="wa-night">' + leaves + '</div>';
  }
  function dlFoot() {
    function shikara(night) {
      return spr('left:0;bottom:26px;width:clamp(190px,46vw,360px);height:auto', '0 0 260 120',
        '<g class="wam-cross" style="animation-duration:' + (night ? 78 : 66) + 's;animation-delay:-24s">' +
        '<g id="wa-shk' + (night ? 'n' : 'd') + '">' +
        '<path class="waf-i" opacity=".86" d="M10 74Q86 90 182 78Q232 72 250 56Q228 82 156 84Q56 86 10 74Z"/>' +
        '<path class="was-i waf-n" stroke-width="3" d="M92 76V40M168 74V40"/>' +
        '<path class="waf-a" opacity=".95" d="M80 40Q130 26 180 40L180 46Q130 34 80 46Z"/>' +
        '<path class="was-f waf-n" stroke-width="2.4" stroke-dasharray="2 6" d="M84 47Q130 36 176 47"/>' +
        '<circle class="waf-i" cx="46" cy="56" r="5.5"/><path class="was-i waf-n" stroke-width="3" d="M46 61L43 74"/>' +
        '<path class="was-i waf-n" stroke-width="2.8" stroke-linecap="round" d="M38 58L60 84"/>' +
        (night ? '<circle cx="200" cy="56" r="16" fill="rgba(255,190,90,.36)"/>' +
          '<circle class="wam-flick" style="animation-duration:3.2s;transform-box:view-box;transform-origin:200px 56px" cx="200" cy="56" r="6" fill="#ffdb92"/>' : '') +
        '</g>' +
        '<use href="#wa-shk' + (night ? 'n' : 'd') + '" transform="translate(0,168) scale(1,-1)" opacity="' + (night ? '.28' : '.16') + '"/>' +
        '</g>');
    }
    var mountains = spr('left:0;bottom:44px;width:100%;height:auto;opacity:.3', '0 0 400 70',
      '<path class="waf-i" d="M0 70L52 22L88 48L138 8L186 52L232 26L286 62L330 34L400 70Z"/>');
    var water = '<i class="wa-floor" style="height:52px;background:var(--wa-accent);opacity:.42"></i>' +
      '<i class="wa-floor" style="height:52px;opacity:.4;background:var(--wa-surface);' +
      '-webkit-mask-image:' + M_WAVE + ';mask-image:' + M_WAVE + ';-webkit-mask-size:28px 10px;mask-size:28px 10px;' +
      '-webkit-mask-repeat:repeat;mask-repeat:repeat"></i>';
    var houseboat = spr('right:4%;bottom:38px;width:clamp(96px,24vw,180px);height:auto;opacity:.9', '0 0 180 90',
      '<path class="waf-i" opacity=".8" d="M6 74h168l-12 14H18z"/>' +
      '<rect class="waf-i" opacity=".7" x="18" y="34" width="144" height="40" rx="4"/>' +
      '<path class="waf-i" opacity=".85" d="M10 34h160l-14-20H24z"/>' +
      '<g class="wa-day">' + rep(5, function (i) { return '<rect class="waf-s" opacity=".5" x="' + (30 + i * 26) + '" y="44" width="16" height="18" rx="2"/>'; }) + '</g>' +
      '<g class="wa-night">' + rep(5, function (i) { return '<rect fill="#ffca70" opacity=".95" x="' + (30 + i * 26) + '" y="44" width="16" height="18" rx="2"/>'; }) +
      '<ellipse cx="90" cy="56" rx="86" ry="34" fill="rgba(255,190,90,.2)"/></g>');
    return '<i class="wa-fade" style="bottom:46px;height:58px"></i>' + mountains + water + houseboat +
      '<div class="wa-day">' + shikara(false) +
      spr('left:60%;bottom:52px;width:clamp(44px,10vw,80px);height:auto;opacity:.85', '0 0 60 40',
        '<g class="wam-bob" style="animation-duration:4.6s">' +
        '<ellipse class="waf-f" cx="30" cy="24" rx="12" ry="7"/>' +
        rep(7, function (i) { return '<ellipse class="waf-s" opacity=".85" cx="30" cy="14" rx="4" ry="9" transform="rotate(' + (i * 26 - 78) + ' 30 24)"/>'; }) +
        '</g>') +
      '</div>' +
      '<div class="wa-night">' + shikara(true) +
      /* the moon's road, lying flat on black glass */
      puff({ l: '50%', t: 'auto', w: 'clamp(70px,16vw,140px)', h: '46px', c: '#dbe9f7', a: 0.3 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:2px') +
      '</div>';
  }
  S.dallake = { bd: dlBd, band: dlBand, sky: dlSky, foot: dlFoot };

  /* ======================================================================= */
  /*  FORTS OF RAJASTHAN — kites over the ramparts, windows alight at night  */
  /*  DAY 4 animating nodes · NIGHT 5                                        */
  /* ======================================================================= */
  function rjBd() {
    return '<div class="wa-day">' +
      puff({ l: '54%', t: '-14%', w: 'clamp(300px,64vw,660px)', c: '#dfa032', a: 0.5, cls: 'wam-glow', dur: 13 }) +
      puff({ l: '-16%', t: '26%', w: 'clamp(280px,60vw,600px)', c: '#d8447c', a: 0.2 }) +
      puff({ l: '24%', t: '68%', w: 'clamp(280px,60vw,600px)', c: '#dfa032', a: 0.3 }) +
      '</div><div class="wa-night">' +
      puff({ l: '50%', t: 'auto', w: 'clamp(400px,100vw,1200px)', h: 'clamp(200px,40vw,440px)', c: '#ffc861', a: 0.28 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-6%') +
      puff({ l: '-14%', t: '14%', w: 'clamp(260px,56vw,560px)', c: '#3a2450', a: 0.5 }) +
      spr('left:0;top:0;width:100%;height:60%', '0 0 100 60',
        '<g class="wam-twinkle" style="animation-duration:5.4s">' +
        rep(22, function (i) {
          return '<circle cx="' + ((i * 37) % 100) + '" cy="' + ((i * 23) % 56) + '" r="' + (0.26 + (i % 3) * 0.14) + '" fill="#ffeccd"/>';
        }) + '</g>') +
      '</div>';
  }
  function rjBand() {
    var leheriya = '<i class="wa-tileband" style="top:0;height:100%;opacity:.5;background:repeating-linear-gradient(64deg,' +
      'var(--wa-festive) 0 9px,var(--wa-surface) 9px 13px,var(--wa-accent2) 13px 22px,var(--wa-surface) 22px 26px)"></i>';
    var arch = '<i class="wa-tileband" style="top:0;height:100%;background:var(--wa-accent2);opacity:.6;' +
      '-webkit-mask-image:' + M_ARCH + ';mask-image:' + M_ARCH + ';-webkit-mask-size:44px 36px;mask-size:44px 36px;' +
      '-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;-webkit-mask-position:0 100%;mask-position:0 100%"></i>';
    return '<div class="wa-day">' + leheriya + arch + '</div>' +
      '<div class="wa-night">' + arch +
      bulbs({ c: '#ffc861', top: 'calc(100% - 18px)', h: '18px', pitch: 44, r: 2.4, rows: 2, dur: 3.4 }) +
      '</div>';
  }
  function rjSky() {
    var pair = spr('left:6%;top:6%;width:clamp(120px,30vw,240px);height:auto;opacity:.9', '0 0 140 70',
      kite(6, 2, 1.25, 'waf-f', 'rjk1', 13) + kite(76, 14, 0.95, 'waf-a', 'rjk2', 17));
    return '<div class="wa-day">' + pair + '</div>' +
      '<div class="wa-night">' + spr('left:8%;top:8%;width:clamp(100px,26vw,200px);height:auto;opacity:.45', '0 0 140 70',
        kite(6, 2, 1.1, 'waf-f', 'rjk3', 19)) + '</div>';
  }
  function rjFoot() {
    /* the fort wall: crenellations, jharokha windows, a bastion each side */
    function fort(night) {
      var win = night ? 'rgba(255,196,90,.92)' : 'var(--wa-ink)';
      var op = night ? '1' : '.3';
      /* jharokha: a small arched window, not a fence post */
      function jh(x, y, w, h) {
        return '<path fill="' + win + '" opacity="' + op + '" d="M' + x + ' ' + (y + h) + 'V' + (y + w / 2) +
          'q0-' + (w / 2) + ' ' + (w / 2) + '-' + (w / 2) + 't' + (w / 2) + ' ' + (w / 2) + 'v' + h + 'z"/>' +
          (night ? '<ellipse cx="' + (x + w / 2) + '" cy="' + (y + h * 0.6) + '" rx="' + (w * 1.5) + '" ry="' + (h * 0.8) +
            '" fill="rgba(255,190,90,.16)"/>' : '');
      }
      return spr('left:50%;bottom:0;width:min(940px,102%);height:auto;transform:translateX(-50%)', '0 0 480 150',
        /* the rampart, crenellated */
        '<path ' + (night ? 'fill="#1d1218"' : 'class="waf-i"') + ' opacity="' + (night ? '.97' : '.34') + '" d="M0 150V58h14v-12h14v12h18v-12h14v12h18V40h20v18h44v-12h14v12h14v-12h14v12h44V40h20v18h18v-12h14v12h18v-12h14v12h18v-12h14v12h18v-12h14v12h20v92Z"/>' +
        /* bastions each side */
        '<path ' + (night ? 'fill="#1d1218"' : 'class="waf-i"') + ' opacity="' + (night ? '1' : '.4') + '" d="M28 150V30q0-18 22-18t22 18v120ZM406 150V34q0-18 22-18t22 18v116Z"/>' +
        rep(9, function (i) { return jh(46 + i * 46, 112, 12, 26); }) +
        rep(4, function (i) { return jh(132 + i * 72, 76, 10, 20); }) +
        jh(43, 58, 12, 22) + jh(421, 62, 12, 22) +
        (night ? '<g class="wam-glow" style="animation-duration:6s;transform-box:view-box;transform-origin:240px 130px">' +
          '<ellipse cx="240" cy="146" rx="250" ry="40" fill="rgba(255,190,90,.16)"/></g>' : ''));
    }
    var camel = spr('left:0;bottom:4px;width:clamp(150px,36vw,280px);height:auto', '0 0 220 60',
      '<g class="wam-cross" style="animation-duration:96s;animation-delay:-40s">' +
      '<g class="wam-bob" style="animation-duration:1.15s"><g class="waf-i" opacity=".72">' +
      '<path d="M10 56V44Q10 34 22 32L40 30Q44 18 56 18Q68 18 72 28L82 28Q90 28 92 18L96 8Q98 4 102 4Q108 4 108 10L112 18V24L104 24L100 32Q97 40 86 40L82 40V56H76V42H48V56H42V42Q26 44 22 44V56Z"/>' +
      '<path class="was-f waf-n" stroke-width="2.4" d="M48 26Q60 22 70 26"/></g></g>' +
      '<g class="wam-bob" style="animation-duration:1.05s;animation-delay:-.4s"><g class="waf-i" opacity=".6" transform="translate(120 12) scale(.78)">' +
      '<path d="M10 56V44Q10 34 22 32L40 30Q44 18 56 18Q68 18 72 28L82 28Q90 28 92 18L96 8Q98 4 102 4Q108 4 108 10L112 18V24L104 24L100 32Q97 40 86 40L82 40V56H76V42H48V56H42V42Q26 44 22 44V56Z"/></g></g>' +
      '</g>');
    var sand = '<i class="wa-floor" style="height:34px;background:var(--wa-accent2);opacity:.3"></i>';
    return '<i class="wa-fade" style="bottom:44px;height:58px"></i>' + sand +
      '<div class="wa-day">' + fort(false) + camel + '</div>' +
      '<div class="wa-night">' +
      /* the warm town-glow the fort stands black against */
      puff({ l: '50%', t: 'auto', w: 'clamp(360px,100vw,1100px)', h: 'clamp(150px,30vw,300px)', c: '#ffb454', a: 0.34, cls: 'wam-glow', dur: 8 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-30px') +
      fort(true) + camel +
      bulbs({ c: '#ffd07a', top: 'calc(100% - 26px)', h: '16px', pitch: 38, r: 2, rows: 2, dur: 3.6 }) +
      '</div>';
  }
  S.rajasthan = { bd: rjBd, band: rjBand, sky: rjSky, foot: rjFoot };

  /* ======================================================================= */
  /*  MADHUBANI — the Mithila wall, at scale. Kachni hatching, twin fish,    */
  /*  lotus and sun. Painted by Mithila women; ours until one is commissioned*/
  /*  DAY 4 animating nodes · NIGHT 5                                        */
  /* ======================================================================= */
  function mhBd() {
    var hatch = '<i class="wa-puff" style="left:0;top:0;width:100%;height:100%;border-radius:0;opacity:.2;' +
      'background:var(--wa-accent);-webkit-mask-image:' + M_KACHNI + ';mask-image:' + M_KACHNI +
      ';-webkit-mask-size:16px 16px;mask-size:16px 16px;-webkit-mask-repeat:repeat;mask-repeat:repeat"></i>';
    return '<div class="wa-day">' + hatch +
      puff({ l: '-12%', t: '-8%', w: 'clamp(280px,60vw,600px)', c: '#e2951f', a: 0.36 }) +
      puff({ l: '58%', t: '30%', w: 'clamp(260px,56vw,560px)', c: '#c63c28', a: 0.24 }) +
      puff({ l: '10%', t: '66%', w: 'clamp(280px,60vw,600px)', c: '#2f6f5e', a: 0.2 }) +
      '</div><div class="wa-night">' + hatch +
      puff({ l: '50%', t: 'auto', w: 'clamp(380px,96vw,1100px)', h: 'clamp(200px,40vw,440px)', c: '#ffb454', a: 0.3 })
        .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-8%') +
      puff({ l: '-12%', t: '16%', w: 'clamp(240px,52vw,520px)', c: '#4a2018', a: 0.5 }) +
      '</div>';
  }
  function mhBand() {
    var border = '<i class="wa-tileband" style="top:0;height:100%;opacity:.8;background:' +
      'linear-gradient(var(--wa-accent),var(--wa-accent)) 0 2px/100% 3px no-repeat,' +
      'linear-gradient(var(--wa-accent),var(--wa-accent)) 0 calc(100% - 5px)/100% 3px no-repeat,' +
      'repeating-linear-gradient(90deg,var(--wa-accent2) 0 3px,rgba(0,0,0,0) 3px 9px) 0 50%/100% 60% no-repeat"></i>';
    return '<div class="wa-day">' + border + '</div>' +
      '<div class="wa-night">' + border +
      bulbs({ c: '#ffc06a', top: 'calc(100% - 16px)', h: '16px', pitch: 40, r: 2, rows: 2, dur: 3.2 }) +
      '</div>';
  }
  function mhSky() {
    var sun = spr('right:5%;top:4%;width:clamp(70px,17vw,140px);height:auto;opacity:.55', '0 0 100 100',
      '<g class="wam-spin" style="animation-duration:160s">' +
      rep(20, function (i) { return '<path class="was-i waf-n" stroke-width="2.6" stroke-linecap="round" d="M50 4V16" transform="rotate(' + i * 18 + ' 50 50)"/>'; }) +
      '<circle class="was-a waf-n" stroke-width="2.4" stroke-dasharray="4 4" cx="50" cy="50" r="30"/></g>' +
      '<circle class="waf-b was-i" stroke-width="3" cx="50" cy="50" r="20"/>' +
      '<circle class="was-a waf-n" stroke-width="2" cx="50" cy="50" r="13"/>');
    return '<div class="wa-day">' + sun + '</div><div class="wa-night">' +
      spr('right:5%;top:4%;width:clamp(60px,15vw,120px);height:auto;opacity:.3', '0 0 100 100',
        '<circle class="waf-b was-i" stroke-width="3" cx="50" cy="50" r="20"/>' +
        '<circle class="was-a waf-n" stroke-width="2" cx="50" cy="50" r="13"/>') + '</div>';
  }
  function mhFoot() {
    function fish(dur, delay, bottom, w, night) {
      return spr('left:0;bottom:' + bottom + ';width:' + w + ';height:auto', '0 0 130 40',
        '<g class="wam-cross" style="animation-duration:' + dur + 's;animation-delay:' + delay + '">' +
        '<g class="wam-bob" style="animation-duration:3.4s">' +
        '<g class="wam-sway" style="animation-duration:1.6s;transform-origin:90% 50%">' +
        '<path class="waf-b was-i" stroke-width="1.8" d="M12 20L1 9L4 20L1 31Z"/></g>' +
        '<path class="waf-s was-i" stroke-width="2.4" d="M10 20Q34 4 76 7Q104 10 114 20Q104 30 76 33Q34 36 10 20Z"/>' +
        '<path class="was-a waf-n" stroke-width="1.5" d="M16 20Q36 8 74 11Q98 13 106 20Q98 27 74 29Q36 32 16 20Z"/>' +
        '<path class="was-b waf-n" stroke-width="1.1" opacity=".9" d="M42 10L49 30M54 9L61 31M66 9L73 30"/>' +
        '<circle class="' + (night ? 'waf-b' : 'waf-i') + '" cx="104" cy="18" r="2.4"/>' +
        '<path class="was-i waf-n" stroke-width="1.2" d="M110 16Q113 20 110 24"/>' +
        '</g></g>');
    }
    var lotus = spr('right:6%;bottom:12px;width:clamp(70px,17vw,130px);height:auto;opacity:.9', '0 0 100 70',
      rep(9, function (i) { return '<ellipse class="waf-f" opacity=".8" cx="50" cy="26" rx="7" ry="20" transform="rotate(' + (i * 20 - 80) + ' 50 46)"/>'; }) +
      rep(7, function (i) { return '<ellipse class="waf-a" cx="50" cy="32" rx="6" ry="15" transform="rotate(' + (i * 24 - 72) + ' 50 46)"/>'; }) +
      '<circle class="waf-b was-i" stroke-width="2" cx="50" cy="46" r="8"/>' +
      '<path class="was-f waf-n" stroke-width="3" d="M50 54v14"/>');
    var frame = '<i class="wa-tileband" style="bottom:0;height:16px;opacity:.7;background:' +
      'linear-gradient(var(--wa-accent),var(--wa-accent)) 0 0/100% 3px no-repeat,' +
      'linear-gradient(var(--wa-accent),var(--wa-accent)) 0 13px/100% 3px no-repeat,' +
      'repeating-linear-gradient(90deg,var(--wa-accent2) 0 3px,rgba(0,0,0,0) 3px 9px) 0 50%/100% 7px no-repeat"></i>';
    var pond = '<i class="wa-floor" style="height:74px;background:var(--wa-festive);opacity:.16"></i>';
    return '<i class="wa-fade" style="bottom:60px;height:56px"></i>' + pond + frame +
      '<div class="wa-day">' +
      fish(64, '-14s', '52px', 'clamp(150px,36vw,280px)', false) +
      fish(88, '-52s', '22px', 'clamp(115px,28vw,215px)', false) + lotus +
      '</div>' +
      '<div class="wa-night">' +
      /* the wall by lamplight: one oil lamp on the sill, fireflies over the pond */
      puff({ l: '8%', t: 'auto', w: 'clamp(150px,36vw,320px)', h: 'clamp(120px,28vw,240px)', c: '#ffb454', a: 0.4, cls: 'wam-glow', dur: 6 })
        .replace('top:auto', 'bottom:-30px') +
      fish(78, '-18s', '52px', 'clamp(150px,36vw,280px)', true) + lotus +
      spr('left:6%;bottom:16px;width:clamp(46px,11vw,84px);height:auto', '0 0 70 60',
        '<g class="wam-flame" style="animation-duration:1.6s;transform-box:view-box;transform-origin:35px 30px">' +
        '<path fill="#ff9d1c" d="M35 30Q43 18 35 2Q27 18 35 30Z"/>' +
        '<path fill="#ffe6a3" d="M35 28Q39 18 35 10Q31 18 35 28Z"/></g>' +
        '<path fill="#b5581f" d="M6 32Q35 46 64 32L58 50Q35 58 12 50Z"/>' +
        '<path fill="#d9752f" d="M6 32Q35 42 64 32Q35 40 6 32Z"/>') +
      spr('left:0;bottom:0;width:100%;height:100%', '0 0 100 100',
        '<g class="wam-rise" style="animation-duration:6s">' +
        rep(10, function (i) {
          return '<circle cx="' + (14 + (i * 29) % 76) + '" cy="' + (56 + (i * 17) % 40) + '" r="' + (0.5 + (i % 2) * 0.3) +
            '" fill="#ffe08a"/>';
        }) + '</g>') +
      '</div>';
  }
  S.madhubani = { bd: mhBd, band: mhBand, sky: mhSky, foot: mhFoot };

  /* ======================================================================= */
  /*  THE SEVEN FOUNDATION WORLDS                                            */
  /*  taj · cricket · bollywood · antariksh · truck · dance · patterns       */
  /*  These share one page-scale scaffold — token washes, a banded header, a  */
  /*  horizon stage and a night state — and differ by a BIG emblem (240–420px*/
  /*  drawn from their own idiom) plus a footer silhouette of their own.     */
  /*  DAY 3–4 animating nodes · NIGHT 4–5                                    */
  /* ======================================================================= */
  var EMBLEM = {
    taj: '<path class="waf-s was-i" stroke-width="2" d="M60 200V120h80v80z"/>' +
      '<path class="waf-s was-i" stroke-width="2" d="M100 40q30 30 30 58a30 30 0 0 1-60 0q0-28 30-58z"/>' +
      '<path class="was-i waf-n" stroke-width="2.4" d="M100 40V22"/><circle class="waf-b" cx="100" cy="18" r="5"/>' +
      '<path class="waf-a" opacity=".7" d="M88 200v-42q0-12 12-12t12 12v42z"/>' +
      '<path class="was-i waf-n" stroke-width="3" d="M28 76V200M172 76V200"/>' +
      '<circle class="waf-s was-i" stroke-width="2" cx="28" cy="70" r="7"/><circle class="waf-s was-i" stroke-width="2" cx="172" cy="70" r="7"/>' +
      '<path class="was-b waf-n" stroke-width="2" stroke-dasharray="5 5" d="M20 200h160"/>',
    cricket: '<path class="was-i waf-n" stroke-width="3" stroke-dasharray="7 9" opacity=".6" d="M14 180Q66 32 186 62"/>' +
      '<circle class="waf-f" cx="160" cy="56" r="26"/>' +
      '<path class="was-s waf-n" stroke-width="3" stroke-dasharray="5 5" d="M140 40q20 16 0 32M180 40q-20 16 0 32"/>' +
      '<path class="was-b waf-n" stroke-width="13" stroke-linecap="round" d="M20 186q80-22 160 0"/>' +
      '<path class="was-i waf-n" stroke-width="5" d="M46 178V80M34 72h24M32 80l26-22"/>' +
      '<circle class="waf-b" cx="46" cy="64" r="14" opacity=".85"/>',
    bollywood: '<path class="waf-b" d="M100 26l17 44 47 2-37 29 13 46-40-27-40 27 13-46-37-29 47-2z"/>' +
      rep(12, function (i) { return '<circle class="waf-a" cx="100" cy="12" r="6" transform="rotate(' + i * 30 + ' 100 106)"/>'; }) +
      '<circle class="waf-f" opacity=".8" cx="100" cy="106" r="11"/>',
    antariksh: '<path class="waf-s was-i" stroke-width="3" d="M100 20q22 30 22 74v52H78V94q0-44 22-74z"/>' +
      '<path class="waf-a" d="M78 122L58 168l20-12zM122 122l20 46-20-12z"/>' +
      '<circle class="waf-b" cx="100" cy="80" r="11"/>' +
      '<path class="waf-b wam-flick" style="animation-duration:1.1s" d="M100 190q16-26 0-44q-16 18 0 44z"/>' +
      rep(7, function (i) { return '<circle class="waf-f" cx="' + [18, 44, 168, 186, 30, 176, 152][i] + '" cy="' + [40, 16, 30, 84, 130, 160, 190][i] + '" r="3.4"/>'; }),
    truck: '<path class="waf-s was-i" stroke-width="5" d="M14 100Q100 34 186 100Q100 158 14 100Z"/>' +
      '<circle class="waf-a" cx="100" cy="98" r="28"/><circle class="waf-i" cx="100" cy="98" r="13"/>' +
      '<circle class="waf-s" cx="106" cy="90" r="5"/>' +
      rep(6, function (i) { var x = 42 + i * 23; return '<path class="was-i waf-n" stroke-width="5" stroke-linecap="round" d="M' + x + ' 66L' + (x - 5) + ' 40"/>'; }) +
      marigold(30, 168, 22, 'var(--wa-accent2)', 'var(--wa-festive)') + marigold(170, 168, 22, 'var(--wa-accent2)', 'var(--wa-festive)'),
    dance: '<circle class="waf-i" cx="100" cy="30" r="14"/>' +
      '<path class="was-i waf-n" stroke-width="10" stroke-linecap="round" d="M100 44Q98 76 100 94M100 58Q72 64 50 44M100 58Q128 68 150 48"/>' +
      '<path class="waf-a" d="M66 148Q100 84 134 148Q100 164 66 148Z"/>' +
      '<path class="was-i waf-n" stroke-width="8" stroke-linecap="round" d="M84 154L78 182M116 154L122 182"/>' +
      rep(7, function (i) { var a = Math.PI * (0.1 + i * 0.133); return '<circle class="waf-b" cx="' + (100 + Math.cos(a) * 78).toFixed(1) + '" cy="' + (192 - Math.sin(a) * 28).toFixed(1) + '" r="5.5"/>'; }),
    patterns: '<rect class="was-i waf-n" stroke-width="6" x="24" y="40" width="152" height="152" rx="14"/>' +
      '<rect class="waf-b" opacity=".9" x="76" y="10" width="48" height="30" rx="6"/>' +
      '<rect class="was-a waf-n" stroke-width="4" stroke-dasharray="9 9" x="44" y="60" width="112" height="112" rx="8"/>' +
      rep(9, function (i) { var x = 68 + (i % 3) * 32, y = 84 + Math.floor(i / 3) * 32; return '<g><circle class="waf-f" cx="' + x + '" cy="' + y + '" r="9"/><circle class="waf-s" cx="' + x + '" cy="' + y + '" r="3.4"/></g>'; })
  };
  /* the horizon each foundation world stands on */
  var HORIZON = {
    taj: '<path class="waf-i" opacity=".3" d="M0 120h520v40H0zM196 120V70q0-26 24-32 4-22 40-22t40 22q24 6 24 32v50z"/>',
    cricket: '<path class="waf-i" opacity=".26" d="M0 132h520v28H0z"/>' +
      '<g class="was-i waf-n" stroke-width="5" opacity=".4"><path d="M74 132V44M446 132V44"/></g>' +
      '<g class="waf-b" opacity=".85"><rect x="46" y="18" width="56" height="26" rx="5"/><rect x="418" y="18" width="56" height="26" rx="5"/></g>',
    bollywood: '<rect class="waf-i" opacity=".26" x="0" y="96" width="520" height="64" rx="6"/>' +
      '<rect class="waf-a" opacity=".5" x="46" y="52" width="428" height="48" rx="8"/>',
    antariksh: '<path class="waf-i" opacity=".28" d="M0 128h520v32H0z"/>' +
      '<path class="was-i waf-n" stroke-width="5" opacity=".45" d="M300 128V40h56M300 84h56M356 128V40"/>',
    truck: '<rect class="waf-i" opacity=".3" x="0" y="52" width="520" height="108" rx="8"/>' +
      '<path class="waf-b" opacity=".5" d="M0 52h520v22a34 16 0 0 1-46 0a34 16 0 0 1-46 0a34 16 0 0 1-46 0a34 16 0 0 1-46 0' +
      'a34 16 0 0 1-46 0a34 16 0 0 1-46 0a34 16 0 0 1-46 0a34 16 0 0 1-46 0a34 16 0 0 1-46 0a34 16 0 0 1-46 0a34 16 0 0 1-46 0z"/>',
    dance: '<path class="waf-i" opacity=".24" d="M0 140h520v20H0z"/>' +
      rep(5, function (i) {
        var x = 60 + i * 100;
        return '<g class="waf-i" opacity=".42" transform="translate(' + x + ' 0)"><circle cx="0" cy="34" r="11"/>' +
          '<path d="M-11 140V60q0-14 11-14t11 14v80z"/>' +
          '<path stroke="var(--wa-ink)" stroke-width="7" stroke-linecap="round" fill="none" d="M-9 68L-30 ' + (46 + (i % 2) * 24) + 'M9 68L30 ' + (46 + ((i + 1) % 2) * 24) + '"/></g>';
      }),
    patterns: rep(5, function (i) {
      var w = 104, x = i * w;
      var fills = ['var(--wa-accent)', 'var(--wa-accent2)', 'var(--wa-festive)', 'var(--wa-ink)', 'var(--wa-accent)'];
      return '<g opacity=".34"><rect fill="' + fills[i] + '" x="' + x + '" y="96" width="' + w + '" height="64"/>' +
        rep(6, function (k) { return '<circle class="waf-s" cx="' + (x + 16 + (k % 3) * 34) + '" cy="' + (116 + Math.floor(k / 3) * 28) + '" r="6"/>'; }) + '</g>';
    })
  };
  function genericScene(id) {
    var t = null, i;
    for (i = 0; i < W.length; i++) if (W[i].id === id) { t = W[i]; break; }
    return {
      bd: function () {
        return '<div class="wa-day">' +
          puff({ l: '-14%', t: '-8%', w: 'clamp(280px,60vw,620px)', c: t.t.accent, a: 0.34 }) +
          puff({ l: '56%', t: '12%', w: 'clamp(260px,56vw,560px)', c: t.t.accent2, a: 0.4, cls: 'wam-glow', dur: 12 }) +
          puff({ l: '14%', t: '64%', w: 'clamp(280px,60vw,600px)', c: t.t.festive, a: 0.22 }) +
          '</div><div class="wa-night">' +
          puff({ l: '50%', t: 'auto', w: 'clamp(400px,100vw,1200px)', h: 'clamp(190px,38vw,420px)', c: t.n.accent2, a: 0.24 })
            .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-6%') +
          puff({ l: '-14%', t: '16%', w: 'clamp(250px,54vw,540px)', c: t.n.accent, a: 0.2, cls: 'wam-glow', dur: 10 }) +
          spr('left:0;top:0;width:100%;height:56%', '0 0 100 56',
            '<g class="wam-twinkle" style="animation-duration:5.6s">' +
            rep(18, function (k) {
              return '<circle cx="' + ((k * 41) % 100) + '" cy="' + ((k * 17) % 52) + '" r="' + (0.24 + (k % 3) * 0.13) +
                '" fill="' + t.n.accent2 + '"/>';
            }) + '</g>') +
          '</div>';
      },
      band: function () {
        var stripe = '<i class="wa-tileband" style="top:0;height:100%;opacity:.7;background:linear-gradient(90deg,' +
          'var(--wa-accent),var(--wa-accent2) 52%,var(--wa-festive))"></i>';
        var scallop = '<i class="wa-tileband" style="top:0;height:100%;background:var(--wa-accent2);opacity:.55;' +
          '-webkit-mask-image:' + M_SCALLOP + ';mask-image:' + M_SCALLOP + ';-webkit-mask-size:26px 13px;mask-size:26px 13px;' +
          '-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;-webkit-mask-position:0 100%;mask-position:0 100%"></i>';
        return '<div class="wa-day"><i class="wa-tileband" style="top:0;height:14px;opacity:.75;background:linear-gradient(90deg,' +
          'var(--wa-accent),var(--wa-accent2) 52%,var(--wa-festive))"></i>' + scallop + '</div>' +
          '<div class="wa-night">' + stripe.replace('opacity:.7', 'opacity:.3') + scallop +
          bulbs({ c: t.n.accent2, top: 'calc(100% - 18px)', h: '18px', pitch: 32, r: 2.4, rows: 2, dur: 2.8 }) +
          '</div>';
      },
      /* the world's own emblem, drawn BIG — the thing you recognise from across
         the room — riding the backdrop rather than a 76px corner */
      sky: function () {
        var em = spr('right:2%;top:4%;width:clamp(140px,34vw,300px);height:auto;opacity:.5', '0 0 200 210',
          '<g class="wam-pulse" style="animation-duration:9s;transform-box:view-box;transform-origin:100px 105px">' +
          (EMBLEM[id] || '') + '</g>');
        return '<div class="wa-day">' + em + '</div>' +
          '<div class="wa-night">' + em.replace('opacity:.5', 'opacity:.34') + '</div>';
      },
      foot: function () {
        var scene = spr('left:50%;bottom:0;width:min(1040px,104%);height:auto;transform:translateX(-50%)', '0 0 520 160',
          HORIZON[id] || '');
        return '<i class="wa-fade" style="bottom:40px;height:56px"></i>' +
          '<i class="wa-floor" style="height:18px;background:var(--wa-ink);opacity:.2"></i>' + scene +
          '<div class="wa-night">' +
          puff({ l: '50%', t: 'auto', w: 'clamp(300px,84vw,760px)', h: 'clamp(150px,32vw,320px)', c: t.n.accent2, a: 0.3, cls: 'wam-glow', dur: 7 })
            .replace('left:50%', 'left:50%;transform:translateX(-50%)').replace('top:auto', 'bottom:-40px') +
          bulbs({ c: t.n.accent2, top: 'calc(100% - 40px)', h: '18px', pitch: 30, r: 2.4, rows: 2, dur: 2.6 }) +
          '</div>';
      }
    };
  }
  ['taj', 'cricket', 'bollywood', 'antariksh', 'truck', 'dance', 'patterns'].forEach(function (id) {
    S[id] = genericScene(id);
  });

  /* ================================================================ TILES
     The Worlds picker shows a living micro-scene per world (viewBox 96×64).
     Each tile carries its OWN tokens inline, so every world previews in its
     own palette no matter which world is currently active. Tiles use the same
     wam-* classes, so they obey both kill switches too. */
  function tile(id, inner) {
    var t = null, i;
    for (i = 0; i < W.length; i++) if (W[i].id === id) { t = W[i].t; break; }
    var vars = t ? '--wa-ground:' + t.ground + ';--wa-surface:' + t.surface + ';--wa-ink:' + t.ink +
      ';--wa-accent:' + t.accent + ';--wa-accent2:' + t.accent2 + ';--wa-festive:' + t.festive + ';' : '';
    return '<svg class="wa-tile" style="' + vars + '" viewBox="0 0 96 64" preserveAspectRatio="xMidYMid meet" ' +
      'aria-hidden="true" data-wtile="' + id + '"><rect class="waf-g" x="0" y="0" width="96" height="64" rx="8"/>' +
      inner + '</svg>';
  }
  function tdly(seed, spread) { return ' style="animation-delay:' + dly(seed, spread) + '"'; }
  var TILES = {
    delhi6: tile('delhi6',
      '<path class="waf-a" opacity=".4" d="M0 50h10v-5h8v5h10v-5h8v5h10v-5h8v5h10v-5h8v5h10v-5h8v5h6v14H0Z"/>' +
      '<g class="wam-cross-sm" style="animation-duration:9s">' + bird(6, 14, 0.62, 't6a') + bird(26, 6, 0.5, 't6b') + '</g>' +
      '<g transform="translate(64 4) scale(.42)">' +
      '<path class="was-b waf-n" stroke-width="9" stroke-linecap="round" d="M36 30a7 7 0 1 0 7 7a14 14 0 1 1-16-14a21 21 0 1 1-12 20"/>' +
      '<path class="was-a waf-n" opacity=".55" stroke-width="3.5" stroke-linecap="round" d="M36 30a7 7 0 1 0 7 7a14 14 0 1 1-16-14a21 21 0 1 1-12 20"/></g>'),
    mumbai: tile('mumbai',
      '<rect class="waf-a" opacity=".35" x="0" y="52" width="96" height="12"/>' +
      rep(6, function (i) { return '<circle class="waf-b wam-twinkle" cx="' + (12 + i * 14) + '" cy="49" r="2"' + tdly('tmb' + i, 2400) + '/>'; }) +
      '<g class="wam-cross-sm" style="animation-duration:7s"><path class="waf-i" opacity=".85" d="M4 40V30Q4 25 10 25H60Q62 25 62 27V40Z"/>' +
      rep(4, function (i) { return '<rect class="waf-b" x="' + (12 + i * 12) + '" y="29" width="7" height="5" rx="1"/>'; }) + '</g>'),
    pujo: tile('pujo',
      '<path class="was-i waf-n" opacity=".25" stroke-width="1.2" d="M8 64L40 12M24 64L56 12M40 64L72 12M56 64L88 12M88 64L56 12M72 64L40 12M56 64L24 12M40 64L8 12"/>' +
      rep(6, function (i) { return '<circle class="waf-b wam-twinkle" cx="' + (13 + i * 14) + '" cy="20" r="2.4" style="animation-delay:' + (-i * 0.18).toFixed(2) + 's"/>'; }) +
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
      '<g class="wam-fallshort" style="animation-duration:12s"><path class="waf-b" transform="translate(60 4) scale(.7)" d="M11 1L13.6 8L20 7L15 12L17.5 19L11 14.6L4.5 19L7 12L2 7L8.4 8Z"/></g>'),
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
      rep(7, function (i) { return '<circle class="waf-b wam-twinkle" cx="' + (16 + i * 10.6) + '" cy="6" r="2" style="animation-delay:' + (-i * 0.2).toFixed(1) + 's"/>'; }) +
      rep(7, function (i) { return '<circle class="waf-b wam-twinkle" cx="' + (16 + i * 10.6) + '" cy="58" r="2" style="animation-delay:' + (-(i * 0.2 + 0.7)).toFixed(1) + 's"/>'; }) +
      '<path class="waf-a" d="M48 18L52.5 30L65 30L55 37.5L58.5 50L48 42.5L37.5 50L41 37.5L31 30L43.5 30Z"/>' +
      '<g class="wam-pulse" style="animation-duration:4s"><path class="waf-f" opacity=".6" d="M28 22l2 4-4-1zM70 40l-2-4 4 1z"/></g>'),
    antariksh: tile('antariksh',
      '<rect class="waf-i" opacity=".08" x="0" y="0" width="96" height="64" rx="8"/>' +
      rep(6, function (i) { return '<circle class="waf-f wam-twinkle" cx="' + [12, 30, 52, 70, 86, 44][i] + '" cy="' + [10, 22, 8, 16, 28, 40][i] + '" r="1.4"' + tdly('tan' + i, 2400) + '/>'; }) +
      '<path class="was-b waf-n" stroke-width="1.2" stroke-dasharray="2 3" opacity=".7" d="M10 58Q40 48 66 24"/>' +
      '<g class="wam-bob" style="animation-duration:4s"><g transform="translate(62 8) rotate(40 8 16)">' +
      '<path class="waf-s was-i" stroke-width="1" d="M8 0Q13 6 13 16H3Q3 6 8 0Z"/>' +
      '<path class="waf-a" d="M3 16L0 22L3 20ZM13 16L16 22L13 20Z"/>' +
      '<path class="waf-b wam-flick" d="M8 26Q10 21 8 17Q6 21 8 26Z" style="animation-duration:1.2s"/></g></g>'),
    diwali: tile('diwali',
      '<rect fill="#1a1008" x="0" y="0" width="96" height="64" rx="8"/>' +
      rep(3, function (i) {
        var x = 20 + i * 28;
        return '<g transform="translate(' + x + ' 36)">' +
          '<ellipse fill="rgba(255,168,54,.3)" cx="0" cy="-4" rx="15" ry="11"/>' +
          '<g class="wam-flame" style="animation-duration:' + (1.2 + i * 0.3) + 's;animation-delay:' + dly('tdw' + i, 1200) + '">' +
          '<path fill="#ff9d1c" d="M0 -6Q5 -14 0 -22Q-5 -14 0 -6Z"/><path fill="#ffe6a3" d="M0 -8Q2.6 -14 0 -18Q-2.6 -14 0 -8Z"/></g>' +
          '<path fill="#b5581f" d="M-11 -3Q0 3 11 -3L9 5Q0 9 -9 5Z"/></g>';
      }) +
      rep(9, function (i) { return '<circle fill="#ffd07a" class="wam-twinkle" cx="' + (8 + i * 10) + '" cy="9" r="1.8" style="animation-delay:' + (-i * 0.26).toFixed(2) + 's"/>'; }) +
      '<path fill="none" stroke="#f0ac29" stroke-width="1.4" opacity=".7" d="M2 9h92"/>'),
    holi: tile('holi',
      '<circle fill="' + GUL.m + '" class="wam-burst" opacity=".55" cx="26" cy="20" r="13" style="animation-duration:9s;animation-delay:' + dly('th1', 6000) + '"/>' +
      '<circle fill="' + GUL.b + '" class="wam-burst" opacity=".5" cx="64" cy="14" r="10" style="animation-duration:11s;animation-delay:' + dly('th2', 6000) + '"/>' +
      '<circle fill="' + GUL.y + '" class="wam-burst" opacity=".6" cx="80" cy="34" r="11" style="animation-duration:13s;animation-delay:' + dly('th3', 6000) + '"/>' +
      '<circle fill="' + GUL.g + '" cx="46" cy="8" r="2.4"/><circle fill="' + GUL.s + '" cx="14" cy="36" r="2.6"/>' +
      '<circle fill="' + GUL.m + '" cx="70" cy="46" r="2.2"/>' +
      '<g transform="rotate(-24 22 52)"><rect fill="#c9922f" x="8" y="47" width="26" height="9" rx="4.5"/>' +
      '<rect fill="#a9761f" x="34" y="49.5" width="8" height="4" rx="1.6"/>' +
      '<rect fill="#8a5a22" x="1" y="48" width="7" height="7" rx="3"/></g>' +
      rep(5, function (i) { return '<circle fill="' + [GUL.m, GUL.s, GUL.y, GUL.g, GUL.b][i] + '" cx="' + (46 + i * 10) + '" cy="' + (42 - i * 5) + '" r="' + (4 - i * 0.5) + '" opacity=".85"/>'; })),
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
      rep(5, function (i) { return '<circle class="waf-b wam-twinkle" cx="' + (18 + i * 15) + '" cy="58" r="2" style="animation-delay:' + (-i * 0.25).toFixed(2) + 's"/>'; }) +
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
      rep(4, function (i) { return '<circle class="waf-i" cx="' + (62 + (i % 2) * 12) + '" cy="' + (43 + Math.floor(i / 2) * 10) + '" r="1.2"/>'; }))
  };

  /* ============================================================ MANIFEST OUT */
  var list = W.map(function (w) {
    return { id: w.id, name: w.name, region: w.region, note: w.note, credit: w.credit,
      full: !!w.full, tokens: w.t, tile: (TILES[w.id] || '') };
  });
  window.IND_WORLDS = {
    list: list,
    get: function (id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  };

  /* ================================================================ ENGINE */
  var mounted = false, back = null, stage = null, styleEl = null, obs = null,
    curWorld = null, slots = null, rafPending = false;

  function injectStyle() {
    if (styleEl && styleEl.parentNode) return;
    styleEl = document.createElement('style');
    styleEl.id = 'wa-style';
    styleEl.textContent = tokenCSS() + '\n' + baseCSS();
    document.head.appendChild(styleEl);
  }

  /* The band hangs off the bottom of the topbar and the footer stage stands on
     top of the mobile nav — both are measured, never assumed. */
  function measure() {
    if (!stage) return;
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
    stage.style.setProperty('--wa-top-off', topOff + 'px');
    stage.style.setProperty('--wa-foot-off', footOff + 'px');
  }

  function apply() {
    if (!stage) return;
    measure();
    var id = document.documentElement.getAttribute('data-world') || '';
    if (id === curWorld) return;
    curWorld = id;
    var sc = S[id];
    if (!sc) {   /* unknown / legacy world id — both layers go quiet */
      slots.bd.innerHTML = ''; slots.air.innerHTML = ''; slots.band.innerHTML = '';
      slots.sky.innerHTML = ''; slots.foot.innerHTML = '';
      return;
    }
    slots.bd.innerHTML = sc.bd ? sc.bd() : '';
    slots.air.innerHTML = sc.air ? sc.air() : '';
    slots.band.innerHTML = sc.band ? sc.band() : '';
    slots.sky.innerHTML = sc.sky ? sc.sky() : '';
    slots.foot.innerHTML = sc.foot ? sc.foot() : '';
  }

  function onResize() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () { rafPending = false; measure(); });
  }

  function mount() {
    if (mounted) { apply(); return; }
    if (!document.body) return;   /* caller will retry after DOMContentLoaded */
    injectStyle();
    back = document.createElement('div');
    back.className = 'wa-layer wa-back';
    back.setAttribute('aria-hidden', 'true');
    back.innerHTML = '<div class="wa-bd"></div>';
    stage = document.createElement('div');
    stage.className = 'wa-layer wa-stage';
    stage.setAttribute('aria-hidden', 'true');
    stage.innerHTML = '<div class="wa-air"></div><div class="wa-sky"></div>' +
      '<div class="wa-band"></div><div class="wa-foot"></div>';
    document.body.appendChild(back);
    document.body.appendChild(stage);
    slots = {
      bd: back.querySelector('.wa-bd'),
      air: stage.querySelector('.wa-air'),
      band: stage.querySelector('.wa-band'),
      sky: stage.querySelector('.wa-sky'),
      foot: stage.querySelector('.wa-foot')
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
    if (back && back.parentNode) back.parentNode.removeChild(back);
    if (stage && stage.parentNode) stage.parentNode.removeChild(stage);
    if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    back = stage = styleEl = slots = null; curWorld = null; mounted = false;
  }

  window.IND_WORLDS_ART = { __loaded: true, mount: mount, unmount: unmount, refresh: apply };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { if (!mounted) mount(); });
  } else if (document.body) {
    mount();
  }
})();
