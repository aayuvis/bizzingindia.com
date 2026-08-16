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
     not read off their parts. Split on the virama in conjunctSplit(). */
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
    { char: 'च्छ', parts: ['च', 'छ'], name: 'chchha', audio: 'hi/chchha', word: 'अच्छा' }
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

var THEMES = [
  { id: 'family',   en: 'Family',  icon: '👪' },
  { id: 'food',     en: 'Food',    icon: '🍛' },
  { id: 'body',     en: 'Body',    icon: '👤' },
  { id: 'home',     en: 'Home',    icon: '🏠' },
  { id: 'animals',  en: 'Animals', icon: '🐘' },
  { id: 'colours',  en: 'Colours', icon: '🎨' },
  { id: 'numbers',  en: 'Numbers', icon: '🔢' },
  { id: 'greetings', en: 'Greetings', icon: '🙏' }
];

/* The ladder is shared shape, per-pack content. `types` is the list of
   exercise generators appropriate to the stage — keeping it in DATA is what
   lets a new pack re-sequence itself without touching nextQuestion(). */
function ladder(items) {
  return [
    { id: 's0', n: 0, name: 'Sunna',     en: 'Listening',  desc: 'Ear first. Spoken words and phrases, listen and point, no script at all.',
      outcome: 'Understands common spoken words and picks the right picture.', script: false, types: ['listenPoint'], items: items.s0 },
    { id: 's1', n: 1, name: 'Varnamala', en: 'The letters', desc: 'Every letter: its shape, its sound, its sound family.',
      outcome: 'Recognises every letter by sight and by sound.', script: true, types: ['soundMatch', 'oddOneOut'], items: items.s1 },
    { id: 's2', n: 2, name: 'Matras',    en: 'Vowel signs', desc: 'The vowel signs and the barakhadi grid — the core abugida skill.',
      outcome: 'Reads any simple word aloud.', script: true, types: ['matraAttach', 'barakhadi', 'soundMatch'], items: items.s2 },
    { id: 's3', n: 3, name: 'Shabd',     en: 'Words',       desc: 'Core words by theme: family, food, body, home, animals, colours, numbers, greetings.',
      outcome: 'Reads and understands common words.', script: true, types: ['wordBuild', 'listenPoint', 'soundMatch'], items: items.s3 },
    { id: 's4', n: 4, name: 'Vakya',     en: 'Sentences',   desc: 'Sentence order, gender, postpositions, verb agreement, tense.',
      outcome: 'Builds correct simple sentences.', script: true, types: ['wordBuild', 'oddOneOut'], items: items.s4 },
    { id: 's5', n: 5, name: 'Baat-cheet', en: 'Conversation', desc: 'Conversation scenarios: greeting elders, the market, the phone call to Nani.',
      outcome: 'Follows a short everyday exchange and picks the right reply.', script: true, types: ['listenPoint', 'wordBuild'], items: items.s5 },
    { id: 's6', n: 6, name: 'Padhna',    en: 'Reading',     desc: 'Graded readers, and the conjuncts you need to get through them.',
      outcome: 'Splits conjuncts and reads a few real sentences.', script: true, types: ['conjunctSplit', 'wordBuild', 'oddOneOut'], items: items.s6 },
    { id: 's7', n: 7, name: 'Likhna',    en: 'Writing',     desc: 'Handwriting, dictation, and short paragraph writing.',
      outcome: 'Builds words and sentences from their parts. Handwriting is not taught yet.', script: true, types: ['wordBuild', 'barakhadi'], items: items.s7 }
  ];
}

/* ---- Hindi ------------------------------------------------------------- */
/* Sixty-two core words. Vocabulary is heritage-first (docs/09 §3): what is
   actually said in the house, not invented sentences about owls. */

var HI_LEX = [
  /* family */
  { word: 'माँ',                   roman: 'maa',      en: 'mother',      theme: 'family', audio: 'hi/w-maa' },
  { word: 'पापा',             roman: 'papa',     en: 'father',      theme: 'family', audio: 'hi/w-papa' },
  { word: 'भाई',                   roman: 'bhai',     en: 'brother',     theme: 'family', audio: 'hi/w-bhai' },
  { word: 'बहन',                   roman: 'bahan',    en: 'sister',      theme: 'family', audio: 'hi/w-bahan' },
  { word: 'दादा',             roman: 'dada',     en: 'grandfather (father’s side)', theme: 'family', audio: 'hi/w-dada' },
  { word: 'दादी',             roman: 'dadi',     en: 'grandmother (father’s side)', theme: 'family', audio: 'hi/w-dadi' },
  { word: 'नाना',             roman: 'nana',     en: 'grandfather (mother’s side)', theme: 'family', audio: 'hi/w-nana' },
  { word: 'नानी',             roman: 'nani',     en: 'grandmother (mother’s side)', theme: 'family', audio: 'hi/w-nani' },
  { word: 'बच्चा',       roman: 'bachcha',  en: 'child',       theme: 'family', audio: 'hi/w-bachcha' },
  { word: 'परिवार', roman: 'parivaar', en: 'family',      theme: 'family', audio: 'hi/w-parivaar' },
  /* food */
  { word: 'पानी',             roman: 'paani',    en: 'water',       theme: 'food', audio: 'hi/w-paani' },
  { word: 'रोटी',             roman: 'roti',     en: 'bread',       theme: 'food', audio: 'hi/w-roti' },
  { word: 'दूध',                   roman: 'doodh',    en: 'milk',        theme: 'food', audio: 'hi/w-doodh' },
  { word: 'चावल',             roman: 'chaawal',  en: 'rice',        theme: 'food', audio: 'hi/w-chaawal' },
  { word: 'दाल',                   roman: 'daal',     en: 'lentils',     theme: 'food', audio: 'hi/w-daal' },
  { word: 'आम',                         roman: 'aam',      en: 'mango',       theme: 'food', audio: 'hi/w-aam' },
  { word: 'केला',             roman: 'kela',     en: 'banana',      theme: 'food', audio: 'hi/w-kela' },
  { word: 'मिठाई',       roman: 'mithai',   en: 'sweets',      theme: 'food', audio: 'hi/w-mithai' },
  { word: 'चाय',                   roman: 'chai',     en: 'tea',         theme: 'food', audio: 'hi/w-chai' },
  { word: 'नमक',                   roman: 'namak',    en: 'salt',        theme: 'food', audio: 'hi/w-namak' },
  /* body */
  { word: 'सिर',                   roman: 'sir',      en: 'head',        theme: 'body', audio: 'hi/w-sir' },
  { word: 'आँख',                   roman: 'aankh',    en: 'eye',         theme: 'body', audio: 'hi/w-aankh' },
  { word: 'नाक',                   roman: 'naak',     en: 'nose',        theme: 'body', audio: 'hi/w-naak' },
  { word: 'कान',                   roman: 'kaan',     en: 'ear',         theme: 'body', audio: 'hi/w-kaan' },
  { word: 'मुँह',             roman: 'munh',     en: 'mouth',       theme: 'body', audio: 'hi/w-munh' },
  { word: 'हाथ',                   roman: 'haath',    en: 'hand',        theme: 'body', audio: 'hi/w-haath' },
  { word: 'पैर',                   roman: 'pair',     en: 'foot',        theme: 'body', audio: 'hi/w-pair' },
  { word: 'पेट',                   roman: 'pet',      en: 'tummy',       theme: 'body', audio: 'hi/w-pet' },
  { word: 'बाल',                   roman: 'baal',     en: 'hair',        theme: 'body', audio: 'hi/w-baal' },
  { word: 'दाँत',             roman: 'daant',    en: 'tooth',       theme: 'body', audio: 'hi/w-daant' },
  /* home */
  { word: 'घर',                         roman: 'ghar',     en: 'house',       theme: 'home', audio: 'hi/w-ghar' },
  { word: 'दरवाज़ा', roman: 'darwaaza', en: 'door',  theme: 'home', audio: 'hi/w-darwaaza' },
  { word: 'खिड़की', roman: 'khidki',   en: 'window',      theme: 'home', audio: 'hi/w-khidki' },
  { word: 'कुर्सी', roman: 'kursi',    en: 'chair',       theme: 'home', audio: 'hi/w-kursi' },
  { word: 'मेज़',             roman: 'mez',      en: 'table',       theme: 'home', audio: 'hi/w-mez' },
  { word: 'चाबी',             roman: 'chaabi',   en: 'key',         theme: 'home', audio: 'hi/w-chaabi' },
  { word: 'बिस्तर', roman: 'bistar',   en: 'bed',         theme: 'home', audio: 'hi/w-bistar' },
  { word: 'छत',                         roman: 'chhat',    en: 'roof',        theme: 'home', audio: 'hi/w-chhat' },
  { word: 'रसोई',             roman: 'rasoi',    en: 'kitchen',     theme: 'home', audio: 'hi/w-rasoi' },
  /* animals */
  { word: 'हाथी',             roman: 'haathi',   en: 'elephant',    theme: 'animals', audio: 'hi/w-haathi' },
  { word: 'कुत्ता', roman: 'kutta',    en: 'dog',         theme: 'animals', audio: 'hi/w-kutta' },
  { word: 'बिल्ली', roman: 'billi',    en: 'cat',         theme: 'animals', audio: 'hi/w-billi' },
  { word: 'गाय',                   roman: 'gaay',     en: 'cow',         theme: 'animals', audio: 'hi/w-gaay' },
  { word: 'बंदर',             roman: 'bandar',   en: 'monkey',      theme: 'animals', audio: 'hi/w-bandar' },
  { word: 'शेर',                   roman: 'sher',     en: 'lion',        theme: 'animals', audio: 'hi/w-sher' },
  { word: 'चिड़िया', roman: 'chidiya', en: 'bird',   theme: 'animals', audio: 'hi/w-chidiya' },
  { word: 'मछली',             roman: 'machhli',  en: 'fish',        theme: 'animals', audio: 'hi/w-machhli' },
  { word: 'घोड़ा',       roman: 'ghoda',    en: 'horse',       theme: 'animals', audio: 'hi/w-ghoda' },
  { word: 'तितली',       roman: 'titli',    en: 'butterfly',   theme: 'animals', audio: 'hi/w-titli' },
  /* colours */
  { word: 'लाल',                   roman: 'laal',     en: 'red',         theme: 'colours', audio: 'hi/w-laal' },
  { word: 'नीला',             roman: 'neela',    en: 'blue',        theme: 'colours', audio: 'hi/w-neela' },
  { word: 'पीला',             roman: 'peela',    en: 'yellow',      theme: 'colours', audio: 'hi/w-peela' },
  { word: 'हरा',                   roman: 'hara',     en: 'green',       theme: 'colours', audio: 'hi/w-hara' },
  { word: 'काला',             roman: 'kaala',    en: 'black',       theme: 'colours', audio: 'hi/w-kaala' },
  { word: 'सफ़ेद',       roman: 'safed',    en: 'white',       theme: 'colours', audio: 'hi/w-safed' },
  { word: 'नारंगी', roman: 'naarangi', en: 'orange',      theme: 'colours', audio: 'hi/w-naarangi' },
  { word: 'गुलाबी', roman: 'gulaabi',  en: 'pink',        theme: 'colours', audio: 'hi/w-gulaabi' },
  /* numbers */
  { word: 'एक',                         roman: 'ek',       en: 'one',         theme: 'numbers', audio: 'hi/w-ek', value: 1 },
  { word: 'दो',                         roman: 'do',       en: 'two',         theme: 'numbers', audio: 'hi/w-do', value: 2 },
  { word: 'तीन',                   roman: 'teen',     en: 'three',       theme: 'numbers', audio: 'hi/w-teen', value: 3 },
  { word: 'चार',                   roman: 'chaar',    en: 'four',        theme: 'numbers', audio: 'hi/w-chaar', value: 4 },
  { word: 'पाँच',             roman: 'paanch',   en: 'five',        theme: 'numbers', audio: 'hi/w-paanch', value: 5 },
  { word: 'छह',                         roman: 'chhah',    en: 'six',         theme: 'numbers', audio: 'hi/w-chhah', value: 6 },
  { word: 'सात',                   roman: 'saat',     en: 'seven',       theme: 'numbers', audio: 'hi/w-saat', value: 7 },
  { word: 'आठ',                         roman: 'aath',     en: 'eight',       theme: 'numbers', audio: 'hi/w-aath', value: 8 },
  { word: 'नौ',                         roman: 'nau',      en: 'nine',        theme: 'numbers', audio: 'hi/w-nau', value: 9 },
  { word: 'दस',                         roman: 'das',      en: 'ten',         theme: 'numbers', audio: 'hi/w-das', value: 10 },
  /* greetings */
  { word: 'नमस्ते', roman: 'namaste',  en: 'hello',       theme: 'greetings', audio: 'hi/w-namaste' },
  { word: 'धन्यवाद', roman: 'dhanyavaad', en: 'thank you', theme: 'greetings', audio: 'hi/w-dhanyavaad' },
  { word: 'हाँ',                   roman: 'haan',     en: 'yes',         theme: 'greetings', audio: 'hi/w-haan' },
  { word: 'नहीं',             roman: 'nahin',    en: 'no',          theme: 'greetings', audio: 'hi/w-nahin' },
  { word: 'अच्छा',       roman: 'achchha',  en: 'good, okay',  theme: 'greetings', audio: 'hi/w-achchha' },
  { word: 'शुक्रिया', roman: 'shukriya', en: 'thanks', theme: 'greetings', audio: 'hi/w-shukriya' },
  { word: 'अलविदा', roman: 'alvida',   en: 'goodbye',     theme: 'greetings', audio: 'hi/w-alvida' }
];

/* ---- Punjabi ----------------------------------------------------------- */
/* The same eight themes, the same shape, a different script module. This is
   the whole thesis: the diff between these two packs is content only. */

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
  { word: 'ਰੱਬ ਰਾਖਾ', roman: 'rabb raakha', en: 'goodbye', theme: 'greetings', audio: 'pa/w-rabbrakha' }
];

/* Stage items are keys, not prose: the letters/signs/words the stage owns.
   Built from the script module and lexicon so they cannot fall out of sync. */
function chars(list) { var i, o = []; for (i = 0; i < list.length; i++) { o.push(list[i].char || list[i].sign || list[i].word); } return o; }
function themeWords(lex, theme) { var i, o = []; for (i = 0; i < lex.length; i++) { if (lex[i].theme === theme) o.push(lex[i].word); } return o; }
function stageItems(script, lex) {
  return {
    s0: themeWords(lex, 'greetings').concat(themeWords(lex, 'family'), themeWords(lex, 'food')),
    s1: chars(script.vowels).concat(chars(script.consonants)),
    s2: chars(script.matras),
    s3: chars(lex),
    s4: ['sov-order', 'gender', 'postpositions', 'verb-agreement', 'tense-present', 'tense-past', 'tense-future'],
    s5: ['greeting-elders', 'the-market', 'phone-to-nani', 'at-a-wedding', 'ordering-food', 'at-school', 'asking-the-way'],
    s6: chars(script.hardConjuncts),
    s7: chars(script.consonants)
  };
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
  stages: ladder(stageItems(DEVANAGARI, HI_LEX))
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
   Gurmukhi gives 10 (ਕ ਕਾ ਕਿ ਕੀ ਕੁ ਕੂ ਕੇ ਕੈ ਕੋ ਕੌ). Same function. */
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
  return {
    type: 'barakhadi', script: script.id, direction: script.direction, font: script.font,
    base: cons.char, baseName: cons.name, baseAudio: cons.audio,
    cells: cells, cols: cells.length,
    prompt: 'Tap each one and hear it change.'
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
  var m = opts.matra ? (function () { var i; for (i = 0; i < ms.length; i++) { if (ms[i].sign === opts.matra) return ms[i]; } return pick(rng, ms); }()) : pick(rng, ms);
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

  if (kind === 'vowel') pool = script.vowels;
  else if (kind === 'matra') pool = gridMatras(script);
  else if (kind === 'numeral') pool = script.numerals;
  else if (kind === 'syllable') {
    /* build a small pool of barakhadi syllables across random consonants */
    pool = [];
    var cons = sample(rng, script.consonants, 6), ms = gridMatras(script), c, m;
    for (i = 0; i < cons.length; i++) {
      c = cons[i]; m = pick(rng, ms);
      pool.push({ char: syllable(c.char, m.sign), name: c.r + m.vowel, audio: script.audioNs + '/bk-' + c.name + '-' + m.name, group: 'syllable' });
    }
  } else pool = script.consonants;

  item = opts.item ? (function () { var k; for (k = 0; k < pool.length; k++) { if (pool[k].char === opts.item || pool[k].sign === opts.item) return pool[k]; } return pick(rng, pool); }()) : pick(rng, pool);
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
    kind: kind, audio: item.audio, options: opt,
    answer: key, answerName: item.name,
    answerIndex: (function () { var k; for (k = 0; k < opt.length; k++) { if (opt[k].char === key) return k; } return -1; }()),
    prompt: 'Listen, then tap the one you heard.'
  };
}

/* ---- word build --------------------------------------------------------
   Assemble a word from letter tiles. This is what replaces typing outright.
   Tiles are grapheme clusters, so a matra travels with its letter and a
   conjunct stays whole — which is how a child reads them anyway. */
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
    word: w.word, roman: w.roman, en: w.en, theme: w.theme,
    audio: audioFor(w.audio, pack),
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
    var homeKey = pick(rng, big);
    var otherKey = pick(rng, (function () { var o = [], k; for (k = 0; k < big.length; k++) { if (big[k] !== homeKey) o.push(big[k]); } return o; }()));
    var three = sample(rng, G.map[homeKey], 3);
    var one = pick(rng, G.map[otherKey]);
    answer = one.char;
    items = shuffle(rng, three.concat([one]));
    why = 'Three of them are ' + homeKey + ' sounds. That one is ' + otherKey + '.';
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
    var many = oddIsShort ? longs : shorts, few = oddIsShort ? shorts : longs;
    if (many.length < 3) { many = longs; few = shorts; oddIsShort = true; }
    var m3 = sample(rng, many, 3), odd = pick(rng, few);
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
    audio: audioFor(w.audio, pack), theme: w.theme,
    options: opt, answer: w.en, answerWord: w.word, roman: w.roman,
    answerIndex: (function () { var k; for (k = 0; k < opt.length; k++) { if (opt[k].word === w.word) return k; } return -1; }()),
    prompt: 'Listen. Which one is it?'
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
    word: w.word, clusters: clusters(w.word), roman: w.roman, en: w.en,
    audio: audioFor(w.audio, pack), selfMark: true,
    prompt: 'Read it out loud, then listen and see how you did.'
  };
}

/* ---- the dispatcher ----------------------------------------------------
   Which exercise a stage gets is DATA (stage.types), not a switch full of
   language names. Adding a pack that sequences differently changes the pack
   file and nothing here. */
var GENERATORS = {
  barakhadi:     function (pack, script, rng, o) { return barakhadi(script, o.consonant, { rng: rng }); },
  matraAttach:   function (pack, script, rng, o) { return matraAttach(script, { rng: rng, options: o.options }); },
  soundMatch:    function (pack, script, rng, o) { return soundMatch(script, { rng: rng, kind: o.kind, options: o.options }); },
  wordBuild:     function (pack, script, rng, o) { return wordBuild(pack, { rng: rng, theme: o.theme, maxTiles: o.maxTiles }); },
  oddOneOut:     function (pack, script, rng, o) { return oddOneOut(script, { rng: rng, strategy: o.strategy }); },
  conjunctSplit: function (pack, script, rng, o) { return conjunctSplit(script, { rng: rng }); },
  listenPoint:   function (pack, script, rng, o) { return listenPoint(pack, { rng: rng, theme: o.theme, options: o.options }); },
  readAloud:     function (pack, script, rng, o) { return readAloud(pack, { rng: rng }); }
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

  /* exercise generators */
  barakhadi: barakhadi,
  matraAttach: matraAttach,
  soundMatch: soundMatch,
  wordBuild: wordBuild,
  oddOneOut: oddOneOut,
  conjunctSplit: conjunctSplit,
  listenPoint: listenPoint,
  readAloud: readAloud,
  generators: GENERATORS,

  /* the one the UI actually calls */
  nextQuestion: nextQuestion,
  srsItems: srsItems,

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
