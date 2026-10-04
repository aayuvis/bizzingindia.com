#!/usr/bin/env python3
"""A child's reading of each Gita verse, drafted by a computer from the two translations only.

Owner, 4 Oct 2026: "draft, flagged needs_review". For each of the 700 verses the model is given the
two public-domain translations the verse page already shows — Annie Besant (1922) and Swami
Swarupananda (1909) — and nothing else, and asked for a short plain reading a child of 8 to 12 can
follow. Every draft must pass tools/lib/gita-gloss-lint.js (no name or number that is not in the
translations, no Sanskrit, nothing that ranks a faith, 8–45 words) or it is asked for again; a verse
whose drafts keep failing gets no reading rather than a bad one. Every reading is stored with
needs_review: true, and the page says it was drafted by a computer and not yet checked by a person.

  source keys.env
  TEXT_MODEL=<a Gemini text model> python3 tools/gita-gloss.py [--only 2]   → tools/gita-src/gloss.json
  then: node tools/build-gita.js

  python3 tools/gita-gloss.py --import drafts.json [more.json …]
      takes drafts made elsewhere — [{"id": "2-47", "kid": "…"}], written under RULES below from the
      same two translations — through the same lint, with the same labels. The first 700 were drafted
      this way (4 Oct 2026), by the AI assistant that builds this app, when the Gemini text models
      answered 402 on this key.

The key and the model's name come from the environment, never from this file.
"""
import os, re, sys, json, time, subprocess, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'tools', 'gita-src', 'gloss.json')
LINT = os.path.join(ROOT, 'tools', 'lib', 'gita-gloss-lint.js')
BATCH = 20

RULES = """You write plain readings of Bhagavad Gita verses for children aged 8 to 12, in a children's app
about India. For each verse you are given two public-domain English translations: Annie Besant (1922) and
Swami Swarupananda (1909). Write ONE short reading per verse.

Rules — every one matters:
1. Say only what the translations say. If they differ, say only what they share, or say it more
   generally. Never add a teaching, an interpretation, a commentary or an example that is not in them.
2. Where it helps, begin with who is speaking, in plain words: "Krishna says…", "Arjuna asks…",
   "Sanjaya tells the king…".
3. 12 to 40 words. Short sentences. Words a nine-year-old knows. Keep the verse's own idea whole.
4. Use no names except Krishna, Arjuna, Sanjaya, Dhritarashtra and names that appear in the translations.
   No numbers unless they appear in the translations. No Sanskrit words at all.
5. Do not preach beyond the verse. Never compare faiths, never call anything a myth, never tell the
   child they are bad. Battle and death are said as plainly as the translations say them — never more
   vividly, never softened into something else.
6. Speak of what the verse says ("Krishna says that…"), not as if you were Krishna.

Return only JSON: an array of {"id": "<the id given>", "kid": "<the reading>"}."""


def verses():
    js = r'''
global.window = {}; const out = [];
for (let n = 1; n <= 18; n++) {
  require('./app/data-gita-' + String(n).padStart(2, '0') + '.js');
  for (const x of window.IND_GITA_V[n]) out.push({ id: n + '-' + x.v, ch: n, sp: x.sp, en: x.en, en2: x.en2 || '' });
}
process.stdout.write(JSON.stringify(out));'''
    return json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))


def ask(batch):
    key, model = os.environ.get('GEMKEY'), os.environ.get('TEXT_MODEL')
    if not key or not model:
        sys.exit('GEMKEY and TEXT_MODEL must be set (source keys.env; TEXT_MODEL=<model>)')
    body = RULES + '\n\nThe verses:\n' + json.dumps(
        [{'id': v['id'], 'speaker': v['sp'], 'besant': v['en'], 'swarupananda': v['en2']} for v in batch], ensure_ascii=False)
    req = urllib.request.Request(
        'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent' % model,
        data=json.dumps({'contents': [{'parts': [{'text': body}]}],
                         'generationConfig': {'temperature': 0.3, 'responseMimeType': 'application/json'}}).encode(),
        headers={'Content-Type': 'application/json', 'X-goog-api-key': key})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=240) as r:
                d = json.load(r)
            txt = d['candidates'][0]['content']['parts'][0]['text']
            return {x['id']: x['kid'].strip() for x in json.loads(txt) if x.get('id') and x.get('kid')}
        except Exception as e:  # network, quota, or a malformed answer: wait and ask again
            print('  retry (%s)' % str(e)[:120], flush=True)
            time.sleep(4 * (attempt + 1))
    return {}


def lint(rows):
    p = subprocess.run(['node', LINT], input=json.dumps(rows), capture_output=True, text=True, cwd=ROOT, check=True)
    return {x['id']: x['why'] for x in json.loads(p.stdout)}


def store(have):
    json.dump(dict(sorted(have.items(), key=lambda kv: [int(n) for n in kv[0].split('-')])), open(OUT, 'w'), ensure_ascii=False, indent=1)


def entry(kid):
    return {'kid': kid, 'from': ['Besant 1922', 'Swarupananda 1909'], 'by': 'computer-drafted', 'needs_review': True}


def imported(files):
    have = json.load(open(OUT)) if os.path.exists(OUT) else {}
    by = {v['id']: v for v in verses()}
    drafts = {}
    for f in files:
        for x in json.load(open(f)):
            if x.get('id') in by and x.get('kid'): drafts[x['id']] = x['kid'].strip()
    bad = lint([{'id': k, 'kid': t, 'en': by[k]['en'], 'en2': by[k]['en2']} for k, t in drafts.items()])
    for k, t in drafts.items():
        if k in bad: have.pop(k, None)
        else: have[k] = entry(t)
    store(have)
    print('%d drafts: %d kept, %d failed the lint' % (len(drafts), len(drafts) - len(bad), len(bad)))
    for k, w in list(bad.items())[:40]: print('  %s: %s' % (k, '; '.join(w)))
    missing = [k for k in by if k not in have]
    print('%d of 700 verses have a reading%s' % (700 - len(missing), (' — without: ' + ', '.join(missing[:30])) if missing else ''))


def main():
    if '--import' in sys.argv:
        return imported(sys.argv[sys.argv.index('--import') + 1:])
    only = int(sys.argv[sys.argv.index('--only') + 1]) if '--only' in sys.argv else None
    have = json.load(open(OUT)) if os.path.exists(OUT) else {}
    todo = [v for v in verses() if (only is None or v['ch'] == only)]
    if only is None: print('every chapter: %d verses' % len(todo))
    by = {v['id']: v for v in todo}
    kept = failed = 0
    for i in range(0, len(todo), BATCH):
        batch, got = todo[i:i + BATCH], {}
        for round_ in range(3):
            need = [v for v in batch if v['id'] not in got]
            if not need: break
            drafts = ask(need)
            bad = lint([{'id': k, 'kid': t, 'en': by[k]['en'], 'en2': by[k]['en2']} for k, t in drafts.items() if k in by])
            for k, t in drafts.items():
                if k in by and k not in bad: got[k] = t
            if bad: print('  %d drafts failed the lint: %s' % (len(bad), '; '.join('%s %s' % (k, w[0]) for k, w in list(bad.items())[:3])), flush=True)
        for v in batch:
            if v['id'] in got:
                have[v['id']] = entry(got[v['id']])
                kept += 1
            else:
                have.pop(v['id'], None); failed += 1
        store(have)
        print('%s: %d kept, %d without a reading' % (batch[-1]['id'], kept, failed), flush=True)


if __name__ == '__main__':
    main()
