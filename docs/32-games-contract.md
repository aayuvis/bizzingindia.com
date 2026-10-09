# 32 — The game contract (games spec §1, owner 8–9 Oct 2026)

Every game in `window.IND_GAMES` is built to this. The host (`mountGame()` in `app/app.js`) owns
the level chip, the counter, the sounds for answers, the pay and the finish card. An engine owns
its board, its questions and its miss card. Nothing here is guessed from CSS any more.

## Registration

```js
window.IND_GAMES.push({
  id: 'naksha', name: 'Naksha', sub: 'find it on the map',     // sub: the one-line English subtitle
  blurb: '…', icon: 'map', minutes: 4, tag: 'Bhugol',
  teaches: true,                                               // false for the heritage games
  levels: ['big states by name', 'capitals', 'clues', 'neighbours', 'rivers'],  // what L1–L5 mean here
  review: false,                                               // true = tester mode only until signed
  engine: function (host, opts, done) { … return teardown; }
});
```

## What the host passes

```js
opts = {
  skin:   null | 'theme-…',          // a bought theme/mode, as before
  level:  1..5,                      // the child's chosen level (host's chip; default last played)
  band:   '4-7' | '8-10' | '11-12',  // the child's age band
  scope:  null | { mode, set: [] },  // a saga chapter's scope: ask ONLY this
  answer: function (r) {},           // report EVERY judged item, once, at its first attempt
  calm:   bool, reduced: bool        // Calm mode / reduced motion: no countdowns, no flourish
}
```

## What the engine reports

```js
opts.answer({ id: 'KL', right: true, firstTry: true, skill: 'naksha.capital', objective: null });
done({ win, score, asked, firstTryRight, level, levelNext });
```

- **One `answer()` per item**, at the first attempt. A retry after a miss never calls it again.
- The host plays the right/wrong sound **from these reports only** (one sound per answer). An
  engine never plays `right`/`wrong` itself.
- The counter ("N right this game") and the finish card read only these reports. A game that never
  calls `answer` (Ludo, Carrom, Pallanguzhi) shows **no counter**.

## Pay (the one path, games spec §1.2)

| Event | Pays |
|---|---|
| A first-try right in a `teaches` game | `answer` 1 — at most 10 a round, and once per item id per day |
| A saga chapter restored with its skill shown | `stop` 5, once per chapter per child |
| Gyanpati rung 10+ on first-try rights, no lifelines | `contest` 10, once a day |
| Mastery evidence (later-day re-check) | `mastery` 20, only through the mastery ledger |
| Finishing, playing, time, dice, a heritage game | **0** |

## The level rule

After `done`: first-try right / asked ≥ 50% keeps the level; < 50% drops it one (never below 1);
≥ 80% **offers** the next level (never forces it). Stored per game, per child (`S.lvl[gameId]`).

## The miss card (every teaching engine)

A wrong first answer **holds**: no new item renders until the child presses **Aage**. Markup:

```html
<div class="gm-miss" role="status"><b>Not quite.</b> <span class="gm-ans">…the right answer…</span>
  <p class="gm-teach">…its one-line teach…</p>
  <button class="btn gm-aage" data-gm="aage">Aage →</button></div>
```

No elimination guessing (greying options until one is left). No "in a row", no streaks, no
multipliers. Number keys 1–4 pick options in every multiple-choice screen; Enter presses Aage.

## Clock and sound

Every timer or physics loop is `requestAnimationFrame` with delta time and stops on
`visibilitychange` (hidden = no state change). All sound goes through `window.IND_SFX.play(kind)`
so mute, Calm and ducking apply. No private `AudioContext`.

## Stage

The play area is centred; on a phone it takes the full width and anything a child must tap sits
above the tab bar (390 × 844). Tap targets ≥ 44 px. Painted plates fill the stage, day and night;
nothing structural (a map, a wheel, letters) is painted into a plate — the app draws it.

## Editorial

docs/05 outranks any game idea. Never a date, a fact or a quotation from memory — every item
comes from the app's sourced data. Content the spec sends to the named reviewer registers with
`review: true` and opens only in tester mode (`?tester=1`) until signed.
