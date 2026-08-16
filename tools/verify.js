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
  kahani: 'window.BI.storyThemes ? window.BI.storyThemes() : []',
  avcard: '(window.IND_AVATAR_PACKS || []).reduce(function(o,p){return o.concat(p.ids)},[])',
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
                'shlok', 'neeti', 'rishtey', 'worlds', 'bhasha', 'me', 'utsav', 'gully', 'nani', 'shelf', 'invite', 'geet',
                'tongue', 'khel'];

async function main() {
  const i = process.argv.indexOf('--url');
  const url = i > -1 ? process.argv[i + 1]
                     : 'file://' + path.join(__dirname, '..', 'app', 'index.html');

  /* In the hosted build environment the browser is pre-installed at a fixed path and the
     npm-installed playwright may be a newer build than the binary on disk — point at the
     binary directly when it exists, and behave normally everywhere else. */
  const fs = require('fs');
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(
    fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
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
    const png = window.IND_ART_IMG || [];   // raster-only avatars (the epic casts) live here
    Object.keys(packs).forEach(p => {
      const ids = packs[p].ids || packs[p];
      (Array.isArray(ids) ? ids : []).forEach(id => {
        if (!art[id] && !svg[id] && png.indexOf(id) < 0)
          out.push(`avatar "${id}" is in pack "${p}" but has no image`);
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

  // NO DEAD ENDS (Phase 0, permanent). The audit that forced the Bhasha rebuild found three
  // stages that were mathematically uncompletable: the renderer drew ZERO buttons for some
  // question shapes and the grader could never accept others, so "12 right answers" was an
  // impossible target that looked like a working quiz. This drives the REAL quiz UI — the
  // same clicks a child makes — for every stage of 'hi' and 'pa', and fails if any question
  // renders nothing to interact with, or if answering correctly does not register as correct.
  const deadEnds = [];
  where = 'winnability';
  // sound off via its real control: the walk should not request voice mp3s
  await page.evaluate(() => { const b = document.querySelector('[data-act="sound"]'); if (b && b.classList.contains('on')) b.click(); });
  // test hook: shrinks the between-questions beat so ~200 answers stay under a minute
  await page.evaluate(() => { window.BI_FAST = true; });
  const PER_STAGE = 12;   // the stage-completion target: prove all 12 are winnable

  for (const packId of ['hi', 'pa']) {
    const stages = await page.evaluate(p => (window.IND_PACKS[p] || { stages: [] }).stages.map(s => s.id), packId);
    if (!stages.length) { deadEnds.push(`pack ${packId} has no stages`); continue; }
    for (const sid of stages) {
      where = `winnability ${packId}/${sid}`;
      // enter through the real doors: Bhasha page -> pack tile (resets the quiz) -> stage node
      await page.evaluate(() => window.BI.go('bhasha'));
      await page.evaluate(p => { const b = document.querySelector(`[data-act="pack"][data-id="${p}"]`); if (b) b.click(); }, packId);
      const opened = await page.evaluate(s => {
        const b = document.querySelector(`[data-act="quiz"][data-s="${s}"]`); if (b) { b.click(); return true; } return false;
      }, sid);
      if (!opened) { deadEnds.push(`${where}: no stage button on the pack page`); continue; }

      for (let k = 0; k < PER_STAGE; k++) {
        try {
          await page.waitForFunction(() => { const z = window.BI.quizState(); return !!(z && z.q && !z.lock); }, { timeout: 4000 });
        } catch { deadEnds.push(`${where} q#${k}: no question appeared`); break; }
        const st = await page.evaluate(() => {
          const z = window.BI.quizState(), q = z.q;
          return {
            type: q.type, done: z.done, right: z.right,
            answerIndex: typeof q.answerIndex === 'number' ? q.answerIndex : null,
            answer: Array.isArray(q.answer) ? q.answer : null,
            letter: q.letter ? q.letter.char : null,
            nAns: document.querySelectorAll('[data-act="ans"]').length,
            nTiles: document.querySelectorAll('.btile').length,
            hasCanvas: !!document.getElementById('tInk'),
          };
        });
        if (!st.nAns && !st.nTiles && !st.hasCanvas) {
          deadEnds.push(`${where} q#${k} type=${st.type}: renders ZERO interactive elements`); break;
        }

        let answered = true;
        if (st.type === 'trace') {
          // the canvas mounting IS the assertion; then pass it for real: paint the glyph
          // itself as ink (same font call as the guide, so coverage is total either way),
          // flip likhna's drew-flag with a genuine pointer stroke, and press Check.
          if (!st.hasCanvas) { deadEnds.push(`${where} q#${k}: trace question without a canvas`); break; }
          await page.evaluate(ch => {
            const c = document.getElementById('tInk').getContext('2d');
            c.fillStyle = '#000'; c.textAlign = 'center'; c.textBaseline = 'middle';
            c.font = '360px Mukta, "Noto Sans Devanagari", sans-serif';
            c.fillText(ch, 256, 268);
          }, st.letter);
          const box = await page.locator('#tInk').boundingBox();
          const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
          await page.mouse.move(cx, cy); await page.mouse.down();
          await page.mouse.move(cx + 6, cy + 3, { steps: 2 }); await page.mouse.up();
          await page.evaluate(() => document.querySelector('[data-act="tcheck"]').click());
        } else if (st.answer && st.nTiles) {
          // ordered build: tap the tiles that spell the answer, in order
          for (const part of st.answer) {
            const tapped = await page.evaluate(p => {
              const b = [...document.querySelectorAll('.btile:not(.used)')].find(x => x.getAttribute('data-ch') === p);
              if (b) { b.click(); return true; } return false;
            }, part);
            if (!tapped) { deadEnds.push(`${where} q#${k} type=${st.type}: no tile for "${part}"`); answered = false; break; }
          }
        } else if (st.answerIndex !== null && st.answerIndex >= 0) {
          const tapped = await page.evaluate(i => {
            const b = document.querySelector(`[data-act="ans"][data-i="${i}"]`); if (b) { b.click(); return true; } return false;
          }, st.answerIndex);
          if (!tapped) { deadEnds.push(`${where} q#${k} type=${st.type}: answerIndex ${st.answerIndex} has no button`); answered = false; }
        } else {
          deadEnds.push(`${where} q#${k} type=${st.type}: no way to answer it (no answerIndex, no ordered answer)`); answered = false;
        }
        if (!answered) break;

        // the correct answer must GRADE correct and the quiz must move on
        try {
          await page.waitForFunction(([d, r]) => {
            const z = window.BI.quizState(); return z.done === d + 1 && z.right === r + 1 && !!z.q;
          }, [st.done, st.right], { timeout: 4000 });
        } catch {
          const after = await page.evaluate(() => { const z = window.BI.quizState(); return { done: z.done, right: z.right }; });
          deadEnds.push(`${where} q#${k} type=${st.type}: correct answer did not score ` +
            `(done ${st.done}->${after.done}, right ${st.right}->${after.right})`);
          break;
        }
      }
    }
  }
  await page.evaluate(() => { window.BI_FAST = false; });

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
  bad += report('no dead ends: every Bhasha stage renderable and winnable', deadEnds);
  process.exit(bad ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
