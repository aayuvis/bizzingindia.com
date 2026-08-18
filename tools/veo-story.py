#!/usr/bin/env python3
"""Make a Bizzing India kids cartoon out of a story the app already tells.

    python3 tools/veo-story.py --frames        # first frames  (Gemini 3 Pro Image)
    python3 tools/veo-story.py --shots         # 8s clips      (Veo 3.1)
    python3 tools/veo-story.py --assemble      # cut it to the app's own narration
    python3 tools/veo-story.py --all
    python3 tools/veo-story.py --shots --only 03 05

WHAT THIS IS NOT: a text-to-video prompt with the story pasted into it. Everything on
screen comes from something the app already has, because a brand is a promise that the
thing on YouTube is the thing in the app:

    THE WORDS      app/data-stories.js — the eight scenes, verbatim, not re-written.
    THE VOICE      app/voice/st/pt-talkative-tortoise-*.mp3 — the same narration a child
                   hears in the reader. Nothing is re-synthesised for the video and Veo's
                   own audio track is DISCARDED, so the channel and the app share one voice.
    THE FACES      app/art/pt_tortoise.png and pt_heron.png, passed to the image model as
                   reference images on every single frame. Character drift across shots is
                   the failure mode of this whole technique, and reference art on every
                   call is the only thing that reliably holds it.
    THE WORLD      app/art/story/pt-talkative-tortoise.jpg — the story's own painting,
                   passed with the characters, which is where the ochre-and-gold Rajasthan
                   palette, the sunburst sky and the walled town on the horizon come from.

    docs/14-video-look-and-feel.md is the written half of this and is BINDING on any
    future episode. Read it before adding one.

THE AUDIO IS THE CLOCK. Veo returns exactly 8 seconds; narration segments are 2.7 to
13.9. So the assembly does not lay audio over a fixed cut — it gives every segment
ceil(d/8) clips and trims the video to the narration, which means a shot is never cut
away from a sentence and no sentence ever runs over silence.

ON THE ENDING. The Panchatantra's tortoise dies, and the app's telling is deliberately
elliptical about it -- "It was, in fact, the last one he ever had." The video is exactly
as elliptical: the mouth opens, the stick slips, and we cut to two geese circling an
empty sky. Nothing is softened and nothing is shown. That is an editorial decision, not
a technical one, and it is written down in the doc so the next episode inherits it.

Needs GEMKEY in the environment. Never write a key into a file.
"""
import base64, json, os, re, subprocess, sys, time, urllib.request, urllib.error
import concurrent.futures as cf

import imageio_ffmpeg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, 'app')
OUT = os.path.join(ROOT, 'build', 'video')
FRAMES, SHOTS = os.path.join(OUT, 'frames'), os.path.join(OUT, 'shots')
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
API = 'https://generativelanguage.googleapis.com/v1beta'

IMAGE_MODEL = 'gemini-3-pro-image'
VIDEO_MODEL = 'veo-3.1-fast-generate-preview'

STORY = 'pt.talkative-tortoise'
VOICE = os.path.join(APP, 'voice', 'st')
SLUG = 'pt-talkative-tortoise'

REFS = [os.path.join(APP, 'art', 'pt_tortoise.png'),
        os.path.join(APP, 'art', 'pt_heron.png'),
        os.path.join(APP, 'art', 'story', SLUG + '.jpg')]

# ---------------------------------------------------------------- the look --
# One paragraph, prepended to every frame prompt, so twelve shots come out of one
# art department instead of twelve. Changing a word here changes the whole film,
# which is the point; docs/14 explains each clause and why it is there.
LOOK = (
  "Children's picture-book cartoon for 4-to-8-year-olds, 16:9. "
  "The tortoise in reference image 1 and the white long-beaked bird in reference image 2 "
  "are the CHARACTERS -- keep their exact shapes, proportions and faces: round soft bodies, "
  "very large dark-brown eyes with a bright highlight, small pink blush ovals on the cheeks, "
  "thick soft brown outlines, no visible teeth, never frightening. "
  "The WORLD is reference image 3: sun-warmed Rajasthan under an ochre and gold sky, "
  "sunburst rays, dusty green fields, a small pink-sandstone walled town far on the horizon. "
  "Flat cel shading with a light paper grain, warm brown line work, generous negative space. "
  "Palette: marigold #e9a13b, vermilion #d94f3d, deep indigo-violet #5b3fd6 for night and "
  "shadow, sage green, cream. No border or frame around the picture. No text, no letters, "
  "no watermark, no speech bubbles. Gentle and warm; never scary, never sad-looking."
)

NEG = ("text, letters, captions, subtitles, watermark, logo, signature, frame, border, "
       "photorealism, 3D render, live action, scary, teeth, blood, violence, dead animal, "
       "human crowd close-up, distorted anatomy, extra limbs")

# ------------------------------------------------------------- the shot list -
# `seg` is the narration segment each shot serves (the story's scene index, or
# 'hook'/'moral'). Segments longer than eight seconds simply get two shots.
SHOTS_LIST = [
  dict(id='00', seg='hook', frame=
       "Wide establishing shot at golden hour. A round blue lake ringed with reeds; the little "
       "tortoise sits on a flat warm stone at the water's edge, mouth open mid-chatter, and two "
       "white long-beaked birds stand on either side of him listening with fond patience. "
       "The walled pink town is small and far away on the horizon. Big open sky.",
       move="Very slow push in towards the three friends. Reeds sway. Water sparkles. "
            "The tortoise chatters happily; the two birds exchange an amused look."),

  dict(id='01a', seg=0, frame=
       "The tortoise on his stone at the lake edge, talking and talking, front paws lifted in "
       "mid-explanation. The two white birds sit close, heads tilted, one with a wing over the "
       "other. Dragonflies over the water. Warm midday light.",
       move="Slow drift left to right. The tortoise talks without stopping, gesturing with both "
            "front paws; the birds nod along, then glance at each other and softly laugh."),
  dict(id='01b', seg=0, frame=
       "Closer three-quarter view of the tortoise mid-sentence, cheeks round, eyes bright, the "
       "two birds behind him in soft focus against the gold water.",
       move="Gentle push in on the tortoise as he keeps talking, blinking between words. "
            "One bird behind him yawns and settles down comfortably to wait."),

  dict(id='02', seg=1, frame=
       "The same lake, now shrunk to a small brown puddle in a wide bed of cracked dry mud. "
       "The reeds are yellow and bent. The tortoise stands small in the middle of the cracks; "
       "the two birds stand with him, looking down at him with worry. Hot pale sky, no clouds.",
       move="Slow pull back to reveal how much lake is gone. Dust drifts across. One bird looks "
            "up at the sky, then down at the tortoise, and gently lowers its head."),

  # 02b exists because segment 1's narration is 9.3s and one clip is 8. The alternative
  # was stretching the video 16% to fit, and a stretched shot does not read as "slower",
  # it reads as broken. A second shot is cheaper than a bad one.
  dict(id='02b', seg=1, frame=
       "Close on the two white birds standing on the cracked mud, heads together, looking down "
       "at the little tortoise between their feet with worry in their big brown eyes. Behind "
       "them the last brown puddle and bent yellow reeds. Hot pale sky.",
       move="The two birds lean their heads together and look down at the tortoise, then one "
            "lifts its head to the empty sky and back down again. Dust drifts past."),

  dict(id='03', seg=2, frame=
       "The tortoise up on his back legs, one front paw raised high in the air, eyes enormous "
       "and delighted, a bright idea-sparkle above his head. The two birds lean back, surprised. "
       "A slim straight brown stick lies on the dry ground between them.",
       move="Quick little push in as the tortoise throws a paw in the air and bounces on the "
            "spot, thrilled with himself. Sparkles pop above his shell. The birds blink."),

  dict(id='03b', seg=2, frame=
       "Low close view along the dry ground: a slim straight brown stick lying in the dust, "
       "and behind it, slightly out of focus, the little tortoise up on his back legs with "
       "both front paws in the air, delighted with himself. Warm gold light, long shadows.",
       move="Slow push in along the ground towards the stick as the tortoise bounces "
            "excitedly behind it. A few sparkles pop in the air above him."),

  dict(id='04', seg=3, frame=
       "The three of them in a row on the dry lake bed. Each bird holds one end of the straight "
       "stick in its beak; the tortoise stands underneath at the middle of the stick, looking up "
       "at it. The birds' eyes are serious and kind. Late afternoon light, long soft shadows.",
       move="Slow steady hold with a very gentle push in. Each bird takes an end of the stick. "
            "One bird looks straight down at the tortoise and gives one slow, serious nod."),

  # 05a, second pass. The first take let the group shrink to specks against a huge red
  # sunburst -- Veo will happily zoom out of your subject if the move says "rises out of
  # frame". Keep them LARGE and keep the camera with them, and say the palette again:
  # a shot that ends on a colour the film does not use is a shot that reads as a mistake.
  dict(id='04b', seg=3, frame=
       "Very close on one white bird's face in profile, the stick held firmly in its beak, its "
       "large brown eye turned down and serious. The little tortoise is small and out of focus "
       "below, looking up. Late afternoon gold.",
       move="Hold close on the bird's serious eye as it looks down. It blinks once, slowly. "
            "Below, the small blurred tortoise nods."),

  dict(id='05a', seg=4, frame=
       "Take-off, seen close and from the side. The two white birds fill the frame, wings "
       "spread wide and beating, the straight stick held between their beaks, and the little "
       "tortoise large and clear in the middle of the frame hanging from the stick by his "
       "mouth, legs tucked in, eyes wide with wonder. The cracked lake bed just below them. "
       "Warm marigold and gold sky, soft cream clouds. Not red, not orange.",
       move="The two birds beat their wings and climb; the camera rises with them and stays "
            "close, so the birds and the tortoise stay large in frame the whole time. "
            "Keep the marigold-and-gold palette. Do not zoom out."),
  dict(id='05b', seg=4, frame=
       "High wide aerial shot from behind and slightly above: the two birds and the dangling "
       "tortoise fly over patchwork green and gold fields, a dusty road, mango trees, and the "
       "small pink walled town ahead. Sunburst rays across a big ochre sky.",
       move="Smooth flying camera following behind them. Wings beat steadily. The landscape "
            "slides underneath. The tortoise's legs swing gently."),

  # 06a, second pass. The first take pushed down into the crowd until it became a wall of
  # near-identical open mouths -- which is both ugly and against rule 6 of docs/14: the
  # people are ordinary and various, never a mass of one face. Stay high, keep them small.
  dict(id='06a', seg=5, frame=
       "A high wide view looking down on a small sunlit village street from far above. The "
       "people are SMALL in the frame -- a scattering of figures in different bright colours, "
       "different ages, spread out along the street and in the doorways, a few with an arm "
       "raised towards the sky. Terracotta rooftops, a neem tree, a well. Faces are tiny and "
       "not detailed. Warm marigold light.",
       move="A slow, steady, HIGH drift across the rooftops. The little figures come out of "
            "doorways and point upward. The camera never descends into the street and never "
            "moves close to anyone's face."),
  dict(id='06b', seg=5, frame=
       "Close on the tortoise hanging from the stick against the gold sky, his eyes narrowing, "
       "his cheeks going a hot pink, indignation rising in his face. The two birds' wings frame "
       "him on either side.",
       move="Slow push in on the tortoise's face. His eyes narrow, his cheeks flush deeper pink, "
            "and he begins, very slowly, to look like someone who is about to speak."),

  dict(id='07', seg=6, frame=
       "The tortoise's mouth wide open in a great shout, the stick already an inch away from his "
       "jaws and starting to slip. Both birds' eyes go round with alarm. Bright gold sky.",
       move="The tortoise opens his mouth in a huge shout. The stick slips free and floats up out "
            "of frame. The two birds turn their heads sharply. Cut on the movement."),

  dict(id='08', seg=7, frame=
       "A wide empty gold sky with the two white birds circling slowly, looking down, and one "
       "small brown stick tumbling end over end far below them. No ground, no tortoise, just sky "
       "and the two birds and the falling stick.",
       move="Very slow drift as the two birds circle and look down. The stick tumbles away and "
            "gets smaller. The sky is wide and quiet. Nothing else happens."),

  dict(id='09', seg='moral', frame=
       "Calm closing image: the same lake full of blue water again at sunset, reeds green, two "
       "white birds standing quietly at the water's edge looking out, and one empty warm flat "
       "stone beside them. Deep gold and indigo evening sky, first stars.",
       move="Very slow push in on the two birds and the empty stone as the sky deepens from gold "
            "to indigo and the first stars appear."),
]


# ------------------------------------------------------------------ helpers --
def key():
    try:
        return os.environ['GEMKEY']
    except KeyError:
        raise SystemExit('GEMKEY is not set. Export it for the run; never hardcode it.')


def post(url, body, timeout=300):
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={'Content-Type': 'application/json',
                                          'x-goog-api-key': key()})
    return json.load(urllib.request.urlopen(req, timeout=timeout))


def inline(path):
    mime = 'image/png' if path.lower().endswith('.png') else 'image/jpeg'
    return {'inline_data': {'mime_type': mime,
                            'data': base64.b64encode(open(path, 'rb').read()).decode()}}


def probe_seconds(path):
    e = subprocess.run([FFMPEG, '-i', path], capture_output=True, text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', e)
    return (int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))) if m else 0.0


def narration(seg):
    return os.path.join(VOICE, '%s-%s.mp3' % (SLUG, seg))


# ------------------------------------------------------------- first frames --
def make_frame(shot, force=False):
    path = os.path.join(FRAMES, shot['id'] + '.png')
    if os.path.exists(path) and not force:
        return path, 'cached'
    parts = [inline(p) for p in REFS]
    parts.append({'text': LOOK + '\n\nDraw this single frame:\n' + shot['frame'] +
                          '\n\nAvoid: ' + NEG})
    for attempt in range(3):
        try:
            r = post('%s/models/%s:generateContent' % (API, IMAGE_MODEL),
                     {'contents': [{'role': 'user', 'parts': parts}],
                      'generationConfig': {'responseModalities': ['TEXT', 'IMAGE'],
                                           'imageConfig': {'aspectRatio': '16:9'}}})
            for c in r.get('candidates', []):
                for part in c.get('content', {}).get('parts', []):
                    if 'inlineData' in part:
                        open(path, 'wb').write(base64.b64decode(part['inlineData']['data']))
                        return path, 'drawn'
            return None, 'no image in response'
        except urllib.error.HTTPError as e:
            if attempt == 2:
                return None, 'HTTP %d %s' % (e.code, e.read().decode()[:200])
            time.sleep(4 * (attempt + 1))
    return None, 'gave up'


# -------------------------------------------------------------- the 8s clips -
def make_shot(shot, force=False):
    out = os.path.join(SHOTS, shot['id'] + '.mp4')
    if os.path.exists(out) and os.path.getsize(out) > 100000 and not force:
        return out, 'cached'
    frame = os.path.join(FRAMES, shot['id'] + '.png')
    if not os.path.exists(frame):
        return None, 'no first frame'
    prompt = ("Children's 2D cartoon animation, hand-drawn storybook feel, smooth and gentle. "
              + shot['move'] +
              " Hold the exact art style, colours and character designs of the first frame. "
              "No dialogue, no voiceover, no singing, no on-screen text.")
    body = {'instances': [{'prompt': prompt,
                           'image': {'bytesBase64Encoded':
                                     base64.b64encode(open(frame, 'rb').read()).decode(),
                                     'mimeType': 'image/png'}}],
            'parameters': {'aspectRatio': '16:9', 'durationSeconds': 8,
                           'resolution': '1080p', 'negativePrompt': NEG}}
    try:
        op = post('%s/models/%s:predictLongRunning' % (API, VIDEO_MODEL), body)
    except urllib.error.HTTPError as e:
        return None, 'HTTP %d %s' % (e.code, e.read().decode()[:200])
    name = op['name']
    for _ in range(90):
        time.sleep(10)
        req = urllib.request.Request('%s/%s' % (API, name), headers={'x-goog-api-key': key()})
        o = json.load(urllib.request.urlopen(req, timeout=60))
        if not o.get('done'):
            continue
        if 'error' in o:
            return None, json.dumps(o['error'])[:200]
        try:
            uri = o['response']['generateVideoResponse']['generatedSamples'][0]['video']['uri']
        except (KeyError, IndexError):
            return None, 'no video in the finished operation'
        # curl, not urllib: the download 302s to a signed URL and urlopen on this
        # endpoint returns the redirect body as if it were the file (95 bytes of JSON
        # that ffmpeg then reports as a missing moov atom).
        subprocess.run(['curl', '-sL', '-m', '600', '-H', 'x-goog-api-key: ' + key(),
                        '-o', out, uri], check=True)
        if os.path.getsize(out) < 100000:
            os.remove(out)
            return None, 'download came back too small'
        return out, 'generated'
    return None, 'timed out waiting for the operation'


# -------------------------------------------------------------- title cards --
# RENDERED, NOT GENERATED. Rule 3 of docs/14: no lettering ever comes out of the image
# model. It is unreliable, it is unbrandable, and for Devanagari it would break the app's
# hard rule about setting the script properly. So the cards are laid out in a headless
# browser against the app's OWN stylesheet and OWN self-hosted faces -- Fraunces for the
# display line, Hanken Grotesk for the rest -- which is the same type a child sees in the
# reader, byte for byte.
CARD_HTML = """<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="fonts.css">
<style>
  html,body{margin:0;width:1920px;height:1080px;overflow:hidden}
  body{display:flex;align-items:%(align)s;justify-content:center;
       font-family:var(--body);color:var(--text);background:%(bg)s}
  /* THE SCRIM IS PART OF THE CARD, not a full-frame drawbox in ffmpeg. Dimming the
     whole picture to make lettering legible dims the characters too, and on a warm
     ochre film that reads as a colour-grade mistake. A gradient over the top 46%% puts
     the contrast exactly where the type is and leaves the tortoise alone. */
  /* z-index matters here and it is not decoration. `.scrim` is POSITIONED and the
     headline is not, so without this the scrim paints ON TOP of the type: the white
     lettering came out at luma 164 instead of 255 and read as dirty grey over the sky.
     It looks exactly like a bad font choice, which is where an hour goes. */
  .scrim{z-index:0;position:fixed;inset:0 0 auto 0;height:46%%;
         background:linear-gradient(180deg,rgba(24,14,52,.66) 0%%,rgba(24,14,52,.40) 58%%,
                    rgba(24,14,52,0) 100%%)}
  .wrap{position:relative;text-align:center;padding:%(pad)s;max-width:1560px}
  .kicker{font-size:29px;letter-spacing:.24em;text-transform:uppercase;
          font-weight:800;color:%(kicker)s;margin-bottom:30px}
  /* the film moves under this type, so it carries its own shadow rather than
     trusting whatever happens to be behind it in a given frame */
  .scrim ~ .kicker, .scrim ~ h1, .scrim ~ p{
    position:relative;z-index:1;text-shadow:0 2px 18px rgba(18,10,40,.7)}
  h1{font-family:var(--display);font-weight:800;font-size:%(size)spx;line-height:1.06;
     letter-spacing:-.015em;margin:0 0 30px;color:%(fg)s}
  p{font-size:37px;line-height:1.5;margin:0;color:%(sub)s;font-weight:600}
  .brand{margin-top:%(gap)spx;font-family:var(--display);font-weight:800;font-size:44px;
         color:%(fg)s}
  .brand i{font-style:italic;color:%(kicker)s}
  .rule{width:120px;height:5px;border-radius:99px;background:%(kicker)s;margin:0 auto 34px}
  .brand{display:flex;align-items:center;justify-content:center;gap:20px}
  .brand img{width:76px;height:76px}
  .tag{font-size:27px;letter-spacing:.16em;text-transform:uppercase;font-weight:800;
       color:%(kicker)s;margin-top:22px}
</style>
<div class="wrap">%(body)s</div>"""


def render_cards(force=False):
    """Two 1920x1080 PNGs: the opening title and the closing card."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return None, 'playwright is not installed'

    cards = {
      'card-title': dict(
        bg='transparent', fg='#fffaf0', sub='#f6e6c8', kicker='#f7c667', size='106', gap='54',
        align='flex-start', pad='92px 160px 0',
        body='<div class="scrim"></div>'
             '<div class="kicker">Panchatantra &middot; Katha</div>'
             '<h1>Kambugriva<br>the Tortoise</h1>'
             '<p>Two friends, one stick, and a mouth that would not stay shut.</p>'),
      'card-end': dict(
        bg='#fdf4e4', fg='#1e1440', sub='#5a4a72', kicker='#d94f3d',
        size='62', gap='72', align='center', pad='0 180px',
        body='<div class="rule"></div>'
             '<h1>There is a time to speak<br>and a time to keep your mouth shut.</h1>'
             '<p>Knowing the difference is most of wisdom.</p>'
             '<div class="brand"><img src="art/logo.png" alt="">Bizzing <i>India</i></div>'
             '<p class="tag">bizzingindia.com</p>'),
    }
    out = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium'
                               if os.path.exists('/opt/pw-browsers/chromium') else None)
        pg = b.new_page(viewport={'width': 1920, 'height': 1080})
        for name, spec in cards.items():
            path = os.path.join(FRAMES, name + '.png')
            if os.path.exists(path) and not force:
                out.append((name, 'cached')); continue
            html = os.path.join(APP, '_card.html')
            open(html, 'w').write(CARD_HTML % spec)
            pg.goto('file://' + html)
            pg.wait_for_timeout(700)          # let the self-hosted faces land
            pg.screenshot(path=path, omit_background=(spec['bg'] == 'transparent'))
            os.remove(html)
            out.append((name, 'rendered'))
        b.close()
    return out, None


# ----------------------------------------------------------------- assembly --
def assemble():
    """Cut the shots to the narration, not the other way round."""
    segs, order = {}, []
    for s in SHOTS_LIST:
        segs.setdefault(s['seg'], []).append(s['id'])
        if s['seg'] not in order:
            order.append(s['seg'])

    parts, missing = [], []
    for seg in order:
        aud = narration(seg)
        if not os.path.exists(aud):
            missing.append(aud); continue
        need = probe_seconds(aud) + 0.35          # a beat of air after each sentence
        clips = [os.path.join(SHOTS, i + '.mp4') for i in segs[seg]]
        clips = [c for c in clips if os.path.exists(c)]
        if not clips:
            missing.append('shots for segment %s' % seg); continue
        have = sum(probe_seconds(c) for c in clips)
        parts.append(dict(seg=seg, aud=aud, clips=clips, need=need, have=have))

    if missing:
        print('MISSING:'); [print('   ', m) for m in missing]
        if not parts:
            return 1

    os.makedirs(os.path.join(OUT, 'cut'), exist_ok=True)
    seg_files = []
    for p in parts:
        # one video file of EXACTLY the narration's length: concat this segment's
        # clips, then trim; if the clips are short, slow them fractionally rather
        # than freeze-framing, which reads as a crash on a kids channel
        lst = os.path.join(OUT, 'cut', 'in-%s.txt' % p['seg'])
        with open(lst, 'w') as f:
            for c in p['clips']:
                f.write("file '%s'\n" % os.path.abspath(c))
        # The join is deterministic from the shots, and re-encoding sixteen 1080p clips
        # takes minutes. Cache it, so iterating on the CUT — which is the part a human
        # actually wants to try twice — costs seconds instead. --recut throws it away.
        joined = os.path.join(OUT, 'cut', 'j-%s.mp4' % p['seg'])
        newest = max(os.path.getmtime(c) for c in p['clips'])
        if not (os.path.exists(joined) and os.path.getmtime(joined) > newest):
            subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0',
                            '-i', lst, '-an', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium',
                            '-pix_fmt', 'yuv420p', '-r', '24', joined], check=True)
        cut = os.path.join(OUT, 'cut', 'v-%s.mp4' % p['seg'])
        if p['have'] >= p['need']:
            vf = 'trim=0:%.3f,setpts=PTS-STARTPTS' % p['need']
        else:
            vf = 'setpts=%.6f*PTS' % (p['need'] / p['have'])

        # THE TITLE rides on the hook, over the establishing shot, rather than sitting on
        # a black card of its own. Eight seconds of a still title is eight seconds a
        # four-year-old spends deciding whether to watch something else.
        title = os.path.join(FRAMES, 'card-title.png')
        if p['seg'] == 'hook' and os.path.exists(title):
            hold = max(1.0, p['need'] - 1.6)
            # -loop 1 -t IS THE WHOLE TRICK. A PNG is one frame at t=0 with no timeline,
            # so `fade=t=in:st=0.5:alpha=1` sets that frame's alpha to 0 (it is before the
            # fade's start) and nothing ever turns it back on. The overlay runs, ffmpeg
            # exits 0, and the title is invisible in the finished film — which is exactly
            # what happened, and cost a full re-render to notice.
            subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', joined,
                            '-loop', '1', '-t', '%.3f' % p['need'], '-i', title,
                            '-filter_complex',
                            # the scrim goes on the BASE, before the title lands on top —
                            # applied after the overlay it dims the lettering too, which is
                            # the kind of filter-order bug that looks like a bad font
                            # no drawbox: the scrim is baked into the card, over the top
                            # of frame only, so the characters keep their own light
                            '[0:v]%s[base];'
                            '[1:v]format=rgba,fade=t=in:st=0.5:d=0.7:alpha=1,'
                            'fade=t=out:st=%.2f:d=0.8:alpha=1[t];'
                            '[base][t]overlay=0:0:format=auto'
                            % (vf, hold),
                            '-an', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium',
                            '-pix_fmt', 'yuv420p', '-r', '24', cut], check=True)
        else:
            subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', joined, '-vf', vf,
                            '-an', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium',
                            '-pix_fmt', 'yuv420p', '-r', '24', cut], check=True)
        seg_files.append((cut, p['aud'], p['need']))

    # THE END CARD: the moral, the mark, the address, and three and a half seconds of
    # quiet to read it in. Silent on purpose — the narration has already said the moral,
    # and repeating it in a second voice is how a children's video starts to nag.
    endcard = os.path.join(FRAMES, 'card-end.png')
    end_v = end_a = None
    if os.path.exists(endcard):
        end_v = os.path.join(OUT, 'cut', 'v-end.mp4')
        end_a = os.path.join(OUT, 'cut', 'a-end.m4a')
        subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-loop', '1', '-t', '3.5',
                        '-i', endcard, '-vf', 'scale=1920:1080,fade=t=in:st=0:d=0.5',
                        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium',
                        '-pix_fmt', 'yuv420p', '-r', '24', end_v], check=True)
        subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-f', 'lavfi',
                        '-i', 'anullsrc=r=24000:cl=mono', '-t', '3.5',
                        '-c:a', 'aac', '-b:a', '160k', end_a], check=True)
        seg_files.append((end_v, end_a, 3.5))

    vlist = os.path.join(OUT, 'cut', 'video.txt')
    with open(vlist, 'w') as f:
        for c, _, _ in seg_files:
            f.write("file '%s'\n" % os.path.abspath(c))
    alist = os.path.join(OUT, 'cut', 'audio.txt')
    with open(alist, 'w') as f:
        for _, a, _ in seg_files:
            f.write("file '%s'\n" % os.path.abspath(a))

    vid = os.path.join(OUT, 'cut', 'video.mp4')
    aud = os.path.join(OUT, 'cut', 'audio.m4a')
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0',
                    '-i', vlist, '-c', 'copy', vid], check=True)
    # the narration segments butt-joined with the same 0.35s of air the video was cut for
    inputs, filt = [], []
    for i, (_, a, _) in enumerate(seg_files):
        inputs += ['-i', a]
        filt.append('[%d:a]apad=pad_dur=0.35[a%d]' % (i, i))
    fc = ';'.join(filt) + ';' + ''.join('[a%d]' % i for i in range(len(seg_files))) + \
         'concat=n=%d:v=0:a=1[out]' % len(seg_files)
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error'] + inputs +
                   ['-filter_complex', fc, '-map', '[out]', '-c:a', 'aac', '-b:a', '160k', aud],
                   check=True)

    final = os.path.join(OUT, 'bizzing-india-kambugriva.mp4')
    # LOUDNESS. The narration is synthesised speech and lands around -24 LUFS, which is
    # far quieter than anything else in a child's YouTube feed; the platform normalises
    # to roughly -14 and would simply leave ours sitting low next to the video that plays
    # next. `loudnorm` brings it to -14 LUFS with a -1.5 dBTP ceiling, which is the target
    # to hand YouTube rather than one to argue with.
    #
    # And the video is re-encoded rather than copied: the segment files are CRF 18 at
    # ~10.6 Mbps, which is well past the point where flat cel-shaded animation gains
    # anything. CRF 20 at 48 kHz stereo is the delivery master.
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', vid, '-i', aud,
                    '-map', '0:v:0', '-map', '1:a:0',
                    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000',
                    '-c:v', 'libx264', '-crf', '20', '-preset', 'slow',
                    '-profile:v', 'high', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '192k', '-ac', '2',
                    '-shortest', '-movflags', '+faststart', final], check=True)
    # A PREVIEW ALONGSIDE THE MASTER. The master is the thing that goes to YouTube and it
    # is deliberately big; it is also too big to send to anyone through most chat or mail,
    # which is how a finished film ends up unwatched by the person who asked for it. 720p
    # at 2.2 Mbps holds up fine for flat cel animation and lands comfortably under 30 MB.
    prev = os.path.join(OUT, 'bizzing-india-kambugriva-preview.mp4')
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', final,
                    '-vf', 'scale=1280:720:flags=lanczos',
                    '-c:v', 'libx264', '-b:v', '2200k', '-maxrate', '2600k', '-bufsize', '4400k',
                    '-preset', 'slow', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', prev], check=True)

    for f, what in ((final, 'master  '), (prev, 'preview ')):
        print('%s %s  —  %.1fs, %.1f MB' % (what, f, probe_seconds(f), os.path.getsize(f) / 1e6))
    return 0


# ---------------------------------------------------------------------- main --
def main(argv):
    os.makedirs(FRAMES, exist_ok=True)
    os.makedirs(SHOTS, exist_ok=True)
    only = None
    if '--only' in argv:
        only = set(a for a in argv[argv.index('--only') + 1:] if not a.startswith('-'))
    todo = [s for s in SHOTS_LIST if not only or s['id'] in only]
    force = '--force' in argv
    do_all = '--all' in argv
    rc = 0

    if do_all or '--frames' in argv:
        print('drawing %d first frames (%s)...' % (len(todo), IMAGE_MODEL), flush=True)
        with cf.ThreadPoolExecutor(max_workers=4) as ex:
            for s, (p, how) in zip(todo, ex.map(lambda s: make_frame(s, force), todo)):
                print('  %-4s %s' % (s['id'], how if p else 'FAILED: ' + how), flush=True)
                if not p:
                    rc = 1

    if do_all or '--shots' in argv:
        print('\ngenerating %d shots (%s)...' % (len(todo), VIDEO_MODEL), flush=True)
        with cf.ThreadPoolExecutor(max_workers=4) as ex:
            for s, (p, how) in zip(todo, ex.map(lambda s: make_shot(s, force), todo)):
                print('  %-4s %s' % (s['id'], how if p else 'FAILED: ' + how), flush=True)
                if not p:
                    rc = 1

    if do_all or '--titles' in argv:
        print('\nrendering title cards in the app’s own type...', flush=True)
        res, err = render_cards(force)
        if err:
            print('  FAILED:', err); rc = 1
        else:
            for name, how in res:
                print('  %-12s %s' % (name, how))

    if do_all or '--assemble' in argv:
        rc = assemble() or rc
    return rc


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
