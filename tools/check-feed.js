#!/usr/bin/env node
/* Bizzing India — My Feed (docs/30-feed.md; FAMILY-STANDARD §6a), held in node and in a browser.

   THE CONTENT (node, against the corpus as the page loads it)
     count      at least 100 cards at every rank of the ladder and at least 300 with no level;
                every id unique, every card's words in a body group
     levels     every level is a rank; a card behind a language rung is never above the rank a
                child who reached that rung must hold; stories, nights, eras and words always
                carry a level
     resolves   every item's `src` resolves to a corpus object, and the words on the card are
                found in it: a story's opening is in that story, a verse is that verse with its
                source, a fact is in its era, a word is in its pack with that meaning, a
                question's right answer is the corpus's own answer
     held       nothing flagged needs_review, unsure or needs_original, nothing gated 11+, no
                deity as a cast card, nothing from the Dharma pillar, the songs or the Neeti deck;
                a card wears its object's badge (a Katha never reads as Itihaas), a verse 🧭 Aaj
     near       no two cards' words are ≥ 80% the same
     distinct   no two items share the same src + kind + text
     facts      every fact on a card is the corpus's value at the path the builder named
                (tools/lib/feed-proof.json) — read again here, never typed
     specific   no card's door is a tool's front door (#/nani, #/chart/hi, #/verses/kural …):
                a card about one thing inside a list names that thing in its route
   THE RANKING (node: app/feed.js over the family's engine, family/bizzing-feed.js)
     engine     app/feed.js ranks nothing itself: it hands the family engine India's signals
     bands      a 4–7 child never sees a card whose bands leave them out, across many children
     ceiling    a child on rank n sees nothing above n+1, at most two "Coming up" peeks, most of
                the session at n, at most a quarter review and at most a quarter with no level
     climb      moving up a rank changes the "now" cards, and what was "now" becomes review
     context    reading a story moves its place's and its collection's cards up, and says so
     due        a word that slipped comes back FIRST once its gap is over, and not before
     mix        never three cards of one kind in a row; at most five questions
     ends       a session is at most twenty cards; what was seen this week sinks
   THE SCREEN (Chromium)
     screen     #/feed: the shell's page head, about twenty cards, then the finished card; no
                likes, counts or streaks; no sound before a tap; nothing wider than 390; only the
                feed's groups the session needs are loaded
     play       a question by keyboard (wrong holds for Continue, nothing leaked) and by touch
                (right pays one coin, once, through 'answer')
     keys       j / k and the arrows move card to card
     lands      every card's route opens the screen of THAT thing, with that thing first: the
                verse inside its collection, the letter inside the chart, the sentence on its rung,
                the dish on its state, the night in its epic (owner, 3 Oct 2026)
     pin        the grown-up's switch takes the tab and the ☰ row away, and #/feed says so
     demo       ?demo shows a sample feed and leaves the household untouched

   Each was watched to fail by breaking the thing it holds (docs/30-feed.md).
   Run:  node tools/check-feed.js            # all of them
         node tools/check-feed.js --only mix
*/
const FEED_COUNTER = /\b\d[\d,.]*\s*k?\s*(likes?|views?|followers?|hearts?)\b|\b(streaks?|days in a row)\b|\b(likes|views|followers)\s*[:·]\s*\d/i;
for (const [t, want] of [['so still it looked like a floor', false], ['the wolves like him', false], ['12 likes', true], ['1.2k views', true], ['3 followers', true], ['a 5-day streak', true], ['Likes: 4', true], ['7 days in a row', true]])
  if (FEED_COUNTER.test(t) !== want) throw new Error('check-feed: the counter pattern misreads "' + t + '"');
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');
const { load, APP } = require('./lib/corpus');
const { nearPairs, NEAR } = require('./lib/feed-near');
const { skipOnboarding } = require('./lib/onboard');
const { fill } = require('./lib/feed-facts');
const PROOF = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', 'feed-proof.json'), 'utf8'));

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
const C = load();
const fctx = { window: {} }; fctx.window = fctx; vm.createContext(fctx);
const GROUP_FILES = fs.readdirSync(APP).filter(f => /^data-feed-.+\.js$/.test(f) && f !== 'data-feed-index.js');
['data-feed-index.js'].concat(GROUP_FILES, ['feed.js']).forEach(f => vm.runInContext(fs.readFileSync(path.join(APP, f), 'utf8'), fctx, { filename: f }));
const F = fctx.IND_FEED, IX = fctx.IND_FEED_INDEX, IDX = F.decode(IX), BODY = fctx.IND_FEED_BODY;
const ITEMS = IDX.map(r => Object.assign({}, BODY[r.id], r, { play: (BODY[r.id] || {}).play }));
const RANKS = IX.ranks;
const APPJS = fs.readFileSync(path.join(APP, 'app.js'), 'utf8');
const RANK_AT = vm.runInNewContext(APPJS.match(/var RANK_AT = (\[[^\]]*\])/)[1]);
const levelOf = m => { for (let i = RANK_AT.length - 1; i > 0; i--) if (m >= RANK_AT[i]) return i; return 0; };
let ENGINE = null;     /* the family's engine, an ES module: imported before the checks run */

const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));

/* ------------------------------------------------------------------ the content */
const PER_LEVEL = 100, AGNOSTIC = 300;
check('count', 'at least 100 cards at every rank and 300 with no level; ids unique; every card has its words', () => {
  if (JSON.stringify(RANKS) !== JSON.stringify(vm.runInNewContext(APPJS.match(/var RANKS = (\[[^\]]*\])/)[1]))) throw new Error('the index\'s ranks are not app.js\'s RANKS');
  const per = RANKS.map((r, n) => ITEMS.filter(it => it.level === n).length), any = ITEMS.filter(it => it.level == null).length;
  RANKS.forEach((r, n) => { if (per[n] < PER_LEVEL) throw new Error(r + ' holds ' + per[n] + ' cards, not ' + PER_LEVEL); });
  if (any < AGNOSTIC) throw new Error(any + ' cards with no level, not ' + AGNOSTIC);
  const ids = new Set(ITEMS.map(i => i.id));
  if (ids.size !== ITEMS.length) throw new Error('ids repeat');
  const miss = IDX.filter(r => !BODY[r.id]);
  if (miss.length) throw new Error(miss.length + ' items have no words in any body group: ' + miss[0].id);
  const stray = Object.keys(BODY).filter(id => !ids.has(id));
  if (stray.length) throw new Error(stray.length + ' bodies have no index row: ' + stray[0]);
  console.log('         ' + ITEMS.length + ' cards — ' + RANKS.map((r, n) => r + ' ' + per[n]).join(' · ') + ' · no level ' + any);
});
const LEVELED = /^(story|hook|moment|moral|storyword|storyplace|night|nighthook|nightmoment|wonder|era|erakid|erabig|erawonder|found|moment-era|today|figure|word|wordq|letter|matra|sentence|talk|conjunct)$/;
check('levels', 'every level is a rank; a card behind a rung is never above the rank that rung implies', () => {
  const bad = ITEMS.filter(it => it.level != null && !(Number.isInteger(it.level) && it.level >= 0 && it.level < RANKS.length));
  if (bad.length) throw new Error(bad[0].id + ' has level ' + bad[0].level);
  const over = ITEMS.filter(it => it.unlock && it.level > levelOf(it.unlock.rung));
  if (over.length) throw new Error(`${over[0].id} opens at rung ${over[0].unlock.rung} but sits on ${RANKS[over[0].level]} — a child who unlocked it could be below that`);
  const loose = ITEMS.filter(it => LEVELED.test(it.kind) && it.level == null);
  if (loose.length) throw new Error(loose.length + ' stories, nights, eras or words carry no level: ' + loose[0].id);
  /* the gate the levels follow: every rung that holds cards puts them on the rank it implies */
  const rungs = {}; ITEMS.filter(it => it.unlock).forEach(it => { rungs[it.unlock.rung] = it.level; });
  Object.keys(rungs).forEach(r => { if (rungs[r] !== levelOf(+r)) throw new Error('rung ' + r + ' sits on ' + RANKS[rungs[r]] + ', not ' + RANKS[levelOf(+r)]); });
});

const at = (o, p) => p.reduce((x, k) => (x == null ? x : x[/^\d+$/.test(k) ? +k : k]), o);
const storyBy = {}; C.stories.forEach(s => { storyBy[s.id] = s; });
const stateName = c => (C.IND_GEO.states[c] || {}).name;
const epicBy = id => [C.IND_EPIC_RAMAYANA, C.IND_EPIC_MAHABHARATA].filter(e => e.id === id)[0];
function resolve(it) {
  const p = it.src.split(':'), kind = p[0];
  const has = (hay, needle, what) => { if (!needle || String(hay || '').indexOf(needle) < 0) throw new Error(`${it.id}: "${String(needle).slice(0, 50)}" is not in ${what}`); };
  const right = () => it.play.opts[it.play.a];
  const wantBadge = b => { if (it.badge !== b) throw new Error(`${it.id}: wears ${it.badge}, the object is ${b}`); };
  if (kind === 'story') {
    const s = storyBy[p[1]]; if (!s) throw new Error(it.id + ': no story ' + p[1]);
    if (s.needs_review) throw new Error(it.id + ': story is held for review');
    if (p[2] === 'words_hi') {
      const w = s.words_hi[+p[3]]; if (!w || it.text !== w[0] || right() !== w[2]) throw new Error(it.id + ': the word or its meaning is not the story\'s');
    } else if (p[2] === 'place') {
      if (right() !== stateName(String(s.place[0]).replace('IN-', ''))) throw new Error(it.id + ': the right answer is not the place the story lights');
      wantBadge(s.badge);
    } else { wantBadge(s.badge); has(at(s, p.slice(2)), it.body, 'the story'); }
  } else if (kind === 'epic') {
    const E = epicBy(p[1]); if (!E) throw new Error(it.id + ': no epic ' + p[1]);
    const ep = E.episodes[+p[3]];
    if (p[4] === 'words_hi') { const w = ep.words_hi[+p[5]]; if (!w || it.text !== w[0] || right() !== w[2]) throw new Error(it.id + ': the word is not the night\'s'); }
    else { wantBadge(E.badge || 'katha'); has(at(E, p.slice(2)), it.body, 'the epic'); }
  } else if (kind === 'cast') {
    const c = C.IND_EPIC_CAST[p[1]]; if (!c || c.desc !== it.body) throw new Error(it.id + ': not the epic cast\'s own line');
  } else if (kind === 'avatar') {
    const c = C.IND_AV_CARD(p[1]); if (!c) throw new Error(it.id + ': no card ' + p[1]);
    if (c.sacred || c.kind === 'sacred') throw new Error(it.id + ': a sacred figure as a feed card');
    if (at(c, p.slice(2)) !== it.body) throw new Error(it.id + ': not the card\'s own line');
    if (c.kind === 'real' && it.badge === 'katha') throw new Error(it.id + ': a real person under 🪔 Katha');
  } else if (kind === 'verse') {
    const v = C.IND_SHLOK.verses.filter(x => x.id === p[1])[0];
    if (!v) throw new Error(it.id + ': no verse ' + p[1]);
    if (v.unsure || v.needs_original || !v.source) throw new Error(it.id + ': the verse is flagged or unsourced');
    if ((p[2] === 'text_original' ? it.text : it.body) !== v[p[2]] || it.source !== v.source) throw new Error(it.id + ': the card is not the verse as data-shlok.js holds it');
    wantBadge(v.badge || 'aaj');
  } else if (kind === 'era') {
    const e = C.IND_ITIHAAS.eras.filter(x => x.id === p[1])[0];
    if (!e) throw new Error(it.id + ': no era ' + p[1]);
    if (e.needs_review || (e.gate || 4) >= 11 || !(e.sources || []).length) throw new Error(it.id + ': the era is held, gated or unsourced');
    wantBadge(p[2] === 'today' ? 'aaj' : 'itihaas');
    has(at(e, p.slice(2)), it.body, 'the era');
  } else if (kind === 'word') {
    const pk = C.IND_PACKS[p[1]], w = pk && (pk.lexicon || []).filter(x => x.word === p.slice(2).join(':'))[0];
    if (!w) throw new Error(it.id + ': no word ' + it.src);
    if (it.text !== w.word) throw new Error(it.id + ': the word on the card is not the word');
    if (it.play) { if (right() !== w.en) throw new Error(it.id + ': the right answer is not the pack\'s meaning'); }
    else if (it.body !== w.en) throw new Error(it.id + ': the meaning is not the pack\'s');
  } else if (kind === 'letter') {
    const sc = C.IND_SCRIPTS[p[1]], l = sc && (sc.vowels || []).concat(sc.consonants || []).filter(x => x.char === p.slice(2).join(':'))[0];
    if (!l || it.text !== l.char) throw new Error(it.id + ': no letter ' + it.src);
    has(it.body, l.name, 'the card (the letter\'s name)');
  } else if (kind === 'matra') {
    const sc = C.IND_SCRIPTS[p[1]], m = sc && (sc.matras || []).filter(x => x.sign === p.slice(2).join(':'))[0];
    if (!m || it.text !== m.example) throw new Error(it.id + ': no vowel sign ' + it.src);
    has(it.body, '“' + m.name + '”', 'the card (the sign\'s name)');
  } else if (kind === 'stage') {
    const pk = C.IND_PACKS[p[1]], st = pk && pk.stages.filter(x => x.id === p[2])[0], x = st && st.items.filter(y => y && y.id === p[3])[0];
    if (!x || it.text !== x.hi) throw new Error(it.id + ': no item ' + it.src);
    if (x.kind === 'conjunct') { has(it.body, x.word, 'the card'); has(it.body, x.parts.join(' + '), 'the card'); }
    else if (it.body !== x.en || it.roman !== x.roman) throw new Error(it.id + ': the line is not the pack\'s');
  } else if (kind === 'festival') {
    const f = C.IND_UTSAV.festivals.filter(x => x.id === p[1])[0];
    if (!f || f.needs_review) throw new Error(it.id + ': no festival, or held for review');
    wantBadge(f.badge || 'aaj');
    if (it.play) { if (right() !== stateName(f.states[0])) throw new Error(it.id + ': the right answer is not where it is kept'); }
    else has(at(f, p.slice(2)), it.body, 'the festival');
  } else if (kind === 'geo') {
    const g = C.IND_GEO.states[p[1]]; if (!g) throw new Error(it.id + ': no place ' + p[1]);
    if (p[2] === 'capital') { has(it.play.q, g.capital, 'the question'); if (right() !== g.name) throw new Error(it.id + ': wrong answer keyed'); }
    else has(g[p[2]], it.body, 'the place');
  } else if (kind === 'state') {
    const s = C.IND_STATES[p[1]]; if (!s) throw new Error(it.id + ': no state ' + p[1]);
    if (p[4] === 'dish') { has(it.play.q, at(s, p.slice(2)), 'the question'); if (right() !== stateName(p[1])) throw new Error(it.id + ': wrong answer keyed'); }
    else has(at(s, p.slice(2)), it.body, 'the state\'s facts');
  } else if (kind === 'bhugol') {
    const f = C.IND_BHUGOL.features.filter(x => x.id === p[1])[0]; if (!f) throw new Error(it.id + ': no feature ' + p[1]);
    has(f.f, it.body, 'the feature');
  } else if (kind === 'game') {
    if ((C.GAME_FRAME[p[1]] || [])[0] !== it.body) throw new Error(it.id + ': the how-to is not the game\'s own');
  } else if (kind === 'gully') {
    const g = C.IND_GULLY.games.filter(x => x.id === p[1])[0];
    if (!g || g.needs_review) throw new Error(it.id + ': no street game, or held');
    has(at(g, p.slice(2)), it.body, 'the street game');
  } else if (kind === 'nani') {
    const q = C.IND_NANI.questions.filter(x => x.id === p[1])[0];
    if (!q || q.en !== it.body || (it.text && it.text !== q.hi)) throw new Error(it.id + ': not Nani\'s own question');
  } else if (kind === 'rishtey') {
    const t = C.IND_RISHTEY.terms.filter(x => x.id === p[1])[0];
    if (!t || t.en !== it.body || t.hi !== it.text) throw new Error(it.id + ': not the family word as Rishtey holds it');
  } else if (kind === 'value') {
    const v = C.IND_NEETI.values.filter(x => x.id === p[1])[0];
    if (!v || v.kid !== it.body || v.term !== it.text) throw new Error(it.id + ': not the value as Neeti holds it');
  } else throw new Error(it.id + ': a src of a kind nothing resolves: ' + it.src);
  if (it.play) {
    if (new Set(it.play.opts).size !== it.play.opts.length) throw new Error(it.id + ': two options are the same');
    if ((it.play.q + ' ' + (it.title || '') + ' ' + (it.text || '') + ' ' + (it.roman || '') + ' ' + (it.why || '')).toLowerCase().indexOf(String(it.play.opts[it.play.a]).toLowerCase()) >= 0 && kind !== 'geo')
      throw new Error(it.id + ': the question gives its answer away');
  }
}
check('resolves', 'every src resolves, and every quotation, meaning and answer is found in it', () => {
  const bad = [];
  ITEMS.forEach(it => { try { resolve(it); } catch (e) { bad.push(e.message); } });
  if (bad.length) throw new Error(bad.length + ' do not resolve: ' + bad.slice(0, 4).join(' · '));
});
check('held', 'nothing held for review or gated 11+; no deity as a cast card; bands are the app\'s three', () => {
  const B = ['4-7', '8-9', '10-12'];
  const bad = ITEMS.filter(it => !it.bands.length || it.bands.some(b => B.indexOf(b) < 0));
  if (bad.length) throw new Error('bad bands on ' + bad[0].id);
  /* the Gita verses are 10+: the 4–7 band must not hold them (and the test below needs some) */
  const top = ITEMS.filter(it => it.bands.indexOf('4-7') < 0);
  if (!top.length) throw new Error('no item is above the youngest band, so the band rule is untested');
  const held = ITEMS.filter(it => /colonial|freedom|naya-bharat|gita-course|^dharma|^geet|^song|neeti-deck/.test(it.src));
  if (held.length) throw new Error('a held object is in the feed: ' + held[0].src);
  const KATHA_ONLY = new Set(C.stories.filter(s => s.badge === 'katha').map(s => s.id));
  const wrong = ITEMS.filter(it => it.badge === 'itihaas' && /^story:/.test(it.src) && KATHA_ONLY.has(it.src.split(':')[1]));
  if (wrong.length) throw new Error('a Katha reads as Itihaas: ' + wrong[0].id);
  const sacred = ITEMS.filter(it => /^avatar:/.test(it.src) && (C.IND_AV_CARD(it.src.split(':')[1]) || {}).sacred);
  if (sacred.length) throw new Error('a sacred figure is a feed card: ' + sacred[0].id);
});
check('near', 'no two cards\' words are 80% the same or more', () => {
  const { pairs } = nearPairs(ITEMS);
  if (pairs.length) throw new Error(pairs.length + ' near-duplicates, e.g. ' + ITEMS[pairs[0].j].id + ' ≈ ' + ITEMS[pairs[0].i].id + ' (' + Math.round(pairs[0].s * 100) + '%)');
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
const kid = o => Object.assign({ band: '8-9', level: 2, read: {}, readN: 0, lit: {}, rungs: {}, langs: [], tongue: null, world: 'delhi6',
  recent: [], lang: {}, seen: {} }, o || {});
/* the names the page passes (app.js feedNames): places and languages by name, as a child reads them */
const NAMES = {};
Object.keys(C.IND_GEO.states).forEach(c => { NAMES[c] = C.IND_GEO.states[c].name; });
Object.keys(C.IND_PACKS).forEach(id => { NAMES['lang:' + id] = C.IND_PACKS[id].name.en; });
const run = (k, x) => F.feedFor(k, Object.assign({ now: NOW, items: IDX, names: NAMES, ranks: RANKS, engine: ENGINE }, x || {}));
const byId = {}; IDX.forEach(r => { byId[r.id] = r; });
/* many children, built from the corpus: every band and rank, a story read from each collection, a few languages */
const KIDS = [];
['4-7', '8-9', '10-12'].forEach(band => C.stories.filter((s, i) => i % 23 === 0).forEach((s, i) => {
  const lang = Object.keys(C.IND_PACKS)[i % 9];
  KIDS.push(kid({ band, level: i % RANKS.length, read: { [s.id]: true }, readN: 1 + i, rungs: { [lang]: i % 5 }, langs: [lang], tongue: i % 2 ? lang : null,
    world: ['delhi6', 'diwali', 'rajasthan', 'antariksh'][i % 4],
    recent: [{ k: 'story', id: s.id, t: s.title, place: ((s.place || [])[0] || '').replace('IN-', ''), coll: s.collection, at: NOW - 3600e3 }] }));
}));
check('facts', 'every fact on a card is the corpus value at the path the builder named', () => {
  let n = 0;
  for (const it of ITEMS) {
    const want = (PROOF.facts[it.id] || []).map(spec => fill(C, spec)).filter(Boolean);
    const got = it.facts || [];
    if (JSON.stringify(got) !== JSON.stringify(want))
      throw new Error(`${it.id}: the card says ${JSON.stringify(got).slice(0, 140)} but the corpus gives ${JSON.stringify(want).slice(0, 140)}`);
    n += got.length;
  }
  if (n < ITEMS.length) throw new Error(`only ${n} facts across ${ITEMS.length} cards — the cards have not got more to say`);
});

/* the front doors: a card's route may be one of these only if the card is about the whole tool */
const FRONT_DOOR = /^#\/(nani|rishtey|map|stories|bhasha|utsav|itihaas|mela|khel|gully|shlok|neeti|epics|play|feed|home)$|^#\/(verses|chart|pack)\/[^|]*$/;
/* a card about one thing inside a list must name it in its route */
const IN_A_LIST = { verse: 1, versemeaning: 1, versewhy: 1, letter: 1, matra: 1, sentence: 1, talk: 1, conjunct: 1, ask: 1, family: 1,
  feature: 1, trivia: 1, see: 1, food: 1, found: 1, 'moment-era': 1, today: 1, figure: 1, festdo: 1, festways: 1, moment: 1,
  night: 1, nighthook: 1, nightmoment: 1, wonder: 1 };
check('specific', 'no card\'s door is a tool\'s front door; a thing inside a list is named in its route', () => {
  const bad = [];
  for (const it of ITEMS) {
    if (!it.route) { bad.push(it.id + ' has no route'); continue; }
    if (FRONT_DOOR.test(it.route)) bad.push(it.id + ' → ' + it.route);
    else if (IN_A_LIST[it.kind] && !/\|/.test(it.route) && !/^#\/(nani|rishtey)\/./.test(it.route)) bad.push(it.id + ' (' + it.kind + ') → ' + it.route + ' names no item');
    if (!PROOF.land[it.id]) bad.push(it.id + ' says nothing about what its screen must show');
  }
  if (bad.length) throw new Error(bad.length + ' cards open a generic screen: ' + bad.slice(0, 5).join('; '));
});

check('engine', 'app/feed.js ranks nothing itself: the family engine decides, and it is the family\'s copy', () => {
  const src = fs.readFileSync(path.join(APP, 'feed.js'), 'utf8');
  if (/\.sort\(|MAX_PLAY|MAX_KIND|SPREAD/.test(src)) throw new Error('app/feed.js sorts or caps cards itself — there must be one engine');
  let called = 0;
  const spy = Object.assign({}, ENGINE, { feedFor: o => { called++; return ENGINE.feedFor(o); } });
  run(kid(), { engine: spy });
  if (!called) throw new Error('app/feed.js did not ask the family engine');
  const bridge = fs.readFileSync(path.join(APP, 'family', 'bridge.js'), 'utf8');
  if (!/import \* as \w+ from '\.\/bizzing-feed\.js'/.test(bridge) || !/IND_FEED_ENGINE/.test(bridge)) throw new Error('family/bridge.js does not hand the engine to the page');
});
check('bands', 'a 4–7 child never sees a card above their band — across every child built', () => {
  KIDS.forEach(k => run(k).forEach(x => {
    const it = byId[x.id];
    if (it.bands.indexOf(k.band) < 0) throw new Error(`a ${k.band} child was shown ${x.id} (${it.bands.join(',')})`);
  }));
});
check('ceiling', 'on rank n: nothing above n+1, at most two peeks, most at n, at most a quarter review and a quarter with no level', () => {
  for (let n = 0; n < RANKS.length; n++) for (const band of ['4-7', '8-9', '10-12']) {
    const l = run(kid({ band, level: n, rungs: { hi: 7, ta: 7 }, langs: ['hi'] }));
    const above = l.filter(x => byId[x.id].level != null && byId[x.id].level > n + 1);
    if (above.length) throw new Error(`a ${RANKS[n]} child was shown ${above[0].id} from ${RANKS[byId[above[0].id].level]}`);
    const cnt = t => l.filter(x => x.tier === t).length;
    if (l.filter(x => byId[x.id].level === n + 1).length > 2) throw new Error(`a ${RANKS[n]} child got more than two peeks at ${RANKS[n + 1]}`);
    if (cnt('now') < 0.6 * l.length) throw new Error(`a ${band} ${RANKS[n]} child: only ${cnt('now')} of ${l.length} cards at their own rank`);
    if (cnt('review') > 0.25 * l.length || cnt('any') > 0.25 * l.length) throw new Error(`a ${RANKS[n]} child: ${cnt('review')} review and ${cnt('any')} level-free of ${l.length}`);
    if (l.some(x => x.tier === 'next' && !/^Coming up on /.test(x.why || ''))) throw new Error('a peek does not say "Coming up on …"');
  }
});
check('climb', 'moving up a rank changes the "now" cards, and what was "now" comes back only as review', () => {
  for (let n = 0; n < RANKS.length - 1; n++) {
    const a = run(kid({ level: n })), b = run(kid({ level: n + 1 }));
    const nowA = a.filter(x => x.tier === 'now').map(x => x.id), nowB = new Set(b.filter(x => x.tier === 'now').map(x => x.id));
    if (!nowA.length || !nowB.size) throw new Error(`no "now" cards at ${RANKS[n]} or ${RANKS[n + 1]}`);
    const same = nowA.filter(id => nowB.has(id));
    if (same.length) throw new Error(`climbing from ${RANKS[n]} to ${RANKS[n + 1]} left ${same.length} "now" cards the same: ${same[0]}`);
    const back = b.filter(x => nowA.indexOf(x.id) >= 0);
    if (back.some(x => x.tier !== 'review')) throw new Error('a card from the rank below came back as something other than review');
    if (!b.some(x => x.tier === 'review' && /^To keep: from /.test(x.why || '')) && n + 1 > 0 && b.some(x => x.tier === 'review'))
      throw new Error('a review card does not say where it is from');
  }
});
check('context', 'reading a story moves its place\'s cards up, and the card says why', () => {
  const s = C.stories.filter(x => x.id === 'pt.monkey-crocodile')[0] || C.stories[5];
  const place = ((s.place || [])[0] || '').replace('IN-', '');
  const before = run(kid()), after = run(kid({ read: { [s.id]: true }, readN: 1,
    recent: [{ k: 'story', id: s.id, t: s.title, place, coll: s.collection, at: NOW - 600e3 }] }));
  const rel = list => list.filter(x => (byId[x.id].topics || []).some(t => t === 'place:' + place || t === 'coll:' + s.collection));
  if (rel(after).length <= rel(before).length) throw new Error(`reading "${s.title}" did not move its cards up (${rel(before).length} → ${rel(after).length})`);
  if (!after.some(x => /Because you read/.test(x.why || ''))) throw new Error('no card says "Because you read …"');
  if (after.some(x => byId[x.id].news && byId[x.id].topics[0] === 'story:' + s.id)) throw new Error('a story just read came back as news');
});
check('due', 'a word that slipped comes back first once its gap is over, and not before', () => {
  const w = ITEMS.filter(it => it.kind === 'word' && it.key && it.level === 0 && it.bands.indexOf('8-9') >= 0 && !it.unlock)[0];
  const lang = w.lang, srsKey = w.key.split('|')[1];
  const srs = due => ({ [lang]: { asked: 5, srs: { [srsKey]: { lapses: 2, box: 1, streak: 0, last: NOW - 2 * 864e5, due } } } });
  for (const level of [0, 3]) {
    const early = run(kid({ level, lang: srs(NOW + 864e5) })).filter(x => /slipped/.test(x.why || ''));
    if (early.length) throw new Error('a slipped word came back before its gap was over');
    const late = run(kid({ level, lang: srs(NOW - 3600e3) }));
    const i = late.findIndex(x => x.id === w.id);
    if (i < 0) throw new Error(`a slipped word whose gap is over did not come back for a ${RANKS[level]} child: ${w.id}`);
    if (late.slice(0, i).some(x => !/slipped/.test(x.why || ''))) throw new Error(`a slipped word came back at card ${i + 1}, not first`);
    if (!/slipped on \w+day/.test(late[i].why || '')) throw new Error('the card does not say when the word slipped: ' + late[i].why);
  }
});
check('noleak', 'the reason a question is on the feed never says its answer, for any child built', () => {
  const kids = KIDS.concat(Object.keys(C.IND_GEO.states).map((c, i) => kid({ level: i % RANKS.length, lit: { [c]: 1 },
    recent: C.stories.filter(s => (s.place || [])[0] === 'IN-' + c).slice(0, 1).map(s => ({ k: 'story', id: s.id, t: s.title, place: c, coll: s.collection, at: NOW - 600e3 })) })));
  /* questions only, so every session is the five questions the child's context ranks highest */
  const PLAYS = IDX.filter(r => r.play);
  let qs = 0;
  kids.forEach(k => run(k, { items: PLAYS }).forEach(x => {
    const it = ITEMS.filter(i => i.id === x.id)[0];
    if (!it.play) return; qs++;
    if (String(x.why || '').toLowerCase().indexOf(String(it.play.opts[it.play.a]).toLowerCase()) >= 0) throw new Error(`${x.id}: its reason "${x.why}" says the answer`);
  }));
  if (qs < 50) throw new Error('only ' + qs + ' questions across every child built — the check sees too little');
});
check('mix', 'never three cards of one kind in a row; at most five questions', () => {
  KIDS.forEach(k => {
    const l = run(k);
    for (let i = 2; i < l.length; i++) if (l[i].kind === l[i - 1].kind && l[i].kind === l[i - 2].kind)
      throw new Error(`three ${l[i].kind} cards in a row for a ${k.band} child`);
    if (l.filter(x => byId[x.id].play).length > 5) throw new Error('more than five questions in a session');
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
    /* only the groups this session's cards live in: the feed is thousands of cards, and a session is twenty */
    const g = await p.evaluate(() => {
      const want = new Set((window.BI.S.feed.ids || []).map(x => 'feed-' + x.g));
      const has = window.IND_GROUPS().filter(x => /^feed-/.test(x) && window.IND_HAS(x));
      return { want: [...want], extra: has.filter(x => !want.has(x)), all: window.IND_GROUPS().filter(x => /^feed-/.test(x)).length };
    });
    if (g.extra.length) throw new Error('#/feed loaded groups no card on it needs: ' + g.extra.join(', '));
    if (g.want.length >= g.all) throw new Error('a session needed every one of the feed\'s groups');
    if (r.n < 12 || r.n > 20) throw new Error(r.n + ' cards — a session is about twenty');
    if (!r.end || !r.last) throw new Error('the feed does not end with the finished card');
    if (r.why !== r.n || r.badge !== r.n) throw new Error('a card has no reason or no badge');
    /* a COUNTER ("12 likes", "1.2k views", "3 followers") or streak talk — not the word "like" in a story
       ("so still it looked like a floor"), which the first version of this check mistook for one */
    if (FEED_COUNTER.test(r.text)) throw new Error('the feed counts likes, views or streaks');
    if (r.sfx || r.music) throw new Error('the feed made a sound before any tap: ' + JSON.stringify([r.sfx, r.music]));
    if (vp.width < 400 && r.wide > 0) throw new Error(`the feed is ${r.wide}px wider than the phone`);
    if (vp.width > 900 && r.maxw > 561) throw new Error('a card is ' + r.maxw + 'px wide, not 560');
    if (!/My Feed/.test(r.tab || '')) throw new Error('the My Feed tab is not lit on #/feed');
  }
});

check('play', 'a question: wrong by keyboard holds for Continue and leaks nothing; right by touch pays one coin, once', async ({ p }) => {
  await openFeed(p);
  const q = await p.evaluate(() => {
    const c = document.querySelector('.fd-card[data-play]');
    if (!c) return null;
    const id = c.getAttribute('data-fid'), it = window.IND_FEED_BODY[id];
    return { id, a: it.play.a, right: it.play.opts[it.play.a], html: c.innerHTML };
  });
  if (!q) throw new Error('no question in today\'s feed');
  if (/right|correct|data-a=/.test(q.html.replace(/class="[^"]*"/g, '')) && q.html.indexOf('data-o="' + q.a + '"') < 0) throw new Error('the card marks its answer');
  if (/\bright\b/.test((q.html.match(/class="[^"]*"/g) || []).join(' '))) throw new Error('an option is styled right before any answer');
  /* NO DOOR AND NO FACTS UNTIL IT IS ANSWERED: "Open Kerala →" under "Which state has
     Thiruvananthapuram as its capital?" was the answer, printed before it was asked */
  const shut = await p.evaluate(() => [...document.querySelectorAll('.fd-card[data-play]')].map(c => ({ id: c.getAttribute('data-fid'),
    door: !!c.querySelector('.fd-go'), facts: !!c.querySelector('.fd-facts, .fd-more') })).filter(x => x.door || x.facts));
  if (shut.length) throw new Error('a question shows its door or its facts before it is answered: ' + shut.map(x => x.id).join(', '));
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
  const q2 = await p.evaluate(q => { const c = [...document.querySelectorAll('.fd-card[data-play]')].filter(x => x.getAttribute('data-fid') !== q.id)[0];
    if (!c) return null; const id = c.getAttribute('data-fid'); return { id, a: window.IND_FEED_BODY[id].play.a }; }, q);
  if (!q2) throw new Error('only one question in the feed');
  const c1 = await p.evaluate(() => window.BI.coins());
  await p.tap(`.fd-card[data-fid="${q2.id}"] [data-act="feedans"][data-o="${q2.a}"]`); await p.waitForTimeout(300);
  const r = await p.evaluate(q2 => ({ coins: window.BI.coins(), text: document.querySelector(`.fd-card[data-fid="${q2.id}"]`).innerText,
    paid: window.BI.S.feed.paid[q2.id] }), q2);
  if (r.coins !== c1 + 1) throw new Error(`a right answer paid ${r.coins - c1}, the standard 'answer' is 1`);
  if (!/Right!/.test(r.text) || !r.paid) throw new Error('a right answer was not marked');
  if (!(await p.$(`.fd-card[data-fid="${q2.id}"] .fd-go`))) throw new Error('answered, the question still has no way to the thing it asked about');
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

check('lands', 'every card opens the screen of that very thing, with that thing first', async ({ p }) => {
  /* every distinct route, and everything it must show — a story's opening and its middle share
     no route; its hook and its moral do, and both land on the story */
  const want = {};
  for (const it of ITEMS) (want[it.route] = want[it.route] || new Set()).add(PROOF.land[it.id]);
  const routes = Object.keys(want).map(r => ({ r, land: [...want[r]].filter(Boolean), focus: /\|/.test(r) || /^#\/(nani|rishtey)\/./.test(r) }));
  await p.evaluate(() => window.IND_LOAD(window.IND_GROUPS()));
  const bad = [];
  for (let i = 0; i < routes.length; i += 150) {
    const res = await p.evaluate(async batch => {
      const norm = t => String(t || '').replace(/\s+/g, ' ').trim();
      const out = [];
      for (const x of batch) {
        location.hash = x.r; await new Promise(ok => setTimeout(ok, 0));
        if (window.BI.ready) await window.BI.ready();
        const m = document.getElementById('main');
        if (!m || /That page is not here|not in this pack|could not load|^(Story|Pack) not found\./m.test(m.innerText.slice(0, 400))) { out.push(x.r + ' opens nothing'); continue; }
        const fc = m.querySelector('[data-focus]');
        if (x.focus && !fc) { out.push(x.r + ' has no card for the thing it names'); continue; }
        /* and it is FIRST: no other card stands between the way back and the thing itself
           (the story is the exception — its scene is the whole screen) */
        if (fc && !/^#\/story\//.test(x.r)) { const c0 = m.querySelector('.card, .statehero'); if (c0 && c0 !== fc && !fc.contains(c0)) { out.push(x.r + ' puts something else above the thing it names'); continue; } }
        /* where the thing must be: the focus card, or the top of the screen (its first heading
           and what sits right under it) — never somewhere down the page */
        const top = fc ? norm(fc.innerText) : norm(m.innerText).slice(0, 700);
        const miss = x.land.filter(l => top.indexOf(norm(l)) < 0);
        if (miss.length) out.push(x.r + ' does not lead with "' + miss[0].slice(0, 40) + '"');
      }
      return out;
    }, routes.slice(i, i + 150));
    bad.push(...res);
  }
  if (bad.length) throw new Error(bad.length + ' of ' + routes.length + ' routes do not land on their thing: ' + bad.slice(0, 4).join(' · '));
});

/* WHOLE ON A PHONE. A child sent from a card to the moment a story turns on landed on one clipped
   line of it: the question under that scene is tall, the picture held its 120px, and the words
   were what gave way. Every route that names a thing, on a phone: the thing is not cut short. */
check('whole', 'on a phone, the thing a card opens on is shown whole, never clipped inside its own box', async ({ p }) => {
  const routes = [...new Set(ITEMS.map(it => it.route))].filter(r => /\|/.test(r) || /^#\/(nani|rishtey)\/./.test(r));
  await p.setViewportSize(PHONE);
  await p.evaluate(() => window.IND_LOAD(window.IND_GROUPS()));
  const bad = [];
  for (let i = 0; i < routes.length; i += 150) {
    bad.push(...await p.evaluate(async batch => {
      const out = [];
      for (const r of batch) {
        location.hash = r; await new Promise(ok => setTimeout(ok, 0));
        if (window.BI.ready) await window.BI.ready();
        const fc = document.querySelector('#main [data-focus]');
        if (fc && fc.scrollHeight > fc.clientHeight + 2) out.push(r + ' shows ' + fc.clientHeight + 'px of ' + fc.scrollHeight);
      }
      return out;
    }, routes.slice(i, i + 150)));
  }
  if (bad.length) throw new Error(bad.length + ' of ' + routes.length + ' landings clip the thing they name: ' + bad.slice(0, 4).join(' · '));
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
  /* the engine is an ES module in a folder with no package type: imported from its own bytes, so
     node neither guesses at its type nor warns about guessing */
  ENGINE = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(APP, 'family', 'bizzing-feed.js'), 'utf8')));
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
