# 26 — Sound, games, medals, celebration, five minutes, and locks that explain themselves

FIX-INDIA F3 (game polish), I4 (medals from evidence), J1 (celebration moments), E1 (a short
daily session) and C4 (gating), against the Bizzing family standard §8, §9 and §10.

## One small sound set — `app/sfx.js`

Five soft sounds — *tap · right · wrong · win · medal* — made by the Web Audio API, so there is
**no recording and no file** (the owner's rule: no new voice files; the device's own voice reads
aloud). A wrong answer is a low note, never a buzzer. **One mute**: the *Sound* row in the
child's menu in the top bar; `window.IND_SFX_MUTED()` is asked before every sound, and nothing
plays until the first real tap.

## Every game gets the same frame (§10)

The fourteen engines were written at different times and each does its own thing. Rather than
edit fourteen engines, the **host gives every game the frame**:

- a **title card** with a one-line how-to and *"Tap to play — or use the keyboard"*, which folds
  to a title row after three seconds or the first tap and never covers the board;
- a **sound** and a **motion** on every answer — read off the one convention the engines already
  share, a status line toned `good` or `warm`;
- a **finish** that says *What you practised* — inserted above the end card's buttons, found by
  the other shared convention, `[data-go="out"]`;
- dice and street games say they are **played for fun** and pay no coins (docs/23).

Found on the way: four games' own end cards still said *"3 kauris"* — a coin nothing paid any
more. They are gone; coins are announced only by the wallet's toast when actually paid.

## Medals from evidence (§8)

Twelve, in the family medallion (a struck disc, bronze · silver · gold, the glyph in the field):
first story, ten, fifty; first place lit, ten (the brief's example), all of India; first Bhasha
rung (the brief's other example), three; a course test passed on a later day, five; a project
the workshop marked; the rank of Sadhak. Each is **earned by something the app saw** — never by
*"I did it"*, never by days in a row, never by coins — and **celebrated once**, then kept on the
child's shelf with its date. The unearned ones say how to earn them.

## Celebration that names what was done (J1)

A new medal opens a short celebration — the medal spins in, a ring of diyas bursts, the medal
sound plays — and names it: *"First story — hear a whole story, start to finish — and you did."*
It never mentions another child. A finished Bhasha lesson's card (which already named the four
things met, in the script) now moves and sounds; a finished story plays *win*. Reduced motion is
respected everywhere.

## Aaj ka — five minutes that end (E1)

From Home's *Today's three*: **a story** (tonight's), **four new things** in the family's
language (its next lesson), and **a look back** — three questions from stories heard on *earlier*
days, which is the spaced recall that makes a story stay (328 of 344 stories carry a question).
A wrong answer holds until Continue, like everywhere. It **ends** on a card that says what was
done, by name — *"You heard The Squirrel Who Built the Bridge. You met नमस्ते · हाँ · नहीं · अच्छा.
You looked back and knew 2."* — and Home's tile says *Done for today ✓*. There is no count of
days; skipping costs nothing. A strip on the story and the lesson says which step you are on and
leads back.

## Locks say how to open (C4)

Audited every lock a child can see: the language rungs (*"Opens after Varnamala — or test out"*),
course projects (*"Opens when you pass the test above"*), worlds and companion packs (a printed
price in coins earned by learning), premium courses (*"A grown-up unlocks this"*), unearned medals
(*"How to earn it: …"*). All already did; a test now holds them to it.

## What holds it — `tools/check-motivation.js`

| check | holds | broken to prove it |
|---|---|---|
| `sfx` | a wrong answer sounds *wrong*, a right one *right*; with the mute on nothing plays | `settle()` without its sound |
| `games` | every game has a how-to and a *what you practised*; its title card folds after 3 s; Gyanpati played to the end sounds and moves on every answer and at the finish | the fold timer removed |
| `currency` | no game end card names coins it did not pay | a *kauris* chip put back in Shabd |
| `medals` | a story earns *First story*, celebrated with motion and sound, **once**; self-report earns none; unearned medals say how | the once-only guard removed |
| `aaj` | story → lesson → look back → a finish card naming the story and the words; Home says done | the story dropped from the finish card |
| `locks` | every visible lock on Me, Worlds, the Hindi path, Paathshala and a course says how to open | the rung's "Opens after … or test out" removed |

Run: `node tools/check-motivation.js` (or `--only medals`).
