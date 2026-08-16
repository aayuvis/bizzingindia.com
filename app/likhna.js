/* Bizzing India — Likhna: tracing Devanagari.
 *
 * WHY THIS EXISTS. Stage 7 of the Hindi pack is called Likhna and claimed to teach writing
 * while its only exercises were tile assembly. There was no stroke practice anywhere in the
 * engine: no canvas, no guide, nothing that asks a child to form a letter. This is that.
 *
 * HOW IT SCORES, and its honest limit. The guide is the glyph itself, rendered large in the
 * real Devanagari face and sampled into a coverage mask. A trace is judged on two numbers:
 * how much of the letter's ink the child covered, and how much of what they drew landed
 * outside it. That measures LETTER FORM, which is the thing a child gets wrong first and the
 * thing a parent can see.
 *
 * It does NOT yet teach stroke ORDER, and Devanagari has a real one — most letters are built
 * left to right with the shirorekha laid across the top LAST, and a child who draws the
 * headline first develops a habit that is hard to undo. Teaching that needs an authored
 * stroke path per letter, which is content this does not have. The UI says so rather than
 * implying a correct trace is correct handwriting.
 *
 * CONTROLS. Pointer or finger to trace. Keyboard throughout, because every game in this app
 * has to work both ways: arrow keys nudge the pen, space puts it down and lifts it, Enter
 * checks, Backspace clears. The pen position is always drawn, so a keyboard user can see
 * where they are.
 */
(function () {
  'use strict';

  var GRID = 64;          /* coverage is sampled on a 64x64 grid, not per pixel */
  var PEN = 26;           /* stroke width on the 512 canvas */
  var COVER_OK = 0.72;    /* how much of the letter must be inked to pass */
  var SPILL_MAX = 0.55;   /* ink outside the letter, as a fraction of the letter's own area */

  function el(id) { return document.getElementById(id); }

  window.IND_LIKHNA = {

    /* The markup. The view supplies the letter; everything else is self-contained. */
    render: function (letter) {
      return '' +
        '<div class="trace">' +
          '<div class="tracehead">' +
            '<div><span class="mono">Trace it</span>' +
            '<div class="tiny muted">Follow the grey letter. Lift and start again as often ' +
            'as you like.</div></div>' +
            '<button class="pill" data-act="say" data-k="' + (letter.audio || '') + '">' +
              'hear it</button>' +
          '</div>' +
          '<div class="tracewrap">' +
            '<canvas id="tGuide" width="512" height="512" class="tguide"></canvas>' +
            '<canvas id="tInk" width="512" height="512" class="tink" tabindex="0" ' +
              'role="application" aria-label="Tracing area for the letter ' +
              (letter.name || '') + '"></canvas>' +
          '</div>' +
          '<div id="tSay" class="tracesay tiny muted">Trace with a finger, or use the arrow ' +
          'keys and the space bar.</div>' +
          '<div class="row">' +
            '<button class="btn ghost sm" data-act="tclear">Clear</button>' +
            '<button class="btn sm" style="flex:1" data-act="tcheck">Check it</button>' +
          '</div>' +
          '<p class="tiny muted" style="margin-top:10px">This checks the shape of your ' +
          'letter, not the order you drew the strokes in. Devanagari has a proper order — ' +
          'the line across the top goes on last — and a grown-up can show you that bit.</p>' +
        '</div>';
    },

    /* Wire the canvases up. Returns a teardown so the view can drop its listeners. */
    mount: function (letter) {
      var guide = el('tGuide'), ink = el('tInk');
      if (!guide || !ink) return function () {};
      var g = guide.getContext('2d'), c = ink.getContext('2d');

      /* The guide glyph, in the real face. Devanagari set in a fallback would teach the
         wrong shape, so if Mukta has not loaded we say so rather than draw a lie. */
      g.clearRect(0, 0, 512, 512);
      g.fillStyle = 'rgba(30,20,70,.14)';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.font = '360px Mukta, "Noto Sans Devanagari", sans-serif';
      g.fillText(letter.char, 256, 268);

      /* The mask: which cells of the grid the letter actually occupies. */
      var px = g.getImageData(0, 0, 512, 512).data;
      var mask = new Uint8Array(GRID * GRID), letterCells = 0;
      var step = 512 / GRID;
      for (var gy = 0; gy < GRID; gy++) {
        for (var gx = 0; gx < GRID; gx++) {
          var hit = 0;
          for (var sy = 0; sy < step; sy += 2) {
            for (var sx = 0; sx < step; sx += 2) {
              var x = Math.floor(gx * step + sx), y = Math.floor(gy * step + sy);
              if (px[(y * 512 + x) * 4 + 3] > 12) { hit = 1; sy = step; break; }
            }
          }
          if (hit) { mask[gy * GRID + gx] = 1; letterCells++; }
        }
      }

      c.lineWidth = PEN; c.lineCap = 'round'; c.lineJoin = 'round';
      c.strokeStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#5b3fd6';

      var down = false, pen = { x: 256, y: 380 }, drew = false;

      function at(e) {
        var r = ink.getBoundingClientRect();
        var t = e.touches ? e.touches[0] : e;
        return { x: (t.clientX - r.left) * (512 / r.width),
                 y: (t.clientY - r.top) * (512 / r.height) };
      }
      function start(p) { down = true; pen = p; c.beginPath(); c.moveTo(p.x, p.y); }
      function move(p) { if (!down) return; c.lineTo(p.x, p.y); c.stroke(); pen = p; drew = true; }
      function end() { down = false; }

      var onDown = function (e) { e.preventDefault(); start(at(e)); };
      var onMove = function (e) { if (down) { e.preventDefault(); move(at(e)); } };
      var onUp = function () { end(); };

      ink.addEventListener('pointerdown', onDown);
      ink.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      ink.addEventListener('touchstart', onDown, { passive: false });
      ink.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);

      /* Keyboard: the pen is a cursor you steer. Slower than a finger, but it is a real way
         to do the exercise rather than a token alternative. */
      var cursor = document.createElement('div');
      cursor.className = 'tpen'; cursor.style.display = 'none';
      ink.parentNode.appendChild(cursor);
      function showPen() {
        var r = ink.getBoundingClientRect(), pr = ink.parentNode.getBoundingClientRect();
        cursor.style.display = 'block';
        cursor.style.left = ((pen.x / 512) * r.width + (r.left - pr.left)) + 'px';
        cursor.style.top = ((pen.y / 512) * r.height + (r.top - pr.top)) + 'px';
        cursor.classList.toggle('on', down);
      }
      var onKey = function (e) {
        var s = e.shiftKey ? 24 : 8, p = { x: pen.x, y: pen.y }, used = true;
        if (e.key === 'ArrowLeft') p.x -= s;
        else if (e.key === 'ArrowRight') p.x += s;
        else if (e.key === 'ArrowUp') p.y -= s;
        else if (e.key === 'ArrowDown') p.y += s;
        else if (e.key === ' ') { down ? end() : start(pen); showPen(); e.preventDefault(); return; }
        else used = false;
        if (!used) return;
        e.preventDefault();
        p.x = Math.max(0, Math.min(512, p.x)); p.y = Math.max(0, Math.min(512, p.y));
        if (down) move(p); else pen = p;
        showPen();
      };
      ink.addEventListener('keydown', onKey);
      ink.addEventListener('focus', showPen);
      ink.addEventListener('blur', function () { cursor.style.display = 'none'; });

      this.clear = function () {
        c.clearRect(0, 0, 512, 512); drew = false; down = false;
        var say = el('tSay'); if (say) { say.className = 'tracesay tiny muted'; say.textContent =
          'Trace with a finger, or use the arrow keys and the space bar.'; }
      };

      this.check = function () {
        var say = el('tSay');
        if (!drew) { if (say) say.textContent = 'Draw the letter first.'; return null; }
        var ip = c.getImageData(0, 0, 512, 512).data;
        var covered = 0, spill = 0;
        for (var gy = 0; gy < GRID; gy++) {
          for (var gx = 0; gx < GRID; gx++) {
            var got = 0;
            for (var sy = 0; sy < step && !got; sy += 3) {
              for (var sx = 0; sx < step; sx += 3) {
                var x = Math.floor(gx * step + sx), y = Math.floor(gy * step + sy);
                if (ip[(y * 512 + x) * 4 + 3] > 12) { got = 1; break; }
              }
            }
            if (!got) continue;
            if (mask[gy * GRID + gx]) covered++; else spill++;
          }
        }
        var cov = letterCells ? covered / letterCells : 0;
        var sp = letterCells ? spill / letterCells : 1;
        var pass = cov >= COVER_OK && sp <= SPILL_MAX;
        if (say) {
          say.className = 'tracesay tiny ' + (pass ? 'good' : 'muted');
          /* Say which way it went wrong, because "try again" teaches nothing. */
          say.textContent = pass
            ? 'That is the shape. Well done.'
            : cov < COVER_OK
              ? 'Some of the letter is still uncovered — follow the whole grey shape.'
              : 'That went outside the letter a fair bit. Try to stay on the grey.';
        }
        return { pass: pass, coverage: cov, spill: sp };
      };

      return function teardown() {
        ink.removeEventListener('pointerdown', onDown);
        ink.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        ink.removeEventListener('touchstart', onDown);
        ink.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onUp);
        ink.removeEventListener('keydown', onKey);
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      };
    }
  };
})();
