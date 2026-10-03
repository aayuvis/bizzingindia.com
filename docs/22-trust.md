# 22 — Trust: the back button, the grown-ups' door, and where a fact comes from

The October 2026 family audit (FIX-INDIA, against the
[Bizzing family standard](https://github.com/aayuvis/Bizzing_Schedule/blob/claude/amazing-knuth-4aemgz/docs/family/FAMILY-STANDARD.md))
found four things a parent should never have to discover. This is what changed, and what
holds each one. `tools/check-trust.js` drives all of it in a real browser.

## 1. Back never leaves the app

`go()` used to swap the view in memory and nothing else, so browser Back — or a phone's —
went straight out of the app: from the map to `about:blank`, in the audit.

Every screen now has a route, `#/<view>/<arg>`, and `go()` writes it as a history entry.
Back walks those entries. `history.state` carries the argument with its own type, so a
number stays a number; the hash is only parsed for a link typed or shared from outside.

- **A shared link opens its screen.** `#/state/KL`, `#/story/<id>`, `#/paath/gita-course`.
  Back from the first screen of a visit lands on Home, not outside the app.
- **`#/continue` is the Hive's door** (standard §4, §13): the one next thing — a story left
  part-way, then a language pack left part-way, then the story shelf.
- **`?from=hive`** puts one chip in the top bar, *← my day*, back to the Hive.
- **The list of routes is read from `render()` itself**, so a screen added there is
  routable without a second list that can drift.
- A screen reached by Back gets the same setup its own button gives it (`prepView`): a story
  opens at its start, a language pack on a fresh round.

**And no dead ends (audit, 3 Oct 2026).** `#/value` and `#/verses` with nothing after them showed
the error page; `#/kosh` said a bare *Pack not found.* and `#/kahani` *This shelf is not here.* —
no peacock, no way on. Every screen that names one thing has the shelf it sits on (`HUB_OF` in
app.js): opened on nothing it **is** that shelf (the address is replaced, so Back is not a trap);
opened on a thing that is not there it says so with the peacock and a door to the shelf, and Home.

## 2. The grown-ups' door

The Me page used to carry *Start again* (wipes the child), a *Developer unlock* (opens every
world and pack) and every setting, one tap from a child. Now:

- The Me page has one door: **🔒 Grown-ups**.
- Behind it, a **4-digit PIN** chosen on first use and typed twice. The screen says what it
  is: a **deterrent, not security** — a browser cannot keep a determined person out, and
  forgetting it means clearing the site's data, which clears the child too. Keypad by touch
  and digits by keyboard (house rule). Leaving the page locks it again.
- Inside: **the report card**, **Keep a copy** (save a backup file, restore from one, erase
  and start again — all through the `Store` seam), then the settings.
- **The developer unlock exists only in tester mode**, a device setting switched by
  `?tester=1` and `?tester=0`, never a button in front of a child. A profile that carried
  `S.dev` from before is switched off at boot outside tester mode.

## 3. Where a Dharma fact comes from

`data-dharma.js` had no `sources[]` on any of its four faiths — against the repo's own rule 2.
Each faith now names what it rests on: the standard academic introduction to the tradition
(Flood; Gethin; Dundas; Nesbitt), the Encyclopaedia Britannica entry a grown-up can check, and
for each lesson its own origin — the Mahabharata's opening book for the scribe story (with the
Critical Edition's note on why it is told as a story), the Mahakapi Jataka, the SGPC for the
langar. Nothing here is a quotation, and nothing was written from memory: these are reference
works, named so they can be checked. The faith page shows them under *Where this comes from*.

## 4. The report card is called

Paathshala's `report()` existed and was never called. The grown-ups' page now opens on
**What <name> can do now**: each course's learned objectives (counted only when the test was
passed on a later day than the lesson — the day rule), what was made, stories finished, places
lit, and the way into Bhasha's own progress page. It reports learning, never minutes.

## What holds it

| check | holds | broken to prove it |
|---|---|---|
| `back` | Back from inside the app stays inside; a linked screen opens and Back stays in | `go()` without `route()` |
| `deadends` | every screen in `HUB_OF`, opened on nothing, is its shelf; on a thing not there, the peacock and a door that is not Home; every `render()` case that reads its arg has a shelf | the redirect removed and *Pack not found.* put back (14 dead ends) |
| `price` | the family plan's price ($59 / ₹1,999 a year) is on the grown-ups' page, from `IND_ENT.plan()`; no screen a child can reach shows a ₹ or $ amount | the price taken off the grown-ups' card; *($59 a year)* put in the worlds' lock line (Shop, Settings) |
| `continue` | `#/continue` resolves to a real next step | `continueTarget()` returning home |
| `pin` | nothing that changes the child is on the child's page; the PIN opens, a wrong one does not, leaving locks it | *Start again* put back on the Me page |
| `tester` | no developer unlock outside tester mode; `S.dev` switched off at boot | `tester()` always true |
| `sources` | every faith has ≥ 2 sources and its page shows exactly those | the Jain sources removed |
| `report` | the report card is on the grown-ups' page, from `report()`, with no minutes | the report card removed |

Run: `node tools/check-trust.js` (or `--only pin`).
