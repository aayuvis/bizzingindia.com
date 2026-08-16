/* ============================================================
   AVATAR-CARDS.js — the collectible-card data layer for every avatar in
   Bizzing India, modelled on Bizzing Bee's avatar-cards.js. Data only: the
   shell owns all rendering, so there is no HTML anywhere in this file.

   WHAT EVERY CARD CARRIES
     • four stats — himmat 🛡️ (courage), gyaan 📖 (wisdom), chatur ⚡ (wit),
       dil 💛 (heart), each 28–99 — derived deterministically from a stable
       hash of the id, exactly in the Bee's idiom: no per-avatar authoring,
       identical on every device on every day.
     • ONE tier for everyone: { base: 66, spread: 20 }. RARITY IS PAUSED
       app-wide (see IND_RARITY_PAUSED in avatars.js, acting on the docs/05
       note that tiering sacred figures reads as collectible loot and implies
       a ranking between deities). While it is paused, no avatar is Rare or
       Legendary here — every companion draws from the same tier, and the
       stats spread does the flavouring instead.
     • a title in the pack's register (PACK_TITLE below), a one-line in-world
       lore, and one REAL, checkable, kid-friendly fact.

   THE SACRED EXCEPTION — the one place this file deliberately parts from
   the Bee: every id in the 'devas' pack (ganesha … harmandir, including
   the Buddha and Mahavira, the Khanda and Harmandir Sahib) gets stats: null
   and sacred: true. Their card face will say 'beyond measure' — a deity, a
   Guru's emblem or a tirthankara is never a number, per docs/05. They also
   carry no gamey title: their traditional address form, or none at all.

   WHERE THE FACTS COME FROM (docs/05 is binding here)
     • devas — a tradition-fact told from the inside, as families keep it:
       warm, never comparative, never "myth-as-false", no invented scripture.
     • panch — real animal facts, Bee-style.
     • darbar — documented Mughal-court facts (the Ain-i-Akbari, the
       Razmnama, Fatehpur Sikri), matching app/data-itihaas.js.
     • great / khel / naya / vigyan — real people. Every fact is distilled
       from the sourced records already gathered in this app's own stories
       (data-stories-modern.js, data-stories-vigyan.js, data-itihaas.js,
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
                                 fact, sacred, stats, overall } | null
     window.IND_AV_STAT_KEYS  — [key, emoji, label] rows, in render order,
                                so the shell and the data agree.
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

    /* THE SACRED EXCEPTION. Every id in the devas pack is sacred: true with
       stats: null. Their card face will say 'beyond measure' — a deity, a
       Guru's emblem or a tirthankara is never a number, per docs/05. */
    var sacred = !!pack && pack.id === 'devas';

    var stats = null, overall = null;
    if (!sacred) {
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
      sacred: sacred, stats: stats, overall: overall
    };
  };
})();
