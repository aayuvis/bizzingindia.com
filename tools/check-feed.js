#!/usr/bin/env node
/* Bizzing India — My Feed (docs/30-feed.md), held in node and in a browser.

   THE CONTENT (node, against the corpus as the page loads it)
     count      1,000 items, as the owner asked, with every id unique
     resolves   every item's `src` resolves to a corpus object, and the words on the card are
                found in it: a story's opening is in that story, a verse is that verse with
                its source, a fact is in its era, a word is in its pack with that meaning, a
                question's right answer is the corpus's own answer
     held       nothing flagged needs_review, unsure or needs_original, nothing gated 11+;
                a card wears its object's badge (a Katha never reads as Itihaas)
     distinct   no two items share the same src + kind + text
   THE RANKING (node, app/feed.js itself)
     bands      a 4–7 child never sees a card whose bands leave them out, across many children
     context    reading a story moves its place's and its collection's cards up, and says so
     due        a word that slipped comes back once its gap is over, and not before
     mix        never three cards of one kind in a row; at most five questions
     ends       a session is at most twenty cards; what was seen this week sinks
   THE SCREEN (Chromium)
     screen     #/feed: the shell's page head, about twenty cards, then the finished card; no
                likes, counts or streaks; no sound before a tap; nothing wider than 390
     play       a question by keyboard (wrong holds for Continue, nothing leaked) and by touch
                (right pays one coin, once, through 'answer')
     keys       j / k and the arrows move card to card
     routes     every card's route opens a real screen
     pin        the grown-up's switch takes the tab and the ☰ row away, and #/feed says so
     demo       ?demo shows a sample feed and leaves the household untouched

   Each was watched to fail by breaking the thing it holds (docs/30-feed.md).
   Run:  node tools/check-feed.js            # all of them
         node tools/check-feed.js --only mix
*/
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');
const { load, APP } = require('./lib/corpus');
const { skipOnboarding } = require('./lib/onboard');

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
const C = load();
const fctx = { window: {} }; fctx.window = fctx; vm.createContext(fctx);
['data-feed-index.js', 'data-feed-a.js', 'data-feed-b.js', 'data-feed-c.js', 'data-feed-d.js', 'feed.js']
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(APP, f), 'utf8'), fctx, { filename: f }));
const F = fctx.IND_FEED, IDX = F.decode(fctx.IND_FEED_INDEX), BODY = fctx.IND_FEED_BODY;
const ITEMS = IDX.map(r => Object.assign({}, BODY[r.id], r));

const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));

/* ------------------------------------------------------------------ the content */
check('count', '1,000 items, every id unique, every body group present', () => {
  if (ITEMS.length !== 1000) throw new Error(ITEMS.length + ' items, not 1,000');
  const ids = new Set(ITEMS.map(i => i.id));
  if (ids.size !== ITEMS.length) throw new Error('ids repeat');
  const miss = IDX.filter(r => !BODY[r.id]);
  if (miss.length) throw new Error(miss.length + ' items have no words in any body group: ' + miss[0].id);
});

const at = (o, p) => p.reduce((x, k) => (x == null ? x : x[/^\d+$/.test(k) ? +k : k]), o);
const storyBy = {}; C.stories.forEach(s => { storyBy[s.id] = s; });
const stateName = c => (C.IND_GEO.states[c] || {}).name;
function resolve(it) {
  const p = it.src.split(':'), kind = p[0];
  const has = (hay, needle, what) => { if (!needle || String(hay || '').indexOf(needle) < 0) throw new Error(`${it.id}: "${String(needle).slice(0, 50)}" is not in ${what}`); };
  if (kind === 'story') {
    const s = storyBy[p[1]]; if (!s) throw new Error(it.id + ': no story ' + p[1]);
    if (s.needs_review) throw new Error(it.id + ': story is held for review');
    if (it.badge !== s.badge) throw new Error(`${it.id}: wears ${it.badge}, the story is ${s.badge}`);
    has(at(s, p.slice(2)), it.body, 'the story');
  } else if (kind === 'epic') {
    const E = [C.IND_EPIC_RAMAYANA, C.IND_EPIC_MAHABHARATA].filter(e => e.id === p[1])[0];
    if (!E) throw new Error(it.id + ': no epic ' + p[1]);
    has(at(E, p.slice(2)), it.body, 'the epic');
  } else if (kind === 'verse') {
    const v = C.IND_SHLOK.verses.filter(x => x.id === p[1])[0];
    if (!v) throw new Error(it.id + ': no verse ' + p[1]);
    if (v.unsure || v.needs_original || !v.source) throw new Error(it.id + ': the verse is flagged or unsourced');
    if (it.text !== v.text_original || it.body !== v.meaning_kid || it.source !== v.source) throw new Error(it.id + ': the card is not the verse as data-shlok.js holds it');
  } else if (kind === 'era') {
    const e = C.IND_ITIHAAS.eras.filter(x => x.id === p[1])[0];
    if (!e) throw new Error(it.id + ': no era ' + p[1]);
    if (e.needs_review || (e.gate || 4) >= 11 || !(e.sources || []).length) throw new Error(it.id + ': the era is held, gated or unsourced');
    has(at(e, p.slice(2)), it.body, 'the era');
  } else if (kind === 'word') {
    const pk = C.IND_PACKS[p[1]], w = pk && (pk.lexicon || []).filter(x => x.word === p.slice(2).join(':'))[0];
    if (!w) throw new Error(it.id + ': no word ' + it.src);
    if (it.text !== w.word) throw new Error(it.id + ': the word on the card is not the word');
    if (it.play) { if (it.play.opts[it.play.a] !== w.en) throw new Error(it.id + ': the right answer is not the pack\'s meaning'); }
    else if (it.body !== w.en) throw new Error(it.id + ': the meaning is not the pack\'s');
  } else if (kind === 'letter') {
    const sc = C.IND_SCRIPTS[p[1]], l = sc && (sc.vowels || []).concat(sc.consonants || []).filter(x => x.char === p.slice(2).join(':'))[0];
    if (!l) throw new Error(it.id + ': no letter ' + it.src);
    has(it.body, l.name, 'the card (the letter\'s name)');
  } else if (kind === 'festival') {
    const f = C.IND_UTSAV.festivals.filter(x => x.id === p[1])[0];
    if (!f || f.needs_review) throw new Error(it.id + ': no festival, or held for review');
    if (it.badge !== (f.badge || 'aaj')) throw new Error(it.id + ': wears the wrong badge');
    if (it.play) { if (it.play.opts[it.play.a] !== stateName(f.states[0])) throw new Error(it.id + ': the right answer is not where it is kept'); }
    else has(at(f, p.slice(2)), it.body, 'the festival');
  } else if (kind === 'geo') {
    const g = C.IND_GEO.states[p[1]]; if (!g) throw new Error(it.id + ': no place ' + p[1]);
    if (p[2] === 'capital') { has(it.play.q, g.capital, 'the question'); if (it.play.opts[it.play.a] !== g.name) throw new Error(it.id + ': wrong answer keyed'); }
    else has(g[p[2]], it.body, 'the place');
  } else if (kind === 'state') {
    has(at(C.IND_STATES[p[1]], p.slice(2)), it.body, 'the state\'s facts');
  } else if (kind === 'game') {
    if ((C.GAME_FRAME[p[1]] || [])[0] !== it.body) throw new Error(it.id + ': the how-to is not the game\'s own');
  } else if (kind === 'gully') {
    const g = C.IND_GULLY.games.filter(x => x.id === p[1])[0];
    if (!g || g.needs_review) throw new Error(it.id + ': no street game, or held');
    has(at(g, p.slice(2)), it.body, 'the street game');
  } else throw new Error(it.id + ': a src of a kind nothing resolves: ' + it.src);
  if (it.play) {
    if (new Set(it.play.opts).size !== it.play.opts.length) throw new Error(it.id + ': two options are the same');
    if ((it.play.q + (it.title || '')).indexOf(it.play.opts[it.play.a]) >= 0 && kind !== 'geo') throw new Error(it.id + ': the question gives its answer away');
  }
}
check('resolves', 'every src resolves, and every quotation, meaning and answer is found in it', () => {
  const bad = [];
  ITEMS.forEach(it => { try { resolve(it); } catch (e) { bad.push(e.message); } });
  if (bad.length) throw new Error(bad.length + ' do not resolve: ' + bad.slice(0, 4).join(' · '));
});
check('held', 'nothing held for review or gated 11+; bands are the app\'s three', () => {
  const B = ['4-7', '8-9', '10-12'];
  const bad = ITEMS.filter(it => !it.bands.length || it.bands.some(b => B.indexOf(b) < 0));
  if (bad.length) throw new Error('bad bands on ' + bad[0].id);
  /* the Gita verses are 10+: the 4–7 band must not hold them (and the test below needs some) */
  const top = ITEMS.filter(it => it.bands.indexOf('4-7') < 0);
  if (!top.length) throw new Error('no item is above the youngest band, so the band rule is untested');
  const held = ITEMS.filter(it => /colonial|freedom|naya-bharat|gita-course/.test(it.src));
  if (held.length) throw new Error('a held object is in the feed: ' + held[0].src);
});
check('distinct', 'no two items share the same src + kind + text', () => {
  const seen = {};
  ITEMS.forEach(it => {
    const k = it.src + '|' + it.kind + '|' + (it.text || '') + '|' + (it.body || '') + '|' + (it.play ? it.play.q : '');
    if (seen[k]) throw new Error(it.id + ' and ' + seen[k] + ' are the same card');
    seen[k] = it.id;
  });
});

/* ------------------------------------------------------------------ the ranking */
const NOW = Date.UTC(2026, 9, 2, 10), DAYN = Math.floor(NOW / 864e5);
const kid = o => Object.assign({ band: '8-9', read: {}, readN: 0, lit: {}, rungs: {}, langs: [], tongue: null, world: 'delhi6',
  recent: [], lang: {}, seen: {} }, o || {});
const run = (k, x) => F.feedFor(k, Object.assign({ now: NOW, items: IDX, names: {} }, x || {}));
/* many children, built from the corpus: every band, a story read from each collection, a few languages */
const KIDS = [];
['4-7', '8-9', '10-12'].forEach(band => C.stories.filter((s, i) => i % 23 === 0).forEach((s, i) => {
  const lang = Object.keys(C.IND_PACKS)[i % 9];
  KIDS.push(kid({ band, read: { [s.id]: true }, readN: 1 + i, rungs: { [lang]: i % 5 }, langs: [lang], tongue: i % 2 ? lang : null,
    world: ['delhi6', 'diwali', 'rajasthan', 'antariksh'][i % 4],
    recent: [{ k: 'story', id: s.id, t: s.title, place: ((s.place || [])[0] || '').replace('IN-', ''), coll: s.collection, at: NOW - 3600e3 }] }));
}));
check('bands', 'a 4–7 child never sees a card above their band — across every child built', () => {
  KIDS.forEach(k => run(k).forEach(x => {
    const it = IDX.filter(r => r.id === x.id)[0];
    if (it.bands.indexOf(k.band) < 0) throw new Error(`a ${k.band} child was shown ${x.id} (${it.bands.join(',')})`);
  }));
});
check('context', 'reading a story moves its place\'s cards up, and the card says why', () => {
  const s = C.stories.filter(x => x.id === 'pt.monkey-crocodile')[0] || C.stories[5];
  const place = ((s.place || [])[0] || '').replace('IN-', '');
  const before = run(kid()), after = run(kid({ read: { [s.id]: true }, readN: 1,
    recent: [{ k: 'story', id: s.id, t: s.title, place, coll: s.collection, at: NOW - 600e3 }] }));
  const rel = list => list.filter(x => (IDX.filter(r => r.id === x.id)[0].topics || []).some(t => t === 'place:' + place || t === 'coll:' + s.collection));
  if (rel(after).length <= rel(before).length) throw new Error(`reading "${s.title}" did not move its cards up (${rel(before).length} → ${rel(after).length})`);
  if (!after.some(x => /Because you read/.test(x.why || ''))) throw new Error('no card says "Because you read …"');
});
check('due', 'a word that slipped comes back after its gap, and not before', () => {
  const w = ITEMS.filter(it => it.kind === 'tip' && it.key && /^word:/.test(it.key) && it.bands.indexOf('8-9') >= 0 && !it.unlock)[0];
  const lang = w.lang, srs = (due) => ({ [lang]: { asked: 5, srs: { [w.key]: { lapses: 2, box: 1, streak: 0, last: NOW - 2 * 864e5, due } } } });
  const early = run(kid({ lang: srs(NOW + 864e5) })).filter(x => x.id === w.id)[0];
  if (early && /slipped/.test(early.why || '')) throw new Error('a slipped word came back before its gap was over');
  const late = run(kid({ lang: srs(NOW - 3600e3) })).filter(x => x.id === w.id)[0];
  if (!late) throw new Error('a slipped word whose gap is over did not come back: ' + w.id);
  if (!/slipped on \w+day/.test(late.why || '')) throw new Error('the card does not say when the word slipped: ' + late.why);
});
check('mix', 'never three cards of one kind in a row; at most five questions', () => {
  KIDS.forEach(k => {
    const l = run(k);
    for (let i = 2; i < l.length; i++) if (l[i].kind === l[i - 1].kind && l[i].kind === l[i - 2].kind)
      throw new Error(`three ${l[i].kind} cards in a row for a ${k.band} child`);
    if (l.filter(x => x.kind === 'play').length > 5) throw new Error('more than five questions in a session');
  });
});
check('ends', 'a session is at most twenty cards, and what was seen this week sinks', () => {
  const k = kid({ band: '10-12' }), a = run(k);
  if (!a.length || a.length > 20) throw new Error('a session of ' + a.length + ' cards');
  const seen = {}; a.forEach(x => { seen[x.id] = DAYN; });
  const b = run(kid({ band: '10-12', seen }));
  const again = b.filter(x => seen[x.id] != null).length;
  if (again > 2) throw new Error(again + ' of today\'s cards came straight back in the next session');
});

/* ------------------------------------------------------------------ the screen */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.mp3': 'audio/mpeg' };
function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(APP, p);
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404).end('no'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}
const DESK = { width: 1280, height: 860 }, PHONE = { width: 390, height: 844 };
const openFeed = async p => { await p.evaluate(() => window.BI.go('feed')); await p.waitForSelector('.fd-end', { timeout: 20000 }).catch(() => {}); await p.waitForTimeout(300); };

check('screen', 'the page head, about twenty cards, the finished card; no counts or streaks; no sound before a tap; fits 390', async ({ p, base }) => {
  for (const vp of [DESK, PHONE]) {
    await p.setViewportSize(vp);
    /* a REAL load (a goto that changes only the hash keeps the page, and onboarding's taps) */
    await p.goto('about:blank');
    await p.goto(base + '#/feed', { waitUntil: 'networkidle' }); await p.waitForSelector('.fd-end', { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => {
      const cards = [...document.querySelectorAll('.fd-card:not(.fd-end)')];
      return { head: !!document.querySelector('#main [data-bz=phead] h1'), n: cards.length, end: !!document.querySelector('.fd-end'),
        last: document.querySelector('.fd-list') && document.querySelector('.fd-list').lastElementChild.classList.contains('fd-end'),
        why: cards.filter(c => (c.querySelector('.fd-why') || {}).textContent).length,
        badge: cards.filter(c => c.querySelector('.badge')).length, text: document.getElementById('main').innerText,
        sfx: window.IND_SFX ? window.IND_SFX.played.length : 0, music: window.IND_AUDIO && window.IND_AUDIO.playing ? window.IND_AUDIO.playing() : null,
        wide: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        maxw: Math.max(...cards.map(c => c.getBoundingClientRect().width)), tab: (document.querySelector('[data-bz=tab][aria-current="page"]') || {}).textContent };
    });
    if (!r.head) throw new Error('no page head');
    if (r.n < 12 || r.n > 20) throw new Error(r.n + ' cards — a session is about twenty');
    if (!r.end || !r.last) throw new Error('the feed does not end with the finished card');
    if (r.why !== r.n || r.badge !== r.n) throw new Error('a card has no reason or no badge');
    if (/\b(likes?|followers?|views|streak|days in a row)\b/i.test(r.text)) throw new Error('the feed counts likes, views or streaks');
    if (r.sfx || r.music) throw new Error('the feed made a sound before any tap: ' + JSON.stringify([r.sfx, r.music]));
    if (vp.width < 400 && r.wide > 0) throw new Error(`the feed is ${r.wide}px wider than the phone`);
    if (vp.width > 900 && r.maxw > 561) throw new Error('a card is ' + r.maxw + 'px wide, not 560');
    if (!/My Feed/.test(r.tab || '')) throw new Error('the My Feed tab is not lit on #/feed');
  }
});

check('play', 'a question: wrong by keyboard holds for Continue and leaks nothing; right by touch pays one coin, once', async ({ p }) => {
  await openFeed(p);
  const q = await p.evaluate(() => {
    const c = document.querySelector('.fd-card[data-kind="play"]');
    if (!c) return null;
    const id = c.getAttribute('data-fid'), it = window.IND_FEED_BODY[id];
    return { id, a: it.play.a, right: it.play.opts[it.play.a], html: c.innerHTML };
  });
  if (!q) throw new Error('no question in today\'s feed');
  if (/right|correct|data-a=/.test(q.html.replace(/class="[^"]*"/g, '')) && q.html.indexOf('data-o="' + q.a + '"') < 0) throw new Error('the card marks its answer');
  if (/\bright\b/.test((q.html.match(/class="[^"]*"/g) || []).join(' '))) throw new Error('an option is styled right before any answer');
  const wrongO = await p.evaluate(q => [...document.querySelectorAll(`.fd-card[data-fid="${q.id}"] [data-act="feedans"]`)].map(b => +b.getAttribute('data-o')).filter(o => o !== q.a)[0], q);
  const coins0 = await p.evaluate(() => window.BI.coins());
  await p.focus(`.fd-card[data-fid="${q.id}"] [data-act="feedans"][data-o="${wrongO}"]`); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  const held = await p.evaluate(q => { const c = document.querySelector(`.fd-card[data-fid="${q.id}"]`);
    return { cont: !!c.querySelector('[data-act="feedcont"]'), text: c.innerText, coins: window.BI.coins() }; }, q);
  if (!held.cont) throw new Error('a wrong answer did not hold for Continue');
  if (held.text.indexOf('Right!') >= 0) throw new Error('a wrong answer was called right');
  if (held.coins !== coins0) throw new Error('a wrong answer paid');
  await p.focus(`.fd-card[data-fid="${q.id}"] [data-act="feedcont"]`); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  /* the next question, by touch */
  const q2 = await p.evaluate(q => { const c = [...document.querySelectorAll('.fd-card[data-kind="play"]')].filter(x => x.getAttribute('data-fid') !== q.id)[0];
    if (!c) return null; const id = c.getAttribute('data-fid'); return { id, a: window.IND_FEED_BODY[id].play.a }; }, q);
  if (!q2) throw new Error('only one question in the feed');
  const c1 = await p.evaluate(() => window.BI.coins());
  await p.tap(`.fd-card[data-fid="${q2.id}"] [data-act="feedans"][data-o="${q2.a}"]`); await p.waitForTimeout(300);
  const r = await p.evaluate(q2 => ({ coins: window.BI.coins(), text: document.querySelector(`.fd-card[data-fid="${q2.id}"]`).innerText,
    paid: window.BI.S.feed.paid[q2.id] }), q2);
  if (r.coins !== c1 + 1) throw new Error(`a right answer paid ${r.coins - c1}, the standard 'answer' is 1`);
  if (!/Right!/.test(r.text) || !r.paid) throw new Error('a right answer was not marked');
  /* the same card again pays nothing */
  await p.evaluate(() => window.BI.go('home')); await openFeed(p);
  await p.evaluate(q2 => { const b = document.querySelector(`.fd-card[data-fid="${q2.id}"] [data-act="feedans"][data-o="${q2.a}"]`); if (b) b.click(); }, q2);
  await p.waitForTimeout(300);
  if ((await p.evaluate(() => window.BI.coins())) !== c1 + 1) throw new Error('the same question paid twice');
}, { touch: true });

check('keys', 'j / k and the arrows move from card to card', async ({ p }) => {
  await openFeed(p);
  await p.focus('.fd-card'); const f0 = await p.evaluate(() => document.activeElement.getAttribute('data-fid'));
  await p.keyboard.press('j'); await p.keyboard.press('ArrowDown');
  const f2 = await p.evaluate(() => [...document.querySelectorAll('.fd-card')].indexOf(document.activeElement));
  await p.keyboard.press('k');
  const f1 = await p.evaluate(() => [...document.querySelectorAll('.fd-card')].indexOf(document.activeElement));
  if (!f0 || f2 !== 2 || f1 !== 1) throw new Error(`j/k moved focus to ${f2} then ${f1}, not 2 then 1`);
});

check('routes', 'every card\'s route opens a real screen', async ({ p }) => {
  const routes = [...new Set(ITEMS.map(it => it.route))];
  await p.evaluate(() => window.IND_LOAD(window.IND_GROUPS()));
  const bad = [];
  for (const r of routes) {
    const res = await p.evaluate(async r => {
      location.hash = r; await new Promise(ok => setTimeout(ok, 30));
      if (window.BI.ready) await window.BI.ready();
      const m = document.getElementById('main'), t = m ? m.innerText : '';
      return { ok: !!m && !!m.querySelector('h1, h2, h3, .gframe .gf-title') && !/That page is not here|not in this pack|could not load/.test(t), hash: location.hash };
    }, r);
    if (!res.ok) bad.push(r);
  }
  if (bad.length) throw new Error(bad.length + ' of ' + routes.length + ' routes do not open a screen: ' + bad.slice(0, 4).join(' '));
});

check('pin', 'the grown-up\'s switch takes the tab and the ☰ row away, and #/feed says it is off', async ({ p }) => {
  await p.evaluate(() => window.BI.go('grown'));
  for (const d of '13571357') { await p.keyboard.press(d); await p.waitForTimeout(40); }
  await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('#main [data-act="feedtoggle"]').click()); await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({ tabs: [...document.querySelectorAll('[data-bz=tab]')].map(t => t.getAttribute('data-v')),
    dr: [...document.querySelectorAll('[data-bz=drawer] a')].map(a => a.getAttribute('href')) }));
  if (r.tabs.indexOf('feed') >= 0 || r.dr.indexOf('#/feed') >= 0) throw new Error('switched off, My Feed is still in the tabs or ☰');
  await p.evaluate(() => window.BI.go('feed')); await p.waitForTimeout(400);
  const t = await p.evaluate(() => ({ cards: document.querySelectorAll('.fd-card').length, text: document.getElementById('main').innerText }));
  if (t.cards || !/switched off/.test(t.text)) throw new Error('#/feed still shows cards when it is switched off');
});

check('demo', '?demo shows a sample feed and leaves the household untouched', async ({ p, base }) => {
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
  const dump = () => p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const before = await dump();
  await p.goto(base + '?demo', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await openFeed(p);
  const n = await p.evaluate(() => document.querySelectorAll('.fd-card:not(.fd-end)').length);
  if (n < 12) throw new Error('the sample shows ' + n + ' cards');
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  const after = await dump();
  const changed = Object.keys(Object.assign({}, before, after)).filter(k => k !== 'bi_device' && before[k] !== after[k]);
  if (changed.length) throw new Error('the sample feed touched the household: ' + changed.join(', '));
});

(async () => {
  let pass = 0, fail = 0, browser = null, server = null, base = '';
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const browserCheck = c.fn.length > 0 || /async/.test(c.fn.toString().slice(0, 12));
    let ctx = null;
    try {
      if (browserCheck) {
        if (!browser) {
          const { chromium } = require('playwright');
          server = await serve(); base = `http://127.0.0.1:${server.address().port}/`;
          browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
        }
        ctx = await browser.newContext({ viewport: DESK, serviceWorkers: 'block', hasTouch: !!c.touch });
        const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
        await p.goto(base, { waitUntil: 'networkidle' }); await skipOnboarding(p, { age: 9 }); await p.waitForTimeout(300);
        await c.fn({ p, ctx, base });
        if (errs.length) throw new Error('page error: ' + errs[0]);
      } else c.fn();
      console.log(`  ok   ${c.id.padEnd(9)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(9)} ${c.what}\n         ${String(e.message).split('\n')[0]}`); fail++;
    }
    if (ctx) await ctx.close();
  }
  if (browser) await browser.close(); if (server) server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
