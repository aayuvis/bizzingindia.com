/* Bizzing India — Bhasha pack: Bengali (বাংলা).

   Registers the Bengali script module and the `bn` language pack through
   window.IND_BHASHA_KIT; the whole registration surface is documented at the
   foot of app/bhasha.js, and this file follows the HI/PA shape line for line
   so the diff between packs stays content-only.

   Every Bengali string in this file was verified codepoint by codepoint
   against the Unicode Bengali block (U+0980–U+09FF) with node — nothing was
   transcribed by eye, because a glyph that LOOKS right in one font can be a
   wrong or non-NFC codepoint sequence that silently breaks tile matching.
   tools/test-bhasha.js re-asserts block containment, NFC, conjunct
   composition and audio-key uniqueness on every run.

   And in the way data-nani.js treats its Hindi lines: the whole pack is a
   draft. The letter names, the kid romanisation, the glosses and the word
   choices all want a native Bangla speaker's pass before launch — Bangla is
   spoken across West Bengal, Bangladesh, Tripura, Assam and a very large
   diaspora, and no single register below should be mistaken for "the"
   Bengali. reviewedBy stays empty until a named reviewer signs. */

(function (W) {
'use strict';

var K = W.IND_BHASHA_KIT;

/* ------------------------------------------------------- BENGALI --------- */
/* U+0980–U+09FF. Serves Bengali — and Assamese, which uses this same script
   with two letters of its own (ৰ U+09F0 for r, ৱ U+09F1 for w/v, replacing
   র and adding a v). Those two are NOT included below: this module carries
   the Bengali-language chart, and an `as` pack would extend it the day an
   Assamese pedagogue signs off, exactly as Marathi extends Devanagari.

   THE INHERENT VOWEL IS ô, NOT a. This is the single biggest sound fact of
   the script: a bare ক says "kô" (as in "kalo"→English "cull", not "car").
   The kid romanisation below writes that vowel ô everywhere, so a child
   (and the recording session) never drifts into Hindi-style "ka". */

var BENGALI = {
  id: 'bengali',
  name: 'Bengali',
  nativeName: 'বাংলা',
  block: [0x0980, 0x09FF],
  direction: 'ltr',
  headline: true,                 /* the matra — Bangla's unbroken headstroke */
  inherent: 'ô',                  /* bare consonant carries ô, never a — see note above */
  virama: '্',               /* ্  U+09CD, the hasant */
  audioNs: 'bn',
  languages: ['bn', 'as'],
  /* Noto Sans Bengali is the one Bengali face self-hosted in app/fonts.css;
     there is no second Bengali family bundled, so the fallback is the bare
     generic. Line height runs a shade taller than Devanagari's because the
     ু/ূ signs hang deep and the reph rides high. */
  font: { family: 'Noto Sans Bengali', fallback: 'sans-serif', minSize: 17, lineHeight: 1.8, scale: 1.12 },
  notes: 'Set correctly or not at all, same rule as Devanagari: real Bengali face, unbroken matra headstroke, never letter-spaced. The inherent vowel is ô, not a.',

  /* 11 shorboborno, then the three sign-rows the barnamala chart ends with —
     অং অঃ অঁ, written as অ + the sign and marked sign:true, exactly as
     Devanagari builds its अं/अः rows. Bangla charts keep chandrobindu on the
     chart (Devanagari's does not), so it gets a row here too.

     No pairOf between অ and আ, deliberately: in Bangla they differ in
     QUALITY (ô vs a), not length, so they are chart neighbours but not a
     short/long pair the way ই/ঈ and উ/ঊ are. In modern Bangla even those
     two pairs SOUND identical and differ only in spelling — the drill
     teaches the spelling distinction, the voice will not fake a length
     difference that speech does not make. */
  vowels: [
    { char: 'অ',         name: 'shore-o',      roman: 'ô',  audio: 'bn/l-0',  group: 'shor', short: true },
    { char: 'আ',         name: 'shore-a',      roman: 'a',  audio: 'bn/l-1',  group: 'shor', short: false },
    { char: 'ই',         name: 'hrossho-i',    roman: 'i',  audio: 'bn/l-2',  group: 'shor', short: true },
    { char: 'ঈ',         name: 'dirgho-i',     roman: 'ī',  audio: 'bn/l-3',  group: 'shor', short: false, pairOf: 'hrossho-i' },
    { char: 'উ',         name: 'hrossho-u',    roman: 'u',  audio: 'bn/l-4',  group: 'shor', short: true },
    { char: 'ঊ',         name: 'dirgho-u',     roman: 'ū',  audio: 'bn/l-5',  group: 'shor', short: false, pairOf: 'hrossho-u' },
    { char: 'ঋ',         name: 'ri',           roman: 'ri', audio: 'bn/l-6',  group: 'shor', short: true },
    { char: 'এ',         name: 'e',            roman: 'e',  audio: 'bn/l-7',  group: 'shor', short: false },
    { char: 'ঐ',         name: 'oi',           roman: 'oi', audio: 'bn/l-8',  group: 'shor', short: false },
    { char: 'ও',         name: 'o',            roman: 'o',  audio: 'bn/l-9',  group: 'shor', short: false },
    { char: 'ঔ',         name: 'ou',           roman: 'ou', audio: 'bn/l-10', group: 'shor', short: false },
    { char: 'অং',   name: 'anushshar',    roman: 'ông', audio: 'bn/l-11', group: 'shor', sign: true },
    { char: 'অঃ',   name: 'bisorgo',      roman: 'ôh',  audio: 'bn/l-12', group: 'shor', sign: true },
    { char: 'অঁ',   name: 'chondrobindu', roman: 'ôñ',  audio: 'bn/l-13', group: 'shor', sign: true }
  ],

  /* 32 banjonborno in varga order (Bangla has no separate va — ব carries
     both b and the Sanskrit v), then খণ্ড ত. Names are the ones a Bangla
     child is actually taught: জ and য are told apart as borgiyo-jo and
     ontostho-jo (both say "j" in Bangla), and the three sibilants by their
     row — talobbo (palatal), murdhonno (retroflex), donto (dental) sho —
     because in speech all three usually say "sh" and only the chart name
     distinguishes them. The r-values stay ISO so the romanisation records
     the SPELLING; the voice files record the sound.

     ৎ (khôndo tô) closes the list with group 'special': it is a real letter
     of the chart but it is a bare final t that NEVER takes a vowel or a
     matra — a UI building barakhadi/matra drills should skip group
     'special', because ৎ + a matra is not a syllable any child will meet. */
  consonants: [
    { char: 'ক', name: 'ko',           r: 'k',   audio: 'bn/l-14', group: 'velar' },
    { char: 'খ', name: 'kho',          r: 'kh',  audio: 'bn/l-15', group: 'velar' },
    { char: 'গ', name: 'go',           r: 'g',   audio: 'bn/l-16', group: 'velar' },
    { char: 'ঘ', name: 'gho',          r: 'gh',  audio: 'bn/l-17', group: 'velar' },
    { char: 'ঙ', name: 'ungo',         r: 'ṅ',   audio: 'bn/l-18', group: 'velar' },
    { char: 'চ', name: 'cho',          r: 'c',   audio: 'bn/l-19', group: 'palatal' },
    { char: 'ছ', name: 'chho',         r: 'ch',  audio: 'bn/l-20', group: 'palatal' },
    { char: 'জ', name: 'borgiyo-jo',   r: 'j',   audio: 'bn/l-21', group: 'palatal' },
    { char: 'ঝ', name: 'jho',          r: 'jh',  audio: 'bn/l-22', group: 'palatal' },
    { char: 'ঞ', name: 'nio',          r: 'ñ',   audio: 'bn/l-23', group: 'palatal' },
    { char: 'ট', name: 'tto',          r: 'ṭ',   audio: 'bn/l-24', group: 'retroflex' },
    { char: 'ঠ', name: 'ttho',         r: 'ṭh',  audio: 'bn/l-25', group: 'retroflex' },
    { char: 'ড', name: 'ddo',          r: 'ḍ',   audio: 'bn/l-26', group: 'retroflex' },
    { char: 'ঢ', name: 'ddho',         r: 'ḍh',  audio: 'bn/l-27', group: 'retroflex' },
    { char: 'ণ', name: 'murdhonno-no', r: 'ṇ',   audio: 'bn/l-28', group: 'retroflex' },
    { char: 'ত', name: 'to',           r: 't',   audio: 'bn/l-29', group: 'dental' },
    { char: 'থ', name: 'tho',          r: 'th',  audio: 'bn/l-30', group: 'dental' },
    { char: 'দ', name: 'do',           r: 'd',   audio: 'bn/l-31', group: 'dental' },
    { char: 'ধ', name: 'dho',          r: 'dh',  audio: 'bn/l-32', group: 'dental' },
    { char: 'ন', name: 'donto-no',     r: 'n',   audio: 'bn/l-33', group: 'dental' },
    { char: 'প', name: 'po',           r: 'p',   audio: 'bn/l-34', group: 'labial' },
    { char: 'ফ', name: 'pho',          r: 'ph',  audio: 'bn/l-35', group: 'labial' },
    { char: 'ব', name: 'bo',           r: 'b',   audio: 'bn/l-36', group: 'labial' },
    { char: 'ভ', name: 'bho',          r: 'bh',  audio: 'bn/l-37', group: 'labial' },
    { char: 'ম', name: 'mo',           r: 'm',   audio: 'bn/l-38', group: 'labial' },
    { char: 'য', name: 'ontostho-jo',  r: 'y',   audio: 'bn/l-39', group: 'semivowel' },
    { char: 'র', name: 'ro',           r: 'r',   audio: 'bn/l-40', group: 'semivowel' },
    { char: 'ল', name: 'lo',           r: 'l',   audio: 'bn/l-41', group: 'semivowel' },
    { char: 'শ', name: 'talobbo-sho',  r: 'ś',   audio: 'bn/l-42', group: 'sibilant' },
    { char: 'ষ', name: 'murdhonno-sho', r: 'ṣ',  audio: 'bn/l-43', group: 'sibilant' },
    { char: 'স', name: 'donto-sho',    r: 's',   audio: 'bn/l-44', group: 'sibilant' },
    { char: 'হ', name: 'ho',           r: 'h',   audio: 'bn/l-45', group: 'sibilant' },
    { char: 'ৎ', name: 'khondo-to',    r: 't',   audio: 'bn/l-46', group: 'special' }
  ],

  /* 12 signs mirroring Devanagari's 12-column layout: the ten kars plus the
     anushshar and bisorgo rows. `position` is the drag-target hint the UI
     speaks aloud as "It goes <position>." (app.js), so its vocabulary is
     left / right / above / below — there is no 'both'.

     ে and ৈ genuinely render BEFORE their consonant, so 'left' is simply
     true (storage order stays consonant-then-sign; the shaper moves them,
     same as Devanagari's ি).

     ো and ৌ are the honest compromise: each is a TWO-PART sign that wraps
     the consonant — an ে-shaped arm before it and a া / ৗ arm after it
     (কো, কৌ). They are stored as the single codepoints U+09CB / U+09CC —
     NFC composes ে+া and ে+ৗ into these, verified with node — so they stay
     one drag tile. Position says 'left' because the left arm is the one a
     new reader must learn to expect; the comment, the example glyph and the
     voice carry the wraps-both-sides truth the one-word hint cannot.

     ৃ is taught but is not a grid column, same call as Devanagari's ृ. */
  matras: [
    { sign: 'া', name: 'akar',         vowel: 'a',  vowelChar: 'আ', position: 'right', example: 'কা', audio: 'bn/m-akar',         grid: true },
    { sign: 'ি', name: 'hrossho-ikar', vowel: 'i',  vowelChar: 'ই', position: 'left',  example: 'কি', audio: 'bn/m-hrossho-ikar', grid: true },
    { sign: 'ী', name: 'dirgho-ikar',  vowel: 'ī',  vowelChar: 'ঈ', position: 'right', example: 'কী', audio: 'bn/m-dirgho-ikar',  grid: true },
    { sign: 'ু', name: 'hrossho-ukar', vowel: 'u',  vowelChar: 'উ', position: 'below', example: 'কু', audio: 'bn/m-hrossho-ukar', grid: true },
    { sign: 'ূ', name: 'dirgho-ukar',  vowel: 'ū',  vowelChar: 'ঊ', position: 'below', example: 'কূ', audio: 'bn/m-dirgho-ukar',  grid: true },
    { sign: 'ৃ', name: 'rikar',        vowel: 'ri', vowelChar: 'ঋ', position: 'below', example: 'কৃ', audio: 'bn/m-rikar',        grid: false },
    { sign: 'ে', name: 'ekar',         vowel: 'e',  vowelChar: 'এ', position: 'left',  example: 'কে', audio: 'bn/m-ekar',         grid: true },
    { sign: 'ৈ', name: 'oikar',        vowel: 'oi', vowelChar: 'ঐ', position: 'left',  example: 'কৈ', audio: 'bn/m-oikar',        grid: true },
    { sign: 'ো', name: 'okar',         vowel: 'o',  vowelChar: 'ও', position: 'left',  example: 'কো', audio: 'bn/m-okar',         grid: true },
    { sign: 'ৌ', name: 'oukar',        vowel: 'ou', vowelChar: 'ঔ', position: 'left',  example: 'কৌ', audio: 'bn/m-oukar',        grid: true },
    { sign: 'ং', name: 'anushshar',    vowel: 'ng', vowelChar: 'অং', position: 'above', example: 'কং', audio: 'bn/m-anushshar',   grid: true },
    { sign: 'ঃ', name: 'bisorgo',      vowel: 'h',  vowelChar: 'অঃ', position: 'right', example: 'কঃ', audio: 'bn/m-bisorgo',     grid: true }
  ],

  numerals: [
    { char: '০', value: 0, name: 'shunno', audio: 'bn/n0' },
    { char: '১', value: 1, name: 'êk',     audio: 'bn/n1' },
    { char: '২', value: 2, name: 'dui',    audio: 'bn/n2' },
    { char: '৩', value: 3, name: 'tin',    audio: 'bn/n3' },
    { char: '৪', value: 4, name: 'char',   audio: 'bn/n4' },
    { char: '৫', value: 5, name: 'pãch',   audio: 'bn/n5' },
    { char: '৬', value: 6, name: 'chhoy',  audio: 'bn/n6' },
    { char: '৭', value: 7, name: 'shat',   audio: 'bn/n7' },
    { char: '৮', value: 8, name: 'at',     audio: 'bn/n8' },
    { char: '৯', value: 9, name: 'nôy',    audio: 'bn/n9' }
  ],

  /* ড় ঢ় য় — full members of the Bangla chart, but structurally they are
     base letter + U+09BC nukta, exactly Devanagari's nuktaLetters case, so
     they live here rather than in the 32. And exactly the same NFC rule:
     U+09DC / U+09DD / U+09DF are Unicode composition exclusions, so the NFC
     form is the DECOMPOSED pair and that is what is stored — verified with
     node. Held any other way, ড় in a matched tile and ড় in a lexicon word
     could be two different strings and matching would silently fail. */
  nuktaLetters: [
    { char: 'ড়', name: 'rro',  base: 'ড', audio: 'bn/rro' },   /* ḍôye shunno rô */
    { char: 'ঢ়', name: 'rrho', base: 'ঢ', audio: 'bn/rrho' },  /* ḍhôye shunno rô */
    { char: 'য়', name: 'oyo',  base: 'য', audio: 'bn/oyo' }    /* ôntostho ô     */
  ],

  /* The primer spine — the juktakkhor a Bangla child meets in year one,
     each one a word they already say. Every char is literally
     parts.join(virama), asserted by the test. The first ten carry voice
     keys; the rest are taught visually and heard inside their example word,
     same audio budget call as Devanagari.

     The last two are the two র shapes: the reph (র্ক — র্ climbs on top of
     the NEXT letter, as in পার্ক) and the rôfola (ক্র — র hangs as a
     diagonal stroke under the letter BEFORE it, as in ক্রিকেট). Same two
     facts as Devanagari's reph, different drawn shapes. */
  hardConjuncts: [
    { char: 'ক্ষ', parts: ['ক', 'ষ'], name: 'khiyo', audio: 'bn/khiyo', word: 'ক্ষমা' },
    { char: 'জ্ঞ', parts: ['জ', 'ঞ'], name: 'gyo',   audio: 'bn/gyo',   word: 'জ্ঞান' },
    { char: 'ঙ্গ', parts: ['ঙ', 'গ'], name: 'ngga',  audio: 'bn/ngga',  word: 'বঙ্গ' },
    { char: 'ঞ্চ', parts: ['ঞ', 'চ'], name: 'ncho',  audio: 'bn/ncho',  word: 'চঞ্চল' },
    { char: 'ঞ্জ', parts: ['ঞ', 'জ'], name: 'njo',   audio: 'bn/njo',   word: 'গেঞ্জি' },
    { char: 'ন্দ', parts: ['ন', 'দ'], name: 'ndo',   audio: 'bn/ndo',   word: 'সন্দেশ' },
    { char: 'ন্ধ', parts: ['ন', 'ধ'], name: 'ndho',  audio: 'bn/ndho',  word: 'বন্ধু' },
    { char: 'ম্প', parts: ['ম', 'প'], name: 'mpo',   audio: 'bn/mpo',   word: 'চম্পা' },
    { char: 'ম্ব', parts: ['ম', 'ব'], name: 'mbo',   audio: 'bn/mbo',   word: 'লম্বা' },
    { char: 'স্ত', parts: ['স', 'ত'], name: 'sto',   audio: 'bn/sto',   word: 'রাস্তা' },

    { char: 'স্ক', parts: ['স', 'ক'], name: 'sko',    word: 'স্কুল' },
    { char: 'ষ্ট', parts: ['ষ', 'ট'], name: 'shto',   word: 'মিষ্টি' },
    { char: 'ত্ত', parts: ['ত', 'ত'], name: 'tto-j',  word: 'উত্তর' },
    { char: 'দ্ধ', parts: ['দ', 'ধ'], name: 'ddho-j', word: 'বুদ্ধি' },
    { char: 'ট্ট', parts: ['ট', 'ট'], name: 'ttto-j', word: 'ছোট্ট' },
    { char: 'চ্চ', parts: ['চ', 'চ'], name: 'chcho-j', word: 'বাচ্চা' },

    { char: 'র্ক', parts: ['র', 'ক'], name: 'rko', word: 'পার্ক' },      /* the reph   */
    { char: 'ক্র', parts: ['ক', 'র'], name: 'kro', word: 'ক্রিকেট' }     /* the rôfola */
  ]
};

/* ---- Bengali lexicon ----------------------------------------------------
   Heritage-first (docs/09 §3): what a Bengali household says on a Tuesday.
   The child already knows what mishti means — they need to learn it is
   written মিষ্টি. Romanisation is kid-style like HI_LEX (roshogolla, never
   rasagollā); audio keys derive from the roman via packWords, so the roman
   IS the recording manifest and must stay unique.

   INTERNAL DIVERSITY IS DATA HERE, not a footnote. Bengali households
   genuinely differ: water is জল jol in many families and পানি pani in many
   others; the greeting is নমস্কার in many and সালাম / আসসালামু আলাইকুম in
   many others; the mother's sister is mashi in some houses and khala in
   others; the big autumn festival is Pujo in some and the year's peak is
   Eid in others. BOTH members of every such pair are below, glossed
   even-handedly, neither as "the" default — per the editorial policy, and
   per "ask your family."

   And the famous false friend, stated up front because it bites every
   bilingual cousin: in Bangla, dada is your ELDER BROTHER and didi your
   elder sister — not your grandparents. Grandfather is dadu or thakurda,
   grandmother is didima or thakuma (and nana/nani on the mother's side in
   many Muslim families). The glosses hold that line. */

var BN_LEX = K.packWords('bn', [

  /* ============ greetings — every doorway, warmly ======================== */
  ['নমস্কার', 'nomoshkar', 'hello — said with joined hands in many families', 'greetings'],
  ['সালাম', 'salam', 'hello — the warm salaam of many families', 'greetings'],
  ['আসসালামু আলাইকুম', 'assalamu alaikum', 'peace be upon you — the full greeting in many families', 'greetings'],
  ['হ্যাঁ', 'hyan', 'yes', 'greetings'],
  ['না', 'na', 'no', 'greetings'],
  ['আচ্ছা', 'achchha', 'okay, I see', 'greetings'],
  ['ধন্যবাদ', 'dhonnobad', 'thank you', 'greetings'],
  ['আসি', 'ashi', 'goodbye — literally "I shall come again", the Bengali way of leaving', 'greetings'],
  ['বিদায়', 'biday', 'farewell', 'greetings'],
  ['দয়া করে', 'doya kore', 'please', 'greetings'],
  ['দুঃখিত', 'dukkhito', 'sorry', 'greetings'],
  ['শুভ সকাল', 'shubho shokal', 'good morning', 'greetings'],

  /* ============ family — and the dada/didi rule ========================== */
  ['মা', 'ma', 'mother', 'family'],
  ['বাবা', 'baba', 'father', 'family'],
  ['দাদা', 'dada', 'elder brother — in Bangla, dada is your big brother, not your grandfather', 'family'],
  ['দিদি', 'didi', 'elder sister — what you call her', 'family'],
  ['ভাই', 'bhai', 'brother', 'family'],
  ['বোন', 'bon', 'sister', 'family'],
  ['দাদু', 'dadu', 'grandfather — in many families the mother’s side, in many simply Grandpa', 'family'],
  ['দিদিমা', 'didima', 'grandmother (mother’s side)', 'family'],
  ['ঠাকুরদা', 'thakurda', 'grandfather (father’s side), in many families', 'family'],
  ['ঠাকুমা', 'thakuma', 'grandmother (father’s side), in many families', 'family'],
  ['নানা', 'nana', 'grandfather (mother’s side) — the word in many Muslim families', 'family'],
  ['নানি', 'nani', 'grandmother (mother’s side) — the word in many Muslim families', 'family'],
  ['মামা', 'mama', 'uncle (mother’s brother)', 'family'],
  ['মাসি', 'mashi', 'aunt (mother’s sister) — in many families', 'family'],
  ['খালা', 'khala', 'aunt (mother’s sister) — in many other families', 'family'],
  ['কাকা', 'kaka', 'uncle (father’s younger brother) — chacha in many families', 'family'],
  ['পিসি', 'pishi', 'aunt (father’s sister) — phupu in many families', 'family'],
  ['ছেলে', 'chhele', 'boy, son', 'family'],
  ['মেয়ে', 'meye', 'girl, daughter', 'family'],
  ['শিশু', 'shishu', 'child, baby', 'family'],
  ['বন্ধু', 'bondhu', 'friend', 'family'],
  ['পরিবার', 'poribar', 'family', 'family'],

  /* ============ food — bhat, machh and the sweets ======================== */
  ['ভাত', 'bhat', 'rice — cooked rice, and the word for the meal itself', 'food'],
  ['মাছ', 'machh', 'fish', 'food'],
  ['ডাল', 'dal', 'lentils', 'food'],
  ['জল', 'jol', 'water — in many families jol, in many others pani', 'food'],
  ['পানি', 'pani', 'water — in many families pani, in many others jol', 'food'],
  ['দুধ', 'dudh', 'milk', 'food'],
  ['মিষ্টি', 'mishti', 'sweets — and the word for "sweet"', 'food'],
  ['দই', 'doi', 'yoghurt — the famous mishti doi', 'food'],
  ['রসগোল্লা', 'roshogolla', 'roshogolla', 'food'],
  ['সন্দেশ', 'shondesh', 'shondesh — the milk sweet', 'food'],
  ['রুটি', 'ruti', 'flatbread', 'food'],
  ['লুচি', 'luchi', 'luchi — puffed fried bread', 'food'],
  ['খিচুড়ি', 'khichuri', 'khichuri — rice and dal cooked together', 'food'],
  ['পায়েস', 'payesh', 'rice pudding — the birthday bowl', 'food'],
  ['ইলিশ', 'ilish', 'hilsa — the most loved fish there is', 'food'],
  ['মুড়ি', 'muri', 'puffed rice', 'food'],
  ['চা', 'cha', 'tea', 'food'],
  ['আম', 'aam', 'mango', 'food'],
  ['কলা', 'kola', 'banana', 'food'],
  ['আলু', 'alu', 'potato', 'food'],
  ['বেগুন', 'begun', 'aubergine', 'food'],
  ['ডিম', 'dim', 'egg', 'food'],
  ['নুন', 'nun', 'salt', 'food'],
  ['ফল', 'phol', 'fruit', 'food'],
  ['সবজি', 'shobji', 'vegetables', 'food'],

  /* ============ body ===================================================== */
  ['মাথা', 'matha', 'head', 'body'],
  ['চোখ', 'chokh', 'eye', 'body'],
  ['নাক', 'nak', 'nose', 'body'],
  ['কান', 'kan', 'ear', 'body'],
  ['মুখ', 'mukh', 'mouth — and face; Bangla uses one word for both', 'body'],
  ['হাত', 'hat', 'hand', 'body'],
  ['পা', 'pa', 'foot, leg', 'body'],
  ['পেট', 'pet', 'tummy', 'body'],
  ['চুল', 'chul', 'hair', 'body'],
  ['দাঁত', 'dant', 'tooth', 'body'],
  ['জিভ', 'jibh', 'tongue', 'body'],
  ['গলা', 'gola', 'throat — and voice', 'body'],
  ['আঙুল', 'angul', 'finger', 'body'],
  ['পিঠ', 'pith', 'back', 'body'],

  /* ============ home ===================================================== */
  ['বাড়ি', 'bari', 'house, home', 'home'],
  ['ঘর', 'ghor', 'room — and home', 'home'],
  ['দরজা', 'dorja', 'door', 'home'],
  ['জানালা', 'janala', 'window', 'home'],
  ['টেবিল', 'tebil', 'table', 'home'],
  ['চেয়ার', 'cheyar', 'chair', 'home'],
  ['বিছানা', 'bichhana', 'bed', 'home'],
  ['ছাদ', 'chhad', 'roof — where Kolkata flies its kites', 'home'],
  ['রান্নাঘর', 'rannaghor', 'kitchen', 'home'],
  ['চাবি', 'chabi', 'key', 'home'],
  ['থালা', 'thala', 'plate', 'home'],
  ['বাটি', 'bati', 'bowl', 'home'],
  ['চামচ', 'chamoch', 'spoon', 'home'],
  ['গ্লাস', 'glash', 'glass', 'home'],
  ['আলমারি', 'almari', 'cupboard', 'home'],
  ['উঠোন', 'uthon', 'courtyard', 'home'],

  /* ============ everyday words =========================================== */
  ['আমি', 'ami', 'I', 'basics'],
  ['তুমি', 'tumi', 'you (to a friend)', 'basics'],
  ['আপনি', 'apni', 'you (respectful)', 'basics'],
  ['সে', 'she', 'he, she', 'basics'],
  ['আমরা', 'amra', 'we', 'basics'],
  ['এটা', 'eta', 'this', 'basics'],
  ['ওটা', 'ota', 'that', 'basics'],
  ['কী', 'ki', 'what', 'basics'],
  ['কে', 'ke', 'who', 'basics'],
  ['কোথায়', 'kothay', 'where', 'basics'],
  ['কেন', 'keno', 'why', 'basics'],
  ['কেমন', 'kemon', 'how — kemon achho? is how Bangla asks "how are you?"', 'basics'],
  ['বড়', 'boro', 'big', 'basics'],
  ['ছোট', 'chhoto', 'small', 'basics'],
  ['ভালো', 'bhalo', 'good', 'basics'],
  ['খুব', 'khub', 'very', 'basics'],
  ['আরো', 'aro', 'more', 'basics'],
  ['এখন', 'ekhon', 'now', 'basics'],
  ['এখানে', 'ekhane', 'here', 'basics'],

  /* ============ doing words ============================================== */
  ['খাওয়া', 'khaoya', 'to eat', 'actions'],
  ['যাওয়া', 'jaoya', 'to go', 'actions'],
  ['আসা', 'asha', 'to come', 'actions'],
  ['দেখা', 'dekha', 'to see', 'actions'],
  ['শোনা', 'shona', 'to hear, to listen', 'actions'],
  ['বলা', 'bola', 'to speak, to say', 'actions'],
  ['খেলা', 'khela', 'to play — and a game', 'actions'],
  ['পড়া', 'pora', 'to read — and to study', 'actions'],
  ['লেখা', 'lekha', 'to write', 'actions'],
  ['ঘুমানো', 'ghumano', 'to sleep', 'actions'],
  ['দেওয়া', 'deoya', 'to give', 'actions'],
  ['নেওয়া', 'neoya', 'to take', 'actions'],
  ['করা', 'kora', 'to do', 'actions'],
  ['বসা', 'bosha', 'to sit', 'actions'],

  /* ============ animals — the Royal Bengal first ========================= */
  ['বাঘ', 'bagh', 'tiger — the Royal Bengal Tiger of the Sundarbans', 'animals'],
  ['কুকুর', 'kukur', 'dog', 'animals'],
  ['বিড়াল', 'biral', 'cat', 'animals'],
  ['গরু', 'goru', 'cow', 'animals'],
  ['হাতি', 'hati', 'elephant', 'animals'],
  ['পাখি', 'pakhi', 'bird', 'animals'],
  ['সিংহ', 'shingho', 'lion', 'animals'],
  ['বাঁদর', 'bandor', 'monkey', 'animals'],
  ['ঘোড়া', 'ghora', 'horse', 'animals'],
  ['ছাগল', 'chhagol', 'goat', 'animals'],
  ['হরিণ', 'horin', 'deer', 'animals'],
  ['ইঁদুর', 'indur', 'mouse', 'animals'],
  ['প্রজাপতি', 'projapoti', 'butterfly', 'animals'],
  ['ব্যাঙ', 'byang', 'frog', 'animals'],
  ['মুরগি', 'murgi', 'hen', 'animals'],
  ['টিয়া', 'tiya', 'parrot', 'animals'],
  ['কাক', 'kak', 'crow', 'animals'],
  ['শিয়াল', 'shiyal', 'fox — the clever one of every Bangla folktale', 'animals'],

  /* ============ colours ================================================== */
  ['লাল', 'lal', 'red', 'colours'],
  ['নীল', 'nil', 'blue', 'colours'],
  ['হলুদ', 'holud', 'yellow — and the word for turmeric', 'colours'],
  ['সবুজ', 'shobuj', 'green', 'colours'],
  ['কালো', 'kalo', 'black', 'colours'],
  ['সাদা', 'shada', 'white', 'colours'],
  ['গোলাপি', 'golapi', 'pink — from golap, the rose', 'colours'],
  ['কমলা', 'komla', 'orange — the colour and the fruit', 'colours'],
  ['রং', 'rong', 'colour', 'colours'],

  /* ============ numbers ================================================== */
  ['শূন্য', 'shunno', 'zero', 'numbers', 0],
  ['এক', 'ek', 'one', 'numbers', 1],
  ['দুই', 'dui', 'two', 'numbers', 2],
  ['তিন', 'tin', 'three', 'numbers', 3],
  ['চার', 'char', 'four', 'numbers', 4],
  ['পাঁচ', 'panch', 'five', 'numbers', 5],
  ['ছয়', 'chhoy', 'six', 'numbers', 6],
  ['সাত', 'shat', 'seven', 'numbers', 7],
  ['আট', 'aat', 'eight', 'numbers', 8],
  ['নয়', 'noy', 'nine', 'numbers', 9],
  ['দশ', 'dosh', 'ten', 'numbers', 10],

  /* ============ school =================================================== */
  ['স্কুল', 'skul', 'school', 'school'],
  ['বই', 'boi', 'book — the word behind the Boi Mela, the book fair', 'school'],
  ['কলম', 'kolom', 'pen', 'school'],
  ['খাতা', 'khata', 'notebook', 'school'],
  ['শিক্ষক', 'shikkhok', 'teacher', 'school'],
  ['ছবি', 'chhobi', 'picture', 'school'],
  ['গল্প', 'golpo', 'story', 'school'],
  ['গান', 'gaan', 'song — Bangla runs on songs', 'school'],
  ['নাম', 'nam', 'name', 'school'],
  ['পড়াশোনা', 'porashona', 'studies, schoolwork', 'school'],

  /* ============ clothes ================================================== */
  ['জামা', 'jama', 'shirt, clothes', 'clothes'],
  ['শাড়ি', 'shari', 'sari', 'clothes'],
  ['পাঞ্জাবি', 'panjabi', 'panjabi — the kurta of every Bengali occasion', 'clothes'],
  ['ধুতি', 'dhuti', 'dhoti', 'clothes'],
  ['লুঙ্গি', 'lungi', 'lungi', 'clothes'],
  ['জুতো', 'juto', 'shoes', 'clothes'],
  ['টুপি', 'tupi', 'cap', 'clothes'],
  ['চশমা', 'choshma', 'glasses', 'clothes'],

  /* ============ weather and sky ========================================== */
  ['বৃষ্টি', 'brishti', 'rain — the sound half of Bangla poetry is made of', 'weather'],
  ['রোদ', 'rod', 'sunshine', 'weather'],
  ['মেঘ', 'megh', 'cloud', 'weather'],
  ['ঝড়', 'jhor', 'storm', 'weather'],
  ['আকাশ', 'akash', 'sky', 'weather'],
  ['সূর্য', 'shurjo', 'sun', 'weather'],
  ['চাঁদ', 'chand', 'moon — chander pahar, the moon of every lullaby', 'weather'],
  ['তারা', 'tara', 'star', 'weather'],
  ['বাতাস', 'batash', 'wind, air', 'weather'],
  ['শীত', 'shit', 'winter, the cold', 'weather'],
  ['গরম', 'gorom', 'hot, the heat', 'weather'],

  /* ============ time and days ============================================ */
  ['আজ', 'aj', 'today', 'time'],
  ['কাল', 'kal', 'yesterday — and tomorrow, the same word', 'time'],
  ['সকাল', 'shokal', 'morning', 'time'],
  ['দুপুর', 'dupur', 'midday', 'time'],
  ['বিকেল', 'bikel', 'late afternoon — the play hour', 'time'],
  ['রাত', 'rat', 'night', 'time'],
  ['দিন', 'din', 'day', 'time'],
  ['বছর', 'bochhor', 'year — Poyla Boishakh starts the Bangla one', 'time'],
  ['সময়', 'shomoy', 'time', 'time'],
  ['জন্মদিন', 'jonmodin', 'birthday', 'time'],
  ['পুজো', 'pujo', 'the Pujo season — the autumn festival weeks in many Hindu families', 'time'],
  ['ঈদ', 'eid', 'Eid — the festival day in many Muslim families', 'time'],

  /* ============ places and outdoors ====================================== */
  ['বাংলা', 'bangla', 'Bangla — the language, and the land it names', 'places'],
  ['দেশ', 'desh', 'country — and desh, the home place a family is from', 'places'],
  ['দোকান', 'dokan', 'shop', 'places'],
  ['বাজার', 'bajar', 'market', 'places'],
  ['মন্দির', 'mondir', 'temple', 'places'],
  ['মসজিদ', 'moshjid', 'mosque', 'places'],
  ['গির্জা', 'girja', 'church', 'places'],
  ['নদী', 'nodi', 'river — Bengal is a land of rivers', 'places'],
  ['পুকুর', 'pukur', 'pond — every para has one', 'places'],
  ['মাঠ', 'math', 'field, playing ground', 'places'],
  ['গ্রাম', 'gram', 'village', 'places'],
  ['শহর', 'shohor', 'city', 'places'],
  ['রাস্তা', 'rasta', 'road', 'places'],
  ['গাছ', 'gachh', 'tree', 'places'],
  ['ফুল', 'phul', 'flower', 'places'],

  /* ============ getting around =========================================== */
  ['গাড়ি', 'gari', 'car', 'transport'],
  ['বাস', 'bas', 'bus', 'transport'],
  ['ট্রেন', 'tren', 'train', 'transport'],
  ['নৌকা', 'nouka', 'boat — the river country’s carriage', 'transport'],
  ['রিকশা', 'riksha', 'rickshaw', 'transport'],
  ['সাইকেল', 'saikel', 'bicycle', 'transport'],
  ['উড়োজাহাজ', 'urojahaj', 'aeroplane — literally "flying ship"', 'transport'],

  /* ============ feelings ================================================= */
  ['খুশি', 'khushi', 'happy', 'feelings'],
  ['মন', 'mon', 'the heart-mind — the mon of every Bangla song', 'feelings'],
  ['ভালোবাসা', 'bhalobasha', 'love', 'feelings'],
  ['আদর', 'ador', 'affection — the cuddle word', 'feelings'],
  ['রাগ', 'rag', 'anger', 'feelings'],
  ['ভয়', 'bhoy', 'fear', 'feelings'],
  ['ঘুম', 'ghum', 'sleep', 'feelings'],
  ['হাসি', 'hashi', 'laughter', 'feelings'],
  ['খিদে', 'khide', 'hunger — khide peyechhe is how a child says it', 'feelings'],
  ['কান্না', 'kanna', 'crying', 'feelings']
]);

/* ---- the pack -----------------------------------------------------------
   Stages run on the DERIVED skeleton only: s4/s5/s6 sentence, conversation
   and reader content is not authored here, on purpose. A Bangla pedagogue
   writes those the way HI_S4/S5/READ were written for Hindi; until then the
   skeleton keeps the ladder walkable and the gap visible rather than
   papered over with sentences nobody vouched for. */

var BN_PACK = {
  id: 'bn',
  name: { en: 'Bengali', native: 'বাংলা' },
  script: 'bengali',
  transliteration: 'iso15919+kid',
  phonology: { tones: false, retroflex: true, aspiration: true },
  voice: { kind: 'human', ns: 'bn' },
  diglossia: null,          /* modern standard is cholito bhasha; shadhu is a reading-history topic, not a drill */
  paths: ['heritage', 'beginner'],
  themes: K.THEMES,
  lexicon: BN_LEX,
  reviewedBy: [],           /* a named Bangla linguist signs here before ship (docs/09 §9) */
  stages: K.ladder(K.stageItems(BENGALI, BN_LEX))
};

K.register(BENGALI, BN_PACK);

}(typeof window !== 'undefined' ? window : this));
