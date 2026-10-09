/* Bizzing India — Katha Chain: which tales may be cut into panels (games spec §5.3, §7).

   PROPOSALS, AWAITING THE NAMED REVIEWER. Nothing here is signed. Until `signedBy` is filled
   in by the reviewer (docs/05 §6), Katha Chain registers with review: true and opens only in
   tester mode (?tester=1). The reviewer may strike any line; a struck line is simply not dealt.

   HOW THE LIST WAS CHOSEN — by explicit rule, never inferred per story at run time:
     1. collection is one of the folk, animal and wit collections:
          panchatantra · panch-more   (Panchatantra, and a few Hitopadesha tales)
          jataka · jataka-more        (Jataka tales: the animals' stories)
          chatur                      (Tenali Raman, Gopal Bhar, Gonu Jha, Vikram and the Vetala)
          birbal                      (Akbar and Birbal)
     2. badge is 🪔 katha — never 📜 itihaas (history is never shuffled into fiction), never 🧭 aaj
     3. not needs_review
     4. no sacred figure in the cast (any avatar on a 'sacred' shelf of IND_AVATAR_PACKS)
     5. struck by hand where the turn of the tale is a sacred or devotional episode (below)

   STRUCK, with the reason, for the reviewer to confirm:
     wt.tenali-vikatakavi — the goddess is a central figure (rule 4)
     jt.hare-moon         — the turn is the hare's self-offering to a divine visitor (rule 5)

   Regional folk tales (desh, desh-more and the regional shelves) are not proposed yet: many of
   them centre a deity or a sacred place, and that call is a per-story reading for the reviewer,
   not a rule. Sacred narratives stay in the reader and the epic serial (spec §5.3). */
window.IND_KATHA_CHAIN = {
  signedBy: null,          /* the named reviewer, and the date, when signed */
  rule: 'collection in panchatantra|panch-more|jataka|jataka-more|chatur|birbal · badge katha · no sacred cast',
  katha_chain: {
    /* Panchatantra */
    'pt.lion-rabbit': true,
    'pt.monkey-crocodile': true,
    'pt.talkative-tortoise': true,
    'pt.blue-jackal': true,
    /* More Panchatantra (and the Hitopadesha) */
    'pt.mongoose-baby': true,
    'pt.four-friends': true,
    'pt.mice-iron': true,
    'pt.crane-crab': true,
    'pt.elephants-rabbits': true,
    'pt.two-headed-bird': true,
    'pt.lion-makers': true,
    'pt.drum-jackal': true,
    'pt.monkey-wedge': true,
    'pt.singing-donkey': true,
    /* Jataka */
    'jt.quails-net': true,
    'jt.banyan-deer': true,
    /* More Jataka */
    'jt.golden-goose': true,
    'jt.woodpecker-lion': true,
    'jt.elephant-dog': true,
    'jt.nandivisala': true,
    'jt.monkey-gardener': true,
    'jt.crocodile-rock': true,
    'jt.parrot-figtree': true,
    'jt.partridge-elders': true,
    'jt.quail-fire': true,
    'jt.guttila-veena': true,
    'jt.three-birds-king': true,
    'jt.trees-together': true,
    /* The Clever Ones */
    'wt.gopal-smell': true,
    'wt.tenali-thieves': true,
    'wt.tenali-dolls': true,
    'wt.gonu-brinjal': true,
    'wt.kashmir-carry': true,
    'wt.vetala-tree': true,
    'wt.tenali-book': true,
    /* Akbar and Birbal */
    'ab.shorter-line': true,
    'ab.khichdi': true,
    'ab.crows': true
  }
};
