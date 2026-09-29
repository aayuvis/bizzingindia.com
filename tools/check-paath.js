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

check('readable', 'a locked course is still readable', async ({ p }) => {
  /* The first version said "premium" by putting opacity .72 on the whole card. That dims
     the text along with everything else and lets the page's artwork show through a card
     that is otherwise opaque -- which is what a screenshot showed, on exactly the five
     premium courses and on no others. Somebody deciding whether to buy a course has to be
     able to read it. The lock is said in words now. */
  const bad = await p.evaluate(() => {
    const out = [];
    /* the header too: text on bare page artwork is unreadable, and it is the first
       thing on the screen */
    document.querySelectorAll('.pa-card,.pa-head,.pa-mod').forEach(el => {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.95)
        out.push((el.getAttribute('data-id') || '?') + ' is at opacity ' + cs.opacity);
      const bg = cs.backgroundColor.match(/[\d.]+/g) || [];
      if (bg.length === 4 && parseFloat(bg[3]) < 0.95)
        out.push((el.getAttribute('data-id') || '?') + ' has a see-through background');
    });
    return out;
  });
  if (bad.length) throw new Error(bad.join('; '));
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
    ['opens', 'dayrule', 'report', 'keyboard', 'touch', 'readable', 'pack', 'script'].includes(c.id));

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
    const browserCheck = ['opens', 'dayrule', 'report', 'keyboard', 'touch', 'readable', 'pack', 'script'].includes(c.id);
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
