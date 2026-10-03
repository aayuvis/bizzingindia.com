#!/usr/bin/env python3
"""Chant the 700 verses of the Gita with a computer voice, keep the best of three, and say how it was checked.

The owner's decision (3 Oct 2026): until a human reciter records them, every verse is chanted by Google's
voice and LABELLED as a computer voice on screen. A reciter's file replaces a verse the day it exists —
it goes in app/voice/gita/human/<ch>-<v>.mp3 and the player prefers it.

How a verse is made:
  1. The speaker line (श्रीभगवानुवाच …) is chanted where the text has it: before the verse, or between
     the half-verses for 1.21 and 1.28.
  2. Three takes. Each is transcribed BLIND — the listener is not told the verse — and scored by edit
     distance against the IAST converted from the same Devanagari (tools/lib/sanskrit.js). A listener that
     is told the text hears the text; that was measured once already (distance 0 on a take that said f
     for ph).
  3. The best take is kept. If even the best is far off (> 12% of the letters), up to three more are made.
  4. Silence is trimmed, loudness evened, and it is written as a small mono MP3 (24 kbps: 700 slow chants are six hours of audio, and the site has a size limit). The blind transcript and
     the distance go in the manifest, so the screen can say exactly how it was checked.

--improve N retakes (three more) any kept verse the listener heard N+ letters off, and keeps a
better take only. Models come from the environment (TTS_MODEL, ASR_MODEL) and the key from GEMKEY. None of them is written
into this repo. Resumable: a verse already in the manifest is skipped. --only 2.47,12.13 does just those
and says so; with no --only it says out loud that it is about to do everything.
"""
import os, sys, json, base64, time, wave, re, random, hashlib, subprocess, threading, unicodedata, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'app', 'voice', 'gita')
MANIFEST = os.path.join(ROOT, 'tools', 'gita-src', 'chant.json')
TAKES = os.environ.get('GITA_TAKES') or os.path.join(ROOT, 'build', 'gita-takes')
KEY, TTS, ASR = os.environ['GEMKEY'], os.environ['TTS_MODEL'], os.environ['ASR_MODEL']
VOICE = os.environ.get('GITA_VOICE', 'Charon')
WORKERS = int(os.environ.get('GITA_WORKERS', '4'))
import imageio_ffmpeg
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# Measured on 2.47, 11.32, 1.21 and 12.13, blind: "steady, flowing" was word-perfect on 6 of 8 takes, "slowly" on 3 of 8.
STYLE = ("Chant melodically at a steady, flowing recitation pace, the way a Sanskrit teacher chants a shloka through once "
         "for children to learn by heart. Pronounce it with a South Indian Sanskrit accent, where ph is always p-h (as in "
         "'top-hat'), never f, and ṇ, ṣ are retroflex.")
HEAR = ("Transcribe this Sanskrit audio into IAST exactly as pronounced, sound by sound. You do NOT know the text in "
        "advance: write what the sounds are, including any mispronunciation (e.g. f for ph, dental n for retroflex ṇ, "
        "s for ṣ, dropped vowels). Return only the IAST, no commentary.")
API = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent'
lock = threading.Lock()


def log(*a):
    with lock:
        print(time.strftime('%H:%M:%S'), *a, flush=True)


def call(model, body, timeout=240):
    """POST with patience: 429/5xx and empty answers back off and retry; anything else raises."""
    for attempt in range(8):
        req = urllib.request.Request(API % model, data=json.dumps(body).encode(),
                                     headers={'Content-Type': 'application/json', 'X-goog-api-key': KEY})
        try:
            r = json.load(urllib.request.urlopen(req, timeout=timeout))
            parts = (((r.get('candidates') or [{}])[0].get('content') or {}).get('parts')) or []
            if parts:
                return parts[0]
            why = (r.get('candidates') or [{}])[0].get('finishReason', 'no content')
        except urllib.error.HTTPError as e:
            why = 'HTTP %d %s' % (e.code, e.read()[:160].decode('utf8', 'replace').replace('\n', ' '))
            if e.code not in (429, 500, 502, 503, 504):
                raise RuntimeError(why)
        except Exception as e:  # timeouts, resets
            why = type(e).__name__ + ' ' + str(e)[:120]
        wait = min(120, 4 * 2 ** attempt) + random.random() * 3
        log('  retry', model[:6] + '…', why[:90], 'in %ds' % wait)
        time.sleep(wait)
    raise RuntimeError('gave up: ' + why)


def norm(s):
    s = unicodedata.normalize('NFC', s.lower())
    return re.sub(r'[^a-zāīūṛṝḷḹṃḥṅñṭḍṇśṣ]', '', s)


def lev(a, b):
    """edit distance, with an anusvāra in the text (b) matched by the nasal it is said as (tools/lib/sanskrit.js)"""
    p = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        c = [i]
        for j, y in enumerate(b, 1):
            same = x == y or (y == 'ṃ' and x in 'mnṅñṃ') or (y == 'ḥ' and x in 'śṣs' and j < len(b) and b[j] == x)
            c.append(min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (0 if same else 1)))
        p = c
    return p[-1]


def take(job, k):
    wav = os.path.join(TAKES, '%s-%d.wav' % (job['id'], k))
    if not os.path.exists(wav):
        part = call(TTS, {'contents': [{'parts': [{'text': STYLE + ' Chant: ' + job['dev']}]}],
                          'generationConfig': {'responseModalities': ['AUDIO'],
                                               'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': VOICE}}}}})
        pcm = base64.b64decode(part['inlineData']['data'])
        w = wave.open(wav + '.part', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm); w.close()
        os.replace(wav + '.part', wav)
    sec = os.path.getsize(wav) / 48000
    if sec < 1.5:
        return {'k': k, 'wav': wav, 'sec': round(sec, 1), 'dist': 999, 'of': len(norm(job['iast'])), 'heard': ''}
    audio = base64.b64encode(open(wav, 'rb').read()).decode()
    heard = call(ASR, {'contents': [{'parts': [{'inlineData': {'mimeType': 'audio/wav', 'data': audio}}, {'text': HEAR}]}]})
    heard = (heard.get('text') or '').strip()
    want = norm(job['iast'])
    return {'k': k, 'wav': wav, 'sec': round(sec, 1), 'dist': lev(norm(heard), want), 'of': len(want), 'heard': heard}


def encode(src, dst):
    af = ('silenceremove=start_periods=1:start_silence=0.15:start_threshold=-45dB,areverse,'
          'silenceremove=start_periods=1:start_silence=0.4:start_threshold=-45dB,areverse,'
          'loudnorm=I=-18:TP=-2:LRA=11')
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', src, '-af', af, '-ar', '24000', '-ac', '1',
                    '-codec:a', 'libmp3lame', '-b:a', '24k', dst + '.part.mp3'], check=True)
    os.replace(dst + '.part.mp3', dst)


def improve(job, done, floor):
    """--improve N: a verse already kept whose blind listener heard N or more letters differently gets
    three more takes (numbered from 6, so no earlier take is reused), and a new one replaces it only
    if it is heard more exactly. The judge is itself a program and is noisy at one or two letters,
    so this is for the verses it is sure about."""
    old = done.get(job['id'])
    if old:
        old = dict(old, dist=lev(norm(old['heard']), norm(job['iast'])))     # the fair figure, whatever was stored
    if not old or old['dist'] < floor or old.get('txt') not in (None, hashlib.sha1(job['dev'].encode()).hexdigest()[:12]):
        return
    with ThreadPoolExecutor(3) as ex:
        new = list(ex.map(lambda k: take(job, k), range(6, 9)))
    best = min(new, key=lambda t: (t['dist'] / t['of'], t['sec']))
    if best['dist'] >= old['dist']:
        log(job['id'], 'kept: three more takes were no better (%d vs %d)' % (best['dist'], old['dist']))
        return
    encode(best['wav'], os.path.join(OUT, job['id'] + '.mp3'))
    rec = dict(old, take=best['k'], takes=old['takes'] + 3, dist=best['dist'], of=best['of'], sec=best['sec'], heard=best['heard'],
               txt=hashlib.sha1(job['dev'].encode()).hexdigest()[:12], others=old.get('others', []) + [[old['dist'], old['sec']]] + [[t['dist'], t['sec']] for t in new if t is not best])
    with lock:
        done[job['id']] = rec
        json.dump(done, open(MANIFEST + '.part', 'w'), ensure_ascii=False, indent=0, sort_keys=True)
        os.replace(MANIFEST + '.part', MANIFEST)
    log(job['id'], 'improved: %d → %d of %d letters off' % (old['dist'], best['dist'], best['of']))


def verse(job, done):
    if job['id'] in done and os.path.exists(os.path.join(OUT, job['id'] + '.mp3')):
        return
    takes = []
    with ThreadPoolExecutor(3) as ex:
        takes += list(ex.map(lambda k: take(job, k), range(3)))
    best = min(takes, key=lambda t: (t['dist'] / t['of'], t['sec']))
    k = 3
    while best['dist'] / best['of'] > 0.12 and k < 6:
        takes.append(take(job, k)); k += 1
        best = min(takes, key=lambda t: (t['dist'] / t['of'], t['sec']))
    encode(best['wav'], os.path.join(OUT, job['id'] + '.mp3'))
    rec = {'take': best['k'], 'takes': len(takes), 'dist': best['dist'], 'of': best['of'], 'sec': best['sec'],
           'txt': hashlib.sha1(job['dev'].encode()).hexdigest()[:12],    # which text was chanted: a corrected verse is re-chanted
           'heard': best['heard'], 'others': [[t['dist'], t['sec']] for t in takes if t is not best]}
    with lock:
        done[job['id']] = rec
        json.dump(done, open(MANIFEST + '.part', 'w'), ensure_ascii=False, indent=0, sort_keys=True)
        os.replace(MANIFEST + '.part', MANIFEST)
    log(job['id'], 'take', best['k'], 'of', len(takes), '· %d/%d off' % (best['dist'], best['of']), '· %.1fs' % best['sec'],
        '· %d/700 done' % len(done))


def jobs():
    js = r'''
const { iast } = require('./tools/lib/sanskrit.js'); global.window = {};
const out = [];
for (let n = 1; n <= 18; n++) {
  require('./app/data-gita-' + String(n).padStart(2, '0') + '.js');
  for (const x of window.IND_GITA_V[n]) {
    const lines = x.sa.split('\n'); let dev = lines;
    if (x.spl && x.spp === 'before') dev = [x.spl].concat(lines);
    else if (x.spl) dev = [lines[0], x.spl].concat(lines.slice(1));
    dev = dev.join('\n');
    out.push({ id: n + '-' + x.v, dev, iast: iast(dev.replace(/[।॥]/g, ' ')) });
  }
}
process.stdout.write(JSON.stringify(out));'''
    return json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, check=True, text=True).stdout)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True); os.makedirs(TAKES, exist_ok=True)
    all_jobs = jobs()
    assert len(all_jobs) == 700, len(all_jobs)
    only = None
    if '--only' in sys.argv:
        only = set(x.replace('.', '-') for x in sys.argv[sys.argv.index('--only') + 1].split(','))
        all_jobs = [j for j in all_jobs if j['id'] in only]
        log('only', len(all_jobs), 'verses:', ', '.join(j['id'] for j in all_jobs))
    else:
        log('no --only: this will chant every one of the 700 verses not already in', os.path.relpath(MANIFEST, ROOT))
    if '--redo' in sys.argv and only:
        for j in all_jobs:
            for k in range(6):
                p = os.path.join(TAKES, '%s-%d.wav' % (j['id'], k))
                if os.path.exists(p): os.remove(p)
    done = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
    if '--redo' in sys.argv and only:
        for j in all_jobs: done.pop(j['id'], None)
    if '--improve' in sys.argv:
        floor = int(sys.argv[sys.argv.index('--improve') + 1])
        log('improving every kept verse heard %d or more letters off' % floor)
        with ThreadPoolExecutor(WORKERS) as ex:
            for f in [ex.submit(improve, j, done, floor) for j in all_jobs]:
                try:
                    f.result()
                except Exception as e:
                    log('FAILED', e)
        sys.exit(0)
    with ThreadPoolExecutor(WORKERS) as ex:
        for f in [ex.submit(verse, j, done) for j in all_jobs]:
            try:
                f.result()
            except Exception as e:
                log('FAILED', e)
    log('finished:', len(done), 'of 700 in the manifest')
