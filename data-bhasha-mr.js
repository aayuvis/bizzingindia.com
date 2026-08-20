"use strict";
/* =====================================================================
   Bizzing India — Bhasha pack: Marathi (मराठी).

   Registers a script module and a language pack through
   window.IND_BHASHA_KIT; the registration surface is documented at the
   foot of app/bhasha.js.

   THE SCRIPT IS A CLONE, NOT A RETYPE. Marathi is written in Devanagari,
   and the Devanagari that bhasha.js ships for Hindi is already
   codepoint-verified by tools/test-bhasha.js. Retyping ~90 glyphs here
   would be ninety chances to introduce a wrong codepoint the eye cannot
   catch, so instead this file deep-copies window.IND_SCRIPTS.devanagari
   at load time and changes only what Marathi actually changes:

     - id/audioNs/languages, so the clone is its own module;
     - ळ (U+0933), the retroflex lateral Hindi's chart omits and Marathi
       cannot live without — बाळ, शाळा, डोळा, सकाळ, पिवळा;
     - the NAME of ज्ञ: a Marathi reader says it 'dnya' (ज्ञान is
       dnyan — as in Dnyaneshwar), not Hindi's 'gya'.

   Everything else — the shared letters, matras, numerals, conjuncts —
   IS the same script, so the cloned 'hi/…' audio keys stay: the Hindi
   recordings of shared letters are recordings of the right sounds, and
   IND_BHASHA.audioFor() re-namespaces onto the pack voice where a
   Marathi recording exists. Only ळ, which Hindi never recorded, carries
   an 'mr/' key of its own. The chart heading likewise still reads
   "Devanagari" via the cloned name — that is correct, it is Devanagari.

   STATUS: draft. The lexicon and glosses want a native Marathi
   speaker's pass before ship (reviewedBy is honestly empty), and stages
   4–6 are the derived skeleton — nobody has written Marathi sentences
   or dialogues yet. The gap is visible on the ladder by design.
   ===================================================================== */

(function (W) {

  /* Loads after bhasha.js in the browser and in tools/test-bhasha.js
     alike, so the kit is guaranteed present — but a pack file that
     throws on a half-loaded page helps nobody. Guard and go quietly. */
  var K = W.IND_BHASHA_KIT;
  if (!K || !W.IND_SCRIPTS || !W.IND_SCRIPTS.devanagari) return;

  /* ---------------------------------------------- the script clone ---- */
  var SCRIPT = JSON.parse(JSON.stringify(W.IND_SCRIPTS.devanagari));
  SCRIPT.id = 'devanagari-mr';
  SCRIPT.block = [0x0900, 0x097F];
  SCRIPT.audioNs = 'mr';
  SCRIPT.languages = ['mr'];
  SCRIPT.notes = 'Devanagari as Marathi uses it: the Hindi chart plus ळ, and ज्ञ said dnya.';

  /* ळ — U+0933, retroflex. Appended after ह rather than spliced into
     varga order because appending cannot disturb the 33 positions the
     cloned audio keys and the varnamala drills already agree on. */
  SCRIPT.consonants.push(
    { char: 'ळ', name: 'lla', r: 'ḷ', audio: 'mr/l-lla', group: 'retroflex' }
  );

  /* ज्ञ: same glyph, same parts, same audio slot — but the Marathi name
     is 'dnya'. The example word ज्ञान holds: it is Marathi dnyan. */
  (function () {
    var i, cj = SCRIPT.hardConjuncts;
    for (i = 0; i < cj.length; i++) {
      if (cj[i].char === 'ज्ञ') { cj[i].name = 'dnya'; break; }
    }
  }());

  /* ---------------------------------------------------- the lexicon ---- */
  /* Heritage-first (docs/09 §3): what a Marathi household actually says
     on a Tuesday — aai and baba, bhakri and varan bhaat, "goshta sang
     na!" — so a child who already HEARS these words learns how they are
     written. Rows are [word, roman, en, theme], numeric 5th column on
     numbers; audio keys derive from the roman via packWords.

     Two glosses that trip Hindi-speaking parents, flagged in-line:
     dada and mama mean different relatives than they do in Hindi.

     वरण-भात is usually hyphenated in print; it is stored with a space
     because the lexicon integrity check holds every non-space codepoint
     to the Devanagari block, and a hyphen is U+002D. Same word, same
     tiles either way. */
  var MR_LEX = K.packWords('mr', [

    /* ---- greetings — the doorway ---- */
    ['नमस्कार', 'namaskar', 'hello', 'greetings'],
    ['राम राम', 'ram ram', 'hello — the greeting of many villages', 'greetings'],
    ['हो', 'ho', 'yes', 'greetings'],
    ['नाही', 'nahi', 'no', 'greetings'],
    ['बरं', 'bara', 'okay, alright', 'greetings'],
    ['चांगला', 'changla', 'good', 'greetings'],
    ['धन्यवाद', 'dhanyavaad', 'thank you', 'greetings'],
    ['कृपया', 'krupaya', 'please', 'greetings'],
    ['माफ करा', 'maaf kara', 'sorry', 'greetings'],
    ['सुप्रभात', 'suprabhat', 'good morning', 'greetings'],
    ['शुभ रात्री', 'shubh ratri', 'good night', 'greetings'],
    ['स्वागत', 'swagat', 'welcome', 'greetings'],
    ['अभिनंदन', 'abhinandan', 'congratulations', 'greetings'],
    ['पुन्हा भेटू', 'punha bhetu', 'see you again', 'greetings'],

    /* ---- family — where the Marathi words differ most from Hindi ---- */
    ['आई', 'aai', 'mother', 'family'],
    ['बाबा', 'baba', 'father', 'family'],
    ['आजी', 'aaji', 'grandmother', 'family'],
    ['आजोबा', 'ajoba', 'grandfather', 'family'],
    ['ताई', 'tai', 'elder sister — and how you address her', 'family'],
    /* NOT grandfather: in Marathi dada is the ELDER BROTHER. A Hindi
       ear expects the other meaning; the gloss says so out loud. */
    ['दादा', 'dada', 'elder brother — in Marathi, not grandfather', 'family'],
    ['भाऊ', 'bhau', 'brother', 'family'],
    ['बहीण', 'bahin', 'sister', 'family'],
    ['मुलगा', 'mulga', 'boy, son', 'family'],
    ['मुलगी', 'mulgi', 'girl, daughter', 'family'],
    ['बाळ', 'baal', 'baby', 'family'],
    ['काका', 'kaka', 'uncle (father’s brother)', 'family'],
    ['काकू', 'kaku', 'aunt (kaka’s wife)', 'family'],
    ['मामा', 'mama', 'uncle (mother’s brother)', 'family'],
    ['मामी', 'mami', 'aunt (mama’s wife)', 'family'],
    ['मावशी', 'mavshi', 'aunt (mother’s sister)', 'family'],
    ['आत्या', 'atya', 'aunt (father’s sister)', 'family'],
    ['कुटुंब', 'kutumb', 'family', 'family'],
    ['मित्र', 'mitra', 'friend', 'family'],
    ['मैत्रीण', 'maitrin', 'friend (a girl)', 'family'],
    ['नवरा', 'navra', 'husband', 'family'],
    ['बायको', 'bayko', 'wife', 'family'],

    /* ---- food — the Maharashtrian table ---- */
    ['पाणी', 'paani', 'water', 'food'],
    ['भाकरी', 'bhakri', 'flatbread of jowar or bajra', 'food'],
    ['पोळी', 'poli', 'soft wheat flatbread', 'food'],
    ['भात', 'bhaat', 'rice', 'food'],
    ['वरण भात', 'varan bhaat', 'plain dal on rice — the first food', 'food'],
    ['आमटी', 'amti', 'everyday spiced dal', 'food'],
    ['भाजी', 'bhaji', 'vegetable dish', 'food'],
    ['दूध', 'doodh', 'milk', 'food'],
    ['चहा', 'chaha', 'tea', 'food'],
    ['तूप', 'toop', 'ghee', 'food'],
    ['दही', 'dahi', 'yogurt', 'food'],
    ['साखर', 'sakhar', 'sugar', 'food'],
    ['मीठ', 'meeth', 'salt', 'food'],
    ['फळ', 'phal', 'fruit', 'food'],
    ['आंबा', 'amba', 'mango', 'food'],
    ['केळ', 'kel', 'banana', 'food'],
    ['कांदा', 'kanda', 'onion', 'food'],
    ['बटाटा', 'batata', 'potato', 'food'],
    ['टोमॅटो', 'tomato', 'tomato', 'food'],
    ['लाडू', 'laadu', 'laddu', 'food'],
    ['मोदक', 'modak', 'modak — the sweet dumpling', 'food'],
    ['पुरणपोळी', 'puranpoli', 'sweet stuffed flatbread', 'food'],
    ['श्रीखंड', 'shrikhand', 'sweet strained yogurt', 'food'],
    ['पोहे', 'pohe', 'flattened-rice breakfast', 'food'],
    ['जेवण', 'jevan', 'a meal', 'food'],

    /* ---- body ---- */
    ['डोके', 'doke', 'head', 'body'],
    ['डोळा', 'dola', 'eye', 'body'],
    ['नाक', 'naak', 'nose', 'body'],
    ['कान', 'kaan', 'ear', 'body'],
    ['तोंड', 'tond', 'mouth', 'body'],
    ['दात', 'daat', 'tooth', 'body'],
    ['जीभ', 'jeebh', 'tongue', 'body'],
    ['हात', 'haath', 'hand', 'body'],
    ['बोट', 'bot', 'finger', 'body'],
    ['पाय', 'paay', 'foot, leg', 'body'],
    ['पोट', 'pot', 'tummy', 'body'],
    ['केस', 'kes', 'hair', 'body'],

    /* ---- home ---- */
    ['घर', 'ghar', 'house', 'home'],
    ['दार', 'daar', 'door', 'home'],
    ['खिडकी', 'khidki', 'window', 'home'],
    ['खोली', 'kholi', 'room', 'home'],
    ['खुर्ची', 'khurchi', 'chair', 'home'],
    ['टेबल', 'tebal', 'table', 'home'],
    ['दिवा', 'diva', 'lamp', 'home'],
    ['किल्ली', 'killi', 'key', 'home'],
    ['पलंग', 'palang', 'bed', 'home'],
    ['छप्पर', 'chhappar', 'roof', 'home'],
    ['स्वयंपाकघर', 'swayampakghar', 'kitchen', 'home'],
    ['आरसा', 'aarsa', 'mirror', 'home'],
    ['अंगण', 'angan', 'courtyard', 'home'],
    ['देवघर', 'devghar', 'the small prayer corner many homes keep', 'home'],

    /* ---- animals ---- */
    ['कुत्रा', 'kutra', 'dog', 'animals'],
    ['मांजर', 'manjar', 'cat', 'animals'],
    ['गाय', 'gaay', 'cow', 'animals'],
    ['शेळी', 'sheli', 'goat', 'animals'],
    ['घोडा', 'ghoda', 'horse', 'animals'],
    ['हत्ती', 'hatti', 'elephant', 'animals'],
    ['वाघ', 'waagh', 'tiger', 'animals'],
    ['सिंह', 'sinha', 'lion', 'animals'],
    ['माकड', 'makad', 'monkey', 'animals'],
    ['मासा', 'masa', 'fish', 'animals'],
    ['पक्षी', 'pakshi', 'bird', 'animals'],
    ['चिमणी', 'chimni', 'sparrow — the chiu-tai of the stories', 'animals'],
    ['कावळा', 'kavla', 'crow', 'animals'],
    ['मोर', 'mor', 'peacock', 'animals'],
    ['उंदीर', 'undir', 'mouse', 'animals'],
    ['फुलपाखरू', 'phulpakhru', 'butterfly', 'animals'],

    /* ---- colours — four of the ten need ळ ---- */
    ['रंग', 'rang', 'colour', 'colours'],
    ['लाल', 'laal', 'red', 'colours'],
    ['निळा', 'nila', 'blue', 'colours'],
    ['पिवळा', 'pivla', 'yellow', 'colours'],
    ['हिरवा', 'hirva', 'green', 'colours'],
    ['काळा', 'kaala', 'black', 'colours'],
    ['पांढरा', 'pandhra', 'white', 'colours'],
    ['केशरी', 'keshari', 'orange', 'colours'],
    ['गुलाबी', 'gulabi', 'pink', 'colours'],
    ['जांभळा', 'jambhla', 'purple', 'colours'],

    /* ---- numbers 1–10 ---- */
    ['एक', 'ek', 'one', 'numbers', 1],
    ['दोन', 'don', 'two', 'numbers', 2],
    ['तीन', 'teen', 'three', 'numbers', 3],
    ['चार', 'chaar', 'four', 'numbers', 4],
    ['पाच', 'paach', 'five', 'numbers', 5],
    ['सहा', 'saha', 'six', 'numbers', 6],
    ['सात', 'saat', 'seven', 'numbers', 7],
    ['आठ', 'aath', 'eight', 'numbers', 8],
    ['नऊ', 'nau', 'nine', 'numbers', 9],
    ['दहा', 'daha', 'ten', 'numbers', 10],

    /* ---- basics ---- */
    ['मी', 'mi', 'I', 'basics'],
    ['तू', 'tu', 'you (to a friend)', 'basics'],
    ['तुम्ही', 'tumhi', 'you (respectful)', 'basics'],
    ['आम्ही', 'aamhi', 'we', 'basics'],
    ['आपण', 'aapan', 'we — including you', 'basics'],
    ['हा', 'ha', 'this', 'basics'],
    ['तो', 'to', 'he, that', 'basics'],
    ['ती', 'ti', 'she', 'basics'],
    ['माझा', 'majha', 'my', 'basics'],
    ['काय', 'kay', 'what', 'basics'],
    ['कोण', 'kon', 'who', 'basics'],
    ['कुठे', 'kuthe', 'where', 'basics'],
    ['मोठा', 'motha', 'big', 'basics'],
    ['लहान', 'lahaan', 'small', 'basics'],
    ['खूप', 'khoop', 'very, a lot', 'basics'],
    ['ठीक', 'theek', 'fine, alright', 'basics'],
    ['हळू', 'halu', 'slowly, gently', 'basics'],
    ['नाव', 'naav', 'name', 'basics'],
    ['गोष्ट', 'goshta', 'story — "goshta sang na!"', 'basics'],
    ['माणूस', 'manus', 'person', 'basics'],

    /* ---- actions — Marathi infinitives end in -णे, with ण ---- */
    ['आहे', 'aahe', 'is', 'actions'],
    ['खाणे', 'khaane', 'to eat', 'actions'],
    ['पिणे', 'pine', 'to drink', 'actions'],
    ['खेळणे', 'khelne', 'to play', 'actions'],
    ['झोपणे', 'jhopne', 'to sleep', 'actions'],
    ['जाणे', 'jaane', 'to go', 'actions'],
    ['येणे', 'yene', 'to come', 'actions'],
    ['बघणे', 'baghne', 'to see, to watch', 'actions'],
    ['ऐकणे', 'aikne', 'to listen', 'actions'],
    ['बोलणे', 'bolne', 'to speak', 'actions'],
    ['म्हणणे', 'mhanne', 'to say', 'actions'],
    ['करणे', 'karne', 'to do', 'actions'],
    ['देणे', 'dene', 'to give', 'actions'],
    ['घेणे', 'ghene', 'to take', 'actions'],
    ['वाचणे', 'vaachne', 'to read', 'actions'],
    ['लिहिणे', 'lihine', 'to write', 'actions'],
    ['चालणे', 'chaalne', 'to walk', 'actions'],
    ['धावणे', 'dhaavne', 'to run', 'actions'],
    ['हसणे', 'hasne', 'to laugh', 'actions'],

    /* ---- school ---- */
    ['शाळा', 'shala', 'school', 'school'],
    ['शिक्षक', 'shikshak', 'teacher', 'school'],
    ['पुस्तक', 'pustak', 'book', 'school'],
    ['वही', 'vahi', 'notebook', 'school'],
    ['पाटी', 'paati', 'slate', 'school'],
    ['खडू', 'khadu', 'chalk', 'school'],
    ['दप्तर', 'daptar', 'school bag', 'school'],
    ['अभ्यास', 'abhyas', 'study, homework', 'school'],
    ['चित्र', 'chitra', 'picture', 'school'],
    ['गाणे', 'gaane', 'song', 'school'],
    ['खेळ', 'khel', 'game', 'school'],
    ['मैदान', 'maidan', 'playground', 'school'],

    /* ---- clothes ---- */
    ['कपडे', 'kapde', 'clothes', 'clothes'],
    ['सदरा', 'sadra', 'shirt', 'clothes'],
    ['कुर्ता', 'kurta', 'kurta', 'clothes'],
    ['साडी', 'saadi', 'saree', 'clothes'],
    ['धोतर', 'dhotar', 'dhoti', 'clothes'],
    ['टोपी', 'topi', 'cap', 'clothes'],
    ['चप्पल', 'chappal', 'slippers', 'clothes'],
    ['बूट', 'boot', 'shoes', 'clothes'],

    /* ---- weather and sky ---- */
    ['पाऊस', 'paus', 'rain', 'weather'],
    ['ऊन', 'oon', 'sunshine', 'weather'],
    ['वारा', 'vara', 'wind', 'weather'],
    ['ढग', 'dhag', 'cloud', 'weather'],
    ['वीज', 'veej', 'lightning', 'weather'],
    ['थंडी', 'thandi', 'the cold', 'weather'],
    ['आकाश', 'akash', 'sky', 'weather'],
    ['सूर्य', 'surya', 'sun', 'weather'],
    ['चंद्र', 'chandra', 'moon', 'weather'],
    ['चांदणी', 'chandni', 'star', 'weather'],
    ['इंद्रधनुष्य', 'indradhanushya', 'rainbow', 'weather'],

    /* ---- time and days ---- */
    ['आज', 'aaj', 'today', 'time'],
    ['उद्या', 'udya', 'tomorrow', 'time'],
    ['काल', 'kaal', 'yesterday', 'time'],
    ['सकाळ', 'sakaal', 'morning', 'time'],
    ['दुपार', 'dupaar', 'afternoon', 'time'],
    ['संध्याकाळ', 'sandhyakaal', 'evening', 'time'],
    ['रात्र', 'ratra', 'night', 'time'],
    ['वेळ', 'vel', 'time', 'time'],
    ['आठवडा', 'athvada', 'week', 'time'],
    ['वाढदिवस', 'vaadhdivas', 'birthday', 'time'],

    /* ---- places and outdoors ---- */
    ['गाव', 'gaav', 'village', 'places'],
    ['शहर', 'shahar', 'city', 'places'],
    ['रस्ता', 'rasta', 'road', 'places'],
    ['बाजार', 'bajaar', 'market', 'places'],
    ['दुकान', 'dukaan', 'shop', 'places'],
    ['बाग', 'baag', 'garden', 'places'],
    ['झाड', 'jhaad', 'tree', 'places'],
    ['फूल', 'phool', 'flower', 'places'],
    ['नदी', 'nadi', 'river', 'places'],
    ['समुद्र', 'samudra', 'sea', 'places'],
    ['डोंगर', 'dongar', 'hill, mountain', 'places'],
    ['देऊळ', 'deul', 'temple', 'places'],

    /* ---- getting around ---- */
    ['गाडी', 'gadi', 'car, vehicle', 'transport'],
    ['बस', 'bas', 'bus', 'transport'],
    ['आगगाडी', 'aaggadi', 'train — the "fire-cart"', 'transport'],
    ['सायकल', 'saykal', 'bicycle', 'transport'],
    ['रिक्षा', 'riksha', 'rickshaw', 'transport'],
    ['बैलगाडी', 'bailgadi', 'bullock cart', 'transport'],
    ['होडी', 'hodi', 'boat', 'transport'],
    ['विमान', 'vimaan', 'aeroplane', 'transport'],

    /* ---- feelings ---- */
    ['आनंदी', 'anandi', 'happy', 'feelings'],
    ['हसू', 'hasu', 'a smile', 'feelings'],
    ['राग', 'raag', 'anger', 'feelings'],
    ['भीती', 'bhiti', 'fear', 'feelings'],
    ['भूक', 'bhook', 'hunger', 'feelings'],
    ['कंटाळा', 'kantala', 'boredom — the most Marathi feeling word', 'feelings'],
    ['प्रेम', 'prem', 'love', 'feelings'],
    ['माया', 'maya', 'affection', 'feelings']
  ]);

  /* -------------------------------------------------------- the pack ---- */
  /* Stages 4–6 are deliberately NOT authored: the derived skeleton from
     stageItems() keeps the ladder walkable and the gap visible, exactly
     as the Punjabi pack does. Somebody who speaks Marathi writes the
     sentences and dialogues; this file does not pretend to. */
  var MR_PACK = {
    id: 'mr',
    name: { en: 'Marathi', native: 'मराठी' },
    script: 'devanagari-mr',
    transliteration: 'iso15919+kid',
    phonology: { tones: false, retroflex: true, aspiration: true },
    voice: { kind: 'human', ns: 'mr' },
    diglossia: null,
    paths: ['heritage', 'beginner'],
    themes: K.THEMES,
    lexicon: MR_LEX,
    reviewedBy: [],                 /* a native Marathi speaker signs here before ship */
    stages: K.ladder(K.stageItems(SCRIPT, MR_LEX))
  };

  K.register(SCRIPT, MR_PACK);

}(typeof window !== 'undefined' ? window : this));
