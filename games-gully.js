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
      '.gy-cover{position:absolute;inset:0;display:grid;place-items:center;padding:14px;' +
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
     The shell-and-pit game of Tamil homes, played across the south as Ali
     Guli Mane and Vamana Guntalu. Families play many ways; this is ONE
     simple way, and the blurb says so. Two rows of seven pits, five shells
     each. Sow anticlockwise; if the pit after your last shell is empty, the
     shells in the pit beyond it are yours. When a row is empty the game
     ends, and the fuller pouch wins. Tap a pit or press 1-7 (your pits,
     left to right) — keyboard and touch both, house rule. */
  function pallanguzhi(host, opts, done) {
    css();
    var Wd = 980, Ht = 460, TARGET = 36;
    var pits = [];                     /* 0-6 yours L->R, 7-13 Gattu R->L (CCW ring) */
    for (var i = 0; i < 14; i++) pits.push(5);
    var pouch = { you: 0, gattu: 0 };
    var turn = 'you', busy = false, over = false, started = false;
    var raf = null, timers = [], hintPit = -1, capFx = null;
    var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    var wrap = el('div', 'gy-wrap');
    var hud = el('div', 'gy-hud',
      '<span class="gy-pill">Your pouch <b id="pzY">0</b></span>' +
      '<span class="gy-pill" id="pzT">your turn — pick a pit</span>' +
      '<span class="gy-pill">Gattu <b id="pzG">0</b></span>' +
      '<span class="gy-pill">🏆 first to <b>' + TARGET + '</b></span>');
    var hold = el('div', 'gy-hold');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + Ht);
    svg.setAttribute('class', 'gy-stage');
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', 'Pallanguzhi board, two rows of seven pits');
    svg.setAttribute('tabindex', '0');
    var cover = el('div', 'gy-cover'); cover.hidden = true;
    hold.appendChild(svg); hold.appendChild(cover);
    var hint = el('div', 'gy-hint',
      'Sow anticlockwise, one shell a pit. Land so the NEXT pit is empty and the shells ' +
      'beyond it are yours — that is the <b>kasi</b>. <b>Tap a pit</b> or press <b>1-7</b>.');
    wrap.appendChild(hud); wrap.appendChild(hold); wrap.appendChild(hint);
    host.innerHTML = ''; host.appendChild(wrap);

    /* pit centres: your row along the bottom L->R, Gattu's along the top R->L,
       so index+1 always steps anticlockwise around the board */
    function at(i) {
      var col = i < 7 ? i : 13 - i;
      return { x: 178 + col * 104, y: i < 7 ? 330 : 130 };
    }
    function cowries(n, cx, cy) {
      var out = '', k;
      for (k = 0; k < Math.min(n, 12); k++) {
        var a = (k / 6) * Math.PI * 2 + k * 0.35, rr = k < 6 ? 12 : 23;
        var sx = cx + Math.cos(a) * rr, sy = cy + Math.sin(a) * rr * 0.7;
        var rot = ((k * 47) % 90) - 45;
        out += '<g transform="translate(' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ') rotate(' + rot + ')">' +
          '<ellipse rx="6.2" ry="4.6" fill="#f6ecd6" stroke="#b99b6b" stroke-width="1.1"/>' +
          '<path d="M-3.6 0 Q0 1.6 3.6 0" fill="none" stroke="#a8895b" stroke-width="1" stroke-linecap="round"/>' +
          '<ellipse cx="-1.4" cy="-1.6" rx="1.7" ry="1" fill="#fff" opacity=".8"/></g>';
      }
      return out;
    }
    function bowl(cx, cy, n, label) {
      var out = '<ellipse cx="' + cx + '" cy="' + (cy + 6) + '" rx="52" ry="40" fill="#3d270c"/>' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="50" ry="38" fill="url(#pzpit)"/>' +
        cowries(Math.min(n, 12), cx, cy) +
        '<text x="' + cx + '" y="' + (cy + 62) + '" text-anchor="middle" font-size="13" ' +
          'font-weight="800" fill="#f6ecd7">' + label + ' · ' + n + '</text>';
      return out;
    }
    function draw(litFrom) {
      var out = '<defs>' +
        '<linearGradient id="pzwood" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#9a6d2c"/><stop offset="50%" stop-color="#8a5f24"/>' +
          '<stop offset="100%" stop-color="#6f4a18"/></linearGradient>' +
        '<radialGradient id="pzpit" cx="50%" cy="38%" r="75%">' +
          '<stop offset="0%" stop-color="#2c1c07"/><stop offset="80%" stop-color="#3a250b"/>' +
          '<stop offset="100%" stop-color="#54370f"/></radialGradient>' +
        '</defs>';
      out += '<rect width="' + Wd + '" height="' + Ht + '" rx="26" fill="#5c3d14"/>' +
        '<rect x="10" y="10" width="' + (Wd - 20) + '" height="' + (Ht - 20) + '" rx="20" ' +
          'fill="url(#pzwood)" stroke="#3e2809" stroke-width="3"/>';
      /* wood grain and a carved inlay line around the middle */
      var g;
      for (g = 0; g < 6; g++) {
        out += '<path d="M30 ' + (52 + g * 72) + ' q ' + (Wd / 2 - 30) + ' ' + (8 - (g % 3) * 6) + ' ' +
          (Wd - 60) + ' 0" stroke="#5c3d14" stroke-width="1.2" fill="none" opacity=".35"/>';
      }
      out += '<rect x="26" y="220" width="' + (Wd - 52) + '" height="20" rx="10" fill="none" ' +
        'stroke="#c79b52" stroke-width="1.6" opacity=".5" stroke-dasharray="2 6"/>';
      /* whose row is live: a warm chevron at the edge of the active row */
      if (!over && started) {
        var ay = turn === 'you' ? 330 : 130, ax = turn === 'you' ? 96 : Wd - 96;
        var dir = turn === 'you' ? 1 : -1;
        out += '<path d="M' + ax + ' ' + (ay - 12) + ' l' + (14 * dir) + ' 12 l' + (-14 * dir) + ' 12" ' +
          'fill="none" stroke="var(--accent2)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
      }
      for (var i = 0; i < 14; i++) {
        var c = at(i), mine = i < 7, can = mine && turn === 'you' && !busy && !over && started && pits[i] > 0;
        out += '<g data-pit="' + i + '"' + (can ? ' class="pz-can" role="button" tabindex="-1"' : '') + '>' +
          '<ellipse cx="' + c.x + '" cy="' + (c.y + 4) + '" rx="46" ry="35" fill="#3d270c"/>' +
          '<ellipse cx="' + c.x + '" cy="' + c.y + '" rx="46" ry="36" fill="#4a2f0e"/>' +
          '<ellipse cx="' + c.x + '" cy="' + (c.y - 3) + '" rx="44" ry="33" fill="url(#pzpit)"' +
            (can ? ' stroke="var(--accent2)" stroke-width="3"' : '') + '/>' +
          '<ellipse cx="' + c.x + '" cy="' + (c.y - 22) + '" rx="34" ry="9" fill="#fff" opacity=".05"/>' +
          cowries(pits[i], c.x, c.y - 3) +
          '<text x="' + c.x + '" y="' + (c.y + (mine ? 58 : -48)) + '" text-anchor="middle" ' +
            'font-size="15" font-weight="800" fill="#f6ecd7">' + pits[i] + '</text>' +
          (mine ? '<text x="' + c.x + '" y="' + (c.y + 76) + '" text-anchor="middle" font-size="11" ' +
            'fill="#d8c39a">' + (i + 1) + '</text>' : '') + '</g>';
        if (i === hintPit && can) {
          out += '<ellipse cx="' + c.x + '" cy="' + (c.y - 3) + '" rx="48" ry="37" fill="none" ' +
            'stroke="#ffd98a" stroke-width="3" stroke-dasharray="6 6" opacity=".9"/>';
        }
      }
      /* the two pouches carved into the board ends */
      out += bowl(84, 330, pouch.you, 'you');
      out += bowl(Wd - 84, 130, pouch.gattu, 'Gattu');
      if (litFrom !== undefined) {
        var lc = at(litFrom);
        out += '<ellipse cx="' + lc.x + '" cy="' + (lc.y - 3) + '" rx="44" ry="33" fill="none" ' +
          'stroke="#ffd98a" stroke-width="4" opacity=".9"/>';
      }
      if (capFx) {
        var cc = at(capFx.pit);
        out += '<text x="' + cc.x + '" y="' + (cc.y - (capFx.pit < 7 ? 66 : -64)) + '" text-anchor="middle" ' +
          'font-size="19" font-weight="900" fill="#ffd98a">Kasi! +' + capFx.won + '</text>';
        for (var k = 0; k < 6; k++) {
          var aa = k * Math.PI / 3;
          out += '<line x1="' + (cc.x + Math.cos(aa) * 20).toFixed(1) + '" y1="' + (cc.y - 3 + Math.sin(aa) * 15).toFixed(1) +
            '" x2="' + (cc.x + Math.cos(aa) * 34).toFixed(1) + '" y2="' + (cc.y - 3 + Math.sin(aa) * 26).toFixed(1) +
            '" stroke="#ffd76b" stroke-width="3" stroke-linecap="round" opacity=".85"/>';
        }
      }
      svg.innerHTML = out;
    }
    function hud2(msg) {
      document.getElementById('pzY').textContent = pouch.you;
      document.getElementById('pzG').textContent = pouch.gattu;
      if (msg) document.getElementById('pzT').textContent = msg;
    }

    /* sow with a little clock so a child can follow the shells around */
    function sow(start, who, then) {
      var hand = pits[start]; pits[start] = 0;
      var i = start;
      function drop() {
        i = (i + 1) % 14; pits[i]++; hand--;
        draw(i);
        if (hand > 0) { timers.push(setTimeout(drop, REDUCED ? 0 : 170)); return; }
        /* the kasi: the pit after the last shell is empty, the one beyond is won */
        var nxt = (i + 1) % 14, beyond = (i + 2) % 14, won = 0;
        if (pits[nxt] === 0 && pits[beyond] > 0) {
          won = pits[beyond]; pits[beyond] = 0; pouch[who] += won;
          capFx = { pit: beyond, won: won };
          timers.push(setTimeout(function () { capFx = null; if (!over) draw(); }, 1300));
        }
        draw();
        then(won);
      }
      if (REDUCED) { while (hand > 0) { i = (i + 1) % 14; pits[i]++; hand--; }
        var nx = (i + 1) % 14, by = (i + 2) % 14, w2 = 0;
        if (pits[nx] === 0 && pits[by] > 0) { w2 = pits[by]; pits[by] = 0; pouch[who] += w2; }
        draw(); then(w2); return; }
      drop();
    }
    function rowEmpty(who) {
      var a = who === 'you' ? 0 : 7, i;
      for (i = a; i < a + 7; i++) if (pits[i] > 0) return false;
      return true;
    }
    function finish(early) {
      over = true; hintPit = -1;
      if (!early) {
        /* whatever still sits in a row goes to its own pouch, like packing up */
        for (var i = 0; i < 7; i++) { pouch.you += pits[i]; pits[i] = 0; }
        for (i = 7; i < 14; i++) { pouch.gattu += pits[i]; pits[i] = 0; }
      }
      draw(); hud2(pouch.you > pouch.gattu ? 'Your pouch is fuller — you win!'
        : pouch.you === pouch.gattu ? 'Dead even — play again!' : 'Gattu\u2019s pouch is fuller this time.');
      var win = pouch.you > pouch.gattu;
      var margin = pouch.you - pouch.gattu;
      var stars = win ? (margin >= 12 ? 3 : 2) : (pouch.you >= 25 ? 1 : 0);
      timers.push(setTimeout(function () {
        done({ win: win, score: pouch.you + stars * 5, sikke: win ? 10 : 4 });
      }, 1600));
    }
    function armHint() {
      /* a nudge, not an answer sheet: after 9 quiet seconds, glow the pit
         Gattu himself would pick — the child learns the kasi by seeing it */
      timers.push(setTimeout(function () {
        if (over || busy || turn !== 'you') return;
        var best = -1, bestWon = 0, i;
        for (i = 0; i < 7; i++) {
          if (!pits[i]) continue;
          var t = pits.slice(), hand = t[i], j = i; t[i] = 0;
          while (hand > 0) { j = (j + 1) % 14; t[j]++; hand--; }
          var won = (t[(j + 1) % 14] === 0) ? t[(j + 2) % 14] : 0;
          if (won > bestWon) { bestWon = won; best = i; }
        }
        if (best < 0) { for (i = 0; i < 7; i++) if (pits[i]) { best = i; break; } }
        hintPit = best; draw();
      }, 9000));
    }
    function afterMove(who, won) {
      hud2(won ? (who === 'you' ? 'Kasi! You pouch ' + won + '!' : 'Gattu pouches ' + won + '.') : undefined);
      if (pouch.you >= TARGET || pouch.gattu >= TARGET) {
        hud2(pouch.you >= TARGET ? 'You filled your pouch to ' + TARGET + ' first!' : 'Gattu reached ' + TARGET + ' first.');
        return finish(true);
      }
      var next = who === 'you' ? 'gattu' : 'you';
      if (rowEmpty(next)) return finish(false);
      turn = next; busy = false; hintPit = -1; draw();
      hud2(next === 'you' ? 'your turn — pick a pit' : 'Gattu is thinking\u2026');
      if (next === 'gattu') timers.push(setTimeout(gattuMove, REDUCED ? 60 : 750));
      else armHint();
    }
    function play(i) {
      if (over || busy || !started || turn !== 'you' || i < 0 || i > 6 || pits[i] === 0) return;
      busy = true; hintPit = -1; hud2('sowing\u2026');
      sow(i, 'you', function (won) { afterMove('you', won); });
    }
    function gattuMove() {
      if (over) return;
      busy = true;
      /* Gattu tries each pit and keeps the best immediate pouch — greedy, honest */
      var best = -1, bestWon = -1, i;
      for (i = 7; i < 14; i++) {
        if (!pits[i]) continue;
        var t = pits.slice(), hand = t[i], j = i; t[i] = 0;
        while (hand > 0) { j = (j + 1) % 14; t[j]++; hand--; }
        var won = (t[(j + 1) % 14] === 0) ? t[(j + 2) % 14] : 0;
        if (won > bestWon) { bestWon = won; best = i; }
      }
      if (best < 0) return finish(false);
      sow(best, 'gattu', function (won) { afterMove('gattu', won); });
    }

    function onTap(e) {
      var g = e.target.closest ? e.target.closest('[data-pit]') : null;
      if (!g) return;
      play(+g.getAttribute('data-pit'));
    }
    function onKey(e) {
      var k = e.key;
      if (k >= '1' && k <= '7') { play(+k - 1); e.preventDefault(); }
    }
    svg.addEventListener('click', onTap);
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-go]') : null;
      if (!t || t.getAttribute('data-go') !== 'start') return;
      cover.hidden = true; started = true; draw();
      armHint();
      try { svg.focus({ preventScroll: true }); } catch (err) {}
    });
    draw(); hud2();
    cover.innerHTML = '<div class="gy-card"><h3>Pallanguzhi</h3>' +
      '<p>The shell-and-pit game of Tamil homes — sow, count, and pounce on the kasi.</p>' +
      '<ol><li><b>Tap one of YOUR seven pits</b> (bottom row) — its shells sow anticlockwise, one per pit.</li>' +
      '<li>If the pit <b>after</b> your last shell is empty, everything <b>beyond</b> it is yours — the <b>kasi</b>!</li>' +
      '<li><b>Challenge:</b> fill your pouch to <b>' + TARGET + '</b> shells before Gattu does.</li></ol>' +
      '<button type="button" class="gy-btn" data-go="start">Shuru — play!</button></div>';
    cover.hidden = false;
    timers.push(setTimeout(function () {
      var b2 = cover.querySelector('.gy-btn');
      try { b2.focus({ preventScroll: true }); } catch (e) {}
    }, 60));

    function teardown() {
      over = true;
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
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
     Push, never replace: games.js owns the array. Patang is ARCHIVED — the
     engine stays above for the day it earns its wind back, but the shelf no
     longer offers it (the founder's verdict: useless as it stood). */
  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push(
    { id: 'kancha', name: 'Kancha', icon: 'star', minutes: 4,
      blurb: 'A ring scratched in the dust, glass kancha glinting inside. Three rounds — the wide ring, the tight ring, the raja. Slide, pull back, flick: what leaves the ring is yours.',
      tag: 'flick', c: '#7a5320', c2: '#33200b',
      engine: kancha },
    { id: 'pallanguzhi', name: 'Pallanguzhi', icon: 'star', minutes: 6,
      blurb: 'The shell-and-pit game of Tamil homes — played across the south as Ali Guli Mane and Vamana Guntalu. Sow your shells round the board and fill your pouch. Families play many ways; this is one simple way.',
      tag: 'board', c: '#8f6428', c2: '#3a250b',
      engine: pallanguzhi },
    /* gillidanda and pithoo are ARCHIVED (founder's verdict: bad) — the
       engines stay above, unregistered, in case a better idea revives them */
    { id: 'gutte', name: 'Gutte', icon: 'star', minutes: 4,
      blurb: 'Five stones, one hand, four rungs: ekka, dukka, tikka, chauka. Toss the mother stone, snatch what the rung asks while she flies, and catch her before she lands.',
      tag: 'timing', c: '#8f7f6a', c2: '#3d352a',
      engine: gutte }
  );
})();
