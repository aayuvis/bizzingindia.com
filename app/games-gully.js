/* Bizzing India — THE MELA, gully shelf: the two games played in the street.
 *
 *   kancha  · Kancha / goti / lakhoti — marbles. Knuckle down, aim, flick, and knock
 *             the other marbles out of the ring. Played in every gully in India and
 *             most of the world; the Indian name and the ring version are what a child
 *             here would recognise.
 *   patang  · Patang — the kite duel of Makar Sankranti and Basant. You let line out to
 *             climb, dip to pick up speed, and cross the rival's line to cut it. The
 *             manja is NEVER the sharp kind — this is a paper-and-thread duel, and the
 *             game says so on its own intro card, because the real thing hurts birds
 *             and people and children should hear that from us first.
 *
 * Contract, identical to games.js and honoured exactly:
 *   entry = { id, name, blurb, icon, minutes, engine(host, opts, done) }
 *   engine fills host, calls done({win, score, sikke}) once, returns a teardown.
 *
 * HOUSE RULES, all of them:
 *   · EVERY game plays fully with KEYBOARD and with TOUCH. Both games here are one
 *     control (aim/power, or hold-to-climb), so both map cleanly to keys and to a
 *     finger, and the on-screen hint names both.
 *   · No lives, no hearts, no shaming. A missed shot is another shot.
 *   · prefers-reduced-motion: the loop still runs (it is the game), but the decorative
 *     drift and the celebration stills.
 *   · No token that does not exist. This file uses --card, --card2, --ground, --text,
 *     --text2, --muted, --accent, --accent2, --accent3, --line — every one of which is
 *     really declared in tokens.css. (The first arcade build shipped with --surface and
 *     --bg2 and painted itself transparent; the game covers in app.css had the same bug
 *     until this pass. Once is a mistake, twice is a habit, so: check the token.)
 */
(function () {
  'use strict';
  var W = window;

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function calm() {
    try {
      return document.documentElement.getAttribute('data-calm') === '1' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) { return false; }
  }

  /* one stylesheet for both, injected once */
  function css() {
    if (document.getElementById('gully-css')) return;
    var s = el('style'); s.id = 'gully-css';
    s.textContent =
      '.gy-wrap{display:grid;gap:12px;justify-items:center}' +
      '.gy-stage{width:100%;max-width:920px;background:var(--card2);border:1px solid var(--line);' +
        'border-radius:18px;overflow:hidden;touch-action:none;display:block}' +
      '.gy-hold{position:relative;width:100%;max-width:920px;display:grid;justify-items:center}' +
      '.gy-cover[hidden]{display:none}' +
      '.gy-cover{position:absolute;top:0;right:0;bottom:0;left:0;display:grid;place-items:center;padding:14px;' +
        'background:rgba(26,15,5,.45);border-radius:18px;z-index:4}' +
      '.gy-card{background:var(--card);border:1px solid var(--line);border-radius:18px;' +
        'padding:18px 20px;max-width:430px;display:grid;gap:10px;justify-items:center;text-align:center;' +
        'box-shadow:0 18px 50px rgba(20,10,40,.35)}' +
      '.gy-card h3{margin:0;font:800 22px/1.2 var(--display,var(--body))}' +
      '.gy-card p{margin:0;font:600 13.5px/1.55 var(--body);color:var(--text2)}' +
      '.gy-card ol{margin:0;padding-left:20px;text-align:left;font:600 13px/1.7 var(--body);color:var(--text)}' +
      '.gy-steprow{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}' +
      '.gy-step{font:700 12px/1 var(--body);color:var(--muted);background:var(--card);' +
        'border:1px solid var(--line);padding:7px 11px;border-radius:999px;opacity:.75}' +
      '.gy-step.on{color:#fff;background:var(--good,#1fa971);border-color:transparent;opacity:1}' +
      '.gy-hud{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;align-items:center}' +
      '.gy-pill{font:700 13px/1 var(--body);background:var(--card);border:1px solid var(--line);' +
        'color:var(--text);padding:8px 12px;border-radius:999px}' +
      '.gy-hint{font:600 12.5px/1.5 var(--body);color:var(--muted);text-align:center;max-width:460px}' +
      '.gy-btn{font:800 15px/1 var(--body);background:var(--accent);color:#fff;border:0;' +
        'padding:12px 18px;border-radius:999px;cursor:pointer}' +
      '.gy-btn.ghost{background:var(--card);color:var(--text);border:1px solid var(--line)}';
    document.head.appendChild(s);
  }

  /* ====================================================================== KANCHA
     A ring scratched in the dust, glass kancha glinting inside it, your big
     striker on the line. Three rounds, each a real challenge: the wide ring,
     the tight ring, then the raja kancha. Grab, slide, pull back, flick. */
  function kancha(host, opts, done) {
    css();
    var Wd = 860, Ht = 560, CX = 430, CY = 236, LINE_Y = 470;
    var COLS = ['#3b6fd4', '#2f8f5b', '#e8b21c', '#8b5cf6', '#0fa8a0', '#d977ae', '#d84a3f'];
    var ROUNDS = [
      { name: 'Pehla Ghera', brief: 'Knock <b>3</b> kancha out of the wide ring in <b>7</b> flicks.',
        R: 172, n: 5, shots: 7, need: 3 },
      { name: 'Chhota Ghera', brief: 'The ring shrinks and a sixth kancha joins. <b>4</b> out in <b>6</b> flicks.',
        R: 130, n: 6, shots: 6, need: 4 },
      { name: 'Raja Kancha', brief: 'The big red <b>raja counts as 2</b>. Score <b>5</b> in <b>6</b> flicks.',
        R: 152, n: 5, shots: 6, need: 5, raja: true }
    ];
    var round = 0, R = ROUNDS[0].R;
    var over = false, shots = 0, potted = 0, score = 0, cleared = 0, phase = 'cover';
    var angle = -Math.PI / 2, power = 0.55;
    var raf = null, keyed = null, timers = [];
    var didSlide = false, didPull = false, shotsTaken = 0, fx = [];
    var marbles = [];
    var striker = { x: CX, y: LINE_Y, vx: 0, vy: 0, r: 19, c: '#f6f3ea' };
    var PEBS = [[86, 92, 7], [790, 120, 6], [120, 502, 5], [762, 500, 8],
                [58, 320, 5], [812, 300, 6], [210, 58, 5], [680, 52, 7]];

    var wrap = el('div', 'gy-wrap');
    var hud = el('div', 'gy-hud',
      '<span class="gy-pill">Round <b id="gyR">1</b> of 3</span>' +
      '<span class="gy-pill">Shots left <b id="gyS">7</b></span>' +
      '<span class="gy-pill">Out <b id="gyP">0</b> / <span id="gyN">3</span></span>');
    var hold = el('div', 'gy-hold');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + Ht);
    svg.setAttribute('class', 'gy-stage');
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', 'Kancha — aim and flick your marble');
    svg.setAttribute('tabindex', '0');
    var cover = el('div', 'gy-cover'); cover.hidden = true;
    hold.appendChild(svg); hold.appendChild(cover);
    var steps = el('div', 'gy-steprow',
      '<span class="gy-step" id="kq1">1 · grab &amp; slide along the line</span>' +
      '<span class="gy-step" id="kq2">2 · pull back to aim</span>' +
      '<span class="gy-step" id="kq3">3 · let go — flick!</span>');
    var hint = el('div', 'gy-hint',
      'Keys work too: <b>← →</b> aim · <b>↑ ↓</b> power · <b>Space</b> flicks.');
    wrap.appendChild(hud); wrap.appendChild(hold); wrap.appendChild(steps); wrap.appendChild(hint);
    host.innerHTML = ''; host.appendChild(wrap);

    function stepLight() {
      var a1 = document.getElementById('kq1'), a2 = document.getElementById('kq2'),
          a3 = document.getElementById('kq3');
      if (a1 && didSlide) a1.className = 'gy-step on';
      if (a2 && didPull) a2.className = 'gy-step on';
      if (a3 && shotsTaken > 0) a3.className = 'gy-step on';
    }
    function hudUp() {
      document.getElementById('gyR').textContent = round + 1;
      document.getElementById('gyS').textContent = shots;
      document.getElementById('gyP').textContent = potted;
      document.getElementById('gyN').textContent = ROUNDS[round].need;
    }
    function showCover(title, body, btn, go) {
      cover.innerHTML = '<div class="gy-card"><h3>' + title + '</h3>' + body +
        '<button type="button" class="gy-btn" data-go="' + go + '">' + btn + '</button></div>';
      cover.hidden = false;
      var b2 = cover.querySelector('.gy-btn');
      timers.push(setTimeout(function () { try { b2.focus({ preventScroll: true }); } catch (e) {} }, 60));
    }
    function seedRound() {
      var cfg = ROUNDS[round];
      R = cfg.R; shots = cfg.shots; potted = 0;
      marbles = [];
      for (var i = 0; i < cfg.n; i++) {
        var a = (i / cfg.n) * Math.PI * 2 + round * 0.8;
        var d = cfg.raja ? 62 + (i % 2) * 30 : 30 + (i % 3) * (cfg.R > 150 ? 30 : 20);
        marbles.push({ x: CX + Math.cos(a) * d, y: CY + Math.sin(a) * d * 0.9,
          vx: 0, vy: 0, r: 15, gi: i % 6, out: false });
      }
      if (cfg.raja) marbles.push({ x: CX, y: CY, vx: 0, vy: 0, r: 23, gi: 6, raja: true, out: false });
      striker.x = CX; striker.y = LINE_Y; striker.vx = 0; striker.vy = 0;
      angle = -Math.PI / 2; power = 0.55; fx = [];
      hudUp();
    }

    function defs() {
      var s2 = '<defs><radialGradient id="kdust" cx="50%" cy="40%" r="80%">' +
        '<stop offset="0%" stop-color="#ecd9b2"/><stop offset="62%" stop-color="#ddc494"/>' +
        '<stop offset="100%" stop-color="#c5a672"/></radialGradient>';
      for (var i = 0; i < 7; i++) {
        s2 += '<radialGradient id="kg' + i + '" cx="35%" cy="28%" r="85%">' +
          '<stop offset="0%" stop-color="#ffffff" stop-opacity=".95"/>' +
          '<stop offset="30%" stop-color="' + COLS[i] + '" stop-opacity=".55"/>' +
          '<stop offset="100%" stop-color="' + COLS[i] + '"/></radialGradient>';
      }
      s2 += '<radialGradient id="kgs" cx="35%" cy="28%" r="90%">' +
        '<stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#f2ead2"/>' +
        '<stop offset="100%" stop-color="#c9b17c"/></radialGradient></defs>';
      return s2;
    }
    function sparkles() {
      var now = Date.now(), out = '', i, j;
      fx = fx.filter(function (f) { return now - f.t0 < 650; });
      for (i = 0; i < fx.length; i++) {
        var f = fx[i], t = (now - f.t0) / 650, rr = 8 + t * 26, op = (1 - t) * 0.9;
        for (j = 0; j < 6; j++) {
          var a = j * Math.PI / 3 + t * 1.2;
          out += '<line x1="' + (f.x + Math.cos(a) * rr * 0.4).toFixed(1) + '" y1="' + (f.y + Math.sin(a) * rr * 0.4).toFixed(1) +
            '" x2="' + (f.x + Math.cos(a) * rr).toFixed(1) + '" y2="' + (f.y + Math.sin(a) * rr).toFixed(1) +
            '" stroke="#ffd76b" stroke-width="3" stroke-linecap="round" opacity="' + op.toFixed(2) + '"/>';
        }
      }
      return out;
    }
    function marbleArt(x, y, r, gi, raja) {
      var s2 = '<ellipse cx="' + (x + 2).toFixed(1) + '" cy="' + (y + r * 0.72).toFixed(1) +
        '" rx="' + (r * 0.95).toFixed(1) + '" ry="' + (r * 0.34).toFixed(1) + '" fill="#7c5a2b" opacity=".28"/>';
      s2 += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="url(#kg' + gi + ')"/>';
      s2 += '<path d="M' + (x - r * 0.62).toFixed(1) + ' ' + y.toFixed(1) +
        'q' + (r * 0.62).toFixed(1) + ' ' + (-r * 0.95).toFixed(1) + ' ' + (r * 1.24).toFixed(1) + ' 0' +
        'q' + (-r * 0.62).toFixed(1) + ' ' + (r * 0.95).toFixed(1) + ' ' + (-r * 1.24).toFixed(1) + ' 0z" ' +
        'fill="#fff" opacity=".4"/>';
      s2 += '<circle cx="' + (x - r * 0.34).toFixed(1) + '" cy="' + (y - r * 0.38).toFixed(1) +
        '" r="' + (r * 0.2).toFixed(1) + '" fill="#fff" opacity=".9"/>';
      if (raja) {
        s2 += '<path d="M' + (x - 7) + ' ' + (y + 2) + 'l3.5 -6 3.5 6 3.5 -6 3.5 6" fill="none" ' +
          'stroke="#ffe3a1" stroke-width="2.4" stroke-linecap="round" opacity=".95"/>';
      }
      return s2;
    }
    function draw() {
      var s2 = defs(), i;
      s2 += '<rect width="' + Wd + '" height="' + Ht + '" fill="url(#kdust)"/>';
      /* pebbles and two dry leaves at the edges */
      for (i = 0; i < PEBS.length; i++) {
        s2 += '<ellipse cx="' + PEBS[i][0] + '" cy="' + PEBS[i][1] + '" rx="' + PEBS[i][2] +
          '" ry="' + (PEBS[i][2] * 0.75).toFixed(1) + '" fill="#a98f60" opacity=".55"/>';
      }
      s2 += '<path d="M120 150 q14 -18 30 -8 q-4 18 -22 16 q-8 -2 -8 -8z" fill="#a3872f" opacity=".5"/>' +
        '<path d="M742 396 q16 -14 28 -2 q-6 16 -22 12 q-8 -4 -6 -10z" fill="#8f7c2c" opacity=".45"/>';
      /* the ring, scratched twice by a finger */
      s2 += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="#cdae7b" opacity=".85"/>' +
        '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R - 7) + '" fill="#c2a26c" opacity=".5"/>' +
        '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="none" stroke="#6d4c1e" ' +
          'stroke-width="3" stroke-dasharray="9 7" opacity=".7"/>' +
        '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R + 5) + '" fill="none" stroke="#6d4c1e" ' +
          'stroke-width="1.4" stroke-dasharray="4 9" opacity=".4"/>';
      /* the shooting line, and chalk tallies for shots left */
      s2 += '<path d="M60 ' + LINE_Y + 'H' + (Wd - 60) + '" stroke="#6d4c1e" stroke-width="2.5" ' +
        'opacity=".5" stroke-dasharray="5 8"/>';
      for (i = 0; i < shots; i++) {
        s2 += '<line x1="' + (70 + i * 11) + '" y1="' + (LINE_Y + 26) + '" x2="' + (66 + i * 11) +
          '" y2="' + (LINE_Y + 44) + '" stroke="#6d4c1e" stroke-width="2.5" opacity=".55" stroke-linecap="round"/>';
      }
      /* the kancha in the ring */
      for (i = 0; i < marbles.length; i++) {
        var m = marbles[i];
        if (!m.out) s2 += marbleArt(m.x, m.y, m.r, m.gi, m.raja);
      }
      /* your striker */
      s2 += '<ellipse cx="' + (striker.x + 2).toFixed(1) + '" cy="' + (striker.y + 14).toFixed(1) +
        '" rx="18" ry="6.5" fill="#7c5a2b" opacity=".3"/>' +
        '<circle cx="' + striker.x.toFixed(1) + '" cy="' + striker.y.toFixed(1) + '" r="' + striker.r +
        '" fill="url(#kgs)" stroke="#9c8256" stroke-width="1.8"/>' +
        '<circle cx="' + (striker.x - 5).toFixed(1) + '" cy="' + (striker.y - 5).toFixed(1) +
        '" r="3.6" fill="#fff" opacity=".9"/>';
      /* first-time guide: a halo and a whispered instruction by the striker */
      if (phase === 'aim' && !over && shotsTaken === 0) {
        s2 += '<circle cx="' + striker.x.toFixed(1) + '" cy="' + striker.y.toFixed(1) + '" r="' + (striker.r + 9) +
          '" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-dasharray="5 6" opacity=".8"/>' +
          '<text x="' + striker.x.toFixed(1) + '" y="' + (LINE_Y + 44) + '" text-anchor="middle" ' +
          'font-size="15" font-weight="800" fill="#6d4c1e" opacity=".9">grab me — slide, pull back, let go</text>';
      }
      /* the aim line, ghost landing ring and power arc */
      if (phase === 'aim' && !over) {
        var len = 46 + power * 120;
        var tx = striker.x + Math.cos(angle) * len, ty = striker.y + Math.sin(angle) * len;
        s2 += '<path d="M' + striker.x.toFixed(1) + ' ' + striker.y.toFixed(1) + 'L' + tx.toFixed(1) + ' ' + ty.toFixed(1) +
          '" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="2 8" opacity=".9"/>';
        s2 += '<circle cx="' + tx.toFixed(1) + '" cy="' + ty.toFixed(1) + '" r="' + striker.r +
          '" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 5" opacity=".55"/>';
        if (didPull || power > 0.56 || power < 0.54) {
          var mr = striker.r + 8, pa = -Math.PI / 2 + power * Math.PI * 2;
          s2 += '<circle cx="' + striker.x.toFixed(1) + '" cy="' + striker.y.toFixed(1) + '" r="' + mr +
            '" fill="none" stroke="#6d4c1e" stroke-width="3" opacity=".25"/>';
          s2 += '<path d="M' + striker.x.toFixed(1) + ' ' + (striker.y - mr).toFixed(1) +
            ' A' + mr + ' ' + mr + ' 0 ' + (power > 0.5 ? 1 : 0) + ' 1 ' +
            (striker.x + Math.cos(pa) * mr).toFixed(1) + ' ' + (striker.y + Math.sin(pa) * mr).toFixed(1) +
            '" fill="none" stroke="' + (power < 0.45 ? 'var(--good, #1fa971)' : power < 0.8 ? 'var(--accent2)' : 'var(--accent3)') +
            '" stroke-width="4" stroke-linecap="round"/>';
        }
      }
      s2 += sparkles();
      svg.innerHTML = s2;
    }

    function step() {
      var moving = false;
      var all = marbles.concat([striker]);
      all.forEach(function (m) {
        if (m.out) return;
        m.x += m.vx; m.y += m.vy;
        m.vx *= 0.978; m.vy *= 0.978;
        if (Math.abs(m.vx) + Math.abs(m.vy) > 0.12) moving = true; else { m.vx = 0; m.vy = 0; }
      });
      for (var i = 0; i < all.length; i++) {
        for (var j = i + 1; j < all.length; j++) {
          var a = all[i], b = all[j];
          if (a.out || b.out) continue;
          var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
          var min = a.r + b.r;
          if (d < min) {
            var nx = dx / d, ny = dy / d, push = (min - d) / 2;
            a.x -= nx * push; a.y -= ny * push; b.x += nx * push; b.y += ny * push;
            var p2 = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
            if (p2 > 0) { a.vx -= p2 * nx; a.vy -= p2 * ny; b.vx += p2 * nx; b.vy += p2 * ny; }
          }
        }
      }
      /* out of the ring is won — the raja counts double */
      marbles.forEach(function (m) {
        if (m.out) return;
        var dd = Math.sqrt((m.x - CX) * (m.x - CX) + (m.y - CY) * (m.y - CY));
        if (dd > R + m.r) {
          m.out = true;
          var val = m.raja ? 2 : 1;
          potted += val; score += val * 10;
          fx.push({ x: m.x, y: m.y, t0: Date.now() });
          hudUp();
        }
      });
      if (striker.x < striker.r) { striker.x = striker.r; striker.vx *= -0.6; }
      if (striker.x > Wd - striker.r) { striker.x = Wd - striker.r; striker.vx *= -0.6; }
      if (striker.y < striker.r) { striker.y = striker.r; striker.vy *= -0.6; }
      if (striker.y > Ht - striker.r) { striker.y = Ht - striker.r; striker.vy *= -0.6; }

      draw();
      if (moving) { raf = requestAnimationFrame(step); return; }
      /* the shot has come to rest */
      striker.y = LINE_Y; striker.vx = 0; striker.vy = 0;
      striker.x = Math.max(60, Math.min(Wd - 60, striker.x));
      var need = ROUNDS[round].need;
      if (potted >= need) { cleared++; return roundEnd(true); }
      if (shots <= 0) return roundEnd(false);
      phase = 'aim';
      draw();
    }

    function flick() {
      if (phase !== 'aim' || over) return;
      phase = 'fly';
      shots--; shotsTaken++;
      stepLight(); hudUp();
      var v = 4 + power * 13;
      striker.vx = Math.cos(angle) * v; striker.vy = Math.sin(angle) * v;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    }

    function roundEnd(ok) {
      phase = 'cover';
      if (round >= 2) return finish();
      var nxt = ROUNDS[round + 1];
      showCover(ok ? 'Ghera saaf! ⭐' : 'Round over',
        '<p>' + (ok ? 'You knocked ' + potted + ' out — the round is yours.'
                    : 'Only ' + potted + ' out this time — on to the next ring.') + '</p>' +
        '<p><b>Round ' + (round + 2) + ' · ' + nxt.name + '</b><br>' + nxt.brief + '</p>',
        'Next round', 'round');
    }
    function finish() {
      if (over) return;
      over = true; phase = 'cover';
      var win = cleared >= 2;
      var starRow = '⭐'.repeat(Math.max(1, cleared)) + '☆'.repeat(3 - Math.max(1, cleared));
      showCover(win ? 'Kancha jeet!' : 'Good flicking',
        '<p>' + cleared + ' of 3 rounds won · ' + score + ' points</p>' +
        '<p style="font-size:22px;letter-spacing:4px">' + starRow + '</p>',
        'Done', 'out');
    }

    keyed = function (e) {
      if (over && phase !== 'cover') return;
      if (phase === 'cover') return;   /* the cover button owns the keys */
      var k = e.key;
      if (k === 'ArrowLeft') { angle -= 0.09; draw(); e.preventDefault(); }
      else if (k === 'ArrowRight') { angle += 0.09; draw(); e.preventDefault(); }
      else if (k === 'ArrowUp') { power = Math.min(1, power + 0.07); draw(); e.preventDefault(); }
      else if (k === 'ArrowDown') { power = Math.max(0.1, power - 0.07); draw(); e.preventDefault(); }
      else if (k === ' ' || k === 'Enter') { flick(); e.preventDefault(); }
    };
    document.addEventListener('keydown', keyed);

    /* touch, the carrom way: grab the striker to slide it; pull back past the
       line and the grab becomes the sling; a tiny pull cancels; a drag that
       starts away from the striker does nothing at all */
    var dragging = null;
    function pt(e) {
      var r = svg.getBoundingClientRect();
      var t = (e.touches && e.touches[0]) || e;
      return { x: (t.clientX - r.left) / r.width * Wd, y: (t.clientY - r.top) / r.height * Ht };
    }
    function dstart(e) {
      if (over || phase !== 'aim') return;
      var q = pt(e);
      var dx = q.x - striker.x, dy = q.y - striker.y;
      if (dx * dx + dy * dy < 44 * 44) { dragging = { mode: 'stick' }; }
      if (e.cancelable) e.preventDefault();
    }
    function dmove(e) {
      if (!dragging || over || phase !== 'aim') return;
      var q = pt(e);
      if (dragging.mode === 'stick') {
        if (q.y - LINE_Y > 26) { dragging = { mode: 'sling' }; didPull = true; stepLight(); }
        else {
          striker.x = Math.max(60, Math.min(Wd - 60, q.x));
          didSlide = true; stepLight(); draw(); return;
        }
      }
      var dx = striker.x - q.x, dy = striker.y - q.y;
      angle = Math.atan2(dy, dx);
      power = Math.max(0.1, Math.min(1, Math.sqrt(dx * dx + dy * dy) / 170));
      dragging.armed = Math.sqrt(dx * dx + dy * dy) > 24;
      draw();
      if (e.cancelable) e.preventDefault();
    }
    function dend() {
      if (!dragging) return;
      var was = dragging; dragging = null;
      if (was.mode === 'sling' && was.armed) flick();
      else draw();
    }
    svg.addEventListener('pointerdown', dstart);
    svg.addEventListener('pointermove', dmove);
    svg.addEventListener('pointerup', dend);
    svg.addEventListener('pointercancel', dend);

    wrap.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-go]') : null;
      if (!t) return;
      var what = t.getAttribute('data-go');
      if (what === 'start') { cover.hidden = true; phase = 'aim'; draw(); try { svg.focus({ preventScroll: true }); } catch (err) {} }
      else if (what === 'round') { round++; seedRound(); cover.hidden = true; phase = 'aim'; draw(); try { svg.focus({ preventScroll: true }); } catch (err) {} }
      else if (what === 'out') { done({ win: cleared >= 2, score: score, sikke: 4 + cleared * 4 }); }
    });

    seedRound();
    draw();
    showCover('Kancha',
      '<p>The gully marble game — win the ring, round by round.</p>' +
      '<ol><li><b>Grab</b> your big marble on the line and slide it left–right.</li>' +
      '<li><b>Pull back</b> past the line — the aim line appears.</li>' +
      '<li><b>Let go</b> to flick. Anything knocked out of the ring is yours!</li></ol>' +
      '<p><b>Round 1 · ' + ROUNDS[0].name + '</b><br>' + ROUNDS[0].brief + '</p>',
      'Shuru — play!', 'start');

    function teardown() {
      over = true;
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.removeEventListener('keydown', keyed);
    }
    teardown.destroy = teardown;
    return teardown;
  }

  /* ====================================================================== PATANG
     Two kites on one sky. Hold to let line out and climb, let go to dip. Cross the
     rival's line above it and you cut it — cross below and you lose the round.
     Best of three. */
  function patang(host, opts, done) {
    css();
    var Wd = 560, Ht = 380;
    var over = false, raf = null, keyed = null;
    var round = 1, mine = 0, theirs = 0;
    var me = { x: 150, y: 200, v: 0 }, foe = { x: 410, y: 200, v: 0, t: 0 };
    var holding = false, msg = '';

    var wrap = el('div', 'gy-wrap');
    var hud = el('div', 'gy-hud',
      '<span class="gy-pill">Round <b id="pgR">1</b> of 3</span>' +
      '<span class="gy-pill">You <b id="pgM">0</b> · Them <b id="pgT">0</b></span>');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + Ht);
    svg.setAttribute('class', 'gy-stage');
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', 'Patang — hold to climb, release to dip');
    svg.setAttribute('tabindex', '0');
    var hint = el('div', 'gy-hint',
      '<b>Keys:</b> hold <b>Space</b> (or ↑) to let line out and climb — let go to dip. ' +
      '<b>Finger:</b> press and hold anywhere on the sky. Cross their line from ABOVE to cut it.' +
      '<br><span style="opacity:.8">Real manja is never the sharp kind — this is paper and thread. ' +
      'The glass-coated sort cuts birds and people, and it is banned in many cities.</span>');
    wrap.appendChild(hud); wrap.appendChild(svg); wrap.appendChild(hint);
    host.innerHTML = ''; host.appendChild(wrap);

    function kite(k, colA, colB, flip) {
      var s = '';
      var sx = flip ? Wd - 30 : 30, sy = Ht - 14;
      /* the line, bowing the way a kite string does */
      s += '<path d="M' + sx + ' ' + sy + 'Q' + ((sx + k.x) / 2) + ' ' + ((sy + k.y) / 2 + 40) + ' ' +
        k.x.toFixed(1) + ' ' + k.y.toFixed(1) + '" fill="none" stroke="var(--text2)" stroke-width="1.4" opacity=".6"/>';
      /* the patang: two triangles, a spine, a spar and a tail */
      s += '<g transform="translate(' + k.x.toFixed(1) + ' ' + k.y.toFixed(1) + ') rotate(' +
        (k.v * 2.2).toFixed(1) + ')">' +
        '<path d="M0 -20L16 4L0 22L-16 4Z" fill="' + colA + '"/>' +
        '<path d="M0 -20L16 4L0 4Z" fill="' + colB + '"/>' +
        '<path d="M0 -20L0 22M-16 4H16" stroke="rgba(0,0,0,.35)" stroke-width="1.2"/>' +
        '<path d="M0 22q8 12 -4 20t2 16" fill="none" stroke="' + colB + '" stroke-width="2"/>' +
        '</g>';
      return s;
    }

    function draw() {
      var s = '<rect width="' + Wd + '" height="' + Ht + '" fill="var(--card2)"/>';
      /* a few kites far away, and the rooftops below */
      s += '<g opacity=".2">' +
        '<path d="M90 60L98 72L90 84L82 72Z" fill="var(--accent)"/>' +
        '<path d="M470 40L478 52L470 64L462 52Z" fill="var(--accent3)"/>' +
        '<path d="M300 96L306 105L300 114L294 105Z" fill="var(--accent2)"/></g>';
      s += '<path d="M0 ' + (Ht - 26) + 'h' + Wd + 'v26H0z" fill="var(--text2)" opacity=".18"/>';
      s += '<g opacity=".3">' + [40, 120, 210, 330, 450].map(function (x) {
        return '<rect x="' + x + '" y="' + (Ht - 52) + '" width="46" height="26" fill="var(--text2)"/>';
      }).join('') + '</g>';
      s += kite(foe, 'var(--accent3)', 'var(--accent2)', true);
      s += kite(me, 'var(--accent)', 'var(--accent2)', false);
      if (msg) {
        s += '<rect width="' + Wd + '" height="' + Ht + '" fill="rgba(20,12,40,.5)"/>' +
          '<text x="' + (Wd / 2) + '" y="' + (Ht / 2) + '" text-anchor="middle" font-size="28" ' +
          'font-weight="800" fill="#fff">' + msg + '</text>';
      }
      svg.innerHTML = s;
    }

    function newRound() {
      me.x = 150; me.y = 220; me.v = 0;
      foe.x = 410; foe.y = 200; foe.v = 0; foe.t = 0;
      msg = '';
      document.getElementById('pgR').textContent = round;
    }

    function step() {
      if (over) return;
      if (!msg) {
        /* mine: holding lets line out and lifts, gravity pulls it down */
        me.v += holding ? -0.34 : 0.26;
        me.v = Math.max(-4.4, Math.min(4.4, me.v));
        me.y += me.v;
        me.x += 0.9;                                   /* the wind carries it across */
        if (me.y < 26) { me.y = 26; me.v = 0; }
        if (me.y > Ht - 60) { me.y = Ht - 60; me.v = 0; }
        /* theirs: a simple flier that climbs and dips on its own rhythm */
        foe.t += 0.03;
        foe.v = Math.sin(foe.t * 1.7) * 3;
        foe.y += foe.v;
        foe.x -= 0.9;
        if (foe.y < 30) foe.y = 30;
        if (foe.y > Ht - 60) foe.y = Ht - 60;

        /* the crossing: close enough in x, and whoever is higher cuts the other */
        if (Math.abs(me.x - foe.x) < 22) {
          if (me.y < foe.y - 6) { mine++; msg = 'Kai po che!'; }
          else if (foe.y < me.y - 6) { theirs++; msg = 'Your line went'; }
          else { me.x -= 40; foe.x += 40; }             /* a graze — both fly on */
          if (msg) {
            document.getElementById('pgM').textContent = mine;
            document.getElementById('pgT').textContent = theirs;
            setTimeout(function () {
              if (over) return;
              if (round >= 3) return finish();
              round++; newRound();
            }, 1100);
          }
        }
        /* nobody met: reset the pass so a round always ends in a crossing */
        if (me.x > Wd - 30 || foe.x < 30) { me.x = 150; foe.x = 410; }
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    function finish() {
      if (over) return;
      over = true;
      var win = mine > theirs;
      msg = win ? 'You held the sky' : 'Well flown';
      draw();
      setTimeout(function () {
        done({ win: win, score: mine * 20, sikke: 4 + mine * 4 });
      }, 900);
    }

    keyed = function (e) {
      if (over) return;
      if (e.key === ' ' || e.key === 'ArrowUp') { holding = true; e.preventDefault(); }
    };
    var keyup = function (e) {
      if (e.key === ' ' || e.key === 'ArrowUp') { holding = false; e.preventDefault(); }
    };
    document.addEventListener('keydown', keyed);
    document.addEventListener('keyup', keyup);
    svg.addEventListener('pointerdown', function (e) { holding = true; if (e.cancelable) e.preventDefault(); });
    svg.addEventListener('pointerup', function () { holding = false; });
    svg.addEventListener('pointercancel', function () { holding = false; });
    svg.addEventListener('pointerleave', function () { holding = false; });

    newRound(); draw();
    try { svg.focus({ preventScroll: true }); } catch (e) {}
    raf = requestAnimationFrame(step);

    function teardown() {
      over = true;
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener('keydown', keyed);
      document.removeEventListener('keyup', keyup);
    }
    teardown.destroy = teardown;
    return teardown;
  }


  /* ============================================================ PALLANGUZHI
     The redesign (games spec §4.8, funded by the owner 8 Oct 2026). The board IS the screen.

     Pallanguzhi is the shell-and-pit game of Tamil Nadu, played across South India as Ali Guli
     Mane (Karnataka), Vamana Guntalu (Andhra Pradesh) and Kuzhipara (Kerala). Families play many
     ways; this is ONE simple way, and the card says so: two rows of seven pits; sow anticlockwise,
     one shell a pit; if the pit after your last shell is empty, the pit beyond it is yours (the
     kasi). First to 36, or when a side has nothing to sow the round ends and every shell left goes
     to its own side's store.

     What a child sees and does:
       · full-screen, a carved board drawn by the app (SVG wood, lit pits, day and night); on a
         phone it stands upright, your column nearest the thumb, Gattu's store at the top
       · the shells ARE the count: up to 12 drawn one by one, a heap and a badge above that
       · press / hover / Space shows the ghost trail and the capture before anything moves; lift
         away (or Esc) cancels, tap again (or Enter) sows — this is the lookahead lesson
       · shells lift into a hand and drop one a pit, ~140 ms each, a soft tock each (IND_SFX);
         Jaldi speeds it up; reduced motion shows a numbered trail instead of motion
       · Gattu: Naya (greedy) · Saathi (two moves ahead) · Ustaad (four), stepping up after the
         child wins two in a row and down after two losses in a row — nothing random anywhere
       · openings rotate through a fixed list of mirror-fair layouts
       · plays for fun: no answers reported, nothing paid (docs/32).

     The rules live in PZ (pure, no DOM) and both the preview and the move go through PZ.apply,
     so what the preview promises is what the move does (PZ4, tools/check-pallanguzhi.js). */
  var PZ = (function () {
    function sow(pits, i) {
      var p = pits.slice(), N = p.length, hand = p[i], j = i, trail = [];
      p[i] = 0;
      while (hand > 0) { j = (j + 1) % N; p[j]++; hand--; trail.push(j); }
      var nx = (j + 1) % N, by = (j + 2) % N, cap = 0, capPit = -1;
      if (p[nx] === 0 && p[by] > 0) { cap = p[by]; p[by] = 0; capPit = by; }
      return { pits: p, trail: trail, last: j, next: nx, capPit: capPit, cap: cap };
    }
    function range(N, who) { var n = N / 2; return who === 'you' ? [0, n] : [n, N]; }
    function rowEmpty(pits, who) {
      var r = range(pits.length, who);
      for (var i = r[0]; i < r[1]; i++) if (pits[i] > 0) return false;
      return true;
    }
    function legal(st) {
      var r = range(st.pits.length, st.turn), out = [];
      for (var i = r[0]; i < r[1]; i++) if (st.pits[i] > 0) out.push(i);
      return out;
    }
    function fresh(layout, target) {
      var pits = layout.concat(layout), sum = 0;
      for (var i = 0; i < pits.length; i++) sum += pits[i];
      return { pits: pits, store: { you: 0, gattu: 0 }, turn: 'you', over: false,
               target: target || Math.floor(sum / 2) + 1 };
    }
    /* one move: sow, take the kasi, then either someone has passed the target, or the side to
       move next has nothing to sow and the round ends (every shell to its own side's store) */
    function apply(st, i) {
      var who = st.turn, s = sow(st.pits, i), store = { you: st.store.you, gattu: st.store.gattu };
      store[who] += s.cap;
      var next = who === 'you' ? 'gattu' : 'you', over = false, packed = null, pits = s.pits.slice();
      if (store.you >= st.target || store.gattu >= st.target) over = true;
      else if (rowEmpty(pits, next)) {
        over = true; packed = { you: 0, gattu: 0 };
        var n = pits.length / 2;
        for (var k = 0; k < pits.length; k++) {
          var o = k < n ? 'you' : 'gattu';
          packed[o] += pits[k]; store[o] += pits[k]; pits[k] = 0;
        }
      }
      return { pits: pits, store: store, turn: over ? who : next, over: over, target: st.target,
               move: { pit: i, who: who, trail: s.trail, last: s.last, next: s.next,
                       capPit: s.capPit, cap: s.cap, sown: s.pits }, packed: packed };
    }
    function winner(st) { return st.store.you > st.store.gattu ? 'you' : st.store.gattu > st.store.you ? 'gattu' : 'draw'; }
    function value(st, me) {
      var o = me === 'you' ? 'gattu' : 'you', d = st.store[me] - st.store[o];
      if (st.over) d += d > 0 ? 1000 : d < 0 ? -1000 : 0;
      return d;
    }
    function search(st, depth, me) {
      if (st.over || depth === 0) return value(st, me);
      var ms = legal(st);
      if (!ms.length) return value(st, me);
      var maxing = st.turn === me, best = maxing ? -Infinity : Infinity;
      for (var k = 0; k < ms.length; k++) {
        var v = search(apply(st, ms[k]), depth - 1, me);
        if (maxing ? v > best : v < best) best = v;
      }
      return best;
    }
    /* depth 1 = greedy (Naya), 2 = sees the reply (Saathi), 4 = Ustaad. Ties keep the first pit,
       so the same board always gets the same move. */
    function choose(st, depth) {
      var ms = legal(st), me = st.turn, best = -Infinity, pick = ms.length ? ms[0] : -1;
      for (var k = 0; k < ms.length; k++) {
        var v = search(apply(st, ms[k]), depth - 1, me);
        if (v > best) { best = v; pick = ms[k]; }
      }
      return pick;
    }
    /* the best the side to move next can take straight back — for Naya's "…then Gattu can take 9" */
    function bestReply(st) {
      if (st.over) return { pit: -1, cap: 0 };
      var ms = legal(st), best = { pit: -1, cap: 0 };
      for (var k = 0; k < ms.length; k++) {
        var r = apply(st, ms[k]).move.cap;
        if (r > best.cap) best = { pit: ms[k], cap: r };
      }
      return best;
    }
    /* six mirror-fair openings (35 a side, Gattu's row the same from his seat), in a fixed turn */
    var OPENINGS = [[5, 5, 5, 5, 5, 5, 5], [4, 6, 5, 5, 5, 6, 4], [6, 4, 5, 5, 5, 4, 6],
                    [5, 4, 6, 5, 6, 4, 5], [3, 5, 7, 5, 7, 5, 3], [7, 5, 3, 5, 3, 5, 7]];
    var TIERS = [{ id: 'naya', name: 'Naya', depth: 1, says: 'takes the biggest pit he can see' },
                 { id: 'saathi', name: 'Saathi', depth: 2, says: 'looks one reply ahead' },
                 { id: 'ustaad', name: 'Ustaad', depth: 4, says: 'looks four moves ahead' }];
    /* two results in a row move the tier, and the count starts again — deterministic */
    function adapt(mem, result) {
      var m = { tier: mem.tier || 0, run: (mem.run || []).concat([result]).slice(-2) };
      if (m.run.length === 2 && m.run[0] === m.run[1]) {
        if (m.run[0] === 'win' && m.tier < TIERS.length - 1) m.tier++;
        else if (m.run[0] === 'loss' && m.tier > 0) m.tier--;
        if (m.run[0] !== 'draw') m.run = [];
      }
      return m;
    }
    return { sow: sow, apply: apply, legal: legal, fresh: fresh, rowEmpty: rowEmpty, winner: winner,
             choose: choose, bestReply: bestReply, OPENINGS: OPENINGS, TIERS: TIERS, adapt: adapt };
  })();
  W.IND_PZ = PZ;   /* the rules, for tools/check-pallanguzhi.js; nothing in the app reads it */

  function pzStore() {
    var S = W.IND_STORE;
    return {
      get: function (k, d) { try { var v = S && S.kidGet ? S.kidGet(k) : null; return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
      set: function (k, v) { try { if (S && S.kidSet) S.kidSet(k, JSON.stringify(v)); } catch (e) {} }
    };
  }
  /* a full-screen game locks the page behind it; one class, shared with Carrom */
  function lockPage(on) {
    try { document.documentElement.classList.toggle('gm-fullscreen', !!on); } catch (e) {}
  }
  function sfx(kind, fallback) {
    var S = W.IND_SFX;
    if (!S || !S.play) return;
    var k = S.KINDS && S.KINDS.indexOf(kind) >= 0 ? kind : fallback;
    if (k) S.play(k);
  }

  function pzCss() {
    if (document.getElementById('pz-css')) return;
    var s = el('style'); s.id = 'pz-css';
    s.textContent =
      'html.gm-fullscreen,html.gm-fullscreen body{overflow:hidden!important;overscroll-behavior:none}' +
      '.pz-root{--pz-floor1:#3b2410;--pz-floor2:#1d1007;--pz-w1:#c98a46;--pz-w2:#a5662c;--pz-w3:#7a4518;' +
        '--pz-grain:#5a300f;--pz-bowl1:#2a1606;--pz-bowl2:#5b3413;--pz-rim:#e9bd7a;--pz-brass:#f2c14e;' +
        '--pz-ink:#fff6e6;--pz-badge:#20120a;--pz-glow:#ffd36b;--pz-ghost:#fff3d1;' +
        'position:relative;display:flex;flex-direction:column;width:100%;height:min(72vh,620px);min-height:340px;' +
        'background:radial-gradient(60% 45% at 50% 42%,rgba(255,196,120,.16),transparent 70%),' +
        'radial-gradient(rgba(255,226,180,.07) 1.2px,transparent 1.6px) 0 0/24px 24px,' +
        'radial-gradient(120% 80% at 50% 30%,var(--pz-floor1),var(--pz-floor2));color:var(--pz-ink);' +
        'border-radius:18px;overflow:hidden;font-family:var(--body,system-ui,sans-serif);' +
        '-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}' +
      'html[data-mode="night"] .pz-root{--pz-floor1:#1d1428;--pz-floor2:#09060f;--pz-w1:#8a5530;' +
        '--pz-w2:#6b3c1d;--pz-w3:#4a250e;--pz-grain:#2b1406;--pz-bowl1:#140a03;--pz-bowl2:#3a200b;--pz-rim:#c9935a}' +
      '.pz-root.pz-full{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1200;height:auto;min-height:0;border-radius:0;' +
        'padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}' +
      '.pz-top{flex:none;display:flex;align-items:center;gap:8px;padding:6px 8px;min-height:56px}' +
      '.pz-top .pz-say{flex:1;min-width:0;margin:0;text-align:center;font:700 15px/1.3 var(--body,system-ui);color:var(--pz-ink);' +
        'text-shadow:0 1px 2px rgba(0,0,0,.6)}' +
      '.pz-b{flex:none;min-width:44px;height:44px;border-radius:999px;border:1.5px solid rgba(255,236,200,.35);' +
        'background:rgba(255,236,200,.1);color:var(--pz-ink);font:800 16px/1 var(--body,system-ui);cursor:pointer;padding:0 12px}' +
      '.pz-b[aria-pressed="true"]{background:var(--pz-brass);color:#2a1606;border-color:var(--pz-brass)}' +
      '.pz-b:focus-visible,.pz-pit:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
      '.pz-stage{position:relative;flex:1;min-height:0;touch-action:none}' +
      '.pz-svg{position:absolute;left:0;top:0;width:100%;height:100%;display:block;overflow:visible}' +
      '.pz-svgd{will-change:transform}' +
      '.pz-hits{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none}' +
      '.pz-pit{position:absolute;pointer-events:auto;border-radius:50%;background:transparent;border:0;padding:0;margin:0;' +
        'cursor:pointer;touch-action:none;-webkit-tap-highlight-color:transparent}' +
      '.pz-pit[disabled]{cursor:default}' +
      '.pz-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
      '.pz-over{position:absolute;left:0;top:0;right:0;bottom:0;display:grid;place-items:center;padding:16px;z-index:3;' +
        'background:rgba(12,6,2,.55);backdrop-filter:blur(2px)}' +
      '.pz-over[hidden]{display:none}' +
      '.pz-card{background:var(--card,#fffaf0);color:var(--text,#2a1a0c);border-radius:20px;padding:18px 20px;max-width:420px;width:100%;' +
        'box-shadow:0 20px 60px rgba(0,0,0,.45);display:grid;gap:10px;text-align:center}' +
      '.pz-card h3{margin:0;font:800 22px/1.2 var(--display,var(--body,serif))}' +
      '.pz-card p{margin:0;font:600 14px/1.5 var(--body,system-ui);color:var(--text2,#4a3520)}' +
      '.pz-card .pz-credit{font-size:12.5px;color:var(--muted,#6b5640)}' +
      '.pz-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}' +
      '.pz-go{min-height:48px;padding:12px 22px;border-radius:999px;border:0;background:var(--accent,#b8452a);color:#fff;' +
        'font:800 16px/1 var(--body,system-ui);cursor:pointer}' +
      '.pz-go.ghost{background:transparent;color:var(--text,#2a1a0c);border:1.5px solid var(--line,#d8c6a8)}' +
      '.pz-go:focus-visible{outline:3px solid var(--accent2,#e9a13b);outline-offset:2px}' +
      '.pz-coach{position:absolute;left:0;right:0;bottom:0;top:0;z-index:4;display:grid;place-items:center;padding:12px;' +
        'background:rgba(12,6,2,.62)}' +
      '.pz-coach[hidden]{display:none}' +
      '.pz-coachcard{width:min(560px,100%);background:linear-gradient(180deg,#3a210c,#24130a);border:1px solid rgba(255,220,160,.25);' +
        'border-radius:22px;box-shadow:0 24px 70px rgba(0,0,0,.55);padding:12px 12px 14px;display:grid;gap:8px}' +
      '.pz-coachboard{position:relative;height:clamp(150px,30vh,230px);margin-bottom:30px}' +
      '.pz-coachline{margin:0;text-align:center;font:700 16px/1.45 var(--body,system-ui);color:#fff6e6;min-height:46px}' +
      '.pz-coachline b{color:var(--pz-glow)}' +
      '.pz-coachcard .pz-go{background:var(--pz-brass);color:#2a1606}' +
      '.pz-coachcard .pz-go.ghost{background:transparent;color:#fff6e6;border:1.5px solid rgba(255,236,200,.45)}' +
      '@keyframes pzbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}' +
      '.pz-arrow{animation:pzbob 1s ease-in-out infinite;transform-box:fill-box}' +
      '.pz-steps{display:flex;gap:6px;justify-content:center}' +
      '.pz-steps i{width:28px;height:6px;border-radius:3px;background:rgba(255,236,200,.25)}' +
      '.pz-steps i.on{background:var(--pz-brass)}' +
      '@keyframes pzpulse{0%,100%{opacity:.35}50%{opacity:.95}}' +
      '@keyframes pzglow{0%{opacity:0}25%{opacity:.95}100%{opacity:0}}' +
      '.pz-pulse{animation:pzpulse 1.6s ease-in-out infinite}' +
      '.pz-glowfx{animation:pzglow 1.1s ease-out forwards}' +
      '@media(prefers-reduced-motion:reduce){.pz-pulse,.pz-glowfx{animation:none}}' +
      '.pz-reduced .pz-pulse,.pz-reduced .pz-glowfx{animation:none}';
    document.head.appendChild(s);
  }

  /* ---------------------------------------------------------------- one clock
     Every wait and every flight runs on one requestAnimationFrame clock with delta time
     (clamped at 50 ms), and it stops while the page is hidden — a hidden tab changes nothing. */
  function pzClock() {
    var vt = 0, last = 0, raf = 0, dead = false, held = false, q = [], tw = [];
    function frame(ts) {
      raf = 0;
      if (dead || held) { last = 0; return; }
      var dt = last ? Math.min(100, ts - last) : 16;
      last = ts; vt += dt;
      var i;
      for (i = 0; i < tw.length;) {
        var t = tw[i], p = Math.min(1, (vt - t.at) / t.dur);
        if (p >= 0) t.fn(p);
        if (p >= 1) { tw.splice(i, 1); if (t.end) t.end(); } else i++;
      }
      for (i = 0; i < q.length;) {
        if (q[i].at <= vt) { var f = q.splice(i, 1)[0]; f.fn(); } else i++;
      }
      if (q.length || tw.length) kick(); else last = 0;
    }
    function kick() { if (!raf && !dead && document.visibilityState !== 'hidden') raf = requestAnimationFrame(frame); }
    function onVis() {
      if (document.visibilityState === 'hidden') { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; }
      else kick();
    }
    document.addEventListener('visibilitychange', onVis);
    return {
      now: function () { return vt; },
      wait: function (ms, fn) { q.push({ at: vt + ms, fn: fn }); kick(); },
      tween: function (ms, fn, end, delay) { tw.push({ at: vt + (delay || 0), dur: Math.max(1, ms), fn: fn, end: end }); kick(); },
      clear: function () { q = []; tw = []; },
      busy: function () { return q.length + tw.length; },
      hold: function (on) { held = !!on; if (!held) kick(); },
      kill: function () { dead = true; q = []; tw = []; if (raf) cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); }
    };
  }

  /* ---------------------------------------------------------------- the board
     Drawn by the app in SVG, in CSS pixels (the viewBox is the stage), so a 16 px badge is 16 px.
     n pits a side; one persistent <use> per shell, so a shell is the same shell from the pit to
     the hand to the store. */
  var pzSeq = 0;
  var SVGNS = 'http://www.w3.org/2000/svg';
  function pzBoard(stage, n, total, cfg) {
    var uid = 'pzb' + (++pzSeq), N = 2 * n;
    /* two layers: the carved board, painted once per layout, and everything that moves above it
       on its own composited layer — so a flying shell never repaints the wood */
    var svgB = document.createElementNS(SVGNS, 'svg'), svg = document.createElementNS(SVGNS, 'svg');
    svgB.setAttribute('class', 'pz-svg pz-svgb'); svgB.setAttribute('aria-hidden', 'true'); svgB.setAttribute('data-pz-board', '');
    svg.setAttribute('class', 'pz-svg pz-svgd'); svg.setAttribute('aria-hidden', 'true');
    var hits = el('div', 'pz-hits');
    stage.appendChild(svgB); stage.appendChild(svg); stage.appendChild(hits);
    var gBoard = document.createElementNS(SVGNS, 'g'), gUnder = document.createElementNS(SVGNS, 'g'),
        gShell = document.createElementNS(SVGNS, 'g'), gOver = document.createElementNS(SVGNS, 'g'),
        gBadge = document.createElementNS(SVGNS, 'g');
    gShell.setAttribute('class', 'pz-shells');
    svgB.appendChild(gBoard); svg.appendChild(gUnder); svg.appendChild(gShell); svg.appendChild(gOver); svg.appendChild(gBadge);
    var L = null, pitsNow = [], storeNow = { you: 0, gattu: 0 };
    var at = { pit: [], you: [], gattu: [], hand: [] };     /* shell ids by place */
    for (var a0 = 0; a0 < N; a0++) at.pit.push([]);
    var sh = [];                                             /* {node, x, y, rot, s, vis} */
    var btns = [];
    var labels = cfg.labels || { you: 'You', gattu: 'Gattu' };

    function hash(k) { var x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

    function layout() {
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return false;
      var vert = w < h * 0.82 && w < 700, P = [], S = {}, cx, cy, i, bw, bh, bx, by, r;
      if (!vert) {
        var cols = n + 2 * 1.75 + 0.9;
        cx = Math.min((w - 12) / cols, 1180 / cols);
        cy = Math.min(cx * 1.28, (h - 12) / 2.9);
        bw = cx * cols; bh = cy * 2.9; bx = (w - bw) / 2; by = (h - bh) / 2;
        var x0 = bx + cx * (0.45 + 1.75 + 0.5);
        for (i = 0; i < N; i++) {
          var col = i < n ? i : N - 1 - i;
          P.push({ x: x0 + col * cx, y: by + (i < n ? bh - cy * 0.95 : cy * 0.95) });
        }
        r = Math.min(cx * 0.43, cy * 0.4);
        S.you = { x: bx + cx * (0.45 + 0.875), y: by + bh / 2 + cy * 0.12, rx: cx * 0.7, ry: cy * 0.86 };
        S.gattu = { x: bx + bw - cx * (0.45 + 0.875), y: by + bh / 2, rx: S.you.rx, ry: S.you.ry };
        L = { vert: false, P: P, S: S, rx: r, ry: r, bx: bx, by: by, bw: bw, bh: bh, cx: cx, cy: cy };
      } else {
        var rows = n + 2 * 1.6 + 0.9;
        cy = (h - 10) / rows;
        cx = Math.min((w - 12) / 2.9, cy * 1.75);
        bw = cx * 2.9; bh = cy * rows; bx = (w - bw) / 2; by = (h - bh) / 2;
        for (i = 0; i < N; i++) {
          if (i < n) P.push({ x: bx + bw - cx * 0.95, y: by + bh - cy * (0.45 + 1.6 + 0.5) - i * cy });
          else P.push({ x: bx + cx * 0.95, y: by + cy * (0.45 + 1.6 + 0.5) + (i - n) * cy });
        }
        var ry = cy * 0.42, rx = Math.min(cx * 0.42, ry * 1.4);
        S.gattu = { x: bx + bw / 2, y: by + cy * (0.45 + 0.8), rx: Math.min(cx * 1.2, bw / 2 - cx * 0.25), ry: cy * 0.7 };
        S.you = { x: bx + bw / 2, y: by + bh - cy * (0.45 + 0.8), rx: S.gattu.rx, ry: S.gattu.ry };
        L = { vert: true, P: P, S: S, rx: rx, ry: ry, bx: bx, by: by, bw: bw, bh: bh, cx: cx, cy: cy };
      }
      L.w = w; L.h = h;
      L.shell = Math.max(0.55, Math.min(1.25, Math.min(L.rx, L.ry) / 30));
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svgB.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      drawBoard(); placeButtons(); snapAll(); drawBadges();
      return true;
    }

    function drawBoard() {
      var o = [], i, rnd = 7;
      function rr() { rnd = (rnd * 16807) % 2147483647; return rnd / 2147483647; }
      var B = L, rad = Math.min(B.cx, B.cy) * 0.42;
      o.push('<defs>' +
        '<linearGradient id="' + uid + 'w" x1="0" y1="0" x2="' + (B.vert ? 1 : 0.15) + '" y2="1">' +
          '<stop offset="0" style="stop-color:var(--pz-w1)"/><stop offset=".55" style="stop-color:var(--pz-w2)"/>' +
          '<stop offset="1" style="stop-color:var(--pz-w3)"/></linearGradient>' +
        '<radialGradient id="' + uid + 'b" cx=".5" cy=".38" r=".7">' +
          '<stop offset="0" style="stop-color:var(--pz-bowl1)"/><stop offset=".72" style="stop-color:var(--pz-bowl1)"/>' +
          '<stop offset="1" style="stop-color:var(--pz-bowl2)"/></radialGradient>' +
        '<radialGradient id="' + uid + 'l" cx=".5" cy="0" r="1">' +
          '<stop offset="0" stop-color="#fff4d8" stop-opacity=".30"/><stop offset=".6" stop-color="#fff4d8" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + uid + 'g" cx=".5" cy=".5" r=".5">' +
          '<stop offset="0" stop-color="#ffd36b" stop-opacity=".85"/><stop offset="1" stop-color="#ffd36b" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + uid + 'c" cx=".38" cy=".3" r=".8">' +
          '<stop offset="0" stop-color="#fffdf6"/><stop offset=".55" stop-color="#f3e6c9"/><stop offset="1" stop-color="#cdb084"/></radialGradient>' +
        '<filter id="' + uid + 'sh" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="' + (rad * 0.35).toFixed(1) + '"/></filter>' +
        /* one cowrie, seen from above: the toothed slit, the gloss — drawn, not a photo */
        '<g id="' + uid + 'cw">' +
          '<ellipse cx=".8" cy="1.6" rx="9.6" ry="6.6" fill="#1a0c03" opacity=".38"/>' +
          '<ellipse rx="9.2" ry="6.4" fill="url(#' + uid + 'c)" stroke="#8d6c42" stroke-width=".8"/>' +
          '<path d="M-6.6 .6 Q0 -.9 6.6 .6" fill="none" stroke="#6a4a26" stroke-width="1.7" stroke-linecap="round"/>' +
          '<path d="M-4.5 -.4v1.6M-2.2 -.8v1.7M0 -.95v1.8M2.2 -.8v1.7M4.5 -.4v1.6" stroke="#f8ecd2" stroke-width=".7" stroke-linecap="round"/>' +
          '<ellipse cx="-2.6" cy="-3.2" rx="3.4" ry="1.3" fill="#fff" opacity=".75"/>' +
        '</g>' +
        '<g id="' + uid + 'hd">' +
          '<path d="M-17 2 C-17 -6 -11 -9 -6 -9 L9 -9 C14 -9 17 -6 17 -1 C17 9 9 15 0 15 C-9 15 -17 10 -17 2Z" fill="#fff3dc" fill-opacity=".22" stroke="#fff3dc" stroke-opacity=".85" stroke-width="1.6"/>' +
          '<path d="M-6 -9 C-6 -14 -1 -14 -1 -9 M-1 -9 C-1 -15 5 -15 5 -9 M5 -9 C5 -13 10 -13 10 -8 M-17 1 C-23 -2 -23 -9 -16 -8" fill="none" stroke="#fff3dc" stroke-opacity=".85" stroke-width="1.6" stroke-linecap="round"/>' +
        '</g>' +
        '</defs>');
      /* the board: a soft shadow, the carved slab, grain, a bevel, light from above */
      var R = Math.min(B.cx, B.cy) * 0.5;
      o.push('<rect x="' + (B.bx + 4) + '" y="' + (B.by + 10) + '" width="' + B.bw + '" height="' + B.bh + '" rx="' + R + '" fill="#000" opacity=".55" filter="url(#' + uid + 'sh)"/>');
      o.push('<rect x="' + B.bx + '" y="' + B.by + '" width="' + B.bw + '" height="' + B.bh + '" rx="' + R + '" fill="url(#' + uid + 'w)"/>');
      for (i = 0; i < 22; i++) {
        var a = rr(), wv = (rr() - 0.5) * Math.min(B.cx, B.cy) * 0.5, op = (0.08 + rr() * 0.14).toFixed(2);
        if (!B.vert) {
          var gy = B.by + 6 + a * (B.bh - 12);
          o.push('<path d="M' + (B.bx + R * 0.4) + ' ' + gy.toFixed(1) + ' C' + (B.bx + B.bw * 0.3) + ' ' + (gy + wv).toFixed(1) + ' ' + (B.bx + B.bw * 0.7) + ' ' + (gy - wv).toFixed(1) + ' ' + (B.bx + B.bw - R * 0.4) + ' ' + gy.toFixed(1) + '" stroke="var(--pz-grain)" stroke-width="' + (0.6 + rr() * 1.6).toFixed(1) + '" fill="none" opacity="' + op + '"/>');
        } else {
          var gx = B.bx + 6 + a * (B.bw - 12);
          o.push('<path d="M' + gx.toFixed(1) + ' ' + (B.by + R * 0.4) + ' C' + (gx + wv).toFixed(1) + ' ' + (B.by + B.bh * 0.3) + ' ' + (gx - wv).toFixed(1) + ' ' + (B.by + B.bh * 0.7) + ' ' + gx.toFixed(1) + ' ' + (B.by + B.bh - R * 0.4) + '" stroke="var(--pz-grain)" stroke-width="' + (0.6 + rr() * 1.6).toFixed(1) + '" fill="none" opacity="' + op + '"/>');
        }
      }
      var ins = Math.min(B.cx, B.cy) * 0.16;
      o.push('<rect x="' + (B.bx + ins) + '" y="' + (B.by + ins) + '" width="' + (B.bw - 2 * ins) + '" height="' + (B.bh - 2 * ins) + '" rx="' + (R * 0.75) + '" fill="none" stroke="#2a1405" stroke-opacity=".45" stroke-width="2"/>');
      o.push('<rect x="' + (B.bx + ins + 1.5) + '" y="' + (B.by + ins + 1.5) + '" width="' + (B.bw - 2 * ins - 3) + '" height="' + (B.bh - 2 * ins - 3) + '" rx="' + (R * 0.72) + '" fill="none" stroke="#ffe2b0" stroke-opacity=".22" stroke-width="1.2"/>');
      o.push('<rect x="' + (B.bx + 1) + '" y="' + (B.by + 1) + '" width="' + (B.bw - 2) + '" height="' + (B.bh - 2) + '" rx="' + R + '" fill="none" stroke="#ffe7c0" stroke-opacity=".35" stroke-width="1.5"/>');
      /* the carved groove between the two sides, with a small lotus at its middle */
      var mx = B.bx + B.bw / 2, my = B.by + B.bh / 2;
      if (!B.vert) {
        var gx0 = L.P[0].x - L.rx, gx1 = L.P[n - 1].x + L.rx;
        o.push('<path d="M' + gx0 + ' ' + (my - 1.5) + 'H' + gx1 + '" stroke="#2a1405" stroke-opacity=".5" stroke-width="2"/><path d="M' + gx0 + ' ' + (my + 1) + 'H' + gx1 + '" stroke="#ffe2b0" stroke-opacity=".25" stroke-width="1.2"/>');
      } else {
        var gy0 = L.P[n].y - L.ry, gy1 = L.P[N - 1].y + L.ry;
        o.push('<path d="M' + (mx - 1.5) + ' ' + gy0 + 'V' + gy1 + '" stroke="#2a1405" stroke-opacity=".5" stroke-width="2"/><path d="M' + (mx + 1) + ' ' + gy0 + 'V' + gy1 + '" stroke="#ffe2b0" stroke-opacity=".25" stroke-width="1.2"/>');
      }
      var lr = Math.min(B.cx, B.cy) * 0.17;
      for (i = 0; i < 8; i++) {
        var la = i * Math.PI / 4;
        o.push('<ellipse cx="' + (mx + Math.cos(la) * lr * 0.55).toFixed(1) + '" cy="' + (my + Math.sin(la) * lr * 0.55).toFixed(1) + '" rx="' + (lr * 0.5).toFixed(1) + '" ry="' + (lr * 0.2).toFixed(1) + '" transform="rotate(' + (i * 45) + ' ' + (mx + Math.cos(la) * lr * 0.55).toFixed(1) + ' ' + (my + Math.sin(la) * lr * 0.55).toFixed(1) + ')" fill="#2a1405" fill-opacity=".28" stroke="#ffe2b0" stroke-opacity=".2"/>');
      }
      /* pits and stores: carved bowls, lit from above; your pits wear a brass rim */
      function bowl(x, y, rx, ry, mine, big) {
        return '<ellipse cx="' + x + '" cy="' + (y + 2.5) + '" rx="' + (rx + 3) + '" ry="' + (ry + 3) + '" fill="#ffe7c0" opacity=".28"/>' +
          '<ellipse cx="' + x + '" cy="' + (y - 1.5) + '" rx="' + (rx + 3) + '" ry="' + (ry + 3) + '" fill="#2a1405" opacity=".55"/>' +
          '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="url(#' + uid + 'b)"/>' +
          '<ellipse cx="' + x + '" cy="' + (y + ry * 0.38) + '" rx="' + (rx * 0.72) + '" ry="' + (ry * 0.42) + '" fill="#ffcf8a" opacity="' + (big ? 0.1 : 0.13) + '"/>' +
          (mine ? '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (rx + 2.2) + '" ry="' + (ry + 2.2) + '" fill="none" stroke="var(--pz-brass)" stroke-width="2.6" opacity=".9"/>' : '');
      }
      for (i = 0; i < N; i++) o.push(bowl(L.P[i].x, L.P[i].y, L.rx, L.ry, i < n, false));
      o.push(bowl(L.S.you.x, L.S.you.y, L.S.you.rx, L.S.you.ry, false, true));
      o.push(bowl(L.S.gattu.x, L.S.gattu.y, L.S.gattu.rx, L.S.gattu.ry, false, true));
      o.push('<rect x="' + B.bx + '" y="' + B.by + '" width="' + B.bw + '" height="' + B.bh + '" rx="' + R + '" fill="url(#' + uid + 'l)" pointer-events="none"/>');
      gBoard.innerHTML = o.join('');
      /* the shells, made once */
      if (!sh.length) {
        for (var k = 0; k < total; k++) {
          var u = document.createElementNS(SVGNS, 'use');
          u.setAttribute('href', '#' + uid + 'cw');
          u.style.display = 'none';
          gShell.appendChild(u);
          sh.push({ node: u, x: 0, y: 0, rot: Math.round(hash(k + 1) * 180), s: 1, vis: false, at: '' });
        }
      }
    }

    function placeButtons() {
      hits.innerHTML = ''; btns = [];
      for (var i = 0; i < n; i++) {
        var b = el('button', 'pz-pit');
        b.type = 'button'; b.setAttribute('data-pit', String(i)); b.tabIndex = i === 0 ? 0 : -1;
        var bw2 = Math.max(48, L.rx * 2 + 6), bh2 = Math.max(48, L.ry * 2 + 6);
        b.style.left = (L.P[i].x - bw2 / 2) + 'px'; b.style.top = (L.P[i].y - bh2 / 2) + 'px';
        b.style.width = bw2 + 'px'; b.style.height = bh2 + 'px';
        hits.appendChild(b); btns.push(b);
      }
      if (cfg.onButtons) cfg.onButtons(btns);
    }

    /* where shell number k of a place rests: a sunflower packing, so a handful looks thrown in,
       not laid on a grid; above 12 a heap (a second layer, the rest underneath) */
    function slot(place, k, count) {
      var c, rx, ry, cap, dense = false;
      if (place === 'you' || place === 'gattu') { c = L.S[place]; rx = c.rx; ry = c.ry; cap = Math.max(total, 1); }
      else { c = L.P[place]; rx = L.rx; ry = L.ry; cap = 12; dense = count > 12; }
      var sc = L.shell;
      if (place !== 'you' && place !== 'gattu') {
        if (k >= 12) {
          if (k >= 20) return { x: c.x, y: c.y, s: sc, vis: false };
          var j = k - 12, a2 = j * 2.39996 + 0.7, r2 = 0.42 * Math.sqrt((j + 0.5) / 8);
          return { x: c.x + Math.cos(a2) * r2 * rx * 0.8, y: c.y - ry * 0.12 + Math.sin(a2) * r2 * ry * 0.8, s: sc, vis: true };
        }
      }
      var ang = k * 2.39996 + (typeof place === 'number' ? place * 0.9 : 0.3);
      var rad = (dense ? 0.86 : 0.8) * Math.sqrt((k + 0.55) / (cap + 0.55));
      if (place !== 'you' && place !== 'gattu' && count <= 3) rad *= 1.25;
      return { x: c.x + Math.cos(ang) * rad * (rx - 7 * sc), y: c.y + Math.sin(ang) * rad * (ry - 5 * sc), s: sc, vis: true };
    }
    function put(id, x, y, s, vis, lift) {
      var o = sh[id];
      if (!o) return;
      o.x = x; o.y = y; o.s = s;
      if (o.vis !== vis) { o.vis = vis; o.node.style.display = vis ? '' : 'none'; }
      o.node.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + (y - (lift || 0)).toFixed(1) + ') rotate(' + o.rot + ') scale(' + (s * (1 + (lift ? 0.12 : 0))).toFixed(3) + ')');
    }
    function placeOf(id) { return sh[id].at; }
    function snapPlace(place) {
      var list = place === 'hand' ? at.hand : (place === 'you' || place === 'gattu') ? at[place] : at.pit[place];
      for (var k = 0; k < list.length; k++) {
        if (place === 'hand') { var hp = handPos(); put(list[k], hp.x + ((k % 4) - 1.5) * 6 * L.shell, hp.y - Math.floor(k / 4) * 4 * L.shell, L.shell, k < 16, 0); }
        else { var p = slot(place, k, list.length); put(list[k], p.x, p.y, p.s, p.vis); }
        sh[list[k]].at = String(place);
      }
    }
    function snapAll() {
      if (!L) return;
      for (var i = 0; i < N; i++) snapPlace(i);
      snapPlace('you'); snapPlace('gattu'); snapPlace('hand');
    }
    /* put the shells where a state says, without animation */
    function setState(pits, store) {
      pitsNow = pits.slice(); storeNow = { you: store.you, gattu: store.gattu };
      var id = 0, i, k;
      at = { pit: [], you: [], gattu: [], hand: [] };
      for (i = 0; i < N; i++) { at.pit.push([]); for (k = 0; k < pits[i]; k++) at.pit[i].push(id++); }
      for (k = 0; k < store.you; k++) at.you.push(id++);
      for (k = 0; k < store.gattu; k++) at.gattu.push(id++);
      while (id < total) { at.hand.push(id); sh[id] && put(id, -50, -50, 0.01, false); id++; }
      at.hand = [];
      if (L) { snapAll(); drawBadges(); }
    }

    var hand = { x: 0, y: 0, on: false, who: 'you' };
    function handPos() { return { x: hand.x, y: hand.y }; }
    function handAt(i) {
      var p = typeof i === 'number' ? L.P[i] : L.S[i];
      return { x: p.x, y: p.y - (typeof i === 'number' ? L.ry : p.ry) * 0.95 - 8 };
    }

    function badge(x, y, txt, big, cls) {
      var fs = big ? 18 : 16, wv = Math.max(fs * 1.6, String(txt).length * fs * 0.62 + 14), hv = fs + 10;
      return '<g class="' + (cls || '') + '"><rect x="' + (x - wv / 2).toFixed(1) + '" y="' + (y - hv / 2).toFixed(1) + '" width="' + wv.toFixed(1) + '" height="' + hv + '" rx="' + (hv / 2) + '" fill="' + (big ? '#fff6e0' : 'var(--pz-badge)') + '" fill-opacity="' + (big ? 1 : 0.86) + '" stroke="' + (big ? '#7a4518' : 'rgba(255,230,190,.35)') + '" stroke-width="1"/>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + fs * 0.36).toFixed(1) + '" text-anchor="middle" font-size="' + fs + '" font-weight="800" font-family="var(--body,system-ui)" fill="' + (big ? '#2a1606' : '#fff6e6') + '">' + txt + '</text></g>';
    }
    function countPos(i) {
      var p = L.P[i];
      if (!L.vert) return { x: p.x, y: i < n ? p.y + L.ry + 17 : p.y - L.ry - 17 };
      return { x: i < n ? p.x + L.rx + 20 : p.x - L.rx - 20, y: p.y };
    }
    function drawBadges() {
      if (!L) return;
      var o = [], i;
      for (i = 0; i < N; i++) {
        var c = pitsNow[i] || 0, cp = countPos(i);
        o.push('<g data-count="' + i + '">' + badge(cp.x, cp.y, c, c > 12) + '</g>');
      }
      ['gattu', 'you'].forEach(function (who) {
        var s = L.S[who], y = L.vert ? (who === 'gattu' ? s.y - s.ry - 4 : s.y + s.ry + 4) : s.y - s.ry - 4;
        if (L.vert) y = who === 'gattu' ? Math.max(s.y - s.ry + 2, L.by + 18) : Math.min(s.y + s.ry - 2, L.by + L.bh - 18);
        if (!L.vert) y = s.y - s.ry - 22;
        var fs = Math.round(Math.max(18, Math.min(24, L.cy * 0.22)));
        var txt = labels[who] + '  ' + storeNow[who];
        var room = L.vert ? s.rx * 2 : s.rx * 2 + 6;
        if (txt.length * fs * 0.5 + 24 > room) fs = Math.max(13, Math.floor((room - 24) / (txt.length * 0.5)));
        var wv = Math.min(txt.length * fs * 0.5 + 24, room + 10), hv = fs + 12;
        o.push('<g data-store="' + who + '"><rect x="' + (s.x - wv / 2).toFixed(1) + '" y="' + (y - hv / 2).toFixed(1) + '" width="' + wv.toFixed(1) + '" height="' + hv + '" rx="' + hv / 2 + '" fill="' + (who === 'you' ? 'var(--pz-brass)' : '#2a1606') + '" stroke="' + (who === 'you' ? '#7a4518' : 'rgba(255,230,190,.45)') + '" stroke-width="1.2"/>' +
          '<text x="' + s.x.toFixed(1) + '" y="' + (y + fs * 0.36).toFixed(1) + '" text-anchor="middle" font-family="var(--body,system-ui)" fill="' + (who === 'you' ? '#2a1606' : '#fff6e6') + '">' +
          '<tspan font-size="' + Math.round(fs * 0.7) + '" font-weight="700">' + labels[who] + '</tspan>' +
          '<tspan dx="8" font-size="' + fs + '" font-weight="900" data-score="' + who + '">' + storeNow[who] + '</tspan></text></g>');
      });
      gBadge.innerHTML = o.join('');
    }

    /* ---------------- ghost trail: where each shell will land, the last pit, the kasi */
    function preview(res, opts) {
      opts = opts || {};
      var o = [], m = res.move, counts = pitsNow.slice(), seen = {}, i;
      counts[m.pit] = 0;
      for (i = 0; i < m.trail.length; i++) {
        var p = m.trail[i], k = counts[p]++;
        var sp = slot(p, Math.min(k, 11), Math.max(counts[p], 1));
        o.push('<use href="#' + uid + 'cw" transform="translate(' + sp.x.toFixed(1) + ' ' + sp.y.toFixed(1) + ') rotate(' + ((i * 47) % 180) + ') scale(' + (L.shell * 0.95).toFixed(3) + ')" opacity=".5"/>');
        if (m.trail.length <= 28 && !seen[p]) {
          seen[p] = 1;
          var q = L.P[p], ax = L.vert ? (p < n ? -1 : 1) : 0, ay = L.vert ? 0 : (p < n ? -1 : 1);
          var nx = q.x + ax * (L.rx + 2), ny = q.y + ay * (L.ry + 2);
          if (!L.vert) ny = q.y + (p < n ? -L.ry * 0.86 : L.ry * 0.86);
          if (L.vert) nx = q.x + (p < n ? -L.rx * 0.86 : L.rx * 0.86);
          o.push('<circle cx="' + nx.toFixed(1) + '" cy="' + ny.toFixed(1) + '" r="10" fill="' + (opts.gattu ? '#3c2a5a' : '#fff3d1') + '" stroke="' + (opts.gattu ? '#cbb8ff' : '#7a4518') + '" stroke-width="1"/>' +
            '<text x="' + nx.toFixed(1) + '" y="' + (ny + 4).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="800" font-family="var(--body,system-ui)" fill="' + (opts.gattu ? '#fff' : '#2a1606') + '">' + (i + 1) + '</text>');
        }
      }
      var lp = L.P[m.last];
      o.push('<ellipse data-ghost-last="' + m.last + '" cx="' + lp.x + '" cy="' + lp.y + '" rx="' + (L.rx + 5) + '" ry="' + (L.ry + 5) + '" fill="none" stroke="' + (opts.gattu ? '#cbb8ff' : '#ffe9a8') + '" stroke-width="3.5"/>');
      var np = L.P[m.next];
      o.push('<ellipse cx="' + np.x + '" cy="' + np.y + '" rx="' + (L.rx + 3) + '" ry="' + (L.ry + 3) + '" fill="none" stroke="#fff3dc" stroke-opacity=".7" stroke-width="2" stroke-dasharray="5 5"/>');
      if (m.capPit >= 0) {
        var cp = L.P[m.capPit];
        o.push('<ellipse cx="' + cp.x + '" cy="' + cp.y + '" rx="' + (L.rx + 10) + '" ry="' + (L.ry + 10) + '" fill="url(#' + uid + 'g)" class="pz-pulse"/>');
        var tx = cp.x, ty = L.vert ? cp.y - L.ry - 16 : (m.capPit < n ? cp.y + L.ry + 40 : cp.y - L.ry - 40);
        if (L.vert) tx = Math.max(L.bx + 70, Math.min(L.bx + L.bw - 70, cp.x));
        o.push('<g data-ghost-cap="' + m.cap + '">' + badge(tx, ty, '+' + m.cap + ' — the kasi!', true) + '</g>');
      }
      gOver.innerHTML = o.join('');
      gOver.setAttribute('data-preview', String(m.pit));
    }
    function clearPreview() { gOver.innerHTML = ''; gOver.removeAttribute('data-preview'); }

    /* a numbered trail that stays still — the reduced-motion way to follow a move */
    function numberedTrail(m) {
      var o = [];
      for (var i = 0; i < m.trail.length && i < 28; i++) {
        var q = L.P[m.trail[i]], off = (i >= N ? 12 : 0);
        o.push('<circle cx="' + (q.x + off) + '" cy="' + q.y + '" r="12" fill="#fff3d1" stroke="#7a4518"/>' +
          '<text x="' + (q.x + off) + '" y="' + (q.y + 4.5) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#2a1606">' + (i + 1) + '</text>');
      }
      gUnder.innerHTML = o.join('');
    }

    function arrowAt(i) {
      var cp = countPos(i), x = cp.x, y, d;
      if (!L.vert) { y = cp.y + 16; d = 'M' + x + ' ' + y + 'l-11 16h7v12h8v-12h7z'; }
      else { x = cp.x + 16; y = cp.y; d = 'M' + x + ' ' + y + 'l16 -11v7h12v8h-12v7z'; }
      return '<path class="pz-arrow" d="' + d + '" fill="#ffd36b" stroke="#2a1606" stroke-width="1.5" stroke-linejoin="round"/>';
    }
    function highlight(i, on) {
      var g = gUnder.querySelector('[data-hl]');
      if (g) g.remove();
      if (i == null || i < 0 || !on) return;
      var p = L.P[i];
      gUnder.insertAdjacentHTML('beforeend', '<g data-hl><ellipse cx="' + p.x + '" cy="' + p.y + '" rx="' + (L.rx + 8) + '" ry="' + (L.ry + 8) + '" fill="url(#' + uid + 'g)" class="pz-pulse"/>' +
        '<ellipse cx="' + p.x + '" cy="' + p.y + '" rx="' + (L.rx + 4) + '" ry="' + (L.ry + 4) + '" fill="none" stroke="#ffe9a8" stroke-width="3"/>' +
        (on === 'arrow' ? arrowAt(i) : '') + '</g>');
    }

    function arcTo(id, x1, y1, s1, ms, delay, clock, lift, end) {
      var o = sh[id], x0 = o.x, y0 = o.y, h = Math.max(18, Math.hypot(x1 - x0, y1 - y0) * 0.35);
      clock.tween(ms, function (p) {
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        put(id, x0 + (x1 - x0) * e, y0 + (y1 - y0) * e - Math.sin(Math.PI * p) * h, o.s + (s1 - o.s) * e, true, lift ? 0 : 0);
      }, end, delay);
    }

    /* ---------------- the move, played out: lift into the hand, one shell a pit, the kasi */
    function play(res, clock, o, done) {
      var m = res.move, step = o.fast ? 60 : 140, liftMs = o.fast ? 110 : 260;
      var reduced = o.reduced, log = o.log || [];
      clearPreview(); gUnder.innerHTML = '';
      var from = at.pit[m.pit];
      at.pit[m.pit] = [];
      at.hand = from.slice();
      if (reduced) {
        /* no motion: the shells are simply where they go, and the path is numbered */
        for (var t = 0; t < m.trail.length; t++) { at.pit[m.trail[t]].push(at.hand.shift()); log.push({ pit: m.trail[t], t: clock.now() }); }
        pitsNow = m.sown.slice(); pitsNow[m.pit] = 0;
        if (m.capPit >= 0) { pitsNow[m.capPit] = m.cap; }
        numberedTrail(m);
        snapAll(); drawBadges();
        if (o.onDrop) o.onDrop(m.trail.length);
        clock.wait(o.fast ? 250 : 650, function () { capture(res, clock, o, done); });
        return;
      }
      var h0 = handAt(m.pit);
      hand.x = h0.x; hand.y = h0.y; hand.on = true;
      gUnder.innerHTML = '<use data-hand href="#' + uid + 'hd" transform="translate(' + h0.x.toFixed(1) + ' ' + (h0.y - 6).toFixed(1) + ') scale(' + L.shell.toFixed(2) + ')"/>';
      var handNode = gUnder.querySelector('[data-hand]');
      pitsNow[m.pit] = 0; drawBadges();
      sfx('lift', 'tap');
      from.forEach(function (id, k) {
        arcTo(id, h0.x + ((k % 4) - 1.5) * 6 * L.shell, h0.y - Math.floor(k / 4) * 4 * L.shell, L.shell, liftMs, k * 12, clock);
      });
      var k = 0;
      function moveHand(i2, ms) {
        var a = handAt(i2), x0 = hand.x, y0 = hand.y;
        clock.tween(ms, function (p) {
          hand.x = x0 + (a.x - x0) * p; hand.y = y0 + (a.y - y0) * p;
          if (handNode) handNode.setAttribute('transform', 'translate(' + hand.x.toFixed(1) + ' ' + (hand.y - 6).toFixed(1) + ') scale(' + L.shell.toFixed(2) + ')');
          for (var j = 0; j < at.hand.length; j++) {
            var sid = at.hand[j];
            put(sid, hand.x + ((j % 4) - 1.5) * 6 * L.shell, hand.y - Math.floor(j / 4) * 4 * L.shell, L.shell, j < 16, 0);
          }
        });
      }
      function drop() {
        if (k >= m.trail.length) {
          hand.on = false;
          clock.tween(160, function (p) { if (handNode) handNode.setAttribute('opacity', String(1 - p)); }, function () { gUnder.innerHTML = ''; });
          clock.wait(o.fast ? 90 : 260, function () { capture(res, clock, o, done); });
          return;
        }
        var pit = m.trail[k], id = at.hand.shift();
        at.pit[pit].push(id);
        var sp = slot(pit, at.pit[pit].length - 1, at.pit[pit].length);
        arcTo(id, sp.x, sp.y, sp.s, step * 0.8, 0, clock, false, function () {
          snapPlace(pit);
        });
        pitsNow[pit]++;
        log.push({ pit: pit, t: clock.now() });
        clock.wait(step * 0.8, function () { drawBadges(); sfx('tock', 'tap'); if (o.onDrop) o.onDrop(k); });
        k++;
        if (k < m.trail.length) moveHand(m.trail[k], step * 0.9);
        clock.wait(step, drop);
      }
      clock.wait(liftMs + 40, function () { moveHand(m.trail[0], step * 0.6); clock.wait(step * 0.6, drop); });
    }
    function capture(res, clock, o, done) {
      var m = res.move;
      gUnder.innerHTML = '';
      if (m.capPit < 0) return packUp(res, clock, o, done);
      var ids = at.pit[m.capPit], who = m.who;
      at.pit[m.capPit] = [];
      var cp = L.P[m.capPit], nxp = L.P[m.next];
      gOver.innerHTML = '<ellipse cx="' + nxp.x + '" cy="' + nxp.y + '" rx="' + (L.rx + 3) + '" ry="' + (L.ry + 3) + '" fill="none" stroke="#fff3dc" stroke-width="2.5" stroke-dasharray="5 5"/>' +
        '<ellipse cx="' + cp.x + '" cy="' + cp.y + '" rx="' + (L.rx + 12) + '" ry="' + (L.ry + 12) + '" fill="url(#' + uid + 'g)"' + (o.reduced ? '' : ' class="pz-glowfx"') + '/>';
      if (o.onCapture) o.onCapture(m);
      var wait = o.reduced ? 300 : (o.fast ? 250 : 520);
      clock.wait(wait, function () {
        sfx('chhan', 'coin');
        var base = at[who].length;
        ids.forEach(function (id, j) {
          at[who].push(id);
          var sp = slot(who, base + j, base + ids.length);
          if (o.reduced) put(id, sp.x, sp.y, sp.s, true);
          else arcTo(id, sp.x, sp.y, sp.s, o.fast ? 300 : 560, j * (o.fast ? 18 : 40), clock);
        });
        pitsNow[m.capPit] = 0; storeNow[who] += m.cap; drawBadges();
        var s = L.S[who];
        gOver.innerHTML = '<ellipse cx="' + s.x + '" cy="' + s.y + '" rx="' + (s.rx + 16) + '" ry="' + (s.ry + 16) + '" fill="url(#' + uid + 'g)"' + (o.reduced ? ' opacity=".6"' : ' class="pz-glowfx"') + '/>';
        clock.wait(o.reduced ? 500 : (o.fast ? 450 : 900 + ids.length * 40), function () { gOver.innerHTML = ''; packUp(res, clock, o, done); });
      });
    }
    function packUp(res, clock, o, done) {
      if (!res.packed) { finishMove(res); return done(); }
      clock.wait(o.fast ? 200 : 500, function () {
        sfx('chhan', 'coin');
        for (var i = 0; i < N; i++) {
          var who = i < n ? 'you' : 'gattu', ids = at.pit[i];
          at.pit[i] = [];
          ids.forEach(function (id, j) {
            at[who].push(id);
            var sp = slot(who, at[who].length - 1, at[who].length);
            if (o.reduced) put(id, sp.x, sp.y, sp.s, true);
            else arcTo(id, sp.x, sp.y, sp.s, 620, i * 50 + j * 20, clock);
          });
        }
        clock.wait(o.reduced ? 200 : 1100, function () { finishMove(res); done(); });
      });
    }
    function finishMove(res) {
      pitsNow = res.pits.slice(); storeNow = { you: res.store.you, gattu: res.store.gattu };
      snapAll(); drawBadges();
    }

    return {
      layout: layout, setState: setState, preview: preview, clearPreview: clearPreview, play: play,
      highlight: highlight, buttons: function () { return btns; }, L: function () { return L; },
      pits: function () { return pitsNow.slice(); },
      drawn: function (i) { var c = 0; at.pit[i].forEach(function (id) { if (sh[id].vis) c++; }); return c; },
      labels: function (l) { labels = l; drawBadges(); },
      destroy: function () { svgB.remove(); svg.remove(); hits.remove(); }
    };
  }

  /* pit names a child (and a screen reader) can use: yours 1–7 from your left, Gattu's 1–7 from his */
  function pzName(i, n) { return i < n ? 'your pit ' + (i + 1) : 'Gattu’s pit ' + (i - n + 1); }

  function pallanguzhi(host, opts, done) {
    pzCss();
    opts = opts || {};
    var n = 7, store = pzStore(), clock = pzClock();
    var REDUCED = !!opts.reduced || !!opts.calm || calm();
    var mem = store.get('pz.gattu', { tier: 0, run: [] });
    var openIx = store.get('pz.open', 0) | 0;
    var jaldi = !!store.get('pz.jaldi', false);
    var coached = !!store.get('pz.coached', false);
    var st, busy = false, over = false, armed = -1, focusPit = 0, moves = 0, ruleSaid = false, finished = false;
    var tier = PZ.TIERS[Math.max(0, Math.min(PZ.TIERS.length - 1, mem.tier | 0))];
    var drops = [];
    var full = false;

    var root = el('div', 'pz-root' + (REDUCED ? ' pz-reduced' : ''));
    root.setAttribute('role', 'application');
    root.setAttribute('aria-label', 'Pallanguzhi board');
    root.innerHTML =
      '<div class="pz-top">' +
        '<button type="button" class="pz-b" data-pz="exit" aria-label="Pause and leave full screen">✕</button>' +
        '<p class="pz-say" aria-live="polite"></p>' +
        '<button type="button" class="pz-b" data-pz="jaldi" aria-pressed="' + jaldi + '" title="Sow fast">Jaldi</button>' +
        '<button type="button" class="pz-b" data-pz="coach" aria-label="How to play">?</button>' +
      '</div>' +
      '<div class="pz-stage"></div>' +
      '<p class="pz-sr" aria-live="polite"></p>' +
      '<div class="pz-coach" hidden></div>' +
      '<div class="pz-over" hidden></div>';
    host.innerHTML = ''; host.appendChild(root);
    var stageEl = root.querySelector('.pz-stage'), sayEl = root.querySelector('.pz-say'),
        srEl = root.querySelector('.pz-sr'), overEl = root.querySelector('.pz-over'), coachEl = root.querySelector('.pz-coach');
    var board = pzBoard(stageEl, n, 70, { labels: { you: 'You', gattu: 'Gattu · ' + tier.name }, onButtons: wire });

    function say(t) { sayEl.textContent = t || ''; }
    function sr(t) { srEl.textContent = t || ''; }

    function newGame() {
      st = PZ.fresh(PZ.OPENINGS[openIx % PZ.OPENINGS.length], 36);
      store.set('pz.open', (openIx + 1) % PZ.OPENINGS.length);
      busy = false; over = false; armed = -1; moves = 0;
      overEl.hidden = true; overEl.innerHTML = '';
      board.labels({ you: 'You', gattu: 'Gattu · ' + tier.name });
      board.setState(st.pits, st.store);
      say(''); refreshButtons();
    }
    function goFull(on) {
      full = !!on;
      root.classList.toggle('pz-full', full);
      lockPage(full);
      board.layout();
      if (full) { var b = board.buttons()[focusPit]; if (b) { try { b.focus({ preventScroll: true }); } catch (e) {} } }
    }
    function canPlay(i) { return !over && !busy && st && st.turn === 'you' && i >= 0 && i < n && st.pits[i] > 0 && coachEl.hidden && overEl.hidden; }
    function line(i) {
      var c = st.pits[i];
      if (!c) return 'Your pit ' + (i + 1) + ', empty.';
      var r = PZ.apply(st, i);
      return 'Pit ' + (i + 1) + ', ' + c + ' shell' + (c === 1 ? '' : 's') + ', lands in ' + pzName(r.move.last, n) +
        (r.move.cap ? ', takes ' + r.move.cap : '') + '.';
    }
    function refreshButtons() {
      board.buttons().forEach(function (b, i) {
        b.tabIndex = i === focusPit ? 0 : -1;
        b.setAttribute('aria-label', st ? line(i) : 'Pit ' + (i + 1));
        b.setAttribute('aria-disabled', canPlay(i) ? 'false' : 'true');
      });
    }
    function showPreview(i) {
      if (!canPlay(i)) { cancel(); return; }
      armed = i;
      var r = PZ.apply(st, i);
      board.preview(r);
      var t = r.move.cap ? '+' + r.move.cap + ' — the kasi!' : 'Lands in ' + pzName(r.move.last, n) + '.';
      if (tier.id === 'naya' && !r.over) {
        var rep = PZ.bestReply(r);
        if (rep.cap) t += ' …then Gattu can take ' + rep.cap + '.';
      }
      say(t + ' Tap again to sow.');
      sr(line(i));
    }
    function cancel() {
      if (armed < 0) return;
      armed = -1; board.clearPreview();
      if (!busy && !over) say('');
    }
    function commit(i) {
      if (!canPlay(i)) return;
      armed = -1; busy = true; moves++;
      var r = PZ.apply(st, i);
      say('');
      runMove(r, function () { after(r); });
    }
    function runMove(r, then) {
      board.play(r, clock, { fast: jaldi, reduced: REDUCED, log: drops,
        onCapture: function (m) {
          if (!ruleSaid) { ruleSaid = true; say('Empty pit after the last shell, so ' + (m.who === 'you' ? 'you take' : 'Gattu takes') + ' the pit beyond: the kasi. +' + m.cap); }
          else say((m.who === 'you' ? '+' : 'Gattu +') + m.cap + ' — the kasi!');
        } }, then);
    }
    function after(r) {
      st = { pits: r.pits, store: r.store, turn: r.turn, over: r.over, target: r.target };
      busy = false;
      if (r.over) return end(r);
      refreshButtons();
      if (st.turn === 'gattu') gattu();
      else if (!sayEl.textContent) say('Your turn.');
    }
    function gattu() {
      busy = true; refreshButtons();
      say('Gattu is thinking…');
      clock.wait(REDUCED ? 200 : 450, function () {
        var pit = PZ.choose(st, tier.depth);
        if (pit < 0) { busy = false; return; }
        var r = PZ.apply(st, pit);
        /* his ghost trail first, slowly, so a child sees what a good move looks like */
        board.preview(r, { gattu: true });
        say('Gattu sows his pit ' + (pit - n + 1) + (r.move.cap ? ' — watch the kasi' : '') + '…');
        sr('Gattu sows his pit ' + (pit - n + 1) + ', lands in ' + pzName(r.move.last, n) + (r.move.cap ? ', takes ' + r.move.cap : '') + '.');
        clock.wait(jaldi ? 500 : 1100, function () {
          runMove(r, function () {
            if (!r.move.cap && !r.over) say('Your turn.');
            after(r);
          });
        });
      });
    }
    function end(r) {
      over = true; refreshButtons();
      var w = PZ.winner(st), res = w === 'you' ? 'win' : w === 'gattu' ? 'loss' : 'draw';
      var was = tier;
      mem = PZ.adapt(mem, res); store.set('pz.gattu', mem);
      tier = PZ.TIERS[mem.tier];
      var head = w === 'you' ? 'Your store is fuller — shabash!' : w === 'gattu' ? 'Gattu’s store is fuller this time' : 'Dead even!';
      var note = tier !== was ? (tier.depth > was.depth ? 'Next game Gattu plays as ' + tier.name + ': he ' + tier.says + '.'
        : 'Next game Gattu plays as ' + tier.name + '.') : 'Gattu played as ' + was.name + ': he ' + was.says + '.';
      overEl.innerHTML = '<div class="pz-card" role="dialog" aria-label="Game over">' +
        '<h3>' + head + '</h3>' +
        '<p>You <b>' + st.store.you + '</b> · Gattu <b>' + st.store.gattu + '</b>' + (r.packed ? ' — a side ran out, so every shell went home to its own store.' : '.') + '</p>' +
        '<p>' + note + '</p>' +
        '<p class="pz-credit">Pallanguzhi, Tamil Nadu; played across South India as Ali Guli Mane (Karnataka), Vamana Guntalu (Andhra Pradesh) and Kuzhipara (Kerala). Ask your family what <i>you</i> call it.</p>' +
        '<div class="pz-row"><button type="button" class="pz-go" data-pz="again">Play again</button>' +
        '<button type="button" class="pz-go ghost" data-go="out">Finish</button></div></div>';
      overEl.hidden = false;
      say('');
      clock.wait(80, function () { var b = overEl.querySelector('[data-pz="again"]'); if (b) try { b.focus({ preventScroll: true }); } catch (e) {} });
    }
    function bail() {
      if (finished) return;
      finished = true;
      var w = st ? PZ.winner(st) : 'gattu';
      lockPage(false);
      clock.kill();
      if (typeof done === 'function') done({ win: over && w === 'you', score: st ? st.store.you : 0, asked: 0, firstTryRight: 0,
        level: opts.level || 1, levelNext: opts.level || 1 });
    }
    function pause() {
      cancel();
      clock.hold(true);
      goFull(false);
      overEl.innerHTML = '<div class="pz-card" role="dialog" aria-label="Paused"><h3>Paused</h3>' +
        '<p>The board waits exactly as you left it.</p>' +
        '<div class="pz-row"><button type="button" class="pz-go" data-pz="resume">Resume</button>' +
        '<button type="button" class="pz-go ghost" data-go="out">Finish</button></div></div>';
      overEl.hidden = false;
      var rb = overEl.querySelector('[data-pz="resume"]');   /* now: the held clock runs no waits */
      if (rb) try { rb.focus({ preventScroll: true }); } catch (e) {}
    }

    /* ---------------- input: press-and-hold or hover previews, lift away cancels, tap again sows */
    var press = null;
    function wire(btns) {
      btns.forEach(function (b, i) {
        b.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !press) showPreview(i); });
        b.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !press && armed === i) cancel(); });
        b.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          focusPit = i; refreshButtons();
          try { b.focus({ preventScroll: true }); } catch (err) {}
          if (!canPlay(i)) return;
          press = { i: i, commit: armed === i, id: e.pointerId, mouse: e.pointerType === 'mouse' };
          if (!press.commit) showPreview(i);
        });
        b.addEventListener('focus', function () { focusPit = i; });
      });
    }
    function inside(b, e) {
      var r = b.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    }
    function onUp(e) {
      if (!press || (press.id != null && e.pointerId !== press.id)) return;
      var p = press; press = null;
      var b = board.buttons()[p.i];
      if (!b || !inside(b, e)) { cancel(); return; }       /* lifted away: nothing happens */
      if (p.commit || p.mouse) commit(p.i);                 /* the second tap (or a click) sows */
    }
    function onCancel() { if (press) { press = null; cancel(); } }
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onCancel);

    function onKey(e) {
      if (finished) return;
      if (!host.isConnected) { teardown(); return; }
      var k = e.key;
      if (!coachEl.hidden) { coachKey(e); return; }
      if (!overEl.hidden) return;
      if (busy || over || !st) return;
      var L = board.L(), prev = k === 'ArrowLeft' || (L && L.vert && k === 'ArrowDown'),
          nextK = k === 'ArrowRight' || (L && L.vert && k === 'ArrowUp');
      if (prev || nextK) {
        e.preventDefault();
        focusPit = (focusPit + (nextK ? 1 : n - 1)) % n;
        refreshButtons();
        var b = board.buttons()[focusPit];
        if (b) try { b.focus({ preventScroll: true }); } catch (err) {}
        if (armed >= 0) showPreview(focusPit);
        else { board.highlight(focusPit, true); sr(line(focusPit)); }
      } else if (k === ' ' || e.code === 'Space') { e.preventDefault(); showPreview(focusPit); }
      else if (k === 'Enter') { e.preventDefault(); commit(focusPit); }
      else if (k === 'Escape') { e.preventDefault(); cancel(); }
      else if (k >= '1' && k <= '7') { e.preventDefault(); focusPit = +k - 1; refreshButtons(); showPreview(focusPit); }
    }
    document.addEventListener('keydown', onKey);

    root.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-pz],[data-go]') : null;
      if (!t) return;
      var a = t.getAttribute('data-pz');
      if (t.getAttribute('data-go') === 'out') return bail();
      if (a === 'exit') pause();
      else if (a === 'resume') { overEl.hidden = true; clock.hold(false); goFull(true); }
      else if (a === 'again') { newGame(); }
      else if (a === 'jaldi') { jaldi = !jaldi; t.setAttribute('aria-pressed', String(jaldi)); store.set('pz.jaldi', jaldi); }
      else if (a === 'coach') coach(0);
    });

    var rsT = 0;
    function onResize() { clearTimeout(rsT); rsT = setTimeout(function () { if (!busy) board.layout(); else clock.wait(50, onResize); }, 120); }
    W.addEventListener('resize', onResize);

    /* ---------------- the coach: three moves on a tiny board (sow, a kasi, the round's end) */
    var COACH = [
      { you: [3, 1, 2], gattu: [2, 2, 2], st: { you: 0, gattu: 0 }, pit: 0,
        say: '<b>Sow.</b> Tap the glowing pit. Its shells go round anticlockwise, one in each pit.' },
      { you: [2, 1, 1], gattu: [1, 0, 4], st: { you: 0, gattu: 0 }, pit: 2,
        say: '<b>The kasi.</b> If the pit after your last shell is empty, the pit beyond it is yours. Tap the glowing pit.' },
      { you: [1, 0, 2], gattu: [0, 0, 0], st: { you: 5, gattu: 4 }, pit: 0,
        say: '<b>Round end.</b> When a side has nothing to sow, every shell left goes to its own store. Tap the glowing pit.' }
    ];
    var cb = null, cstep = 0, cbusy = false, cclock = null;
    function coach(step) {
      cancel();
      cstep = step || 0;
      coachEl.innerHTML = '<div class="pz-coachcard" role="dialog" aria-label="How to play Pallanguzhi">' +
        '<div class="pz-steps" aria-hidden="true"><i></i><i></i><i></i></div>' +
        '<div class="pz-coachboard"></div><p class="pz-coachline" aria-live="polite"></p>' +
        '<div class="pz-row"><button type="button" class="pz-go ghost" data-pc="skip">Skip</button>' +
        '<button type="button" class="pz-go" data-pc="next" hidden>Next</button></div></div>';
      coachEl.hidden = false;
      if (cb) cb.destroy();
      if (cclock) cclock.kill();
      cclock = pzClock();
      var stg = coachEl.querySelector('.pz-coachboard');
      cb = pzBoard(stg, 3, 18, { labels: { you: 'You', gattu: 'Gattu' }, onButtons: function (bs) {
        bs.forEach(function (b, i) {
          b.addEventListener('click', function () { coachTap(i); });
        });
      } });
      coachStep();
    }
    function coachStep() {
      var c = COACH[cstep];
      var ps = coachEl.querySelectorAll('.pz-steps i');
      for (var i = 0; i < ps.length; i++) ps[i].className = i <= cstep ? 'on' : '';
      cb.layout();
      cb.setState(c.you.concat(c.gattu), c.st);
      cb.highlight(c.pit, 'arrow');
      cb.buttons().forEach(function (b, i) {
        b.tabIndex = i === c.pit ? 0 : -1;
        b.setAttribute('aria-label', i === c.pit ? 'Pit ' + (i + 1) + ', tap to sow' : 'Pit ' + (i + 1));
      });
      coachEl.querySelector('.pz-coachline').innerHTML = c.say;
      coachEl.querySelector('[data-pc="next"]').hidden = true;
      cbusy = false;
      var b = cb.buttons()[c.pit];
      if (b) try { b.focus({ preventScroll: true }); } catch (e) {}
    }
    function coachTap(i) {
      var c = COACH[cstep];
      if (cbusy || i !== c.pit) return;
      cbusy = true;
      cb.highlight(-1);
      var s0 = { pits: c.you.concat(c.gattu), store: { you: c.st.you, gattu: c.st.gattu }, turn: 'you', over: false, target: 99 };
      var r = PZ.apply(s0, i);
      cb.play(r, cclock, { fast: false, reduced: REDUCED }, function () {
        var line2 = cstep === 0 ? 'One shell in each pit, round the corner into Gattu’s side. That is sowing.'
          : cstep === 1 ? 'The pit after your last shell was empty, so the <b>' + r.move.cap + '</b> beyond it went to your store.'
          : 'Gattu’s side was empty, so the round ended and your shells went home to your store.';
        coachEl.querySelector('.pz-coachline').innerHTML = line2;
        var nx = coachEl.querySelector('[data-pc="next"]');
        nx.hidden = false; nx.textContent = cstep < 2 ? 'Next' : 'Play';
        try { nx.focus({ preventScroll: true }); } catch (e) {}
      });
    }
    function coachEnd() {
      coachEl.hidden = true; coachEl.innerHTML = '';
      if (cb) { cb.destroy(); cb = null; }
      if (cclock) { cclock.kill(); cclock = null; }
      if (!coached) { coached = true; store.set('pz.coached', true); }
      var b = board.buttons()[focusPit];
      if (b) try { b.focus({ preventScroll: true }); } catch (e) {}
    }
    function coachKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); coachEnd(); }
      else if ((e.key === 'Enter' || e.key === ' ') && !cbusy && e.target && !e.target.closest('button')) { e.preventDefault(); coachTap(COACH[cstep].pit); }
    }
    coachEl.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-pc]') : null;
      if (!t) return;
      var a = t.getAttribute('data-pc');
      if (a === 'skip') coachEnd();
      else if (a === 'next') { if (cstep < 2) { cstep++; coachStep(); } else coachEnd(); }
    });

    /* ---------------- boot: straight to the board, full-screen; the coach the first time only */
    newGame();
    goFull(true);
    if (!coached) coach(0);

    /* the checks' window into the real state — never read by the app */
    host.__pz = { state: function () { return st; }, board: board, drops: drops, tier: function () { return tier.id; },
      setState: function (s) { st = s; board.setState(s.pits, s.store); refreshButtons(); }, busy: function () { return busy || clock.busy() > 0; },
      preview: function (i) { showPreview(i); }, commit: commit, mem: function () { return mem; } };

    function teardown() {
      if (teardown.done) return;
      teardown.done = true;
      finished = true;
      lockPage(false);
      clock.kill(); if (cclock) cclock.kill();
      clearTimeout(rsT);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onCancel);
      W.removeEventListener('resize', onResize);
      try { delete host.__pz; } catch (e) {}
    }
    teardown.destroy = teardown;
    return teardown;
  }

  /* ============================================================ GILLI DANDA
     The oldest bat-and-ball in the gully: tip the gilli up with a tap on its
     raised end, and while it spins in the air, tap again to swing the danda.
     The closer your swing to the sweet moment, the farther it flies. Three
     strikes; 90 gaz between them takes the game. One tap does everything —
     the whole stage is the button (Space works the same). */
  function gillidanda(host, opts, done) {
    css();
    var Wd = 860, Ht = 420, GY = 330;
    var phase = 'ready', turn = 0, total = 0, over = false;
    var raf = null, timers = [], t0 = 0;
    var FLIP_MS = 1300, SWEET = 0.62, gaz = 0, flyT = 0, flyT0 = 0, flyFrom = { x: 200, y: 140 }, quality = 0;
    var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    var wrap = el('div', 'gy-wrap');
    var hud = el('div', 'gy-hud',
      '<span class="gy-pill">Strike <b id="gdT">1</b> of 3</span>' +
      '<span class="gy-pill" id="gdM">tap to tip the gilli up</span>' +
      '<span class="gy-pill">Total <b id="gdD">0</b> gaz</span>');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + Ht);
    svg.setAttribute('class', 'gy-stage');
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', 'Gilli danda. Tap once to tip the gilli up, tap again at the right moment to strike.');
    svg.setAttribute('tabindex', '0');
    var hint = el('div', 'gy-hint',
      '<b>Tap</b> (or <b>Space</b>): once to tip the gilli, again while it spins — the closer to the ' +
      'glowing ring, the farther it flies. <b>90 gaz</b> across three strikes wins.');
    wrap.appendChild(hud); wrap.appendChild(svg); wrap.appendChild(hint);
    host.innerHTML = ''; host.appendChild(wrap);

    function msg(m2) { document.getElementById('gdM').textContent = m2; }
    function draw() {
      var out = '<rect width="' + Wd + '" height="' + Ht + '" fill="var(--card2)"/>' +
        '<rect y="' + GY + '" width="' + Wd + '" height="' + (Ht - GY) + '" fill="#b98d4f" opacity=".5"/>' +
        '<path d="M0 ' + GY + 'H' + Wd + '" stroke="#8a6435" stroke-width="3"/>';
      /* distance flags every 30 gaz so the flight reads as a journey */
      for (var f = 1; f <= 4; f++) {
        var fx = 200 + f * 150;
        out += '<path d="M' + fx + ' ' + GY + 'v-26l16 6-16 6" fill="none" stroke="#8a6435" stroke-width="2.6"/>' +
          '<text x="' + fx + '" y="' + (GY + 24) + '" text-anchor="middle" font-size="13" font-weight="700" ' +
          'fill="var(--text2)">' + (f * 30) + '</text>';
      }
      /* the danda hand: a simple striker post at the pitch */
      out += '<circle cx="200" cy="' + (GY - 6) + '" r="7" fill="#6b4a22"/>';
      var now = Date.now();
      if (phase === 'ready') {
        /* the gilli lies tipped on its stone, one end up, asking for the tap */
        out += '<g transform="translate(200 ' + (GY - 10) + ') rotate(-24)">' +
          '<rect x="-30" y="-5" width="60" height="10" rx="5" fill="#c99a4b" stroke="#7a5320" stroke-width="2"/></g>' +
          '<circle cx="222" cy="' + (GY - 4) + '" r="8" fill="#9a9a9a"/>';
      } else if (phase === 'air') {
        var tt = Math.min(1, (now - t0) / FLIP_MS);
        var gy2 = (GY - 40) - Math.sin(tt * Math.PI) * 120;
        var near = 1 - Math.abs(tt - SWEET) / SWEET;
        out += '<g transform="translate(200 ' + gy2.toFixed(1) + ') rotate(' + (tt * 720).toFixed(0) + ')">' +
          '<rect x="-30" y="-5" width="60" height="10" rx="5" fill="#c99a4b" stroke="#7a5320" stroke-width="2"/></g>';
        /* the sweet ring: swells as the moment comes — the timing IS the game,
           so this motion stays even for reduced-motion players */
        out += '<circle cx="200" cy="' + (GY - 160) + '" r="' + (26 + near * 22).toFixed(1) + '" fill="none" ' +
          'stroke="var(--accent2)" stroke-width="' + (3 + near * 5).toFixed(1) + '" opacity="' + (0.35 + near * 0.6).toFixed(2) + '"/>';
      } else if (phase === 'fly') {
        var d2 = Math.min(1, flyT);
        var fx2 = flyFrom.x + (gaz / 130) * 620 * d2;
        var fy2 = flyFrom.y + (GY - 14 - flyFrom.y) * (d2 * d2) - Math.sin(d2 * Math.PI) * 90 * quality;
        out += '<g transform="translate(' + fx2.toFixed(1) + ' ' + fy2.toFixed(1) + ') rotate(' + (d2 * 900).toFixed(0) + ')">' +
          '<rect x="-30" y="-5" width="60" height="10" rx="5" fill="#c99a4b" stroke="#7a5320" stroke-width="2"/></g>';
      } else if (phase === 'landed') {
        out += '<g transform="translate(' + (200 + (gaz / 130) * 620).toFixed(1) + ' ' + (GY - 8) + ')">' +
          '<rect x="-30" y="-5" width="60" height="10" rx="5" fill="#c99a4b" stroke="#7a5320" stroke-width="2"/></g>' +
          '<text x="' + (200 + (gaz / 130) * 620).toFixed(1) + '" y="' + (GY - 26) + '" text-anchor="middle" ' +
          'font-size="24" font-weight="800" fill="var(--accent)">' + gaz + ' gaz</text>';
      }
      svg.innerHTML = out;
    }
    function loop() {
      if (over) return;
      var now = Date.now();
      if (phase === 'air' && now - t0 > FLIP_MS) {
        phase = 'ready'; msg('it fell — tap to tip it again (no strike lost)');
      }
      if (phase === 'fly') {
        flyT = REDUCED ? 1 : Math.min(1, (now - flyT0) / 900);
        if (flyT >= 1) { land(); }
      }
      draw();
      raf = requestAnimationFrame(loop);
    }
    function land() {
      phase = 'landed';
      total += gaz;
      document.getElementById('gdD').textContent = total;
      msg(quality > 0.85 ? 'PERFECT strike!' : quality > 0.6 ? 'a fine hit' : 'caught the edge');
      timers.push(setTimeout(function () {
        turn++;
        if (turn >= 3) return finish();
        document.getElementById('gdT').textContent = turn + 1;
        phase = 'ready'; msg('tap to tip the gilli up');
      }, 1100));
    }
    function finish() {
      over = true;
      var win = total >= 90;
      msg(win ? 'Gilli jeet — ' + total + ' gaz!' : total + ' gaz — the gully claps anyway');
      timers.push(setTimeout(function () {
        done({ win: win, score: total, sikke: win ? 10 : 4 });
      }, 1200));
    }
    function tap() {
      if (over) return;
      if (phase === 'ready') { phase = 'air'; t0 = Date.now(); msg('NOW — tap as the ring swells!'); return; }
      if (phase === 'air') {
        var tt = Math.min(1, (Date.now() - t0) / FLIP_MS);
        quality = Math.max(0.12, 1 - Math.abs(tt - SWEET) / SWEET);
        gaz = Math.round(8 + quality * quality * 122);
        flyFrom = { x: 200, y: (GY - 40) - Math.sin(tt * Math.PI) * 120 };
        flyT = 0; flyT0 = Date.now(); phase = 'fly'; msg('');
      }
    }
    function onKey(e) {
      if (e.key === ' ' || e.key === 'Enter') { tap(); e.preventDefault(); }
    }
    svg.addEventListener('pointerdown', tap);
    document.addEventListener('keydown', onKey);
    draw(); loop();
    try { svg.focus({ preventScroll: true }); } catch (e) {}
    function teardown() {
      over = true;
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.removeEventListener('keydown', onKey);
    }
    teardown.destroy = teardown;
    return teardown;
  }

  /* ================================================================= PITHOO
     Lagori / seven stones. Knock the tower down with the ball — the same
     grab-pull-release sling as carrom and kancha, one grammar everywhere —
     then rebuild it before Gattu's ball comes back: tap the fallen stones
     in order, biggest first, 1 to 7. Three balls; one full rebuild wins. */
  function pithoo(host, opts, done) {
    css();
    var Wd = 860, Ht = 460, SX = 430, SY = 200;
    var phase = 'throw', balls = 3, over = false, raf = null, timers = [];
    var ball = { x: 430, y: 400, vx: 0, vy: 0, r: 15, flying: false };
    var angle = -Math.PI / 2, power = 0.6;
    var stones = [], next = 1, deadline = 0, shake = 0;
    var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    function stackUp() {
      stones = [];
      for (var i = 0; i < 7; i++) {
        var w2 = 108 - i * 12;
        stones.push({ n: i + 1, w: w2, x: SX, y: SY + 84 - i * 24, down: false, placed: false });
      }
    }
    stackUp();

    var wrap = el('div', 'gy-wrap');
    var hud = el('div', 'gy-hud',
      '<span class="gy-pill">Balls <b id="ptB">3</b></span>' +
      '<span class="gy-pill" id="ptM">knock the tower down!</span>' +
      '<span class="gy-pill" id="ptC" hidden>rebuild! <b id="ptT">10</b>s</span>');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + Ht);
    svg.setAttribute('class', 'gy-stage');
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', 'Pithoo. Sling the ball at the tower of seven stones, then rebuild it in order before time runs out.');
    svg.setAttribute('tabindex', '0');
    var hint = el('div', 'gy-hint',
      '<b>Grab the ball</b>, pull back, let go — knock the tower down. Then <b>tap the stones ' +
      'biggest-first (1→7)</b> to rebuild before Gattu’s ball returns. Keys: ← → aim · ↑ ↓ power · ' +
      '<b>Space</b> throws · <b>1–7</b> rebuild.');
    wrap.appendChild(hud); wrap.appendChild(svg); wrap.appendChild(hint);
    host.innerHTML = ''; host.appendChild(wrap);

    function msg(m2) { document.getElementById('ptM').textContent = m2; }
    function draw() {
      var out = '<rect width="' + Wd + '" height="' + Ht + '" fill="var(--card2)"/>' +
        '<ellipse cx="' + SX + '" cy="' + (SY + 116) + '" rx="150" ry="26" fill="var(--ground)" opacity=".7"/>' +
        '<path d="M60 418H' + (Wd - 60) + '" stroke="var(--text2)" stroke-width="2" opacity=".3" stroke-dasharray="5 8"/>';
      stones.forEach(function (st2) {
        var lit = phase === 'stack' && !st2.placed && st2.n === next;
        out += '<g data-stone="' + st2.n + '" transform="translate(' + st2.x.toFixed(1) + ' ' + st2.y.toFixed(1) + ')' +
          (st2.down && !st2.placed ? ' rotate(' + (st2.n * 37 % 25 - 12) + ')' : '') + '">' +
          '<rect x="' + (-st2.w / 2) + '" y="-11" width="' + st2.w + '" height="22" rx="10" ' +
          'fill="' + (st2.placed ? '#8f6428' : '#a8793a') + '" stroke="' + (lit ? 'var(--accent2)' : '#6b4a22') +
          '" stroke-width="' + (lit ? 5 : 2.5) + '"/>' +
          '<text y="6" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">' + st2.n + '</text></g>';
      });
      /* the ball, and its sling while aiming */
      if (phase === 'throw') {
        var len = 40 + power * 90;
        var tx = ball.x + Math.cos(angle) * len, ty = ball.y + Math.sin(angle) * len;
        out += '<path d="M' + ball.x + ' ' + ball.y + 'L' + tx.toFixed(1) + ' ' + ty.toFixed(1) +
          '" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" opacity=".8"/>';
      }
      out += '<circle id="ptBall" cx="' + ball.x.toFixed(1) + '" cy="' + ball.y.toFixed(1) + '" r="' + ball.r +
        '" fill="#7a3b2e" stroke="#4a2018" stroke-width="2.5"/>' +
        '<path d="M' + (ball.x - 6) + ' ' + (ball.y - 3) + 'q6 -5 12 0" stroke="#c9a08f" stroke-width="2" fill="none"/>';
      if (shake > 0) out = '<g transform="translate(' + ((shake % 2 ? 1 : -1) * 5) + ' 0)">' + out + '</g>';
      svg.innerHTML = out;
    }
    function knock() {
      var hit = false;
      stones.forEach(function (st2) {
        if (Math.abs(ball.x - st2.x) < st2.w / 2 + ball.r && Math.abs(ball.y - st2.y) < 26 + ball.r) hit = true;
      });
      if (!hit) return false;
      /* the tower goes: every stone tumbles to its own patch of dust */
      stones.forEach(function (st2, i) {
        st2.down = true;
        st2.x = 150 + ((i * 197 + 89) % 560);
        st2.y = 300 + ((i * 131 + 40) % 110);
      });
      return true;
    }
    function loop() {
      if (over) return;
      if (ball.flying) {
        ball.x += ball.vx; ball.y += ball.vy; ball.vy += 0.18;
        if (knock()) {
          ball.flying = false;
          phase = 'stack'; next = 1;
          deadline = Date.now() + 11000;
          document.getElementById('ptC').hidden = false;
          msg('rebuild — tap 1 first!');
        } else if (ball.y < -30 || ball.x < -30 || ball.x > Wd + 30) {
          ball.flying = false;
          balls--; document.getElementById('ptB').textContent = balls;
          if (balls <= 0) return finish(false);
          ball.x = 430; ball.y = 400; phase = 'throw';
          msg('missed — pull back and try again');
        }
      }
      if (phase === 'stack') {
        var left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        document.getElementById('ptT').textContent = left;
        if (Date.now() > deadline) {
          balls--; document.getElementById('ptB').textContent = balls;
          document.getElementById('ptC').hidden = true;
          if (balls <= 0) return finish(false);
          stackUp(); next = 1; phase = 'throw';
          ball.x = 430; ball.y = 400;
          msg('Gattu’s ball came back! Knock it down again');
        }
      }
      if (shake > 0) shake--;
      draw();
      raf = requestAnimationFrame(loop);
    }
    function finish(win) {
      over = true;
      msg(win ? 'PITHOO! The tower stands!' : 'Gattu takes the round');
      document.getElementById('ptC').hidden = true;
      timers.push(setTimeout(function () {
        done({ win: !!win, score: win ? 70 : (next - 1) * 8, sikke: win ? 10 : 4 });
      }, 1100));
    }
    function throwBall() {
      if (phase !== 'throw' || ball.flying || over) return;
      var v = 7 + power * 13;
      ball.vx = Math.cos(angle) * v; ball.vy = Math.sin(angle) * v;
      ball.flying = true;
    }
    function placeStone(n2) {
      if (phase !== 'stack' || over) return;
      var st2 = stones[n2 - 1];
      if (!st2 || st2.placed) return;
      if (n2 !== next) { shake = 6; msg('biggest first — stone ' + next + '!'); return; }
      st2.placed = true; st2.down = false;
      st2.x = SX; st2.y = SY + 84 - (n2 - 1) * 24;
      next++;
      msg(next <= 7 ? 'now stone ' + next : '');
      if (next > 7) finish(true);
    }
    /* the sling: same grammar as carrom and kancha */
    var dragging = null;
    function pt2(e) {
      var r = svg.getBoundingClientRect();
      var t = (e.touches && e.touches[0]) || e;
      return { x: (t.clientX - r.left) / r.width * Wd, y: (t.clientY - r.top) / r.height * Ht };
    }
    function dstart(e) {
      if (over) return;
      var q = pt2(e);
      var g2 = e.target.closest ? e.target.closest('[data-stone]') : null;
      if (g2) { placeStone(+g2.getAttribute('data-stone')); return; }
      if (phase !== 'throw') return;
      var dx = q.x - ball.x, dy = q.y - ball.y;
      if (dx * dx + dy * dy < 56 * 56) dragging = { armed: false };
      if (e.cancelable) e.preventDefault();
    }
    function dmove(e) {
      if (!dragging || over || phase !== 'throw') return;
      var q = pt2(e);
      var dx = ball.x - q.x, dy = ball.y - q.y;
      angle = Math.atan2(dy, dx);
      power = Math.max(0.15, Math.min(1, Math.sqrt(dx * dx + dy * dy) / 170));
      dragging.armed = Math.sqrt(dx * dx + dy * dy) > 26;
      draw();
      if (e.cancelable) e.preventDefault();
    }
    function dend() {
      if (!dragging) return;
      var was = dragging; dragging = null;
      if (was.armed) throwBall();
    }
    svg.addEventListener('pointerdown', dstart);
    svg.addEventListener('pointermove', dmove);
    svg.addEventListener('pointerup', dend);
    svg.addEventListener('pointercancel', dend);
    function onKey(e) {
      if (over) return;
      var k = e.key;
      if (phase === 'throw') {
        if (k === 'ArrowLeft') { angle -= 0.08; draw(); e.preventDefault(); }
        else if (k === 'ArrowRight') { angle += 0.08; draw(); e.preventDefault(); }
        else if (k === 'ArrowUp') { power = Math.min(1, power + 0.07); draw(); e.preventDefault(); }
        else if (k === 'ArrowDown') { power = Math.max(0.15, power - 0.07); draw(); e.preventDefault(); }
        else if (k === ' ' || k === 'Enter') { throwBall(); e.preventDefault(); }
      } else if (phase === 'stack' && k >= '1' && k <= '7') { placeStone(+k); e.preventDefault(); }
    }
    document.addEventListener('keydown', onKey);
    draw(); loop();
    try { svg.focus({ preventScroll: true }); } catch (e) {}
    function teardown() {
      over = true;
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.removeEventListener('keydown', onKey);
    }
    teardown.destroy = teardown;
    return teardown;
  }

  /* ================================================================== GUTTE
     Five stones, one hand. Toss the mother stone up; while she is in the
     air, tap the glowing stones on the ground; when she falls, tap HER to
     catch. Five tosses; ten stones gathered wins. Everything is a big fat
     target, and Space + 1-4 play it without a finger on the glass. */
  function gutte(host, opts, done) {
    css();
    var Wd = 860, Ht = 500, HAND = { x: 430, y: 386 };
    /* the real ladder every courtyard climbs: ekka, dukka, tikka, chauka —
       toss n asks for n stones before the catch. Six tosses to climb four rungs. */
    var ROUNDS = [
      { name: 'Ekka', need: 1, ms: 2100 },
      { name: 'Dukka', need: 2, ms: 2600 },
      { name: 'Tikka', need: 3, ms: 3100 },
      { name: 'Chauka', need: 4, ms: 3600 }
    ];
    var round = 0, tossesLeft = 6, cleared = 0, got = 0, roundGot = 0;
    var phase = 'cover', over = false;
    var raf = null, timers = [], t0 = 0, fx = [];
    var ground = [];
    function seed() {
      ground = [];
      var spots = [[210, 420], [360, 448], [520, 448], [660, 420]];
      for (var i = 0; i < 4; i++) {
        ground.push({ n: i + 1, x: spots[i][0], y: spots[i][1], took: false });
      }
    }
    seed();
    var wrap = el('div', 'gy-wrap');
    var hud = el('div', 'gy-hud',
      '<span class="gy-pill">Rung <b id="gtR">Ekka</b> · pick <b id="gtN">1</b></span>' +
      '<span class="gy-pill" id="gtM">toss her up!</span>' +
      '<span class="gy-pill">Tosses left <b id="gtT">6</b></span>' +
      '<span class="gy-pill">Rungs <b id="gtG">0</b>/4</span>');
    var hold = el('div', 'gy-hold');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + Ht);
    svg.setAttribute('class', 'gy-stage');
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', 'Gutte. Toss the mother stone, pick the asked number of ground stones while she flies, then tap her to catch.');
    svg.setAttribute('tabindex', '0');
    var cover = el('div', 'gy-cover'); cover.hidden = true;
    hold.appendChild(svg); hold.appendChild(cover);
    var hint = el('div', 'gy-hint',
      '<b>Tap</b> to toss her up · <b>tap the glowing stones</b> while she flies · <b>tap her to catch</b> ' +
      'on the way down. Keys: <b>Space</b> tosses and catches · <b>1–4</b> pick.');
    wrap.appendChild(hud); wrap.appendChild(hold); wrap.appendChild(hint);
    host.innerHTML = ''; host.appendChild(wrap);

    function msg(m2) { document.getElementById('gtM').textContent = m2; }
    function hudUp() {
      document.getElementById('gtR').textContent = ROUNDS[round].name;
      document.getElementById('gtN').textContent = ROUNDS[round].need;
      document.getElementById('gtT').textContent = tossesLeft;
      document.getElementById('gtG').textContent = cleared;
    }
    function showCover(title, body, btn, go) {
      cover.innerHTML = '<div class="gy-card"><h3>' + title + '</h3>' + body +
        '<button type="button" class="gy-btn" data-go="' + go + '">' + btn + '</button></div>';
      cover.hidden = false;
      timers.push(setTimeout(function () {
        var b2 = cover.querySelector('.gy-btn');
        try { b2.focus({ preventScroll: true }); } catch (e) {}
      }, 60));
    }
    function TOSS_MS() { return ROUNDS[round].ms; }
    function stoneY() {
      var tt = Math.min(1, (Date.now() - t0) / TOSS_MS());
      return HAND.y - Math.sin(tt * Math.PI) * 300;
    }
    function pebble(x, y, r, took, lit, n) {
      if (took) return '';
      var out = '<g data-gutte="' + n + '">' +
        '<circle cx="' + x + '" cy="' + y + '" r="34" fill="transparent"/>' +
        '<ellipse cx="' + (x + 2) + '" cy="' + (y + r * 0.55) + '" rx="' + (r * 1.15) + '" ry="' + (r * 0.4) + '" fill="#6d552f" opacity=".3"/>' +
        '<path d="M' + (x - r) + ' ' + y + ' q' + (r * 0.25) + ' -' + (r * 0.9) + ' ' + r + ' -' + (r * 0.82) + ' ' +
          'q' + (r * 0.88) + ' ' + (r * 0.06) + ' ' + (r * 0.88) + ' ' + (r * 0.82) + ' ' +
          'q0 ' + (r * 0.76) + ' -' + (r * 0.95) + ' ' + (r * 0.76) + ' ' +
          'q-' + (r * 0.82) + ' 0 -' + (r * 0.93) + ' -' + (r * 0.76) + 'z" ' +
          'fill="url(#gtstone)" stroke="' + (lit ? 'var(--accent2)' : '#7d7264') + '" stroke-width="' + (lit ? 4.5 : 2) + '"/>' +
        '<circle cx="' + (x - r * 0.3) + '" cy="' + (y - r * 0.35) + '" r="2.2" fill="#efe6d6" opacity=".9"/>' +
        '<circle cx="' + (x + r * 0.28) + '" cy="' + (y - r * 0.1) + '" r="1.7" fill="#efe6d6" opacity=".7"/>' +
        '<circle cx="' + (x - r * 0.05) + '" cy="' + (y + r * 0.22) + '" r="1.9" fill="#8f8172" opacity=".8"/>' +
        '<text x="' + x + '" y="' + (y + 36) + '" text-anchor="middle" font-size="13" font-weight="800" ' +
          'fill="#5c4a26">' + n + '</text></g>';
      return out;
    }
    function sparkles() {
      var now = Date.now(), out = '', i, j;
      fx = fx.filter(function (f) { return now - f.t0 < 600; });
      for (i = 0; i < fx.length; i++) {
        var f = fx[i], t = (now - f.t0) / 600, rr = 6 + t * 24, op = (1 - t) * 0.9;
        for (j = 0; j < 6; j++) {
          var aa = j * Math.PI / 3 + t;
          out += '<line x1="' + (f.x + Math.cos(aa) * rr * 0.4).toFixed(1) + '" y1="' + (f.y + Math.sin(aa) * rr * 0.4).toFixed(1) +
            '" x2="' + (f.x + Math.cos(aa) * rr).toFixed(1) + '" y2="' + (f.y + Math.sin(aa) * rr).toFixed(1) +
            '" stroke="#ffd76b" stroke-width="3" stroke-linecap="round" opacity="' + op.toFixed(2) + '"/>';
        }
      }
      return out;
    }
    function draw() {
      var out = '<defs>' +
        '<radialGradient id="gtdust" cx="50%" cy="35%" r="85%">' +
          '<stop offset="0%" stop-color="#f0e2c2"/><stop offset="65%" stop-color="#e2cda1"/>' +
          '<stop offset="100%" stop-color="#c9ab77"/></radialGradient>' +
        '<radialGradient id="gtstone" cx="38%" cy="30%" r="85%">' +
          '<stop offset="0%" stop-color="#cbbda8"/><stop offset="60%" stop-color="#b0a08c"/>' +
          '<stop offset="100%" stop-color="#8f8172"/></radialGradient>' +
        '<radialGradient id="gtmom" cx="38%" cy="30%" r="85%">' +
          '<stop offset="0%" stop-color="#b3a38b"/><stop offset="55%" stop-color="#8f7f6a"/>' +
          '<stop offset="100%" stop-color="#6b5d4c"/></radialGradient>' +
        '</defs>';
      out += '<rect width="' + Wd + '" height="' + Ht + '" fill="url(#gtdust)"/>';
      /* the woven mat the stones sit on, and rangoli dots in one corner */
      out += '<ellipse cx="' + Wd / 2 + '" cy="446" rx="390" ry="48" fill="#c98f4f" opacity=".4"/>' +
        '<ellipse cx="' + Wd / 2 + '" cy="446" rx="390" ry="48" fill="none" stroke="#9a6a30" stroke-width="2" opacity=".5"/>' +
        '<path d="M120 446 q310 -26 620 0" stroke="#9a6a30" stroke-width="1.4" fill="none" opacity=".35"/>' +
        '<path d="M160 460 q270 -22 540 0" stroke="#9a6a30" stroke-width="1.4" fill="none" opacity=".3"/>';
      var rd, ra;
      for (rd = 0; rd < 3; rd++) {
        for (ra = 0; ra <= rd; ra++) {
          out += '<circle cx="' + (64 + ra * 18 - rd * 9) + '" cy="' + (64 + rd * 15) + '" r="3.4" fill="#c25b3f" opacity=".55"/>';
        }
      }
      /* the flight path, while she is up */
      if (phase === 'air') {
        out += '<path d="M' + HAND.x + ' ' + HAND.y + ' q0 -600 0 0" fill="none"/>' +
          '<line x1="' + HAND.x + '" y1="' + (HAND.y - 300) + '" x2="' + HAND.x + '" y2="' + HAND.y + '" ' +
          'stroke="#9a6a30" stroke-width="1.6" stroke-dasharray="2 9" opacity=".4"/>';
      }
      ground.forEach(function (g2) {
        out += pebble(g2.x, g2.y, 17, g2.took, phase === 'air' && roundGot < ROUNDS[round].need, g2.n);
      });
      if (phase === 'ready' || phase === 'between') {
        out += '<circle cx="' + HAND.x + '" cy="' + HAND.y + '" r="22" fill="url(#gtmom)" stroke="#5d5142" stroke-width="3"/>' +
          '<path d="M' + (HAND.x - 14) + ' ' + (HAND.y - 6) + ' q14 -8 28 0" fill="none" stroke="#5d5142" stroke-width="2.4" opacity=".6"/>';
        if (phase === 'ready') {
          out += '<circle cx="' + HAND.x + '" cy="' + HAND.y + '" r="32" fill="none" stroke="var(--accent)" ' +
            'stroke-width="2.4" stroke-dasharray="5 6" opacity=".8"/>' +
            '<text x="' + HAND.x + '" y="' + (HAND.y + 52) + '" text-anchor="middle" font-size="15" ' +
            'font-weight="800" fill="#6d4c1e" opacity=".9">tap to toss the mother stone</text>';
        }
      } else if (phase === 'air') {
        var y2 = stoneY();
        var falling = (Date.now() - t0) / TOSS_MS() > 0.5;
        out += '<g data-mother="1"><circle cx="' + HAND.x + '" cy="' + y2.toFixed(1) + '" r="38" fill="transparent"/>';
        if (falling) {
          var pulse = 30 + Math.sin(Date.now() / 110) * 4;
          out += '<circle cx="' + HAND.x + '" cy="' + y2.toFixed(1) + '" r="' + pulse.toFixed(1) +
            '" fill="none" stroke="var(--accent3)" stroke-width="3" opacity=".75"/>' +
            '<text x="' + HAND.x + '" y="' + (y2 - 42).toFixed(1) + '" text-anchor="middle" font-size="16" ' +
            'font-weight="900" fill="var(--accent3)">catch!</text>';
        }
        out += '<circle cx="' + HAND.x + '" cy="' + y2.toFixed(1) + '" r="22" fill="url(#gtmom)" ' +
          'stroke="' + (falling ? 'var(--accent3)' : '#5d5142') + '" stroke-width="' + (falling ? 5 : 3) + '"/>' +
          '<path d="M' + (HAND.x - 14) + ' ' + (y2 - 6).toFixed(1) + ' q14 -8 28 0" fill="none" stroke="#5d5142" stroke-width="2.4" opacity=".6"/></g>';
      }
      out += sparkles();
      svg.innerHTML = out;
    }
    function loop() {
      if (over) return;
      if (phase === 'air' && Date.now() - t0 >= TOSS_MS()) {
        msg('she fell! the rung stays');
        endToss(false);
      }
      draw();
      raf = requestAnimationFrame(loop);
    }
    function endToss(ok) {
      phase = 'between';
      tossesLeft--;
      if (ok) { cleared++; got += roundGot; }
      hudUp();
      timers.push(setTimeout(function () {
        if (over) return;
        if (ok && round >= 3) return finish();
        if (tossesLeft <= 0) return finish();
        if (ok) round++;
        seed(); roundGot = 0; phase = 'ready';
        hudUp();
        msg(ROUNDS[round].name + ' — pick ' + ROUNDS[round].need + '. Toss her up!');
      }, 1100));
    }
    function finish() {
      over = true;
      var win = cleared >= 3;
      msg(win ? 'Gutte jeet — ' + cleared + ' rungs climbed!' : cleared + ' rung' + (cleared === 1 ? '' : 's') + ' — nimble fingers next time');
      var starRow = '⭐'.repeat(Math.max(1, cleared)) + '☆'.repeat(Math.max(0, 4 - Math.max(1, cleared)));
      showCover(win ? 'Gutte jeet!' : 'Khel khatam',
        '<p>' + cleared + ' of 4 rungs — ' + (win ? 'the courtyard is yours.' : 'the ladder waits for you.') + '</p>' +
        '<p style="font-size:22px;letter-spacing:4px">' + starRow + '</p>', 'Done', 'out');
    }
    function pick(n) {
      if (phase !== 'air') return;
      var st2 = ground[n - 1];
      if (!st2 || st2.took) return;
      if (roundGot >= ROUNDS[round].need) { msg('that\u2019s enough — catch her!'); return; }
      st2.took = true; roundGot++;
      fx.push({ x: st2.x, y: st2.y, t0: Date.now() });
      if (roundGot >= ROUNDS[round].need) msg('got them — now CATCH her!');
      else msg('pick ' + (ROUNDS[round].need - roundGot) + ' more!');
    }
    function catchHer() {
      if (phase !== 'air') return;
      var tt = (Date.now() - t0) / TOSS_MS();
      if (tt < 0.4) { msg('too soon — she\u2019s still rising!'); return; }
      if (roundGot < ROUNDS[round].need) {
        msg('caught — but ' + ROUNDS[round].name + ' needs ' + ROUNDS[round].need + '. Again!');
        endToss(false);
        return;
      }
      fx.push({ x: HAND.x, y: stoneY(), t0: Date.now() });
      msg('caught! ' + ROUNDS[round].name + ' done ⭐');
      endToss(true);
    }
    function act(e) {
      if (over) return;
      var g2 = e.target.closest ? e.target.closest('[data-gutte]') : null;
      if (phase === 'air' && g2) { pick(+g2.getAttribute('data-gutte')); return; }
      if (phase === 'air' && e.target.closest && e.target.closest('[data-mother]')) return catchHer();
      if (phase === 'ready') {
        phase = 'air'; t0 = Date.now();
        msg('pick ' + ROUNDS[round].need + ' — then catch her!');
      }
    }
    function onKey(e) {
      if (over) return;
      var k = e.key;
      if (phase === 'cover') return;
      if (k === ' ' || k === 'Enter') {
        e.preventDefault();
        if (phase === 'ready') { phase = 'air'; t0 = Date.now(); msg('pick ' + ROUNDS[round].need + ' — then catch her!'); }
        else if (phase === 'air') catchHer();
      } else if (phase === 'air' && k >= '1' && k <= '4') {
        pick(+k); e.preventDefault();
      }
    }
    svg.addEventListener('pointerdown', act);
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-go]') : null;
      if (!t) return;
      var what = t.getAttribute('data-go');
      if (what === 'start') {
        cover.hidden = true; phase = 'ready';
        msg('Ekka — pick 1. Toss her up!');
        try { svg.focus({ preventScroll: true }); } catch (err) {}
      } else if (what === 'out') {
        var win = cleared >= 3;
        done({ win: win, score: cleared * 25 + got * 5, sikke: win ? 12 : 4 });
      }
    });
    hudUp(); draw(); loop();
    showCover('Gutte',
      '<p>Five stones, one hand — the courtyard ladder: ekka, dukka, tikka, chauka.</p>' +
      '<ol><li><b>Tap</b> to toss the mother stone up.</li>' +
      '<li>While she flies, <b>tap the ground stones</b> — each rung asks for one more.</li>' +
      '<li><b>Tap her to catch</b> on the way down, or the rung is lost.</li>' +
      '<li><b>Challenge:</b> climb all four rungs in six tosses.</li></ol>',
      'Shuru — play!', 'start');

    function teardown() {
      over = true;
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.removeEventListener('keydown', onKey);
    }
    teardown.destroy = teardown;
    return teardown;
  }

  /* ================================================================== REGISTRY
     Push, never replace: games.js owns the array. ONE game from this file is on the shelf now.
     ARCHIVED, unregistered, their engines kept above for the day one earns its card back
     through one-in-one-out and the clock and touch checks (games spec §3.1):
       kancha  — removed by the owner (8 Oct 2026): fun, but broken on phones, and it teaches
                 nothing the app is for
       gutte   — removed by the owner (8 Oct 2026): the controls decided it more than timing did
       patang, gillidanda, pithoo — archived earlier (founder's verdict)
     Pallanguzhi is heritage play (docs/32): teaches:false, it reports no answers and pays nothing;
     the host says "played for fun". */
  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push(
    { id: 'pallanguzhi', name: 'Pallanguzhi', sub: 'sow the shells, take the kasi', icon: 'star', minutes: 6,
      blurb: 'Pallanguzhi, Tamil Nadu \u2014 played across South India as Ali Guli Mane (Karnataka), Vamana Guntalu (Andhra Pradesh) and Kuzhipara (Kerala). Ask your family what you call it. Sow your shells round the board and fill your store; families play many ways, this is one simple way.',
      credit: 'Pallanguzhi, Tamil Nadu; Ali Guli Mane (Karnataka), Vamana Guntalu (Andhra Pradesh), Kuzhipara (Kerala)',
      tag: 'board', c: '#8f6428', c2: '#3a250b', teaches: false, review: false,
      engine: pallanguzhi }
  );
  /* the archived engines, reachable only by the checks that keep them honest — never the shelf */
  W.IND_GAMES_ARCHIVE = { kancha: kancha, gutte: gutte, patang: patang, gillidanda: gillidanda, pithoo: pithoo };
})();
