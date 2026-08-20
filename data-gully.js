/* Bizzing India — Gully: the street games, written so a child can go and play them.

   WHY THIS EXISTS (docs/11 §4.6). The inventory in docs/11 lists "street games — kho-kho,
   gilli-danda, lagori, played with whoever was outside" against "there is no 'outside',
   there is scheduled soccer". It is marked **Partly** solvable, and the note is the whole
   brief: *"it turns screen time into outside time, which is the thing parents most want an
   app to do and almost none do."*

   So this is the one pillar whose success condition is that the app gets closed. Everything
   below is written to be read once, on a phone, standing up, and then put in a pocket.

   ── DECISIONS ────────────────────────────────────────────────────────────────

   1. RULES ARE ORDERED FOR SPEAKING, NOT FOR ACCURACY. Every `rules[]` array is in the
      order you would actually say it to an eight-year-old standing on grass, which is not
      the order a rulebook uses. Rulebooks establish the field first; children need to know
      who is chasing them first. Boundaries and safety come in at the point in the
      explanation where a child will actually listen — which is after they know the game
      sounds fun, not before.

   2. ONE GAME, MANY NAMES — AND NEVER THE HINDI ONE AS *THE* NAME. CLAUDE.md rule 8: never
      imply Hindi = Indian. So `alsoCalled[]` is not decoration, it is the point, and every
      entry is tagged with the language it belongs to. A Tamil child looking for pallanguzhi
      and a Kannada child looking for aliguli mane must both find the same card.

      The corollary: the brief listed *lagori*, *pithoo*, *pittu*, *satoliya* and *seven
      stones* as separate games. **They are one game with five names.** Splitting them would
      have done exactly the thing this file exists to prevent — treating a regional name as
      a different thing. They are one entry, `lagori`, carrying all of the names. Same call
      for chowka bara / ashta chamma / thaayam, and for stapoo / kith-kith / chindro /
      ekka-dokka / paandi / kunte bille.

      Where a regional name is one I could not stand behind, it is simply absent. A missing
      name is a gap someone fills at review; an invented one is a lie a child repeats. The
      languages are thin in places — Odia, Assamese, Kashmiri, Konkani and the north-east
      are almost entirely missing, and that is a real gap flagged for a native check, not a
      claim that these games are not played there.

   3. NEEDS[] PREFERS NOTHING. A chalk line and a tennis ball beat special equipment, and a
      game needing nothing at all beats both, because it survives contact with a Tuesday.
      Eleven of these games need literally nothing. Where kit is unavoidable the entry
      names the household substitute first — an egg carton for a pallanguzhi board, bottle
      caps for cowries, a rolled sock for the bone.

   4. SAFETY IS HONEST AND SHORT. Gilli-danda genuinely puts sticks in the air near faces.
      Lagori is a game about throwing a ball at people. Kabaddi is contact. Kite string can
      be lethal if it is the coated kind. Saying so plainly, once, in the child's own
      register, is respect. Saying it four times in a soft voice is nannying, and a child who
      is being nannied stops reading — which makes the page less safe, not more.

      So: `safe[]` names the actual mechanism of the actual injury, then stops. No entry
      opens with "always ask an adult". Two entries say there is nothing to worry about,
      because there is nothing to worry about, and saying so buys credibility for the entries
      where there is.

   5. HISTORY: WE DO NOT HAVE IT, SO WE DO NOT CLAIM IT. CLAUDE.md forbids inventing a date,
      an inscription or a finding, "not even a plausible one" — and games are where that rule
      is hardest to keep, because every listicle on the internet will tell you a game is four
      thousand years old and none of them cite anything.

      Rule applied here: an `origin` line either carries a real `source`, or it says only
      that this is an old game played across much of India and sets `origin_pending: true`.
      Seven entries are pending. Exactly one carries a source — moksha patam, where there is
      a genuine peer-reviewed art-historical study of surviving boards, and even there the
      `origin` line refuses to give a date, because the source is about the boards, not about
      an origin. Someone with library access should clear the other seven; until then the
      honest sentence ships.

   6. BADGE (CLAUDE.md rule 1): the whole collection is **🧭 Aaj** — how this lives today.
      That is deliberate and it is what makes rule 5 above easy to hold: nothing in this file
      is presented as history, so nothing in it needs to be sourced as history. These are
      games being played this afternoon.

   7. VARIANTS ARE MANDATORY, PHRASED "IN MANY PLACES…". CLAUDE.md rule 5 — internal
      diversity is the point. There is no correct version of stapoo. A child whose mother
      played it differently must not be told their mother is wrong, so every entry hands the
      argument back: *agree it before you start*, and *ask your family which one they played*.
      That sentence is doing pedagogy, not politeness.

   8. WORDS[] IS THE LANGUAGE ENGINE, SMUGGLED. Three to five words a player *shouts* — kho,
      dhappa, vish, amrit, woh kaata. Nobody learns vocabulary in a park; everybody learns
      the word they had to yell. This is the cheapest exposure in the entire product and it
      costs no screen time at all, which is the point of the pillar.

   9. `chant` appears on the two games that are actually a rhyme (poshampa, kokla chhapaki).
      Both are folk rhymes with many versions; both are labelled as one version among many,
      and both point the child at their own family's words instead.

   10. NO GAMIFICATION OF GOING OUTSIDE. See `takeout`. No points, no streak, no timer, no
       photo, no proof, no check-in. The moment you score a child for playing outside you
       have moved the reward back inside the app, which is the exact failure this pillar
       exists to avoid. The app hands over a game and shuts up. */

window.IND_GULLY = {
  badge: 'aaj',

  intro: 'These are the games that happened in the street, with whoever was outside, with no ' +
         'kit and no adult organising anything. Many of them need nothing at all. Read one, ' +
         'go out, and put the screen down — that is the whole idea.',

  /* ─────────────────────────────────────────────────────────────────────────
     GAMES — 28 entries.
     players: '2' | '3+' | '6+' | 'any'    where: 'outside' | 'inside' | 'either'
     ───────────────────────────────────────────────────────────────────────── */
  games: [

    /* ── the big running games ───────────────────────────────────────────── */
    {
      id: 'kho-kho',
      name: 'Kho-Kho',
      script: 'खो-खो',
      roman: 'kho-kho',
      alsoCalled: [
        'Kho-Kho — Hindi, Marathi, Gujarati, Bengali and most other languages keep the same name',
        'கோ-கோ Kho-Kho — Tamil',
        'ಖೋ-ಖೋ Kho-Kho — Kannada'
      ],
      region: ['Maharashtra', 'Karnataka', 'Gujarat', 'Madhya Pradesh', 'Andhra Pradesh', 'played in schools across India'],
      players: '6+',
      age: '8+',
      where: 'outside',
      needs: ['nothing', 'somewhere flat and soft — grass is best', 'two shoes or bags to mark the ends, if you want them'],
      setup: 'Split into two teams. One team chases, the other runs, and then you swap. The ' +
             'chasing team sits in a line down the middle of the space, one behind the other, ' +
             'with each person facing the opposite way to the one in front — left, right, ' +
             'left, right. Everything about this game comes from that alternating line.',
      rules: [
        'The chasing team sits in a line, each person facing the opposite way to the person in front of them.',
        'One player from the chasing team is free. Only that one person may run.',
        'Three runners from the other team come onto the field at a time.',
        'The free chaser may only run forwards, in the direction they are facing, and may never cross the line of sitters.',
        'That sounds impossible, and it is — which is why you swap. Touch a sitter on the back and shout KHO.',
        'That sitter jumps up instantly and becomes the chaser, running the way they were facing. You sit down in their place, facing the way they faced.',
        'A runner is out the moment a chaser touches them.',
        'When all three runners are out, the next three come on.'
      ],
      win: 'Teams swap after an agreed time — seven or nine minutes in a proper match. The ' +
           'team that got the other side out faster wins. In a park, forget the clock and just ' +
           'count: whose three runners lasted longer?',
      safe: [
        'Sitters keep their legs folded in tight. A stretched-out leg is the thing everyone trips over.',
        'Chasers touch. They do not grab, push or pull a shirt — a touch is already enough to get someone out.',
        'Grass or sand, not concrete. The whole game is sudden turns at full speed.'
      ],
      variants: [
        'In many places only four or six sit in the line instead of eight, so a small group can still play a proper game.',
        'In many school versions there is no clock at all — you simply run until everybody has been both a sitter and a runner.'
      ],
      words: [
        { term: 'खो', roman: 'kho', en: 'go! — the word you shout as you touch a sitter’s back' },
        { term: 'बैठ', roman: 'baith', en: 'sit' },
        { term: 'उठ', roman: 'uth', en: 'get up' },
        { term: 'पकड़ा', roman: 'pakda', en: 'caught!' }
      ],
      kid: 'One shouted word and someone else is suddenly doing the running — it is the best ' +
           'feeling in any chasing game ever invented.',
      origin: 'This is an old game, played across much of India, and now a national sport with ' +
              'a proper league. Where and when it started is not something we will state without a source.',
      origin_pending: true
    },

    {
      id: 'kabaddi',
      name: 'Kabaddi',
      script: 'कबड्डी',
      roman: 'kabaddi',
      alsoCalled: [
        'हुतूतू Hu-Tu-Tu — Marathi',
        'হা-ডু-ডু Ha-Du-Du — Bengali',
        'சடுகுடு Sadugudu — Tamil',
        'చెడుగుడు Chedugudu — Telugu',
        'ಕಬಡ್ಡಿ Kabaddi — Kannada',
        'ਕਬੱਡੀ Kabaddi — Punjabi, where a very different circle version is played'
      ],
      region: ['Punjab', 'Haryana', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Bengal', 'Karnataka'],
      players: '6+',
      age: '9+',
      where: 'outside',
      needs: ['nothing', 'grass, sand or mats — this one really does need a soft surface', 'chalk or four shoes to mark a centre line'],
      setup: 'Mark a rough rectangle and a line straight down the middle of it. Two teams, one ' +
             'on each half. Everyone stays on their own side except the one player whose turn it ' +
             'is to raid. Teams take turns raiding, one raider at a time.',
      rules: [
        'One player — the raider — crosses the centre line into the other team’s half.',
        'From the moment they cross, they must keep saying "kabaddi, kabaddi, kabaddi" out loud, without stopping and without taking another breath.',
        'The raider tries to touch one or more defenders and then get back over the centre line.',
        'Every defender they touched, and got home with, is out.',
        'The defenders try to hold the raider on their side until the chant stops. If it stops, or the raider cannot get back, the raider is out.',
        'Whoever is out sits at the side.',
        'The other team raids next, and you keep alternating.'
      ],
      win: 'One point for every player put out. When a whole team is out — "all out" — the other ' +
           'side gets extra points and everybody comes back on. Highest score when you stop wins.',
      safe: [
        'This is a contact game and the contact is real. Defenders hold and block; they do not tackle to the ground, punch, or pull hair.',
        'Nobody is grabbed by the neck, the head or the collar. Waist, wrist and ankle only.',
        'Grass, sand or mats. Never concrete, never a driveway.',
        'Watches and glasses off before you start.'
      ],
      variants: [
        'In many places in Punjab a circle version is played on a round field, with one-against-one contests, and it looks so different from the rectangular game on television that people argue about which is the real one. Both are.',
        'In many school games the breath rule is dropped and the raider simply gets ten seconds, which is far easier to referee and much less likely to end with someone dizzy.'
      ],
      words: [
        { term: 'कबड्डी', roman: 'kabaddi', en: 'the word the raider chants without breathing' },
        { term: 'पकड़ो', roman: 'pakdo', en: 'grab him!' },
        { term: 'आजा', roman: 'aaja', en: 'come on then' },
        { term: 'बच के', roman: 'bach ke', en: 'watch out' }
      ],
      kid: 'You have to be brave on one breath, in front of everyone, and then run for your life.',
      origin: 'This is an old game, played across much of India, and today a professional sport ' +
              'with leagues and national teams. We are not going to put a date on its beginnings ' +
              'without a source that can be checked.',
      origin_pending: true
    },

    {
      id: 'atya-patya',
      name: 'Atya Patya',
      script: 'आट्यापाट्या',
      roman: 'atya patya',
      alsoCalled: [
        'आट्यापाट्या Atya-Patya — Marathi, where it is best known',
        'Athya Pathya',
        'Atya Patya — Gujarati and Kannada keep the name'
      ],
      region: ['Maharashtra', 'Karnataka', 'Gujarat', 'Madhya Pradesh'],
      players: '6+',
      age: '9+',
      where: 'outside',
      needs: ['chalk, or a line of shoes and bags to mark out lines'],
      setup: 'Mark a long rectangle with several straight lines across it, like the rungs of a ' +
             'ladder, plus one long line down the middle joining them all. Nine rungs is the ' +
             'usual number; five is plenty in a park. One team defends the lines, the other tries ' +
             'to get past all of them and back.',
      rules: [
        'Each defender stands on one line, and may move only along that line. They never step off it.',
        'The attacking team starts at one end and tries to cross every line in order, get to the far end, and come back.',
        'A defender touches an attacker while that attacker is on their line — the attacker is out.',
        'Attackers may cross anywhere along a line, may dodge sideways, may wait, may even go back a line.',
        'One defender is allowed to run along the long middle line as well, and that is what makes the game genuinely hard.',
        'Keep going until all the attackers are out, or until someone makes it all the way there and back.'
      ],
      win: 'A point for every attacker who crosses every line and returns. Then swap sides. ' +
           'Higher score wins.',
      safe: [
        'This is a dodging game, not a contact game. Defenders touch — they do not stick an arm out to block someone running.',
        'Mark the lines with chalk or something flat. Never with bricks or bottles.'
      ],
      variants: [
        'In many places the number of lines is cut right down for a small group — five lines and four defenders plays perfectly well and is the sensible way to do it in a park.',
        'In many school versions the middle line is removed entirely, which makes it much easier for younger players.'
      ],
      words: [
        { term: 'आट्या', roman: 'atya', en: 'the crossing lines' },
        { term: 'पाट्या', roman: 'patya', en: 'the long middle line' },
        { term: 'पार', roman: 'paar', en: 'across — shout it when you clear a line' },
        { term: 'आउट', roman: 'out', en: 'out' }
      ],
      kid: 'It is chess where you are the piece, and you can see the trap being set for you a ' +
           'whole line before you have to run into it.',
      origin: 'This is an old game, played across much of India, particularly in Maharashtra. ' +
              'We will not claim a date for it without a source.',
      origin_pending: true
    },

    {
      id: 'langdi',
      name: 'Langdi',
      script: 'लंगड़ी',
      roman: 'langdi',
      alsoCalled: [
        'लंगडी Langdi — Marathi, where it is played as an organised team sport',
        'लंगड़ी टांग Langdi Taang — Hindi',
        'நொண்டி Nondi — Tamil',
        'ਲੰਗੜੀ Langdi — Punjabi'
      ],
      region: ['Maharashtra', 'Uttar Pradesh', 'Punjab', 'Tamil Nadu', 'Gujarat'],
      players: '3+',
      age: '6+',
      where: 'outside',
      needs: ['nothing', 'four bags or chalk lines to agree an area, if the space is big'],
      setup: 'One player chases, everyone else runs — the twist is that the chaser has to hop ' +
             'on one leg the entire time. Agree the edges of your area first, because a hopping ' +
             'chaser cannot cover a whole field and the game dies if runners are allowed to leg it.',
      rules: [
        'One player is the chaser. Everyone else runs.',
        'The chaser hops on one foot only. The other foot never touches the ground.',
        'Hopping, they try to touch a runner.',
        'Runners may run on both feet, but must stay inside the agreed area.',
        'If the chaser’s second foot touches down, they stop, go back to the edge, and start again.',
        'Anyone touched becomes the new chaser.'
      ],
      win: 'Either the last runner untouched wins, or — in the team version — each chaser gets ' +
           'a fixed turn and you count how many they caught before their leg gave out.',
      safe: [
        'Hopping tires a leg fast and rolls ankles. Swap the hopping leg every single turn, not every other one.',
        'Flat ground. No kerbs, no slopes, no gravel.'
      ],
      variants: [
        'In many places this is played as full teams — the whole chasing side takes turns hopping in, one after another, and caught runners are counted rather than becoming the chaser. That is the version played as a competitive sport in Maharashtra.',
        'In many places the chaser must also keep one hand holding their raised ankle, which is much harder and much funnier.'
      ],
      words: [
        { term: 'लंगड़ी', roman: 'langdi', en: 'hopping on one leg' },
        { term: 'पैर मत रख', roman: 'pair mat rakh', en: 'don’t put your foot down!' },
        { term: 'बदल', roman: 'badal', en: 'swap' },
        { term: 'पकड़ा', roman: 'pakda', en: 'caught!' }
      ],
      kid: 'Watching a big fast cousin be defeated entirely by having one leg is the funniest ' +
           'thing available for free.'
    },

    {
      id: 'chain-chain',
      name: 'Chain Chain',
      script: 'चेन चेन',
      roman: 'chain chain',
      alsoCalled: [
        'ज़ंजीर Zanjeer — Hindi for chain',
        'साखळी Saakhli — Marathi for chain',
        'Chain Tag',
        'Chain Cut'
      ],
      region: ['played in schools and streets across India'],
      players: '6+',
      age: '5+',
      where: 'outside',
      needs: ['nothing', 'agreed edges — a fence, two trees, the end of the grass'],
      setup: 'Ordinary tag, with one change that turns it into something else entirely: nobody ' +
             'ever leaves. Every person caught joins the chaser, holding hands, and the chain ' +
             'grows until it is enormous, slow and impossible to escape.',
      rules: [
        'One player is the chaser. Everyone else runs, inside the agreed edges.',
        'When the chaser touches someone, that person joins them and they hold hands.',
        'Now the two chase together, still holding hands.',
        'Only the two people at the ends of the chain may tag anyone. The people in the middle are just along for the ride.',
        'Everybody caught joins the chain, and it gets longer, slower and much funnier.',
        'If the chain breaks, nobody can be tagged at all until it is joined up again.'
      ],
      win: 'The last person not in the chain wins, and is the chaser next time.',
      safe: [
        'If the chain breaks, let go. Do not hang on — a long chain pulling in two directions is exactly how a shoulder gets hurt.',
        'Hold hands or wrists. Never clothes.'
      ],
      variants: [
        'In many places the chain splits in two once it reaches four people, so you get two fast chains instead of one enormous slow one. Better with a big group.',
        'In many places the middle of the chain may tag as well, which makes the last two minutes almost impossible to survive.'
      ],
      words: [
        { term: 'चेन', roman: 'chain', en: 'chain' },
        { term: 'जुड़ जा', roman: 'jud ja', en: 'join on!' },
        { term: 'टूट गयी', roman: 'toot gayi', en: 'it broke!' },
        { term: 'पकड़ा', roman: 'pakda', en: 'caught!' }
      ],
      kid: 'By the end you are one enormous flailing creature with nine legs, and the last free ' +
           'person is running for their life from all of you at once.'
    },

    /* ── the tag games with a rule you shout ─────────────────────────────── */
    {
      id: 'vish-amrit',
      name: 'Vish-Amrit',
      script: 'विष अमृत',
      roman: 'vish-amrit',
      alsoCalled: [
        'विष-अमृत Vish-Amrut — Marathi',
        'Poison and Nectar',
        'Amrit-Vish — the order of the words swaps depending on where you are'
      ],
      region: ['played across northern, western and central India, and in schools everywhere'],
      players: '3+',
      age: '5+',
      where: 'outside',
      needs: ['nothing'],
      setup: 'One chaser, everyone else runs. Being tagged does not put you out — it freezes ' +
             'you where you stand, and any free player can bring you back. So the game is not ' +
             'really about running away, it is about how brave you are willing to be for a friend.',
      rules: [
        'One player is the poisoner. Everyone else runs.',
        'When the poisoner touches you, they shout VISH — poison. You freeze exactly where you are.',
        'You cannot move a single step while frozen. Not even to make yourself easier to reach.',
        'Any free player can un-freeze you by touching you and shouting AMRIT — nectar.',
        'The poisoner is trying to get every single player frozen at the same moment.'
      ],
      win: 'The poisoner wins the instant everybody is frozen at once. Then pick a new one.',
      safe: [
        'Freezing means stopping on your feet, not diving to the ground.',
        'With more than about eight players, use two poisoners. With one, a single child ends up running until they feel sick and nobody enjoys it.'
      ],
      variants: [
        'In many places the rescuer has to crawl between the frozen player’s legs instead of just touching them, which makes rescuing someone genuinely risky.',
        'In many places a frozen player may shout for help but may not say a name, so the rescue has to be someone deciding to do it.'
      ],
      words: [
        { term: 'विष', roman: 'vish', en: 'poison — you are frozen' },
        { term: 'अमृत', roman: 'amrit', en: 'nectar — you are free' },
        { term: 'बच', roman: 'bach', en: 'escape!' },
        { term: 'छू', roman: 'chhoo', en: 'touch' }
      ],
      kid: 'You can go back for people. There is nothing better in any game than sprinting into ' +
           'danger to un-freeze your friend and getting caught doing it.'
    },

    {
      id: 'taala-chaabi',
      name: 'Taala-Chaabi (Lock and Key)',
      script: 'ताला चाबी',
      roman: 'taala-chaabi',
      alsoCalled: [
        'ताला-चाबी Taala-Chaabi — Hindi',
        'Lock and Key',
        'Chaabi Wala Khel'
      ],
      region: ['played in schools and streets across northern and western India'],
      players: '3+',
      age: '5+',
      where: 'outside',
      needs: ['nothing'],
      setup: 'Freeze tag, but the freezing has a shape to it: locked players stand with legs ' +
             'apart and arms out, so you can see across the whole park exactly who is stuck. ' +
             'It looks like a field of scarecrows, which is half the fun.',
      rules: [
        'One player is the chaser.',
        'When they touch you they shout TAALA — lock. You freeze with your legs apart and your arms straight out.',
        'You cannot move at all, but you are allowed to shout for help.',
        'Any free player frees you by touching you and shouting CHAABI — key.',
        'The chaser is trying to have everybody locked at the same time.'
      ],
      win: 'Everybody locked at once. Then someone else takes over as chaser.',
      safe: [
        'Freeze standing up, in a position you can actually hold. Not a stretch that will make you wobble into someone.',
        'Two chasers once there are more than eight of you.'
      ],
      variants: [
        'In many places the key must be turned — the rescuer touches your shoulder, turns it, and counts to three out loud, which gives the chaser time to catch them both.',
        'This is a very close cousin of vish-amrit, and in many places they are played with identical rules and only the shouted words change. If you know one, you already know the other — just agree which words you are using before you start.'
      ],
      words: [
        { term: 'ताला', roman: 'taala', en: 'lock — you are frozen' },
        { term: 'चाबी', roman: 'chaabi', en: 'key — you are free' },
        { term: 'खोल', roman: 'khol', en: 'open it!' },
        { term: 'बच', roman: 'bach', en: 'escape!' }
      ],
      kid: 'Standing there like a scarecrow yelling CHAABI at everybody who runs past and ' +
           'ignores you.'
    },

    {
      id: 'oonch-neech',
      name: 'Oonch-Neech',
      script: 'ऊँच नीच',
      roman: 'oonch-neech',
      alsoCalled: [
        'ऊँच नीच का पापड़ा Oonch Neech ka Papda — Hindi, the full playground name',
        'Unch-Neech',
        'High–Low Tag'
      ],
      region: ['Delhi', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Rajasthan', 'and school playgrounds well beyond'],
      players: '3+',
      age: '6+',
      where: 'outside',
      needs: ['nothing', 'somewhere with things to stand on — a step, a bench, a kerb, a tree root'],
      setup: 'A chasing game where the safe place keeps changing, and the chaser is the one who ' +
             'changes it. Before you begin, walk round together and agree out loud what counts ' +
             'as "high". That conversation is not admin — it is the whole game being set up.',
      rules: [
        'One player is the chaser.',
        'Before the chase starts, the chaser shouts either OONCH — high — or NEECH — low.',
        'If they shouted oonch, then anyone standing up on something is safe, and anyone on the ground can be caught.',
        'If they shouted neech, it is exactly the other way round: the ground is safe and being up high makes you a target.',
        'The chaser can change the call whenever they like, but must shout it loudly enough that everyone hears.',
        'Anyone caught in the wrong place becomes the new chaser.'
      ],
      win: 'It does not end. You play until you are tired, or until someone’s turn as chaser ' +
           'has plainly gone on too long and you all let them catch you.',
      safe: [
        'Agree what counts as "high" before anyone runs — a bench and a step, not a wall or a roof. This game is only dangerous when the safe spots keep getting higher as people get desperate.',
        'Nothing you would not climb with an adult watching. Assume one is.'
      ],
      variants: [
        'In many places it is played on a staircase, where one particular step is neutral and nobody can be caught standing there.',
        'In many places the chaser may not change the call until they have caught someone, which is much fairer for younger players.'
      ],
      words: [
        { term: 'ऊँच', roman: 'oonch', en: 'high' },
        { term: 'नीच', roman: 'neech', en: 'low' },
        { term: 'क्या है?', roman: 'kya hai?', en: 'which is it?' },
        { term: 'पकड़ा', roman: 'pakda', en: 'caught!' }
      ],
      kid: 'The chaser can change the rules mid-run, and you will hear the word change while ' +
           'you are in the air.'
    },

    {
      id: 'nadi-pahad',
      name: 'Nadi-Pahad',
      script: 'नदी पहाड़',
      roman: 'nadi-pahad',
      alsoCalled: [
        'नदी पहाड़ Nadi-Pahad — Hindi',
        'River and Mountain',
        'Nadi Paar'
      ],
      region: ['Uttar Pradesh', 'Bihar', 'Delhi', 'Madhya Pradesh', 'Rajasthan'],
      players: '3+',
      age: '4+',
      where: 'outside',
      needs: ['nothing', 'anything low you can stand on — a kerb, a step, a tree root, a folded jumper'],
      setup: 'A shouting game rather than a chasing one, so it works brilliantly with small ' +
             'children and with a group where the ages are all over the place. Decide together ' +
             'what is the river and what is the mountain, and keep the mountain low.',
      rules: [
        'The ground is nadi — the river. Anything raised is pahad — the mountain.',
        'One player is the caller and stands where everyone can hear them.',
        'The caller shouts either NADI or PAHAD.',
        'Everyone has to get to the named place at once.',
        'The last person to get there is out. So is anyone still in the wrong place when the caller counts to three.',
        'The caller is allowed to shout the same word twice in a row, to catch people who move too early.'
      ],
      win: 'Last player still in becomes the caller for the next round.',
      safe: [
        'Only low things count as pahad — set the height limit before you start, and knee-high is plenty.',
        'Not on a staircase. Everybody moving at once on steps is how ankles go.'
      ],
      variants: [
        'In many places this is played as a chasing game rather than a calling game, and then it is very close to oonch-neech. Ask which one everybody means before you start, or you will spend the first five minutes arguing.',
        'In many places there are three words rather than two — a third for sitting down — and the caller speeds up until nobody can keep track.'
      ],
      words: [
        { term: 'नदी', roman: 'nadi', en: 'river — the ground' },
        { term: 'पहाड़', roman: 'pahad', en: 'mountain — anything you can stand on' },
        { term: 'एक दो तीन', roman: 'ek do teen', en: 'one two three — the count' },
        { term: 'आउट', roman: 'out', en: 'out' }
      ],
      kid: 'A four-year-old cousin can win this against a ten-year-old, and regularly does.'
    },

    {
      id: 'chhupan-chhupai',
      name: 'Chhupan Chhupai',
      script: 'छुपन छुपाई',
      roman: 'chhupan chhupai',
      alsoCalled: [
        'লুকোচুরি Lukochuri — Bengali',
        'கண்ணாமூச்சி Kannaamoochi — Tamil',
        'దాగుడు మూతలు Dagudu Mootalu — Telugu',
        'ಕಣ್ಣಾಮುಚ್ಚಾಲೆ Kannaamuchaale — Kannada',
        'लपाछपी Lapa-Chhapi — Marathi',
        'ਲੁਕਣ ਮੀਟੀ Lukan Meeti — Punjabi',
        'Ice-Pice — Mumbai and beyond, the version with freezing'
      ],
      region: ['everywhere in India, under a different name in every language'],
      players: '3+',
      age: '4+',
      where: 'either',
      needs: ['nothing', 'somewhere with a few things to hide behind'],
      setup: 'You already know this game. What you probably do not know is dhappa — the run ' +
             'back to home. In the Indian version being spotted is not enough; the seeker has to ' +
             'beat you back to base and shout it, so every discovery turns into a sprint.',
      rules: [
        'Pick one person to be the seeker — the den.',
        'Agree the boundary out loud before anybody hides. This is the step everyone skips, and then argues about for ten minutes.',
        'The seeker stands at a home spot, covers their eyes, and counts out loud to an agreed number.',
        'Everybody hides.',
        'The seeker looks. When they spot you, that is not the end of it — they have to run back and touch home first and shout DHAPPA.',
        'If you get to home and touch it before they do, you are safe.',
        'Get all the way home untouched and you are safe whether they saw you or not.'
      ],
      win: 'The first person caught with a dhappa is the seeker next round. If everyone gets ' +
           'home safe, the same seeker goes again.',
      safe: [
        'Agree the boundary first, and put roads, driveways, garages and anything with water out of bounds. Not because it is likely — because it is the one that goes wrong.',
        'Never hide inside anything that shuts: a chest, a box, a car boot, an old fridge.'
      ],
      variants: [
        'In many places this is Ice-Pice: instead of racing home, the seeker shouts your name and the word, and you are frozen where you are — but another hider can sneak over and un-freeze you.',
        'In many families it is played with a counting rhyme rather than a number, and the rhyme decides how long you get.'
      ],
      words: [
        { term: 'धप्पा', roman: 'dhappa', en: 'got you! — shouted at home base' },
        { term: 'तैयार?', roman: 'taiyar?', en: 'ready?' },
        { term: 'आ रहा हूँ', roman: 'aa raha hoon', en: 'I’m coming!' },
        { term: 'छुप जा', roman: 'chhup ja', en: 'hide!' }
      ],
      kid: 'Being seen is not the end. You can still outrun them home, and shouting dhappa ' +
           'first is the sweetest thing in the game.'
    },

    /* ── the throwing and hitting games ──────────────────────────────────── */
    {
      id: 'lagori',
      name: 'Lagori / Seven Stones',
      script: 'लगोरी',
      roman: 'lagori',
      alsoCalled: [
        'पिट्ठू / पिट्टू Pithoo / Pittu — Hindi',
        'ਪਿੱਠੂ ਗਰਮ Pithu Garam — Punjabi',
        'सतोलिया / सितोलिया Satoliya / Sitoliya — Rajasthani and Hindi',
        'ಲಗೋರಿ / लगोरी Lagori — Kannada and Marathi',
        'সাতচাড়া Sat-Chara — Bengali',
        'ஏழுகல் Ezhu Kal — Tamil',
        'ഏഴുകല്ല് Ezhu Kallu — Malayalam',
        'Seven Stones — the English name it travels under'
      ],
      region: ['Karnataka', 'Maharashtra', 'Rajasthan', 'Punjab', 'Tamil Nadu', 'Kerala', 'Bengal', 'Gujarat', 'Uttar Pradesh'],
      players: '6+',
      age: '7+',
      where: 'outside',
      needs: ['seven flat stones that will stack — or jar lids, wooden discs, or bottle caps', 'one soft ball; a tennis ball is perfect'],
      setup: 'Stack the seven stones into a small tower. Two teams: one throws, one guards. ' +
             'Everything happens in the four seconds after the tower falls, when one team is ' +
             'sprinting to rebuild it and the other is trying to hit them with the ball.',
      rules: [
        'Stack the seven stones. Mark a throwing line a few steps back.',
        'A player from the throwing team gets three attempts to knock the tower down with the ball.',
        'The moment it falls, their whole team runs in to rebuild it.',
        'The guarding team grabs the ball and throws it at the runners — below the knee.',
        'Anyone hit is out for that round and stands aside.',
        'If the throwing team gets all seven stones stacked again, someone puts a hand on the tower and shouts LAGORI.',
        'If all three throws miss the tower, the teams swap over.'
      ],
      win: 'The round ends when the tower is rebuilt — throwers win — or when everyone on the ' +
           'throwing team has been hit — guards win. Swap sides and go again.',
      safe: [
        'You throw at legs, below the knee. Never at a head, and never hard from close up. This is the rule that makes the game playable at all.',
        'A soft ball. A tennis ball is fine. A cricket ball is not, and neither is anything harder.',
        'The rebuild scramble is where heads knock together. Somebody should call it out loud when it gets silly.'
      ],
      variants: [
        'In many places a runner who catches a thrown ball is safe, and the guards must start their throwing again from where the ball landed.',
        'In many places you must shout the name when you finish the tower, and if you forget to shout, it does not count — which has cost more rounds than any missed throw.'
      ],
      words: [
        { term: 'लगोरी', roman: 'lagori', en: 'the shout when the tower is rebuilt' },
        { term: 'मारा', roman: 'mara', en: 'hit!' },
        { term: 'बचो', roman: 'bacho', en: 'dodge!' },
        { term: 'फिर से', roman: 'phir se', en: 'again' }
      ],
      kid: 'Everything happens at once — stones going down, people running in, a ball coming at ' +
           'your ankles — and one person always has to be brave enough to place the last stone.'
    },

    {
      id: 'gilli-danda',
      name: 'Gilli-Danda',
      script: 'गिल्ली डंडा',
      roman: 'gilli-danda',
      alsoCalled: [
        'विटी दांडू Viti-Dandu — Marathi',
        'ডাংগুলি Danguli — Bengali',
        'கிட்டிப்புள் Kitti-pull — Tamil',
        'ಚಿನ್ನಿ ದಾಂಡು Chinni-Dandu — Kannada',
        'കുട്ടിയും കോലും Kuttiyum Kolum — Malayalam',
        'મોઇ દાંડિયા Moi-Dandiya — Gujarati',
        'ਗੁੱਲੀ ਡੰਡਾ Gulli-Danda — Punjabi'
      ],
      region: ['Punjab', 'Uttar Pradesh', 'Bihar', 'Maharashtra', 'Bengal', 'Tamil Nadu', 'Kerala', 'Karnataka', 'Gujarat'],
      players: '3+',
      age: '9+',
      where: 'outside',
      needs: ['one long stick about the length of your arm — the danda', 'one short stick about the length of your hand, whittled to a point at both ends — the gilli'],
      setup: 'This is the ancestor of every bat-and-ball game and it needs a big, empty, open ' +
             'space and nothing else. Scratch a small oval hole in the ground and lay the gilli ' +
             'across it so one pointed end sticks up. Read the safety line before you start ' +
             'this one, because it is the one game here that genuinely hurts people.',
      rules: [
        'Rest the gilli across the hole so one end is raised.',
        'Flick the raised end sharply with the danda. The gilli pops up into the air.',
        'While it is still in the air, hit it as far as you can with the danda.',
        'If a fielder catches it before it touches the ground, you are out.',
        'If nobody catches it, a fielder picks it up and throws it back at the hole.',
        'If their throw hits the hole — or hits the danda if you have laid it across the hole — you are out.',
        'If they miss, you measure from the hole to where the gilli landed, in danda-lengths. That is your score.'
      ],
      win: 'Highest total once everyone has batted, or first to an agreed number of ' +
           'danda-lengths. A hundred is a long game; twenty-five is an afternoon.',
      safe: [
        'The gilli comes off the danda fast and in a direction nobody predicted. This is the one game on this list where people really do get hit in the eye — everyone accepts that or nobody plays.',
        'Fielders stand well back and off to the side. Never in front of the batter, never close.',
        'A big empty space only. Away from windows, cars, roads, and anybody who is not playing.',
        'Never hit towards people. If someone walks into the space, everything stops until they are gone.'
      ],
      variants: [
        'In many places the batter first names how many danda-lengths they think it went, and the fielders either accept it or make them measure — which turns the whole thing into a bluffing game.',
        'In many places the gilli is balanced on a brick or a raised stone instead of over a hole, which works far better on grass.'
      ],
      words: [
        { term: 'गिल्ली', roman: 'gilli', en: 'the little stick' },
        { term: 'डंडा', roman: 'danda', en: 'the big stick' },
        { term: 'मारा', roman: 'mara', en: 'hit it!' },
        { term: 'पकड़', roman: 'pakad', en: 'catch it!' },
        { term: 'आउट', roman: 'out', en: 'out' }
      ],
      kid: 'Hitting a flying stick with another stick is impossible for about a week, and then ' +
           'suddenly it is not, and you will send it further than you can see.',
      origin: 'This is an old game, played across much of India under a different name in nearly ' +
              'every language. We will not put a date or an origin story on it without a source.',
      origin_pending: true
    },

    {
      id: 'maram-pitti',
      name: 'Maram Pitti',
      script: 'मार पिट्टी',
      roman: 'maram pitti',
      alsoCalled: [
        'मार पिट्टी Maram Pitti — Hindi',
        'Ball Pitti',
        'Dodge Ball — its closest cousin at school'
      ],
      region: ['played in streets and schoolyards across northern and western India'],
      players: '3+',
      age: '7+',
      where: 'outside',
      needs: ['one soft ball — a tennis ball or, better, a sponge ball'],
      setup: 'No teams, no sides, no captains. One ball, everybody scattered, and whoever picks ' +
             'the ball up is briefly the most powerful person in the park and cannot move their ' +
             'feet.',
      rules: [
        'Everyone spreads out inside an agreed area.',
        'Throw the ball straight up. Whoever catches it is the thrower. Everybody else runs.',
        'The thrower cannot run while holding the ball. They can only pivot on one foot.',
        'They throw the ball at a runner — below the waist.',
        'Hit, and that player is out. Or, in the version worth playing, that player becomes the new thrower.',
        'If a runner catches the throw cleanly out of the air, the thrower is out instead.',
        'Any loose ball belongs to whoever gets to it, and they are the thrower now.'
      ],
      win: 'Last runner not hit — or play the swap version, where nobody is ever out and it ' +
           'simply runs until dinner. That version is better with four people.',
      safe: [
        'Soft ball, below the waist. Both of those, every time. This game gets its bad reputation from one person throwing hard at a head, so make that the one thing nobody does.',
        'Not with a cricket ball, not with a hard football, and not indoors.',
        'If a younger child is playing, everyone throws underarm. No exceptions and no sulking.'
      ],
      variants: [
        'In many places anyone hit joins the throwing side instead of sitting out, so the group of throwers grows and everybody keeps playing.',
        'In many places the thrower is allowed three steps before throwing, which makes it far easier for smaller players.'
      ],
      words: [
        { term: 'गेंद', roman: 'gend', en: 'ball' },
        { term: 'भाग', roman: 'bhaag', en: 'run!' },
        { term: 'लगा', roman: 'laga', en: 'hit!' },
        { term: 'बच के', roman: 'bach ke', en: 'look out!' },
        { term: 'आउट', roman: 'out', en: 'out' }
      ],
      kid: 'Nobody is on your team and nobody is against you. It is just you, everybody else, ' +
           'and one ball.'
    },

    /* ── the circle games ────────────────────────────────────────────────── */
    {
      id: 'rumaal-chor',
      name: 'Rumaal Chor',
      script: 'रुमाल चोर',
      roman: 'rumaal chor',
      alsoCalled: [
        'रुमाल चोर Rumaal Chor — Hindi, "handkerchief thief"',
        'रुमाल झपट्टा Rumaal Jhapatta — Marathi',
        'Kerchief Thief',
        'Steal the Bacon — the closest thing your friends at school will know'
      ],
      region: ['played in schools and streets across India'],
      players: '6+',
      age: '5+',
      where: 'either',
      needs: ['a handkerchief — or a sock, a scarf, a folded tea towel'],
      setup: 'Everyone sits in a big circle facing inwards. One person walks slowly round the ' +
             'outside with the rumaal held behind their back. Nobody in the circle is allowed to ' +
             'look behind them, so the whole game happens in your ears.',
      rules: [
        'Everyone sits in a circle facing in. One player — the chor — walks round the outside with the rumaal.',
        'Everyone in the circle looks straight ahead. Nobody turns round.',
        'At some point the chor quietly drops the rumaal behind somebody, and keeps walking exactly as before.',
        'If that person notices it behind them, they snatch it up, jump to their feet, and chase the chor around the circle.',
        'The chor has to get all the way round and sit down in the empty gap before being tagged.',
        'If the chor is tagged, they walk again. If they get to the gap, the other player is the new chor.',
        'If the chor completes a whole lap and you still have not noticed the rumaal behind you, that is worse than being caught, and everybody will tell you so.'
      ],
      win: 'There is no end to it. It runs until everyone is bored, or somebody’s mother calls, ' +
           'and that is the point of the game.',
      safe: [
        'Run round the outside of the circle, never through the middle.',
        'Sitters keep hands and feet tucked in. This is the game where fingers get stepped on.'
      ],
      variants: [
        'In many places the whole circle sings while the chor walks, so nobody can hear the footsteps stop — which is far harder and far better.',
        'In many places the chor is allowed to fake the drop as many times as they like, and everybody starts patting the ground behind them like idiots.'
      ],
      words: [
        { term: 'रुमाल', roman: 'rumaal', en: 'handkerchief' },
        { term: 'चोर', roman: 'chor', en: 'thief' },
        { term: 'पीछे मत देख', roman: 'peechhe mat dekh', en: 'don’t look behind you!' },
        { term: 'भाग', roman: 'bhaag', en: 'run!' }
      ],
      kid: 'The unbearable second when you are almost sure something has been put behind you but ' +
           'you are not allowed to look.'
    },

    {
      id: 'kokla-chhapaki',
      name: 'Kokla Chhapaki',
      script: 'ਕੋਕਲਾ ਛਪਾਕੀ',
      roman: 'kokla chhapaki',
      alsoCalled: [
        'ਕੋਕਲਾ ਛਪਾਕੀ Kokla Chhapaki — Punjabi',
        'कोकला छपाकी Kokla Chhapaki — Hindi',
        'Duck, Duck, Goose — its nearest cousin abroad, though this one has a song'
      ],
      region: ['Punjab', 'Haryana', 'Delhi', 'Himachal Pradesh', 'and Punjabi households wherever they are'],
      players: '6+',
      age: '5+',
      where: 'either',
      needs: ['a knotted cloth — a dupatta, a scarf, a tied-up sock'],
      setup: 'A circle game, like rumaal chor, but sung. The walker chants and everyone in the ' +
             'circle chants back, which means the whole game runs on a rhyme rather than on ' +
             'silence — and a child who plays it twice has the rhyme forever.',
      rules: [
        'Everyone sits in a circle facing inwards, eyes forward, hands in their lap.',
        'One player walks round the outside holding the knotted cloth and sings the kokla chhapaki rhyme.',
        'The circle answers the rhyme back. Nobody looks behind them.',
        'The walker drops the cloth silently behind somebody.',
        'If that person notices, they grab it, get up and chase the walker round the circle, trying to tag them before they reach the empty space.',
        'If they do not notice, and the walker completes a full lap, the walker picks the cloth back up and gives them one light tap on the back — and then they walk next.'
      ],
      win: 'It does not end on its own. Stop when everyone has had a turn walking round.',
      safe: [
        'The tap is a tap. If it turns into a whack the game stops — that is the one rule the grown-ups have to hold, and everybody knows it.',
        'Sitters keep their legs crossed so nobody trips over a stretched-out foot.'
      ],
      variants: [
        'In many families nobody is tapped at all — the person simply becomes the next walker. That version works much better with younger children and loses nothing.',
        'In many families the rhyme is different, and there are several versions of the words. Ask a grandparent which one they sang.'
      ],
      chant: {
        script: 'ਕੋਕਲਾ ਛਪਾਕੀ ਜੁੰਮੇ ਰਾਤ ਆਈ ਏ, ਜਿਹੜਾ ਅੱਗੇ ਪਿੱਛੇ ਵੇਖੇ ਓਹਦੀ ਸ਼ਾਮਤ ਆਈ ਏ',
        roman: 'kokla chhapaki jumme raat aayi e, jehda agge pichhe vekhe ohdi shaamat aayi e',
        en: 'roughly: the kokla chhapaki night has come — and whoever looks around is in trouble',
        note: 'This is one version among several. Words vary from street to street and family to ' +
              'family; ask yours which words they sang, and use those instead.'
      },
      words: [
        { term: 'ਕੋਕਲਾ', roman: 'kokla', en: 'the game’s own word — it does not translate neatly' },
        { term: 'ਭੱਜ', roman: 'bhaj', en: 'run! — Punjabi' },
        { term: 'ਪਿੱਛੇ ਨਾ ਵੇਖ', roman: 'pichhe na vekh', en: 'don’t look behind!' },
        { term: 'ਫੜਿਆ', roman: 'phadeya', en: 'caught!' }
      ],
      kid: 'Everyone is singing at you while somebody creeps around behind your back, and you ' +
           'are not allowed to turn round.'
    },

    {
      id: 'poshampa',
      name: 'Poshampa',
      script: 'पोशम पा',
      roman: 'poshampa',
      alsoCalled: [
        'पोशम पा भई पोशम पा Poshampa Bhai Poshampa — Hindi, the full name from the rhyme',
        'Posham Pa',
        'London Bridge — the English game with the same arch and the same trick'
      ],
      region: ['Delhi', 'Uttar Pradesh', 'Punjab', 'Rajasthan', 'Madhya Pradesh', 'Bihar'],
      players: '6+',
      age: '4+',
      where: 'either',
      needs: ['nothing'],
      setup: 'The youngest game here, and the one that works with a five-year-old and a ' +
             'ten-year-old in the same group. Two players make an arch with their arms, ' +
             'everybody else walks through it in a line while a rhyme is sung, and the arm comes ' +
             'down on somebody at the end of the song.',
      rules: [
        'Two players face each other, hold both hands and lift their arms up into an arch.',
        'Secretly, before starting, those two each pick a side — one is, say, mangoes and one is guavas. They do not tell anyone.',
        'Everyone else forms a line and walks through the arch, round in a loop, and through again.',
        'The two making the arch sing the poshampa rhyme while the line walks.',
        'On the last word, they drop their arms and trap whoever is under the arch.',
        'They ask the trapped person quietly which of the two things they want. The trapped person picks, and goes to stand behind whichever of the two it was.',
        'Carry on until everybody has been caught and is standing in one of the two lines.',
        'Now the two lines hold on to each other and have a tug of war.'
      ],
      win: 'The tug of war decides it. Whichever line pulls the other over the middle has won ' +
           'the whole thing — and nobody knew which line they were joining, which is the joke.',
      safe: [
        'Bring the arms down, do not swing them down onto a head.',
        'In the tug of war, hold waists — never necks. And everybody stops the moment one person lets go.'
      ],
      variants: [
        'In many families the rhyme is completely different — the Lal Qila one is the version most people know, but ask a parent what words they sang, because that is the real one for your family.',
        'In many places the two choices are said out loud rather than whispered, so everyone can try to end up on the strong side.'
      ],
      chant: {
        script: 'पोशम पा भई पोशम पा, लाल किले में क्या हुआ? सौ रुपये की घड़ी चुराई, अब तो जेल में जाना पड़ेगा',
        roman: 'poshampa bhai poshampa, lal qile mein kya hua? sau rupaye ki ghadi churayi, ab to jail mein jaana padega',
        en: 'roughly: poshampa, poshampa — what happened at the Red Fort? A hundred-rupee watch was stolen, so now off to jail you go',
        note: 'One version among many. The words drift from street to street and there are ' +
              'several endings — ask your family which one they sang.'
      },
      words: [
        { term: 'पोशम पा', roman: 'poshampa', en: 'the rhyme’s own opening words' },
        { term: 'भई', roman: 'bhai', en: 'brother — the filler word in the song' },
        { term: 'चुन', roman: 'chun', en: 'choose' },
        { term: 'पकड़ा', roman: 'pakda', en: 'caught!' }
      ],
      kid: 'You choose without knowing what you are choosing, and then find out you have just ' +
           'joined the losing side of a tug of war.'
    },

    {
      id: 'dog-and-bone',
      name: 'Dog and the Bone',
      script: 'कुत्ता हड्डी',
      roman: 'kutta-haddi',
      alsoCalled: [
        'कुत्ता-हड्डी Kutta-Haddi — Hindi',
        'Dog and the Bone — the name most Indian schools actually use',
        'Steal the Bacon — the same game abroad'
      ],
      region: ['played in school PE lessons and streets across India'],
      players: '6+',
      age: '6+',
      where: 'outside',
      needs: ['one object to be the bone — a rolled-up sock, a shoe, a beanbag', 'two lines: chalk, or a row of bags'],
      setup: 'Two teams face each other from a good distance, with one object sitting in the ' +
             'middle. Everyone gets a number, and when your number is called you and one person ' +
             'from the other team run at each other. Almost the entire game happens standing ' +
             'still, half a metre from the bone, daring each other.',
      rules: [
        'Two teams line up facing each other behind their own lines, well apart.',
        'Put the bone in the middle, exactly halfway.',
        'Give every player a number. Number one on one team faces number one on the other, and so on.',
        'Somebody calls out a number.',
        'The two players with that number run to the bone.',
        'Grab the bone and get back over your own line without being touched, and your team scores.',
        'If you are touched while holding it, the other team scores instead.',
        'If neither of you dares pick it up, that is completely allowed. The dance around the bone is the game.'
      ],
      win: 'First team to an agreed score. Five is usually plenty; ten is a proper match.',
      safe: [
        'Touching only. No grabbing an arm, and no snatching the bone out of somebody’s hand.',
        'Something soft as the bone. A rolled sock or a beanbag, not a bottle you can land on.'
      ],
      variants: [
        'In many places the caller shouts two numbers at once, so it becomes two-against-two and much harder.',
        'In many places the caller shouts "all", and every single player runs at the same time, which is chaos and worth doing once per game.'
      ],
      words: [
        { term: 'हड्डी', roman: 'haddi', en: 'bone' },
        { term: 'भाग', roman: 'bhaag', en: 'run!' },
        { term: 'पकड़', roman: 'pakad', en: 'catch him!' },
        { term: 'मेरा', roman: 'mera', en: 'mine!' }
      ],
      kid: 'Two of you crouched over one sock, neither daring to move, everybody else screaming.'
    },

    /* ── the hand and eye games ──────────────────────────────────────────── */
    {
      id: 'stapoo',
      name: 'Stapoo (Hopscotch)',
      script: 'स्टापू',
      roman: 'stapoo',
      alsoCalled: [
        'किथ-किथ Kith-Kith — Hindi',
        'ਚਿੰਡਰੋ Chindro — Punjabi',
        'এক্কা-দোক্কা Ekka-Dokka — Bengali',
        'பாண்டி Paandi — Tamil',
        'ಕುಂಟೆಬಿಲ್ಲೆ Kunte Bille — Kannada',
        'తొక్కుడు బిళ్ళ Tokkudu Billa — Telugu',
        'Hopscotch — the English name'
      ],
      region: ['Delhi', 'Punjab', 'Bengal', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'and effectively everywhere'],
      players: '2',
      age: '5+',
      where: 'outside',
      needs: ['chalk — or a stick to scratch the lines in dirt', 'one flat stone, or an old shoe-polish tin'],
      setup: 'The best driveway game in the world. Draw eight or nine boxes in a column — some ' +
             'single, some in side-by-side pairs — and number them. You will need about two metres ' +
             'of flat ground and nothing else at all.',
      rules: [
        'Throw your stone into box one. It has to land inside, not on a line.',
        'Hop through all the boxes, skipping the box your stone is in, and never touching a line.',
        'Where two boxes sit side by side, you may land with one foot in each. Everywhere else it is one foot only.',
        'At the top, turn round and hop back down the same way.',
        'On the way back, pick your stone up without putting your other foot down.',
        'Do all that and you go again, throwing into box two next time. Then three. Then four.',
        'Step on a line, wobble, put a hand down, or throw badly, and your turn ends — but you start next turn from the same box.'
      ],
      win: 'First person to finish the last box. In many versions the winner then claims one box ' +
           'as their house, and from then on only they are allowed to put two feet down in it.',
      safe: [
        'Concrete is hard and hopping is one-legged. Trainers, not sandals and not bare feet.',
        'Not on a driveway where a car turns in, and not on anybody’s road.'
      ],
      variants: [
        'In many places you kick the stone from box to box with your hopping foot rather than picking it up, which is far harder.',
        'In many places the top box is a rest square where everybody is allowed both feet, and in others the shape is a spiral or a snail rather than a column. Draw the one your family drew.'
      ],
      words: [
        { term: 'गोटी', roman: 'goti', en: 'the flat stone you throw' },
        { term: 'घर', roman: 'ghar', en: 'house — a square' },
        { term: 'मेरा घर', roman: 'mera ghar', en: 'my house — the box you have won' },
        { term: 'लाइन', roman: 'line', en: 'line — shouted when someone touches one' }
      ],
      kid: 'Once you own a house, everybody else has to hop over it and you get to stand in it ' +
           'on two feet like a king.'
    },

    {
      id: 'kancha',
      name: 'Kancha (Marbles)',
      script: 'कंचा',
      roman: 'kancha',
      alsoCalled: [
        'कंचे Kanche — Hindi',
        'ਬੰਟਾ Banta — Punjabi',
        'गोट्या Gotya — Marathi',
        'கோலி Goli — Tamil',
        'ಗೋಲಿ Goli — Kannada',
        'గోళీలు Golilu — Telugu',
        'লাটিম / গুলি Guli — Bengali',
        'લખોટી Lakhoti — Gujarati'
      ],
      region: ['played across all of India, and traded across all of it too'],
      players: '2',
      age: '6+',
      where: 'either',
      needs: ['about five marbles each', 'a patch of dirt, grass, or a flat floor'],
      setup: 'Scratch a small hole in the ground or draw a circle. Everybody puts one marble in. ' +
             'Then you kneel down and flick, with your thumb, and try to knock other people’s ' +
             'marbles out and keep them. The flick takes about a week to learn.',
      rules: [
        'Everyone puts one marble into the circle.',
        'Agree a shooting line and take turns.',
        'Shoot by resting your shooter marble in the crook of your bent finger and flicking it hard with your thumb. Your knuckle stays on the ground.',
        'Knock a marble out of the circle and you keep it — and you shoot again.',
        'Miss, and your shooter stays exactly where it stopped, which may be somewhere very dangerous.',
        'If somebody hits your shooter where it lies, you owe them a marble.'
      ],
      win: 'Play until the circle is empty. Whoever has the most marbles has won — and in most ' +
           'streets you hand them all back afterwards, unless everybody agreed otherwise before ' +
           'the first shot.',
      safe: [
        'Marbles on a hard floor are a slipping hazard for anybody walking through. Play at the edge of a space, never in a doorway.',
        'Not with a toddler in the room. A marble is exactly the wrong size.'
      ],
      variants: [
        'In many places you play "for keeps" and in many others everything goes back at the end. Say which one out loud before the first shot, not after somebody has lost their best marble.',
        'In many places there is no circle at all — you simply try to hit another player’s marble wherever it lies, all the way down a street.'
      ],
      words: [
        { term: 'कंचा', roman: 'kancha', en: 'marble' },
        { term: 'निशाना', roman: 'nishana', en: 'aim' },
        { term: 'मेरी बारी', roman: 'meri bari', en: 'my turn' },
        { term: 'लगा', roman: 'laga', en: 'hit!' }
      ],
      kid: 'Marbles are money. You will end the week richer or ruined, and everybody will know ' +
           'which.'
    },

    {
      id: 'lattoo',
      name: 'Lattoo (Spinning Top)',
      script: 'लट्टू',
      roman: 'lattoo',
      alsoCalled: [
        'लट्टू Lattoo — Hindi',
        'लाট্টু Lattu — Bengali',
        'भोवरा Bhovra — Marathi',
        'ભમરડો Bhamardo — Gujarati',
        'பம்பரம் Pambaram — Tamil and Malayalam',
        'బొంగరం Bongaram — Telugu',
        'ಬುಗುರಿ Buguri — Kannada'
      ],
      region: ['played across all of India, with local shapes of top in every region'],
      players: '2',
      age: '8+',
      where: 'either',
      needs: ['a wooden top', 'about two metres of string'],
      setup: 'You will not be able to do this on the first day, or the second. Winding the ' +
             'string is a skill and throwing it is another one, and the moment the top bites the ' +
             'ground and stands up spinning is worth every failed attempt before it.',
      rules: [
        'Wind the string tightly around the top, starting at the tip and working upwards, keeping each loop flat against the last.',
        'Keep the loose end wrapped around one finger so it cannot get away.',
        'Throw the top down and forwards at the ground, and pull the string sharply back as you let go.',
        'It will not work the first ten times. That is normal and everybody goes through it.',
        'Once you can spin it, draw a circle on the ground. Everybody spins into the circle.',
        'A skilled player throws their top so it strikes another top and knocks it out of the circle.'
      ],
      win: 'The last top still spinning inside the circle. And separately, quietly, whoever can ' +
           'pick their spinning top up onto their palm, which is the real prize.',
      safe: [
        'A thrown top is a small heavy object moving fast. Throw down at the ground, never out at chest height, and never anywhere near a face.',
        'Plain wooden tops to learn on. The metal-tipped ones chip and split when they collide.'
      ],
      variants: [
        'In many places the beginners’ round has no knocking at all — everybody just spins and the longest spin wins, which is a much kinder place to start.',
        'In many places the loser’s top is placed in the middle of the circle to be aimed at, which is exciting and how tops get destroyed.'
      ],
      words: [
        { term: 'लट्टू', roman: 'lattoo', en: 'spinning top' },
        { term: 'डोर', roman: 'dor', en: 'string' },
        { term: 'घुमा', roman: 'ghuma', en: 'spin it!' },
        { term: 'घूम रहा है', roman: 'ghoom raha hai', en: 'it’s still spinning!' }
      ],
      kid: 'The first time it stands up and spins instead of flopping over is a genuinely great ' +
           'moment in a person’s life.'
    },

    {
      id: 'gutte',
      name: 'Gutte (Five Stones)',
      script: 'गुट्टे',
      roman: 'gutte',
      alsoCalled: [
        'गुट्टे Gutte — Hindi',
        'ਗੀਟੇ Gitte — Punjabi',
        'सागरगोटे Sagargote — Marathi, played with smooth round seeds',
        'கல்லாங்காய் Kallankai — Tamil',
        'Five Stones — the name it goes by across the diaspora'
      ],
      region: ['Uttar Pradesh', 'Punjab', 'Maharashtra', 'Tamil Nadu', 'Rajasthan', 'Bengal'],
      players: '2',
      age: '6+',
      where: 'either',
      needs: ['five small stones that fit in one hand — or five dice, or five bottle caps'],
      setup: 'Sit on any flat surface with five small stones. One of them goes up in the air, ' +
             'and in the time it takes to come down you have to pick another one up off the ' +
             'ground and still catch the first. Then two at a time. Then three.',
      rules: [
        'Scatter all five stones gently onto the ground in front of you. Pick one up — that is your thrower.',
        'Toss the thrower straight up, pick up exactly one stone from the ground, and catch the thrower in the same hand before it lands.',
        'Do that four times, one stone at a time, until the ground is clear. That is round one.',
        'Round two: same thing, but you pick up two stones at a time.',
        'Round three: three at once, then the last one on its own. Round four: all four in one grab.',
        'Drop the thrower, or nudge a stone you did not mean to touch, and your turn passes to the next player.',
        'You start your next turn from the round you failed on, not from the beginning.'
      ],
      win: 'First person to get through all four rounds cleanly. Almost nobody does it the first ' +
           'day, which is exactly why it keeps going.',
      safe: [
        'Smooth stones, not sharp chips off a wall.',
        'Not tossed up near anybody’s face. It is small, but it is still a stone going up.'
      ],
      variants: [
        'In many places extra rounds are added on the end — clapping once between the toss and the catch, or sweeping all the stones into a pile before grabbing them.',
        'In many places in Maharashtra the same game is played with sagargote, smooth round seeds, and the whole thing feels different in the hand.'
      ],
      words: [
        { term: 'गुट्टे', roman: 'gutte', en: 'the stones' },
        { term: 'मेरी बारी', roman: 'meri bari', en: 'my turn' },
        { term: 'गिरा', roman: 'gira', en: 'dropped it!' },
        { term: 'एक और', roman: 'ek aur', en: 'one more' }
      ],
      kid: 'It costs nothing, fits in a pocket, and can be played on a train, on a doorstep, or ' +
           'in the ten minutes before school.'
    },

    {
      id: 'patang',
      name: 'Patang (Kite Flying)',
      script: 'पतंग',
      roman: 'patang',
      alsoCalled: [
        'પતંગ Patang — Gujarati, where Uttarayan fills every roof',
        'ঘুড়ি Ghuri — Bengali',
        'பட்டம் Pattam — Tamil',
        'గాలిపటం Gaalipatam — Telugu',
        'ਗੁੱਡੀ Guddi — Punjabi',
        'ಗಾಳಿಪಟ Gaalipata — Kannada'
      ],
      region: ['Gujarat', 'Rajasthan', 'Delhi', 'Uttar Pradesh', 'Bengal', 'Tamil Nadu', 'Telangana'],
      players: '2',
      age: '8+',
      where: 'outside',
      needs: ['a paper kite', 'plain cotton or polyester string on a reel — never the coated kind', 'an open space with steady wind and no power lines anywhere near it'],
      setup: 'Read the safety notes on this one first; there is a real reason for them. Then ' +
             'find a wide open space with a steady wind — light and even beats strong and gusty ' +
             'every time — and get one other person to hold the kite up for you.',
      rules: [
        'Check the wind. Light and steady is best. Gusty, next to buildings, is the worst place you can choose.',
        'Have someone hold the kite up above their head while you walk about twenty steps away, letting string out.',
        'Ask them to let go, and at the same moment pull the string down sharply and take two steps backwards.',
        'When the kite pulls, let string out — that is dheel. When it starts to fall, pull string in — that is kheench.',
        'Steer with small tugs, not big ones. A kite answers a tug about a second after you give it.',
        'Once you can hold it steady in one place in the sky, you have learnt the whole thing. Everything after that is practice.'
      ],
      win: 'There is no winning unless you are cutting: two flyers cross their strings and pull ' +
           'until one line parts, and whoever is left flying shouts WOH KAATA. Do that only with ' +
           'plain string, and only with someone who agreed to it.',
      safe: [
        'Manja — kite string coated with powdered glass or metal — is what makes kite season genuinely dangerous in India, and it is restricted in several places for exactly that reason. Use plain cotton or polyester. Never buy coated string and never make it.',
        'Never fly anywhere near power lines. If a kite catches on one it stays there forever — you do not go and get it, ever, and that is not negotiable.',
        'Not from a roof, not off a balcony, not leaning over anything. Flat open ground.',
        'Wrap a strip of cloth round your pulling hand. Even plain string burns when a kite is pulling hard.'
      ],
      variants: [
        'In many places kite flying belongs to one particular day — Uttarayan in Gujarat, Makar Sankranti across much of the north, Independence Day in Delhi — when whole roofs fill up and the sky is solid with them. Ask your family which day was theirs.',
        'In many places nobody cuts at all and it is purely about height, which is the version to start with.'
      ],
      words: [
        { term: 'पतंग', roman: 'patang', en: 'kite' },
        { term: 'डोर', roman: 'dor', en: 'string' },
        { term: 'ढील', roman: 'dheel', en: 'let it out!' },
        { term: 'खींच', roman: 'kheench', en: 'pull it in!' },
        { term: 'वो काटा', roman: 'woh kaata', en: 'cut! — the shout when the other kite’s string goes' }
      ],
      kid: 'You are holding a piece of string and the other end of it is two hundred feet up, ' +
           'and you can feel every gust in your fingers.'
    },

    /* ── the sitting-down games: rain, winter, aeroplanes ────────────────── */
    {
      id: 'chowka-bara',
      name: 'Chowka Bara',
      script: 'ಚೌಕಾಬಾರ',
      roman: 'chowka bara',
      alsoCalled: [
        'ಚೌಕಾಬಾರ Chowka Bara — Kannada',
        'అష్టా చమ్మా Ashta Chamma — Telugu',
        'చుక్కా బారా Chukka Bara — Telugu',
        'தாயம் Thaayam / தாயக்கட்டை Daayakattai — Tamil',
        'Katta Mane',
        'Chakka'
      ],
      region: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Maharashtra'],
      players: '3+',
      age: '7+',
      where: 'inside',
      needs: ['a 5×5 grid — drawn on cloth, on paper, or straight onto the floor with chalk', 'four cowrie shells, or four coins, or four halved peanut shells', 'four counters each — buttons, seeds, bottle caps'],
      setup: 'A race game for two to four players on a 5×5 grid. Instead of dice you throw four ' +
             'cowrie shells and count how many land mouth-up. Five squares on the board are safe ' +
             'houses — the centre and four others — and everything in the game happens around ' +
             'which of them you can reach.',
      rules: [
        'Draw a 5×5 grid. Mark the centre square and four crossed squares as safe houses.',
        'Each player takes four counters and starts them off the board at their own corner.',
        'On your turn, throw the four cowries. Count how many land mouth-up — that is how many squares you move. All four face down usually counts as eight.',
        'Move any one of your counters that many squares, following the path anticlockwise round the board and then spiralling in towards the centre.',
        'Land on a square holding an opponent’s counter and you send it right back to the start — unless that square is a safe house.',
        'Two of your own counters on one square are safe together, and may move together as a pair.',
        'To finish, a counter must land exactly on the centre square. Overshoot and you simply lose the move.'
      ],
      win: 'First player to bring all four of their counters into the centre.',
      safe: [
        'Cowries, buttons and seeds are all small. Play this on a table if there is a toddler in the house.'
      ],
      variants: [
        'In many families the throw values are different — one house scores all-four-down as eight and another as twelve. Agree it before the first throw, or you will be arguing at square nine.',
        'In many families you must throw a specific number to bring a new counter onto the board, which slows the whole game down and makes the start much more tense.'
      ],
      words: [
        { term: 'ಕವಡೆ', roman: 'kavade', en: 'the cowrie shells you throw — Kannada' },
        { term: 'ಮನೆ', roman: 'mane', en: 'house — one square of the board — Kannada' },
        { term: 'ಆಟ', roman: 'aata', en: 'game — Kannada' },
        { term: 'అష్టా', roman: 'ashta', en: 'eight — Telugu, and half of the game’s Telugu name' }
      ],
      kid: 'Sending someone’s counter all the way back to the beginning when they were two ' +
           'squares from home.',
      origin: 'This is an old game, played across much of southern India, with the board still ' +
              'drawn on cloth in many houses. We will not put a date on it without a source.',
      origin_pending: true
    },

    {
      id: 'pallanguzhi',
      name: 'Pallanguzhi',
      script: 'பல்லாங்குழி',
      roman: 'pallanguzhi',
      alsoCalled: [
        'பல்லாங்குழி Pallanguzhi — Tamil',
        'ಅಳಗುಳಿ ಮನೆ Aliguli Mane — Kannada',
        'వామన గుంటలు Vamana Guntalu — Telugu',
        'പല്ലാങ്കുഴി Pallankuzhi — Malayalam'
      ],
      region: ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Kerala'],
      players: '2',
      age: '7+',
      where: 'inside',
      needs: ['a wooden pallanguzhi board — or an egg carton with the lid cut off, or fourteen small pits scooped in sand', 'about seventy small counters — tamarind seeds, dried beans, shells or beads'],
      setup: 'Two rows of seven pits, facing each other across a board. You own the row nearest ' +
             'you. Five counters go into each of the fourteen pits, and then you sow them round ' +
             'the board one at a time, picking up and carrying on, until the moment you have to ' +
             'stop. An egg carton works perfectly.',
      rules: [
        'Put five counters into every one of the fourteen pits. The seven nearest you are yours.',
        'On your turn, pick up all the counters from any one pit on your own side.',
        'Drop them one at a time into each following pit, going anticlockwise round the whole board.',
        'When your hand is empty, pick up everything in the very next pit and carry on sowing.',
        'If the next pit is empty, you stop — and you take for yourself all the counters in the pit after that one.',
        'Any time a pit comes to hold exactly four counters, whoever put the fourth one in takes all four and keeps them.',
        'When you have to stop, the turn passes to the other player.'
      ],
      win: 'When the counters run out, count what each of you captured. Most counters wins. Then ' +
           'refill for the next round with only what you have — so a big win makes the next round ' +
           'easier, and the game builds across rounds.',
      safe: [
        'Seeds and beads are choke-sized. Keep this one up on a table if there is a small child about.'
      ],
      variants: [
        'In many families the capturing number is different, and in many the second round starts with the loser leaving pits empty as a handicap. Play the version whoever taught you plays — that is the correct one.',
        'In many families the direction of sowing is the other way round. Settle it in the first ten seconds and never mention it again.'
      ],
      words: [
        { term: 'குழி', roman: 'kuzhi', en: 'pit — Tamil' },
        { term: 'காய்', roman: 'kaai', en: 'the seeds you sow — Tamil' },
        { term: 'என் முறை', roman: 'en murai', en: 'my turn — Tamil' },
        { term: 'ஆட்டம்', roman: 'aattam', en: 'game — Tamil' }
      ],
      kid: 'Your hands do the counting for you. After three rounds you can see four coming two ' +
           'moves before it happens.',
      origin: 'This is an old game, played across much of southern India, and boards are still ' +
              'made and used today. We are not going to put a date on it without a source.',
      origin_pending: true
    },

    {
      id: 'aadu-puli-aattam',
      name: 'Aadu Puli Aattam (Goats and Tigers)',
      script: 'ஆடு புலி ஆட்டம்',
      roman: 'aadu puli aattam',
      alsoCalled: [
        'ஆடு புலி ஆட்டம் Aadu Puli Aattam — Tamil',
        'పులి మేక Puli Meka — Telugu',
        'ಆಡು ಹುಲಿ ಆಟ Aadu Huli Aata — Kannada',
        'പുലി ആട്ടം Puli Aattam — Malayalam'
      ],
      region: ['Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Karnataka', 'Kerala'],
      players: '2',
      age: '7+',
      where: 'inside',
      needs: ['the board — a triangle with lines drawn inside it, on paper or scratched into the ground', 'three counters for the tigers and fifteen for the goats — two kinds of pebble, or coins and buttons'],
      setup: 'Two players, and the two sides play completely differently. One has three tigers ' +
             'that can jump and eat. The other has fifteen goats that can only shuffle and ' +
             'surround. Draw a big triangle with lines across it and a line down the middle, and ' +
             'play on the points where the lines meet.',
      rules: [
        'The tiger player starts with their three tigers already on the board. The goat player holds all fifteen goats in their hand.',
        'On the goat player’s turn, while they still have goats in hand, they must place one onto an empty point. They cannot move a goat until every goat is placed.',
        'A tiger moves one point along a line to an empty point.',
        'A tiger may also jump straight over a single goat, along a line, and land on the empty point beyond it. That goat is eaten and taken off.',
        'A goat moves one point along a line to an empty point. Goats never jump anything.',
        'Tigers are trying to eat goats. Goats are trying to block every tiger until no tiger can move at all.'
      ],
      win: 'The tigers win if they eat enough goats that they can never be trapped. The goats ' +
           'win the moment no tiger has a legal move. Then swap sides — the two jobs feel like ' +
           'two different games, and most people are much better at one of them.',
      safe: [
        'Nothing at all can go wrong here. Sitting on hot concrete is the only genuine risk.'
      ],
      variants: [
        'In many places the board is a different shape and the number of goats is different too. If two players learnt different boards, draw both and pick one before you start.',
        'A very similar tigers-and-goats game is played in Nepal under a different name, so if a friend says they already know this, they may know a slightly different version of it.'
      ],
      words: [
        { term: 'ஆடு', roman: 'aadu', en: 'goat — Tamil' },
        { term: 'புலி', roman: 'puli', en: 'tiger — Tamil' },
        { term: 'ஆட்டம்', roman: 'aattam', en: 'game — Tamil' },
        { term: 'என் முறை', roman: 'en murai', en: 'my turn — Tamil' }
      ],
      kid: 'Three tigers against fifteen goats sounds unfair until you play the goats and ' +
           'realise you are the ones closing the trap.',
      origin: 'This is an old game, played across much of southern India. We will not claim a ' +
              'date or an origin for it without a source that can be checked.',
      origin_pending: true
    },

    {
      id: 'moksha-patam',
      name: 'Moksha Patam (Snakes and Ladders)',
      script: 'मोक्ष पटम्',
      roman: 'moksha patam',
      alsoCalled: [
        'ज्ञान चौपड़ Gyan Chaupar — Hindi',
        'மோட்ச பரமபதம் Paramapadam — Tamil',
        'వైకుంఠపాళి Vaikuntapali — Telugu',
        'Snakes and Ladders — the name it travels under now',
        'Chutes and Ladders'
      ],
      region: ['boards survive from several regions and several traditions of India'],
      players: '3+',
      age: '5+',
      where: 'inside',
      needs: ['a board — the ordinary Snakes and Ladders board works', 'one die', 'a counter each'],
      setup: 'You already know how to play this. What is worth knowing is that the board it came ' +
             'from was not blank: on the older Indian boards every ladder and every snake is ' +
             'labelled, so each square you climb and each one you fall down means something. If ' +
             'you can find a labelled board, play on that one instead.',
      rules: [
        'Everybody starts off the board, before square one.',
        'Take turns rolling one die and moving that many squares along the numbered path.',
        'Land at the foot of a ladder and you climb to its top.',
        'Land on a snake’s head and you slide down to its tail.',
        'On a labelled board, read out loud what each snake and each ladder is named as you take it. That is what the board is for.',
        'You must land exactly on the final square. Roll too high and you do not move at all.'
      ],
      win: 'First counter to land exactly on the last square.',
      safe: [
        'Nothing physical. Keep the die and counters off the floor if there is a toddler around.'
      ],
      variants: [
        'In many houses there is a rule that rolling a six lets you go again, and in many others there is not. Ancient it is not — house rules are house rules. Agree yours first.',
        'In many places the board has 72 squares rather than 100, and the numbering runs differently.'
      ],
      words: [
        { term: 'साँप', roman: 'saanp', en: 'snake' },
        { term: 'सीढ़ी', roman: 'seedhi', en: 'ladder' },
        { term: 'पासा', roman: 'paasa', en: 'die' },
        { term: 'मेरी बारी', roman: 'meri bari', en: 'my turn' }
      ],
      kid: 'The board your friends have at home is the plain version. Yours has names on every ' +
           'snake and every ladder, and you can tell them where it came from.',
      origin: 'The board is an Indian one, known as gyan chaupar and as moksha patam. Surviving ' +
              'painted boards have been studied by art historians, who describe boards of 72, 84 ' +
              'and 100 squares from more than one of India’s traditions. We are deliberately not ' +
              'giving a date here: the study is of the boards that survive, which is not the same ' +
              'thing as knowing when the game began.',
      origin_pending: false,
      source: 'Andrew Topsfield, “The Indian Game of Snakes and Ladders”, Artibus Asiae 46:3 ' +
              '(1985), pp. 203–226. doi:10.2307/3250203'
    },

    {
      id: 'raja-mantri',
      name: 'Raja Mantri Chor Sipahi',
      script: 'राजा मंत्री चोर सिपाही',
      roman: 'raja mantri chor sipahi',
      alsoCalled: [
        'राजा मंत्री चोर सिपाही Raja Mantri Chor Sipahi — Hindi',
        'রাজা মন্ত্রী চোর সিপাহী Raja Mantri Chor Sipahi — Bengali',
        'Chor-Police',
        'Chor-Sipahi'
      ],
      region: ['played in houses, trains and classrooms across northern, eastern and western India'],
      players: '3+',
      age: '6+',
      where: 'inside',
      needs: ['four slips of paper and something to write with'],
      setup: 'Four players, exactly. Four folded slips of paper with four roles on them. You ' +
             'take one each without looking, and then one person has to work out from faces ' +
             'alone which of the other two is the thief. It is the best game in the world for a ' +
             'delayed flight.',
      rules: [
        'Write one word on each of four slips: Raja, Mantri, Sipahi, Chor. Write the points on them too — Raja 1000, Mantri 800, Sipahi 500, Chor 0.',
        'Fold them all the same way, shuffle them, and each player takes one without showing anyone.',
        'The Raja opens theirs and says so out loud. Everyone else keeps quiet.',
        'The Raja asks who the Sipahi is. The Sipahi owns up.',
        'The Sipahi now has to guess which of the other two players is the Chor — from their face, and nothing else.',
        'Guess right, and the Sipahi keeps their 500 and the Chor gets nothing.',
        'Guess wrong, and the Sipahi and the Chor swap points. The thief got away with it.',
        'Fold, shuffle, deal again.'
      ],
      win: 'Play ten rounds and add up everybody’s points. Highest total wins.',
      safe: [
        'Nothing physical at all. The only rule that matters is that nobody peeks at a fold, and that is exactly the rule that makes it a game.'
      ],
      variants: [
        'In many families the Mantri does the guessing instead of the Sipahi, and the points shift accordingly.',
        'In many families the roles are drawn by throwing the folded slips up in the air and grabbing one, which is louder and much better.'
      ],
      words: [
        { term: 'राजा', roman: 'raja', en: 'king' },
        { term: 'मंत्री', roman: 'mantri', en: 'minister' },
        { term: 'चोर', roman: 'chor', en: 'thief' },
        { term: 'सिपाही', roman: 'sipahi', en: 'soldier' },
        { term: 'पहचान', roman: 'pehchaan', en: 'identify — pick them out' }
      ],
      kid: 'You have to keep a straight face while somebody stares directly at you and decides ' +
           'whether you are the thief.'
    },

    {
      id: 'chidiya-ud',
      name: 'Chidiya Ud',
      script: 'चिड़िया उड़',
      roman: 'chidiya ud',
      alsoCalled: [
        'चिड़िया उड़ Chidiya Ud — Hindi',
        'चिड़िया उड़ कौवा उड़ Chidiya Ud Kauwa Ud — the full playground chant',
        'Bird Flies'
      ],
      region: ['played in classrooms, cars and living rooms across northern and central India'],
      players: '3+',
      age: '4+',
      where: 'inside',
      needs: ['nothing', 'a table — or just your own knee'],
      setup: 'The whole game is one finger. Everyone puts one finger on the table. Somebody ' +
             'calls out things and adds "ud" — flies. If it flies, your finger goes up. If it ' +
             'does not, it stays down. Then the caller starts going fast, and lying with their ' +
             'own finger.',
      rules: [
        'Everybody puts one finger on the table, or on their knee.',
        'One player is the caller.',
        'The caller names a thing and adds ud — flies. "Chidiya ud." "Kauwa ud."',
        'If the thing really does fly, everybody lifts their finger.',
        'If it does not — "Haathi ud", elephant flies — everybody keeps their finger down.',
        'Lift when you should not have, or fail to lift when you should, and you are out.',
        'The caller goes faster and faster, and lifts their own finger every single time, to trick you.'
      ],
      win: 'The last finger still in the game. That player becomes the caller.',
      safe: [
        'It is a finger on a table. There is nothing here that can hurt anybody.'
      ],
      variants: [
        'In many places the caller also names things that do not exist at all, and you are out for reacting to a made-up word.',
        'In many places being out means you become a second caller, so the pace doubles and the last two players have no chance.'
      ],
      words: [
        { term: 'चिड़िया', roman: 'chidiya', en: 'sparrow, small bird' },
        { term: 'उड़', roman: 'ud', en: 'flies' },
        { term: 'कौवा', roman: 'kauwa', en: 'crow' },
        { term: 'हाथी', roman: 'haathi', en: 'elephant' },
        { term: 'आउट', roman: 'out', en: 'out' }
      ],
      kid: 'It is a Hindi vocabulary drill wearing a disguise. You will pick up twenty animal ' +
           'names in a week and never once feel like you were learning anything.'
    }
  ],

  /* ─────────────────────────────────────────────────────────────────────────
     ADAPT — the diaspora reality.
     A driveway, not a gully. Four kids, not fifteen. A park with rules on a sign.
     Six months of weather that makes outside a negotiation. Without these notes this
     file is a nice list; with them it is something a child plays on Saturday.
     ───────────────────────────────────────────────────────────────────────── */
  adapt: [
    {
      gameId: 'kho-kho',
      note: 'Proper kho-kho is nine a side. It works fine with six: three sit in the line, three ' +
            'run, and one of the sitters is the free chaser. Four sitters is even better if you ' +
            'have eight. What you cannot do is play it with two, so this is the one to save for ' +
            'when cousins visit or for a birthday — and it is the best possible use of twelve ' +
            'children in a garden who have started to get bored.'
    },
    {
      gameId: 'kabaddi',
      note: 'You are unlikely to have sand or mats, and you should not play the contact version ' +
            'on a lawn full of hidden sprinkler heads. Play touch-kabaddi: the raider still ' +
            'chants on one breath, defenders may block and dodge but may not hold at all, and a ' +
            'raider is out only if the chant stops before they cross back. It keeps the entire ' +
            'point of the game — the breath, the nerve — and removes the part that needs a mat. ' +
            'Four a side is plenty.'
    },
    {
      gameId: 'gilli-danda',
      note: 'Do not play this in a garden, a driveway, a cul-de-sac or any park with people ' +
            'walking through. It needs a big empty field and it needs everybody standing behind ' +
            'the batter, and if you cannot have both, play something else today. If you want the ' +
            'feel of it in a smaller space, use a foam gilli and a plastic bat and score in bat ' +
            'lengths — it is a different game, but it is safe, and the measuring-in-bat-lengths ' +
            'part is the bit children actually love.'
    },
    {
      gameId: 'lagori',
      note: 'This is the driveway game. Stack the seven stones against the base of a garage door ' +
            'or a fence so there is a backstop and the ball does not end up in the road. Four ' +
            'players works: two throw, two guard. Indoors in winter, swap the stones for plastic ' +
            'cups and the tennis ball for a rolled-up pair of socks, and it plays perfectly in a ' +
            'hallway.'
    },
    {
      gameId: 'stapoo',
      note: 'The single best game on this list for a diaspora childhood, because it needs one ' +
            'child, one piece of chalk, and about two metres of driveway. It survives having no ' +
            'friends available, which almost nothing else here does. For winter, lay the grid out ' +
            'in painter’s tape on a hallway or basement floor — it peels off cleanly and the game ' +
            'is exactly the same in socks.'
    },
    {
      gameId: 'chhupan-chhupai',
      note: 'A public park is the wrong shape for this: too big, too open, and other people’s ' +
            'children get folded in. Shrink it hard. Pick four visible landmarks — that tree, ' +
            'that bench, that bin, that path — and say out loud that the boundary is between ' +
            'them. Then the game is dense enough to be exciting, and an adult can see the whole ' +
            'thing from one spot, which is what makes it allowed at all.'
    },
    {
      gameId: 'vish-amrit',
      note: 'Works down to four: one poisoner, three runners, and an area about the size of two ' +
            'parked cars. Any smaller group than that and the rescue stops being a decision, ' +
            'which is the whole game. If it is only three of you, mark the area even smaller ' +
            'rather than dropping to one runner — a tight space with two runners is tense; a big ' +
            'space with one is just running.'
    },
    {
      gameId: 'rumaal-chor',
      note: 'Needs a circle, and a circle needs about five people — so this is the game for the ' +
            'end of a birthday party, when everybody is over-excited indoors and the parents ' +
            'want them sitting down. It plays perfectly well on a rug, walking rather than ' +
            'running, and it will empty a room of energy in fifteen minutes.'
    },
    {
      gameId: 'poshampa',
      note: 'The arch needs two people and the tug of war needs the rest, so under six it does ' +
            'not work. The fix is obvious and nobody thinks of it: the two arch-holders can be ' +
            'adults. A parent and an uncle making the arch, four children walking through, is the ' +
            'exact shape this game takes in most houses anyway — and it is the one game here ' +
            'where a grandparent on a chair can genuinely join in.'
    },
    {
      gameId: 'pallanguzhi',
      note: 'You will not have a board. An egg carton with the lid cut off is fourteen pits in ' +
            'two rows of seven, which is precisely the board. Dried kidney beans or chickpeas ' +
            'from the kitchen are the counters. Total cost, nothing, and it goes in a bag for a ' +
            'flight — this is the best long-haul game in the file, and a grandparent will know ' +
            'how to play it without being taught.'
    },
    {
      gameId: 'chowka-bara',
      note: 'Cowrie shells are hard to come by outside India. Four coins work exactly the same ' +
            'way — count heads instead of mouths — and so do four halved peanut shells or four ' +
            'bottle caps. Draw the 5×5 grid once onto an old pillowcase with a marker and it ' +
            'folds into a drawer forever, which is roughly what the cloth boards in Indian houses ' +
            'are anyway.'
    },
    {
      gameId: 'patang',
      note: 'The Indian version of this happens on a roof in a crowd, and that version is simply ' +
            'not available. What is available is a big open playing field on a windy afternoon in ' +
            'March, plain string, and no cutting. Check the whole field for power lines before ' +
            'the kite goes up, not after. And if the family day is Uttarayan or Sankranti, fly it ' +
            'on that day even if the weather is wrong — the point is the date, not the wind.'
    }
  ],

  /* ─────────────────────────────────────────────────────────────────────────
     TAKEOUT — the "take it outside" framing.

     This is the only screen in the product whose success condition is that the app closes.
     So the copy hands over a game and stops. No points, no streak, no timer, no badge, no
     photo, no "did you play?" the next morning. Any of those would move the reward back
     inside the app, and then we have built the thing we said we were against.
     ───────────────────────────────────────────────────────────────────────── */
  takeout: {
    title: 'Take it outside',
    sub: 'These games were never played on a screen. Read one, then put this down.',

    /* What the app says as it lets go. Short, because a child is already halfway to the door. */
    handoff: [
      'That is the whole game. You know enough to play it now.',
      'You do not need us for the next bit.',
      'Take the rules with you if you like — they work without the internet, and they work with ' +
      'the phone in a pocket.',
      'If somebody argues about a rule, they are probably right too. Pick one version and play it.',
      'Come back when it rains.'
    ],

    /* What we deliberately do NOT do, stated in the product so it cannot quietly drift back in. */
    never: [
      'No points for going outside.',
      'No streak, no timer, no daily goal.',
      'No photo, no upload, no proof that you played.',
      'No badge waiting for you when you come back in.',
      'We do not ask, afterwards, whether you did it.'
    ],

    /* The reason, in one line, for anyone who wonders why the screen goes quiet here. */
    why: 'The moment we score a child for playing outside, the reward is back inside the app — ' +
         'and this is the one part of the product built to be left.',

    /* Six lines for the parent. */
    parent: [
      'Everything here needs nothing, or needs a tennis ball and a piece of chalk. If a game ' +
      'needs shopping, we have written down what you already own that will do instead.',
      'Nineteen of these games work with four children. Seven work with two. Three work with one ' +
      'child and a driveway — start there, because that is the ordinary Tuesday.',
      'The safety notes say plainly what can go wrong and then stop. Gilli-danda is the one to ' +
      'read properly; kite string is the other. The rest are ordinary running-about risks.',
      'The three to five words in each game are the point of it. Nobody learns vocabulary from ' +
      'a screen the way they learn a word they had to shout across a park.',
      'There is no correct version of any of these. If yours was different, yours is right — ' +
      'tell them how you played it, and let them play your version instead of ours.',
      'This part of the app does not track anything and will not tell you whether they played. ' +
      'That is deliberate. If you want to know, ask them at dinner.'
    ],

    /* The one line the pillar exists to earn. */
    promise: 'Screen time out, outside time in — and the app takes no credit for it.'
  }
};
