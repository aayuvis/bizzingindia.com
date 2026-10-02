/* The deploy never rolls back somebody else's deploy — tools/live-guard.sh, proven.
 *
 * On 2 October a deploy from this branch put 142 live files back a version, because the
 * family shell had gone live from another branch that this one did not contain. The gate
 * was open and the deploy reported success. live-guard.sh now reads the `Deployed-From:`
 * line deploy.sh writes into every gh-pages commit and refuses unless HEAD contains it.
 *
 * This builds a throwaway remote and two "sessions" in a temp directory — it never touches
 * this repository's remote — and plays the real sequence:
 *
 *   ours-after-theirs   theirs is live, ours does not contain it      -> REFUSED, names it
 *   merged              ours merges theirs, deploys                   -> allowed
 *   ancestor            ours is live, ours moves on                   -> allowed
 *   unseen              live source only on a branch we never fetched -> found, judged, REFUSED
 *   replace             DEPLOY_REPLACE=<that exact sha>               -> allowed
 *   replace-other       DEPLOY_REPLACE=<some other sha>               -> still REFUSED
 *   legacy              the live deploy has no Deployed-From line     -> allowed, says so
 *
 *   node tools/check-deploy.js
 */
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const GUARD = path.join(__dirname, 'live-guard.sh');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bz-deploy-'));
const env = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't',
  GIT_COMMITTER_EMAIL: 't@t', GIT_CONFIG_NOSYSTEM: '1', HOME: tmp };
delete env.GIT_INDEX_FILE; delete env.GIT_DIR; delete env.GIT_WORK_TREE;
const sh = (cwd, cmd) => execSync(cmd, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

/* a "session": a clone with the guard in tools/, a branch, and app/ to publish */
function session(name, branch) {
  const dir = path.join(tmp, name);
  sh(tmp, `git clone -q remote.git ${name}`);
  sh(dir, `git checkout -q -B ${branch} origin/main`);
  fs.mkdirSync(path.join(dir, 'tools'), { recursive: true });
  return dir;
}
function commit(dir, file, text, msg) {
  fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
  fs.writeFileSync(path.join(dir, file), text);
  sh(dir, `git add -A && git commit -q -m "${msg}"`);
  return sh(dir, 'git rev-parse HEAD');
}
/* what deploy.sh does to gh-pages, minus the tree-building: a commit carrying the line */
function publish(dir, withLine = true) {
  sh(dir, 'git fetch -q origin gh-pages || true');
  const head = sh(dir, 'git rev-parse HEAD'), branch = sh(dir, 'git rev-parse --abbrev-ref HEAD');
  sh(dir, `git push -q origin ${branch}`);   /* a session pushes what it deploys */
  const tree = sh(dir, 'git rev-parse HEAD:app');
  const parent = spawnSync('git', ['rev-parse', '--verify', '-q', 'origin/gh-pages'], { cwd: dir, env }).stdout.toString().trim();
  const msg = withLine ? `-m "Deploy" -m "Deployed-From: ${head} (${branch})"` : '-m "Deploy"';
  const c = sh(dir, `git commit-tree ${tree} ${parent ? '-p ' + parent : ''} ${msg}`);
  sh(dir, `git push -q origin ${c}:refs/heads/gh-pages`);
}
function guard(dir, extra = {}) {
  fs.copyFileSync(GUARD, path.join(dir, 'tools', 'live-guard.sh'));
  sh(dir, 'git fetch -q origin gh-pages || true');
  const r = spawnSync('bash', ['tools/live-guard.sh'], { cwd: dir, env: { ...env, ...extra } });
  return { ok: r.status === 0, out: (r.stdout.toString() + r.stderr.toString()).trim() };
}

const results = [];
const expect = (id, got, wantOk, also) => {
  const pass = got.ok === wantOk && (!also || also.test(got.out));
  results.push({ id, pass, got });
};

try {
  sh(tmp, 'git init -q --bare remote.git');
  const seed = path.join(tmp, 'seed');
  sh(tmp, 'git clone -q remote.git seed');
  sh(seed, 'git checkout -q -b main');
  commit(seed, 'app/index.html', 'v1', 'seed');
  sh(seed, 'git push -q origin main');

  const ours = session('ours', 'claude/ours');
  const theirs = session('theirs', 'claude/theirs');

  /* theirs ships the family shell; ours, without it, tries to ship a phone layout */
  const shellSha = commit(theirs, 'app/shell.js', 'family shell', 'Shell');
  sh(theirs, 'git push -q origin claude/theirs');
  publish(theirs);
  commit(ours, 'app/sabhyata.js', 'phone', 'Phone');
  expect('ours-after-theirs', guard(ours), false, new RegExp(shellSha.slice(0, 7)));

  /* merged, ours may go */
  sh(ours, 'git fetch -q origin claude/theirs && git merge -q --no-edit origin/claude/theirs');
  expect('merged', guard(ours), true);
  publish(ours);

  /* ours moves on from its own live deploy */
  commit(ours, 'app/sabhyata.js', 'phone 2', 'Phone 2');
  expect('ancestor', guard(ours), true);
  publish(ours);

  /* theirs deploys again from a commit ours has never fetched */
  sh(theirs, 'git fetch -q origin claude/ours && git merge -q --no-edit origin/claude/ours');
  const later = commit(theirs, 'app/shell.js', 'family shell 2', 'Shell 2');
  sh(theirs, 'git push -q origin claude/theirs');
  publish(theirs);
  sh(ours, 'git update-ref -d refs/remotes/origin/claude/theirs || true');
  expect('unseen', guard(ours), false, new RegExp(later.slice(0, 7)));

  /* replacing on purpose is one named commit, never a general bypass */
  expect('replace', guard(ours, { DEPLOY_REPLACE: later }), true);
  expect('replace-other', guard(ours, { DEPLOY_REPLACE: shellSha }), false);

  /* a live deploy from before the line existed cannot be checked, and says so */
  const legacy = session('legacy', 'claude/legacy');
  sh(legacy, `git fetch -q origin claude/theirs && git reset -q --hard origin/claude/theirs`);
  publish(legacy, false);
  expect('legacy', guard(ours), true, /does not say what it was built from/);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

let fail = 0;
for (const r of results) {
  console.log(`  ${r.pass ? 'ok  ' : 'FAIL'} ${r.id.padEnd(18)} ${r.got.ok ? 'allowed' : 'refused'}`);
  if (!r.pass) { fail++; console.log('       ' + r.got.out.split('\n').join('\n       ')); }
}
if (results.length !== 7) { console.log(`  FAIL expected 7 scenarios, ran ${results.length}`); fail++; }
console.log(`\n${results.length - fail} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
