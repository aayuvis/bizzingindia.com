/* Bizzing India — app shell.
   Vanilla, no build. state -> render() string templates, clicks dispatch via data-act,
   the idiom Bizzing Bee uses. Everything hangs off window globals.

   Storage goes through the Store seam from the first commit (docs/07 §1) — today it is
   localStorage, tomorrow Supabase, and no caller changes. */

(function () {
  'use strict';

  /* =================================================================== STORE */
  var Store = {
    KEY: 'bi_v1', DEV: 'bi_device', HOUSE: 'bi_house', schemaVersion: 3,
    /* A HOUSEHOLD OF CHILDREN (family standard §5; FIX-INDIA B7). There used to be one
       profile per device, so a second child either shared the first one's stories, coins
       and map or wiped them. Now `bi_house` names the children and which one is playing:
         { v:1, active:'k1', order:['k1','k2'], next:3, adding:null }
       THE FIRST CHILD KEEPS THE KEYS IT ALWAYS HAD; every later child gets the same keys
       with its id appended (bi_v1 → bi_v1.k2, india.sabhyata.v2 → india.sabhyata.v2.k2).
       So an existing device needs no migration to become a household of one, nothing a
       child owns can be read under another child's id, and kidKey() is the only place
       that decides it. Switching reloads the page, so no module can keep a reference to
       the last child's state across the switch. */
    house: function () {
      try { var h = JSON.parse(localStorage.getItem(this.HOUSE) || 'null');
            if (h && h.order && h.order.length && h.order.indexOf(h.active) >= 0) return h; } catch (e) {}
      return { v: 1, active: 'k1', order: ['k1'], next: 2, adding: null };
    },
    saveHouse: function (h) { try { localStorage.setItem(this.HOUSE, JSON.stringify(h)); } catch (e) {} },
    kidKey: function (base, id) { id = id || this.house().active; return id === 'k1' ? base : base + '.' + id; },
    /* every key a child owns, so removing a child removes all of them */
    KID_KEYS: ['bi_v1', 'india.sabhyata.v2', 'india.rangoli.lvl'],
    kids: function () {
      var h = this.house(), self = this;
      return h.order.map(function (id) {
        var p = null;
        try { p = JSON.parse(localStorage.getItem(self.kidKey(self.KEY, id)) || 'null'); } catch (e) {}
        p = p || {};
        return { id: id, name: p.name || '', buddy: p.buddy || 'pt_tortoise', started: !!p.started, active: id === h.active };
      });
    },
    /* a new child: their own empty keys, and onboarding next (the grown-ups' page) */
    addKid: function () {
      var h = this.house(), id = 'k' + (h.next || h.order.length + 1);
      h.next = (h.next || h.order.length + 1) + 1;
      h.order.push(id); h.active = id; h.adding = id;
      this.saveHouse(h);
      return id;
    },
    switchKid: function (id) {
      var h = this.house();
      if (h.order.indexOf(id) < 0) return false;
      h.active = id; this.saveHouse(h); return true;
    },
    removeKid: function (id) {
      var h = this.house(), self = this;
      id = id || h.active;
      try { this.KID_KEYS.forEach(function (b) { localStorage.removeItem(self.kidKey(b, id)); }); } catch (e) {}
      h.order = h.order.filter(function (x) { return x !== id; });
      if (h.adding === id) h.adding = null;
      if (!h.order.length) { try { localStorage.removeItem(this.HOUSE); } catch (e) {} return; }
      if (h.active === id) h.active = h.order[0];
      this.saveHouse(h);
    },
    loadProfile: function (id) {
      try { var raw = localStorage.getItem(this.kidKey(this.KEY, id)); return raw ? this.migrate(JSON.parse(raw)) : null; }
      catch (e) { return null; }
    },
    /* never stamp an OLDER version on data a newer build wrote (migrate() leaves it alone too) */
    saveProfile: function (b) { if (!(b.schemaVersion > this.schemaVersion)) b.schemaVersion = this.schemaVersion; try { localStorage.setItem(this.kidKey(this.KEY), JSON.stringify(b)); } catch (e) {} },
    /* the other keys a child owns (a Sabhyata save, the rangoli level) and the ones the
       household shares (the family pass), for the engines that load before this file */
    kidGet: function (base) { try { return localStorage.getItem(this.kidKey(base)); } catch (e) { return null; } },
    kidSet: function (base, v) { try { localStorage.setItem(this.kidKey(base), v); } catch (e) {} },
    kidDel: function (base) { try { localStorage.removeItem(this.kidKey(base)); } catch (e) {} },
    famGet: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    famSet: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    famDel: function (k) { try { localStorage.removeItem(k); } catch (e) {} },
    loadDevice: function (k, d) { try { var o = JSON.parse(localStorage.getItem(this.DEV) || '{}'); return (k in o) ? o[k] : d; } catch (e) { return d; } },
    saveDevice: function (k, v) { try { var o = JSON.parse(localStorage.getItem(this.DEV) || '{}'); o[k] = v; localStorage.setItem(this.DEV, JSON.stringify(o)); } catch (e) {} },
    /* VERSIONED, ONE STEP AT A TIME (family standard §5). A profile is walked up through
       vN_to_vN+1 steps and never down: data newer than this code is left exactly as it
       is rather than "migrated" into an older shape. Never edit an old step — add one. */
    migrate: function (b) {
      if (!b.schemaVersion) b.schemaVersion = 1;
      if (b.schemaVersion > this.schemaVersion) return b;
      while (b.schemaVersion < this.schemaVersion) {
        var step = this.STEPS[b.schemaVersion];
        if (!step) break;
        step(b); b.schemaVersion++;
      }
      return b;
    },
    STEPS: {
      /* v1_to_v2 — THE FAMILY WALLET. India's sikke (and the kauris before them) become
         Bizzing coins, 1:1, once. The amount is held on the profile until the wallet takes
         it at boot (it needs the child's name), and rank no longer reads coins at all. */
      1: function v1_to_v2(b) {
        b.coinsToMove = Math.max(0, Math.floor((b.sikke != null ? b.sikke : b.kauris) || 0));
        b.sikke = 0; b.xp = 0;
      },
      /* v2_to_v3 — THE FAMILY'S 96 (standard §8; FIX-INDIA §2). Avatars and worlds moved to the
         family engine: tiers, printed prices, two free worlds. NOTHING A CHILD HELD IS TAKEN
         AWAY: every card that was open to them under the old rules (the sacred and epic packs
         and the Panchatantra six were free to all; packs and cards they bought) and every world
         they could use (Diwali Nights was free) is written into what they own. The lists are
         frozen here as they stood on 2 Oct 2026 — this step must never read today's packs. */
      2: function v2_to_v3(b) {
        var own = b.own = b.own || {}; own.avatars = own.avatars || []; own.worlds = own.worlds || []; own.packs = own.packs || [];
        var OLD = {
          devas: ['ganesha','krishna','hanuman','durga','saraswati','shiva','rama','lakshmi','buddha','mahavira','khanda'],
          panch: ['pt_lion','pt_crow','pt_tortoise','pt_mouse','pt_monkey','pt_rabbit'],
          darbar: ['akbar','birbal','tansen'],
          great: ['ashoka','shivaji','lakshmibai','gandhi','ambedkar','bhagat','kalam','savitribai'],
          khel: ['dhyanchand','milkha','sachin','marykom','sindhu','neeraj','mirabai','avani'],
          naya: ['kurien','sudha_murty','ela_bhatt','falguni','rocket'],
          vigyan: ['raman','ramanujan','jcbose','janaki_ammal','swaminathan'],
          ramayana: ['sita','lakshmana','ravana','vibhishana','jatayu','shabari','valmiki'],
          mahabharata: ['draupadi','arjuna','bhima','yudhishthira','karna','bhishma','gandhari','ekalavya'],
          dashavatara: ['matsya','kurma','varaha','narasimha','vamana','parashurama','balarama','kalki'],
          pantheon: ['indra','agni','surya','ganga','parvati','kartikeya'],
          asuras: ['bali','prahlada','hiranyakashipu','shukracharya','mahishasura']
        };
        var FREE = ['devas', 'ramayana', 'mahabharata', 'dashavatara', 'pantheon', 'asuras', 'panch'];
        var add = function (id) { if (own.avatars.indexOf(id) < 0) own.avatars.push(id); };
        Object.keys(OLD).forEach(function (p) {
          if (FREE.indexOf(p) >= 0 || own.packs.indexOf(p) >= 0) OLD[p].forEach(add);
        });
        if (b.buddy) add(b.buddy);
        if (b.started && own.worlds.indexOf('diwali') < 0) own.worlds.push('diwali');
        if (b.world && ['delhi6', 'madhubani'].indexOf(b.world) < 0 && own.worlds.indexOf(b.world) < 0) own.worlds.push(b.world);
      }
    },
    /* THE FAMILY'S BACKUP: every child and what each one owns, in one file. Restoring it
       puts the household back exactly as it was; a single-child file from before the
       household (it has `started` at the top) restores into the child playing now. */
    backup: function () {
      var h = this.house(), self = this, out = { kind: 'bizzing-india-household', v: 1, house: h, keys: {} };
      h.order.forEach(function (id) {
        self.KID_KEYS.forEach(function (b) { var k = self.kidKey(b, id), v = null;
          try { v = localStorage.getItem(k); } catch (e) {} if (v != null) out.keys[k] = v; });
      });
      return out;
    },
    restore: function (o) {
      if (!o || typeof o !== 'object') return false;
      if (o.kind === 'bizzing-india-household' && o.house && o.keys) {
        var self = this, ok = /^(bi_v1|india\.sabhyata\.v2|india\.rangoli\.lvl)(\.k\d+)?$/;
        this.house().order.forEach(function (id) { self.KID_KEYS.forEach(function (b) {
          try { localStorage.removeItem(self.kidKey(b, id)); } catch (e) {} }); });
        Object.keys(o.keys).forEach(function (k) { if (ok.test(k)) try { localStorage.setItem(k, o.keys[k]); } catch (e) {} });
        this.saveHouse(o.house);
        return true;
      }
      if ('started' in o) { this.saveProfile(o); return true; }
      return false;
    },
    /* the grown-ups' Erase, through the seam like everything else: this child only */
    erase: function () { this.removeKid(); },
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
      /* the demo is a sandbox: a voice recorded in it is not kept */
      if (!window.indexedDB || window.IND_DEMO) return fn(null);
      var rq = indexedDB.open(this.DB, 1), self = this;
      rq.onupgradeneeded = function () { rq.result.createObjectStore(self.STORE, { keyPath: 'id' }); };
      rq.onsuccess = function () { fn(rq.result); };
      rq.onerror = function () { fn(null); };
    },
    putClip: function (rec, fn) {
      this._db(function (db) {
        if (!db) return fn && fn(false);
        var t = db.transaction(Store.STORE, 'readwrite');
        rec.kid = rec.kid || Store.house().active;          /* a voice belongs to one child */
        t.objectStore(Store.STORE).put(rec);
        t.oncomplete = function () { fn && fn(true); };
        t.onerror = function () { fn && fn(false); };
      });
    },
    listClips: function (fn) {
      this._db(function (db) {
        if (!db) return fn([]);
        var rq = db.transaction(Store.STORE).objectStore(Store.STORE).getAll();
        var me = Store.house().active;
        rq.onsuccess = function () {
          fn((rq.result || []).filter(function (r) { return (r.kid || 'k1') === me; })
            .sort(function (a, b) { return b.at - a.at; }));
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

  /* the engines that load before this file (Sabhyata, the games, the pass) reach storage
     through the same seam at run time — one place decides whose key a thing is */
  window.IND_STORE = Store;

  /* =================================================================== STATE */
  /* ?DEMO — a sample child with a few weeks of believable progress (family standard §14).
     demo.js has already put this page's storage in a sandbox, so everything below lands
     in memory, never in the real household. Every number is made the way a child would
     make it — real stories finished, the real language path walked, a real course test
     passed on a later day than its teaching, coins paid through the wallet's own earn() on
     the days they were earned — so the demo shows the app's rules working, not a mock-up. */
  function seedDemo() {
    var D = 864e5, now = Date.now();
    var iso = function (d) { return new Date(now - d * D).toISOString().slice(0, 10); };
    var num = function (d) { var t = new Date(now - d * D); return t.getFullYear() * 10000 + (t.getMonth() + 1) * 100 + t.getDate(); };
    var days = [20, 18, 17, 15, 12, 10, 9, 6, 4, 2, 1];
    var P = {
      schemaVersion: 2, name: 'Meera', age: 8, mode: 'bade', tongue: 'ta',
      buddy: 'pt_tortoise', world: 'delhi6', voice: 'f', hindi: false, rate: 1,
      sikke: 0, xp: 0, own: { worlds: [], packs: [], avatars: [] },
      lit: {}, read: {}, lang: {}, recited: {}, mala: [],
      streak: { days: days.map(iso), last: iso(1), count: 0 },
      goal: 3, todayCount: 0, todayOn: null, started: iso(21), resume: {}, last: null
    };
    /* eighteen stories finished, from different corners, each lighting its place */
    var st = allStories().filter(function (x) { return (x.place || []).length; }), seen = {};
    for (var i = 0, n = 0; i < st.length && n < 18; i += 7) {
      var c = st[i].place[0].replace('IN-', '');
      if (seen[c] && n > 8) continue;
      seen[c] = 1; P.read[st[i].id] = true; P.lit[c] = true; n++;
    }
    var open = st.filter(function (x) { return !P.read[x.id]; })[3];
    if (open) P.resume.story = { id: open.id, at: now - 2 * D, i: 2 };
    /* the mala: things she did, on the days she did them */
    var K = window.IND_NEETI;
    if (K) [19, 17, 15, 12, 9, 6, 4, 2, 1].forEach(function (d, k) {
      P.mala.push({ v: K.values[k % K.values.length].id, on: iso(d) });
    });
    if (window.IND_SHLOK) window.IND_SHLOK.verses.slice(0, 2).forEach(function (v, k) { P.recited[v.id] = iso(14 - k * 5); });
    /* Tamil, the family's language: the first rung met and mastered, three lessons into the second */
    var B = window.IND_BHASHA, pk = (window.IND_PACKS || {}).ta;
    if (B && pk && pk.stages) {
      var rec = P.lang.ta = { asked: 0, correct: 0, srs: {}, stages: {}, window: [], path: 'beginner', band: 2 };
      var card = function (key, box, d) {
        rec.srs[key] = { key: key, box: box, seen: box + 1, right: box, intro: now - d * D, last: now - d * D,
                         due: now + (box > 2 ? 3 : 1) * D };
      };
      pk.stages.slice(0, 2).forEach(function (sg, si) {
        var k = 0;
        B.path('ta', sg.id).forEach(function (u) {
          u.lessons.forEach(function (l) {
            if (si === 1 && k >= 3) return;
            l.keys.forEach(function (key) { card(key, si ? 1 : 3, si ? 2 + k : 16 - k); });
            k++;
          });
        });
        var right = si ? 9 : 14;
        rec.stages[sg.id] = { asked: right + 3, correct: right };
        rec.asked += right + 3; rec.correct += right;
      });
      P.resume.pack = { id: 'ta', at: now - 1 * D };
      P.last = { k: 'lesson', t: 'Tamil', place: '', at: now - 1 * D };
    }
    /* a course: the first part taught, its test passed on a later day, its project made */
    var CP = window.IND_PAATH && window.IND_PAATH.courses.filter(function (x) { return !x.premium; })[0];
    if (CP) {
      var m0 = CP.modules[0], m1 = CP.modules[1], seenL = {};
      var lidOf = function (m, l) { return m.id + '.' + l.n.slice(0, 18); };
      m0.lessons.forEach(function (l) { if (l.k !== 'c') seenL[lidOf(m0, l)] = num(14); });
      if (m1) seenL[lidOf(m1, m1.lessons[0])] = num(3);
      var mm = {}; mm[m0.id] = { on: num(12), tries: 1 };
      var made = {}; made[m0.project.id] = num(11);
      P.paath = { v: 1, c: {} };
      P.paath.c[CP.id] = { at: num(14), seen: seenL, made: made, note: {}, m: mm };
      P.resume.paath = { id: CP.id, at: now - 3 * D };
    }
    /* coins, through the wallet's own rules, on the days they were earned */
    var Wl = window.IND_WALLET;
    if (Wl) days.forEach(function (d, k) {
      var t = now - d * D;
      Wl.earn('india', P.name, 'stop', t);
      for (var a = 0; a < 6; a++) Wl.earn('india', P.name, 'answer', t + a);
      if (k % 3 === 0) Wl.earn('india', P.name, 'contest', t + 9);
    });
    Store.saveProfile(P);
    return P;
  }
  var S = Store.loadProfile() || {
    schemaVersion: 3, name: '', age: 8, mode: 'bade',
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
  /* and the coins themselves, into the family wallet (Store v1_to_v2 measured them). The
     wallet is the family's ES module (family/bridge.js), which runs after this file is
     parsed — so this waits for boot(), where the wallet is always in place. */
  function moveOldCoins() {
    if (S.coinsToMove > 0 && S.name && window.IND_WALLET) {
      window.IND_WALLET.migrateFrom('india', S.name, S.coinsToMove);
      S.coinsToMove = 0; Store.saveProfile(S);
    }
  }
  if (!S.own) S.own = { worlds: [], packs: [], avatars: [] };
  S.own.worlds = S.own.worlds || []; S.own.packs = S.own.packs || []; S.own.avatars = S.own.avatars || [];

  var view = { name: 'home', arg: null };
  var lastScrollSig = '';
  var soundOn = Store.loadDevice('sound', true);
  /* the one mute (standard §9): sfx.js asks here before every sound */
  window.IND_SFX_MUTED = function () { return !soundOn; };
  function sfx(k) { if (window.IND_SFX) window.IND_SFX.play(k); }
  var night = Store.loadDevice('night', false);
  function save() { Store.saveProfile(S); }

  /* the Gurukul rank ladder — every theme in Bizzing Bee carries one of these */
  var RANKS = ['Shishya', 'Vidyarthi', 'Sadhak', 'Khoji', 'Pandit', 'Vidwan', 'Acharya', 'Rishi'];
  /* RANK MOVES ONLY ON LEARNING (family standard §6). It used to be XP, and XP was coins —
     so a lucky Ludo game moved a child up the Gurukul. Now it counts evidence only: course
     objectives learned under the day rule, and Bhasha rungs mastered. Time, dice, games and
     coins cannot move it, because none of them is in the count. */
  var RANK_AT = [0, 1, 3, 6, 10, 15, 21, 28];
  function mastered() {
    /* the courses and the language engine are route groups now (loader.js): until they
       are here, the count is the one last measured with them (S.grown, kept by checkGrowth) */
    if (!window.IND_PAATH_UI || !window.IND_BHASHA || !window.IND_PACKS) return (S.grown && S.grown.m) || 0;
    var n = 0;
    try {
      var U = paathUI();
      if (U) U.report().forEach(function (r) { n += r.mastered || 0; });
    } catch (e) {}
    var P = window.IND_PACKS || {};
    Object.keys(P).forEach(function (id) {
      (P[id].stages || []).forEach(function (s) { try { if (stageMastered(id, s)) n++; } catch (e) {} });
    });
    return n;
  }
  /* the evidence, by source — what the medals and the report card read */
  function evidence() {
    var e = { read: Object.keys(S.read || {}).length, lit: Object.keys(S.lit || {}).length,
              objectives: 0, rungs: 0, made: 0 };
    try {
      var U = paathUI();
      if (U) { U.report().forEach(function (r) { e.objectives += r.mastered || 0; });
               e.made = ((U.shelf && U.shelf().marked) || []).length; }
    } catch (x) {}
    var P = window.IND_PACKS || {};
    Object.keys(P).forEach(function (id) {
      (P[id].stages || []).forEach(function (s2) { try { if (stageMastered(id, s2)) e.rungs++; } catch (x) {} });
    });
    e.rank = level();
    return e;
  }

  /* MEDALS FROM EVIDENCE (family standard §8; FIX-INDIA I4). Each is earned by something
     the app SAW — a story finished, a place lit, a rung or an objective mastered under its
     own rules, a project the workshop marked — never by a tap that says "I did it", never
     by days in a row, never by coins. Each is celebrated once, then kept on the shelf with
     what earned it. Medallion tiers: bronze · silver · gold. */
  var MEDALS = [
    { id: 'story1',  tier: 'bronze', glyph: 'tree',   name: 'First story',          how: 'Hear a whole story, start to finish.',            ok: function (e) { return e.read >= 1; } },
    { id: 'story10', tier: 'silver', glyph: 'tree',   name: 'Ten stories',          how: 'Finish ten stories.',                              ok: function (e) { return e.read >= 10; } },
    { id: 'story50', tier: 'gold',   glyph: 'tree',   name: 'Fifty stories',        how: 'Finish fifty stories.',                            ok: function (e) { return e.read >= 50; } },
    { id: 'place1',  tier: 'bronze', glyph: 'map',    name: 'The mist lifts',       how: 'Light your first place on the map.',               ok: function (e) { return e.lit >= 1; } },
    { id: 'place10', tier: 'silver', glyph: 'map',    name: 'Ten places remembered', how: 'Light ten places on the map.',                    ok: function (e) { return e.lit >= 10; } },
    { id: 'placeAll',tier: 'gold',   glyph: 'map',    name: 'All of India',         how: 'Light every place on the map.',                    ok: function (e) { return e.lit >= nPlaces(); } },
    { id: 'rung1',   tier: 'bronze', glyph: 'script', name: 'First rung',           how: 'Master a rung of a language — or test out of it.', ok: function (e) { return e.rungs >= 1; } },
    { id: 'rung3',   tier: 'silver', glyph: 'script', name: 'Three rungs',          how: 'Master three rungs.',                              ok: function (e) { return e.rungs >= 3; } },
    { id: 'obj1',    tier: 'bronze', glyph: 'book',   name: 'It stayed',            how: 'Pass a course test on a later day than its lesson.', ok: function (e) { return e.objectives >= 1; } },
    { id: 'obj5',    tier: 'silver', glyph: 'book',   name: 'Five that stayed',     how: 'Five course tests, each on a later day.',           ok: function (e) { return e.objectives >= 5; } },
    { id: 'made1',   tier: 'bronze', glyph: 'star',   name: 'Made by hand',         how: 'Finish a course project the workshop can check.',  ok: function (e) { return e.made >= 1; } },
    { id: 'sadhak',  tier: 'gold',   glyph: 'lamp',   name: 'Sadhak',               how: 'Reach the rank of Sadhak — three things mastered.', ok: function (e) { return e.rank >= 2; } }
  ];
  function medalHTML(m, size, got) {
    return '<span class="medal ' + m.tier + (got ? '' : ' unearned') + '" style="--md:' + (size || 72) + 'px" aria-hidden="true">' +
      '<span class="md-ring"></span><span class="md-face">' + icon(m.glyph, Math.round((size || 72) * 0.36)) + '</span></span>';
  }
  /* new medals are found after the things that can earn them; each is shown ONCE */
  var celebrating = [];
  /* `quiet`: evidence from before medals existed (a profile with no shelf yet, or mastery first
     measured when its engine arrives) goes ON THE SHELF without a fanfare — a celebration is for
     what was just done, never a pop-up over whatever the child is doing now */
  function checkMedals(quiet) {
    if (!S.started) return;
    var first = !S.medals;
    var e = evidence(), got = S.medals || (S.medals = {}), fresh = [];
    MEDALS.forEach(function (m) { if (!got[m.id] && m.ok(e)) { got[m.id] = today(); fresh.push(m); } });
    if (!fresh.length) { if (first) save(); return; }
    save();
    if (first || quiet === true) return;
    fresh.forEach(function (m) { celebrating.push(m); milestone('mastery', 'Medal: ' + m.name); });
    showCelebration();
  }
  /* THE CELEBRATION (family standard §8; FIX-INDIA J1): specific — it names what was done —
     with motion and a sound, and never a word about any other child */
  function showCelebration() {
    if ($('#celebrate') || !celebrating.length) return;
    var m = celebrating.shift(), d = document.createElement('div');
    d.id = 'celebrate'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-label', 'New medal: ' + m.name);
    d.innerHTML = '<div class="cel-in"><div class="cel-burst" aria-hidden="true">' + new Array(13).join('<i></i>') + '</div>' +
      '<span class="cel-peacock" aria-hidden="true">' + peacock('cheer', 84) + '</span>' +
      medalHTML(m, 132, true) +
      '<span class="mono">A new medal</span><h2>' + esc(m.name) + '</h2>' +
      '<p>' + esc(m.how.replace(/\.$/, '')) + ' — and you did.</p>' +
      '<button class="btn lg" data-act="celok">Shabash! →</button></div>';
    document.body.appendChild(d);
    sfx('medal');
    var b = d.querySelector('[data-act="celok"]'); if (b) b.focus();
  }
  function level() {
    var m = mastered(), i;
    for (i = RANK_AT.length - 1; i > 0; i--) if (m >= RANK_AT[i]) return i;
    return 0;
  }
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
    if (window.IND_AV_WEBP && window.IND_AV_WEBP.indexOf(id) >= 0)
      return '<img src="art/av/' + id + '.webp" width="' + (size || 76) + '" height="' + (size || 76) + '" alt="" loading="lazy" decoding="async">';
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
    if (!q) return q && q.en;
    if (!t || t.id === 'hi') return naniFill(q.en);
    return naniFill(q.en.replace(/^(Nani|Nana|Dadi|Dada)\b/, kinTerm(q.to)));
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
  /* `sel` is which id counts as chosen. It defaults to the saved buddy, but onboarding
     passes its own — otherwise the pick-one screen opens with the DEFAULT buddy already
     ringed, which reads as a question that has been answered for you. */
  function chip(id, size, act, sel) {
    var r = window.IND_RARITY_OF ? window.IND_RARITY_OF(id) : 'free';
    var meta = (window.IND_RARITY || {})[r] || {};
    var on = (sel === undefined ? S.buddy : sel) === id;
    return '<button class="avchip' + (on ? ' on' : '') + '" data-rar="' + r +
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
  /* Until the `content` group has loaded (loader.js), the first screen reads the shell
     index: one light row per story — id, title, hook, place, how many scenes — in the
     same order, so the daily pick and Continue name the same story either way. */
  var lightStories = null;
  function allStories() {
    if (!window.IND_STORIES && window.IND_INDEX) {
      if (!lightStories) lightStories = window.IND_INDEX.stories.map(function (r) {
        return { id: r[0], title: r[1], hook: r[2], place: r[3] ? [r[3]] : [], collection: r[4],
                 scenes: new Array(r[5]), minutes: r[6], badge: r[7], light: true };
      });
      return lightStories;
    }
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
  /* COINS ARE FOR LEARNING, AT THE FAMILY'S AMOUNTS (standard §1): a right answer 1, a
     story or lesson finished 5, a contest finished 10, something mastered 20 — through the
     one family wallet, which also holds the 100-a-day lid. There is no event for time,
     taps, dice or luck, so none of them can pay. */
  function earn(ev, why) {
    var Wl = window.IND_WALLET;
    var n = Wl ? Wl.earn('india', S.name, ev) : 0;
    if (n) toast('🪙 +' + n + (why ? ' · ' + why : ''));
    paintCoins();
    return n;
  }
  function coins() { return window.IND_ECONOMY ? window.IND_ECONOMY.coins(S) : 0; }
  /* the shell's coin chip follows every earning at once, not at the next render */
  function paintCoins() {
    var n = coins(), el = $('#kauriCount'); if (el) el.textContent = n;
    var c = $('[data-bz=coins]');
    if (c) { var sp = c.querySelector('span'); if (sp) sp.textContent = n; c.setAttribute('aria-label', n + ' Bizzing coins — your coin history'); }
  }
  /* GOOD DAYS THIS WEEK, never a run of days (standard §8). A day off costs nothing. */
  function goodDays() {
    var cut = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10), seen = {};
    ((S.streak && S.streak.days) || []).forEach(function (d) { if (d >= cut) seen[d] = 1; });
    return Object.keys(seen).length;
  }
  function markToday() {
    var d = today();
    if (S.todayOn !== d) { S.todayOn = d; S.todayCount = 0; }
    S.todayCount++;
    if (S.streak.last !== d) {
      /* the days themselves, for "good days this week" — no run is counted */
      S.streak.last = d; S.streak.days.push(d);
      if (S.streak.days.length > 30) S.streak.days = S.streak.days.slice(-30);
    }
    save();
  }
  /* WHAT THE CHILD DID LAST, so the greeting can say something true about it (family
     standard §2.2: a speech bubble specific to what the child did last) */
  /* what the child did last, and the last few things (S.recent): My Feed reads them to say
     "Because you read …" — kept on the child's own profile, never sent anywhere */
  function lastDid(k, t, place, more) {
    S.last = { k: k, t: String(t || ''), place: place || '', at: Date.now() };
    var r = Object.assign({ k: k, t: String(t || ''), at: S.last.at }, more || {});
    S.recent = [r].concat((S.recent || []).filter(function (x) { return !(x.k === r.k && x.id && x.id === r.id); })).slice(0, 10);
    save();
  }
  function lightState(c) {
    if (!c || S.lit[c]) return false;
    S.lit[c] = true; save();
    milestone('world', stateName(c) + ' remembered');
    return true;
  }

  /* ================================================== THE HIVE'S FEED (standard §13)
     bizzing-activity.js counts ACTIVE minutes for the child playing, and milestones are
     written as they happen: a story finished (stop), a place lit (world), something
     mastered (mastery), a new Gurukul rank (band). Never in the demo — the sample child
     is not anybody's child, and her feed would be read by the Hive as if she were. */
  var activityOn = false;
  function startActivity() {
    if (activityOn || window.IND_DEMO || !S.started || !window.IND_ACTIVITY) return;
    activityOn = true;
    window.IND_ACTIVITY.trackActivity('india', function () { return S.name; });
  }
  function milestone(ev, label) {
    if (window.IND_DEMO || !S.started || !S.name || !window.IND_ACTIVITY) return;
    window.IND_ACTIVITY.trackMilestone('india', S.name, ev, label);
  }
  /* mastery and rank are DERIVED (mastered(), level()), so growth is noticed by comparing
     with what was last seen — once each, and never on the way down */
  function checkGrowth(quiet) {
    setTimeout(function () { checkMedals(quiet); }, 0);
    var out = { m: 0, l: false };
    if (!window.IND_PAATH_UI || !window.IND_BHASHA || !window.IND_PACKS) return out;
    /* growth is measured from the first time it CAN be measured: what a child already had
       before this build is not news, and announcing it as new would be the feed's first lie */
    if (!S.grown) { S.grown = { m: mastered(), l: level() }; save(); return out; }
    var g = S.grown, m = mastered(), l = level();
    if (m > g.m) { out.m = m - g.m; milestone('mastery', m + ' thing' + (m === 1 ? '' : 's') + ' mastered'); g.m = m; }
    if (l > g.l) { out.l = true; milestone('band', 'Rank: ' + RANKS[l]); g.l = l; }
    if (out.m || out.l) save();
    return out;
  }

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
    if (!narrationOn()) return;
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
        audio.volume = Math.max(0, Math.min(1, dev.vol + 0.2));
        /* the music steps back while the voice speaks (standard §11: ducking) */
        if (window.IND_AUDIO) {
          window.IND_AUDIO.duck(true);
          var undk = function () { window.IND_AUDIO.duck(false); };
          audio.addEventListener('ended', undk); audio.addEventListener('pause', undk); audio.addEventListener('error', undk);
        }
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
    if (!narrationOn() || !window.speechSynthesis) return;
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
    if (!narrationOn()) return;
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
        /* the family card's own line (standard §8): its tier, and the path to it in plain words */
        (function () {
          var E = window.IND_ECONOMY, A = (window.IND_AVATAR_BY_ID || {})[id];
          if (!E || !A) return '';
          var st = E.stateOf(S, id);
          return '<div class="avpath"><span class="bz-tier" data-tier="' + A.tier + '">' + esc(st.label || A.tier) + '</span> ' +
            esc(st.say) + (A.about ? '<p class="tiny">' + esc(A.about) + '</p>' : '') + '</div>';
        })() +
        (mine
          ? '<span class="pill stat" style="margin-top:14px">Travelling with you ✓</span>'
          : (!window.IND_ECONOMY || window.IND_ECONOMY.avatarOpen(S, id))
            ? '<button class="btn lg" style="margin-top:14px" data-act="pick" data-id="' + id + '">Travel with me</button>'
            : (function () { var st = window.IND_ECONOMY.stateOf(S, id);
                return st.state === 'buy'
                  ? '<button class="btn lg' + (st.short ? ' ghost' : '') + '" style="margin-top:14px" data-act="buyav" data-id="' + id + '">' +
                    coinSvg(20) + ' ' + st.price + (st.short ? ' · ' + st.short + ' more to go' : ' — meet them') + '</button>'
                  : ''; })()) +
      '</div>';
  }

  V.avcard = function (id) {
    return '<button class="backlink" data-act="back">' + icon('back', 18) + ' Back</button>' +
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
    var nPlaces = nPlaces_();
    var nPacks = Object.keys(window.IND_PACKS || {}).length || ((window.IND_INDEX && window.IND_INDEX.packs) || []).length;
    var nWorlds = ((window.IND_WORLDS && window.IND_WORLDS.list) || []).length;
    /* the same daily pick Home's Continue offers a new child (storyOfDay) */
    var pick = storyOfDay();

    return '<div class="wrap">' +
      '<div class="hero">' +
        '<div>' +
          '<span class="eyebrow">' + mascot('gattu', 'happy', 26) + 'For Indian kids growing up anywhere</span>' +
          '<h1 style="margin-top:18px">Give your child<br>the India they<br>have not lived in.</h1>' +
          '<p class="lede">' + nStories + ' stories, a map of every state, and Hindi taught properly — ' +
          'read aloud from the first tap, so a four-year-old can use it on their own.</p>' +
          '<div class="row" style="margin:22px 0">' +
            '<button class="btn lg" data-act="begin">Start free →</button>' +
            /* there are no accounts, so no "I have an account" — a sample child instead (standard §20) */
            '<a class="btn ghost lg" href="?demo">See a sample child</a>' +
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
          /* READ IT, NOW (FIX-INDIA A3): the story plays before any setup; the questions
             come after it, from somebody who has just seen what the app is */
          (pick ? '<button class="btn block" data-act="guest" data-id="' + esc(pick.id) + '">Read it →</button>'
                : '<button class="btn block" data-act="begin">Read it →</button>') +
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
  /* ONE QUESTION AT A TIME, ASKED BY SOMEBODY.
     ==================================================================================
     The first version was a single scrolling form: a name box, an age slider, the
     language chips, a placement box that grew two more questions inside itself, and then
     EVERY avatar pack — a hundred and sixteen faces, seven headings, on the screen a
     family sees before they have seen the app. A form that long is not a welcome, it is
     a registration, and the only honest thing to do with it is answer it badly and get
     to the thing.

     This is Bizzing Finance's shape instead, because it works: one question per screen,
     ASKED BY A CHARACTER rather than printed as a label, and every answer says out loud
     what it changes — "no debt and no market before they are taught" is a better
     explanation of an age band than the number is. Two things are added here that the
     sibling does without: dots, because this flow is six steps rather than three, and a
     Back button, because a parent who mistypes an eight-year-old's name should not have
     to start the app over.

     WHAT IS OFFERED IS DELIBERATELY SMALL. Five companions, not a hundred and sixteen.
     Two worlds, not fifteen. Everything else is two taps away on the Me page and the
     screen says so — a first choice between five is a choice, and a first choice between
     a hundred and sixteen is a wall. */
  var ob = { step: 0, name: '', age: 0, buddy: null, world: null,
             place: { home: null, back: null } };

  /* THE STARTING FIVE. Four Panchatantra animals and Ganesha — and the mix is the point,
     not an accident of what was to hand. The wall behind this holds gods, saints and
     real people across four traditions, and a welcome screen that is mostly deities
     tells a Jain, Muslim, Sikh or Christian family whose app this is before they have
     read a word. A companion is a buddy, not a declaration. The animals belong to
     nobody, every one of them turns up in a story this app actually tells, and the whole
     shelf is one tap away on the Me page from the first minute.
     These five are also all free on day one (economy.js: `panch` is free, `devas` is
     never purchasable), so nothing here can be tapped and refused. */
  /* five Commons, free to every child from the first minute (standard §8, §16) */
  var OB_BUDDIES = ['pt_tortoise', 'pt_monkey', 'ganesha', 'royal_elephant', 'rocket'];

  /* TWO WORLDS, AND THEY ARE THE TWO FURTHEST APART — a real street in Old Delhi and a
     painting tradition from Mithila. Three are free (economy.js), but a choice between
     three streets is not a choice; a choice between a place and a craft shows what a
     world IS here. The other thirteen are on the Me page with their prices on them. */
  var OB_WORLDS = ['delhi6', 'madhubani'];

  /* age bands, and each one says what it changes rather than what it is */
  var OB_AGES = [
    [6,  '4 to 7',   'Big pictures, read aloud, nothing to type. The map plays, it does not quiz.'],
    [9,  '8 to 9',   'The map, the quizzes and the script. Stories get their harder half.'],
    [11, '10 to 12', 'Everything, including the parts of India’s history that are hard.']
  ];

  /* the companion asks it. A label is a form; a character asking is a conversation, and
     a four-year-old can tell the difference across a room. */
  function obSay(who, mood, html) {
    return '<div class="obsay">' + mascot(who, mood, 66) +
      '<div class="obbub">' + html + '</div></div>';
  }

  /* THE TYPED NAME SURVIVES EVERY RE-RENDER, not just the ones somebody remembered.
     Picking any chip rebuilds the screen, and the first version of the old form lost the
     name the moment you chose a buddy. Two belts: a delegated `input` listener that
     mirrors the box into `ob` as it is typed (Bizzing Finance's `R.fields`), and this,
     read just before any handler that re-renders. Either alone has failed once. */
  function obKeep() {
    var n = $('#nm');
    if (n) ob.name = n.value.trim();
  }

  function obSteps() {
    /* the placement step only exists when a language was named — asking whether anyone
       speaks "all of them" at home is not a question */
    var s = ['name', 'age', 'tongue'];
    if (S.tongue) s.push('place');
    return s.concat(['buddy', 'world']);
  }

  function obDots(i, n) {
    var out = '';
    for (var k = 0; k < n; k++) out += '<i class="' + (k <= i ? 'on' : '') + '"></i>';
    return '<div class="dots obdots">' + out + '</div>';
  }

  function obOpt(act, arg, title, sub) {
    return '<button class="opt obopt" data-act="' + act + '" data-v="' + esc(String(arg)) + '">' +
      '<b>' + title + '</b><span>' + sub + '</span></button>';
  }

  V.onboard = function () {
    var steps = obSteps();
    var i = Math.min(ob.step, steps.length - 1);
    var step = steps[i], tg = tongue(), body;

    if (step === 'name') {
      body = obSay('gattu', 'happy',
          '<b>Namaste. I am Gattu.</b><p>I remember every single thing about this country, ' +
          'and I have been waiting for somebody to show it to. What should I call you?</p>') +
        '<div class="card obcard">' +
          '<label class="tiny" style="font-weight:700" for="nm">Name</label>' +
          '<input id="nm" class="opt" style="margin:6px 0 16px" placeholder="Their name" ' +
            'value="' + esc(ob.name) + '" autocomplete="off" />' +
          '<button class="btn lg block" data-act="obnext">Next →</button>' +
          '<p class="tiny muted" style="margin:12px 0 0">Nothing you type here leaves this ' +
          'device. No email, no photograph, no account.</p>' +
        '</div>';

    } else if (step === 'age') {
      body = obSay('gattu', null,
          'Good to meet you, <b>' + esc(ob.name || 'yatri') + '</b>. How old are you? ' +
          'It changes what the app shows — the hard parts of India’s history wait ' +
          'until they are asked for.') +
        '<div class="card obcard">' +
          OB_AGES.map(function (a) { return obOpt('obage', a[0], a[1], a[2]); }).join('') +
        '</div>';

    } else if (step === 'tongue') {
      body = obSay('mithu', null,
          'What does your family speak at home?<p>Your family’s places rise to the top ' +
          'of the shelf, your state glows on the map, and the grandparent words become your ' +
          'own. Skip it or change it whenever you like — nothing is hidden either way.</p>') +
        '<div class="card obcard">' + tongueChips() +
          '<button class="btn lg block" style="margin-top:18px" data-act="obnext">' +
          (S.tongue ? 'Next →' : 'All of India, evenly →') + '</button>' +
        '</div>';

    } else if (step === 'place') {
      body = obSay('mithu', null,
          'Does anyone speak <b>' + (tg ? esc(tg.en) : 'it') + '</b> at home?' +
          '<p>A child who already understands the spoken words does not need to be taught ' +
          'what they mean — they need to read them. This decides where ' +
          (tg ? esc(tg.en) : 'the language') + ' starts.</p>') +
        '<div class="card obcard">' +
          obOpt('obplace', 'home:yes', 'Yes, it is spoken here',
            'Then it starts at the <b>script</b> — the ear is already ahead of the eye.') +
          obOpt('obplace', 'home:no', 'Not really',
            'Then it starts with the <b>ear</b> — sounds and meanings first, letters right after.') +
          (ob.place.home === 'yes'
            ? '<h3 style="margin:18px 0 6px">And does your child answer back?</h3>' +
              obOpt('obplace', 'back:yes', 'Yes', 'Speaking is there; reading is the work.') +
              obOpt('obplace', 'back:some', 'A little', 'Understands more than they say.') +
              obOpt('obplace', 'back:no', 'Not yet', 'Hears it every day, answers in English.')
            : '') +
        '</div>';

    } else if (step === 'buddy') {
      body = obSay('gattu', null,
          'Who travels with you?<p>Five to start with. There are a hundred and eleven ' +
          'more — gods, saints, the epic casts and real Indians — on your own page from ' +
          'the first minute, and you can change your mind any day.</p>') +
        '<div class="card obcard">' +
          '<div class="grid g4 obgrid">' +
            OB_BUDDIES.map(function (id) { return chip(id, 84, 'obbuddy', ob.buddy); }).join('') +
          '</div>' +
        '</div>';

    } else {
      body = obSay('gattu', 'happy',
          'Last one. What should it all look like?<p>A world repaints the whole app — a ' +
          'real street, a real craft — and names where it comes from. Thirteen more are on ' +
          'your page, and every one of them changes at night.</p>') +
        '<div class="card obcard">' +
          '<div class="grid g2">' + OB_WORLDS.map(function (id) {
            var w = (window.IND_WORLDS && window.IND_WORLDS.get(id)) || null;
            if (!w) return '';
            return '<button class="tile' + (ob.world === w.id ? ' on' : '') +
              '" data-act="obworld" data-w="' + w.id + '">' +
              (w.tile ? '<div class="wpreview live" data-world="' + w.id + '">' + w.tile + '</div>' : '') +
              '<div class="spread"><h3 style="margin:0">' + esc(w.name) + '</h3></div>' +
              '<div class="mono">' + esc(w.region) + '</div>' +
              '<p class="tiny" style="margin:8px 0 0">' + esc(w.note) + '</p></button>';
          }).join('') + '</div>' +
          '<button class="btn lg block" style="margin-top:18px" data-act="start">' +
            'Start the yatra →</button>' +
        '</div>';
    }

    /* a child being ADDED to the household can be un-added: the grown-up changed their mind */
    var adding = Store.house().adding;
    return '<div class="wrap obwrap">' +
      (adding ? '<div class="obadding"><span class="mono">A new child for this household</span>' +
        '<button class="pill" data-act="addcancel">Not now</button></div>' : '') +
      obDots(i, steps.length) +
      '<div class="obhead"><span class="mono">Step ' + (i + 1) + ' of ' + steps.length + '</span>' +
        (i ? '<button class="backlink obback" data-act="obback">' + icon('back', 16) +
             ' Back</button>' : '') + '</div>' +
      body + '</div>';
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

  /* ================================================================ MY FEED (docs/30)
     A feed a child can finish. app/feed.js ranks the 1,000 cards tools/build-feed.js cut from
     the corpus, on this device, from what this child has done; this draws today's session —
     about twenty cards and then a finished card — and the one question a card may ask.
     What it keeps (S.feed, on the child's own profile, through the Store seam): which cards
     were shown on which day, today's session, and which questions have paid. Nothing else,
     and nothing leaves the device. Scrolling earns nothing; only a right answer to a card's
     question pays, once, through the standard 'answer' event. */
  var feedPlay = {};            /* this visit's answers: id -> { st: 'right'|'wrong'|'shown', o } */
  function feedState() {
    var F = S.feed || (S.feed = {});
    F.seen = F.seen || {}; F.paid = F.paid || {};
    return F;
  }
  function feedOn() { return !S.feedOff; }
  function feedRungs() {
    var out = {}, P = window.IND_INDEX && window.IND_INDEX.packs || [];
    P.forEach(function (r) {
      var rec = (S.lang[r[0]] || {}).stages || {}, n = 0;
      Object.keys(rec).forEach(function (k) { var st = rec[k] || {}; if ((st.correct || 0) >= STAGE_TARGET || st.testout) n++; });
      out[r[0]] = n;
    });
    return out;
  }
  function feedChild() {
    var tg = tongue();
    return { band: window.IND_FEED.bandOf(S.age), read: S.read || {}, readN: Object.keys(S.read || {}).length, lit: S.lit || {},
      rungs: feedRungs(), langs: Object.keys(S.lang || {}).filter(function (k) { return (S.lang[k] || {}).asked > 0; }),
      tongue: tg ? tg.pack : null, world: S.world, recent: S.recent || [], lang: S.lang || {}, seen: feedState().seen };
  }
  function feedNames() {
    var n = {}, G = window.IND_GEO && window.IND_GEO.states || {}, X = window.IND_INDEX || {};
    Object.keys(G).forEach(function (c) { n[c] = G[c].name; });
    (X.names ? Object.keys(X.names) : []).forEach(function (c) { if (!n[c]) n[c] = X.names[c]; });
    (X.packs || []).forEach(function (r) { n['lang:' + r[0]] = r[1]; });
    var W = window.IND_WORLDS; if (W && W.get && S.world) { var wo = W.get(S.world); if (wo) n['world:' + S.world] = wo.name; }
    return n;
  }
  /* today's session: kept for the day, re-ranked when the child has done something new */
  function feedSession() {
    var F = feedState(), day = Math.floor(Date.now() / 864e5), ch = feedChild();
    var sig = JSON.stringify([ch.band, ch.readN, Object.keys(ch.lit).length, (S.recent || [])[0] && S.recent[0].at,
      ch.rungs, ch.tongue, S.world, window.IND_FEED.slippedOf(ch.lang, Date.now()).length]);
    if (F.day === day && F.sig === sig && F.ids && F.ids.length) return F.ids;
    var items = window.IND_FEED.decode(window.IND_FEED_INDEX);
    var list = window.IND_FEED.feedFor(ch, { now: Date.now(), items: items, names: feedNames() });
    F.day = day; F.sig = sig;
    F.ids = list.map(function (x) { return { id: x.id, g: x.g, why: x.why }; });
    list.forEach(function (x) { F.seen[x.id] = day; });
    /* the record of what was shown is pruned to a month, so it never grows without end */
    Object.keys(F.seen).forEach(function (k) { if (day - F.seen[k] > 30) delete F.seen[k]; });
    save();
    return F.ids;
  }
  var BADGE_WORD = { katha: ['🪔', 'Katha'], itihaas: ['📜', 'Itihaas'], aaj: ['🧭', 'Aaj'] };
  function feedCard(x, i) {
    var it = (window.IND_FEED_BODY || {})[x.id], ix = feedIndexOf(x.id);
    if (!it || !ix) return '';
    var b = BADGE_WORD[ix.badge] || BADGE_WORD.aaj;
    var lang = it.lang ? ' lang="' + esc(it.lang) + '"' : '';
    var btn = it.act
      ? '<button class="btn fd-go" data-act="' + esc(it.act.a) + '" data-id="' + esc(it.act.id) + '" data-n="' + esc(it.act.n) + '">' + esc(it.cta) + ' →</button>'
      : '<a class="btn fd-go" href="' + esc(it.route) + '">' + esc(it.cta) + ' →</a>';
    var body = '';
    if (it.play) {
      var P = feedPlay[x.id] || {}, ord = window.IND_FEED.order(x.id, it.play.opts.length);
      body = '<p class="fd-q">' + esc(it.play.q) + '</p>' +
        (it.text ? '<p class="fd-script"' + lang + '>' + esc(it.text) + '</p>' + (it.roman ? '<p class="fd-roman">' + esc(it.roman) + '</p>' : '') : '') +
        '<div class="fd-opts" role="group" aria-label="' + esc(it.play.q) + '">' + ord.map(function (o) {
          var cls = P.st && P.o === o ? (P.st === 'right' ? ' right' : ' wrong') : '';
          return '<button class="opt fd-opt' + cls + '" data-act="feedans" data-id="' + esc(x.id) + '" data-o="' + o + '"' +
            (P.st === 'right' || P.st === 'shown' ? ' disabled' : '') + '>' + esc(it.play.opts[o]) + '</button>';
        }).join('') + '</div>' +
        (P.st === 'wrong' ? '<p class="fd-held" role="status">Not quite. Have a think, then Continue.</p>' +
          '<button class="btn ghost" data-act="feedcont" data-id="' + esc(x.id) + '">Continue</button>' : '') +
        (P.st === 'right' ? '<p class="fd-after ok" role="status">Right! ' + esc(it.play.after) + '</p>' : '') +
        (P.st === 'shown' ? '<p class="fd-after" role="status">' + esc(it.play.after) + '</p>' : '');
    } else {
      body = (it.text ? '<p class="fd-script"' + lang + '>' + esc(it.text).replace(/\n/g, '<br>') + '</p>' : '') +
        (it.roman ? '<p class="fd-roman">' + esc(it.roman).replace(/\n/g, '<br>') + '</p>' : '') +
        (it.body ? '<p class="fd-body">' + esc(it.body) + '</p>' : '') +
        (it.source ? '<p class="fd-src">' + esc(it.source) + '</p>' : '') +
        (it.sources ? '<p class="fd-src">From: ' + esc(it.sources.slice(0, 2).join(' · ')) + '</p>' : '');
    }
    return '<article class="bz-card fd-card" tabindex="0" data-fid="' + esc(x.id) + '" data-kind="' + esc(ix.kind) + '" aria-label="' + esc(it.title) + '">' +
      (it.art ? '<img class="fd-art" src="' + esc(it.art) + '" alt="" loading="lazy" decoding="async">' : '') +
      '<div class="fd-in"><div class="fd-top"><span class="badge ' + esc(ix.badge) + '"><span aria-hidden="true">' + b[0] + '</span> ' + b[1] + '</span>' +
        '<span class="fd-why">' + esc(x.why || it.why || '') + '</span></div>' +
        '<h3>' + esc(it.title) + '</h3>' + body + '<div class="fd-row">' + btn + '</div></div></article>';
  }
  var feedIdx = null;
  function feedIndexOf(id) {
    if (!feedIdx && window.IND_FEED_INDEX) { feedIdx = {}; window.IND_FEED.decode(window.IND_FEED_INDEX).forEach(function (r) { feedIdx[r.id] = r; }); }
    return feedIdx && feedIdx[id];
  }
  V.feed = function () {
    var H = window.IND_SHELL.pageHead({ title: 'My Feed', sub: 'Picked for you from across the app — about twenty, and then it ends.' });
    if (!feedOn()) return H + emptyState('My Feed is switched off on this device. A grown-up can switch it back on behind the PIN.', 'Home', 'go', 'home');
    var ids = feedSession();
    var need = []; ids.forEach(function (x) { if (need.indexOf('feed-' + x.g) < 0) need.push('feed-' + x.g); });
    var miss = missingOf(need);
    if (miss.length) {
      var v0 = view;
      lastLoad = window.IND_LOAD(miss).then(function () { if (view === v0) render(); });
      return H + '<div class="card loadcard" role="status"><span class="ldots" aria-hidden="true"><i></i><i></i><i></i></span><b>Opening your feed…</b></div>';
    }
    return H + '<div class="fd-list" data-feed="1">' + ids.map(feedCard).join('') +
      '<article class="bz-card fd-card fd-end" tabindex="0" data-fid="end">' + peacock('cheer', 96) +
        '<h3>That’s today’s feed — you’ve seen it all.</h3>' +
        '<p class="fd-body">It ends here on purpose. Do something with it — then come back tomorrow, or after your next story, for new cards.</p>' +
        '<div class="fd-row"><a class="btn" href="#/stories">Go read →</a> <a class="btn ghost" href="#/khel">Go play →</a></div></article></div>';
  };
  /* a card's question: right pays once (the standard 'answer' event) and says why; wrong holds */
  function feedAnswer(id, o) {
    var it = (window.IND_FEED_BODY || {})[id]; if (!it || !it.play) return;
    var P = feedPlay[id] || {};
    if (P.st === 'right' || P.st === 'shown') return;
    if (o === it.play.a) {
      feedPlay[id] = { st: 'right', o: o };
      var F = feedState();
      if (!F.paid[id]) { F.paid[id] = Math.floor(Date.now() / 864e5); earn('answer', 'a question in My Feed'); save(); }
      sfx('right');
    } else { feedPlay[id] = { st: 'wrong', o: o }; sfx('wrong'); }
  }

  V.home = function () {
    var lit = Object.keys(S.lit).length, places = nPlaces();
    var lv = level(), mN = mastered();
    var hour = new Date().getHours();
    var greet = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
    /* the word of the hour arrives in the family's language when one is chosen */
    var tg = tongue();
    var Wd = (tg && tg.words && tg.words.length) ? tg.words : SHABD;
    var w = Wd[hour % Wd.length], q = SUBHASHITA[hour % SUBHASHITA.length];
    var wLang = (tg && tg.words) ? tg.lang : 'hi';
    var stp = nextStep();
    var ringN = (S.todayOn === today()) ? (S.todayCount || 0) : 0;
    var goal = S.goal || 3, ringDone = ringN >= goal, C = 2 * Math.PI * 44;
    var A = (window.IND_AVATAR_BY_ID || {})[S.buddy];
    var aj = aajState();

    /* HOME IS BEE'S THREE ROWS AND A FOOTER (owner, 2 Oct 2026; family standard §6), drawn by
       family/bizzing-shell.js home(), with India's own words in every slot:
         row 1  the greeting (the child's companion and a line about what they did last) ·
                the day's ring, with the rank as "Your level" · the word of the hour;
         row 2  ONE Continue — nextStep(), the same function #/continue uses — and the long
                journey, the map, with an outline button;
         row 3  Aaj ka's five minutes as the tip · the subhashita of the hour.
       What used to sit here as extra tiles — the ways in, the deed, ask-at-home, the language
       ask — lives in its own tab or in ☰; the footer keeps one line for each that matters. */
    var ring = '<div class="ind-ring"><svg class="goring" width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">' +
        '<circle cx="55" cy="55" r="44" class="bg"/>' +
        '<circle cx="55" cy="55" r="44" class="fg" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' +
          (C * (1 - Math.min(1, ringN / goal))).toFixed(1) + '" transform="rotate(-90 55 55)"/>' +
        '<text x="55" y="55">' + Math.min(ringN, 99) + '/' + goal + '</text></svg>' +
      '<div><b class="ind-ringt">' + (ringDone ? 'Ring closed — shabash!' : 'Today’s ring') + '</b>' +
        '<p>' + (ringDone ? 'Everything from here is extra shine.' : 'A story, a lesson, a game or the day’s deed — each one fills a notch.') + '</p>' +
        '<p class="ind-ringgoal">' + goal + ' a day · ' + goodDays() + ' good day' + (goodDays() === 1 ? '' : 's') + ' this week</p></div></div>';
    var homeHTML = window.IND_SHELL.home({
      greet: { mascot: A ? A.art : 'art/logo.png', hello: greet, name: (S.name || 'Yatri') + (window.IND_DEMO ? ' · sample' : ''), line: helloLine() },
      ring: { html: ring, foot: { kicker: 'Your level', title: rank() + (lv < RANKS.length - 1 ? ' · ' + (RANK_AT[lv + 1] - mN) + ' to ' + RANKS[lv + 1] : ''), href: '#/me' } },
      hour: { kicker: 'Word of the hour', title: w[0], sub: '/ ' + w[1] + ' / · ' + w[2], icon: 'clock',
              href: (window.IND_PACKS && window.IND_PACKS[wLang] && lexWord(window.IND_PACKS[wLang], w[0]))
                ? '#/wordcard/' + encodeURIComponent(wLang + ':' + w[0]) : '#/bhasha' },
      next: { plate: stp.art || 'art/banner/stories.jpg', chip: stp.meter || '', kicker: stp.kick, title: stp.title, sub: stp.sub || '',
              href: '#/continue', cta: 'Continue', icon: 'path',
              progress: { pct: Math.round(Math.min(1, (stp.n || 0) / Math.max(1, stp.of || 1)) * 100), label: stp.meter || '' } },
      second: { plate: 'art/banner/map.jpg', chip: lit + ' of ' + places + ' places', kicker: 'Your journey across India',
                title: 'The map of India', sub: 'Every story you finish lifts the mist off the place it came from.',
                href: '#/map', cta: 'Open the map', ctaIcon: 'map', progress: { pct: Math.round(lit / Math.max(1, places) * 100) } },
      tip: { kicker: 'Aaj ka · five minutes', href: '#/aaj',
             text: aj && aj.end ? 'Done for today — anything more is extra, and tomorrow there is another five.'
                 : aj ? 'You are part-way through today’s five minutes — carry on where you stopped.'
                      : 'A story, four new words and a look back. It starts and ends cleanly; nothing is lost for skipping.' },
      quote: { kicker: 'Subhashita of the hour', text: q[0], who: q[1], href: '#/shlok' },
      foot: homeFoot()
    });
    return homeHTML;
  };
  /* the footer: one line each for what used to be extra tiles, and the way to the rest */
  function homeFoot() {
    var bits = [];
    if (!S.tongue) bits.push('<a href="#/tongue">Your family’s language — tell us once</a>');
    /* the one thing the child is saving for (FIX-INDIA K10), with its price and how far the coins are */
    var sf = savingFor(), sv = sf.match(/<b>([^<]*)<\/b>/), pr = sf.match(/(\d+) coins/),
        to = sf.match(/data-v="([^"]*)" data-arg="([^"]*)"/);
    if (sv && pr) bits.push('<a class="ind-save" href="#/' + (to ? to[1] + '/' + to[2] : 'shop') + '">Saving for ' + sv[1] + ' — ' +
      Math.min(coins(), +pr[1]) + ' of ' + pr[1] + ' coins</a>');
    bits.push('<a href="#/neeti">Today’s deed</a>');
    bits.push('<a href="#/privacy">Privacy</a>');
    /* on its own card: the footer sits on the world's painting, which no colour can be read on */
    return '<span class="ind-foot">' + bits.join(' · ') + '</span>';
  }

  /* the greeting's line: about the last thing the child actually did, when it was this week */
  function helloLine() {
    var L = S.last;
    if (L && L.at && Date.now() - L.at < 7 * 864e5 && L.t) {
      if (L.k === 'story') return '“You finished ' + L.t + (L.place ? ' — and the mist lifted off ' + L.place : '') + '. Shall we find the next one?”';
      if (L.k === 'lesson') return '“Your ' + L.t + ' lesson is done — the next one is waiting.”';
      if (L.k === 'game') return '“Good game of ' + L.t + '. What shall we learn next?”';
    }
    return ['“Chalo — one story and a whole state wakes up.”',
            '“I remember every single thing. Come and see.”',
            '“The mist is thinner than yesterday. That was you.”'][new Date().getDate() % 3];
  }
  function waysIn() {
    var heard = Object.keys(S.read).length, P = window.IND_PACKS || {};
    var started = Object.keys(S.lang || {}).filter(function (k) { return P[k] && (S.lang[k].correct || 0) > 0; }).length;
    var X = window.IND_INDEX || {};
    var courses = window.IND_PAATH ? (window.IND_PAATH.courses || []).length : (X.courses || []).length;
    var games = (window.IND_GAMES || []).length || X.games || 0;
    if (!Object.keys(P).length && X.packs) X.packs.forEach(function (r) { P[r[0]] = { name: { en: r[1] } }; });
    var vals = window.IND_NEETI ? window.IND_NEETI.values.length : 0;
    var W5 = [
      ['stories', 'tree', 'Stories', heard + ' of ' + allStories().length + ' heard'],
      ['paath', 'book', 'Paathshala', courses + ' courses'],
      ['bhasha', 'script', 'Bhasha', started ? started + ' language' + (started === 1 ? '' : 's') + ' started'
                                             : Object.keys(P).length + ' languages'],
      ['neeti', 'star', 'Moral Science', vals + ' values'],
      ['khel', 'game', 'Play', games + ' games']
    ];
    return W5.map(function (x) {
      return '<button class="wayin" data-act="go" data-v="' + x[0] + '">' +
        '<span class="wi-ic">' + icon(x[1], 22) + '</span><b>' + esc(x[2]) + '</b>' +
        '<span class="tiny muted">' + esc(x[3]) + '</span></button>';
    }).join('');
  }
  /* =============================================================== AAJ KA
     FIVE MINUTES, AND IT ENDS (FIX-INDIA E1; family standard §2.4). One story, four new
     things in the family's language, and a look back — three questions from stories heard
     on EARLIER days, which is the spaced recall that makes a story stay — then a finish
     card that says what was done. Nothing here is a goal to keep up: skip a day and
     nothing is lost; there is no count of days. */
  function aajState() { var A = S.aaj; return (A && A.on === today()) ? A : null; }
  function aajPack() {
    var t = tongue(), P = window.IND_PACKS || {};
    return (t && t.pack && P[t.pack]) ? t.pack : (P.hi ? 'hi' : (Object.keys(P)[0] || null));
  }
  function aajStart() {
    var sd = storyOfDay(), pk = aajPack(), nx = (pk && window.IND_BHASHA) ? bNext(bPath(pk)) : null;
    S.aaj = { on: today(), at: Date.now(), story: sd ? sd.id : null, pack: pk,
              lesson: nx && nx.lesson ? nx.lesson.id : null,
              review: nx && !nx.lesson && nx.rung ? nx.rung.stage.id : null,
              did: {}, met: [], look: null, end: 0 };
    save();
  }
  /* three questions from stories heard before today's — or today's own, for a first day */
  function aajLook(A) {
    if (A.look) return A.look;
    var ids = Object.keys(S.read || {}).filter(function (id) { return id !== A.story; });
    var pool = ids.map(storyById).filter(function (x) { return x && x.scenes.some(function (c) { return c.ask; }); });
    var d = new Date().getDate();
    pool.sort(function (a, b) { return ((a.id.length * 31 + d) % 97) - ((b.id.length * 31 + d) % 97) || (a.id < b.id ? -1 : 1); });
    var pick = pool.slice(0, 3).map(function (x) { return x.id; });
    if (!pick.length && A.story && storyById(A.story)) pick = [A.story];
    A.look = { ids: pick, i: 0, right: 0, picked: null };
    save();
    return A.look;
  }
  function aajAsk(id) {
    var st = storyById(id); if (!st) return null;
    var sc = st.scenes.filter(function (c) { return c.ask; })[0];
    return sc ? { st: st, ask: sc.ask } : null;
  }
  V.aaj = function () {
    var A = aajState();
    if (!A) { aajStart(); A = aajState(); }
    var st = A.story ? storyById(A.story) : null, pk = A.pack && (window.IND_PACKS || {})[A.pack];
    var did = { story: !!(st && S.read[st.id]), lesson: !!A.did.lesson, look: !!A.did.look };
    var steps = [
      ['story', 'tree', 'Hear a story', st ? st.title : 'Tonight’s story'],
      ['lesson', 'script', 'Four new things', pk ? (pk.name ? pk.name.en : A.pack) + ' — one lesson' : 'A language lesson'],
      ['look', 'star', 'Look back', 'Three questions from stories you heard before']
    ];
    var cur = !did.story ? 0 : !did.lesson ? 1 : !did.look ? 2 : 3;
    var head = '<button class="backlink" data-act="go" data-v="home">' + icon('back', 18) + ' Home</button>' +
      '<div class="card aajhead"><span class="mono">Aaj ka · about five minutes</span>' +
      '<h1>' + (cur < 3 ? 'Today’s five minutes' : 'Done for today — shabash') + '</h1>' +
      '<ol class="aajsteps">' + steps.map(function (x, i) {
        var ok = did[x[0]];
        return '<li class="' + (ok ? 'ok' : i === cur ? 'now' : '') + '"><span class="as-ic">' + (ok ? '✓' : icon(x[1], 18)) + '</span>' +
          '<span><b>' + x[2] + '</b><span class="tiny muted">' + esc(x[3]) + '</span></span></li>';
      }).join('') + '</ol></div>';

    if (cur === 0) return head + '<div class="card aajgo"><p>' + esc(st ? st.hook || '' : '') + '</p>' +
      '<button class="btn lg" data-act="aajstep" data-s="0">' + icon('play', 18) + ' Start the story</button></div>';
    if (cur === 1) return head + '<div class="card aajgo"><p>Four new things, each shown and heard before you are asked.</p>' +
      (A.lesson || A.review
        ? '<button class="btn lg" data-act="aajstep" data-s="1">' + icon('play', 18) + ' Start the lesson</button>'
        : '<button class="btn lg" data-act="aajskip" data-s="lesson">Nothing new today — on to the look back</button>') + '</div>';
    if (cur === 2) {
      var L = aajLook(A), q = L.ids[L.i] ? aajAsk(L.ids[L.i]) : null;
      if (!q) { A.did.look = true; A.end = Date.now(); markToday(); save(); return V.aaj(); }
      var picked = L.picked, right = picked === q.ask.answer;
      return head + '<div class="card aajq"><span class="mono">Look back · ' + (L.i + 1) + ' of ' + L.ids.length +
          ' · from “' + esc(q.st.title) + '”</span>' +
        '<h2>' + esc(q.ask.q) + '</h2>' +
        '<div class="aajopts">' + q.ask.options.map(function (o, i) {
          var cls = picked == null ? '' : i === q.ask.answer ? ' right' : i === picked ? ' wrong' : ' off';
          return '<button class="aajopt' + cls + '" data-act="aajpick" data-o="' + i + '"' + (picked == null ? '' : ' disabled') + '>' +
            '<span class="ao-n">' + (i + 1) + '</span>' + esc(o) + '</button>';
        }).join('') + '</div>' +
        (picked == null ? '' :
          '<div class="aajfb ' + (right ? 'good' : 'bad') + '"><p>' + esc(right ? q.ask.right : q.ask.wrong) + '</p>' +
          '<button class="btn" data-act="aajnext">Continue →</button></div>') + '</div>';
    }
    /* THE FINISH: what was done, by name */
    var mins = Math.max(1, Math.round(((A.end || Date.now()) - A.at) / 60000));
    var Lk = A.look || { ids: [], right: 0 };
    return head + '<div class="card aajdone">' +
      '<div class="cel-burst" aria-hidden="true">' + new Array(13).join('<i></i>') + '</div>' +
      '<ul class="aajsum">' +
        (st ? '<li>' + icon('tree', 18) + '<span>You heard <b>' + esc(st.title) + '</b>.</span></li>' : '') +
        (A.met && A.met.length ? '<li>' + icon('script', 18) + '<span>You met <span class="deva" lang="' + esc(A.pack) + '">' +
          A.met.map(function (m) { return '<b>' + esc(m) + '</b>'; }).join(' · ') + '</span>.</span></li>' : '') +
        (Lk.ids.length ? '<li>' + icon('star', 18) + '<span>You looked back at ' + Lk.ids.length + ' stor' +
          (Lk.ids.length === 1 ? 'y' : 'ies') + ' and knew <b>' + Lk.right + '</b>.</span></li>' : '') +
      '</ul><p class="tiny muted">About ' + mins + ' minute' + (mins === 1 ? '' : 's') +
        '. That is today done — anything more is extra, and tomorrow there is another five.</p>' +
      '<button class="btn lg" data-act="go" data-v="home">Back home</button></div>';
  };
  /* the strip on the story and the lesson while a session is on: where you are, and the way back */
  function aajBar() {
    var A = aajState();
    if (!A || A.end || (view.name !== 'story' && view.name !== 'pack')) return '';
    if (view.name === 'story' && view.arg !== A.story) return '';
    if (view.name === 'pack' && view.arg !== A.pack) return '';
    var st = A.story && storyById(A.story), sdone = !!(st && S.read[st.id]);
    var n = !sdone ? 1 : !A.did.lesson ? 2 : 3;
    var ready = (view.name === 'story' && sdone) || (view.name === 'pack' && A.did.lesson);
    return '<div class="aajbar"><span class="mono">Aaj ka · step ' + n + ' of 3</span>' +
      '<button class="pill' + (ready ? ' on' : '') + '" data-act="go" data-v="aaj">' +
      (ready ? 'Next step →' : 'Today’s five minutes') + '</button></div>';
  }

  /* THE MEDAL SHELF: earned ones in their metal, with the day; the rest say how to earn them */
  V.medals = function () {
    var got = S.medals || {}, n = MEDALS.filter(function (m) { return got[m.id]; }).length;
    return '<div class="card medalshelf"><div class="spread"><h3 style="margin:0">Medals</h3>' +
      '<span class="pill stat">' + n + ' of ' + MEDALS.length + '</span></div>' +
      '<p class="tiny muted" style="margin:4px 0 12px">Each one is earned by something the app saw you do — ' +
        'a story finished, a place lit, a test passed on a later day. None of them is for showing up.</p>' +
      '<div class="mdgrid">' + MEDALS.map(function (m) {
        return '<div class="mdcell' + (got[m.id] ? '' : ' locked') + '">' + medalHTML(m, 64, !!got[m.id]) +
          '<b>' + esc(m.name) + '</b><span class="tiny muted">' +
          (got[m.id] ? 'Earned ' + esc(got[m.id]) : 'How to earn it: ' + esc(m.how)) + '</span></div>';
      }).join('') + '</div></div>';
  };
  /* the yatra: what is true of this child, on their own page */
  V.yatra = function () {
    var lit = Object.keys(S.lit).length, totalStories = allStories().length || 1;
    var lv = level(), mN = mastered();
    var pct = lv >= RANKS.length - 1 ? 100
      : Math.min(100, Math.round((mN - RANK_AT[lv]) / Math.max(1, RANK_AT[lv + 1] - RANK_AT[lv]) * 100));
    var wordsN = Object.keys(S.lang).reduce(function (n, k) { return n + (S.lang[k].correct || 0); }, 0);
    return (
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
            cell(lit, nPlaces(), 'places remembered', 'the mist lifts as you read') +
            cell(beads, 0, 'beads on your mala', 'one for each thing you did') +
            (totalVerses ? cell(verses, totalVerses, 'verses carried', 'said out loud, not just read') : '') +
            (wordsN ? cell(wordsN, 0, 'words known', 'across every language you have started') : '') +
          '</div>' +
          '<div class="meter" style="margin-top:var(--space-lg)"><i style="width:' + pct + '%"></i></div>' +
          '<p class="tiny muted" style="margin-top:8px">' +
            /* distance, not just destination (the Bee lesson): "how close am I"
               is what pulls a child back, so the next title says how far */
            (lv < RANKS.length - 1
              ? 'Next: <b>' + esc(RANKS[lv + 1]) + '</b> · ' + (RANK_AT[lv + 1] - mN) +
                ' more thing' + (RANK_AT[lv + 1] - mN === 1 ? '' : 's') + ' mastered — a course test passed on a later day, or a Bhasha rung'
              : 'You are at the top of the ladder') +
          '</p></div>';
      })());
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

  /* ================= THE RIVER OF TIME, ON THE MAP =================
     India's nav door now holds Itihaas: a timeline of discrete stops rides
     above the map. The last stop is Aaj (today) — the living state map,
     unchanged. Every earlier stop re-lights the SAME land as that age saw
     it: the story of the age on the left, its key moments (already written
     and sourced in data-itihaas) on the right, and the door into the full
     era page below. The Sabhyata banner closes the view — the game IS this
     river, playable.

     THE MAP LAW HOLDS (CLAUDE.md): the geometry never varies — one Survey
     of India outline, J&K whole, at every stop. A pre-modern age is shown
     as SOFT ZONES of influence: blurred washes of lamplight with no edge,
     no border, no animation — nothing is drawn crisper than an empire's
     own fading. The faint land beyond the outline is the wider subcontinent
     (ages spill past today's borders); it is a borderless wash — no other
     country's boundary is ever drawn. Zone centres reuse the Sabhyata city
     anchors in the same 1000x1100 frame; radii are deliberately generous,
     because vagueness here is honesty. */
  var timeStop = 'aaj';
  /* a real photograph where we have one: free-licensed images pulled from
     Wikimedia Commons by tools/fetch-city-photos.py, with the license and
     photographer kept in the manifest and credited under the picture (a
     photo credit is the license's own condition, not decor) */
  function cityPhoto(sid) {
    var ph = (window.IND_CITY_PHOTOS || {})[sid];
    if (ph) return '<figure class="tm-photo"><img src="art/itihaas/ph/' + ph.file + '" alt="" loading="lazy">' +
      '<figcaption class="tiny muted">' + esc(ph.credit) + '</figcaption></figure>';
    if ((window.IND_CITY_ART || []).indexOf(sid) >= 0)
      return '<figure class="tm-photo art"><img src="art/itihaas/ct/' + sid + '.jpg" alt="" loading="lazy"></figure>';
    return '';
  }
  window.IND_CITY_PHOTO_HTML = cityPhoto;
  var timeSite = null;   /* the tapped place on an era map */
  /* NEVER DECLARED, ONLY ASSIGNED — and this file is strict, so every attempt
     to travel to an age threw ReferenceError before it got anywhere. The
     timeline read timeZone in four places and set it in one, and that one was
     the line that carries you to the age's map: press a dot twice and the
     handler died on the second press, silently, every time. It has always
     been broken. Declared here with the rest of the timeline's state. */
  var timeZone = null;   /* the highlighted zone on an era map */
  /* which Sabhyata sites stand on each age's map (same 1000x1100 frame), and
     which Sabhyata era index to use so a city wears its name OF THAT AGE —
     Kashi is Banaras under the sultans and Varanasi today; Bombay only
     becomes Mumbai in the takeoff. The facts behind every pin are the
     sites' own, already written and sourced in data-sabhyata. */
  var TIME_SITES = {
    harappa: ['dholavira', 'lothal', 'rakhigarhi', 'kalibangan'],
    vedic: ['hastinapura', 'kashi', 'ujjain', 'vaishali'],
    'buddha-age': ['vaishali', 'kashi', 'pataliputra', 'sanchi'],
    maurya: ['pataliputra', 'sanchi', 'dhauli', 'ujjain', 'sopara'],
    gupta: ['pataliputra', 'nalanda', 'mathura', 'ujjain', 'ajanta'],
    souths: ['madurai', 'muziris', 'sopara', 'ajanta'],
    chola: ['thanjavur', 'mamallapuram', 'madurai'],
    'temple-builders': ['konark', 'thanjavur', 'mamallapuram', 'madurai'],
    'sultanate-mughal': ['delhi', 'agra', 'hampi'],
    'marathas-sikhs': ['amritsar', 'surat', 'delhi'],
    colonial: ['mumbai', 'kolkata', 'surat', 'delhi'],
    freedom: ['ahmedabad', 'delhi', 'amritsar', 'kolkata'],
    modern: ['chandigarh', 'delhi', 'mumbai', 'kolkata'],
    'naya-bharat': ['bengaluru', 'sriharikota', 'mumbai', 'ahmedabad']
  };
  /* cities of the story that stand BEYOND today's outline, on the soft
     wider-subcontinent wash — the ages spilled past every modern border,
     and the First Cities map without Harappa and Mohenjo-daro is a hole.
     Facts are sourced here directly (they have no Sabhyata site to lean
     on, because the game keeps to today's India); a pin is a place and a
     telling, never a boundary. */
  var TIME_XSITES = {
    harappa: [
      { id: 'x-harappa', x: 95, y: 250, name: 'Harappa',
        fact: 'The city on the old Ravi that gave the whole civilization its name — excavated from 1921 under Daya Ram Sahni, the first of the great Indus cities to be dug.',
        more: ['In the 1850s railway builders crushed thousands of its ancient bricks for track ballast — walls that had stood four thousand years went under the Lahore–Multan line.',
               'Its little carved seals carry a script no one alive can read — the writing of the first cities is still a locked door.'],
        sources: ['Possehl, The Indus Civilization: A Contemporary Perspective (2002)', 'Cunningham’s 1872 ASI report (the ballast loss); the undeciphered Indus script'] },
      { id: 'x-mohenjo', x: -35, y: 440, name: 'Mohenjo-daro',
        fact: 'The largest city of the Indus world, on the lower Indus in Sindh — home of the Great Bath, dug from 1922 and a UNESCO World Heritage Site since 1980.',
        more: ['Its streets run in a neat grid, with brick-covered drains beneath them — careful town planning, four and a half thousand years ago.',
               'The little bronze “Dancing Girl”, hand on hip, was found here — one of the oldest cast-bronze figures anywhere, and still full of attitude.'],
        sources: ['UNESCO World Heritage listing: Archaeological Ruins at Moenjodaro (1980)', 'Marshall, Mohenjo-daro and the Indus Civilization (1931); the Dancing Girl (National Museum, New Delhi)'] }
    ],
    'buddha-age': [
      { id: 'x-taxila', x: 60, y: 165, name: 'Takshashila',
        fact: 'The great crossroads city of Gandhara on the Uttarapatha road, remembered as a centre of learning — its mounds, dug by John Marshall over two decades, are a UNESCO World Heritage Site.',
        more: ['The Jataka tales are full of princes and students sent off to Takshashila to study — it is the boarding school of the old stories.',
               'Tradition also places Panini here — the grammarian whose rulebook of Sanskrit is still studied with awe.'],
        sources: ['Marshall, Taxila (1951); UNESCO World Heritage listing: Taxila (1980)', 'Jataka tales (Takkasila as the seat of learning); the Panini tradition (Katha frame)'] }
    ],
    'marathas-sikhs': [
      { id: 'x-lahore', x: 165, y: 228, name: 'Lahore',
        fact: 'Maharaja Ranjit Singh took Lahore in 1799 and made it the capital of the Sikh Empire — the court that held the Punjab together for half a century.',
        more: ['For a time the Koh-i-noor diamond sat in Ranjit Singh’s treasury at Lahore, worn on his arm on the greatest days.',
               'The Mughals loved this city too — Lahore’s great fort and the Shalimar Gardens are a World Heritage Site today.'],
        sources: ['Khushwant Singh, A History of the Sikhs, Vol. 1 (2004)', 'UNESCO World Heritage listing: Fort and Shalamar Gardens in Lahore (1981)'] }
    ]
  };
  TIME_XSITES.maurya = TIME_XSITES['buddha-age'];
  var TIME_SAB_ERA = { harappa: 0, vedic: 1, 'buddha-age': 2, maurya: 2, gupta: 3, souths: 3,
    chola: 4, 'temple-builders': 4, 'sultanate-mughal': 6, 'marathas-sikhs': 7,
    colonial: 9, freedom: 10, modern: 11, 'naya-bharat': 12 };
  /* every zone carries a NAME a child can tap for — broad-strokes labels
     (a river country, a heartland, a coast), never a border and never a
     claim of one: the callout says so in words every time */
  var TIME_ZONES = {
    harappa: [[150, 480, 130, 'Around Dholavira and Lothal'], [275, 300, 140, 'Around Rakhigarhi and Kalibangan'],
      [40, 380, 150, 'Towards Harappa and Mohenjo-daro']],
    vedic: [[240, 280, 150, 'The Sapta Sindhu country'], [420, 400, 160, 'The Ganga\u2013Yamuna doab'],
      [60, 300, 120, 'Towards the northwest passes']],
    'buddha-age': [[576, 457, 150, 'Magadha'], [460, 430, 130, 'Kashi and Kosala']],
    maurya: [[576, 457, 190, 'Magadha, the heart'], [360, 400, 190, 'The northern plains'],
      [280, 570, 180, 'Malwa and the west'], [350, 760, 150, 'The southern reaches'],
      [60, 300, 150, 'Towards Gandhara']],
    gupta: [[576, 457, 170, 'The Gupta heartland'], [400, 410, 170, 'The northern plains'], [300, 550, 120, 'Malwa']],
    souths: [[360, 970, 120, 'The Tamil country'], [302, 807, 130, 'The southern Deccan'],
      [210, 730, 120, 'The Konkan coast'], [420, 700, 120, 'The eastern Deccan']],
    chola: [[390, 950, 140, 'The Kaveri delta \u2014 the Chola heart'], [430, 860, 120, 'The coast the ships knew'],
      [340, 1000, 100, 'The Pandya south']],
    'temple-builders': [[387, 956, 110, 'The Kaveri delta'], [302, 807, 120, 'The Deccan of the Chalukyas'],
      [500, 610, 110, 'Kalinga, of Konark'], [190, 560, 110, 'The western kingdoms'], [680, 560, 110, 'Bengal']],
    'sultanate-mughal': [[326, 347, 180, 'Delhi, the seat'], [460, 450, 190, 'The Gangetic plain'],
      [300, 610, 160, 'Malwa and the Deccan edge'], [620, 480, 150, 'Bengal']],
    'marathas-sikhs': [[215, 690, 170, 'The Maratha country'], [252, 237, 130, 'The Sikh Punjab'],
      [330, 560, 140, 'Malwa and the trade routes']],
    colonial: [[400, 550, 300, 'Under colonial rule'], [620, 450, 240, 'Under colonial rule'],
      [250, 750, 200, 'Under colonial rule']],
    freedom: [[400, 550, 300, 'The freedom movement, everywhere'], [620, 450, 240, 'The freedom movement, everywhere'],
      [250, 750, 200, 'The freedom movement, everywhere']],
    modern: [[400, 550, 300, 'The young Republic'], [620, 450, 240, 'The young Republic'],
      [250, 750, 200, 'The young Republic']],
    'naya-bharat': [[400, 550, 300, 'India in the takeoff'], [620, 450, 240, 'India in the takeoff'],
      [421, 860, 110, 'To the stars from Sriharikota']]
  };
  /* one anchor year per age, monotonic in the book's own order, so the
     timeline can place its bubbles proportionally from 3300 BCE to today */
  var TIME_YEARS = { harappa: -3300, vedic: -1500, 'buddha-age': -600, maurya: -322, gupta: 320,
    souths: 650, chola: 1000, 'temple-builders': 1150, 'sultanate-mughal': 1300,
    'marathas-sikhs': 1700, colonial: 1800, freedom: 1900, modern: 1955, 'naya-bharat': 2000 };
  var timePeek = null;   /* kept: other code still clears it */

  /* ============== BHUGOL — the physical land, on today's map ==============
     A toggle beside Aaj's map swaps politics for geography: the same Survey
     of India outline, but filled with landform washes (elevation and soil,
     never a boundary) and ~400 real places — rivers, lakes, parks, falls,
     peaks, passes, caves, coasts — each a tap away from its own telling.
     The legend chips double as filters. Data: data-bhugol.js, sourced. */
  var mapMode = 'rajya';       /* 'rajya' states · 'bhugol' the land itself */
  var bhugolType = 'all';      /* legend filter */
  var bhugolFeat = null;       /* the open feature card */
  var bhugolState = null;      /* the state whose full-screen physical map is open */
  var BG_STATE_ALIAS = { LA: 'LA', TG: 'TG', DD: 'DD' };
  /* a feature's picture: a real, credited photograph when the Commons manifest
     has one; the house painting otherwise (tagged as a painting); nothing else */
  function bhugolPic(id) {
    var ph = (window.IND_BHUGOL_PHOTOS || {})[id];
    if (ph) return { src: 'art/bhugol/ph/' + ph.file, credit: ph.credit, painted: false };
    if ((window.IND_BHUGOL_ART || []).indexOf(id) >= 0) return { src: 'art/bhugol/' + id + '.jpg', credit: '', painted: true };
    return null;
  }
  function bhugolLegend(feats, all) {
    var B = window.IND_BHUGOL || { types: {} };
    var counts = {};
    all.forEach(function (ft) { counts[ft.t] = (counts[ft.t] || 0) + 1; });
    return '<div class="bg-legend"><button class="bg-chip' + (bhugolType === 'all' ? ' on' : '') +
      '" data-act="btype" data-t="all">All · ' + all.length + '</button>' +
      Object.keys(B.types).filter(function (tk) { return counts[tk]; }).map(function (tk) {
        var tv = B.types[tk];
        return '<button class="bg-chip' + (bhugolType === tk ? ' on' : '') + '" data-act="btype" data-t="' + tk +
          '" style="--tc:' + tv.c + '"><i>' + tv.g + '</i>' + esc(tv.n) + ' · ' + counts[tk] + '</button>';
      }).join('') + '</div>';
  }
  function bhugolPopup() {
    var B = window.IND_BHUGOL || { types: {}, features: [] };
    if (!bhugolFeat) return '';
    var cf = null;
    B.features.forEach(function (ft) { if (ft.id === bhugolFeat) cf = ft; });
    if (!cf) return '';
    var tv2 = B.types[cf.t] || {}, pic = bhugolPic(cf.id);
    return '<button class="tm-scrim" data-act="bfeat" data-id="' + cf.id + '" aria-label="close"></button>' +
      '<div class="tm-pop' + (pic ? '' : ' snug') + '" role="dialog" aria-label="' + esc(cf.n) + '">' +
      (pic ? '<figure class="tm-photo' + (pic.painted ? ' art' : '') + '"><img src="' + pic.src + '" alt="" loading="lazy">' +
        (pic.credit ? '<figcaption class="tiny muted">' + esc(pic.credit) + '</figcaption>'
                    : '<figcaption class="tiny muted">a painting, not a photograph — a real picture arrives with the photo pipeline</figcaption>') +
        '</figure>' : '') +
      '<div class="bg-band" style="background:' + (tv2.c || '#888') + '"><i>' + (tv2.g || '') + '</i>' + esc(tv2.n || cf.t) + '</div>' +
      '<div class="spread tm-prow"><b class="tm-pname">' + esc(cf.n) + '</b>' +
        '<button class="pill" data-act="bfeat" data-id="' + cf.id + '">close</button></div>' +
      '<p class="tiny muted" style="margin:2px 0 0">' + esc(stateName(cf.st)) + '</p>' +
      '<p class="tm-fact">' + esc(cf.f) + '</p></div>';
  }
  /* ---- India level: the states, in a physical palette, each carrying its count ---- */
  function bhugolIndia() {
    var B = window.IND_BHUGOL || { types: {}, features: [] };
    var M2 = window.IND_MAP;
    var counts = {};
    B.features.forEach(function (ft) { counts[ft.st] = (counts[ft.st] || 0) + 1; });
    var codes = Object.keys(M2.paths), badges_extra = '';
    var washes = '<g clip-path="url(#bgclip)"><g filter="url(#bgw)">' +
        '<ellipse cx="470" cy="180" rx="460" ry="120" fill="#f3f2fa"/>' +
        '<ellipse cx="300" cy="255" rx="330" ry="70" fill="#d9d4ec" opacity=".8"/>' +
        '<ellipse cx="190" cy="430" rx="150" ry="120" fill="#ecd9a8"/>' +
        '<ellipse cx="480" cy="440" rx="260" ry="110" fill="#dcecc8"/>' +
        '<ellipse cx="660" cy="520" rx="180" ry="90" fill="#d4eac4"/>' +
        '<ellipse cx="360" cy="740" rx="220" ry="180" fill="#e6d9b4"/>' +
        '<ellipse cx="250" cy="800" rx="70" ry="200" fill="#c8e2b8"/>' +
        '<ellipse cx="850" cy="330" rx="140" ry="110" fill="#cfe6c2"/>' +
        '<ellipse cx="330" cy="990" rx="120" ry="110" fill="#d2e8c0"/></g></g>';
    var states = codes.map(function (c) {
      return '<path class="bg-state" d="' + M2.paths[c] + '" data-act="bstate" data-id="' + c +
        '" role="button" tabindex="0" aria-label="' + esc(stateName(c)) + ' — ' + (counts[c] || 0) +
        ' places; open its map"><title>' + esc(stateName(c)) + '</title></path>';
    }).join('');
    var byState = {};
    B.features.forEach(function (ft) { (byState[ft.st] = byState[ft.st] || []).push(ft); });
    var badgeCodes = codes.slice();
    Object.keys(byState).forEach(function (c) { if (badgeCodes.indexOf(c) < 0) badgeCodes.push(c); });
    var badges = badgeCodes.map(function (c) {
      var bb = M2.bbox[c]; if (!counts[c]) return '';
      var cx, cy;
      if (bb) { cx = bb[0] + bb[2] / 2; cy = bb[1] + bb[3] / 2; }
      else {
        cx = 0; cy = 0;
        byState[c].forEach(function (ft) { cx += ft.x; cy += ft.y; });
        cx /= byState[c].length; cy /= byState[c].length;
      }
      if (!bb) badges_extra += '<circle class="bg-sea-isle" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) +
        '" r="28" data-act="bstate" data-id="' + c + '" role="button" tabindex="0" aria-label="' + esc(stateName(c)) + ' — open its map"/>';
      return '<g class="bg-badge" data-act="bstate" data-id="' + c + '"><circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="15"/>' +
        '<text x="' + cx.toFixed(1) + '" y="' + (cy + 4.5).toFixed(1) + '" text-anchor="middle">' + counts[c] + '</text></g>';
    }).join('');
    var svg2 = '<svg class="tmsvg bgsvg" viewBox="-30 30 1060 1120" role="group" aria-label="The physical land of India, by state">' +
      '<defs><clipPath id="bgclip"><path d="' + M2.outline + '"/></clipPath>' +
      '<filter id="bgw" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="26"/></filter></defs>' +
      '<path d="' + M2.outline + '" fill="#e8ecd8" stroke="var(--line2,var(--line))" stroke-width="2.5"/>' +
      washes + states + badges_extra + badges + '</svg>';
    return '<div class="card mapcard bgcard">' + svg2 +
      '<p class="tiny muted" style="margin:8px 0 0">The land itself — washes are landforms, never lines. ' +
      '<b>Tap a state</b> to open its own geographical map: ' + B.features.length + ' real places, with pictures.</p></div>';
  }
  /* ---- State level: a full-screen geographical map of one state ---- */
  function bhugolStateView(code) {
    var B = window.IND_BHUGOL || { types: {}, features: [] };
    var M2 = window.IND_MAP, SB2 = window.IND_SABHYATA || {};
    var all = B.features.filter(function (ft) { return ft.st === code; });
    var bb = M2.bbox[code], hasShape = !!(bb && M2.paths[code]);
    if (!hasShape) {
      if (!all.length) { bhugolState = null; return bhugolIndia(); }
      var xs = all.map(function (ft) { return ft.x; }), ys = all.map(function (ft) { return ft.y; });
      var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      bb = [x0, y0, Math.max(40, x1 - x0), Math.max(40, y1 - y0)];
    }
    var feats = all.filter(function (ft) { return bhugolType === 'all' || ft.t === bhugolType; });
    var pad = Math.max(bb[2], bb[3]) * 0.14;
    var vx = bb[0] - pad, vy = bb[1] - pad, vw = bb[2] + pad * 2, vh = bb[3] + pad * 2;
    var span = Math.max(vw, vh), u = span / 100;             /* one "unit" = 1% of the view */
    var R = u * 3.6, FS = (u * 2.6).toFixed(1);
    var others = Object.keys(M2.paths).filter(function (c) { return c !== code; }).map(function (c) {
      return '<path class="bg-other" d="' + M2.paths[c] + '"/>';
    }).join('');
    var nbrs = Object.keys(M2.paths).filter(function (c) {
      var ob = M2.bbox[c]; if (c === code || !ob) return false;
      /* the scattered UTs (Puducherry's four enclaves, Daman & Diu, the
         islands) have bounding boxes that mean nothing — no name for them */
      if ('PY DD DN LD AN CH'.indexOf(c) >= 0) return false;
      var cx = ob[0] + ob[2] / 2, cy = ob[1] + ob[3] / 2;
      return cx > vx && cx < vx + vw && cy > vy && cy < vy + vh && Math.min(ob[2], ob[3]) > u * 6;
    }).map(function (c) {
      var ob = M2.bbox[c];
      return '<text class="bg-nbr" x="' + (ob[0] + ob[2] / 2).toFixed(1) + '" y="' + (ob[1] + ob[3] / 2).toFixed(1) +
        '" text-anchor="middle" style="font-size:' + (u * 2.8).toFixed(1) + 'px">' + esc(stateName(c)) + '</text>';
    }).join('');
    /* one frame unit is about 3.3 km on the ground (34.1 units to a degree of
       latitude), so a 50 km bar is 15.3 units — honest scale on every state */
    var KM50 = 50 / 3.26, sx0 = vx + u * 4, sy0 = vy + vh - u * 5;
    var furniture = '<g class="bg-scale"><line x1="' + sx0.toFixed(1) + '" y1="' + sy0.toFixed(1) + '" x2="' + (sx0 + KM50).toFixed(1) + '" y2="' + sy0.toFixed(1) + '" style="stroke-width:' + (u * 0.5).toFixed(2) + '"/>' +
      '<line x1="' + sx0.toFixed(1) + '" y1="' + (sy0 - u).toFixed(1) + '" x2="' + sx0.toFixed(1) + '" y2="' + (sy0 + u).toFixed(1) + '" style="stroke-width:' + (u * 0.5).toFixed(2) + '"/>' +
      '<line x1="' + (sx0 + KM50).toFixed(1) + '" y1="' + (sy0 - u).toFixed(1) + '" x2="' + (sx0 + KM50).toFixed(1) + '" y2="' + (sy0 + u).toFixed(1) + '" style="stroke-width:' + (u * 0.5).toFixed(2) + '"/>' +
      '<text x="' + (sx0 + KM50 / 2).toFixed(1) + '" y="' + (sy0 - u * 1.6).toFixed(1) + '" text-anchor="middle" style="font-size:' + (u * 2.2).toFixed(1) + 'px">50 km</text></g>' +
      '<g class="bg-north" transform="translate(' + (vx + vw - u * 6).toFixed(1) + ' ' + (vy + u * 8).toFixed(1) + ')">' +
      '<path d="M0 ' + (-u * 4).toFixed(1) + ' L' + (u * 1.5).toFixed(1) + ' ' + (u * 2).toFixed(1) + ' L0 ' + (u * 0.8).toFixed(1) + ' L' + (-u * 1.5).toFixed(1) + ' ' + (u * 2).toFixed(1) + 'Z"/>' +
      '<text y="' + (-u * 5.2).toFixed(1) + '" text-anchor="middle" style="font-size:' + (u * 2.6).toFixed(1) + 'px">N</text></g>';
    var rivers = (SB2.rivers || []).map(function (rv) {
      var d2 = 'M' + rv.p[0][0] + ' ' + rv.p[0][1];
      for (var ri = 1; ri < rv.p.length - 1; ri++) {
        var mx2 = (rv.p[ri][0] + rv.p[ri + 1][0]) / 2, my2 = (rv.p[ri][1] + rv.p[ri + 1][1]) / 2;
        d2 += ' Q' + rv.p[ri][0] + ' ' + rv.p[ri][1] + ' ' + mx2 + ' ' + my2;
      }
      var lp = rv.p[rv.p.length - 1];
      return '<path class="bg-river" style="stroke-width:' + (u * 0.7).toFixed(2) + '" d="' + d2 + ' L' + lp[0] + ' ' + lp[1] + '"><title>' + esc(rv.n) + '</title></path>';
    }).join('');
    /* terrain marks: little landform symbols laid around each feature by its
       kind — the geography drawn on, not just dotted */
    var terrain = feats.map(function (ft) {
      var k = ft.t, x = ft.x, y = ft.y, o = '';
      var tri = function (dx, dy, s) {
        return '<path class="bg-mtn" d="M' + (x + dx - s) + ' ' + (y + dy) + ' l' + s + ' ' + (-s * 1.5) + ' l' + s + ' ' + (s * 1.5) + 'z"/>';
      };
      if (k === 'peak' || k === 'range' || k === 'pass' || k === 'glacier') {
        o += tri(-u * 4.2, u * 1.2, u * 1.6) + tri(u * 4.4, u * 1.6, u * 1.9) + tri(0, -u * 4.6, u * 1.3);
      } else if (k === 'desert') {
        o += '<path class="bg-dune" d="M' + (x - u * 5) + ' ' + (y + u * 3.2) + ' q' + (u * 2.5) + ' -' + (u * 2) + ' ' + (u * 5) + ' 0 q' + (u * 2.5) + ' -' + (u * 2) + ' ' + (u * 5) + ' 0"/>';
      } else if (k === 'lake' || k === 'wetland' || k === 'coast' || k === 'island') {
        o += '<path class="bg-wave" d="M' + (x - u * 4) + ' ' + (y + u * 4) + ' q' + (u * 1.3) + ' -' + (u * 1.2) + ' ' + (u * 2.6) + ' 0 t' + (u * 2.6) + ' 0 t' + (u * 2.6) + ' 0"/>';
      } else if (k === 'park') {
        o += '<circle class="bg-tree" cx="' + (x - u * 4.4) + '" cy="' + (y + u * 2.8) + '" r="' + (u * 1.1) + '"/>' +
             '<circle class="bg-tree" cx="' + (x + u * 4.6) + '" cy="' + (y - u * 3.4) + '" r="' + (u * 0.9) + '"/>';
      }
      return o;
    }).join('');
    /* display positions: a few relaxation passes push clustered pins apart
       so every bubble stays a bubble (the true point keeps its telling) */
    var P = feats.map(function (ft) { return { x: ft.x, y: ft.y }; });
    var minD = R * 2.15, it, i2, j2;
    for (it = 0; it < 24; it++) {
      for (i2 = 0; i2 < P.length; i2++) for (j2 = i2 + 1; j2 < P.length; j2++) {
        var ddx = P[j2].x - P[i2].x, ddy = P[j2].y - P[i2].y, dd = Math.sqrt(ddx * ddx + ddy * ddy) || 0.01;
        if (dd < minD) {
          var push = (minD - dd) / 2, ux = ddx / dd, uy = ddy / dd;
          P[i2].x -= ux * push; P[i2].y -= uy * push; P[j2].x += ux * push; P[j2].y += uy * push;
        }
      }
    }
    /* labels: below by default; above, right or left when below would collide */
    var boxes = P.map(function (pt) { return { x: pt.x - R, y: pt.y - R, w: R * 2, h: R * 2 }; });
    var hit = function (bx) {
      for (var k = 0; k < boxes.length; k++) {
        var o = boxes[k];
        if (bx.x < o.x + o.w && bx.x + bx.w > o.x && bx.y < o.y + o.h && bx.y + bx.h > o.y) return true;
      }
      return false;
    };
    var fsN = u * 2.4, LBL = feats.map(function (ft, k) {
      var w = ft.n.length * fsN * 0.56, h = fsN * 1.2, pt = P[k];
      var tries = [
        { x: pt.x - w / 2, y: pt.y + R + u * 0.8, ax: pt.x, ay: pt.y + R + u * 0.8 + fsN, anchor: 'middle' },
        { x: pt.x - w / 2, y: pt.y - R - u * 0.8 - h, ax: pt.x, ay: pt.y - R - u * 1.1, anchor: 'middle' },
        { x: pt.x + R + u * 0.8, y: pt.y - h / 2, ax: pt.x + R + u * 1.0, ay: pt.y + fsN * 0.38, anchor: 'start' },
        { x: pt.x - R - u * 0.8 - w, y: pt.y - h / 2, ax: pt.x - R - u * 1.0, ay: pt.y + fsN * 0.38, anchor: 'end' },
        /* the diagonals, when every straight side is taken */
        { x: pt.x + R * 0.7, y: pt.y + R * 0.7, ax: pt.x + R * 0.8, ay: pt.y + R * 0.7 + fsN, anchor: 'start' },
        { x: pt.x - R * 0.7 - w, y: pt.y + R * 0.7, ax: pt.x - R * 0.8, ay: pt.y + R * 0.7 + fsN, anchor: 'end' },
        { x: pt.x + R * 0.7, y: pt.y - R * 0.7 - h, ax: pt.x + R * 0.8, ay: pt.y - R * 0.9, anchor: 'start' },
        { x: pt.x - R * 0.7 - w, y: pt.y - R * 0.7 - h, ax: pt.x - R * 0.8, ay: pt.y - R * 0.9, anchor: 'end' }
      ];
      var pick = tries[0];
      for (var q = 0; q < tries.length; q++) { var bx = { x: tries[q].x, y: tries[q].y, w: w, h: h }; if (!hit(bx)) { pick = tries[q]; break; } }
      boxes.push({ x: pick.x, y: pick.y, w: w, h: h });
      return pick;
    });
    var pins = feats.map(function (ft, k) {
      var tv = B.types[ft.t] || {}, pic = bhugolPic(ft.id), pt = P[k], lb = LBL[k];
      var on = bhugolFeat === ft.id;
      var g = '<g class="bg-pin' + (on ? ' on' : '') + '" data-act="bfeat" data-id="' + ft.id +
        '" role="button" tabindex="0" aria-label="' + esc(ft.n) + ' — ' + esc(tv.n || ft.t) + '; tap for its telling">';
      var px = pt.x.toFixed(1), py = pt.y.toFixed(1);
      if (Math.abs(pt.x - ft.x) + Math.abs(pt.y - ft.y) > u * 0.6) {
        g += '<line class="bg-lead" x1="' + ft.x + '" y1="' + ft.y + '" x2="' + px + '" y2="' + py + '" style="stroke-width:' + (u * 0.3).toFixed(2) + '"/>' +
          '<circle class="bg-true" cx="' + ft.x + '" cy="' + ft.y + '" r="' + (u * 0.6).toFixed(1) + '"/>';
      }
      if (pic) {
        g += '<clipPath id="cp-' + ft.id + '"><circle cx="' + px + '" cy="' + py + '" r="' + R.toFixed(1) + '"/></clipPath>' +
          '<image href="' + pic.src + '" x="' + (pt.x - R * 1.78).toFixed(1) + '" y="' + (pt.y - R).toFixed(1) +
          '" width="' + (R * 3.56).toFixed(1) + '" height="' + (R * 2).toFixed(1) + '" clip-path="url(#cp-' + ft.id + ')" preserveAspectRatio="xMidYMid slice"/>' +
          '<circle class="bg-ring" cx="' + px + '" cy="' + py + '" r="' + R.toFixed(1) + '" style="stroke:' + (tv.c || '#888') + ';stroke-width:' + (u * 0.55).toFixed(2) + '"/>';
      } else {
        g += '<circle class="bg-dot" cx="' + px + '" cy="' + py + '" r="' + (R * 0.62).toFixed(1) + '" fill="' + (tv.c || '#888') + '" style="stroke-width:' + (u * 0.4).toFixed(2) + '"/>' +
          '<text class="bg-g" x="' + px + '" y="' + (pt.y + u * 0.9).toFixed(1) + '" text-anchor="middle" style="font-size:' + (u * 2.4).toFixed(1) + 'px">' + (tv.g || '') + '</text>';
      }
      g += '<text class="bg-lbl" x="' + lb.ax.toFixed(1) + '" y="' + lb.ay.toFixed(1) + '" text-anchor="' + lb.anchor + '" style="font-size:' + fsN.toFixed(1) + 'px">' + esc(ft.n) + '</text></g>';
      return g;
    }).join('');
    var svg2 = '<svg class="bgstate" viewBox="' + vx.toFixed(1) + ' ' + vy.toFixed(1) + ' ' + vw.toFixed(1) + ' ' + vh.toFixed(1) +
      '" role="group" aria-label="The physical map of ' + esc(stateName(code)) + '">' +
      '<defs><clipPath id="bgsclip"><path d="' + (hasShape ? M2.paths[code] : '') + '"/></clipPath>' +
      '<linearGradient id="bgland" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef1de"/><stop offset="1" stop-color="#e2e9c8"/></linearGradient></defs>' +
      others +
      (hasShape ? '<path class="bg-self" d="' + M2.paths[code] + '" fill="url(#bgland)" style="stroke-width:' + (u * 0.5).toFixed(2) + '"/>'
                : '<rect x="' + vx.toFixed(1) + '" y="' + vy.toFixed(1) + '" width="' + vw.toFixed(1) + '" height="' + vh.toFixed(1) + '" fill="#dbeaf2"/>' +
                  all.map(function (ft) { return '<ellipse class="bg-isle" cx="' + ft.x + '" cy="' + ft.y + '" rx="' + (u * 5).toFixed(1) + '" ry="' + (u * 3.2).toFixed(1) + '"/>'; }).join('')) +
      nbrs + '<g clip-path="url(#bgsclip)">' + rivers + '</g>' +
      terrain + pins + furniture + '</svg>';
    var cards = feats.map(function (ft) {
      var tv = B.types[ft.t] || {}, pic = bhugolPic(ft.id);
      return '<button class="bg-card" data-act="bfeat" data-id="' + ft.id + '">' +
        (pic ? '<img src="' + pic.src + '" alt="" loading="lazy">' : '<div class="bg-noimg" style="background:' + (tv.c || '#888') + '">' + (tv.g || '') + '</div>') +
        '<span class="bg-cband" style="background:' + (tv.c || '#888') + '">' + (tv.g || '') + ' ' + esc(tv.n || ft.t) + '</span>' +
        '<b>' + esc(ft.n) + '</b><span class="bg-cfact">' + esc(ft.f) + '</span></button>';
    }).join('');
    return '<div class="bg-full" role="region" aria-label="' + esc(stateName(code)) + ' — physical map">' +
      '<div class="bg-fhead"><button class="btn ghost" data-act="bstate" data-id="">← India</button>' +
        '<div class="bg-ftitle"><b>' + esc(stateName(code)) + '</b><span class="tiny muted">' + all.length + ' places · the land, drawn</span></div></div>' +
      '<div class="bg-fbody">' + svg2 + bhugolLegend(feats, all) +
        '<div class="bg-cards">' + cards + '</div>' +
        '<p class="tiny muted" style="margin:10px 0 0">Landforms and rivers, never lines of politics. Pictures are credited photographs where we have them, and honest paintings where we do not yet.</p>' +
      '</div></div>';
  }
  function bhugolView() {
    return (bhugolState ? bhugolStateView(bhugolState) : bhugolIndia()) + bhugolPopup();
  }
  function timeStrip() {
    /* ONE LINE OF TIME, 3300 BCE to today, never wider than the page. Every
       age is a bubble placed proportionally on the line (with just enough
       spread that the crowded last centuries stay tappable). One tap pops
       the age's name up; a second tap on the same bubble \u2014 or a
       double-click \u2014 travels there. The open age burns as the lit
       bubble. */
    var I = window.IND_ITIHAAS;
    if (!I) return '';
    var items = I.eras.map(function (e) {
      return { id: e.id, name: e.title, when: e.when, yr: TIME_YEARS[e.id] || 0 };
    });
    items.push({ id: 'aaj', name: 'Aaj \u00b7 today', when: 'now', yr: 2026 });
    var y0 = -3300, y1 = 2026;
    var xs = items.map(function (it) { return 3 + (it.yr - y0) / (y1 - y0) * 94; });
    var i;
    for (i = 1; i < xs.length; i++) if (xs[i] < xs[i - 1] + 5.6) xs[i] = xs[i - 1] + 5.6;
    for (i = xs.length - 1; i >= 0; i--) {
      if (i === xs.length - 1) { if (xs[i] > 97) xs[i] = 97; }
      else if (xs[i] > xs[i + 1] - 5.6) xs[i] = xs[i + 1] - 5.6;
    }
    var dots = items.map(function (it, k) {
      var open = timeStop === it.id;
      /* the open age says its name; every age says WHEN it was, always */
      var pop = open
        ? '<span class="tmpop open' + (xs[k] < 12 ? ' edgeL' : xs[k] > 88 ? ' edgeR' : '') + '">' +
          '<b>' + esc(it.name) + '</b></span>'
        : '';
      return '<button class="tmdot' + (open ? ' on' : '') + (it.id === 'aaj' ? ' aaj' : '') +
        '" style="left:' + xs[k].toFixed(2) + '%" data-act="tstop" data-id="' + it.id +
        '" aria-label="' + esc(it.name) + ' \u00b7 ' + esc(it.when) +
        (open ? ' \u2014 open now' : '') + '">' + pop + '</button>';
    }).join('');
    return '<div class="tmband" role="tablist" aria-label="The river of time, 3300 BCE to today">' +
      /* Three markers for the whole rail, and no label under any dot. Fifteen
         small date ranges staggered along one line read as clutter, not as
         orientation — the ages are a river to travel, not a table to study.
         Each dot still SAYS its dates in its aria-label, so the information is
         there for anyone listening rather than looking, and the age's page
         carries them in full. */
      '<span class="tmrail"></span>' + dots +
      '<span class="tmtick tm-l" style="left:1.5%">3300 BCE</span>' +
      '<span class="tmtick" style="left:' + (3 + (0 - y0) / (y1 - y0) * 94).toFixed(1) + '%">year 0</span>' +
      '<span class="tmtick tm-r" style="left:98.5%">today</span>' +
      '</div>';
  }
  function timeLens(id) {
    var I = window.IND_ITIHAAS, M = window.IND_MAP;
    var e = I && I.eras.filter(function (x) { return x.id === id; })[0];
    if (!e || !M) return '<div class="card">This stretch of the river is still being written.</div>';
    var z = TIME_ZONES[id] || [];
    var figs = (e.figures || []).filter(function (f) { return f.id; }).slice(0, 4);
    /* THE AGE'S MAP IS A LIVING BOARD, like Aaj's: the rivers run (a child
       who follows the Ganga still finds Kashi), the age's own cities stand
       on it as tappable sprites wearing their names OF THAT AGE, lamps
       breathe, birds cross, boats bob on the rivers — and tapping a city
       opens its own sourced telling below the map. Cities may pulse;
       boundaries never do (there are none drawn to pulse). */
    var SB = window.IND_SABHYATA || {};
    var sabEra = TIME_SAB_ERA[id] || 0;
    var rivers = (SB.rivers || []).map(function (rv) {
      var d2 = 'M' + rv.p[0][0] + ' ' + rv.p[0][1];
      for (var ri = 1; ri < rv.p.length - 1; ri++) {
        var mx2 = (rv.p[ri][0] + rv.p[ri + 1][0]) / 2, my2 = (rv.p[ri][1] + rv.p[ri + 1][1]) / 2;
        d2 += ' Q' + rv.p[ri][0] + ' ' + rv.p[ri][1] + ' ' + mx2 + ' ' + my2;
      }
      var lp = rv.p[rv.p.length - 1];
      return '<path class="tm-river" d="' + d2 + ' L' + lp[0] + ' ' + lp[1] + '"><title>' + esc(rv.n) + '</title></path>';
    }).join('');
    var sprites = window.IND_SABHYATA_SPRITES || [];
    var cspr = sprites.indexOf('city2') >= 0 ? 'art/sabhyata/sp/city2.png' : null;
    var siteOf = function (sid) {
      return ((SB.sites || []).filter(function (x2) { return x2.id === sid; })[0]) || null;
    };
    var nameInAge = function (s2) {
      var nm = s2.name;
      (s2.renames || []).forEach(function (r2) { if (r2.era <= sabEra) nm = r2.name; });
      return nm;
    };
    var xsiteOf = function (sid) {
      var ls = TIME_XSITES[id] || [];
      for (var xi = 0; xi < ls.length; xi++) if (ls[xi].id === sid) return ls[xi];
      return null;
    };
    var xpins = (TIME_XSITES[id] || []).map(function (s2) {
      return '<g class="tm-city' + (timeSite === s2.id ? ' on' : '') + '" data-act="tsite" data-id="' + s2.id +
        '" role="button" tabindex="0" aria-label="' + esc(s2.name) + ' \u2014 beyond today\u2019s outline; tap for its telling">' +
        '<circle class="tm-hit" cx="' + s2.x + '" cy="' + (s2.y - 8) + '" r="46" fill="transparent"/>' +
        (cspr ? '<image href="' + cspr + '" x="' + (s2.x - 27) + '" y="' + (s2.y - 42) +
          '" width="54" height="42" preserveAspectRatio="xMidYMax meet" opacity=".88"/>' : '') +
        '<circle class="tm-lamp" cx="' + s2.x + '" cy="' + (s2.y + 7) + '" r="7"/>' +
        '<text class="tm-name" x="' + s2.x + '" y="' + (s2.y + 34) + '" text-anchor="middle">' + esc(s2.name) + '</text></g>';
    }).join('');
    var pins = xpins + (TIME_SITES[id] || []).map(function (sid) {
      var s2 = siteOf(sid); if (!s2) return '';
      var nm = nameInAge(s2);
      return '<g class="tm-city' + (timeSite === sid ? ' on' : '') + '" data-act="tsite" data-id="' + sid +
        '" role="button" tabindex="0" aria-label="' + esc(nm) + ' \u2014 tap for its telling">' +
        '<circle class="tm-hit" cx="' + s2.x + '" cy="' + (s2.y - 8) + '" r="46" fill="transparent"/>' +
        (cspr ? '<image href="' + cspr + '" x="' + (s2.x - 27) + '" y="' + (s2.y - 42) +
          '" width="54" height="42" preserveAspectRatio="xMidYMax meet"/>' : '') +
        '<circle class="tm-lamp" cx="' + s2.x + '" cy="' + (s2.y + 7) + '" r="7"/>' +
        '<text class="tm-name" x="' + s2.x + '" y="' + (s2.y + 34) + '" text-anchor="middle">' + esc(nm) + '</text></g>';
    }).join('');
    /* the life layer: birds across the sky, boats bobbing mid-river */
    var boatSpr = sprites.indexOf('boat') >= 0 ? 'art/sabhyata/sp/boat.png' : null;
    var boats = '';
    if (boatSpr && (SB.rivers || []).length > 3) {
      [1, 3].forEach(function (bi, k) {
        var rp = SB.rivers[bi].p, mid = rp[Math.floor(rp.length / 2)];
        boats += '<image class="tm-boat" style="animation-delay:-' + (k * 1.7) + 's" href="' + boatSpr +
          '" x="' + (mid[0] - 16) + '" y="' + (mid[1] - 24) + '" width="34" height="26"/>';
      });
    }
    var life = '<g class="tm-life" aria-hidden="true">' + boats +
      '<path class="tm-bird" style="animation-duration:38s" d="M0 0 q7 -7 14 0 q7 -7 14 0" transform="translate(120,120)"/>' +
      '<path class="tm-bird" style="animation-duration:52s;animation-delay:-18s" d="M0 0 q6 -6 12 0 q6 -6 12 0" transform="translate(60,220)"/>' +
      '</g>';
    var svg = '<svg class="tmsvg" viewBox="-230 -40 1330 1180" role="group" aria-label="' +
      'India in ' + esc(e.when) + ' \u2014 soft zones of influence, not borders">' +
      '<defs><filter id="tmz" x="-60%" y="-60%" width="220%" height="220%">' +
      '<feGaussianBlur stdDeviation="42"/></filter>' +
      '<filter id="tml" x="-60%" y="-60%" width="220%" height="220%">' +
      '<feGaussianBlur stdDeviation="34"/></filter></defs>' +
      /* the wider subcontinent: soft land with NO borders \u2014 ages spill past */
      '<g filter="url(#tml)" opacity=".35">' +
      '<ellipse cx="40" cy="330" rx="290" ry="380" fill="var(--mist)"/>' +
      '<ellipse cx="420" cy="40" rx="520" ry="150" fill="var(--mist)"/>' +
      '<ellipse cx="820" cy="480" rx="240" ry="220" fill="var(--mist)"/></g>' +
      '<path d="' + M.outline + '" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>' +
      '<g filter="url(#tmz)" opacity=".42">' +
      z.map(function (c, zi) {
        return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="var(--accent2)"' +
          (String(zi) === timeZone ? ' opacity="1.35"' : '') + '/>';
      }).join('') + '</g>' +
      /* the zones are tappable \u2014 a name, never a border */
      z.map(function (c, zi) {
        return '<circle class="tm-zone' + (String(zi) === timeZone ? ' on' : '') + '" cx="' + c[0] +
          '" cy="' + c[1] + '" r="' + Math.max(60, c[2] * 0.8) + '" data-act="tzone" data-i="' + zi +
          '" role="button" tabindex="0" aria-label="' + esc(c[3] || 'a zone of influence') +
          ' \u2014 a soft zone of influence, not a border"/>';
      }).join('') +
      rivers +
      '<path d="' + M.outline + '" fill="none" stroke="var(--line2,var(--line))" stroke-width="2.5"/>' +
      life + pins +
      '</svg>';
    /* the tapped city's own telling, from data-sabhyata, sources and all;
       a tapped zone gets its name and the honest line about edges */
    var cal = '';
    if (!timeSite && timeZone !== null && z[+timeZone]) {
      var zc = z[+timeZone];
      cal = '<div class="tm-callout"><div class="spread"><b>' + esc(zc[3] || 'A zone of influence') + '</b>' +
        '<button class="pill" data-act="tzone" data-i="' + timeZone + '">close</button></div>' +
        '<p style="margin:6px 0 0">A soft zone of influence, shown as lamplight \u2014 not a border. ' +
        'Real edges faded, moved with the seasons, and were argued over; nobody drew a line on the land. ' +
        'Open this age to read what the evidence shows.</p></div>';
    }
    if (timeSite) {
      var cx2 = xsiteOf(timeSite);
      var cs = cx2 || siteOf(timeSite);
      if (cs) {
        var pnm = cx2 ? cs.name : nameInAge(cs);
        var pf = [cs.fact].concat(cs.more || []);
        var chars = pf.join(' ').length;
        /* the card wears its text: short tellings get a snug card, long ones a
           wide one, and past 84vh the card scrolls inside itself */
        cal = '<button class="tm-scrim" data-act="tsite" data-id="' + timeSite +
            '" aria-label="close"></button>' +
          '<div class="tm-pop' + (chars < 460 ? ' snug' : '') + '" role="dialog" aria-label="' + esc(pnm) + '">' +
          cityPhoto(timeSite) +
          '<div class="spread tm-prow"><b class="tm-pname">' + esc(pnm) + '</b>' +
            '<button class="pill" data-act="tsite" data-id="' + timeSite + '">close</button></div>' +
          pf.map(function (mf) { return '<p class="tm-fact">' + esc(mf) + '</p>'; }).join('') +
          (cx2 ? '<p class="tm-fact tiny muted">Beyond today\u2019s outline \u2014 this city is in Pakistan now; the story has never stopped at a modern border.</p>' : '') +
          '</div>';
      }
    }
    return '<div class="card tm-head"><div class="spread">' +
      '<div class="tm-headL"><span class="badge itihaas">itihaas</span>' +
      '<b class="tm-title">' + esc(e.title) + '</b>' +
      '<span class="mono tiny">' + esc(e.when) + '</span></div>' +
      '<button class="btn ghost" data-act="era" data-id="' + e.id + '">Open \u2192</button></div>' +
      '<p class="tm-hook">' + esc(e.hook) + ' \u00b7 <i>tap a city for its tellings</i></p></div>' +
      '<div class="tmwrap">' +
        '<div class="card tmap">' + svg + (timeSite ? '' : cal) +
          '<p class="tiny muted" style="margin:8px 0 0">A soft glow, not a border \u2014 where this age\u2019s ' +
          'story burned brightest; empires faded at their edges. The faint land beyond today\u2019s outline is ' +
          'the wider subcontinent \u2014 the story has never stopped at a modern border.</p></div>' +
        '<div class="card tmoments"><h3 style="margin:0 0 4px">The key moments</h3>' +
          (e.moments || []).map(function (m) {
            return '<div class="tmoment"><i>' + esc(m.when) + '</i><span>' + esc(m.what) + '</span></div>';
          }).join('') + '</div>' +
      '</div>' +
      (timeSite ? cal : '') +
      '<div class="card"><p style="margin:0 0 8px">' + esc(e.kid) + '</p>' +
      (figs.length ? '<div class="row" style="align-items:center">' +
        figs.map(function (f) { return art(f.id, 46); }).join('') +
        '<span class="tiny muted">the people of this age \u2014 open the age to meet them</span></div>' : '') +
      '</div>' +
      '<button class="tsab" data-act="game" data-id="sabhyata">' +
      '<b>\ud83c\udfdb Sabhyata</b><span>The whole river of time, playable \u2014 wake the land one lamp at a time</span>' +
      '<em>Play \u2192</em></button>';
  }


  function stateName(c) {
    var G = window.IND_GEO;
    /* States that have data but no map geometry yet — Telangana and Ladakh are known,
       documented gaps — must still have names. A raw code on screen ("Today, from TG")
       reads as a bug because it is one. */
    var PENDING = { TG: 'Telangana', LA: 'Ladakh' };
    var X = window.IND_INDEX && window.IND_INDEX.names;
    return (G && G.states[c] && G.states[c].name) || (X && X[c]) || PENDING[c] || c;
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
    /* the river of time rides above the map; any stop before Aaj re-lights
       the land as that age saw it, and Aaj is the living map below, untouched.
       (tstrip, not strip: this view already owns a 'strip' for the day-fact.) */
    var tstrip = timeStrip();
    if (timeStop !== 'aaj') return tstrip + timeLens(timeStop);
    /* today's map has two skins: the states (rajya) and the land (bhugol) */
    var mtoggle = '<div class="bg-toggle" role="tablist" aria-label="Map view">' +
      '<button class="bg-tab' + (mapMode === 'rajya' ? ' on' : '') + '" data-act="mapmode" data-m="rajya" role="tab">' + icon('map', 18) + ' Rajya \u00b7 the states</button>' +
      '<button class="bg-tab' + (mapMode === 'bhugol' ? ' on' : '') + '" data-act="mapmode" data-m="bhugol" role="tab">' + icon('temple', 18) + ' Bhugol \u00b7 the land</button></div>';
    if (mapMode === 'bhugol') return tstrip + mtoggle + bhugolView();
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
      /* `big`: room for a name at phone size — on a phone only those keep a label, set large
         enough to read (the rest are a tap away and carry a <title>) */
      return '<text class="tlab' + (S.lit[c] ? ' lit' : '') + (b[2] >= 120 && b[3] >= 80 ? ' big' : '') + '" x="' + a[0] + '" y="' + a[1] +
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
    return tstrip + mtoggle + '<div class="card mapcard">' +
      '<div class="spread" style="margin-bottom:6px;align-items:baseline">' +
        '<h2 style="margin:0;font-size:20px">India</h2>' +
        '<span class="tiny muted" style="flex:1;margin-left:10px">' + lit + ' of ' + total +
          ' places remembered · tap a state</span>' +
        '<span class="pill stat" title="Good days this week">🪔 ' + goodDays() + '/7</span></div>' +
      '<div class="mapwrap">' +
        '<svg class="mapsvg" viewBox="' + M.viewBox + '" role="img" aria-label="Map of India">' +
          '<defs>' + defs + '</defs>' +
          '<path class="outline" d="' + M.outline + '"/>' + paths + pins + caps + labels + '</svg>' +
        callout + mapYou(M) +
      '</div>' +
      strip +
      /* DONE · NEXT · STILL MISTY, each said in words (FIX-INDIA D8) */
      '<div class="legend maplegend" style="margin-top:14px">' +
        '<span><i class="sw sw-lit"></i>remembered — painted in</span>' +
        '<span><i class="sw sw-you">' + art(S.buddy, 18) + '</i>you — your next story is from here</span>' +
        '<span><i class="sw sw-mist"></i>still misty — finish a story from here to light it</span>' +
        '<span><i class="dot lg-cap"></i>a capital city</span>' +
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
    if (!s) return emptyState('Nothing here yet — it is on its way.', 'Back to Home');
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
        /* ONE PLACE, ONCE (FIX-INDIA N12: Tamil Nadu listed the Meenakshi Temple twice) — a
           place the monuments list already carries is not repeated from the state's own list */
        (X.places || []).filter(function (pl) {
          var k = String(pl.name || '').toLowerCase().split(/[ ,]/)[0];
          return !mons.some(function (m) { return String(m.name || '').toLowerCase().split(/[ ,]/)[0] === k; });
        }).map(function (pl) {
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
    return '<div class="shelfhead"><h3>' + esc(title) + '</h3>' +
      (note ? '<p class="tiny">' + esc(note) + '</p>' : '') + '</div>' +
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
    return '<h1 class="sr-only">' + esc(tellerTitle()) + '</h1>' +
      '<button class="pickbar" data-act="tellone">' +
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
      '<div class="shelfhead"><h3>The shelves</h3>' +
      '<p class="tiny">Eight rooms, every story in one of them. Step in anywhere.</p></div>' +
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
    if (!play.story || play.story.id !== id) {
      /* Continue opens a story at the scene the child left it, never back at the start */
      var from = play.from && play.from.id === id ? Math.min(play.from.i || 0, st.scenes.length - 1) : 0;
      play.story = st; play.i = from; play.answered = false; play.from = null;
    }
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
      '<h1 class="sr-only">' + esc(st.title) + '</h1>' +
      '<div class="rhead">' +
      '<button class="backlink" style="padding:0" data-act="go" data-v="stories">' + icon('back', 18) +
        (S.started ? ' Stories' : ' Back') + '</button>' +
      '<div class="dots">' + st.scenes.map(function (_, i) { return '<i class="' + (i <= play.i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<span class="badge ' + st.badge + '">' + st.badge + '</span></div>' +

      /* NO STICKERS OVER A PAINTING (FIX-INDIA D4, N2). A scene with its own painted plate
         shows the painting whole; the speaker's face moves down beside their name in the
         speech panel. A scene with no plate keeps the cast on the stage, as before. */
      '<div class="stage' + (img ? ' painted' : '') + '"' + (img ? ' style="background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.35)),url(' + img + ')"' : '') + '>' +
        (img ? '' : (teller ? '<div class="speaking">' + mascot('mithu', 'talk', 128) + '</div>' :
          cast.map(function (c, i) { return '<div class="' + (i === 0 ? 'speaking' : '') + '">' + art(c, i === 0 ? 128 : 100) + '</div>'; }).join(''))) + '</div>' +

      /* Bubble when somebody is talking, plain panel when the storyteller is. */
      '<div class="speech' + (hasDialogue(sc.text) ? ' bubble' : '') + '">' +
      (teller ? '<span class="who">' + (img ? '<span class="whoface">' + mascot('mithu', 'talk', 30) + '</span>' : '') + 'Mithu</span>'
              : (cast[0] && avatarName(cast[0]) ? '<span class="who">' + (img ? '<span class="whoface">' + art(cast[0], 30) + '</span>' : '') + esc(avatarName(cast[0])) + '</span>' : '')) +
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
    /* THE GUEST'S END: the first story is finished before a single question was asked,
       and now the asking is worth it — it is the same story's place that lights first */
    if (!S.started) {
      return (himg ? '<div class="heroshot" style="background-image:url(' + himg + ')"></div>' : '') +
        '<div class="card center">' + mascot('mithu', 'wink', 112) +
        '<h1 style="margin-top:8px">' + esc(st.title) + '</h1>' +
        '<p style="font-size:18px;max-width:52ch;margin:0 auto var(--space-md)">' + esc(st.moral) + '</p>' +
        (place ? '<span class="badge aaj">🪔 The mist lifted off ' + esc(place) + '</span>' : '') +
        '<p style="max-width:52ch;margin:var(--space-lg) auto">That is one story of ' + allStories().length +
          '. Tell us your child’s first name and age, and ' + (place ? esc(place) + ' stays lit on their map' :
          'it stays on their shelf') + ' — it takes about half a minute.</p>' +
        '<div class="row" style="justify-content:center">' +
        '<button class="btn lg" data-act="begin">Make it theirs →</button>' +
        '<button class="btn ghost" data-act="again" data-id="' + st.id + '">' + icon('play', 18) + ' Again</button></div></div>' +
        '<div class="card flat tiny"><b>Where this comes from.</b> ' + esc(st.source || '') + '</div>';
    }
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
    if (!e) return errorState('That page is not here. It may have moved — Home always has the way in.');
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
    return '<button class="backlink" data-act="go" data-v="neeti">' + icon('back', 18) + ' Moral Science</button>' +
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
    if (!f) return errorState('That page is not here. It may have moved — Home always has the way in.');
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
      (f.note ? '<div class="card flat tiny"><b>A note on the pictures.</b> ' + esc(f.note) + '</div>' : '') +
      /* WHERE THIS COMES FROM (CLAUDE.md rule 2, docs/05). Every faith page names what it
         rests on — the tradition's own texts and the standard references a grown-up can
         check — rather than asking to be taken on trust. */
      ((f.sources || []).length
        ? '<div class="card flat tiny"><b>Where this comes from.</b><ul class="srclist">' +
          f.sources.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>'
        : '');
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
    if (!U) return emptyState('Nothing here yet — it is on its way.', 'Back to Home');
    var now = utsavNow(), month = MONTHS[new Date().getMonth()];
    var rest = U.festivals.filter(function (f) { return now.indexOf(f) < 0; });

    return '<button class="backlink" data-act="go" data-v="neeti">' + icon('back', 18) + ' Moral Science</button>' +
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
    if (!f) return errorState('That page is not here. It may have moved — Home always has the way in.');
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
    if (!G) return emptyState('Nothing here yet — it is on its way.', 'Back to Home');
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
    if (!g) return errorState('That page is not here. It may have moved — Home always has the way in.');
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
    if (!N) return emptyState('Nothing here yet — it is on its way.', 'Back to Home');
    var q = naniWeek();
    if (nani.clips === null) { loadClips(render); }
    var n = (nani.clips || []).length;

    return '<button class="backlink" data-act="go" data-v="home">' + icon('back', 18) + ' Home</button>' +
      '<div class="card"><h1>' + esc(naniTitle()) + '</h1><p>' + esc(N.archive.tagline) + '</p></div>' +

      (q ? '<div class="card askcard">' +
          '<span class="mono">This week, ask ' + esc(kinTerm(q.to)) + '</span>' +
          '<h2 style="margin:8px 0">' + esc(kinEn(q)) + '</h2>' +
          '<p lang="' + esc(q.lang || 'hi') + '" style="margin-bottom:4px">' + esc(naniFill(q.hi)) + '</p>' +
          '<p class="tiny muted">' + esc(naniFill(q.roman)) + '</p>' +
          (q.follow ? '<p class="tiny"><b>If the answer is short, ask:</b> ' + esc(naniFill(q.follow)) + '</p>' : '') +
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
    var empty = naniFill(N.ritual.empty[Math.floor(Date.now() / 86400000) % N.ritual.empty.length]);

    return '<button class="backlink" data-act="go" data-v="nani">' + icon('back', 18) + ' Back</button>' +
      '<div class="card">' +
        '<h1>' + esc(naniTitle()) + '</h1>' +
        /* archive.child is an object (headline, blurb, empty…): printing it whole is how the
           shelf came to say "[object Object]" (FIX-INDIA §1) */
        '<p>' + esc(N.archive.child.blurb) + '</p>' +
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

  /* {child} and {relation} are tokens the data leaves for the view (data-nani.js). Every
     string from IND_NANI that reaches the screen goes through here, so a raw "{child}" can
     never be printed again (FIX-INDIA §1). */
  function naniFill(t) {
    return String(t == null ? '' : t)
      .replace(/\{child\}/g, S.name || 'your child')
      .replace(/\{relation\}/g, kinTerm('nani'))
      .replace(/\{n\}/g, '');
  }
  /* ASK A GRANDPARENT — the honest version. There is no family account yet, so there is no
     link to send and no page a grandparent can open from far away. The page used to promise
     both ("No password and no account", "Send to {child}"). What is true is that the shelf
     records on THIS device, so this page says how to use it: when they visit, or holding the
     phone up on a call. Nothing here pretends to send anything. */
  V.invite = function () {
    var N = window.IND_NANI, L = N.invite.landing, nm = esc(S.name || 'your child');
    return '<button class="backlink" data-act="go" data-v="nani">' + icon('back', 18) + ' Back</button>' +
      '<div class="card"><h1>Ask ' + esc(kinTerm('nani')) + ' or ' + esc(kinTerm('nana')) + ' for a story</h1>' +
        '<p>' + nm + ' can keep a grandparent’s voice on the Family Shelf and play it any night. ' +
        'It records on this device, so it works when they visit — or hold the phone up on the Sunday call.</p>' +
        '<ol class="dolist">' +
          '<li>Open the Family Shelf and press <b>Record a story</b>.</li>' +
          '<li>' + esc(naniFill(L.what)) + '</li>' +
          '<li>Any story, in any language. Two minutes is plenty.</li>' +
        '</ol>' +
        '<button class="btn" data-act="go" data-v="shelf">' + icon('mic', 18) + ' Open the Family Shelf</button></div>' +
      '<div class="card"><h2 style="margin-top:0">Hello, in their language</h2>' +
        '<div class="grid g3">' + (N.invite.greetings || []).map(function (g) {
          return '<div class="tile center"><b lang="' + esc(g.lang || 'hi') + '">' + esc(g.text || g.word || '') + '</b>' +
            '<span class="tiny muted">' + esc(g.roman || '') + (g.note ? ' · ' + esc(g.note) : '') + '</span></div>'; }).join('') + '</div>' +
        '<p class="tiny muted">Not every grandparent in this app speaks Hindi, and the app should ' +
        'never assume they do.</p></div>' +
      '<div class="card flat tiny"><b>What this does not do yet.</b> There is no family account, so there is ' +
        'no link to send a grandparent who lives far away. Recordings stay on this device and are never sent ' +
        'anywhere. If that changes, the privacy page changes first.</div>';
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
    if (!G) return emptyState('Nothing here yet — it is on its way.', 'Back to Home');
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
    if (!s) return errorState('That page is not here. It may have moved — Home always has the way in.');
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
    if (!e) return errorState('That page is not here. It may have moved — Home always has the way in.');
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
    if (!e) return errorState('That page is not here. It may have moved — Home always has the way in.');
    var ep = e.episodes.filter(function (x) { return x.n === deck.n; })[0];
    if (!ep) return errorState('That page is not here. It may have moved — Home always has the way in.');
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
    if (!c) return errorState('That page is not here. It may have moved — Home always has the way in.');
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


  /* ================================================================
     NEETI IS A LIBRARY OF TOOLS, not a page of tiles.
     Borrowed wholesale from Bizzing Bee's Explore hub, which is the pattern
     the team already reads fluently: a head, then coloured hub panels, and
     inside each a row — icon, what it is, and a subtitle carrying LIVE STATE
     rather than a description. "4 of 12 cards" tells a child where they are;
     "learn about values" tells them nothing they did not already know.
     ================================================================ */
  function neetiDeck() { return window.IND_NEETI_DECK || { values: {}, dvandva: [], ghar: [] }; }
  function neetiState() {
    if (!S.neeti) S.neeti = {};
    if (!S.neeti.cards) S.neeti.cards = {};
    if (!S.neeti.dv) S.neeti.dv = {};
    if (!S.neeti.ghar) S.neeti.ghar = {};
    return S.neeti;
  }
  function neetiStories(vid) {
    var tagged = (window.IND_NEETI_STORIES || {})[vid] || [];
    var byId = {}; allStories().forEach(function (st) { byId[st.id] = st; });
    var K = window.IND_NEETI, v = K && K.values.filter(function (x) { return x.id === vid; })[0];
    /* the hand-picked ones first — somebody chose those on purpose */
    var ids = (v && v.stories || []).concat(tagged.filter(function (id) {
      return (v && v.stories || []).indexOf(id) < 0;
    }));
    return ids.map(function (id) { return byId[id]; }).filter(Boolean);
  }
  /* one row of a hub */
  function neetiRow(act, arg, ic, label, sub, col) {
    return '<button class="tile" style="display:flex;align-items:center;gap:11px;text-align:left;width:100%;margin-bottom:8px"' +
      ' data-act="' + act + '"' + (arg ? ' data-v="' + esc(arg) + '"' : '') + '>' +
      '<span style="flex:0 0 auto;display:flex">' + (typeof ic === 'string' && ic.indexOf('<') === 0 ? ic : icon(ic, 30)) + '</span>' +
      '<span style="flex:1 1 auto;min-width:0">' +
      '<b style="display:block;font-family:var(--display);font-size:15px">' + esc(label) + '</b>' +
      '<span class="tiny muted" style="display:block;margin-top:1px">' + esc(sub) + '</span></span>' +
      '<span aria-hidden="true" style="flex:0 0 auto;font-weight:800;color:' + (col || 'var(--accent)') + '">→</span></button>';
  }
  function neetiHub(title, intro, col, inner) {
    return '<section class="card" style="border-color:color-mix(in srgb,' + col + ' 34%,var(--line))">' +
      '<div class="mono" style="color:color-mix(in srgb,' + col + ' 58%,#000)">' + esc(title) + '</div>' +
      '<p class="tiny muted" style="margin:2px 0 11px">' + esc(intro) + '</p>' + inner + '</section>';
  }

  V.neeti = function () {
    var K = window.IND_NEETI;
    if (!K) return '<div class="card"><h1>Moral Science</h1><p>Not loaded.</p></div>';
    var D = neetiDeck(), NS = neetiState();
    var beads = (S.mala || []).length;
    var cardsDone = Object.keys(NS.cards).length, allV = K.values.length;
    var dvDone = Object.keys(NS.dv).length, gharDone = Object.keys(NS.ghar).length;
    var fest = (typeof utsavNow === 'function') ? utsavNow() : [];
    var deedsAll = 0;
    Object.keys(D.values || {}).forEach(function (k) { deedsAll += (D.values[k].deeds || []).length; });

    /* LEARN — where the ideas are kept */
    var learn = neetiRow('go', 'dharma', 'temple', 'Dharma — the faiths',
        (window.IND_DHARMA ? 'Four traditions, each told from the inside' : 'not loaded'), '#7C5CFF') +
      neetiRow('go', 'shlok', 'scroll', 'Shlok — verses to carry',
        'Thirukkural, Dhammapada, subhashitas', '#7C5CFF') +
      neetiRow('go', 'utsav', 'lamp', 'Utsav — festivals of India',
        (fest.length ? fest[0].name + ' falls this month · ' : '') +
        ((window.IND_UTSAV && window.IND_UTSAV.festivals.length) || 0) + ' festivals', '#7C5CFF');

    /* PRACTISE — the twelve, and what to do about them */
    var practise = neetiRow('cards', null, 'star', 'The value deck',
        cardsDone + ' of ' + allV + ' cards done · ' + deedsAll + ' deeds to try', '#13A892') +
      neetiRow('go', 'dvandva', 'peace', 'Dvandva — when two goods collide',
        dvDone + ' of ' + (D.dvandva || []).length + ' met · nothing is scored', '#13A892') +
      neetiRow('go', 'ghar', 'home', 'Ghar ki baat — ask at home',
        gharDone + ' of ' + (D.ghar || []).length + ' asked', '#13A892');

    /* MEET — the people */
    var meet = neetiRow('go', 'people', 'crown', 'People who lived it',
        allV + ' lives · the compass each one steered by', '#F0703C') +
      ((window.IND_GAMES || []).some(function (g2) { return g2.id === 'festival'; })
        ? neetiRow('game', 'festival', 'lamp', 'Festival Frenzy',
          'Twelve festivals, one year — match each to its month', '#F0703C') : '');

    return '<div class="phead"><h1>Moral Science</h1>' +
      '<span class="mono" lang="hi">neeti · नीति — the art of living well</span>' +
      '<p>' + esc(K.intro) + '</p></div>' +
      (beads ? V.malaStrip() : '') +
      '<div class="grid g2" style="align-items:start">' +
      neetiHub('Learn', 'Where these ideas are kept, and how they are said.', '#7C5CFF', learn) +
      neetiHub('Practise', 'The twelve values, the hard cases, and the question you take home.', '#13A892', practise) +
      '</div>' +
      neetiHub('Meet', 'People who steered by one of these, and a game.', '#F0703C', meet) +
      '<p class="pfoot">Cards are for keeping. Beads are different: you get one when you ' +
      '<b>do</b> something, never when you read about it, and nobody checks.</p>';
  };

  /* THE VALUE DECK — a card per value, and the currency comes from doing them */
  V.cards = function () {
    var K = window.IND_NEETI, D = neetiDeck(), NS = neetiState();
    if (!K) return '<div class="card">Not loaded.</div>';
    var done = Object.keys(NS.cards).length;
    return '<button class="backlink" data-act="go" data-v="neeti">' + icon('back', 18) + ' Moral Science</button>' +
      '<div class="card"><h1>The value deck</h1>' +
      '<div class="mono">' + done + ' of ' + K.values.length + ' done</div>' +
      '<p class="tiny muted">Each card: what it is, what it does for you, where it is spoken ' +
      'of, and the stories that carry it. Finish a card and it pays.</p></div>' +
      '<div class="grid g2">' + K.values.map(function (v) {
        var d = (D.values || {})[v.id] || {};
        var got = !!NS.cards[v.id];
        var n = (S.mala || []).filter(function (b) { return b.v === v.id; }).length;
        return '<button class="tile" data-act="value" data-id="' + v.id + '">' +
          '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(v.avatar, 58) +
          '<div style="flex:1">' +
          '<span class="deva" style="font-size:22px;font-weight:700;color:' + v.colour + '">' + esc(v.term) + '</span> ' +
          '<span class="mono" style="text-transform:none">' + esc(v.roman) + '</span>' +
          '<div style="font-family:var(--display);font-weight:800;font-size:17px;margin:4px 0 3px">' + esc(v.en) + '</div>' +
          '<div class="tiny muted">' + esc(d.benefit || v.kid) + '</div>' +
          '<div class="tiny" style="margin-top:7px;color:' + v.colour + '">' +
          (got ? '<b>✓ card done</b>' : '<b>new card</b>') +
          (n ? ' · ' + n + ' bead' + (n > 1 ? 's' : '') : '') + '</div>' +
          '</div></div></button>';
      }).join('') + '</div>';
  };

  /* DVANDVA — two values pulling against each other, and no score anywhere */
  V.dvandva = function () {
    var D = neetiDeck(), NS = neetiState(), K = window.IND_NEETI;
    var name = function (id) {
      var v = K && K.values.filter(function (x) { return x.id === id; })[0];
      return v ? v.en : id;
    };
    var col = function (id) {
      var v = K && K.values.filter(function (x) { return x.id === id; })[0];
      return v ? v.colour : 'var(--accent)';
    };
    return '<button class="backlink" data-act="go" data-v="neeti">' + icon('back', 18) + ' Moral Science</button>' +
      '<div class="card"><h1>Dvandva</h1>' +
      '<div class="mono">when two goods collide</div>' +
      '<p>Twelve values, all good, is a poster. The thinking starts when two of ' +
      'them want different things from you on the same afternoon.</p>' +
      '<p class="tiny muted">Nothing here is scored and none of these has a right ' +
      'answer. The Mahabharata is a hundred thousand verses of the same argument.</p></div>' +
      (D.dvandva || []).map(function (c) {
        var picked = NS.dv[c.id];
        return '<div class="card"><div class="row" style="gap:6px;margin-bottom:8px">' +
          '<span class="pill" style="background:color-mix(in srgb,' + col(c.a) + ' 20%,transparent)">' + esc(name(c.a)) + '</span>' +
          '<span class="tiny muted" style="align-self:center">against</span>' +
          '<span class="pill" style="background:color-mix(in srgb,' + col(c.b) + ' 20%,transparent)">' + esc(name(c.b)) + '</span></div>' +
          '<p style="font-size:16px">' + esc(c.scene) + '</p>' +
          '<p class="mono" style="margin:10px 0 6px">' + esc(c.ask) + '</p>' +
          c.opts.map(function (o, i) {
            var on = picked === i;
            return '<button class="btn' + (on ? '' : ' ghost') + '" style="display:block;width:100%;text-align:left;margin:6px 0"' +
              ' data-act="dvpick" data-id="' + c.id + '" data-i="' + i + '">' + esc(o) + '</button>';
          }).join('') +
          (picked != null
            ? '<div class="card flat" style="margin-top:10px"><p style="margin:0 0 8px">' + esc(c.after) + '</p>' +
              '<p class="tiny muted" style="margin:0">' + esc(c.says) + '</p></div>'
            : '') +
          '</div>';
      }).join('') +
      '<div class="card flat"><p class="tiny muted">These cards are drafts. What a ' +
      'tradition holds is not ours to summarise unreviewed, so a named reviewer ' +
      'signs them off before they are anything but a conversation starter.</p></div>';
  };

  /* GHAR KI BAAT — the question that leaves the app */
  V.ghar = function () {
    var D = neetiDeck(), NS = neetiState(), K = window.IND_NEETI;
    return '<button class="backlink" data-act="go" data-v="neeti">' + icon('back', 18) + ' Moral Science</button>' +
      '<div class="card"><h1>Ghar ki baat</h1>' +
      '<div class="mono">the question you take home</div>' +
      '<p>One question per value, for a parent or a grandparent. The answers are ' +
      'theirs, not ours — tap what they said, roughly.</p>' +
      '<p class="tiny muted">Nothing you type is kept anywhere, because nothing here ' +
      'can be typed. The last answer on every question is the honest one.</p></div>' +
      (D.ghar || []).map(function (g) {
        var v = K && K.values.filter(function (x) { return x.id === g.v; })[0];
        var picked = NS.ghar[g.v];
        return '<div class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">' +
          (v ? art(v.avatar, 44) : '') +
          '<div style="flex:1"><div class="mono" style="color:' + (v ? v.colour : 'var(--accent)') + '">' +
          esc(v ? v.en : g.v) + '</div>' +
          '<p style="margin:4px 0 8px;font-size:15px">' + esc(g.q) + '</p>' +
          g.opts.map(function (o, i) {
            return '<button class="btn' + (picked === i ? '' : ' ghost') + '" style="display:block;width:100%;text-align:left;margin:5px 0"' +
              ' data-act="gharpick" data-v="' + g.v + '" data-i="' + i + '">' + esc(o) + '</button>';
          }).join('') + '</div></div></div>';
      }).join('');
  };

  /* PEOPLE WHO LIVED IT — built from the person already on every value, so
     every claim here has been through the same hands the values did */
  V.people = function () {
    var K = window.IND_NEETI;
    if (!K) return '<div class="card">Not loaded.</div>';
    return '<button class="backlink" data-act="go" data-v="neeti">' + icon('back', 18) + ' Moral Science</button>' +
      '<div class="card"><h1>People who lived it</h1>' +
      '<div class="mono">a compass, and somebody who steered by it</div>' +
      '<p>A value is easy to admire and hard to do. These are people who did one ' +
      'of them, at a cost, for long enough that it changed something.</p></div>' +
      '<div class="grid g2">' + K.values.map(function (v) {
        if (!v.person) return '';
        return '<button class="tile" data-act="value" data-id="' + v.id + '">' +
          '<div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(v.person.avatar, 62) +
          '<div style="flex:1"><b style="font-family:var(--display);font-size:16px">' + esc(v.person.name) + '</b>' +
          '<div class="mono" style="text-transform:none;color:' + v.colour + ';margin:2px 0 4px">' +
          esc(v.roman) + ' · ' + esc(v.en) + '</div>' +
          '<div class="tiny muted">' + esc(v.person.did) + '</div></div></div></button>';
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
          '<p class="tiny muted">Empty for now. Do today’s small thing on Home ' +
          'and the first one is yours — and it stays, because a bead is something you did and ' +
          'that cannot un-happen.</p>') +
      '</div>';
  };

  V.value = function (id) {
    var K = window.IND_NEETI;
    var v = K && K.values.filter(function (x) { return x.id === id; })[0];
    if (!v) return errorState('That page is not here. It may have moved — Home always has the way in.');
    /* the hand-picked stories plus everything the corpus's own morals matched */
    var mine = neetiStories(v.id);
    var done = (S.mala || []).filter(function (b) { return b.v === v.id; });
    var big = (S.age || 8) >= 9;
    var d = (neetiDeck().values || {})[v.id] || {};
    var NS = neetiState(), gotCard = !!NS.cards[v.id];
    /* SIX DEEDS, NOT ONE. The value pages have always said a bead is earned by
       doing rather than reading, and then offered a single deed per value —
       twelve in the whole subject. One is shown at a time, and it changes. */
    var deeds = (d.deeds || []).length ? d.deeds : [{ t: v.doit, at: 'anywhere' }];
    var pick = deeds[done.length % deeds.length];

    return '<button class="backlink" data-act="go" data-v="cards">' + icon('back', 18) + ' The value deck</button>' +
      '<div class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">' + art(v.avatar, 92) +
      '<div style="flex:1"><span class="deva" style="font-size:34px;font-weight:700;color:' + v.colour + '">' + esc(v.term) + '</span>' +
      '<div class="mono" style="text-transform:none">' + esc(v.roman) + '</div>' +
      '<h1 style="margin:6px 0 8px">' + esc(v.en) + '</h1>' +
      '<p style="margin:0;font-size:17px">' + esc(v.kid) + '</p></div></div>' +
      (big ? '<div class="card flat" style="margin-top:14px">' + esc(v.big) + '</div>' : '') + '</div>' +

      /* WHAT IT DOES FOR YOU — the card had every other side of a value and
         not this one, which is the side a child actually weighs */
      (d.benefit ? '<div class="card tint"><div class="mono">What it gets you</div>' +
        '<p style="font-family:var(--display);font-size:19px;margin:6px 0 0">' + esc(d.benefit) + '</p></div>' : '') +

      (d.where ? '<div class="card flat"><div class="mono">Where it is spoken of</div>' +
        '<p style="margin:6px 0 0">' + esc(d.where) + '</p>' +
        (v.verse ? '<p class="tiny muted" style="margin:8px 0 0">' + esc(v.verse) + '</p>' : '') +
        '</div>' : '') +

      /* THE DEED — the only thing that earns a bead */
      '<div class="card tint notch"><div class="mono">Do this one' +
      (deeds.length > 1 ? ' · ' + ((done.length % deeds.length) + 1) + ' of ' + deeds.length : '') + '</div>' +
      '<p style="font-family:var(--display);font-size:21px;margin:8px 0 4px">' + esc(pick.t) + '</p>' +
      '<p class="tiny muted" style="margin:0 0 14px">' + esc(pick.at === 'anywhere' ? 'anywhere' : 'at ' + pick.at) + '</p>' +
      '<div class="row">' +
      '<button class="btn" data-act="deed" data-id="' + v.id + '">I did it</button>' +
      '<button class="btn ghost" data-act="deednani" data-id="' + v.id + '">Tell ' + esc(kinTerm('nani')) + '</button></div>' +
      (done.length ? '<div class="tiny muted" style="margin-top:12px">You have done this ' +
        done.length + ' time' + (done.length > 1 ? 's' : '') + '. Last: ' + esc(done[done.length - 1].on) + '</div>' : '') +
      '<p class="tiny muted" style="margin-top:10px">Nobody is checking. That is rather the point.</p></div>' +

      /* THE CARD ITSELF — read it through, and it pays once */
      (gotCard
        ? '<div class="card flat"><div class="mono">Card done</div><p class="tiny muted" ' +
          'style="margin:6px 0 0">You have this one. The deeds keep going.</p></div>'
        : '<div class="card"><div class="mono">Finish the card</div>' +
          '<p class="tiny muted" style="margin:6px 0 10px">Read it through and take it. ' +
          'Sikke for the card; beads only ever for the doing.</p>' +
          '<button class="btn" data-act="carddone" data-id="' + v.id + '">Take the card</button></div>') +

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
  /* The picker reads worlds-art.js when it is loaded — that file owns the
     worlds (five active; ten more archived in place), their palettes, tiles
     and credit lines. The old hardcoded WORLDS array stays only as the
     fallback for a build without it. */
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
          (open ? '' : '<p class="tiny" style="margin:6px 0 0;color:var(--accent-ink,var(--accent));font-weight:700">' +
            (E && E.canAfford(S, price) ? 'Tap to open it with your coins'
                                        : 'Keep learning — ' + (price - coins()) + ' more coins') + '</p>') +
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
    /* The paragraph that used to sit here — "not one language, a platform" — is a pitch
       aimed at a grown-up, and it was standing between a child and their own script. It
       is at the foot of this page now, whole. */
    return '<div class="phead"><h1>Bhasha</h1>' +
      '<span class="mono">भाषा · the languages of India</span>' +
      '<p>Pick your family\u2019s script and start. Every pack runs the same eight rungs.</p></div>' +
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
      /* Both of these used to be above the packs: a platform pitch written for a grown-up
         and a build note written for us. Neither is what a child opened this tab for. */
      '<div class="pfoot"><p style="margin:0 0 8px"><b>Not one language — a platform.</b> ' +
      'Hindi and Punjabi run on the same engine, because almost every Indian script works ' +
      'the same way underneath. Adding Gujarati or Tamil is a data file, not a rewrite.</p>' +
      '<p style="margin:0"><b>Note.</b> The Hindi and Punjabi audio here is synthesised, as a ' +
      'placeholder. Per <code>docs/09</code> it must be replaced with human voice before ' +
      'launch — children imitate these sounds, and TTS teaches errors a native-speaker ' +
      'parent hears instantly.</p>' +
      '<span class="badge">Premium in the real product</span></div>';
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
             plan: null, pi: 0, over: false, mode: 'lesson', offer: null,
             /* the lesson being walked, so every beat can say where it is — and the
                unit the child has opened on the path, if they opened one */
             lesson: null, openUnit: null };
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
        if (!sst.testout) { sst.testout = true; save(); earn('mastery', 'tested out'); }
        checkGrowth();
      }
      if (quiz.done > 0) sfx('finish');
      if (quiz.mode === 'lesson' && quiz.done > 0) {
        markToday();
        var lp = window.IND_PACKS[quiz.packId];
        lastDid('lesson', lp && lp.name ? lp.name.en : 'Bhasha', '', { lang: quiz.packId });
        sfx('win');
        var AL = aajState();
        if (AL && quiz.packId === AL.pack && ((quiz.lesson && quiz.lesson.id === AL.lesson) || (!AL.lesson && quiz.stage === AL.review))) {
          AL.did.lesson = true;
          AL.met = quiz.lesson ? quiz.lesson.items.map(previewOf) : [];
          save();
        }
        checkGrowth();
      }
      return;
    }
    var sp = specs[quiz.pi];
    quiz.build = { placed: [], kfocus: 0, kb: false };
    quiz.fb = null; quiz.lock = false; quiz.reveal = false; quiz.typed = ''; quiz.hold = false;
    quiz.hint = null;
    if (sp.item != null && (quiz.seen || (quiz.seen = [])).indexOf(sp.item) < 0) quiz.seen.push(sp.item);
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
  function startSession(sid, mode, lesson, review) {
    if (!sid) return;
    var rec = ensureLang(quiz.packId);
    quiz.stage = sid; quiz.mode = mode || 'lesson';
    quiz.offer = null; quiz.over = false; quiz.done = 0; quiz.right = 0; quiz.pi = 0;
    quiz.seen = []; quiz.missed = [];
    /* a lesson narrows what is NEW to its own four things; review stays rung-wide */
    quiz.lesson = (quiz.mode === 'lesson' && lesson) ? lesson : null;
    quiz.plan = window.IND_BHASHA.session(quiz.packId, sid, rec,
      { now: Date.now(), testout: quiz.mode === 'testout',
        only: quiz.lesson ? quiz.lesson.keys : null, review: review || null });
    planStep();
  }

  /* ------------------------------------------------------------------ THE PATH
     rung -> unit -> lesson, with every lesson's state read off the SRS record. Nothing
     here is stored: a lesson is done when each of its things has been met and answered
     right once (IND_BHASHA.lessonDone), and that is a fact about the cards, not a flag
     that could disagree with them. */
  function bPath(id) {
    var p = window.IND_PACKS[id], B = window.IND_BHASHA, rec = ensureLang(id);
    var stages = p.stages || [], out = [];
    stages.forEach(function (s, i) {
      var units = (B && B.path) ? B.path(id, s.id) : [];
      var total = 0, done = 0;
      units.forEach(function (u) {
        u.stageId = s.id;
        u.lessons.forEach(function (l) {
          l.done = B.lessonDone(l, rec.srs);
          l.started = !l.done && B.lessonStarted(l, rec.srs);
          l.unit = u; l.stage = s;
          total++; if (l.done) done++;
        });
        u.done = u.lessons.filter(function (l) { return l.done; }).length;
      });
      out.push({ stage: s, i: i, units: units, total: total, done: done,
                 unlocked: stageUnlocked(id, i, stages), mastered: stageMastered(id, s) });
    });
    return out;
  }
  /* the ONE next lesson: the first not-done lesson in the first open rung that is not
     mastered. If every lesson in that rung is met but it is not yet mastered, the next
     thing is REVIEW of that rung — said as such, never dressed up as a new lesson. */
  function bNext(path) {
    for (var i = 0; i < path.length; i++) {
      var r = path[i];
      if (!r.unlocked || r.mastered) continue;
      for (var u = 0; u < r.units.length; u++)
        for (var l = 0; l < r.units[u].lessons.length; l++)
          if (!r.units[u].lessons[l].done) return { lesson: r.units[u].lessons[l], rung: r };
      return { review: true, rung: r };
    }
    return null;
  }
  function bLesson(path, lid) {
    var hit = null;
    path.forEach(function (r) { r.units.forEach(function (u) { u.lessons.forEach(function (l) {
      if (l.id === lid) hit = l; }); }); });
    return hit;
  }
  /* the short form of a thing, for a preview: a word or letter as itself, a sentence
     by its first few words, a reply by the child's own line */
  function previewOf(it) {
    if (it == null) return '';
    if (typeof it === 'string') return it;
    if (Array.isArray(it)) return previewOf(it[1] || it[0]);
    if (it.reply) return previewOf(it.reply);
    var t = it.hi || it.char || it.word || '';
    var w = String(t).split(' ');
    return w.length > 3 ? w.slice(0, 3).join(' ') + '…' : t;
  }

  /* what a lesson hands the session: enough to say where the child is, and its keys */
  function lessonRef(l) {
    return { id: l.id, n: l.n, of: l.of, keys: l.keys, items: l.items,
             unit: l.unit.title, stage: l.stage.name };
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
    if (!ok && sp && sp.item != null && (quiz.missed || (quiz.missed = [])).indexOf(sp.item) < 0) quiz.missed.push(sp.item);
    save();
    if (ok) { earn('answer', 'correct'); quiz.right++; }
    quiz.done++;
  }
  /* RIGHT ANSWERS MOVE ON; WRONG ANSWERS HOLD (family standard §6). A wrong answer used
     to show the right one for 2.6 seconds and then move on by itself — before a child had
     read why. Now it waits for Continue (tap, Enter or →), says the right answer aloud in
     the device's own voice, and the feedback strip stays on the screen until then. */
  function settle(ok, okMs) {
    sfx(ok ? 'right' : 'wrong');
    if (ok || window.BI_FAST) return advance(okMs);
    quiz.hold = true;
    var q = quiz.q, right = q && (q.answerWord || (Array.isArray(q.answer) ? q.answer.join('') :
      (q.options && typeof q.answerIndex === 'number' ? q.options[q.answerIndex] : '')));
    if (right && typeof right === 'string') speak(null, right, packLang());
    if (quiz.fb) {
      quiz.fb.html += '<div class="fbgo"><button class="btn primary" data-act="qnext">Continue \u2192</button></div>';
      showFb(quiz.fb);
      var b = document.querySelector('#qfb [data-act="qnext"]'); if (b) b.focus({ preventScroll: true });
    }
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
    settle(ok, 1100);
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
    settle(r.ok, 1300);
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
      } else if (quiz.lesson) {
        /* THE LESSON, FINISHED — what you met, in the script, and the next one by name.
           Whether it counts as done is the SRS record's call (every one of its four
           answered right at least once), so a lesson that went badly says so kindly
           and offers the same four again rather than pretending. */
        var fin = bLesson(bPath(id), quiz.lesson.id), nxt2 = bNext(bPath(id));
        var met = fin && fin.done;
        overCard = '<div class="bh-done' + (met ? ' ok' : '') + '">' +
          '<p class="bh-kick dark">' + esc(quiz.lesson.unit) + ' · lesson ' + quiz.lesson.n +
            ' of ' + quiz.lesson.of + '</p>' +
          '<h2>' + (met ? 'Shabash — lesson done' : 'Nearly — once more') + '</h2>' +
          '<p class="bh-met deva" lang="' + esc(id) + '">' + quiz.lesson.items.map(function (it) {
            return '<span>' + esc(previewOf(it)) + '</span>'; }).join('') + '</p>' +
          '<p class="tiny">' + quiz.right + ' right of ' + quiz.done + '. ' +
            (met ? 'All four are yours now — they will come back in a day or two, which is how ' +
                   'they stay.'
                 : 'One of these has not been answered right yet. The same four again will do it.') +
          '</p>' +
          '<div class="row">' +
            (met && nxt2 && nxt2.lesson
              ? '<button class="btn primary" data-act="blesson" data-l="' + esc(nxt2.lesson.id) + '">' +
                'Next: ' + esc(nxt2.lesson.unit.title) + ' ' + nxt2.lesson.n + ' →</button>'
              : '<button class="btn primary" data-act="blesson" data-l="' + esc(quiz.lesson.id) + '">' +
                'The same four again</button>') +
            '<button class="btn ghost" data-act="bclose">Back to the path</button>' +
          '</div></div>';
      } else {
        /* THE FINISH NAMES WHAT WAS PRACTISED AND WHAT IS NEXT (FIX-INDIA F4; standard §12) */
        var nx3 = bNext(bPath(id)), seen3 = (quiz.seen || []).slice(0, 8), miss3 = quiz.missed || [];
        overCard = '<div class="bh-done ok"><p class="bh-kick dark">' + (quiz.mode === 'slipped' ? 'Words that slipped' : 'Review') + '</p>' +
          '<h2>Shabash — ' + quiz.right + ' right of ' + quiz.done + '</h2>' +
          (seen3.length ? '<p class="tiny" style="margin:0">What you practised:</p><p class="bh-met deva" lang="' + esc(id) + '">' +
            seen3.map(function (it) { return '<span>' + esc(previewOf(it)) + '</span>'; }).join('') + '</p>' : '') +
          '<p class="tiny">' + (miss3.length
            ? miss3.length + (miss3.length === 1 ? ' of them' : ' of them') + ' will come back in a day or two, in Words that slipped.'
            : 'Every one of them moved along its boxes.') + '</p>' +
          '<div class="row">' +
            (nx3 && nx3.lesson
              ? '<button class="btn primary" data-act="blesson" data-l="' + esc(nx3.lesson.id) + '">Next: ' +
                esc(nx3.lesson.unit.title) + ' ' + nx3.lesson.n + ' →</button>'
              : '<button class="btn primary" data-act="quiz" data-s="' + esc(quiz.stage) + '">Another round</button>') +
            '<button class="btn ghost" data-act="bclose">Back to the path</button></div></div>';
      }
    }

    /* ------------------------------------------------------------ THE PATH, WALKED
       The eight rungs used to be eight lines of text and one "Carry on" button, and
       each rung was a pool — Shabd held 507 words and said "2 new words · Go". A child
       could not see where they were inside it, and weeks of work showed as 0 / 8.

       It is the shape every language app that works has converged on now: a rung is
       walked as UNITS (a theme, or a row of the alphabet) and a unit as LESSONS of four
       new things, one sitting each. The next lesson is always one tap away and says
       what it will teach, in the script, before you start. Everything below is read
       off the SRS record — nothing here stores its own idea of progress. */
    var path = bPath(id), nx = bNext(path);
    var allL = 0, doneL = 0;
    path.forEach(function (r) { allL += r.total; doneL += r.done; });
    var here = nx ? nx.rung : null;

    /* the chapter opener — a plate and a title over it, like every other pillar */
    var opener =
      '<div class="bh-hero">' +
        '<img src="art/banner/bhasha.jpg" alt="The script, written large">' +
        '<div class="bh-scrim">' +
          '<p class="bh-kick">Bhasha · ' + esc(p.name.en) + ' · ' + esc(sc.name) + '</p>' +
          '<h1 class="deva" lang="' + esc(id) + '">' + esc(p.name.native) + '</h1>' +
          '<ul class="bh-tally">' +
            '<li><b>' + doneL + '</b>of ' + allL + ' lessons</li>' +
            '<li><b>' + doneN + '</b>of ' + stages.length + ' rungs mastered</li>' +
            '<li><b>' + esc(BAND_LABELS[Math.max(0, Math.min(4, (rec.band || 1) - 1))]) +
              '</b>where you are</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<p class="bh-credit">Picture: the script, written large</p>';

    /* THE NEXT LESSON, and exactly what is in it — the four things it will teach,
       in the script, before the child has pressed anything. A button that says "Go"
       and nothing else is a button nobody knows the cost of. */
    var nextCard = '';
    if (nx && nx.lesson) {
      var L = nx.lesson;
      nextCard = '<button class="bh-next" data-act="blesson" data-l="' + esc(L.id) + '">' +
        '<span class="bh-nextart">' + mascot('gattu', 'happy', 62) + '</span>' +
        '<span class="bh-nextbody">' +
          '<span class="bh-kick dark">' + (L.started ? 'Carry on' : 'Your next lesson') +
            ' · rung ' + (nx.rung.i + 1) + ', ' + esc(nx.rung.stage.name) + '</span>' +
          '<b>' + esc(L.unit.title) + ' <i>lesson ' + L.n + ' of ' + L.of + '</i></b>' +
          '<span class="bh-preview">' + L.items.map(function (it) {
            return '<span class="deva" lang="' + esc(id) + '">' + esc(previewOf(it)) + '</span>';
          }).join('') + '</span>' +
          '<span class="bh-nextsay">Four new things — each one shown and heard before you are ' +
            'asked about it. About five minutes.</span>' +
        '</span>' +
        '<span class="btn primary">' + icon('play', 18) + ' Start</span></button>';
    } else if (nx && nx.review) {
      nextCard = '<button class="bh-next" data-act="quiz" data-s="' + esc(nx.rung.stage.id) + '">' +
        '<span class="bh-nextart">' + mascot('gattu', 'happy', 62) + '</span>' +
        '<span class="bh-nextbody">' +
          '<span class="bh-kick dark">Every lesson in ' + esc(nx.rung.stage.name) + ' is met</span>' +
          '<b>Review, until it sticks</b>' +
          '<span class="bh-nextsay">Nothing new — the words you have met, coming back until they ' +
          'stay. The next rung opens when this one is mastered, or you can test out of it.</span>' +
        '</span>' +
        '<span class="btn primary">' + icon('play', 18) + ' Review</span></button>';
    }

    var rungs = path.map(function (r) {
      var s = r.stage, i = r.i;
      var isHere = here && here.stage.id === s.id;
      var head = '<div class="bh-rhead">' +
        '<span class="bh-rno" aria-hidden="true">' + (r.mastered ? '✓' : (i + 1)) + '</span>' +
        '<span class="bh-rtitle"><b>' + esc(s.name) + '</b>' +
          '<span>' + esc(s.outcome || '') + '</span></span>' +
        (r.unlocked ? '<span class="bh-rcount">' + r.done + ' / ' + r.total + '</span>' : '') +
        '</div>';

      if (!r.unlocked) {
        /* locked LOOKS locked and says the way through — never a wall (docs/09) */
        return '<div class="bh-rung shut">' + head +
          '<p class="bh-shutsay">' + icon('lock', 14) + ' Opens after ' + esc(path[i - 1].stage.name) +
          ' — <button class="bh-tot" data-act="testout" data-s="' + esc(s.id) + '">or test out' +
          '</button></p></div>';
      }
      if (!isHere) {
        /* an open rung that is not the one being walked: one line and a way in */
        return '<div class="bh-rung' + (r.mastered ? ' done' : '') + '">' + head +
          '<div class="bh-units mini">' + r.units.map(function (u) {
            return '<button class="bh-uchip' + (u.done === u.lessons.length ? ' full' : '') +
              '" data-act="bunit" data-u="' + esc(u.id) + '">' +
              (u.icon ? '<span>' + u.icon + '</span>' : '') + esc(u.title) +
              ' <i>' + u.done + '/' + u.lessons.length + '</i></button>';
          }).join('') + '</div></div>';
      }

      /* THE RUNG BEING WALKED: its units, and the open one as a trail of lessons */
      var openU = quiz.openUnit;
      var cur = nx && nx.lesson ? nx.lesson.unit.id : null;
      return '<div class="bh-rung here">' + head +
        (i === 0 && rec.path === 'heritage' && !r.mastered
          ? '<button class="totmini" data-act="testout" data-s="' + esc(s.id) + '">' +
            'Ears ahead of eyes? Test out of ' + esc(s.name) + ' →</button>' : '') +
        r.units.map(function (u) {
          var open = (openU ? openU === u.id : cur === u.id);
          var uhead = '<button class="bh-uhead' + (open ? ' open' : '') + '" data-act="bunit" ' +
            'data-u="' + esc(u.id) + '" aria-expanded="' + open + '">' +
            (u.icon ? '<span class="bh-uicon">' + u.icon + '</span>' : '') +
            '<b>' + esc(u.title) + '</b>' +
            '<span class="bh-ubar"><i style="width:' +
              Math.round(u.done / u.lessons.length * 100) + '%"></i></span>' +
            '<span class="bh-ucount">' + u.done + ' of ' + u.lessons.length + '</span></button>';
          if (!open) return '<div class="bh-unit">' + uhead + '</div>';
          return '<div class="bh-unit open">' + uhead +
            '<ol class="bh-trail">' + u.lessons.map(function (l) {
              var isNext = nx && nx.lesson && nx.lesson.id === l.id;
              var st = l.done ? 'done' : isNext ? 'next' : l.started ? 'started' : 'ahead';
              return '<li class="bh-step ' + st + '">' +
                '<button class="bh-node" data-act="blesson" data-l="' + esc(l.id) + '" ' +
                  'aria-label="' + esc(u.title) + ', lesson ' + l.n + ' of ' + l.of +
                  (l.done ? ', done' : isNext ? ', next' : '') + '">' +
                  '<span class="bh-disc">' + (l.done ? '✓' : l.n) + '</span>' +
                  '<span class="bh-lwords deva" lang="' + esc(id) + '">' +
                    l.items.map(function (it) { return esc(previewOf(it)); }).join(' · ') +
                  '</span>' +
                '</button></li>';
            }).join('') + '</ol></div>';
        }).join('') + '</div>';
    }).join('');

    return '<button class="backlink" data-act="go" data-v="bhasha">' + icon('back', 18) + ' Bhasha</button>' +
      opener + offerCard + overCard + nextCard + slippedCard(id) +
      '<div class="bh-path">' +
        '<div class="bh-secthead"><h3>The path</h3>' +
        '<span>The same eight rungs in every language</span></div>' +
        rungs +
      '</div>' +

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
    if (!B || !P) return errorState('That page is not here. It may have moved — Home always has the way in.');
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
    var p = window.IND_PACKS[id]; if (!p) return errorState('That page is not here. It may have moved — Home always has the way in.');
    var sc = window.IND_SCRIPTS[p.script];
    var grid = function (list) {
      return '<div class="gridscript">' + (list || []).map(function (v) {
        return '<button class="glyph" data-act="say" data-k="' + esc(v.audio || '') +
          /* the synthesis fallback must speak the pack's own language, not Hindi */
          '" data-t="' + esc(v.char) + '" data-l="' + esc((p.id || 'hi') + '-IN') + '">' +
          /* EVERY CHART IN ITS OWN FACE (FIX-INDIA §1; standard §9): the letter carries its
             pack's language, so Urdu lands in Nastaliq and Tamil in Mukta Malar — never in
             Mukta or a system fallback. check-standard "scripts" reads the font Chrome used. */
          '<span lang="' + esc(p.id || 'hi') + '">' + esc(v.char) + '</span><small>' + esc(v.name) + '</small></button>';
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
    /* WHERE YOU ARE, on every single beat. A child three questions into a lesson should
       be able to say which lesson it is and how much is left without leaving it — the
       bar says how much, this says which. And a new thing says which new thing it is,
       "new word 2 of 4", so the introductions read as a set rather than an interruption. */
    var L = quiz.lesson, where = '';
    if (L) {
      var intros = 0, introAt = 0;
      specs.forEach(function (sp, k) {
        if (sp.kind === 'introduce') { intros++; if (k <= quiz.pi) introAt = intros; }
      });
      var sp0 = specs[quiz.pi] || {};
      where = '<div class="bh-where"><span>' + esc(L.stage) + ' · ' + esc(L.unit) +
        ' · lesson ' + L.n + ' of ' + L.of + '</span>' +
        (sp0.kind === 'introduce' && intros
          ? '<b>New ' + (intros === 1 ? '' : introAt + ' of ' + intros) + '</b>'
          : sp0.kind === 'review' ? '<b>From before</b>' : '<b>Practice</b>') + '</div>';
    }
    return where + '<div class="arcbar" role="img" aria-label="beat ' + (quiz.pi + 1) +
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
    /* A HINT ON THE EXACT ITEM (FIX-INDIA E6): once a thing has been missed — earlier in this
       sitting or on another day — its question offers one hint, which takes away one WRONG
       choice. It can never take away the right one, so it never gives the answer. */
    var hintBtn = '';
    if (typeof q.answerIndex === 'number' && opts.length > 2 && !quiz.lock) {
      var hsp = specNow(), hkey = (q.itemKey) || (hsp && hsp.key);
      var hcard = hkey ? (ensureLang(quiz.packId).srs || {})[hkey] : null;
      if (quiz.hint == null && hcard && hcard.lapses > 0)
        hintBtn = '<button class="pill qhint" data-act="qhint">' + icon('help', 16) + ' A hint — take one wrong answer away</button>';
    }
    if (quiz.hint != null) choices = choices.replace('data-act="ans" data-i="' + quiz.hint + '"', 'data-act="ans" data-i="' + quiz.hint + '" disabled aria-disabled="true" data-gone="1"');
    return '<div class="card">' + arcStrip() + '<h3>' + prompt + '</h3>' + lead + big + hear +
      (grid ? '<div class="gridscript">' + choices + '</div>' : choices) + hintBtn +
      qfb + meta + '</div>';
  };

  /* WORDS THAT SLIPPED (FIX-INDIA F3; standard §12) — the mistakes deck. Every thing this
     child has missed and not yet mastered, the most-missed first. It comes back after a gap:
     the button wakes when at least one card's review is due, and the session it starts
     drills exactly those cards and nothing else. A miss is reported here, never hidden. */
  function slippedCard(id) {
    var B = window.IND_BHASHA;
    if (!B || !B.slipped || quiz.q) return '';
    var L = B.slipped(id, ensureLang(id), Date.now());
    if (!L.length) return '';
    var ready = L.filter(function (x) { return x.ready; });
    var first = (ready[0] || L[0]).stageId;
    var keys = (ready.length ? ready : []).filter(function (x) { return x.stageId === first; }).map(function (x) { return x.key; });
    return '<div class="card slipped"><div class="spread"><h3 style="margin:0">Words that slipped</h3>' +
        '<span class="pill stat">' + L.length + '</span></div>' +
      '<p class="tiny muted" style="margin:6px 0 10px">The ones you have missed, most-missed first. They come back after a day or ' +
        'two — that gap is what makes them stay.</p>' +
      '<p class="slipwords deva" lang="' + esc(id) + '">' + L.slice(0, 10).map(function (x) {
        return '<span class="' + (x.ready ? 'due' : '') + '">' + esc(previewOf(x.item)) + '</span>'; }).join('') + '</p>' +
      (keys.length
        ? '<button class="btn sm" data-act="slipped" data-s="' + esc(first) + '" data-k="' + esc(keys.join('|')) + '">' +
          'Bring back ' + keys.length + (keys.length === 1 ? ' word' : ' words') + '</button>'
        : '<p class="tiny">Not yet — they come back once their gap is over.</p>') +
      '</div>';
  }

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
    ['Quiz shows', 'Ladders and lifelines — the hot seat is yours.', ['gyanpati', 'triviamaster']],
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
          ((window.IND_GAME_PLATES || []).indexOf(g.id) >= 0 ? ' painted' : '') +
          '" style="background:linear-gradient(135deg,' + c + ',' + c2 + ')">' +
          ((window.IND_GAME_PLATES || []).indexOf(g.id) >= 0
            ? '<img class="gplate" src="art/games/' + g.id + '.webp" alt="" loading="lazy" decoding="async">' : '') +
          ((window.IND_GAME_ART && window.IND_GAME_ART[g.id]) || g.scene || icon(g.icon || 'star', 46)) +
          (tag ? '<span class="gtag">' + esc(tag) + '</span>' : '') + '</span>' +
        '<span class="gbody"><b>' + esc(g.name) + '</b>' +
        '<span class="tiny muted">' + esc(g.blurb || '') + '</span>' +
        '<span class="mono">' + (g.minutes || 2) + ' min</span></span></button>';
    }
    /* nomenclature rule: the tab's word is the pillar's name; the Mela keeps its
       proper name as the subtitle, the way the river does under Itihaas */
    var out = '<div class="phead"><h1>Khel</h1>' +
      '<span class="mono">The Mela — the fairground</span>' +
      '<p>Some stalls are as old as India, some are drills wearing a costume — every one ' +
      'plays with fingers and with keys.</p></div>';
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
      out += '<div class="shelfhead"><h3>' + grp[0] + '</h3>' +
        '<p class="tiny">' + grp[1] + '</p></div>' +
        '<div class="grid g3 gshelf">' + list.map(cover).join('') + '</div>';
    });
    var rest = G.filter(function (g) { return !used[g.id] && !g.hide; });
    if (rest.length) out += '<h3 style="margin:26px 0 12px">More stalls</h3>' +
      '<div class="grid g3 gshelf">' + rest.map(cover).join('') + '</div>';
    return out;
  };
  /* THE GAME FRAME (family standard §10; FIX-INDIA F3). Every game gets, from the host,
     the same five things whatever its engine does: a TITLE CARD with a three-second how-to
     (it folds to a title row and never covers the board), SOUND on every answer and at the
     finish, MOTION on every answer, a FINISH screen that says what was practised, and
     keyboard as well as touch (the engines' own, said on the card). The engines share two
     conventions the host reads: a status line toned `good` or `warm`, and an end card with
     a [data-go="out"] button. Street and dice games say plainly that they are for fun. */
  var GAME_FRAME = {
    rangoli:      ['Watch the pattern, then draw it back in colour before it blows away.',
                   'Pattern memory and symmetry — remember half, complete the whole.'],
    statehunt:    ['Read the clue — a capital, a fort, an animal, a mountain — and pick the state it points to.',
                   'Where India’s states are, and what each is known for.'],
    festival:     ['Match each festival to its month, its home state and the reason people keep it.',
                   'Twelve festivals: when they fall, where, and why.'],
    jataka:       ['Hear the fable, then pick the lesson hiding in it.',
                   'Finding the lesson inside a Jataka tale.'],
    saapsidi:     ['Roll, count your squares, and climb the ladders to 100.',
                   'Counting on a hundred-square board. Played for fun, so it pays no coins.'],
    ludo:         ['Roll, choose a token, and bring all four home before Gattu.',
                   'Counting moves and choosing which token to move. Played for fun.'],
    kancha:       ['Slide to aim, pull back, and flick — whatever leaves the ring is yours.',
                   'Aim and judging distance. A street game, played for fun.'],
    pallanguzhi:  ['Pick one of your pits; its shells are sown one by one around the board.',
                   'Counting ahead — which pit will end where you want it to.'],
    gutte:        ['Toss the mother stone, snatch the stones the rung asks for, and catch her.',
                   'Timing and counting. A courtyard game, played for fun.'],
    carrom:       ['Aim the striker, choose the strength, and pocket your pieces.',
                   'Angles and aim. Played for fun.'],
    gyanpati:     ['Fifteen questions, easy to hard. Pick an answer and lock it in.',
                   'What you know about India — and the ones you met for the first time today.'],
    triviamaster: ['Ten questions from the topics you switch on. Answers in a row stack up.',
                   'Quick recall across maps, history, festivals, food and the epics.'],
    shabd:        ['Hear or read the word, then pick what it means.',
                   'Words in your family’s language, and what they mean.'],
    sabhyata:     ['Build, grow and learn — each era asks for one thing.',
                   'How India’s first cities grew, era by era.']
  };
  V.game = function () {
    var g = (window.IND_GAMES || []).filter(function (x) { return x.id === view.arg; })[0];
    var f = GAME_FRAME[view.arg] || [g && g.blurb || '', ''];
    return '<button class="backlink" data-act="go" data-v="mela">' + icon('back', 18) + ' Mela</button>' +
      '<div class="card gframe" id="gframe">' +
      (g ? '<button class="gf-title" id="gftitle" aria-expanded="true" data-act="gfhow">' +
        '<span class="gf-ic">' + icon('game', 22) + '</span>' +
        '<span class="gf-txt"><b>' + esc(g.name) + '</b><span class="gf-how">' + esc(f[0]) + '</span>' +
        '<span class="gf-keys tiny muted">Tap to play — or use the keyboard: Tab, the arrows and Enter.</span></span>' +
        '<i class="gf-bar" aria-hidden="true"></i></button>' : '') +
      '<div id="gamehost"></div></div>';
  };

  /* -------------------------------------------------------------------- ME */
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
    /* No codes and no payment form (family standard §15, §21). The family plan arrives with
       the family server that every Bizzing app shares; until then a grown-up in tester mode
       can switch it on to walk the product, and nobody else can. */
    var on = ent.hasPass();
    return '<p class="tiny muted" style="margin:6px 0 0">Reading, playing and streaming are free. ' +
      'The family plan opens the offline packs above and every world. It comes with the family ' +
      'account, which is still being built — there is nothing to buy or type in yet.</p>' +
      (on ? '<p class="tiny" style="margin:6px 0 0"><b>' + esc(ent.planName() || 'The family plan') +
            '</b> is on for this device (tester mode).</p>' : '') +
      (tester()
        ? '<div class="row" style="margin-top:6px"><button class="pill' + (on ? ' on' : '') + '" data-act="passtester" aria-pressed="' + on + '">' +
          (on ? 'Tester: family plan on' : 'Tester: switch the family plan on') + '</button></div>'
        : '');
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

  /* ---------------------------------------------------------------- PAATHSHALA */
  /* The course engine lives in paath.js and keeps its own record. This is the whole of
     the seam: it is handed the four things it needs from the host and nothing else, and
     it never reaches into S itself. `owns` is a LABEL check, not an entitlement check —
     the real gate is server-authoritative and does not exist yet (docs/07), so a premium
     course shows the lock and sends the grown-up to the Parents area. */
  var paathReady = false;
  /* ------------------------------------------- what Paathshala is allowed to ask for
     A course is an ORDER TO MEET THE CORPUS IN, not a second copy of it, so its lesson
     screens link out. The first version of those links read `story: pt.talkative-tortoise →`
     — a database row shown to an eight-year-old, with no picture, in a tab that owns 686
     paintings. The host already holds every lookup and every art manifest, so it answers
     on the engine's behalf and the engine keeps none of the host's globals.

     Returning null is a first-class answer: a Bhasha exercise COUNT has no title and no
     painting, and the engine renders that differently rather than inventing a label.
     Nothing here derives a picture through more than one hop from the thing the lesson
     actually names, because a painting that illustrates a guess is the uncredited texture
     docs/05 forbids. */
  /* a verse is set in its own script or not at all — docs/05, and check-paath's `script` */
  var SHLOK_LANG = { Sanskrit: 'sa', Tamil: 'ta', Pali: '', Hindi: 'hi' };

  /* WHICH SCRIPT A STRING IS IN, MEASURED FROM THE STRING. A festival carries `script`
     but no language code, so ਲੋਹੜੀ arrives with nothing to tag it with and lands in the
     Latin body face — the decorative-squiggle failure app.css §SCRIPTS is written against.
     The script is its own evidence: one Unicode block, one lang tag, no guessing and
     nothing to keep in step by hand. A string with no Indic codepoint returns '', which
     is the honest answer for Pali (this corpus prints it in roman with diacritics, and
     `collection.script` says so) and for anything already Latin. */
  var BLOCKS = [[0x900, 0x97f, 'hi'], [0x980, 0x9ff, 'bn'], [0xa00, 0xa7f, 'pa'],
                [0xa80, 0xaff, 'gu'], [0xb00, 0xb7f, 'or'], [0xb80, 0xbff, 'ta'],
                [0xc00, 0xc7f, 'te'], [0xc80, 0xcff, 'kn'], [0xd00, 0xd7f, 'ml'],
                [0x600, 0x6ff, 'ur']];
  function scriptLang(s) {
    var t = String(s || ''), out = '';
    for (var i = 0; i < t.length && !out; i++) {
      var c = t.codePointAt(i);
      for (var j = 0; j < BLOCKS.length; j++)
        if (c >= BLOCKS[j][0] && c <= BLOCKS[j][1]) { out = BLOCKS[j][2]; break; }
    }
    return out;
  }
  /* THE SAFETY NET under the script rule. A fragment written as class="deva" carries the
     Devanagari face whatever is in it — so a Tamil, Bengali or Urdu word rendered through a
     shared template fell back to whatever the system had (the audit's Urdu chart in Naskh).
     After every paint, an element that holds Indic text and is not already tagged with the
     right language gets it, and the :lang() rules in app.css do the rest. Marathi and Hindi
     share Devanagari and Mukta, so 'hi' standing for both is right here. */
  var TAG_SEL = '.deva, .glyph, .wcs, .opt, .wcword, .kw, [data-script], .bz-hour h3, .sres b';
  function tagScripts(root) {
    if (!root || !root.querySelectorAll) return;
    var els = root.querySelectorAll(TAG_SEL), i, el, lg, have;
    for (i = 0; i < els.length; i++) {
      el = els[i];
      if (el.children.length > 3) continue;              /* a container, not a word */
      lg = scriptLang(el.textContent);
      if (!lg) continue;
      have = (el.getAttribute('lang') || '').split('-')[0];
      if (have === lg || (lg === 'hi' && /^(mr|ne|sa)$/.test(have))) continue;
      el.setAttribute('lang', lg);
      if (lg === 'ur') el.setAttribute('dir', 'rtl');
    }
  }

  /* ------------------------------------------- what Paathshala is allowed to ask for
     A course is an ORDER TO MEET THE CORPUS IN, not a second copy of it, so its lesson
     screens link out. The first version of those links read `story: pt.talkative-tortoise →`
     — a database row shown to an eight-year-old, with no picture, in a tab that owns 686
     paintings. The host already holds every lookup and every art manifest, so it answers
     on the engine's behalf and the engine keeps none of the host's globals.

     Returning null is a first-class answer: a Bhasha exercise COUNT has no title and no
     painting, and the engine renders that differently rather than inventing a label.

     THE PICTURE IS NEVER MORE THAN ONE HOP from a field the data itself states, and it
     goes through the host's own art helpers — `eraArt` above carries the reason (a state
     painting has a tractor in it, and a tractor on the Vedic age costs the pillar its
     authority). A painting chosen to illustrate a guess is the uncredited texture docs/05
     forbids, so where there is no honest picture the chip is typographic and says so by
     being typographic. */
  function paathLook(kind, id) {
    var name = null, sub = '', src = null, script = '', lang = '', cap = '', face = '', alts = [];
    function find(list, k) {
      var f = null; (list || []).forEach(function (x) { if (x[k || 'id'] === id) f = x; }); return f;
    }
    if (kind === 'st') {
      var s = find(allStories());
      if (!s) return null;
      name = s.title; sub = s.collection || ''; src = storyArt(id);
      cap = src ? s.title : '';
    } else if (kind === 'sh') {
      /* a shlok reference is a single verse, or the whole collection */
      var v = find((window.IND_SHLOK || {}).verses);
      var coll = find((window.IND_SHLOK || {}).collections);
      if (v) {
        var vc = null;
        ((window.IND_SHLOK || {}).collections || []).forEach(function (x) { if (x.id === v.collection) vc = x; });
        name = v.source ? String(v.source).split(/[—·]/)[0].trim() : id;
        sub = v.meaning_kid ? String(v.meaning_kid) : '';
        script = v.text_original ? String(v.text_original).split('\n')[0] : '';
        lang = vc ? (SHLOK_LANG[vc.language] || '') : '';
        /* A verse has no painting. But if the epic data retells the scene its collection
           comes from, the paintings of that scene are honestly of it. Which episode is
           FOUND — the one whose own text names the collection — never typed in here. For
           the Gita that is one episode of the Mahabharata; the Thirukkural and the
           Dhammapada are named in no episode, so they get none. */
        if (vc) {
          /* the collection's own short name — the last word of it: "Bhagavad Gita" is
             found as "Gita", "Thirukkural" as itself. An episode that names it retells it. */
          var nm = String(vc.name || '').split(/\s+/).pop();
          ((window.IND_EPIC_MAHABHARATA || {}).episodes || []).forEach(function (ep2) {
            if (src || !nm || nm.length < 4) return;
            if (new RegExp('\\b' + nm + '\\b').test(JSON.stringify(ep2))) {
              for (var ci = 0; ci < ((ep2.cards || []).length || 0); ci++) {
                var ea = epicArt('mahabharata', ep2.n, ci);
                if (ea) { if (!src) src = ea; else alts.push(ea); }
              }
              cap = ep2.title;
            }
          });
        }
      } else if (coll) {
        name = coll.name; sub = coll.blurb || ''; lang = SHLOK_LANG[coll.language] || '';
      } else return null;
    } else if (kind === 'ge') {
      var g = find((window.IND_GEET || {}).songs) || find((window.IND_GEET || {}).bhajans);
      if (!g) return null;
      name = g.title; sub = g.en || g.region || ''; script = g.script || '';
      lang = SHLOK_LANG[g.lang] || scriptLang(script);
    } else if (kind === 'ut') {
      var f = find((window.IND_UTSAV || {}).festivals);
      if (!f) return null;
      name = f.name; sub = (f.months || []).join(' · '); script = f.script || '';
      lang = scriptLang(script);
      /* A festival has no painting of its own, but it names the states it is kept in,
         and each of those has one — one hop, from a field the festival states. State
         paintings are deliberately modern (see eraArt), which is right here: a festival
         is 🧭 Aaj, how it lives today. */
      (f.states || []).forEach(function (code) { var sa = stateArt(code); if (sa) alts.push(sa); });
      if (alts.length) { src = alts.shift(); cap = f.name; }
    } else if (kind === 'ri') {
      var t = find((window.IND_RISHTEY || {}).terms);
      if (!t) return null;
      name = t.en; sub = t.roman || ''; script = t.hi || ''; lang = 'hi';
      /* NEVER HINDI BY DEFAULT WHEN THE FAMILY SAID OTHERWISE. Every kinship term carries
         its Punjabi, Tamil, Bengali, Gujarati and Telugu forms, and a family that chose
         Tamil should see தாத்தா on its Rishtey banners, not दादा — docs/05 §8. The form is
         stored as "script roman", so the script is its first word. */
      var tgR = tongue();
      if (tgR && tgR.lang && t.also && t.also[tgR.lang]) {
        script = String(t.also[tgR.lang]).split(' ')[0];
        lang = tgR.lang;
      }
    } else if (kind === 'it') {
      /* an era, or one of the people standing inside it */
      var I = (window.IND_ITIHAAS || {}).eras || [], e = find(I), fig = null, holder = null;
      if (!e) I.forEach(function (x) {
        (x.figures || []).forEach(function (y) { if (y.id === id) { fig = y; holder = x; } });
      });
      if (e) {
        name = e.title; sub = e.when || ''; src = eraArt(e);
        cap = src ? e.title + ' — ' + e.when : '';
      } else if (fig) {
        /* A PERSON IS DRAWN, NOT PHOTOGRAPHED. Figures have no plate — their likeness is
           the app's own avatar set, and `face` hands the engine that drawing so a chip
           for the Buddha is not a photograph of somewhere he is presumed to have walked. */
        name = fig.name; sub = holder.title || ''; face = art(fig.id, 56);
      } else return null;
    } else if (kind === 'va') {
      var val = find((window.IND_NEETI || {}).values);
      if (!val) return null;
      name = val.en; sub = val.roman || ''; script = val.term || ''; lang = 'hi';
      /* one hop: the lesson named the value, and the value names this story */
      if (val.stories && val.stories.length) {
        src = storyArt(val.stories[0]);
        if (src) { var vs = null; allStories().forEach(function (x) { if (x.id === val.stories[0]) vs = x; }); cap = vs ? vs.title : ''; }
      }
    } else if (kind === 'dh') {
      var d = find((window.IND_DHARMA || {}).faiths);
      if (!d) return null;
      name = d.name; sub = d.tag || '';
      if (d.stories && d.stories.length) {
        src = storyArt(d.stories[0]);
        if (src) { var ds = null; allStories().forEach(function (x) { if (x.id === d.stories[0]) ds = x; }); cap = ds ? ds.title : ''; }
      }
    } else if (kind === 'ra') {
      /* Ramayana episodes, numbered like the Mahabharata's, each card painted */
      var rn = Number(id), rep = null;
      ((window.IND_EPIC_RAMAYANA || {}).episodes || []).forEach(function (x) { if (x.n === rn) rep = x; });
      if (!rep) return null;
      name = rep.title; sub = rep.book || ''; src = epicArt('ramayana', rn, 0);
      cap = src ? rep.title : '';
      for (var rc = 1; rc < ((rep.cards || []).length || 0); rc++) {
        var ra2 = epicArt('ramayana', rn, rc);
        if (ra2) alts.push(ra2);
      }
    } else if (kind === 'bg') {
      /* a place on the map (data-bhugol.js, NCERT-sourced), and its own painting */
      var bgf = null; (((window.IND_BHUGOL || {}).features) || []).forEach(function (x) { if (x.id === id) bgf = x; });
      if (!bgf) return null;
      name = bgf.n; sub = bgf.t || '';
      src = (window.IND_BHUGOL_ART || []).indexOf(id) >= 0 ? 'art/bhugol/' + id + '.jpg' : null;
      cap = src ? bgf.n : '';
    } else if (kind === 'state') {
      /* a state, by the name the geography data gives it, and its own painting */
      var gs = ((window.IND_GEO || {}).states || {})[id];
      if (!gs) return null;
      name = gs.name; sub = gs.capital || ''; src = stateArt(id); cap = src ? gs.name : '';
    } else if (kind === 'na') {
      /* an Ask-Nani question, addressed in the family's own word for the grandparent.
         The Hindi line is shown only to a Hindi-speaking family: data-nani.js agrees its
         verbs with the person asked, and a Tamil child is asking Paati, not Nani. */
      var nq = null; (((window.IND_NANI || {}).questions) || []).forEach(function (x) { if (x.id === id) nq = x; });
      if (!nq) return null;
      var tg = tongue();
      name = kinEn(nq);
      sub = nq.to === 'any' ? 'Ask anyone at home' : 'Ask ' + kinTerm(nq.to);
      if (!tg || tg.id === 'hi') { script = nq.hi; lang = nq.lang || 'hi'; }
        } else if (kind === 'mb') {
      /* Mahabharata episodes are numbered, not id'd, and card 0 is the episode's plate */
      var n = Number(id), ep = null;
      ((window.IND_EPIC_MAHABHARATA || {}).episodes || []).forEach(function (x) { if (x.n === n) ep = x; });
      if (!ep) return null;
      name = ep.title; sub = ep.book || ''; src = epicArt('mahabharata', n, 0);
      cap = src ? ep.title : '';
      /* the episode's other painted cards, for a page that needs more than one picture
         of the same episode — the Gita course builds several parts on episode 26 */
      for (var ac = 1; ac < ((ep.cards || []).length || 0); ac++) {
        var alt = epicArt('mahabharata', n, ac);
        if (alt) alts.push(alt);
      }
    } else return null;
    return { name: name || String(id), sub: sub, art: src, face: face, alts: alts,
             script: script, lang: lang, cap: cap };
  }

  /* ---------------------------------------------- A LEARN STOP THAT TEACHES (FIX-INDIA E3)
     Each Hindi stop that used to say "open Bhasha" gets a worked example built from the
     engine's own reviewed data — never written here: the script's letters with their names
     and recorded sounds, its matras worked on a consonant, a theme's words with their sounds
     and meanings, a grammar point's rule, its trap and its example sentences, or a real
     exchange from the dialogue bank. Every sound is a tap away; the drill stays in Bhasha. */
  var TEACH = {
    'Why the line on top': ['headline'], 'The first ten letters': ['letters', 0, 10], 'Sound to shape': ['letters', 0, 10],
    'A week later': ['letters', 0, 10], 'The middle rows': ['letters', 10, 20], 'The last rows': ['letters', 20, 33],
    'The whole board': ['letters', 0, 33], 'Cold read': ['letters', 0, 33],
    'A letter is never alone': ['matras', 3], 'The ten marks': ['matras', 99], 'Build the word': ['matras', 99],
    'Say it, spell it': ['words', 'basics'], 'The house': ['words', 'home'], 'The kitchen and the street': ['words', 'food'],
    'Point and say': ['words', 'places'], 'Cold recall': ['words', 'actions'],
    'Who, what, does': ['grammar', 'sov'], 'Is and are': ['grammar', 'copula'], 'Make ten': ['grammar', 'sov'],
    'Your own ten': ['grammar', 'agreement'], 'The question words': ['grammar', 'question'], 'Asking politely': ['grammar', 'request'],
    'Twenty questions': ['grammar', 'question'], 'A real exchange': ['talk'], 'It already happened': ['grammar', 'tense-past'],
    'It has not happened yet': ['grammar', 'tense-future'], 'Move the sentence in time': ['grammar', 'tense-present'],
    'Tell a small story': ['grammar', 'tense-past'], 'Reading past the words you do not know': ['read'],
    'A story in Hindi': ['read'], 'Three passages': ['read'], 'One you have not seen': ['read'],
    'आप and तुम': ['grammar', 'respect'], 'Keeping it going': ['talk'], 'Two minutes': ['talk'], 'With someone new': ['talk'],
    'When you get stuck': ['talk'], 'Words this app did not teach you': ['grammar', 'possession'], 'A whole conversation': ['talk'],
    'The long check': ['grammar', 'negation'], 'Aap, always': ['grammar', 'respect'], 'Four exchanges': ['talk'],
    'Where did that word come from': ['words', 'family']
  };
  function sayBtn(audio, text, label, cls) {
    return '<button class="' + (cls || 'tglyph') + '" data-act="say" data-k="' + esc(audio || '') + '" data-t="' + esc(text) +
      '" data-l="hi-IN" aria-label="Hear ' + esc(label || text) + '"><span lang="hi">' + esc(text) + '</span>' +
      (label ? '<small>' + esc(label) + '</small>' : '') + '</button>';
  }
  function teachCard(kind, title, body) {
    return '<div class="pl-card plain teach"><div class="pl-body"><p class="pl-kind">' + esc(kind) + '</p><h3>' + esc(title) + '</h3>' + body + '</div></div>';
  }
  function paathTeach(l, m) {
    var t = l && TEACH[l.n], B = window.IND_BHASHA, P = window.IND_PACKS && window.IND_PACKS.hi;
    if (!t || !B || !P) return '';
    var sc = (window.IND_SCRIPTS || {})[P.script] || {};
    var goal = '<p class="teach-goal"><b>By the end of this stop you can</b> ' + esc(l.o) + '.</p>';
    if (t[0] === 'headline') {
      var ws = (P.lexicon || []).filter(function (w) { return /^[\u0900-\u097F]+$/.test(w.word) && B.clusters && B.clusters(w.word).length >= 3; }).slice(0, 3);
      return teachCard('Learn it here', 'The line on top', goal +
        '<p>Most Devanagari letters hang from a line drawn along the top, called the <b>shirorekha</b>. Look at each letter on its own — then at the word, where their lines join into one.</p>' +
        ws.map(function (w) {
          var parts = B.clusters ? B.clusters(w.word) : w.word.split('');
          return '<div class="teach-row"><span class="teach-apart" lang="hi">' + parts.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') +
            '</span><span class="teach-arrow" aria-hidden="true">→</span>' + sayBtn(w.audio, w.word, w.roman + ' · ' + w.en, 'tword') + '</div>';
        }).join('') +
        '<p class="tiny">The joined line is how a reader sees where one word ends and the next begins. Write it unbroken, all the way across.</p>');
    }
    if (t[0] === 'letters') {
      var L = (sc.consonants || []).slice(t[1], t[2]);
      return teachCard('Learn it here', L.length + ' letters, and the sound each one makes', goal +
        '<p>Say each one out loud first, then tap it to hear whether you were right.</p>' +
        '<div class="teach-grid">' + L.map(function (c) { return sayBtn(c.audio, c.char, c.name); }).join('') + '</div>');
    }
    if (t[0] === 'matras') {
      var base = (sc.consonants || [])[0] || { char: 'क' }, MS = (sc.matras || []).slice(0, t[1]);
      return teachCard('Learn it here', 'A letter is never alone', goal +
        '<p>A consonant carries a short “a” of its own. A <b>matra</b> — a small mark before, after, above or below it — changes that sound. Here is ' +
          '<span lang="hi">' + esc(base.char) + '</span> with each one:</p>' +
        '<div class="teach-grid">' + MS.map(function (x) { return sayBtn(x.audio, x.example || (base.char + x.sign), x.name + ' · ' + (x.position || '')); }).join('') + '</div>');
    }
    if (t[0] === 'words') {
      var W2 = (P.lexicon || []).filter(function (w) { return w.theme === t[1]; }).slice(0, 12);
      if (!W2.length) return '';
      return teachCard('Learn it here', W2.length + ' words to start with', goal +
        '<p>Hear each word, say it back, and point at the thing if it is near you.</p>' +
        '<div class="teach-words">' + W2.map(function (w) { return sayBtn(w.audio, w.word, w.roman + ' · ' + w.en, 'tword'); }).join('') + '</div>');
    }
    if (t[0] === 'grammar') {
      var g = B.grammarPoint ? B.grammarPoint('hi', t[1]) : null;
      if (!g) return '';
      return teachCard('Learn it here', g.en, goal +
        '<p class="teach-rule"><span lang="hi">' + esc(g.hi) + '</span> · ' + esc(g.rule) + '</p>' +
        (g.watch ? '<p class="tiny"><b>Watch out:</b> ' + esc(g.watch) + '</p>' : '') +
        (g.eg || []).slice(0, 3).map(function (e) {
          return '<div class="teach-eg">' + sayBtn(e.audio, e.hi, '', 'tword') + '<span><i>' + esc(e.roman || '') + '</i> — ' + esc(e.en || '') + '</span></div>';
        }).join(''));
    }
    if (t[0] === 'talk') {
      var D = (B.dialogues && B.dialogues('hi')) || [], d = D[(l.n.length * 7) % Math.max(1, D.length)];
      if (!d) return '';
      return teachCard('Learn it here', d.sceneEn || 'A real exchange', goal +
        '<div class="teach-eg">' + sayBtn(d.audio, d.prompt, '', 'tword') + '<span><i>' + esc(d.roman) + '</i> — ' + esc(d.en) + '</span></div>' +
        (d.reply ? '<div class="teach-eg you">' + sayBtn(d.reply.audio, d.reply.hi, '', 'tword') + '<span><i>' + esc(d.reply.roman) + '</i> — ' + esc(d.reply.en) + '</span></div>' : '') +
        '<p class="tiny">Read both sides aloud with someone at home. Then swap who goes first.</p>');
    }
    if (t[0] === 'read') {
      var ps = (((P.stages || []).filter(function (x) { return (x.types || []).indexOf('readPassage') >= 0; })[0] || {}).items || [])
        .filter(function (x) { return x && x.kind === 'passage'; });
      var pp = ps[(l.n.length * 3) % Math.max(1, ps.length)];
      if (!pp) return '';
      return teachCard('Learn it here', 'Read it for the sense', goal +
        '<p>Read it once all the way through without stopping. Most of it is enough to know what is happening.</p>' +
        '<p class="teach-passage" lang="hi">' + esc(pp.hi) + '</p>' +
        '<button class="btn ghost sm" data-act="say" data-k="' + esc(pp.audio || '') + '" data-t="' + esc(pp.hi) + '" data-l="hi-IN">' +
          icon('sound', 16) + ' Hear it read</button>' +
        '<details><summary>What it says</summary><p>' + esc(pp.en || '') + '</p></details>');
    }
    return '';
  }

  function paathUI() {
    if (!window.IND_PAATH_UI || !window.IND_PAATH) return null;
    if (!paathReady) {
      S.paath = S.paath || { v: 1, c: {} };
      window.IND_PAATH_UI.init({
        state: S.paath,
        save: save, go: go, toast: toast, icon: icon, esc: esc,
        look: paathLook,
        card: paathCard,
        teach: paathTeach,
        /* the child's own companion, for the pin they are standing at — the one piece
           of the atlas that is theirs rather than the course's */
        face: function (n) { return art(S.buddy || 'pt_tortoise', n); },
        owns: function (cid) { return (S.own.packs || []).indexOf('paath.' + cid) >= 0; },
        /* a course objective just counted (the day rule passed): mastery and rank may move */
        learned: function () { checkGrowth(); }
      });
      /* The workshop keeps what a child made, so it gets the same store and the same
         save — one profile, one write path. It never touches the mastery record: that
         is paath.js's `ledger()` and nothing else, which is why karya.js has no handle
         on it to touch. */
      if (window.IND_KARYA) window.IND_KARYA.init({
        state: function () { return S.paath; },
        save: save, esc: esc, icon: icon, toast: toast
      });
      paathReady = true;
    }
    return window.IND_PAATH_UI;
  }
  V.paath = function (arg) {
    var U = paathUI();
    if (!U) return errorState('The courses did not load. It may be the connection — once they have loaded once, they work offline.', 'paath');
    if (arg) return U.course(arg);
    /* THE STORY SHELVES AND MORAL SCIENCE LIVE HERE NOW (FIX-INDIA C1): two doors at the top
       of the school, with everything they held, one tap away — and in ☰ as well. */
    return '<div class="grid g2 pdoors">' +
        '<button class="tile pdoor" data-act="go" data-v="stories">' + icon('tree', 28) +
          '<span><b>' + esc(tellerTitle()) + '</b><span class="tiny muted">' + allStories().length +
          ' stories, read aloud — the epics, the Panchatantra, every state.</span></span></button>' +
        '<button class="tile pdoor" data-act="go" data-v="neeti">' + icon('lamp', 28) +
          '<span><b>Moral Science</b><span class="tiny muted">Values, faiths, festivals and verses — and the day’s deed.</span></span></button>' +
      '</div>' + U.hub();
  };
  V.paathl = function (arg) {
    var U = paathUI();
    if (!U) return V.paath();
    return U.lesson(arg);
  };
  /* ------------------------------------------------- one corpus object, as a lesson card
     THE LESSON PLAYS ITS CONTENT; IT DOES NOT SEND YOU AWAY TO FIND IT. A Paathshala stop
     used to be a menu of links into other tabs, and a parent clicking through found 47 of
     them ended on "Not found." — a historical figure sent to a page that only knows eras,
     an epic episode handed to a page that wants an epic's name — and 74 stops with nothing
     in them at all. tools/qc-paath.js walks every link now.

     So the host hands the course engine everything a card needs, read straight off the
     corpus: the picture, the thing in its own script, a few sentences of what it is, its
     sound, and — as the one optional way out — a deep link that is known to land. The
     body text is always the corpus's own words (a story's hook, an era's kid line, a
     verse's child-level meaning), never written here. */
  function paathCard(kind, id) {
    var L = paathLook(kind, id);
    if (!L) return null;
    var c = { kind: kind, title: L.name, sub: L.sub, art: L.art, face: L.face, script: L.script,
              lang: L.lang, body: '', audio: '', deep: null, extra: '' };
    var find = function (list) { var f = null; (list || []).forEach(function (x) { if (x.id === id) f = x; }); return f; };
    if (kind === 'st') {
      var s = find(allStories());
      c.body = (s && (s.hook || s.moral)) || '';
      c.sub = s && s.place ? s.place : '';
      c.deep = { v: 'story', arg: id, label: 'Read the whole story' };
    } else if (kind === 'it') {
      var eras = (window.IND_ITIHAAS || {}).eras || [], era = null, fig = null, holder = null;
      eras.forEach(function (e) { if (e.id === id) era = e;
        (e.figures || []).forEach(function (f) { if (f.id === id) { fig = f; holder = e; } }); });
      if (era) { c.body = era.kid || era.hook || ''; c.art = eraArt(era); c.deep = { v: 'era', arg: era.id, label: 'Walk this age' }; }
      /* A PERSON LIVES IN AN ERA — the link goes to the era they stand in, which is the
         page that holds them. Sending the person's id to the era page was 30 dead ends. */
      if (fig) { c.body = fig.line || ''; c.sub = holder.title + ' · ' + holder.when;
                 c.face = art(fig.id, 96); c.art = null;
                 c.deep = { v: 'era', arg: holder.id, label: 'Meet them in ' + holder.title }; }
    } else if (kind === 'mb' || kind === 'ra') {
      var E = kind === 'mb' ? window.IND_EPIC_MAHABHARATA : window.IND_EPIC_RAMAYANA, ep = null;
      ((E || {}).episodes || []).forEach(function (x) { if (x.n === Number(id)) ep = x; });
      c.body = (ep && ep.hook) || '';
      var bk = null; ((E || {}).books || []).forEach(function (b) { if (ep && b.id === ep.book) bk = b; });
      c.sub = bk ? bk.name : '';           /* the kind label already says which epic */
      /* an EPISODE opens the episode deck, by the epic's own id and its number — the old
         link handed the epic page a bare number, which was 10 more dead ends */
      c.deep = { act: 'episode', id: kind === 'mb' ? 'mahabharata' : 'ramayana', n: Number(id),
                 label: 'Watch the episode' };
    } else if (kind === 'sh') {
      var v = find((window.IND_SHLOK || {}).verses);
      if (v) {
        c.script = v.text_original || c.script; c.extra = v.translit || '';
        c.body = v.meaning_kid || ''; c.audio = v.audio || '';
        c.sub = v.source || c.sub;
      }
      c.deep = { v: 'shlok', label: 'Every verse on the shelf' };
    } else if (kind === 'ge') {
      var g = find(((window.IND_GEET || {}).songs || []).concat((window.IND_GEET || {}).bhajans || []));
      c.body = (g && g.kid) || ''; c.audio = (g && g.audio) || '';
      c.extra = g && g.words ? g.words.slice(0, 4).map(function (w) { return w.term + ' — ' + w.en; }).join(' · ') : '';
      c.deep = { v: 'song', arg: id, label: 'Sing it' };
    } else if (kind === 'ut') {
      var f = find((window.IND_UTSAV || {}).festivals);
      c.body = (f && f.kid) || '';
      c.deep = { v: 'festival', arg: id, label: 'The whole festival' };
    } else if (kind === 'va') {
      var val = find((window.IND_NEETI || {}).values);
      c.body = (val && val.kid) || '';
      c.deep = { v: 'value', arg: id, label: 'The value card' };
    } else if (kind === 'dh') {
      var d = find((window.IND_DHARMA || {}).faiths);
      c.body = (d && d.blurb) || '';
      c.deep = { v: 'faith', arg: id, label: 'From the inside' };
    } else if (kind === 'ri') {
      /* the WORD is what this card teaches, so it is the heading — in the family's own
         language where they chose one — and the English is the explanation under it */
      var t = find((window.IND_RISHTEY || {}).terms);
      var tgK = tongue(), said = t ? t.roman : '';
      if (t && tgK && tgK.lang && t.also && t.also[tgK.lang])
        said = String(t.also[tgK.lang]).split(' ').slice(1).join(' ') || said;
      if (said) c.title = said.charAt(0).toUpperCase() + said.slice(1);
      c.sub = t ? t.en : '';
      c.body = t ? (t.side === 'p' ? 'On your father’s side.' : t.side === 'm'
        ? 'On your mother’s side.' : '') : '';
      /* the same person in the family's other languages, from the term's own record */
      if (t && t.also) c.extra = Object.keys(t.also).map(function (k) { return t.also[k]; }).join(' · ');
      c.deep = { v: 'rishtey', label: 'The whole family tree' };
    } else if (kind === 'bg') {
      /* a place on the map — NCERT-sourced (data-bhugol.js), each with its own painting */
      var bf = null; (((window.IND_BHUGOL || {}).features) || []).forEach(function (x) { if (x.id === id) bf = x; });
      c.body = (bf && bf.f) || '';
      var ty = bf && ((window.IND_BHUGOL || {}).types || {})[bf.t];
      var gs = bf && ((window.IND_GEO || {}).states || {})[bf.st];
      c.sub = (ty ? ty.n : '') + (gs ? ' · ' + gs.name : '');
      c.deep = bf && bf.st ? { v: 'state', arg: bf.st, label: 'Open ' + (gs ? gs.name : 'the state') } : null;
    } else if (kind === 'na') {
      var q2 = null; (((window.IND_NANI || {}).questions) || []).forEach(function (x) { if (x.id === id) q2 = x; });
      c.plate = { t: q2 && q2.to !== 'any' ? kinTerm(q2.to) : '?' };
      c.extra = L.script && q2 ? q2.roman : '';
      c.body = q2 && q2.follow ? 'If the answer is short, ask: ' + q2.follow : '';
      c.deep = { v: 'nani', label: 'Ask it, and keep the answer' };
        } else if (kind === 'state') {
      var g2 = ((window.IND_GEO || {}).states || {})[id];
      c.body = (g2 && g2.fact) || '';
      c.sub = g2 ? 'Capital: ' + g2.capital : '';
      var sd = (window.IND_STATES || {})[id];
      if (sd && sd.languages && sd.languages.length)
        c.extra = 'Spoken: ' + sd.languages.slice(0, 3).join(', ');
      c.deep = { v: 'state', arg: id, label: 'Open ' + (g2 ? g2.name : 'the state') };
    }
    /* "Hear it" only where there is something to hear. The songs are human voice or
       nothing (V.song says so), and a button that plays silence teaches a child that
       the button is broken — 51 of them did, before the QC walk pressed them. */
    if (c.audio && !hasVoice(c.audio) && !(window.IND_VOICE_HUMAN && window.IND_VOICE_HUMAN[c.audio])) c.audio = '';
    return c;
  }

  /* which project the workshop is showing, resolved from the route rather than kept in a
     second place that can disagree with it */
  function karyaProject() {
    var a = String(view.arg || '').split('|'), PP = window.IND_PAATH;
    if (!PP || a.length < 2) return null;
    var c = null, p = null;
    PP.courses.forEach(function (x) { if (x.id === a[0]) c = x; });
    if (c) c.modules.forEach(function (m) { if (m.project.id === a[1]) p = m.project; });
    return p;
  }

  /* the workshop — the half of a project that happens on this screen */
  V.paathk = function (arg) {
    var U = paathUI();
    if (!U) return V.paath();
    return U.karya(arg);
  };
  /* the printable take-home pack — the half of a course that leaves the screen */
  V.paathp = function (arg) {
    var U = paathUI();
    if (!U) return V.paath();
    return U.pack(arg);
  };

  V.me = function () {
    var A = (window.IND_AVATAR_BY_ID || {})[S.buddy], E = window.IND_ECONOMY;
    return '<div class="card mehead"><div class="row" style="flex-wrap:nowrap">' +
      '<span class="' + (S.frame ? 'framed fr-' + esc(S.frame) : '') + '">' + art(S.buddy, 92) + '</span>' +
      '<div><h1 style="margin:0">' + esc(S.name || 'Yatri') + '</h1>' +
      '<div class="row" style="margin-top:8px">' +
      '<button class="pill coinchip" data-act="wallet">' + coinSvg(18) + ' ' + coins() + '</button>' +
      '<span class="pill stat">' + esc(rank()) + '</span>' +
      '<span class="pill stat">' + Object.keys(S.lit).length + ' places</span>' +
      '<span class="pill stat">' + Object.keys(S.read).length + ' stories</span></div>' +
      (A ? '<p class="tiny muted" style="margin:8px 0 0">Travelling with ' + esc(A.name) + ' · ' + esc(A.tier) + '</p>' : '') +
      '</div></div></div>' +
      /* THE CHILD'S OWN THINGS, each with its own screen now (standard §1, §8): the
         Collection of 96, the Shop with its three shelves, and the worlds */
      '<div class="grid g3 mydoors">' +
        '<button class="tile" data-act="go" data-v="collection">' + icon('cards', 26) + '<b>Collection</b>' +
          '<span class="tiny muted">' + collectionCount() + ' of 96 met</span></button>' +
        '<button class="tile" data-act="go" data-v="shop">' + icon('bag', 26) + '<b>Shop</b>' +
          '<span class="tiny muted">Avatars · Worlds · Extras</span></button>' +
        '<button class="tile" data-act="go" data-v="settings">' + icon('gear', 26) + '<b>Worlds &amp; settings</b>' +
          '<span class="tiny muted">Now: ' + esc(((window.IND_WORLDS && window.IND_WORLDS.get(S.world)) || {}).name || S.world) + '</span></button>' +
      '</div>' +
      V.medals() + V.yatra() + V.malaStrip() +
      /* THE GROWN-UPS' DOOR. Everything that changes the child is behind a PIN. */
      '<div class="card growndoor"><div class="spread"><div><h3 style="margin:0">Grown-ups</h3>' +
      '<p class="tiny muted" style="margin:4px 0 0">The report card, settings, backups and starting again — behind a PIN.</p></div>' +
      '<button class="btn" data-act="go" data-v="grown">' + icon('lock', 18) + ' Grown-ups</button></div></div>';
  };


  /* ============================================================ GROWN-UPS
     Behind a 4-digit PIN that the screen calls a deterrent, not security (family standard
     §7): a curious tap cannot start the child again, and nothing here pretends a browser
     can keep a determined person out. The report card says what the child can now do,
     from evidence — never minutes. */
  var grownOpen = false, pinBuf = '', pinFirst = null;
  function tester() { return Store.loadDevice('tester', false) === true; }
  function pinHash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return 'p' + h.toString(36); }
  function pinScreen() {
    var setting = !S.pin;
    var dots = ''; for (var i = 0; i < 4; i++) dots += '<i class="' + (i < pinBuf.length ? 'on' : '') + '"></i>';
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];
    return '<button class="backlink" data-act="go" data-v="me">' + icon('back', 18) + ' Back</button>' +
      '<div class="card pincard">' +
        '<span class="mono">' + icon('lock', 16) + ' Grown-ups</span>' +
        '<h2>' + (setting ? (pinFirst ? 'Type it once more' : 'Choose a 4-digit PIN')
                          : 'Type the grown-ups\u2019 PIN') + '</h2>' +
        '<div class="pindots" aria-live="polite" aria-label="' + pinBuf.length + ' of 4 digits">' + dots + '</div>' +
        '<div class="pinpad" role="group" aria-label="PIN keypad">' + keys.map(function (k) {
          if (!k) return '<span></span>';
          return k === 'back'
            ? '<button class="pinkey" data-act="pinback" aria-label="Delete">\u232b</button>'
            : '<button class="pinkey" data-act="pin" data-d="' + k + '">' + k + '</button>';
        }).join('') + '</div>' +
        '<p class="tiny muted">This PIN is a <b>deterrent, not security</b>. It keeps starting-again ' +
          'and settings one step away from a curious tap. ' +
          (setting ? 'It is kept only on this device.'
                   : 'Forgotten it? Clearing this site\u2019s data in the browser resets it \u2014 and the ' +
                     'child\u2019s progress with it, which is why it is only a deterrent.') + '</p>' +
      '</div>';
  }
  function pinKey(d) {
    if (pinBuf.length >= 4) return;
    pinBuf += d;
    if (pinBuf.length < 4) return render();
    var entered = pinBuf; pinBuf = '';
    if (!S.pin) {
      if (!pinFirst) { pinFirst = entered; return render(); }
      if (pinFirst !== entered) { pinFirst = null; toast('Those two did not match — choose again'); return render(); }
      S.pin = pinHash(entered); pinFirst = null; save(); grownOpen = true; return render();
    }
    if (pinHash(entered) === S.pin) { grownOpen = true; return render(); }
    toast('Not that one'); render();
  }
  /* THE REPORT CARD, in the family's three measures (standard §7; FIX-INDIA M1, M2) — the
     same everywhere so the Hive can merge them:
       TIME      active minutes, from bizzing.activity — labelled as time, never as learning
       PROGRESS  steps along the path: stories, places, course stops, language lessons
       MASTERY   what the child can now do, from evidence, each with the day it was shown
     window.IND_REPORT() returns the same object for the Hive to read. */
  function ymdLocal(d) { var p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  function dayOf(n) { n = String(n || ''); return /^\d{8}$/.test(n) ? n.slice(0, 4) + '-' + n.slice(4, 6) + '-' + n.slice(6) : n; }
  function minutesOf(name, days) {
    var rows = [];
    try { rows = (JSON.parse(Store.famGet('bizzing.activity') || '{}').s) || []; } catch (e) { rows = []; }
    var from = ymdLocal(new Date(Date.now() - (days - 1) * 864e5)), who = String(name || '').trim(), m = 0, seen = {};
    rows.forEach(function (r) { if (r.a === 'india' && r.who === who && r.d >= from && r.m > 0) { m += r.m; seen[r.d] = 1; } });
    return { minutes: m, days: Object.keys(seen).length };
  }
  function reportOf() {
    var U = null, rows = [];
    try { U = paathUI(); if (U) rows = U.report() || []; } catch (e) { rows = []; }
    var P = window.IND_PACKS || {}, langs = [], rungs = [];
    Object.keys(P).forEach(function (id) {
      if (!S.lang || !S.lang[id] || !window.IND_BHASHA) return;
      var path = bPath(id), all = 0, dn = 0;
      path.forEach(function (r) {
        all += r.total; dn += r.done;
        if (r.mastered) {
          var key = id + ':' + r.stage.id, ev = S.evOn || (S.evOn = {});
          if (!ev[key]) ev[key] = today();
          rungs.push({ what: r.stage.outcome || r.stage.name, where: (P[id].name ? P[id].name.en : id) + ' · ' + r.stage.name, on: ev[key] });
        }
      });
      if (dn) langs.push({ name: P[id].name ? P[id].name.en : id, done: dn, of: all });
    });
    var w = minutesOf(S.name, 7), mo = minutesOf(S.name, 28);
    return {
      app: 'india', child: S.name || '', at: today(),
      time: { week: w.minutes, weekDays: w.days, month: mo.minutes },
      progress: { stories: [Object.keys(S.read || {}).length, allStories().length],
                  places: [Object.keys(S.lit || {}).length, nPlaces()],
                  courses: rows.map(function (r) { return { name: r.name, done: r.stops.done, of: r.stops.of }; }),
                  languages: langs },
      mastery: [].concat(
        rows.reduce(function (acc, r) { return acc.concat(r.learned.map(function (x) {
          return { what: x.what, where: r.name + ' · ' + x.part, on: dayOf(x.on) }; })); }, []),
        rungs),
      medals: MEDALS.filter(function (m) { return (S.medals || {})[m.id]; }).map(function (m) { return { name: m.name, on: S.medals[m.id] }; }),
      courses: rows
    };
  }
  window.IND_REPORT = function () { return window.IND_DEMO ? null : reportOf(); };
  function reportCard() {
    var R = reportOf(), nm = esc(S.name || 'your child');
    var bar = function (a, b) { return '<div class="meter"><i style="width:' + Math.round(a / Math.max(1, b) * 100) + '%"></i></div>'; };
    return '<div class="reportgrid">' +
      /* TIME — said for what it is */
      '<div class="card rc-time"><span class="mono">Time</span><h3>This week</h3>' +
        '<p class="rc-big">' + R.time.week + '<small> active min</small></p>' +
        '<p class="tiny muted">on ' + R.time.weekDays + ' day' + (R.time.weekDays === 1 ? '' : 's') + ' · ' + R.time.month +
          ' in the last four weeks. Active means in use, not just open. Time is not learning — it is here so ' +
          'you can see the shape of the week.</p></div>' +
      /* PROGRESS — steps along the path */
      '<div class="card rc-progress"><span class="mono">Progress</span><h3>Along the path</h3>' +
        '<div class="rc-row"><span>Stories finished</span><b>' + R.progress.stories[0] + ' / ' + R.progress.stories[1] + '</b></div>' +
        '<div class="rc-row"><span>Places lit</span><b>' + R.progress.places[0] + ' / ' + R.progress.places[1] + '</b></div>' +
        bar(R.progress.places[0], R.progress.places[1]) +
        R.progress.courses.map(function (c) {
          return '<div class="rc-row"><span>' + esc(c.name) + '</span><b>stop ' + c.done + ' / ' + c.of + '</b></div>' + bar(c.done, c.of);
        }).join('') +
        R.progress.languages.map(function (l) {
          return '<div class="rc-row"><span>' + esc(l.name) + '</span><b>' + l.done + ' / ' + l.of + ' lessons</b></div>' + bar(l.done, l.of);
        }).join('') + '</div>' +
      /* MASTERY — what the child can now do, with the day of the evidence */
      '<div class="card rc-mastery"><span class="mono">Mastery</span><h3>What ' + nm + ' can do now</h3>' +
        '<p class="tiny muted" style="margin-top:0">From evidence. A course objective counts only when its test was passed ' +
          'on a later day than its lesson; a language rung when its words keep coming back right.</p>' +
        (R.mastery.length
          ? '<ul class="reportlist">' + R.mastery.map(function (x) {
              return '<li><b>' + esc(x.what) + '</b><span class="tiny muted">' + esc(x.where) + ' · shown ' + esc(x.on) + '</span></li>';
            }).join('') + '</ul>'
          : '<p>Nothing is mastered yet. The first course objective counts when its test is passed on a later day ' +
            'than its lesson; the first language rung when its words keep coming back right.</p>') +
        (R.courses.length ? '<p class="tiny muted">' + R.courses.map(function (r) {
            return esc(r.name) + ': ' + r.mastered + ' of ' + r.of + ' objectives' + (r.made ? ', ' + r.made + ' made' : '');
          }).join(' · ') + '</p>' : '') +
        (R.medals.length ? '<p class="tiny">Medals: ' + R.medals.map(function (m) { return esc(m.name); }).join(' · ') + '</p>' : '') +
        (window.IND_PACKS ? '<button class="pill" data-act="go" data-v="bhasha">Bhasha: the full picture →</button>' : '') +
      '</div></div>' +
      /* the household at a glance */
      (Store.kids().length > 1
        ? '<div class="card"><h3 style="margin-top:0">The household this week</h3><div class="kidlist">' +
          Store.kids().map(function (k) {
            var pr = Store.loadProfile(k.id) || {}, t2 = minutesOf(k.name, 7);
            return '<div class="kidrow">' + art(k.buddy, 36) + '<b>' + esc(k.name || 'Not set up yet') + '</b>' +
              '<span class="tiny">' + t2.minutes + ' active min · ' + (((pr.grown || {}).m) || 0) + ' mastered' +
              (k.active ? '' : ' (as of their last visit)') + '</span></div>';
          }).join('') + '</div></div>'
        : '');
  }
  V.grown = function () {
    if (!grownOpen) return pinScreen();
    return '<button class="backlink" data-act="go" data-v="me">' + icon('back', 18) + ' Back</button>' +
      '<div class="phead"><h1>Grown-ups</h1>' +
        '<button class="pill" data-act="grownlock">' + icon('lock', 16) + ' Lock</button></div>' +
      reportCard() +
      /* THIS CHILD'S CONTROLS (standard §15; FIX-INDIA Q4): the age band and the day's target,
         here behind the PIN and nowhere a child can reach them. Sound, read-aloud and the world
         are in Settings, which every child can use. */
      '<div class="card"><h3 style="margin-top:0">' + esc(S.name || 'This child') + '’s settings</h3>' +
        '<div class="setrow"><span><b>Age band</b><small>Changes which stories, quizzes and history open.</small></span>' +
          '<div class="segpills" role="group" aria-label="Age band">' + OB_AGES.map(function (o) {
            var on = (S.age || 8) <= 7 ? o[0] === 6 : (S.age || 8) <= 9 ? o[0] === 9 : o[0] === 11;
            return '<button class="pill' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-act="growage" data-v="' + o[0] + '">' + esc(o[1]) + '</button>';
          }).join('') + '</div></div>' +
        '<div class="setrow"><span><b>Daily target</b><small>Stories, lessons, games or deeds a day. Missing a day costs nothing.</small></span>' +
          '<div class="segpills" role="group" aria-label="Daily target">' + [2, 3, 5].map(function (g2) {
            return '<button class="pill' + ((S.goal || 3) === g2 ? ' on' : '') + '" aria-pressed="' + ((S.goal || 3) === g2) +
              '" data-act="goalset" data-g="' + g2 + '">' + g2 + ' a day</button>';
          }).join('') + '</div></div>' +
        /* MY FEED can be switched off for this child (docs/30): the tab and the ☰ row go with it */
        '<div class="setrow"><span><b>My Feed</b><small>About twenty cards a day from across the app, picked on this device from what ' +
          esc(S.name || 'this child') + ' has done. It ends; nothing in it is counted as learning except a right answer.</small></span>' +
          '<button class="pill' + (S.feedOff ? '' : ' on') + '" role="switch" aria-checked="' + !S.feedOff + '" data-act="feedtoggle">' +
          (S.feedOff ? 'Off' : 'On') + '</button></div>' +
        '<div class="setrow"><span><b>Sound, read-aloud and the world</b><small>In Settings, from the ☰ menu.</small></span>' +
          '<button class="btn sm ghost" data-act="go" data-v="settings">' + icon('gear', 16) + ' Settings</button></div>' +
      '</div>' +
      certCard() +
      /* CHILDREN IN THIS HOUSEHOLD (family standard §5): each keeps their own stories,
         map, coins, languages and courses; switching never mixes them */
      '<div class="card kidscard"><h3 style="margin-top:0">Children in this household</h3>' +
        '<p class="tiny muted" style="margin-top:0">Each child keeps their own stories, map, coins, languages and ' +
          'courses. Switching is also in the top bar, under the child’s picture.</p>' +
        '<div class="kidlist">' + Store.kids().map(function (k) {
          return '<div class="kidrow">' + art(k.buddy, 40) + '<b>' + esc(k.name || 'Not set up yet') + '</b>' +
            (k.active ? '<span class="pill stat">playing now</span>'
                      : '<button class="pill" data-act="switchkid" data-id="' + esc(k.id) + '">Switch to ' + esc(k.name || 'them') + '</button>') +
            '</div>';
        }).join('') + '</div>' +
        '<div class="row" style="margin-top:12px"><button class="pill" data-act="addkid">+ Add a child</button></div>' +
        '<p class="tiny muted" style="margin:10px 0 0">The whole family’s week, across every Bizzing app, is on the ' +
          '<a href="https://aayuvis.github.io/Bizzing_Schedule/">Bizzing Hive</a>.</p></div>' +
      '<div class="card"><h3 style="margin-top:0">Keep a copy</h3>' +
        '<p class="tiny muted" style="margin-top:0">Everything stays on this device. A backup is a file you keep; ' +
          'restoring it puts this device back exactly as it was then.</p>' +
        '<div class="row">' +
          '<button class="pill" data-act="backup">' + icon('print', 16) + ' Save a backup</button>' +
          '<label class="pill">Restore from a backup<input type="file" id="restorefile" accept="application/json,.json" hidden></label>' +
          '<button class="pill" data-act="reset">Remove ' + esc(S.name || 'this child') + ' from this device</button>' +
        '</div></div>' +
      settings_html();
  };
  function settings_html() {
    return (
      /* Sound, music, reading speed and the world are the child's own Settings now (☰ →
         Settings, standard §5). What stays here is the grown-ups' half: the plan, downloads,
         the recorded voice, tester mode, and the build number. */
      '<div class="card"><h3>The plan, downloads and tester mode</h3><div class="row">' +
      (function () {
        var H = window.IND_VOICE_HUMAN || {}, k, both = false;
        for (k in H) { if (H[k] && H[k].v && H[k].v.length > 1) { both = true; break; } }
        return both
          ? '<button class="pill' + (S.voice === 'm' ? ' on' : '') + '" data-act="voice">' +
            icon('sound', 18) + ' ' + (S.voice === 'm' ? 'Man’s voice' : 'Woman’s voice') + '</button>'
          : '';
      })() +
      '</div>' +
      /* THE DEVELOPER UNLOCK. Sits at the bottom of the grown-ups' page, says plainly what
         it does, and is loud while it is on so nobody ships a screenshot of a "finished"
         collection that was actually a test switch. It opens the SIKKE economy only —
         worlds and avatar packs. It cannot and must not open a paid entitlement, which is
         server-side by rule (CLAUDE.md). */
      /* TESTER MODE ONLY (family standard §7). The unlock used to sit on the child's own
         page, one tap from opening every world and pack. It now exists only on a device
         put into tester mode with ?tester=1, and never in front of a child otherwise. */
      (tester() ? '' +
      '<h4 class="setlbl">Developer unlock</h4>' +
      '<div class="row"><button class="pill' + (S.dev ? ' on' : '') + '" data-act="devmode"' +
      ' aria-pressed="' + (S.dev ? 'true' : 'false') + '">' +
      (S.dev ? 'ON — everything is open' : 'Off') + '</button></div>' +
      '<p class="tiny muted" style="margin:8px 0 0">For testing. Opens every world and every ' +
      'avatar pack and stops sikke being spent, so you can walk the whole app without ' +
      'grinding for it. Nothing is bought and nothing is lost — turn it off and your real ' +
      'sikke and your real collection are exactly as you left them.</p>' +      '' : '') +

      '<h4 class="setlbl">Take it offline</h4>' + dlRows() +
      '<h4 class="setlbl">Family plan</h4>' + passCard() +
      '<h4 class="setlbl">If something breaks</h4>' + diagCard() +
      '<p class="tiny muted" style="margin-top:12px">Build <b>' + esc(window.IND_BUILD || 'dev') + '</b>' +
      ' — if something looks wrong, quote this number so we know which version you are on.</p>' +
      '<p class="tiny muted">This demo keeps everything on this device. No account, ' +
      'no child data leaves the browser — which is also how the real product is designed (docs/07).</p></div>'
    );
  }

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
      'their Sanskrit names inside the app — those belong to everyone. And no language hides anything: every ' +
      'story, every state and every pack stays open to every child. Languages don’t stop at ' +
      'state lines either — the states above are where yours is most at home, not a fence.</div>';
  };

  function savingFor() {
    var E = window.IND_ECONOMY, C = window.IND_AVATARS || [];
    if (!E || !S.started) return '';
    var goal = null;
    for (var i = 0; i < C.length && !goal; i++) {
      var st = E.stateOf(S, C[i].id);
      if (C[i].tier === 'legendary' && (st.state === 'buy' || st.state === 'milestone')) goal = { a: C[i], st: st };
    }
    var c = coins(), price, title, line, act, arg;
    if (goal) {
      price = goal.st.price; title = goal.a.name; act = 'avcard'; arg = goal.a.id;
      line = goal.st.state === 'milestone' ? goal.st.say + ', then ' + price + ' coins' : 'Legendary · ' + price + ' coins';
    } else {
      var w = (E.WORLD_ORDER || []).filter(function (id) { return !E.worldOpen(S, id); })[0];
      if (!w) return '';
      var wo = window.IND_WORLDS && window.IND_WORLDS.get(w);
      price = E.worldPrice(); title = (wo ? wo.name : w) + ' world'; act = 'shop'; arg = 'worlds';
      line = 'A new world · ' + price + ' coins';
    }
    var pct = Math.min(100, Math.round(c / Math.max(1, price) * 100));
    return '<button class="card hm-goal" data-act="go" data-v="' + act + '" data-arg="' + esc(arg) + '">' +
      (goal ? '<span class="hg-face bz-av" data-tier="legendary" data-state="' + goal.st.state + '">' + art(goal.a.id, 52) + '</span>'
            : '<span class="hg-face">' + icon('map', 30) + '</span>') +
      '<span class="hg-body"><span class="mono">Saving for</span><b>' + esc(title) + '</b>' +
        '<span class="tiny muted">' + esc(line) + ' · you have ' + c + '</span>' +
        '<span class="meter"><i style="width:' + pct + '%"></i></span></span></button>';
  }

  /* CERTIFICATES (standard §13; FIX-INDIA T9). What triggers one: a level finished — a medal
     earned or a language rung mastered, each from evidence. What it shows: the child's first
     name, their avatar, the peacock, and what was mastered. How it is shared: as a PNG drawn
     on this device, from here behind the PIN only. Nothing is uploaded. */
  function certList() {
    var out = [];
    MEDALS.forEach(function (m) { var on = (S.medals || {})[m.id]; if (on) out.push({ id: 'm-' + m.id, what: m.name, how: m.how, on: on }); });
    try { reportOf().mastery.filter(function (x) { return /·/.test(x.where) && !/Paathshala/.test(x.where); })
      .forEach(function (x, i) { out.push({ id: 'r-' + i, what: x.what, how: x.where, on: x.on }); }); } catch (e) {}
    return out;
  }
  function certCard() {
    var L = certList();
    return '<div class="card certs"><h3 style="margin-top:0">' + icon('medal', 20) + ' Certificates</h3>' +
      '<p class="tiny muted" style="margin-top:0">One for every medal and every language rung ' + esc(S.name || 'your child') +
        ' has earned. Drawn on this device as a picture you can keep or send; nothing is uploaded.</p>' +
      (L.length ? '<div class="certlist">' + L.map(function (c) {
          return '<div class="certrow"><span><b>' + esc(c.what) + '</b><small>' + esc(c.how) + ' · ' + esc(c.on) + '</small></span>' +
            '<button class="pill" data-act="cert" data-id="' + esc(c.id) + '">' + icon('print', 16) + ' Make it</button></div>';
        }).join('') + '</div>'
        : '<p>Nothing yet. The first medal makes the first certificate.</p>') + '</div>';
  }
  function loadImg(src) {
    return new Promise(function (ok) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = function () { ok(null); }; im.src = src; });
  }
  function makeCert(id) {
    var c = certList().filter(function (x) { return x.id === id; })[0];
    if (!c) return Promise.resolve(null);
    var cv = document.createElement('canvas'); cv.width = 1600; cv.height = 1131;
    var g = cv.getContext('2d');
    return Promise.all([loadImg(artSrc(S.buddy)), loadImg('art/peacock-cheer.webp')]).then(function (im) {
      g.fillStyle = '#FFF8EC'; g.fillRect(0, 0, 1600, 1131);
      g.strokeStyle = '#3A2A5C'; g.lineWidth = 14; g.strokeRect(40, 40, 1520, 1051);
      g.strokeStyle = '#E9A13B'; g.lineWidth = 4; g.strokeRect(70, 70, 1460, 991);
      g.fillStyle = '#3A2A5C'; g.textAlign = 'center';
      g.font = '800 54px Fraunces, Georgia, serif'; g.fillText('Bizzing India', 800, 170);
      g.font = '600 30px "Hanken Grotesk", sans-serif'; g.fillText('This certificate is for', 800, 300);
      g.font = '800 104px Fraunces, Georgia, serif'; g.fillText(S.name || '', 800, 420);
      g.font = '600 30px "Hanken Grotesk", sans-serif'; g.fillText('who earned', 800, 510);
      g.font = '800 64px Fraunces, Georgia, serif'; g.fillStyle = '#B84A2A'; g.fillText(c.what, 800, 600);
      g.fillStyle = '#3A2A5C'; g.font = '500 28px "Hanken Grotesk", sans-serif'; g.fillText(c.how, 800, 670);
      g.font = '600 26px "Sono", monospace'; g.fillText(String(c.on), 800, 980);
      if (im[0]) g.drawImage(im[0], 160, 760, 260, 260);
      if (im[1]) g.drawImage(im[1], 1180, 760, 260, 260);
      return new Promise(function (ok) { cv.toBlob(function (b) { ok({ blob: b, name: 'bizzing-india-' + slug(S.name || 'child') + '-' + slug(c.what) + '.png' }); }, 'image/png'); });
    });
  }
  function artSrc(id) {
    return (window.IND_AV_WEBP && window.IND_AV_WEBP.indexOf(id) >= 0) ? 'art/av/' + id + '.webp' : 'art/' + id + '.png';
  }

  /* YOU ARE HERE (FIX-INDIA J6, D8): the child's own face on the map, on the place their
     next story comes from — or, with no story waiting, the last place they lit. A pin over
     the map, never a mark on a boundary: nothing on the map's geometry moves. */
  function mapYou(M) {
    var code = null;
    try {
      var stp = nextStep();
      if (stp && stp.go && stp.go.n === 'story') {
        var st = storyById(stp.go.a), pl = st && st.place && st.place[0];
        if (pl) code = String(pl).replace('IN-', '');
      }
    } catch (e) {}
    if (!code || !(M.anchors || {})[code]) { var lk = Object.keys(S.lit || {}); code = lk.length ? lk[lk.length - 1] : null; }
    if (!code || !(M.anchors || {})[code]) return '';
    var vb = M.viewBox.split(/[\s,]+/).map(Number), a = M.anchors[code];
    var lx = ((a[0] - vb[0]) / vb[2]) * 100, ly = ((a[1] - vb[1]) / vb[3]) * 100;
    return '<span class="mapyou" style="left:' + lx.toFixed(2) + '%;top:' + ly.toFixed(2) + '%" title="You — ' + esc(stateName(code)) + '">' +
      '<span class="' + (S.frame ? 'framed fr-' + esc(S.frame) : '') + '">' + art(S.buddy, 34) + '</span></span>';
  }

  /* ===================================================== THE FAMILY LAYER (standard v2)
     Everything a child meets the same way in every Bizzing app (FIX-INDIA §2; family
     standard §1, §3, §5, §8, §16): the ☰ drawer, the coin chip and its wallet history,
     the Shop, the Collection, Settings in five sections, search, and the peacock on every
     empty and error state. India's own subject stays India's; this is the shared skin. */

  /* ---- device settings: remembered on the device, never on the child (standard §5) */
  var dev = {
    fx: Store.loadDevice('fx', true),          /* sound effects */
    music: Store.loadDevice('music', true),    /* the world's loop */
    vol: +Store.loadDevice('vol', 0.8),        /* one master volume */
    read: Store.loadDevice('read', true),      /* read aloud: the recorded narration */
    theme: Store.loadDevice('theme', null),    /* 'light' | 'dark' | 'auto'; null = the old night switch */
    text: Store.loadDevice('text', 'M'),       /* S · M · L */
    motion: Store.loadDevice('motion', false), /* reduce motion */
    calm: Store.loadDevice('calm', false)      /* calm mode: no music, softer effects, no confetti */
  };
  if (!(dev.vol >= 0 && dev.vol <= 1)) dev.vol = 0.8;
  var mqDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (dev.theme === 'auto' && mqDark) night = mqDark.matches;
  else if (dev.theme === 'dark') night = true;
  else if (dev.theme === 'light') night = false;
  if (mqDark && mqDark.addEventListener) mqDark.addEventListener('change', function () {
    if (dev.theme !== 'auto') return;
    night = mqDark.matches; paintChrome(); render();
  });
  function setDev(k, v) { dev[k] = v; Store.saveDevice(k, v); applyLook(); }
  /* the look the html element carries, so CSS (and the worlds engine, and the family's
     avatar glow) can follow it without asking */
  function applyLook() {
    var r = document.documentElement;
    r.setAttribute('data-text', dev.text || 'M');
    if (dev.motion) r.setAttribute('data-motion', 'reduce'); else r.removeAttribute('data-motion');
    if (dev.calm) r.setAttribute('data-calm', '1'); else r.removeAttribute('data-calm');
    if (night) r.setAttribute('data-bz-dark', ''); else r.removeAttribute('data-bz-dark');
    if (window.IND_AUDIO) window.IND_AUDIO.set({ muted: !soundOn, fx: dev.fx, music: dev.music && !dev.calm,
      vol: dev.vol, calm: dev.calm });
  }
  /* effects and read-aloud each have their own switch, under the one mute */
  window.IND_SFX_MUTED = function () { return !soundOn || !dev.fx; };
  function narrationOn() { return soundOn && dev.read; }

  /* ---- the mascot (standard §2): the peacock, in six poses. The poses are painted
     (art/peacock-<pose>.webp); the logo stands in for any pose not painted yet. */
  var PEACOCK = ['wave', 'cheer', 'think', 'point', 'sleep', 'oops'];
  window.IND_PEACOCK = PEACOCK;
  function peacock(pose, size) {
    var have = window.IND_PEACOCK && window.IND_PEACOCK.indexOf(pose) >= 0;
    var src = have ? 'art/peacock-' + pose + '.webp' : 'art/logo.png';
    return '<img class="peacock p-' + esc(pose) + '" src="' + src + '" alt="" width="' + (size || 96) +
      '" height="' + (size || 96) + '" loading="lazy" decoding="async">';
  }
  /* EMPTY AND ERROR STATES (standard §16): the mascot, one sentence, one button. Never a
     blank panel, never a stack trace, "[object Object]" or a {placeholder}. */
  function emptyState(line, btn, act, v) {
    return '<div class="card bz-empty" role="status">' + peacock('sleep', 112) +
      '<p>' + esc(line) + '</p>' +
      (btn ? '<button class="btn" data-act="' + (act || 'go') + '" data-v="' + esc(v || 'home') + '">' + esc(btn) + '</button>' : '') +
      '</div>';
  }
  function errorState(line, retryV, retryArg) {
    return '<div class="card bz-empty bz-oops" role="alert">' + peacock('oops', 112) +
      '<h2>That did not work</h2><p>' + esc(line) + '</p>' +
      '<button class="btn" data-act="go" data-v="' + esc(retryV || 'home') + '"' +
        (retryArg != null ? ' data-arg="' + esc(retryArg) + '"' : '') + '>Try again</button></div>';
  }

  /* The ☰ drawer is the family shell's (family/bizzing-shell.js), wired by bindShell. */
  /* Esc closes the sheets; Tab stays inside whichever is open */
  document.addEventListener('keydown', function (e) {
    var open = $('#walletsheet .ws-in') || $('#kidmenu .km-in');
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      if ($('#walletsheet')) closeWallet(); else closeKidMenu();
      return;
    }
    if (e.key !== 'Tab') return;
    var f = [].filter.call(open.querySelectorAll('button, a[href], input, [tabindex="0"]'), function (x) { return !x.disabled && x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (!open.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---- THE WALLET (standard §1.1): the coin chip opens the balance, the last thirty lines
     written as words, and one line saying what coins are for. Coins from a sibling app are
     marked with that app's mascot. */
  var APPS = {
    bee: { name: 'Bizzing Bee', head: 'art/family/bee.webp' },
    maths: { name: 'Bizzing Maths', head: 'art/family/maths.webp' },
    geography: { name: 'Bizzing Geography', head: 'art/family/geography.webp' },
    india: { name: 'Bizzing India', head: 'art/logo.png' },
    finance: { name: 'Bizzing Finance', head: 'art/family/finance.webp' }
  };
  var EARN_WORDS = { answer: 'a right answer', stop: 'finished a story, a stop or a lesson', contest: 'finished a quiz show',
                     mastery: 'mastered something', migrated: 'old coins, brought across' };
  function ledgerLine(x) {
    var why = String(x.why || ''), w = EARN_WORDS[why], m;
    if (!w && (m = why.match(/^avatar:(.+)$/))) w = 'met ' + (avatarName(m[1]) || m[1]);
    if (!w && (m = why.match(/^world:(\d+)$/))) {
      var wid = (window.IND_ECONOMY && window.IND_ECONOMY.WORLD_ORDER[+m[1] - 1]) || '', wo = window.IND_WORLDS && window.IND_WORLDS.get(wid);
      w = 'opened the ' + (wo ? wo.name : 'world ' + m[1]) + ' world';
    }
    if (!w && (m = why.match(/^world:([a-z0-9]+)$/))) {
      var wo2 = window.IND_WORLDS && window.IND_WORLDS.get(m[1]); w = 'opened the ' + (wo2 ? wo2.name : m[1]) + ' world';
    }
    if (!w && (m = why.match(/^extra:(.+)$/))) {
      var ex = ((window.IND_ECONOMY && window.IND_ECONOMY.EXTRAS) || []).filter(function (e) { return e.id === m[1]; })[0];
      w = 'bought ' + (ex ? ex.name : m[1]);
    }
    if (!w && (m = why.match(/^(card|pack):(.+)$/))) w = (m[1] === 'card' ? 'met ' + (avatarName(m[2]) || m[2]) : 'opened a pack');
    if (!w && /^refund:/.test(why)) w = 'given back: ' + why.slice(7);
    return w || why;
  }
  function walletLines(n) {
    var Wl = window.IND_WALLET;
    var L = (Wl && S.name) ? Wl.ledger(S.name).slice(-(n || 30)).reverse() : [];
    if (!L.length) return '<p class="tiny muted">Nothing yet. Your first coins come with your first right answer.</p>';
    return '<ul class="ws-list">' + L.map(function (x) {
      var app = APPS[x.a] || APPS.india;
      var d = new Date(x.t);
      return '<li class="' + (x.n < 0 ? 'out' : 'in') + '"><img src="' + app.head + '" alt="' + esc(app.name) + '" title="' + esc(app.name) + '" width="24" height="24">' +
        '<b>' + (x.n > 0 ? '+' : '−') + Math.abs(x.n) + '</b>' +
        '<span>' + esc(ledgerLine(x)) + (x.a !== 'india' ? ' · ' + esc(app.name.replace('Bizzing ', '')) : '') + '</span>' +
        '<time datetime="' + d.toISOString() + '">' + d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + '</time></li>';
    }).join('') + '</ul>';
  }
  var COINS_FOR = 'Bizzing coins are earned only by learning — 1 for a right answer, 5 for a story or lesson finished — ' +
    'and spent on avatars, worlds and extras at printed prices. The same coins work in every Bizzing app.';
  function coinSvg(size) {
    return '<svg class="bzcoin" viewBox="0 0 24 24" width="' + (size || 20) + '" height="' + (size || 20) + '" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="10" fill="#F0B429" stroke="#B7791F" stroke-width="1.6"/>' +
      '<circle cx="12" cy="12" r="6.6" fill="none" stroke="#B7791F" stroke-width="1.3"/>' +
      /* the family's hexagon, never a currency sign: Bizzing coins are not money (standard §1) */
      '<path d="M12 8.2l3.3 1.9v3.8L12 15.8l-3.3-1.9v-3.8z" fill="#FFE08A" stroke="#8a5a12" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  }
  function openWallet() {
    if ($('#walletsheet')) return;
    var d = document.createElement('div');
    d.id = 'walletsheet';
    d.innerHTML = '<div class="ws-scrim" data-act="walletclose"></div>' +
      '<div class="ws-in" role="dialog" aria-modal="true" aria-label="Your Bizzing coins">' +
        '<div class="ws-head"><h2>' + coinSvg(28) + ' <span id="wsBal">' + coins() + '</span> Bizzing coins</h2>' +
          '<button class="iconbtn" data-act="walletclose" aria-label="Close">' + icon('close', 20) + '</button></div>' +
        '<p class="tiny ws-for">' + esc(COINS_FOR) + '</p>' +
        '<h3 class="mono">Where they came from, and went</h3>' + walletLines(30) +
        '<button class="btn" data-act="go" data-v="shop">' + icon('bag', 18) + ' Open the Shop</button>' +
      '</div>';
    document.body.appendChild(d);
    var f = d.querySelector('.ws-in [data-act="walletclose"]'); if (f) f.focus();
  }
  function closeWallet() { var d = $('#walletsheet'); if (d) d.remove(); var c = $('[data-bz=coins]') || $('.coinchip'); if (c) c.focus(); }

  /* ---- the collection count, for the drawer and the Collection page */
  function collectionCount() {
    var E = window.IND_ECONOMY, n = 0;
    (window.IND_AVATARS || []).forEach(function (a) { if (!E || E.avatarOpen(S, a.id)) n++; });
    return n;
  }
  /* the family's avatar card (family/bizzing-avatars.css): the tier's border, and its glow at night */
  function bzCard(a, opts) {
    var E = window.IND_ECONOMY, st = E ? E.stateOf(S, a.id) : { state: 'owned', say: '' };
    var o = opts || {};
    return '<button class="bzcard" data-act="go" data-v="avcard" data-arg="' + esc(a.id) + '" aria-label="' +
        esc(a.name + ' — ' + (st.label || a.tier) + ' — ' + st.say) + '">' +
      '<figure class="bz-av" data-tier="' + a.tier + '" data-state="' + st.state + '">' +
        art(a.id, o.size || 96) +
        '<figcaption>' + esc(a.name) + ' <b>' + esc(st.label || a.tier) + '</b></figcaption></figure>' +
      '<span class="bzsay' + (st.state === 'owned' ? ' own' : '') + '">' + esc(st.say) + '</span></button>';
  }

  /* ---- COLLECTION (standard §8): all 96 by pack, owned and locked, each with its path */
  V.collection = function () {
    var P = window.IND_AVATAR_PACKS || [], C = window.IND_AVATARS || [], WO = (window.IND_ECONOMY || {}).WORLD_ORDER || [];
    return '<div class="phead"><h1>Collection</h1><span class="pill stat">' + collectionCount() + ' of 96</span>' +
        '<p>Twelve packs of eight. Every card says how it opens — nothing is drawn by chance, and nothing is for sale for real money.</p></div>' +
      P.map(function (p, i) {
        var w = window.IND_WORLDS && window.IND_WORLDS.get(WO[Math.floor(i / 2)]);
        return '<section class="card bzpack"><div class="spread"><h2 style="margin:0">' + esc(p.name) + '</h2>' +
            '<span class="mono">' + (w ? esc(w.name) + ' world' : '') + '</span></div>' +
          '<p class="tiny muted" style="margin:4px 0 12px">' + esc(p.note || '') + '</p>' +
          '<div class="bzgrid">' + C.filter(function (a) { return a.pack === i + 1; }).map(function (a) { return bzCard(a); }).join('') + '</div></section>';
      }).join('') +
      '<div class="card flat tiny"><b>About these cards.</b> Real people carry a line about what they actually did, from their own sourced card. ' +
        'Figures from the faiths and the epics are drawn the way families keep them, and none of them is ever drawn as a villain.</div>';
  };

  /* ---- SHOP (standard §1): Avatars · Worlds · Extras, then the wallet history */
  V.shop = function (tab) {
    tab = tab === 'worlds' || tab === 'extras' ? tab : 'avatars';
    var E = window.IND_ECONOMY;
    var tabs = [['avatars', 'Avatars'], ['worlds', 'Worlds'], ['extras', 'Extras']];
    var body = '';
    if (tab === 'avatars') {
      var P = window.IND_AVATAR_PACKS || [], C = window.IND_AVATARS || [];
      body = P.map(function (p, i) {
        var want = C.filter(function (a) { return a.pack === i + 1 && E && !E.avatarOpen(S, a.id); });
        if (!want.length) return '';
        return '<section class="card bzpack"><h3 style="margin:0 0 10px">' + esc(p.name) + '</h3><div class="bzgrid">' +
          want.map(function (a) {
            var st = E.stateOf(S, a.id);
            return '<div class="shopcell">' + bzCard(a, { size: 84 }) +
              (st.state === 'buy'
                ? '<button class="btn sm' + (st.short ? ' ghost' : '') + '" data-act="buyav" data-id="' + esc(a.id) + '"' + (st.short ? ' aria-disabled="true"' : '') + '>' +
                  coinSvg(16) + ' ' + st.price + '</button>'
                : '') + '</div>';
          }).join('') + '</div></section>';
      }).join('') || emptyState('You have every card there is. Every one of them was earned.', 'See your Collection', 'go', 'collection');
    } else if (tab === 'worlds') {
      body = '<div class="grid g2">' + worldList().map(function (w) {
        var open = !E || E.worldOpen(S, w.id), n = E ? E.worldNum(w.id) : 0;
        return '<div class="card wshop' + (open ? '' : ' locked') + '">' +
          (w.tile ? '<div class="wpreview live" data-world="' + w.id + '">' + w.tile + '</div>' : '') +
          '<div class="spread"><h3 style="margin:0">' + esc(w.name) + '</h3><span class="mono">World ' + n + '</span></div>' +
          '<p class="tiny muted" style="margin:4px 0 10px">' + esc(w.region) + (n <= 6 ? ' · two avatar packs live here' : '') + '</p>' +
          (open ? (S.world === w.id ? '<span class="pill stat">You are in this world</span>'
                                    : '<button class="btn sm ghost" data-act="world" data-w="' + w.id + '">Go there</button>')
                : '<button class="btn sm" data-act="buyworld" data-w="' + w.id + '">' + coinSvg(16) + ' ' + E.worldPrice() + '</button>' +
                  '<p class="tiny" style="margin:6px 0 0">' + esc(E.worldSay(S, w.id)) + '</p>') +
          '</div>';
      }).join('') + '</div>';
    } else {
      body = '<div class="grid g2">' + ((E && E.EXTRAS) || []).map(function (x) {
        var have = E.extraOwned(S, x.id), on = x.kind === 'frame' ? S.frame === x.id : (S.skin || {})[x.game] === x.id;
        return '<div class="card xshop">' + extraArt(x) +
          '<div><h3 style="margin:0">' + esc(x.name) + '</h3><p class="tiny muted" style="margin:4px 0 10px">' + esc(x.note) + '</p>' +
          (have ? (on ? '<span class="pill stat">On</span> <button class="pill" data-act="useextra" data-id="' + x.id + '" data-off="1">Take it off</button>'
                      : '<button class="btn sm ghost" data-act="useextra" data-id="' + x.id + '">Use it</button>')
                : '<button class="btn sm" data-act="buyextra" data-id="' + x.id + '">' + coinSvg(16) + ' ' + x.price + '</button>') +
          '</div></div>';
      }).join('') + '</div>';
    }
    return '<div class="phead"><h1>Shop</h1>' +
        '<button class="pill coinchip big" data-act="wallet">' + coinSvg(20) + ' ' + coins() + '</button>' +
        '<p>Fixed prices, printed on everything. Coins are earned only by learning, and nothing here is ever chosen by chance.</p></div>' +
      '<div class="segtabs" role="tablist" aria-label="What to look at">' + tabs.map(function (t) {
        return '<button role="tab" aria-selected="' + (t[0] === tab) + '" class="seg' + (t[0] === tab ? ' on' : '') +
          '" data-act="go" data-v="shop" data-arg="' + t[0] + '">' + t[1] + '</button>';
      }).join('') + '</div>' +
      body +
      '<section class="card"><h2 style="margin-top:0">Where your coins came from</h2>' +
        '<p class="tiny muted" style="margin-top:0">' + esc(COINS_FOR) + '</p>' + walletLines(30) + '</section>';
  };
  /* a frame or a board, drawn: the child sees exactly what they are choosing */
  function extraArt(x) {
    if (x.kind === 'board') {
      var c = x.id === 'board-rosewood' ? ['#6b3416', '#3d1d0b', '#c98b45'] : ['#e8c58f', '#b7884b', '#f6e2bd'];
      return '<svg class="xart" viewBox="0 0 80 80" aria-hidden="true"><rect x="4" y="4" width="72" height="72" rx="6" fill="' + c[1] + '"/>' +
        '<rect x="10" y="10" width="60" height="60" fill="' + c[2] + '"/><circle cx="40" cy="40" r="11" fill="none" stroke="' + c[0] + '" stroke-width="2"/>' +
        '<circle cx="14" cy="14" r="4" fill="#222"/><circle cx="66" cy="14" r="4" fill="#222"/><circle cx="14" cy="66" r="4" fill="#222"/><circle cx="66" cy="66" r="4" fill="#222"/></svg>';
    }
    return '<span class="xart framed fr-' + esc(x.id) + '">' + art(S.buddy, 64) + '</span>';
  }

  /* ---- MEDALS, as their own page (☰ → Medals) */
  V.medalsPage = function () {
    return '<div class="phead"><h1>Medals</h1><p>Earned by something the app saw you do. Never for showing up, never for days in a row.</p></div>' +
      V.medals();
  };

  /* ---- SETTINGS (standard §5): Bee's centred sheet, five sections in the family order:
     Me · Sound & music · Look · Comfort · Grown-ups 🔒, then Privacy · About · version. */
  function sw(act, on, label, note) {
    return '<div class="setrow"><span><b>' + label + '</b>' + (note ? '<small>' + note + '</small>' : '') + '</span>' +
      '<button class="switch' + (on ? ' on' : '') + '" role="switch" aria-checked="' + !!on + '" data-act="' + act + '" aria-label="' + esc(label) + '"><i></i></button></div>';
  }
  function seg(label, act, cur, opts) {
    return '<div class="setrow"><span><b>' + label + '</b></span><div class="segpills" role="group" aria-label="' + esc(label) + '">' +
      opts.map(function (o) {
        return '<button class="pill' + (String(cur) === String(o[0]) ? ' on' : '') + '" aria-pressed="' + (String(cur) === String(o[0])) +
          '" data-act="' + act + '" data-v="' + o[0] + '">' + o[1] + '</button>';
      }).join('') + '</div></div>';
  }
  V.settings = function () {
    var E = window.IND_ECONOMY, th = dev.theme || (night ? 'dark' : 'light');
    return '<div class="setsheet">' +
      '<div class="sethead"><button class="backlink" data-act="back">' + icon('back', 18) + ' Back</button>' +
        '<h1>' + icon('gear', 24) + ' Settings</h1>' +
        '<button class="iconbtn" data-act="go" data-v="home" aria-label="Close settings">' + icon('close', 20) + '</button></div>' +
      /* 1 · ME */
      '<section class="card setcard" data-sec="me"><h2>Me</h2>' +
        '<div class="setrow"><span><b>Name</b><small>Grown-ups can change it — it is how every Bizzing app knows your coins.</small></span>' +
          '<input class="setname" value="' + esc(S.name || '') + '" readonly aria-label="Your name"></div>' +
        '<div class="setrow"><span><b>Avatar</b><small>' + esc(avatarName(S.buddy) || '') + '</small></span>' +
          '<button class="btn sm ghost" data-act="go" data-v="collection">' + art(S.buddy, 28) + ' Choose</button></div>' +
        '<div class="setrow"><span><b>Who is playing</b></span><button class="btn sm ghost" data-act="kidmenu">Switch child</button></div>' +
        /* the family's language moved here from ☰ when My Feed took its row (owner, 2 Oct 2026) */
        '<div class="setrow"><span><b>Family language</b><small>' + esc(tongue() ? tongue().en : 'Tell us once, and everything leans your way.') + '</small></span>' +
          '<button class="btn sm ghost" data-act="go" data-v="tongue">Choose</button></div>' +
        sw('hindi', !!S.hindi, 'Read stories in Hindi too', 'Every story that has a Hindi telling shows it beside the English.') +
      '</section>' +
      /* 2 · SOUND & MUSIC */
      '<section class="card setcard" data-sec="sound"><h2>Sound &amp; music</h2>' +
        sw('setfx', dev.fx, 'Sound effects') +
        sw('setmusic', dev.music, 'Music', dev.calm ? 'Calm mode keeps the music off.' : 'A loop for each world, played by tanpura, bansuri, santoor and tabla — composed in code for Bizzing.') +
        '<div class="setrow"><span><b>Volume</b></span><input type="range" class="slider" min="0" max="100" step="5" value="' +
          Math.round(dev.vol * 100) + '" data-set="vol" aria-label="Volume"></div>' +
        sw('setread', dev.read, 'Read aloud', 'The recorded voice that reads stories and words.') +
        seg('Reading speed', 'rate', speakRate(), [[0.7, 'Slower'], [0.85, 'Slow'], [1, 'Normal']]) +
        sw('sound', !soundOn, 'Mute everything', 'Also one tap from the ☰ menu.') +
      '</section>' +
      /* 3 · LOOK */
      '<section class="card setcard" data-sec="look"><h2>Look</h2>' +
        '<h3 class="setlbl">World</h3><div class="setworlds">' + worldList().map(function (w) {
          var open = !E || E.worldOpen(S, w.id);
          return '<button class="setworld' + (S.world === w.id ? ' on' : '') + (open ? '' : ' locked') + '" data-act="' + (open ? 'world' : 'buyworld') +
            '" data-w="' + w.id + '" aria-label="' + esc(w.name + (open ? '' : ' — ' + E.worldSay(S, w.id))) + '">' +
            (w.tile ? '<span class="wpreview live" data-world="' + w.id + '">' + w.tile + '</span>' : '') +
            '<b>' + esc(w.name) + '</b>' + (open ? '' : '<small>' + esc(E.worldSay(S, w.id)) + '</small>') + '</button>';
        }).join('') + '</div>' +
        seg('Light or dark', 'settheme', th, [['light', 'Light'], ['dark', 'Dark'], ['auto', 'Match device']]) +
        seg('Text size', 'settext', dev.text, [['S', 'S'], ['M', 'M'], ['L', 'L']]) +
      '</section>' +
      /* 4 · COMFORT */
      '<section class="card setcard" data-sec="comfort"><h2>Comfort</h2>' +
        sw('setmotion', dev.motion, 'Reduce motion', 'Worlds hold still; nothing slides or bounces.') +
        sw('setcalm', dev.calm, 'Calm mode', 'Music off, softer effects, no confetti.') +
      '</section>' +
      /* 5 · GROWN-UPS — one row, behind the PIN. Age band, daily targets, the plan, backups and
         tester mode live behind it, never above it. */
      '<section class="card setcard" data-sec="grown"><h2>Grown-ups ' + icon('lock', 18) + '</h2>' +
        '<div class="setrow"><span><b>Age band, daily targets, the family plan, backups</b><small>Behind the grown-ups’ PIN.</small></span>' +
          '<button class="btn sm" data-act="go" data-v="grown">' + icon('lock', 16) + ' Open</button></div>' +
      '</section>' +
      '<p class="setfoot tiny"><a href="#/privacy" data-act="go" data-v="privacy">Privacy</a> · ' +
        '<a href="#/help" data-act="go" data-v="help">About &amp; help</a> · Build ' + esc(window.IND_BUILD || 'dev') + '</p>' +
      '</div>';
  };

  /* ---- PRIVACY (standard §17): true, and updated FIRST when anything changes */
  V.privacy = function () {
    return '<div class="card"><h1>' + icon('shield', 26) + ' Privacy</h1>' +
      '<p>Bizzing India keeps everything on this device, in this browser. Nothing about your child is sent anywhere.</p>' +
      '<ul class="dolist">' +
        '<li><b>What we keep:</b> a first name, an age band and a chosen picture for each child; what they have read, lit, ' +
          'practised and earned. No birthday, no surname, no email, no photograph, no location.</li>' +
        '<li><b>Where:</b> this browser’s own storage. The family’s Bizzing apps share three things on this device — the ' +
          'coins (<code>bizzing.wallet</code>), the minutes and milestones the Hive shows (<code>bizzing.activity</code>), and nothing else.</li>' +
        '<li><b>Recordings</b> on the Family Shelf stay on this device and are never sent anywhere.</li>' +
        '<li><b>No ads, no analytics, no trackers, no third-party scripts.</b> The fonts and the music are part of the app.</li>' +
        '<li><b>No accounts yet.</b> The family plan comes with a family account that is still being built. When it exists, this page changes before anything else does.</li>' +
        '<li><b>Backups and erasing</b> are on the grown-ups’ page, behind the PIN.</li>' +
      '</ul>' +
      '<p class="tiny muted">The PIN is a deterrent, not security: it keeps settings one step away from a curious tap.</p></div>';
  };
  V.help = function () {
    return '<div class="card"><h1>' + icon('help', 26) + ' Help</h1>' +
      '<ul class="dolist">' +
        '<li><b>Continue</b> on Home always opens the one next thing.</li>' +
        '<li><b>Bizzing coins</b> come from learning — a right answer, a story finished — and buy avatars, worlds and extras in the Shop.</li>' +
        '<li><b>Worlds</b> repaint the whole app. The first two are open to everyone; the others open with the family plan or for 240 coins.</li>' +
        '<li><b>Search</b> finds any story, state, era, word, festival or person.</li>' +
        '<li><b>Back</b> always stays inside the app. To leave, use ⬡ — the way to the Bizzing Hive.</li>' +
        '<li><b>Grown-ups</b> (🔒) holds the report card, the age band, daily targets, backups and erasing.</li>' +
      '</ul>' +
      '<p class="tiny muted">Folk-art traditions are credited on every world. Music is composed in code for Bizzing (music/CREDITS.md).</p></div>';
  };

  /* ---- SEARCH (FIX-INDIA C4): one box over stories, states, eras, words, festivals, people,
     games and courses. The index is built from the same data the screens draw, so a result
     always opens a screen that exists. */
  var SIDX = null;
  function searchIndex() {
    if (SIDX) return SIDX;
    var out = [], add = function (kind, title, sub, v, arg, extra) {
      if (!title) return;
      out.push({ k: kind, t: String(title), s: String(sub || ''), v: v, a: arg, x: (String(title) + ' ' + (sub || '') + ' ' + (extra || '')).toLowerCase() });
    };
    allStories().forEach(function (st) { add('Story', st.title, st.hook || st.place || '', 'story', st.id, (st.place || '') + ' ' + (st.collection || '')); });
    epics().forEach(function (e) { add('Epic', e.title || e.name, e.tagline || '', 'epic', e.id); });
    var ST = window.IND_STATES || {};
    Object.keys(ST).forEach(function (c) { var s = ST[c] || {}; add('Place', s.name || stateName(c), s.capital ? 'capital ' + s.capital : '', 'state', c, (s.known || '') + ' ' + c); });
    ((window.IND_ITIHAAS || {}).eras || []).forEach(function (e) { add('Era', e.name || e.title, e.when || e.dates || '', 'era', e.id, e.summary || ''); });
    ((window.IND_UTSAV || {}).festivals || []).forEach(function (f) { add('Festival', f.name, f.month || '', 'festival', f.id, (f.states || []).join(' ') + ' ' + (f.why || '')); });
    ((window.IND_DHARMA || {}).faiths || []).forEach(function (f) { add('Faith', f.name, '', 'faith', f.id); });
    var P = window.IND_PACKS || {};
    Object.keys(P).forEach(function (pid) {
      (P[pid].lexicon || []).forEach(function (w) {
        add('Word', w.word, (w.roman ? w.roman + ' · ' : '') + (w.en || w.meaning || ''), 'wordcard', pid + ':' + w.word, (w.en || '') + ' ' + (w.roman || ''));
      });
    });
    (window.IND_AVATARS || []).forEach(function (a) { add(a.real ? 'Person' : 'Card', a.name, a.about || '', 'avcard', a.id); });
    (window.IND_GAMES || []).forEach(function (g) { if (!g.hide) add('Game', g.name, (g.blurb || '').slice(0, 90), 'game', g.id); });
    ((window.IND_PAATH || {}).courses || []).forEach(function (c) { add('Course', c.title || c.name, c.tagline || c.sub || '', 'paath', c.id); });
    SIDX = out;
    return out;
  }
  function searchFind(q, n) {
    q = String(q || '').trim().toLowerCase();
    if (q.length < 2) return [];
    var words = q.split(/\s+/), rank = [];
    searchIndex().forEach(function (r) {
      for (var i = 0; i < words.length; i++) if (r.x.indexOf(words[i]) < 0) return;
      var t = r.t.toLowerCase(), sc = t === q ? 0 : t.indexOf(q) === 0 ? 1 : t.indexOf(q) >= 0 ? 2 : 3;
      rank.push([sc, r]);
    });
    rank.sort(function (a, b) { return a[0] - b[0] || a[1].t.length - b[1].t.length; });
    return rank.slice(0, n || 40).map(function (x) { return x[1]; });
  }
  function searchResults(q) {
    var R = searchFind(q, 60);
    if (String(q || '').trim().length < 2) return '<p class="tiny muted">Type two letters or more — a story, a state, a word in any script, a festival, a person.</p>';
    if (!R.length) return '<div class="bz-empty slim">' + peacock('think', 72) + '<p>Nothing called “' + esc(q) + '” yet. Try a shorter word, or another spelling.</p></div>';
    return '<p class="tiny muted" role="status">' + R.length + (R.length === 60 ? '+' : '') + ' found</p><ul class="sresults">' + R.map(function (r) {
      return '<li><button class="sres" data-act="go" data-v="' + r.v + '" data-arg="' + esc(r.a) + '">' +
        '<span class="skind">' + esc(r.k) + '</span><b>' + esc(r.t) + '</b><small>' + esc(r.s) + '</small></button></li>';
    }).join('') + '</ul>';
  }
  V.search = function (q) {
    return '<div class="phead"><h1>' + icon('search', 26) + ' Search</h1></div>' +
      '<div class="card"><label class="sbox"><span class="sr-only">Search Bizzing India</span>' + icon('search', 20) +
        '<input id="sq" type="search" autocomplete="off" placeholder="A story, a state, an era, a word…" value="' + esc(q || '') + '"></label>' +
      '<div id="sres">' + searchResults(q || '') + '</div></div>';
  };
  document.addEventListener('input', function (e) {
    if (!e.target || e.target.id !== 'sq') return;
    var box = $('#sres'); if (box) box.innerHTML = searchResults(e.target.value);
    tagScripts(box);
    view.arg = e.target.value;
    try { history.replaceState({ n: 'search', a: view.arg, d: depth }, '', hashOf(view)); } catch (err) {}
  });
  /* THE MUSIC FOLLOWS THE CHILD (standard §11): the Mela's loop in a game, the home loop on
     Home, and the world's own loop everywhere else. audio.js keeps it silent until a real
     tap, under the mute, in Calm mode and while the tab is hidden. */
  function musicNow() {
    if (!window.IND_AUDIO) return;
    applyLook();
    if (!S.started) { window.IND_AUDIO.music(null); return; }
    var n = view.name;
    var theme = (n === 'game' || n === 'gullygame' || n === 'mela' || n === 'khel' || n === 'play') ? 'games'
      : (n === 'home' ? 'home' : S.world);
    window.IND_AUDIO.music(theme);
  }
  /* A LEGENDARY'S MILESTONE is measured, never claimed (standard §8): the same evidence the
     medals read, plus the stories and epic nights the profile already records. */
  function legendEvidence() {
    var e = evidence(), read = Object.keys(S.read || {});
    e.epic = {};
    Object.keys(S.epic || {}).forEach(function (k) { e.epic[k] = Object.keys((S.epic[k] || {}).done || {}).length; });
    e.pre = function (p) { return read.filter(function (id) { return id.indexOf(p) === 0; }).length; };
    return e;
  }
  if (window.IND_ECONOMY) window.IND_ECONOMY.setMeasure(function () {
    var M = window.IND_LEGEND_MILESTONES || {}, e = null;
    try { e = legendEvidence(); } catch (x) { return []; }
    return Object.keys(M).filter(function (k) { try { return M[k].ok(e); } catch (x) { return false; } });
  });
  /* NOTHING ANIMATES BEHIND A CLOSED TAB (standard §7): the worlds' ambient life, the
     friezes and every loop hold still while the page is hidden; audio.js pauses the music */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) document.documentElement.setAttribute('data-hidden', '');
    else document.documentElement.removeAttribute('data-hidden');
  });
  /* the volume slider moves the music as it slides */
  document.addEventListener('input', function (e) {
    if (!e.target || e.target.getAttribute('data-set') !== 'vol') return;
    setDev('vol', Math.max(0, Math.min(1, (+e.target.value || 0) / 100)));
  });

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
  /* Six doors, spread across the bar: Home · Nani-Nana · India · Bhasha ·
     Moral Science · Play. Itihaas is not a door any more — the river of time
     lives INSIDE India (the timeline atop the map); V.itihaas and V.era stay
     as pages the timeline opens. */
  /* FIVE TABS (family standard §4; FIX-INDIA C1): Home · India · Paathshala · Bhasha · Play.
     Home first and the map second, as in every Bizzing app. The story shelves (Nani-Nana)
     and Moral Science are doors inside Paathshala and rows in ☰; there is no More tab. */
  /* six tabs (owner, 2 Oct 2026): My Feed sits second, after Home */
  var TABS = [['home', 'Home', 'home'], ['map', 'India', 'map'], ['paath', 'Paathshala', 'book'],
              ['bhasha', 'Bhasha', 'script'], ['khel', 'Play', 'game'], ['feed', 'My Feed', 'feed']];   /* My Feed last (owner, 2 Oct 2026) */

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
            /* A LOCKED CARD SHOWS WHAT IT IS AND HOW IT OPENS — never a blank grey box.
               A child has to be able to want it: a printed price they choose to pay, or,
               for a rare card, the learning that opens it. Nothing is drawn. */
            ((window.IND_ECONOMY && !window.IND_ECONOMY.avatarOpen(S, here.id))
              ? (function () {
                  var st = window.IND_ECONOMY.stateOf(S, here.id);
                  return '<div class="avlocked">' +
                    '<div class="avlockart">' + art(here.id, 96) + '</div>' +
                    '<h3 style="margin:10px 0 2px">' + esc(avatarName(here.id) || 'Not met yet') + '</h3>' +
                    '<p class="tiny muted" style="margin:0 0 12px">' + esc(st.label) + ' · ' + esc(st.say) + '</p>' +
                    (st.state === 'buy' && !st.short ? '<button class="btn sm" data-act="buyav" data-id="' + esc(here.id) + '">Meet them — ' + st.price + ' coins</button>' : '') +
                    '</div>';
                })()
              : avCardHTML(here.id)) + '</div>' +
          '<button class="deckarrow next" data-act="deckstep" data-d="1" aria-label="Next card">' +
          icon('back', 24) + '</button>' +
        '</div>' +
      '</div></div>';
  }

  /* THE FAMILY CHROME IS BEE'S, MEASURED (owner, 2 Oct 2026). family/bizzing-shell.js draws the
     top bar (⬡ ☰ peacock+wordmark … search | coins theme 🔒 avatar ▾), the tab row, the phone
     tab bar and the ☰ drawer in the family order, at Bee's exact geometry; India only fills it
     in — its words, its peacock, the child's face, its five tabs and its own four drawer rows.
     tools/lib/shell-check.mjs holds it to Bee's numbers. The chrome is rebuilt whenever one of
     the things it shows changes (shellKey), so nothing in it freezes at boot. */
  var TAB_ICON = { home: 'home', feed: 'feed', map: 'map', paath: 'learn', bhasha: 'pen', khel: 'play' };
  function shellOpts() {
    var FEEDROW = feedOn() ? { icon: 'feed', label: 'My Feed', sub: 'about twenty cards from across the app, and then it ends', href: '#/feed' }
                           : { icon: 'globe', label: 'Family language', sub: tongue() ? tongue().en : 'tell us once, and everything leans your way', href: '#/tongue' };
    var A = (window.IND_AVATAR_BY_ID || {})[S.buddy];
    var face = A ? A.art : 'art/' + S.buddy + '.png';
    return {
      app: 'india', name: 'India', mascot: 'art/logo.png', coins: coins(), dark: !!night,
      kid: { name: S.name || '', avatar: face },
      search: 'Search stories, states, words…', query: view.name === 'search' ? (view.arg || '') : '',
      inRun: (view.name === 'pack' && !!quiz.q) || view.name === 'game',
      tabs: TABS.filter(function (t) { return t[0] !== 'feed' || feedOn(); }).map(function (t) { return { id: t[0], label: t[1], icon: TAB_ICON[t[0]] || 'star', href: '#/' + t[0] }; }),
      active: activeTab(),
      drawer: {
        sub: 'Rank: ' + rank() + (window.IND_DEMO ? ' · sample child' : ''),
        routes: { me: '#/me', shop: '#/shop', collection: '#/collection', medals: '#/medals', settings: '#/settings',
                  grownups: '#/grown', help: '#/help', privacy: '#/privacy' },
        app: [
          FEEDROW,
          { icon: 'book', label: tellerTitle(), sub: 'the story shelves, read aloud', href: '#/stories' },
          { icon: 'lamp', label: 'Moral Science', sub: 'values, faiths, festivals and the day’s deed', href: '#/neeti' },
          { icon: 'star', label: 'The Epics', sub: 'the Ramayana and the Mahabharata, night by night', href: '#/epics' }
        ]
      }
    };
  }
  function shellKey() {
    var o = shellOpts();
    return JSON.stringify([o.coins, o.dark, o.kid, o.inRun, o.active, o.drawer.sub, o.drawer.app[0].label, o.drawer.app[1].label, o.tabs.length, o.query, !!window.IND_DEMO]);
  }
  var lastShell = '';
  function chrome() {
    var o = shellOpts();
    o.content = '';
    return (window.IND_DEMO
        ? '<div class="demobar" role="note"><b>Sample child.</b> A demo with a few weeks of made-up ' +
          'progress — nothing here is saved, and nothing is shared. <a href="' + esc(location.pathname) +
          '">Leave the sample</a></div>' : '') +
      (fromHive ? '<a class="hivechip" href="https://aayuvis.github.io/Bizzing_Schedule/">← back to my day</a>' : '') +
      window.IND_SHELL.shell(o);
  }
  /* the shell's own buttons, wired once (bindShell delegates, so it survives every re-render) */
  var shellBound = false;
  function bindChrome() {
    if (shellBound || !window.IND_SHELL) return;
    shellBound = true;
    window.IND_SHELL.bindShell({
      onTheme: function () { night = !night; Store.saveDevice('night', night); setDev('theme', night ? 'dark' : 'light'); render(); },
      onLock: function () { go('grown'); },
      onKid: function () { if ($('#kidmenu')) closeKidMenu(); else openKidMenu(); },
      onCoins: function () { openWallet(); },
      onSearch: function (q) { go('search', q || ''); },
      onSound: function () { soundOn = !soundOn; Store.saveDevice('sound', soundOn); if (!soundOn) stopAudio(); applyLook(); musicNow(); toast(soundOn ? 'Sound on' : 'Muted'); }
    });
  }
  function activeTab() {
    var alias = { state: 'map', mon: 'map', learn: 'map', era: 'map', itihaas: 'map',
                  stories: 'paath', story: 'paath', kahani: 'paath', nani: 'paath', shelf: 'paath', invite: 'paath', epics: 'paath', epic: 'paath', episode: 'paath',
                  neeti: 'paath', dharma: 'paath', faith: 'paath', utsav: 'paath', festival: 'paath', gully: 'paath', gullygame: 'paath', geet: 'paath', song: 'paath',
                  value: 'paath', shlok: 'paath', verses: 'paath', paathl: 'paath', paathk: 'paath', paathp: 'paath',
                  pack: 'bhasha', chart: 'bhasha', kosh: 'bhasha', wordcard: 'bhasha', vyakaran: 'bhasha', progress: 'bhasha',
                  game: 'khel', mela: 'khel', play: 'khel', rishtey: 'khel', rishquiz: 'khel' };
    var c = alias[view.name] || view.name;
    return ['home', 'map', 'paath', 'bhasha', 'khel', 'feed'].indexOf(c) >= 0 ? c : '';
  }

  /* chrome() is built once and then left alone, so the two toggles that live in
     it have to be repainted by hand — otherwise you tap the moon, the whole app
     goes dark, and the moon is still sitting there asking to be tapped. */
  /* THE CHILD'S MENU, under the avatar in the top bar: who is playing (and the switch to a
     brother or sister — family standard §3, §5), their page, and the one mute (§9). On a
     phone the bar's own extras — coins, the family's language, read-in-Hindi — fold in here
     so the bar stays one row. Adding a child is a grown-up's job and goes through the PIN. */
  /* THE AVATAR ▾ MENU (standard §3; FIX-INDIA C3): every child in the household, each with
     their own face, one tap to switch — switching reloads, so nothing is ever mixed — and
     "Add a child", which is a grown-up's job and goes through the PIN. */
  function kidMenuHTML() {
    var kids = Store.kids();
    return '<div class="km-in" role="menu" aria-label="Who is playing">' +
      '<div class="mono km-h">Who is playing</div>' +
      kids.map(function (k) {
        return '<button class="km-row' + (k.active ? ' on' : '') + '" role="menuitemradio" aria-checked="' + k.active +
          '" data-act="switchkid" data-id="' + esc(k.id) + '">' + art(k.buddy, 40) +
          '<span>' + esc(k.name || 'Not set up yet') + '</span>' + (k.active ? '<i>playing</i>' : '<i>switch</i>') + '</button>';
      }).join('') +
      '<button class="km-row" role="menuitem" data-act="addkid">' + icon('people', 20) +
        '<span>Add a child</span><i>grown-ups</i></button>' +
      '<hr>' +
      '<button class="km-row" role="menuitem" data-act="go" data-v="me">' + icon('star', 18) + '<span>My page</span></button>' +
      '<button class="km-row" role="menuitem" data-act="go" data-v="collection">' + icon('cards', 18) + '<span>Collection</span></button>' +
      '</div>';
  }
  function openKidMenu() {
    var m = document.createElement('div');
    m.id = 'kidmenu'; m.innerHTML = kidMenuHTML();
    m.addEventListener('click', function (e) { if (e.target === m) closeKidMenu(); });
    document.body.appendChild(m);
    var b = $('[data-bz=kid]'); if (b) b.setAttribute('aria-expanded', 'true');
    var f = m.querySelector('.km-row.on') || m.querySelector('.km-row'); if (f) f.focus();
  }
  function closeKidMenu() {
    var m = $('#kidmenu'); if (m) m.remove();
    var b = $('[data-bz=kid]'); if (b) b.setAttribute('aria-expanded', 'false');
  }
  /* the shell is rebuilt when anything it shows changes (shellKey); the kid menu is India's own */
  function paintChrome() {
    var km = $('#kidmenu'); if (km) km.innerHTML = kidMenuHTML();
  }

  var lastLoad = null;          /* the load a gated render is waiting on (BI.go returns it) */
  function render() {
    var r = document.documentElement;
    r.setAttribute('data-world', S.world);
    if (night) r.setAttribute('data-mode', 'night'); else r.removeAttribute('data-mode');
    applyLook();
    var root = document.getElementById('app');

    if (!S.started) {
      /* a guest reading tonight's story from the landing page, before any setup */
      if (view.name === 'story' && view.arg && missingOf(STORYG).length) {
        lastLoad = window.IND_LOAD(missingOf(STORYG)).then(render);
        return;
      }
      if (view.name === 'story' && view.arg) {
        root.innerHTML = '<header class="guestbar"><span class="brand">Bizzing <em>India</em></span>' +
          '<span class="tiny muted gb-note">Reading as a guest — nothing is set up yet</span>' +
          '<button class="btn ghost" data-act="begin">Set up for my child →</button></header>' +
          '<main class="wrap" id="main">' + V.story(view.arg) + '</main>';
        return;
      }
      root.innerHTML = (view.name === 'onboard') ? '<div id="main">' + V.onboard() + '</div>' : V.landing();
      return;
    }
    bindChrome();
    var sk = shellKey();
    if (!$('[data-bz=header]') || sk !== lastShell) {
      var keep = $('#main') ? $('#main').innerHTML : '';
      root.innerHTML = chrome(); lastShell = sk;
      if (keep && $('#main')) $('#main').innerHTML = keep;
      /* the tabs say which screen they open, for the browser checks */
      Array.prototype.forEach.call(document.querySelectorAll('[data-bz=tab], [data-bz=tabbar] a'), function (a) {
        a.setAttribute('data-v', (a.getAttribute('href') || '').replace('#/', ''));
      });
    }
    /* The bar is built ONCE, so anything in it that depends on state has to be repainted
       on every render or it silently freezes at whatever it was when the app booted. The
       world emblem did exactly that: six different worlds, six screenshots, all showing
       the Taj. paintChrome() is not enough on its own -- it is called from a handful of
       toggle handlers, not from render(). */
    paintChrome();

    var m = $('#main'), h;
    /* a screen whose groups are not here yet says so, loads them, and paints */
    var miss = missingOf(needsOf(view.name));
    if (miss.length) {
      var v0 = view;
      m.innerHTML = '<div class="card loadcard" role="status"><span class="ldots" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '<b>Opening it…</b><span class="tiny muted">The first time takes a moment; after that it is on this device.</span></div>';
      lastLoad = window.IND_LOAD(miss).then(function () { if (view === v0) render(); },
        function () { if (view === v0) m.innerHTML = errorState('This part could not load. It may be the connection — once it has loaded once, it works offline.', v0.name, v0.arg); });
      return;
    }
    lastLoad = null;
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
      case 'cards': h = V.cards(); break;
      case 'dvandva': h = V.dvandva(); break;
      case 'ghar': h = V.ghar(); break;
      case 'people': h = V.people(); break;
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
      case 'paath':  h = V.paath(view.arg); break;
      case 'paathl': h = V.paathl(view.arg); break;
      case 'paathp': h = V.paathp(view.arg); break;
      case 'paathk': h = V.paathk(view.arg); break;
      case 'me': h = V.me(); break;
      case 'grown': h = V.grown(); break;
      case 'aaj': h = V.aaj(); break;
      /* the family layer (standard v2) */
      case 'collection': h = V.collection(); break;
      case 'shop': h = V.shop(view.arg); break;
      case 'medals': h = V.medalsPage(); break;
      case 'settings': h = V.settings(); break;
      case 'privacy': h = V.privacy(); break;
      case 'help': h = V.help(); break;
      case 'search': h = V.search(view.arg); break;
      case 'feed': h = V.feed(); break;
      default: h = V.home();
    }
    m.innerHTML = aajBar() + h + deckModal();
    /* Home's Continue is the one next step, played (narration and all), not just a link */
    if (view.name === 'home') { var cb = m.querySelector('[data-bz=continue]'); if (cb) cb.setAttribute('data-act', 'cont'); }
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
                  worlds: 'me', tongue: 'home', avcard: 'me',
                  /* the story shelves and Moral Science live inside Paathshala now (FIX-INDIA C1) */
                  /* a stop, a workshop and a take-home pack are all inside Paathshala */
                  paathl: 'paath', paathk: 'paath', paathp: 'paath' };
    var cur = alias[view.name] || view.name;
    if (cur === 'stories' || cur === 'neeti') cur = 'paath';
    if (cur === 'itihaas') cur = 'map';
    if (cur === 'mela' || cur === 'play') cur = 'khel';
    Array.prototype.forEach.call(document.querySelectorAll('.navtab'), function (t) {
      t.classList.toggle('active', t.getAttribute('data-v') === cur);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.navtab'), function (t) {
      if (t.classList.contains('active')) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    if (view.name === 'game') mountGame(view.arg);
    /* the PIN pad paints at once; the report behind it starts loading while the PIN is typed */
    if (view.name === 'grown' && !grownOpen && window.IND_LOAD) window.IND_LOAD(NEEDS.grown).catch(function () {});
    /* the reading passages (3.5 MB) follow a child INTO a language, never ahead of them: the
       engine reads the bank lazily at question time, so the path paints without waiting */
    if ((view.name === 'pack' || view.name === 'aaj') && window.IND_LOAD && !window.IND_HAS('passages'))
      window.IND_LOAD(['passages']).catch(function () {});
    tagScripts(m);
    musicNow();
    placeCallout();

    /* The tracing canvas (stage 7) owns window-level pointer listeners, so it
       gets the same care a game does: torn down on EVERY render — navigation
       included — and remounted only when a trace question is on screen. */
    if (traceOff) { try { traceOff(); } catch (err) {} traceOff = null; }
    /* the workshop's canvas, same contract: mounted after the paint, torn down first */
    if (karyaOff) { try { karyaOff(); } catch (err) {} karyaOff = null; }
    if (view.name === 'paathk' && window.IND_PAATH_UI && window.IND_PAATH_UI.mount)
      karyaOff = window.IND_PAATH_UI.mount(view.arg);
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
    var nav = $('[data-bz=tabbar]');
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
  var karyaOff = null;      /* the same, for the one the workshop mounts */
  function killGame() {
    if (!gameTeardown) return;
    try { if (typeof gameTeardown === 'function') gameTeardown(); else if (gameTeardown.destroy) gameTeardown.destroy(); } catch (e) {}
    gameTeardown = null;
  }
  function go(n, a) {
    /* A NEWER BUILD IS TAKEN AT THE NEXT DOOR. A tab left open served the build it was
       born with until somebody pressed the update bar — so a parent opened a course a day
       after it was rebuilt and saw the old one, twice. Changing screen is the safe moment:
       nobody is mid-sentence, and the screen they asked for is the one they land on. */
    if (view.name === 'grown' && n !== 'grown') { grownOpen = false; pinBuf = ''; pinFirst = null; }
    if (updateReady && n !== view.name) {
      try { sessionStorage.setItem('bi_resume', JSON.stringify({ n: n, a: a }));
            sessionStorage.setItem('bi_upd_to', updateReady); } catch (e) {}
      location.reload(); return;
    }
    /* a course walked is a thread Continue can pick up again (nextStep) */
    if (S.started && a && (n === 'paath' || n === 'paathl' || n === 'paathk')) {
      S.resume = S.resume || {};
      S.resume.paath = { id: String(a).split('|')[0], at: Date.now() }; save();
    }
    stopAudio(); killGame(); view = { name: n, arg: a }; render();
    /* HOME IS THE ROOT (FIX-INDIA §1: "repeated Back from Home landed on #/neeti"). Going
       Home does not push a new entry on top of the trail; it walks back to the root entry,
       so the trail behind Home is empty and Back from Home has nowhere else to go. */
    if (n === 'home' && depth > 1 && window.history && history.go) { homing = true; history.go(-(depth - 1)); return; }
    route(n !== 'home');
  }
  /* depth: how far this entry is from the root Home entry (1). 0 is the guard under it. */
  var depth = 1, homing = false;
  function rootTrail() {
    try {
      history.replaceState({ n: 'home', a: null, d: 0, guard: true }, '', '#/home');
      history.pushState({ n: 'home', a: null, d: 1 }, '', '#/home');
    } catch (e) {}
    depth = 1;
  }
  var updateReady = false, fromHive = false;
  /* ===================================================== ROUTES
     THE BACK BUTTON NEVER LEAVES THE APP (family standard §4). go() used to swap the
     view in memory and nothing else, so a phone's Back, or a browser's, went straight
     out of the app — from the map to about:blank, in the audit. Every screen now has a
     hash, #/<view>/<arg>, written as a history entry, and Back walks those entries.
     history.state carries the arg with its own type, so a number stays a number; the
     hash is only parsed for a link typed or shared from outside. */
  function hashOf(v) {
    return '#/' + v.name + (v.arg != null && v.arg !== '' ? '/' + encodeURIComponent(String(v.arg)) : '');
  }
  function route(push) {
    if (!S.started || !window.history || !history.pushState) return;
    var h = hashOf(view);
    if (push && location.hash === h) return;
    if (push) depth++;
    try { history[push ? 'pushState' : 'replaceState']({ n: view.name, a: view.arg, d: depth }, '', h); } catch (e) {}
  }
  var ROUTES = null;
  function known(n) {
    if (!ROUTES) {
      ROUTES = { home: 1 };
      (String(render).match(/case '([a-z0-9]+)'/g) || []).forEach(function (m) { ROUTES[m.slice(6, -1)] = 1; });
    }
    return !!ROUTES[n];
  }
  function parseHash(h) {
    var m = String(h || '').match(/^#\/([a-z0-9]+)(?:\/(.*))?$/i);
    if (!m) return null;
    var a = m[2] != null ? decodeURIComponent(m[2]) : null;
    return { n: m[1], a: a };
  }
  window.addEventListener('popstate', function (e) {
    /* the guard under the root: Back from Home stays on Home */
    if (e.state && e.state.guard) {
      if (!S.started) return;
      try { history.pushState({ n: 'home', a: null, d: 1 }, '', '#/home'); } catch (err) {}
      depth = 1; homing = false;
      if (view.name !== 'home') { stopAudio(); killGame(); view = { name: 'home', arg: null }; render(); }
      return;
    }
    if (e.state && e.state.d) depth = e.state.d;
    if (homing) { homing = false; if (view.name === 'home') return; }
    var fromState = !!(e.state && e.state.n);
    var r = fromState ? { n: e.state.n, a: e.state.a } : parseHash(location.hash);
    if (!r || !S.started) return;
    var cont = r.n === 'continue';
    if (cont && missingOf(['content', 'voice', 'map', 'bhasha', 'paath']).length) {
      window.IND_LOAD(['content', 'voice', 'map', 'bhasha', 'paath']).then(function () {
        window.dispatchEvent(new PopStateEvent('popstate', { state: e.state })); });
      return;
    }
    if (cont) r = continueTarget();     /* primed already: prepView would undo it */
    if (!known(r.n)) r = { n: 'home', a: null };
    if (!cont) prepView(r.n, r.a);
    stopAudio(); killGame(); view = { name: r.n, arg: r.a }; render();
    /* a link typed or followed (no state of its own) takes its proper name in history */
    if (!fromState) route(false);
  });
  /* a screen reached by Back, or by a link, gets the same setup its own button gives it */
  function prepView(n, a) {
    if (n === 'story' && !(view.name === 'story' && view.arg === a)) play = { story: null, i: 0, answered: false };
    if (n === 'pack' && !(view.name === 'pack' && view.arg === a)) quiz = quizReset(null);
  }
  /* #/continue — the Hive's door, and Continue's own: the one next thing. A story left
     part-way, then a language pack left part-way, then the story shelf. */
  function continueTarget() { var stp = nextStep(); primeStep(stp); return stp.go; }

  /* ======================================================== THE ONE NEXT STEP
     Home's Continue card and the Hive's #/continue are the same door, so they are the
     same function (family standard §2.3, §4): never two "next" lessons that disagree.

     Whatever the child was in the middle of most recently — a story left part-way, a
     course stop, a language lesson — and when nothing is open, tonight's story, which is
     the same story the landing page offers (one daily pick, one index). Every candidate
     reads its own record: the course frontier from paath.js, the Bhasha lesson from the
     SRS path, the story's scene from where the child stopped. Nothing here stores its
     own idea of progress. */
  /* ===================================================== WHAT EACH SCREEN NEEDS
     The corpus loads per route (loader.js; FIX-INDIA N2). A screen names the groups it
     draws from; anything not listed here waits for all of them, which is always safe. */
  var ALLG = ['content', 'voice', 'map', 'bhasha', 'passages', 'paath', 'games', 'packs'];
  var STORYG = ['content', 'voice'], MAPG = ['map', 'content', 'voice'], LANGG = ['bhasha', 'voice'];
  var NEEDS = {
    home: [], me: [], worlds: [], onboard: [],
    story: STORYG, stories: STORYG, kahani: STORYG, epics: STORYG, epic: STORYG, episode: STORYG,
    nani: STORYG, shelf: STORYG, invite: STORYG, shlok: STORYG, verses: STORYG,
    map: MAPG, state: MAPG, learn: MAPG, itihaas: MAPG, era: MAPG,
    bhasha: LANGG, pack: LANGG, chart: LANGG, vyakaran: LANGG, progress: LANGG, kosh: LANGG, wordcard: LANGG,
    tongue: LANGG, aaj: ['content', 'voice', 'bhasha'],
    paath: ['paath', 'content', 'voice', 'map', 'bhasha'], paathl: ['paath', 'content', 'voice', 'map', 'bhasha'],
    paathk: ['paath', 'content', 'voice', 'map', 'bhasha'], paathp: ['paath', 'content', 'voice', 'map', 'bhasha'],
    grown: ['paath', 'content', 'voice', 'map', 'bhasha', 'packs'],
    /* the family layer: the collection, the shop and settings draw only the shell */
    collection: [], shop: [], medals: [], settings: [], privacy: [], help: [],
    search: ['content', 'map', 'bhasha', 'paath'], avcard: [],
    feed: ['feed']
  };
  /* the PIN pad needs nothing; only the report behind it needs the record */
  function needsOf(n) { if (n === 'grown' && !grownOpen) return []; return NEEDS[n] || ALLG; }
  function missingOf(gs) { return window.IND_HAS ? gs.filter(function (g) { return !window.IND_HAS(g); }) : []; }
  /* run fn now if its groups are here, or once they are; the promise is for the test handle */
  function withGroups(gs, fn) {
    var miss = missingOf(gs);
    if (!miss.length) { fn(); return Promise.resolve(); }
    return window.IND_LOAD(miss).then(fn, function (e) { toast('That part of the app could not load — are you offline?'); });
  }
  function storyById(id) { return allStories().filter(function (x) { return x.id === id; })[0] || null; }
  function storyOfDay() {
    var st = allStories(), n = st.length;
    if (!n) return null;
    var at = (new Date().getDate() * 7) % n;
    for (var k = 0; k < n; k++) { var s = st[(at + k) % n]; if (!S.read[s.id]) return s; }
    return st[at];
  }
  function nPlaces_() { return nPlaces(); }
  function nPlaces() {
    return Object.keys((window.IND_MAP && window.IND_MAP.paths) || {}).length ||
      (window.IND_INDEX && window.IND_INDEX.places) || 36;
  }
  function nextStep() {
    var R = S.resume || {}, cands = [];
    if (R.story && R.story.id && !S.read[R.story.id]) {
      var so = storyById(R.story.id);
      if (so) {
        var si = Math.min(R.story.i || 0, so.scenes.length - 1);
        cands.push({ at: R.story.at || 0, kind: 'story', id: so.id, i: si,
          kick: 'Keep going · a story', title: so.title, sub: so.hook || '',
          art: storyArt(so.id), n: si, of: so.scenes.length,
          meter: 'Scene ' + (si + 1) + ' of ' + so.scenes.length,
          go: { n: 'story', a: so.id } });
      }
    }
    /* a course or a language thread whose engine has not loaded yet (loader.js) is drawn
       from the summary kept the last time it was computed; Continue recomputes it fresh */
    var cached = function (src, kind) {
      return src && src.step ? { at: src.at || 0, kind: kind, id: src.id, cached: true,
        kick: src.step.kick, title: src.step.title, sub: src.step.sub, art: src.step.art,
        n: src.step.n, of: src.step.of, meter: src.step.meter, go: src.step.go } : null;
    };
    var keep = function (src, c) {
      var sum = { kick: c.kick, title: c.title, sub: c.sub, art: c.art, n: c.n, of: c.of, meter: c.meter, go: c.go };
      if (JSON.stringify(src.step || null) !== JSON.stringify(sum)) { src.step = sum; save(); }
    };
    var U = R.paath && R.paath.id ? paathUI() : null;
    var pn = U && U.next ? U.next(R.paath.id) : null;
    if (pn) {
      var cp = { at: R.paath.at || 0, kind: 'paath', id: pn.id, pn: pn,
        kick: 'Paathshala · ' + pn.name, title: pn.label, sub: pn.part,
        art: pn.cover, n: pn.n, of: pn.of, meter: 'Stop ' + (pn.n + 1) + ' of ' + pn.of,
        go: pn.route };
      cands.push(cp); keep(R.paath, cp);
    } else if (R.paath && R.paath.id && !U && cached(R.paath, 'paath')) cands.push(cached(R.paath, 'paath'));
    if (R.pack && R.pack.id && !(window.IND_PACKS && window.IND_BHASHA) && cached(R.pack, 'bhasha'))
      cands.push(cached(R.pack, 'bhasha'));
    if (R.pack && R.pack.id && window.IND_PACKS && window.IND_PACKS[R.pack.id] && window.IND_BHASHA) {
      var pid = R.pack.id, pk = window.IND_PACKS[pid], path = bPath(pid), nx = bNext(path);
      var all = 0, dn = 0;
      path.forEach(function (r) { all += r.total; dn += r.done; });
      if (nx) cands.push(keepB({ at: R.pack.at || 0, kind: 'bhasha', id: pid, nx: nx,
        kick: 'Bhasha · ' + (pk.name ? pk.name.en : pid),
        title: nx.lesson ? nx.lesson.unit.title + ' · lesson ' + nx.lesson.n + ' of ' + nx.lesson.of
                         : 'Review ' + nx.rung.stage.name + ', until it sticks',
        sub: nx.lesson ? 'Four new things, each shown and heard before you are asked. About five minutes.'
                       : 'Nothing new — the words you have met, coming back until they stay.',
        art: 'art/banner/bhasha.jpg', n: dn, of: all || 1,
        meter: dn + ' of ' + all + ' lessons', go: { n: 'pack', a: pid } }));
    }
    function keepB(c) { keep(R.pack, c); return c; }
    if (cands.length) {
      cands.sort(function (a, b) { return (b.at || 0) - (a.at || 0); });
      return cands[0];
    }
    var sd = storyOfDay();
    if (!sd) return { kind: 'none', kick: 'Stories', title: 'The story shelf', sub: '', n: 0, of: 1,
                      meter: '', go: { n: 'stories', a: null } };
    var code = ((sd.place || [])[0] || '').replace('IN-', ''), lit = Object.keys(S.lit).length;
    return { kind: 'story', id: sd.id, i: 0, fresh: true,
      kick: (Object.keys(S.read).length ? 'Next on your journey' : 'Your first story') + ' · tonight’s story',
      title: sd.title, sub: sd.hook || '', art: storyArt(sd.id), n: lit, of: nPlaces(),
      meter: code && !S.lit[code] && stateName(code)
        ? 'Finish it and the mist lifts off ' + stateName(code)
        : lit + ' of ' + nPlaces() + ' places remembered',
      go: { n: 'story', a: sd.id } };
  }
  /* what a step needs set up before its screen paints: a story at the scene the child
     left, a course stop at its first card, a language lesson already under way */
  function primeStep(stp) {
    if (!stp) return;
    S.resume = S.resume || {};
    if (stp.kind === 'story') {
      S.resume.story = { id: stp.id, at: Date.now(), i: stp.i || 0 }; save();
      play = { story: null, i: 0, answered: false, from: { id: stp.id, i: stp.i || 0 } };
    } else if (stp.kind === 'paath' && stp.pn && stp.pn.prime) {
      stp.pn.prime();
    } else if (stp.kind === 'bhasha') {
      S.resume.pack = { id: stp.id, at: Date.now() }; save();
      quiz = quizReset(stp.id);
      if (stp.nx.lesson) startSession(stp.nx.lesson.stage.id, 'lesson', lessonRef(stp.nx.lesson));
      else startSession(stp.nx.rung.stage.id, 'lesson');
    }
  }
  /* the landing's "Read it": tonight's story, before any setup (FIX-INDIA A3) */
  function guestStory(gid) {
    var gs = storyById(gid);
    if (!gs) { view = { name: 'onboard' }; return render(); }
    S.resume = { story: { id: gid, at: Date.now(), i: 0 } };
    play = { story: null, i: 0, answered: false }; view = { name: 'story', arg: gid };
    render(); window.scrollTo(0, 0); sayScene(gs, 0);
  }
  /* the Continue button itself */
  function runStep() {
    var first = nextStep();
    return withGroups(needsOf(first.go.n), function () {
      var stp = nextStep();                 /* fresh, now that its engine is here */
      primeStep(stp);
      go(stp.go.n, stp.go.a);
      if (stp.kind === 'story') { var s = storyById(stp.id); if (s) sayScene(s, stp.i || 0); }
    });
  }

  /* the games that teach — every one scored on the learning decision (standard §10) */
  var TEACHES = ['statehunt', 'festival', 'jataka', 'gyanpati', 'triviamaster', 'shabd', 'sabhyata'];
  function mountGame(id) {
    var g = (window.IND_GAMES || []).filter(function (x) { return x.id === id; })[0], host = $('#gamehost');
    if (!g || !host) return;
    var frame = $('#gframe'), title = $('#gftitle'), fr = GAME_FRAME[g.id] || ['', ''];
    /* the how-to folds to a title row after three seconds (or the first tap on the board) */
    var fold = function () { if (title) { title.classList.add('folded'); title.setAttribute('aria-expanded', 'false'); } };
    var foldT = setTimeout(fold, 3000);
    host.addEventListener('pointerdown', fold, { once: true });
    /* sound and motion on every answer, and the finish says what was practised */
    /* MOTION ON EVERY ANSWER, AND A COUNT THAT ONLY GOES UP (FIX-INDIA G6): a right answer
       throws a little burst of sparks from the frame and adds to "N right this game" — a
       progress count, never a streak that a miss can take away. */
    var rights = 0;
    var burst = function (big) {
      if (!frame || dev.calm || dev.motion) return;
      var b = document.createElement('span'); b.className = 'gf-burst' + (big ? ' big' : ''); b.setAttribute('aria-hidden', 'true');
      b.innerHTML = new Array(big ? 19 : 9).join('<i></i>');
      frame.appendChild(b); setTimeout(function () { b.remove(); }, big ? 1400 : 800);
    };
    var pulse = function (ok) {
      if (window.IND_SFX) window.IND_SFX.play(ok ? 'right' : 'wrong');
      if (!frame) return;
      frame.classList.remove('gf-yes', 'gf-no'); void frame.offsetWidth;
      frame.classList.add(ok ? 'gf-yes' : 'gf-no');
      setTimeout(function () { frame.classList.remove('gf-yes', 'gf-no'); }, 650);
      if (ok) {
        rights++; burst(false);
        var rc = frame.querySelector('.gf-rights');
        if (!rc && title) { title.insertAdjacentHTML('beforeend', '<span class="gf-rights" aria-live="polite"></span>'); rc = frame.querySelector('.gf-rights'); }
        if (rc) rc.textContent = rights + ' right this game';
      }
    };
    /* THE FINISH: what was practised, the child's own face and the peacock cheering (J6, I4) */
    var ended = function (out) {
      if (window.IND_SFX) window.IND_SFX.play('finish');
      burst(true);
      var row = out.parentNode;
      if (fr[1] && row && row.parentNode && !row.parentNode.querySelector('.gf-practised'))
        row.insertAdjacentHTML('beforebegin', '<div class="gf-practised"><span class="gf-faces">' +
          '<span class="' + (S.frame ? 'framed fr-' + esc(S.frame) : '') + '">' + art(S.buddy, 56) + '</span>' + peacock('cheer', 56) + '</span>' +
          '<p><b>What you practised:</b> ' + esc(fr[1]) + (rights ? ' · ' + rights + ' right' : '') + '</p></div>');
    };
    var TOK_OK = /(^|\s)(good|is-right)(\s|$)/, TOK_NO = /(^|\s)(warm|is-warm)(\s|$)/;
    var obs = window.MutationObserver ? new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type === 'attributes') {
          var c = typeof m.target.className === 'string' ? m.target.className : '', was = m.oldValue || '';
          var fresh = c !== was || /feed/.test(c);
          if (fresh && TOK_OK.test(c) && !(TOK_OK.test(was) && !/feed/.test(c))) pulse(true);
          else if (fresh && TOK_NO.test(c) && !(TOK_NO.test(was) && !/feed/.test(c))) pulse(false);
        } else {
          for (var i = 0; i < m.addedNodes.length; i++) {
            var n = m.addedNodes[i];
            if (n.nodeType !== 1) continue;
            var out = (n.matches && n.matches('[data-go="out"]')) ? n : (n.querySelector && n.querySelector('[data-go="out"]'));
            if (out) ended(out);
          }
        }
      });
    }) : null;
    if (obs) obs.observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    var unframe = function () { clearTimeout(foldT); if (obs) obs.disconnect(); };
    try {
      var td = g.engine(host, { skin: (S.skin || {})[g.id] || null }, function (res) {
        res = res || {};
        /* ONLY A GAME THAT TEACHES PAYS, and it pays for finishing, not for winning
           (standard §1, §10). Ludo, Saap-Sidi, carrom and the street games are played for
           their own sake: no coins, because a dice roll is not something a child learned. */
        if (TEACHES.indexOf(g.id) >= 0) { earn('contest', g.name); markToday(); }
        lastDid('game', g.name, '', { id: g.id });
        setTimeout(function () { go('mela'); }, 900);
      });
      gameTeardown = function () {
        unframe();
        if (typeof td === 'function') td(); else if (td && td.destroy) td.destroy();
      };
    } catch (e) { unframe(); host.innerHTML = errorState('This game could not open. Try again in a moment.', 'game', id); }
  }

  /* =============================================================== DISPATCH */
  document.addEventListener('click', function (e) {
    /* THE SHELL'S LINKS ARE THE APP'S ROUTES. A tab, a drawer row or a home tile is an <a href="#/…">;
       taken here and through go(), so it keeps the trail Back walks (Home stays the root). */
    var ln = e.target.closest && e.target.closest('a[href^="#/"]');
    if (ln && !ln.hasAttribute('data-act') && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && S.started) {
      var hr = parseHash(ln.getAttribute('href'));
      if (hr && (known(hr.n) || hr.n === 'continue')) {
        e.preventDefault();
        if (hr.n === 'continue') { runStep(); return; }
        go(hr.n, hr.a == null ? undefined : hr.a); return;
      }
    }
    /* PAATHSHALA FIRST. Its controls carry data-pa rather than data-act so the course
       engine owns its own verbs and this dispatcher does not grow ten more branches.
       It returns true when it handled the click; everything else falls through. */
    /* THE WORKSHOP'S OWN CONTROLS, asked before those. karya.js answers for the keypad,
       the order list and the check buttons, and it never routes — it changes what is on
       the board and the host repaints. It goes first because a `data-ka` sitting inside
       a `data-pa` card would otherwise navigate away mid-keystroke. */
    var ka = e.target.closest('[data-ka]');
    if (ka && window.IND_KARYA && view.name === 'paathk') {
      var kp = karyaProject();
      if (kp && window.IND_KARYA.act(ka.getAttribute('data-ka'), ka, kp)) return render();
    }
    var pa = e.target.closest('[data-pa]');
    if (pa && window.IND_PAATH_UI &&
        window.IND_PAATH_UI.act(pa.getAttribute('data-pa'), pa)) return;
    var t = e.target.closest('[data-act]'); if (!t) return;
    if (t.tagName === 'A' && /^#/.test(t.getAttribute('href') || '')) e.preventDefault();
    var a = t.getAttribute('data-act');

    /* the ☰ drawer and the wallet close on anything chosen inside them — except the toggles,
       which repaint in place so a child can see what they changed */
    if ($('#walletsheet') && a !== 'wallet') closeWallet();
    var kmn = $('#kidmenu');
    if (kmn && a !== 'kidmenu') closeKidMenu();
    if (a === 'kidmenu') { if (kmn) closeKidMenu(); else openKidMenu(); return; }
    if (a === 'wallet') { openWallet(); return; }
    if (a === 'walletclose') { closeWallet(); return; }
    if (a === 'back') { if (depth > 1) history.back(); else go('home'); return; }
    /* settings (standard §5): each switch says its new state at once */
    if (a === 'setfx')     { setDev('fx', !dev.fx); if (dev.fx) sfx('tap'); return render(); }
    if (a === 'setmusic')  { setDev('music', !dev.music); musicNow(); return render(); }
    if (a === 'setread')   { setDev('read', !dev.read); if (!dev.read) stopAudio(); return render(); }
    if (a === 'setmotion') { setDev('motion', !dev.motion); return render(); }
    if (a === 'setcalm')   { setDev('calm', !dev.calm); musicNow(); return render(); }
    if (a === 'settext')   { setDev('text', t.getAttribute('data-v')); return render(); }
    if (a === 'settheme') {
      var tv = t.getAttribute('data-v'); setDev('theme', tv);
      night = tv === 'dark' || (tv === 'auto' && !!(mqDark && mqDark.matches));
      Store.saveDevice('night', night); paintChrome(); return render();
    }
    /* THE SHOP (standard §1, §8): every purchase goes through the family's engine and wallet */
    if (a === 'buyav') {
      var bid = t.getAttribute('data-id'), BE2 = window.IND_ECONOMY;
      if (!BE2 || !bid) return;
      var bst = BE2.stateOf(S, bid);
      if (bst.state !== 'buy') { toast(bst.say); return; }
      if (bst.short) { toast(bst.price + ' coins — ' + bst.short + ' more to go. Coins come from learning.'); return; }
      if (!BE2.buy(S, bid)) { toast('That did not go through — nothing was spent.'); return; }
      save(); paintChrome(); sfx('unlock');
      toast('You met ' + (avatarName(bid) || bid) + '!');
      return render();
    }
    if (a === 'buyextra' || a === 'useextra') {
      var xid = t.getAttribute('data-id'), XE = window.IND_ECONOMY;
      var xx = XE && XE.EXTRAS.filter(function (e2) { return e2.id === xid; })[0];
      if (!xx) return;
      if (a === 'buyextra') {
        if (!XE.canAfford(S, xx.price)) { toast(xx.name + ' is ' + xx.price + ' coins. You have ' + coins() + '.'); return; }
        if (!XE.buyExtra(S, xid)) return;
        sfx('coin'); toast(xx.name + ' is yours.');
      }
      if (XE.extraOwned(S, xid)) {
        var off = t.getAttribute('data-off') === '1';
        if (xx.kind === 'frame') S.frame = off ? null : xid;
        else { S.skin = S.skin || {}; S.skin[xx.game] = off ? null : xid; }
      }
      save(); paintChrome(); return render();
    }

    if (a === 'begin')  { view = { name: 'onboard' }; return render(); }
    if (a === 'cont')   return runStep();
    if (a === 'aajstep') {
      var AJ = aajState(); if (!AJ) return go('aaj');
      if (t.getAttribute('data-s') === '0' && AJ.story) {
        S.resume = S.resume || {}; S.resume.story = { id: AJ.story, at: Date.now(), i: 0 }; save();
        play = { story: null, i: 0, answered: false }; go('story', AJ.story);
        var ajs = storyById(AJ.story); if (ajs) sayScene(ajs, 0);
        return;
      }
      if (AJ.pack) {
        S.resume = S.resume || {}; S.resume.pack = { id: AJ.pack, at: Date.now() }; save();
        quiz = quizReset(AJ.pack);
        var ajl = AJ.lesson ? bLesson(bPath(AJ.pack), AJ.lesson) : null;
        if (ajl) startSession(ajl.stage.id, 'lesson', lessonRef(ajl));
        else if (AJ.review) startSession(AJ.review, 'lesson');
        return go('pack', AJ.pack);
      }
      return;
    }
    if (a === 'aajskip') { var AK = aajState(); if (AK) { AK.did.lesson = true; save(); } return render(); }
    if (a === 'aajpick') {
      var AP = aajState(); if (!AP || !AP.look || AP.look.picked != null) return;
      var aq = aajAsk(AP.look.ids[AP.look.i]); if (!aq) return;
      var ao = +t.getAttribute('data-o');
      AP.look.picked = ao;
      if (ao === aq.ask.answer) { AP.look.right++; earn('answer', 'remembered'); sfx('right'); } else sfx('wrong');
      save(); render();
      var nb = $('[data-act="aajnext"]'); if (nb) nb.focus({ preventScroll: true });
      return;
    }
    if (a === 'aajnext') {
      var AN = aajState(); if (!AN || !AN.look) return;
      AN.look.i++; AN.look.picked = null;
      if (AN.look.i >= AN.look.ids.length) {
        AN.did.look = true; AN.end = Date.now(); markToday(); sfx('win');
        lastDid('aaj', 'Aaj ka'); setTimeout(function () { checkMedals(); }, 900);
      }
      save(); return render();
    }
    if (a === 'celok')  { var cel = $('#celebrate'); if (cel) cel.remove(); setTimeout(showCelebration, 250); return; }
    if (a === 'gfhow')  { t.classList.toggle('folded'); t.setAttribute('aria-expanded', t.classList.contains('folded') ? 'false' : 'true'); return; }
    if (a === 'guest')  {
      return withGroups(STORYG, function () { guestStory(t.getAttribute('data-id')); });
    }
    if (a === 'aajgo')  { return withGroups(needsOf('aaj'), function () { if (!aajState()) aajStart(); go('aaj'); }); }

    /* data-arg is optional and was added for Paathshala, whose lessons link straight
       into a story, a verse or an era. Absent everywhere else, so undefined. */
    if (a === 'go')     return go(t.getAttribute('data-v'), t.getAttribute('data-arg') || undefined);
    /* the day's target is the family's to choose (Bee's goal picker) */
    if (a === 'growage') {
      if (!grownOpen) return go('grown');
      S.age = +t.getAttribute('data-v') || 8; S.mode = S.age <= 7 ? 'chhote' : 'bade'; save();
      toast('Age band set — the stories and the map follow it.');
      return render();
    }
    if (a === 'goalset') {
      if (!grownOpen) return go('grown');
      S.goal = +t.getAttribute('data-g') || 3; save();
      toast(S.goal + ' a day — a small habit beats a big plan.');
      return render();
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
    if (a === 'tstop')  {
      var tsv2 = t.getAttribute('data-id') || 'aaj';
      /* ONE TAP TRAVELS. It used to take two: the first popped the era's name
         and the words "tap again to travel", the second went there. Nobody
         reads an instruction inside the thing they just pressed — they press
         it, nothing appears to happen, and they conclude the map is broken.
         The dates the peek was carrying are written under every dot now, so
         the first tap had nothing left to say. */
      timeStop = tsv2; timePeek = null; timeSite = null; timeZone = null;
      go('map');
      return;
    }
    if (a === 'tzone')  {
      var tzv = t.getAttribute('data-i');
      timeZone = (timeZone === tzv || tzv === null) ? null : tzv;
      timeSite = null;
      return render();
    }
    if (a === 'mapmode') {
      mapMode = t.getAttribute('data-m') || 'rajya';
      bhugolFeat = null; bhugolState = null;
      return render();
    }
    if (a === 'btype') {
      var btv = t.getAttribute('data-t') || 'all';
      bhugolType = (bhugolType === btv) ? 'all' : btv;
      bhugolFeat = null;
      return render();
    }
    if (a === 'bstate') {
      bhugolState = t.getAttribute('data-id') || null;
      bhugolFeat = null; bhugolType = 'all';
      window.scrollTo(0, 0);
      return render();
    }
    if (a === 'bfeat') {
      var bfv = t.getAttribute('data-id');
      bhugolFeat = (bhugolFeat === bfv || !bfv) ? null : bfv;
      return render();
    }
    if (a === 'tsite')  {
      var tsv = t.getAttribute('data-id');
      timeSite = (timeSite === tsv || !tsv) ? null : tsv;
      return render();   /* the card floats fixed over the app — no scroll dance */
    }
    if (a === 'rishquiz') {
      if (t.getAttribute('data-reset') || rish.i >= window.IND_RISHTEY.tree.length) rish = { i: 0, picked: null, right: 0 };
      return go('rishquiz');
    }
    if (a === 'rishpick') {
      var pick = t.getAttribute('data-id');
      rish.picked = pick;
      if (pick === window.IND_RISHTEY.tree[rish.i].answer) { rish.right++; earn('answer', 'rishtey'); }
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
          earn('stop', 'an episode'); markToday();
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
      /* said aloud is the child's own word, not evidence — kept, never paid */
      if (!S.recited[vid]) { S.recited[vid] = today(); save(); toast('Said aloud — kept on your shelf'); }
      toast('Say it out loud, twice. That is how it sticks.');
      return;
    }
    /* the deck's own actions. A card pays sikke ONCE and only for reading it
       through; the mala is untouched, because a bead has always meant a thing
       done and that rule is older than this screen. */
    if (a === 'cards') { go('cards'); return; }
    if (a === 'carddone') {
      var cid = t.getAttribute('data-id'), NSc = neetiState();
      if (!NSc.cards[cid]) { NSc.cards[cid] = today(); save(); toast('The card is yours to keep'); }
      render(); return;
    }
    if (a === 'dvpick') {
      var dvid = t.getAttribute('data-id'), NSd = neetiState();
      NSd.dv[dvid] = +t.getAttribute('data-i'); save(); render(); return;
    }
    if (a === 'gharpick') {
      var gv = t.getAttribute('data-v'), NSg = neetiState();
      var first = NSg.ghar[gv] == null;
      NSg.ghar[gv] = +t.getAttribute('data-i'); save();
      if (first) toast('Asked at home — that is the best kind of lesson');
      render(); return;
    }
    if (a === 'deed') {
      var vid = t.getAttribute('data-id');
      S.mala = S.mala || [];
      S.mala.push({ v: vid, on: today() });
      save(); markToday();   /* the deed fills the day's ring — and pays nothing: it is the child's own word */
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
      return withGroups(STORYG, function () {
        S.resume = S.resume || {}; S.resume.story = { id: id, at: Date.now() }; save();
        play = { story: null, i: 0, answered: false }; go('story', id);
        var s = allStories().filter(function (x) { return x.id === id; })[0];
        if (s) sayScene(s, 0);
      });
    }
    if (a === 'next') {
      play.i++; play.answered = false;
      var st = play.story;
      if (st && S.resume && S.resume.story && S.resume.story.id === st.id) S.resume.story.i = play.i;
      if (st && play.i >= st.scenes.length) {
        if (!S.read[st.id]) {
          S.read[st.id] = true;
          var c = (st.place || [])[0]; if (c) lightState(c.replace('IN-', ''));
          earn('stop', 'story finished'); markToday();
          lastDid('story', st.title, c ? stateName(c.replace('IN-', '')) : '', { id: st.id, place: c ? c.replace('IN-', '') : '', coll: st.collection });
          milestone('stop', st.title);
          sfx('win');
          setTimeout(function () { checkMedals(); }, 900);
        }
        save();
      } else if (st) { sayScene(st, play.i); save(); }
      return render();
    }
    if (a === 'answer') {
      var ask = play.story.scenes[play.i].ask, i = +t.getAttribute('data-i');
      play.answered = (i === ask.answer) ? ask.right : ask.wrong;
      sfx(i === ask.answer ? 'right' : 'wrong');
      if (i === ask.answer) earn('answer', 'good thinking');
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
      return withGroups(STORYG, function () {
        play = { story: null, i: 0, answered: false };
        go('story', aid); sayScene(allStories().filter(function (x) { return x.id === aid; })[0], 0);
      });
    }
    if (a === 'love') {
      S.favs = S.favs || {};
      var lid = t.getAttribute('data-id');
      if (S.favs[lid]) { delete S.favs[lid]; } else { S.favs[lid] = today(); toast('Kept. It will be waiting.'); }
      save(); return render();
    }
    if (a === 'say')    return withGroups(['voice'], function () {
                          speak(t.getAttribute('data-k'), t.getAttribute('data-t'), t.getAttribute('data-l')); });
    /* a face you travel with is a face you have (standard §8) */
    if (a === 'pick')   {
      var pid = t.getAttribute('data-id');
      if (view.name !== 'onboard' && window.IND_ECONOMY && !window.IND_ECONOMY.avatarOpen(S, pid)) { toast(window.IND_ECONOMY.stateOf(S, pid).say); return; }
      S.buddy = pid; save(); paintChrome(); return render();
    }

    /* ---------------------------------------------------------------- onboarding
       One handler per question, and every one of them ADVANCES. A step that answers
       itself and then waits for a Next button is a form with extra taps in it.
       `obKeep` exists because picking anything re-renders the screen, and the first
       version of this flow lost the typed name the moment a chip was touched. */
    if (a === 'obnext') {
      obKeep();
      if (obSteps()[ob.step] === 'name' && !ob.name) { toast('Type a name first'); return; }
      /* two children of one name would share one purse: the family wallet and the Hive's
         feed are kept by first name, in every Bizzing app */
      if (obSteps()[ob.step] === 'name' && Store.kids().some(function (k) {
            return !k.active && k.name && k.name.trim().toLowerCase() === String(ob.name).trim().toLowerCase(); })) {
        toast('Another child here is already called ' + ob.name + ' — add an initial, like “' + ob.name + ' R”');
        return;
      }
      ob.step++; return render();
    }
    if (a === 'obback') { obKeep(); if (ob.step) ob.step--; return render(); }
    if (a === 'obage')  { ob.age = +t.getAttribute('data-v'); ob.step++; return render(); }
    if (a === 'obplace') {
      var pv = String(t.getAttribute('data-v')).split(':');
      ob.place[pv[0]] = pv[1];
      /* "not really" is a complete answer; "yes" asks one more thing in place */
      if (pv[0] === 'back' || (pv[0] === 'home' && pv[1] !== 'yes')) ob.step++;
      return render();
    }
    if (a === 'obbuddy') { ob.buddy = t.getAttribute('data-id'); S.buddy = ob.buddy;
                           save(); ob.step++; return render(); }
    if (a === 'obworld') { ob.world = t.getAttribute('data-w'); S.world = ob.world;
                           save(); return render(); }

    if (a === 'settongue') {
      obKeep();
      S.tongue = t.getAttribute('data-id') || null; save();
      var tg = tongue();
      toast(tg ? tg.en + ' it is — ask ' + kinTerm('nani') + '.' : 'All of India, evenly.');
      /* the topbar chip shows the tongue, and chrome() is cached — rebuild it */
      /* during onboarding this IS the answer to the question on screen, so it moves on.
         Naming a language adds the placement step behind it — obSteps() recomputes. */
      if (view.name === 'onboard' && obSteps()[ob.step] === 'tongue') ob.step++;
      return render();
    }
    /* BUYING A WORLD. One place that spends, so no view can go negative, and the
       purchase is permanent — a world you paid for never re-locks. */
    if (a === 'buyworld') {
      var bw = t.getAttribute('data-w');
      var BE = window.IND_ECONOMY;
      if (!BE) return;
      var bp = BE.worldPrice(bw);
      if (!BE.canAfford(S, bp)) { toast(BE.worldSay(S, bw) + '.'); return; }
      if (!BE.buyWorld(S, bw)) return;
      S.world = bw; save(); paintChrome(); sfx('unlock');
      var BW = (window.IND_WORLDS && window.IND_WORLDS.get(bw)) || null;
      toast('Opened ' + (BW ? BW.name : bw) + ' — it is yours for good.');
      if (window.IND_WORLDS_ART && window.IND_WORLDS_ART.refresh) window.IND_WORLDS_ART.refresh();
      musicNow();
      return render();
    }

    /* an old "meet" button (a cached page) does what the Shop's button does */
    if (a === 'meet') { t.setAttribute('data-act', 'buyav'); t.click(); return; }

    /* DEVELOPER UNLOCK — for testing. Device-scoped and profile-scoped both, loud on
       screen while it is on, and it never touches a paid entitlement: it opens the
       sikke economy only. */
    if (a === 'qnext') {
      if (!quiz.hold) return;
      quiz.hold = false; quiz.pi++; planStep(); return render();
    }
    if (a === 'pin')       { pinKey(t.getAttribute('data-d')); return; }
    if (a === 'pinback')   { pinBuf = pinBuf.slice(0, -1); return render(); }
    if (a === 'grownlock') { grownOpen = false; return go('me'); }
    if (a === 'backup') {
      try {
        var blob = new Blob([JSON.stringify(Store.backup(), null, 1)], { type: 'application/json' });
        var url = URL.createObjectURL(blob), lnk = document.createElement('a');
        lnk.href = url; lnk.download = 'bizzing-india-backup-' + today() + '.json';
        document.body.appendChild(lnk); lnk.click(); lnk.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        toast('Backup saved');
      } catch (e) { toast('This browser could not save the file'); }
      return;
    }
    if (a === 'devmode') {
      if (!tester()) return;
      S.dev = !S.dev; save();
      toast(S.dev ? 'Developer unlock ON — everything is open.' : 'Developer unlock off.');
      return render();
    }

    if (a === 'vyakaran') return go('vyakaran', t.getAttribute('data-id'));
    if (a === 'progress') return go('progress', t.getAttribute('data-id'));

    if (a === 'world')  {
      if (window.IND_ECONOMY && !window.IND_ECONOMY.worldOpen(S, t.getAttribute('data-w'))) return;
      S.world = t.getAttribute('data-w'); save(); musicNow();
      var W = (window.IND_WORLDS && window.IND_WORLDS.get(S.world)) || null;
      toast(W ? W.name + ' — ' + W.region : 'World: ' + S.world);
      /* the ambient layer watches data-world itself, but nudge it so a world
         picked from a page that does not re-render the topbar still swaps */
      if (window.IND_WORLDS_ART && window.IND_WORLDS_ART.refresh) window.IND_WORLDS_ART.refresh();
      return render();
    }
    if (a === 'start')  {
      obKeep();
      S.name = ob.name || 'Yatri';
      S.age = ob.age || 8;
      S.mode = S.age <= 7 ? 'chhote' : 'bade';
      S.goal = S.age <= 7 ? 2 : 3;
      /* the placement answers travel with the profile; ensureLang() reads
         them the first time each pack is opened (Phase 2, docs/09 §3) */
      if (ob.place.home) S.placement = { home: ob.place.home, back: ob.place.back,
                                         lang: S.tongue || null };
      S.started = today(); S.grown = S.grown || { m: 0, l: 0 }; S.medals = S.medals || {}; save();
      var hh = Store.house(); if (hh.adding) { hh.adding = null; Store.saveHouse(hh); }
      startActivity();
      view = { name: 'home', arg: null }; render();
      if (window.history && history.replaceState) rootTrail();
      return;
    }
    if (a === 'addcancel') { Store.removeKid(); location.reload(); return; }
    /* SWITCHING CHILD reloads the page: nothing in memory — a story half told, a quiz, a
       course's record, a Sabhyata city — can carry one child's state into another's */
    if (a === 'switchkid') {
      var kid = t.getAttribute('data-id');
      if (kid && kid !== Store.house().active && Store.switchKid(kid)) {
        try { sessionStorage.removeItem('bi_resume'); } catch (e) {}
        location.hash = '#/home'; location.reload();
      }
      return;
    }
    if (a === 'addkid') {
      if (!grownOpen) return go('grown');
      Store.addKid(); location.hash = ''; location.reload(); return;
    }
    if (a === 'sound')  { soundOn = !soundOn; Store.saveDevice('sound', soundOn); if (!soundOn) stopAudio(); applyLook(); musicNow(); toast(soundOn ? 'Sound on' : 'Muted'); paintChrome(); return render(); }
    if (a === 'night')  { night = !night; Store.saveDevice('night', night); setDev('theme', night ? 'dark' : 'light'); toast(night ? 'Night' : 'Day'); paintChrome(); return render(); }
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
    if (a === 'reset')  {
      if (view.name !== 'grown' || !grownOpen) return;     /* only from behind the PIN */
      if (confirm('Remove ' + (S.name || 'this child') + ' and everything they have done from this device? ' +
                  'Save a backup first if you might want it.')) {
        Store.erase(); location.hash = ''; location.reload();
      }
      return;
    }

    /* ---- Take it offline / Pass / diagnostics (the Grown-ups' plumbing) ---- */
    if (a === 'dl') {
      var did = t.getAttribute('data-id');
      if (window.IND_ENT && !window.IND_ENT.canDownload(did)) {
        toast('That pack opens with the family plan, which comes with the family account — still being built.');
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
    if (a === 'passtester') {
      if (!tester() || !window.IND_ENT) return;
      window.IND_ENT.testerPlan(!window.IND_ENT.hasPass());
      return render();
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
    if (a === 'feedans') {
      var fid = t.getAttribute('data-id'); feedAnswer(fid, +t.getAttribute('data-o')); render();
      var fc = document.querySelector('.fd-card[data-fid="' + fid + '"]'); if (fc) fc.focus({ preventScroll: true });
      return;
    }
    if (a === 'feedcont') {
      var fid2 = t.getAttribute('data-id'); feedPlay[fid2] = { st: 'shown', o: (feedPlay[fid2] || {}).o }; render();
      var fc2 = document.querySelector('.fd-card[data-fid="' + fid2 + '"]'); if (fc2) fc2.focus({ preventScroll: true });
      return;
    }
    if (a === 'feedtoggle') { S.feedOff = !S.feedOff; save(); toast(S.feedOff ? 'My Feed is off' : 'My Feed is on'); return render(); }
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
    /* a lesson off the path: its rung, narrowed to its own four things */
    if (a === 'blesson') {
      var bl = bLesson(bPath(quiz.packId), t.getAttribute('data-l'));
      if (!bl) return;
      startSession(bl.stage.id, 'lesson', lessonRef(bl));
      return render();
    }
    /* open or close a unit on the path; a unit in another rung opens that rung too */
    if (a === 'bunit') {
      var bu = t.getAttribute('data-u');
      quiz.openUnit = quiz.openUnit === bu ? '__none' : bu;
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
    if (a === 'bclose')   { quiz.over = false; quiz.lesson = null; return render(); }
    if (a === 'totstart') {
      startSession(t.getAttribute('data-s'), 'testout');
      return render();
    }
    /* choice questions: tap an option */
    if (a === 'slipped') {
      var sk = String(t.getAttribute('data-k') || '').split('|').filter(Boolean);
      if (!sk.length) return;
      quiz = quizReset(view.arg); startSession(t.getAttribute('data-s'), 'slipped', null, sk);
      return render();
    }
    if (a === 'cert') {
      if (view.name !== 'grown' || !grownOpen) return;
      makeCert(t.getAttribute('data-id')).then(function (r) {
        if (!r || !r.blob) { toast('This browser could not draw the certificate'); return; }
        var file = null;
        try { file = new File([r.blob], r.name, { type: 'image/png' }); } catch (e) {}
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: 'A Bizzing India certificate' }).catch(function () {});
          return;
        }
        var url = URL.createObjectURL(r.blob), lnk = document.createElement('a');
        lnk.href = url; lnk.download = r.name; document.body.appendChild(lnk); lnk.click(); lnk.remove();
        window.IND_LAST_CERT = r.name;
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        toast('Certificate saved');
      });
      return;
    }
    if (a === 'qhint') {
      var hq = quiz.q;
      if (!hq || quiz.lock || quiz.hint != null || typeof hq.answerIndex !== 'number') return;
      var wrongs = (hq.options || []).map(function (_, i) { return i; }).filter(function (i) { return i !== hq.answerIndex; });
      if (!wrongs.length) return;
      /* the same wrong choice every time for the same question: nothing random */
      quiz.hint = wrongs[(quiz.pi + quiz.done) % wrongs.length];
      return render();
    }
    if (a === 'ans') {
      var q = quiz.q, idx = +t.getAttribute('data-i');
      if (t.getAttribute('data-gone') === '1') return;
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
        settle(ok, 2400);
      } else settle(ok, 1100);
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

  /* the onboarding name box, mirrored as it is typed — see obKeep() */
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'nm') ob.name = e.target.value.trim();
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
    /* Esc closes the city telling card over the map — every dialog needs a
       keyboard way out */
    if (e.key === 'Escape' && (timeSite || bhugolFeat || bhugolState) && view.name === 'map') {
      if (timeSite || bhugolFeat) { timeSite = null; bhugolFeat = null; }
      else bhugolState = null;
      render(); return;
    }
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
    /* My Feed: j / k or the arrows step card to card; focus is the card, so it is always visible */
    if (view.name === 'feed' && /^(j|k|ArrowDown|ArrowUp)$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '')) {
      var cards = [].slice.call(document.querySelectorAll('.fd-card'));
      if (cards.length) {
        e.preventDefault();
        var cur = document.activeElement && document.activeElement.closest ? document.activeElement.closest('.fd-card') : null;
        var at = cards.indexOf(cur), dn = e.key === 'j' || e.key === 'ArrowDown';
        var nx = cards[at < 0 ? 0 : Math.max(0, Math.min(cards.length - 1, at + (dn ? 1 : -1)))];
        nx.focus({ preventScroll: true }); nx.scrollIntoView({ block: 'center', behavior: 'auto' });
        return;
      }
    }
    if (e.key === 'Escape' && $('#celebrate')) { $('#celebrate').remove(); setTimeout(showCelebration, 250); return; }
    if (e.key === 'Escape' && $('#kidmenu')) { closeKidMenu(); var kb = $('[data-bz=kid]'); if (kb) kb.focus(); return; }
    if (e.key === 'Escape' && document.querySelector('[data-bz=drawer]:not([hidden])')) return;   /* the shell closes its own drawer */
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

  /* BOOT WAITS ONLY FOR WHAT THE FIRST SCREEN NEEDS (FIX-INDIA N2). Home needs nothing
     beyond the shell; a link into a story needs the stories; the Hive's #/continue needs
     whatever the next thing turns out to be; the demo is built from the real corpus, so it
     waits for all of it. Then the rest is warmed in the background. */
  document.addEventListener('DOMContentLoaded', function () {
    var first = [];
    if (window.IND_DEMO) first = ALLG;
    else {
      var rs0 = null, hr0 = parseHash(location.hash);
      try { rs0 = JSON.parse(sessionStorage.getItem('bi_resume') || 'null'); } catch (e) {}
      var n0 = (rs0 && rs0.n) || (hr0 && S.started && hr0.n) || (S.started ? 'home' : 'landing');
      first = n0 === 'continue' ? ['content', 'voice', 'map', 'bhasha', 'paath'] : (n0 === 'landing' ? [] : needsOf(n0));
    }
    var go1 = function () {
      boot();
      if (window.IND_WARM) window.IND_WARM(S.started ? ['content', 'voice', 'map', 'bhasha', 'paath', 'games', 'packs']
                                                     : ['content', 'voice'], 1500);
    };
    var miss0 = missingOf(first);
    if (miss0.length) window.IND_LOAD(miss0).then(go1, go1); else go1();
  });
  function boot() {
    /* the sample child is built from the real corpus, now that it is here */
    if (window.IND_DEMO) { S = seedDemo(); lightStories = null; }
    moveOldCoins();
    healWorld();
    startActivity();
    /* the sample child's shelf is already earned: nothing to celebrate on a demo's first screen */
    if (window.IND_DEMO && !S.medals) {
      var de = evidence(); S.medals = {};
      MEDALS.forEach(function (m) { if (m.ok(de)) S.medals[m.id] = S.started; }); save();
    }
    /* a child just added by a grown-up goes straight to their own setup, not the landing */
    if (!S.started && Store.house().adding === Store.house().active) view = { name: 'onboard' };
    /* back to the screen that was asked for when the update was taken */
    var resumed = false;
    try {
      var rs = JSON.parse(sessionStorage.getItem('bi_resume') || 'null');
      sessionStorage.removeItem('bi_resume');
      if (rs && rs.n && known(rs.n)) { view = { name: rs.n, arg: rs.a }; resumed = true; }
    } catch (e) {}
    /* or to the screen the link names: a shared #/state/KL, the Hive's #/continue */
    if (!resumed && S.started) {
      var hr = parseHash(location.hash);
      var hc = hr && hr.n === 'continue';
      if (hc) hr = continueTarget();
      if (hr && known(hr.n)) { if (!hc) prepView(hr.n, hr.a); view = { name: hr.n, arg: hr.a }; }
    }
    /* THE TRAIL STARTS AT HOME, with a guard under it: Back from the first screen of a visit
       lands on Home, and Back from Home stays on Home (FIX-INDIA §1; standard §4). The way
       out of the app is the ⬡ Hive button, or "← my day" when the Hive opened it. */
    if (S.started && window.history && history.replaceState) {
      rootTrail();
      if (view.name !== 'home') route(true);
    } else route(false);
    /* TESTER MODE is a device setting, switched by ?tester=1 / ?tester=0, never a button in
       front of a child; and without it the developer unlock is simply off */
    var tm = location.search.match(/[?&]tester=([01])/);
    if (tm) Store.saveDevice('tester', tm[1] === '1');
    if (S.dev && !tester()) { S.dev = false; save(); }
    /* restoring a backup: the file is read here, checked, and written through the seam */
    document.addEventListener('change', function (e) {
      if (!e.target || e.target.id !== 'restorefile' || !grownOpen) return;
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        var o = null;
        try { o = JSON.parse(rd.result); } catch (err) { o = null; }
        if (!o || typeof o !== 'object' || !(o.kind === 'bizzing-india-household' || 'started' in o)) {
          toast('That file is not a Bizzing India backup'); return; }
        if (!confirm('Replace everything on this device with this backup?')) return;
        if (Store.restore(o)) location.reload(); else toast('That backup could not be read');
      };
      rd.readAsText(f);
    });
    /* a held wrong answer moves on from the keyboard as well as by touch */
    document.addEventListener('keydown', function (e) {
      if (view.name !== 'pack' || !quiz.hold) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        if (document.activeElement && document.activeElement.getAttribute('data-act') === 'qnext' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        var qb = document.querySelector('[data-act="qnext"]'); if (qb) qb.click();
      }
    });
    /* the PIN from a keyboard as well as by touch (house rule) */
    document.addEventListener('keydown', function (e) {
      if (view.name !== 'grown' || grownOpen) return;
      if (/^[0-9]$/.test(e.key)) { e.preventDefault(); pinKey(e.key); }
      else if (e.key === 'Backspace') { e.preventDefault(); pinBuf = pinBuf.slice(0, -1); render(); }
    });
    /* ?from=hive: the way back to the family's day */
    if (/[?&]from=hive\b/.test(location.search)) fromHive = true;
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
    function checkUpdate() {
      /* opened from a file there is no server to have a newer build, and asking is an error */
      if (updateOffered || !window.fetch || location.protocol === 'file:') return;
      fetch('build.js?live=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.text(); })
        .then(function (t) {
          var m = t.match(/IND_BUILD\s*=\s*'([^']+)'/);
          if (!m || !window.IND_BUILD || m[1] === window.IND_BUILD) return;
          updateOffered = true;
          /* ONE automatic try per build. GitHub Pages caches for ten minutes, so a reload
             can come back as the same old build — and without this, every door for those
             ten minutes would reload the page again. After one try, the bar is the way. */
          var tried = null; try { tried = sessionStorage.getItem('bi_upd_to'); } catch (e) {}
          if (tried !== m[1]) updateReady = m[1];
          var bar = document.createElement('button');
          bar.className = 'updatebar';
          bar.textContent = 'A newer Bizzing India is ready — tap to load it';
          bar.addEventListener('click', function () { location.reload(); });
          document.body.appendChild(bar);
        }).catch(function () { /* offline is fine; the app is offline-first */ });
    }
    /* soon after opening, every few minutes, and — the case that bit — the moment a tab
       left open overnight is looked at again */
    setTimeout(checkUpdate, 20 * 1000);
    setInterval(checkUpdate, 3 * 60 * 1000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) checkUpdate(); });

    window.BI = { go: function (n, a) { go(n, a); return lastLoad || Promise.resolve(); }, soundOn: function () { return soundOn; }, render: render, Store: Store,
                  ready: function () { return lastLoad || Promise.resolve(); },
                  /* test handles for tools/check-rewards.js: the real functions, not copies */
                  earn: earn, mastered: mastered, level: level, coins: coins, goodDays: goodDays,
                  /* tools/check-motivation.js: the frame every game gets, and the medals' rules */
                  gameFrame: GAME_FRAME, medals: MEDALS, evidence: evidence,
                  allStories: allStories, epics: epics,
                  storyThemes: function () { return STORY_THEMES.map(function (t) { return t.id; }); },
                  /* read-only view of the live quiz for tools/verify.js's
                     no-dead-ends walk — a getter because `quiz` is reassigned */
                  quizState: function () { return quiz; } };
    Object.defineProperty(window.BI, 'S', { get: function () { return S; } });

    /* ---- THE CHARACTER SEAMS the games hang from ----
       IND_ART_SRC: the arcade has asked for this since its first commit and it
       was never defined — every buddy face silently fell back to an initial
       disc. It answers with the PNG url when one exists.
       IND_BUDDY_TIER: the piece rule (docs/05, the companion framework) —
       FICTIONAL tales-shelf characters may be IN a child's hands as game
       pieces; SACRED figures and REAL people stay AT their side: companions,
       witnesses, darshans — never tokens. Games ask this one question.
       ind-reward: games grant sikke mid-run through one event, so the economy
       stays in the shell — capped, and never negative. */
    window.IND_ART_SRC = function (id) {
      if (window.IND_AV_WEBP && window.IND_AV_WEBP.indexOf(id) >= 0) return 'art/av/' + id + '.webp';
      return (window.IND_ART_IMG && window.IND_ART_IMG.indexOf(id) >= 0) ? 'art/' + id + '.png' : '';
    };
    window.IND_BUDDY_TIER = function (id) {
      /* archived avatars keep their shelf: a sacred figure never becomes a
         game piece just because the picker stopped offering them */
      var P = window.IND_AVATAR_PACKS || [];
      for (var i = 0; i < P.length; i++)
        if ((P[i].ids || []).concat(P[i].arch || []).indexOf(id) >= 0) return P[i].shelf || 'tales';
      return 'tales';
    };
    /* when the engines that hold mastery arrive, measure it: a child upgrading to this build
       has no cached rank yet, and Home should not show them a lower one than they have */
    var measured = false;
    window.addEventListener('ind-group', function () {
      if (measured || !S.started || !window.IND_HAS('bhasha') || !window.IND_HAS('paath')) return;
      measured = true;
      var before = level();
      checkGrowth(true);
      if (view.name === 'home' && (level() !== before || !(S.resume && (S.resume.paath || {}).step))) render();
    });
    window.addEventListener('ind-reward', function (e) {
      var d = (e && e.detail) || {};
      var n = Math.round(+d.n || 0);
      /* a game's mid-run reward is one right answer's worth, whatever it asked for */
      if (n > 0) { earn('answer', d.why || 'well played'); markToday(); }
    });
  }
})();
