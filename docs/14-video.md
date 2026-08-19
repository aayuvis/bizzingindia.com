# 14 — Video

The film pipeline lives in its own repository now:
**[Bizzing-Videos](https://github.com/aayuvis/Bizzing-Videos)**.

It **reads** this repo rather than copying from it — narration out of `app/voice/st`, story
text out of `app/data-stories*.js`, the mark, the tokens and the type out of `app/` — through
`pipeline/sources.js` there, which resolves a bizzingindia.com checkout from `$BIZZING_INDIA`
or from a sibling directory.

That is deliberate, and it is the first rule of the channel: *nothing on the channel is
invented for the channel*, so a child who watches a video and then opens the app meets the
same tortoise. A copy would be a thing that can drift. There is no copy.

## What this means when you change a story

**If you change a story's text, its hook, its moral or its narration, every film built from
it is stale.** Re-render from Bizzing-Videos.

The pipeline catches the narration half on its own — a shot is cached on a hash that includes
its narration length, so a re-recorded line re-renders its shot automatically. A *reworded*
moral of the same duration will not. Re-cut deliberately.

## Where the rules went

- look and feel → `docs/01-look-and-feel.md` in Bizzing-Videos
- the production brief → `docs/02-production-brief.md` in Bizzing-Videos

Read the brief before starting video work on any Bizzing property, including Bizzing Bee.
Its first section is the one that costs money: generative video cannot guarantee a
structural fact like "both geese are holding the stick", so story films are composited
locally from generated sprites and plates. Every trap in it was paid for once already.

## Films published from this repo

Two films were published to this repo's `gh-pages` before the split and the links are still
live. Anything new is published from Bizzing-Videos.

- `video/kambugriva-cutout-1080p.mp4` — *The Talkative Tortoise*
- `video/monkey-crocodile-1080p.mp4` — *The Monkey Who Kept His Heart in a Tree*
