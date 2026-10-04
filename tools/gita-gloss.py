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

  TEXT_MODEL=<model> python3 tools/gita-gloss.py --audit
      a blind second check of every reading against its two translations by the text model; each
      one it rejects is redrafted (told why) and kept only if it passes the lint and the same check;
      what is still rejected is marked disputed and left off the page. Writes gloss-audit.json.

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


def call(body, temperature):
    """one request to the text model; the parsed JSON it returns, or None"""
    key, model = os.environ.get('GEMKEY'), os.environ.get('TEXT_MODEL')
    if not key or not model:
        sys.exit('GEMKEY and TEXT_MODEL must be set (source keys.env; TEXT_MODEL=<model>)')
    req = urllib.request.Request(
        'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent' % model,
        data=json.dumps({'contents': [{'parts': [{'text': body}]}],
                         'generationConfig': {'temperature': temperature, 'responseMimeType': 'application/json'}}).encode(),
        headers={'Content-Type': 'application/json', 'X-goog-api-key': key})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                d = json.load(r)
            return json.loads(d['candidates'][0]['content']['parts'][0]['text'])
        except Exception as e:  # network, quota, or a malformed answer: wait and ask again
            print('  retry (%s)' % str(e)[:120], flush=True)
            time.sleep(4 * (attempt + 1))
    return None


def ask(batch, notes=None):
    body = RULES + '\n\nThe verses:\n' + json.dumps(
        [dict({'id': v['id'], 'speaker': v['sp'], 'besant': v['en'], 'swarupananda': v['en2']},
              **({'an_earlier_reading_was_rejected_because': notes[v['id']]} if notes and v['id'] in notes else {})) for v in batch],
        ensure_ascii=False)
    out = call(body, 0.3) or []
    return {x['id']: x['kid'].strip() for x in out if isinstance(x, dict) and x.get('id') and x.get('kid')}


# THE BLIND SECOND CHECK (owner, 4 Oct 2026: "try gemini now"). Like the chant's second listener:
# a different model is shown a reading and the two translations — not who wrote the reading, not
# that anyone thinks it is good — and asked only whether it is faithful.
AUDIT = """You check short plain-English readings of Bhagavad Gita verses written for children aged 8 to 12.
For each verse you get two public-domain translations (Annie Besant 1922, Swami Swarupananda 1909) and
the reading. Judge ONLY whether the reading is faithful to the translations.

Mark it NOT ok if the reading does any of these:
  a) says something that neither translation says (an added idea, teaching, example or claim);
  b) leaves out or changes the verse's main point;
  c) gets who is speaking, or who is spoken to, wrong;
  d) is more vivid or harsher than the translations, or softens them into something they do not say;
  e) preaches or draws a lesson the verse does not draw.
Simplifying words, dropping minor epithets, or shortening a list of names to "great warriors" is fine.
Be strict about meaning and relaxed about wording.

Return only JSON: an array of {"id": "<id>", "ok": true|false, "why": "<one short sentence when not ok, else empty>"}."""


def audit(rows):
    body = AUDIT + '\n\nThe readings:\n' + json.dumps(
        [{'id': r['id'], 'besant': r['en'], 'swarupananda': r['en2'], 'reading': r['kid']} for r in rows], ensure_ascii=False)
    out = call(body, 0.0) or []
    return {x['id']: (bool(x.get('ok')), (x.get('why') or '').strip()) for x in out if isinstance(x, dict) and x.get('id')}


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


AUDIT_OUT = os.path.join(ROOT, 'tools', 'gita-src', 'gloss-audit.json')


def audited():
    """--audit: the blind check on every reading, then a redraft of each one it rejects — kept only if
    it passes the lint AND the same blind check. A reading still rejected after its redraft is
    marked `check: disputed`: build-gita.js leaves it off the page (no reading rather than a doubted
    one) and the reviewer sees why in gloss-audit.json."""
    from concurrent.futures import ThreadPoolExecutor
    have = json.load(open(OUT))
    by = {v['id']: v for v in verses()}
    rows = [dict(by[k], kid=e['kid']) for k, e in have.items() if k in by]
    batches = [rows[i:i + 25] for i in range(0, len(rows), 25)]
    verdict = {}
    with ThreadPoolExecutor(4) as ex:
        for got in ex.map(audit, batches): verdict.update(got)
    unchecked = [r['id'] for r in rows if r['id'] not in verdict]
    if unchecked:  # a batch that never came back is asked again, once, on its own
        for got in map(audit, [[dict(by[k], kid=have[k]['kid'])] for k in unchecked]): verdict.update(got)
    flagged = {k: w for k, (ok, w) in verdict.items() if not ok}
    print('blind check: %d readings, %d faithful, %d flagged, %d unanswered' % (len(rows), len(verdict) - len(flagged), len(flagged), len(rows) - len(verdict)), flush=True)
    log = {k: {'first': ('ok' if ok else 'flagged: ' + w)} for k, (ok, w) in verdict.items()}
    for k, e in have.items(): e['check'] = 'passed' if verdict.get(k, (False,))[0] else ('unanswered' if k not in verdict else 'flagged')
    # redraft the flagged ones, telling the drafter why the first was turned down
    todo = [by[k] for k in flagged]
    redrafts = {}
    with ThreadPoolExecutor(4) as ex:
        for got in ex.map(lambda b: ask(b, flagged), [todo[i:i + 15] for i in range(0, len(todo), 15)]): redrafts.update(got)
    bad = lint([{'id': k, 'kid': t, 'en': by[k]['en'], 'en2': by[k]['en2']} for k, t in redrafts.items() if k in by])
    clean = {k: t for k, t in redrafts.items() if k in by and k not in bad}
    second = {}
    rb = [[dict(by[k], kid=t) for k, t in list(clean.items())[i:i + 25]] for i in range(0, len(clean), 25)]
    with ThreadPoolExecutor(4) as ex:
        for got in ex.map(audit, rb): second.update(got)
    fixed = disputed = 0
    for k in flagged:
        if k in clean and second.get(k, (False,))[0]:
            have[k] = dict(entry(clean[k]), check='redrafted')
            log[k]['redraft'] = clean[k]; log[k]['second'] = 'ok'; fixed += 1
        else:
            have[k]['check'] = 'disputed'
            log[k]['second'] = ('lint: ' + '; '.join(bad[k])) if k in bad else ('flagged: ' + second[k][1]) if k in second else 'no faithful redraft came back'
            if k in clean: log[k]['redraft'] = clean[k]
            disputed += 1
    store(have)
    json.dump(dict(sorted(log.items(), key=lambda kv: [int(n) for n in kv[0].split('-')])), open(AUDIT_OUT, 'w'), ensure_ascii=False, indent=1)
    print('redrafted and passed: %d · still disputed (left off the page): %d' % (fixed, disputed))


def main():
    if '--import' in sys.argv:
        return imported(sys.argv[sys.argv.index('--import') + 1:])
    if '--audit' in sys.argv:
        return audited()
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
