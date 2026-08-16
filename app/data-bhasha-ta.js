"use strict";
/* =====================================================================
   Bizzing India — Bhasha pack: Tamil (தமிழ்).

   Registers the Tamil script module and the Tamil language pack through
   window.IND_BHASHA_KIT (the registration surface documented at the foot
   of app/bhasha.js). Loads after bhasha.js, before nothing.

   Every codepoint below is verified — the two-part vowel signs and the
   one conjunct were checked with node against NFC before being typed,
   and tools/test-bhasha.js re-asserts block containment, NFC, and
   conjunct composition on every run. Nothing is transcribed by eye.

   STATUS: a careful draft. The letters, signs and numerals are Unicode
   facts; the lexicon and the letter-name glosses want a native Tamil
   speaker's pass before this ships (reviewedBy is empty and must not
   stay that way — docs/09 §9). Anything a Tamil parent would say
   differently is exactly the thing to fix in that pass.
   ===================================================================== */

(function (W) {

var K = W.IND_BHASHA_KIT;

/* ------------------------------------------------------------ TAMIL ----- */
/* U+0B80–U+0BFF. Serves Tamil. The script every Tamil child meets on the
   கோவில் board and the wedding card, and the one whose alphabet is the
   smallest in this app: Tamil never took the voiced/aspirated grid, so
   there are 18 mei letters where Devanagari has 33 — and a child can own
   the whole chart in weeks, which is a feature, not a gap. */

var TAMIL = {
  id: 'tamil',
  name: 'Tamil',
  nativeName: 'தமிழ்',
  block: [0x0B80, 0x0BFF],
  direction: 'ltr',
  headline: false,                /* no shirorekha — Tamil letters stand free, round and open */
  inherent: 'a',
  virama: '்',               /* ்  U+0BCD, the PULLI. In Tamil the pulli is not an
                                    afterthought the way the halant can feel in Hindi
                                    class: every mei letter is TAUGHT with its dot on
                                    (க் ங் ச்…), and the dot comes off when a vowel
                                    joins. Teach it as part of the letter, week one. */
  audioNs: 'ta',
  languages: ['ta'],
  /* Mukta Malar is the self-hosted Tamil face (app/fonts.css) — Ek Type's
     Tamil sibling of the Devanagari Mukta, so the two packs sit visually
     side by side. Same sizing rules as Devanagari: never letter-spaced,
     generous line-height, a notch larger than Latin. */
  font: { family: 'Mukta Malar', fallback: 'Noto Sans Tamil', minSize: 17, lineHeight: 1.75, scale: 1.12 },
  notes: 'No headline bar and no aspirated letters. The pulli (the dot) is taught as part of every mei letter, never as a footnote.',

  /* The 12 uyir ezhuthu ("life letters"). Tamil's headline difference from
     Devanagari sits right here: எ/ஏ and ஒ/ஓ are SHORT/LONG PAIRS, five
     pairs in all where Hindi has three — a Tamil ear hears the difference
     between எலி and ஏழு the way a Hindi ear hears इ/ई.
     Then ஃ, the aaytham — see its own note. */
  vowels: [
    { char: 'அ', name: 'a',  roman: 'a',  audio: 'ta/l-0',  group: 'uyir', short: true },
    { char: 'ஆ', name: 'aa', roman: 'ā',  audio: 'ta/l-1',  group: 'uyir', short: false, pairOf: 'a' },
    { char: 'இ', name: 'i',  roman: 'i',  audio: 'ta/l-2',  group: 'uyir', short: true },
    { char: 'ஈ', name: 'ii', roman: 'ī',  audio: 'ta/l-3',  group: 'uyir', short: false, pairOf: 'i' },
    { char: 'உ', name: 'u',  roman: 'u',  audio: 'ta/l-4',  group: 'uyir', short: true },
    { char: 'ஊ', name: 'uu', roman: 'ū',  audio: 'ta/l-5',  group: 'uyir', short: false, pairOf: 'u' },
    { char: 'எ', name: 'e',  roman: 'e',  audio: 'ta/l-6',  group: 'uyir', short: true },
    { char: 'ஏ', name: 'ee', roman: 'ē',  audio: 'ta/l-7',  group: 'uyir', short: false, pairOf: 'e' },
    { char: 'ஐ', name: 'ai', roman: 'ai', audio: 'ta/l-8',  group: 'uyir', short: false },
    { char: 'ஒ', name: 'o',  roman: 'o',  audio: 'ta/l-9',  group: 'uyir', short: true },
    { char: 'ஓ', name: 'oo', roman: 'ō',  audio: 'ta/l-10', group: 'uyir', short: false, pairOf: 'o' },
    { char: 'ஔ', name: 'au', roman: 'au', audio: 'ta/l-11', group: 'uyir', short: false },
    /* ஃ U+0B83, the AAYTHAM — the "three-dot letter". Neither uyir nor mei:
       Tamil grammar calls it a "dependent letter" (சார்பெழுத்து). A child
       meets it in அஃது in old texts and, today, doing the f/z sounds in
       loanwords (ஃபோன்). Marked sign:true, like Devanagari's अं/अः, so
       the long-vs-short exercises leave it alone. */
    { char: 'ஃ', name: 'aaytham', roman: 'ḵ', audio: 'ta/l-12', group: 'uyir', sign: true }
  ],

  /* The 18 mei ezhuthu ("body letters"), in varisai (chart) order.

     TAMIL HAS NO SEPARATE VOICED OR ASPIRATED LETTERS. One க serves ka
     and ga — word-initially it says "ka", between vowels it softens to
     "ga" or "ha", after ங it says "ga" (சங்கு = sangu). Same story for
     ச/ட/த/ப. The names below carry both sounds ('ka/ga') because a
     heritage child already SAYS both and needs to learn that the page
     writes them with one letter. (Those slashed names are display
     glosses; before a recording session derives barakhadi keys from
     names, they must be slugged — flagged for the manifest tool.)

     `group` is the Tamil classification, taught to every child by name,
     and it is what the odd-one-out exercise cuts along:
       vallinam  (வல்லினம், "hard")   க ச ட த ப ற
       mellinam  (மெல்லினம், "soft")  ங ஞ ண ந ம ன — the nasals
       idaiyinam (இடையினம், "medium") ய ர ல வ ழ ள
     The array stays in chart order; the group field carries the class. */
  consonants: [
    { char: 'க', name: 'ka/ga',   r: 'k', audio: 'ta/l-13', group: 'vallinam' },
    { char: 'ங', name: 'nga',     r: 'ṅ', audio: 'ta/l-14', group: 'mellinam' },
    { char: 'ச', name: 'sa/cha',  r: 'c', audio: 'ta/l-15', group: 'vallinam' },
    { char: 'ஞ', name: 'nya',     r: 'ñ', audio: 'ta/l-16', group: 'mellinam' },
    { char: 'ட', name: 'ta/da',   r: 'ṭ', audio: 'ta/l-17', group: 'vallinam' },
    { char: 'ண', name: 'nna',     r: 'ṇ', audio: 'ta/l-18', group: 'mellinam' },
    { char: 'த', name: 'tha/dha', r: 't', audio: 'ta/l-19', group: 'vallinam' },
    { char: 'ந', name: 'na',      r: 'n', audio: 'ta/l-20', group: 'mellinam' },
    { char: 'ப', name: 'pa/ba',   r: 'p', audio: 'ta/l-21', group: 'vallinam' },
    { char: 'ம', name: 'ma',      r: 'm', audio: 'ta/l-22', group: 'mellinam' },
    { char: 'ய', name: 'ya',      r: 'y', audio: 'ta/l-23', group: 'idaiyinam' },
    { char: 'ர', name: 'ra',      r: 'r', audio: 'ta/l-24', group: 'idaiyinam' },
    { char: 'ல', name: 'la',      r: 'l', audio: 'ta/l-25', group: 'idaiyinam' },
    { char: 'வ', name: 'va',      r: 'v', audio: 'ta/l-26', group: 'idaiyinam' },
    { char: 'ழ', name: 'zha',     r: 'ḻ', audio: 'ta/l-27', group: 'idaiyinam' },  /* THE Tamil letter — the zha of Tamizh itself */
    { char: 'ள', name: 'lla',     r: 'ḷ', audio: 'ta/l-28', group: 'idaiyinam' },
    { char: 'ற', name: 'rra',     r: 'ṟ', audio: 'ta/l-29', group: 'vallinam' },
    /* ன sounds like ந to the ear; the difference a child learns is where it
       sits — ன never opens a word, ந rarely ends one. */
    { char: 'ன', name: 'na (alveolar)', r: 'ṉ', audio: 'ta/l-30', group: 'mellinam' },

    /* The GRANTHA letters — borrowed long ago to write Sanskrit sounds,
       and met today in names and loanwords (ஜன்னல், ரிக்ஷா, ஸ்ரீ, ஹலோ).
       Their own group, because they are taught as guests, after the 18.
       ஶ (U+0BB6) is left out until a lexicon word needs it: ஸ்ரீ is
       written here with ஸ, the far more common spelling. */
    { char: 'ஜ', name: 'ja',  r: 'j', audio: 'ta/l-31', group: 'grantha' },
    { char: 'ஷ', name: 'sha', r: 'ṣ', audio: 'ta/l-32', group: 'grantha' },
    { char: 'ஸ', name: 'sa',  r: 's', audio: 'ta/l-33', group: 'grantha' },
    { char: 'ஹ', name: 'ha',  r: 'h', audio: 'ta/l-34', group: 'grantha' }
  ],

  /* The 11 vowel signs. Position facts a Devanagari-trained eye gets wrong:

     - ி and ீ render AFTER the base (position right) — Tamil has no
       Devanagari-style "type after, render before" trap for i.
     - ெ ே ை render BEFORE the base (position left): கெ கே கை.
     - ொ ோ ௌ are TWO-PART signs that wrap the base — a piece on the left
       AND a piece on the right (கொ = ெ…ா around க). position 'around'
       is our honest value; matraAttach passes position through as drag-
       target data, and the UI should show these hugging both sides.
       STORAGE: NFC composes each pair to a single codepoint and that is
       exactly what is stored here, verified with node —
           ொ U+0BCA (NFC of U+0BC6+U+0BBE)
           ோ U+0BCB (NFC of U+0BC7+U+0BBE)
           ௌ U+0BCC (NFC of U+0BC6+U+0BD7)
     - ு and ூ fuse with the letter into one shape (கு, கூ are single
       curves, not base+mark to the eye); they attach at the bottom right,
       so 'right' is the nearest honest drag target. */
  matras: [
    { sign: 'ா', name: 'aa', vowel: 'aa', vowelChar: 'ஆ', position: 'right',  example: 'கா', audio: 'ta/m-aa', grid: true },
    { sign: 'ி', name: 'i',  vowel: 'i',  vowelChar: 'இ', position: 'right',  example: 'கி', audio: 'ta/m-i',  grid: true },
    { sign: 'ீ', name: 'ii', vowel: 'ii', vowelChar: 'ஈ', position: 'right',  example: 'கீ', audio: 'ta/m-ii', grid: true },
    { sign: 'ு', name: 'u',  vowel: 'u',  vowelChar: 'உ', position: 'right',  example: 'கு', audio: 'ta/m-u',  grid: true },
    { sign: 'ூ', name: 'uu', vowel: 'uu', vowelChar: 'ஊ', position: 'right',  example: 'கூ', audio: 'ta/m-uu', grid: true },
    { sign: 'ெ', name: 'e',  vowel: 'e',  vowelChar: 'எ', position: 'left',   example: 'கெ', audio: 'ta/m-e',  grid: true },
    { sign: 'ே', name: 'ee', vowel: 'ee', vowelChar: 'ஏ', position: 'left',   example: 'கே', audio: 'ta/m-ee', grid: true },
    { sign: 'ை', name: 'ai', vowel: 'ai', vowelChar: 'ஐ', position: 'left',   example: 'கை', audio: 'ta/m-ai', grid: true },
    { sign: 'ொ', name: 'o',  vowel: 'o',  vowelChar: 'ஒ', position: 'around', example: 'கொ', audio: 'ta/m-o',  grid: true },
    { sign: 'ோ', name: 'oo', vowel: 'oo', vowelChar: 'ஓ', position: 'around', example: 'கோ', audio: 'ta/m-oo', grid: true },
    { sign: 'ௌ', name: 'au', vowel: 'au', vowelChar: 'ஔ', position: 'around', example: 'கௌ', audio: 'ta/m-au', grid: true }
  ],

  /* Tamil digits, U+0BE6–U+0BEF. Everyday Tamil — the newspaper, the bus,
     the price board — uses Arabic digits; these are taught as heritage,
     the numerals on temple inscriptions and old clock faces. Zero is
     suzhiyam (the curl); many say poojiyam. */
  numerals: [
    { char: '௦', value: 0, name: 'suzhiyam', audio: 'ta/n0' },
    { char: '௧', value: 1, name: 'onru',     audio: 'ta/n1' },
    { char: '௨', value: 2, name: 'irandu',   audio: 'ta/n2' },
    { char: '௩', value: 3, name: 'moonru',   audio: 'ta/n3' },
    { char: '௪', value: 4, name: 'naangu',   audio: 'ta/n4' },
    { char: '௫', value: 5, name: 'ainthu',   audio: 'ta/n5' },
    { char: '௬', value: 6, name: 'aaru',     audio: 'ta/n6' },
    { char: '௭', value: 7, name: 'ezhu',     audio: 'ta/n7' },
    { char: '௮', value: 8, name: 'ettu',     audio: 'ta/n8' },
    { char: '௯', value: 9, name: 'onpathu',  audio: 'ta/n9' }
  ],

  /* Tamil barely does conjuncts — doubled letters are written out in full
     with the pulli (க்க in பக்கம் reads straight off its parts), so there
     is almost nothing whose shape must be memorised. The one classic is
     க்ஷ (U+0B95 + U+0BCD + U+0BB7), a grantha ligature a child meets in
     ரிக்ஷா and in names. It passes the parts.join(virama) test; nothing
     else is invented to keep it company.

     ஸ்ரீ is NOT here, deliberately: it contains the matra ீ (0BB8+0BCD+
     0BB0+0BC0), so it is not consonant+virama+consonant and would fail
     the composition test — and honestly it is a WORD, met whole on every
     wedding card, so it lives in the lexicon (theme: basics) and is
     learnt the way it is met.

     No audio key: same budget rule as Hindi's later conjuncts — the
     voice budget goes to letters, matras and words, and the conjunct is
     taught visually and heard inside ரிக்ஷா. conjunctSplit copes fine
     with a list of one (its decoy tiles come from the consonant chart,
     not from other conjuncts — verified against the generator). */
  hardConjuncts: [
    { char: 'க்ஷ', parts: ['க', 'ஷ'], name: 'ksha', word: 'ரிக்ஷா' }
  ]
};

/* ---- Tamil lexicon ------------------------------------------------------
   Heritage-first (docs/09 §3): what is said in a Tamil house on a Tuesday.
   A child who already calls their grandmother paati does not need the
   meaning — they need to see it written பாட்டி.

   DIGLOSSIA, HANDLED HONESTLY: written Tamil and spoken Tamil genuinely
   differ, more than for any other pack so far. The rule here: teach the
   written form the child will read, and note the spoken form in the
   gloss where families actually say something else (தண்ணீர்/thanni,
   பள்ளி/pallikoodam). The gloss is the one place that note fits without
   inventing a second lexicon.

   Romanisation is kid-style like HI_LEX (thanneer, not taṇṇīr). Rows are
   [word, roman, en, theme] (+ value for numbers); audio keys derive from
   the roman via packWords, 'ta/w-<roman>'. */

var TA_LEX = K.packWords('ta', [

  /* ============ the first words — the house on a Tuesday ================ */
  ['வணக்கம்', 'vanakkam', 'hello', 'greetings'],
  ['நன்றி', 'nandri', 'thank you', 'greetings'],
  ['ஆமாம்', 'aamaam', 'yes — many say aama', 'greetings'],
  ['இல்லை', 'illai', 'no', 'greetings'],
  ['சரி', 'sari', 'okay, fine', 'greetings'],

  ['அம்மா', 'amma', 'mother', 'family'],
  ['அப்பா', 'appa', 'father', 'family'],
  ['அண்ணன்', 'annan', 'big brother', 'family'],
  ['அக்கா', 'akka', 'big sister', 'family'],
  ['தம்பி', 'thambi', 'little brother', 'family'],
  ['தங்கை', 'thangai', 'little sister', 'family'],
  ['பாட்டி', 'paati', 'grandmother', 'family'],
  ['தாத்தா', 'thaatha', 'grandfather', 'family'],

  ['தண்ணீர்', 'thanneer', 'water — many homes say thanni', 'food'],
  ['சோறு', 'soru', 'cooked rice — the everyday word', 'food'],
  ['சாதம்', 'saadham', 'cooked rice — the polite word', 'food'],
  ['தோசை', 'dosai', 'dosa', 'food'],
  ['இட்லி', 'idli', 'idli', 'food'],
  ['பால்', 'paal', 'milk', 'food'],

  ['தலை', 'thalai', 'head', 'body'],
  ['கண்', 'kan', 'eye', 'body'],
  ['கை', 'kai', 'hand', 'body'],
  ['கால்', 'kaal', 'leg, foot', 'body'],

  ['வீடு', 'veedu', 'house', 'home'],
  ['கதவு', 'kadhavu', 'door', 'home'],

  ['நான்', 'naan', 'I', 'basics'],
  ['நீ', 'nee', 'you (to a friend)', 'basics'],
  ['என்ன', 'enna', 'what', 'basics'],
  ['நல்ல', 'nalla', 'good', 'basics'],

  /* ====================== greetings — the rest ========================== */
  ['மன்னிக்கவும்', 'mannikkavum', 'sorry, excuse me', 'greetings'],
  ['வாருங்கள்', 'vaarungal', 'please come in, welcome', 'greetings'],
  ['போய் வருகிறேன்', 'poi varugiren', 'goodbye — literally "I will go and come back"; a Tamil never just leaves', 'greetings'],
  ['வாழ்த்துக்கள்', 'vaazhthukkal', 'congratulations, good wishes', 'greetings'],
  ['காலை வணக்கம்', 'kaalai vanakkam', 'good morning', 'greetings'],
  ['ஹலோ', 'halo', 'hello — on the phone', 'greetings'],

  /* ============================ family ================================== */
  ['மாமா', 'maamaa', 'uncle (mother’s brother)', 'family'],
  ['அத்தை', 'athai', 'aunt (father’s sister)', 'family'],
  ['சித்தி', 'chithi', 'aunt (mother’s younger sister)', 'family'],
  ['சித்தப்பா', 'chithappa', 'uncle (father’s younger brother)', 'family'],
  ['குழந்தை', 'kuzhandhai', 'child, baby', 'family'],
  ['குடும்பம்', 'kudumbam', 'family', 'family'],
  ['நண்பன்', 'nanban', 'friend', 'family'],
  ['பையன்', 'paiyan', 'boy', 'family'],
  ['பெண்', 'pen', 'girl', 'family'],

  /* ============================= food =================================== */
  ['சாம்பார்', 'saambaar', 'sambar', 'food'],
  ['தயிர்', 'thayir', 'yoghurt', 'food'],
  ['நெய்', 'nei', 'ghee', 'food'],
  ['பருப்பு', 'paruppu', 'lentils', 'food'],
  ['காய்கறி', 'kaaykari', 'vegetable', 'food'],
  ['பழம்', 'pazham', 'fruit', 'food'],
  ['மாம்பழம்', 'maampazham', 'mango', 'food'],
  ['வாழைப்பழம்', 'vaazhaippazham', 'banana', 'food'],
  ['உப்பு', 'uppu', 'salt', 'food'],
  ['சர்க்கரை', 'sarkkarai', 'sugar', 'food'],
  ['மிளகாய்', 'milagaai', 'chilli', 'food'],
  ['பொங்கல்', 'pongal', 'pongal — the dish and the festival share the name', 'food'],
  ['வடை', 'vadai', 'vada', 'food'],
  ['முறுக்கு', 'murukku', 'murukku', 'food'],
  ['சாப்பாடு', 'saappaadu', 'food, a meal', 'food'],
  ['தேங்காய்', 'thengaai', 'coconut', 'food'],
  ['முட்டை', 'muttai', 'egg', 'food'],
  ['வெல்லம்', 'vellam', 'jaggery', 'food'],
  ['காபி', 'kaapi', 'coffee — filter kaapi, an institution', 'food'],

  /* ============================= body =================================== */
  ['மூக்கு', 'mookku', 'nose', 'body'],
  ['காது', 'kaadhu', 'ear', 'body'],
  ['வாய்', 'vaai', 'mouth', 'body'],
  ['வயிறு', 'vayiru', 'tummy', 'body'],
  ['முடி', 'mudi', 'hair', 'body'],
  ['பல்', 'pal', 'tooth', 'body'],
  ['விரல்', 'viral', 'finger', 'body'],
  ['முகம்', 'mugam', 'face', 'body'],
  ['நாக்கு', 'naakku', 'tongue', 'body'],
  ['இதயம்', 'idhayam', 'heart', 'body'],

  /* ============================= home =================================== */
  ['ஜன்னல்', 'jannal', 'window', 'home'],
  ['நாற்காலி', 'naarkaali', 'chair', 'home'],
  ['மேசை', 'mesai', 'table', 'home'],
  ['சாவி', 'saavi', 'key', 'home'],
  ['படுக்கை', 'padukkai', 'bed', 'home'],
  ['அடுப்பு', 'aduppu', 'stove', 'home'],
  ['விளக்கு', 'vilakku', 'lamp — the one lit at dusk', 'home'],
  ['சமையலறை', 'samaiyalarai', 'kitchen', 'home'],
  ['அறை', 'arai', 'room', 'home'],
  ['பானை', 'paanai', 'pot', 'home'],
  ['தட்டு', 'thattu', 'plate', 'home'],

  /* ====================== everyday words ================================ */
  ['நீங்கள்', 'neengal', 'you (respectful)', 'basics'],
  ['இது', 'idhu', 'this', 'basics'],
  ['அது', 'adhu', 'that', 'basics'],
  ['நாங்கள்', 'naangal', 'we', 'basics'],
  ['யார்', 'yaar', 'who', 'basics'],
  ['எங்கே', 'engae', 'where', 'basics'],
  ['ஏன்', 'aen', 'why', 'basics'],
  ['எப்படி', 'eppadi', 'how', 'basics'],
  ['பெரிய', 'periya', 'big', 'basics'],
  ['சின்ன', 'chinna', 'small — the word every home uses; books write siriya', 'basics'],
  ['ரொம்ப', 'romba', 'very, a lot — spoken; books write miga', 'basics'],
  ['இங்கே', 'ingae', 'here', 'basics'],
  ['அங்கே', 'angae', 'there', 'basics'],
  ['மேலே', 'melae', 'up, above', 'basics'],
  ['கீழே', 'keezhae', 'down, below', 'basics'],
  ['புது', 'pudhu', 'new', 'basics'],
  ['சூடு', 'soodu', 'hot', 'basics'],
  ['குளிர்', 'kulir', 'cold', 'basics'],
  /* ஸ்ரீ lives here rather than in hardConjuncts: it carries a matra, so
     it is a word, not a bare conjunct — see the script-module note. */
  ['ஸ்ரீ', 'sri', 'sri/shri — the auspicious prefix met on every wedding card', 'basics'],

  /* =========================== doing words ============================== */
  ['சாப்பிடு', 'saappidu', 'eat', 'actions'],
  ['குடி', 'kudi', 'drink', 'actions'],
  ['போ', 'po', 'go', 'actions'],
  ['வா', 'vaa', 'come', 'actions'],
  ['பார்', 'paar', 'look, see', 'actions'],
  ['கேள்', 'kel', 'listen — and ask; one word for both', 'actions'],
  ['சொல்', 'sol', 'say, tell', 'actions'],
  ['படி', 'padi', 'read, study', 'actions'],
  ['எழுது', 'ezhudhu', 'write', 'actions'],
  ['விளையாடு', 'vilaiyaadu', 'play', 'actions'],
  ['தூங்கு', 'thoongu', 'sleep', 'actions'],
  ['ஓடு', 'odu', 'run', 'actions'],
  ['உட்கார்', 'utkaar', 'sit', 'actions'],
  ['கொடு', 'kodu', 'give', 'actions'],
  ['சிரி', 'siri', 'laugh, smile', 'actions'],
  ['பாடு', 'paadu', 'sing', 'actions'],

  /* ============================ animals ================================= */
  ['நாய்', 'naai', 'dog', 'animals'],
  ['பூனை', 'poonai', 'cat', 'animals'],
  ['மாடு', 'maadu', 'cow', 'animals'],
  ['யானை', 'yaanai', 'elephant', 'animals'],
  ['குதிரை', 'kudhirai', 'horse', 'animals'],
  ['ஆடு', 'aadu', 'goat', 'animals'],
  ['பறவை', 'paravai', 'bird', 'animals'],
  ['மீன்', 'meen', 'fish', 'animals'],
  ['புலி', 'puli', 'tiger', 'animals'],
  ['சிங்கம்', 'singam', 'lion', 'animals'],
  ['குரங்கு', 'kurangu', 'monkey', 'animals'],
  ['பாம்பு', 'paambu', 'snake', 'animals'],
  ['மயில்', 'mayil', 'peacock', 'animals'],
  ['காகம்', 'kaagam', 'crow — most kids say kaakaa', 'animals'],
  ['கிளி', 'kili', 'parrot', 'animals'],
  ['கோழி', 'kozhi', 'hen', 'animals'],
  ['எறும்பு', 'erumbu', 'ant', 'animals'],
  ['வண்ணத்துப்பூச்சி', 'vannathupoochi', 'butterfly — literally "the colour insect"', 'animals'],

  /* ============================ colours ================================= */
  ['சிவப்பு', 'sivappu', 'red', 'colours'],
  ['நீலம்', 'neelam', 'blue', 'colours'],
  ['மஞ்சள்', 'manjal', 'yellow — the same word as turmeric', 'colours'],
  ['பச்சை', 'pachai', 'green', 'colours'],
  ['கருப்பு', 'karuppu', 'black', 'colours'],
  ['வெள்ளை', 'vellai', 'white', 'colours'],
  ['ஊதா', 'oodhaa', 'purple', 'colours'],
  ['நிறம்', 'niram', 'colour', 'colours'],

  /* ============================ numbers ================================= */
  ['ஒன்று', 'onru', 'one', 'numbers', 1],
  ['இரண்டு', 'irandu', 'two', 'numbers', 2],
  ['மூன்று', 'moonru', 'three', 'numbers', 3],
  ['நான்கு', 'naangu', 'four', 'numbers', 4],
  ['ஐந்து', 'ainthu', 'five', 'numbers', 5],
  ['ஆறு', 'aaru', 'six — the same word as "river"', 'numbers', 6],
  ['ஏழு', 'ezhu', 'seven', 'numbers', 7],
  ['எட்டு', 'ettu', 'eight', 'numbers', 8],
  ['ஒன்பது', 'onpathu', 'nine', 'numbers', 9],
  ['பத்து', 'pathu', 'ten', 'numbers', 10],
  ['நூறு', 'nooru', 'a hundred', 'numbers', 100],
  ['ஆயிரம்', 'aayiram', 'a thousand', 'numbers', 1000],
  ['பூஜ்ஜியம்', 'poojjiyam', 'zero — old Tamil says suzhiyam, the curl', 'numbers', 0],

  /* ============================= school ================================= */
  ['பள்ளி', 'palli', 'school — most families say pallikoodam', 'school'],
  ['புத்தகம்', 'puthagam', 'book', 'school'],
  ['பேனா', 'penaa', 'pen', 'school'],
  ['பை', 'pai', 'bag', 'school'],
  ['ஆசிரியர்', 'aasiriyar', 'teacher', 'school'],
  ['பாடம்', 'paadam', 'lesson', 'school'],
  ['கதை', 'kadhai', 'story', 'school'],
  ['பாட்டு', 'paattu', 'song', 'school'],
  ['எழுத்து', 'ezhuthu', 'letter (of the alphabet)', 'school'],
  ['வார்த்தை', 'vaarthai', 'word', 'school'],
  ['கேள்வி', 'kelvi', 'question', 'school'],
  ['பதில்', 'padhil', 'answer', 'school'],
  ['பெயர்', 'peyar', 'name', 'school'],
  ['தமிழ்', 'tamizh', 'Tamil — the language this pack is for', 'school'],
  ['விடுமுறை', 'vidumurai', 'holiday', 'school'],

  /* ============================ clothes ================================= */
  ['சட்டை', 'sattai', 'shirt', 'clothes'],
  ['பாவாடை', 'paavaadai', 'skirt — the pattu paavaadai of every function', 'clothes'],
  ['வேட்டி', 'vetti', 'veshti', 'clothes'],
  ['புடவை', 'pudavai', 'sari — many say selai', 'clothes'],
  ['செருப்பு', 'seruppu', 'slippers', 'clothes'],
  ['தொப்பி', 'thoppi', 'cap', 'clothes'],
  ['வளையல்', 'valaiyal', 'bangle', 'clothes'],
  ['பட்டு', 'pattu', 'silk', 'clothes'],

  /* ========================= weather and sky ============================ */
  ['மழை', 'mazhai', 'rain', 'weather'],
  ['வெயில்', 'veyil', 'sunshine, the heat of the sun', 'weather'],
  ['காற்று', 'kaatru', 'wind, air', 'weather'],
  ['மேகம்', 'megam', 'cloud', 'weather'],
  ['வானம்', 'vaanam', 'sky', 'weather'],
  ['சூரியன்', 'sooriyan', 'sun', 'weather'],
  ['நிலா', 'nilaa', 'moon', 'weather'],
  ['நட்சத்திரம்', 'natchathiram', 'star', 'weather'],
  ['மின்னல்', 'minnal', 'lightning', 'weather'],
  ['வானவில்', 'vaanavil', 'rainbow', 'weather'],
  ['குடை', 'kudai', 'umbrella', 'weather'],
  ['நெருப்பு', 'neruppu', 'fire', 'weather'],
  ['பனி', 'pani', 'mist, dew — and snow, where there is any', 'weather'],

  /* ========================== time and days ============================= */
  ['இன்று', 'indru', 'today — spoken: innaikku', 'time'],
  ['நேற்று', 'netru', 'yesterday', 'time'],
  ['நாளை', 'naalai', 'tomorrow', 'time'],
  ['காலை', 'kaalai', 'morning', 'time'],
  ['மாலை', 'maalai', 'evening', 'time'],
  ['இரவு', 'iravu', 'night', 'time'],
  ['நாள்', 'naal', 'day', 'time'],
  ['வாரம்', 'vaaram', 'week', 'time'],
  ['மாதம்', 'maadham', 'month', 'time'],
  ['வருடம்', 'varudam', 'year', 'time'],
  ['திருவிழா', 'thiruvizhaa', 'festival — the temple festival above all', 'time'],
  ['பிறந்தநாள்', 'pirandhanaal', 'birthday', 'time'],
  ['மணி', 'mani', 'o’clock — and a bell; the same word', 'time'],

  /* ====================== places and outdoors =========================== */
  ['கோவில்', 'kovil', 'temple', 'places'],
  ['கடை', 'kadai', 'shop', 'places'],
  ['சந்தை', 'sandhai', 'market', 'places'],
  ['ஊர்', 'oor', 'home town — the place your family is FROM, wherever you live now', 'places'],
  ['நகரம்', 'nagaram', 'city', 'places'],
  ['கிராமம்', 'giraamam', 'village', 'places'],
  ['மலை', 'malai', 'mountain', 'places'],
  ['நதி', 'nadhi', 'river', 'places'],
  ['கடல்', 'kadal', 'sea', 'places'],
  ['காடு', 'kaadu', 'forest', 'places'],
  ['மரம்', 'maram', 'tree', 'places'],
  ['பூ', 'poo', 'flower', 'places'],
  ['இலை', 'ilai', 'leaf', 'places'],
  ['மண்', 'man', 'soil, earth', 'places'],
  ['தெரு', 'theru', 'street', 'places'],
  ['சாலை', 'saalai', 'road', 'places'],
  ['குளம்', 'kulam', 'pond — the temple tank', 'places'],

  /* ========================== getting around ============================ */
  ['பேருந்து', 'perundhu', 'bus — the written word; everyone says "bus"', 'transport'],
  ['ரயில்', 'rayil', 'train', 'transport'],
  ['கார்', 'kaar', 'car', 'transport'],
  ['சைக்கிள்', 'saikkil', 'bicycle', 'transport'],
  ['படகு', 'padagu', 'boat', 'transport'],
  ['விமானம்', 'vimaanam', 'aeroplane', 'transport'],
  ['கப்பல்', 'kappal', 'ship', 'transport'],
  ['ரிக்ஷா', 'rikshaa', 'rickshaw — and the home of க்ஷ, the one conjunct', 'transport'],
  ['வழி', 'vazhi', 'the way, the path', 'transport'],

  /* ============================ feelings ================================ */
  ['அன்பு', 'anbu', 'love — the great Tamil word', 'feelings'],
  ['சந்தோஷம்', 'sandhosham', 'happiness — books write magizhchi', 'feelings'],
  ['மகிழ்ச்சி', 'magizhchi', 'joy', 'feelings'],
  ['கோபம்', 'kobam', 'anger', 'feelings'],
  ['பயம்', 'bayam', 'fear', 'feelings'],
  ['பசி', 'pasi', 'hunger', 'feelings'],
  ['தாகம்', 'thaagam', 'thirst', 'feelings'],
  ['தூக்கம்', 'thookkam', 'sleepiness', 'feelings'],
  ['சோகம்', 'sogam', 'sadness', 'feelings'],
  ['வலி', 'vali', 'pain', 'feelings']
]);

/* ---- the pack ----------------------------------------------------------- */

var TA_PACK = {
  id: 'ta',
  name: { en: 'Tamil', native: 'தமிழ்' },
  script: 'tamil',
  transliteration: 'iso15919+kid',
  /* aspiration: false — the one pack so far where that flag is off. Tamil
     has no aspirated/unaspirated contrast to drill (no க vs ஖), so the
     exercises that lean on it in Hindi simply have nothing to grab here.
     The retroflex flag stays on: ட ண ள (and ழ, which is its own thing). */
  phonology: { tones: false, retroflex: true, aspiration: false },
  voice: { kind: 'human', ns: 'ta' },
  /* Nothing in the engine reads diglossia yet (Hindi carries null), but
     for Tamil the fact is too central to leave unstated in the data: */
  diglossia: 'spoken Tamil and written Tamil differ; this pack teaches the written words a child reads and notes the spoken forms families use, marked in the gloss where they part',
  paths: ['heritage', 'beginner'],
  themes: K.THEMES,
  lexicon: TA_LEX,
  reviewedBy: [],                 /* a named Tamil speaker signs here before ship (docs/09 §9) */
  /* Stages 4–6 are NOT authored: the derived skeleton is the honest gap,
     exactly as Punjabi carries it, until a Tamil pedagogue writes the
     sentences and conversations. The derived s6 holds the one conjunct,
     which conjunctSplit handles (decoys come from the consonant chart);
     the ladder walk in tools/test-bhasha.js confirms every stage yields
     a question. */
  stages: K.ladder(K.stageItems(TAMIL, TA_LEX))
};

K.register(TAMIL, TA_PACK);

}(typeof window !== 'undefined' ? window : this));
