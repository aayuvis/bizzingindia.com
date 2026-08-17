#!/usr/bin/env node
/* gen-voice-script.js — build the recording script the studio works from.
 *
 * The 72 authored Baat-cheet dialogues are the one part of Hindi with NO audio at
 * all (measured: 0 clips), which means the conversation stage — the one about
 * talking to people — is silent. This turns those dialogues into a flat, ordered
 * list of lines to record, and writes it where tools/studio.js can serve it.
 *
 *   node tools/gen-voice-script.js
 *   -> tools/studio/script.json
 *
 * KEY SCHEME, matching the derived scheme the rest of the voice pipeline uses
 * (hi/w-paani for a word, hi/s-paani for its sentence):
 *
 *   hi/d-07-p        the prompt      — what Nani / the vendor / the teacher says
 *   hi/d-07-r        the reply       — the child's own correct line
 *   hi/d-07-x1..x3   the distractors — the other options on screen
 *
 * and a voice suffix on the FILE, never on the key:  hi/d-07-p-f.webm
 *
 * PRIORITY. 72 dialogues x 5 lines x 2 voices is 720 takes, which is a lot to ask
 * of a volunteer. The list is ordered so the essential half comes first — every
 * prompt, then every reply (288 takes) — and the distractors follow, marked
 * optional. A child who cannot read yet needs the options read out too, so they
 * are not pointless; they are just not the thing that unblocks the stage.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(__dirname, 'studio');
const OUT = path.join(OUT_DIR, 'script.json');

function load(file) {
  const W = {};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'app', file), 'utf8'), { window: W });
  return W;
}

function pad(n) { return String(n).padStart(2, '0'); }

function main() {
  const W = load('data-bhasha-hi-dialogues.js');
  const dlg = (W.IND_BHASHA_DIALOGUES && W.IND_BHASHA_DIALOGUES.hi) || [];
  if (!dlg.length) throw new Error('no Hindi dialogues found');

  const prompts = [], replies = [], distractors = [];

  dlg.forEach((d, i) => {
    const n = pad(i + 1);
    prompts.push({
      key: `hi/d-${n}-p`, tier: 'essential', part: 'prompt',
      hi: d.prompt, roman: d.roman, en: d.en,
      scene: d.scene, sceneEn: d.sceneEn,
      /* who is SPEAKING this line. The studio uses it to suggest which voice
         fits — Nani is a grandmother, bhaiya is the man at the market — but
         both voices are still recorded for every line, so the app can offer a
         child the voice they like. */
      who: d.who || 'someone', note: `${d.sceneEn} — ${d.who || 'they'} speaks`
    });
    replies.push({
      key: `hi/d-${n}-r`, tier: 'essential', part: 'reply',
      hi: d.reply.hi, roman: d.reply.roman, en: d.reply.en,
      scene: d.scene, sceneEn: d.sceneEn,
      who: 'child', note: 'the child’s own answer — read it the way a child would'
    });
    (d.distractors || []).forEach((x, j) => {
      distractors.push({
        key: `hi/d-${n}-x${j + 1}`, tier: 'optional', part: 'option',
        hi: x.hi, roman: x.roman, en: x.en,
        scene: d.scene, sceneEn: d.sceneEn,
        who: 'child', note: 'one of the other choices on screen'
      });
    });
  });

  const lines = prompts.concat(replies, distractors);

  /* The invariant that makes this safe to re-run: a key names exactly one line.
     If two dialogues ever produce the same key, a recording would silently
     overwrite another and nobody would notice until a child heard the wrong
     sentence in the wrong scene. */
  const seen = new Set();
  for (const l of lines) {
    if (seen.has(l.key)) throw new Error('duplicate key: ' + l.key);
    seen.add(l.key);
  }

  const out = {
    pack: 'hi',
    generated: 'run tools/gen-voice-script.js to rebuild',
    voices: [
      { id: 'f', label: 'Female' },
      { id: 'm', label: 'Male' }
    ],
    counts: {
      dialogues: dlg.length,
      essential: prompts.length + replies.length,
      optional: distractors.length,
      takes: (lines.length) * 2
    },
    lines: lines
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log(`studio/script.json: ${dlg.length} dialogues -> ${lines.length} lines ` +
              `(${out.counts.essential} essential, ${out.counts.optional} optional), ` +
              `${out.counts.takes} takes across 2 voices`);
}

main();
