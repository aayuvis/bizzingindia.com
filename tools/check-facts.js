#!/usr/bin/env node
/* Bizzing India — facts carry their sources, and numbers agree with themselves
   (FIX-INDIA D7; family standard §6; CLAUDE.md editorial rule 2). docs/27-platform.md.

   A data lint over the files exactly as the page loads them. It fails when:
     sources   an era, a faith, a course, a verse or a story has nothing saying where it
               comes from — "never write history from memory" is checkable, so it is checked
     places    the map, the place names and the state facts disagree about which places exist
     counts    a number the app shows is typed instead of counted (the landing once said 11
               stories and 34 places when there were 344 and 36), or the shell index the first
               screen reads disagrees with the data
     ids       two stories, verses or eras share an id, so one would silently shadow the other

   Run: node tools/check-facts.js        (no browser; a second)
*/
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const APP = path.join(__dirname, '..', 'app');

const ctx = { console: { log() {} }, Math, Date, JSON, setTimeout() {}, navigator: {}, location: { search: '' },
  document: { createElement: () => ({ style: {} }), addEventListener() {}, getElementById: () => null }, addEventListener() {} };
ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="([^"?]+)/g)].map(m => m[1])
  .filter(f => /^(data-|map-data|shell-index)/.test(f) && !/^data-bhasha-/.test(f));   /* the language packs need their engine */
for (const f of files) vm.runInContext(fs.readFileSync(path.join(APP, f), 'utf8'), ctx, { filename: f });

const fails = [];
const need = (ok, msg) => { if (!ok) fails.push(msg); };
const has = x => Array.isArray(x) ? x.filter(s => String(s || '').trim()).length : !!String(x || '').trim();

/* sources */
(ctx.IND_ITIHAAS.eras || []).forEach(e => need(has(e.sources), `era "${e.id}" has no sources[]`));
(ctx.IND_DHARMA.faiths || []).forEach(f => need(has(f.sources) && f.sources.length >= 2, `faith "${f.id}" has fewer than two sources`));
(ctx.IND_PAATH.courses || []).forEach(c => need(has(c.sources), `course "${c.id}" has no sources`));
(ctx.IND_SHLOK.verses || []).forEach(v => need(has(v.source), `verse "${v.id}" has no source`));
const STORY_KEYS = Object.keys(ctx).filter(k => /^IND_STORIES/.test(k));
const stories = [].concat(...STORY_KEYS.map(k => ctx[k] || []));
stories.forEach(s => need(has(s.source), `story "${s.id}" does not say where it comes from`));

/* places: every mapped place has a name and a page of facts */
const mapped = Object.keys(ctx.IND_MAP.paths), named = ctx.IND_GEO.states, facts = ctx.IND_STATES || {};
mapped.forEach(c => { need(named[c] && named[c].name, `mapped place ${c} has no name`); need(facts[c], `mapped place ${c} has no facts`); });
stories.forEach(s => (s.place || []).forEach(p => { const c = String(p).replace('IN-', '');
  need(named[c], `story "${s.id}" is set in ${c}, which the app has no name for`); }));

/* counts: the first screen's index agrees with the data, and nothing shown is typed */
const X = ctx.IND_INDEX || {};
need(X.places === mapped.length, `the first screen says ${X.places} places; the map has ${mapped.length}`);
need((X.stories || []).length === stories.length, `the first screen knows ${(X.stories || []).length} stories; the data has ${stories.length}`);
need((X.courses || []).length === ctx.IND_PAATH.courses.length, 'the first screen and Paathshala disagree on how many courses');
const app = fs.readFileSync(path.join(APP, 'app.js'), 'utf8');
[[/of 34\b|\/ 34\b|lit \/ 34\b/, 'a place count typed as 34'], [/\b344 stories\b/, 'a story count typed as 344'],
 [/>\s*36\s*places/, 'a place count typed as 36']].forEach(([re, why]) => need(!re.test(app), why + ' in app.js — count it'));

/* ids */
const dup = (list, what) => { const seen = {}; list.forEach(id => { need(!seen[id], `two ${what} share the id "${id}"`); seen[id] = 1; }); };
dup(stories.map(s => s.id), 'stories'); dup(ctx.IND_SHLOK.verses.map(v => v.id), 'verses'); dup(ctx.IND_ITIHAAS.eras.map(e => e.id), 'eras');

fails.slice(0, 30).forEach(f => console.log('  FAIL ' + f));
if (fails.length > 30) console.log(`  … and ${fails.length - 30} more`);
console.log(`\n${stories.length} stories, ${ctx.IND_ITIHAAS.eras.length} eras, ${ctx.IND_DHARMA.faiths.length} faiths, ` +
  `${ctx.IND_PAATH.courses.length} courses, ${ctx.IND_SHLOK.verses.length} verses, ${mapped.length} places — ` +
  (fails.length ? fails.length + ' problems' : 'every fact sourced, every number agrees'));
process.exit(fails.length ? 1 : 0);
