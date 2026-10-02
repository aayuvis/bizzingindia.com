/* sfx.js — the family's small sound set (family standard §9, §10; FIX-INDIA F3).

   Five sounds, all made here by the Web Audio API — no recording, no file, nothing to
   download — and all SOFT: a wrong answer is a low note, never a buzzer.

     tap · right · wrong · win · medal

   ONE MUTE. The app's sound switch (the child's menu in the top bar) is the only switch:
   window.IND_SFX_MUTED() is answered by app.js, and a muted device plays nothing at all.
   Off until the first real tap, so no page makes a sound a child did not ask for; a
   browser that refuses audio is simply silent.

   window.IND_SFX = { play(kind), KINDS, played[] }   played[] is the last 50 sounds that
   actually played, for tools/check-games.js — never shown, never stored. */
(function (W) {
  'use strict';
  /* [frequency Hz, length s, start offset s] — triangle waves, quiet */
  var SET = {
    tap:   [[587, 0.05, 0]],
    right: [[659, 0.09, 0], [880, 0.16, 0.08]],
    wrong: [[262, 0.12, 0], [220, 0.2, 0.1]],
    win:   [[523, 0.12, 0], [659, 0.12, 0.11], [784, 0.26, 0.22]],
    medal: [[784, 0.1, 0], [988, 0.1, 0.09], [1175, 0.32, 0.18]]
  };
  var AC = null, armed = false, dead = false, last = {};
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
    if (!armed || dead) return true;
    try {
      if (!AC) AC = new (W.AudioContext || W.webkitAudioContext)();
      var t0 = AC.currentTime;
      notes.forEach(function (n) {
        var o = AC.createOscillator(), g = AC.createGain(), at = t0 + n[2];
        o.type = 'triangle'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.05, at + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, at + n[1]);
        o.connect(g); g.connect(AC.destination);
        o.start(at); o.stop(at + n[1] + 0.02);
      });
    } catch (e) { dead = true; }
    return true;
  }
  var api = { play: play, KINDS: Object.keys(SET), played: [] };
  W.IND_SFX = api;
})(window);
