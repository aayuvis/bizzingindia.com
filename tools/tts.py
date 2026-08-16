"""Bizzing India narration generator.

    python3 tools/tts.py clips.json [--force] [--print-ssml]
    python3 tools/tts.py --bhasha [pack ...] [--words] [--force] [--dry-run]
    python3 tools/tts.py --audit clips.json [big-words.txt [common-words.txt]]
    python3 tools/tts.py --check-lexicon [term ...]

clips.json is a list of {key, text, lang}. Audio lands at app/voice/<key>.mp3 and
app/voice-manifest.js is rewritten from whatever is actually on disk afterwards.

--bhasha builds that clip list from app/bhasha.js instead of a file: every letter,
matra and lexicon word each pack asks for, in the pack's own language. The word
list moves (74 -> 507 in one commit), so a checked-in clips.json for it would be
stale the day after it is written; asking the engine is the only list that cannot
drift. See bhasha_clips().

--audit runs every clip through the SSML builder and prints the word tokens that
came out UNWRAPPED and are not in an English wordlist. That is how the lexicon is
grown: exhaustively, from the corpus, rather than by remembering names.

--check-lexicon asks the live API whether a <phoneme> is actually honoured, by
putting the IPA on a decoy spelling; see check_lexicon for why the obvious test
does not work.

English clips go out as SSML, not plain text. The narrator is a US English voice
(the audience is the diaspora, so the English accent is right) but she anglicises
Indian names — "Hanuman" comes out HAN-yuh-man. So every term in
tools/pron-lexicon.json is wrapped in <phoneme alphabet="ipa"> on the way out,
which pins the pronunciation deterministically. Hindi and Punjabi clips are left
on the plain-text path: those voices are already native.

Two things to know about Google's <phoneme>:
  * an IPA symbol outside the voice's own language is NOT an error — the tag is
    silently dropped and the spelling is read instead. Every ipa in the lexicon
    was checked against the live API for exactly this.
  * text must be XML-escaped BEFORE the tags go in, or a story containing "&"
    produces invalid SSML and the whole request 400s.
"""
import json, os, base64, urllib.request, time, sys, re, threading, subprocess
import concurrent.futures as cf

# Read lazily, not at import: --print-ssml and the lexicon helpers are useful
# without a key, and importing this module should never require one.
def api_key():
    try:
        return os.environ['GKEY']
    except KeyError:
        raise SystemExit('GKEY is not set. Source the key file; never hardcode it.')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'app', 'voice')
LEXICON = os.path.join(ROOT, 'tools', 'pron-lexicon.json')
SSML_LANGS = ('en-US',)          # languages that get the pronunciation lexicon
VOICE = {
  'en-US': ('en-US-Neural2-F', 0.95),   # matches Bizzing Bee's word voice exactly
  'hi-IN': ('hi-IN-Neural2-A', 0.88),   # slower: children imitate these
  'pa-IN': ('pa-IN-Standard-A', 0.88),
}

# The Bhasha packs are TAUGHT, not narrated: a Hindi word goes to a Hindi voice
# as its own Devanagari, never to the English narrator as a transliteration.
# Keyed by pack id (bhasha.js `voice.ns`, which is also the voice/ subdirectory).
PACK_LANG = {'hi': 'hi-IN', 'pa': 'pa-IN'}

# ------------------------------------------------------- bhasha clips ------

BHASHA = os.path.join(ROOT, 'app', 'bhasha.js')

# bhasha.js is browser ES5 hanging off `window`, with no build step, so node can
# load it as-is once window exists. srsItems() is the one enumeration that
# already knows every audio key a pack can ask for — letters, matras and lexicon
# words — so reading it here means the recorded set and the app's set cannot
# disagree about what exists or how a key is spelled.
_DUMP_JS = """
global.window = global;
require(process.argv[1]);
var out = [];
Object.keys(window.IND_PACKS).forEach(function (id) {
  window.IND_BHASHA.srsItems(id).forEach(function (it) {
    if (it.audio && it.char) out.push({ pack: id, key: it.audio, text: it.char, kind: it.kind });
  });
});
process.stdout.write(JSON.stringify(out));
"""


def bhasha_clips(packs=None, kinds=None):
    """[{key, text, lang}] for every audio-bearing Bhasha item, from bhasha.js.

    `packs` limits to pack ids ({'hi'}), `kinds` to srsItems kinds
    ({'word'} for the lexicon only; the others are 'vowel', 'consonant',
    'matra'). Both None means everything the packs ask for.

    The text is the native glyph or word, byte-for-byte as the app holds it.
    That matters more than it looks: this lexicon writes nukta DECOMPOSED
    (क + U+093C), tile matching downstream compares strings exactly, and a
    well-meaning NFC pass anywhere in the pipeline silently breaks the match
    while leaving the audio fine. So nothing here normalises, and neither
    should anything that edits bhasha.js.
    """
    raw = subprocess.run(['node', '-e', _DUMP_JS, BHASHA],
                         stdout=subprocess.PIPE, check=True).stdout
    items = json.loads(raw.decode('utf-8'))
    out, seen = [], set()
    for it in items:
        if packs and it['pack'] not in packs:
            continue
        if kinds and it['kind'] not in kinds:
            continue
        lang = PACK_LANG.get(it['pack'])
        if not lang:
            raise SystemExit('pack %r has no language in PACK_LANG' % it['pack'])
        if it['key'] in seen:
            continue                       # one key, one clip, whoever asks for it
        seen.add(it['key'])
        out.append({'key': it['key'], 'text': it['text'], 'lang': lang})
    return out


# ---------------------------------------------------------------- SSML ------

def load_lexicon(path=LEXICON):
    """term (lowercased, whitespace-collapsed) -> ipa. `_`-prefixed keys are docs.

    An entry may carry "ipa": null. That is a deliberate "nobody here could
    transcribe this confidently — a native speaker has to" marker, not an
    omission: the term is dropped from the matcher entirely and falls through to
    the voice's own reading. A wrong <phoneme> is worse than none, because it
    sounds authoritative and nobody re-checks it."""
    raw = json.load(open(path, encoding='utf-8'))
    return {' '.join(k.split()).lower(): v['ipa']
            for k, v in raw.items()
            if not k.startswith('_') and v.get('ipa')}


def load_case_strict(path=LEXICON):
    """lowercased term -> the one spelling that may be pinned.

    Matching is case-insensitive, which is right for almost everything — a name
    is a name wherever it appears. It is wrong for a name that is also an
    ordinary English word in lower case: Rama's son Lava is LUV-a, but molten
    lava is not, and a geography card must not inherit the epic's vowel. Such an
    entry carries "case_sensitive": true and then only matches its own capitalised
    spelling; anything else falls through to the voice's own reading."""
    raw = json.load(open(path, encoding='utf-8'))
    return {' '.join(k.split()).lower(): ' '.join(k.split())
            for k, v in raw.items()
            if not k.startswith('_') and v.get('ipa') and v.get('case_sensitive')}


LEX = load_lexicon()
CASE_STRICT = load_case_strict()

# Longest term first so "Kisa Gotami" wins over "Gotami" and "Andhra Pradesh"
# over "Pradesh". Interior spaces match any run of whitespace.
_APOS = "(?:&#39;|&apos;|'|’)"
_TERMS = '|'.join(r'\s+'.join(re.escape(w) for w in t.split())
                  for t in sorted(LEX, key=lambda t: (-len(t), t)))
# The lookbehind also refuses & and # so a term can never be matched inside an
# XML entity such as &amp; once the text has been escaped.
TERM_RE = re.compile(r'(?<![&#A-Za-z0-9])(' + _TERMS + r')(' + _APOS + r's)?(?![A-Za-z0-9])',
                     re.IGNORECASE)

# Aspirated finals count as their plain selves here: Ladakh's ends in a voiceless
# k and takes an s, not a z. Listed explicitly because the check is endswith(),
# and 'kʰ' does not end with 'k'.
_SIBILANT = ('s', 'z', 'ʃ', 'ʒ', 'ʂ', 'tʃ', 'dʒ', 'tʃʰ', 'dʒʰ')
_VOICELESS = ('p', 't', 'k', 'f', 'θ', 'ʈ', 'pʰ', 'kʰ', 'ʈʰ', 't̪ʰ')


def escape(text):
    """XML-escape. Runs BEFORE any tag is inserted."""
    return (text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                .replace('"', '&quot;').replace("'", '&#39;'))


def possessive_suffix(ipa):
    """The 's of "Hanuman's" has to be spoken too, so it joins the phoneme."""
    core = ipa.rstrip('ː')
    if core.endswith(_SIBILANT):
        return 'ɪz'
    if core.endswith(_VOICELESS):
        return 's'
    return 'z'


def _wrap(m):
    hit = ' '.join(m.group(1).split())
    if CASE_STRICT.get(hit.lower(), hit) != hit:
        return m.group(0)                     # right spelling, wrong case: leave it alone
    ipa = LEX[hit.lower()]
    if m.group(2):
        ipa += possessive_suffix(ipa)
    # m.group(0) is the already-escaped source text: the spelling stays on screen
    # and in the fallback path, only the pronunciation is pinned.
    return '<phoneme alphabet="ipa" ph="%s">%s</phoneme>' % (escape(ipa), m.group(0))


def to_ssml(text):
    return '<speak>' + TERM_RE.sub(_wrap, escape(text)) + '</speak>'


# --------------------------------------------------------------- audit ------

_PHONEME_RE = re.compile(r'<phoneme[^>]*>.*?</phoneme>', re.DOTALL)
_WORD_RE = re.compile(r"[A-Za-z][A-Za-z'’-]*")
_ENTITY_RE = re.compile(r'&(?:amp|lt|gt|quot|apos|#39);')


def unwrapped_words(text):
    """Word tokens of `text` that to_ssml() left outside a <phoneme> tag.

    Deletes the wrapped spans first, so anything the lexicon already covers is
    invisible here and only genuinely unpinned words survive."""
    left = _PHONEME_RE.sub(' ', to_ssml(text))
    left = _ENTITY_RE.sub(' ', left)
    left = re.sub(r'<[^>]*>', ' ', left)
    out = []
    for tok in _WORD_RE.findall(left):
        # split hyphenated compounds: "leaf-plate" is two English words, and a
        # name only ever needs pinning one part at a time.
        for w in tok.split('-'):
            w = w.strip("'’")
            low = w.lower()
            for suf in ("'s", "’s"):
                if low.endswith(suf):
                    w, low = w[:-2], low[:-2]
            if low:
                out.append((w, low))
    return out


def load_wordlist(path):
    if not path or not os.path.exists(path):
        return set()
    with open(path, encoding='utf-8', errors='ignore') as f:
        return {w.strip().lower() for w in f if w.strip()}


def audit(clips, words_path=None, common_path=None):
    """Frequency-ranked report of clip words the lexicon does not pin and an
       English wordlist does not know. Everything in it is a candidate entry.

    TWO wordlists, and the reason matters. A big scrabble-grade English list is
    useless on its own here: it contains duryodhana, drona, dhritarashtra,
    nakula and sahadeva as headwords, which is precisely the class of word this
    audit exists to catch, so filtering capitalised tokens through it hides the
    epics' entire cast. So a Capitalised token is only forgiven if it is in the
    small common-English list (a name at the start of a sentence), while an
    all-lowercase token may use the big list too."""
    english = load_wordlist(words_path)
    common = load_wordlist(common_path) or english
    # Only whole lexicon terms count as known. A word that is one half of a
    # multi-word entry is still unpinned when it turns up on its own, and that
    # is exactly the kind of gap worth hearing about.
    known = set(LEX)
    # ipa:null entries are deliberate — surface them separately, never as TODOs.
    raw = json.load(open(LEXICON, encoding='utf-8'))
    flagged = {k.lower() for k, v in raw.items()
               if not k.startswith('_') and not v.get('ipa')}
    counts, first_seen, forms = {}, {}, {}
    for c in clips:
        if c.get('lang', 'en-US') not in SSML_LANGS:
            continue
        for w, low in unwrapped_words(c['text']):
            if low in known or low in flagged or len(low) < 3:
                continue
            if low in (common if w[0].isupper() else english):
                continue
            counts[low] = counts.get(low, 0) + 1
            forms.setdefault(low, w)
            first_seen.setdefault(low, c['key'])
    order = sorted(counts, key=lambda w: (-counts[w], w))
    for w in order:
        print('%5d  %-26s %s' % (counts[w], forms[w], first_seen[w]))
    print('\n%d distinct unpinned terms, %d occurrences'
          % (len(order), sum(counts.values())))
    return order


# ------------------------------------------------------- lexicon check ------

# A spelling no phoneme string will ever be read as, used as the control below.
_DECOY = 'Zqwlfrixthorb'


def check_lexicon(terms=None, verbose=True):
    """Does the API actually honour each <phoneme>, or silently drop it?

    Comparing the bare term against the tagged term does NOT answer that. Both
    "the tag was dropped" and "the IPA happens to agree with the spelling
    reading" give byte-identical audio, and the second is a perfectly good entry.
    Drona is the example: DROH-na either way.

    So the tag is put on a decoy spelling instead. If the IPA is honoured the
    clip says the IPA; if it is rejected the clip says "Zqwlfrixthorb". Those can
    never be the same audio, so a byte match against the untagged decoy is proof
    the tag was thrown away — which is the only real defect.

    The term-vs-tagged comparison is still run and reported, but only as
    information: "accepted, and changes nothing" is a fine outcome and means the
    voice was already saying it right."""
    raw = json.load(open(LEXICON, encoding='utf-8'))
    todo = [(k, v['ipa']) for k, v in raw.items()
            if not k.startswith('_') and v.get('ipa')
            and (not terms or k.lower() in {t.lower() for t in terms})]
    control = _say_ssml('<speak>%s</speak>' % _DECOY)
    bad, noop = [], []
    for i, (term, ipa) in enumerate(todo):
        tag = '<phoneme alphabet="ipa" ph="%s">%%s</phoneme>' % escape(ipa)
        try:
            decoy = _say_ssml('<speak>%s</speak>' % (tag % _DECOY))
            plain = _say_ssml('<speak>%s</speak>' % escape(term))
            tagged = _say_ssml('<speak>%s</speak>' % (tag % escape(term)))
        except Exception as e:
            print('ERROR', term, str(e)[:100], flush=True)
            bad.append((term, ipa, 'request failed'))
            continue
        if decoy == control or abs(len(decoy) - len(control)) < 8:
            print('REJECTED %-24s %s' % (term, ipa), flush=True)
            bad.append((term, ipa, 'tag dropped - unsupported symbol'))
        elif plain == tagged or abs(len(plain) - len(tagged)) < 8:
            noop.append(term)
            if verbose:
                print('  no-op  %-24s %s  (voice already said it this way)'
                      % (term, ipa), flush=True)
        if (i + 1) % 25 == 0:
            print('  ...', i + 1, '/', len(todo), flush=True)
    print('checked %d: %d rejected, %d accepted-but-no-op, %d accepted-and-changed'
          % (len(todo), len(bad), len(noop), len(todo) - len(bad) - len(noop)))
    return bad


# ---------------------------------------------------------------- main ------

def _post(inp, lang):
    name, rate = VOICE[lang]
    body = json.dumps({
        'input': inp,
        'voice': {'languageCode': lang, 'name': name},
        'audioConfig': {'audioEncoding': 'MP3', 'speakingRate': rate, 'sampleRateHertz': 24000}
    }).encode()
    req = urllib.request.Request(
        'https://texttospeech.googleapis.com/v1/text:synthesize?key=' + api_key(),
        data=body, headers={'Content-Type': 'application/json'})
    r = json.load(urllib.request.urlopen(req, timeout=60))
    return base64.b64decode(r['audioContent'])


def synthesize(text, lang):
    return _post({'ssml': to_ssml(text)} if lang in SSML_LANGS else {'text': text}, lang)


def _say_ssml(ssml, lang='en-US'):
    """Synthesise a literal SSML string — used by the lexicon checker only."""
    return _post({'ssml': ssml}, lang)


def write_manifest():
    """Index every clip that actually exists, not just the ones this run touched —
       otherwise an English-only run would drop hi/ and pa/ out of the manifest and
       silence them in the app."""
    keys = []
    for dirpath, _, files in os.walk(OUT):
        for f in files:
            if f.endswith('.mp3'):
                rel = os.path.relpath(os.path.join(dirpath, f), OUT)
                keys.append(rel[:-4].replace(os.sep, '/'))
    with open(os.path.join(OUT, '..', 'voice-manifest.js'), 'w') as f:
        f.write('/* Bizzing India - bundled narration index. Generated by tools/tts.py.\n'
                '   English story narration: en-US-Neural2-F, synthesised from SSML with\n'
                '   <phoneme> tags out of tools/pron-lexicon.json so Indian names are said\n'
                '   properly. Hindi/Punjabi letters and words are TTS placeholders - per\n'
                '   docs/09 these MUST be replaced with human voice before launch, because\n'
                '   children imitate them. */\n')
        f.write('window.IND_VOICE = ' + json.dumps(sorted(keys), ensure_ascii=False) + ';\n')
    return len(keys)


def main(argv):
    force = '--force' in argv
    args = [a for a in argv if not a.startswith('-')]

    if '--check-lexicon' in argv:
        check_lexicon(args or None)
        return

    if '--bhasha' in argv:
        # tts.py --bhasha [hi] [pa] [--words] — no clips.json; the packs are the list.
        clips = bhasha_clips(set(args) or None, {'word'} if '--words' in argv else None)
        by_lang = {}
        for c in clips:
            by_lang[c['lang']] = by_lang.get(c['lang'], 0) + 1
        print('bhasha: %d clips %s' % (len(clips),
              ' '.join('%s=%d(%s)' % (l, n, VOICE[l][0]) for l, n in sorted(by_lang.items()))))
    else:
        clips = json.load(open(args[0]))

    if '--audit' in argv:
        # tts.py --audit clips.json [big-wordlist.txt [common-wordlist.txt]]
        audit(clips, *args[1:3])
        return

    if '--print-ssml' in argv:
        for c in clips:
            print(c['key'])
            print(to_ssml(c['text']) if c['lang'] in SSML_LANGS else c['text'])
            print()
        return

    todo = []
    skip = 0
    for c in clips:
        path = os.path.join(OUT, c['key'] + '.mp3')
        os.makedirs(os.path.dirname(path), exist_ok=True)
        # >500 bytes, not >0: a truncated or zero-byte file from a killed run is
        # not a cached clip, and must be asked for again.
        if not force and os.path.exists(path) and os.path.getsize(path) > 500:
            skip += 1
        else:
            todo.append((c, path))

    if '--dry-run' in argv:
        # What would be asked for, and how much speech it is, without spending a
        # request or touching the manifest.
        chars = sum(len(c['text']) for c, _ in todo)
        print('DRY-RUN would synthesise %d, cached %d, %d chars' % (len(todo), skip, chars))
        for c, _ in todo[:10]:
            print('   %-28s %s  %s' % (c['key'], c['lang'], c['text']))
        return

    done = fail = 0
    lock = threading.Lock()

    def one(job):
        nonlocal done, fail
        c, path = job
        for attempt in range(4):
            try:
                audio = synthesize(c['text'], c['lang'])
                # Write whole, then move into place: a clip is either absent or
                # complete, never a half file that the next run mistakes for cached.
                tmp = path + '.part'
                with open(tmp, 'wb') as f:
                    f.write(audio)
                os.replace(tmp, path)
                with lock:
                    done += 1
                    if (done + skip) % 50 == 0:
                        print('  ...', done + skip, '/', len(clips), flush=True)
                return
            except Exception as e:
                if attempt < 3:
                    time.sleep(2 ** attempt)
                    continue
                try:
                    detail = e.read().decode()[:120]
                except Exception:
                    detail = str(e)[:120]
                with lock:
                    fail += 1
                    print('FAIL', c['key'], detail, flush=True)

    # Modest fan-out. The epics alone are 800 clips and serial that is an hour;
    # eight in flight is well inside the per-minute quota and the retry above
    # still covers a throttle.
    if todo:
        with cf.ThreadPoolExecutor(max_workers=8) as pool:
            list(pool.map(one, todo))

    total = write_manifest()
    print('DONE new=%d cached=%d failed=%d total=%d manifest=%d'
          % (done, skip, fail, len(clips), total))


if __name__ == '__main__':
    main(sys.argv[1:])
