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
    onRemoteChange: function () {}
  };

  /* =================================================================== STATE */
  var S = Store.loadProfile() || {
    schemaVersion: 1, name: '', age: 8, mode: 'bade',
    buddy: 'ganesha', world: 'chitrakatha',
    kauris: 0, xp: 0,
    lit: {}, read: {}, lang: {},
    streak: { days: [], last: null, count: 0 },
    goal: 3, todayCount: 0, todayOn: null,
    started: null
  };
  var view = { name: 'home', arg: null };
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

  /* stories live in two files now: the core set and the regional set */
  function allStories() {
    return (window.IND_STORIES || []).concat(window.IND_STORIES_REGIONAL || []);
  }
  function allCollections() {
    return (window.IND_COLLECTIONS || []).concat(window.IND_COLLECTIONS_REGIONAL || []);
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
  function speak(key) {
    if (!soundOn || !key) return;
    if (window.IND_VOICE && window.IND_VOICE.indexOf(key) < 0) return;
    try { if (audio) audio.pause(); audio = new Audio('voice/' + key + '.mp3'); audio.play().catch(function () {}); } catch (e) {}
  }
  function stopAudio() { if (audio) { audio.pause(); audio = null; } }

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
  V.onboard = function () {
    var packs = window.IND_AVATAR_PACKS || [];
    return '<div class="wrap" style="max-width:640px">' +
      '<div class="dots center" style="justify-content:center;margin-bottom:18px"><i class="on"></i><i></i></div>' +
      '<div class="card" style="padding:var(--space-2xl)">' +
        '<h1>Who’s exploring?</h1>' +
        '<p>Set up your traveller. Nothing here leaves this device.</p>' +
        '<label class="tiny" style="font-weight:700">Name</label>' +
        '<input id="nm" class="opt" style="margin:6px 0 18px" placeholder="Their name" />' +
        '<label class="tiny" style="font-weight:700">Age · <b id="ageOut">' + S.age + '</b></label>' +
        '<input id="ageIn" type="range" min="4" max="12" value="' + S.age + '" style="width:100%;margin:10px 0 6px" />' +
        '<p class="tiny muted">4–7 gets big pictures and no reading. 8–12 gets the map, quizzes and script.</p>' +
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
    var w = SHABD[hour % SHABD.length], q = SUBHASHITA[hour % SUBHASHITA.length];
    var hello = ['“Chalo — one story and a whole state wakes up.”',
                 '“I remember every single thing. Come and see.”',
                 '“The mist is thinner than yesterday. That was you.”'][new Date().getDate() % 3];

    function metric(colour, label, now, of) {
      return '<div class="metric"><i style="background:' + colour + '"></i>' + label +
        '<b>' + now + '<span class="muted">/' + of + '</span></b></div>';
    }

    return '<div class="statrow" style="margin-bottom:var(--space-lg)">' +
      /* greeting + the buddy actually says something */
      '<div class="card notch" style="margin:0"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">' +
        art(S.buddy, 72) +
        '<div style="flex:1"><div class="tiny muted">' + greet + ',</div>' +
        '<h2 style="margin:0 0 10px">' + esc(S.name || 'Yatri') + '</h2>' +
        '<div class="bubble">' + esc(hello) + '</div></div></div></div>' +

      /* daily goal, several metrics at once */
      '<div class="card notch" style="margin:0">' +
        '<h3 style="margin:0 0 12px">Today’s goal</h3>' +
        metric('var(--accent3)', 'Stories', S.todayCount, S.goal) +
        metric('var(--good)', 'Places lit', lit, 34) +
        metric('var(--accent)', 'Words', wordsN, 20) +
        '<div class="bar" style="margin-top:12px"><i style="width:' +
          Math.min(100, Math.round(S.todayCount / S.goal * 100)) + '%"></i></div>' +
        '<div class="tiny muted" style="margin-top:8px">🪔 ' + S.streak.count + '-day streak · ' +
        esc(rank()) + ' · Lv ' + (lv + 1) + '</div>' +
      '</div>' +

      /* shabd of the hour — our version of "word of the hour" */
      '<div class="card tint notch" style="margin:0">' +
        '<div class="mono">Shabd of the hour</div>' +
        '<div class="deva" style="font-family:var(--deva);font-size:34px;font-weight:700;line-height:1.3">' + esc(w[0]) + '</div>' +
        '<div class="mono" style="text-transform:none">/ ' + esc(w[1]) + ' /</div>' +
        '<p class="tiny" style="margin:8px 0 10px">' + esc(w[2]) + '</p>' +
        '<button class="pill" data-act="say" data-k="' + esc(w[3]) + '">' + icon('sound', 16) + ' hear it</button>' +
      '</div></div>' +

      /* the two big illustrated journeys */
      '<div class="grid g2" style="grid-template-columns:1fr 1fr">' +
        '<button class="journey" data-act="go" data-v="stories">' +
          '<div class="banner" style="background-image:url(art/banner/stories.jpg)">' +
            '<span class="chip">' + icon('tree', 20) + '</span>' +
            '<span class="tag">' + readN + ' of ' + totalStories + ' told</span></div>' +
          '<div class="body"><div class="tiny muted">Next on your yatra</div>' +
          '<h2 style="margin:2px 0 6px">Under the Banyan</h2>' +
          '<p class="tiny" style="margin:0 0 14px">Panchatantra · Akbar &amp; Birbal · the great stories — each one with a choice to make in the middle.</p>' +
          '<span class="btn">' + icon('play', 18) + ' Tell me one</span></div></button>' +

        '<button class="journey" data-act="go" data-v="map">' +
          '<div class="banner" style="background-image:url(art/banner/map.jpg)">' +
            '<span class="chip">' + icon('map', 20) + '</span>' +
            '<span class="tag">' + lit + ' of 34 remembered</span></div>' +
          '<div class="body"><div class="tiny muted">Your long journey</div>' +
          '<h2 style="margin:2px 0 6px">The Great Forgetting</h2>' +
          '<p class="tiny" style="margin:0 0 14px">Vismriti is eating India’s memory. Every story you finish pushes the grey back off one more place.</p>' +
          '<div class="bar"><i style="width:' + Math.round(lit / 34 * 100) + '%"></i></div></div></button>' +
      '</div>' +

      /* the two nugget cards */
      '<div class="grid g2" style="grid-template-columns:1fr 1fr;margin-top:var(--space-lg)">' +
        '<div class="card notch"><div class="mono">Today’s tip from Mithu</div>' +
          '<div class="row" style="flex-wrap:nowrap;margin-top:8px">' +
          '<p class="tiny" style="flex:1;margin:0">Ask a grown-up which of these stories <i>they</i> were told as a child. ' +
          'Nearly every family tells them a little differently — and their version is the one worth knowing.</p>' +
          mascot('mithu', 'talk', 62) + '</div></div>' +
        '<div class="card tint notch"><div class="mono">Subhashita of the hour</div>' +
          '<p style="font-family:var(--display);font-size:18px;font-style:italic;margin:8px 0 6px">“' + esc(q[0]) + '”</p>' +
          '<div class="tiny muted">— ' + esc(q[1]) + '</div></div>' +
      '</div>' +

      /* the rest of the map */
      '<div class="grid g2" style="margin-top:var(--space-lg)">' +
        [['bhasha', 'Bhasha', 'Hindi · Punjabi', 'Real script from day one, on one engine that will take every Indian language.'],
         ['mela', 'The Mela', '4 stalls open', 'Rangoli Rush, State Hunt, Festival Frenzy and Jataka Jump.']]
        .map(function (c) {
          return '<button class="tile" data-act="go" data-v="' + c[0] + '">' +
            '<div class="spread"><h3 style="margin:0">' + c[1] + '</h3><span class="pill stat tiny">' + c[2] + '</span></div>' +
            '<p class="tiny" style="margin:8px 0 0">' + c[3] + '</p></button>';
        }).join('') +
      '</div>' +

      /* the mala — deeds, not levels. See docs/12. */
      (S.mala && S.mala.length ? V.malaStrip() : '') +

      /* rank ladder — the Bizzing Bee evolution row */
      '<div class="card" style="margin-top:var(--space-lg)">' +
        '<div class="spread" style="margin-bottom:14px"><h3 style="margin:0">Your yatra</h3>' +
        '<span class="tiny muted">You’re <b>' + esc(rank()) + '</b>' +
        (lv < RANKS.length - 1 ? ' — next: ' + esc(RANKS[lv + 1]) : ' — the top') + '</span></div>' +
        '<div class="ladder">' + RANKS.map(function (r, i) {
          return '<div class="rung ' + (i === lv ? 'cur' : i < lv ? 'done' : 'locked') + '">' +
            '<div class="lv">Lv ' + (i + 1) + '</div>' +
            '<div style="margin:6px 0">' + mascot('gattu', i === lv ? 'wow' : 'happy', 46) + '</div>' +
            '<div class="nm">' + esc(r) + '</div></div>';
        }).join('') + '</div>' +
        '<div class="bar" style="margin-top:12px"><i style="width:' + pct + '%"></i></div>' +
      '</div>';
  };

  /* -------------------------------------------------------------------- MAP */
  V.map = function () {
    var M = window.IND_MAP, G = window.IND_GEO;
    if (!M) return '<div class="card">Map data missing.</div>';
    var lit = Object.keys(S.lit).length, total = Object.keys(M.paths).length;
    var paths = Object.keys(M.paths).map(function (c) {
      return '<path class="terr' + (S.lit[c] ? ' lit' : '') + '" d="' + M.paths[c] + '" data-act="state" data-code="' + c +
        '"><title>' + esc(G && G.states[c] ? G.states[c].name : c) + '</title></path>';
    }).join('');
    var pins = G && G.pins ? Object.keys(G.pins).map(function (id) {
      var m = (G.monuments || []).filter(function (x) { return x.id === id; })[0];
      if (!m || !S.lit[m.state]) return '';
      var p = G.pins[id];
      return '<g class="pin" data-act="mon" data-id="' + id + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="10"/></g>';
    }).join('') : '';

    return '<div class="card">' +
      '<div class="spread" style="margin-bottom:14px">' +
        '<div><h2 style="margin:0">The Living Map</h2>' +
        '<div class="tiny muted">' + lit + ' of ' + total + ' places remembered · tap anywhere in the mist</div></div>' +
        '<span class="pill stat">🪔 ' + S.streak.count + '</span></div>' +
      '<svg class="mapsvg" viewBox="' + M.viewBox + '" role="img" aria-label="Map of India">' +
        '<path class="outline" d="' + M.outline + '"/>' + paths + pins + '</svg>' +
      '<div class="legend" style="margin-top:14px">' +
        '<span><i style="background:var(--mist)"></i>still forgotten</span>' +
        '<span><i style="background:var(--lit)"></i>remembered</span>' +
        '<span><i style="background:var(--accent3)"></i>a place to visit</span></div></div>' +
      (lit === 0 ? '<div class="card center"><p>Nothing is lit yet. Read a story — each one pushes the mist back off the place it comes from.</p>' +
        '<button class="btn" data-act="go" data-v="stories">Open the Story Tree</button></div>' : '');
  };

  V.state = function (code) {
    var G = window.IND_GEO, s = G && G.states[code];
    if (!s) return '<div class="card">Nothing here yet.</div>';
    var stories = allStories().filter(function (t) { return (t.place || []).indexOf('IN-' + code) >= 0; });
    var mons = (G.monuments || []).filter(function (m) { return m.state === code; });
    var pend = (G.pending || []).filter(function (p) { return p.inside === code; });
    return '<button class="backlink" data-act="go" data-v="map">' + icon('back', 18) + ' Map</button>' +
      '<div class="card"><div class="spread"><h1 style="margin:0">' + esc(s.name) + '</h1>' +
      (S.lit[code] ? '<span class="badge aaj">remembered</span>' : '<span class="badge">in the mist</span>') + '</div>' +
      '<p class="mono" style="margin:6px 0 14px">' + esc(s.capital) + (s.food ? ' · ' + esc(s.food) : '') + '</p>' +
      '<p>' + esc(s.fact) + '</p>' + (s.note ? '<p class="tiny muted">' + esc(s.note) + '</p>' : '') +
      pend.map(function (p) {
        return '<div class="card flat tight"><b>' + esc(p.name) + '</b> <span class="tiny muted">— its own ' +
          (p.type === 'ut' ? 'union territory' : 'state') + ' since ' + p.since + '. Our map still draws it inside ' +
          esc(s.name) + '; we are fixing that.</span><div class="tiny" style="margin-top:6px">' + esc(p.fact) + '</div></div>';
      }).join('') + '</div>' +
      (mons.length ? '<div class="card"><h3>Places to see</h3>' + mons.map(function (m) {
        return '<div class="card flat tight" style="margin-bottom:9px"><span class="badge ' + m.badge + '">' + m.badge + '</span> <b>' +
          esc(m.name) + '</b> <span class="tiny muted">· ' + esc(m.when) + '</span>' +
          '<div class="tiny" style="margin-top:5px">' + esc(m.fact) + '</div></div>';
      }).join('') + '</div>' : '') +
      (stories.length ? '<div class="card"><h3>Stories from here</h3>' + stories.map(function (t) {
        return '<button class="tile" style="margin-bottom:9px" data-act="story" data-id="' + t.id + '"><b>' + esc(t.title) +
          '</b><div class="tiny muted">' + esc(t.hook) + '</div></button>';
      }).join('') + '</div>' : '');
  };

  /* --------------------------------------------------------------- STORIES */
  V.stories = function () {
    var cols = allCollections(), all = allStories();
    return '<div class="card"><h1>The Story Tree</h1>' +
      '<p>Every story you finish lifts the mist off the place it came from.</p></div>' +
      cols.map(function (c) {
        return '<div class="card"><div class="row" style="margin-bottom:14px;flex-wrap:nowrap">' + art(c.avatar, 62) +
          '<div><h2 style="margin:0">' + esc(c.name) + '</h2><div class="tiny muted">' + esc(c.note) + '</div></div></div>' +
          '<div class="grid g2">' + all.filter(function (s) { return s.collection === c.id; }).map(function (s) {
            return '<button class="tile" data-act="story" data-id="' + s.id + '">' +
              '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(s.hero, 58) +
              '<div style="flex:1"><span class="badge ' + s.badge + '">' + s.badge + '</span>' +
              (S.read[s.id] ? ' <span class="badge aaj">✓ read</span>' : '') +
              '<div style="font-family:var(--display);font-weight:800;font-size:17px;margin:6px 0 3px">' + esc(s.title) + '</div>' +
              '<div class="tiny muted">' + esc(s.hook) + '</div>' +
              '<div class="mono" style="margin-top:6px">' + s.minutes + ' min</div></div></div></button>';
          }).join('') + '</div></div>';
      }).join('');
  };

  var play = { story: null, i: 0, answered: false };

  V.story = function (id) {
    var st = allStories().filter(function (s) { return s.id === id; })[0];
    if (!st) return '<div class="card">Story not found.</div>';
    if (!play.story || play.story.id !== id) { play.story = st; play.i = 0; play.answered = false; }
    if (play.i >= st.scenes.length) return V.storyEnd(st);

    var sc = st.scenes[play.i], cast = (sc.art || []).slice(0, 2), teller = sc.who === 'mithu';
    return '<button class="backlink" data-act="go" data-v="stories">' + icon('back', 18) + ' Stories</button>' +
      '<div class="spread" style="margin-bottom:12px"><span class="badge ' + st.badge + '">' + st.badge + '</span>' +
      '<div class="dots">' + st.scenes.map(function (_, i) { return '<i class="' + (i <= play.i ? 'on' : '') + '"></i>'; }).join('') + '</div></div>' +
      '<div class="stage">' + (teller ? '<div class="speaking">' + mascot('mithu', 'talk', 128) + '</div>' :
        cast.map(function (c, i) { return '<div class="' + (i === 0 ? 'speaking' : '') + '">' + art(c, i === 0 ? 128 : 100) + '</div>'; }).join('')) + '</div>' +
      '<div class="speech" style="margin-top:14px">' + (teller ? '<span class="who">Mithu</span>' : '') +
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
    return '<button class="backlink" data-act="go" data-v="stories">' + icon('back', 18) + ' Stories</button>' +
      '<div class="card center">' + mascot('mithu', 'wink', 112) +
      '<h1 style="margin-top:8px">' + esc(st.title) + '</h1>' +
      '<p style="font-size:18px;max-width:52ch;margin:0 auto var(--space-md)">' + esc(st.moral) + '</p>' +
      (place ? '<span class="badge aaj">🪔 The mist lifted off ' + esc(place) + '</span>' : '') + '</div>' +
      (st.words_hi && st.words_hi.length ? '<div class="card"><h3>Three words from this story</h3><div class="grid g3">' +
        st.words_hi.map(function (w) {
          return '<button class="tile center" data-act="say" data-k="hi/w-' + slug(w[1]) + '">' +
            '<div class="deva" style="font-size:28px">' + esc(w[0]) + '</div>' +
            '<div class="mono">' + esc(w[1]) + '</div><div class="tiny">' + esc(w[2]) + '</div></button>';
        }).join('') + '</div></div>' : '') +
      '<div class="card flat tiny"><b>Where this comes from.</b> ' + esc(st.source || '') + '</div>';
  };


  /* -------------------------------------------------------------- ITIHAAS */
  /* Age-gated: nothing above the child's band is rendered at all (docs/05 §3). */
  function ageOK(gate) { return (S.age || 8) >= (gate || 4); }

  V.itihaas = function () {
    var I = window.IND_ITIHAAS;
    if (!I) return '<div class="card"><h1>Itihaas</h1><p>Not loaded.</p></div>';
    var eras = I.eras.filter(function (e) { return ageOK(e.gate); });
    var hidden = I.eras.length - eras.length;
    return '<div class="card"><h1>The River of Time</h1><p>' + esc(I.intro) + '</p>' +
      '<div class="row" style="margin-top:6px">' +
      '<span class="badge itihaas">itihaas — what evidence shows</span>' +
      '<span class="badge katha">katha — a story as it is told</span></div></div>' +
      '<div class="river">' + eras.map(function (e, i) {
        return '<button class="bend" data-act="era" data-id="' + e.id + '">' +
          '<span class="yr">' + esc(e.when) + '</span>' +
          '<span class="node">' + art(e.avatar, 54) + '</span>' +
          '<span class="ttl">' + esc(e.title) + '</span>' +
          '<span class="tiny muted">' + esc(e.hook) + '</span></button>';
      }).join('') + '</div>' +
      (hidden ? '<div class="card flat tiny"><b>' + hidden + ' more further down the river.</b> ' +
        'Some of what happened to India is hard, and we show it when a reader is a bit older. ' +
        'A grown-up can change the age in Me.</div>' : '');
  };

  V.era = function (id) {
    var I = window.IND_ITIHAAS;
    var e = I && I.eras.filter(function (x) { return x.id === id; })[0];
    if (!e) return '<div class="card">Not found.</div>';
    if (!ageOK(e.gate)) return '<div class="card"><p>This part of the river is for a bit older. ' +
      'Ask a grown-up.</p><button class="btn" data-act="go" data-v="itihaas">Back</button></div>';
    var big = (S.age || 8) >= 9;
    return '<button class="backlink" data-act="go" data-v="itihaas">' + icon('back', 18) + ' The River of Time</button>' +
      '<div class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(e.avatar, 92) +
      '<div style="flex:1"><span class="badge itihaas">itihaas</span>' +
      '<h1 style="margin:8px 0 2px">' + esc(e.title) + '</h1>' +
      '<div class="mono">' + esc(e.when) + '</div></div></div>' +
      '<p style="font-size:17px;margin-top:14px">' + esc(e.hook) + '</p></div>' +
      '<div class="card"><p>' + esc(e.kid) + '</p>' +
      (big ? '<div class="card flat"><b>If you want the longer version.</b> ' + esc(e.big) + '</div>' : '') +
      '</div>' +
      '<div class="card tint"><div class="mono">Worth stopping on</div><p style="margin:8px 0 0">' + esc(e.wonder) + '</p></div>' +
      '<div class="card"><h3>Things you can actually go and see</h3><div class="row">' +
      e.objects.map(function (o) { return '<span class="pill stat">' + esc(o) + '</span>'; }).join('') + '</div></div>' +
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
    return '<div class="card"><h1>Dharma</h1><p>' + D.intro + '</p></div>' +
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



  /* ------------------------------------------------------------- SANSKAAR */
  /* The payoff here is deliberately NOT a ladder. Nobody acquires a value by
     consuming stories, so levels would be a lie. What earns a bead is DOING the
     small thing — and a grown-up witnessing it. The mala grows and is never
     finished, which is also true of the thing it represents. */

  V.sanskaar = function () {
    var K = window.IND_SANSKAAR;
    if (!K) return '<div class="card"><h1>Sanskaar</h1><p>Not loaded.</p></div>';
    var beads = (S.mala || []).length;
    return '<div class="card"><h1>Sanskaar</h1><p>' + esc(K.intro) + '</p>' +
      '<p class="tiny muted">No levels here, and nothing to finish. You get a bead when you ' +
      '<b>do</b> one of these, not when you read about it.</p></div>' +
      (beads ? V.malaStrip() : '') +
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

  V.malaStrip = function () {
    var K = window.IND_SANSKAAR, beads = S.mala || [];
    var col = function (id) { var v = K.values.filter(function (x) { return x.id === id; })[0]; return v ? v.colour : 'var(--accent)'; };
    return '<div class="card"><div class="spread" style="margin-bottom:10px">' +
      '<div><h3 style="margin:0">Your mala</h3>' +
      '<div class="tiny muted">One bead for every time you did something, not read something.</div></div>' +
      '<span class="pill stat">' + beads.length + '</span></div>' +
      '<div class="mala">' + beads.slice(-40).map(function (b) {
        return '<i style="background:' + col(b.v) + '" title="' + esc(b.v) + '"></i>';
      }).join('') + '</div></div>';
  };

  V.value = function (id) {
    var K = window.IND_SANSKAAR;
    var v = K && K.values.filter(function (x) { return x.id === id; })[0];
    if (!v) return '<div class="card">Not found.</div>';
    var mine = allStories().filter(function (s) { return (v.stories || []).indexOf(s.id) >= 0; });
    var done = (S.mala || []).filter(function (b) { return b.v === v.id; });
    var big = (S.age || 8) >= 9;

    return '<button class="backlink" data-act="go" data-v="sanskaar">' + icon('back', 18) + ' Sanskaar</button>' +
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
      '<button class="btn ghost" data-act="deednani" data-id="' + v.id + '">Tell Nani</button></div>' +
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
      '<div class="grid g2">' + Object.keys(packs).map(function (k) {
        var p = packs[k], sc = window.IND_SCRIPTS[p.script], st = S.lang[k] || { asked: 0, correct: 0 };
        return '<button class="tile" data-act="pack" data-id="' + k + '">' +
          '<div class="deva" style="font-size:44px;line-height:1">' + esc(sc && sc.consonants && sc.consonants[0] ? sc.consonants[0].char : '') + '</div>' +
          '<h3 style="margin:10px 0 2px" class="deva">' + esc(p.name.native || p.name.en) + '</h3>' +
          '<div class="mono">' + esc(p.name.en) + ' · ' + esc(sc ? sc.name : p.script) + '</div>' +
          '<div class="tiny muted" style="margin-top:8px">' + st.correct + ' right of ' + st.asked + '</div></button>';
      }).join('') + '</div>' +
      '<div class="card flat tiny"><b>Note.</b> The Hindi and Punjabi audio here is synthesised, as a placeholder. ' +
      'Per <code>docs/09</code> it must be replaced with human voice before launch — children imitate these sounds, ' +
      'and TTS teaches errors a native-speaker parent hears instantly.</div>';
  };

  var quiz = { packId: null, stage: null, q: null, done: 0, right: 0 };

  V.pack = function (id) {
    var p = window.IND_PACKS[id]; if (!p) return '<div class="card">Pack not found.</div>';
    var sc = window.IND_SCRIPTS[p.script];
    if (quiz.packId !== id) quiz = { packId: id, stage: null, q: null, done: 0, right: 0 };
    if (quiz.q) return '<button class="backlink" data-act="pack" data-id="' + id + '">' + icon('back', 18) + ' ' + esc(p.name.en) + '</button>' + V.question(quiz.q);
    return '<button class="backlink" data-act="go" data-v="bhasha">' + icon('back', 18) + ' Bhasha</button>' +
      '<div class="card"><h1 class="deva">' + esc(p.name.native) + '</h1>' +
      '<div class="mono">' + esc(p.name.en) + ' · ' + esc(sc.name) + ' · tap any letter to hear it</div>' +
      '<h3 style="margin-top:20px">Vowels</h3><div class="gridscript">' + (sc.vowels || []).map(function (v) {
        return '<button class="glyph" data-act="say" data-k="' + esc(v.audio || '') + '">' + esc(v.char) + '<small>' + esc(v.name) + '</small></button>';
      }).join('') + '</div>' +
      '<h3 style="margin-top:18px">Consonants</h3><div class="gridscript">' + (sc.consonants || []).map(function (c) {
        return '<button class="glyph" data-act="say" data-k="' + esc(c.audio || '') + '">' + esc(c.char) + '<small>' + esc(c.name) + '</small></button>';
      }).join('') + '</div></div>' +
      '<div class="card"><h3>The ladder</h3><p class="tiny">The same ladder in every language — that is the point of the engine.</p>' +
      (p.stages || []).map(function (s) {
        return '<button class="tile" style="margin-bottom:9px" data-act="quiz" data-s="' + esc(s.id) + '"><b>' + esc(s.name) + '</b>' +
          (s.desc ? '<div class="tiny muted">' + esc(s.desc) + '</div>' : '') + '</button>';
      }).join('') + '</div>';
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
      '<div class="card"><h3>Grown-ups</h3><div class="row">' +
      '<button class="pill' + (soundOn ? ' on' : '') + '" data-act="sound">' + icon('sound', 18) + ' Sound</button>' +
      '<button class="pill' + (night ? ' on' : '') + '" data-act="night">Night mode</button>' +
      '<button class="pill" data-act="reset">Start again</button></div>' +
      '<p class="tiny muted" style="margin-top:12px">Build <b>' + esc(window.IND_BUILD || 'dev') + '</b>' +
      ' — if something looks wrong, quote this number so we know which version you are on.</p>' +
      '<p class="tiny muted">This demo keeps everything on this device. No account, ' +
      'no child data leaves the browser — which is also how the real product is designed (docs/07).</p></div>';
  };

  /* ================================================================== SHELL */
  var TABS = [['home', 'Home', 'chart'], ['map', 'Map', 'map'], ['stories', 'Stories', 'tree'],
              ['bhasha', 'Bhasha', 'script'], ['sanskaar', 'Sanskaar', 'star'], ['rishtey', 'Rishtey', 'parent'], ['itihaas', 'Itihaas', 'clock'], ['dharma', 'Dharma', 'temple'], ['mela', 'Mela', 'game'], ['worlds', 'Worlds', 'star'], ['me', 'Me', 'parent']];

  function chrome() {
    return '<header class="topbar"><div class="bar">' +
      '<div class="brand">' + mascot('gattu', 'happy', 34) + 'Bizzing <em>India</em></div>' +
      '<span class="pill stat">🐚 <span id="kauriCount">' + S.kauris + '</span></span>' +
      '<button class="iconbtn" data-act="night" aria-label="night mode">' + icon('lamp', 20) + '</button>' +
      '<button class="iconbtn" data-act="sound" aria-label="sound">' + icon('sound', 20) + '</button>' +
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
      case 'mela': h = V.mela(); break;
      case 'game': h = V.game(); break;
      case 'sanskaar': h = V.sanskaar(); break;
      case 'value': h = V.value(view.arg); break;
      case 'rishtey': h = V.rishtey(); break;
      case 'rishquiz': h = V.rishquiz(); break;
      case 'itihaas': h = V.itihaas(); break;
      case 'era': h = V.era(view.arg); break;
      case 'dharma': h = V.dharma(); break;
      case 'faith': h = V.faith(view.arg); break;
      case 'worlds': h = V.worlds(); break;
      case 'me': h = V.me(); break;
      default: h = V.home();
    }
    m.innerHTML = h;
    window.scrollTo(0, 0);

    var alias = { state: 'map', story: 'stories', pack: 'bhasha', game: 'mela', faith: 'dharma', era: 'itihaas', rishquiz: 'rishtey', value: 'sanskaar' };
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
    if (a === 'faith')  return go('faith', t.getAttribute('data-id'));
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
    if (a === 'deed') {
      var vid = t.getAttribute('data-id');
      S.mala = S.mala || [];
      S.mala.push({ v: vid, on: today() });
      save(); earn(5, 'you did it');
      toast('A bead for your mala.');
      return render();
    }
    if (a === 'deednani') {
      var vv = window.IND_SANSKAAR.values.filter(function (x) { return x.id === t.getAttribute('data-id'); })[0];
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
    if (a === 'say')    return speak(t.getAttribute('data-k'));
    if (a === 'pick')   { S.buddy = t.getAttribute('data-id'); save(); return render(); }
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
      rec.asked++; if (ok) rec.correct++; save();
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
  });

  document.addEventListener('DOMContentLoaded', function () {
    render();
    window.BI = { S: S, go: go, render: render, Store: Store };
  });
})();
