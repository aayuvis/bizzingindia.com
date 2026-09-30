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

    /* ---------- the three stages of a part ---------- */
    /* LEARN IT, TEST YOURSELF, MAKE SOMETHING — numbered, because the order is the
       method and it used to be invisible: four chips in a row and a brief underneath.
       A shut stage is not dimmed, it is CLOSED and says what opens it; dimming a
       paragraph is the readable rule broken, and dimming a lock is how a child decides
       the app is broken rather than that they have not got there yet. */
    '.pa-stage{border-top:1px solid var(--line);padding:13px 0 0;margin:12px 0 0}',
    '.pa-stage:first-of-type{border-top:0;padding-top:0;margin-top:2px}',
    '.pa-stagehead{display:flex;align-items:baseline;gap:9px;margin:0 0 9px}',
    '.pa-sno{flex:none;width:19px;height:19px;border-radius:50%;background:var(--text);' +
      'color:var(--card);font:800 11px/19px var(--body);text-align:center}',
    '.pa-stage.shut .pa-sno{background:var(--line2);color:var(--card)}',
    '.pa-stagehead b{font:800 13px/1.2 var(--body);letter-spacing:.02em}',
    '.pa-stagehead span{font:700 10.5px/1.3 var(--body);letter-spacing:.1em;' +
      'text-transform:uppercase;color:var(--muted)}',
    '.pa-note{margin:8px 0 0;font-size:12px;line-height:1.5;color:var(--muted)}',
    '.pa-note.ok{color:var(--accent)}',
    '.pa-shutsay{margin:0;font-size:12.5px;line-height:1.55;color:var(--text2);' +
      'display:flex;gap:7px;align-items:flex-start}',
    '.pa-shutsay svg{flex:none;margin-top:2px}',
    '.pa-pname{display:block;font:800 15px/1.25 var(--display,Georgia,serif);margin:12px 0 5px}',

    /* the door into the workshop — the one thing on a part that is done in the app */
    '.pa-open{display:block;width:100%;text-align:left;border:1px solid var(--accent);' +
      'background:var(--accent-soft);border-radius:4px;padding:11px 13px;cursor:pointer;' +
      'font:inherit;color:inherit;margin:0 0 4px}',
    '.pa-open:hover{background:var(--card);box-shadow:0 2px 10px rgba(30,20,64,.10)}',
    '.pa-open:focus-visible{outline:2px solid var(--accent);outline-offset:1px}',
    '.pa-open b{display:block;font:800 14.5px/1.3 var(--display,Georgia,serif);margin:2px 0 2px}',
    '.pa-open i{display:block;font-style:normal;font-size:11.5px;color:var(--muted)}',
    '.pa-open .pa-pill{margin-top:6px}',

    /* ============================== THE COURSE ATLAS ==============================
       Bizzing Finance's Money Atlas (app/styles/app.css .aboard/.apin/.act/.rail/.stop),
       which is Bizzing Bee's Word Atlas: the same sizes, the same gold for what is
       walked, the same companion on the pin you are standing at. --ja is the course's
       own colour, the way each Finance world carries its tint. */
    '.pa-atitle{display:flex;justify-content:space-between;align-items:flex-end;gap:14px;' +
      'flex-wrap:wrap;margin:0 0 12px}',
    '.pa-atitle h2{font:800 clamp(24px,3.6vw,34px)/1.08 var(--display,Georgia,serif);margin:0;' +
      'letter-spacing:-.015em}',
    '.pa-atools{display:flex;gap:6px;flex-wrap:wrap;align-items:center}',
    '.pa-tpill{display:inline-flex;align-items:center;gap:5px;font:700 11.5px/1 var(--body);' +
      'padding:8px 12px;border-radius:999px;background:var(--card);border:1px solid var(--line);' +
      'color:var(--text2);min-height:32px}',
    '.pa-tpill.act{cursor:pointer;color:var(--accent);border-color:var(--accent)}',
    '.pa-tpill.act:hover{background:var(--accent-soft)}',

    /* the board */
    '.pa-boardwrap{border-radius:22px;overflow-x:auto;overflow-y:hidden;' +
      'box-shadow:0 2px 6px rgba(12,30,34,.08),0 14px 34px rgba(12,30,34,.14);' +
      '-webkit-overflow-scrolling:touch;scrollbar-width:thin}',
    '.pa-board{position:relative;background:var(--ground2)}',
    /* the board's own painting ONLY — `.pa-board img` also caught the companion on the
       pin you are standing at and stretched it across the whole pin */
    '.pa-board>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}',
    /* the painting is a place, not a background to read over — so the veil only deepens
       it enough for white pins to hold, and leaves the picture a picture */
    '.pa-boardveil{position:absolute;inset:0;background:' +
      'radial-gradient(ellipse at center,rgba(20,13,34,.12) 0%,rgba(20,13,34,.46) 100%)}',
    '.pa-route{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;' +
      'filter:drop-shadow(0 1px 3px rgba(24,14,4,.55))}',
    '.pa-pin{position:absolute;transform:translate(-50%,-50%);display:grid;justify-items:center;' +
      'gap:5px;z-index:2;font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}',
    '.pa-pin:focus-visible .pa-dot{outline:3px solid #FFD24D;outline-offset:3px}',
    '.pa-dot{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;' +
      'background:rgba(22,30,34,.6);border:2px solid rgba(255,255,255,.82);' +
      'box-shadow:0 4px 12px rgba(10,20,24,.45);color:#fff;overflow:hidden;' +
      'font:800 15px/1 var(--display,Georgia,serif)}',
    '.pa-dot img,.pa-dot svg{width:36px;height:36px;display:block}',
    '.pa-pin.cur{z-index:3}',
    '.pa-pin.cur .pa-dot{width:56px;height:56px;border-color:#fff;' +
      'background:linear-gradient(160deg,var(--ja),color-mix(in srgb,var(--ja) 55%,#1a2a2e));' +
      'box-shadow:0 0 0 5px color-mix(in srgb,var(--ja) 35%,transparent),0 6px 16px rgba(10,20,24,.5)}',
    '.pa-pin.cur .pa-dot img,.pa-pin.cur .pa-dot svg{width:46px;height:46px}',
    '.pa-pin.done .pa-dot{background:linear-gradient(160deg,#FFD24D,#C8791B);color:#4A2E00;border-color:#FFE9A8}',
    '.pa-pin.part .pa-dot{border-color:#FFD24D}',
    '.pa-chip{display:grid;background:rgba(14,24,28,.8);color:#fff;border-radius:12px;padding:5px 10px;' +
      'text-align:center;border:1px solid rgba(255,255,255,.18);max-width:132px}',
    '.pa-chip b{font:800 12px/1.2 var(--display,Georgia,serif);display:-webkit-box;' +
      '-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
    '.pa-chip i{font-style:normal;font-size:10.5px;opacity:.85;font-weight:700;margin-top:1px}',
    '.pa-pin.cur .pa-chip{border-color:color-mix(in srgb,var(--ja) 70%,#fff)}',
    '.pa-pin:hover .pa-chip{background:rgba(14,24,28,.94)}',
    /* on paper, like everything else that is read — the mural runs under this line */
    '.pa-here{margin:10px 0 0;padding:10px 14px;font-size:13px;color:var(--muted);' +
      'background:var(--card);border:1px solid var(--line);border-radius:14px}',
    '.pa-here b{color:var(--text)}',
    '.pa-herecred{display:block;margin-top:4px;font:700 10.5px/1.4 var(--body);color:var(--muted);' +
      'letter-spacing:.03em}',
    '.pa-atlas .pa-here{margin-bottom:16px}',
    '@media (max-width:620px){.pa-chip{max-width:108px;padding:4px 7px}.pa-chip b{font-size:11px}' +
      '.pa-dot{width:38px;height:38px}.pa-pin.cur .pa-dot{width:48px;height:48px}' +
      '.pa-pin.cur .pa-dot img,.pa-pin.cur .pa-dot svg{width:40px;height:40px}}',

    /* a part: the painted banner */
    '.pa-act{position:relative;border-radius:18px;overflow:hidden;background:var(--card);margin:0 0 8px;' +
      'box-shadow:0 0 0 1px var(--line),0 2px 6px rgba(12,30,34,.04),0 14px 34px rgba(12,30,34,.06)}',
    '.pa-act.here{box-shadow:0 0 0 2px color-mix(in srgb,var(--ja) 65%,var(--line)),0 14px 34px rgba(12,30,34,.10)}',
    '.pa-actban{position:relative;display:block;width:100%;height:86px;border:0;padding:0;' +
      'cursor:pointer;text-align:left;font:inherit;' +
      'background:var(--plate) center 38%/cover no-repeat;' +
      'background-color:color-mix(in srgb,var(--ja) 40%,#1a2a2e)}',
    '.pa-act.open .pa-actban{height:132px}',
    /* THE WORDS BANNER. The course's colour, deepened, with the part's own words set
       large and pale in their own script on the right — the lang attribute picks the
       real face, so Devanagari keeps its shirorekha and Tamil stays Tamil. */
    '.pa-actban.words{background:linear-gradient(120deg,color-mix(in srgb,var(--ja) 88%,#1a1030),' +
      'color-mix(in srgb,var(--ja) 55%,#140c24))}',
    '.pa-actwords{position:absolute;right:84px;top:0;bottom:0;display:flex;align-items:center;gap:22px;' +
      'color:rgba(255,255,255,.26);font-size:34px;line-height:1.7;white-space:nowrap;overflow:hidden;' +
      'max-width:62%;justify-content:flex-end;pointer-events:none}',
    '.pa-act.open .pa-actwords{font-size:42px}',
    '.pa-actwords.num{font:800 86px/1 var(--display,Georgia,serif);color:rgba(255,255,255,.16);' +
      'letter-spacing:-.04em}',
    '.pa-act.open .pa-actwords.num{font-size:112px}',
    '.pa-actban.words .pa-actscrim{background:linear-gradient(90deg,rgba(14,22,26,.34) 0%,rgba(14,22,26,0) 55%)}',
    '@media (max-width:620px){.pa-actwords{right:64px;font-size:26px;gap:14px;max-width:55%}}',
    '.pa-actban:focus-visible{outline:3px solid #FFD24D;outline-offset:-3px}',
    '.pa-actscrim{position:absolute;inset:0;background:linear-gradient(180deg,' +
      'rgba(14,22,26,.20) 0%,rgba(14,22,26,.30) 45%,rgba(14,22,26,.82) 100%)}',
    '.pa-actrow{position:absolute;left:16px;right:16px;bottom:12px;display:flex;align-items:flex-end;gap:12px}',
    '.pa-actno{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;' +
      'background:rgba(255,255,255,.92);color:var(--text);font:800 17px/1 var(--display,Georgia,serif);' +
      'box-shadow:0 3px 8px rgba(0,0,0,.35)}',
    '.pa-act.here .pa-actno{background:var(--ja);color:#fff}',
    '.pa-acttext{flex:1;min-width:0;display:grid}',
    '.pa-acttext b{font:800 18px/1.15 var(--display,Georgia,serif);color:#fff;' +
      'text-shadow:0 2px 8px rgba(0,0,0,.6)}',
    '.pa-acttext i{font-style:normal;font:700 11.5px/1.3 var(--body);color:rgba(255,255,255,.9);' +
      'text-shadow:0 1px 4px rgba(0,0,0,.6);margin-top:3px;letter-spacing:.02em}',
    '.pa-ring{position:relative;display:inline-grid;place-items:center;flex:none}',
    '.pa-ring svg{position:absolute;inset:0;width:100%;height:100%}',
    '.pa-ring b{position:relative;font:800 11px/1 var(--display,Georgia,serif);color:#fff;' +
      'text-shadow:0 1px 3px rgba(0,0,0,.6)}',

    /* the rail */
    '.pa-railwrap{padding:14px 16px 16px}',
    '.pa-railwrap .pa-obj{margin:0 0 10px;font-size:13px}',
    '.pa-rail{position:relative}',
    '.pa-railline{position:absolute;left:17px;top:24px;bottom:24px;width:2px;border-radius:2px;background:var(--line)}',
    '.pa-railline span{position:absolute;left:0;right:0;top:0;border-radius:2px;' +
      'background:linear-gradient(180deg,#FFD24D,#E0922E);box-shadow:0 0 8px rgba(240,180,41,.45)}',
    '.pa-stop{position:relative;display:block;width:100%;text-align:left;padding:10px 12px 10px 52px;' +
      'margin:0 0 2px;border-radius:14px;font:inherit;color:inherit;background:transparent;border:0;' +
      'cursor:pointer;min-height:44px}',
    '.pa-stop:hover{background:var(--ground2)}',
    '.pa-stop:focus-visible{outline:2px solid var(--accent);outline-offset:1px}',
    'div.pa-stop{cursor:default}',
    'div.pa-stop:hover{background:transparent}',
    '.pa-stop.cur{padding:15px 16px 15px 52px;margin:4px 0 10px;cursor:pointer;' +
      'background:linear-gradient(150deg,color-mix(in srgb,var(--ja) 14%,var(--card)),var(--card) 62%);' +
      'box-shadow:0 0 0 1px color-mix(in srgb,var(--ja) 45%,var(--line)),0 6px 18px rgba(12,30,34,.12)}',
    'div.pa-stop.cur:hover{background:linear-gradient(150deg,color-mix(in srgb,var(--ja) 14%,var(--card)),var(--card) 62%)}',
    '.pa-med{position:absolute;left:0;top:12px;width:36px;height:36px;border-radius:50%;display:grid;' +
      'place-items:center;z-index:2;font:800 14px/1 var(--display,Georgia,serif);background:var(--card);' +
      'border:1.5px solid var(--line2);color:var(--muted);overflow:hidden}',
    '.pa-stop.cur .pa-med{top:16px}',
    '.pa-med img,.pa-med svg{width:30px;height:30px;display:block}',
    '.pa-med.passed{background:linear-gradient(160deg,#FFD24D,#E0922E);color:#4A2E00;border:0;' +
      'box-shadow:0 2px 6px rgba(200,121,27,.34);font-size:16px}',
    '.pa-med.cur{background:linear-gradient(160deg,var(--ja),color-mix(in srgb,var(--ja) 55%,#1a2a2e));' +
      'border:0;box-shadow:0 0 0 4px color-mix(in srgb,var(--ja) 24%,transparent),0 3px 9px rgba(26,18,54,.28)}',
    '.pa-med.chk{border-style:dashed}',
    '.pa-med.locked{background:var(--ground2)}',
    '.pa-stbody{display:grid;gap:2px;min-width:0}',
    '.pa-sttag{font:800 10px/1.3 var(--body);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}',
    '.pa-stop.cur .pa-sttag{color:var(--ja)}',
    '.pa-sttitle{font:600 15px/1.25 var(--display,Georgia,serif)}',
    '.pa-stop.cur .pa-sttitle{font-weight:800;font-size:17px}',
    '.pa-stop.passed .pa-sttitle{font-weight:700}',
    '.pa-stop.locked .pa-sttitle{color:var(--text2)}',
    '.pa-stblurb{font-size:12.5px;line-height:1.5;margin-top:5px;color:var(--text2);max-width:56ch}',
    '.pa-stgo{display:inline-flex;align-items:center;margin-top:11px;padding:10px 18px;border-radius:999px;' +
      'background:var(--accent);color:#fff;font:800 13.5px/1 var(--body);justify-self:start}',
    '.pa-strow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}',
    '.pa-go{display:inline-flex;align-items:center;padding:10px 16px;border-radius:999px;min-height:40px;' +
      'background:var(--accent);color:#fff;font:800 13px/1 var(--body);border:0;cursor:pointer}',
    '.pa-go.ghost{background:var(--card);color:var(--text);box-shadow:0 0 0 1px var(--line2)}',
    '.pa-go:focus-visible{outline:2px solid var(--accent2);outline-offset:2px}',

    /* ON PAPER. The first atlas left this on the page itself, and the bazaar mural ran
       through "Why this course" — the same fault the hub had before it got .pa-paper. */
    '.pa-afoot{margin:18px 0 0;padding:16px 20px;border:1px solid var(--line);border-radius:18px;' +
      'background:var(--card);box-shadow:var(--shadow);' +
      'font-size:12.5px;line-height:1.6;color:var(--muted)}',
    '.pa-afoot p{margin:0 0 8px}',
    '.pa-afoot b{color:var(--text2)}',
    '.pa-afoot ul{margin:0;padding-left:18px}',
    '@media (max-width:620px){' +
      '.pa-actban{height:80px}.pa-act.open .pa-actban{height:116px}' +
      '.pa-acttext b{font-size:16px}.pa-railwrap{padding:12px 10px 14px}' +
      '.pa-atitle{align-items:flex-start}}',

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

    /* ============================== THE WORKSHOP ==============================
       The board a project is actually done on. The keypad is this SCRIPT'S own letters,
       so it is wide and it has to stay tappable on a phone — every key is at least 38px
       and the rows wrap rather than scroll, because a keyboard you have to scroll is a
       keyboard with letters you never find. */
    '.ky{margin:18px 0 8px}',
    '.kyhead{margin:0 0 12px}',
    '.kyhead .mono{display:block;margin:0 0 3px}',
    '.kyhead h3{font:800 18px/1.2 var(--display,Georgia,serif);margin:0 0 5px}',
    '.kyhead p{margin:0;font-size:13px;line-height:1.55;color:var(--text2);max-width:58ch}',
    '.kyclue{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:0 0 10px;' +
      'font:800 15px/1.3 var(--display,Georgia,serif)}',
    '.kyclue span{font:700 12px/1 var(--body);letter-spacing:.08em;text-transform:uppercase;' +
      'color:var(--muted)}',
    '.kybox{min-height:74px;border:1.5px solid var(--line2);border-radius:6px;' +
      'background:var(--card2);padding:14px 16px;font-size:34px;line-height:1.5;' +
      'display:flex;align-items:center;flex-wrap:wrap;word-break:break-word}',
    '.kycaret{display:inline-block;width:2px;height:30px;background:var(--accent);' +
      'animation:kyblink 1s steps(2) infinite}',
    '@keyframes kyblink{50%{opacity:0}}',
    '@media (prefers-reduced-motion:reduce){.kycaret{animation:none}}',
    '.kykeys{display:flex;flex-direction:column;gap:6px;margin:12px 0 0}',
    '.kyrow{display:flex;flex-wrap:wrap;gap:5px}',
    '.kykey{min-width:40px;min-height:40px;padding:4px 8px;border:1px solid var(--line);' +
      'border-radius:5px;background:var(--card);cursor:pointer;font-size:19px;line-height:1.35}',
    '.kykey:hover{border-color:var(--accent);background:var(--accent-soft)}',
    '.kykey:focus-visible{outline:2px solid var(--accent);outline-offset:1px}',
    '.kykey:disabled{opacity:.45;cursor:not-allowed}',
    /* the sign row is what the abugida model is about, so it is marked as its own thing */
    '.kyrow.km .kykey{background:var(--accent-soft);border-color:var(--accent-soft)}',
    '.kyrow2{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 8px}',

    /* what the app decided, and WHICH of the two things it decided */
    '.kysay{border-left:4px solid var(--accent2);background:var(--ground2);' +
      'border-radius:0 6px 6px 0;padding:12px 14px;margin:14px 0 0}',
    '.kysay.good{border-left-color:var(--accent)}',
    '.kysay b{display:block;font:800 15px/1.25 var(--display,Georgia,serif);margin:0 0 4px}',
    '.kysay p{margin:0;font-size:13px;line-height:1.55;color:var(--text2)}',
    /* THE HONEST LINE. Not a footnote — it is the answer to "how was this marked", and a
       child told "correct" about their own name deserves to be told by what. */
    '.kysay .kyhow{margin:8px 0 0;font-size:11.5px;line-height:1.5;color:var(--muted);' +
      'font-style:italic}',

    /* pairing — two columns, prompts on the left, answers on the right */
    '.kymatch{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0 0}',
    '.kycol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
    '.kyp,.kya{display:block;width:100%;text-align:left;font:inherit;color:inherit;' +
      'border:1px solid var(--line);border-radius:5px;background:var(--card);' +
      'padding:9px 11px;cursor:pointer;min-height:44px}',
    '.kyp:hover,.kya:hover{border-color:var(--accent)}',
    '.kyp:focus-visible,.kya:focus-visible{outline:2px solid var(--accent);outline-offset:1px}',
    /* the one waiting for its pair is unmistakable — a child has to know what the next
       tap will do */
    '.kyp.on{border-color:var(--accent);background:var(--accent-soft);' +
      'box-shadow:0 0 0 2px var(--accent) inset}',
    '.kyp.set{border-color:var(--accent-soft)}',
    '.kypq{display:block;font:800 15px/1.3 var(--display,Georgia,serif)}',
    '.kypa{display:block;margin-top:3px;font-size:12px;color:var(--accent);font-weight:700}',
    '.kypa.dim{color:var(--muted);font-weight:500}',
    '.kya{font-size:13.5px;line-height:1.35}',
    /* a used answer SAYS it is used rather than fading out — a faded button reads as a
       broken one to a six-year-old */
    '.kya.used{background:var(--ground2);color:var(--muted);text-decoration:line-through;' +
      'text-decoration-color:var(--line2);cursor:default}',
    '@media (max-width:560px){.kymatch{grid-template-columns:1fr}' +
      '.kycol.right{border-top:1px dashed var(--line2);padding-top:10px}}',

    /* putting things in order */
    '.kyorder{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}',
    '.kyorder li{display:flex;align-items:center;gap:11px;border:1px solid var(--line);' +
      'border-radius:5px;background:var(--card);padding:9px 11px}',
    '.kyno{flex:none;width:24px;height:24px;border-radius:50%;background:var(--accent-soft);' +
      'color:var(--accent);font:800 12px/24px var(--body);text-align:center}',
    '.kytxt{flex:1;min-width:0;font-size:13.5px;line-height:1.4}',
    '.kymv{flex:none;display:flex;gap:4px}',
    '.kymv .btn{min-width:38px;min-height:38px;padding:0}',
    '@media (max-width:560px){.kybox{font-size:28px;min-height:62px;padding:11px 12px}' +
      '.kykey{min-width:38px;min-height:38px;font-size:17px}}',

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
  /* THEY ARE COURSES, NOT PLATES. "Plate" is what a printer calls a picture in a
     reference book, and using it here was the atlas idea worn as a costume: a nine-year
     -old opening a tab called Paathshala sees ten COURSES. The layout borrowed from an
     atlas was right; the vocabulary was not, and a name nobody outside the room uses is
     a name that makes the reader feel outside the room. */

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
          '<span class="pa-no">Course ' + (i + 1) + '</span>' +
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
  /* ================================================================ THE COURSE ATLAS
     A COURSE IS A MAP YOU WALK. That is what "atlas" means in the family, and this page
     spent three versions not knowing it: first as grey boxes, then as a reference book —
     numerals, rules, a wall of stages for every part at once. Bizzing Bee's Word Atlas
     and Bizzing Finance's Money Atlas (app/src/atlas.js) are the model, and this is
     their grammar exactly:

       THE BOARD   the course's own painting, with its parts as pins on a dotted route.
                   The walked part of the route is gold, and the pin you are standing at
                   wears your companion's face.
       A PART      a painted banner with a ring round how much of it is walked.
       THE RAIL    the part's stops — learn, practise, test, make — on one line that
                   fills gold behind you. The stop you are at is open and says Continue;
                   what is ahead recedes; nothing behind you ever fades.

     ONLY THE PART BEING WALKED IS OPEN. The last version rendered every stage of every
     part — fourteen of them, three stages each — and read as a form. A child sees the
     board, the part they are on, and the others as banners to tap. Every state on this
     page is read from the course record; the frontier is the first stop not yet done,
     in the course's own order, and nothing here stores its own idea of progress. */

  var openPart = {};          /* per course: the part a child tapped open, if they did */

  /* every stop of a course, in walking order, with its state read off the record */
  function stopsOf(c) {
    var r = course(c.id), out = [];
    c.modules.forEach(function (m, mi) {
      var passed = !!(r.m[m.id] || {}).on, tried = !!(r.m[m.id] || {}).tries;
      m.lessons.forEach(function (l) {
        if (l.k === 'c') {
          out.push({ kind: 'test', m: m, mi: mi, l: l, done: passed, tried: tried });
        } else {
          out.push({ kind: l.k === 't' ? 'learn' : 'practise', m: m, mi: mi, l: l,
                     done: !!r.seen[lid(m, l)] });
        }
      });
      out.push({ kind: 'make', m: m, mi: mi, done: !!r.made[m.project.id],
                 locked: !passed, work: W.IND_KARYA && W.IND_KARYA.has(m.project)
                   ? W.IND_KARYA.rec(m.project.id) : null });
    });
    var fr = -1;
    out.forEach(function (s, i) { s.i = i; if (fr < 0 && !s.done) fr = i; });
    /* A LOCKED PROJECT IS NOT WHERE YOU ARE STANDING. If the first thing not done is a
       project whose test has not passed, the frontier is the test — the thing that
       actually opens next — not a door the child cannot go through. */
    if (fr >= 0 && out[fr].kind === 'make' && out[fr].locked) {
      for (var k = fr - 1; k >= 0; k--) if (out[k].kind === 'test' && out[k].mi === out[fr].mi) { fr = k; break; }
    }
    out.forEach(function (s, i) { s.cur = i === fr; });
    return { list: out, frontier: fr };
  }
  function partStat(st, mi) {
    var ns = st.list.filter(function (s) { return s.mi === mi; });
    var done = ns.filter(function (s) { return s.done; }).length;
    return { total: ns.length, done: done, here: ns.some(function (s) { return s.cur; }),
             cleared: done === ns.length };
  }

  /* A PART'S PICTURE is the painting of something that part actually teaches — the
     first story, episode, era or value its lessons point at that has one — and the
     course's own cover when none does. Never an unrelated painting chosen to look nice. */
  /* ONE PICTURE PER PART, AND NEVER THE SAME ONE TWICE. The first atlas gave most parts
     the course cover — Epics, Utsav, Rishtey and Geet had one picture for every part —
     because a part's lessons often point at nothing with a painting. So a part's
     candidates are, in order:

       1. what its lessons point at, and every painted card of it (`look().alts`)
       2. what its own workshop task is built from (`task.about`, written by
          tools/gen-paath-tasks.js out of the same lookup that produced the facts) —
          a Ramayana episode, the states a river runs through, where a festival is kept
       3. and where there is still no painting nobody has used: THE PART'S OWN WORDS, in
          their own script, on the course's colour. दादा दादी on a Rishtey banner, the
          rhyme's words on a Geet one. It is graphical and it is the content — a borrowed
          picture would be decoration, which docs/05 calls uncredited texture.

     The board already shows the cover, so no banner repeats it. */
  function partArts(c) {
    var used = {}, out = [];
    if (c.cover) used[c.cover] = 1;
    c.modules.forEach(function (m) {
      var refs = [];
      m.lessons.forEach(function (l) {
        Object.keys(l.use || {}).forEach(function (k) {
          if (Array.isArray(l.use[k])) l.use[k].forEach(function (id) { refs.push([k, id]); });
        });
      });
      var T0 = m.project && m.project.task;
      ((T0 && T0.about) || []).forEach(function (ref) {
        var i = ref.indexOf(':');
        if (i > 0) refs.push([ref.slice(0, i), ref.slice(i + 1)]);
      });
      var cands = [], words = [];
      refs.forEach(function (rf) {
        var x = look(rf[0], rf[1]);
        if (!x) return;
        if (x.art) cands.push({ src: x.art, cap: x.cap || x.name });
        (x.alts || []).forEach(function (a) { cands.push({ src: a, cap: x.cap || x.name }); });
        if (x.script && words.length < 4 && words.every(function (w) { return w.t !== x.script; }))
          words.push({ t: x.script, lang: x.lang || '' });
      });
      /* the task's own Devanagari counts as the part's words too */
      if (T0 && words.length < 4) {
        [T0.target, T0.letter].concat((T0.pairs || []).map(function (pr) { return pr[0]; }))
          .forEach(function (t) {
            if (t && /[ऀ-ॿ]/.test(t) && words.length < 4 &&
                words.every(function (w) { return w.t !== t; })) words.push({ t: t, lang: 'hi' });
          });
      }
      var pick = null;
      for (var i = 0; i < cands.length && !pick; i++) if (!used[cands[i].src]) pick = cands[i];
      if (pick) { used[pick.src] = 1; out.push(pick); }
      else out.push({ src: null, words: words, cap: '' });
    });
    return out;
  }
  function partArt(c, m) {
    var arts = partArts(c), i = c.modules.indexOf(m);
    return arts[i] || { src: null, words: [] };
  }

  function face(n) { return api.face ? api.face(n) : ''; }

  /* the ring round a part's banner — Finance's, drawn the same way */
  function ring(done, total, size, col) {
    var R = (size - 6) / 2, C = 2 * Math.PI * R, pct = total ? done / total : 0;
    return '<span class="pa-ring" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + R + '" fill="rgba(10,20,24,.34)" ' +
        'stroke="rgba(255,255,255,.3)" stroke-width="3"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + R + '" fill="none" stroke="' + col + '" ' +
        'stroke-width="3.4" stroke-linecap="round" stroke-dasharray="' + (C * pct).toFixed(1) + ' ' +
        C.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg>' +
      '<b>' + done + '/' + total + '</b></span>';
  }

  /* THE BOARD. The covers are paintings, not maps, so the route is DRAWN on them rather
     than measured off a painted road the way Finance's is — and it is a snake, row by
     row, like a board game, because that reads at a glance and holds seven parts or
     fourteen without a single pin crowding another. */
  function board(c, st) {
    /* ON A PHONE THE SNAKE FOLDS TIGHTER — three to a row, taller rows — rather than
       scrolling sideways. The first version kept five columns and forced the board to
       560px inside a scroller, which crushed the rows together and, worse, put the pin
       you are standing at off the right edge of the screen: the one thing on the board
       a child most needs to see was the one thing they could not. */
    var narrow = (W.innerWidth || 1024) < 620;
    var n = c.modules.length, cols = narrow ? 3 : (n <= 8 ? 4 : 5), rows = Math.ceil(n / cols);
    var gap = narrow ? 190 : 150, Wd = narrow ? 600 : 900;
    var H = (narrow ? 118 : 120) + (rows - 1) * gap + (narrow ? 110 : 110);
    var pins = c.modules.map(function (m, i) {
      var row = Math.floor(i / cols), col = i % cols;
      if (row % 2) col = cols - 1 - col;                     /* the snake turns */
      var inRow = Math.min(cols, n - row * cols);
      /* a short last row sits under the columns it continues from, not squashed left */
      var span = (cols - 1) || 1;
      var x = narrow ? 17 + col * (66 / span) : 11 + col * (78 / span);
      var y = ((narrow ? 118 : 120) + row * gap) / H * 100;
      return { m: m, i: i, x: x, y: y };
    });
    var curI = -1;
    pins.forEach(function (p) { if (partStat(st, p.i).here) curI = p.i; });
    var d = pins.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ');
    var walked = curI > 0 ? pins.slice(0, curI + 1).map(function (p, i) {
      return (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ') : '';
    var route = '<svg class="pa-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + d + '" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1" ' +
        'stroke-dasharray="1.4 2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
      (walked ? '<path d="' + walked + '" fill="none" stroke="#FFD24D" stroke-width="3" ' +
        'stroke-linecap="round" vector-effect="non-scaling-stroke"/>' : '') + '</svg>';
    var cells = pins.map(function (p) {
      var ps = partStat(st, p.i);
      var state = ps.cleared ? 'done' : ps.here ? 'cur' : ps.done ? 'part' : 'ahead';
      return '<button class="pa-pin ' + state + '" data-pa="part" data-id="' + esc(c.id) +
        '" data-m="' + esc(p.m.id) + '" style="left:' + p.x.toFixed(1) + '%;top:' + p.y.toFixed(1) + '%" ' +
        'aria-label="Part ' + (p.i + 1) + ': ' + esc(p.m.name) + ', ' + ps.done + ' of ' + ps.total + ' stops">' +
        '<span class="pa-dot">' + (state === 'cur' && face(34) ? face(34)
          : '<b>' + (state === 'done' ? '★' : (p.i + 1)) + '</b>') + '</span>' +
        '<span class="pa-chip"><b>' + esc(p.m.name) + '</b><i>' + ps.done + '/' + ps.total + '</i></span>' +
        '</button>';
    }).join('');
    return '<div class="pa-boardwrap"><div class="pa-board" style="aspect-ratio:' + Wd + '/' + H + '">' +
      '<img src="' + esc(c.cover) + '" alt="' + esc(c.coverAlt || '') + '">' +
      '<span class="pa-boardveil"></span>' + route + cells + '</div></div>';
  }

  /* one stop on a part's rail */
  function stopRow(c, s) {
    var P0 = s.m.project, kind = s.done ? 'passed' : s.cur ? 'cur' : s.locked ? 'locked' : 'open';
    var med = kind === 'passed' ? '<span class="pa-med passed">✓</span>'
      : kind === 'cur' ? '<span class="pa-med cur">' + (face(30) || '●') + '</span>'
      : kind === 'locked' ? '<span class="pa-med locked">' + api.icon('lock', 13) + '</span>'
      : '<span class="pa-med' + (s.kind === 'test' ? ' chk' : '') + '">' +
          (s.kind === 'test' ? '◆' : s.kind === 'make' ? '✎' : '·') + '</span>';
    var LBL = { learn: 'Learn', practise: 'Practise', test: 'Test', make: 'Make' };

    if (s.kind === 'make') {
      var inner = '<span class="pa-sttag">' + LBL.make + ' · ' + P0.m + ' min</span>' +
        '<span class="pa-sttitle">' + esc(P0.name) + '</span>';
      if (s.locked) {
        /* a lock that says what opens it — never a dimmed paragraph */
        return '<div class="pa-stop locked">' + med + '<span class="pa-stbody">' + inner +
          '<span class="pa-stblurb">Opens when you pass the test above.</span></span></div>';
      }
      var hasWork = W.IND_KARYA && W.IND_KARYA.has(P0);
      return '<div class="pa-stop ' + kind + '">' + med + '<span class="pa-stbody">' + inner +
        (s.cur ? '<span class="pa-stblurb">' + esc(P0.brief) + '</span>' : '') +
        '<span class="pa-strow">' +
          (hasWork ? '<button class="pa-go" data-pa="karya" data-id="' + esc(c.id) + '" data-p="' +
            esc(P0.id) + '">' + esc(P0.task.title || 'Do it here first') + ' →</button>' : '') +
          '<button class="pa-go ' + (hasWork ? 'ghost' : '') + '" data-pa="made" data-id="' +
            esc(c.id) + '" data-p="' + esc(P0.id) + '">' +
            (s.done ? 'Made it ✓ — undo' : 'I made it, on paper') + '</button>' +
          (s.work && s.work.by ? '<span class="pa-pill on">' +
            (s.work.by === 'app' ? 'marked' : 'kept') + '</span>' : '') +
        '</span></span></div>';
    }

    var L = s.l;
    return '<button class="pa-stop ' + kind + (s.kind === 'test' ? ' chk' : '') +
      '" data-pa="lesson" data-id="' + esc(c.id) + '" data-m="' + esc(s.m.id) + '" data-l="' + esc(L.n) + '">' +
      med + '<span class="pa-stbody">' +
        '<span class="pa-sttag">' + LBL[s.kind] + ' · ' + L.m + ' min' +
          (s.kind === 'test' ? ' · on another day' : '') + '</span>' +
        '<span class="pa-sttitle">' + esc(L.n) + '</span>' +
        (s.cur && L.o ? '<span class="pa-stblurb">By the end you can ' + esc(L.o) + '.</span>' : '') +
        (s.kind === 'test' && s.tried && !s.done
          ? '<span class="pa-stblurb">Tried on the day it was taught — that is practice. ' +
            'Come back another day and it counts.</span>' : '') +
        (s.cur ? '<span class="pa-stgo">Continue →</span>' : '') +
      '</span></button>';
  }

  /* one part: its painted banner, and — only if it is the open one — its rail */
  function partSection(c, st, mi, open) {
    var m = c.modules[mi], ps = partStat(st, mi), art = partArt(c, m);
    var ns = st.list.filter(function (s) { return s.mi === mi; });
    var status = ps.here ? 'you are here' : ps.cleared ? 'cleared' : ps.done ? 'in progress' : 'ahead';
    var pct = ns.length ? Math.round(ps.done / ns.length * 100) : 0;
    return '<section class="pa-act' + (ps.here ? ' here' : '') + (open ? ' open' : '') +
      '" id="pa-part-' + esc(m.id) + '">' +
      '<button class="pa-actban' + (art.src ? '' : ' words') + '" data-pa="part" data-id="' +
        esc(c.id) + '" data-m="' + esc(m.id) + '" aria-expanded="' + open + '"' +
        (art.src ? ' style="--plate:url(\'' + esc(art.src) + '\')"' : '') +
        (art.cap ? ' title="Picture: ' + esc(art.cap) + '"' : '') + '>' +
        /* no painting nobody has used: the part's own words, in their own script — and
           where a part has no words either, its numeral, set large, the atlas's own
           device (Finance marks its worlds I to V the same way) */
        (!art.src
          ? (art.words && art.words.length
              ? '<span class="pa-actwords" aria-hidden="true">' + art.words.map(function (w) {
                  return '<span' + (w.lang ? ' lang="' + esc(w.lang) + '"' : '') + '>' + esc(w.t) + '</span>';
                }).join('') + '</span>'
              : '<span class="pa-actwords num" aria-hidden="true"><span>' +
                  (mi + 1 < 10 ? '0' : '') + (mi + 1) + '</span></span>')
          : '') +
        '<span class="pa-actscrim"></span>' +
        '<span class="pa-actrow">' +
          '<span class="pa-actno">' + (ps.cleared ? '★' : (mi + 1)) + '</span>' +
          '<span class="pa-acttext"><b>' + esc(m.name) + '</b>' +
            '<i>Part ' + (mi + 1) + ' of ' + c.modules.length + ' · ' + status + '</i></span>' +
          ring(ps.done, ps.total, 46, ps.cleared ? '#7BD3A1' : '#FFD24D') +
        '</span></button>' +
      (open
        ? '<div class="pa-railwrap">' +
            '<p class="pa-obj">After this part you can <b>' + esc(m.objective) + '</b>.</p>' +
            (m.needsReview ? '<div class="pa-warn"><b>A person is still checking this part.</b>' +
              esc(m.needsReview) + '</div>' : '') +
            (m.needsVerse ? '<div class="pa-warn"><b>A verse for this part is still being ' +
              'sourced.</b>This app only shows verses it can attribute. Nothing here is guessed.' +
              '</div>' : '') +
            '<div class="pa-rail"><span class="pa-railline" aria-hidden="true"><span style="height:' +
              pct + '%"></span></span>' + ns.map(function (s) { return stopRow(c, s); }).join('') +
            '</div></div>'
        : '') +
      '</section>';
  }

  function coursePage(id) {
    styles();
    var c = get(id); if (!c) return hub();
    var st = stopsOf(c), s = stats(c), lk = locked(c);
    var i0 = 0; P.courses.forEach(function (x, i) { if (x.id === c.id) i0 = i; });
    var cur = st.frontier >= 0 ? st.list[st.frontier] : null;
    /* which part is open: the one the child tapped, else the one they are standing in */
    var open = openPart[c.id] != null ? openPart[c.id] : (cur ? cur.mi : 0);
    var walkedStops = st.list.filter(function (x) { return x.done; }).length;

    var warn = (c.needsReview && c.needsReview.length)
      ? '<div class="pa-warn"><b>Parts of this course are still being checked by a person.</b>' +
        c.needsReview.map(function (x) { return esc(x); }).join(' ') + '</div>' : '';

    return '<div class="pa-wrap pa-atlas" style="--ja:' + esc(c.colour || '#8E6AC8') + '">' +
      '<button class="backlink" data-pa="hub">' + api.icon('back', 18) + ' Paathshala</button>' +

      /* the title sits above the board, as Finance's does — the board is all map */
      '<div class="pa-atitle">' +
        '<div><p class="pa-kick">Course ' + (i0 + 1) + ' of ' + P.courses.length + ' · ' +
          esc(c.sub) + '</p>' +
        '<h2>' + esc(c.name) + '</h2></div>' +
        '<div class="pa-atools">' +
          '<span class="pa-tpill">' + walkedStops + ' of ' + st.list.length + ' stops</span>' +
          '<span class="pa-tpill">' + s.mastered + ' of ' + s.objectives + ' learned</span>' +
          badge(c) +
          (lk ? '<span class="pa-tpill lock">' + api.icon('lock', 12) + ' a grown-up unlocks this</span>' : '') +
          '<button class="pa-tpill act" data-pa="pack" data-id="' + esc(c.id) + '">' +
            api.icon('print', 13) + ' Take-home pack</button>' +
        '</div></div>' +

      board(c, st) +
      /* the here-line and the picture's credit share one sheet of paper — the credit
         used to sit under it on the mural, in 10px, which is a credit nobody can read */
      '<p class="pa-here">Tap a part to walk it. ' +
        (cur ? 'You are standing at <b>' + esc(cur.kind === 'make' ? cur.m.project.name : cur.l.n) +
               '</b>, in part ' + (cur.mi + 1) + '.'
             : 'Every stop on this course is walked.') +
        (c.coverAlt ? '<span class="pa-herecred">Picture: ' + esc(c.coverAlt) + '</span>' : '') +
      '</p>' +

      warn +
      c.modules.map(function (m, mi) { return partSection(c, st, mi, mi === open); }).join('') +

      /* the why, the note and the sources — for the grown-up, at the foot */
      '<div class="pa-afoot">' +
        '<p><b>Why this course.</b> ' + esc(c.why) + '</p>' +
        (c.note ? '<p>' + esc(c.note) + '</p>' : '') +
        ((c.assignments || []).length ? '<p><b>Every week, with your family.</b> ' +
          c.assignments.map(function (a) { return esc(a.name) + ' — ' + esc(a.brief); }).join(' ') + '</p>' : '') +
        '<p><b>Where this comes from.</b></p><ul>' +
          (c.sources || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') +
        '</ul></div>' +
    '</div>';
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

  /* ------------------------------------------------------------------ the workshop */
  /* One project, done here. The screen is karya.js's; this is the frame round it — where
     you came from, what the project is, and, under the tool, the OTHER half: the thing
     to go and do on paper. The paper half is never marked by anything, and it says so
     rather than wearing a tick box. */
  function karyaPage(cid, pid) {
    styles();
    var c = get(cid); if (!c) return hub();
    var m = null;
    c.modules.forEach(function (x) { if (x.project.id === pid) m = x; });
    if (!m) return coursePage(cid);
    var K = W.IND_KARYA;
    var P = m.project, mi = 0;
    c.modules.forEach(function (x, i) { if (x.id === m.id) mi = i; });
    var work = K ? K.rec(P.id) : null;
    var r = course(cid), made = !!r.made[P.id];

    return '<div class="pa-wrap">' +
      '<button class="backlink" data-pa="course" data-id="' + esc(cid) + '">' +
        api.icon('back', 18) + ' ' + esc(c.name) + '</button>' +
      '<div class="pa-paper"><div class="pa-lesson">' +
        '<p class="pa-kick">' + esc(c.name) + ' · Part ' + (mi + 1) + ' · ' + esc(m.name) + '</p>' +
        '<h2>' + esc(P.name) + '</h2>' +
        '<span class="pa-sub">Project · ' + P.m + ' minutes</span>' +
        (K && K.has(P)
          ? '<div class="ky">' + K.render(P) + '</div>'
          : '') +
        /* THE OTHER HALF, and the honest line about it */
        '<div class="pa-secthead"><h3>Then, away from the screen</h3><span>on paper</span></div>' +
        '<p class="pa-lead">' + esc(P.brief) + '</p>' +
        '<p class="pa-made">You will have made: ' + esc(P.made) + '</p>' +
        '<button class="btn' + (made ? '' : ' primary') + '" data-pa="made" data-id="' +
          esc(cid) + '" data-p="' + esc(P.id) + '">' +
          (made ? 'Made it ✓ — undo' : 'I made it, on paper') + '</button>' +
        '<p class="pa-note">Nothing marks the paper half, and nothing is going to. No ' +
        'photograph of it leaves this device, no program grades your handwriting, and it ' +
        'does not count towards what the app says you have learned — that is what the ' +
        'test is for. It goes on your shelf because it is yours.</p>' +
        /* a status line only once there is a verdict to report — see the pill above */
        (work && work.by ? '<p class="pa-note ok">' +
          (work.by === 'app'
            ? 'The app marked the workshop half of this one.'
            : 'The workshop half is kept, not marked — see what it said above.') + '</p>' : '') +
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
    /* a pin or a banner: open that part's rail, and bring it into view */
    if (a === 'part') {
      var pc = el.getAttribute('data-id'), pm = el.getAttribute('data-m');
      var PC = get(pc); if (!PC) return true;
      var mi = 0; PC.modules.forEach(function (x, i) { if (x.id === pm) mi = i; });
      var wasOpen = D.getElementById('pa-part-' + pm) &&
        D.getElementById('pa-part-' + pm).classList.contains('open');
      /* tapping the open banner closes it; a pin always opens */
      openPart[pc] = (wasOpen && el.classList.contains('pa-actban')) ? -1 : mi;
      api.go('paath', pc);
      setTimeout(function () {
        var t = D.getElementById('pa-part-' + pm);
        if (t && t.scrollIntoView) t.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 30);
      return true;
    }
    if (a === 'karya') {
      var kc = el.getAttribute('data-id'), kp = el.getAttribute('data-p');
      var KC = get(kc), KP = null;
      if (KC) KC.modules.forEach(function (x) { if (x.project.id === kp) KP = x.project; });
      if (KP && W.IND_KARYA) W.IND_KARYA.open(KP);
      api.go('paathk', kc + '|' + kp);
      return true;
    }
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
    karya: function (arg) {
      var a = String(arg || '').split('|');
      return karyaPage(a[0], a[1]);
    },
    /* the tracing canvas owns window-level pointer listeners, so the host mounts it
       after the render and tears it down on the way out — the same contract the Bhasha
       quiz has with likhna.js */
    mount: function (arg) {
      var a = String(arg || '').split('|'), c = get(a[0]), K = W.IND_KARYA;
      if (!c || !K) return null;
      var p = null;
      c.modules.forEach(function (x) { if (x.project.id === a[1]) p = x.project; });
      return p ? K.mount(p) : null;
    },
    /* what the grown-up's page may show of the workshop: two lists, never one */
    shelf: function () { return W.IND_KARYA ? W.IND_KARYA.shelf(P.courses) : { marked: [], kept: [] }; },
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
