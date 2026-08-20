/* Bizzing India — the mother tongues.
 *
 * WHY THIS EXISTS. We do not know where a child's family is from, and the app must never
 * guess. What it can do is ask once — "what does your family speak at home?" — and then
 * lean everything gently toward the answer: the family's states come out of the mist's
 * shadow first on the map, their stories rise to the top of the shelf, their language pack
 * leads in Bhasha, the word of the day arrives in their language, and the grandparent
 * words become the family's own — a Tamil child asks Paati, not Nani.
 *
 * WHAT NEVER CHANGES. The pillar names — Itihaas, Neeti, Bhasha — stay Sanskrit for every
 * child, because they belong to everyone (and the user said so, in exactly those words).
 * And leaning is ORDERING, never gating: no tongue hides anything from anybody. CLAUDE.md
 * rule 8 — never imply Hindi = Indian — is most of the reason this file exists at all.
 *
 * SHAPE OF AN ENTRY:
 *   id      the BCP-47-ish code, and the Bhasha pack id where one exists
 *   states  the map codes this language calls home — used to sort stories and light the
 *           map. Approximate on purpose: languages do not stop at state lines, and the
 *           note under the picker says so.
 *   kin     what THIS family calls the four grandparents, keyed by the Hindi role names
 *           the Ask-Nani data uses (nani/nana = mother's side, dadi/dada = father's).
 *           Where one warm word serves both sides (Tamil Paati, Kannada Ajji, Marathi
 *           Aaji) it simply appears twice — that is the truth, not a bug.
 *   kinNote 'in many families…' honesty, shown beside the kin words. Kinship words vary
 *           by region, community and family; the app offers the common ones and says
 *           "ask your family", per editorial policy §5.
 *   words   a few everyday words [native, roman, en, audioKey?] for the Home word-of-the-
 *           day. Deliberately tiny and deliberately safe — hello, mother, water, a story —
 *           until each language's full pack carries the load. No audio clip yet means the
 *           speech-synthesis fallback speaks it with the right language tag.
 *   pack    the Bhasha pack to surface first, when it exists.
 *
 * Every kinship word and everyday word below is a draft wanting a native speaker's pass,
 * exactly like the language notes in data-nani.js and data-rishtey.js.
 */
(function () {
  'use strict';

  var LIST = [
    { id: 'hi', en: 'Hindi', native: 'हिन्दी', lang: 'hi', pack: 'hi',
      states: ['UP', 'BR', 'MP', 'RJ', 'HR', 'HP', 'UK', 'DL', 'JH', 'CG'],
      kin: { nani: 'Nani', nana: 'Nana', dadi: 'Dadi', dada: 'Dada' },
      kinNote: null,
      words: null /* Home already carries the Hindi word of the day, with recorded audio */ },

    { id: 'pa', en: 'Punjabi', native: 'ਪੰਜਾਬੀ', lang: 'pa', pack: 'pa',
      states: ['PB', 'CH'],
      kin: { nani: 'Nani', nana: 'Nana', dadi: 'Dadi', dada: 'Dada' },
      kinNote: 'In many families the grandmothers are Bibi ji, the grandfathers Baba ji.',
      words: [['ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', 'sat sri akaal', 'hello', 'pa/w-satsriakaal'],
              ['ਮਾਂ', 'maa', 'mother', 'pa/w-maa'],
              ['ਪਾਣੀ', 'paani', 'water', 'pa/w-paani'],
              ['ਕਹਾਣੀ', 'kahaani', 'a story', 'pa/w-kahaani']] },

    { id: 'bn', en: 'Bengali', native: 'বাংলা', lang: 'bn', pack: 'bn',
      states: ['WB', 'TR'],
      kin: { nani: 'Didima', nana: 'Dadu', dadi: 'Thakuma', dada: 'Thakurda' },
      kinNote: 'Dida and Dadu, Thakuma and Thakurda — and every para has its own version.',
      words: [['নমস্কার', 'nomoshkar', 'hello'],
              ['মা', 'maa', 'mother'],
              ['জল', 'jol', 'water — pani in many homes'],
              ['গল্প', 'golpo', 'a story']] },

    { id: 'mr', en: 'Marathi', native: 'मराठी', lang: 'mr', pack: 'mr',
      states: ['MH'],
      kin: { nani: 'Aaji', nana: 'Ajoba', dadi: 'Aaji', dada: 'Ajoba' },
      kinNote: 'The same warm Aaji and Ajoba on both sides.',
      words: [['नमस्कार', 'namaskar', 'hello'],
              ['आई', 'aai', 'mother'],
              ['पाणी', 'paani', 'water'],
              ['गोष्ट', 'goshta', 'a story']] },

    { id: 'te', en: 'Telugu', native: 'తెలుగు', lang: 'te', pack: 'te',
      states: ['AP', 'TG'],
      kin: { nani: 'Ammamma', nana: 'Thaathayya', dadi: 'Naanamma', dada: 'Thaathayya' },
      kinNote: 'Ammamma is mother’s mother, Naanamma is father’s — Thaathayya sits proudly on both sides.',
      words: [['నమస్కారం', 'namaskaram', 'hello'],
              ['అమ్మ', 'amma', 'mother'],
              ['నీళ్ళు', 'neellu', 'water'],
              ['కథ', 'katha', 'a story']] },

    { id: 'ta', en: 'Tamil', native: 'தமிழ்', lang: 'ta', pack: 'ta',
      states: ['TN', 'PY'],
      kin: { nani: 'Paati', nana: 'Thaatha', dadi: 'Paati', dada: 'Thaatha' },
      kinNote: 'Paati and Thaatha on both sides — and Ammamma for mother’s mother in many families.',
      words: [['வணக்கம்', 'vanakkam', 'hello'],
              ['அம்மா', 'amma', 'mother'],
              ['தண்ணீர்', 'thanneer', 'water'],
              ['கதை', 'kadhai', 'a story']] },

    { id: 'gu', en: 'Gujarati', native: 'ગુજરાતી', lang: 'gu', pack: 'gu',
      states: ['GJ', 'DD', 'DN'],
      kin: { nani: 'Nani', nana: 'Nana', dadi: 'Dadi', dada: 'Dada' },
      kinNote: 'And in many homes the grandmother is simply Ba, the grandfather Dada.',
      words: [['કેમ છો', 'kem chho', 'hello — "how are you?"'],
              ['મા', 'maa', 'mother'],
              ['પાણી', 'paani', 'water'],
              ['વાર્તા', 'vaarta', 'a story']] },

    { id: 'ur', en: 'Urdu', native: 'اردو', lang: 'ur', pack: 'ur',
      states: ['DL', 'UP', 'BR', 'TG', 'JK'],
      kin: { nani: 'Nani', nana: 'Nana', dadi: 'Dadi', dada: 'Dada' },
      kinNote: 'Nani and Dadi, Nana and Dada — with Ammi and Abbu at home.',
      words: [['آداب', 'aadaab', 'hello — the tehzeeb greeting'],
              ['امی', 'ammi', 'mother'],
              ['پانی', 'paani', 'water'],
              ['کہانی', 'kahani', 'a story']] },

    { id: 'kn', en: 'Kannada', native: 'ಕನ್ನಡ', lang: 'kn', pack: 'kn',
      states: ['KA'],
      kin: { nani: 'Ajji', nana: 'Ajja', dadi: 'Ajji', dada: 'Ajja' },
      kinNote: 'Ajji and Ajja on both sides.',
      words: [['ನಮಸ್ಕಾರ', 'namaskara', 'hello'],
              ['ಅಮ್ಮ', 'amma', 'mother'],
              ['ನೀರು', 'neeru', 'water'],
              ['ಕಥೆ', 'kathe', 'a story']] },

    { id: 'ml', en: 'Malayalam', native: 'മലയാളം', lang: 'ml', pack: null,
      states: ['KL', 'LD'],
      kin: { nani: 'Ammamma', nana: 'Appooppan', dadi: 'Achamma', dada: 'Appooppan' },
      kinNote: 'Muthashi and Muthashan in many families.',
      words: [['നമസ്കാരം', 'namaskaram', 'hello'],
              ['അമ്മ', 'amma', 'mother'],
              ['വെള്ളം', 'vellam', 'water'],
              ['കഥ', 'katha', 'a story']] },

    { id: 'or', en: 'Odia', native: 'ଓଡ଼ିଆ', lang: 'or', pack: null,
      states: ['OR'],
      kin: { nani: 'Aai', nana: 'Aja', dadi: 'Jejema', dada: 'Jejebapa' },
      kinNote: 'Aai and Aja on mother’s side, Jejema and Jejebapa on father’s.',
      words: [['ନମସ୍କାର', 'namaskara', 'hello'],
              ['ମା', 'maa', 'mother'],
              ['ପାଣି', 'paani', 'water'],
              ['ଗପ', 'gapa', 'a story']] },

    { id: 'as', en: 'Assamese', native: 'অসমীয়া', lang: 'as', pack: null,
      states: ['AS'],
      kin: { nani: 'Aita', nana: 'Koka', dadi: 'Aita', dada: 'Koka' },
      kinNote: 'Aita and Koka on both sides.',
      words: [['নমস্কাৰ', 'nomoskar', 'hello'],
              ['মা', 'maa', 'mother'],
              ['পানী', 'paani', 'water'],
              ['সাধুকথা', 'xadhukotha', 'a story — the kind an Aita tells']] }
  ];

  var BY_ID = {};
  LIST.forEach(function (t) { BY_ID[t.id] = t; });

  window.IND_TONGUE = {
    list: LIST,
    get: function (id) { return BY_ID[id] || null; }
  };
})();
