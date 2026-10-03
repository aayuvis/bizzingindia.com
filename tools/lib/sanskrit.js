/* Sanskrit, set out three ways from ONE source string — never typed (docs/21; CLAUDE.md:
   "never invent a scripture quotation").

     iast(dev)      Devanagari → IAST, the scholarly romanisation: every vowel length and every
                    retroflex is written, nothing is dropped. Sanskrit keeps its inherent 'a' — a
                    consonant with no halant is always followed by it. (Hindi drops it at word
                    ends; that is the error a Hindi voice or a Hindi-trained eye would teach.)
     simple(iast)   IAST → a plain reading for a child who has not learnt the marks yet:
                    ā → aa, ī → ee, ū → oo, ś/ṣ → sh, c → ch, ṛ → ri … Lossy on purpose, and the
                    screen says it is the easy reading, not the correct one.

   The converter is held by tools/check-gita.js against an independent IAST of every verse
   where the source carries one. */
'use strict';

const V = { 'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū', 'ऋ': 'ṛ', 'ॠ': 'ṝ', 'ऌ': 'ḷ', 'ॡ': 'ḹ',
            'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au' };
const M = { 'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū', 'ृ': 'ṛ', 'ॄ': 'ṝ', 'ॢ': 'ḷ', 'ॣ': 'ḹ',
            'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au' };
const C = { 'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ṅ', 'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh', 'ञ': 'ñ',
            'ट': 'ṭ', 'ठ': 'ṭh', 'ड': 'ḍ', 'ढ': 'ḍh', 'ण': 'ṇ', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
            'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'ळ': 'ḷ', 'व': 'v',
            'श': 'ś', 'ष': 'ṣ', 'स': 's', 'ह': 'h' };
const HALANT = '्', NUKTA = '़';
const OTHER = { 'ं': 'ṃ', 'ः': 'ḥ', 'ँ': 'm̐', 'ऽ': '’', '।': '|', '॥': '||', 'ॐ': 'oṃ',
                '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };

function iast(dev) {
  const s = String(dev).normalize('NFC');
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i], nx = s[i + 1];
    if (C[ch]) {
      let k = C[ch];
      let j = i + 1;
      if (s[j] === NUKTA) j++;                      /* no nukta in Sanskrit; tolerate it */
      if (s[j] === HALANT) { out += k; i = j; continue; }
      if (M[s[j]]) { out += k + M[s[j]]; i = j; continue; }
      out += k + 'a'; i = j - 1; continue;          /* the inherent vowel, always */
    }
    if (V[ch]) { out += V[ch]; continue; }
    if (OTHER[ch] != null) { out += OTHER[ch]; continue; }
    if (M[ch] || ch === HALANT || ch === NUKTA) throw new Error('a vowel sign or halant with no consonant at ' + i + ' in "' + s.slice(Math.max(0, i - 6), i + 6) + '"');
    if (/[ऀ-ॿ]/.test(ch)) throw new Error('unknown Devanagari ' + ch + ' (U+' + ch.charCodeAt(0).toString(16) + ')');
    out += ch;
  }
  return out;
}

/* the easy reading — longest match first */
const SIMPLE = [['ā', 'aa'], ['ī', 'ee'], ['ū', 'oo'], ['ṝ', 'ree'], ['ṛ', 'ri'], ['ḹ', 'lree'], ['ḷ', 'lri'],
  ['ṃ', 'm'], ['m̐', 'n'], ['ḥ', 'h'], ['ṅ', 'n'], ['ñ', 'n'], ['ṇ', 'n'], ['ṭ', 't'], ['ḍ', 'd'],
  ['ś', 'sh'], ['ṣ', 'sh'], ['ch', 'chh'], ['c', 'ch'], ['’', "'"]];
function simple(i) {
  let s = String(i).normalize('NFC'), out = '';
  for (let k = 0; k < s.length;) {
    let hit = null;
    for (const [a, b] of SIMPLE) if (s.startsWith(a, k)) { hit = [a, b]; break; }
    if (hit) { out += hit[1]; k += hit[0].length; } else { out += s[k]; k++; }
  }
  return out;
}

module.exports = { iast, simple };

/* IAST → IPA, for telling a synthetic voice exactly which sound is meant (the retroflex ṇ is not
   the dental n; ph is an aspirated p, never f). Classical values; deterministic. */
const IPA = [['ai', 'ɐi'], ['au', 'ɐu'], ['kh', 'kʰ'], ['gh', 'ɡʱ'], ['ch', 't͡ɕʰ'], ['jh', 'd͡ʑʱ'], ['ṭh', 'ʈʰ'],
  ['ḍh', 'ɖʱ'], ['th', 't̪ʰ'], ['dh', 'd̪ʱ'], ['ph', 'pʰ'], ['bh', 'bʱ'], ['m̐', '̃'],
  ['ā', 'aː'], ['ī', 'iː'], ['ū', 'uː'], ['ṝ', 'r̩ː'], ['ṛ', 'r̩'], ['ḹ', 'l̩ː'], ['ḷ', 'l̩'], ['e', 'eː'], ['o', 'oː'],
  ['a', 'ɐ'], ['i', 'i'], ['u', 'u'], ['ṃ', 'ⁿ'], ['ḥ', 'h'], ['k', 'k'], ['g', 'ɡ'], ['ṅ', 'ŋ'], ['c', 't͡ɕ'], ['j', 'd͡ʑ'],
  ['ñ', 'ɲ'], ['ṭ', 'ʈ'], ['ḍ', 'ɖ'], ['ṇ', 'ɳ'], ['t', 't̪'], ['d', 'd̪'], ['n', 'n̪'], ['p', 'p'], ['b', 'b'], ['m', 'm'],
  ['y', 'j'], ['r', 'ɾ'], ['l', 'l'], ['v', 'ʋ'], ['ś', 'ɕ'], ['ṣ', 'ʂ'], ['s', 's'], ['h', 'ɦ'], ['’', '']];
function ipa(i) {
  let s = String(i).normalize('NFC'), out = '';
  for (let k = 0; k < s.length;) {
    let hit = null;
    for (const [a, b] of IPA) if (s.startsWith(a, k)) { hit = [a, b]; break; }
    if (hit) { out += hit[1]; k += hit[0].length; } else { out += s[k]; k++; }
  }
  return out;
}
module.exports.ipa = ipa;

/* HOW FAR WHAT WAS HEARD IS FROM WHAT WAS WRITTEN, fairly (the Gita's chant check, docs/21 §8).
   Letters only, edit distance — except that an anusvāra (ṃ) is SAID as the nasal of the sound after
   it (sāṃkhya is said sāṅkhya, yogaṃ ca is said yogañ ca), so a listener who writes m, n, ṅ or ñ
   where the text has ṃ heard it right; likewise a visarga before a sibilant said as that sibilant.
   Everything else counts: n for ṇ, s for ṣ, f for ph, a short vowel for a long one. */
const HEARD_NASAL = { m: 1, n: 1, 'ṅ': 1, 'ñ': 1, 'ṃ': 1 };
function letters(s) { return String(s).normalize('NFC').toLowerCase().replace(/[^a-zāīūṛṝḷḹṃḥṅñṭḍṇśṣ]/g, ''); }
function heardDistance(heard, want) {
  const a = letters(heard), b = letters(want);
  let p = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const c = [i];
    for (let j = 1; j <= b.length; j++) {
      /* and a visarga before a sibilant is said as that sibilant (tataḥ śaṅkhāḥ → tataś śaṅkhāḥ) */
      const same = a[i - 1] === b[j - 1] || (b[j - 1] === 'ṃ' && HEARD_NASAL[a[i - 1]]) ||
        (b[j - 1] === 'ḥ' && /[śṣs]/.test(a[i - 1]) && b[j] === a[i - 1]);
      c.push(Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (same ? 0 : 1)));
    }
    p = c;
  }
  return { dist: p[b.length], of: b.length };
}
module.exports.letters = letters;
module.exports.heardDistance = heardDistance;
