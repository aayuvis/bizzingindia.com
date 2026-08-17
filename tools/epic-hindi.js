#!/usr/bin/env node
/* epic-hindi.js — the Hindi telling of the two epics, the same way the stories got theirs.
 *
 *   node tools/epic-hindi.js --todo
 *   node tools/epic-hindi.js --export <ramayana|mahabharata>
 *   node tools/epic-hindi.js --import <file.json>
 *   node tools/epic-hindi.js --clips [all|<epic>]
 *
 * WHY A SECOND TOOL and not story-hindi.js: the epics are a different shape. A story is a
 * flat list of scenes; an epic is episodes of cards, each card with a `who` and a `text`,
 * and the clip key is `ep/<epic>-<episode>-<card>` rather than `st/<slug>-<i>`. Everything
 * else — the contract, the guards, the refusal to trust a text search over the parsed data
 * — is deliberately identical, because those rules were all learned the hard way once.
 *
 * THE CONTRACT for a translated card is the story contract, unchanged:
 *   - `hi` reads as Hindi, not English wearing Hindi words.
 *   - Elders and revered figures take आप and the honorific plural.
 *   - Names stay in Devanagari. राम, सीता, अर्जुन — never transliterated back to Latin.
 *   - Nothing added, nothing cut. Same beats, same length, same restraint.
 *
 * AND ONE RULE THIS TOOL ADDS, because the epics are what they are: the Mahabharata does
 * not hand down verdicts and the Ramayana is told plainly. A translation must not sneak in
 * a moral, an honorific the English does not have, or a devotional register the original
 * refuses. Same story, other language — not a sermon.
 *
 * Every epic touched gets needs_native_speaker: true, same as the stories.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const APP = path.join(ROOT, 'app');
const FILES = { ramayana: 'data-epic-ramayana.js', mahabharata: 'data-epic-mahabharata.js' };
const GLOBALS = { ramayana: 'IND_EPIC_RAMAYANA', mahabharata: 'IND_EPIC_MAHABHARATA' };

function load() {
  const W = {};
  const ctx = vm.createContext({ window: W, console, Date, Math, JSON, Object, Array, String, Number });
  for (const f of Object.values(FILES)) {
    vm.runInContext(fs.readFileSync(path.join(APP, f), 'utf8'), ctx, { filename: f });
  }
  const out = {};
  for (const [id, g] of Object.entries(GLOBALS)) if (W[g]) out[id] = W[g];
  return out;
}

function todo() {
  const eps = load();
  let cards = 0, hi = 0;
  console.log('epic'.padEnd(14), 'episodes'.padStart(9), 'cards'.padStart(7), 'hi'.padStart(7));
  for (const [id, e] of Object.entries(eps)) {
    let c = 0, h = 0;
    for (const ep of e.episodes || []) for (const card of ep.cards || []) { c++; if (card.hi) h++; }
    cards += c; hi += h;
    console.log(id.padEnd(14), String((e.episodes || []).length).padStart(9),
      String(c).padStart(7), String(h).padStart(7));
  }
  console.log('\n%d of %d cards have Hindi (%d%%)', hi, cards, Math.round(hi / cards * 100));
}

function exportEpic(id) {
  const e = load()[id];
  if (!e) { console.error('no such epic: ' + id); process.exit(2); }
  const out = [];
  (e.episodes || []).forEach(ep => {
    (ep.cards || []).forEach((c, i) => {
      if (c.hi) return;
      out.push({ id, n: ep.n, i, en: c.text, hi: '' });
    });
  });
  process.stdout.write(JSON.stringify(out, null, 1));
  process.stderr.write('\n' + out.length + ' cards need Hindi in "' + id + '"\n');
}

/* Writing back into the source. The cards are object literals in a .js file, so this edits
   TEXT anchored on each card's own `text:` line — exactly like story-hindi.js, and for the
   same reason: re-serialising the module would lose every comment in it.

   The "already has hi" question is asked of the PARSED DATA and never of the surrounding
   characters. The story importer originally sniffed for `hi:` within 400 characters of the
   anchor, which reached into the NEXT card's freshly-inserted line and made it skip every
   other one — ten of twenty-four went missing and the run still reported success. */
function importFile(file) {
  const rows = JSON.parse(fs.readFileSync(file, 'utf8')).filter(r => r.hi && r.hi.trim());
  if (!rows.length) { console.log('nothing to import'); return; }

  const eps = load();
  const byEpic = {};
  for (const r of rows) (byEpic[r.id] = byEpic[r.id] || []).push(r);

  let wrote = 0, skipped = 0;
  const missing = [];

  for (const [id, list] of Object.entries(byEpic)) {
    const e = eps[id];
    const p = path.join(APP, FILES[id]);
    if (!e || !fs.existsSync(p)) { console.log('  ?? unknown epic', id); continue; }
    let src = fs.readFileSync(p, 'utf8');

    /* which cards ALREADY have Hindi, from the parsed data */
    const have = new Set();
    (e.episodes || []).forEach(ep => (ep.cards || []).forEach((c, i) => {
      if (c.hi) have.add(ep.n + ':' + i);
    }));

    /* Every `text:` anchor in the file, in order. The cards appear in the same order in
       the source as in the parsed data, so the k-th anchor is the k-th card.

       The anchor must NOT assume a newline before `text:`. The Ramayana writes a card
       across several lines and the Mahabharata writes each one on a single line
       (`{ who: null, text: '...' },`) -- anchoring on \n found 403 cards in one file and
       zero in the other, and the guard below correctly refused to guess. Match `text:`
       wherever it appears after a brace or comma, and insert inline. */
    const marks = [];
    const re = /([{,])(\s*)text: /g;
    let m;
    while ((m = re.exec(src))) marks.push({ at: m.index + m[1].length, indent: m[2] });

    /* map (episode, card) -> flat card index, the same order the anchors are in */
    const flat = {};
    let k = 0;
    (e.episodes || []).forEach(ep => (ep.cards || []).forEach((c, i) => {
      flat[ep.n + ':' + i] = k++;
    }));
    if (marks.length !== k) {
      console.log('  !! %s: %d text anchors but %d cards — refusing to guess', id, marks.length, k);
      continue;
    }

    for (const r of list.sort((a, b) => (flat[b.n + ':' + b.i] - flat[a.n + ':' + a.i]))) {
      const key = r.n + ':' + r.i;
      if (have.has(key)) { skipped++; continue; }
      const idx = flat[key];
      if (idx == null || !marks[idx]) { missing.push(id + ' ' + key); continue; }
      const mk = marks[idx];
      /* inserted inline, right before `text:`, so it works whether the card is written
         on one line or across several */
      const lit = (mk.indent || ' ') + "hi: '" + r.hi.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "',";
      src = src.slice(0, mk.at) + lit + src.slice(mk.at);
      wrote++;
    }

    // THE DRAFT FLAG. Anchored on the real assignment, not on the first textual match of
    // `episodes:` — the header doc-comment of both files contains that word, so the flag
    // went in there first. Worse, the comment being inserted ended with a block-comment
    // terminator, which closed the enclosing header comment and turned the rest of it
    // into code: the file stopped parsing at all. Then the note explaining that mistake
    // did it a second time, to this tool, for the same reason. Hence: LINE comments only
    // anywhere near this, and anchor on the global rather than on prose.
    if (!/needs_native_speaker: true/.test(src)) {
      const g = GLOBALS[id];
      src = src.replace(new RegExp('(window\\.' + g + '\\s*=\\s*\\{)'),
        '$1\n  // The Hindi telling below is a DRAFT: it needs a named Hindi pedagogue per line\n' +
        '  // before launch (docs/05 6). The audio is synthesised from these lines, so a\n' +
        '  // correction means re-running tools/tts.py for that one clip.\n' +
        '  needs_native_speaker: true,');
    }
    fs.writeFileSync(p, src);
    console.log('wrote %d Hindi lines into %s', wrote, FILES[id]);
  }
  if (skipped) console.log('  (%d already had Hindi)', skipped);
  if (missing.length) console.log('  !! %d did NOT land: %s', missing.length, missing.slice(0, 6).join(', '));
}

/* The clip list tts.py consumes. Key matches app.js cardVoice() with the -hi suffix the
   reader looks for: ep/<epic>-<episode>-<card>-hi */
function clips(which) {
  const eps = load();
  const out = [];
  for (const [id, e] of Object.entries(eps)) {
    if (which && which !== 'all' && which !== id) continue;
    (e.episodes || []).forEach(ep => (ep.cards || []).forEach((c, i) => {
      if (!c.hi) return;
      out.push({ key: 'ep/' + id + '-' + ep.n + '-' + i + '-hi', text: c.hi, lang: 'hi-IN' });
    }));
  }
  process.stdout.write(JSON.stringify(out, null, 1));
  process.stderr.write('\n' + out.length + ' Hindi clips\n');
}

const a = process.argv.slice(2);
if (a[0] === '--todo') todo();
else if (a[0] === '--export') exportEpic(a[1]);
else if (a[0] === '--import') importFile(a[1]);
else if (a[0] === '--clips') clips(a[1] || 'all');
else {
  console.error('Usage: epic-hindi.js --todo | --export <epic> | --import <file> | --clips [epic]');
  process.exit(2);
}
