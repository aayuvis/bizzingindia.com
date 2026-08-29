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
    buddy: 'ganesha', world: 'delhi6',
    voice: 'f',                   /* which recorded voice to hear — see humanClip() */
    hindi: false,                 /* read stories in Hindi alongside English */
    rate: 1,                      /* how fast the voice reads — see speakRate() */
    sikke: 0, xp: 0,
    /* what has been bought or drawn. Sacred and epic packs are never in here — they are
       open to everyone from the first minute (economy.js, rule 2). */
    own: { worlds: [], packs: [], avatars: [] },
    lit: {}, read: {}, lang: {},
    streak: { days: [], last: null, count: 0 },
    goal: 3, todayCount: 0, todayOn: null,
    started: null
  };
  /* MIGRATION. The currency used to be called kauris and lived in S.kauris. Same coins,
     new name, so the balance carries over instead of a child waking up broke. */
  if (S.sikke == null) S.sikke = S.kauris || 0;
  if (!S.own) S.own = { worlds: [], packs: [], avatars: [] };
  S.own.worlds = S.own.worlds || []; S.own.packs = S.own.packs || []; S.own.avatars = S.own.avatars || [];

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
  /* The name of the whole story pillar, in the family's own words. A Tamil
     child's shelf is Paati-Thaatha Tales, a Bengali child's is Dida-Dadu
     Tales. Hindi falls through to Nani-Nana because that is what kinTerm
     returns when no tongue is set — which is the honest default rather than
     a claim that Hindi is the neutral one (docs/05 §8). */
  function tellerTitle() { return kinTerm('nani') + '-' + kinTerm('nana') + ' Tales'; }

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

  /* one avatar chip. Rarity is paused (see avatars.js), so no tier label; the
     act is a parameter because onboarding picks directly while the Me page
     opens the companion's card first. */
  function chip(id, size, act) {
    var r = window.IND_RARITY_OF ? window.IND_RARITY_OF(id) : 'free';
    var meta = (window.IND_RARITY || {})[r] || {};
    return '<button class="avchip' + (S.buddy === id ? ' on' : '') + '" data-rar="' + r +
      '" data-act="' + (act || 'pick') + '" data-id="' + id + '" title="' + esc(meta.label || '') + '">' +
      art(id, size) +
      '<span>' + esc((window.IND_AVATAR_NAMES || {})[id] || id) + '</span>' +
      (r !== 'free' ? '<span class="rarlabel">' + esc(meta.label || r) + '</span>' : '') +
      '</button>';
  }

  /* (the avatar card view lives just after V's declaration below — it cannot
     be defined here, above `var V = {}`) */

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
      .concat(window.IND_STORIES_VIGYAN || [])
      .concat(window.IND_STORIES_DASHAVATARA || [])
      .concat(window.IND_STORIES_DEVASURA || []);
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
      .concat(window.IND_COLLECTIONS_VIGYAN || [])
      .concat(window.IND_COLLECTIONS_DASHAVATARA || [])
      .concat(window.IND_COLLECTIONS_DEVASURA || []);
  }

  function toast(m) {
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = m;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2300);
  }
  function earn(n, why) {
    S.sikke += n; S.xp += n; save();
    toast('🐚 +' + n + (why ? ' · ' + why : ''));
    var el = $('#kauriCount'); if (el) el.textContent = S.sikke;
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
  /* A HUMAN TAKE BEATS A SYNTHESISED ONE, ALWAYS.
     tools/studio.js records real Hindi speakers straight to Opus and
     gen-voice-manifest.js registers what it finds as IND_VOICE_HUMAN:
         "hi/d-01-p": { e: "webm", v: "fm" }
     `e` is the container the recording browser produced and `v` the voices that
     exist. docs/09 §9 is blunt about why this ordering matters — synthesised
     Indic speech mispronounces in ways that TEACH the error, and a child
     imitates what they hear. So when a human clip exists, nothing else is
     considered.

     Voice choice is the child's, held on the profile, and falls back to
     whichever voice was actually recorded — a line with only a female take
     plays the female take rather than going silent. */
  function humanClip(key) {
    var H = window.IND_VOICE_HUMAN, h = H && H[key];
    if (!h || !h.v) return null;
    var want = S.voice === 'm' ? 'm' : 'f';
    var v = h.v.indexOf(want) >= 0 ? want : h.v.charAt(0);
    return 'voice/' + key + '-' + v + '.' + (h.e || 'webm');
  }
  /* WHICH TELLING GETS HEARD. Built in one place because it was built in five,
     and four of them only knew about the English clip — so with Hindi on, the
     page turn spoke English over Hindi text. The Again button was right and
     every automatic narration was wrong, which is the most confusing possible
     combination.

     Falls back to the English clip when a scene has no Hindi recording yet, so
     a part-translated story still reads aloud rather than going silent. */
  /* HOW FAST THE VOICE READS. A grown-up sets it once and everything obeys —
     recorded clips through playbackRate, the speech-synthesis fallback through
     its own rate. It exists because a child meeting Hindi for the first time
     needs the sentence slower than a fluent one does, and until now the only
     speed was whatever the clip was baked at.

     preservesPitch keeps a slowed voice from turning into a drawl; browsers
     default it on, and it is set explicitly because Safari has not always. */
  function speakRate() { var r = +S.rate; return (r >= .5 && r <= 1.5) ? r : 1; }

  function storyClip(st, i) {
    var base = 'st/' + slug(st.id) + '-' + i;
    if (!S.hindi) return base;
    var sc = (st.scenes || [])[i];
    if (!sc || !sc.hi) return base;
    return (window.IND_VOICE && window.IND_VOICE.indexOf(base + '-hi') >= 0) ? base + '-hi' : base;
  }
  function sayScene(st, i) {
    if (!st) return;
    var sc = (st.scenes || [])[i], hi = (S.hindi && sc && sc.hi) ? sc.hi : null;
    speak(storyClip(st, i), hi || (sc && sc.text), hi ? 'hi-IN' : 'en-IN');
  }

  function speak(key, text, lang) {
    if (!soundOn) return;
    var src = key ? humanClip(key) : null;
    if (src || (key && (!window.IND_VOICE || window.IND_VOICE.indexOf(key) >= 0))) {
      try {
        if (audio) audio.pause();
        /* Stamped, like every other asset. Without this a browser that cached a
           clip keeps playing it forever — which is exactly what happened when the
           whole story library was re-narrated in an Indian voice and listeners
           went on hearing the old American one from their own disk. */
        audio = new Audio((src || ('voice/' + key + '.mp3')) + '?v=' + (window.IND_BUILD || '1'));
        /* A container this browser cannot decode must not mean silence: an old
           iPad cannot play Opus in WebM, and the honest fallback is the
           synthesised clip rather than nothing at all. */
        if (src) audio.onerror = function () {
          try {
            audio = new Audio('voice/' + key + '.mp3?v=' + (window.IND_BUILD || '1'));
            audio.play().catch(function () {});
          } catch (e) {}
        };
        audio.playbackRate = speakRate();
        audio.preservesPitch = true;
        audio.mozPreservesPitch = true; audio.webkitPreservesPitch = true;
        audio.play().catch(function () {});
        return;
      } catch (e) {}
    }
    if (!text || !window.speechSynthesis) return;
    try {
      stopAudio();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang || 'hi-IN';
      u.rate = 0.8 * speakRate();   /* slower: this is a word being taught, not narration */
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function stopAudio() {
    if (audio) { audio.pause(); audio = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  /* SPEAK A SENTENCE WITH ITS WORD LEFT OUT (Phase 3) — the Bee's sayMasked,
     in this app's idiom.

     Never a recorded clip, on purpose: the only clip a sentence will ever
     have contains the word, and before the answer the word is the answer.
     So the two halves are spoken around the hole with a beat of silence
     where the missing word goes — the child hears the shape of the sentence
     and exactly nothing of the answer. When the device has no voice at all
     this simply does nothing, which is the honest failure: silence, never a
     leak. */
  function sayMasked(before, after, lang) {
    if (!soundOn || !window.speechSynthesis) return;
    stopAudio();
    try {
      var mk = function (txt) {
        var u = new SpeechSynthesisUtterance(txt);
        u.lang = lang || 'hi-IN'; u.rate = 0.8 * speakRate();
        return u;
      };
      var tail = String(after || '').trim(), head = String(before || '').trim();
      var said = false;
      var rest = function () {
        if (said) return; said = true;
        if (!tail) return;
        setTimeout(function () { try { window.speechSynthesis.speak(mk(tail)); } catch (e) {} }, 480);
      };
      if (head) {
        var u1 = mk(head);
        u1.onend = rest; u1.onerror = rest;
        window.speechSynthesis.speak(u1);
        /* some devices never fire onend; the gap is a beat, not a deadline */
        setTimeout(rest, 1200 + head.length * 70);
      } else rest();
    } catch (e) {}
  }
  /* The whole sentence, once the answer is in — the reward. The clip
     (hi/s-<roman>) is preferred the moment a recording exists; until then
     speak() falls through to the device voice, so the button is never dead. */
  function saySentence(packId, word) {
    var e = window.IND_BHASHA && window.IND_BHASHA.sentence
      ? window.IND_BHASHA.sentence(packId || 'hi', word) : null;
    if (!e) return;
    speak(e.audio, e.s, (packId || 'hi') + '-IN');
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

  /* ------------------------------------------------------------ AVATAR CARD */
  /* The Bee's trading-card layer, in this house's voice (avatar-cards.js has
     the data and the design notes). Every card wears the same glow-in-the-dark
     finish; rarity is paused. What sits in the MIDDLE of the card depends on
     who is on it, and that is the rule this view exists to hold:

       character — the four stat bars, as ever. Numbers are fun on a jackal.
       real      — NO NUMBERS. A person is not scored out of 99. In place of
                   the bars: the Itihaas badge, what they actually did as a
                   short marked list, and — where one is documented — a
                   pull-quote with its attribution beneath it.
       epic      — NO NUMBERS either. The Katha badge and their character
                   line; grading Sita or Karna is the same mistake as grading
                   a deity, in a different coat (docs/05).
       sacred    — 'beyond measure', exactly as before. */
  /* ONE CARD FACE, used by the full page and by the deck popup alike. It was
     written twice for a while and the two drifted; a real person picked up a
     score in one of them. Now there is one of it. */
  function avCardHTML(id) {
    var name = (window.IND_AVATAR_NAMES || {})[id] || id;
    var C = window.IND_AV_CARD ? window.IND_AV_CARD(id) : null;
    var mine = S.buddy === id;

    /* the badge strip — the same three badges the stories carry, said out
       loud on the card face. Sacred keeps its own gold line instead. */
    var badge = (C && C.badge && C.badge.word)
      ? '<div class="avbadge"><span class="avbmark" aria-hidden="true">' + C.badge.mark + '</span>' +
        '<b>' + esc(C.badge.word) + '</b><span>' + esc(C.badge.line) + '</span></div>'
      : '';

    var middle = '';
    if (C && C.stats) {
      middle = '<div class="avstats">' + (window.IND_AV_STAT_KEYS || []).map(function (k) {
        var v = C.stats[k[0]] || 0;
        return '<div class="avstat"><span class="avlbl">' + k[1] + ' ' + esc(k[2]) + '</span>' +
          '<span class="avbar"><i style="width:' + v + '%"></i></span>' +
          '<b>' + v + '</b></div>';
      }).join('') + '</div>';
    } else if (C && C.sacred) {
      middle = '<div class="avbeyond">beyond measure</div>';
    } else if (C && C.achievements && C.achievements.length) {
      middle = badge + '<ul class="avdeeds">' + C.achievements.map(function (d) {
        return '<li>' + esc(d) + '</li>';
      }).join('') + '</ul>';
    } else {
      /* epic figures: the badge, and their other names from IND_EPIC_CAST —
         a detail where a real person has achievements, and never a ranking */
      middle = badge + ((C && C.alsoCalled && C.alsoCalled.length)
        ? '<div class="avalias"><span>also called</span>' + C.alsoCalled.map(function (a) {
            return '<b>' + esc(a) + '</b>';
          }).join('') + '</div>'
        : '');
    }

    /* the pull-quote. It only ever renders WITH its attribution — the data
       layer refuses to hand over a quote that has no named source, and this
       template refuses to draw one, so an unattributed quotation cannot reach
       a child's screen from either side (docs/05 §6.4). */
    var quote = (C && C.quote && C.quote.text && C.quote.where)
      ? '<figure class="avquote">' +
          '<blockquote>' + esc(C.quote.text) + '</blockquote>' +
          '<figcaption class="avcite">' + esc(name) + '<span>' + esc(C.quote.where) + '</span></figcaption>' +
        '</figure>'
      : '';

    return '<div class="avcard' + (C && C.sacred ? ' sacred' : '') +
        (C ? ' kind-' + C.kind : '') + '">' +
        '<div class="avhalo">' + art(id, 148) + '</div>' +
        '<h1>' + esc(name) + '</h1>' +
        (C && C.title ? '<div class="mono avtitle">' + esc(C.title) + '</div>' : '') +
        (C && C.lore ? '<p class="avlore">' + esc(C.lore) + '</p>' : '') +
        middle +
        quote +
        (C && C.fact ? '<div class="avfact"><b>Did you know?</b> ' + esc(C.fact) + '</div>' : '') +
        (mine
          ? '<span class="pill stat" style="margin-top:14px">Travelling with you ✓</span>'
          : '<button class="btn lg" style="margin-top:14px" data-act="pick" data-id="' + id + '">Travel with me</button>') +
      '</div>';
  }

  V.avcard = function (id) {
    return '<button class="backlink" data-act="go" data-v="me">' + icon('back', 18) + ' Back</button>' +
      '<div class="avcardwrap">' + avCardHTML(id) + '</div>';
  };

  /* -------------------------------------------------------------- LANDING */
  /* THE PAGE A PARENT MEETS FIRST, and it has one job: say what this is in a sentence
     they can repeat to their partner.

     It used to open "India is going grey. Help them remember it." That is the Vismriti
     story — the grey mist the app is built around — and it is a good line ONCE YOU ARE
     INSIDE. To somebody who has never opened the app it means nothing at all: grey how?
     going grey like hair? A landing page is not the place to introduce a metaphor that
     needs the product to explain it. So the headline now says the plain thing, and the
     mist is introduced later, in the app, where it can be shown rather than asserted.

     The numbers are COUNTED, never typed. This page claimed 11 stories and 34 places for
     months after there were 344 and 36 — the worst kind of stale copy, because it
     undersells the thing and nobody notices. */
  V.landing = function () {
    var nStories = (allStories() || []).length;
    var nPlaces = Object.keys((window.IND_MAP && window.IND_MAP.paths) || {}).length;
    var nPacks = Object.keys(window.IND_PACKS || {}).length;
    var nWorlds = ((window.IND_WORLDS && window.IND_WORLDS.list) || []).length;
    var pick = (allStories() || [])[(new Date().getDate() * 7) % Math.max(1, nStories)] || null;

    return '<div class="wrap">' +
      '<div class="hero">' +
        '<div>' +
          '<span class="eyebrow">' + mascot('gattu', 'happy', 26) + 'For Indian kids growing up anywhere</span>' +
          '<h1 style="margin-top:18px">Give your child<br>the India they<br>have not lived in.</h1>' +
          '<p class="lede">' + nStories + ' stories, a map of every state, and Hindi taught properly — ' +
          'read aloud from the first tap, so a four-year-old can use it on their own.</p>' +
          '<div class="row" style="margin:22px 0">' +
            '<button class="btn lg" data-act="begin">Start free →</button>' +
            '<button class="btn ghost lg" data-act="begin">I have an account</button>' +
          '</div>' +
          '<ul class="ticks">' +
            '<li>' + icon('lock', 20) + '<span><b>Works offline, and stays private</b> — nothing about your child leaves the device</span></li>' +
            '<li>' + icon('sound', 20) + '<span><b>Every story read aloud</b>, in English and in Hindi</span></li>' +
            '<li>' + icon('script', 20) + '<span><b>' + nPacks + ' Indian languages</b> in their own scripts — never romanised</span></li>' +
          '</ul>' +
        '</div>' +
        '<div class="herocard">' +
          mascot('mithu', 'talk', 116) +
          '<div class="mono" style="margin:10px 0 4px">Tonight’s story</div>' +
          '<h2 style="font-size:30px">' + esc(pick ? pick.title : 'The Lion Who Met Himself') + '</h2>' +
          '<p class="tiny">' + esc(pick && pick.hook ? pick.hook :
            'A lion who ate whatever he liked. And one small rabbit who had had enough.') + '</p>' +
          '<button class="btn block" data-act="begin">Read it →</button>' +
          '<div class="row" style="margin-top:18px;gap:10px">' +
            '<div class="card flat tight" style="flex:1;margin:0"><div class="mono">Stories</div>' +
              '<b style="font-size:19px">' + nStories + '</b></div>' +
            '<div class="card flat tight" style="flex:1;margin:0"><div class="mono">Places</div>' +
              '<b style="font-size:19px">' + nPlaces + '</b></div>' +
            '<div class="card flat tight" style="flex:1;margin:0"><div class="mono">Worlds</div>' +
              '<b style="font-size:19px">' + nWorlds + '</b></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* What it actually does, in three plain claims a parent can check. */
      '<div class="grid g3" style="margin-top:10px">' +
        [['tree', 'Stories they will sit still for',
          'Panchatantra, the Jatakas, the Ramayana and the Mahabharata, and the folk tales of every ' +
          'state — told properly, never dumbed down, with a real question at the end instead of a moral.'],
         ['map', 'A map of India they fill in themselves',
          'Finish a story and the place it came from lights up. Every state painted, every capital ' +
          'where it really is. Geography and progress in one picture.'],
         ['script', 'Hindi taught the way it is actually spoken',
          'Devanagari from day one, never romanised. The words, the letters, the grammar — and when ' +
          'to say आप instead of तुम, which is the part that matters to a grandparent.']]
        .map(function (c) {
          return '<div class="card"><div style="width:44px;height:44px;border-radius:13px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;margin-bottom:12px">' +
            icon(c[0], 24) + '</div><h3>' + c[1] + '</h3><p class="tiny">' + c[2] + '</p></div>';
        }).join('') +
      '</div>' +

      /* The one thing every diaspora parent is actually worried about, answered straight. */
      '<div class="card tint" style="margin-top:var(--space-lg);text-align:center">' +
        '<h3 style="margin:0 0 6px">No ads. No accounts for children. Nothing collected.</h3>' +
        '<p class="tiny" style="margin:0;max-width:60ch;margin-inline:auto">A first name and an age ' +
        'band, kept on your own device. No birthday, no photo, no location, no tracking of any kind — ' +
        'built to India’s DPDP Act, COPPA and GDPR-K from the first line of code rather than bolted ' +
        'on later.</p>' +
      '</div></div>';
  };

  /* ------------------------------------------------------------- ONBOARDING */
  /* Picking a chip re-renders the whole form, so the typed name is carried
     across renders by hand — otherwise choosing your buddy erased your name. */
  var obName = '';
  /* PLACEMENT (Phase 2, docs/09 §3): the three questions that route Bhasha —
     does anyone speak it at home, does the child answer back, in which
     language. The third reuses the tongue picker above and is skipped when a
     tongue is already chosen. Heritage = spoken at home; the ear is ahead of
     the eye and the child starts at the script, not at listening. */
  var obPlace = { home: null, back: null };
  function placeChips(q, opts) {
    return '<div class="row" style="margin-top:10px">' + opts.map(function (o) {
      return '<button class="pill' + (obPlace[q] === o[0] ? ' on' : '') + '" data-act="place" data-q="' +
        q + '" data-v="' + o[0] + '">' + o[1] + '</button>';
    }).join('') + '</div>';
  }
  V.onboard = function () {
    var packs = window.IND_AVATAR_PACKS || [];
    var tg = tongue();
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
        /* The placement is its own block, not three more headings in a long
           form: it is the one answer that changes where the child starts, so
           it is framed as a step and it says out loud what it decided. */
        '<div class="placebox">' +
          '<div class="mono">Where the language starts</div>' +
          '<h3 style="margin:6px 0 0">Does anyone speak ' + (tg ? esc(tg.en) : 'it') + ' at home?</h3>' +
          '<p class="tiny muted" style="margin:4px 0 0">A child who already understands the spoken ' +
          'words does not need to be taught what they mean — they need to read them.</p>' +
          placeChips('home', [['yes', 'Yes'], ['no', 'Not really']]) +
          (obPlace.home === 'yes'
            ? '<h3 style="margin:18px 0 0">Does your child answer back?</h3>' +
              placeChips('back', [['yes', 'Yes'], ['some', 'A little'], ['no', 'Not yet']]) +
              (!S.tongue
                ? '<h3 style="margin:18px 0 0">In which language?</h3>' + tongueChips()
                : '')
            : '') +
          /* the routing, said plainly the moment it is decided */
          (obPlace.home
            ? '<p class="placeout">' + (obPlace.home === 'yes'
                ? 'Then ' + (tg ? esc(tg.en) : 'the language') + ' starts at the <b>script</b> — the ear is ' +
                  'already ahead of the eye. Listening stays there to test out of.'
                : 'Then it starts with the <b>ear</b> — sounds and meanings first, letters right after.') +
              '</p>'
            : '') +
        '</div>' +
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

         DO one   — the day's deed. This is the payoff system: a bead for something you
                    DID, never for something you read.
         CARRY one — the word of the day. This one is masterable, so a count is honest here.

       HEAR one retired (user call): the Stories tab and its Tell-me-one already make that
       offer properly, and Today now lives inside the greeting card rather than a second
       card below it — one card says hello and hands you the day.

       The streak stays because a rhythm is not a completion target, but it is a footnote
       now rather than the headline. */
    var K = window.IND_NEETI;
    var todayValue = K ? K.values[Math.floor(Date.now() / 86400000) % K.values.length] : null;
    var deedDone = todayValue && (S.mala || []).some(function (b) {
      return b.v === todayValue.id && b.on === today();
    });

    /* one line: the greeting and the day's two invitations side by side,
       wrapping only when the screen genuinely cannot hold them */
    return (
      /* THE PINNED ASK (Bee's placement callout, India's version): until the
         family's language is chosen the app cannot lean anyone's way, so the
         ask rides the top of Home — once answered it disappears for good. */
      !S.tongue
        ? '<button class="card callout" data-act="go" data-v="tongue" style="width:100%;text-align:left;margin-bottom:var(--space-lg)">' +
          '<div class="row" style="align-items:center;flex-wrap:nowrap;gap:12px">' + icon('script', 24) +
          '<span style="flex:1"><b>Your family’s language</b>' +
          '<span class="tiny muted" style="display:block">Tell us once — the stories, the words and the map lean your way.</span></span>' +
          '<span class="pill stat" style="white-space:nowrap">Choose →</span></div></button>'
        : '') +
      '<div class="card notch"><div class="herorow">' +
        '<div class="greetblk"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">' +
        /* the companion, at twice the size and tappable: it opens the deck */
        '<button class="buddybtn" data-act="deck" aria-label="Your companions">' +
        art(S.buddy, 216) + '</button>' +
        '<div style="flex:1"><div class="tiny muted">' + greet + ',' +
        (S.streak.count ? ' <span style="white-space:nowrap">· 🪔 ' + S.streak.count + '-day streak</span>' : '') + '</div>' +
        '<h2 style="margin:0 0 10px">' + esc(S.name || 'Yatri') + '</h2>' +
        '<div class="bubble">' + esc(hello) + '</div></div></div></div>' +

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

      /* TODAY'S RING (Bee's daily goal, in India's own currency). The ring
         counts DEEDS — a story finished, a lesson answered, a game played,
         the day's deed — the exact things markToday() already counts; never
         pages read, never fractions of the library (docs/10 §3.5). The
         target is the family's to choose and lives in S.goal. */
      (function () {
        var n = (S.todayOn === today()) ? (S.todayCount || 0) : 0;
        var goal = S.goal || 3, ringDone = n >= goal;
        var C = 2 * Math.PI * 26;
        return '<div class="card goalcard notch">' +
          '<svg class="goring" viewBox="0 0 64 64" aria-hidden="true">' +
            '<circle cx="32" cy="32" r="26" class="bg"/>' +
            '<circle cx="32" cy="32" r="26" class="fg" stroke-dasharray="' + C.toFixed(1) +
              '" stroke-dashoffset="' + (C * (1 - Math.min(1, n / goal))).toFixed(1) + '"/>' +
            '<text x="32" y="31">' + Math.min(n, 99) + '/' + goal + '</text>' +
            '<text x="32" y="43" class="sub">today</text></svg>' +
          '<div style="flex:1;min-width:180px">' +
          '<h3 style="margin:0 0 2px">' + (ringDone ? 'Ring closed — shabash! 🪔' : 'Today’s ring') + '</h3>' +
          '<p class="tiny muted" style="margin:0">' + (ringDone
            ? 'Everything from here is extra shine.'
            : 'A story finished, a lesson, a game or the day’s deed — each fills it one notch.') + '</p>' +
          '<div class="row" style="margin-top:9px;align-items:center">' +
          (ringDone ? '' : '<button class="btn" data-act="go" data-v="stories">' + icon('play', 15) + ' Start — hear a story</button>') +
          '<span class="row goalpick" role="group" aria-label="How many a day">' +
          [2, 3, 5].map(function (g2) {
            return '<button class="pill' + (goal === g2 ? ' on' : '') + '" data-act="goalset" data-g="' + g2 +
              '" aria-pressed="' + (goal === g2 ? 'true' : 'false') + '">' + g2 + '</button>';
          }).join('') + '<span class="tiny muted">a day</span></span>' +
          '</div></div></div>';
      })() +

      /* KEEP GOING (Bee's resume cards). Whatever was open last — a story
         mid-telling, a language pack, a game with cities waiting — comes back
         as one tap. A finished story drops off; abundance, not homework. */
      (function () {
        var R = S.resume || {}, cards = [];
        if (R.story) {
          var so = allStories().filter(function (x) { return x.id === R.story.id; })[0];
          if (so && !S.read[so.id]) cards.push({ at: R.story.at || 0,
            h: '<button class="tile keepon" data-act="story" data-id="' + esc(so.id) + '">' +
               '<span class="mono">Keep going</span><b>' + esc(so.title) + '</b>' +
               '<p class="tiny">The story is waiting where you left it.</p></button>' });
        }
        if (R.pack && window.IND_PACKS && window.IND_PACKS[R.pack.id]) {
          var pk = window.IND_PACKS[R.pack.id];
          cards.push({ at: R.pack.at || 0,
            h: '<button class="tile keepon" data-act="pack" data-id="' + esc(R.pack.id) + '">' +
               '<span class="mono">Keep going</span><b>' + esc(pk.name || 'Bhasha') + '</b>' +
               '<p class="tiny">Your letters and words remember you.</p></button>' });
        }
        if (R.game) {
          var g3 = (window.IND_GAMES || []).filter(function (x) { return x.id === R.game.id; })[0];
          if (g3) {
            var note = 'Jump back in.';
            if (g3.id === 'sabhyata') {
              try {
                var sv = JSON.parse(localStorage.getItem('india.sabhyata.v2') || 'null');
                if (sv && window.IND_SABHYATA && window.IND_SABHYATA.eras[sv.era])
                  note = 'Era ' + (sv.era + 1) + ' · ' + window.IND_SABHYATA.eras[sv.era].name +
                    ' — your cities are waiting.';
              } catch (e2) {}
            }
            cards.push({ at: R.game.at || 0,
              h: '<button class="tile keepon" data-act="game" data-id="' + esc(g3.id) + '">' +
                 '<span class="mono">Keep going</span><b>' + esc(g3.name) + '</b>' +
                 '<p class="tiny">' + esc(note) + '</p></button>' });
          }
        }
        if (!cards.length) return '';
        cards.sort(function (a2, b2) { return (b2.at || 0) - (a2.at || 0); });
        return '<div class="grid g3" style="margin-top:var(--space-lg)">' +
          cards.slice(0, 3).map(function (c2) { return c2.h; }).join('') + '</div>';
      })() +

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
            /* distance, not just destination (the Bee lesson): "how close am I"
               is what pulls a child back, so the next title says how far */
            (lv < RANKS.length - 1
              ? 'Next: <b>' + esc(RANKS[lv + 1]) + '</b> · 🐚 ' + (60 - (S.xp % 60)) + ' more'
              : 'You are at the top of the ladder') +
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

    /* CAPITALS. Every state's capital city sits on the map as a dot, and the dot is where
       the city actually is: the coordinates are projected from the city's latitude and
       longitude through the map's own Mercator frame (tools/map-capitals.py), then checked
       to fall inside the state's own polygon. Nothing here is placed by eye.

       The dot is also how "remembered" is shown now. A state you have not met used to be
       painted over with a dark, near-opaque mist, which hid the painting that was the whole
       reason to look at the map. The veil is now light and thin, and the thing that changes
       when you meet a state is a green dot on its capital — a mark being ADDED, not a
       state being blacked out.

       One dot per city, not one per state: Chandigarh is the capital of Punjab, Haryana and
       itself, and three dots stacked on one city is three times the ink for one fact. */
    var byCity = {};
    codes.forEach(function (c) {
      var cp = (M.capitals || {})[c];
      if (!cp) return;
      var key = cp[0] + ',' + cp[1];
      var q = byCity[key] || (byCity[key] = { x: cp[0], y: cp[1], name: cp[2], lit: false, on: false });
      if (S.lit[c]) q.lit = true;
      if (mapFocus === c) q.on = true;
    });
    /* The city's NAME is written only for the state being looked at. India at the size that
       fits on a phone is about 300 pixels across; thirty-five city names on top of the state
       names is a grey smear, and a smear teaches nothing. The dot is always there, the name
       comes when you ask for that state — and the callout spells it out again. */
    var caps = Object.keys(byCity).map(function (k) {
      var q = byCity[k];
      return '<g class="cap' + (q.lit ? ' lit' : '') + (q.on ? ' on' : '') + '">' +
        '<circle cx="' + q.x + '" cy="' + q.y + '" r="' + (q.on ? 7 : 5) + '"/>' +
        (q.on ? '<text class="capname" x="' + q.x + '" y="' + (q.y + 17) + '">' + esc(q.name) + '</text>' : '') +
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
         the map. The horizontal clamp keeps it on screen for Gujarat and Arunachal alike.
         The vertical placement is finished in placeCallout() after layout, because whether
         the bubble fits above its own dot depends on how tall the bubble turned out and how
         tall the map is on this screen — neither of which a percentage in a template knows.
         Rajasthan's bubble was escaping out of the top of the card at 37%. */
      var below = ly < 26;
      callout =
        '<div class="callout' + (below ? ' below' : '') + '" data-anchor="' + ly.toFixed(2) +
            '" data-ax="' + lx.toFixed(2) +
            '" style="left:' + Math.max(20, Math.min(80, lx)) + '%;top:' + ly + '%">' +
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

    /* A COMPACT HEADER, because every pixel here is a pixel the map does not get. The
       heading used to be a two-line block with its own margin -- about 70px above the
       map, on a screen where the map is fighting for its height. It says the same things
       on one line now, and the map grew by that much. */
    return '<div class="card mapcard">' +
      '<div class="spread" style="margin-bottom:6px;align-items:baseline">' +
        '<h2 style="margin:0;font-size:20px">India</h2>' +
        '<span class="tiny muted" style="flex:1;margin-left:10px">' + lit + ' of ' + total +
          ' places remembered · tap a state</span>' +
        '<span class="pill stat">🪔 ' + S.streak.count + '</span></div>' +
      '<div class="mapwrap">' +
        '<svg class="mapsvg" viewBox="' + M.viewBox + '" role="img" aria-label="Map of India">' +
          '<defs>' + defs + '</defs>' +
          '<path class="outline" d="' + M.outline + '"/>' + paths + pins + caps + labels + '</svg>' +
        callout +
      '</div>' +
      strip +
      '<div class="legend" style="margin-top:14px">' +
        '<span><i class="dot lg-cap"></i>a capital city</span>' +
        '<span><i class="dot lg-caplit"></i>remembered</span>' +
        '<span><i class="dot" style="background:var(--accent3)"></i>a place to visit</span></div></div>' +
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
  /* THE THEME DOORS. Twenty-nine collections stacked as rails made the library a
     wall — 323 stories of scroll. The shelf is now eight painted doors, each
     opening a themed room (V.kahani) that holds its collections as rails. The
     grouping is presentation only: a collection the map below doesn't know still
     shows up behind the last door, so nothing ever silently vanishes. */
  var STORY_THEMES = [
    { id: 'jungle',  name: 'Animal Wisdom',     kicker: 'Panchatantra and the Jataka tales',
      cols: ['panchatantra', 'panch-more', 'jataka', 'jataka-more'] },
    { id: 'chatur',  name: 'The Clever Ones',   kicker: 'Birbal, and every quick mind since',
      cols: ['birbal', 'chatur'] },
    { id: 'sacred',  name: 'Sacred Stories',    kicker: 'The gods, the gurus, the tirthankaras — side by side',
      cols: ['mythology', 'purana', 'epics', 'jain', 'sikh', 'dashavatara', 'devasura'] },
    { id: 'south',   name: 'The South',         kicker: 'Backwaters, temple towns, the long coast',
      cols: ['desh-south', 'coast-forest'] },
    { id: 'north',   name: 'The North & the Hills', kicker: 'Dilli to the high passes',
      cols: ['dilli', 'naya-shehar', 'pahad', 'wadi', 'panj-ab'] },
    { id: 'east',    name: 'The East & the Dawn', kicker: 'Bengal, the islands, the seven sisters',
      cols: ['desh-east', 'desh-ne-a', 'desh-ne-b'] },
    { id: 'west',    name: 'The West & the Heart', kicker: 'Desert, coast and the middle lands',
      cols: ['west-lands', 'heart-lands', 'desh', 'desh-more'] },
    { id: 'modern',  name: 'Modern India',      kicker: 'Players, builders, scientists, pathbreakers',
      cols: ['khel', 'naya', 'vigyan', 'rah'] }
  ];

  /* Three named doors that get their own tile at the top of Stories, above the
     eight shelves. They are NOT extra shelves — every story behind them is also
     behind a shelf below; these are just the three a child asks for by name. */
  var FEATURE_DOORS = [
    { id: 'panch',  name: 'Panchatantra', kicker: 'Animal fables, each with a sting in the tail',
      cols: ['panchatantra', 'panch-more'] },
    { id: 'birbal', name: 'Akbar & Birbal', kicker: 'The emperor asks. The clever man answers.',
      cols: ['birbal', 'chatur'] },
    { id: 'folk',   name: 'Folk tales', kicker: 'Every corner of the country, in its own voice',
      cols: ['desh-south', 'coast-forest', 'dilli', 'naya-shehar', 'pahad', 'wadi', 'panj-ab',
             'desh-east', 'desh-ne-a', 'desh-ne-b', 'west-lands', 'heart-lands', 'desh', 'desh-more'] }
  ];
  /* The Puranic shelf. It stands as a BIG door beside the two epics rather than
     among the small ones, because that is what it is: the ten descents of
     Vishnu, and the deva-asura stories that are not Ramayana or Mahabharata.
     It is a second way in, not a second copy — the Sacred Stories shelf below
     still holds both collections. */
  var MYTH_DOOR = { id: 'myth', name: 'Mythological Tales',
    kicker: 'The ten descents, and two halves of one very old family',
    cols: ['dashavatara', 'devasura'] };

  function doorById(id) {
    var all = STORY_THEMES.concat(FEATURE_DOORS).concat([MYTH_DOOR]);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function themeStories(t, all) {
    return all.filter(function (x) { return t.cols.indexOf(x.collection) >= 0; });
  }

  /* The mosaic behind the randomiser: a wall of the paintings already in the
     library. Picked ONCE per load, not per render — a grid that reshuffles on
     every keystroke is a strobe, not a background. */
  var MOSAIC = null;
  function mosaicTiles(n) {
    if (MOSAIC) return MOSAIC;
    var pics = [];
    allStories().forEach(function (x) { var p = storyArt(x.id); if (p) pics.push(p); });
    if (!pics.length) return (MOSAIC = []);
    /* a fixed stride through the list, so the wall is spread across the whole
       library rather than being twelve stories from one collection */
    var step = Math.max(1, Math.floor(pics.length / n));
    var start = Math.floor(Math.random() * pics.length);
    var out = [];
    for (var i = 0; i < n; i++) out.push(pics[(start + i * step) % pics.length]);
    return (MOSAIC = out);
  }

  function storyShelf(title, note, list, favs) {
    if (!list.length) return '';
    return '<h3 style="margin:26px 0 4px">' + esc(title) + '</h3>' +
      (note ? '<p class="tiny muted" style="margin:0 0 12px">' + esc(note) + '</p>' : '') +
      '<div class="rail">' + list.map(function (x) { return storyCard(x, favs); }).join('') + '</div>';
  }
  function storyCard(x, favs) {
    var img = storyArt(x.id);
    return '<button class="scard" data-act="story" data-id="' + x.id + '">' +
      (img ? '<span class="pic" style="background-image:url(' + img + ')"></span>'
           : '<span class="pic noart">' + art(x.hero, 84) + '</span>') +
      (favs[x.id] ? '<span class="fav">♥</span>' : '') +
      '<span class="nm">' + esc(x.title) + '</span>' +
      '<span class="hk">' + esc(x.hook) + '</span></button>';
  }

  V.stories = function () {
    var all = allStories();
    var favs = S.favs || {};
    var loved = all.filter(function (x) { return favs[x.id]; });

    function shelf(title, note, list) { return storyShelf(title, note, list, favs); }
    function card(x) { return storyCard(x, favs); }

    /* THE TOP OF THE LIBRARY.
       A wide bar, then three big doors, then the small ones. The bar carries the
       shelf's own name — in the family's words, so a Tamil child's library is
       called Paati-Thaatha Tales — and doubles as the randomiser, which is why
       there is no separate heading above it. */
    function bigdoor(act, id, pic, kicker, title, note) {
      return '<button class="bigdoor" data-act="' + act + '" data-id="' + id + '">' +
        '<span class="bdart"' + (pic ? ' style="background-image:url(' + pic + ')"' : '') + '></span>' +
        '<span class="bdveil"></span>' +
        '<span class="bdbody"><span class="mono">' + esc(kicker) + '</span>' +
        '<b>' + esc(title) + '</b>' +
        '<span class="tiny">' + esc(note) + '</span></span></button>';
    }
    var ram = epicById('ramayana'), mb = epicById('mahabharata');
    var myth = themeStories(MYTH_DOOR, all);

    /* THE BAR — the randomiser, on a wall of the library's own paintings.
       Note the string sits on the SAME line as `return`: a bare `return` with
       the expression on the next line is a semicolon by ASI, and this function
       silently returned undefined, which rendered the page as the word
       "undefined". Do not reformat this. */
    return '<button class="pickbar" data-act="tellone">' +
        '<span class="mosaic" aria-hidden="true">' +
          mosaicTiles(12).map(function (p) {
            return '<i style="background-image:url(' + p + ')"></i>';
          }).join('') + '</span>' +
        '<span class="bdveil"></span>' +
        '<span class="pbbody"><span class="pbtext">' +
          '<b>' + esc(tellerTitle()) + '</b>' +
          '<span class="tiny">' + all.length + ' of them. Nothing to finish, nothing to get ' +
          'right — you can have the same one again tomorrow.</span></span>' +
        '<span class="btn">' + icon('play', 18) + ' Tell me one</span></span></button>' +

      '<div class="topdeck">' +
      /* the two long ones and the Puranic shelf, each behind a real painting */
      (ram ? bigdoor('epic', 'ramayana', 'art/epic/ramayana-16-0.jpg',
        ram.episodes.length + ' nights', 'The Ramayana',
        'One card at a time. Stop anywhere — it waits.') : '') +
      (mb ? bigdoor('epic', 'mahabharata', 'art/epic/mahabharata-26-3.jpg',
        mb.episodes.length + ' nights', 'The Mahabharata',
        'The one about the family. Nobody finishes it in a night.') : '') +
      (myth.length ? bigdoor('kahani', 'myth', (function () {
        var pic = null;
        for (var i = 0; i < myth.length && !pic; i++) pic = storyArt(myth[i].id);
        return pic;
      })(), myth.length + ' stories', MYTH_DOOR.name, MYTH_DOOR.kicker + '.') : '') +
      '</div>' +

      /* the three a child asks for by name */
      '<div class="minidoors">' + FEATURE_DOORS.map(function (d) {
        var list = themeStories(d, all);
        if (!list.length) return '';
        var pic = null;
        for (var i = 0; i < list.length && !pic; i++) pic = storyArt(list[i].id);
        return '<button class="mdoor" data-act="kahani" data-id="' + d.id + '">' +
          '<span class="bdart"' + (pic ? ' style="background-image:url(' + pic + ')"' : '') + '></span>' +
          '<span class="bdveil"></span>' +
          '<span class="bdbody"><b>' + esc(d.name) + '</b>' +
          '<span class="mono">' + list.length + ' stories</span></span></button>';
      }).join('') +
      /* the recording shelf's quiet door — see the note where its big tile was */
      (window.IND_NANI
        ? '<button class="mdoor own" data-act="go" data-v="nani">' +
          '<span class="bdveil"></span>' +
          '<span class="bdbody"><b>' + esc(naniTitle()) + '</b>' +
          '<span class="mono">in your own voice</span></span></button>'
        : '') + '</div>' +

      /* The Family Shelf's big tile is gone — the whole pillar is named after
         grandparents now, so a box underneath it saying "the family shelf" was
         saying the same thing twice. The recording feature is NOT gone with it:
         it keeps a quiet door on the end of the small-doors row above, because
         orphaning a working feature to tidy a layout is not a tidy-up. */

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

      /* the eight painted doors */
      '<h3 style="margin:26px 0 4px">The shelves</h3>' +
      '<p class="tiny muted" style="margin:0 0 12px">Eight rooms, every story in one of them. ' +
      'Step in anywhere.</p>' +
      '<div class="grid g2 doors">' + STORY_THEMES.map(function (t) {
        var list = themeStories(t, all);
        if (!list.length) return '';
        var pic = null;
        for (var i = 0; i < list.length && !pic; i++) pic = storyArt(list[i].id);
        return '<button class="tdoor" data-act="kahani" data-id="' + t.id + '">' +
          '<span class="tpic"' + (pic ? ' style="background-image:url(' + pic + ')"' : '') + '></span>' +
          '<span class="tbody"><b>' + esc(t.name) + '</b>' +
          '<span class="tiny muted">' + esc(t.kicker) + '</span>' +
          '<span class="mono">' + list.length + ' stories</span></span></button>';
      }).join('') + '</div>' +

      /* a collection no door claims still gets its rail — nothing ever vanishes */
      (function () {
        var claimed = {};
        STORY_THEMES.forEach(function (t) { t.cols.forEach(function (c) { claimed[c] = 1; }); });
        return allCollections().filter(function (c) { return !claimed[c.id]; }).map(function (c) {
          return shelf(c.name, c.note, all.filter(function (x) { return x.collection === c.id; }));
        }).join('');
      })();
  };

  /* one themed room: the door's collections as rails */
  V.kahani = function (id) {
    var t = doorById(id);
    if (!t) return '<div class="card">This shelf is not here.</div>';
    var all = allStories(), favs = S.favs || {};
    var cols = allCollections().filter(function (c) { return t.cols.indexOf(c.id) >= 0; });
    var n = themeStories(t, all).length;
    return '<button class="backlink" data-act="go" data-v="stories">' + icon('back', 18) + ' Stories</button>' +
      '<div class="card"><h1 style="margin:0">' + esc(t.name) + '</h1>' +
      '<p style="margin:6px 0 0">' + esc(t.kicker) + ' — ' + n + ' stories, nothing to finish.</p></div>' +
      cols.map(function (c) {
        return storyShelf(c.name, c.note, all.filter(function (x) { return x.collection === c.id; }), favs);
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
    /* HINDI ALONGSIDE. On when the reader has the toggle on AND this scene has
       been translated — a story with no Hindi simply reads as it always did,
       which is why the toggle can be global while the content arrives one
       story at a time. */
    var hi = (S.hindi && sc.hi) ? sc.hi : null;
    var sayKey = storyClip(st, play.i);

    return '<div class="reader' + (hi ? ' twoup' : '') + '">' +
      '<div class="rhead">' +
      '<button class="backlink" style="padding:0" data-act="go" data-v="stories">' + icon('back', 18) + ' Stories</button>' +
      '<div class="dots">' + st.scenes.map(function (_, i) { return '<i class="' + (i <= play.i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<span class="badge ' + st.badge + '">' + st.badge + '</span></div>' +

      '<div class="stage"' + (img ? ' style="background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.35)),url(' + img + ')"' : '') + '>' + (teller ? '<div class="speaking">' + mascot('mithu', 'talk', 128) + '</div>' :
        cast.map(function (c, i) { return '<div class="' + (i === 0 ? 'speaking' : '') + '">' + art(c, i === 0 ? 128 : 100) + '</div>'; }).join('')) + '</div>' +

      /* Bubble when somebody is talking, plain panel when the storyteller is. */
      '<div class="speech' + (hasDialogue(sc.text) ? ' bubble' : '') + '">' +
      (teller ? '<span class="who">Mithu</span>'
              : (cast[0] && avatarName(cast[0]) ? '<span class="who">' + esc(avatarName(cast[0])) + '</span>' : '')) +
      (hi ? '<p class="sdeva" lang="hi">' + esc(hi) + '</p>' : '') +
      '<p class="sen">' + esc(sc.text).replace(/\*(.+?)\*/g, '<i>$1</i>') + '</p></div>' +

      (sc.ask ? '<div class="rfoot">' + V.ask(sc.ask) + '</div>' :
        '<div class="rfoot"><div class="row">' +
        '<button class="btn ghost" data-act="say" data-k="' + sayKey + '" data-t="' + esc(hi || '') +
        '" data-l="' + (hi ? 'hi-IN' : 'en-IN') + '">' + icon('sound', 18) + ' Again</button>' +
        '<button class="btn" style="flex:1" data-act="next">Then what happened? →</button></div></div>') +
      '</div>';
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
                /* The SAME card the rest of the app builds. This was hand-rolling a bare
                   <img> and a bare <b> inside a .scard, and .scard is styled for a .pic
                   span and a .nm title -- so the painting rendered at its natural size,
                   blowing the card out, and the title ran on with no padding and no clamp.
                   That is the "too long and not rendering properly". Use storyCard(). */
                hits.map(function (st) { return storyCard(st, {}); }).join('') + '</div></div>'
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
  /* The Hindi clip when the switch is on AND this card has both a Hindi line and a
     recording of it; the English one otherwise. Falling back to the English clip rather
     than to silence is deliberate — a card mid-episode with no sound reads as broken. */
  function cardVoiceFor(epicId, n, i, card) {
    var base = cardVoice(epicId, n, i);
    if (!S.hindi || !card || !card.hi) return base;
    return hasVoice(base + '-hi') ? base + '-hi' : base;
  }
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
    /* ONE place decides which telling is heard and shown, because the story reader taught
       that lesson the hard way: its clip key was built in five places and only one of them
       knew the Hindi switch existed, so the narration reverted to English on a page turn. */
    var cardHi = S.hindi && c.hi ? c.hi : '';
    var vk = cardVoiceFor(e.id, ep.n, deck.i, c);
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
      /* THE SAME TWO LANES AS A STORY CARD. The epics were the one place in the app that
         did not follow the story template: no Hindi lane, so the Toggle Hindi switch in
         the top bar did nothing at all on the two longest things a child will read here.
         `hi` is on every card now (tools/epic-hindi.js), so the epics behave exactly like
         every other telling: Devanagari above, English below, and the voice follows. */
      '<div class="speech' + (hasDialogue(c.text) ? ' bubble' : '') + '" style="margin-top:14px">' +
        (speakerLabel ? '<span class="who">' + esc(speakerLabel) + '</span>' : '') +
        (cardHi ? '<p class="sdeva" lang="hi">' + esc(cardHi) + '</p>' : '') +
        '<p class="sen">' + esc(c.text).replace(/\*(.+?)\*/g, '<i>$1</i>') + '</p>' +
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
  /* The picker reads worlds-art.js when it is loaded — that file owns the fifteen
     worlds, their palettes, their animated tiles and their credit lines. The old
     hardcoded WORLDS array stays only as the fallback for a build without it. */
  function worldList() {
    return (window.IND_WORLDS && window.IND_WORLDS.list) || WORLDS;
  }
  /* A saved world id that no longer exists paints NOTHING — data-world goes on
     the root, no rule matches it, and the child sits in a blank app wondering
     where the art went. The fifteen worlds replaced an older set of folk-art
     traditions, so profiles saved before that carry a dead id. Heal it. */
  function healWorld() {
    var list = worldList(), i;
    for (i = 0; i < list.length; i++) if (list[i].id === S.world) return;
    if (list.length) { S.world = list[0].id; save(); }
  }

  V.worlds = function () {
    var list = worldList(), live = 0;
    list.forEach(function (w) { if (w.full) live++; });
    return '<div class="card"><h1>Worlds</h1>' +
      '<p>Each world re-paints the whole app — a street, a festival, a craft — and tells you where it comes from. ' +
      'They are not decoration; they are part of what you are learning.</p>' +
      /* Every world is animated now, so the old "N of 15 are alive, the rest are painted
         and waiting" line is simply false -- and it was the same sentence under every
         world, which is what made the picker read as one place fifteen times. What is
         true and specific is what each world DOES after dark. */
      '<p class="tiny muted" style="margin:8px 0 0">All ' + list.length + ' are alive — and each ' +
        'one changes at night: lamps come on, windows light, a city switches itself on. Try the ' +
        'moon button.</p></div>' +
      '<div class="grid g2">' + list.map(function (w) {
        var E = window.IND_ECONOMY;
        var open = !E || E.worldOpen(S, w.id);
        var price = E ? E.worldPrice(w.id) : 0;
        return '<button class="tile' + (S.world === w.id ? ' on' : '') + (open ? '' : ' locked') +
          '" data-act="' + (open ? 'world' : 'buyworld') + '" data-w="' + w.id + '">' +
          (w.tile
            ? '<div class="wpreview live" data-world="' + w.id + '">' + w.tile + '</div>'
            : '<div class="wpreview" data-world="' + w.id + '">' +
              '<b style="background:var(--accent)"></b>' +
              '<b style="background:var(--accent2);width:24px;height:24px"></b>' +
              '<b style="background:var(--accent3);width:19px;height:19px"></b>' +
              '<span class="aa">आ Aa</span></div>') +
          '<div class="spread"><h3 style="margin:0">' + esc(w.name) + '</h3>' +
          (S.world === w.id ? '<span class="badge aaj">on</span>'
            : (open ? '<span class="badge">alive</span>'
                    : '<span class="badge price">🪙 ' + price + '</span>')) + '</div>' +
          '<div class="mono">' + esc(w.region) + '</div>' +
          '<p class="tiny" style="margin:8px 0 0">' + esc(w.note) + '</p>' +
          (open ? '' : '<p class="tiny" style="margin:6px 0 0;color:var(--accent);font-weight:700">' +
            (E && E.canAfford(S, price) ? 'Tap to open it with your sikke'
                                        : 'Keep going — ' + (price - (S.sikke || 0)) + ' more sikke') + '</p>') +
          '</button>';
      }).join('') + '</div>' +
      '<div class="card flat tiny"><b>Credit.</b> Every world names the tradition and the place it comes from, ' +
      'and says when the art is ours: ' + esc((worldList()[0] || {}).credit || '') + ' In the real product a ' +
      'commissioned world names its artist — folk art is somebody’s livelihood, not a free texture pack.</div>';
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
        }).join('') + '</div>' +
          /* PHASE F's door, for the grown-up rather than the child. Deliberately at the
             foot of the list and stated plainly: it is a report, not a control panel. */
          '<button class="tile" data-act="progress" data-id="' + (lead || 'hi') + '" ' +
          'style="margin-top:var(--space-lg)">' +
          '<b>How it is going</b><span class="tiny muted">For a grown-up: where they are, ' +
          'the grammar they have met, and the handful of things missed more than once. ' +
          'Read-only, no score, nothing sent anywhere.</span></button>';
      })() +
      /* The drills used to be duplicated here as a "Khel" block. Khel is its own
         tab in the bar now, and the same four stalls listed in two places made the
         bar look like it was lying about where the games live. One home. */
      '<div class="card flat tiny"><b>Note.</b> The Hindi and Punjabi audio here is synthesised, as a placeholder. ' +
      'Per <code>docs/09</code> it must be replaced with human voice before launch — children imitate these sounds, ' +
      'and TTS teaches errors a native-speaker parent hears instantly.</div>';
  };

  /* ------------------------------------------------------------- THE QUIZ
     Phase 0 of the Bhasha rebuild. The old renderer read only q.options and
     the old grader only a numeric answerIndex, which left five question
     shapes unrenderable or unwinnable (s4/s6/s7 needed 12 right answers with
     0 possible). The quiz now has three interaction families:

       - choice   options + answerIndex, tapped or keyed (native buttons)
       - build    tiles placed IN ORDER into slots (wordBuild, sentenceBuild,
                  conjunctSplit), auto-graded when the last slot fills
       - trace    the Likhna canvas (stage 7), pass counts as correct

     `build` is the ordered-build state, `fb` the feedback strip (generators
     write why/point explanations; discarding them was marking, not teaching),
     `lock` swallows input during the feedback beat, `reveal` shows the
     correct arrangement after a wrong build. */
  function quizReset(packId) {
    return { packId: packId || null, stage: null, q: null, done: 0, right: 0,
             build: null, fb: null, lock: false, reveal: false, typed: '',
             /* Phase 1-2: the planned session — plan is IND_BHASHA.session()'s
                arc, pi the pointer into its specs, over marks the arc spent;
                mode 'lesson' or 'testout'; offer is a locked stage showing its
                test-out card. */
             plan: null, pi: 0, over: false, mode: 'lesson', offer: null };
  }
  var quiz = quizReset(null);
  function isBuild(type) { return type === 'wordBuild' || type === 'sentenceBuild' || type === 'conjunctSplit'; }
  function tileChar(t) { return typeof t === 'string' ? t : (t && t.char) || ''; }
  function packLang() { return (quiz.packId || 'hi') + '-IN'; }

  /* ---------------------------------------------------- THE LANG RECORD
     One per pack in S.lang[id]. Phase 1-2 grew it from bare counters into
     the child's whole standing in that language:
       asked/correct    lifetime counters (pre-date the rebuild)
       stages{sid}      per-stage {asked, correct, testout}
       srs{key}         one Leitner card per item, moved by IND_SRS.review
       window[]         the last 12 graded answers, {ok, nw} — steering + band
       band 1-5         the ability band (seeded by placement)
       path             'heritage' | 'beginner' (docs/09 §3) */
  function ensureLang(id) {
    var rec = S.lang[id] || (S.lang[id] = { asked: 0, correct: 0 });
    if (!rec.srs) rec.srs = {};
    if (!rec.stages) rec.stages = {};
    if (!rec.window) rec.window = [];
    if (!rec.path) {
      /* PLACEMENT ROUTING. Placement answers route new profiles; existing
         profiles without placement default sensibly — heritage if the family
         tongue matches this pack, beginner otherwise. Nobody is re-onboarded. */
      var t = tongue();
      var match = !!(t && (t.pack === id || t.id === id));
      rec.path = (S.placement ? (S.placement.home === 'yes' && (match || !S.tongue)) : match)
        ? 'heritage' : 'beginner';
    }
    if (!rec.band) rec.band = rec.path === 'heritage' ? 2 : 1;   /* heritage ear is ahead */
    return rec;
  }

  /* Step the planned session: an introduce beat is a teach card with one
     Got-it; everything else goes through the real nextQuestion, pinned to
     the item the plan names. */
  function planStep() {
    var specs = quiz.plan && quiz.plan.specs;
    if (!specs || quiz.pi >= specs.length) {
      quiz.q = null; quiz.over = true;
      /* test-out verdict: five of six opens the stage and marks it */
      if (quiz.mode === 'testout' && quiz.right >= TESTOUT_PASS && quiz.stage) {
        var rec = ensureLang(quiz.packId);
        var sst = rec.stages[quiz.stage] || (rec.stages[quiz.stage] = { asked: 0, correct: 0 });
        if (!sst.testout) { sst.testout = true; save(); earn(8, 'tested out'); }
      }
      if (quiz.mode === 'lesson' && quiz.done > 0) markToday();
      return;
    }
    var sp = specs[quiz.pi];
    quiz.build = { placed: [], kfocus: 0, kb: false };
    quiz.fb = null; quiz.lock = false; quiz.reveal = false; quiz.typed = '';
    if (sp.kind === 'introduce') {
      var sh = sp.show || {};
      quiz.q = { type: 'introduce', spec: sp, char: sh.char, sub: sh.sub, en: sh.en,
                 audio: sh.audio, say: sh.say, small: sh.small };
      speak(quiz.q.audio, quiz.q.say, packLang());
      return;
    }
    /* srs rides along so readPassage can gate the story bank by the ground
       this child actually holds — the generator never writes it */
    quiz.q = window.IND_BHASHA.nextQuestion(quiz.packId, quiz.stage, Date.now() + quiz.pi,
      { item: sp.item, type: sp.type, index: stageStat(quiz.packId, quiz.stage).asked,
        srs: ensureLang(quiz.packId).srs });
    if (quiz.q) speak(quiz.q.audio, quiz.q.say, packLang());
  }
  function startSession(sid, mode) {
    if (!sid) return;
    var rec = ensureLang(quiz.packId);
    quiz.stage = sid; quiz.mode = mode || 'lesson';
    quiz.offer = null; quiz.over = false; quiz.done = 0; quiz.right = 0; quiz.pi = 0;
    quiz.plan = window.IND_BHASHA.session(quiz.packId, sid, rec,
      { now: Date.now(), testout: quiz.mode === 'testout' });
    planStep();
  }
  function specNow() {
    return (quiz.plan && quiz.plan.specs && quiz.pi < quiz.plan.specs.length)
      ? quiz.plan.specs[quiz.pi] : null;
  }
  function recordAnswer(ok) {
    var rec = ensureLang(quiz.packId);
    rec.asked++; if (ok) rec.correct++;
    /* Per stage as well as per pack, or the path has nothing to draw. */
    var sst = rec.stages[quiz.stage] || (rec.stages[quiz.stage] = { asked: 0, correct: 0 });
    sst.asked++; if (ok) sst.correct++;

    /* SRS, FOR REAL (Phase 1): every graded answer moves the item's Leitner
       card. The key comes from the question itself (generators stamp itemKey
       on what they actually asked), falling back to the plan's pin. */
    var sp = specNow();
    var key = (quiz.q && quiz.q.itemKey) || (sp && sp.key) || null;
    var fresh = 0;
    if (key && window.IND_SRS) {
      var card = rec.srs[key] || (rec.srs[key] = { key: key });
      fresh = window.IND_SRS.box(card) <= 2 ? 1 : 0;   /* new-ish at the moment of asking */
      window.IND_SRS.review(card, ok, Date.now());
    }
    /* THE GRAMMAR TRACK, finally written. Every s4 sentence carries a `point`
       and each point has a card key (gram:<id>) that the parent's grammar map
       and the vyakaran page read — and nothing ever wrote. A sentence answered
       IS that point practised, so the answer moves the point's card too. */
    if (window.IND_SRS && quiz.q && quiz.q.point) {
      var gkey = 'gram:' + quiz.q.point;
      var gcard = rec.srs[gkey] || (rec.srs[gkey] = { key: gkey });
      window.IND_SRS.review(gcard, ok, Date.now());
    }
    /* the rolling window (last 12 graded answers for this pack) feeds the 85%
       steering and the band; the band resets the window when it moves so one
       hot streak is not counted twice */
    rec.window.push({ ok: ok ? 1 : 0, nw: fresh });
    if (rec.window.length > 12) rec.window.shift();
    var b = window.IND_BHASHA.bandStep(rec.band || 1, rec.window);
    if (b !== (rec.band || 1)) { rec.band = b; rec.window = []; }

    /* MISS REPLAY: an item answered wrong comes back later in this same
       session — once, a couple of beats ahead. The rule itself lives in the
       engine (IND_BHASHA.replayMiss) so it can be tested without a browser.
       NOT in a test-out: that card promises six questions, and a challenge
       that quietly grows when you miss is exactly the punishment mechanic
       docs/09 refuses. A test-out miss simply costs the mark. */
    if (!ok && sp && quiz.plan && quiz.mode !== 'testout') {
      window.IND_BHASHA.replayMiss(quiz.plan, quiz.pi, sp);
    }
    save();
    if (ok) { earn(2, 'correct'); quiz.right++; }
    quiz.done++;
  }
  function advance(ms) {
    if (window.BI_FAST) ms = 30;   /* test hook: tools/verify.js answers hundreds of questions */
    var token = quiz.q;            /* the question this beat belongs to */
    var waits = 0;
    var tick = function () {
      /* Only move on if that question is still the live one. Without this, a
         child (or the test) who starts another stage mid-beat gets their
         fresh question silently swapped from under them by the stale timer. */
      if (quiz.q !== token) return;
      /* THE LESSON WAITS (Phase 3). The feedback offers the word's card, and
         a child who takes it is off the pack page reading. Moving the session
         on underneath them would throw the card away mid-sentence — so the
         beat holds until they come back, for a couple of minutes at most, and
         then gives up rather than leaving a timer running forever. */
      if (view.name !== 'pack' && ++waits < 240) return setTimeout(tick, 500);
      quiz.pi++;
      planStep();
      render();
    };
    setTimeout(tick, ms);
  }

  /* The feedback strip. Right or wrong, the child learns something: the
     generators' why/point lines finally get shown, and the authored example
     sentences (data-bhasha-hi-sentences.js) surface after the answer — post-
     answer, so nothing on screen ever gives an answer away. Wrong is never
     shamed: the correct answer is shown and explained, and that is all. */
  var CHEERS = ['Shabash!', 'That’s it!', 'Well done!', 'Yes!'];
  var POINTS = {   /* kid-sized versions of the grammar-point ids on HI_S4 */
    sov: 'Hindi keeps the doing-word for last.',
    copula: '“है” — is — comes at the very end.',
    gender: 'The describing word changes with who it is about.',
    plural: 'More than one changes the word and the verb.',
    respect: 'For elders, Hindi uses the respectful “हैं”.',
    postposition: 'The little joining word comes AFTER its noun, not before.',
    possession: '“का / की / के” — of — follows the owner.',
    question: 'The asking word sits inside the sentence, not at the front.',
    negation: '“नहीं” sits just before the verb.',
    'tense-present': 'This is happening now.',
    'tense-past': 'This already happened.',
    'tense-future': 'This is still to come.',
    imperative: 'A gentle telling-to — the verb changes its ending.',
    request: '“दीजिए / चाहिए” make it polite.',
    agreement: 'The describing word agrees with the thing described.',
    quantity: 'The counting word comes before the noun.'
  };
  function exampleSentence(word) {
    /* the authored example-sentence seam, resolved through the engine
       (IND_BHASHA.sentence) rather than off the global — one lookup, one
       derived clip key, and packs beyond Hindi arrive without touching this */
    var B = window.IND_BHASHA;
    return (B && B.sentence) ? B.sentence(quiz.packId, word) : null;
  }
  function fbFor(q, ok, idx) {
    var head = ok ? CHEERS[quiz.done % CHEERS.length] : 'Not this one —';
    var body = '', sent = null, i;
    /* Phase 3: a question about a WORD ends one tap from that word's card —
       the sentence, the theme, the voice, where it stands in the child's own
       boxes. The lesson waits while they read it (see advance()). */
    var cardWord = null;
    switch (q.type) {
      case 'soundMatch':
        body = '<b class="deva">' + esc(q.answer) + '</b> says “' + esc(q.answerName) + '”.'; break;
      case 'matraAttach':
        body = '<span class="deva">' + esc(q.base) + '</span> + <span class="deva">' + esc(q.matra) + '</span> = ' +
               '<b class="deva">' + esc(q.target) + '</b> — “' + esc(q.targetName) + '”.'; break;
      case 'barakhadi':
        body = '<b class="deva">' + esc(q.target) + '</b> says “' + esc(q.targetRoman) + '”.'; break;
      case 'oddOneOut':
        body = esc(q.why || ''); break;
      case 'listenPoint':
        body = '<b class="deva">' + esc(q.answerWord) + '</b> (' + esc(q.roman) + ') — ' + esc(q.answer) + '.';
        sent = exampleSentence(q.answerWord); cardWord = q.answerWord; break;
      case 'wordBuild':
        body = '<b class="deva">' + esc(q.word) + '</b> (' + esc(q.roman) + ') — ' + esc(q.en) + '.';
        sent = exampleSentence(q.word); cardWord = q.word; break;
      /* THE REWARD (Phase 3). Answering fills the gap in: the sentence is
         shown whole for the first time, with the word standing in its place,
         and now — and only now — its romanisation and its voice. */
      case 'sentenceBlank':
        body = '<b class="deva">' + esc(q.answerWord) + '</b> (' + esc(q.roman) + ') — ' + esc(q.wordEn) + '.' +
          '<span class="fbsent"><span class="deva">' + esc(q.before) +
          '<b class="fbfill">' + esc(q.answerWord) + '</b>' + esc(q.after) + '</span><br>' +
          '<span class="muted">' + esc(q.fullRoman || '') + ' — ' + esc(q.en || '') + '</span></span>';
        cardWord = q.answerWord; break;
      case 'sentenceBuild':
        body = '<span class="deva">' + esc(q.full || q.say || '') + '</span> <span class="muted">' + esc(q.roman || '') + '</span>' +
               (POINTS[q.point] ? '<br>' + esc(POINTS[q.point]) : ''); break;
      case 'conjunctSplit':
        var pr = [];
        for (i = 0; i < (q.parts || []).length; i++) pr.push('<span class="deva">' + esc(q.parts[i]) + '</span>');
        body = pr.join(' + ') + ' make <b class="deva">' + esc(q.conjunct) + '</b>' +
               (q.word ? ' — as in <span class="deva">' + esc(q.word) + '</span>' : '') + '.'; break;
      case 'pickReply':
        var why = (!ok && q.options[idx] && q.options[idx].whyWrong) ? esc(q.options[idx].whyWrong) + ' ' : '';
        var best = q.options[q.answerIndex] || {};
        body = why + 'You’d say: <b class="deva">' + esc(best.word) + '</b> — “' + esc(best.en || q.answerEn || '') + '”.' +
               (q.promptEn ? '<br><span class="muted">They said: “' + esc(q.promptEn) + '”</span>' : ''); break;
      case 'readPassage':
        body = '“' + esc(q.answerEn) + '”<br><span class="muted">' + esc(q.roman || '') + '</span>'; break;
      case 'trace':
        body = 'That is <b class="deva">' + esc(q.letter.char) + '</b> — “' + esc(q.letter.name) + '”.'; break;
    }
    if (sent) {
      body += '<span class="fbsent"><span class="deva">' + esc(sent.s) + '</span><br>' +
              '<span class="muted">' + esc(sent.roman) + ' — ' + esc(sent.en) + '</span></span>';
    }
    if (cardWord && window.IND_PACKS[quiz.packId]) {
      body += '<button class="fbcard" data-act="wcard" data-id="' + esc(quiz.packId + ':' + cardWord) +
        '">See the word card →</button>';
    }
    return { ok: ok, html: '<b>' + esc(head) + '</b> ' + body };
  }
  /* Inject feedback into the live page without a re-render, so the .right /
     .wrong marks the grader just set stay put. */
  function showFb(fb) {
    quiz.fb = fb;
    var el = $('#qfb');
    if (el) { el.className = 'qfb show ' + (fb.ok ? 'good' : 'bad'); el.innerHTML = fb.html; }
  }

  /* Ordered build: place a tile, return a tile, grade when full. */
  function placeTile(i) {
    var q = quiz.q, b = quiz.build;
    if (!q || quiz.lock || !b || b.placed.indexOf(i) >= 0 || i < 0 || i >= q.tiles.length) return;
    b.placed.push(i);
    if (b.placed.length >= q.answer.length) return buildGrade();
    render();
  }
  function buildGrade() {
    var q = quiz.q, b = quiz.build, built = [], i;
    for (i = 0; i < b.placed.length; i++) built.push(tileChar(q.tiles[b.placed[i]]));
    var ok = built.join('') === q.answer.join('');
    recordAnswer(ok);
    quiz.lock = true;
    quiz.reveal = !ok;                        /* show the correct arrangement briefly */
    quiz.fb = fbFor(q, ok, -1);
    /* a built sentence is HEARD now, not before — before the answer the audio
       IS the answer (word order), so the voice is the reward for finishing */
    if (q.type === 'sentenceBuild' && q.full) speak(null, q.full, packLang());
    render();
    advance(ok ? 1100 : 2600);
  }

  /* PHASE B — grade what the child wrote.
     The engine's gradeWritten() does the script-aware work and hands back a
     `near` kind and one warm line. A near-miss is still marked wrong for the
     SRS — it has to be, or the child never revisits it — but it does NOT get
     the plain wrong treatment on screen: "you have the right sound, the wrong
     length" is a different sentence from "no", and the difference is the whole
     point of writing a grader instead of using ===. */
  function checkProduced() {
    var q = quiz.q;
    if (!q || quiz.lock || q.kind !== 'produce' || !quiz.typed) return;
    var r = q.grade(quiz.typed);
    recordAnswer(!!r.ok);
    quiz.lock = true;
    quiz.reveal = !r.ok;
    quiz.fb = {
      ok: !!r.ok,
      html: r.ok
        ? '<b>Yes — you wrote it.</b> <span class="deva">' + esc(q.answer) + '</span>'
        : (r.near
            ? '<b>Nearly.</b> ' + esc(r.why) +
              '<span class="pshow">It is <span class="deva">' + esc(q.answer) + '</span></span>'
            : '<b>Not yet.</b><span class="pshow">It is <span class="deva">' + esc(q.answer) +
              '</span></span>')
    };
    render();
    /* a near-miss earns a longer beat than a plain miss: there is something
       specific to read, and it is the thing that teaches */
    advance(r.ok ? 1300 : (r.near ? 3600 : 3000));
  }

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
  var TESTOUT_PASS = 5;          /* of the six test-out questions */
  function stagePct(packId, sid) {
    return Math.min(100, Math.round(stageStat(packId, sid).correct / STAGE_TARGET * 100));
  }
  /* STAGE GATES (Phase 2). A stage is MASTERED by any one of: the 12 correct
     answers of old; a passed test-out; or SRS coverage — enough of its items
     living in boxes 3+ that the reviews themselves prove the ground is held. */
  function stageMastered(packId, s) {
    var st = stageStat(packId, s.id);
    if (st.correct >= STAGE_TARGET || st.testout) return true;
    var r = window.IND_BHASHA.readiness(packId, s.id, (S.lang[packId] || {}).srs || {});
    return !!r && r.total > 0 && (r.review + r.mastered) >= Math.min(r.total, STAGE_TARGET);
  }
  /* A stage unlocks when the one before it is mastered — but a locked stage
     is never a wall (docs/09): tapping it opens the test-out offer, and a
     passed test-out unlocks it directly. The heritage path starts at s1 —
     the ear is ahead of the eye, so Listening is skippable from day one. */
  function stageUnlocked(packId, i, stages) {
    if (i === 0) return true;
    var rec = ensureLang(packId);
    if (rec.path === 'heritage' && i === 1) return true;
    if ((rec.stages[stages[i].id] || {}).testout) return true;
    return stageMastered(packId, stages[i - 1]);
  }
  function nextStage(p) {
    var list = p.stages || [], rec = ensureLang(p.id), i;
    for (i = 0; i < list.length; i++) {
      /* the heritage child starts at the script, not at listening */
      if (rec.path === 'heritage' && i === 0 && !stageMastered(p.id, list[0])) continue;
      if (!stageUnlocked(p.id, i, list)) break;
      if (!stageMastered(p.id, list[i])) return list[i];
    }
    for (i = 0; i < list.length; i++) { if (!stageMastered(p.id, list[i])) return list[i]; }
    return list[list.length - 1];
  }

  /* The band, worn as a travel name — NEVER a grade, never a number on
     screen. Five stops on a journey: a new traveller, then walking, then
     water finding its way, then a bird up on the wind, then the mountain. */
  var BAND_LABELS = ['Naya yatri', 'Chalta hua', 'Behta paani', 'Udta panchhi', 'Parvat'];

  /* The per-stage readiness chips, straight off the SRS boxes. Two rules of
     restraint, both learned from the first screenshot: a stage nobody has
     opened yet gets NO chips (readiness is a readout, and before you start
     there is nothing to read — "498 new" on the word stage was a wall, not
     information), and the new count is capped so a 500-word lexicon never
     shouts its size at a seven-year-old. */
  function readinessChips(r) {
    if (!r || !r.total) return '';
    if (r.unseen >= r.total) return '';          /* untouched: say nothing */
    var bits = [];
    if (r.unseen) bits.push('<i class="rc rc-new">' + (r.unseen > 99 ? '99+' : r.unseen) + ' new</i>');
    if (r.learning) bits.push('<i class="rc rc-learn">' + r.learning + ' learning</i>');
    if (r.review) bits.push('<i class="rc rc-rev">' + r.review + ' review</i>');
    if (r.mastered) bits.push('<i class="rc rc-mast">' + r.mastered + ' mastered</i>');
    return bits.length ? '<span class="rchips">' + bits.join('') + '</span>' : '';
  }

  V.pack = function (id) {
    var p = window.IND_PACKS[id]; if (!p) return '<div class="card">Pack not found.</div>';
    var sc = window.IND_SCRIPTS[p.script];
    if (quiz.packId !== id) quiz = quizReset(id);
    var rec = ensureLang(id);
    if (quiz.q) return '<button class="backlink" data-act="pack" data-id="' + id + '">' +
      icon('back', 18) + ' ' + esc(p.name.en) + '</button>' + V.question(quiz.q);

    var stages = p.stages || [];
    var nxt = nextStage(p);
    var doneN = stages.filter(function (s) { return stageMastered(id, s); }).length;
    var stageById = {};
    stages.forEach(function (s) { stageById[s.id] = s; });

    /* a locked stage was tapped: the test-out offer, never a wall (docs/09) */
    var offerCard = '';
    if (quiz.offer && stageById[quiz.offer]) {
      var os = stageById[quiz.offer];
      offerCard = '<div class="card totoffer"><div class="mono">Test out</div>' +
        '<h2 style="margin:6px 0 4px">Already know ' + esc(os.name) + '?</h2>' +
        '<p class="tiny" style="margin:0 0 12px">Six questions at full difficulty. Five right opens the ' +
        'stage and marks it done. Fewer costs nothing — the path simply waits.</p>' +
        '<div class="row"><button class="btn" data-act="totstart" data-s="' + esc(os.id) + '">Try the six</button>' +
        '<button class="btn ghost" data-act="totclose">Not yet</button></div></div>';
    }

    /* the arc just finished: say what happened, warmly, and offer the next one */
    var overCard = '';
    if (quiz.over && quiz.stage) {
      if (quiz.mode === 'testout') {
        overCard = quiz.right >= TESTOUT_PASS
          ? '<div class="card tint"><h2 style="margin:0">Tested out! ' +
            esc((stageById[quiz.stage] || {}).name || '') + ' is open</h2>' +
            '<p class="tiny">' + quiz.right + ' of ' + quiz.done + ' — you already carry this one.</p></div>'
          : '<div class="card"><h2 style="margin:0">Not this time — and that is fine</h2>' +
            '<p class="tiny">' + quiz.right + ' of ' + quiz.done + '. The stage will open the ordinary ' +
            'way, and the six questions are always here.</p></div>';
      } else {
        overCard = '<div class="card tint"><h2 style="margin:0">Shabash — session done</h2>' +
          '<p class="tiny">' + quiz.right + ' right of ' + quiz.done + '. Every answer moved one of your ' +
          'cards along its boxes.</p>' +
          '<button class="btn" data-act="quiz" data-s="' + esc(quiz.stage) + '">Another round</button></div>';
      }
    }

    /* CARRY ON says what the planned session will actually do — "2 new
       letters, then your review" — because the plan already exists. */
    var plan = nxt ? window.IND_BHASHA.session(id, nxt.id, rec, { now: Date.now() }) : null;

    return '<button class="backlink" data-act="go" data-v="bhasha">' + icon('back', 18) + ' Bhasha</button>' +

      '<div class="card"><div class="spread">' +
        '<div><h1 class="deva" style="margin:0">' + esc(p.name.native) + '</h1>' +
        '<div class="mono">' + esc(p.name.en) + ' · ' + esc(sc.name) + '</div></div>' +
        '<span class="pill stat" style="flex:none">' + doneN + ' / ' + stages.length + '</span></div>' +
        '<div class="meter" style="margin-top:14px"><i style="width:' +
          Math.round(doneN / Math.max(1, stages.length) * 100) + '%"></i></div></div>' +

      offerCard + overCard +

      /* The one obvious thing to do next — and what it will do. */
      (nxt ? '<button class="card nextup" data-act="quiz" data-s="' + esc(nxt.id) + '">' +
        '<div class="row" style="flex-wrap:nowrap;align-items:center">' +
        mascot('gattu', 'happy', 64) +
        '<div style="flex:1;text-align:left"><div class="mono">Carry on with</div>' +
        '<h2 style="margin:2px 0 4px">' + esc(nxt.name) + '</h2>' +
        '<p class="tiny" style="margin:0">' + esc(plan && plan.say ? plan.say : (nxt.outcome || '')) + '</p></div>' +
        '<span class="btn">' + icon('play', 18) + ' Go</span></div></button>' : '') +

      '<div class="card"><h3 style="margin:0 0 4px">The path</h3>' +
        '<p class="tiny muted">The same eight rungs in every language — that is the point of ' +
        'the engine.</p>' +
        /* The band lives WITH the path, because the path is what it paces: it
           caps how much new arrives per sitting and how deep into the ramp
           that new comes from. Worn as a place on a journey — never a grade,
           never a number on screen. */
        '<div class="bandrow"><span class="mono">where you are</span>' +
        '<span class="pill stat bandlbl">' +
        esc(BAND_LABELS[Math.max(0, Math.min(4, (rec.band || 1) - 1))]) + '</span></div>' +
        '<div class="path">' + stages.map(function (s, i) {
          var done = stageMastered(id, s);
          var unlocked = stageUnlocked(id, i, stages);
          var pct = stagePct(id, s.id);
          var chips = readinessChips(window.IND_BHASHA.readiness(id, s.id, rec.srs));
          if (!unlocked) {
            /* locked LOOKS locked but stays tappable — into the test-out offer */
            return '<button class="pnode locked" data-act="testout" data-s="' + esc(s.id) + '">' +
              '<span class="pdisc">' + icon('lock', 14) + '</span>' +
              '<span class="pbody"><b>' + esc(s.name) + '</b>' +
              '<span class="tiny muted">' + esc(s.outcome || '') + '</span>' +
              /* quiet, not loud: a locked rung should not out-shout the open
                 one above it. The only accented word is the way through. */
              '<span class="tiny muted">Opens after ' + esc(stages[i - 1].name) +
              ' — <b class="totlink">or test out</b></span>' + chips + '</span></button>';
          }
          var state = done ? 'done' : (s.id === nxt.id ? 'now' : 'ahead');
          var node = '<button class="pnode ' + state + '" data-act="quiz" data-s="' + esc(s.id) + '">' +
            '<span class="pdisc">' + (done ? '✓' : (i + 1)) + '</span>' +
            '<span class="pbody"><b>' + esc(s.name) + '</b>' +
            '<span class="tiny muted">' + esc(s.outcome || '') + '</span>' +
            (pct > 0 && pct < 100 ? '<span class="meter sm"><i style="width:' + pct + '%"></i></span>' : '') +
            chips + '</span></button>';
          /* the heritage child starts at the script; s0 stays skippable */
          if (i === 0 && rec.path === 'heritage' && !done) {
            node += '<button class="totmini" data-act="testout" data-s="' + esc(s.id) + '">' +
              'Ears ahead of eyes? Test out of ' + esc(s.name) + ' →</button>';
          }
          return node;
        }).join('') + '</div></div>' +

      /* The THREE references, behind their own doors — a chart is not a lesson, and
         neither is a dictionary or a grammar. All three are here to be looked things up
         in, which is a different job from being taught. */
      '<div class="grid g2">' +
      (window.IND_BHASHA && window.IND_BHASHA.grammar && window.IND_BHASHA.grammar(id)
        ? '<button class="tile" data-act="vyakaran" data-id="' + id + '">' +
          '<b class="deva" lang="' + esc(id) + '">व्याकरण</b>' +
          '<span class="tiny muted">The ' + window.IND_BHASHA.grammar(id).length +
          ' things that decide how a sentence is built — each one with the mistake ' +
          'almost everybody makes.</span></button>'
        : '') +
      '<button class="tile" data-act="chart" data-id="' + id + '">' +
        '<b>The ' + esc(sc.name) + ' chart</b>' +
        '<span class="tiny muted">All ' + ((sc.vowels || []).length + (sc.consonants || []).length) +
        ' letters, with the sound of each. Look things up here any time.</span></button>' +
      '<button class="tile" data-act="kosh" data-id="' + id + '">' +
        '<b class="deva" lang="' + esc(id) + '">शब्दकोश</b>' +
        '<span class="tiny muted">Every one of the ' + ((p.lexicon || []).length) +
        ' words, room by room — each with what it means and a sentence it lives in.</span></button>' +
      '</div>';
  };

  /* The letter chart. A reference, deliberately separate from the lessons. */

  /* ------------------------------------------------------------ GRAMMAR (Phase C)
     Sixteen grammar points, as things a child can read rather than labels on a
     sentence. Each card carries the rule in one sentence they can hold, the mistake an
     English-speaking child actually makes, and worked examples pulled BY ID from the
     sentences already written — so correcting a sentence corrects its card.

     Deliberately not a quiz screen. This is the page you send a child to when they ask
     "why is it की and not का", and the page a grown-up reads before they try to help. */
  V.vyakaran = function (packId) {
    var B = window.IND_BHASHA;
    var pack = packId || 'hi';
    var bank = B && B.grammar ? B.grammar(pack) : null;
    var P = window.IND_PACKS[pack] || {};
    var pname = (P.name && P.name.en) || 'this language';
    /* A pack with no grammar written yet gets a REAL page, not a one-line stub. Hindi is
       first by design (docs/09 §8) and the other eight follow it; saying so plainly is
       better than a dead end, and it is the honest state of the work. */
    if (!bank) {
      return '<button class="backlink" data-act="pack" data-p="' + esc(pack) + '">' +
          icon('back', 18) + ' ' + esc(pname) + '</button>' +
        '<div class="card"><h1 style="margin:0">Vyakaran</h1>' +
        '<div class="mono">' + esc(pname) + '</div>' +
        '<p style="margin:10px 0 0">The grammar of ' + esc(pname) + ' has not been written up ' +
        'yet. Hindi went first on purpose — its sixteen points are the shape every other ' +
        'pack is mapped onto, so getting that one right saves doing the work eight more ' +
        'times badly.</p>' +
        '<p class="tiny muted" style="margin:10px 0 0">The words, the letters and the ' +
        'lessons for ' + esc(pname) + ' all work today. It is only this reference that is waiting.</p>' +
        '</div>' +
        '<button class="tile" data-act="vyakaran" data-id="hi"><b>See how it works in Hindi</b>' +
        '<span class="tiny muted">The same sixteen questions, answered — most of them ' +
        'have a close cousin in ' + esc(pname) + '.</span></button>';
    }
    return '<button class="backlink" data-act="pack" data-p="' + esc(pack) + '">' +
        icon('back', 18) + ' ' + esc(pname) + '</button>' +
      '<div class="card"><h1 style="margin:0">Vyakaran</h1>' +
      '<div class="mono">How ' + esc(pname) + ' puts a sentence together</div>' +
      '<p style="margin:10px 0 0">Sixteen things. Not rules to recite — each one is the ' +
      'answer to a question you will actually have, and the mistake almost everybody makes ' +
      'on the way.</p></div>' +
      bank.map(function (g) {
        var pt = B.grammarPoint(pack, g.id);
        if (!pt) return '';
        return '<div class="card gcard">' +
          '<div class="spread" style="align-items:baseline">' +
            '<div><span class="deva" style="font-size:23px;font-weight:700">' + esc(pt.hi) + '</span> ' +
            '<span class="mono" style="text-transform:none">' + esc(pt.roman) + '</span></div>' +
            '<span class="pill stat tiny">' + pt.count + ' sentence' + (pt.count === 1 ? '' : 's') + '</span>' +
          '</div>' +
          '<h3 style="margin:4px 0 8px">' + esc(pt.en) + '</h3>' +
          '<p style="margin:0 0 10px">' + esc(pt.rule) + '</p>' +
          '<div class="card flat tight" style="margin:0 0 10px">' +
            '<span class="mono">Watch out</span>' +
            '<div class="tiny" style="margin-top:5px">' + esc(pt.watch) + '</div></div>' +
          pt.eg.map(function (e) {
            return '<button class="gline" data-act="say" data-k="' + esc(e.audio || '') +
              '" data-t="' + esc(e.hi) + '" data-l="hi-IN">' +
              '<span class="deva">' + esc(e.hi) + '</span>' +
              '<span class="tiny muted">' + esc(e.en) + '</span>' +
              icon('sound', 17) + '</button>';
          }).join('') +
          '</div>';
      }).join('');
  };


  /* -------------------------------------------------------- PHASE F: the parent's view
     What a grown-up actually needs, and nothing else. Where the child is by stage, which
     grammar points have been met and which have not, what is due today, and what got
     missed twice — because that last one is the only list worth acting on.

     THREE THINGS IT DELIBERATELY IS NOT (docs/12 Phase F):
       · not a score. No percentage, no grade, no rank. A child is not a number and a
         parent reading a number learns nothing they can act on.
       · not gamified. No streak pressure, no "you are behind", no comparison to anyone.
       · not editable. Read-only. A parent who can reset a box can undo the spacing that
         makes the whole thing work, usually with the best intentions.

     What it IS: honest. If nothing has been started it says so plainly. */
  V.progress = function (packId) {
    var B = window.IND_BHASHA;
    var pack = packId || 'hi';
    var P = window.IND_PACKS[pack];
    if (!B || !P) return '<div class="card">Not found.</div>';
    var pname = (P.name && P.name.en) || 'this language';
    var srs = (S.lang && S.lang[pack] && S.lang[pack].srs) || {};
    var keys = Object.keys(srs);

    var rows = (P.stages || []).map(function (st) {
      var r = B.readiness(pack, st.id, srs);
      if (!r || !r.total) return '';
      var met = r.total - r.unseen;
      return '<tr><td style="padding:9px 10px"><b>' + esc(st.name || st.id) + '</b>' +
        '<div class="tiny muted">' + esc(st.blurb || '') + '</div></td>' +
        '<td style="padding:9px 10px;text-align:right;white-space:nowrap">' +
        '<span class="tiny muted">' + met + ' of ' + r.total + ' met</span><br>' +
        '<b>' + r.mastered + '</b> <span class="tiny muted">known well</span></td></tr>';
    }).join('');

    /* the grammar map — Phase C's whole reason for existing on this screen */
    var bank = B.grammar ? B.grammar(pack) : null;
    var gmap = bank ? bank.map(function (g) {
      var c = srs['gram:' + g.id];
      var seen = !!(c && (c.seen || c.intro));
      return '<span class="pill' + (seen ? ' on' : '') + '" style="font-size:12.5px">' +
        esc(g.en) + '</span>';
    }).join(' ') : '';

    /* missed twice — the only list a parent can actually do something about tonight.
       Keys are storage ids; a parent gets the THING — the word itself, the
       sentence itself — because "s4-12" is not something you can say at dinner. */
    var stuckLabel = function (k) {
      var kind = k.split(':')[0], id = k.slice(kind.length + 1), i, st, it;
      if (kind === 'word' || kind === 'letter' || kind === 'matra' || kind === 'conjunct') return id;
      if (kind === 'gram') {
        var gb = B.grammar ? B.grammar(pack) : null;
        if (gb) { for (i = 0; i < gb.length; i++) { if (gb[i].id === id) return gb[i].en; } }
        return null;
      }
      /* sent:/dlg:/passage: — find the item and show its own line, shortened */
      for (var s = 0; s < (P.stages || []).length; s++) {
        st = P.stages[s];
        for (i = 0; i < (st.items || []).length; i++) {
          it = st.items[i];
          if (it && typeof it === 'object' && (it.id === id || it.hi === id)) {
            return (it.hi || '').length > 28 ? it.hi.slice(0, 26) + '…' : it.hi;
          }
        }
      }
      return null;
    };
    var stuck = keys.filter(function (k) {
      var c = srs[k];
      return c && (c.lapses || 0) >= 2;
    }).map(function (k) { return { k: k, label: stuckLabel(k) }; })
      .filter(function (x) { return !!x.label; })
      .slice(0, 12);

    var started = keys.length > 0;
    return '<button class="backlink" data-act="go" data-v="bhasha">' + icon('back', 18) + ' Bhasha</button>' +
      '<div class="card"><h1 style="margin:0">How it is going</h1>' +
      '<div class="mono">' + esc(pname) + ' · for a grown-up</div>' +
      (started
        ? '<p style="margin:10px 0 0">Read-only, on purpose. There is no score here and ' +
          'nothing to reset — the spacing between practices is what makes any of it stick, ' +
          'and it works best when nobody nudges it.</p>'
        : '<p style="margin:10px 0 0">Nothing started yet. This page fills in as soon as ' +
          'there is something honest to put on it.</p>') + '</div>' +
      (started ? '<div class="card"><h3 style="margin-top:0">Where they are</h3>' +
        '<table style="width:100%;border-collapse:collapse">' + rows + '</table></div>' : '') +
      (gmap ? '<div class="card"><h3 style="margin-top:0">The grammar they have met</h3>' +
        '<p class="tiny muted" style="margin:0 0 10px">Lit means it has come up in a lesson ' +
        'at least once — not that it is finished. Nothing here is ever finished.</p>' +
        '<div class="row" style="flex-wrap:wrap;gap:6px">' + gmap + '</div></div>' : '') +
      (stuck.length
        ? '<div class="card tint"><h3 style="margin-top:0">Missed more than once</h3>' +
          '<p class="tiny muted" style="margin:0 0 10px">The only list on this page worth ' +
          'acting on. Say these out loud together at dinner — that is genuinely all it takes.</p>' +
          '<div class="row" style="flex-wrap:wrap;gap:6px">' + stuck.map(function (x) {
            return '<span class="pill deva">' + esc(x.label) + '</span>';
          }).join('') + '</div></div>'
        : (started ? '<div class="card flat tiny">Nothing has been missed twice. ' +
          'That is the whole report on that front.</div>' : '')) +
      '<div class="card flat tiny">Everything on this page is worked out on this device ' +
      'from what has been practised. No score is stored, nothing is sent anywhere, and ' +
      'there is nothing here another child could be compared against.</div>';
  };

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

  /* ============================================================ THE WORD CARD
     Phase 3, and the thing the audit named in the user's own words: "there
     are no word cards with sentences like in bizzing bee."

     One card for one word — the word big in its own script, its roman, what
     it means, the theme it belongs to, where it stands in this child's own
     spaced repetition, and the EXAMPLE SENTENCE it lives in, which is the
     half that did not exist at all.

     The sentence has two states, and the difference between them is the one
     rule of this app that cannot bend. BROWSING, it is shown whole, romanised
     and glossed, and can be heard whole — that is the reward. TESTING, the
     word is cut out of it by exact string match on the single verbatim
     occurrence the data guarantees, and nothing on screen, and nothing the
     speaker says, contains the answer until the child has answered. Both
     states share one masker (IND_BHASHA.mask), so the rule cannot drift
     from one screen to another. */

  /* the same four words the pack page's readiness chips use, off the same
     Leitner boxes, so a word never says "review" in one place and "learning"
     in another */
  var WSTATE = { new: ['new', 'rc-new'], learn: ['learning', 'rc-learn'],
                 rev: ['review', 'rc-rev'], mast: ['mastered', 'rc-mast'] };
  function wordState(packId, word) {
    var c = ((S.lang[packId] || {}).srs || {})['word:' + word];
    if (!c || (!c.seen && !c.intro)) return 'new';
    var b = window.IND_SRS ? window.IND_SRS.box(c) : 0;
    return b >= 5 ? 'mast' : (b >= 3 ? 'rev' : 'learn');
  }
  function themeOf(pack, id) {
    var t = (pack && pack.themes) || [], i;
    for (i = 0; i < t.length; i++) { if (t[i].id === id) return t[i]; }
    return null;
  }
  function lexWord(pack, word) {
    var lex = (pack && pack.lexicon) || [], i;
    for (i = 0; i < lex.length; i++) { if (lex[i].word === word) return lex[i]; }
    return null;
  }
  /* The sentence half of the card. `masked` cuts the word out and offers the
     read-around-the-gap voice; unmasked shows and speaks the whole thing.
     A pack with no sentences written yet renders nothing here rather than an
     empty frame — the gap is honest, not decorated. */
  function sentBlock(packId, word, masked) {
    var B = window.IND_BHASHA, e = (B && B.sentence) ? B.sentence(packId, word) : null;
    if (!e) return '';
    if (masked) {
      var m = B.mask(e.s, word, '');
      return '<div class="wcsent masked"><div class="mono">in a sentence</div>' +
        '<p class="wcs deva">' + esc(m.before) +
        '<span class="wcgap" role="img" aria-label="the missing word"></span>' + esc(m.after) + '</p>' +
        '<button class="btn ghost sm" data-act="saymask" data-b="' + esc(m.before) + '" data-a="' + esc(m.after) +
        '" data-l="' + esc(packId + '-IN') + '">' + icon('sound', 16) + ' Hear it round the gap</button></div>';
    }
    /* THE WORD IS MARKED INSIDE THE SENTENCE. Seeing it twice is the whole
       point of showing a sentence at all -- once alone, once at work -- and
       an unmarked sentence makes a four-year-old hunt for it. Same splitter
       the covered card uses, so the two can never disagree about where the
       word is; a sentence that somehow does not contain its own word falls
       back to the plain line rather than rendering an empty mark. */
    var hi = B.mask(e.s, word, '');
    var body = (hi && (hi.before !== e.s))
      ? esc(hi.before) + '<b class="wcs-hit">' + esc(word) + '</b>' + esc(hi.after)
      : esc(e.s);
    return '<div class="wcsent"><div class="mono">in a sentence</div>' +
      '<p class="wcs deva">' + body + '</p>' +
      '<p class="wcsr">' + esc(e.roman) + '<span class="muted">' + esc(e.en) + '</span></p>' +
      '<button class="btn ghost sm" data-act="saysent" data-p="' + esc(packId) + '" data-w="' + esc(word) +
      '">' + icon('sound', 16) + ' Hear the sentence</button></div>';
  }
  /* The card body, shared by the full view, the Shabdkosh, the introduce beat
     and the post-answer feedback — one card, four doors. */
  function wordCard(packId, word, o) {
    o = o || {};
    var p = window.IND_PACKS[packId]; if (!p) return '';
    var w = lexWord(p, word); if (!w) return '';
    var th = themeOf(p, w.theme), st = WSTATE[wordState(packId, word)];
    /* COVERED. The word, its romanisation and its voice all go at once —
       covering the Devanagari while a "Hear it" button says it out loud, or
       while the roman spells it in Latin underneath, would be a fig leaf. The
       meaning stays, because the meaning is the cue you are answering from. */
    return '<div class="wcard' + (o.flat ? ' flat' : '') + (o.mask ? ' covered' : '') + '">' +
      '<div class="wchead">' +
        (th ? '<button class="wctheme" data-act="kosh" data-id="' + esc(packId) + '" data-t="' + esc(th.id) + '">' +
          esc(th.icon) + ' ' + esc(th.en) + '</button>' : '<span></span>') +
        '<i class="rc ' + st[1] + '">' + st[0] + '</i></div>' +
      (o.mask
        ? '<div class="wcword covered" role="img" aria-label="the word, covered up">' +
          '<span class="wcgap big"></span></div>'
        : '<div class="wcword deva" lang="' + esc(packId) + '">' + esc(w.word) + '</div>' +
          '<div class="wcroman">' + esc(w.roman) + '</div>') +
      '<div class="wcen">' + esc(w.en) + '</div>' +
      (o.mask ? ''
        : '<button class="btn ghost block wchear" data-act="say" data-k="' +
          esc(window.IND_BHASHA.audioFor(w.audio, p) || '') +
          '" data-t="' + esc(w.word) + '" data-l="' + esc(packId + '-IN') + '">' +
          icon('sound', 18) + ' Hear it</button>') +
      sentBlock(packId, word, !!o.mask) +
      (o.link ? '<button class="btn ghost block" style="margin-top:12px" data-act="wcard" data-id="' +
        esc(packId + ':' + word) + '">See the whole card →</button>' : '') +
      '</div>';
  }

  /* The card on its own page. Reached from the Shabdkosh, from a lesson's
     feedback and from anywhere a word is named.

     COVER IT UP is the Bee's revise card, kept: a flashcard whose whole point
     is that you can hide the answer and try to remember it. Covered, the card
     shows the meaning, the theme and the sentence with the word cut out of
     it, and will read the sentence around the gap — everything except the
     one thing you are trying to recall. */
  var wcardMask = false;
  V.wordcard = function (arg) {
    var bits = String(arg || '').split(':'), packId = bits[0], word = bits.slice(1).join(':');
    var p = window.IND_PACKS[packId], w = p ? lexWord(p, word) : null;
    if (!w) return '<div class="card"><h1>Word</h1><p>That word is not in this pack.</p>' +
      '<button class="btn" data-act="go" data-v="bhasha">Bhasha</button></div>';
    var th = themeOf(p, w.theme);
    /* the neighbours in its own theme, so the card is a place you can carry
       on from rather than a dead end */
    var near = (p.lexicon || []).filter(function (x) { return x.theme === w.theme && x.word !== w.word; }).slice(0, 8);
    return '<button class="backlink" data-act="kosh" data-id="' + esc(packId) + '" data-t="' + esc(w.theme) + '">' +
      icon('back', 18) + ' Shabdkosh</button>' +
      '<div class="card">' + wordCard(packId, word, { flat: true, mask: wcardMask }) +
        '<button class="btn ghost block wcflip" data-act="wcflip">' +
        (wcardMask ? 'Show me the word' : 'Cover it up and test me') + '</button></div>' +
      (near.length ? '<div class="card"><h3 style="margin:0 0 4px">More ' +
        esc(th ? th.en.toLowerCase() : 'words') + '</h3>' +
        '<p class="tiny muted">Words that keep the same company.</p>' +
        '<div class="koshgrid">' + near.map(function (x) { return koshRow(packId, x); }).join('') + '</div></div>' : '');
  };

  /* ------------------------------------------------------------ SHABDKOSH
     शब्दकोश — the word-store. Every word in the pack, grouped by the themes
     the pack itself declares, with a count on each so a child can see how big
     a room is before walking into it. Tapping a word opens its card. This is
     a REFERENCE, deliberately, the way the letter chart is: browsable, never
     graded, never a lesson. */
  /* which room of the Shabdkosh is open — null is the whole store. It lives
     out here rather than in the URL because the app has one view argument and
     that one belongs to the pack. */
  var koshTheme = null;
  function koshRow(packId, x) {
    var st = WSTATE[wordState(packId, x.word)];
    return '<button class="koshw" data-act="wcard" data-id="' + esc(packId + ':' + x.word) + '">' +
      '<b class="deva" lang="' + esc(packId) + '">' + esc(x.word) + '</b>' +
      '<span class="tiny muted">' + esc(x.roman) + ' · ' + esc(x.en) + '</span>' +
      (st[0] === 'new' ? '' : '<i class="rc ' + st[1] + '">' + st[0] + '</i>') + '</button>';
  }
  V.kosh = function (id) {
    var p = window.IND_PACKS[id]; if (!p) return '<div class="card">Pack not found.</div>';
    var lex = p.lexicon || [], byTheme = {}, i;
    for (i = 0; i < lex.length; i++) (byTheme[lex[i].theme] || (byTheme[lex[i].theme] = [])).push(lex[i]);
    var withSent = 0, B = window.IND_BHASHA;
    var sm = (B && B.sentences) ? B.sentences(p) : null;
    for (i = 0; i < lex.length; i++) { if (sm && sm[lex[i].word]) withSent++; }
    var open = koshTheme;   /* which room is open; null means all of them */
    return '<button class="backlink" data-act="pack" data-id="' + esc(id) + '">' + icon('back', 18) +
      ' ' + esc(p.name.en) + '</button>' +
      '<div class="card"><h1 class="deva" style="margin:0" lang="' + esc(id) + '">शब्दकोश</h1>' +
      '<div class="mono">Shabdkosh · the word-store</div>' +
      '<p style="margin:10px 0 0">Every word in ' + esc(p.name.en) + ' — ' + lex.length +
      ' of them, in the rooms they live in' +
      (withSent ? ', ' + withSent + ' with a sentence to show you what they do' : '') +
      '. Tap any word for its card.</p></div>' +
      '<div class="koshtabs">' +
      '<button class="pill' + (open ? '' : ' on') + '" data-act="kosh" data-id="' + esc(id) + '">All ' + lex.length + '</button>' +
      (p.themes || []).map(function (t) {
        var n = (byTheme[t.id] || []).length;
        if (!n) return '';
        return '<button class="pill' + (open === t.id ? ' on' : '') + '" data-act="kosh" data-id="' + esc(id) +
          '" data-t="' + esc(t.id) + '">' + esc(t.icon) + ' ' + esc(t.en) + ' ' + n + '</button>';
      }).join('') + '</div>' +
      /* Room by room. The front door shows every room with the first dozen
         words in it, because a dictionary that opens on nothing but folders
         is not browsable; opening a room shows the whole of it. A phone
         should never be handed 507 rows it did not ask for. */
      (p.themes || []).map(function (t) {
        var list = byTheme[t.id] || [];
        if (!list.length || (open && open !== t.id)) return '';
        var all = !!open || list.length <= 12, shown = all ? list : list.slice(0, 12);
        return '<div class="card"><div class="spread"><h3 style="margin:0">' + esc(t.icon) + ' ' + esc(t.en) + '</h3>' +
          '<span class="pill stat" style="flex:none">' + list.length + '</span></div>' +
          '<div class="koshgrid">' + shown.map(function (x) { return koshRow(id, x); }).join('') + '</div>' +
          (all ? '' : '<button class="btn ghost sm koshmore" data-act="kosh" data-id="' + esc(id) +
            '" data-t="' + esc(t.id) + '">All ' + list.length + ' ' + esc(t.en.toLowerCase()) + ' words →</button>') +
          '</div>';
      }).join('');
  };

  function optLabel(o) { if (o == null) return ''; if (typeof o === 'string') return o; return o.char || o.word || o.sign || o.syllable || o.en || o.roman || ''; }

  /* THE QUESTION RENDERER — Phase 0 rebuild. Three families (choice, build,
     trace), and one rule above all of them, from CLAUDE.md: never leak the
     answer in on-screen text. That is why wordBuild shows the meaning and a
     play button but NEVER the word itself; why soundMatch and matraAttach
     options carry no roman labels (the label would name the sound being
     asked for); and why sentenceBuild shows only the English until after the
     answer. */
  /* THE ARC STRIP — one tick per beat of the planned session, so a lesson has
     a visible shape and an end. Introductions are the short pale ticks, drills
     the plain ones, the closing review its own colour; everything behind the
     pointer is filled. This is the honest opposite of a Duolingo heart row: it
     shows how much is left, never how much you have to lose. */
  /* THE PRACTICE SET announces itself, once, on the beat it begins. A lesson
     that just stops is a lesson with no shape; "now let's practise what you
     met" is the oldest teaching move there is and it costs one line. It shows
     on the FIRST practice beat only — a banner over every one of them is a
     nag, not a signal. */
  function practiceBanner() {
    var pl = quiz.plan, specs = pl && pl.specs, sp = specNow();
    if (!sp || sp.kind !== 'practice' || !specs) return '';
    var first = true, i;
    for (i = 0; i < quiz.pi; i++) if (specs[i].kind === 'practice') { first = false; break; }
    if (!first) return '';
    var n = 0;
    for (i = 0; i < specs.length; i++) if (specs[i].kind === 'practice') n++;
    return '<div class="pracflag">Practice — the ' + n + ' you just met</div>';
  }

  function arcStrip() {
    var pl = quiz.plan, specs = pl && pl.specs;
    if (!specs || specs.length < 2) return '';
    var out = '', i, k;
    for (i = 0; i < specs.length; i++) {
      k = specs[i].kind === 'introduce' ? 'a-int'
        : specs[i].kind === 'review' ? 'a-rev'
        : specs[i].kind === 'practice' ? 'a-prac' : 'a-dr';
      out += '<i class="' + k + (i < quiz.pi ? ' done' : (i === quiz.pi ? ' at' : '')) + '"></i>';
    }
    return '<div class="arcbar" role="img" aria-label="beat ' + (quiz.pi + 1) +
      ' of ' + specs.length + ' in this session">' + out + '</div>' + practiceBanner();
  }

  V.question = function (q) {
    var qfb = '<div id="qfb" class="qfb' + (quiz.fb ? ' show ' + (quiz.fb.ok ? 'good' : 'bad') : '') + '">' +
      (quiz.fb ? quiz.fb.html : '') + '</div>';
    var meta = '<div class="mono" style="margin-top:14px">' + quiz.right + ' right of ' + quiz.done +
      ' · no timer, no lives</div>';
    var hear = (q.audio || q.say)
      ? '<button class="btn ghost block" style="margin-bottom:14px" data-act="say" data-k="' + esc(q.audio || '') +
        '" data-t="' + esc(q.say || '') + '" data-l="' + esc(packLang()) + '">' + icon('sound', 20) + ' Hear it</button>'
      : '';

    /* --- the introduce beat (Phase 1): teach first, then drill ---
       Not a question and not graded: the new thing shown plainly — glyph,
       name, meaning, voice — with a single Got-it (tap, or just Enter).
       The example-sentence seam gives a word its sentence on first meeting. */
    if (q.type === 'introduce') {
      /* A WORD is met as its card (Phase 3) — the word, its meaning, its
         theme, its voice and the sentence it lives in, all shown plainly,
         because meeting a word without ever seeing it used is exactly the
         gap this phase exists to close. Letters, matras and conjuncts keep
         the glyph-on-a-plate card below: they have no sentence to show. */
      var ikey = q.spec && q.spec.key;
      if (ikey && ikey.indexOf('word:') === 0 && window.IND_PACKS[quiz.packId] &&
          lexWord(window.IND_PACKS[quiz.packId], ikey.slice(5))) {
        return '<div class="card introcard wordintro">' + arcStrip() +
          '<div class="mono">A new word</div>' +
          wordCard(quiz.packId, ikey.slice(5), { flat: true }) +
          '<button class="btn lg block" style="margin-top:16px" data-act="gotit">Got it →</button>' +
          '<p class="tiny muted" style="margin-top:10px">You’ll meet it again in a moment.</p></div>';
      }
      var isent = q.char ? exampleSentence(q.char) : null;
      return '<div class="card introcard' + (q.small ? ' smallglyph' : '') + '">' +
        arcStrip() +
        '<div class="mono">Something new</div>' +
        /* the glyph sits on its own soft plate — the one thing on the card */
        '<div class="introplate"><div class="bigglyph deva">' + esc(q.char || '') + '</div></div>' +
        (q.sub ? '<p class="introsub">' + esc(q.sub) + '</p>' : '') +
        (q.en ? '<p class="introen">' + esc(q.en) + '</p>' : '') +
        (isent ? '<p class="tiny" style="margin:4px 0 10px"><span class="deva">' + esc(isent.s) + '</span><br>' +
          '<span class="muted">' + esc(isent.roman) + ' — ' + esc(isent.en) + '</span></p>' : '') +
        hear +
        '<button class="btn lg block" data-act="gotit">Got it →</button>' +
        '<p class="tiny muted" style="margin-top:10px">You’ll meet it again in a moment.</p></div>';
    }

    /* --- trace (stage 7): the Likhna canvas, mounted after render --- */
    if (q.type === 'trace') {
      var inner = window.IND_LIKHNA
        ? window.IND_LIKHNA.render(q.letter)
        : '<p class="muted">The tracing tool did not load.</p>';
      return '<div class="card">' + arcStrip() +
        '<h3 style="margin-bottom:4px">Likhna — trace <span class="deva">' + esc(q.letter.char) + '</span></h3>' +
        '<p class="tiny muted" style="margin-top:0">“' + esc(q.letter.name) + '”</p>' +
        inner + qfb + meta + '</div>';
    }

    /* --- PHASE B: produce — write the word, from an empty box ---------------
       The fourth interaction family. Everything else on this ladder is choose
       or arrange-what-you-were-given; this one asks the child to make the word
       themselves, which is the skill a heritage learner is actually missing.

       The keypad is this SCRIPT'S OWN consonants and matras, not a system
       keyboard — the abugida model stage 2 teaches (a consonant, then a sign
       hung on it) IS the input method, so typing is practice. A system IME
       would hide exactly the structure we are trying to teach.

       LEAK RULE, same as everywhere: the word is never on screen. The child
       gets the meaning, the romanisation and the sound. */
    if (q.kind === 'produce') {
      var typed = quiz.typed || '';
      var pk = q.keys || {};
      var keyRow = function (list, cls, lbl) {
        return '<div class="pkrow ' + cls + '" role="group" aria-label="' + lbl + '">' +
          (list || []).map(function (c) {
            return '<button class="pkey deva" data-act="ptype" data-c="' + esc(c) + '"' +
              (quiz.lock ? ' disabled' : '') + '>' + esc(c) + '</button>';
          }).join('') + '</div>';
      };
      return '<div class="card qcard">' + arcStrip() +
        '<h3 style="margin-bottom:2px">Write it</h3>' +
        '<p class="tiny muted" style="margin-top:0">You have heard this one. Now write it.</p>' +
        '<div class="prompthint">“' + esc(q.en || '') + '”<span>' + esc(q.roman || '') + '</span></div>' +
        hear +
        '<div class="pbox deva' + (quiz.reveal ? ' shake' : '') + '" id="pbox" aria-live="polite" ' +
          'aria-label="what you have written">' + (typed ? esc(typed) : '<i class="pcaret"></i>') + '</div>' +
        '<div class="pkeys">' +
          keyRow(pk.vowels, 'pv', 'vowels') +
          keyRow(pk.consonants, 'pc', 'consonants') +
          keyRow((pk.matras || []).concat(pk.virama ? [pk.virama] : []), 'pm', 'vowel signs') +
        '</div>' +
        '<div class="prow">' +
          '<button class="btn ghost sm" data-act="pback"' + (quiz.lock || !typed ? ' disabled' : '') + '>Undo</button>' +
          '<button class="btn sm" data-act="pdone"' + (quiz.lock || !typed ? ' disabled' : '') + '>Check</button>' +
        '</div>' +
        '<p class="tiny muted">Tap the letters, or type on a keyboard. Backspace undoes, Enter checks.</p>' +
        qfb + meta + '</div>';
    }

    /* --- ordered build: tiles into slots, in order --- */
    if (isBuild(q.type)) {
      var b = quiz.build || { placed: [] }, head = '', i, k;
      if (q.type === 'wordBuild') {
        /* LEAK FIX: the old card printed the finished word above the tiles.
           The child now builds it from meaning + sound alone. */
        head = '<h3>Build the word</h3>' + hear +
          '<div class="buildclue"><b>' + esc(q.en || '') + '</b>' +
          (q.roman ? '<span class="muted"> · ' + esc(q.roman) + '</span>' : '') + '</div>';
      } else if (q.type === 'sentenceBuild') {
        head = '<h3>Say it in ' + esc((window.IND_PACKS[quiz.packId] || { name: { en: 'the language' } }).name.en) + '</h3>' +
          '<div class="buildclue"><b>“' + esc(q.prompt || '') + '”</b></div>' +
          '<p class="tiny muted">Put the word tiles in order.</p>';
      } else {  /* conjunctSplit: the conjunct IS the question, so it is shown */
        head = '<h3>' + esc(q.prompt || 'Two letters holding hands — which two, in order?') + '</h3>' +
          '<div class="bigglyph deva">' + esc(q.conjunct || '') + '</div>' +
          (q.word ? '<p class="tiny muted" style="text-align:center">As in <span class="deva">' + esc(q.word) + '</span></p>' : '');
      }
      var slots = '';
      for (k = 0; k < q.answer.length; k++) {
        if (quiz.reveal) {           /* wrong: show the correct arrangement briefly */
          slots += '<span class="slot reveal deva">' + esc(q.answer[k]) + '</span>';
        } else if (k < b.placed.length) {
          slots += '<button class="slot filled deva' + (quiz.lock ? ' good' : '') + '" data-act="bslot" data-i="' + k + '"' +
            (quiz.lock ? ' disabled' : '') + '>' + esc(tileChar(q.tiles[b.placed[k]])) + '</button>';
        } else {
          slots += '<span class="slot' + (k === b.placed.length ? ' next' : '') + '"></span>';
        }
      }
      var tiles = '';
      for (i = 0; i < q.tiles.length; i++) {
        var used = b.placed.indexOf(i) >= 0;
        var focus = b.kb && !used && i === b.kfocus;
        var sub = (q.type === 'conjunctSplit' && q.tiles[i] && q.tiles[i].name)
          ? '<small>' + esc(q.tiles[i].name) + '</small>' : '';
        tiles += '<button class="btile' + (used ? ' used' : '') + (focus ? ' kfocus' : '') + '"' +
          ' data-act="btile" data-i="' + i + '" data-ch="' + esc(tileChar(q.tiles[i])) + '"' +
          (used || quiz.lock ? ' disabled' : '') + ' aria-label="tile ' + esc(tileChar(q.tiles[i])) + '">' +
          '<span class="deva">' + esc(tileChar(q.tiles[i])) + '</span>' + sub + '</button>';
      }
      return '<div class="card">' + arcStrip() + head +
        '<div class="slots' + (quiz.reveal ? ' shake' : '') + '">' + slots + '</div>' +
        '<div class="btiles">' + tiles + '</div>' +
        '<p class="tiny muted">Tap a tile to place it, tap a filled slot to take it back. ' +
        'Keys: ← → choose, Enter place, Backspace undo.</p>' +
        qfb + meta + '</div>';
    }

    /* --- choice questions --- */
    var opts = q.options || q.items || [], prompt = q.prompt || 'Pick the right one';
    var big = '', lead = '', subFor = null, grid = true, optAudio = null;
    switch (q.type) {
      case 'listenPoint':
        prompt = 'Listen — which one is it?'; grid = false;
        subFor = function (o) { return o.en; };
        break;
      case 'soundMatch':
        prompt = q.kind === 'syllable' ? 'Which one makes this sound?' : 'Which letter makes this sound?';
        subFor = null;      /* the roman name IS the answer — never printed before it */
        break;
      case 'matraAttach':
        /* LEAK FIX: the old card printed base + the correct matra as the
           prompt. The target sign now only ever appears among the options. */
        prompt = 'Which sign makes it say “' + esc(q.promptRoman || '') + '”?';
        big = '<div class="bigglyph"><span class="deva">' + esc(q.base) + '</span>' +
          ' <span style="color:var(--accent)">+</span> <span class="qmark">?</span></div>';
        subFor = null;
        break;
      case 'oddOneOut':
        /* q.items, not q.options — the renderer used to look only at options
           and drew zero buttons for this type. After the answer, q.why lands
           in the feedback strip: teach, don't just mark.
           LEAK FIX: the roman name is printed for the family and kind cuts,
           where it names a sound and not the answer — but NEVER for 'length',
           where "aa" beside three "a/u/ri" spells the odd one out in Latin
           before the child has looked at a single letter. */
        prompt = q.prompt || 'Which one does not belong?';
        subFor = q.strategy === 'length' ? null : function (o) { return o.name; };
        /* …and "listen to the length" then has to be listenable: a row of
           numbered speakers in the SAME order as the options, so the sound is
           available without any text naming it. */
        if (q.strategy === 'length') {
          lead = '<div class="hearrow">' + (q.items || []).map(function (o, i) {
            return '<button class="hearone" data-act="say" data-k="' + esc(o.audio || '') +
              '" data-t="' + esc(o.char) + '" data-l="' + esc(packLang()) + '" ' +
              'aria-label="hear sound ' + (i + 1) + '">' + icon('sound', 15) + (i + 1) + '</button>';
          }).join('') + '</div>';
        }
        break;
      case 'barakhadi':
        /* The full row is the teaching context; the question is to FIND the
           asked-for cell in it. */
        prompt = q.prompt || 'Find the one that says “' + esc(q.targetRoman) + '”.';
        lead = '<div class="bkrow" aria-label="the full barakhadi row of ' + esc(q.baseName) + '">' +
          q.cells.map(function (c) { return '<span class="bkcell deva">' + esc(c.syllable) + '</span>'; }).join('') +
          '</div><p class="tiny muted">The whole row of <span class="deva">' + esc(q.base) + '</span> — find the sound in it.</p>';
        subFor = null;
        break;
      case 'pickReply':
        prompt = 'What would you say back?'; grid = false;
        lead = (q.sceneEn || q.scene ? '<span class="scenechip">' + esc(q.sceneEn || String(q.scene).replace(/-/g, ' ')) + '</span>' : '') +
          '<div class="speech saidtoyou"><span class="who">' + (q.who === 'child' ? 'Your friend' : 'They say') + '</span>' +
          '<span class="deva" style="font-size:20px">' + esc(q.prompt) + '</span>' +
          (q.promptRoman ? '<span class="muted tiny" style="display:block;margin-top:2px">' + esc(q.promptRoman) + '</span>' : '') +
          '</div>';
        subFor = function (o) { return o.roman; };   /* roman, not en — the gloss comes after the answer */
        /* Each option gets its own listen button when a clip exists — in the
           ordinary manifest OR the human one. The first version gated on the
           human manifest alone, which is empty until a person records, so all
           360 dialogue clips sat on disk while a four-year-old faced three
           lines they could not read OR hear. The button appears only when a
           clip is real, which keeps the affordance honest. */
        optAudio = function (o) {
          return (o.audio && (hasVoice(o.audio) ||
            (window.IND_VOICE_HUMAN && window.IND_VOICE_HUMAN[o.audio]))) ? o.audio : null;
        };
        break;
      case 'readPassage':
        prompt = q.prompt || 'Read it. What is it about?'; grid = false;
        /* A passage drawn from a story arrives with its own narration — the same
           Hindi in the same voice the child heard in the story. Offer it, but
           only when a clip really exists: the twelve authored passages have
           none, and a dead button teaches a child not to trust buttons. */
        lead = '<div class="passage deva">' + esc(q.hi) + '</div>' +
          (q.audio ? '<button class="btn ghost sm" style="margin:8px 0 2px" data-act="say" data-k="' +
            esc(q.audio) + '" data-l="hi-IN">' + icon('sound', 16) + ' Hear it read</button>' : '');
        subFor = null;
        break;
      /* --- fill the blank (Phase 3) ---
         The sentence with a real hole in it, what the whole sentence means
         under it, and a voice that reads AROUND the hole. Three things are
         deliberately absent before the answer: the word, the sentence's
         romanisation (it would spell the answer in Latin), and any clip of
         the sentence (every clip of it contains the word). The options carry
         roman, not English — the same line pickReply draws: the gloss is the
         reward for answering, not the way to answer. */
      case 'sentenceBlank':
        prompt = q.prompt || 'Which word fills the gap?'; grid = false;
        lead = '<div class="blanksent deva" lang="' + esc(quiz.packId || 'hi') + '">' + esc(q.before) +
          '<span class="wcgap" role="img" aria-label="the missing word"></span>' + esc(q.after) + '</div>' +
          '<p class="blankmean">“' + esc(q.en || '') + '”</p>' +
          '<button class="btn ghost sm blankhear" data-act="saymask" data-b="' + esc(q.before) +
          '" data-a="' + esc(q.after) + '" data-l="' + esc(packLang()) + '">' +
          icon('sound', 16) + ' Hear it round the gap</button>';
        subFor = function (o) { return o.roman; };
        break;
    }
    var choices = opts.map(function (o, i) {
      var l = esc(optLabel(o)), s = subFor ? esc(subFor(o) || '') : '';
      var ak = optAudio ? optAudio(o) : null;
      /* the listen button sits OUTSIDE the answer button — nesting one button in
         another is invalid and makes the whole option unclickable on iOS */
      var ear = ak
        ? '<button class="optear" data-act="say" data-k="' + esc(ak) + '" data-l="' + esc(packLang()) +
          '" aria-label="hear this choice">' + icon('sound', 15) + '</button>'
        : '';
      var btn = grid
        ? '<button class="glyph" data-act="ans" data-i="' + i + '">' + l + (s ? '<small>' + s + '</small>' : '') + '</button>'
        : '<button class="opt" data-act="ans" data-i="' + i + '"><span class="deva" style="font-size:22px">' + l + '</span>' +
          (s ? ' <span class="muted tiny">' + s + '</span>' : '') + '</button>';
      return ear ? '<div class="optrow">' + btn + ear + '</div>' : btn;
    }).join('');
    return '<div class="card">' + arcStrip() + '<h3>' + prompt + '</h3>' + lead + big + hear +
      (grid ? '<div class="gridscript">' + choices + '</div>' : choices) +
      qfb + meta + '</div>';
  };

  /* ------------------------------------------------------------------ MELA */
  /* The fairground shelf, in the Bizzing Bee arcade idiom: a loud gradient
     cover per stall with a self-animating scene, a tag chip, the facts
     underneath. New games carry their own cover data (tag/c/c2/scene) on the
     registry entry; the founding four predate that contract and are dressed
     here. Grouping is presentation, not data — a game the groups don't know
     still shows up under More stalls, so nothing ever silently vanishes. */
  var MELA_DRESS = {
    rangoli:   { tag: 'Memory', c: '#E8458C', c2: '#B82C67' },
    statehunt: { tag: 'Naksha', c: '#13A892', c2: '#0E8A78' },
    festival:  { tag: 'Utsav',  c: '#E8A33D', c2: '#C8891B' },
    jataka:    { tag: 'Katha',  c: '#7B52E0', c2: '#5E39C4' }
  };
  var MELA_GROUPS = [
    ['Aangan ke khel', 'From India’s own courtyard — these were being played centuries before there were screens to play them on.', ['saapsidi', 'ludo', 'carrom']],
    ['Quiz shows', 'Ladders, lifelines, streaks — the hot seat is yours.', ['gyanpati', 'triviamaster']],
    ['Drills in costume', 'Secretly practice. Openly a fair.', ['shabd', 'rangoli', 'statehunt', 'festival', 'jataka']]
  ];
  V.mela = function () {
    var G = window.IND_GAMES || [];
    if (!G.length) return '<div class="card"><h1>The Mela</h1><p>The games have not loaded.</p></div>';
    var byId = {}, used = {};
    G.forEach(function (g) { byId[g.id] = g; });
    function cover(g) {
      var d = MELA_DRESS[g.id] || {};
      var c = g.c || d.c || 'var(--accent)', c2 = g.c2 || d.c2 || c;
      var tag = g.tag || d.tag || '';
      return '<button class="gcover" data-act="game" data-id="' + g.id + '">' +
        /* A FULL-BLEED ILLUSTRATED COVER where one exists (game-art.js): the board, the
           dice, the letter rack, the wheel. Every stall used to be the same gradient with
           a 64px line glyph floating in it, which tells a child nothing about which game
           is which. A game with no illustration still falls back to its old glyph. */
        '<span class="gart' + (window.IND_GAME_ART && window.IND_GAME_ART[g.id] ? ' art' : '') +
          '" style="background:linear-gradient(135deg,' + c + ',' + c2 + ')">' +
          ((window.IND_GAME_ART && window.IND_GAME_ART[g.id]) || g.scene || icon(g.icon || 'star', 46)) +
          (tag ? '<span class="gtag">' + esc(tag) + '</span>' : '') + '</span>' +
        '<span class="gbody"><b>' + esc(g.name) + '</b>' +
        '<span class="tiny muted">' + esc(g.blurb || '') + '</span>' +
        '<span class="mono">' + (g.minutes || 2) + ' min</span></span></button>';
    }
    /* nomenclature rule: the tab's word is the pillar's name; the Mela keeps its
       proper name as the subtitle, the way the river does under Itihaas */
    var out = '<div class="card"><h1 style="margin:0">Khel</h1>' +
      '<div class="mono">The Mela — the fairground</div>' +
      '<p style="margin:10px 0 0">Some stalls are as old as ' +
      'India, some are drills wearing a costume — every one plays with fingers and with keys.</p></div>';
    /* THE HERO STALL. Sabhyata is the fair's big wheel — it gets the top of the
       page as a full-width living banner: the Kashi diorama with drifting mist,
       a cart crossing, an explorer waiting, lamps breathing. One tap plays. */
    if (byId.sabhyata) {
      used.sabhyata = 1;
      out += '<button class="ghero" data-act="game" data-id="sabhyata"' +
        ' aria-label="Play Sabhyata — grow the first cities of India">' +
        '<img class="gh-bg" src="art/sabhyata/dio/kashi.jpg" alt="">' +
        '<span class="gh-mist m1"></span><span class="gh-mist m2"></span>' +
        '<span class="gh-lamp l1"></span><span class="gh-lamp l2"></span><span class="gh-lamp l3"></span>' +
        '<img class="gh-cart" src="art/sabhyata/sp/cart.png" alt="">' +
        '<img class="gh-walk" src="art/sabhyata/sp/explorer.png" alt="">' +
        '<span class="gh-body"><span class="gh-kicker">The hero game · Civilization</span>' +
        '<b>Sabhyata</b>' +
        '<span class="gh-blurb">Grow the first cities, light five thousand years of India lamp ' +
        'by lamp — and hold back the Forgetting. Nothing is conquered here; everything is reached.</span>' +
        '<span class="gh-cta">' + icon('play', 17) + ' Play — ' +
        (byId.sabhyata.minutes || 12) + ' min</span></span></button>';
    }
    MELA_GROUPS.forEach(function (grp) {
      var list = grp[2].map(function (id) { used[id] = 1; return byId[id]; }).filter(Boolean);
      if (!list.length) return;
      out += '<h3 style="margin:26px 0 4px">' + grp[0] + '</h3>' +
        '<p class="tiny muted" style="margin:0 0 12px">' + grp[1] + '</p>' +
        '<div class="grid g3 gshelf">' + list.map(cover).join('') + '</div>';
    });
    var rest = G.filter(function (g) { return !used[g.id]; });
    if (rest.length) out += '<h3 style="margin:26px 0 12px">More stalls</h3>' +
      '<div class="grid g3 gshelf">' + rest.map(cover).join('') + '</div>';
    return out;
  };
  V.game = function () {
    return '<button class="backlink" data-act="go" data-v="mela">' + icon('back', 18) + ' Mela</button>' +
      '<div class="card"><div id="gamehost"></div></div>';
  };

  /* -------------------------------------------------------------------- ME */
  /* ------------------------------------------------------- THE PITARA (shop)
     Everything a child does not have yet, in the one place they will look for it: the
     settings page, under their own collection. It used to be nowhere. The deck showed
     all 142 cards whether owned or not, which made the collection a list of absences;
     the fix was to show only owned cards there -- and that left the other 105 with no
     home at all. This is that home.

     THREE THINGS THIS SCREEN HAS TO GET RIGHT:

     1. LOCKED LOOKS LOCKED, AND SAYS WHAT IT COSTS. A greyed card with no price is a
        dead end. A greyed card with "🪙 40" is a reason to go and finish a story.
     2. SHELVES, NOT A WALL. Twelve packs in a row read as arbitrary. Three shelves --
        the sacred, the real, the tales -- say why each pack is where it is.
     3. THE SACRED SHELF IS NOT A SHOP. It carries no price, no draw button and no
        progress bar, because none of it is for sale (economy.js rule 2). It is on this
        page only so a child can see their whole collection in one place. */
  function packShop(packs) {
    var E = window.IND_ECONOMY;
    var shelves = (E && E.SHELVES) || [{ id: 'tales', name: 'Who travels with you', note: '' }];

    function packBlock(p) {
      var open = !E || E.packOpen(S, p.id);
      var price = E ? E.packPrice(p.id) : null;
      var held = E ? E.packHeld(S, p.id) : p.ids.length;
      var total = p.ids.length;
      var sale = price != null;                    /* sacred/epic packs are never for sale */

      return '<div class="packblk' + (open ? '' : ' locked') + '">' +
        '<div class="spread packhead"><b>' + esc(p.name) + '</b>' +
        '<span class="row" style="gap:6px">' +
        '<span class="tiny muted">' + held + ' of ' + total + '</span>' +
        (sale && !open ? '<span class="badge price">🪙 ' + price + '</span>' : '') + '</span>' +
        '</div>' +
        '<p class="tiny muted" style="margin:2px 0 8px">' + esc(p.note) + '</p>' +
        (sale
          ? '<div class="packbar"><i style="width:' +
            Math.round(held / Math.max(1, total) * 100) + '%"></i></div>'
          : '') +
        '<div class="grid g4">' + p.ids.map(function (id) {
          if (!E || E.avatarOpen(S, id)) return chip(id, 74, 'avcard');
          /* NOT MET YET. The name stays -- a silhouette with no name is a mystery box,
             and a mystery box is the bit of a gacha that is actually indefensible.
             Tapping it opens that pack's pitara, so the want and the way to it are the
             same tap. */
          return '<button class="avchip unmet" data-act="draw" data-p="' + esc(p.id) + '"' +
            ' aria-label="' + esc(avatarName(id) || id) + ' — not met yet">' +
            art(id, 74) + '<span>' + esc(avatarName(id) || id) + '</span>' +
            '<span class="rarlabel">🪙 ' + (E ? E.DRAW_PRICE : 40) + '</span></button>';
        }).join('') + '</div>' +
        (sale && held < total
          ? '<div class="row" style="margin-top:10px">' +
            '<button class="pill" data-act="draw" data-p="' + esc(p.id) + '">' +
            'Open the pitara — 🪙 ' + (E ? E.DRAW_PRICE : 40) + '</button>' +
            (open ? '' : '<button class="pill" data-act="buypack" data-p="' + esc(p.id) + '">' +
              'Take all ' + total + ' — 🪙 ' + price + '</button>') + '</div>'
          : '') +
        '</div>';
    }

    return shelves.map(function (sh) {
      var mine = packs.filter(function (p) {
        return (E ? E.shelfOf(p.id) : 'tales') === sh.id;
      });
      if (!mine.length) return '';
      return '<div class="card"><h3 style="margin:0">' + esc(sh.name) + '</h3>' +
        (sh.note ? '<p class="tiny muted" style="margin:6px 0 0">' + esc(sh.note) + '</p>' : '') +
        mine.map(packBlock).join('') + '</div>';
    }).join('') +
      /* The rate, in writing, once — not buried in a card a child has to find. */
      '<div class="card flat tiny"><b>How the pitara works.</b> A draw costs 🪙 ' +
      (E ? E.DRAW_PRICE : 40) + ' and always gives you someone you have <b>not</b> met, so a ' +
      'draw is never wasted and you never get the same card twice. A whole pack costs 🪙 ' +
      (E ? E.PACK_UNIT : 20) + ' a card, so a small pack costs less than a big one. ' +
      'Sikke are earned by reading, playing and practising — they can never be bought with ' +
      'money, and nothing on this page is a real-money purchase.</div>';
  }

  /* ------------------------------------------------- TAKE IT OFFLINE (dl UI)
     The Grown-ups' download shelf, over the seams built for it: IND_PACKS_DL
     (what exists and what it weighs), IND_DL (the cache loop), IND_ENT (the
     gate). Cache API statuses come back asynchronously, so rows render from a
     small last-known cache (DLC) and a refresh pass corrects it once the DOM
     is in — at most one extra render, then it is settled. Progress during a
     download patches the row's counter in place; a full render every ten
     files would fight the reader's scroll. */
  var DLC = {};                       /* packId -> {have,total,done} last known */

  /* copy-to-clipboard for browsers without navigator.clipboard (older WebViews) */
  function fallbackCopy(txt) {
    try {
      var ta = document.createElement('textarea');
      ta.value = txt;
      ta.style.cssText = 'position:fixed;left:-999px;top:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
  }

  function dlRefresh() {
    var DL = window.IND_DL, packs = window.IND_PACKS_DL || {};
    if (!DL || !DL.supported()) return;
    var ids = Object.keys(packs), left = ids.length, dirty = false;
    if (!left) return;
    ids.forEach(function (id) {
      DL.status(id, function (st) {
        var old = DLC[id] || {};
        if (old.have !== st.have || !!old.done !== !!st.done) dirty = true;
        DLC[id] = st;
        if (--left === 0 && dirty && view.name === 'me') render();
      });
    });
  }

  function dlRows() {
    var DL = window.IND_DL, packs = window.IND_PACKS_DL || {};
    if (!DL || !DL.supported() || !Object.keys(packs).length) {
      return '<p class="tiny muted" style="margin:6px 0 0">This browser cannot keep the app’s ' +
        'sound on the device. Everything still plays while you are online.</p>';
    }
    setTimeout(dlRefresh, 60);        /* correct the rows once this render is in the DOM */
    var ent = window.IND_ENT, groups = {};
    Object.keys(packs).forEach(function (id) {
      var g = packs[id].group || 'Packs';
      (groups[g] = groups[g] || []).push(id);
    });
    return '<p class="tiny muted" style="margin:6px 0 0">Downloads live on this device, so ' +
      'stories and lessons play on the plane, in the car, and anywhere the internet isn’t. ' +
      'Anything already heard online is kept automatically.</p>' +
      Object.keys(groups).map(function (g) {
        return '<h5 class="tiny muted" style="margin:10px 0 2px;text-transform:uppercase;letter-spacing:.04em">' +
          esc(g) + '</h5>' +
          groups[g].map(function (id) {
            var p = packs[id], st = DLC[id] || {}, act = DL.active(id);
            var open = !ent || ent.canDownload(id), right;
            if (act) {
              right = '<span class="tiny mono" id="dlp-' + esc(id) + '">' + act.done + ' / ' + act.total + '</span>' +
                '<button class="pill" data-act="dlcancel" data-id="' + esc(id) + '">Stop</button>';
            } else if (st.done) {
              right = '<span class="tiny" style="font-weight:700">On this device ✓</span>' +
                '<button class="pill" data-act="dlrm" data-id="' + esc(id) + '">Remove</button>';
            } else if (!open) {
              right = '<button class="pill" data-act="dl" data-id="' + esc(id) + '">🔒 Needs the Pass</button>';
            } else {
              right = (st.have ? '<span class="tiny mono">' + st.have + ' of ' + st.total + '</span>' : '') +
                '<button class="pill" data-act="dl" data-id="' + esc(id) + '">' +
                (st.have ? 'Finish' : 'Download') + '</button>';
            }
            return '<div class="spread" style="gap:8px;margin:4px 0;align-items:center">' +
              '<span class="tiny">' + esc(p.name) +
              ' <span class="muted mono" style="white-space:nowrap">' + p.mb + ' MB</span></span>' +
              '<span class="row" style="gap:6px;flex-wrap:nowrap">' + right + '</span></div>';
          }).join('');
      }).join('');
  }

  function passCard() {
    var ent = window.IND_ENT;
    if (!ent) return '';
    if (ent.hasPass()) {
      return '<p class="tiny" style="margin:6px 0 0"><b>' + esc(ent.planName() || 'Pass') +
        '</b> is on for this device — every pack above is open.</p>' +
        '<div class="row" style="margin-top:6px">' +
        '<button class="pill" data-act="passclear">Switch it off on this device</button></div>';
    }
    /* honest copy: no payment exists yet, and the demo code is handed out by a
       person, never printed here. The real check is server-side (CLAUDE.md). */
    return '<p class="tiny muted" style="margin:6px 0 0">Reading, playing and streaming are free. ' +
      'The Parivaar Pass opens the offline packs above. Payments are still being built — ' +
      'if you have a family code, it works today.</p>' +
      '<div class="row" style="margin-top:6px">' +
      '<input id="passcode" class="opt" autocomplete="off" autocapitalize="characters" ' +
      'placeholder="Family code" style="max-width:170px;margin:0">' +
      '<button class="pill" data-act="passredeem">Use the code</button></div>';
  }

  function diagCard() {
    var DG = window.IND_DIAG;
    if (!DG) return '';
    var n = DG.list().length;
    return '<p class="tiny muted" style="margin:6px 0 0">' +
      (n ? n + ' note' + (n === 1 ? '' : 's') + ' recorded on this device — nothing is sent anywhere.'
         : 'Nothing has gone wrong on this device.') +
      ' If something misbehaves, copy the report and send it to us with the build number below.</p>' +
      '<div class="row" style="margin-top:6px">' +
      '<button class="pill" data-act="diagcopy">Copy the report</button>' +
      (n ? '<button class="pill" data-act="diagclear">Clear it</button>' : '') + '</div>';
  }

  V.me = function () {
    var packs = window.IND_AVATAR_PACKS || [];
    return '<div class="card"><div class="row" style="flex-wrap:nowrap">' + art(S.buddy, 92) +
      '<div><h1 style="margin:0">' + esc(S.name || 'Yatri') + '</h1>' +
      '<div class="row" style="margin-top:8px">' +
      '<span class="pill stat">🪙 ' + S.sikke + '</span>' +
      '<span class="pill stat">' + esc(rank()) + '</span>' +
      '<span class="pill stat">' + Object.keys(S.lit).length + ' places</span>' +
      '<span class="pill stat">' + Object.keys(S.read).length + ' stories</span></div></div></div></div>' +
      /* Worlds comes BEFORE the companions and shows the worlds themselves. It
         used to be a one-line tile below a wall of 116 avatars, which is where
         a setting goes to be never found. Picking one is a two-tap job now. */
      (function () {
        var list = worldList(), here = null;
        list.forEach(function (w) { if (w.id === S.world) here = w; });
        return '<div class="card"><div class="spread"><h3 style="margin:0">Worlds</h3>' +
          '<button class="pill" data-act="go" data-v="worlds">All ' + list.length + '</button></div>' +
          '<p class="tiny muted" style="margin:6px 0 0">Repaint the whole app in a real Indian ' +
          'folk-art tradition. Now: <b>' + esc(here ? here.name : S.world) + '</b>' +
          (here ? ' — ' + esc(here.region) : '') + '.</p>' +
          /* LOCKED WORLDS LOOK LOCKED. This grid used to hand every tile the `world`
             action whether or not the child owned it, so a locked world silently did
             nothing when tapped -- the one thing a four-year-old reads as "broken app".
             Now it dims, wears its price, and tapping it buys it. */
          '<div class="grid g2" style="margin-top:12px">' + list.map(function (w) {
            var E = window.IND_ECONOMY;
            var open = !E || E.worldOpen(S, w.id);
            var price = E ? E.worldPrice(w.id) : 0;
            return '<button class="tile' + (S.world === w.id ? ' on' : '') + (open ? '' : ' locked') +
              '" data-act="' + (open ? 'world' : 'buyworld') + '" data-w="' + w.id + '">' +
              (w.tile
                ? '<div class="wpreview live" data-world="' + w.id + '">' + w.tile + '</div>'
                : '<div class="wpreview" data-world="' + w.id + '">' +
                  '<b style="background:var(--accent)"></b>' +
                  '<b style="background:var(--accent2);width:24px;height:24px"></b>' +
                  '<b style="background:var(--accent3);width:19px;height:19px"></b>' +
                  '<span class="aa">आ Aa</span></div>') +
              '<div class="spread"><h3 style="margin:0">' + esc(w.name) + '</h3>' +
              (S.world === w.id ? '<span class="badge aaj">on</span>'
                : (open ? '<span class="badge">alive</span>'
                        : '<span class="badge price">🪙 ' + price + '</span>')) + '</div>' +
              '<div class="mono">' + esc(w.region) + '</div>' +
              (open ? '' : '<p class="tiny" style="margin:6px 0 0;color:var(--accent);font-weight:700">' +
                (E && E.canAfford(S, price) ? 'Tap to open it'
                                            : (price - (S.sikke || 0)) + ' more sikke') + '</p>') +
              '</button>';
          }).join('') + '</div></div>' +
      packShop(packs);
      })() +
      '<div class="card"><h3>Grown-ups</h3><div class="row">' +
      '<button class="pill' + (soundOn ? ' on' : '') + '" data-act="sound">' + icon('sound', 18) + ' Sound</button>' +
      '<button class="pill' + (night ? ' on' : '') + '" data-act="night">' +
      icon(night ? 'sun' : 'moon', 18) + ' Night mode</button>' +
      /* Only worth offering once a human has actually recorded both — before
         that there is one synthesised voice and a switch would be a lie. */
      (function () {
        var H = window.IND_VOICE_HUMAN || {}, k, both = false;
        for (k in H) { if (H[k] && H[k].v && H[k].v.length > 1) { both = true; break; } }
        return both
          ? '<button class="pill' + (S.voice === 'm' ? ' on' : '') + '" data-act="voice">' +
            icon('sound', 18) + ' ' + (S.voice === 'm' ? 'Man’s voice' : 'Woman’s voice') + '</button>'
          : '';
      })() +
      '<button class="pill" data-act="reset">Start again</button></div>' +
      '<h4 class="setlbl">Reading speed</h4>' +
      '<div class="row seg" role="group" aria-label="Reading speed">' +
      [[0.7, 'Slower'], [0.85, 'Slow'], [1, 'Normal']].map(function (r) {
        return '<button class="pill' + (speakRate() === r[0] ? ' on' : '') +
          '" data-act="rate" data-r="' + r[0] + '"' +
          ' aria-pressed="' + (speakRate() === r[0] ? 'true' : 'false') + '">' + r[1] + '</button>';
      }).join('') + '</div>' +
      '<p class="tiny muted" style="margin:8px 0 0">Slows every voice in the app — stories, ' +
      'words and the Hindi lessons. The words stay the same pitch, just slower.</p>' +
      /* THE DEVELOPER UNLOCK. Sits at the bottom of the grown-ups' page, says plainly what
         it does, and is loud while it is on so nobody ships a screenshot of a "finished"
         collection that was actually a test switch. It opens the SIKKE economy only —
         worlds and avatar packs. It cannot and must not open a paid entitlement, which is
         server-side by rule (CLAUDE.md). */
      '<h4 class="setlbl">Developer unlock</h4>' +
      '<div class="row"><button class="pill' + (S.dev ? ' on' : '') + '" data-act="devmode"' +
      ' aria-pressed="' + (S.dev ? 'true' : 'false') + '">' +
      (S.dev ? 'ON — everything is open' : 'Off') + '</button></div>' +
      '<p class="tiny muted" style="margin:8px 0 0">For testing. Opens every world and every ' +
      'avatar pack and stops sikke being spent, so you can walk the whole app without ' +
      'grinding for it. Nothing is bought and nothing is lost — turn it off and your real ' +
      'sikke and your real collection are exactly as you left them.</p>' +
      '<h4 class="setlbl">Take it offline</h4>' + dlRows() +
      '<h4 class="setlbl">Parivaar Pass</h4>' + passCard() +
      '<h4 class="setlbl">If something breaks</h4>' + diagCard() +
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
  /* The story pillar's tab wears the family's own word for a grandparent — a
     Tamil child taps Paati-Thaatha, a Bengali child Dida-Dadu. The label is
     resolved in chrome() rather than baked in here, because the tongue can be
     changed at any time and this array is built once at load. */
  var TABS = [['home', 'Home', 'chart'], ['stories', 'Stories', 'tree'], ['map', 'India', 'map'],
              ['itihaas', 'Itihaas', 'clock'], ['neeti', 'Neeti', 'star'], ['bhasha', 'Bhasha', 'script'],
              ['khel', 'Khel', 'game']];

  /* ------------------------------------------------------------- THE DECK */
  /* Tapping your companion opens the whole deck as a popup — the Bee's move.
     Every card is here, grouped by pack, each in its glow-in-the-dark finish;
     tapping one opens its full card, and the card is where you choose to
     travel with them. Escape or the scrim closes it. */
  var deckOpen = false;
  var deckAt = 0;

  /* Every pack's ids laid end to end, each remembering the pack it came from —
     the order the arrows walk and the order the pills jump into. */
  /* THE DECK IS WHAT YOU HAVE, and nothing else. It used to hold all 142 cards whether or
     not the child had met them, which is why it needed a pack selector across the top to
     get anywhere -- and why it opened on "37 of 142", a number whose main job was to tell
     a seven-year-old about the 105 things they do not have.

     A collection is the cards in it. The ones still to meet live in the shop, where
     wanting them is the point; here, every card you turn to is yours. */
  function deckFlat() {
    var E = window.IND_ECONOMY, out = [];
    (window.IND_AVATAR_PACKS || []).forEach(function (p) {
      (p.ids || []).forEach(function (id) {
        if (E && !E.avatarOpen(S, id)) return;
        out.push({ id: id, packId: p.id, packName: p.name });
      });
    });
    return out;
  }
  function deckIndexOf(id) {
    var f = deckFlat(), i;
    for (i = 0; i < f.length; i++) if (f[i].id === id) return i;
    return 0;
  }

  function deckModal() {
    if (!deckOpen) return '';
    var packs = window.IND_AVATAR_PACKS || [];
    var flat = deckFlat();
    if (!flat.length) return '';
    if (deckAt < 0) deckAt = flat.length - 1;
    if (deckAt >= flat.length) deckAt = 0;
    var here = flat[deckAt];

    /* ONE CARD AT A TIME, stepped — the Bizzing Bee grammar, which the fanned
       run of small cards was not. A child reads a whole card, then flicks to
       the next. Arrows, arrow keys and a swipe all do the same thing, and the
       run wraps at both ends so you can never step into a dead end. */
    return '<div class="deckscrim" data-act="deckclose">' +
      '<div class="deckwrap" role="dialog" aria-modal="true" aria-label="Your companions">' +
        '<div class="deckhead">' +
          '<div class="tiny muted">' + (deckAt + 1) + ' of ' + flat.length + ' · ' +
          esc(here.packName) + '</div>' +
          '<button class="iconbtn" data-act="deckclose" aria-label="Close">✕</button></div>' +

        /* NO PACK SELECTOR. It existed to navigate 142 cards, most of which the child did
           not own; a deck of only their own cards is short enough to flick through, and
           the pack name is already on the line above. One fewer control on a screen a
           four-year-old uses. */

        '<div class="deckstage">' +
          '<button class="deckarrow prev" data-act="deckstep" data-d="-1" aria-label="Previous card">' +
          icon('back', 24) + '</button>' +
          '<div class="avslot" id="avslot">' +
            /* A LOCKED CARD SHOWS WHAT IT IS AND WHAT IT COSTS — never a blank grey box.
               A child has to be able to want it. The published drop rate is on the card
               too: an undisclosed rate is the part of a draw that is actually
               indefensible, and this way a parent can read it before a coin is spent. */
            ((window.IND_ECONOMY && !window.IND_ECONOMY.avatarOpen(S, here.id))
              ? (function () {
                  var E = window.IND_ECONOMY;
                  var left = E.unheld(S, here.packId).length;
                  var pp = E.packPrice(here.packId);
                  return '<div class="avlocked">' +
                    '<div class="avlockart">' + art(here.id, 96) + '</div>' +
                    '<h3 style="margin:10px 0 2px">' + esc(avatarName(here.id) || 'Not met yet') + '</h3>' +
                    '<p class="tiny muted" style="margin:0 0 12px">You have not met this one yet · ' +
                      'drop rate ' + E.dropRate(here.packId, here.id) + '% · ' + left + ' left in this pitara</p>' +
                    '<button class="btn sm" data-act="draw" data-p="' + esc(here.packId) + '">' +
                      'Open the pitara — 🪙 ' + E.DRAW_PRICE + '</button>' +
                    (pp == null ? '' :
                      '<button class="pill" style="margin-top:8px" data-act="buypack" data-p="' +
                      esc(here.packId) + '">Take the whole pack — 🪙 ' + pp + '</button>') +
                    '<p class="tiny muted" style="margin:10px 0 0">A draw never gives you one you ' +
                      'already have, so nothing is ever wasted.</p>' +
                    '</div>';
                })()
              : avCardHTML(here.id)) + '</div>' +
          '<button class="deckarrow next" data-act="deckstep" data-d="1" aria-label="Next card">' +
          icon('back', 24) + '</button>' +
        '</div>' +
      '</div></div>';
  }

  function chrome() {
    return '<header class="topbar"><div class="barrow">' +
      /* the mark is the peacock, not a mascot — Gattu still narrates, he just
         doesn't have to BE the logo (and the user said as much) */
      /* the whole lockup — peacock and wordmark — is the way home */
      '<button class="brand" data-act="go" data-v="home" aria-label="Bizzing India — home">' +
      (window.IND_ART_IMG && window.IND_ART_IMG.indexOf('logo') >= 0
        ? '<img src="art/logo.png" alt="" width="68" height="68">'
        : '') + 'Bizzing <em>India</em></button>' +
      /* THE WORLD'S FRIEZE. Not a badge and not a button: a wide, shallow band of this
         world's own imagery filling the space between the wordmark and the controls,
         fading out at both ends so it belongs to the bar rather than sitting on it.
         It was a small square icon first, which was wrong twice -- one more clickable
         thing competing with seven real controls, and one object on a plate is a
         sticker, not design. Purely decorative: aria-hidden, pointer-events:none. */
      (window.IND_WORLDS && window.IND_WORLDS.frieze
        ? '<span class="worldfrieze" id="worldfrieze">' + window.IND_WORLDS.frieze(S.world) + '</span>'
        : '') +
      /* One group, so when the bar is too narrow the WHOLE set of controls drops
         to the next line together. Loose in the row, the wordmark would push
         them over the edge one at a time and strand sound on a line by itself. */
      '<span class="barctl">' +
      '<span class="pill stat" title="Sikke — earned, never bought">🪙 <span id="kauriCount">' + S.sikke + '</span></span>' +
      /* the family-language chip: shows the tongue in its own script, opens the picker */
      (window.IND_TONGUE
        ? '<button class="pill stat" data-act="go" data-v="tongue" aria-label="Your family’s language">' +
          (tongue() ? '<span lang="' + tongue().lang + '">' + esc(tongue().native) + '</span>' : icon('script', 16)) +
          '</button>'
        : '') +
      /* READ IN HINDI. It sits beside the family-language chip because it is the
         same kind of decision — what language this child is reading in — and it
         is one tap from anywhere rather than buried per story.

         Deliberately global with per-story content: a story that has no Hindi
         simply reads as it always did, so the switch can ship now and the
         translations can arrive one story at a time without ever showing a
         child a half-translated page. */
      '<button class="pill hitoggle' + (S.hindi ? ' on' : '') + '" data-act="hindi"' +
      ' aria-pressed="' + (S.hindi ? 'true' : 'false') + '"' +
      ' aria-label="Read stories in Hindi as well as English">' +
      '<span class="deva" aria-hidden="true">अ</span><span class="hilbl">Hindi</span></button>' +
      '<button class="iconbtn' + (soundOn ? '' : ' off') + '" data-act="sound"' +
      ' aria-pressed="' + (soundOn ? 'true' : 'false') + '" aria-label="Sound">' +
      icon('sound', 20) + '</button>' +
      /* Light/night sits right beside sound: the two things a child changes for
         themselves, in reach without opening settings. The icon shows where the
         tap GOES, not where you are — a moon means "make it night". */
      '<button class="iconbtn" data-act="night" aria-pressed="' + (night ? 'true' : 'false') + '"' +
      ' aria-label="' + (night ? 'Switch to day' : 'Switch to night') + '">' +
      icon(night ? 'sun' : 'moon', 20) + '</button>' +
      /* This chip is the door to You — Worlds, sound, night mode all live behind
         it. It briefly opened the deck instead, which stranded Worlds; the deck
         has its own door on the big buddy on Home. */
      '<button class="iconbtn" data-act="go" data-v="me" aria-label="You and your settings" style="overflow:hidden;padding:0">' +
      art(S.buddy, 40) + '</button>' +
      '</span>' +
      '</div><nav class="nav">' + TABS.map(function (t) {
        var label = t[0] === 'stories' ? kinTerm('nani') + '-' + kinTerm('nana') : t[1];
        return '<button class="navtab" data-act="go" data-v="' + t[0] + '">' + icon(t[2], 19) +
          '<span>' + esc(label) + '</span></button>';
      }).join('') +
      /* phone only (CSS): the bar drops to the bottom of the screen with five
         doors — Home, Stories, Bhasha, Khel and this More — the rest one tap
         behind it. Desktop keeps the full row and never sees this button. */
      '<button class="navtab navmore" data-act="navmore" aria-haspopup="true" aria-label="More">' +
      '<span class="moredots" aria-hidden="true">⋯</span><span>More</span></button>' +
      '</nav></header><main class="wrap" id="main"></main>';
  }

  /* chrome() is built once and then left alone, so the two toggles that live in
     it have to be repainted by hand — otherwise you tap the moon, the whole app
     goes dark, and the moon is still sitting there asking to be tapped. */
  function paintChrome() {
    var s = document.querySelector('.topbar [data-act="sound"]');
    if (s) {
      s.classList.toggle('off', !soundOn);
      s.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    }
    var h = document.querySelector('.topbar [data-act="hindi"]');
    if (h) {
      h.classList.toggle('on', !!S.hindi);
      h.setAttribute('aria-pressed', S.hindi ? 'true' : 'false');
    }
    var n = document.querySelector('.topbar [data-act="night"]');
    if (n) {
      n.innerHTML = icon(night ? 'sun' : 'moon', 20);
      n.setAttribute('aria-pressed', night ? 'true' : 'false');
      n.setAttribute('aria-label', night ? 'Switch to day' : 'Switch to night');
    }
    /* The world's emblem lives in the bar, and the bar is built ONCE — so without this
       the emblem stayed on whichever world the app booted in and never changed again.
       Every screenshot I took of six different worlds showed the Taj. */
    var wm = $('#worldfrieze');
    if (wm && window.IND_WORLDS && window.IND_WORLDS.frieze) {
      wm.innerHTML = window.IND_WORLDS.frieze(S.world);
    }
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
    /* The bar is built ONCE, so anything in it that depends on state has to be repainted
       on every render or it silently freezes at whatever it was when the app booted. The
       world emblem did exactly that: six different worlds, six screenshots, all showing
       the Taj. paintChrome() is not enough on its own -- it is called from a handful of
       toggle handlers, not from render(). */
    paintChrome();

    var m = $('#main'), h;
    switch (view.name) {
      case 'map': h = V.map(); break;
      case 'state': h = V.state(view.arg); break;
      case 'stories': h = V.stories(); break;
      case 'kahani': h = V.kahani(view.arg); break;
      case 'story': h = V.story(view.arg); break;
      case 'bhasha': h = V.bhasha(); break;
      case 'pack': h = V.pack(view.arg); break;
      case 'chart': h = V.chart(view.arg); break;
      case 'vyakaran': h = V.vyakaran(view.arg); break;
      case 'progress': h = V.progress(view.arg); break;
      case 'kosh': h = V.kosh(view.arg); break;
      case 'wordcard': h = V.wordcard(view.arg); break;
      case 'mela': h = V.mela(); break;
      case 'khel': h = V.mela(); break;   /* the games pillar got its own tab; Mela is its page */
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
      case 'avcard': h = V.avcard(view.arg); break;
      case 'me': h = V.me(); break;
      default: h = V.home();
    }
    m.innerHTML = h + deckModal();
    /* Stepping with the arrows walks across pack boundaries, and the pill row is
       a sideways scroller — without this the pill for the pack you are now in
       is off the right edge and the row looks stuck on "Gods & Teachers". */
    if (deckOpen) {
    }
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
                  story: 'stories', pack: 'bhasha', chart: 'bhasha', kosh: 'bhasha', wordcard: 'bhasha',
                  game: 'khel', mela: 'khel', play: 'khel', rishtey: 'khel', rishquiz: 'khel',
                  nani: 'stories', shelf: 'stories', invite: 'stories', kahani: 'stories',
                  value: 'neeti', shlok: 'neeti', verses: 'neeti', epics: 'stories', epic: 'stories', episode: 'stories',
                  worlds: 'me', tongue: 'home', avcard: 'me' };
    var cur = alias[view.name] || view.name;
    Array.prototype.forEach.call(document.querySelectorAll('.navtab'), function (t) {
      t.classList.toggle('active', t.getAttribute('data-v') === cur);
    });
    if (view.name === 'game') mountGame(view.arg);
    placeCallout();

    /* The tracing canvas (stage 7) owns window-level pointer listeners, so it
       gets the same care a game does: torn down on EVERY render — navigation
       included — and remounted only when a trace question is on screen. */
    if (traceOff) { try { traceOff(); } catch (err) {} traceOff = null; }
    if (view.name === 'pack' && quiz.q && quiz.q.type === 'trace' &&
        window.IND_LIKHNA && $('#tInk')) {
      traceOff = window.IND_LIKHNA.mount(quiz.q.letter);
    }
  }

  /* The state callout is anchored to its own state, but it must also stay inside the map.
     Measured once after each render: put it above its dot if there is room, flip it under
     the dot if there is not, and clamp so it never leaves the top of the card. */
  function placeCallout() {
    var c = $('.callout'), w = $('.mapwrap');
    if (!c || !w) return;
    /* Under 560px the bubble is not a bubble — CSS turns it into a sheet in the normal flow
       under the map, because a 300px card anchored to Manipur is unreadable on a 360px
       screen. There is nothing to position there, and setting a top on a static box is how
       you end up debugging a number that never applied. */
    var pos = window.getComputedStyle(c).position;
    if (pos !== 'absolute' && pos !== 'fixed') {
      c.classList.remove('placed');
      c.style.top = c.style.left = '';
      return;
    }
    c.classList.remove('below');
    c.classList.add('placed');
    var wr = w.getBoundingClientRect();
    var cr = c.getBoundingClientRect();
    var card = c.closest('.card');
    var kr = card ? card.getBoundingClientRect() : wr;

    /* The nav bar is FIXED at the bottom on a phone, which means it sits inside
       innerHeight and quietly eats the last 64 pixels of it. Measuring against
       innerHeight instead of against the nav is the mistake that hid the story reader's
       button, and it would hide this bubble the same way. */
    var nav = $('.topbar .nav');
    var navTop = window.innerHeight;
    if (nav) {
      var nr = nav.getBoundingClientRect();
      if (nr.top > window.innerHeight * 0.5) navTop = nr.top;   /* only when it is the bottom bar */
    }

    /* Vertical: above its own dot when there is room, under it when there is not, then
       clamped so the bubble stays inside the card and clear of the nav. */
    var anchorY = wr.top + (parseFloat(c.getAttribute('data-anchor')) || 50) / 100 * wr.height;
    var top = anchorY - cr.height - 16;
    if (top < kr.top + 8) top = anchorY + 18;
    var loT = kr.top + 8, hiT = Math.min(kr.bottom, navTop) - 8 - cr.height;
    top = hiT < loT ? loT : Math.max(loT, Math.min(hiT, top));

    /* Horizontal: centred on the dot, clamped to the card. On a phone the map is 300px
       wide and the bubble is 262 — without this it hangs off the left edge. */
    var anchorX = wr.left + (parseFloat(c.getAttribute('data-ax')) || 50) / 100 * wr.width;
    var loC = kr.left + 8 + cr.width / 2, hiC = kr.right - 8 - cr.width / 2;
    var cx = hiC < loC ? (kr.left + kr.right) / 2 : Math.max(loC, Math.min(hiC, anchorX));

    c.style.top = Math.round(top - wr.top) + 'px';
    c.style.left = Math.round(cx - wr.left) + 'px';
  }

  /* a running game owns document-level key handlers and timers */
  var gameTeardown = null;
  var traceOff = null;      /* teardown for the mounted Likhna tracing canvas */
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
        earn(res.sikke || res.kauris || (res.win ? 10 : 4), g.name); markToday();
        setTimeout(function () { go('mela'); }, 900);
      });
    } catch (e) { host.innerHTML = '<p class="muted">This stall could not open: ' + esc(e.message) + '</p>'; }
  }

  /* =============================================================== DISPATCH */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var a = t.getAttribute('data-act');

    /* the More sheet (phone nav) closes on any other action */
    var nms = $('#navmoresheet');
    if (nms && a !== 'navmore') nms.remove();

    if (a === 'begin')  { view = { name: 'onboard' }; return render(); }
    if (a === 'go')     return go(t.getAttribute('data-v'));
    /* the day's target is the family's to choose (Bee's goal picker) */
    if (a === 'goalset') {
      S.goal = +t.getAttribute('data-g') || 3; save();
      toast(S.goal + ' a day — a small habit beats a big plan.');
      return render();
    }
    /* the phone nav's More: a small sheet with the pillars that do not fit */
    if (a === 'navmore') {
      if (nms) { nms.remove(); return; }
      var sh2 = document.createElement('div');
      sh2.id = 'navmoresheet';
      sh2.innerHTML = '<div class="nm-in" role="menu">' +
        [['map', 'India', 'map'], ['itihaas', 'Itihaas', 'clock'],
         ['neeti', 'Neeti', 'star'], ['me', 'You & Grown-ups', 'parent']]
          .map(function (t2) {
            return '<button class="nm-row" data-act="go" data-v="' + t2[0] + '">' +
              icon(t2[2], 20) + '<span>' + t2[1] + '</span></button>';
          }).join('') + '</div>';
      sh2.addEventListener('click', function (e2) { if (e2.target === sh2) sh2.remove(); });
      document.body.appendChild(sh2);
      return;
    }
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
      if (rc) readAloud(cardVoiceFor(re.id, rep.n, deck.i, rc), (S.hindi && rc.hi) || rc.text);
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
    /* the Shabdkosh, and one word's card out of it (Phase 3) */
    if (a === 'kosh')   { koshTheme = t.getAttribute('data-t') || null; return go('kosh', t.getAttribute('data-id')); }
    /* a card always opens face up; covering it is the child's own choice */
    if (a === 'wcard')  { wcardMask = false; return go('wordcard', t.getAttribute('data-id')); }
    if (a === 'wcflip') { wcardMask = !wcardMask; stopAudio(); return render(); }
    /* the sentence, spoken. Masked reads AROUND the missing word and never
       touches a clip; the whole thing plays its clip when one has been
       recorded and falls back to the device voice until then. */
    if (a === 'saymask') return sayMasked(t.getAttribute('data-b'), t.getAttribute('data-a'), t.getAttribute('data-l'));
    if (a === 'saysent') return saySentence(t.getAttribute('data-p'), t.getAttribute('data-w'));
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
      save(); earn(5, 'you did it'); markToday();   /* the deed fills the day's ring too */
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
      S.resume = S.resume || {}; S.resume.story = { id: id, at: Date.now() }; save();
      play = { story: null, i: 0, answered: false }; go('story', id);
      var s = allStories().filter(function (x) { return x.id === id; })[0];
      if (s) sayScene(s, 0);
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
      } else if (st) sayScene(st, play.i);
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
      go('story', pick.id); sayScene(pick, 0);
      return;
    }
    if (a === 'again') {
      var aid = t.getAttribute('data-id');
      play = { story: null, i: 0, answered: false };
      go('story', aid); sayScene(allStories().filter(function (x) { return x.id === aid; })[0], 0);
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
    /* a placement chip: carry the typed name and the age slider across the
       re-render, same care the tongue chips take */
    if (a === 'place') {
      if (view.name === 'onboard') {
        var nmP = $('#nm'); if (nmP) obName = nmP.value;
        var agP = $('#ageIn'); if (agP) S.age = +agP.value;
      }
      obPlace[t.getAttribute('data-q')] = t.getAttribute('data-v');
      return render();
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
    /* BUYING A WORLD. One place that spends, so no view can go negative, and the
       purchase is permanent — a world you paid for never re-locks. */
    if (a === 'buyworld') {
      var bw = t.getAttribute('data-w');
      var BE = window.IND_ECONOMY;
      var bp = BE ? BE.worldPrice(bw) : 0;
      if (!BE || !BE.canAfford(S, bp)) {
        toast('That one costs ' + bp + ' sikke. You have ' + (S.sikke || 0) + '.');
        return;
      }
      BE.spend(S, bp);
      S.own.worlds.push(bw);
      S.world = bw; save(); paintChrome();
      var BW = (window.IND_WORLDS && window.IND_WORLDS.get(bw)) || null;
      toast('Opened ' + (BW ? BW.name : bw) + ' — it is yours for good.');
      if (window.IND_WORLDS_ART && window.IND_WORLDS_ART.refresh) window.IND_WORLDS_ART.refresh();
      return render();
    }

    /* THE PITARA. One card, from the ones you do NOT have, so a draw is never wasted
       and never a duplicate. Sacred and epic packs are not in here at all. */
    if (a === 'draw') {
      var dp = t.getAttribute('data-p');
      var DE = window.IND_ECONOMY;
      if (!DE) return;
      var left = DE.unheld(S, dp);
      if (!left.length) { toast('You have every card in this one already.'); return; }
      if (!DE.canAfford(S, DE.DRAW_PRICE)) {
        toast('A draw is ' + DE.DRAW_PRICE + ' sikke. You have ' + (S.sikke || 0) + '.');
        return;
      }
      var got = DE.draw(S, dp);
      if (!got) return;
      DE.spend(S, DE.DRAW_PRICE);
      S.own.avatars.push(got);
      save(); paintChrome();
      toast('You met ' + (avatarName(got) || got) + '!');
      return render();
    }

    /* BUYING A WHOLE PACK outright, for a child who would rather not draw. */
    if (a === 'buypack') {
      var bk = t.getAttribute('data-p');
      var PE = window.IND_ECONOMY;
      var pp = PE ? PE.packPrice(bk) : null;
      if (!PE || pp == null) return;
      if (!PE.canAfford(S, pp)) {
        toast('That pack is ' + pp + ' sikke. You have ' + (S.sikke || 0) + '.');
        return;
      }
      PE.spend(S, pp);
      S.own.packs.push(bk);
      save(); paintChrome();
      toast('The whole pack is open.');
      return render();
    }

    /* DEVELOPER UNLOCK — for testing. Device-scoped and profile-scoped both, loud on
       screen while it is on, and it never touches a paid entitlement: it opens the
       sikke economy only. */
    if (a === 'devmode') {
      S.dev = !S.dev; save();
      toast(S.dev ? 'Developer unlock ON — everything is open.' : 'Developer unlock off.');
      return render();
    }

    if (a === 'vyakaran') return go('vyakaran', t.getAttribute('data-id'));
    if (a === 'progress') return go('progress', t.getAttribute('data-id'));

    if (a === 'world')  {
      S.world = t.getAttribute('data-w'); save();
      var W = (window.IND_WORLDS && window.IND_WORLDS.get(S.world)) || null;
      toast(W ? W.name + ' — ' + W.region : 'World: ' + S.world);
      /* the ambient layer watches data-world itself, but nudge it so a world
         picked from a page that does not re-render the topbar still swaps */
      if (window.IND_WORLDS_ART && window.IND_WORLDS_ART.refresh) window.IND_WORLDS_ART.refresh();
      return render();
    }
    if (a === 'start')  {
      var nm = $('#nm'), ag = $('#ageIn');
      S.name = (nm && nm.value.trim()) || 'Yatri';
      S.age = ag ? +ag.value : 8;
      S.mode = S.age <= 7 ? 'chhote' : 'bade';
      S.goal = S.age <= 7 ? 2 : 3;
      /* the placement answers travel with the profile; ensureLang() reads
         them the first time each pack is opened (Phase 2, docs/09 §3) */
      if (obPlace.home) S.placement = { home: obPlace.home, back: obPlace.back, lang: S.tongue || null };
      S.started = today(); save(); return go('home');
    }
    if (a === 'sound')  { soundOn = !soundOn; Store.saveDevice('sound', soundOn); if (!soundOn) stopAudio(); toast('Sound ' + (soundOn ? 'on' : 'off')); paintChrome(); return render(); }
    if (a === 'night')  { night = !night; Store.saveDevice('night', night); toast(night ? 'Night' : 'Day'); paintChrome(); return render(); }
    if (a === 'voice')  { S.voice = S.voice === 'm' ? 'f' : 'm'; save(); toast(S.voice === 'm' ? 'Man’s voice' : 'Woman’s voice'); return render(); }
    if (a === 'rate')   {
      S.rate = +t.getAttribute('data-r') || 1; save();
      toast(S.rate === 1 ? 'Normal speed' : 'Slower');
      /* say something at the new speed straight away, so the choice is audible
         rather than a number the grown-up has to take on trust */
      speak(null, 'नमस्ते', 'hi-IN');
      return render();
    }
    if (a === 'hindi')  {
      S.hindi = !S.hindi; save();
      toast(S.hindi ? 'Stories in Hindi and English' : 'Stories in English');
      paintChrome(); return render();
    }
    if (a === 'reset')  { if (confirm('Clear everything on this device and start again?')) { localStorage.removeItem(Store.KEY); location.reload(); } return; }

    /* ---- Take it offline / Pass / diagnostics (the Grown-ups' plumbing) ---- */
    if (a === 'dl') {
      var did = t.getAttribute('data-id');
      if (window.IND_ENT && !window.IND_ENT.canDownload(did)) {
        toast('That pack needs the Parivaar Pass — the code box is just below.');
        var pc = $('#passcode'); if (pc) pc.focus();
        return;
      }
      if (!window.IND_DL) return;
      window.IND_DL.download(did, function (done, total) {
        /* patch the counter in place — a render every ten files fights the scroll */
        var el = $('#dlp-' + did); if (el) el.textContent = done + ' / ' + total;
      }, function (finished) {
        dlRefresh();
        toast(finished ? 'Done — that pack now plays with no internet at all.' : 'Download stopped.');
        if (view.name === 'me') render();
      });
      return render();                 /* shows the live row (Stop + counter) */
    }
    if (a === 'dlcancel') { if (window.IND_DL) window.IND_DL.cancel(t.getAttribute('data-id')); return; }
    if (a === 'dlrm') {
      var rid = t.getAttribute('data-id');
      if (!window.IND_DL) return;
      window.IND_DL.remove(rid, function () {
        var rp = (window.IND_PACKS_DL || {})[rid];
        DLC[rid] = { have: 0, total: rp ? rp.n : 0, done: false };
        toast('Removed from this device. It still streams while online.');
        if (view.name === 'me') render();
      });
      return;
    }
    if (a === 'passredeem') {
      var pin = $('#passcode');
      if (window.IND_ENT && window.IND_ENT.redeem(pin && pin.value)) {
        toast('The Parivaar Pass is on — every pack is open.');
        return render();
      }
      toast('That code didn’t work. Check it and try once more.');
      return;
    }
    if (a === 'passclear') {
      if (window.IND_ENT) window.IND_ENT.clear();
      toast('Pass switched off on this device.');
      return render();
    }
    if (a === 'diagcopy') {
      var dtxt = (window.IND_DIAG ? window.IND_DIAG.text() : '') +
        '\nbuild ' + (window.IND_BUILD || 'dev');
      var okc = function () { toast('Copied — paste it into a message to us.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(dtxt).then(okc, function () { fallbackCopy(dtxt); okc(); });
      } else { fallbackCopy(dtxt); okc(); }
      return;
    }
    if (a === 'diagclear') {
      if (window.IND_DIAG) window.IND_DIAG.clear();
      toast('Cleared.');
      return render();
    }
    if (a === 'mon')    { var mo = (window.IND_GEO.monuments || []).filter(function (x) { return x.id === t.getAttribute('data-id'); })[0]; if (mo) toast(mo.name + ' — ' + mo.fact); return; }
    if (a === 'pack')   {
      S.resume = S.resume || {}; S.resume.pack = { id: t.getAttribute('data-id'), at: Date.now() }; save();
      quiz = quizReset(null); return go('pack', t.getAttribute('data-id'));
    }
    if (a === 'game')   {
      S.resume = S.resume || {}; S.resume.game = { id: t.getAttribute('data-id'), at: Date.now() }; save();
      return go('game', t.getAttribute('data-id'));
    }
    if (a === 'kahani') return go('kahani', t.getAttribute('data-id'));
    /* the deck opens ON the companion you are already travelling with, not at
       card one — you came to look at someone, usually them */
    if (a === 'deck')      { deckOpen = true; deckAt = deckIndexOf(S.buddy); return render(); }
    if (a === 'deckclose') { deckOpen = false; return render(); }
    if (a === 'deckstep')  { deckAt += (+t.getAttribute('data-d') || 1); return render(); }
    if (a === 'avcard') { deckOpen = false; return go('avcard', t.getAttribute('data-id')); }
    if (a === 'quiz')   {
      startSession(t.getAttribute('data-s') || quiz.stage, 'lesson');
      return render();
    }
    /* the introduce beat's acknowledge: the item now has a card (box 0, due
       straight away) so the planner counts it met — then on with the drill */
    if (a === 'gotit') {
      if (!quiz.q || quiz.q.type !== 'introduce') return;
      var gsp = quiz.q.spec, grec = ensureLang(quiz.packId);
      if (gsp && gsp.key) {
        var gcard = grec.srs[gsp.key] || (grec.srs[gsp.key] = { key: gsp.key });
        if (!gcard.intro) gcard.intro = Date.now();
        /* meeting a sentence is meeting its grammar point: light it on the map */
        if (gsp.item && gsp.item.point) {
          var gpk = 'gram:' + gsp.item.point;
          var gpc = grec.srs[gpk] || (grec.srs[gpk] = { key: gpk });
          if (!gpc.intro) gpc.intro = Date.now();
        }
        save();
      }
      quiz.pi++; planStep();
      return render();
    }
    /* a locked stage was tapped: open the test-out offer (never a wall) */
    if (a === 'testout') { quiz.offer = t.getAttribute('data-s'); quiz.over = false; return render(); }
    if (a === 'totclose') { quiz.offer = null; return render(); }
    if (a === 'totstart') {
      startSession(t.getAttribute('data-s'), 'testout');
      return render();
    }
    /* choice questions: tap an option */
    if (a === 'ans') {
      var q = quiz.q, idx = +t.getAttribute('data-i');
      if (!q || quiz.lock) return;
      var want = (typeof q.answerIndex === 'number') ? q.answerIndex : -1;
      var ok = (idx === want);
      recordAnswer(ok);
      quiz.lock = true;
      t.classList.add(ok ? 'right' : 'wrong');
      if (!ok && want >= 0) {
        var w = document.querySelector('[data-act="ans"][data-i="' + want + '"]'); if (w) w.classList.add('right');
      }
      showFb(fbFor(q, ok, idx));
      /* Fill-the-blank's reward is the sentence, whole, out loud — the one
         thing that could not be played a moment ago. It needs a longer beat
         than a tap-and-move drill, so the child hears it end. */
      if (q.type === 'sentenceBlank') {
        saySentence(quiz.packId, q.answerWord);
        advance(ok ? 2400 : 3400);
      } else advance(ok ? 1100 : 2600);
      return;
    }
    /* PHASE B — production. Typing is a render, not a re-plan: the question
       object is untouched, only quiz.typed moves. */
    if (a === 'ptype') {
      if (quiz.lock || !quiz.q || quiz.q.kind !== 'produce') return;
      quiz.typed = (quiz.typed || '') + t.getAttribute('data-c');
      return render();
    }
    if (a === 'pback') {
      if (quiz.lock || !quiz.typed) return;
      /* one TAP undoes one KEYSTROKE, which for an abugida is one character,
         not one visual cluster — the child put the matra on separately and
         expects to take it off separately */
      quiz.typed = quiz.typed.slice(0, -1);
      return render();
    }
    if (a === 'pdone') return checkProduced();
    /* ordered build: tap a tile in, tap a filled slot out */
    if (a === 'btile') return placeTile(+t.getAttribute('data-i'));
    if (a === 'bslot') {
      if (quiz.lock || !quiz.build) return;
      quiz.build.placed.splice(+t.getAttribute('data-i'), 1);
      return render();
    }
    /* tracing (stage 7). A pass counts as a correct answer; a miss shows
       likhna's own which-way-it-went-wrong line and costs nothing — the
       child simply traces again. No shaming, no lives. */
    if (a === 'tclear') { if (window.IND_LIKHNA && window.IND_LIKHNA.clear) window.IND_LIKHNA.clear(); return; }
    if (a === 'tcheck') {
      if (!quiz.q || quiz.q.type !== 'trace' || quiz.lock) return;
      var res = (window.IND_LIKHNA && window.IND_LIKHNA.check) ? window.IND_LIKHNA.check() : null;
      if (!res || !res.pass) return;
      recordAnswer(true);
      quiz.lock = true;
      showFb(fbFor(quiz.q, true, -1));
      advance(1200);
      return;
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'ageIn') { var o = $('#ageOut'); if (o) o.textContent = e.target.value; }
  });
  /* SWIPE THE DECK. A card popup on a phone is a thing you flick, and a child
     will try it before they find the arrows. Bound once on the document and
     gated on deckOpen, so it costs nothing anywhere else. Vertical drags are
     left alone — the card itself scrolls. */
  var swipeX = null, swipeY = null;
  document.addEventListener('touchstart', function (e) {
    if (!deckOpen || !e.touches || e.touches.length !== 1) { swipeX = null; return; }
    swipeX = e.touches[0].clientX; swipeY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (swipeX === null || !deckOpen) return;
    var t = e.changedTouches && e.changedTouches[0];
    if (!t) { swipeX = null; return; }
    var dx = t.clientX - swipeX, dy = t.clientY - swipeY;
    swipeX = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    deckAt += (dx < 0 ? 1 : -1);
    render();
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    /* Ordered-build keyboard controls (every drill needs keys as well as
       touch): ← → walk the unused tiles with a visible ring, Enter places
       the ringed tile, Backspace takes the last one back. Works cold — no
       click needed first. When a tile button itself has focus (tab
       navigation), its native Enter click is left alone. */
    if (S.started && view.name === 'pack' && quiz.q && isBuild(quiz.q.type) && !quiz.lock &&
        !(e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))) {
      var b = quiz.build, qq = quiz.q, nT = qq.tiles.length, j;
      function nextUnused(from, dir) {
        var x = from, n = 0;
        do { x = (x + dir + nT) % nT; n++; } while (b.placed.indexOf(x) >= 0 && n <= nT);
        return b.placed.indexOf(x) >= 0 ? -1 : x;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        b.kb = true;
        j = nextUnused(b.kfocus, e.key === 'ArrowRight' ? 1 : -1);
        if (j >= 0) { b.kfocus = j; render(); }
        e.preventDefault(); return;
      }
      if (e.key === 'Enter' && !(document.activeElement && document.activeElement.classList &&
                                 document.activeElement.classList.contains('btile'))) {
        b.kb = true;
        j = b.placed.indexOf(b.kfocus) >= 0 ? nextUnused(b.kfocus, 1) : b.kfocus;
        if (j >= 0) {
          /* park the ring on the next free tile BEFORE placing, so it is
             never left sitting invisibly on the tile just used */
          b.placed.push(j); var nf = nextUnused(j, 1); b.placed.pop();
          if (nf >= 0) b.kfocus = nf;
          placeTile(j);
        }
        e.preventDefault(); return;
      }
      if (e.key === 'Backspace') {
        if (b.placed.length) { b.placed.pop(); render(); }
        e.preventDefault(); return;
      }
    }
    /* the introduce beat answers to Enter as well as touch (when the button
       itself is focused, its native Enter click is left alone) */
    if (e.key === 'Enter' && S.started && view.name === 'pack' && quiz.q && quiz.q.type === 'introduce' &&
        !(e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) &&
        !(document.activeElement && document.activeElement.getAttribute &&
          document.activeElement.getAttribute('data-act') === 'gotit')) {
      var gi = document.querySelector('[data-act="gotit"]');
      if (gi) { e.preventDefault(); gi.click(); return; }
    }
    /* Escape closes the deck first — a popup swallows the key that would
       otherwise navigate away underneath it */
    if (e.key === 'Escape' && deckOpen) { deckOpen = false; return render(); }
    /* the deck steps from the keyboard as well as from the arrows and a swipe —
       every control in this app is reachable all three ways */
    if (deckOpen && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault(); deckAt += (e.key === 'ArrowRight' ? 1 : -1); return render();
    }
    /* PHASE B — a produce question takes the keyboard. Every game and drill in
       this app works by touch AND by key (CLAUDE.md), and for writing that is
       not a nicety: a child on a laptop with a Devanagari keyboard installed
       should be able to just type, and one without should be able to tap the
       same keys on screen. Both routes end in the same quiz.typed. */
    if (quiz && quiz.q && quiz.q.kind === 'produce' && !quiz.lock &&
        view.name === 'question' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (e.key === 'Backspace') { e.preventDefault(); quiz.typed = (quiz.typed || '').slice(0, -1); return render(); }
      if (e.key === 'Enter') { e.preventDefault(); return checkProduced(); }
      /* one printable character, and only if it belongs to this script's own
         key set — a stray latin letter is a typo, not an answer */
      if (e.key && e.key.length === 1) {
        var pk = quiz.q.keys || {};
        var ok = (pk.consonants || []).indexOf(e.key) >= 0 || (pk.matras || []).indexOf(e.key) >= 0 ||
                 (pk.vowels || []).indexOf(e.key) >= 0 || e.key === pk.virama;
        if (ok) { e.preventDefault(); quiz.typed = (quiz.typed || '') + e.key; return render(); }
      }
    }
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
    healWorld();
    render();
    // Also the handle tools/verify.js drives the app by, so the headless walk exercises the
    // real navigation rather than a parallel test path.
    /* THE UPDATE NUDGE. This is a single-page app: a tab left open serves the version it
       booted with forever, and GitHub Pages caches for ten minutes on top — so "I deployed
       it" and "they can see it" can disagree for a while, and did. Every few minutes the
       app asks for build.js with a cache-busting query; if the answer names a newer build,
       a small bar offers one tap to reload. Never automatic — a child mid-story is not
       interrupted by a refresh. */
    var updateOffered = false;
    setInterval(function () {
      if (updateOffered || !window.fetch) return;
      fetch('build.js?live=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.text(); })
        .then(function (t) {
          var m = t.match(/IND_BUILD\s*=\s*'([^']+)'/);
          if (!m || !window.IND_BUILD || m[1] === window.IND_BUILD) return;
          updateOffered = true;
          var bar = document.createElement('button');
          bar.className = 'updatebar';
          bar.textContent = 'A newer Bizzing India is ready — tap to load it';
          bar.addEventListener('click', function () { location.reload(); });
          document.body.appendChild(bar);
        }).catch(function () { /* offline is fine; the app is offline-first */ });
    }, 3 * 60 * 1000);

    window.BI = { S: S, go: go, render: render, Store: Store,
                  allStories: allStories, epics: epics,
                  storyThemes: function () { return STORY_THEMES.map(function (t) { return t.id; }); },
                  /* read-only view of the live quiz for tools/verify.js's
                     no-dead-ends walk — a getter because `quiz` is reassigned */
                  quizState: function () { return quiz; } };
  });
})();
