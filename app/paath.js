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

  /* ------------------------------------------------------------------ the look */
  /* AN ATLAS, NOT A LIST OF CARDS. The first version was ten grey boxes of text, and it
     looked like a settings screen for a thing that is actually a shelf of illustrated
     books. This app owns 686 epic paintings, 399 photographs of places, 344 story plates
     and a map — it was absurd to render a course library with none of it.
     So: every course is a PLATE. A cover image, a plate number set in the display face,
     a title, a standfirst, and a hairline rule under it. The grammar is a reference work:
     big numerals, small-caps labels, generous margins, one accent per course, and rules
     rather than boxes wherever a rule will do.
     The covers are real files already in the repo and every one is named in the data with
     an alt line, because an uncredited picture is the thing docs/05 forbids. */
  var CSS = [
    '.pa-wrap{display:flex;flex-direction:column;gap:0}',
    /* PAPER. The first atlas draft had no surface of its own, so ten plates and their
       titles sat straight on the page's world artwork — a bazaar mural ran through "My
       India" and the rows nearest the bunting read lighter than the rest. Every other
       view in this app sits on a `.card` for exactly this reason. An atlas is printed on
       paper anyway, so the surface is the design rather than a patch on it. */
    '.pa-paper{background:var(--card);border:1px solid var(--line);' +
      'border-radius:var(--radius-xl,20px);padding:26px 28px;box-shadow:var(--shadow)}',
    '@media (max-width:620px){.pa-paper{padding:16px 13px;border-radius:14px}}',

    /* ---------- the masthead ---------- */
    /* THE TALLY GOES BESIDE THE TITLE, NOT UNDER IT. Measured with tools/check-fold.js:
       the first course plate started 507px down a 770px screenful, because the masthead
       was five stacked blocks — kicker, title, standfirst, tally, and a paragraph of
       house rules written for a parent. The rules are at the foot now, where a parent
       will look, and the tally rides in the empty right half the standfirst leaves. */
    '.pa-mast{padding:0 0 12px;border-bottom:2px solid var(--text);margin-bottom:16px}',
    '.pa-mast.flush{border-bottom-width:1px;border-color:var(--line);padding:0 0 12px}',
    '@media (min-width:820px){' +
      '.pa-mast{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:32px;align-items:end}' +
      '.pa-mast>.pa-kick,.pa-mast>h2,.pa-mast>.pa-lead{grid-column:1}' +
      '.pa-mast>.pa-tally{grid-column:2;grid-row:1/span 3;align-self:end;margin:0;' +
        'justify-content:flex-end}}',
    '.pa-kick{font:800 11px/1.4 var(--body);letter-spacing:.18em;text-transform:uppercase;' +
      'color:var(--muted);margin:0 0 8px}',
    '.pa-mast h2{font:800 clamp(30px,5vw,46px)/1.02 var(--display,Georgia,serif);' +
      'margin:0 0 8px;letter-spacing:-.015em}',
    '.pa-lead{color:var(--text2);margin:0;max-width:58ch;font-size:15px;line-height:1.6}',
    '.pa-lede2{color:var(--muted);margin:12px 0 0;max-width:62ch;font-size:12.5px;line-height:1.6}',
    '.pa-tally{display:flex;gap:20px;flex-wrap:wrap;margin:16px 0 0;padding:0;list-style:none}',
    '.pa-tally li{font:800 10.5px/1.3 var(--body);letter-spacing:.13em;text-transform:uppercase;' +
      'color:var(--muted)}',
    '.pa-tally b{display:block;font:800 22px/1.1 var(--display,Georgia,serif);color:var(--text);' +
      'letter-spacing:-.01em;text-transform:none;margin-bottom:2px}',

    /* ---------- a course plate ---------- */
    /* Rules, not boxes. Ten bordered cards in a grid is a settings screen; ten plates
       separated by a hairline is a contents page, and the pictures do the dividing. */
    '.pa-plates{display:flex;flex-direction:column;gap:0}',
    '.pa-card{display:grid;grid-template-columns:200px 1fr;gap:22px;align-items:start;' +
      'width:100%;text-align:left;border:0;border-bottom:1px solid var(--line);' +
      'background:none;padding:22px 6px;cursor:pointer;position:relative;font:inherit;color:inherit}',
    '.pa-card:first-child{padding-top:6px}',
    '.pa-card:hover{background:var(--ground2)}',
    '.pa-card:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}',
    '.pa-fig{display:block;position:relative;aspect-ratio:4/3;border-radius:3px;overflow:hidden;' +
      'background:var(--ground2);box-shadow:0 1px 3px rgba(30,20,64,.18)}',
    '.pa-fig img{width:100%;height:100%;object-fit:cover;display:block}',
    '.pa-no{position:absolute;left:0;top:0;background:var(--text);color:var(--card);' +
      'font:800 10px/1 var(--body);letter-spacing:.14em;text-transform:uppercase;padding:6px 9px}',
    '.pa-body{display:block;min-width:0}',
    '.pa-body b{display:block;font:800 clamp(20px,2.5vw,26px)/1.12 var(--display,Georgia,serif);' +
      'letter-spacing:-.015em;margin:0 0 6px}',
    '.pa-sub{display:block;font:800 10.5px/1.3 var(--body);letter-spacing:.14em;' +
      'text-transform:uppercase;color:var(--accent);margin:0 0 5px}',
    '.pa-t{display:block;margin:0;font-size:14px;line-height:1.55;color:var(--text2);max-width:58ch}',
    '.pa-meta{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-top:11px}',
    '.pa-pill{font:700 11px/1.3 var(--body);letter-spacing:.07em;text-transform:uppercase;' +
      'color:var(--muted);display:inline-flex;align-items:center;gap:4px}',
    '.pa-pill.on{color:var(--accent)}',
    '.pa-pill.lock{color:var(--text2)}',
    '.pa-pill svg{flex:none}',
    '.pa-badge{font:800 10.5px/1 var(--body);letter-spacing:.1em;text-transform:uppercase;' +
      'padding:5px 9px;border-radius:999px;border:1px solid var(--line2);color:var(--text2);' +
      'background:var(--card2)}',
    '.pa-badge.katha,.pa-badge.dharma{color:#a4671a;background:#fdf3e2;border-color:#f0dcb8}',
    '.pa-badge.itihaas{color:#2a5b9e;background:#eaf1fb;border-color:#c9dcf2}',
    '.pa-badge.aaj{color:#1a7a54;background:#e7f6ef;border-color:#bfe6d5}',
    '.pa-bar{display:block;height:2px;background:var(--line);margin-top:12px;max-width:240px}',
    '.pa-bar.wide{max-width:none;margin-top:16px}',
    '.pa-bar i{display:block;height:100%;background:var(--accent)}',
    '@media (max-width:620px){' +
      '.pa-card{grid-template-columns:104px 1fr;gap:14px;padding:16px 2px}' +
      '.pa-fig{aspect-ratio:1/1}' +
      '.pa-no{font-size:8.5px;padding:4px 6px;letter-spacing:.1em}' +
      '.pa-tally{gap:14px}.pa-tally b{font-size:18px}}',

    /* ---------- the chapter opener ---------- */
    '.pa-hero{position:relative;border-radius:4px;overflow:hidden;margin:0 0 10px;' +
      'background:var(--ground2);min-height:clamp(168px,21vw,238px);display:flex;align-items:flex-end}',
    '.pa-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
    '.pa-scrim{position:relative;width:100%;padding:36px 22px 18px;' +
      'background:linear-gradient(to top,rgba(20,13,34,.94) 0%,rgba(20,13,34,.74) 46%,rgba(20,13,34,0) 100%);' +
      'color:#fff}',
    '.pa-scrim h2{font:800 clamp(27px,4.6vw,42px)/1.04 var(--display,Georgia,serif);' +
      'margin:0 0 6px;letter-spacing:-.02em;color:#fff}',
    '.pa-scrim .pa-kick{color:rgba(255,255,255,.72);margin-bottom:6px}',
    '.pa-scrim .pa-sub{color:#f3c98b;margin:0 0 8px}',
    '.pa-scrim p{margin:0;max-width:58ch;font-size:14px;line-height:1.55;color:rgba(255,255,255,.92)}',
    '.pa-credit{font:700 10.5px/1.4 var(--body);color:var(--muted);margin:0 0 20px;' +
      'text-align:right;letter-spacing:.04em}',

    /* ---------- the parts ---------- */
    '.pa-secthead{display:flex;align-items:baseline;justify-content:space-between;gap:12px;' +
      'margin:28px 0 2px;border-bottom:2px solid var(--text);padding-bottom:7px}',
    '.pa-secthead h3{font:800 17px/1.1 var(--display,Georgia,serif);margin:0}',
    '.pa-secthead span{font:800 10.5px/1.3 var(--body);letter-spacing:.13em;' +
      'text-transform:uppercase;color:var(--muted);flex:none}',
    '.pa-mods{display:flex;flex-direction:column;gap:0}',
    '.pa-mod{display:grid;grid-template-columns:58px 1fr;gap:16px;' +
      'border-bottom:1px solid var(--line);padding:20px 2px}',
    '.pa-modno{font:800 34px/.95 var(--display,Georgia,serif);color:var(--line2);' +
      'text-align:right;font-variant-numeric:lining-nums}',
    '.pa-mod.learned .pa-modno{color:var(--accent)}',
    '.pa-modbody{min-width:0}',
    '.pa-mod h4{margin:0 0 4px;font:800 18px/1.2 var(--display,Georgia,serif)}',
    '.pa-obj{margin:0 0 12px;font-size:13px;line-height:1.5;color:var(--muted)}',
    '.pa-obj b{color:var(--text);font-weight:700}',
    '.pa-less{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 12px}',
    '.pa-l{display:inline-flex;gap:8px;align-items:center;text-align:left;' +
      'border:1px solid var(--line);cursor:pointer;background:var(--card);border-radius:3px;' +
      'padding:8px 11px;min-height:38px;font:inherit;color:inherit}',
    '.pa-l:hover{border-color:var(--accent);background:var(--accent-soft)}',
    '.pa-l:focus-visible{outline:2px solid var(--accent);outline-offset:1px}',
    '.pa-l .k{font:800 9px/1 var(--body);letter-spacing:.12em;text-transform:uppercase;' +
      'color:var(--muted);flex:none}',
    /* a check is the only lesson that can write to the record, so it is marked */
    '.pa-l.c{border-left:3px solid var(--accent2)}',
    '.pa-l.done .k{color:var(--accent)}',
    '.pa-l.done{border-color:var(--accent-soft);background:var(--accent-soft)}',
    '.pa-l span:not(.k){font:700 12.5px/1.2 var(--body)}',
    '.pa-l i{font-style:normal;font-size:10.5px;color:var(--muted)}',
    '.pa-proj{border-left:3px solid var(--accent2);padding:2px 0 2px 14px;margin:12px 0 0}',
    '.pa-proj h5{margin:0 0 4px;font:800 10px/1 var(--body);letter-spacing:.14em;' +
      'text-transform:uppercase;color:var(--muted)}',
    '.pa-proj b{display:block;font:800 15px/1.25 var(--display,Georgia,serif);margin:0 0 5px}',
    '.pa-proj p{margin:0 0 8px;font-size:13px;line-height:1.55;color:var(--text2)}',
    '.pa-made{font-size:11.5px;color:var(--muted);margin:0 0 9px;font-style:italic}',
    '@media (max-width:620px){.pa-mod{grid-template-columns:34px 1fr;gap:11px;padding:16px 2px}' +
      '.pa-modno{font-size:23px}.pa-scrim{padding:34px 15px 17px}}',

    /* ---------- a lesson ---------- */
    '.pa-lesson{border-top:2px solid var(--text);padding:16px 0 0;margin-top:2px}',
    '.pa-lesson h2{font:800 clamp(25px,3.8vw,36px)/1.08 var(--display,Georgia,serif);' +
      'margin:0 0 6px;letter-spacing:-.02em}',
    '.pa-lesson .pa-lead{margin-top:16px}',
    '.pa-next{margin:22px 0 0;padding-top:14px;border-top:1px solid var(--line)}',

    /* ---------- a corpus chip ---------- */
    /* THE THING, NOT ITS ROW ID. A chip with an honest painting is `lit` and leads with
       it; one without is typographic and leads with the thing's own script. Either way
       the child reads a title, never a key. */
    '.pa-uses{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));' +
      'gap:10px;margin:14px 0 0}',
    '.pa-use{display:grid;grid-template-columns:1fr;gap:0;text-align:left;font:inherit;' +
      'color:inherit;border:1px solid var(--line);background:var(--card);border-radius:4px;' +
      'cursor:pointer;overflow:hidden;min-height:44px;padding:0}',
    '.pa-use:hover{border-color:var(--accent);box-shadow:0 2px 10px rgba(30,20,64,.10)}',
    '.pa-use:focus-visible{outline:2px solid var(--accent);outline-offset:1px}',
    '.pa-usefig{display:block;aspect-ratio:16/9;overflow:hidden;background:var(--ground2);' +
      'border-bottom:1px solid var(--line)}',
    '.pa-usefig img{width:100%;height:100%;object-fit:cover;display:block}',
    '.pa-usefig.drawn{aspect-ratio:auto;display:flex;align-items:center;justify-content:center;' +
      'padding:10px 0;background:var(--accent-soft)}',
    '.pa-usetxt{display:block;padding:10px 12px 11px}',
    '.pa-usekind{display:block;font:800 9.5px/1 var(--body);letter-spacing:.15em;' +
      'text-transform:uppercase;color:var(--accent);margin:0 0 5px}',
    '.pa-use b{display:block;font:800 14.5px/1.3 var(--display,Georgia,serif);margin:0 0 3px}',
    '.pa-use i{display:block;font-style:normal;font-size:11.5px;line-height:1.45;color:var(--muted)}',

    '.pa-warn{border-left:4px solid #6f6880;background:#eceaf0;border-radius:0 6px 6px 0;' +
      'padding:12px 14px;margin:14px 0;font-size:13px;line-height:1.55;color:var(--text)}',
    '.pa-warn b{display:block;margin-bottom:3px;font:800 12px/1.3 var(--body);' +
      'letter-spacing:.05em;text-transform:uppercase}',
    '.pa-colophon{margin:14px 0 0;font-size:12px;line-height:1.65;color:var(--muted);' +
      'max-width:74ch;padding-left:0;list-style:none}',
    'ul.pa-colophon li{margin-bottom:6px;padding-left:14px;position:relative}',
    'ul.pa-colophon li:before{content:"—";position:absolute;left:0;color:var(--line2)}',
    /* A LOCK IS NOT A FADE. Dimming the whole plate dims its text with it and lets the
       page artwork through; the lock is said in words on the meta line instead. */
    '.pa-lock .pa-fig{filter:saturate(.55)}',

    '@media (prefers-reduced-motion: reduce){.pa-bar i{transition:none}}',

    /* ============================ THE TAKE-HOME PACK ============================
       A course that only exists on a screen is a course a family cannot do at the table.
       This is the part that leaves: verse cards, a question for each part to ask at
       dinner, something to do at home, and every project brief with room to write on.
       It is one page, built to be printed or saved as a PDF, and it carries its own
       attribution because a sheet of paper has no tooltip. */
    '.pk-tools{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 16px}',
    '.pk{background:var(--card);border:1px solid var(--line);border-radius:4px;padding:26px}',
    '.pk h1{font:800 30px/1.08 var(--display,Georgia,serif);margin:0 0 6px;letter-spacing:-.015em}',
    '.pk h2{font:800 17px/1.2 var(--display,Georgia,serif);margin:24px 0 8px;' +
      'border-bottom:2px solid var(--text);padding-bottom:6px}',
    '.pk h3{font:800 14.5px/1.25 var(--display,Georgia,serif);margin:16px 0 4px}',
    '.pk p{margin:0 0 8px;font-size:13.5px;line-height:1.62}',
    '.pk .pk-lead{color:var(--muted)}',
    '.pk-verse{border:1px solid var(--line);border-radius:3px;padding:16px;margin:0 0 12px;' +
      'background:var(--ground2);break-inside:avoid}',
    '.pk-sa{font-size:19px;white-space:pre-line;margin:0 0 8px}',
    '.pk-tr{font-style:italic;color:var(--text2);white-space:pre-line;margin:0 0 8px;font-size:13px}',
    '.pk-at{font-size:11.5px;color:var(--muted);margin:8px 0 0}',
    '.pk-mod{break-inside:avoid;margin:0 0 8px}',
    '.pk-q{border-left:3px solid var(--accent2);padding:6px 0 6px 12px;margin:8px 0}',
    '.pk-q b{display:block;font:800 10.5px/1 var(--body);letter-spacing:.11em;' +
      'text-transform:uppercase;color:var(--muted);margin-bottom:3px}',
    '.pk-rule{border-bottom:1px solid var(--line);height:26px}',
    '.pk-foot{margin-top:22px;font-size:11.5px;color:var(--muted);' +
      'border-top:1px solid var(--line);padding-top:10px}',

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
     order to meet it in, not a second copy of it.

     THE CHIP SHOWS THE THING, NOT ITS ROW ID. The first version read
     `story: pt.talkative-tortoise →`, which is a database key shown to an eight-year-old
     in a tab that owns 686 paintings. `api.look` (app.js) hands back the real title, the
     thing's own script with the right lang on it, and its own painting where there is an
     honest one. Where there is no painting the chip is typographic — a plate that
     illustrates a guess is the uncredited texture docs/05 forbids. */
  var USE_LABEL = { st: 'Story', sh: 'Verse', ge: 'Song', ut: 'Festival', ri: 'Relative',
                    it: 'Era', va: 'Value', dh: 'Faith', mb: 'Mahabharata' };
  var USE_VIEW  = { st: 'story', sh: 'shlok', ge: 'song', ut: 'festival', ri: 'rishtey',
                    it: 'era', va: 'value', dh: 'faith', mb: 'epic' };

  function look(kind, id) {
    return (api.look ? api.look(kind, id) : null) || null;
  }

  /* ONE PAINTING, ONE PLACE ON A SCREEN. A value and a faith can honestly derive the same
     plate — ahimsa and Jainism both point at the elephant — and the first lesson screen
     showed that painting twice, side by side, which reads as a bug whatever the data says.
     `taken` is the set already spent on this screen; a chip that would repeat one goes
     typographic instead. Direct references claim theirs first (see `uses`), because a
     story's own painting has the better claim on it than a value that points at it. */
  function chip(kind, id, taken) {
    var r = look(kind, id);
    var view = USE_VIEW[kind] || 'home', label = USE_LABEL[kind] || kind;
    var head = r ? (r.script || r.name) : String(id);
    var lang = r && r.script && r.lang ? ' lang="' + r.lang + '"' : '';
    /* the second line is the name when the script took the first, else the standfirst */
    var second = r ? (r.script ? r.name : r.sub) : '';
    var src = r && r.art && !(taken && taken[r.art]) ? r.art : null;
    if (src && taken) taken[src] = 1;
    var fig = src
      ? '<span class="pa-usefig"><img src="' + esc(src) + '" alt="" loading="lazy" ' +
        'width="120" height="90"></span>'
      : (r && r.face ? '<span class="pa-usefig drawn">' + r.face + '</span>' : '');
    return '<button class="pa-use' + (fig ? ' lit' : '') + '" data-act="go" data-v="' + view +
      '" data-arg="' + esc(id) + '">' + fig +
      '<span class="pa-usetxt"><span class="pa-usekind">' + esc(label) + '</span>' +
      '<b' + lang + '>' + esc(head) + '</b>' +
      (second ? '<i>' + esc(String(second).slice(0, 84)) + '</i>' : '') +
      '</span></button>';
  }

  /* a reference whose painting IS the thing, rather than one hop from it */
  var DIRECT = { st: 1, mb: 1, it: 1 };

  function uses(l) {
    var out = [], taken = {};
    /* two passes, so a direct reference gets its own painting before a derived one can
       spend it — the order the author happened to write the keys in is not a claim */
    var keys = Object.keys(l.use || {});
    keys.sort(function (a, b) { return (DIRECT[b] ? 1 : 0) - (DIRECT[a] ? 1 : 0); });
    keys.forEach(function (k) {
      var v = l.use[k];
      /* bh and sa are a count and a flag, not ids — there is nothing to look up */
      if (k === 'bh') { out.push({ k: k, html: '<button class="pa-use" data-act="go" data-v="bhasha">' +
        '<span class="pa-usetxt"><span class="pa-usekind">Bhasha</span>' +
        '<b>' + v + ' exercises</b><i>in the language pillar</i></span></button>' }); return; }
      if (k === 'sa') { out.push({ k: k, html: '<button class="pa-use" data-act="go" data-v="khel">' +
        '<span class="pa-usetxt"><span class="pa-usekind">Sabhyata</span>' +
        '<b>Build a civilisation</b><i>in Khel</i></span></button>' }); return; }
      if (!Array.isArray(v)) return;
      v.forEach(function (id) { out.push({ k: k, html: chip(k, id, taken) }); });
    });
    /* put them back in the order the lesson wrote them, now that the art is decided */
    out.sort(function (a, b) { return keys.indexOf(a.k) - keys.indexOf(b.k); });
    out = out.map(function (x) { return x.html; });
    if (!out.length) return '';
    return '<div class="pa-secthead"><h3>What this part uses</h3>' +
      '<span>' + out.length + (out.length === 1 ? ' place' : ' places') + '</span></div>' +
      '<div class="pa-uses">' + out.join('') + '</div>';
  }

  /* ---------------------------------------------------------------------- the library */
  /* EVERY NUMBER ON THIS PAGE IS COUNTED HERE, NOT TYPED. Four write-ups in this repo have
     run ahead of the code — "item 23", "55 checks", "five verse cards" — and each time the
     number was the thing a person had written by hand beside code that had moved on. */
  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
               'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
  function roman(n) { return ROMAN[n] || String(n); }

  function library() {
    var t = { hours: 0, mods: 0, lessons: 0, projects: 0, objectives: 0, mastered: 0, made: 0 };
    P.courses.forEach(function (c) {
      var s = stats(c);
      t.hours += c.hours; t.mods += c.modules.length; t.lessons += s.lessons;
      t.projects += s.projects; t.objectives += s.objectives;
      t.mastered += s.mastered; t.made += s.made;
    });
    return t;
  }

  function badge(c) {
    var B = { katha: '🪔 Katha', itihaas: '📜 Itihaas', aaj: '🧭 Aaj', dharma: '🪔 Dharma' };
    return c.badge ? '<span class="pa-badge ' + esc(c.badge) + '">' +
      esc(B[c.badge] || c.badge) + '</span>' : '';
  }

  function hub() {
    styles();
    var t = library();
    var plates = P.courses.map(function (c, i) {
      var s = stats(c), lk = locked(c);
      return '<button class="pa-card' + (lk ? ' pa-lock' : '') + '" data-pa="course" data-id="' +
        esc(c.id) + '" aria-label="' + esc(c.name) + ' — ' + c.hours + ' hours, ' +
        c.modules.length + ' parts, ages ' + c.ages[0] + ' to ' + c.ages[1] + '">' +
        '<span class="pa-fig">' +
          (c.cover ? '<img src="' + esc(c.cover) + '" alt="' + esc(c.coverAlt || '') +
            '" loading="lazy" width="336" height="252">' : '') +
          '<span class="pa-no">Plate ' + roman(i + 1) + '</span>' +
        '</span>' +
        '<span class="pa-body">' +
          '<span class="pa-sub">' + esc(c.sub) + '</span>' +
          '<b>' + esc(c.name) + '</b>' +
          '<span class="pa-t">' + esc(c.blurb) + '</span>' +
          '<span class="pa-meta">' +
            badge(c) +
            '<span class="pa-pill">' + c.hours + ' hours</span>' +
            '<span class="pa-pill">' + c.modules.length + ' parts</span>' +
            '<span class="pa-pill">ages ' + c.ages[0] + '–' + c.ages[1] + '</span>' +
            (lk ? '<span class="pa-pill lock">' + api.icon('lock', 13) +
                  ' a grown-up unlocks this</span>' : '') +
            (s.mastered ? '<span class="pa-pill on">' + s.mastered + ' of ' + s.objectives +
                          ' learned</span>' : '') +
          '</span>' +
          /* a bar at nought is a line that says nothing; it appears when it has news */
          (s.pct ? '<span class="pa-bar"><i style="width:' + s.pct + '%"></i></span>' : '') +
        '</span></button>';
    }).join('');
    return '<div class="pa-wrap"><div class="pa-paper">' +
      '<div class="pa-mast">' +
        '<p class="pa-kick">Bizzing India · <span lang="hi">पाठशाला</span></p>' +
        '<h2>Paathshala</h2>' +
        '<p class="pa-lead">' + esc(P.intro) + '</p>' +
        '<ul class="pa-tally">' +
          '<li><b>' + P.courses.length + '</b>courses</li>' +
          '<li><b>' + t.hours + '</b>hours</li>' +
          '<li><b>' + t.mods + '</b>parts</li>' +
          '<li><b>' + t.projects + '</b>things to make</li>' +
          (t.mastered ? '<li><b>' + t.mastered + ' of ' + t.objectives + '</b>learned</li>' : '') +
          (t.made ? '<li><b>' + t.made + '</b>made</li>' : '') +
        '</ul>' +
      '</div>' +
      '<div class="pa-plates">' + plates + '</div>' +
      /* for the grown-up, at the foot, where a grown-up looks — it used to stand between
         a child and the courses, four lines high */
      '<div class="pa-colophon"><p style="margin:0 0 7px">' + esc(P.parentNote) + '</p>' +
      '<p style="margin:0">Every plate above is a painting or a photograph already in ' +
      'this app, of something the course actually teaches. Nothing here was made to ' +
      'decorate a page.</p></div>' +
      '</div></div>';
  }

  /* ----------------------------------------------------------------- one course */
  function coursePage(id) {
    styles();
    var c = get(id); if (!c) return hub();
    var r = course(c.id), s = stats(c), lk = locked(c);
    var i0 = 0; P.courses.forEach(function (x, i) { if (x.id === c.id) i0 = i; });

    var warn = (c.needsReview && c.needsReview.length)
      ? '<div class="pa-warn"><b>Parts of this course are still being checked by a person.</b>' +
        c.needsReview.map(function (x) { return esc(x); }).join(' ') + '</div>' : '';

    var mods = c.modules.map(function (m, i) {
      var mr = r.m[m.id] || {};
      var lessons = m.lessons.map(function (l) {
        var done = !!r.seen[lid(m, l)];
        var K = l.k === 't' ? 'Learn' : l.k === 'p' ? 'Practise' : 'Check';
        return '<button class="pa-l ' + l.k + (done ? ' done' : '') + '" data-pa="lesson" data-id="' +
          esc(c.id) + '" data-m="' + esc(m.id) + '" data-l="' + esc(l.n) + '">' +
          '<span class="k">' + K + '</span>' +
          '<span>' + esc(l.n) + '</span><i>' + l.m + ' min</i></button>';
      }).join('');
      var made = !!r.made[m.project.id];
      return '<div class="pa-mod' + (mr.on ? ' learned' : '') + '">' +
        '<div class="pa-modno">' + (i + 1) + '</div>' +
        '<div class="pa-modbody">' +
          '<h4>' + esc(m.name) + '</h4>' +
          '<p class="pa-obj">After this part you can <b>' + esc(m.objective) + '</b>.' +
            (mr.on ? ' <span class="pa-pill on">learned</span>' : '') + '</p>' +
          (m.needsReview ? '<div class="pa-warn"><b>A person is still checking this part.</b>' +
            esc(m.needsReview) + '</div>' : '') +
          (m.needsVerse ? '<div class="pa-warn"><b>A verse for this part is still being ' +
            'sourced.</b>This app only shows verses it can attribute. Nothing here is guessed.' +
            '</div>' : '') +
          '<div class="pa-less">' + lessons + '</div>' +
          '<div class="pa-proj"><h5>Project · ' + m.project.m + ' min</h5>' +
          '<b>' + esc(m.project.name) + '</b>' +
          '<p>' + esc(m.project.brief) + '</p>' +
          '<p class="pa-made">You will have made: ' + esc(m.project.made) + '</p>' +
          '<button class="btn' + (made ? '' : ' primary') + '" data-pa="made" data-id="' +
            esc(c.id) + '" data-p="' + esc(m.project.id) + '">' +
            (made ? 'Made it ✓ — undo' : 'I made it') + '</button>' +
          '</div>' +
        '</div></div>';
    }).join('');

    var asg = (c.assignments || []).map(function (a) {
      return '<div class="pa-proj"><h5>' + esc(a.name) +
        (a.family ? ' · with your family' : '') + '</h5><p>' + esc(a.brief) + '</p></div>';
    }).join('');

    return '<div class="pa-wrap">' +
      '<button class="backlink" data-pa="hub">' + api.icon('back', 18) + ' Paathshala</button>' +
      /* THE CHAPTER OPENER. A reference work does not start a chapter with a settings
         panel; it starts with a plate and a title over it. */
      '<div class="pa-hero">' +
        (c.cover ? '<img src="' + esc(c.cover) + '" alt="' + esc(c.coverAlt || '') + '">' : '') +
        '<div class="pa-scrim">' +
          '<p class="pa-kick">Plate ' + roman(i0 + 1) + ' · Paathshala</p>' +
          '<h2>' + esc(c.name) + '</h2>' +
          '<span class="pa-sub">' + esc(c.sub) + '</span>' +
          '<p>' + esc(c.why) + '</p>' +
        '</div>' +
      '</div>' +
      /* docs/05: never uncredited texture. The plate says what it is, every time. */
      (c.coverAlt ? '<p class="pa-credit">Plate: ' + esc(c.coverAlt) + '</p>' : '') +
      '<div class="pa-paper">' +
      '<div class="pa-mast flush">' +
        '<ul class="pa-tally">' +
          '<li><b>' + c.hours + '</b>hours</li>' +
          '<li><b>' + c.modules.length + '</b>parts</li>' +
          '<li><b>' + s.lessons + '</b>lessons</li>' +
          '<li><b>' + s.mastered + ' of ' + s.objectives + '</b>learned</li>' +
          '<li><b>' + s.made + ' of ' + s.projects + '</b>made</li>' +
          '<li><b>' + c.ages[0] + '–' + c.ages[1] + '</b>years old</li>' +
        '</ul>' +
        (s.pct ? '<div class="pa-bar wide"><i style="width:' + s.pct + '%"></i></div>' : '') +
        '<div class="pa-meta">' + badge(c) +
          (lk ? '<span class="pa-pill lock">' + api.icon('lock', 13) +
                ' a grown-up unlocks this</span>' : '') +
          '<button class="btn" data-pa="pack" data-id="' + esc(c.id) + '">' +
            api.icon('print', 16) + ' Take-home pack</button>' +
        '</div>' +
      '</div>' +
      warn +
      '<div class="pa-secthead"><h3>The parts</h3><span>' + c.modules.length +
        ' · three hours each</span></div>' +
      '<div class="pa-mods">' + mods + '</div>' +
      (asg ? '<div class="pa-secthead"><h3>Every week, with your family</h3><span>' +
        (c.assignments || []).length + '</span></div>' + asg : '') +
      '<div class="pa-secthead"><h3>Where this comes from</h3><span>' +
        (c.sources || []).length + ' sources</span></div>' +
      '<ul class="pa-colophon">' +
        (c.sources || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') +
      '</ul>' +
      (c.note ? '<p class="pa-colophon">' + esc(c.note) + '</p>' : '') +
      '</div></div>';
  }

  /* ----------------------------------------------------------------- one lesson */
  function lessonPage(cid, mid, name) {
    styles();
    var c = get(cid), m = modOf(c, mid);
    var l = null;
    m.lessons.forEach(function (x) { if (x.n === name) l = x; });
    if (!l) return coursePage(cid);
    ledger.open(cid, lid(m, l));
    var mi = 0; c.modules.forEach(function (x, i) { if (x.id === m.id) mi = i; });
    var li = 0; m.lessons.forEach(function (x, i) { if (x.n === l.n) li = i; });
    var K = l.k === 't' ? 'Learn' : l.k === 'p' ? 'Practise' : 'Check';
    var body;
    if (l.k === 'c') {
      var r = course(cid), taught = 0;
      m.lessons.forEach(function (x) {
        if (x.k !== 'c' && r.seen[lid(m, x)]) taught = Math.max(taught, r.seen[lid(m, x)]);
      });
      var same = taught === today(), none = !taught;
      body = '<p class="pa-lead">This is the check for <b>' + esc(m.objective) + '</b>.</p>' +
        (none ? '<div class="pa-warn"><b>Do the learning parts first.</b>A check before the ' +
                 'teaching is just a guess, and it will not count.</div>'
              : same ? '<div class="pa-warn"><b>You learned this today.</b>Doing the check now ' +
                       'is good practice, but it will not count as learned. Come back tomorrow ' +
                       'or later in the week and it will — remembering an hour later is ' +
                       'attention, remembering a week later is learning.</div>'
              : '<p class="pa-lead">You learned this on an earlier day, so this one counts.</p>') +
        '<button class="btn primary lg" data-pa="pass" data-id="' + esc(cid) + '" data-m="' +
          esc(mid) + '"' + (none ? ' disabled' : '') + '>I can do it</button>';
    } else {
      body = (l.o ? '<p class="pa-lead">By the end of this you can <b>' + esc(l.o) +
              '</b>.</p>' : '') +
        '<p class="pa-lede2">Everything this part uses is below. Open each one, then come ' +
        'back — the course is the order to meet them in, not a second copy of them.</p>' +
        uses(l);
    }
    var next = m.lessons[li + 1];
    return '<div class="pa-wrap">' +
      '<button class="backlink" data-pa="course" data-id="' + esc(cid) + '">' +
        api.icon('back', 18) + ' ' + esc(c.name) + '</button>' +
      '<div class="pa-paper"><div class="pa-lesson">' +
        '<p class="pa-kick">' + esc(c.name) + ' · Part ' + (mi + 1) + ' · ' + esc(m.name) + '</p>' +
        '<h2>' + esc(l.n) + '</h2>' +
        '<span class="pa-sub">' + K + ' · ' + l.m + ' minutes · lesson ' + (li + 1) +
          ' of ' + m.lessons.length + '</span>' +
        body +
        (next ? '<div class="pa-next"><button class="btn" data-pa="lesson" data-id="' + esc(cid) +
          '" data-m="' + esc(mid) + '" data-l="' + esc(next.n) + '">Next · ' +
          esc(next.n) + ' →</button></div>' : '') +
      '</div></div></div>';
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
