#!/usr/bin/env node
/* Bizzing India — rewards follow learning (FIX-INDIA batch 2, family standard §1, §6, §8, §10).
   ==================================================================================
     coins     the one family wallet pays only the standard events at the standard
               amounts, under the 100-a-day lid; a bare number or a made-up event pays 0
     luck      no game of luck or dexterity is on the paying list
     rank      rank moves on mastery evidence only — a hundred coins do not move it
     random    nothing is random: no draw, no drop rate, and choosing a card gives that card
     streaks   no "N-day streak" or "Streak ×" anywhere a child reads
     hold      a wrong answer waits for Continue; it does not move on by itself
     migrate   the old sikke move into the wallet 1:1, once (Store v1_to_v2)
     gyanpati  the ladder quiz has no pot to take or double, and a miss is taught, not lost

   Each was watched to fail by breaking what it holds (docs/23-rewards.md).
   Run:  node tools/check-rewards.js [--only coins] */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');

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
const check = (id, what, fn) => CHECKS.push({ id, what, fn });

check('coins', 'only the standard events pay, at the standard amounts, under the lid', async ({ p }) => {
  const r = await p.evaluate(() => {
    const B = window.BI, W = window.IND_WALLET, who = B.S.name;
    const before = W.balance(who);
    const paid = { answer: B.earn('answer'), stop: B.earn('stop'), contest: B.earn('contest'), mastery: B.earn('mastery'),
                   number: B.earn(12), login: B.earn('login'), dice: B.earn('dice') };
    let lid = 0; for (let i = 0; i < 40; i++) lid += B.earn('mastery');
    const today = W.ledger(who).filter(x => x.a === 'india' && x.n > 0 && x.why !== 'migrated').reduce((a, x) => a + x.n, 0);
    return { paid, before, after: W.balance(who), today, shown: +document.getElementById('kauriCount').textContent };
  });
  const want = { answer: 1, stop: 5, contest: 10, mastery: 20, number: 0, login: 0, dice: 0 };
  for (const k in want) if (r.paid[k] !== want[k]) throw new Error(`"${k}" paid ${r.paid[k]}, the standard says ${want[k]}`);
  if (r.today > 100) throw new Error(`${r.today} coins in one day — the lid is 100`);
  if (r.shown !== r.after) throw new Error(`the top bar shows ${r.shown}, the wallet holds ${r.after}`);
});

check('luck', 'no game of luck or dexterity pays', async ({ p }) => {
  const src = require('fs').readFileSync(require('path').join(APP, 'app.js'), 'utf8');
  const m = src.match(/var TEACHES = \[([^\]]*)\]/);
  if (!m) throw new Error('there is no list of the games that teach');
  const teaches = m[1].match(/'([a-z0-9]+)'/g).map(s => s.slice(1, -1));
  const luck = ['ludo', 'saapsidi', 'carrom', 'kancha', 'pallanguzhi', 'gutte', 'rangoli'];
  const bad = luck.filter(g => teaches.includes(g));
  if (bad.length) throw new Error('these pay coins and teach nothing: ' + bad.join(', '));
  if (!/TEACHES\.indexOf\(g\.id\) >= 0\) \{ earn\('contest'/.test(src)) throw new Error('a finished game is not paid through the TEACHES list');
});

check('rank', 'rank moves on mastery, never on coins', async ({ p }) => {
  /* the engines that hold mastery load with their screens now (docs/27): a child earning a
     rung has them; so must the check */
  await p.evaluate(() => window.IND_LOAD && window.IND_LOAD(['bhasha', 'paath', 'content', 'map']));
  const r = await p.evaluate(() => {
    const B = window.BI;
    const l0 = B.level(), m0 = B.mastered();
    for (let i = 0; i < 30; i++) B.earn('mastery');
    const l1 = B.level();
    /* a Bhasha rung tested out is mastery evidence */
    const S = B.S, P = window.IND_PACKS, pid = Object.keys(P)[0], sid = P[pid].stages[0].id;
    S.lang[pid] = S.lang[pid] || {}; S.lang[pid].stages = S.lang[pid].stages || {};
    S.lang[pid].stages[sid] = Object.assign({}, S.lang[pid].stages[sid], { testout: true });
    return { l0, l1, m0, m1: B.mastered(), l2: B.level() };
  });
  if (r.l1 !== r.l0) throw new Error(`coins moved the rank from ${r.l0} to ${r.l1}`);
  if (!(r.m1 > r.m0)) throw new Error('a mastered rung did not count as mastery');
  if (!(r.l2 > r.l0)) throw new Error('mastery did not move the rank');
});

check('random', 'nothing is random: no draw, and choosing a card gives that card', async ({ p }) => {
  const fs = require('fs'), path = require('path');
  const eco = fs.readFileSync(path.join(APP, 'economy.js'), 'utf8');
  if (/Math\.random/.test(eco)) throw new Error('economy.js still rolls a die');
  const app = fs.readFileSync(path.join(APP, 'app.js'), 'utf8');
  if (/data-act="draw"|dropRate|pitara/i.test(app.replace(/\/\*[\s\S]*?\*\//g, '')))
    throw new Error('a draw, a drop rate or the pitara is still in the app');
  const r = await p.evaluate(() => {
    const B = window.BI, E = window.IND_ECONOMY, S = B.S;
    /* enough to choose: three past days of mastery, each under the family's daily lid */
    for (let d = 1; d <= 3; d++) for (let i = 0; i < 5; i++) window.IND_WALLET.earn('india', S.name, 'mastery', Date.now() - d * 864e5 - i);
    /* the family engine (standard §8): a Rare in an open world, at its printed price */
    const a = (window.IND_AVATARS || []).find(x => x.tier === 'rare' && E.stateOf(S, x.id).state === 'buy' && !E.stateOf(S, x.id).short);
    if (!a) return { none: true };
    const id = a.id, before = S.own.avatars.length;
    const el = document.createElement('button'); el.setAttribute('data-act', 'buyav'); el.setAttribute('data-id', id);
    document.getElementById('main').appendChild(el); el.click();
    return { id, got: S.own.avatars.includes(id), others: S.own.avatars.length - before - 1 };
  });
  if (r.none) throw new Error('no card to choose — nothing was tested');
  if (!r.got) throw new Error(`choosing ${r.id} did not give ${r.id}`);
  if (r.others) throw new Error('choosing one card gave others too');
});

check('streaks', 'no streak count anywhere a child reads', async ({ p }) => {
  const RX = /\d+-day streak|streak\s*[×x]\s*\d|best streak|days? in a row/i;
  const bad = [];
  for (const v of ['home', 'map', 'mela', 'me']) {
    await p.evaluate(v => { const S = window.BI.S; S.streak.days = ['2026-09-28', '2026-09-29', '2026-09-30']; S.streak.count = 9; window.BI.go(v); }, v);
    await p.waitForTimeout(250);
    const txt = await p.evaluate(() => document.getElementById('main').innerText);
    const m = txt.match(RX); if (m) bad.push(`${v}: "${m[0]}"`);
  }
  const blurbs = await p.evaluate(() => (window.IND_GAMES || []).map(g => (g.blurb || '') + ' ' + (g.name || '')).join(' | '));
  const mb = blurbs.match(/streaks? stack|\bstreaks?\b(?! of)/i); if (mb) bad.push(`a game card: "${mb[0]}"`);
  if (bad.length) throw new Error(bad.join('; '));
});

check('hold', 'a wrong answer waits for Continue', async ({ p }) => {
  await p.evaluate(() => { window.BI.go('bhasha'); });
  await p.waitForTimeout(300);
  await p.evaluate(() => { const b = document.querySelector('[data-act="pack"][data-id="hi"]'); if (b) b.click(); });
  await p.waitForTimeout(400);
  await p.evaluate(() => { const b = document.querySelector('[data-act="blesson"]'); if (b) b.click(); });
  await p.waitForTimeout(500);
  /* past the introductions to a graded choice */
  let q = null;
  for (let i = 0; i < 12; i++) {
    q = await p.evaluate(() => { const z = window.BI.quizState(); return z.q ? { type: z.q.type, a: z.q.answerIndex, n: document.querySelectorAll('[data-act="ans"]').length } : null; });
    if (q && q.type !== 'introduce' && typeof q.a === 'number' && q.n > 1) break;
    if (q && q.type === 'introduce') await p.evaluate(() => { const g = document.querySelector('[data-act="gotit"]'); if (g) g.click(); });
    else await p.evaluate(() => { const z = window.BI.quizState(); const b = document.querySelector('[data-act="ans"][data-i="' + z.q.answerIndex + '"]'); if (b) b.click(); });
    await p.waitForTimeout(1500);
  }
  if (!q || typeof q.a !== 'number') throw new Error('never reached a graded choice to answer wrongly');
  const token = await p.evaluate(() => { const z = window.BI.quizState(); window.__tok = z.q; return z.pi; });
  await p.evaluate(a => { const b = [...document.querySelectorAll('[data-act="ans"]')].find(x => +x.getAttribute('data-i') !== a); b.click(); }, q.a);
  await p.waitForTimeout(4000);
  const held = await p.evaluate(() => ({ same: window.BI.quizState().q === window.__tok, btn: !!document.querySelector('[data-act="qnext"]') }));
  if (!held.same) throw new Error('a wrong answer moved on by itself');
  if (!held.btn) throw new Error('a wrong answer has no Continue');
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(500);
  if (await p.evaluate(() => window.BI.quizState().q === window.__tok)) throw new Error('Continue (by keyboard) did not move on');
});

check('migrate', 'the old sikke move into the family wallet 1:1, once', async ({ p, base }) => {
  await p.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('bi_v1'));
    s.schemaVersion = 1; s.sikke = 137; delete s.coinsToMove; s.name = 'Migrant';
    localStorage.setItem('bi_v1', JSON.stringify(s));
    localStorage.removeItem('bizzing.wallet');
  });
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  const a = await p.evaluate(() => ({ bal: window.IND_WALLET.balance('Migrant'), v: JSON.parse(localStorage.getItem('bi_v1')).schemaVersion,
    sikke: window.BI.S.sikke }));
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  const b = await p.evaluate(() => window.IND_WALLET.balance('Migrant'));
  if (a.bal !== 137) throw new Error(`137 sikke became ${a.bal} coins`);
  if (a.v !== 3) throw new Error(`the profile is at schema ${a.v}, not walked up to 3`);
  if (b !== 137) throw new Error(`a second boot moved them again (${b})`);
});

check('gyanpati', 'the ladder quiz has no pot, and a miss is taught, not lost', async ({ p }) => {
  await p.evaluate(() => window.BI.go('game', 'gyanpati'));
  await p.waitForTimeout(900);
  const r = await p.evaluate(async () => {
    const host = document.getElementById('gamehost');
    const txt0 = host.innerText;
    const st = () => host.querySelector('.qz-wrap') && host.firstElementChild && (host.__qzState || null);
    const s0 = st();
    if (!s0) return { none: true };
    /* answer wrongly */
    const wrong = [0, 1, 2, 3].find(i => i !== s0.answerIndex);
    host.querySelectorAll('.qz-opt')[wrong].click();
    host.querySelector('[data-go="lock"]').click();
    await new Promise(r => setTimeout(r, 2200));
    const s1 = st();
    return { pot: /🐚|kauri|doubl|take the pot|walk away/i.test(txt0 + host.innerText),
             walk: !!host.querySelector('[data-go="walk"]'), teach: !!host.querySelector('.qz-teach'),
             aage: !!host.querySelector('[data-go="aage"]'), phase: s1 && s1.phase };
  });
  if (r.none) throw new Error('the quiz did not open');
  if (r.pot) throw new Error('the quiz still talks about a pot, kauris or walking away');
  if (r.walk) throw new Error('there is still a walk-away button');
  if (!r.teach) throw new Error('a miss is not taught');
  if (!r.aage || r.phase === 'end') throw new Error('a miss ended the climb');
});

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, serviceWorkers: 'block' });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      await skipOnboarding(p);
      await p.waitForTimeout(300);
      await c.fn({ p, base });
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
