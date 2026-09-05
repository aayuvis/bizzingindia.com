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
    BLEED: 1.035,
    /* A person is not as wide as a house plot. The footprint says which cell
     * they stand in; this says how much of it they fill. Getting this wrong
     * is what made the first board's vendors tower over the roofs. */
    FILL: { fg: 0.52, an: 0.58, pr: 0.68, tr: 0.86, cr: 1, gnd: 1, wa: 1, rd: 1 }
  };

  K.fill = function (id) {
    var k = K.FILL[String(id).split('-')[0]];
    return k == null ? 1 : k;
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

  /* Where a piece's shadow goes.
   *
   * Twice this was derived from the FOOTPRINT — the cell the piece occupies —
   * and twice it looked wrong, because the footprint is a game fact and the
   * drawing is not obliged to fill it. A model draws a building at whatever
   * size it likes inside the frame; the frame gets scaled so its bounding box
   * spans the cell, but that box includes the roof overhang and the sky above
   * it, so the BASE the building actually stands on ends up smaller than its
   * cell and sits somewhere inside it. A footprint-sized shadow then sticks
   * out past the walls on the low side, and that crescent of loose shadow is
   * what reads as a building hovering.
   *
   * So the shadow is taken from the ARTWORK instead: a tight pool right under
   * where the drawing ends, sized to the drawing's own width. It cannot be
   * half a cell out, whatever the model decided to draw. */
  K.shadowFor = function (ax, ay, artW) {
    var w = artW * 0.52;
    return { x: ax, y: ay - w * 0.14, w: w, h: w * 0.42 };
  };

  /* The art is placed by its horizontal CENTRE, but the anchor is the south
   * vertex, and for a footprint that is not square those are not the same
   * point: the box spans -B*W to +L*W about the vertex, so its centre sits
   * (L-B)*W/2 to one side. Square pieces were fine and every 2x1 was off. */
  K.artNudge = function (L, B) { return (L - B) * K.W / 2; };

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

  /* The ground is not tiles. It is one painted field per terrain, and each
   * cell shows the part of that field it happens to sit over — so two cells
   * of the same terrain are continuous, and no amount of staring finds a
   * repeat. Procedural tiles were the single worst thing on the first board. */
  K.hasField = function (id) {
    return !!(W.IND_KIT_GROUND && W.IND_KIT_GROUND.indexOf(id) >= 0);
  };

  /* How much of the field one cell shows. Ground wants a WIDE sample so its
   * repeat hides; a crop wants a TIGHT one so its rows actually read as rows.
   * At 0.5 a 64px cell showed an eighth of the painting — one plant, filling
   * the diamond, and a sown field looked like a green lozenge. */
  K.FIELD_S = { cr: 0.28, gnd: 0.5, wa: 0.42 };

  K.fieldCell = function (id, x, y, s, z, sown) {
    var fs = K.FIELD_S[String(id).split('-')[0]] || 0.5;
    var F = (W.IND_KIT_GROUND_SIZE || 1024) * s * fs,
        w = K.W * 2 * s * K.BLEED, h = K.H * 2 * s * K.BLEED,
        l = x - w / 2, t = y - h;
    function m(v) { v = v % F; return v < 0 ? v + F : v; }
    return '<i class="kit-f' + (sown ? ' sown' : '') + '" style="left:' + l.toFixed(1) +
      'px;top:' + t.toFixed(1) +
      'px;width:' + w.toFixed(1) + 'px;height:' + h.toFixed(1) +
      /* A sown plot gets a bund painted INTO its background. box-shadow was
         the obvious way and it does not work: clip-path clips the shadow with
         the box, so the ring simply never appeared. */
      'px;background-image:' + (sown
        ? 'radial-gradient(ellipse 62% 62% at 50% 50%,rgba(0,0,0,0) 52%,rgba(74,48,22,.55) 100%),'
        : '') + 'url(art/kit/_ground/' + id + '.jpg);background-size:' +
      (sown ? '100% 100%,' : '') + F.toFixed(1) + 'px ' + F.toFixed(1) +
      'px;background-position:' + (sown ? '0 0,' : '') +
      (-m(l)).toFixed(1) + 'px ' + (-m(t)).toFixed(1) + 'px;z-index:' + z + '"></i>';
  };
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
      var nud = K.artNudge(o.c.L, o.c.B) * s;
      var sc = K.shadowFor(x + nud, y, w);
      var sh = '<div class="kit-shadow" style="left:' + sc.x.toFixed(1) + 'px;top:' +
        sc.y.toFixed(1) + 'px;width:' + sc.w.toFixed(1) +
        'px;height:' + sc.h.toFixed(1) + 'px"></div>';
      if (!src) {
        return sh + '<div class="kit-miss" title="' + o.def.id + '" style="left:' +
          x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px;width:' + w.toFixed(1) +
          'px;height:' + (bx.h * s).toFixed(1) + 'px"></div>';
      }
      return sh + '<img class="kit-p" alt="" src="' + src + '" data-kit="' + o.def.id +
        '" style="left:' + (x + nud).toFixed(1) + 'px;top:' + y.toFixed(1) +
        'px;width:' + w.toFixed(1) + 'px">';
    }).join('');

    return { html: html,
             w: Math.ceil((maxX - minX) * s + pad * 2),
             h: Math.ceil((maxY - minY) * s + pad * 2) };
  };

  /* Where a plate-percent lands on the kit board, as a percent of the board.
   * This is the same mapping tools/plate-to-grid.py used to rasterise the
   * plates, kept in one place on purpose: the game's building sites, its
   * scaffold and its yatri are all traced in plate percent, and they have to
   * arrive on exactly the cell the ground was built from. Two copies of this
   * arithmetic would be two cities. */
  K.GRID = { gw: 26, gh: 18, sx: 0.86, sy: 0.94, sy0: 0.03 };

  K.cellOf = function (px, py) {
    var G = K.GRID, u = (px - 50) / 50, v = (py - 50) / 50,
        d = (G.gw - G.gh) / 2 + u * (G.gw + G.gh) / 2 * G.sx,
        sV = (v * 0.5 + 0.5) * (G.gw + G.gh) * G.sy + (G.gw + G.gh) * G.sy0;
    return { x: Math.max(0, Math.min(G.gw - 1, Math.round((sV + d) / 2))),
             y: Math.max(0, Math.min(G.gh - 1, Math.round((sV - d) / 2))) };
  };

  /* board box in board units, for a given rotation and headroom */
  K.boardBox = function (gw, gh, headroom) {
    return { w: (gw + gh) * K.W,
             h: (gw + gh) * K.H + (headroom == null ? 8 : headroom) * K.RISE };
  };

  K.mapPct = function (cid, px, py, rot, headroom) {
    var C = (W.IND_KIT_CITIES || {})[cid];
    if (!C) return [px, py];
    var gw = C.gw, gh = C.gh, hr = headroom == null ? 8 : headroom,
        cell = K.cellOf(px, py),
        c = K.turn(cell.x, cell.y, 1, 1, rot || 0, gw, gh),
        a = K.anchor(c.x, c.y, 1, 1),
        box = K.boardBox(gw, gh, hr),
        ox = (rot % 2 ? gw : gh) * K.W, oy = hr * K.RISE;
    return [(a.x + ox) / box.w * 100, (a.y + oy) / box.h * 100];
  };

  /* A tap lands on a cell, not on a piece. This is K.anchor run backwards:
   * the centre of cell (gx,gy) sits at ((gx-gy)*W + ox, (gx+gy+1)*H + oy), so
   * invert that pair and round. Without it a child can look at the board but
   * not build on it. */
  K.cellAtPx = function (cid, px, py, rot, scale, headroom) {
    var C = (W.IND_KIT_CITIES || {})[cid];
    if (!C) return null;
    var s = scale || 1, hr = headroom == null ? 5 : headroom,
        gw = C.gw, gh = C.gh,
        ox = (rot % 2 ? gw : gh) * K.W, oy = hr * K.RISE,
        u = (px / s - ox) / K.W, w = (py / s - oy) / K.H - 1,
        cx = Math.round((u + w) / 2), cy = Math.round((w - u) / 2);
    /* the cell is in TURNED space; turn it back so the caller gets the cell
       the data is stored under, whatever way the board is facing */
    var back = K.turn(cx, cy, 1, 1, (4 - (rot % 4)) % 4,
                      (rot % 2 ? gh : gw), (rot % 2 ? gw : gh));
    if (back.x < 0 || back.y < 0 || back.x >= gw || back.y >= gh) return null;
    return { x: back.x, y: back.y };
  };

  /* Diamond distance from the city's heart — how a city grows OUT. */
  K.reach = function (cid, x, y) {
    var C = (W.IND_KIT_CITIES || {})[cid];
    if (!C || !C.centre) return 0;
    return Math.abs(x - C.centre[0]) + Math.abs(y - C.centre[1]);
  };

  /* What a cell IS, before anything is built on it: 'water', 'road',
   * 'shore' (dry, but touching water), or 'land'. The build rules speak in
   * exactly these words. */
  K.terrain = function (cid, x, y) {
    var C = (W.IND_KIT_CITIES || {})[cid];
    if (!C || x < 0 || y < 0 || x >= C.gw || y >= C.gh) return null;
    var pid = C.legend[C.ground[y].charAt(x)] || '';
    if (pid.indexOf('wa-') === 0) return 'water';
    if (!C._road) {
      C._road = {};
      C.net.forEach(function (n) { C._road[n[0] + ',' + n[1]] = 1; });
      C._shore = {};
      (C.shore || []).forEach(function (n) {
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
          C._shore[(n[0] + d[0]) + ',' + (n[1] + d[1])] = 1;
        });
      });
    }
    if (C._road[x + ',' + y]) return 'road';
    if (C._shore[x + ',' + y]) return 'shore';
    return 'land';
  };

  /* A whole city: the ground sheet, then the road network, then everything
   * that stands on them. Three layers, one painter's order, one anchor rule. */
  K.city = function (cid, opts) {
    opts = opts || {};
    var C = (W.IND_KIT_CITIES || {})[cid];
    if (!C) return { html: '<p class="kit-none">no grid for ' + cid + '</p>', w: 0, h: 0 };
    var rot = ((opts.rot || 0) % 4 + 4) % 4, s = opts.scale || 1,
        gw = C.gw, gh = C.gh, pad = opts.pad == null ? 0 : opts.pad,
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
        var pid = C.legend[C.ground[y].charAt(x)];
        if (opts.tiles && opts.tiles[x + ',' + y]) pid = opts.tiles[x + ',' + y];
        if (!pid) continue;
        var c = K.turn(x, y, 1, 1, rot, gw, gh), p = at(c.x, c.y, 1, 1);
        var sown = !!(opts.tiles && opts.tiles[x + ',' + y]);
        if (K.hasField(pid)) {
          out.push(K.fieldCell(pid, p.x, p.y, s, c.x + c.y, sown));
        } else {
          out.push('<img class="kit-g" alt="" src="' + K.srcTile(pid, K.jit(x, y) % 3) +
            '" style="left:' + p.x.toFixed(1) + 'px;top:' + p.y.toFixed(1) +
            'px;width:' + (64 * s * K.BLEED).toFixed(2) + 'px;z-index:' + (c.x + c.y) + '">');
        }
      }
    }
    /* --- the road network, one layer above the sheet ------------------- */
    (C.shore || []).forEach(function (n) {
      var c = K.turn(n[0], n[1], 1, 1, rot, gw, gh), p = at(c.x, c.y, 1, 1);
      out.push('<img class="kit-g" alt="" src="art/kit/_shore/m' +
        K.rotMask(n[2], rot) + '.svg" style="left:' + p.x.toFixed(1) + 'px;top:' +
        p.y.toFixed(1) + 'px;width:' + (64 * s * K.BLEED).toFixed(2) +
        'px;z-index:' + (c.x + c.y + 1) + '">');
    });
    C.net.forEach(function (n) {
      var c = K.turn(n[0], n[1], 1, 1, rot, gw, gh), p = at(c.x, c.y, 1, 1);
      out.push('<img class="kit-g" alt="" src="' + K.srcNet(road, K.rotMask(n[2], rot)) +
        '" style="left:' + p.x.toFixed(1) + 'px;top:' + p.y.toFixed(1) +
        'px;width:' + (64 * s * K.BLEED).toFixed(2) + 'px;z-index:' + (c.x + c.y + 2) + '">');
    });
    /* --- the reach ring: land the city may build on, and land it may not.
       Outside it the ground is dimmed, so how far the city has grown is a
       thing you SEE rather than a number in a menu. --- */
    if (opts.reach != null && C.centre) {
      for (y = 0; y < gh; y++) {
        for (x = 0; x < gw; x++) {
          if (K.reach(cid, x, y) <= opts.reach) continue;
          var cw = K.turn(x, y, 1, 1, rot, gw, gh), pw = at(cw.x, cw.y, 1, 1);
          out.push('<i class="kit-far" style="left:' + (pw.x - K.W * s).toFixed(1) +
            'px;top:' + (pw.y - K.H * 2 * s).toFixed(1) + 'px;width:' +
            (K.W * 2 * s * K.BLEED).toFixed(1) + 'px;height:' +
            (K.H * 2 * s * K.BLEED).toFixed(1) + 'px;z-index:' + (cw.x + cw.y + 3) + '"></i>');
        }
      }
    }

    /* --- everything that stands up ------------------------------------- */
    var items = [];
    /* A bought FIELD is ground, not a thing standing on ground. It goes into
       the city's built list because that is what pays out every turn, but it
       must be drawn once — as the ground it replaced. Drawn twice, the flat
       piece sits on top of the painted rows and hides them, which is exactly
       what made every crop read as a green lozenge. */
    var standing = (opts.built || []).filter(function (b2) {
      return !(opts.tiles && opts.tiles[b2.x + ',' + b2.y] === b2.p);
    });
    (C.wild || []).concat(standing).forEach(function (it) {
      var def = K.def(it.p);
      if (!def) return;
      var L = def.d[0] || 1, B = def.d[1] || 1, H = def.d[2] || 0;
      var c = K.turn(it.x, it.y, L, B, rot, gw, gh);
      items.push({ it: it, def: def, c: c, H: H, z: K.depth(c, H) });
    });
    /* the ghost the child is holding, drawn on the board it will land on */
    if (opts.ghost && opts.ghost.p) {
      var gd = K.def(opts.ghost.p);
      if (gd) {
        var gc = K.turn(opts.ghost.x, opts.ghost.y, gd.d[0] || 1, gd.d[1] || 1, rot, gw, gh);
        items.push({ it: { p: opts.ghost.p, f: opts.ghost.f || 0, ghost: 1,
                           ok: opts.ghost.ok }, def: gd, c: gc,
                     H: gd.d[2] || 0, z: K.depth(gc, gd.d[2] || 0) + 0.5 });
      }
    }
    items.sort(function (a, b) { return a.z - b.z; });
    items.forEach(function (o) {
      var p = at(o.c.x, o.c.y, o.c.L, o.c.B),
          src = K.src(o.def.id, K.face(o.it.f, rot, 4)),
          k = K.fill(o.def.id),
          w = K.box(o.c.L, o.c.B, o.H).w * s * k,
          zi = 1000 + Math.round(o.z * 4);
      var nudge = K.artNudge(o.c.L, o.c.B) * s;
      var sh = K.shadowFor(p.x + nudge, p.y, w);
      out.push('<div class="kit-shadow" style="left:' + sh.x.toFixed(1) + 'px;top:' +
        sh.y.toFixed(1) + 'px;width:' + sh.w.toFixed(1) +
        'px;height:' + sh.h.toFixed(1) + 'px;z-index:' + (zi - 1) + '"></div>');
      if (!src) return;
      out.push('<img class="kit-p' + (o.it.ghost ? ' kit-ghost' + (o.it.ok ? ' ok' : ' no') : '') +
        '" alt="" src="' + src + '" data-kit="' + o.def.id +
        '" title="' + o.def.name + '" style="left:' + (p.x + nudge).toFixed(1) + 'px;top:' +
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
    '.kit-g{position:absolute;transform:translate(-50%,-100%);pointer-events:none}',
    '.kit-f{position:absolute;display:block;pointer-events:none;',
    '  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}',
    '.kit-f.sown{filter:saturate(1.06) brightness(.97)}',
    '.kit-far{position:absolute;display:block;pointer-events:none;background:rgba(22,14,30,.42);',
    '  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}',
    '.kit-ghost{opacity:.72;filter:drop-shadow(0 0 6px rgba(233,161,59,.9))}',
    '.kit-ghost.no{filter:grayscale(1) drop-shadow(0 0 6px rgba(207,74,52,.95));opacity:.5}'
  ].join('\n');

  /* The board is built at true board pixels and then scaled to whatever box
   * it has been given, so one arithmetic serves a phone and a desktop. */
  K.fit = function (root) {
    var els = (root || document).querySelectorAll('.sab-kitinner');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], box = el.parentNode;
      /* Measure the box's PARENT, never the box. fit() sets the box's own
         width, so measuring the box feeds its last answer back into the next
         one and the scale runs away — it reached 15170x before this line. */
      /* CONTAIN, not just fit-to-width. On a wide screen a board fitted only
         by its width comes out taller than the window and the city scrolls
         vertically at 100%, which is not what 100% should mean. */
      var host = (box.closest && box.closest('.sab-view')) || box.parentNode || box;
      var bw = host.clientWidth || host.offsetWidth;
      var bh = host.clientHeight || host.offsetHeight;
      if (!bw) continue;
      var w = parseFloat(el.style.width) || 1;
      /* fit to the box, then multiply by however far the child has zoomed in.
         Past 1 the board is bigger than its window and the window scrolls —
         which is how a city becomes something you move around inside. */
      var z = parseFloat(el.getAttribute('data-z')) || 1;
      var hh = parseFloat(el.style.height) || 1;
      /* ground tiles are drawn a whisker over size so their edges overlap
         rather than hairline, and that whisker is enough to put a scrollbar
         on a board that should exactly fit */
      /* CONTAIN IN A PANEL, COVER ON A FULL SCREEN.
         In a panel with a page under it, 100% should mean "the whole board
         fits" — anything else put a scrollbar on a board that had room. A
         full-screen city is the opposite promise: the city IS the window, and
         a contained board leaves a dead band of nothing under it on a phone,
         where the board is far wider than it is tall. There, fill the frame
         and let the child pan. */
      var full = box.closest && box.closest('.sab-scene.full');
      var bleed = K.BLEED,
          base = !bh ? bw / (w * bleed)
               : full ? Math.max(bw / (w * bleed), bh / (hh * bleed))
                      : Math.min(bw / (w * bleed), bh / (hh * bleed));
      var k = base * z;
      if (!(k > 0.02 && k < 12)) continue;      /* a scale that absurd is a bug */
      el.style.transform = 'scale(' + k.toFixed(5) + ')';
      el.setAttribute('data-k', k.toFixed(5));
      box.style.height = (parseFloat(el.style.height) * k).toFixed(1) + 'px';
      box.style.width = (w * k).toFixed(1) + 'px';
    }
  };

  /* Zoomed in, the window shows whatever corner the scroll happens to sit on,
   * and a board's north corner is empty ground. Put the city's heart in the
   * middle of the window instead — or the cell the child is holding a piece
   * over, which is the thing they are actually looking at. */
  K.lookAt = function (cid, rot, headroom, cell) {
    var C = (W.IND_KIT_CITIES || {})[cid];
    var inr = document.getElementById('sab-kitinner');
    if (!C || !inr) return;
    /* Nearest ancestor that actually SCROLLS. Content overflowing is not the
       same as scrolling: .sab-cam overflows and ignores scrollLeft, while its
       parent is the one with overflow:auto. Ask the computed style. */
    var box = inr.parentNode;
    while (box && box !== document.body && box !== document.documentElement) {
      var ov = W.getComputedStyle ? W.getComputedStyle(box) : null;
      if (ov && /auto|scroll/.test(ov.overflowX + ' ' + ov.overflowY) &&
          (box.scrollWidth > box.clientWidth + 2 ||
           box.scrollHeight > box.clientHeight + 2)) break;
      box = box.parentNode;
    }
    if (!box || box === document.body || box === document.documentElement) return;
    var k = parseFloat(inr.getAttribute('data-k')) || 1,
        hr = headroom == null ? 5 : headroom,
        at = cell || C.centre || [C.gw / 2 | 0, C.gh / 2 | 0],
        c = K.turn(at[0], at[1], 1, 1, rot || 0, C.gw, C.gh),
        a = K.anchor(c.x, c.y, 1, 1),
        ox = ((rot || 0) % 2 ? C.gw : C.gh) * K.W;
    box.scrollLeft = Math.max(0, (a.x + ox) * k - box.clientWidth / 2);
    box.scrollTop = Math.max(0, (a.y + hr * K.RISE) * k - box.clientHeight / 2);
  };

  /* the city repaint replaces the scene, which resets its scroll to zero, so the
     look has to happen after the browser has actually laid the new one out */
  K.lookSoon = function (cid, rot, headroom, cell) {
    var go = function () { K.fit(document); K.lookAt(cid, rot, headroom, cell); };
    if (W.requestAnimationFrame) W.requestAnimationFrame(function () { go(); go(); });
    else go();
  };

  K.autofit = function () {
    if (K._af) return;
    K._af = 1;
    var run = function () { K.fit(document); };
    if (W.ResizeObserver) {
      var ro = new ResizeObserver(run);
      if (document.body) ro.observe(document.body);
    }
    W.addEventListener('resize', run);
    new MutationObserver(run).observe(document.documentElement,
      { childList: true, subtree: true });
    run();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { K.autofit(); });
  } else { K.autofit(); }

  W.IND_KIT = K;
})(window);
