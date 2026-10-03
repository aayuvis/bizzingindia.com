#!/usr/bin/env python3
"""Where each line of a chanted verse starts and ends, measured from the audio.

The verse player lights the line being chanted, and the guru's "repeat after me" plays ONE line and
then waits for the child. Both need the line boundaries, and they are measured here, not guessed:
the chant pauses for breath between half-verses, so the cuts are the silences nearest to where the
letters say a line should end. A verse whose silences do not line up is cut by letter count and
marked `est`, and the player says nothing different — it just lights the lines a little less exactly.

Reads app/voice/gita/<ch>-<v>.mp3 (and human/<ch>-<v>.mp3, which wins), writes
tools/gita-src/chant-lines.json. Fast, local, no network; rerun any time. Then `node tools/build-gita.js`.
"""
import os, re, sys, json, subprocess, unicodedata
import imageio_ffmpeg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = os.path.join(ROOT, 'app', 'voice', 'gita')
OUT = os.path.join(ROOT, 'tools', 'gita-src', 'chant-lines.json')
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def norm(s):
    s = unicodedata.normalize('NFC', s.lower())
    return re.sub(r'[^a-zāīūṛṝḷḹṃḥṅñṭḍṇśṣ]', '', s)


def lines_of_all():
    """[{id, lines:[iast of each chanted line, speaker line included where it is chanted]}]"""
    js = r'''
const { iast } = require('./tools/lib/sanskrit.js'); global.window = {};
const out = {};
for (let n = 1; n <= 18; n++) {
  require('./app/data-gita-' + String(n).padStart(2, '0') + '.js');
  for (const x of window.IND_GITA_V[n]) {
    const lines = x.sa.split('\n'); let dev = lines;
    if (x.spl && x.spp === 'before') dev = [x.spl].concat(lines);
    else if (x.spl) dev = [lines[0], x.spl].concat(lines.slice(1));
    out[n + '-' + x.v] = dev.map(l => iast(l.replace(/[।॥]/g, ' ')));
  }
}
process.stdout.write(JSON.stringify(out));'''
    return json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, check=True, text=True).stdout)


def silences(mp3):
    r = subprocess.run([FFMPEG, '-hide_banner', '-i', mp3, '-af', 'silencedetect=noise=-35dB:d=0.22', '-f', 'null', '-'],
                       capture_output=True, text=True)
    err = r.stderr
    dur = re.search(r'Duration: (\d+):(\d+):([\d.]+)', err)
    d = int(dur.group(1)) * 3600 + int(dur.group(2)) * 60 + float(dur.group(3))
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', err)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', err)]
    gaps = [(a, b) for a, b in zip(st, en) if a > 0.4 and b < d - 0.4]
    return d, gaps


def cut(d, gaps, weights):
    tot = float(sum(weights)) or 1.0
    want, acc = [], 0
    for w in weights[:-1]:
        acc += w; want.append(acc / tot * d)
    segs, est, prev = [], 0, 0.0
    used = set()
    bounds = []
    for x in want:
        best = None
        for i, (a, b) in enumerate(gaps):
            if i in used or (a + b) / 2 <= prev + 0.8:
                continue
            m = (a + b) / 2
            if abs(m - x) <= 0.22 * d and (best is None or abs(m - x) < abs((gaps[best][0] + gaps[best][1]) / 2 - x)):
                best = i
        if best is None:
            est += 1; bounds.append((x, x)); prev = x
        else:
            used.add(best); bounds.append(gaps[best]); prev = (gaps[best][0] + gaps[best][1]) / 2
    s = 0.0
    for a, b in bounds:
        segs.append([round(s, 2), round(a, 2)]); s = b
    segs.append([round(s, 2), round(d, 2)])
    return segs, est


if __name__ == '__main__':
    L = lines_of_all()
    have = json.load(open(OUT)) if os.path.exists(OUT) else {}
    n = 0
    for vid, lines in L.items():
        for kind, path in (('human', os.path.join(VOICE, 'human', vid + '.mp3')), ('tts', os.path.join(VOICE, vid + '.mp3'))):
            if not os.path.exists(path):
                continue
            mt = int(os.path.getmtime(path))
            if have.get(vid, {}).get('mt') == mt and have[vid].get('kind') == kind:
                break
            d, gaps = silences(path)
            segs, est = cut(d, gaps, [max(1, len(norm(x))) for x in lines])
            have[vid] = {'kind': kind, 'mt': mt, 'd': round(d, 2), 'seg': segs, 'est': est}
            n += 1
            break
    json.dump(have, open(OUT + '.part', 'w'), indent=0, sort_keys=True)
    os.replace(OUT + '.part', OUT)
    est = sum(1 for v in have.values() if v['est'])
    print('gita-lines: %d measured now, %d in all; %d cut partly by letter count' % (n, len(have), est))
