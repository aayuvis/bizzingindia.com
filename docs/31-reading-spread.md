# 31 — The reading spread

Owner, 4 Oct 2026: *"in the story panels across the app the image occupies the top and the
written word is all below the fold, creating a bad UX on desktop… enhance both desktop/iPad and
mobile."* Then: *"go with recommended, build it with swipe and full-screen too."*

## What was wrong, measured

Every reading screen stacked the painting over the words in one column capped at 720 px. That
spends the scarce dimension of a landscape screen (height) and wastes the spare one (width).

| at 1280×720 (a common laptop window) | before |
|---|---|
| epic card | painting 73% of the screen, **no words**, no page-turn |
| Gita verse | verse starts 929 px down a 720 px screen |
| story reader | two lines of words, empty sides |
| on a phone | a question scene's painting collapsed to an 80 px strip; the epics drew a lettered disc ("V") over Vyasa's painting |

## The layout, by the shape of the screen

One reading layout for the story reader, an epic card and a Gita verse (`app.css`, "THE READING
SPREAD"). It is chosen by **aspect**, not width, because the problem was height.

| screen | layout |
|---|---|
| landscape ≥ 640 px wide (desktop, laptop, iPad sideways, a phone on its side) | **the spread**: painting left in its own shape (stories 3:2, epics 16:9, the Gita 4:3), words and the page-turn right; the epic's and the Gita's painting stay put while the words scroll |
| upright tablet (≥ 721 px, portrait) | painting on top, capped at 38% of the screen; words at 19.5 px |
| phone (≤ 720 px, portrait) | painting a band (26% of the screen; 19% on a question scene) that never collapses; the words whole under it, the page scrolling, so nothing is ever clipped inside a box; the page-turn pinned on its own strip above the tab bar; the Gita verse directly under its picture, then its controls, then the guru's line |

The landing page's story card is not `#main`'s direct child and keeps its own layout.

**No stickers over a painting**, the epics included: a painted epic card draws nothing on the
painting; the names are in the who's-who row under the words (FIX-INDIA D4, now everywhere).

## Swipe

A sideways swipe presses the **same button** a tap would — `[data-swipe=next|back]` — so it can
never get past what a tap cannot: a story's question still waits for its answer, because until
it is answered there is no next button. Mostly-horizontal, ≥ 60 px, under 0.7 s; never from
inside something that scrolls sideways itself (the Gita's step strip), never while a painting is
full screen. Reading screens claim horizontal gestures (`touch-action: pan-y pinch-zoom`,
`overscroll-behavior-x: none`): a right swipe was otherwise the browser's own Back, and took an
epic card to the episode list. ← → do the same on a keyboard.

## The painting, full screen

A painted stage is a button (click, tap, Enter). The painting fills the screen; a tap on it
zooms 2.2× and the zoom follows the finger or the pointer; ✕, Escape, Back or a tap outside
closes it, and focus returns to the painting. It is an overlay on `<body>`, not the Fullscreen
API, which an iPhone does not have outside video. While it is open it owns the keyboard: nothing
turns the page underneath.

## The check

`tools/check-reading.js`, in `npm test`, at 1440×900, 1280×720, 1180×820, 820×1180, 390×760 and
375×667, on a story scene, a question scene, an epic card and a Gita verse:

- the words start on the first screen with ≥ 2 lines showing, and on a landscape screen in the
  top 55% (story and epic);
- the page-turn is on the first screen; a question scene shows its question there instead;
- stacked, a painting takes 15–62% of the screen; in the spread it stands beside the words;
- nothing is drawn over a painting; on a phone the words are never clipped; nothing scrolls
  sideways;
- full screen opens by click and Enter, zooms, closes four ways, returns focus, and blocks page
  turns; a real touch swipe turns an epic's page both ways and a Gita verse, a vertical drag does
  not, and a swipe cannot get past a question; ← → turn an epic's pages.

Each rule was watched to fail first: the spread switched off (25 failures), a sticker put back on
the epic stage (6), swipe disconnected, focus not returned.

## Measured after (words start, px from the top of the window)

| | story question | epic card | Gita verse |
|---|---|---|---|
| laptop 1280×720 | 349 → 266 | 720 (none) → 274 | 929 → 499 |
| desktop 1440×900 | 457 → 339 | 754 → 274 | 929 → 499 |
| iPad sideways 1180×820 | 377 → 300 | 754 → 274 | 929 → 499 |
