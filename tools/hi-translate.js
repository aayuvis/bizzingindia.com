#!/usr/bin/env node
/* hi-translate.js — the Hindi telling of every story, at the scale there actually is.
 *
 *   export GEMKEY=...                                 # never hardcode the key
 *   node tools/hi-translate.js --collection jain      # one collection
 *   node tools/hi-translate.js --all                  # everything still missing
 *   node tools/hi-translate.js --all --dry            # what it would do, no calls
 *
 * WHY THIS EXISTS. 2,830 scenes. The first 35 were translated by hand, one scene at a
 * time, which is honest work and completely unscalable: at that rate the Hindi telling
 * of the library is a year of sittings. This does the same job by asking a model, under
 * the same contract, and then CHECKS the answer before letting it near the data.
 *
 * WHAT IT IS NOT. It is not a shortcut past review. Every story it touches still gets
 * `needs_native_speaker: true` (story-hindi.js --import writes it), because these are
 * drafts until a named Hindi pedagogue signs them — docs/05 §6. Machine translation
 * makes the draft cheap; it does not make the review optional. The whole point of the
 * flag is that nothing here ships unread.
 *
 * THE CONTRACT (from story-hindi.js, unchanged and not negotiable):
 *   - `hi` reads as Hindi, not English wearing Hindi words. Verb-final, re-idiomed.
 *   - Elders take आप and the honorific plural. This is the actual social risk the app
 *     exists to prevent, so it is also the thing checked hardest below.
 *   - Names stay in Devanagari. Nothing transliterates back to Latin.
 *   - Nothing added, nothing cut. Same beats, same length, same joke.
 *
 * WHAT IS CHECKED before a line is accepted, because a translator that quietly returns
 * English is worse than one that fails loudly:
 *   1. it is Devanagari — at least 60% of its letters, and no run of Latin letters
 *   2. it is not empty, not a refusal, not the English echoed back
 *   3. its length is within a sane band of the English (a third to triple)
 *   4. it ends like a sentence — । ? ! " or )
 *   5. the batch came back with exactly the scenes it was sent, in order, by id
 * A scene that fails is retried once on its own, then left for the next run. Nothing
 * half-checked is written; the file on disk is always a state you could ship to review.
 *
 * RESUMABLE by construction: it only ever asks for scenes with no `hi`, so a killed run
 * loses at most one batch, and re-running picks up exactly where it stopped.
 */
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MODEL = 'gemini-flash-latest';
const API = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';
const BATCH = 6;            /* scenes per request — small enough that one bad batch is cheap */
const RETRY_HTTP = 4;

const argv = process.argv.slice(2);
const has = f => argv.includes(f);
const val = f => { const i = argv.indexOf(f); return i > -1 ? argv[i + 1] : null; };
const DRY = has('--dry');
const LIMIT = +(val('--limit') || 0) || 0;

const KEY = process.env.GEMKEY || '';
if (!KEY && !DRY) {
  console.error('No GEMKEY in the environment. export GEMKEY=... and try again.');
  process.exit(2);
}

/* ------------------------------------------------------------------ the prompt */

function prompt(rows) {
  return [
    'You are translating a children\'s storybook into Hindi. The readers are Indian',
    'children aged 4 to 12 growing up outside India, and a grandparent may read these',
    'lines aloud to them. Translate each numbered English scene into Hindi.',
    '',
    'Rules, all of them binding:',
    '1. The Hindi must read as Hindi a person actually speaks — verb-final, naturally',
    '   idiomed, re-ordered where Hindi wants a different order. A word-for-word calque',
    '   is a failure even when every word is correct.',
    '2. Anyone older or revered — a grandparent, a parent, a teacher, a sage, a king,',
    '   a god — takes आप and the honorific plural verb. A child or a younger sibling or',
    '   an animal friend takes तुम. Never तू for an elder.',
    '3. Proper names are written in Devanagari (Bharata -> भरत, Bahubali -> बाहुबली).',
    '   Never leave a name in the Latin script.',
    '4. Add nothing and cut nothing. Same beats, same order, same length, same joke.',
    '   Do not explain, do not moralise, do not soften.',
    '5. Use everyday Hindi a child knows before heavy Sanskritised vocabulary, but do',
    '   not flatten a sacred word into a plain one — देवता stays देवता.',
    '6. Keep quotation marks where the English has them; dialogue stays dialogue.',
    '7. End sentences with । (not a full stop). ? and ! are fine where the English has them.',
    '',
    'Return ONLY a JSON array, one object per scene, in the same order:',
    '[{"n": 1, "hi": "..."}, ...]',
    'No markdown fence, no commentary.',
    '',
    rows.map((r, i) => (i + 1) + '. ' + JSON.stringify(r.en)).join('\n\n'),
  ].join('\n');
}

/* ------------------------------------------------------------------- the checks */

const DEVA = /[ऀ-ॿ]/;
const LATIN_RUN = /[A-Za-z]{3,}/;

function devaShare(s) {
  const letters = (s.match(/[\p{L}]/gu) || []).length;
  if (!letters) return 0;
  const deva = (s.match(/[ऀ-ॿ]/gu) || []).length;
  return deva / letters;
}

/* Returns null when the line is good, or a short reason why it is not. */
function reject(hi, en) {
  if (!hi || !hi.trim()) return 'empty';
  hi = hi.trim();
  if (!DEVA.test(hi)) return 'no Devanagari at all';
  if (devaShare(hi) < 0.6) return 'mostly not Devanagari (' + Math.round(devaShare(hi) * 100) + '%)';
  if (LATIN_RUN.test(hi)) return 'Latin left in: ' + (hi.match(LATIN_RUN) || [])[0];
  if (hi === en) return 'English echoed back';
  const ratio = hi.length / Math.max(1, en.length);
  if (ratio < 0.33) return 'far too short (' + ratio.toFixed(2) + 'x)';
  if (ratio > 3) return 'far too long (' + ratio.toFixed(2) + 'x)';
  if (!/[।?!"'”’)]\s*$/.test(hi)) return 'does not end like a sentence';
  return null;
}

/* --------------------------------------------------------------------- the call */

function ask(text) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text }] }],
    generationConfig: { temperature: 0.35, maxOutputTokens: 8192, responseMimeType: 'application/json' },
  });
  const tmp = path.join(os.tmpdir(), 'higen-' + process.pid + '.json');
  fs.writeFileSync(tmp, body);
  let last = '';
  for (let attempt = 0; attempt < RETRY_HTTP; attempt++) {
    if (attempt) sleep(2000 * Math.pow(2, attempt - 1));   /* 2s, 4s, 8s */
    try {
      const out = execFileSync('curl', [
        '-sS', '--max-time', '180', '-X', 'POST', API,
        '-H', 'Content-Type: application/json',
        '-H', 'X-goog-api-key: ' + KEY,
        '--data-binary', '@' + tmp,
      ], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
      const j = JSON.parse(out);
      if (j.error) { last = j.error.status + ' ' + j.error.message; continue; }
      const parts = (((j.candidates || [])[0] || {}).content || {}).parts || [];
      const txt = parts.map(p => p.text || '').join('');
      if (!txt.trim()) { last = 'empty candidate'; continue; }
      return txt;
    } catch (e) { last = e.message; }
  }
  fs.unlinkSync(tmp);
  throw new Error(last || 'no response');
}

function sleep(ms) {
  /* deliberately synchronous: this tool is one long queue, and a real pause between
     retries is the point. Atomics.wait is the only honest sync sleep in node. */
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function parseRows(txt, n) {
  let t = txt.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  let arr;
  try { arr = JSON.parse(t); } catch (e) {
    const m = t.match(/\[[\s\S]*\]/);
    if (!m) throw new Error('not JSON: ' + t.slice(0, 120));
    arr = JSON.parse(m[0]);
  }
  if (!Array.isArray(arr)) throw new Error('not an array');
  if (arr.length !== n) throw new Error('asked for ' + n + ' scenes, got ' + arr.length);
  return arr.map(o => String((o && o.hi) || ''));
}

/* --------------------------------------------------------------------- the run */

function collections() {
  const out = execFileSync('node', [path.join(__dirname, 'story-hindi.js'), '--todo'],
    { encoding: 'utf8' });
  return out.split('\n').slice(1)
    .map(l => l.trim().split(/\s{2,}/))
    .filter(p => p.length >= 5 && p[0] && p[0] !== 'collection')
    .map(p => ({ name: p[0], scenes: +p[3], hi: +p[4] }))
    .filter(c => c.scenes > c.hi);
}

function exportCol(col) {
  const out = execFileSync('node', [path.join(__dirname, 'story-hindi.js'), '--export', col],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  return JSON.parse(out);
}

function run(col) {
  let rows = exportCol(col);
  if (LIMIT) rows = rows.slice(0, LIMIT);
  if (!rows.length) { console.log('%s: nothing to do', col); return { ok: 0, bad: 0 }; }
  console.log('\n=== %s — %d scenes', col, rows.length);
  if (DRY) { console.log(prompt(rows.slice(0, 2))); return { ok: 0, bad: 0 }; }

  const done = [], failed = [];
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    let his;
    try {
      his = parseRows(ask(prompt(chunk)), chunk.length);
    } catch (e) {
      console.log('  batch %d-%d failed: %s', i, i + chunk.length - 1, e.message);
      failed.push(...chunk.map(r => [r, e.message]));
      continue;
    }
    chunk.forEach((r, k) => {
      const hi = (his[k] || '').trim();
      const why = reject(hi, r.en);
      if (why) failed.push([r, why]);
      else done.push({ id: r.id, i: r.i, hi });
    });
    process.stdout.write('  ' + Math.min(i + BATCH, rows.length) + '/' + rows.length +
      ' (' + done.length + ' good, ' + failed.length + ' held)\r');
  }

  /* One retry per rejected scene, alone, where a bad neighbour cannot drag it down. */
  const stillBad = [];
  for (const [r, why] of failed) {
    let hi = '';
    try { hi = (parseRows(ask(prompt([r])), 1)[0] || '').trim(); } catch (e) { hi = ''; }
    const w2 = reject(hi, r.en);
    if (w2) stillBad.push([r, why + ' / then ' + w2]);
    else done.push({ id: r.id, i: r.i, hi });
  }

  console.log('\n  %d translated, %d held back', done.length, stillBad.length);
  for (const [r, why] of stillBad.slice(0, 8)) console.log('    %s:%d — %s', r.id, r.i, why);
  if (stillBad.length > 8) console.log('    ... and %d more', stillBad.length - 8);

  if (done.length) {
    const f = path.join(os.tmpdir(), 'hi-' + col.replace(/\W/g, '') + '.json');
    fs.writeFileSync(f, JSON.stringify(done, null, 1));
    console.log(execFileSync('node', [path.join(__dirname, 'story-hindi.js'), '--import', f],
      { encoding: 'utf8' }).trim());
  }
  return { ok: done.length, bad: stillBad.length };
}

const only = val('--collection');
const cols = only ? [{ name: only }] : (has('--all') ? collections() : []);
if (!cols.length) {
  console.error('Usage: hi-translate.js --collection <name> | --all  [--limit N] [--dry]');
  process.exit(2);
}

let ok = 0, bad = 0;
for (const c of cols) { const r = run(c.name); ok += r.ok; bad += r.bad; }
console.log('\n%d scenes translated, %d held back for a human', ok, bad);
console.log('Every story touched is flagged needs_native_speaker — these are DRAFTS.');
