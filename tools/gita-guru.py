#!/usr/bin/env python3
"""The guru's voice: every line of tools/gita-src/guru.json spoken, word for word, in the voice that
chants the verses (docs/21 §8), so the teacher who talks and the teacher who chants are one person.

Three takes a line; each is transcribed blind (the listener is not told the line) and the take whose
words match best is kept. Writes app/voice/gita/guru/<key>.mp3 and tools/gita-src/guru-voice.json
(per line: a hash of the words spoken, and how many words the listener heard differently).
Models and key from the environment, as tools/gita-chant.py. Resumable; --only welcome,read redoes those.
"""
import os, sys, json, re, hashlib
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib.util
spec = importlib.util.spec_from_file_location('chant', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gita-chant.py'))
chant = importlib.util.module_from_spec(spec); spec.loader.exec_module(chant)

ROOT = chant.ROOT
OUT = os.path.join(ROOT, 'app', 'voice', 'gita', 'guru')
MAN = os.path.join(ROOT, 'tools', 'gita-src', 'guru-voice.json')
# The words alone. With the voice that chants, ANY style note in front of them ("Speak this as a warm
# teacher…", even "Say warmly:") was read aloud on 6 of 17 lines, and this model refuses a system
# instruction. Its plain reading is already calm.
STYLE = ""
HEAR = "Transcribe this English speech exactly, word for word. Return only the words."


def words(s):
    return re.sub(r"[^a-z ]", ' ', s.lower().replace("'", '')).split()


def wdist(a, b):
    p = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        c = [i]
        for j, y in enumerate(b, 1):
            c.append(min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (x != y)))
        p = c
    return p[-1]


def one(key, text, k):
    import base64, wave
    wav = os.path.join(chant.TAKES, 'guru-%s-%d.wav' % (key, k))
    if not os.path.exists(wav):
        part = chant.call(chant.TTS, {'contents': [{'parts': [{'text': STYLE + text}]}],
                                      'generationConfig': {'responseModalities': ['AUDIO'],
                                                           'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': chant.VOICE}}}}})
        pcm = base64.b64decode(part['inlineData']['data'])
        w = wave.open(wav, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm); w.close()
    audio = base64.b64encode(open(wav, 'rb').read()).decode()
    heard = chant.call(chant.ASR, {'contents': [{'parts': [{'inlineData': {'mimeType': 'audio/wav', 'data': audio}}, {'text': HEAR}]}]})
    heard = (heard.get('text') or '').strip()
    return {'k': k, 'wav': wav, 'd': wdist(words(heard), words(text)), 'heard': heard, 'sec': round(os.path.getsize(wav) / 48000, 1)}


if __name__ == '__main__':
    lines = {k: v for k, v in json.load(open(os.path.join(ROOT, 'tools', 'gita-src', 'guru.json'))).items() if k != '_'}
    os.makedirs(OUT, exist_ok=True); os.makedirs(chant.TAKES, exist_ok=True)
    man = json.load(open(MAN)) if os.path.exists(MAN) else {}
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
    todo = []
    for key, text in lines.items():
        h = hashlib.sha1(text.encode()).hexdigest()[:12]
        if only is not None and key not in only:
            continue
        if only is None and man.get(key, {}).get('txt') == h and os.path.exists(os.path.join(OUT, key + '.mp3')):
            continue
        todo.append((key, text, h))
    print('guru: %d lines to speak' % len(todo), flush=True)

    def do(item):
        key, text, h = item
        if only is not None:
            for k in range(3):
                p = os.path.join(chant.TAKES, 'guru-%s-%d.wav' % (key, k))
                if os.path.exists(p): os.remove(p)
        with ThreadPoolExecutor(3) as ex:
            takes = list(ex.map(lambda k: one(key, text, k), range(3)))
        best = min(takes, key=lambda t: (t['d'], abs(t['sec'] - len(words(text)) / 2.4)))
        chant.encode(best['wav'], os.path.join(OUT, key + '.mp3'))
        return key, {'txt': h, 'd': best['d'], 'of': len(words(text)), 'sec': best['sec'], 'heard': best['heard']}

    with ThreadPoolExecutor(6) as ex:
        for key, rec in ex.map(do, todo):
            man[key] = rec
            print(key, rec['d'], 'of', rec['of'], 'words off ·', rec['sec'], 's', flush=True)
    json.dump(man, open(MAN, 'w'), indent=1, sort_keys=True, ensure_ascii=False)
