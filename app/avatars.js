/* Bizzing India — avatar art.
   Four packs of 120x120 inline-SVG avatars, keyed by id, consumed by IND_AVATAR(id, size).
   Same contract as Bizzing Bee's SB_AVATAR_ART so the picker/evolution UI is portable.

   STYLE BAR (matched to Bizzing Bee's avatar pack):
   - the character FILLS the frame; no full-body figures with spindly props
   - big glossy eyes (white + dark pupil + highlight), blush ovals, simple curved smile
   - radial gradients for body volume, saturated flat colour elsewhere
   - sparkle accents; bold silhouettes that still read at 40px

   EDITORIAL NOTE (see docs/05): the Sikh tradition is represented by the Khanda and
   Harmandir Sahib rather than by a portrait of a Guru. Many Sikhs hold that the Gurus
   should not be depicted; the symbols carry the meaning without taking that risk.
   Deities are drawn reverently and identified by their traditional attributes.

   The two epic packs (Ramayana, Mahabharata) are raster-only: they ship as painted
   256x256 PNGs under app/art and have no inline-SVG fallback here, because the point
   of them is a face a child can recognise across twenty-four episodes and the SVG
   idiom cannot carry thirty distinguishable human faces. app.js art() prefers the PNG
   anyway, so nothing else changes.

   ON THE ANTAGONISTS (docs/05 §7): Ravana, Duryodhana, Shakuni and Kaikeyi are painted
   as people — proud, formidable, human — and never as villains' faces. No snarl, no
   horns, no monstrous colouring. The epics in this app refuse to flatten them and the
   art has to hold that line, because a child reads the face before the words. */

window.IND_AVATAR_ART = window.IND_AVATAR_ART || {};

/* ------------------------------------------------------------------ helpers */

/* radial gradient def */
function _rg(id, c1, c2) {
  return '<defs><radialGradient id="' + id + '" cx="50%" cy="34%" r="76%">' +
    '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/>' +
    '</radialGradient></defs>';
}
/* big glossy eyes — the single biggest driver of "cute" */
function _eyes(cy, dx, r, dark) {
  var l = 60 - dx, rr = 60 + dx, p = r * 0.5, d = dark || '#2B1B5E';
  return '<circle cx="' + l + '" cy="' + cy + '" r="' + r + '" fill="#fff"/>' +
    '<circle cx="' + (l + 1.6) + '" cy="' + (cy + 1.6) + '" r="' + p + '" fill="' + d + '"/>' +
    '<circle cx="' + (l - 0.4) + '" cy="' + (cy - 1) + '" r="' + (r * 0.2) + '" fill="#fff"/>' +
    '<circle cx="' + rr + '" cy="' + cy + '" r="' + r + '" fill="#fff"/>' +
    '<circle cx="' + (rr + 1.6) + '" cy="' + (cy + 1.6) + '" r="' + p + '" fill="' + d + '"/>' +
    '<circle cx="' + (rr - 0.4) + '" cy="' + (cy - 1) + '" r="' + (r * 0.2) + '" fill="#fff"/>';
}
/* closed, serene eyes — for the meditative figures */
function _calmEyes(cy, dx, d) {
  var l = 60 - dx, r = 60 + dx, c = d || '#2B1B5E';
  return '<path d="M' + (l - 7) + ' ' + cy + 'q7 6 14 0M' + (r - 7) + ' ' + cy + 'q7 6 14 0" ' +
    'fill="none" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>';
}
function _blush(cy, dx, c) {
  return '<ellipse cx="' + (60 - dx) + '" cy="' + cy + '" rx="6.5" ry="4" fill="' + (c || '#FF7FBE') + '" opacity=".7"/>' +
    '<ellipse cx="' + (60 + dx) + '" cy="' + cy + '" rx="6.5" ry="4" fill="' + (c || '#FF7FBE') + '" opacity=".7"/>';
}
function _smile(cy, w, c) {
  var h = w / 2;
  return '<path d="M' + (60 - h) + ' ' + cy + 'q' + h + ' ' + (w * 0.5) + ' ' + w + ' 0" fill="none" stroke="' +
    (c || '#3A1E5C') + '" stroke-width="3.4" stroke-linecap="round"/>';
}
function _spark(list, c) {
  var s = '<g fill="' + (c || '#FFE9A8') + '">';
  for (var i = 0; i < list.length; i++) {
    var p = list[i], x = p[0], y = p[1], r = p[2] || 4;
    s += '<path d="M' + x + ' ' + (y - r) + 'q' + (r * .3) + ' ' + (r * .7) + ' ' + r + ' ' + r +
      'q-' + (r * .7) + ' ' + (r * .3) + '-' + r + ' ' + r +
      'q-' + (r * .3) + '-' + (r * .7) + '-' + r + '-' + r +
      'q' + (r * .7) + '-' + (r * .3) + ' ' + r + '-' + r + 'z"/>';
  }
  return s + '</g>';
}
/* the golden nimbus behind the sacred figures */
function _nimbus(c1, c2) {
  return '<circle cx="60" cy="58" r="52" fill="' + c1 + '" opacity=".22"/>' +
    '<circle cx="60" cy="58" r="52" fill="none" stroke="' + c2 + '" stroke-width="3" opacity=".55"/>';
}
/* a big turban/pagri cap sitting on a head of radius ~34 centred at (60,62) */
function _pagri(c1, c2, jewel) {
  return '<path d="M24 46q4-34 36-34t36 34q-14-16-36-16t-36 16z" fill="' + c1 + '"/>' +
    '<path d="M24 46q36-18 72 0q-6 10-36 10t-36-10z" fill="' + c2 + '"/>' +
    (jewel ? '<circle cx="60" cy="30" r="6" fill="' + jewel + '"/><circle cx="60" cy="28.5" r="2.4" fill="#FFF4D6"/>' : '');
}
/* skin-toned head that fills the frame */
function _head(gid, c1, c2) {
  return _rg(gid, c1, c2) + '<circle cx="60" cy="62" r="36" fill="url(#' + gid + ')"/>';
}

/* ============================================================ PACK 1 · DEVAS */

Object.assign(window.IND_AVATAR_ART, {

/* Ganesha — the big elephant head fills the whole frame */
ganesha: _nimbus('#F2C46A', '#E9A13B') + _rg('gn', '#D9A8E8', '#A870C4') +
  '<ellipse cx="16" cy="60" rx="16" ry="26" fill="#9B6FB5"/><ellipse cx="16" cy="60" rx="9" ry="17" fill="#E5B6C8" opacity=".65"/>' +
  '<ellipse cx="104" cy="60" rx="16" ry="26" fill="#9B6FB5"/><ellipse cx="104" cy="60" rx="9" ry="17" fill="#E5B6C8" opacity=".65"/>' +
  '<path d="M26 54q0-32 34-32t34 32q0 26-6 36-6 12-28 12t-28-12q-6-10-6-36z" fill="url(#gn)"/>' +
  '<path d="M24 40q36-16 72 0-6-22-36-22t-36 22z" fill="#E9A13B"/>' +
  '<circle cx="60" cy="22" r="7" fill="#D94F3D"/><circle cx="60" cy="20.5" r="2.8" fill="#FFF4D6"/>' +
  '<path d="M60 46v10" stroke="#D94F3D" stroke-width="4" stroke-linecap="round"/>' +
  _eyes(62, 17, 9) + _blush(80, 27, '#F0A0C8') +
  '<path d="M52 88q-3 16 8 24 10 8 16 0" fill="none" stroke="#B98BD0" stroke-width="13" stroke-linecap="round"/>' +
  '<path d="M40 84q-6 8-3 14M80 84q6 8 3 14" stroke="#FFF4D6" stroke-width="6" fill="none" stroke-linecap="round"/>' +
  _spark([[14, 18, 5], [106, 24, 4], [100, 100, 4]]),

krishna: _nimbus('#8FD3FF', '#3AA0E0') + _head('kr', '#8FC4F0', '#4E8FD0') +
  '<path d="M22 42q38-20 76 0-10-26-38-26T22 42z" fill="#E9A13B"/>' +
  '<path d="M60 20q-22-2-28-16 18-4 28 8 10-12 28-8-6 14-28 16z" fill="#1C6FA8"/>' +
  '<path d="M60 12q-4-14 4-20 8 8 3 20z" fill="#2FA89B"/><circle cx="63" cy="-2" r="4" fill="#E9A13B"/>' +
  '<path d="M60 44v8" stroke="#E9A13B" stroke-width="4" stroke-linecap="round"/>' +
  _eyes(60, 15, 9) + _blush(78, 25) + _smile(84, 18) +
  '<path d="M18 100l40-14" stroke="#C98A3A" stroke-width="8" stroke-linecap="round"/>' +
  '<g fill="#6B4A1A"><circle cx="30" cy="96" r="2"/><circle cx="40" cy="93" r="2"/><circle cx="50" cy="89" r="2"/></g>' +
  _spark([[14, 26, 5], [104, 30, 4]]),

hanuman: _nimbus('#FFB066', '#E9713A') + _head('hn', '#F0A868', '#D9702E') +
  '<ellipse cx="20" cy="56" rx="12" ry="15" fill="#E9834A"/><ellipse cx="100" cy="56" rx="12" ry="15" fill="#E9834A"/>' +
  '<ellipse cx="60" cy="76" rx="23" ry="17" fill="#F7C39A"/>' +
  '<path d="M24 38q36-16 72 0-8-20-36-20t-36 20z" fill="#F2C46A"/>' +
  '<circle cx="60" cy="22" r="6" fill="#D94F3D"/>' +
  '<path d="M60 42v9" stroke="#D94F3D" stroke-width="4.4" stroke-linecap="round"/>' +
  _eyes(60, 16, 9) +
  '<ellipse cx="53" cy="72" rx="3" ry="2.4" fill="#8A3A2A"/><ellipse cx="67" cy="72" rx="3" ry="2.4" fill="#8A3A2A"/>' +
  _smile(82, 20, '#8A3A2A') + _blush(76, 30, '#F0906A') +
  _spark([[16, 22, 5], [104, 90, 4]]),

durga: _nimbus('#FF9EC4', '#E0567F') + _head('dg', '#F7D0AE', '#DFA97E') +
  '<path d="M20 44q40-22 80 0-12-28-40-28T20 44z" fill="#2F2A3A"/>' +
  '<path d="M26 40q34-16 68 0-4-14-14-20-8 8-20 8t-20-8q-10 6-14 20z" fill="#F2C46A"/>' +
  '<path d="M60 12l4-12 4 12zM40 16l2-11 7 9zM80 16l-2-11-7 9z" fill="#F2C46A"/>' +
  '<circle cx="60" cy="44" r="4.4" fill="#D94F3D"/>' +
  _eyes(62, 15, 9) + _blush(80, 25) + _smile(86, 18) +
  /* trishul, thick enough to read */
  '<path d="M104 118V58" stroke="#C98A3A" stroke-width="6" stroke-linecap="round"/>' +
  '<path d="M94 60l4-18 6 18M104 42V28M114 60l-4-18" stroke="#F2C46A" stroke-width="5" fill="none" stroke-linecap="round"/>' +
  _spark([[14, 30, 5], [18, 96, 4]]),

saraswati: _nimbus('#FFFFFF', '#DFE8FF') + _head('sw', '#F7D0AE', '#DFA97E') +
  '<path d="M20 44q40-22 80 0-12-28-40-28T20 44z" fill="#2F2A3A"/>' +
  '<path d="M24 40q36-16 72 0-6-12-36-12t-36 12z" fill="#F2C46A"/>' +
  '<circle cx="60" cy="44" r="4" fill="#D94F3D"/>' +
  _eyes(62, 15, 9) + _blush(80, 25) + _smile(86, 18) +
  /* veena across the bottom, big and chunky */
  '<path d="M14 112l44-26" stroke="#C98A3A" stroke-width="7" stroke-linecap="round"/>' +
  '<ellipse cx="14" cy="112" rx="14" ry="12" fill="#E9A13B"/><ellipse cx="14" cy="112" rx="6" ry="5" fill="#8A5A2A"/>' +
  '<circle cx="62" cy="83" r="6" fill="#C98A3A"/>' +
  _spark([[104, 26, 5], [108, 60, 4], [16, 26, 4]], '#FFFFFF'),

shiva: _nimbus('#BFE6FF', '#6FB9E0') + _head('sv', '#D6EAF6', '#9EC4DA') +
  '<path d="M22 44q38-24 76 0-10-30-38-30T22 44z" fill="#3B3550"/>' +
  '<path d="M60 14q-6-12 2-14 8 4 4 14z" fill="#3B3550"/>' +
  '<path d="M92 20a9 9 0 10-3 16 10 10 0 013-16z" fill="#FFF4D6"/>' +
  '<path d="M34 46q10 4 22 0M64 46q12 4 22 0" stroke="#E9E2D0" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  _calmEyes(62, 15) +
  '<path d="M60 52v6" stroke="#E9A13B" stroke-width="5" stroke-linecap="round"/>' +
  '<path d="M44 90q16 8 32 0" stroke="#4A86C8" stroke-width="9" fill="none" stroke-linecap="round"/>' +
  _smile(80, 16, '#6A5A8A') +
  '<path d="M14 118V56" stroke="#C98A3A" stroke-width="6" stroke-linecap="round"/>' +
  '<path d="M4 58l4-18 6 18M14 40V26M24 58l-4-18" stroke="#F2C46A" stroke-width="5" fill="none" stroke-linecap="round"/>',

rama: _nimbus('#A8E6A0', '#4FA336') + _head('rm', '#9FCFB4', '#6FA98C') +
  '<path d="M20 44q40-22 80 0-12-28-40-28T20 44z" fill="#2F2A3A"/>' +
  '<path d="M22 40q38-18 76 0-6-16-38-16t-38 16z" fill="#E9A13B"/>' +
  '<path d="M60 22l5-14 5 14z" fill="#F2C46A"/><circle cx="60" cy="26" r="4" fill="#D94F3D"/>' +
  '<path d="M60 46v9" stroke="#D94F3D" stroke-width="4" stroke-linecap="round"/>' +
  _eyes(62, 15, 9) + _blush(80, 25, '#8FBF9F') + _smile(86, 18) +
  '<path d="M106 26q16 34 0 68" stroke="#C98A3A" stroke-width="6" fill="none" stroke-linecap="round"/>' +
  '<path d="M106 26q-6 34 0 68" stroke="#F2C46A" stroke-width="2.4" fill="none"/>' +
  _spark([[16, 28, 5]]),

lakshmi: _nimbus('#FFD98A', '#E9A13B') + _head('lk', '#F7D0AE', '#DFA97E') +
  '<path d="M20 44q40-22 80 0-12-28-40-28T20 44z" fill="#2F2A3A"/>' +
  '<path d="M24 40q36-16 72 0-6-14-36-14t-36 14z" fill="#F2C46A"/>' +
  '<circle cx="60" cy="44" r="4.4" fill="#D94F3D"/>' +
  _eyes(62, 15, 9) + _blush(80, 25) + _smile(86, 18) +
  /* lotus petals under the chin */
  '<g fill="#E0567F"><path d="M60 118q-22-4-30-12 16-8 30 12z"/><path d="M60 118q22-4 30-12-16-8-30 12z"/>' +
  '<path d="M60 118q-10-8-10-19 11 3 10 19z"/><path d="M60 118q10-8 10-19-11 3-10 19z"/></g>' +
  '<g fill="#F2C46A" stroke="#C98A3A" stroke-width="1.4"><circle cx="16" cy="98" r="7"/><circle cx="27" cy="107" r="7"/></g>' +
  _spark([[104, 28, 5], [108, 88, 4]]),

buddha: _nimbus('#FFD98A', '#E9A13B') + _head('bd', '#F7D8B0', '#DDAF80') +
  '<path d="M24 44q36-26 72 0-8-30-36-30t-36 30z" fill="#2E2A44"/>' +
  '<g fill="#463F66"><circle cx="34" cy="40" r="4"/><circle cx="46" cy="32" r="4"/><circle cx="60" cy="28" r="4"/>' +
  '<circle cx="74" cy="32" r="4"/><circle cx="86" cy="40" r="4"/></g>' +
  '<circle cx="60" cy="16" r="8" fill="#2E2A44"/><circle cx="60" cy="8" r="4.4" fill="#E9A13B"/>' +
  '<circle cx="60" cy="50" r="4" fill="#E9A13B"/>' +
  _calmEyes(62, 15) + _smile(84, 18, '#8A5A3A') + _blush(78, 28, '#E8A88A') +
  '<path d="M8 112q8-16 52-16t52 16z" fill="#E07B39"/>' +
  _spark([[14, 24, 5], [106, 24, 5]]),

mahavira: _nimbus('#FFF4D6', '#E9D9A0') + _head('mv', '#F7D8B0', '#DDAF80') +
  '<path d="M24 44q36-28 72 0-8-32-36-32t-36 32z" fill="#2E2A44"/>' +
  '<circle cx="60" cy="14" r="7" fill="#2E2A44"/>' +
  _calmEyes(62, 15) + _smile(84, 18, '#8A5A3A') + _blush(78, 28, '#E8A88A') +
  '<path d="M8 112q8-16 52-16t52 16z" fill="#F7F0E0"/>' +
  '<path d="M60 96l7 12H53z" fill="#E9A13B"/>' +
  /* the open palm of ahimsa */
  '<path d="M100 92V70q0-6 6-6t6 6v22z" fill="#F7D8B0"/>' +
  '<path d="M100 82h12" stroke="#DDAF80" stroke-width="2"/>' +
  _spark([[16, 26, 5]]),

/* Sikh tradition — symbols, not a portrait of a Guru. See the editorial note above. */
khanda: '<circle cx="60" cy="60" r="54" fill="#0F5BA8" opacity=".2"/>' +
  '<circle cx="60" cy="60" r="54" fill="none" stroke="#F2C46A" stroke-width="3"/>' +
  '<circle cx="60" cy="66" r="26" fill="none" stroke="#F2C46A" stroke-width="9"/>' +
  '<path d="M18 34a44 44 0 0042 74" fill="none" stroke="#F2C46A" stroke-width="9" stroke-linecap="round"/>' +
  '<path d="M102 34a44 44 0 01-42 74" fill="none" stroke="#F2C46A" stroke-width="9" stroke-linecap="round"/>' +
  '<path d="M60 6q9 20 0 38-9-18 0-38z" fill="#F2C46A"/>' +
  '<path d="M60 38v76" stroke="#F2C46A" stroke-width="10" stroke-linecap="round"/>' +
  _spark([[16, 18, 5], [104, 18, 5]]),

harmandir: '<rect x="0" y="78" width="120" height="42" fill="#5FB4D8" opacity=".55"/>' +
  _rg('hm', '#FFE08A', '#E9A13B') +
  '<path d="M20 78V44h80v34z" fill="url(#hm)"/>' +
  '<path d="M20 44l40-22 40 22z" fill="#F2C46A"/>' +
  '<path d="M60 22V10" stroke="#F2C46A" stroke-width="3.4" stroke-linecap="round"/>' +
  '<path d="M60 4q8 6 0 10-8-4 0-10z" fill="#F2C46A"/>' +
  '<g fill="#C98A3A"><rect x="30" y="58" width="12" height="20" rx="6"/><rect x="54" y="58" width="12" height="20" rx="6"/>' +
  '<rect x="78" y="58" width="12" height="20" rx="6"/></g>' +
  '<rect x="12" y="78" width="96" height="8" fill="#E9A13B"/>' +
  '<path d="M20 86v26h80V86z" fill="#F2C46A" opacity=".35"/>' +
  '<path d="M12 96q24 8 48 0t48 0M12 106q24 8 48 0t48 0" stroke="#FFFFFF" stroke-width="2.4" fill="none" opacity=".45"/>' +
  _spark([[16, 22, 5], [104, 30, 4]])
});

/* ==================================================== PACK 2 · PANCHATANTRA */

Object.assign(window.IND_AVATAR_ART, {

pt_lion: _rg('pl', '#FFD86E', '#E09A2A') +
  '<g fill="#C9762A"><circle cx="60" cy="60" r="54"/></g>' +
  '<g fill="#A85C1C"><path d="M60 4l8 14H52zM116 44l-4 15-13-10zM4 44l4 15 13-10zM110 92l-14 6-2-16zM10 92l14 6 2-16zM60 116l8-14H52z"/></g>' +
  '<circle cx="60" cy="60" r="38" fill="url(#pl)"/>' +
  '<ellipse cx="60" cy="78" rx="22" ry="16" fill="#F7E0B8"/>' +
  _eyes(56, 15, 10, '#3A1E5C') +
  '<path d="M60 70l-7 6h14z" fill="#8A3A2A"/>' +
  '<path d="M60 76v5M60 81q-7 7-13 2M60 81q7 7 13 2" stroke="#8A3A2A" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  '<g stroke="#8A3A2A" stroke-width="2" opacity=".65"><path d="M38 74l-12-4M38 80l-12 3M82 74l12-4M82 80l12 3"/></g>',

pt_jackal: _rg('pj', '#E0B45A', '#B8822A') +
  '<path d="M24 40L14 8l30 18zM96 40l10-32-30 18z" fill="#A8762A"/>' +
  '<path d="M27 38l-5-18 16 11zM93 38l5-18-16 11z" fill="#E8C08A"/>' +
  '<circle cx="60" cy="62" r="38" fill="url(#pj)"/>' +
  '<path d="M60 66q-24 3-26 20 10 16 26 16t26-16q-2-17-26-20z" fill="#F0DCA8"/>' +
  _eyes(54, 16, 9.5) + _blush(72, 30, '#E0A05A') +
  '<ellipse cx="60" cy="86" rx="6" ry="4.4" fill="#4A3320"/>' +
  '<path d="M60 91q-8 6-14 2M60 91q8 6 14 2" stroke="#6B4A1A" stroke-width="2.6" fill="none" stroke-linecap="round"/>',

pt_bull: _rg('pb', '#B4BECA', '#7E8A98') +
  /* big curved horns sweeping up and out — the whole silhouette of a bull */
  '<path d="M26 46Q2 40 6 18q2-12 12-10 6 2 3 10-4 12 12 18z" fill="#F7F0E0" stroke="#C9C0A8" stroke-width="1.6"/>' +
  '<path d="M94 46q24-6 20-28-2-12-12-10-6 2-3 10 4 12-12 18z" fill="#F7F0E0" stroke="#C9C0A8" stroke-width="1.6"/>' +
  '<circle cx="60" cy="64" r="38" fill="url(#pb)"/>' +
  '<ellipse cx="60" cy="82" rx="26" ry="19" fill="#DCE4EC"/>' +
  '<path d="M22 44q38-16 76 0" stroke="#E9A13B" stroke-width="5" fill="none" stroke-linecap="round"/>' +
  '<circle cx="60" cy="36" r="6" fill="#D94F3D"/>' +
  _eyes(58, 16, 9.5) +
  '<ellipse cx="51" cy="80" rx="4.4" ry="3.4" fill="#5A6472"/><ellipse cx="69" cy="80" rx="4.4" ry="3.4" fill="#5A6472"/>' +
  _smile(92, 18, '#5A6472'),

pt_crow: _rg('pc', '#525873', '#232838') +
  /* body low and left, head high and right, so the silhouette reads as a bird */
  '<ellipse cx="48" cy="82" rx="36" ry="30" fill="url(#pc)"/>' +
  '<path d="M22 74q-10 20 2 34 16 6 26-6 2-20-10-28z" fill="#5A6178"/>' +
  '<path d="M26 84q10 2 16 8M24 94q11 1 18 6" stroke="#39405A" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
  '<path d="M8 96q-6 16-2 22 14-2 18-14z" fill="#454B5C"/>' +
  '<circle cx="76" cy="40" r="28" fill="url(#pc)"/>' +
  /* the beak: big, wedge-shaped, unmissable */
  '<path d="M100 32q20 4 20 11 0 8-19 8l-6-10z" fill="#E9A13B"/>' +
  '<path d="M101 43q11 1 17-2" stroke="#C97A1A" stroke-width="2.4" fill="none"/>' +
  _eyes(36, 9, 8.5, '#111') +
  '<path d="M56 16q10-6 18 0M84 14q10-2 16 6" stroke="#232838" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
  _spark([[16, 26, 4], [106, 88, 4]], '#8FA8C8'),

pt_tortoise: _rg('pt', '#7FB05A', '#4F7A3A') +
  '<ellipse cx="66" cy="72" rx="50" ry="38" fill="#3E6630"/>' +
  '<ellipse cx="66" cy="70" rx="42" ry="31" fill="url(#pt)"/>' +
  '<g fill="none" stroke="#33562A" stroke-width="3">' +
  '<path d="M66 39v62M24 70h84M38 48l56 44M94 48L38 92"/></g>' +
  '<g fill="#9ACB6C"><circle cx="66" cy="70" r="10"/><circle cx="44" cy="58" r="6"/><circle cx="88" cy="58" r="6"/>' +
  '<circle cx="44" cy="84" r="6"/><circle cx="88" cy="84" r="6"/></g>' +
  /* head big enough to carry a face — this is a talking tortoise */
  '<path d="M30 46q-16-4-22 6" stroke="#7AA85C" stroke-width="14" fill="none" stroke-linecap="round"/>' +
  '<circle cx="24" cy="42" r="22" fill="#8ABB6A"/>' +
  _eyes(38, 9, 8, '#223') +
  '<ellipse cx="12" cy="48" rx="3" ry="2.2" fill="#4F7A3A"/>' +
  '<path d="M14 54q10 7 20 1" stroke="#4F7A3A" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  '<g fill="#7AA85C"><ellipse cx="44" cy="108" rx="13" ry="8"/><ellipse cx="96" cy="108" rx="13" ry="8"/></g>',

pt_mouse: _rg('pm', '#C6BED4', '#8E86A0') +
  '<circle cx="22" cy="34" r="22" fill="#A89FBC"/><circle cx="22" cy="34" r="13" fill="#F0B6C8"/>' +
  '<circle cx="98" cy="34" r="22" fill="#A89FBC"/><circle cx="98" cy="34" r="13" fill="#F0B6C8"/>' +
  '<circle cx="60" cy="66" r="38" fill="url(#pm)"/>' +
  '<path d="M60 70q-20 3-22 17 9 13 22 13t22-13q-2-14-22-17z" fill="#E4DEEE"/>' +
  _eyes(58, 15, 9.5) + _blush(76, 29, '#F0A0C0') +
  '<ellipse cx="60" cy="86" rx="5.4" ry="4" fill="#E0567F"/>' +
  '<g stroke="#6B6478" stroke-width="1.8"><path d="M40 86l-16-5M40 92l-16 3M80 86l16-5M80 92l16 3"/></g>',

pt_deer: _rg('pd', '#DFA872', '#B57C46') +
  /* antlers: one bold main beam each side, two clean tines — reads at 40px */
  '<path d="M34 30q-6-16-2-28M32 16q-10-2-14-10M32 6q-8-2-10-8M86 30q6-16 2-28M88 16q10-2 14-10M88 6q8-2 10-8"' +
  ' stroke="#8A5A2A" stroke-width="6" fill="none" stroke-linecap="round"/>' +
  '<ellipse cx="16" cy="52" rx="12" ry="16" fill="#C98A5A"/><ellipse cx="104" cy="52" rx="12" ry="16" fill="#C98A5A"/>' +
  '<circle cx="60" cy="64" r="38" fill="url(#pd)"/>' +
  '<path d="M60 68q-19 3-21 18 9 13 21 13t21-13q-2-15-21-18z" fill="#F4DCC0"/>' +
  _eyes(58, 16, 10) + _blush(76, 30, '#E0A080') +
  '<ellipse cx="60" cy="86" rx="6" ry="4.4" fill="#5A3A20"/>' +
  '<g fill="#F7E4CC" opacity=".85"><circle cx="34" cy="52" r="4"/><circle cx="86" cy="52" r="4"/><circle cx="60" cy="38" r="4"/></g>',

pt_crocodile: _rg('pk', '#6FAA75', '#3E6A46') +
  '<ellipse cx="66" cy="70" rx="52" ry="32" fill="#4A7A52"/>' +
  '<path d="M22 46l8-16 8 16zM44 40l8-16 8 16zM66 38l8-16 8 16zM88 42l8-16 8 16z" fill="#6BA874"/>' +
  '<ellipse cx="66" cy="68" rx="44" ry="24" fill="#5F9A66"/>' +
  '<path d="M20 74q-16 4-16 12h40z" fill="#6BA874"/>' +
  '<circle cx="40" cy="52" r="14" fill="#8EC98E"/>' +
  '<circle cx="40" cy="52" r="8" fill="#fff"/><circle cx="41.5" cy="53" r="4.4" fill="#223"/>' +
  '<circle cx="39" cy="50" r="1.6" fill="#fff"/>' +
  '<path d="M6 84h56q8 0 8 6H8z" fill="#F7F0E0"/>' +
  '<g fill="#fff"><path d="M14 84l4 7 4-7zM28 84l4 7 4-7zM42 84l4 7 4-7zM56 84l4 7 4-7z"/></g>' +
  '<path d="M108 92q14 6 12-8" stroke="#4A7A52" stroke-width="10" fill="none" stroke-linecap="round"/>',

pt_monkey: _rg('pmk', '#C08A46', '#8A5C22') +
  '<circle cx="16" cy="56" r="20" fill="#A8763A"/><circle cx="16" cy="56" r="11" fill="#E8C08A"/>' +
  '<circle cx="104" cy="56" r="20" fill="#A8763A"/><circle cx="104" cy="56" r="11" fill="#E8C08A"/>' +
  '<circle cx="60" cy="62" r="38" fill="url(#pmk)"/>' +
  '<path d="M60 56q-26 3-26 24 0 19 26 19t26-19q0-21-26-24z" fill="#F2D6AC"/>' +
  _eyes(54, 15, 9.5) +
  '<ellipse cx="53" cy="76" rx="3.4" ry="2.6" fill="#8A5A2A"/><ellipse cx="67" cy="76" rx="3.4" ry="2.6" fill="#8A5A2A"/>' +
  _smile(86, 22, '#8A5A2A') + _blush(80, 30, '#E0A080') +
  '<circle cx="102" cy="100" r="11" fill="#D94F3D"/>' +
  '<path d="M102 89v-8" stroke="#4F7A3A" stroke-width="3" stroke-linecap="round"/>',

pt_rabbit: _rg('pr', '#F2EEF8', '#C8C0D8') +
  '<ellipse cx="40" cy="20" rx="11" ry="26" fill="#E2DCEC"/><ellipse cx="40" cy="22" rx="6" ry="18" fill="#F0B6C8"/>' +
  '<ellipse cx="80" cy="20" rx="11" ry="26" fill="#E2DCEC"/><ellipse cx="80" cy="22" rx="6" ry="18" fill="#F0B6C8"/>' +
  '<circle cx="60" cy="70" r="38" fill="url(#pr)"/>' +
  _eyes(64, 16, 10) + _blush(82, 29, '#F0A0C0') +
  '<path d="M60 78l-6 6h12z" fill="#E0567F"/>' +
  '<path d="M60 84v5M60 89q-8 6-13 1M60 89q8 6 13 1" stroke="#A89AB8" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
  '<g stroke="#B8B0C4" stroke-width="1.8"><path d="M40 84l-16-4M40 90l-16 4M80 84l16-4M80 90l16 4"/></g>',

pt_heron: _rg('ph', '#FFFFFF', '#CFC9BC') +
  '<ellipse cx="46" cy="84" rx="36" ry="30" fill="url(#ph)"/>' +
  /* wing, drawn with visible feather lines so it isn't a white blob */
  '<path d="M20 74q-12 20 0 38 16 6 24-6 4-18-10-32z" fill="#E4DFD2"/>' +
  '<path d="M24 82q12 2 18 9M22 92q13 1 20 7M24 101q11 0 17 5" stroke="#BEB7A6" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
  /* the long S-neck is the whole silhouette of a heron */
  '<path d="M62 68q22-14 20-34" stroke="#F2F0E8" stroke-width="16" fill="none" stroke-linecap="round"/>' +
  '<circle cx="80" cy="26" r="19" fill="#F2F0E8"/>' +
  '<path d="M98 20q22 3 22 9 0 6-21 7z" fill="#E9A13B"/>' +
  '<path d="M99 30q12 1 18-2" stroke="#C97A1A" stroke-width="2.4" fill="none"/>' +
  _eyes(22, 0, 8, '#223') +
  '<path d="M80 6q12-6 20 0" stroke="#2F3340" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
  '<path d="M40 112v8M56 112v8" stroke="#E9A13B" stroke-width="4.4" stroke-linecap="round"/>',

pt_elephant: _rg('pe', '#B4AEC8', '#807A96') +
  '<ellipse cx="12" cy="58" rx="18" ry="26" fill="#8E8AA0"/><ellipse cx="12" cy="58" rx="10" ry="17" fill="#B0AAC0" opacity=".6"/>' +
  '<ellipse cx="108" cy="58" rx="18" ry="26" fill="#8E8AA0"/><ellipse cx="108" cy="58" rx="10" ry="17" fill="#B0AAC0" opacity=".6"/>' +
  '<path d="M26 54q0-32 34-32t34 32q0 26-6 36-6 12-28 12t-28-12q-6-10-6-36z" fill="url(#pe)"/>' +
  '<path d="M24 40q36-16 72 0" stroke="#E9A13B" stroke-width="4.4" fill="none" stroke-linecap="round"/>' +
  _eyes(60, 17, 9) + _blush(78, 28, '#C8A0C0') +
  '<path d="M52 88q-3 16 8 24 10 8 16 0" fill="none" stroke="#9A94AE" stroke-width="13" stroke-linecap="round"/>' +
  '<path d="M40 84q-6 8-3 14M80 84q6 8 3 14" stroke="#FFF4D6" stroke-width="6" fill="none" stroke-linecap="round"/>'
});

/* =============================================== PACK 3 · AKBAR'S DARBAR */

Object.assign(window.IND_AVATAR_ART, {

akbar: '<circle cx="60" cy="60" r="54" fill="#1F5F8A" opacity=".22"/>' +
  _head('ak', '#E8BE94', '#C2966A') +
  _pagri('#F2F0E8', '#E4DECC', '#2FA89B') +
  '<path d="M66 22q16-14 22-6" stroke="#D94F3D" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  _eyes(62, 15, 9) +
  '<path d="M40 76q20 8 40 0" stroke="#3A2A1A" stroke-width="6" fill="none" stroke-linecap="round"/>' +
  '<path d="M32 78q6 26 28 26t28-26q-12 12-28 12t-28-12z" fill="#3A2A1A"/>' +
  _spark([[16, 26, 5], [104, 26, 5]]),

birbal: '<circle cx="60" cy="60" r="54" fill="#E9A13B" opacity=".2"/>' +
  _head('bi', '#DFAE7E', '#B98A58') +
  _pagri('#E9A13B', '#D48C22', '#D94F3D') +
  _eyes(60, 15, 9) +
  /* the raised eyebrow and half-smile ARE the character */
  '<path d="M42 46q8-6 14-2" stroke="#3A2A1A" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  '<path d="M66 42q8-4 14 3" stroke="#3A2A1A" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
  '<path d="M42 76q20 7 38-1" stroke="#4A3520" stroke-width="5.4" fill="none" stroke-linecap="round"/>' +
  '<path d="M44 88q14 12 30 0" fill="none" stroke="#8A3A2A" stroke-width="3.6" stroke-linecap="round"/>' +
  _blush(84, 30, '#D9A078') +
  _spark([[104, 30, 5]]),

tansen: '<circle cx="60" cy="60" r="54" fill="#8A5DA6" opacity=".24"/>' +
  _head('tn', '#DFAE7E', '#B98A58') +
  _pagri('#F2F0E8', '#E0DACC', '#8A5DA6') +
  _eyes(60, 15, 9) +
  '<path d="M32 76q6 26 28 26t28-26q-12 12-28 12t-28-12z" fill="#4A3520"/>' +
  '<path d="M40 74q20 8 40 0" stroke="#4A3520" stroke-width="5" fill="none" stroke-linecap="round"/>' +
  '<path d="M10 116l30-30" stroke="#C98A3A" stroke-width="7" stroke-linecap="round"/>' +
  '<ellipse cx="10" cy="114" rx="13" ry="11" fill="#E9A13B"/>' +
  '<g fill="#F2C46A"><circle cx="100" cy="30" r="5"/><path d="M103 30V14l8 4v3l-5-2v11z"/>' +
  '<circle cx="94" cy="56" r="4"/><path d="M96.5 56V44l6 3v2.4l-3.6-1.4V56z"/></g>',

courtier: '<circle cx="60" cy="60" r="54" fill="#4F7A3A" opacity=".2"/>' +
  _head('ct', '#D4A276', '#AE7E4E') +
  _pagri('#D94F3D', '#B93A2A', '#F2C46A') +
  _eyes(62, 15, 9) +
  '<path d="M42 78q18 6 36 0" stroke="#4A3520" stroke-width="5" fill="none" stroke-linecap="round"/>' +
  _smile(92, 16, '#8A3A2A') + _blush(84, 30, '#C99070'),

guard: '<circle cx="60" cy="60" r="54" fill="#8A8A9A" opacity=".2"/>' +
  _head('gd', '#D4A276', '#AE7E4E') +
  '<path d="M22 46q2-36 38-36t38 36q-16-16-38-16t-38 16z" fill="#B0AAC0"/>' +
  '<path d="M22 46q38-18 76 0" stroke="#8A8496" stroke-width="3" fill="none"/>' +
  '<path d="M60 10V0" stroke="#C9C2B0" stroke-width="4" stroke-linecap="round"/>' +
  _eyes(62, 15, 9) +
  '<path d="M38 78q22 8 44-1" stroke="#3A2A1A" stroke-width="7" fill="none" stroke-linecap="round"/>' +
  '<path d="M114 118V52" stroke="#8A5A2A" stroke-width="6" stroke-linecap="round"/>' +
  '<path d="M114 52l-7-18h14z" fill="#C9C2B0"/>',

royal_elephant: _rg('re', '#B4AEC8', '#807A96') +
  '<ellipse cx="6" cy="60" rx="20" ry="28" fill="#8E8AA0"/><ellipse cx="114" cy="60" rx="20" ry="28" fill="#8E8AA0"/>' +
  '<path d="M22 56q0-34 38-34t38 34q0 26-6 36-6 12-32 12t-32-12q-6-10-6-36z" fill="url(#re)"/>' +
  /* the jhool — embroidered caparison across the brow */
  '<path d="M20 44q40-20 80 0v12q-40 14-80 0z" fill="#D9345F"/>' +
  '<g fill="#F2C46A"><circle cx="32" cy="50" r="4"/><circle cx="46" cy="54" r="4"/><circle cx="60" cy="55" r="4"/>' +
  '<circle cx="74" cy="54" r="4"/><circle cx="88" cy="50" r="4"/></g>' +
  '<circle cx="60" cy="34" r="7" fill="#2FA89B"/><circle cx="60" cy="32" r="3" fill="#FFF4D6"/>' +
  _eyes(70, 17, 9) +
  '<path d="M52 94q-3 14 8 22 10 7 16 0" fill="none" stroke="#9A94AE" stroke-width="13" stroke-linecap="round"/>' +
  '<path d="M40 90q-6 8-3 14M80 90q6 8 3 14" stroke="#FFF4D6" stroke-width="6" fill="none" stroke-linecap="round"/>' +
  _spark([[14, 20, 5], [106, 20, 5]])
});

/* ================================================== PACK 4 · GREAT INDIANS */
/* Real people, drawn iconically. Every one carries an Itihaas badge in the content layer. */

Object.assign(window.IND_AVATAR_ART, {

ashoka: '<circle cx="60" cy="60" r="54" fill="#E9A13B" opacity=".2"/>' +
  _head('as', '#DFAE7E', '#B98A58') +
  _pagri('#F2C46A', '#DE9C1E', '#D94F3D') +
  _eyes(62, 15, 9) +
  '<path d="M40 76q20 8 40 0" stroke="#3A2A1A" stroke-width="6" fill="none" stroke-linecap="round"/>' +
  '<path d="M32 78q6 24 28 24t28-24q-12 11-28 11t-28-11z" fill="#3A2A1A"/>' +
  /* the lion capital, big enough to read */
  '<g transform="translate(100,96)"><circle r="18" fill="#C98A3A"/><circle r="12" fill="#E9A13B"/>' +
  '<g fill="#8A5A2A"><path d="M0-12l4 6h-8zM12 0l-6 4v-8zM0 12l-4-6h8zM-12 0l6-4v8z"/></g></g>',

chanakya: '<circle cx="60" cy="60" r="54" fill="#C9762A" opacity=".2"/>' +
  _head('ch', '#D4A276', '#AE7E4E') +
  '<path d="M22 46q4-30 38-30t38 30q-16-14-38-14t-38 14z" fill="#3A2A1A"/>' +
  '<path d="M60 16q-8-14 2-16 10 4 6 16z" fill="#3A2A1A"/>' +
  '<path d="M22 50q38-16 76 0" stroke="#D94F3D" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  _eyes(64, 15, 9) +
  '<path d="M28 82q6 30 32 30t32-30q-14 14-32 14t-32-14z" fill="#EFE9DD"/>' +
  '<path d="M40 80q20 7 40 0" stroke="#EFE9DD" stroke-width="6" fill="none" stroke-linecap="round"/>' +
  '<rect x="4" y="94" width="34" height="12" rx="4" fill="#E9D9A0"/>' +
  '<g stroke="#8A5A2A" stroke-width="1.8"><path d="M9 99h24M9 103h17"/></g>',

shivaji: '<circle cx="60" cy="60" r="54" fill="#E9701B" opacity=".22"/>' +
  _head('sh', '#DFAE7E', '#B98A58') +
  '<path d="M20 44q6-38 40-38t40 38q-18-18-40-18t-40 18z" fill="#E9701B"/>' +
  '<path d="M20 44q40-18 80 0" stroke="#C9540F" stroke-width="3.4" fill="none"/>' +
  '<path d="M96 26q14-6 18 4" stroke="#F2C46A" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  _eyes(62, 15, 9) +
  '<path d="M36 78q24 9 48-1" stroke="#3A2A1A" stroke-width="8" fill="none" stroke-linecap="round"/>' +
  '<path d="M32 80q6 26 28 26t28-26q-12 12-28 12t-28-12z" fill="#3A2A1A"/>',

lakshmibai: '<circle cx="60" cy="60" r="54" fill="#D9345F" opacity=".2"/>' +
  _head('lb', '#E8BE94', '#C2966A') +
  '<path d="M18 46q4-38 42-38t42 38q-18-18-42-18t-42 18z" fill="#2F2A3A"/>' +
  '<path d="M18 46q-2 22 8 34" stroke="#2F2A3A" stroke-width="9" fill="none" stroke-linecap="round"/>' +
  '<path d="M102 46q2 22-8 34" stroke="#2F2A3A" stroke-width="9" fill="none" stroke-linecap="round"/>' +
  '<circle cx="60" cy="42" r="5" fill="#D94F3D"/>' +
  _eyes(62, 15, 9.5) + _blush(80, 28) + _smile(88, 16) +
  '<path d="M114 112L88 66" stroke="#D8D2E2" stroke-width="7" stroke-linecap="round"/>' +
  '<path d="M84 60l10 6" stroke="#E9A13B" stroke-width="9" stroke-linecap="round"/>',

gandhi: '<circle cx="60" cy="60" r="54" fill="#F7F0E0" opacity=".26"/>' +
  _head('ga', '#DFAE7E', '#B98A58') +
  '<path d="M20 50q8-40 40-40t40 40q-14-14-40-14t-40 14z" fill="#C9A078" opacity=".55"/>' +
  '<path d="M22 52q10-8 18-2M80 50q10-6 18 2" stroke="#B8905E" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  /* the round spectacles are the whole silhouette */
  '<circle cx="44" cy="62" r="15" fill="#FFFFFF" opacity=".22"/><circle cx="76" cy="62" r="15" fill="#FFFFFF" opacity=".22"/>' +
  '<circle cx="44" cy="62" r="15" fill="none" stroke="#4A4458" stroke-width="4"/>' +
  '<circle cx="76" cy="62" r="15" fill="none" stroke="#4A4458" stroke-width="4"/>' +
  '<path d="M59 62h2M29 58l-12-4M91 58l12-4" stroke="#4A4458" stroke-width="4" stroke-linecap="round"/>' +
  '<circle cx="45" cy="63" r="5" fill="#2B1B5E"/><circle cx="43.4" cy="61" r="1.6" fill="#fff"/>' +
  '<circle cx="77" cy="63" r="5" fill="#2B1B5E"/><circle cx="75.4" cy="61" r="1.6" fill="#fff"/>' +
  '<path d="M46 84q14 6 28 0" stroke="#8A6A4A" stroke-width="5" fill="none" stroke-linecap="round"/>' +
  _smile(94, 16, '#8A3A2A') +
  '<circle cx="16" cy="102" r="16" fill="none" stroke="#C98A3A" stroke-width="3.4"/>' +
  '<g stroke="#C98A3A" stroke-width="2"><path d="M16 86v32M0 102h32M5 91l22 22M27 91L5 113"/></g>',

ambedkar: '<circle cx="60" cy="60" r="54" fill="#1F5F8A" opacity=".24"/>' +
  _head('am', '#D4A276', '#AE7E4E') +
  '<path d="M20 48q6-40 40-40t40 40q-16-18-40-18t-40 18z" fill="#3A3548"/>' +
  '<circle cx="44" cy="62" r="15" fill="#FFFFFF" opacity=".2"/><circle cx="76" cy="62" r="15" fill="#FFFFFF" opacity=".2"/>' +
  '<circle cx="44" cy="62" r="15" fill="none" stroke="#2F2A3A" stroke-width="4.4"/>' +
  '<circle cx="76" cy="62" r="15" fill="none" stroke="#2F2A3A" stroke-width="4.4"/>' +
  '<path d="M59 62h2" stroke="#2F2A3A" stroke-width="4.4"/>' +
  '<circle cx="45" cy="63" r="5" fill="#2B1B5E"/><circle cx="43.4" cy="61" r="1.6" fill="#fff"/>' +
  '<circle cx="77" cy="63" r="5" fill="#2B1B5E"/><circle cx="75.4" cy="61" r="1.6" fill="#fff"/>' +
  _smile(90, 18, '#8A3A2A') +
  '<path d="M14 118V96q0-6 6-6h22v28z" fill="#B02A4A"/>' +
  '<g stroke="#F2C46A" stroke-width="2.4"><path d="M20 100h16M20 106h16M20 112h11"/></g>',

bhagat: '<circle cx="60" cy="60" r="54" fill="#F2C46A" opacity=".2"/>' +
  _head('bg', '#DFAE7E', '#B98A58') +
  /* the hat, which is the entire silhouette */
  '<path d="M18 42h84q-4-26-42-26T18 42z" fill="#E9D9A0"/>' +
  '<ellipse cx="60" cy="43" rx="48" ry="8" fill="#D9C890"/>' +
  _eyes(64, 15, 9) +
  '<path d="M38 82q22 8 44-1" stroke="#3A2A1A" stroke-width="8" fill="none" stroke-linecap="round"/>' +
  _smile(96, 16, '#8A3A2A') + _blush(88, 30, '#D9A078'),

kalam: '<circle cx="60" cy="60" r="54" fill="#4F8FD8" opacity=".24"/>' +
  _head('kl', '#D4A276', '#AE7E4E') +
  /* the hair */
  '<path d="M20 52q2-44 40-44t40 44q-6-18-16-10-6-14-18-8-14-6-16 8-8-8-16 10z" fill="#D8D2E2"/>' +
  '<path d="M20 52q-4 16 2 26M100 52q4 16-2 26" stroke="#D8D2E2" stroke-width="8" fill="none" stroke-linecap="round"/>' +
  _eyes(64, 15, 9) +
  _smile(90, 22, '#8A3A2A') + _blush(84, 30, '#C99070') +
  '<path d="M114 92V64q0-10-6-15-6 5-6 15v28z" fill="#E9E4D6"/>' +
  '<path d="M108 46l5 8h-10z" fill="#D94F3D"/>' +
  '<path d="M102 92l-5 9h22l-5-9z" fill="#C9C2B0"/>' +
  '<path d="M108 101q-5 9 0 15 5-7 0-15z" fill="#E9A13B"/>',

aryabhata: '<circle cx="60" cy="60" r="54" fill="#7C5CFF" opacity=".2"/>' +
  _head('ar', '#D4A276', '#AE7E4E') +
  _pagri('#F2F0E8', '#E2DCCC', '#7C5CFF') +
  _eyes(62, 15, 9) +
  '<path d="M40 78q20 7 40 0" stroke="#EFE9DD" stroke-width="5" fill="none" stroke-linecap="round"/>' +
  '<path d="M32 80q6 28 28 28t28-28q-12 13-28 13t-28-13z" fill="#EFE9DD"/>' +
  /* the zero */
  '<circle cx="16" cy="98" r="15" fill="none" stroke="#F2C46A" stroke-width="6"/>' +
  _spark([[102, 24, 6], [110, 54, 4], [96, 96, 4]]),

tagore: '<circle cx="60" cy="60" r="54" fill="#C9762A" opacity=".18"/>' +
  _head('tg', '#DFAE7E', '#B98A58') +
  '<path d="M18 48q4-44 42-44t42 44q-18-20-42-20t-42 20z" fill="#E8E4F0"/>' +
  '<path d="M18 48q-4 14 2 22M102 48q4 14-2 22" stroke="#E8E4F0" stroke-width="9" fill="none" stroke-linecap="round"/>' +
  _eyes(60, 15, 9) +
  /* the long white beard fills the lower half */
  '<path d="M22 68q0 50 38 50t38-50q-10 22-38 22t-38-22z" fill="#F2F0E8"/>' +
  '<path d="M36 74q24 8 48 0" stroke="#DCD8CC" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '<path d="M44 96q16 8 32 0" stroke="#DCD8CC" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  _spark([[16, 26, 5]]),

kalpana: '<circle cx="60" cy="60" r="54" fill="#2FA89B" opacity=".22"/>' +
  /* helmet ring */
  '<circle cx="60" cy="62" r="44" fill="#F2F0E8"/>' +
  '<circle cx="60" cy="62" r="36" fill="#B8D8E8" opacity=".45"/>' +
  _head('kp', '#D4A276', '#AE7E4E') +
  '<path d="M24 50q4-38 36-38t36 38q-8-18-36-18t-36 18z" fill="#2F2A3A"/>' +
  '<path d="M24 50q-2 18 6 26M96 50q2 18-6 26" stroke="#2F2A3A" stroke-width="8" fill="none" stroke-linecap="round"/>' +
  _eyes(62, 15, 9.5) + _blush(80, 28) + _smile(88, 18) +
  '<path d="M16 62a44 44 0 0088 0" fill="none" stroke="#FFFFFF" stroke-width="3" opacity=".6"/>' +
  '<circle cx="10" cy="106" r="16" fill="#3A7FD8"/>' +
  '<path d="M-2 100q12 5 24 0M0 110q11 4 20-3" stroke="#4FA336" stroke-width="4" fill="none"/>' +
  _spark([[104, 20, 5], [112, 48, 4]], '#FFFFFF'),

sarojini: '<circle cx="60" cy="60" r="54" fill="#2FA89B" opacity=".2"/>' +
  _head('sr', '#DFAE7E', '#B98A58') +
  '<path d="M18 46q4-38 42-38t42 38q-18-18-42-18t-42 18z" fill="#2F2A3A"/>' +
  '<path d="M102 46q4 22-6 34" stroke="#2F2A3A" stroke-width="9" fill="none" stroke-linecap="round"/>' +
  '<circle cx="60" cy="42" r="4.4" fill="#D94F3D"/>' +
  _eyes(62, 15, 9.5) + _blush(80, 28) + _smile(88, 18) +
  /* the nightingale */
  '<ellipse cx="16" cy="98" rx="16" ry="13" fill="#C9762A"/>' +
  '<circle cx="6" cy="90" r="9" fill="#E0954A"/>' +
  '<path d="M-2 89l-8 3 8 3z" fill="#F2C46A"/>' +
  '<circle cx="4" cy="88" r="2.4" fill="#223"/>' +
  '<path d="M28 104q14 2 16-6" stroke="#C9762A" stroke-width="6" fill="none" stroke-linecap="round"/>' +
  _spark([[102, 30, 5]])
});

/* ------------------------------------------------------------------- packs */

window.IND_AVATAR_PACKS = [
  { id: 'devas',  name: 'Gods & Teachers', note: 'Drawn the way folk painters draw them.',
    ids: ['ganesha','krishna','hanuman','durga','saraswati','shiva','rama','lakshmi','buddha','mahavira','khanda','harmandir'] },
  { id: 'panch',  name: 'Panchatantra',    note: 'The animals who tell the oldest stories.',
    ids: ['pt_lion','pt_jackal','pt_bull','pt_crow','pt_tortoise','pt_mouse','pt_deer','pt_crocodile','pt_monkey','pt_rabbit','pt_heron','pt_elephant'] },
  { id: 'darbar', name: "Akbar's Darbar",  note: 'The cleverest court in the world.',
    ids: ['akbar','birbal','tansen','courtier','guard','royal_elephant'] },
  { id: 'great',  name: 'Great Indians',   note: 'Real people. Every one has an Itihaas card.',
    ids: ['ashoka','chanakya','shivaji','lakshmibai','gandhi','ambedkar','bhagat','kalam','aryabhata','tagore','kalpana','sarojini'] },

  /* Modern India. Real people again — athletes and builders, chosen so a child sees
     women and men, north and south, plains and hills, a wheelchair and a turban, all
     under the same word: champion. No politician is in either pack, deliberately. */
  { id: 'khel',   name: 'India at Play',   note: 'The athletes who made a billion people look up.',
    ids: ['dhyanchand','milkha','kapil','sachin','marykom','sindhu','neeraj','anand','gukesh','avani'] },
  { id: 'naya',   name: 'The Builders',    note: 'Milk, software, rockets and startups — made here.',
    ids: ['kurien','n_murthy','sudha_murty','falguni','ritesh','rocket','unicorn'] },
  { id: 'vigyan', name: 'The Scientists',  note: 'They asked why, and kept asking. Kalam, Kalpana and Aryabhata keep their place among the Great Indians.',
    ids: ['raman','ramanujan','bhabha','sarabhai','jcbose','janaki_ammal','swaminathan','salimali'] },

  /* The epic casts. All 30 PNGs live under app/art and in art-manifest.js.
     Rama, Hanuman and Krishna stay in the Devas pack and are deliberately not repeated
     here — an id in two packs renders twice in the picker. */
  { id: 'ramayana', name: 'The Ramayana',    note: 'Everyone the story is about, not only the ones who win.',
    ids: ['sita','lakshmana','bharata','dasharatha','kaikeyi','ravana','vibhishana','sugriva','jatayu','shabari','vishwamitra','mandodari','valmiki'] },
  { id: 'mahabharata', name: 'The Mahabharata', note: 'One family that could not stop. Nobody here is only a villain.',
    ids: ['draupadi','arjuna','bhima','yudhishthira','nakula','sahadeva','karna','bhishma','drona','dhritarashtra','gandhari','kunti','duryodhana','shakuni','vidura','ekalavya','abhimanyu'] }
];

window.IND_AVATAR_NAMES = {
  ganesha:'Ganesha', krishna:'Krishna', hanuman:'Hanuman', durga:'Durga', saraswati:'Saraswati',
  shiva:'Shiva', rama:'Rama', lakshmi:'Lakshmi', buddha:'The Buddha', mahavira:'Mahavira',
  khanda:'The Khanda', harmandir:'Harmandir Sahib',
  pt_lion:'Pingalaka the Lion', pt_jackal:'Damanaka the Jackal', pt_bull:'Sanjivaka the Bull',
  pt_crow:'Laghupatanaka the Crow', pt_tortoise:'Kambugriva the Tortoise', pt_mouse:'Hiranyaka the Mouse',
  pt_deer:'Chitranga the Deer', pt_crocodile:'The Crocodile', pt_monkey:'The Monkey',
  pt_rabbit:'The Clever Rabbit', pt_heron:'The Heron', pt_elephant:'The Elephant',
  akbar:'Emperor Akbar', birbal:'Birbal', tansen:'Tansen', courtier:'A Courtier',
  guard:'The Palace Guard', royal_elephant:'The Royal Elephant',
  ashoka:'Ashoka', chanakya:'Chanakya', shivaji:'Shivaji', lakshmibai:'Rani Lakshmibai',
  gandhi:'Mohandas Gandhi', ambedkar:'B. R. Ambedkar', bhagat:'Bhagat Singh',
  kalam:'A. P. J. Abdul Kalam', aryabhata:'Aryabhata', tagore:'Rabindranath Tagore',
  kalpana:'Kalpana Chawla', sarojini:'Sarojini Naidu',
  /* India at Play */
  dhyanchand:'Dhyan Chand', milkha:'Milkha Singh', kapil:'Kapil Dev', sachin:'Sachin Tendulkar',
  marykom:'Mary Kom', sindhu:'P. V. Sindhu', neeraj:'Neeraj Chopra', anand:'Viswanathan Anand',
  gukesh:'D. Gukesh', avani:'Avani Lekhara',
  /* The Builders */
  kurien:'Verghese Kurien', n_murthy:'Narayana Murthy', sudha_murty:'Sudha Murty',
  falguni:'Falguni Nayar', ritesh:'Ritesh Agarwal', rocket:'The Rocket', unicorn:'The Unicorn',
  /* The Scientists */
  raman:'C. V. Raman', ramanujan:'Srinivasa Ramanujan', bhabha:'Homi Bhabha',
  sarabhai:'Vikram Sarabhai', jcbose:'Jagadish Chandra Bose', janaki_ammal:'Janaki Ammal',
  swaminathan:'M. S. Swaminathan', salimali:'Salim Ali',
  /* Ramayana. Names are the ones a child will hear at home; no epithets, no titles
     that would rank one character above another. */
  sita:'Sita', lakshmana:'Lakshmana', bharata:'Bharata', dasharatha:'Dasharatha',
  kaikeyi:'Kaikeyi', ravana:'Ravana', vibhishana:'Vibhishana', sugriva:'Sugriva',
  jatayu:'Jatayu', shabari:'Shabari', vishwamitra:'Vishwamitra', mandodari:'Mandodari',
  valmiki:'Valmiki',
  /* Mahabharata */
  draupadi:'Draupadi', arjuna:'Arjuna', bhima:'Bhima', yudhishthira:'Yudhishthira',
  nakula:'Nakula', sahadeva:'Sahadeva', karna:'Karna', bhishma:'Bhishma',
  drona:'Drona', dhritarashtra:'Dhritarashtra', gandhari:'Gandhari', kunti:'Kunti',
  duryodhana:'Duryodhana', shakuni:'Shakuni', vidura:'Vidura', ekalavya:'Ekalavya',
  abhimanyu:'Abhimanyu'
};


/* ---------------------------------------------------------------- RARITY */
/* Tiers, labels, colours and prices lifted from Bizzing Bee's RAR table so the
   two apps grade collections identically:
     free #7B8794 · rare #3D7DF0 · epic #B14FC4 · legendary #F0B429

   NOTE (docs/05): tiering sacred figures makes them read as collectible loot
   and implies a ranking between deities. Bizzing Bee already does this, so we
   match it for consistency — but the deity pack is worth a second look before
   launch, and IND_RARITY_SACRED_FLAT below lets you switch that pack to a
   single uniform grade without touching anything else. */
window.IND_RARITY = {
  free:      { label: 'Starter',   c: '#7B8794', price: 0,   sell: 0 },
  rare:      { label: 'Rare',      c: '#3D7DF0', price: 120, sell: 60 },
  epic:      { label: 'Epic',      c: '#B14FC4', price: 250, sell: 125 },
  legendary: { label: 'Legendary', c: '#F0B429', price: 500, sell: 250 }
};
window.IND_RARITY_SACRED_FLAT = false;

window.IND_AVATAR_RARITY = {
  /* Devas — matched to Bizzing Bee's own grading of the same figures */
  ganesha:'legendary', krishna:'legendary', shiva:'legendary', durga:'legendary',
  saraswati:'legendary', rama:'legendary', hanuman:'epic', lakshmi:'epic',
  buddha:'legendary', mahavira:'epic', khanda:'legendary', harmandir:'epic',
  /* Panchatantra — the tricksters and the leads grade higher */
  pt_lion:'epic', pt_jackal:'rare', pt_bull:'free', pt_crow:'rare',
  pt_tortoise:'rare', pt_mouse:'free', pt_deer:'rare', pt_crocodile:'epic',
  pt_monkey:'epic', pt_rabbit:'legendary', pt_heron:'free', pt_elephant:'rare',
  /* Darbar */
  akbar:'legendary', birbal:'legendary', tansen:'epic', courtier:'free',
  guard:'free', royal_elephant:'epic',
  /* Great Indians */
  ashoka:'legendary', chanakya:'epic', shivaji:'legendary', lakshmibai:'legendary',
  gandhi:'legendary', ambedkar:'legendary', bhagat:'epic', kalam:'legendary',
  aryabhata:'epic', tagore:'epic', kalpana:'epic', sarojini:'rare',
  /* Ramayana — graded by how much of the story rests on them, NOT by whether the
     story approves of them. Ravana is legendary because he carries half the epic;
     Kaikeyi is epic for the same reason. Nothing here grades a person as worse. */
  sita:'legendary', ravana:'legendary', lakshmana:'epic', kaikeyi:'epic',
  jatayu:'epic', vishwamitra:'epic', valmiki:'epic', bharata:'rare',
  dasharatha:'rare', vibhishana:'rare', sugriva:'rare', shabari:'rare',
  mandodari:'rare',
  /* Mahabharata */
  draupadi:'legendary', arjuna:'legendary', karna:'legendary', bhishma:'legendary',
  duryodhana:'legendary', bhima:'epic', yudhishthira:'epic', drona:'epic',
  gandhari:'epic', kunti:'epic', shakuni:'epic', ekalavya:'epic',
  nakula:'rare', sahadeva:'rare', dhritarashtra:'rare', vidura:'rare',
  abhimanyu:'rare',
  /* Mascots — always yours */
  gattu:'free', gattu_happy:'free', gattu_think:'free', gattu_wow:'free',
  mithu:'free', vismriti:'rare'
};

window.IND_RARITY_OF = function (id) {
  var r = window.IND_AVATAR_RARITY[id] || 'free';
  if (window.IND_RARITY_SACRED_FLAT) {
    var devas = (window.IND_AVATAR_PACKS || []).filter(function (p) { return p.id === 'devas'; })[0];
    if (devas && devas.ids.indexOf(id) >= 0) return 'epic';
  }
  return r;
};

window.IND_AVATAR = function (id, size) {
  var art = window.IND_AVATAR_ART[id];
  if (!art) return '';
  return '<svg class="av" viewBox="0 0 120 120" width="' + (size || 64) + '" height="' + (size || 64) +
    '" xmlns="http://www.w3.org/2000/svg">' + art + '</svg>';
};
