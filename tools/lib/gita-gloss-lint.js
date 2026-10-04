/* A CHILD'S READING OF A GITA VERSE SAYS NOTHING THE TRANSLATIONS DO NOT (owner, 4 Oct 2026:
   "draft, flagged needs_review"). The readings are drafted by a computer from the two public-domain
   translations the verse page already shows — Annie Besant (1922) and Swami Swarupananda (1909) —
   and this is what a draft must pass before it is kept at all. A person still reviews every one.

   What a program CAN hold, it holds:
     · no name, place or proper noun that is not in either translation (beyond the four speakers)
     · no number that is not in them
     · no Sanskrit (no Devanagari, no IAST letters): the verse is set in its own script above it
     · names written plain (Vyasa, not Vyâsa), matched to the translations with the marks folded
     · nothing that ranks or dismisses a faith ("myth", "superstition", …)
     · short: 8 to 45 words
   What it cannot — whether the meaning is faithful — is the reviewer's, and the page says so.

   lint(kid, en, en2) → [] when it passes, else the reasons.
   node tools/lib/gita-gloss-lint.js < [{id, kid, en, en2}]  → [{id, why:[…]}] for the failures */
'use strict';
const SPEAKERS = ['Krishna', 'Arjuna', 'Sanjaya', 'Dhritarashtra'];
/* words that start an English sentence and name nobody */
const STARTERS = new Set(('a an the when if you your he she they it its this that these those do don\'t be even so but and like some many ' +
  'people whoever whatever what who whom how why just here there now then both every all no not only each someone anyone such in on at ' +
  'to for from with without by as after before because though although while since let keep stay act work try think remember look see ' +
  'know one our we us his her their my me yes nothing everything everyone anything something never always also again still once ' +
  'where which whose until unless or nor yet whether instead rather most more less few others other another same true real ' +
  'good bad i i\'m i\'ll it\'s that\'s there\'s he\'s she\'s you\'re they\'re we\'re can can\'t will won\'t would should could must may might ' +
  'is are was were has have had does did am being been get give take make go come say says said tell tells asks ask answers ' +
  'god lord great wise those whose look listen hear speak see do ' +
  'among through over under into upon within beyond above below between during whenever wherever however therefore thus hence').split(/\s+/));
const BANNED = /\b(myths?|mythical|superstitio\w*|primitive|pagan|heathen|false gods?|idol worship|the true religion|better religion)\b/i;
const INDIC = /[ऀ-ॿ஀-௿]|[āīūṛṝḷḹṃḥṅñṭḍṇśṣĀĪŪṚṜḶṂḤṄÑṬḌṆŚṢ]/;
/* Besant writes names with a circumflex (Brâhmanas, Vyâsa); a child's reading writes them plain,
   and a name is matched with the marks folded away on both sides */
const MARKED = /[âêîôûÂÊÎÔÛäëïöüàèìòùáéíóú]/;
const fold = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function lint(kid, en, en2) {
  const why = [], src = fold(String(en || '') + ' ' + String(en2 || '')).toLowerCase();
  const text = String(kid || '').trim();
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 8 || words.length > 45) why.push(words.length + ' words (8 to 45)');
  if (INDIC.test(text)) why.push('Sanskrit or Indic letters in an English reading');
  if (MARKED.test(text)) why.push('a name written with an accent mark — write it plain: ' + text.match(MARKED)[0]);
  if (BANNED.test(text)) why.push('a word that ranks or dismisses a faith: ' + text.match(BANNED)[0]);
  for (const n of text.match(/\d+/g) || []) if (src.indexOf(n) < 0) why.push('the number ' + n + ' is not in either translation');
  const caps = text.match(/\b[A-Z][a-zA-Z'’-]*/g) || [];
  for (const w of caps) {
    const lw = w.toLowerCase().replace(/[’]/g, '\'');
    if (SPEAKERS.includes(w.replace(/['’]s$/, '')) || STARTERS.has(lw)) continue;   /* Krishna's is Krishna */
    if (src.indexOf(lw.replace(/'s$/, '')) >= 0) continue;
    why.push('“' + w + '” is in neither translation');
  }
  return why;
}
module.exports = { lint, SPEAKERS };

if (require.main === module) {
  let buf = '';
  process.stdin.on('data', d => { buf += d; });
  process.stdin.on('end', () => {
    const out = [];
    for (const x of JSON.parse(buf || '[]')) { const w = lint(x.kid, x.en, x.en2); if (w.length) out.push({ id: x.id, why: w }); }
    process.stdout.write(JSON.stringify(out));
  });
}
