/* Bizzing India — HINDI GRAMMAR, as sixteen things rather than sixteen labels.
 *
 * WHAT CHANGED AND WHY (docs/12, Phase C). Every s4 sentence already carried a `point`
 * string — 'sov', 'respect', 'gender' — and that string was doing nothing. It was not a
 * card a child could read, not a track the SRS could schedule, not a row a parent could
 * be shown, and not a hook the other eight packs could map onto. A label on a sentence
 * is a filing decision; a grammar point with an id is a taught object.
 *
 * So each of the sixteen becomes an object with:
 *   id        the same string the sentences already use, so nothing has to be re-tagged
 *   hi/roman  its name in Hindi, because the thing has a name in the language it is from
 *   en        what to call it to a nine-year-old
 *   rule      ONE sentence a nine-year-old can hold. Not a definition — a rule of thumb
 *             they can actually apply while speaking. No metalanguage a child would have
 *             to look up ("oblique case", "ergative") unless the card teaches it first.
 *   watch     the mistake an English-speaking child actually makes here. This is the
 *             part worth the most: knowing that "मैं हूँ खाता" feels natural to a child
 *             thinking in English is more useful than knowing the word 'SOV'.
 *   eg        two or three worked examples, BY ID, pulled from the sentences already
 *             written. Never re-typed: if a sentence is corrected, its card follows.
 *
 * THE SRS TRACK. Each point gets a key `gram:<id>` so the planner can schedule the POINT,
 * not only the sentences under it — which is how a child who has met आप twenty times in
 * twenty sentences still gets asked, once, whether they know when to use it.
 *
 * REVIEW STATUS: the rules and the `watch` lines are written to be checked by a Hindi
 * pedagogue before launch (docs/09 §9), same as everything else in this pack. They state
 * ordinary, uncontested facts about the language — nothing here is a novel claim — but a
 * native pass is still the gate.
 */
window.IND_BHASHA_GRAMMAR = window.IND_BHASHA_GRAMMAR || {};
window.IND_BHASHA_GRAMMAR.hi = [
  { id: 'sov', hi: 'क्रिया आख़िर में', roman: 'kriya aakhir mein', en: 'The verb comes last',
    rule: 'In Hindi the doing word waits till the end: first who, then what, then what they do.',
    watch: 'English puts the verb in the middle — "I eat roti". Hindi says "मैं रोटी खाता हूँ": I, roti, eat.',
    eg: ['s4-11', 's4-12', 's4-14'] },

  { id: 'copula', hi: 'है / हैं', roman: 'hai / hain', en: 'Saying something IS',
    rule: 'है for one, हैं for many — and it still goes right at the end.',
    watch: 'It is easy to drop है altogether, because English can say "this house" as a phrase. Hindi wants यह घर है।',
    eg: ['s4-01', 's4-02', 's4-03'] },

  { id: 'gender', hi: 'लिंग', roman: 'ling', en: 'Words have a gender',
    rule: 'Every Hindi thing is masculine or feminine, and the words around it change to match — मेरा भाई but मेरी बहन.',
    watch: 'English has no gender on objects at all, so a chair being feminine has to be learned with the chair, not worked out.',
    eg: ['s4-04', 's4-05', 's4-13'] },

  { id: 'agreement', hi: 'मेल', roman: 'mel', en: 'Words match each other',
    rule: 'The describing word takes the gender and number of the thing it describes: आम मीठा, चाय मीठी.',
    watch: 'In English "sweet" never changes. In Hindi it changes twice — for gender and for how many.',
    eg: ['s4-59', 's4-60', 's4-61'] },

  { id: 'plural', hi: 'बहुवचन', roman: 'bahuvachan', en: 'More than one',
    rule: 'Most masculine words ending in आ swap it for ए (लड़का → लड़के); most feminine words add एँ or याँ (बहन → बहनें).',
    watch: 'There is no all-purpose "s". The ending you change depends on the word\'s own gender.',
    eg: ['s4-07', 's4-67'] },

  { id: 'respect', hi: 'आदर', roman: 'aadar', en: 'आप, तुम and तू',
    rule: 'आप for anyone older or respected, तुम for a friend or someone younger — and आप takes the plural verb even for one person.',
    watch: 'This is the one that matters most and English gives no help at all: "you" is the same word for your nani and your dog.',
    eg: ['s4-10', 's4-71', 's4-73'] },

  { id: 'postposition', hi: 'परसर्ग', roman: 'parsarg', en: 'The little word comes after',
    rule: 'Hindi puts में, पर, से, को AFTER the thing, not before it: मेज़ पर, not "on the table".',
    watch: 'English says "on the table" — Hindi says "table on". The order is the whole trick.',
    eg: ['s4-21', 's4-22', 's4-23'] },

  { id: 'possession', hi: 'का / की / के', roman: 'ka / ki / ke', en: 'Whose it is',
    rule: 'का, की or के says whose — and which one you use follows the gender of the thing owned, not the owner.',
    watch: 'पापा की गाड़ी is की because गाड़ी is feminine, even though पापा is not. That catches everybody.',
    eg: ['s4-28', 's4-29', 's4-30'] },

  { id: 'question', hi: 'प्रश्न', roman: 'prashn', en: 'Asking something',
    rule: 'Hindi does not reshuffle the sentence to ask — it puts a question word in, or just lifts your voice at the end.',
    watch: 'English flips to "are you…?" Hindi keeps the order and changes the word: तुम कहाँ हो?',
    eg: ['s4-31', 's4-32', 's4-33'] },

  { id: 'negation', hi: 'नहीं', roman: 'nahin', en: 'Saying no',
    rule: 'नहीं goes just before the verb — and in the present tense it often swallows है along with it.',
    watch: 'A child will say "मैं नहीं है भूखा". It is मुझे भूख नहीं है।',
    eg: ['s4-38', 's4-39', 's4-40'] },

  { id: 'tense-present', hi: 'वर्तमान काल', roman: 'vartamaan kaal', en: 'Happening now',
    rule: 'Two presents: one for what you do (मैं गाता हूँ) and one for what you are doing right now (मैं गा रहा हूँ).',
    watch: 'English has the same split, so this one is easier than it looks — but the verb still ends the sentence.',
    eg: ['s4-41', 's4-42', 's4-43'] },

  { id: 'tense-past', hi: 'भूतकाल', roman: 'bhootkaal', en: 'Already happened',
    rule: 'For a finished action with an object, the doer takes ने — मैंने दूध पिया।',
    watch: 'ने has no English equivalent whatsoever, and it is the single most-missed word when a diaspora child speaks past tense.',
    eg: ['s4-45', 's4-46', 's4-47'] },

  { id: 'tense-future', hi: 'भविष्यत् काल', roman: 'bhavishyat kaal', en: 'Going to happen',
    rule: 'The future is built onto the verb itself — जाऊँगा, जाएँगे — not with a separate word like "will".',
    watch: 'The ending changes for who is going AND for their gender: जाऊँगा, जाऊँगी.',
    eg: ['s4-49', 's4-50'] },

  { id: 'imperative', hi: 'आज्ञा', roman: 'aagya', en: 'Telling someone to do it',
    rule: 'The ending says who you are talking to: करो to a friend, कीजिए to an elder, कर to someone much younger.',
    watch: 'Using करो with a grandparent is not rude in English at all — in Hindi it lands badly. Same sentence, different ending.',
    eg: ['s4-51', 's4-52', 's4-53'] },

  { id: 'request', hi: 'निवेदन', roman: 'nivedan', en: 'Asking nicely',
    rule: 'कृपया plus the ीजिए ending is the polite ask; चाहिए says what you want without ordering anyone.',
    watch: 'English softens with "please" alone. Hindi softens with the verb ending, and please on top is extra.',
    eg: ['s4-57', 's4-58'] },

  { id: 'quantity', hi: 'मात्रा', roman: 'maatra', en: 'How much, how many',
    rule: 'थोड़ा for a little, बहुत for a lot, सब for all — and they agree with the thing, like every other describing word.',
    watch: 'थोड़ा becomes थोड़ी before a feminine word. The rule from "words match each other" is still running here.',
    eg: ['s4-66', 's4-67', 's4-68'] }
];
