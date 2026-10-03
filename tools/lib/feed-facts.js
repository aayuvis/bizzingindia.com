/* My Feed's facts are READ, never typed (docs/30-feed.md; owner, 3 Oct 2026: "add more info to
   the feed cards"). A fact is a label and a value, and the value is whatever the corpus holds at
   a path — so tools/build-feed.js writes it and tools/check-feed.js reads the same path again
   and must get the same thing. The label is the app's own word for the slot ("From", "When");
   the value is never the builder's.

   A path walks the corpus `C` (tools/lib/corpus.js) one segment at a time, split on '/':
     IND_GEO/states/KL/capital          a key, then a key
     stories/[id=pt.monkey]/minutes     [k=v] finds the element of an array whose k is v
   and may end in one mapper after '|':
     names   state codes (KL, IN-KL) to the state's own name, joined
     len     how many
     vals    an object's values, joined with ' · '
   An array with no mapper is joined with ', '. Nothing found, or found empty, is null — and a
   fact with any null in it is not written at all. */
'use strict';

function seek(C, path) {
  let x = C;
  for (const seg of path.split('/')) {
    if (x == null) return null;
    const m = seg.match(/^\[([^=\]]+)=(.*)\]$/);
    if (m) x = Array.isArray(x) ? x.find(o => o && String(o[m[1]]) === m[2]) : null;
    else x = x[/^\d+$/.test(seg) && Array.isArray(x) ? +seg : seg];
  }
  return x == null ? null : x;
}

function factAt(C, path) {
  const bar = path.lastIndexOf('|');
  const fn = bar >= 0 ? path.slice(bar + 1) : '', p = bar >= 0 ? path.slice(0, bar) : path;
  let x = seek(C, p);
  if (x == null) return null;
  if (fn === 'names') {
    const S = (C.IND_GEO && C.IND_GEO.states) || {};
    x = [].concat(x).map(c => (S[String(c).replace(/^IN-/, '')] || {}).name).filter(Boolean).join(', ');
  } else if (fn === 'len') x = Array.isArray(x) ? x.length : null;
  else if (fn === 'vals') x = x && typeof x === 'object' ? Object.values(x).filter(v => typeof v === 'string').join(' · ') : null;
  else if (fn) throw new Error('feed-facts: no mapper "' + fn + '" in ' + path);
  else if (Array.isArray(x)) x = x.filter(v => typeof v === 'string' || typeof v === 'number').join(', ');
  if (x == null || typeof x === 'object') return null;
  x = String(x).trim();
  return x ? x : null;
}

/* one fact: [label, template, [paths], lang?] → [label, value, lang?], or null if any part is missing.
   The template is the app's framing of the value ("{0} min", "{0} of {1}") and nothing more. */
function fill(C, spec) {
  const [label, tpl, paths, lang] = spec;
  const vals = paths.map(p => factAt(C, p));
  if (vals.some(v => v == null)) return null;
  const value = tpl.replace(/\{(\d)\}/g, (_, i) => vals[+i]);
  return lang ? [label, value, lang] : [label, value];
}

module.exports = { seek, factAt, fill };
