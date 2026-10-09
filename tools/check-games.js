#!/usr/bin/env node
/* Bizzing India — the shared game host (games spec §1, §3.1, §8; docs/32-games-contract.md).
   ==================================================================================
   The host is tested on its own, with FAKE engines registered from the test page, so a host
   bug can never hide behind an engine and an engine change can never make these pass.

     opts      the engine gets { skin, level, band, scope, answer, calm, reduced }, each its type
     counter   T2: "N right this game" is the engine's first-try rights, exactly; a retry, a late
               right and a second report for one item do not count; a game with no reports
               shows no counter, and its finish card no tally
     tap       the first tap on the board lands: the how-to folds on the click, never between the
               press and the release (it moved the board under the finger)
     sound     T3: one report, one sound — right or wrong — and nothing else while playing
     nopay     T4: a 0/10 round earns 0 and finishing pays 0; a heritage game's win pays 0 and
               says "Played for fun — no coins"; 0 of N never celebrates
     bot       T1: a random bot over 20 rounds earns exactly what its first-try rights justify
               (once per item a day, ≤ 10 a round) and an all-wrong bot earns 0
     caps      ≤ 10 coins a round, an item pays once a day and again the next day; Gyanpati's
               rung 10+ without lifelines pays `contest` once a day, never with a lifeline
     level     T7: the chip (touch and keys 1–5, Enter), default = last level played; 40% drops
               one, 60% keeps, 85% OFFERS the next (never forces it); never below 1; an unscored
               round keeps the level and says it was not scored
     lineup    T16: Play shows ≤ 13 game cards in the spec's groups, none of Trivia Master,
               Saap-Sidi, Kancha, Gutte or the Rishtey quiz; each card has its subtitle; heritage
               cards say "for fun · no coins"; one in, one out (a replacement in review waits,
               released it takes its legacy's slot); hidden ids never dead-end
     best      a best kept in the old points (before the quizzes scored first-try rights) is
               dropped once; any other best stays
     fold      T18: on a 390 × 844 phone the level chips, Start, the miss card's Aage and the
               finish card's buttons sit above the tab bar, each ≥ 44 px
     contract  the class-watching is gone and finishing pays nothing (read from the source)

   Each was watched to fail by breaking the thing it holds.
   Run:  CHROME=/opt/pw-browsers/chromium node tools/check-games.js [--only level]
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');

/* BI_APP points the server at another copy of app/ — how each check here was watched to fail */
const APP = process.env.BI_APP ? path.resolve(process.env.BI_APP) : path.join(__dirname, '..', 'app');
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

const DESK = { width: 1280, height: 860 }, PHONE = { width: 390, height: 844 };
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
const LEVELS = ['big ones by name', 'capitals', 'clues', 'neighbours', 'rivers'];

/* FAKE ENGINES, registered from the page. Each keeps its live controls in window.__ctl[id]:
   the opts it was given, its done(), how often it was torn down. `tall` draws a board taller
   than a phone, for the fold check. */
async function fakes(p) {
  await p.evaluate(async L => {
    await window.IND_LOAD(['games']);
    window.__ctl = {};
    const reg = (id, o) => {
      window.IND_GAMES = window.IND_GAMES.filter(g => g.id !== id);
      window.IND_GAMES.push(Object.assign({ id, name: 'Fake ' + id, sub: 'a test engine', blurb: 'A test engine.', minutes: 1,
        how: 'Answer what is asked.', practised: 'Testing the host.',
        engine(host, opts, done) {
          const c = window.__ctl[id] = { opts, done, torn: 0, mounts: ((window.__ctl[id] || {}).mounts || 0) + 1 };
          host.innerHTML = '<div class="fk-board" style="padding:8px">' +
            '<p class="fk-q">Question</p><button type="button" class="fk-tap" style="height:40px">Tap</button>' +
            (o && o.tall ? '<div class="fk-tall" style="height:1400px"></div>' : '') + '</div>';
          host.querySelector('.fk-tap').addEventListener('click', () => opts.answer({ id: 'tap', right: true, firstTry: true }));
          return () => { c.torn++; };
        } }, o || {}));
    };
    window.__reg = reg;
    reg('fakeq', { teaches: true, levels: L });
    reg('fakenl', { teaches: true });
    reg('fakeh', { teaches: false });
  }, LEVELS);
}
const open = async (p, id) => { await p.evaluate(i => window.BI.go('game', i), id); await p.waitForTimeout(250); };
const start = async p => { await p.evaluate(() => { const b = document.querySelector('#gamehost [data-gmh="start"]'); if (b) b.click(); }); await p.waitForTimeout(120); };
/* report a round: items = [{id, right, firstTry}], spaced past the sound engine's 120 ms merge */
const report = (p, id, items, gap) => p.evaluate(async ([id, items, gap]) => {
  for (const r of items) { window.__ctl[id].opts.answer(r); if (gap) await new Promise(z => setTimeout(z, gap)); }
}, [id, items, gap || 0]);
const finish = (p, id, res) => p.evaluate(([id, res]) => window.__ctl[id].done(res), [id, res || {}]);
const coins = p => p.evaluate(() => window.BI.coins());
const finText = p => p.evaluate(() => { const f = document.querySelector('#gamehost .gf-finish'); return f ? f.innerText : null; });
const R = (n, right, pre) => Array.from({ length: n }, (_, i) => ({ id: (pre || 'q') + i, right, firstTry: true }));

check('opts', 'the engine gets skin, level, band, scope, answer, calm and reduced', async ({ p }) => {
  await fakes(p); await open(p, 'fakenl');
  const o = await p.evaluate(() => { const o = window.__ctl.fakenl.opts;
    return { keys: Object.keys(o).sort().join(','), skin: o.skin, level: o.level, band: o.band, scope: o.scope,
             answer: typeof o.answer, calm: typeof o.calm, reduced: typeof o.reduced }; });
  for (const k of ['answer', 'band', 'calm', 'level', 'reduced', 'scope', 'skin'])
    if (!o.keys.split(',').includes(k)) throw new Error('opts has no ' + k + ': ' + o.keys);
  if (o.answer !== 'function') throw new Error('opts.answer is not a function');
  if (!(o.level >= 1 && o.level <= 5)) throw new Error('opts.level is ' + o.level);
  if (!['4-7', '8-10', '11-12'].includes(o.band)) throw new Error('opts.band is ' + o.band);
  if (o.scope !== null) throw new Error('a plain game was given a scope');
  if (o.calm !== 'boolean' || o.reduced !== 'boolean') throw new Error('calm/reduced are not booleans');
});

check('counter', 'the counter is the engine\'s first-try rights; no reports, no counter', async ({ p }) => {
  await fakes(p); await open(p, 'fakenl');
  if (await p.$('#gframe .gf-rights')) throw new Error('a counter shows before any answer');
  /* 4 first-try rights, 2 misses, 1 right only on a retry, and a repeat report of q0 */
  await report(p, 'fakenl', [...R(4, true), { id: 'm1', right: false, firstTry: true }, { id: 'm2', right: false, firstTry: true },
    { id: 'late', right: true, firstTry: false }, { id: 'q0', right: true, firstTry: true }]);
  const c = await p.evaluate(() => (document.querySelector('#gframe .gf-rights') || {}).textContent || '');
  if (!/^4 right this game$/.test(c.trim())) throw new Error(`4 first-try rights reported, the counter says "${c}"`);
  await finish(p, 'fakenl', { win: true, score: 4, asked: 7, firstTryRight: 4 });
  const t = await finText(p);
  if (!t) throw new Error('no finish card');
  if (!/4 of 7 right first time/.test(t)) throw new Error('the finish card does not say 4 of 7 right first time: ' + t.replace(/\s+/g, ' ').slice(0, 160));
  /* a game that never reports: no counter, no tally */
  await open(p, 'fakeh');
  await finish(p, 'fakeh', { win: true, score: 3 });
  const h = await p.evaluate(() => ({ c: !!document.querySelector('#gframe .gf-rights'), t: (document.querySelector('#gamehost .gf-finish') || {}).innerText || '' }));
  if (h.c) throw new Error('a game with no answers shows a counter');
  if (/right first time|right this game/.test(h.t)) throw new Error('a game with no answers claims rights: ' + h.t.slice(0, 120));
});

check('tap', 'a tap on the board in the first three seconds lands — the how-to folds on the click, not the press', async ({ p }) => {
  await fakes(p); await open(p, 'fakenl');
  const folded0 = await p.evaluate(() => document.getElementById('gftitle').classList.contains('folded'));
  if (folded0) throw new Error('the how-to was already folded — nothing to test');
  await p.click('#gamehost .fk-tap');
  await p.waitForTimeout(150);
  const r = await p.evaluate(() => ({ c: (document.querySelector('#gframe .gf-rights') || {}).textContent || '',
    folded: document.getElementById('gftitle').classList.contains('folded') }));
  if (!/^1 right this game$/.test(r.c.trim())) throw new Error('a tap on the board in the first seconds was lost: "' + r.c + '"');
  if (!r.folded) throw new Error('the first tap on the board did not fold the how-to');
  /* the three seconds run out while a finger is down: the fold waits for the release, so the
     press still lands where it began */
  await open(p, 'fakenl');
  const box = await (await p.$('#gamehost .fk-tap')).boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.mouse.down(); await p.waitForTimeout(3400); await p.mouse.up();
  await p.waitForTimeout(150);
  const h = await p.evaluate(() => ({ c: (document.querySelector('#gframe .gf-rights') || {}).textContent || '',
    folded: document.getElementById('gftitle').classList.contains('folded') }));
  if (!/^1 right this game$/.test(h.c.trim())) throw new Error('a press held across the three seconds was lost: "' + h.c + '"');
  if (!h.folded) throw new Error('the how-to never folded after a held press');
});

check('sound', 'one report is one sound, and nothing else plays while answering', async ({ p }) => {
  await p.mouse.click(5, 5);
  await fakes(p); await open(p, 'fakenl');
  await p.evaluate(() => { window.IND_SFX.played.length = 0; });
  const items = [true, false, true, true, false, false].map((r, i) => ({ id: 's' + i, right: r, firstTry: true }));
  await report(p, 'fakenl', items, 160);
  const pl = await p.evaluate(() => window.IND_SFX.played.slice());
  const want = items.map(r => r.right ? 'right' : 'wrong');
  if (JSON.stringify(pl) !== JSON.stringify(want)) throw new Error(`six reports, the sounds were ${JSON.stringify(pl)}`);
});

check('nopay', 'a 0/10 round and finishing pay 0; a heritage win pays 0; 0 of N never celebrates', async ({ p }) => {
  await fakes(p);
  const c0 = await coins(p);
  await open(p, 'fakenl');
  await report(p, 'fakenl', R(10, false));
  await finish(p, 'fakenl', { win: true, score: 0, asked: 10, firstTryRight: 0 });
  const t = await finText(p), c1 = await coins(p);
  if (c1 !== c0) throw new Error(`a 0 of 10 round (finished, "won") paid ${c1 - c0} coins`);
  if (/Shabash|you did it/i.test(t)) throw new Error('0 of 10 is celebrated: ' + t.slice(0, 80));
  if (/coins? for finishing/i.test(t)) throw new Error('the finish card still pays for finishing');
  await open(p, 'fakeh');
  await finish(p, 'fakeh', { win: true, score: 9 });
  const h = await finText(p), c2 = await coins(p);
  if (c2 !== c0) throw new Error(`a heritage game's win paid ${c2 - c0} coins`);
  if (!/Played for fun — no coins/.test(h)) throw new Error('a heritage finish does not say it is for fun: ' + h.slice(0, 120));
  /* a heritage game that reports anyway is still not paid */
  await open(p, 'fakeh'); await report(p, 'fakeh', R(5, true, 'h')); await finish(p, 'fakeh', { win: true });
  if ((await coins(p)) !== c0) throw new Error('a heritage game was paid for its reports');
});

check('bot', 'a random bot earns only what its first-try rights justify; an all-wrong bot earns 0', async ({ p }) => {
  await fakes(p);
  const c0 = await coins(p);
  /* the all-wrong bot, 20 rounds */
  for (let r = 0; r < 20; r++) {
    await open(p, 'fakenl'); await report(p, 'fakenl', R(10, false, 'w' + r + '-')); await finish(p, 'fakenl', { score: 0 });
  }
  if ((await coins(p)) !== c0) throw new Error('an all-wrong bot earned ' + ((await coins(p)) - c0));
  /* the random bot: four options, one right; 20 rounds of 10 items from a pool of 30 */
  let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const paid = new Set(); let want = 0, rights = 0;
  for (let r = 0; r < 20; r++) {
    const items = Array.from({ length: 10 }, () => ({ id: 'p' + Math.floor(rnd() * 30), right: Math.floor(rnd() * 4) === 0, firstTry: true }));
    const seen = new Set(); let n = 0;
    for (const it of items) {
      if (seen.has(it.id)) continue; seen.add(it.id);
      if (!it.right) continue; rights++;
      if (n < 10 && !paid.has(it.id)) { paid.add(it.id); n++; want++; }
    }
    await open(p, 'fakenl'); await report(p, 'fakenl', items); await finish(p, 'fakenl', { score: 0 });
  }
  const got = (await coins(p)) - c0;
  if (got > rights) throw new Error(`the random bot earned ${got} on ${rights} first-try rights`);
  if (got !== want) throw new Error(`the random bot earned ${got}; once per item a day, ≤ 10 a round, it should be ${want}`);
});

check('caps', '≤ 10 a round, once per item a day (again the next day); Gyanpati\'s ladder once a day, never with a lifeline', async ({ p }) => {
  await fakes(p);
  const c0 = await coins(p);
  await open(p, 'fakenl'); await report(p, 'fakenl', R(15, true)); await finish(p, 'fakenl', {});
  const c1 = await coins(p), t1 = await finText(p);
  if (c1 - c0 !== 10) throw new Error(`15 first-try rights in a round paid ${c1 - c0}, not 10`);
  if (!/\+10 coins/.test(t1)) throw new Error('the finish card does not say what was paid: ' + t1.slice(0, 160));
  await open(p, 'fakenl'); await report(p, 'fakenl', R(15, true)); await finish(p, 'fakenl', {});
  const c2 = await coins(p);
  if (c2 - c1 !== 5) throw new Error(`the same 15 again paid ${c2 - c1}; only the 5 not yet paid today should`);
  await open(p, 'fakenl'); await report(p, 'fakenl', R(15, true)); await finish(p, 'fakenl', {});
  const c3 = await coins(p);
  if (c3 !== c2) throw new Error(`a third time paid ${c3 - c2}: an item pays once a day`);
  /* tomorrow: the same items pay again (the wallet's own day is moved too, so its lid is not what is tested) */
  await p.evaluate(() => { window.BI.S.gpay.day = '2000-01-01'; });
  await open(p, 'fakenl'); await report(p, 'fakenl', R(3, true)); await finish(p, 'fakenl', {});
  if ((await coins(p)) - c3 !== 3) throw new Error('a new day did not pay the same items again');
  /* the ladder: a fake Gyanpati */
  await p.evaluate(() => window.__reg('gyanpati', { teaches: true, name: 'Kaun Banega Gyanpati?' }));
  const ladder = async res => { const a = await coins(p); await open(p, 'gyanpati'); await finish(p, 'gyanpati', res); return (await coins(p)) - a; };
  const l1 = await ladder({ rung: 9, lifelines: 0 });
  const l2 = await ladder({ rung: 12, lifelines: 1 });
  const l3 = await ladder({ rung: 10, lifelines: 0 });
  const l4 = await ladder({ rung: 15, lifelines: 0 });
  if (l1 || l2) throw new Error(`rung 9 paid ${l1}, rung 12 with a lifeline paid ${l2}`);
  if (l3 !== 10) throw new Error(`rung 10 with no lifelines paid ${l3}, not the contest's 10`);
  if (l4) throw new Error(`a second ladder the same day paid ${l4}`);
  /* Trivia Master is a door into Gyanpati: the same question cannot pay again through it */
  await p.evaluate(() => window.__reg('triviamaster', { teaches: true, hide: true }));
  const a0 = await coins(p);
  await open(p, 'gyanpati'); await report(p, 'gyanpati', R(3, true, 'tq')); await finish(p, 'gyanpati', {});
  const a1 = await coins(p);
  await open(p, 'triviamaster'); await report(p, 'triviamaster', R(3, true, 'tq')); await finish(p, 'triviamaster', {});
  const a2 = await coins(p);
  if (a1 - a0 !== 3 || a2 !== a1) throw new Error(`three rights paid ${a1 - a0} in Gyanpati and ${a2 - a1} more through Trivia Master`);
});

check('level', 'the chip by touch and keys; 40% drops one, 60% keeps, 85% offers the next, never below 1', async ({ p }) => {
  await fakes(p); await open(p, 'fakeq');
  const panel = await p.evaluate(() => ({ chips: [...document.querySelectorAll('#gamehost .gm-lvl')].map(b => b.textContent),
    on: (document.querySelector('#gamehost .gm-lvl.on') || {}).getAttribute ? document.querySelector('#gamehost .gm-lvl.on').getAttribute('data-l') : null,
    mounted: !!window.__ctl.fakeq }));
  if (panel.chips.length !== 5) throw new Error(`the start panel has ${panel.chips.length} level chips`);
  if (!panel.chips[2].includes('clues')) throw new Error('a chip does not say what its level means: ' + panel.chips[2]);
  if (panel.on !== '1') throw new Error('a first game does not default to level 1');
  if (panel.mounted) throw new Error('the engine mounted before the child chose a level');
  /* keys: 3 then Enter */
  await p.keyboard.press('3'); await p.keyboard.press('Enter'); await p.waitForTimeout(120);
  let lv = await p.evaluate(() => window.__ctl.fakeq && window.__ctl.fakeq.opts.level);
  if (lv !== 3) throw new Error('pressing 3 and Enter started level ' + lv);
  /* 40%: drops to 2, no offer */
  await report(p, 'fakeq', [...R(4, true), ...R(6, false, 'x')]); await finish(p, 'fakeq', {});
  let st = await p.evaluate(() => ({ l: window.BI.S.lvl.fakeq, up: !!document.querySelector('#gamehost [data-gmh="up"]') }));
  if (st.l !== 2) throw new Error(`40% at level 3 left the level at ${st.l}, not 2`);
  if (st.up) throw new Error('40% was offered the next level');
  /* Play again: the chip defaults to the level now held; touch picks Start */
  await p.click('#gfagain'); await p.waitForTimeout(250);
  const on = await p.evaluate(() => document.querySelector('#gamehost .gm-lvl.on').getAttribute('data-l'));
  if (on !== '2') throw new Error('the chip does not default to the last level (' + on + ')');
  await p.click('#gamehost [data-gmh="start"]'); await p.waitForTimeout(120);
  /* 60%: keeps 2, no offer */
  await report(p, 'fakeq', [...R(6, true), ...R(4, false, 'x')]); await finish(p, 'fakeq', {});
  st = await p.evaluate(() => ({ l: window.BI.S.lvl.fakeq, up: !!document.querySelector('#gamehost [data-gmh="up"]') }));
  if (st.l !== 2 || st.up) throw new Error(`60% at level 2: level ${st.l}, offer ${st.up} — it should keep 2 and offer nothing`);
  /* 85%: an offer, not a move */
  await p.click('#gfagain'); await p.waitForTimeout(250);
  await p.click('#gamehost .gm-lvl[data-l="2"]'); await p.click('#gamehost [data-gmh="start"]'); await p.waitForTimeout(120);
  await report(p, 'fakeq', [...R(17, true), ...R(3, false, 'x')]); await finish(p, 'fakeq', {});
  st = await p.evaluate(() => ({ l: window.BI.S.lvl.fakeq, up: (document.querySelector('#gamehost [data-gmh="up"]') || {}).textContent || '' }));
  if (!/Try level 3\?/.test(st.up)) throw new Error('85% at level 2 was not offered level 3');
  if (st.l !== 2) throw new Error(`85% moved the level to ${st.l} by itself — an offer is never forced`);
  await p.click('#gamehost [data-gmh="up"]'); await p.waitForTimeout(300);
  lv = await p.evaluate(() => ({ l: window.__ctl.fakeq.opts.level, s: window.BI.S.lvl.fakeq, panel: !!document.querySelector('#gamehost .gm-start') }));
  if (lv.l !== 3 || lv.s !== 3 || lv.panel) throw new Error(`taking the offer started level ${lv.l} (stored ${lv.s}, panel ${lv.panel})`);
  /* 0% at level 1 stays at 1 */
  await finish(p, 'fakeq', {});
  await p.evaluate(() => { window.BI.S.lvl.fakeq = 1; });
  await open(p, 'fakeq'); await start(p);
  await report(p, 'fakeq', R(5, false)); await finish(p, 'fakeq', {});
  if ((await p.evaluate(() => window.BI.S.lvl.fakeq)) !== 1) throw new Error('a level dropped below 1');
  /* an unscored round (Panchang's explore modes: done({asked:0, unscored:true})) keeps the level,
     offers nothing, and says it was not scored */
  await p.evaluate(() => { window.BI.S.lvl.fakeq = 4; });
  await open(p, 'fakeq'); await start(p);
  await finish(p, 'fakeq', { asked: 0, unscored: true });
  const un = await p.evaluate(() => ({ l: window.BI.S.lvl.fakeq, up: !!document.querySelector('#gamehost [data-gmh="up"]'),
    t: (document.querySelector('#gamehost .gf-finish') || {}).innerText || '' }));
  if (un.l !== 4 || un.up) throw new Error(`an unscored round moved the level to ${un.l} (offer ${un.up})`);
  if (!/not scored/.test(un.t) || /Shabash/.test(un.t)) throw new Error('an unscored round does not say so: ' + un.t.slice(0, 160));
});

check('lineup', 'Play: ≤ 13 cards in groups, none retired, each with a subtitle; one in, one out; no dead ends', async ({ p }) => {
  await p.evaluate(() => window.IND_LOAD(['games']));
  const hub = () => p.evaluate(async () => {
    window.BI.go('play'); await window.BI.ready(); await new Promise(r => setTimeout(r, 120));
    const m = document.getElementById('main');
    const ids = [...m.querySelectorAll('.ghero[data-id], .gcover[data-act="game"]')].map(b => b.getAttribute('data-id'));
    const covers = [...m.querySelectorAll('.gcover[data-act="game"]')].map(b => ({ id: b.getAttribute('data-id'),
      sub: (b.querySelector('.gsub') || {}).textContent || '', mono: (b.querySelector('.mono') || {}).textContent || '' }));
    return { ids, covers, heads: [...m.querySelectorAll('.shelfhead h3')].map(h => h.textContent),
             rishtey: !!m.querySelector('[data-v="rishtey"], [data-act="rishquiz"]') };
  });
  const a = await hub();
  if (a.ids.length > 13) throw new Error(`Play shows ${a.ids.length} game cards — the most is 13`);
  if (new Set(a.ids).size !== a.ids.length) throw new Error('a game has two cards: ' + a.ids.join(','));
  const gone = ['triviamaster', 'saapsidi', 'kancha', 'gutte'].filter(x => a.ids.includes(x));
  if (gone.length) throw new Error('retired cards are on Play: ' + gone.join(', '));
  if (a.rishtey) throw new Error('the Rishtey quiz is still offered from Play');
  for (const h of ['Flagships', 'Know', 'Map · Time · Calendar', 'Language', 'Story and art', 'Aangan ke khel'])
    if (!a.heads.includes(h)) throw new Error('no "' + h + '" group on Play: ' + a.heads.join(' | '));
  const nosub = a.covers.filter(c => !c.sub.trim()).map(c => c.id);
  if (nosub.length) throw new Error('cards with no English subtitle: ' + nosub.join(', '));
  const HER = ['ludo', 'carrom', 'pallanguzhi'];
  const fun = a.covers.filter(c => HER.includes(c.id)), teach = a.covers.filter(c => !HER.includes(c.id));
  if (fun.length !== 3) throw new Error('the courtyard games are not all on Play: ' + fun.map(c => c.id).join(','));
  if (fun.some(c => !/for fun · no coins/.test(c.mono))) throw new Error('a heritage card does not say "for fun · no coins"');
  if (teach.some(c => /no coins/.test(c.mono))) throw new Error('a teaching card says it pays no coins');
  /* one in, one out: a replacement in review waits; released, it takes the slot; a stray engine never shows */
  await p.evaluate(() => {
    const mk = (id, review) => ({ id, name: 'New ' + id, sub: 'test', blurb: '', review, teaches: true, engine: h => { h.innerHTML = '<p>new</p>'; } });
    window.IND_GAMES.push(mk('naksha', true), mk('zzstray', false));
  });
  const b = await hub();
  if (!b.ids.includes('statehunt') || b.ids.includes('naksha')) throw new Error('a replacement still in review took its slot: ' + b.ids.join(','));
  if (b.ids.includes('zzstray') || b.ids.length !== a.ids.length) throw new Error('a registered engine in no slot changed the shelf: ' + b.ids.join(','));
  /* a registration marked `hide` never takes a slot, even its own */
  await p.evaluate(() => { const g = window.IND_GAMES.find(x => x.id === 'carrom'); if (g) g.hide = true; });
  const hd = await hub();
  await p.evaluate(() => { const g = window.IND_GAMES.find(x => x.id === 'carrom'); if (g) delete g.hide; });
  if (hd.ids.includes('carrom')) throw new Error('a game marked hide is on Play');
  /* tester mode sees the one in review, in the legacy's slot */
  await p.evaluate(() => window.BI.Store.saveDevice('tester', true));
  const t = await hub();
  if (!t.ids.includes('naksha') || t.ids.includes('statehunt') || t.ids.length !== a.ids.length) throw new Error('in tester mode the replacement did not take the slot: ' + t.ids.join(','));
  await p.evaluate(() => window.BI.Store.saveDevice('tester', false));
  await p.evaluate(() => { window.IND_GAMES.find(g => g.id === 'naksha').review = false; });
  const c = await hub();
  if (!c.ids.includes('naksha') || c.ids.includes('statehunt')) throw new Error('a released replacement did not take its legacy\'s slot: ' + c.ids.join(','));
  if (c.ids.length !== a.ids.length) throw new Error(`one in, one out: ${a.ids.length} cards became ${c.ids.length}`);
  /* hidden and retired ids never dead-end */
  for (const id of ['triviamaster', 'saapsidi', 'kancha', 'gutte', 'statehunt', 'nosuchgame']) {
    await p.evaluate(i => window.BI.go('game', i), id); await p.evaluate(() => window.BI.ready()); await p.waitForTimeout(150);
    /* a frame counts only with a game in it: an empty frame under a back pill is a dead end */
    const r = await p.evaluate(() => { const h = document.querySelector('#gframe #gamehost');
      return { frame: !!(h && document.getElementById('gftitle') && h.children.length), hub: !!document.querySelector('#main .gcover'),
               title: (document.querySelector('#gftitle b') || {}).textContent || '' }; });
    if (!r.frame && !r.hub) throw new Error('#/game/' + id + ' is a dead end');
    if (id === 'statehunt' && r.title !== 'New naksha') throw new Error('#/game/statehunt did not open its released replacement: ' + r.title);
  }
});

check('best', 'a best kept in the old points is dropped once; other bests stay; a new best is kept', async ({ p, base }) => {
  await p.evaluate(() => { const S = window.BI.S; S.best = { statehunt: 640, festival: 300, jataka: 90, carrom: 7 }; delete S.bestV; window.BI.Store.saveProfile(S); });
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  await fakes(p);
  await p.evaluate(async () => { window.BI.go('play'); await window.BI.ready(); await new Promise(r => setTimeout(r, 150)); });
  const r = await p.evaluate(() => ({ best: Object.assign({}, window.BI.S.best), sh: (document.querySelector('.gcover[data-id="statehunt"] .mono') || {}).textContent || '' }));
  if ('statehunt' in r.best || 'festival' in r.best || 'jataka' in r.best) throw new Error('a best in the old points survived: ' + JSON.stringify(r.best));
  if (r.best.carrom !== 7) throw new Error('a best that kept its meaning was dropped: ' + JSON.stringify(r.best));
  if (/your best/.test(r.sh)) throw new Error('the State Hunt stall still shows an old best: ' + r.sh);
  /* and a new one is kept, and not dropped again */
  await p.evaluate(() => { window.BI.S.best.statehunt = 5; });
  await p.evaluate(async () => { window.BI.go('play'); await window.BI.ready(); });
  if ((await p.evaluate(() => window.BI.S.best.statehunt)) !== 5) throw new Error('a best made after the change was dropped');
});

check('fold', 'on a 390 × 844 phone the chips, Start, Aage and the finish buttons are above the tab bar, ≥ 44 px', async ({ p }) => {
  await fakes(p);
  await p.evaluate(() => window.__reg('faket', { teaches: true, levels: ['a', 'b', 'c', 'd', 'e'], tall: true }));
  const measure = sel => p.evaluate(sel => {
    const bar = document.querySelector('[data-bz=tabbar], .bz-tabbar');
    const top = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
    return [...document.querySelectorAll(sel)].filter(e => e.offsetParent).map(e => { const r = e.getBoundingClientRect();
      return { t: (e.getAttribute('data-gmh') || e.id || e.className || '').toString().slice(0, 20), top: r.top, bottom: r.bottom, h: r.height, w: r.width, bar: top }; });
  }, sel);
  const bad = (list, what) => {
    if (!list.length) throw new Error('nothing to measure: ' + what);
    const b = list.filter(x => x.top < 0 || x.bottom > x.bar + 0.5 || x.h < 44 || x.w < 44);
    if (b.length) throw new Error(what + ': ' + b.map(x => `${x.t} ${Math.round(x.top)}–${Math.round(x.bottom)} (bar at ${Math.round(x.bar)}, ${Math.round(x.h)}px)`).join('; '));
  };
  await open(p, 'faket');      /* the how-to stays open over the start panel: measured with it open */
  bad(await measure('#gamehost .gm-lvl, #gamehost [data-gmh="start"], #main .gf-back, #gftitle'), 'the level chips, Start, Back and the title');
  await start(p);
  /* a miss at the foot of a board taller than the phone: the miss card's Aage rides above the tab bar */
  await p.evaluate(() => {
    const b = document.querySelector('#gamehost .fk-board');
    b.insertAdjacentHTML('beforeend', '<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">Kerala</span>' +
      '<p class="gm-teach">Its capital is Thiruvananthapuram.</p><button class="btn gm-aage" data-gm="aage">Aage →</button></div>');
  });
  await p.waitForTimeout(150);
  bad(await measure('#gamehost .gm-aage'), 'the miss card\'s Aage');
  await report(p, 'faket', R(9, true)); await finish(p, 'faket', { score: 9 });
  await p.waitForTimeout(200);
  bad(await measure('#gamehost .gf-finish .btn'), 'the finish card\'s buttons');
}, { vp: PHONE });

check('contract', 'the host reads reports, not classes, and finishing pays nothing (source)', async () => {
  const src = fs.readFileSync(path.join(APP, 'app.js'), 'utf8');
  const a = src.indexOf('function mountGame('), b = src.indexOf('/* =============================================================== DISPATCH */');
  if (a < 0 || b < a) throw new Error('cannot find mountGame');
  const host = src.slice(a, b);
  for (const [rx, why] of [[/MutationObserver/, 'the host still watches the page'], [/TOK_OK|TOK_NO|OWN_VOICE|lastVerdict/, 'the class-watching tokens are still there'],
                           [/for finishing/, 'a finishing payment is still promised'], [/\[data-go="out"\]/, 'the host still reads an engine\'s end button']])
    if (rx.test(host)) throw new Error(why);
  const contest = host.match(/earn\('contest'[^\n]*/g) || [];
  if (contest.length !== 1 || !/rung >= 10[\s\S]{0,40}!res\.lifelines/.test(host)) throw new Error('`contest` is paid somewhere other than Gyanpati\'s rung-10 rule');
  const m = src.match(/var TEACHES = \[([\s\S]*?)\];/);
  const T = m ? (m[1].match(/'([a-z0-9]+)'/g) || []).map(s => s.slice(1, -1)) : [];
  const want = ['gyanpati', 'shabd', 'naksha', 'panchang', 'kaalnadi', 'akshar', 'katha', 'sabhyata', 'saga', 'rangoli'];
  const miss = want.filter(x => !T.includes(x));
  if (miss.length) throw new Error('TEACHES is missing ' + miss.join(', '));
  if (T.includes('triviamaster')) throw new Error('Trivia Master is on the paying list — it is an alias into Gyanpati now');
  const luck = ['ludo', 'saapsidi', 'carrom', 'kancha', 'pallanguzhi', 'gutte'].filter(x => T.includes(x));
  if (luck.length) throw new Error('heritage games are on the paying list: ' + luck.join(', '));
});

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await browser.newContext({ viewport: c.vp || DESK, serviceWorkers: 'block' });
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
