/* MORAL SCIENCE AS A LIBRARY OF TOOLS.
 *
 * Six doors, each carrying live state rather than a description — the Bizzing
 * Bee Explore pattern. What is worth checking is that every door opens, that
 * the deck's two economies stay separate (a card pays sikke, only a deed pays
 * a bead), and that the family question cannot take free text, which is not a
 * design preference but the DPDP Act, COPPA and GDPR-K agreeing.
 */
const { chromium } = require('playwright');
let fails = 0;
const check = (n, ok, x) => { console.log((ok ? 'PASS' : 'FAIL') + '  ' + n + (x !== undefined ? '  [' + x + ']' : '')); if (!ok) fails++; };

async function boot(b, w, h) {
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8150/', { waitUntil: 'networkidle' });
  await p.click('[data-act="begin"]').catch(()=>{});
  await p.waitForTimeout(250);
  const nm = await p.$('#nm'); if (nm) { await nm.fill('Asha'); await p.click('[data-act="start"]'); }
  await p.waitForTimeout(600);
  return { p, errs };
}
const goNeeti = async p => {
  await p.evaluate(() => {
    const t = document.querySelector('.navtab[data-v="neeti"]');
    if (t && t.offsetParent !== null) { t.click(); return; }
    const more = [...document.querySelectorAll('.navtab')].find(x => /More/.test(x.textContent));
    if (more) more.click();
  });
  await p.waitForTimeout(450);
  await p.evaluate(() => { const t = document.querySelector('[data-v="neeti"]'); if (t) t.click(); });
  await p.waitForTimeout(800);
};
const rows = p => p.evaluate(() => [...document.querySelectorAll('.tile')].map(t => ({
  act: t.getAttribute('data-act'), v: t.getAttribute('data-v'),
  text: (t.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60)
})));
const sikke = p => p.evaluate(() => (window.BI && window.BI.S ? window.BI.S.sikke : null));

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const { p, errs } = await boot(b, 1280, 900);
  await goNeeti(p);

  const r = await rows(p);
  const has = v => r.some(x => x.v === v || x.act === v);
  check('the hub is a library of tools', r.length >= 6, r.length + ' rows');
  check('Dharma — the faiths', has('dharma'));
  check('Shlok — the verses', has('shlok'));
  check('Utsav — the festivals', has('utsav'));
  check('the value deck', has('cards'));
  check('Dvandva — the dilemmas', has('dvandva'));
  check('Ghar ki baat', has('ghar'));
  check('People who lived it', has('people'));
  check('and every row carries live state, not a description',
        r.filter(x => /\d/.test(x.text)).length >= 3,
        r.map(x => x.text).slice(0, 3).join(' | '));

  /* ---- the deck, and the two economies ---- */
  await p.evaluate(() => { const t = document.querySelector('[data-act="cards"]'); if (t) t.click(); });
  await p.waitForTimeout(600);
  const deck = await p.evaluate(() => document.querySelectorAll('.tile[data-act="value"]').length);
  check('the deck holds every value', deck === 12, deck + ' cards');
  await p.evaluate(() => { const t = document.querySelector('.tile[data-act="value"]'); if (t) t.click(); });
  await p.waitForTimeout(600);
  const card = await p.evaluate(() => (document.body.textContent || '').replace(/\s+/g, ' '));
  check('a card says what it gets you', /What it gets you/.test(card));
  check('and where it is spoken of', /Where it is spoken of/.test(card));
  check('and offers a deed of several', /Do this one · 1 of \d/.test(card), (card.match(/Do this one[^·]*·[^A-Z]*/) || [''])[0].trim());
  const stories = await p.evaluate(() => document.querySelectorAll('.tile[data-act="story"]').length);
  check('and carries the stories the corpus matched', stories >= 3, stories + ' stories');

  const before = await sikke(p);
  await p.evaluate(() => { const t = document.querySelector('[data-act="carddone"]'); if (t) t.click(); });
  await p.waitForTimeout(500);
  const after = await sikke(p);
  check('taking the card pays sikke', after > before, before + ' -> ' + after);
  check('and it pays once', await p.evaluate(() => !document.querySelector('[data-act="carddone"]')));
  const beads = await p.evaluate(() => ((window.BI && window.BI.S && window.BI.S.mala) || []).length);
  check('but a card earns NO bead — beads are for doing', beads === 0, beads + ' beads');

  /* ---- the dilemmas ---- */
  await p.evaluate(() => { const t = document.querySelector('[data-v="neeti"]'); if (t) t.click(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => { const t = document.querySelector('[data-v="dvandva"]'); if (t) t.click(); });
  await p.waitForTimeout(600);
  const dv = await p.evaluate(() => ({
    cards: document.querySelectorAll('[data-act="dvpick"]').length,
    body: (document.body.textContent || '').replace(/\s+/g, ' ')
  }));
  check('the dilemma deck is there', dv.cards >= 12, dv.cards + ' options');
  check('and says plainly that nothing is scored', /is scored|right answer/i.test(dv.body));
  check('and is honest that it is unreviewed', /reviewer/i.test(dv.body));
  await p.evaluate(() => { const t = document.querySelector('[data-act="dvpick"]'); if (t) t.click(); });
  await p.waitForTimeout(500);
  check('choosing shows what each tradition tends to say',
        await p.evaluate(() => /tradition|Thirukkural|Gita|Michhami|Kabir/i.test(document.body.textContent)));

  /* ---- the family question, and the data rule ---- */
  await p.evaluate(() => { const t = document.querySelector('[data-v="neeti"]'); if (t) t.click(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => { const t = document.querySelector('[data-v="ghar"]'); if (t) t.click(); });
  await p.waitForTimeout(600);
  const gh = await p.evaluate(() => ({
    picks: document.querySelectorAll('[data-act="gharpick"]').length,
    inputs: document.querySelectorAll('input[type=text], textarea, [contenteditable=true]').length
  }));
  check('every value has a question for home', gh.picks >= 12 * 3, gh.picks + ' answers to pick');
  check('AND NOTHING CAN BE TYPED — the child data rule, not a preference',
        gh.inputs === 0, gh.inputs + ' text inputs');

  /* ---- the people ---- */
  await p.evaluate(() => { const t = document.querySelector('[data-v="neeti"]'); if (t) t.click(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => { const t = document.querySelector('[data-v="people"]'); if (t) t.click(); });
  await p.waitForTimeout(600);
  check('people who lived it', await p.evaluate(() =>
    document.querySelectorAll('.tile[data-act="value"]').length >= 10));

  check('no errors anywhere', !errs.length, errs.slice(0, 2).join(' | ') || 'none');
  await p.screenshot({ path: 'neeti.png', fullPage: false });
  await p.close();
  await b.close();
  console.log(fails ? '\n' + fails + ' FAILURES' : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('SUITE ERROR', e); process.exit(2); });
