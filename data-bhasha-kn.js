"use strict";
/* =====================================================================
   Bizzing India — Bhasha pack: Kannada (ಕನ್ನಡ).

   A sibling pack file in the shape docs/09 promised: a script module for
   the Kannada script (U+0C80–U+0CFF) plus a language pack for Kannada,
   registered through window.IND_BHASHA_KIT. Loads AFTER app/bhasha.js;
   tools/test-bhasha.js loads and sweeps it automatically.

   Every glyph below is a VERIFIED CODEPOINT — checked with node against
   the Unicode Kannada block, never transcribed by eye. The NFC forms of
   the two-part-looking vowel signs were confirmed the same way (see the
   matra comment).

   STATUS: a codepoint-verified DRAFT. The letters and numerals are
   mechanical facts; the lexicon's word choices, glosses and colloquial
   register need a native Kannada speaker's pass before ship — the items
   flagged "native-speaker" below first. reviewedBy is empty until then.
   ===================================================================== */

(function (W) {

var K = W.IND_BHASHA_KIT;

/* ==================================================== KANNADA SCRIPT ===== */
/* U+0C80–U+0CFF. Serves Kannada; historically also Tulu and Konkani in
   coastal Karnataka, which stay out of `languages` until a pack exists.

   No shirorekha: unlike Devanagari and Gurmukhi there is NO headline bar
   to join letters under — Kannada letters are round and open-topped, each
   crowned with its own talekattu (the little check-mark). So headline is
   false, and no UI rule about an unbroken top bar applies here. */

var KANNADA = {
  id: 'kannada',
  name: 'Kannada',
  nativeName: 'ಕನ್ನಡ',
  block: [0x0C80, 0x0CFF],
  direction: 'ltr',
  headline: false,                /* no shirorekha — round letters, talekattu on top */
  inherent: 'a',
  virama: '್',               /* ್  U+0CCD, the halant */
  audioNs: 'kn',
  languages: ['kn'],
  font: { family: 'Noto Sans Kannada', fallback: 'sans-serif', minSize: 17, lineHeight: 1.8, scale: 1.12 },
  /* lineHeight 1.8 rather than 1.75: Kannada conjuncts subjoin BELOW the
     base letter, so a line needs slightly more air than Devanagari's. */
  notes: 'No shirorekha. Round, open-topped letters; conjuncts hang below the base.',

  /* 13 swara plus the ಅಂ/ಅಃ sign rows every varnamale chart ends on.
     THE BIG DIFFERENCE FROM HINDI: Kannada (like Telugu, Tamil and
     Malayalam) has SHORT ಎ/ಒ distinct from LONG ಏ/ಓ — e and o come in
     length pairs exactly like a/aa and i/ii. A Hindi-trained ear misses
     this; the pairOf marks below are what feed the length drills. */
  vowels: [
    { char: 'ಅ',         name: 'a',   roman: 'a',  audio: 'kn/l-0',  group: 'svara', short: true },
    { char: 'ಆ',         name: 'aa',  roman: 'ā',  audio: 'kn/l-1',  group: 'svara', short: false, pairOf: 'a' },
    { char: 'ಇ',         name: 'i',   roman: 'i',  audio: 'kn/l-2',  group: 'svara', short: true },
    { char: 'ಈ',         name: 'ii',  roman: 'ī',  audio: 'kn/l-3',  group: 'svara', short: false, pairOf: 'i' },
    { char: 'ಉ',         name: 'u',   roman: 'u',  audio: 'kn/l-4',  group: 'svara', short: true },
    { char: 'ಊ',         name: 'uu',  roman: 'ū',  audio: 'kn/l-5',  group: 'svara', short: false, pairOf: 'u' },
    { char: 'ಋ',         name: 'ru',  roman: 'ṛ',  audio: 'kn/l-6',  group: 'svara', short: true },
    { char: 'ಎ',         name: 'e',   roman: 'e',  audio: 'kn/l-7',  group: 'svara', short: true },
    { char: 'ಏ',         name: 'ee',  roman: 'ē',  audio: 'kn/l-8',  group: 'svara', short: false, pairOf: 'e' },
    { char: 'ಐ',         name: 'ai',  roman: 'ai', audio: 'kn/l-9',  group: 'svara', short: false },
    { char: 'ಒ',         name: 'o',   roman: 'o',  audio: 'kn/l-10', group: 'svara', short: true },
    { char: 'ಓ',         name: 'oo',  roman: 'ō',  audio: 'kn/l-11', group: 'svara', short: false, pairOf: 'o' },
    { char: 'ಔ',         name: 'au',  roman: 'au', audio: 'kn/l-12', group: 'svara', short: false },
    { char: 'ಅಂ',   name: 'am',  roman: 'aṁ', audio: 'kn/l-13', group: 'svara', sign: true },
    { char: 'ಅಃ',   name: 'ah',  roman: 'aḥ', audio: 'kn/l-14', group: 'svara', sign: true }
  ],

  /* 34 vyanjana: the five vargas of five, the four avargeeya semivowels,
     the sibilant row, and ಳ — the retroflex ḷ that Hindi does not have
     but a Kannada child says in ಹಳ್ಳಿ and ಬೆಳಿಗ್ಗೆ. It closes the chart
     after ಹ, and phonetically it is a lateral like ಲ, so it sits in the
     semivowel group the way ह sits with the sibilants in Devanagari:
     because that is where the chart a child is handed puts it.

     Two HISTORIC letters are deliberately absent: ೞ (U+0CDE, the old ḻa)
     and ಱ (U+0CB1, the old trilled ṟa) survive only in inscriptions and
     the odd old spelling — met in a museum, not taught in a drill. */
  consonants: [
    { char: 'ಕ', name: 'ka',   r: 'k',   audio: 'kn/l-15', group: 'velar' },
    { char: 'ಖ', name: 'kha',  r: 'kh',  audio: 'kn/l-16', group: 'velar' },
    { char: 'ಗ', name: 'ga',   r: 'g',   audio: 'kn/l-17', group: 'velar' },
    { char: 'ಘ', name: 'gha',  r: 'gh',  audio: 'kn/l-18', group: 'velar' },
    { char: 'ಙ', name: 'nga',  r: 'ṅ',   audio: 'kn/l-19', group: 'velar' },
    { char: 'ಚ', name: 'cha',  r: 'c',   audio: 'kn/l-20', group: 'palatal' },
    { char: 'ಛ', name: 'chha', r: 'ch',  audio: 'kn/l-21', group: 'palatal' },
    { char: 'ಜ', name: 'ja',   r: 'j',   audio: 'kn/l-22', group: 'palatal' },
    { char: 'ಝ', name: 'jha',  r: 'jh',  audio: 'kn/l-23', group: 'palatal' },
    { char: 'ಞ', name: 'nya',  r: 'ñ',   audio: 'kn/l-24', group: 'palatal' },
    { char: 'ಟ', name: 'tta',  r: 'ṭ',   audio: 'kn/l-25', group: 'retroflex' },
    { char: 'ಠ', name: 'ttha', r: 'ṭh',  audio: 'kn/l-26', group: 'retroflex' },
    { char: 'ಡ', name: 'dda',  r: 'ḍ',   audio: 'kn/l-27', group: 'retroflex' },
    { char: 'ಢ', name: 'ddha', r: 'ḍh',  audio: 'kn/l-28', group: 'retroflex' },
    { char: 'ಣ', name: 'nna',  r: 'ṇ',   audio: 'kn/l-29', group: 'retroflex' },
    { char: 'ತ', name: 'ta',   r: 't',   audio: 'kn/l-30', group: 'dental' },
    { char: 'ಥ', name: 'tha',  r: 'th',  audio: 'kn/l-31', group: 'dental' },
    { char: 'ದ', name: 'da',   r: 'd',   audio: 'kn/l-32', group: 'dental' },
    { char: 'ಧ', name: 'dha',  r: 'dh',  audio: 'kn/l-33', group: 'dental' },
    { char: 'ನ', name: 'na',   r: 'n',   audio: 'kn/l-34', group: 'dental' },
    { char: 'ಪ', name: 'pa',   r: 'p',   audio: 'kn/l-35', group: 'labial' },
    { char: 'ಫ', name: 'pha',  r: 'ph',  audio: 'kn/l-36', group: 'labial' },
    { char: 'ಬ', name: 'ba',   r: 'b',   audio: 'kn/l-37', group: 'labial' },
    { char: 'ಭ', name: 'bha',  r: 'bh',  audio: 'kn/l-38', group: 'labial' },
    { char: 'ಮ', name: 'ma',   r: 'm',   audio: 'kn/l-39', group: 'labial' },
    { char: 'ಯ', name: 'ya',   r: 'y',   audio: 'kn/l-40', group: 'semivowel' },
    { char: 'ರ', name: 'ra',   r: 'r',   audio: 'kn/l-41', group: 'semivowel' },
    { char: 'ಲ', name: 'la',   r: 'l',   audio: 'kn/l-42', group: 'semivowel' },
    { char: 'ವ', name: 'va',   r: 'v',   audio: 'kn/l-43', group: 'semivowel' },
    { char: 'ಶ', name: 'sha',  r: 'ś',   audio: 'kn/l-44', group: 'sibilant' },
    { char: 'ಷ', name: 'shha', r: 'ṣ',   audio: 'kn/l-45', group: 'sibilant' },
    { char: 'ಸ', name: 'sa',   r: 's',   audio: 'kn/l-46', group: 'sibilant' },
    { char: 'ಹ', name: 'ha',   r: 'h',   audio: 'kn/l-47', group: 'sibilant' },
    { char: 'ಳ', name: 'lla',  r: 'ḷ',   audio: 'kn/l-48', group: 'semivowel' }
  ],

  /* 14 matras — and ALL of them are kagunita columns. The Kannada
     equivalent of the barakhadi is the kagunita a child recites as
     ಕ ಕಾ ಕಿ ಕೀ ಕು ಕೂ ಕೃ ಕೆ ಕೇ ಕೈ ಕೊ ಕೋ ಕೌ ಕಂ ಕಃ — sixteen minus the bare
     letter — so ೃ is grid:true here where Devanagari's ृ is not.

     CODEPOINTS, VERIFIED WITH NODE: ೀ ೇ ೈ ೊ ೋ look two-part on screen
     (an i-arc or e-arc plus a trailing length mark) and Unicode gives
     each a canonical decomposition through U+0CD5/U+0CD6 — but NFC
     RECOMPOSES all five, so what is stored is exactly one codepoint:

         ಾ U+0CBE   ಿ U+0CBF   ೀ U+0CC0 (NFC of 0CBF+0CD5)
         ು U+0CC1   ೂ U+0CC2   ೃ U+0CC3
         ೆ U+0CC6   ೇ U+0CC7 (NFC of 0CC6+0CD5)   ೈ U+0CC8 (NFC of 0CC6+0CD6)
         ೊ U+0CCA (NFC of 0CC6+0CC2)   ೋ U+0CCB (NFC of 0CCA+0CD5)
         ೌ U+0CCC   ಂ U+0C82   ಃ U+0C83

     U+0CD5/U+0CD6 therefore never appear in this file; they only exist
     in decomposed text, which the engine's NFC rule already forbids.

     Positions are the honest nearest of the four the engine knows.
     Kannada signs cluster at the TOP and the RIGHT — nothing renders to
     the left the way Devanagari's ಿ ... ि does. ಿ and the e-series sit
     on top of the letter (replacing the talekattu); ು ೂ ೃ hook at the
     bottom-right corner, for which 'below' is the nearest value; the
     composed o-series and ೌ trail off to the right. The anusvara is a
     plain circle written AFTER the letter at x-height — position 'right',
     not 'above' as in Devanagari. */
  matras: [
    { sign: 'ಾ', name: 'aa',       vowel: 'aa', vowelChar: 'ಆ', position: 'right', example: 'ಕಾ', audio: 'kn/m-aa', grid: true },
    { sign: 'ಿ', name: 'i',        vowel: 'i',  vowelChar: 'ಇ', position: 'above', example: 'ಕಿ', audio: 'kn/m-i',  grid: true },
    { sign: 'ೀ', name: 'ii',       vowel: 'ii', vowelChar: 'ಈ', position: 'above', example: 'ಕೀ', audio: 'kn/m-ii', grid: true },
    { sign: 'ು', name: 'u',        vowel: 'u',  vowelChar: 'ಉ', position: 'below', example: 'ಕು', audio: 'kn/m-u',  grid: true },
    { sign: 'ೂ', name: 'uu',       vowel: 'uu', vowelChar: 'ಊ', position: 'below', example: 'ಕೂ', audio: 'kn/m-uu', grid: true },
    { sign: 'ೃ', name: 'ru',       vowel: 'ru', vowelChar: 'ಋ', position: 'below', example: 'ಕೃ', audio: 'kn/m-ru', grid: true },
    { sign: 'ೆ', name: 'e',        vowel: 'e',  vowelChar: 'ಎ', position: 'above', example: 'ಕೆ', audio: 'kn/m-e',  grid: true },
    { sign: 'ೇ', name: 'ee',       vowel: 'ee', vowelChar: 'ಏ', position: 'above', example: 'ಕೇ', audio: 'kn/m-ee', grid: true },
    { sign: 'ೈ', name: 'ai',       vowel: 'ai', vowelChar: 'ಐ', position: 'above', example: 'ಕೈ', audio: 'kn/m-ai', grid: true },
    { sign: 'ೊ', name: 'o',        vowel: 'o',  vowelChar: 'ಒ', position: 'right', example: 'ಕೊ', audio: 'kn/m-o',  grid: true },
    { sign: 'ೋ', name: 'oo',       vowel: 'oo', vowelChar: 'ಓ', position: 'right', example: 'ಕೋ', audio: 'kn/m-oo', grid: true },
    { sign: 'ೌ', name: 'au',       vowel: 'au', vowelChar: 'ಔ', position: 'right', example: 'ಕೌ', audio: 'kn/m-au', grid: true },
    { sign: 'ಂ', name: 'anusvara', vowel: 'am', vowelChar: 'ಅಂ', position: 'right', example: 'ಕಂ', audio: 'kn/m-am', grid: true },
    { sign: 'ಃ', name: 'visarga',  vowel: 'ah', vowelChar: 'ಅಃ', position: 'right', example: 'ಕಃ', audio: 'kn/m-ah', grid: true }
  ],

  numerals: [
    { char: '೦', value: 0, name: 'sonne',   audio: 'kn/n0' },
    { char: '೧', value: 1, name: 'ondu',    audio: 'kn/n1' },
    { char: '೨', value: 2, name: 'eradu',   audio: 'kn/n2' },
    { char: '೩', value: 3, name: 'mooru',   audio: 'kn/n3' },
    { char: '೪', value: 4, name: 'naalku',  audio: 'kn/n4' },
    { char: '೫', value: 5, name: 'aidu',    audio: 'kn/n5' },
    { char: '೬', value: 6, name: 'aaru',    audio: 'kn/n6' },
    { char: '೭', value: 7, name: 'elu',     audio: 'kn/n7' },
    { char: '೮', value: 8, name: 'entu',    audio: 'kn/n8' },
    { char: '೯', value: 9, name: 'ombattu', audio: 'kn/n9' }
  ],

  /* The conjuncts a Kannada child actually meets first. Kannada doubles
     consonants constantly — the words for mother, father, elder brother,
     elder sister, rice, ten and the language itself all carry a double —
     so the spine here is geminates, then the ottakshara clusters that
     open real early words. Each is literally parts.join(virama); the
     second letter renders subjoined BELOW the first.

     Doubles whose base letter shares a primer name take the '-j' suffix
     (ತ್ತ vs ಟ 'tta', ದ್ದ vs ಡ 'dda', ನ್ನ vs ಣ 'nna', ಲ್ಲ vs ಳ 'lla'), the
     same convention Devanagari's conjunct list uses. As there, only the
     first ten carry audio keys — the voice budget is spent on letters,
     matras and words; a conjunct is taught visually and heard inside its
     example word. */
  hardConjuncts: [
    { char: 'ಕ್ಕ', parts: ['ಕ', 'ಕ'], name: 'kka',    audio: 'kn/kka',    word: 'ಅಕ್ಕ' },
    { char: 'ತ್ತ', parts: ['ತ', 'ತ'], name: 'tta-j',  audio: 'kn/tta-j',  word: 'ಹತ್ತು' },
    { char: 'ದ್ದ', parts: ['ದ', 'ದ'], name: 'dda-j',  audio: 'kn/dda-j',  word: 'ಸದ್ದು' },
    { char: 'ನ್ನ', parts: ['ನ', 'ನ'], name: 'nna-j',  audio: 'kn/nna-j',  word: 'ಕನ್ನಡ' },
    { char: 'ಮ್ಮ', parts: ['ಮ', 'ಮ'], name: 'mma-j',  audio: 'kn/mma-j',  word: 'ಅಮ್ಮ' },
    { char: 'ಲ್ಲ', parts: ['ಲ', 'ಲ'], name: 'lla-j',  audio: 'kn/lla-j',  word: 'ಇಲ್ಲ' },
    { char: 'ಪ್ಪ', parts: ['ಪ', 'ಪ'], name: 'ppa-j',  audio: 'kn/ppa-j',  word: 'ಅಪ್ಪ' },
    { char: 'ಟ್ಟ', parts: ['ಟ', 'ಟ'], name: 'ttta-j', audio: 'kn/ttta-j', word: 'ಹೊಟ್ಟೆ' },
    { char: 'ಸ್ತ', parts: ['ಸ', 'ತ'], name: 'sta',    audio: 'kn/sta',    word: 'ಪುಸ್ತಕ' },
    { char: 'ಕ್ಷ', parts: ['ಕ', 'ಷ'], name: 'ksha',   audio: 'kn/ksha',   word: 'ಅಕ್ಷರ' },
    { char: 'ತ್ರ', parts: ['ತ', 'ರ'], name: 'tra',    word: 'ಚಿತ್ರ' },
    { char: 'ದ್ವ', parts: ['ದ', 'ವ'], name: 'dva',    word: 'ದ್ವಾರ' }
  ]
};

/* ==================================================== KANNADA LEXICON ==== */
/* Heritage-first, same as Hindi (docs/09 §3): what a Kannadiga household
   says on a Tuesday — amma, appa, ajji's kathe, dose and mosaru — not
   textbook sentences. The child usually knows the WORD; the pack teaches
   that it is written ಅಮ್ಮ.

   Romanisation is the kid-friendly iso15919+kid style HI_LEX uses: plain
   ASCII, doubled letters for long vowels (oota, neeru), no diacritics.
   Audio keys derive from the roman exactly as in Hindi: kn/w-<roman>.

   Order is the ramp: the first block is the everyday core across themes,
   the theme blocks after it widen the same ground. Rows are
   [word, roman, en, theme] with an optional numeric value column. */

var KN_LEX = K.packWords('kn', [

  /* ============ the first words — what is said in the house every day ==== */
  ['ನಮಸ್ಕಾರ', 'namaskara', 'hello', 'greetings'],
  ['ಹೌದು', 'haudu', 'yes', 'greetings'],
  ['ಇಲ್ಲ', 'illa', 'no', 'greetings'],
  ['ಸರಿ', 'sari', 'okay, fine', 'greetings'],
  ['ಧನ್ಯವಾದ', 'dhanyavaada', 'thank you', 'greetings'],
  ['ಬನ್ನಿ', 'banni', 'come in — the welcome at every door', 'greetings'],

  ['ಅಮ್ಮ', 'amma', 'mother', 'family'],
  ['ಅಪ್ಪ', 'appa', 'father', 'family'],
  ['ಅಜ್ಜಿ', 'ajji', 'grandmother', 'family'],
  ['ಅಜ್ಜ', 'ajja', 'grandfather', 'family'],
  ['ಅಣ್ಣ', 'anna', 'elder brother', 'family'],
  ['ಅಕ್ಕ', 'akka', 'elder sister', 'family'],
  ['ತಮ್ಮ', 'tamma', 'younger brother', 'family'],
  ['ತಂಗಿ', 'tangi', 'younger sister', 'family'],
  ['ಮಗು', 'magu', 'baby, child', 'family'],
  ['ಕುಟುಂಬ', 'kutumba', 'family', 'family'],

  /* ಅನ್ನ (dental n) is cooked rice; ಅಣ್ಣ (retroflex ṇ, above) is your
     elder brother. To a Hindi-trained ear they sound the same — to a
     Kannada ear they never do. The pair is taught side by side on
     purpose; the audio keys are split below so each gets its own clip. */
  ['ಅನ್ನ', 'anna', 'cooked rice — sounds like anna the brother, but with a different n', 'food'],
  ['ನೀರು', 'neeru', 'water', 'food'],
  ['ಹಾಲು', 'haalu', 'milk', 'food'],
  ['ರೊಟ್ಟಿ', 'rotti', 'flatbread', 'food'],
  ['ಊಟ', 'oota', 'a meal', 'food'],
  ['ತಿಂಡಿ', 'tindi', 'a snack, breakfast', 'food'],
  ['ಹಣ್ಣು', 'hannu', 'fruit', 'food'],
  ['ದೋಸೆ', 'dose', 'dosa', 'food'],
  ['ಇಡ್ಲಿ', 'idli', 'idli', 'food'],
  ['ಮೊಸರು', 'mosaru', 'yoghurt', 'food'],

  ['ತಲೆ', 'tale', 'head', 'body'],
  ['ಕಣ್ಣು', 'kannu', 'eye', 'body'],
  ['ಮೂಗು', 'moogu', 'nose', 'body'],
  ['ಕಿವಿ', 'kivi', 'ear', 'body'],
  ['ಬಾಯಿ', 'baayi', 'mouth', 'body'],
  ['ಕೈ', 'kai', 'hand', 'body'],
  ['ಕಾಲು', 'kaalu', 'leg, foot', 'body'],
  ['ಹೊಟ್ಟೆ', 'hotte', 'tummy', 'body'],
  ['ಹಲ್ಲು', 'hallu', 'tooth', 'body'],
  ['ಕೂದಲು', 'koodalu', 'hair', 'body'],

  ['ಮನೆ', 'mane', 'house', 'home'],
  ['ಬಾಗಿಲು', 'baagilu', 'door', 'home'],
  ['ಕಿಟಕಿ', 'kitaki', 'window', 'home'],
  ['ಕುರ್ಚಿ', 'kurchi', 'chair', 'home'],
  ['ಮೇಜು', 'meju', 'table', 'home'],
  ['ಹಾಸಿಗೆ', 'haasige', 'bed', 'home'],
  ['ದೀಪ', 'deepa', 'lamp', 'home'],
  ['ಅಡುಗೆಮನೆ', 'adugemane', 'kitchen', 'home'],

  ['ನಾನು', 'naanu', 'I', 'basics'],
  ['ನೀನು', 'neenu', 'you (to a friend)', 'basics'],
  ['ನೀವು', 'neevu', 'you (respectful)', 'basics'],
  ['ನಾವು', 'naavu', 'we', 'basics'],
  ['ಇದು', 'idu', 'this', 'basics'],
  ['ಅದು', 'adu', 'that', 'basics'],
  ['ಏನು', 'enu', 'what', 'basics'],
  ['ಯಾರು', 'yaaru', 'who', 'basics'],
  ['ಎಲ್ಲಿ', 'elli', 'where', 'basics'],
  ['ಬೇಕು', 'beku', 'is wanted — how you ask for anything', 'basics'],
  ['ಬೇಡ', 'beda', 'is not wanted — the first word every toddler masters', 'basics'],
  ['ಸಾಕು', 'saaku', 'enough', 'basics'],
  ['ಗೊತ್ತು', 'gottu', 'known — how you say you know', 'basics'],
  ['ಇಷ್ಟ', 'ishta', 'liking — how you say you like something', 'basics'],
  ['ತುಂಬಾ', 'tumbaa', 'very, a lot', 'basics'],
  ['ಚೆನ್ನಾಗಿದೆ', 'chennaagide', 'it is good, it is lovely', 'basics'],

  ['ಬಾ', 'baa', 'come (to a friend)', 'actions'],
  ['ಹೋಗು', 'hogu', 'go', 'actions'],
  ['ತಿನ್ನು', 'tinnu', 'eat', 'actions'],
  ['ಕುಡಿ', 'kudi', 'drink', 'actions'],
  ['ನೋಡು', 'nodu', 'look, see', 'actions'],
  ['ಕೇಳು', 'kelu', 'listen, ask', 'actions'],
  ['ಹೇಳು', 'helu', 'say, tell', 'actions'],
  ['ಮಾಡು', 'maadu', 'do, make', 'actions'],
  ['ಕೊಡು', 'kodu', 'give', 'actions'],
  ['ಮಲಗು', 'malagu', 'sleep, lie down', 'actions'],

  ['ಒಂದು', 'ondu', 'one', 'numbers', 1],
  ['ಎರಡು', 'eradu', 'two', 'numbers', 2],
  ['ಮೂರು', 'mooru', 'three', 'numbers', 3],
  ['ನಾಲ್ಕು', 'naalku', 'four', 'numbers', 4],
  ['ಐದು', 'aidu', 'five', 'numbers', 5],
  ['ಆರು', 'aaru', 'six', 'numbers', 6],
  ['ಏಳು', 'elu', 'seven', 'numbers', 7],
  ['ಎಂಟು', 'entu', 'eight', 'numbers', 8],
  ['ಒಂಬತ್ತು', 'ombattu', 'nine', 'numbers', 9],
  ['ಹತ್ತು', 'hattu', 'ten', 'numbers', 10],

  ['ಕೆಂಪು', 'kempu', 'red', 'colours'],
  ['ನೀಲಿ', 'neeli', 'blue', 'colours'],
  ['ಹಳದಿ', 'haladi', 'yellow', 'colours'],
  ['ಹಸಿರು', 'hasiru', 'green', 'colours'],
  ['ಕಪ್ಪು', 'kappu', 'black', 'colours'],
  ['ಬಿಳಿ', 'bili', 'white', 'colours'],

  ['ನಾಯಿ', 'naayi', 'dog', 'animals'],
  ['ಬೆಕ್ಕು', 'bekku', 'cat', 'animals'],
  ['ಹಸು', 'hasu', 'cow', 'animals'],
  ['ಆನೆ', 'aane', 'elephant', 'animals'],
  ['ಹಕ್ಕಿ', 'hakki', 'bird', 'animals'],
  ['ಮೀನು', 'meenu', 'fish', 'animals'],

  ['ಇವತ್ತು', 'ivattu', 'today', 'time'],
  ['ನಾಳೆ', 'naale', 'tomorrow', 'time'],
  ['ನಿನ್ನೆ', 'ninne', 'yesterday', 'time'],
  ['ರಾತ್ರಿ', 'raatri', 'night', 'time'],

  ['ಸಂತೋಷ', 'santosha', 'happiness', 'feelings'],
  ['ಪ್ರೀತಿ', 'preeti', 'love', 'feelings'],
  ['ಹಸಿವು', 'hasivu', 'hunger', 'feelings'],

  /* ================= greetings — the rest of the doorway ================= */
  ['ಸ್ವಾಗತ', 'swaagata', 'welcome', 'greetings'],
  ['ಶುಭೋದಯ', 'shubhodaya', 'good morning', 'greetings'],
  ['ಶುಭರಾತ್ರಿ', 'shubharaatri', 'good night', 'greetings'],
  ['ಕ್ಷಮಿಸಿ', 'kshamisi', 'sorry, excuse me', 'greetings'],
  ['ದಯವಿಟ್ಟು', 'dayavittu', 'please', 'greetings'],
  ['ಹೋಗಿ ಬನ್ನಿ', 'hogi banni', 'goodbye — literally "go and come back"', 'greetings'],

  /* ============================ family ================================== */
  ['ಮಾವ', 'maava', 'uncle (mother’s brother)', 'family'],
  ['ಅತ್ತೆ', 'atte', 'aunt (father’s sister)', 'family'],
  ['ಚಿಕ್ಕಪ್ಪ', 'chikkappa', 'uncle (father’s younger brother)', 'family'],
  ['ಚಿಕ್ಕಮ್ಮ', 'chikkamma', 'aunt (mother’s younger sister)', 'family'],
  ['ದೊಡ್ಡಪ್ಪ', 'doddappa', 'uncle (father’s elder brother)', 'family'],
  ['ದೊಡ್ಡಮ್ಮ', 'doddamma', 'aunt (mother’s elder sister)', 'family'],
  ['ಮಗ', 'maga', 'son', 'family'],
  ['ಮಗಳು', 'magalu', 'daughter', 'family'],
  ['ಗೆಳೆಯ', 'geleya', 'friend', 'family'],

  /* ============================= food =================================== */
  ['ಅಕ್ಕಿ', 'akki', 'rice (uncooked)', 'food'],
  ['ಬೇಳೆ', 'bele', 'lentils', 'food'],
  ['ತರಕಾರಿ', 'tarakaari', 'vegetable', 'food'],
  ['ಉಪ್ಪು', 'uppu', 'salt', 'food'],
  ['ಸಕ್ಕರೆ', 'sakkare', 'sugar', 'food'],
  ['ಬೆಲ್ಲ', 'bella', 'jaggery', 'food'],
  ['ತುಪ್ಪ', 'tuppa', 'ghee', 'food'],
  ['ಬಾಳೆಹಣ್ಣು', 'baalehannu', 'banana', 'food'],
  ['ಮಾವಿನ ಹಣ್ಣು', 'maavina hannu', 'mango', 'food'],
  ['ಕಾಫಿ', 'kaafi', 'coffee — the drink of Karnataka', 'food'],
  ['ಪಾಯಸ', 'paayasa', 'sweet pudding', 'food'],
  ['ಉಪ್ಪಿನಕಾಯಿ', 'uppinakaayi', 'pickle', 'food'],

  /* ============================= body =================================== */
  ['ಮುಖ', 'mukha', 'face', 'body'],
  ['ನಾಲಿಗೆ', 'naalige', 'tongue', 'body'],
  ['ಬೆನ್ನು', 'bennu', 'back', 'body'],
  ['ಬೆರಳು', 'beralu', 'finger', 'body'],

  /* ============================= home =================================== */
  ['ಗೋಡೆ', 'gode', 'wall', 'home'],
  ['ಮೆಟ್ಟಿಲು', 'mettilu', 'step, stairs', 'home'],
  ['ತಟ್ಟೆ', 'tatte', 'plate', 'home'],
  ['ಲೋಟ', 'lota', 'tumbler', 'home'],
  ['ಚಮಚ', 'chamacha', 'spoon', 'home'],

  /* ===================== everyday words that glue sentences ============= */
  ['ಅವನು', 'avanu', 'he', 'basics'],
  ['ಅವಳು', 'avalu', 'she', 'basics'],
  ['ಯಾವಾಗ', 'yaavaaga', 'when', 'basics'],
  ['ಏಕೆ', 'eke', 'why', 'basics'],
  ['ಹೇಗೆ', 'hege', 'how', 'basics'],
  ['ಇಲ್ಲಿ', 'illi', 'here', 'basics'],
  ['ಅಲ್ಲಿ', 'alli', 'there', 'basics'],
  ['ಮತ್ತು', 'mattu', 'and', 'basics'],
  ['ದೊಡ್ಡದು', 'doddadu', 'big', 'basics'],
  ['ಚಿಕ್ಕದು', 'chikkadu', 'small', 'basics'],
  ['ಬಿಸಿ', 'bisi', 'hot', 'basics'],
  ['ತಂಪು', 'tampu', 'cool, cold', 'basics'],

  /* =========================== doing words ============================== */
  ['ಓದು', 'odu', 'read', 'actions'],
  ['ಬರೆ', 'bare', 'write', 'actions'],
  ['ಆಡು', 'aadu', 'play', 'actions'],
  ['ನಡೆ', 'nade', 'walk', 'actions'],
  ['ನಗು', 'nagu', 'laugh', 'actions'],
  ['ಅಳು', 'alu', 'cry', 'actions'],
  ['ಹಾಡು', 'haadu', 'sing; a song', 'actions'],
  ['ಕುಣಿ', 'kuni', 'dance', 'actions'],
  ['ಕಲಿ', 'kali', 'learn', 'actions'],
  ['ಎದ್ದೇಳು', 'eddelu', 'get up', 'actions'],
  /* native-speaker: "sit" is deliberately absent — bare ಕೂರು, ಕುಳಿತುಕೊ and
     colloquial ಕೂತ್ಕೋ all compete, and which one a child should learn first
     is a call for a native speaker, not for this draft. */

  /* ============================ animals ================================= */
  ['ಕುದುರೆ', 'kudure', 'horse', 'animals'],
  ['ಹುಲಿ', 'huli', 'tiger', 'animals'],
  ['ಸಿಂಹ', 'simha', 'lion', 'animals'],
  ['ಕೋತಿ', 'koti', 'monkey', 'animals'],
  ['ಮೇಕೆ', 'meke', 'goat', 'animals'],
  ['ಕಾಗೆ', 'kaage', 'crow', 'animals'],
  ['ನವಿಲು', 'navilu', 'peacock', 'animals'],
  ['ಗಿಳಿ', 'gili', 'parrot', 'animals'],
  ['ಇಲಿ', 'ili', 'mouse', 'animals'],
  ['ಹಾವು', 'haavu', 'snake', 'animals'],
  ['ಚಿಟ್ಟೆ', 'chitte', 'butterfly', 'animals'],

  /* ============================ colours ================================= */
  ['ಕೇಸರಿ', 'kesari', 'saffron, orange', 'colours'],
  ['ಗುಲಾಬಿ', 'gulaabi', 'pink', 'colours'],
  ['ಬಣ್ಣ', 'banna', 'colour', 'colours'],

  /* ============================ numbers ================================= */
  ['ಸೊನ್ನೆ', 'sonne', 'zero', 'numbers', 0],
  ['ನೂರು', 'nooru', 'a hundred', 'numbers', 100],
  ['ಅರ್ಧ', 'ardha', 'half', 'numbers'],

  /* ============================= school ================================= */
  ['ಶಾಲೆ', 'shaale', 'school', 'school'],
  ['ಪುಸ್ತಕ', 'pustaka', 'book', 'school'],
  ['ಕಥೆ', 'kathe', 'story', 'school'],
  ['ಅಕ್ಷರ', 'akshara', 'letter (of the alphabet)', 'school'],
  ['ಹಾಳೆ', 'haale', 'paper', 'school'],
  ['ಪೆನ್ನು', 'pennu', 'pen', 'school'],
  ['ಪಾಠ', 'paatha', 'lesson', 'school'],
  ['ಪ್ರಶ್ನೆ', 'prashne', 'question', 'school'],
  ['ಉತ್ತರ', 'uttara', 'answer', 'school'],
  ['ಹೆಸರು', 'hesaru', 'name', 'school'],
  ['ಚಿತ್ರ', 'chitra', 'picture', 'school'],
  ['ಆಟ', 'aata', 'a game', 'school'],
  ['ಭಾಷೆ', 'bhaashe', 'language', 'school'],
  ['ಕನ್ನಡ', 'kannada', 'Kannada — the language itself', 'school'],
  /* native-speaker: ಗುರು is the respectful word; the everyday classroom
     word is the loan ಮೇಷ್ಟ್ರು / ಟೀಚರ್. Which should a child learn first? */
  ['ಗುರು', 'guru', 'teacher', 'school'],

  /* ============================ clothes ================================= */
  ['ಬಟ್ಟೆ', 'batte', 'clothes, cloth', 'clothes'],
  ['ಸೀರೆ', 'seere', 'sari', 'clothes'],
  ['ಅಂಗಿ', 'angi', 'shirt', 'clothes'],
  ['ಟೋಪಿ', 'topi', 'cap', 'clothes'],
  ['ಚಪ್ಪಲಿ', 'chappali', 'slippers', 'clothes'],
  ['ಬಳೆ', 'bale', 'bangle', 'clothes'],

  /* ========================= weather and sky ============================ */
  ['ಮಳೆ', 'male', 'rain', 'weather'],
  ['ಬಿಸಿಲು', 'bisilu', 'sunshine', 'weather'],
  ['ಗಾಳಿ', 'gaali', 'wind, air', 'weather'],
  ['ಮೋಡ', 'moda', 'cloud', 'weather'],
  ['ಸೂರ್ಯ', 'soorya', 'sun', 'weather'],
  ['ಚಂದ್ರ', 'chandra', 'moon', 'weather'],
  ['ನಕ್ಷತ್ರ', 'nakshatra', 'star', 'weather'],
  ['ಆಕಾಶ', 'aakaasha', 'sky', 'weather'],
  ['ಚಳಿ', 'chali', 'the cold, winter chill', 'weather'],
  ['ಕೊಡೆ', 'kode', 'umbrella', 'weather'],
  ['ಬೆಂಕಿ', 'benki', 'fire', 'weather'],

  /* ========================== time and days ============================= */
  ['ಬೆಳಿಗ್ಗೆ', 'beligge', 'morning', 'time'],
  ['ಮಧ್ಯಾಹ್ನ', 'madhyaahna', 'afternoon', 'time'],
  ['ಸಂಜೆ', 'sanje', 'evening', 'time'],
  ['ದಿನ', 'dina', 'day', 'time'],
  ['ತಿಂಗಳು', 'tingalu', 'month', 'time'],
  ['ವರ್ಷ', 'varsha', 'year', 'time'],
  ['ಗಂಟೆ', 'gante', 'hour; a bell', 'time'],
  ['ಹಬ್ಬ', 'habba', 'festival', 'time'],
  ['ಹುಟ್ಟುಹಬ್ಬ', 'huttuhabba', 'birthday', 'time'],

  /* ====================== places and outdoors =========================== */
  ['ಊರು', 'ooru', 'town — YOUR town, the one the family is from', 'places'],
  ['ಹಳ್ಳಿ', 'halli', 'village', 'places'],
  ['ಅಂಗಡಿ', 'angadi', 'shop', 'places'],
  ['ಮಾರುಕಟ್ಟೆ', 'maarukatte', 'market', 'places'],
  ['ದೇವಸ್ಥಾನ', 'devasthaana', 'temple', 'places'],
  ['ಮಸೀದಿ', 'maseedi', 'mosque', 'places'],
  ['ಚರ್ಚ್', 'church', 'church', 'places'],
  ['ಆಸ್ಪತ್ರೆ', 'aaspatre', 'hospital', 'places'],
  ['ರಸ್ತೆ', 'raste', 'road', 'places'],
  ['ನದಿ', 'nadi', 'river', 'places'],
  ['ಕೆರೆ', 'kere', 'lake, tank', 'places'],
  ['ಬೆಟ್ಟ', 'betta', 'hill', 'places'],
  ['ಸಮುದ್ರ', 'samudra', 'sea', 'places'],
  ['ಕಾಡು', 'kaadu', 'forest', 'places'],
  ['ಮರ', 'mara', 'tree', 'places'],
  ['ಹೂವು', 'hoovu', 'flower', 'places'],
  ['ಎಲೆ', 'ele', 'leaf', 'places'],
  ['ಜಾತ್ರೆ', 'jaatre', 'fair', 'places'],

  /* ========================== getting around ============================ */
  ['ಗಾಡಿ', 'gaadi', 'vehicle, cart', 'transport'],
  ['ಬಸ್ಸು', 'bassu', 'bus', 'transport'],
  ['ರೈಲು', 'railu', 'train', 'transport'],
  ['ಸೈಕಲ್', 'saikal', 'bicycle', 'transport'],
  ['ದೋಣಿ', 'doni', 'boat', 'transport'],
  ['ವಿಮಾನ', 'vimaana', 'aeroplane', 'transport'],
  ['ಹಡಗು', 'hadagu', 'ship', 'transport'],
  ['ದಾರಿ', 'daari', 'the way, the path', 'transport'],

  /* ============================ feelings ================================ */
  ['ಕೋಪ', 'kopa', 'anger', 'feelings'],
  ['ಭಯ', 'bhaya', 'fear', 'feelings'],
  ['ದುಃಖ', 'duhkha', 'sadness', 'feelings'],
  ['ನೋವು', 'novu', 'pain', 'feelings'],
  ['ನಿದ್ದೆ', 'nidde', 'sleep, sleepiness', 'feelings'],
  ['ಬಾಯಾರಿಕೆ', 'baayaarike', 'thirst', 'feelings'],
  ['ಸುಸ್ತು', 'sustu', 'tiredness', 'feelings'],
  ['ಮಜಾ', 'majaa', 'fun', 'feelings'],
  ['ಧೈರ್ಯ', 'dhairya', 'courage', 'feelings']
]);

/* The anna/anna homophone in Latin letters is NOT a homophone in Kannada
   (ಅಣ್ಣ has retroflex ṇ, ಅನ್ನ dental n), so one derived audio key must
   not serve both — re-key the rice so each word gets its own recording.
   Done here rather than by misspelling the roman, because the roman is
   what the child reads. */
(function () {
  var i;
  for (i = 0; i < KN_LEX.length; i++) {
    if (KN_LEX[i].word === 'ಅನ್ನ') KN_LEX[i].audio = 'kn/w-anna-rice';
  }
}());

/* ======================================================== THE PACK ======= */

var KN_PACK = {
  id: 'kn',
  name: { en: 'Kannada', native: 'ಕನ್ನಡ' },
  script: 'kannada',
  transliteration: 'iso15919+kid',
  /* Spoken Kannada often softens the aspirates, but the script carries the
     full varga distinction and the drills teach the chart as written. */
  phonology: { tones: false, retroflex: true, aspiration: true },
  voice: { kind: 'human', ns: 'kn' },
  diglossia: null,
  paths: ['heritage', 'beginner'],
  themes: K.THEMES,
  lexicon: KN_LEX,
  reviewedBy: [],                 /* a named native speaker signs here before ship (docs/09 §9) */
  /* Stages 4–6 are NOT authored yet — no sentences, no conversation turns,
     no graded reading. The derived skeleton keeps the ladder walkable and
     the gap visible instead of papering over it with sentences nobody
     Kannada-speaking has checked. */
  stages: K.ladder(K.stageItems(KANNADA, KN_LEX))
};

K.register(KANNADA, KN_PACK);

}(window));
