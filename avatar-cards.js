/* ============================================================
   AVATAR-CARDS.js — the collectible-card data layer for every avatar in
   Bizzing India, modelled on Bizzing Bee's avatar-cards.js. Data only: the
   shell owns all rendering, so there is no HTML anywhere in this file.

   ================= WHO MAY CARRY A NUMBER =================
   This is the rule this file exists to hold, and it has four answers. Every
   card resolves to exactly one `kind`:

     character — INVENTED. The Panchatantra animals, the anonymous darbar
                 types (a courtier, the palace guard, the royal elephant),
                 the three mascots and the two emblems (rocket, unicorn).
                 THESE, AND ONLY THESE, GET THE FOUR STATS: himmat 🛡️
                 (courage), gyaan 📖 (wisdom), chatur ⚡ (wit), dil 💛
                 (heart), each 28–99, derived deterministically from a stable
                 hash of the id, exactly in the Bee's idiom — no per-avatar
                 authoring, identical on every device on every day. Numbers
                 are fun on a jackal.

     real      — A REAL PERSON: everyone in 'great', 'khel', 'naya' and
                 'vigyan', plus Akbar, Birbal and Tansen in the darbar. NO
                 NUMBERS, EVER. Grading a person out of 99 is the thing this
                 product must not do. Where the stats were, they carry
                 `achievements` — two to four short, checkable lines of what
                 they actually DID — and, where one is genuinely famous and
                 documented, a `quote` with its `where`.

     epic      — THE EPIC CAST (ramayana / mahabharata). Also NO NUMBERS.
                 These are revered figures in a living tradition, and docs/05
                 forbids treating anything sacred as collectible loot;
                 scoring Sita or Karna out of 99 is the same mistake in a
                 different coat. They carry their character line (IND_EPIC_CAST's
                 own desc) and a fact about the epic instead.

     sacred    — the 'devas' pack (ganesha … harmandir, including the Buddha
                 and Mahavira, the Khanda and Harmandir Sahib). stats: null,
                 sacred: true, and a card face that says 'beyond measure' — a
                 deity, a Guru's emblem or a tirthankara is never a number.
                 They also carry no gamey title: their traditional address
                 form, or none at all.

   RARITY IS PAUSED app-wide (see IND_RARITY_PAUSED in avatars.js). While it
   is paused there is ONE tier for everyone who still has stats at all:
   { base: 66, spread: 20 } — no avatar is Rare or Legendary here.

   Every card also carries a title in its pack's register (PACK_TITLE below),
   a one-line in-world lore, and one REAL, checkable, kid-friendly fact.

   ================= THE QUOTE RULE (docs/05 §6.4, hard) =================
   A `quote` is included ONLY where the wording is genuinely famous and
   documented, and `where` always names the source or the setting ('from his
   memoir Wings of Fire', 'said in the Constituent Assembly, 25 November
   1949'). If the source cannot be named, THERE IS NO QUOTE — absence is
   honest and expected, and roughly four cards in five here carry none.
   Living people get a quote only where the wording is unambiguously on the
   record; in practice none of them do. Never invent, never paraphrase into
   quotation marks, never attribute a floating internet line.

   WHERE THE FACTS COME FROM (docs/05 is binding here)
     • devas — a tradition-fact told from the inside, as families keep it:
       warm, never comparative, never "myth-as-false", no invented scripture.
     • panch — real animal facts, Bee-style.
     • darbar — documented Mughal-court facts (the Ain-i-Akbari, the
       Razmnama, Fatehpur Sikri), matching app/data-itihaas.js.
     • great / khel / naya / vigyan — real people. Every fact AND every
       achievement line is distilled from the sourced records already
       gathered in this app's own stories (data-stories-modern.js,
       data-stories-vigyan.js, data-itihaas.js, data-neeti.js,
       data-states.js), so the card and the story can never disagree.
     • ramayana / mahabharata — a fact about the epic or its living
       tradition; attributable standard knowledge, nothing invented. Lore
       for the epic cast is REUSED verbatim from IND_EPIC_CAST (see
       data-epic-cast.js) rather than re-written — resolved at call time so
       the two files cannot drift.
     • mascots (gattu, mithu, vismriti) — playful in-world facts consistent
       with their roles. Vismriti is a sad grey mist, never cruel (docs/05).

   All strings are NFC. Loads after avatars.js (and alongside
   data-epic-cast.js); all globals are read lazily at call time.

   Public API:
     window.IND_AV_CARD(id) -> { id, name, packId, packLabel, title, lore,
                                 fact, kind, badge, sacred, stats, overall,
                                 achievements, quote } | null
       kind          'character' | 'real' | 'epic' | 'sacred'
       badge         the docs/05 badge glyph+word this card renders under
       stats/overall NON-NULL FOR 'character' ONLY — null for everyone else
       achievements  [] except on 'real'
       quote         { text, where } or null — see the quote rule above
     window.IND_AV_STAT_KEYS  — [key, emoji, label] rows, in render order,
                                so the shell and the data agree.
     window.IND_AV_REAL_PEOPLE — the real-person id list, exported so the
                                verifier can assert the no-numbers rule from
                                outside this file.
   ============================================================ */
(function () {
  'use strict';

  function PACKS() { return window.IND_AVATAR_PACKS || []; }
  function NAMES() { return window.IND_AVATAR_NAMES || {}; }
  function CAST()  { return window.IND_EPIC_CAST || {}; }

  /* stable 32-bit string hash — same idiom as the Bee's */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0); }
  function rnd(seed) { var x = Math.sin(seed) * 10000; return x - Math.floor(x); }

  /* ONE tier for everyone — rarity is paused app-wide (IND_RARITY_PAUSED in
     avatars.js; the docs/05 concern about grading sacred figures as loot,
     now acted on). When rarity un-pauses, this is the single seam to widen. */
  var TIER = { base: 66, spread: 20 };

  var STAT_KEYS = [['himmat', '🛡️', 'Himmat'], ['gyaan', '📖', 'Gyaan'], ['chatur', '⚡', 'Chatur'], ['dil', '💛', 'Dil']];
  window.IND_AV_STAT_KEYS = STAT_KEYS;

  function statsFor(id) {
    var out = {};
    STAT_KEYS.forEach(function (k, i) {
      var v = TIER.base + Math.round((rnd(hash(id + ':' + k[0]) % 100000 + i) * 2 - 1) * TIER.spread);
      out[k[0]] = Math.max(28, Math.min(99, v));
    });
    return out;
  }

  /* pack → title suffix, in each pack's register. The devas pack is absent
     on purpose: sacred figures get no gamey title — their traditional
     address form or none, and this file chooses none. */
  var PACK_TITLE = {
    panch:       'of the Banyan Court',
    darbar:      'of Akbar’s Darbar',
    great:       'of the Great Indians',
    khel:        'of the Blue Turf',
    naya:        'of the First Brick',
    vigyan:      'of the Restless Question',
    /* uniform per epic — no epithets, no title that ranks one character
       above another (the avatars.js naming rule holds here too) */
    ramayana:    'of the Ramayana',
    mahabharata: 'of the Mahabharata'
  };

  /* The three companions live outside the picker packs (avatars.js keys them
     only in IND_AVATAR_RARITY), so their names and roles are carried here.
     Roles per CONCEPT.md: Gattu remembers, Mithu tells, Vismriti is the mist. */
  var MASCOTS = {
    gattu:    { name: 'Gattu',    title: 'the Memory Keeper' },
    mithu:    { name: 'Mithu',    title: 'the Storyteller' },
    vismriti: { name: 'Vismriti', title: 'the Forgetting' }
  };
  var MASCOT_PACK = { id: 'saathi', label: 'The Companions' };

  /* ---------------------------------------------------------------- LOREDB
     Per-avatar { lore, fact }. lore = one in-world line; fact = one real,
     checkable, kid-friendly fact (sourcing per the header). Epic-cast ids —
     and rama / hanuman in the devas pack — carry no lore key here: their
     lore is IND_EPIC_CAST's hand-written desc, reused verbatim at call time.
     Krishna is the one deliberate exception: his cast desc is Mahabharata-
     specific, and his devas card introduces the whole of him. */
  var LOREDB = {

    /* ---- DEVAS — presented from the inside; facts are tradition-facts ---- */
    ganesha: { lore: 'The remover of obstacles, honoured first at every beginning.',
      fact: 'In many homes Ganesha is invoked before any new beginning — a journey, a wedding, the first page of a new notebook.' },
    krishna: { lore: 'The butter-loving child of Gokul, the flute-player of Vrindavan, the charioteer who spoke the Gita.',
      fact: 'On Janmashtami, Krishna’s birthday, teams in Maharashtra build human pyramids to reach a dahi handi — a pot of curd hung high, just out of a butter-thief’s reach.' },
    hanuman: { /* lore: IND_EPIC_CAST desc, reused verbatim */
      fact: 'The Hanuman Chalisa — forty verses in his praise — is among the most recited prayers in the world; many families sing it on Tuesdays and Saturdays.' },
    durga: { lore: 'The mother who rides the lion, fierce only for the protection of the good.',
      fact: 'In Bengal, Durga Puja turns whole cities into open-air art — UNESCO lists the Kolkata festival among humanity’s cultural treasures.' },
    saraswati: { lore: 'The giver of learning and music, veena in hand, white as the first page.',
      fact: 'On Vasant Panchami many families dress in yellow and place books and instruments before Saraswati — a day treasured for beginnings in learning and music.' },
    shiva: { lore: 'The still one of Kailash, whose meditation holds the mountains quiet.',
      fact: 'On Mahashivaratri many devotees keep a night-long vigil — and Shiva as Nataraja, lord of the dance, is one of the most admired bronze forms in all of Indian art.' },
    rama: { /* lore: IND_EPIC_CAST desc, reused verbatim */
      fact: 'For many families the lamps of Diwali recall Rama’s return to Ayodhya, and Ram Navami in spring marks his birth — ask your family how they keep the day.' },
    lakshmi: { lore: 'The goddess of good fortune, who visits homes that light a lamp for her.',
      fact: 'On Diwali night many households welcome Lakshmi with lamps in every window and rangoli at the door — light set out so that blessing can find the way in.' },
    buddha: { lore: 'The prince who left a palace to understand suffering, and sat beneath a tree until he did.',
      fact: 'Buddha Purnima, the full moon of Vaishakha, is kept in many traditions as the day of the Buddha’s birth, his awakening and his passing — one gentle day for all three.' },
    mahavira: { lore: 'The twenty-fourth tirthankara, who conquered himself and harmed no living thing.',
      fact: 'Mahavira taught ahimsa — harm to no living being — and many Jain families keep it daily, choosing food, work and even words with care.' },
    khanda: { lore: 'The emblem of the Sikh faith — one God, and the courage to stand for what is right.',
      fact: 'The Khanda appears on the Nishan Sahib, the flag that flies above every gurdwara — where you see it, the langar kitchen inside is open to absolutely everyone.' },
    harmandir: { lore: 'The Harmandir Sahib at Amritsar, gold above the water, with a door open on every side.',
      fact: 'The Harmandir Sahib’s langar feeds tens of thousands of people every single day, free — everyone seated together on the floor, whoever they are.' },

    /* ---- PANCHATANTRA — real animal facts, Bee-style ---- */
    pt_lion: { lore: 'Pingalaka, king of the banyan court, whose word makes the forest hold its breath.',
      fact: 'Asiatic lions survive in the wild in only one place on Earth — the Gir forest of Gujarat.' },
    pt_jackal: { lore: 'Damanaka, the clever counsellor, who knows a little about everyone’s business.',
      fact: 'Golden jackals live in devoted pairs — a pair hunts together, shares food and raises its pups side by side.' },
    pt_bull: { lore: 'Sanjivaka, the gentle giant, stronger than he ever wants to prove.',
      fact: 'A bull’s eyes sit on the sides of its head, so it can see almost all the way around itself without turning.' },
    pt_crow: { lore: 'Laghupatanaka, who sees everything from above and forgets none of it.',
      fact: 'Crows can recognise human faces — and remember for years which people were kind and which were not.' },
    pt_tortoise: { lore: 'Kambugriva, slow of foot and quick of tongue — sometimes too quick.',
      fact: 'A tortoise can never leave its shell: the shell is its skeleton, with the ribs and backbone built right in.' },
    pt_mouse: { lore: 'Hiranyaka, the small friend who gnaws through what strength cannot break.',
      fact: 'A mouse can squeeze through a gap about the width of a pencil — if its head fits, the rest will follow.' },
    pt_deer: { lore: 'Chitranga, the swift one, who trusts his friends more than his own speed.',
      fact: 'In Indian forests, spotted deer and langur monkeys team up — the langurs drop fruit from the trees and call the alarm when a tiger is near.' },
    pt_crocodile: { lore: 'The crocodile of the river, whose patience is longer than the monsoon.',
      fact: 'A mother crocodile carries her new hatchlings to the water inside her huge jaws — as gently as hands.' },
    pt_monkey: { lore: 'The monkey of the rose-apple tree, too quick-witted to stay caught.',
      fact: 'Many monkeys have stretchy cheek pouches and can stuff them with nearly a stomach’s worth of food to eat somewhere safer.' },
    pt_rabbit: { lore: 'The clever rabbit, who once showed a lion its own reflection.',
      fact: 'A hare’s huge ears are not just for listening — they let heat escape, working like radiators to keep it cool.' },
    pt_heron: { lore: 'The heron of the lotus pond, standing so still the fish forget him.',
      fact: 'The Indian pond heron looks like a dull brown lump — until it flies, and flashes wings of brilliant white.' },
    pt_elephant: { lore: 'The elephant of the old stories, who never forgets a kindness or a promise.',
      fact: 'Elephants comfort upset friends with gentle trunk touches and low rumbles — and they remember other elephants for decades.' },

    /* ---- AKBAR'S DARBAR — documented Mughal-court facts ---- */
    akbar: { lore: 'The emperor who asks one impossible question a day, and listens hard to every answer.',
      fact: 'Akbar never learned to read — his books were read aloud to him — yet he built one of the great libraries of the age and had scholars of many faiths debate before him.' },
    birbal: { lore: 'The quickest wit in the empire, one step ahead of the question.',
      fact: 'Birbal was a real courtier and poet in Akbar’s inner circle — the famous stories of his wit are folk tales still told across India, and some of them may even be true.' },
    tansen: { lore: 'The musician whose evening raga makes the whole court fall silent.',
      fact: 'Ragas attributed by tradition to Tansen — like Miyan ki Malhar, the raga of the rains — are still sung by musicians today, more than four centuries on.' },
    courtier: { lore: 'A sharp-eyed courtier of the darbar, fluent in three languages and every rumour.',
      fact: 'Akbar kept a translation bureau at court — its scholars rendered the Mahabharata into Persian as the richly painted Razmnama, the Book of War.' },
    guard: { lore: 'The palace guard who has seen every visitor, and bows only to the truth.',
      fact: 'Akbar built an entire new capital city, Fatehpur Sikri, and later moved the court away — the red sandstone city still stands, a World Heritage Site you can walk through today.' },
    royal_elephant: { lore: 'The emperor’s own elephant, wearing the jhool of honour and the patience of mountains.',
      fact: 'The Ain-i-Akbari, the great record of Akbar’s court, lists the imperial elephants by name and rank — each with its own keepers and its own food allowance.' },

    /* ---- GREAT INDIANS — real people; facts match the app's Itihaas records ---- */
    ashoka: { lore: 'The emperor who won his greatest war and never forgave himself for it.',
      fact: 'Ashoka had his change of heart carved into rocks and pillars across the land — his edicts are still there, and you can still go and read them.' },
    chanakya: { lore: 'The teacher who planned an empire from a classroom.',
      fact: 'Tradition ties Chanakya’s name to the Arthashastra — a detailed manual on running a state: taxes, roads, courts, spies and all.' },
    shivaji: { lore: 'The mountain king, who moved faster than an empire could turn.',
      fact: 'Shivaji built his state on mountain forts and fast-moving cavalry — taking forts the hard way, up the cliffside nobody was watching.' },
    lakshmibai: { lore: 'The queen of Jhansi, who rode out rather than hand over her kingdom.',
      fact: 'Rani Lakshmibai rode into battle in 1857 — and even the general sent against her wrote of her courage.' },
    gandhi: { lore: 'The man who found how unarmed people could be stronger than an empire.',
      fact: 'In 1930 Gandhi walked from Sabarmati Ashram to the sea at Dandi to make a handful of salt — refusing an empire openly, politely, and together.' },
    ambedkar: { lore: 'Made to sit apart from his classmates as a boy; grew up to write the rules of the whole country.',
      fact: 'Ambedkar led the drafting of India’s Constitution — which guaranteed every single adult a vote from the country’s very first election.' },
    bhagat: { lore: 'Twenty-three years old, and unafraid of anything but silence.',
      fact: 'Bhagat Singh gave his life at twenty-three — and is remembered across India even by those who argued with his methods.' },
    kalam: { lore: 'The newspaper boy of Rameswaram, who decided his business would be flight.',
      fact: 'As a boy, Kalam earned his first money catching newspaper bundles flung from a moving train — he grew up to lead India’s rocket programme, and then to be President.' },
    aryabhata: { lore: 'The astronomer who watched the riverbank drift past a boat, and understood the Earth.',
      fact: 'India’s very first satellite, launched in 1975, is named Aryabhata — for the astronomer who wrote, fifteen centuries earlier, that the Earth itself is turning.' },
    tagore: { lore: 'The poet of Bengal, who held classes under the open trees.',
      fact: 'Tagore was the first non-European to win the Nobel Prize in Literature — and he wrote the words of two national anthems, India’s and Bangladesh’s.' },
    kalpana: { lore: 'The girl from Karnal who looked up and simply kept going.',
      fact: 'Kalpana Chawla flew from Karnal to orbit — the first woman of Indian origin in space, who told children the path from dreams to success really does exist.' },
    sarojini: { lore: 'The poet who led marches and went to prison laughing.',
      fact: 'Sarojini Naidu led marches in the freedom struggle and wrote poetry all her life — India remembers her as the Nightingale of India.' },
    savitribai: { lore: 'The teacher who carried a spare sari, and never once stopped walking to school.',
      fact: 'In 1848, at seventeen, Savitribai Phule taught at one of India’s first schools for girls, at Bhide Wada in Pune — today the great university of Pune carries her name.' },
    hansa_mehta: { lore: 'The careful reader from Baroda, who checked the small words for the whole world.',
      fact: 'It was Hansa Mehta who had the Universal Declaration of Human Rights say ‘all human beings’ instead of ‘all men’ — the United Nations itself tells the story.' },

    /* ---- INDIA AT PLAY — facts distilled from data-stories-modern.js ---- */
    dhyanchand: { lore: 'The wizard with the stick, who practised alone by moonlight.',
      fact: 'Dhyan Chand’s India won Olympic hockey gold three times running — 1928, 1932, 1936 — and National Sports Day falls on his birthday, 29 August.' },
    milkha: { lore: 'The Flying Sikh, who told the truth about his hardest race for sixty years.',
      fact: 'Milkha Singh came fourth in the Rome 1960 Olympic 400 metres by about a tenth of a second — and his time stood as India’s national record for almost forty years.' },
    kapil: { lore: 'The Haryana Hurricane, who refused completely to believe the odds.',
      fact: 'Kapil Dev’s 175 not out that saved the 1983 World Cup was never filmed — the TV cameras were on strike that day, so it lives only in the scorebook and in memory.' },
    sachin: { lore: 'The boy with the ball in a sock, who did not want to stop.',
      fact: 'Sachin Tendulkar’s coach balanced a one-rupee coin on the stumps — any bowler who got him out won it. Sachin kept thirteen of those coins all his life.' },
    dhoni: { lore: 'Captain Cool, who reads the loudest moment like a timetable.',
      fact: 'M. S. Dhoni checked tickets at Kharagpur railway station before cricket called — and became the only captain ever to win all three of cricket’s world titles.' },
    kohli: { lore: 'The chase master, whose fire was lit on a scooter ride to practice.',
      fact: 'In November 2023, in Mumbai, Virat Kohli scored his fiftieth one-day international century — passing Sachin Tendulkar’s record while Sachin applauded from the stands.' },
    mithali: { lore: 'The dancer at the crease, perfectly where she chooses to be.',
      fact: 'At the 2017 World Cup a photo went around the world: Mithali Raj, padded up, calmly reading a book while waiting to bat. She retired with 10,868 runs — then the most in women’s cricket, by anyone.' },
    marykom: { lore: 'Magnificent Mary, who trained in secret and won in the open.',
      fact: 'Mary Kom won six boxing world championships — more than any woman in the history of the sport — the first three before her village had a proper ring.' },
    sindhu: { lore: 'The girl who woke before the birds, smash like a door slamming.',
      fact: 'In Basel in 2019, P. V. Sindhu became badminton world champion — the first from India, ever — and she is the first Indian woman with two Olympic medals.' },
    saina: { lore: 'The first shuttle through the door.',
      fact: 'Saina Nehwal’s London 2012 bronze was the first Olympic badminton medal in Indian history — and in 2015 she became the first Indian woman ranked world number one.' },
    neeraj: { lore: 'The spear from Khandra, hanging in the air as if it may never come down.',
      fact: 'Neeraj Chopra’s throw of 87.58 metres in Tokyo won India’s first Olympic gold in athletics — ending a wait of more than a hundred years.' },
    malleswari: { lore: 'Iron from a mud-floored village gym.',
      fact: 'Karnam Malleswari lifted 240 kilograms in Sydney in 2000 — and became the first Indian woman ever to win an Olympic medal, in any sport.' },
    mirabai: { lore: 'The girl who carried the firewood her brother could not lift.',
      fact: 'After her Tokyo silver, Mirabai Chanu went home and threw a thank-you feast for the sand-truck drivers who had given a village girl lifts to training for years.' },
    anand: { lore: 'The Lightning Kid — glance, move, done.',
      fact: 'In 1988 Viswanathan Anand became the first grandmaster in India’s history. Today India has more than eighty — many from his own Chennai.' },
    gukesh: { lore: 'The boy who never stopped looking for one more chance.',
      fact: 'In December 2024, at eighteen, Gukesh became the youngest world chess champion in the history of the classical game.' },
    avani: { lore: 'The stillest person in the room.',
      fact: 'Avani Lekhara won Paralympic shooting gold in Tokyo and again in Paris — the first Indian woman ever to win Paralympic gold, and then the first to do it twice.' },

    /* ---- THE BUILDERS — facts distilled from data-stories-modern.js ---- */
    kurien: { lore: 'The engineer who came for eight months and stayed fifty years.',
      fact: 'India keeps National Milk Day on 26 November — Verghese Kurien’s birthday — because the cooperative movement he built helped make India the world’s largest producer of milk.' },
    n_murthy: { lore: 'The builder of trust, order by kept order.',
      fact: 'Infosys began in 1981 with ten thousand rupees and seven engineers — and for about two years the software company could not even get a computer of its own.' },
    sudha_murty: { lore: 'The student who decided unfair deserved a reply.',
      fact: 'As a student in 1974, Sudha Murty wrote a plain postcard to J. R. D. Tata protesting a ‘lady candidates need not apply’ notice — and became the first woman engineer on the TELCO shop floor.' },
    falguni: { lore: 'The banker who started from zero at nearly fifty.',
      fact: 'Falguni Nayar founded Nykaa at nearly fifty — and nine years later rang the stock-exchange bell in Mumbai for one of India’s most talked-about listings.' },
    kiran_shaw: { lore: 'The brewmaster nobody would hire, who made medicine instead.',
      fact: 'Kiran Mazumdar-Shaw started Biocon in 1978 in the garage of her rented house — within a year it was exporting enzymes to Europe and America, the first Indian company ever to do so.' },
    ela_bhatt: { lore: 'The gentlest person in the room, doing the arithmetic of together.',
      fact: 'In 1974, about four thousand SEWA members put in ten rupees each and founded their own bank — using photographs instead of signatures for members who could not write.' },
    ritesh: { lore: 'The teenager who collected bad hotel rooms on purpose.',
      fact: 'As a teenager, Ritesh Agarwal stayed in about a hundred cheap guest houses and took notes on everything wrong with them — the notebook became OYO.' },
    rocket: { lore: 'From a church yard at Thumba to the Moon’s untouched south.',
      fact: 'India’s first rocket parts travelled by bicycle and bullock cart — and ISRO later reached Mars orbit on its very first attempt, something no nation had ever done.' },
    unicorn: { lore: 'Every big thing was once two people and a parcel.',
      fact: 'India’s first startup unicorn began as an online bookshop run from a flat — in the early days the founders delivered the orders themselves, by scooter.' },

    /* ---- THE SCIENTISTS — facts distilled from data-stories-vigyan.js ---- */
    raman: { lore: 'The passenger at the ship’s rail who checked what every book had already answered.',
      fact: 'India keeps 28 February as National Science Day — the day in 1928 the Raman effect was found. In 1930 Raman became the first person from Asia to win a science Nobel.' },
    ramanujan: { lore: 'The clerk to whom every number was a personal friend.',
      fact: 'Told that taxi number 1729 seemed dull, Ramanujan replied at once that it is the smallest number that is the sum of two cubes in two different ways — it is called the taxicab number to this day.' },
    bhabha: { lore: 'The physicist whose dream was a building full of other people being brilliant.',
      fact: 'In 1944 — before India was even independent — Bhabha wrote the letter proposing a home for fundamental research. The institute it founded, TIFR, still stands by the sea in Mumbai.' },
    sarabhai: { lore: 'The builder of institutions who promised the sky would work for the fields.',
      fact: 'India’s space programme began in a church at Thumba, lent by its parish — the first rocket rose from the fishing village in 1963, and the church is a space museum you can visit today.' },
    jcbose: { lore: 'The professor who built a machine to hear what plants were saying.',
      fact: 'J. C. Bose demonstrated invisible radio waves across a Kolkata hall in 1895 — and refused to patent his inventions, letting even a filed American patent lapse so knowledge could grow unfenced.' },
    janaki_ammal: { lore: 'The botanist who brought her own seat, and rearranged the field around it.',
      fact: 'A magnolia Janaki Ammal raised still flowers at the Royal Horticultural Society’s garden in England — it is named Magnolia kobus ‘Janaki Ammal’ in her honour.' },
    annamani: { lore: 'The measurer of things that cannot be seen — wind, ozone, the weight of air.',
      fact: 'Offered diamond earrings on her eighth birthday, Anna Mani asked for a set of encyclopaedias instead — and grew up to make India build its own weather instruments, about a hundred of them.' },
    tessy: { lore: 'The engineer who teaches fire, second by second, exactly where to go.',
      fact: 'Tessy Thomas was the first woman to lead an Indian missile project — and in 2012 she was programme director for the first flight of Agni-V.' },
    swaminathan: { lore: 'The student who watched a famine and chose the science of growing food.',
      fact: 'The 1968 wheat harvest Swaminathan helped make possible was so enormous that in places schools were closed so the classrooms could store the grain.' },
    salimali: { lore: 'The Birdman of India, who began with one wrong sparrow.',
      fact: 'Salim Ali’s whole life turned on a sparrow with a yellow throat — he walked India counting its birds for decades, and taught the country their names in The Book of Indian Birds.' },

    /* ---- THE RAMAYANA — lore from IND_EPIC_CAST; facts about the epic's
       living tradition, attributable standard knowledge ---- */
    sita: { fact: 'The Ramayana is told in hundreds of versions across Asia — in Thailand, the royal telling, the Ramakien, is the national epic.' },
    lakshmana: { fact: 'The ‘Lakshman rekha’ — a line that must not be crossed — comes from later tellings of the epic, and is an everyday phrase in Hindi to this day.' },
    bharata: { fact: 'In the epic, Bharata sets Rama’s sandals on the throne and rules from beside it — and carved sandals, paduka, are honoured in temples to this day.' },
    dasharatha: { fact: 'At Ramnagar, near Varanasi, the Ramlila plays the whole epic out across the town for a month of nights — UNESCO lists Ramlila among humanity’s cultural treasures.' },
    kaikeyi: { fact: 'Kaikeyi means ‘princess of Kekaya’, a kingdom far to the north-west of the epic’s world — many epic names simply say where a person is from.' },
    ravana: { fact: 'Tradition remembers Ravana as a great scholar and musician — some tellings credit him with a hymn to Shiva that is still sung today.' },
    vibhishana: { fact: 'Vibhishana’s hard honesty gave Hindi a proverb — ‘ghar ka bhedi Lanka dhaye’: it is the insider who brings down Lanka.' },
    sugriva: { fact: 'Tradition places Sugriva’s kingdom of Kishkindha among the giant boulder hills of Hampi, in Karnataka — a landscape you can walk through today.' },
    jatayu: { fact: 'In Kerala, one of the largest bird sculptures in the world rests on a hilltop where tradition says Jatayu fell — a whole park built around one brave old vulture.' },
    shabari: { fact: 'In many tellings Shabari tastes each berry to find the sweetest before offering them — a story families tell about love mattering more than custom.' },
    vishwamitra: { fact: 'Tradition names Vishwamitra as the seer of the Gayatri mantra — one of the oldest and best-loved verses of the Rigveda.' },
    mandodari: { fact: 'Mandodari is counted in tradition among the panchakanya — five women of the epics whose names are remembered in a morning verse.' },
    valmiki: { fact: 'Valmiki is called the adi kavi, the first poet — tradition says the Ramayana’s verse form was born from his cry of grief at seeing a bird shot.' },

    /* ---- THE MAHABHARATA — same rules as the Ramayana pack ---- */
    draupadi: { fact: 'In parts of Tamil Nadu, Draupadi is worshipped as a goddess — with festivals in her honour where devotees walk on fire.' },
    arjuna: { fact: 'The Bhagavad Gita — about seven hundred verses — is a conversation between Arjuna and Krishna, held on the battlefield in the moment before the war begins.' },
    bhima: { fact: 'In the epic’s year of hiding, Bhima works as a palace cook named Ballava — which is why tradition fondly makes the strongest Pandava the patron of cooks.' },
    yudhishthira: { fact: 'The epic ends with Yudhishthira refusing to enter heaven unless the dog walking beside him may come too — one of its most retold scenes.' },
    nakula: { fact: 'Old India wrote whole Sanskrit treatises on the care of horses, credited to the sage Shalihotra — and the epic says Nakula understood horses best of all.' },
    sahadeva: { fact: 'The Mahabharata is about seven times the length of the Iliad and the Odyssey combined — one of the longest poems ever composed.' },
    karna: { fact: 'Karna’s name is still an everyday word: a boundlessly generous person is called a ‘Karna’ — daanveer, the hero of giving.' },
    bhishma: { fact: 'The epic says Bhishma chose the day of his own passing, waiting on a bed of arrows for the sun’s northward turn — Bhishma Ashtami still marks it in the calendar.' },
    drona: { fact: 'Tradition links the city of Dehradun’s name to Drona — ‘Drona’s valley’ — and the city is still fondly called Dronanagari.' },
    dhritarashtra: { fact: 'The whole war is described to the blind king, moment by moment, by Sanjaya — making the Mahabharata one of the oldest stories ever told as live commentary.' },
    gandhari: { fact: 'Gandhari is named for Gandhara, her homeland in the far north-west — a real ancient region whose sculpture now fills museums around the world.' },
    kunti: { fact: 'Kunti was born Pritha and renamed for Kuntibhoja, the king who raised her — Arjuna’s epithet Partha means ‘son of Pritha’, carrying his mother’s first name.' },
    duryodhana: { fact: 'In Kerala there is a shrine where Duryodhana is honoured to this day — the epics refuse to make anyone only a villain, and so do some of India’s temples.' },
    shakuni: { fact: 'Dice are among the oldest game pieces found in India — a famous hymn of the Rigveda, the gambler’s lament, already sings of their pull.' },
    vidura: { fact: 'Vidura’s counsel fills a whole stretch of the epic — the Vidura Niti, still read today as a manual of plain good advice.' },
    ekalavya: { fact: 'India names schools for Ekalavya today — including a whole network of residential schools for tribal children — for the boy who taught himself.' },
    abhimanyu: { fact: 'The chakravyuha Abhimanyu entered is a living word: in Hindi, any trap you can get into but not out of is still called a chakravyuha.' },

    /* ---- THE COMPANIONS — playful, in-world, no cruelty (docs/05 §7) ---- */
    gattu: { lore: 'The elephant calf who remembers everything — which is why he is the first to notice when the mist creeps in.',
      fact: 'Gattu has never once forgotten a story he was told — and his little bell gives one small ring every time you remember something too.' },
    mithu: { lore: 'A green ring-necked parakeet, rose collar and all, always mid-sentence — the teller of every katha.',
      fact: 'Mithu comes from a long line of storytelling parrots — India has been putting its best tales in a parrot’s beak since the old Tota-Maina stories.' },
    vismriti: { lore: 'Not a demon, not a villain from anyone’s story — just a grey mist where stories drift when nobody tells them.',
      fact: 'Vismriti has no face and no voice, and it cannot hold on to any story that is still being told — one teller, even a small one, is always enough.' }
  };

  /* ---------------------------------------------------------------- DEEDS
     WHAT REPLACES THE NUMBERS ON A REAL PERSON'S CARD.

     `deeds` — two to four short, checkable lines, one clause each, in a
     child's register: what this person DID. Every line here is distilled
     from the sourced record this app already carries for that person (their
     own story in data-stories-modern.js / data-stories-vigyan.js, their era
     in data-itihaas.js, their entry in data-neeti.js or data-states.js), so
     the card can never contradict the story a child reads two taps away.
     Where the app has no story for someone, only facts held with certainty
     are used — and the list is SHORTER. Fewer true lines beat four shaky
     ones, always. Nothing here duplicates that card's `fact`.

     `quote` — see the quote rule in the header. Present on ten cards only.
     Every one names its source or setting. Everyone else is quoteless on
     purpose: no floating internet line, no plausible-sounding paraphrase.
     ---------------------------------------------------------------- */
  var DEEDS = {

    /* ---- GREAT INDIANS ---- */
    ashoka: { deeds: [
        'Ruled almost the whole subcontinent from Magadha, more than 2,200 years ago.',
        'Had his edicts cut in the everyday languages people spoke, so they could be read aloud to anyone.',
        'His lion capital from Sarnath is India’s state emblem today — it is on your passport and your coins.'],
      quote: { text: 'All men are my children.', where: 'from Ashoka’s own edict, carved on rock at Kalinga' } },
    chanakya: { deeds: [
        'Advised Chandragupta Maurya, who took the throne of Magadha about 322 BCE.',
        'The empire they built reached across most of the subcontinent — Ashoka was Chandragupta’s grandson.'] },
    shivaji: { deeds: [
        'Built a navy as well as an army, which very few rulers around him bothered to do.',
        'Ran his administration in Marathi — the language the people around him actually spoke.',
        'Was crowned at Raigad in 1674; you can still climb the mountain his capital stood on.'] },
    lakshmibai: { deeds: [
        'Ruled Jhansi as its queen, and refused to hand her kingdom over when she was ordered to.',
        'Is sung across Bundelkhand to this day — and in Subhadra Kumari Chauhan’s poem that children still recite by heart.'] },
    gandhi: { deeds: [
        'Turned ahimsa — not harming — into a way ordinary, unarmed people could face an empire.',
        'Called for Quit India in 1942, and went to prison for it along with tens of thousands of others.',
        'Spun his own cloth on a charkha, and asked India to wear what India made.'],
      quote: { text: 'Recall the face of the poorest and the weakest man whom you may have seen, and ask yourself if the step you contemplate is going to be of any use to him.',
        where: 'the talisman he wrote in 1948, in his Collected Works' } },
    ambedkar: { deeds: [
        'Studied in New York and in London, and came home with degrees almost nobody in India held.',
        'Argued for the rights of people India had pushed to the margins, at the Round Table Conferences in London.',
        'Was independent India’s first law minister.'],
      quote: { text: 'We must make our political democracy a social democracy as well.',
        where: 'said in the Constituent Assembly, 25 November 1949' } },
    bhagat: { deeds: [
        'Read constantly — the notebook he kept in jail survives, and is still printed today.',
        'Went on a long hunger strike in prison over how Indian prisoners were treated.'] },
    kalam: { deeds: [
        'Was project director of SLV-3 — the rocket that put India’s Rohini satellite into orbit on 18 July 1980.',
        'Led missile work at DRDO for years, and helped plan India’s rockets from their bicycle-and-bullock-cart days.',
        'Became President of India in 2002, and spent the job answering children’s letters.',
        'Spent his last afternoon, in 2015, doing what he had chosen over every comfort — teaching students.'],
      quote: { text: 'I inherited honesty and self-discipline from my father; from my mother, I inherited faith in goodness and deep kindness.',
        where: 'from his memoir, Wings of Fire' } },
    aryabhata: { deeds: [
        'Finished the Aryabhatiya in 499 CE, at twenty-three — mathematics written as verses you could memorise.',
        'Wrote that the Earth itself is turning, about a thousand years before telescopes settled the argument.',
        'Worked out the length of a year very nearly right, with no telescope and no calculator.'],
      quote: { text: 'Just as a man in a boat going forward sees the stationary objects on the bank as moving backward, so the stars are seen moving westward.',
        where: 'from the Aryabhatiya, 499 CE' } },
    tagore: { deeds: [
        'Wrote Gitanjali, and made the English translation of it himself.',
        'Started a school at Santiniketan where classes are still held under the open trees — a World Heritage Site since 2023.',
        'Gave the money from his Nobel Prize away to that school.'],
      quote: { text: 'Where the mind is without fear and the head is held high…',
        where: 'the opening of poem 35 of Gitanjali, in his own English' } },
    kalpana: { deeds: [
        'Grew up in Karnal in Haryana, and studied aeronautical engineering in Punjab.',
        'Flew on the space shuttle Columbia in 1997, and went back to orbit in 2003.',
        'Wrote to students at her old college urging them to aim at things nobody had offered them.'],
      quote: { text: 'The path from dreams to success does exist. May you have the vision to find it, the courage to get on to it, and the perseverance to follow it.',
        where: 'her message to the students of her old engineering college in Chandigarh' } },
    sarojini: { deeds: [
        'Published books of poems from The Golden Threshold onwards, and kept writing all her life.',
        'Was president of the Indian National Congress in 1925 — the first Indian woman in that chair.',
        'Became the first woman to be governor of an Indian state.'] },
    savitribai: { deeds: [
        'Learned her letters as a young bride, then trained properly as a teacher at Ahmednagar and Pune.',
        'Within three years she and Jyotirao were running three schools, with about a hundred and fifty girls in them.',
        'Published a book of her own poems at twenty-three, telling girls one thing over and over: go, get education.',
        'Nursed the sick when plague reached Pune in 1897, and did not stop.'] },
    hansa_mehta: { deeds: [
        'Was one of just fifteen women in the assembly that wrote India’s Constitution.',
        'Presented the national flag to that assembly on behalf of the women of India, at midnight on 14 August 1947.',
        'Became the first Vice-Chancellor of Baroda’s new university in 1949.',
        'Wrote and translated books for Gujarati children — Gulliver’s travels among them.'],
      quote: { text: 'All human beings are born free and equal in dignity and rights.',
        where: 'Article 1 of the Universal Declaration of Human Rights, 1948 — the wording she insisted on' } },

    /* ---- AKBAR'S DARBAR — the three real people of the pack ---- */
    akbar: { deeds: [
        'Ruled for about fifty years, from 1556 to 1605.',
        'Had the Ain-i-Akbari compiled — a record of his empire so thorough it lists the imperial elephants by name.',
        'Kept a translation bureau at court that turned the Mahabharata into Persian as the painted Razmnama.'] },
    birbal: { deeds: [
        'Was a real poet and courtier in Akbar’s inner circle, counted among the nine jewels of that court.',
        'Held the title Raja Birbal, given to him by the emperor himself.'] },
    tansen: { deeds: [
        'Sang at Akbar’s court as one of its nine jewels, after years at Rewa before that.',
        'Carried the dhrupad tradition — musicians still trace their teaching lineage back to him.',
        'Is buried at Gwalior, where the Tansen Samaroh music festival is held in his honour every year.'] },

    /* ---- INDIA AT PLAY ---- */
    dhyanchand: { deeds: [
        'Joined the army at sixteen and practised alone by moonlight, because the parade ground had no lights.',
        'Was in the India team that beat the United States 24–1 at the 1932 Olympics.',
        'Played in the 1936 Berlin final, won 8–1 with the whole stadium roaring against India.'] },
    milkha: { deeds: [
        'Won the 440 yards at the 1958 Commonwealth Games — independent India’s first athletics gold there.',
        'Was given the name the Flying Sikh by the crowd at a race in Lahore, and carried it for life.',
        'Told the truth about the one race that went wrong, openly, for sixty years afterwards.'] },
    kapil: { deeds: [
        'Captained India to the 1983 World Cup, at odds of sixty-six to one against.',
        'Ran twenty yards backwards at Lord’s to catch Viv Richards — the catch that turned the final.',
        'Bowled fast and hit hard in the same match, which is why the team called him the Haryana Hurricane.'] },
    sachin: { deeds: [
        'Played for India at sixteen against the fastest bowlers in the world, took a blow, bled, and stayed on.',
        'Scored one hundred international centuries — no other cricketer has reached that.',
        'Made more than thirty-four thousand international runs across twenty-four years.',
        'Won the World Cup at home in 2011, at his sixth attempt, and was carried round the ground.'] },
    dhoni: { deeds: [
        'Won the first Twenty20 World Cup in 2007 with a young side nobody expected much from.',
        'Promoted himself up the order in the 2011 final and finished on 91 not out, with a six over long-on.',
        'Kept wicket and captained at the same time, which is two of the hardest jobs on the field.'] },
    kohli: { deeds: [
        'Captained India’s under-19 team to a World Cup in 2008.',
        'Was in the side that won the 2011 World Cup, at twenty-two.',
        'Rebuilt how he ate, trained and slept in 2012 — and a whole team’s habits followed him.'] },
    mithali: { deeds: [
        'Scored 114 not out in her very first match for India, at sixteen.',
        'Made 214 against England at nineteen — then the highest score in the history of women’s Test cricket.',
        'Captained India to World Cup finals in two different decades, 2005 and 2017.'] },
    marykom: { deeds: [
        'Trained in secret in Manipur, and had won a state title before her father found out from the newspaper.',
        'Came back after having twin sons and won the world championship again.',
        'Won Olympic bronze in London in 2012, the only Indian woman in the boxing draw.'] },
    sindhu: { deeds: [
        'Travelled tens of kilometres across Hyderabad before dawn to practise, from the age of eight.',
        'Won Olympic silver at Rio in 2016 and bronze at Tokyo — India’s first woman with two.'] },
    saina: { deeds: [
        'Became junior world champion in 2008 — the first Indian ever to do it.',
        'Won the Indonesia Open in 2009, the first Indian woman to take a title that size.',
        'Rode to practice on her father’s scooter before daybreak, tens of kilometres each way.'] },
    neeraj: { deeds: [
        'Threw 86.48 metres at the 2016 world junior championships — a world record for his age group.',
        'Went on to become world champion as well as Olympic champion.',
        'Started at about thirteen, marched to the town stadium by an uncle who wanted him to get some exercise.'] },
    malleswari: { deeds: [
        'Was world champion in 1994, and again in 1995.',
        'Learned the lifts in a village gym with a mud floor, in Srikakulam district on the Andhra coast.',
        'Lifted at the first Olympic Games ever to include women’s weightlifting.'] },
    mirabai: { deeds: [
        'Failed all three of her clean and jerks at Rio in 2016 — and was world champion one year later.',
        'Lifted 202 kilograms in Tokyo for silver, on the very first morning of those Games.',
        'Got herself to training by waving down the sand trucks that passed her village in the Manipur hills.'] },
    anand: { deeds: [
        'Was world junior champion in 1987, and a grandmaster the next year.',
        'Won the world championship in 2000, and again in 2007.',
        'Defended the title in match after match — in 2008, 2010 and 2012.',
        'Runs an academy in Chennai; one of the boys it helped train became world champion himself.'] },
    gukesh: { deeds: [
        'Became a grandmaster at twelve.',
        'Won the tournament of champions at seventeen, the youngest player ever to do it.',
        'Beat the reigning world champion in the last game of a fourteen-game match in Singapore.'] },
    avani: { deeds: [
        'Won Paralympic gold in Tokyo at nineteen, with a Paralympic record score.',
        'Added a bronze in a second event days later.',
        'Beat her own record when she won the gold again in Paris in 2024.',
        'Studied law in between the two Games.'] },

    /* ---- THE BUILDERS ---- */
    kurien: { deeds: [
        'Was posted to Anand in 1949 meaning to leave the moment he could — and stayed about fifty years.',
        'Made the world’s first milk powder from buffalo milk, with H. M. Dalaya, after the experts called it impossible.',
        'Ran Operation Flood, which carried the farmer-owned dairy idea across the whole country.',
        'Wrote it all down in his memoir, I Too Had a Dream.'] },
    n_murthy: { deeds: [
        'Started Infosys in 1981 with six colleagues and the front room of a house for an office.',
        'Shared ownership of the company with its employees, down to drivers and office staff, long before that was normal.',
        'Grew seven engineers into one of the great software companies in the world.'] },
    sudha_murty: { deeds: [
        'Became the first woman engineer on the TELCO shop floor, at Pune.',
        'Put up the ten thousand rupees from her own savings that started Infosys.',
        'Has built libraries and schools by the thousand, and writes the books children queue up for.'] },
    falguni: { deeds: [
        'Was one of the most senior bankers in Mumbai before she started again from zero.',
        'Founded Nykaa in 2012, in an industry she had never worked in a day of her life.',
        'Named it from nayika — the heroine of a story. The heroine, note, not the sidekick.'] },
    kiran_shaw: { deeds: [
        'Finished top of her class in brewing science in Australia — and no Indian brewery would hire a woman.',
        'Built Biocon into the biggest biotechnology company in India.',
        'Turned its fermenters towards insulin, the daily medicine millions of Indians cannot live without.'] },
    ela_bhatt: { deeds: [
        'Founded SEWA in 1972 — a trade union for women the rulebooks had never counted as workers at all.',
        'Saw it grow to millions of members, one of the largest organisations of working women anywhere on Earth.',
        'Wrote their story in a book called We Are Poor but So Many.'] },
    ritesh: { deeds: [
        'Started OYO in 2013, still a teenager, after a first idea that taught him he was half wrong.',
        'Won a global fellowship for young founders that paid him to build his company instead of going to college.'] },

    /* ---- THE SCIENTISTS ---- */
    raman: { deeds: [
        'Checked the blue of the sea from a ship’s rail in 1921, and found the water makes its own blue.',
        'Found, with K. S. Krishnan, that light comes out of a substance with its colour slightly shifted.',
        'Gave laboratories the Raman effect — used today on medicines, on paintings, and on the surface of Mars.'] },
    ramanujan: { deeds: [
        'Filled notebook after notebook working by lamplight on a slate, because paper cost money.',
        'Wrote to G. H. Hardy in 1913 with more than a hundred theorems and no proofs — and was brought to Cambridge.',
        'Left notebooks that mathematicians are still mining for new results a century later.'] },
    bhabha: { deeds: [
        'Worked on cosmic rays at Cambridge, then came home for a holiday that a war turned into the rest of his life.',
        'Founded TIFR in 1945 — India’s home for fundamental research, still standing by the sea in Mumbai.',
        'Filled it with gardens and paintings, because he did not believe fine minds grow in ugly rooms.'],
      quote: { text: 'India will not have to look abroad for its experts but will find them ready at hand.',
        where: 'from his 1944 letter proposing the institute that became TIFR' } },
    sarabhai: { deeds: [
        'Founded a physics laboratory in Ahmedabad in 1947, at twenty-eight, eleven days after independence.',
        'Started India’s space programme in 1962 — and a Kerala parish lent its church to house it.',
        'Promised satellites that would watch the monsoon and teach village schools, and ISRO went and did it.'],
      quote: { text: 'We must be second to none in the application of advanced technologies to the real problems of man and society.',
        where: 'his statement on why India needed a space programme, still quoted by ISRO' } },
    jcbose: { deeds: [
        'Built his own instruments with Kolkata metalworkers, in a laboratory that was barely a laboratory.',
        'Made the crescograph, which magnified a plant’s growth thousands of times so you could watch it happen.',
        'Opened the Bose Institute in Kolkata in 1917 — one of the first research institutes in Asia, and still working.'] },
    janaki_ammal: { deeds: [
        'Is remembered as the first Indian woman to earn a doctorate in botany.',
        'Crossed sugarcanes at Coimbatore until India’s own canes were sweet as well as tough.',
        'Wrote the Chromosome Atlas of Cultivated Plants with C. D. Darlington — a census of the world’s crops.',
        'Spoke up for Silent Valley in her eighties; the rainforest is a national park today, full of birdsong.'] },
    annamani: { deeds: [
        'Wrote five research papers in C. V. Raman’s laboratory — and was never granted the doctorate they had earned.',
        'Gathered and standardised the drawings of about a hundred weather instruments so India could build its own.',
        'Measured ozone years before the world grew properly worried about it, and mapped India’s winds afterwards.'] },
    tessy: { deeds: [
        'Joined DRDO in 1988 and spent twenty years on guidance — the hard part, after the loud part.',
        'Was project director for the Agni-IV flight in 2011.',
        'Went on to head all of DRDO’s aeronautical systems — everything the organisation flies.'] },
    swaminathan: { deeds: [
        'Turned from medicine to the science of growing food after watching the Bengal famine of 1943.',
        'Brought dwarf wheat to Indian fields with Norman Borlaug, and bred it for Indian soil and Indian rotis.',
        'Said honestly, later, that the new farming drank too deep — and spent decades on what he called an evergreen revolution.',
        'Won the very first World Food Prize, in 1987.'] },
    salimali: { deeds: [
        'Surveyed India’s birds state by state for decades, with notebooks, patience and famously little money.',
        'Fought for the wetland at Bharatpur — it is Keoladeo National Park today, and the birds still arrive on schedule.',
        'Named his own life story after the bird that started it: The Fall of a Sparrow.'] }
  };

  /* Defensive fallback pool — real, checkable, from this app's own records.
     Every shipped id has an authored fact above; this exists so an id added
     to avatars.js before its card lands still says something true. */
  var FACTS = [
    'The Aravalli hills are older than the Himalayas — older than the dinosaurs.',
    'Chess began in India: its ancestor, chaturanga, was played here some fourteen centuries ago.',
    'When people say India gave the world zero, they mean the deep idea of the empty place that counts.',
    'India is the only country where lions and tigers both live in the wild.',
    'The Panchatantra’s animal stories travelled the whole world — they are among the most translated books ever.'
  ];

  function packOf(id) {
    var ps = PACKS();
    for (var i = 0; i < ps.length; i++) {
      if (ps[i].ids && ps[i].ids.indexOf(id) >= 0) return ps[i];
    }
    return null;
  }

  /* -------------------------------------------------- WHO IS A REAL PERSON
     Listed by hand rather than derived from the pack, because three packs are
     mixed: 'darbar' holds Akbar, Birbal and Tansen (real, documented people)
     alongside an anonymous courtier, guard and elephant (invented types), and
     'naya' holds seven founders alongside two emblems (rocket, unicorn). A
     derived rule would silently start scoring a person the day someone adds
     an id to a pack; a list cannot. If you add a real person to any pack, add
     them here in the same commit — verify.js asserts every id on this list
     resolves to kind 'real', carries achievements, and renders no number. */
  var REAL_PEOPLE = [
    /* great */ 'ashoka', 'chanakya', 'shivaji', 'lakshmibai', 'gandhi', 'ambedkar', 'bhagat',
                'kalam', 'aryabhata', 'tagore', 'kalpana', 'sarojini', 'savitribai', 'hansa_mehta',
    /* darbar — the three documented people; courtier/guard/royal_elephant are anonymous types */
                'akbar', 'birbal', 'tansen',
    /* khel */  'dhyanchand', 'milkha', 'kapil', 'sachin', 'dhoni', 'kohli', 'mithali', 'marykom',
                'sindhu', 'saina', 'neeraj', 'malleswari', 'mirabai', 'anand', 'gukesh', 'avani',
    /* naya — the founders; rocket and unicorn are emblems, not people */
                'kurien', 'n_murthy', 'sudha_murty', 'falguni', 'kiran_shaw', 'ela_bhatt', 'ritesh',
    /* vigyan */'raman', 'ramanujan', 'bhabha', 'sarabhai', 'jcbose', 'janaki_ammal', 'annamani',
                'tessy', 'swaminathan', 'salimali'
  ];
  window.IND_AV_REAL_PEOPLE = REAL_PEOPLE;

  /* Sacred packs render no numbers at all — "beyond measure" instead of stats.
     'devas' was the only one for a while; the Ten Descents and the wider deva
     pantheon belong under exactly the same rule, and forgetting to add them
     here is how Vishnu would have quietly picked up a score out of 99. */
  var SACRED_PACKS = ['devas', 'dashavatara', 'pantheon'];

  /* The asuras are Katha — a story as it is told — not 'character', because a
     character is the one kind that DOES get stats, and grading Mahabali (whom
     Kerala welcomes home every Onam) or Prahlada out of 99 is precisely the
     collectible-loot problem docs/05 §7 forbids. Same badge the epic casts
     carry, same absence of numbers. */
  var EPIC_PACKS = ['ramayana', 'mahabharata', 'asuras'];

  /* The docs/05 badge each kind of card renders under. A real person's card
     is an Itihaas object — what the record shows; an epic figure's is Katha —
     a story as it is told. Saying so on the face of the card is the same
     honesty the stories keep, and it is what stands where a score used to. */
  var BADGE = {
    real:   { mark: '📜', word: 'Itihaas', line: 'what the record shows' },
    epic:   { mark: '🪔', word: 'Katha',   line: 'a story as it is told' },
    sacred: { mark: '॥',  word: '',        line: '' },
    character: null
  };

  function kindOf(id, pack) {
    if (pack && SACRED_PACKS.indexOf(pack.id) >= 0) return 'sacred';
    if (REAL_PEOPLE.indexOf(id) >= 0) return 'real';
    if (pack && EPIC_PACKS.indexOf(pack.id) >= 0) return 'epic';
    return 'character';
  }

  window.IND_AV_CARD = function (id) {
    var pack = packOf(id);
    var mascot = MASCOTS[id] || null;
    if (!pack && !mascot) return null;

    var name = mascot ? mascot.name : (NAMES()[id] || id);
    var db = LOREDB[id] || {};
    var cast = CAST()[id];

    /* Lore precedence: authored line, else the epic cast's hand-written desc
       reused verbatim (the whole epic cast, plus rama and hanuman), else a
       plain fallback. */
    var packLabel = pack ? pack.name : MASCOT_PACK.label;
    var lore = db.lore || (cast && cast.desc) || (name + ' of ' + packLabel + '.');
    var fact = db.fact || FACTS[hash(id + 'fact') % FACTS.length];

    /* WHO MAY CARRY A NUMBER — the whole rule, in four lines. Only an
       invented character is scored. A real person, an epic figure and a
       sacred figure all resolve to stats: null and overall: null, and the
       shell has nothing to print a score from. */
    var kind = kindOf(id, pack);
    var sacred = kind === 'sacred';
    var deeds = DEEDS[id] || {};

    var stats = null, overall = null;
    if (kind === 'character') {
      stats = statsFor(id);
      overall = Math.round((stats.himmat + stats.gyaan + stats.chatur + stats.dil) / 4);
    }

    /* Sacred figures carry no gamey title (traditional address form or none —
       this file chooses none). Mascots carry their role. */
    var title = sacred ? '' : (mascot ? mascot.title : (PACK_TITLE[pack.id] || ''));

    return {
      id: id, name: name,
      packId: pack ? pack.id : MASCOT_PACK.id,
      packLabel: packLabel,
      title: title, lore: lore, fact: fact,
      kind: kind, badge: BADGE[kind] || null,
      sacred: sacred, stats: stats, overall: overall,
      achievements: (kind === 'real' && deeds.deeds) ? deeds.deeds.slice() : [],
      /* the epic cast's other names, reused verbatim from IND_EPIC_CAST — the
         detail that stands on an epic card where a real person has their
         achievements. A name is not a score, and every one of these is
         already in the cast file, so the two can never drift. */
      alsoCalled: (kind === 'epic' && cast && cast.alias) ? cast.alias.slice() : [],
      /* a quote only ever rides with a named source — the pair is authored
         together in DEEDS, so one can never arrive without the other */
      quote: (kind === 'real' && deeds.quote && deeds.quote.text && deeds.quote.where)
        ? { text: deeds.quote.text, where: deeds.quote.where } : null
    };
  };
})();
