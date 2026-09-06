/* CSS THAT DOES NOT REACH EVERY CHILD IS A BUG NOBODY HERE CAN SEE.
 *
 * Every headless engine available in this container is Chromium, so a property
 * an older Safari ignores passes every test and fails on a real device — and
 * fails SILENTLY, which is the worst kind. `inset: 0` was exactly that: not
 * applied, so a position:fixed full-screen surface fell back to auto offsets,
 * the board measured zero and drew nothing, the modal card rendered somewhere
 * it could not be seen, and the report came back as "the game is broken".
 *
 * This is a static check with no browser in it. Add to the list only things
 * that fail QUIETLY — a property that simply does not paint is a design
 * choice; one that collapses a layout is a trap.
 */
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, '..', 'app');
const BANNED = [
  { re: /\binset\s*:/g, why: 'inset shorthand — write top/right/bottom/left; Safari before 14.1 drops it and a fixed element silently loses its box' },
  { re: /:\s*has\(/g,   why: ':has() — not in Safari before 15.4 and Firefox before 121; a rule that never matches is invisible to test' },
];
let bad = 0, files = 0;
for (const f of fs.readdirSync(DIR)) {
  if (!/\.(js|css)$/.test(f)) continue;
  const s = fs.readFileSync(path.join(DIR, f), 'utf8');
  files++;
  for (const b of BANNED) {
    b.re.lastIndex = 0;
    const hits = s.match(b.re);
    if (!hits) continue;
    /* NOT EVERY UNSUPPORTED PROPERTY IS A TRAP. A rule that only makes a wide
       screen wider degrades to the narrower layout and nobody is hurt; a rule
       that positions a fixed surface takes the whole screen down with it. A
       line marked css-compat-ok says which one it is, and says WHY, so the
       next person does not have to guess. */
    const lines = s.split('\n').map((l, i) => [i + 1, l])
      .filter(([, l]) => { b.re.lastIndex = 0; return b.re.test(l) && !/css-compat-ok/.test(l); })
      .map(([n]) => n);
    if (!lines.length) continue;
    console.log('FAIL  ' + f + ': ' + lines.length + ' × ' + b.why +
                '  (lines ' + lines.slice(0, 6).join(', ') + ')');
    bad += lines.length;
  }
}
console.log(bad ? '\n' + bad + ' occurrences to fix' : 'ALL GREEN  (' + files + ' files, none of the quiet-failure properties)');
process.exit(bad ? 1 : 0);
