/* sfx.js — the family's small sound set (family standard §10, §11; FIX-INDIA M3).

   Eight sounds, all made here by the Web Audio API — no recording, no file, nothing to
   download — and all SOFT: a wrong answer is a low note, never a buzzer. Tuned to the same
   pentatonic the music uses, so an effect never clashes with the loop under it.

     tap · right · wrong · finish · win · medal · coin · unlock

   ONE MUTE. window.IND_SFX_MUTED() is answered by app.js (the mute in ☰ and the effects
   switch in Settings). Effects go through audio.js's effects bus, so the one volume slider
   moves them, Calm mode softens them, and the music ducks for the moment they sound. Off
   until the first real tap, so no page makes a sound a child did not ask for.

   window.IND_SFX = { play(kind), KINDS, played[] }   played[] is the last 50 sounds that
   actually played, for the browser checks — never shown, never stored. */
(function (W) {
  'use strict';
  /* [frequency Hz, length s, start offset s, wave] */
  var SET = {
    tap:    [[587, 0.05, 0]],
    right:  [[659, 0.09, 0], [880, 0.16, 0.08]],
    wrong:  [[262, 0.12, 0], [220, 0.2, 0.1]],
    finish: [[523, 0.1, 0], [659, 0.1, 0.1], [784, 0.1, 0.2], [1047, 0.34, 0.3]],
    win:    [[523, 0.12, 0], [659, 0.12, 0.11], [784, 0.26, 0.22]],
    medal:  [[784, 0.1, 0], [988, 0.1, 0.09], [1175, 0.32, 0.18]],
    coin:   [[1319, 0.06, 0, 'sine'], [1760, 0.18, 0.06, 'sine']],
    unlock: [[392, 0.1, 0], [587, 0.1, 0.09], [784, 0.12, 0.18], [1175, 0.4, 0.3, 'sine']]
  };
  var armed = false, dead = false, last = {};
  W.addEventListener('pointerdown', function () { armed = true; }, { capture: true, passive: true });
  W.addEventListener('keydown', function () { armed = true; }, { capture: true, passive: true });

  function play(kind) {
    var notes = SET[kind];
    if (!notes) return false;
    if (W.IND_SFX_MUTED && W.IND_SFX_MUTED()) return false;
    /* one of a kind at a time: two right answers in 120ms are one sound */
    var now = Date.now();
    if (last[kind] && now - last[kind] < 120) return false;
    last[kind] = now;
    api.played.push(kind); if (api.played.length > 50) api.played.shift();
    if (!armed || dead || !W.IND_AUDIO) return true;
    try {
      var AC = W.IND_AUDIO.ctx(), out = W.IND_AUDIO.fxOut();
      if (!AC || !out) return true;
      var t0 = AC.currentTime, end = 0;
      notes.forEach(function (n) {
        var o = AC.createOscillator(), g = AC.createGain(), at = t0 + n[2];
        o.type = n[3] || 'triangle'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.07, at + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, at + n[1]);
        o.connect(g); g.connect(out);
        o.start(at); o.stop(at + n[1] + 0.02);
        end = Math.max(end, n[2] + n[1]);
      });
      W.IND_AUDIO.duck(true, Math.round(end * 1000) + 250);
    } catch (e) { dead = true; }
    return true;
  }
  var api = { play: play, KINDS: Object.keys(SET), played: [] };
  W.IND_SFX = api;
})(window);
