# 28 — FIX-INDIA: what changed, and the re-score

The family audit (October 2026) scored Bizzing India **3.2 on average, with 28 of its 39 key
elements below 4**. This is the re-score of those 28 rows after the work in docs/22–27, each
against the brief's own *Done when*, each held by a test that was watched to fail by breaking
the thing it holds.

| row | element | was | now | done when → what holds it |
|---|---|---|---|---|
| A3 | Time to first learning | 3 | **4** | *Read it* plays tonight's story before any setup; a story is one tap after setup → `check-home firstlearn` |
| A5 | Demo mode | 1 | **4** | `?demo`: a labelled sample child, weeks of real progress, in an in-memory sandbox → `check-home demo` |
| B1 | Home layout | 3 | **4** | the family anatomy; Continue above the fold at 390×844 → `check-home anatomy`, `fold` |
| B2 | One Continue | 3 | **4** | one filled button, from one `nextStep()` shared with `#/continue` → `check-home primary`, `onenext` |
| B3 | Progress on home | 3 | **4** | rank, two bars and the map's own count beside Continue → `check-home progress` |
| B6 | Navigation & back | 2 | **4** | hash routes, Back stays in, `#/continue`, `?from=hive` → `check-trust back`, `continue` |
| B7 | Sibling switching | 1 | **4** | a household with the switcher in the top bar; switching never mixes data → `check-family household` |
| C4 | Gating & unlocks | 3 | **4** | every lock says how to open it → `check-motivation locks` |
| C6 | Rank moves only on learning | 2 | **4** | rank counts mastery evidence only → `check-rewards rank` |
| D3 | Answer feedback | 3 | **4** | a wrong answer holds until Continue and is said aloud → `check-rewards hold` |
| D7 | Facts & sources | 3 | **4** | sources on every era, faith, course, verse, story; counts agree → `check-trust sources`, `check-facts` |
| E1 | Short daily session | 3 | **4** | *Aaj ka*: story → lesson → look back → finish card → `check-motivation aaj` |
| F2 | Games teach | 3 | **4** | only teaching games pay; Gyanpati scored on what you knew → `check-rewards luck`, `gyanpati` |
| F3 | Game polish | 3 | **4** | every game: title card, how-to, sound, motion, *what you practised* → `check-motivation games`, `sfx` |
| I3 | No random rewards | 3 | **4** | choose-your-next at a printed price; nothing random → `check-rewards random` |
| I4 | Medals from evidence | 2 | **4** | twelve medallion medals from evidence, each celebrated once → `check-motivation medals` |
| J1 | Celebration moments | 3 | **4** | specific, with motion and sound, never comparing → `check-motivation medals` |
| J2 | No streaks | 3 | **4** | "good days this week" only → `check-rewards streaks` |
| L4 | Phone layout | 3 | **4** | nothing past 390px, 44px tabs, readable map labels, whole time line → `check-platform phone` |
| L5 | Accessibility | 3 | **4** | 0 of 8,578 text runs below AA in 5 worlds × day/night; focus; names; reduced motion → `check-contrast` |
| M1 | Grown-ups report card | 2 | **4** | Time · Progress · Mastery per child → `check-platform report` |
| M2 | Reports learning, not usage | 3 | **4** | what the child can do, with the day it was shown; no minutes under Mastery → `check-platform report`, `check-trust report` |
| M3 | PIN & grown-up controls | 2 | **4** | PIN called a deterrent; tester-only unlock; backup, restore, erase → `check-trust pin`, `tester` |
| N2 | First-load weight | 2 | **4** | phone first screen 966 KB, JS 329 KB gz; data per route → `check-platform weight`, `routes` |
| N3 | Tests & gates | 3 | **4** | `npm test`; deploy refuses an untested tree; CI on push → `check-platform gate` |
| N4 | Storage seam & migrations | 2 | **4** | one versioned seam; never stamped older → `check-family seam`, `check-rewards migrate` |
| O3 | Hive integration | 1 | **4** | `bizzing.activity` minutes + milestones; `#/continue`; `?from=hive`; ⬡ → `check-family activity`, `check-trust` |
| O4 | Family brand layer | 3 | **3** | top bar, ⬡, Continue card, medallions — **but not the shared avatar set** (below) |

**27 of the 28 rows are at 4 now; O4 stays at 3.**

## What is not done, and why

- **O4 — the shared family avatar set** (Bee's 21 + Geography's 40 creatures). Geography's set is
  not in this repository or this session, and Bee's includes figures sacred to other traditions
  (Amaterasu, for one) — offering those as companions needs the review docs/05 requires before
  anything sacred to anyone appears. Everything else in O4's *Done when* is in place.
- **The family wallet helper's daily lid** counts the one-time `migrated` entry, so a child who brings
  300 old coins across earns nothing more that day. India's port leaves it out; the shared helper in
  Bizzing_Schedule should do the same (docs/23).
- **The human checks the brief cannot automate**: the map's known geometry gaps (Telangana, Ladakh,
  Lakshadweep — docs/07), and the three Paathshala stops held for a reviewer.
- **Not in this chat, per the brief**: entitlements (O1), pricing (O2), marketing pages (O5),
  locale/currency display (O6) — they come with the shared family server.

## The Definition of done, line by line

- Fix-first shipped and tested — **yes** (docs/22).
- Every key element at ≥ 4 with its *Done when* in the suite — **27 of 28**; O4 as above.
- Harmonise done; old currency migrated 1:1 with a store step — **yes** (`v1_to_v2`, docs/23).
- Browser check on desktop and phone: back stays in the app · one primary button on Home · PIN on
  grown-ups · no third-party requests · no overflow at 390px · contrast in every theme · activity
  feed written · coins only from standard events — **all held**, in `check-trust`, `check-home`,
  `check-platform`, `check-contrast`, `check-family`, `check-rewards`.
- Deployed per CLAUDE.md, behind the new gate — **yes**.
