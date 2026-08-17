#!/usr/bin/env node
/* studio.js — the recording booth for the Hindi dialogues.
 *
 *   node tools/gen-voice-script.js     # once, or after editing the dialogues
 *   node tools/studio.js               # then open http://localhost:8123
 *
 * Record a line in a male and a female voice, listen back, re-take anything you
 * don't like, and press Send. Send writes the takes into app/voice/hi/ and makes
 * one git commit. Nothing leaves the machine — this is a local server, there is
 * no upload, no account and no cloud step, which for a child-facing voice corpus
 * is the only arrangement worth having.
 *
 * ZERO DEPENDENCIES on purpose. Whoever records these is a Hindi speaker, not
 * necessarily a developer, and `npm install` failing on their laptop is exactly
 * the thing that stops a recording session before it starts. Node alone is enough.
 *
 * FORMAT — and why the source file IS the shipped file.
 * MediaRecorder gives Opus in a WebM container natively in Chrome, Edge and
 * Firefox. At 24 kbps mono, speech is transparent and a two-second line lands
 * around 6 kB — roughly half the size of the 32 kbps MP3s the TTS pipeline
 * produced, at better quality. There is no transcode step here because there is
 * nothing to gain from one: re-encoding lossy audio to another lossy format only
 * loses. What comes out of the microphone is what ships.
 *
 * The one caveat, recorded honestly rather than hidden: Safari's MediaRecorder
 * produces AAC in MP4 instead, and Safari before iOS 17.4 cannot PLAY Opus in
 * WebM. The studio saves whatever the recording browser natively produces, with
 * the matching extension, and the app falls back to the synthesised clip when a
 * file will not play. Record in Chrome for the smallest files. If an MP3 tier is
 * ever needed for old iPads, it is a one-line ffmpeg pass over the finished
 * corpus and belongs at that point, not in the middle of a recording session.
 */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const STUDIO = path.join(__dirname, 'studio');
const VOICE = path.join(ROOT, 'app', 'voice');
const PORT = Number(process.env.PORT || 8123);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

/* A key looks like hi/d-07-p and becomes app/voice/hi/d-07-p-f.webm.
   Validated hard: this writes files from a network request, and a key with a
   slash or a dot in the wrong place is a path-traversal waiting to happen. */
function safePath(key, voice, ext) {
  if (!/^[a-z]{2}\/[a-z]-[0-9]{2}-(p|r|x[1-3])$/.test(key)) return null;
  if (!/^[fm]$/.test(voice)) return null;
  if (!/^[a-z0-9]{2,5}$/.test(ext)) return null;
  const [pack, name] = key.split('/');
  return path.join(VOICE, pack, `${name}-${voice}.${ext}`);
}

function extFor(mime) {
  if (!mime) return 'webm';
  if (mime.indexOf('webm') >= 0) return 'webm';
  if (mime.indexOf('ogg') >= 0) return 'ogg';
  if (mime.indexOf('mp4') >= 0) return 'm4a';
  if (mime.indexOf('mpeg') >= 0) return 'mp3';
  return 'webm';
}

function send(res, code, body, type) {
  res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let n = 0;
    req.on('data', c => {
      n += c.length;
      if (n > limit) { reject(new Error('too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/* what is already on disk, so the studio can show progress and pick up where a
   previous session stopped rather than starting from line one every time */
function existing() {
  const out = {};
  const dir = path.join(VOICE, 'hi');
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const m = /^(d-[0-9]{2}-(?:p|r|x[1-3]))-([fm])\.([a-z0-9]+)$/.exec(f);
    if (!m) continue;
    const key = 'hi/' + m[1];
    (out[key] = out[key] || {})[m[2]] = { ext: m[3], bytes: fs.statSync(path.join(dir, f)).size };
  }
  return out;
}

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    const p = path.join(STUDIO, 'index.html');
    if (!fs.existsSync(p)) return send(res, 500, 'studio/index.html is missing', 'text/plain');
    return send(res, 200, fs.readFileSync(p), TYPES['.html']);
  }

  if (req.method === 'GET' && url.pathname === '/script.json') {
    const p = path.join(STUDIO, 'script.json');
    if (!fs.existsSync(p)) {
      return send(res, 500, { error: 'run: node tools/gen-voice-script.js' });
    }
    return send(res, 200, fs.readFileSync(p), TYPES['.json']);
  }

  if (req.method === 'GET' && url.pathname === '/done') {
    return send(res, 200, existing());
  }

  /* Play a take back. The recordist has to be able to HEAR what they just did —
     a booth you cannot listen back in is a booth that ships a cough. Serves only
     from app/voice and only for a key that passes the same validation as a write. */
  if (req.method === 'GET' && url.pathname === '/audio') {
    const file = safePath(url.searchParams.get('key'), url.searchParams.get('voice'),
                          url.searchParams.get('ext') || 'webm');
    if (!file || !fs.existsSync(file)) return send(res, 404, { error: 'no take' });
    const ext = path.extname(file).slice(1);
    const mime = ext === 'webm' ? 'audio/webm' : ext === 'ogg' ? 'audio/ogg'
               : ext === 'm4a' ? 'audio/mp4' : 'audio/mpeg';
    res.writeHead(200, { 'Content-Type': mime, 'Content-Length': fs.statSync(file).size });
    return fs.createReadStream(file).pipe(res);
  }

  /* one take. Sent as raw audio with the key and voice in the query, because a
     multipart parser is a dependency and this needs none. */
  if (req.method === 'POST' && url.pathname === '/take') {
    const key = url.searchParams.get('key');
    const voice = url.searchParams.get('voice');
    const ext = extFor(url.searchParams.get('mime') || req.headers['content-type']);
    const file = safePath(key, voice, ext);
    if (!file) return send(res, 400, { error: 'bad key or voice: ' + key + ' / ' + voice });
    let buf;
    try { buf = await readBody(req, 8 * 1024 * 1024); }
    catch (e) { return send(res, 413, { error: 'take too large' }); }
    if (!buf.length) return send(res, 400, { error: 'empty take' });
    fs.mkdirSync(path.dirname(file), { recursive: true });
    /* a re-take replaces the old one; keeping both would need a chooser and the
       chooser is the studio's own re-record button */
    for (const other of ['webm', 'ogg', 'm4a', 'mp3']) {
      const stale = safePath(key, voice, other);
      if (stale && stale !== file && fs.existsSync(stale)) fs.unlinkSync(stale);
    }
    fs.writeFileSync(file, buf);
    return send(res, 200, { ok: true, file: path.relative(ROOT, file), bytes: buf.length });
  }

  /* Send: rebuild the manifest so the app can find the new clips, then commit. */
  if (req.method === 'POST' && url.pathname === '/commit') {
    try {
      let manifestNote = '';
      const gen = path.join(__dirname, 'gen-voice-manifest.js');
      if (fs.existsSync(gen)) {
        manifestNote = execFileSync(process.execPath, [gen], { cwd: ROOT, encoding: 'utf8' }).trim();
      }
      const done = existing();
      const takes = Object.keys(done).reduce((n, k) => n + Object.keys(done[k]).length, 0);
      const bytes = Object.keys(done).reduce(
        (n, k) => n + Object.keys(done[k]).reduce((m, v) => m + done[k][v].bytes, 0), 0);

      git(['add', 'app/voice/hi', 'app/voice-manifest.js']);
      const staged = git(['diff', '--cached', '--name-only']);
      if (!staged) return send(res, 200, { ok: true, nothing: true, takes: takes });

      const msg =
        'Hindi dialogue voice: ' + takes + ' human takes\n\n' +
        'Recorded in tools/studio.js, straight to Opus from the microphone — no\n' +
        'transcode, because re-encoding lossy audio to another lossy format only\n' +
        'loses. ' + Math.round(bytes / 1024) + ' kB for ' + takes + ' takes.\n\n' +
        (manifestNote ? manifestNote + '\n\n' : '') +
        'Co-Authored-By: Claude <noreply@anthropic.com>\n';
      git(['commit', '-m', msg]);
      return send(res, 200, {
        ok: true, takes: takes, bytes: bytes,
        commit: git(['rev-parse', '--short', 'HEAD']),
        files: staged.split('\n').length
      });
    } catch (e) {
      return send(res, 500, { error: String(e.message || e) });
    }
  }

  send(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  const done = existing();
  const takes = Object.keys(done).reduce((n, k) => n + Object.keys(done[k]).length, 0);
  console.log('');
  console.log('  Bizzing India — Hindi dialogue recording booth');
  console.log('  open   http://localhost:' + PORT);
  console.log('  saving to app/voice/hi/   (' + takes + ' takes already recorded)');
  console.log('  Chrome or Edge gives the smallest files. Ctrl-C to stop.');
  console.log('');
});
