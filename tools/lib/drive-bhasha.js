/* tools/lib/drive-bhasha.js — answer a Bhasha session RIGHT, through the real UI, until it
   ends. The same moves tools/verify.js makes (introduce beats, options, tiles, the keypad,
   tracing), lifted out so a check that only needs "get through a lesson" does not carry
   two hundred lines of it. window.BI_FAST skips the right-answer pause. */
async function driveLesson(page, max) {
  await page.evaluate(() => { window.BI_FAST = true; });
  for (let k = 0; k < (max || 40); k++) {
    try {
      /* the end of the arc counts whatever the lock says: the last answer leaves it set */
      await page.waitForFunction(() => { const z = window.BI.quizState(); return !!(z.over || (z.q && !z.lock)); }, { timeout: 5000 });
    } catch {
      const z = await page.evaluate(() => { const q = window.BI.quizState(); return { lock: q.lock, hold: q.hold, over: q.over,
        type: q.q && q.q.type, fb: !!document.querySelector('#qfb.show') }; });
      throw new Error('the lesson stalled at beat ' + k + ' ' + JSON.stringify(z));
    }
    const st = await page.evaluate(() => {
      const z = window.BI.quizState(), q = z.q;
      if (!q) return { over: true };
      return { type: q.type, intro: q.type === 'introduce',
        answerIndex: typeof q.answerIndex === 'number' ? q.answerIndex : null,
        answer: Array.isArray(q.answer) ? q.answer : null, letter: q.letter ? q.letter.char : null,
        produce: q.kind === 'produce' ? q.answer : null, done: z.done };
    });
    if (st.over) { await page.evaluate(() => { window.BI_FAST = false; }); return true; }
    if (st.intro) { await page.evaluate(() => document.querySelector('[data-act="gotit"]').click()); }
    else if (st.produce) {
      for (const ch of [...st.produce]) await page.evaluate(c => { const b = [...document.querySelectorAll('.pkey')].find(x => x.getAttribute('data-c') === c); if (b) b.click(); }, ch);
      await page.evaluate(() => document.querySelector('[data-act="pdone"]').click());
    } else if (st.type === 'trace') {
      await page.evaluate(ch => { const c = document.getElementById('tInk').getContext('2d'); c.fillStyle = '#000'; c.textAlign = 'center';
        c.textBaseline = 'middle'; c.font = '360px Mukta, "Noto Sans Devanagari", sans-serif'; c.fillText(ch, 256, 268); }, st.letter);
      const box = await page.locator('#tInk').boundingBox(), cx = box.x + box.width / 2, cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy); await page.mouse.down(); await page.mouse.move(cx + 6, cy + 3, { steps: 2 }); await page.mouse.up();
      await page.evaluate(() => document.querySelector('[data-act="tcheck"]').click());
    } else if (st.answer && (await page.$('.btile'))) {
      for (const part of st.answer) await page.evaluate(p => { const b = [...document.querySelectorAll('.btile:not(.used)')].find(x => x.getAttribute('data-ch') === p); if (b) b.click(); }, part);
    } else if (st.answerIndex !== null) {
      await page.evaluate(i => document.querySelector(`[data-act="ans"][data-i="${i}"]`).click(), st.answerIndex);
    } else throw new Error('no way to answer a ' + st.type + ' beat');
    await page.waitForTimeout(80);
  }
  throw new Error('the lesson did not end');
}
module.exports = { driveLesson };
