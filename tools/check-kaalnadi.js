#!/usr/bin/env node
/* Bizzing India — Kaal Nadi, the River of Time (games spec §5.1, §8 T13; docs/32).

     cards      K2 every card is a data-itihaas.js moment with its era's sources[]; its `when` is
                the data's own words, and its parsed span reads back out of them
     sensitive  K4 no card from an era gated 11+, held for review or partition-gated, and no
                card whose words touch Partition, caste, famine, communal or colonial violence
     contested  K3 a `when` the data marks as argued never reaches answer(): it sits in the
                unscored "Historians are still arguing" lane, and five full river rounds report
                nothing for it
     random     K1 a random placer scores under 20% on the river (L3): exactly, over every card
                and bank, and in five played rounds of random taps
     miss       a wrong first answer holds with the miss card ("Not quite.", the answer, Aage)
                and nothing new renders until Aage — then Enter moves on
     keys       a whole L1 round and a whole L4 round played with the keyboard alone; one
                answer() per item, done() with asked = items
     touch      a whole L2 round by tapping two cards to swap; a card dragged onto a bank on L3
     levels     every level plays to done() with a perfect bot, and answer() is called exactly
                once per item, never with a contested id
     phone      at 390×844 nothing a child must tap is off the side of the screen, the action
                row is in view, and targets are ≥ 44px
     gate       review: true, opened by the owner (9 Oct 2026): every child plays, the page says no
                historian has checked it; take `open` away and the reviewer's wait returns
     shots      desktop and phone, day and night (written to KN_SHOTS, default the scratch dir)

   Each was watched to fail by breaking the thing it holds (see the commit).
   Run:  node tools/check-kaalnadi.js            # all of them
         node tools/check-kaalnadi.js --only miss
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const os = require('os');
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
const DESK = { width: 1280, height: 800 }, PHONE = { width: 390, height: 844 };
const SHOTS = process.env.KN_SHOTS || path.join(os.tmpdir(), 'kaalnadi-shots');
const CHECKS = [];
const check = (id, what, fn, o) => CHECKS.push(Object.assign({ id, what, fn }, o || {}));
const GAME = 'kaalnadi';

/* mount the engine where the real host puts it (#gamehost), with the contract's opts */
async function mount(p, opts) {
  await p.evaluate(() => window.BI.go('game', 'kaalnadi'));
  await p.waitForSelector('#gamehost', { timeout: 20000 });
  await p.evaluate(({ opts }) => {
    const old = document.getElementById('gamehost'), h = old.cloneNode(false);
    old.replaceWith(h);   /* the host's own instance is detached and tears itself down */
    window.__ans = []; window.__done = null;
    const g = window.IND_GAMES.find(x => x.id === 'kaalnadi');
    window.__td = g.engine(h, Object.assign({ level: 1, band: '8-10', scope: null, calm: false, reduced: false }, opts,
      { answer: r => window.__ans.push(r) }), r => { window.__done = r; });
  }, { opts: opts || {} });
  await p.waitForSelector('.kn', { timeout: 20000 });
  await p.waitForTimeout(150);
}
const ST = p => p.evaluate(() => { const s = document.getElementById('gamehost').__knState; return { phase: s.phase, kind: s.item && s.item.kind, level: s.level }; });
const phase = p => p.evaluate(() => document.getElementById('gamehost').__knState.phase);
async function waitPhase(p, want, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < (ms || 4000)) { const ph = await phase(p); if (want.includes(ph)) return ph; await p.waitForTimeout(60); }
  return phase(p);
}
/* the right answer for the item on screen, from the engine's own seam (never the DOM) */
const rightOf = p => p.evaluate(() => {
  const it = document.getElementById('gamehost').__knState.item, g = window.IND_GAMES.find(x => x.id === 'kaalnadi');
  if (it.kind === 'pair') return { kind: it.kind, pick: it.cards.indexOf(it.order[0]), wrong: it.cards.indexOf(it.order[1]) };
  if (it.kind === 'evidence') return { kind: it.kind, pick: it.answer, wrong: (it.answer + 1) % it.options.length };
  if (it.kind === 'odd') return { kind: it.kind, pick: it.row.indexOf(it.odd), wrong: (it.row.indexOf(it.odd) + 1) % it.row.length };
  if (it.kind === 'bank') { const B = g.engine.banks(); const ok = B.map((b, i) => g.engine.overlaps(it.card, b) ? i : -1).filter(i => i >= 0);
    return { kind: it.kind, pick: ok[0], wrong: B.findIndex((b, i) => !ok.includes(i)) }; }
  if (it.kind === 'order') return { kind: it.kind, order: it.order.map(c => c.id) };
  return { kind: it.kind };
});
/* play the item on screen right (or wrong) by clicking, as a child would */
async function play(p, right) {
  const r = await rightOf(p);
  if (r.kind === 'order') {
    for (let i = 0; i < r.order.length; i++) {
      const ids = await p.$$eval('.kn-row .kn-card', els => els.map(e => e.getAttribute('data-id')));
      const want = right ? r.order[i] : r.order[r.order.length - 1 - i];
      const at = ids.indexOf(want);
      if (at !== i) { await p.click(`.kn-row .kn-card[data-slot="${at}"]`); await p.click(`.kn-row .kn-card[data-slot="${i}"]`); }
    }
    await p.click('[data-kn="lock"]');
  } else if (r.kind === 'bank') await p.click(`.kn-bank[data-bank="${right ? r.pick : r.wrong}"]`);
  else if (r.kind === 'evidence') await p.click(`.kn-opt[data-opt="${right ? r.pick : r.wrong}"]`);
  else await p.click(`.kn-card[data-pick="${right ? r.pick : r.wrong}"]`);
  const ph = await waitPhase(p, ['miss', 'right', 'ask', 'done'], 1500);
  if (ph === 'miss') await p.click('[data-gm="aage"]');
}
async function playOut(p, right, cap) {
  for (let n = 0; n < (cap || 12); n++) {
    if (await p.evaluate(() => !!window.__done)) return;
    await waitPhase(p, ['ask', 'done'], 4000);
    if (await p.evaluate(() => !!window.__done)) return;
    await play(p, typeof right === 'function' ? right(n) : right);
  }
}

check('cards', 'K2: every card is a data moment with its era\'s sources[]', async ({ p }) => {
  const r = await p.evaluate(() => {
    const g = window.IND_GAMES.find(x => x.id === 'kaalnadi'), S = g.engine.cardSet(), bad = [];
    const eras = {}; window.IND_ITIHAAS.eras.forEach(e => { eras[e.id] = e; });
    S.cards.concat(S.arguing).forEach(c => {
      const e = eras[c.era], m = e && e.moments[+c.id.split('.').pop()];
      if (!m) { bad.push(c.id + ' is not a moment'); return; }
      if (m.what !== c.what || m.when !== c.when) bad.push(c.id + ' words differ from the data');
      if (!Array.isArray(c.sources) || !c.sources.length || c.sources.join() !== (e.sources || []).join()) bad.push(c.id + ' sources');
      if (c.badge !== 'itihaas') bad.push(c.id + ' badge');
      if (!c.contested) { const ys = (c.when.match(/\d{3,4}/g) || []).map(Number); if (!ys.includes(Math.abs(c.lo)) && !/the \d+s/.test(c.when)) bad.push(c.id + ' span ' + c.lo + ' not read from "' + c.when + '"'); }
    });
    return { n: S.cards.length, a: S.arguing.length, bad };
  });
  if (r.n < 30) throw new Error('only ' + r.n + ' cards');
  if (r.bad.length) throw new Error(r.bad.slice(0, 4).join(' · '));
});

check('sensitive', 'K4: no card from a held era, none touching Partition, caste, famine, communal or colonial violence', async ({ p }) => {
  const r = await p.evaluate(() => {
    const g = window.IND_GAMES.find(x => x.id === 'kaalnadi'), S = g.engine.cardSet();
    const held = window.IND_ITIHAAS.eras.filter(e => e.needs_review || (e.gate || 0) >= 11 || e.partition_gate).map(e => e.id);
    const RX = /\b(partition|caste|famines?|riots?|massacres?|communal|jallianwala|uprising|executions|jailed)\b|fire on/i;
    return { held, bad: S.cards.concat(S.arguing).filter(c => held.includes(c.era) || RX.test(c.what + ' ' + c.when)).map(c => c.id) };
  });
  if (!r.held.length) throw new Error('no era is held — the check would hold nothing');
  if (r.bad.length) throw new Error('sensitive cards dealt: ' + r.bad.join(', '));
});

check('contested', 'K3: argued dates sit in the unscored lane and never reach answer()', async ({ p }) => {
  const arg = await p.evaluate(() => window.IND_GAMES.find(x => x.id === 'kaalnadi').engine.cardSet().arguing.map(c => c.id));
  if (!arg.length) throw new Error('the data marks no date as argued — nothing to hold');
  let lane = 0;
  for (let r = 0; r < 5; r++) {
    await mount(p, { level: 3 });
    if (await p.$('.kn-lane[data-arguing]')) lane++;
    if (await p.$('.kn-lane [data-pick], .kn-lane button')) throw new Error('the arguing lane has something to tap');
    await playOut(p, n => n % 2 === 0);
    const ids = await p.evaluate(() => window.__ans.map(a => a.id));
    const hit = ids.filter(id => arg.some(a => id.indexOf(a) >= 0));
    if (hit.length) throw new Error('a contested card was scored: ' + hit[0]);
  }
  if (!lane) throw new Error('the "Historians are still arguing" lane never showed');
  /* and no level ever deals one as a scored card */
  for (let L = 1; L <= 5; L++) {
    const leak = await p.evaluate(({ L, arg }) => {
      const h = document.createElement('div'); document.body.appendChild(h);
      const g = window.IND_GAMES.find(x => x.id === 'kaalnadi'); let out = [];
      for (let t = 0; t < 6; t++) {
        const td = g.engine(h, { level: L, answer: () => {} }, () => {});
        const it = h.__knState.item; const s = JSON.stringify(it ? (it.cards || it.row || [it.card]).map(c => c && c.id) : []);
        arg.forEach(a => { if (s.indexOf('"' + a + '"') >= 0) out.push(a); }); td();
      }
      h.remove(); return out;
    }, { L, arg });
    if (leak.length) throw new Error('level ' + L + ' dealt a contested card: ' + leak[0]);
  }
});

check('random', 'K1: a random placer scores under 20% on the river', async ({ p }) => {
  const exact = await p.evaluate(() => {
    const g = window.IND_GAMES.find(x => x.id === 'kaalnadi'), S = g.engine.cardSet(), B = g.engine.banks();
    const used = S.cards.filter(c => B.some(b => g.engine.overlaps(c, b)));
    return used.reduce((a, c) => a + B.filter(b => g.engine.overlaps(c, b)).length / B.length, 0) / used.length;
  });
  if (!(exact < 0.2)) throw new Error('a random placer expects ' + (exact * 100).toFixed(1) + '%');
  let right = 0, n = 0;
  for (let r = 0; r < 5; r++) {
    await mount(p, { level: 3 });
    for (let k = 0; k < 5; k++) {
      if (await p.evaluate(() => !!window.__done)) break;
      if ((await waitPhase(p, ['ask', 'done'], 4000)) === 'done') break;
      const nb = await p.$$eval('.kn-bank', e => e.length);
      await p.click(`.kn-bank[data-bank="${Math.floor(Math.random() * nb)}"]`);
      if ((await waitPhase(p, ['miss', 'right'], 1500)) === 'miss') await p.click('[data-gm="aage"]');
    }
    await p.waitForTimeout(1300);
    const a = await p.evaluate(() => window.__ans); right += a.filter(x => x.right).length; n += a.length;
  }
  console.log(`         random placer: exact ${(exact * 100).toFixed(1)}%, played ${right}/${n}`);
  if (n < 20) throw new Error('only ' + n + ' placements were judged');
});

check('miss', 'a wrong answer holds with the miss card until Aage', async ({ p }) => {
  for (const L of [1, 3, 4]) {
    await mount(p, { level: L });
    const before = await p.evaluate(() => JSON.stringify(document.getElementById('gamehost').__knState.item.kind) + document.querySelector('.kn-q').textContent + document.querySelector('.kn-step').textContent);
    const r = await rightOf(p);
    if (r.kind === 'bank') await p.click(`.kn-bank[data-bank="${r.wrong}"]`);
    else if (r.kind === 'evidence') await p.click(`.kn-opt[data-opt="${r.wrong}"]`);
    else await p.click(`.kn-card[data-pick="${r.wrong}"]`);
    await p.waitForTimeout(2200);
    const m = await p.evaluate(() => {
      const c = document.querySelector('.gm-miss');
      return c && { not: /Not quite\./.test(c.textContent), ans: !!c.querySelector('.gm-ans') && c.querySelector('.gm-ans').textContent.length > 5,
        teach: !!c.querySelector('.gm-teach'), aage: !!c.querySelector('[data-gm="aage"]'),
        step: document.querySelector('.kn-q').textContent + document.querySelector('.kn-step').textContent, n: window.__ans.length, right: window.__ans[0] && window.__ans[0].right };
    });
    if (!m) throw new Error('L' + L + ': no miss card after a wrong answer');
    if (!m.not || !m.ans || !m.teach || !m.aage) throw new Error('L' + L + ': the miss card is missing a part ' + JSON.stringify(m));
    if (!before.endsWith(m.step.slice(-12)) || m.n !== 1 || m.right !== false) throw new Error('L' + L + ': the miss did not hold, or reported ' + m.n);
    await p.keyboard.press('Enter');
    await p.waitForTimeout(250);
    const after = await p.evaluate(() => ({ miss: !!document.querySelector('.gm-miss'), step: document.querySelector('.kn-step').textContent }));
    if (after.miss || after.step === m.step.slice(-after.step.length)) throw new Error('L' + L + ': Enter did not press Aage');
  }
});

check('keys', 'whole rounds by keyboard alone: L1 (1/2, Enter) and L4 (1–3, Enter)', async ({ p }) => {
  for (const L of [1, 4]) {
    await mount(p, { level: L });
    for (let n = 0; n < 10; n++) {
      if (await p.evaluate(() => !!window.__done)) break;
      if ((await waitPhase(p, ['ask', 'done'], 4000)) === 'done') break;
      const r = await rightOf(p);
      await p.keyboard.press(String((n % 3 === 0 ? r.wrong : r.pick) + 1));
      if ((await waitPhase(p, ['miss', 'right'], 1500)) === 'miss') await p.keyboard.press('Enter');
    }
    await p.waitForTimeout(1400);
    const d = await p.evaluate(() => ({ d: window.__done, a: window.__ans }));
    if (!d.d) throw new Error('L' + L + ': the keyboard round never finished');
    if (d.d.asked !== d.a.length || d.d.firstTryRight !== d.a.filter(x => x.right).length) throw new Error('L' + L + ': done() disagrees with answer(): ' + JSON.stringify(d.d));
    if (new Set(d.a.map(x => x.id)).size !== d.a.length) throw new Error('L' + L + ': an item was reported twice');
    if (d.a.some(x => x.firstTry !== true || typeof x.skill !== 'string')) throw new Error('L' + L + ': a report breaks the contract shape');
  }
});

check('touch', 'by touch: an L2 round by tapping two cards to swap; a card dragged onto a bank', async ({ p }) => {
  await mount(p, { level: 2 });
  for (let n = 0; n < 6; n++) {
    if (await p.evaluate(() => !!window.__done)) break;
    if ((await waitPhase(p, ['ask', 'done'], 4000)) === 'done') break;
    const r = await rightOf(p);
    for (let i = 0; i < r.order.length; i++) {
      const ids = await p.$$eval('.kn-row .kn-card', els => els.map(e => e.getAttribute('data-id')));
      const at = ids.indexOf(r.order[i]);
      if (at !== i) { await p.tap(`.kn-row .kn-card[data-slot="${at}"]`); await p.tap(`.kn-row .kn-card[data-slot="${i}"]`); }
    }
    await p.tap('[data-kn="lock"]');
    if ((await waitPhase(p, ['miss', 'right'], 1500)) === 'miss') throw new Error('a correct tapped order was marked wrong');
  }
  await p.waitForTimeout(1400);
  const d = await p.evaluate(() => window.__done);
  if (!d || d.asked < 3 || d.firstTryRight !== d.asked) throw new Error('the tapped L2 round did not finish all right: ' + JSON.stringify(d));
  /* a drag, with a mouse, from the card onto a right bank */
  await mount(p, { level: 3 });
  const r = await rightOf(p);
  const a = await (await p.$('.kn-now .kn-card')).boundingBox(), b = await (await p.$(`.kn-bank[data-bank="${r.pick}"]`)).boundingBox();
  await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down();
  await p.mouse.move(a.x + a.width / 2 + 20, a.y + a.height / 2 + 20, { steps: 4 });
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 }); await p.mouse.up();
  await p.waitForTimeout(200);
  const ans = await p.evaluate(() => window.__ans);
  if (ans.length !== 1 || !ans[0].right) throw new Error('dragging the card onto its bank did not place it right: ' + JSON.stringify(ans));
}, { touch: true });

check('levels', 'every level plays to done() with a perfect bot; one answer() per item', async ({ p }) => {
  for (let L = 1; L <= 5; L++) {
    await mount(p, { level: L });
    await playOut(p, true);
    await p.waitForTimeout(1400);
    const d = await p.evaluate(() => ({ d: window.__done, a: window.__ans }));
    if (!d.d) throw new Error('L' + L + ' never finished');
    if (d.d.level !== L || d.d.asked !== d.a.length || d.d.firstTryRight !== d.d.asked || !d.d.win) throw new Error('L' + L + ' perfect round: ' + JSON.stringify(d.d));
    if (d.d.levelNext !== Math.min(5, L + 1)) throw new Error('L' + L + ': 100% should offer the next level, got ' + d.d.levelNext);
  }
});

check('phone', 'at 390×844: nothing to tap off the side, the action row in view, targets ≥ 44px', async ({ p }) => {
  for (let L = 1; L <= 5; L++) {
    await mount(p, { level: L });
    const r = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('.kn button, .kn [data-slot]').forEach(el => {
        const b = el.getBoundingClientRect(); if (!b.width) return;
        if (b.left < -1 || b.right > innerWidth + 1) out.push('off the side: ' + el.className);
        if (b.height < 44 || b.width < 44) out.push('small: ' + el.className + ' ' + Math.round(b.width) + '×' + Math.round(b.height));
      });
      const over = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth;
      if (over > 0) out.push('page ' + over + 'px wider than the phone');
      /* the action row sits above the shell's fixed tab bar, never under it */
      const bar = document.querySelector('.bz-tabbar'), floor = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
      const lock = document.querySelector('[data-kn="lock"]');
      if (lock) { const b = lock.getBoundingClientRect(); if (b.bottom > floor || b.top < 0) out.push('Lock karo is out of view at ' + Math.round(b.top) + ' (floor ' + Math.round(floor) + ')'); }
      return out;
    });
    if (r.length) throw new Error('L' + L + ': ' + r.slice(0, 3).join(' · '));
  }
}, { vp: PHONE });

check('gate', 'review: true and owner-opened (9 Oct 2026) — every child plays it, its page says no reviewer has checked it; without `open` the wait returns', async ({ p }) => {
  const reg = await p.evaluate(() => { const g = window.IND_GAMES.find(x => x.id === 'kaalnadi'); return { review: g.review, open: g.open, teaches: g.teaches, levels: g.levels.length, sub: typeof g.sub }; });
  if (reg.review !== true || reg.teaches !== true || reg.levels !== 5 || reg.sub !== 'string') throw new Error('registry entry: ' + JSON.stringify(reg));
  /* the owner's decision is recorded as `open`, never as a sign-off: review stays true */
  if (!reg.open || reg.open.by !== 'owner' || reg.open.to !== 'everyone' || !reg.open.on || !reg.open.why) throw new Error('no owner `open` record: ' + JSON.stringify(reg.open));
  await p.evaluate(() => window.IND_STORE.saveDevice('tester', false));
  try {
    /* the host's gate: outside tester mode #/game/kaalnadi opens its frame, with the note */
    await p.evaluate(() => window.BI.go('game', 'kaalnadi')); await p.waitForTimeout(500);
    const hg = await p.evaluate(() => ({ frame: !!document.getElementById('gamehost'), note: (document.querySelector('#gframe .gf-unchecked') || {}).textContent || '' }));
    if (!hg.frame) throw new Error('outside tester mode the host did not open Kaal Nadi');
    if (!/Not yet checked/.test(hg.note) || !/historian/.test(hg.note)) throw new Error('the game page does not say no historian has checked it: ' + JSON.stringify(hg.note));
    /* the engine's own gate, mounted directly: cards are dealt */
    const mountK = () => p.evaluate(() => {
      document.querySelectorAll('#gamehost').forEach(x => x.remove());
      const h = document.createElement('div'); h.id = 'gamehost'; document.getElementById('main').appendChild(h);
      window.__ans = []; window.__done = null;
      const g = window.IND_GAMES.find(x => x.id === 'kaalnadi');
      window.__td = g.engine(h, { level: 1, band: '8-10', scope: null, calm: false, reduced: false, answer: r => window.__ans.push(r) }, r => { window.__done = r; });
    });
    await mountK();
    await p.waitForSelector('.kn', { timeout: 20000 }); await p.waitForTimeout(150);
    const w = await p.evaluate(() => ({ wait: !!document.querySelector('.kn-wait'), card: !!document.querySelector('.kn-card') }));
    if (w.wait || !w.card) throw new Error('owner-opened, but outside tester mode the card set did not show: ' + JSON.stringify(w));
    /* and the gate itself still works: take `open` away and the reviewer's wait returns */
    await p.evaluate(() => { const g = window.IND_GAMES.find(x => x.id === 'kaalnadi'); window.__open = g.open; delete g.open; if (typeof window.__td === 'function') window.__td(); });
    await mountK(); await p.waitForSelector('.kn', { timeout: 20000 }); await p.waitForTimeout(150);
    const w2 = await p.evaluate(() => ({ wait: !!document.querySelector('.kn-wait'), card: !!document.querySelector('.kn-card') }));
    await p.evaluate(() => { const g = window.IND_GAMES.find(x => x.id === 'kaalnadi'); g.open = window.__open; if (typeof window.__td === 'function') window.__td(); });
    if (!w2.wait || w2.card) throw new Error('without the owner\'s `open`, an unsigned card set still showed: ' + JSON.stringify(w2));
  } finally { await p.evaluate(() => window.IND_STORE.saveDevice('tester', true)); }
});

check('shots', 'desktop and phone, day and night', async ({ p }) => {
  fs.mkdirSync(SHOTS, { recursive: true });
  for (const [vp, tag] of [[DESK, 'desk'], [PHONE, 'phone']]) for (const night of [false, true]) for (const L of [1, 3, 4]) {
    await p.setViewportSize(vp);
    await p.evaluate(n => { if (n) document.documentElement.setAttribute('data-mode', 'night'); else document.documentElement.removeAttribute('data-mode'); }, night);
    await mount(p, { level: L });
    await p.evaluate(n => { if (n) document.documentElement.setAttribute('data-mode', 'night'); else document.documentElement.removeAttribute('data-mode'); }, night);
    if (L === 3) { const r = await rightOf(p); await p.click(`.kn-bank[data-bank="${r.wrong}"]`); await p.waitForTimeout(200); }
    await p.evaluate(() => document.querySelector('.kn').scrollIntoView({ block: 'start' }));
    await p.screenshot({ path: path.join(SHOTS, `kn-L${L}-${tag}-${night ? 'night' : 'day'}.png`), fullPage: false });
  }
  console.log('         screenshots in ' + SHOTS);
});

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port, base = `http://127.0.0.1:${port}/?tester=1`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    const ctx = await browser.newContext({ viewport: c.vp || DESK, serviceWorkers: 'block', hasTouch: !!c.touch });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(base, { waitUntil: 'networkidle' });
      await skipOnboarding(p);
      await p.evaluate(() => window.IND_LOAD(['content', 'voice', 'games']));
      await c.fn({ p, ctx, base });
      if (errs.length) throw new Error('page error: ' + errs[0]);
      console.log(`  ok   ${c.id.padEnd(10)} ${c.what}`); pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(10)} ${c.what}\n         ${process.env.FULLERR ? e.message : String(e.message).split('\n')[0]}`); fail++;
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
