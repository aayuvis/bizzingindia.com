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
- **The frame never moves a game.** Its wrong-answer shake was a `transform` on the frame, the
  ancestor of every game — and a transform on an ancestor becomes the box `position: fixed` is
  measured from, so Sabhyata's full-window game fell into a 100px strip on the page for every
  shake ("every click refreshes to home and back", 3 Oct). The shake is the title row's now.
  And a game with its own voice is not read for answers: Sabhyata classes its *good* news
  `warm`, which the frame had been sounding as a wrong answer on nearly every action.

Found on the way: four games' own end cards still said *"3 kauris"* — a coin nothing paid any
more. They are gone; coins are announced only by the wallet's toast when actually paid.

**One hub, and a finish that stays (audit C5/H5/N3/F4/G9, 3 Oct 2026).** There were two game hubs:
the Play tab's flat list, its tiles at uneven heights, and the painted Mela that a game's back pill
returned to — so a child who started on Play finished somewhere else. Play *is* the painted Mela now
(`#/mela` and `#/khel` are old names for it), with Rishtey, Gully and Geet as its *From home* shelf;
a stall's blurb is three lines, so a row has no hole under its short ones; a game's back pill, the
finish and Sabhyata's own exit all say **Play**. And a game used to jump back to the hub 0.9 s after
it said done — the street games say done on their last move, so they ended with no screen at all.
Every game now ends on **the host's finish card**, which stays until the child chooses: what they
practised, their score and their **best** (kept per child, `S.best`, and shown on the stall), the
coins the wallet actually took in, and *Play again* / *Back to Play*. An engine's own end card
still shows first; its *Back to the Mela* button now reads *Finish* and leads there.

## A new rank is said to the child (L4, J3)

The Gurukul rank counts mastery only (docs/23), and when it moved it told the Hive and nobody else.
Now `checkGrowth()` holds a **ceremony, once per rank**: what the word means (*a sadhak is one who
practises*), how many things were mastered to reach it, the next rank and its number, and the rank's
**sash** — earned, never sold (`buyExtra` refuses one), with *Wear it* right there. A rank reached
before this build goes on the shelf without a fanfare; the demo has none; and the Sadhak medal,
which is the same moment, is not celebrated a second time.

## What the companion wears (K6)

Cosmetics were six things (four frames, two carrom boards). There are now **five outfits** from the
weaving and flower traditions, each named with where it is made — a marigold garland; a bandhani
dupatta (Gujarat, Rajasthan); a phulkari shawl (Punjab); an ikat stole (Odisha, Telangana); an ajrakh
stole (Kutch) — at printed prices, plus the **eight rank sashes**. Nothing marks a faith, a caste or a
community: cloth and flowers only. `wearer()` draws the frame and the outfit over the companion
everywhere it appears — Me, the finish card, the ceremony, the shop — across the chest, where every
one of the 96 portraits has one.

## Medals from evidence (§8)

Twelve, in the family medallion (a struck disc, bronze · silver · gold, the glyph in the field):
first story, ten, fifty; first place lit, ten (the brief's example), all of India; first Bhasha
rung (the brief's other example), three; a course test passed on a later day, five; a project
the workshop marked; the rank of Sadhak. Each is **earned by something the app saw** — never by
*"I did it"*, never by days in a row, never by coins — and **celebrated once**, then kept on the
child's shelf with its date. The unearned ones say how to earn them. Evidence from **before**
medals existed — an older profile, or mastery first measured when its engine loads — goes on the
shelf **quietly**: a celebration is for what was just done, never a pop-up over whatever the child
is doing now (the gate caught exactly that pop-up covering a course page).

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
| `still` | Sabhyata stays the whole window, every frame, through utsav, explore and grow; no ancestor of a game is transformed; no wrong-answer sound for its news; the quiz shake never lands on the frame | the shake back on `.gframe`; Sabhyata read for answers again |
| `currency` | no game end card names coins it did not pay | a *kauris* chip put back in Shabd |
| `medals` | a story earns *First story*, celebrated with motion and sound, **once**; self-report earns none; unearned medals say how | the once-only guard removed |
| `aaj` | story → lesson → look back → a finish card naming the story and the words; Home says done | the story dropped from the finish card |
| `locks` | every visible lock on Me, Worlds, the Hindi path, Paathshala and a course says how to open | the rung's "Opens after … or test out" removed |
| `games` (finish) | the end card's button lands on the host's finish — score, best, *what you practised*, Play again / Back to Play — still there after 2 s; the stall then shows the best | the old host (back to the Mela after 0.9 s) |
| `hub` | `#/play` is the painted hub with the family shelf; `#/mela` and `#/khel` are the same; a game's way back is Play; no row has a blurb > 3 lines taller than its neighbour | the old flat Play; the three-line clamp removed |
| `rankup` | a new rank is one ceremony with its meaning and count; its sash is given and *Wear it* dresses the companion on Me; not said twice; a sash cannot be bought; ≥ 5 outfits | the ceremony's push removed (only the medal showed) |

Run: `node tools/check-motivation.js` (or `--only medals`).
