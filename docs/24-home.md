# 24 — Home, in the family's anatomy

FIX-INDIA B1 (home layout), B2 (one Continue), B3 (progress on home), A3 (time to first
learning) and A5 (demo mode), against the Bizzing family standard §2, §4 and §14.

The audit's finding: Home was **nine blocks** — greeting with the deed and the word, the
ring, resume tiles, two journey cards, Ask Nani, a subhashita, three "on now" tiles, the
yatra and the mala — and on a phone the only way in, *Start — hear a story*, sat below the
fold under the deed button. A parent landing on it could not say what the one next thing
was, because the screen offered eleven.

## The anatomy

Five parts, in this order (`V.home` in `app/app.js`):

1. **The greeting** — the companion with a speech bubble that says something true about
   what the child did last (`helloLine()`, from `S.last`: *"You finished The Squirrel Who
   Built the Bridge — and the mist lifted off Tamil Nadu"*), with **the day's ring** and the
   **word of the hour** beside it.
2. **ONE Continue card** — painted, with the single next step, a progress bar, and **the
   only filled button on the screen**. Beside it, **where the child is**: their Gurukul rank
   with a bar to the next one (rank counts mastery evidence only, docs/23), and the map with
   its place count read from the map itself — the audit found *34* on Home and *36* on the
   map.
3. **Today's three** — the day's deed, this week's question for a grandparent (or the
   festival of the month), and the subhashita of the hour. Small and optional: *nothing is
   lost for skipping*.
4. **Five ways in** — Stories, Paathshala, Bhasha, Moral Science, Play — each saying
   something true today (*18 of 344 heard*, *1 language started*).

The yatra and the mala moved to the child's own page, which the avatar in the top bar
opens. On a 390×844 phone the Continue button sits at ~615px, above the tab bar at 776px.

**Said once, and quiet beside Continue (audit, 3 Oct 2026).** The Continue card said *Finish it and
the mist lifts off Odisha* twice — as its chip and again as its bar's caption — and the bar was the
map's place count, beside a map card already counting places. The chip says what finishing does; the
bar is how far into *this* story, captioned with its length (*9 scenes · about 5 min*). The shell
draws Aaj ka's arrow in Continue's own filled orange, so Home had two orange calls a hand apart; it is
an outline now, recoloured through the family's `--bz-*` variables only. And at night the two plates
dim with the page (an overlay over the painting) — they had stayed in full daylight.

## One next step — `nextStep()`

Home's Continue and the Hive's `#/continue` are **the same function**, so there can never
be two "next" lessons that disagree. It takes whatever the child was in the middle of most
recently:

| thread | read from | opens |
|---|---|---|
| a story left part-way | `S.resume.story` — now with the scene | the story **at that scene**, not the start |
| a course stop | `S.resume.paath` + `IND_PAATH_UI.next()` — the course page's own frontier | that stop, at its first card |
| a language lesson | `S.resume.pack` + `bNext(bPath())` — the SRS path | the lesson **already under way** |
| nothing open | `storyOfDay()` | tonight's story — the same one the landing offered |

`primeStep()` sets each one up before its screen paints; both doors call it. Nothing in
`nextStep()` stores its own idea of progress.

## The first story before any setup (A3)

The landing's **Read it →** used to open onboarding. It now plays tonight's story at once,
read aloud, as a guest — no name, no age, nothing stored about the child. At the story's
end the setup is asked for (*"Tell us your child's first name and age, and Tamil Nadu stays
lit on their map"*), and the story stays read and its place lit through setup. After setup,
Continue is one tap from a story.

A guest earns nothing: the family wallet pays a named child, and there is none yet.

**The landing works as a page (owner, 3 Oct 2026: "no marketing site/screenshots — look at Bizzing
Bee").** Bee's hero lets a stranger spell a real word with the real audio; ours lets them hear a
real story. *Read it here, aloud* now plays tonight's story **inside the landing's own card** — the
painting, the voice, scene by scene, its question, its end — on the same page, beside *Start free*
and the sample child, instead of on a screen of its own behind a guest bar. The three feature
cards are gone: a parent sees the thing itself, then one line about privacy. There are no
screenshots and never were; `check-home firstlearn` now holds both (the reader in the hero, no
feature grid, no screenshot) and was watched to fail with the story put back on its own screen.

## `?demo` — a sample child in a sandbox (A5)

`app/demo.js` loads **first**, before anything reads storage, and with `?demo` in the
address swaps the page's `localStorage` for an in-memory one. Everything the demo writes —
the profile, the family wallet, the Hive's feed, a course record — is gone when the tab
closes, and the real household on the device is never read or written. That is kept by
construction, not by remembering to check a flag at every write; if the swap cannot be made
there is no demo. Recorded voices are not kept either (`Store._db` refuses in the demo).

The sample child, Meera, is built by `seedDemo()` the way a child would build her: eighteen
real stories finished with their places lit, the first Tamil rung met and mastered and three
lessons into the second, a course part taught and its test passed on a later day, a mala of
nine deeds on the days they were done, and coins paid through the wallet's own `earn()` on
those days. A Tamil family on purpose: the app leans to the family's language, and Hindi is
not India. Every screen carries the **Sample child** bar with a way out.

## What holds it — `tools/check-home.js`

| check | holds | broken to prove it |
|---|---|---|
| `anatomy` | greeting · one Continue · today's three · ≤ 6 ways in, and nothing else | the mala strip put back on Home |
| `primary` | exactly one filled button on Home, Continue, at 1280 and 390 | *Open the map* made a filled button |
| `fold` | at 390×844 Continue is on screen above the tab bar | the card's picture made 504px tall |
| `onenext` | Continue and `#/continue` open the same screen from the same storage — new child, story part-way (same scene), language lesson (under way), course stop | `continueTarget()` returning the story shelf |
| `progress` | rank, two bars and the map's own place count beside Continue | the place count typed as 34 |
| `firstlearn` | *Read it* plays a story with no setup; its end asks for setup; the story and its place survive setup; a story is one tap after it | *Read it* sent back to onboarding |
| `demo` | labelled *Sample*, weeks of progress, and every real key byte-for-byte unchanged after using it | the sandbox removed |
| `night` | at night each Home plate is ≤ 60% as bright as by day, measured on the screen's pixels; Continue says its chip once | the night overlay removed (78%); the caption put back (said twice) |

Run: `node tools/check-home.js` (or `--only fold`).
