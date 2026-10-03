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
