# 25 — The family layer: the top bar, a household of children, the Hive's feed, one Store

FIX-INDIA O4 (family brand layer), B7 (sibling switching), O3 (Hive integration) and N4
(storage seam and migrations), against the Bizzing family standard §3, §5 and §13.

## The family top bar

Every Bizzing app has the same bar, 56px, in the same order (standard §3):

`⬡ back to the Hive · Bizzing India · …………… · theme · 🔒 grown-ups · the child ▾`

- **⬡** opens the Hive (`aayuvis.github.io/Bizzing_Schedule/`). It is hidden only inside a
  running drill — a language lesson under way, or a game — so a mid-lesson tap cannot leave.
- **🔒** opens the grown-ups' page behind its PIN (docs/22).
- **The child ▾** is the child's own picture. It opens their menu: *who is playing* (and the
  switch to a brother or sister), *my page*, and **the one mute** — standard §9 puts sound in
  the bar's menu rather than on the bar.
- What is India's own — 🪙 coins, the family's language, *read in Hindi too* — sits in the gap
  on a wide screen. On a phone it folds into the child's menu, so the bar stays one row at
  390px instead of the old two-row, ~120px header.

The logo went from 68px to 40px to fit the row; the world's frieze still fills the gap.

## A household of children

There used to be **one profile per device**: a second child either shared the first child's
stories, coins and map, or "Start again" wiped them. Now:

- `bi_house` names the children: `{ v:1, active:'k1', order:['k1','k2'], next:3, adding:null }`.
- **The first child keeps the keys it always had**; every later child gets the same keys with
  its id appended — `bi_v1` → `bi_v1.k2`, `india.sabhyata.v2` → `india.sabhyata.v2.k2`. So an
  existing device became a household of one with no migration at all, and `Store.kidKey()` is
  the one place that decides whose key a thing is.
- **Recorded voices** carry the child's id and each child sees only their own.
- **Switching reloads the page.** A story half told, a quiz, a course's record and a Sabhyata
  city all live in memory; a reload is the only switch that cannot carry one child's state into
  another's.
- **Adding a child** is on the grown-ups' page (*Children in this household · + Add a child*),
  behind the PIN. It opens that child's own setup — not the landing page — with *Not now* to
  step back out. A second child **of the same first name is refused**, because the family
  wallet and the Hive's feed are kept by first name in every Bizzing app.
- **Removing a child** removes every key that child owns and leaves the others whole. The
  grown-ups' page says *Remove Asha from this device*, never "start again".
- **The backup is the family's**: every child and everything each one owns, in one file.
  A single-child file from before the household still restores, into the child playing now.

## The Hive's feed

`app/bizzing-activity.js` is a plain-script port of `integration/bizzing-activity.js` — same
key (`bizzing.activity`), same row shape, same rules. It counts **active** minutes only (the tab
visible and a touch, click, key or scroll in the last two minutes) for the child playing, and
India writes four kinds of milestone as they happen:

| ev | when |
|---|---|
| `stop` | a story finished |
| `world` | a place lit on the map |
| `mastery` | the mastery count rises — a course objective under the day rule, a Bhasha rung |
| `band` | a new Gurukul rank |

Mastery and rank are derived, so growth is noticed against what was last seen (`S.grown`),
once, and never on the way down; on the first boot of this build it is baselined, so what a
child already had is not announced as new. **Nothing is written in the demo.**

## One Store

Every key goes through the `Store` seam now. The engines that load before `app.js` — Sabhyata's
save, the rangoli level, the family pass, the diagnostics ring — reach it as `window.IND_STORE`
at run time (`kidGet/kidSet` for a child's keys, `famGet/famSet` for the household's), keeping a
same-line fallback only for an engine opened on its own. Only the seam files (`app.js`,
`demo.js`, `bizzing-wallet.js`, `bizzing-activity.js`) touch `localStorage` directly.

**A bug found on the way:** `saveProfile()` stamped the current schema on every save, so a
profile written by a *newer* build would have been quietly downgraded the next time an older tab
saved — the exact thing `migrate()` was written to refuse. It no longer stamps over a newer one.

## What holds it — `tools/check-family.js`

| check | holds | broken to prove it |
|---|---|---|
| `topbar` | 56px, one row, ⬡ · name · theme · 🔒 · avatar in that order, at 1280 and 390; the page no wider than the 390px phone; ⬡ hidden in a drill | the theme button moved after 🔒 |
| `household` | Ravi starts with none of Asha's stories, coins, places or Sabhyata; same name refused; switching back finds Asha exactly as left; removing Ravi leaves no `.k2` key and Asha whole | `kidKey()` ignoring the child |
| `activity` | whole active minutes for the child playing, none for idle time past the grace, a `stop` and a `world` milestone from a finished story | `trackActivity` never started |
| `seam` | no direct `localStorage` outside the seam; a profile from a newer build keeps its version and fields through a save | a direct call in Sabhyata; `saveProfile` stamping |

The v1 → v2 walk itself is held by `check-rewards migrate` (docs/23).

Run: `node tools/check-family.js` (or `--only household`).
