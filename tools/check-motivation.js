#!/usr/bin/env node
/* Bizzing India — what a child feels: sound, games, medals, celebrations, the five-minute
   session and the locks (FIX-INDIA F3, I4, J1, E1, C4; family standard §8, §9, §10).
   docs/26-motivation.md says why each one exists.

     sfx       a right answer sounds right and a wrong one sounds wrong; the one mute silences both
     games     every game has a title card with a how-to that folds after three seconds and says
               the keyboard works, and a "what you practised" line; Gyanpati, played to the end,
               sounds every answer and the finish and moves on every answer
     currency  no game's own end card names a coin it did not pay
     medals    finishing a story earns a medal and it is celebrated ONCE, with motion and a sound;
               self-reported deeds earn none; the shelf says how to earn the rest
     aaj       Aaj ka runs story → lesson → look back and ENDS on a card that names what was done
     locks     every locked thing on the child's page, the language path and a course says how
               to open it

   Each was watched to fail by breaking the thing it holds (docs/26-motivation.md).
   Run:  node tools/check-motivation.js            # all of them
         node tools/check-motivation.js --only medals
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');
const { driveLesson } = require('./lib/drive-bhasha');

const APP = path.join(__dirname, '..', 'app');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml',
  '.woff2':'font/woff2', '.webmanifest':'application/manifest+json', '.ico':'image/x-icon',
  '.mp3':'audio/mpeg', '.webp':'image/webp' };
function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(APP, p);
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404).end('no'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
const tap = async (p, sel) => { await p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no ' + s); e.click(); }, sel); await p.waitForTimeout(300); };
const played = p => p.evaluate(() => (window.IND_SFX ? window.IND_SFX.played.slice() : []));
const clearPlayed = p => p.evaluate(() => { if (window.IND_SFX) window.IND_SFX.played.length = 0; });
async function finishStory(p) {
  /* the stories load on demand (docs/27): wait for the reader rather than guessing a time */
  await p.waitForSelector('[data-act="next"], [data-act="answer"], [data-act="again"]', { timeout: 20000 }).catch(() => {});
  for (let i = 0; i < 40; i++) {
    if (await p.$('[data-act="again"]')) return;
    const ans = await p.$('[data-act="answer"]');
    if (ans && !(await p.$('[data-act="next"]'))) { await ans.click(); await p.waitForTimeout(120); continue; }
    await tap(p, '[data-act="next"]');
  }
  throw new Error('the story did not end');
}

check('sfx', 'right and wrong sound different, and the one mute silences both', async ({ p }) => {
  await p.mouse.click(5, 5);                    /* a real tap arms audio, as a child's would */
  await tap(p, '[data-bz=tab][data-v="bhasha"]'); await tap(p, '[data-act="pack"][data-id="hi"]'); await tap(p, '.bh-next');
  const ans = async right => {
    for (let k = 0; k < 8; k++) {
      const z = await p.evaluate(() => { const q = window.BI.quizState().q; return q ? { intro: q.type === 'introduce', i: q.answerIndex } : null; });
      if (z && z.intro) { await tap(p, '[data-act="gotit"]'); continue; }
      if (z && typeof z.i === 'number') {
        const n = await p.evaluate(() => document.querySelectorAll('[data-act="ans"]').length);
        await tap(p, `[data-act="ans"][data-i="${right ? z.i : (z.i + 1) % n}"]`); return;
      }
      await p.waitForTimeout(200);
    }
    throw new Error('no option question came up');
  };
  await clearPlayed(p); await ans(false);
  const w = await played(p);
  if (w.indexOf('wrong') < 0) throw new Error('a wrong answer made no sound: ' + JSON.stringify(w));
  await tap(p, '[data-act="qnext"]'); await clearPlayed(p); await ans(true);
  const r = await played(p);
  if (r.indexOf('right') < 0) throw new Error('a right answer made no sound: ' + JSON.stringify(r));
  /* the one mute, in the child's menu */
  /* the one mute is one tap from ☰ (standard v2 §11) */
  await tap(p, '[data-bz=menu]'); await tap(p, '[data-bz=drawer] [data-bz-act=sound]');
  await p.waitForTimeout(1200); await clearPlayed(p);
  await ans(false);
  const m = await played(p);
  if (m.length) throw new Error('the mute is on and these still played: ' + JSON.stringify(m));
});

check('games', 'every game: a title card with a folding how-to; Gyanpati sounds and moves on every answer', async ({ p }) => {
  const ids = await p.evaluate(() => (window.IND_GAMES || []).map(g => g.id));
  const frame = await p.evaluate(() => window.BI.gameFrame);
  const missing = ids.filter(id => !frame[id] || !frame[id][0] || !frame[id][1]);
  if (missing.length) throw new Error('games with no how-to or no "what you practised": ' + missing.join(', '));
  for (const id of ids) {
    if (id === 'sabhyata') continue;          /* a full-screen game window with its own coach */
    await p.evaluate(i => window.BI.go('game', i), id); await p.waitForTimeout(400);
    const t = await p.evaluate(() => { const e = document.getElementById('gftitle');
      return e ? { txt: e.textContent, folded: e.classList.contains('folded') } : null; });
    if (!t || !/keyboard/i.test(t.txt) || t.folded) throw new Error(id + ': no open title card with a how-to and the keys');
    await p.waitForTimeout(3200);
    const f = await p.evaluate(() => document.getElementById('gftitle').classList.contains('folded'));
    if (!f) throw new Error(id + ': the how-to did not fold after three seconds');
  }
  /* Gyanpati to the end: a sound and a motion on every answer, the finish, and what was practised */
  await p.evaluate(() => window.BI.go('game', 'gyanpati')); await p.waitForTimeout(600);
  await clearPlayed(p);
  let motions = 0;
  await p.exposeFunction('__gfMotion', () => { motions++; });
  await p.evaluate(() => { const f = document.getElementById('gframe');
    new MutationObserver(() => { if (/gf-(yes|no)/.test(f.className)) window.__gfMotion(); }).observe(f, { attributes: true, attributeFilter: ['class'] }); });
  let answers = 0;
  for (let k = 0; k < 40; k++) {
    if (await p.$('#gamehost [data-go="out"]')) break;
    const did = await p.evaluate(() => {
      const host = document.getElementById('gamehost'), s = host.__qzState;
      const aage = host.querySelector('[data-go="aage"], [data-go="next"]');
      if (aage) { aage.click(); return 'next'; }
      if (s && s.phase === 'ask') { const o = host.querySelectorAll('.qz-opt')[s.answerIndex]; if (o) { o.click(); host.querySelector('[data-go="lock"]').click(); return 'ans'; } }
      return 'wait';
    });
    if (did === 'ans') answers++;
    await p.waitForTimeout(did === 'wait' ? 400 : 250);
  }
  const end = await p.evaluate(() => ({ out: !!document.querySelector('#gamehost [data-go="out"]'),
    practised: (document.querySelector('#gamehost .gf-practised') || {}).textContent || '' }));
  const pl = await played(p);
  if (!end.out) throw new Error('Gyanpati did not reach its end card');
  if (!/What you practised/.test(end.practised)) throw new Error('the end card does not say what was practised');
  const rights = pl.filter(x => x === 'right').length;
  if (rights < answers) throw new Error(`${answers} answers, ${rights} right sounds`);
  if (pl.indexOf('win') < 0 && pl.indexOf('finish') < 0) throw new Error('the finish made no sound');
  if (motions < answers) throw new Error(`${answers} answers, ${motions} motions`);
}, { reduced: true });

check('currency', 'no game\'s end card names a coin it did not pay', async () => {
  const bad = [];
  fs.readdirSync(APP).filter(f => /^games.*\.js$|^sabhyata\.js$/.test(f)).forEach(f => {
    fs.readFileSync(path.join(APP, f), 'utf8').split('\n').forEach((ln, i) => {
      if (/^\s*(\/\*|\*|\/\/)/.test(ln)) return;
      if (/(<\/b>\s*(kauris|sikke|shells|coins)<|'(kauris|sikke)'\s*\])/i.test(ln)) bad.push(f + ':' + (i + 1));
    });
  });
  if (bad.length) throw new Error('an end card still promises coins: ' + bad.join(', '));
});

check('medals', 'a story earns a medal, celebrated once; self-report earns none; the shelf says how', async ({ p, base }) => {
  /* "I did it", ten times over: the child's own word, never a medal */
  for (let i = 0; i < 3; i++) await p.evaluate(() => { const b = document.querySelector('[data-act="deed"]'); if (b) b.click(); });
  await p.waitForTimeout(300);
  if (await p.$('#celebrate')) throw new Error('a self-reported deed set off a medal');
  await p.mouse.click(5, 5);
  await clearPlayed(p);
  await tap(p, '#main [data-act="cont"]'); await finishStory(p);
  await p.waitForTimeout(1300);
  const c = await p.evaluate(() => { const d = document.getElementById('celebrate');
    return d ? { txt: d.textContent, medal: !!d.querySelector('.medal.bronze, .medal.silver, .medal.gold'),
      anim: getComputedStyle(d.querySelector('.medal')).animationName } : null; });
  if (!c) throw new Error('finishing the first story set off no celebration');
  if (!/First story/.test(c.txt) || !c.medal) throw new Error('the celebration does not name the medal: ' + c.txt);
  if (!c.anim || c.anim === 'none') throw new Error('the medal does not move');
  if ((await played(p)).indexOf('medal') < 0) throw new Error('the medal made no sound');
  if (/other|than .* (friend|child)|leaderboard|rank(ed)? #/i.test(c.txt)) throw new Error('the celebration compares children');
  await tap(p, '[data-act="celok"]');
  /* once: a reload and another story bring no second "First story" */
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await tap(p, '#main [data-act="cont"]'); await finishStory(p); await p.waitForTimeout(1300);
  const again = await p.evaluate(() => (document.getElementById('celebrate') || {}).textContent || '');
  if (/First story/.test(again)) throw new Error('"First story" was celebrated twice');
  /* the shelf */
  await p.evaluate(() => { const c = document.getElementById('celebrate'); if (c) c.remove(); window.BI.go('me'); });
  await p.waitForTimeout(400);
  const sh = await p.evaluate(() => [...document.querySelectorAll('.mdcell')].map(x => ({ locked: x.classList.contains('locked'), t: x.textContent })));
  if (!sh.length || !sh.some(x => !x.locked && /First story/.test(x.t))) throw new Error('the shelf does not hold the earned medal');
  const mute = sh.filter(x => x.locked && !/How to earn it/.test(x.t));
  if (mute.length) throw new Error('an unearned medal does not say how to earn it');
});

check('aaj', 'Aaj ka: a story, a lesson, a look back, and a card that names what was done', async ({ p }) => {
  await tap(p, '[data-bz=tip]');
  if (!(await p.$('.aajsteps'))) throw new Error('the Aaj ka tile does not open the session');
  await tap(p, '[data-act="aajstep"][data-s="0"]');
  const title = await p.evaluate(() => window.BI.S.aaj.story);
  await finishStory(p);
  await p.evaluate(() => { const c = document.getElementById('celebrate'); if (c) c.remove(); });
  if (!(await p.$('.aajbar'))) throw new Error('the story does not show where the session is');
  await tap(p, '.aajbar [data-act="go"]');
  await tap(p, '[data-act="aajstep"][data-s="1"]');
  await driveLesson(p);
  await p.evaluate(() => { const c = document.getElementById('celebrate'); if (c) c.remove(); });
  await tap(p, '.aajbar [data-act="go"]');
  for (let i = 0; i < 4 && (await p.$('[data-act="aajpick"]')); i++) {
    await tap(p, '[data-act="aajpick"][data-o="0"]');
    const held = await p.$('[data-act="aajnext"]');
    if (!held) throw new Error('a look-back answer did not wait for Continue');
    await tap(p, '[data-act="aajnext"]');
  }
  const d = await p.evaluate(() => ({ done: !!document.querySelector('.aajdone'), txt: (document.querySelector('.aajdone') || {}).textContent || '',
    met: window.BI.S.aaj.met, end: window.BI.S.aaj.end }));
  if (!d.done || !d.end) throw new Error('the session did not end on a finish card');
  const st = await p.evaluate(id => { const all = window.BI.allStories(); return (all.find(x => x.id === id) || {}).title; }, title);
  if (d.txt.indexOf(st) < 0) throw new Error('the finish card does not name the story');
  if (!d.met.length || !d.met.every(m => d.txt.indexOf(m) >= 0)) throw new Error('the finish card does not name what was met');
  await tap(p, '.aajdone [data-act="go"]');
  const tile = await p.evaluate(() => (document.querySelector('[data-bz=tip]') || {}).textContent || '');
  if (!/Done for today/.test(tile)) throw new Error('Home does not say today\'s five minutes are done');
});

check('locks', 'every locked thing says how to open it', async ({ p }) => {
  const HOW = /open|unlock|coins|🪙|test out|pass|after|how to earn|grown-up|master|choose|meet/i;
  const scan = async where => p.evaluate(([w, how]) => {
    const re = new RegExp(how, 'i');
    return [...document.querySelectorAll('#main .locked, #main .shut, #main .pa-lock, #main .avlocked')]
      .filter(e => e.offsetParent !== null)
      /* the outermost lock only: a medallion inside a labelled locked stop is decoration */
      .filter(e => !(e.parentElement && e.parentElement.closest('.locked, .shut, .pa-lock, .avlocked')))
      .filter(e => !re.test(e.textContent || ''))
      .map(e => w + ': ' + (e.textContent || '').trim().slice(0, 60));
  }, [where, HOW.source]);
  const bad = [];
  await p.evaluate(() => window.BI.go('me')); await p.waitForTimeout(400); bad.push(...await scan('me'));
  await p.evaluate(() => window.BI.go('worlds')); await p.waitForTimeout(400); bad.push(...await scan('worlds'));
  await p.evaluate(() => window.BI.go('pack', 'hi')); await p.waitForTimeout(400); bad.push(...await scan('bhasha'));
  await p.evaluate(() => window.BI.go('paath')); await p.waitForTimeout(400); bad.push(...await scan('paathshala'));
  await p.evaluate(() => window.BI.go('paath', 'neeti-course')); await p.waitForTimeout(400); bad.push(...await scan('course'));
  const seen = await p.evaluate(() => document.querySelectorAll('#main .locked, #main .shut').length);
  if (!seen) throw new Error('no locked thing was found to check — the scan is looking in the wrong place');
  if (bad.length) throw new Error(bad.length + ' locks that do not say how to open: ' + bad.slice(0, 3).join(' | '));
});

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, serviceWorkers: 'block',
      reducedMotion: c.reduced ? 'reduce' : 'no-preference' });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      await skipOnboarding(p);
      await p.waitForTimeout(300);
      await c.fn({ p, ctx, base });
      if (errs.length) throw new Error('page error: ' + errs[0]);
      console.log(`  ok   ${c.id.padEnd(9)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(9)} ${c.what}\n         ${String(e.message).split('\n')[0]}`); fail++;
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
