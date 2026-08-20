"use strict";
/* =====================================================================
   Bizzing India — Bhasha pack: Gujarati (ગુજરાતી).

   One script module (Gujarati, U+0A80–U+0AFF) plus one language pack,
   registered through window.IND_BHASHA_KIT — the whole surface is
   documented at the foot of app/bhasha.js. Loads AFTER bhasha.js.

   Gujarati is the headline-less sibling of Devanagari: the same letter
   inventory, the same matra system, the same virama — minus the
   shirorekha. The Unicode block mirrors Devanagari codepoint-for-
   codepoint at +0x180, which is why every offset below lines up with
   the Devanagari module and why the shared grapheme clustering in
   bhasha.js works unchanged.

   Every character in this file is a verified codepoint, checked by
   tools/test-bhasha.js against the block and never trusted from
   rendered glyphs. The lexicon is a DRAFT: glosses, romanisations and
   the handful of judgement calls flagged in comments below want a
   native Gujarati speaker's pass before this pack ships
   (pack.reviewedBy stays empty until someone signs it).
   ===================================================================== */

(function (W) {

var K = W.IND_BHASHA_KIT;

/* ------------------------------------------------------- GUJARATI ------- */
/* U+0A80–U+0AFF. Serves Gujarati. The one visible difference from
   Devanagari — no headline — is exactly one data field here; everything
   else the engine needs is the same shape.

   Not taught, by choice: ઍ (U+0A8D) and ઑ (U+0A91), the candra vowels
   Gujarati uses for English loans (bank, college). A child meets them
   late and rarely; the chart a Gujarati child is handed does not open
   with them, so neither do we. */

var GUJARATI = {
  id: 'gujarati',
  name: 'Gujarati',
  nativeName: 'ગુજરાતી',
  block: [0x0A80, 0x0AFF],
  direction: 'ltr',
  headline: false,                /* the headline-less Devanagari sibling — no shirorekha, letters hang free */
  inherent: 'a',
  virama: '્',               /* ્  U+0ACD halant */
  audioNs: 'gu',
  languages: ['gu'],
  font: { family: 'Mukta Vaani', fallback: 'Noto Sans Gujarati', minSize: 17, lineHeight: 1.75, scale: 1.12 },
  notes: 'Devanagari without the shirorekha: same inventory, same matras, no headline. Keeps ળ.',

  /* 13 svar, mirroring the Devanagari rows: 11 vowel letters plus the
     anusvar/visarga forms taught with the vowels on every chart, written
     as અ + the sign. ઋ keeps its Devanagari slot; Gujarati says it "ru"
     (ઋષિ is Rushi), so the name follows the mouth, not the chart. */
  vowels: [
    { char: 'અ',       name: 'a',  roman: 'a',  audio: 'gu/l-0',  group: 'svar', short: true },
    { char: 'આ',       name: 'aa', roman: 'ā',  audio: 'gu/l-1',  group: 'svar', short: false, pairOf: 'a' },
    { char: 'ઇ',       name: 'i',  roman: 'i',  audio: 'gu/l-2',  group: 'svar', short: true },
    { char: 'ઈ',       name: 'ii', roman: 'ī',  audio: 'gu/l-3',  group: 'svar', short: false, pairOf: 'i' },
    { char: 'ઉ',       name: 'u',  roman: 'u',  audio: 'gu/l-4',  group: 'svar', short: true },
    { char: 'ઊ',       name: 'uu', roman: 'ū',  audio: 'gu/l-5',  group: 'svar', short: false, pairOf: 'u' },
    { char: 'ઋ',       name: 'ru', roman: 'ṛ',  audio: 'gu/l-6',  group: 'svar', short: true },
    { char: 'એ',       name: 'e',  roman: 'e',  audio: 'gu/l-7',  group: 'svar', short: false },
    { char: 'ઐ',       name: 'ai', roman: 'ai', audio: 'gu/l-8',  group: 'svar', short: false },
    { char: 'ઓ',       name: 'o',  roman: 'o',  audio: 'gu/l-9',  group: 'svar', short: false },
    { char: 'ઔ',       name: 'au', roman: 'au', audio: 'gu/l-10', group: 'svar', short: false },
    { char: 'અં',  name: 'am', roman: 'aṁ', audio: 'gu/l-11', group: 'svar', sign: true },
    { char: 'અઃ',  name: 'ah', roman: 'aḥ', audio: 'gu/l-12', group: 'svar', sign: true }
  ],

  /* 34 vyanjan: the Devanagari 33 in varga order, plus ળ — the retroflex
     lateral Gujarati keeps (as Marathi does) where Hindi dropped it. It
     sits at the chart's tail after હ, grouped with the semivowels here
     the way Gurmukhi's ੜ is: a liquid, at the end, one of a kind. */
  consonants: [
    { char: 'ક', name: 'ka',   r: 'k',  audio: 'gu/l-13', group: 'velar' },
    { char: 'ખ', name: 'kha',  r: 'kh', audio: 'gu/l-14', group: 'velar' },
    { char: 'ગ', name: 'ga',   r: 'g',  audio: 'gu/l-15', group: 'velar' },
    { char: 'ઘ', name: 'gha',  r: 'gh', audio: 'gu/l-16', group: 'velar' },
    { char: 'ઙ', name: 'nga',  r: 'ṅ',  audio: 'gu/l-17', group: 'velar' },
    { char: 'ચ', name: 'cha',  r: 'c',  audio: 'gu/l-18', group: 'palatal' },
    { char: 'છ', name: 'chha', r: 'ch', audio: 'gu/l-19', group: 'palatal' },
    { char: 'જ', name: 'ja',   r: 'j',  audio: 'gu/l-20', group: 'palatal' },
    { char: 'ઝ', name: 'jha',  r: 'jh', audio: 'gu/l-21', group: 'palatal' },
    { char: 'ઞ', name: 'nya',  r: 'ñ',  audio: 'gu/l-22', group: 'palatal' },
    { char: 'ટ', name: 'tta',  r: 'ṭ',  audio: 'gu/l-23', group: 'retroflex' },
    { char: 'ઠ', name: 'ttha', r: 'ṭh', audio: 'gu/l-24', group: 'retroflex' },
    { char: 'ડ', name: 'dda',  r: 'ḍ',  audio: 'gu/l-25', group: 'retroflex' },
    { char: 'ઢ', name: 'ddha', r: 'ḍh', audio: 'gu/l-26', group: 'retroflex' },
    { char: 'ણ', name: 'nna',  r: 'ṇ',  audio: 'gu/l-27', group: 'retroflex' },
    { char: 'ત', name: 'ta',   r: 't',  audio: 'gu/l-28', group: 'dental' },
    { char: 'થ', name: 'tha',  r: 'th', audio: 'gu/l-29', group: 'dental' },
    { char: 'દ', name: 'da',   r: 'd',  audio: 'gu/l-30', group: 'dental' },
    { char: 'ધ', name: 'dha',  r: 'dh', audio: 'gu/l-31', group: 'dental' },
    { char: 'ન', name: 'na',   r: 'n',  audio: 'gu/l-32', group: 'dental' },
    { char: 'પ', name: 'pa',   r: 'p',  audio: 'gu/l-33', group: 'labial' },
    { char: 'ફ', name: 'pha',  r: 'ph', audio: 'gu/l-34', group: 'labial' },
    { char: 'બ', name: 'ba',   r: 'b',  audio: 'gu/l-35', group: 'labial' },
    { char: 'ભ', name: 'bha',  r: 'bh', audio: 'gu/l-36', group: 'labial' },
    { char: 'મ', name: 'ma',   r: 'm',  audio: 'gu/l-37', group: 'labial' },
    { char: 'ય', name: 'ya',   r: 'y',  audio: 'gu/l-38', group: 'semivowel' },
    { char: 'ર', name: 'ra',   r: 'r',  audio: 'gu/l-39', group: 'semivowel' },
    { char: 'લ', name: 'la',   r: 'l',  audio: 'gu/l-40', group: 'semivowel' },
    { char: 'વ', name: 'va',   r: 'v',  audio: 'gu/l-41', group: 'semivowel' },
    { char: 'શ', name: 'sha',  r: 'ś',  audio: 'gu/l-42', group: 'sibilant' },
    { char: 'ષ', name: 'shha', r: 'ṣ',  audio: 'gu/l-43', group: 'sibilant' },
    { char: 'સ', name: 'sa',   r: 's',  audio: 'gu/l-44', group: 'sibilant' },
    { char: 'હ', name: 'ha',   r: 'h',  audio: 'gu/l-45', group: 'sibilant' },
    { char: 'ળ', name: 'lla',  r: 'ḷ',  audio: 'gu/l-46', group: 'semivowel' }
  ],

  /* 12 matras, mirroring Devanagari's exactly — same names, same
     positions, same famous rule: િ is typed and stored AFTER the
     consonant but renders BEFORE it. `grid` marks the 11 that make the
     12-column barakhadi (ક કા કિ કી કુ કૂ કે કૈ કો કૌ કં કઃ); ૃ is
     taught but is not a barakhadi column. */
  matras: [
    { sign: 'ા', name: 'aa',      vowel: 'aa', vowelChar: 'આ', position: 'right', example: 'કા', audio: 'gu/m-aa', grid: true },
    { sign: 'િ', name: 'i',       vowel: 'i',  vowelChar: 'ઇ', position: 'left',  example: 'કિ', audio: 'gu/m-i',  grid: true },
    { sign: 'ી', name: 'ii',      vowel: 'ii', vowelChar: 'ઈ', position: 'right', example: 'કી', audio: 'gu/m-ii', grid: true },
    { sign: 'ુ', name: 'u',       vowel: 'u',  vowelChar: 'ઉ', position: 'below', example: 'કુ', audio: 'gu/m-u',  grid: true },
    { sign: 'ૂ', name: 'uu',      vowel: 'uu', vowelChar: 'ઊ', position: 'below', example: 'કૂ', audio: 'gu/m-uu', grid: true },
    { sign: 'ૃ', name: 'ru',      vowel: 'ru', vowelChar: 'ઋ', position: 'below', example: 'કૃ', audio: 'gu/m-ru', grid: false },
    { sign: 'ે', name: 'e',       vowel: 'e',  vowelChar: 'એ', position: 'above', example: 'કે', audio: 'gu/m-e',  grid: true },
    { sign: 'ૈ', name: 'ai',      vowel: 'ai', vowelChar: 'ઐ', position: 'above', example: 'કૈ', audio: 'gu/m-ai', grid: true },
    { sign: 'ો', name: 'o',       vowel: 'o',  vowelChar: 'ઓ', position: 'right', example: 'કો', audio: 'gu/m-o',  grid: true },
    { sign: 'ૌ', name: 'au',      vowel: 'au', vowelChar: 'ઔ', position: 'right', example: 'કૌ', audio: 'gu/m-au', grid: true },
    { sign: 'ં', name: 'anusvar', vowel: 'am', vowelChar: 'અં', position: 'above', example: 'કં', audio: 'gu/m-am', grid: true },
    { sign: 'ઃ', name: 'visarg',  vowel: 'ah', vowelChar: 'અઃ', position: 'right', example: 'કઃ', audio: 'gu/m-ah', grid: true }
  ],

  numerals: [
    { char: '૦', value: 0, name: 'shunya', audio: 'gu/n0' },
    { char: '૧', value: 1, name: 'ek',     audio: 'gu/n1' },
    { char: '૨', value: 2, name: 'be',     audio: 'gu/n2' },
    { char: '૩', value: 3, name: 'tran',   audio: 'gu/n3' },
    { char: '૪', value: 4, name: 'chaar',  audio: 'gu/n4' },
    { char: '૫', value: 5, name: 'paanch', audio: 'gu/n5' },
    { char: '૬', value: 6, name: 'chha',   audio: 'gu/n6' },
    { char: '૭', value: 7, name: 'saat',   audio: 'gu/n7' },
    { char: '૮', value: 8, name: 'aath',   audio: 'gu/n8' },
    { char: '૯', value: 9, name: 'nav',    audio: 'gu/n9' }
  ],

  /* The primer spine, mirroring the Devanagari ten — each is literally
     parts.join(virama), asserted by the smoke test. Example words are
     drawn from this pack's own lexicon wherever it has one (ત્રણ is the
     number three; રિક્ષા, શ્રીખંડ, પ્રેમ, ચિત્ર, ટ્રેન and ઝભ્ભો all
     appear there), so a child meets the conjunct inside a word they
     already tapped. જ્ઞ is named gna because that is the Gujarati
     mouth — jnana is gnaan.

     Audio only on the spine ten, same budget rule as Devanagari: a
     conjunct is taught visually and heard inside its example word. */
  hardConjuncts: [
    { char: 'ક્ષ', parts: ['ક', 'ષ'], name: 'ksha',  audio: 'gu/ksha',  word: 'રિક્ષા' },
    { char: 'જ્ઞ', parts: ['જ', 'ઞ'], name: 'gna',   audio: 'gu/gna',   word: 'જ્ઞાન' },
    { char: 'ત્ર', parts: ['ત', 'ર'], name: 'tra',   audio: 'gu/tra',   word: 'ત્રણ' },
    { char: 'શ્ર', parts: ['શ', 'ર'], name: 'shra',  audio: 'gu/shra',  word: 'શ્રીખંડ' },
    { char: 'પ્ર', parts: ['પ', 'ર'], name: 'pra',   audio: 'gu/pra',   word: 'પ્રેમ' },
    { char: 'ક્ર', parts: ['ક', 'ર'], name: 'kra',   audio: 'gu/kra',   word: 'ચક્ર' },
    { char: 'દ્વ', parts: ['દ', 'વ'], name: 'dva',   audio: 'gu/dva',   word: 'દ્વારકા' },
    { char: 'સ્ત', parts: ['સ', 'ત'], name: 'sta',   audio: 'gu/sta',   word: 'નમસ્તે' },
    { char: 'ચ્ચ', parts: ['ચ', 'ચ'], name: 'chcha', audio: 'gu/chcha', word: 'બચ્ચું' },
    { char: 'ટ્ટ', parts: ['ટ', 'ટ'], name: 'tta-j', audio: 'gu/tta-j', word: 'પટ્ટો' },

    /* first-year extras a reader trips on, no audio (budget rule above) */
    { char: 'ટ્ર', parts: ['ટ', 'ર'], name: 'ttra', word: 'ટ્રેન' },
    { char: 'ભ્ભ', parts: ['ભ', 'ભ'], name: 'bbha', word: 'ઝભ્ભો' },
    { char: 'ક્ય', parts: ['ક', 'ય'], name: 'kya',  word: 'ક્યાં' }
  ]
};

/* ---- Gujarati lexicon --------------------------------------------------- */
/* Heritage-first, same as Hindi (docs/09 §3): what is said in a Gujarati
   house on a Tuesday. A child who already knows what *paani* means needs
   to learn that it is written પાણી, not what it means.

   Two editorial calls worth naming:

   - Family words genuinely vary between homes. In many Gujarati homes
     "ba" is grandmother; in some it is mother. The glosses say so and
     send the child to ask their family, which is the answer.
   - Greetings vary between homes too. જય શ્રી કૃષ્ણ and જય જિનેન્દ્ર
     both open front doors in Gujarati households; both are here, glossed
     even-handedly, and NEITHER is the default hello — that slot is
     નમસ્તે / કેમ છો, which every home shares.

   Rows are [word, roman, en, theme] (+ numeric value for numbers);
   audio keys derive from the roman as gu/w-<roman, spaces removed>. */

var GU_LEX = K.packWords('gu', [

  /* ============ the first words — what is said in the house every day ==== */
  ['નમસ્તે', 'namaste', 'hello', 'greetings'],
  ['કેમ છો', 'kem chho', 'how are you — the greeting itself', 'greetings'],
  ['આવજો', 'aavjo', 'goodbye — literally "come again"', 'greetings'],
  ['હા', 'haa', 'yes', 'greetings'],
  ['ના', 'naa', 'no', 'greetings'],
  ['સારું', 'saaru', 'good, okay', 'greetings'],
  ['આભાર', 'aabhaar', 'thank you', 'greetings'],

  ['મમ્મી', 'mummy', 'mother — what most kids say', 'family'],
  ['મા', 'maa', 'mother', 'family'],
  ['બા', 'baa', 'grandmother in many homes — and mother in some; ask your family', 'family'],
  ['પપ્પા', 'pappa', 'father', 'family'],
  ['દાદા', 'dada', 'grandfather (father’s side)', 'family'],
  ['દાદી', 'dadi', 'grandmother (father’s side)', 'family'],
  ['નાના', 'nana', 'grandfather (mother’s side)', 'family'],
  ['નાની', 'nani', 'grandmother (mother’s side)', 'family'],
  ['ભાઈ', 'bhai', 'brother', 'family'],
  ['બહેન', 'bahen', 'sister', 'family'],

  ['પાણી', 'paani', 'water', 'food'],
  ['રોટલી', 'rotli', 'flatbread', 'food'],
  ['થેપલા', 'thepla', 'spiced flatbread — the road-trip food', 'food'],
  ['ખીચડી', 'khichdi', 'rice and dal cooked soft together', 'food'],
  ['દૂધ', 'doodh', 'milk', 'food'],
  ['ભાત', 'bhaat', 'cooked rice', 'food'],
  ['દાળ', 'daal', 'lentils', 'food'],
  ['શાક', 'shaak', 'the vegetable dish', 'food'],

  ['ઘર', 'ghar', 'house', 'home'],
  ['હું', 'hun', 'I', 'basics'],
  ['વાર્તા', 'vaarta', 'story', 'basics'],

  /* ================= greetings — the rest of the doorway ================= */
  /* Two blessings that both open Gujarati front doors, even-handedly:
     neither is "the" Gujarati hello, and the app never picks one. */
  ['જય શ્રી કૃષ્ણ', 'jai shri krishna', 'a greeting of welcome in many Vaishnav homes', 'greetings'],
  ['જય જિનેન્દ્ર', 'jai jinendra', 'a greeting of welcome in Jain homes', 'greetings'],
  ['પધારો', 'padhaaro', 'welcome — please come in', 'greetings'],
  ['સ્વાગત', 'swaagat', 'welcome', 'greetings'],
  ['માફ કરજો', 'maaf karjo', 'sorry', 'greetings'],
  ['અભિનંદન', 'abhinandan', 'congratulations', 'greetings'],
  ['શુભ રાત્રિ', 'shubh raatri', 'good night', 'greetings'],

  /* ============================ family ================================== */
  ['કાકા', 'kaka', 'uncle (father’s brother)', 'family'],
  ['કાકી', 'kaki', 'aunt (kaka’s wife)', 'family'],
  ['મામા', 'mama', 'uncle (mother’s brother)', 'family'],
  ['મામી', 'mami', 'aunt (mama’s wife)', 'family'],
  ['માસી', 'masi', 'aunt (mother’s sister)', 'family'],
  ['ફોઈ', 'foi', 'aunt (father’s sister)', 'family'],
  ['છોકરો', 'chhokro', 'boy', 'family'],
  ['છોકરી', 'chhokri', 'girl', 'family'],
  ['દીકરો', 'dikro', 'son', 'family'],
  ['દીકરી', 'dikri', 'daughter', 'family'],
  ['બાળક', 'baalak', 'child', 'family'],
  ['કુટુંબ', 'kutumb', 'family', 'family'],
  ['મિત્ર', 'mitra', 'friend', 'family'],

  /* ============================= food =================================== */
  ['ઢોકળા', 'dhokla', 'steamed savoury cake', 'food'],
  ['ખાખરા', 'khakhra', 'crisp roasted flatbread', 'food'],
  ['કેરી', 'keri', 'mango', 'food'],
  ['કેળું', 'kelu', 'banana', 'food'],
  ['સફરજન', 'safarjan', 'apple', 'food'],
  ['ચા', 'chaa', 'tea', 'food'],
  ['મીઠાઈ', 'mithai', 'sweets', 'food'],
  ['લાડુ', 'laadu', 'laddu — the round sweet', 'food'],
  ['શ્રીખંડ', 'shrikhand', 'sweet strained yoghurt', 'food'],
  ['મીઠું', 'mithu', 'salt', 'food'],
  ['ખાંડ', 'khaand', 'sugar', 'food'],
  ['ઘી', 'ghee', 'ghee', 'food'],
  ['દહીં', 'dahin', 'yoghurt', 'food'],
  ['છાશ', 'chhaash', 'buttermilk', 'food'],
  ['ફળ', 'fal', 'fruit', 'food'],
  ['રસ', 'ras', 'juice — mango ras on a summer day', 'food'],

  /* ============================== body ================================== */
  ['માથું', 'maathu', 'head', 'body'],
  ['આંખ', 'aankh', 'eye', 'body'],
  ['નાક', 'naak', 'nose', 'body'],
  ['કાન', 'kaan', 'ear', 'body'],
  ['મોં', 'mon', 'mouth', 'body'],
  ['હાથ', 'haath', 'hand', 'body'],
  ['પગ', 'pag', 'leg, foot', 'body'],
  ['પેટ', 'pet', 'tummy', 'body'],
  ['વાળ', 'vaal', 'hair', 'body'],
  ['દાંત', 'daant', 'tooth', 'body'],
  ['આંગળી', 'aangli', 'finger', 'body'],
  ['જીભ', 'jeebh', 'tongue', 'body'],

  /* ============================== home ================================== */
  ['બારણું', 'baarnu', 'door', 'home'],
  ['બારી', 'baari', 'window', 'home'],
  ['ખુરશી', 'khurshi', 'chair', 'home'],
  ['મેજ', 'mej', 'table', 'home'],
  ['ચાવી', 'chaavi', 'key', 'home'],
  ['પલંગ', 'palang', 'bed', 'home'],
  ['છત', 'chhat', 'roof', 'home'],
  ['રસોડું', 'rasodu', 'kitchen', 'home'],
  ['ઓરડો', 'ordo', 'room', 'home'],
  ['દીવો', 'divo', 'lamp — the divo', 'home'],
  ['ઝાડુ', 'jhaadu', 'broom', 'home'],

  /* ============================= basics ================================= */
  ['તું', 'tun', 'you (to a friend)', 'basics'],
  ['તમે', 'tame', 'you (respectful)', 'basics'],
  ['આ', 'aa', 'this', 'basics'],
  ['તે', 'te', 'that', 'basics'],
  ['અમે', 'ame', 'we', 'basics'],
  ['મારું', 'maaru', 'my', 'basics'],
  ['શું', 'shun', 'what', 'basics'],
  ['કોણ', 'kon', 'who', 'basics'],
  ['ક્યાં', 'kyaan', 'where', 'basics'],
  ['મોટું', 'motu', 'big', 'basics'],
  ['નાનું', 'naanu', 'small', 'basics'],
  ['બહુ', 'bahu', 'very, a lot', 'basics'],
  ['સરસ', 'saras', 'nice, lovely — the word of approval', 'basics'],

  /* ============================= actions ================================ */
  ['છે', 'chhe', 'is', 'actions'],
  ['છું', 'chhun', 'am', 'actions'],
  ['છો', 'chho', 'are', 'actions'],
  ['રમવું', 'ramvu', 'to play', 'actions'],
  ['ખાવું', 'khaavu', 'to eat', 'actions'],
  ['જમવું', 'jamvu', 'to eat a meal — Gujarati dines, jamvu', 'actions'],
  ['પીવું', 'peevu', 'to drink', 'actions'],
  ['સૂવું', 'soovu', 'to sleep', 'actions'],
  ['જવું', 'javu', 'to go', 'actions'],
  ['આવવું', 'aavvu', 'to come', 'actions'],
  ['જોવું', 'jovu', 'to see, to watch', 'actions'],
  ['કરવું', 'karvu', 'to do', 'actions'],
  ['આપવું', 'aapvu', 'to give', 'actions'],
  ['બોલવું', 'bolvu', 'to speak', 'actions'],
  ['વાંચવું', 'vaanchvu', 'to read', 'actions'],

  /* ============================= numbers ================================ */
  ['એક', 'ek', 'one', 'numbers', 1],
  ['બે', 'be', 'two', 'numbers', 2],
  ['ત્રણ', 'tran', 'three', 'numbers', 3],
  ['ચાર', 'chaar', 'four', 'numbers', 4],
  ['પાંચ', 'paanch', 'five', 'numbers', 5],
  ['છ', 'chha', 'six', 'numbers', 6],
  ['સાત', 'saat', 'seven', 'numbers', 7],
  ['આઠ', 'aath', 'eight', 'numbers', 8],
  ['નવ', 'nav', 'nine', 'numbers', 9],
  ['દસ', 'das', 'ten', 'numbers', 10],
  ['સો', 'so', 'hundred', 'numbers', 100],

  /* ============================= colours ================================ */
  ['લાલ', 'laal', 'red', 'colours'],
  ['વાદળી', 'vaadli', 'blue', 'colours'],
  ['પીળો', 'peelo', 'yellow', 'colours'],
  ['લીલો', 'leelo', 'green', 'colours'],
  ['કાળો', 'kaalo', 'black', 'colours'],
  ['સફેદ', 'safed', 'white', 'colours'],
  ['ધોળો', 'dholo', 'white — the word many homes say', 'colours'],
  ['ગુલાબી', 'gulaabi', 'pink', 'colours'],
  ['નારંગી', 'naarangi', 'orange (the colour)', 'colours'],

  /* ============================= animals ================================ */
  ['કૂતરો', 'kootro', 'dog', 'animals'],
  ['બિલાડી', 'bilaadi', 'cat', 'animals'],
  ['ગાય', 'gaay', 'cow', 'animals'],
  ['હાથી', 'haathi', 'elephant', 'animals'],
  ['સિંહ', 'sinh', 'lion — the Gir lion', 'animals'],
  ['વાંદરો', 'vaandro', 'monkey', 'animals'],
  ['પક્ષી', 'pakshi', 'bird', 'animals'],
  ['ચકલી', 'chakli', 'sparrow', 'animals'],
  ['માછલી', 'maachhli', 'fish', 'animals'],
  ['ઘોડો', 'ghodo', 'horse', 'animals'],
  ['મોર', 'mor', 'peacock', 'animals'],
  ['ઊંટ', 'oont', 'camel', 'animals'],
  ['પતંગિયું', 'patangiyu', 'butterfly', 'animals'],

  /* ============================== school ================================ */
  ['નિશાળ', 'nishaal', 'school — the everyday word', 'school'],
  ['શાળા', 'shaalaa', 'school', 'school'],
  ['ચોપડી', 'chopdi', 'book', 'school'],
  ['પેન', 'pen', 'pen', 'school'],
  ['દફતર', 'daftar', 'school bag', 'school'],
  ['કાગળ', 'kaagal', 'paper', 'school'],
  ['ચિત્ર', 'chitra', 'picture, drawing', 'school'],
  ['શિક્ષક', 'shikshak', 'teacher', 'school'],
  ['ભણવું', 'bhanvu', 'to study', 'school'],

  /* =============================== time ================================= */
  ['આજે', 'aaje', 'today', 'time'],
  ['કાલે', 'kaale', 'yesterday — and tomorrow, the same word', 'time'],
  ['સવાર', 'savaar', 'morning', 'time'],
  ['બપોર', 'bapor', 'afternoon', 'time'],
  ['સાંજ', 'saanj', 'evening', 'time'],
  ['રાત', 'raat', 'night', 'time'],
  ['દિવસ', 'divas', 'day', 'time'],
  ['વરસ', 'varas', 'year', 'time'],

  /* ============================= feelings =============================== */
  ['ખુશ', 'khush', 'happy', 'feelings'],
  ['રાજી', 'raaji', 'happy, pleased', 'feelings'],
  ['હેત', 'het', 'love, affection — a very Gujarati word', 'feelings'],
  ['પ્રેમ', 'prem', 'love', 'feelings'],
  ['ભૂખ', 'bhookh', 'hunger', 'feelings'],
  ['ડર', 'dar', 'fear', 'feelings'],

  /* ============================== clothes =============================== */
  ['કપડાં', 'kapdaan', 'clothes', 'clothes'],
  ['ચણિયાચોળી', 'chaniyacholi', 'the garba skirt and blouse', 'clothes'],
  ['સાડી', 'saadi', 'sari', 'clothes'],
  ['ઝભ્ભો', 'jhabbho', 'long loose shirt — a kurta', 'clothes'],
  ['ટોપી', 'topi', 'cap', 'clothes'],
  ['બૂટ', 'boot', 'shoes', 'clothes'],

  /* ============================== weather =============================== */
  ['વરસાદ', 'varsaad', 'rain', 'weather'],
  ['તડકો', 'tadko', 'sunshine', 'weather'],
  ['વાદળ', 'vaadal', 'cloud', 'weather'],
  ['પવન', 'pavan', 'wind', 'weather'],
  ['ઠંડી', 'thandi', 'cold', 'weather'],
  ['ગરમી', 'garmi', 'heat', 'weather'],
  ['સૂરજ', 'sooraj', 'sun', 'weather'],
  ['ચાંદો', 'chaando', 'moon', 'weather'],
  ['તારો', 'taaro', 'star', 'weather'],

  /* ========================= places and outdoors ======================== */
  ['ગામ', 'gaam', 'village', 'places'],
  ['શહેર', 'shaher', 'city', 'places'],
  ['બજાર', 'bajaar', 'market', 'places'],
  /* three doors a Gujarati child may know, named side by side */
  ['મંદિર', 'mandir', 'temple', 'places'],
  ['દેરાસર', 'derasar', 'Jain temple', 'places'],
  ['મસ્જિદ', 'masjid', 'mosque', 'places'],
  ['દરિયો', 'dariyo', 'sea — the long Gujarat coast', 'places'],
  ['નદી', 'nadi', 'river', 'places'],
  ['ઝાડ', 'jhaad', 'tree', 'places'],
  ['ફૂલ', 'phool', 'flower', 'places'],
  ['બગીચો', 'bagicho', 'garden', 'places'],
  ['રસ્તો', 'rasto', 'road', 'places'],
  ['પતંગ', 'patang', 'kite — the Uttarayan sky', 'places'],

  /* ========================== getting around ============================ */
  ['ગાડી', 'gaadi', 'car', 'transport'],
  ['બસ', 'bas', 'bus', 'transport'],
  ['રિક્ષા', 'riksha', 'auto-rickshaw', 'transport'],
  ['સાયકલ', 'saaykal', 'bicycle', 'transport'],
  ['ટ્રેન', 'tren', 'train', 'transport'],
  ['હોડી', 'hodi', 'boat', 'transport'],
  ['વિમાન', 'vimaan', 'aeroplane', 'transport']
]);

/* ---- the pack ----------------------------------------------------------- */
/* Stages 4–6 are NOT authored: the derived skeleton from stageItems() is
   the honest gap (sentences and conversations need a human author and a
   named reviewer before they exist), same as Punjabi. */
var GU_PACK = {
  id: 'gu',
  name: { en: 'Gujarati', native: 'ગુજરાતી' },
  script: 'gujarati',
  transliteration: 'iso15919+kid',
  phonology: { tones: false, retroflex: true, aspiration: true },
  voice: { kind: 'human', ns: 'gu' },
  diglossia: null,
  paths: ['heritage', 'beginner'],
  themes: K.THEMES,
  lexicon: GU_LEX,
  reviewedBy: [],                 /* a native Gujarati speaker signs here before ship */
  stages: K.ladder(K.stageItems(GUJARATI, GU_LEX))
};

K.register(GUJARATI, GU_PACK);

}(window));
