/* City Kit — the projection core.
 *
 * One function turns a grid cell into a screen point, and every piece in the
 * kit is placed by it. Nothing computes its own geometry: that is the whole
 * reason 291 parts drawn over two hours can read as one hand.
 *
 * The grid is 2:1 dimetric, not true isometric — a ground tile is 64 x 32 and
 * a height unit rises 32, so every number stays an integer and tiles never
 * develop a seam. A part sized L x B x H is anchored at the SOUTH corner of
 * its footprint diamond, which is the bottom vertex, which is also the bottom
 * centre of its artwork. That single agreement is what lets a painted face
 * and a procedural tile stand on the same board.
 *
 * Turning the board turns every piece with it: the board rotation r is added
 * to the piece's own facing and the sum picks one of its four painted faces.
 * The art cannot disagree with itself across a turn because the four faces
 * were drawn in one image (tools/gen-city-kit-art.py).
 */
(function (W) {
  'use strict';

  var K = {
    W: 32,          /* tile half-width  */
    H: 16,          /* tile half-height */
    RISE: 32,       /* one height unit  */
    UNIT_M: 4,      /* metres per unit  */
    /* Two diamonds that share an edge antialias to a visible hairline, and a
     * whole board of them reads as graph paper. Draw each a whisker larger so
     * the edges overlap instead of meeting. */
    BLEED: 1.035
  };

  K.tokens = {
    ink: '#241a14', cream: '#f3e6cd', white: '#f7f1e4', indigo: '#2f3d78',
    turq: '#3fa89c', water: '#4a86a8', ochre: '#c07a2c', marigold: '#efb34a',
    gold: '#e6c15a', vermilion: '#cf4a34', earth: '#8a5a34', leaf: '#4f8b46',
    stone: '#b9a98c', plum: '#6b4a63'
  };

  /* ---------------------------------------------------------- geometry --- */

  /* Grid point (gx, gy) -> screen point, before any board offset. */
  K.pt = function (gx, gy) {
    return { x: (gx - gy) * K.W, y: (gx + gy) * K.H };
  };

  /* A piece's anchor: the south corner of the cells it covers. */
  K.anchor = function (gx, gy, L, B) {
    return K.pt(gx + L, gy + B);
  };

  /* Turn a footprint on a gw x gh board by r quarter-turns, clockwise on
   * screen. Returns the new origin cell and the new L, B — a 3x1 warehouse
   * becomes 1x3 when the board turns, and its art turns with it. */
  K.turn = function (gx, gy, L, B, r, gw, gh) {
    r = ((r % 4) + 4) % 4;
    if (r === 0) return { x: gx, y: gy, L: L, B: B };
    if (r === 1) return { x: gh - gy - B, y: gx, L: B, B: L };
    if (r === 2) return { x: gw - gx - L, y: gh - gy - B, L: L, B: B };
    return { x: gy, y: gw - gx - L, L: B, B: L };
  };

  /* Painter's order. Ties go to the taller piece so a tower never hides
   * behind the hut in front of it on the same diagonal. */
  K.depth = function (c, H) {
    return (c.x + c.L) + (c.y + c.B) + (H || 0) * 0.001;
  };

  /* The viewBox a part of this size must draw into. Every generator and
   * every traced face is checked against it. */
  K.box = function (L, B, H) {
    return { w: (L + B) * K.W, h: (L + B) * K.H + H * K.RISE };
  };

  /* ------------------------------------------------------------- faces --- */

  /* Which painted face to show: the piece's own facing plus the board's
   * rotation. Radially symmetric parts declare faces:1 and always show 0. */
  K.face = function (facing, r, nfaces) {
    if (!nfaces || nfaces < 2) return 0;
    return ((((facing || 0) + (r || 0)) % 4) + 4) % 4;
  };

  /* ------------------------------------------------------------ shadow --- */

  /* Contact shadows are generated from the footprint, never drawn into the
   * art — that is why the model sheets are told to float on white. One rule
   * for the whole board means the light never disagrees with itself. */
  K.shadow = function (L, B) {
    var rx = (L + B) * K.W * 0.5, ry = (L + B) * K.H * 0.5;
    return '<svg class="kit-sh" width="' + (rx * 2) + '" height="' + (ry * 2) +
      '" viewBox="' + (-rx) + ' ' + (-ry) + ' ' + (rx * 2) + ' ' + (ry * 2) + '">' +
      '<ellipse cx="0" cy="0" rx="' + (rx * 0.86).toFixed(1) + '" ry="' +
      (ry * 0.86).toFixed(1) + '" fill="#241a14" opacity=".17"/></svg>';
  };

  /* -------------------------------------------------------------- part --- */

  K.parts = null;      /* filled from window.IND_CITY_KIT when present */

  K.def = function (id) {
    if (!K.parts && W.IND_CITY_KIT) {
      K.parts = {};
      W.IND_CITY_KIT.parts.forEach(function (p) {
        K.parts[p[0]] = { id: p[0], name: p[1], cat: p[2], d: p[3],
                          era: p[4], desc: p[5], used: p[6] };
      });
    }
    return (K.parts && K.parts[id]) || null;
  };

  /* PNG masters or traced vector. The masters are what the model actually
   * painted; the trace is a compression of them, and how lossy that trade is
   * has to be visible on the board, not argued about. */
  K.prefer = 'png';

  K.src = function (id, face) {
    var svg = W.IND_KIT_SVG && W.IND_KIT_SVG[id],
        png = W.IND_KIT_ART && W.IND_KIT_ART[id],
        tile = W.IND_KIT_TILES && W.IND_KIT_TILES[id];
    if (tile) return 'art/kit/' + id + '/' + face + '.svg';
    if (K.prefer === 'png' && png) return 'art/kit/' + id + '/' + face + '.png';
    if (svg) return 'art/kit/' + id + '/' + face + '.svg';
    if (png) return 'art/kit/' + id + '/' + face + '.png';
    return null;
  };

  K.have = function (id) { return !!K.src(id, 0); };

  /* Ground tiles and road networks are procedural, and addressed differently:
   * a tile by one of its three jitters, a network piece by which neighbours
   * it connects to. Turning the board turns the connections with it — the
   * mask's four bits rotate exactly as the cells do. */
  K.srcTile = function (id, v) { return 'art/kit/' + id + '/v' + (v % 3) + '.svg'; };
  K.srcNet = function (id, m) { return 'art/kit/' + id + '/m' + (m & 15) + '.svg'; };

  K.rotMask = function (m, r) {
    r = ((r % 4) + 4) % 4;
    var out = 0, i;
    for (i = 0; i < 4; i++) if (m & (1 << i)) out |= 1 << ((i + r) % 4);
    return out;
  };

  /* a stable jitter, so a field looks scattered but never reshuffles */
  K.jit = function (x, y) { return (x * 73856093 ^ y * 19349663) >>> 0; };

  /* ------------------------------------------------------------- board --- */

  /* layout: [{ p:'hs-hut-round', x:4, y:7, f:0 }, ...]  in board cells.
   * opts: { rot, gw, gh, scale, pad }
   * Returns HTML; the caller drops it into a positioned container. */
  K.board = function (layout, opts) {
    opts = opts || {};
    var rot = ((opts.rot || 0) % 4 + 4) % 4,
        gw = opts.gw || 36, gh = opts.gh || 24,
        s = opts.scale || 1,
        items = [];

    layout.forEach(function (it) {
      var def = K.def(it.p);
      if (!def) return;
      var L = def.d[0] || 1, B = def.d[1] || 1, H = def.d[2] || 0;
      var c = K.turn(it.x, it.y, L, B, rot, gw, gh);
      items.push({ it: it, def: def, c: c, H: H, z: K.depth(c, H) });
    });
    items.sort(function (a, b) { return a.z - b.z; });

    /* the board's own extent, so the caller can size its container */
    var minX = 1e9, maxX = -1e9, maxY = -1e9, minY = 1e9;
    items.forEach(function (o) {
      var a = K.anchor(o.c.x, o.c.y, o.c.L, o.c.B),
          bx = K.box(o.c.L, o.c.B, o.H);
      minX = Math.min(minX, a.x - bx.w / 2); maxX = Math.max(maxX, a.x + bx.w / 2);
      minY = Math.min(minY, a.y - bx.h);     maxY = Math.max(maxY, a.y);
    });
    if (minX > maxX) { minX = maxX = minY = maxY = 0; }
    var pad = opts.pad == null ? 24 : opts.pad,
        ox = -minX + pad, oy = -minY + pad;

    var html = items.map(function (o) {
      var a = K.anchor(o.c.x, o.c.y, o.c.L, o.c.B),
          x = (a.x + ox) * s, y = (a.y + oy) * s,
          face = K.face(o.it.f, rot, 4),
          src = K.src(o.def.id, face),
          bx = K.box(o.c.L, o.c.B, o.H),
          w = bx.w * s;
      var sh = '<div class="kit-shadow" style="left:' + x.toFixed(1) + 'px;top:' +
        y.toFixed(1) + 'px;width:' + ((o.c.L + o.c.B) * K.W * s).toFixed(1) +
        'px;height:' + ((o.c.L + o.c.B) * K.H * s).toFixed(1) + 'px"></div>';
      if (!src) {
        return sh + '<div class="kit-miss" title="' + o.def.id + '" style="left:' +
          x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px;width:' + w.toFixed(1) +
          'px;height:' + (bx.h * s).toFixed(1) + 'px"></div>';
      }
      return sh + '<img class="kit-p" alt="" src="' + src + '" data-kit="' + o.def.id +
        '" style="left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) +
        'px;width:' + w.toFixed(1) + 'px">';
    }).join('');

    return { html: html,
             w: Math.ceil((maxX - minX) * s + pad * 2),
             h: Math.ceil((maxY - minY) * s + pad * 2) };
  };

  /* A whole city: the ground sheet, then the road network, then everything
   * that stands on them. Three layers, one painter's order, one anchor rule. */
  K.city = function (cid, opts) {
    opts = opts || {};
    var C = (W.IND_KIT_CITIES || {})[cid];
    if (!C) return { html: '<p class="kit-none">no grid for ' + cid + '</p>', w: 0, h: 0 };
    var rot = ((opts.rot || 0) % 4 + 4) % 4, s = opts.scale || 1,
        gw = C.gw, gh = C.gh, pad = opts.pad == null ? 40 : opts.pad,
        road = C.road, out = [], x, y;

    /* extent: the whole board's diamond, not just what happens to stand on it */
    var W2 = (rot % 2 ? gh : gw), H2 = (rot % 2 ? gw : gh);
    var ox = H2 * K.W + pad, oy = pad, tall = opts.headroom == null ? 10 : opts.headroom;
    oy += tall * K.RISE;

    function at(gx, gy, L, B) {
      var a = K.anchor(gx, gy, L, B);
      return { x: (a.x + ox) * s, y: (a.y + oy) * s };
    }

    /* --- the ground sheet --------------------------------------------- */
    for (y = 0; y < gh; y++) {
      for (x = 0; x < gw; x++) {
        var pid = C.legend[C.ground[y][x]];
        if (!pid) continue;
        var c = K.turn(x, y, 1, 1, rot, gw, gh), p = at(c.x, c.y, 1, 1);
        out.push('<img class="kit-g" alt="" src="' + K.srcTile(pid, K.jit(x, y) % 3) +
          '" style="left:' + p.x.toFixed(1) + 'px;top:' + p.y.toFixed(1) +
          'px;width:' + (64 * s * K.BLEED).toFixed(2) + 'px;z-index:' + (c.x + c.y) + '">');
      }
    }
    /* --- the road network, one layer above the sheet ------------------- */
    C.net.forEach(function (n) {
      var c = K.turn(n[0], n[1], 1, 1, rot, gw, gh), p = at(c.x, c.y, 1, 1);
      out.push('<img class="kit-g" alt="" src="' + K.srcNet(road, K.rotMask(n[2], rot)) +
        '" style="left:' + p.x.toFixed(1) + 'px;top:' + p.y.toFixed(1) +
        'px;width:' + (64 * s * K.BLEED).toFixed(2) + 'px;z-index:' + (c.x + c.y + 1) + '">');
    });
    /* --- everything that stands up ------------------------------------- */
    var items = [];
    C.objs.forEach(function (it) {
      var def = K.def(it.p);
      if (!def) return;
      var L = def.d[0] || 1, B = def.d[1] || 1, H = def.d[2] || 0;
      var c = K.turn(it.x, it.y, L, B, rot, gw, gh);
      items.push({ it: it, def: def, c: c, H: H, z: K.depth(c, H) });
    });
    items.sort(function (a, b) { return a.z - b.z; });
    items.forEach(function (o) {
      var p = at(o.c.x, o.c.y, o.c.L, o.c.B),
          src = K.src(o.def.id, K.face(o.it.f, rot, 4)),
          w = K.box(o.c.L, o.c.B, o.H).w * s,
          zi = 1000 + Math.round(o.z * 4);
      out.push('<div class="kit-shadow" style="left:' + p.x.toFixed(1) + 'px;top:' +
        p.y.toFixed(1) + 'px;width:' + ((o.c.L + o.c.B) * K.W * s).toFixed(1) +
        'px;height:' + ((o.c.L + o.c.B) * K.H * s).toFixed(1) + 'px;z-index:' + (zi - 1) + '"></div>');
      if (!src) return;
      out.push('<img class="kit-p" alt="" src="' + src + '" data-kit="' + o.def.id +
        '" title="' + o.def.name + '" style="left:' + p.x.toFixed(1) + 'px;top:' +
        p.y.toFixed(1) + 'px;width:' + w.toFixed(1) + 'px;z-index:' + zi + '">');
    });

    return { html: out.join(''),
             w: Math.ceil(((gw + gh) * K.W) * s + pad * 2),
             h: Math.ceil(((gw + gh) * K.H + tall * K.RISE) * s + pad * 2) };
  };

  K.css = [
    '.kit-stage{position:relative;overflow:hidden}',
    '.kit-p{position:absolute;transform:translate(-50%,-100%);',
    '  image-rendering:auto;pointer-events:none;user-select:none}',
    '.kit-shadow{position:absolute;transform:translate(-50%,-50%);',
    '  border-radius:50%;background:rgba(36,26,20,.17);pointer-events:none}',
    '.kit-miss{position:absolute;transform:translate(-50%,-100%);',
    '  border:1px dashed rgba(207,74,52,.7);background:rgba(207,74,52,.08)}',
    '.kit-g{position:absolute;transform:translate(-50%,-100%);pointer-events:none}'
  ].join('\n');

  W.IND_KIT = K;
})(window);
