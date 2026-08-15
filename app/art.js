/* Bizzing India — mascots, motifs and UI icons.
   Same idiom as Bizzing Bee's art layer: inline SVG markup keyed by id in a
   120x120 viewBox, consumed by IND_ART(id, size). Everything uses currentColor
   or theme tokens where it should re-skin, and literal colour where the art
   itself carries meaning. */

window.IND_ART = window.IND_ART || {};

/* ---------------------------------------------------------------- MASCOTS */

/* GATTU — the elephant calf who remembers everything.
   moods: happy | think | wow | sad */
window.GATTU = function (mood) {
  mood = mood || 'happy';
  var eye = {
    happy: '<circle cx="47" cy="58" r="4.6" fill="#2b1b3e"/><circle cx="73" cy="58" r="4.6" fill="#2b1b3e"/>' +
           '<circle cx="48.6" cy="56.4" r="1.7" fill="#fff"/><circle cx="74.6" cy="56.4" r="1.7" fill="#fff"/>',
    think: '<path d="M42 58q5-4 10 0" fill="none" stroke="#2b1b3e" stroke-width="3.4" stroke-linecap="round"/>' +
           '<circle cx="73" cy="58" r="4.6" fill="#2b1b3e"/><circle cx="74.6" cy="56.4" r="1.7" fill="#fff"/>',
    wow:   '<circle cx="47" cy="57" r="6.2" fill="#fff"/><circle cx="47" cy="57.5" r="4" fill="#2b1b3e"/>' +
           '<circle cx="73" cy="57" r="6.2" fill="#fff"/><circle cx="73" cy="57.5" r="4" fill="#2b1b3e"/>',
    sad:   '<path d="M42 60q5 4 10 0" fill="none" stroke="#2b1b3e" stroke-width="3.4" stroke-linecap="round"/>' +
           '<path d="M68 60q5 4 10 0" fill="none" stroke="#2b1b3e" stroke-width="3.4" stroke-linecap="round"/>'
  }[mood];
  var mouth = mood === 'sad'
    ? '<path d="M52 96q8-6 16 0" fill="none" stroke="#8d5fa8" stroke-width="2.6" stroke-linecap="round"/>'
    : '<path d="M52 92q8 7 16 0" fill="none" stroke="#8d5fa8" stroke-width="2.6" stroke-linecap="round"/>';
  return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><radialGradient id="gt-b" cx="50%" cy="34%" r="76%">' +
      '<stop offset="0" stop-color="#c9a2d8"/><stop offset="1" stop-color="#9b6fb5"/></radialGradient>' +
    '</defs>' +
    /* ears — the folk-art bit: each carries a painted lotus roundel */
    '<ellipse cx="24" cy="56" rx="18" ry="23" fill="#8a5da6"/>' +
    '<ellipse cx="24" cy="56" rx="11" ry="15" fill="#e5b6c8" opacity=".55"/>' +
    '<circle cx="24" cy="56" r="5" fill="#e9a13b" opacity=".7"/>' +
    '<ellipse cx="96" cy="56" rx="18" ry="23" fill="#8a5da6"/>' +
    '<ellipse cx="96" cy="56" rx="11" ry="15" fill="#e5b6c8" opacity=".55"/>' +
    '<circle cx="96" cy="56" r="5" fill="#e9a13b" opacity=".7"/>' +
    /* head */
    '<path d="M32 46q0-22 28-22t28 22q0 20-6 30 -4 8 -22 8t-22-8q-6-10-6-30z" fill="url(#gt-b)"/>' +
    /* forehead tikka + painted band, Madhubani-ish */
    '<path d="M40 40q20-10 40 0" fill="none" stroke="#e9a13b" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>' +
    '<circle cx="60" cy="45" r="3.4" fill="#d94f3d"/>' +
    /* trunk */
    '<path d="M54 82q-2 16 6 24 q8 8 14 1 q4-5-1-8 q-4-2-5 2" fill="none" stroke="#a878c0" stroke-width="11" stroke-linecap="round"/>' +
    '<path d="M54 82q-2 16 6 24 q8 8 14 1" fill="none" stroke="#c9a2d8" stroke-width="4" stroke-linecap="round" opacity=".5"/>' +
    /* tusks */
    '<path d="M45 84q-5 7-2 12" fill="none" stroke="#fff4d6" stroke-width="4.5" stroke-linecap="round"/>' +
    '<path d="M79 84q5 7 2 12" fill="none" stroke="#fff4d6" stroke-width="4.5" stroke-linecap="round"/>' +
    eye + mouth +
    /* the memory bell */
    '<circle cx="88" cy="96" r="7" fill="#e9a13b"/><circle cx="88" cy="96" r="4" fill="#f2c46a"/>' +
    '<path d="M88 103v4" stroke="#e9a13b" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';
};

/* MITHU — the ring-necked parakeet who knows every story.
   moods: talk | happy | wink */
window.MITHU = function (mood) {
  mood = mood || 'talk';
  var eye = mood === 'wink'
    ? '<path d="M64 44q5-4 9 0" fill="none" stroke="#23331c" stroke-width="3" stroke-linecap="round"/>'
    : '<circle cx="68" cy="44" r="5.4" fill="#fff"/><circle cx="69" cy="44.6" r="3.2" fill="#23331c"/>' +
      '<circle cx="67.6" cy="42.8" r="1.3" fill="#fff"/>';
  return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="mt-b" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#7cc94a"/><stop offset="1" stop-color="#3f8f2c"/></linearGradient></defs>' +
    /* tail */
    '<path d="M46 84 q-6 24 -14 32 q14 2 22-10 z" fill="#4fa336"/>' +
    '<path d="M52 86 q-2 22 -6 30" fill="none" stroke="#2f6b21" stroke-width="2" opacity=".6"/>' +
    /* body */
    '<ellipse cx="58" cy="66" rx="26" ry="30" fill="url(#mt-b)"/>' +
    /* wing with layered folk feathers */
    '<path d="M44 58q-8 16 2 30 q10 6 16-4 q4-16-4-26 z" fill="#5fb43c"/>' +
    '<path d="M46 66q6 2 10 8 M45 76q7 1 12 6 M46 85q6 0 10 4" fill="none" stroke="#2f6b21" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>' +
    /* head */
    '<circle cx="66" cy="44" r="21" fill="#7cc94a"/>' +
    /* the rose ring-neck */
    '<path d="M50 56q16 9 32 0" fill="none" stroke="#e0567f" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M52 60q15 8 29 0" fill="none" stroke="#23331c" stroke-width="2" stroke-linecap="round" opacity=".55"/>' +
    /* beak */
    '<path d="M84 42q12 0 12 9 q0 9-11 8 q-6-1-6-9 z" fill="#d94f3d"/>' +
    '<path d="M85 51q7 1 10-1" fill="none" stroke="#8f2f22" stroke-width="1.6"/>' +
    eye +
    /* feet */
    '<path d="M58 95v8 M54 103h9" fill="none" stroke="#e9a13b" stroke-width="2.6" stroke-linecap="round"/>' +
    '</svg>';
};

/* VISMRITI — the Forgetting. Never a face: a soft grey drift, sad not scary. */
window.VISMRITI = function () {
  return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><radialGradient id="vs-g" cx="50%" cy="50%" r="60%">' +
      '<stop offset="0" stop-color="#c3c3cf" stop-opacity=".85"/>' +
      '<stop offset="1" stop-color="#9a9aa8" stop-opacity="0"/></radialGradient></defs>' +
    '<ellipse cx="60" cy="62" rx="52" ry="34" fill="url(#vs-g)"/>' +
    '<path d="M14 62q14-12 26 0t26 0 26 0" fill="none" stroke="#b6b6c4" stroke-width="3" opacity=".5" stroke-linecap="round"/>' +
    '<path d="M20 76q14-10 26 0t26 0 22 0" fill="none" stroke="#b6b6c4" stroke-width="2.4" opacity=".35" stroke-linecap="round"/>' +
    '<path d="M22 48q14-10 26 0t26 0 20 0" fill="none" stroke="#b6b6c4" stroke-width="2.4" opacity=".35" stroke-linecap="round"/>' +
    '</svg>';
};

/* ------------------------------------------------------------------ MOTIFS */
/* Folk borders and ornaments. These take currentColor so they re-skin per world. */

window.IND_MOTIF = {
  /* repeating painted border, Pattachitra-ish */
  border: '<svg viewBox="0 0 240 12" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M0 6h240" stroke="currentColor" stroke-width="1" opacity=".35"/>' +
    '<g fill="currentColor" opacity=".8">' +
    '<circle cx="6" cy="6" r="2.4"/><circle cx="26" cy="6" r="2.4"/><circle cx="46" cy="6" r="2.4"/>' +
    '<circle cx="66" cy="6" r="2.4"/><circle cx="86" cy="6" r="2.4"/><circle cx="106" cy="6" r="2.4"/>' +
    '<circle cx="126" cy="6" r="2.4"/><circle cx="146" cy="6" r="2.4"/><circle cx="166" cy="6" r="2.4"/>' +
    '<circle cx="186" cy="6" r="2.4"/><circle cx="206" cy="6" r="2.4"/><circle cx="226" cy="6" r="2.4"/>' +
    '</g></svg>',

  lotus: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor">' +
    '<path d="M32 12q7 14 0 28 -7-14 0-28z" opacity=".95"/>' +
    '<path d="M32 40q-13-2-19-12 12-5 19 12z" opacity=".8"/>' +
    '<path d="M32 40q13-2 19-12 -12-5-19 12z" opacity=".8"/>' +
    '<path d="M32 42q-16 2-24-6 0 14 24 12z" opacity=".6"/>' +
    '<path d="M32 42q16 2 24-6 0 14-24 12z" opacity=".6"/>' +
    '</g></svg>',

  diya: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M32 20q-5 8 0 13 5-5 0-13z" fill="#ffcf5c"/>' +
    '<path d="M32 24q-2.5 5 0 8 2.5-3 0-8z" fill="#fff4d6"/>' +
    '<path d="M12 38q20 12 40 0 -4 12-20 12t-20-12z" fill="currentColor"/>' +
    '<path d="M12 38q20 6 40 0" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>' +
    '</svg>',

  /* Warli-style dancing figures — used as an empty-state and celebration motif */
  warli: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">' +
    '<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">' +
    '<circle cx="20" cy="16" r="5"/><path d="M20 21v14 M20 25l-9 6 M20 25l9 6 M20 35l-7 12 M20 35l7 12"/>' +
    '<circle cx="60" cy="14" r="5"/><path d="M60 19v14 M60 23l-9-5 M60 23l9-5 M60 33l-7 13 M60 33l7 13"/>' +
    '<circle cx="100" cy="16" r="5"/><path d="M100 21v14 M100 25l-9 6 M100 25l9 6 M100 35l-7 12 M100 35l7 12"/>' +
    '</g></svg>',

  peacock: '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
    '<g opacity=".9">' +
    '<path d="M60 96q-34-6-40-38" fill="none" stroke="#2fa89b" stroke-width="3"/>' +
    '<path d="M60 96q-18-20-14-46" fill="none" stroke="#2fa89b" stroke-width="3"/>' +
    '<path d="M60 96q0-26 8-44" fill="none" stroke="#2fa89b" stroke-width="3"/>' +
    '<path d="M60 96q18-20 26-40" fill="none" stroke="#2fa89b" stroke-width="3"/>' +
    '<path d="M60 96q30-10 38-34" fill="none" stroke="#2fa89b" stroke-width="3"/>' +
    '<g fill="#1c6fa8"><ellipse cx="20" cy="58" rx="7" ry="9"/><ellipse cx="46" cy="50" rx="7" ry="9"/>' +
    '<ellipse cx="68" cy="52" rx="7" ry="9"/><ellipse cx="86" cy="56" rx="7" ry="9"/><ellipse cx="98" cy="62" rx="7" ry="9"/></g>' +
    '<g fill="#e9a13b"><circle cx="20" cy="58" r="3.4"/><circle cx="46" cy="50" r="3.4"/>' +
    '<circle cx="68" cy="52" r="3.4"/><circle cx="86" cy="56" r="3.4"/><circle cx="98" cy="62" r="3.4"/></g>' +
    '</g>' +
    '<ellipse cx="60" cy="98" rx="10" ry="14" fill="#1c6fa8"/>' +
    '<circle cx="60" cy="82" r="8" fill="#2fa89b"/>' +
    '<path d="M60 70v-6 M57 66l3-4 3 4" fill="none" stroke="#e9a13b" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="63" cy="81" r="1.9" fill="#111"/>' +
    '<path d="M68 83l7 2-7 2z" fill="#e9a13b"/>' +
    '</svg>'
};

/* ------------------------------------------------------------------- ICONS */
/* 24px viewBox, stroke: currentColor, 1.7 weight, round caps — matches Bizzing Bee
   so icons inherit text colour and re-theme for free. */

window.IND_ICONS = {
  map:     '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
  book:    '<path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5zM8 7h8M8 11h6"/>',
  tree:    '<path d="M12 21v-6M12 15c-4 0-6-2-6-5s3-6 6-6 6 3 6 6-2 5-6 5zM7 12c0 3 2 4 5 4"/>',
  game:    '<rect x="2" y="7" width="20" height="11" rx="4"/><path d="M7 12h3M8.5 10.5v3M16 11.5h.01M18 14h.01"/>',
  script:  '<path d="M5 4h11l3 3v13H5zM8 9h7M8 13h7M8 17h4"/>',
  shell:   '<path d="M12 21C7 21 3 17 3 12a9 9 0 0118 0c0 5-4 9-9 9zM12 21V3M8 20.2L10 4M16 20.2L14 4"/>',
  lamp:    '<path d="M12 3c-1.5 2-1.5 3.5 0 5 1.5-1.5 1.5-3 0-5zM4 12c5 4 11 4 16 0-1 5-4 7-8 7s-7-2-8-7z"/>',
  parent:  '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a2.5 2.5 0 100-5M21 20c0-2.5-1.5-4.5-4-5"/>',
  chart:   '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  gear:    '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
  play:    '<path d="M7 4l13 8-13 8z"/>',
  sound:   '<path d="M4 9v6h4l5 4V5L8 9H4zM17 8a5 5 0 010 8"/>',
  mic:     '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
  star:    '<path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z"/>',
  lock:    '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
  back:    '<path d="M15 19l-7-7 7-7"/>',
  print:   '<path d="M7 8V3h10v5M7 18H4v-7h16v7h-3M7 14h10v7H7z"/>',
  temple:  '<path d="M12 2l4 5H8zM6 21v-8h12v8M4 21h16M9 21v-4h6v4"/>',
  clock:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};

window.IND_ICON = function (name, size) {
  var d = window.IND_ICONS[name];
  if (!d) return '';
  return '<svg class="ic" viewBox="0 0 24 24" width="' + (size || 22) + '" height="' + (size || 22) +
    '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
    d + '</svg>';
};
