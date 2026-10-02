/* avatar-catalogue.js — Bizzing India's 96, in the family's one shape (standard §8).

   The engine is the family's (family/bizzing-avatars.js): four tiers at fixed prices, twelve
   packs of eight shaped 2 common · 3 rare · 2 epic · 1 legendary, a named learning milestone
   on every Legendary, two packs to each of six worlds. This file only says which of India's
   faces sits where. It is built from avatars.js's pack order, so the pack list and the
   catalogue cannot disagree:

     ids[0..1] common · ids[2..4] rare · ids[5..6] epic · ids[7] legendary

   OWNER'S DECISION (2 Oct 2026): sacred figures and real people stay in the collection.
   Marked here so the tests can keep them honest — `sacred: true` is never in a villains'
   pack (India has none), and every real person carries a one-line `about` that comes from
   their own card's checked lines (avatar-cards.js), never typed here from memory.

   window.IND_AVATARS          the 96 entries the engine validates
   window.IND_AVATAR_WORLDS    the six worlds the packs pair with, in order
   window.IND_LEGEND_MILESTONES  id -> { label, ok(evidence) } — app.js measures them */
(function (W) {
  'use strict';
  var TIER_AT = ['common', 'common', 'rare', 'rare', 'rare', 'epic', 'epic', 'legendary'];
  /* the six worlds, in pairing order: packs 1–2 → 1, 3–4 → 2, … 11–12 → 6 */
  var WORLDS = ['delhi6', 'madhubani', 'diwali', 'pujo', 'cricket', 'antariksh'];

  /* ONE NAMED MILESTONE PER LEGENDARY, measured from evidence the app already keeps —
     stories finished, places lit, epic nights heard, rungs and course tests passed under
     their own day rules. Never days in a row, never time, never coins. */
  var MS = {
    darbar:      { id: 'ms-lit10',   label: 'Light ten places on the map',               ok: function (e) { return e.lit >= 10; } },
    mahabharata: { id: 'ms-mbh6',    label: 'Hear six nights of the Mahabharata',        ok: function (e) { return (e.epic.mahabharata || 0) >= 6; } },
    panch:       { id: 'ms-pt5',     label: 'Finish five Panchatantra stories',          ok: function (e) { return e.pre('pt.') >= 5; } },
    dashavatara: { id: 'ms-dv5',     label: 'Finish five stories of the avatars',        ok: function (e) { return e.pre('dv.') >= 5; } },
    devas:       { id: 'ms-story25', label: 'Finish twenty-five stories',                ok: function (e) { return e.read >= 25; } },
    ramayana:    { id: 'ms-ram6',    label: 'Hear six nights of the Ramayana',           ok: function (e) { return (e.epic.ramayana || 0) >= 6; } },
    pantheon:    { id: 'ms-rung1',   label: 'Master a rung of a language',               ok: function (e) { return e.rungs >= 1; } },
    asuras:      { id: 'ms-ds5',     label: 'Finish five stories of the devas and asuras', ok: function (e) { return e.pre('ds.') >= 5; } },
    khel:        { id: 'ms-obj3',    label: 'Pass three course tests, each on a later day', ok: function (e) { return e.objectives >= 3; } },
    great:       { id: 'ms-lit20',   label: 'Light twenty places on the map',            ok: function (e) { return e.lit >= 20; } },
    vigyan:      { id: 'ms-sci5',    label: 'Finish five stories of the scientists',     ok: function (e) { return e.pre('sci-') >= 5; } },
    naya:        { id: 'ms-made1',   label: 'Finish a course project the workshop can check', ok: function (e) { return e.made >= 1; } }
  };

  /* Sacred: the faiths' own figures — the gods and teachers, the descents, the devas,
     and from the epics Rama, Sita and Hanuman's company as families keep them. The revered
     among the asuras (Prahlada the devotee, Mahabali whom Kerala welcomes, Shukracharya the
     guru) are marked too, so a test can see that none of them ever sits in a villains' pack. */
  var SACRED_PACKS = ['devas', 'dashavatara', 'pantheon'];
  var SACRED_IDS = ['rama', 'sita', 'lakshmana', 'valmiki', 'shabari', 'prahlada', 'bali', 'shukracharya'];
  /* real people beyond the card file's list: the Buddha and Mahavira lived */
  var REAL_TOO = ['buddha', 'mahavira'];

  function about(id) {
    var c = W.IND_AV_CARD ? W.IND_AV_CARD(id) : null;
    if (!c) return '';
    return (c.achievements && c.achievements[0]) || c.lore || '';
  }

  var out = [], PACKS = W.IND_AVATAR_PACKS || [], REAL = W.IND_AV_REAL_PEOPLE || [];
  PACKS.forEach(function (p, pi) {
    (p.ids || []).forEach(function (id, k) {
      var tier = TIER_AT[k];
      var a = { id: id, name: (W.IND_AVATAR_NAMES || {})[id] || id, pack: pi + 1, packId: p.id, tier: tier,
                art: 'art/av/' + id + '.webp' };
      if (SACRED_PACKS.indexOf(p.id) >= 0 || SACRED_IDS.indexOf(id) >= 0) a.sacred = true;
      if (REAL.indexOf(id) >= 0 || REAL_TOO.indexOf(id) >= 0) { a.real = true; a.about = about(id); }
      if (p.id === 'ramayana' || p.id === 'mahabharata' || p.id === 'asuras') a.epic = true;
      if (tier === 'legendary' && MS[p.id]) a.milestone = { id: MS[p.id].id, label: MS[p.id].label };
      out.push(a);
    });
  });
  W.IND_AVATARS = out;
  /* THE 96 IN THE FAMILY STICKER STYLE (standard §8; FIX-INDIA J2): 512px WebP under art/av/,
     drawn from each character's own earlier portrait so every identifying attribute stays,
     and looked at, one by one, before shipping. art() prefers these everywhere. */
  W.IND_AV_WEBP = out.map(function (a) { return a.id; });
  W.IND_AVATAR_WORLDS = WORLDS;
  W.IND_LEGEND_MILESTONES = {};
  Object.keys(MS).forEach(function (k) { W.IND_LEGEND_MILESTONES[MS[k].id] = MS[k]; });
  W.IND_AVATAR_BY_ID = {};
  out.forEach(function (a) { W.IND_AVATAR_BY_ID[a.id] = a; });
})(window);
