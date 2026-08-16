/* Bizzing India — Shlok: verses a child learns and carries.

   WHY THIS PILLAR EXISTS (docs/10 §3): a story entertains; a verse is something a child
   keeps. Every Indian grandparent can still recite what they learned at seven. The atom is
   one verse — the text in its own script, a transliteration, a child-level meaning, a
   human voice, and honest attribution.

   ============================ THE HARD RULE ============================
   docs/05 §6.4 and docs/10 §3 are binding here above everywhere else:

     NEVER invent, paraphrase-as-quotation, or reconstruct a verse from memory.

   A wrong Gita verse in a children's app is not a typo. It is the error that ends the
   product's credibility with the exact families it is for.

   Nothing in this file is a substitute for the rule in docs/10: EVERY verse must still be
   collated against a named printed edition and signed off by a reader of that language
   before it ships. This file is a draft corpus with its uncertainty made visible, not a
   verified one. Under-delivering was preferred to guessing throughout.

   Three honesty flags are used, in this order of preference:
     (nothing)               — the original-script text is given and I am confident of it.
     unsure: true            — text is given but something specific is doubtful. `note`
                               says exactly what, so a reviewer knows where to look.
     needs_original: true    — text_original and translit are BOTH null. Only the sense is
                               given. Where the script is uncertain the transliteration is
                               equally uncertain, so it is withheld too rather than dressed
                               up as scholarship. `note` says so.

   FIELDS
     id            stable key, never renumbered
     collection    must match a collections[].id below
     n             the verse's real number in its source. For subhashitas, which mostly
                   have no canonical number, `n` is our own catalogue index and the verse
                   carries n_local:true — the app must never display it as a source number.
     text_original the verse in its own script, or null
     translit      readable romanisation (IAST for Sanskrit and Pali), or null
     meaning_kid   one or two sentences, concrete, no abstraction, no preaching
     meaning_big   a fuller line for 10+
     why           why this one is worth carrying, tied to something in a child's life
     source        work, chapter/section, verse number
     audio         key only — NO audio has been recorded yet. Per docs/09 these must be a
                   human voice, never TTS: children imitate what they hear, and Tamil, Pali
                   and Sanskrit recitation has metre in it that a synthesiser destroys.
     gate          minimum age band
     note          required when unsure or needs_original; occasionally an editorial note

   EDITORIAL
   - Collections are never ranked and never compared to judge (docs/05 §2). Each is
     introduced the way a family who keeps it would introduce it.
   - The Bhagavad Gita is gated to 10+ and framed as docs/02 frames it — "a talk about
     doing the right thing when it is hard". The five chosen are the least doctrinally
     loaded ones. Gita 3.35 (svadharma) was deliberately not included: it is read through
     caste in modern argument and docs/05 §6.5 sends caste to a human author.
   - Kural 55 was deliberately not included, famous though it is: it is about a wife
     worshipping her husband and this is a children's product in 2026.
   - Where classical Sanskrit uses a gendered noun for "person" (puruṣa), meaning_kid
     renders it inclusively and meaning_big keeps the literal sense visible.

   TODO for the art pipeline: the Thirukkural collection currently borrows `saraswati`
   because she is the figure of letters and learning, NOT as a claim about Thiruvalluvar's
   own tradition — which is genuinely contested between Jain, Shaiva and secular readings
   and is not ours to settle. It should be replaced by a non-figurative mark: the Tamil
   letter அ, a palm-leaf manuscript, or the Thiruvalluvar statue idiom. */

window.IND_SHLOK = {

  intro: 'A story is something you hear. A verse is something you keep. These are short ' +
         'enough to learn in an afternoon and old enough that somebody in your family ' +
         'probably already knows one. Ask them — you might get it in their voice instead ' +
         'of ours.',

  collections: [
    {
      id: 'kural',
      name: 'Thirukkural',
      source: 'Thirukkural, by Thiruvalluvar — Tamil. Usually dated to somewhere in the ' +
              'first few centuries CE; grown-ups still argue about exactly when.',
      count_total: 1330,
      blurb: 'One thousand three hundred and thirty couplets, each exactly two lines and ' +
             'seven words long. It is about how to be a decent person, and it never once ' +
             'tells you which god to pray to — which is why Tamil families of every faith, ' +
             'and plenty of families of none, have kept it for two thousand years.',
      language: 'Tamil',
      script: 'Tamil',
      avatar: 'saraswati'
    },
    {
      id: 'dhammapada',
      name: 'Dhammapada',
      source: 'Dhammapada, Khuddaka Nikaya of the Pali Canon — 423 verses in 26 chapters.',
      count_total: 423,
      blurb: 'Four hundred and twenty-three verses of what the Buddha taught, arranged by ' +
             'subject: the mind, flowers, anger, the thousands. They were carried in ' +
             'people’s memory for a long time before anybody wrote them down.',
      language: 'Pali',
      script: 'Roman with diacritics',
      script_note: 'Pali has no single script of its own — the canon is printed in ' +
                   'Sinhala, Burmese, Thai, Khmer, Devanagari and Roman, all equally ' +
                   'valid. Romanised Pali with diacritics is the scholarly standard and is ' +
                   'what text_original holds here. Whether to add a Devanagari rendering ' +
                   'for Indian families is a reviewer’s call, not ours.',
      avatar: 'buddha'
    },
    {
      id: 'subhashita',
      name: 'Subhashitas',
      source: 'Sanskrit subhashitas — “well-said things”. Some sit in a named collection ' +
              'such as the Hitopadesha; many float, and their author is genuinely unknown.',
      count_total: null,
      count_note: 'There is no fixed number. A subhashita is a short Sanskrit verse that ' +
                  'got repeated until everybody knew it; anthologies of them run to many ' +
                  'thousands and no two agree. Where we cannot name the collection, we say ' +
                  'so on the card rather than inventing a citation.',
      blurb: 'Little Sanskrit verses that somebody said so well that people kept saying ' +
             'them. Four lines, usually, with one sharp picture in the middle — a sleeping ' +
             'lion, a snake wearing a jewel, a crow in spring.',
      language: 'Sanskrit',
      script: 'Devanagari',
      avatar: 'chanakya'
    },
    {
      id: 'gita',
      name: 'Bhagavad Gita',
      source: 'Bhagavad Gita — 700 shlokas, sitting inside the Bhishma Parva of the ' +
              'Mahabharata.',
      count_total: 700,
      blurb: 'A talk between a soldier who does not want to fight and his charioteer, on ' +
             'the morning of a battle. It is about doing the right thing when the right ' +
             'thing is hard and you would rather go home.',
      language: 'Sanskrit',
      script: 'Devanagari',
      avatar: 'krishna',
      gate: 10,
      gate_note: 'The whole collection is 10+, per docs/02. The Gita sits on a battlefield ' +
                 'and its questions are not seven-year-old questions.'
    }
  ],

  verses: [

    /* ================================================== THIRUKKURAL (16) ==================================================
       Book I is Aram (virtue), Book II Porul (wealth and governing), Book III Inbam (love).
       Chapter names below are given in the sense most modern Tamil editions use. */

    {
      id: 'kural-1', collection: 'kural', n: 1,
      text_original: 'அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு',
      translit: 'agara mudhala ezhuththellām ādhi\nbagavan mudhatrē ulagu',
      meaning_kid: 'A is the first letter — everything written starts there. The poet says ' +
                   'the world starts with God in exactly the same way.',
      meaning_big: 'As the letter A stands first among all letters, so the ancient God ' +
                   'stands first in the world.',
      why: 'It is the opening line of a book with 1,330 lines in it, and it begins with ' +
           'the alphabet. The same alphabet somebody is teaching you right now.',
      source: 'Thirukkural 1 — Book I (Aram), chapter 1, “In praise of God”',
      audio: 'shlok/kural-1', gate: 7
    },
    {
      id: 'kural-34', collection: 'kural', n: 34,
      text_original: 'மனத்துக்கண் மாசிலன் ஆதல் அனைத்தறன்\nஆகுல நீர பிற',
      translit: 'manaththukkaṇ māsilan ādhal anaiththaran\nāgula nīra pira',
      meaning_kid: 'Being clean inside your own head is the whole of doing right. ' +
                   'Everything else people call good is just noise on top.',
      meaning_big: 'To be spotless in mind is the entirety of virtue; all the rest is ' +
                   'display and clamour.',
      why: 'You can look completely fine to everybody in the room and still know exactly ' +
           'what you did. This couplet is about the part only you can see.',
      source: 'Thirukkural 34 — Book I (Aram), chapter 4, “The strength of virtue”',
      audio: 'shlok/kural-34', gate: 7
    },
    {
      id: 'kural-66', collection: 'kural', n: 66,
      text_original: 'குழல் இனிது யாழ் இனிது என்பதம் மக்கள்\nமழலைச் சொல் கேளா தவர்',
      translit: 'kuzhal inidhu yāzh inidhu enbadham makkaḷ\nmazhalaich chol kēḷā dhavar',
      meaning_kid: 'People say the flute sounds sweet and the veena sounds sweet. Those ' +
                   'people, says the poet, have never heard their own small child talking.',
      meaning_big: 'Only those who have not heard the babbling speech of their own children ' +
                   'say that the flute and the lute are sweet.',
      why: 'Somebody at home thinks the noise you make is the best music there is. Go and ' +
           'ask them whether that is true.',
      source: 'Thirukkural 66 — Book I (Aram), chapter 7, “The wealth of children”',
      audio: 'shlok/kural-66', gate: 7,
      unsure: true,
      note: 'The sense and the imagery I am confident of. What I am NOT confident of is the ' +
            'word division in line 1: “என்பதம் மக்கள்” resolves as என்ப + தம் மக்கள், and ' +
            'editions split and print it differently. A Tamil reader must set the split ' +
            'from a printed edition before this is shown to a child.'
    },
    {
      id: 'kural-80', collection: 'kural', n: 80,
      text_original: 'அன்பின் வழியது உயிர்நிலை அஃதிலார்க்கு\nஎன்புதோல் போர்த்த உடம்பு',
      translit: 'anbin vazhiyadhu uyirnilai aqdhilārkku\nenbudhōl pōrththa udambu',
      meaning_kid: 'A life with love in it is what being alive actually means. Without it, ' +
                   'says the poet, a body is just bones with some skin thrown over them.',
      meaning_big: 'Life is held together by love; to those without it, the body is bone ' +
                   'covered over with skin.',
      why: 'It is a shocking thing to say and it is meant to be. Love is not decoration on ' +
           'top of a life. It is the thing that makes it one.',
      source: 'Thirukkural 80 — Book I (Aram), chapter 8, “Having love”',
      audio: 'shlok/kural-80', gate: 7
    },
    {
      id: 'kural-100', collection: 'kural', n: 100,
      text_original: 'இனிய உளவாக இன்னாத கூறல்\nகனிஇருப்பக் காய்கவர்ந் தற்று',
      translit: 'iniya uḷavāga innādha kūral\nkani-iruppak kāykavarn dhatru',
      meaning_kid: 'Saying the mean thing when a kind one was right there is like grabbing ' +
                   'the hard sour fruit while the ripe sweet one sat next to it.',
      meaning_big: 'To speak harshly when gentle words are available is to pick the unripe ' +
                   'fruit while the ripe fruit hangs beside it.',
      why: 'There were two things you could have said to your friend, and you picked the ' +
           'one that stung. This couplet is about that exact half-second.',
      source: 'Thirukkural 100 — Book I (Aram), chapter 10, “Speaking sweetly”',
      audio: 'shlok/kural-100', gate: 7
    },
    {
      id: 'kural-104', collection: 'kural', n: 104,
      text_original: 'தினைத்துணை நன்றி செயினும் பனைத்துணையாக்\nகொள்வர் பயன்தெரி வார்',
      translit: 'thinaiththuṇai nandri seyinum panaiththuṇaiyāk\nkoḷvar payandheri vār',
      meaning_kid: 'Somebody helps you by an amount the size of a millet seed — the tiniest ' +
                   'grain there is. A person who understands counts it as big as a palm tree.',
      meaning_big: 'Though a kindness be no bigger than a millet grain, those who know what ' +
                   'kindness is for reckon it the size of a palmyra palm.',
      why: 'Someone gave you half their snack once when you had none. Small for them. Huge ' +
           'for you. That is the whole couplet, and it is why you still remember it.',
      source: 'Thirukkural 104 — Book I (Aram), chapter 11, “Knowing what has been done for you”',
      audio: 'shlok/kural-104', gate: 7
    },
    {
      id: 'kural-131', collection: 'kural', n: 131,
      text_original: 'ஒழுக்கம் விழுப்பந் தரலான் ஒழுக்கம்\nஉயிரினும் ஓம்பப் படும்',
      translit: 'ozhukkam vizhuppan dharalān ozhukkam\nuyirinum ōmbap padum',
      meaning_kid: 'How you behave is what earns you respect. So look after your behaviour ' +
                   'even more carefully than you look after yourself.',
      meaning_big: 'Because good conduct is what confers dignity, it should be guarded more ' +
                   'closely than life itself.',
      why: 'Nobody can see your marks from across a room. They can see how you treat the ' +
           'kid nobody sits with.',
      source: 'Thirukkural 131 — Book I (Aram), chapter 14, “Right conduct”',
      audio: 'shlok/kural-131', gate: 7,
      unsure: true,
      note: 'Doubt is in line 1 only: I am unsure whether the printed form is ' +
            '“விழுப்பந் தரலான்” split as here, or “விழுப்பம் தரலான்” unsplit. The sense is ' +
            'unaffected but the text on screen must match an edition. Line 2 I am confident of.'
    },
    {
      id: 'kural-291', collection: 'kural', n: 291,
      text_original: 'வாய்மை எனப்படுவது யாதெனின் யாதொன்றும்\nதீமை இலாத சொலல்',
      translit: 'vāymai enappaduvadhu yādhenin yādhondrum\nthīmai ilādha solal',
      meaning_kid: 'Somebody asks the poet: what is truth? He answers: words with no harm ' +
                   'in them at all, to anybody.',
      meaning_big: 'Truthfulness, he says, is not merely reporting what happened — it is ' +
                   'speech that carries no harm whatsoever in it.',
      why: 'This is a much bigger idea than “do not lie”. You can say something perfectly ' +
           'true and use it to hurt someone. The Kural says that is not truth either.',
      source: 'Thirukkural 291 — Book I (Aram), chapter 30, “Truthfulness”',
      audio: 'shlok/kural-291', gate: 7
    },
    {
      id: 'kural-314', collection: 'kural', n: 314,
      text_original: 'இன்னா செய்தாரை ஒறுத்தல் அவர்நாண\nநன்னயம் செய்து விடல்',
      translit: 'innā seydhārai oruththal avarnāṇa\nnannayam seydhu vidal',
      meaning_kid: 'Someone was horrible to you. The way to pay them back, says the poet, ' +
                   'is to be so good to them that they end up ashamed of themselves.',
      meaning_big: 'The punishment for those who have done you harm is to shame them with ' +
                   'kindness, and then let it go.',
      why: 'Hard. Genuinely hard. But it is the only kind of getting-even that leaves you ' +
           'feeling better afterwards instead of worse.',
      source: 'Thirukkural 314 — Book I (Aram), chapter 32, “Not causing harm”',
      audio: 'shlok/kural-314', gate: 7
    },
    {
      id: 'kural-391', collection: 'kural', n: 391,
      text_original: 'கற்க கசடறக் கற்பவை கற்றபின்\nநிற்க அதற்குத் தக',
      translit: 'katka kasadarak katpavai katrapin\nnitka adharkuth thaga',
      meaning_kid: 'Learn the things worth learning, and learn them properly, with no ' +
                   'mistakes left in. Then live the way what you learned says to live.',
      meaning_big: 'Learn thoroughly what is worth learning; having learnt it, stand by it.',
      why: 'The second line is the hard half. Knowing the right thing and doing the right ' +
           'thing are two completely different jobs, and only one of them is a test.',
      source: 'Thirukkural 391 — Book I (Aram), chapter 40, “Learning”',
      audio: 'shlok/kural-391', gate: 7
    },
    {
      id: 'kural-396', collection: 'kural', n: 396,
      text_original: 'தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக்\nகற்றனைத் தூறும் அறிவு',
      translit: 'thottanaith thūrum maṇarkēṇi māndharkkuk\nkatranaith thūrum arivu',
      meaning_kid: 'Dig a hole in wet sand and water comes up. Dig deeper and more comes. ' +
                   'Learning works exactly like that inside a person.',
      meaning_big: 'As water rises in a sand-well in proportion to the depth dug, so ' +
                   'understanding rises in a person in proportion to what they have learnt.',
      why: 'You have done this on a beach. Now you know it is also a two-thousand-year-old ' +
           'argument for reading one more chapter.',
      source: 'Thirukkural 396 — Book I (Aram), chapter 40, “Learning”',
      audio: 'shlok/kural-396', gate: 7
    },
    {
      id: 'kural-397', collection: 'kural', n: 397,
      text_original: null,
      translit: null,
      needs_original: true,
      meaning_kid: 'If you keep learning, every country becomes your country and everybody ' +
                   'becomes your people. So why, asks the poet, does anyone stop learning ' +
                   'before the very end?',
      meaning_big: 'To one who has learned, every land is home and every town their own — ' +
                   'why then does a person not go on learning right up to their last day?',
      why: 'It is the argument for the language your cousin speaks and you do not, and for ' +
           'the grandparent whose stories are in a language you are still picking up.',
      source: 'Thirukkural 397 — Book I (Aram), chapter 40, “Learning”',
      audio: 'shlok/kural-397', gate: 7,
      note: 'Sense only. I am not confident of the exact Tamil wording of this couplet, so ' +
            'neither the Tamil nor a transliteration is printed — a transliteration of a ' +
            'text I am unsure of would look like scholarship and be a guess. Needs ' +
            'transcription from a printed edition before it can be shown or recorded.'
    },
    {
      id: 'kural-400', collection: 'kural', n: 400,
      text_original: 'கேடில் விழுச்செல்வம் கல்வி ஒருவற்கு\nமாடல்ல மற்றை யவை',
      translit: 'kēdil vizhuchchelvam kalvi oruvarku\nmādalla matrai yavai',
      meaning_kid: 'Learning is the one kind of riches that cannot be lost, stolen or ' +
                   'spoiled. Everything else, says the poet, is not really riches at all.',
      meaning_big: 'Learning is the imperishable wealth; measured against it, the other ' +
                   'things people call wealth are not wealth.',
      why: 'Everything you own can be left on a bus. What you know travels with you and ' +
           'cannot be taken off you at the door.',
      source: 'Thirukkural 400 — Book I (Aram), chapter 40, “Learning”',
      audio: 'shlok/kural-400', gate: 7,
      unsure: true,
      note: 'Line 2 is the doubt: I am unsure whether editions print “மாடல்ல மற்றை யவை” ' +
            'with that word division or as “மாடல்ல மற்றையவை”. Line 1 I am confident of. ' +
            'Sense is not in question.'
    },
    {
      id: 'kural-423', collection: 'kural', n: 423,
      text_original: 'எப்பொருள் யார்யார்வாய்க் கேட்பினும் அப்பொருள்\nமெய்ப்பொருள் காண்ப தறிவு',
      translit: 'epporuḷ yāryārvāyk kētpinum apporuḷ\nmeypporuḷ kāṇba dharivu',
      meaning_kid: 'Whoever tells you something, and whatever they tell you, being clever ' +
                   'means working out what is actually true in it.',
      meaning_big: 'Wisdom is to discern the truth in a thing, no matter what is said or ' +
                   'who says it.',
      why: 'Somebody on a screen said something with total confidence and no proof. This ' +
           'couplet is two thousand years old and it is about that.',
      source: 'Thirukkural 423 — Book I (Aram), chapter 43, “Having wisdom”',
      audio: 'shlok/kural-423', gate: 7
    },
    {
      id: 'kural-616', collection: 'kural', n: 616,
      text_original: 'முயற்சி திருவினை ஆக்கும் முயற்றின்மை\nஇன்மை புகுத்தி விடும்',
      translit: 'muyarchi thiruvinai ākkum muyatrinmai\ninmai puguththi vidum',
      meaning_kid: 'Trying hard makes good things happen. Not trying brings the exact ' +
                   'opposite, and brings it just as reliably.',
      meaning_big: 'Effort produces prosperity; the absence of effort ushers in want.',
      why: 'It is painted on the wall of a lot of Tamil classrooms, and it is short enough ' +
           'to say to yourself in the ten seconds before a test starts.',
      source: 'Thirukkural 616 — Book II (Porul), chapter 62, “Unfailing effort”',
      audio: 'shlok/kural-616', gate: 7
    },
    {
      id: 'kural-788', collection: 'kural', n: 788,
      text_original: 'உடுக்கை இழந்தவன் கைபோல ஆங்கே\nஇடுக்கண் களைவதாம் நட்பு',
      translit: 'udukkai izhandhavan kaipōla āngē\nidukkaṇ kaḷaivadhām naṭpu',
      meaning_kid: 'When your clothes start to slip, your hand grabs them before you have ' +
                   'even thought about it. A friend is the hand. That is the whole couplet.',
      meaning_big: 'Friendship is what removes trouble the instant it appears — the way the ' +
                   'hand flies to a garment that is slipping, without being asked.',
      why: 'You do not decide to help a real friend. You notice afterwards that you already ' +
           'did. And you can tell who your friends are by who moves first.',
      source: 'Thirukkural 788 — Book II (Porul), chapter 79, “Friendship”',
      audio: 'shlok/kural-788', gate: 7
    },

    /* ================================================== DHAMMAPADA (10) ==================================================
       text_original is romanised Pali with diacritics — see the collection's script_note.
       translit is the same verse spelled for a child to say out loud. */

    {
      id: 'dhp-1', collection: 'dhammapada', n: 1,
      text_original: 'Manopubbaṅgamā dhammā, manoseṭṭhā manomayā;\n' +
                     'manasā ce paduṭṭhena, bhāsati vā karoti vā;\n' +
                     'tato naṃ dukkham anveti, cakkaṃ va vahato padaṃ.',
      translit: 'mano-pubbangamā dhammā, mano-seṭṭhā mano-mayā;\n' +
                'manasā che paduṭṭhena, bhāsati vā karoti vā;\n' +
                'tato naṃ dukkham anveti, chakkaṃ va vahato padaṃ.',
      meaning_kid: 'Everything you do is a thought first. Speak or act with a spoiled ' +
                   'thought behind it and the trouble follows you — like the cart wheel ' +
                   'following the ox that is pulling it.',
      meaning_big: 'Mind comes first, mind is chief, everything is made of mind. Speak or ' +
                   'act from a corrupted mind and suffering follows as the wheel follows ' +
                   'the hoof of the ox drawing the cart.',
      why: 'You can feel this one working. The mood you get out of bed in decides an awful ' +
           'lot of what the rest of the day turns out to be.',
      source: 'Dhammapada 1 — chapter 1, Yamakavagga (“the twin verses”)',
      audio: 'shlok/dhp-1', gate: 7
    },
    {
      id: 'dhp-2', collection: 'dhammapada', n: 2,
      text_original: 'Manopubbaṅgamā dhammā, manoseṭṭhā manomayā;\n' +
                     'manasā ce pasannena, bhāsati vā karoti vā;\n' +
                     'tato naṃ sukham anveti, chāyā va anapāyinī.',
      translit: 'mano-pubbangamā dhammā, mano-seṭṭhā mano-mayā;\n' +
                'manasā che pasannena, bhāsati vā karoti vā;\n' +
                'tato naṃ sukham anveti, chāyā va anapāyinī.',
      meaning_kid: 'Same beginning, opposite ending. Speak or act with a clear, settled ' +
                   'thought behind it and the happiness follows you like your own shadow, ' +
                   'which never once leaves.',
      meaning_big: 'Mind comes first, mind is chief, everything is made of mind. Speak or ' +
                   'act from a clear mind and happiness follows like a shadow that does ' +
                   'not depart.',
      why: 'Verses 1 and 2 are twins — that is what the chapter is called. Learn them ' +
           'together and you have the shape of the whole book.',
      source: 'Dhammapada 2 — chapter 1, Yamakavagga (“the twin verses”)',
      audio: 'shlok/dhp-2', gate: 7
    },
    {
      id: 'dhp-5', collection: 'dhammapada', n: 5,
      text_original: 'Na hi verena verāni, sammantīdha kudācanaṃ;\n' +
                     'averena ca sammanti, esa dhammo sanantano.',
      translit: 'na hi verena verāni, sammantīdha kudāchanaṃ;\n' +
                'averena cha sammanti, esa dhammo sanantano.',
      meaning_kid: 'Hating somebody back has never once stopped the hating. Only not ' +
                   'hating stops it. That has always been true and it still is.',
      meaning_big: 'Hatred is never settled by hatred in this world; by non-hatred alone is ' +
                   'it settled. This is an ancient and unchanging law.',
      why: 'The playground version: hitting back does not end it. It just makes it their ' +
           'turn again, and then yours, and it can go on for years.',
      source: 'Dhammapada 5 — chapter 1, Yamakavagga',
      audio: 'shlok/dhp-5', gate: 7
    },
    {
      id: 'dhp-49', collection: 'dhammapada', n: 49,
      text_original: 'Yathāpi bhamaro pupphaṃ, vaṇṇagandhamaheṭhayaṃ;\n' +
                     'paleti rasam ādāya, evaṃ gāme munī care.',
      translit: 'yathāpi bhamaro pupphaṃ, vaṇṇa-gandham-aheṭhayaṃ;\n' +
                'paleti rasam ādāya, evaṃ gāme munī chare.',
      meaning_kid: 'A bee lands on a flower, takes the nectar and flies off without ' +
                   'damaging its colour or its smell. Move through a place like that.',
      meaning_big: 'As a bee gathers nectar and departs without injuring the flower, its ' +
                   'colour or its fragrance, so should the wise move through a village.',
      why: 'Take what you need, leave the place as good as you found it. It is a rule for a ' +
           'park, a library, a friend’s house and a shared box of crayons.',
      source: 'Dhammapada 49 — chapter 4, Pupphavagga (“flowers”)',
      audio: 'shlok/dhp-49', gate: 7
    },
    {
      id: 'dhp-50', collection: 'dhammapada', n: 50,
      text_original: 'Na paresaṃ vilomāni, na paresaṃ katākataṃ;\n' +
                     'attano va avekkheyya, katāni akatāni ca.',
      translit: 'na paresaṃ vilomāni, na paresaṃ katākataṃ;\n' +
                'attano va avekkheyya, katāni akatāni cha.',
      meaning_kid: 'Do not spend your day on what other people got wrong, or on what they ' +
                   'did and did not do. Look at your own list instead.',
      meaning_big: 'Not the faults of others, nor what others have done or left undone — ' +
                   'look rather at what you yourself have done and left undone.',
      why: 'Extremely useful about one second before you say “but he did it too”. It is ' +
           'always true, and it has never once helped.',
      source: 'Dhammapada 50 — chapter 4, Pupphavagga (“flowers”)',
      audio: 'shlok/dhp-50', gate: 7
    },
    {
      id: 'dhp-103', collection: 'dhammapada', n: 103,
      text_original: 'Yo sahassaṃ sahassena, saṅgāme mānuse jine;\n' +
                     'ekañca jeyyamattānaṃ, sa ve saṅgāmajuttamo.',
      translit: 'yo sahassaṃ sahassena, saṅgāme mānuse jine;\n' +
                'ekañcha jeyyam-attānaṃ, sa ve saṅgāma-juttamo.',
      meaning_kid: 'Beat a thousand people a thousand times over and you still are not the ' +
                   'greatest winner. The greatest is the one who can win against themselves.',
      meaning_big: 'Though one should conquer a thousand times a thousand in battle, the ' +
                   'one who conquers only themselves is the greater victor.',
      why: 'The hardest opponent you will ever get is the part of you that wants to quit, ' +
           'or shout, or open the game instead of the homework.',
      source: 'Dhammapada 103 — chapter 8, Sahassavagga (“the thousands”)',
      audio: 'shlok/dhp-103', gate: 7
    },
    {
      id: 'dhp-122', collection: 'dhammapada', n: 122,
      text_original: 'Māvamaññetha puññassa, na maṃ taṃ āgamissati;\n' +
                     'udabindunipātena, udakumbho pi pūrati;\n' +
                     'dhīro pūrati puññassa, thokaṃ thokam pi ācinaṃ.',
      translit: 'māvamaññetha puññassa, na maṃ taṃ āgamissati;\n' +
                'uda-bindu-nipātena, uda-kumbho pi pūrati;\n' +
                'dhīro pūrati puññassa, thokaṃ thokam pi āchinaṃ.',
      meaning_kid: 'Never think a small good thing is too small to count. A water pot fills ' +
                   'up one drop at a time — and so does a person.',
      meaning_big: 'Do not make light of good, thinking “it will not come to me”. By the ' +
                   'falling of drops the water jar is filled; the steady person fills ' +
                   'themselves with good, gathering it little by little.',
      why: 'You do not turn into a kind person by doing one enormous kind thing on a ' +
           'Saturday. It is drops. It is carrying somebody’s bag.',
      source: 'Dhammapada 122 — chapter 9, Papavagga',
      audio: 'shlok/dhp-122', gate: 7,
      unsure: true,
      note: 'Verses 121 and 122 are near-identical twins: 121 is the same water-pot image ' +
            'applied to evil (pāpassa) and the fool (bālo), 122 to good (puññassa) and the ' +
            'steady one (dhīro). It is easy to swap them. A reader must confirm against a ' +
            'printed edition that puññassa/dhīro belong to 122 and not to 121. The imagery ' +
            'and the sense are not in doubt; the pairing of words to verse number is.'
    },
    {
      id: 'dhp-129', collection: 'dhammapada', n: 129,
      text_original: 'Sabbe tasanti daṇḍassa, sabbe bhāyanti maccuno;\n' +
                     'attānaṃ upamaṃ katvā, na haneyya na ghātaye.',
      translit: 'sabbe tasanti daṇḍassa, sabbe bhāyanti machchuno;\n' +
                'attānaṃ upamaṃ katvā, na haneyya na ghātaye.',
      meaning_kid: 'Everybody is frightened of being hurt. Everybody. So think about ' +
                   'yourself for one second — then do not hurt anyone, and do not get ' +
                   'anybody else to do it for you either.',
      meaning_big: 'All beings tremble at violence; all fear death. Taking yourself as the ' +
                   'measure, do not kill and do not cause to kill.',
      why: 'The second half is the sharp bit. It is not enough to keep your own hands clean ' +
           'while you stand at the back of the crowd cheering somebody else on.',
      source: 'Dhammapada 129 — chapter 10, Dandavagga (“the rod”)',
      audio: 'shlok/dhp-129', gate: 7
    },
    {
      id: 'dhp-183', collection: 'dhammapada', n: 183,
      text_original: 'Sabbapāpassa akaraṇaṃ, kusalassa upasampadā;\n' +
                     'sacittapariyodapanaṃ, etaṃ buddhāna sāsanaṃ.',
      translit: 'sabba-pāpassa akaraṇaṃ, kusalassa upasampadā;\n' +
                'sa-chitta-pariyodapanaṃ, etaṃ buddhāna sāsanaṃ.',
      meaning_kid: 'Three things. Do nothing harmful. Do the good you can. Keep your own ' +
                   'mind clear. That is the entire teaching in one verse.',
      meaning_big: 'To do no evil, to cultivate what is good, to purify one’s own mind — ' +
                   'this is the teaching of the Buddhas.',
      why: 'If you only ever learn one verse from this book, families who keep it will ' +
           'usually tell you it is this one.',
      source: 'Dhammapada 183 — chapter 14, Buddhavagga',
      audio: 'shlok/dhp-183', gate: 7
    },
    {
      id: 'dhp-223', collection: 'dhammapada', n: 223,
      text_original: 'Akkodhena jine kodhaṃ, asādhuṃ sādhunā jine;\n' +
                     'jine kadariyaṃ dānena, saccenālikavādinaṃ.',
      translit: 'akkodhena jine kodhaṃ, asādhuṃ sādhunā jine;\n' +
                'jine kadariyaṃ dānena, sachchenālika-vādinaṃ.',
      meaning_kid: 'Beat anger by not getting angry. Beat meanness by being good. Beat ' +
                   'not-sharing by sharing. Beat a lie by telling the truth.',
      meaning_big: 'Conquer anger with non-anger, the bad with good, the stingy with ' +
                   'giving, and the liar with truth.',
      why: 'Four fights and four ways to win them, and not one of them involves shouting. ' +
           'Try the third one on a sibling and watch what happens.',
      source: 'Dhammapada 223 — chapter 17, Kodhavagga (“anger”)',
      audio: 'shlok/dhp-223', gate: 7
    },

    /* ================================================== SUBHASHITAS (11) ==================================================
       ATTRIBUTION WARNING. A subhashita is a verse that got repeated until everyone knew
       it, which means most of them have no reliable author and several have picked up a
       famous name along the way that they cannot support. Every card below says which case
       it is, in the child's own words where it is interesting. `n` is our catalogue index,
       not a source verse number — see n_local. */

    {
      id: 'subh-vidyadhanam', collection: 'subhashita', n: 1, n_local: true,
      text_original: 'न चोरहार्यं न च राजहार्यं\nन भ्रातृभाज्यं न च भारकारि।\n' +
                     'व्यये कृते वर्धत एव नित्यं\nविद्याधनं सर्वधनप्रधानम्॥',
      translit: 'na corahāryaṃ na ca rājahāryaṃ\nna bhrātṛbhājyaṃ na ca bhārakāri.\n' +
                'vyaye kṛte vardhata eva nityaṃ\nvidyādhanaṃ sarvadhanapradhānam.',
      meaning_kid: 'A thief cannot steal it. A king cannot take it. Your brother cannot ' +
                   'demand half. It weighs nothing to carry. And every time you spend it, ' +
                   'you have more of it. That is what knowing things is like.',
      meaning_big: 'It cannot be carried off by thieves or by kings, cannot be divided ' +
                   'among brothers, and is no burden to carry. Spent, it only ever ' +
                   'increases. The wealth of knowledge is the first of all wealth.',
      why: 'Explain something to a friend who did not get it. Notice that you now ' +
           'understand it better than before you opened your mouth. That is the last line.',
      source: 'Traditional Sanskrit subhashita. Frequently attributed to Bhartrihari’s ' +
              'Nitishataka, but it circulates independently in many anthologies and the ' +
              'attribution is not settled.',
      audio: 'shlok/subh-vidyadhanam', gate: 7
    },
    {
      id: 'subh-vidya-vinaya', collection: 'subhashita', n: 2, n_local: true,
      text_original: 'विद्या ददाति विनयं विनयाद्याति पात्रताम्।\n' +
                     'पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम्॥',
      translit: 'vidyā dadāti vinayaṃ vinayād yāti pātratām.\n' +
                'pātratvād dhanam āpnoti dhanād dharmaṃ tataḥ sukham.',
      meaning_kid: 'Really learning something makes you humble, not show-offy. Being humble ' +
                   'makes people trust you with things. And it goes on from there.',
      meaning_big: 'Learning gives humility; from humility comes worthiness; from ' +
                   'worthiness, the means to live; from that, right living, and from right ' +
                   'living, happiness.',
      why: 'The people who actually know the most are almost never the loudest in the room. ' +
           'You have probably already noticed this about a teacher you like.',
      source: 'Traditional Sanskrit subhashita, widely printed in school readers and often ' +
              'placed in the Hitopadesha. Author and original collection uncertain.',
      audio: 'shlok/subh-vidya-vinaya', gate: 7
    },
    {
      id: 'subh-vasudhaiva', collection: 'subhashita', n: 3, n_local: true,
      text_original: 'अयं निजः परो वेति गणना लघुचेतसाम्।\n' +
                     'उदारचरितानां तु वसुधैव कुटुम्बकम्॥',
      translit: 'ayaṃ nijaḥ paro veti gaṇanā laghucetasām.\n' +
                'udāracaritānāṃ tu vasudhaiva kuṭumbakam.',
      meaning_kid: '“This one is mine, that one is a stranger” — that is small-minded ' +
                   'counting. For people who are big about it, the whole earth is one family.',
      meaning_big: 'The reckoning of “mine” and “not mine” belongs to small minds. To those ' +
                   'of generous character, the earth itself is the family.',
      why: 'The new kid who does not know anybody yet is at every school in every country. ' +
           'This verse is 1,500 years old and it is about lunchtime.',
      source: 'Hitopadesha, and also found in the Maha Upanishad. Verse numbering differs ' +
              'between editions, so no number is claimed here.',
      audio: 'shlok/subh-vasudhaiva', gate: 7,
      unsure: true,
      note: 'The Sanskrit text I am confident of — “vasudhaiva kutumbakam” is one of the ' +
            'most-printed lines in the language. What is genuinely unsettled is WHICH ' +
            'source to cite first: it appears both in the Hitopadesha and at Maha Upanishad ' +
            '6.71-73, with different numbering across editions. A reviewer should pick one ' +
            'printed edition and cite it exactly rather than citing both vaguely.'
    },
    {
      id: 'subh-udyamena', collection: 'subhashita', n: 4, n_local: true,
      text_original: 'उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।\n' +
                     'न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः॥',
      translit: 'udyamena hi sidhyanti kāryāṇi na manorathaiḥ.\n' +
                'na hi suptasya siṃhasya praviśanti mukhe mṛgāḥ.',
      meaning_kid: 'Things get done by doing them, not by wishing. Deer do not walk into a ' +
                   'sleeping lion’s mouth — even a lion has to get up.',
      meaning_big: 'Tasks are accomplished by effort, not by daydreams: animals do not walk ' +
                   'into the mouth of a sleeping lion.',
      why: 'Being the strongest, the cleverest or the fastest changes nothing at all on a ' +
           'day when you do not start. The lion is not the point. The getting up is.',
      source: 'Hitopadesha, in the opening “Mitralabha” book. Verse numbering varies ' +
              'between editions, so none is claimed here.',
      audio: 'shlok/subh-udyamena', gate: 7
    },
    {
      id: 'subh-kaka-pika', collection: 'subhashita', n: 5, n_local: true,
      text_original: 'काकः कृष्णः पिकः कृष्णः को भेदः पिककाकयोः।\n' +
                     'वसन्तसमये प्राप्ते काकः काकः पिकः पिकः॥',
      translit: 'kākaḥ kṛṣṇaḥ pikaḥ kṛṣṇaḥ ko bhedaḥ pikakākayoḥ.\n' +
                'vasantasamaye prāpte kākaḥ kākaḥ pikaḥ pikaḥ.',
      meaning_kid: 'The crow is black. The cuckoo is black. So what is the difference? Wait ' +
                   'for spring. Then the crow is a crow and the cuckoo is a cuckoo — because ' +
                   'one of them can sing.',
      meaning_big: 'Crow and cuckoo look identical until the season comes that asks them ' +
                   'both to sing. What you actually are shows up when it is time to show up.',
      why: 'Nobody can tell who practised and who did not, right up until the moment ' +
           'everyone has to play. Then it takes about four seconds.',
      source: 'Traditional Sanskrit subhashita. Author unknown; it appears in many ' +
              'anthologies with no agreed original collection.',
      audio: 'shlok/subh-kaka-pika', gate: 7
    },
    {
      id: 'subh-mani-sarpa', collection: 'subhashita', n: 6, n_local: true,
      text_original: 'दुर्जनः परिहर्तव्यो विद्ययालङ्कृतोऽपि सन्।\n' +
                     'मणिना भूषितः सर्पः किमसौ न भयङ्करः॥',
      translit: 'durjanaḥ parihartavyo vidyayālaṅkṛto ’pi san.\n' +
                'maṇinā bhūṣitaḥ sarpaḥ kim asau na bhayaṅkaraḥ.',
      meaning_kid: 'Stay away from someone unkind even if they are very clever. A snake ' +
                   'wearing a jewel on its head is still a snake.',
      meaning_big: 'A person of bad character should be avoided even when they are adorned ' +
                   'with learning: is a serpent decorated with a gem any less dangerous?',
      why: 'Clever is not the same as safe, and funny is not the same as kind. The kid ' +
           'everyone laughs with can still be the one everyone is a bit scared of.',
      source: 'Bhartrihari, Nitishataka — the verse is standard in that collection, though ' +
              'the Nitishataka’s own verse order differs between editions, so no number is ' +
              'claimed here.',
      audio: 'shlok/subh-mani-sarpa', gate: 7
    },
    {
      id: 'subh-kshanashah', collection: 'subhashita', n: 7, n_local: true,
      text_original: 'क्षणशः कणशश्चैव विद्यामर्थं च साधयेत्।\n' +
                     'क्षणे नष्टे कुतो विद्या कणे नष्टे कुतो धनम्॥',
      translit: 'kṣaṇaśaḥ kaṇaśaścaiva vidyām arthaṃ ca sādhayet.\n' +
                'kṣaṇe naṣṭe kuto vidyā kaṇe naṣṭe kuto dhanam.',
      meaning_kid: 'Collect learning a moment at a time and food a grain at a time. Throw ' +
                   'away the moments and there is no learning; throw away the grains and ' +
                   'there is nothing in the jar.',
      meaning_big: 'Gather knowledge moment by moment and substance grain by grain: waste ' +
                   'the moment and where is your learning, waste the grain and where is ' +
                   'your store?',
      why: 'Ten minutes is a real amount of time. So is the ten minutes you spent looking ' +
           'for something to do instead.',
      source: 'Traditional Sanskrit subhashita, commonly printed under the Chanakya Niti ' +
              'heading. Attribution to Chanakya is conventional, not established.',
      audio: 'shlok/subh-kshanashah', gate: 7,
      unsure: true,
      note: 'Line 1 I am confident of. Line 2 circulates in at least two forms — ' +
            '“kṣaṇe naṣṭe … kaṇe naṣṭe” as printed here, and “kṣaṇatyāge … kaṇatyāge”. ' +
            'The sense is identical either way; the wording is not. A reviewer must pick a ' +
            'printed edition and match it before any recording is made.'
    },
    {
      id: 'subh-paropakara-vrksha', collection: 'subhashita', n: 8, n_local: true,
      text_original: 'पिबन्ति नद्यः स्वयमेव नाम्भः\nस्वयं न खादन्ति फलानि वृक्षाः।\n' +
                     'नादन्ति सस्यं खलु वारिवाहाः\nपरोपकाराय सतां विभूतयः॥',
      translit: 'pibanti nadyaḥ svayam eva nāmbhaḥ\nsvayaṃ na khādanti phalāni vṛkṣāḥ.\n' +
                'nādanti sasyaṃ khalu vārivāhāḥ\nparopakārāya satāṃ vibhūtayaḥ.',
      meaning_kid: 'Rivers do not drink their own water. Trees do not eat their own fruit. ' +
                   'Clouds do not eat the crops they water. Whatever good people have, they ' +
                   'have it for somebody else.',
      meaning_big: 'Rivers do not drink their own water, trees do not eat their own fruit, ' +
                   'and the rain-clouds do not consume the grain they raise: what the good ' +
                   'possess, they possess for the sake of others.',
      why: 'Next time you eat a mango, notice the tree did not get any. It is a nice thing ' +
           'to think about a grandparent with.',
      source: 'Traditional Sanskrit subhashita, very widely anthologised. Author unknown.',
      audio: 'shlok/subh-paropakara-vrksha', gate: 7,
      unsure: true,
      note: 'Doubt is one word in line 3: I have written “vārivāhāḥ” (water-carriers, ' +
            'i.e. clouds) but the variant “vāridāḥ” also circulates, and the metre differs ' +
            'between them. Lines 1, 2 and 4 I am confident of.'
    },
    {
      id: 'subh-udyoginam', collection: 'subhashita', n: 9, n_local: true,
      text_original: 'उद्योगिनं पुरुषसिंहमुपैति लक्ष्मीः\n' +
                     'दैवेन देयमिति कापुरुषा वदन्ति।\n' +
                     'दैवं निहत्य कुरु पौरुषमात्मशक्त्या\n' +
                     'यत्ने कृते यदि न सिध्यति कोऽत्र दोषः॥',
      translit: 'udyoginaṃ puruṣasiṃham upaiti lakṣmīḥ\n' +
                'daivena deyam iti kāpuruṣā vadanti.\n' +
                'daivaṃ nihatya kuru pauruṣam ātmaśaktyā\n' +
                'yatne kṛte yadi na sidhyati ko ’tra doṣaḥ.',
      meaning_kid: 'Good things come to the person who gets on with it. Push luck aside and ' +
                   'use your own strength. And if you really tried and it still did not ' +
                   'work — then nothing has gone wrong.',
      meaning_big: 'Fortune goes to the striving one, the lion among people; only the ' +
                   'faint-hearted say “it is for fate to give”. Set fate aside and act with ' +
                   'your own strength — and if, after real effort, it still does not ' +
                   'succeed, what fault is there in that?',
      why: 'That last line is the kind one, and most people never quote it. Trying and not ' +
           'winning is not a failure. It is just Tuesday.',
      source: 'Hitopadesha, in the opening “Prastavika” section. Verse numbering differs ' +
              'between editions, so none is claimed here.',
      audio: 'shlok/subh-udyoginam', gate: 8,
      note: 'Editorial: the Sanskrit is gendered — “puruṣasiṃham” is literally “lion among ' +
            'men” and “kāpuruṣāḥ” “unmanly ones”. meaning_kid renders it inclusively; ' +
            'meaning_big keeps the literal image visible so nothing is hidden.'
    },
    {
      id: 'subh-paropakarah', collection: 'subhashita', n: 10, n_local: true,
      text_original: 'अष्टादशपुराणेषु व्यासस्य वचनद्वयम्।\n' +
                     'परोपकारः पुण्याय पापाय परपीडनम्॥',
      translit: 'aṣṭādaśapurāṇeṣu vyāsasya vacanadvayam.\n' +
                'paropakāraḥ puṇyāya pāpāya parapīḍanam.',
      meaning_kid: 'The verse says: in eighteen enormous books, the sage Vyasa said really ' +
                   'only two things. Helping other people is good. Hurting other people is ' +
                   'not. That is it.',
      meaning_big: '“In the eighteen Puranas, two sentences of Vyasa: helping others is ' +
                   'merit, harming others is wrong.” A whole library, compressed into one line.',
      why: 'Somebody once read an entire shelf and came back with a sentence a six-year-old ' +
           'can use. That is what a good summary looks like.',
      source: 'Traditional Sanskrit subhashita. It CLAIMS Vyasa and the eighteen Puranas, ' +
              'but it is a later summarising verse about them, not a quotation found in ' +
              'them. Author unknown.',
      audio: 'shlok/subh-paropakarah', gate: 7,
      note: 'Editorial, and it matters: the card must never be worded so that a child ' +
            'thinks this sentence is written inside the Puranas. It is a verse ABOUT them. ' +
            'meaning_kid above says “the verse says” for exactly this reason.'
    },
    {
      id: 'subh-pustakastha', collection: 'subhashita', n: 11, n_local: true,
      text_original: 'पुस्तकस्था तु या विद्या परहस्तगतं धनम्।\n' +
                     'कार्यकाले समुत्पन्ने न सा विद्या न तद्धनम्॥',
      translit: 'pustakasthā tu yā vidyā parahastagataṃ dhanam.\n' +
                'kāryakāle samutpanne na sā vidyā na tad dhanam.',
      meaning_kid: 'Learning that stays inside the book, and money that is in somebody ' +
                   'else’s pocket: when you actually need them, you have neither.',
      meaning_big: 'Knowledge left in a book and wealth left in another’s hand are, at the ' +
                   'moment of need, no knowledge and no wealth at all.',
      why: 'Owning the book is not the same as having read it, and having read it is not ' +
           'the same as being able to do it. Ask anyone the night before a test.',
      source: 'Traditional Sanskrit subhashita, usually printed under the Chanakya Niti ' +
              'heading. Attribution to Chanakya is conventional, not established.',
      audio: 'shlok/subh-pustakastha', gate: 7
    },

    /* ================================================== BHAGAVAD GITA (5) ==================================================
       All gated to 10+ (docs/02). Framed as "a talk about doing the right thing when it is
       hard" — not as doctrine, not ranked against anything else in this file. The five
       here were chosen for being the least doctrinally loaded famous verses in the text;
       the ones about avatars, about svadharma, and the whole of chapter 11 are deliberately
       absent and are a human author's job. */

    {
      id: 'gita-2-47', collection: 'gita', n: 47,
      text_original: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\n' +
                     'मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
      translit: 'karmaṇy evādhikāras te mā phaleṣu kadācana.\n' +
                'mā karmaphalahetur bhūr mā te saṅgo ’stv akarmaṇi.',
      meaning_kid: 'The work in front of you is yours to do. How it turns out afterwards is ' +
                   'not the part you control. So do not let the prize be your only reason — ' +
                   'and do not use that as an excuse to stop, either.',
      meaning_big: 'You have a claim on the action, never on its fruits. Do not act for the ' +
                   'sake of the result, and do not let go of the action either.',
      why: 'You practised for six weeks and came fourth. This verse is about what to do ' +
           'with the next morning, and it is the most quoted line in the book.',
      source: 'Bhagavad Gita 2.47 — chapter 2, “Sankhya Yoga”, verse 47; within the Bhishma ' +
              'Parva of the Mahabharata',
      audio: 'shlok/gita-2-47', gate: 10
    },
    {
      id: 'gita-2-63', collection: 'gita', n: 63,
      text_original: 'क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः।\n' +
                     'स्मृतिभ्रंशाद्बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥',
      translit: 'krodhād bhavati sammohaḥ sammohāt smṛtivibhramaḥ.\n' +
                'smṛtibhraṃśād buddhināśo buddhināśāt praṇaśyati.',
      meaning_kid: 'Anger makes you confused. Confusion makes you forget things. Forgetting ' +
                   'wrecks your good sense — and then you are the one who is wrecked.',
      meaning_big: 'From anger comes confusion; from confusion, loss of memory; from loss ' +
                   'of memory, the ruin of judgement; and when judgement is ruined, one is ' +
                   'lost. It is a chain, and each link pulls the next.',
      why: 'It explains, step by step, why you said the thing you would never normally say, ' +
           'about nine seconds after you got furious.',
      source: 'Bhagavad Gita 2.63 — chapter 2, “Sankhya Yoga”, verse 63',
      audio: 'shlok/gita-2-63', gate: 10,
      note: 'Editorial: this is the back half of a chain that starts at 2.62 (dwelling on a ' +
            'thing, then wanting it, then anger when it is blocked). The card should say so ' +
            'rather than presenting 2.63 as if it began on its own.'
    },
    {
      id: 'gita-6-5', collection: 'gita', n: 5,
      text_original: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\n' +
                     'आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
      translit: 'uddhared ātmanātmānaṃ nātmānam avasādayet.\n' +
                'ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ.',
      meaning_kid: 'Pull yourself up. Do not push yourself down. You can be your own best ' +
                   'friend and you can be your own worst enemy, and it is the same person ' +
                   'doing both.',
      meaning_big: 'Lift yourself by your own self; do not let yourself sink. For the self ' +
                   'alone is the friend of the self, and the self alone is its enemy.',
      why: 'The voice in your head the moment you get something wrong. This verse is about ' +
           'whose voice that is, and about the fact that you get a say in it.',
      source: 'Bhagavad Gita 6.5 — chapter 6, “Dhyana Yoga”, verse 5',
      audio: 'shlok/gita-6-5', gate: 10
    },
    {
      id: 'gita-6-17', collection: 'gita', n: 17,
      text_original: 'युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु।\n' +
                     'युक्तस्वप्नावबोधस्य योगो भवति दुःखहा॥',
      translit: 'yuktāhāravihārasya yuktaceṣṭasya karmasu.\n' +
                'yuktasvapnāvabodhasya yogo bhavati duḥkhahā.',
      meaning_kid: 'Eat a sensible amount, play a sensible amount, work a sensible amount, ' +
                   'sleep and wake at sensible times. Do that, and the practice stops being ' +
                   'a struggle and starts taking your unhappiness away.',
      meaning_big: 'For one measured in food and recreation, measured in effort at work, ' +
                   'measured in sleeping and waking, the practice becomes the destroyer of ' +
                   'sorrow.',
      why: 'The Gita’s advice for a rotten week is not heroic at all. It is: eat properly ' +
           'and go to bed. Two chapters earlier it was talking about a battlefield.',
      source: 'Bhagavad Gita 6.17 — chapter 6, “Dhyana Yoga”, verse 17',
      audio: 'shlok/gita-6-17', gate: 10
    },
    {
      id: 'gita-12-13', collection: 'gita', n: 13,
      text_original: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।\n' +
                     'निर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥',
      translit: 'adveṣṭā sarvabhūtānāṃ maitraḥ karuṇa eva ca.\n' +
                'nirmamo nirahaṅkāraḥ samaduḥkhasukhaḥ kṣamī.',
      meaning_kid: 'Hating no living thing. Friendly to everyone. Sorry for anyone who is ' +
                   'hurting. Not grabby, not showing off, steady when things go well and ' +
                   'when they do not, and quick to forgive.',
      meaning_big: 'One who hates no creature, who is friendly and compassionate, free of ' +
                   '“mine” and of self-importance, even in pain and in pleasure, and ' +
                   'forgiving.',
      why: 'It is a list of what a good person actually looks like on a normal Tuesday. No ' +
           'speeches in it anywhere — just how you are with people.',
      source: 'Bhagavad Gita 12.13 — chapter 12, “Bhakti Yoga”, verse 13',
      audio: 'shlok/gita-12-13', gate: 10,
      note: 'Editorial: 12.13 and 12.14 are one sentence in the original — the list of ' +
            'qualities runs on and the sentence completes in 12.14 with “that one is dear ' +
            'to me”. We quote 12.13 alone because the list stands by itself, but the card ' +
            'must say the sentence continues, and must not imply the verse ends here.'
    }
  ],

  /* ---------------------------------------------------------------- REVIEW GATE
     Nothing in this file is cleared to ship. Per docs/10 §3 and docs/05 §4:
       - Thirukkural   — needs a Tamil reader against a named printed edition (e.g. the
                         Parimelalagar-based standard text). Every word division must be
                         checked, not just the spelling; four verses are flagged.
       - Dhammapada    — needs a Pali reader against the Chattha Sangayana or PTS edition,
                         plus a decision on whether to add a Devanagari rendering.
       - Subhashitas   — needs someone to REPLACE the honest "author unknown" strings with a
                         real citation wherever one exists, and to leave them alone where
                         one does not. Do not let anyone quietly upgrade "traditional" into
                         a famous name.
       - Gita          — needs a practitioner-scholar reviewer per docs/05 §4, and a check
                         that the framing on every card is "a talk about doing the right
                         thing when it is hard" and never doctrine.
     Then, and only then, human-voice recordings — never TTS (docs/09). */
  review: {
    status: 'draft',
    reviewed_by: [],
    reviewed_on: null,
    blocking: ['tamil-reader', 'pali-reader', 'sanskrit-reader', 'practitioner-scholar-hindu',
               'human-voice-recording']
  }
};
