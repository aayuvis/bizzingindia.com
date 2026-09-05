/* EIGHT CITIES HAVE A BOARD; TWENTY-THREE DO NOT.
   There is no kit mode any more — a city draws a built board if a board was
   drawn for it, and the rest keep their painted plates because no kit has been
   made for them yet. That is coverage, not a setting.

   So the question this suite asks is not "does the kit work" — the build suite
   asks that — but the one that outlives the switch: does having two renderers
   in one game break the cities that are still paintings? It exists because it
   caught exactly that. Three checks that asked a GLOBAL mode instead of the
   city were each wrong for the twenty-three, and the worst would have taken
   the walk-camera away from every one of them. */
const { chromium } = require('playwright');
let fails = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS' : 'FAIL') + '  ' + n + (x !== undefined ? '  [' + x + ']' : '')); if (!ok) fails++; };

const SAVE = () => {
  const st = {};
  window.IND_SABHYATA.sites.forEach(s => {
    st[s.id] = { lv: 2, zzz: false, fade: -1, idle: 0, seen: true, found: true,
                 bld: { granary: 1 }, mon: false, neg: 0,
                 jobs: { kisan: 2, karigar: 1, kathakar: 1, rakshak: 0 }, hero: null };
  });
  localStorage.setItem('india.sabhyata.v2', JSON.stringify({
    era: 3, res: { anna: 900, kala: 900, katha: 900 }, sites: st, routes: [], t: 40,
    utsav: 0, ev: null, score: 0, won: false, quests: {}, qdone: 0, lastq: 0, tech: {},
    proj: null, rt: 0, warn: null, wonders: {}, capital: null, disp: null, lastd: 0,
    quizAt: {}, quizN: 0, kingdoms: {}, lastraid: 0, explorers: [] }));
};
const shut = async p => {
  for (let i = 0; i < 5; i++) {
    const bt = await p.$('#sab-ovhost [data-sab-act="ovclose"], #sab-ovhost .sab-btn');
    if (!bt) return;
    await bt.click({ timeout: 1500 }).catch(()=>{});
    await p.waitForTimeout(180);
  }
};
async function boot(b, url) {
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(SAVE);
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(()=>{});
  await p.waitForTimeout(150);
  const nm = await p.$('#nm'); if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(350);
  await p.click('.navtab[data-v="khel"]'); await p.waitForTimeout(250);
  await p.click('.ghero'); await p.waitForTimeout(650);
  await shut(p);
  return { p, errs };
}
/* two real taps a real gap apart — the game counts the pair itself */
const open = async (p, id) => {
  await p.evaluate(id => {
    const hit = () => { const g = document.getElementById('sab-' + id); if (!g) return;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click'])
        g.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })); };
    hit();
    return new Promise(r => setTimeout(() => { hit(); r(); }, 120));
  }, id);
  await p.waitForTimeout(900);
  await shut(p);
};
const look = p => p.evaluate(() => {
  const scene = document.querySelector('.sab-scene');
  if (!scene) return null;
  const cam = document.getElementById('sab-cam');
  const np = document.querySelector('.sab-nameplate span');
  return {
    board: scene.classList.contains('iskit'),
    plate: !!document.querySelector('.sab-hero'),
    cam: cam ? (cam.style.transform || '') : 'no cam',
    ledger: np ? np.textContent.replace(/\s+/g, ' ').trim() : '',
    buildable: !!(document.querySelector('.sab-dhandle') || document.querySelector('[data-sab-act="build"]')),
    grow: !!document.querySelector('[data-sab-act="grow"]'),
  };
});
const leave = async p => {
  for (let i = 0; i < 3 && await p.evaluate(() => !!document.querySelector('.sab-scene')); i++) {
    await p.keyboard.press('Escape'); await p.waitForTimeout(320);
  }
  await shut(p);
};

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  /* ---- 1 · the default, and the seam it creates ---- */
  const { p, errs } = await boot(b, 'http://localhost:8150/');
  check('nothing has to be asked for — there is no mode',
        await p.evaluate(() => typeof window.IND_KIT_MODE === 'undefined'));
  check('and no switch is offered to break it with',
        await p.evaluate(() => !document.querySelector('[data-sab-act="kittoggle"]')));
  const kitIds = await p.evaluate(() => Object.keys(window.IND_KIT_CITIES || {}));
  const allIds = await p.evaluate(() => window.IND_SABHYATA.sites.map(s => s.id));
  const plateIds = allIds.filter(i => kitIds.indexOf(i) < 0);
  console.log('  ' + kitIds.length + ' cities with a board, ' + plateIds.length + ' still painted');

  const boards = [], flat = [], noCam = [], noGrow = [], shut2 = [];
  for (const id of allIds) {
    await open(p, id);
    const r = await look(p);
    if (!r) { shut2.push(id); continue; }
    const wantBoard = kitIds.indexOf(id) >= 0;
    if (r.board !== wantBoard) (wantBoard ? flat : boards).push(id);
    /* a painting is a wide picture the camera pushes into; a board is not */
    const idle = !r.cam || /scale\(1\)/.test(r.cam);
    if (!wantBoard && idle) noCam.push(id);
    if (!r.grow) noGrow.push(id);
    await leave(p);
  }
  check('every city opens', !shut2.length, shut2.join(', ') || 'all ' + allIds.length);
  check('the eight with kit data draw a board', !flat.length, flat.join(', ') || 'all eight');
  check('the rest keep their paintings', !boards.length, boards.join(', ') || plateIds.length + ' painted');
  check('and a painting still has its camera', !noCam.length, noCam.join(', ') || 'all following');
  check('every city still offers Grow', !noGrow.length, noGrow.join(', ') || 'all ' + allIds.length);
  check('no errors thrown', !errs.length, errs.slice(0, 2).join(' | ') || 'none');

  /* ---- 2 · A STALE PREFERENCE MUST NOT STRAND ANYONE ----
     While the kit was a test the built/painted switch wrote '0' into
     'ind.kit', and the bootstrap only ever asked whether it was '1' — so those
     zeroes meant nothing and plenty are lying around. When the kit briefly
     became a default that honoured any stored value, a '0' written months ago
     during a comparison pinned that browser to the old painted city, with no
     bell and no full screen. That is what got reported. Nothing reads the key
     now; this makes sure nothing starts to again. */
  await p.evaluate(() => { localStorage.setItem('ind.kit', '0'); localStorage.setItem('ind.kit2', '0'); });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  check('an old stored preference cannot turn the boards off',
        await p.evaluate(() => typeof window.IND_KIT_MODE === 'undefined'));
  check('no errors', !errs.length, errs.slice(0, 2).join(' | ') || 'none');
  await p.close();

  await b.close();
  console.log(fails ? '\n' + fails + ' FAILURES' : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('SUITE ERROR', e); process.exit(2); });
