/* Bizzing India — app shell.
   Vanilla, no build. state -> render() string templates, clicks dispatch via data-act,
   exactly the idiom Bizzing Bee uses. Everything hangs off window globals.

   Storage goes through the Store seam from the first commit (docs/07 §1) — today it is
   localStorage, tomorrow it is Supabase, and no caller changes. */

(function () {
  'use strict';

  /* =================================================================== STORE */
  /* THE SEAM. Two buckets: `sync` (would go to the cloud) and `device` (never does). */
  var Store = {
    KEY: 'bi_v1',
    DEV: 'bi_device',
    schemaVersion: 1,

    loadProfile: function () {
      try {
        var raw = localStorage.getItem(this.KEY);
        if (!raw) return null;
        return this.migrate(JSON.parse(raw));
      } catch (e) { return null; }
    },
    saveProfile: function (blob) {
      blob.schemaVersion = this.schemaVersion;
      try { localStorage.setItem(this.KEY, JSON.stringify(blob)); } catch (e) {}
    },
    loadDevice: function (k, dflt) {
      try {
        var d = JSON.parse(localStorage.getItem(this.DEV) || '{}');
        return (k in d) ? d[k] : dflt;
      } catch (e) { return dflt; }
    },
    saveDevice: function (k, v) {
      try {
        var d = JSON.parse(localStorage.getItem(this.DEV) || '{}');
        d[k] = v; localStorage.setItem(this.DEV, JSON.stringify(d));
      } catch (e) {}
    },
    migrate: function (blob) {
      /* future schema bumps land here; v1 is the baseline */
      if (!blob.schemaVersion) blob.schemaVersion = 1;
      return blob;
    },
    onRemoteChange: function () { /* no-op until the cloud lands */ }
  };

  /* =================================================================== STATE */
  var S = Store.loadProfile() || {
    schemaVersion: 1,
    name: '',
    ageBand: '8-12',
    mode: 'bade',              // chhote (4-7) | bade (8-12)
    gattu: 'ganesha',          // chosen avatar
    world: 'chitrakatha',
    homeLanguage: 'hi',
    kauris: 0,
    lit: {},                   // state code -> true, the mist pushed back
    read: {},                  // story id -> true
    lang: {},                  // packId -> { seen: {}, correct: 0, asked: 0 }
    streak: { days: [], last: null, count: 0 },
    started: null
  };

  var view = { name: 'home', arg: null, sub: null };
  var soundOn = Store.loadDevice('sound', true);

  function save() { Store.saveProfile(S); }

  /* ==================================================================== UTIL */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(n, s) { return window.IND_ICON ? window.IND_ICON(n, s) : ''; }
  function av(id, s) { return window.IND_AVATAR ? window.IND_AVATAR(id, s) : ''; }
  function today() { return new Date().toISOString().slice(0, 10); }

  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }

  function earn(n, why) {
    S.kauris += n; save();
    toast('🐚 +' + n + (why ? ' · ' + why : ''));
    var el = $('#kauriCount'); if (el) el.textContent = S.kauris;
  }

  function markToday() {
    var d = today();
    if (S.streak.last === d) return;
    var y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    S.streak.count = (S.streak.last === y) ? S.streak.count + 1 : 1;
    S.streak.last = d;
    S.streak.days.push(d);
    if (S.streak.days.length > 30) S.streak.days = S.streak.days.slice(-30);
    save();
  }

  /* light a state — the core reward beat */
  function lightState(code) {
    if (!code || S.lit[code]) return false;
    S.lit[code] = true; save();
    return true;
  }

  /* ================================================================== AUDIO */
  var audio = null;
  function speak(key) {
    if (!soundOn || !key) return;
    if (window.IND_VOICE && window.IND_VOICE.indexOf(key) < 0) return;
    try {
      if (audio) { audio.pause(); audio = null; }
      audio = new Audio('voice/' + key + '.mp3');
      audio.play().catch(function () {});
    } catch (e) {}
  }
  function stopAudio() { if (audio) { audio.pause(); audio = null; } }
  function slug(s) {
    return String(s).replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-|-$/g, '').slice(0, 60);
  }

  /* =================================================================== VIEWS */
  var Views = {};

  /* ---------------------------------------------------------------- ONBOARD */
  Views.onboard = function () {
    var packs = window.IND_AVATAR_PACKS || [];
    return '<div class="card center">' +
      '<div style="margin-bottom:10px">' + (window.GATTU ? window.GATTU('happy').replace('<svg', '<svg width="120" height="120"') : '') + '</div>' +
      '<h1>Bizzing <b style="color:var(--accent)">India</b></h1>' +
      '<p class="muted">India is going grey. Gattu remembers everything and Mithu knows every story — ' +
      'and the two of them need someone to help them tell it back.</p>' +
      '<div class="row" style="justify-content:center;margin:18px 0">' +
      '<input id="nm" class="opt" style="max-width:260px;margin:0" placeholder="What is your name?" />' +
      '</div>' +
      '<h3>Pick who travels with you</h3>' +
      '<div class="grid three" style="margin:12px 0">' +
      packs.map(function (p) {
        return p.ids.slice(0, 4).map(function (id) {
          return '<button class="tile center' + (S.gattu === id ? ' on' : '') + '" data-act="pick" data-id="' + id + '">' +
            av(id, 74) + '<div class="tiny" style="margin-top:6px">' + esc((window.IND_AVATAR_NAMES || {})[id] || id) + '</div></button>';
        }).join('');
      }).join('') +
      '</div>' +
      '<button class="btn lg block" data-act="start">Start the yatra</button>' +
      '</div>';
  };

  /* -------------------------------------------------------------- HOME/MAP */
  Views.home = function () {
    var M = window.IND_MAP, G = window.IND_GEO;
    if (!M) return '<div class="card">Map data missing.</div>';
    var litN = Object.keys(S.lit).length;
    var total = Object.keys(M.paths).length;

    var paths = Object.keys(M.paths).map(function (code) {
      var cls = 'terr' + (S.lit[code] ? ' lit' : '');
      return '<path class="' + cls + '" d="' + M.paths[code] + '" data-act="state" data-code="' + code + '"><title>' +
        esc((G && G.states[code] ? G.states[code].name : code)) + '</title></path>';
    }).join('');

    var pins = '';
    if (G && G.pins) {
      pins = Object.keys(G.pins).map(function (id) {
        var m = G.monuments.filter(function (x) { return x.id === id; })[0];
        if (!m || !S.lit[m.state]) return '';
        var p = G.pins[id];
        return '<g class="pin" data-act="mon" data-id="' + id + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="9"/></g>';
      }).join('');
    }

    return '<div class="card">' +
      '<div class="spread" style="margin-bottom:10px">' +
        '<div><h2 style="margin:0">The Living Map</h2>' +
        '<div class="tiny muted">' + litN + ' of ' + total + ' lit · tap anywhere in the mist</div></div>' +
        '<div class="pill">🪔 ' + S.streak.count + '</div>' +
      '</div>' +
      '<div class="mapwrap"><svg class="mapsvg" viewBox="' + M.viewBox + '" role="img" aria-label="Map of India">' +
        '<path class="outline" d="' + M.outline + '"/>' + paths + pins +
      '</svg></div>' +
      '<div class="legend" style="margin-top:12px">' +
        '<span><i style="background:var(--mist)"></i>still forgotten</span>' +
        '<span><i style="background:var(--accent);opacity:.6"></i>remembered</span>' +
        '<span><i style="background:var(--accent3)"></i>a place to visit</span>' +
      '</div>' +
      '</div>' +
      (litN === 0 ? '<div class="card center"><p class="muted">Nothing is lit yet. Read a story — every story you finish ' +
        'pushes the mist back off the place it comes from.</p>' +
        '<button class="btn" data-act="go" data-v="stories">Open the Story Tree</button></div>' : '');
  };

  Views.state = function (code) {
    var G = window.IND_GEO, s = G && G.states[code];
    if (!s) return '<div class="card">Nothing here yet.</div>';
    var lit = !!S.lit[code];
    var stories = (window.IND_STORIES || []).filter(function (st) {
      return (st.place || []).indexOf('IN-' + code) >= 0;
    });
    var mons = (G.monuments || []).filter(function (m) { return m.state === code; });
    var pend = (G.pending || []).filter(function (p) { return p.inside === code; });

    return '<button class="backlink" data-act="go" data-v="home">' + icon('back', 18) + ' Map</button>' +
      '<div class="card">' +
      '<div class="spread"><h1 style="margin:0">' + esc(s.name) + '</h1>' +
      (lit ? '<span class="badge aaj">remembered</span>' : '<span class="badge">in the mist</span>') + '</div>' +
      '<p class="muted tiny">Capital · ' + esc(s.capital) + (s.food ? ' · Famous for ' + esc(s.food) : '') + '</p>' +
      '<p>' + esc(s.fact) + '</p>' +
      (s.note ? '<p class="tiny muted">' + esc(s.note) + '</p>' : '') +
      (pend.length ? pend.map(function (p) {
        return '<div class="card tight" style="margin:10px 0 0"><b>' + esc(p.name) + '</b> ' +
          '<span class="tiny muted">— a separate ' + (p.type === 'ut' ? 'union territory' : 'state') + ' since ' + p.since +
          '. Our map is still drawing it inside ' + esc(s.name) + '; we are fixing that.</span>' +
          '<div class="tiny" style="margin-top:6px">' + esc(p.fact) + '</div></div>';
      }).join('') : '') +
      '</div>' +
      (mons.length ? '<div class="card"><h3>Places to see</h3>' + mons.map(function (m) {
        return '<div class="card tight" style="margin-bottom:8px"><span class="badge ' + m.badge + '">' + m.badge + '</span> ' +
          '<b>' + esc(m.name) + '</b> <span class="tiny muted">· ' + esc(m.when) + '</span>' +
          '<div class="tiny" style="margin-top:4px">' + esc(m.fact) + '</div></div>';
      }).join('') + '</div>' : '') +
      (stories.length ? '<div class="card"><h3>Stories from here</h3>' + stories.map(function (st) {
        return '<button class="tile" style="margin-bottom:8px" data-act="story" data-id="' + st.id + '">' +
          '<b>' + esc(st.title) + '</b><div class="tiny muted">' + esc(st.hook) + '</div></button>';
      }).join('') + '</div>' : '');
  };

  /* --------------------------------------------------------------- STORIES */
  Views.stories = function () {
    var cols = window.IND_COLLECTIONS || [], all = window.IND_STORIES || [];
    return '<div class="card"><h1>The Story Tree</h1>' +
      '<p class="muted">Every story you finish pushes the mist back off the place it came from.</p></div>' +
      cols.map(function (c) {
        var mine = all.filter(function (s) { return s.collection === c.id; });
        return '<div class="card"><div class="row" style="margin-bottom:10px">' +
          av(c.avatar, 54) +
          '<div><h2 style="margin:0">' + esc(c.name) + '</h2><div class="tiny muted">' + esc(c.note) + '</div></div>' +
          '</div>' +
          '<div class="grid two">' + mine.map(function (s) {
            return '<button class="tile" data-act="story" data-id="' + s.id + '">' +
              '<div class="row" style="gap:10px;align-items:flex-start">' + av(s.hero, 52) +
              '<div style="flex:1"><span class="badge ' + s.badge + '">' + s.badge + '</span>' +
              (S.read[s.id] ? ' <span class="tiny" style="color:var(--good)">✓ read</span>' : '') +
              '<div style="font-weight:800;margin-top:5px">' + esc(s.title) + '</div>' +
              '<div class="tiny muted">' + esc(s.hook) + '</div>' +
              '<div class="tiny muted" style="margin-top:4px">' + s.minutes + ' min</div></div></div></button>';
          }).join('') + '</div></div>';
      }).join('');
  };

  /* the story player — scene by scene */
  var play = { story: null, i: 0, answered: false };

  Views.story = function (id) {
    var st = (window.IND_STORIES || []).filter(function (s) { return s.id === id; })[0];
    if (!st) return '<div class="card">Story not found.</div>';
    if (!play.story || play.story.id !== id) { play.story = st; play.i = 0; play.answered = false; }

    var done = play.i >= st.scenes.length;
    if (done) return Views.storyEnd(st);

    var sc = st.scenes[play.i];
    var cast = (sc.art || []).slice(0, 2);
    var teller = sc.who === 'mithu';

    return '<button class="backlink" data-act="go" data-v="stories">' + icon('back', 18) + ' Stories</button>' +
      '<div class="spread" style="margin-bottom:10px">' +
        '<span class="badge ' + st.badge + '">' + st.badge + '</span>' +
        '<div class="progressdots">' + st.scenes.map(function (_, i) {
          return '<i class="' + (i <= play.i ? 'on' : '') + '"></i>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="stage">' +
        (teller && window.MITHU ? window.MITHU('talk').replace('<svg', '<svg width="120" height="120" class="av speaking"') :
          cast.map(function (c, i) {
            return '<div class="av' + (i === 0 ? ' speaking' : '') + '" style="display:inline-block">' + av(c, i === 0 ? 118 : 92) + '</div>';
          }).join('')) +
      '</div>' +
      '<div class="speech" style="margin-top:12px">' +
        (teller ? '<span class="who">Mithu</span>' : '') +
        '<div>' + esc(sc.text).replace(/\*(.+?)\*/g, '<i>$1</i>') + '</div>' +
      '</div>' +
      (sc.ask ? Views.ask(sc.ask) :
        '<div class="row" style="margin-top:12px">' +
        '<button class="btn ghost" data-act="say" data-k="st/' + slug(st.id) + '-' + play.i + '">' + icon('sound', 18) + ' Again</button>' +
        '<button class="btn" style="flex:1" data-act="next">Then what happened? →</button>' +
        '</div>');
  };

  Views.ask = function (a) {
    if (play.answered) {
      return '<div class="card" style="margin-top:12px;border-color:var(--accent)">' +
        '<div>' + esc(play.answered) + '</div>' +
        '<button class="btn block" style="margin-top:12px" data-act="next">Go on →</button></div>';
    }
    return '<div class="card" style="margin-top:12px">' +
      '<h3>' + esc(a.q) + '</h3>' +
      a.options.map(function (o, i) {
        return '<button class="opt" data-act="answer" data-i="' + i + '">' + esc(o) + '</button>';
      }).join('') +
      '<div class="tiny muted">There is no wrong answer here — have a guess.</div></div>';
  };

  Views.storyEnd = function (st) {
    var placeCode = (st.place || [])[0];
    placeCode = placeCode ? placeCode.replace('IN-', '') : null;
    var G = window.IND_GEO;
    var placeName = (placeCode && G && G.states[placeCode]) ? G.states[placeCode].name : null;

    return '<button class="backlink" data-act="go" data-v="stories">' + icon('back', 18) + ' Stories</button>' +
      '<div class="card center">' +
        (window.MITHU ? window.MITHU('wink').replace('<svg', '<svg width="104" height="104"') : '') +
        '<h2>' + esc(st.title) + '</h2>' +
        '<p style="font-size:17px">' + esc(st.moral) + '</p>' +
        (placeName ? '<p class="tiny" style="color:var(--good)">🪔 The mist lifted off ' + esc(placeName) + '.</p>' : '') +
      '</div>' +
      (st.words_hi && st.words_hi.length ? '<div class="card"><h3>Three words from this story</h3>' +
        '<div class="grid three">' + st.words_hi.map(function (w) {
          return '<button class="tile center" data-act="say" data-k="hi/w-' + slug(w[1]) + '">' +
            '<div class="deva" style="font-size:26px">' + esc(w[0]) + '</div>' +
            '<div class="tiny muted">' + esc(w[1]) + '</div>' +
            '<div class="tiny">' + esc(w[2]) + '</div></button>';
        }).join('') + '</div></div>' : '') +
      '<div class="card tiny muted"><b>Where this comes from.</b> ' + esc(st.source || '') + '</div>' +
      '<div class="card center"><h3>Read it in print</h3>' +
      '<p class="tiny muted">This story is in the Bizzing India ' +
      esc(st.collection === 'panchatantra' ? 'Panchatantra' : st.collection === 'birbal' ? 'Akbar &amp; Birbal' : 'Katha') +
      ' book — with all the pictures, and a QR that plays this narration.</p>' +
      '<button class="btn ghost" data-act="go" data-v="stories">Back to the tree</button></div>';
  };

  /* --------------------------------------------------------------- BHASHA */
  Views.bhasha = function () {
    if (!window.IND_SCRIPTS || !window.IND_PACKS) {
      return '<div class="card"><h1>Bhasha</h1><p class="muted">The language engine has not loaded.</p></div>';
    }
    var packs = window.IND_PACKS;
    return '<div class="card"><h1>Bhasha</h1>' +
      '<p class="muted">Not one language — a platform. The same engine drives every script, ' +
      'because almost every Indian script works the same way underneath.</p>' +
      '<span class="badge">Premium in the real product</span></div>' +
      '<div class="grid two">' + Object.keys(packs).map(function (k) {
        var p = packs[k], sc = window.IND_SCRIPTS[p.script];
        var st = S.lang[k] || { asked: 0, correct: 0 };
        return '<button class="tile" data-act="pack" data-id="' + k + '">' +
          '<div class="deva" style="font-size:34px">' + esc((sc && sc.consonants && sc.consonants[0] ? sc.consonants[0].char : '')) + '</div>' +
          '<div style="font-weight:800;margin-top:6px">' + esc(p.name.native || p.name.en) + '</div>' +
          '<div class="tiny muted">' + esc(p.name.en) + ' · ' + esc(sc ? sc.name : p.script) + '</div>' +
          '<div class="tiny" style="margin-top:6px">' + st.correct + ' right of ' + st.asked + '</div>' +
          '</button>';
      }).join('') + '</div>' +
      '<div class="card tiny muted"><b>Note.</b> The Hindi and Punjabi audio here is synthesised, as a ' +
      'placeholder. Per <code>docs/09</code> it must be replaced with human voice before launch — children ' +
      'imitate these sounds, and TTS teaches errors a native-speaker parent hears instantly.</div>';
  };

  var quiz = { packId: null, stage: null, q: null, done: 0, right: 0 };

  Views.pack = function (packId) {
    var p = window.IND_PACKS[packId];
    if (!p) return '<div class="card">Pack not found.</div>';
    var sc = window.IND_SCRIPTS[p.script];
    if (quiz.packId !== packId) { quiz.packId = packId; quiz.stage = null; quiz.q = null; quiz.done = 0; quiz.right = 0; }

    if (quiz.q) {
      return '<button class="backlink" data-act="pack" data-id="' + packId + '">' + icon('back', 18) + ' ' + esc(p.name.en) + '</button>' +
        Views.question(quiz.q);
    }

    /* letter chart + the stage ladder */
    return '<button class="backlink" data-act="go" data-v="bhasha">' + icon('back', 18) + ' Bhasha</button>' +
      '<div class="card"><h1 class="deva">' + esc(p.name.native) + ' <span class="muted" style="font-size:16px;font-family:var(--body)">' + esc(p.name.en) + '</span></h1>' +
      '<p class="muted tiny">Script · ' + esc(sc.name) + ' · tap any letter to hear it</p>' +
      '<h3 style="margin-top:14px">Vowels</h3>' +
      '<div class="gridscript">' + (sc.vowels || []).map(function (v) {
        return '<button class="glyph" data-act="say" data-k="' + esc(v.audio || '') + '">' + esc(v.char) +
          '<small>' + esc(v.name) + '</small></button>';
      }).join('') + '</div>' +
      '<h3 style="margin-top:14px">Consonants</h3>' +
      '<div class="gridscript">' + (sc.consonants || []).map(function (c) {
        return '<button class="glyph" data-act="say" data-k="' + esc(c.audio || '') + '">' + esc(c.char) +
          '<small>' + esc(c.name) + '</small></button>';
      }).join('') + '</div></div>' +
      '<div class="card"><h3>The ladder</h3>' +
      '<p class="tiny muted">Same ladder in every language — that is the point of the engine.</p>' +
      (p.stages || []).map(function (st) {
        return '<button class="tile" style="margin-bottom:8px" data-act="quiz" data-s="' + esc(st.id) + '">' +
          '<b>' + esc(st.name) + '</b>' +
          (st.desc ? '<div class="tiny muted">' + esc(st.desc) + '</div>' : '') + '</button>';
      }).join('') + '</div>';
  };

  /* one renderer for every exercise type the engine emits — options are objects
     ({char}/{word}/{sign}/{en}) or bare strings, so pull the first that fits */
  function optLabel(o) {
    if (o == null) return '';
    if (typeof o === 'string') return o;
    return o.char || o.word || o.sign || o.syllable || o.en || o.roman || '';
  }
  function optSub(o) {
    if (!o || typeof o === 'string') return '';
    if (o.word && o.en) return o.en;
    return o.name || o.roman || '';
  }

  Views.question = function (q) {
    var opts = q.options || q.tiles || [];
    var prompt, hint = '', big = '';

    switch (q.type) {
      case 'listenPoint':
        prompt = 'Listen — which one is it?'; break;
      case 'soundMatch':
        prompt = 'Which letter makes this sound?'; break;
      case 'matraAttach':
        prompt = 'Add this matra to the letter';
        big = '<div class="bigglyph"><span class="deva">' + esc(q.base) + '</span>' +
              ' <span style="color:var(--accent)">+</span> <span class="deva">' + esc(q.matra) + '</span></div>';
        hint = 'It goes ' + esc(q.position || 'somewhere') + '.'; break;
      case 'wordBuild':
        prompt = 'Which piece starts this word?';
        big = '<div class="bigglyph deva">' + esc(q.word || '') + '</div>';
        hint = esc(q.en || q.roman || ''); break;
      case 'oddOneOut':
        prompt = 'Which one does not belong?'; break;
      case 'conjunctSplit':
        prompt = 'This letter is two letters squashed together. Which two?';
        big = '<div class="bigglyph deva">' + esc(q.conjunct || '') + '</div>';
        hint = q.word ? 'As in ' + esc(q.word) : ''; break;
      default:
        prompt = q.prompt || 'Pick the right one';
    }

    var useGrid = ['soundMatch', 'matraAttach', 'oddOneOut', 'conjunctSplit', 'wordBuild'].indexOf(q.type) >= 0;
    var choices = opts.map(function (o, i) {
      var lab = esc(optLabel(o)), sub = esc(optSub(o));
      return useGrid
        ? '<button class="glyph" data-act="ans" data-i="' + i + '">' + lab + (sub ? '<small>' + sub + '</small>' : '') + '</button>'
        : '<button class="opt" data-act="ans" data-i="' + i + '"><span class="deva" style="font-size:22px">' + lab +
          '</span>' + (sub ? ' <span class="muted tiny">' + sub + '</span>' : '') + '</button>';
    }).join('');

    return '<div class="card">' +
      '<h3>' + esc(prompt) + '</h3>' + big +
      (q.audio ? '<button class="btn ghost block" style="margin-bottom:12px" data-act="say" data-k="' + esc(q.audio) + '">' +
        icon('sound', 20) + ' Play it again</button>' : '') +
      (hint ? '<p class="tiny muted">' + hint + '</p>' : '') +
      (useGrid ? '<div class="gridscript">' + choices + '</div>' : choices) +
      '<div class="tiny muted" style="margin-top:12px">' + quiz.right + ' right of ' + quiz.done +
      ' · no timer, no lives — have a go</div></div>';
  };

  /* ------------------------------------------------------------------ MELA */
  Views.mela = function () {
    var G = window.IND_GAMES || [];
    if (!G.length) return '<div class="card"><h1>The Mela</h1><p class="muted">The games have not loaded.</p></div>';
    return '<div class="card"><h1>The Mela</h1><p class="muted">The carnival. Every stall is a drill wearing a costume.</p></div>' +
      '<div class="grid two">' + G.map(function (g) {
        return '<button class="tile" data-act="game" data-id="' + g.id + '">' +
          '<div style="font-weight:800">' + esc(g.name) + '</div>' +
          '<div class="tiny muted">' + esc(g.blurb || '') + '</div>' +
          '<div class="tiny muted" style="margin-top:6px">' + (g.minutes || 2) + ' min</div></button>';
      }).join('') + '</div>';
  };

  Views.game = function (id) {
    return '<button class="backlink" data-act="go" data-v="mela">' + icon('back', 18) + ' Mela</button>' +
      '<div class="card"><div id="gamehost"></div></div>';
  };

  /* -------------------------------------------------------------------- ME */
  Views.me = function () {
    var packs = window.IND_AVATAR_PACKS || [];
    var worlds = ['chitrakatha', 'madhubani', 'warli', 'pattachitra', 'gond', 'kalamkari', 'phad', 'mughal', 'tanjore', 'kalighat'];
    var days = S.streak.days.slice(-14);
    return '<div class="card">' +
      '<div class="row">' + av(S.gattu, 84) +
      '<div><h1 style="margin:0">' + esc(S.name || 'Yatri') + '</h1>' +
      '<div class="tiny muted">🐚 ' + S.kauris + ' kauris · ' + Object.keys(S.lit).length + ' places remembered · ' +
      Object.keys(S.read).length + ' stories read</div></div></div>' +
      '<div class="streak" style="margin-top:14px">' + days.map(function () { return '<i class="lit">🪔</i>'; }).join('') +
      (days.length === 0 ? '<span class="tiny muted">Light your first diya by finishing a story.</span>' : '') +
      '</div></div>' +

      '<div class="card"><h3>Your world</h3>' +
      '<p class="tiny muted">Each is a real Indian folk-art tradition. Tap to re-skin everything.</p>' +
      '<div class="row">' + worlds.map(function (w) {
        return '<button class="pill" data-act="world" data-w="' + w + '"' +
          (S.world === w ? ' style="border-color:var(--accent)"' : '') + '>' + esc(w) + '</button>';
      }).join('') + '</div></div>' +

      '<div class="card"><h3>Who travels with you</h3>' +
      packs.map(function (p) {
        return '<div style="margin-bottom:14px"><div class="tiny muted" style="margin-bottom:6px">' +
          esc(p.name) + ' — ' + esc(p.note) + '</div>' +
          '<div class="grid three">' + p.ids.map(function (id) {
            return '<button class="tile center" data-act="pick" data-id="' + id + '"' +
              (S.gattu === id ? ' style="border-color:var(--accent)"' : '') + '>' +
              av(id, 62) + '<div class="tiny" style="margin-top:4px">' +
              esc((window.IND_AVATAR_NAMES || {})[id] || id) + '</div></button>';
          }).join('') + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>Grown-ups</h3>' +
      '<div class="row"><button class="btn ghost" data-act="sound">' + icon('sound', 18) + ' Sound: ' + (soundOn ? 'on' : 'off') + '</button>' +
      '<button class="btn ghost" data-act="reset">Start again</button></div>' +
      '<p class="tiny muted" style="margin-top:10px">This demo keeps everything on this device only. ' +
      'No account, no child data leaves the browser.</p></div>';
  };

  /* ================================================================== SHELL */
  function chrome() {
    var tabs = [['home', 'Map', 'map'], ['stories', 'Stories', 'tree'],
                ['bhasha', 'Bhasha', 'script'], ['mela', 'Mela', 'game'], ['me', 'Me', 'parent']];
    return '<div class="topbar">' +
      '<div class="brand">' + (window.GATTU ? window.GATTU('happy').replace('<svg', '<svg width="30" height="30"') : '') +
      'Bizzing <b>India</b></div>' +
      '<span class="pill">🐚 <span id="kauriCount">' + S.kauris + '</span></span>' +
      '<button class="iconbtn" data-act="sound" aria-label="sound">' + icon('sound', 20) + '</button>' +
      '</div>' +
      '<div class="wrap" id="main"></div>' +
      '<nav class="tabs">' + tabs.map(function (t) {
        return '<button class="tab' + (view.name === t[0] || (view.name === 'state' && t[0] === 'home') ? ' active' : '') +
          '" data-act="go" data-v="' + t[0] + '">' + icon(t[2], 22) + '<span>' + t[1] + '</span></button>';
      }).join('') + '</nav>';
  }

  function render() {
    document.documentElement.setAttribute('data-world', S.world);
    var root = document.getElementById('app');

    if (!S.started) { root.innerHTML = '<div class="wrap">' + Views.onboard() + '</div>'; return; }
    if (!$('.topbar')) root.innerHTML = chrome();

    var main = $('#main');
    var html = '';
    switch (view.name) {
      case 'home':    html = Views.home(); break;
      case 'state':   html = Views.state(view.arg); break;
      case 'stories': html = Views.stories(); break;
      case 'story':   html = Views.story(view.arg); break;
      case 'bhasha':  html = Views.bhasha(); break;
      case 'pack':    html = Views.pack(view.arg); break;
      case 'mela':    html = Views.mela(); break;
      case 'game':    html = Views.game(view.arg); break;
      case 'me':      html = Views.me(); break;
      default:        html = Views.home();
    }
    main.innerHTML = html;
    main.scrollIntoView({ block: 'start' });

    /* tab highlight */
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (t) {
      var v = t.getAttribute('data-v');
      t.classList.toggle('active', v === view.name ||
        (view.name === 'state' && v === 'home') ||
        (view.name === 'story' && v === 'stories') ||
        (view.name === 'pack' && v === 'bhasha') ||
        (view.name === 'game' && v === 'mela'));
    });

    if (view.name === 'game') mountGame(view.arg);
  }

  function go(name, arg) { stopAudio(); view = { name: name, arg: arg }; render(); }

  function mountGame(id) {
    var g = (window.IND_GAMES || []).filter(function (x) { return x.id === id; })[0];
    var host = $('#gamehost');
    if (!g || !host) return;
    try {
      g.engine(host, {}, function (res) {
        res = res || {};
        var k = res.kauris || (res.win ? 10 : 4);
        earn(k, g.name);
        markToday();
        setTimeout(function () { go('mela'); }, 900);
      });
    } catch (e) {
      host.innerHTML = '<p class="muted">This stall could not open: ' + esc(e.message) + '</p>';
    }
  }

  /* =============================================================== DISPATCH */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    if (!t) return;
    var a = t.getAttribute('data-act');

    if (a === 'go')     return go(t.getAttribute('data-v'));
    if (a === 'state')  return go('state', t.getAttribute('data-code'));
    if (a === 'story') {
      var id = t.getAttribute('data-id');
      play = { story: null, i: 0, answered: false };
      go('story', id);
      var st = (window.IND_STORIES || []).filter(function (s) { return s.id === id; })[0];
      if (st) speak('st/' + slug(st.id) + '-0');
      return;
    }
    if (a === 'next') {
      play.i++; play.answered = false;
      var s = play.story;
      if (s && play.i >= s.scenes.length) {
        if (!S.read[s.id]) {
          S.read[s.id] = true;
          var code = (s.place || [])[0];
          if (code) lightState(code.replace('IN-', ''));
          earn(12, 'story finished');
          markToday();
        }
        save();
      } else if (s) {
        speak('st/' + slug(s.id) + '-' + play.i);
      }
      return render();
    }
    if (a === 'answer') {
      var sc = play.story.scenes[play.i], ask = sc.ask;
      var i = +t.getAttribute('data-i');
      play.answered = (i === ask.answer) ? ask.right : ask.wrong;
      if (i === ask.answer) earn(3, 'good thinking');
      return render();
    }
    if (a === 'say')    return speak(t.getAttribute('data-k'));
    if (a === 'pick') {
      S.gattu = t.getAttribute('data-id'); save();
      return render();
    }
    if (a === 'world') {
      S.world = t.getAttribute('data-w'); save();
      return render();
    }
    if (a === 'start') {
      var nm = $('#nm');
      S.name = (nm && nm.value.trim()) || 'Yatri';
      S.started = today(); save();
      return go('home');
    }
    if (a === 'sound') {
      soundOn = !soundOn; Store.saveDevice('sound', soundOn);
      if (!soundOn) stopAudio();
      toast('Sound ' + (soundOn ? 'on' : 'off'));
      return render();
    }
    if (a === 'reset') {
      if (confirm('Clear everything on this device and start again?')) {
        localStorage.removeItem(Store.KEY); location.reload();
      }
      return;
    }
    if (a === 'mon') {
      var m = (window.IND_GEO.monuments || []).filter(function (x) { return x.id === t.getAttribute('data-id'); })[0];
      if (m) toast(m.name + ' — ' + m.fact);
      return;
    }
    if (a === 'pack')   { quiz = { packId: null, stage: null, q: null, done: 0, right: 0 }; return go('pack', t.getAttribute('data-id')); }
    if (a === 'game')   return go('game', t.getAttribute('data-id'));
    if (a === 'quiz')   {
      quiz.stage = t.getAttribute('data-s') || quiz.stage;
      quiz.q = window.IND_BHASHA.nextQuestion(quiz.packId, quiz.stage, Date.now());
      if (quiz.q && quiz.q.audio) speak(quiz.q.audio);
      return render();
    }
    if (a === 'ans') {
      var q = quiz.q, idx = +t.getAttribute('data-i');
      /* the engine reports answerIndex; `answer` is the value, not the position */
      var want = (typeof q.answerIndex === 'number') ? q.answerIndex : q.answer;
      var ok = (idx === want);
      var rec = S.lang[quiz.packId] || (S.lang[quiz.packId] = { asked: 0, correct: 0, seen: {} });
      rec.asked++; if (ok) rec.correct++;
      save();
      t.classList.add(ok ? 'right' : 'wrong');
      if (!ok && typeof want === 'number') {
        var right = document.querySelector('[data-act="ans"][data-i="' + want + '"]');
        if (right) right.classList.add('right');
      }
      if (ok) { earn(2, 'correct'); quiz.right++; }
      quiz.done++;
      setTimeout(function () {
        quiz.q = window.IND_BHASHA.nextQuestion(quiz.packId, quiz.stage, Date.now() + quiz.done);
        if (quiz.q && quiz.q.audio) speak(quiz.q.audio);
        render();
      }, ok ? 620 : 1200);
      return;
    }
  });

  /* keyboard: every interactive surface is reachable without a mouse */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (view.name !== 'home') go('home'); }
    if (e.key === 'ArrowRight' && view.name === 'story') {
      var n = document.querySelector('[data-act="next"]'); if (n) n.click();
    }
  });

  /* ==================================================================== BOOT */
  document.addEventListener('DOMContentLoaded', function () {
    render();
    window.BI = { S: S, go: go, render: render, Store: Store };   /* dev handle */
  });
})();
