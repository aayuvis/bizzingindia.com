/* Bizzing India — Karya: doing the project in the app.
   ==================================================================================
   कार्य — the work. A Paathshala project used to be a paragraph and a button that said
   "I made it", and that button was the whole assessment: a child could tap it on the
   welcome screen of a course they had never opened. A brief nobody can do in the app and
   nobody can check is a homework sheet with a tick box, and this app already has a rule
   about what may say a child learned something.

   So a project has TWO HALVES now, and they are different kinds of thing:

     THE WORKSHOP — done here, with a real tool, and MARKED BY THE APP.
     THE PAPER    — done away from the screen, kept, and NEVER marked by anything.

   ==================================================================================
   HOW A SUBMISSION IS CHECKED WITH NO AI BEHIND IT
   ==================================================================================
   This is the question the whole file answers, and the answer is to stop asking one
   question and start asking two.

   1. WHAT A COMPUTER CAN ACTUALLY CHECK, it checks completely and counts.
      A typed word against a word the course holds. A traced letter against the glyph's
      own ink (likhna.js has measured coverage and spill since stage 7). Nine things in
      the right order. A pair matched to its pair. None of this needs a model; it needs
      the answer, and a course that cites its corpus already has the answer.

   2. WHAT IT CANNOT CHECK, IT DOES NOT PRETEND TO.
      Nobody can mark a photograph of a child's handwriting without a model, and nothing
      here is going to send a child's handwriting anywhere — CLAUDE.md: no child photo,
      no free text off the device, no behavioural tracking, ever. So the paper half is
      KEPT, not scored: it goes on the shelf, the grown-up's page lists it, and the
      mastery record never hears about it. `ledger()` in paath.js stays the only door,
      and nothing in this file knocks on it.

   3. THE INTERESTING MIDDLE — an answer only the child knows.
      "Write your own name in Devanagari" has no answer this app holds, and it is the
      single most-wanted thing in the course. It is still checkable, just not for the
      thing you would first reach for: the app cannot know whether आयुष is spelled right,
      but it can know whether it is WELL-FORMED DEVANAGARI — every vowel sign hung on a
      consonant, every virama between two letters, no mark floating on nothing. That is
      the abugida model stage 2 teaches, it is the mistake a beginner actually makes, and
      it is exactly what a script rule can decide. The screen says which of the two it
      checked, in those words, because a child told "correct!" about their own name by a
      program that does not know their name has been lied to.

   ==================================================================================
   The keypad is THIS SCRIPT'S OWN consonants and matras, never a system IME — the same
   decision, and the same reason, as the produce exercise in the Bhasha engine: a system
   keyboard hides the structure the course is trying to teach.
*/
(function (W, D) {
  'use strict';

  var api = {};
  var esc = function (x) { return api.esc ? api.esc(x) : String(x); };

  /* ------------------------------------------------------------------ the tasks */
  /* A project carries `task` when there is something to do in the app. No task is a
     perfectly good project — a letter hunt round the kitchen is not a screen — and the
     course page renders that as paper only, rather than inventing a screen for it. */
  function has(p) { return !!(p && p.task && KIND[p.task.k]); }

  var KIND = {
    write:    1,    /* type a word the course holds — the app has the answer */
    writeOwn: 1,    /* type something only you know — the app checks the SCRIPT */
    trace:    1,    /* form the letter, measured against its own ink */
    order:    1     /* put them in the right order */
  };

  /* ------------------------------------------------------------------ the record */
  /* Every submission lives here, on the device, keyed by project. `by` is the thing
     that matters: 'app' means this was marked by a rule, 'kept' means nobody marked it
     and nobody is going to. paath.js reads `by` before it shows anything to a parent. */
  function rec(pid) {
    var st = api.state();
    st.w = st.w || {};
    return st.w[pid] || null;
  }
  function put(pid, v) {
    var st = api.state();
    st.w = st.w || {};
    st.w[pid] = v;
    api.save();
  }

  /* ------------------------------------------------------- Devanagari, well-formed */
  /* The orthography rule, and the whole of it. A vowel SIGN is a mark that hangs on a
     consonant; on its own, or on a vowel letter, it is the beginner's mistake — writing
     आ and then hanging ा on it, which is the same vowel said twice. A virama joins two
     consonants and cannot end a word in a name. Anusvara, chandrabindu and nukta are
     marks but not vowel signs, so they are allowed where a vowel sign is not. */
  var VIRAMA = 0x094D, NUKTA = 0x093C, ANUSVARA = 0x0902, CHANDRA = 0x0901, VISARGA = 0x0903;
  function isMark(cp) {
    return (cp >= 0x0900 && cp <= 0x0903) || cp === NUKTA ||
           (cp >= 0x093A && cp <= 0x094F) || (cp >= 0x0951 && cp <= 0x0957) ||
           (cp >= 0x0962 && cp <= 0x0963);
  }
  function isVowelSign(cp) {
    return (cp >= 0x093A && cp <= 0x094C) || cp === 0x094E || cp === 0x094F ||
           (cp >= 0x0955 && cp <= 0x0957) || (cp >= 0x0962 && cp <= 0x0963);
  }
  function isConsonant(cp) { return cp >= 0x0915 && cp <= 0x0939 || (cp >= 0x0958 && cp <= 0x095F); }
  function isVowelLetter(cp) { return cp >= 0x0904 && cp <= 0x0914; }
  function isDeva(cp) { return cp >= 0x0900 && cp <= 0x097F; }

  /* Returns null when it is well formed, or the one sentence that says what is wrong.
     One fault at a time, on purpose: a list of five corrections is not teaching. */
  function badDevanagari(s) {
    var t = String(s || '');
    if (!t.trim()) return 'There is nothing in the box yet.';
    var i, cp, prev = 0, seenVowelSign = false, letters = 0;
    for (i = 0; i < t.length; i++) {
      cp = t.codePointAt(i);
      if (t.charAt(i) === ' ') { prev = 0; seenVowelSign = false; continue; }
      if (!isDeva(cp))
        return 'There is a letter in there that is not Devanagari. This one is for the ' +
               'Devanagari letters only.';
      if (isConsonant(cp) || isVowelLetter(cp)) { letters++; prev = cp; seenVowelSign = false; continue; }
      if (isVowelSign(cp)) {
        if (!prev) return 'A vowel sign has nothing to hang on. Every मात्रा sits on a ' +
                          'letter — put the letter first.';
        if (isVowelLetter(prev))
          return 'A vowel sign is hung on a vowel letter. आ already says that sound; ' +
                 'the sign goes on a consonant.';
        if (seenVowelSign) return 'Two vowel signs on one letter. A letter takes one.';
        seenVowelSign = true; prev = cp; continue;
      }
      if (cp === VIRAMA) {
        if (!isConsonant(prev)) return 'A halant needs a consonant in front of it.';
        prev = cp; seenVowelSign = false; continue;
      }
      if (cp === NUKTA || cp === ANUSVARA || cp === CHANDRA || cp === VISARGA) {
        if (!prev) return 'That mark has nothing to sit on yet.';
        continue;
      }
      prev = cp;
    }
    if (prev === VIRAMA) return 'It ends on a halant, which joins a letter to the next ' +
                                'one — and there is no next one.';
    if (!letters) return 'There are no letters in there yet, only signs.';
    return null;
  }

  /* ------------------------------------------------------------------ the keypad */
  /* Script-parametric, like everything in the Bhasha engine: it is handed the script
     module and draws that script's own board. Hindi today, and a Gurmukhi course gets
     its keypad by naming its script rather than by anybody writing a second keypad. */
  function keypad(sc, locked) {
    if (!sc) return '';
    var chars = function (list) {
      return (list || []).map(function (x) {
        return typeof x === 'string' ? x : (x.char || x.sign || '');
      }).filter(Boolean);
    };
    var row = function (list, cls, label) {
      if (!list.length) return '';
      return '<div class="kyrow ' + cls + '" role="group" aria-label="' + esc(label) + '">' +
        list.map(function (c) {
          return '<button class="kykey deva" data-ka="type" data-c="' + esc(c) + '"' +
            (locked ? ' disabled' : '') + ' lang="hi">' + esc(c) + '</button>';
        }).join('') + '</div>';
    };
    var matras = chars(sc.matras);
    if (sc.virama) matras = matras.concat([sc.virama]);
    return '<div class="kykeys">' +
      row(chars(sc.vowels), 'kv', 'vowels') +
      row(chars(sc.consonants), 'kc', 'consonants') +
      row(matras, 'km', 'vowel signs') +
      '</div>';
  }

  function script() {
    var B = W.IND_BHASHA;
    return (B && B.scripts && B.scripts.devanagari) || null;
  }

  /* ------------------------------------------------------------------ the screen */
  var typed = '';       /* what is in the box right now; the record holds what was kept */
  var said = null;      /* the last verdict, so it survives the re-render that shows it */

  function open(p) { typed = (rec(p.id) || {}).text || ''; said = null; }

  function render(p) {
    var t = p.task, r = rec(p.id) || null;
    var head = '<div class="kyhead"><span class="mono">In the app</span>' +
      '<h3>' + esc(t.title || 'Do it here first') + '</h3>' +
      (t.say ? '<p>' + esc(t.say) + '</p>' : '') + '</div>';

    if (t.k === 'trace') {
      var L = W.IND_LIKHNA, sc = script(), letter = null;
      if (sc) (sc.consonants || []).concat(sc.vowels || []).forEach(function (x) {
        if ((x.char || x) === t.letter) letter = x;
      });
      if (!L || !letter) return head + '<p class="pa-lede2">This one needs the writing ' +
        'canvas, which has not loaded.</p>';
      return head + '<div id="kytrace">' + L.render(letter) + '</div>' + verdict();
    }

    if (t.k === 'order') {
      var items = (r && r.order) || t.items.slice();
      return head +
        '<ol class="kyorder">' + items.map(function (x, i) {
          return '<li><span class="kyno">' + (i + 1) + '</span>' +
            '<span class="kytxt">' + esc(x) + '</span>' +
            '<span class="kymv">' +
              '<button class="btn sm ghost" data-ka="up" data-i="' + i + '"' +
                (i === 0 ? ' disabled' : '') + ' aria-label="Move up">↑</button>' +
              '<button class="btn sm ghost" data-ka="down" data-i="' + i + '"' +
                (i === items.length - 1 ? ' disabled' : '') + ' aria-label="Move down">↓</button>' +
            '</span></li>';
        }).join('') + '</ol>' +
        '<div class="kyrow2"><button class="btn primary" data-ka="checkorder">Check the order</button></div>' +
        verdict();
    }

    /* write and writeOwn share the board; they differ only in what is checked */
    var own = t.k === 'writeOwn';
    return head +
      (t.clue ? '<div class="kyclue">' + esc(t.clue) +
        (t.roman ? '<span lang="hi">' + esc(t.roman) + '</span>' : '') + '</div>' : '') +
      '<div class="kybox deva" lang="hi" aria-live="polite" aria-label="what you have written">' +
        (typed ? esc(typed) : '<i class="kycaret"></i>') + '</div>' +
      keypad(script(), false) +
      '<div class="kyrow2">' +
        '<button class="btn ghost sm" data-ka="back"' + (typed ? '' : ' disabled') + '>Undo</button>' +
        '<button class="btn ghost sm" data-ka="clear"' + (typed ? '' : ' disabled') + '>Clear</button>' +
        '<button class="btn primary" data-ka="' + (own ? 'checkown' : 'check') + '"' +
          (typed ? '' : ' disabled') + '>' + (own ? 'Keep it' : 'Check') + '</button>' +
      '</div>' +
      '<p class="tiny muted">Tap the letters, or use a keyboard — Backspace undoes, Enter checks.</p>' +
      verdict();
  }

  /* WHAT WAS CHECKED, SAID OUT LOUD. `how` is the whole point of this line: a child who
     is told "correct" about their own name, by a program that cannot know their name,
     has been lied to — so the screen names which of the two things it decided. */
  function verdict() {
    if (!said) return '';
    return '<div class="kysay ' + (said.ok ? 'good' : 'no') + '">' +
      '<b>' + esc(said.head) + '</b>' +
      '<p>' + esc(said.body) + '</p>' +
      (said.how ? '<p class="kyhow">' + esc(said.how) + '</p>' : '') + '</div>';
  }

  /* mounting, for the one task kind that owns a canvas */
  function mount(p) {
    if (!p || !p.task || p.task.k !== 'trace') return null;
    var L = W.IND_LIKHNA, sc = script(), letter = null;
    if (!L || !sc) return null;
    (sc.consonants || []).concat(sc.vowels || []).forEach(function (x) {
      if ((x.char || x) === p.task.letter) letter = x;
    });
    return letter && D.getElementById('kytrace') ? L.mount(letter) : null;
  }

  /* ------------------------------------------------------------------ actions */
  function act(a, el, p) {
    var t = p && p.task;
    if (!t) return false;

    if (a === 'type')  { typed += el.getAttribute('data-c'); said = null; return true; }
    if (a === 'back')  { typed = trimCluster(typed); said = null; return true; }
    if (a === 'clear') { typed = ''; said = null; return true; }

    if (a === 'check') {
      /* THE APP HOLDS THE ANSWER, so it marks it, fully, and it counts. */
      var want = String(t.target || '');
      var ok = typed === want;
      said = ok
        ? { ok: true, head: 'That is it.', body: 'Letter for letter, sign for sign.',
            how: 'The course holds this word, so the app checked every letter against it.' }
        : { ok: false, head: 'Not yet.', body: nudge(typed, want),
            how: 'The course holds this word, so the app can tell you exactly where it differs.' };
      if (ok) put(p.id, { text: typed, by: 'app', on: today(), task: t.k });
      return true;
    }

    if (a === 'checkown') {
      /* THE APP DOES NOT HOLD THE ANSWER. It checks the script and says so. */
      var bad = badDevanagari(typed);
      if (bad) {
        said = { ok: false, head: 'Something is not sitting right.', body: bad,
                 how: 'This is about how Devanagari is put together — not about whether ' +
                      'it is your name. Only you know that.' };
        return true;
      }
      put(p.id, { text: typed, by: 'kept', on: today(), task: t.k });
      said = { ok: true, head: 'Kept.', body: 'Every sign is hung on a letter and every ' +
                 'halant has something on both sides. That part is right.',
               how: 'The app checked the WRITING, not the word — it cannot know how your ' +
                    'name is spelled. Show it to somebody at home who does.' };
      return true;
    }

    if (a === 'up' || a === 'down') {
      var r = rec(p.id) || {};
      var list = r.order || t.items.slice();
      var i = +el.getAttribute('data-i'), j = a === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= list.length) return true;
      var sw = list[i]; list[i] = list[j]; list[j] = sw;
      put(p.id, { order: list, by: r.by || null, on: r.on || 0, task: t.k });
      said = null;
      return true;
    }
    if (a === 'checkorder') {
      var r2 = rec(p.id) || {};
      var got = r2.order || t.items.slice();
      var right = 0, k;
      for (k = 0; k < t.answer.length; k++) if (got[k] === t.answer[k]) right++;
      var allRight = right === t.answer.length;
      said = allRight
        ? { ok: true, head: 'All of them, in order.', body: '',
            how: 'The course holds this order, so the app checked every place.' }
        : { ok: false, head: right + ' of ' + t.answer.length + ' are in the right place.',
            body: 'Move one and look again.',
            how: 'The course holds this order, so the app checked every place.' };
      if (allRight) put(p.id, { order: got, by: 'app', on: today(), task: t.k });
      return true;
    }
    return false;
  }

  /* NEVER LEAK THE ANSWER — CLAUDE.md, and the reason this says a length and a first
     letter rather than the word. A nudge that prints the target is a reveal button. */
  function nudge(got, want) {
    var B = W.IND_BHASHA;
    var g = B ? B.clusters(got) : got.split(''), w = B ? B.clusters(want) : want.split('');
    if (g.length < w.length) return 'There is a letter missing — it is longer than that.';
    if (g.length > w.length) return 'There is one letter too many.';
    for (var i = 0; i < w.length; i++)
      if (g[i] !== w[i]) return 'The first ' + i + ' are right. Look at number ' + (i + 1) + '.';
    return 'Close. Look at the signs rather than the letters.';
  }

  /* backspace deletes a CLUSTER, not a codepoint — deleting half of कि leaves a stray
     sign, which is the exact thing badDevanagari() is about to complain of */
  function trimCluster(s) {
    var B = W.IND_BHASHA;
    if (!B || !B.clusters) return s.slice(0, -1);
    var c = B.clusters(s);
    c.pop();
    return c.join('');
  }

  function today() { var d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }

  /* ------------------------------------------------------------------ the shelf */
  /* What a grown-up is shown. Two lists, never one, because they are different claims:
     what the app marked, and what it is only keeping. paath.js prints them apart and
     says which is which. */
  function shelf(courses) {
    var st = api.state(), out = { marked: [], kept: [] };
    (courses || []).forEach(function (c) {
      c.modules.forEach(function (m) {
        var r = (st.w || {})[m.project.id];
        if (!r) return;
        var row = { course: c.name, part: m.name, project: m.project.name,
                    on: r.on, text: r.text || null, task: r.task };
        (r.by === 'app' ? out.marked : out.kept).push(row);
      });
    });
    return out;
  }

  W.IND_KARYA = {
    init: function (o) { api = o; return this; },
    has: has, open: open, render: render, mount: mount, act: act,
    rec: rec, shelf: shelf,
    /* exported so the checks can drive the rule directly rather than through a screen */
    badDevanagari: badDevanagari
  };
})(window, document);
