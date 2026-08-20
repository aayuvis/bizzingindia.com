"use strict";
/* =====================================================================
   Bizzing India — the Bhasha language engine.

   Architecture is docs/09-language-engine.md, and the one rule that
   matters is:

       SCRIPT MODULE  !=  LANGUAGE PACK

   A *script module* knows about glyphs: vowels, consonants, matras,
   numerals, conjuncts, the font to set them in. One script module serves
   several languages (Devanagari carries Hindi, Marathi, Nepali,
   Konkani, Sanskrit).

   A *language pack* knows about a language: its name, which script it
   is written in, its lexicon and its stage ladder.

   The engine below never names a language. Every exercise generator is
   script-parametric, so adding Punjabi was a data change — a second
   script module plus a second pack — and not an engine change. Both
   ship here as the proof.

   No build step. No modules. Plain ES5, loaded with <script src>, and
   everything hangs off window:

       window.IND_SCRIPTS   script modules by id
       window.IND_PACKS     language packs by id
       window.IND_BHASHA    the engine (exercise generators)
       window.IND_SRS       Leitner spaced repetition

   Audio is referenced BY KEY only — 'hi/ka' means voice/hi/ka.mp3. This
   file never touches the network and never resolves a path itself.

   Typing-free by design (docs/09 §5): an Indic IME on a shared family
   tablet is where a 7-year-old quits. Every generator returns tap/drag
   questions.
   ===================================================================== */

(function (W) {

/* =========================================================== helpers ===== */

/* Seeded RNG (mulberry32) so a question is reproducible from its seed —
   the parent report and the printable worksheet must be able to re-render
   exactly what the child saw. */
function hashSeed(seed) {
  if (typeof seed === 'number') return seed >>> 0;
  var s = String(seed === undefined || seed === null ? 'bhasha' : seed), h = 2166136261, i;
  for (i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
  return h >>> 0;
}
function rngFrom(seed) {
  var a = hashSeed(seed);
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function rint(rng, n) { return Math.floor(rng() * n) % (n || 1); }
function pick(rng, arr) { return arr[rint(rng, arr.length)]; }
function shuffle(rng, arr) {
  var a = arr.slice(), i, j, t;
  for (i = a.length - 1; i > 0; i--) { j = rint(rng, i + 1); t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
/* n distinct members of pool, skipping anything `skip(x)` rejects */
function sample(rng, pool, n, skip) {
  var bag = shuffle(rng, pool), out = [], i;
  for (i = 0; i < bag.length && out.length < n; i++) {
    if (skip && skip(bag[i])) continue;
    out.push(bag[i]);
  }
  return out;
}
function indexOf(arr, v) { var i; for (i = 0; i < arr.length; i++) { if (arr[i] === v) return i; } return -1; }

/* ---- Indic grapheme clustering -----------------------------------------
   Splitting a word into the things a child perceives as "letters" is the
   one piece of text handling every script needs, so it is written once,
   generically. The Indic Unicode blocks (0900–0DFF) are 128 apart and all
   share the same relative layout, so the test is block-relative rather
   than per-script — that is what keeps Gujarati/Telugu a data change.

       +01..+03  candrabindu / anusvara / visarga
       +3C       nukta
       +3E..+4F  vowel signs (matras) and the virama at +4D
       +51..+57  vedic / tone accents
       +62..+63  vocalic L / LL signs
   ------------------------------------------------------------------------ */
function isCombiningMark(cp) {
  if (cp >= 0x0900 && cp <= 0x0DFF) {
    var o = cp & 0x7F;
    if (o >= 0x01 && o <= 0x03) return true;
    if (o === 0x3C) return true;
    if (o >= 0x3E && o <= 0x4F) return true;   /* 0x3D is avagraha, a letter */
    if (o >= 0x51 && o <= 0x57) return true;
    if (o >= 0x62 && o <= 0x63) return true;
  }
  /* Gurmukhi carries three signs outside the shared layout */
  if (cp === 0x0A70 || cp === 0x0A71 || cp === 0x0A75) return true; /* tippi, addak, yakash */
  /* Arabic script, for the Urdu pack. Urdu is the one pack whose script is
     not an Indic abugida, but the clustering question is the same: the
     harakat (zabar, zer, pesh), tashdeed, jazm and the superscript alef
     ride the letter before them and must stay on its tile. */
  if (cp >= 0x0610 && cp <= 0x061A) return true;
  if (cp >= 0x064B && cp <= 0x065F) return true;
  if (cp === 0x0670) return true;
  if (cp >= 0x06D6 && cp <= 0x06DC) return true;
  if (cp >= 0x06DF && cp <= 0x06E8) return true;
  if (cp >= 0x06EA && cp <= 0x06ED) return true;
  return false;
}
function isVirama(cp) { return cp >= 0x0900 && cp <= 0x0DFF && (cp & 0x7F) === 0x4D; }

/* "पानी" -> ["पा","नी"] ; "ਪੜ੍ਹਨਾ" -> ["ਪ","ੜ੍ਹ","ਨਾ"] ; conjuncts stay
   one tile, which is exactly how they should be handled in word-build. */
function clusters(str) {
  var out = [], cur = '', joinNext = false, i, ch, cp;
  for (i = 0; i < str.length; i++) {
    ch = str.charAt(i); cp = str.charCodeAt(i);
    if (ch === ' ') { if (cur) out.push(cur); cur = ''; out.push(' '); joinNext = false; continue; }
    if (cur === '') { cur = ch; joinNext = isVirama(cp); continue; }
    if (joinNext || isCombiningMark(cp)) { cur += ch; joinNext = isVirama(cp); continue; }
    out.push(cur); cur = ch; joinNext = false;
  }
  if (cur) out.push(cur);
  return out;
}

/* =================================================== SCRIPT MODULES ====== */
/* Every character below is a verified codepoint. Nothing is transcribed by
   eye — see the codepoint assertions in the smoke test. */

/* ---------------------------------------------------- DEVANAGARI -------- */
/* U+0900–U+097F. Serves Hindi, Marathi, Nepali, Konkani, Sanskrit.
   Audio keys are namespaced 'hi/…' because Hindi is the pack that records
   the letter voice first; a Marathi pack re-namespaces via
   IND_BHASHA.audioFor(). */

var DEVANAGARI = {
  id: 'devanagari',
  name: 'Devanagari',
  nativeName: 'देवनागरी',
  direction: 'ltr',
  headline: true,                 /* shirorekha — the unbroken top bar */
  inherent: 'a',                  /* the vowel a bare consonant already carries */
  virama: '्',               /* ्  halant */
  audioNs: 'hi',
  languages: ['hi', 'mr', 'ne', 'kok', 'sa'],
  font: { family: 'Noto Sans Devanagari', fallback: 'Mukta', minSize: 17, lineHeight: 1.75, scale: 1.12 },
  notes: 'Devanagari is set correctly or not at all: real face, unbroken shirorekha, never letter-spaced.',

  /* 13 svar. अं and अः are the anusvara/visarga forms taught with the
     vowels in every Hindi varnamala chart, written as अ + the sign. */
  vowels: [
    { char: 'अ',         name: 'a',  roman: 'a',  audio: 'hi/l-0',  group: 'svar', short: true },
    { char: 'आ',         name: 'aa', roman: 'ā',  audio: 'hi/l-1', group: 'svar', short: false, pairOf: 'a' },
    { char: 'इ',         name: 'i',  roman: 'i',  audio: 'hi/l-2',  group: 'svar', short: true },
    { char: 'ई',         name: 'ii', roman: 'ī',  audio: 'hi/l-3', group: 'svar', short: false, pairOf: 'i' },
    { char: 'उ',         name: 'u',  roman: 'u',  audio: 'hi/l-4',  group: 'svar', short: true },
    { char: 'ऊ',         name: 'uu', roman: 'ū',  audio: 'hi/l-5', group: 'svar', short: false, pairOf: 'u' },
    { char: 'ऋ',         name: 'ri', roman: 'ṛ',  audio: 'hi/l-6', group: 'svar', short: true },
    { char: 'ए',         name: 'e',  roman: 'e',  audio: 'hi/l-7',  group: 'svar', short: false },
    { char: 'ऐ',         name: 'ai', roman: 'ai', audio: 'hi/l-8', group: 'svar', short: false },
    { char: 'ओ',         name: 'o',  roman: 'o',  audio: 'hi/l-9',  group: 'svar', short: false },
    { char: 'औ',         name: 'au', roman: 'au', audio: 'hi/l-10', group: 'svar', short: false },
    { char: 'अं',   name: 'am', roman: 'aṁ', audio: 'hi/l-11', group: 'svar', sign: true },
    { char: 'अः',   name: 'ah', roman: 'aḥ', audio: 'hi/l-12', group: 'svar', sign: true }
  ],

  /* 33 vyanjan, क through ह, in varga order. The last group holds the three
     sibilants plus ह; ह is glottal rather than sibilant, kept in one group
     because that is how the varnamala chart a child is handed is laid out. */
  consonants: [
    { char: 'क', name: 'ka',   r: 'k',   audio: 'hi/l-13',   group: 'velar' },
    { char: 'ख', name: 'kha',  r: 'kh',  audio: 'hi/l-14',  group: 'velar' },
    { char: 'ग', name: 'ga',   r: 'g',   audio: 'hi/l-15',   group: 'velar' },
    { char: 'घ', name: 'gha',  r: 'gh',  audio: 'hi/l-16',  group: 'velar' },
    { char: 'ङ', name: 'nga',  r: 'ṅ',   audio: 'hi/l-17',  group: 'velar' },
    { char: 'च', name: 'cha',  r: 'c',   audio: 'hi/l-18',  group: 'palatal' },
    { char: 'छ', name: 'chha', r: 'ch',  audio: 'hi/l-19', group: 'palatal' },
    { char: 'ज', name: 'ja',   r: 'j',   audio: 'hi/l-20',   group: 'palatal' },
    { char: 'झ', name: 'jha',  r: 'jh',  audio: 'hi/l-21',  group: 'palatal' },
    { char: 'ञ', name: 'nya',  r: 'ñ',   audio: 'hi/l-22',  group: 'palatal' },
    { char: 'ट', name: 'tta',  r: 'ṭ',   audio: 'hi/l-23',  group: 'retroflex' },
    { char: 'ठ', name: 'ttha', r: 'ṭh',  audio: 'hi/l-24', group: 'retroflex' },
    { char: 'ड', name: 'dda',  r: 'ḍ',   audio: 'hi/l-25',  group: 'retroflex' },
    { char: 'ढ', name: 'ddha', r: 'ḍh',  audio: 'hi/l-26', group: 'retroflex' },
    { char: 'ण', name: 'nna',  r: 'ṇ',   audio: 'hi/l-27',  group: 'retroflex' },
    { char: 'त', name: 'ta',   r: 't',   audio: 'hi/l-28',   group: 'dental' },
    { char: 'थ', name: 'tha',  r: 'th',  audio: 'hi/l-29',  group: 'dental' },
    { char: 'द', name: 'da',   r: 'd',   audio: 'hi/l-30',   group: 'dental' },
    { char: 'ध', name: 'dha',  r: 'dh',  audio: 'hi/l-31',  group: 'dental' },
    { char: 'न', name: 'na',   r: 'n',   audio: 'hi/l-32',   group: 'dental' },
    { char: 'प', name: 'pa',   r: 'p',   audio: 'hi/l-33',   group: 'labial' },
    { char: 'फ', name: 'pha',  r: 'ph',  audio: 'hi/l-34',  group: 'labial' },
    { char: 'ब', name: 'ba',   r: 'b',   audio: 'hi/l-35',   group: 'labial' },
    { char: 'भ', name: 'bha',  r: 'bh',  audio: 'hi/l-36',  group: 'labial' },
    { char: 'म', name: 'ma',   r: 'm',   audio: 'hi/l-37',   group: 'labial' },
    { char: 'य', name: 'ya',   r: 'y',   audio: 'hi/l-38',   group: 'semivowel' },
    { char: 'र', name: 'ra',   r: 'r',   audio: 'hi/l-39',   group: 'semivowel' },
    { char: 'ल', name: 'la',   r: 'l',   audio: 'hi/l-40',   group: 'semivowel' },
    { char: 'व', name: 'va',   r: 'v',   audio: 'hi/l-41',   group: 'semivowel' },
    { char: 'श', name: 'sha',  r: 'ś',   audio: 'hi/l-42',  group: 'sibilant' },
    { char: 'ष', name: 'shha', r: 'ṣ',   audio: 'hi/l-43', group: 'sibilant' },
    { char: 'स', name: 'sa',   r: 's',   audio: 'hi/l-44',   group: 'sibilant' },
    { char: 'ह', name: 'ha',   r: 'h',   audio: 'hi/l-45',   group: 'sibilant' }
  ],

  /* 12 matras. `position` is where the sign lands relative to the base and
     drives the drag target in matraAttach. ि is the famous one: it is typed
     and stored AFTER the consonant but renders BEFORE it. `grid` marks the
     11 that make up the 12-column barakhadi (क का कि की कु कू के कै को कौ कं कः);
     ृ is taught but is not a barakhadi column. */
  matras: [
    { sign: 'ा', name: 'aa',      vowel: 'aa', vowelChar: 'आ', position: 'right', example: 'का', audio: 'hi/m-aa', grid: true },
    { sign: 'ि', name: 'i',       vowel: 'i',  vowelChar: 'इ', position: 'left',  example: 'कि', audio: 'hi/m-i',  grid: true },
    { sign: 'ी', name: 'ii',      vowel: 'ii', vowelChar: 'ई', position: 'right', example: 'की', audio: 'hi/m-ii', grid: true },
    { sign: 'ु', name: 'u',       vowel: 'u',  vowelChar: 'उ', position: 'below', example: 'कु', audio: 'hi/m-u',  grid: true },
    { sign: 'ू', name: 'uu',      vowel: 'uu', vowelChar: 'ऊ', position: 'below', example: 'कू', audio: 'hi/m-uu', grid: true },
    { sign: 'ृ', name: 'ri',      vowel: 'ri', vowelChar: 'ऋ', position: 'below', example: 'कृ', audio: 'hi/m-ri', grid: false },
    { sign: 'े', name: 'e',       vowel: 'e',  vowelChar: 'ए', position: 'above', example: 'के', audio: 'hi/m-e',  grid: true },
    { sign: 'ै', name: 'ai',      vowel: 'ai', vowelChar: 'ऐ', position: 'above', example: 'कै', audio: 'hi/m-ai', grid: true },
    { sign: 'ो', name: 'o',       vowel: 'o',  vowelChar: 'ओ', position: 'right', example: 'को', audio: 'hi/m-o',  grid: true },
    { sign: 'ौ', name: 'au',      vowel: 'au', vowelChar: 'औ', position: 'right', example: 'कौ', audio: 'hi/m-au', grid: true },
    { sign: 'ं', name: 'anusvar', vowel: 'am', vowelChar: 'अं', position: 'above', example: 'कं', audio: 'hi/m-am', grid: true },
    { sign: 'ः', name: 'visarg',  vowel: 'ah', vowelChar: 'अः', position: 'right', example: 'कः', audio: 'hi/m-ah', grid: true }
  ],

  numerals: [
    { char: '०', value: 0, name: 'shunya', audio: 'hi/n0' },
    { char: '१', value: 1, name: 'ek',     audio: 'hi/n1' },
    { char: '२', value: 2, name: 'do',     audio: 'hi/n2' },
    { char: '३', value: 3, name: 'teen',   audio: 'hi/n3' },
    { char: '४', value: 4, name: 'chaar',  audio: 'hi/n4' },
    { char: '५', value: 5, name: 'paanch', audio: 'hi/n5' },
    { char: '६', value: 6, name: 'chhah',  audio: 'hi/n6' },
    { char: '७', value: 7, name: 'saat',   audio: 'hi/n7' },
    { char: '८', value: 8, name: 'aath',   audio: 'hi/n8' },
    { char: '९', value: 9, name: 'nau',    audio: 'hi/n9' }
  ],

  /* Nukta letters: not part of the 33, but a child meets them in ज़रा,
     दरवाज़ा, सफ़ेद. Each is base + U+093C. */
  nuktaLetters: [
    { char: 'क़', name: 'qa',  base: 'क', audio: 'hi/qa' },
    { char: 'ख़', name: 'khha', base: 'ख', audio: 'hi/khha' },
    { char: 'ग़', name: 'ghha', base: 'ग', audio: 'hi/ghha' },
    { char: 'ज़', name: 'za',  base: 'ज', audio: 'hi/za' },
    { char: 'ड़', name: 'dda-nukta', base: 'ड', audio: 'hi/rra' },
    { char: 'ढ़', name: 'ddha-nukta', base: 'ढ', audio: 'hi/rrha' },
    { char: 'फ़', name: 'fa',  base: 'फ', audio: 'hi/fa' }
  ],

  /* The conjuncts that must be taught explicitly because their shape does
     not read off their parts. Split on the virama in conjunctSplit().

     The first ten are the spine — the ones every Hindi primer opens with.
     The rest are what a reader actually trips over in the first year: the
     doubled letters inside words a child already says (बच्चा, चप्पल,
     छुट्टी), the स्- cluster that starts स्कूल and नमस्ते, and the reph —
     र् riding on top of the letter that follows it, in धर्म, दर्द, पार्क.
     A child who can see the reph can read half the words that stop them.

     Audio: only the original ten carry keys, because a voice file per
     conjunct is a recording session and the pack budget spends its voice on
     letters, matras and words. The conjunct is TAUGHT VISUALLY — split it,
     see the two letters — and heard inside its example word. */
  hardConjuncts: [
    { char: 'क्ष', parts: ['क', 'ष'], name: 'ksha', audio: 'hi/ksha', word: 'क्षमा' },
    { char: 'त्र', parts: ['त', 'र'], name: 'tra',  audio: 'hi/tra',  word: 'त्रिशूल' },
    { char: 'ज्ञ', parts: ['ज', 'ञ'], name: 'gya',  audio: 'hi/gya',  word: 'ज्ञान' },
    { char: 'श्र', parts: ['श', 'र'], name: 'shra', audio: 'hi/shra', word: 'श्री' },
    { char: 'प्र', parts: ['प', 'र'], name: 'pra',  audio: 'hi/pra',  word: 'प्रेम' },
    { char: 'क्र', parts: ['क', 'र'], name: 'kra',  audio: 'hi/kra',  word: 'क्रम' },
    { char: 'द्व', parts: ['द', 'व'], name: 'dva',  audio: 'hi/dva',  word: 'द्वार' },
    { char: 'त्त', parts: ['त', 'त'], name: 'tta-j', audio: 'hi/tta-j', word: 'कुत्ता' },
    { char: 'ल्ल', parts: ['ल', 'ल'], name: 'lla-j', audio: 'hi/lla-j', word: 'बिल्ली' },
    { char: 'च्छ', parts: ['च', 'छ'], name: 'chchha', audio: 'hi/chchha', word: 'अच्छा' },

    /* doubled letters — the child already says these words */
    { char: 'च्च', parts: ['च', 'च'], name: 'chcha-j', word: 'बच्चा' },
    { char: 'प्प', parts: ['प', 'प'], name: 'ppa-j',   word: 'चप्पल' },
    { char: 'ट्ट', parts: ['ट', 'ट'], name: 'ttta-j',  word: 'छुट्टी' },
    { char: 'ड्ड', parts: ['ड', 'ड'], name: 'ddda-j',  word: 'लड्डू' },
    { char: 'न्न', parts: ['न', 'न'], name: 'nna-j',   word: 'उन्नीस' },
    { char: 'म्म', parts: ['म', 'म'], name: 'mma-j',   word: 'चम्मच' },
    { char: 'क्ख', parts: ['क', 'ख'], name: 'kkha',    word: 'मक्खन' },
    { char: 'ल्ट', parts: ['ल', 'ट'], name: 'lta',     word: 'बाल्टी' },

    /* the स्- cluster, which opens more early words than any other */
    { char: 'स्त', parts: ['स', 'त'], name: 'sta',  word: 'नमस्ते' },
    { char: 'स्थ', parts: ['स', 'थ'], name: 'stha', word: 'स्थान' },
    { char: 'स्व', parts: ['स', 'व'], name: 'sva',  word: 'स्वागत' },
    { char: 'स्क', parts: ['स', 'क'], name: 'ska',  word: 'स्कूल' },
    { char: 'स्प', parts: ['स', 'प'], name: 'spa',  word: 'अस्पताल' },

    /* half-letter + letter, the ordinary case */
    { char: 'ब्द', parts: ['ब', 'द'], name: 'bda',  word: 'शब्द' },
    { char: 'क्त', parts: ['क', 'त'], name: 'kta',  word: 'शक्ति' },
    { char: 'प्त', parts: ['प', 'त'], name: 'pta',  word: 'सप्ताह' },
    { char: 'ष्ट', parts: ['ष', 'ट'], name: 'shta', word: 'कष्ट' },
    { char: 'ष्ण', parts: ['ष', 'ण'], name: 'shna', word: 'कृष्ण' },
    { char: 'श्व', parts: ['श', 'व'], name: 'shva', word: 'विश्व' },
    { char: 'द्ध', parts: ['द', 'ध'], name: 'dddha', word: 'शुद्ध' },
    { char: 'ग्र', parts: ['ग', 'र'], name: 'gra',  word: 'ग्राम' },
    { char: 'द्र', parts: ['द', 'र'], name: 'dra',  word: 'समुद्र' },
    { char: 'ट्र', parts: ['ट', 'र'], name: 'ttra', word: 'ट्रेन' },

    /* -य and -ज्य, which look like a new letter and are not */
    { char: 'त्य', parts: ['त', 'य'], name: 'tya',  word: 'सत्य' },
    { char: 'द्य', parts: ['द', 'य'], name: 'dya',  word: 'विद्या' },
    { char: 'ध्य', parts: ['ध', 'य'], name: 'dhya', word: 'ध्यान' },
    { char: 'न्य', parts: ['न', 'य'], name: 'nya',  word: 'धन्यवाद' },
    { char: 'ज्य', parts: ['ज', 'य'], name: 'jya',  word: 'राज्य' },

    /* the reph: र् climbs on top of the NEXT letter, not its own */
    { char: 'र्म', parts: ['र', 'म'], name: 'rma',  word: 'धर्म' },
    { char: 'र्द', parts: ['र', 'द'], name: 'rda',  word: 'दर्द' },
    { char: 'र्क', parts: ['र', 'क'], name: 'rka',  word: 'पार्क' },
    { char: 'र्ष', parts: ['र', 'ष'], name: 'rsha', word: 'वर्ष' }
  ]
};

/* ------------------------------------------------------- GURMUKHI ------- */
/* U+0A00–U+0A7F. Serves Punjabi. Script of the Guru Granth Sahib, so it
   interlocks with the Dharma pillar (docs/09 §6).

   A note the UI should respect: the traditional alphabet is the PAINTI —
   thirty-five letters — and the three bearers ੳ ਅ ੲ are the first three
   OF those thirty-five, not extra. So `consonants` holds the 32 that
   actually carry a consonant sound, `vowels` holds the bearers plus the
   independent vowel forms, and `painti` holds all 35 in chart order for
   when the chart itself is what you are showing. */

var GURMUKHI = {
  id: 'gurmukhi',
  name: 'Gurmukhi',
  nativeName: 'ਗੁਰਮੁਖੀ',
  direction: 'ltr',
  headline: true,                 /* a top bar, but broken differently from Devanagari's */
  inherent: 'a',
  virama: '੍',               /* ੍  halant; surfaces as a subjoined letter */
  audioNs: 'pa',
  languages: ['pa'],
  font: { family: 'Noto Sans Gurmukhi', fallback: 'Mukta Mahee', minSize: 17, lineHeight: 1.75, scale: 1.10 },
  notes: 'Script of the Guru Granth Sahib. Only three letters take subjoined forms: ਹ, ਰ, ਵ.',

  /* The three bearers, then the ten independent vowels they carry.
     A bearer alone is not a sound — it is a seat for a laga. */
  bearers: [
    { char: 'ੳ', name: 'ura',  audio: 'pa/ura',  carries: ['u', 'uu', 'o'] },
    { char: 'ਅ', name: 'aira', audio: 'pa/l-0', carries: ['a', 'aa', 'ai', 'au'] },
    { char: 'ੲ', name: 'iri',  audio: 'pa/iri',  carries: ['i', 'ii', 'e'] }
  ],
  vowels: [
    { char: 'ਅ', name: 'a',  roman: 'a',  audio: 'pa/v-a',  group: 'svar', bearer: 'ਅ', short: true },
    { char: 'ਆ', name: 'aa', roman: 'ā',  audio: 'pa/l-1', group: 'svar', bearer: 'ਅ', short: false, pairOf: 'a' },
    { char: 'ਇ', name: 'i',  roman: 'i',  audio: 'pa/l-2',  group: 'svar', bearer: 'ੲ', short: true },
    { char: 'ਈ', name: 'ii', roman: 'ī',  audio: 'pa/l-3', group: 'svar', bearer: 'ੲ', short: false, pairOf: 'i' },
    { char: 'ਉ', name: 'u',  roman: 'u',  audio: 'pa/l-4',  group: 'svar', bearer: 'ੳ', short: true },
    { char: 'ਊ', name: 'uu', roman: 'ū',  audio: 'pa/l-5', group: 'svar', bearer: 'ੳ', short: false, pairOf: 'u' },
    { char: 'ਏ', name: 'e',  roman: 'e',  audio: 'pa/l-6',  group: 'svar', bearer: 'ੲ', short: false },
    { char: 'ਐ', name: 'ai', roman: 'ai', audio: 'pa/l-7', group: 'svar', bearer: 'ਅ', short: false },
    { char: 'ਓ', name: 'o',  roman: 'o',  audio: 'pa/l-8',  group: 'svar', bearer: 'ੳ', short: false },
    { char: 'ਔ', name: 'au', roman: 'au', audio: 'pa/l-9', group: 'svar', bearer: 'ਅ', short: false }
  ],

  /* The 32 sound-carrying akhar: ਸ ਹ, then five vargas of five, then the
     four semivowels plus ੜ. */
  consonants: [
    { char: 'ਸ', name: 'sassa',    r: 's',  audio: 'pa/l-10',    group: 'sibilant' },
    { char: 'ਹ', name: 'haha',     r: 'h',  audio: 'pa/l-11',     group: 'sibilant' },
    { char: 'ਕ', name: 'kakka',    r: 'k',  audio: 'pa/l-12',    group: 'velar' },
    { char: 'ਖ', name: 'khakha',   r: 'kh', audio: 'pa/l-13',   group: 'velar' },
    { char: 'ਗ', name: 'gagga',    r: 'g',  audio: 'pa/l-14',    group: 'velar' },
    { char: 'ਘ', name: 'ghagga',   r: 'gh', audio: 'pa/l-15',   group: 'velar' },
    { char: 'ਙ', name: 'nganga',   r: 'ṅ',  audio: 'pa/l-16',   group: 'velar' },
    { char: 'ਚ', name: 'chacha',   r: 'c',  audio: 'pa/l-17',   group: 'palatal' },
    { char: 'ਛ', name: 'chhachha', r: 'ch', audio: 'pa/l-18', group: 'palatal' },
    { char: 'ਜ', name: 'jajja',    r: 'j',  audio: 'pa/l-19',    group: 'palatal' },
    { char: 'ਝ', name: 'jhajja',   r: 'jh', audio: 'pa/l-20',   group: 'palatal' },
    { char: 'ਞ', name: 'nyanya',   r: 'ñ',  audio: 'pa/l-21',   group: 'palatal' },
    { char: 'ਟ', name: 'tainka',   r: 'ṭ',  audio: 'pa/l-22',   group: 'retroflex' },
    { char: 'ਠ', name: 'thattha',  r: 'ṭh', audio: 'pa/l-23',  group: 'retroflex' },
    { char: 'ਡ', name: 'dadda',    r: 'ḍ',  audio: 'pa/l-24',    group: 'retroflex' },
    { char: 'ਢ', name: 'dhadda',   r: 'ḍh', audio: 'pa/l-25',   group: 'retroflex' },
    { char: 'ਣ', name: 'nanna',    r: 'ṇ',  audio: 'pa/l-26',    group: 'retroflex' },
    { char: 'ਤ', name: 'tatta',    r: 't',  audio: 'pa/l-27',    group: 'dental' },
    { char: 'ਥ', name: 'thatha',   r: 'th', audio: 'pa/l-28',   group: 'dental' },
    { char: 'ਦ', name: 'dada',     r: 'd',  audio: 'pa/l-29',     group: 'dental' },
    { char: 'ਧ', name: 'dhada',    r: 'dh', audio: 'pa/l-30',    group: 'dental' },
    { char: 'ਨ', name: 'nana',     r: 'n',  audio: 'pa/l-31',     group: 'dental' },
    { char: 'ਪ', name: 'pappa',    r: 'p',  audio: 'pa/l-32',    group: 'labial' },
    { char: 'ਫ', name: 'phapha',   r: 'ph', audio: 'pa/l-33',   group: 'labial' },
    { char: 'ਬ', name: 'babba',    r: 'b',  audio: 'pa/l-34',    group: 'labial' },
    { char: 'ਭ', name: 'bhabba',   r: 'bh', audio: 'pa/bhabba',   group: 'labial' },
    { char: 'ਮ', name: 'mamma',    r: 'm',  audio: 'pa/mamma',    group: 'labial' },
    { char: 'ਯ', name: 'yayya',    r: 'y',  audio: 'pa/yayya',    group: 'semivowel' },
    { char: 'ਰ', name: 'rara',     r: 'r',  audio: 'pa/rara',     group: 'semivowel' },
    { char: 'ਲ', name: 'lalla',    r: 'l',  audio: 'pa/lalla',    group: 'semivowel' },
    { char: 'ਵ', name: 'vava',     r: 'v',  audio: 'pa/vava',     group: 'semivowel' },
    { char: 'ੜ', name: 'rarra',    r: 'ṛ',  audio: 'pa/rarra',    group: 'semivowel' }
  ],

  /* The nine laga (matras). Note the difference from Devanagari that the
     engine gets for free because position is data: hora and kanaura sit
     ABOVE in Gurmukhi where Devanagari's ो ौ extend to the right. */
  matras: [
    { sign: 'ਾ', name: 'kanna',      vowel: 'aa', vowelChar: 'ਆ', position: 'right', example: 'ਕਾ', audio: 'pa/m-aa', grid: true },
    { sign: 'ਿ', name: 'sihari',     vowel: 'i',  vowelChar: 'ਇ', position: 'left',  example: 'ਕਿ', audio: 'pa/m-i',  grid: true },
    { sign: 'ੀ', name: 'bihari',     vowel: 'ii', vowelChar: 'ਈ', position: 'right', example: 'ਕੀ', audio: 'pa/m-ii', grid: true },
    { sign: 'ੁ', name: 'aunkar',     vowel: 'u',  vowelChar: 'ਉ', position: 'below', example: 'ਕੁ', audio: 'pa/m-u',  grid: true },
    { sign: 'ੂ', name: 'dulainkar',  vowel: 'uu', vowelChar: 'ਊ', position: 'below', example: 'ਕੂ', audio: 'pa/m-uu', grid: true },
    { sign: 'ੇ', name: 'lavan',      vowel: 'e',  vowelChar: 'ਏ', position: 'above', example: 'ਕੇ', audio: 'pa/m-e',  grid: true },
    { sign: 'ੈ', name: 'dulavan',    vowel: 'ai', vowelChar: 'ਐ', position: 'above', example: 'ਕੈ', audio: 'pa/m-ai', grid: true },
    { sign: 'ੋ', name: 'hora',       vowel: 'o',  vowelChar: 'ਓ', position: 'above', example: 'ਕੋ', audio: 'pa/m-o',  grid: true },
    { sign: 'ੌ', name: 'kanaura',    vowel: 'au', vowelChar: 'ਔ', position: 'above', example: 'ਕੌ', audio: 'pa/m-au', grid: true }
  ],

  numerals: [
    { char: '੦', value: 0, name: 'sunna', audio: 'pa/n0' },
    { char: '੧', value: 1, name: 'ikk',   audio: 'pa/n1' },
    { char: '੨', value: 2, name: 'do',    audio: 'pa/n2' },
    { char: '੩', value: 3, name: 'tinn',  audio: 'pa/n3' },
    { char: '੪', value: 4, name: 'chaar', audio: 'pa/n4' },
    { char: '੫', value: 5, name: 'panj',  audio: 'pa/n5' },
    { char: '੬', value: 6, name: 'chhe',  audio: 'pa/n6' },
    { char: '੭', value: 7, name: 'satt',  audio: 'pa/n7' },
    { char: '੮', value: 8, name: 'atth',  audio: 'pa/n8' },
    { char: '੯', value: 9, name: 'naun',  audio: 'pa/n9' }
  ],

  /* The six bindi letters, for Persian/Arabic and English loanwords. */
  nuktaLetters: [
    { char: 'ਸ਼', name: 'shashsha', base: 'ਸ', audio: 'pa/shashsha' },
    { char: 'ਖ਼', name: 'khhakhha', base: 'ਖ', audio: 'pa/khhakhha' },
    { char: 'ਗ਼', name: 'ghhagha',  base: 'ਗ', audio: 'pa/ghhagha' },
    { char: 'ਜ਼', name: 'zazza',    base: 'ਜ', audio: 'pa/zazza' },
    { char: 'ਫ਼', name: 'fafa',     base: 'ਫ', audio: 'pa/fafa' },
    { char: 'ਲ਼', name: 'llalla',   base: 'ਲ', audio: 'pa/llalla' }
  ],

  /* Signs that are not laga but change the sound — a Punjabi child meets
     addak (gemination) and tippi/bindi (nasal) in week one. */
  signs: [
    { sign: 'ਂ', name: 'bindi',  audio: 'pa/bindi',  role: 'nasal',      example: 'ਮਾਂ' },
    { sign: 'ੰ', name: 'tippi',  audio: 'pa/tippi',  role: 'nasal',      example: 'ਅੰਬ' },
    { sign: 'ੱ', name: 'addak',  audio: 'pa/addak',  role: 'gemination', example: 'ਕੁੱਤਾ' }
  ],

  /* Only ਹ, ਰ and ਵ subjoin in modern Gurmukhi, which makes the conjunct
     load far lighter than Devanagari's. */
  hardConjuncts: [
    { char: 'ਪ੍ਰ', parts: ['ਪ', 'ਰ'], name: 'pra', audio: 'pa/pra', word: 'ਪ੍ਰੇਮ' },
    { char: 'ਕ੍ਰ', parts: ['ਕ', 'ਰ'], name: 'kra', audio: 'pa/kra', word: 'ਕ੍ਰਿਪਾ' },
    { char: 'ਤ੍ਰ', parts: ['ਤ', 'ਰ'], name: 'tra', audio: 'pa/tra', word: 'ਮਿਤ੍ਰ' },
    { char: 'ਸ੍ਰ', parts: ['ਸ', 'ਰ'], name: 'sra', audio: 'pa/sra', word: 'ਸ੍ਰੀ' },
    { char: 'ਸ੍ਵ', parts: ['ਸ', 'ਵ'], name: 'sva', audio: 'pa/sva', word: 'ਸ੍ਵੈ' },
    { char: 'ੜ੍ਹ', parts: ['ੜ', 'ਹ'], name: 'rrha', audio: 'pa/rrha', word: 'ਪੜ੍ਹਨਾ' },
    { char: 'ਨ੍ਹ', parts: ['ਨ', 'ਹ'], name: 'nha', audio: 'pa/nha', word: 'ਉਨ੍ਹਾਂ' }
  ]
};

/* The painti in chart order: bearers first, then the sound-carrying 32.
   Built rather than typed twice, so the two can never drift apart. */
GURMUKHI.painti = GURMUKHI.bearers.concat(GURMUKHI.consonants);

W.IND_SCRIPTS = { devanagari: DEVANAGARI, gurmukhi: GURMUKHI };

/* ==================================================== LANGUAGE PACKS ===== */
/* Themes are SHARED IDS across every pack (docs/09 §9) so a bilingual child
   sees the same eight themes in Hindi and in Punjabi, and so the parent
   report can compare like with like. */

/* A pack fills these in the order it can afford to. Punjabi currently covers
   the first eight; Hindi covers all seventeen. A theme with no words in a
   pack is a gap in that pack, never a difference in the theme list — that is
   what keeps two lexicons comparable in the parent report. */
var THEMES = [
  { id: 'greetings', en: 'Greetings', icon: '🙏' },
  { id: 'family',   en: 'Family',  icon: '👪' },
  { id: 'food',     en: 'Food',    icon: '🍛' },
  { id: 'body',     en: 'Body',    icon: '👤' },
  { id: 'home',     en: 'Home',    icon: '🏠' },
  { id: 'basics',   en: 'Everyday words', icon: '🧩' },
  { id: 'actions',  en: 'Doing words', icon: '🏃' },
  { id: 'animals',  en: 'Animals', icon: '🐘' },
  { id: 'colours',  en: 'Colours', icon: '🎨' },
  { id: 'numbers',  en: 'Numbers', icon: '🔢' },
  { id: 'school',   en: 'School',  icon: '🎒' },
  { id: 'clothes',  en: 'Clothes', icon: '👕' },
  { id: 'weather',  en: 'Weather and sky', icon: '🌦️' },
  { id: 'time',     en: 'Time and days', icon: '⏰' },
  { id: 'places',   en: 'Places and outdoors', icon: '🌳' },
  { id: 'transport', en: 'Getting around', icon: '🚌' },
  { id: 'feelings', en: 'Feelings', icon: '💛' }
];

/* The ladder is shared shape, per-pack content. `types` is the list of
   exercise generators appropriate to the stage — keeping it in DATA is what
   lets a new pack re-sequence itself without touching nextQuestion().

   PHASE 0 ROUTING FIX. The audit found letter drills leaking into the word,
   sentence and reading stages (oddOneOut — a letter exercise — sat in s4 and
   s6; soundMatch served ~75% bare letters inside s3 Words), so each stage now
   lists only the types that practise ITS skill. Two mechanics make that safe
   in data rather than code:

     - `typeOpts` on a stage is per-type generator options, merged in by
       nextQuestion(). s2 uses it to make soundMatch discriminate SYLLABLES
       (consonant+matra), not bare letters — bare letters are s1's job.
     - generators that need authored content (sentenceBuild, pickReply,
       readPassage) or a traceable script (trace) fall back to wordBuild
       inside the engine, so wordBuild is listed as a legal type exactly where
       that fallback is reachable. The aspirational type STAYS listed so the
       authoring gap is visible, never hidden. */
function ladder(items) {
  var s4Authored = !!(items.s4 && items.s4.length && typeof items.s4[0] === 'object');
  var s5Authored = !!(items.s5 && items.s5.length && typeof items.s5[0] === 'object');
  var s6HasPassages = (function () {
    var i; for (i = 0; i < (items.s6 || []).length; i++) { if (items.s6[i] && items.s6[i].kind === 'passage') return true; }
    return false;
  }());
  var s6HasItems = !!(items.s6 && items.s6.length);
  return [
    { id: 's0', n: 0, name: 'Sunna',     en: 'Listening',  desc: 'Ear first. Spoken words and phrases, listen and point, no script at all.',
      outcome: 'Understands common spoken words and picks the right picture.', script: false, types: ['listenPoint'], items: items.s0 },
    { id: 's1', n: 1, name: 'Varnamala', en: 'The letters', desc: 'Every letter: its shape, its sound, its sound family.',
      outcome: 'Recognises every letter by sight and by sound.', script: true, types: ['soundMatch', 'oddOneOut'], items: items.s1 },
    { id: 's2', n: 2, name: 'Matras',    en: 'Vowel signs', desc: 'The vowel signs and the barakhadi grid — the core abugida skill.',
      outcome: 'Reads any simple word aloud.', script: true, types: ['matraAttach', 'barakhadi', 'soundMatch'],
      typeOpts: { soundMatch: { kind: 'syllable' } }, items: items.s2 },
    /* PHASE 3 put `sentenceBlank` here: a word in a sentence is exactly what
       this stage is for, and it is the only drill that asks whether the child
       knows what a word DOES rather than how it is spelt. Packs without
       written sentences fall back to wordBuild inside the generator. */
    /* PHASE B added `wordProduce` here. s3 is the right home for the first
       production: the child already knows these words by sound and by sight,
       so writing one is retrieval, not a memory test on unseen material. It is
       listed once against three recognition types, which is the intended
       ratio — production is the hard beat, not the whole stage. */
    { id: 's3', n: 3, name: 'Shabd',     en: 'Words',       desc: 'Core words by theme — the house, the table, the body, the street, the calendar.',
      outcome: 'Reads, understands and writes common words.', script: true,
      types: ['listenPoint', 'wordBuild', 'sentenceBlank', 'wordProduce'], items: items.s3 },
    { id: 's4', n: 4, name: 'Vakya',     en: 'Sentences',   desc: 'Sentence order, gender, postpositions, verb agreement, tense.',
      outcome: 'Builds correct simple sentences.', script: true,
      types: s4Authored ? ['sentenceBuild'] : ['sentenceBuild', 'wordBuild'], items: items.s4 },
    { id: 's5', n: 5, name: 'Baat-cheet', en: 'Conversation', desc: 'Whole exchanges: greeting elders, the table, the shop, Sunday’s call to Nani.',
      outcome: 'Follows a short everyday exchange and picks the right reply.', script: true,
      types: s5Authored ? ['pickReply', 'listenPoint'] : ['pickReply', 'listenPoint', 'wordBuild'], items: items.s5 },
    { id: 's6', n: 6, name: 'Padhna',    en: 'Reading',     desc: 'Graded readers, and the conjuncts you need to get through them.',
      outcome: 'Splits conjuncts and reads a few real sentences.', script: true,
      types: s6HasPassages ? ['conjunctSplit', 'readPassage'] : (s6HasItems ? ['conjunctSplit', 'wordBuild'] : ['wordBuild']),
      items: items.s6 },
    /* `trace` is listed three times as a WEIGHT: pick() is uniform, tracing is
       the stage, and one build question in four keeps the wrist rested. */
    { id: 's7', n: 7, name: 'Likhna',    en: 'Writing',     desc: 'Trace every letter with a finger or the arrow keys — the shape first; stroke order comes with a grown-up.',
      outcome: 'Forms each letter’s shape by tracing it.', script: true, types: ['trace', 'trace', 'trace', 'wordBuild'], items: items.s7 }
  ];
}

/* ---- Hindi ------------------------------------------------------------- */
/* Five hundred core words, which is the number docs/09 §9 budgets per pack
   (1,000 is the full target; this is the half that a 4–12 child actually
   uses). Vocabulary is heritage-first (docs/09 §3): what is said in the
   house on a Tuesday, not invented sentences about owls. A child who
   already knows what *paani* means does not need to be taught the meaning —
   they need to learn that it is written पानी.

   Order IS the ramp. The first block is the couple of hundred words a
   four-year-old hears every day, mixed across themes; the theme blocks
   after it widen the same ground.

   THE AUDIO BUDGET. Audio keys exist on exactly three kinds of thing: the
   46 letters, the 12 matras, and lexicon words. Nothing else — no sentence,
   no exercise item, no conjunct added here carries one, because every key
   is a voice file somebody has to record. Word keys are DERIVED from the
   romanisation rather than typed, so the manifest a recording session works
   from can never drift from the pack:

       hi/w-<roman, spaces removed>

   Rows are [word, roman, en, theme] with an optional numeric 5th column. */

function packWords(ns, rows) {
  var out = [], i, r, e;
  for (i = 0; i < rows.length; i++) {
    r = rows[i];
    e = { word: r[0], roman: r[1], en: r[2], theme: r[3], audio: ns + '/w-' + r[1].replace(/\s+/g, '') };
    if (r.length > 4 && r[4] !== undefined) e.value = r[4];
    out.push(e);
  }
  return out;
}

var HI_LEX = packWords('hi', [

  /* ============ the first words — what is said in the house every day ==== */
  ['नमस्ते', 'namaste', 'hello', 'greetings'],
  ['हाँ', 'haan', 'yes', 'greetings'],
  ['नहीं', 'nahin', 'no', 'greetings'],
  ['अच्छा', 'achchha', 'good, okay', 'greetings'],
  ['धन्यवाद', 'dhanyavaad', 'thank you', 'greetings'],
  ['शुक्रिया', 'shukriya', 'thanks', 'greetings'],
  ['नमस्कार', 'namaskaar', 'hello (respectful)', 'greetings'],
  ['अलविदा', 'alvida', 'goodbye', 'greetings'],
  ['जी', 'ji', 'yes — the respectful word', 'greetings'],
  ['कृपया', 'kripya', 'please', 'greetings'],

  ['माँ', 'maa', 'mother', 'family'],
  ['पापा', 'papa', 'father', 'family'],
  ['भाई', 'bhai', 'brother', 'family'],
  ['बहन', 'bahan', 'sister', 'family'],
  ['दादा', 'dada', 'grandfather (father’s side)', 'family'],
  ['दादी', 'dadi', 'grandmother (father’s side)', 'family'],
  ['नाना', 'nana', 'grandfather (mother’s side)', 'family'],
  ['नानी', 'nani', 'grandmother (mother’s side)', 'family'],
  ['बच्चा', 'bachcha', 'child', 'family'],
  ['परिवार', 'parivaar', 'family', 'family'],
  ['बेटा', 'beta', 'son — and what a grown-up calls a child', 'family'],
  ['बेटी', 'beti', 'daughter', 'family'],
  ['दोस्त', 'dost', 'friend', 'family'],

  ['पानी', 'paani', 'water', 'food'],
  ['रोटी', 'roti', 'bread', 'food'],
  ['दूध', 'doodh', 'milk', 'food'],
  ['चावल', 'chaawal', 'rice', 'food'],
  ['दाल', 'daal', 'lentils', 'food'],
  ['खाना', 'khaana', 'food, a meal; to eat', 'food'],
  ['आम', 'aam', 'mango', 'food'],
  ['केला', 'kela', 'banana', 'food'],
  ['चाय', 'chai', 'tea', 'food'],
  ['मिठाई', 'mithai', 'sweets', 'food'],
  ['नमक', 'namak', 'salt', 'food'],
  ['फल', 'phal', 'fruit', 'food'],
  ['सब्ज़ी', 'sabzi', 'vegetable', 'food'],

  ['सिर', 'sir', 'head', 'body'],
  ['आँख', 'aankh', 'eye', 'body'],
  ['नाक', 'naak', 'nose', 'body'],
  ['कान', 'kaan', 'ear', 'body'],
  ['मुँह', 'munh', 'mouth', 'body'],
  ['हाथ', 'haath', 'hand', 'body'],
  ['पैर', 'pair', 'foot', 'body'],
  ['पेट', 'pet', 'tummy', 'body'],
  ['बाल', 'baal', 'hair', 'body'],
  ['दाँत', 'daant', 'tooth', 'body'],

  ['घर', 'ghar', 'house', 'home'],
  ['दरवाज़ा', 'darwaaza', 'door', 'home'],
  ['खिड़की', 'khidki', 'window', 'home'],
  ['कुर्सी', 'kursi', 'chair', 'home'],
  ['मेज़', 'mez', 'table', 'home'],
  ['चाबी', 'chaabi', 'key', 'home'],
  ['बिस्तर', 'bistar', 'bed', 'home'],
  ['छत', 'chhat', 'roof', 'home'],
  ['रसोई', 'rasoi', 'kitchen', 'home'],
  ['कमरा', 'kamra', 'room', 'home'],

  ['मैं', 'main', 'I', 'basics'],
  ['तुम', 'tum', 'you (to a friend)', 'basics'],
  ['आप', 'aap', 'you (respectful)', 'basics'],
  ['यह', 'yah', 'this', 'basics'],
  ['वह', 'vah', 'that, he, she', 'basics'],
  ['हम', 'ham', 'we', 'basics'],
  ['मेरा', 'mera', 'my', 'basics'],
  ['क्या', 'kya', 'what', 'basics'],
  ['कौन', 'kaun', 'who', 'basics'],
  ['कहाँ', 'kahaan', 'where', 'basics'],
  ['बड़ा', 'bada', 'big', 'basics'],
  ['छोटा', 'chhota', 'small', 'basics'],
  ['बहुत', 'bahut', 'very, a lot', 'basics'],
  ['ठीक', 'theek', 'fine, alright', 'basics'],

  ['है', 'hai', 'is', 'actions'],
  ['हूँ', 'hoon', 'am', 'actions'],
  ['हैं', 'hain', 'are (respectful, or many)', 'actions'],
  ['हो', 'ho', 'are (to a friend)', 'actions'],
  ['खेलना', 'khelna', 'to play', 'actions'],
  ['पीना', 'peena', 'to drink', 'actions'],
  ['सोना', 'sona', 'to sleep', 'actions'],
  ['जाना', 'jaana', 'to go', 'actions'],
  ['आना', 'aana', 'to come', 'actions'],
  ['देखना', 'dekhna', 'to see, to watch', 'actions'],
  ['करना', 'karna', 'to do', 'actions'],
  ['देना', 'dena', 'to give', 'actions'],
  ['कहना', 'kahna', 'to say', 'actions'],

  ['एक', 'ek', 'one', 'numbers', 1],
  ['दो', 'do', 'two', 'numbers', 2],
  ['तीन', 'teen', 'three', 'numbers', 3],
  ['चार', 'chaar', 'four', 'numbers', 4],
  ['पाँच', 'paanch', 'five', 'numbers', 5],
  ['छह', 'chhah', 'six', 'numbers', 6],
  ['सात', 'saat', 'seven', 'numbers', 7],
  ['आठ', 'aath', 'eight', 'numbers', 8],
  ['नौ', 'nau', 'nine', 'numbers', 9],
  ['दस', 'das', 'ten', 'numbers', 10],

  ['लाल', 'laal', 'red', 'colours'],
  ['नीला', 'neela', 'blue', 'colours'],
  ['पीला', 'peela', 'yellow', 'colours'],
  ['हरा', 'hara', 'green', 'colours'],
  ['काला', 'kaala', 'black', 'colours'],
  ['सफ़ेद', 'safed', 'white', 'colours'],

  ['कुत्ता', 'kutta', 'dog', 'animals'],
  ['बिल्ली', 'billi', 'cat', 'animals'],
  ['गाय', 'gaay', 'cow', 'animals'],
  ['हाथी', 'haathi', 'elephant', 'animals'],
  ['चिड़िया', 'chidiya', 'bird', 'animals'],
  ['मछली', 'machhli', 'fish', 'animals'],

  ['आज', 'aaj', 'today', 'time'],
  ['कल', 'kal', 'yesterday — and tomorrow, the same word', 'time'],
  ['सुबह', 'subah', 'morning', 'time'],
  ['रात', 'raat', 'night', 'time'],

  ['खुश', 'khush', 'happy', 'feelings'],
  ['भूखा', 'bhookha', 'hungry', 'feelings'],
  ['प्यार', 'pyaar', 'love', 'feelings'],

  /* ================= greetings — the rest of the doorway ================= */
  ['प्रणाम', 'pranaam', 'a respectful greeting to an elder', 'greetings'],
  ['सुप्रभात', 'suprabhaat', 'good morning', 'greetings'],
  ['शुभ रात्रि', 'shubh raatri', 'good night', 'greetings'],
  ['माफ़ करना', 'maaf karna', 'sorry', 'greetings'],
  ['स्वागत', 'svaagat', 'welcome', 'greetings'],
  ['बधाई', 'badhaai', 'congratulations', 'greetings'],
  ['फिर मिलेंगे', 'phir milenge', 'see you again', 'greetings'],

  /* ============================ family ================================== */
  ['चाचा', 'chacha', 'uncle (father’s younger brother)', 'family'],
  ['चाची', 'chachi', 'aunt (chacha’s wife)', 'family'],
  ['मामा', 'mama', 'uncle (mother’s brother)', 'family'],
  ['मामी', 'mami', 'aunt (mama’s wife)', 'family'],
  ['मौसी', 'mausi', 'aunt (mother’s sister)', 'family'],
  ['बुआ', 'bua', 'aunt (father’s sister)', 'family'],
  ['भैया', 'bhaiya', 'big brother — what you call him', 'family'],
  ['दीदी', 'didi', 'big sister — what you call her', 'family'],
  ['लड़का', 'ladka', 'boy', 'family'],
  ['लड़की', 'ladki', 'girl', 'family'],
  ['आदमी', 'aadmi', 'man', 'family'],
  ['औरत', 'aurat', 'woman', 'family'],
  ['पति', 'pati', 'husband', 'family'],
  ['पत्नी', 'patni', 'wife', 'family'],
  ['पड़ोसी', 'padosi', 'neighbour', 'family'],
  ['मेहमान', 'mehmaan', 'guest', 'family'],

  /* ============================= food =================================== */
  ['सेब', 'seb', 'apple', 'food'],
  ['संतरा', 'santara', 'orange (the fruit)', 'food'],
  ['अंगूर', 'angoor', 'grapes', 'food'],
  ['अनार', 'anaar', 'pomegranate', 'food'],
  ['तरबूज़', 'tarbooz', 'watermelon', 'food'],
  ['आलू', 'aaloo', 'potato', 'food'],
  ['प्याज़', 'pyaaz', 'onion', 'food'],
  ['टमाटर', 'tamaatar', 'tomato', 'food'],
  ['गाजर', 'gaajar', 'carrot', 'food'],
  ['मटर', 'matar', 'peas', 'food'],
  ['भिंडी', 'bhindi', 'okra', 'food'],
  ['पालक', 'paalak', 'spinach', 'food'],
  ['अंडा', 'anda', 'egg', 'food'],
  ['घी', 'ghee', 'ghee', 'food'],
  ['मक्खन', 'makkhan', 'butter', 'food'],
  ['दही', 'dahi', 'yoghurt', 'food'],
  ['पनीर', 'paneer', 'paneer', 'food'],
  ['चीनी', 'cheeni', 'sugar', 'food'],
  ['मिर्च', 'mirch', 'chilli', 'food'],
  ['मसाला', 'masaala', 'spice', 'food'],
  ['हल्दी', 'haldi', 'turmeric', 'food'],
  ['अचार', 'achaar', 'pickle', 'food'],
  ['चटनी', 'chatni', 'chutney', 'food'],
  ['पराठा', 'paraatha', 'paratha', 'food'],
  ['पूरी', 'poori', 'poori', 'food'],
  ['समोसा', 'samosa', 'samosa', 'food'],
  ['लड्डू', 'laddoo', 'laddoo', 'food'],
  ['खीर', 'kheer', 'kheer', 'food'],
  ['हलवा', 'halva', 'halwa', 'food'],
  ['बिस्कुट', 'biskut', 'biscuit', 'food'],
  ['नाश्ता', 'naashta', 'breakfast', 'food'],
  ['तेल', 'tel', 'oil', 'food'],
  ['आटा', 'aata', 'flour', 'food'],
  ['शहद', 'shahad', 'honey', 'food'],

  /* ============================= body =================================== */
  ['चेहरा', 'chehra', 'face', 'body'],
  ['माथा', 'maatha', 'forehead', 'body'],
  ['गाल', 'gaal', 'cheek', 'body'],
  ['होंठ', 'honth', 'lip', 'body'],
  ['जीभ', 'jeebh', 'tongue', 'body'],
  ['गला', 'gala', 'throat', 'body'],
  ['गर्दन', 'gardan', 'neck', 'body'],
  ['कंधा', 'kandha', 'shoulder', 'body'],
  ['बाँह', 'baanh', 'arm', 'body'],
  ['उँगली', 'ungli', 'finger', 'body'],
  ['अंगूठा', 'angootha', 'thumb', 'body'],
  ['नाखून', 'naakhoon', 'nail', 'body'],
  ['घुटना', 'ghutna', 'knee', 'body'],
  ['टाँग', 'taang', 'leg', 'body'],
  ['पीठ', 'peeth', 'back', 'body'],
  ['दिल', 'dil', 'heart', 'body'],
  ['शरीर', 'shareer', 'body', 'body'],
  ['हड्डी', 'haddi', 'bone', 'body'],
  ['साँस', 'saans', 'breath', 'body'],
  ['आवाज़', 'aavaaz', 'voice', 'body'],
  ['बुखार', 'bukhaar', 'fever', 'body'],

  /* ============================= home =================================== */
  ['दीवार', 'deewaar', 'wall', 'home'],
  ['फ़र्श', 'farsh', 'floor', 'home'],
  ['सीढ़ी', 'seedhi', 'stairs', 'home'],
  ['अलमारी', 'almaari', 'cupboard', 'home'],
  ['पंखा', 'pankha', 'fan', 'home'],
  ['बत्ती', 'batti', 'light', 'home'],
  ['दीया', 'diya', 'oil lamp', 'home'],
  ['चूल्हा', 'choolha', 'stove', 'home'],
  ['बर्तन', 'bartan', 'a pot, the washing-up', 'home'],
  ['थाली', 'thaali', 'plate', 'home'],
  ['गिलास', 'gilaas', 'glass', 'home'],
  ['कटोरी', 'katori', 'small bowl', 'home'],
  ['चम्मच', 'chammach', 'spoon', 'home'],
  ['झाड़ू', 'jhaadu', 'broom', 'home'],
  ['साबुन', 'saabun', 'soap', 'home'],
  ['तौलिया', 'tauliya', 'towel', 'home'],
  ['कंघी', 'kanghi', 'comb', 'home'],
  ['तकिया', 'takiya', 'pillow', 'home'],
  ['चादर', 'chaadar', 'bedsheet', 'home'],
  ['कंबल', 'kambal', 'blanket', 'home'],
  ['बाल्टी', 'baalti', 'bucket', 'home'],
  ['बगीचा', 'bageecha', 'garden', 'home'],
  ['आँगन', 'aangan', 'courtyard', 'home'],
  ['फ़ोन', 'fon', 'phone', 'home'],

  /* ===================== everyday words that glue sentences ============= */
  ['वे', 've', 'they', 'basics'],
  ['तुम्हारा', 'tumhaara', 'your (to a friend)', 'basics'],
  ['आपका', 'aapka', 'your (respectful)', 'basics'],
  ['हमारा', 'hamaara', 'our', 'basics'],
  ['कब', 'kab', 'when', 'basics'],
  ['क्यों', 'kyon', 'why', 'basics'],
  ['कैसे', 'kaise', 'how', 'basics'],
  ['कितना', 'kitna', 'how much', 'basics'],
  ['यहाँ', 'yahaan', 'here', 'basics'],
  ['वहाँ', 'vahaan', 'there', 'basics'],
  ['और', 'aur', 'and, more', 'basics'],
  ['या', 'ya', 'or', 'basics'],
  ['लेकिन', 'lekin', 'but', 'basics'],
  ['भी', 'bhi', 'also', 'basics'],
  ['का', 'ka', 'of — the little word that shows belonging', 'basics'],
  ['को', 'ko', 'to (a person)', 'basics'],
  ['में', 'mein', 'in', 'basics'],
  ['पर', 'par', 'on', 'basics'],
  ['से', 'se', 'from, with', 'basics'],
  ['तक', 'tak', 'until, up to', 'basics'],
  ['पास', 'paas', 'near — and how you say you have something', 'basics'],
  ['थोड़ा', 'thoda', 'a little', 'basics'],
  ['सब', 'sab', 'all, everyone', 'basics'],
  ['कुछ', 'kuchh', 'something', 'basics'],
  ['अब', 'ab', 'now', 'basics'],
  ['फिर', 'phir', 'again, then', 'basics'],
  ['जल्दी', 'jaldi', 'quickly, soon', 'basics'],
  ['धीरे', 'dheere', 'slowly', 'basics'],
  ['नया', 'naya', 'new', 'basics'],
  ['पुराना', 'puraana', 'old', 'basics'],
  ['बुरा', 'bura', 'bad', 'basics'],
  ['गरम', 'garam', 'hot', 'basics'],
  ['ठंडा', 'thanda', 'cold', 'basics'],
  ['साफ़', 'saaf', 'clean', 'basics'],
  ['गंदा', 'ganda', 'dirty', 'basics'],
  ['मीठा', 'meetha', 'sweet', 'basics'],
  ['लंबा', 'lamba', 'long, tall', 'basics'],
  ['भारी', 'bhaari', 'heavy', 'basics'],
  ['हल्का', 'halka', 'light (not heavy)', 'basics'],
  ['सुंदर', 'sundar', 'beautiful', 'basics'],
  ['ज़्यादा', 'zyaada', 'more', 'basics'],
  ['कम', 'kam', 'less', 'basics'],
  ['ऊपर', 'oopar', 'up, above', 'basics'],
  ['नीचे', 'neeche', 'down, below', 'basics'],
  ['अंदर', 'andar', 'inside', 'basics'],
  ['बाहर', 'baahar', 'outside', 'basics'],
  ['आगे', 'aage', 'in front, ahead', 'basics'],
  ['पीछे', 'peechhe', 'behind', 'basics'],
  ['दाएँ', 'daaen', 'to the right', 'basics'],
  ['बाएँ', 'baaen', 'to the left', 'basics'],
  ['दूर', 'door', 'far', 'basics'],
  ['बंद', 'band', 'closed, shut', 'basics'],
  ['तैयार', 'taiyaar', 'ready', 'basics'],
  ['याद', 'yaad', 'memory — how you say you miss someone', 'basics'],
  ['पसंद', 'pasand', 'liking — how you say you like something', 'basics'],
  ['मदद', 'madad', 'help', 'basics'],
  ['उम्र', 'umr', 'age', 'basics'],
  ['बारी', 'baari', 'turn (in a game)', 'basics'],
  ['बात', 'baat', 'a thing said, a talk', 'basics'],
  ['साथ', 'saath', 'together, with', 'basics'],
  ['हर', 'har', 'every', 'basics'],

  /* =========================== doing words ============================== */
  ['सुनना', 'sunna', 'to listen', 'actions'],
  ['बोलना', 'bolna', 'to speak', 'actions'],
  ['पढ़ना', 'padhna', 'to read', 'actions'],
  ['लिखना', 'likhna', 'to write', 'actions'],
  ['बैठना', 'baithna', 'to sit', 'actions'],
  ['उठना', 'uthna', 'to get up', 'actions'],
  ['चलना', 'chalna', 'to walk, to go along', 'actions'],
  ['दौड़ना', 'daudna', 'to run', 'actions'],
  ['हँसना', 'hansna', 'to laugh', 'actions'],
  ['रोना', 'rona', 'to cry', 'actions'],
  ['गाना', 'gaana', 'to sing; a song', 'actions'],
  ['नाचना', 'naachna', 'to dance', 'actions'],
  ['बनाना', 'banaana', 'to make', 'actions'],
  ['लेना', 'lena', 'to take', 'actions'],
  ['धोना', 'dhona', 'to wash', 'actions'],
  ['पहनना', 'pahanna', 'to wear', 'actions'],
  ['खोलना', 'kholna', 'to open', 'actions'],
  ['रखना', 'rakhna', 'to put, to keep', 'actions'],
  ['समझना', 'samajhna', 'to understand', 'actions'],
  ['सीखना', 'seekhna', 'to learn', 'actions'],
  ['मिलना', 'milna', 'to meet', 'actions'],
  ['रुकना', 'rukna', 'to stop', 'actions'],
  ['बुलाना', 'bulaana', 'to call someone', 'actions'],
  ['पकाना', 'pakaana', 'to cook', 'actions'],
  ['ढूँढना', 'dhoondhna', 'to look for', 'actions'],
  ['जलाना', 'jalaana', 'to light (a lamp)', 'actions'],
  ['रहना', 'rahna', 'to live, to stay', 'actions'],
  ['सकना', 'sakna', 'to be able to', 'actions'],
  ['चाहिए', 'chaahiye', 'is wanted, is needed', 'actions'],
  ['था', 'tha', 'was', 'actions'],
  ['थी', 'thi', 'was (she, or a feminine word)', 'actions'],

  /* ============================ animals ================================= */
  ['बंदर', 'bandar', 'monkey', 'animals'],
  ['शेर', 'sher', 'lion', 'animals'],
  ['घोड़ा', 'ghoda', 'horse', 'animals'],
  ['तितली', 'titli', 'butterfly', 'animals'],
  ['बकरी', 'bakri', 'goat', 'animals'],
  ['भैंस', 'bhains', 'buffalo', 'animals'],
  ['बैल', 'bail', 'ox', 'animals'],
  ['ऊँट', 'oont', 'camel', 'animals'],
  ['भालू', 'bhaaloo', 'bear', 'animals'],
  ['हिरण', 'hiran', 'deer', 'animals'],
  ['साँप', 'saanp', 'snake', 'animals'],
  ['चूहा', 'chooha', 'mouse', 'animals'],
  ['मोर', 'mor', 'peacock', 'animals'],
  ['कौआ', 'kauaa', 'crow', 'animals'],
  ['तोता', 'tota', 'parrot', 'animals'],
  ['कबूतर', 'kabootar', 'pigeon', 'animals'],
  ['मुर्गा', 'murga', 'rooster', 'animals'],
  ['मुर्गी', 'murgi', 'hen', 'animals'],
  ['खरगोश', 'khargosh', 'rabbit', 'animals'],
  ['गिलहरी', 'gilahri', 'squirrel', 'animals'],
  ['मेंढक', 'mendhak', 'frog', 'animals'],
  ['मक्खी', 'makkhi', 'fly', 'animals'],
  ['मच्छर', 'machchhar', 'mosquito', 'animals'],
  ['चींटी', 'cheenti', 'ant', 'animals'],
  ['कछुआ', 'kachhua', 'tortoise', 'animals'],
  ['बाघ', 'baagh', 'tiger', 'animals'],
  ['गधा', 'gadha', 'donkey', 'animals'],
  ['भेड़', 'bhed', 'sheep', 'animals'],

  /* ============================ colours ================================= */
  ['नारंगी', 'naarangi', 'orange (the colour)', 'colours'],
  ['गुलाबी', 'gulaabi', 'pink', 'colours'],
  ['भूरा', 'bhoora', 'brown', 'colours'],
  ['बैंगनी', 'baingani', 'purple', 'colours'],
  ['सुनहरा', 'sunahra', 'golden', 'colours'],
  ['रंग', 'rang', 'colour', 'colours'],

  /* ============================ numbers ================================= */
  ['ग्यारह', 'gyaarah', 'eleven', 'numbers', 11],
  ['बारह', 'baarah', 'twelve', 'numbers', 12],
  ['तेरह', 'terah', 'thirteen', 'numbers', 13],
  ['चौदह', 'chaudah', 'fourteen', 'numbers', 14],
  ['पंद्रह', 'pandrah', 'fifteen', 'numbers', 15],
  ['सोलह', 'solah', 'sixteen', 'numbers', 16],
  ['सत्रह', 'satrah', 'seventeen', 'numbers', 17],
  ['अठारह', 'athaarah', 'eighteen', 'numbers', 18],
  ['उन्नीस', 'unnees', 'nineteen', 'numbers', 19],
  ['बीस', 'bees', 'twenty', 'numbers', 20],
  ['तीस', 'tees', 'thirty', 'numbers', 30],
  ['चालीस', 'chaalees', 'forty', 'numbers', 40],
  ['पचास', 'pachaas', 'fifty', 'numbers', 50],
  ['सौ', 'sau', 'a hundred', 'numbers', 100],
  ['हज़ार', 'hazaar', 'a thousand', 'numbers', 1000],
  ['शून्य', 'shoonya', 'zero', 'numbers', 0],
  ['आधा', 'aadha', 'half', 'numbers'],
  ['पहला', 'pehla', 'first', 'numbers'],
  ['दूसरा', 'doosra', 'second', 'numbers'],
  ['तीसरा', 'teesra', 'third', 'numbers'],
  ['रुपया', 'rupaya', 'rupee', 'numbers'],

  /* ============================= school ================================= */
  ['स्कूल', 'skool', 'school', 'school'],
  ['किताब', 'kitaab', 'book', 'school'],
  ['कलम', 'kalam', 'pen', 'school'],
  ['पेंसिल', 'pensil', 'pencil', 'school'],
  ['बस्ता', 'basta', 'school bag', 'school'],
  ['कक्षा', 'kaksha', 'class', 'school'],
  ['शिक्षक', 'shikshak', 'teacher', 'school'],
  ['पाठ', 'paath', 'lesson', 'school'],
  ['सवाल', 'savaal', 'question', 'school'],
  ['जवाब', 'javaab', 'answer', 'school'],
  ['नाम', 'naam', 'name', 'school'],
  ['अक्षर', 'akshar', 'letter (of the alphabet)', 'school'],
  ['शब्द', 'shabd', 'word', 'school'],
  ['वाक्य', 'vaakya', 'sentence', 'school'],
  ['कहानी', 'kahaani', 'story', 'school'],
  ['कविता', 'kavita', 'poem', 'school'],
  ['चित्र', 'chitra', 'picture', 'school'],
  ['खेल', 'khel', 'a game', 'school'],
  ['छुट्टी', 'chhutti', 'holiday', 'school'],
  ['गिनती', 'ginti', 'counting', 'school'],
  ['कागज़', 'kaagaz', 'paper', 'school'],
  ['पढ़ाई', 'padhaai', 'studying', 'school'],
  ['भाषा', 'bhaasha', 'language', 'school'],

  /* ============================ clothes ================================= */
  ['कपड़े', 'kapde', 'clothes', 'clothes'],
  ['कुरता', 'kurta', 'kurta', 'clothes'],
  ['साड़ी', 'saari', 'sari', 'clothes'],
  ['सलवार', 'salvaar', 'salwar', 'clothes'],
  ['कमीज़', 'kameez', 'shirt', 'clothes'],
  ['पतलून', 'patloon', 'trousers', 'clothes'],
  ['जूता', 'joota', 'shoe', 'clothes'],
  ['चप्पल', 'chappal', 'slippers', 'clothes'],
  ['मोज़ा', 'moza', 'sock', 'clothes'],
  ['टोपी', 'topi', 'cap', 'clothes'],
  ['दुपट्टा', 'dupatta', 'dupatta', 'clothes'],
  ['चूड़ी', 'choodi', 'bangle', 'clothes'],
  ['अंगूठी', 'angoothi', 'ring', 'clothes'],
  ['बटन', 'batan', 'button', 'clothes'],
  ['जेब', 'jeb', 'pocket', 'clothes'],
  ['स्वेटर', 'sveter', 'jumper', 'clothes'],
  ['कोट', 'kot', 'coat', 'clothes'],
  ['धोती', 'dhoti', 'dhoti', 'clothes'],
  ['पगड़ी', 'pagdi', 'turban', 'clothes'],
  ['लहँगा', 'lahanga', 'lehenga', 'clothes'],
  ['चश्मा', 'chashma', 'glasses', 'clothes'],

  /* ========================= weather and sky ============================ */
  ['मौसम', 'mausam', 'weather', 'weather'],
  ['धूप', 'dhoop', 'sunshine', 'weather'],
  ['बारिश', 'baarish', 'rain', 'weather'],
  ['बादल', 'baadal', 'cloud', 'weather'],
  ['हवा', 'hava', 'wind, air', 'weather'],
  ['सर्दी', 'sardi', 'winter, the cold season', 'weather'],
  ['गर्मी', 'garmi', 'summer, the heat', 'weather'],
  ['बरसात', 'barsaat', 'the rainy season', 'weather'],
  ['तूफ़ान', 'toofaan', 'storm', 'weather'],
  ['बिजली', 'bijli', 'lightning; electricity', 'weather'],
  ['सूरज', 'sooraj', 'sun', 'weather'],
  ['चाँद', 'chaand', 'moon', 'weather'],
  ['तारा', 'taara', 'star', 'weather'],
  ['आसमान', 'aasmaan', 'sky', 'weather'],
  ['बर्फ़', 'barf', 'snow, ice', 'weather'],
  ['कोहरा', 'kohra', 'fog', 'weather'],
  ['इंद्रधनुष', 'indradhanush', 'rainbow', 'weather'],
  ['छाता', 'chhaata', 'umbrella', 'weather'],
  ['आग', 'aag', 'fire', 'weather'],

  /* ========================== time and days ============================= */
  ['परसों', 'parson', 'the day before yesterday — and the day after tomorrow', 'time'],
  ['दोपहर', 'dopahar', 'afternoon', 'time'],
  ['शाम', 'shaam', 'evening', 'time'],
  ['दिन', 'din', 'day', 'time'],
  ['हफ़्ता', 'hafta', 'week', 'time'],
  ['महीना', 'maheena', 'month', 'time'],
  ['साल', 'saal', 'year', 'time'],
  ['घंटा', 'ghanta', 'hour', 'time'],
  ['मिनट', 'minat', 'minute', 'time'],
  ['समय', 'samay', 'time', 'time'],
  ['घड़ी', 'ghadi', 'clock, watch', 'time'],
  ['देर', 'der', 'late', 'time'],
  ['जन्मदिन', 'janmadin', 'birthday', 'time'],
  ['त्योहार', 'tyohaar', 'festival', 'time'],
  ['सोमवार', 'somvaar', 'Monday', 'time'],
  ['मंगलवार', 'mangalvaar', 'Tuesday', 'time'],
  ['बुधवार', 'budhvaar', 'Wednesday', 'time'],
  ['गुरुवार', 'guruvaar', 'Thursday', 'time'],
  ['शुक्रवार', 'shukravaar', 'Friday', 'time'],
  ['शनिवार', 'shanivaar', 'Saturday', 'time'],
  ['रविवार', 'ravivaar', 'Sunday', 'time'],

  /* ====================== places and outdoors =========================== */
  ['बाज़ार', 'baazaar', 'market', 'places'],
  ['दुकान', 'dukaan', 'shop', 'places'],
  ['मंदिर', 'mandir', 'temple', 'places'],
  ['गुरुद्वारा', 'gurudwaara', 'gurdwara', 'places'],
  ['मस्जिद', 'masjid', 'mosque', 'places'],
  ['गिरजाघर', 'girjaaghar', 'church', 'places'],
  ['अस्पताल', 'aspataal', 'hospital', 'places'],
  ['पार्क', 'paark', 'park', 'places'],
  ['सड़क', 'sadak', 'road', 'places'],
  ['गली', 'gali', 'lane', 'places'],
  ['शहर', 'shahar', 'city', 'places'],
  ['गाँव', 'gaanv', 'village', 'places'],
  ['देश', 'desh', 'country', 'places'],
  ['खेत', 'khet', 'field', 'places'],
  ['कुआँ', 'kuaan', 'well', 'places'],
  ['स्टेशन', 'steshan', 'station', 'places'],
  ['नदी', 'nadi', 'river', 'places'],
  ['पहाड़', 'pahaad', 'mountain', 'places'],
  ['समुद्र', 'samudra', 'sea', 'places'],
  ['जंगल', 'jangal', 'forest', 'places'],
  ['झील', 'jheel', 'lake', 'places'],
  ['पुल', 'pul', 'bridge', 'places'],
  ['किला', 'kila', 'fort', 'places'],
  ['मेला', 'mela', 'fair', 'places'],
  ['पेड़', 'ped', 'tree', 'places'],
  ['फूल', 'phool', 'flower', 'places'],
  ['पत्ता', 'patta', 'leaf', 'places'],
  ['घास', 'ghaas', 'grass', 'places'],
  ['मिट्टी', 'mitti', 'soil', 'places'],

  /* ========================== getting around ============================ */
  ['गाड़ी', 'gaadi', 'car', 'transport'],
  ['बस', 'bas', 'bus', 'transport'],
  ['ट्रेन', 'tren', 'train', 'transport'],
  ['रेलगाड़ी', 'relgaadi', 'railway train', 'transport'],
  ['साइकिल', 'saaikil', 'bicycle', 'transport'],
  ['रिक्शा', 'riksha', 'rickshaw', 'transport'],
  ['नाव', 'naav', 'boat', 'transport'],
  ['स्कूटर', 'skootar', 'scooter', 'transport'],
  ['जहाज़', 'jahaaz', 'ship', 'transport'],
  ['हवाई जहाज़', 'havaai jahaaz', 'aeroplane', 'transport'],
  ['टिकट', 'tikat', 'ticket', 'transport'],
  ['पहिया', 'pahiya', 'wheel', 'transport'],
  ['सफ़र', 'safar', 'journey', 'transport'],
  ['रास्ता', 'raasta', 'the way, the path', 'transport'],
  ['ट्रक', 'trak', 'lorry', 'transport'],

  /* ============================ feelings ================================ */
  ['उदास', 'udaas', 'sad', 'feelings'],
  ['गुस्सा', 'gussa', 'anger', 'feelings'],
  ['डर', 'dar', 'fear', 'feelings'],
  ['हँसी', 'hansi', 'laughter', 'feelings'],
  ['आँसू', 'aansoo', 'tears', 'feelings'],
  ['थका', 'thaka', 'tired', 'feelings'],
  ['प्यासा', 'pyaasa', 'thirsty', 'feelings'],
  ['बीमार', 'beemaar', 'ill', 'feelings'],
  ['मज़ा', 'maza', 'fun', 'feelings'],
  ['शर्म', 'sharm', 'shyness', 'feelings'],
  ['अकेला', 'akela', 'alone', 'feelings'],
  ['दर्द', 'dard', 'pain', 'feelings'],
  ['नींद', 'neend', 'sleep, sleepiness', 'feelings'],
  ['खुशी', 'khushi', 'happiness', 'feelings'],
  ['हिम्मत', 'himmat', 'courage', 'feelings'],
  ['शांत', 'shaant', 'calm', 'feelings'],
  ['दया', 'daya', 'kindness', 'feelings'],
  ['आराम', 'aaraam', 'rest', 'feelings']
]);

/* ---- Hindi stages 4, 5 and 6 -------------------------------------------
   These three stages are the ones a lexicon alone cannot carry, so they are
   authored rather than derived.

   NO AUDIO KEYS LIVE HERE, deliberately. A sentence is read, not played;
   the words inside it already have voice. Every item carries `lex`, the
   lexicon words it is built from, so the scheduler can hold a sentence back
   until the child has met its words — and so a broken reference is a test
   failure rather than a silent hole.

   Each item holds the sentence AND its meaning. A generator decides what is
   shown: never render `en` or `roman` beside the answer in a drill. */

function hiSentences(rows) {   /* [id, grammar point, devanagari, roman, english, lex] */
  var out = [], i;
  for (i = 0; i < rows.length; i++) {
    out.push({ id: rows[i][0], point: rows[i][1], hi: rows[i][2], roman: rows[i][3], en: rows[i][4], lex: rows[i][5] });
  }
  return out;
}
function hiTurns(rows) {       /* [id, scene, who, devanagari, roman, english, lex] */
  var out = [], i;
  for (i = 0; i < rows.length; i++) {
    out.push({ id: rows[i][0], scene: rows[i][1], who: rows[i][2], hi: rows[i][3], roman: rows[i][4], en: rows[i][5], lex: rows[i][6] });
  }
  return out;
}
function hiPassages(rows) {    /* [id, devanagari, roman, english, lex] */
  var out = [], i;
  for (i = 0; i < rows.length; i++) {
    out.push({ id: rows[i][0], kind: 'passage', hi: rows[i][1], roman: rows[i][2], en: rows[i][3], lex: rows[i][4] });
  }
  return out;
}
/* Conjunct items are DERIVED from the script module so the two can never
   drift; the script module owns the glyph, the stage owns the sequence. */
function conjunctItems(script) {
  var out = [], i, c;
  for (i = 0; i < script.hardConjuncts.length; i++) {
    c = script.hardConjuncts[i];
    out.push({ id: 'cj-' + c.name, kind: 'conjunct', hi: c.char, parts: c.parts, roman: c.name, word: c.word });
  }
  return out;
}

/* Stage 4 — Vakya. Hindi puts the verb last, marks the object with a little
   word AFTER it rather than a preposition before it, and agrees the verb
   with gender. Those three facts are the whole stage, met one sentence at a
   time. */
var HI_S4 = hiSentences([
  /* this is that: the copula, and the two genders of "my" */
  ['s4-01', 'copula', 'यह घर है।', 'yah ghar hai.', 'This is a house.', ['यह', 'घर', 'है']],
  ['s4-02', 'copula', 'वह किताब है।', 'vah kitaab hai.', 'That is a book.', ['वह', 'किताब', 'है']],
  ['s4-03', 'copula', 'यह मेरा भाई है।', 'yah mera bhai hai.', 'This is my brother.', ['मेरा', 'भाई', 'है']],
  ['s4-04', 'gender', 'वह मेरी माँ है।', 'vah meri maa hai.', 'That is my mother.', ['मेरा', 'माँ', 'है']],
  ['s4-05', 'gender', 'यह मेरी बहन है।', 'yah meri bahan hai.', 'This is my sister.', ['मेरा', 'बहन', 'है']],
  ['s4-06', 'copula', 'यह लाल फूल है।', 'yah laal phool hai.', 'This is a red flower.', ['लाल', 'फूल', 'है']],
  ['s4-07', 'plural', 'वे बच्चे हैं।', 've bachche hain.', 'They are children.', ['वे', 'बच्चा', 'हैं']],
  ['s4-08', 'copula', 'मैं बच्चा हूँ।', 'main bachcha hoon.', 'I am a child.', ['मैं', 'बच्चा', 'हूँ']],
  ['s4-09', 'copula', 'तुम मेरे दोस्त हो।', 'tum mere dost ho.', 'You are my friend.', ['तुम', 'दोस्त', 'हो']],
  ['s4-10', 'respect', 'आप मेरे नाना हैं।', 'aap mere nana hain.', 'You are my grandfather.', ['आप', 'नाना', 'हैं']],

  /* subject, object, verb — in that order, every time */
  ['s4-11', 'sov', 'मैं रोटी खाता हूँ।', 'main roti khaata hoon.', 'I eat roti.', ['मैं', 'रोटी', 'खाना']],
  ['s4-12', 'sov', 'मैं दूध पीता हूँ।', 'main doodh peeta hoon.', 'I drink milk.', ['मैं', 'दूध', 'पीना']],
  ['s4-13', 'gender', 'बहन चाय पीती है।', 'bahan chai peeti hai.', 'My sister drinks tea.', ['बहन', 'चाय', 'पीना']],
  ['s4-14', 'sov', 'दादी कहानी सुनती हैं।', 'dadi kahaani sunti hain.', 'Grandmother listens to a story.', ['दादी', 'कहानी', 'सुनना']],
  ['s4-15', 'sov', 'भाई किताब पढ़ता है।', 'bhai kitaab padhta hai.', 'My brother reads a book.', ['भाई', 'किताब', 'पढ़ना']],
  ['s4-16', 'sov', 'माँ खाना बनाती है।', 'maa khaana banaati hai.', 'Mother makes the food.', ['माँ', 'खाना', 'बनाना']],
  ['s4-17', 'sov', 'पापा बाज़ार जाते हैं।', 'papa baazaar jaate hain.', 'Father goes to the market.', ['पापा', 'बाज़ार', 'जाना']],
  ['s4-18', 'sov', 'दादा किताब पढ़ते हैं।', 'dada kitaab padhte hain.', 'Grandfather reads a book.', ['दादा', 'किताब', 'पढ़ना']],
  ['s4-19', 'sov', 'बिल्ली दूध पीती है।', 'billi doodh peeti hai.', 'The cat drinks milk.', ['बिल्ली', 'दूध', 'पीना']],
  ['s4-20', 'sov', 'बच्चे गाना गाते हैं।', 'bachche gaana gaate hain.', 'The children sing a song.', ['बच्चा', 'गाना']],

  /* the little words that come AFTER, not before */
  ['s4-21', 'postposition', 'बिल्ली मेज़ पर है।', 'billi mez par hai.', 'The cat is on the table.', ['बिल्ली', 'मेज़', 'पर']],
  ['s4-22', 'postposition', 'किताब बस्ते में है।', 'kitaab baste mein hai.', 'The book is in the school bag.', ['किताब', 'बस्ता', 'में']],
  ['s4-23', 'postposition', 'कुत्ता घर के बाहर है।', 'kutta ghar ke baahar hai.', 'The dog is outside the house.', ['कुत्ता', 'घर', 'बाहर']],
  ['s4-24', 'postposition', 'चम्मच थाली के पास है।', 'chammach thaali ke paas hai.', 'The spoon is next to the plate.', ['चम्मच', 'थाली', 'पास']],
  ['s4-25', 'postposition', 'हम स्कूल से आए।', 'ham skool se aae.', 'We came from school.', ['हम', 'स्कूल', 'से']],
  ['s4-26', 'postposition', 'माँ को पानी दो।', 'maa ko paani do.', 'Give mother some water.', ['माँ', 'को', 'पानी']],
  ['s4-27', 'postposition', 'चम्मच से खाओ।', 'chammach se khaao.', 'Eat with a spoon.', ['चम्मच', 'से', 'खाना']],
  ['s4-28', 'possession', 'यह पापा की गाड़ी है।', 'yah papa ki gaadi hai.', 'This is father’s car.', ['पापा', 'का', 'गाड़ी']],
  ['s4-29', 'possession', 'यह दादी का चश्मा है।', 'yah dadi ka chashma hai.', 'These are grandmother’s glasses.', ['दादी', 'का', 'चश्मा']],
  ['s4-30', 'possession', 'मेरे पास दो केले हैं।', 'mere paas do kele hain.', 'I have two bananas.', ['मेरा', 'पास', 'केला']],

  /* asking, and saying no */
  ['s4-31', 'question', 'तुम कहाँ हो?', 'tum kahaan ho?', 'Where are you?', ['तुम', 'कहाँ', 'हो']],
  ['s4-32', 'question', 'यह क्या है?', 'yah kya hai?', 'What is this?', ['यह', 'क्या', 'है']],
  ['s4-33', 'question', 'वह कौन है?', 'vah kaun hai?', 'Who is that?', ['वह', 'कौन', 'है']],
  ['s4-34', 'question', 'तुम्हारा नाम क्या है?', 'tumhaara naam kya hai?', 'What is your name?', ['तुम्हारा', 'नाम', 'क्या']],
  ['s4-35', 'question', 'आप कैसे हैं?', 'aap kaise hain?', 'How are you?', ['आप', 'कैसे', 'हैं']],
  ['s4-36', 'question', 'हम कब जाएँगे?', 'ham kab jaaenge?', 'When will we go?', ['हम', 'कब', 'जाना']],
  ['s4-37', 'question', 'कितने बच्चे हैं?', 'kitne bachche hain?', 'How many children are there?', ['कितना', 'बच्चा', 'हैं']],
  ['s4-38', 'negation', 'मुझे भूख नहीं है।', 'mujhe bhookh nahin hai.', 'I am not hungry.', ['नहीं', 'है', 'भूखा']],
  ['s4-39', 'negation', 'मैं आज स्कूल नहीं जाऊँगा।', 'main aaj skool nahin jaaoonga.', 'I will not go to school today.', ['आज', 'स्कूल', 'नहीं']],
  ['s4-40', 'negation', 'यह मेरा नहीं है।', 'yah mera nahin hai.', 'This is not mine.', ['यह', 'मेरा', 'नहीं']],

  /* was, is, will be */
  ['s4-41', 'tense-present', 'मैं गाना गाता हूँ।', 'main gaana gaata hoon.', 'I sing a song.', ['मैं', 'गाना', 'हूँ']],
  ['s4-42', 'tense-present', 'भाई सो रहा है।', 'bhai so raha hai.', 'My brother is sleeping.', ['भाई', 'सोना', 'है']],
  ['s4-43', 'tense-present', 'बच्चे खेल रहे हैं।', 'bachche khel rahe hain.', 'The children are playing.', ['बच्चा', 'खेलना', 'हैं']],
  ['s4-44', 'tense-present', 'मैं किताब पढ़ रही हूँ।', 'main kitaab padh rahi hoon.', 'I am reading a book.', ['किताब', 'पढ़ना', 'हूँ']],
  ['s4-45', 'tense-past', 'मैंने दूध पिया।', 'maine doodh piya.', 'I drank the milk.', ['मैं', 'दूध', 'पीना']],
  ['s4-46', 'tense-past', 'दादी ने खीर बनाई।', 'dadi ne kheer banaai.', 'Grandmother made kheer.', ['दादी', 'खीर', 'बनाना']],
  ['s4-47', 'tense-past', 'कल बारिश हुई।', 'kal baarish hui.', 'It rained yesterday.', ['कल', 'बारिश']],
  ['s4-48', 'tense-past', 'मैं कल स्कूल गया था।', 'main kal skool gaya tha.', 'I went to school yesterday.', ['कल', 'स्कूल', 'था']],
  ['s4-49', 'tense-future', 'कल हम मंदिर जाएँगे।', 'kal ham mandir jaaenge.', 'Tomorrow we will go to the temple.', ['कल', 'मंदिर', 'जाना']],
  ['s4-50', 'tense-future', 'शाम को दोस्त आएँगे।', 'shaam ko dost aaenge.', 'My friends will come in the evening.', ['शाम', 'दोस्त', 'आना']],

  /* telling somebody to do something, gently */
  ['s4-51', 'imperative', 'दरवाज़ा खोलो।', 'darwaaza kholo.', 'Open the door.', ['दरवाज़ा', 'खोलना']],
  ['s4-52', 'imperative', 'जल्दी आओ।', 'jaldi aao.', 'Come quickly.', ['जल्दी', 'आना']],
  ['s4-53', 'imperative', 'यहाँ बैठो।', 'yahaan baitho.', 'Sit here.', ['यहाँ', 'बैठना']],
  ['s4-54', 'imperative', 'धीरे बोलो।', 'dheere bolo.', 'Speak softly.', ['धीरे', 'बोलना']],
  ['s4-55', 'imperative', 'हाथ धो लो।', 'haath dho lo.', 'Wash your hands.', ['हाथ', 'धोना']],
  ['s4-56', 'imperative', 'जूते बाहर रखो।', 'joote baahar rakho.', 'Leave your shoes outside.', ['जूता', 'बाहर', 'रखना']],
  ['s4-57', 'request', 'कृपया पानी दीजिए।', 'kripya paani deejiye.', 'Please give me some water.', ['कृपया', 'पानी', 'देना']],
  ['s4-58', 'request', 'मुझे किताब चाहिए।', 'mujhe kitaab chaahiye.', 'I want the book.', ['किताब', 'चाहिए']],

  /* describing, and agreeing the adjective */
  ['s4-59', 'agreement', 'यह आम मीठा है।', 'yah aam meetha hai.', 'This mango is sweet.', ['आम', 'मीठा', 'है']],
  ['s4-60', 'agreement', 'चाय गरम है।', 'chai garam hai.', 'The tea is hot.', ['चाय', 'गरम', 'है']],
  ['s4-61', 'agreement', 'पानी ठंडा है।', 'paani thanda hai.', 'The water is cold.', ['पानी', 'ठंडा', 'है']],
  ['s4-62', 'agreement', 'मेरी कमीज़ नीली है।', 'meri kameez neeli hai.', 'My shirt is blue.', ['कमीज़', 'नीला', 'है']],
  ['s4-63', 'agreement', 'यह किताब नई है।', 'yah kitaab nai hai.', 'This book is new.', ['किताब', 'नया', 'है']],
  ['s4-64', 'agreement', 'हाथी बड़ा है, चूहा छोटा है।', 'haathi bada hai, chooha chhota hai.', 'The elephant is big, the mouse is small.', ['हाथी', 'बड़ा', 'छोटा']],
  ['s4-65', 'agreement', 'आज मौसम अच्छा है।', 'aaj mausam achchha hai.', 'The weather is good today.', ['आज', 'मौसम', 'अच्छा']],
  ['s4-66', 'quantity', 'थोड़ा दूध और चाहिए।', 'thoda doodh aur chaahiye.', 'I want a little more milk.', ['थोड़ा', 'दूध', 'चाहिए']],
  ['s4-67', 'quantity', 'तीन बिल्लियाँ छत पर हैं।', 'teen billiyaan chhat par hain.', 'Three cats are on the roof.', ['तीन', 'बिल्ली', 'छत']],
  ['s4-68', 'quantity', 'सब बच्चे बगीचे में हैं।', 'sab bachche bageeche mein hain.', 'All the children are in the garden.', ['सब', 'बच्चा', 'बगीचा']],

  /* PHASE C — the thin points, filled. `gender` had three sentences and `respect` had
     ONE, which is not enough to teach either and nowhere near enough for the SRS to
     schedule. Respect in particular is the point this whole app exists to get right: a
     diaspora child speaking to their nani has one English word, "you", and three Hindi
     ones to choose between. These are tied to the scenes where the choice actually
     bites — the phone call to nani, and greeting an elder at the door.

     Craft rules unchanged (docs/09 §4): 3-10 words, present-day, a child of 6-10 says or
     hears each of these at home, elders always take आप and the honorific plural. */

  /* respect — आप, and the plural verb that comes with it */
  ['s4-69', 'respect', 'आप कैसे हैं?', 'aap kaise hain?', 'How are you? (to an elder)', ['आप', 'कैसा', 'है']],
  ['s4-70', 'respect', 'नानी, आप कहाँ हैं?', 'nani, aap kahan hain?', 'Nani, where are you?', ['आप', 'कहाँ', 'है']],
  ['s4-71', 'respect', 'आप मेरी नानी हैं।', 'aap meri nani hain.', 'You are my grandmother.', ['आप', 'मेरा', 'है']],
  ['s4-72', 'respect', 'दादा जी आ रहे हैं।', 'dada ji aa rahe hain.', 'Grandfather is coming.', ['दादा', 'आना', 'है']],
  ['s4-73', 'respect', 'आप बैठिए।', 'aap baithiye.', 'Please sit down. (to an elder)', ['आप', 'बैठना']],
  ['s4-74', 'respect', 'आप चाय लीजिए।', 'aap chai leejiye.', 'Please have some tea.', ['आप', 'चाय', 'लेना']],
  ['s4-75', 'respect', 'तुम कहाँ जा रहे हो?', 'tum kahan ja rahe ho?', 'Where are you going? (to a friend)', ['तुम', 'कहाँ', 'जाना']],
  ['s4-76', 'respect', 'तुम मेरे दोस्त हो।', 'tum mere dost ho.', 'You are my friend.', ['तुम', 'मेरा', 'दोस्त']],
  ['s4-77', 'respect', 'मम्मी, आप सुन रही हैं?', 'mummy, aap sun rahi hain?', 'Mummy, are you listening?', ['आप', 'सुनना']],
  ['s4-78', 'respect', 'आप क्या कह रहे हैं?', 'aap kya keh rahe hain?', 'What are you saying? (to an elder)', ['आप', 'क्या', 'कहना']],
  ['s4-79', 'respect', 'नाना जी, आपका नाम क्या है?', 'nana ji, aapka naam kya hai?', 'Nana, what is your name?', ['नाना', 'नाम', 'क्या']],
  ['s4-80', 'respect', 'तुम्हारा बस्ता कहाँ है?', 'tumhara basta kahan hai?', 'Where is your school bag? (to a friend)', ['तुम', 'बस्ता', 'कहाँ']],
  ['s4-81', 'respect', 'आप आराम कीजिए।', 'aap aaraam keejiye.', 'Please rest. (to an elder)', ['आप', 'आराम']],
  ['s4-82', 'respect', 'दीदी, तुम आओगी?', 'didi, tum aaogi?', 'Didi, will you come?', ['तुम', 'आना']],

  /* gender — the thing that has to be learned WITH the noun, so each of these pairs a
     noun with a word that visibly changes to match it */
  ['s4-83', 'gender', 'यह मेरी किताब है।', 'yah meri kitaab hai.', 'This is my book.', ['मेरा', 'किताब', 'है']],
  ['s4-84', 'gender', 'यह मेरा बस्ता है।', 'yah mera basta hai.', 'This is my school bag.', ['मेरा', 'बस्ता', 'है']],
  ['s4-85', 'gender', 'मेरी बिल्ली छोटी है।', 'meri billi chhoti hai.', 'My cat is small.', ['मेरा', 'बिल्ली', 'छोटा']],
  ['s4-86', 'gender', 'मेरा कुत्ता बड़ा है।', 'mera kutta bada hai.', 'My dog is big.', ['मेरा', 'कुत्ता', 'बड़ा']],
  ['s4-87', 'gender', 'रोटी गरम है।', 'roti garam hai.', 'The roti is hot.', ['रोटी', 'गरम', 'है']],
  ['s4-88', 'gender', 'दूध ठंडा है।', 'doodh thanda hai.', 'The milk is cold.', ['दूध', 'ठंडा', 'है']],
  ['s4-89', 'gender', 'यह चिड़िया छोटी है।', 'yah chidiya chhoti hai.', 'This bird is small.', ['चिड़िया', 'छोटा']],
  ['s4-90', 'gender', 'वह पेड़ बड़ा है।', 'vah ped bada hai.', 'That tree is big.', ['पेड़', 'बड़ा', 'है']],
  ['s4-91', 'gender', 'मेरी माँ गाना गाती है।', 'meri maa gaana gaati hai.', 'My mother sings a song.', ['माँ', 'गाना', 'गाना']],
  ['s4-92', 'gender', 'मेरा भाई गाना गाता है।', 'mera bhai gaana gaata hai.', 'My brother sings a song.', ['भाई', 'गाना', 'गाना']],
  ['s4-93', 'gender', 'बहन स्कूल जाती है।', 'bahan school jaati hai.', 'My sister goes to school.', ['बहन', 'जाना']],
  ['s4-94', 'gender', 'भाई स्कूल जाता है।', 'bhai school jaata hai.', 'My brother goes to school.', ['भाई', 'जाना']],
  ['s4-95', 'gender', 'यह गली छोटी है।', 'yah gali chhoti hai.', 'This lane is narrow.', ['गली', 'छोटा']],
  ['s4-96', 'gender', 'यह घर बड़ा है।', 'yah ghar bada hai.', 'This house is big.', ['घर', 'बड़ा', 'है']],
  ['s4-97', 'gender', 'चाय मीठी है।', 'chai meethi hai.', 'The tea is sweet.', ['चाय', 'मीठा', 'है']],
  ['s4-98', 'gender', 'आम मीठा है।', 'aam meetha hai.', 'The mango is sweet.', ['आम', 'मीठा', 'है']],
  ['s4-99', 'gender', 'मेरी दादी कहानी सुनाती हैं।', 'meri dadi kahani sunaati hain.', 'My grandmother tells a story.', ['दादी', 'कहानी']],

  /* plural — one sentence was not a point either */
  ['s4-100', 'plural', 'दो लड़के खेल रहे हैं।', 'do ladke khel rahe hain.', 'Two boys are playing.', ['दो', 'लड़का', 'खेलना']],
  ['s4-101', 'plural', 'तीन लड़कियाँ गा रही हैं।', 'teen ladkiyan ga rahi hain.', 'Three girls are singing.', ['तीन', 'लड़की', 'गाना']],
  ['s4-102', 'plural', 'मेरी दो बहनें हैं।', 'meri do bahanein hain.', 'I have two sisters.', ['दो', 'बहन', 'है']],
  ['s4-103', 'plural', 'बहुत सारी किताबें हैं।', 'bahut saari kitaabein hain.', 'There are many books.', ['बहुत', 'किताब', 'है']]
]);

/* Stage 5 — Baat-cheet. Sunday’s video call, the dinner table, the shop.
   Real exchanges in the order they happen, so a child can follow a whole
   one and then take a turn in it. */
var HI_S5 = hiTurns([
  /* the call to Nani — the reason most of these children are here at all */
  ['s5-01', 'phone-to-nani', 'elder', 'नमस्ते बेटा! कैसे हो?', 'namaste beta! kaise ho?', 'Hello, love! How are you?', ['नमस्ते', 'बेटा', 'कैसे']],
  ['s5-02', 'phone-to-nani', 'child', 'नमस्ते नानी! मैं ठीक हूँ।', 'namaste nani! main theek hoon.', 'Hello Nani! I am fine.', ['नानी', 'ठीक', 'हूँ']],
  ['s5-03', 'phone-to-nani', 'elder', 'स्कूल कैसा चल रहा है?', 'skool kaisa chal raha hai?', 'How is school going?', ['स्कूल', 'कैसे', 'चलना']],
  ['s5-04', 'phone-to-nani', 'child', 'अच्छा चल रहा है।', 'achchha chal raha hai.', 'It is going well.', ['अच्छा', 'चलना']],
  ['s5-05', 'phone-to-nani', 'elder', 'आज क्या खाया?', 'aaj kya khaaya?', 'What did you eat today?', ['आज', 'क्या', 'खाना']],
  ['s5-06', 'phone-to-nani', 'child', 'मैंने रोटी और दाल खाई।', 'maine roti aur daal khaai.', 'I ate roti and daal.', ['रोटी', 'और', 'दाल']],
  ['s5-07', 'phone-to-nani', 'elder', 'नाना को भी नमस्ते कहो।', 'nana ko bhi namaste kaho.', 'Say hello to Nana too.', ['नाना', 'भी', 'कहना']],
  ['s5-08', 'phone-to-nani', 'child', 'नाना, आप कैसे हैं?', 'nana, aap kaise hain?', 'Nana, how are you?', ['नाना', 'आप', 'कैसे']],
  ['s5-09', 'phone-to-nani', 'elder', 'तुम्हारी बहुत याद आती है।', 'tumhaari bahut yaad aati hai.', 'We miss you a lot.', ['बहुत', 'याद', 'आना']],
  ['s5-10', 'phone-to-nani', 'child', 'मुझे भी आपकी याद आती है।', 'mujhe bhi aapki yaad aati hai.', 'I miss you too.', ['भी', 'आपका', 'याद']],
  ['s5-11', 'phone-to-nani', 'child', 'हम गर्मी में आएँगे।', 'ham garmi mein aaenge.', 'We will come in the summer.', ['हम', 'गर्मी', 'आना']],
  ['s5-12', 'phone-to-nani', 'elder', 'फिर मिलेंगे, बेटा।', 'phir milenge, beta.', 'See you again, love.', ['फिर मिलेंगे', 'बेटा']],

  /* greeting the grown-ups in the room */
  ['s5-13', 'greeting-elders', 'child', 'नमस्ते दादी।', 'namaste dadi.', 'Hello, Dadi.', ['नमस्ते', 'दादी']],
  ['s5-14', 'greeting-elders', 'elder', 'खुश रहो, बेटा।', 'khush raho, beta.', 'Be happy, love.', ['खुश', 'रहना', 'बेटा']],
  ['s5-15', 'greeting-elders', 'child', 'प्रणाम, दादा जी।', 'pranaam, dada ji.', 'Pranaam, Dada ji.', ['प्रणाम', 'दादा', 'जी']],
  ['s5-16', 'greeting-elders', 'elder', 'आओ, यहाँ बैठो।', 'aao, yahaan baitho.', 'Come, sit here.', ['आना', 'यहाँ', 'बैठना']],
  ['s5-17', 'greeting-elders', 'child', 'आप कैसे हैं?', 'aap kaise hain?', 'How are you?', ['आप', 'कैसे', 'हैं']],
  ['s5-18', 'greeting-elders', 'elder', 'मैं ठीक हूँ, बेटा।', 'main theek hoon, beta.', 'I am well, love.', ['ठीक', 'हूँ', 'बेटा']],

  /* at the table */
  ['s5-19', 'at-the-table', 'elder', 'खाना तैयार है, आ जाओ।', 'khaana taiyaar hai, aa jaao.', 'The food is ready, come along.', ['खाना', 'तैयार', 'आना']],
  ['s5-20', 'at-the-table', 'elder', 'पहले हाथ धो लो।', 'pehle haath dho lo.', 'Wash your hands first.', ['पहला', 'हाथ', 'धोना']],
  ['s5-21', 'at-the-table', 'child', 'मैंने हाथ धो लिए।', 'maine haath dho liye.', 'I have washed my hands.', ['हाथ', 'धोना']],
  ['s5-22', 'at-the-table', 'child', 'मुझे बहुत भूख लगी है।', 'mujhe bahut bhookh lagi hai.', 'I am very hungry.', ['बहुत', 'भूखा']],
  ['s5-23', 'at-the-table', 'child', 'थोड़ा और चावल दीजिए।', 'thoda aur chaawal deejiye.', 'A little more rice please.', ['थोड़ा', 'चावल', 'देना']],
  ['s5-24', 'at-the-table', 'elder', 'और रोटी लोगे?', 'aur roti loge?', 'Will you have more roti?', ['और', 'रोटी', 'लेना']],
  ['s5-25', 'at-the-table', 'child', 'नहीं, बस। धन्यवाद।', 'nahin, bas. dhanyavaad.', 'No, that is enough. Thank you.', ['नहीं', 'धन्यवाद']],
  ['s5-26', 'at-the-table', 'child', 'पानी कहाँ है?', 'paani kahaan hai?', 'Where is the water?', ['पानी', 'कहाँ', 'है']],
  ['s5-27', 'at-the-table', 'elder', 'गिलास मेज़ पर है।', 'gilaas mez par hai.', 'The glass is on the table.', ['गिलास', 'मेज़', 'पर']],
  ['s5-28', 'at-the-table', 'child', 'खाना बहुत अच्छा है।', 'khaana bahut achchha hai.', 'The food is very good.', ['खाना', 'बहुत', 'अच्छा']],

  /* asking for something */
  ['s5-29', 'asking-for-something', 'child', 'क्या मैं बाहर खेल सकता हूँ?', 'kya main baahar khel sakta hoon?', 'May I play outside?', ['बाहर', 'खेलना', 'सकना']],
  ['s5-30', 'asking-for-something', 'elder', 'हाँ, लेकिन जल्दी आना।', 'haan, lekin jaldi aana.', 'Yes, but come back soon.', ['हाँ', 'लेकिन', 'जल्दी']],
  ['s5-31', 'asking-for-something', 'child', 'मुझे पानी चाहिए, कृपया।', 'mujhe paani chaahiye, kripya.', 'I would like some water, please.', ['पानी', 'चाहिए', 'कृपया']],
  ['s5-32', 'asking-for-something', 'child', 'क्या आप मेरी मदद करेंगे?', 'kya aap meri madad karenge?', 'Will you help me?', ['आप', 'मदद', 'करना']],
  ['s5-33', 'asking-for-something', 'elder', 'हाँ बेटा, अभी करता हूँ।', 'haan beta, abhi karta hoon.', 'Yes, love, I will do it now.', ['हाँ', 'बेटा', 'करना']],
  ['s5-34', 'asking-for-something', 'child', 'मुझे एक कहानी सुनाइए।', 'mujhe ek kahaani sunaaiye.', 'Tell me a story, please.', ['एक', 'कहानी', 'सुनना']],

  /* answering a grown-up you have just met */
  ['s5-35', 'answering-a-grown-up', 'elder', 'तुम्हारा नाम क्या है?', 'tumhaara naam kya hai?', 'What is your name?', ['तुम्हारा', 'नाम', 'क्या']],
  ['s5-36', 'answering-a-grown-up', 'child', 'मेरा नाम मीरा है।', 'mera naam Meera hai.', 'My name is Meera.', ['मेरा', 'नाम', 'है']],
  ['s5-37', 'answering-a-grown-up', 'elder', 'तुम्हारी उम्र कितनी है?', 'tumhaari umr kitni hai?', 'How old are you?', ['उम्र', 'कितना']],
  ['s5-38', 'answering-a-grown-up', 'child', 'मैं सात साल की हूँ।', 'main saat saal ki hoon.', 'I am seven years old.', ['सात', 'साल', 'हूँ']],
  ['s5-39', 'answering-a-grown-up', 'elder', 'घर में कौन-कौन है?', 'ghar mein kaun-kaun hai?', 'Who is at home?', ['घर', 'में', 'कौन']],
  ['s5-40', 'answering-a-grown-up', 'child', 'माँ, पापा और मेरा भाई।', 'maa, papa aur mera bhai.', 'Mum, Dad and my brother.', ['माँ', 'पापा', 'भाई']],
  ['s5-41', 'answering-a-grown-up', 'elder', 'तुम्हें क्या पसंद है?', 'tumhen kya pasand hai?', 'What do you like?', ['क्या', 'पसंद', 'है']],
  ['s5-42', 'answering-a-grown-up', 'child', 'मुझे मिठाई पसंद है।', 'mujhe mithai pasand hai.', 'I like sweets.', ['मिठाई', 'पसंद', 'है']],

  /* at school */
  ['s5-43', 'at-school', 'elder', 'सब बैठ जाओ।', 'sab baith jaao.', 'Everyone sit down.', ['सब', 'बैठना']],
  ['s5-44', 'at-school', 'child', 'मैं आ गया।', 'main aa gaya.', 'I am here.', ['मैं', 'आना']],
  ['s5-45', 'at-school', 'elder', 'किताब खोलो।', 'kitaab kholo.', 'Open your book.', ['किताब', 'खोलना']],
  ['s5-46', 'at-school', 'child', 'मुझे समझ नहीं आया।', 'mujhe samajh nahin aaya.', 'I did not understand.', ['समझना', 'नहीं']],
  ['s5-47', 'at-school', 'elder', 'फिर से सुनो।', 'phir se suno.', 'Listen once more.', ['फिर', 'से', 'सुनना']],
  ['s5-48', 'at-school', 'child', 'यह शब्द कैसे पढ़ते हैं?', 'yah shabd kaise padhte hain?', 'How do you read this word?', ['शब्द', 'कैसे', 'पढ़ना']],
  ['s5-49', 'at-school', 'elder', 'बहुत अच्छे!', 'bahut achchhe!', 'Very good!', ['बहुत', 'अच्छा']],

  /* the shop */
  ['s5-50', 'the-market', 'child', 'यह कितने का है?', 'yah kitne ka hai?', 'How much is this?', ['यह', 'कितना', 'का']],
  ['s5-51', 'the-market', 'elder', 'दस रुपये।', 'das rupaye.', 'Ten rupees.', ['दस', 'रुपया']],
  ['s5-52', 'the-market', 'child', 'मुझे दो केले चाहिए।', 'mujhe do kele chaahiye.', 'I would like two bananas.', ['दो', 'केला', 'चाहिए']],
  ['s5-53', 'the-market', 'elder', 'और कुछ?', 'aur kuchh?', 'Anything else?', ['और', 'कुछ']],
  ['s5-54', 'the-market', 'child', 'नहीं, धन्यवाद।', 'nahin, dhanyavaad.', 'No, thank you.', ['नहीं', 'धन्यवाद']],
  ['s5-55', 'the-market', 'child', 'क्या आम मीठे हैं?', 'kya aam meethe hain?', 'Are the mangoes sweet?', ['आम', 'मीठा', 'हैं']],

  /* playing with the cousins */
  ['s5-56', 'playing', 'child', 'चलो, खेलते हैं!', 'chalo, khelte hain!', 'Come on, let us play!', ['चलना', 'खेलना']],
  ['s5-57', 'playing', 'child', 'अब मेरी बारी है।', 'ab meri baari hai.', 'It is my turn now.', ['अब', 'बारी', 'है']],
  ['s5-58', 'playing', 'child', 'मुझे भी खेलना है।', 'mujhe bhi khelna hai.', 'I want to play too.', ['भी', 'खेलना']],
  ['s5-59', 'playing', 'child', 'यह खेल बहुत मज़ेदार है।', 'yah khel bahut mazedaar hai.', 'This game is great fun.', ['खेल', 'बहुत', 'मज़ा']],
  ['s5-60', 'playing', 'child', 'मैं थक गया हूँ।', 'main thak gaya hoon.', 'I am tired.', ['थका', 'हूँ']],

  /* a festival at home — whichever one this family keeps */
  ['s5-61', 'at-a-festival', 'elder', 'त्योहार की बधाई!', 'tyohaar ki badhaai!', 'Festival greetings!', ['त्योहार', 'बधाई']],
  ['s5-62', 'at-a-festival', 'child', 'हम दीये जलाएँगे।', 'ham diye jalaaenge.', 'We will light the lamps.', ['दीया', 'जलाना']],
  ['s5-63', 'at-a-festival', 'child', 'मेरे नए कपड़े सुंदर हैं।', 'mere nae kapde sundar hain.', 'My new clothes are beautiful.', ['नया', 'कपड़े', 'सुंदर']],
  ['s5-64', 'at-a-festival', 'elder', 'दादी को प्रणाम करो।', 'dadi ko pranaam karo.', 'Greet Dadi respectfully.', ['दादी', 'को', 'प्रणाम']],

  /* bedtime */
  ['s5-65', 'bedtime', 'elder', 'सोने का समय हो गया।', 'sone ka samay ho gaya.', 'It is time to sleep.', ['सोना', 'समय']],
  ['s5-66', 'bedtime', 'child', 'मुझे नींद आ रही है।', 'mujhe neend aa rahi hai.', 'I am sleepy.', ['नींद', 'आना']],
  ['s5-67', 'bedtime', 'elder', 'आँखें बंद करो।', 'aankhen band karo.', 'Close your eyes.', ['आँख', 'बंद', 'करना']],
  ['s5-68', 'bedtime', 'child', 'शुभ रात्रि, माँ।', 'shubh raatri, maa.', 'Good night, Mum.', ['शुभ रात्रि', 'माँ']],

  /* not feeling well */
  ['s5-69', 'not-well', 'child', 'मेरे पेट में दर्द है।', 'mere pet mein dard hai.', 'My tummy hurts.', ['पेट', 'में', 'दर्द']],
  ['s5-70', 'not-well', 'elder', 'कहाँ दर्द है?', 'kahaan dard hai?', 'Where does it hurt?', ['कहाँ', 'दर्द', 'है']],
  ['s5-71', 'not-well', 'child', 'मुझे बुखार है।', 'mujhe bukhaar hai.', 'I have a fever.', ['बुखार', 'है']],
  ['s5-72', 'not-well', 'elder', 'चलो, थोड़ा आराम करो।', 'chalo, thoda aaraam karo.', 'Come, rest a little.', ['थोड़ा', 'आराम', 'करना']]
]);

/* Stage 6 — Padhna. The conjuncts come from the script module; these are
   the passages a child reads once the conjuncts stop stopping them. Short,
   three or four sentences, and every one of them is somebody’s Tuesday. */
var HI_READ = hiPassages([
  ['read-01', 'मेरा नाम मीरा है। मेरा घर बड़ा है। घर में माँ, पापा और मेरा भाई हैं।',
    'mera naam Meera hai. mera ghar bada hai. ghar mein maa, papa aur mera bhai hain.',
    'My name is Meera. My house is big. In the house are Mum, Dad and my brother.', ['नाम', 'घर', 'भाई']],
  ['read-02', 'आज माँ ने खीर बनाई। खीर बहुत मीठी है। मैंने दो कटोरी खाईं।',
    'aaj maa ne kheer banaai. kheer bahut meethi hai. maine do katori khaaeen.',
    'Today Mum made kheer. The kheer is very sweet. I ate two bowls.', ['खीर', 'मीठा', 'कटोरी']],
  ['read-03', 'बगीचे में एक बिल्ली है। बिल्ली दूध पीती है। कुत्ता उसे देखता है।',
    'bageeche mein ek billi hai. billi doodh peeti hai. kutta use dekhta hai.',
    'There is a cat in the garden. The cat drinks milk. The dog watches her.', ['बगीचा', 'बिल्ली', 'कुत्ता']],
  ['read-04', 'मैं स्कूल जाता हूँ। मेरे बस्ते में किताब और कलम है। मुझे कहानी पढ़ना अच्छा लगता है।',
    'main skool jaata hoon. mere baste mein kitaab aur kalam hai. mujhe kahaani padhna achchha lagta hai.',
    'I go to school. In my bag are a book and a pen. I like reading stories.', ['स्कूल', 'बस्ता', 'कहानी']],
  ['read-05', 'आज बारिश हो रही है। बादल काले हैं। मैंने छाता लिया।',
    'aaj baarish ho rahi hai. baadal kaale hain. maine chhaata liya.',
    'It is raining today. The clouds are black. I took an umbrella.', ['बारिश', 'बादल', 'छाता']],
  ['read-06', 'हर रविवार मैं नानी से बात करता हूँ। नानी बहुत दूर रहती हैं। हम फ़ोन पर साथ हँसते हैं।',
    'har ravivaar main nani se baat karta hoon. nani bahut door rahti hain. ham fon par saath hanste hain.',
    'Every Sunday I talk to Nani. Nani lives very far away. We laugh together on the phone.', ['रविवार', 'बात', 'दूर']],
  ['read-07', 'त्योहार पर घर में दीये जलते हैं। सब नए कपड़े पहनते हैं। दादी सबको मिठाई देती हैं।',
    'tyohaar par ghar mein diye jalte hain. sab nae kapde pahante hain. dadi sabko mithai deti hain.',
    'At the festival the lamps are lit at home. Everyone wears new clothes. Grandmother gives everyone sweets.', ['त्योहार', 'दीया', 'मिठाई']],
  ['read-08', 'पापा और मैं बाज़ार गए। हमने आम और केले लिए। दुकान पर आम बहुत मीठे थे।',
    'papa aur main baazaar gae. hamne aam aur kele liye. dukaan par aam bahut meethe the.',
    'Dad and I went to the market. We took mangoes and bananas. At the shop the mangoes were very sweet.', ['बाज़ार', 'दुकान', 'आम']],
  ['read-09', 'कल मैं बीमार था। मेरे सिर में दर्द था। माँ ने मुझे गरम दूध दिया। अब मैं ठीक हूँ।',
    'kal main beemaar tha. mere sir mein dard tha. maa ne mujhe garam doodh diya. ab main theek hoon.',
    'Yesterday I was ill. My head hurt. Mum gave me warm milk. Now I am fine.', ['बीमार', 'दर्द', 'ठीक']],
  ['read-10', 'हम ट्रेन से गाँव गए। ट्रेन बहुत लंबी थी। खिड़की से हरे खेत दिखते थे।',
    'ham tren se gaanv gae. tren bahut lambi thi. khidki se hare khet dikhte the.',
    'We went to the village by train. The train was very long. Green fields showed through the window.', ['ट्रेन', 'गाँव', 'खेत']],
  ['read-11', 'सोमवार को मेरा जन्मदिन है। मैं आठ साल का हो जाऊँगा। मेरे दोस्त घर आएँगे।',
    'somvaar ko mera janmadin hai. main aath saal ka ho jaaoonga. mere dost ghar aaenge.',
    'My birthday is on Monday. I will turn eight. My friends will come to the house.', ['सोमवार', 'जन्मदिन', 'दोस्त']],
  ['read-12', 'पेड़ पर एक चिड़िया बैठी है। वह गाना गाती है। नीचे घास हरी है।',
    'ped par ek chidiya baithi hai. vah gaana gaati hai. neeche ghaas hari hai.',
    'A bird is sitting in the tree. She sings a song. Below, the grass is green.', ['पेड़', 'चिड़िया', 'घास']]
]);


/* ---- Punjabi ----------------------------------------------------------- */
/* The same shared themes, the same shape, a different script module. This is
   the whole thesis: the diff between these two packs is content only — and
   the fact that Hindi is further along is a content backlog, not a claim
   about either language. Punjabi now fills all seventeen themes — around
   250 words, half of Hindi's depth and closing; stages 4, 5 and 6 still run
   on the derived skeleton until a Punjabi pedagogue writes them. */

var PA_LEX = [
  /* family */
  { word: 'ਮਾਂ',                   roman: 'maa',      en: 'mother',      theme: 'family', audio: 'pa/w-maa' },
  { word: 'ਪਾਪਾ',             roman: 'papa',     en: 'father',      theme: 'family', audio: 'pa/w-papa' },
  { word: 'ਭਰਾ',                   roman: 'bhara',    en: 'brother',     theme: 'family', audio: 'pa/w-bhara' },
  { word: 'ਭੈਣ',                   roman: 'bhain',    en: 'sister',      theme: 'family', audio: 'pa/w-bhain' },
  { word: 'ਦਾਦਾ',             roman: 'dada',     en: 'grandfather (father’s side)', theme: 'family', audio: 'pa/w-dada' },
  { word: 'ਦਾਦੀ',             roman: 'dadi',     en: 'grandmother (father’s side)', theme: 'family', audio: 'pa/w-dadi' },
  { word: 'ਨਾਨਾ',             roman: 'nana',     en: 'grandfather (mother’s side)', theme: 'family', audio: 'pa/w-nana' },
  { word: 'ਨਾਨੀ',             roman: 'nani',     en: 'grandmother (mother’s side)', theme: 'family', audio: 'pa/w-nani' },
  { word: 'ਬੱਚਾ',             roman: 'bachcha',  en: 'child',       theme: 'family', audio: 'pa/w-bachcha' },
  { word: 'ਪਰਿਵਾਰ', roman: 'parivaar', en: 'family',      theme: 'family', audio: 'pa/w-parivaar' },
  /* food */
  { word: 'ਪਾਣੀ',             roman: 'paani',    en: 'water',       theme: 'food', audio: 'pa/w-paani' },
  { word: 'ਰੋਟੀ',             roman: 'roti',     en: 'bread',       theme: 'food', audio: 'pa/w-roti' },
  { word: 'ਦੁੱਧ',             roman: 'dudh',     en: 'milk',        theme: 'food', audio: 'pa/w-dudh' },
  { word: 'ਚੌਲ',                   roman: 'chaul',    en: 'rice',        theme: 'food', audio: 'pa/w-chaul' },
  { word: 'ਦਾਲ',                   roman: 'daal',     en: 'lentils',     theme: 'food', audio: 'pa/w-daal' },
  { word: 'ਅੰਬ',                   roman: 'amb',      en: 'mango',       theme: 'food', audio: 'pa/w-amb' },
  { word: 'ਕੇਲਾ',             roman: 'kela',     en: 'banana',      theme: 'food', audio: 'pa/w-kela' },
  { word: 'ਮਿਠਾਈ',       roman: 'mithai',   en: 'sweets',      theme: 'food', audio: 'pa/w-mithai' },
  { word: 'ਚਾਹ',                   roman: 'chah',     en: 'tea',         theme: 'food', audio: 'pa/w-chah' },
  { word: 'ਲੂਣ',                   roman: 'loon',     en: 'salt',        theme: 'food', audio: 'pa/w-loon' },
  /* body */
  { word: 'ਸਿਰ',                   roman: 'sir',      en: 'head',        theme: 'body', audio: 'pa/w-sir' },
  { word: 'ਅੱਖ',                   roman: 'akkh',     en: 'eye',         theme: 'body', audio: 'pa/w-akkh' },
  { word: 'ਨੱਕ',                   roman: 'nakk',     en: 'nose',        theme: 'body', audio: 'pa/w-nakk' },
  { word: 'ਕੰਨ',                   roman: 'kann',     en: 'ear',         theme: 'body', audio: 'pa/w-kann' },
  { word: 'ਮੂੰਹ',             roman: 'moonh',    en: 'mouth',       theme: 'body', audio: 'pa/w-moonh' },
  { word: 'ਹੱਥ',                   roman: 'hatth',    en: 'hand',        theme: 'body', audio: 'pa/w-hatth' },
  { word: 'ਪੈਰ',                   roman: 'pair',     en: 'foot',        theme: 'body', audio: 'pa/w-pair' },
  { word: 'ਢਿੱਡ',             roman: 'dhidd',    en: 'tummy',       theme: 'body', audio: 'pa/w-dhidd' },
  { word: 'ਵਾਲ',                   roman: 'vaal',     en: 'hair',        theme: 'body', audio: 'pa/w-vaal' },
  { word: 'ਦੰਦ',                   roman: 'dand',     en: 'tooth',       theme: 'body', audio: 'pa/w-dand' },
  /* home */
  { word: 'ਘਰ',                         roman: 'ghar',     en: 'house',       theme: 'home', audio: 'pa/w-ghar' },
  { word: 'ਬੂਹਾ',             roman: 'booha',    en: 'door',        theme: 'home', audio: 'pa/w-booha' },
  { word: 'ਖਿੜਕੀ',       roman: 'khirki',   en: 'window',      theme: 'home', audio: 'pa/w-khirki' },
  { word: 'ਕੁਰਸੀ',       roman: 'kursi',    en: 'chair',       theme: 'home', audio: 'pa/w-kursi' },
  { word: 'ਮੇਜ਼',             roman: 'mez',      en: 'table',       theme: 'home', audio: 'pa/w-mez' },
  { word: 'ਚਾਬੀ',             roman: 'chaabi',   en: 'key',         theme: 'home', audio: 'pa/w-chaabi' },
  { word: 'ਮੰਜਾ',             roman: 'manja',    en: 'bed',         theme: 'home', audio: 'pa/w-manja' },
  { word: 'ਛੱਤ',                   roman: 'chhatt',   en: 'roof',        theme: 'home', audio: 'pa/w-chhatt' },
  { word: 'ਰਸੋਈ',             roman: 'rasoi',    en: 'kitchen',     theme: 'home', audio: 'pa/w-rasoi' },
  /* animals */
  { word: 'ਹਾਥੀ',             roman: 'haathi',   en: 'elephant',    theme: 'animals', audio: 'pa/w-haathi' },
  { word: 'ਕੁੱਤਾ',       roman: 'kutta',    en: 'dog',         theme: 'animals', audio: 'pa/w-kutta' },
  { word: 'ਬਿੱਲੀ',       roman: 'billi',    en: 'cat',         theme: 'animals', audio: 'pa/w-billi' },
  { word: 'ਗਾਂ',                   roman: 'gaan',     en: 'cow',         theme: 'animals', audio: 'pa/w-gaan' },
  { word: 'ਬਾਂਦਰ',       roman: 'baandar',  en: 'monkey',      theme: 'animals', audio: 'pa/w-baandar' },
  { word: 'ਸ਼ੇਰ',             roman: 'sher',     en: 'lion',        theme: 'animals', audio: 'pa/w-sher' },
  { word: 'ਚਿੜੀ',             roman: 'chiri',    en: 'bird',        theme: 'animals', audio: 'pa/w-chiri' },
  { word: 'ਮੱਛੀ',             roman: 'machhi',   en: 'fish',        theme: 'animals', audio: 'pa/w-machhi' },
  { word: 'ਘੋੜਾ',             roman: 'ghora',    en: 'horse',       theme: 'animals', audio: 'pa/w-ghora' },
  { word: 'ਤਿਤਲੀ',       roman: 'titli',    en: 'butterfly',   theme: 'animals', audio: 'pa/w-titli' },
  /* colours */
  { word: 'ਲਾਲ',                   roman: 'laal',     en: 'red',         theme: 'colours', audio: 'pa/w-laal' },
  { word: 'ਨੀਲਾ',             roman: 'neela',    en: 'blue',        theme: 'colours', audio: 'pa/w-neela' },
  { word: 'ਪੀਲਾ',             roman: 'peela',    en: 'yellow',      theme: 'colours', audio: 'pa/w-peela' },
  { word: 'ਹਰਾ',                   roman: 'hara',     en: 'green',       theme: 'colours', audio: 'pa/w-hara' },
  { word: 'ਕਾਲਾ',             roman: 'kaala',    en: 'black',       theme: 'colours', audio: 'pa/w-kaala' },
  { word: 'ਚਿੱਟਾ',       roman: 'chitta',   en: 'white',       theme: 'colours', audio: 'pa/w-chitta' },
  { word: 'ਸੰਤਰੀ',       roman: 'santari',  en: 'orange',      theme: 'colours', audio: 'pa/w-santari' },
  { word: 'ਗੁਲਾਬੀ', roman: 'gulaabi',  en: 'pink',        theme: 'colours', audio: 'pa/w-gulaabi' },
  /* numbers */
  { word: 'ਇੱਕ',                   roman: 'ikk',      en: 'one',         theme: 'numbers', audio: 'pa/w-ikk', value: 1 },
  { word: 'ਦੋ',                         roman: 'do',       en: 'two',         theme: 'numbers', audio: 'pa/w-do', value: 2 },
  { word: 'ਤਿੰਨ',             roman: 'tinn',     en: 'three',       theme: 'numbers', audio: 'pa/w-tinn', value: 3 },
  { word: 'ਚਾਰ',                   roman: 'chaar',    en: 'four',        theme: 'numbers', audio: 'pa/w-chaar', value: 4 },
  { word: 'ਪੰਜ',                   roman: 'panj',     en: 'five',        theme: 'numbers', audio: 'pa/w-panj', value: 5 },
  { word: 'ਛੇ',                         roman: 'chhe',     en: 'six',         theme: 'numbers', audio: 'pa/w-chhe', value: 6 },
  { word: 'ਸੱਤ',                   roman: 'satt',     en: 'seven',       theme: 'numbers', audio: 'pa/w-satt', value: 7 },
  { word: 'ਅੱਠ',                   roman: 'atth',     en: 'eight',       theme: 'numbers', audio: 'pa/w-atth', value: 8 },
  { word: 'ਨੌਂ',                   roman: 'naun',     en: 'nine',        theme: 'numbers', audio: 'pa/w-naun', value: 9 },
  { word: 'ਦਸ',                         roman: 'das',      en: 'ten',         theme: 'numbers', audio: 'pa/w-das', value: 10 },
  /* greetings */
  { word: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', roman: 'sat sri akaal', en: 'hello', theme: 'greetings', audio: 'pa/w-satsriakaal' },
  { word: 'ਧੰਨਵਾਦ', roman: 'dhannvaad', en: 'thank you',  theme: 'greetings', audio: 'pa/w-dhannvaad' },
  { word: 'ਹਾਂ',                   roman: 'haan',     en: 'yes',         theme: 'greetings', audio: 'pa/w-haan' },
  { word: 'ਨਹੀਂ',             roman: 'nahin',    en: 'no',          theme: 'greetings', audio: 'pa/w-nahin' },
  { word: 'ਚੰਗਾ',             roman: 'changa',   en: 'good, okay',  theme: 'greetings', audio: 'pa/w-changa' },
  { word: 'ਸ਼ੁਕਰੀਆ', roman: 'shukriya', en: 'thanks', theme: 'greetings', audio: 'pa/w-shukriya' },
  { word: 'ਰੱਬ ਰਾਖਾ', roman: 'rabb raakha', en: 'goodbye', theme: 'greetings', audio: 'pa/w-rabbrakha' },

  /* ============ the ramp widens — from the founding 74 to a real pack ==== */
  /* The founding 74 above stay untouched and stay first: they are the ear-
     first base that stage 0 leans on. What follows grows the pack the way a
     Punjabi childhood does — first the people and the kitchen (the words a
     child is called by and fed with), then the little glue words and the
     doing words that turn naming into talking, then the wider world: school,
     clothes, the sky, the clock, the pind and the road. Where Punjabi has
     its own word the pack teaches it — vekhna not dekhna, pind not gaanv,
     chann not chaand — because heritage-first means the words of THIS house,
     not Hindi respelt in Gurmukhi. */

  /* family — the people a child is called by */
  { word: 'ਵੀਰ', roman: 'veer', en: 'big brother — the warm word, often veer ji', theme: 'family', audio: 'pa/w-veer' },
  { word: 'ਬੇਬੇ', roman: 'bebe', en: 'grandmother in many families — in others it’s mum; ask your family', theme: 'family', audio: 'pa/w-bebe' },
  { word: 'ਬੀਬੀ', roman: 'bibi', en: 'grandmother in many families — and a respectful word for an elder lady', theme: 'family', audio: 'pa/w-bibi' },
  { word: 'ਮਾਸੀ', roman: 'maasi', en: 'aunt (mother’s sister)', theme: 'family', audio: 'pa/w-maasi' },
  { word: 'ਮਾਮਾ', roman: 'maama', en: 'uncle (mother’s brother)', theme: 'family', audio: 'pa/w-maama' },
  { word: 'ਮਾਮੀ', roman: 'maami', en: 'aunt (maama’s wife)', theme: 'family', audio: 'pa/w-maami' },
  { word: 'ਚਾਚਾ', roman: 'chaacha', en: 'uncle (father’s younger brother)', theme: 'family', audio: 'pa/w-chaacha' },
  { word: 'ਚਾਚੀ', roman: 'chaachi', en: 'aunt (chaacha’s wife)', theme: 'family', audio: 'pa/w-chaachi' },
  { word: 'ਤਾਇਆ', roman: 'taaia', en: 'uncle (father’s elder brother)', theme: 'family', audio: 'pa/w-taaia' },
  { word: 'ਤਾਈ', roman: 'taai', en: 'aunt (taaia’s wife)', theme: 'family', audio: 'pa/w-taai' },
  { word: 'ਮੁੰਡਾ', roman: 'munda', en: 'boy', theme: 'family', audio: 'pa/w-munda' },
  { word: 'ਕੁੜੀ', roman: 'kuri', en: 'girl', theme: 'family', audio: 'pa/w-kuri' },

  /* food — the Punjabi kitchen on a Tuesday */
  { word: 'ਲੱਸੀ', roman: 'lassi', en: 'lassi — churned yoghurt to drink', theme: 'food', audio: 'pa/w-lassi' },
  { word: 'ਮੱਕੀ ਦੀ ਰੋਟੀ', roman: 'makki di roti', en: 'corn roti — winter’s flatbread', theme: 'food', audio: 'pa/w-makkidiroti' },
  { word: 'ਸਰੋਂ ਦਾ ਸਾਗ', roman: 'saron da saag', en: 'mustard greens — makki di roti’s partner', theme: 'food', audio: 'pa/w-sarondasaag' },
  { word: 'ਪਰੌਂਠਾ', roman: 'parauntha', en: 'paratha', theme: 'food', audio: 'pa/w-parauntha' },
  { word: 'ਸਬਜ਼ੀ', roman: 'sabzi', en: 'vegetable', theme: 'food', audio: 'pa/w-sabzi' },
  { word: 'ਫਲ', roman: 'phal', en: 'fruit', theme: 'food', audio: 'pa/w-phal' },
  { word: 'ਆਲੂ', roman: 'aaloo', en: 'potato', theme: 'food', audio: 'pa/w-aaloo' },
  { word: 'ਗਾਜਰ', roman: 'gaajar', en: 'carrot', theme: 'food', audio: 'pa/w-gaajar' },
  { word: 'ਦਹੀਂ', roman: 'dahin', en: 'yoghurt', theme: 'food', audio: 'pa/w-dahin' },
  { word: 'ਮੱਖਣ', roman: 'makkhan', en: 'butter — best on a hot roti', theme: 'food', audio: 'pa/w-makkhan' },
  { word: 'ਘਿਓ', roman: 'ghio', en: 'ghee', theme: 'food', audio: 'pa/w-ghio' },
  { word: 'ਖੰਡ', roman: 'khand', en: 'sugar', theme: 'food', audio: 'pa/w-khand' },

  /* greetings — the rest of the doorway */
  { word: 'ਜੀ', roman: 'ji', en: 'the little word of respect — added to a name, an answer, a yes', theme: 'greetings', audio: 'pa/w-ji' },
  { word: 'ਜੀ ਆਇਆਂ ਨੂੰ', roman: 'ji aaian nu', en: 'welcome — the warm words over many Punjabi doors', theme: 'greetings', audio: 'pa/w-jiaaiannu' },
  { word: 'ਮਾਫ਼ ਕਰਨਾ', roman: 'maaf karna', en: 'sorry', theme: 'greetings', audio: 'pa/w-maafkarna' },
  { word: 'ਫਿਰ ਮਿਲਾਂਗੇ', roman: 'phir milaange', en: 'see you again', theme: 'greetings', audio: 'pa/w-phirmilaange' },
  { word: 'ਵਧਾਈਆਂ', roman: 'vadhaaian', en: 'congratulations', theme: 'greetings', audio: 'pa/w-vadhaaian' },
  { word: 'ਮਿਹਰਬਾਨੀ', roman: 'meharbaani', en: 'thank you — the older, warmer word', theme: 'greetings', audio: 'pa/w-meharbaani' },

  /* everyday words that glue sentences */
  { word: 'ਮੈਂ', roman: 'main', en: 'I', theme: 'basics', audio: 'pa/w-main' },
  { word: 'ਤੂੰ', roman: 'toon', en: 'you (to a friend or someone younger)', theme: 'basics', audio: 'pa/w-toon' },
  { word: 'ਤੁਸੀਂ', roman: 'tusin', en: 'you (respectful) — for elders; many families say it even for mum and dad', theme: 'basics', audio: 'pa/w-tusin' },
  { word: 'ਅਸੀਂ', roman: 'asin', en: 'we', theme: 'basics', audio: 'pa/w-asin' },
  { word: 'ਇਹ', roman: 'ih', en: 'this', theme: 'basics', audio: 'pa/w-ih' },
  { word: 'ਉਹ', roman: 'uh', en: 'that — and he, and she', theme: 'basics', audio: 'pa/w-uh' },
  { word: 'ਮੇਰਾ', roman: 'mera', en: 'my', theme: 'basics', audio: 'pa/w-mera' },
  { word: 'ਕੀ', roman: 'ki', en: 'what', theme: 'basics', audio: 'pa/w-ki' },
  { word: 'ਕੌਣ', roman: 'kaun', en: 'who', theme: 'basics', audio: 'pa/w-kaun' },
  { word: 'ਕਿੱਥੇ', roman: 'kitthe', en: 'where', theme: 'basics', audio: 'pa/w-kitthe' },
  { word: 'ਵੱਡਾ', roman: 'vadda', en: 'big', theme: 'basics', audio: 'pa/w-vadda' },
  { word: 'ਛੋਟਾ', roman: 'chhota', en: 'small', theme: 'basics', audio: 'pa/w-chhota' },
  { word: 'ਨਾਲ', roman: 'naal', en: 'with, together', theme: 'basics', audio: 'pa/w-naal' },

  /* doing words */
  { word: 'ਖੇਡਣਾ', roman: 'khedna', en: 'to play', theme: 'actions', audio: 'pa/w-khedna' },
  { word: 'ਪੜ੍ਹਨਾ', roman: 'parhna', en: 'to read — and to study', theme: 'actions', audio: 'pa/w-parhna' },
  { word: 'ਲਿਖਣਾ', roman: 'likhna', en: 'to write', theme: 'actions', audio: 'pa/w-likhna' },
  { word: 'ਖਾਣਾ', roman: 'khaana', en: 'to eat — and a meal, the same word', theme: 'actions', audio: 'pa/w-khaana' },
  { word: 'ਪੀਣਾ', roman: 'peena', en: 'to drink', theme: 'actions', audio: 'pa/w-peena' },
  { word: 'ਸੌਣਾ', roman: 'sauna', en: 'to sleep', theme: 'actions', audio: 'pa/w-sauna' },
  { word: 'ਜਾਣਾ', roman: 'jaana', en: 'to go', theme: 'actions', audio: 'pa/w-jaana' },
  { word: 'ਆਉਣਾ', roman: 'aauna', en: 'to come', theme: 'actions', audio: 'pa/w-aauna' },
  { word: 'ਵੇਖਣਾ', roman: 'vekhna', en: 'to see, to watch', theme: 'actions', audio: 'pa/w-vekhna' },
  { word: 'ਸੁਣਨਾ', roman: 'sunna', en: 'to listen', theme: 'actions', audio: 'pa/w-sunna' },
  { word: 'ਬੋਲਣਾ', roman: 'bolna', en: 'to speak', theme: 'actions', audio: 'pa/w-bolna' },
  { word: 'ਤੁਰਨਾ', roman: 'turna', en: 'to walk', theme: 'actions', audio: 'pa/w-turna' },
  { word: 'ਸਿੱਖਣਾ', roman: 'sikkhna', en: 'to learn — the word a Sikh is named from: a learner', theme: 'actions', audio: 'pa/w-sikkhna' },

  /* body */
  { word: 'ਮੱਥਾ', roman: 'mattha', en: 'forehead', theme: 'body', audio: 'pa/w-mattha' },
  { word: 'ਗੱਲ੍ਹ', roman: 'gallh', en: 'cheek', theme: 'body', audio: 'pa/w-gallh' },
  { word: 'ਬੁੱਲ੍ਹ', roman: 'bullh', en: 'lip', theme: 'body', audio: 'pa/w-bullh' },
  { word: 'ਜੀਭ', roman: 'jeebh', en: 'tongue', theme: 'body', audio: 'pa/w-jeebh' },
  { word: 'ਮੋਢਾ', roman: 'modha', en: 'shoulder', theme: 'body', audio: 'pa/w-modha' },
  { word: 'ਬਾਂਹ', roman: 'baanh', en: 'arm', theme: 'body', audio: 'pa/w-baanh' },
  { word: 'ਪਿੱਠ', roman: 'pitth', en: 'back', theme: 'body', audio: 'pa/w-pitth' },
  { word: 'ਗੋਡਾ', roman: 'goda', en: 'knee', theme: 'body', audio: 'pa/w-goda' },
  { word: 'ਲੱਤ', roman: 'latt', en: 'leg', theme: 'body', audio: 'pa/w-latt' },

  /* home */
  { word: 'ਕਮਰਾ', roman: 'kamra', en: 'room', theme: 'home', audio: 'pa/w-kamra' },
  { word: 'ਕੰਧ', roman: 'kandh', en: 'wall', theme: 'home', audio: 'pa/w-kandh' },
  { word: 'ਵਿਹੜਾ', roman: 'vihra', en: 'courtyard — where the manjas come out on summer evenings', theme: 'home', audio: 'pa/w-vihra' },
  { word: 'ਪੱਖਾ', roman: 'pakkha', en: 'fan', theme: 'home', audio: 'pa/w-pakkha' },
  { word: 'ਬੱਤੀ', roman: 'batti', en: 'light', theme: 'home', audio: 'pa/w-batti' },
  { word: 'ਦੀਵਾ', roman: 'deeva', en: 'oil lamp', theme: 'home', audio: 'pa/w-deeva' },
  { word: 'ਚੁੱਲ੍ਹਾ', roman: 'chullha', en: 'stove', theme: 'home', audio: 'pa/w-chullha' },
  { word: 'ਭਾਂਡੇ', roman: 'bhaande', en: 'the pots and dishes — the washing-up', theme: 'home', audio: 'pa/w-bhaande' },
  { word: 'ਥਾਲੀ', roman: 'thaali', en: 'plate', theme: 'home', audio: 'pa/w-thaali' },
  { word: 'ਰਜਾਈ', roman: 'rajaai', en: 'quilt — winter’s heavy warm blanket', theme: 'home', audio: 'pa/w-rajaai' },

  /* animals */
  { word: 'ਬੱਕਰੀ', roman: 'bakri', en: 'goat', theme: 'animals', audio: 'pa/w-bakri' },
  { word: 'ਮੱਝ', roman: 'majjh', en: 'buffalo', theme: 'animals', audio: 'pa/w-majjh' },
  { word: 'ਊਠ', roman: 'ooth', en: 'camel', theme: 'animals', audio: 'pa/w-ooth' },
  { word: 'ਸੱਪ', roman: 'sapp', en: 'snake', theme: 'animals', audio: 'pa/w-sapp' },
  { word: 'ਚੂਹਾ', roman: 'chooha', en: 'mouse', theme: 'animals', audio: 'pa/w-chooha' },
  { word: 'ਮੋਰ', roman: 'mor', en: 'peacock', theme: 'animals', audio: 'pa/w-mor' },
  { word: 'ਕਾਂ', roman: 'kaan', en: 'crow', theme: 'animals', audio: 'pa/w-kaan' },
  { word: 'ਤੋਤਾ', roman: 'tota', en: 'parrot', theme: 'animals', audio: 'pa/w-tota' },
  { word: 'ਕੁੱਕੜ', roman: 'kukkar', en: 'rooster', theme: 'animals', audio: 'pa/w-kukkar' },

  /* colours */
  { word: 'ਭੂਰਾ', roman: 'bhoora', en: 'brown', theme: 'colours', audio: 'pa/w-bhoora' },
  { word: 'ਜਾਮਨੀ', roman: 'jaamni', en: 'purple', theme: 'colours', audio: 'pa/w-jaamni' },
  { word: 'ਸਲੇਟੀ', roman: 'saleti', en: 'grey', theme: 'colours', audio: 'pa/w-saleti' },
  { word: 'ਰੰਗ', roman: 'rang', en: 'colour', theme: 'colours', audio: 'pa/w-rang' },

  /* numbers — beyond ten */
  { word: 'ਗਿਆਰਾਂ', roman: 'giaaraan', en: 'eleven', theme: 'numbers', audio: 'pa/w-giaaraan', value: 11 },
  { word: 'ਬਾਰਾਂ', roman: 'baaraan', en: 'twelve', theme: 'numbers', audio: 'pa/w-baaraan', value: 12 },
  { word: 'ਤੇਰਾਂ', roman: 'teraan', en: 'thirteen', theme: 'numbers', audio: 'pa/w-teraan', value: 13 },
  { word: 'ਚੌਦਾਂ', roman: 'chaudaan', en: 'fourteen', theme: 'numbers', audio: 'pa/w-chaudaan', value: 14 },
  { word: 'ਪੰਦਰਾਂ', roman: 'pandraan', en: 'fifteen', theme: 'numbers', audio: 'pa/w-pandraan', value: 15 },
  { word: 'ਸੋਲਾਂ', roman: 'solaan', en: 'sixteen', theme: 'numbers', audio: 'pa/w-solaan', value: 16 },
  { word: 'ਸਤਾਰਾਂ', roman: 'sataaraan', en: 'seventeen', theme: 'numbers', audio: 'pa/w-sataaraan', value: 17 },
  { word: 'ਅਠਾਰਾਂ', roman: 'athaaraan', en: 'eighteen', theme: 'numbers', audio: 'pa/w-athaaraan', value: 18 },
  { word: 'ਉੱਨੀ', roman: 'unni', en: 'nineteen', theme: 'numbers', audio: 'pa/w-unni', value: 19 },
  { word: 'ਵੀਹ', roman: 'veeh', en: 'twenty', theme: 'numbers', audio: 'pa/w-veeh', value: 20 },
  { word: 'ਸੌ', roman: 'sau', en: 'a hundred', theme: 'numbers', audio: 'pa/w-sau', value: 100 },
  { word: 'ਅੱਧਾ', roman: 'addha', en: 'half', theme: 'numbers', audio: 'pa/w-addha' },

  /* school */
  { word: 'ਸਕੂਲ', roman: 'sakool', en: 'school', theme: 'school', audio: 'pa/w-sakool' },
  { word: 'ਕਿਤਾਬ', roman: 'kitaab', en: 'book', theme: 'school', audio: 'pa/w-kitaab' },
  { word: 'ਕਲਮ', roman: 'kalam', en: 'pen', theme: 'school', audio: 'pa/w-kalam' },
  { word: 'ਬਸਤਾ', roman: 'basta', en: 'school bag', theme: 'school', audio: 'pa/w-basta' },
  { word: 'ਜਮਾਤ', roman: 'jamaat', en: 'class', theme: 'school', audio: 'pa/w-jamaat' },
  { word: 'ਸਵਾਲ', roman: 'savaal', en: 'question', theme: 'school', audio: 'pa/w-savaal' },
  { word: 'ਜਵਾਬ', roman: 'javaab', en: 'answer', theme: 'school', audio: 'pa/w-javaab' },
  { word: 'ਅੱਖਰ', roman: 'akkhar', en: 'letter (of the alphabet) — Gurmukhi has thirty-five', theme: 'school', audio: 'pa/w-akkhar' },
  { word: 'ਕਹਾਣੀ', roman: 'kahaani', en: 'story', theme: 'school', audio: 'pa/w-kahaani' },
  { word: 'ਬੋਲੀ', roman: 'boli', en: 'language — Punjabi speakers call theirs their boli', theme: 'school', audio: 'pa/w-boli' },

  /* clothes */
  { word: 'ਕੱਪੜੇ', roman: 'kappre', en: 'clothes', theme: 'clothes', audio: 'pa/w-kappre' },
  { word: 'ਕੁੜਤਾ', roman: 'kurta', en: 'kurta', theme: 'clothes', audio: 'pa/w-kurta' },
  { word: 'ਸਲਵਾਰ', roman: 'salvaar', en: 'salwar', theme: 'clothes', audio: 'pa/w-salvaar' },
  { word: 'ਕਮੀਜ਼', roman: 'kameez', en: 'shirt', theme: 'clothes', audio: 'pa/w-kameez' },
  { word: 'ਜੁੱਤੀ', roman: 'jutti', en: 'jutti — the embroidered Punjabi shoe', theme: 'clothes', audio: 'pa/w-jutti' },
  { word: 'ਚੁੰਨੀ', roman: 'chunni', en: 'chunni — the light scarf worn with a salwar-kameez', theme: 'clothes', audio: 'pa/w-chunni' },
  { word: 'ਪੱਗ', roman: 'pagg', en: 'turban — tied with care and pride in many Punjabi families', theme: 'clothes', audio: 'pa/w-pagg' },
  { word: 'ਜੁਰਾਬ', roman: 'juraab', en: 'sock', theme: 'clothes', audio: 'pa/w-juraab' },
  { word: 'ਜੇਬ', roman: 'jeb', en: 'pocket', theme: 'clothes', audio: 'pa/w-jeb' },
  { word: 'ਫੁਲਕਾਰੀ', roman: 'phulkaari', en: 'phulkari — “flower work”, Punjab’s embroidered shawl', theme: 'clothes', audio: 'pa/w-phulkaari' },

  /* weather and sky */
  { word: 'ਮੌਸਮ', roman: 'mausam', en: 'weather', theme: 'weather', audio: 'pa/w-mausam' },
  { word: 'ਧੁੱਪ', roman: 'dhupp', en: 'sunshine', theme: 'weather', audio: 'pa/w-dhupp' },
  { word: 'ਮੀਂਹ', roman: 'meenh', en: 'rain', theme: 'weather', audio: 'pa/w-meenh' },
  { word: 'ਬੱਦਲ', roman: 'baddal', en: 'cloud', theme: 'weather', audio: 'pa/w-baddal' },
  { word: 'ਹਵਾ', roman: 'hava', en: 'wind, air', theme: 'weather', audio: 'pa/w-hava' },
  { word: 'ਸਿਆਲ', roman: 'siaal', en: 'winter, the cold season', theme: 'weather', audio: 'pa/w-siaal' },
  { word: 'ਸੂਰਜ', roman: 'sooraj', en: 'sun', theme: 'weather', audio: 'pa/w-sooraj' },
  { word: 'ਚੰਨ', roman: 'chann', en: 'moon', theme: 'weather', audio: 'pa/w-chann' },
  { word: 'ਤਾਰਾ', roman: 'taara', en: 'star', theme: 'weather', audio: 'pa/w-taara' },
  { word: 'ਬਰਫ਼', roman: 'baraf', en: 'snow, ice', theme: 'weather', audio: 'pa/w-baraf' },
  { word: 'ਸਤਰੰਗੀ ਪੀਂਘ', roman: 'satrangi peengh', en: 'rainbow — Punjabi calls it the seven-coloured swing', theme: 'weather', audio: 'pa/w-satrangipeengh' },

  /* time and days */
  { word: 'ਅੱਜ', roman: 'ajj', en: 'today', theme: 'time', audio: 'pa/w-ajj' },
  { word: 'ਕੱਲ੍ਹ', roman: 'kallh', en: 'yesterday — and tomorrow, the same word', theme: 'time', audio: 'pa/w-kallh' },
  { word: 'ਸਵੇਰ', roman: 'saver', en: 'morning', theme: 'time', audio: 'pa/w-saver' },
  { word: 'ਦੁਪਹਿਰ', roman: 'dupahir', en: 'afternoon', theme: 'time', audio: 'pa/w-dupahir' },
  { word: 'ਸ਼ਾਮ', roman: 'shaam', en: 'evening', theme: 'time', audio: 'pa/w-shaam' },
  { word: 'ਰਾਤ', roman: 'raat', en: 'night', theme: 'time', audio: 'pa/w-raat' },
  { word: 'ਦਿਨ', roman: 'din', en: 'day', theme: 'time', audio: 'pa/w-din' },
  { word: 'ਹਫ਼ਤਾ', roman: 'hafta', en: 'week', theme: 'time', audio: 'pa/w-hafta' },
  { word: 'ਮਹੀਨਾ', roman: 'maheena', en: 'month', theme: 'time', audio: 'pa/w-maheena' },
  { word: 'ਸਾਲ', roman: 'saal', en: 'year', theme: 'time', audio: 'pa/w-saal' },
  { word: 'ਵੇਲਾ', roman: 'vela', en: 'time, the moment for something — as in roti vela, mealtime', theme: 'time', audio: 'pa/w-vela' },
  { word: 'ਘੜੀ', roman: 'ghari', en: 'clock, watch', theme: 'time', audio: 'pa/w-ghari' },
  { word: 'ਤਿਉਹਾਰ', roman: 'tiuhaar', en: 'festival', theme: 'time', audio: 'pa/w-tiuhaar' },

  /* places and outdoors */
  { word: 'ਪਿੰਡ', roman: 'pind', en: 'village — the pind is where a family’s story starts', theme: 'places', audio: 'pa/w-pind' },
  { word: 'ਗੁਰਦੁਆਰਾ', roman: 'gurdwara', en: 'gurdwara — the Guru’s door, open to everyone who comes', theme: 'places', audio: 'pa/w-gurdwara' },
  { word: 'ਮੰਦਰ', roman: 'mandar', en: 'temple', theme: 'places', audio: 'pa/w-mandar' },
  { word: 'ਮਸੀਤ', roman: 'maseet', en: 'mosque', theme: 'places', audio: 'pa/w-maseet' },
  { word: 'ਗਿਰਜਾ', roman: 'girja', en: 'church', theme: 'places', audio: 'pa/w-girja' },
  { word: 'ਬਾਜ਼ਾਰ', roman: 'baazaar', en: 'market', theme: 'places', audio: 'pa/w-baazaar' },
  { word: 'ਦੁਕਾਨ', roman: 'dukaan', en: 'shop', theme: 'places', audio: 'pa/w-dukaan' },
  { word: 'ਸ਼ਹਿਰ', roman: 'shahir', en: 'city', theme: 'places', audio: 'pa/w-shahir' },
  { word: 'ਖੇਤ', roman: 'khet', en: 'field', theme: 'places', audio: 'pa/w-khet' },
  { word: 'ਦਰਿਆ', roman: 'dariaa', en: 'river — Punjab is named for five of them', theme: 'places', audio: 'pa/w-dariaa' },
  { word: 'ਰੁੱਖ', roman: 'rukkh', en: 'tree', theme: 'places', audio: 'pa/w-rukkh' },
  { word: 'ਫੁੱਲ', roman: 'phull', en: 'flower', theme: 'places', audio: 'pa/w-phull' },

  /* getting around */
  { word: 'ਗੱਡੀ', roman: 'gaddi', en: 'car — and a train is a gaddi too', theme: 'transport', audio: 'pa/w-gaddi' },
  { word: 'ਬੱਸ', roman: 'bass', en: 'bus', theme: 'transport', audio: 'pa/w-bass' },
  { word: 'ਸਾਈਕਲ', roman: 'saaikal', en: 'bicycle', theme: 'transport', audio: 'pa/w-saaikal' },
  { word: 'ਟਰੈਕਟਰ', roman: 'taraiktar', en: 'tractor — the pride of the fields', theme: 'transport', audio: 'pa/w-taraiktar' },
  { word: 'ਜਹਾਜ਼', roman: 'jahaaz', en: 'ship — and an aeroplane as well', theme: 'transport', audio: 'pa/w-jahaaz' },
  { word: 'ਟਿਕਟ', roman: 'tikat', en: 'ticket', theme: 'transport', audio: 'pa/w-tikat' },
  { word: 'ਰਾਹ', roman: 'raah', en: 'the way, the path', theme: 'transport', audio: 'pa/w-raah' },
  { word: 'ਪਹੀਆ', roman: 'paheea', en: 'wheel', theme: 'transport', audio: 'pa/w-paheea' },

  /* feelings */
  { word: 'ਖ਼ੁਸ਼', roman: 'khush', en: 'happy', theme: 'feelings', audio: 'pa/w-khush' },
  { word: 'ਉਦਾਸ', roman: 'udaas', en: 'sad', theme: 'feelings', audio: 'pa/w-udaas' },
  { word: 'ਗੁੱਸਾ', roman: 'gussa', en: 'anger', theme: 'feelings', audio: 'pa/w-gussa' },
  { word: 'ਡਰ', roman: 'dar', en: 'fear', theme: 'feelings', audio: 'pa/w-dar' },
  { word: 'ਪਿਆਰ', roman: 'piaar', en: 'love', theme: 'feelings', audio: 'pa/w-piaar' },
  { word: 'ਭੁੱਖਾ', roman: 'bhukkha', en: 'hungry', theme: 'feelings', audio: 'pa/w-bhukkha' },
  { word: 'ਥੱਕਿਆ', roman: 'thakkia', en: 'tired', theme: 'feelings', audio: 'pa/w-thakkia' },
  { word: 'ਹਾਸਾ', roman: 'haasa', en: 'laughter', theme: 'feelings', audio: 'pa/w-haasa' },
  { word: 'ਹੰਝੂ', roman: 'hanjhoo', en: 'tears', theme: 'feelings', audio: 'pa/w-hanjhoo' },
  { word: 'ਹੌਸਲਾ', roman: 'hausla', en: 'courage, heart', theme: 'feelings', audio: 'pa/w-hausla' }
];

/* Stage items are keys, not prose: the letters/signs/words the stage owns.
   Built from the script module and lexicon so they cannot fall out of sync. */
function chars(list) { var i, o = []; for (i = 0; i < list.length; i++) { o.push(list[i].char || list[i].sign || list[i].word); } return o; }
function themeWords(lex, theme) { var i, o = []; for (i = 0; i < lex.length; i++) { if (lex[i].theme === theme) o.push(lex[i].word); } return o; }
/* `authored` overrides the derived defaults for the stages a lexicon cannot
   carry on its own — 4, 5 and 6, where somebody has to write the sentences.
   A pack that has not been written that far keeps the derived skeleton, so
   the ladder is never empty and the gap is visible rather than hidden. */
function stageItems(script, lex, authored) {
  var o = {
    s0: themeWords(lex, 'greetings').concat(themeWords(lex, 'family'), themeWords(lex, 'food')),
    s1: chars(script.vowels).concat(chars(script.consonants)),
    s2: chars(script.matras),
    s3: chars(lex),
    s4: ['sov-order', 'gender', 'postpositions', 'verb-agreement', 'tense-present', 'tense-past', 'tense-future'],
    s5: ['greeting-elders', 'the-market', 'phone-to-nani', 'at-a-wedding', 'ordering-food', 'at-school', 'asking-the-way'],
    s6: chars(script.hardConjuncts),
    s7: chars(script.consonants)
  };
  var k;
  for (k in (authored || {})) {
    if (Object.prototype.hasOwnProperty.call(authored, k) && authored[k] && authored[k].length) o[k] = authored[k];
  }
  return o;
}

var HI_PACK = {
  id: 'hi',
  name: { en: 'Hindi', native: 'हिन्दी' },
  script: 'devanagari',
  transliteration: 'iso15919+kid',
  phonology: { tones: false, retroflex: true, aspiration: true },
  voice: { kind: 'human', ns: 'hi' },
  diglossia: null,
  paths: ['heritage', 'beginner'],
  themes: THEMES,
  lexicon: HI_LEX,
  reviewedBy: [],                 /* a named linguist signs here before ship (docs/09 §9) */
  stages: ladder(stageItems(DEVANAGARI, HI_LEX, {
    s4: HI_S4,
    s5: HI_S5,
    s6: conjunctItems(DEVANAGARI).concat(HI_READ)
  }))
};

var PA_PACK = {
  id: 'pa',
  name: { en: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  script: 'gurmukhi',
  transliteration: 'iso15919+kid',
  phonology: { tones: true, retroflex: true, aspiration: true },  /* Punjabi is tonal — most Indian languages are not */
  voice: { kind: 'human', ns: 'pa' },
  diglossia: null,
  paths: ['heritage', 'beginner'],
  themes: THEMES,
  lexicon: PA_LEX,
  reviewedBy: [],
  stages: ladder(stageItems(GURMUKHI, PA_LEX))
};

W.IND_PACKS = { hi: HI_PACK, pa: PA_PACK };

/* ==================================================== THE PACK KIT ======= */
/* docs/09's promise — "adding Gujarati or Tamil is a data file, not a
   rewrite" — is only true if a data file can actually reach the ladder.
   This is the whole surface a sibling pack file needs: the shared theme
   list, the shared eight-stage ladder, the item derivation, the lexicon
   builder, and a register() that refuses to overwrite an existing script
   or pack so load order can never silently replace Hindi.

   A pack file loads AFTER bhasha.js and looks like:

       var K = window.IND_BHASHA_KIT;
       var BENGALI = { id: 'bengali', block: [0x0980, 0x09FF], ... };
       var BN_LEX = K.packWords('bn', [ ... ]);
       K.register(BENGALI, {
         id: 'bn', name: { en: 'Bengali', native: 'বাংলা' },
         script: 'bengali', lexicon: BN_LEX, themes: K.THEMES,
         stages: K.ladder(K.stageItems(BENGALI, BN_LEX)), ...
       });

   `block` is the script's Unicode range, asserted by tools/test-bhasha.js
   the same way the two founding scripts are. */
W.IND_BHASHA_KIT = {
  THEMES: THEMES,
  ladder: ladder,
  stageItems: stageItems,
  packWords: packWords,
  chars: chars,
  themeWords: themeWords,
  register: function (script, pack) {
    if (script && script.id && !W.IND_SCRIPTS[script.id]) W.IND_SCRIPTS[script.id] = script;
    if (pack && pack.id && !W.IND_PACKS[pack.id]) W.IND_PACKS[pack.id] = pack;
  }
};

/* ======================================================== THE ENGINE ===== */

function resolveScript(s) {
  if (!s) return null;
  if (typeof s === 'string') return W.IND_SCRIPTS[s] || (W.IND_PACKS[s] ? W.IND_SCRIPTS[W.IND_PACKS[s].script] : null);
  if (s.consonants) return s;                       /* already a script module */
  if (s.script) return W.IND_SCRIPTS[s.script];     /* a pack */
  return null;
}
function resolvePack(p) {
  if (!p) return null;
  if (typeof p === 'string') return W.IND_PACKS[p] || null;
  return p.lexicon ? p : null;
}
/* Re-namespace a shared script-module audio key onto a pack's own voice.
   'hi/ka' + the Marathi pack -> 'mr/ka'. Hindi records the Devanagari
   letters first; nothing about that is baked in. */
function audioFor(key, pack) {
  if (!key) return key;
  pack = resolvePack(pack);
  if (!pack || !pack.voice || !pack.voice.ns) return key;
  var slash = key.indexOf('/');
  return slash < 0 ? pack.voice.ns + '/' + key : pack.voice.ns + key.slice(slash);
}

/* ---- the example-sentence seam (Phase 3) -------------------------------
   data-bhasha-hi-sentences.js writes { '<word>': { s, roman, en } }, keyed
   byte-for-byte by the lexicon's own spelling, one entry per lexicon word,
   and every sentence carries its word VERBATIM EXACTLY ONCE. That last
   guarantee is the whole reason masking can be honest: there is one
   occurrence to hide, and hiding it cannot swallow anything else.

   Same shape as the dialogue seam — a global per pack, absent until the
   content lands, everything downstream guarded for its absence. A future
   pack can register through W.IND_BHASHA_SENTENCES[packId] instead of
   claiming a global of its own. */
function sentenceMap(pack) {
  pack = resolvePack(pack);
  if (!pack) return null;
  var m = (W.IND_BHASHA_SENTENCES || {})[pack.id];
  return (m && typeof m === 'object') ? m : null;
}
/* The authored dialogue bank for a pack, or null. Same registry shape as the
   sentences: one global keyed by pack id, absent until the content lands,
   every caller guarded for its absence.

   PHASE A retired `pack.id === 'hi' && W.IND_HI_DIALOGUES` from the two places
   that used to test for it. A special case for the first pack is invisible
   while there is only one pack with content; it becomes eight forgotten
   exceptions the moment the others land. */
/* PASSAGES FROM ELSEWHERE. The twelve authored reading passages live in the
   pack; these are the ones that arrive from outside it — chiefly the Hindi
   tellings of the story library, which are already written, already narrated,
   and already graded by which lexicon words they use.

   Same registry shape as sentences and dialogues: one global keyed by pack id,
   absent until content lands, every caller guarded. A pack with no bank behaves
   exactly as it did before. */
function passageBank(pack) {
  pack = resolvePack(pack);
  if (!pack) return null;
  var p = (W.IND_BHASHA_PASSAGES || {})[pack.id];
  return (p && p.length) ? p : null;
}

/* THE GRAMMAR BANK — Phase C. Same registry shape as sentences, dialogues and passages:
   one global keyed by pack id, absent until content lands, every caller guarded. A pack
   with no grammar behaves exactly as it did before.

   Read LAZILY, never folded into the pack at build time. The passage bank shipped broken
   once by being read at pack-build time — the banks register AFTER bhasha.js evaluates,
   so the build read an empty registry and every passage came out with audio:null. Ask
   the registry when you need it, not when you define the pack. */
function grammarBank(pack) {
  pack = resolvePack(pack);
  if (!pack) return null;
  var g = (W.IND_BHASHA_GRAMMAR || {})[pack.id];
  return (g && g.length) ? g : null;
}

/* One grammar point, with its worked examples resolved from ids to the real sentences.
   By id and never re-typed: correct a sentence and its card follows automatically. */
function grammarPoint(pack, id) {
  var bank = grammarBank(pack);
  if (!bank) return null;
  var g = null, i;
  for (i = 0; i < bank.length; i++) if (bank[i].id === id) g = bank[i];
  if (!g) return null;
  var byId = {}, st = (resolvePack(pack) || {}).stages || [];
  for (i = 0; i < st.length; i++) {
    (st[i].items || []).forEach(function (it) { if (it.id) byId[it.id] = it; });
  }
  var eg = (g.eg || []).map(function (x) { return byId[x]; }).filter(Boolean);
  /* every sentence carrying this point, so the card can say how much practice it has */
  var all = [];
  for (i = 0; i < st.length; i++) {
    (st[i].items || []).forEach(function (it) { if (it.point === id) all.push(it); });
  }
  return { id: g.id, hi: g.hi, roman: g.roman, en: g.en, rule: g.rule, watch: g.watch,
    eg: eg, count: all.length, srsKey: 'gram:' + g.id };
}

function dialogueBank(pack) {
  pack = resolvePack(pack);
  if (!pack) return null;
  var d = (W.IND_BHASHA_DIALOGUES || {})[pack.id];
  return (d && d.length) ? d : null;
}
function lexEntry(pack, word) {
  pack = resolvePack(pack);
  var lex = (pack && pack.lexicon) || [], i;
  for (i = 0; i < lex.length; i++) { if (lex[i].word === word) return lex[i]; }
  return null;
}
/* THE SENTENCE CLIP KEY is derived from the word's romanisation exactly the
   way the word key is, so the manifest a recording session works from can
   never drift from the pack:

       hi/w-paani   the word पानी
       hi/s-paani   the sentence that word lives in

   No clip is asserted to exist. Callers play it only when the voice manifest
   lists it, and read the sentence some other way when it does not. */
function sentenceKey(pack, entry) {
  pack = resolvePack(pack);
  var ns = (pack && pack.voice && pack.voice.ns) || (pack && pack.id) || 'hi';
  return ns + '/s-' + String((entry && entry.roman) || '').replace(/\s+/g, '');
}
/* sentenceFor('hi', 'पानी') -> { word, s, roman, en, audio } | null */
function sentenceFor(pack, word) {
  var m = sentenceMap(pack), e = m && m[word], le = lexEntry(pack, word);
  if (!e || !le) return null;
  return { word: word, s: e.s, roman: e.roman, en: e.en, audio: sentenceKey(pack, le) };
}

var BLANK = '_____';
/* MASK ONE WORD, HONESTLY. indexOf — not a regex, and never a global
   replace: the job is to hide THE occurrence of the target, and a blunt
   replace-all would also swallow those same letters where they sit inside a
   longer word, quietly deleting a piece of the sentence the child needs.
   Returns the two pieces as well as the joined text, so a view can draw a
   real slot and a voice can read around the hole without ever saying it. */
function maskWord(sentence, word, blank) {
  var t = String(sentence == null ? '' : sentence), w = String(word == null ? '' : word);
  if (!w) return { text: t, before: t, after: '', matched: false };
  var at = t.indexOf(w);
  if (at < 0) return { text: t, before: t, after: '', matched: false };
  var before = t.slice(0, at), after = t.slice(at + w.length);
  return { text: before + (blank === undefined ? BLANK : blank) + after,
           before: before, after: after, matched: true, at: at };
}

/* TWO GLOSSES THAT NAME THE SAME THING. A distractor that shares a sense
   with the answer would ALSO fit the gap, and a child who read the sentence
   perfectly would be marked wrong for choosing it — so it never becomes an
   option. English is the only handle a script-generic engine has here, so
   the comparison is done on the glosses: each sense reduced to its content
   words, stop words and plurals off, and two senses count as the same when
   one covers the other. "thanks" and "thank you" are the same word to a
   six-year-old; so are "water" and "drinking water". */
var GLOSS_STOP = {
  a: 1, an: 1, the: 1, to: 1, of: 1, in: 1, on: 1, at: 1, is: 1, it: 1, its: 1, be: 1,
  you: 1, your: 1, my: 1, and: 1, or: 1, do: 1, does: 1, one: 1, some: 1, that: 1,
  this: 1, for: 1, with: 1, up: 1, down: 1, very: 1, own: 1
};
function glossSenses(en) {
  var raw = String(en == null ? '' : en).toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[,;/]|\bor\b/);
  var out = [], i, k, w, toks, sense;
  for (i = 0; i < raw.length; i++) {
    toks = raw[i].replace(/[^a-z\s'-]/g, ' ').split(/\s+/);
    sense = [];
    for (k = 0; k < toks.length; k++) {
      w = toks[k];
      if (!w || GLOSS_STOP[w]) continue;
      if (w.length > 3 && /[^s]s$/.test(w)) w = w.slice(0, -1);   /* plurals and third persons */
      if (indexOf(sense, w) < 0) sense.push(w);
    }
    if (sense.length) out.push(sense);
  }
  return out;
}
function coversSense(big, small) {
  var i;
  for (i = 0; i < small.length; i++) { if (indexOf(big, small[i]) < 0) return false; }
  return true;
}
function sharesGloss(a, b) {
  var A = glossSenses(a), B = glossSenses(b), i, j;
  for (i = 0; i < A.length; i++) {
    for (j = 0; j < B.length; j++) {
      if (coversSense(A[i], B[j]) || coversSense(B[j], A[i])) return true;
    }
  }
  return false;
}

/* the matras that make up the barakhadi columns */
function gridMatras(script) {
  var i, o = [];
  for (i = 0; i < script.matras.length; i++) { if (script.matras[i].grid !== false) o.push(script.matras[i]); }
  return o;
}
function consonantByChar(script, ch) {
  var i; for (i = 0; i < script.consonants.length; i++) { if (script.consonants[i].char === ch) return script.consonants[i]; }
  return null;
}
/* Compose a syllable. Storage order is always base-then-sign, even for the
   left-rendering signs (Devanagari ि, Gurmukhi ਿ) — the shaper moves them. */
function syllable(base, sign) { return base + (sign || ''); }

/* ---- barakhadi ---------------------------------------------------------
   The core teaching object in every Indian script: one consonant across
   every vowel sign. Devanagari gives 12 cells (क का कि की कु कू के कै को कौ कं कः),
   Gurmukhi gives 10 (ਕ ਕਾ ਕਿ ਕੀ ਕੁ ਕੂ ਕੇ ਕੈ ਕੋ ਕੌ). Same function.

   PHASE 0: this used to return the grid alone — no options, no answerIndex —
   which the quiz UI rendered as zero buttons: a question that could not be
   answered at all. It is now a find-the-cell exercise: ONE cell is asked for
   by its sound ("Which one says ki?"), `options` is a sampled row of cells
   and `answerIndex` flows through the standard grading path. The full row
   stays in `cells` for the UI to render as teaching context above — the
   question asks the child to FIND, so showing the grid IS the exercise, not
   a leak. The options carry no roman labels: those would be the answer. */
function barakhadi(script, consonant, opts) {
  script = resolveScript(script);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var cons = typeof consonant === 'string' ? (consonantByChar(script, consonant) || null) : consonant;
  if (!cons) cons = pick(rng, script.consonants);
  var cells = [{
    syllable: cons.char, matra: null, matraName: null, vowel: script.inherent,
    roman: cons.r + script.inherent, position: 'inherent', audio: cons.audio, inherent: true
  }];
  var ms = gridMatras(script), i, m;
  for (i = 0; i < ms.length; i++) {
    m = ms[i];
    cells.push({
      syllable: syllable(cons.char, m.sign), matra: m.sign, matraName: m.name, vowel: m.vowel,
      roman: cons.r + m.vowel, position: m.position,
      audio: script.audioNs + '/bk-' + cons.name + '-' + m.name
    });
  }
  /* PHASE 1: the planner can pin WHICH cell is asked for — `opts.matra` names
     the sign whose cell becomes the target, so a session can drill the matra
     it just introduced instead of a random one. Random when absent. */
  var target = null;
  if (opts.matra) { for (i = 0; i < cells.length; i++) { if (cells[i].matra === opts.matra) { target = cells[i]; break; } } }
  if (!target) target = cells[rint(rng, cells.length)];
  var n = Math.min(opts.options || 4, cells.length);
  var wrong = sample(rng, cells, n - 1, function (c) { return c.syllable === target.syllable; });
  var row = shuffle(rng, [target].concat(wrong));
  var opt = [], ai = 0;
  for (i = 0; i < row.length; i++) {
    opt.push({ char: row[i].syllable, audio: row[i].audio });   /* no name/roman: that is the answer */
    if (row[i].syllable === target.syllable) ai = i;
  }
  return {
    type: 'barakhadi', script: script.id, direction: script.direction, font: script.font,
    base: cons.char, baseName: cons.name, baseAudio: cons.audio,
    cells: cells, cols: cells.length,
    options: opt, answerIndex: ai,
    target: target.syllable, targetRoman: target.roman,
    audio: target.audio, say: target.syllable,
    itemKey: target.matra ? 'matra:' + target.matra : 'letter:' + cons.char,
    prompt: 'Find the one that says “' + target.roman + '”.'
  };
}

/* ---- matra attach ------------------------------------------------------
   Drag a vowel sign onto a base letter. The core abugida skill and the one
   exercise that transfers unchanged to every script in the roadmap.

   `target` and `targetName` are the ANSWER — render them only after the
   child has answered. The prompt is audio plus the romanisation. */
function matraAttach(script, opts) {
  script = resolveScript(script);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var n = opts.options || 4;
  var ms = gridMatras(script);
  var cons = opts.consonant ? (consonantByChar(script, opts.consonant) || pick(rng, script.consonants)) : pick(rng, script.consonants);
  /* A pinned matra is looked up in the FULL matra list, not just the grid —
     ृ is taught (it is a stage 2 item) even though it is not a barakhadi
     column, and the planner must be able to drill it. */
  var m = opts.matra ? (function () { var i; for (i = 0; i < script.matras.length; i++) { if (script.matras[i].sign === opts.matra) return script.matras[i]; } return pick(rng, ms); }()) : pick(rng, ms);
  var wrong = sample(rng, ms, n - 1, function (x) { return x.sign === m.sign; });
  var options = shuffle(rng, [m].concat(wrong));
  var opt = [], i;
  for (i = 0; i < options.length; i++) {
    opt.push({ sign: options[i].sign, name: options[i].name, position: options[i].position, audio: options[i].audio });
  }
  return {
    type: 'matraAttach', script: script.id, direction: script.direction, font: script.font,
    base: cons.char, baseName: cons.name, baseAudio: cons.audio,
    matra: m.sign, matraName: m.name, position: m.position,
    options: opt, answer: m.sign, answerIndex: (function () { var i; for (i = 0; i < opt.length; i++) { if (opt[i].sign === m.sign) return i; } return -1; }()),
    audio: script.audioNs + '/bk-' + cons.name + '-' + m.name,
    say: syllable(cons.char, m.sign),           /* TTS fallback for the prompt sound; spoken, never shown */
    itemKey: 'matra:' + m.sign,
    promptRoman: cons.r + m.vowel,
    target: syllable(cons.char, m.sign),        /* reveal only after answering */
    targetName: cons.r + m.vowel,
    prompt: 'Drag the matra onto the letter to make this sound.'
  };
}

/* ---- sound match -------------------------------------------------------
   Hear it, tap it. Audio-first, so it works before the child can read a
   thing — the Stage 0/1 workhorse. `kind` picks the pool: letters (default),
   vowels, matras, numerals or barakhadi syllables. */
function soundMatch(script, opts) {
  script = resolveScript(script);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var n = opts.options || 4;
  var kind = opts.kind || 'letter';
  var pool, item, i;
  var wantItem = opts.item;      /* the planner's pin; a local so opts is never mutated */

  if (kind === 'vowel') pool = script.vowels;
  else if (kind === 'matra') pool = gridMatras(script);
  else if (kind === 'numeral') pool = script.numerals;
  else if (kind === 'syllable') {
    /* build a small pool of barakhadi syllables across random consonants.
       PHASE 1: when the planner pins a MATRA (opts.item is a sign), the first
       syllable is built with that matra and becomes the answer, so a session
       can drill the sign it just introduced through syllable discrimination. */
    pool = [];
    var pinnedM = null;
    if (wantItem) { for (i = 0; i < script.matras.length; i++) { if (script.matras[i].sign === wantItem) { pinnedM = script.matras[i]; break; } } }
    var cons = sample(rng, script.consonants, 6), ms = gridMatras(script), c, m;
    for (i = 0; i < cons.length; i++) {
      c = cons[i]; m = (i === 0 && pinnedM) ? pinnedM : pick(rng, ms);
      pool.push({ char: syllable(c.char, m.sign), name: c.r + m.vowel, matra: m.sign, audio: script.audioNs + '/bk-' + c.name + '-' + m.name, group: 'syllable' });
    }
    if (pinnedM) wantItem = pool[0].char;   /* the pin now names a pool member */
  } else {
    pool = script.consonants;
    /* stage 1's items are vowels AND consonants; a pinned vowel flips the
       pool so the drill discriminates vowel-against-vowel, the useful cut */
    if (wantItem) { for (i = 0; i < script.vowels.length; i++) { if (script.vowels[i].char === wantItem) { pool = script.vowels; break; } } }
  }

  item = wantItem ? (function () { var k; for (k = 0; k < pool.length; k++) { if (pool[k].char === wantItem || pool[k].sign === wantItem) return pool[k]; } return pick(rng, pool); }()) : pick(rng, pool);
  var key = item.char || item.sign;
  /* Prefer distractors from the same sound family — that is the hard, and
     therefore the useful, discrimination. Fill from anywhere if short. */
  var near = [], far = [];
  for (i = 0; i < pool.length; i++) {
    var p = pool[i], pk = p.char || p.sign;
    if (pk === key) continue;
    if (p.group && item.group && p.group === item.group) near.push(p); else far.push(p);
  }
  var wrong = sample(rng, near, n - 1);
  if (wrong.length < n - 1) wrong = wrong.concat(sample(rng, far, n - 1 - wrong.length));
  var options = shuffle(rng, [item].concat(wrong)), opt = [];
  for (i = 0; i < options.length; i++) {
    opt.push({ char: options[i].char || options[i].sign, name: options[i].name, audio: options[i].audio });
  }
  return {
    type: 'soundMatch', script: script.id, direction: script.direction, font: script.font,
    kind: kind, audio: item.audio, say: key, options: opt,
    itemKey: kind === 'syllable' ? (item.matra ? 'matra:' + item.matra : null)
           : kind === 'matra' ? 'matra:' + key
           : kind === 'numeral' ? null : 'letter:' + key,
    answer: key, answerName: item.name,
    answerIndex: (function () { var k; for (k = 0; k < opt.length; k++) { if (opt[k].char === key) return k; } return -1; }()),
    prompt: 'Listen, then tap the one you heard.'
  };
}

/* ---- word build --------------------------------------------------------
   Assemble a word from letter tiles. This is what replaces typing outright.
   Tiles are grapheme clusters, so a matra travels with its letter and a
   conjunct stays whole — which is how a child reads them anyway. */
/* ================================ PHASE B — PRODUCTION ==================
   Everything before this point is recognition: choose, or arrange tiles that
   were handed to you. A child could finish the whole ladder without ever
   producing a word from nothing, and that is precisely the gap a heritage
   learner falls into — they understand Nani perfectly and cannot answer her.

   `produce` is the fourth interaction family. The child is given a meaning
   and a sound and writes the word themselves, from an empty box.

   The grader below is the reason this is worth doing properly. String
   equality would mark "किताब" wrong for "कीताब" and say nothing useful. A
   child who wrote the wrong LENGTH of a vowel sign has made a completely
   different mistake from one who wrote a different word, and the app should
   know which. Every rule here reads the SCRIPT MODULE — matra names, nukta
   letters, the virama — so it works for Gurmukhi and Bengali unchanged. */

/* Two matras are a length pair when one name is the other's first letter
   doubled: i/ii, u/uu. Derived, not listed, so a new script gets it free. */
function matraLengthPair(a, b) {
  if (!a || !b || a === b) return false;
  var x = String(a), y = String(b);
  return (y === x + x.charAt(0)) || (x === y + y.charAt(0));
}
function scriptIndex(script) {
  if (script._pIdx) return script._pIdx;
  var idx = { matraByName: {}, nameBySign: {}, nukta: {}, deNukta: {} }, i;
  for (i = 0; i < (script.matras || []).length; i++) {
    idx.matraByName[script.matras[i].name] = script.matras[i].sign;
    idx.nameBySign[script.matras[i].sign] = script.matras[i].name;
  }
  /* nuktaLetters is [{ char, base }] or [char] depending on the script file;
     accept both rather than making every script file agree first. */
  for (i = 0; i < (script.nuktaLetters || []).length; i++) {
    var n = script.nuktaLetters[i];
    var ch = n && n.char ? n.char : n, base = n && n.base ? n.base : null;
    if (!ch) continue;
    idx.nukta[ch] = 1;
    if (base) idx.deNukta[ch] = base;
  }
  script._pIdx = idx;
  return idx;
}
/* strip the invisible joiners a soft keyboard can leave behind — they are
   never the child's mistake and must never be marked as one */
function normalise(t) {
  t = String(t == null ? '' : t).replace(/[​-‍﻿]/g, '').trim();
  return t.normalize ? t.normalize('NFC') : t;
}

/* gradeWritten(script, given, want) ->
     { ok, near, why }
   `near` names the KIND of near-miss so the UI can colour it differently
   from a plain wrong, and `why` is one warm teaching line, never a scold. */
function gradeWritten(script, given, want) {
  script = resolveScript(script);
  var g = normalise(given), w = normalise(want);
  if (!g) return { ok: false, near: null, why: '' };
  if (g === w) return { ok: true, near: null, why: '' };

  var idx = scriptIndex(script);

  /* whole-word checks first — these are about one mark, anywhere */
  var strip = function (t, re) { return t.replace(re, ''); };
  var NASAL = /[ऀँंਁਂঁং]/g;   /* candra/anusvara, incl. Gurmukhi + Bengali */
  if (strip(g, NASAL) === strip(w, NASAL)) {
    return { ok: false, near: 'nasal',
      why: 'So close — that word carries a small nasal mark. Say it slowly and listen for the hum.' };
  }
  var vir = script.virama;
  if (vir && g.split(vir).join('') === w.split(vir).join('')) {
    return { ok: false, near: 'halant',
      why: 'Nearly. Two consonants there are joined, with no vowel between them.' };
  }
  /* nukta: compare with every nukta letter folded to its base */
  if (Object.keys(idx.deNukta).length) {
    var fold = function (t) {
      var o = '', i, c;
      for (i = 0; i < t.length; i++) { c = t.charAt(i); o += (idx.deNukta[c] || c); }
      return o;
    };
    if (fold(g) === fold(w) ) {
      return { ok: false, near: 'nukta',
        why: 'Almost — one letter needs the little dot underneath, which changes its sound.' };
    }
  }

  /* cluster-by-cluster, for matra mistakes */
  var gc = clusters(g), wc = clusters(w);
  if (gc.length === wc.length) {
    var diffs = [], i;
    for (i = 0; i < wc.length; i++) if (gc[i] !== wc[i]) diffs.push(i);
    if (diffs.length === 1) {
      var a = gc[diffs[0]], b = wc[diffs[0]];
      var am = a.charAt(a.length - 1), bm = b.charAt(b.length - 1);
      var an = idx.nameBySign[am], bn = idx.nameBySign[bm];
      /* same base, both carry a matra, and the two are a length pair */
      if (a.charAt(0) === b.charAt(0) && an && bn && matraLengthPair(an, bn)) {
        return { ok: false, near: 'matra-length',
          why: 'The right sound, the wrong length. Listen again — is it held long, or said short?' };
      }
      /* base right, one has a matra and the other does not */
      if (a.charAt(0) === b.charAt(0) && (!!an !== !!bn)) {
        return { ok: false, near: 'matra-missing',
          why: bn ? 'The letters are right — one of them needs its vowel sign.'
                  : 'Close. One letter there has a vowel sign it does not need.' };
      }
      /* Only call it a matra mistake when the CONSONANT PART is identical.
         बिल्ली vs बिली shares a base and a final matra but differs by a whole
         conjunct, and telling a child "the vowel sign is wrong" there sends
         them to look at the one thing they got right. */
      var bare = function (c) { return an || bn ? c.replace(/.$/, '') : c; };
      if (a.charAt(0) === b.charAt(0) && an && bn && bare(a) === bare(b)) {
        return { ok: false, near: 'matra',
          why: 'The letter is right, the vowel sign on it is not. Say it slowly.' };
      }
      return { ok: false, near: 'one-letter',
        why: 'One letter away. Sound it out again from the start.' };
    }
  }
  /* A length difference is only a helpful hint if the child was writing THIS
     word at all. Nothing in common means nothing to nudge — an empty `why`
     lets the UI show the plain "not yet" rather than a nonsense clue. */
  var shares = (function () {
    var i; for (i = 0; i < g.length; i++) if (w.indexOf(g.charAt(i)) >= 0) return true;
    return false;
  }());
  if (gc.length !== wc.length && shares) {
    return { ok: false, near: gc.length < wc.length ? 'short' : 'long',
      why: gc.length < wc.length ? 'There is one more piece to come.' : 'That is one piece too many.' };
  }
  return { ok: false, near: null, why: '' };
}

/* THE KEYPAD, and the invariant under it: EVERY word this pack can ask for
   must be typeable from the keys offered.

   The first version handed over `script.matras` and nothing else, and Hindi's
   माँ became unanswerable — chandrabindu is not a matra, so there was no key
   for it and the child could type मा and no further. A stage that cannot be
   completed is worse than one that is missing.

   So the marks are DERIVED from the pack's own lexicon: every combining mark
   any word actually uses, minus the ones already on the matra row. Data, not
   a hand-kept list, so a new script gets its own marks for free and cannot
   silently ship an unwritable word. */
function produceKeys(pack, script) {
  pack = resolvePack(pack); script = resolveScript(script || pack);
  if (pack._pKeys) return pack._pKeys;
  var matras = chars(script.matras), cons = chars(script.consonants),
      vowels = chars(script.vowels), have = {}, i, j, c,
      extraMark = [], extraLetter = [];
  for (i = 0; i < matras.length; i++) have[matras[i]] = 1;
  for (i = 0; i < cons.length; i++) have[cons[i]] = 1;
  for (i = 0; i < vowels.length; i++) have[vowels[i]] = 1;
  if (script.virama) have[script.virama] = 1;
  for (i = 0; i < (pack.lexicon || []).length; i++) {
    var w = pack.lexicon[i].word;
    for (j = 0; j < w.length; j++) {
      c = w.charAt(j);
      if (have[c] || c === ' ') continue;
      have[c] = 1;
      /* isCombiningMark takes a CODE POINT, not a character. Passing the
         character returned false for everything and the whole derivation
         silently did nothing — which is exactly how माँ stayed unwritable.

         A mark hangs on the sign row; anything else is a letter form the
         script table did not list (Urdu's yeh-with-hamza, for one) and
         belongs with the letters. */
      if (isCombiningMark(w.charCodeAt(j))) extraMark.push(c);
      else extraLetter.push(c);
    }
  }
  pack._pKeys = { consonants: cons.concat(extraLetter), matras: matras.concat(extraMark),
                  vowels: vowels, virama: script.virama };
  return pack._pKeys;
}

/* wordProduce — write the word from its meaning and its sound.
   Deliberately drawn from words the child has already MET (the caller passes
   the word, or a theme); asking a child to spell a word they have never seen
   is a memory test, not a lesson. */
function wordProduce(pack, opts) {
  pack = resolvePack(pack);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var script = resolveScript(pack);
  var lex = pack.lexicon, i, pool = [];
  for (i = 0; i < lex.length; i++) {
    if (opts.theme && lex[i].theme !== opts.theme) continue;
    if (lex[i].word.indexOf(' ') >= 0) continue;
    if (clusters(lex[i].word).length > (opts.maxLen || 5)) continue;
    pool.push(lex[i]);
  }
  if (!pool.length) return null;
  var e = null;
  if (opts.word) { for (i = 0; i < pool.length; i++) if (pool[i].word === opts.word) e = pool[i]; }
  if (!e) e = pick(rng, pool);

  return {
    kind: 'produce',
    prompt: 'Write it',
    en: e.en,
    roman: e.roman,
    answer: e.word,
    audio: audioFor(e.audio, pack),
    /* the keypad the UI offers: this script's own consonants and matras, not
       a system keyboard — the abugida model s2 already teaches IS the input */
    keys: produceKeys(pack, script),
    /* graded through the SAME Leitner machinery as everything else, under its
       own key: recognising पानी and writing पानी are different skills and the
       SRS must be able to tell them apart. */
    srsKey: 'write:' + e.word,
    grade: function (given) { return gradeWritten(script, given, e.word); }
  };
}

function wordBuild(pack, opts) {
  pack = resolvePack(pack);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var script = resolveScript(pack);
  var lex = pack.lexicon, i, pool = [];
  for (i = 0; i < lex.length; i++) {
    if (opts.theme && lex[i].theme !== opts.theme) continue;
    if (lex[i].word.indexOf(' ') >= 0) continue;              /* single-token words only */
    if (opts.maxTiles && clusters(lex[i].word).length > opts.maxTiles) continue;
    pool.push(lex[i]);
  }
  if (!pool.length) pool = lex;
  var w = opts.word ? (function () { var k; for (k = 0; k < lex.length; k++) { if (lex[k].word === opts.word) return lex[k]; } return pick(rng, pool); }()) : pick(rng, pool);
  var parts = clusters(w.word);
  var tiles = shuffle(rng, parts);
  /* never hand back the tiles already in order — it reads as a bug to a child */
  var same = true;
  for (i = 0; i < parts.length; i++) { if (tiles[i] !== parts[i]) { same = false; break; } }
  if (same && parts.length > 1) { var t = tiles[0]; tiles[0] = tiles[1]; tiles[1] = t; }
  /* a couple of plausible extra tiles, so it is not pure elimination */
  var extras = [];
  if (opts.decoys !== 0 && parts.length <= 5) {
    var dn = opts.decoys || 2, cands = sample(rng, script.consonants, dn + 3, function (c) { return indexOf(parts, c.char) >= 0; });
    for (i = 0; i < cands.length && extras.length < dn; i++) extras.push(cands[i].char);
  }
  return {
    type: 'wordBuild', pack: pack.id, script: script.id, direction: script.direction, font: script.font,
    itemKey: 'word:' + w.word,
    word: w.word, roman: w.roman, en: w.en, theme: w.theme,
    audio: audioFor(w.audio, pack), say: w.word,
    tiles: shuffle(rng, tiles.concat(extras)),
    answer: parts, answerWord: w.word,
    prompt: 'Tap the letters in order to build the word.'
  };
}

/* ---- odd one out -------------------------------------------------------
   Discrimination: sound families, and long vs short vowels — the two things
   a heritage child's ear knows but their eye does not yet.
   `why` is the after-the-fact explanation. Never render it up front. */
function oddOneOut(script, opts) {
  script = resolveScript(script);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var strategies = opts.strategy ? [opts.strategy] : ['family', 'length', 'kind'];
  /* PHASE 1: the planner can pin the LETTER being drilled — the pinned letter
     becomes the odd one out, so answering the question is meeting that letter.
     A consonant pins the family strategy, a vowel with a length pins length;
     anything else (अं, numerals) falls back to the unpinned draw. */
  var pinned = null;
  if (opts.item) {
    pinned = consonantByChar(script, opts.item);
    if (pinned && pinned.group) strategies = ['family'];
    else {
      pinned = null;
      for (var pv = 0; pv < script.vowels.length; pv++) {
        var vv = script.vowels[pv];
        if (vv.char === opts.item && !vv.sign && typeof vv.short === 'boolean') { pinned = vv; strategies = ['length']; break; }
      }
    }
  }
  var strategy = pick(rng, strategies);
  var items = [], answer = null, why = '', prompt = '', i;

  function groupsOf(list) {
    var g = {}, keys = [], k;
    for (k = 0; k < list.length; k++) {
      if (!list[k].group) continue;
      if (!g[list[k].group]) { g[list[k].group] = []; keys.push(list[k].group); }
      g[list[k].group].push(list[k]);
    }
    return { map: g, keys: keys };
  }

  if (strategy === 'family') {
    /* three from one varga, one from another */
    var G = groupsOf(script.consonants);
    var big = [];
    for (i = 0; i < G.keys.length; i++) { if (G.map[G.keys[i]].length >= 3) big.push(G.keys[i]); }
    var homeKey, one;
    if (pinned && pinned.group) {
      /* pinned drill: the introduced letter is the odd one */
      one = pinned;
      homeKey = pick(rng, (function () { var o = [], k; for (k = 0; k < big.length; k++) { if (big[k] !== pinned.group) o.push(big[k]); } return o; }()));
    } else {
      homeKey = pick(rng, big);
      var otherKey = pick(rng, (function () { var o = [], k; for (k = 0; k < big.length; k++) { if (big[k] !== homeKey) o.push(big[k]); } return o; }()));
      one = pick(rng, G.map[otherKey]);
    }
    var three = sample(rng, G.map[homeKey], 3);
    answer = one.char;
    items = shuffle(rng, three.concat([one]));
    why = 'Three of them are ' + homeKey + ' sounds. That one is ' + one.group + '.';
    prompt = 'Three of these belong together. Which one does not?';
  } else if (strategy === 'length') {
    /* three long vowels and one short, or the other way round */
    var longs = [], shorts = [];
    for (i = 0; i < script.vowels.length; i++) {
      var v = script.vowels[i];
      if (v.sign) continue;                         /* anusvara/visarga forms are not a length pair */
      if (v.short === true) shorts.push(v); else if (v.short === false) longs.push(v);
    }
    var oddIsShort = rng() < 0.5 && shorts.length >= 1 && longs.length >= 3;
    if (pinned) oddIsShort = pinned.short === true;   /* pinned drill: the introduced vowel is the odd one */
    var many = oddIsShort ? longs : shorts, few = oddIsShort ? shorts : longs;
    if (many.length < 3) { many = longs; few = shorts; oddIsShort = true; pinned = null; }
    var m3 = sample(rng, many, 3), odd = pinned || pick(rng, few);
    answer = odd.char;
    items = shuffle(rng, m3.concat([odd]));
    why = oddIsShort ? 'Three of them are long vowels. That one is short.' : 'Three of them are short vowels. That one is long.';
    prompt = 'Listen to the length. Which one is different?';
  } else {
    /* three letters and a numeral — the easiest cut, good for Stage 1 */
    var letters = sample(rng, script.consonants, 3);
    var num = pick(rng, script.numerals);
    answer = num.char;
    items = shuffle(rng, letters.concat([num]));
    why = 'Three of them are letters. That one is a number.';
    prompt = 'Three of these are the same kind of thing. Which one is not?';
  }

  var out = [];
  for (i = 0; i < items.length; i++) {
    out.push({ char: items[i].char, name: items[i].name, audio: items[i].audio, group: items[i].group });
  }
  return {
    type: 'oddOneOut', script: script.id, direction: script.direction, font: script.font,
    itemKey: strategy === 'kind' ? null : 'letter:' + answer,
    strategy: strategy, items: out, answer: answer,
    answerIndex: (function () { var k; for (k = 0; k < out.length; k++) { if (out[k].char === answer) return k; } return -1; }()),
    why: why, prompt: prompt
  };
}

/* ---- conjunct split ----------------------------------------------------
   Break क्ष into क + ष. The hardest reading skill, made visual. Gurmukhi
   needs it far less (only ਹ ਰ ਵ subjoin) which the data already encodes. */
function conjunctSplit(script, opts) {
  script = resolveScript(script);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var cj = opts.conjunct ? (function () { var i; for (i = 0; i < script.hardConjuncts.length; i++) { if (script.hardConjuncts[i].char === opts.conjunct) return script.hardConjuncts[i]; } return pick(rng, script.hardConjuncts); }()) : pick(rng, script.hardConjuncts);
  var n = opts.options || 6;
  var wrong = sample(rng, script.consonants, n - cj.parts.length, function (c) { return indexOf(cj.parts, c.char) >= 0; });
  var tiles = [], i;
  for (i = 0; i < cj.parts.length; i++) {
    var p = consonantByChar(script, cj.parts[i]);
    tiles.push({ char: cj.parts[i], name: p ? p.name : '', audio: p ? p.audio : '' });
  }
  for (i = 0; i < wrong.length; i++) tiles.push({ char: wrong[i].char, name: wrong[i].name, audio: wrong[i].audio });
  return {
    type: 'conjunctSplit', script: script.id, direction: script.direction, font: script.font,
    itemKey: 'conjunct:' + cj.char,
    conjunct: cj.char, conjunctName: cj.name, audio: cj.audio, word: cj.word,
    tiles: shuffle(rng, tiles), answer: cj.parts, parts: cj.parts,
    virama: script.virama,
    prompt: 'This letter is two letters holding hands. Which two?'
  };
}

/* ---- listen and point --------------------------------------------------
   Stage 0, and the only exercise with no script in it at all: hear the
   word, tap the meaning. Options are meanings, so a pre-literate child
   (Chhote mode) can play it with pictures swapped in for the glosses. */
function listenPoint(pack, opts) {
  pack = resolvePack(pack);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var n = opts.options || 4, i;
  var lex = pack.lexicon, pool = [];
  for (i = 0; i < lex.length; i++) { if (!opts.theme || lex[i].theme === opts.theme) pool.push(lex[i]); }
  if (pool.length < n) pool = lex;
  var w = opts.word ? (function () { var k; for (k = 0; k < lex.length; k++) { if (lex[k].word === opts.word) return lex[k]; } return pick(rng, pool); }()) : pick(rng, pool);
  /* distractors from the same theme: "cow vs horse" teaches more than "cow vs thank you" */
  var same = [], other = [];
  for (i = 0; i < lex.length; i++) {
    if (lex[i].word === w.word) continue;
    if (lex[i].theme === w.theme) same.push(lex[i]); else other.push(lex[i]);
  }
  var wrong = sample(rng, same, n - 1);
  if (wrong.length < n - 1) wrong = wrong.concat(sample(rng, other, n - 1 - wrong.length));
  var options = shuffle(rng, [w].concat(wrong)), opt = [];
  for (i = 0; i < options.length; i++) {
    opt.push({ en: options[i].en, word: options[i].word, roman: options[i].roman, theme: options[i].theme });
  }
  return {
    type: 'listenPoint', pack: pack.id, script: resolveScript(pack).id,
    itemKey: 'word:' + w.word,
    audio: audioFor(w.audio, pack), say: w.word, theme: w.theme,
    options: opt, answer: w.en, answerWord: w.word, roman: w.roman,
    answerIndex: (function () { var k; for (k = 0; k < opt.length; k++) { if (opt[k].word === w.word) return k; } return -1; }()),
    prompt: 'Listen. Which one is it?'
  };
}

/* ---- fill the blank ----------------------------------------------------
   PHASE 3, stage 3. The audit's finding, in the user's words, was that there
   were no word cards with sentences — and the drills showed it: a word here
   was only ever a word, built out of letter tiles or matched to a gloss,
   never once seen doing its job in a sentence. This is the exercise that
   puts it back into one. The sentence with its word taken out, what the
   whole sentence means underneath it, and four words to choose from.

   Three rules keep it honest, and all three are tested:

     - the gap is cut by exact string match on the ONE verbatim occurrence
       the data guarantees (maskWord), so nothing on screen before the answer
       contains the answer;
     - distractors are same-theme words — "roti vs chawal", not "roti vs
       Tuesday" — but never a synonym that would also fit the gap, and never
       a word already standing elsewhere in the sentence;
     - the full sentence and its romanisation are withheld until after the
       answer, the same withholding readPassage makes, because a roman line
       under the gap would let a child answer without reading the script at
       all.

   Falls back to wordBuild for any pack whose sentences are not written yet,
   which is every pack but Hindi today — the type stays listed on the stage
   so the authoring gap is visible rather than hidden. */
function sentenceBlank(pack, opts) {
  pack = resolvePack(pack);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var script = resolveScript(pack);
  var map = sentenceMap(pack);
  if (!map) return wordBuild(pack, opts);
  var lex = pack.lexicon, i, pool = [];
  for (i = 0; i < lex.length; i++) {
    if (opts.theme && lex[i].theme !== opts.theme) continue;
    if (map[lex[i].word]) pool.push(lex[i]);
  }
  if (!pool.length) return wordBuild(pack, opts);

  /* PHASE 1 pinning: the planner names the exact word this beat drills. A
     pin the sentences cannot serve is ignored, never an error. */
  var w = null;
  if (opts.word) { w = lexEntry(pack, opts.word); if (w && !map[w.word]) w = null; }
  if (!w) w = pick(rng, pool);
  var sent = map[w.word];
  var m = maskWord(sent.s, w.word);
  if (!m.matched) return wordBuild(pack, opts);   /* the guarantee failed for this row: teach something honest instead */

  var n = opts.options || 4;
  var same = [], other = [], c;
  for (i = 0; i < lex.length; i++) {
    c = lex[i];
    if (c.word === w.word) continue;
    if (sent.s.indexOf(c.word) >= 0) continue;                              /* already standing in the sentence */
    if (c.word.indexOf(w.word) >= 0 || w.word.indexOf(c.word) >= 0) continue; /* shares the answer's letters */
    if (sharesGloss(c.en, w.en)) continue;                                  /* a synonym would also fit */
    if (c.theme === w.theme) same.push(c); else other.push(c);
  }
  var wrong = sample(rng, same, n - 1);
  if (wrong.length < n - 1) wrong = wrong.concat(sample(rng, other, n - 1 - wrong.length));
  var options = shuffle(rng, [w].concat(wrong)), opt = [], ai = 0;
  for (i = 0; i < options.length; i++) {
    opt.push({ word: options[i].word, roman: options[i].roman, theme: options[i].theme });
    if (options[i].word === w.word) ai = i;
  }
  return {
    type: 'sentenceBlank', pack: pack.id, script: script.id, direction: script.direction, font: script.font,
    itemKey: 'word:' + w.word,
    /* the question itself — the sentence with a hole in it, and the meaning */
    blanked: m.text, before: m.before, after: m.after, blank: BLANK,
    en: sent.en,
    options: opt, answerIndex: ai,
    answerWord: w.word, roman: w.roman, wordEn: w.en, theme: w.theme,
    /* held back for the feedback beat, never rendered before it */
    full: sent.s, fullRoman: sent.roman,
    /* NOTHING here may be spoken before the answer: the sentence clip
       contains the word. The view reads around the gap instead, and plays
       these two only once the answer is in. */
    audio: null, say: null,
    sentAudio: sentenceKey(pack, w), wordAudio: audioFor(w.audio, pack),
    prompt: 'Which word fills the gap?'
  };
}

/* ---- read aloud --------------------------------------------------------
   Show the word, the child says it, then hears the model and self-marks or
   a parent marks. ASR optional, never required (docs/09 §5). */
function readAloud(pack, opts) {
  pack = resolvePack(pack);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var script = resolveScript(pack);
  var w = opts.word ? (function () { var k; for (k = 0; k < pack.lexicon.length; k++) { if (pack.lexicon[k].word === opts.word) return pack.lexicon[k]; } return pick(rng, pack.lexicon); }()) : pick(rng, pack.lexicon);
  return {
    type: 'readAloud', pack: pack.id, script: script.id, direction: script.direction, font: script.font,
    itemKey: 'word:' + w.word,
    word: w.word, clusters: clusters(w.word), roman: w.roman, en: w.en,
    audio: audioFor(w.audio, pack), selfMark: true,
    prompt: 'Read it out loud, then listen and see how you did.'
  };
}

/* ---- the dispatcher ----------------------------------------------------
   Which exercise a stage gets is DATA (stage.types), not a switch full of
   language names. Adding a pack that sequences differently changes the pack
   file and nothing here. */

/* ---------------------------------------------------------------------------
   SENTENCE BUILD — stage 4.

   The pack carries 68 authored sentences and, until this existed, nothing ever
   showed them: stage 4's declared types all drew from the LEXICON, so the
   sentences sat in the file as inert data. A child could learn 507 words and
   never be asked to put three of them in order, which is the whole skill Hindi
   word order actually needs.

   Tiles are whole words, not letters — the point here is SOV order and
   postpositions, not spelling, and that is already stage 3's job. Decoys are
   drawn from the same sentence's neighbours in the pack so the wrong answers are
   plausible Hindi rather than obvious filler. */
function sentenceBuild(pack, opts) {
  pack = resolvePack(pack);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var stage = stageOf(pack, 's4');
  var items = (stage && stage.items) || [];
  if (!items.length || typeof items[0] !== 'object') return wordBuild(pack, opts);
  var it = (opts.item && opts.item.hi) ? opts.item : pick(rng, items);
  /* Split on spaces; the danda stays attached to the last word so the child is
     not asked to place punctuation as if it were a word. */
  var words = String(it.hi).trim().split(/\s+/);
  var tiles = shuffle(rng, words.slice());
  var same = true, i;
  for (i = 0; i < words.length; i++) { if (tiles[i] !== words[i]) { same = false; break; } }
  if (same && words.length > 1) { var t = tiles[0]; tiles[0] = tiles[1]; tiles[1] = t; }
  return {
    type: 'sentenceBuild',
    itemKey: 'sent:' + (it.id || it.hi),
    prompt: it.en,
    say: it.hi,
    roman: it.roman,
    answer: words,
    tiles: tiles,
    point: it.point || null,
    script: resolveScript(pack).id,
    direction: resolveScript(pack).direction,
    font: resolveScript(pack).font
  };
}

/* ---------------------------------------------------------------------------
   PICK THE REPLY — stage 5.

   Same problem: 72 authored conversation turns that nothing rendered. A grown-up
   says something and the child chooses what they would say back. Distractors are
   real lines from OTHER scenes, so every option is grammatical Hindi a person
   might say — the exercise is about what fits, not about spotting the broken
   sentence. */
function pickReply(pack, opts) {
  pack = resolvePack(pack);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var i;

  /* AUTHORED SEAM (Phase 0). data-bhasha-hi-dialogues.js writes real
     exchanges with a per-distractor whyWrong line — pedagogy the adjacency
     derivation cannot produce. When it has content, the Hindi pack prefers
     it; derived pairs remain the fallback for every pack without authored
     data. Guarded for absence: the file registers an empty array until the
     content pass lands. */
  var authored = dialogueBank(pack);
  if (authored) {
    /* a pin only counts if it is an authored dialogue (has a reply) — the
       planner may still hold a derived pair from before the content landed */
    var d = (opts.item && opts.item.reply) ? opts.item : pick(rng, authored);
    /* THE CLIP KEYS, derived exactly the way tools/gen-voice-script.js derives
       them: position in the bank, 1-based, zero-padded. The dialogues had no
       audio keys at all, which is why the conversation stage was silent even
       once recordings existed — a clip nothing asks for never plays. Derived
       rather than stored so the recording script and the engine cannot drift.

       A distractor without a recording simply has no button; the reply and the
       prompt are what the stage needs to be usable. */
    var dn = indexOf(authored, d) + 1;
    var ns = (pack.voice && pack.voice.ns) || pack.id;
    var dk = dn > 0 ? ns + '/d-' + (dn < 10 ? '0' + dn : dn) : null;

    var os = [{ word: d.reply.hi, roman: d.reply.roman, en: d.reply.en,
                audio: dk ? dk + '-r' : null }];
    for (i = 0; i < (d.distractors || []).length && os.length < 3; i++) {
      os.push({ word: d.distractors[i].hi, roman: d.distractors[i].roman, en: d.distractors[i].en,
                whyWrong: d.distractors[i].whyWrong,
                audio: dk ? dk + '-x' + (i + 1) : null });
    }
    os = shuffle(rng, os);
    var aa = 0;
    for (i = 0; i < os.length; i++) { if (os[i].word === d.reply.hi) aa = i; }
    return {
      type: 'pickReply',
      itemKey: 'dlg:' + (d.id || d.prompt),
      prompt: d.prompt, promptRoman: d.roman, promptEn: d.en,
      audio: dk ? dk + '-p' : null, say: d.prompt,
      scene: d.scene || null, sceneEn: d.sceneEn || null, who: d.who || null,
      options: os, answerIndex: aa, answerEn: d.reply.en,
      script: resolveScript(pack).id, font: resolveScript(pack).font
    };
  }

  var stage = stageOf(pack, 's5');
  var items = (stage && stage.items) || [];
  if (!items.length || typeof items[0] !== 'object') return wordBuild(pack, opts);

  /* A turn that has a following turn in the same scene is a turn with a reply. */
  var pairs = [], i;
  for (i = 0; i < items.length - 1; i++) {
    if (items[i].scene && items[i].scene === items[i + 1].scene) pairs.push([items[i], items[i + 1]]);
  }
  if (!pairs.length) return wordBuild(pack, opts);
  var pr = (opts.item && opts.item.length === 2 && opts.item[0] && opts.item[0].hi) ? opts.item : pick(rng, pairs);
  var ask = pr[0], reply = pr[1];

  var others = [];
  for (i = 0; i < items.length; i++) {
    if (items[i].scene !== ask.scene && items[i].hi !== reply.hi) others.push(items[i]);
  }
  var opts3 = shuffle(rng, others).slice(0, 2).map(function (o) {
    return { word: o.hi, roman: o.roman, en: o.en };
  });
  opts3.push({ word: reply.hi, roman: reply.roman, en: reply.en });
  opts3 = shuffle(rng, opts3);
  var ai = 0;
  for (i = 0; i < opts3.length; i++) if (opts3[i].word === reply.hi) ai = i;

  return {
    type: 'pickReply',
    itemKey: 'dlg:' + (ask.id || ask.hi),
    prompt: ask.hi,
    promptRoman: ask.roman,
    promptEn: ask.en,
    scene: ask.scene || null,
    who: ask.who || null,
    options: opts3,
    answerIndex: ai,
    answerEn: reply.en,
    script: resolveScript(pack).id,
    font: resolveScript(pack).font
  };
}

/* ---------------------------------------------------------------------------
   READ A PASSAGE — stage 6 (Phase 0).

   The pack carries twelve authored reading passages (HI_READ) that nothing
   ever served: s6 mixed conjunct items with passage items but only the
   conjunct generator existed, so the passages sat inert. This asks the one
   thing a reader can be asked through the standard options path: read it,
   then pick what it means. The roman transliteration is withheld until after
   the answer — showing it up front would let the child bypass the script,
   which is the skill s6 exists to build. Falls back to wordBuild for packs
   whose stage 6 has no authored passages yet. */
function readPassage(pack, opts) {
  pack = resolvePack(pack);
  opts = opts || {};
  var rng = opts.rng || rngFrom(opts.seed);
  var stage = stageOf(pack, 's6');
  /* LAZILY, at question time — not baked into the stage. The pack is built when
     bhasha.js evaluates, and the registered banks load AFTER it, so folding them
     into stage.items there read an empty registry and silently kept the twelve
     authored passages. Reading the bank here is the same lateness the sentence
     and dialogue seams already rely on. */
  var items = ((stage && stage.items) || []).concat(passageBank(pack) || []), ps = [], i;
  for (i = 0; i < items.length; i++) { if (items[i] && items[i].kind === 'passage') ps.push(items[i]); }
  if (ps.length < 3) return wordBuild(pack, opts);      /* need two plausible wrong meanings */
  var p = (opts.item && opts.item.kind === 'passage') ? opts.item : pick(rng, ps);
  var others = sample(rng, ps, 2, function (x) { return x.id === p.id; });
  var os = shuffle(rng, [{ en: p.en }, { en: others[0].en }, { en: others[1].en }]);
  var ai = 0;
  for (i = 0; i < os.length; i++) { if (os[i].en === p.en) ai = i; }
  return {
    type: 'readPassage', pack: pack.id,
    itemKey: 'passage:' + p.id,
    hi: p.hi, roman: p.roman,
    /* A passage that can be HEARD as well as read. The story tellings are
       narrated already — the same Hindi, the same sentence, a clip that exists
       — so a passage drawn from one arrives with its own voice and the child
       can listen before decoding. Authored passages have no clip and simply
       carry null; the view offers no button then. */
    audio: p.audio || null,
    options: os, answerIndex: ai, answerEn: p.en,
    script: resolveScript(pack).id, direction: resolveScript(pack).direction, font: resolveScript(pack).font,
    prompt: 'Read it. What is it about?'
  };
}

/* ---------------------------------------------------------------------------
   TRACE A LETTER — stage 7 (Phase 0).

   Likhna (app/likhna.js) is the tracing canvas: it existed, complete, and
   nothing routed to it — stage 7 called itself Writing while serving tile
   assembly. This generator is deliberately thin: the engine picks WHICH
   letter (ramp order through the varnamala when the caller passes its
   running `index`, seeded-random otherwise) and the view owns the canvas.

   Honest limit: likhna's guide glyph is drawn in the Devanagari faces, and a
   letter traced in a wrong face teaches a wrong shape (CLAUDE.md's Devanagari
   rule, applied in reverse) — so packs on any other script keep the wordBuild
   fallback until likhna carries their face. */
function trace(pack, opts) {
  pack = resolvePack(pack);
  opts = opts || {};
  var script = resolveScript(pack);
  if (!script || script.id !== 'devanagari') return wordBuild(pack, opts);
  var rng = opts.rng || rngFrom(opts.seed);
  var ramp = script.vowels.concat(script.consonants);
  /* PHASE 1: a pinned letter (opts.letter) beats the running index beats the
     seeded draw — the planner names the exact letter a session drills. */
  var L = null, i;
  if (opts.letter) { for (i = 0; i < ramp.length; i++) { if (ramp[i].char === opts.letter) { L = ramp[i]; break; } } }
  if (!L) L = ramp[typeof opts.index === 'number' ? (opts.index % ramp.length) : rint(rng, ramp.length)];
  return {
    type: 'trace', pack: pack.id, script: script.id, direction: script.direction, font: script.font,
    itemKey: 'letter:' + L.char,
    letter: { char: L.char, name: L.name, audio: audioFor(L.audio, pack) },
    audio: audioFor(L.audio, pack), say: L.char,
    prompt: 'Trace the letter.'
  };
}

/* PHASE 1 — ITEM-AWARE GENERATION. `opts.item` on nextQuestion pins the exact
   thing a question drills (a letter, a matra sign, a word, a sentence object)
   so the session planner can teach an item and then ask about THAT item, not
   a random cousin. Each wrapper translates the pin into its generator's own
   parameter; every generator falls back to its pool when the pin is absent or
   does not fit (a wrong-shaped pin is ignored, never an error). */
var GENERATORS = {
  barakhadi:     function (pack, script, rng, o) { return barakhadi(script, o.consonant, { rng: rng, matra: typeof o.item === 'string' ? o.item : undefined }); },
  matraAttach:   function (pack, script, rng, o) { return matraAttach(script, { rng: rng, options: o.options, matra: typeof o.item === 'string' ? o.item : undefined }); },
  soundMatch:    function (pack, script, rng, o) { return soundMatch(script, { rng: rng, kind: o.kind, options: o.options, item: typeof o.item === 'string' ? o.item : undefined }); },
  wordBuild:     function (pack, script, rng, o) { return wordBuild(pack, { rng: rng, theme: o.theme, maxTiles: o.maxTiles, word: typeof o.item === 'string' ? o.item : undefined }); },
  oddOneOut:     function (pack, script, rng, o) { return oddOneOut(script, { rng: rng, strategy: o.strategy, item: typeof o.item === 'string' ? o.item : undefined }); },
  conjunctSplit: function (pack, script, rng, o) { return conjunctSplit(script, { rng: rng, conjunct: (o.item && o.item.hi) ? o.item.hi : (typeof o.item === 'string' ? o.item : undefined) }); },
  sentenceBuild: function (pack, script, rng, o) { return sentenceBuild(pack, { rng: rng, item: o.item }); },
  pickReply:     function (pack, script, rng, o) { return pickReply(pack, { rng: rng, item: o.item }); },
  listenPoint:   function (pack, script, rng, o) { return listenPoint(pack, { rng: rng, theme: o.theme, options: o.options, word: typeof o.item === 'string' ? o.item : undefined }); },
  sentenceBlank: function (pack, script, rng, o) { return sentenceBlank(pack, { rng: rng, theme: o.theme, options: o.options, word: typeof o.item === 'string' ? o.item : undefined }); },
  readAloud:     function (pack, script, rng, o) { return readAloud(pack, { rng: rng, word: typeof o.item === 'string' ? o.item : undefined }); },
  readPassage:   function (pack, script, rng, o) { return readPassage(pack, { rng: rng, item: o.item }); },
  trace:         function (pack, script, rng, o) { return trace(pack, { rng: rng, index: o.index, letter: typeof o.item === 'string' ? o.item : undefined }); },
  wordProduce:   function (pack, script, rng, o) { return wordProduce(pack, { rng: rng, theme: o.theme, maxLen: o.maxLen, word: typeof o.item === 'string' ? o.item : undefined }); }
};

function stageOf(pack, stageId) {
  var i;
  for (i = 0; i < pack.stages.length; i++) {
    if (pack.stages[i].id === stageId || pack.stages[i].n === stageId || pack.stages[i].name === stageId) return pack.stages[i];
  }
  return pack.stages[0];
}

/* nextQuestion('pa','s2', seed) -> a ready-to-render question object.
   Same seed, same question — deterministic, so a worksheet can be reprinted
   and a parent report can show exactly what was asked. */
function nextQuestion(packId, stageId, seed, opts) {
  var pack = resolvePack(packId);
  if (!pack) return null;
  var script = resolveScript(pack);
  var stage = stageOf(pack, stageId);
  var rng = rngFrom(seed === undefined ? (packId + ':' + stageId) : seed);
  opts = opts || {};
  var types = opts.type ? [opts.type] : (stage.types || ['soundMatch']);
  var type = pick(rng, types);
  var gen = GENERATORS[type] || GENERATORS.soundMatch;
  /* Stage-level generator options (ladder `typeOpts`) fill in anything the
     caller did not set — this is how s2 gets syllable-kind soundMatch from
     data instead of a language switch in code. Merged on a copy: the
     caller's opts object is never mutated. */
  var to = stage.typeOpts && stage.typeOpts[type], k;
  if (to) {
    var merged = {};
    for (k in opts) { if (Object.prototype.hasOwnProperty.call(opts, k)) merged[k] = opts[k]; }
    for (k in to) { if (Object.prototype.hasOwnProperty.call(to, k) && merged[k] === undefined) merged[k] = to[k]; }
    opts = merged;
  }
  var q = gen(pack, script, rng, opts);
  q.type = q.type || type;
  q.stage = stage.id;
  q.stageName = stage.name;
  q.pack = pack.id;
  q.seed = seed === undefined ? null : seed;
  /* Stage 3+ words get their audio in the pack's own voice; letter audio
     already carries the script's default namespace. */
  return q;
}

/* Every item the SRS could ever schedule for a pack, as stable keys.
   'letter:क' / 'matra:ि' / 'word:पानी' — the key is what goes in the box. */
function srsItems(packId) {
  var pack = resolvePack(packId);
  if (!pack) return [];
  var script = resolveScript(pack), out = [], i;
  for (i = 0; i < script.vowels.length; i++) out.push({ key: 'letter:' + script.vowels[i].char, kind: 'vowel', char: script.vowels[i].char, name: script.vowels[i].name, audio: script.vowels[i].audio });
  for (i = 0; i < script.consonants.length; i++) out.push({ key: 'letter:' + script.consonants[i].char, kind: 'consonant', char: script.consonants[i].char, name: script.consonants[i].name, audio: script.consonants[i].audio });
  for (i = 0; i < script.matras.length; i++) out.push({ key: 'matra:' + script.matras[i].sign, kind: 'matra', char: script.matras[i].sign, name: script.matras[i].name, audio: script.matras[i].audio });
  for (i = 0; i < pack.lexicon.length; i++) out.push({ key: 'word:' + pack.lexicon[i].word, kind: 'word', char: pack.lexicon[i].word, name: pack.lexicon[i].roman, en: pack.lexicon[i].en, theme: pack.lexicon[i].theme, audio: audioFor(pack.lexicon[i].audio, pack) });
  return out;
}

/* ================================================= THE SESSION PLANNER ===
   Phase 1 of the rebuild. nextQuestion() picks a fair random question; a
   LESSON is not random. session() plans an arc of ~12 graded beats:

       INTRODUCE  the first unseen items of stage.items IN LIST ORDER —
                  "order is the ramp" made true at last. An introduction is a
                  teach-first beat (show the thing plainly, one Got-it), and
                  each new item is then drilled twice straight away.
       DRILL      the new and the recent — items whose SRS cards sit in the
                  low boxes (0–2), the ones still wet.
       CLOSE      with review — whatever IND_SRS.due() says has slipped,
                  longest-overdue first.

   The planner reads the child's per-pack state (srs cards, rolling window,
   band, path) and never writes it — the app owns the writes. */

var SESSION_GRADED = 12;   /* graded beats per session; matches the stage target */
var MAX_INTRO = 4;         /* never more than four brand-new things in one sitting */
var TESTOUT_N = 6;         /* the test-out challenge: six questions, five to pass */
var PRACTICE_N = 4;        /* the closing practice set — see the note on practiceSet() */
var MAX_REPEATS = 3;       /* one item, one sitting: never asked more than this often */

/* which generators can be PINNED to an item of each kind — type variety for a
   drilled item comes from intersecting this with the stage's legal types */
var PIN_TYPES = {
  letter:   ['soundMatch', 'oddOneOut', 'trace'],
  matra:    ['matraAttach', 'barakhadi', 'soundMatch'],
  /* PHASE B: wordProduce is LAST on purpose. pinTypeFor walks this list in
     order for the k-th drill of an item, so a word is met by ear, then built
     from tiles, then used in a sentence, and only then written from nothing.
     Production is the last rung on a word, not the first.

     It also has to be listed HERE and not only on the stage: the stage's
     `types` is what nextQuestion picks from at random, but a planned lesson
     goes through pinTypeFor, and a type missing from this table is
     unreachable in every real lesson while still passing its unit test. */
  word:     ['listenPoint', 'wordBuild', 'sentenceBlank', 'wordProduce'],
  sent:     ['sentenceBuild'],
  dlg:      ['pickReply'],
  conjunct: ['conjunctSplit'],
  passage:  ['readPassage']
};

/* kid-warm nouns for the session preview — [singular, plural] per stage */
var STAGE_NOUN = {
  s0: ['word', 'words'], s1: ['letter', 'letters'], s2: ['matra', 'matras'],
  s3: ['word', 'words'], s4: ['sentence', 'sentences'], s5: ['reply', 'replies'],
  s6: ['conjunct', 'conjuncts'], s7: ['letter', 'letters']
};

function uniq(a) { var o = [], i; for (i = 0; i < a.length; i++) { if (indexOf(o, a[i]) < 0) o.push(a[i]); } return o; }

/* The rolling window: the last 12 graded answers for a pack, each
   { ok: 0|1, nw: 0|1 } where nw marks the item as new-ish (its card sat in
   box ≤ 2 when asked). acc is null until anything is in it. */
function windowAcc(win) {
  var i, n = 0, right = 0, newish = 0;
  for (i = 0; i < (win || []).length; i++) { n++; right += win[i].ok ? 1 : 0; newish += win[i].nw ? 1 : 0; }
  return { n: n, acc: n ? right / n : null, newish: newish };
}

/* THE BAND — a per-pack ability band 1–5, the Bee's proven rules simplified.
   CLIMB FAST, FALL SLOW: promotion needs only 10 answers at ≥80% (with at
   least 3 new-ish items among them, so coasting on old cards cannot promote);
   demotion needs a full window of 12 under 65%. A child on a good day rises
   in one session; a child on a bad day has to have a genuinely bad stretch
   before anything gets easier, and even then nothing is ever taken away —
   the band only paces how much NEW arrives. */
function bandStep(band, win) {
  var w = windowAcc(win);
  band = Math.max(1, Math.min(5, band || 1));
  if (w.n >= 10 && w.acc >= 0.80 && w.newish >= 3) return Math.min(5, band + 1);
  if (w.n >= 12 && w.acc < 0.65) return Math.max(1, band - 1);
  return band;
}

/* Every drillable unit of a stage, in ramp order, each with the stable key
   its SRS card lives under. Kinds mirror PIN_TYPES. Stages whose items are
   still the derived skeleton (a Punjabi s4's grammar-point ids) yield no
   units — the session runs unpinned there and the authoring gap stays
   visible, never papered over. */
function unitsOf(pack, stage) {
  var items = stage.items || [], out = [], i, it;
  if (!items.length) return out;
  if (stage.id === 's5') {
    /* the authored-dialogue seam first (what pickReply itself prefers) */
    var dlg = dialogueBank(pack);
    if (dlg) {
      for (i = 0; i < dlg.length; i++) out.push({ key: 'dlg:' + (dlg[i].id || dlg[i].prompt), kind: 'dlg', item: dlg[i] });
      return out;
    }
    if (typeof items[0] !== 'object') return [];
    /* derived pairs: a turn followed by a turn in the same scene */
    for (i = 0; i < items.length - 1; i++) {
      if (items[i].scene && items[i].scene === items[i + 1].scene) {
        out.push({ key: 'dlg:' + (items[i].id || items[i].hi), kind: 'dlg', item: [items[i], items[i + 1]] });
      }
    }
    return out;
  }
  for (i = 0; i < items.length; i++) {
    it = items[i];
    if (typeof it === 'object') {
      if (it.kind === 'passage') out.push({ key: 'passage:' + it.id, kind: 'passage', item: it });
      else if (it.kind === 'conjunct') out.push({ key: 'conjunct:' + it.hi, kind: 'conjunct', item: it.hi });
      else if (it.hi) out.push({ key: 'sent:' + (it.id || it.hi), kind: 'sent', item: it });
    }
    else if (stage.id === 's1' || stage.id === 's7') out.push({ key: 'letter:' + it, kind: 'letter', item: it });
    else if (stage.id === 's2') out.push({ key: 'matra:' + it, kind: 'matra', item: it });
    else if (stage.id === 's6') out.push({ key: 'conjunct:' + it, kind: 'conjunct', item: it });
    else out.push({ key: 'word:' + it, kind: 'word', item: it });   /* s0, s3 */
  }
  return out;
}

/* the teach payload for an introduce beat: the thing shown plainly */
function teachShow(pack, script, u) {
  var i, j, it = u.item;
  if (u.kind === 'letter') {
    var lists = [script.vowels, script.consonants, script.nuktaLetters || []];
    for (j = 0; j < lists.length; j++) {
      for (i = 0; i < lists[j].length; i++) {
        var L = lists[j][i];
        if (L.char === it) return { char: it, sub: 'it says “' + (L.roman || L.name) + '”', en: null, audio: audioFor(L.audio, pack), say: it };
      }
    }
    return { char: it, say: it };
  }
  if (u.kind === 'matra') {
    for (i = 0; i < script.matras.length; i++) {
      var m = script.matras[i];
      if (m.sign === it) return { char: m.example, sub: m.name + ' — the sign adds “' + m.vowel + '”', en: null, audio: audioFor(m.audio, pack), say: m.example };
    }
    return { char: it, say: it };
  }
  if (u.kind === 'word') {
    for (i = 0; i < pack.lexicon.length; i++) {
      var w = pack.lexicon[i];
      if (w.word === it) return { char: it, sub: w.roman, en: w.en, audio: audioFor(w.audio, pack), say: it };
    }
    return { char: it, say: it };
  }
  if (u.kind === 'conjunct') {
    for (i = 0; i < (script.hardConjuncts || []).length; i++) {
      var c = script.hardConjuncts[i];
      if (c.char === it) return { char: it, sub: c.parts.join(' + ') + ' holding hands', en: c.word ? 'as in ' + c.word : null, audio: c.audio ? audioFor(c.audio, pack) : null, say: it };
    }
    return { char: it, say: it };
  }
  if (u.kind === 'sent') return { char: it.hi, sub: it.roman, en: it.en, small: true, say: it.hi };
  if (u.kind === 'dlg') {
    var line = it && it.reply ? it.reply : ((it && it.length === 2) ? it[1] : it);   /* the child's own line */
    return { char: line.hi, sub: line.roman, en: line.en, small: true, say: line.hi };
  }
  if (u.kind === 'passage') return { char: it.hi, sub: it.roman, en: it.en, small: true, say: it.hi };
  return { char: String(it), say: String(it) };
}

/* the k-th drill of a unit gets the k-th legal pinnable type — that is where
   the "same item, different renderable types" variety comes from */
function pinTypeFor(u, types, k) {
  var legal = [], all = PIN_TYPES[u.kind] || [], i;
  for (i = 0; i < all.length; i++) { if (indexOf(types, all[i]) >= 0) legal.push(all[i]); }
  if (!legal.length) legal = types;
  return legal[k % legal.length];
}

function sessionSay(stage, newN, midN, reviewN) {
  var noun = STAGE_NOUN[stage.id] || ['thing', 'things'];
  var bits = [];
  if (newN) bits.push(newN + ' new ' + (newN === 1 ? noun[0] : noun[1]));
  if (!newN && midN) bits.push('practice with your ' + noun[1]);
  if (reviewN) bits.push(bits.length ? 'then your review' : 'review — catching what slipped');
  if (!bits.length) bits.push('a round of ' + noun[1]);
  return bits.join(', ');
}

/* session(packId, stageId, st, opts) -> the planned arc.

   `st` is the child's per-pack record, read-only here:
       { srs: {key: card}, window: [{ok,nw}...], band: 1-5, path: 'heritage'|'beginner' }

   opts: { now, seed, testout }. Returns:
       { specs: [...], graded, newN, drillN, reviewN, say }
   spec: { kind: 'introduce', item, key, show }         (ungraded, one Got-it)
         { kind: 'drill'|'review', item, key, type }    (graded) */
function session(packId, stageId, st, opts) {
  var pack = resolvePack(packId);
  if (!pack) return null;
  var script = resolveScript(pack);
  var stage = stageOf(pack, stageId);
  opts = opts || {};
  var now = opts.now || Date.now();
  var rng = rngFrom(opts.seed !== undefined ? opts.seed : (packId + ':' + stageId + ':' + Math.floor(now / 86400000)));
  var srs = (st && st.srs) || {};
  var units = unitsOf(pack, stage);
  var types = uniq(stage.types || ['soundMatch']);
  var i, u;

  /* TEST-OUT: six pinned questions spread evenly across the WHOLE ramp — full
     difficulty by construction, because the far end of the list is in it. */
  if (opts.testout) {
    var ts = [], n = Math.min(TESTOUT_N, units.length || TESTOUT_N);
    for (i = 0; i < n; i++) {
      if (units.length) {
        u = units[Math.min(units.length - 1, Math.floor((i + 0.5) * units.length / n))];
        ts.push({ kind: 'drill', item: u.item, key: u.key, type: pinTypeFor(u, types, i) });
      } else ts.push({ kind: 'drill', item: null, key: null, type: types[i % types.length] });
    }
    while (ts.length < TESTOUT_N) ts.push({ kind: 'drill', item: null, key: null, type: types[ts.length % types.length] });
    return { specs: ts, graded: ts.length, testout: true, newN: 0, drillN: ts.length, reviewN: 0,
             say: 'Six questions, full difficulty. Five right opens it.' };
  }

  /* split the ramp by what the cards say */
  var unseen = [], learning = [], byKey = {};
  for (i = 0; i < units.length; i++) {
    u = units[i]; u.idx = i; byKey[u.key] = u;
    var c = srs[u.key];
    if (!c) unseen.push(u);
    else if (srsBox(c) <= 2) learning.push(u);
  }
  /* the review pool: IND_SRS.due() over the child's cards for this stage,
     keeping only real reviews (box ≥ 1) — box-0 cards are still "learning" */
  var cards = [];
  for (i = 0; i < units.length; i++) { if (srs[units[i].key]) cards.push(srs[units[i].key]); }
  var dueCards = srsDue(cards, now), dueUnits = [];
  for (i = 0; i < dueCards.length; i++) {
    u = byKey[dueCards[i].key];
    if (u && srsBox(dueCards[i]) >= 1) dueUnits.push(u);
  }

  /* 85% STEERING. The window is the last 12 graded answers for this pack.
     Under ~70% the next session brings nothing new and leans on review of
     what slipped; over ~90% it brings one extra new item. In between, the
     band alone sets the pace. Simple, honest, and it never punishes — a bad
     stretch only means the session gets gentler. */
  var w = windowAcc(st && st.window);
  var band = Math.max(1, Math.min(5, (st && st.band) || 1));
  var newN = band >= 4 ? 3 : band >= 2 ? 2 : 1;
  if (w.n >= 8 && w.acc < 0.70) newN = 0;
  else if (w.n >= 8 && w.acc > 0.90) newN += 1;
  /* a brand-new stage has nothing recent to drill: rather than pound one new
     item twelve times, seed the sitting with up to four introductions */
  var anySeen = false;
  for (i = 0; i < units.length; i++) { if (srs[units[i].key]) { anySeen = true; break; } }
  if (!anySeen && newN > 0) newN = MAX_INTRO;

  /* BAND DEPTH GATE (word stages): a low band only draws NEW words from the
     front of the ramp — band 1 sees the first fifth (never fewer than 24),
     band 5 the whole list. Letters and matras are short ladders and are not
     gated. Since introduction is first-unseen-in-order, this only bites when
     a child has raced ahead of their band. */
  var depth = (stage.id === 's0' || stage.id === 's3')
    ? Math.max(24, Math.ceil(units.length * band / 5)) : units.length;
  var inReach = [];
  for (i = 0; i < unseen.length; i++) { if (unseen[i].idx < depth) inReach.push(unseen[i]); }
  newN = Math.min(newN, MAX_INTRO, inReach.length);

  /* INTRODUCE — the first unseen items IN LIST ORDER, each taught then
     drilled twice in different renderable types */
  var specs = [], intro = inReach.slice(0, newN);
  for (i = 0; i < intro.length; i++) {
    u = intro[i];
    specs.push({ kind: 'introduce', item: u.item, key: u.key, show: teachShow(pack, script, u) });
    specs.push({ kind: 'drill', item: u.item, key: u.key, type: pinTypeFor(u, types, 0) });
    specs.push({ kind: 'drill', item: u.item, key: u.key, type: pinTypeFor(u, types, 1) });
  }
  var graded = intro.length * 2;

  /* CLOSE with review — a struggling window turns most of the session over
     to it; a normal one keeps a steady tail of up to three */
  var reviewN = Math.min(dueUnits.length, (w.n >= 8 && w.acc < 0.70) ? (SESSION_GRADED - graded) : 3, SESSION_GRADED - graded);

  /* ------------------------------------------------------------- THE MIDDLE

     THE BUG THIS REPLACES, because it is worth writing down. The middle used
     to draw only from `learning` — units whose SRS card sits in box 0–2. On
     the very first sitting of a stage that is right. On the SECOND it is a
     trap: every word met yesterday was answered correctly three times, so
     every one of them is in box 3 by morning and `learning` is EMPTY. The
     fallback then fired — `intro[i % intro.length]` — and the whole middle
     went to the three words introduced minutes earlier.

     Set 2 of Sunna was therefore three words, four times each, and set 3 was
     three more. A child noticed before any test did.

     So the pool is now everything the child has actually MET and not yet
     mastered, freshest first, with today's new words in it rather than being
     the whole of it. Same twelve beats, five or six distinct words instead of
     three, and yesterday's words come back — which is the spacing the SRS was
     always for and the planner was quietly defeating. */
  var recent = [];
  for (i = 0; i < units.length; i++) {
    var rc = srs[units[i].key];
    if (!rc) continue;
    if (srsBox(rc) >= 5) continue;                 /* mastered: leave it to due() */
    recent.push(units[i]);
  }
  recent.sort(function (a, b) {
    var ca = srs[a.key] || {}, cb = srs[b.key] || {};
    return (cb.last || 0) - (ca.last || 0);        /* freshest first */
  });
  var pool = shuffle(rng, learning).concat(recent, intro);
  var seenInPool = {}, midPool = [];
  for (i = 0; i < pool.length; i++) {
    if (seenInPool[pool[i].key]) continue;
    seenInPool[pool[i].key] = 1; midPool.push(pool[i]);
  }

  /* NO ITEM MORE THAN MAX_REPEATS TIMES IN ONE SITTING. The two drills that
     follow an introduction already count, so a brand-new word gets one more
     turn and an older one gets up to three. Without this the round-robin
     below still piles up whenever the pool is short. */
  var used = {};
  for (i = 0; i < specs.length; i++) {
    /* the teach card is not a question and must not count against the cap —
       counting it put a brand-new word straight at its limit, which is how the
       first version of this fix handed the closing practice set to YESTERDAY's
       words and left today's out of it entirely */
    if (specs[i].kind === 'introduce' || !specs[i].key) continue;
    used[specs[i].key] = (used[specs[i].key] || 0) + 1;
  }
  function take(list, k) {
    var j, n = list.length;
    for (j = 0; j < n; j++) {
      var cand = list[(k + j) % n];
      if ((used[cand.key] || 0) < MAX_REPEATS) return cand;
    }
    return null;                                   /* pool exhausted, honestly */
  }

  /* THE PRACTICE SET — the last beats of the sitting, over what the sitting
     itself touched: today's new words first, then the freshest older ones. It
     is separate from `review` on purpose. Review is what the SRS says has
     slipped and it can legitimately be empty; practice is the child's own
     round-up of the lesson they just had, and a lesson should always end with
     one. It is graded like any drill — a practice set nobody marks is a
     slideshow. */
  var practiceN = Math.min(PRACTICE_N, SESSION_GRADED - graded - reviewN);
  var midN = SESSION_GRADED - graded - reviewN - practiceN;

  for (i = 0; i < midN; i++) {
    u = midPool.length ? take(midPool, i) : (units.length ? units[rint(rng, units.length)] : null);
    if (u) used[u.key] = (used[u.key] || 0) + 1;
    specs.push(u ? { kind: 'drill', item: u.item, key: u.key, type: pinTypeFor(u, types, i) }
                 : { kind: 'drill', item: null, key: null, type: types[i % types.length] });
  }

  var practicePool = intro.concat(midPool), pseen = {}, plist = [];
  for (i = 0; i < practicePool.length; i++) {
    if (pseen[practicePool[i].key]) continue;
    pseen[practicePool[i].key] = 1; plist.push(practicePool[i]);
  }
  var practiced = 0;
  for (i = 0; i < practiceN; i++) {
    u = plist.length ? take(plist, i) : null;
    if (!u) break;                                 /* nothing left that is not over its cap */
    used[u.key] = (used[u.key] || 0) + 1;
    practiced++;
    specs.push({ kind: 'practice', item: u.item, key: u.key, type: pinTypeFor(u, types, i + 2) });
  }

  /* A SITTING IS TWELVE GRADED BEATS AND STAYS TWELVE. The practice set can come
     up short -- a stage whose items are still the derived skeleton (an unauthored
     s4/s5) has no units to practise at all -- and the first version of this simply
     ended the lesson four questions early. That is not a shorter lesson, it is an
     unwinnable stage: the completion target is twelve, and the headless walk
     caught it on pa/s5 within the minute. Whatever practice could not fill goes
     back to the middle, unpinned if there is nothing to pin it to. */
  var short = SESSION_GRADED - graded - midN - practiced - reviewN;
  for (i = 0; i < short; i++) {
    u = midPool.length ? take(midPool, midN + i) : (units.length ? units[rint(rng, units.length)] : null);
    if (u) used[u.key] = (used[u.key] || 0) + 1;
    specs.push(u ? { kind: 'drill', item: u.item, key: u.key, type: pinTypeFor(u, types, midN + i) }
                 : { kind: 'drill', item: null, key: null, type: types[(midN + i) % types.length] });
  }
  midN += Math.max(0, short);

  for (i = 0; i < reviewN; i++) {
    u = dueUnits[i];
    specs.push({ kind: 'review', item: u.item, key: u.key, type: pinTypeFor(u, types, i) });
  }

  return { specs: specs, graded: graded + midN + practiced + reviewN,
           newN: intro.length, drillN: midN, practiceN: practiced, reviewN: reviewN,
           say: sessionSay(stage, intro.length, midN + practiced, reviewN) };
}

/* MISS REPLAY — an item answered wrong comes back inside the SAME session,
   once, a couple of beats ahead: long enough that it is recall and not echo,
   soon enough that the child leaves having got it right. The replayed beat is
   flagged so a second miss does not breed a third copy, and an introduce beat
   is never replayed (it was not graded). Returns the plan, mutated, so the
   caller can splice-in-place; returns it untouched when nothing is owed.

   It lives here rather than in the app because it is a rule of the lesson, and
   because a rule of the lesson should be testable without a browser. */
function replayMiss(plan, pi, spec, gap) {
  if (!plan || !plan.specs || !spec) return plan;
  if (spec.kind === 'introduce' || spec.replay) return plan;
  var at = Math.min(pi + (gap || 3), plan.specs.length);
  plan.specs.splice(at, 0, { kind: 'drill', item: spec.item, key: spec.key, type: spec.type, replay: true });
  spec.replay = true;                      /* this beat has had its second chance */
  return plan;
}

/* READINESS — what the pack page paints per stage, straight off the boxes:
   box 0 unseen → new · box 0 seen and 1–2 → learning · 3–4 → review ·
   5 → mastered. */
function readiness(packId, stageId, srs) {
  var pack = resolvePack(packId);
  if (!pack) return null;
  var stage = stageOf(pack, stageId);
  var units = unitsOf(pack, stage);
  srs = srs || {};
  var out = { total: units.length, unseen: 0, learning: 0, review: 0, mastered: 0 }, i, c, b;
  for (i = 0; i < units.length; i++) {
    c = srs[units[i].key];
    if (!c || (!c.seen && !c.intro)) { out.unseen++; continue; }
    b = srsBox(c);
    if (b >= 5) out.mastered++;
    else if (b >= 3) out.review++;
    else out.learning++;
  }
  return out;
}

W.IND_BHASHA = {
  version: 1,

  /* data access */
  scripts: W.IND_SCRIPTS,
  packs: W.IND_PACKS,
  themes: THEMES,
  script: resolveScript,
  pack: resolvePack,
  stage: function (packId, stageId) { var p = resolvePack(packId); return p ? stageOf(p, stageId) : null; },
  audioFor: audioFor,

  /* text helpers, script-generic */
  clusters: clusters,
  syllable: syllable,
  gridMatras: gridMatras,
  isCombiningMark: isCombiningMark,

  /* the example sentences (Phase 3): the map, one entry resolved with its
     derived clip key, and the masker every view and every test shares — one
     implementation of "hide the word", so the rule cannot drift per screen */
  sentences: sentenceMap,
  dialogues: dialogueBank,

  /* the grammar points as taught objects (Phase C): the bank, and one point with its
     worked examples resolved from ids to the real sentences */
  grammar: grammarBank,
  grammarPoint: grammarPoint,
  passages: passageBank,
  sentence: sentenceFor,
  mask: maskWord,
  BLANK: BLANK,

  /* exercise generators */
  sentenceBlank: sentenceBlank,
  sentenceBuild: sentenceBuild,
  wordProduce: wordProduce,      /* Phase B: write it, from nothing */
  produceKeys: produceKeys,      /* the keypad, derived from the pack's lexicon */
  gradeWritten: gradeWritten,    /* script-aware near-miss grading */
  pickReply: pickReply,
  barakhadi: barakhadi,
  matraAttach: matraAttach,
  soundMatch: soundMatch,
  wordBuild: wordBuild,
  oddOneOut: oddOneOut,
  conjunctSplit: conjunctSplit,
  listenPoint: listenPoint,
  readAloud: readAloud,
  readPassage: readPassage,
  trace: trace,
  generators: GENERATORS,

  /* the ones the UI actually calls */
  nextQuestion: nextQuestion,
  srsItems: srsItems,
  session: session,        /* the planned lesson arc (Phase 1) */
  replayMiss: replayMiss,  /* a missed item comes back in the same session */
  bandStep: bandStep,      /* climb fast, fall slow */
  readiness: readiness,    /* per-stage new/learning/review/mastered counts */

  /* deterministic randomness, exposed so a caller can drive a whole
     session from one seed */
  rng: rngFrom
};

/* ============================================================== SRS ====== */
/* Leitner boxes, no dependencies, no punishment. A miss drops one box, never
   to zero-from-the-top, because the point is to see the card again soon, not
   to take anything away from the child.

   Times are milliseconds so `now` can be Date.now() or a test's fake clock.
   Box 0 comes back in the same session; box 5 is a month out. */

var DAY = 86400000;
var BOX_MS = [10 * 60000, 1 * DAY, 2 * DAY, 4 * DAY, 8 * DAY, 16 * DAY, 32 * DAY];

function srsBox(item) {
  if (!item) return 0;
  if (typeof item.box !== 'number' || item.box < 0) item.box = 0;
  if (item.box > BOX_MS.length - 1) item.box = BOX_MS.length - 1;
  return item.box;
}

/* review(item, correct, now) -> the same item, rescheduled. */
function srsReview(item, correct, now) {
  item = item || {};
  now = now || Date.now();
  var box = srsBox(item);
  item.seen = (item.seen || 0) + 1;
  if (correct) {
    item.right = (item.right || 0) + 1;
    item.streak = (item.streak || 0) + 1;
    item.box = Math.min(BOX_MS.length - 1, box + 1);
  } else {
    item.wrong = (item.wrong || 0) + 1;
    item.streak = 0;
    item.box = Math.max(0, box - 1);
  }
  item.last = now;
  item.due = now + BOX_MS[item.box];
  return item;
}

/* due(list, now) -> everything ready for review, longest-overdue first.
   Anything never seen counts as due too, but sorts AFTER the reviews: catch
   up on what is slipping before handing the child new material. A brand new
   list is all-unseen, so it simply plays in the order it was given. */
function srsDue(list, now) {
  now = now || Date.now();
  var out = [], i, it;
  for (i = 0; i < (list || []).length; i++) {
    it = list[i];
    if (!it) continue;
    if (typeof it.due !== 'number' || it.due <= now) out.push(it);
  }
  out.sort(function (a, b) {
    var ad = typeof a.due === 'number' ? a.due : Infinity, bd = typeof b.due === 'number' ? b.due : Infinity;
    return ad === bd ? 0 : ad - bd;
  });
  return out;
}

W.IND_SRS = {
  boxes: BOX_MS.length,
  intervals: BOX_MS,
  box: srsBox,
  review: srsReview,
  due: srsDue,
  /* how far through the ladder a list is — drives the heatmap and the
     parent report, and it is the only number the child ever sees. */
  progress: function (list) {
    var i, tot = 0, sum = 0, top = BOX_MS.length - 1;
    for (i = 0; i < (list || []).length; i++) { tot++; sum += Math.min(top, srsBox(list[i])); }
    return { items: tot, mastered: (function () { var k, m = 0; for (k = 0; k < (list || []).length; k++) { if (srsBox(list[k]) >= 4) m++; } return m; }()), pct: tot ? Math.round(sum / (tot * top) * 100) : 0 };
  }
};

}(typeof window !== 'undefined' ? window : this));
