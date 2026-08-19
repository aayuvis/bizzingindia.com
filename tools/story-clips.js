/* Build the narration clip list for every story: key -> text.
   Keys mirror exactly what the reader asks for at play time (app.js: st/<slug>-<i>,
   and -q for a scene's question), so a clip can never be generated under a name
   nothing plays. Usage: node tools/story-clips.js out.json */
'use strict';
const vm = require('vm'), fs = require('fs'), path = require('path');
const W = { window: {} }; W.window = W; vm.createContext(W);
const dir = path.join(__dirname, '..', 'app');
fs.readdirSync(dir).filter(f => /^data-stories.*\.js$/.test(f)).sort()
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), W, { filename: f }));
const all = ['IND_STORIES','IND_STORIES_REGIONAL','IND_STORIES_MORE','IND_STORIES_SOUTH',
  'IND_STORIES_NORTH','IND_STORIES_EAST','IND_STORIES_WEST','IND_STORIES_NE_A',
  'IND_STORIES_NE_B','IND_STORIES_MODERN','IND_STORIES_VIGYAN']
  .reduce((a, k) => a.concat(W[k] || []), []);
const slug = s => String(s).replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-|-$/g, '').slice(0, 60);
const out = [];
all.forEach(s => {
  /* HOOK AND MORAL BELONG IN THIS LIST, and their absence caused a real bug.
     They were narrated once, early, by the American voice. Then the whole library was
     re-narrated by the Indian narrator (en-IN-Chirp3-HD-Laomedeia) -- driven by THIS
     list, which did not mention them -- so 646 clips silently kept the old accent while
     every scene around them changed. Nothing in the app noticed because the app renders
     hook and moral as TEXT and never plays them; the mismatch only surfaced when
     a video used them and a listener heard the film change voice at the end.

     The header above says these keys mirror exactly what the reader asks for. It was
     two keys per story short of true. */
  if (s.hook)  out.push({ key: 'st/' + slug(s.id) + '-hook',  text: s.hook,  lang: 'en-US' });
  if (s.moral) out.push({ key: 'st/' + slug(s.id) + '-moral', text: s.moral, lang: 'en-US' });
  (s.scenes || []).forEach((sc, i) => {
    if (sc.text) out.push({ key: 'st/' + slug(s.id) + '-' + i, text: sc.text, lang: 'en-US' });
    if (sc.ask && sc.ask.q) out.push({ key: 'st/' + slug(s.id) + '-' + i + '-q', text: sc.ask.q, lang: 'en-US' });
  });
});
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(all.length + ' stories -> ' + out.length + ' clips, ' +
  out.reduce((n, c) => n + c.text.length, 0) + ' chars');
