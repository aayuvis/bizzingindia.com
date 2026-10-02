/* audio.js — one sound system for the whole app (family standard §11; FIX-INDIA M3–M5).

   ONE AudioContext and three buses into one master volume:

     effects ─┐
              ├─ master (the volume slider; 0 when muted) ─ speakers
     music ─ duck ─┘

   • The MUSIC is composed in code (music/engine.js — no audio files, nothing to licence) and
     is loaded only when it is first needed, never in the first screen's bytes.
   • It DUCKS: whenever the recorded voice reads, or an effect plays, the music steps back.
   • It PAUSES when the tab is hidden, and stays off in Calm mode.
   • Nothing plays before a real tap or key — no page makes a sound a child did not ask for.

   window.IND_AUDIO = { ctx(), fxOut(), set({muted, fx, music, vol, calm}), duck(on),
                        music(theme), stop(), state, playing(), ducked() } */
(function (W, D) {
  'use strict';
  var AC = null, master = null, fxBus = null, duckBus = null, musicBus = null;
  var state = { muted: false, fx: true, music: true, vol: 0.8, calm: false };
  var armed = false, want = null, engineLoading = false, ducks = 0, duckTimer = null;
  var MUSIC_LEVEL = 0.4;            /* the music sits at 40% of the master (standard §11) */

  function ctx() {
    if (AC) return AC;
    try { AC = new (W.AudioContext || W.webkitAudioContext)(); } catch (e) { AC = null; return null; }
    master = AC.createGain(); master.connect(AC.destination);
    fxBus = AC.createGain(); fxBus.connect(master);
    duckBus = AC.createGain(); duckBus.connect(master);
    musicBus = AC.createGain(); musicBus.gain.value = 0; musicBus.connect(duckBus);
    apply(true);
    if (D.hidden) { try { AC.suspend(); } catch (e) {} }
    return AC;
  }
  function apply(now) {
    if (!AC) return;
    var t = AC.currentTime, k = now ? 0.01 : 0.08;
    master.gain.setTargetAtTime(state.muted ? 0 : state.vol, t, k);
    fxBus.gain.setTargetAtTime(state.fx ? (state.calm ? 0.5 : 1) : 0, t, k);
    musicBus.gain.setTargetAtTime(musicOn() ? MUSIC_LEVEL : 0, t, now ? 0.01 : 0.6);
  }
  function musicOn() { return state.music && !state.calm && !state.muted; }

  function loadEngine(then) {
    if (W.IND_MUSIC) return then();
    if (engineLoading) return;
    engineLoading = true;
    var s = D.createElement('script');
    s.src = 'music/engine.js?v=' + (W.IND_BUILD || '1');
    s.onload = function () { engineLoading = false; then(); };
    s.onerror = function () { engineLoading = false; };
    D.head.appendChild(s);
  }
  function startWanted() {
    if (!want || !armed || !musicOn()) return;
    var ac = ctx(); if (!ac) return;
    loadEngine(function () {
      if (!want || !musicOn() || !W.IND_MUSIC) return;
      if (W.IND_MUSIC.current() !== want) W.IND_MUSIC.play(want, ac, musicBus);
    });
  }

  var api = {
    ctx: ctx,
    fxOut: function () { ctx(); return fxBus; },
    state: state,
    set: function (o) {
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k) && o[k] != null) state[k] = o[k];
      apply(false);
      if (!musicOn()) { if (W.IND_MUSIC) W.IND_MUSIC.stop(); }
      else startWanted();
    },
    /* the voice is reading (or a sound is playing): the music steps back to a quarter */
    duck: function (on, ms) {
      ducks = Math.max(0, ducks + (on ? 1 : -1));
      if (on && ms) { clearTimeout(duckTimer); duckTimer = setTimeout(function () { api.duck(false); }, ms); }
      if (!AC) return;
      duckBus.gain.setTargetAtTime(ducks ? 0.22 : 1, AC.currentTime, ducks ? 0.08 : 0.5);
    },
    ducked: function () { return ducks > 0; },
    music: function (theme) { want = theme || null; if (!want) { if (W.IND_MUSIC) W.IND_MUSIC.stop(); return; } startWanted(); },
    stop: function () { want = null; if (W.IND_MUSIC) W.IND_MUSIC.stop(); },
    playing: function () { return W.IND_MUSIC ? W.IND_MUSIC.current() : null; },
    wanted: function () { return want; },
    suspended: function () { return !AC || AC.state !== 'running'; }
  };
  /* a real tap or key arms the sound; the first one also starts the music that was waiting */
  function arm() { if (armed) return; armed = true; var ac = ctx(); if (ac && ac.state === 'suspended' && !D.hidden) ac.resume(); startWanted(); }
  W.addEventListener('pointerdown', arm, { capture: true, passive: true });
  W.addEventListener('keydown', arm, { capture: true, passive: true });
  /* paused when the tab is hidden (standard §11) */
  D.addEventListener('visibilitychange', function () {
    if (!AC) return;
    try { if (D.hidden) AC.suspend(); else if (armed) AC.resume(); } catch (e) {}
  });
  W.IND_AUDIO = api;
})(window, document);
