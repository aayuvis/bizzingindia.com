# 04 — Design Language

## 1. Identity

Bizzing Bee's default skin is **Marquee** — a theatrical playbill, warm brass on deep
aubergine, hero word lit on a stage. Bizzing India needs an identity that is unmistakably a
sibling but unmistakably its own.

**The default skin is *Chitrakatha*** — "picture-story." The metaphor is a **painted scroll
unrolling**: the *pat* of a Pattachitra painter, the *phad* of a Rajasthani bard, the panels
of a village storyteller's cloth. Content arrives by unrolling, not by sliding in from
nowhere.

- **Mood:** warm, hand-made, festive, unhurried. Sunlight and pigment, not neon.
- **Signature element:** the **map under mist** — grey, dormant India, colour blooming
  outward from what the child has learned, with a hand-painted border that fills in as the
  map does.
- **What it is not:** not Bollywood-poster kitsch, not saffron-and-marigold clip art, not
  "ancient scroll" beige-and-serif AI default, not generic global-kids rounded cartoon.
  The reference is folk painting, textile and temple mural — flat, saturated, patterned,
  outlined.

### Anti-patterns
- No deity depicted with photoreal or 3D-cartoon rendering — always in a named folk-art
  idiom, always reverent.
- No national flag as decoration or as a UI accent. It's the flag.
- No "exotic India" tropes: snake charmers, generic elephants-with-howdah as chrome,
  Sanskrit-look Latin fonts (the ones that fake Devanagari strokes). Those read as insult to
  the exact audience being sold to.
- Devanagari is never used as decorative squiggle. If it appears, it says something and is
  set correctly.

## 2. Worlds — the theme system

Same mechanic as Bizzing Bee: a theme is a **remap of the same token names** on
`<html data-world="…">`, so components never hardcode colour and the whole app re-skins with
zero layout change. Here, each world is a real regional art tradition with a real palette,
plus its own rank-ladder names, motif and border.

| World | Region | Palette character | Motif |
|---|---|---|---|
| **Chitrakatha** *(default)* | Pan-Indian scroll | Warm indigo ground, turmeric & vermilion | Unrolling scroll, painted border |
| **Madhubani** | Bihar | Deep red, ochre, black outline, white fill | Fish, lotus, sun, double-line border |
| **Warli** | Maharashtra | Terracotta ground, white line | Stick figures, circles of dancers |
| **Pattachitra** | Odisha | Black, white, red, yellow — no green | Fine floral border, elongated eyes |
| **Gond** | Madhya Pradesh | Bright multicolour on dark | Dots and dashes filling animal forms |
| **Kalamkari** | Andhra Pradesh | Natural dye: indigo, madder, mustard, cream | Panelled narrative rows |
| **Phad** | Rajasthan | Flat red/yellow/orange, bold outline | Continuous scroll of a hero's tale |
| **Mughal Miniature** | Northern courts | Jewel tones, gold leaf | Ornate frame, garden geometry |
| **Tanjore** | Tamil Nadu | Gold, deep red, emerald | Arch frames, gem inlay |
| **Kalighat** | Bengal | Bold sweeping brush, limited palette | Big, quick, modern-feeling strokes |

**Free:** Chitrakatha + one other. **Earn with kauris** or **unlock with Premium:** the rest.

Every world carries a "**About this art**" card — the tradition, the region, how it's made,
living artists who practise it. Where art is commissioned from practitioners of a tradition,
the artist is credited by name in-app. Where it's rendered in-house in an idiom, say so
plainly. Folk traditions are living livelihoods, not free texture packs; budget for
commissioning real artists, and treat the credit line as non-negotiable.

## 3. Tokens

Same token contract as Bizzing Bee's `spellbound-tokens.css`, so the shared design-system
package (`ds-src`) works across both apps.

```css
:root {                     /* Chitrakatha — default */
  --bg1:#1b1226;            /* page ground (deep indigo) */
  --bg2:#261a33;            /* card / surface */
  --bg3:#120b1a;            /* deep wells, footer */
  --surface:  rgba(255,255,255,.045);
  --surface2: rgba(255,255,255,.075);
  --line:     rgba(240,180,60,.18);
  --text:#f6efe1;           /* warm ivory */
  --muted:#b6a68c;
  --accent:#e9a13b;         /* turmeric */
  --accent2:#f2c46a;        /* marigold */
  --accent3:#d94f3d;        /* vermilion */
  --good:#4fbf8b;           /* fresh leaf */
  --bad:#d2544f;
  --mist:  rgba(150,150,165,.55);   /* NEW — the Forgetting */
  --lit:   rgba(233,161,59,.22);    /* NEW — recovered map territory */
  --display:'Fraunces', Georgia, serif;
  --body:'Hanken Grotesk','Segoe UI',sans-serif;
  --deva:'Mukta','Noto Sans Devanagari',sans-serif;   /* NEW */
  --radius-sm:8px; --radius-md:12px; --radius-lg:14px; --radius-xl:16px; --radius-pill:999px;
  --space-xs:4px; --space-sm:8px; --space-md:12px; --space-lg:14px; --space-xl:18px; --space-2xl:24px;
}
```

Two tokens are new and specific to this product: `--mist` and `--lit`, the two states of
every map territory. They appear on the map, on locked content, and in the saga.

## 4. Typography

| Role | Token | Face | Used for |
|---|---|---|---|
| Display | `--display` | **Fraunces** | Headings, story titles, rank names, big numbers |
| Body | `--body` | **Hanken Grotesk** | Everything readable |
| **Devanagari** | `--deva` | **Mukta** (fallback Noto Sans Devanagari) | All Hindi text |

Devanagari typography is a correctness issue, not a taste issue:
- Never fake it with a Latin face. Never letter-space it. Never all-caps it (there is no case).
- The **shirorekha** (headline) must sit unbroken — check every conjunct at every size.
- Set Devanagari **~10–15% larger** than Latin at the same optical size; matras above and
  below need the room.
- Line-height ≥ 1.7 for Hindi body text; ascenders and descenders stack further than Latin.
- Test the hard conjuncts before shipping a face: क्ष त्र ज्ञ श्र द्ध ट्ट ङ्क.
- In Chhote mode, every Hindi word on screen also has a tap-to-hear button. Always.

**Scale:** hero `clamp(30px, 8vw, 48px)` · H2 22 · H3 16 · body 15 · caption 12 ·
Devanagari body 17.

## 5. Characters

**Gattu** — an elephant calf. Round, small-tusked, drawn in whichever folk idiom the child's
world uses (a Warli Gattu is a few white lines; a Gond Gattu is dots and colour). Carries a
small bell that rings when he remembers something. Evolves visually with rank — the
avatar-evolution mechanic Bizzing Bee already proved works.

**Mithu** — a ring-necked parakeet, green with the rose collar, always mid-sentence. The
narrator: he appears beside Gyan Cards and story players and *talks*, hopping and changing
expression between scenes, exactly as Bizzing Bee's bee teaches its concept explainers.

**Vismriti** — never a face. A grey, soft-edged, slow-moving mist with a faint sound design
of muffled voices. It has no eyes to make it a monster; 4-year-olds should find it sad, not
frightening. Defeated by *telling*, never by fighting.

## 6. Motion

Restrained, always `prefers-reduced-motion`-aware:

- **Unroll** — the scroll metaphor: new content unrolls from one edge (240ms, ease-out).
- **Mist recede** — the reward beat: grey lifts off a map region, colour blooms outward from
  the pin (700ms). This is the app's confetti and it should be beautiful.
- **Diya light** — a lamp flame catches when the day's streak lands.
- **Gattu's bell** — a tiny nod + ring on "you remembered."
- **Rank up** — full celebration card, confetti in the world's palette.
- Tiles lift `translateY(-2px)` on hover; borders shift to `--accent`. Flat surfaces
  otherwise — 1px `--line` border, `--bg2` fill, minimal shadow, no glassmorphism.

## 7. Sound

Sound carries more weight here than in Bizzing Bee, because half the audience can't read.

- **Instrument palette per world**: sitar/tabla (Chitrakatha), sarangi (Phad), veena
  (Tanjore), flute (Warli), santoor (Mughal). Short, tasteful, never loops-that-annoy-parents.
- **Narration** is the product for Chhote mode: warm, slow, human. English (US + UK accents)
  and Hindi.
- Every sound has a visual equivalent, and everything is playable with sound off.

## 8. Accessibility

- WCAG AA contrast on every token pair, in every world. The folk palettes are saturated —
  verify, don't assume.
- Full keyboard control for every game (inherited hard rule from Bizzing Bee) *and* touch.
- Tap targets ≥ 44px; Chhote mode ≥ 60px.
- Any text a child must read is also available as audio.
- No colour-only meaning — the map uses pattern + colour for mist/lit.
- Dyslexia-friendly toggle: increased spacing, alternate face.
- Respect `prefers-reduced-motion` (mist recedes as a cross-fade instead of a bloom).
