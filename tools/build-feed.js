#!/usr/bin/env node
/* Bizzing India — builds My Feed from the corpus (docs/30-feed.md; FAMILY-STANDARD §6a).

   NOTHING IN THE FEED IS TYPED. Every card is cut from an object the app already holds and
   already shows somewhere, and carries `src`, the address of the words it quotes, which
   tools/check-feed.js resolves again on every run. Where the corpus runs out, the feed stops:
   the counts are printed and written to tools/lib/feed-manifest.json, never padded.

   ANGLES (owner, 2 Oct 2026: "do more if possible"). One object gives several cards, each a
   different thing it already holds, each its own `kind` and its own `src`:
     a story      its opening · its hook · the moment its middle turns on · the moral it states ·
                  a question on a word it teaches (words_hi) · a question on the place it lights
     a cast       a character's own line (avatar-cards: invented characters' lore, real people's
                  first achievement; never a deity) · an epic figure's line (data-epic-cast)
     an epic      each night's opening · its hook · its middle · the thing it asks you to wonder
                  about · a question on a word it teaches
     an era       its hook · what a child is told · what a bigger child is told · what nobody
                  knows yet · each thing found · each dated moment · each "still there today" ·
                  each figure — only eras with sources[], not held, not gated 11+
     a language   every rung's words, letters and vowel signs, the Hindi sentences and the
                  conversation lines, the conjuncts, and a question on each first word
     a verse      the verse in its own script · its meaning · why carry it — every one not flagged
     a place      its map fact · every trivia line · every place to see · every food · every
                  feature on the map · a capital question · a food question
     a festival   what it is · every thing to do at home · every "in many families" line ·
                  where it is kept (a question)
     and          the Mela games, the street games (what it is, how it starts, its other names),
                  the questions for Nani, the family words, the values

   HELD BACK, and why:
     - anything needs_review (stories, festivals, the colonial, freedom and recent eras, the
       Neeti deck) and anything gated 11+, which is where the sensitive history lives;
     - verses flagged unsure or needs_original; a state's `myth` and `people` fields (kept on
       the state page, where they are framed); the Dharma pillar and the songs, which are
       awaiting reviewers; sacred figures as cast cards; the Gita course (needsReview).

   LEVELS are the Gurukul ranks the child sees on Home as "Your level" (app.js RANKS, RANK_AT:
   Shishya 0 … Rishi 7), which move only on things mastered. A card's level says where on that
   ladder it belongs:
     - behind a language rung r: the lowest rank a child who has reached rung r must already
       hold (r rungs mastered → the rank RANK_AT gives r). So a card a child has unlocked is
       never above their rank, and never hidden from them.
     - a story, an epic night or an era a COURSE part uses: that part's place in its course,
       dealt across the eight ranks (part 1 of 10 → Shishya, part 10 → Rishi);
     - any other story, night or era: its place on its own path — the library's order, the
       epic's nights in order, the eras in time — dealt across the eight ranks the same way,
       and the earlier of the two wins.
     - festivals, places, the map's features, games, verses, Nani's questions, the family
       words and the values have NO level: they are for anyone, at any rank.

   Output: app/data-feed-index.js (what the ranking needs, no words) and one body group per
   level chunk and agnostic chunk, app/data-feed-<group>.js, each a lazy group fetched only when
   one of its cards is on today's feed; the <template>s for them in index.html are rewritten
   between the feed markers.

   Run: node tools/build-feed.js            (then npm test) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const { load, APP } = require('./lib/corpus');
const { nearPairs } = require('./lib/feed-near');
const { fill } = require('./lib/feed-facts');
const C = load();

/* the ladder, read from app.js, never retyped */
const APPJS = fs.readFileSync(path.join(APP, 'app.js'), 'utf8');
const RANKS = vm.runInNewContext(APPJS.match(/var RANKS = (\[[^\]]*\])/)[1]);
const RANK_AT = vm.runInNewContext(APPJS.match(/var RANK_AT = (\[[^\]]*\])/)[1]);
const NL = RANKS.length;
const levelOf = m => { for (let i = RANK_AT.length - 1; i > 0; i--) if (m >= RANK_AT[i]) return i; return 0; };
const deal = (i, n) => Math.min(NL - 1, Math.floor(i * NL / Math.max(1, n)));

const BANDS = [['4-7', 7], ['8-9', 9], ['10-12', 12]];
const bandsFor = gate => BANDS.filter(b => (gate || 4) <= b[1]).map(b => b[0]);
const items = [];
/* a question never shows its answer — not in its words, its title, its script or the reason it gives.
   A question whose answer is a place carries no place topic, so the reason the ranking gives it
   ("You lit Kerala on the map") can never say the answer either (check-feed \`noleak\`). */
const leaks = it => it.play && !/^geo:.*:capital$/.test(it.src) &&
  [it.play.q, it.title, it.text, it.roman, it.why].join(' ').toLowerCase().indexOf(String(it.play.opts[it.play.a]).toLowerCase()) >= 0;
/* MORE OF THE THING, AND THE DOOR TO THAT THING (owner, 3 Oct 2026).
   fx    facts — [label, template, [corpus paths]] — read by tools/lib/feed-facts.js, never typed;
         one with anything missing is simply not written.
   route the screen of THAT thing: the verse inside its collection, the letter inside the chart,
         the sentence on its rung, the dish on its state's page — never the tool's front door.
   land  what that screen must show first (check-feed \`lands\` opens every route and looks). */
const add = it => {
  if ((it.body !== undefined && !String(it.body).trim()) || leaks(it)) return null;
  if (it.fx) {
    const out = [], proof = [];
    it.fx.forEach(spec => { const f = fill(C, spec); if (f) { out.push(f); proof.push(spec); } });
    if (out.length) it.facts = out;
    it._fx = proof; delete it.fx;
  }
  items.push(it); return it;
};
const first = (t, n) => String(t || '').replace(/\s+/g, ' ').trim().slice(0, n || 40);
/* a quotation is cut at a sentence end, never rewritten — so it is always a substring */
function clip(text, max) {
  text = String(text || '').trim(); max = max || 400;
  if (text.length <= max) return text;
  const parts = text.match(/[^.!?]+[.!?]+["”’)]*\s*/g) || [text];
  let out = '';
  for (const p of parts) { if ((out + p).trim().length > max) break; out += p; }
  return (out || parts[0]).trim();
}
const stateName = c => (C.IND_GEO.states[c] || {}).name || c;
const ALLSTATES = Object.keys(C.IND_GEO.states).sort();
/* a question's two wrong options, drawn from the same kind of thing by a fixed stride, never luck */
function wrongs(right, pool, seed) {
  const others = pool.filter(x => x !== right);
  if (others.length < 2) return null;
  const a = others[(seed * 7 + 3) % others.length], b = others[(seed * 7 + 3 + Math.max(1, Math.floor(others.length / 3))) % others.length];
  return a === b ? null : [a, b];
}

/* ---------------------------------------------------------------- where the courses put things */
const COURSE_LV = {};
const pull = (k, lv) => { if (COURSE_LV[k] == null || lv < COURSE_LV[k]) COURSE_LV[k] = lv; };
C.IND_PAATH.courses.filter(c => !(c.id === 'gita-course' || c.id === 'gita-year')).forEach(c => {   /* the Gita courses are not levels of the feed */
  const M = c.modules.length;
  c.modules.forEach((m, mi) => {
    if (m.needsReview) return;
    const lv = deal(mi, M);
    (m.lessons || []).forEach(l => {
      const u = l.use || {};
      (u.st || []).forEach(id => pull('story:' + id, lv));
      (u.ra || []).forEach(n => pull('epic:ramayana:' + n, lv));
      (u.mb || []).forEach(n => pull('epic:mahabharata:' + n, lv));
      (u.it || []).forEach(id => pull('era:' + id, lv));
    });
  });
});
const levelAt = (key, i, n) => Math.min(deal(i, n), COURSE_LV[key] == null ? NL : COURSE_LV[key]);

/* ---------------------------------------------------------------- stories */
const COLL = {}, COLL_KEY = {};
Object.keys(C).filter(k => /^IND_COLLECTIONS/.test(k)).forEach(k => (C[k] || []).forEach(x => { COLL[x.id] = x.name; if (!COLL_KEY[x.id]) COLL_KEY[x.id] = k; }));
const STORY_ART = new Set(fs.readdirSync(path.join(APP, 'art', 'story')).map(f => f.replace(/\.jpg$/, '')));
const okStories = C.stories.filter(s => !s.needs_review && s.source && s.scenes && s.scenes.length);
const WORD_SEEN = {};          /* one question per Hindi word, at the first story or night that teaches it */
const ALL_EN = [...new Set([].concat(...okStories.map(s => (s.words_hi || []).map(w => w[2])),
  ...[C.IND_EPIC_RAMAYANA, C.IND_EPIC_MAHABHARATA].map(E => [].concat(...E.episodes.map(e => (e.words_hi || []).map(w => w[2]))))))].filter(Boolean).sort();
const CAST_SEEN = {};
function wordQ(base, src, w, k, title) {
  const [hi, roman, en] = w;
  if (!hi || !en || WORD_SEEN[hi]) return;
  const wr = wrongs(en, ALL_EN.filter(x => x.toLowerCase() !== String(roman).toLowerCase()), k + hi.length);
  if (!wr || en.toLowerCase() === String(roman).toLowerCase()) return;
  if (add(Object.assign({}, base, { kind: 'storyword', badge: 'aaj', src, title: 'A Hindi word from ' + title, text: hi, roman, lang: 'hi',
    play: { q: 'What does it mean?', opts: [en, wr[0], wr[1]], a: 0, after: hi + ' (' + roman + ') means “' + en + '”.' },
    cta: base.cta, why: 'A word from ' + title }))) WORD_SEEN[hi] = 1;
}
function castCard(base, id, why) {
  if (CAST_SEEN[id]) return; CAST_SEEN[id] = 1;
  const E = C.IND_EPIC_CAST[id];
  if (E && E.desc) return add(Object.assign({}, base, { kind: 'cast', badge: 'katha', src: 'cast:' + id + ':desc', title: E.name, body: E.desc,
    route: '#/avcard/' + id, cta: 'Open their card', why, land: E.name }));
  const c = C.IND_AV_CARD(id);
  if (!c || c.sacred || c.kind === 'sacred') return;
  if (c.kind === 'character' && c.lore) return add(Object.assign({}, base, { kind: 'cast', badge: 'katha', src: 'avatar:' + id + ':lore', title: c.name,
    body: c.lore, route: '#/avcard/' + id, cta: 'Open their card', why, land: c.name }));
  if (c.kind === 'real' && (c.achievements || [])[0] && base.badge !== 'katha') return add(Object.assign({}, base, { kind: 'person', src: 'avatar:' + id + ':achievements:0',
    title: c.name, body: c.achievements[0], route: '#/avcard/' + id, cta: 'Open their card', why, land: c.name }));
}
const storySm = id => { const k = id.replace(/\./g, '-'); return fs.existsSync(path.join(APP, 'art', 'story', 'sm', k + '.jpg')) ? 'art/story/sm/' + k + '.jpg' : null; };
okStories.forEach((s, si) => {
  const places = (s.place || []).map(p => String(p).replace('IN-', ''));
  const art = STORY_ART.has(s.id.replace(/\./g, '-')) ? 'art/story/' + s.id.replace(/\./g, '-') + '.jpg' : null;
  const topics = ['story:' + s.id, 'coll:' + s.collection].concat(places.map(p => 'place:' + p));
  const sp = 'stories/[id=' + s.id + ']/';
  const base = { badge: s.badge, bands: bandsFor(4), level: levelAt('story:' + s.id, si, okStories.length), topics, story: s.id,
    /* the story's own painting, at the small size Home's plates use (480px, ~27 KB): v4 found
       5% of cards with a picture and 1,680 story cards with none, though 688 are painted */
    route: '#/story/' + s.id, art: storySm(s.id), cta: 'Read the story', land: s.title,
    fx: [['From', '{0}', [COLL_KEY[s.collection] + '/[id=' + s.collection + ']/name']], ['Lights up', '{0}', [sp + 'place|names']],
         ['Read', '{0} min', [sp + 'minutes']], ['Told from', '{0}', [sp + 'source']]] };
  const from = 'From ' + (COLL[s.collection] || 'the story shelves');
  add(Object.assign({}, base, { id: 'st-' + s.id, kind: 'story', news: 1, src: 'story:' + s.id + ':scenes:0:text', title: s.title, body: clip(s.scenes[0].text), art, why: from }));
  if (s.hook) add(Object.assign({}, base, { id: 'sh-' + s.id, kind: 'hook', news: 1, src: 'story:' + s.id + ':hook', title: s.title, body: s.hook, why: from }));
  if (s.scenes.length >= 5) {
    const i = Math.floor(s.scenes.length / 2);
    add(Object.assign({}, base, { id: 'sm-' + s.id, kind: 'moment', src: 'story:' + s.id + ':scenes:' + i + ':text', title: s.title + ' — the middle',
      body: clip(s.scenes[i].text), why: 'A moment from ' + s.title, route: '#/story/' + s.id + '|s' + i, cta: 'Read from this moment',
      land: first(String(s.scenes[i].text).replace(/\*/g, '')) }));
  }
  if (s.moral) add(Object.assign({}, base, { id: 'sl-' + s.id, kind: 'moral', src: 'story:' + s.id + ':moral', title: 'What ' + s.title + ' says',
    body: clip(s.moral), why: 'The story’s own lesson' }));
  (s.words_hi || []).forEach((w, k) => wordQ(Object.assign({ id: 'sw-' + s.id + '-' + k }, base), 'story:' + s.id + ':words_hi:' + k, w, k + si, s.title));
  if (places[0] && C.IND_GEO.states[places[0]]) {
    const wr = wrongs(places[0], ALLSTATES.filter(x => places.indexOf(x) < 0), si);
    if (wr) add(Object.assign({}, base, { id: 'sp-' + s.id, kind: 'storyplace', topics: topics.filter(t => !/^place:/.test(t)), src: 'story:' + s.id + ':place:0', title: s.title,
      play: { q: 'Which place on the map does this story light up?', opts: [places[0], wr[0], wr[1]].map(stateName), a: 0,
        after: 'It lights up ' + stateName(places[0]) + '.' }, why: 'A map question' }));
  }
  (s.cast || []).forEach(id => castCard(Object.assign({ id: 'sc-' + id }, base), id, 'Someone from ' + s.title));
});

/* ---------------------------------------------------------------- the epics, night by night */
[C.IND_EPIC_RAMAYANA, C.IND_EPIC_MAHABHARATA].forEach(E => {
  E.episodes.forEach((ep, ei) => {
    if (!ep.cards || !ep.cards[0] || ep.needs_review) return;
    const gate = Math.max(E.age_gate || 4, ep.gate || 0);
    if (gate >= 11) return;
    const EK = Object.keys(C).filter(k => C[k] === E)[0], ep0 = EK + '/episodes/[n=' + ep.n + ']/';
    const base = { badge: E.badge || 'katha', bands: bandsFor(gate), level: levelAt('epic:' + E.id + ':' + ep.n, ei, E.episodes.length),
      topics: ['epic:' + E.id], route: '#/epic/' + E.id + '|' + ep.n, act: { a: 'episode', id: E.id, n: ep.n },
      art: fs.existsSync(path.join(APP, 'art', 'epic', 'sm', E.id + '-' + ep.n + '-0.jpg')) ? 'art/epic/sm/' + E.id + '-' + ep.n + '-0.jpg' : null, cta: 'Hear this night',
      land: ep.title, fx: [['Epic', '{0}', [EK + '/title']], ['Night', '{0} of {1}', [ep0 + 'n', EK + '/episodes|len']], ['Hear it', '{0} min', [ep0 + 'minutes']]] };
    const t = E.title + ' · ' + ep.title, why = E.title + ', night ' + ep.n, at = 'epic:' + E.id + ':episodes:' + ei + ':';
    add(Object.assign({}, base, { id: 'ep-' + E.id + '-' + ep.n, kind: 'night', src: at + 'cards:0:text', title: t, body: clip(ep.cards[0].text), why }));
    if (ep.hook) add(Object.assign({}, base, { id: 'eh-' + E.id + '-' + ep.n, kind: 'nighthook', src: at + 'hook', title: t, body: ep.hook, why }));
    if (ep.cards.length >= 4) {
      const i = Math.floor(ep.cards.length / 2);
      add(Object.assign({}, base, { id: 'em-' + E.id + '-' + ep.n, kind: 'nightmoment', src: at + 'cards:' + i + ':text', title: t + ' — the middle',
        body: clip(ep.cards[i].text), why }));
    }
    if (ep.wonder) add(Object.assign({}, base, { id: 'ew-' + E.id + '-' + ep.n, kind: 'wonder', src: at + 'wonder', title: 'Something to wonder about',
      body: ep.wonder, why }));
    (ep.words_hi || []).forEach((w, k) => wordQ(Object.assign({ id: 'ewd-' + E.id + '-' + ep.n + '-' + k }, base), at + 'words_hi:' + k, w, k + ei, ep.title));
    (ep.cast || []).forEach(id => castCard(Object.assign({ id: 'ec-' + id }, base), id, 'Someone from ' + E.title));
  });
});

/* ---------------------------------------------------------------- verses (no level) */
const VLANG = { kural: 'ta', dhammapada: 'pi', subhashita: 'sa', gita: 'sa' };
/* THE BADGE (the owner left it open): a verse object carries none, and India's own verse screens
   show none — they frame a verse as something families still carry ("Verses worth carrying").
   That is 🧭 Aaj: how it lives today. A quotation with its source is never a 🪔 Katha. */
const VERSE_BADGE = 'aaj';
C.IND_SHLOK.verses.filter(v => v.source && v.text_original && !v.unsure && !v.needs_original).forEach(v => {
  const coll = C.IND_SHLOK.collections.filter(x => x.id === v.collection)[0] || {};
  const cp = 'IND_SHLOK/collections/[id=' + v.collection + ']/', vp = 'IND_SHLOK/verses/[id=' + v.id + ']/';
  const base = { badge: v.badge || VERSE_BADGE, bands: bandsFor(v.gate), level: null, topics: ['verse:' + v.collection].concat(v.collection === 'kural' ? ['lang:ta'] : []),
    route: '#/verses/' + v.collection + '|' + v.id, source: v.source, art: null, cta: 'Open this verse', why: 'A verse from ' + (coll.name || 'the verses'),
    land: first(v.text_original, 14), fx: [['From', '{0}', [cp + 'name']], ['Verse', '{0}', [vp + 'n']], ['Language', '{0}', [cp + 'language']]] };
  add(Object.assign({}, base, { id: 'vs-' + v.id, kind: 'verse', src: 'verse:' + v.id + ':text_original', title: coll.name || v.collection,
    text: v.text_original, lang: VLANG[v.collection], roman: v.translit, fx: base.fx.concat([['It means', '{0}', [vp + 'meaning_kid']]]) }));
  add(Object.assign({}, base, { id: 'vm-' + v.id, kind: 'versemeaning', src: 'verse:' + v.id + ':meaning_kid', title: 'What it means · ' + (coll.name || ''),
    body: v.meaning_kid }));
  if (v.why) add(Object.assign({}, base, { id: 'vy-' + v.id, kind: 'versewhy', src: 'verse:' + v.id + ':why', title: 'Why carry it', body: clip(v.why) }));
});

/* ---------------------------------------------------------------- Itihaas */
const ERAS = C.IND_ITIHAAS.eras.filter(e => !e.needs_review && (e.gate || 4) < 11 && (e.sources || []).length);
ERAS.forEach((e, ei) => {
  const ep = 'IND_ITIHAAS/eras/[id=' + e.id + ']/';
  const base = { badge: 'itihaas', bands: bandsFor(e.gate), level: levelAt('era:' + e.id, ei, ERAS.length), route: '#/era/' + e.id,
    cta: 'Sail to ' + e.title, art: null, sources: e.sources, why: e.title + ', ' + e.when, land: e.title,
    fx: [['When', '{0}', [ep + 'when']], ['Where', '{0}', [ep + 'place|names']]] };
  const topics = ['era:' + e.id].concat(e.place ? ['place:' + e.place] : []), at = 'era:' + e.id + ':';
  if (e.hook) add(Object.assign({}, base, { id: 'ih-' + e.id, kind: 'era', topics, src: at + 'hook', title: e.title + ' · ' + e.when, body: e.hook }));
  if (e.kid) add(Object.assign({}, base, { id: 'ik-' + e.id, kind: 'erakid', topics, src: at + 'kid', title: e.title, body: clip(e.kid) }));
  if (e.big) add(Object.assign({}, base, { id: 'ib-' + e.id, kind: 'erabig', topics, bands: bandsFor(Math.max(8, e.gate || 4)), src: at + 'big', title: e.title + ' — more', body: clip(e.big) }));
  if (e.wonder) add(Object.assign({}, base, { id: 'iw-' + e.id, kind: 'erawonder', topics, src: at + 'wonder', title: 'Nobody knows yet', body: clip(e.wonder) }));
  (e.objects || []).forEach((o, i) => add(Object.assign({}, base, { id: 'io-' + e.id + '-' + i, kind: 'found', topics, src: at + 'objects:' + i,
    title: 'Found from ' + e.title, body: o, route: '#/era/' + e.id + '|objects:' + i, cta: 'See it in ' + e.title, land: first(o) })));
  (e.moments || []).forEach((m, i) => add(Object.assign({}, base, { id: 'it-' + e.id + '-m' + i, kind: 'moment-era', topics,
    src: at + 'moments:' + i + ':what', title: m.when, body: clip(m.what), route: '#/era/' + e.id + '|moments:' + i, land: m.when })));
  /* what is still there today is a place, not a claim about the era's evidence: it carries its
     own state, and not the era's sources list */
  (e.today || []).forEach((t, i) => add(Object.assign({}, base, { id: 'it-' + e.id + '-t' + i, kind: 'today', sources: undefined, badge: 'aaj',
    topics: ['era:' + e.id].concat(t.state ? ['place:' + t.state] : []), src: at + 'today:' + i + ':what',
    title: 'Still there today · ' + t.where, body: clip(t.what), route: '#/era/' + e.id + '|today:' + i, land: t.where,
    fx: [['Where', '{0}', [ep + 'today/' + i + '/where']], ['In', '{0}', [ep + 'today/' + i + '/state|names']], ['From', '{0}', [ep + 'title']]] })));
  (e.figures || []).forEach((f, i) => f.line && add(Object.assign({}, base, { id: 'it-' + e.id + '-f' + i, kind: 'figure', topics,
    src: at + 'figures:' + i + ':line', title: f.name, body: clip(f.line), route: '#/era/' + e.id + '|figures:' + i, land: f.name })));
});

/* ---------------------------------------------------------------- Bhasha: every rung */
Object.keys(C.IND_PACKS).forEach(id => {
  const p = C.IND_PACKS[id], sc = C.IND_SCRIPTS[p.script], lex = {}, met = {};
  (p.lexicon || []).forEach(w => { lex[w.word] = w; });
  const L = p.name.en, pp = 'IND_PACKS/' + id + '/', base = { badge: 'aaj', bands: bandsFor(4), topics: ['lang:' + id], lang: id, art: null };
  /* the rung by its name and what it is for: the path counts rungs from 1 and the data from 0,
     and a fact may only read, never add one */
  const rungFx = st => [['Language', '{0}', [pp + 'name/en']], ['On the path', '{0} — {1}', [pp + 'stages/[id=' + st.id + ']/name', pp + 'stages/[id=' + st.id + ']/en']]];
  const rungOf = st => (p.stages || []).indexOf(st);
  const at = (st, extra) => Object.assign({}, base, { level: levelOf(rungOf(st)), unlock: rungOf(st) ? { lang: id, rung: rungOf(st) } : null }, extra);
  const words = [];
  (p.stages || []).forEach(st => {
    const r = rungOf(st);
    (st.items || []).forEach((x, k) => {
      if (typeof x === 'string' && lex[x] && lex[x].en && !met['w:' + x]) {
        met['w:' + x] = 1; const w = lex[x];
        words.push([w, st]);
        /* A WORD IN ITS SENTENCE, not a gloss (v4 audit: 36% of the feed was "Hindi word ·
           कोहरा · kohra · fog"). Where the app holds the word's own example sentence it rides on
           the card as a fact read from that bank; a language with no sentences yet keeps only its
           first forty words on the feed, so the bare glosses fall to about one card in twenty
           without the feed turning Hindi-only (docs/05: never imply Hindi = Indian). */
        const sent = ((C.IND_BHASHA_SENTENCES || {})[id] || {})[w.word];
        if (!sent && words.length > 40) return;
        add(at(st, { id: 'bw-' + id + '-' + words.length, kind: 'word', key: id + '|word:' + w.word, src: 'word:' + id + ':' + w.word,
          route: '#/wordcard/' + encodeURIComponent(id + ':' + w.word), title: L + ' word', text: w.word, roman: w.roman, body: w.en,
          cta: 'Open the word card', why: 'A word from the ' + L + ' path, ' + st.name, land: w.word,
          fx: (sent ? [['In a sentence', '{0} — {1}', ['IND_BHASHA_SENTENCES/' + id + '/' + w.word + '/s', 'IND_BHASHA_SENTENCES/' + id + '/' + w.word + '/en']]] : [])
            .concat(rungFx(st)).concat([['Theme', '{0}', [pp + 'lexicon/[word=' + w.word + ']/theme']]]) }));
        return;
      }
      if (st.id === 's1' && typeof x === 'string' && sc && !met['l:' + x]) {
        const l = (sc.vowels || []).concat(sc.consonants || []).filter(y => y.char === x)[0];
        if (!l || !l.name) return; met['l:' + x] = 1;
        add(at(st, { id: 'bl-' + id + '-' + k, kind: 'letter', bands: bandsFor(4), key: id + '|letter:' + l.char, src: 'letter:' + p.script + ':' + l.char,
          route: '#/chart/' + id + '|' + l.char, title: L + ' letter', text: l.char, roman: l.roman || l.r || '', body: 'Its name is “' + l.name + '”.',
          cta: 'Open this letter', why: 'A letter from the ' + L + ' script', land: l.char,
          fx: [['Script', '{0}', ['IND_SCRIPTS/' + p.script + '/name']], ['Language', '{0}', [pp + 'name/en']]] }));
        return;
      }
      if (st.id === 's2' && typeof x === 'string' && sc && !met['m:' + x]) {
        const m = (sc.matras || []).filter(y => y.sign === x)[0];
        if (!m || !m.name || !m.example) return; met['m:' + x] = 1;
        add(at(st, { id: 'bm-' + id + '-' + k, kind: 'matra', bands: bandsFor(6), src: 'matra:' + p.script + ':' + m.sign, route: '#/chart/' + id + '|' + m.sign,
          title: L + ' vowel sign', text: m.example, roman: m.name, body: 'The sign for “' + m.name + '”, as in ' + m.example + '.',
          cta: 'Open this sign', why: 'A vowel sign from the ' + L + ' script', land: m.example,
          fx: [['Script', '{0}', ['IND_SCRIPTS/' + p.script + '/name']], ['Language', '{0}', [pp + 'name/en']]] }));
        return;
      }
      if (x && typeof x === 'object' && x.hi && x.en && (st.id === 's4' || st.id === 's5')) {
        add(at(st, { id: 'bs-' + id + '-' + x.id, kind: st.id === 's4' ? 'sentence' : 'talk', bands: bandsFor(6), src: 'stage:' + id + ':' + st.id + ':' + x.id,
          route: '#/pack/' + id + '|' + st.id + ':' + x.id, title: st.id === 's4' ? L + ' sentence' : L + ' conversation', text: x.hi, roman: x.roman, body: x.en,
          cta: 'Open it on the path', why: (st.id === 's4' ? 'A sentence' : 'A line to say') + ' from the ' + L + ' path', land: x.hi, fx: rungFx(st) }));
        return;
      }
      if (x && typeof x === 'object' && x.kind === 'conjunct' && x.hi && x.parts && x.word) {
        add(at(st, { id: 'bc-' + id + '-' + x.id, kind: 'conjunct', bands: bandsFor(8), src: 'stage:' + id + ':' + st.id + ':' + x.id,
          route: '#/pack/' + id + '|' + st.id + ':' + x.id,
          title: L + ' joined letters', text: x.hi, roman: x.roman, body: x.parts.join(' + ') + ' = ' + x.hi + ', as in ' + x.word + '.',
          cta: 'Open it on the path', why: 'Joined letters from the ' + L + ' path', land: x.hi, fx: rungFx(st) }));
      }
    });
  });
  /* a question on each word met on the first rung, three meanings from the same pack */
  const pool = [...new Set(words.map(([w]) => w.en).filter(en => en.length < 40))];
  words.forEach(([w, st], i) => {
    if (rungOf(st) !== 0 || w.en.length >= 40) return;
    const wr = wrongs(w.en, pool.filter(en => en.toLowerCase() !== String(w.roman).toLowerCase()), i);
    if (!wr || w.en.toLowerCase() === String(w.roman).toLowerCase()) return;
    add(at(st, { id: 'pw-' + id + '-' + i, kind: 'wordq', key: id + '|word:' + w.word, src: 'word:' + id + ':' + w.word,
      route: '#/wordcard/' + encodeURIComponent(id + ':' + w.word), title: 'What does it mean?', text: w.word, roman: w.roman,
      play: { q: 'What does this ' + L + ' word mean?', opts: [w.en, wr[0], wr[1]], a: 0, after: w.word + ' (' + w.roman + ') means “' + w.en + '”.' },
      cta: 'Open the word card', why: 'A word to try in ' + L, land: w.word, fx: rungFx(st) }));
  });
});

/* ---------------------------------------------------------------- festivals (no level) */
const FEST = C.IND_UTSAV.festivals.filter(f => !f.needs_review && f.kid);
FEST.forEach((f, fi) => {
  const topics = ['festival:' + f.id, 'faith:' + f.faith].concat((f.states || []).map(s => 'place:' + s));
  const fp = 'IND_UTSAV/festivals/[id=' + f.id + ']/';
  const base = { badge: f.badge || 'aaj', bands: bandsFor(4), level: null, topics, route: '#/festival/' + f.id, art: null, cta: 'Open ' + f.name,
    land: f.name, fx: [['When', '{0}', [fp + 'months']], ['Kept in', '{0}', [fp + 'states|names']], ['Said', '{0}', [fp + 'roman']]] };
  add(Object.assign({}, base, { id: 'fe-' + f.id, kind: 'festival', src: 'festival:' + f.id + ':kid', title: f.name + ' · ' + (f.months || []).join(', '),
    text: f.script, body: clip(f.kid), why: f.name + ' falls in ' + (f.months || [])[0] }));
  (f.do || []).forEach((d, i) => add(Object.assign({}, base, { id: 'fd-' + f.id + '-' + i, kind: 'festdo', src: 'festival:' + f.id + ':do:' + i,
    title: 'Something to do for ' + f.name, body: clip(d), why: 'One thing to try at home', route: '#/festival/' + f.id + '|do:' + i, land: first(d) })));
  (f.variations || []).forEach((d, i) => add(Object.assign({}, base, { id: 'fv-' + f.id + '-' + i, kind: 'festways', bands: bandsFor(6),
    src: 'festival:' + f.id + ':variations:' + i, title: f.name + ', in many families', body: clip(d), why: 'Every family keeps it its own way',
    route: '#/festival/' + f.id + '|variations:' + i, land: first(d) })));
  if ((f.states || []).length) {
    const wr = wrongs(f.states[0], ALLSTATES.filter(s => f.states.indexOf(s) < 0), fi);
    if (wr) add(Object.assign({}, base, { id: 'pf-' + f.id, kind: 'festwhere', bands: bandsFor(8), topics: ['festival:' + f.id], fx: [['When', '{0}', [fp + 'months']]],
      src: 'festival:' + f.id + ':states:0', title: 'Where is it kept?',
      play: { q: f.name + ' is kept in one of these. Which?', opts: [f.states[0], wr[0], wr[1]].map(stateName), a: 0,
        after: f.name + ' is kept in ' + f.states.map(stateName).join(', ') + '.' }, why: 'A festival question' }));
  }
});

/* ---------------------------------------------------------------- the map (no level) */
const STATE_ART = new Set(fs.readdirSync(path.join(APP, 'art', 'state')).map(f => f.replace(/\.jpg$/, '')));
const DISH_STATES = {};
Object.keys(C.IND_STATES).forEach(c => (C.IND_STATES[c].food || []).forEach(d => { (DISH_STATES[d.dish] = DISH_STATES[d.dish] || []).push(c); }));
Object.keys(C.IND_MAP.paths).sort().forEach((c, ci) => {
  const g = C.IND_GEO.states[c], s = C.IND_STATES[c] || {};
  if (!g) return;
  const stp = 'IND_STATES/' + c + '/';
  const base = { badge: 'aaj', bands: bandsFor(4), level: null, topics: ['place:' + c], route: '#/state/' + c, art: null, cta: 'Open ' + g.name, why: 'From ' + g.name,
    land: g.name, fx: [['Languages', '{0}', [stp + 'languages']], ['Formed', '{0}', [stp + 'formed']]] };
  if (g.fact) add(Object.assign({}, base, { id: 'pl-' + c, kind: 'place', src: 'geo:' + c + ':fact', title: g.name, body: clip(g.fact),
    art: STATE_ART.has(c) ? 'art/state/' + c + '.jpg' : null }));
  (s.trivia || []).forEach((t, i) => add(Object.assign({}, base, { id: 'pt-' + c + '-' + i, kind: 'trivia', src: 'state:' + c + ':trivia:' + i,
    title: g.name, body: clip(t), route: '#/state/' + c + '|trivia:' + i, land: first(t) })));
  (s.places || []).forEach((p, i) => add(Object.assign({}, base, { id: 'pp-' + c + '-' + i, kind: 'see', src: 'state:' + c + ':places:' + i + ':what',
    title: p.name + ', ' + g.name, body: clip(p.what), route: '#/state/' + c + '|places:' + i, cta: 'Open ' + p.name, land: p.name })));
  (s.food || []).forEach((d, i) => add(Object.assign({}, base, { id: 'pd-' + c + '-' + i, kind: 'food', src: 'state:' + c + ':food:' + i + ':what',
    title: d.dish + ' · ' + g.name, body: clip(d.what), why: 'From ' + g.name + '’s kitchen', route: '#/state/' + c + '|food:' + i, cta: 'Open ' + d.dish, land: d.dish })));
  /* a food question, only for a dish one state alone claims */
  const solo = (s.food || []).map((d, i) => [d, i]).filter(([d]) => DISH_STATES[d.dish].length === 1)[0];
  if (solo) {
    const wr = wrongs(c, ALLSTATES.filter(x => x !== c), ci + 5);
    if (wr) add(Object.assign({}, base, { id: 'pq-' + c, kind: 'foodq', bands: bandsFor(6), topics: ['map'], src: 'state:' + c + ':food:' + solo[1] + ':dish', title: 'Whose kitchen?',
      fx: [], route: '#/state/' + c + '|food:' + solo[1], land: solo[0].dish,
      play: { q: solo[0].dish + ' is on one of these places’ tables. Which?', opts: [c, wr[0], wr[1]].map(stateName), a: 0,
        after: solo[0].dish + ': ' + solo[0].what }, why: 'A map question' }));
  }
  /* never a question that answers itself: "Chandigarh is the capital of which place?" with
     Chandigarh as the answer (v4 audit: Chandigarh, New Delhi, Puducherry). The same rule the
     quiz games keep (games-quiz.js leaks()): any word of three letters or more shared. */
  const shares = (a, b) => String(a).split(/[^A-Za-z]+/).some(w => w.length >= 3 && new RegExp('\\b' + w + '\\b', 'i').test(String(b)));
  if (g.capital && !shares(g.capital, g.name) && !shares(g.name, g.capital)) {
    const others = ALLSTATES.filter(x => x !== c && C.IND_GEO.states[x].capital !== g.capital);
    const opts = [g.name, stateName(others[(ci * 7) % others.length]), stateName(others[(ci * 7 + 13) % others.length])];
    if (new Set(opts).size === 3) add(Object.assign({}, base, { id: 'pc-' + c, kind: 'capital', bands: bandsFor(8), topics: ['map'], src: 'geo:' + c + ':capital', title: 'Which state?', fx: [],
      play: { q: g.capital + ' is the capital of which ' + (g.type === 'ut' ? 'place' : 'state') + '?', opts, a: 0,
        after: g.capital + ' is the capital of ' + g.name + '.' }, why: 'A map question' }));
  }
});
const BT = C.IND_BHUGOL.types || {};
C.IND_BHUGOL.features.forEach(f => {
  if (!f.f || !C.IND_GEO.states[f.st]) return;
  add({ id: 'bg-' + f.id, kind: 'feature', badge: 'aaj', bands: bandsFor(4), level: null, topics: ['place:' + f.st], src: 'bhugol:' + f.id + ':f',
    route: '#/state/' + f.st + '|feature:' + f.id, title: f.n + ' · ' + stateName(f.st), body: clip(f.f), art: null, cta: 'Open ' + f.n,
    why: ((BT[f.t] || {}).n || 'On the map') + ' in ' + stateName(f.st), land: f.n,
    fx: [['Kind', '{0}', ['IND_BHUGOL/types/' + f.t + '/n']], ['In', '{0}', ['IND_BHUGOL/features/[id=' + f.id + ']/st|names']]] });
});

/* ---------------------------------------------------------------- games (no level) */
/* only what the Play tab shows (games spec §3.1): never a folded alias (`hide`), never a card
   still with its reviewer (`review`, unless the owner opened it), and never a legacy card whose replacement is released —
   a card's door must open on that very game, and #/game/statehunt now opens Naksha */
const GM_NEXT = { statehunt: 'naksha', festival: 'panchang', jataka: 'katha' };
const gmById = id => C.IND_GAMES.find(x => x.id === id);
/* released as the host's released() says: signed, or opened by the owner before review (9 Oct 2026) */
const released = gm => !!gm && (!gm.review || !!(gm.open && gm.open.by === 'owner'));
const onPlay = gm => !gm.hide && released(gm) &&
  !(GM_NEXT[gm.id] && released(gmById(GM_NEXT[gm.id])));
C.IND_GAMES.filter(onPlay).forEach(gm => {
  const how = (C.GAME_FRAME[gm.id] || [])[0];
  if (!how) return;
  add({ id: 'gm-' + gm.id, kind: 'game', badge: 'aaj', bands: bandsFor(4), level: null, topics: ['game:' + gm.id], src: 'game:' + gm.id, route: '#/game/' + gm.id,
    title: gm.name, body: how, art: (C.IND_GAME_PLATES || []).indexOf(gm.id) >= 0 ? 'art/games/' + gm.id + '.webp' : null,
    cta: 'Play', why: C.TEACHES.indexOf(gm.id) >= 0 ? 'A game that teaches' : 'A game for fun — it pays no coins', land: gm.name,
    fx: [['You practise', '{0}', ['GAME_FRAME/' + gm.id + '/1']], ['About', '{0} min', ['IND_GAMES/[id=' + gm.id + ']/minutes']]] });
});
C.IND_GULLY.games.filter(gm => !gm.needs_review && gm.kid).forEach(gm => {
  const gp = 'IND_GULLY/games/[id=' + gm.id + ']/';
  const base = { badge: C.IND_GULLY.badge || 'aaj', bands: bandsFor(parseInt(gm.age, 10) || 4), level: null, topics: ['gully:' + gm.id],
    route: '#/gullygame/' + gm.id, art: null, cta: 'How to play', land: gm.name,
    fx: [['Players', '{0}', [gp + 'players']], ['Age', '{0}', [gp + 'age']], ['Played in', '{0}', [gp + 'region']], ['To win', '{0}', [gp + 'win']]] };
  add(Object.assign({}, base, { id: 'gu-' + gm.id, kind: 'gully', src: 'gully:' + gm.id + ':kid', title: gm.name + ' · ' + gm.where, text: gm.script,
    body: clip(gm.kid), why: 'A game for the street or the courtyard' }));
  if (gm.setup) add(Object.assign({}, base, { id: 'gs-' + gm.id, kind: 'gullyhow', src: 'gully:' + gm.id + ':setup', title: 'How ' + gm.name + ' starts',
    body: clip(gm.setup, 300), why: 'A game for the street or the courtyard' }));
  (gm.alsoCalled || []).forEach((a, i) => add(Object.assign({}, base, { id: 'ga-' + gm.id + '-' + i, kind: 'gullyname', src: 'gully:' + gm.id + ':alsoCalled:' + i,
    title: gm.name + ', by another name', body: a, why: 'The same game, in another language' })));
});

/* ---------------------------------------------------------------- the family (no level) */
C.IND_NANI.questions.forEach(q => {
  if (!q.en) return;
  add({ id: 'nq-' + q.id.replace(/^q\./, ''), kind: 'ask', badge: 'aaj', bands: bandsFor(4), level: null, topics: ['nani:' + q.tag, 'lang:' + (q.lang || 'hi')],
    src: 'nani:' + q.id + ':en', route: '#/nani/' + q.id, title: 'A question to ask', text: q.hi, roman: q.roman, lang: q.lang, body: q.en, art: null,
    cta: 'Ask this one', why: 'Ask your family', land: q.hi, fx: [['Then ask', '{0}', ['IND_NANI/questions/[id=' + q.id + ']/follow']]] });
});
C.IND_RISHTEY.terms.forEach(t => {
  if (!t.en || !t.hi) return;
  add({ id: 'rt-' + t.id, kind: 'family', badge: 'aaj', bands: bandsFor(4), level: null, topics: ['lang:hi', 'rishtey'], src: 'rishtey:' + t.id + ':en',
    route: '#/rishtey/' + t.id, title: 'A family word', text: t.hi, roman: t.roman, lang: 'hi', body: t.en, art: null, cta: 'Open this word',
    why: 'What your family calls each other — in many families', land: t.hi,
    fx: [['In many families it is also', '{0}', ['IND_RISHTEY/terms/[id=' + t.id + ']/also|vals']]] });
});
C.IND_NEETI.values.forEach(v => {
  if (!v.kid) return;
  add({ id: 'nv-' + v.id, kind: 'value', badge: 'aaj', bands: bandsFor(4), level: null, topics: ['value:' + v.id], src: 'value:' + v.id + ':kid',
    route: '#/value/' + v.id, title: v.roman + ' · ' + v.en, text: v.term, lang: 'hi', body: v.kid, art: null, cta: 'Open ' + v.roman, why: 'A value to try today',
    land: v.term, fx: [['Do it today', '{0}', ['IND_NEETI/values/[id=' + v.id + ']/doit']]] });
});

/* ---------------------------------------------------------------- ids, near-duplicates */
const seenId = {};
items.forEach(it => { if (seenId[it.id]) throw new Error('two feed items share the id ' + it.id); seenId[it.id] = 1; });
const { dropped } = nearPairs(items, { drop: true });
const kept = items.filter((it, i) => !dropped.has(i));

/* ---------------------------------------------------------------- groups: by level, in chunks */
const CHUNK = 300;
const byG = {};
kept.forEach(it => { const g = it.level == null ? 'any' : 'L' + it.level; (byG[g] = byG[g] || []).push(it); });
const GROUPS = [];
Object.keys(byG).sort().forEach(g => byG[g].forEach((it, i) => {
  it.g = g + '-' + Math.floor(i / CHUNK);
  if (GROUPS.indexOf(it.g) < 0) GROUPS.push(it.g);
}));

/* ---------------------------------------------------------------- write */
const byKind = {}, byLevel = {};
kept.forEach(it => { byKind[it.kind] = (byKind[it.kind] || 0) + 1; const l = it.level == null ? 'any' : RANKS[it.level]; byLevel[l] = (byLevel[l] || 0) + 1; });
/* the index: what the ranking needs and no words — dictionaries for what repeats */
const dict = () => { const a = [], m = {}; return { a, at: v => (m[v] == null ? (m[v] = a.push(v) - 1) : m[v]) }; };
const K = dict(), B = dict(), T = dict(), G = dict();
GROUPS.forEach(g => G.at(g));
const BMASK = b => BANDS.reduce((n, x, i) => n | ((b || []).indexOf(x[0]) >= 0 ? 1 << i : 0), 0);
const rows = kept.map(it => [it.id, K.at(it.kind), B.at(it.badge), BMASK(it.bands), it.level == null ? -1 : it.level,
  it.unlock ? it.unlock.lang + ':' + it.unlock.rung : 0, (it.topics || []).map(T.at), G.at(it.g), it.key || 0, (it.play ? 1 : 0) + (it.news ? 2 : 0)]);
const head = '/* GENERATED by tools/build-feed.js from the corpus — never edit by hand (docs/30-feed.md). */\n';
for (const f of fs.readdirSync(APP)) if (/^data-feed-.*\.js$/.test(f)) fs.unlinkSync(path.join(APP, f));
fs.writeFileSync(path.join(APP, 'data-feed-index.js'), head + 'window.IND_FEED_INDEX = ' + JSON.stringify({ v: 2, bands: BANDS.map(b => b[0]),
  ranks: RANKS, kinds: K.a, badges: B.a, topics: T.a, groups: G.a, rows }) + ';\n');
const INDEX_ONLY = ['id', 'kind', 'badge', 'bands', 'level', 'unlock', 'topics', 'g', 'key', 'news', 'story', 'land', '_fx'];
const PROOF = { facts: {}, land: {} };
kept.forEach(it => { if (it._fx && it._fx.length) PROOF.facts[it.id] = it._fx; if (it.land) PROOF.land[it.id] = it.land; });
GROUPS.forEach(g => {
  const body = {};
  kept.filter(it => it.g === g).forEach(it => { const o = Object.assign({}, it); INDEX_ONLY.forEach(k => { if (k !== 'id') delete o[k]; }); delete o.id; body[it.id] = o; });
  fs.writeFileSync(path.join(APP, 'data-feed-' + g + '.js'), head + 'window.IND_FEED_BODY = window.IND_FEED_BODY || {};\n' +
    'Object.assign(window.IND_FEED_BODY, ' + JSON.stringify(body) + ');\n');
});
/* the lazy groups in index.html, between the markers */
const HTML = path.join(APP, 'index.html');
const html = fs.readFileSync(HTML, 'utf8'), A = '<!-- feed:groups -->', Z = '<!-- /feed:groups -->';
if (html.indexOf(A) < 0 || html.indexOf(Z) < 0) throw new Error('index.html has no feed markers');
const tpl = GROUPS.map(g => '<template id="lazy-feed-' + g + '">\n<script src="data-feed-' + g + '.js"></script>\n</template>').join('\n');
fs.writeFileSync(HTML, html.slice(0, html.indexOf(A) + A.length) + '\n' + tpl + '\n' + html.slice(html.indexOf(Z)));
fs.writeFileSync(path.join(__dirname, 'lib', 'feed-proof.json'), JSON.stringify(PROOF) + '\n');
fs.writeFileSync(path.join(__dirname, 'lib', 'feed-manifest.json'), JSON.stringify({ total: kept.length, cut: items.length, nearDropped: dropped.size,
  withFacts: kept.filter(it => it.facts).length,
  byLevel, byKind, groups: GROUPS.map(g => [g, kept.filter(it => it.g === g).length]) }, null, 1) + '\n');
console.log('feed: ' + kept.length + ' cards (' + dropped.size + ' near-duplicates dropped of ' + items.length + ')');
console.log('  by level: ' + RANKS.map(r => r + ' ' + (byLevel[r] || 0)).join(' · ') + ' · any ' + (byLevel.any || 0));
console.log('  by kind:  ' + Object.keys(byKind).map(k => k + ' ' + byKind[k]).join(' · '));
