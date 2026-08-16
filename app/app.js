/* Bizzing India — app shell.
   Vanilla, no build. state -> render() string templates, clicks dispatch via data-act,
   the idiom Bizzing Bee uses. Everything hangs off window globals.

   Storage goes through the Store seam from the first commit (docs/07 §1) — today it is
   localStorage, tomorrow Supabase, and no caller changes. */

(function () {
  'use strict';

  /* =================================================================== STORE */
  var Store = {
    KEY: 'bi_v1', DEV: 'bi_device', schemaVersion: 1,
    loadProfile: function () {
      try { var raw = localStorage.getItem(this.KEY); return raw ? this.migrate(JSON.parse(raw)) : null; }
      catch (e) { return null; }
    },
    saveProfile: function (b) { b.schemaVersion = this.schemaVersion; try { localStorage.setItem(this.KEY, JSON.stringify(b)); } catch (e) {} },
    loadDevice: function (k, d) { try { var o = JSON.parse(localStorage.getItem(this.DEV) || '{}'); return (k in o) ? o[k] : d; } catch (e) { return d; } },
    saveDevice: function (k, v) { try { var o = JSON.parse(localStorage.getItem(this.DEV) || '{}'); o[k] = v; localStorage.setItem(this.DEV, JSON.stringify(o)); } catch (e) {} },
    migrate: function (b) { if (!b.schemaVersion) b.schemaVersion = 1; return b; },
    onRemoteChange: function () {},

    /* BLOBS. Recorded voices do not fit in localStorage, so they go to IndexedDB — but they
       go through this seam like everything else, because the whole point of the seam is that
       swapping the backend later touches one file. When the family account exists these four
       methods get a sync partner; nothing above them changes.

       These recordings are the most personal thing in the app. They stay on the device: no
       upload, no third party, no analytics on them. archive.promises in data-nani.js states
       that to the family in writing, and this is where the code has to keep it. */
    DB: 'bi_voices', STORE: 'clips',
    _db: function (fn) {
      if (!window.indexedDB) return fn(null);
      var rq = indexedDB.open(this.DB, 1), self = this;
      rq.onupgradeneeded = function () { rq.result.createObjectStore(self.STORE, { keyPath: 'id' }); };
      rq.onsuccess = function () { fn(rq.result); };
      rq.onerror = function () { fn(null); };
    },
    putClip: function (rec, fn) {
      this._db(function (db) {
        if (!db) return fn && fn(false);
        var t = db.transaction(Store.STORE, 'readwrite');
        t.objectStore(Store.STORE).put(rec);
        t.oncomplete = function () { fn && fn(true); };
        t.onerror = function () { fn && fn(false); };
      });
    },
    listClips: function (fn) {
      this._db(function (db) {
        if (!db) return fn([]);
        var rq = db.transaction(Store.STORE).objectStore(Store.STORE).getAll();
        rq.onsuccess = function () {
          fn((rq.result || []).sort(function (a, b) { return b.at - a.at; }));
        };
        rq.onerror = function () { fn([]); };
      });
    },
    delClip: function (id, fn) {
      this._db(function (db) {
        if (!db) return fn && fn();
        var t = db.transaction(Store.STORE, 'readwrite');
        t.objectStore(Store.STORE).delete(id);
        t.oncomplete = function () { fn && fn(); };
      });
    }
  };

  /* =================================================================== STATE */
  var S = Store.loadProfile() || {
    schemaVersion: 1, name: '', age: 8, mode: 'bade',
    tongue: null,                 /* mother-tongue id from data-tongue.js; null = lean nowhere */
    buddy: 'ganesha', world: 'chitrakatha',
    kauris: 0, xp: 0,
    lit: {}, read: {}, lang: {},
    streak: { days: [], last: null, count: 0 },
    goal: 3, todayCount: 0, todayOn: null,
    started: null
  };
  var view = { name: 'home', arg: null };
  var lastScrollSig = '';
  var soundOn = Store.loadDevice('sound', true);
  var night = Store.loadDevice('night', false);
  function save() { Store.saveProfile(S); }

  /* the Gurukul rank ladder — every theme in Bizzing Bee carries one of these */
  var RANKS = ['Shishya', 'Vidyarthi', 'Sadhak', 'Khoji', 'Pandit', 'Vidwan', 'Acharya', 'Rishi'];
  function level() { var n = Math.floor(S.xp / 60); return Math.max(0, Math.min(RANKS.length - 1, n)); }
  function rank() { return RANKS[level()]; }

  var WORLDS = [
    { id: 'chitrakatha', name: 'Chitrakatha', region: 'Pan-Indian', note: 'A painted scroll, unrolling. The storyteller’s cloth.' },
    { id: 'madhubani',   name: 'Madhubani',   region: 'Bihar',        note: 'Fish, lotuses and suns, double-outlined, painted by women on village walls.' },
    { id: 'warli',       name: 'Warli',       region: 'Maharashtra',  note: 'White stick figures dancing in circles on red earth. Thousands of years old.' },
    { id: 'pattachitra', name: 'Pattachitra', region: 'Odisha',       note: 'Fine floral borders and long eyes, painted on treated cloth. No green, ever.' },
    { id: 'gond',        name: 'Gond',        region: 'Madhya Pradesh', note: 'Animals filled with dots and dashes, in colours that hum.' },
    { id: 'kalamkari',   name: 'Kalamkari',   region: 'Andhra Pradesh', note: 'Drawn with a bamboo pen and natural dye, story told in panels.' },
    { id: 'phad',        name: 'Phad',        region: 'Rajasthan',    note: 'A long scroll of a hero’s whole life, sung by a bard at night.' },
    { id: 'mughal',      name: 'Mughal Miniature', region: 'The courts', note: 'Jewel colours and gold leaf, small enough to hold in your hand.' },
    { id: 'tanjore',     name: 'Tanjore',     region: 'Tamil Nadu',   note: 'Gold leaf and gemstones set into the painting itself.' },
    { id: 'kalighat',    name: 'Kalighat',    region: 'Bengal',       note: 'Big, fast, modern-feeling brushstrokes sold outside a temple.' }
  ];

  /* ==================================================================== UTIL */
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function icon(n, s) { return window.IND_ICON ? window.IND_ICON(n, s) : ''; }
  function today() { return new Date().toISOString().slice(0, 10); }
  function slug(s) { return String(s).replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-|-$/g, '').slice(0, 60); }

  /* prefer the generated PNG art; fall back to the inline SVG set */
  function art(id, size) {
    var have = window.IND_ART_IMG && window.IND_ART_IMG.indexOf(id) >= 0;
    if (have) return '<img src="art/' + id + '.png" width="' + (size || 76) + '" height="' + (size || 76) +
      '" alt="" loading="lazy">';
    return window.IND_AVATAR ? window.IND_AVATAR(id, size || 76) : '';
  }
  function mascot(which, mood, size) {
    var key = which + (mood ? '_' + mood : '');
    if (window.IND_ART_IMG && window.IND_ART_IMG.indexOf(key) >= 0) return art(key, size);
    if (window.IND_ART_IMG && window.IND_ART_IMG.indexOf(which) >= 0) return art(which, size);
    var fn = which === 'gattu' ? window.GATTU : which === 'mithu' ? window.MITHU : window.VISMRITI;
    return fn ? fn(mood).replace('<svg', '<svg width="' + (size || 76) + '" height="' + (size || 76) + '"') : '';
  }

  /* the hero painting for a story, when one exists */
  function storyArt(id) {
    var k = slug(id);
    return (window.IND_STORY_ART && window.IND_STORY_ART.indexOf(k) >= 0) ? 'art/story/' + k + '.jpg' : null;
  }

  /* A painting per CARD — <epicId>-<episode>-<card>. The episode list uses card 0 of each
     episode as its thumbnail, so nothing needs a separate hero image.

     On weight: 686 paintings is about 68MB in the repo, but the browser only fetches the
     card actually on screen, so a child downloads ~100KB per card turned, not 68MB. That
     stays true until a service worker starts precaching for offline, at which point epic
     art should be cache-on-read rather than precached with the shell.

     Everything degrades to no image while the art is still generating. */
  function epicArt(epicId, n, i) {
    var k = epicId + '-' + n + (i === undefined ? '-0' : '-' + i);
    return (window.IND_EPIC_ART && window.IND_EPIC_ART.indexOf(k) >= 0) ? 'art/epic/' + k + '.jpg' : null;
  }

  function stateArt(code) {
    return (window.IND_STATE_ART && window.IND_STATE_ART.indexOf(code) >= 0) ? 'art/state/' + code + '.jpg' : null;
  }

  /* ------------------------------------------------------- MOTHER TONGUE */
  /* The family's language, chosen once and changeable any time (data-tongue.js).
     Leaning is ORDERING, never gating: nothing is hidden from any child by any
     of these helpers. The pillar names stay Sanskrit for everyone. */
  function tongue() { var T = window.IND_TONGUE; return (T && S.tongue) ? T.get(S.tongue) : null; }
  function homeStates() { var t = tongue(); return (t && t.states) || []; }
  function isHome(c) { return homeStates().indexOf(c) >= 0; }
  /* What THIS family calls a grandparent. The role ids are the Hindi ones the
     Ask-Nani data is keyed by; the word shown is the family's own. */
  function kinTerm(role) {
    if (!role || role === 'any') return 'someone older';
    var base = { nani: 'Nani', nana: 'Nana', dadi: 'Dadi', dada: 'Dada' };
    var t = tongue();
    return (t && t.kin && t.kin[role]) || base[role] || role;
  }
  /* Swap the address word at the head of an English question — ONLY the
     English. The Hindi lines agree their verbs with the addressee and are
     never string-swapped (see the warning in data-nani.js). */
  function kinEn(q) {
    var t = tongue();
    if (!t || t.id === 'hi' || !q) return q && q.en;
    return q.en.replace(/^(Nani|Nana|Dadi|Dada)\b/, kinTerm(q.to));
  }
  /* 'Nani-Nana Stories' in the family's own words — 'Paati-Thaatha Stories'
     for a Tamil child. The Hindi default keeps the authored title. */
  function naniTitle() {
    var N = window.IND_NANI, t = tongue();
    if (!N) return '';
    if (!t || t.id === 'hi') return N.archive.title;
    return kinTerm('nani') + '-' + kinTerm('nana') + ' Stories';
  }
  /* The picker row, shared by onboarding and the tongue page. */
  function tongueChips() {
    var T = window.IND_TONGUE; if (!T) return '';
    return '<div class="row" style="margin-top:10px">' + T.list.map(function (t) {
      return '<button class="pill' + (S.tongue === t.id ? ' on' : '') + '" data-act="settongue" ' +
        'data-id="' + t.id + '"><span lang="' + t.lang + '">' + esc(t.native) + '</span>' +
        ' <span class="tiny muted">' + esc(t.en) + '</span></button>';
    }).join('') +
      '<button class="pill' + (!S.tongue ? ' on' : '') + '" data-act="settongue" data-id="">' +
      'All of them</button></div>';
  }

  /* one avatar chip, graded by rarity */
  function chip(id, size) {
    var r = window.IND_RARITY_OF ? window.IND_RARITY_OF(id) : 'free';
    var meta = (window.IND_RARITY || {})[r] || {};
    return '<button class="avchip' + (S.buddy === id ? ' on' : '') + '" data-rar="' + r +
      '" data-act="pick" data-id="' + id + '" title="' + esc(meta.label || '') + '">' +
      art(id, size) +
      '<span>' + esc((window.IND_AVATAR_NAMES || {})[id] || id) + '</span>' +
      (r !== 'free' ? '<span class="rarlabel">' + esc(meta.label || r) + '</span>' : '') +
      '</button>';
  }

  /* Stories arrive one file at a time and the library only ever grows, so each source is
     folded in defensively — a file that has not loaded yet costs an empty array, not a
     crash. Add the next batch here and everywhere downstream picks it up. */
  function allStories() {
    return (window.IND_STORIES || [])
      .concat(window.IND_STORIES_REGIONAL || [])
      .concat(window.IND_STORIES_MORE || [])
      .concat(window.IND_STORIES_SOUTH || [])
      .concat(window.IND_STORIES_NORTH || [])
      .concat(window.IND_STORIES_EAST || [])
      .concat(window.IND_STORIES_WEST || [])
      .concat(window.IND_STORIES_NE_A || [])
      .concat(window.IND_STORIES_NE_B || [])
      .concat(window.IND_STORIES_MODERN || [])
      .concat(window.IND_STORIES_VIGYAN || []);
  }
  function allCollections() {
    return (window.IND_COLLECTIONS || [])
      .concat(window.IND_COLLECTIONS_REGIONAL || [])
      .concat(window.IND_COLLECTIONS_MORE || [])
      .concat(window.IND_COLLECTIONS_SOUTH || [])
      .concat(window.IND_COLLECTIONS_NORTH || [])
      .concat(window.IND_COLLECTIONS_EAST || [])
      .concat(window.IND_COLLECTIONS_WEST || [])
      .concat(window.IND_COLLECTIONS_NE_A || [])
      .concat(window.IND_COLLECTIONS_NE_B || [])
      .concat(window.IND_COLLECTIONS_MODERN || [])
      .concat(window.IND_COLLECTIONS_VIGYAN || []);
  }

  function toast(m) {
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = m;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2300);
  }
  function earn(n, why) {
    S.kauris += n; S.xp += n; save();
    toast('🐚 +' + n + (why ? ' · ' + why : ''));
    var el = $('#kauriCount'); if (el) el.textContent = S.kauris;
  }
  function markToday() {
    var d = today();
    if (S.todayOn !== d) { S.todayOn = d; S.todayCount = 0; }
    S.todayCount++;
    if (S.streak.last !== d) {
      var y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      S.streak.count = (S.streak.last === y) ? S.streak.count + 1 : 1;
      S.streak.last = d; S.streak.days.push(d);
      if (S.streak.days.length > 30) S.streak.days = S.streak.days.slice(-30);
    }
    save();
  }
  function lightState(c) { if (!c || S.lit[c]) return false; S.lit[c] = true; save(); return true; }

  /* ================================================================== AUDIO */
  var audio = null;
  /* SPEAK, AND NEVER SILENTLY FAIL.
     This used to return quietly when a key was not in the manifest, which is how 67 of the
     74 Hindi words sat mute for weeks without anybody noticing: the button was there, the
     tap registered, nothing happened and nothing complained. A recorded clip is always
     preferred — it is a real voice with the vowel lengths right — but when one does not
     exist yet, the device speaks the text instead, in the right language, so the child
     always hears something and a missing clip is obvious rather than invisible. */
  function speak(key, text, lang) {
    if (!soundOn) return;
    if (key && (!window.IND_VOICE || window.IND_VOICE.indexOf(key) >= 0)) {
      try {
        if (audio) audio.pause();
        audio = new Audio('voice/' + key + '.mp3');
        audio.play().catch(function () {});
        return;
      } catch (e) {}
    }
    if (!text || !window.speechSynthesis) return;
    try {
      stopAudio();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang || 'hi-IN';
      u.rate = 0.8;                 /* slower: this is a word being taught, not narration */
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function stopAudio() {
    if (audio) { audio.pause(); audio = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  /* Read something aloud, whether or not a recorded clip exists yet.
     The bundled MP3 is always preferred: it is US English with SSML phoneme tags so Indian
     names are said properly, which the browser's own voice will not do. But a "read it to
     me" button that silently does nothing is worse than a slightly wrong pronunciation, and
     686 epic cards narrate over hours — so the browser voice covers the gap and the clip
     takes over the moment it lands. */
  function readAloud(key, text) {
    if (!soundOn) return;
    if (key && window.IND_VOICE && window.IND_VOICE.indexOf(key) >= 0) return speak(key);
    if (!text || !window.speechSynthesis) return;
    try {
      stopAudio();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.92; u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* =================================================================== VIEWS */
  var V = {};

  /* -------------------------------------------------------------- LANDING */
  V.landing = function () {
    return '<div class="wrap">' +
      '<div class="hero">' +
        '<div>' +
          '<span class="eyebrow">' + mascot('gattu', 'happy', 26) + 'For Indian kids growing up anywhere</span>' +
          '<h1 style="margin-top:18px">India is going grey.<br>Help them<br>remember it.</h1>' +
          '<p class="lede">A story-first world where your child learns India’s history, faiths, myths, ' +
          'geography and languages — by lighting up a map that starts in the mist.</p>' +
          '<div class="row" style="margin:22px 0">' +
            '<button class="btn lg" data-act="begin">Start free →</button>' +
            '<button class="btn ghost lg" data-act="begin">I have an account</button>' +
          '</div>' +
          '<ul class="ticks">' +
            '<li>' + icon('lock', 20) + '<span><b>100% offline</b> — nothing about your child leaves the device</span></li>' +
            '<li>' + icon('sound', 20) + '<span>Every story <b>read aloud</b>, so a four-year-old can use it alone</span></li>' +
            '<li>' + icon('script', 20) + '<span><b>Hindi and Punjabi</b> in their own scripts — more languages coming</span></li>' +
          '</ul>' +
        '</div>' +
        '<div class="herocard">' +
          mascot('mithu', 'talk', 116) +
          '<div class="mono" style="margin:10px 0 4px">Today’s story</div>' +
          '<h2 style="font-size:32px">The Lion Who<br>Met Himself</h2>' +
          '<p class="tiny">A lion who ate whatever he liked. And one small rabbit who had had enough.</p>' +
          '<button class="btn block" data-act="begin">Read it →</button>' +
          '<div class="row" style="margin-top:18px;gap:10px">' +
            '<div class="card flat tight" style="flex:1;margin:0"><div class="mono">Stories</div><b style="font-size:19px">11</b></div>' +
            '<div class="card flat tight" style="flex:1;margin:0"><div class="mono">Places</div><b style="font-size:19px">34</b></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="grid g3" style="margin-top:10px">' +
        [['tree', 'Stories they will actually sit for', 'Panchatantra, Akbar &amp; Birbal, the Ramayana, the Buddha and Mahavira — told properly, with a choice to make in the middle.'],
         ['map', 'A map that fills in', 'Finish a story and the mist lifts off the place it came from. Geography, progress and navigation in one.'],
         ['script', 'Real script, from day one', 'Devanagari and Gurmukhi on the same engine. No romanised shortcuts.']]
        .map(function (c) {
          return '<div class="card"><div style="width:44px;height:44px;border-radius:13px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;margin-bottom:12px">' +
            icon(c[0], 24) + '</div><h3>' + c[1] + '</h3><p class="tiny">' + c[2] + '</p></div>';
        }).join('') +
      '</div></div>';
  };

  /* ------------------------------------------------------------- ONBOARDING */
  /* Picking a chip re-renders the whole form, so the typed name is carried
     across renders by hand — otherwise choosing your buddy erased your name. */
  var obName = '';
  V.onboard = function () {
    var packs = window.IND_AVATAR_PACKS || [];
    return '<div class="wrap" style="max-width:640px">' +
      '<div class="dots center" style="justify-content:center;margin-bottom:18px"><i class="on"></i><i></i></div>' +
      '<div class="card" style="padding:var(--space-2xl)">' +
        '<h1>Who’s exploring?</h1>' +
        '<p>Set up your traveller. Nothing here leaves this device.</p>' +
        '<label class="tiny" style="font-weight:700">Name</label>' +
        '<input id="nm" class="opt" style="margin:6px 0 18px" placeholder="Their name" value="' + esc(obName) + '" />' +
        '<label class="tiny" style="font-weight:700">Age · <b id="ageOut">' + S.age + '</b></label>' +
        '<input id="ageIn" type="range" min="4" max="12" value="' + S.age + '" style="width:100%;margin:10px 0 6px" />' +
        '<p class="tiny muted">4–7 gets big pictures and no reading. 8–12 gets the map, quizzes and script.</p>' +
        '<h3 style="margin-top:22px">What does your family speak at home?</h3>' +
        '<p class="tiny muted" style="margin:4px 0 0">Your family’s places rise to the top of the ' +
        'shelf, your state glows on the map, and the grandparent words become your own. Nothing is ' +
        'hidden either way — skip it or change it whenever you like.</p>' +
        tongueChips() +
        '<h3 style="margin-top:22px">Pick who travels with you</h3>' +
        packs.map(function (p) {
          return '<div class="tiny muted" style="margin:14px 0 8px;font-weight:700">' + esc(p.name) + '</div>' +
            '<div class="grid g4">' + p.ids.map(function (id) {
              return chip(id, 76);
            }).join('') + '</div>';
        }).join('') +
        '<button class="btn lg block" style="margin-top:24px" data-act="start">Start the yatra →</button>' +
      '</div></div>';
  };

  /* -------------------------------------------------------------- DASHBOARD */
  /* rotating nuggets — a word and a subhashita, picked by the hour so the page
     changes through the day without any server */
  var SHABD = [
    ['नमस्ते', 'namaste', 'hello — "I bow to you"', 'hi/w-namaste'],
    ['दोस्त', 'dost', 'friend', 'hi/w-dost'],
    ['समुद्र', 'samudra', 'the sea', 'hi/w-samudra'],
    ['कहानी', 'kahani', 'a story', 'hi/w-kahani'],
    ['याद', 'yaad', 'memory — the thing this whole app is about', 'hi/w-yaad'],
    ['रोशनी', 'roshni', 'light', 'hi/w-roshni']
  ];
  var SUBHASHITA = [
    ['A book, a mind and a friend are three things that grow only by being opened.', 'Sanskrit subhashita tradition'],
    ['Drop by drop, the pot is filled.', 'Hindi proverb — बूँद बूँद से घड़ा भरता है'],
    ['The one who walks slowly still arrives.', 'Tamil proverb'],
    ['A guest is God.', 'Taittiriya Upanishad — अतिथि देवो भव']
  ];

  V.home = function () {
    var lit = Object.keys(S.lit).length, readN = Object.keys(S.read).length;
    var totalStories = allStories().length || 1;
    var lv = level(), pct = Math.min(100, Math.round(((S.xp % 60) / 60) * 100));
    var hour = new Date().getHours();
    var greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    var wordsN = Object.keys(S.lang).reduce(function (n, k) { return n + (S.lang[k].correct || 0); }, 0);
    /* the word of the day arrives in the family's language when one is chosen;
       the Hindi set keeps its recorded voice, the others speak via the
       synthesis fallback until their packs record */
    var tg = tongue();
    var W = (tg && tg.words && tg.words.length) ? tg.words : SHABD;
    var w = W[hour % W.length], q = SUBHASHITA[hour % SUBHASHITA.length];
    var wLang = (tg && tg.words) ? tg.lang : 'hi';
    var hello = ['“Chalo — one story and a whole state wakes up.”',
                 '“I remember every single thing. Come and see.”',
                 '“The mist is thinner than yesterday. That was you.”'][new Date().getDate() % 3];

    /* TODAY. This used to be a "goal" card showing three unrelated counters, one of which
       (Words) only ever moved if the family had bought Bhasha — so for a free child the
       headline goal on the home screen was permanently stuck at zero.

       It is now three invitations instead of three numbers, one for each way this app is
       used, and every one of them works without a subscription:

         HEAR one — a story. No counter on it, ever. Stories are a library, not a ladder
                    (docs/10 §3.5), so the verb is "tell me one", not "3 of 3 done".
         DO one   — the day's deed. This is the payoff system: a bead for something you
                    DID, never for something you read.
         CARRY one — the word of the day. This one is masterable, so a count is honest here.

       The streak stays because a rhythm is not a completion target, but it is a footnote
       now rather than the headline. */
    var K = window.IND_NEETI;
    var todayValue = K ? K.values[Math.floor(Date.now() / 86400000) % K.values.length] : null;
    var deedDone = todayValue && (S.mala || []).some(function (b) {
      return b.v === todayValue.id && b.on === today();
    });

    return '<div class="card notch"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">' +
        art(S.buddy, 72) +
        '<div style="flex:1"><div class="tiny muted">' + greet + ',</div>' +
        '<h2 style="margin:0 0 10px">' + esc(S.name || 'Yatri') + '</h2>' +
        '<div class="bubble">' + esc(hello) + '</div></div></div></div>' +

      '<div class="card"><div class="spread" style="margin-bottom:var(--space-lg)">' +
        '<h3 style="margin:0">Today</h3>' +
        '<span class="tiny muted">' + (S.streak.count
          ? '🪔 ' + S.streak.count + '-day streak'
          : 'Nothing yet today') + '</span></div>' +

        '<div class="today">' +
          '<div class="td"><span class="mono">Hear one</span>' +
            '<p>A story, the way it would be told to you.</p>' +
            '<button class="btn" data-act="tellone">' + icon('play', 18) + ' Tell me one</button></div>' +

          (todayValue
            ? '<div class="td"><span class="mono">Do one</span>' +
              '<p><b>' + esc(todayValue.roman) + '</b> — ' + esc(todayValue.en) + '.<br>' +
              esc(todayValue.doit) + '</p>' +
              (deedDone
                ? '<span class="pill stat">A bead on your mala ✓</span>'
                : '<button class="btn ghost" data-act="deed" data-id="' + todayValue.id + '">I did it</button>')
            + '</div>'
            : '') +

          '<div class="td"><span class="mono">Carry one</span>' +
            '<p lang="' + esc(wLang) + '" style="font-size:28px;line-height:1.5;margin:0">' + esc(w[0]) + '</p>' +
            '<p class="tiny muted" style="margin:0 0 4px">/ ' + esc(w[1]) + ' / · ' + esc(w[2]) + '</p>' +
            '<button class="pill" data-act="say" data-k="' + esc(w[3] || '') + '" data-t="' + esc(w[0]) +
            '" data-l="' + esc(wLang) + '-IN">' + icon('sound', 16) + ' hear it</button></div>' +
        '</div></div>' +

      /* the two big illustrated journeys */
      '<div class="grid g2" style="grid-template-columns:1fr 1fr">' +
        '<button class="journey" data-act="go" data-v="stories">' +
          '<div class="banner" style="background-image:url(art/banner/stories.jpg)">' +
            '<span class="chip">' + icon('tree', 20) + '</span>' +
            '<span class="tag">' + totalStories + ' stories</span></div>' +
          /* Not "next on your yatra" — there is no next. It is a library and you pick.
             The Tell-me-one button lives in Today; a second copy here just made the same
             offer twice on one screen. */
          '<div class="body"><div class="tiny muted">The whole library, under the banyan</div>' +
          '<h2 style="margin:2px 0 6px">Stories</h2>' +
          '<p class="tiny" style="margin:0">Panchatantra, Jataka, the Puranas, the Ramayana and ' +
          'the Mahabharata, and the folk tales of every state — with your favourite always ' +
          'there to hear again.</p></div></button>' +

        '<button class="journey" data-act="go" data-v="map">' +
          '<div class="banner" style="background-image:url(art/banner/map.jpg)">' +
            '<span class="chip">' + icon('map', 20) + '</span>' +
            '<span class="tag">' + lit + ' of 34 remembered</span></div>' +
          '<div class="body"><div class="tiny muted">Your long journey</div>' +
          '<h2 style="margin:2px 0 6px">India</h2>' +
          '<p class="tiny" style="margin:0 0 14px">Vismriti is eating India’s memory. Every story you finish pushes the grey back off one more place.</p>' +
          '<div class="meter"><i style="width:' + Math.round(lit / 34 * 100) + '%"></i></div></div></button>' +
      '</div>' +

      /* The week's question, high on Home. docs/11 §3: the outcome a parent actually wants is
         "she can talk to my mother", and this is the only surface that moves it. It is also
         the one with a deadline — grandparents do not wait — so it does not sit three taps
         down behind a hub. */
      (naniWeek()
        ? (function () {
            var q = naniWeek();
            return '<button class="card askcard" data-act="go" data-v="nani" ' +
              'style="margin-top:var(--space-lg);width:100%;text-align:left">' +
              '<div class="mono">This week, ask ' + esc(kinTerm(q.to)) + '</div>' +
              '<h2 style="margin:8px 0 4px">' + esc(kinEn(q)) + '</h2>' +
              '<p class="tiny muted" style="margin:0">' + esc(q.roman) + '</p></button>';
          })()
        : '') +

      /* One nugget, not two. The Mithu tip said "ask a grown-up which version they were
         told", which is the same job the Ask Nani card above does properly and with a real
         question — so it was the same idea twice, weaker the second time. */
      '<div class="card tint notch" style="margin-top:var(--space-lg)">' +
        '<div class="row" style="flex-wrap:nowrap;align-items:center">' +
        '<div style="flex:1"><div class="mono">Subhashita of the hour</div>' +
        '<p style="font-family:var(--display);font-size:19px;font-style:italic;margin:8px 0 6px">“' + esc(q[0]) + '”</p>' +
        '<div class="tiny muted">— ' + esc(q[1]) + '</div></div>' +
        mascot('mithu', 'talk', 62) + '</div></div>' +

      /* WHAT IS ON NOW. The four tiles that used to sit here — Neeti, Bhasha, Learn, Play —
         were the top navigation printed a second time, with a static label under each. A
         child had no more reason to tap "Play · 5 stalls open" than to tap the word Play in
         the bar above it. Replaced with things that are actually true today: the festival
         that falls this month, and a state that is still under the mist. */
      (function () {
        var bits = [];
        var now = (typeof utsavNow === 'function') ? utsavNow() : [];
        if (now.length) {
          var f = now[new Date().getDate() % now.length];
          bits.push('<button class="tile" data-act="fest" data-id="' + f.id + '">' +
            '<span class="mono">On this month</span>' +
            '<b>' + esc(f.name) + '</b>' +
            '<p class="tiny">' + esc(f.do && f.do[0] ? f.do[0] : f.kid) + '</p></button>');
        }
        var G = window.IND_GEO;
        var dark = G ? Object.keys(window.IND_MAP.paths).filter(function (c) { return !S.lit[c]; }) : [];
        if (dark.length) {
          var c = dark[new Date().getDate() % dark.length];
          bits.push('<button class="tile" data-act="peekgo" data-code="' + c + '">' +
            '<span class="mono">Still under the mist</span>' +
            '<b>' + esc(stateName(c)) + '</b>' +
            '<p class="tiny">' + (((window.IND_STATES || {})[c] || {}).trivia || [''])[0] + '</p></button>');
        }
        var st = allStories();
        if (st.length) {
          var s = st[(new Date().getDate() * 7) % st.length];
          bits.push('<button class="tile" data-act="story" data-id="' + s.id + '">' +
            '<span class="mono">If you only have five minutes</span>' +
            '<b>' + esc(s.title) + '</b>' +
            '<p class="tiny">' + esc(s.hook || '') + '</p></button>');
        }
        return bits.length
          ? '<div class="grid g3" style="margin-top:var(--space-lg)">' + bits.join('') + '</div>'
          : '';
      })() +

      /* YOUR YATRA. This was a row of identical mascots on an XP ladder, which told a child
         nothing about their own journey and — worse — put a level ladder over stories, which
         docs/10 §3.5 says explicitly not to do.

         What it shows now is the five things that are actually true of this child, and it
         separates them the way the doc does. Stories are a COUNT, never a fraction: the
         promise there is abundance, "there is always another one", not completion. The map,
         the verses and the words are genuinely masterable, so they get a denominator. The
         mala gets neither, because deeds are not a score.

         All of it works without a subscription except the words, which appear only once the
         child has actually started a pack — no more dead zero on the home screen. */
      (function () {
        var heard = Object.keys(S.read).length;
        var verses = Object.keys(S.recited || {}).length;
        var beads = (S.mala || []).length;
        var totalVerses = window.IND_SHLOK ? window.IND_SHLOK.verses.length : 0;
        var cell = function (n, of, label, note) {
          return '<div class="ycell"><b>' + n + (of ? '<span class="muted"> / ' + of + '</span>' : '') + '</b>' +
            '<span>' + label + '</span>' +
            (note ? '<span class="tiny muted">' + note + '</span>' : '') + '</div>';
        };
        return '<div class="card" style="margin-top:var(--space-lg)">' +
          '<div class="spread" style="margin-bottom:4px"><h3 style="margin:0">Your yatra</h3>' +
          '<span class="pill stat">' + esc(rank()) + '</span></div>' +
          '<p class="tiny muted">Where you have got to. Nothing here expires and nothing here ' +
          'goes down.</p>' +
          '<div class="ygrid">' +
            cell(heard, 0, 'stories heard', 'out of ' + totalStories + ' — and more keep arriving') +
            cell(lit, 34, 'places remembered', 'the mist lifts as you read') +
            cell(beads, 0, 'beads on your mala', 'one for each thing you did') +
            (totalVerses ? cell(verses, totalVerses, 'verses carried', 'said out loud, not just read') : '') +
            (wordsN ? cell(wordsN, 0, 'words known', 'across every language you have started') : '') +
          '</div>' +
          '<div class="meter" style="margin-top:var(--space-lg)"><i style="width:' + pct + '%"></i></div>' +
          '<p class="tiny muted" style="margin-top:8px">' +
            (lv < RANKS.length - 1 ? 'Next: <b>' + esc(RANKS[lv + 1]) + '</b>' : 'You are at the top of the ladder') +
          '</p></div>';
      })() +

      /* THE MALA, always — and explained. It used to appear only once a child had already
         earned a bead, which meant the one screen that could explain the payoff system was
         invisible to everybody who had not already worked it out. */
      V.malaStrip();
  };

  /* -------------------------------------------------------------------- MAP

     The map is the anchor of the whole app, so it has to be worth looking at before it is
     worth tapping. It used to be 34 grey silhouettes: nothing to see, nothing to learn, and
     no reason to touch any particular one.

     Now every state is FILLED WITH ITS OWN PAINTING, through one SVG <pattern> per state
     mapped onto the precomputed bbox in map-data.js. Kerala is backwaters, Rajasthan is
     desert and fort, Punjab is fields. The map teaches at a glance.

     The mist still means something. A state you have not met yet shows its painting
     dimmed under the mist — you can see there is something there, which is an invitation,
     where flat grey was just an absence. Reading a story lifts the mist off that state and
     the painting comes to full colour. Same mechanic, but the reward is now visible in
     advance instead of being a surprise nobody was waiting for.

     Nothing here animates or gamifies a boundary (CLAUDE.md): the mist is a fill opacity on
     a fixed shape, and no border ever moves, draws itself or gets won. */
  var mapFocus = null;   /* the state whose facts are showing under the map */

  function stateName(c) {
    var G = window.IND_GEO;
    /* States that have data but no map geometry yet — Telangana and Ladakh are known,
       documented gaps — must still have names. A raw code on screen ("Today, from TG")
       reads as a bug because it is one. */
    var PENDING = { TG: 'Telangana', LA: 'Ladakh' };
    return (G && G.states[c] && G.states[c].name) || PENDING[c] || c;
  }

  /* The facts on the callout. Deliberately the things a child repeats to someone else — the
     capital, what people say for hello, what lives there — not a table of statistics. */
  function mapFacts(c) {
    var X = (window.IND_STATES || {})[c] || {}, out = [];
    if (X.capital) out.push(['Capital', X.capital]);
    if (X.population) {
      var pr = stateRank(c, 'population');
      out.push(['People', bigNum(X.population).split('  ·  ')[0] +
        (pr ? ' · ' + ordinal(pr.rank) + ' of ' + pr.of : '')]);
    }
    if (X.languages && X.languages.length) out.push(['Speaks', X.languages.slice(0, 2).join(', ')]);
    if (X.symbols && X.symbols.animal) out.push(['State animal', X.symbols.animal]);
    if (X.symbols && X.symbols.bird) out.push(['State bird', X.symbols.bird]);
    if (X.food && X.food.length) out.push(['Eat this', X.food[0].dish]);
    if (X.places && X.places.length) out.push(['Go here', X.places[0].name]);
    var n = allStories().filter(function (t) { return (t.place || []).indexOf('IN-' + c) >= 0; }).length;
    if (n) out.push(['Stories', n + (n === 1 ? ' story from here' : ' stories from here')]);
    return out;
  }

  /* Which language the state's `hello` is written in, so it lands in the right face. Every
     one of these scripts is self-hosted (tools/fonts.sh); anything not listed is Devanagari,
     which is the honest default for this field only because that is the script those
     particular greetings are written in — not because Hindi is the default anything. */
  var HELLO_LANG = {
    TN: 'ta', KL: 'ml', KA: 'kn', AP: 'te', TG: 'te', OR: 'or', WB: 'bn', TR: 'bn',
    AS: 'as', PB: 'pa', GJ: 'gu', DD: 'gu', DN: 'gu', MH: 'mr', GA: 'mr', SK: 'ne'
  };

  /* One line of trivia, picked by the day rather than at random, so the map says the same
     thing all day and a child can carry it to someone. A different fact every refresh is
     forgettable; the same fact all Tuesday gets repeated at dinner. */
  function triviaOfTheDay() {
    var ST = window.IND_STATES || {};
    var codes = Object.keys(ST).filter(function (c) { return (ST[c].trivia || []).length; });
    if (!codes.length) return null;
    var day = Math.floor(Date.now() / 86400000);
    var c = codes[day % codes.length];
    var list = ST[c].trivia;
    return { code: c, text: list[day % list.length] };
  }

  V.map = function () {
    var M = window.IND_MAP, G = window.IND_GEO;
    if (!M) return '<div class="card">Map data missing.</div>';
    var codes = Object.keys(M.paths);
    var lit = Object.keys(S.lit).length, total = codes.length;
    var bb = M.bbox || {};

    /* One pattern per state that has a painting. slice keeps the painting's aspect ratio
       and crops, so no state gets a squashed picture. */
    var defs = codes.map(function (c) {
      var src = stateArt(c), b = bb[c];
      if (!src || !b) return '';
      /* The pattern's x/y place the tile in user space, so the <image> inside is positioned
         from the tile's own origin at 0,0 — not at the bbox coordinates again, which would
         push the image clean outside the tile and paint nothing. */
      return '<pattern id="pt' + c + '" patternUnits="userSpaceOnUse" x="' + b[0] + '" y="' + b[1] +
        '" width="' + b[2] + '" height="' + b[3] + '">' +
        '<image href="' + src + '" x="0" y="0" width="' + b[2] +
        '" height="' + b[3] + '" preserveAspectRatio="xMidYMid slice"/></pattern>';
    }).join('');

    var paths = codes.map(function (c) {
      var isLit = !!S.lit[c], has = stateArt(c) && bb[c];
      var fill = has ? 'url(#pt' + c + ')' : 'var(--mist)';
      /* .home is the family's own state — a STATIC warm outline, set in CSS.
         Nothing about it animates, pulses or rewards; the boundary rules in
         CLAUDE.md are absolute and a glow that breathes would break them. */
      return '<g class="terrg' + (isLit ? ' lit' : '') + (mapFocus === c ? ' on' : '') +
          (isHome(c) ? ' home' : '') +
          '" data-act="peek" data-code="' + c + '" tabindex="0" role="button" ' +
          'aria-label="' + esc(stateName(c)) + '">' +
        '<title>' + esc(stateName(c)) + '</title>' +
        '<path class="terr" d="' + M.paths[c] + '" fill="' + fill + '"/>' +
        /* the mist itself: a second copy of the same shape, faded out as the state is met */
        '<path class="mist" d="' + M.paths[c] + '"/>' +
        '</g>';
    }).join('');

    /* Labels last so they sit above every fill. Only states with room for the text get one;
       the rest are reachable by tap and by their <title>. */
    var labels = codes.map(function (c) {
      var a = M.anchors[c], b = bb[c];
      if (!a || !b || b[2] < 44 || b[3] < 26) return '';
      return '<text class="tlab' + (S.lit[c] ? ' lit' : '') + '" x="' + a[0] + '" y="' + a[1] +
        '">' + esc(stateName(c)) + '</text>';
    }).join('');

    var pins = G && G.pins ? Object.keys(G.pins).map(function (id) {
      var m = (G.monuments || []).filter(function (x) { return x.id === id; })[0];
      if (!m || !S.lit[m.state]) return '';
      var p = G.pins[id];
      return '<g class="pin" data-act="mon" data-id="' + id + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="10"/></g>';
    }).join('') : '';

    /* The callout sits ON the map, anchored to the state, because a facts panel parked
       below turns looking at the map into reading a table underneath it. The anchor is the
       same label point, converted to a percentage of the viewBox so the overlay tracks the
       SVG at any width. */
    var callout = '';
    if (mapFocus) {
      var vb = M.viewBox.split(/[\s,]+/).map(Number);
      var a = M.anchors[mapFocus] || [vb[2] / 2, vb[3] / 2];
      var lx = ((a[0] - vb[0]) / vb[2]) * 100, ly = ((a[1] - vb[1]) / vb[3]) * 100;
      var X = (window.IND_STATES || {})[mapFocus] || {};
      var facts = mapFacts(mapFocus).slice(0, 3);
      var hello = X.hello;
      var triv = (X.trivia || [])[0];
      /* Above the anchor normally, below it near the top edge, so the bubble never runs off
         the map. The horizontal clamp keeps it on screen for Gujarat and Arunachal alike. */
      var below = ly < 26;
      callout =
        '<div class="callout' + (below ? ' below' : '') + '" style="left:' +
            Math.max(20, Math.min(80, lx)) + '%;top:' + ly + '%">' +
          '<button class="cx" data-act="peek" data-code="' + mapFocus + '" aria-label="Close">×</button>' +
          '<h3>' + esc(stateName(mapFocus)) + '</h3>' +
          (hello && hello.word
            ? '<p class="chello"><span lang="' + (HELLO_LANG[mapFocus] || 'hi') + '">' + esc(hello.word) +
              '</span> <span class="tiny muted">' + esc(hello.roman || '') + '</span></p>' : '') +
          (facts.length
            ? '<div class="cfacts">' + facts.map(function (f) {
                return '<div><span class="tiny muted">' + esc(f[0]) + '</span><b>' + esc(f[1]) + '</b></div>';
              }).join('') + '</div>'
            : '<p class="tiny muted">We are still writing this one up.</p>') +
          (triv ? '<p class="ctriv">' + esc(triv) + '</p>' : '') +
          (isHome(mapFocus)
            ? '<p class="tiny" style="margin:6px 0 0;color:var(--accent)">Your family’s language lives here.</p>' : '') +
          '<button class="btn sm block" data-act="state" data-code="' + mapFocus + '">Open ' +
            esc(stateName(mapFocus)) + ' →</button>' +
        '</div>';
    }

    /* Something to read even before anything is tapped, so the map is never a dead surface. */
    var tod = triviaOfTheDay();
    var strip = mapFocus ? ''
      : (tod ? '<div class="mfacts"><span class="tiny muted">Today, from ' + esc(stateName(tod.code)) +
               '</span><p style="margin:4px 0 0">' + esc(tod.text) + '</p></div>'
             : '<div class="mfacts hint"><p style="margin:0">Tap any state to see what it is known for.</p></div>');

    return '<div class="card">' +
      '<div class="spread" style="margin-bottom:14px">' +
        '<div><h2 style="margin:0">India</h2>' +
        '<div class="tiny muted">The living map — ' + lit + ' of ' + total + ' places remembered · tap a state</div></div>' +
        '<span class="pill stat">🪔 ' + S.streak.count + '</span></div>' +
      '<div class="mapwrap">' +
        '<svg class="mapsvg" viewBox="' + M.viewBox + '" role="img" aria-label="Map of India">' +
          '<defs>' + defs + '</defs>' +
          '<path class="outline" d="' + M.outline + '"/>' + paths + pins + labels + '</svg>' +
        callout +
      '</div>' +
      strip +
      '<div class="legend" style="margin-top:14px">' +
        '<span><i class="lg-mist"></i>still under the mist</span>' +
        '<span><i class="lg-lit"></i>remembered</span>' +
        '<span><i style="background:var(--accent3)"></i>a place to visit</span></div></div>' +
      (lit === 0 ? '<div class="card center"><p>Every state is painted under the mist. Read a story and the mist lifts off the place it came from.</p>' +
        '<button class="btn" data-act="go" data-v="stories">Open the story library</button></div>' : '') +

      /* State Hunt: the map, as a game. (The River of Time lives on its own tab now —
         repeating it here was the Learn-hub redundancy in new clothes.) */
      (window.IND_GAMES
        ? '<button class="tile" data-act="game" data-id="statehunt" style="margin-top:var(--space-lg)">' +
          '<b>State Hunt</b><span class="tiny muted">A capital, a fort, a rhino, a mountain — ' +
          'which state is it? The map, as a game.</span></button>'
        : '');
  };


  /* Numbers a child can hold. "199,812,341 people" is not a fact anybody carries away;
     "20 crore" or "200 million" is. Both are given, because a diaspora child hears crore at
     home and million at school, and knowing they are the same number is itself the lesson.

     Rank is COMPUTED from the state data rather than stored, so it cannot drift when a
     population is corrected, and it is honest about its own basis — these are 2011 census
     figures and the rank is among the states this app actually carries. */
  function bigNum(n) {
    if (!n) return '';
    if (n >= 1e7) {                                   /* a crore and up */
      var cr = n / 1e7;
      return (cr >= 10 ? Math.round(cr) : cr.toFixed(1).replace(/\.0$/, '')) + ' crore' +
             '  ·  ' + (n / 1e6 >= 10 ? Math.round(n / 1e6) : (n / 1e6).toFixed(1)) + ' million';
    }
    if (n >= 1e5) return (n / 1e5).toFixed(n / 1e5 >= 10 ? 0 : 1).replace(/\.0$/, '') + ' lakh';
    return (Math.round(n / 1000)) + ' thousand';
  }
  function areaNum(km2) {
    if (!km2) return '';
    if (km2 >= 1000) return Math.round(km2 / 1000) + ',000 km²';
    return km2 + ' km²';
  }
  /* Where this state sits among the others on a given field, largest first. */
  function stateRank(code, field) {
    var ST = window.IND_STATES || {};
    var list = Object.keys(ST).filter(function (c) { return typeof ST[c][field] === 'number'; })
      .sort(function (a, b) { return ST[b][field] - ST[a][field]; });
    var i = list.indexOf(code);
    return i < 0 ? null : { rank: i + 1, of: list.length };
  }
  function ordinal(n) {
    var t = n % 100, s = n % 10;
    return n + (t >= 11 && t <= 13 ? 'th' : s === 1 ? 'st' : s === 2 ? 'nd' : s === 3 ? 'rd' : 'th');
  }

  V.state = function (code) {
    var G = window.IND_GEO, s = G && G.states[code];
    var X = (window.IND_STATES || {})[code] || {};
    if (!s) return '<div class="card">Nothing here yet.</div>';
    var img = stateArt(code);
    var stories = allStories().filter(function (t) { return (t.place || []).indexOf('IN-' + code) >= 0; });
    var mons = (G.monuments || []).filter(function (m) { return m.state === code; });
    var pend = (G.pending || []).filter(function (p) { return p.inside === code; });
    var lit = !!S.lit[code];

    function fact(k, v, sub) {
      if (!v) return '';
      return '<div class="fct"><span class="mono">' + esc(k) + '</span><b>' + esc(v) + '</b>' +
        (sub ? '<span class="tiny muted">' + esc(sub) + '</span>' : '') + '</div>';
    }
    function callout(title, note, body) {
      if (!body) return '';
      return '<div class="card"><h3 style="margin:0 0 3px">' + esc(title) + '</h3>' +
        (note ? '<p class="tiny muted" style="margin:0 0 12px">' + esc(note) + '</p>' : '<div style="height:10px"></div>') +
        body + '</div>';
    }

    return '<button class="backlink" data-act="go" data-v="map">' + icon('back', 18) + ' The map</button>' +
      (img ? '<div class="statehero" style="background-image:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.55)),url(' + img + ')">' +
        '<div class="cap"><h1>' + esc(s.name) + '</h1>' +
        '<div class="row" style="gap:8px">' +
        (X.hello ? '<span class="pill stat">' + esc(X.hello.word) + ' · ' + esc(X.hello.roman) + '</span>' : '') +
        (lit ? '<span class="pill stat">remembered</span>' : '<span class="pill stat">in the mist</span>') +
        '</div></div></div>'
        : '<div class="card"><h1 style="margin:0">' + esc(s.name) + '</h1></div>') +

      /* key facts */
      '<div class="card"><div class="facts">' +
        fact('Capital', X.capital || s.capital) +
        fact('Formed', X.formed) +
        (X.population ? (function () {
          var r = stateRank(code, 'population');
          return fact('People', bigNum(X.population),
            (r ? ordinal(r.rank) + ' most people of ' + r.of + ' · ' : '') +
            (X.population_year || 2011) + ' census');
        }()) : '') +
        (X.area_km2 ? (function () {
          var r = stateRank(code, 'area_km2');
          return fact('Area', areaNum(X.area_km2),
            r ? ordinal(r.rank) + ' biggest of ' + r.of : '');
        }()) : '') +
        (X.languages && X.languages.length ? fact('Languages', X.languages.join(', ')) : '') +
        (X.script ? fact('Script', X.script) : '') +
      '</div>' +
      (X.symbols ? '<div class="row" style="margin-top:14px">' +
        Object.keys(X.symbols).map(function (k) {
          return X.symbols[k] ? '<span class="pill stat">' + esc(k) + ' · ' + esc(X.symbols[k]) + '</span>' : '';
        }).join('') + '</div>' : '') +
      '<p style="margin:14px 0 0">' + esc(s.fact) + '</p>' +
      (s.note ? '<p class="tiny muted">' + esc(s.note) + '</p>' : '') + '</div>' +

      pend.map(function (p) {
        return '<div class="card flat tight"><b>' + esc(p.name) + '</b> <span class="tiny muted">— its own ' +
          (p.type === 'ut' ? 'union territory' : 'state') + ' since ' + p.since + '. Our map still draws it inside ' +
          esc(s.name) + '; we are fixing that.</span><div class="tiny" style="margin-top:6px">' + esc(p.fact) + '</div></div>';
      }).join('') +

      /* stories — the point of the whole map */
      callout('Stories from here', stories.length ? 'This is why the map matters — every one of these belongs to this place.' : '',
        stories.length ? '<div class="rail">' + stories.map(function (x) {
          var si = storyArt(x.id);
          return '<button class="scard" data-act="story" data-id="' + x.id + '">' +
            (si ? '<span class="pic" style="background-image:url(' + si + ')"></span>'
                : '<span class="pic noart">' + art(x.hero, 74) + '</span>') +
            '<span class="nm">' + esc(x.title) + '</span>' +
            '<span class="hk">' + esc(x.hook) + '</span></button>';
        }).join('') + '</div>'
        : '<p class="tiny muted">No stories from here yet. There will be.</p>') +

      /* mythology and folklore — regional, not flattened into a generic pan-Indian version */
      callout('Its own gods, its own stories',
        'Every place in India has these, and they are not the same everywhere. This is what a ' +
        'generic version of "Indian mythology" flattens away.',
        (X.myth && (X.myth.deities || X.myth.legend || X.myth.living)) ?
        ((X.myth.deities && X.myth.deities.length ? '<div class="grid g2" style="margin-bottom:12px">' +
          X.myth.deities.map(function (d) {
            return '<div class="card flat tight" style="margin:0"><b>' + esc(d.name) + '</b>' +
              '<div class="tiny" style="margin-top:4px">' + esc(d.what) + '</div></div>';
          }).join('') + '</div>' : '') +
         (X.myth.legend ? '<div class="card tint" style="margin:0 0 12px"><div class="mono">The one they tell here</div>' +
          '<h3 style="margin:6px 0 6px">' + esc(X.myth.legend.name) + '</h3>' +
          '<p style="margin:0">' + esc(X.myth.legend.tell) + '</p></div>' : '') +
         (X.myth.living && X.myth.living.length ? '<div class="mono" style="margin-bottom:8px">Still happening</div>' +
          '<div class="grid g2">' + X.myth.living.map(function (l) {
            return '<div class="card flat tight" style="margin:0"><b>' + esc(l.name) + '</b>' +
              '<div class="tiny" style="margin-top:4px">' + esc(l.what) + '</div></div>';
          }).join('') + '</div>' : '')) : '') +

      /* people */
      callout('People from here', 'Real people, and what they actually did.',
        (X.people && X.people.length) ? '<div class="grid g2">' + X.people.map(function (p) {
          return '<div class="card flat tight" style="margin:0"><b>' + esc(p.name) + '</b>' +
            '<div class="tiny muted">' + esc(p.what) + '</div>' +
            '<div class="tiny" style="margin-top:5px">' + esc(p.why) + '</div></div>';
        }).join('') + '</div>' : '') +

      /* cuisine */
      callout('What they eat', 'Ask a grown-up which of these they have actually had.',
        (X.food && X.food.length) ? '<div class="grid g2">' + X.food.map(function (f) {
          return '<div class="card flat tight" style="margin:0"><b>' + esc(f.dish) + '</b>' +
            '<div class="tiny" style="margin-top:4px">' + esc(f.what) + '</div></div>';
        }).join('') + '</div>' : (s.food ? '<span class="pill stat">' + esc(s.food) + '</span>' : '')) +

      /* landmarks */
      callout('Places to stand in', '',
        (mons.length || (X.places && X.places.length)) ?
        '<div class="grid g2">' +
        mons.map(function (m) {
          return '<div class="card flat tight" style="margin:0"><span class="badge ' + m.badge + '">' + m.badge + '</span> ' +
            '<b>' + esc(m.name) + '</b> <span class="tiny muted">· ' + esc(m.when) + '</span>' +
            '<div class="tiny" style="margin-top:5px">' + esc(m.fact) + '</div></div>';
        }).join('') +
        (X.places || []).map(function (pl) {
          return '<div class="card flat tight" style="margin:0"><b>' + esc(pl.name) + '</b>' +
            '<div class="tiny" style="margin-top:4px">' + esc(pl.what) + '</div></div>';
        }).join('') + '</div>' : '') +

      /* trivia */
      callout('Things worth knowing', 'The kind you repeat at dinner.',
        (X.trivia && X.trivia.length) ? '<ul class="triv">' + X.trivia.map(function (t) {
          return '<li>' + esc(t) + '</li>';
        }).join('') + '</ul>' : '') +

      (X.unsure && X.unsure.length ? '<div class="card flat tiny"><b>Still checking.</b> ' +
        esc(X.unsure.join(' · ')) + '</div>' : '');
  };

  /* --------------------------------------------------------------- STORIES */
  V.stories = function () {
    var cols = allCollections(), all = allStories();
    var favs = S.favs || {};
    var loved = all.filter(function (x) { return favs[x.id]; });

    function shelf(title, note, list) {
      if (!list.length) return '';
      return '<h3 style="margin:26px 0 4px">' + esc(title) + '</h3>' +
        (note ? '<p class="tiny muted" style="margin:0 0 12px">' + esc(note) + '</p>' : '') +
        '<div class="rail">' + list.map(card).join('') + '</div>';
    }
    function card(x) {
      var img = storyArt(x.id);
      return '<button class="scard" data-act="story" data-id="' + x.id + '">' +
        (img ? '<span class="pic" style="background-image:url(' + img + ')"></span>'
             : '<span class="pic noart">' + art(x.hero, 84) + '</span>') +
        (favs[x.id] ? '<span class="fav">♥</span>' : '') +
        '<span class="nm">' + esc(x.title) + '</span>' +
        '<span class="hk">' + esc(x.hook) + '</span></button>';
    }

    return '<div class="card"><div class="spread"><div>' +
      '<h1 style="margin:0">Stories</h1>' +
      '<p style="margin:6px 0 0">' + all.length + ' of them, and more coming. Nothing to finish, ' +
      'nothing to get right — you can have the same one again tomorrow.</p></div></div>' +
      '<button class="btn lg" style="margin-top:14px" data-act="tellone">' + icon('play', 20) +
      ' Tell me one</button></div>' +

      (window.IND_NANI
        ? '<button class="tile" style="margin:var(--space-lg) 0 0" data-act="go" data-v="nani">' +
          '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + icon('mic', 36) +
          '<div style="flex:1"><h3 style="margin:0">' + esc(naniTitle()) + '</h3>' +
          '<p class="tiny" style="margin:5px 0 0">Stories in your own family\u2019s voice \u2014 the ' +
          'warmest shelf in this library. Record a grandparent, keep it forever.</p></div></div></button>'
        : '') +
      (epics().length ? '<button class="tile" style="margin:var(--space-lg) 0" data-act="go" data-v="epics">' +
        '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art('rama', 58) +
        '<div style="flex:1"><h3 style="margin:0">The Epics</h3>' +
        '<p class="tiny" style="margin:5px 0 0">The Ramayana and the Mahabharata, one card at a ' +
        'time. Read one, stop, come back tomorrow — nobody finishes these in a night.</p></div></div></button>' : '') +

      /* The family's own places first — leaning, not gating: every other shelf
         is right below, untouched. */
      (function () {
        var t = tongue(); if (!t) return '';
        var hs = homeStates();
        var mine = all.filter(function (x) {
          return (x.place || []).some(function (p) { return hs.indexOf(String(p).replace('IN-', '')) >= 0; });
        });
        if (!mine.length) return '';
        var names = hs.map(stateName);
        var where = names.length > 3 ? names.slice(0, 3).join(', ') + ' and more' : names.join(', ');
        return shelf('From your family’s places', 'The ' + t.en + ' country — ' + where + '.', mine);
      })() +
      shelf('Again', 'The ones you loved. A story is not used up.', loved) +
      cols.map(function (c) {
        return shelf(c.name, c.note, all.filter(function (x) { return x.collection === c.id; }));
      }).join('');
  };

  var play = { story: null, i: 0, answered: false };

  V.story = function (id) {
    var st = allStories().filter(function (s) { return s.id === id; })[0];
    if (!st) return '<div class="card">Story not found.</div>';
    if (!play.story || play.story.id !== id) { play.story = st; play.i = 0; play.answered = false; }
    if (play.i >= st.scenes.length) return V.storyEnd(st);

    var sc = st.scenes[play.i], cast = (sc.art || []).slice(0, 2), teller = sc.who === 'mithu';
    var img = storyArt(st.id);
    return '<button class="backlink" data-act="go" data-v="stories">' + icon('back', 18) + ' Stories</button>' +
      '<div class="spread" style="margin-bottom:12px"><span class="badge ' + st.badge + '">' + st.badge + '</span>' +
      '<div class="dots">' + st.scenes.map(function (_, i) { return '<i class="' + (i <= play.i ? 'on' : '') + '"></i>'; }).join('') + '</div></div>' +
      '<div class="stage"' + (img ? ' style="background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.35)),url(' + img + ')"' : '') + '>' + (teller ? '<div class="speaking">' + mascot('mithu', 'talk', 128) + '</div>' :
        cast.map(function (c, i) { return '<div class="' + (i === 0 ? 'speaking' : '') + '">' + art(c, i === 0 ? 128 : 100) + '</div>'; }).join('')) + '</div>' +
      /* Bubble when somebody is talking, plain panel when the storyteller is. */
      '<div class="speech' + (hasDialogue(sc.text) ? ' bubble' : '') + '" style="margin-top:14px">' +
      (teller ? '<span class="who">Mithu</span>'
              : (cast[0] && avatarName(cast[0]) ? '<span class="who">' + esc(avatarName(cast[0])) + '</span>' : '')) +
      esc(sc.text).replace(/\*(.+?)\*/g, '<i>$1</i>') + '</div>' +
      (sc.ask ? V.ask(sc.ask) :
        '<div class="row" style="margin-top:14px">' +
        '<button class="btn ghost" data-act="say" data-k="st/' + slug(st.id) + '-' + play.i + '">' + icon('sound', 18) + ' Again</button>' +
        '<button class="btn" style="flex:1" data-act="next">Then what happened? →</button></div>');
  };

  V.ask = function (a) {
    if (play.answered) return '<div class="card" style="margin-top:14px;border-color:var(--accent)">' + esc(play.answered) +
      '<button class="btn block" style="margin-top:14px" data-act="next">Go on →</button></div>';
    return '<div class="card" style="margin-top:14px"><h3>' + esc(a.q) + '</h3>' +
      a.options.map(function (o, i) { return '<button class="opt" data-act="answer" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') +
      '<div class="tiny muted">There is no wrong answer here — have a guess.</div></div>';
  };

  V.storyEnd = function (st) {
    var code = (st.place || [])[0]; code = code ? code.replace('IN-', '') : null;
    var G = window.IND_GEO, place = (code && G && G.states[code]) ? G.states[code].name : null;
    var himg = storyArt(st.id);
    return '<button class="backlink" data-act="go" data-v="stories">' + icon('back', 18) + ' Stories</button>' +
      (himg ? '<div class="heroshot" style="background-image:url(' + himg + ')"></div>' : '') +
      '<div class="card center">' + mascot('mithu', 'wink', 112) +
      '<h1 style="margin-top:8px">' + esc(st.title) + '</h1>' +
      '<p style="font-size:18px;max-width:52ch;margin:0 auto var(--space-md)">' + esc(st.moral) + '</p>' +
      (place ? '<span class="badge aaj">🪔 The mist lifted off ' + esc(place) + '</span>' : '') + '</div>' +
      /* the story word-lists are Hindi content; when the family's tongue is
         something else, the heading says so honestly rather than pretending */
      (st.words_hi && st.words_hi.length ? '<div class="card"><h3>Three ' +
        (tongue() && tongue().id !== 'hi' ? 'Hindi ' : '') + 'words from this story</h3><div class="grid g3">' +
        st.words_hi.map(function (w) {
          return '<button class="tile center" data-act="say" data-k="hi/w-' + slug(w[1]) + '">' +
            '<div class="deva" style="font-size:28px">' + esc(w[0]) + '</div>' +
            '<div class="mono">' + esc(w[1]) + '</div><div class="tiny">' + esc(w[2]) + '</div></button>';
        }).join('') + '</div></div>' : '') +
      '<div class="card center"><div class="row" style="justify-content:center">' +
      '<button class="btn" data-act="again" data-id="' + st.id + '">' + icon('play', 18) + ' Again</button>' +
      '<button class="btn ghost" data-act="love" data-id="' + st.id + '">' +
      ((S.favs || {})[st.id] ? '♥ Loved' : '♡ I loved this') + '</button>' +
      '<button class="btn ghost" data-act="tellone">Another one</button></div>' +
      '<p class="tiny muted" style="margin:12px 0 0">Hearing it again is not going backwards. ' +
      'That is how you end up knowing it by heart.</p></div>' +
      '<div class="card flat tiny"><b>Where this comes from.</b> ' + esc(st.source || '') + '</div>';
  };


  /* -------------------------------------------------------------- ITIHAAS */
  /* NOTHING IS HIDDEN BY AGE ANY MORE. This used to drop every era above the child's band
     out of the list entirely, which is the worst version of a gate: the child cannot see
     that the thing exists, so cannot ask about it, and a parent never learns it is there.
     ageOK() is kept only to decide whether a heads-up is worth showing beside an item. */
  function needsGrownup(gate) { return (S.age || 8) < (gate || 4); }

  /* ------------------------------------------------------------- ITIHAAS

     Promoted back to a main tab, and rebuilt to earn it. The river used to be a bare list
     of eleven text rows — the weakest surface in the app for the pillar with the grandest
     name. It is now PAINTED: each era carries the painting of the state where its heart
     beats (the Buddha age wears Bihar, the Mughal court wears Delhi), which costs nothing —
     the state art exists — and swaps for dedicated era art the day it is generated. The
     figures of the era stand on the bend, so a child scrolling the river watches the cast
     of Indian history walk past before reading a word. */
  /* Era banners are curated, not blindly inherited from the state: state paintings are
     deliberately MODERN (Punjab's has a tractor in it), and a tractor on the Vedic age is
     the kind of anachronism that costs the whole pillar its authority. Overrides point at
     period-safe story paintings; eras without one fall back to their state's art. */
  var ERA_BANNER = { vedic: 'art/story/pu-ganga-shiva.jpg' };
  function eraArt(e) { return ERA_BANNER[e.id] || stateArt(e.place); }

  V.itihaas = function () {
    var I = window.IND_ITIHAAS;
    if (!I) return '<div class="card"><h1>Itihaas</h1><p>Not loaded.</p></div>';
    var eras = I.eras;
    return '<div class="card"><h1>Itihaas</h1>' +
      '<div class="mono" style="margin-bottom:10px">The river of time</div><p>' + esc(I.intro) + '</p>' +
      '<div class="row" style="margin-top:6px">' +
      '<span class="badge itihaas">itihaas — what evidence shows</span>' +
      '<span class="badge katha">katha — a story as it is told</span></div></div>' +

      '<div class="riverflow">' + eras.map(function (e, i) {
        var img = eraArt(e);
        var figs = (e.figures || []).filter(function (f) { return f.id; }).slice(0, 3);
        return '<button class="erabend' + (i % 2 ? ' alt' : '') + '" data-act="era" data-id="' + e.id + '">' +
          '<div class="erabanner"' + (img ? ' style="background-image:linear-gradient(180deg,rgba(20,12,50,.05) 30%,rgba(20,12,50,.62)),url(' + img + ')"' : '') + '>' +
            '<span class="erawhen">' + esc(e.when) + '</span>' +
            '<div class="erafigs">' +
              (figs.length ? figs.map(function (f) { return art(f.id, 52); }).join('')
                           : art(e.avatar, 52)) + '</div>' +
          '</div>' +
          '<div class="erabody">' +
            '<b>' + esc(e.title) + '</b>' +
            '<span class="tiny">' + esc(e.hook) + '</span>' +
            (needsGrownup(e.gate) ? '<span class="badge soft">has a hard part</span>' : '') +
          '</div></button>';
      }).join('') + '</div>' +

      '<div class="card flat tiny"><b>The whole river is here.</b> ' +
      'Some of what happened to India is hard, and none of it is hidden from you. ' +
      'A few stretches are marked so a grown-up knows to read them with you.</div>';
  };

  /* One era, told in layers: the picture and the hook, the story of the age, its key
     moments as a walkable timeline, the people, the places a family can still stand in
     front of, the stories from that world, and — always last — how we know. Every section
     is guarded, so the page renders on today's data and deepens as fields land. */
  V.era = function (id) {
    var I = window.IND_ITIHAAS;
    var e = I && I.eras.filter(function (x) { return x.id === id; })[0];
    if (!e) return '<div class="card">Not found.</div>';
    var big = (S.age || 8) >= 9;
    var img = eraArt(e);
    return '<button class="backlink" data-act="go" data-v="itihaas">' + icon('back', 18) + ' Itihaas</button>' +

      (img ? '<div class="statehero" style="background-image:linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(0,0,0,.6)),url(' + img + ')">' +
        '<div class="cap"><span class="badge itihaas">itihaas</span>' +
        '<h1 style="margin:6px 0 2px">' + esc(e.title) + '</h1>' +
        '<div class="mono" style="color:#fff;opacity:.9">' + esc(e.when) + '</div></div></div>'
      : '<div class="card"><span class="badge itihaas">itihaas</span>' +
        '<h1 style="margin:8px 0 2px">' + esc(e.title) + '</h1>' +
        '<div class="mono">' + esc(e.when) + '</div></div>') +

      '<div class="card"><p style="font-size:17px;margin:0 0 var(--space-md)">' + esc(e.hook) + '</p>' +
      '<p>' + esc(e.kid) + '</p>' +
      (big ? '<div class="card flat"><b>If you want the longer version.</b> ' + esc(e.big) + '</div>' : '') +
      '</div>' +

      ((e.moments || []).length
        ? '<div class="card"><h3 style="margin-top:0">What happened, step by step</h3>' +
          '<div class="tline">' + e.moments.map(function (m) {
            return '<div class="tmoment"><span class="mono">' + esc(m.when) + '</span>' +
              '<p>' + esc(m.what) + '</p></div>';
          }).join('') + '</div></div>'
        : '') +

      ((e.figures || []).length
        ? '<div class="card"><h3 style="margin-top:0">Who lived then</h3><div class="grid g2">' +
          e.figures.map(function (f) {
            return '<div class="tile"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">' +
              (f.id ? art(f.id, 54) : '<span class="castmono" style="width:54px;height:54px">' + esc((f.name || '?').charAt(0)) + '</span>') +
              '<div style="flex:1"><b>' + esc(f.name) + '</b>' +
              '<p class="tiny" style="margin:4px 0 0">' + esc(f.line) + '</p></div></div></div>';
          }).join('') + '</div></div>'
        : '') +

      ((e.today || []).length
        ? '<div class="card"><h3 style="margin-top:0">Still standing</h3>' +
          '<p class="tiny muted">From this age, and you can go.</p><div class="grid g2">' +
          e.today.map(function (t) {
            return '<button class="tile" data-act="peekgo" data-code="' + esc(t.state || '') + '">' +
              '<b>' + esc(t.what) + '</b>' +
              '<span class="tiny muted">' + esc(t.where) + '</span></button>';
          }).join('') + '</div></div>'
        : '<div class="card"><h3 style="margin-top:0">Things you can actually go and see</h3><div class="row">' +
          (e.objects || []).map(function (o) { return '<span class="pill stat">' + esc(o) + '</span>'; }).join('') + '</div></div>') +

      ((e.stories || []).length
        ? (function () {
            var byId = {};
            allStories().forEach(function (st) { byId[st.id] = st; });
            var hits = e.stories.map(function (sid) { return byId[sid]; }).filter(Boolean);
            return hits.length
              ? '<div class="card"><h3 style="margin-top:0">Stories from this world</h3><div class="rail">' +
                hits.map(function (st) {
                  var im = storyArt(st.id);
                  return '<button class="scard" data-act="story" data-id="' + st.id + '">' +
                    (im ? '<img src="' + im + '" alt="" loading="lazy">' : '') +
                    '<b>' + esc(st.title) + '</b></button>';
                }).join('') + '</div></div>'
              : '';
          })()
        : '') +

      '<div class="card tint"><div class="mono">Worth stopping on</div><p style="margin:8px 0 0">' + esc(e.wonder) + '</p></div>' +

      '<div class="card flat tiny"><b>How we know.</b><ul style="margin:8px 0 0;padding-left:20px">' +
      e.sources.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      (e.needs_review ? '<p style="margin-top:10px"><b>This one needs a historian\u2019s eye before launch.</b> ' +
        'It touches things that are still argued about, and docs/05 says a human writes those.</p>' : '') +
      '</div>';
  };

  /* --------------------------------------------------------------- DHARMA */
  V.dharma = function () {
    var D = window.IND_DHARMA;
    if (!D) return '<div class="card"><h1>Dharma</h1><p>Not loaded.</p></div>';
    return '<button class="backlink" data-act="go" data-v="neeti">' + icon('back', 18) + ' Neeti</button>' +
      '<div class="card"><h1>Dharma</h1><p>' + D.intro + '</p></div>' +
      '<div class="grid g2">' + D.faiths.map(function (f) {
        return '<button class="tile" data-act="faith" data-id="' + f.id + '">' +
          '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(f.avatar, 66) +
          '<div style="flex:1"><h3 style="margin:0">' + esc(f.name) + '</h3>' +
          '<div class="tiny muted" style="margin:4px 0 8px">' + esc(f.tag) + '</div>' +
          '<p class="tiny" style="margin:0">' + f.blurb + '</p></div></div></button>';
      }).join('') + '</div>' +
      '<div class="card"><h3>' + esc(D.shared.title) + '</h3>' +
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13.5px;min-width:640px">' +
      '<tr><th style="text-align:left;padding:8px 10px"></th>' +
      D.faiths.map(function (f) { return '<th style="text-align:left;padding:8px 10px;font-family:var(--display)">' + esc(f.name) + '</th>'; }).join('') + '</tr>' +
      D.shared.rows.map(function (r) {
        return '<tr style="border-top:1px solid var(--line)">' +
          '<td style="padding:10px;font-weight:800">' + esc(r.idea) + '</td>' +
          '<td style="padding:10px;color:var(--text2)">' + esc(r.hindu) + '</td>' +
          '<td style="padding:10px;color:var(--text2)">' + esc(r.buddhist) + '</td>' +
          '<td style="padding:10px;color:var(--text2)">' + esc(r.jain) + '</td>' +
          '<td style="padding:10px;color:var(--text2)">' + esc(r.sikh) + '</td></tr>';
      }).join('') + '</table></div>' +
      '<p class="tiny muted" style="margin-top:12px">' + esc(D.shared.caveat) + '</p></div>' +
      '<div class="card tint"><h3>' + esc(D.weave.title) + '</h3><p class="tiny" style="margin:0">' + esc(D.weave.text) + '</p></div>';
  };

  V.faith = function (id) {
    var D = window.IND_DHARMA;
    var f = D && D.faiths.filter(function (x) { return x.id === id; })[0];
    if (!f) return '<div class="card">Not found.</div>';
    var stories = (allStories() || []).filter(function (s) { return (f.stories || []).indexOf(s.id) >= 0; });
    return '<button class="backlink" data-act="go" data-v="dharma">' + icon('back', 18) + ' Dharma</button>' +
      '<div class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(f.avatar, 96) +
      '<div style="flex:1"><h1 style="margin:0">' + esc(f.name) + '</h1>' +
      '<div class="mono" style="margin:6px 0 10px">' + esc(f.tag) + '</div>' +
      '<p style="margin:0">' + f.blurb + '</p></div></div></div>' +

      '<div class="card"><h3>The big ideas</h3>' + f.ideas.map(function (i) {
        return '<div class="card flat tight" style="margin-bottom:9px"><b>' + i.term + '</b>' +
          (i.say ? ' <span class="mono" style="text-transform:none">/ ' + esc(i.say) + ' /</span>' : '') +
          '<div class="tiny" style="margin-top:5px">' + i.kid + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card tint"><span class="badge ' + f.lesson.badge + '">' + f.lesson.badge + '</span>' +
      '<h2 style="margin:10px 0 8px">' + esc(f.lesson.title) + '</h2>' +
      '<p>' + f.lesson.text + '</p>' +
      '<div class="card flat tight" style="margin:0"><b>The lesson.</b> ' + esc(f.lesson.moral) + '</div></div>' +

      (stories.length ? '<div class="card"><h3>Stories from this tradition</h3>' + stories.map(function (s) {
        return '<button class="tile" style="margin-bottom:9px" data-act="story" data-id="' + s.id + '"><b>' +
          esc(s.title) + '</b><div class="tiny muted">' + esc(s.hook) + '</div></button>';
      }).join('') + '</div>' : '') +

      '<div class="card"><h3>Books it keeps</h3><ul class="tiny" style="margin:0;padding-left:20px">' +
      f.texts.map(function (t) { return '<li style="margin-bottom:6px">' + t + '</li>'; }).join('') + '</ul></div>' +

      '<div class="card"><h3>Through the year</h3><div class="row">' +
      f.festivals.map(function (x) { return '<span class="pill stat">' + x + '</span>'; }).join('') + '</div></div>' +

      '<div class="card flat"><b>In many families it is different.</b> <span class="tiny">' + esc(f.variety) + '</span></div>' +
      (f.note ? '<div class="card flat tiny"><b>A note on the pictures.</b> ' + esc(f.note) + '</div>' : '');
  };





  /* ------------------------------------------------------------------ HUBS */
  /* Twelve top-level tabs was too many. Three hubs collapse the pillars that
     belong together, and Me moved to the topbar. Six tabs. */

  function hubCard(v, title, note, icon_) {
    return '<button class="tile" data-act="go" data-v="' + v + '">' +
      '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' +
      '<span style="width:46px;height:46px;flex:none;border-radius:13px;background:var(--accent-soft);' +
      'color:var(--accent);display:grid;place-items:center">' + icon(icon_, 24) + '</span>' +
      '<div style="flex:1"><h3 style="margin:0">' + esc(title) + '</h3>' +
      '<p class="tiny" style="margin:5px 0 0">' + esc(note) + '</p></div></div></button>';
  }


  /* ------------------------------------------------------------------ UTSAV

     docs/11 §4.4: the gap is not knowing what Diwali IS. It is that in India the whole city
     stops and in New Jersey it is a Tuesday, so the child experiences the festival as private
     family strangeness instead of belonging. So this pillar leads with WHAT IS ON NOW and
     with one thing to actually do today — not with an encyclopedia entry.

     No festival here carries a date. Almost all of them move: the data holds the months a
     festival can fall in, and the note to the parent says plainly that the exact day is set
     by lunisolar reckoning, varies by region and almanac, and that two families in one city
     can both be right. Inventing a date for a children's app would be the fastest way to be
     wrong in front of the exact families this is for. */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  function utsavNow() {
    var U = window.IND_UTSAV; if (!U) return [];
    var m = MONTHS[new Date().getMonth()];
    return U.festivals.filter(function (f) { return (f.months || []).indexOf(m) >= 0; });
  }
  function festById(id) {
    var U = window.IND_UTSAV;
    return U ? U.festivals.filter(function (f) { return f.id === id; })[0] : null;
  }
  function festCard(f) {
    return '<button class="tile" data-act="fest" data-id="' + f.id + '">' +
      '<b>' + esc(f.name) + (f.script ? ' <span class="fscript">' + esc(f.script) + '</span>' : '') + '</b>' +
      '<span class="tiny muted">' + esc((f.months || []).join(' or ')) + ' · ' +
        esc((f.states || []).length > 8 ? 'across India' : (f.states || []).join(', ')) + '</span>' +
      '<p class="tiny">' + esc(f.kid.split('. ')[0]) + '.</p></button>';
  }

  V.utsav = function () {
    var U = window.IND_UTSAV;
    if (!U) return '<div class="card">Nothing here yet.</div>';
    var now = utsavNow(), month = MONTHS[new Date().getMonth()];
    var rest = U.festivals.filter(function (f) { return now.indexOf(f) < 0; });

    return '<button class="backlink" data-act="go" data-v="neeti">' + icon('back', 18) + ' Neeti</button>' +
      '<div class="card"><h1>Utsav</h1><p>' + esc(U.intro) + '</p></div>' +
      (now.length
        ? '<div class="card"><h2 style="margin-top:0">This month</h2>' +
          '<p class="tiny muted">These fall somewhere in ' + esc(month) +
            '. Which day depends on the moon, the region and your family — ask at home.</p>' +
          '<div class="grid g2">' + now.map(festCard).join('') + '</div></div>'
        : '') +
      '<div class="card"><h2 style="margin-top:0">All year</h2>' +
      '<div class="grid g2">' + rest.map(festCard).join('') + '</div></div>' +
      '<div class="card"><h3 style="margin-top:0">Why the dates move</h3>' +
        '<p class="tiny">' + esc(U.calendarNote.childLine || U.calendarNote.text || '') + '</p></div>' +

      /* The rest of living culture keeps the festivals company: the game that drills them,
         the songs that are sung at them, and the street games played on their afternoons. */
      '<div class="grid g2" style="margin-top:var(--space-lg)">' +
        (window.IND_GAMES ? '<button class="tile" data-act="game" data-id="festival"><b>Festival Frenzy</b>' +
          '<span class="tiny muted">Twelve festivals, one year — match each to its month and its home.</span></button>' : '') +
        (window.IND_GEET ? '<button class="tile" data-act="go" data-v="geet"><b>Geet</b>' +
          '<span class="tiny muted">The rhymes and lullabies your parents knew by heart.</span></button>' : '') +
        (window.IND_GULLY ? '<button class="tile" data-act="go" data-v="gully"><b>Gully</b>' +
          '<span class="tiny muted">' + window.IND_GULLY.games.length + ' street games to take outside.</span></button>' : '') +
      '</div>';
  };

  V.festival = function (id) {
    var f = festById(id);
    if (!f) return '<div class="card">Not found.</div>';
    var st = f.story ? allStories().filter(function (s) { return s.id === f.story; })[0] : null;
    return '<button class="backlink" data-act="go" data-v="utsav">' + icon('back', 18) + ' Utsav</button>' +
      '<div class="card">' +
        '<h1 style="margin-bottom:2px">' + esc(f.name) + '</h1>' +
        (f.script ? '<p class="chello" style="margin:0 0 6px">' + esc(f.script) +
          ' <span class="tiny muted">' + esc(f.roman || '') + '</span></p>' : '') +
        '<p class="tiny muted">' + esc((f.months || []).join(' or ')) + ' · the exact day moves</p>' +
        '<p>' + esc(f.kid) + '</p>' +
        (S.age >= 8 && f.big ? '<p class="tiny">' + esc(f.big) + '</p>' : '') +
      '</div>' +
      '<div class="card"><h2 style="margin-top:0">Do this</h2>' +
        '<ul class="dolist">' + (f.do || []).map(function (d) {
          return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></div>' +
      ((f.variations || []).length
        ? '<div class="card"><h2 style="margin-top:0">Not everyone does it the same</h2>' +
          (f.variations || []).map(function (v) {
            return '<p class="tiny">' + esc(v) + '</p>'; }).join('') +
          '<p class="tiny muted">Ask your family which one is yours.</p></div>'
        : '') +
      ((f.words || []).length
        ? '<div class="card"><h2 style="margin-top:0">Words for it</h2><div class="grid g3">' +
          f.words.map(function (w) {
            return '<button class="tile center" data-act="say" data-t="' + esc(w.term) +
              '" data-l="hi-IN"><b lang="hi">' + esc(w.term) + '</b>' +
              '<span class="tiny">' + esc(w.roman) + '</span>' +
              '<span class="tiny muted">' + esc(w.en) + '</span></button>'; }).join('') +
          '</div></div>'
        : '') +
      (f.ask ? '<div class="card"><h3 style="margin-top:0">Ask someone older</h3><p>' + esc(f.ask) + '</p></div>' : '') +
      (st ? '<button class="tile" data-act="story" data-id="' + st.id + '"><b>' + esc(st.title) +
            '</b><span class="tiny muted">the story that goes with it</span></button>' : '');
  };

  /* ------------------------------------------------------------------ GULLY

     docs/11 §4.6. The parent had a street and fifteen cousins; the child has scheduled
     soccer. An app cannot give back the street, but it can hand over the rules well enough
     that the game gets played in a driveway on Saturday.

     So this pillar is the one place where success is the app being CLOSED. There is no
     scoring, no "games played" count, no photo upload, no proof. The takeout copy in the
     data says so and the view honours it: the last thing on a game page is how to start,
     not a button that brings you back. */
  function gullyById(id) {
    var G = window.IND_GULLY;
    return G ? G.games.filter(function (g) { return g.id === id; })[0] : null;
  }

  V.gully = function () {
    var G = window.IND_GULLY;
    if (!G) return '<div class="card">Nothing here yet.</div>';
    /* Sorted by what you need, because "we have nothing and four kids" is the real question
       a child is answering when they open this. */
    var free = G.games.filter(function (g) { return (g.needs || [])[0] === 'nothing'; });
    var rest = G.games.filter(function (g) { return free.indexOf(g) < 0; });
    var card = function (g) {
      return '<button class="tile" data-act="gullyg" data-id="' + g.id + '">' +
        '<b>' + esc(g.name) + (g.script ? ' <span class="fscript">' + esc(g.script) + '</span>' : '') + '</b>' +
        '<span class="tiny muted">' + esc(g.players) + ' players · ' + esc(g.where) + ' · ' + esc(g.age) + '</span>' +
        '<p class="tiny">' + esc(g.kid) + '</p></button>';
    };
    return '<button class="backlink" data-act="go" data-v="utsav">' + icon('back', 18) + ' Utsav</button>' +
      '<div class="card"><h1>Gully</h1><p>' + esc(G.intro) + '</p></div>' +
      '<div class="card"><h2 style="margin-top:0">Needs nothing at all</h2>' +
        '<p class="tiny muted">No bat, no ball, no board. Just people.</p>' +
        '<div class="grid g2">' + free.map(card).join('') + '</div></div>' +
      '<div class="card"><h2 style="margin-top:0">Everything else</h2>' +
        '<div class="grid g2">' + rest.map(card).join('') + '</div></div>';
  };

  V.gullygame = function (id) {
    var G = window.IND_GULLY, g = gullyById(id);
    if (!g) return '<div class="card">Not found.</div>';
    var adapt = (G.adapt || []).filter(function (a) { return a.gameId === id; })[0];
    return '<button class="backlink" data-act="go" data-v="gully">' + icon('back', 18) + ' Gully</button>' +
      '<div class="card">' +
        '<h1 style="margin-bottom:2px">' + esc(g.name) +
          (g.script ? ' <span class="fscript">' + esc(g.script) + '</span>' : '') + '</h1>' +
        '<p class="tiny muted">' + esc(g.players) + ' players · ' + esc(g.where) + ' · best from ' + esc(g.age) + '</p>' +
        '<p>' + esc(g.kid) + '</p>' +
        '<p class="tiny"><b>You need:</b> ' + esc((g.needs || []).join(' · ')) + '</p>' +
      '</div>' +
      /* The names first, deliberately. This game has five names and a child whose family
         calls it something else should find their word here, not learn the Hindi one. */
      '<div class="card"><h2 style="margin-top:0">What it is called</h2>' +
        (g.alsoCalled || []).map(function (n) {
          return '<p class="tiny" style="margin:0 0 6px">' + esc(n) + '</p>'; }).join('') +
        '<p class="tiny muted" style="margin-top:10px">' + esc((g.region || []).join(' · ')) + '</p></div>' +
      '<div class="card"><h2 style="margin-top:0">How to play</h2>' +
        '<p>' + esc(g.setup) + '</p>' +
        '<ol class="rules">' + (g.rules || []).map(function (r) {
          return '<li>' + esc(r) + '</li>'; }).join('') + '</ol>' +
        (g.win ? '<p class="tiny"><b>It ends when:</b> ' + esc(g.win) + '</p>' : '') + '</div>' +
      ((g.words || []).length
        ? '<div class="card"><h2 style="margin-top:0">What you shout</h2>' +
          '<p class="tiny muted">This is how the words go in without anybody teaching them.</p>' +
          '<div class="grid g3">' + g.words.map(function (w) {
            return '<button class="tile center" data-act="say" data-t="' + esc(w.term) +
              '" data-l="hi-IN"><b lang="hi">' + esc(w.term) + '</b>' +
              '<span class="tiny">' + esc(w.roman) + '</span>' +
              '<span class="tiny muted">' + esc(w.en) + '</span></button>'; }).join('') + '</div></div>'
        : '') +
      ((g.variants || []).length
        ? '<div class="card"><h2 style="margin-top:0">Played differently elsewhere</h2>' +
          (g.variants || []).map(function (v) {
            return '<p class="tiny">' + esc(v) + '</p>'; }).join('') + '</div>'
        : '') +
      (adapt ? '<div class="card"><h2 style="margin-top:0">With four kids and a driveway</h2>' +
               '<p>' + esc(adapt.note) + '</p></div>' : '') +
      ((g.safe || []).length
        ? '<div class="card"><h3 style="margin-top:0">Worth knowing</h3>' +
          '<ul class="dolist">' + g.safe.map(function (s) {
            return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>'
        : '') +
      '<div class="card center"><p>' + esc((G.takeout && G.takeout.handoff) || 'Go and play it.') + '</p></div>';
  };

  /* ------------------------------------------------------------------- NANI

     docs/11 puts this at the top of the inventory and calls it the emotional apex of the
     product: the thing the parent had is a grandmother telling stories at night, and the
     only substitute for her is HER ACTUAL VOICE.

     Two halves, and they do different jobs:

       Ask Nani  — one question a week the child carries to a grandparent. This is the
                   METHOD the parent lacks (docs/11 §4.3). It converts passive learning into
                   a real conversation and gives the grandparent a role beyond being looked
                   at. It needs no backend and works today.

       The Shelf — recordings, kept on this device. The full design is a link a grandparent
                   opens with no install and no account, which needs a server. What works
                   today is real and not a mock: record a grandparent who is visiting, or
                   hold the phone up during Sunday's call. The empty state says plainly what
                   is not built yet rather than pretending.

     The questions are written correct for ONE grandparent — Hindi agrees its verb with the
     addressee, so करती थीं and करते थे are not interchangeable — which is why each carries a
     `to` and why nothing here name-swaps the Hindi. */
  var nani = { rec: null, chunks: [], clips: null, busy: false };

  function naniWeek() {
    var N = window.IND_NANI; if (!N) return null;
    /* Week of the year, so the question changes on a rhythm a family can feel and everyone
       in the household is on the same one. Not random — a question you can plan to ask. */
    var wk = Math.floor((Date.now() / 86400000 + 4) / 7) % N.questions.length;
    return N.questions[wk];
  }

  function loadClips(then) {
    Store.listClips(function (list) { nani.clips = list; then && then(); });
  }

  V.nani = function () {
    var N = window.IND_NANI;
    if (!N) return '<div class="card">Nothing here yet.</div>';
    var q = naniWeek();
    if (nani.clips === null) { loadClips(render); }
    var n = (nani.clips || []).length;

    return '<button class="backlink" data-act="go" data-v="home">' + icon('back', 18) + ' Home</button>' +
      '<div class="card"><h1>' + esc(naniTitle()) + '</h1><p>' + esc(N.archive.tagline) + '</p></div>' +

      (q ? '<div class="card askcard">' +
          '<span class="mono">This week, ask ' + esc(kinTerm(q.to)) + '</span>' +
          '<h2 style="margin:8px 0">' + esc(kinEn(q)) + '</h2>' +
          '<p lang="' + esc(q.lang || 'hi') + '" style="margin-bottom:4px">' + esc(q.hi) + '</p>' +
          '<p class="tiny muted">' + esc(q.roman) + '</p>' +
          (q.follow ? '<p class="tiny"><b>If the answer is short, ask:</b> ' + esc(q.follow) + '</p>' : '') +
          '<button class="btn" data-act="go" data-v="shelf">' + icon('mic', 18) + ' Record the answer</button>' +
        '</div>' : '') +

      '<div class="grid g2">' +
        hubCard('shelf', naniTitle(), n ? n + (n === 1 ? ' voice kept here' : ' voices kept here')
                                            : 'Nothing on the shelf yet.', 'mic') +
        hubCard('invite', 'Ask a grandparent', N.invite.landing.what, 'parent') +
      '</div>';
  };

  V.shelf = function () {
    var N = window.IND_NANI;
    if (nani.clips === null) { loadClips(render); return '<div class="card">…</div>'; }
    var list = nani.clips;
    var empty = N.ritual.empty[Math.floor(Date.now() / 86400000) % N.ritual.empty.length];

    return '<button class="backlink" data-act="go" data-v="nani">' + icon('back', 18) + ' Back</button>' +
      '<div class="card">' +
        '<h1>' + esc(naniTitle()) + '</h1>' +
        '<p>' + esc(N.archive.child) + '</p>' +
        (nani.rec
          ? '<button class="btn lg block" data-act="recstop">■ Stop and keep it</button>'
          : '<button class="btn lg block" data-act="recstart">' + icon('mic', 20) + ' Record a story</button>') +
        '<p class="tiny muted" style="margin-top:10px">' + esc(N.archive.where) + '</p>' +
      '</div>' +

      (list.length
        ? '<div class="card"><h2 style="margin-top:0">On the shelf</h2>' +
          list.map(function (c) {
            return '<div class="clip">' +
              '<div><b>' + esc(c.title || 'A story') + '</b>' +
              '<span class="tiny muted">' + new Date(c.at).toLocaleDateString() +
              (c.plays ? ' · heard ' + c.plays + (c.plays === 1 ? ' time' : ' times') : '') + '</span></div>' +
              '<button class="btn sm" data-act="clipplay" data-id="' + esc(c.id) + '">' +
                icon('play', 16) + ' ' + (c.plays ? 'Again' : 'Listen') + '</button>' +
              '<button class="btn sm ghost" data-act="clipdel" data-id="' + esc(c.id) + '">Remove</button>' +
            '</div>';
          }).join('') + '</div>'
        : '<div class="card center"><p>' + esc(empty) + '</p></div>') +

      /* The prompts exist for the grandparent who says "I don't know what to tell." */
      '<div class="card"><h2 style="margin-top:0">Things to ask them for</h2>' +
        '<div class="grid g2">' + N.prompts.slice(0, 8).map(function (p) {
          return '<div class="tile"><b>' + esc(p.en) + '</b>' +
            '<span class="tiny muted">' + esc(p.why) + '</span></div>'; }).join('') + '</div></div>';
  };

  V.invite = function () {
    var N = window.IND_NANI, L = N.invite.landing;
    return '<button class="backlink" data-act="go" data-v="nani">' + icon('back', 18) + ' Back</button>' +
      '<div class="card"><h1>' + esc(L.headline) + '</h1><p>' + esc(L.sub) + '</p>' +
        '<p>' + esc(L.what) + '</p>' +
        '<ul class="dolist">' + (L.reassurances || []).map(function (r) {
          return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="card"><h2 style="margin-top:0">Hello, in their language</h2>' +
        '<div class="grid g3">' + (N.invite.greetings || []).map(function (g) {
          return '<div class="tile center"><b lang="' + esc(g.lang || 'hi') + '">' + esc(g.word) + '</b>' +
            '<span class="tiny muted">' + esc(g.roman || '') + '</span></div>'; }).join('') + '</div>' +
        '<p class="tiny muted">Not every grandparent in this app speaks Hindi, and the app should ' +
        'never assume they do.</p></div>' +
      /* Honest about what is not built. A fake "send" button here would be the worst thing
         in the product: a parent would send nothing and a grandparent would wait. */
      '<div class="card"><h3 style="margin-top:0">Sending them a link</h3>' +
        '<p>The link a grandparent opens with no app and no account needs the family account, ' +
        'which is not built yet. Until it is, the shelf records on this device — so it works ' +
        'when they visit, or when you hold the phone up on Sunday’s call.</p>' +
        '<p class="tiny muted">' + esc(N.invite.parentNote) + '</p></div>';
  };

  /* ------------------------------------------------------------------- GEET

     docs/11 §4.5: "A parent hearing their own nursery rhyme come out of a tablet in New
     Jersey is the moment they decide to pay."

     THE HONEST PART, and the view is built around it. 28 of the 64 entries carry
     text_pending — either a rights doubt, or the writer knew three mutually inconsistent
     versions of a genuinely folk rhyme and refused to print one as canonical. docs/10 §3 is
     explicit that a half-remembered text printed as the real thing is the credibility
     failure that ends this product with the exact families it is for.

     So a pending song is not hidden and not faked. It is shown with everything that IS
     known — what it is, when it was sung, the words worth learning — and says plainly that
     the words are not written down here yet. A named gap invites a parent to fill it. An
     invented verse invites them to close the app. */
  var GEET_LANG = {
    Hindi: 'hi', Hindustani: 'hi', Awadhi: 'hi', Braj: 'hi', Sanskrit: 'sa', Prakrit: 'hi',
    Marathi: 'mr', Tamil: 'ta', Telugu: 'te', Bengali: 'bn', Assamese: 'as', Gujarati: 'gu',
    Punjabi: 'pa', Kannada: 'kn', Malayalam: 'ml', Odia: 'or', Pali: 'hi'
  };
  function geetAll() {
    var G = window.IND_GEET;
    return G ? G.songs.concat(G.bhajans || []) : [];
  }
  function geetById(id) {
    return geetAll().filter(function (s) { return s.id === id; })[0];
  }

  V.geet = function () {
    var G = window.IND_GEET;
    if (!G) return '<div class="card">Nothing here yet.</div>';
    var ready = G.songs.filter(function (s) { return !s.text_pending; });
    var pending = G.songs.filter(function (s) { return s.text_pending; });
    var card = function (s) {
      return '<button class="tile" data-act="song" data-id="' + s.id + '">' +
        '<b>' + esc(s.title) + '</b>' +
        '<span class="tiny muted">' + esc(s.lang) + ' · ' + esc(s.kind) + ' · ' + esc(s.age) + '</span>' +
        '<p class="tiny">' + esc(s.kid) + '</p>' +
        (s.text_pending ? '<span class="tiny muted">words not written down yet</span>' : '') +
        '</button>';
    };
    return '<button class="backlink" data-act="go" data-v="utsav">' + icon('back', 18) + ' Utsav</button>' +
      '<div class="card"><h1>Geet</h1><p>' + esc(G.intro) + '</p></div>' +
      '<div class="card"><h2 style="margin-top:0">Sing these</h2>' +
        '<div class="grid g2">' + ready.map(card).join('') + '</div></div>' +
      '<div class="card"><h2 style="margin-top:0">Bhajans and shabads</h2>' +
        '<div class="grid g2">' + (G.bhajans || []).map(card).join('') + '</div></div>' +
      (pending.length
        ? '<div class="card"><h2 style="margin-top:0">We know these exist</h2>' +
          '<p class="tiny muted">' + pending.length + ' songs whose words we will not print until ' +
          'someone who actually sang them has checked. Every one of them is real; the version ' +
          'in this app has to be right, not plausible.</p>' +
          '<div class="grid g2">' + pending.map(card).join('') + '</div></div>'
        : '');
  };

  V.song = function (id) {
    var G = window.IND_GEET, s = geetById(id);
    if (!s) return '<div class="card">Not found.</div>';
    var lang = GEET_LANG[s.lang] || 'hi';
    var lines = function (txt, cls, lg) {
      return '<p class="' + cls + '"' + (lg ? ' lang="' + lg + '"' : '') + '>' +
        esc(txt).replace(/\n/g, '<br>') + '</p>';
    };
    return '<button class="backlink" data-act="go" data-v="geet">' + icon('back', 18) + ' Geet</button>' +
      '<div class="card">' +
        '<h1 style="margin-bottom:2px">' + esc(s.title) + '</h1>' +
        '<p class="tiny muted">' + esc(s.lang) + ' · ' + esc(s.region) + ' · ' + esc(s.kind) + '</p>' +
        '<p>' + esc(s.kid) + '</p>' +
        (s.note ? '<p class="tiny">' + esc(s.note) + '</p>' : '') +
      '</div>' +

      (s.text_pending
        ? '<div class="card"><h2 style="margin-top:0">The words are not here yet</h2>' +
          '<p>' + esc(s.why || 'We could not confirm the words well enough to print them.') + '</p>' +
          '<p class="tiny muted">' + esc((G.singalong && G.singalong.pending) ||
            'If you know this one, your version is worth more than ours.') + '</p></div>'
        : '<div class="card lyric">' +
            lines(s.script, 'lyr', lang) +
            lines(s.roman, 'tiny muted') +
            '<hr>' + lines(s.en, 'tiny') +
            (s.variant ? '<p class="tiny muted">This one changes house to house. Yours is not ' +
              'the wrong one — sing it the way you were taught.</p>' : '') +
          '</div>') +

      ((s.words || []).length
        ? '<div class="card"><h2 style="margin-top:0">Words from it</h2><div class="grid g3">' +
          s.words.map(function (w) {
            return '<div class="tile center"><b lang="' + lang + '">' + esc(w.term) + '</b>' +
              '<span class="tiny">' + esc(w.roman) + '</span>' +
              '<span class="tiny muted">' + esc(w.en) + '</span></button>'; }).join('') + '</div></div>'
        : '') +
      ((s.actions || []).length
        ? '<div class="card"><h2 style="margin-top:0">What your hands do</h2><ul class="dolist">' +
          s.actions.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>'
        : '') +
      /* Human voice or nothing. A synthesiser cannot sing a thalattu, and docs/11 §4.2 says
         these are better in a grandparent's voice anyway — which is what the shelf is for. */
      '<div class="card center"><p class="tiny muted">No recording yet. These want a real ' +
        'voice, not a synthesised one.</p>' +
        (window.IND_NANI ? '<button class="btn ghost" data-act="go" data-v="shelf">' +
          icon('mic', 18) + ' Ask someone to sing it</button>' : '') + '</div>' +
      (s.source ? '<p class="tiny muted" style="padding:0 var(--space-lg)">' + esc(s.source) + '</p>' : '');
  };

  V.play = function () {
    var G = window.IND_GAMES || [];
    return '<div class="card"><h1>Play</h1><p>The Mela. Every stall is a drill wearing a costume.</p></div>' +
      '<div class="grid g2">' +
      hubCard('rishtey', 'Rishtey', 'Thirty exact words for your family, where English has one. Build your own tree.', 'parent') +
      (window.IND_GULLY
        ? hubCard('gully', 'Gully', window.IND_GULLY.games.length +
            ' street games, with the rules — to take outside and actually play.', 'run')
        : '') +
      (window.IND_GEET
        ? hubCard('geet', 'Geet', 'The rhymes and lullabies your parents knew by heart, ' +
            'with what the words mean.', 'sound')
        : '') +
      G.map(function (g) {
        return '<button class="tile" data-act="game" data-id="' + g.id + '">' +
          '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' +
          '<span style="width:46px;height:46px;flex:none;border-radius:13px;background:var(--accent-soft);' +
          'color:var(--accent);display:grid;place-items:center">' + icon('game', 24) + '</span>' +
          '<div style="flex:1"><h3 style="margin:0">' + esc(g.name) + '</h3>' +
          '<p class="tiny" style="margin:5px 0 0">' + esc(g.blurb || '') + '</p>' +
          '<div class="mono" style="margin-top:6px">' + (g.minutes || 2) + ' min</div></div></div></button>';
      }).join('') + '</div>';
  };


  /* ---------------------------------------------------------------- EPICS */
  /* Card-by-card serialised reading. One beat a card, a page-turn each time.
     Deliberately NOT a quiz and NOT scored — docs/10 §3.5: this is a library.
     The only affordances are forward, back, hear it again, and stop. */

  function epics() {
    var out = [];
    if (window.IND_EPIC_RAMAYANA) out.push(window.IND_EPIC_RAMAYANA);
    if (window.IND_EPIC_MAHABHARATA) out.push(window.IND_EPIC_MAHABHARATA);
    return out;
  }
  function epicById(id) {
    return epics().filter(function (e) { return e.id === id; })[0];
  }

  V.epics = function () {
    var list = epics();
    if (!list.length) return '<div class="card"><h1>The Epics</h1><p>Not loaded yet.</p></div>';
    return '<div class="card"><h1>The Epics</h1>' +
      '<p>Two very long stories that India has been telling for well over two thousand years. ' +
      'They come one card at a time — read one, stop, come back tomorrow. Nobody finishes ' +
      'these in a night; your grandparents are still not finished.</p></div>' +
      list.map(function (e) {
        var seen = (S.epic && S.epic[e.id] && S.epic[e.id].done) ? Object.keys(S.epic[e.id].done).length : 0;
        var img = 'art/banner/stories.jpg';
        return '<button class="journey" style="margin-bottom:var(--space-lg)" data-act="epic" data-id="' + e.id + '">' +
          '<div class="banner" style="background-image:url(' + img + ')">' +
          '<span class="chip">' + art(e.avatar, 28) + '</span>' +
          '<span class="tag">' + e.episodes.length + ' episodes</span></div>' +
          '<div class="body"><div class="tiny muted">' + esc(e.subtitle || '') + '</div>' +
          '<h2 style="margin:2px 0 6px">' + esc(e.title) + '</h2>' +
          '<p class="tiny" style="margin:0 0 12px">' + esc(e.blurb || '') + '</p>' +
          '<span class="btn">' + (seen ? 'Keep going' : 'Start at the beginning') + '</span></div></button>';
      }).join('');
  };

  V.epic = function (id) {
    var e = epicById(id);
    if (!e) return '<div class="card">Not found.</div>';
    var st = (S.epic && S.epic[id]) || { done: {} };
    var byBook = {};
    e.episodes.forEach(function (ep) { (byBook[ep.book] = byBook[ep.book] || []).push(ep); });

    return '<button class="backlink" data-act="go" data-v="epics">' + icon('back', 18) + ' The Epics</button>' +
      '<div class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(e.avatar, 84) +
      '<div style="flex:1"><h1 style="margin:0">' + esc(e.title) + '</h1>' +
      '<div class="mono">' + esc(e.subtitle || '') + '</div>' +
      '<p style="margin:10px 0 0">' + esc(e.blurb || '') + '</p></div></div></div>' +
      /* Said once, at the top, rather than implied by a lock on every third row. */
      (e.gate_note ? '<div class="card flat"><h3 style="margin:0 0 6px">Every episode is open</h3>' +
        '<p class="tiny" style="margin:0">' + esc(e.gate_note) + '</p></div>' : '') +
      (e.books || []).map(function (b) {
        var eps = byBook[b.id] || [];
        if (!eps.length) return '';
        return '<div class="card"><h3 style="margin:0 0 2px">' + esc(b.name) + '</h3>' +
          '<div class="mono" style="margin-bottom:4px">' + esc(b.meaning || '') + '</div>' +
          (b.note ? '<p class="tiny muted" style="margin:0 0 12px">' + esc(b.note) + '</p>' : '<div style="height:8px"></div>') +
          /* NOTHING IS LOCKED. This list used to disable every episode above the child's age
             band and label it "a bit older" — which, at the default age of 8, hid 21 of the
             Mahabharata's 33 episodes behind a phrase that explained nothing and offered no
             way forward. A child met a wall of grey and a grown-up was never told why.

             The age number is now an ADVISORY, not a barrier: every card is reachable by
             everyone, and an episode that carries a `why` shows a quiet heads-up instead of
             a lock. The information a parent needs is surfaced; the decision stays theirs.
             `why` is written for a grown-up, so the child-facing badge stays plain. */
          eps.map(function (ep) {
            var heads = (ep.gate || 0) > (e.age_gate || 0);
            var done = !!st.done[ep.n];
            /* A thumbnail of the episode's painting on the list too, so a child chooses by
               picture rather than by reading 33 titles. */
            var th = epicArt(e.id, ep.n);
            return '<button class="tile eprow" style="margin-bottom:9px" ' +
              'data-act="episode" data-id="' + e.id + '" data-n="' + ep.n + '">' +
              (th ? '<img class="epth" src="' + th + '" alt="">' : '') +
              '<div class="epbody">' +
              '<div class="spread"><b>' + ep.n + '. ' + esc(ep.title) + '</b>' +
              (done ? '<span class="badge aaj">read</span>'
                    : heads ? '<span class="badge soft">has a hard part</span>' : '') + '</div>' +
              '<div class="tiny muted" style="margin-top:4px">' + esc(ep.hook) + '</div>' +
              (heads && ep.why
                ? '<div class="grownup"><b>For a grown-up:</b> ' + esc(ep.why) + '</div>' : '') +
              (ep.note ? '<div class="tiny muted" style="margin-top:6px"><i>' + esc(ep.note) + '</i></div>' : '') +
              '</div></button>';
          }).join('') + '</div>';
      }).join('') +
      '<div class="card flat tiny"><b>Where this comes from.</b> ' + esc(e.source || '') + '</div>';
  };

  var deck = { epic: null, n: 0, i: 0 };

  function avatarName(id) { return (window.IND_AVATAR_NAMES || {})[id] || ''; }

  /* Characters named in a card's text, in the order they appear, plus the card's own speaker
     if it has one. Matching is on whole words only, so "Rama" does not fire inside
     "Ramayana" and "Tara" does not fire inside "Tarachand". Capped at four: past that the
     strip stops being a cast list and becomes a wall. */
  /* THE STAGE — the painting as the ground, the characters standing on it.
     This is the story-card idiom and the epics now share it: a picture with the people of
     the scene in front of it reads as a scene, where a picture with a caption underneath
     reads as an illustrated paragraph. The speaker is the biggest and is the one that bobs.

     Characters with no painting yet stand as an initial in a disc rather than being dropped,
     because the whole point of the cast layer is that it works before the art does. */
  function stageBlock(img, ids, speakerId) {
    var who = ids.slice(0, 3);
    var figs = who.map(function (id, i) {
      var lead = id === speakerId || (!speakerId && i === 0);
      var size = lead ? 128 : 96;
      var face = art(id, size);
      var nm = ((window.IND_EPIC_CAST || {})[id] || {}).name || avatarName(id) || id;
      return '<div class="' + (lead ? 'speaking' : '') + '">' +
        (face || '<span class="stagemono" style="width:' + size + 'px;height:' + size + 'px">' +
          esc(nm.charAt(0)) + '</span>') +
        '<span class="stagename">' + esc(nm) + '</span></div>';
    }).join('');
    return '<div class="stage"' +
      (img ? ' style="background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.35)),url(' + img + ')"' : '') +
      '>' + figs + '</div>';
  }

  /* A card is somebody talking if it carries quoted speech. 121 of the Ramayana's 283 cards
     do. Those get a bubble; the rest get the plain narration panel, because putting a tail
     on the storyteller's own voice would attribute it to whoever happens to be on stage. */
  function hasDialogue(t) { return /["“]/.test(t || ''); }

  function cardCast(text, speaker) {
    var REG = window.IND_EPIC_CAST || {}, seen = {}, found = [];
    Object.keys(REG).forEach(function (id) {
      var names = [REG[id].name].concat(REG[id].alias || []);
      for (var i = 0; i < names.length; i++) {
        var at = text.search(new RegExp('\\b' + names[i] + '\\b'));
        if (at >= 0) { if (!(id in seen) || at < seen[id]) seen[id] = at; break; }
      }
    });
    found = Object.keys(seen).sort(function (a, b) { return seen[a] - seen[b]; });
    if (speaker && speaker !== 'mithu' && found.indexOf(speaker) < 0 && REG[speaker]) {
      found.unshift(speaker);
    }
    return found.slice(0, 4);
  }
  function cardVoice(epicId, n, i) { return 'ep/' + epicId + '-' + n + '-' + i; }
  function hasVoice(k) { return !!(window.IND_VOICE && window.IND_VOICE.indexOf(k) >= 0); }

  V.episode = function () {
    var e = epicById(deck.epic);
    if (!e) return '<div class="card">Not found.</div>';
    var ep = e.episodes.filter(function (x) { return x.n === deck.n; })[0];
    if (!ep) return '<div class="card">Not found.</div>';
    var last = deck.i >= ep.cards.length;
    var nextEp = e.episodes.filter(function (x) { return x.n === deck.n + 1; })[0];

    if (last) {
      return '<button class="backlink" data-act="epic" data-id="' + e.id + '">' + icon('back', 18) + ' ' + esc(e.title) + '</button>' +
        '<div class="card center">' + mascot('mithu', 'wink', 96) +
        '<div class="mono">End of episode ' + ep.n + '</div>' +
        '<h1 style="margin:6px 0 12px">' + esc(ep.title) + '</h1>' +
        '<p style="font-size:18px;max-width:44ch;margin:0 auto var(--space-lg)">' + esc(ep.ends_on || '') + '</p>' +
        (hasVoice('ep/' + e.id + '-' + ep.n + '-end')
          ? '<button class="btn ghost sm" style="margin-bottom:var(--space-lg)" data-act="say" ' +
            'data-k="ep/' + e.id + '-' + ep.n + '-end">' + icon('sound', 16) + ' Hear it again</button>' : '') +
        (nextEp ? '<button class="btn lg" data-act="episode" data-id="' + e.id + '" data-n="' + nextEp.n + '">' +
          'Next: ' + esc(nextEp.title) + ' →</button>' :
          '<p class="tiny muted">That is the last one we have written. More is coming.</p>') +
        '<div class="row" style="justify-content:center;margin-top:12px">' +
        '<button class="btn ghost" data-act="episode" data-id="' + e.id + '" data-n="' + ep.n + '">' + icon('play', 18) + ' Again</button>' +
        '<button class="btn ghost" data-act="epic" data-id="' + e.id + '">All episodes</button></div></div>' +
        /* THE THING TO THINK ABOUT — a question, never a moral. Both epics were deliberately
           written without a moral field: the Mahabharata in particular refuses to hand down
           verdicts, and bolting "the lesson is…" onto Karna at the wheel would flatten the
           one thing that makes it worth telling. So the episode closes on an open question
           it genuinely raises, and where a value from Neeti honestly fits, the door to it. */
        (ep.wonder
          ? '<div class="card wonder"><div class="mono">Something to think about</div>' +
            '<p>' + esc(ep.wonder) + '</p>' +
            /* The question is the one thing on this page addressed straight at the child, so
               it is the thing most worth having read aloud. */
            '<button class="iconbtn" style="margin-right:8px" data-act="saywonder" ' +
              'data-id="' + e.id + '" data-n="' + ep.n + '" aria-label="Read the question">' +
              icon('sound', 20) + '</button>' +
            (ep.value && window.IND_NEETI
              ? (function () {
                  var v = window.IND_NEETI.values.filter(function (x) { return x.id === ep.value; })[0];
                  return v ? '<button class="btn ghost sm" data-act="value" data-id="' + v.id + '">' +
                    'More about ' + esc(v.roman) + ' →</button>' : '';
                })()
              : '') +
            '<p class="tiny muted" style="margin:var(--space-md) 0 0">There is no right answer ' +
            'here. Ask a grown-up what they think — they may not be sure either.</p></div>'
          : '') +
        (ep.words_hi && ep.words_hi.length ? '<div class="card"><h3>Three words from this one</h3><div class="grid g3">' +
          ep.words_hi.map(function (w) {
            return '<button class="tile center" data-act="say" data-k="hi/w-' + slug(w[1]) +
              '" data-t="' + esc(w[0]) + '" data-l="hi-IN">' +
              '<div class="deva" style="font-size:26px">' + esc(w[0]) + '</div>' +
              '<div class="mono">' + esc(w[1]) + '</div><div class="tiny">' + esc(w[2]) + '</div></button>';
          }).join('') + '</div></div>' : '');
    }

    var c = ep.cards[deck.i];
    var who = c.who;
    var speaker = who === 'mithu' ? null : who;

    /* Every card gets its own painting of its own beat — the deck is a painted book, and a
       card with a picture of a different moment would be worse than no picture. Loaded
       lazily so turning to card three never costs the other eleven. */
    var epArt = epicArt(e.id, ep.n, deck.i);

    /* WHO IS SPEAKING. `who` is null on narrated beats — most of them, because the epics
       deliberately keep the principals in the storyteller's voice rather than borrow a wrong
       face. The old card filled that null with the EPIC's avatar, so every narrated card put
       Rama's portrait above words Rama is not saying. A narrated card now carries no
       portrait at all; the storyteller is a voice, not a character. */
    var vk = cardVoice(e.id, ep.n, deck.i);
    var speakerArt = who === 'mithu' ? mascot('mithu', 'talk', 56) : speaker ? art(speaker, 56) : '';
    var speakerLabel = who === 'mithu' ? 'Mithu' : (speaker ? avatarName(speaker) : '');

    /* WHO IS IN THIS CARD — found in the card's own words.
       `card.who` is set on barely a tenth of the cards and `episode.cast` lists only the few
       characters an avatar happens to exist for, because the epics deliberately keep the
       principals in the storyteller's voice. So neither field can answer "who is in this
       scene". The card text can: it names them. cardCast() matches the registry in
       data-epic-cast.js against the text, so a card about Dhritarashtra and Gandhari shows
       both, in the order they are mentioned, whether or not either has ever been painted.
       The name and the one-line description are the part a child actually needs; the face,
       when it exists, is a bonus. */
    var cast = cardCast(c.text, who);

    return '<button class="backlink" data-act="epic" data-id="' + e.id + '">' + icon('back', 18) + ' ' + esc(e.title) + '</button>' +
      /* Title and counter on their own line: at 430px the counter used to wrap under the
         title and collide with the dots. */
      '<div class="deckhead">' +
        '<span class="mono">' + esc(ep.title) + '</span>' +
        '<span class="deckn">' + (deck.i + 1) + ' / ' + ep.cards.length + '</span>' +
      '</div>' +
      '<div class="dots">' + ep.cards.map(function (_, i) { return '<i class="' + (i <= deck.i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +

      /* The stage, then the words — the same shape as a story card. */
      stageBlock(epArt, cast, speaker) +
      '<div class="speech' + (hasDialogue(c.text) ? ' bubble' : '') + '" style="margin-top:14px">' +
        (speakerLabel ? '<span class="who">' + esc(speakerLabel) + '</span>' : '') +
        esc(c.text).replace(/\*(.+?)\*/g, '<i>$1</i>') +
      '</div>' +

      /* Who these people are. Under the words rather than over them, because the story comes
         first and the who's-who is for when a name has just landed and meant nothing. */
      (cast.length
        ? '<div class="castrow">' + cast.map(function (id) {
            var p = (window.IND_EPIC_CAST || {})[id] || {};
            return '<div class="castchip' + (id === who ? ' on' : '') + '">' +
              '<b>' + esc(p.name || avatarName(id) || id) + '</b>' +
              (p.desc ? '<span>' + esc(p.desc) + '</span>' : '') + '</div>';
          }).join('') + '</div>'
        : '') +

      '<div class="deckbar" style="margin-top:14px">' +
        (deck.i > 0 ? '<button class="iconbtn" data-act="cardback" aria-label="Back">' + icon('back', 20) + '</button>' : '') +
        '<button class="iconbtn" data-act="readcard" aria-label="Read it to me">' + icon('sound', 20) + '</button>' +
        '<button class="btn" style="flex:1" data-act="cardnext">' +
          (deck.i === ep.cards.length - 1 ? 'End of episode \u2192' : 'Turn the page \u2192') + '</button>' +
      '</div>';
  };

  /* ---------------------------------------------------------------- SHLOK */
  /* The "recited" channel from docs/11 — the thing a grandparent can still say
     from memory sixty years on. Not a quiz: a verse, what it means, and the
     invitation to say it back. Everything here is draft until a reader of that
     language has checked it, and the UI says so rather than hiding it. */

  V.shlok = function () {
    var K = window.IND_SHLOK;
    if (!K) return '<div class="card"><h1>Shlok</h1><p>Not loaded.</p></div>';
    return '<div class="card"><h1>Shlok</h1>' +
      '<p>Verses worth carrying. Your grandparents can probably still say some of these from ' +
      'memory — they learned them at about your age, and never lost them.</p></div>' +
      (K.review && K.review.status !== 'ready' ?
        '<div class="card flat tiny"><b>Draft.</b> Every verse here still needs a reader of that ' +
        'language to check it against a printed edition. We would rather say that than pretend. ' +
        'Nothing is quoted from memory — where we were unsure of the wording, we left it out.</div>' : '') +
      '<div class="grid g2">' + K.collections.map(function (c) {
        var mine = K.verses.filter(function (v) { return v.collection === c.id; });
        if (!mine.length) return '';
        return '<button class="tile" data-act="verses" data-id="' + c.id + '">' +
          '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(c.avatar, 58) +
          '<div style="flex:1"><h3 style="margin:0">' + esc(c.name) + '</h3>' +
          '<div class="mono">' + esc(c.language || '') + (c.count_total ? ' · ' + c.count_total + ' in all' : '') + '</div>' +
          '<p class="tiny" style="margin:7px 0 0">' + esc(c.blurb || '') + '</p>' +
          '<div class="tiny muted" style="margin-top:7px">' + mine.length + ' here so far</div>' +
          '</div></div></button>';
      }).join('') + '</div>';
  };

  V.verses = function (cid) {
    var K = window.IND_SHLOK;
    var c = K.collections.filter(function (x) { return x.id === cid; })[0];
    if (!c) return '<div class="card">Not found.</div>';
    /* Every verse is listed. A verse a child cannot yet carry is still a verse they should
       know is waiting, and hiding it just made the collection look shorter than it is. */
    var mine = K.verses.filter(function (v) { return v.collection === cid; });
    var big = (S.age || 8) >= 9;
    return '<button class="backlink" data-act="go" data-v="shlok">' + icon('back', 18) + ' Shlok</button>' +
      '<div class="card"><h1>' + esc(c.name) + '</h1>' +
      '<div class="mono">' + esc(c.language || '') + '</div>' +
      '<p style="margin-top:10px">' + esc(c.blurb || '') + '</p>' +
      '<div class="tiny muted">' + esc(c.source || '') + '</div></div>' +
      mine.map(function (v) {
        return '<div class="card">' +
          '<div class="spread"><span class="mono">' + (v.n_local ? '' : esc(c.name) + ' ' + v.n) + '</span>' +
          (v.unsure || v.needs_original ? '<span class="badge">wording to check</span>' : '') + '</div>' +
          (v.text_original ?
            '<p class="deva" style="font-size:22px;line-height:1.85;margin:12px 0 6px">' + esc(v.text_original) + '</p>' : '') +
          (v.translit ? '<div class="mono" style="text-transform:none;margin-bottom:10px">' + esc(v.translit) + '</div>' : '') +
          '<p style="font-size:17px;margin:10px 0 6px">' + esc(v.meaning_kid) + '</p>' +
          (big && v.meaning_big ? '<p class="tiny muted">' + esc(v.meaning_big) + '</p>' : '') +
          (v.why ? '<div class="card flat tight" style="margin:12px 0 0"><b>Why carry it.</b> ' + esc(v.why) + '</div>' : '') +
          '<div class="row" style="margin-top:12px">' +
          '<button class="pill" data-act="say" data-k="' + esc(v.audio || '') + '">' + icon('sound', 16) + ' hear it</button>' +
          '<button class="pill" data-act="recite" data-id="' + esc(v.id) + '">' + icon('mic', 16) + ' say it back</button>' +
          '</div>' +
          '<div class="tiny muted" style="margin-top:10px">' + esc(v.source) + '</div>' +
          (v.note ? '<div class="tiny muted" style="margin-top:5px"><i>' + esc(v.note) + '</i></div>' : '') +
          '</div>';
      }).join('');
  };

  /* ---------------------------------------------------------------- NEETI */
  /* The payoff here is deliberately NOT a ladder. Nobody acquires a value by
     consuming stories, so levels would be a lie. What earns a bead is DOING the
     small thing — and a grown-up witnessing it. The mala grows and is never
     finished, which is also true of the thing it represents. */

  V.neeti = function () {
    var K = window.IND_NEETI;
    if (!K) return '<div class="card"><h1>Neeti</h1><p>Not loaded.</p></div>';
    var beads = (S.mala || []).length;
    /* NEETI IS THE WHOLE PILLAR NOW — values, faiths, festivals, verses — because they are
       one subject seen from four sides. A value is what a story leaves behind; the faiths
       are where those stories are carried, each told from the inside and never ranked; the
       festivals are the days a family actually lives them; the verses are how they are
       remembered word for word. Splitting that across two tabs made each half look like a
       module, and this app does not sell modules. */
    var fest = (typeof utsavNow === 'function') ? utsavNow() : [];
    return '<div class="card"><h1>Neeti</h1><p>' + esc(K.intro) + '</p>' +
      '<p class="tiny muted">No levels here, and nothing to finish. You get a bead when you ' +
      '<b>do</b> one of these, not when you read about it.</p></div>' +
      (beads ? V.malaStrip() : '') +

      '<div class="grid g2" style="margin-bottom:var(--space-lg)">' +
        (window.IND_DHARMA
          ? '<button class="tile" data-act="go" data-v="dharma">' +
            '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art('buddha', 52) +
            '<div style="flex:1"><h3 style="margin:0">Dharma — the faiths</h3>' +
            '<p class="tiny" style="margin:5px 0 0">Hinduism, Buddhism, Jainism and Sikhi, each ' +
            'told from the inside — where these values are carried.</p></div></div></button>'
          : '') +
        (window.IND_UTSAV
          ? '<button class="tile" data-act="go" data-v="utsav">' +
            '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + icon('lamp', 40) +
            '<div style="flex:1"><h3 style="margin:0">Utsav — the festivals</h3>' +
            '<p class="tiny" style="margin:5px 0 0">' +
            (fest.length ? esc(fest[0].name) + ' falls this month. ' : '') +
            window.IND_UTSAV.festivals.length + ' festivals — the days all of this is lived.' +
            '</p></div></div></button>'
          : '') +
      '</div>' +

      '<button class="tile" style="margin-bottom:var(--space-lg)" data-act="go" data-v="shlok">' +
      '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art('saraswati', 52) +
      '<div style="flex:1"><h3 style="margin:0">Shlok — verses to carry</h3>' +
      '<p class="tiny" style="margin:5px 0 0">Thirukkural, Dhammapada, subhashitas. The ones your ' +
      'grandparents can still say from memory.</p></div></div></button>' +
      '<div class="grid g2">' + K.values.map(function (v) {
        var n = (S.mala || []).filter(function (b) { return b.v === v.id; }).length;
        return '<button class="tile" data-act="value" data-id="' + v.id + '">' +
          '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(v.avatar, 58) +
          '<div style="flex:1">' +
          '<span class="deva" style="font-size:22px;font-weight:700;color:' + v.colour + '">' + esc(v.term) + '</span> ' +
          '<span class="mono" style="text-transform:none">' + esc(v.roman) + '</span>' +
          '<div style="font-family:var(--display);font-weight:800;font-size:17px;margin:4px 0 3px">' + esc(v.en) + '</div>' +
          '<div class="tiny muted">' + esc(v.kid) + '</div>' +
          (n ? '<div class="tiny" style="margin-top:7px;color:' + v.colour + '"><b>' + n + ' bead' + (n > 1 ? 's' : '') + '</b></div>' : '') +
          '</div></div></button>';
      }).join('') + '</div>';
  };

  /* THE MALA — the payoff system, and the one thing in this app that needed explaining and
     did not explain itself. It replaces the ladder deliberately (docs/11 §3.5, the founder's
     "don't apply the Bizzing Bee ladder"): a mala is counted through by hand, one bead at a
     time, and nobody checks it. That is the whole idea. A bead is earned by DOING something
     — moving the spider outside — never by finishing a story.

     So it renders whether or not there are any beads, and the empty state is where the rule
     gets stated. Hiding it until the first bead meant the only surface that explained the
     system was invisible to everyone who had not already worked the system out. */
  V.malaStrip = function () {
    var K = window.IND_NEETI; if (!K) return '';
    var beads = S.mala || [];
    var col = function (id) { var v = K.values.filter(function (x) { return x.id === id; })[0]; return v ? v.colour : 'var(--accent)'; };
    return '<div class="card" style="margin-top:var(--space-lg)"><div class="spread" style="margin-bottom:10px">' +
      '<div><h3 style="margin:0">Your mala</h3>' +
      '<div class="tiny muted">A bead for every time you <b>did</b> something — never for ' +
      'reading one. Nobody checks it. That is rather the point.</div></div>' +
      '<span class="pill stat">' + beads.length + '</span></div>' +
      (beads.length
        ? '<div class="mala">' + beads.slice(-40).map(function (b) {
            return '<i style="background:' + col(b.v) + '" title="' + esc(b.v) + '"></i>';
          }).join('') + '</div>' +
          (beads.length > 40 ? '<p class="tiny muted">showing the last 40</p>' : '')
        : '<div class="mala empty">' +
            new Array(13).join('<i></i>') +
          '</div>' +
          '<p class="tiny muted">Empty for now. Do the small thing at the top of this screen ' +
          'and the first one is yours — and it stays, because a bead is something you did and ' +
          'that cannot un-happen.</p>') +
      '</div>';
  };

  V.value = function (id) {
    var K = window.IND_NEETI;
    var v = K && K.values.filter(function (x) { return x.id === id; })[0];
    if (!v) return '<div class="card">Not found.</div>';
    var mine = allStories().filter(function (s) { return (v.stories || []).indexOf(s.id) >= 0; });
    var done = (S.mala || []).filter(function (b) { return b.v === v.id; });
    var big = (S.age || 8) >= 9;

    return '<button class="backlink" data-act="go" data-v="neeti">' + icon('back', 18) + ' Neeti</button>' +
      '<div class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(v.avatar, 92) +
      '<div style="flex:1"><span class="deva" style="font-size:34px;font-weight:700;color:' + v.colour + '">' + esc(v.term) + '</span>' +
      '<div class="mono" style="text-transform:none">' + esc(v.roman) + '</div>' +
      '<h1 style="margin:6px 0 8px">' + esc(v.en) + '</h1>' +
      '<p style="margin:0;font-size:17px">' + esc(v.kid) + '</p></div></div>' +
      (big ? '<div class="card flat" style="margin-top:14px">' + esc(v.big) + '</div>' : '') + '</div>' +

      /* THE DEED — the only thing that earns anything */
      '<div class="card tint notch"><div class="mono">Do this one</div>' +
      '<p style="font-family:var(--display);font-size:21px;margin:8px 0 14px">' + esc(v.doit) + '</p>' +
      '<div class="row">' +
      '<button class="btn" data-act="deed" data-id="' + v.id + '">I did it</button>' +
      '<button class="btn ghost" data-act="deednani" data-id="' + v.id + '">Tell ' + esc(kinTerm('nani')) + '</button></div>' +
      (done.length ? '<div class="tiny muted" style="margin-top:12px">You have done this ' +
        done.length + ' time' + (done.length > 1 ? 's' : '') + '. Last: ' + esc(done[done.length - 1].on) + '</div>' : '') +
      '<p class="tiny muted" style="margin-top:10px">Nobody is checking. That is rather the point.</p></div>' +

      (mine.length ? '<div class="card"><h3>Told this way</h3>' +
        '<p class="tiny muted">The same idea, from different traditions. None of them is the right one.</p>' +
        mine.map(function (s) {
          return '<button class="tile" style="margin-bottom:9px" data-act="story" data-id="' + s.id + '">' +
            '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(s.hero, 48) +
            '<div style="flex:1"><b>' + esc(s.title) + '</b>' +
            '<div class="tiny muted">' + esc(s.hook) + '</div></div></div></button>';
        }).join('') + '</div>' : '') +

      '<div class="card"><h3>Somebody who actually did it</h3>' +
      '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(v.person.avatar, 76) +
      '<div style="flex:1"><b>' + esc(v.person.name) + '</b>' +
      '<div class="tiny" style="margin-top:5px">' + esc(v.person.did) + '</div></div></div></div>' +

      '<div class="card flat"><div class="mono">Recited</div>' +
      '<p style="margin:8px 0 0">' + esc(v.verse) + '</p>' +
      '<p class="tiny muted" style="margin-top:8px">Ask a grown-up if they know this one. They ' +
      'very likely learned it at your age.</p></div>' +

      '<div class="card flat tiny"><b>Why more than one tradition.</b> ' + esc(v.note) + '</div>';
  };

  /* -------------------------------------------------------------- RISHTEY */
  /* The kinship words. docs/11: the single most immediately usable thing here —
     learn it Saturday, use it on Sunday's call. */
  var rish = { i: 0, picked: null, right: 0 };

  V.rishtey = function () {
    var R = window.IND_RISHTEY;
    if (!R) return '<div class="card"><h1>Rishtey</h1><p>Not loaded.</p></div>';
    var byTier = R.terms.slice().sort(function (a, b) { return a.tier - b.tier; });
    var week = R.ask[new Date().getDay() % R.ask.length];
    return '<div class="card"><h1>Rishtey</h1><p>' + esc(R.intro) + '</p>' +
      '<button class="btn" data-act="rishquiz">Build your family tree →</button></div>' +

      '<div class="card tint notch"><div class="mono">Ask a grown-up this week</div>' +
      '<p style="font-family:var(--display);font-size:19px;margin:8px 0 0">' + esc(week) + '</p>' +
      '<p class="tiny muted" style="margin-top:8px">Then tell them what they said. That is how ' +
      'these stories stay alive — somebody asks.</p></div>' +

      '<div class="card"><h3>Everyone has a name</h3>' +
      '<div class="grid g2">' + byTier.map(function (t) {
        return '<button class="tile" data-act="say" data-k="hi/w-' + esc(t.roman.split(' ')[0]) + '">' +
          '<div class="spread"><div>' +
          '<span class="deva" style="font-size:26px;font-weight:700">' + esc(t.hi) + '</span> ' +
          '<span class="mono" style="text-transform:none">' + esc(t.roman) + '</span></div>' +
          '<span class="pill stat tiny">' + (t.side === 'p' ? 'father’s side' : t.side === 'm' ? 'mother’s side' : 'yours') + '</span>' +
          '</div>' +
          '<div style="font-weight:700;margin-top:6px">' + esc(t.en) + '</div>' +
          (t.note ? '<div class="tiny muted" style="margin-top:5px">' + esc(t.note) + '</div>' : '') +
          (t.also ? '<div class="tiny muted" style="margin-top:7px">' +
            Object.keys(t.also).map(function (k) { return esc(t.also[k]); }).join(' · ') + '</div>' : '') +
          '</button>';
      }).join('') + '</div></div>' +

      '<div class="card flat tiny"><b>The other languages need a native check.</b> The Hindi is ' +
      'solid; the Punjabi, Tamil, Bengali, Gujarati and Telugu equivalents are there so this ' +
      'pillar is not Hindi-only, and a speaker of each should read them before launch.</div>';
  };

  V.rishquiz = function () {
    var R = window.IND_RISHTEY, q = R.tree[rish.i];
    if (!q) {
      return '<button class="backlink" data-act="go" data-v="rishtey">' + icon('back', 18) + ' Rishtey</button>' +
        '<div class="card center">' + mascot('gattu', 'wow', 104) +
        '<h1>That is your family.</h1>' +
        '<p style="font-size:17px">You got ' + rish.right + ' of ' + R.tree.length + '.</p>' +
        '<p>Now go and use one. On the next call, say it out loud — <span class="deva">नानी</span>, ' +
        '<span class="deva">दादा</span>, <span class="deva">मामा</span>. They will hear it.</p>' +
        '<button class="btn" data-act="rishquiz" data-reset="1">Go again</button></div>';
    }
    var pool = R.terms.filter(function (t) { return t.id !== q.answer; });
    var opts = [q.answer];
    for (var i = 0; i < pool.length && opts.length < 4; i += Math.max(1, Math.floor(pool.length / 5))) opts.push(pool[i].id);
    opts.sort(function (a, b) { return a.localeCompare(b); });
    var term = function (id) { return R.terms.filter(function (t) { return t.id === id; })[0] || {}; };
    var ans = term(q.answer);

    return '<button class="backlink" data-act="go" data-v="rishtey">' + icon('back', 18) + ' Rishtey</button>' +
      '<div class="spread" style="margin-bottom:12px"><span class="mono">Your family tree</span>' +
      '<div class="dots">' + R.tree.map(function (_, i) { return '<i class="' + (i <= rish.i ? 'on' : '') + '"></i>'; }).join('') + '</div></div>' +
      '<div class="card center"><div class="mono">What do you call</div>' +
      '<h1 style="margin:8px 0 18px">' + esc(q.slot) + '?</h1>' +
      (rish.picked ?
        '<div class="card ' + (rish.picked === q.answer ? 'tint' : 'flat') + '">' +
          '<div class="deva" style="font-size:44px;font-weight:700">' + esc(ans.hi) + '</div>' +
          '<div class="mono" style="text-transform:none">' + esc(ans.roman) + '</div>' +
          '<p style="margin-top:10px">' + esc(ans.en) + '</p>' +
          (ans.note ? '<p class="tiny muted">' + esc(ans.note) + '</p>' : '') +
          '<button class="btn block" style="margin-top:12px" data-act="rishnext">Next →</button></div>'
        : opts.map(function (id) {
            var t = term(id);
            return '<button class="opt" data-act="rishpick" data-id="' + id + '">' +
              '<span class="deva" style="font-size:24px">' + esc(t.hi) + '</span> ' +
              '<span class="mono" style="text-transform:none">' + esc(t.roman) + '</span></button>';
          }).join('')) +
      '</div>';
  };

  /* --------------------------------------------------------------- WORLDS */
  V.worlds = function () {
    return '<div class="card"><h1>Worlds</h1>' +
      '<p>Each world re-paints the whole app in a real Indian folk-art tradition — and tells you where it comes from. ' +
      'They are not decoration; they are part of what you are learning.</p></div>' +
      '<div class="grid g2">' + WORLDS.map(function (w) {
        return '<button class="tile' + (S.world === w.id ? ' on' : '') + '" data-act="world" data-w="' + w.id + '">' +
          '<div class="wpreview" data-world="' + w.id + '">' +
            '<b style="background:var(--accent)"></b>' +
            '<b style="background:var(--accent2);width:24px;height:24px"></b>' +
            '<b style="background:var(--accent3);width:19px;height:19px"></b>' +
            '<span class="aa">आ Aa</span>' +
          '</div>' +
          '<div class="spread"><h3 style="margin:0">' + esc(w.name) + '</h3>' +
          (S.world === w.id ? '<span class="badge aaj">on</span>' : '') + '</div>' +
          '<div class="mono">' + esc(w.region) + '</div>' +
          '<p class="tiny" style="margin:8px 0 0">' + esc(w.note) + '</p></button>';
      }).join('') + '</div>' +
      '<div class="card flat tiny"><b>Credit.</b> These palettes are drawn from living traditions with living ' +
      'practitioners. In the real product every world names the artist it was commissioned from — folk art is ' +
      'somebody’s livelihood, not a free texture pack.</div>';
  };

  /* --------------------------------------------------------------- BHASHA */
  V.bhasha = function () {
    if (!window.IND_SCRIPTS || !window.IND_PACKS) return '<div class="card"><h1>Bhasha</h1><p>The language engine has not loaded.</p></div>';
    var packs = window.IND_PACKS;
    return '<div class="card"><h1>Bhasha</h1>' +
      '<p>Not one language — a platform. Hindi and Punjabi run on the <b>same engine</b>, because almost every ' +
      'Indian script works the same way underneath. Adding Gujarati or Tamil is a data file, not a rewrite.</p>' +
      '<span class="badge">Premium in the real product</span></div>' +
      /* the family's language leads; everything else follows in file order */
      (function () {
        var keys = Object.keys(packs), t = tongue();
        /* the registry names a pack id, but only a pack that has actually
           REGISTERED counts — packs land one data file at a time */
        var lead = t && t.pack && packs[t.pack] ? t.pack : null;
        if (lead && keys.indexOf(lead) > 0) {
          keys.splice(keys.indexOf(lead), 1); keys.unshift(lead);
        }
        var missing = t && !lead
          ? '<div class="card tint"><b lang="' + t.lang + '">' + esc(t.native) + '</b> — ' +
            esc(t.en) + ' is on its way onto this same engine: the same eight rungs, ' +
            esc(t.en) + ' words. Every pack below is open to you meanwhile.</div>'
          : '';
        return missing + '<div class="grid g2">' + keys.map(function (k) {
          var p = packs[k], sc = window.IND_SCRIPTS[p.script], st = S.lang[k] || { asked: 0, correct: 0 };
          return '<button class="tile" data-act="pack" data-id="' + k + '">' +
            (lead === k ? '<div class="mono" style="color:var(--accent)">your family’s language</div>' : '') +
            '<div class="deva" lang="' + esc((p.name.nativeLang || k)) + '" style="font-size:44px;line-height:1">' + esc(sc && sc.consonants && sc.consonants[0] ? sc.consonants[0].char : '') + '</div>' +
            '<h3 style="margin:10px 0 2px" class="deva" lang="' + esc(k) + '">' + esc(p.name.native || p.name.en) + '</h3>' +
            '<div class="mono">' + esc(p.name.en) + ' · ' + esc(sc ? sc.name : p.script) + '</div>' +
            '<div class="tiny muted" style="margin-top:8px">' + st.correct + ' right of ' + st.asked + '</div></button>';
        }).join('') + '</div>';
      })() +
      /* Practice wearing a costume. With Play gone from the bar, the drills live beside the
         path they drill for — the Duolingo move: the game is the treat at the rung. The Mela
         keeps every stall for whoever wants the whole fairground. */
      '<div class="card"><h3 style="margin:0 0 4px">Khel</h3>' +
      '<p class="tiny muted">Games that are secretly practice.</p>' +
      '<div class="grid g2">' +
        '<button class="tile" data-act="game" data-id="rangoli"><b>Rangoli Rush</b>' +
        '<span class="tiny muted">See it, lose it, draw it back — memory in patterns.</span></button>' +
        '<button class="tile" data-act="go" data-v="rishtey"><b>Rishtey</b>' +
        '<span class="tiny muted">Thirty exact words for your family, where English has one.</span></button>' +
        '<button class="tile" data-act="game" data-id="jataka"><b>Jataka Jump</b>' +
        '<span class="tiny muted">Hear a tiny fable, find the lesson hiding in it.</span></button>' +
        '<button class="tile" data-act="go" data-v="play"><b>The whole Mela</b>' +
        '<span class="tiny muted">Every stall in one place.</span></button>' +
      '</div></div>' +
      '<div class="card flat tiny"><b>Note.</b> The Hindi and Punjabi audio here is synthesised, as a placeholder. ' +
      'Per <code>docs/09</code> it must be replaced with human voice before launch — children imitate these sounds, ' +
      'and TTS teaches errors a native-speaker parent hears instantly.</div>';
  };

  var quiz = { packId: null, stage: null, q: null, done: 0, right: 0 };

  /* ------------------------------------------------------------- A PACK

     The front door used to be a wall of 46 letters with an eight-row list underneath, and a
     child arriving had no idea what to press. It is now a PATH — Duolingo's spine, because a
     single obvious next thing is the whole reason that app works — carrying Bizzing Bee's
     ladder and its sense that you are climbing something.

     One CTA at the top: the stage you are on, with what it will make you able to do. Then the
     path itself, each stage a node showing how far in you are. The letter chart is no longer
     the front page; it lives behind its own door, because a chart is a reference and a
     reference is not a lesson. */
  function stageStat(packId, sid) {
    var rec = (S.lang[packId] || {}).stages || {};
    return rec[sid] || { asked: 0, correct: 0 };
  }
  /* A stage counts as done at 12 right answers — enough to have met most of its items
     without turning a library into a grind. */
  var STAGE_TARGET = 12;
  function stagePct(packId, sid) {
    return Math.min(100, Math.round(stageStat(packId, sid).correct / STAGE_TARGET * 100));
  }
  function nextStage(p) {
    var list = p.stages || [];
    for (var i = 0; i < list.length; i++) if (stagePct(p.id, list[i].id) < 100) return list[i];
    return list[list.length - 1];
  }

  V.pack = function (id) {
    var p = window.IND_PACKS[id]; if (!p) return '<div class="card">Pack not found.</div>';
    var sc = window.IND_SCRIPTS[p.script];
    if (quiz.packId !== id) quiz = { packId: id, stage: null, q: null, done: 0, right: 0 };
    if (quiz.q) return '<button class="backlink" data-act="pack" data-id="' + id + '">' +
      icon('back', 18) + ' ' + esc(p.name.en) + '</button>' + V.question(quiz.q);

    var stages = p.stages || [];
    var nxt = nextStage(p);
    var doneN = stages.filter(function (s) { return stagePct(id, s.id) >= 100; }).length;

    return '<button class="backlink" data-act="go" data-v="bhasha">' + icon('back', 18) + ' Bhasha</button>' +

      '<div class="card"><div class="spread">' +
        '<div><h1 class="deva" style="margin:0">' + esc(p.name.native) + '</h1>' +
        '<div class="mono">' + esc(p.name.en) + ' · ' + esc(sc.name) + '</div></div>' +
        '<span class="pill stat">' + doneN + ' / ' + stages.length + '</span></div>' +
        '<div class="meter" style="margin-top:14px"><i style="width:' +
          Math.round(doneN / Math.max(1, stages.length) * 100) + '%"></i></div></div>' +

      /* The one obvious thing to do next. */
      (nxt ? '<button class="card nextup" data-act="quiz" data-s="' + esc(nxt.id) + '">' +
        '<div class="row" style="flex-wrap:nowrap;align-items:center">' +
        mascot('gattu', 'happy', 64) +
        '<div style="flex:1;text-align:left"><div class="mono">Carry on with</div>' +
        '<h2 style="margin:2px 0 4px">' + esc(nxt.name) + '</h2>' +
        '<p class="tiny" style="margin:0">' + esc(nxt.outcome || '') + '</p></div>' +
        '<span class="btn">' + icon('play', 18) + ' Go</span></div></button>' : '') +

      '<div class="card"><h3 style="margin:0 0 4px">The path</h3>' +
        '<p class="tiny muted">The same eight rungs in every language — that is the point of ' +
        'the engine.</p>' +
        '<div class="path">' + stages.map(function (s, i) {
          var pct = stagePct(id, s.id);
          var state = pct >= 100 ? 'done' : (s.id === nxt.id ? 'now' : 'ahead');
          return '<button class="pnode ' + state + '" data-act="quiz" data-s="' + esc(s.id) + '">' +
            '<span class="pdisc">' + (pct >= 100 ? '✓' : (i + 1)) + '</span>' +
            '<span class="pbody"><b>' + esc(s.name) + '</b>' +
            '<span class="tiny muted">' + esc(s.outcome || '') + '</span>' +
            (pct > 0 && pct < 100 ? '<span class="meter sm"><i style="width:' + pct + '%"></i></span>' : '') +
            '</span></button>';
        }).join('') + '</div></div>' +

      /* The chart, behind its own door. */
      '<button class="tile" data-act="chart" data-id="' + id + '">' +
        '<b>The ' + esc(sc.name) + ' chart</b>' +
        '<span class="tiny muted">All ' + ((sc.vowels || []).length + (sc.consonants || []).length) +
        ' letters, with the sound of each. Look things up here any time.</span></button>';
  };

  /* The letter chart. A reference, deliberately separate from the lessons. */
  V.chart = function (id) {
    var p = window.IND_PACKS[id]; if (!p) return '<div class="card">Not found.</div>';
    var sc = window.IND_SCRIPTS[p.script];
    var grid = function (list) {
      return '<div class="gridscript">' + (list || []).map(function (v) {
        return '<button class="glyph" data-act="say" data-k="' + esc(v.audio || '') +
          /* the synthesis fallback must speak the pack's own language, not Hindi */
          '" data-t="' + esc(v.char) + '" data-l="' + esc((p.id || 'hi') + '-IN') + '">' +
          esc(v.char) + '<small>' + esc(v.name) + '</small></button>';
      }).join('') + '</div>';
    };
    return '<button class="backlink" data-act="pack" data-id="' + id + '">' + icon('back', 18) +
      ' ' + esc(p.name.en) + '</button>' +
      '<div class="card"><h1>' + esc(sc.name) + '</h1>' +
      '<div class="mono">tap any letter to hear it</div>' +
      '<h3 style="margin-top:20px">Vowels</h3>' + grid(sc.vowels) +
      '<h3 style="margin-top:18px">Consonants</h3>' + grid(sc.consonants) +
      ((sc.matras || []).length ? '<h3 style="margin-top:18px">Matras</h3>' + grid(sc.matras) : '') +
      '</div>';
  };

  function optLabel(o) { if (o == null) return ''; if (typeof o === 'string') return o; return o.char || o.word || o.sign || o.syllable || o.en || o.roman || ''; }
  function optSub(o) { if (!o || typeof o === 'string') return ''; if (o.word && o.en) return o.en; return o.name || o.roman || ''; }

  V.question = function (q) {
    var opts = q.options || q.tiles || [], prompt, hint = '', big = '';
    switch (q.type) {
      case 'listenPoint': prompt = 'Listen — which one is it?'; break;
      case 'soundMatch':  prompt = 'Which letter makes this sound?'; break;
      case 'matraAttach': prompt = 'Add this matra to the letter';
        big = '<div class="bigglyph"><span class="deva">' + esc(q.base) + '</span> <span style="color:var(--accent)">+</span> <span class="deva">' + esc(q.matra) + '</span></div>';
        hint = 'It goes ' + esc(q.position || 'somewhere') + '.'; break;
      case 'wordBuild':   prompt = 'Which piece starts this word?';
        big = '<div class="bigglyph deva">' + esc(q.word || '') + '</div>'; hint = esc(q.en || q.roman || ''); break;
      case 'oddOneOut':   prompt = 'Which one does not belong?'; break;
      case 'conjunctSplit': prompt = 'This letter is two letters squashed together. Which two?';
        big = '<div class="bigglyph deva">' + esc(q.conjunct || '') + '</div>'; hint = q.word ? 'As in ' + esc(q.word) : ''; break;
      default: prompt = q.prompt || 'Pick the right one';
    }
    var grid = ['soundMatch', 'matraAttach', 'oddOneOut', 'conjunctSplit', 'wordBuild'].indexOf(q.type) >= 0;
    var choices = opts.map(function (o, i) {
      var l = esc(optLabel(o)), s = esc(optSub(o));
      return grid ? '<button class="glyph" data-act="ans" data-i="' + i + '">' + l + (s ? '<small>' + s + '</small>' : '') + '</button>'
        : '<button class="opt" data-act="ans" data-i="' + i + '"><span class="deva" style="font-size:22px">' + l + '</span>' + (s ? ' <span class="muted tiny">' + s + '</span>' : '') + '</button>';
    }).join('');
    return '<div class="card"><h3>' + esc(prompt) + '</h3>' + big +
      (q.audio ? '<button class="btn ghost block" style="margin-bottom:14px" data-act="say" data-k="' + esc(q.audio) + '">' + icon('sound', 20) + ' Play it again</button>' : '') +
      (hint ? '<p class="tiny muted">' + hint + '</p>' : '') +
      (grid ? '<div class="gridscript">' + choices + '</div>' : choices) +
      '<div class="mono" style="margin-top:14px">' + quiz.right + ' right of ' + quiz.done + ' · no timer, no lives</div></div>';
  };

  /* ------------------------------------------------------------------ MELA */
  V.mela = function () {
    var G = window.IND_GAMES || [];
    if (!G.length) return '<div class="card"><h1>The Mela</h1><p>The games have not loaded.</p></div>';
    return '<div class="card"><h1>The Mela</h1><p>The carnival. Every stall is a drill wearing a costume.</p></div>' +
      '<div class="grid g2">' + G.map(function (g) {
        return '<button class="tile" data-act="game" data-id="' + g.id + '"><h3 style="margin:0 0 6px">' + esc(g.name) + '</h3>' +
          '<p class="tiny" style="margin:0 0 10px">' + esc(g.blurb || '') + '</p>' +
          '<div class="mono">' + (g.minutes || 2) + ' min</div></button>';
      }).join('') + '</div>';
  };
  V.game = function () {
    return '<button class="backlink" data-act="go" data-v="mela">' + icon('back', 18) + ' Mela</button>' +
      '<div class="card"><div id="gamehost"></div></div>';
  };

  /* -------------------------------------------------------------------- ME */
  V.me = function () {
    var packs = window.IND_AVATAR_PACKS || [];
    return '<div class="card"><div class="row" style="flex-wrap:nowrap">' + art(S.buddy, 92) +
      '<div><h1 style="margin:0">' + esc(S.name || 'Yatri') + '</h1>' +
      '<div class="row" style="margin-top:8px">' +
      '<span class="pill stat">🐚 ' + S.kauris + '</span>' +
      '<span class="pill stat">' + esc(rank()) + '</span>' +
      '<span class="pill stat">' + Object.keys(S.lit).length + ' places</span>' +
      '<span class="pill stat">' + Object.keys(S.read).length + ' stories</span></div></div></div></div>' +
      '<div class="card"><h3>Who travels with you</h3>' + packs.map(function (p) {
        return '<div class="tiny muted" style="margin:14px 0 8px;font-weight:700">' + esc(p.name) + ' — ' + esc(p.note) + '</div>' +
          '<div class="grid g4">' + p.ids.map(function (id) {
            return chip(id, 74);
          }).join('') + '</div>';
      }).join('') + '</div>' +
      '<button class="tile" style="margin-bottom:var(--space-lg)" data-act="go" data-v="worlds">' +
      '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' +
      '<span style="width:46px;height:46px;flex:none;border-radius:13px;background:var(--accent-soft);' +
      'color:var(--accent);display:grid;place-items:center">' + icon('star', 24) + '</span>' +
      '<div style="flex:1"><h3 style="margin:0">Worlds</h3>' +
      '<p class="tiny" style="margin:5px 0 0">Repaint everything in a real Indian folk-art tradition. ' +
      'Currently: ' + esc(S.world) + '.</p></div></div></button>' +
      '<div class="card"><h3>Grown-ups</h3><div class="row">' +
      '<button class="pill' + (soundOn ? ' on' : '') + '" data-act="sound">' + icon('sound', 18) + ' Sound</button>' +
      '<button class="pill' + (night ? ' on' : '') + '" data-act="night">Night mode</button>' +
      '<button class="pill" data-act="reset">Start again</button></div>' +
      '<p class="tiny muted" style="margin-top:12px">Build <b>' + esc(window.IND_BUILD || 'dev') + '</b>' +
      ' — if something looks wrong, quote this number so we know which version you are on.</p>' +
      '<p class="tiny muted">This demo keeps everything on this device. No account, ' +
      'no child data leaves the browser — which is also how the real product is designed (docs/07).</p></div>';
  };

  /* ---------------------------------------------------------------- TONGUE */
  /* The family-language picker. It leans, it never gates — the copy on this
     page is the contract, so keep it honest if it changes. */
  V.tongue = function () {
    var t = tongue();
    return '<button class="backlink" data-act="go" data-v="home">' + icon('back', 18) + ' Home</button>' +
      '<div class="card"><h1>Your family’s language</h1>' +
      '<p>We don’t know where your family is from — so tell us once, and the app leans your ' +
      'way. Everything stays; only the order changes.</p>' +
      tongueChips() + '</div>' +
      '<div class="card"><h3 style="margin:0 0 6px">What leans</h3>' +
      '<ul class="dolist">' +
      '<li>Stories from your family’s places come to the top of the shelf.</li>' +
      '<li>Your states glow on the map.</li>' +
      '<li>Your language leads in Bhasha' + (t && !(t.pack && window.IND_PACKS && window.IND_PACKS[t.pack])
        ? ' — ' + esc(t.en) + '’s pack is still being built, and the engine is ready for it'
        : '') + '.</li>' +
      '<li>The word of the day arrives in your language.</li>' +
      '<li>The grandparent words become your own — ' +
      (t && t.id !== 'hi'
        ? 'you ask <b>' + esc(kinTerm('nani')) + '</b> and <b>' + esc(kinTerm('nana')) + '</b>'
        : 'a Tamil child asks <b>Paati</b>, not Nani') + '.</li></ul>' +
      (t && t.kinNote ? '<p class="tiny muted" style="margin-top:10px">' + esc(t.kinNote) +
        ' Kinship words differ family to family — ask yours.</p>' : '') + '</div>' +
      '<div class="card flat tiny"><b>What never changes.</b> Itihaas, Neeti and Bhasha keep ' +
      'their Sanskrit names — those belong to everyone. And no language hides anything: every ' +
      'story, every state and every pack stays open to every child. Languages don’t stop at ' +
      'state lines either — the states above are where yours is most at home, not a fence.</div>';
  };

  /* ================================================================== SHELL */
  /* FIVE TABS, one per verb. Stories is everything told; India is everything that is a
     place or a time (the map with the River of Time inside it); Neeti is everything
     carried (values, faiths, festivals, verses); Bhasha is everything practised — the
     games live inside the pillars they drill, because play is how this app practises,
     not a separate subject. A child holds a phone by the bottom half, so on a phone this
     bar moves to the bottom edge (see app.css). */
  var TABS = [['home', 'Home', 'chart'], ['stories', 'Stories', 'tree'], ['map', 'India', 'map'],
              ['itihaas', 'Itihaas', 'clock'], ['neeti', 'Neeti', 'star'], ['bhasha', 'Bhasha', 'script']];

  function chrome() {
    return '<header class="topbar"><div class="barrow">' +
      /* the mark is the peacock, not a mascot — Gattu still narrates, he just
         doesn't have to BE the logo (and the user said as much) */
      '<div class="brand">' + (window.IND_ART_IMG && window.IND_ART_IMG.indexOf('logo') >= 0
        ? '<img src="art/logo.png" alt="" width="68" height="68">'
        : '') + 'Bizzing <em>India</em></div>' +
      '<span class="pill stat">🐚 <span id="kauriCount">' + S.kauris + '</span></span>' +
      /* the family-language chip: shows the tongue in its own script, opens the picker */
      (window.IND_TONGUE
        ? '<button class="pill stat" data-act="go" data-v="tongue" aria-label="Your family’s language">' +
          (tongue() ? '<span lang="' + tongue().lang + '">' + esc(tongue().native) + '</span>' : icon('script', 16)) +
          '</button>'
        : '') +
      '<button class="iconbtn" data-act="sound" aria-label="sound">' + icon('sound', 20) + '</button>' +
      '<button class="iconbtn" data-act="go" data-v="me" aria-label="you" style="overflow:hidden;padding:0">' +
      art(S.buddy, 40) + '</button>' +
      '</div><nav class="nav">' + TABS.map(function (t) {
        return '<button class="navtab" data-act="go" data-v="' + t[0] + '">' + icon(t[2], 19) + '<span>' + t[1] + '</span></button>';
      }).join('') + '</nav></header><main class="wrap" id="main"></main>';
  }

  function render() {
    var r = document.documentElement;
    r.setAttribute('data-world', S.world);
    if (night) r.setAttribute('data-mode', 'night'); else r.removeAttribute('data-mode');
    var root = document.getElementById('app');

    if (!S.started) {
      root.innerHTML = (view.name === 'onboard') ? '<div id="main">' + V.onboard() + '</div>' : V.landing();
      return;
    }
    if (!$('.topbar')) root.innerHTML = chrome();

    var m = $('#main'), h;
    switch (view.name) {
      case 'map': h = V.map(); break;
      case 'state': h = V.state(view.arg); break;
      case 'stories': h = V.stories(); break;
      case 'story': h = V.story(view.arg); break;
      case 'bhasha': h = V.bhasha(); break;
      case 'pack': h = V.pack(view.arg); break;
      case 'chart': h = V.chart(view.arg); break;
      case 'mela': h = V.mela(); break;
      case 'game': h = V.game(); break;
      case 'learn': h = V.map(); break;   /* the Learn hub is gone; old links land on the map */
      case 'play': h = V.play(); break;
      case 'epics': h = V.epics(); break;
      case 'epic': h = V.epic(view.arg); break;
      case 'episode': h = V.episode(); break;
      case 'shlok': h = V.shlok(); break;
      case 'verses': h = V.verses(view.arg); break;
      case 'neeti': h = V.neeti(); break;
      case 'value': h = V.value(view.arg); break;
      case 'rishtey': h = V.rishtey(); break;
      case 'rishquiz': h = V.rishquiz(); break;
      case 'itihaas': h = V.itihaas(); break;
      case 'era': h = V.era(view.arg); break;
      case 'dharma': h = V.dharma(); break;
      case 'utsav': h = V.utsav(); break;
      case 'gully': h = V.gully(); break;
      case 'nani': h = V.nani(); break;
      case 'geet': h = V.geet(); break;
      case 'song': h = V.song(view.arg); break;
      case 'shelf': h = V.shelf(); break;
      case 'invite': h = V.invite(); break;
      case 'gullygame': h = V.gullygame(view.arg); break;
      case 'festival': h = V.festival(view.arg); break;
      case 'faith': h = V.faith(view.arg); break;
      case 'worlds': h = V.worlds(); break;
      case 'tongue': h = V.tongue(); break;
      case 'me': h = V.me(); break;
      default: h = V.home();
    }
    m.innerHTML = h;
    /* Scroll to the top only when the page actually changes. render() runs for lots of
       small things — opening a map callout, earning a bead, answering a quiz — and
       yanking the scroll position on those threw the reader back to the top of a page
       they had not left. Page turns inside a story or episode count as navigation,
       because the new card's text should start in view. */
    var sig = view.name + ':' + (view.arg || '') +
      (view.name === 'episode' ? ':' + deck.n + ':' + deck.i : '') +
      (view.name === 'story' ? ':' + (play.i || 0) : '');
    if (sig !== lastScrollSig) window.scrollTo(0, 0);
    lastScrollSig = sig;

    var alias = { state: 'map', mon: 'map', learn: 'map', era: 'itihaas',
                  dharma: 'neeti', faith: 'neeti', utsav: 'neeti', festival: 'neeti',
                  gully: 'neeti', gullygame: 'neeti', geet: 'neeti', song: 'neeti',
                  story: 'stories', pack: 'bhasha', chart: 'bhasha',
                  game: 'bhasha', mela: 'bhasha', play: 'bhasha', rishtey: 'bhasha', rishquiz: 'bhasha',
                  nani: 'stories', shelf: 'stories', invite: 'stories',
                  value: 'neeti', shlok: 'neeti', verses: 'neeti', epics: 'stories', epic: 'stories', episode: 'stories',
                  worlds: 'me', tongue: 'home' };
    var cur = alias[view.name] || view.name;
    Array.prototype.forEach.call(document.querySelectorAll('.navtab'), function (t) {
      t.classList.toggle('active', t.getAttribute('data-v') === cur);
    });
    if (view.name === 'game') mountGame(view.arg);
  }

  /* a running game owns document-level key handlers and timers */
  var gameTeardown = null;
  function killGame() {
    if (!gameTeardown) return;
    try { if (typeof gameTeardown === 'function') gameTeardown(); else if (gameTeardown.destroy) gameTeardown.destroy(); } catch (e) {}
    gameTeardown = null;
  }
  function go(n, a) { stopAudio(); killGame(); view = { name: n, arg: a }; render(); }

  function mountGame(id) {
    var g = (window.IND_GAMES || []).filter(function (x) { return x.id === id; })[0], host = $('#gamehost');
    if (!g || !host) return;
    try {
      gameTeardown = g.engine(host, {}, function (res) {
        res = res || {};
        earn(res.kauris || (res.win ? 10 : 4), g.name); markToday();
        setTimeout(function () { go('mela'); }, 900);
      });
    } catch (e) { host.innerHTML = '<p class="muted">This stall could not open: ' + esc(e.message) + '</p>'; }
  }

  /* =============================================================== DISPATCH */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var a = t.getAttribute('data-act');

    if (a === 'begin')  { view = { name: 'onboard' }; return render(); }
    if (a === 'go')     return go(t.getAttribute('data-v'));
    if (a === 'state')  return go('state', t.getAttribute('data-code'));
    /* Tapping a state on the map shows its facts in place rather than navigating away —
       the map is for browsing, and being thrown into a full page on every touch is what
       stopped it being browsable. Tapping the same state again closes the panel. */
    if (a === 'saywonder') {
      var we = epicById(t.getAttribute('data-id'));
      var wn = +t.getAttribute('data-n');
      var wep = we && we.episodes.filter(function (x) { return x.n === wn; })[0];
      if (wep) readAloud('ep/' + we.id + '-' + wn + '-wonder', wep.wonder);
      return;
    }
    if (a === 'readcard') {
      var re = epicById(deck.epic);
      var rep = re && re.episodes.filter(function (x) { return x.n === deck.n; })[0];
      var rc = rep && rep.cards[deck.i];
      if (rc) readAloud(cardVoice(re.id, rep.n, deck.i), rc.text);
      return;
    }
    if (a === 'peek') {
      var pc = t.getAttribute('data-code');
      mapFocus = (mapFocus === pc) ? null : pc;
      return render();
    }
    /* From Home: open the map already focused on that state, so the tap lands somewhere
       that explains itself rather than on a map the child then has to search. */
    if (a === 'peekgo') { mapFocus = t.getAttribute('data-code'); return go('map'); }
    if (a === 'faith')  return go('faith', t.getAttribute('data-id'));
    if (a === 'fest')   return go('festival', t.getAttribute('data-id'));
    if (a === 'chart')  return go('chart', t.getAttribute('data-id'));
    if (a === 'gullyg') return go('gullygame', t.getAttribute('data-id'));
    if (a === 'song')   return go('song', t.getAttribute('data-id'));

    /* Recording a grandparent. The mic is only ever opened by this explicit tap, the track is
       stopped the moment recording ends so no light stays on, and the blob never leaves the
       device — that is the promise data-nani.js makes to the family in writing. */
    if (a === 'recstart') {
      if (nani.busy) return;
      nani.busy = true;
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        nani.chunks = [];
        nani.rec = new MediaRecorder(stream);
        nani.rec.ondataavailable = function (e) { if (e.data.size) nani.chunks.push(e.data); };
        nani.rec.onstop = function () {
          stream.getTracks().forEach(function (tr) { tr.stop(); });
          var blob = new Blob(nani.chunks, { type: nani.rec.mimeType || 'audio/webm' });
          var q = naniWeek();
          Store.putClip({ id: 'c' + Date.now(), at: Date.now(), blob: blob, plays: 0,
                          title: q ? q.en : 'A story' }, function () {
            nani.rec = null; nani.busy = false;
            loadClips(function () { toast('Kept on the shelf.'); render(); });
          });
        };
        nani.rec.start();
        nani.busy = false;
        render();
      }).catch(function () {
        nani.busy = false;
        toast('The microphone is not available. Check the browser’s permission.');
      });
      return;
    }
    if (a === 'recstop') { if (nani.rec && nani.rec.state !== 'inactive') nani.rec.stop(); return; }
    if (a === 'clipplay') {
      var cid = t.getAttribute('data-id');
      var clip = (nani.clips || []).filter(function (c) { return c.id === cid; })[0];
      if (!clip) return;
      stopAudio();
      var url = URL.createObjectURL(clip.blob);
      var au = new Audio(url);
      au.onended = function () { URL.revokeObjectURL(url); };
      au.play();
      /* Counted as love, not as repetition — docs/10 §3.5. Hearing it for the fiftieth time
         is the point, so the number goes up and nothing ever goes down. */
      clip.plays = (clip.plays || 0) + 1;
      Store.putClip(clip, function () { render(); });
      return;
    }
    if (a === 'clipdel') {
      var did = t.getAttribute('data-id');
      if (!confirm('Remove this recording? It cannot be got back.')) return;
      Store.delClip(did, function () { loadClips(render); });
      return;
    }
    if (a === 'era')    return go('era', t.getAttribute('data-id'));
    if (a === 'rishquiz') {
      if (t.getAttribute('data-reset') || rish.i >= window.IND_RISHTEY.tree.length) rish = { i: 0, picked: null, right: 0 };
      return go('rishquiz');
    }
    if (a === 'rishpick') {
      var pick = t.getAttribute('data-id');
      rish.picked = pick;
      if (pick === window.IND_RISHTEY.tree[rish.i].answer) { rish.right++; earn(3, 'rishtey'); }
      return render();
    }
    if (a === 'rishnext') { rish.i++; rish.picked = null; return render(); }
    if (a === 'value')  return go('value', t.getAttribute('data-id'));
    if (a === 'verses') return go('verses', t.getAttribute('data-id'));
    if (a === 'epic')   return go('epic', t.getAttribute('data-id'));
    if (a === 'episode') {
      deck = { epic: t.getAttribute('data-id'), n: +t.getAttribute('data-n'), i: 0 };
      return go('episode');
    }
    if (a === 'cardnext') {
      var ed = epicById(deck.epic);
      var epd = ed && ed.episodes.filter(function (x) { return x.n === deck.n; })[0];
      deck.i++;
      if (epd && deck.i >= epd.cards.length) {
        S.epic = S.epic || {}; S.epic[deck.epic] = S.epic[deck.epic] || { done: {} };
        if (!S.epic[deck.epic].done[deck.n]) {
          S.epic[deck.epic].done[deck.n] = today();
          earn(10, 'an episode'); markToday();
        }
        save();
      }
      return render();
    }
    if (a === 'cardback') { if (deck.i > 0) deck.i--; return render(); }
    if (a === 'recite') {
      /* saying it aloud is the whole exercise; nothing is recorded or scored */
      S.recited = S.recited || {};
      var vid = t.getAttribute('data-id');
      if (!S.recited[vid]) { S.recited[vid] = today(); earn(4, 'said it aloud'); save(); }
      toast('Say it out loud, twice. That is how it sticks.');
      return;
    }
    if (a === 'deed') {
      var vid = t.getAttribute('data-id');
      S.mala = S.mala || [];
      S.mala.push({ v: vid, on: today() });
      save(); earn(5, 'you did it');
      toast('A bead for your mala.');
      return render();
    }
    if (a === 'deednani') {
      var vv = window.IND_NEETI.values.filter(function (x) { return x.id === t.getAttribute('data-id'); })[0];
      var msg = (S.name || 'Your grandchild') + ' did this today: ' + (vv ? vv.doit : '');
      if (navigator.share) { navigator.share({ text: msg }).catch(function () {}); }
      else { toast('Copy this: ' + msg); }
      return;
    }
    if (a === 'story') {
      var id = t.getAttribute('data-id');
      play = { story: null, i: 0, answered: false }; go('story', id);
      var s = allStories().filter(function (x) { return x.id === id; })[0];
      if (s) speak('st/' + slug(s.id) + '-0');
      return;
    }
    if (a === 'next') {
      play.i++; play.answered = false;
      var st = play.story;
      if (st && play.i >= st.scenes.length) {
        if (!S.read[st.id]) {
          S.read[st.id] = true;
          var c = (st.place || [])[0]; if (c) lightState(c.replace('IN-', ''));
          earn(12, 'story finished'); markToday();
        }
        save();
      } else if (st) speak('st/' + slug(st.id) + '-' + play.i);
      return render();
    }
    if (a === 'answer') {
      var ask = play.story.scenes[play.i].ask, i = +t.getAttribute('data-i');
      play.answered = (i === ask.answer) ? ask.right : ask.wrong;
      if (i === ask.answer) earn(3, 'good thinking');
      return render();
    }
    if (a === 'tellone') {
      /* the app picks, the way a grandparent picks — favouring the unheard */
      var pool = allStories(), unread = pool.filter(function (x) { return !S.read[x.id]; });
      var pick = (unread.length ? unread : pool)[Math.floor(Math.random() * (unread.length ? unread.length : pool.length))];
      if (!pick) return;
      play = { story: null, i: 0, answered: false };
      go('story', pick.id); speak('st/' + slug(pick.id) + '-0');
      return;
    }
    if (a === 'again') {
      var aid = t.getAttribute('data-id');
      play = { story: null, i: 0, answered: false };
      go('story', aid); speak('st/' + slug(aid) + '-0');
      return;
    }
    if (a === 'love') {
      S.favs = S.favs || {};
      var lid = t.getAttribute('data-id');
      if (S.favs[lid]) { delete S.favs[lid]; } else { S.favs[lid] = today(); toast('Kept. It will be waiting.'); }
      save(); return render();
    }
    if (a === 'say')    return speak(t.getAttribute('data-k'),
                                     t.getAttribute('data-t'), t.getAttribute('data-l'));
    if (a === 'pick')   {
      if (view.name === 'onboard') { var nmKeep = $('#nm'); if (nmKeep) obName = nmKeep.value; }
      S.buddy = t.getAttribute('data-id'); save(); return render();
    }
    if (a === 'settongue') {
      if (view.name === 'onboard') { var nmKeep2 = $('#nm'); if (nmKeep2) obName = nmKeep2.value; }
      S.tongue = t.getAttribute('data-id') || null; save();
      var tg = tongue();
      toast(tg ? tg.en + ' it is — ask ' + kinTerm('nani') + '.' : 'All of India, evenly.');
      /* the topbar chip shows the tongue, and chrome() is cached — rebuild it */
      if ($('.topbar')) document.getElementById('app').innerHTML = chrome();
      return render();
    }
    if (a === 'world')  { S.world = t.getAttribute('data-w'); save(); toast('World: ' + S.world); return render(); }
    if (a === 'start')  {
      var nm = $('#nm'), ag = $('#ageIn');
      S.name = (nm && nm.value.trim()) || 'Yatri';
      S.age = ag ? +ag.value : 8;
      S.mode = S.age <= 7 ? 'chhote' : 'bade';
      S.goal = S.age <= 7 ? 2 : 3;
      S.started = today(); save(); return go('home');
    }
    if (a === 'sound')  { soundOn = !soundOn; Store.saveDevice('sound', soundOn); if (!soundOn) stopAudio(); toast('Sound ' + (soundOn ? 'on' : 'off')); return render(); }
    if (a === 'night')  { night = !night; Store.saveDevice('night', night); return render(); }
    if (a === 'reset')  { if (confirm('Clear everything on this device and start again?')) { localStorage.removeItem(Store.KEY); location.reload(); } return; }
    if (a === 'mon')    { var mo = (window.IND_GEO.monuments || []).filter(function (x) { return x.id === t.getAttribute('data-id'); })[0]; if (mo) toast(mo.name + ' — ' + mo.fact); return; }
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
      var want = (typeof q.answerIndex === 'number') ? q.answerIndex : q.answer;
      var ok = (idx === want);
      var rec = S.lang[quiz.packId] || (S.lang[quiz.packId] = { asked: 0, correct: 0, seen: {} });
      rec.asked++; if (ok) rec.correct++;
      /* Per stage as well as per pack, or the path has nothing to draw. */
      rec.stages = rec.stages || {};
      var sst = rec.stages[quiz.stage] || (rec.stages[quiz.stage] = { asked: 0, correct: 0 });
      sst.asked++; if (ok) sst.correct++;
      save();
      t.classList.add(ok ? 'right' : 'wrong');
      if (!ok && typeof want === 'number') {
        var w = document.querySelector('[data-act="ans"][data-i="' + want + '"]'); if (w) w.classList.add('right');
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

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'ageIn') { var o = $('#ageOut'); if (o) o.textContent = e.target.value; }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.started && view.name !== 'home') go('home');
    if (e.key === 'ArrowRight' && view.name === 'story') { var n = document.querySelector('[data-act="next"]'); if (n) n.click(); }
    /* Map states are SVG <g>, which a browser will focus but will not activate on Enter the
       way it does a <button>. Everything in this app has to work from the keyboard as well
       as by touch, so wire it up by hand. */
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement) {
      var g = document.activeElement.closest && document.activeElement.closest('g[data-act="peek"]');
      if (g) { e.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    render();
    // Also the handle tools/verify.js drives the app by, so the headless walk exercises the
    // real navigation rather than a parallel test path.
    window.BI = { S: S, go: go, render: render, Store: Store,
                  allStories: allStories, epics: epics };
  });
})();
