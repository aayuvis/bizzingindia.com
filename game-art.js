/* Bizzing India — GAME COVERS.
 *
 * WHY THIS FILE. Every stall in the Mela had the same cover: a 112px panel of flat
 * gradient with a 64px line-art glyph floating in the middle of it. Six of the fifteen
 * games had even that; the other nine had a generic star. A shelf of gradients with
 * pictograms on them tells a child nothing about which game is which, and the founder's
 * note was blunt and correct — carrom should show a carrom board.
 *
 * So each game gets a FULL-BLEED illustrated cover: 240x112, edge to edge, drawn as the
 * thing you would actually see if you walked up to that stall. The board, the dice, the
 * letter rack, the hot seat. They are filled and shaded rather than outlined, because an
 * outline on a gradient is a diagram and this is meant to be a fairground.
 *
 * HOW IT IS USED: app.js prefers IND_GAME_ART[id] over a game's own `scene`, so an engine
 * file never has to know anything about its cover, and a game with no entry here still
 * falls back to the old glyph rather than breaking.
 *
 * Rules kept: no trademarks anywhere (no league, no team, no brand); every animation is
 * one CSS animation on a group, and all of it stills under prefers-reduced-motion via the
 * existing `.gart *` rule in app.css.
 */
(function () {
  'use strict';
  var W = window;

  function rep(n, fn) { var s = '', i; for (i = 0; i < n; i++) s += fn(i); return s; }

  /* every cover shares the same frame and a warm vignette so the shelf reads as a set */
  function cover(id, inner, grad) {
    return '<svg class="gcart" viewBox="0 0 240 112" preserveAspectRatio="xMidYMid slice" ' +
      'aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="gg' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + grad[0] + '"/><stop offset="1" stop-color="' + grad[1] + '"/>' +
      '</linearGradient>' +
      '<radialGradient id="gv' + id + '" cx=".5" cy=".42" r=".78">' +
      '<stop offset="0" stop-color="#fff" stop-opacity=".16"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient></defs>' +
      '<rect width="240" height="112" fill="url(#gg' + id + ')"/>' +
      inner +
      '<rect width="240" height="112" fill="url(#gv' + id + ')"/></svg>';
  }

  var A = {};

  /* ------------------------------------------------------------------ CARROM
     The board, from above, as it actually sits: dark polished wood, the printed
     circle and its arrows, the four netted pockets, the base lines — and a striker
     that slides and a coin that drops. */
  A.carrom = cover('cr',
    /* the board bed, with its grain */
    '<g transform="translate(120 56)">' +
      '<rect x="-52" y="-52" width="104" height="104" rx="4" fill="#c98b45"/>' +
      '<rect x="-52" y="-52" width="104" height="104" rx="4" fill="none" stroke="#7c4a1c" stroke-width="5"/>' +
      '<rect x="-44" y="-44" width="88" height="88" fill="#e8bd7e"/>' +
      rep(11, function (i) {
        return '<path d="M-44 ' + (-44 + i * 8) + 'h88" stroke="#d9a765" stroke-width="1" opacity=".7"/>';
      }) +
      /* the base lines and their end circles */
      rep(4, function (i) {
        return '<g transform="rotate(' + (i * 90) + ')">' +
          '<path d="M-26 34h52" stroke="#8c5a22" stroke-width="1.6" opacity=".8"/>' +
          '<path d="M-26 37h52" stroke="#8c5a22" stroke-width="1.6" opacity=".55"/>' +
          '<circle cx="-26" cy="35.5" r="3.4" fill="none" stroke="#8c5a22" stroke-width="1.4"/>' +
          '<circle cx="26" cy="35.5" r="3.4" fill="none" stroke="#8c5a22" stroke-width="1.4"/></g>';
      }) +
      /* the centre circle, and the little sun rosette printed inside it */
      '<circle r="13" fill="none" stroke="#8c5a22" stroke-width="1.6"/>' +
      '<circle r="7" fill="#f2d9a8" stroke="#8c5a22" stroke-width="1"/>' +
      rep(8, function (i) {
        return '<ellipse cx="0" cy="-10" rx="1.4" ry="3.2" fill="#c0392b" opacity=".5" transform="rotate(' + (i * 45) + ')"/>';
      }) +
      /* the four arrows that point at the pockets */
      rep(4, function (i) {
        return '<path d="M0 -20l4 6h-8z" fill="#8c5a22" opacity=".7" transform="rotate(' + (i * 90 + 45) + ')"/>';
      }) +
      /* the pockets: a hole with a net behind it */
      rep(4, function (i) {
        var x = (i % 2 ? 1 : -1) * 38, y = (i < 2 ? -1 : 1) * 38;
        return '<g><circle cx="' + x + '" cy="' + y + '" r="7.6" fill="#3a2410"/>' +
          '<circle cx="' + x + '" cy="' + y + '" r="7.6" fill="none" stroke="#8c5a22" stroke-width="1.4"/>' +
          rep(3, function (k) {
            return '<path d="M' + (x - 5 + k * 5) + ' ' + (y - 5) + 'v10" stroke="#6b4a2a" stroke-width=".7" opacity=".8"/>';
          }) + '</g>';
      }) +
      /* the queen, her two attendants, and the coins in a break */
      '<circle r="4.2" fill="#c0392b" stroke="#7c1d13" stroke-width=".9"/>' +
      '<circle cx="-10" cy="-6" r="4" fill="#f7ecd6" stroke="#b99a6a" stroke-width=".9"/>' +
      '<circle cx="9" cy="-8" r="4" fill="#2f2015" stroke="#0f0a06" stroke-width=".9"/>' +
      '<circle cx="12" cy="7" r="4" fill="#f7ecd6" stroke="#b99a6a" stroke-width=".9"/>' +
      '<circle cx="-8" cy="10" r="4" fill="#2f2015" stroke="#0f0a06" stroke-width=".9"/>' +
      /* the coin that goes down the pocket, over and over */
      '<g style="animation:gc-pot 3.4s ease-in infinite">' +
      '<circle cx="20" cy="16" r="4" fill="#f7ecd6" stroke="#b99a6a" stroke-width=".9"/></g>' +
      /* the striker, sliding on the base line */
      '<g style="animation:gc-strike 3.4s ease-in-out infinite">' +
      '<circle cx="-8" cy="34" r="6" fill="#f6f3ea" stroke="#9c8256" stroke-width="1.2"/>' +
      '<circle cx="-8" cy="34" r="2.2" fill="#c0392b" opacity=".7"/></g>' +
    '</g>' +
    '<style>@keyframes gc-strike{0%,40%{transform:translate(0,0)}62%{transform:translate(6px,-26px)}' +
    '100%{transform:translate(0,0)}}' +
    '@keyframes gc-pot{0%,58%{transform:translate(0,0);opacity:1}' +
    '80%{transform:translate(16px,20px);opacity:1}92%,100%{transform:translate(16px,20px) scale(.1);opacity:0}}</style>',
    ['#a45f22', '#6b3a12']);

  /* -------------------------------------------------------------------- LUDO */
  A.ludo = cover('ld',
    '<g transform="translate(120 56)">' +
      '<rect x="-46" y="-46" width="92" height="92" rx="5" fill="#f6efe0" stroke="#3a2d1c" stroke-width="2.4"/>' +
      /* the four homes */
      rep(4, function (i) {
        var c = ['#d84a3f', '#2f8f5b', '#e8b21c', '#3b6fd4'][i];
        var x = (i % 2 ? 1 : -1) * 28, y = (i < 2 ? -1 : 1) * 28;
        return '<g><rect x="' + (x - 18) + '" y="' + (y - 18) + '" width="36" height="36" rx="4" fill="' + c + '"/>' +
          '<rect x="' + (x - 11) + '" y="' + (y - 11) + '" width="22" height="22" rx="3" fill="#f6efe0"/>' +
          rep(4, function (k) {
            return '<circle cx="' + (x - 5 + (k % 2) * 10) + '" cy="' + (y - 5 + Math.floor(k / 2) * 10) + '" r="3" fill="' + c + '"/>';
          }) + '</g>';
      }) +
      /* the cross, its coloured home columns, and the centre */
      '<path d="M-10 -46h20v36h36v20h-36v36h-20v-36h-36v-20h36z" fill="#fffdf6" stroke="#3a2d1c" stroke-width="1.6"/>' +
      rep(5, function (i) { return '<rect x="-8" y="' + (-44 + i * 7) + '" width="16" height="6" fill="#d84a3f" opacity=".85"/>'; }) +
      rep(5, function (i) { return '<rect x="' + (23 + i * 7) + '" y="-8" width="6" height="16" fill="#2f8f5b" opacity=".85"/>'; }) +
      rep(5, function (i) { return '<rect x="-8" y="' + (9 + i * 7) + '" width="16" height="6" fill="#e8b21c" opacity=".85"/>'; }) +
      rep(5, function (i) { return '<rect x="' + (-44 + i * 7) + '" y="-8" width="6" height="16" fill="#3b6fd4" opacity=".85"/>'; }) +
      '<path d="M-10 -10h20v20h-20z" fill="#3a2d1c" opacity=".12"/>' +
      '<path d="M-10 -10L0 0L-10 10zM10 -10L0 0L10 10zM-10 -10L0 0L10 -10zM-10 10L0 0L10 10z" fill="#d84a3f" opacity=".55"/>' +
      /* a token hopping its way round, and the dice */
      '<g style="animation:gl-hop 2.8s ease-in-out infinite">' +
      '<path d="M-30 8q0-8 4-8t4 8z" fill="#3b6fd4"/><circle cx="-26" cy="-2" r="3.6" fill="#3b6fd4"/></g>' +
      '<g style="animation:gl-roll 4s ease-in-out infinite;transform-box:fill-box;transform-origin:center">' +
      '<rect x="20" y="20" width="18" height="18" rx="3.4" fill="#fffdf6" stroke="#3a2d1c" stroke-width="1.6"/>' +
      '<circle cx="25" cy="25" r="1.8" fill="#3a2d1c"/><circle cx="33" cy="33" r="1.8" fill="#3a2d1c"/>' +
      '<circle cx="29" cy="29" r="1.8" fill="#3a2d1c"/></g>' +
    '</g>' +
    '<style>@keyframes gl-hop{0%,100%{transform:translate(0,0)}25%{transform:translate(0,-8px)}' +
    '50%{transform:translate(7px,-8px)}75%{transform:translate(7px,0)}}' +
    '@keyframes gl-roll{0%,60%{transform:rotate(0)}75%{transform:rotate(96deg)}100%{transform:rotate(96deg)}}</style>',
    ['#2f6f8f', '#16394d']);

  /* -------------------------------------------------------------- SAAP-SIDI */
  A.saapsidi = cover('ss',
    '<g transform="translate(120 56)">' +
      '<rect x="-50" y="-48" width="100" height="96" rx="4" fill="#fdf3df" stroke="#4a3320" stroke-width="2.2"/>' +
      rep(6, function (r) {
        return rep(6, function (c) {
          var n = r * 6 + c;
          return '<rect x="' + (-48 + c * 16) + '" y="' + (-46 + r * 16) + '" width="16" height="16" ' +
            'fill="' + (n % 2 ? '#f3e2bd' : '#fdf3df') + '"/>';
        });
      }) +
      /* the ladder */
      '<g stroke="#8a5a22" stroke-width="2.4" stroke-linecap="round">' +
      '<path d="M-34 40L-14 -22M-24 43L-4 -19"/>' +
      rep(6, function (i) { return '<path d="M' + (-33 + i * 3.2) + ' ' + (33 - i * 10) + 'l10 3" stroke-width="1.8"/>'; }) +
      '</g>' +
      /* the snake */
      '<path d="M32 -38q-18 10-6 24t-4 26q-8 12 4 24" fill="none" stroke="#2f8f5b" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M32 -38q-18 10-6 24t-4 26q-8 12 4 24" fill="none" stroke="#8fd6a8" stroke-width="2.6" ' +
      'stroke-dasharray="3 7" stroke-linecap="round"/>' +
      '<g style="animation:gs-tongue 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:left">' +
      '<circle cx="32" cy="-38" r="6" fill="#2f8f5b"/>' +
      '<circle cx="30" cy="-40" r="1.4" fill="#fff"/><circle cx="35" cy="-39" r="1.4" fill="#fff"/>' +
      '<path d="M36 -34l6 4" stroke="#d84a3f" stroke-width="1.6"/></g>' +
      /* the counter climbing */
      '<g style="animation:gs-climb 3.6s ease-in-out infinite">' +
      '<circle cx="-29" cy="34" r="4.6" fill="#3b6fd4" stroke="#1d3f86" stroke-width="1.2"/></g>' +
    '</g>' +
    '<style>@keyframes gs-climb{0%,10%{transform:translate(0,0)}90%,100%{transform:translate(20px,-62px)}}' +
    '@keyframes gs-tongue{0%,100%{transform:rotate(0)}50%{transform:rotate(-8deg)}}</style>',
    ['#3f7a4f', '#1d3d28']);

  /* ------------------------------------------------------------------ SHABD */
  A.shabd = cover('sb',
    '<g transform="translate(120 60)">' +
      /* the rack */
      '<path d="M-86 18h172l-8 16H-78z" fill="#8a5a22"/>' +
      '<rect x="-86" y="12" width="172" height="8" rx="3" fill="#a4702f"/>' +
      /* the tiles, one lifting */
      (function () {
        var t = ['क', 'म', 'ल', 'भ', 'ा'], out = '';
        for (var i = 0; i < 5; i++) {
          var lift = i === 2;
          out += '<g' + (lift ? ' style="animation:gt-lift 3s ease-in-out infinite"' : '') + '>' +
            '<rect x="' + (-76 + i * 32) + '" y="-22" width="28" height="34" rx="4" fill="#fdf1d8" stroke="#b08a4a" stroke-width="1.4"/>' +
            '<rect x="' + (-73 + i * 32) + '" y="-19" width="22" height="28" rx="3" fill="#fff8e8"/>' +
            '<text x="' + (-62 + i * 32) + '" y="4" text-anchor="middle" font-size="22" font-weight="700" ' +
            'fill="#5a3a12" font-family="Mukta, sans-serif">' + t[i] + '</text></g>';
        }
        return out;
      })() +
    '</g>' +
    '<style>@keyframes gt-lift{0%,100%{transform:translate(0,0)}50%{transform:translate(0,-9px)}}</style>',
    ['#b4762a', '#6d4210']);

  /* -------------------------------------------------------------- GYANPATI */
  A.gyanpati = cover('gy',
    /* the ladder of rungs, the top ones still dark, and the hot seat lit */
    '<g transform="translate(120 56)">' +
      rep(9, function (i) {
        var y = 38 - i * 9, on = i < 5;
        return '<g><rect x="-70" y="' + (y - 4) + '" width="140" height="8" rx="4" ' +
          'fill="' + (on ? '#f0c14b' : '#2b1a4d') + '" opacity="' + (on ? 0.95 : 0.55) + '"/>' +
          '<text x="-62" y="' + (y + 2.4) + '" font-size="7" font-weight="700" fill="' + (on ? '#3a2405' : '#8e7fc0') +
          '" font-family="monospace">' + (15 - i * 2) + '</text></g>';
      }) +
      /* the one that is lit right now */
      '<g style="animation:gg-glow 2.4s ease-in-out infinite">' +
      '<rect x="-72" y="-11" width="144" height="12" rx="6" fill="#fff0b8"/>' +
      '<rect x="-72" y="-11" width="144" height="12" rx="6" fill="none" stroke="#f0c14b" stroke-width="2"/></g>' +
      /* the two spotlights over the seat */
      '<path d="M-48 -50l16 34h-32z" fill="#fff0b8" opacity=".22"/>' +
      '<path d="M48 -50l16 34h-32z" fill="#fff0b8" opacity=".22"/>' +
      '<circle cx="-48" cy="-52" r="5" fill="#f0c14b"/><circle cx="48" cy="-52" r="5" fill="#f0c14b"/>' +
    '</g>' +
    '<style>@keyframes gg-glow{0%,100%{opacity:.72}50%{opacity:1}}</style>',
    ['#4b2a86', '#20103f']);

  /* ----------------------------------------------------------- TRIVIA WHEEL */
  A.triviamaster = cover('tv',
    '<g transform="translate(120 56)">' +
      '<g style="animation:gw-spin 9s linear infinite;transform-box:fill-box;transform-origin:center">' +
      rep(8, function (i) {
        var c = ['#2dd4bf', '#f0c14b', '#e8734a', '#8b5cf6', '#4ade80', '#38bdf8', '#fb7185', '#facc15'][i];
        return '<path d="M0 0L' + (42 * Math.cos(i * Math.PI / 4)).toFixed(1) + ' ' + (42 * Math.sin(i * Math.PI / 4)).toFixed(1) +
          'A42 42 0 0 1 ' + (42 * Math.cos((i + 1) * Math.PI / 4)).toFixed(1) + ' ' +
          (42 * Math.sin((i + 1) * Math.PI / 4)).toFixed(1) + 'Z" fill="' + c + '" opacity=".92"/>';
      }) +
      '<circle r="42" fill="none" stroke="#0b3b40" stroke-width="3"/></g>' +
      '<circle r="9" fill="#fffdf6" stroke="#0b3b40" stroke-width="2.4"/>' +
      '<path d="M0 -50l7 12h-14z" fill="#fffdf6" stroke="#0b3b40" stroke-width="1.6"/>' +
    '</g>' +
    '<style>@keyframes gw-spin{to{transform:rotate(360deg)}}</style>',
    ['#0f6d7a', '#07343a']);

  /* ---------------------------------------------------------------- RANGOLI */
  A.rangoli = cover('rg',
    '<g transform="translate(120 56)">' +
      /* the dot grid */
      rep(49, function (i) {
        return '<circle cx="' + (-36 + (i % 7) * 12) + '" cy="' + (-36 + Math.floor(i / 7) * 12) + '" r="1.5" fill="#fff" opacity=".38"/>';
      }) +
      /* the rangoli itself, drawn in powder */
      '<g style="animation:gr-in 4s ease-in-out infinite">' +
      rep(8, function (i) {
        return '<ellipse cx="0" cy="-26" rx="6" ry="14" fill="' + ['#f0c14b', '#e8734a', '#d94f8a', '#4ade80'][i % 4] +
          '" opacity=".9" transform="rotate(' + (i * 45) + ')"/>';
      }) +
      '<circle r="9" fill="#fffdf6"/><circle r="5" fill="#d94f8a"/></g>' +
      /* the powder pinch in the corner */
      '<g transform="translate(-60 34)"><path d="M0 0q8-10 16 0z" fill="#f0c14b"/>' +
      rep(5, function (i) { return '<circle cx="' + (2 + i * 3) + '" cy="' + (-2 - (i % 2) * 3) + '" r="1.2" fill="#f0c14b" opacity=".8"/>'; }) +
      '</g>' +
    '</g>' +
    '<style>@keyframes gr-in{0%{transform:scale(.4) rotate(-30deg);opacity:0}' +
    '30%,70%{transform:scale(1) rotate(0);opacity:1}100%{transform:scale(1.1) rotate(20deg);opacity:0}}</style>',
    ['#7a3f86', '#331645']);

  /* -------------------------------------------------------------- STATE HUNT */
  A.statehunt = cover('sh',
    '<g transform="translate(120 56)">' +
      /* a plain map mass — deliberately NOT the real boundary geometry, which never
         appears as decoration (CLAUDE.md); this is a fairground signboard shape */
      '<path d="M-30 -40q26-8 44 6t2 30q-8 12-14 30t-16 12-10-18-16-14-6-24 16-22z" fill="#f0c14b" opacity=".9"/>' +
      '<path d="M-30 -40q26-8 44 6t2 30q-8 12-14 30t-16 12-10-18-16-14-6-24 16-22z" fill="none" stroke="#5a3a12" stroke-width="1.6" opacity=".5"/>' +
      /* pins dropped on it */
      rep(3, function (i) {
        var x = [-8, 10, -2][i], y = [-18, 4, 26][i];
        return '<g style="animation:gh-drop ' + (2.6 + i * 0.4) + 's ease-in-out infinite">' +
          '<path d="M' + x + ' ' + y + 'c-5-7-8-10-8-14a8 8 0 0 1 16 0c0 4-3 7-8 14z" fill="#d94f3d"/>' +
          '<circle cx="' + x + '" cy="' + (y - 14) + '" r="3" fill="#fff"/></g>';
      }) +
      /* the magnifier */
      '<g style="animation:gh-look 5s ease-in-out infinite">' +
      '<circle cx="30" cy="-16" r="16" fill="#bfe3ff" opacity=".45" stroke="#fffdf6" stroke-width="3"/>' +
      '<path d="M41 -5l14 14" stroke="#fffdf6" stroke-width="5" stroke-linecap="round"/></g>' +
    '</g>' +
    '<style>@keyframes gh-drop{0%,100%{transform:translate(0,0)}50%{transform:translate(0,-5px)}}' +
    '@keyframes gh-look{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,26px)}}</style>',
    ['#1f6f8f', '#0c3346']);

  /* ------------------------------------------------------------- FESTIVAL */
  A.festival = cover('fs',
    '<g>' +
      /* a lit street: bunting, diyas along the foot, a burst above */
      '<path d="M0 14q60 16 120 0t120 16" fill="none" stroke="#ffd77a" stroke-width="2" opacity=".6"/>' +
      rep(11, function (i) {
        return '<path d="M' + (12 + i * 22) + ' ' + (18 + Math.abs(5 - i) * 1.4) + 'v10q0 3 3 3t3-3v-10z" ' +
          'fill="' + ['#e8734a', '#f0c14b', '#4ade80', '#38bdf8'][i % 4] + '" opacity=".9"/>';
      }) +
      rep(6, function (i) {
        var x = 24 + i * 39;
        return '<g><path d="M' + (x - 13) + ' 96h26q-3 9-13 9t-13-9z" fill="#8a5a22"/>' +
          '<rect x="' + (x - 15) + '" y="92" width="30" height="5" rx="2.4" fill="#a4702f"/>' +
          '<g style="animation:gf-fl ' + (1.3 + (i % 3) * 0.25) + 's ease-in-out infinite">' +
          '<path d="M' + x + ' 90q6-9 0-18q-6 9 0 18z" fill="#ffb454"/>' +
          '<path d="M' + x + ' 88q3-6 0-12q-3 6 0 12z" fill="#fff0b8"/></g></g>';
      }) +
      '<g style="animation:gf-burst 3.2s ease-out infinite;transform-box:fill-box;transform-origin:center">' +
      rep(12, function (i) {
        return '<circle cx="' + (172 + 22 * Math.cos(i * Math.PI / 6)).toFixed(1) + '" cy="' +
          (40 + 22 * Math.sin(i * Math.PI / 6)).toFixed(1) + '" r="2.4" fill="' +
          ['#ffd77a', '#fb7185', '#4ade80'][i % 3] + '"/>';
      }) + '</g>' +
    '</g>' +
    '<style>@keyframes gf-fl{0%,100%{transform:scale(1)}50%{transform:scale(1.1,.9)}}' +
    '@keyframes gf-burst{0%{transform:scale(.2);opacity:0}30%{opacity:1}100%{transform:scale(1.3);opacity:0}}</style>',
    ['#7a2f5e', '#2d0f24']);

  /* ---------------------------------------------------------------- JATAKA */
  A.jataka = cover('jt',
    '<g>' +
      /* two trees and a branch to leap between */
      rep(2, function (i) {
        var x = i ? 196 : 44;
        return '<g><path d="M' + x + ' 112V54" stroke="#6b4a2a" stroke-width="9" stroke-linecap="round"/>' +
          '<circle cx="' + x + '" cy="44" r="24" fill="#2f8f5b"/>' +
          '<circle cx="' + (x - 14) + '" cy="54" r="15" fill="#3aa86b"/>' +
          '<circle cx="' + (x + 15) + '" cy="52" r="13" fill="#3aa86b"/></g>';
      }) +
      '<path d="M60 62q60 18 120 0" fill="none" stroke="#6b4a2a" stroke-width="4" opacity=".75"/>' +
      /* the monkey, mid-leap */
      '<g style="animation:gj-leap 3s ease-in-out infinite">' +
      '<ellipse cx="0" cy="0" rx="11" ry="13" fill="#b4762a"/>' +
      '<circle cx="0" cy="-13" r="9" fill="#c98b45"/>' +
      '<circle cx="-7" cy="-17" r="4" fill="#b4762a"/><circle cx="7" cy="-17" r="4" fill="#b4762a"/>' +
      '<circle cx="-3" cy="-14" r="1.4" fill="#2a1810"/><circle cx="3" cy="-14" r="1.4" fill="#2a1810"/>' +
      '<path d="M8 6q16 4 12 18" fill="none" stroke="#b4762a" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M-9 8l-8 12M9 8l8 12" stroke="#b4762a" stroke-width="4.4" stroke-linecap="round"/></g>' +
    '</g>' +
    '<style>@keyframes gj-leap{0%,100%{transform:translate(74px,60px)}' +
    '50%{transform:translate(166px,44px)}}</style>',
    ['#25603f', '#0e2a1b']);

  /* ---------------------------------------------------- the four quiz stalls */
  function quizCover(id, grad, inner) { A[id] = cover(id, inner, grad); }

  quizCover('naksha', ['#1f5f8f', '#0b2b44'],
    '<g transform="translate(120 56)">' +
      rep(5, function (i) { return '<path d="M-70 ' + (-34 + i * 17) + 'h140" stroke="#fff" stroke-width=".8" opacity=".18"/>'; }) +
      rep(9, function (i) { return '<path d="M' + (-68 + i * 17) + ' -40v80" stroke="#fff" stroke-width=".8" opacity=".18"/>'; }) +
      '<path d="M-40 -26q34-10 56 8t2 34q-10 14-20 22t-18-14-18-16-4-24z" fill="#f0c14b" opacity=".9"/>' +
      '<g style="animation:gn-pin 2.8s ease-in-out infinite">' +
      '<path d="M6 0c-6-8-9-12-9-16a9 9 0 0 1 18 0c0 4-3 8-9 16z" fill="#d94f3d"/>' +
      '<circle cx="6" cy="-16" r="3.4" fill="#fff"/></g>' +
      '<path d="M-58 34h30" stroke="#fff" stroke-width="2.4" opacity=".6"/>' +
      '<path d="M-58 30v8M-28 30v8" stroke="#fff" stroke-width="2.4" opacity=".6"/>' +
    '</g><style>@keyframes gn-pin{0%,100%{transform:translate(0,0)}50%{transform:translate(0,-6px)}}</style>');

  quizCover('itihaas', ['#7a5320', '#33200b'],
    '<g transform="translate(120 56)">' +
      /* an unrolled scroll with a time line on it */
      '<path d="M-70 -22h140v44H-70z" fill="#f6e6c4"/>' +
      '<rect x="-78" y="-26" width="12" height="52" rx="6" fill="#8a5a22"/>' +
      '<rect x="66" y="-26" width="12" height="52" rx="6" fill="#8a5a22"/>' +
      '<path d="M-58 0h116" stroke="#8a5a22" stroke-width="2"/>' +
      rep(6, function (i) {
        return '<g><circle cx="' + (-52 + i * 22) + '" cy="0" r="4.4" fill="' + (i < 3 ? '#c0392b' : '#8a5a22') + '"/>' +
          '<path d="M' + (-52 + i * 22) + ' -6v-8" stroke="#8a5a22" stroke-width="1.6"/></g>';
      }) +
      '<g style="animation:gi-tick 3.6s linear infinite"><circle cx="-52" cy="0" r="8" fill="none" stroke="#f0c14b" stroke-width="2.4"/></g>' +
    '</g><style>@keyframes gi-tick{0%{transform:translate(0,0)}100%{transform:translate(110px,0)}}</style>');

  quizCover('utsav', ['#8a2f5e', '#2f0f22'],
    '<g transform="translate(120 56)">' +
      rep(5, function (i) {
        var x = -52 + i * 26;
        return '<g><path d="M' + (x - 10) + ' 26h20q-2 7-10 7t-10-7z" fill="#8a5a22"/>' +
          '<g style="animation:gu-fl ' + (1.2 + (i % 3) * 0.3) + 's ease-in-out infinite">' +
          '<path d="M' + x + ' 20q5-8 0-16q-5 8 0 16z" fill="#ffb454"/></g></g>';
      }) +
      rep(10, function (i) {
        return '<circle cx="' + (-56 + i * 12) + '" cy="' + (-30 + (i % 3) * 7) + '" r="3.4" fill="' +
          ['#ffd77a', '#fb7185', '#4ade80', '#38bdf8'][i % 4] + '" opacity=".9"/>';
      }) +
      rep(8, function (i) {
        return '<ellipse cx="0" cy="-6" rx="3" ry="8" fill="#f0c14b" opacity=".55" transform="rotate(' + (i * 45) + ' 0 2)"/>';
      }) +
    '</g><style>@keyframes gu-fl{0%,100%{transform:scale(1)}50%{transform:scale(1.12,.9)}}</style>');

  quizCover('khazana', ['#6b4a12', '#2b1c05'],
    '<g transform="translate(120 58)">' +
      '<g style="animation:gk-lid 3.4s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom">' +
      '<path d="M-44 -8h88q0-26-44-26T-44 -8z" fill="#8a5a22" stroke="#4a2f0c" stroke-width="2.4"/>' +
      '<path d="M-44 -8h88" stroke="#4a2f0c" stroke-width="2.4"/></g>' +
      '<rect x="-44" y="-6" width="88" height="34" rx="4" fill="#a4702f" stroke="#4a2f0c" stroke-width="2.4"/>' +
      '<rect x="-8" y="-6" width="16" height="16" rx="3" fill="#f0c14b" stroke="#4a2f0c" stroke-width="1.6"/>' +
      rep(7, function (i) {
        return '<circle cx="' + (-30 + i * 10) + '" cy="' + (-10 - (i % 3) * 5) + '" r="5" fill="#f0c14b" stroke="#b98a1c" stroke-width="1"/>';
      }) +
      '<g style="animation:gk-shine 2.6s ease-in-out infinite">' +
      '<path d="M22 -34l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff0b8"/></g>' +
    '</g><style>@keyframes gk-lid{0%,100%{transform:rotate(0)}50%{transform:rotate(-14deg)}}' +
    '@keyframes gk-shine{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}</style>');

  quizCover('mahakavya', ['#5b3fa6', '#241546'],
    '<g transform="translate(120 56)">' +
      /* two epics as standing volumes, and a bow between them */
      rep(2, function (i) {
        var x = i ? 34 : -34;
        return '<g><rect x="' + (x - 20) + '" y="-30" width="40" height="60" rx="3" fill="' + (i ? '#3b6fd4' : '#c0392b') + '"/>' +
          '<rect x="' + (x - 20) + '" y="-30" width="9" height="60" rx="3" fill="#000" opacity=".18"/>' +
          rep(3, function (k) { return '<path d="M' + (x - 6) + ' ' + (-14 + k * 12) + 'h18" stroke="#fff" stroke-width="2" opacity=".55"/>'; }) +
          '</g>';
      }) +
      '<g style="animation:gm-draw 4s ease-in-out infinite">' +
      '<path d="M0 -30q18 30 0 60" fill="none" stroke="#f0c14b" stroke-width="3.4"/>' +
      '<path d="M0 -30L0 30" stroke="#fff0b8" stroke-width="1.4"/>' +
      '<path d="M-2 0h26" stroke="#fffdf6" stroke-width="2.4"/>' +
      '<path d="M24 0l-6-3v6z" fill="#fffdf6"/></g>' +
    '</g><style>@keyframes gm-draw{0%,100%{transform:translate(0,0)}50%{transform:translate(-8px,0)}}</style>');

  /* --------------------------------------------------------------- KANCHA */
  A.kancha = cover('kc',
    '<g transform="translate(120 60)">' +
      '<ellipse cx="0" cy="6" rx="76" ry="34" fill="#c9a06a" opacity=".55"/>' +
      '<ellipse cx="0" cy="6" rx="76" ry="34" fill="none" stroke="#6b4a2a" stroke-width="2.4" stroke-dasharray="7 6"/>' +
      (function () {
        var c = ['#3b6fd4', '#2f8f5b', '#e8b21c', '#d84a3f', '#8b5cf6'], out = '';
        var pos = [[-34, 0], [-8, -10], [16, 2], [38, -8], [4, 16]];
        for (var i = 0; i < 5; i++) {
          out += '<g><circle cx="' + pos[i][0] + '" cy="' + pos[i][1] + '" r="10" fill="' + c[i] + '"/>' +
            '<path d="M' + (pos[i][0] - 6) + ' ' + pos[i][1] + 'q6-9 12 0q-6 9-12 0z" fill="#fff" opacity=".55"/>' +
            '<circle cx="' + (pos[i][0] - 3.4) + '" cy="' + (pos[i][1] - 3.6) + '" r="2.4" fill="#fff" opacity=".9"/></g>';
        }
        return out;
      })() +
      '<g style="animation:gy-flick 3s ease-in-out infinite">' +
      '<circle cx="-60" cy="30" r="12" fill="#f6f3ea" stroke="#9c8256" stroke-width="1.6"/>' +
      '<circle cx="-64" cy="26" r="3.4" fill="#fff"/></g>' +
      '<path d="M-70 44h34" stroke="#6b4a2a" stroke-width="2" opacity=".5" stroke-dasharray="4 5"/>' +
    '</g>' +
    '<style>@keyframes gy-flick{0%,30%{transform:translate(0,0)}60%{transform:translate(58px,-28px)}' +
    '100%{transform:translate(0,0)}}</style>',
    ['#a3782f', '#4a3110']);

  /* --------------------------------------------------------------- PATANG */
  A.patang = cover('pt',
    '<g>' +
      /* the rooftops, and the far-off kites */
      '<path d="M0 96h240v16H0z" fill="#0b2f4a" opacity=".5"/>' +
      rep(5, function (i) { return '<rect x="' + (14 + i * 48) + '" y="82" width="34" height="16" fill="#0b2f4a" opacity=".45"/>'; }) +
      '<g opacity=".3">' + rep(3, function (i) {
        var x = 40 + i * 78, y = 18 + (i % 2) * 12;
        return '<path d="M' + x + ' ' + y + 'l7 10-7 10-7-10z" fill="#ffd77a"/>'; }) + '</g>' +
      /* the two duelling kites, their lines bowing */
      '<path d="M18 104Q60 88 92 52" fill="none" stroke="#cfe3f2" stroke-width="1.4" opacity=".7"/>' +
      '<path d="M222 104Q182 84 150 60" fill="none" stroke="#cfe3f2" stroke-width="1.4" opacity=".7"/>' +
      '<g style="animation:gp-climb 3.4s ease-in-out infinite">' +
      '<g transform="translate(92 52)"><path d="M0 -18L14 4L0 20L-14 4Z" fill="#38bdf8"/>' +
      '<path d="M0 -18L14 4L0 4Z" fill="#ffd77a"/>' +
      '<path d="M0 -18v38M-14 4h28" stroke="rgba(0,0,0,.3)" stroke-width="1.1"/>' +
      '<path d="M0 20q7 10-3 17t2 13" fill="none" stroke="#ffd77a" stroke-width="1.8"/></g></g>' +
      '<g style="animation:gp-dip 3.4s ease-in-out infinite">' +
      '<g transform="translate(150 60)"><path d="M0 -18L14 4L0 20L-14 4Z" fill="#fb7185"/>' +
      '<path d="M0 -18L14 4L0 4Z" fill="#ffd77a"/>' +
      '<path d="M0 -18v38M-14 4h28" stroke="rgba(0,0,0,.3)" stroke-width="1.1"/></g></g>' +
    '</g>' +
    '<style>@keyframes gp-climb{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-22px)}}' +
    '@keyframes gp-dip{0%,100%{transform:translate(0,0)}50%{transform:translate(-14px,14px)}}</style>',
    ['#1f6f9f', '#092536']);

  W.IND_GAME_ART = A;
})();
