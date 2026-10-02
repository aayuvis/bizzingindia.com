# 29 — The family standard v2, in Bizzing India

FIX-INDIA v2 (2 Oct 2026) asked for two things at once: fix the seven things a parent should
never have found, and bring India into line with the family standard v2 so the five Bizzing
apps feel like one family. This is what changed, what holds each change, and what is still
open. Every check named here lives in `tools/check-standard.js` unless another file is named,
and each one was watched to fail by breaking the thing it holds.

## Fix first

| what the audit saw | what changed | held by |
|---|---|---|
| "[object Object]" on the Family Shelf | the shelf prints its blurb, not the object | `strings` (every route, desk and phone) |
| "{child}" on Invite, and a family account that does not exist | every Nani string goes through `naniFill()`; Invite says plainly that recordings stay on this device and that there is no link to send yet; the shelf's privacy line is true | `strings`, `shelf` |
| `PARIVAAR` / `NANI2026` in client code | gone; `redeem()` redeems nothing; the family plan can be switched on only in tester mode until the family server exists | `passcodes` |
| Rangoli Rush: "8 of 6 dots placed" | past the pattern's count it says how many are extra | `rangoli` |
| Pallanguzhi and Gutte star placeholders; Festival Frenzy missing | drawn covers, then painted plates for every stall; Festival Frenzy on the Play grid | `mela`, `extras` |
| script charts in fallback faces; Urdu in Naskh | every chart letter carries its pack's language, and a safety net tags any Indic text after each paint; double-specificity `:lang()` rules win over component faces | `scripts` reads the font Chrome actually used |
| Back from Home landed on #/neeti | Home is the root of the trail, with a guard under it: Back from Home stays on Home | `check-trust back` |

## Harmonised

- **Shared code** (`app/family/`): the wallet, the activity feed, the avatar engine and its CSS,
  copied byte for byte from Bizzing_Schedule; `family/bridge.js` hands them to the classic
  scripts before boot. The India ports are deleted.
- **Top bar, tabs, ☰ and Home are Bee's, measured** (owner, 2 Oct 2026): `family/bizzing-shell.js`
  and `.css` are Bizzing_Schedule's drop-in, byte for byte. `shell()` draws the bar
  (⬡ · ☰ · peacock + Bizzing India · … · search | coins · theme · 🔒 · avatar ▾), the tab row, the
  phone tab bar and the drawer in the family order with India's four rows (the story shelves, Moral
  Science, the Epics, Family language); `home()` draws Bee's three rows — greeting · today's ring
  with the rank as "Your level" · word of the hour / Continue · the map / Aaj ka · the subhashita —
  and a footer. India sets colours only through `--bz-*` (family.css). Every screen sits inside the
  shell; a running drill passes `inRun` and ⬡ hides. The old ways-in tiles, the deed and the
  language ask moved to their tabs, ☰ and the footer. `checkShell` (`tools/lib/shell-check.mjs`, a
  copy) measures it against Bee's numbers on Home with a child, desktop and phone, light and dark,
  and must be `[]` (`shell`; watched to fail with the shell's Esc handler removed). It measures
  light with an empty wallet and dark with 40 coins, so the coin chip's width cannot move the
  search box again (it did, 8px, before the shell gave the chip a minimum width). No screen is wider than a 390px phone
  (`strings`, every route).
- **Tabs** (§4): Home · India · Paathshala · Bhasha · Play. The story shelves and Moral Science
  are doors at the top of Paathshala and rows in ☰; there is no More (`tabs`).
- **Settings** (§5): Bee's sheet, Me · Sound & music · Look · Comfort · Grown-ups 🔒. Age band and
  the daily target are behind the PIN; the PIN pad paints before the report loads (`settings`).
- **Avatars** (§8): 96 = 12 × 8 at 2/3/2/1 through the family engine. All 80 that were offered
  are kept (owner's decision), sixteen come back from the archive, the packs pair with worlds
  1–6. Real people carry a one-line `about` taken from their own sourced card; India has no
  villains' pack. Every Legendary names a milestone the app measures. All 96 were redrawn in the
  family sticker style from each character's own portrait (512px WebP, `art/av/`), each one
  looked at; six were redrawn again. Nothing a child held is taken away: Store `v2_to_v3`
  writes every card and world that was open to them into what they own (`avatars`, `extras`).
- **Worlds** (§7): all fifteen are offered under the one rule — worlds 1–2 free, the rest with
  the family plan or 240 coins. AA is measured on all fifteen, day and night (`check-contrast`).
- **Shop and wallet** (§1): a Shop screen (Avatars · Worlds · Extras) with the history under it;
  the coin chip opens the last thirty lines in words. Extras are frames and carrom boards
  (`shop`).
- **Music** (§11): composed in code — a tanpura, bansuri, santoor, sarangi, tabla, dholak, dhak —
  one loop per world, one for Home, one for the games, 60–90 s, lazy, ducked under the voice,
  paused when hidden, off in Calm mode (`music`; `music/CREDITS.md`).
- **Search** (C4): stories, epics, states, eras, festivals, faiths, words in every pack, people,
  games and courses (`search`).
- **Mascot** (§2): the peacock in six painted poses — on the logo, the drawer, every empty and
  error state, every medal and every game's finish. The companion stays on Home.
- **First load** (R2): the 3.5 MB reading passages are their own group, fetched when a language
  is opened and never in the warm-up; the per-script faces, the passages and the music are in
  the service worker's second list, fetched long after the first visit.

## Key elements

| row | change | held by |
|---|---|---|
| C3 siblings | the avatar ▾ lists every child with their own face, and Add a child | `siblings` |
| C5 dead ends | every route has a heading and a way back; the 33 Learn and Practise stops teach | `strings`, `teach` |
| D4 / N2 art | no stickers over a painted scene; one sticker style for the 96; painted Mela plates | `extras` |
| D8 map | lit places painted in, the child's face on the next place, a legend in words | `extras` |
| E3 the why | each Hindi stop builds a worked example from the engine's own reviewed data | `teach` |
| E6 hints | a missed item offers a hint that takes away one wrong answer, never the right one | `mistakes` |
| F3 mistakes | Words that slipped: a deck that comes back after a gap and drills only those | `mistakes` |
| F4 finish | every session end names what was practised and what is next | — |
| G6 juice | sparks on a right answer, a bigger burst at the finish, "N right this game" | — |
| J6 avatar | top bar, greeting, map pin, game finish, certificates | `extras` |
| K10 goal | "Saving for" on Home: the next Legendary or world, with how far the coins are | `extras` |
| P5 focus | one 3px accent ring on every control; Esc closes the drawer and the sheets | `drawer` |
| Q4 controls | age band and daily target behind the PIN | `settings` |
| T9 sharing | certificates drawn on the device as PNG, from behind the PIN | `extras` |

## Still open

- **G2 / G4** — Ludo, Kancha, Gutte and Carrom still teach nothing. The standard says such a
  game is cut, and the brief suggested tying them to questions; both change what the owner
  kept. Not done without the owner.
- **Real money, plans and accounts** — not in this work by the brief; the family plan is a
  tester switch until the family server exists.
- **The shared wallet's daily lid** still counts the one-time `migrated` line (docs/28). The
  copy here is byte-identical, so the fix belongs in Bizzing_Schedule.
- The Hindi course is `premium` and its stops still need a named Hindi pedagogue's review,
  as before.
