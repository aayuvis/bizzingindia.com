/* tools/lib/feed-near.js — what "the same card" means in My Feed (docs/30-feed.md).

   Two cards are near-duplicates when the words they SAY — title, script, romanisation, body and
   question — are ≥ 80% the same (Jaccard over the set of words, any script, case folded). The
   builder drops the later of such a pair as it cuts; tools/check-feed.js holds the whole set to
   it. One definition, so the two can never disagree about what a duplicate is.

   All-pairs by prefix filtering: order every word by how rare it is across the feed; two sets
   that are ≥ t alike must share one of the first |A| − ⌈t·|A|⌉ + 1 rarest words of each, so
   only those pairs are ever compared. */
'use strict';
const NEAR = 0.8;
const said = c => [c.title, c.text, c.roman, c.body, c.play && c.play.q, c.play && c.play.opts.join(' ')].filter(Boolean).join(' ');
const words = s => new Set(String(s || '').toLowerCase().normalize('NFC').match(/[\p{L}\p{M}\p{N}]+/gu) || []);
function similar(a, b) { let n = 0; for (const w of a) if (b.has(w)) n++; const u = a.size + b.size - n; return u ? n / u : 1; }

/* cards in order → [{ i, j, s }] every later card j that is ≥ t alike to an earlier kept card i.
   With `drop`, a card found alike is not indexed, so it cannot knock out a third. */
function nearPairs(cards, o) {
  o = o || {}; const t = o.t || NEAR;
  const sets = cards.map(c => words(said(c)));
  const df = new Map(); sets.forEach(s => s.forEach(w => df.set(w, (df.get(w) || 0) + 1)));
  const rank = w => df.get(w);
  const post = new Map(), out = [], dropped = new Set();
  sets.forEach((s, j) => {
    const toks = [...s].sort((x, y) => rank(x) - rank(y) || (x < y ? -1 : 1));
    const pre = toks.slice(0, Math.max(1, toks.length - Math.ceil(t * toks.length) + 1));
    const cand = new Set();
    pre.forEach(w => (post.get(w) || []).forEach(i => cand.add(i)));
    let hit = false;
    for (const i of cand) { const sim = similar(sets[i], s); if (sim >= t) { out.push({ i, j, s: sim }); hit = true; if (o.drop) break; } }
    if (hit && o.drop) { dropped.add(j); return; }
    pre.forEach(w => { if (!post.has(w)) post.set(w, []); post.get(w).push(j); });
  });
  return { pairs: out, dropped };
}
module.exports = { NEAR, said, words, similar, nearPairs };
