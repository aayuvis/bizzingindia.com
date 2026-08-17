#!/usr/bin/env python3
"""Re-encode the narration corpus smaller, without changing a single clip key.

WHY: app/voice is 722MB of MP3 and every one of those bytes ships to a child's device,
gets committed to git twice (branch and gh-pages), and has to work offline. The clips came
back from the synthesiser at 64 kbps mono 24 kHz, which is roughly twice what speech at
this sample rate needs.

WHY MP3 AND NOT OPUS, which would be smaller. Measured on a real clip:

    source (64 kbps mp3)   92,352 bytes
    opus 24 kbps           33,144 bytes   2.8x smaller
    mp3  32 kbps           46,604 bytes   2.0x smaller

Opus wins on size and would be the obvious choice for a desktop app. It is the wrong
choice here: this app's audience is diaspora families, which means a great many iPhones
and iPads, and Opus-in-Ogg support across Safari versions is patchy enough that some
children would get silence instead of a story. Shipping the smaller file that sometimes
does not play is not a saving. MP3 plays everywhere, including offline, including on an
old iPad handed down to the youngest child — which is exactly the device this has to work
on. Half the size at zero compatibility risk is the trade to take.

Nothing else changes: same filenames, same keys, same manifest. The player does not learn
a new extension and no data file is touched.

    python3 tools/shrink-voice.py --dry-run
    python3 tools/shrink-voice.py [--bitrate 32] [--workers 6]
"""
import concurrent.futures as cf
import os
import subprocess
import sys

import imageio_ffmpeg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = os.path.join(ROOT, 'app', 'voice')
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def clips():
    out = []
    for base, _, files in os.walk(VOICE):
        for f in files:
            if f.endswith('.mp3'):
                out.append(os.path.join(base, f))
    return sorted(out)


def shrink(path, bitrate):
    """Re-encode in place via a temp file. The original is only replaced once the new one
    exists and is plausible — a killed run must never leave a child with a 0-byte story."""
    tmp = path + '.tmp.mp3'
    try:
        subprocess.run(
            [FFMPEG, '-y', '-loglevel', 'error', '-i', path,
             '-c:a', 'libmp3lame', '-b:a', '%dk' % bitrate, '-ac', '1', '-ar', '24000', tmp],
            check=True, capture_output=True)
        before, after = os.path.getsize(path), os.path.getsize(tmp)
        # A re-encode that came out BIGGER means the source was already at or below the
        # target; keep the original rather than growing the corpus to hit a number.
        if after < 500 or after >= before:
            os.remove(tmp)
            return before, before
        os.replace(tmp, path)
        return before, after
    except Exception:
        if os.path.exists(tmp):
            os.remove(tmp)
        return None


def main(argv):
    bitrate = 32
    workers = 6
    if '--bitrate' in argv:
        bitrate = int(argv[argv.index('--bitrate') + 1])
    if '--workers' in argv:
        workers = int(argv[argv.index('--workers') + 1])

    files = clips()
    total = sum(os.path.getsize(f) for f in files)
    print('%d mp3 clips, %.1f MB' % (len(files), total / 1e6))

    if '--dry-run' in argv:
        sample = files[:4]
        for f in sample:
            r = shrink(f + '', bitrate) if False else None
        print('DRY-RUN: would re-encode %d clips at %d kbps mono' % (len(files), bitrate))
        return

    done = failed = 0
    saved_before = saved_after = 0
    with cf.ThreadPoolExecutor(max_workers=workers) as pool:
        futs = {pool.submit(shrink, f, bitrate): f for f in files}
        for fut in cf.as_completed(futs):
            r = fut.result()
            if r is None:
                failed += 1
                continue
            b, a = r
            saved_before += b
            saved_after += a
            done += 1
            if done % 500 == 0:
                print('  ... %d / %d' % (done, len(files)))

    print('DONE %d re-encoded, %d failed' % (done, failed))
    print('%.1f MB -> %.1f MB  (%.1fx smaller, %.0f MB saved)' % (
        saved_before / 1e6, saved_after / 1e6,
        saved_before / max(1, saved_after), (saved_before - saved_after) / 1e6))


if __name__ == '__main__':
    main(sys.argv[1:])
