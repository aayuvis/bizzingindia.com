# 14 — The Bizzing India channel: look, feel, and how an episode is made

**Status:** binding for every video published under the Bizzing India name.
First episode: *Kambugriva the Tortoise* (`pt.talkative-tortoise`).
Pipeline: [`tools/veo-story.py`](../tools/veo-story.py).

---

## 0. The one rule

**Nothing on the channel is invented for the channel.**

A child who watches a Bizzing India video and then opens the app must meet the *same*
tortoise, hear the *same* voice reading the *same* sentences, and recognise the *same*
country out of the window. If the video has a better tortoise than the app, the video is
wrong — go and fix the app.

That is not brand tidiness. It is the whole proposition: the videos are a doorway, and a
doorway that opens onto a different building is a trick.

So every episode is assembled out of things the app already holds:

| On screen / in the ear | Comes from | Never |
| --- | --- | --- |
| The words | `app/data-stories.js`, verbatim | Re-written "for video" |
| The voice | `app/voice/st/<slug>-*.mp3` | Re-synthesised, or a second narrator |
| The faces | `app/art/<character>.png`, as reference images on **every** frame call | Described in words and hoped for |
| The world | `app/art/story/<slug>.jpg` — the story's own painting | A generic "Indian village" prompt |
| The palette | `app/tokens.css` | Picked by eye per episode |

Veo generates its own audio track. **We throw it away.** The channel and the app have one
voice between them.

---

## 1. The look, in one paragraph

> Children's picture-book cartoon for four- to eight-year-olds. Round soft bodies, very
> large dark-brown eyes with a single bright highlight, small pink blush ovals on the
> cheeks, thick soft brown outlines, no visible teeth. Flat cel shading over a light paper
> grain. Sun-warmed Rajasthan: an ochre and gold sky with sunburst rays, dusty green
> fields, a small pink-sandstone walled town far on the horizon. Generous negative space.
> No frame, no border, no text in the picture.

This paragraph lives in `LOOK` in `tools/veo-story.py` and is prepended to every single
frame prompt. **Twelve shots come out of one art department, not twelve.** Change a word
there and the whole film changes, which is exactly what you want; do not hand-tune one
shot's prompt to fix a look problem that belongs to all of them.

### The palette

Straight off `app/tokens.css` — the same five values the app paints itself with:

| | | |
| --- | --- | --- |
| `#e9a13b` | marigold | sky, light, the warm ground of nearly every frame |
| `#d94f3d` | vermilion | accents, cloth, the sandstone town |
| `#5b3fd6` | indigo-violet | night, deep shadow, the last frame's sky |
| sage green | | fields, reeds, the tortoise himself |
| cream | | paper, negative space, air |

### The two characters

They are not described from memory. `app/art/pt_tortoise.png` and `app/art/pt_heron.png`
are passed as reference images on **every** image call, alongside the story's own painting.

Character drift across shots is the failure mode of this entire technique — by shot nine
you have a different tortoise and nobody notices until it is cut together. Reference art
on every call is the only thing that reliably holds it. It costs nothing. Do it even when
you are sure the model remembers.

### What is deliberately *not* copied

The app's story painting (`app/art/story/pt-talkative-tortoise.jpg`) is a Mughal-miniature
plate: fine stipple, an ornate blue-and-gold border, an adult's picture. It is the source
of the **palette, the light and the landscape** — and of nothing else. The *characters*
come from the sticker set, which is already a kids' cartoon.

**Titles never dim the whole frame.** The scrim behind the opening title is baked into
the title PNG as a gradient over the top 46% of the picture, not applied in ffmpeg as a
full-frame `drawbox`. Dimming everything to make lettering legible dims the characters
too, and on a film this warm that reads as a colour-grade mistake rather than a design.

**Never put the ornamental border in a shot.** It eats a tenth of the frame, and in motion
it reads as a picture of a picture. The border belongs on a title card, if anywhere.

---

## 2. The audio is the clock

Veo returns exactly eight seconds. Narration segments in this story run from 2.7 to 13.9.

The assembly therefore does **not** lay audio under a fixed cut. Every narration segment
gets `ceil(duration / 8)` shots, and the *video* is trimmed to the *narration*:

- video longer than the line → trim the tail
- video shorter than the line → stretch fractionally with `setpts`, never freeze-frame
  (a freeze reads as a crash to a four-year-old, and to the algorithm)
- `0.35s` of air after every line, in the audio and the video alike

Consequence: a shot is never cut away from mid-sentence, and no sentence ever plays over
silence. Add a shot to the list and the film re-times itself.

---

## 3. Editorial rules for the channel

These carry over from [`docs/05-editorial-policy.md`](05-editorial-policy.md), which is
binding here too, plus three the video form adds.

1. **The badge travels.** The video's description states the story's badge — 🪔 Katha for
   this one — in the same words the app uses. A story told as a story is never presented
   as history.
2. **Nothing sacred is animated for a thumbnail.** The Panchatantra animals are fair game.
   Deities are not, and are not on the channel's list.
3. **No on-screen text inside a shot.** Titles and credits are composited by us afterwards
   in the app's own typefaces. Generated lettering is unreliable, unbrandable and, in
   Devanagari, would break the app's hard rule about setting the script correctly. `NEG`
   in the pipeline blocks it.
4. **Death and harm are elliptical, exactly as the app's telling is.** The Panchatantra's
   tortoise dies. The app's line is *"It was a very good idea. It was, in fact, the last
   one he ever had."* — the whole event held in a joke. The video matches it beat for
   beat: the mouth opens, the stick slips, cut to two geese circling an empty sky. Nothing
   is softened. Nothing is shown. **Never make the video braver than the app's own text.**
5. **No child-directed engagement bait** — no "SMASH that like button", no countdowns, no
   loot. The app takes no ads and tracks no child; the channel does not undo that in the
   first ten seconds. Comments off on every episode, per the same posture.
6. **The people in the crowd are ordinary and various.** Shot 06a has a village street
   running out to look. Bright clothes, mixed ages, nobody a caricature, nobody a type.

---

## 4. The shot list, as a form

Each shot in `SHOTS_LIST` is four fields, and the split matters:

```python
dict(id='04', seg=3,
     frame="…what is in the picture, standing still…",
     move ="…what happens over the next eight seconds…")
```

- **`id`** — sorts the film. Two shots for one long line are `05a`, `05b`.
- **`seg`** — which narration file this shot serves: a scene index, or `hook` / `moral`.
  This is the only link between picture and sound, and it is what lets the timing be
  computed rather than eyeballed.
- **`frame`** — a *still*. Composition, who is where, what light. Written as if briefing
  an illustrator, because that is what it is: this becomes the image sent to Veo.
- **`move`** — what *changes*. One camera move and one or two character beats. No more.

Eight seconds holds **one idea**. "The birds lift off and the camera tilts up to follow
them" is a shot. "They take off, fly over the fields, and reach the town" is three, and
asking for it in one gets you a smeared blur of all three.

---

### What went wrong on the first pass, and what it teaches

Both failures were the *motion* prompt, not the art, and both are worth knowing before
you write the next shot list.

- **"rises out of frame" made the subject vanish.** Shot 05a asked the birds to lift off
  and leave frame with the camera tilting after them. Veo obliged by zooming out until the
  three of them were specks against an enormous red sunburst — and a shot that ends on a
  colour the film does not use reads as a mistake even to someone who could not name why.
  The fix: say *close*, say *stay large in frame*, say *do not zoom out*, and name the
  palette a second time inside the move.
- **"the camera drifts down towards the street" became a wall of one face.** Shot 06a's
  village crowd, pushed into, resolved as forty near-identical shouting faces. Ugly, and
  straight against rule 6. The fix was not a better crowd prompt but a *higher camera*:
  stay above the rooftops, keep the people small and various, and say explicitly that the
  camera never descends to anyone's face.

The general rule: **a camera move that leaves the subject will be taken literally.** If
the subject must stay, say so twice.

### The audio is the clock — and it decides the shot count

Every narration segment gets `ceil(d/8)` shots, and the video is trimmed down to the line.
Trimming is free; stretching is not. A `setpts` stretch past about **1.10×** stops reading
as "slower" and starts reading as broken, so a segment that would need more than that gets
another shot instead. Three of them did here — 1.16×, 1.07× and **1.37×** — and shots
`02b`, `03b` and `04b` exist for no other reason. A second shot is cheaper than a bad one.

Run the timing before you run the shots:

```
hook  ['00']          need  7.69  have  8.0  trim
0     ['01a','01b']   need 14.27  have 16.0  trim
3     ['04','04b']    need 10.96  have 16.0  trim     ← was ['04'], stretch ×1.37
```

## 5. Running it

```bash
export GEMKEY=…                                  # never written to a file
python3 tools/veo-story.py --frames              # 13 stills   (image model)
python3 tools/veo-story.py --shots               # 13 × 8s     (video model)
python3 tools/veo-story.py --assemble            # cut to the narration
python3 tools/veo-story.py --shots --only 07 08  # redo two shots
```

Every stage is resumable: an existing frame or shot is left alone unless `--force`.
That is not a convenience, it is a cost control — a shot is expensive and a re-run that
silently regenerates all thirteen is a bill.

Output: `build/video/bizzing-india-kambugriva.mp4`, 1920×1080, 24 fps.

`build/` is **not committed**. The inputs are all in the repo and the film rebuilds from
them; a rendered video in git is a hundred megabytes that go stale the first time a line
of narration is re-recorded.

### Delivery

The final mux does two things beyond joining the tracks, and both matter more than they
look:

- **Loudness.** The narration is synthesised speech and lands around −24 LUFS. YouTube
  normalises to roughly −14, so ours would simply sit quiet next to whatever plays next.
  `loudnorm=I=-14:TP=-1.5` hands the platform the target rather than arguing with it.
- **Bitrate.** The segment files are CRF 18 at ~10.6 Mbps, which is well past the point
  where flat cel-shaded animation gains anything. The master goes out at CRF 20, 48 kHz
  stereo, `+faststart`. About 90 seconds, 1920×1080, 24 fps.

### Three things that will bite

- **A still image has no timeline.** `-i card.png` is one frame at t=0, so
  `fade=t=in:st=0.5:alpha=1` sets that frame's alpha to zero and nothing ever turns it
  back on. ffmpeg exits 0 and the title is simply invisible in the finished film. Use
  `-loop 1 -t <seconds>`. This cost a full re-render to notice.
- **A positioned scrim paints over static type.** `.scrim` is `position:fixed`, the
  headline is not, so the scrim landed on top of it and the white lettering came out at
  luma 164 instead of 250 — muddy grey over the sky. It looks exactly like a bad font
  choice, which is where the hour goes. `z-index` on both, deliberately.
- **The download 302s.** Veo's file URI redirects to a signed URL. `urllib.urlopen` hands
  back the redirect body as if it were the file — 95 bytes of JSON that `ffmpeg` then
  reports as a missing `moov` atom, which sends you looking for a video bug that is
  actually an HTTP bug. The pipeline uses `curl -L`, and it checks the byte count and
  deletes anything too small rather than leaving a stub the next run treats as cached.

- **The download 302s.** Veo's file URI redirects to a signed URL. `urllib.urlopen` hands
  back the redirect body as if it were the file — 95 bytes of JSON that `ffmpeg` then
  reports as a missing `moov` atom, which sends you looking for a video bug that is
  actually an HTTP bug. The pipeline uses `curl -L`.
- **The clip that comes back too small is not a clip.** The pipeline checks the byte count
  and deletes it rather than leaving a stub that the next `--shots` run treats as cached.

---

## 6. Publishing

Not automated, on purpose — publishing is outward-facing and stays a human action.

- **Title:** `Kambugriva the Tortoise — a Panchatantra story for kids | Bizzing India`
- **Made for Kids:** yes. Comments off (see rule 5).
- **Description:** the story's own `hook` and `moral`, verbatim, then the source line from
  `data-stories.js` — *"Panchatantra, Book I. The tale travelled into Aesop, the Arabian
  Nights and beyond."* — then the app link.
- **Thumbnail:** frame `03`, the moment of the idea. Big eyes, raised paw, the sparkle.
- **Disclosure:** the description states that the animation is AI-generated from the app's
  own artwork and narration. Say it plainly; YouTube's synthetic-media disclosure applies
  and, on a children's channel, so does ordinary honesty.

### The description, ready to paste

```
Kambugriva was a tortoise who could not stop talking. Not for a moment. Not for
anything. When the lake dried up, his two goose friends found a way to carry him to
water — on one condition. He had to keep his mouth shut.

A Panchatantra story, told for children 4–8.

🪔 Katha — a story as it is told.
Source: Panchatantra, Book I. The tale travelled into Aesop, the Arabian Nights and
beyond.

"There is a time to speak and a time to keep your mouth shut. Knowing the difference
is most of wisdom."

More stories, the living map of India, and Hindi from the beginning:
https://bizzingindia.com

—
How this was made: the words and the narration are taken unchanged from the Bizzing
India app. The animation was generated with Google Veo from the app's own character
artwork and story painting. No ads, no tracking, nothing collected from children.
```

## 7. Before the next episode

- The narration is still the **synthesised placeholder voice**. `docs/09` §9 stands: a
  human reader replaces it before launch, and the channel inherits that the moment the app
  does — the video is rebuilt from the same files, no re-edit.
- The Hindi telling of this story exists (`-hi` clips) and is a **draft pending a named
  Hindi pedagogue**. A Hindi cut of this episode is one flag in the pipeline and must not
  ship before that review.
- No music yet. When it arrives it is one bed, credited, at a level that never competes
  with the narration.
