/* Headless check for Paathshala — the course layer.
 *
 * Two kinds of check live here and they catch different rot:
 *
 *   STRUCTURE, read straight off the data. A course that claims 30 hours and holds seven
 *   modules is lying to a parent about what they bought, and a lesson pointing at a story
 *   this app does not have renders an empty screen. Neither shows up in a browser until
 *   somebody opens exactly that page.
 *
 *   BEHAVIOUR, driven through the real app. The one that matters is the day rule: a check
 *   taken on the same day as its teaching must NOT be recorded as learned. That is the
 *   single promise that makes the grown-up's report mean anything, and it is exactly the
 *   kind of rule that gets "simplified" by someone who finds it annoying.
 *
 *   CHROME=/path/to/chrome node tools/check-paath.js
 *   node tools/check-paath.js --only shape        # structure checks need no browser
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const APP = path.join(__dirname, '..', 'app');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.webmanifest':'application/manifest+json', '.png':'image/png',
  '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2',
  '.mp3':'audio/mpeg' };

function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(APP, p);
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      res.writeHead(404).end('no'); return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

/* ------------------------------------------------------------------ the corpus */
/* Loaded in a bare global so the data files, which all assign to window.*, work here. */
function corpus() {
  global.window = global.window || {};
  const need = ['data-shlok.js', 'data-neeti.js', 'data-dharma.js', 'data-utsav.js',
                'data-rishtey.js', 'data-itihaas.js', 'data-geet.js',
                'data-epic-mahabharata.js', 'data-paath.js'];
  need.forEach(f => require(path.join(APP, f)));
  const W = global.window;
  /* stories live across a dozen files and two epics; scrape their ids textually rather
     than loading 3MB of narration to ask for a list of keys */
  const st = new Set();
  fs.readdirSync(APP)
    .filter(f => /^data-stories.*\.js$/.test(f) || /^data-epic-/.test(f))
    .forEach(f => {
      const t = fs.readFileSync(path.join(APP, f), 'utf8');
      (t.match(/\bid:\s*'[^']+'/g) || []).forEach(m => st.add(m.replace(/.*'(.*)'/, '$1')));
    });
  const arr = (o, k) => (o && o[k]) || [];
  return {
    P: W.IND_PAATH,
    st,
    /* a shlok reference may be a collection (gita, kural) or a single verse */
    sh: new Set([...arr(W.IND_SHLOK, 'collections'), ...arr(W.IND_SHLOK, 'verses')].map(x => x.id)),
    verses: new Set(arr(W.IND_SHLOK, 'verses').map(x => x.id)),
    va: new Set(arr(W.IND_NEETI, 'values').map(x => x.id)),
    dh: new Set(arr(W.IND_DHARMA, 'faiths').map(x => x.id)),
    ut: new Set(arr(W.IND_UTSAV, 'festivals').map(x => x.id)),
    ri: new Set(arr(W.IND_RISHTEY, 'terms').map(x => x.id)),
    ge: new Set([...arr(W.IND_GEET, 'songs'), ...arr(W.IND_GEET, 'bhajans')].map(x => x.id)),
    /* an era reference may be the era or one of the figures inside it */
    it: new Set([].concat(...arr(W.IND_ITIHAAS, 'eras')
          .map(e => [e.id].concat((e.figures || []).map(f => f.id).filter(Boolean))))),
    /* Mahabharata episodes are numbered, not id'd, so `mb` holds numbers. The Gita
       course leans on episode 26, which is the conversation retold without quoting it. */
    mb: new Set(arr(W.IND_EPIC_MAHABHARATA, 'episodes').map(e => e.n)),
  };
}

const CHECKS = [];
const check = (id, what, fn) => CHECKS.push({ id, what, fn });

/* ================================================================== STRUCTURE */

check('shape', 'a course is what it says it is', async ({ C }) => {
  /* Hours are modules x 3 by construction — four lessons and a project come to three
     hours. Stating hours separately from the modules means the two can drift, and the
     one a parent reads is the one that drifts. */
  const bad = [];
  const seen = new Set();
  C.P.courses.forEach(c => {
    if (seen.has(c.id)) bad.push(`two courses share the id ${c.id}`);
    seen.add(c.id);
    if (c.modules.length * 3 !== c.hours)
      bad.push(`${c.id} claims ${c.hours}h but holds ${c.modules.length} modules (= ${c.modules.length * 3}h)`);
    if (!c.ages || c.ages.length !== 2 || c.ages[0] >= c.ages[1])
      bad.push(`${c.id} has no sensible age band`);
    if (!c.badge) bad.push(`${c.id} has no badge — docs/05 §1, every content object carries one`);
    if (!c.sources || !c.sources.length) bad.push(`${c.id} says where nothing comes from`);
    c.modules.forEach(m => {
      if (!m.objective) bad.push(`${c.id}/${m.id} has no objective`);
      if (!m.project) bad.push(`${c.id}/${m.id} has no project`);
      if (!m.lessons || m.lessons.length < 2) bad.push(`${c.id}/${m.id} has too few lessons`);
      m.lessons.forEach(l => {
        if (!l.k || !l.n || !l.m) bad.push(`${c.id}/${m.id} has a malformed lesson`);
        if (!'tpc'.includes(l.k)) bad.push(`${c.id}/${m.id}/${l.n} has kind "${l.k}"`);
      });
    });
  });
  if (C.P.courses.length !== 10) bad.push(`there are ${C.P.courses.length} courses, not 10`);
  if (bad.length) throw new Error(bad.join('; '));
});

check('one-check', 'every part ends with a check, and it is the only thing that can say "learned"', async ({ C }) => {
  /* The module's objective is what gets recorded, and only its check lesson may record
     it. A module with two checks or none means the mastery record has either an
     ambiguous author or no author at all. */
  const bad = [];
  C.P.courses.forEach(c => c.modules.forEach(m => {
    const checks = m.lessons.filter(l => l.k === 'c');
    if (checks.length !== 1)
      bad.push(`${c.id}/${m.id} has ${checks.length} check lessons`);
    if (m.lessons[m.lessons.length - 1].k !== 'c')
      bad.push(`${c.id}/${m.id} does not END with its check`);
    if (!m.lessons.some(l => l.k === 't'))
      bad.push(`${c.id}/${m.id} has a check but nothing teaching it`);
  }));
  if (bad.length) throw new Error(bad.join('; '));
});

check('refs', 'every lesson points at content this app actually holds', async ({ C }) => {
  /* A reference that does not resolve renders an empty screen, and only on the one page
     that holds it. This is the rot a data file grows quietly. */
  const bad = [];
  let total = 0;
  C.P.courses.forEach(c => c.modules.forEach(m => m.lessons.forEach(l => {
    Object.entries(l.use || {}).forEach(([k, v]) => {
      if (!Array.isArray(v)) return;   /* bh and sa are counts/flags, not ids */
      v.forEach(id => {
        total++;
        if (!C[k]) { bad.push(`${c.id}: unknown reference kind "${k}"`); return; }
        if (!C[k].has(id)) bad.push(`${c.id}/${m.id} points at ${k}:${id}, which does not exist`);
      });
    });
  })));
  if (!total) throw new Error('no references at all — this check would pass on an empty file');
  if (bad.length) throw new Error(`${bad.length} of ${total} refs are dead: ` + bad.slice(0, 6).join('; '));
});

check('verses', 'no course quotes a verse this app cannot attribute', async ({ C }) => {
  /* data-shlok.js §THE HARD RULE, and docs/05 §6.4: never invent, paraphrase-as-quotation
     or reconstruct a verse. A course is the easiest place in the app to break that,
     because a course WANTS a verse at a particular point and one is not always there.
     The answer is needsVerse and an honest screen, never a plausible line. */
  const bad = [];
  C.P.courses.forEach(c => c.modules.forEach(m => m.lessons.forEach(l => {
    (l.use && l.use.sh ? l.use.sh : []).forEach(id => {
      if (!C.sh.has(id)) bad.push(`${c.id}/${m.id} cites shlok ${id}, which is not in data-shlok.js`);
    });
  })));
  /* and the Gita course specifically: it may use only the Gita verses that exist */
  const gita = C.P.courses.find(c => c.id === 'gita-course');
  if (!gita) throw new Error('the Gita course is missing, so this check proves nothing');
  const have = [...C.verses].filter(v => v.startsWith('gita-'));
  gita.modules.forEach(m => m.lessons.forEach(l => {
    (l.use && l.use.sh ? l.use.sh : []).forEach(id => {
      if (id.startsWith('gita-') && !have.includes(id))
        bad.push(`the Gita course cites ${id}, which this app does not hold`);
    });
  }));
  if (!have.length) throw new Error('no sourced Gita verses at all — the course cannot be honest');
  if (bad.length) throw new Error(bad.join('; '));
});

check('review', 'nothing sensitive claims to be finished', async ({ C }) => {
  /* docs/05 §6: caste, Partition, communal conflict, colonial violence and contested
     chronology are for a human author with a named reviewer. The engine renders these as
     being checked rather than pretending; this makes sure the flag is actually on them. */
  const bad = [];
  const mustFlag = [
    ['itihaas-course', 'i8', 'colonial'],
    ['itihaas-course', 'i9', 'Partition and the freedom movement'],
    ['gita-course', null, 'doctrinal content'],
  ];
  mustFlag.forEach(([cid, mid, why]) => {
    const c = C.P.courses.find(x => x.id === cid);
    if (!c) { bad.push(`${cid} is missing`); return; }
    if (mid) {
      const m = c.modules.find(x => x.id === mid);
      if (!m) { bad.push(`${cid}/${mid} is missing`); return; }
      if (!m.needsReview) bad.push(`${cid}/${mid} (${why}) is not flagged for review`);
    } else if (!c.needsReview || !c.needsReview.length) {
      bad.push(`${cid} (${why}) is not flagged for review`);
    }
  });
  if (bad.length) throw new Error(bad.join('; '));
});

check('projects', 'every part leaves something behind', async ({ C }) => {
  /* Projects are where a 24-hour course gets its hours honestly, and the only part that
     leaves a family an object. A project with no `made` is an exercise wearing the word. */
  const bad = [];
  const ids = new Set();
  C.P.courses.forEach(c => c.modules.forEach(m => {
    const p = m.project;
    if (ids.has(p.id)) bad.push(`two projects share the id ${p.id}`);
    ids.add(p.id);
    if (!p.brief || p.brief.length < 40) bad.push(`${p.id} has no real brief`);
    if (!p.made) bad.push(`${p.id} does not say what the child will have made`);
    if (!p.m || p.m < 30) bad.push(`${p.id} is too short to be a project`);
  }));
  if (bad.length) throw new Error(bad.join('; '));
});

/* ================================================================== BEHAVIOUR */

async function boot(browser, port) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(() => {});
  const nm = await p.$('#nm');
  if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('.navtab[data-v="paath"]').click());
  await p.waitForTimeout(600);
  return { p, errs };
}

check('voice', 'nothing on screen is a note to ourselves', async ({ C }) => {
  /* A screenshot of the Gita course showed a parent this, in full:
     "THIS COURSE DOES NOT PUBLISH WITHOUT A NAMED REVIEWER from within the tradition.
      docs/05 §6 — doctrinal content is for a human author with a named reviewer…
      docs/21-gita.md carries the worklist for sourcing more."
     Every word of that is true and none of it was written for the person reading it: a
     doc path, a section sign, a rule addressed to whoever maintains the repo, and half a
     sentence in capitals. The RULE it carries has to stay — those parts do not publish —
     but a notice nobody can read is not a notice, it is a wall.

     So every string this file puts in front of a family is checked for the three shapes a
     note to ourselves takes. Comments in the source are untouched; this reads the built
     data, which is exactly what reaches the screen and the printed pack. */
  const bad = [];
  const SHOUT = /\b[A-Z][A-Z' ]{14,}\b/;            /* a run of capitals, not an acronym */
  const DOC = /\bdocs?\/[\w.-]+|§\s*\d/;             /* a path or a section reference */
  const JARGON = /\bTODO\b|\bFIXME\b|\bdata-[a-z]+\.js\b|\.md\b|\bmodule \d/i;
  const seen = (where, t) => {
    if (typeof t !== 'string' || t.length < 12) return;
    if (SHOUT.test(t)) bad.push(`${where} shouts: "${t.match(SHOUT)[0].trim()}"`);
    if (DOC.test(t)) bad.push(`${where} cites the repo: "${t.match(DOC)[0]}"`);
    if (JARGON.test(t)) bad.push(`${where} is written for us: "${t.match(JARGON)[0]}"`);
  };
  let n = 0;
  C.P.courses.forEach(c => {
    ['name', 'sub', 'blurb', 'why', 'note', 'takeHome', 'coverAlt'].forEach(k => {
      if (c[k]) { n++; seen(`${c.id}.${k}`, c[k]); }
    });
    (c.needsReview || []).forEach((t, i) => { n++; seen(`${c.id}.needsReview[${i}]`, t); });
    (c.sources || []).forEach(() => n++);   /* a source is a citation: it may name a book */
    (c.assignments || []).forEach(a => { n++; seen(`${c.id}.assignment`, a.brief); });
    c.modules.forEach(m => {
      ['name', 'objective', 'needsReview', 'talk', 'home'].forEach(k => {
        if (m[k]) { n++; seen(`${c.id}/${m.id}.${k}`, m[k]); }
      });
      if (m.project) { n++; seen(`${c.id}/${m.id}.project`, m.project.brief);
                       seen(`${c.id}/${m.id}.made`, m.project.made); }
      m.lessons.forEach(l => { n++; seen(`${c.id}/${m.id}.lesson`, l.n); seen(`${c.id}/${m.id}.lesson.o`, l.o); });
    });
  });
  if (n < 100) throw new Error(`only ${n} strings read — this check would pass on an empty file`);
  if (bad.length) throw new Error(`${bad.length} of ${n}: ` + bad.slice(0, 5).join('; '));
});

check('covers', 'every plate is a real picture with a caption', async ({ C }) => {
  /* docs/05: a folk art tradition is credited, and nothing is uncredited texture. A cover
     is the largest thing on the screen, so a cover that 404s leaves the biggest hole in
     the app and a cover with no alt line is a picture nobody has to account for. Both are
     read off the disk rather than off the data, because the data is the claim and the
     file is the fact. */
  const bad = [];
  C.P.courses.forEach(c => {
    if (!c.cover) { bad.push(`${c.id} has no cover`); return; }
    if (!fs.existsSync(path.join(APP, c.cover)))
      bad.push(`${c.id}'s cover ${c.cover} is not on disk`);
    if (!c.coverAlt || c.coverAlt.length < 8)
      bad.push(`${c.id}'s cover has no alt line — an uncredited picture (docs/05)`);
  });
  if (!C.P.courses.length) throw new Error('no courses — this check would pass on an empty file');
  if (bad.length) throw new Error(bad.join('; '));
});


check('opens', 'the tab opens and every course is on it', async ({ p, C }) => {
  const r = await p.evaluate(() => ({
    cards: document.querySelectorAll('.pa-card').length,
    heading: (document.querySelector('.pa-wrap h2') || {}).textContent || '',
  }));
  if (r.cards !== C.P.courses.length)
    throw new Error(`${C.P.courses.length} courses but ${r.cards} cards`);
  if (!/Paathshala/.test(r.heading)) throw new Error('the hub has no heading');
  /* and a course opens with its parts */
  const c = await p.evaluate(() => {
    document.querySelector('.pa-card[data-id="neeti-course"]').click();
    return null;
  });
  await p.waitForTimeout(500);
  const m = await p.evaluate(() => ({ mods: document.querySelectorAll('.pa-mod').length,
                                      lessons: document.querySelectorAll('.pa-l').length }));
  if (m.mods !== 8) throw new Error(`the Neeti course shows ${m.mods} parts, not 8`);
  if (m.lessons !== 32) throw new Error(`it shows ${m.lessons} lessons, not 32`);
});

check('dayrule', 'a check taken the same day is practice, not learning', async ({ p }) => {
  /* THE ONE THAT MATTERS. Remembering something an hour after being told is attention;
     remembering it a week later is learning, and only the second belongs in a report a
     parent reads. So mastery is written only when the check happens on a LATER DAY than
     the teaching. This check drives both halves through the real engine. */
  await p.evaluate(() => document.querySelector('.pa-card[data-id="neeti-course"]').click());
  await p.waitForTimeout(400);
  /* teach today, check today */
  await p.evaluate(() => {
    const ls = [...document.querySelectorAll('.pa-mod')][0].querySelectorAll('.pa-l');
    ls[0].click();
  });
  await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('[data-pa="course"]').click());
  await p.waitForTimeout(400);
  await p.evaluate(() => {
    const ls = [...document.querySelectorAll('.pa-mod')][0].querySelectorAll('.pa-l');
    ls[ls.length - 1].click();
  });
  await p.waitForTimeout(400);
  const warned = await p.evaluate(() =>
    /will not count/.test((document.querySelector('.pa-warn') || {}).textContent || ''));
  if (!warned) throw new Error('a same-day check does not warn that it will not count');
  await p.evaluate(() => document.querySelector('[data-pa="pass"]').click());
  await p.waitForTimeout(500);
  const sameDay = await p.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('bi_v1') || '{}');
    return (((s.paath || {}).c || {})['neeti-course'] || {}).m || {};
  });
  if (!sameDay.n1) throw new Error('the attempt was not recorded at all');
  if (sameDay.n1.on) throw new Error('A SAME-DAY CHECK WAS RECORDED AS LEARNED — the day rule is gone');
  if (!sameDay.n1.tries) throw new Error('the attempt did not count as practice either');

  /* now backdate the teaching, the way a real week would, and check again */
  await p.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('bi_v1'));
    const c = s.paath.c['neeti-course'];
    Object.keys(c.seen).forEach(k => { c.seen[k] = c.seen[k] - 1; });
    localStorage.setItem('bi_v1', JSON.stringify(s));
    location.reload();
  });
  await p.waitForTimeout(1600);
  await p.evaluate(() => document.querySelector('.navtab[data-v="paath"]').click());
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('.pa-card[data-id="neeti-course"]').click());
  await p.waitForTimeout(400);
  await p.evaluate(() => {
    const ls = [...document.querySelectorAll('.pa-mod')][0].querySelectorAll('.pa-l');
    ls[ls.length - 1].click();
  });
  await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('[data-pa="pass"]').click());
  await p.waitForTimeout(500);
  const later = await p.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('bi_v1') || '{}');
    return (((s.paath || {}).c || {})['neeti-course'] || {}).m || {};
  });
  if (!later.n1 || !later.n1.on)
    throw new Error('a check on a LATER day still did not count — the rule is now unpassable');
});

check('pack', 'a course leaves the screen', async ({ p, C }) => {
  /* A course that only exists on a screen is a course a family cannot do at the table.
     The take-home pack is the half that leaves: verse cards with their attribution, a
     question to ask at dinner and something to do at home for each part, and every
     project brief with room to write on. It is generated from the course itself, so it
     cannot disagree with what is on the screen. */
  await p.evaluate(() => document.querySelector('.pa-card[data-id="gita-course"]').click());
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('[data-pa="pack"]').click());
  await p.waitForTimeout(700);
  const gita = C.P.courses.find(c => c.id === 'gita-course');
  const r = await p.evaluate(() => ({
    verses: document.querySelectorAll('.pk-verse').length,
    mods: document.querySelectorAll('.pk-mod').length,
    boxes: document.querySelectorAll('.pk-q').length,
    rules: document.querySelectorAll('.pk-rule').length,
    attributed: [...document.querySelectorAll('.pk-verse')]
      .every(v => (v.querySelector('.pk-at') || {}).textContent),
  }));
  if (r.mods !== gita.modules.length)
    throw new Error(`the pack shows ${r.mods} parts, the course has ${gita.modules.length}`);
  if (!r.verses) throw new Error('no verse cards in a course built on verses');
  if (!r.attributed) throw new Error('a verse card has no attribution — on paper there is no tooltip');
  /* every part carries a question to ask and something to do at home */
  const want = gita.modules.filter(m => m.talk).length + gita.modules.filter(m => m.home).length;
  if (r.boxes !== want) throw new Error(`${want} table questions and home activities, ${r.boxes} rendered`);
  if (r.rules < gita.modules.length) throw new Error('there is nowhere to write');

  /* and printing takes the screen furniture away */
  await p.emulateMedia({ media: 'print' });
  await p.waitForTimeout(300);
  const pr = await p.evaluate(() => {
    const gone = n => { const e = document.querySelector(n); return !e || getComputedStyle(e).display === 'none'; };
    return { topbar: gone('.topbar'), tools: gone('.pk-tools'), art: gone('.wa-layer'),
             pack: getComputedStyle(document.querySelector('.pk')).display !== 'none' };
  });
  await p.emulateMedia({ media: 'screen' });
  if (!pr.topbar || !pr.tools || !pr.art)
    throw new Error('printing does not hide the screen furniture');
  if (!pr.pack) throw new Error('printing hides the pack itself');
});

check('script', 'every verse is set in its own script', async ({ p }) => {
  /* docs/05: a script is set correctly or it is not set at all. The first version of the
     pack put lang="sa" on every card, which renders Thirukkural — Tamil — in a Devanagari
     face. These courses cite Tamil and Pali deliberately, because the same quality turning
     up in three traditions is the lesson, so the pack must carry three scripts and not one.
     The lang attribute is derived from the verse's collection, and the app's :lang() rules
     do the rest. */
  await p.evaluate(() => document.querySelector('.pa-card[data-id="gita-course"]').click());
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('[data-pa="pack"]').click());
  await p.waitForTimeout(700);
  const bad = await p.evaluate(() => {
    const SH = window.IND_SHLOK;
    const langOf = {};
    (SH.collections || []).forEach(c => { langOf[c.id] = c.language; });
    const expect = { Sanskrit: 'sa', Tamil: 'ta', Pali: null };
    const out = [];
    /* walk the cards in order against the verses the course cites, by matching text */
    document.querySelectorAll('.pk-verse').forEach(card => {
      const txt = (card.querySelector('.pk-sa') || {}).textContent || '';
      const lang = (card.querySelector('.pk-sa') || {}).getAttribute
                 ? card.querySelector('.pk-sa').getAttribute('lang') : null;
      let v = null;
      (SH.verses || []).forEach(x => { if ((x.text_original || '') === txt) v = x; });
      if (!v) { out.push('a card matches no verse in data-shlok.js'); return; }
      const want = expect[langOf[v.collection]];
      if ((want || null) !== (lang || null))
        out.push(`${v.id} is ${langOf[v.collection]} but tagged lang="${lang}"`);
    });
    return out;
  });
  if (bad.length) throw new Error(bad.join('; '));
});

check('report', 'the grown-up is told objectives, never minutes', async ({ p }) => {
  /* docs/05 and the sibling app's rule: if it is not in the mastery record it does not go
     in a report. A report that counts minutes rewards leaving the app open. */
  const r = await p.evaluate(() => {
    const rep = window.IND_PAATH_UI.report();
    return { rows: rep, keys: rep.length ? Object.keys(rep[0]) : [] };
  });
  const banned = ['minutes', 'mins', 'time', 'seconds', 'seen'];
  const leak = r.keys.filter(k => banned.includes(k.toLowerCase()));
  if (leak.length) throw new Error('the report exposes ' + leak.join(', '));
  if (r.keys.length && !r.keys.includes('mastered'))
    throw new Error('the report does not carry mastered objectives');
});

check('keyboard', 'every control is reachable and pressable without a mouse', async ({ p }) => {
  /* Inherited from Bizzing Bee and non-negotiable: keyboard AND touch. Real <button>
     elements give both for free, which is why they are used throughout — this makes sure
     nobody has replaced one with a clickable div. */
  await p.evaluate(() => document.querySelector('.navtab[data-v="paath"]').click());
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const ctl = [...document.querySelectorAll('[data-pa]')];
    return { total: ctl.length,
             notButtons: ctl.filter(e => e.tagName !== 'BUTTON').map(e => e.tagName).slice(0, 4) };
  });
  if (!r.total) throw new Error('no controls found, so this check proves nothing');
  if (r.notButtons.length)
    throw new Error('controls that are not buttons: ' + r.notButtons.join(', '));
});

check('readable', 'a locked course is said in words, never by fading', async ({ p }) => {
  /* HISTORY, AND WHY THIS CHECK IS PHRASED AS AN OUTCOME NOW. The first version of the hub
     said "premium" by putting opacity .72 on the whole card, which dims the text along with
     everything else — a screenshot found it, on exactly the five premium courses and on no
     others. The first version of THIS CHECK then demanded an opaque background colour on
     every card, and that is a MECHANISM, not the promise: it fired the day the hub became
     an atlas, where a plate is divided by a hairline rule and has no box at all. A check
     written against a mechanism goes off when the mechanism is legitimately replaced, and
     the temptation is then to loosen it. So it measures what a person would actually
     complain about:

       1. nothing is faded — no element inside a plate is under full opacity
       2. a locked plate's title is the same colour as an unlocked plate's
       3. the lock is stated in words
       4. every title contrasts with what is ACTUALLY behind it, box or no box

     Somebody deciding whether to buy a course has to be able to read it. */
  const bad = await p.evaluate(() => {
    const out = [];
    /* the contrast of a colour against the first opaque thing behind it */
    const rgb = s => (String(s).match(/[\d.]+/g) || []).map(Number);
    const lum = c => {
      const f = c.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
      return .2126 * f[0] + .7152 * f[1] + .0722 * f[2];
    };
    /* the nearest ancestor that actually PAINTS something opaque behind this text, and
       whether the view painted it or the page did */
    const backdrop = el => {
      for (let n = el; n; n = n.parentElement) {
        const c = rgb(getComputedStyle(n).backgroundColor);
        if (c.length >= 3 && (c.length < 4 || c[3] > .95))
          return { c, on: n, page: n === document.body || n === document.documentElement };
      }
      return { c: [255, 255, 255], on: null, page: true };
    };
    const ratio = (a, b) => { const x = lum(a), y = lum(b);
      return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };

    /* 1 — nothing anywhere in a plate, part or masthead is faded */
    document.querySelectorAll('.pa-card,.pa-card *,.pa-mast,.pa-mast *,.pa-mod,.pa-mod *')
      .forEach(el => {
        if (parseFloat(getComputedStyle(el).opacity) < 0.95)
          out.push((el.closest('[data-id]') || el).getAttribute('data-id') + '/' +
            el.className + ' is faded');
      });

    /* 2 and 3 — the lock is a sentence, not a filter on the words */
    const cards = [...document.querySelectorAll('.pa-card')];
    if (cards.length < 2) out.push('fewer than two plates — this check would prove nothing');
    const titleColour = c => getComputedStyle(c.querySelector('.pa-body b')).color;
    const free = cards.filter(c => !c.classList.contains('pa-lock'));
    const shut = cards.filter(c => c.classList.contains('pa-lock'));
    if (!shut.length) out.push('no locked plate on the page — this check would prove nothing');
    shut.forEach(c => {
      const id = c.getAttribute('data-id');
      if (free.length && titleColour(c) !== titleColour(free[0]))
        out.push(id + "'s title is a different colour from an unlocked course's");
      if (!/unlock/i.test(c.textContent)) out.push(id + ' does not say it is locked in words');
    });

    /* 4 — every plate title reads against what is ACTUALLY behind it, and the surface it
       reads against is one this view painted. A screenshot found the reason: the atlas
       had no surface of its own, so ten titles sat on the page's world artwork and a
       bazaar mural ran through "My India". A contrast test alone cannot see that — body's
       background COLOUR is a perfectly readable cream, and the mural is a background
       IMAGE painted over it. So the test is where the surface comes from, not only how
       light it is. */
    cards.forEach(c => {
      const b = c.querySelector('.pa-body b');
      const d = backdrop(b);
      const id = c.getAttribute('data-id');
      if (d.page) out.push(id + "'s title sits on the page itself, where the world " +
        'artwork is — it has no surface of its own');
      const r = ratio(rgb(getComputedStyle(b).color), d.c);
      if (r < 4.5) out.push(id + "'s title is at " + r.toFixed(1) + ':1 against what is behind it');
    });
    return out;
  });
  if (bad.length) throw new Error(bad.slice(0, 8).join('; '));
});

check('labels', 'a child is never shown a database key', async ({ p }) => {
  /* The first lesson screen read `story: pt.talkative-tortoise →` — a row id, shown to an
     eight-year-old, in a tab that owns 686 paintings. `api.look` in app.js now resolves
     every reference to the thing's real title, its own script with the right lang on it,
     and its own painting where there is an honest one.

     This renders EVERY lesson of every course through the real view function, strips the
     markup, and looks for the ids in what is left — so an id in a `data-arg` attribute,
     where it belongs, is fine and an id in front of a child is not. 352 lessons is one
     pass of string work, and it is the whole surface rather than a sample. */
  const r = await p.evaluate(() => {
    const P = window.IND_PAATH, U = window.IND_PAATH_UI;
    const box = document.createElement('div');
    const bad = [];
    let refs = 0, lessons = 0, pics = 0;
    P.courses.forEach(c => c.modules.forEach(m => m.lessons.forEach(l => {
      const ids = [];
      Object.entries(l.use || {}).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach(id => ids.push(String(id)));
      });
      if (!ids.length) return;
      lessons++; refs += ids.length;
      box.innerHTML = U.lesson(c.id + '|' + m.id + '|' + l.n);
      pics += box.querySelectorAll('.pa-usefig').length;
      const words = box.textContent;
      /* An id is often a slug of the very title it resolves to — the song `poshampa` is
         called "Poshampa bhai poshampa", and this check found it on its first run. That
         is the title doing its job, not a key on screen. So the fault is an id that
         appears while the thing's own NAME does not contain it. */
      const flat = x => String(x).toLowerCase().replace(/[^a-z0-9]/g, '');
      ids.forEach(id => {
        /* a one- or two-character id could appear inside an ordinary word; every id in
           this corpus is longer than that, and a short one would need a different test */
        if (id.length <= 3 || words.indexOf(id) < 0) return;
        /* and it has to be a title that CONTAINS the slug, not a title that IS the slug —
           otherwise a chip that went back to printing the row id would let itself off */
        const named = [...box.querySelectorAll('.pa-use b, .pa-use i')].some(b => {
          const t = flat(b.textContent);
          return t.indexOf(flat(id)) >= 0 && t.length > flat(id).length;
        });
        if (!named) bad.push(`${c.id}/${m.id} shows the id "${id}" as text`);
      });
    })));
    return { bad, refs, lessons, pics };
  });
  if (!r.refs) throw new Error('no references rendered — this check would pass on an empty file');
  if (r.bad.length)
    throw new Error(`${r.bad.length} raw ids on screen: ` + r.bad.slice(0, 6).join('; '));
  /* and the lesson screens must actually be showing pictures, not only better words */
  if (r.pics < r.refs * 0.2)
    throw new Error(`only ${r.pics} of ${r.refs} references render a picture — ` +
      'this app owns 686 paintings and the first version used none of them');
});

check('touch', 'a phone can hit everything', async ({ p }) => {
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('.navtab[data-v="paath"]').click());
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('.pa-card').click());
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const small = [];
    document.querySelectorAll('[data-pa],.pa-use').forEach(e => {
      const q = e.getBoundingClientRect();
      if (q.width < 1 || q.height < 1) return;
      if (Math.min(q.width, q.height) < 32) small.push(Math.round(q.width) + 'x' + Math.round(q.height));
    });
    return { small, over: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.waitForTimeout(300);
  if (r.over > 1) throw new Error(`the course page scrolls sideways by ${r.over}px on a phone`);
  if (r.small.length) throw new Error('tap targets under 32px: ' + r.small.slice(0, 5).join(', '));
});

/* ------------------------------------------------------------------ the runner */
async function main() {
  const only = process.argv.includes('--only')
    ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const C = corpus();
  const needsBrowser = CHECKS.some(c => (!only || c.id === only) &&
    ['opens', 'dayrule', 'report', 'keyboard', 'touch', 'readable', 'pack', 'script', 'labels'].includes(c.id));

  let server = null, browser = null, port = 0;
  if (needsBrowser) {
    const { chromium } = require('playwright');
    server = await serve(); port = server.address().port;
    browser = await chromium.launch({
      executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  }

  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const browserCheck = ['opens', 'dayrule', 'report', 'keyboard', 'touch', 'readable', 'pack', 'script', 'labels'].includes(c.id);
    let ctx = { C };
    if (browserCheck) ctx = Object.assign({ C }, await boot(browser, port));
    try {
      await c.fn(ctx);
      console.log(`  ok   ${c.id.padEnd(10)} ${c.what}`);
      pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(10)} ${c.what}\n         ${e.message}`);
      fail++;
    }
    if (ctx.p) await ctx.p.close();
  }
  if (browser) await browser.close();
  if (server) server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
main();
