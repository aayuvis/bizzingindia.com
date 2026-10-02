# 27 — The platform: first-load weight, the test gate, the phone, contrast, the report card, facts

FIX-INDIA N2 (first-load weight), N3 (tests & gates), L4 (phone layout), L5 (accessibility),
M1/M2 (the grown-ups' report card) and D7 (facts & sources), against the Bizzing family
standard §6, §7, §11, §12 and §15.

## The first screen loads only what it needs (N2)

**Before:** 94 synchronous scripts — 11.7 MB, 3.15 MB gzipped — ran before Home could paint;
3.5 MB of it was a Hindi reading corpus a child on Home was not reading.

**Now** `index.html` loads a **shell** of 22 scripts — the app, theming and art, the family
wallet, sound and feed, the deed and the grandparent question — plus `shell-index.js`, and the
rest sits in seven groups in `<template id="lazy-…">` blocks: `content` (stories, epics, verses,
values, festivals), `voice`, `map`, `bhasha`, `paath`, `games`, `packs`. `loader.js` loads a group
when a screen asks (`IND_LOAD`), in page order, once.

- **`shell-index.js`** is what the first screen needs to know about the corpus without the corpus:
  one row per story (id, title, hook, place, collection, scene count), the place names, the
  course and language names, the counts. It is **generated** by `tools/gen-shell-index.js` from
  the data files exactly as the page evaluates them (stamp.sh runs it), so it cannot disagree with
  them — and `check-platform index` fails if it is stale.
- **Each screen names its groups** (`NEEDS` in app.js); anything unlisted waits for all of them,
  which is always safe. A screen whose groups are missing shows *Opening it…*, loads them and
  paints.
- **Home draws from the index and from summaries**: tonight's story and its place, the counts, and
  — until the course and language engines are here — the rank and the next step *as last measured*
  (`S.grown`, `S.resume.*.step`). Continue always recomputes fresh before it opens anything. When
  those engines arrive, growth is measured and Home repaints if it changed.
- **After the first screen, the rest is warmed** in the background, in the order a child is likeliest
  to go — never on a data-saver connection. These are the same bytes the offline cache was already
  fetching (offline-first stays a hard rule: the service worker still precaches every script).
- **The demo** is built from the real corpus, so `?demo` waits for all of it.

**Measured** (`check-platform weight`, a 390 × 844 phone, as GitHub Pages serves — text gzipped,
pictures as they are): a returning child's Home **966 KB, of which JavaScript 329 KB gzipped**; the
landing 585 KB. Budgets 1.5 MB and 400 KB. Home loads no route group at all.

## The gate (N3)

- **`npm test`** (`tools/test.sh`) runs the fact lint, the engine tests and every browser check,
  desktop and phone — fourteen suites, each of whose assertions was watched to fail by breaking
  the thing it holds. `npm run test:full` adds the long walks (`verify`, `qc-paath`,
  `check-sabhyata`).
- On success it records **exactly what passed** — the git tree ids of `app/` and `tools/` as tested
  — in `.git/bizzing-gate`. **`deploy.sh` runs `tools/gate.sh` first and refuses** unless HEAD's
  `app/` and `tools/` are those trees. Test one tree and ship another, and it says so.
- **CI** (`.github/workflows/test.yml`) runs the same `tools/test.sh` on every push to the branch,
  on GitHub's Chromium.
- **A deploy never rolls back another branch's deploy.** gh-pages is shared: on 2 October the
  family shell went live from one branch and, four hours later, a Sabhyata deploy from another
  branch that did not contain it put 142 files back a version — gate open, sha reported, nothing
  said. Every deploy now writes `Deployed-From: <sha> (<branch>)` into its gh-pages commit, and
  `tools/live-guard.sh` reads the live one back before the next: if HEAD does not contain it, the
  deploy is refused and told to merge it. Replacing a live deploy on purpose is
  `DEPLOY_REPLACE=<that exact sha>`, never a general bypass. `check-deploy` plays the sequence in
  a throwaway remote — seven scenarios, watched to fail with the guard always passing and with
  any `DEPLOY_REPLACE` accepted.

## The phone (L4)

All 26 main screens are no wider than a 390px phone (measured against the width set, not
`innerWidth`, which Chromium widens under emulation). Two real defects fixed:

- **Map labels rendered 6px tall** — a 13px label on a map scaled to 45%. On a phone only states
  with room keep a label, set to render ~12px; the rest are a tap away and carry a `<title>`.
- **"3300 BCE" was cut off** the left edge of the time line. Its ends are anchored inward now.

And the bottom bar's **More** lights up when you are on a screen behind it (the map, Moral Science,
your page) — before, no tab said where you were. Tabs are fixed at the bottom, 55px tall.

## Contrast (L5)

`tools/check-contrast.js` measures **every piece of text in every world, day and night**, on ten
screens — 8,578 of them — **against the pixels actually behind it**: it hides the text, takes a
screenshot and samples the worst tenth of the background toward the text's own lightness, so a
caption over a painting is judged by the painting's brightest part (text with a halo, by the
median). The first version walked CSS backgrounds and reported 2,420 failures that were mostly
white on a dark scrim `<img>` it could not see — measuring pixels was the fix.

**From 463 real failures to 0:** `--muted` is now the lightest mix of ink toward the ground that
clears 5.4:1 on every surface in that world (it was a fixed 58% mix, ~3:1); a new `--accent-ink`
for the accent used as text; night mode puts dark text on the (light) night accent instead of
white at 2:1; locked companions dim their picture, not their name; page headings and section notes
sit on paper rather than on the world's backdrop; captions on paintings carry a halo. Focus is
visible, every control has a name, and reduced motion stops every endless animation.

## The report card (M1, M2)

The grown-ups' page reports in the family's three measures, in order:

- **Time** — active minutes this week, on how many days, and the last four weeks, read from
  `bizzing.activity`. Labelled for what it is: *time is not learning; it is here so you can see the
  shape of the week.*
- **Progress** — steps along the path: stories finished, places lit, each course's stop *n of N*,
  each language's lessons.
- **Mastery** — **what the child can now do, each with the day it was shown**: a course objective
  ("shown 2026-10-02" — its test passed on a later day than its lesson) or a language rung (its
  outcome, in words). No minutes ever appear here.

With more than one child, a household row shows each child's week. `window.IND_REPORT()` returns
the same object for the Hive to read (never in the demo).

## Facts (D7)

`tools/check-facts.js` lints the data as the page loads it: every era, faith, course, verse and
story says where it comes from; every mapped place has a name and facts, and every story's place
exists; the first screen's counts equal the data's; no count is typed into app.js; no two
stories, verses or eras share an id.

## What holds it

| check | holds | broken to prove it |
|---|---|---|
| `check-platform weight` | phone first screen ≤ 1.5 MB, JS ≤ 400 KB gz, no group for Home | the Hindi passages put in the shell |
| `check-platform routes` | a story loads the stories and not the games; the Hindi path loads Bhasha; both paint | the stories screen asking for everything |
| `check-platform index` | `shell-index.js` equals what the data files say | a place count edited |
| `check-platform report` | Time · Progress · Mastery, 7 active minutes from the feed, an objective with its day, no minutes under Mastery | the Time card renamed |
| `check-platform phone` | 26 screens ≤ 390px, tabs ≥ 44px at the bottom, map labels ≥ 10px, time line whole | the left tick re-centred |
| `check-platform thirdparty` | nothing fetched from any origin but the app's own — boot, warm-up, ten screens | a picture from another site on Home |
| `check-platform gate` | `gate.sh` shuts for an untested tree and opens for the tested one; deploy.sh runs it first | `gate.sh` always open |
| `check-contrast` | 0 of 8,578 below AA; focus visible; named controls; reduced motion | `--muted` back to a fixed mix |
| `check-facts` | sources everywhere; counts agree; nothing typed; ids unique | an era's sources emptied; a count typed as 34 |
