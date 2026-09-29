/* Bizzing India — Paathshala: the course engine.

   Renders window.IND_PAATH and keeps the record of what a child can actually do. It is
   deliberately a small file with one large idea in it, and the idea is this:

   ================== TEACHING AND ASSESSMENT ARE DIFFERENT THINGS ==================
   The check at the end of a card measures ATTENTION. The child heard a thing ninety
   seconds ago and can still repeat it; so can anyone. Learning is whether it is there a
   week later, on a screen that did not teach it. So this engine keeps two separate
   records and never lets the first one masquerade as the second:

       seen[]      a lesson was opened. That is all it means. It is not progress.
       mastery{}   per OBJECTIVE, not per lesson, and only a 'c' lesson may write to it —
                   and only if the module's teaching was done on an EARLIER DAY.

   `ledger()` is the only door into mastery, exactly as sim.js is the only door to money
   in the sibling app. A view may read it. Nothing else writes it.

   THE DAY RULE. A check taken on the same day as its teaching is recorded as practice,
   not mastery, and says so on screen. This will annoy a child who wants the tick today.
   It is the single thing that makes the parent report mean anything, so it stays.

   WHAT A GROWN-UP IS SHOWN is mastered objectives, never minutes. docs/05 and the
   sibling app's rule: if it is not in the mastery record it does not go in a report.

   CHILD DATA. Nothing here leaves the device. There is no child email, no free text
   that is transmitted, no photograph. Project notes are stored locally and are excluded
   from any backup by allow-list, the same way the sibling app does it.

   ENTITLEMENTS. `premium` on a course is a LABEL, not a gate. The real gate is
   server-authoritative and does not exist yet, so this engine shows the lock and lets
   the parent area handle the purchase. Anything that pretended otherwise would be a
   client flag deciding entitlement, which docs/07 forbids.
*/
(function (W, D) {
  'use strict';

  var P = null;                 /* the course data, once it has loaded */
  var host = null;              /* where we render */
  var api = {};                 /* what the host app hands us: save, go, toast, icon, esc */
  var st = null;                /* the record */

  /* ------------------------------------------------------------------ the record */
  /* Shape, kept small on purpose:
       { v:1, c: { <courseId>: { at, seen:{lessonId:dayStamp}, made:{projectId:dayStamp},
                                 note:{projectId:text}, m:{objectiveKey:{on, tries}} } } } */
  function blank() { return { v: 1, c: {} }; }
  function course(id) {
    if (!st.c[id]) st.c[id] = { at: today(), seen: {}, made: {}, note: {}, m: {} };
    var r = st.c[id];
    r.seen = r.seen || {}; r.made = r.made || {}; r.note = r.note || {}; r.m = r.m || {};
    return r;
  }
  function today() { var d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }

  /* THE ONLY DOOR INTO MASTERY. Everything else reads. */
  var ledger = {
    open: function (cid, lid) {
      var r = course(cid);
      if (!r.seen[lid]) { r.seen[lid] = today(); api.save(); }
    },
    /* a check was passed. Whether that counts as mastery depends on the day rule. */
    checked: function (cid, mod) {
      var r = course(cid), t = today();
      /* the latest day on which any TEACHING lesson of this module was opened */
      var taught = 0;
      mod.lessons.forEach(function (l) {
        if (l.k !== 'c' && r.seen[lid(mod, l)]) taught = Math.max(taught, r.seen[lid(mod, l)]);
      });
      var rec = r.m[mod.id] || (r.m[mod.id] = { on: 0, tries: 0 });
      rec.tries++;
      /* SAME DAY IS PRACTICE. A week later is evidence. */
      var mastered = taught > 0 && t > taught;
      if (mastered && !rec.on) rec.on = t;
      api.save();
      return { mastered: mastered, taughtOn: taught, sameDay: taught === t };
    },
    made: function (cid, pid, note) {
      var r = course(cid);
      r.made[pid] = today();
      if (note != null) r.note[pid] = String(note).slice(0, 2000);
      api.save();
    },
    unmade: function (cid, pid) { var r = course(cid); delete r.made[pid]; api.save(); }
  };

  function lid(mod, l) { return mod.id + '.' + l.n.slice(0, 18); }

  /* ------------------------------------------------------------------ reading it */
  function get(id) { for (var i = 0; i < P.courses.length; i++) if (P.courses[i].id === id) return P.courses[i]; return null; }
  function modOf(c, mid) { for (var i = 0; i < c.modules.length; i++) if (c.modules[i].id === mid) return c.modules[i]; return null; }

  function stats(c) {
    var r = st.c[c.id] || { seen: {}, made: {}, m: {} };
    var L = 0, seen = 0, made = 0, mast = 0;
    c.modules.forEach(function (m) {
      L += m.lessons.length;
      m.lessons.forEach(function (l) { if (r.seen[lid(m, l)]) seen++; });
      if (r.made[m.project.id]) made++;
      if ((r.m[m.id] || {}).on) mast++;
    });
    return { lessons: L, seen: seen, projects: c.modules.length, made: made,
             objectives: c.modules.length, mastered: mast,
             pct: Math.round((mast / c.modules.length) * 100) };
  }

  /* a course is locked only if it is premium AND the host says it is not owned. The
     host is the only thing that knows, and it does not know authoritatively yet. */
  function locked(c) { return !!c.premium && !api.owns(c.id); }

  /* ------------------------------------------------------------------ the styles */
  var CSS = [
    '.pa-wrap{display:flex;flex-direction:column;gap:14px}',
    /* the header sits on a card like everything else. Without one it lands straight on
       the page's own artwork and the railway lines run through the text -- which a
       screenshot showed and no structural check could. */
    '.pa-head{background:var(--card);border:1px solid var(--line);' +
      'border-radius:var(--radius-lg);padding:14px 16px}',
    '.pa-head h2{margin:0 0 4px}',
    '.pa-lead{color:var(--muted);margin:0 0 6px;max-width:62ch}',
    '.pa-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}',
    '.pa-card{display:flex;flex-direction:column;gap:6px;text-align:left;border:1px solid var(--line);' +
      'background:var(--card);border-radius:var(--radius-lg);padding:14px;cursor:pointer;width:100%}',
    '.pa-card:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
    '.pa-card b{font:800 16px/1.2 var(--display,Georgia,serif)}',
    '.pa-card .pa-sub{font-size:12px;color:var(--muted)}',
    '.pa-card p{margin:2px 0 0;font-size:13px;color:var(--text2)}',
    '.pa-meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:4px}',
    '.pa-pill{font:700 11px/1 var(--body);padding:4px 8px;border-radius:999px;background:var(--ground2);color:var(--muted)}',
    '.pa-pill.on{background:var(--accent-soft);color:var(--accent)}',
    '.pa-bar{height:6px;border-radius:999px;background:var(--ground2);overflow:hidden;margin-top:8px}',
    '.pa-bar i{display:block;height:100%;background:var(--accent);border-radius:999px}',
    '.pa-mods{display:flex;flex-direction:column;gap:10px}',
    '.pa-mod{border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--card);padding:14px}',
    '.pa-mod h4{margin:0 0 2px;font:800 15px/1.25 var(--display,Georgia,serif)}',
    '.pa-obj{margin:0 0 8px;font-size:12.5px;color:var(--muted)}',
    '.pa-obj b{color:var(--text)}',
    '.pa-less{display:flex;flex-direction:column;gap:4px;margin:8px 0 0}',
    '.pa-l{display:flex;gap:8px;align-items:center;text-align:left;width:100%;border:0;cursor:pointer;' +
      'background:var(--ground2);border-radius:10px;padding:8px 11px;min-height:40px}',
    '.pa-l:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
    '.pa-l .k{font:800 10px/1 var(--body);letter-spacing:.06em;padding:3px 6px;border-radius:5px;' +
      'background:var(--card);color:var(--muted);flex:none}',
    '.pa-l.done .k{background:var(--accent-soft);color:var(--accent)}',
    '.pa-l span{flex:1;font:700 13px/1.3 var(--body)}',
    '.pa-l i{font-style:normal;font-size:11px;color:var(--muted);flex:none}',
    '.pa-proj{margin-top:10px;border:1px dashed var(--line);border-radius:12px;padding:12px;background:var(--ground2)}',
    '.pa-proj h5{margin:0 0 4px;font:800 13px/1.2 var(--body)}',
    '.pa-proj p{margin:0 0 8px;font-size:13px;color:var(--text2)}',
    '.pa-made{font-size:12px;color:var(--muted);margin:0 0 8px}',
    '.pa-lesson{border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--card);padding:16px}',
    '.pa-uses{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 0}',
    '.pa-use{font:700 12px/1 var(--body);padding:7px 10px;border-radius:999px;border:1px solid var(--line);' +
      'background:var(--ground2);cursor:pointer;min-height:34px}',
    '.pa-note{width:100%;min-height:90px;border:1px solid var(--line);border-radius:10px;padding:10px;' +
      'font:400 14px/1.5 var(--body);background:var(--card);color:var(--text);resize:vertical}',
    '.pa-warn{border:1px solid var(--line);border-left:4px solid #6f6880;background:#eceaf0;' +
      'border-radius:10px;padding:11px 13px;margin:10px 0;font-size:13px;color:var(--text)}',
    '.pa-warn b{display:block;margin-bottom:3px}',
    /* A LOCK IS NOT A FADE. Dimming the whole card to say "premium" dims its text with
       it and lets the page's artwork through an otherwise opaque card -- which is what
       a screenshot showed, on exactly the five premium courses and no others. The lock
       is said in words on the pill instead, and the card stays as readable as the ones
       beside it. Somebody deciding whether to buy a course needs to be able to read it. */
    '.pa-lock b{color:var(--text2)}',
    '@media (prefers-reduced-motion: reduce){.pa-bar i{transition:none}}',

    /* ============================ THE TAKE-HOME PACK ============================
       A course that only exists on a screen is a course a family cannot do at the table.
       This is the part that leaves: verse cards, a question for each part to ask at
       dinner, something to do at home, and every project brief with room to write on.
       It is one page, built to be printed or saved as a PDF, and it carries its own
       attribution because a sheet of paper has no tooltip. */
    '.pk-tools{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}',
    '.pk{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:18px}',
    '.pk h1{font:800 26px/1.15 var(--display,Georgia,serif);margin:0 0 4px}',
    '.pk h2{font:800 18px/1.2 var(--display,Georgia,serif);margin:22px 0 6px;' +
      'border-top:1px solid var(--line);padding-top:14px}',
    '.pk h3{font:800 14px/1.25 var(--body);margin:14px 0 4px}',
    '.pk p{margin:0 0 8px;font-size:13.5px;line-height:1.6}',
    '.pk .pk-lead{color:var(--muted)}',
    '.pk-verse{border:1px solid var(--line);border-radius:12px;padding:14px;margin:0 0 10px;' +
      'background:var(--ground2);break-inside:avoid}',
    '.pk-sa{font-size:19px;white-space:pre-line;margin:0 0 6px}',
    '.pk-tr{font-style:italic;color:var(--text2);white-space:pre-line;margin:0 0 6px;font-size:13px}',
    '.pk-at{font-size:11.5px;color:var(--muted);margin:6px 0 0}',
    '.pk-mod{break-inside:avoid;margin:0 0 6px}',
    '.pk-q{border-left:4px solid var(--accent2);padding:6px 0 6px 11px;margin:6px 0}',
    '.pk-q b{display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}',
    '.pk-rule{border-bottom:1px solid var(--line);height:26px}',
    '.pk-foot{margin-top:20px;font-size:11.5px;color:var(--muted);border-top:1px solid var(--line);padding-top:10px}',

    /* PRINTING. Everything that is screen furniture goes: the site bar, the bottom nav,
       the page artwork, the back link and the buttons that do nothing on paper. What is
       left is black on white with the parts kept whole across page breaks. */
    '@media print{' +
      'body{background:#fff !important}' +
      '.topbar,.nav,.navtab,.wa-layer,.pk-tools,.backlink,#navmoresheet{display:none !important}' +
      '.pk{border:0;padding:0;background:#fff}' +
      '.pk h2{break-after:avoid}' +
      '.pk-verse,.pk-mod{break-inside:avoid}' +
      '.pk-rule{border-bottom:1px solid #999}' +
      '.wrap{padding:0 !important;max-width:none !important}' +
    '}'
  ].join('');

  function styles() {
    if (D.getElementById('pa-css')) return;
    var s = D.createElement('style'); s.id = 'pa-css'; s.textContent = CSS;
    D.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ the views */
  var esc = function (x) { return api.esc(x); };

  /* what the child sees on a lesson that points at a piece of the corpus. These are
     buttons because the corpus is where the teaching actually lives — the course is an
     order to meet it in, not a second copy of it. */
  var USE_LABEL = { st: 'story', sh: 'verse', ge: 'song', ut: 'festival', ri: 'relative',
                    it: 'era', va: 'value', dh: 'faith' };
  var USE_VIEW  = { st: 'story', sh: 'shlok', ge: 'song', ut: 'festival', ri: 'rishtey',
                    it: 'era', va: 'value', dh: 'faith' };

  function uses(l) {
    var out = [];
    Object.keys(l.use || {}).forEach(function (k) {
      var v = l.use[k];
      if (k === 'bh') { out.push('<button class="pa-use" data-act="go" data-v="bhasha">' +
        v + ' Bhasha exercises →</button>'); return; }
      if (k === 'sa') { out.push('<button class="pa-use" data-act="go" data-v="khel">' +
        'Open Sabhyata →</button>'); return; }
      if (!Array.isArray(v)) return;
      v.forEach(function (id) {
        out.push('<button class="pa-use" data-act="go" data-v="' + (USE_VIEW[k] || 'home') +
          '" data-arg="' + esc(id) + '">' + esc(USE_LABEL[k] || k) + ': ' + esc(id) + ' →</button>');
      });
    });
    return out.length ? '<div class="pa-uses">' + out.join('') + '</div>' : '';
  }

  function hub() {
    styles();
    var cards = P.courses.map(function (c) {
      var s = stats(c), lk = locked(c);
      return '<button class="pa-card' + (lk ? ' pa-lock' : '') + '" data-pa="course" data-id="' +
        esc(c.id) + '" aria-label="' + esc(c.name) + ' — ' + c.hours + ' hours">' +
        '<b>' + esc(c.name) + '</b>' +
        '<span class="pa-sub">' + esc(c.sub) + '</span>' +
        '<p>' + esc(c.blurb) + '</p>' +
        '<div class="pa-meta">' +
          '<span class="pa-pill">' + c.hours + ' hours</span>' +
          '<span class="pa-pill">ages ' + c.ages[0] + '–' + c.ages[1] + '</span>' +
          '<span class="pa-pill">' + c.modules.length + ' parts</span>' +
          (lk ? '<span class="pa-pill">grown-ups unlock this</span>' : '') +
          (s.mastered ? '<span class="pa-pill on">' + s.mastered + ' of ' + s.objectives + ' learned</span>' : '') +
        '</div>' +
        '<div class="pa-bar"><i style="width:' + s.pct + '%"></i></div>' +
        '</button>';
    }).join('');
    return '<div class="pa-wrap"><div class="pa-head">' +
      '<h2>Paathshala</h2>' +
      '<p class="pa-lead">' + esc(P.intro) + '</p>' +
      '<p class="pa-lead" style="font-size:12.5px">' + esc(P.parentNote) + '</p>' +
      '</div><div class="pa-grid">' + cards + '</div></div>';
  }

  function coursePage(id) {
    styles();
    var c = get(id); if (!c) return hub();
    var r = course(c.id), s = stats(c);
    var warn = '';
    if (c.needsReview && c.needsReview.length) {
      warn = '<div class="pa-warn"><b>Parts of this course are still being checked by a person.</b>' +
        c.needsReview.map(function (x) { return esc(x); }).join(' ') + '</div>';
    }
    var mods = c.modules.map(function (m, i) {
      var mr = r.m[m.id] || {};
      var lessons = m.lessons.map(function (l) {
        var done = !!r.seen[lid(m, l)];
        var K = l.k === 't' ? 'LEARN' : l.k === 'p' ? 'PRACTISE' : 'CHECK';
        return '<button class="pa-l' + (done ? ' done' : '') + '" data-pa="lesson" data-id="' +
          esc(c.id) + '" data-m="' + esc(m.id) + '" data-l="' + esc(l.n) + '">' +
          '<span class="k">' + K + '</span><span>' + esc(l.n) + '</span><i>' + l.m + ' min</i></button>';
      }).join('');
      var made = !!r.made[m.project.id];
      return '<div class="pa-mod">' +
        '<h4>' + (i + 1) + '. ' + esc(m.name) + '</h4>' +
        '<p class="pa-obj">After this you can <b>' + esc(m.objective) + '</b>.' +
          (mr.on ? ' <span class="pa-pill on">learned</span>' : '') + '</p>' +
        (m.needsReview ? '<div class="pa-warn"><b>A person is still checking this part.</b>' +
          esc(m.needsReview) + '</div>' : '') +
        (m.needsVerse ? '<div class="pa-warn"><b>A verse for this part is still being sourced.</b>' +
          'This app only shows verses it can attribute. Nothing here is guessed.</div>' : '') +
        '<div class="pa-less">' + lessons + '</div>' +
        '<div class="pa-proj"><h5>Project · ' + esc(m.project.name) + ' · ' + m.project.m + ' min</h5>' +
        '<p>' + esc(m.project.brief) + '</p>' +
        '<p class="pa-made">You will have made: ' + esc(m.project.made) + '</p>' +
        '<button class="btn' + (made ? '' : ' primary') + '" data-pa="made" data-id="' + esc(c.id) +
        '" data-p="' + esc(m.project.id) + '">' + (made ? 'Made it ✓ — undo' : 'I made it') + '</button>' +
        '</div></div>';
    }).join('');
    var asg = (c.assignments || []).map(function (a) {
      return '<div class="pa-proj"><h5>' + esc(a.name) + (a.family ? ' · with your family' : '') +
        '</h5><p>' + esc(a.brief) + '</p></div>';
    }).join('');
    return '<div class="pa-wrap">' +
      '<button class="backlink" data-pa="hub">' + api.icon('back', 18) + ' Paathshala</button>' +
      '<div class="pa-head"><h2>' + esc(c.name) + '</h2>' +
      '<p class="pa-lead">' + esc(c.why) + '</p>' +
      (c.note ? '<p class="pa-lead" style="font-size:12.5px">' + esc(c.note) + '</p>' : '') +
      '<div class="pa-meta"><span class="pa-pill">' + c.hours + ' hours</span>' +
      '<span class="pa-pill">ages ' + c.ages[0] + '–' + c.ages[1] + '</span>' +
      '<span class="pa-pill' + (s.mastered ? ' on' : '') + '">' + s.mastered + ' of ' +
        s.objectives + ' learned</span>' +
      '<span class="pa-pill">' + s.made + ' of ' + s.projects + ' projects made</span></div>' +
      '<div class="pa-bar"><i style="width:' + s.pct + '%"></i></div>' +
      '<div class="pk-tools" style="margin-top:12px"><button class="btn" data-pa="pack" data-id="' +
        esc(c.id) + '">Take-home pack — print it</button></div></div>' +
      warn +
      '<div class="pa-mods">' + mods + '</div>' +
      (asg ? '<h3>Every week, with your family</h3>' + asg : '') +
      '<h3>Where this comes from</h3><ul>' +
        (c.sources || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') +
      '</ul></div>';
  }

  function lessonPage(cid, mid, name) {
    styles();
    var c = get(cid), m = modOf(c, mid);
    var l = null;
    m.lessons.forEach(function (x) { if (x.n === name) l = x; });
    if (!l) return coursePage(cid);
    ledger.open(cid, lid(m, l));
    var K = l.k === 't' ? 'Learn' : l.k === 'p' ? 'Practise' : 'Check';
    var body;
    if (l.k === 'c') {
      var r = course(cid), taught = 0;
      m.lessons.forEach(function (x) { if (x.k !== 'c' && r.seen[lid(m, x)]) taught = Math.max(taught, r.seen[lid(m, x)]); });
      var same = taught === today(), none = !taught;
      body = '<p>This is the check for <b>' + esc(m.objective) + '</b>.</p>' +
        (none ? '<div class="pa-warn"><b>Do the learning parts first.</b>A check before the ' +
                 'teaching is just a guess, and it will not count.</div>'
              : same ? '<div class="pa-warn"><b>You learned this today.</b>Doing the check now ' +
                       'is good practice, but it will not count as learned. Come back tomorrow ' +
                       'or later in the week and it will — remembering an hour later is ' +
                       'attention, remembering a week later is learning.</div>'
              : '<p>You learned this on an earlier day, so this one counts.</p>') +
        '<button class="btn primary" data-pa="pass" data-id="' + esc(cid) + '" data-m="' +
          esc(mid) + '"' + (none ? ' disabled' : '') + '>I can do it</button>';
    } else {
      body = '<p>' + esc(l.o ? 'By the end: ' + l.o + '.' : '') + '</p>' +
        '<p class="pa-lead">Everything this part uses is below — open each one, then come back.</p>' +
        uses(l);
    }
    return '<div class="pa-wrap">' +
      '<button class="backlink" data-pa="course" data-id="' + esc(cid) + '">' +
        api.icon('back', 18) + ' ' + esc(c.name) + '</button>' +
      '<div class="pa-lesson"><span class="pa-pill">' + K + ' · ' + l.m + ' min</span>' +
      '<h2 style="margin:8px 0 4px">' + esc(l.n) + '</h2>' +
      '<p class="pa-lead">Part ' + esc(m.name) + '</p>' +
      body + '</div></div>';
  }

  /* -------------------------------------------------------------- the take-home pack */
  /* Verse cards are built from data-shlok.js at render time, so a card cannot drift from
     the verse it claims to be — there is one copy of the text and this is not it. Only
     ids the course actually cites appear, and only ones that resolve to a real verse. */
  /* THE SCRIPT IS THE COLLECTION'S, NOT SANSKRIT'S. The first version set lang="sa" on
     every card, which put Thirukkural — Tamil — into a Devanagari face. docs/05: a script
     is set correctly or it is not set at all, and the Neeti-facing parts of these courses
     cite Tamil and Pali on purpose, because the same quality turning up in three
     traditions is the lesson. The lang attribute is derived from the collection, and the
     app's own :lang() rules then pick the right face, size and line-height. */
  var LANG = { Sanskrit: 'sa', Tamil: 'ta', Pali: null, Hindi: 'hi' };
  function verseCards(c) {
    var SH = W.IND_SHLOK;
    if (!SH || !SH.verses) return '';
    var langOf = {};
    (SH.collections || []).forEach(function (x) { langOf[x.id] = LANG[x.language] || null; });
    var want = [];
    c.modules.forEach(function (m) {
      m.lessons.forEach(function (l) {
        ((l.use || {}).sh || []).forEach(function (id) {
          if (want.indexOf(id) < 0) want.push(id);
        });
      });
    });
    var cards = want.map(function (id) {
      var v = null;
      SH.verses.forEach(function (x) { if (x.id === id) v = x; });
      if (!v) return '';                      /* a collection id, not a verse — skip */
      var lg = langOf[v.collection];
      return '<div class="pk-verse">' +
        '<p class="pk-sa"' + (lg ? ' lang="' + lg + '"' : '') + '>' +
          esc(v.text_original || '') + '</p>' +
        (v.translit ? '<p class="pk-tr">' + esc(v.translit) + '</p>' : '') +
        '<p>' + esc(v.meaning_kid || '') + '</p>' +
        '<p class="pk-at">' + esc(v.source || '') + '</p></div>';
    }).filter(Boolean).join('');
    if (!cards) return '';
    return '<h2>Verse cards</h2>' +
      '<p class="pk-lead">Cut these out. Every one carries where it comes from, because a ' +
      'sheet of paper cannot be tapped for a source. Nothing is printed here that this app ' +
      'cannot attribute.</p>' + cards;
  }

  /* the pack counts its own cards, so the sentence describing it cannot drift from it */
  function nCards(c) {
    var SH = W.IND_SHLOK; if (!SH || !SH.verses) return '';
    var ids = [];
    c.modules.forEach(function (m) { m.lessons.forEach(function (l) {
      ((l.use || {}).sh || []).forEach(function (id) {
        if (ids.indexOf(id) < 0 && SH.verses.some(function (v) { return v.id === id; })) ids.push(id);
      });
    }); });
    return ids.length ? ids.length + ' ' : '';
  }

  function packPage(cid) {
    styles();
    var c = get(cid); if (!c) return hub();
    var review = (c.needsReview && c.needsReview.length)
      ? '<h2>For the grown-up, before you start</h2>' +
        c.needsReview.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('')
      : '';
    var mods = c.modules.map(function (m, i) {
      return '<div class="pk-mod"><h3>' + (i + 1) + '. ' + esc(m.name) + '</h3>' +
        '<p>After this part a child can <b>' + esc(m.objective) + '</b>.</p>' +
        (m.talk ? '<div class="pk-q"><b>Ask at the table</b>' + esc(m.talk) + '</div>' : '') +
        (m.home ? '<div class="pk-q"><b>At home this week</b>' + esc(m.home) + '</div>' : '') +
        '<p><b>Project · ' + esc(m.project.name) + '</b> — ' + esc(m.project.brief) + '</p>' +
        '<p class="pk-at">You will have made: ' + esc(m.project.made) + '</p>' +
        '<div class="pk-rule"></div><div class="pk-rule"></div><div class="pk-rule"></div>' +
        '</div>';
    }).join('');
    var asg = (c.assignments || []).map(function (a) {
      return '<p><b>' + esc(a.name) + '</b> — ' + esc(a.brief) + '</p>';
    }).join('');
    return '<div class="pa-wrap">' +
      '<div class="pk-tools">' +
        '<button class="backlink" data-pa="course" data-id="' + esc(cid) + '">' +
          api.icon('back', 18) + ' ' + esc(c.name) + '</button>' +
        '<button class="btn primary" data-pa="print">Print, or save as PDF</button>' +
      '</div>' +
      '<div class="pk">' +
      '<h1>' + esc(c.name) + '</h1>' +
      '<p class="pk-lead">' + esc(c.sub) + ' · ' + c.hours + ' hours · ages ' +
        c.ages[0] + '–' + c.ages[1] + ' · ' + c.modules.length + ' parts</p>' +
      '<p>' + esc(c.blurb) + '</p>' +
      (c.takeHome ? '<p class="pk-lead">In this pack: ' + nCards(c) + esc(c.takeHome) + '</p>' : '') +
      '<h2>How this course measures learning</h2>' +
      '<p>' + esc(P.parentNote) + '</p>' +
      review +
      verseCards(c) +
      '<h2>The parts</h2>' + mods +
      (asg ? '<h2>Every week, with your family</h2>' + asg : '') +
      '<h2>Where this comes from</h2>' +
      (c.sources || []).map(function (x) { return '<p class="pk-at">' + esc(x) + '</p>'; }).join('') +
      '<p class="pk-foot">Bizzing India · Paathshala · this pack is generated from the ' +
        'course itself, so it cannot disagree with what is on the screen.</p>' +
      '</div></div>';
  }

  /* ------------------------------------------------------------------ actions */
  /* Returns true when it handled the click, so the host can fall through to its own
     dispatcher for everything else. Keyboard comes free: every control here is a real
     <button>, so Enter and Space already work and Tab already reaches them. */
  function act(a, el) {
    if (a === 'hub')    { api.go('paath'); return true; }
    if (a === 'course') { api.go('paath', el.getAttribute('data-id')); return true; }
    if (a === 'lesson') {
      api.go('paathl', el.getAttribute('data-id') + '|' + el.getAttribute('data-m') +
                       '|' + el.getAttribute('data-l'));
      return true;
    }
    if (a === 'pack')  { api.go('paathp', el.getAttribute('data-id')); return true; }
    if (a === 'print') { W.print(); return true; }
    if (a === 'made') {
      var cid = el.getAttribute('data-id'), pid = el.getAttribute('data-p');
      var r = course(cid);
      if (r.made[pid]) { ledger.unmade(cid, pid); }
      else { ledger.made(cid, pid); api.toast('Made. That is the part that lasts.'); }
      api.go('paath', cid); return true;
    }
    if (a === 'pass') {
      var cid2 = el.getAttribute('data-id'), m2 = modOf(get(cid2), el.getAttribute('data-m'));
      var res = ledger.checked(cid2, m2);
      api.toast(res.mastered ? 'Learned — and it counted, because you learned it on an earlier day.'
                             : 'Good practice. Come back another day and it will count.');
      api.go('paath', cid2); return true;
    }
    return false;
  }

  /* ------------------------------------------------------------------ boot */
  W.IND_PAATH_UI = {
    /* the host hands us everything it owns; we keep no globals of its */
    init: function (o) {
      P = W.IND_PAATH; api = o; host = o.host || null;
      st = o.state || blank();
      if (!st.c) st = blank();
      return this;
    },
    state: function () { return st; },
    hub: hub,
    course: coursePage,
    pack: packPage,
    lesson: function (arg) {
      var p = String(arg || '').split('|');
      return lessonPage(p[0], p[1], p.slice(2).join('|'));
    },
    act: act,
    /* what the grown-ups page is allowed to show: objectives, never minutes */
    report: function () {
      return P.courses.map(function (c) {
        var s = stats(c);
        return { id: c.id, name: c.name, mastered: s.mastered, of: s.objectives, made: s.made };
      }).filter(function (x) { return x.mastered || x.made; });
    }
  };
})(window, document);
