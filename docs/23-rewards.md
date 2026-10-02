# 23 — Rewards follow learning

FIX-INDIA batch 2, against the Bizzing family standard §1 (one currency), §6 (rank and
feedback), §8 (no streaks) and §10 (games). The audit's finding in one line: *XP was sikke,
and sikke came from anything — including dice.*

## One wallet, the family's

India's sikke (and the kauris before them) are **Bizzing coins** now, in the one wallet every
Bizzing app shares — `app/bizzing-wallet.js`, a plain-script port of
`integration/bizzing-wallet.js` in aayuvis/Bizzing_Schedule (that one is an ES module; this
app loads classic scripts until the Vite migration). Same key (`bizzing.wallet`), same shape,
same rules — change one, change the other.

| event | coins | where India pays it |
|---|---|---|
| `answer` | 1 | a right answer in Bhasha, the Rishtey quiz, a story's question; a game's mid-run reward |
| `stop` | 5 | a story finished, an epic episode finished |
| `contest` | 10 | a teaching game finished (State Hunt, Festival Frenzy, Jataka Jump, Gyanpati, Trivia Master, Shabd, Sabhyata) |
| `mastery` | 20 | a Bhasha rung tested out |

At most **100 a day**. There is no event for time, logins, taps, dice or luck, so none of them
can pay. **What stopped paying**: Ludo, Saap-Sidi, carrom and the street games (played for their
own sake); "I did it", "said it aloud", "asked at home" and taking a Neeti card — the child's own
word, kept and celebrated, never paid.

**The move was 1:1, once.** `Store` is versioned now (`schemaVersion` 2) and walks a profile up
through `vN_to_vN+1` steps, never down. `v1_to_v2` measures the old sikke; the wallet takes them
at boot with `migrateFrom`, which refuses a second time.

> **A note for the family helper.** `integration/bizzing-wallet.js` counts the `migrated`
> entry toward the same day's 100-coin lid, so a child who brings 300 old coins across earns
> nothing more that day. The port here leaves `migrated` out of the lid; the shared helper
> should do the same.

## Rank moves only on learning

The Gurukul ladder (Shishya → Rishi) used to be `xp / 60`, and xp was coins. It now counts
**evidence only**: Paathshala objectives learned under the day rule, and Bhasha rungs
mastered — thresholds 0 · 1 · 3 · 6 · 10 · 15 · 21 · 28. The home card says how far: *"3 more
things mastered — a course test passed on a later day, or a Bhasha rung."*

## Nothing is random

The pitara — a paid, rarity-weighted draw — is gone. It never gave a duplicate and it published
its rates, and it was still a chance bought with coins. Now a child **chooses who to meet next**
at a printed price (40), always the card they picked. A rare card is not for sale: its card names
the learning that opens it (*mastered 5 things*, *15* for legendary). The real-people packs carry
no rarity at all. A whole pack is still 20 a card.

## No streaks

The home greeting said *"🪔 9-day streak"* and the map carried a streak pill. Both now say
**good days this week** — distinct days in the last seven. A day off costs nothing. Trivia
Master's "Streak ×3" says *"3 in a row"* (the standard's own example of praising a specific).

## Wrong answers hold

A wrong answer in Bhasha used to show the right one for 2.6 seconds and move on by itself. Now
it **waits for Continue** — tap, Enter, or → — and says the right answer aloud in the device's
own voice (no new recordings). Right answers still move on. Trivia's sprint no longer skips past
a wrong one either.

## Gyanpati is scored on what you knew

*Kaun Banega Gyanpati?* was a press-your-luck pot: kauris doubling every rung, a walk-away
offer after each one, a miss dropping you to a safe haven. Now every one of the fifteen rungs is
climbed: a right answer lights it, a miss is taught and waits for *Aage*, and the end card says
*"You knew 11 of 15 — the 4 you met today are yours now too."* No pot, nothing to double, nothing
to walk away with.

## What holds it — `tools/check-rewards.js`

| check | holds | broken to prove it |
|---|---|---|
| `coins` | standard amounts; a number or invented event pays 0; ≤ 100 a day; the top bar shows the wallet | `earn()` accepting a number |
| `luck` | no luck/dexterity game on the paying list, and payouts go through it | Ludo added to the list |
| `rank` | 30 mastery-worth of coins do not move rank; a mastered rung does | rank read from coins |
| `random` | no `Math.random` in the economy, no draw/pitara/drop rate; choosing gives that card | a die put back in economy.js |
| `streaks` | no streak count on home, map, Mela or Me, nor on any game card | "-day streak" restored |
| `hold` | a wrong answer is still there after 4 s with Continue; → moves on | `settle()` always advancing |
| `migrate` | 137 sikke → 137 coins, schema 2, and not again on the next boot | the v1→v2 step skipped |
| `gyanpati` | no pot / kauris / walk-away; a miss is taught and the climb goes on | the pot label restored |
