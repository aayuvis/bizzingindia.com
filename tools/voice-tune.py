#!/usr/bin/env python3
"""Tune narration after synthesis: pitch, pause length, size — exactly.

WHY THIS IS A SEPARATE PASS. The narrator (en-IN-Chirp3-HD-Laomedeia) REJECTS the
API's pitch parameter outright, and explicit <break> tags make its pauses LONGER,
not shorter (measured: 11.7s -> 14.0s on the same paragraph). An SSML prosody
wrapper does move both, but not by amounts you can dial: -5% asked gave -3.5%
pitch and an unasked-for -35% of pause.

So synthesis stays plain and honest — phoneme tags for the Indian names, nothing
else — and the shaping happens here, where it is arithmetic instead of a guess:

    --pitch -5     lower the voice 5%, duration untouched (asetrate + atempo)
    --pause -15    every silence longer than 120ms gets 15% shorter
                   (only the gap shrinks; not one syllable is cut)

The raw synthesis is kept under masters/voice/ exactly as the paintings keep
masters/. That is the point of this design: retuning the whole library later
costs a local minute instead of another API bill.

  python3 tools/voice-tune.py app/voice/st --pitch -5 --pause -15
"""
import os, sys, subprocess, tempfile, wave
import numpy as np
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
SR = 24000

def decode(path):
    raw = subprocess.run([FF, '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1',
                          '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16)

def shorten_pauses(x, pct, thresh=400, minlen=0.12):
    """Trim `pct`% off every silent run longer than minlen. Speech is never touched."""
    if not pct:
        return x
    win = int(0.02 * SR)
    keep = np.ones(len(x), bool)
    i = 0
    while i < len(x) - win:
        if np.abs(x[i:i + win]).mean() < thresh:
            j = i
            while j < len(x) - win and np.abs(x[j:j + win]).mean() < thresh:
                j += win
            if (j - i) / SR >= minlen:
                cut = int((j - i) * pct / 100.0)
                # take it out of the middle of the gap, so the edges of speech
                # keep their natural decay and onset
                mid = (i + j) // 2
                keep[mid - cut // 2: mid - cut // 2 + cut] = False
            i = j
        else:
            i += win
    return x[keep]

def tune(path, pitch_pct, pause_pct):
    x = shorten_pauses(decode(path), pause_pct)
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as t:
        tmp = t.name
    with wave.open(tmp, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(x.astype(np.int16).tobytes())
    r = 1 + pitch_pct / 100.0                      # 0.95 for -5%
    af = ('asetrate=%d,aresample=%d,atempo=%.6f' % (int(SR * r), SR, 1 / r)) if pitch_pct else 'anull'
    subprocess.run([FF, '-v', 'error', '-y', '-i', tmp, '-af', af,
                    '-ac', '1', '-ar', str(SR), '-b:a', '32k', path], check=True)
    os.unlink(tmp)

def main(argv):
    d = argv[0]
    pitch = float(argv[argv.index('--pitch') + 1]) if '--pitch' in argv else 0
    pause = float(argv[argv.index('--pause') + 1]) if '--pause' in argv else 0
    files = [os.path.join(r, f) for r, _, fs in os.walk(d) for f in fs if f.endswith('.mp3')]
    print('tuning %d clips: pitch %+g%%, pauses %+g%%' % (len(files), pitch, pause))
    for n, f in enumerate(files, 1):
        tune(f, pitch, pause)
        if n % 200 == 0:
            print('  ... %d / %d' % (n, len(files)), flush=True)
    print('done')

if __name__ == '__main__':
    main(sys.argv[1:])
