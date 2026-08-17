#!/usr/bin/env node
/* story-hindi.js — the Hindi telling of a story, batch by batch.
 *
 *   node tools/story-hindi.js --todo                 what is left, by collection
 *   node tools/story-hindi.js --export <collection>  scenes needing Hindi, as JSON
 *   node tools/story-hindi.js --import <file.json>   write translations into the data
 *   node tools/story-hindi.js --clips <collection>   the clip list for tools/tts.py
 *
 * WHY A TOOL AND NOT A HAND EDIT. 344 stories, 2,830 scenes. The Hindi lands one
 * collection at a time over many sittings, and every sitting has to be able to
 * ask "what is still missing" and get a true answer. Hand-editing that many
 * files is how a story ends up half translated with nobody noticing — the app
 * would keep working, and one scene would silently switch back to English.
 *
 * THE CONTRACT for a translated scene, and it is not negotiable:
 *   - `hi` reads as Hindi, not as English with Hindi words. Re-order, re-idiom,
 *     use the natural verb-final shape. A calque is worse than no translation
 *     because it teaches a child a sentence no one says.
 *   - Elders take आप and the honorific plural. A child speaking to a grandparent
 *     getting this wrong is the actual social risk the app exists to prevent.
 *   - Names stay in Devanagari; nothing is transliterated back into Latin.
 *   - Nothing is added and nothing is cut. Same beats, same length, same joke.
 *
 * EVERY story that gets Hindi also gets needs_native_speaker: true. These are
 * drafts until a named Hindi pedagogue signs them (docs/05 §6, docs/09 §9), and
 * the audio is synthesised FROM the drafts, so a correction means re-running
 * tools/tts.py for that one clip.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const APP = path.join(ROOT, 'app');

const FILES = fs.readdirSync(APP).filter(f => /^data-stories.*\.js$/.test(f)).sort();

function loadAll() {
  const W = {};
  const ctx = vm.createContext({ window: W, console, Date, Math, JSON, Object, Array, String, Number });
  const byFile = {};
  for (const f of FILES) {
    const before = new Set(Object.keys(W));
    vm.runInContext(fs.readFileSync(path.join(APP, f), 'utf8'), ctx, { filename: f });
    for (const k of Object.keys(W)) {
      if (!before.has(k) && Array.isArray(W[k]) && W[k].length && W[k][0] && W[k][0].scenes) {
        byFile[f] = (byFile[f] || []).concat(W[k]);
      }
    }
  }
  const all = [];
  for (const f of Object.keys(byFile)) for (const s of byFile[f]) all.push({ story: s, file: f });
  return all;
}

function todo() {
  const all = loadAll();
  const byCol = {};
  let scenes = 0, doneScenes = 0;
  for (const { story } of all) {
    const c = story.collection || '(none)';
    const n = (story.scenes || []).length;
    const d = (story.scenes || []).filter(x => x.hi).length;
    scenes += n; doneScenes += d;
    const r = byCol[c] || (byCol[c] = { stories: 0, done: 0, scenes: 0, hi: 0 });
    r.stories++; r.scenes += n; r.hi += d;
    if (d === n && n) r.done++;
  }
  const rows = Object.keys(byCol).sort((a, b) => byCol[b].scenes - byCol[a].scenes);
  console.log('collection'.padEnd(18), 'stories'.padStart(8), 'done'.padStart(6),
              'scenes'.padStart(8), 'hi'.padStart(7));
  for (const c of rows) {
    const r = byCol[c];
    console.log(c.padEnd(18), String(r.stories).padStart(8), String(r.done).padStart(6),
                String(r.scenes).padStart(8), String(r.hi).padStart(7));
  }
  console.log('\n%d of %d scenes have Hindi (%d%%), across %d stories',
              doneScenes, scenes, Math.round(doneScenes / scenes * 100), all.length);
}

function exportCol(col) {
  const out = [];
  for (const { story } of loadAll()) {
    if (story.collection !== col) continue;
    (story.scenes || []).forEach((sc, i) => {
      if (sc.hi) return;
      out.push({ id: story.id, i, en: sc.text, hi: '' });
    });
  }
  process.stdout.write(JSON.stringify(out, null, 1));
  process.stderr.write('\n' + out.length + ' scenes need Hindi in "' + col + '"\n');
}

/* Writing back into the source. The scene objects are literals in a .js file,
   so this edits TEXT, anchored on each scene's own `text:` line, rather than
   re-serialising the module and losing every comment in it. */
function importFile(file) {
  const rows = JSON.parse(fs.readFileSync(file, 'utf8')).filter(r => r.hi && r.hi.trim());
  if (!rows.length) { console.log('nothing to import'); return; }

  const byStory = {};
  for (const r of rows) (byStory[r.id] = byStory[r.id] || []).push(r);

  const all = loadAll();
  const fileOf = {}, haveHi = {};
  for (const { story, file: f } of all) {
    fileOf[story.id] = f;
    /* Which scenes ALREADY have Hindi, read from the parsed data. The first
       version sniffed the source text within 400 characters of each scene,
       which reached into the NEXT scene's freshly-inserted line and made the
       importer skip every other scene. Ten of twenty-four went missing and the
       run still reported success. Ask the data, never the neighbourhood. */
    haveHi[story.id] = new Set(
      (story.scenes || []).map((sc, i) => (sc.hi ? i : -1)).filter(i => i >= 0));
  }

  let wrote = 0, skipped = 0, touched = new Set();
  const missing = [];
  for (const sid of Object.keys(byStory)) {
    const f = fileOf[sid];
    if (!f) { console.log('  ?? unknown story', sid); continue; }
    const p = path.join(APP, f);
    let src = fs.readFileSync(p, 'utf8');

    const at = src.indexOf(`id: '${sid}'`);
    if (at < 0) { console.log('  ?? cannot locate', sid, 'in', f); continue; }
    // the story's block ends at the next top-level `id: '` or end of file
    let end = src.indexOf("\n  id: '", at + 5);
    if (end < 0) end = src.length;
    let block = src.slice(at, end);

    // scenes in order; each begins at a `text:` line
    const marks = [];
    const re = /\n(\s*)text: /g;
    let m;
    while ((m = re.exec(block))) marks.push({ at: m.index, indent: m[1] });

    for (const r of byStory[sid].sort((a, b) => b.i - a.i)) {   // last first: offsets stay valid
      const mk = marks[r.i];
      if (!mk) { missing.push(sid + ':' + r.i + ' (no such scene)'); continue; }
      if (haveHi[sid] && haveHi[sid].has(r.i)) { skipped++; continue; }   // already translated
      const lit = "\n" + mk.indent + "hi: '" + r.hi.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "',";
      block = block.slice(0, mk.at) + lit + block.slice(mk.at);
      wrote++;
    }
    if (!/needs_native_speaker: true/.test(block)) {
      block = block.replace(`id: '${sid}',`,
        `id: '${sid}',\n  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue\n` +
        `     per line before launch (docs/05 §6). The audio is synthesised from\n` +
        `     these lines, so a correction means re-running tools/tts.py for it. */\n` +
        `  needs_native_speaker: true,`);
    }
    src = src.slice(0, at) + block + src.slice(end);
    fs.writeFileSync(p, src);
    touched.add(f);
  }
  console.log('wrote %d Hindi lines into %s', wrote, [...touched].join(', '));
  /* Compare against what actually NEEDED writing, not the size of the file. A
     re-run of a finished batch is the normal case — every line is already in —
     and shouting "14 did not land" at that is a false alarm that trains whoever
     runs this to ignore the one time it is real. */
  if (skipped) console.log('  (%d already had Hindi)', skipped);
  if (missing.length) {
    console.log('  !! %d lines did NOT land: %s', missing.length, missing.slice(0, 6).join(', '));
    console.log('     Re-run --todo and check before trusting this.');
  }
}

/* The clip list tts.py consumes. Key matches app.js storyClip(): st/<slug>-<i>-hi */
function clips(col) {
  const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const out = [];
  for (const { story } of loadAll()) {
    if (col && col !== 'all' && story.collection !== col) continue;
    (story.scenes || []).forEach((sc, i) => {
      if (!sc.hi) return;
      out.push({ key: `st/${slug(story.id)}-${i}-hi`, text: sc.hi, lang: 'hi-IN' });
    });
  }
  process.stdout.write(JSON.stringify(out, null, 1));
  process.stderr.write('\n' + out.length + ' Hindi clips\n');
}

/* --------------------------------------------------------- THE TRAINING ENGINE
   A translated story scene is, structurally, exactly what stage 6 (Padhna) calls
   a passage: Hindi, its English meaning, and the lexicon words it uses. It also
   arrives with something the twelve authored passages do not have — a recorded
   narration, because the story was voiced when it was translated.

   So this writes app/data-bhasha-hi-passages.js, registering every translated
   scene into IND_BHASHA_PASSAGES.hi, which bhasha.js folds into s6.

   `lex` is the field that matters and it is COMPUTED, never hand-written. It is
   how the engine knows what a passage exercises — which words it can schedule
   it for, and whether a given child is ready for it. A hand-kept list would
   drift from the sentence the moment either was edited.

   Two rules the generator enforces, because a passage that breaks them is worse
   than no passage:
     - it must use at least two words the pack actually teaches, or it is not
       practice, just text;
     - readPassage builds its wrong answers from OTHER passages' English, so a
       scene whose English is a bare fragment ("ANOTHER LION? Take me to him.")
       makes an unfair question. Scenes shorter than a clause are skipped.
*/
function buildPassages() {
  const W = {};
  const ctx = vm.createContext({ window: W, console, Date, Math, JSON, Object, Array, String, Number });
  /* voice-manifest too, or every clip looks missing and every passage ships
     without the narration that is half the reason to use it */
  for (const f of fs.readdirSync(APP).filter(x => /^(bhasha|data-bhasha|voice-manifest)/.test(x))) {
    try { vm.runInContext(fs.readFileSync(path.join(APP, f), 'utf8'), ctx, { filename: f }); } catch (e) {}
  }
  const lex = ((W.IND_PACKS && W.IND_PACKS.hi && W.IND_PACKS.hi.lexicon) || [])
    .map(e => e.word)
    .filter(w => w && w.indexOf(' ') < 0)
    .sort((a, b) => b.length - a.length);      /* longest first: प्रश्न before श्न */
  if (!lex.length) throw new Error('no Hindi lexicon — cannot compute lex[]');

  const slug = x => String(x).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const voice = new Set((W.IND_VOICE) || []);
  const out = [];
  let thin = 0, frag = 0;

  for (const { story } of loadAll()) {
    (story.scenes || []).forEach((sc, i) => {
      if (!sc.hi) return;
      const en = (sc.text || '').replace(/\*/g, '').trim();
      if (en.length < 60) { frag++; return; }
      const used = lex.filter(w => sc.hi.indexOf(w) >= 0);
      if (used.length < 2) { thin++; return; }
      const key = 'st/' + slug(story.id) + '-' + i + '-hi';
      out.push({
        id: 'story:' + story.id + ':' + i,
        kind: 'passage',
        hi: sc.hi,
        en: en,
        lex: used.slice(0, 8),
        audio: voice.has(key) ? key : null,
        from: story.id
      });
    });
  }
  const body =
`/* Bizzing India — story tellings as Hindi reading passages.
   GENERATED by tools/story-hindi.js --passages; do not hand-edit.

   Every entry is one scene of a story that has a Hindi telling. bhasha.js folds
   these into stage 6 (Padhna) beside the twelve authored passages, so a child
   reading in the training engine meets the same sentences they met in a story —
   and hears them in the same voice, because \`audio\` is the story's own clip.

   \`lex\` is computed from the Hindi against the pack's own lexicon. It is what
   lets the engine schedule a passage for a word and judge whether a child is
   ready for it. Never edit it by hand; re-run the generator.

   Every line here is a DRAFT until a named Hindi pedagogue signs the story it
   came from (docs/05 §6). */

window.IND_BHASHA_PASSAGES = window.IND_BHASHA_PASSAGES || {};
window.IND_BHASHA_PASSAGES.hi = ${JSON.stringify(out, null, 1)};
`;
  fs.writeFileSync(path.join(APP, 'data-bhasha-hi-passages.js'), body);
  const withAudio = out.filter(x => x.audio).length;
  console.log('data-bhasha-hi-passages.js: %d passages (%d with narration)', out.length, withAudio);
  console.log('  skipped %d too short to answer fairly, %d using fewer than two lexicon words',
              frag, thin);
}

const a = process.argv.slice(2);
if (a[0] === '--todo') todo();
else if (a[0] === '--export') exportCol(a[1]);
else if (a[0] === '--import') importFile(a[1]);
else if (a[0] === '--clips') clips(a[1] || 'all');
else if (a[0] === '--passages') buildPassages();
else console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]);
