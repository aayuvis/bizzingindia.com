/* Bizzing India — headless walk of every view.
 *
 * WHY: the app has no build step and no framework, which is the point, but it also means a
 * typo in one view template is invisible until a child taps that tab. This walks every view
 * in the app, in a real browser, and fails loudly on three things:
 *
 *   1. any console error or page exception, on any view
 *   2. any <img> that 404s — missing art is the most common breakage here, because art and
 *      data land from different places and a manifest can drift from the files on disk
 *   3. any view that renders empty or renders nothing but a back link, which is what a
 *      thrown template looks like from the outside
 *
 * It drives the app through window.BI.go(), the same entry point the click dispatcher uses,
 * so it exercises the real navigation rather than a parallel test path.
 *
 * Run:  node tools/verify.js            (walks app/ over file://)
 *       node tools/verify.js --url URL  (walks a deployed build)
 */
'use strict';

const path = require('path');
const { chromium } = require('playwright');

// Views that take an argument. The walker asks the page for a real id for each of these
// rather than hardcoding one, so the list does not rot every time content is added.
const ARG_VIEWS = {
  state: 'window.IND_MAP && Object.keys(window.IND_MAP.paths)',
  story: 'window.BI.allStories ? window.BI.allStories().map(function(s){return s.id}) : []',
  era: 'window.IND_ITIHAAS && window.IND_ITIHAAS.eras.map(function(e){return e.id})',
  faith: 'window.IND_DHARMA && window.IND_DHARMA.faiths.map(function(f){return f.id})',
  value: 'window.IND_NEETI && window.IND_NEETI.values.map(function(v){return v.id})',
  verses: 'window.IND_SHLOK && window.IND_SHLOK.collections.map(function(c){return c.id})',
  pack: 'window.IND_PACKS && Object.keys(window.IND_PACKS)',
  festival: 'window.IND_UTSAV && window.IND_UTSAV.festivals.map(function(f){return f.id})',
  song: 'window.IND_GEET && window.IND_GEET.songs.concat(window.IND_GEET.bhajans||[]).map(function(s){return s.id})',
  gullygame: 'window.IND_GULLY && window.IND_GULLY.games.map(function(g){return g.id})',
  epic: '(window.IND_EPIC_RAMAYANA||window.IND_EPIC_MAHABHARATA) ? ' +
        '[window.IND_EPIC_RAMAYANA,window.IND_EPIC_MAHABHARATA].filter(Boolean).map(function(e){return e.id}) : []',
};

const NO_ARG = ['home', 'map', 'stories', 'itihaas', 'dharma', 'learn', 'play', 'epics',
                'shlok', 'neeti', 'rishtey', 'worlds', 'bhasha', 'me', 'utsav', 'gully', 'nani', 'shelf', 'invite', 'geet'];

async function main() {
  const i = process.argv.indexOf('--url');
  const url = i > -1 ? process.argv[i + 1]
                     : 'file://' + path.join(__dirname, '..', 'app', 'index.html');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });

  const errors = [];
  const missing = new Set();
  let where = 'boot';

  page.on('console', m => { if (m.type() === 'error') errors.push(`[${where}] ${m.text()}`); });
  page.on('pageerror', e => errors.push(`[${where}] ${e.message}`));
  page.on('requestfailed', r => {
    // file:// serves 404s as failed requests; http gives us a response instead.
    if (/\.(png|jpg|jpeg|svg|webp|mp3)$/i.test(r.url())) missing.add(r.url().split('/').slice(-2).join('/'));
  });
  page.on('response', r => {
    if (r.status() >= 400 && /\.(png|jpg|jpeg|svg|webp|mp3)$/i.test(r.url())) {
      missing.add(r.url().split('/').slice(-2).join('/'));
    }
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction('window.BI && window.BI.go');

  // Skip onboarding — the walker is checking templates, not the first-run flow, and every
  // view behind the gate is unreachable until a profile exists.
  await page.evaluate(() => {
    window.BI.S.started = true;
    window.BI.S.name = window.BI.S.name || 'Test';
    window.BI.S.age = window.BI.S.age || 8;
    window.BI.render();
  });

  const targets = [];
  for (const v of NO_ARG) targets.push([v, undefined]);
  for (const [v, expr] of Object.entries(ARG_VIEWS)) {
    const ids = await page.evaluate(e => { try { return eval(e) || []; } catch (_) { return []; } }, expr);
    if (!ids.length) { console.log(`  (no data yet for ${v} — skipped)`); continue; }
    // First, last and middle: enough to catch a template that only breaks on some shapes,
    // without walking 500 stories on every run.
    const pick = [ids[0], ids[Math.floor(ids.length / 2)], ids[ids.length - 1]];
    for (const id of [...new Set(pick)]) targets.push([v, id]);
  }

  // REGISTRIES THAT PROMISE SOMETHING THEY CANNOT DELIVER.
  //
  // Walking views only catches an asset when an <img> is actually emitted for it. An avatar
  // registered in a pack with neither a PNG nor an inline SVG emits NOTHING — art() returns
  // an empty string — so the walk stayed green while 30 blank chips sat in onboarding. Same
  // shape of hole for any manifest that lists a key with no file behind it. Check the
  // registries directly rather than hoping a view happens to render every entry.
  const registries = await page.evaluate(() => {
    const out = [];
    const packs = window.IND_AVATAR_PACKS || {};
    const art = window.IND_AVATAR_ART || {}, svg = window.IND_AVATAR || {};
    Object.keys(packs).forEach(p => {
      const ids = packs[p].ids || packs[p];
      (Array.isArray(ids) ? ids : []).forEach(id => {
        if (!art[id] && !svg[id]) out.push(`avatar "${id}" is in pack "${p}" but has no image`);
      });
    });
    (window.IND_STORY_ART || []).length === 0 && out.push('story art manifest is empty');
    return out;
  });

  const thin = [];
  for (const [v, arg] of targets) {
    where = arg ? `${v}:${arg}` : v;
    await page.evaluate(([n, a]) => window.BI.go(n, a), [v, arg]);
    await page.waitForTimeout(60);
    const len = await page.evaluate(() => (document.querySelector('#app') || {}).innerText?.trim().length || 0);
    if (len < 40) thin.push(`${where} rendered ${len} chars`);
  }

  await browser.close();

  console.log(`\nwalked ${targets.length} views`);
  const report = (label, list) => {
    if (!list.length) { console.log(`  ok   ${label}`); return 0; }
    console.log(`  FAIL ${label}`);
    for (const x of [...list].slice(0, 40)) console.log(`       ${x}`);
    if (list.length > 40) console.log(`       …and ${list.length - 40} more`);
    return 1;
  };
  let bad = 0;
  bad += report('no console errors', errors);
  bad += report('no missing assets', [...missing]);
  bad += report('no empty views', thin);
  bad += report('no registry promises nothing', registries);
  process.exit(bad ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
