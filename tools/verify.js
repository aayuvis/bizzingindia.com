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
  kosh: 'window.IND_PACKS && Object.keys(window.IND_PACKS)',
  // the word card takes "<packId>:<word>" — walk one from the front, middle and
  // back of every registered lexicon, which is how a card that only breaks on a
  // word with no sentence, or a multi-token word, gets caught
  wordcard: 'Object.keys(window.IND_PACKS || {}).reduce(function(o,k){' +
            'return o.concat((window.IND_PACKS[k].lexicon||[]).map(function(w){return k+":"+w.word}))},[])',
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
    //
    // But a request the BROWSER cancels is not a missing file: the walk navigates fast, and
    // any painting still in flight when the next view renders is aborted mid-download. Those
    // were being reported as 404s — a false alarm that cried wolf about ninety perfectly
    // present paintings. Only genuine failures count.
    const why = (r.failure() || {}).errorText || '';
    if (/ABORTED/i.test(why)) return;
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

  // THE WORD CARD NEVER SHOWS THE WORD WHEN IT IS COVERED (Phase 3, permanent).
  //
  // The card doubles as a flashcard: "Cover it up and test me" hides the word, its
  // romanisation and its voice, and masks the word out of the example sentence. That is a
  // leak rule of the same family as the quiz's, and the honest way to check it is on the
  // rendered page — so this reads the real DOM text after the real click.
  const leaks = [];
  where = 'word card';
  {
    const words = await page.evaluate(() =>
      (window.IND_PACKS.hi.lexicon || []).slice(0, 3).concat((window.IND_PACKS.hi.lexicon || []).slice(200, 203))
        .map(w => w.word));
    for (const w of words) {
      await page.evaluate(x => window.BI.go('wordcard', 'hi:' + x), w);
      await page.waitForTimeout(40);
      const before = await page.evaluate(() => document.querySelector('#app').innerText);
      if (before.indexOf(w) < 0) leaks.push(`face-up card for "${w}" does not show the word`);
      const flipped = await page.evaluate(() => {
        const b = document.querySelector('[data-act="wcflip"]'); if (!b) return false; b.click(); return true;
      });
      if (!flipped) { leaks.push(`word card for "${w}" cannot be covered`); continue; }
      await page.waitForTimeout(40);
      const after = await page.evaluate(() => document.querySelector('#app').innerText);
      if (after.indexOf(w) >= 0) leaks.push(`covered card for "${w}" still prints it on screen`);
      await page.evaluate(() => { const b = document.querySelector('[data-act="wcflip"]'); if (b) b.click(); });
    }
  }

  // NOBODY REAL IS EVER SCORED (permanent).
  //
  // The avatar cards used to give every companion four stats out of 99 and an overall
  // number in the deck — including Mary Kom, Ambedkar, Sita and Karna. A real person is not
  // graded out of 99, and neither is a figure of a living tradition; docs/05 is binding on
  // both counts. What replaces the numbers is achievements (what they actually did) and, in
  // the ten cases where the wording is documented, a quotation WITH its source.
  //
  // This walks EVERY avatar id — all packs plus the three mascots, 100+ cards — and checks
  // the rendered DOM, not the data alone, because the rule only matters where a child can
  // see it. Three things fail here: a number on a person, a person without achievements,
  // and a quotation without an attribution beneath it.
  const scored = [];
  {
    where = 'avatar cards (data)';
    scored.push(...await page.evaluate(() => {
      const out = [];
      const real = window.IND_AV_REAL_PEOPLE || [];
      if (real.length < 40) { out.push('IND_AV_REAL_PEOPLE is missing or suspiciously short'); return out; }
      const ids = (window.IND_AVATAR_PACKS || []).reduce((o, p) => o.concat(p.ids), [])
        .concat(['gattu', 'mithu', 'vismriti']);
      ids.forEach(id => {
        const C = window.IND_AV_CARD(id);
        if (!C) { out.push(`no card for "${id}"`); return; }
        if (C.kind !== 'character' && (C.stats || C.overall !== null))
          out.push(`${C.kind} card "${id}" carries stats`);
        if (C.kind === 'character' && !C.stats) out.push(`character "${id}" lost its stats`);
        if (C.kind === 'real' && !(C.achievements || []).length)
          out.push(`real person "${id}" has no achievements to stand where the numbers were`);
        if (C.quote && !(C.quote.text && C.quote.where)) out.push(`quote on "${id}" names no source`);
        if (C.quote && C.kind !== 'real') out.push(`quote on a ${C.kind} card, "${id}"`);
      });
      real.forEach(id => {
        const C = window.IND_AV_CARD(id);
        if (!C) out.push(`real person "${id}" has no card at all`);
        else if (C.kind !== 'real') out.push(`real person "${id}" resolves as "${C.kind}"`);
      });

      // Stated independently of avatar-cards.js, on purpose. The check above only asks the
      // file to agree with its own list — which stays green if someone quietly drops a
      // person off that list. This says what each PACK is, from outside: everyone in the
      // four people-packs is a real person except the named emblems and anonymous types,
      // the two epic packs are epic throughout, devas is sacred, panch is invented.
      const EXPECT = {
        great: 'real', khel: 'real', vigyan: 'real',
        naya: 'real',      // minus the two emblems below
        darbar: 'real',    // minus the three anonymous court types below
        ramayana: 'epic', mahabharata: 'epic',
        devas: 'sacred', panch: 'character'
      };
      const NOT_PEOPLE = ['rocket', 'unicorn', 'courtier', 'guard', 'royal_elephant'];
      (window.IND_AVATAR_PACKS || []).forEach(p => {
        const want = EXPECT[p.id];
        if (!want) { out.push(`pack "${p.id}" is not covered by the no-scores rule — decide what it is`); return; }
        (p.ids || []).forEach(id => {
          const C = window.IND_AV_CARD(id);
          if (!C) return;
          const expected = NOT_PEOPLE.indexOf(id) >= 0 ? 'character' : want;
          if (C.kind !== expected)
            out.push(`"${id}" in pack "${p.id}" should be ${expected}, resolves as ${C.kind}`);
        });
      });
      return out;
    }));

    const ids = await page.evaluate(() => (window.IND_AVATAR_PACKS || [])
      .reduce((o, p) => o.concat(p.ids), []).concat(['gattu', 'mithu', 'vismriti']));
    for (const id of ids) {
      where = `avcard:${id}`;
      await page.evaluate(i => window.BI.go('avcard', i), id);
      await page.waitForTimeout(20);
      const r = await page.evaluate(i => {
        const C = window.IND_AV_CARD(i), card = document.querySelector('.avcard');
        if (!card) return { none: true };
        const q = card.querySelector('.avquote');
        return {
          kind: C && C.kind,
          bars: card.querySelectorAll('.avstat, .avbar').length,
          deeds: card.querySelectorAll('.avdeeds li').length,
          beyond: card.querySelectorAll('.avbeyond').length,
          quote: q ? (q.querySelector('blockquote') || {}).textContent || '' : null,
          cite: q ? ((q.querySelector('.avcite span') || {}).textContent || '').trim() : null
        };
      }, id);
      if (r.none) { scored.push(`${where}: no card rendered`); continue; }
      if (r.kind === 'real' || r.kind === 'epic') {
        if (r.bars) scored.push(`${where}: a ${r.kind} card renders ${r.bars} stat elements`);
        if (r.beyond) scored.push(`${where}: a ${r.kind} card says "beyond measure"`);
      }
      if (r.kind === 'real' && r.deeds < 2)
        scored.push(`${where}: real person renders ${r.deeds} achievement lines (want 2+)`);
      if (r.kind === 'character' && !r.bars) scored.push(`${where}: character card renders no stats`);
      if (r.kind === 'sacred' && !r.beyond) scored.push(`${where}: sacred card lost "beyond measure"`);
      if (r.quote !== null && (!r.quote.trim() || !r.cite))
        scored.push(`${where}: a quotation renders without an attribution beneath it`);
    }

    // AND THE DECK NEVER GRADES A PERSON EITHER. The deck is a stepper now — one
    // whole card at a time — so walk every card in it and hold each to the same
    // rule the full page is held to: only an invented character shows numbers.
    where = 'the deck popup';
    await page.evaluate(() => window.BI.go('home'));
    await page.waitForTimeout(60);
    const opened = await page.evaluate(() => {
      const b = document.querySelector('[data-act="deck"]'); if (!b) return false; b.click(); return true;
    });
    if (!opened) scored.push('the deck popup has no way to open');
    else {
      await page.waitForTimeout(120);
      const total = await page.evaluate(() =>
        document.querySelector('.avslot') ? (window.IND_AVATAR_PACKS || [])
          .reduce((n, p) => n + ((p.ids || []).length), 0) : 0);
      if (!total) scored.push('the deck rendered no cards');
      // Step the whole run. It wraps, so `total` steps returns to the start and
      // every card in every pack is seen exactly once on the way round.
      for (let i = 0; i < total; i++) {
        scored.push(...await page.evaluate(() => {
          const out = [];
          const card = document.querySelector('.avslot .avcard');
          if (!card) { out.push('a step in the deck rendered no card'); return out; }
          const name = (card.querySelector('h1') || {}).textContent || '(unnamed)';
          const kind = [...card.classList].filter(c => c.indexOf('kind-') === 0)[0] || '';
          const bars = card.querySelectorAll('.avstat').length;
          if (kind && kind !== 'kind-character' && bars)
            out.push(`deck card "${name}" (${kind.slice(5)}) renders ${bars} stat bars`);
          // an unattributed quotation must not reach a child from this side either
          const q = card.querySelector('.avquote blockquote');
          if (q && !card.querySelector('.avcite')) out.push(`deck card "${name}": quotation with no attribution`);
          return out;
        }));
        await page.evaluate(() => {
          const b = document.querySelector('[data-act="deckstep"][data-d="1"]'); if (b) b.click();
        });
        await page.waitForTimeout(8);
      }
      await page.evaluate(() => {
        const b = document.querySelector('[data-act="deckclose"]'); if (b) b.click();
      });
    }
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

  // Answer `count` graded questions correctly through the real UI. Phase 1 put a planned
  // SESSION behind the stage button: introduce beats (teach cards with a Got-it) arrive
  // between graded questions and must be drivable too, and the arc ENDS (quiz.over) after
  // its 12 graded beats instead of running forever. Returns false on any dead end.
  async function driveQuestions(count) {
    for (let k = 0; k < count; k++) {
      // drain introduce beats: each must render its Got-it and move on when tapped
      let intros = 0;
      for (;;) {
        try {
          await page.waitForFunction(() => { const z = window.BI.quizState(); return !!((z.q || z.over) && !z.lock); }, { timeout: 4000 });
        } catch { deadEnds.push(`${where} q#${k}: no question appeared`); return false; }
        const isIntro = await page.evaluate(() => { const z = window.BI.quizState(); return !!(z.q && z.q.type === 'introduce'); });
        if (!isIntro) break;
        if (++intros > 6) { deadEnds.push(`${where} q#${k}: stuck on introduce beats`); return false; }
        const gotit = await page.evaluate(() => {
          const b = document.querySelector('[data-act="gotit"]'); if (b) { b.click(); return true; } return false;
        });
        if (!gotit) { deadEnds.push(`${where} q#${k}: introduce beat without a Got-it button`); return false; }
      }
      const st = await page.evaluate(() => {
        const z = window.BI.quizState(), q = z.q;
        if (!q) return { over: z.over };
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
      if (st.over) { deadEnds.push(`${where} q#${k}: session ended after only ${k} graded questions`); return false; }
      if (!st.nAns && !st.nTiles && !st.hasCanvas) {
        deadEnds.push(`${where} q#${k} type=${st.type}: renders ZERO interactive elements`); return false;
      }

      let answered = true;
      if (st.type === 'trace') {
        // the canvas mounting IS the assertion; then pass it for real: paint the glyph
        // itself as ink (same font call as the guide, so coverage is total either way),
        // flip likhna's drew-flag with a genuine pointer stroke, and press Check.
        if (!st.hasCanvas) { deadEnds.push(`${where} q#${k}: trace question without a canvas`); return false; }
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
      if (!answered) return false;

      // the correct answer must GRADE correct and the session must move on — to the
      // next beat, or to the honest end of the arc
      try {
        await page.waitForFunction(([d, r]) => {
          const z = window.BI.quizState(); return z.done === d + 1 && z.right === r + 1 && !!(z.q || z.over);
        }, [st.done, st.right], { timeout: 4000 });
      } catch {
        const after = await page.evaluate(() => { const z = window.BI.quizState(); return { done: z.done, right: z.right }; });
        deadEnds.push(`${where} q#${k} type=${st.type}: correct answer did not score ` +
          `(done ${st.done}->${after.done}, right ${st.right}->${after.right})`);
        return false;
      }
    }
    return true;
  }

  for (const packId of ['hi', 'pa']) {
    const stages = await page.evaluate(p => (window.IND_PACKS[p] || { stages: [] }).stages.map(s => s.id), packId);
    if (!stages.length) { deadEnds.push(`pack ${packId} has no stages`); continue; }
    for (const sid of stages) {
      where = `winnability ${packId}/${sid}`;
      // enter through the real doors: Bhasha page -> pack tile (resets the quiz) -> stage node
      await page.evaluate(() => window.BI.go('bhasha'));
      await page.evaluate(p => { const b = document.querySelector(`[data-act="pack"][data-id="${p}"]`); if (b) b.click(); }, packId);
      let opened = await page.evaluate(s => {
        const b = document.querySelector(`[data-act="quiz"][data-s="${s}"]`); if (b) { b.click(); return true; } return false;
      }, sid);

      // A LOCKED stage is still never a wall (Phase 2): the node must open the test-out
      // offer, and passing its six questions must unlock the stage for the ordinary walk.
      if (!opened) {
        where = `winnability ${packId}/${sid} (test-out)`;
        const offered = await page.evaluate(s => {
          const b = document.querySelector(`[data-act="testout"][data-s="${s}"]`); if (b) { b.click(); return true; } return false;
        }, sid);
        if (!offered) { deadEnds.push(`${where}: stage has neither a lesson nor a test-out button`); continue; }
        const started = await page.evaluate(s => {
          const b = document.querySelector(`[data-act="totstart"][data-s="${s}"]`); if (b) { b.click(); return true; } return false;
        }, sid);
        if (!started) { deadEnds.push(`${where}: the offer card has no start button`); continue; }
        if (!await driveQuestions(6)) continue;
        // six right of six unlocks: back through the pack page into the stage proper
        where = `winnability ${packId}/${sid}`;
        await page.evaluate(p => { const b = document.querySelector(`[data-act="pack"][data-id="${p}"]`); if (b) b.click(); }, packId);
        opened = await page.evaluate(s => {
          const b = document.querySelector(`[data-act="quiz"][data-s="${s}"]`); if (b) { b.click(); return true; } return false;
        }, sid);
        if (!opened) { deadEnds.push(`${where}: passed the test-out but the stage stayed locked`); continue; }
      }

      await driveQuestions(PER_STAGE);
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
  bad += report('no leaks: a covered word card never shows its word', leaks);
  bad += report('no scores on people: every real and epic card carries deeds, not numbers, ' +
                'and every quotation carries its source', scored);
  bad += report('no dead ends: every Bhasha stage renderable and winnable', deadEnds);
  process.exit(bad ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
