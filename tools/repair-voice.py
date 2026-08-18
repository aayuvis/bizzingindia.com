#!/usr/bin/env python3
"""Find clips that came back SILENT, and re-record them until they are not.

WHY THIS EXISTS. A child reported that the Hindi letters "were just a sigh" and that
जी was not pronounced at all. Both were true, and neither showed up in any check we
had: the files were on disk, the manifest listed them, the player found them and
played them. They were a quarter-second of breath at -40 dB.

Thirty-two of them, all Hindi, scattered across the letters, the vowel signs and the
short function words (है, हैं, जी, भी, आज, सब, तक, था). The synthesiser had returned
200 OK with an all-but-empty MP3 and the pipeline wrote it, because the pipeline's
definition of success was "the request did not fail".

    A 200 is not audio. The only check that would have caught this is listening.

So this tool listens, in the only way a program can: it decodes every clip and
measures its peak level. Anything at or under the floor is re-recorded, and the
re-recording is measured too, and retried, and if it still comes back silent the
clip is REPORTED rather than quietly written. tools/verify.js gained the same gate
so it can never come back.

    python3 tools/repair-voice.py --scan                 # measure, change nothing
    python3 tools/repair-voice.py [--all] [--workers 6]  # measure and re-record
    python3 tools/repair-voice.py --scan --include-stories

Story and epic narration is skipped by default: it is 8,000 clips of full sentences,
it takes minutes to decode, and a silent one there is not what anyone reported. Pass
--include-stories to sweep those too.
"""
import concurrent.futures as cf
import json
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts                                        # noqa: E402  (same dir)

import imageio_ffmpeg                             # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = os.path.join(ROOT, 'app', 'voice')
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# THE FLOOR. A real clip of this corpus peaks between -8 and 0 dB; the broken ones
# peak between -33 and -76. There is a 20 dB gap between the two populations and no
# clip anywhere in it, so -20 is a floor with room on both sides rather than a
# threshold anyone has to tune. Duration is a second, independent signal: no word in
# any of these packs is spoken in under a third of a second.
FLOOR_DB = -20.0
FLOOR_SEC = 0.35


def probe(path):
    """(max_dB, seconds). A file ffmpeg cannot read at all reads as silent, which is
    the right answer for our purposes -- it is certainly not audible."""
    r = subprocess.run([FFMPEG, '-i', path, '-af', 'volumedetect', '-f', 'null', '-'],
                       capture_output=True, text=True)
    mx = re.search(r'max_volume: (-?[\d.]+) dB', r.stderr)
    du = re.search(r'Duration: 00:00:(\d+\.\d+)', r.stderr)
    return (float(mx.group(1)) if mx else -99.0), (float(du.group(1)) if du else 0.0)


def clip_files(include_stories):
    out = []
    for d in sorted(os.listdir(VOICE)):
        p = os.path.join(VOICE, d)
        if not os.path.isdir(p):
            continue
        if d in ('st', 'ep') and not include_stories:
            continue
        for f in sorted(os.listdir(p)):
            if f.endswith('.mp3'):
                out.append(d + '/' + f[:-4])
    return out


def scan(keys, workers=10):
    bad = []
    with cf.ThreadPoolExecutor(max_workers=workers) as ex:
        futs = {ex.submit(probe, os.path.join(VOICE, k + '.mp3')): k for k in keys}
        for fut in cf.as_completed(futs):
            k = futs[fut]
            mx, du = fut.result()
            if mx <= FLOOR_DB or du < FLOOR_SEC:
                bad.append((k, mx, du))
    bad.sort()
    return bad


def texts():
    """key -> {text, lang} for every Bhasha clip the engine asks for. This is the
    same source tts.py --bhasha uses, so a repaired clip says exactly what the
    engine believes it says -- including the matra fix, where a vowel sign is voiced
    on its carrier syllable because a combining mark has no sound of its own."""
    return {c['key']: c for c in tts.bhasha_clips()}


def main(argv):
    workers = int(argv[argv.index('--workers') + 1]) if '--workers' in argv else 6
    include_stories = '--include-stories' in argv

    keys = clip_files(include_stories)
    print('measuring %d clips...' % len(keys), flush=True)
    bad = scan(keys)

    print('\n%d clip%s at or under %.0f dB / %.2fs:' %
          (len(bad), '' if len(bad) == 1 else 's', FLOOR_DB, FLOOR_SEC))
    known = texts()
    for k, mx, du in bad:
        t = known.get(k)
        print('  %-22s max %6.1f dB  %.2fs   %s' %
              (k, mx, du, repr(t['text']) if t else '(not a Bhasha clip)'))

    if '--scan' in argv or not bad:
        return 0 if not bad else 1

    # Re-record. Only clips the engine can give us text for -- guessing what a story
    # clip was supposed to say from its filename is exactly the kind of plausible
    # invention this codebase does not do.
    todo = [(k, known[k]) for k, _, _ in bad if k in known]
    skipped = [k for k, _, _ in bad if k not in known]
    if skipped:
        print('\n  skipping %d clip(s) with no text in the engine: %s' %
              (len(skipped), ', '.join(skipped)))
    if not todo:
        return 1

    print('\nre-recording %d clip(s)...' % len(todo), flush=True)
    still, fixed = [], 0

    def redo(item):
        k, c = item
        # TWO ATTEMPTS, and the second is not a blind retry: an SSML wrapper with a
        # breath either side gives the voice an utterance to place rather than a
        # fragment, which is what a bare glyph looks like to it.
        for attempt in (0, 1):
            try:
                tts.synthesize_one({'key': k, 'text': c['text'], 'lang': c['lang']},
                                   force=True, lead_ms=(200 if attempt else 0))
            except Exception as e:
                return k, None, str(e)
            mx, du = probe(os.path.join(VOICE, k + '.mp3'))
            if mx > FLOOR_DB and du >= FLOOR_SEC:
                return k, (mx, du), None
        return k, (mx, du), 'still silent'

    with cf.ThreadPoolExecutor(max_workers=workers) as ex:
        for k, got, err in ex.map(redo, todo):
            if err:
                still.append((k, err))
                print('  !! %-22s %s' % (k, err))
            else:
                fixed += 1
                print('  ok %-22s max %6.1f dB  %.2fs' % (k, got[0], got[1]))

    print('\n%d repaired, %d still silent' % (fixed, len(still)))
    if still:
        print('Those need a human ear and probably a different word, not another retry.')
    return 1 if still else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
