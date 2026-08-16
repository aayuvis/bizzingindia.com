"use strict";
/* =====================================================================
   Bizzing India — Bhasha pack: Urdu (اردو).

   A script module (U+0600–06FF) plus a language pack, registered through
   window.IND_BHASHA_KIT — the registration surface documented at the foot
   of app/bhasha.js. Loads AFTER bhasha.js, exactly as tools/test-bhasha.js
   loads it.

   THE BOLD ONE. Urdu is the first pack whose script is not an Indic
   abugida: it is an abjad, written right to left, in the hanging Nastaliq
   hand. The shared ladder still fits, but only if the mapping is honest:

     - The HARAKAT (zabar, zer, pesh) are the engine's "matras". This is
       the truthful mapping — they are optional vowel signs that ride a
       consonant, exactly the role a matra plays — with the one big
       difference that real Urdu writing leaves them out. So they are
       taught in stage 2 on letters, and the LEXICON IS UNVOCALIZED,
       because پانی on a page has no harakat and the child must meet words
       as they are actually written.
     - There is NO inherent vowel (inherent: '') and NO virama. A bare
       letter is a consonant shape waiting for context; the takhti drill
       ب بَ بِ بُ is the barakhadi with four columns instead of twelve.
     - hardConjuncts is EMPTY. Urdu has no क्ष-style ligature stack to
       split; letters change shape and join hands cursively instead, which
       is a reading skill of its own — stage 6 is repointed at reading
       real, longer joined words rather than at a conjunctSplit drill.
     - `vowels` holds the word-initial vowel SEATS of the qaida chart
       (اَ اِ اُ آ او ای اے), not duplicates of alphabet letters — see the
       long note at the field.

   Every character in this file is a verified codepoint. The traps in this
   block are the Arabic look-alikes: ک is U+06A9 keheh (never Arabic kaf
   U+0643), ی is U+06CC farsi yeh (never Arabic yeh U+064A), ہ is U+06C1
   gol he (never Arabic heh U+0647) — the impostors are named by number
   only, so this file contains not a single one of them, and a plain
   codepoint grep proves it. آ is stored as the single precomposed U+0622
   because NFC would fuse ا + combining madda into it anyway. Presentation
   forms (U+FB50 onward) never appear; the shaper, not the data, joins the
   letters. tools/test-bhasha.js re-asserts block containment and NFC on
   every string.

   FONT: Nastaliq, not Naskh, is non-negotiable for Urdu — see the font
   note on the module. At the time of writing app/fonts.css does NOT yet
   carry a 'Noto Nastaliq Urdu' @font-face (tools/fonts.sh must add it
   before this pack ships); the family string here is the one it must use.

   STATUS: a careful draft by a non-native author. The letter inventory
   and codepoints are machine-checked; the lexicon, romanisations and
   glosses want a native Urdu speaker's pass before ship. reviewedBy is
   empty until a named reviewer signs (docs/09 §9).
   ===================================================================== */

(function (W) {

var K = W.IND_BHASHA_KIT;

/* ------------------------------------------------------------ SCRIPT ---- */

var URDU = {
  id: 'urdu',
  name: 'Urdu (Nastaliq)',
  nativeName: 'اردو',
  block: [0x0600, 0x06FF],
  direction: 'rtl',
  headline: false,                /* no shirorekha; Nastaliq hangs from a sloping invisible thread */
  inherent: '',                   /* an abjad: a bare letter carries no vowel of its own */
  /* no virama — Urdu joins cursively; there is nothing to split on */
  audioNs: 'ur',
  languages: ['ur'],
  /* Nastaliq, not Naskh, is NON-NEGOTIABLE for Urdu — the same hard rule
     as CLAUDE.md's "Devanagari is set correctly or not at all". Urdu set
     in a Naskh face reads as Arabic wearing the wrong clothes; every Urdu
     newspaper, primer and takhti a child's family knows is Nastaliq.
     There is deliberately NO Naskh fallback here: better to fail loudly
     at font-load than to silently Naskh-ify. lineHeight 2.2 because
     Nastaliq stacks words diagonally and hangs deep below the Latin
     baseline — at Devanagari's 1.75 the descending tails clip. */
  font: { family: 'Noto Nastaliq Urdu', fallback: null, minSize: 18, lineHeight: 2.2, scale: 1.15 },
  notes: 'Right-to-left abjad in the Nastaliq hand. Letters join cursively and change shape by position; short vowels (harakat) are usually unwritten.',

  /* The word-initial vowel seats of the qaida chart — NOT duplicates of
     the alphabet letters below (duplicate glyphs would collide in the SRS
     and duplicate audio keys fail the smoke test).

     The instruction to an abjad purist would be vowels: [], because the
     long vowels ARE letters of the alphabet (ا و ی ے, the huroof-e-illat).
     But an empty array is not honest to the engine either: oddOneOut's
     'length' strategy — which tools/test-bhasha.js exercises for every
     registered script, unconditionally — discriminates long vs short
     vowels from this very list, and every Urdu qaida really does open
     with exactly these seven word-initial forms: the three short vowels
     as harakat on an alif seat, the four long vowels as alif + a letter
     of illat (or the fused alif-madda). So this list is real teaching
     content, and it gives the child the one length fact Urdu spelling
     actually encodes: SHORT vowels are little marks, LONG vowels are
     whole letters. */
  vowels: [
    { char: 'اَ',  name: 'a',  roman: 'a', audio: 'ur/v-a',  group: 'seat',  short: true },
    { char: 'اِ',  name: 'i',  roman: 'i', audio: 'ur/v-i',  group: 'seat',  short: true },
    { char: 'اُ',  name: 'u',  roman: 'u', audio: 'ur/v-u',  group: 'seat',  short: true },
    { char: 'آ',   name: 'aa', roman: 'ā', audio: 'ur/v-aa', group: 'illat', short: false, pairOf: 'a' },
    { char: 'او',  name: 'oo', roman: 'ū', audio: 'ur/v-oo', group: 'illat', short: false, pairOf: 'u' },
    { char: 'ای',  name: 'ee', roman: 'ī', audio: 'ur/v-ee', group: 'illat', short: false, pairOf: 'i' },
    { char: 'اے',  name: 'e',  roman: 'ē', audio: 'ur/v-e',  group: 'illat', short: false }
  ],

  /* The full Urdu alphabet, 39 letters in chart order. `group` is the
     SHAPE family — the be-boat with different dots, the jeem-bowl, and so
     on — because that is how an Urdu child is taught to see the letters
     (count the dots, find the family) and it is exactly the
     discrimination oddOneOut needs. (The engine's canned why-string says
     "sounds"; for Urdu the family is a shared skeleton, not a shared
     sound — a wording pass on the engine copy is queued, not faked here.)

     Codepoint traps, all verified under node:
       ٹ U+0679  ڈ U+0688  ڑ U+0691   (the retroflexes, teh/dal/reh + small tah)
       ک U+06A9 keheh       NOT Arabic kaf U+0643
       گ U+06AF gaf
       ں U+06BA noon ghunna
       ہ U+06C1 gol he      NOT Arabic heh U+0647
       ھ U+06BE do-chashmi he — the aspiration letter: it never starts a
                word, it turns ب پ ت ٹ ج چ د ڈ ک گ ر ڑ into their aspirated
                cousins (بھ پھ تھ …), Urdu's whole aspiration system in
                one letter
       ی U+06CC farsi yeh   NOT Arabic yeh U+064A
       ے U+06D2 baṛi ye */
  consonants: [
    { char: 'ا', name: 'alif',           r: 'a',  audio: 'ur/l-0',  group: 'alif' },
    { char: 'ب', name: 'be',             r: 'b',  audio: 'ur/l-1',  group: 'be' },
    { char: 'پ', name: 'pe',             r: 'p',  audio: 'ur/l-2',  group: 'be' },
    { char: 'ت', name: 'te',             r: 't',  audio: 'ur/l-3',  group: 'be' },
    { char: 'ٹ', name: 'ṭe',             r: 'ṭ',  audio: 'ur/l-4',  group: 'be' },
    { char: 'ث', name: 'se',             r: 's',  audio: 'ur/l-5',  group: 'be' },
    { char: 'ج', name: 'jeem',           r: 'j',  audio: 'ur/l-6',  group: 'jeem' },
    { char: 'چ', name: 'che',            r: 'ch', audio: 'ur/l-7',  group: 'jeem' },
    { char: 'ح', name: 'baṛi he',        r: 'h',  audio: 'ur/l-8',  group: 'jeem' },
    { char: 'خ', name: 'khe',            r: 'kh', audio: 'ur/l-9',  group: 'jeem' },
    { char: 'د', name: 'daal',           r: 'd',  audio: 'ur/l-10', group: 'daal' },
    { char: 'ڈ', name: 'ḍaal',           r: 'ḍ',  audio: 'ur/l-11', group: 'daal' },
    { char: 'ذ', name: 'zaal',           r: 'z',  audio: 'ur/l-12', group: 'daal' },
    { char: 'ر', name: 're',             r: 'r',  audio: 'ur/l-13', group: 're' },
    { char: 'ڑ', name: 'ṛe',             r: 'ṛ',  audio: 'ur/l-14', group: 're' },
    { char: 'ز', name: 'ze',             r: 'z',  audio: 'ur/l-15', group: 're' },
    { char: 'ژ', name: 'zhe',            r: 'zh', audio: 'ur/l-16', group: 're' },
    { char: 'س', name: 'seen',           r: 's',  audio: 'ur/l-17', group: 'seen' },
    { char: 'ش', name: 'sheen',          r: 'sh', audio: 'ur/l-18', group: 'seen' },
    { char: 'ص', name: 'swaad',          r: 's',  audio: 'ur/l-19', group: 'swaad' },
    { char: 'ض', name: 'zwaad',          r: 'z',  audio: 'ur/l-20', group: 'swaad' },
    { char: 'ط', name: 'toe',            r: 't',  audio: 'ur/l-21', group: 'toe' },
    { char: 'ظ', name: 'zoe',            r: 'z',  audio: 'ur/l-22', group: 'toe' },
    { char: 'ع', name: 'ain',            r: '\'', audio: 'ur/l-23', group: 'ain' },
    { char: 'غ', name: 'ghain',          r: 'gh', audio: 'ur/l-24', group: 'ain' },
    { char: 'ف', name: 'fe',             r: 'f',  audio: 'ur/l-25', group: 'fe' },
    { char: 'ق', name: 'qaaf',           r: 'q',  audio: 'ur/l-26', group: 'fe' },
    { char: 'ک', name: 'kaaf',           r: 'k',  audio: 'ur/l-27', group: 'kaaf' },
    { char: 'گ', name: 'gaaf',           r: 'g',  audio: 'ur/l-28', group: 'kaaf' },
    { char: 'ل', name: 'laam',           r: 'l',  audio: 'ur/l-29', group: 'laam' },
    { char: 'م', name: 'meem',           r: 'm',  audio: 'ur/l-30', group: 'meem' },
    { char: 'ن', name: 'noon',           r: 'n',  audio: 'ur/l-31', group: 'noon' },
    { char: 'ں', name: 'noon ghunna',    r: 'ñ',  audio: 'ur/l-32', group: 'noon' },
    { char: 'و', name: 'wao',            r: 'w',  audio: 'ur/l-33', group: 'wao' },
    { char: 'ہ', name: 'choṭi he',       r: 'h',  audio: 'ur/l-34', group: 'he' },
    { char: 'ھ', name: 'do-chashmi he',  r: 'h',  audio: 'ur/l-35', group: 'he' },
    { char: 'ء', name: 'hamza',          r: '\'', audio: 'ur/l-36', group: 'hamza' },
    { char: 'ی', name: 'choṭi ye',       r: 'y',  audio: 'ur/l-37', group: 'ye' },
    { char: 'ے', name: 'baṛi ye',        r: 'e',  audio: 'ur/l-38', group: 'ye' }
  ],

  /* The harakat, as the engine's "matras". This is the honest mapping:
     an optional sign that rides a consonant and gives it a vowel — a
     matra's exact job — with the caveat (owned in the header) that real
     Urdu writing drops them, so they are a stage-2 teaching aid, not a
     spelling habit.

     zabar/zer/pesh carry grid: true, which hands Urdu a FOUR-column
     takhti barakhadi: ب بَ بِ بُ. Verified against the generator: the
     first column is the bare letter (inherent: '' keeps its roman just
     'b'), the other three compose base + sign, which is exactly what the
     smoke test asserts. Twelve columns would be a lie; four is the drill
     every qaida actually runs.

     tashdeed (doubling) and jazm (no-vowel) are grid: false — they are
     real signs a child must recognise, but they are NOT vowel columns,
     so they stay out of the barakhadi and matraAttach pools and are met
     in stage 2 as chart items only. */
  matras: [
    { sign: 'َ', name: 'zabar',    vowel: 'a', vowelChar: 'اَ', position: 'above', example: 'بَ', audio: 'ur/m-zabar',    grid: true },
    { sign: 'ِ', name: 'zer',      vowel: 'i', vowelChar: 'اِ', position: 'below', example: 'بِ', audio: 'ur/m-zer',      grid: true },
    { sign: 'ُ', name: 'pesh',     vowel: 'u', vowelChar: 'اُ', position: 'above', example: 'بُ', audio: 'ur/m-pesh',     grid: true },
    { sign: 'ّ', name: 'tashdeed', vowel: '',  position: 'above', example: 'بّ', audio: 'ur/m-tashdeed', grid: false },
    { sign: 'ْ', name: 'jazm',     vowel: '',  position: 'above', example: 'بْ', audio: 'ur/m-jazm',     grid: false }
  ],

  /* U+06F0–06F9, the EXTENDED Arabic-Indic digits — the forms Urdu uses
     (note the Urdu shapes of ۴ ۶ ۷), never the U+0660 Arabic set. */
  numerals: [
    { char: '۰', value: 0, name: 'sifar',  audio: 'ur/n0' },
    { char: '۱', value: 1, name: 'aik',    audio: 'ur/n1' },
    { char: '۲', value: 2, name: 'do',     audio: 'ur/n2' },
    { char: '۳', value: 3, name: 'teen',   audio: 'ur/n3' },
    { char: '۴', value: 4, name: 'chaar',  audio: 'ur/n4' },
    { char: '۵', value: 5, name: 'paanch', audio: 'ur/n5' },
    { char: '۶', value: 6, name: 'chhe',   audio: 'ur/n6' },
    { char: '۷', value: 7, name: 'saat',   audio: 'ur/n7' },
    { char: '۸', value: 8, name: 'aath',   audio: 'ur/n8' },
    { char: '۹', value: 9, name: 'nau',    audio: 'ur/n9' }
  ],

  /* Urdu has no conjuncts to split. The letters join CURSIVELY — every
     letter changes shape by position, and that shapeshifting is Urdu's
     own stage-6 story (see the s6 patch on the pack below). An empty
     list feature-gates conjunctSplit out of the test sweep honestly. */
  hardConjuncts: []
};

/* ----------------------------------------------------------- LEXICON ---- */
/* Heritage-first (docs/09 §3): what is said in an Urdu-speaking house on a
   Tuesday. The child already knows what ammi means; they are learning that
   it is written امی.

   UNVOCALIZED THROUGHOUT, deliberately: Urdu is written without harakat,
   and a lexicon that sprinkled them would teach the child to expect
   crutches the real page never provides. The harakat live in stage 2, on
   letters, where they belong.

   Greetings are presented from the inside (docs/05): آداب and
   السلام علیکم sit side by side because both are how Urdu-speaking
   families actually greet — different homes, different words, equal
   warmth. Same for خدا حافظ and اللہ حافظ at the door.

   Rows are [word, roman, en, theme] (+ value for numbers); audio keys are
   derived by packWords as 'ur/w-<roman>'. */

var UR_LEX = K.packWords('ur', [

  /* ========================== greetings ================================ */
  ['آداب', 'aadaab', 'hello — the graceful greeting of Urdu tehzeeb', 'greetings'],
  ['السلام علیکم', 'assalam-o-alaikum', 'peace be upon you — the greeting in many Muslim homes', 'greetings'],
  ['وعلیکم السلام', 'walaikum-assalam', 'and peace upon you — the warm reply', 'greetings'],
  ['خدا حافظ', 'khuda hafiz', 'goodbye — may God keep you', 'greetings'],
  ['اللہ حافظ', 'allah hafiz', 'goodbye — as many families say it today', 'greetings'],
  ['شکریہ', 'shukriya', 'thank you', 'greetings'],
  ['مہربانی', 'meharbaani', 'kindness — and a warm thank-you', 'greetings'],
  ['جی', 'ji', 'yes — the respectful word', 'greetings'],
  ['ہاں', 'haan', 'yes', 'greetings'],
  ['نہیں', 'nahin', 'no', 'greetings'],
  ['اچھا', 'achchha', 'good, okay', 'greetings'],
  ['معاف کیجیے', 'maaf kijiye', 'sorry, excuse me', 'greetings'],
  ['خوش آمدید', 'khush aamdeed', 'welcome', 'greetings'],
  ['مبارک', 'mubaarak', 'congratulations — said at every happy thing', 'greetings'],

  /* ============================ family ================================= */
  ['امی', 'ammi', 'mother', 'family'],
  ['ابو', 'abbu', 'father', 'family'],
  ['بھائی', 'bhai', 'brother', 'family'],
  ['بہن', 'bahan', 'sister', 'family'],
  ['باجی', 'baji', 'big sister — what you call her in many homes', 'family'],
  ['آپا', 'aapa', 'big sister — in other homes', 'family'],
  ['دادا', 'dada', 'grandfather (father’s side)', 'family'],
  ['دادی', 'dadi', 'grandmother (father’s side)', 'family'],
  ['نانا', 'nana', 'grandfather (mother’s side)', 'family'],
  ['نانی', 'nani', 'grandmother (mother’s side)', 'family'],
  ['بیٹا', 'beta', 'son — and what a grown-up calls a child', 'family'],
  ['بیٹی', 'beti', 'daughter', 'family'],
  ['بچہ', 'bachcha', 'child', 'family'],
  ['خاندان', 'khaandaan', 'family', 'family'],
  ['دوست', 'dost', 'friend', 'family'],
  ['چچا', 'chacha', 'uncle (father’s brother)', 'family'],
  ['ماموں', 'maamoon', 'uncle (mother’s brother)', 'family'],
  ['خالہ', 'khaala', 'aunt (mother’s sister)', 'family'],
  ['پھوپھی', 'phuphi', 'aunt (father’s sister)', 'family'],

  /* ============================= food ================================== */
  ['پانی', 'paani', 'water', 'food'],
  ['روٹی', 'roti', 'bread', 'food'],
  ['دودھ', 'doodh', 'milk', 'food'],
  ['چاول', 'chaawal', 'rice', 'food'],
  ['دال', 'daal', 'lentils', 'food'],
  ['کھانا', 'khaana', 'food, a meal; to eat', 'food'],
  ['سالن', 'saalan', 'curry', 'food'],
  ['آم', 'aam', 'mango', 'food'],
  ['کیلا', 'kela', 'banana', 'food'],
  ['سیب', 'seb', 'apple', 'food'],
  ['چائے', 'chai', 'tea', 'food'],
  ['دہی', 'dahi', 'yoghurt', 'food'],
  ['چینی', 'cheeni', 'sugar', 'food'],
  ['نمک', 'namak', 'salt', 'food'],
  ['پھل', 'phal', 'fruit', 'food'],
  ['سبزی', 'sabzi', 'vegetable', 'food'],
  ['مٹھائی', 'mithai', 'sweets', 'food'],
  ['شربت', 'sharbat', 'sharbat — a sweet cool drink', 'food'],
  ['بریانی', 'biryani', 'biryani', 'food'],
  ['انڈا', 'anda', 'egg', 'food'],
  ['گوشت', 'gosht', 'meat', 'food'],

  /* ============================= body ================================== */
  ['سر', 'sar', 'head', 'body'],
  ['آنکھ', 'aankh', 'eye', 'body'],
  ['ناک', 'naak', 'nose', 'body'],
  ['کان', 'kaan', 'ear', 'body'],
  ['منہ', 'munh', 'mouth', 'body'],
  ['ہاتھ', 'haath', 'hand', 'body'],
  ['پاؤں', 'paaon', 'foot', 'body'],
  ['پیٹ', 'pet', 'tummy', 'body'],
  ['بال', 'baal', 'hair', 'body'],
  ['دانت', 'daant', 'tooth', 'body'],
  ['دل', 'dil', 'heart', 'body'],
  ['زبان', 'zabaan', 'tongue — and a language', 'body'],
  ['گردن', 'gardan', 'neck', 'body'],
  ['انگلی', 'ungli', 'finger', 'body'],

  /* ============================= home ================================== */
  ['گھر', 'ghar', 'house', 'home'],
  ['دروازہ', 'darwaaza', 'door', 'home'],
  ['کھڑکی', 'khidki', 'window', 'home'],
  ['کرسی', 'kursi', 'chair', 'home'],
  ['میز', 'mez', 'table', 'home'],
  ['چابی', 'chaabi', 'key', 'home'],
  ['بستر', 'bistar', 'bed', 'home'],
  ['چھت', 'chhat', 'roof', 'home'],
  ['کمرہ', 'kamra', 'room', 'home'],
  ['دیوار', 'deewaar', 'wall', 'home'],
  ['پنکھا', 'pankha', 'fan', 'home'],
  ['صابن', 'saabun', 'soap', 'home'],
  ['تکیہ', 'takiya', 'pillow', 'home'],
  ['جھاڑو', 'jhaadu', 'broom', 'home'],
  ['چراغ', 'chiraagh', 'oil lamp', 'home'],

  /* ======================== everyday words ============================= */
  ['میں', 'main', 'I', 'basics'],
  ['تم', 'tum', 'you (to a friend)', 'basics'],
  ['آپ', 'aap', 'you (respectful)', 'basics'],
  ['یہ', 'yeh', 'this', 'basics'],
  ['وہ', 'voh', 'that, he, she', 'basics'],
  ['ہم', 'ham', 'we', 'basics'],
  ['میرا', 'mera', 'my', 'basics'],
  ['کیا', 'kya', 'what', 'basics'],
  ['کون', 'kaun', 'who', 'basics'],
  ['کہاں', 'kahaan', 'where', 'basics'],
  ['بڑا', 'bada', 'big', 'basics'],
  ['چھوٹا', 'chhota', 'small', 'basics'],
  ['بہت', 'bahut', 'very, a lot', 'basics'],
  ['ٹھیک', 'theek', 'fine, alright', 'basics'],
  ['اور', 'aur', 'and, more', 'basics'],
  ['لیکن', 'lekin', 'but', 'basics'],
  ['بھی', 'bhi', 'also', 'basics'],
  ['اب', 'ab', 'now', 'basics'],
  ['پھر', 'phir', 'again, then', 'basics'],
  ['سب', 'sab', 'all, everyone', 'basics'],
  ['کچھ', 'kuchh', 'something', 'basics'],
  ['نیا', 'naya', 'new', 'basics'],
  ['پرانا', 'puraana', 'old', 'basics'],
  ['اوپر', 'oopar', 'up, above', 'basics'],
  ['نیچے', 'neeche', 'down, below', 'basics'],
  ['اندر', 'andar', 'inside', 'basics'],
  ['باہر', 'baahar', 'outside', 'basics'],

  /* ========================== doing words ============================== */
  ['ہے', 'hai', 'is', 'actions'],
  ['ہوں', 'hoon', 'am', 'actions'],
  ['ہیں', 'hain', 'are (respectful, or many)', 'actions'],
  ['کھیلنا', 'khelna', 'to play', 'actions'],
  ['پینا', 'peena', 'to drink', 'actions'],
  ['سونا', 'sona', 'to sleep', 'actions'],
  ['جانا', 'jaana', 'to go', 'actions'],
  ['آنا', 'aana', 'to come', 'actions'],
  ['دیکھنا', 'dekhna', 'to see, to watch', 'actions'],
  ['کرنا', 'karna', 'to do', 'actions'],
  ['دینا', 'dena', 'to give', 'actions'],
  ['کہنا', 'kahna', 'to say', 'actions'],
  ['پڑھنا', 'padhna', 'to read', 'actions'],
  ['لکھنا', 'likhna', 'to write', 'actions'],
  ['سننا', 'sunna', 'to listen', 'actions'],
  ['بولنا', 'bolna', 'to speak', 'actions'],
  ['چلنا', 'chalna', 'to walk, to go along', 'actions'],
  ['ہنسنا', 'hansna', 'to laugh', 'actions'],

  /* ============================ animals ================================ */
  ['کتا', 'kutta', 'dog', 'animals'],
  ['بلی', 'billi', 'cat', 'animals'],
  ['گائے', 'gaay', 'cow', 'animals'],
  ['ہاتھی', 'haathi', 'elephant', 'animals'],
  ['چڑیا', 'chidiya', 'bird', 'animals'],
  ['مچھلی', 'machhli', 'fish', 'animals'],
  ['گھوڑا', 'ghoda', 'horse', 'animals'],
  ['شیر', 'sher', 'lion', 'animals'],
  ['بندر', 'bandar', 'monkey', 'animals'],
  ['اونٹ', 'oont', 'camel', 'animals'],
  ['بکری', 'bakri', 'goat', 'animals'],
  ['طوطا', 'tota', 'parrot', 'animals'],
  ['مور', 'mor', 'peacock', 'animals'],
  ['خرگوش', 'khargosh', 'rabbit', 'animals'],

  /* ============================ colours ================================ */
  ['لال', 'laal', 'red', 'colours'],
  ['نیلا', 'neela', 'blue', 'colours'],
  ['پیلا', 'peela', 'yellow', 'colours'],
  ['ہرا', 'hara', 'green', 'colours'],
  ['کالا', 'kaala', 'black', 'colours'],
  ['سفید', 'safed', 'white', 'colours'],
  ['گلابی', 'gulaabi', 'pink', 'colours'],
  ['رنگ', 'rang', 'colour', 'colours'],

  /* ============================ numbers ================================ */
  ['ایک', 'aik', 'one', 'numbers', 1],
  ['دو', 'do', 'two', 'numbers', 2],
  ['تین', 'teen', 'three', 'numbers', 3],
  ['چار', 'chaar', 'four', 'numbers', 4],
  ['پانچ', 'paanch', 'five', 'numbers', 5],
  ['چھ', 'chhe', 'six', 'numbers', 6],
  ['سات', 'saat', 'seven', 'numbers', 7],
  ['آٹھ', 'aath', 'eight', 'numbers', 8],
  ['نو', 'nau', 'nine', 'numbers', 9],
  ['دس', 'das', 'ten', 'numbers', 10],
  ['صفر', 'sifar', 'zero', 'numbers', 0],
  ['بیس', 'bees', 'twenty', 'numbers', 20],
  ['سو', 'sau', 'a hundred', 'numbers', 100],

  /* ============================= school ================================ */
  ['اسکول', 'iskool', 'school', 'school'],
  ['کتاب', 'kitaab', 'book', 'school'],
  ['قلم', 'qalam', 'pen', 'school'],
  ['کاپی', 'kaapi', 'notebook', 'school'],
  ['بستہ', 'basta', 'school bag', 'school'],
  ['استاد', 'ustaad', 'teacher', 'school'],
  ['سبق', 'sabaq', 'lesson', 'school'],
  ['سوال', 'savaal', 'question', 'school'],
  ['جواب', 'javaab', 'answer', 'school'],
  ['نام', 'naam', 'name', 'school'],
  ['لفظ', 'lafz', 'word', 'school'],
  ['کہانی', 'kahani', 'story', 'school'],
  ['کاغذ', 'kaaghaz', 'paper', 'school'],

  /* ============================ clothes ================================ */
  ['کپڑے', 'kapde', 'clothes', 'clothes'],
  ['قمیض', 'qameez', 'shirt, kameez', 'clothes'],
  ['شلوار', 'shalwaar', 'salwar', 'clothes'],
  ['دوپٹہ', 'dupatta', 'dupatta', 'clothes'],
  ['کرتا', 'kurta', 'kurta', 'clothes'],
  ['ٹوپی', 'topi', 'cap', 'clothes'],
  ['جوتا', 'joota', 'shoe', 'clothes'],
  ['چپل', 'chappal', 'slippers', 'clothes'],
  ['موزہ', 'moza', 'sock', 'clothes'],

  /* ========================= weather and sky =========================== */
  ['موسم', 'mausam', 'weather', 'weather'],
  ['دھوپ', 'dhoop', 'sunshine', 'weather'],
  ['بارش', 'baarish', 'rain', 'weather'],
  ['بادل', 'baadal', 'cloud', 'weather'],
  ['ہوا', 'hava', 'wind, air', 'weather'],
  ['سردی', 'sardi', 'winter, the cold', 'weather'],
  ['گرمی', 'garmi', 'summer, the heat', 'weather'],
  ['سورج', 'sooraj', 'sun', 'weather'],
  ['چاند', 'chaand', 'moon', 'weather'],
  ['تارا', 'taara', 'star', 'weather'],
  ['آسمان', 'aasmaan', 'sky', 'weather'],
  ['آندھی', 'aandhi', 'dust storm', 'weather'],

  /* ========================== time and days ============================ */
  ['آج', 'aaj', 'today', 'time'],
  ['کل', 'kal', 'yesterday — and tomorrow, the same word', 'time'],
  ['صبح', 'subah', 'morning', 'time'],
  ['رات', 'raat', 'night', 'time'],
  ['شام', 'shaam', 'evening', 'time'],
  ['دن', 'din', 'day', 'time'],
  ['ہفتہ', 'hafta', 'week', 'time'],
  ['مہینہ', 'maheena', 'month', 'time'],
  ['سال', 'saal', 'year', 'time'],
  ['وقت', 'vaqt', 'time', 'time'],
  ['گھڑی', 'ghadi', 'clock, watch', 'time'],
  ['عید', 'eid', 'Eid — the festival day', 'time'],
  ['جمعہ', 'jumma', 'Friday', 'time'],

  /* ====================== places and outdoors ========================== */
  ['بازار', 'baazaar', 'market', 'places'],
  ['دکان', 'dukaan', 'shop', 'places'],
  ['مسجد', 'masjid', 'mosque', 'places'],
  ['مندر', 'mandir', 'temple', 'places'],
  ['گرودوارہ', 'gurdwaara', 'gurdwara', 'places'],
  ['گرجا گھر', 'girja ghar', 'church', 'places'],
  ['اسپتال', 'aspataal', 'hospital', 'places'],
  ['سڑک', 'sadak', 'road', 'places'],
  ['شہر', 'shahar', 'city', 'places'],
  ['گاؤں', 'gaaon', 'village', 'places'],
  ['ملک', 'mulk', 'country', 'places'],
  ['دریا', 'dariya', 'river', 'places'],
  ['پہاڑ', 'pahaad', 'mountain', 'places'],
  ['باغ', 'baagh', 'garden', 'places'],
  ['درخت', 'darakht', 'tree', 'places'],
  ['پھول', 'phool', 'flower', 'places'],
  ['پارک', 'paark', 'park', 'places'],

  /* ========================== getting around =========================== */
  ['گاڑی', 'gaadi', 'car', 'transport'],
  ['بس', 'bas', 'bus', 'transport'],
  ['ریل گاڑی', 'rel gaadi', 'railway train', 'transport'],
  ['سائیکل', 'saaikil', 'bicycle', 'transport'],
  ['رکشہ', 'riksha', 'rickshaw', 'transport'],
  ['کشتی', 'kashti', 'boat', 'transport'],
  ['جہاز', 'jahaaz', 'ship — and an aeroplane too', 'transport'],
  ['ٹکٹ', 'tikat', 'ticket', 'transport'],

  /* ============================ feelings =============================== */
  ['خوش', 'khush', 'happy', 'feelings'],
  ['خوشی', 'khushi', 'happiness', 'feelings'],
  ['اداس', 'udaas', 'sad', 'feelings'],
  ['غصہ', 'gussa', 'anger', 'feelings'],
  ['ڈر', 'dar', 'fear', 'feelings'],
  ['پیار', 'pyaar', 'love', 'feelings'],
  ['آنسو', 'aansoo', 'tears', 'feelings'],
  ['تھکا', 'thaka', 'tired', 'feelings'],
  ['بیمار', 'beemaar', 'ill', 'feelings'],
  ['مزہ', 'maza', 'fun', 'feelings'],
  ['ہمت', 'himmat', 'courage', 'feelings'],
  ['آرام', 'aaraam', 'rest', 'feelings'],
  ['شرم', 'sharm', 'shyness', 'feelings']
]);

/* -------------------------------------------------------------- PACK ---- */
/* Start from the shared ladder, then patch the stages that assume an
   abugida. Each patch is owned below; everything not patched was checked
   against the generators and works as derived. */

var UR_STAGES = K.ladder(K.stageItems(URDU, UR_LEX));

/* s2 (Matras) — the derived types (matraAttach, barakhadi, soundMatch)
   were all verified against the harakat: gridMatras() sees exactly
   zabar/zer/pesh, matraAttach offers three signs instead of Devanagari's
   twelve, and barakhadi composes the four-column takhti. Only the copy
   needed the truth told. */
UR_STAGES[2].desc = 'Zabar, zer and pesh — the little vowel marks the qaida uses while you learn, and grown-up writing leaves out. Plus tashdeed and jazm, met by sight.';
UR_STAGES[2].outcome = 'Reads any harakat-marked syllable, and knows the marks will vanish from real words.';

/* s4/s5 — no Urdu sentences or dialogues are authored yet, so
   sentenceBuild and pickReply fall back to wordBuild inside the engine.
   The fallback's returned type must be legal for the stage, so wordBuild
   is added to the type lists; the aspirational types STAY listed so the
   authoring gap is visible, exactly as the founding packs keep theirs. */
UR_STAGES[4].types = ['sentenceBuild', 'wordBuild', 'oddOneOut'];
UR_STAGES[5].types = ['pickReply', 'listenPoint', 'wordBuild'];

/* s6 (Padhna) — the abugida ladder splits conjuncts here, and Urdu has
   none: chars([]) would leave the stage empty and conjunctSplit has
   nothing to split. Urdu's stage-6 skill is the one an abjad reader
   actually needs — the letters change shape as they join, so a word does
   not look like its letters laid in a row, and reading real, longer
   joined words is the drill. Items are the lexicon's long words, derived
   (not typed twice) so they can never drift from the lexicon; in
   unvocalized Urdu every letter is its own cluster, so string length IS
   the tile count. */
UR_STAGES[6].types = ['wordBuild', 'oddOneOut'];
UR_STAGES[6].items = (function () {
  var i, o = [];
  for (i = 0; i < UR_LEX.length; i++) {
    if (UR_LEX[i].word.indexOf(' ') < 0 && UR_LEX[i].word.length >= 5) o.push(UR_LEX[i].word);
  }
  return o;
}());
UR_STAGES[6].desc = 'No conjuncts to crack — the letters change shape as they join hands. Reading real, longer words is the drill.';
UR_STAGES[6].outcome = 'Recognises letters in all their joined shapes and reads longer words.';

var UR_PACK = {
  id: 'ur',
  name: { en: 'Urdu', native: 'اردو' },
  script: 'urdu',
  transliteration: 'iso15919+kid',
  phonology: { tones: false, retroflex: true, aspiration: true },  /* ṭ ḍ ṛ and the do-chashmi he aspirates — Urdu shares Hindustani’s sound system */
  voice: { kind: 'human', ns: 'ur' },
  diglossia: null,
  paths: ['heritage', 'beginner'],
  themes: K.THEMES,
  lexicon: UR_LEX,
  reviewedBy: [],                 /* a named native reviewer signs here before ship (docs/09 §9) */
  stages: UR_STAGES
};

K.register(URDU, UR_PACK);

}(window));
