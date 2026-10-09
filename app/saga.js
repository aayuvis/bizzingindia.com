/* Bizzing India — GATTU AUR VISMRITI, the saga (games spec §2.2; docs/32-games-contract.md).

   A told story (🪔 Katha, on every scene) that strings the Play games into one journey. Act 1,
   The Fading Village, is data-saga.js: an invented village, Amwa, where the grey mist — Vismriti,
   the Forgetting, impersonal, never a villain, never sacred — has settled on five ordinary
   things. A chapter is a short comic-panel scene (Gattu and Mithu, the village in reported
   speech), then ONE round of a real game, scoped by the chapter's opts, then the place colours
   in again — or the mist thins a little and Gattu asks for one more telling.

     #/saga        the saga map: Act 1's places, grey until restored, colour coming back
     #/saga/<n>    chapter n: scene → round → restored (or "One more telling?")

   THE RULES IT KEEPS
     · RESTORE = the skill shown: ≥ 50% first-try right at the chosen level (the owner's rule),
       over at least MIN_ASKED judged items. A retry after a miss never counts. Below that the
       mist thins (kept, never lost) and nothing is taken away.
     · PAY, through the app's one earn() only (games spec §1.2): `answer` 1 per first-try right,
       at most 10 a round and once per item a day; `stop` 5 once per chapter per child when it is
       restored. Nothing for watching a scene, finishing, replaying or losing. No second currency.
     · The round's evidence is the engine's own reports (opts.answer). An engine that has not
       learned to report yet is read from done({asked, firstTryRight|score}); one that reports
       neither is said plainly — the round could not tell, so nothing is restored on a guess.
     · G5: the act's text needs the named reviewer's sign-off (acts[].review). Until then the
       saga opens in tester mode only — its Play card is hidden and #/saga says why.
     · No lives, no streaks, no countdowns of its own; Calm and reduced motion pass through to
       the engine; every control is a button or a link (keyboard AND touch), ≥ 44 px.

   The host (app.js) hands it, through init(): state() — this child's S.saga — save, toast, esc,
   icon, tester, earn, error, band, calm, reduced. It touches no storage itself. */
(function (W, D) {
  'use strict';
  if (!W || !D) return;

  var H = null;
  var MIN_ASKED = 3, PAY_CAP = 10, RESTORE = 0.5, OFFER = 0.8, THIN_MAX = 3;
  /* what a round's engines draw on beyond the games group (the 'game' route waits for all of them) */
  var ENGINE_GROUPS = ['content', 'voice', 'map', 'bhasha'];

  /* --------------------------------------------------------------- the data */
  function data() { return W.IND_SAGA || null; }
  function act() { var d = data(); return d && d.acts && d.acts[0] || null; }
  function chapters() { var d = data(); return (d && d.chapters) || []; }
  function chap(n) {
    var k = parseInt(String(n == null ? '' : n), 10);
    if (!(k >= 1) || String(k) !== String(n).trim()) return null;
    return chapters().filter(function (c) { return c.n === k; })[0] || null;
  }
  function scriptOf(c) { return c && (W.IND_SAGA_SCRIPT || {})[c.script] || null; }
  function gameById(id) { return (W.IND_GAMES || []).filter(function (g) { return g.id === id; })[0] || null; }
  /* the chapter plays `engine`; `retarget` only when `engine` is not on this device at all */
  function engineOf(c) {
    var g = gameById(c.engine);
    if (g && typeof g.engine === 'function') return g;
    g = c.retarget ? gameById(c.retarget) : null;
    return g && typeof g.engine === 'function' ? g : null;
  }

  /* --------------------------------------------------------------- the gate (G5) */
  function tester() {
    if (H) return !!H.tester();
    try { return !!(W.IND_STORE && W.IND_STORE.loadDevice('tester', false) === true); } catch (e) { return false; }
  }
  function reviewed() { var a = act(), r = a && a.review; return !!(r && r.status === 'reviewed' && r.by); }
  /* OPENED BY THE OWNER BEFORE REVIEW (9 Oct 2026, "open them all to everyone now, like the gita"):
     the act's `open`, the publisher's decision — never a sign-off; every saga page then says so */
  function ownerOpened() { var a = act(), o = a && a.open; return !!(o && o.by); }
  function isOpen() { return tester() || reviewed() || ownerOpened(); }
  function draftNote() {
    if (reviewed()) return '';
    if (ownerOpened() && !tester()) return '<div class="sg-draft" role="note"><b>Not yet checked by its reviewer.</b> Gattu and Mithu are made up, ' +
      'and every round is one of the app\u2019s own games — but the person who reads what this app tells children has not read this story yet. ' +
      'The family who made this app opened it anyway. Ask a grown-up if anything seems wrong.</div>';
    return '<div class="sg-draft" role="note"><b>Tester mode.</b> This act has not been signed off by its reviewer yet; children do not see it.</div>';
  }

  /* --------------------------------------------------------------- this child's record
     S.saga = { done:{n:day}, paid:{n:1}, thin:{n:0..3}, lvl:1..5, seen:{n:1}, pd:{d, ids{}} } */
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function rec() {
    var s = H.state();
    s.done = s.done || {}; s.paid = s.paid || {}; s.thin = s.thin || {}; s.seen = s.seen || {};
    if (!(s.lvl >= 1 && s.lvl <= 5)) s.lvl = 1;
    if (!s.pd || s.pd.d !== today()) s.pd = { d: today(), ids: {} };
    return s;
  }
  function restored(n) { return !!rec().done[n]; }
  function unlocked(c) { return c.n === 1 || restored(c.n - 1); }
  function nextChapter() {
    var cs = chapters();
    for (var i = 0; i < cs.length; i++) if (!restored(cs[i].n)) return cs[i];
    return null;
  }

  /* --------------------------------------------------------------- small helpers */
  function esc(s) { return H ? H.esc(s) : String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function icon(n, s) { return H && H.icon ? H.icon(n, s) : ''; }
  function sfx(k) { if (W.IND_SFX) try { W.IND_SFX.play(k); } catch (e) {} }
  function reduced() {
    if (H && H.reduced && H.reduced()) return true;
    return !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function calm() { return !!(H && H.calm && H.calm()); }
  var BADGE = '<span class="badge katha sg-badge">🪔 Katha · a story as it is told</span>';

  /* --------------------------------------------------------------- the places of Amwa
     Drawn by the app, not painted: an invented village, no boundary, no lettering in the art.
     x, y are percent of the map; `label` is the short name on the pin. */
  var PLACE = {
    1: { x: 19, y: 63, label: 'The doorways' },
    2: { x: 80, y: 79, label: 'The bus' },
    3: { x: 51, y: 52, label: 'The shop' },
    4: { x: 80, y: 27, label: 'The mango tree' },
    5: { x: 33, y: 23, label: 'The courtyard' }
  };
  function placeOf(c) { return PLACE[c.n] || { x: 50, y: 50, label: c.title }; }

  /* each place's drawing, in its own group so the mist can sit on it and lift off it */
  var ART = {
    1: function () {     /* a row of houses, a rangoli at every door */
      var h = '';
      [[96, 268], [146, 262], [196, 270], [246, 264]].forEach(function (p, i) {
        var x = p[0], y = p[1];
        h += '<rect x="' + (x - 22) + '" y="' + (y - 34) + '" width="44" height="40" rx="3" fill="' + (i % 2 ? '#f0dcb4' : '#f6e7c8') + '" stroke="#8a5a2b" stroke-width="1.5"/>' +
          '<path d="M' + (x - 28) + ' ' + (y - 32) + ' L' + x + ' ' + (y - 56) + ' L' + (x + 28) + ' ' + (y - 32) + ' Z" fill="#b5532f" stroke="#7a3318" stroke-width="1.5"/>' +
          '<rect x="' + (x - 7) + '" y="' + (y - 18) + '" width="14" height="24" rx="2" fill="#6b3a1f"/>' +
          '<g transform="translate(' + x + ' ' + (y + 18) + ')">' +
            '<circle r="10" fill="#fff6e0" stroke="#e0452d" stroke-width="2"/>' +
            '<circle r="5" fill="#f2c14e"/><circle cx="-8" r="2.4" fill="#3f8f5a"/><circle cx="8" r="2.4" fill="#3f8f5a"/>' +
            '<circle cy="-8" r="2.4" fill="#5b3fd6"/><circle cy="8" r="2.4" fill="#5b3fd6"/></g>';
      });
      return h;
    },
    2: function () {     /* the turning, and a bus with a blank board */
      return '<g transform="translate(578 336)">' +
        '<rect x="0" y="0" width="118" height="50" rx="9" fill="#e8a33d" stroke="#8a5a2b" stroke-width="2"/>' +
        '<rect x="10" y="-12" width="70" height="13" rx="3" fill="#fbf7ec" stroke="#8a5a2b" stroke-width="1.5"/>' +
        [12, 36, 60, 84].map(function (x) { return '<rect x="' + x + '" y="9" width="18" height="16" rx="2" fill="#cfe6f2" stroke="#5d7f91" stroke-width="1"/>'; }).join('') +
        '<rect x="0" y="32" width="118" height="5" fill="#c65b2c"/>' +
        '<circle cx="26" cy="52" r="9" fill="#2e2a3a"/><circle cx="26" cy="52" r="3.5" fill="#9c97ad"/>' +
        '<circle cx="94" cy="52" r="9" fill="#2e2a3a"/><circle cx="94" cy="52" r="3.5" fill="#9c97ad"/></g>';
    },
    3: function () {     /* the shop at the corner, with everything outside it */
      return '<g transform="translate(372 214)">' +
        '<rect x="0" y="12" width="100" height="62" rx="3" fill="#f3e3c3" stroke="#8a5a2b" stroke-width="1.5"/>' +
        [0, 1, 2, 3, 4].map(function (i) { return '<path d="M' + (i * 20 - 4) + ' 6 h20 v14 a10 7 0 0 1 -20 0 z" fill="' + (i % 2 ? '#fbf7ec' : '#d94f3d') + '" stroke="#8a5a2b" stroke-width="1"/>'; }).join('') +
        '<rect x="34" y="36" width="30" height="38" fill="#6b3a1f"/>' +
        '<path d="M6 92 l8 -10 l8 10 l-8 10 z" fill="#5b3fd6"/><path d="M78 90 l7 -9 l7 9 l-7 9 z" fill="#1fa971"/>' +
        [12, 26, 40].map(function (x) { return '<ellipse cx="' + x + '" cy="80" rx="5" ry="3" fill="#c65b2c"/><path d="M' + x + ' 76 q2 -5 0 -8 q-2 3 0 8" fill="#f59e0b"/>'; }).join('') +
        '<circle cx="62" cy="84" r="6" fill="#f2c14e"/><circle cx="70" cy="86" r="5" fill="#f59e0b"/>' +
        '<rect x="88" y="66" width="12" height="14" rx="2" fill="#7fb3d5" stroke="#5d7f91"/></g>';
    },
    4: function () {     /* the mango tree, where the telling happens */
      return '<g transform="translate(640 132)">' +
        '<rect x="-9" y="10" width="18" height="70" rx="5" fill="#7a4a25"/>' +
        '<ellipse cx="0" cy="-6" rx="78" ry="54" fill="#3f7d3a"/>' +
        '<ellipse cx="-34" cy="-20" rx="38" ry="28" fill="#4f9a45"/><ellipse cx="30" cy="-24" rx="40" ry="30" fill="#4f9a45"/>' +
        '<ellipse cx="0" cy="12" rx="44" ry="24" fill="#468c3f"/>' +
        [[-40, -2], [-12, -30], [22, -6], [44, -30], [-50, -28], [8, 18]].map(function (p) {
          return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="5" ry="7" fill="#f2b33d"/>'; }).join('') +
        '<ellipse cx="0" cy="86" rx="46" ry="9" fill="#d9a35b" stroke="#a5713a"/></g>';
    },
    5: function () {     /* the courtyard, its lamps waiting */
      var lamps = '';
      for (var i = 0; i < 10; i++) {
        var a = i / 10 * Math.PI * 2, x = 264 + Math.cos(a) * 92, y = 108 + Math.sin(a) * 50;
        lamps += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="6" ry="3.4" fill="#c65b2c"/>' +
          '<path d="M' + x.toFixed(1) + ' ' + (y - 3).toFixed(1) + ' q3 -6 0 -10 q-3 4 0 10" fill="#f59e0b"/>';
      }
      return '<ellipse cx="264" cy="108" rx="112" ry="64" fill="#f3e0b5" stroke="#a5713a" stroke-width="2"/>' +
        '<g transform="translate(264 108)">' +
          '<circle r="26" fill="#fff6e0" stroke="#e0452d" stroke-width="3"/>' +
          [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { var a = k / 8 * Math.PI * 2;
            return '<circle cx="' + (Math.cos(a) * 18).toFixed(1) + '" cy="' + (Math.sin(a) * 18).toFixed(1) + '" r="4.5" fill="' + (k % 2 ? '#5b3fd6' : '#1fa971') + '"/>'; }).join('') +
          '<circle r="8" fill="#f2c14e"/></g>' + lamps;
    }
  };
  /* the village the places sit in: fields, lanes, a well with a chip out of the rim, a grove */
  function groundSVG() {
    var trees = [[40, 60], [80, 120], [470, 40], [520, 70], [740, 420], [36, 420], [300, 440], [500, 430]].map(function (p) {
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="20" fill="#5f9a4c"/><circle cx="' + (p[0] + 12) + '" cy="' + (p[1] - 8) + '" r="14" fill="#6fae58"/>';
    }).join('');
    return '<rect x="0" y="0" width="800" height="480" rx="0" fill="#ecdcae"/>' +
      '<path d="M0 360 C120 330 200 400 330 380 S560 300 800 330 L800 480 L0 480 Z" fill="#d9cf8f"/>' +
      '<path d="M0 0 H800 V40 C640 70 520 20 400 50 S120 30 0 70 Z" fill="#cbd79a"/>' +
      '<path d="M800 400 C700 400 640 360 560 330 S420 270 330 300 S180 330 120 300" fill="none" stroke="#d1b07a" stroke-width="26" stroke-linecap="round"/>' +
      '<path d="M420 280 C430 220 470 170 560 150" fill="none" stroke="#d1b07a" stroke-width="16" stroke-linecap="round"/>' +
      '<path d="M330 300 C300 230 300 190 270 170" fill="none" stroke="#d1b07a" stroke-width="16" stroke-linecap="round"/>' +
      '<g transform="translate(300 360)"><ellipse rx="20" ry="9" fill="#8d8478"/><ellipse rx="13" ry="5" fill="#4b5e73"/>' +
        '<path d="M14 -6 l6 3 l-3 4 z" fill="#ecdcae"/></g>' +
      trees;
  }
  /* the mist on a place: soft grey, thinner with each telling, gone once it is told */
  function fogSVG(n, cls) {
    var p = PLACE[n], cx = p.x * 8, cy = p.y * 4.8;
    return '<g class="sg-fog' + cls + '" data-fog="' + n + '" filter="url(#sgblur)">' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="118" ry="70" fill="#b9b6c8"/>' +
      '<ellipse cx="' + (cx - 64) + '" cy="' + (cy + 18) + '" rx="70" ry="44" fill="#c9c6d6"/>' +
      '<ellipse cx="' + (cx + 70) + '" cy="' + (cy - 14) + '" rx="74" ry="46" fill="#c4c1d2"/></g>';
  }
  function mapSVG(lift, vb, label) {
    var cs = chapters(), r = rec(), done = cs.filter(function (c) { return restored(c.n); }).length;
    var sat = (0.25 + 0.75 * (cs.length ? done / cs.length : 0)).toFixed(2);
    var route = cs.map(function (c) { var p = placeOf(c); return (p.x * 8) + ' ' + (p.y * 4.8); });
    var places = '', fogs = '';
    cs.forEach(function (c) {
      var lit = restored(c.n) && c.n !== lift, t = Math.min(THIN_MAX, r.thin[c.n] || 0);
      places += '<g class="sg-pl' + (lit ? '' : ' mist t' + t) + '" data-pl="' + c.n + '">' + (ART[c.n] ? ART[c.n]() : '') + '</g>';
      fogs += fogSVG(c.n, lit ? ' gone' : ' t' + t);
    });
    return '<svg class="sg-svg" viewBox="' + (vb || '0 0 800 480') + '" preserveAspectRatio="xMidYMid slice" role="img" ' +
      'aria-label="' + esc(label || 'A drawn map of Amwa, an invented village: ' + done + ' of ' + cs.length + ' places remembered') + '">' +
      '<defs><filter id="sgblur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter></defs>' +
      '<g class="sg-ground" style="filter:saturate(' + sat + ')">' + groundSVG() + '</g>' +
      (route.length > 1 ? '<path class="sg-route" d="M' + route.join(' L') + '" fill="none" stroke="#8a5a2b" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" opacity=".55"/>' : '') +
      places + fogs + '</svg>';
  }

  /* --------------------------------------------------------------- THE MAP (#/saga) */
  var lift = null;          /* the chapter just restored: its colour comes back on the map */
  function pins() {
    var nx = nextChapter();
    return chapters().map(function (c) {
      var p = placeOf(c), done = restored(c.n), open = unlocked(c), now = nx && nx.n === c.n;
      var cls = 'sg-pin' + (done ? ' done' : '') + (now ? ' now' : '') + (open ? '' : ' locked');
      var lab = '<span class="sg-pinlab">' + esc(p.label) + '</span>';
      var style = ' style="left:' + p.x + '%;top:' + p.y + '%"';
      var aria = 'Chapter ' + c.n + ': ' + c.title + (done ? ' — remembered' : open ? ' — still in the mist' : ' — opens after chapter ' + (c.n - 1));
      /* a lock says how it opens, on the pin itself */
      if (!open) return '<button type="button" class="' + cls + '"' + style + ' data-sg="locked" data-n="' + c.n + '" aria-label="' + esc(aria) + '">' +
        '<span class="sg-pindot">' + (icon('lock', 18) || '·') + '</span><span class="sg-pinlab">' + esc(p.label) + ' · after ' + (c.n - 1) + '</span></button>';
      return '<a class="' + cls + '"' + style + ' href="#/saga/' + c.n + '" aria-label="' + esc(aria) + '">' +
        '<span class="sg-pindot">' + (done ? '✓' : c.n) + '</span>' + lab + '</a>';
    }).join('');
  }
  function mapCard(inHost) {
    var a = act(), cs = chapters(), nx = nextChapter();
    var done = cs.filter(function (c) { return restored(c.n); }).length;
    var nxt = nx
      ? '<div class="card sg-next">' +
          '<img class="sg-face" src="art/gattu.png" alt="" width="64" height="64">' +
          '<div class="sg-nextt"><span class="mono">Next telling · ' + nx.n + ' of ' + cs.length + '</span>' +
          '<b>' + esc(nx.title) + '</b><p class="tiny">' + esc(nx.blurb) + '</p></div>' +
          '<a class="btn sg-go" href="#/saga/' + nx.n + '">' + (rec().thin[nx.n] ? 'One more telling' : 'Begin') + ' →</a></div>'
      : '<div class="card sg-next sg-whole">' +
          '<img class="sg-face" src="art/mithu.png" alt="" width="64" height="64">' +
          '<div class="sg-nextt"><span class="mono">Act ' + (a ? a.n : 1) + ' · told</span>' +
          '<b>Amwa remembers.</b><p class="tiny">' + esc(a && a.recovers || '') + ' Tap any place to tell it again.</p></div></div>';
    /* the chapters as a list beside the map: the same doors, in order, for a keyboard or a quick look */
    var list = '<ol class="sg-list">' + cs.map(function (c) {
      var d = restored(c.n), o = unlocked(c), st = d ? 'remembered' : o ? (rec().thin[c.n] ? 'the mist is thinner' : 'in the mist') : 'opens after ' + (c.n - 1);
      var inner = '<span class="sg-ln' + (d ? ' done' : '') + '">' + (d ? '✓' : c.n) + '</span><span class="sg-lt"><b>' + esc(c.title) + '</b><i>' + esc(st) + '</i></span>';
      return '<li>' + (o ? '<a class="sg-li" href="#/saga/' + c.n + '">' + inner + '</a>'
                         : '<button type="button" class="sg-li locked" data-sg="locked" data-n="' + c.n + '">' + inner + '</button>') + '</li>';
    }).join('') + '</ol>';
    return '<div class="sg-mapwrap' + (inHost ? ' inhost' : '') + '">' +
      '<div class="sg-maphead"><div><span class="mono">Gattu aur Vismriti · Act ' + (a ? a.n : 1) + ' · ' + done + ' of ' + cs.length + ' remembered</span>' +
        '<h2 class="sg-h">' + esc(a ? a.title : 'The saga') + '</h2></div>' + BADGE + '</div>' +
      '<div class="sg-mapgrid"><div class="sg-mapcol">' +
        '<div class="sg-map" data-done="' + done + '">' + mapSVG(lift) + pins() + '</div>' +
        '<p class="tiny muted sg-mapnote">Amwa is an invented village. ' + done + ' of ' + cs.length + ' places remembered — ' +
          'each comes back when you show the skill its game asks for.</p></div>' +
        '<div class="sg-side">' + nxt + list + '</div></div></div>';
  }
  function holdCard() {
    return '<div class="card sg-hold"><span class="mono">Gattu aur Vismriti · the story</span>' +
      '<h1>Being read before it opens</h1>' +
      '<p>Gattu and Mithu’s journey is written — the first act, in a village called Amwa. A person who looks after ' +
      'what this app tells children is reading it first. It opens here the day they have.</p>' +
      '<button class="btn" data-act="go" data-v="play">Back to Play →</button></div>';
  }
  function mapScreen() {
    if (!data()) return '<div class="card"><h1>The saga</h1><p>The story did not load. It may be the connection — once it has loaded once, it works offline.</p>' +
      '<button class="btn" data-act="go" data-v="play">Back to Play</button></div>';
    if (!isOpen()) return holdCard();
    return '<button class="backlink" data-act="go" data-v="play">' + icon('back', 18) + ' Play</button>' +
      draftNote() +
      '<div id="sg-root" class="sg">' + mapCard(false) + '</div>';
  }

  /* --------------------------------------------------------------- A CHAPTER (#/saga/<n>) */
  var run = null;           /* { n, phase, i, rights, asked, reports, ids, paidN, coins, out } */
  function freshRun(n) { return { n: n, phase: 'scene', i: 0, rights: 0, asked: 0, reports: 0, ids: {}, paidN: 0, coins: 0, out: null }; }

  var FACE = { gattu: { intro: 'art/gattu.png', win: 'art/gattu_wow.png', lose: 'art/gattu_think.png' }, mithu: 'art/mithu.png' };
  function face(who, mood) {
    var src = who === 'gattu' ? FACE.gattu[mood] || FACE.gattu.intro : FACE.mithu;
    return '<img class="sg-face" src="' + src + '" alt="" width="56" height="56">';
  }
  /* a beat is a panel: Gattu or Mithu speaking, or a village sentence coming apart in the mist
     (Vismriti never speaks to the child, never has a face — it is only the words thinning) */
  function panel(b, k, total, mood, cls) {
    var who = b[0], line = String(b[1] || '');
    if (who === 'vismriti') {
      var bits = line.split('…').map(function (s) { return s.trim(); }).filter(Boolean);
      return '<figure class="sg-panel sg-fogpanel' + cls + '" role="group" aria-label="Panel ' + (k + 1) + ' of ' + total + ': the mist">' +
        '<p class="sg-fade">' + bits.map(function (s, j) {
          return '<span style="opacity:' + Math.max(0.28, 1 - j * 0.22).toFixed(2) + '">' + esc(s) + '…</span>'; }).join(' ') + '</p>' +
        '<figcaption class="tiny">In the mist: a sentence in the village, coming apart</figcaption></figure>';
    }
    var name = who === 'gattu' ? 'Gattu' : who === 'mithu' ? 'Mithu' : '';
    return '<figure class="sg-panel who-' + esc(who) + cls + '" role="group" aria-label="Panel ' + (k + 1) + ' of ' + total + (name ? ': ' + name : '') + '">' +
      face(who, mood) + '<figcaption><b>' + esc(name) + '</b><p>' + esc(line) + '</p></figcaption></figure>';
  }
  function comic(beats, i, mood) {
    return '<div class="sg-comic" data-i="' + i + '" aria-live="polite">' + beats.map(function (b, k) {
      if (k > i) return '<figure class="sg-panel ahead" aria-hidden="true"><svg class="sg-cloud" viewBox="0 0 64 32" width="64" height="32"><path d="M14 28a10 10 0 0 1 1-20 14 14 0 0 1 26-2 11 11 0 0 1 9 22z" fill="currentColor"/></svg></figure>';
      return panel(b, k, beats.length, mood, k === i ? ' now' : ' past');
    }).join('') + '</div>';
  }
  /* the chapter's own place, cut from the village map — in its mist, or in colour once told */
  function vignette(c, liftN) {
    var p = placeOf(c), w = 400, h = 150;
    var x = Math.max(0, Math.min(800 - w, p.x * 8 - w / 2)), y = Math.max(0, Math.min(480 - h, p.y * 4.8 - h / 2));
    return '<div class="sg-vig">' + mapSVG(liftN || null, x + ' ' + y + ' ' + w + ' ' + h,
      p.label + (restored(c.n) ? ', remembered' : ', in the mist')) + '<span class="sg-viglab">' + esc(p.label) + '</span></div>';
  }
  function headOf(c) {
    return '<button class="backlink" data-act="go" data-v="saga">' + icon('back', 18) + ' The saga map</button>' +
      '<div class="sg-headrow"><div class="sg-head"><span class="mono">Gattu aur Vismriti · chapter ' + c.n + ' of ' + chapters().length + '</span>' +
      '<h1 class="sg-h">' + esc(c.title) + '</h1>' + BADGE + '</div>' + vignette(c) + '</div>';
  }
  function lvlChip() {
    var L = rec().lvl, out = '';
    for (var k = 1; k <= 5; k++) out += '<button type="button" class="pill sg-lv' + (k === L ? ' on' : '') + '" data-sg="lvl" data-l="' + k + '" aria-pressed="' + (k === L) + '">' + k + '</button>';
    return '<div class="sg-lvl" role="group" aria-label="How hard: level 1 to 5"><span class="tiny muted">How hard?</span>' + out + '</div>';
  }
  function body(c) {
    var sc = scriptOf(c) || { intro: [], win: [], lose: [] }, R = run;
    if (R.phase === 'scene') {
      var beats = sc.intro || [], last = R.i >= beats.length - 1;
      return '<p class="sg-blurb">' + esc(c.blurb) + '</p>' + comic(beats, R.i, 'intro') +
        '<div class="sg-act">' +
          '<button type="button" class="btn ghost" data-sg="prev"' + (R.i ? '' : ' disabled') + '>‹ Back</button>' +
          '<span class="tiny muted sg-of">' + (R.i + 1) + ' / ' + beats.length + '</span>' +
          (last ? '<button type="button" class="btn sg-primary" data-sg="ready">Your turn →</button>'
                : '<button type="button" class="btn sg-primary" data-sg="next">Next ›</button>') +
          (last ? '' : '<button type="button" class="btn ghost sg-skip" data-sg="ready">Skip to the round</button>') + '</div>';
    }
    if (R.phase === 'ready') {
      var g = engineOf(c);
      return '<div class="card sg-ready">' + face('gattu', 'intro') +
        '<div><b class="sg-say">' + (rec().thin[c.n] ? 'One more telling?' : 'Your turn. Show the village, and it will remember.') + '</b>' +
        '<p><b>What you practise:</b> ' + esc(c.skill || '') + '</p>' +
        (g ? '<p class="tiny muted">One round of <b>' + esc(g.name) + '</b>. Half or more right on the first try brings the colour back. ' +
              'A miss costs nothing — the mist only thins.</p>'
           : '<p class="tiny">This chapter’s game has not arrived on this device yet. It will be here after the next update.</p>') +
        '</div></div>' +
        (g ? lvlChip() : '') +
        '<div class="sg-act">' + (g ? '<button type="button" class="btn sg-primary" data-sg="begin">Play the round →</button>' : '') +
          '<button type="button" class="btn ghost" data-sg="scene">The scene again</button></div>';
    }
    if (R.phase === 'play') {
      return '<div class="sg-playbar"><span class="tiny"><b>' + esc(c.skill || '') + '</b></span>' +
        '<span class="sg-count" aria-live="polite">' + R.rights + ' right first try</span></div>' +
        '<div class="sg-host" id="sg-host"></div>';
    }
    /* the result: restored, or one more telling */
    var o = R.out || {}, won = !!o.restored;
    var p = placeOf(c);
    var line = o.src === 'none'
      ? 'This round could not tell the story what you got right, so the mist stays where it is. It will be able to soon.'
      : 'You got <b>' + o.rights + ' of ' + o.asked + '</b> right on the first try' + (o.asked < MIN_ASKED ? ' — too few to tell' : '') + '.';
    var mini = '<div class="sg-mini' + (won ? ' lifting' : '') + '">' + mapSVG(won ? c.n : null) + '</div>';
    var beats = won ? (sc.win || []) : (sc.lose || []);
    return '<div class="card sg-result ' + (won ? 'won' : 'again') + '" role="status">' + mini +
      '<div class="sg-rtext"><span class="mono">' + esc(p.label) + '</span>' +
      '<h2 class="sg-h">' + (won ? 'The colour comes back.' : 'The mist thins a little.') + '</h2>' +
      '<p>' + line + '</p>' +
      (o.coins ? '<p class="tiny">' + icon('coin', 14) + ' +' + o.coins + ' coins' + (o.stop ? ' · ' + o.stop + ' for bringing it back' : '') + '</p>' : '') +
      (o.offer ? '<p class="tiny">That was easy for you. <button type="button" class="pill" data-sg="up">Try level ' + (o.level + 1) + ' next time</button></p>' : '') +
      (o.dropped ? '<p class="tiny muted">Next time is level ' + rec().lvl + ' — a gentler telling.</p>' : '') +
      '</div></div>' +
      '<div class="sg-strip">' + beats.map(function (b, k) { return panel(b, k, beats.length, won ? 'win' : 'lose', ' past'); }).join('') +
        (won ? '' : panel(['gattu', 'One more telling?'], beats.length, beats.length + 1, 'lose', ' now')) + '</div>' +
      '<div class="sg-act">' + (won
        ? (chap(c.n + 1) ? '<a class="btn sg-primary" href="#/saga/' + (c.n + 1) + '">Next chapter →</a>' : '') +
          '<button type="button" class="btn' + (chap(c.n + 1) ? ' ghost' : '') + '" data-act="go" data-v="saga">See it on the map</button>'
        : '<button type="button" class="btn sg-primary" data-sg="again">One more telling</button>' +
          '<button type="button" class="btn ghost" data-act="go" data-v="saga">The saga map</button>') + '</div>';
  }
  function chapterScreen(arg) {
    if (!data()) return mapScreen();
    var c = chap(arg);
    if (!c) return H.error('That chapter is not in the saga — the map has every one.');
    if (!isOpen()) return holdCard();
    if (!unlocked(c)) {
      var before = chap(c.n - 1);
      return headOf(c) + '<div class="card sg-hold"><p>This place is still deep in the mist. It opens once <b>' +
        esc(before ? before.title : 'the chapter before it') + '</b> is remembered.</p>' +
        '<a class="btn" href="#/saga/' + (c.n - 1) + '">Go to chapter ' + (c.n - 1) + ' →</a></div>';
    }
    /* a new visit is a new telling: a result stays only while the child is still on it (a repaint);
       arriving from anywhere else — the map, Next chapter, a link — starts the chapter afresh */
    var arriving = !/^#\/saga\//.test(W.location.hash) || W.location.hash.split('/')[2] !== String(c.n);
    if (!run || run.n !== c.n || (arriving && run.phase === 'result')) run = freshRun(c.n);
    if (run.phase === 'play') run.phase = 'ready';   /* a repaint mid-round starts the round again, never half of one */
    return '<div id="sg-root" class="sg sg-ch" data-n="' + c.n + '" data-phase="' + run.phase + '">' + headOf(c) + draftNote() +
      '<div class="sg-body sg-page">' + body(c) + '</div></div>';
  }

  /* --------------------------------------------------------------- the round */
  var td = null, obs = null;
  function stopRound() {
    if (obs) { try { obs.disconnect(); } catch (e) {} obs = null; }
    var t = td; td = null;
    if (typeof t === 'function') { try { t(); } catch (e) {} }
    else if (t && t.destroy) { try { t.destroy(); } catch (e) {} }
  }
  function paintCount() {
    var el = D.querySelector('#sg-root .sg-count');
    if (el && run) el.textContent = run.rights + ' right first try';
  }
  function onAnswer(r) {
    var R = run;
    if (!R || R.phase !== 'play' || !r) return;
    var g = R.game || {}, id = (g.id || 'g') + ':' + (r.id != null ? String(r.id) : '#' + R.asked);
    if (R.ids[id]) return;              /* one report per item: a retry after a miss never counts */
    R.ids[id] = 1; R.reports++; R.asked++;
    var ok = !!r.right && r.firstTry !== false;
    if (ok) R.rights++;
    sfx(ok ? 'right' : 'wrong');
    /* PAY: answer 1 per first-try right, ≤ 10 a round, once per item a day — the one wallet */
    if (ok && R.paidN < PAY_CAP) {
      var s = rec();
      if (!s.pd.ids[id]) {
        s.pd.ids[id] = 1; H.save();
        var got = H.earn('answer', 'the saga') || 0;
        if (got) { R.paidN++; R.coins += got; }
      }
    }
    paintCount();
  }
  function onDone(c, res) {
    var R = run;
    if (!R || R.phase !== 'play' || R.n !== c.n) return;
    res = res || {};
    var rights, asked, src;
    if (R.reports) { rights = R.rights; asked = R.asked; src = 'answers'; }
    else if (typeof res.asked === 'number' && res.asked > 0) {
      asked = Math.round(res.asked);
      /* firstTryRight is the count; a score is read as one only when it can be a count of those
         items — 600 "points" over 6 items is points, and points are not first-try rights */
      var cnt = typeof res.firstTryRight === 'number' ? res.firstTryRight : res.score;
      if (typeof cnt === 'number' && cnt >= 0 && cnt <= asked && cnt === Math.round(cnt)) { rights = cnt; src = 'done'; }
      else { rights = 0; asked = 0; src = 'none'; }
    } else { rights = 0; asked = 0; src = 'none'; }
    rights = Math.max(0, Math.min(Math.round(rights), asked));
    var s = rec(), lvl = s.lvl, pct = asked ? rights / asked : 0;
    var won = src !== 'none' && asked >= MIN_ASKED && pct >= RESTORE;
    var o = { restored: won, rights: rights, asked: asked, src: src, level: lvl, coins: R.coins, stop: 0, offer: false, dropped: false };
    if (won) {
      if (!s.done[c.n]) s.done[c.n] = today();
      s.thin[c.n] = 0;
      /* stop 5, once per chapter per child */
      if (!s.paid[c.n]) { s.paid[c.n] = 1; H.save(); var st5 = H.earn('stop', 'chapter ' + c.n + ' remembered') || 0; o.stop = st5; o.coins += st5; }
      lift = c.n;
      sfx('unlock');
    } else {
      if (src !== 'none') s.thin[c.n] = Math.min(THIN_MAX, (s.thin[c.n] || 0) + 1);
      sfx('finish');
    }
    /* THE LEVEL RULE (docs/32): < 50% drops one, ≥ 80% OFFERS the next, never forces it */
    if (src !== 'none' && asked) {
      if (pct < RESTORE && lvl > 1) { s.lvl = lvl - 1; o.dropped = true; }
      else if (pct >= OFFER && lvl < 5) o.offer = true;
    }
    H.save();
    stopRound();
    R.out = o; R.phase = 'result';
    paint(c);
    try { W.scrollTo(0, 0); } catch (e) {}
  }
  function startRound(c) {
    var g = engineOf(c), host = D.getElementById('sg-host');
    if (!g || !host) return;
    run.game = g; run.rights = 0; run.asked = 0; run.reports = 0; run.ids = {}; run.paidN = 0; run.coins = 0; run.out = null;
    var called = false;
    var opts = {
      skin: null, level: rec().lvl, band: H.band ? H.band() : '8-10',
      scope: c.opts || null,
      answer: onAnswer,
      calm: calm(), reduced: reduced()
    };
    /* the engines' own end-card button says "Back to the Mela"; inside the saga it finishes the telling */
    if (W.MutationObserver) {
      obs = new MutationObserver(function () {
        var out = host.querySelector('[data-go="out"]');
        if (out && /Mela/.test(out.textContent || '')) out.textContent = 'Finish the telling';
      });
      obs.observe(host, { childList: true, subtree: true });
    }
    try {
      td = g.engine(host, opts, function (res) {
        if (called) return; called = true;
        setTimeout(function () { onDone(c, res); }, 0);
      });
    } catch (e) {
      stopRound();
      host.innerHTML = '<div class="card"><p>This round could not open. Try again in a moment.</p></div>';
    }
  }

  /* --------------------------------------------------------------- painting and verbs */
  function chapterRoot() {
    var root = D.getElementById('sg-root');
    return root && run && root.getAttribute('data-n') === String(run.n) ? root : null;
  }
  function paint(c) {
    var root = chapterRoot();
    if (!root) return;
    root.setAttribute('data-phase', run.phase);
    var b = root.querySelector('.sg-body');
    if (b) b.innerHTML = body(c);
    if (run.phase === 'play') startRound(c);
    if (run.phase === 'result' && run.out && run.out.restored) {
      liftIn(root.querySelector('.sg-mini'), run.n);
      var vg = root.querySelector('.sg-vig');
      if (vg) { vg.outerHTML = vignette(c, c.n); liftIn(root.querySelector('.sg-vig'), c.n); }
    }
    var f = root.querySelector('.sg-act .sg-primary') || root.querySelector('.sg-act .btn:not([disabled])');
    if (f && run.phase !== 'play') try { f.focus({ preventScroll: true }); } catch (e) {}
  }
  /* the colour coming back: drawn grey, then lifted — at once under reduced motion */
  function liftIn(box, n) {
    if (!box || !n) return null;
    var go = function () {
      var pl = box.querySelector('[data-pl="' + n + '"]'), fg = box.querySelector('[data-fog="' + n + '"]');
      if (pl) pl.setAttribute('class', 'sg-pl');
      if (fg) fg.setAttribute('class', 'sg-fog gone');
    };
    if (reduced()) { go(); return null; }
    return setTimeout(go, 350);
  }
  function verb(v, el) {
    if (v === 'locked') {
      var c0 = chap(el.getAttribute('data-n')), b0 = c0 && chap(c0.n - 1);
      if (H.toast) H.toast('Still in the mist — it opens once “' + (b0 ? b0.title : 'the chapter before') + '” is remembered.');
      return true;
    }
    if (!chapterRoot()) return false;
    var c = chap(run.n), sc = scriptOf(c) || { intro: [] };
    if (!c) return false;
    if (v === 'next') { run.i = Math.min(run.i + 1, (sc.intro || []).length - 1); sfx('tap'); }
    else if (v === 'prev') run.i = Math.max(0, run.i - 1);
    else if (v === 'ready') { run.phase = 'ready'; rec().seen[c.n] = 1; H.save(); }
    else if (v === 'scene') { run.phase = 'scene'; run.i = 0; }
    else if (v === 'lvl') { rec().lvl = Math.max(1, Math.min(5, parseInt(el.getAttribute('data-l'), 10) || 1)); H.save(); }
    else if (v === 'begin') { run.phase = 'play'; }
    else if (v === 'again') { run.phase = 'ready'; }
    else if (v === 'up') { var s = rec(); s.lvl = Math.min(5, s.lvl + 1); H.save(); el.disabled = true; el.textContent = 'Level ' + s.lvl + ' it is'; return true; }
    else return false;
    paint(c);
    return true;
  }
  function mount(arg) {
    var onClick = function (e) {
      var el = e.target.closest && e.target.closest('[data-sg]');
      if (!el || el.disabled) return;
      if (!el.closest('#sg-root, .sg-mapwrap')) return;
      e.preventDefault();
      verb(el.getAttribute('data-sg'), el);
    };
    var onKey = function (e) {
      if (!chapterRoot()) return;
      var t = (e.target && e.target.tagName || '').toLowerCase();
      if (t === 'input' || t === 'textarea' || t === 'select' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (run.phase === 'scene' && e.key === 'ArrowRight') { e.preventDefault(); var c = chap(run.n), n = ((scriptOf(c) || {}).intro || []).length;
        verb(run.i >= n - 1 ? 'ready' : 'next'); }
      else if (run.phase === 'scene' && e.key === 'ArrowLeft') { e.preventDefault(); verb('prev'); }
      else if (run.phase === 'ready' && /^[1-5]$/.test(e.key)) { e.preventDefault(); var b = D.querySelector('#sg-root [data-sg="lvl"][data-l="' + e.key + '"]'); if (b) verb('lvl', b); }
    };
    D.addEventListener('click', onClick);
    D.addEventListener('keydown', onKey);
    /* the place just restored colours in on the map the child comes back to */
    var liftT = null;
    if (!chap(arg) && lift) { liftT = liftIn(D.querySelector('.sg-map'), lift); lift = null; }
    var mini = chapterRoot() && D.querySelector('#sg-root .sg-mini.lifting');
    if (mini) liftIn(mini, run.n);
    return function () { D.removeEventListener('click', onClick); D.removeEventListener('keydown', onKey); clearTimeout(liftT); stopRound(); };
  }

  /* --------------------------------------------------------------- the Play card (IND_GAMES)
     The flagship card opens the saga map inside the game frame; each place is a link to its
     own route (#/saga/<n>), so Back walks map → chapter → map and never leaves the app. */
  function playEngine(host, opts, done) {
    if (!H || !data()) { host.innerHTML = '<div class="card"><p>The saga is still loading. Try again in a moment.</p></div>'; return function () {}; }
    if (!isOpen()) { host.innerHTML = holdCard(); return function () { host.innerHTML = ''; }; }
    if (opts && opts.level >= 1 && opts.level <= 5) { rec().lvl = opts.level; H.save(); }
    host.innerHTML = '<div class="sg">' + draftNote() + mapCard(true) + '</div>';
    var liftT = null;
    if (lift) { liftT = liftIn(host.querySelector('.sg-map'), lift); lift = null; }
    var onClick = function (e) {
      var el = e.target.closest && e.target.closest('[data-sg="locked"]');
      if (el && host.contains(el)) { e.preventDefault(); verb('locked', el); }
    };
    host.addEventListener('click', onClick);
    return function () { clearTimeout(liftT); host.removeEventListener('click', onClick); host.innerHTML = ''; };
  }
  function register() {
    if (!W.IND_GAMES) W.IND_GAMES = [];
    if (gameById('saga')) return;
    var card = {
      id: 'saga', name: 'Gattu aur Vismriti', sub: 'Gattu’s journey across India',
      blurb: 'A grey mist has settled on a village on the night of its festival. Tell it back, one place at a time — every place is a real game.',
      icon: 'book', minutes: 15, tag: 'Katha', teaches: true,
      how: 'Read the scene, then play its round — half or more right on the first try brings the colour back.',
      practised: 'One story, five games: patterns, places, festivals and the endings of stories.',
      levels: ['gentle', 'steady', 'stretch', 'hard', 'hardest'],
      engine: playEngine
    };
    /* G5: review stays true until the act is signed, and the card stays hidden outside tester mode
       (the hub skips `hide`) — both read live, so a sign-off or ?tester=1 needs no rebuild */
    Object.defineProperty(card, 'review', { enumerable: true, get: function () { return !reviewed(); }, set: function () {} });
    Object.defineProperty(card, 'hide', { enumerable: true, get: function () { return !isOpen(); }, set: function () {} });
    Object.defineProperty(card, 'open', { enumerable: true, get: function () { var a = act(); return ownerOpened() ? a.open : null; }, set: function () {} });
    W.IND_GAMES.push(card);
  }

  /* --------------------------------------------------------------- style, once */
  var CSS = [
    '.sg{display:flex;flex-direction:column;gap:14px}',
    '.sg-h{font:800 clamp(22px,3.2vw,30px)/1.15 var(--display,Georgia,serif);margin:2px 0 6px;letter-spacing:-.01em;color:var(--text)}',
    '.sg-badge{white-space:nowrap}',
    '.sg-draft{border:1px dashed var(--line2);border-radius:var(--radius-md);padding:8px 12px;font-size:13px;color:var(--text2);background:var(--card2);margin-bottom:10px}',
    '.sg-maphead,.sg-head{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;flex-wrap:wrap}',
    '.sg-head{flex-direction:column;align-items:flex-start;gap:2px;min-width:0}',
    '.sg-headrow{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:14px}',
    '.sg-vig{position:relative;flex:none;width:min(340px,40%);aspect-ratio:400/150;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--line2);box-shadow:var(--shadow)}',
    '.sg-vig .sg-svg{display:block;width:100%;height:100%}',
    '.sg-viglab{position:absolute;left:8px;bottom:8px;font:700 11px/1 var(--body,inherit);letter-spacing:.06em;text-transform:uppercase;background:rgba(255,255,255,.9);color:#2a1f52;padding:5px 8px;border-radius:999px}',
    '.sg-mapgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,320px);gap:16px;align-items:start}',
    '.sg-mapcol{min-width:0}',
    '.sg-side{display:flex;flex-direction:column;gap:12px}',
    '.sg-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
    '.sg-li{display:flex;align-items:center;gap:10px;width:100%;min-height:48px;padding:6px 10px;border-radius:var(--radius-md);background:var(--card);border:1px solid var(--line);',
      'color:var(--text);text-decoration:none;font:inherit;text-align:left;cursor:pointer}',
    '.sg-li:hover{border-color:var(--accent)}.sg-li:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.sg-li.locked{background:var(--card2);color:var(--muted)}',
    '.sg-ln{flex:none;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--card2);border:2px solid var(--line2);font:800 13px var(--body,inherit)}',
    '.sg-ln.done{background:#e9a13b;border-color:#e9a13b;color:#3a2207}',
    '.sg-lt{min-width:0;display:flex;flex-direction:column}.sg-lt b{font-size:14px;line-height:1.25}.sg-lt i{font-style:normal;font-size:12px;color:var(--muted)}',
    '.sg-map{position:relative;border-radius:var(--radius-xl);overflow:hidden;border:1px solid var(--line2);box-shadow:var(--shadow-lg);aspect-ratio:800/480;background:#ecdcae}',
    '.sg-svg{display:block;width:100%;height:100%}',
    '[data-mode="night"] .sg-svg{filter:brightness(.86) saturate(.95)}',
    '.sg-pl{transition:filter 1.8s ease}',
    '.sg-pl.mist{filter:grayscale(1) contrast(.75) brightness(1.08)}',
    '.sg-pl.mist.t1{filter:grayscale(.85) contrast(.8) brightness(1.06)}',
    '.sg-pl.mist.t2{filter:grayscale(.7) contrast(.85) brightness(1.04)}',
    '.sg-pl.mist.t3{filter:grayscale(.55) contrast(.9) brightness(1.02)}',
    '.sg-fog{transition:opacity 1.8s ease;opacity:.92}',
    '.sg-fog.t1{opacity:.78}.sg-fog.t2{opacity:.64}.sg-fog.t3{opacity:.5}',
    '.sg-fog.gone{opacity:0}',
    '.sg-ground{transition:filter 1.8s ease}',
    '.sg-pin{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:3px;min-width:44px;min-height:44px;',
      'text-decoration:none;color:var(--text);background:none;border:0;padding:0;cursor:pointer;font:inherit;-webkit-tap-highlight-color:transparent}',
    '.sg-pindot{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:#f7f4ff;color:#3d2f86;border:3px solid #8f88b0;',
      'font:800 18px/1 var(--body,inherit);box-shadow:0 4px 14px rgba(30,20,70,.28)}',
    '.sg-pindot svg{width:18px;height:18px}',
    '.sg-pin.now .sg-pindot{background:#5b3fd6;border-color:#fff;color:#fff}',
    '.sg-pin.done .sg-pindot{background:#e9a13b;border-color:#fff;color:#3a2207}',
    '.sg-pin.locked .sg-pindot{background:#e7e4ef;color:#62588a;border-color:#b9b6c8}',
    '.sg-pinlab{font:700 12px/1.2 var(--body,inherit);background:rgba(255,255,255,.92);color:#2a1f52;padding:3px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 6px rgba(30,20,70,.18)}',
    '.sg-pin:focus-visible{outline:none}.sg-pin:focus-visible .sg-pindot{outline:3px solid var(--accent2);outline-offset:3px}',
    '.sg-pin.now .sg-pindot{animation:sgPulse 2.4s ease-in-out infinite}',
    '@keyframes sgPulse{0%,100%{box-shadow:0 0 0 0 rgba(91,63,214,.45),0 4px 14px rgba(30,20,70,.28)}50%{box-shadow:0 0 0 10px rgba(91,63,214,0),0 4px 14px rgba(30,20,70,.28)}}',
    '.sg-mapnote{margin:8px 0 0;padding:8px 12px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius-md);color:var(--text2)}',
    '.sg-page{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-xl);padding:16px;box-shadow:var(--shadow)}',
    '.sg-page > .card{box-shadow:none;margin:0}',
    '.sg-page > .sg-ready{border:0;padding:0;background:none}',
    '.sg-next{display:flex;align-items:center;gap:12px;margin:0;flex-wrap:wrap}',
    '.sg-side .sg-next .sg-go{flex:1 1 100%;justify-content:center}',
    '.sg-next .sg-nextt{flex:1;min-width:0}.sg-next b{display:block;font:800 18px/1.25 var(--display,Georgia,serif);margin:2px 0}',
    '.sg-next p{margin:2px 0 0}',
    '.sg-face{flex:none;width:56px;height:56px;object-fit:contain}',
    '.sg-next .sg-face{width:64px;height:64px}',
    '.sg-go{flex:none;min-height:48px;display:inline-flex;align-items:center}',
    '.sg-blurb{margin:0 0 12px;color:var(--text2);font-size:15px;line-height:1.55;max-width:70ch}',
    '.sg-comic{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}',
    '.sg-panel{position:relative;margin:0;display:flex;gap:10px;align-items:flex-start;padding:14px;border-radius:16px;background:var(--card);',
      'border:2px solid var(--text);box-shadow:4px 4px 0 var(--line2);min-height:128px;transition:opacity .4s ease,transform .4s ease}',
    '.sg-panel figcaption{min-width:0}.sg-panel b{display:block;font:800 13px/1.2 var(--body,inherit);letter-spacing:.06em;text-transform:uppercase;color:var(--accent-ink,var(--accent))}',
    '.sg-panel p{margin:4px 0 0;font-size:15.5px;line-height:1.55;color:var(--text)}',
    '.sg-panel.who-mithu b{color:#1a7a54}[data-mode="night"] .sg-panel.who-mithu b{color:#7fdcb0}',
    '.sg-panel.now{border-color:var(--accent);box-shadow:5px 5px 0 var(--accent-soft),0 10px 30px rgba(30,20,70,.12)}',
    '.sg-panel.past{opacity:.92}',
    '.sg-panel.ahead{align-items:center;justify-content:center;background:var(--card2);border:2px dashed var(--line2);box-shadow:none;color:#b9b6c8}',
    '[data-mode="night"] .sg-panel.ahead{color:rgba(200,195,225,.3)}',
    '.sg-fogpanel{flex-direction:column;justify-content:center;background:linear-gradient(135deg,#e4e2ec,#cfccdc);border-color:#8f88b0;color:#3b3552}',
    '[data-mode="night"] .sg-fogpanel{background:linear-gradient(135deg,#3b3752,#2c2940);color:#ddd9ee}',
    '.sg-fade{font:italic 600 16px/1.6 var(--display,Georgia,serif);margin:0;color:inherit}',
    '.sg-fade span{margin-right:4px}',
    '.sg-fogpanel figcaption{color:inherit;opacity:.8}',
    '.sg-act{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:14px;position:sticky;bottom:12px;z-index:6;',
      'padding:8px;border-radius:var(--radius-pill);background:var(--card);border:1px solid var(--line);box-shadow:0 6px 22px rgba(30,20,70,.14)}',
    '.sg-act .btn{min-height:48px}',
    '.sg-of{min-width:44px;text-align:center}',
    '.sg-skip{margin-left:auto}',
    '.sg-ready{display:flex;gap:14px;align-items:flex-start}.sg-ready p{margin:6px 0 0}',
    '.sg-say{font:800 19px/1.3 var(--display,Georgia,serif);color:var(--text)}',
    '.sg-lvl{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px}',
    '.sg-lv{min-width:48px;min-height:48px;justify-content:center;font-weight:800;font-size:16px}',
    '.sg-playbar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px;padding:8px 12px;border-radius:var(--radius-md);background:var(--card2);border:1px solid var(--line)}',
    '.sg-count{font:700 14px var(--body,inherit);color:var(--text)}',
    '.sg-host{min-height:240px}',
    '.sg-result{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:16px;align-items:center}',
    '.sg-mini{border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--line2);aspect-ratio:800/480}',
    '.sg-mini .sg-svg{display:block;width:100%;height:100%}',
    '.sg-rtext p{margin:6px 0 0}',
    '.sg-strip{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}',
    '.sg-strip .sg-panel{min-height:0}',
    '.sg-hold h1{margin:6px 0 8px}',
    '.sg-whole b{color:var(--text)}',
    '.inhost .sg-maphead{display:none}',
    '@media (max-width:960px){.sg-mapgrid{grid-template-columns:1fr}.sg-list{display:none}}',
    '@media (max-width:720px){',
      '.sg-mapnote{display:none}',
      '.sg-headrow{flex-direction:column-reverse;align-items:stretch;gap:10px}',
      '.sg-vig{width:100%;aspect-ratio:400/86}',
      '.sg-page{padding:12px;border-radius:var(--radius-lg)}',
      '.sg-ready .sg-face{display:none}',
      '.sg-say{font-size:17px}',
      '.sg-lvl{gap:6px}.sg-lvl > span{flex:1 1 100%}',
      '.sg-lv{min-width:44px;min-height:44px;flex:1 1 0}',
      '.sg-comic{grid-template-columns:1fr}',
      '.sg-comic .sg-panel:not(.now){display:none}',
      '.sg-panel{min-height:0}',
      '.sg-panel p{font-size:16px}',
      '.sg-act{position:sticky;bottom:calc(74px + env(safe-area-inset-bottom));z-index:6;padding:6px;border-radius:var(--radius-pill);',
        'background:var(--card);box-shadow:0 6px 22px rgba(30,20,70,.16);border:1px solid var(--line);flex-wrap:nowrap}',
      '.sg-act .btn{flex:1 1 auto;padding-left:12px;padding-right:12px;justify-content:center}',
      '.sg-skip{display:none}',
      '.sg-of{display:none}',
      '.sg-result{grid-template-columns:1fr}',
      '.sg-strip{grid-template-columns:1fr}',
      '.sg-next{flex-wrap:wrap}.sg-next .sg-face{width:48px;height:48px}.sg-next p{display:none}',
      '.sg-go{flex:1 1 100%;justify-content:center}',
      '.sg-pinlab{font-size:11px;padding:2px 6px}',
      '.sg-pindot{width:44px;height:44px;font-size:16px}',
    '}',
    '@media (prefers-reduced-motion:reduce){.sg-pl,.sg-fog,.sg-ground,.sg-panel{transition:none!important}.sg-pin.now .sg-pindot{animation:none}}',
    '[data-motion="reduce"] .sg-pl,[data-motion="reduce"] .sg-fog,[data-motion="reduce"] .sg-ground,[data-motion="reduce"] .sg-panel{transition:none!important}',
    '[data-motion="reduce"] .sg-pin.now .sg-pindot,[data-calm="1"] .sg-pin.now .sg-pindot{animation:none}'
  ].join('\n');
  function injectCSS() {
    if (D.getElementById('sg-css')) return;
    var s = D.createElement('style'); s.id = 'sg-css'; s.textContent = CSS;
    D.head.appendChild(s);
  }

  /* --------------------------------------------------------------- the seam */
  W.IND_SAGA_UI = {
    ready: false,
    init: function (host) { H = host; this.ready = true; },
    open: isOpen,
    /* #/saga and #/saga/<n> */
    screen: function (arg) {
      injectCSS();
      if (!H) return '';
      if (W.IND_LOAD && arg != null && arg !== '') W.IND_LOAD(ENGINE_GROUPS).catch(function () {});
      return arg == null || arg === '' ? mapScreen() : chapterScreen(arg);
    },
    mount: function (arg) { injectCSS(); return mount(arg == null || arg === '' ? null : arg); },
    /* for tools/check-saga.js: what a chapter would play, and the rules' numbers */
    engineOf: function (n) { var c = chap(n); var g = c && engineOf(c); return g ? g.id : null; },
    rules: { MIN_ASKED: MIN_ASKED, PAY_CAP: PAY_CAP, RESTORE: RESTORE, OFFER: OFFER }
  };
  injectCSS();
  register();
})(typeof window !== 'undefined' ? window : null, typeof document !== 'undefined' ? document : null);
