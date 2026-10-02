#!/usr/bin/env node
/* Bizzing India — builds My Feed from the corpus (docs/30-feed.md).

   NOTHING IN THE FEED IS TYPED. Every card is cut from an object the app already holds and
   already shows somewhere — a story's own opening, a verse with its source, a dated moment
   from an era that carries sources[], a word from a language pack, a state's own facts —
   and carries `src`, the address of that object, which tools/check-feed.js resolves again on
   every run. What is held back, and why:
     - anything flagged needs_review (stories, festivals, the colonial, freedom and recent
       eras) and anything gated 11+, which is where the sensitive history lives;
     - verses flagged unsure or needs_original in data-shlok.js;
     - a state's `myth` field (it names deities as the place's story — kept on the state page,
       where it is framed, and not cut loose into a feed);
     - the Gita course (needsReview); the five Gita verses come from data-shlok.js itself.
   Where the corpus runs out, the feed stops: the counts by kind are printed and written to
   tools/lib/feed-manifest.json, never padded.

   Output: app/data-feed-index.js (what the ranking needs, loaded with the feed) and four
   body groups app/data-feed-{a,b,c,d}.js, each a lazy group fetched only when a card in it is
   on today's feed.

   Run: node tools/build-feed.js            (then npm test) */
'use strict';
const fs = require('fs'), path = require('path');
const { load, APP } = require('./lib/corpus');
const C = load();

const BANDS = [['4-7', 7], ['8-9', 9], ['10-12', 12]];
const bandsFor = gate => BANDS.filter(b => (gate || 4) <= b[1]).map(b => b[0]);
const items = [];
const add = it => { items.push(it); return it; };
/* a quotation is cut at a sentence end, never rewritten — so it is always a substring */
function clip(text, max) {
  text = String(text || '').trim();
  if (text.length <= (max || 280)) return text;
  const parts = text.match(/[^.!?]+[.!?]+["”’)]*\s*/g) || [text];
  let out = '';
  for (const p of parts) { if ((out + p).trim().length > (max || 280)) break; out += p; }
  return (out || parts[0]).trim();
}
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const stateName = c => (C.IND_GEO.states[c] || {}).name || c;

/* ---------------------------------------------------------------- stories (group a) */
const COLL = {};
[].concat(...Object.keys(C).filter(k => /^IND_COLLECTIONS/.test(k)).map(k => C[k] || [])).forEach(x => { COLL[x.id] = x.name; });
const STORY_ART = new Set(fs.readdirSync(path.join(APP, 'art', 'story')).map(f => f.replace(/\.jpg$/, '')));
const okStories = C.stories.filter(s => !s.needs_review && s.source && s.scenes && s.scenes.length);
okStories.forEach(s => {
  const places = (s.place || []).map(p => String(p).replace('IN-', ''));
  const art = STORY_ART.has(s.id.replace(/\./g, '-')) ? 'art/story/' + s.id.replace(/\./g, '-') + '.jpg' : null;
  const topics = ['story:' + s.id, 'coll:' + s.collection].concat(places.map(p => 'place:' + p));
  add({ id: 'st-' + s.id, kind: 'story', badge: s.badge, bands: bandsFor(4), unlock: null, topics, g: 'a',
    src: 'story:' + s.id + ':scenes:0:text', route: '#/story/' + s.id, title: s.title, body: clip(s.scenes[0].text),
    art, cta: 'Read the story', why: 'From ' + (COLL[s.collection] || 'the story shelves') });
  /* the longer stories get a second card: the moment the middle of the story turns on */
  if (s.scenes.length >= 10) {
    const i = Math.floor(s.scenes.length / 2);
    add({ id: 'sm-' + s.id, kind: 'story', badge: s.badge, bands: bandsFor(8), unlock: { read: 1 }, topics, g: 'a',
      src: 'story:' + s.id + ':scenes:' + i + ':text', route: '#/story/' + s.id, title: s.title + ' — the middle',
      body: clip(s.scenes[i].text), art, cta: 'Read the story', why: 'A moment from ' + s.title });
  }
});
/* the epics, one card per episode, from its first card */
[C.IND_EPIC_RAMAYANA, C.IND_EPIC_MAHABHARATA].forEach(E => {
  E.episodes.forEach((ep, ei) => {
    if (!ep.cards || !ep.cards[0]) return;
    add({ id: 'ep-' + E.id + '-' + ep.n, kind: 'story', badge: E.badge || 'katha', bands: bandsFor(E.age_gate), unlock: null,
      topics: ['epic:' + E.id], g: 'a', src: 'epic:' + E.id + ':episodes:' + ei + ':cards:0:text', route: '#/epic/' + E.id,
      act: { a: 'episode', id: E.id, n: ep.n }, title: E.title + ' · ' + ep.title, body: clip(ep.cards[0].text),
      art: null, cta: 'Hear this night', why: E.title + ', night ' + ep.n });
  });
});

/* ---------------------------------------------------------------- verses (group b) */
const VLANG = { kural: 'ta', dhammapada: 'pi', subhashita: 'sa', gita: 'sa' };
C.IND_SHLOK.verses.filter(v => v.source && v.text_original && !v.unsure && !v.needs_original).forEach(v => {
  const coll = C.IND_SHLOK.collections.filter(x => x.id === v.collection)[0] || {};
  add({ id: 'vs-' + v.id, kind: 'verse', badge: 'katha', bands: bandsFor(v.gate), unlock: null,
    topics: ['verse:' + v.collection].concat(v.collection === 'kural' ? ['lang:ta'] : []), g: 'b',
    src: 'verse:' + v.id, route: '#/verses/' + v.collection, title: coll.name || v.collection,
    text: v.text_original, lang: VLANG[v.collection], roman: v.translit, body: v.meaning_kid, source: v.source,
    art: null, cta: 'More verses', why: 'A verse from ' + (coll.name || 'the verses') });
});

/* ---------------------------------------------------------------- Itihaas (group b) */
C.IND_ITIHAAS.eras.filter(e => !e.needs_review && (e.gate || 4) < 11 && (e.sources || []).length).forEach(e => {
  const base = { kind: 'fact', badge: 'itihaas', bands: bandsFor(e.gate), unlock: null, g: 'b',
    route: '#/era/' + e.id, cta: 'Sail to ' + e.title, art: null, sources: e.sources, why: e.title + ', ' + e.when };
  const topics = ['era:' + e.id].concat(e.place ? ['place:' + e.place] : []);
  (e.moments || []).forEach((m, i) => add(Object.assign({}, base, { id: 'it-' + e.id + '-m' + i, topics,
    src: 'era:' + e.id + ':moments:' + i + ':what', title: m.when, body: clip(m.what) })));
  /* what is still there today is a place, not a claim about the era's evidence: it carries
     its own state, and not the era's sources list */
  (e.today || []).forEach((t, i) => add(Object.assign({}, base, { id: 'it-' + e.id + '-t' + i, sources: undefined,
    topics: ['era:' + e.id].concat(t.state ? ['place:' + t.state] : []), badge: 'aaj',
    src: 'era:' + e.id + ':today:' + i + ':what', title: 'Still there today · ' + t.where, body: clip(t.what) })));
  (e.figures || []).forEach((f, i) => f.line && add(Object.assign({}, base, { id: 'it-' + e.id + '-f' + i, topics,
    src: 'era:' + e.id + ':figures:' + i + ':line', title: f.name, body: clip(f.line) })));
});

/* ---------------------------------------------------------------- Bhasha (group c) */
const PER_LANG_WORDS = 12, PER_LANG_LETTERS = 6, PER_LANG_PLAY = 6;
Object.keys(C.IND_PACKS).forEach(id => {
  const p = C.IND_PACKS[id], sc = C.IND_SCRIPTS[p.script], lex = {};
  (p.lexicon || []).forEach(w => { lex[w.word] = w; });
  /* the words a child meets first: the Listening rung, then the word rung, in the pack's own order */
  const s0 = (p.stages || []).filter(s => s.id === 's0')[0] || { items: [] };
  const s3 = (p.stages || []).filter(s => s.id === 's3')[0] || { items: [] };
  const words = [], seen = {};
  [[s0, 0], [s3, 3]].forEach(([st, rung]) => (st.items || []).forEach(w => {
    if (lex[w] && lex[w].en && !seen[w]) { seen[w] = 1; words.push([lex[w], rung]); } }));
  words.slice(0, PER_LANG_WORDS).forEach(([w, rung], i) => add({ id: 'bw-' + id + '-' + i, kind: 'tip', badge: 'aaj',
    bands: bandsFor(4), unlock: rung ? { lang: id, rung } : null, topics: ['lang:' + id], g: 'c', key: 'word:' + w.word,
    lang: id, src: 'word:' + id + ':' + w.word, route: '#/wordcard/' + encodeURIComponent(id + ':' + w.word),
    title: p.name.en + ' word', text: w.word, roman: w.roman, body: w.en, art: null, cta: 'Open the word card',
    why: 'A word from the ' + p.name.en + ' path' }));
  const letters = (sc ? (sc.vowels || []).slice(0, 4).concat((sc.consonants || []).slice(0, 4)) : []).filter(l => l.char && l.name);
  letters.slice(0, PER_LANG_LETTERS).forEach((l, i) => add({ id: 'bl-' + id + '-' + i, kind: 'tip', badge: 'aaj',
    bands: bandsFor(8), unlock: null, topics: ['lang:' + id], g: 'c', key: 'letter:' + l.char, lang: id,
    src: 'letter:' + p.script + ':' + l.char, route: '#/chart/' + id, title: p.name.en + ' letter', text: l.char,
    roman: l.roman || l.r || '', body: 'Its name is “' + l.name + '”.', art: null, cta: 'See the whole chart',
    why: 'A letter from the ' + p.name.en + ' script' }));
  /* micro-play: what does this word mean? three meanings from the same pack, one right */
  const pool = words.filter(([w]) => w.en && w.en.length < 40);
  pool.slice(PER_LANG_WORDS, PER_LANG_WORDS + PER_LANG_PLAY).concat(pool.slice(0, Math.max(0, PER_LANG_PLAY - (pool.length - PER_LANG_WORDS))))
    .slice(0, PER_LANG_PLAY).forEach(([w, rung], i) => {
      const others = pool.map(x => x[0]).filter(x => x.word !== w.word && x.en !== w.en);
      const k = (i * 7 + 3) % Math.max(1, others.length);
      const opts = [w.en, others[k].en, others[(k + 5) % others.length].en];
      if (new Set(opts).size < 3) return;
      add({ id: 'pw-' + id + '-' + i, kind: 'play', badge: 'aaj', bands: bandsFor(4), unlock: rung ? { lang: id, rung } : null,
        topics: ['lang:' + id], g: 'c', key: 'word:' + w.word, lang: id, src: 'word:' + id + ':' + w.word,
        route: '#/wordcard/' + encodeURIComponent(id + ':' + w.word), title: 'What does it mean?', text: w.word, roman: w.roman,
        play: { q: 'What does this ' + p.name.en + ' word mean?', opts: opts, a: 0, after: w.word + ' (' + w.roman + ') means “' + w.en + '”.' },
        art: null, cta: 'Open the word card', why: 'A word to try in ' + p.name.en });
    });
});

/* ---------------------------------------------------------------- festivals and Aaj (group d) */
const FEST = C.IND_UTSAV.festivals.filter(f => !f.needs_review && f.kid);
FEST.forEach(f => {
  const topics = ['festival:' + f.id, 'faith:' + f.faith].concat((f.states || []).map(s => 'place:' + s));
  const base = { badge: f.badge || 'aaj', bands: bandsFor(4), unlock: null, topics, g: 'd', route: '#/festival/' + f.id,
    art: null, cta: 'Open ' + f.name };
  add(Object.assign({ id: 'fe-' + f.id, kind: 'festival', src: 'festival:' + f.id + ':kid', title: f.name + ' · ' + (f.months || []).join(', '),
    text: f.script, body: clip(f.kid), why: f.name + ' falls in ' + (f.months || [])[0] }, base));
  if ((f.do || [])[0]) add(Object.assign({ id: 'fd-' + f.id, kind: 'festival', src: 'festival:' + f.id + ':do:0',
    title: 'Something to do for ' + f.name, body: clip(f.do[0]), why: 'One thing to try at home' }, base));
});
/* micro-play: which state keeps this festival? only festivals kept in named states */
const ALLSTATES = Object.keys(C.IND_GEO.states).sort();
FEST.filter(f => (f.states || []).length).forEach((f, i) => {
  const right = f.states[0], others = ALLSTATES.filter(s => (f.states || []).indexOf(s) < 0);
  const opts = [right, others[(i * 5) % others.length], others[(i * 5 + 11) % others.length]].map(stateName);
  if (new Set(opts).size < 3) return;
  add({ id: 'pf-' + f.id, kind: 'play', badge: f.badge || 'aaj', bands: bandsFor(8), unlock: null,
    topics: ['festival:' + f.id, 'place:' + right], g: 'd', src: 'festival:' + f.id + ':states:0', route: '#/festival/' + f.id,
    title: 'Where is it kept?', play: { q: f.name + ' is kept in one of these. Which?', opts, a: 0,
      after: f.name + ' is kept in ' + (f.states || []).map(stateName).join(', ') + '.' },
    art: null, cta: 'Open ' + f.name, why: 'A festival question' });
});

/* ---------------------------------------------------------------- the map (group d) */
const STATE_ART = new Set(fs.readdirSync(path.join(APP, 'art', 'state')).map(f => f.replace(/\.jpg$/, '')));
Object.keys(C.IND_MAP.paths).sort().forEach((c, ci) => {
  const g = C.IND_GEO.states[c], s = C.IND_STATES[c] || {};
  if (!g) return;
  const base = { kind: 'place', badge: 'aaj', bands: bandsFor(4), unlock: null, topics: ['place:' + c], g: 'd',
    route: '#/state/' + c, art: STATE_ART.has(c) ? 'art/state/' + c + '.jpg' : null, cta: 'Open ' + g.name, why: 'From ' + g.name };
  if (g.fact) add(Object.assign({ id: 'pl-' + c, src: 'geo:' + c + ':fact', title: g.name, body: clip(g.fact) }, base));
  (s.trivia || []).slice(0, 2).forEach((t, i) => add(Object.assign({ id: 'pt-' + c + '-' + i, src: 'state:' + c + ':trivia:' + i,
    title: g.name, body: clip(t) }, base, { art: null })));
  (s.places || []).slice(0, 1).forEach((p, i) => add(Object.assign({ id: 'pp-' + c + '-' + i, src: 'state:' + c + ':places:' + i + ':what',
    title: p.name + ', ' + g.name, body: clip(p.what) }, base, { art: null })));
  /* micro-play: whose capital is this? */
  if (g.capital) {
    const others = ALLSTATES.filter(x => x !== c && C.IND_GEO.states[x].capital !== g.capital);
    const opts = [g.name, stateName(others[(ci * 7) % others.length]), stateName(others[(ci * 7 + 13) % others.length])];
    if (new Set(opts).size === 3) add({ id: 'pc-' + c, kind: 'play', badge: 'aaj', bands: bandsFor(8), unlock: null,
      topics: ['place:' + c], g: 'd', src: 'geo:' + c + ':capital', route: '#/state/' + c, title: 'Which state?',
      play: { q: g.capital + ' is the capital of which ' + (g.type === 'ut' ? 'place' : 'state') + '?', opts, a: 0,
        after: g.capital + ' is the capital of ' + g.name + '.' }, art: null, cta: 'Open ' + g.name, why: 'A map question' });
  }
});

/* ---------------------------------------------------------------- games (group d) */
C.IND_GAMES.forEach(gm => {
  const how = (C.GAME_FRAME[gm.id] || [])[0];
  if (!how) return;
  add({ id: 'gm-' + gm.id, kind: 'game', badge: 'aaj', bands: bandsFor(4), unlock: null, topics: ['game:' + gm.id], g: 'd',
    src: 'game:' + gm.id, route: '#/game/' + gm.id, title: gm.name, body: how,
    art: (C.IND_GAME_PLATES || []).indexOf(gm.id) >= 0 ? 'art/games/' + gm.id + '.webp' : null,
    cta: 'Play', why: C.TEACHES.indexOf(gm.id) >= 0 ? 'A game that teaches' : 'A game for fun — it pays no coins' });
});
C.IND_GULLY.games.filter(gm => !gm.needs_review && gm.kid).forEach(gm => {
  add({ id: 'gu-' + gm.id, kind: 'game', badge: C.IND_GULLY.badge || 'aaj', bands: bandsFor(parseInt(gm.age, 10) || 4), unlock: null,
    topics: ['gully:' + gm.id], g: 'd', src: 'gully:' + gm.id + ':kid', route: '#/gullygame/' + gm.id, title: gm.name + ' · ' + gm.where,
    text: gm.script, body: clip(gm.kid), art: null, cta: 'How to play', why: 'A game for the street or the courtyard' });
});

/* ---------------------------------------------------------------- the owner's number */
/* The owner asked for 1,000. The corpus holds more than that honestly (1,228 before this), so the
   surplus is let go in a declared order — a state's second trivia line, the stories' second
   moments, a language's eleventh and tenth words, then era figures, last built first — rather
   than by thinning every kind a little. Lower TARGET's trim and they come back. */
const TARGET = 1000, TRIM = [/^pt-.*-1$/, /^sm-/, /^bw-.*-11$/, /^bw-.*-10$/, /^it-.*-f\d+$/];
for (const re of TRIM) for (let i = items.length - 1; i >= 0 && items.length > TARGET; i--) if (re.test(items[i].id)) items.splice(i, 1);

/* ---------------------------------------------------------------- write */
const seenId = {};
items.forEach(it => { if (seenId[it.id]) throw new Error('two feed items share the id ' + it.id); seenId[it.id] = 1; });
const byKind = {}; items.forEach(it => { byKind[it.kind] = (byKind[it.kind] || 0) + 1; });
const INDEX_KEYS = ['id', 'kind', 'badge', 'bands', 'unlock', 'topics', 'g', 'key'];
const idx = items.map(it => INDEX_KEYS.map(k => it[k] === undefined ? null : it[k]));
const head = '/* GENERATED by tools/build-feed.js from the corpus — never edit by hand (docs/30-feed.md). */\n';
fs.writeFileSync(path.join(APP, 'data-feed-index.js'), head + 'window.IND_FEED_INDEX = ' +
  JSON.stringify({ keys: INDEX_KEYS, rows: idx }) + ';\n');
['a', 'b', 'c', 'd'].forEach(g => {
  const body = {};
  items.filter(it => it.g === g).forEach(it => { const o = Object.assign({}, it); INDEX_KEYS.forEach(k => { if (k !== 'id') delete o[k]; }); body[it.id] = o; });
  fs.writeFileSync(path.join(APP, 'data-feed-' + g + '.js'), head + 'window.IND_FEED_BODY = window.IND_FEED_BODY || {};\n' +
    'Object.assign(window.IND_FEED_BODY, ' + JSON.stringify(body) + ');\n');
});
fs.writeFileSync(path.join(__dirname, 'lib', 'feed-manifest.json'), JSON.stringify({ total: items.length, byKind,
  groups: ['a', 'b', 'c', 'd'].map(g => [g, items.filter(it => it.g === g).length]) }, null, 1) + '\n');
console.log('feed: ' + items.length + ' items — ' + Object.keys(byKind).map(k => k + ' ' + byKind[k]).join(' · '));
