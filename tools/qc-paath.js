#!/usr/bin/env node
/* Bizzing India — click through Paathshala the way a child does, and log every dead end.
   ==================================================================================
   A parent reported: "when I start clicking on Paathshala modules it ends with nothing
   found." Every unit check in check-paath.js was green at the time. They checked that
   references RESOLVE in the data; none of them followed a link to the screen it opens.
   This does: every course, every part, every stop, every link on every stop, in a real
   browser, and it records what is on the screen at the end of each click — not what the
   data says should be there.

   A dead end is any of:
     - a screen that says "not found", "not loaded" or "nothing"
     - a screen with no real content (under 120 characters of text in #main)
     - a page error
     - a lesson with nothing in it to open or read
     - a link that lands on a view other than the one it names

   Run:  node tools/qc-paath.js            # everything, with a summary
         node tools/qc-paath.js --only gita-course
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const { skipOnboarding } = require('./lib/onboard');

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
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404).end('no'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

const DEAD = /not found|not loaded|nothing found|no such|has not loaded|did not load/i;

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const { chromium } = require('playwright');
  const server = await serve(), port = server.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await skipOnboarding(p);
  /* the course engine is initialised the first time its tab opens */
  await p.evaluate(() => document.querySelector('.navtab[data-v="paath"]').click());
  await p.waitForTimeout(400);

  const courses = await p.evaluate(() => window.IND_PAATH.courses.map(c => ({
    id: c.id, name: c.name,
    mods: c.modules.map(m => ({ id: m.id, name: m.name, review: !!m.needsReview,
      lessons: m.lessons.map(l => ({ n: l.n, k: l.k, use: l.use || {} })) }))
  })));

  /* This app has no URL routing — go() swaps the view in memory — so a lesson is opened
     the way its stop opens it: the engine's own `lesson` action, handed an element with
     the same data attributes the stop carries. */
  const openLesson = (cid, mid, ln) => p.evaluate(([cid, mid, ln]) => {
    const el = document.createElement('button');
    el.setAttribute('data-id', cid); el.setAttribute('data-m', mid); el.setAttribute('data-l', ln);
    window.IND_PAATH_UI.act('lesson', el);
  }, [cid, mid, ln]).then(() => p.waitForTimeout(150));

  /* what is on screen right now, as a reader would see it */
  const screen = () => p.evaluate(() => {
    const m = document.querySelector('#main') || document.body;
    const txt = (m.innerText || '').replace(/\s+/g, ' ').trim();
    return { txt, len: txt.length, player: !!document.querySelector('.pa-wrap.pl'),
             h: ((m.querySelector('h1,h2,h3') || {}).innerText || '').trim().slice(0, 60) };
  });
  const click = sel => p.evaluate(sel => { const b = document.querySelector(sel); if (b) b.click(); return !!b; }, sel)
    .then(async ok => { await p.waitForTimeout(60); return ok; });

  const dead = [], empty = [], held = [], wrong = [], mute = [], leak = [];
  const targets = new Map();      /* every deep link, by what it opens — followed once each */
  let lessons = 0, steps = 0, clicks = 0, asks = 0, nexts = 0;
  const VOICE = path.join(APP, 'voice');

  for (const c of courses) {
    if (only && c.id !== only) continue;
    for (const m of c.mods) {
      for (const l of m.lessons) {
        lessons++;
        await openLesson(c.id, m.id, l.n);
        clicks++;
        const where = `${c.id}/${m.id} "${l.n}"`;
        const L = await screen();
        if (DEAD.test(L.txt) || L.len < 120 || !L.player) {
          dead.push(`${where} — the stop itself: "${L.txt.slice(0, 90)}"`);
          continue;
        }
        if (l.k === 'c') continue;          /* the test screen is the day rule, checked in check-paath */
        /* walk it the way a child does: answer, continue, next — until done */
        let guard = 0, shown = 0;
        while (guard++ < 30) {
          const st = await p.evaluate(() => {
            const w = document.querySelector('.pa-wrap.pl');
            if (!w) return { gone: true };
            const card = w.querySelector('.pl-card');
            const opts = [...w.querySelectorAll('.pl-opt')];
            return {
              done: !!w.querySelector('.pl-card.done'),
              held: !!(card && /still checking this part/i.test(card.innerText)),
              plain: !!(card && /done out loud/i.test(card.innerText)),
              asking: opts.length,
              /* the question screen without its three options — the answer must not be in it */
              askText: opts.length ? (() => { const k = card.cloneNode(true);
                k.querySelectorAll('.pl-opts').forEach(x => x.remove()); return k.innerText; })() : '',
              optsText: opts.map(o => o.innerText.replace(/^\d\s*/, '').trim()),
              deep: [...w.querySelectorAll('.pl-deep')].map(b => ({
                act: b.getAttribute('data-act'), v: b.getAttribute('data-v'), arg: b.getAttribute('data-arg'),
                id: b.getAttribute('data-id'), n: b.getAttribute('data-n'),
                label: b.innerText.replace(/\s+/g, ' ').trim() })),
              /* a clip is real if the app lists it (and then the file must exist) or a human
                 recording of it is registered */
              hear: [...w.querySelectorAll('.pl-hear')].map(b => { const k = b.getAttribute('data-k');
                return { k, human: !!(window.IND_VOICE_HUMAN || {})[k],
                         listed: (window.IND_VOICE || []).indexOf(k) >= 0 }; }),
              hasNext: !!w.querySelector('[data-pa="pnext"]'),
            };
          });
          if (st.gone) { dead.push(`${where} — the player vanished mid-stop`); break; }
          if (st.held) { held.push(where); break; }
          if (st.plain) { empty.push(`${where} (${l.k === 't' ? 'learn' : 'practise'}) — nothing to meet`); break; }
          st.deep.forEach(d => { const k = [d.act, d.v, d.arg, d.id, d.n].join('|');
            if (!targets.has(k)) targets.set(k, Object.assign({ from: where }, d)); });
          st.hear.forEach(h => { if (!h.human && !(h.listed && fs.existsSync(path.join(VOICE, h.k + '.mp3'))))
            mute.push(`${where} — "Hear it" plays nothing: ${h.k}`); });
          if (st.done) {
            /* and the way on: the next stop must land somewhere real */
            if (await click('.pl-card.done .btn.primary')) {
              clicks++; nexts++;
              const N = await screen();
              if (DEAD.test(N.txt) || N.len < 120) dead.push(`${where} → Next — "${N.txt.slice(0, 80)}"`);
            }
            break;
          }
          if (st.asking) {
            asks++;
            const low = st.askText.toLowerCase();
            st.optsText.forEach(o => { /* the right answer is whichever the feedback names; check all three */
              if (o.length > 4 && low.indexOf(o.toLowerCase()) >= 0) leak.push(`${where} — the question shows "${o}"`); });
            await click('.pl-opt'); clicks++;
            const fb = await p.evaluate(() => !!document.querySelector('.pl-card.ask.right, .pl-card.ask.wrong'));
            if (!fb) { wrong.push(`${where} — answering showed no verdict`); break; }
            continue;                        /* the verdict card has its own links; read them next pass */
          }
          shown++; steps++;
          if (!st.hasNext) { wrong.push(`${where} — a card with no way on`); break; }
          await click('[data-pa="pnext"]'); clicks++;
        }
        if (guard >= 30) wrong.push(`${where} — never reached done`);
      }
    }
  }

  /* every deep link, once: does it open something real? */
  let links = 0;
  for (const [k, d] of targets) {
    links++;
    await p.evaluate(d => {
      const b = document.createElement('button');
      ['act', 'v', 'arg', 'id', 'n'].forEach(x => { if (d[x] != null) b.setAttribute('data-' + x, d[x]); });
      (document.querySelector('#main') || document.body).appendChild(b);
      b.click();
    }, d);
    await p.waitForTimeout(150);
    clicks++;
    const S = await screen();
    const lab = `${d.from} → ${d.label} [${d.act}:${d.v || d.id}${d.arg ? ':' + d.arg : ''}${d.n ? ':' + d.n : ''}]`;
    if (DEAD.test(S.txt) || S.len < 120) dead.push(`${lab} — "${S.txt.slice(0, 80)}"`);
    else if (S.player) wrong.push(`${lab} — the click did nothing`);
  }
  await browser.close(); server.close();

  const out = [];
  out.push(`walked ${lessons} stops: ${steps} cards, ${asks} practice questions, ${nexts} next-stop taps; ` +
           `followed ${links} distinct links; ${clicks} clicks`);
  out.push(`  dead ends:            ${dead.length}`);
  out.push(`  stops with nothing:   ${empty.length}`);
  out.push(`  wrong destination:    ${wrong.length}`);
  out.push(`  answer on screen:     ${leak.length}`);
  out.push(`  silent "Hear it":     ${mute.length}`);
  out.push(`  page errors:          ${errs.length}`);
  out.push(`  held for a reviewer:  ${held.length}  (honest, and listed below — not a failure)`);
  console.log(out.join('\n'));
  const show = (title, list) => { if (!list.length) return; console.log(`\n${title}`);
    list.slice(0, 40).forEach(x => console.log('  - ' + x)); if (list.length > 40) console.log(`  … and ${list.length - 40} more`); };
  show('DEAD ENDS', dead);
  show('LESSONS WITH NOTHING IN THEM', empty);
  show('WRONG DESTINATION', wrong);
  show('ANSWER ON SCREEN', leak);
  show('SILENT HEAR-IT', [...new Set(mute)]);
  show('HELD FOR A REVIEWER', held);
  show('PAGE ERRORS', [...new Set(errs)]);
  process.exit(dead.length || empty.length || wrong.length || leak.length || mute.length || errs.length ? 1 : 0);
})();
