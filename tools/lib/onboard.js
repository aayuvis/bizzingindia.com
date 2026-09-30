/* tools/lib/onboard.js — walk a fresh browser through the first run.
   ==================================================================================
   ONE WALKER, BECAUSE EIGHTEEN HARNESSES BOOT THIS APP. Every one of them used to do
   the same two lines — type a name, press Start — which worked while onboarding was a
   single scrolling form. The day it became six screens, every one of those harnesses
   failed with `Timeout 30000ms exceeded waiting for [data-act="start"]`, which says
   nothing about onboarding and everything about a copy-pasted fixture.

   So the walk lives here. Change the flow, change this file, and the suites keep
   running. A harness that wants to TEST the flow rather than get past it uses
   tools/check-onboard.js, which deliberately does not import this. */

/* the fastest honest path to a started profile: a name, an age band, no language
   (so the placement step never appears), the first companion and the first world */
async function skipOnboarding(p, opts) {
  const o = opts || {};
  const tap = async (sel, why) => {
    const el = await p.waitForSelector(sel, { timeout: 4000 }).catch(() => null);
    if (!el) throw new Error(`onboarding stalled: ${why || sel} never appeared`);
    await el.click();
    await p.waitForTimeout(o.beat || 220);
  };
  /* the landing, when it is showing */
  await p.click('[data-act="begin"]').catch(() => {});
  await p.waitForTimeout(250);
  /* already started — nothing to walk */
  if (!(await p.$('#nm'))) { await p.waitForTimeout(200); return false; }

  await p.fill('#nm', o.name || 'Asha');
  await tap('[data-act="obnext"]', 'the Next button');
  await tap(`[data-act="obage"][data-v="${o.age || 9}"]`, 'the age bands');
  if (o.tongue) {
    await tap(`.pill[data-act="settongue"][data-id="${o.tongue}"]`, 'the language chips');
    await tap(`[data-act="obplace"][data-v="home:${o.home || 'no'}"]`, 'the placement question');
    if ((o.home || 'no') === 'yes')
      await tap(`[data-act="obplace"][data-v="back:${o.back || 'some'}"]`, 'the follow-up');
  } else {
    await tap('[data-act="obnext"]', 'the skip-the-language button');
  }
  await tap(`[data-act="obbuddy"][data-id="${o.buddy || 'pt_tortoise'}"]`, 'the companions');
  await tap(`[data-act="obworld"][data-w="${o.world || 'delhi6'}"]`, 'the worlds');
  await tap('[data-act="start"]', 'the Start button');
  await p.waitForTimeout(o.settle || 600);
  return true;
}

module.exports = { skipOnboarding };
