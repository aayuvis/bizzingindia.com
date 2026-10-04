#!/usr/bin/env node
/* Files that are in app/ but are never requested by the app, so tools/deploy.sh leaves them off
   the live site (the repo keeps them). GitHub Pages stops at 1 GB published (owner, 4 Oct 2026:
   "where can we reduce size?"), and the first thing to go is what nobody can ever download.

   TODAY: the city kit's vector traces of pieces that also have a PNG master. kit.js prefers the
   PNG (`K.prefer = 'png'`), so for those pieces the SVG is never asked for — 408 files, 27 MB.
   Tile pieces are kept: K.src sends a tile to its SVG whatever K.prefer says, and the network
   and ground variants (v0–v2, m0–m15) are SVG-only. The rule reads kit.js itself: flip
   K.prefer to 'svg' and this list is empty, so a deploy can never drop a file the app wants.

   node tools/unpublished.js          paths relative to app/, one per line
   node tools/unpublished.js --sum    how many, how big */
'use strict';
const fs = require('fs'), path = require('path');
const APP = path.join(__dirname, '..', 'app');

function list() {
  const kit = fs.readFileSync(path.join(APP, 'kit.js'), 'utf8');
  if (!/K\.prefer = 'png';/.test(kit) || !/if \(tile\) return 'art\/kit\/' \+ id \+ '\/' \+ face \+ '\.svg';/.test(kit)) return [];
  global.window = {};
  for (const f of ['kit-art-manifest.js', 'kit-tile-manifest.js']) {
    const p = path.join(APP, f);
    if (fs.existsSync(p)) { delete require.cache[p]; require(p); }
  }
  const PNG = window.IND_KIT_ART || {}, TILE = window.IND_KIT_TILES || {};
  const out = [];
  for (const id of Object.keys(PNG)) {
    if (TILE[id]) continue;
    const dir = path.join(APP, 'art', 'kit', id);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      const m = f.match(/^(\d+)\.svg$/);
      if (m && fs.existsSync(path.join(dir, m[1] + '.png'))) out.push('art/kit/' + id + '/' + f);
    }
  }
  return out.sort();
}
module.exports = { list };

if (require.main === module) {
  const l = list();
  if (process.argv.includes('--sum')) {
    const b = l.reduce((a, p) => a + fs.statSync(path.join(APP, p)).size, 0);
    console.log(l.length + ' files, ' + (b / 1e6).toFixed(1) + ' MB left off the live site');
  } else process.stdout.write(l.join('\n') + (l.length ? '\n' : ''));
}
