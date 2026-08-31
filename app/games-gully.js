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
      '.gy-stage{width:100%;max-width:860px;background:var(--card2);border:1px solid var(--line);' +
        'border-radius:18px;overflow:hidden;touch-action:none;display:block}' +
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
     A ring drawn in the dust, six kancha in it, and your striker on the line. Aim
     with the angle, choose the power, flick. Anything you knock clean out of the
     ring is yours. Eight shots; the ring is never empty of chances. */
  function kancha(host, opts, done) {
    css();
    var Wd = 560, Ht = 380, R = 120, CX = Wd / 2, CY = 168;
    var over = false, shots = 8, potted = 0, phase = 'aim';   /* aim → power → fly */
    var angle = -Math.PI / 2, power = 0.55, dir = 1;
    var raf = null, keyed = null;

    var marbles = [];
    function reset() {
      marbles = [];
      var cols = ['#3b6fd4', '#2f8f5b', '#e8b21c', '#d84a3f', '#8b5cf6', '#0fa8a0'];
      for (var i = 0; i < 6; i++) {
        var a = (i / 6) * Math.PI * 2, d = 34 + (i % 3) * 22;
        marbles.push({ x: CX + Math.cos(a) * d, y: CY + Math.sin(a) * d, vx: 0, vy: 0, r: 11,
          c: cols[i], out: false });
      }
    }
    reset();
    var striker = { x: CX, y: CY + R + 26, vx: 0, vy: 0, r: 13, c: '#f6f3ea' };

    var wrap = el('div', 'gy-wrap');
    var hud = el('div', 'gy-hud',
      '<span class="gy-pill">Shots left <b id="gyS">8</b></span>' +
      '<span class="gy-pill">Won <b id="gyP">0</b></span>');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + Ht);
    svg.setAttribute('class', 'gy-stage');
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', 'Kancha — aim and flick your marble');
    svg.setAttribute('tabindex', '0');
    var hint = el('div', 'gy-hint',
      '<b>Win 4 of the 6</b> to take the ring. <b>Finger:</b> grab your marble — slide it ' +
      'along the line, pull back past the line and let go to flick (a small pull cancels). ' +
      '<b>Keys:</b> ← → aim · ↑ ↓ power · <b>Space</b> flicks.');
    wrap.appendChild(hud); wrap.appendChild(svg); wrap.appendChild(hint);
    host.innerHTML = ''; host.appendChild(wrap);

    function draw() {
      var s = '';
      /* the dust, and the ring scratched in it */
      s += '<rect width="' + Wd + '" height="' + Ht + '" fill="var(--card2)"/>';
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="var(--ground)" opacity=".7"/>';
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="none" stroke="var(--text2)" ' +
        'stroke-width="2.5" stroke-dasharray="7 6" opacity=".65"/>';
      s += '<path d="M40 ' + (CY + R + 26) + 'H' + (Wd - 40) + '" stroke="var(--text2)" stroke-width="2" ' +
        'opacity=".35" stroke-dasharray="4 7"/>';
      /* the marbles: a glass body, a cat's-eye twist and a highlight */
      marbles.forEach(function (m) {
        if (m.out) return;
        s += '<g><circle cx="' + m.x.toFixed(1) + '" cy="' + m.y.toFixed(1) + '" r="' + m.r + '" fill="' + m.c + '"/>' +
          '<path d="M' + (m.x - m.r * 0.6).toFixed(1) + ' ' + m.y.toFixed(1) +
          'q' + (m.r * 0.6) + ' ' + (-m.r * 0.9) + ' ' + (m.r * 1.2) + ' 0' +
          'q' + (-m.r * 0.6) + ' ' + (m.r * 0.9) + ' ' + (-m.r * 1.2) + ' 0z" fill="#fff" opacity=".55"/>' +
          '<circle cx="' + (m.x - m.r * 0.34).toFixed(1) + '" cy="' + (m.y - m.r * 0.36).toFixed(1) +
          '" r="' + (m.r * 0.22).toFixed(1) + '" fill="#fff" opacity=".85"/></g>';
      });
      /* your striker */
      s += '<g><circle cx="' + striker.x.toFixed(1) + '" cy="' + striker.y.toFixed(1) + '" r="' + striker.r +
        '" fill="' + striker.c + '" stroke="#9c8256" stroke-width="1.6"/>' +
        '<circle cx="' + (striker.x - 4).toFixed(1) + '" cy="' + (striker.y - 4).toFixed(1) +
        '" r="3" fill="#fff" opacity=".9"/></g>';
      /* the aim line and the power bar, only while aiming */
      if (phase !== 'fly' && !over) {
        var len = 34 + power * 70;
        var tx = striker.x + Math.cos(angle) * len, ty = striker.y + Math.sin(angle) * len;
        s += '<path d="M' + striker.x.toFixed(1) + ' ' + striker.y.toFixed(1) + 'L' + tx.toFixed(1) + ' ' + ty.toFixed(1) +
          '" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" opacity=".85"/>';
        s += '<path d="M' + tx.toFixed(1) + ' ' + ty.toFixed(1) + 'l' +
          (Math.cos(angle + 2.5) * 11).toFixed(1) + ' ' + (Math.sin(angle + 2.5) * 11).toFixed(1) + 'M' +
          tx.toFixed(1) + ' ' + ty.toFixed(1) + 'l' + (Math.cos(angle - 2.5) * 11).toFixed(1) + ' ' +
          (Math.sin(angle - 2.5) * 11).toFixed(1) + '" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>';
        s += '<rect x="40" y="' + (Ht - 30) + '" width="150" height="10" rx="5" fill="var(--card)" stroke="var(--line)"/>';
        s += '<rect x="40" y="' + (Ht - 30) + '" width="' + (150 * power).toFixed(1) + '" height="10" rx="5" fill="var(--accent2)"/>';
        s += '<text x="198" y="' + (Ht - 21) + '" font-size="12" font-weight="700" fill="var(--text2)">power</text>';
      }
      svg.innerHTML = s;
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
      /* marble against marble: equal masses, so they simply swap along the normal */
      for (var i = 0; i < all.length; i++) {
        for (var j = i + 1; j < all.length; j++) {
          var a = all[i], b = all[j];
          if (a.out || b.out) continue;
          var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
          var min = a.r + b.r;
          if (d < min) {
            var nx = dx / d, ny = dy / d, push = (min - d) / 2;
            a.x -= nx * push; a.y -= ny * push; b.x += nx * push; b.y += ny * push;
            var p = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
            if (p > 0) {
              a.vx -= p * nx; a.vy -= p * ny; b.vx += p * nx; b.vy += p * ny;
            }
          }
        }
      }
      /* out of the ring is won — that is the whole game */
      marbles.forEach(function (m) {
        if (m.out) return;
        var dd = Math.sqrt((m.x - CX) * (m.x - CX) + (m.y - CY) * (m.y - CY));
        if (dd > R + m.r) { m.out = true; potted++; document.getElementById('gyP').textContent = potted; }
      });
      /* the striker never leaves the table */
      if (striker.x < striker.r) { striker.x = striker.r; striker.vx *= -0.6; }
      if (striker.x > Wd - striker.r) { striker.x = Wd - striker.r; striker.vx *= -0.6; }
      if (striker.y < striker.r) { striker.y = striker.r; striker.vy *= -0.6; }
      if (striker.y > Ht - striker.r) { striker.y = Ht - striker.r; striker.vy *= -0.6; }

      draw();
      if (moving) { raf = requestAnimationFrame(step); return; }
      /* the shot has come to rest */
      phase = 'aim';
      striker.y = CY + R + 26; striker.vx = 0; striker.vy = 0;
      striker.x = Math.max(40, Math.min(Wd - 40, striker.x));
      if (potted >= 6 || shots <= 0) return finish();
      draw();
    }

    function flick() {
      if (phase === 'fly' || over) return;
      phase = 'fly';
      shots--;
      document.getElementById('gyS').textContent = shots;
      var v = 4 + power * 12;
      striker.vx = Math.cos(angle) * v; striker.vy = Math.sin(angle) * v;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    }

    function finish() {
      if (over) return;
      over = true;
      var win = potted >= 4;
      svg.innerHTML = svg.innerHTML +
        '<rect width="' + Wd + '" height="' + Ht + '" fill="rgba(20,12,40,.55)"/>' +
        '<text x="' + CX + '" y="' + (CY - 6) + '" text-anchor="middle" font-size="30" font-weight="800" ' +
        'fill="#fff">' + (win ? 'Kancha jeet!' : 'Good flicking') + '</text>' +
        '<text x="' + CX + '" y="' + (CY + 26) + '" text-anchor="middle" font-size="16" fill="#fff" ' +
        'opacity=".9">' + potted + ' of 6 out of the ring</text>';
      setTimeout(function () {
        done({ win: win, score: potted * 10, sikke: 4 + potted * 2 });
      }, 900);
    }

    keyed = function (e) {
      if (over) return;
      var k = e.key;
      if (k === 'ArrowLeft') { angle -= 0.09; draw(); e.preventDefault(); }
      else if (k === 'ArrowRight') { angle += 0.09; draw(); e.preventDefault(); }
      else if (k === 'ArrowUp') { power = Math.min(1, power + 0.07); draw(); e.preventDefault(); }
      else if (k === 'ArrowDown') { power = Math.max(0.1, power - 0.07); draw(); e.preventDefault(); }
      else if (k === ' ' || k === 'Enter') { flick(); e.preventDefault(); }
    };
    document.addEventListener('keydown', keyed);

    /* TOUCH, THE CARROM WAY. The old input fired a shot from ANY drag
       anywhere — a stray thumb was a wasted shot, and the striker could
       never be placed. Now: grab the striker and it slides along its line;
       pull back past the line and the grab becomes the flick sling; let go
       to shoot — and a tiny pull is a cancel, not a misfire. A drag that
       starts away from the striker does nothing at all. */
    var dragging = null;
    function pt(e) {
      var r = svg.getBoundingClientRect();
      var t = (e.touches && e.touches[0]) || e;
      return { x: (t.clientX - r.left) / r.width * Wd, y: (t.clientY - r.top) / r.height * Ht };
    }
    var LINE_Y = CY + R + 26;
    function dstart(e) {
      if (over || phase === 'fly') return;
      var q = pt(e);
      var dx = q.x - striker.x, dy = q.y - striker.y;
      if (dx * dx + dy * dy < 34 * 34) { dragging = { mode: 'stick' }; }
      if (e.cancelable) e.preventDefault();
    }
    function dmove(e) {
      if (!dragging || over) return;
      var q = pt(e);
      if (dragging.mode === 'stick') {
        if (q.y - LINE_Y > 26) dragging = { mode: 'sling' };
        else { striker.x = Math.max(40, Math.min(Wd - 40, q.x)); draw(); return; }
      }
      var dx = striker.x - q.x, dy = striker.y - q.y;
      angle = Math.atan2(dy, dx);
      power = Math.max(0.1, Math.min(1, Math.sqrt(dx * dx + dy * dy) / 140));
      dragging.armed = Math.sqrt(dx * dx + dy * dy) > 22;
      draw();
      if (e.cancelable) e.preventDefault();
    }
    function dend() {
      if (!dragging) return;
      var was = dragging; dragging = null;
      if (was.mode === 'sling' && was.armed) flick();
    }
    svg.addEventListener('pointerdown', dstart);
    svg.addEventListener('pointermove', dmove);
    svg.addEventListener('pointerup', dend);
    svg.addEventListener('pointercancel', dend);

    draw();
    try { svg.focus({ preventScroll: true }); } catch (e) {}

    function teardown() {
      over = true;
      if (raf) cancelAnimationFrame(raf);
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
    var Wd = 860, Ht = 400;
    var pits = [];                     /* 0-6 yours L->R, 7-13 Gattu R->L (CCW ring) */
    for (var i = 0; i < 14; i++) pits.push(5);
    var pouch = { you: 0, gattu: 0 };
    var turn = 'you', busy = false, over = false, raf = null, timers = [];
    var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    var wrap = el('div', 'gy-wrap');
    var hud = el('div', 'gy-hud',
      '<span class="gy-pill">Your pouch <b id="pzY">0</b></span>' +
      '<span class="gy-pill" id="pzT">your turn — pick a pit</span>' +
      '<span class="gy-pill">Gattu <b id="pzG">0</b></span>');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + Ht);
    svg.setAttribute('class', 'gy-stage');
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', 'Pallanguzhi board, two rows of seven pits');
    svg.setAttribute('tabindex', '0');
    var hint = el('div', 'gy-hint',
      'Sow anticlockwise, one shell a pit. Land so the NEXT pit is empty and the shells ' +
      'beyond it are yours. <b>Tap a pit</b> or press <b>1-7</b>.');
    wrap.appendChild(hud); wrap.appendChild(svg); wrap.appendChild(hint);
    host.innerHTML = ''; host.appendChild(wrap);

    /* pit centres: your row along the bottom L->R, Gattu's along the top R->L,
       so index+1 always steps anticlockwise around the board */
    function at(i) {
      var col = i < 7 ? i : 13 - i;
      return { x: 92 + col * 112, y: i < 7 ? 288 : 112 };
    }
    function shellDots(n, cx, cy) {
      var out = '', k;
      for (k = 0; k < Math.min(n, 12); k++) {
        var a = (k / 6) * Math.PI * 2, rr = k < 6 ? 13 : 24;
        out += '<circle cx="' + (cx + Math.cos(a) * rr).toFixed(1) + '" cy="' +
          (cy + Math.sin(a) * rr * 0.72).toFixed(1) + '" r="4.6" fill="#f3e7cf" stroke="#b99b6b"/>';
      }
      return out;
    }
    function draw(litFrom) {
      var out = '<rect width="' + Wd + '" height="' + Ht + '" rx="26" fill="#7a5320"/>' +
        '<rect x="10" y="10" width="' + (Wd - 20) + '" height="' + (Ht - 20) + '" rx="20" ' +
          'fill="#8f6428" stroke="#5c3d14" stroke-width="3"/>';
      for (var i = 0; i < 14; i++) {
        var c = at(i), mine = i < 7, can = mine && turn === 'you' && !busy && !over && pits[i] > 0;
        out += '<g data-pit="' + i + '"' + (can ? ' class="pz-can" role="button" tabindex="-1"' : '') + '>' +
          '<ellipse cx="' + c.x + '" cy="' + c.y + '" rx="46" ry="36" fill="#4a2f0e"/>' +
          '<ellipse cx="' + c.x + '" cy="' + (c.y - 3) + '" rx="44" ry="33" fill="#3a250b"' +
            (can ? ' stroke="var(--accent2)" stroke-width="3"' : '') + '/>' +
          shellDots(pits[i], c.x, c.y - 3) +
          '<text x="' + c.x + '" y="' + (c.y + (mine ? 58 : -48)) + '" text-anchor="middle" ' +
            'font-size="15" font-weight="800" fill="#f6ecd7">' + pits[i] + '</text>' +
          (mine ? '<text x="' + c.x + '" y="' + (c.y + 76) + '" text-anchor="middle" font-size="11" ' +
            'fill="#d8c39a">' + (i + 1) + '</text>' : '') + '</g>';
      }
      if (litFrom !== undefined) {
        var lc = at(litFrom);
        out += '<ellipse cx="' + lc.x + '" cy="' + (lc.y - 3) + '" rx="44" ry="33" fill="none" ' +
          'stroke="#ffd98a" stroke-width="4" opacity=".9"/>';
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
        if (pits[nxt] === 0 && pits[beyond] > 0) { won = pits[beyond]; pits[beyond] = 0; pouch[who] += won; }
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
    function finish() {
      over = true;
      /* whatever still sits in a row goes to its own pouch, like packing up */
      for (var i = 0; i < 7; i++) { pouch.you += pits[i]; pits[i] = 0; }
      for (i = 7; i < 14; i++) { pouch.gattu += pits[i]; pits[i] = 0; }
      draw(); hud2(pouch.you > pouch.gattu ? 'Your pouch is fuller — you win!'
        : pouch.you === pouch.gattu ? 'Dead even — play again!' : 'Gattu\u2019s pouch is fuller this time.');
      var win = pouch.you > pouch.gattu;
      timers.push(setTimeout(function () {
        done({ win: win, score: pouch.you, sikke: win ? 10 : 4 });
      }, 1400));
    }
    function afterMove(who, won) {
      hud2(won ? (who === 'you' ? 'You pouch ' + won + '!' : 'Gattu pouches ' + won + '.') : undefined);
      var next = who === 'you' ? 'gattu' : 'you';
      if (rowEmpty(next)) return finish();
      turn = next; busy = false; draw();
      hud2(next === 'you' ? 'your turn — pick a pit' : 'Gattu is thinking\u2026');
      if (next === 'gattu') timers.push(setTimeout(gattuMove, REDUCED ? 60 : 750));
    }
    function play(i) {
      if (over || busy || turn !== 'you' || i < 0 || i > 6 || pits[i] === 0) return;
      busy = true; hud2('sowing\u2026');
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
      if (best < 0) return finish();
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
    draw(); hud2();
    try { svg.focus({ preventScroll: true }); } catch (e) {}

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
    var Wd = 860, Ht = 420, HAND = { x: 430, y: 330 };
    var phase = 'ready', toss = 0, got = 0, roundGot = 0, over = false;
    var raf = null, timers = [], t0 = 0, TOSS_MS = 2100;
    var ground = [];
    function seed() {
      ground = [];
      for (var i = 0; i < 4; i++) {
        ground.push({ n: i + 1, x: 190 + i * 160, y: 355 + (i % 2) * 22, took: false });
      }
    }
    seed();
    var wrap = el('div', 'gy-wrap');
    var hud = el('div', 'gy-hud',
      '<span class="gy-pill">Toss <b id="gtT">1</b> of 5</span>' +
      '<span class="gy-pill" id="gtM">tap to toss the mother stone</span>' +
      '<span class="gy-pill">Gathered <b id="gtG">0</b></span>');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + Ht);
    svg.setAttribute('class', 'gy-stage');
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', 'Gutte. Toss the mother stone, tap ground stones while it is in the air, then tap the falling stone to catch it.');
    svg.setAttribute('tabindex', '0');
    var hint = el('div', 'gy-hint',
      '<b>Tap</b> to toss her up · <b>tap the glowing stones</b> while she flies · <b>tap her to catch</b> ' +
      'before she lands (miss the catch and the round’s stones roll away). Keys: <b>Space</b> tosses and catches · <b>1–4</b> pick. ' +
      '<b>Gather 10</b> in five tosses.');
    wrap.appendChild(hud); wrap.appendChild(svg); wrap.appendChild(hint);
    host.innerHTML = ''; host.appendChild(wrap);

    function msg(m2) { document.getElementById('gtM').textContent = m2; }
    function stoneY() {
      var tt = Math.min(1, (Date.now() - t0) / TOSS_MS);
      return HAND.y - Math.sin(tt * Math.PI) * 250;
    }
    function draw() {
      var out = '<rect width="' + Wd + '" height="' + Ht + '" fill="var(--card2)"/>' +
        '<ellipse cx="' + Wd / 2 + '" cy="392" rx="360" ry="34" fill="var(--ground)" opacity=".7"/>';
      ground.forEach(function (g2) {
        if (g2.took) return;
        var lit = phase === 'air';
        out += '<g data-gutte="' + g2.n + '">' +
          '<circle cx="' + g2.x + '" cy="' + g2.y + '" r="30" fill="transparent"/>' +
          '<path d="M' + (g2.x - 16) + ' ' + g2.y + ' q4 -14 16 -13 q14 1 14 13 q0 12 -15 12 q-13 0 -15 -12z" ' +
          'fill="#b0a08c" stroke="' + (lit ? 'var(--accent2)' : '#7d7264') + '" stroke-width="' + (lit ? 4.5 : 2) + '"/>' +
          '<text x="' + g2.x + '" y="' + (g2.y + 30) + '" text-anchor="middle" font-size="13" font-weight="800" ' +
          'fill="var(--text2)">' + g2.n + '</text></g>';
      });
      if (phase === 'ready' || phase === 'between') {
        out += '<circle cx="' + HAND.x + '" cy="' + HAND.y + '" r="20" fill="#8f7f6a" stroke="#5d5142" stroke-width="3"/>';
      } else if (phase === 'air') {
        var y2 = stoneY();
        var falling = (Date.now() - t0) / TOSS_MS > 0.5;
        out += '<g data-mother="1"><circle cx="' + HAND.x + '" cy="' + y2.toFixed(1) + '" r="34" fill="transparent"/>' +
          '<circle cx="' + HAND.x + '" cy="' + y2.toFixed(1) + '" r="20" fill="#8f7f6a" ' +
          'stroke="' + (falling ? 'var(--accent3)' : '#5d5142') + '" stroke-width="' + (falling ? 5 : 3) + '"/></g>';
      }
      svg.innerHTML = out;
    }
    function loop() {
      if (over) return;
      if (phase === 'air' && Date.now() - t0 >= TOSS_MS) {
        /* she landed: the round's pickings roll away */
        got -= roundGot; roundGot = 0;
        document.getElementById('gtG').textContent = got;
        msg('she fell! the stones roll away');
        endToss();
      }
      draw();
      raf = requestAnimationFrame(loop);
    }
    function endToss() {
      phase = 'between';
      timers.push(setTimeout(function () {
        toss++;
        if (toss >= 5) return finish();
        document.getElementById('gtT').textContent = toss + 1;
        seed(); roundGot = 0; phase = 'ready';
        msg('tap to toss the mother stone');
      }, 1000));
    }
    function finish() {
      over = true;
      var win = got >= 10;
      msg(win ? 'Gutte jeet — ' + got + ' gathered!' : got + ' gathered — nimble fingers next time');
      timers.push(setTimeout(function () {
        done({ win: win, score: got * 6, sikke: win ? 10 : 4 });
      }, 1200));
    }
    function act(e) {
      if (over) return;
      var g2 = e.target.closest ? e.target.closest('[data-gutte]') : null;
      if (phase === 'air' && g2) {
        var st2 = ground[+g2.getAttribute('data-gutte') - 1];
        if (st2 && !st2.took) {
          st2.took = true; got++; roundGot++;
          document.getElementById('gtG').textContent = got;
        }
        return;
      }
      if (phase === 'air' && e.target.closest && e.target.closest('[data-mother]')) { return catchHer(); }
      if (phase === 'ready') {
        phase = 'air'; t0 = Date.now(); msg('pick stones — then catch her!');
      }
    }
    function catchHer() {
      if (phase !== 'air') return;
      var tt = (Date.now() - t0) / TOSS_MS;
      if (tt < 0.45) { msg('too soon — she’s still rising!'); return; }
      roundGot = 0;   /* the pickings are safe */
      msg('caught! +' + '');
      endToss();
    }
    function onKey(e) {
      if (over) return;
      var k = e.key;
      if (k === ' ' || k === 'Enter') {
        e.preventDefault();
        if (phase === 'ready') { phase = 'air'; t0 = Date.now(); msg('pick stones — then catch her!'); }
        else if (phase === 'air') catchHer();
      } else if (phase === 'air' && k >= '1' && k <= '4') {
        var st2 = ground[+k - 1];
        if (st2 && !st2.took) {
          st2.took = true; got++; roundGot++;
          document.getElementById('gtG').textContent = got;
        }
        e.preventDefault();
      }
    }
    svg.addEventListener('pointerdown', act);
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

  /* ================================================================== REGISTRY
     Push, never replace: games.js owns the array. Patang is ARCHIVED — the
     engine stays above for the day it earns its wind back, but the shelf no
     longer offers it (the founder's verdict: useless as it stood). */
  W.IND_GAMES = W.IND_GAMES || [];
  W.IND_GAMES.push(
    { id: 'kancha', name: 'Kancha', icon: 'star', minutes: 4,
      blurb: 'A ring scratched in the dust and six glass kancha in it. Slide your marble along the line, pull back, flick — everything you knock out of the ring is yours.',
      tag: 'flick', c: '#7a5320', c2: '#33200b',
      engine: kancha },
    { id: 'pallanguzhi', name: 'Pallanguzhi', icon: 'star', minutes: 6,
      blurb: 'The shell-and-pit game of Tamil homes — played across the south as Ali Guli Mane and Vamana Guntalu. Sow your shells round the board and fill your pouch. Families play many ways; this is one simple way.',
      tag: 'board', c: '#8f6428', c2: '#3a250b',
      engine: pallanguzhi },
    /* gillidanda and pithoo are ARCHIVED (founder's verdict: bad) — the
       engines stay above, unregistered, in case a better idea revives them */
    { id: 'gutte', name: 'Gutte', icon: 'star', minutes: 3,
      blurb: 'Five stones, one hand. Toss the mother stone, snatch what you can while she flies, and catch her before she lands.',
      tag: 'timing', c: '#8f7f6a', c2: '#3d352a',
      engine: gutte }
  );
})();
