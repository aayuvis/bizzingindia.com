/* Bizzing India — the Bhagavad Gita, all 700 verses, with a guru (owner, 3 Oct 2026: "an advanced
   gita learning module with all 700 shlokas and their ucchāraṇ … in Sanskrit, anglicised, then the
   meaning in English … set to a musical background … a guided journey of a guru … and the ability
   to record oneself saying the shloka").

   THREE SCREENS, each a route (CLAUDE.md: every screen is a route, back never leaves the app):
     #/gita            the journey — eighteen chapters in the three sixes, and where you are
     #/gitach/<n>      a chapter — its name, who speaks in it, and its verses to walk
     #/gitav/<c.v>     a verse, taught in six steps by the guru:
                       listen · read · meaning · repeat after me · record yourself · from memory

   WHAT IS NOT INVENTED HERE. Every word of the verses, both translations, the chapter names and
   titles, and the three facts the guru tells you about where the Gita sits come from the sources
   tools/build-gita.js names (docs/21). The guru's own lines are instructions — listen, now you —
   and never an interpretation: what a verse MEANS is Besant's or Swarupananda's, attributed, and
   never this file's. Who is speaking is read from the text's own "X uvāca" lines.

   THE VOICE IS A COMPUTER'S, AND THE SCREEN SAYS SO on every verse (owner's decision, 3 Oct 2026),
   with how it was checked: a second program listened without being told the verse and wrote down
   what it heard. A human reciter's file (voice/gita/human/) replaces a verse the day it exists.

   THE CHILD'S OWN VOICE never leaves the device. The microphone opens only from a tap on Record,
   and its track stops the moment recording ends. Nobody scores it — not the app, not a server.
   "From memory" is the child's own word for it, so it pays nothing and is never called mastery.

   WHO IT OPENS FOR. Until tools/gita-src/review.json names a Sanskrit reviewer it opened in tester mode
   only, and everyone else was told plainly why. On 4 Oct 2026 the owner opened it to everyone before
   that review ("deploy as is"; review.json `open`) — the publisher's decision, not a sign-off — so every
   page says the text has not yet been checked by a Sanskrit reader, until someone has. */
(function (W, D) {
  'use strict';

  var H = null;   /* the host: state, save, go, toast, icon, esc, render, tester, age, store, error, bed, musicOn, soundOn */
  var A = null;   /* the guru's chant, one <audio> at a time */
  var ui = { id: null, step: 'listen', speed: 1, rep: null, rec: null, mine: {}, mineAsked: false, hide: 0, reveal: false, said: null, raf: 0, other: null,
             voice: null, met: {} };

  var STEPS = [['listen', 'Listen'], ['read', 'Read'], ['mean', 'Meaning'], ['repeat', 'Repeat'], ['record', 'Record'], ['remember', 'Remember']];
  var WHO = { dhritarashtra: 'Dhritarashtra', sanjaya: 'Sanjaya', arjuna: 'Arjuna', krishna: 'Krishna' };
  /* who is speaking to whom is the guru's line sp-<speaker> (tools/gita-src/guru.json), read off the
     text's own uvāca lines; Sanjaya's listener is the blind king, as the foreword the journey quotes says */
  /* THE MUSIC BY SITUATION (music/engine.js — composed in code, no drums under a chant). Which
     chapter takes which theme is this module's choice about mood, not a claim about the text. */
  var THEME = { 1: 'gitawar', 2: 'gitateach', 3: 'gitateach', 4: 'gitateach', 5: 'gitateach', 6: 'gitastill',
    7: 'gitateach', 8: 'gitastill', 9: 'gitadevotion', 10: 'gitavision', 11: 'gitavision', 12: 'gitadevotion',
    13: 'gitastill', 14: 'gitateach', 15: 'gitastill', 16: 'gitateach', 17: 'gitadevotion', 18: 'gitaway' };
  var RAGA = { gitawar: 'Darbari', gitateach: 'Bhupali', gitastill: 'Malkauns', gitadevotion: 'Bhairavi', gitavision: 'Darbari', gitaway: 'Yaman' };
  /* THE PICTURES ARE REUSED (owner: "it's fine if you reuse … cannot afford 700 files"): the
     Mahabharata's own paintings of the chariot between the armies (episode 26) and the field
     (episode 25), only the ones with no lettering painted into them. Each verse gets one of its
     chapter's paintings and its own slow camera — a different crop and drift — so no two
     neighbouring verses look the same, and nothing in a painting moves but the camera. */
  var ART = {
    1: ['25-2', '26-9', '26-1', '26-5'], 2: ['26-5', '26-6', '26-3', '26-11'], 3: ['26-4', '26-10', '26-12'],
    4: ['26-3', '26-12', '26-8'], 5: ['26-8', '26-11', '26-1'], 6: ['26-6', '26-10', '26-9'],
    7: ['26-12', '26-4', '26-3'], 8: ['26-1', '26-9', '26-6'], 9: ['26-3', '26-8', '26-11'],
    10: ['26-11', '26-12', '26-10'], 11: ['26-10', '26-6', '26-1'], 12: ['26-4', '26-11', '26-8'],
    13: ['26-8', '26-3', '26-9'], 14: ['26-9', '26-12', '26-4'], 15: ['26-1', '26-10', '26-6'],
    16: ['26-5', '26-4', '26-3'], 17: ['26-11', '26-8', '26-12'], 18: ['26-12', '26-6', '26-10', '26-1']
  };
  /* scale from → to, drift from → to (percent of the frame); every scale ≥ 1.08 so a ≤ 3% drift
     never shows an edge */
  var CAM = [[1.08, 1.18, 0, 0, -3, -2], [1.18, 1.08, -3, 2, 0, 0], [1.1, 1.2, 2, -1, -2, 1],
             [1.14, 1.14, -3, 0, 3, 0], [1.08, 1.16, 0, 2, 1, -2], [1.16, 1.08, 2, -2, -1, 1]];

  function G() { return W.IND_GITA || { chapters: [] }; }
  function VO() { return W.IND_GITA_VOICE || {}; }
  function esc(s) { return H.esc(s); }
  function icon(n, s) { return H.icon(n, s); }
  function today() { var d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
  function chOf(n) { return G().chapters[n - 1] || null; }
  function versesOf(n) { return (W.IND_GITA_V || {})[n] || null; }
  function ref(id) { return String(id).replace('-', '.'); }
  function parse(arg) {
    var m = String(arg == null ? '' : arg).match(/^(\d{1,2})[.\-](\d{1,2})$/);
    if (!m) return null;
    var c = +m[1], v = +m[2], ch = chOf(c);
    if (!ch || v < 1 || v > ch.verses) return null;
    return { c: c, v: v, id: c + '-' + v };
  }
  function verseOf(p) { var vs = versesOf(p.c); return vs ? vs[p.v - 1] : null; }
  function after(p) {
    var ch = chOf(p.c);
    if (p.v < ch.verses) return p.c + '.' + (p.v + 1);
    return p.c < 18 ? (p.c + 1) + '.1' : null;
  }
  function before(p) {
    if (p.v > 1) return p.c + '.' + (p.v - 1);
    return p.c > 1 ? (p.c - 1) + '.' + chOf(p.c - 1).verses : null;
  }

  /* --------------------------------------------------------------- the record
     { v: { '<c>-<v>': { h, r, k, m, m2 } }, last: '<c>-<v>' } — day stamps, nothing else.
       h  heard the whole chant through          r  repeated it line by line after the guru
       k  recorded themselves (the clip stays on the device)
       m  said it with nothing to look at — the child's own word for it
       m2 said it so again on a LATER day: "by heart". The same day twice is practice, not memory
          (the day rule paath.js keeps for mastery; this is never written into mastery). */
  function rec() { var s = H.state(); s.v = s.v || {}; return s; }
  function mark(id, k) {
    var r = rec(), e = r.v[id] || (r.v[id] = {}), d = today(), was = level(id);
    if (k === 'm') { if (!e.m) e.m = d; else if (e.m < d && !e.m2) e.m2 = d; }
    else if (!e[k]) e[k] = d;
    r.last = id;
    H.save();
    return level(id) > was;
  }
  function level(id) {
    var e = rec().v[id];
    if (!e) return 0;
    return e.m2 ? 4 : e.m ? 3 : (e.r || e.k) ? 2 : e.h ? 1 : 0;
  }
  var LEVEL = ['not yet', 'heard', 'practised', 'said from memory', 'by heart'];
  function tally(c) {
    var t = [0, 0, 0, 0, 0], n = c ? chOf(c).verses : 0;
    if (c) { for (var v = 1; v <= n; v++) t[level(c + '-' + v)]++; return t; }
    for (var k in rec().v) t[level(k)]++;
    return t;
  }
  function reached(t, lv) { var s = 0; for (var i = lv; i < t.length; i++) s += t[i]; return s; }

  /* --------------------------------------------------------------- the gates */
  function reviewed() { var r = G().review; return !!(r && r.status === 'reviewed' && r.by); }
  /* OPENED BY THE OWNER BEFORE REVIEW (4 Oct 2026, "deploy as is"): the publisher's decision, recorded
     in review.json as `open` — never as a sign-off. Every page then says the text is unchecked. */
  function ownerOpened() { var r = G().review; return !!(r && r.open && r.open.by); }
  function open() { return H.tester() || reviewed() || ownerOpened(); }
  function holding() {
    return '<button class="backlink" data-act="go" data-v="verses" data-arg="gita">' + icon('back', 18) + ' The Gita verses</button>' +
      '<div class="card gt-hold"><div class="mono">Bhagavad Gita · all 700 verses</div>' +
      '<h1>Being checked before it opens</h1>' +
      '<p>The whole Gita is built — every verse in Sanskrit, in Roman letters, in English, chanted, with a guru to ' +
      'take you through it. A person who reads Sanskrit is checking it first: the words against a printed edition, ' +
      'and the chanting by ear. It opens here the day they have.</p>' +
      '<p class="tiny muted">Until then, five verses from it are on the Gita shelf.</p>' +
      '<button class="btn" data-act="go" data-v="verses" data-arg="gita">The five Gita verses →</button></div>';
  }
  function draftBar() {
    if (reviewed()) return '';
    if (ownerOpened()) return '<div class="gt-draft" role="note"><b>Not yet checked by a Sanskrit reader.</b> Every verse here is taken ' +
      'from published editions and two published translations, and nothing is written from memory — but nobody who reads Sanskrit ' +
      'has checked it against a printed edition yet. The chanting is a computer voice. Ask a grown-up who knows it.</div>';
    return '<div class="gt-draft" role="note"><b>Draft — tester mode only.</b> Nobody has signed this off yet ' +
      '(tools/gita-src/review.json). Children do not see it.</div>';
  }
  function youngNote() {
    return H.tester() || (H.age() || 8) >= 10 ? '' :
      '<div class="gt-draft" role="note">The Gita on this app is for 10 and up: it is set on a battlefield, and its ' +
      'questions are not seven-year-old questions.</div>';
  }

  /* --------------------------------------------------------------- pictures */
  function artOf(c, v) { var L = ART[c] || ART[2]; return 'art/epic/mahabharata-' + L[(v - 1) % L.length] + '.jpg'; }
  function camOf(c, v, dur) {
    var k = CAM[(c * 7 + v * 5) % CAM.length];
    return '--s0:' + k[0] + ';--s1:' + k[1] + ';--x0:' + k[2] + '%;--y0:' + k[3] + '%;--x1:' + k[4] + '%;--y1:' + k[5] + '%;--dur:' + (dur || 30) + 's';
  }
  function picture(c, v, cap, dur, eager) {
    return '<figure class="gt-art" data-cam="1" data-full="' + artOf(c, v) + '" role="button" tabindex="0" aria-label="See the painting full screen" style="' + camOf(c, v, dur) + '">' +
      '<img src="' + artOf(c, v) + '" alt="" width="900" height="506"' + (eager ? '' : ' loading="lazy"') + ' decoding="async"></figure>' +
      (cap ? '<p class="gt-cap">' + cap + '</p>' : '');
  }
  /* THE GURU SPEAKS ITS OWN LINES (tools/gita-src/guru.json): shown and spoken word for word, in the
     voice that chants. guru(keys) shows them with a button to hear them; guru(null, html) is a line
     made of this verse's numbers, shown only. */
  function said(keys) { var g = G().guru || {}; return keys.map(function (k) { return g[k] || ''; }).join(' '); }
  function voiced(keys) { var v = G().guruVoiced || []; return keys.length && keys.every(function (k) { return v.indexOf(k) >= 0; }); }
  function guru(keys, html) {
    var line = keys ? esc(said(keys)) : html, can = keys && voiced(keys);
    return '<div class="gt-guru"><span class="gt-mark deva" lang="sa" aria-hidden="true">गुरु</span>' +
      '<p><b class="gt-sr">Your guru: </b>' + line + '</p>' +
      (can ? '<button class="gt-say" data-ga="say" data-k="' + keys.join(',') + '" aria-label="Hear the guru say it">' + icon('sound', 18) + '</button>' : '') + '</div>';
  }
  function talkOn() { return rec().talk !== false; }
  /* the guru's clips one after another, then `then`; the music steps back while he talks */
  function speak(keys, then) {
    keys = (keys || []).filter(function (k) { return (G().guruVoiced || []).indexOf(k) >= 0; });
    if (!keys.length || !H.soundOn()) { if (then) then(); return; }
    stopVoice();
    var i = 0, a = new Audio();
    ui.voice = a; H.duck(true);
    var next = function () {
      if (ui.voice !== a) return;
      if (i >= keys.length) { ui.voice = null; H.duck(false); if (then) then(); return; }
      a.src = 'voice/gita/guru/' + keys[i++] + '.mp3?v=' + (W.IND_BUILD || '1');
      a.play().catch(function () { ui.voice = null; H.duck(false); });
    };
    a.onended = next; a.onerror = function () { if (ui.voice === a) next(); };
    next();
  }
  function stopVoice() { if (ui.voice) { try { ui.voice.pause(); } catch (e) {} ui.voice = null; H.duck(false); } }
  /* what the guru says when a step opens (and only when a child opened it) */
  function stepKeys(s) {
    if (s === 'remember') return [ui.said === 'yes' ? (level(ui.id) >= 4 ? 'heart' : 'said') : ui.said === 'no' ? 'notyet' : ['remember', 'remember1', 'remember2'][ui.hide]];
    return { read: ['read'], mean: ['mean'], repeat: ['repeat'], record: ['record'] }[s] || [];
  }
  function introKeys(x) { return ['sp-' + x.sp].concat(x.spm ? ['mid-' + x.spm] : []).concat(['listen']); }

  /* --------------------------------------------------------------- the voice */
  function voiceOf(id) { var x = VO()[id]; return x ? { d: x[0], dist: x[1], of: x[2], seg: x[3], human: !!x[4] } : null; }
  function srcOf(id) { var x = voiceOf(id); return x ? 'voice/gita/' + (x.human ? 'human/' : '') + id + '.mp3?v=' + (W.IND_BUILD || '1') : null; }
  function voiceLabel(id) {
    var x = voiceOf(id);
    if (!x) return 'This verse has not been chanted yet. Read it aloud line by line, and come back to hear it.';
    if (x.human) return 'Recited by a person.';
    return 'Chanted by a computer voice (Google’s), not a person. A second program listened to it without being told ' +
      'the verse and wrote down what it heard: ' + (x.dist === 0 ? 'every letter matched.' : x.dist + ' of ' + x.of + ' letters came out differently.') +
      ' A human reciter’s recording will replace it.';
  }
  function chantLines(x) {
    var sa = x.sa.split('\n'), ia = x.iast.split('\n'), rd = x.read.split('\n');
    var L = sa.map(function (s, i) { return { sa: s, ia: ia[i] || '', rd: rd[i] || '' }; });
    if (x.spl) {
      var sl = { sa: x.spl, ia: x.spli || '', rd: x.splr || '', spl: 1 };
      if (x.spp === 'before') L.unshift(sl); else L.splice(1, 0, sl);
    }
    return L;
  }
  function segs(id, n) { var x = voiceOf(id); return x && x.seg && x.seg.length === n ? x.seg : null; }

  function stop() {
    stopVoice();
    if (ui.rep && ui.rep.t) clearTimeout(ui.rep.t);
    ui.rep = null;
    if (ui.other) { try { ui.other.pause(); } catch (e) {} ui.other = null; }
    if (A) { try { A.pause(); } catch (e) {} }
    cancelAnimationFrame(ui.raf);
    if (ui.rec && ui.rec.mr && ui.rec.mr.state !== 'inactive') { try { ui.rec.mr.stop(); } catch (e) {} }
    H && H.bed(false);
    paintPlay(false);
  }
  function audioFor(id) {
    if (A && A._id === id) return A;
    if (A) { try { A.pause(); } catch (e) {} }
    A = new Audio(srcOf(id));
    A._id = id; A.preload = 'auto';
    A.preservesPitch = true; A.mozPreservesPitch = true; A.webkitPreservesPitch = true;
    A.addEventListener('ended', function () {
      if (A._whole) { A._whole = false; if (mark(id, 'h')) H.render(); }
      H.bed(false); paintPlay(false);
      if (A._then) { var f = A._then; A._then = null; f(); }
    });
    return A;
  }
  function soundCheck() {
    if (H.soundOn()) return true;
    H.toast('Sound is off. Turn it on (the speaker at the top) to hear the chant.');
    return false;
  }
  /* the whole verse, with its lines lighting as they are chanted */
  function playWhole(then) {
    if (!srcOf(ui.id) || !soundCheck()) return;
    stopOthers();
    var a = audioFor(ui.id);
    a.playbackRate = ui.speed; a._whole = true; a._then = then || null; a._end = null;
    if (a.ended || a.currentTime >= (a.duration || 1e9) - 0.05) a.currentTime = 0;
    H.bed(true);
    a.play().then(function () { paintPlay(true); follow(); }, function () { H.bed(false); paintPlay(false); });
  }
  /* one line, then stop: what "repeat after me" and a tap on a line both play */
  function playLine(i, then) {
    var a = audioFor(ui.id), x = verseOf(parse(ui.id.replace('-', '.'))), sg = segs(ui.id, chantLines(x).length);
    if (!sg || !soundCheck()) return;
    stopOthers();
    a.playbackRate = ui.speed; a._whole = false; a._then = null;
    a.currentTime = sg[i][0]; a._end = sg[i][1];
    H.bed(true);
    a.play().then(function () {
      paintPlay(true);
      (function tick() {
        if (a.paused) return;
        light(i);
        if (a.currentTime >= a._end - 0.03) { a.pause(); a._end = null; H.bed(false); paintPlay(false); if (then) then(); return; }
        ui.raf = requestAnimationFrame(tick);
      })();
    }, function () { H.bed(false); });
  }
  function stopOthers() { if (ui.other) { try { ui.other.pause(); } catch (e) {} ui.other = null; } cancelAnimationFrame(ui.raf); }
  function follow() {
    var a = A; if (!a || a.paused) return;
    var x = verseOf(parse(ui.id.replace('-', '.'))), sg = x && segs(ui.id, chantLines(x).length), t = a.currentTime, at = -1;
    if (sg) for (var i = 0; i < sg.length; i++) if (t >= sg[i][0] - 0.05) at = i;
    light(at);
    ui.raf = requestAnimationFrame(follow);
  }
  function light(i) {
    var ls = D.querySelectorAll('[data-gl]');
    for (var k = 0; k < ls.length; k++) ls[k].classList.toggle('lit', +ls[k].getAttribute('data-gl') === i);
  }
  function paintPlay(on) {
    var b = D.querySelector('[data-ga="play"]');
    if (b) { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.innerHTML = on ? pauseIcon() + ' Pause' : icon('play', 20) + ' ' + (ui.step === 'listen' ? 'Listen to the guru' : 'Play'); }
    var f = D.querySelector('.gt-art[data-cam]');
    if (f) f.classList.toggle('on', !!on);
    if (!on) light(-1);
  }
  function pauseIcon() { return '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="3" width="4" height="14" rx="1" fill="currentColor"/><rect x="12" y="3" width="4" height="14" rx="1" fill="currentColor"/></svg>'; }

  /* --------------------------------------------------------------- the child's own voice */
  function loadMine() {
    if (ui.mineAsked || !H.store) return;
    ui.mineAsked = true;
    H.store.listClips(function (list) {
      (list || []).forEach(function (c) { if (c.kind === 'gita' && c.ref && !ui.mine[c.ref]) ui.mine[c.ref] = c; });
      if (D.querySelector('[data-gstep="record"]')) H.render();
    });
  }
  function recStart() {
    if (ui.rec) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !W.MediaRecorder) { H.toast('This browser cannot record. Say it aloud anyway — the guru is listening in spirit.'); return; }
    stop();
    ui.rec = { busy: true };
    var id = ui.id;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var chunks = [], mr;
      try { mr = new MediaRecorder(stream); } catch (e) { stream.getTracks().forEach(function (t) { t.stop(); }); ui.rec = null; H.toast('This browser cannot record.'); return; }
      ui.rec = { mr: mr, at: Date.now(), id: id };
      mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      mr.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });     /* the light goes off now */
        var blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
        var clip = { id: 'gita-' + id, kind: 'gita', ref: id, at: Date.now(), blob: blob, plays: 0, title: 'Bhagavad Gita ' + ref(id) };
        ui.mine[id] = clip; ui.rec = null;
        H.store.putClip(clip, function (ok) {
          if (!ok) H.toast('Kept until you leave — this browser will not keep recordings.');
          mark(id, 'k'); H.render();
        });
      };
      mr.start();
      H.render();
      (function tick() { var el = D.querySelector('[data-gt="recclock"]'); if (!ui.rec || !ui.rec.mr) return;
        if (el) { var s = Math.floor((Date.now() - ui.rec.at) / 1000); el.textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
        if (Date.now() - ui.rec.at > 180000) { recStop(); return; }   /* three minutes is a verse twice over */
        setTimeout(tick, 250); })();
    }).catch(function () { ui.rec = null; H.toast('The microphone is not available. Check the browser’s permission.'); H.render(); });
  }
  function recStop() { if (ui.rec && ui.rec.mr && ui.rec.mr.state !== 'inactive') ui.rec.mr.stop(); }
  function playMine(then) {
    var c = ui.mine[ui.id]; if (!c || !c.blob || !soundCheck()) return;
    stop();
    var url = URL.createObjectURL(c.blob), au = new Audio(url);
    ui.other = au;
    au.onended = function () { URL.revokeObjectURL(url); ui.other = null; if (then) then(); };
    au.play().catch(function () {});
  }

  /* --------------------------------------------------------------- THE JOURNEY */
  function journey() {
    if (!open()) return holding();
    var g = G(), t = tally(), last = rec().last, F = g.foreword || { quotes: [] }, q = F.quotes || [];
    var cont = last ? ref(last) : '1.1';
    var part = function (from, label, line) {
      var tiles = '';
      for (var c = from; c < from + 6; c++) {
        var ch = chOf(c); if (!ch) continue;
        var tt = tally(c), done = reached(tt, 1), pct = Math.round(done / ch.verses * 100);
        tiles += '<button class="tile gt-chtile" data-act="go" data-v="gitach" data-arg="' + c + '">' +
          '<span class="gt-chn">' + c + '</span><span class="gt-cht">' +
          '<span class="deva" lang="sa">' + esc(ch.name) + '</span>' +
          '<b>' + esc(ch.title) + '</b>' +
          '<span class="tiny muted">' + ch.verses + ' verses' + (done ? ' · ' + done + ' begun' : '') + '</span>' +
          '<span class="gt-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></span></span></button>';
      }
      return '<section class="gt-part"><div class="mono">' + esc(label) + '</div>' +
        '<p class="tiny muted gt-partline">“' + esc(line) + '”</p><div class="grid g2">' + tiles + '</div></section>';
    };
    return draftBar() + youngNote() +
      '<div class="card gt-head">' + picture(2, 3, '', 40, true) +
      '<div class="mono">Bhagavad Gita · 18 chapters · 700 verses</div>' +
      '<h1>The Gita, with your guru</h1>' +
      guru(['welcome']) +
      '<div class="row gt-go"><button class="btn lg" data-act="go" data-v="gitav" data-arg="' + esc(cont) + '">' +
        (last ? 'Continue at ' + esc(cont) : 'Begin at chapter 1, verse 1') + ' →</button>' +
      (reached(t, 1) ? '<span class="tiny muted">' + reached(t, 1) + ' heard · ' + reached(t, 3) + ' said from memory · ' + t[4] + ' by heart</span>' : '') +
      '</div></div>' +
      '<div class="card gt-where"><h2>Where the Gita is</h2>' +
      (q[0] ? '<blockquote>' + esc(q[0]) + '</blockquote>' : '') +
      (q[1] ? '<blockquote>' + esc(q[1]) + ' ' + esc(q[2] || '') + ' ' + esc(q[3] || '') + '</blockquote>' : '') +
      '<p class="tiny muted">' + esc(F.source || '') + '. That is why the first voice you hear is the blind king’s, and the ' +
      'one who answers him is Sanjaya.</p></div>' +
      (q[4] ? '<p class="gt-sixes tiny muted">“' + esc(q[4]) + '” — and in that view, Swami Swarupananda wrote in 1909:</p>' : '') +
      part(1, 'Chapters 1–6', (q[5] || '').replace(/^In this view /, '')) +
      part(7, 'Chapters 7–12', q[6] || '') +
      part(13, 'Chapters 13–18', q[7] || '') +
      about();
  }
  function about() {
    var g = G(), n = Object.keys(VO()).length;
    return '<details class="card gt-about"><summary><b>Where every word here comes from</b></summary>' +
      '<p><b>Sanskrit:</b> ' + esc(g.source || '') + ' Where those editions disagree with the base text, the reading the others ' +
      'agree on is used; three places are marked for a reviewer instead.</p>' +
      '<p><b>Roman letters:</b> IAST, converted letter by letter from the Devanagari by the app, so the two cannot disagree. ' +
      'The easier spelling under it is made the same way.</p>' +
      '<p><b>Chapter titles in English:</b> ' + esc(g.titles || '') + '</p>' +
      '<p><b>The chanting:</b> a computer voice, not a person — ' + n + ' of 700 verses so far. Each was made three times and ' +
      'the one a second program heard most exactly was kept. A person who reads Sanskrit has still to listen to them. ' +
      'Any verse a human reciter records replaces the computer’s. The guru’s spoken lines are the same voice, saying exactly ' +
      'the words on the screen.</p>' +
      '<p><b>The music:</b> composed in code for Bizzing (music/CREDITS.md) — a raga for each chapter’s mood, no drums.</p>' +
      '<p><b>The pictures:</b> this app’s own Mahabharata paintings, reused; only the camera moves.</p></details>';
  }

  /* --------------------------------------------------------------- A CHAPTER */
  function chapter(arg) {
    if (!open()) return holding();
    var c = +arg, ch = chOf(c), vs = versesOf(c);
    if (!ch || String(c) !== String(arg).trim()) return H.error('That chapter is not here. The Gita has eighteen.');
    if (!vs) return H.error('That chapter did not load. It may be the connection.', 'gitach', c);
    var tt = tally(c), first = 0;
    for (var v = 1; v <= ch.verses && !first; v++) if (level(c + '-' + v) < 2) first = v;
    var go = first || 1, th = THEME[c], sp = ch.speakers || {};
    var who = Object.keys(sp).sort(function (a, b) { return sp[b] - sp[a]; }).map(function (k) {
      return '<span class="pill stat">' + esc(WHO[k] || k) + ' · ' + sp[k] + '</span>'; }).join(' ');
    var grid = '';
    for (v = 1; v <= ch.verses; v++) {
      var lv = level(c + '-' + v);
      grid += '<button class="gt-vn lv' + lv + '" data-act="go" data-v="gitav" data-arg="' + c + '.' + v + '" aria-label="Verse ' + c + '.' + v + ', ' + LEVEL[lv] + '">' + v + '</button>';
    }
    var part = c <= 6 ? 'one of the first six' : c <= 12 ? 'one of the middle six' : 'one of the last six';
    return draftBar() + youngNote() +
      '<button class="backlink" data-act="go" data-v="gita">' + icon('back', 18) + ' All eighteen chapters</button>' +
      '<div class="card gt-head">' + picture(c, 1, '', 40, true) +
      '<div class="mono">Chapter ' + c + ' of 18 · ' + ch.verses + ' verses · ' + part + '</div>' +
      '<h1 class="gt-chname"><span class="deva" lang="sa">' + esc(ch.name) + '</span></h1>' +
      '<p class="gt-iast">' + esc(ch.iast) + '</p>' +
      '<p><b>' + esc(ch.title) + '</b> <span class="tiny muted">— Swami Swarupananda’s title (1909)</span></p>' +
      '<div class="row gt-who"><span class="tiny muted">Who speaks:</span> ' + who + '</div>' +
      guru(null, first && first > 1 ? 'You have practised up to verse ' + (first - 1) + '. We carry on at verse ' + first + '.'
        : first === 1 ? 'Chapter ' + c + ' has ' + ch.verses + ' verses. We take them one at a time, in order.'
        : 'You have practised every verse in this chapter. Go back to any of them — saying one again on another day is how it stays.') +
      '<div class="row gt-go"><button class="btn lg" data-act="go" data-v="gitav" data-arg="' + c + '.' + go + '">' +
        (first > 1 ? 'Continue at verse ' + go : 'Begin at verse ' + go) + ' →</button>' + musicLine(th) + '</div></div>' +
      '<div class="card"><div class="spread"><h2 style="margin:0">The verses</h2><span class="tiny muted">' +
        reached(tt, 1) + ' heard · ' + reached(tt, 3) + ' from memory · ' + tt[4] + ' by heart</span></div>' +
      '<div class="gt-grid">' + grid + '</div>' +
      '<p class="tiny muted gt-key"><i class="lv1"></i> heard <i class="lv2"></i> practised <i class="lv3"></i> from memory <i class="lv4"></i> by heart</p></div>' +
      (c < 18 ? '<button class="btn ghost" data-act="go" data-v="gitach" data-arg="' + (c + 1) + '">Chapter ' + (c + 1) + ': ' + esc(chOf(c + 1).title) + ' →</button>' : '');
  }
  function musicLine(th) {
    var name = (W.IND_MUSIC && W.IND_MUSIC.THEMES[th] && W.IND_MUSIC.THEMES[th].name) || ({ gitawar: 'The field before the battle', gitateach: 'A teacher and a friend', gitastill: 'Sitting still', gitadevotion: 'Devotion', gitavision: 'The vision', gitaway: 'The way through' })[th] || '';
    var on = H.musicOn();
    return '<span class="tiny muted gt-music">' + icon('music', 16) + ' ' + (on ? 'Music: “' + esc(name) + '”, raga ' + esc(RAGA[th] || '') + ', under the chant'
      : 'The music is off') + ' <button class="gt-link" data-act="setmusic">' + (on ? 'turn off' : 'turn on') + '</button></span>';
  }

  /* --------------------------------------------------------------- A VERSE */
  function verse(arg) {
    if (!open()) return holding();
    var p = parse(arg);
    if (!p) return H.error('That verse is not in the Gita. It has 700, in eighteen chapters.');
    var x = verseOf(p);
    if (!x) return H.error('That chapter did not load. It may be the connection.', 'gitav', arg);
    if (ui.id !== p.id) { stop(); ui.id = p.id; ui.step = 'listen'; ui.hide = 0; ui.reveal = false; ui.said = null; A = null; }
    loadMine();
    var ch = chOf(p.c), L = chantLines(x), vo = voiceOf(p.id), lv = level(p.id), nx = after(p), pv = before(p);
    var steps = STEPS.map(function (s, i) {
      return '<button class="gt-step' + (ui.step === s[0] ? ' on' : '') + '" data-ga="step" data-s="' + s[0] + '" aria-pressed="' + (ui.step === s[0]) + '">' +
        '<span class="gt-stepn">' + (i + 1) + '</span>' + s[1] + '</button>';
    }).join('');
    var speaker = WHO[x.sp] || x.sp;
    return draftBar() + youngNote() +
      '<button class="backlink" data-act="go" data-v="gitach" data-arg="' + p.c + '">' + icon('back', 18) + ' Chapter ' + p.c + ' · ' + esc(ch.title) + '</button>' +
      '<div class="gt-verse" data-gverse="' + p.id + '">' +
      picture(p.c, p.v, '<b>' + p.c + '.' + p.v + '</b> · ' + esc(speaker) + ' speaks' +
        (x.spm ? ', then ' + esc(WHO[x.spm] || x.spm) : '') + ' · <span class="muted">' + esc(LEVEL[lv]) + '</span>', vo ? Math.round(vo.d / ui.speed) : 30, true) +
      '<nav class="gt-steps" aria-label="Steps">' + steps + '</nav>' +
      '<section class="card gt-body" data-gstep="' + ui.step + '">' + body(p, x, L, vo) + '</section>' +
      '<div class="row gt-nav">' +
        (pv ? '<button class="btn ghost" data-act="go" data-v="gitav" data-arg="' + pv + '" data-swipe="back">← ' + pv + '</button>' : '<span></span>') +
        '<span class="tiny muted">' + p.v + ' of ' + ch.verses + '</span>' +
        (nx ? '<button class="btn' + (lv >= 2 ? '' : ' ghost') + '" data-act="go" data-v="gitav" data-arg="' + nx + '" data-swipe="next">' + nx + ' →</button>' : '<span></span>') +
      '</div>' +
      '<p class="tiny muted gt-src">' + esc(voiceLabel(p.id)) + ' ' + musicLine(THEME[p.c]) + '</p>' +
      '<p class="tiny muted gt-keys">Keys: space plays, ← → move between verses, 1–6 choose a step.</p>' +
      '</div>';
  }

  function lineHTML(l, i, mode) {
    var cls = 'gt-line' + (l.spl ? ' spl' : '');
    var sa = mode === 'hint' ? hintDeva(l.sa) : mode === 'none' ? '' : esc(l.sa);
    var ia = mode === 'hint' ? hintRoman(l.ia) : mode === 'none' ? '' : esc(l.ia);
    return '<div class="' + cls + '" data-gl="' + i + '">' +
      (mode === 'none' ? '<span class="gt-blank" aria-hidden="true"></span>' :
        '<p class="gt-sa deva" lang="sa">' + sa + '</p>' +
        (mode === 'sa' ? '' : '<p class="gt-ia" lang="sa-Latn">' + ia + '</p>') +
        (mode === 'read' ? '<p class="gt-rd">' + esc(l.rd) + '</p>' : '')) + '</div>';
  }
  /* "first sounds": each word's first syllable stays, the rest becomes a line to fill from memory.
     A whole syllable, never half a conjunct — क्ष stays क्ष — and the shirorekha is never cut mid-letter. */
  var AKSHARA = /^(?:[क-हक़-य़](?:्[क-हक़-य़])*[ा-ौॢॣ]?|[ऄ-औॠॡ])[ऀ-ः]?/;
  function hintDeva(s) {
    return String(s).split(/\s+/).map(function (w) {
      if (/^[।॥]+$/.test(w)) return esc(w);
      var m = w.match(AKSHARA), head = m ? m[0] : w.slice(0, 1);
      return esc(head) + (w.length > head.length ? '<span class="gt-gap" aria-hidden="true"></span>' : '');
    }).join(' ');
  }
  function hintRoman(s) {
    return String(s).split(/\s+/).map(function (w) {
      if (/^\|+$/.test(w)) return esc(w);
      var m = w.match(/^[^aāiīuūṛṝḷeoaiau]*[aāiīuūṛṝḷeo]/i), head = m ? m[0] : w.slice(0, 1);
      return esc(head) + (w.length > head.length ? '<span class="gt-gap" aria-hidden="true"></span>' : '');
    }).join(' ');
  }

  function body(p, x, L, vo) {
    var sg = segs(p.id, L.length), speaker = said(['sp-' + x.sp]), s = ui.step;
    var play = vo ? '<button class="btn lg gt-play" data-ga="play" aria-pressed="false">' + icon('play', 20) + ' ' + (s === 'listen' ? 'Listen to the guru' : 'Play') + '</button>' : '';
    var speed = (vo ? '<button class="pill' + (ui.speed < 1 ? ' on' : '') + '" data-ga="speed" aria-pressed="' + (ui.speed < 1) + '">Slower</button>' : '') +
      '<button class="pill' + (talkOn() ? ' on' : '') + '" data-ga="talk" aria-pressed="' + talkOn() + '">Guru speaks</button>';
    if (s === 'listen') {
      return (vo ? guru(introKeys(x)) : guru(null, esc(said(introKeys(x).slice(0, -1))) + ' This verse has not been chanted yet, so read it slowly, aloud.')) +
        '<div class="row gt-ctl">' + play + speed + '</div>' +
        '<div class="gt-lines">' + L.map(function (l, i) { return lineHTML(l, i, 'sa'); }).join('') + '</div>' +
        nextStep('read', 'Now read it');
    }
    if (s === 'read') {
      return guru(['read']) +
        '<div class="row gt-ctl">' + play + speed + '</div>' +
        '<div class="gt-lines">' + L.map(function (l, i) {
          return sg ? '<button class="gt-linebtn" data-ga="line" data-i="' + i + '" aria-label="Hear this line">' + lineHTML(l, i, 'read') + '</button>' : lineHTML(l, i, 'read');
        }).join('') + '</div>' +
        nextStep('mean', 'What does it mean?');
    }
    if (s === 'mean') {
      /* A CHILD'S READING, under Besant (whom the guru's line introduces), when there is one — and it
         says what it is: drafted by a computer from the two translations on this page, and not yet
         checked by a person (owner, 4 Oct 2026) */
      return guru(['mean']) +
        '<blockquote class="gt-en">' + esc(x.en) + '</blockquote>' +
        '<p class="tiny muted">Annie Besant, <i>The Bhagavad-Gita</i>, 4th edition (1922).</p>' +
        (x.kid ? '<div class="gt-kid"><p class="gt-kidtxt">' + esc(x.kid) + '</p>' +
          '<p class="tiny gt-draft">In simpler words — drafted by a computer from the two translations on this page, and not yet checked by a person.</p></div>' : '') +
        (x.en2 ? '<details class="gt-en2"><summary>Another translation</summary><blockquote>' + esc(x.en2) + '</blockquote>' +
          '<p class="tiny muted">Swami Swarupananda, <i>Srimad-Bhagavad-Gita</i> (1909)' +
          (x.en2r ? ' — he translates verses ' + esc(x.en2r) + ' together as one' : '') + '.</p></details>' : '') +
        (x.rv ? '<p class="gt-draft tiny">' + esc(x.rv) + '</p>' : '') +
        '<p class="tiny muted">' + esc(speaker) + ' Ask someone in your family what this verse means to them — families read it differently, and that is the point of asking.</p>' +
        nextStep('repeat', 'Say it after me');
    }
    if (s === 'repeat') {
      if (!sg) return guru(null, vo ? 'This verse’s lines could not be timed, so we cannot go line by line here yet. Listen to it whole, then say it.' :
          'This verse has not been chanted yet. Read each line aloud, slowly, twice.') +
        '<div class="gt-lines">' + L.map(function (l, i) { return lineHTML(l, i, 'read'); }).join('') + '</div>' + nextStep('record', 'Record yourself');
      var r = ui.rep;
      var cur = r ? r.i : -1;
      return (r ? guru(null, r.phase === 'guru' ? 'Listen…' : '<b>Your turn.</b> Say that line now, out loud.') : guru(['repeat'])) +
        '<div class="row gt-ctl">' + (r ?
          '<button class="btn ghost" data-ga="repagain">Again</button><button class="btn ghost" data-ga="repnext">Next line</button><button class="btn ghost" data-ga="repstop">Stop</button>' :
          '<button class="btn lg" data-ga="repstart">' + icon('play', 20) + ' Start: repeat after me</button>' + speed) + '</div>' +
        (r ? '<div class="gt-turn ' + r.phase + '"><span>' + (r.phase === 'guru' ? 'Guru' : 'You') + '</span><i style="--t:' + (r.wait || 1) + 's"></i></div>' : '') +
        '<div class="gt-lines rep">' + L.map(function (l, i) { return '<div class="' + (i === cur ? 'gt-cur' : i < cur ? 'gt-past' : '') + '">' + lineHTML(l, i, 'read') + '</div>'; }).join('') + '</div>' +
        nextStep('record', 'Record yourself');
    }
    if (s === 'record') {
      var mine = ui.mine[p.id], rr = ui.rec && ui.rec.mr;
      return (rr ? guru(null, 'Say the whole verse now. Tap Stop when you finish.') :
          mine ? guru(null, 'Listen to yours, then to mine. Only you decide what to try again.') : guru(['record'])) +
        '<div class="row gt-ctl">' + (rr ?
          '<button class="btn lg gt-rec on" data-ga="recstop">■ Stop <span data-gt="recclock">0:00</span></button>' :
          '<button class="btn lg gt-rec" data-ga="recstart">' + icon('mic', 20) + (mine ? ' Record again' : ' Record myself') + '</button>') +
        (mine && !rr ? '<button class="btn ghost" data-ga="mine">' + icon('sound', 18) + ' Mine</button>' +
          (vo ? '<button class="btn ghost" data-ga="guru">' + icon('sound', 18) + ' The guru’s</button><button class="btn ghost" data-ga="both">Mine, then the guru’s</button>' : '') : '') +
        '</div>' +
        '<div class="gt-lines">' + L.map(function (l, i) { return lineHTML(l, i, 'read'); }).join('') + '</div>' +
        '<p class="tiny muted gt-promise">Your recording stays on this device — it is never uploaded. Nobody scores it, not even the app. ' +
        'Recording again replaces it. The microphone is on only while the red button says Stop.</p>' +
        nextStep('remember', 'Try it from memory');
    }
    /* remember */
    var mode = ['read', 'hint', 'none'][ui.hide];
    var e = rec().v[p.id] || {};
    void e;
    return guru(stepKeys('remember')) +
      '<div class="row gt-ctl" role="group" aria-label="How much to show">' +
        ['All of it', 'First sounds', 'Nothing'].map(function (t, i) { return '<button class="pill' + (ui.hide === i ? ' on' : '') + '" data-ga="hide" data-h="' + i + '" aria-pressed="' + (ui.hide === i) + '">' + t + '</button>'; }).join('') +
      '</div>' +
      '<div class="gt-lines">' + L.map(function (l, i) { return lineHTML(l, i, ui.hide === 2 && ui.reveal ? 'read' : mode); }).join('') + '</div>' +
      (ui.hide === 2 ? '<div class="row gt-ctl">' + (ui.reveal ? '' : '<button class="btn ghost" data-ga="reveal">Show it — check myself</button>') +
        '<button class="btn" data-ga="said" data-y="yes">I said it all</button><button class="btn ghost" data-ga="said" data-y="no">Not yet</button></div>' +
        '<p class="tiny muted">This is your word for it, and it is enough. It earns nothing and nobody checks it.</p>' : '') +
      (after(p) ? '<button class="btn block gt-next" data-act="go" data-v="gitav" data-arg="' + after(p) + '">Next verse: ' + after(p) + ' →</button>' : '');
  }
  function nextStep(s, label) { return '<button class="btn ghost block gt-next" data-ga="step" data-s="' + s + '">' + label + ' →</button>'; }

  /* repeat after me: guru → pause the length of the line and a breath → next line */
  function repRun() {
    var r = ui.rep; if (!r) return;
    var x = verseOf(parse(ui.id.replace('-', '.'))), L = chantLines(x), sg = segs(ui.id, L.length);
    if (!sg) return;
    if (r.i >= sg.length) { ui.rep = null; mark(ui.id, 'r'); H.render(); return; }
    r.phase = 'guru'; r.wait = Math.max(1, (sg[r.i][1] - sg[r.i][0]) / ui.speed); H.render();
    playLine(r.i, function () {
      if (ui.rep !== r) return;
      r.phase = 'you'; r.wait = (sg[r.i][1] - sg[r.i][0]) / ui.speed * 1.15 + 1.5; H.render();
      r.t = setTimeout(function () { if (ui.rep !== r) return; r.i++; repRun(); }, r.wait * 1000);
    });
  }

  /* --------------------------------------------------------------- the verbs */
  function act(verb, el) {
    if (!ui.id && verb !== 'step' && verb !== 'say') return false;
    switch (verb) {
      case 'step': stop(); ui.step = el.getAttribute('data-s'); ui.said = null; H.render(); if (talkOn()) speak(stepKeys(ui.step)); return true;
      case 'play':
        if (ui.voice) { stopVoice(); return true; }
        if (A && !A.paused) { A.pause(); H.bed(false); paintPlay(false); return true; }
        /* the first time on a verse the guru says who is speaking, then chants */
        var x0 = verseOf(parse(ui.id.replace('-', '.')));
        if (talkOn() && !ui.met[ui.id] && x0) { ui.met[ui.id] = 1; speak(introKeys(x0), function () { playWhole(); }); return true; }
        playWhole(); return true;
      case 'say': stop(); speak(String(el.getAttribute('data-k') || '').split(',')); return true;
      case 'talk': var rr0 = rec(); rr0.talk = !talkOn(); H.save(); if (!rr0.talk) stopVoice(); H.render(); return true;
      case 'speed': ui.speed = ui.speed < 1 ? 1 : 0.8; if (A) A.playbackRate = ui.speed; H.render(); return true;
      case 'line': playLine(+el.getAttribute('data-i')); return true;
      case 'repstart': stop(); ui.rep = { i: 0 }; repRun(); return true;
      case 'repagain': if (ui.rep) { clearTimeout(ui.rep.t); var r1 = ui.rep; ui.rep = { i: r1.i }; repRun(); } return true;
      case 'repnext': if (ui.rep) { clearTimeout(ui.rep.t); if (A) A.pause(); var r2 = ui.rep; ui.rep = { i: r2.i + 1 }; repRun(); } return true;
      case 'repstop': stop(); H.render(); return true;
      case 'recstart': recStart(); return true;
      case 'recstop': recStop(); return true;
      case 'mine': playMine(); return true;
      case 'guru': playWhole(); return true;
      case 'both': playMine(function () { playWhole(); }); return true;
      case 'hide': ui.hide = +el.getAttribute('data-h'); ui.reveal = false; ui.said = null; H.render(); if (talkOn()) speak(stepKeys('remember')); return true;
      case 'reveal': ui.reveal = true; H.render(); return true;
      case 'said':
        ui.said = el.getAttribute('data-y');
        if (ui.said === 'yes') mark(ui.id, 'm');
        H.render(); if (talkOn()) speak(stepKeys('remember')); return true;
    }
    return false;
  }

  /* after each paint of a verse: the keys. Torn down on every render, like the game canvases. */
  function mount() {
    var on = function (e) {
      if (!ui.id || !D.querySelector('[data-gverse]')) return;
      var tg = e.target && e.target.tagName;
      if (/INPUT|TEXTAREA|SELECT/.test(tg || '') || e.metaKey || e.ctrlKey || e.altKey) return;
      var p = parse(ui.id.replace('-', '.'));
      if (e.key === ' ' && tg !== 'BUTTON') { e.preventDefault(); act('play'); }
      else if (e.key === 'ArrowRight' && after(p)) { e.preventDefault(); H.go('gitav', after(p)); }
      else if (e.key === 'ArrowLeft' && before(p)) { e.preventDefault(); H.go('gitav', before(p)); }
      else if (/^[1-6]$/.test(e.key)) { stop(); ui.step = STEPS[+e.key - 1][0]; ui.said = null; H.render(); if (talkOn()) speak(stepKeys(ui.step)); }
    };
    D.addEventListener('keydown', on);
    /* a repaint mid-chant keeps the lines lighting and the camera moving */
    if (A && !A.paused && A._id === ui.id) { paintPlay(true); if (A._whole) { cancelAnimationFrame(ui.raf); follow(); } }
    return function () { D.removeEventListener('keydown', on); };
  }

  W.IND_GITA_UI = {
    init: function (host) { H = host; },
    journey: journey, chapter: chapter, verse: verse, act: act, mount: mount, stop: stop,
    /* which loop plays under a screen: the chapter's mood */
    theme: function (name, arg) {
      if (name === 'gita') return 'gitateach';
      var c = parseInt(String(arg || ''), 10);
      return THEME[c] || 'gitateach';
    },
    /* the groups a screen needs: the index, and the one chapter it shows */
    groups: function (name, arg) {
      var c = parseInt(String(arg || ''), 10);
      return c >= 1 && c <= 18 && name !== 'gita' ? ['gita', 'gita-' + (c < 10 ? '0' : '') + c] : ['gita'];
    },
    /* the test handle (tools/check-gita.js): what the screen claims, from the same functions */
    _t: { parse: parse, chantLines: chantLines, voiceLabel: voiceLabel, hintDeva: hintDeva, level: level, open: open, ui: ui, ART: ART, THEME: THEME }
  };
})(window, document);
