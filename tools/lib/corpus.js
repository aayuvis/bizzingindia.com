/* tools/lib/corpus.js — the app's own data, loaded in node exactly as the page loads it.

   Every data file index.html names (in the shell or in a lazy group) runs in one sandbox,
   in page order, with the language engine so the packs register. Used by build-feed.js
   to build My Feed and by check-feed.js to prove every feed item still resolves. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const APP = path.join(__dirname, '..', '..', 'app');

function load() {
  const noop = () => {};
  const el = () => ({ style: {}, classList: { add: noop, remove: noop, toggle: noop }, setAttribute: noop,
    appendChild: noop, addEventListener: noop });
  const ctx = { console: { log: noop, warn: noop, error: noop }, Math, Date, JSON, setTimeout: noop, clearTimeout: noop,
    navigator: {}, location: { search: '', hash: '' }, addEventListener: noop,
    localStorage: { getItem: () => null, setItem: noop },
    document: { createElement: el, createTextNode: el, createElementNS: el, addEventListener: noop, getElementById: () => null,
      querySelector: () => null, querySelectorAll: () => [], documentElement: el(), head: el(), body: el() } };
  ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
  const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script src="([^"?]+)/g)].map(m => m[1])
    .filter(f => /^(data-|map-data|likhna\.js|bhasha\.js|game-art\.js|games(-[a-z]+)?\.js|avatars\.js|avatar-cards\.js)/.test(f) && !/^data-feed/.test(f));
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(APP, f), 'utf8'), ctx, { filename: f });
  /* each game's how-to line rides with games.js (window.IND_GAME_FRAME), which ran above; the
     TEACHES list lives in app.js — read them, never retype them */
  const app = fs.readFileSync(path.join(APP, 'app.js'), 'utf8');
  ctx.GAME_FRAME = ctx.IND_GAME_FRAME || {};
  const teaches = app.match(/var TEACHES = (\[[^\]]*\])/);
  ctx.TEACHES = teaches ? vm.runInNewContext(teaches[1]) : [];
  const shell = fs.readFileSync(path.join(APP, 'shell-index.js'), 'utf8');
  vm.runInContext(shell, ctx, { filename: 'shell-index.js' });
  ctx.stories = [].concat(...Object.keys(ctx).filter(k => /^IND_STORIES/.test(k)).map(k => ctx[k] || []));
  return ctx;
}
module.exports = { load, APP };
