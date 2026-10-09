#!/usr/bin/env node
/* Bizzing India — the quiz engines report to the host (docs/32; games spec §1, §4.1, §4.2, §8).

   Every engine is mounted straight into the page with a stub opts that records each answer()
   and the done() result, so what is held is the ENGINE's side of the contract, whatever host
   is around it.

     report     Q2/T3  one answer() per item, at its first attempt — a second tap on the same item
                       reports nothing; ids are unique in a round; no engine plays right/wrong itself
     counter    Q3/T2  done.firstTryRight is the count of reported first-try rights, done.asked the
                       count of reports, and done.level the level it was given
     miss       T6     a wrong first answer holds on the miss card ("Not quite.", the right answer,
                       its teach, Aage): no new item renders until Aage, by Enter or by touch; no
                       elimination — options are never greyed one guess at a time
     copy       T5     no "in a row", "streak" or × multiplier in games-quiz.js, games-shabd.js or the
                       State Hunt / Festival / Jataka engines, nor on screen through a played round
     bot        Q1     a random bot over 20 Gyanpati rounds never reaches rung 10 on first-try rights
                       without lifelines; a perfect bot does (so the rung is really measured), and
                       `rung` is exactly the climb of first-try rights from the bottom
     lifelines  §4.1.4 Aadha-Aadha, Gattu ka Guess and Poochho Nani are fixed per question (same
                       question, same result, twice), Gattu is right ~6 in 10 and says it is a guess,
                       Nani never says the answer; what the screen does matches the pure functions
     ladder     §4.1   the category picker, the levels, rungs 1–3 re-asking an earlier day's misses,
                       triviamaster hidden and opening Gyanpati's picker; registry fields on every entry
     sprint     §4.1.3 9+ only and never in Calm; its clock does not move while the tab is hidden or
                       while a miss card is open
     parivaar   W2     Parivaar's ids are the Rishtey term ids, stable across plays; its options are
                       distinct words in the family's language; "in many families"; the finish line
     writeback  W1     a missed Shabd word is in Bhasha's slipped deck, ready, a day later; it comes
                       back in the next round as one of the review words
     phone      §1.6   at 390×844 the start button of Shabd and Gyanpati sits above the tab bar

   Each was watched to fail by breaking the thing it holds.
   Run:  CHROME=/opt/pw-browsers/chromium node tools/check-quiz.js [--only <id>]
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');

const APP = process.env.QUIZ_APP || path.join(__dirname, '..', 'app');   /* QUIZ_APP: a copy with a fault in it, to watch a check fail */
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
const QUIZ = ['gyanpati', 'statehunt', 'festival', 'jataka', 'shabd', 'parivaar'];
const STREAK = /in a row|streak|×\s*\d|\d(\.\d+)?\s*×|points ×/i;

/* ---------------------------------------------------------------- in-page helpers */
/* mount an engine on a fresh host, with a stub opts that records every report */
async function mount(p, id, opts) {
  await p.evaluate(async ({ id, opts }) => {
    if (window.IND_LOAD) await window.IND_LOAD(['content', 'voice', 'map', 'bhasha', 'games']);
    if (window.__qtd) { try { window.__qtd(); } catch (e) {} }
    const g = window.IND_GAMES.find(x => x.id === (id === 'parivaar' ? 'shabd' : id));
    let host = document.getElementById('qhost'); if (host) host.remove();
    host = document.createElement('div'); host.id = 'qhost'; host.style.cssText = 'max-width:900px;margin:0 auto';
    document.getElementById('main').prepend(host);
    window.__q = { answers: [], done: null, sounds: [], texts: [] };
    if (window.IND_SFX && !window.IND_SFX.__wrapped) {
      const play = window.IND_SFX.play; window.IND_SFX.__wrapped = true;
      window.IND_SFX.play = function (k) { if (window.__q) window.__q.sounds.push(k); return play.apply(this, arguments); };
    }
    const o = Object.assign({ reduced: true }, opts || {}, { answer: r => window.__q.answers.push(r) });
    window.__qtd = g.engine(host, o, r => { window.__q.done = r; });
    if (id === 'parivaar') {
      const k = host.querySelector('[data-go="kind"][data-kind="parivaar"]'); if (k) k.click();
    }
  }, { id, opts });
  await p.waitForTimeout(120);
}

/* one move of a bot. how: 'right' | 'wrong' | 'random' | 'first-wrong' (the first item wrong, the rest random) */
async function step(p, how) {
  return p.evaluate(how => {
    const h = document.getElementById('qhost'), q = window.__q;
    const txt = () => { q.texts.push(h.innerText); };
    const click = sel => { const e = h.querySelector(sel); if (e && !e.disabled) { e.click(); return true; } return false; };
    if (q.done) return 'done';
    const pickIdx = (ans, n) => {
      const mode = how === 'first-wrong' ? (q.answers.length === 0 ? 'wrong' : 'random') : how;
      if (mode === 'right') return ans;
      if (mode === 'wrong') return (ans + 1) % n;
      return Math.floor(Math.random() * n);
    };
    /* gyanpati */
    const g = h.__qzState;
    if (h.querySelector('.qz-wrap') && g) {
      txt();
      if (click('[data-go="out"]')) return 'out';
      if (click('[data-gm="aage"]') || click('[data-go="aage"]')) return 'aage';
      if (g.phase === 'setup') { click('[data-go="start"]'); return 'start'; }
      if (g.phase === 'ask') {
        const os = h.querySelectorAll('.qz-opt'), i = pickIdx(g.answerIndex, os.length);
        os[i].click(); if (!g.sprint) click('[data-go="lock"]'); return 'ans';
      }
      return 'wait';
    }
    /* shabd */
    const s = h.__shState;
    if (h.querySelector('.sh-wrap') && s) {
      txt();
      if (click('[data-go="out"]')) return 'out';
      if (s.phase === 'intro') { click('[data-go="start"]'); return 'start'; }
      if (s.phase === 'q' && !s.locked) { const os = h.querySelectorAll('.sh-opt'); os[pickIdx(s.answer, os.length)].click(); return 'ans'; }
      if (click('[data-gm="aage"]') || click('[data-go="next"]')) return 'aage';
      return 'wait';
    }
    /* the choice board (statehunt, festival, jataka) */
    const m = h.__melaState;
    if (h.querySelector('.mela-wrap') && m) {
      txt();
      if (click('[data-go="out"]')) return 'out';
      if (click('[data-gm="aage"]') || click('[data-go="next"]')) return 'aage';
      if (m.phase === 'ask') { const os = h.querySelectorAll('.mela-opt'); os[pickIdx(m.answer, os.length)].click(); return 'ans'; }
      return 'wait';
    }
    return 'wait';
  }, how);
}
async function play(p, how, max) {
  for (let k = 0; k < (max || 200); k++) {
    const r = await step(p, how);
    if (r === 'done') break;
    await p.waitForTimeout(r === 'wait' ? 60 : 15);
  }
  return p.evaluate(() => window.__q);
}
/* where the engine is: the current item's id and whether a miss card shows */
const where = p => p.evaluate(() => {
  const h = document.getElementById('qhost');
  const st = h.__qzState || h.__shState || h.__melaState || {};
  const enabled = [...h.querySelectorAll('.qz-opt,.sh-opt,.mela-opt')].filter(b => !b.disabled).length;
  const total = h.querySelectorAll('.qz-opt,.sh-opt,.mela-opt').length;
  const miss = h.querySelector('.gm-miss');
  return { id: st.key || st.id || null, i: st.qIndex != null ? st.qIndex : st.i != null ? st.i : st.idx, phase: st.phase,
           q: (h.querySelector('.qz-q,.sh-meaning,.sh-big,.mela-q') || {}).textContent || '', enabled, total,
           miss: miss ? { text: miss.innerText, ans: (miss.querySelector('.gm-ans') || {}).textContent || '',
                          teach: (miss.querySelector('.gm-teach') || {}).textContent || '', aage: !!miss.querySelector('.gm-aage[data-gm="aage"]') } : null,
           answers: window.__q.answers.length };
});
/* get to the first question of a mounted engine */
async function toFirst(p) {
  for (let k = 0; k < 10; k++) {
    const w = await where(p);
    if (w.total && w.enabled) return w;
    await step(p, 'random'); await p.waitForTimeout(80);
  }
  return where(p);
}

/* ------------------------------------------------------------------ the checks */
check('report', 'one answer() per item, at its first attempt; no engine plays right or wrong itself', async ({ p }) => {
  for (const id of QUIZ) {
    await mount(p, id, { level: 3, band: '8-10' });
    await toFirst(p);
    /* a second tap on the same item reports nothing */
    const twice = await p.evaluate(() => {
      const h = document.getElementById('qhost'), os = h.querySelectorAll('.qz-opt,.sh-opt,.mela-opt');
      const st = h.__qzState || h.__shState || h.__melaState;
      const ans = st.answerIndex != null ? st.answerIndex : st.answer;
      os[(ans + 1) % os.length].click();
      const lock = h.querySelector('[data-go="lock"]'); if (lock) lock.click();
      return new Promise(r => setTimeout(() => { os[ans].click(); os[(ans + 2) % os.length].click(); r(window.__q.answers.length); }, 120));
    });
    if (twice !== 1) throw new Error(`${id}: one item answered three times made ${twice} reports, not 1`);
    const q = await play(p, 'random');
    if (!q.done) throw new Error(`${id}: the round never called done()`);
    const ids = q.answers.map(a => a.id);
    if (new Set(ids).size !== ids.length) throw new Error(`${id}: an item was reported twice: ${ids.join(',')}`);
    const bad = q.answers.find(a => !a.id || typeof a.right !== 'boolean' || a.firstTry !== true || !/^[a-z]+\.[a-z]+$/.test(a.skill || ''));
    if (bad) throw new Error(`${id}: a report is not to the contract: ${JSON.stringify(bad)}`);
    if (q.done.asked !== q.answers.length) throw new Error(`${id}: ${q.answers.length} reports, done.asked ${q.done.asked}`);
    const own = q.sounds.filter(s => s === 'right' || s === 'wrong');
    if (own.length) throw new Error(`${id}: the engine played ${own.join(',')} itself — that is the host's`);
  }
});

check('counter', 'done.firstTryRight is the count of reported first-try rights; done carries the level', async ({ p }) => {
  for (const id of QUIZ) {
    for (const level of [1, 4]) {
      await mount(p, id, { level, band: '8-10' });
      const q = await play(p, 'random');
      const rights = q.answers.filter(a => a.right && a.firstTry).length;
      const d = q.done || {};
      if (d.firstTryRight !== rights) throw new Error(`${id} L${level}: ${rights} first-try rights reported, done says ${d.firstTryRight}`);
      if (d.score !== rights) throw new Error(`${id} L${level}: the score (${d.score}) is not the first-try rights (${rights})`);
      if (d.level !== level) throw new Error(`${id}: played at level ${level}, done says ${d.level}`);
      if (typeof d.win !== 'boolean' || !(d.levelNext >= 1 && d.levelNext <= 5)) throw new Error(`${id}: done is not to the contract: ${JSON.stringify(d)}`);
      if ('kauris' in d) throw new Error(`${id}: done still carries kauris`);
    }
  }
});

check('miss', 'a wrong answer holds on the miss card until Aage; nothing is eliminated', async ({ p }) => {
  for (const id of QUIZ) {
    for (const how of ['enter', 'tap']) {
      await mount(p, id, { level: 3, band: '8-10' });
      const w0 = await toFirst(p);
      await step(p, 'wrong'); await p.waitForTimeout(250);
      const w1 = await where(p);
      if (!w1.miss) throw new Error(`${id}: a wrong answer showed no miss card`);
      if (!/^Not quite\./.test(w1.miss.text.trim())) throw new Error(`${id}: the miss card does not say "Not quite." in words: ${w1.miss.text.slice(0, 60)}`);
      if (!w1.miss.ans.trim() || !w1.miss.teach.trim() || !w1.miss.aage) throw new Error(`${id}: the miss card lacks the answer, the teach or Aage`);
      /* no elimination: the options are all closed with the card, never some of them while play goes on */
      if (w1.enabled !== 0) throw new Error(`${id}: after a miss ${w1.enabled} of ${w1.total} options are still open — elimination guessing`);
      /* it holds: time passes, a number key is pressed, and nothing new renders or reports */
      await p.mouse.click(2, 2).catch(() => {});
      await p.keyboard.press('2'); await p.waitForTimeout(700);
      const w2 = await where(p);
      if (w2.i !== w1.i || w2.q !== w1.q || !w2.miss) throw new Error(`${id}: the miss did not hold — a new item rendered before Aage`);
      if (w2.answers !== 1) throw new Error(`${id}: a key pressed on the miss card reported again`);
      /* Aage: by Enter (keyboard) and by tap (touch) */
      if (how === 'enter') { await p.evaluate(() => document.activeElement && document.activeElement.blur()); await p.keyboard.press('Enter'); }
      else await p.evaluate(() => document.querySelector('#qhost .gm-miss [data-gm="aage"]').click());
      await p.waitForTimeout(250);
      const w3 = await where(p);
      if (w3.miss || !(w3.i !== w1.i || w3.phase === 'end' || w3.phase === 'done')) throw new Error(`${id}: Aage by ${how} did not move on`);
      if (w0.i === w3.i && w3.q === w0.q) throw new Error(`${id}: the same item came back after Aage`);
    }
  }
  /* number keys 1–4 pick on every multiple-choice screen */
  for (const id of QUIZ) {
    await mount(p, id, { level: 3, band: '8-10' });
    await toFirst(p);
    await p.evaluate(() => document.activeElement && document.activeElement.blur());
    await p.keyboard.press('3'); await p.waitForTimeout(80);
    if (id === 'gyanpati') { await p.keyboard.press('Enter'); await p.waitForTimeout(200); }
    const n = await p.evaluate(() => window.__q.answers.length);
    if (n !== 1) throw new Error(`${id}: the number key 3 did not pick an option`);
  }
});

check('copy', 'no "in a row", streak or × multiplier in the quiz engines or on their screens', async ({ p }) => {
  const src = f => fs.readFileSync(path.join(APP, f), 'utf8');
  const g = src('games.js');
  const region = (a, b) => g.slice(g.indexOf(a), g.indexOf(b, g.indexOf(a)));
  const files = { 'games-quiz.js': src('games-quiz.js'), 'games-shabd.js': src('games-shabd.js'),
    'games.js (the choice board)': region('CHOICE BOARD — the shared quiz machine', 'GAME 1 · RANGOLI RUSH'),
    'games.js (State Hunt, Festival, Jataka)': region('GAME 2 · YATRA / STATE HUNT', 'Small convenience seam') };
  const bad = [];
  for (const [f, t] of Object.entries(files)) {
    if (t.length < 2000) bad.push(f + ' was not found to read');
    t.split('\n').forEach((ln, i) => { const m = ln.match(STREAK); if (m) bad.push(`${f}:${i + 1} "${m[0]}"`); });
  }
  /* "claims the app never checks" (§1.7) */
  for (const [f, t] of Object.entries(files)) {
    if (/Every question you met today is one you now know/.test(t)) bad.push(f + ': an unchecked "now know" claim');
    if (/are yours now too/.test(t)) bad.push(f + ': an unchecked "yours now" claim');
  }
  if (bad.length) throw new Error(bad.join(' · '));
  /* and on screen, through a played round of each (and Gyanpati's sprint) */
  for (const id of QUIZ) {
    await mount(p, id, { level: 3, band: '11-12' });
    const q = await play(p, 'random');
    const m = q.texts.join('\n').match(STREAK);
    if (m) throw new Error(`${id} said "${m[0]}" on screen`);
  }
});

check('bot', 'a random bot never climbs to rung 10 on first-try rights; a perfect one does; the rung is the climb', async ({ p }) => {
  const rungs = [];
  for (let r = 0; r < 20; r++) {
    await mount(p, 'gyanpati', { level: 3, band: '8-10' });
    const q = await play(p, 'random');
    if (!q.done) throw new Error('round ' + (r + 1) + ' never finished');
    let climb = 0; for (const a of q.answers) { if (a.right && a.firstTry && !a.lifeline) climb++; else break; }
    if (q.done.rung !== climb) throw new Error(`rung ${q.done.rung} reported, but the climb of first-try rights from the bottom was ${climb}`);
    if (q.done.lifelines) throw new Error('a bot that used no lifeline is reported as having used one');
    rungs.push(q.done.rung);
  }
  const max = Math.max(...rungs);
  console.log(`         random bot, 20 rounds: rungs ${rungs.join(' ')} (highest ${max})`);
  if (max >= 10) throw new Error(`a random bot reached rung ${max} — the contest would pay for guessing`);
  await mount(p, 'gyanpati', { level: 3, band: '8-10' });
  const best = await play(p, 'right');
  if (best.done.rung !== best.done.asked || best.done.rung < 10) throw new Error(`a bot that knew every answer reached rung ${best.done.rung} of ${best.done.asked}`);
});

check('lifelines', 'the three lifelines are fixed per question, honest, and never say the answer', async ({ p }) => {
  const r = await p.evaluate(async () => {
    if (window.IND_LOAD) await window.IND_LOAD(['content', 'voice', 'map', 'bhasha', 'games']);
    const G = window.IND_GYAN, bank = G.bank(), all = [].concat(...Object.values(bank));
    const out = { n: all.length, diff: [], leak: [], gattuRight: 0 };
    for (const q of all) {
      const d1 = G.deal(q), d2 = G.deal(q);
      const f1 = G.fifty(q, d1.options).slice().sort().join('|'), f2 = G.fifty(q, d2.options).slice().sort().join('|');
      const g1 = G.gattu(q, d1.options), g2 = G.gattu(q, d2.options.slice().reverse());
      const n1 = G.nani(q), n2 = G.nani(q);
      if (d1.options.slice().sort().join('|') !== d2.options.slice().sort().join('|')) out.diff.push('deal ' + q.key);
      if (f1 !== f2 || f1.split('|').indexOf(q.a) >= 0 || f1.split('|').length !== 2) out.diff.push('50:50 ' + q.key);
      if (g1 !== g2) out.diff.push('gattu ' + q.key);
      if (n1 !== n2) out.diff.push('nani ' + q.key);
      if (G.leaks(n1, q.a) || (String(q.a).match(/\d+/g) || []).some(dg => n1.indexOf(dg) >= 0)) out.leak.push(q.key + ': ' + n1);
      if (G.gattuRight(q)) out.gattuRight++;
    }
    return out;
  });
  if (r.n < 100) throw new Error('only ' + r.n + ' questions in the bank');
  if (r.diff.length) throw new Error('not fixed per question: ' + r.diff.slice(0, 5).join(', '));
  if (r.leak.length) throw new Error('Nani gave the answer away: ' + r.leak.slice(0, 3).join(' · '));
  const share = r.gattuRight / r.n;
  if (share < 0.5 || share > 0.7) throw new Error(`Gattu is right ${Math.round(share * 100)}% of the time, not about 60%`);
  /* on screen: what the buttons do is what the functions say */
  await mount(p, 'gyanpati', { level: 3, band: '8-10' });
  await toFirst(p);
  const ui = await p.evaluate(() => {
    const h = document.getElementById('qhost'), G = window.IND_GYAN, st = h.__qzState;
    const q = [].concat(...Object.values(G.bank())).find(x => x.key === st.key);
    h.querySelector('[data-life="fifty"]').click();
    const off = [...h.querySelectorAll('.qz-opt')].filter(b => b.disabled).map(b => st.options[+b.getAttribute('data-i')]).sort().join('|');
    const open = [...h.querySelectorAll('.qz-opt')].filter(b => !b.disabled).map(b => st.options[+b.getAttribute('data-i')]);
    h.querySelector('[data-life="gattu"]').click();
    const said = h.querySelector('.qz-feed').textContent, letter = (said.match(/guesses ([A-D])/) || [])[1];
    const pick = G.gattu(q, open);
    h.querySelector('[data-life="nani"]').click();
    const nani = h.querySelector('.qz-feed').textContent;
    const ls = [...h.querySelectorAll('.qz-lbtn')].map(b => b.getBoundingClientRect().height);
    return { off, want: G.fifty(q, st.options).slice().sort().join('|'), said, letter, pick: st.options[['A', 'B', 'C', 'D'].indexOf(letter)], wantPick: pick,
             nani, wantNani: G.nani(q), tall: Math.min(...ls) };
  });
  if (ui.off !== ui.want) throw new Error(`Aadha-Aadha closed ${ui.off}, the question's own 50:50 is ${ui.want}`);
  if (ui.pick !== ui.wantPick) throw new Error(`Gattu tapped ${ui.pick}, his fixed guess for this question is ${ui.wantPick}`);
  if (!/guess/i.test(ui.said)) throw new Error('Gattu does not say it is a guess: ' + ui.said);
  if (ui.nani !== ui.wantNani) throw new Error('Nani on screen is not the question\'s clue');
  if (ui.tall < 44) throw new Error(`a lifeline is ${ui.tall}px tall, under the 44px tap target`);
  await step(p, 'right'); await p.waitForTimeout(150);
  const q = await play(p, 'right');
  if (!q.done.lifelines) throw new Error('a round with lifelines used reports lifelines: false');
  if (q.done.rung !== 0) throw new Error(`a rung answered with a lifeline counted toward the climb (rung ${q.done.rung})`);
});

check('ladder', 'the category picker, the levels, an earlier day\'s misses on rungs 1–3, and Trivia folded in', async ({ p }) => {
  /* registry: teaches, sub, five levels; triviamaster hidden */
  const reg = await p.evaluate(async () => { if (window.IND_LOAD) await window.IND_LOAD(['games']);
    return window.IND_GAMES.filter(g => ['gyanpati', 'triviamaster', 'shabd', 'statehunt', 'festival', 'jataka'].includes(g.id))
      .map(g => ({ id: g.id, teaches: g.teaches, sub: g.sub, levels: g.levels, hide: !!g.hide })); });
  if (reg.length !== 6) throw new Error('missing registry entries: ' + reg.map(g => g.id).join(','));
  for (const g of reg) {
    if (g.teaches !== true || typeof g.sub !== 'string' || !g.sub || !Array.isArray(g.levels) || g.levels.length !== 5 || g.levels.some(l => typeof l !== 'string' || !l))
      throw new Error(g.id + ' is not registered to the contract: ' + JSON.stringify(g));
    if ((g.id === 'triviamaster') !== g.hide) throw new Error(g.id + (g.hide ? ' is hidden' : ' is not hidden'));
  }
  await mount(p, 'triviamaster', {});
  const tm = await p.evaluate(() => ({ cats: [...document.querySelectorAll('#qhost .qz-cat[data-cat]')].map(b => b.getAttribute('data-cat')), game: document.getElementById('qhost').__qzState.game }));
  if (tm.game !== 'gyanpati' || tm.cats.join(',') !== 'naksha,itihaas,utsav,khazana,mahakavya,all') throw new Error('an old Trivia Master link does not open Gyanpati\'s category picker: ' + JSON.stringify(tm));
  /* levels change the climb */
  const bands = {};
  for (const level of [1, 5]) { await mount(p, 'gyanpati', { level }); bands[level] = await p.evaluate(() => document.getElementById('qhost').__qzState.bands); }
  const easy = b => b.filter(x => x === 'easy').length;
  if (!(easy(bands[1]) >= 7 && easy(bands[5]) <= 3)) throw new Error(`level 1 and level 5 climb the same ladder: ${easy(bands[1])} and ${easy(bands[5])} easy rungs`);
  /* one category: every rung is from it */
  await mount(p, 'gyanpati', { level: 3 });
  await p.evaluate(() => { const h = document.getElementById('qhost');
    ['naksha', 'utsav', 'khazana', 'mahakavya'].forEach(c => h.querySelector('[data-cat="' + c + '"]').click());
    document.activeElement && document.activeElement.blur(); });
  await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  const keys = [];
  for (let k = 0; k < 40 && keys.length < 6; k++) {
    const st = await p.evaluate(() => document.getElementById('qhost').__qzState);
    if (st.phase === 'ask' && keys[keys.length - 1] !== st.key) keys.push(st.key);
    await step(p, 'random'); await p.waitForTimeout(40);
  }
  const off = keys.filter(k => !/^(era|mom|fig):/.test(k));
  if (!keys.length || off.length) throw new Error('Itihaas alone asked something else: ' + off.join(','));
  /* rungs 1–3: an earlier day's misses come back first; known, they are let go; missed, they stay */
  const seeded = await p.evaluate(() => {
    const G = window.IND_GYAN, b = G.bank(), pick = b.khazana.slice(0, 2).concat(b.naksha.slice(0, 1)).map(q => q.key);
    const y = new Date(Date.now() - 864e5), d = y.getFullYear() + '-' + ('0' + (y.getMonth() + 1)).slice(-2) + '-' + ('0' + y.getDate()).slice(-2);
    const miss = {}; pick.forEach(k => { miss[k] = d; });
    window.IND_STORE.kidSet(G.MEM_KEY, JSON.stringify({ miss }));
    return pick;
  });
  await mount(p, 'gyanpati', { level: 3 });
  const st0 = await p.evaluate(() => document.getElementById('qhost').__qzState);
  if (st0.review !== 3) throw new Error(`the ladder re-asks ${st0.review} of yesterday's three misses`);
  const q = await play(p, 'right');
  const first3 = q.answers.slice(0, 3).map(a => a.id).sort().join(',');
  if (first3 !== seeded.slice().sort().join(',')) throw new Error(`rungs 1–3 were ${first3}, not yesterday's misses ${seeded.join(',')}`);
  if (!q.answers.slice(0, 3).every(a => a.review)) throw new Error('the re-asked rungs are not reported as review');
  const mem = await p.evaluate(() => JSON.parse(window.IND_STORE.kidGet(window.IND_GYAN.MEM_KEY)).miss);
  if (seeded.some(k => mem[k])) throw new Error('a re-asked question known on a later day is still on the list');
  await mount(p, 'gyanpati', { level: 3 });
  const q2 = await play(p, 'first-wrong');
  const mem2 = await p.evaluate(() => JSON.parse(window.IND_STORE.kidGet(window.IND_GYAN.MEM_KEY)).miss);
  const missedId = q2.answers.find(a => !a.right).id;
  if (!mem2[missedId]) throw new Error('a missed question was not kept for another day');
  /* scope: a saga chapter asks only what it names */
  await mount(p, 'gyanpati', { scope: { mode: 'ladder', set: ['khazana'] } });
  const sq = await play(p, 'random');
  if (!sq.answers.length || sq.answers.some(a => a.skill !== 'gyanpati.khazana')) throw new Error('a scoped ladder asked outside its scope');
});

check('sprint', 'the sprint is 9+ only, never in Calm, and its clock waits while hidden or on a miss', async ({ p }) => {
  for (const [opts, want] of [[{ band: '11-12' }, true], [{ band: '4-7' }, false], [{ band: '11-12', calm: true }, false]]) {
    await mount(p, 'gyanpati', opts);
    const has = await p.evaluate(() => !!document.querySelector('#qhost [data-mode="sprint"]'));
    if (has !== want) throw new Error(`band ${opts.band}${opts.calm ? ' in Calm' : ''}: the sprint is ${has ? 'offered' : 'hidden'}`);
  }
  await mount(p, 'gyanpati', { band: '11-12' });
  await p.evaluate(() => { document.querySelector('#qhost [data-mode="sprint"]').click(); });
  await p.evaluate(() => { document.querySelector('#qhost [data-go="start"]').click(); });
  await p.waitForTimeout(1300);
  const t = () => p.evaluate(() => document.getElementById('qhost').__qzState);
  const a = await t();
  if (!a.sprint || !(a.timeLeft < 60)) throw new Error('the sprint clock does not run: ' + a.timeLeft);
  /* hidden: no state changes */
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  const h0 = await t(); await p.waitForTimeout(2200); const h1 = await t();
  await p.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
  if (h1.timeLeft !== h0.timeLeft || h1.qIndex !== h0.qIndex) throw new Error(`hidden for 2 s, the sprint moved: ${h0.timeLeft}s → ${h1.timeLeft}s`);
  /* a miss card: the clock waits while it is read */
  await step(p, 'wrong'); await p.waitForTimeout(150);
  const m0 = await t(); await p.waitForTimeout(2200); const m1 = await t();
  if (m0.phase !== 'miss' || m1.timeLeft !== m0.timeLeft) throw new Error(`the clock ran on the miss card: ${m0.timeLeft}s → ${m1.timeLeft}s`);
  const txt = await p.evaluate(() => document.getElementById('qhost').innerText);
  if (/multipl|×|in a row/i.test(txt)) throw new Error('the sprint shows a multiplier');
});

check('parivaar', 'Parivaar: term ids, distinct words in the family\'s language, "in many families", the finish line', async ({ p }) => {
  const terms = await p.evaluate(async () => { if (window.IND_LOAD) await window.IND_LOAD(['content']); return window.IND_RISHTEY.terms.map(t => t.id); });
  const plays = [];
  for (let r = 0; r < 2; r++) {
    await mount(p, 'parivaar', { level: 3 });
    const kind = await p.evaluate(() => document.getElementById('qhost').__shState.kind);
    if (kind !== 'parivaar') throw new Error('the Parivaar chip did not choose the family words');
    const seen = [];
    for (let k = 0; k < 80; k++) {
      const s = await p.evaluate(() => { const h = document.getElementById('qhost'), st = h.__shState;
        const os = [...h.querySelectorAll('.sh-opt .sh-opt-word')];
        return { phase: st.phase, locked: st.locked, id: st.id, words: os.map(o => o.textContent), lang: os.map(o => o.getAttribute('lang')),
                 kick: (h.querySelector('.sh-pkick') || {}).textContent || '' }; });
      if (s.phase === 'q' && !s.locked) seen.push(s);
      const st = await step(p, 'random'); if (st === 'done') break;
      await p.waitForTimeout(20);
    }
    const q = await p.evaluate(() => window.__q);
    if (!q.done) throw new Error('a Parivaar round never finished');
    plays.push(q);
    for (const s of seen) {
      if (new Set(s.words).size !== s.words.length) throw new Error('two options are the same word: ' + s.words.join(' '));
      if (s.lang.some(l => l !== 'hi')) throw new Error('a Hindi family word is not set lang="hi"');
      if (!/in many/i.test(s.kick)) throw new Error('a Parivaar question does not say "in many families": ' + s.kick);
    }
    if (!q.texts.some(t => /Use one of these words on your next family call\./.test(t))) throw new Error('the finish does not keep Rishtey\'s line');
  }
  for (const q of plays) {
    const bad = q.answers.filter(a => !terms.includes(a.id));
    if (bad.length) throw new Error('a Parivaar id is not a Rishtey term id: ' + bad.map(a => a.id).join(','));
    if (q.answers.some(a => a.skill !== 'shabd.parivaar')) throw new Error('a Parivaar report is not skill shabd.parivaar');
  }
  /* the slots and options are shuffled: two plays do not ask in one fixed order */
  const o1 = plays[0].answers.map(a => a.id).join(','), o2 = plays[1].answers.map(a => a.id).join(',');
  if (o1 === o2) throw new Error('two Parivaar rounds asked in the same order: ' + o1);
  /* the family's own language: Tamil words, Tamil script, and no word given twice */
  await mount(p, 'shabd', { level: 3 });
  await p.evaluate(() => { const h = document.getElementById('qhost'); h.querySelector('[data-go="pick"][data-id="ta"]').click(); h.querySelector('[data-go="kind"][data-kind="parivaar"]').click(); h.querySelector('[data-go="start"]').click(); });
  await p.waitForTimeout(150);
  const ta = await p.evaluate(() => { const h = document.getElementById('qhost'); return { lang: [...h.querySelectorAll('.sh-opt-word')].map(o => o.getAttribute('lang')), kick: h.querySelector('.sh-pkick').textContent, kind: h.__shState.kind, pack: h.__shState.pack }; });
  if (ta.pack !== 'ta' || ta.kind !== 'parivaar' || ta.lang.some(l => l !== 'ta') || !/Tamil/.test(ta.kick)) throw new Error('Parivaar did not follow the Tamil pack: ' + JSON.stringify(ta));
  /* a pack with no family words says so, rather than quietly playing Hindi */
  await mount(p, 'shabd', { level: 3 });
  const mr = await p.evaluate(() => { const h = document.getElementById('qhost'); h.querySelector('[data-go="pick"][data-id="mr"]').click();
    const b = h.querySelector('[data-go="kind"][data-kind="parivaar"]'); return { disabled: b.disabled, says: /not in Marathi yet/.test(h.innerText) }; });
  if (!mr.disabled || !mr.says) throw new Error('Marathi has no family words, and Parivaar did not say so: ' + JSON.stringify(mr));
});

check('writeback', 'a missed Shabd word goes into Bhasha\'s review: in Words that slipped a day later, and back in the next round', async ({ p }) => {
  await p.evaluate(() => { const S = window.BI.S; if (S.lang && S.lang.hi) S.lang.hi.srs = {}; });
  await mount(p, 'shabd', { level: 3 });
  await toFirst(p);
  await step(p, 'wrong'); await p.waitForTimeout(150);
  const r = await p.evaluate(() => {
    const h = document.getElementById('qhost'), st = h.__shState, a = window.__q.answers[0];
    const word = a.id.slice(a.id.indexOf(':') + 1), rec = window.BI.S.lang[st.pack];
    const later = window.IND_BHASHA.slipped(st.pack, rec, Date.now() + 864e5).find(x => x.key === 'word:' + word);
    const saved = JSON.parse(localStorage.getItem(window.IND_STORE.kidKey('bi_v1')) || '{}');
    return { word, pack: st.pack, later, saved: !!(saved.lang && saved.lang[st.pack] && saved.lang[st.pack].srs['word:' + word]),
             says: (h.querySelector('.gm-miss') || {}).innerText || '' };
  });
  if (!r.later || !r.later.ready) throw new Error(`the missed word ${r.word} is not in Bhasha's slipped deck, ready, the next day`);
  if (!r.saved) throw new Error('the write-back was not saved through the Store seam');
  if (!/meet it again/.test(r.says)) throw new Error('the miss card does not say the word comes back');
  /* the next day: it comes back as one of the round's review words */
  await p.evaluate(w => { const c = window.BI.S.lang.hi.srs['word:' + w]; c.due = Date.now() - 1000; c.last = Date.now() - 864e5; }, r.word);
  await mount(p, 'shabd', { level: 3 });
  await p.evaluate(() => document.querySelector('#qhost [data-go="start"]').click()); await p.waitForTimeout(100);
  const back = await p.evaluate(() => document.getElementById('qhost').__shState.review || []);
  if (!back.includes(r.word)) throw new Error(`the slipped word ${r.word} did not come back in the next round (${back.join(',')})`);
  /* and a right answer on that later day moves the card up, through Bhasha's own rule */
  const up = await p.evaluate(w => { const h = document.getElementById('qhost'), st = h.__shState;
    const c0 = Object.assign({}, window.BI.S.lang.hi.srs['word:' + w]);
    return { c0, i: st.i, on: h.querySelector('.sh-opt') ? true : false }; }, r.word);
  if (up.c0.lapses < 1) throw new Error('the slipped card lost its miss');
});

check('phone', 'at 390×844 the start buttons sit above the tab bar', async ({ p }) => {
  /* both starts are measured: the host's level chip and Start come first (games spec §1.3,
     docs/32), then the engine's own start — each above the tab bar, each ≥ 44 px */
  const measure = sel => p.evaluate(sel => {
    const b = document.querySelector(sel).getBoundingClientRect();
    const tb = document.querySelector('.bz-tabbar'), t = tb ? tb.getBoundingClientRect() : { top: innerHeight };
    return { top: b.top, bottom: b.bottom, bar: getComputedStyle(tb || document.body).display === 'none' ? innerHeight : t.top, h: b.height };
  }, sel);
  for (const id of ['shabd', 'gyanpati']) {
    await p.evaluate(id => window.BI.go('game', id), id);
    await p.waitForSelector('#gamehost [data-gmh="start"], #gamehost [data-go="start"]', { timeout: 20000 });
    for (const sel of ['#gamehost [data-gmh="start"]', '#gamehost [data-go="start"]']) {
      if (sel.indexOf('data-go') >= 0) {
        await p.evaluate(() => { const s = document.querySelector('#gamehost [data-gmh="start"]'); if (s) s.click(); });
        await p.waitForSelector(sel, { timeout: 20000 });
      } else if (!(await p.$(sel))) continue;
      await p.waitForTimeout(500);
      const m = await measure(sel);
      if (m.bottom > m.bar + 0.5 || m.top < 0) throw new Error(`${id}: the start button (${sel}) is at ${Math.round(m.top)}–${Math.round(m.bottom)}px, the tab bar starts at ${Math.round(m.bar)}px`);
      if (m.h < 44) throw new Error(`${id}: the start button (${sel}) is ${m.h}px tall`);
    }
  }
}, { vp: PHONE });

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await browser.newContext({ viewport: c.vp || DESK, serviceWorkers: 'block', reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      await skipOnboarding(p);
      await p.waitForTimeout(300);
      await c.fn({ p, ctx, base });
      if (errs.length) throw new Error('page error: ' + errs[0]);
      console.log(`  ok   ${c.id.padEnd(10)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(10)} ${c.what}\n         ${String(e.message).split('\n')[0]}`); fail++;
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
