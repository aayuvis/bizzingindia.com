/* music/engine.js — Bizzing India's music, composed in code (family standard §11; FIX-INDIA M4).

   No recordings and no files: every loop is written here as a raga, a tala and a tune, and
   played by four small instruments built from oscillators — a TANPURA drone, a BANSURI
   (bamboo flute), a SANTOOR (struck strings) and a TABLA or DHOLAK — with a sarangi, a pad,
   a dhak and manjira where a place asks for them. See music/CREDITS.md.

   ONE LOOP PER WORLD, ONE FOR HOME, ONE FOR GAMES. Each is 60–90 seconds and seamless: the
   tune is generated once from the theme's own seed (so it is the same every time — composed,
   not random), ends on Sa, and the scheduler starts the next pass on the very next beat.

   Loaded by audio.js only when music is wanted, never in the first screen.

   window.IND_MUSIC = { THEMES, play(id, audioContext, outNode), stop(), current(), length(id) } */
(function (W) {
  'use strict';

  /* ------------------------------------------------------------------ scales (semitones from Sa) */
  var RAGA = {
    yaman:      [0, 2, 4, 6, 7, 9, 11],
    bhupali:    [0, 2, 4, 7, 9],
    bhairavi:   [0, 1, 3, 5, 7, 8, 10],
    khamaj:     [0, 2, 4, 5, 7, 9, 10],
    kafi:       [0, 2, 3, 5, 7, 9, 10],
    malkauns:   [0, 3, 5, 8, 10],
    hamsadhwani:[0, 2, 4, 7, 11],
    pahadi:     [0, 2, 4, 5, 7, 9],
    durga:      [0, 2, 5, 7, 9],
    desh:       [0, 2, 5, 7, 9, 10, 11],
    bilawal:    [0, 2, 4, 5, 7, 9, 11],
    darbari:    [0, 2, 3, 5, 7, 8, 10],
    shivranjani:[0, 2, 3, 7, 9],
    bhimpalasi: [0, 2, 3, 5, 7, 9, 10],
    hindol:     [0, 4, 6, 9, 11]
  };
  /* ------------------------------------------------------------------ talas (one bol per beat) */
  var TALA = {
    keherwa:  ['dha', 'ge', 'na', 'tin', 'na', 'ka', 'dhin', 'na'],
    dadra:    ['dha', 'dhin', 'na', 'dha', 'tin', 'na'],
    rupak:    ['tin', 'tin', 'na', 'dhin', 'na', 'dhin', 'na'],
    teen:     ['dha', 'dhin', 'dhin', 'dha', 'dha', 'dhin', 'dhin', 'dha', 'dha', 'tin', 'tin', 'ta', 'ta', 'dhin', 'dhin', 'dha'],
    dhak:     ['ge', '-', 'ge', 'na', 'ge', '-', 'na', 'na'],
    none:     ['-', '-', '-', '-', '-', '-', '-', '-']
  };

  /* THE THEMES. tonic in Hz (Sa), raga, tala, tempo, lead and answer instruments, drums,
     and a seed for the tune. Kept calm: these sit under a child reading, not over them. */
  var THEMES = {
    home:      { name: 'Home',            raga: 'bhupali',     tala: 'keherwa', bpm: 74,  sa: 146.83, lead: 'bansuri', answer: 'santoor', drum: 'tabla',  seed: 11 },
    games:     { name: 'The Mela',        raga: 'hamsadhwani', tala: 'keherwa', bpm: 104, sa: 155.56, lead: 'santoor', answer: 'bansuri', drum: 'tabla',  bells: 1, seed: 23 },
    delhi6:    { name: 'Delhi 6',         raga: 'yaman',       tala: 'keherwa', bpm: 84,  sa: 146.83, lead: 'bansuri', answer: 'santoor', drum: 'tabla',  seed: 31 },
    madhubani: { name: 'Madhubani',       raga: 'durga',       tala: 'dadra',   bpm: 92,  sa: 164.81, lead: 'bansuri', answer: 'santoor', drum: 'dholak', seed: 37 },
    diwali:    { name: 'Diwali Nights',   raga: 'khamaj',      tala: 'keherwa', bpm: 88,  sa: 155.56, lead: 'santoor', answer: 'bansuri', drum: 'tabla',  bells: 1, seed: 41 },
    pujo:      { name: 'Durga Pujo',      raga: 'bhairavi',    tala: 'dhak',    bpm: 96,  sa: 146.83, lead: 'bansuri', answer: 'santoor', drum: 'dhak',   bells: 1, seed: 43 },
    cricket:   { name: 'Cricket Fever',   raga: 'desh',        tala: 'keherwa', bpm: 108, sa: 164.81, lead: 'santoor', answer: 'bansuri', drum: 'dholak', seed: 47 },
    antariksh: { name: 'Antariksh',       raga: 'malkauns',    tala: 'none',    bpm: 60,  sa: 138.59, lead: 'santoor', answer: 'pad',     drum: null,     seed: 53 },
    mumbai:    { name: 'Mumbai Bustle',   raga: 'shivranjani', tala: 'keherwa', bpm: 100, sa: 155.56, lead: 'santoor', answer: 'bansuri', drum: 'dholak', seed: 59 },
    rajasthan: { name: 'Forts of Rajasthan', raga: 'bilawal',  tala: 'dadra',   bpm: 96,  sa: 146.83, lead: 'sarangi', answer: 'santoor', drum: 'dholak', seed: 61 },
    taj:       { name: 'Taj Mahal',       raga: 'darbari',     tala: 'teen',    bpm: 66,  sa: 138.59, lead: 'sarangi', answer: 'bansuri', drum: 'tabla',  soft: 1, seed: 67 },
    holi:      { name: 'Holi Hai',        raga: 'kafi',        tala: 'keherwa', bpm: 112, sa: 164.81, lead: 'bansuri', answer: 'santoor', drum: 'dholak', bells: 1, seed: 71 },
    dallake:   { name: 'Dal Lake',        raga: 'pahadi',      tala: 'dadra',   bpm: 84,  sa: 146.83, lead: 'santoor', answer: 'bansuri', drum: 'tabla',  soft: 1, seed: 73 },
    bollywood: { name: 'Bollywood',       raga: 'yaman',       tala: 'keherwa', bpm: 104, sa: 155.56, lead: 'sarangi', answer: 'santoor', drum: 'dholak', bells: 1, seed: 79 },
    truck:     { name: 'Truck Art',       raga: 'bhimpalasi',  tala: 'keherwa', bpm: 100, sa: 146.83, lead: 'bansuri', answer: 'santoor', drum: 'dholak', seed: 83 },
    dance:     { name: 'Dances of India', raga: 'hamsadhwani', tala: 'rupak',   bpm: 96,  sa: 146.83, lead: 'bansuri', answer: 'santoor', drum: 'tabla',  bells: 1, seed: 89 },
    patterns:  { name: 'Patterns of India', raga: 'hindol',    tala: 'dadra',   bpm: 80,  sa: 155.56, lead: 'santoor', answer: 'bansuri', drum: 'tabla',  soft: 1, seed: 97 },
    /* THE GITA, BY SITUATION (owner, 3 Oct 2026: "chant-like with situational music behind
       them — this helps in memory"). No drums anywhere: a shloka keeps its own metre, and a
       theka under it would fight the chant. Tonic C, low, so a chanting voice sits above it.
       Which chapter takes which is the module's choice (gita.js), not a claim about the text. */
    gitawar:     { name: 'The field before the battle', raga: 'darbari',  tala: 'none', bpm: 54, sa: 130.81, lead: 'sarangi', answer: 'pad',     drum: null, soft: 1, seed: 101 },
    gitateach:   { name: 'A teacher and a friend',      raga: 'bhupali',  tala: 'none', bpm: 58, sa: 130.81, lead: 'bansuri', answer: 'pad',     drum: null, soft: 1, seed: 103 },
    gitastill:   { name: 'Sitting still',               raga: 'malkauns', tala: 'none', bpm: 50, sa: 130.81, lead: 'pad',     answer: 'santoor', drum: null, soft: 1, seed: 107 },
    gitadevotion:{ name: 'Devotion',                    raga: 'bhairavi', tala: 'none', bpm: 56, sa: 130.81, lead: 'bansuri', answer: 'santoor', drum: null, soft: 1, seed: 109 },
    gitavision:  { name: 'The vision',                  raga: 'darbari',  tala: 'none', bpm: 52, sa: 130.81, lead: 'pad',     answer: 'sarangi', drum: null, soft: 1, seed: 113 },
    gitaway:     { name: 'The way through',             raga: 'yaman',    tala: 'none', bpm: 58, sa: 130.81, lead: 'santoor', answer: 'bansuri', drum: null, soft: 1, seed: 127 }
  };

  /* a small seeded generator: the same theme always writes the same tune */
  function rng(seed) { var x = seed * 9301 + 49297; return function () { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }

  function cycleBeats(th) { return TALA[th.tala].length; }
  /* as many whole cycles as make 60–90 seconds, even so the tune can pair its phrases */
  function plan(th) {
    var spb = 60 / th.bpm, cyc = cycleBeats(th) * spb;
    var n = Math.max(2, Math.round(75 / cyc)); if (n % 2) n++;
    while (n * cyc > 90) n -= 2;
    while (n * cyc < 60) n += 2;
    return { spb: spb, cycles: n, beats: n * cycleBeats(th), seconds: n * cyc };
  }

  /* THE TUNE. Phrases two cycles long, walked mostly stepwise along the raga, each ending on
     a resting note (Sa or Pa); the loop is A A' B A'' … and its last phrase comes home to Sa,
     so the next pass starts where a listener's ear expects it to. The answer instrument
     replies in the second half of some phrases, an octave up. */
  function compose(id) {
    var th = THEMES[id], P = plan(th), R = RAGA[th.raga], r = rng(th.seed);
    var cb = cycleBeats(th), phraseBeats = cb * 2, nPh = P.cycles / 2;
    var RHY = [[1, 1, 2], [0.5, 0.5, 1, 2], [2, 2], [1.5, 0.5, 2], [1, 1, 1, 1], [1, 0.5, 0.5, 2], [3, 1]];
    var paIdx = R.indexOf(7) >= 0 ? R.indexOf(7) : Math.floor(R.length / 2);
    function phrase(endOnSa) {
      var notes = [], b = 0, deg = Math.floor(r() * R.length);
      while (b < phraseBeats - 2) {
        var rh = RHY[Math.floor(r() * RHY.length)];
        for (var i = 0; i < rh.length && b < phraseBeats - 2; i++) {
          var step = r() < 0.7 ? (r() < 0.5 ? -1 : 1) : (r() < 0.5 ? -2 : 2);
          deg = Math.max(-2, Math.min(R.length + 2, deg + step));
          if (r() < 0.12 && i) { b += rh[i]; continue; }               /* a breath */
          notes.push([b, deg, Math.min(rh[i], phraseBeats - 2 - b)]);
          b += rh[i];
        }
      }
      notes.push([phraseBeats - 2, endOnSa ? 0 : paIdx, 2]);            /* the resting note */
      return notes;
    }
    var A = phrase(false), B = phrase(false), C = phrase(true);
    var order = [];
    for (var k = 0; k < nPh; k++) order.push(k === nPh - 1 ? C : (k % 4 === 2 ? B : A));
    var ev = [];
    order.forEach(function (ph, k) {
      var base = k * phraseBeats;
      ph.forEach(function (n) { ev.push({ b: base + n[0], inst: th.lead, deg: n[1], dur: n[2] }); });
      /* the answer: the phrase's last three notes, an octave up, in the next phrase's gap */
      if (th.answer && k % 2 === 1) ph.slice(-3).forEach(function (n, j) {
        ev.push({ b: base + phraseBeats - 1.5 + j * 0.5, inst: th.answer, deg: n[1] + R.length, dur: 0.5, soft: 1 });
      });
    });
    /* the drone: Pa · Sa' · Sa' · Sa, spread over every cycle */
    for (var c = 0; c < P.cycles; c++) [[-5, 0], [12, 0.25], [12, 0.5], [0, 0.75]].forEach(function (d) {
      ev.push({ b: c * cb + d[1] * cb, inst: 'tanpura', semi: d[0], dur: cb * 0.6 });
    });
    /* the drums, a soft theka on every beat; the bells on the sam */
    if (th.drum) for (var b2 = 0; b2 < P.beats; b2++) {
      var bol = TALA[th.tala][b2 % cb];
      if (bol !== '-') ev.push({ b: b2, inst: th.drum, bol: bol });
      if (th.bells && b2 % cb === 0) ev.push({ b: b2, inst: 'manjira' });
    }
    if (th.answer === 'pad') for (var c2 = 0; c2 < P.cycles; c2 += 2) ev.push({ b: c2 * cb, inst: 'pad', deg: [0, 2, 1, 3][(c2 / 2) % 4], dur: cb * 2 });
    ev.sort(function (a, b) { return a.b - b.b; });
    return { th: th, P: P, R: R, ev: ev };
  }

  /* ------------------------------------------------------------------ the instruments */
  var ac = null, out = null, noise = null;
  function noiseBuf() {
    if (noise) return noise;
    noise = ac.createBuffer(1, ac.sampleRate * 1, ac.sampleRate);
    var d = noise.getChannelData(0), s = 7;
    for (var i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = (s / 2147483647) * 2 - 1; }
    return noise;
  }
  function env(g, t, a, peak, dec, rel) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * 0.6), t + a + (dec || 0.1));
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + (dec || 0.1) + (rel || 0.3));
  }
  function osc(type, f, t, end, dest) {
    var o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
    o.connect(dest); o.start(t); o.stop(end + 0.05); return o;
  }
  var INST = {
    tanpura: function (t, f, dur) {
      var g = ac.createGain(), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 6;
      lp.frequency.setValueAtTime(2600, t); lp.frequency.exponentialRampToValueAtTime(700, t + dur);
      lp.connect(g); g.connect(out);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 1.6);
      osc('sawtooth', f, t, t + dur + 1.6, lp); osc('sawtooth', f * 2.003, t, t + dur + 1.6, lp);
    },
    bansuri: function (t, f, dur, soft) {
      var g = ac.createGain(); g.connect(out);
      var len = Math.max(0.18, dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(soft ? 0.05 : 0.09, t + 0.07);
      g.gain.setValueAtTime(soft ? 0.05 : 0.09, t + len * 0.75); g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.18);
      var o = osc('sine', f, t, t + len + 0.2, g), o2 = ac.createOscillator(), g2 = ac.createGain();
      o2.type = 'triangle'; o2.frequency.setValueAtTime(f, t); g2.gain.value = 0.25; o2.connect(g2); g2.connect(g); o2.start(t); o2.stop(t + len + 0.25);
      /* vibrato after the note settles, and a breath of air under it */
      var lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 5.2; lg.gain.setValueAtTime(0, t);
      lg.gain.linearRampToValueAtTime(f * 0.006, t + Math.min(0.35, len)); lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
      lfo.start(t); lfo.stop(t + len + 0.25);
      var n = ac.createBufferSource(), bp = ac.createBiquadFilter(), ng = ac.createGain();
      n.buffer = noiseBuf(); bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 3; ng.gain.value = 0.012;
      n.connect(bp); bp.connect(ng); ng.connect(g); n.start(t); n.stop(t + len + 0.1);
    },
    santoor: function (t, f, dur, soft) {
      [[1, 0.08], [2.01, 0.03], [3.02, 0.015]].forEach(function (p) {
        var g = ac.createGain(); g.connect(out);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(p[1] * (soft ? 0.6 : 1), t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
        osc('sine', f * p[0], t, t + 1.45, g);
      });
      /* struck twice, the santoor way, on a long note */
      if (dur >= 1.5) INST.santoor(t + 0.11, f, 0.5, 1);
    },
    sarangi: function (t, f, dur) {
      var g = ac.createGain(), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1700; lp.Q.value = 2;
      lp.connect(g); g.connect(out);
      var len = Math.max(0.25, dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.045, t + 0.14);
      g.gain.setValueAtTime(0.045, t + len * 0.8); g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.25);
      var o = osc('sawtooth', f, t, t + len + 0.3, lp);
      var lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 5.8; lg.gain.value = f * 0.008;
      lfo.connect(lg); lg.connect(o.frequency); lfo.start(t); lfo.stop(t + len + 0.3);
    },
    pad: function (t, f, dur) {
      var g = ac.createGain(), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
      lp.connect(g); g.connect(out);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.025, t + dur * 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 1);
      osc('sawtooth', f, t, t + dur + 1, lp); osc('sawtooth', f * 1.006, t, t + dur + 1, lp); osc('sine', f * 1.5, t, t + dur + 1, lp);
    },
    manjira: function (t) {
      var g = ac.createGain(), hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 4200;
      hp.connect(g); g.connect(out); env(g, t, 0.003, 0.02, 0.05, 0.5);
      osc('square', 2120, t, t + 0.7, hp); osc('square', 3170, t, t + 0.7, hp);
    }
  };
  /* the drums: a pitched, ringing right hand (na, tin, ta) and a deep left hand that bends (ge) */
  function drum(kind, t, bol, sa, soft) {
    var v = soft ? 0.55 : 1;
    function right(ring, peak) {
      var g = ac.createGain(); g.connect(out); env(g, t, 0.002, peak * v, 0.03, ring);
      osc('sine', sa * 2, t, t + ring + 0.1, g); osc('sine', sa * 2 * 2.76, t, t + ring * 0.5, g);
    }
    function left(peak) {
      var g = ac.createGain(); g.connect(out); env(g, t, 0.004, peak * v, 0.05, 0.35);
      var o = ac.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(kind === 'dhak' ? 95 : 110, t);
      o.frequency.exponentialRampToValueAtTime(kind === 'dhak' ? 58 : 70, t + 0.3); o.connect(g); o.start(t); o.stop(t + 0.5);
    }
    function slap(peak, f) {
      var n = ac.createBufferSource(), lp = ac.createBiquadFilter(), g = ac.createGain();
      n.buffer = noiseBuf(); lp.type = 'bandpass'; lp.frequency.value = f || 1800; lp.Q.value = 1.2;
      n.connect(lp); lp.connect(g); g.connect(out); env(g, t, 0.001, peak * v, 0.02, 0.06); n.start(t); n.stop(t + 0.12);
    }
    if (kind === 'dholak' || kind === 'dhak') {
      if (bol === 'dha' || bol === 'ge' || bol === 'dhin') left(kind === 'dhak' ? 0.16 : 0.12);
      if (bol === 'na' || bol === 'ta' || bol === 'tin' || bol === 'dha') slap(kind === 'dhak' ? 0.05 : 0.06, kind === 'dhak' ? 900 : 2200);
      if (bol === 'ka') slap(0.03, 600);
      return;
    }
    if (bol === 'dha' || bol === 'dhin') { left(0.1); right(bol === 'dhin' ? 0.5 : 0.25, 0.05); }
    else if (bol === 'ge') left(0.1);
    else if (bol === 'na' || bol === 'ta') right(0.22, 0.05);
    else if (bol === 'tin') right(0.5, 0.04);
    else if (bol === 'ka') slap(0.025, 500);
  }

  /* ------------------------------------------------------------------ the scheduler */
  var cur = null, song = null, t0 = 0, idx = 0, pass = 0, timer = null, node = null;
  function freqOf(deg, R, sa) {
    var oct = Math.floor(deg / R.length), d = ((deg % R.length) + R.length) % R.length;
    return sa * 2 * Math.pow(2, (R[d] + 12 * oct) / 12);     /* the tune sits an octave above the drone */
  }
  function tick() {
    if (!song || !ac) return;
    var ahead = ac.currentTime + 0.25, spb = song.P.spb, loopLen = song.P.seconds;
    while (true) {
      var e = song.ev[idx], at = t0 + pass * loopLen + e.b * spb;
      if (at > ahead) break;
      if (at >= ac.currentTime - 0.05) {
        try {
          if (e.inst === 'tanpura') INST.tanpura(at, song.th.sa * Math.pow(2, e.semi / 12), e.dur * spb);
          else if (e.inst === 'tabla' || e.inst === 'dholak' || e.inst === 'dhak') drum(e.inst, at, e.bol, song.th.sa, song.th.soft);
          else if (e.inst === 'manjira') INST.manjira(at);
          else if (e.inst === 'pad') INST.pad(at, song.th.sa * Math.pow(2, song.R[e.deg % song.R.length] / 12), e.dur * spb);
          else if (INST[e.inst]) INST[e.inst](at, freqOf(e.deg, song.R, song.th.sa), e.dur * spb, e.soft);
        } catch (x) {}
      }
      idx++;
      if (idx >= song.ev.length) { idx = 0; pass++; }          /* seamless: the next pass starts on the next beat */
    }
  }
  var cache = {};
  W.IND_MUSIC = {
    THEMES: THEMES,
    RAGA: RAGA,
    length: function (id) { return THEMES[id] ? plan(THEMES[id]).seconds : 0; },
    compose: function (id) { return cache[id] || (cache[id] = compose(id)); },
    play: function (id, audioContext, outNode) {
      if (!THEMES[id]) id = 'home';
      if (cur === id) return;
      this.stop();
      ac = audioContext; out = ac.createGain(); out.gain.value = 0.0001; out.connect(outNode); node = out;
      out.gain.exponentialRampToValueAtTime(1, ac.currentTime + 1.5);      /* fade in */
      song = this.compose(id); cur = id; idx = 0; pass = 0; t0 = ac.currentTime + 0.1;
      timer = setInterval(tick, 60); tick();
    },
    stop: function () {
      if (timer) clearInterval(timer); timer = null;
      if (node && ac) { var n = node; try { n.gain.setTargetAtTime(0.0001, ac.currentTime, 0.25); } catch (e) {} setTimeout(function () { try { n.disconnect(); } catch (e) {} }, 1500); }
      node = null; cur = null; song = null;
    },
    current: function () { return cur; }
  };
})(window);
