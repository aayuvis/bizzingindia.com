"use strict";
/* =====================================================================
   Bizzing India — Bhasha pack: Telugu (తెలుగు).

   A script module (U+0C00–0C7F) plus a language pack, registered through
   window.IND_BHASHA_KIT — the registration surface documented at the foot
   of app/bhasha.js. Loads AFTER bhasha.js, exactly as tools/test-bhasha.js
   loads it.

   Every character in this file is a verified codepoint: the alphabet, the
   matras and the ten trickiest words were printed codepoint-by-codepoint
   under node before being committed, and the smoke test re-asserts block
   containment and NFC on every string. The one NFC trap in this block is
   ై (vowel sign AI): U+0C46 + U+0C56 composes to U+0C48 under NFC, so the
   single precomposed U+0C48 is what is stored everywhere here.

   STATUS: a careful draft by a non-native author. The letter inventory and
   codepoints are machine-checked; the lexicon, romanisations and glosses
   want a native Telugu speaker's pass before ship. reviewedBy is empty
   until a named reviewer signs (docs/09 §9).
   ===================================================================== */

(function (W) {

var K = W.IND_BHASHA_KIT;

/* ------------------------------------------------------------ SCRIPT ---- */
/* Telugu has NO shirorekha — headline: false. Letters do not hang from a
   joining bar; most carry their own talakattu, the round check-shaped tick
   that sits on top of the individual letter and joins nothing. The UI must
   never draw a connecting top rule over Telugu the way it may over
   Devanagari. */

var TELUGU = {
  id: 'telugu',
  name: 'Telugu',
  nativeName: 'తెలుగు',
  block: [0x0C00, 0x0C7F],
  direction: 'ltr',
  headline: false,                /* no shirorekha — the round talakattu instead */
  inherent: 'a',
  virama: '్',               /* ్  U+0C4D, pollu */
  audioNs: 'te',
  languages: ['te'],
  /* fonts.css self-hosts exactly one face for this block, Noto Sans Telugu;
     Gautami is the common system Telugu face if it ever fails to load.
     Telugu's round letterforms read small, hence the generous scale. */
  font: { family: 'Noto Sans Telugu', fallback: 'Gautami', minSize: 17, lineHeight: 1.75, scale: 1.15 },
  notes: 'No shirorekha: each letter carries its own round talakattu tick and nothing joins them. Telugu has short e/o distinct from long ē/ō.',

  /* 13 achchulu, then the two sign vowels. UNLIKE Hindi, Telugu keeps the
     short/long pairs ఎ/ఏ and ఒ/ఓ as four distinct letters — Devanagari has
     only long ए and ओ — so pairOf marks e/ē and o/ō the same way it marks
     a/ā and i/ī. అం and అః mirror how the Devanagari module builds its
     anusvara/visarga rows: అ + the sign (sunna ం, visarga ః). */
  vowels: [
    { char: 'అ',       name: 'a',  roman: 'a',  audio: 'te/l-0',  group: 'achchu', short: true },
    { char: 'ఆ',       name: 'aa', roman: 'ā',  audio: 'te/l-1',  group: 'achchu', short: false, pairOf: 'a' },
    { char: 'ఇ',       name: 'i',  roman: 'i',  audio: 'te/l-2',  group: 'achchu', short: true },
    { char: 'ఈ',       name: 'ii', roman: 'ī',  audio: 'te/l-3',  group: 'achchu', short: false, pairOf: 'i' },
    { char: 'ఉ',       name: 'u',  roman: 'u',  audio: 'te/l-4',  group: 'achchu', short: true },
    { char: 'ఊ',       name: 'uu', roman: 'ū',  audio: 'te/l-5',  group: 'achchu', short: false, pairOf: 'u' },
    { char: 'ఋ',       name: 'ri', roman: 'ṛ',  audio: 'te/l-6',  group: 'achchu', short: true },
    { char: 'ఎ',       name: 'e',  roman: 'e',  audio: 'te/l-7',  group: 'achchu', short: true },                /* short e — Hindi has no such letter */
    { char: 'ఏ',       name: 'ee', roman: 'ē',  audio: 'te/l-8',  group: 'achchu', short: false, pairOf: 'e' },
    { char: 'ఐ',       name: 'ai', roman: 'ai', audio: 'te/l-9',  group: 'achchu', short: false },
    { char: 'ఒ',       name: 'o',  roman: 'o',  audio: 'te/l-10', group: 'achchu', short: true },                /* short o — ditto */
    { char: 'ఓ',       name: 'oo', roman: 'ō',  audio: 'te/l-11', group: 'achchu', short: false, pairOf: 'o' },
    { char: 'ఔ',       name: 'au', roman: 'au', audio: 'te/l-12', group: 'achchu', short: false },
    { char: 'అం', name: 'am', roman: 'aṁ', audio: 'te/l-13', group: 'achchu', sign: true },   /* sunna ం */
    { char: 'అః', name: 'ah', roman: 'aḥ', audio: 'te/l-14', group: 'achchu', sign: true }    /* visarga ః */
  ],

  /* 34 hallulu in varga order: five vargas of five, the semivowels, the
     sibilants + హ, and ళ (retroflex ḷa), which Telugu counts among its
     letters though Hindi has no counterpart. It sits in the semivowel group
     next to ల the way Gurmukhi seats ੜ — the varnamala chart's row, not a
     phonologist's. క్ష is a conjunct (క + ్ + ష), NOT a letter, and lives
     in hardConjuncts. ఱ (bandi ra) is left out deliberately: it survives
     mainly in older spellings and a handful of words no early reader
     meets, and this pack teaches no word containing it — a letter with no
     word to anchor it would be noise at this stage. */
  consonants: [
    { char: 'క', name: 'ka',   r: 'k',   audio: 'te/l-15', group: 'velar' },
    { char: 'ఖ', name: 'kha',  r: 'kh',  audio: 'te/l-16', group: 'velar' },
    { char: 'గ', name: 'ga',   r: 'g',   audio: 'te/l-17', group: 'velar' },
    { char: 'ఘ', name: 'gha',  r: 'gh',  audio: 'te/l-18', group: 'velar' },
    { char: 'ఙ', name: 'nga',  r: 'ṅ',   audio: 'te/l-19', group: 'velar' },
    { char: 'చ', name: 'cha',  r: 'c',   audio: 'te/l-20', group: 'palatal' },
    { char: 'ఛ', name: 'chha', r: 'ch',  audio: 'te/l-21', group: 'palatal' },
    { char: 'జ', name: 'ja',   r: 'j',   audio: 'te/l-22', group: 'palatal' },
    { char: 'ఝ', name: 'jha',  r: 'jh',  audio: 'te/l-23', group: 'palatal' },
    { char: 'ఞ', name: 'nya',  r: 'ñ',   audio: 'te/l-24', group: 'palatal' },
    { char: 'ట', name: 'tta',  r: 'ṭ',   audio: 'te/l-25', group: 'retroflex' },
    { char: 'ఠ', name: 'ttha', r: 'ṭh',  audio: 'te/l-26', group: 'retroflex' },
    { char: 'డ', name: 'dda',  r: 'ḍ',   audio: 'te/l-27', group: 'retroflex' },
    { char: 'ఢ', name: 'ddha', r: 'ḍh',  audio: 'te/l-28', group: 'retroflex' },
    { char: 'ణ', name: 'nna',  r: 'ṇ',   audio: 'te/l-29', group: 'retroflex' },
    { char: 'త', name: 'ta',   r: 't',   audio: 'te/l-30', group: 'dental' },
    { char: 'థ', name: 'tha',  r: 'th',  audio: 'te/l-31', group: 'dental' },
    { char: 'ద', name: 'da',   r: 'd',   audio: 'te/l-32', group: 'dental' },
    { char: 'ధ', name: 'dha',  r: 'dh',  audio: 'te/l-33', group: 'dental' },
    { char: 'న', name: 'na',   r: 'n',   audio: 'te/l-34', group: 'dental' },
    { char: 'ప', name: 'pa',   r: 'p',   audio: 'te/l-35', group: 'labial' },
    { char: 'ఫ', name: 'pha',  r: 'ph',  audio: 'te/l-36', group: 'labial' },
    { char: 'బ', name: 'ba',   r: 'b',   audio: 'te/l-37', group: 'labial' },
    { char: 'భ', name: 'bha',  r: 'bh',  audio: 'te/l-38', group: 'labial' },
    { char: 'మ', name: 'ma',   r: 'm',   audio: 'te/l-39', group: 'labial' },
    { char: 'య', name: 'ya',   r: 'y',   audio: 'te/l-40', group: 'semivowel' },
    { char: 'ర', name: 'ra',   r: 'r',   audio: 'te/l-41', group: 'semivowel' },
    { char: 'ల', name: 'la',   r: 'l',   audio: 'te/l-42', group: 'semivowel' },
    { char: 'వ', name: 'va',   r: 'v',   audio: 'te/l-43', group: 'semivowel' },
    { char: 'ళ', name: 'lla',  r: 'ḷ',   audio: 'te/l-44', group: 'semivowel' },   /* retroflex ḷa — నీళ్ళు, ఇళ్ళు */
    { char: 'శ', name: 'sha',  r: 'ś',   audio: 'te/l-45', group: 'sibilant' },
    { char: 'ష', name: 'shha', r: 'ṣ',   audio: 'te/l-46', group: 'sibilant' },
    { char: 'స', name: 'sa',   r: 's',   audio: 'te/l-47', group: 'sibilant' },
    { char: 'హ', name: 'ha',   r: 'h',   audio: 'te/l-48', group: 'sibilant' }
  ],

  /* 14 matras — the guninthamu row: క కా కి కీ కు కూ కృ కె కే కై కొ కో కౌ కం కః,
     so every sign is a grid column (15 cells with the inherent form).
     POSITION is the honest nearest of the engine's four values. Telugu
     signs mostly ride ABOVE the letter — where the talakattu is, replacing
     or joining it — rather than trailing beside it as in Devanagari; ా and
     the u-series hook off to the right instead, and sunna/visarga are
     written on the line after the letter. Nothing renders to the LEFT in
     Telugu: there is no ि-style reordering trap in this script.
     ై is stored as the single NFC codepoint U+0C48 (see file header). */
  matras: [
    { sign: 'ా', name: 'aa',      vowel: 'aa', vowelChar: 'ఆ',       position: 'right', example: 'కా', audio: 'te/m-aa', grid: true },
    { sign: 'ి', name: 'i',       vowel: 'i',  vowelChar: 'ఇ',       position: 'above', example: 'కి', audio: 'te/m-i',  grid: true },
    { sign: 'ీ', name: 'ii',      vowel: 'ii', vowelChar: 'ఈ',       position: 'above', example: 'కీ', audio: 'te/m-ii', grid: true },
    { sign: 'ు', name: 'u',       vowel: 'u',  vowelChar: 'ఉ',       position: 'right', example: 'కు', audio: 'te/m-u',  grid: true },
    { sign: 'ూ', name: 'uu',      vowel: 'uu', vowelChar: 'ఊ',       position: 'right', example: 'కూ', audio: 'te/m-uu', grid: true },
    { sign: 'ృ', name: 'ri',      vowel: 'ri', vowelChar: 'ఋ',       position: 'right', example: 'కృ', audio: 'te/m-ri', grid: true },
    { sign: 'ె', name: 'e',       vowel: 'e',  vowelChar: 'ఎ',       position: 'above', example: 'కె', audio: 'te/m-e',  grid: true },
    { sign: 'ే', name: 'ee',      vowel: 'ee', vowelChar: 'ఏ',       position: 'above', example: 'కే', audio: 'te/m-ee', grid: true },
    { sign: 'ై', name: 'ai',      vowel: 'ai', vowelChar: 'ఐ',       position: 'above', example: 'కై', audio: 'te/m-ai', grid: true },
    { sign: 'ొ', name: 'o',       vowel: 'o',  vowelChar: 'ఒ',       position: 'above', example: 'కొ', audio: 'te/m-o',  grid: true },
    { sign: 'ో', name: 'oo',      vowel: 'oo', vowelChar: 'ఓ',       position: 'above', example: 'కో', audio: 'te/m-oo', grid: true },
    { sign: 'ౌ', name: 'au',      vowel: 'au', vowelChar: 'ఔ',       position: 'above', example: 'కౌ', audio: 'te/m-au', grid: true },
    { sign: 'ం', name: 'sunna',   vowel: 'am', vowelChar: 'అం', position: 'right', example: 'కం', audio: 'te/m-am', grid: true },
    { sign: 'ః', name: 'visarga', vowel: 'ah', vowelChar: 'అః', position: 'right', example: 'కః', audio: 'te/m-ah', grid: true }
  ],

  /* ౦–౯, U+0C66–0C6F. The zero and the anusvara are BOTH called sunna —
     the same round circle, one a number, one a nasal — which the two data
     rows keep straight because their audio keys differ. పది (10) is a word,
     not a digit, and lives in the lexicon with the other number words. */
  numerals: [
    { char: '౦', value: 0, name: 'sunna',    audio: 'te/n0' },
    { char: '౧', value: 1, name: 'okati',    audio: 'te/n1' },
    { char: '౨', value: 2, name: 'rendu',    audio: 'te/n2' },
    { char: '౩', value: 3, name: 'moodu',    audio: 'te/n3' },
    { char: '౪', value: 4, name: 'naalugu',  audio: 'te/n4' },
    { char: '౫', value: 5, name: 'aidu',     audio: 'te/n5' },
    { char: '౬', value: 6, name: 'aaru',     audio: 'te/n6' },
    { char: '౭', value: 7, name: 'edu',      audio: 'te/n7' },
    { char: '౮', value: 8, name: 'enimidi',  audio: 'te/n8' },
    { char: '౯', value: 9, name: 'tommidi',  audio: 'te/n9' }
  ],

  /* Telugu subjoins the SECOND consonant below or beside the first, so a
     cluster looks like a letter wearing a smaller letter — vatthulu. The
     doubled ones dominate a child's first hundred words (అమ్మ, నాన్న,
     కుక్క, పప్పు), which is why they lead. Every char below is literally
     parts.join(virama); each `word` is in this pack's lexicon so the
     conjunct is met inside a word the child already says. As in the Hindi
     module, only the first ten carry audio keys — the voice budget goes to
     letters, matras and words, and a conjunct is taught visually and heard
     inside its example word. */
  hardConjuncts: [
    { char: 'క్క', parts: ['క', 'క'], name: 'kka',  audio: 'te/kka',  word: 'కుక్క' },
    { char: 'త్త', parts: ['త', 'త'], name: 'tta-j', audio: 'te/tta-j', word: 'అత్త' },
    { char: 'ద్ద', parts: ['ద', 'ద'], name: 'dda-j', audio: 'te/dda-j', word: 'పెద్ద' },
    { char: 'న్న', parts: ['న', 'న'], name: 'nna-j', audio: 'te/nna-j', word: 'నాన్న' },
    { char: 'మ్మ', parts: ['మ', 'మ'], name: 'mma',  audio: 'te/mma',  word: 'అమ్మ' },
    { char: 'ల్ల', parts: ['ల', 'ల'], name: 'lla-j', audio: 'te/lla-j', word: 'ఇల్లు' },
    { char: 'ప్ప', parts: ['ప', 'ప'], name: 'ppa',  audio: 'te/ppa',  word: 'పప్పు' },
    { char: 'ట్ట', parts: ['ట', 'ట'], name: 'ttta', audio: 'te/ttta', word: 'జుట్టు' },
    { char: 'స్త', parts: ['స', 'త'], name: 'sta',  audio: 'te/sta',  word: 'పుస్తకం' },
    { char: 'క్ష', parts: ['క', 'ష'], name: 'ksha', audio: 'te/ksha', word: 'పక్షి' },
    /* beyond the voiced ten */
    { char: 'త్ర', parts: ['త', 'ర'], name: 'tra',  word: 'రాత్రి' },
    { char: 'ద్వ', parts: ['ద', 'వ'], name: 'dva',  word: 'ద్వారం' },
    { char: 'ళ్ళ', parts: ['ళ', 'ళ'], name: 'llla', word: 'నీళ్ళు' },   /* the doubled retroflex ḷ, everywhere in Telugu */
    { char: 'య్య', parts: ['య', 'య'], name: 'yya',  word: 'అన్నయ్య' }
  ]
};

/* ----------------------------------------------------------- LEXICON ---- */
/* Heritage-first (docs/09 §3): the words said in a Telugu house on a
   Tuesday. A child who calls her grandmother అమ్మమ్మ does not need the
   meaning — she needs to see it written. Romanisation is the kid-friendly
   style of HI_LEX (no diacritics; long vowels doubled), and audio keys are
   derived te/w-<roman> by packWords, so the recording manifest can never
   drift from this table. Rows are [word, roman, en, theme] (+ value). */

var TE_LEX = K.packWords('te', [

  /* ============ the first words — what is said in the house every day ==== */
  ['నమస్కారం', 'namaskaram', 'hello (respectful)', 'greetings'],
  ['అవును', 'avunu', 'yes', 'greetings'],
  ['కాదు', 'kaadu', 'no (it is not)', 'greetings'],
  ['లేదు', 'ledu', 'no (there is none)', 'greetings'],
  ['మంచిది', 'manchidi', 'good, okay', 'greetings'],
  ['ధన్యవాదాలు', 'dhanyavaadaalu', 'thank you', 'greetings'],
  ['దయచేసి', 'dayachesi', 'please', 'greetings'],

  ['అమ్మ', 'amma', 'mother', 'family'],
  ['నాన్న', 'nanna', 'father', 'family'],
  ['అన్నయ్య', 'annayya', 'big brother', 'family'],
  ['అక్క', 'akka', 'big sister', 'family'],
  ['తమ్ముడు', 'tammudu', 'little brother', 'family'],
  ['చెల్లి', 'chelli', 'little sister', 'family'],
  ['అమ్మమ్మ', 'ammamma', 'grandmother (mother’s side)', 'family'],
  ['తాతయ్య', 'taatayya', 'grandfather', 'family'],
  ['నానమ్మ', 'naanamma', 'grandmother (father’s side)', 'family'],
  ['కుటుంబం', 'kutumbam', 'family', 'family'],

  ['నీళ్ళు', 'neellu', 'water', 'food'],
  ['అన్నం', 'annam', 'rice, a meal', 'food'],
  ['పప్పు', 'pappu', 'lentils', 'food'],
  ['పాలు', 'paalu', 'milk', 'food'],
  ['పండు', 'pandu', 'fruit', 'food'],
  ['కూర', 'koora', 'vegetable, curry', 'food'],
  ['ఉప్పు', 'uppu', 'salt', 'food'],
  ['పెరుగు', 'perugu', 'yogurt', 'food'],

  ['తల', 'tala', 'head', 'body'],
  ['కన్ను', 'kannu', 'eye', 'body'],
  ['ముక్కు', 'mukku', 'nose', 'body'],
  ['చెవి', 'chevi', 'ear', 'body'],
  ['నోరు', 'noru', 'mouth', 'body'],
  ['చెయ్యి', 'cheyyi', 'hand', 'body'],
  ['కాలు', 'kaalu', 'leg, foot', 'body'],
  ['పొట్ట', 'potta', 'tummy', 'body'],
  ['జుట్టు', 'juttu', 'hair', 'body'],
  ['పన్ను', 'pannu', 'tooth', 'body'],

  ['ఇల్లు', 'illu', 'house', 'home'],
  ['తలుపు', 'talupu', 'door', 'home'],
  ['కిటికీ', 'kitikee', 'window', 'home'],
  ['కుర్చీ', 'kurchee', 'chair', 'home'],
  ['బల్ల', 'balla', 'table', 'home'],
  ['మంచం', 'mancham', 'bed', 'home'],
  ['గది', 'gadi', 'room', 'home'],
  ['వంటిల్లు', 'vantillu', 'kitchen', 'home'],

  ['నేను', 'nenu', 'I', 'basics'],
  ['నువ్వు', 'nuvvu', 'you (to a friend)', 'basics'],
  ['మీరు', 'meeru', 'you (respectful)', 'basics'],
  ['మేము', 'memu', 'we', 'basics'],
  ['ఇది', 'idi', 'this', 'basics'],
  ['అది', 'adi', 'that', 'basics'],
  ['ఏమిటి', 'emiti', 'what', 'basics'],
  ['ఎవరు', 'evaru', 'who', 'basics'],
  ['ఎక్కడ', 'ekkada', 'where', 'basics'],
  ['పెద్ద', 'pedda', 'big', 'basics'],
  ['చిన్న', 'chinna', 'small', 'basics'],
  ['చాలా', 'chaalaa', 'very, a lot', 'basics'],
  ['బాగుంది', 'baagundi', 'it is good, nice', 'basics'],
  ['కథ', 'katha', 'story', 'basics'],
  ['పేరు', 'peru', 'name', 'basics'],

  ['తిను', 'tinu', 'eat', 'actions'],
  ['తాగు', 'taagu', 'drink', 'actions'],
  ['ఆడు', 'aadu', 'play', 'actions'],
  ['రా', 'raa', 'come', 'actions'],
  ['వెళ్ళు', 'vellu', 'go', 'actions'],
  ['చూడు', 'choodu', 'look, see', 'actions'],
  ['విను', 'vinu', 'listen', 'actions'],
  ['చదువు', 'chaduvu', 'read, study', 'actions'],
  ['చెప్పు', 'cheppu', 'say, tell', 'actions'],
  ['ఇవ్వు', 'ivvu', 'give', 'actions'],
  ['నవ్వు', 'navvu', 'laugh; a laugh', 'actions'],
  ['కూర్చో', 'koorcho', 'sit down', 'actions'],
  ['పడుకో', 'paduko', 'lie down, go to sleep', 'actions'],

  ['ఒకటి', 'okati', 'one', 'numbers', 1],
  ['రెండు', 'rendu', 'two', 'numbers', 2],
  ['మూడు', 'moodu', 'three', 'numbers', 3],
  ['నాలుగు', 'naalugu', 'four', 'numbers', 4],
  ['ఐదు', 'aidu', 'five', 'numbers', 5],
  ['ఆరు', 'aaru', 'six', 'numbers', 6],
  ['ఏడు', 'edu', 'seven', 'numbers', 7],
  ['ఎనిమిది', 'enimidi', 'eight', 'numbers', 8],
  ['తొమ్మిది', 'tommidi', 'nine', 'numbers', 9],
  ['పది', 'padi', 'ten', 'numbers', 10],

  ['ఎరుపు', 'erupu', 'red', 'colours'],
  ['నీలం', 'neelam', 'blue', 'colours'],
  ['పసుపు', 'pasupu', 'yellow — also the word for turmeric', 'colours'],
  ['ఆకుపచ్చ', 'aakupachcha', 'green — leaf-green, literally', 'colours'],
  ['నలుపు', 'nalupu', 'black', 'colours'],
  ['తెలుపు', 'telupu', 'white', 'colours'],

  ['కుక్క', 'kukka', 'dog', 'animals'],
  ['పిల్లి', 'pilli', 'cat', 'animals'],
  ['ఆవు', 'aavu', 'cow', 'animals'],
  ['ఏనుగు', 'enugu', 'elephant', 'animals'],
  ['పులి', 'puli', 'tiger', 'animals'],
  ['కోతి', 'kothi', 'monkey', 'animals'],
  ['పక్షి', 'pakshi', 'bird', 'animals'],
  ['చేప', 'chepa', 'fish', 'animals'],

  ['ఈరోజు', 'eeroju', 'today', 'time'],
  ['రేపు', 'repu', 'tomorrow', 'time'],
  ['నిన్న', 'ninna', 'yesterday', 'time'],
  ['రాత్రి', 'raatri', 'night', 'time'],

  ['సంతోషం', 'santosham', 'happiness', 'feelings'],
  ['ప్రేమ', 'prema', 'love', 'feelings'],
  ['ఆకలి', 'aakali', 'hunger', 'feelings'],

  /* ================= greetings — the rest of the doorway ================= */
  ['నమస్తే', 'namaste', 'hello', 'greetings'],
  ['క్షమించండి', 'kshaminchandi', 'sorry, excuse me', 'greetings'],
  ['శుభోదయం', 'shubhodayam', 'good morning', 'greetings'],
  ['శుభరాత్రి', 'shubharaatri', 'good night', 'greetings'],
  ['స్వాగతం', 'swaagatam', 'welcome', 'greetings'],
  ['సెలవు', 'selavu', 'goodbye — also a holiday', 'greetings'],

  /* ============================ family ================================== */
  ['మామయ్య', 'maamayya', 'uncle (mother’s brother)', 'family'],
  ['అత్త', 'atta', 'aunt — mother’s brother’s wife, or father’s sister', 'family'],
  ['పిన్ని', 'pinni', 'aunt (mother’s younger sister)', 'family'],
  ['బాబాయి', 'baabaayi', 'uncle (father’s younger brother)', 'family'],
  ['పాప', 'paapa', 'baby, little girl', 'family'],
  ['అబ్బాయి', 'abbaayi', 'boy', 'family'],
  ['అమ్మాయి', 'ammaayi', 'girl', 'family'],
  ['స్నేహితుడు', 'snehitudu', 'friend', 'family'],

  /* ============================= food =================================== */
  ['మామిడి', 'maamidi', 'mango', 'food'],
  ['అరటిపండు', 'aratipandu', 'banana', 'food'],
  ['రొట్టె', 'rotte', 'flatbread', 'food'],
  ['నెయ్యి', 'neyyi', 'ghee', 'food'],
  ['బెల్లం', 'bellam', 'jaggery', 'food'],
  ['లడ్డూ', 'ladduu', 'laddu', 'food'],
  ['ఇడ్లీ', 'idlee', 'idli', 'food'],
  ['దోసె', 'dose', 'dosa', 'food'],
  ['గుడ్డు', 'guddu', 'egg', 'food'],
  ['మిఠాయి', 'mithaayi', 'sweets', 'food'],
  ['టీ', 'tee', 'tea', 'food'],

  /* ============================= body =================================== */
  ['వేలు', 'velu', 'finger', 'body'],

  /* ============================= home =================================== */
  ['దీపం', 'deepam', 'lamp', 'home'],
  ['అద్దం', 'addam', 'mirror', 'home'],
  ['తాళం', 'taalam', 'lock', 'home'],
  ['బొమ్మ', 'bomma', 'toy, doll — also a picture', 'home'],
  ['ద్వారం', 'dvaaram', 'doorway, gateway', 'home'],

  /* ============================ animals ================================= */
  ['సింహం', 'simham', 'lion', 'animals'],
  ['గుర్రం', 'gurram', 'horse', 'animals'],
  ['మేక', 'meka', 'goat', 'animals'],
  ['నెమలి', 'nemali', 'peacock', 'animals'],
  ['చిలుక', 'chiluka', 'parrot', 'animals'],
  ['సీతాకోకచిలుక', 'seetaakokachiluka', 'butterfly — Sita’s pet parrot, literally', 'animals'],

  /* ============================ colours ================================= */
  ['గులాబీ', 'gulaabee', 'pink — the rose colour', 'colours'],
  ['నారింజ', 'naarinja', 'orange (the colour)', 'colours'],

  /* ============================ school ================================== */
  ['బడి', 'badi', 'school', 'school'],
  ['పుస్తకం', 'pustakam', 'book', 'school'],
  ['కలం', 'kalam', 'pen', 'school'],
  ['పలక', 'palaka', 'slate', 'school'],
  ['బలపం', 'balapam', 'slate chalk', 'school'],
  ['గురువు', 'guruvu', 'teacher', 'school'],
  ['పాఠం', 'paatham', 'lesson', 'school'],
  ['ఆట', 'aata', 'game, play', 'school'],

  /* ============================ clothes ================================= */
  ['చొక్కా', 'chokkaa', 'shirt', 'clothes'],
  ['చీర', 'cheera', 'sari', 'clothes'],
  ['పంచె', 'panche', 'dhoti', 'clothes'],
  ['లంగా', 'langaa', 'skirt', 'clothes'],
  ['టోపీ', 'topee', 'cap', 'clothes'],
  ['చెప్పులు', 'cheppulu', 'sandals', 'clothes'],

  /* ============================ weather ================================= */
  ['వాన', 'vaana', 'rain', 'weather'],
  ['ఎండ', 'enda', 'sunshine', 'weather'],
  ['గాలి', 'gaali', 'wind, air', 'weather'],
  ['మబ్బు', 'mabbu', 'cloud', 'weather'],
  ['చలి', 'chali', 'cold (weather)', 'weather'],
  ['సూర్యుడు', 'sooryudu', 'the sun', 'weather'],
  ['చంద్రుడు', 'chandrudu', 'the moon', 'weather'],
  ['నక్షత్రం', 'nakshatram', 'star', 'weather'],
  ['వెన్నెల', 'vennela', 'moonlight', 'weather'],

  /* ============================= time =================================== */
  ['పొద్దున', 'podduna', 'morning', 'time'],
  ['వారం', 'vaaram', 'week', 'time'],
  ['పండుగ', 'panduga', 'festival', 'time'],

  /* ============================ places ================================== */
  ['ఊరు', 'ooru', 'village, hometown', 'places'],
  ['గుడి', 'gudi', 'temple', 'places'],
  ['చెట్టు', 'chettu', 'tree', 'places'],
  ['పువ్వు', 'puvvu', 'flower', 'places'],
  ['నది', 'nadi', 'river', 'places'],
  ['కొండ', 'konda', 'hill', 'places'],
  ['సముద్రం', 'samudram', 'sea', 'places'],
  ['తోట', 'tota', 'garden', 'places'],

  /* =========================== transport ================================ */
  ['బండి', 'bandi', 'cart, vehicle', 'transport'],
  ['రైలు', 'railu', 'train', 'transport'],
  ['బస్సు', 'bassu', 'bus', 'transport'],
  ['పడవ', 'padava', 'boat', 'transport'],
  ['సైకిల్', 'saikil', 'bicycle', 'transport'],
  ['విమానం', 'vimaanam', 'airplane', 'transport'],

  /* =========================== feelings ================================= */
  ['కోపం', 'kopam', 'anger', 'feelings'],
  ['భయం', 'bhayam', 'fear', 'feelings'],
  ['నిద్ర', 'nidra', 'sleep, sleepiness', 'feelings']
]);

/* -------------------------------------------------------------- PACK ---- */
/* Stages 4–6 are the DERIVED skeleton, not authored content: nobody has
   written Telugu sentences or graded readers yet, and stageItems keeps the
   ladder walkable so the gap stays visible instead of hidden (the same
   honesty the founding packs practise). */

var TE_PACK = {
  id: 'te',
  name: { en: 'Telugu', native: 'తెలుగు' },
  script: 'telugu',
  transliteration: 'iso15919+kid',
  phonology: { tones: false, retroflex: true, aspiration: true },  /* aspirates live mostly in Sanskrit-borrowed words */
  voice: { kind: 'human', ns: 'te' },
  diglossia: null,
  paths: ['heritage', 'beginner'],
  themes: K.THEMES,
  lexicon: TE_LEX,
  reviewedBy: [],                 /* a named native reviewer signs here before ship (docs/09 §9) */
  stages: K.ladder(K.stageItems(TELUGU, TE_LEX))
};

K.register(TELUGU, TE_PACK);

}(window));
