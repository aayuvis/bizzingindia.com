#!/usr/bin/env node
/* Bizzing India — the first run.
   ==================================================================================
   The one screen every family sees and almost nobody tests. It had no check at all
   while it was a single scrolling form, and it has one now because the form became a
   STEP MACHINE — six screens, a branch in the middle, and a typed name that has to
   survive every one of them. A step machine fails in ways a form cannot: a step that
   does not advance, a Back that loses an answer, a branch that appears and strands the
   count, a commit that drops a field on the floor.

   Every check here drives the real app in a real browser and was watched to fail.

   Run:  node tools/check-onboard.js            # all of them
         node tools/check-onboard.js --only commit
*/
const fs = require('fs');
const path = require('path');
const http = require('http');

const APP = path.join(__dirname, '..', 'app');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml',
  '.woff2':'font/woff2', '.webmanifest':'application/manifest+json', '.ico':'image/x-icon',
  '.mp3':'audio/mpeg' };

function serve() {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(APP, p);
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      res.writeHead(404).end('no'); return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

const CHECKS = [];
const check = (id, what, fn) => CHECKS.push({ id, what, fn });

/* a page sitting on the landing, with nothing saved */
async function boot(browser, port, w, h) {
  const p = await browser.newPage({ viewport: { width: w || 1440, height: h || 1000 } });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]');
  await p.waitForTimeout(400);
  return { p, errs };
}
/* A CHECK THAT TIMES OUT HAS NOT SAID ANYTHING. Breaking the age step so it no longer
   advances made two of these fail with "page.click: Timeout 30000ms exceeded", which is
   true, thirty seconds long, and tells whoever broke it nothing. `tap` turns a control
   that never arrived into the sentence the fault deserves, quickly. */
async function tap(p, sel, why) {
  const el = await p.waitForSelector(sel, { timeout: 2500 }).catch(() => null);
  if (!el) throw new Error(`${why || sel} never appeared — the step before it did not advance`);
  await el.click();
  await p.waitForTimeout(250);
}
const headline = p => p.evaluate(() => (document.querySelector('.obhead .mono') || {}).textContent || '');
const saved = p => p.evaluate(() => { try { return JSON.parse(localStorage.getItem('bi_v1') || '{}'); }
                                      catch (e) { return {}; } });

/* the whole flow, in the order a family walks it */
async function walk(p, opts) {
  const o = opts || {};
  await p.fill('#nm', o.name || 'Asha');
  await tap(p, '[data-act="obnext"]', 'the Next button');
  await tap(p, `[data-act="obage"][data-v="${o.age || 9}"]`, 'the age bands');
  if (o.tongue) {
    await tap(p, `.pill[data-act="settongue"][data-id="${o.tongue}"]`, 'the language chips');
    await tap(p, `[data-act="obplace"][data-v="home:${o.home || 'yes'}"]`, 'the placement question');
    if ((o.home || 'yes') === 'yes')
      await tap(p, `[data-act="obplace"][data-v="back:${o.back || 'some'}"]`, 'the follow-up');
  } else {
    await tap(p, '[data-act="obnext"]', 'the skip-the-language button');
  }
  await tap(p, `[data-act="obbuddy"][data-id="${o.buddy || 'pt_tortoise'}"]`, 'the companions');
  await tap(p, `[data-act="obworld"][data-w="${o.world || 'madhubani'}"]`, 'the worlds');
  await tap(p, '[data-act="start"]', 'the Start button');
  await p.waitForTimeout(900);
}

/* ------------------------------------------------------------------ the checks */

check('steps', 'one question per screen, and every answer moves on', async ({ p }) => {
  /* A step that does not advance is the failure this shape exists to avoid — the whole
     point of replacing the form was that an answer IS the Next button. */
  const seen = [];
  const ask = async () => {
    const b = await p.evaluate(() => (document.querySelector('.obbub') || {}).textContent || '');
    seen.push(b.slice(0, 40));
    return b;
  };
  await ask();
  await p.fill('#nm', 'Asha'); await tap(p, '[data-act="obnext"]', 'the Next button');
  await ask();
  await tap(p, '[data-act="obage"][data-v="9"]', 'the age bands');
  await ask();
  await tap(p, '.pill[data-act="settongue"][data-id="ta"]', 'the language chips');
  await ask();
  await tap(p, '[data-act="obplace"][data-v="home:no"]', 'the placement question');
  await ask();
  await tap(p, '[data-act="obbuddy"][data-id="pt_crow"]', 'the companions');
  await ask();
  const uniq = new Set(seen);
  if (uniq.size !== seen.length)
    throw new Error('a step did not advance — the same question twice: ' +
      seen.filter((x, i) => seen.indexOf(x) !== i).join(', '));
  if (seen.length !== 6) throw new Error(`expected six screens, walked ${seen.length}`);
  /* and exactly one question is on screen at a time */
  const bubbles = await p.evaluate(() => document.querySelectorAll('.obbub').length);
  if (bubbles !== 1) throw new Error(`${bubbles} questions on one screen`);
});

check('nameholds', 'the typed name survives every screen, forwards and back', async ({ p }) => {
  /* This is the bug the old form actually had: picking a buddy erased the name, because
     choosing anything re-renders. Two belts hold it now (obKeep and a delegated input
     listener) and this walks all the way in and all the way back out. */
  await p.fill('#nm', 'Meera');
  await tap(p, '[data-act="obnext"]', 'the Next button');
  await tap(p, '[data-act="obage"][data-v="6"]', 'the age bands');
  await tap(p, '.pill[data-act="settongue"][data-id="bn"]', 'the language chips');
  await tap(p, '[data-act="obplace"][data-v="home:yes"]', 'the placement question');
  await tap(p, '[data-act="obplace"][data-v="back:no"]', 'the follow-up');
  /* all the way back to the first screen */
  for (let i = 0; i < 6; i++) {
    const b = await p.$('[data-act="obback"]');
    if (!b) break;
    await b.click(); await p.waitForTimeout(220);
  }
  const v = await p.evaluate(() => { const n = document.querySelector('#nm'); return n ? n.value : '(no box)'; });
  if (v !== 'Meera') throw new Error(`the name came back as "${v}" — it was Meera`);
  const greet = await p.evaluate(() => (document.querySelector('.obbub') || {}).textContent || '');
  if (!/Gattu/.test(greet)) throw new Error('Back did not land on the first question');
});

check('noname', 'a nameless child cannot walk past the first screen', async ({ p }) => {
  await p.click('[data-act="obnext"]');
  await p.waitForTimeout(350);
  const still = await p.evaluate(() => !!document.querySelector('#nm'));
  if (!still) throw new Error('it advanced with an empty name');
  const toast = await p.evaluate(() => (document.querySelector('.toast') || {}).textContent || '');
  if (!/name/i.test(toast)) throw new Error('nothing told the grown-up why it did not move');
});

check('branch', 'the placement step exists only when a language was named', async ({ p }) => {
  /* Asking whether anyone speaks "all of them" at home is not a question. The step count
     has to move with the branch, or the dots lie about how much is left. */
  await p.fill('#nm', 'Asha'); await tap(p, '[data-act="obnext"]', 'the Next button');
  await tap(p, '[data-act="obage"][data-v="11"]', 'the age bands');
  const before = await headline(p);
  if (!/of 5$/.test(before.trim())) throw new Error(`without a language it should be five steps, not "${before}"`);
  await p.click('.pill[data-act="settongue"][data-id="ta"]'); await p.waitForTimeout(350);
  const after = await headline(p);
  if (!/of 6$/.test(after.trim())) throw new Error(`naming a language should add a step, got "${after}"`);
  const q = await p.evaluate(() => (document.querySelector('.obbub') || {}).textContent || '');
  if (!/Tamil/.test(q)) throw new Error('the placement question does not name the language chosen');
});

check('small', 'the first choice is five companions and two worlds, not the whole shop',
  async ({ p }) => {
  /* The old form printed a hundred and sixteen faces under seven headings. A first
     choice between five is a choice; a first choice between a hundred and sixteen is a
     wall. This also fails if a locked one is ever offered — being refused on the
     welcome screen is the worst possible first tap. */
  await p.fill('#nm', 'Asha'); await tap(p, '[data-act="obnext"]', 'the Next button');
  await tap(p, '[data-act="obage"][data-v="9"]', 'the age bands');
  await tap(p, '[data-act="obnext"]', 'the skip-the-language button');
  const buddies = await p.evaluate(() => [...document.querySelectorAll('[data-act="obbuddy"]')]
    .map(b => b.getAttribute('data-id')));
  if (buddies.length !== 5) throw new Error(`${buddies.length} companions offered, not five`);
  const shut = await p.evaluate(ids => {
    const E = window.IND_ECONOMY, P = window.IND_AVATAR_PACKS || [];
    const S = { own: { packs: [], worlds: [] } };
    return ids.filter(id => {
      const pack = P.find(x => x.ids.indexOf(id) >= 0);
      return pack && E && !E.packOpen(S, pack.id);
    });
  }, buddies);
  if (shut.length) throw new Error('offered but locked on day one: ' + shut.join(', '));
  await tap(p, '[data-act="obbuddy"][data-id="pt_mouse"]', 'the companions');
  const worlds = await p.evaluate(() => [...document.querySelectorAll('[data-act="obworld"]')]
    .map(b => b.getAttribute('data-w')));
  if (worlds.length !== 2) throw new Error(`${worlds.length} worlds offered, not two`);
  const paid = await p.evaluate(ws => {
    const E = window.IND_ECONOMY, S = { own: { packs: [], worlds: [] } };
    return ws.filter(w => E && !E.worldOpen(S, w));
  }, worlds);
  if (paid.length) throw new Error('offered but not free on day one: ' + paid.join(', '));
});

check('commit', 'every answer reaches the profile, and nothing else does', async ({ p }) => {
  const before = await saved(p);
  if (before && before.started)
    throw new Error('something was already saved before the flow finished');
  await walk(p, { name: 'Asha', age: 9, tongue: 'ta', home: 'yes', back: 'some',
                  buddy: 'pt_tortoise', world: 'madhubani' });
  const S = await saved(p);
  const want = { name: 'Asha', age: 9, mode: 'bade', tongue: 'ta',
                 buddy: 'pt_tortoise', world: 'madhubani' };
  Object.keys(want).forEach(k => {
    if (S[k] !== want[k]) throw new Error(`${k} saved as ${JSON.stringify(S[k])}, wanted ${JSON.stringify(want[k])}`);
  });
  if (!S.placement || S.placement.home !== 'yes' || S.placement.back !== 'some' || S.placement.lang !== 'ta')
    throw new Error('the placement answers did not reach the profile: ' + JSON.stringify(S.placement));
  if (!S.started) throw new Error('the profile does not say the yatra started');
  /* CHILD DATA IS MINIMAL BY CONSTRUCTION — CLAUDE.md. An age BAND, never a birthdate;
     no email, no photograph, no location, no free text but the first name. */
  const banned = ['email', 'dob', 'birthday', 'birthdate', 'photo', 'avatarPhoto',
                  'location', 'lat', 'lon', 'postcode', 'phone'];
  const has = banned.filter(k => k in S);
  if (has.length) throw new Error('the first run collected ' + has.join(', '));
  if (typeof S.age !== 'number' || S.age < 4 || S.age > 12)
    throw new Error('age is not a band value: ' + JSON.stringify(S.age));
});

check('landed', 'it ends inside the app, not on another screen of setup', async ({ p }) => {
  await walk(p, {});
  const r = await p.evaluate(() => ({
    bar: !!document.querySelector('.topbar'),
    onb: !!document.querySelector('.obbub'),
    tab: (document.querySelector(".navtab.active") || {}).textContent || ""
  }));
  if (r.onb) throw new Error('still onboarding after Start');
  if (!r.bar) throw new Error('the app shell did not build');
  if (!/Home/i.test(r.tab)) throw new Error(`landed on "${r.tab.trim()}" rather than Home`);
});

check('touch', 'a phone can hit every answer, and nothing scrolls sideways', async ({ p }) => {
  /* CLAUDE.md: every game needs both keyboard and touch. A welcome screen is not a game
     and the same thing is true of it — this is the screen most likely to be met on a
     phone, held by a grown-up who has not decided yet. */
  const walkOne = async () => p.evaluate(() => {
    const small = [];
    document.querySelectorAll('[data-act]').forEach(e => {
      const q = e.getBoundingClientRect();
      if (q.width < 1 || q.height < 1) return;
      if (Math.min(q.width, q.height) < 32)
        small.push((e.getAttribute('data-act') || '?') + ' ' + Math.round(q.width) + 'x' + Math.round(q.height));
    });
    return { small, over: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  const bad = [];
  let r = await walkOne(); if (r.over > 1) bad.push(`name screen scrolls sideways by ${r.over}px`);
  bad.push(...r.small);
  await p.fill('#nm', 'Asha'); await tap(p, '[data-act="obnext"]', 'the Next button');
  await tap(p, '[data-act="obage"][data-v="9"]', 'the age bands');
  await tap(p, '[data-act="obnext"]', 'the skip-the-language button');
  r = await walkOne(); if (r.over > 1) bad.push(`the companions scroll sideways by ${r.over}px`);
  bad.push(...r.small);
  if (bad.length) throw new Error(bad.slice(0, 5).join('; '));
});

check('keyboard', 'every answer is a real button, reachable by Tab', async ({ p }) => {
  const r = await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll('[data-act]').forEach(e => {
      const q = e.getBoundingClientRect();
      if (q.width < 1) return;
      if (e.tagName !== 'BUTTON' && e.tabIndex < 0)
        bad.push(e.tagName.toLowerCase() + '[' + e.getAttribute('data-act') + ']');
    });
    return bad;
  });
  if (r.length) throw new Error('not reachable without a mouse: ' + r.join(', '));
  /* and the name box takes a keyboard, obviously, but the Next after it must too */
  await p.fill('#nm', 'Asha');
  await p.focus('[data-act="obnext"]');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(350);
  const moved = await p.evaluate(() => !document.querySelector('#nm'));
  if (!moved) throw new Error('Enter on the Next button did nothing');
});

/* ------------------------------------------------------------------ the runner */
async function main() {
  const only = process.argv.includes('--only')
    ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port;
  const browser = await chromium.launch({
    executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });

  let pass = 0, fail = 0;
  for (const c of CHECKS) {
    if (only && c.id !== only) continue;
    /* touch runs on a phone; everything else on a desktop */
    const ctx = await boot(browser, port, c.id === 'touch' ? 390 : 1440,
                                          c.id === 'touch' ? 844 : 1000);
    try {
      await c.fn(ctx);
      if (ctx.errs.length) throw new Error('the page errored: ' + ctx.errs[0]);
      console.log(`  ok   ${c.id.padEnd(10)} ${c.what}`);
      pass++;
    } catch (e) {
      console.log(`  FAIL ${c.id.padEnd(10)} ${c.what}\n         ${e.message}`);
      fail++;
    }
    await ctx.p.close();
  }
  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
main();
