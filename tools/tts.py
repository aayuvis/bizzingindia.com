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

WORKERS = 8          # lower it for premium voices; see the note by the pool

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'app', 'voice')
LEXICON = os.path.join(ROOT, 'tools', 'pron-lexicon.json')
SSML_LANGS = ('en-US',)          # languages that get the pronunciation lexicon
VOICE = {
  'en-US': ('en-US-Neural2-F', 0.95),   # matches Bizzing Bee's word voice exactly
  'hi-IN': ('hi-IN-Neural2-A', 0.88),   # slower: children imitate these
  'pa-IN': ('pa-IN-Standard-A', 0.88),
  # The seven packs of 2026-08. Wavenet-A everywhere Wavenet exists (probed via the
  # voices API); Telugu has Standard only. Same slow rate: children imitate these too,
  # and docs/09 §9 stands — every one is a placeholder for a human voice before launch.
  'bn-IN': ('bn-IN-Wavenet-A', 0.88),
  'mr-IN': ('mr-IN-Wavenet-A', 0.88),
  'te-IN': ('te-IN-Standard-A', 0.88),
  'ta-IN': ('ta-IN-Wavenet-A', 0.88),
  'gu-IN': ('gu-IN-Wavenet-A', 0.88),
  'kn-IN': ('kn-IN-Wavenet-A', 0.88),
  'ur-IN': ('ur-IN-Wavenet-A', 0.88),
}

# The Bhasha packs are TAUGHT, not narrated: a Hindi word goes to a Hindi voice
# as its own Devanagari, never to the English narrator as a transliteration.
# Keyed by the CLIP KEY'S NAMESPACE ('hi/l-13' -> hi), not by the pack that asked:
# the Marathi pack shares Devanagari and its letter items deliberately point at the
# existing 'hi/…' recordings — the same letters, already voiced. Keying by pack
# would re-record Hindi's letter files in a Marathi voice, silently, for everyone.
PACK_LANG = {'hi': 'hi-IN', 'pa': 'pa-IN', 'bn': 'bn-IN', 'mr': 'mr-IN',
             'te': 'te-IN', 'ta': 'ta-IN', 'gu': 'gu-IN', 'kn': 'kn-IN', 'ur': 'ur-IN'}

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
/* sibling pack files register through IND_BHASHA_KIT, exactly as the browser
   loads them — bhasha.js first, then every data-bhasha-*.js in name order */
var fs = require('fs'), path = require('path');
var dir = path.dirname(process.argv[1]);
fs.readdirSync(dir).filter(function (f) { return /^data-bhasha-.*\\.js$/.test(f); })
  .sort().forEach(function (f) { require(path.join(dir, f)); });
var out = [];
Object.keys(window.IND_PACKS).forEach(function (id) {
  /* A MATRA HAS NO SOUND ON ITS OWN. It is a combining mark: the synthesiser gets a
     bare U+093E and returns a quarter-second of breath, which is what a child was
     hearing where the vowel sign should have been. It is also, separately, wrong to
     teach -- an abugida's vowel sign is only ever pronounced sitting on a consonant.
     So a matra clip says its EXAMPLE syllable, which is also exactly the glyph the
     teach card puts on screen for it. The clip KEY does not change. */
  var scr = window.IND_BHASHA.script(id) || {};
  var ex = {};
  (scr.matras || []).forEach(function (m) { if (m.audio && m.example) ex[m.audio] = m.example; });
  window.IND_BHASHA.srsItems(id).forEach(function (it) {
    if (!it.audio || !it.char) return;
    var say = (it.kind === 'matra' && ex[it.audio]) ? ex[it.audio] : it.char;
    out.push({ pack: id, key: it.audio, text: say, kind: it.kind, glyph: it.char });
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
        # namespace of the key, not the asking pack — see the PACK_LANG comment
        ns = it['key'].split('/', 1)[0]
        lang = PACK_LANG.get(ns)
        if not lang:
            raise SystemExit('clip namespace %r (pack %r) has no language in PACK_LANG'
                             % (ns, it['pack']))
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

# A per-run narrator override: --voice NAME [--rate R]. The story narrator moved
# from an American voice to an Indian-English one because Indian names in an
# American mouth is exactly the thing this app exists not to do; the lexicon's
# IPA still rides along, so the names stay right whoever reads them.
VOICE_OVERRIDE = {}
# languageCode sent to the API per clip-language; only an override changes it.
LOCALE_OF = {}


def _post(inp, lang):
    name, rate = VOICE_OVERRIDE.get(lang) or VOICE[lang]
    lang = LOCALE_OF.get(lang, lang)
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


# Room for the last syllable to finish. A listener described the end of a
# sentence as "trailing off in volume", and the most likely cause is the clip
# ending on the tail of the final word rather than after it — the encoder stops,
# the decay is cut, and a cut decay is exactly what a fade sounds like.
#
# Honest about the limit: if what is actually being heard is natural
# declination — every language drops pitch and energy into a full stop, and TTS
# models that faithfully — then this does not fix it, because a trailing pause
# cannot raise the volume of what came before. It fixes truncation, which is the
# part that IS a defect. Existing clips are left alone; this applies to whatever
# is generated next.
TAIL_MS = 350


def _supports_ssml(lang):
    """Chirp3-HD is text-only — sending it SSML is a 400, not a nicety."""
    name = (VOICE_OVERRIDE.get(lang) or VOICE.get(lang) or ('',))[0]
    return 'Chirp' not in name


def synthesize(text, lang):
    if lang in SSML_LANGS:
        return _post({'ssml': to_ssml(text)}, lang)
    if _supports_ssml(lang):
        return _post({'ssml': '<speak>%s<break time="%dms"/></speak>'
                              % (escape(text), TAIL_MS)}, lang)
    return _post({'text': text}, lang)


def synthesize_one(clip, force=False, lead_ms=0):
    """Record ONE clip to app/voice/<key>.mp3 and return its path.

    Exists for tools/repair-voice.py, which re-records the clips that came back
    silent. `lead_ms` puts a breath BEFORE the text as well as after it: a bare
    letter or a two-syllable function word is a fragment rather than an utterance,
    and giving the voice something to place it against is the one thing that
    differs between the first attempt and the second. Everything else -- the voice,
    the rate, the escaping, the write-whole-then-move -- is the ordinary path, so a
    repaired clip is indistinguishable from an original one.
    """
    path = os.path.join(OUT, clip['key'] + '.mp3')
    if os.path.exists(path) and not force:
        return path
    lang = clip['lang']
    if lead_ms and _supports_ssml(lang) and lang not in SSML_LANGS:
        audio = _post({'ssml': '<speak><break time="%dms"/>%s<break time="%dms"/></speak>'
                               % (lead_ms, escape(clip['text']), TAIL_MS)}, lang)
    else:
        audio = synthesize(clip['text'], lang)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + '.part'
    with open(tmp, 'wb') as f:
        f.write(audio)
    os.replace(tmp, path)
    return path


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
                '   English story narration is en-IN-Chirp3-HD-Laomedeia at rate 1.02 -- an\n'
                '   Indian narrator, which is the whole point; the old en-US voice read the\n'
                '   names as a foreigner would. SSML with <phoneme> tags out of\n'
                '   tools/pron-lexicon.json where the voice supports it. Hindi/Punjabi\n'
                '   letters and words are TTS placeholders - per docs/09 these MUST be\n'
                '   replaced with human voice before launch, because children imitate them. */\n')
        f.write('window.IND_VOICE = ' + json.dumps(sorted(keys), ensure_ascii=False) + ';\n')
    return len(keys)


def dialogue_clips(pack='hi'):
    """[{key, text, lang}] for every line of every authored dialogue.

    The Baat-cheet stage had ZERO audio — measured — so the one stage that is
    actually about talking to people was silent. These are the clips that fix it.

    Keys are derived exactly as bhasha.js pickReply and tools/gen-voice-script.js
    derive them, from the bank's own order:

        hi/d-07-p        the prompt (Nani, the vendor, the teacher)
        hi/d-07-r        the child's reply
        hi/d-07-x1..x3   the other options on screen

    A HUMAN take of the same line lands at hi/d-07-p-f.webm and the app prefers
    it (see humanClip in app.js), so these two pipelines coexist by design: this
    fills the silence now, tools/studio.js replaces it whenever someone records.
    """
    js = ('const W={};'
          'require("vm").runInNewContext('
          '  require("fs").readFileSync("app/data-bhasha-hi-dialogues.js","utf8"),{window:W});'
          'console.log(JSON.stringify((W.IND_BHASHA_DIALOGUES||{}).%s||[]));' % pack)
    raw = subprocess.run(['node', '-e', js], stdout=subprocess.PIPE,
                         check=True, cwd=ROOT).stdout
    dlg = json.loads(raw.decode('utf-8'))
    lang = PACK_LANG.get(pack)
    out = []
    for i, d in enumerate(dlg, 1):
        base = '%s/d-%02d' % (pack, i)
        out.append({'key': base + '-p', 'text': d['prompt'], 'lang': lang})
        out.append({'key': base + '-r', 'text': d['reply']['hi'], 'lang': lang})
        for j, x in enumerate(d.get('distractors', [])[:3], 1):
            out.append({'key': '%s-x%d' % (base, j), 'text': x['hi'], 'lang': lang})
    return out


def main(argv):
    force = '--force' in argv
    global WORKERS
    if '--workers' in argv:
        WORKERS = max(1, int(argv[argv.index('--workers') + 1]))
    # Positional args are the pack ids. Skip the VALUE after any flag that takes
    # one, or `--voice hi-IN-Chirp3-HD-Laomedeia --rate 0.88 --for hi-IN` puts
    # three junk entries into the pack filter and the selection only works by
    # luck (it did: 'hi' happened to be in the set alongside the noise).
    TAKES_VALUE = {'--voice', '--rate', '--for', '--workers'}
    args, skip = [], False
    for a in argv:
        if skip: skip = False; continue
        if a in TAKES_VALUE: skip = True; continue
        if not a.startswith('-'): args.append(a)

    # --voice en-IN-Chirp3-HD-Laomedeia [--rate 1.02] [--for en-US]
    # `--for` is the clip language being replaced; the voice's own locale is read
    # off its name, so an en-IN narrator can take over every en-US narration clip.
    if '--voice' in argv:
        vname = argv[argv.index('--voice') + 1]
        rate = float(argv[argv.index('--rate') + 1]) if '--rate' in argv else 0.95
        target = argv[argv.index('--for') + 1] if '--for' in argv else 'en-US'
        VOICE_OVERRIDE[target] = (vname, rate)
        LOCALE_OF[target] = '-'.join(vname.split('-')[:2])
        print('narrator override: %s speaks every %s clip at rate %s' % (vname, target, rate))

    if '--check-lexicon' in argv:
        check_lexicon(args or None)
        return

    if '--dialogues' in argv:
        clips = dialogue_clips(args[0] if args else 'hi')
        lang = clips[0]['lang'] if clips else '?'
        print('dialogues: %d clips %s(%s)' % (
            len(clips), lang, (VOICE_OVERRIDE.get(lang) or VOICE[lang])[0]))
    elif '--bhasha' in argv:
        # tts.py --bhasha [hi] [pa] [--words] — no clips.json; the packs are the list.
        clips = bhasha_clips(set(args) or None, {'word'} if '--words' in argv else None)
        by_lang = {}
        for c in clips:
            by_lang[c['lang']] = by_lang.get(c['lang'], 0) + 1
        # Report the EFFECTIVE voice. This printed VOICE[l][0] — the base table —
        # so a run with --voice announced the override on one line and then
        # claimed to be using Neural2 on the next. The synthesis was right; the
        # log was lying, which is worse than either.
        print('bhasha: %d clips %s' % (len(clips),
              ' '.join('%s=%d(%s)' % (l, n, (VOICE_OVERRIDE.get(l) or VOICE[l])[0])
                       for l, n in sorted(by_lang.items()))))
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
    # eight in flight is well inside the per-minute quota for the standard
    # voices, and the retry above covers a throttle.
    #
    # It is NOT inside the quota for Chirp3-HD, which is a premium tier with a
    # much smaller allowance: eight workers burned through it and 84 of 565
    # clips came back RESOURCE_EXHAUSTED. Those failures leave the PREVIOUS file
    # untouched on disk, so the run reported success-ish while quietly leaving a
    # corpus half in one voice and half in another — the worst possible outcome
    # and an invisible one. Hence --workers, and hence the loud summary below.
    if todo:
        with cf.ThreadPoolExecutor(max_workers=WORKERS) as pool:
            list(pool.map(one, todo))

    total = write_manifest()
    if fail:
        print('\n  !! %d clips FAILED and still hold their PREVIOUS audio on disk.\n'
              '     The corpus is now mixed. Re-run to repair — a plain re-run only\n'
              '     regenerates what is missing, so delete the failures first, or\n'
              '     re-run with --force and a lower --workers.' % fail)
    print('DONE new=%d cached=%d failed=%d total=%d manifest=%d'
          % (done, skip, fail, len(clips), total))


if __name__ == '__main__':
    main(sys.argv[1:])
