#!/usr/bin/env node
/* No real model identifier in anything this repo pushes (CLAUDE.md, hard rule).
   Eleven art generators named their image model in code; they read it from IMG_MODEL (or
   --model) at run time now. This reads every tracked file — code, data, docs — and fails on a
   model id, so the next generator cannot quietly name one again.
   Run: node tools/check-names.js */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ID = /\b(?:gemini|imagen|gpt|dall-?e|claude)[-_ ]?\d[\w.-]*|\bclaude[-_ ](?:opus|sonnet|haiku|fable|instant)\b|\b(?:opus|sonnet|haiku|fable)[-_ ]\d(?:\.\d)?\b/i;
const files = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT }).toString().split('\0').filter(Boolean)
  .filter(f => /\.(js|mjs|cjs|py|sh|md|json|html|css|txt|yml|yaml)$/.test(f) && !/^app\/(data-|voice-manifest|art-manifest)/.test(f));
const bad = [];
for (const f of files.concat(fs.existsSync(path.join(ROOT, 'tools/check-names.js')) ? [] : [])) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p) || fs.statSync(p).size > 3e6) continue;
  fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
    const m = line.match(ID);
    if (m && f !== 'tools/check-names.js') bad.push(`${f}:${i + 1}: "${m[0]}"`);
  });
}
console.log(bad.length ? `  FAIL names    ${bad.length} model identifiers in tracked files\n         ` + bad.slice(0, 8).join('\n         ')
                       : `  ok   names    no model identifier in ${files.length} tracked files`);
console.log(`\n${bad.length ? 0 : 1} passed, ${bad.length ? 1 : 0} failed`);
process.exit(bad.length ? 1 : 0);
