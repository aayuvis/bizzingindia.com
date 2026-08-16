/* Bizzing India — the scientists' stories.

   Every object here carries badge 'itihaas' — what evidence shows — and that is a
   promise, not a flavour (docs/05 §1, §3). These are real people, so the rules bite
   harder than anywhere else in the story shelf:

     - Nothing is written from memory alone; every story's `source` line names where
       the facts come from — a memoir, a surviving letter, Nobel records, an
       institution's own history.
     - Nobody in these stories is given invented dialogue. The teller narrates.
       The only direct quotations are ones that are themselves famously documented,
       and each is attributed in the text to where it was recorded — Hardy's own
       telling of the 1729 taxicab exchange, Bhabha's surviving 1944 letter,
       Aryabhata's own verses.
     - Where history is genuinely uncertain (who first wrote the zero sign), the
       story says so out loud, because "grown-ups still argue about this one" is an
       honest and thrilling sentence.

   Same scene shape as data-stories.js:
     art   avatar ids to stage (left, right)
     who   speaker id, 'mithu' for the teller, or null for narration
     text  what is told
     mood  think | wow | sad
     ask   { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_VIGYAN = [

/* ============================================================ ARYABHATA ===== */
{
  id: 'sci-aryabhata',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'The Man Who Made Nothing Count',
  hook: 'Around 1,500 years ago, a young man wrote a small book of verses. Inside it: a spinning Earth, and a place where nothing itself does the work.',
  hero: 'aryabhata',
  cast: ['aryabhata', 'mithu'],
  minutes: 4,
  place: ['IN-BR'],
  words_hi: [['शून्य', 'shunya', 'zero'], ['पृथ्वी', 'prithvi', 'earth'], ['तारा', 'taara', 'star']],
  scenes: [
    { art: ['aryabhata'], who: null,
      text: 'In the year 499 CE, in Kusumapura — near today\'s Patna, in Bihar — a scholar finished a book of mathematics and astronomy written entirely in verse, so that it could be memorised and carried in people\'s heads. We know exactly when, and we know how old he was, because he tells us himself, inside the book: twenty-three. The book is called the Aryabhatiya, and people have been studying it ever since.' },
    { art: ['aryabhata'], who: null, mood: 'think',
      text: 'One of his problems was very old: how do you write enormous numbers without drowning in symbols? The answer his book works with is the one you use every day without noticing — WHERE a digit sits decides what it is worth. The 2 in 25 means twenty. The 2 in 205 means two hundred. Which forces a strange question: in 205, what is doing the work in the middle?',
      ask: {
        q: 'What sits in the middle of 205, holding the tens place open?',
        options: ['Nothing — you could leave it out', 'A nothing that has to be WRITTEN, or the whole number collapses', 'A very small one'],
        answer: 1,
        right: 'That is the deep idea. Leave it out and 205 becomes 25. The empty place must be marked — nothing, doing the work of something.',
        wrong: 'Try leaving it out: 205 becomes 25, and your two hundred vanishes. The empty place has to be MARKED. Nothing, doing the work of something.'
      } },
    { art: ['aryabhata'], who: null,
      text: 'In India that marked emptiness came to be called shunya. Historians of mathematics point to Aryabhata\'s way of working with numbers as a place where the idea is already pulling its weight — and it is this idea, the empty place that counts, that people mean when they say India gave the world zero. Who first drew the little round symbol for it? Nobody can prove it. Grown-ups still argue about that one, happily, in journals.' },
    { art: ['aryabhata'], who: null, mood: 'wow',
      text: 'And then the book says something that almost nobody on Earth believed at the time. The stars, Aryabhata writes, do not wheel around us each night — the Earth itself is turning. Just as a person in a moving boat sees the trees on the riverbank drift backwards, he says in his verse, so we, riding the turning Earth, see the stars drift west. You can still read that verse today. He worked out the turning from a boat.' },
    { art: ['aryabhata'], who: null, mood: 'sad',
      text: 'The astronomers who came after him mostly said no. A spinning Earth! Surely we would feel it. Many copied his book but "corrected" that part, and the still Earth stayed in charge of the textbooks for about a thousand years more, until telescopes in other countries settled it his way. Being right early can be a lonely business — the evidence keeps you company until everyone else arrives.' },
    { art: ['aryabhata'], who: 'mithu',
      text: 'In 1975, when India sent up its very first satellite, it needed a name. They called it Aryabhata. The man who said the Earth turns, riding around the turning Earth. He would have liked the view.' }
  ],
  moral: 'A question written down carefully can wait a thousand years for the world to catch up — and it keeps.',
  source: 'The Aryabhatiya of Aryabhata (499 CE) — his own verses give his age and the boat comparison for the turning Earth — as read in standard histories of Indian mathematics such as Kim Plofker\'s Mathematics in India. The satellite Aryabhata (1975) is in ISRO\'s records.'
},

/* ============================================================== J C BOSE ==== */
{
  id: 'sci-jcbose',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'The Scientist Who Listened to Plants',
  hook: 'Everyone agreed plants just sit there. One professor in Kolkata built a machine to check — and the plants had plenty to say.',
  hero: 'jcbose',
  cast: ['jcbose', 'mithu'],
  minutes: 4,
  place: ['IN-WB'],
  words_hi: [['पौधा', 'paudha', 'plant'], ['खोज', 'khoj', 'discovery'], ['यंत्र', 'yantra', 'instrument']],
  scenes: [
    { art: ['jcbose'], who: null,
      text: 'Jagadish Chandra Bose taught physics at Presidency College in Kolkata in the 1890s, in a laboratory that was barely a laboratory — a small room, almost no money for equipment. So he built his own instruments, working with local metalworkers, and they turned out to be some of the finest instruments anywhere. In 1895 he used one set of them to send invisible waves through walls across a Kolkata hall, ringing a bell at a distance — radio waves, years before most of the world had heard of such a thing.' },
    { art: ['jcbose'], who: null, mood: 'think',
      text: 'But the question that would not let go of him was about plants. A dog runs, a person cries out — how would a plant, which can do neither, ever tell you anything? Bose\'s answer: build it a way to be heard. His crescograph magnified a plant\'s growth many thousands of times, so that growth too slow for any eye became a moving line you could watch — a plant, growing, live.' },
    { art: ['jcbose'], who: null, mood: 'wow',
      text: 'And the line had news in it. Chill the plant, and the line slowed. Touch it roughly, give it something nasty to drink, and the line stumbled and flinched. The plant was responding — not sitting there at all, but reacting to its world, in its own silent, slow-motion way. Bose travelled to the great scientific societies of Europe and showed them, with the instruments he had built in Kolkata.' },
    { art: ['jcbose'], who: null,
      text: 'And here is where the story turns into a decision. Instruments like his — and his radio-wave devices before them — were exactly the kind of thing fortunes were being built on. Companies were patenting everything in sight. He was not a rich man.',
      ask: {
        q: 'You have invented instruments the world wants. What do you do with them?',
        options: ['Patent everything and name your price', 'Sell them to one company, quietly', 'Refuse to fence them in — publish how they work, for anyone'],
        answer: 2,
        right: 'That was Bose\'s choice, made on purpose, more than once. Friends once filed a patent for him in America; he let it lapse. He believed knowledge grows best unfenced.',
        wrong: 'Bose chose the strangest option: he refused to fence his inventions at all. Friends once filed a patent for him in America — he let it lapse. He believed knowledge grows best unfenced.'
      } },
    { art: ['jcbose'], who: null,
      text: 'In 1917 he opened the Bose Institute in Kolkata — one of the first research institutes in Asia — and gave his instruments, his methods and his life\'s work to it, for whoever came next. It is still there, still working.' },
    { art: ['jcbose'], who: 'mithu',
      text: 'Next time you see a plant on a windowsill leaning towards the light, remember: it is doing something, slowly, right now. Bose built the machine that let people watch it happen. The plant was never just sitting there. Neither was he.' }
  ],
  moral: 'The quietest things are not silent — sometimes nobody has built the right way to listen yet.',
  source: 'Institutional history of the Bose Institute, Kolkata (founded by Bose, 1917), and records of his demonstrations to the Royal Society; his 1895 Kolkata demonstration and his refusal to patent — including the lapsed American patent filed by friends — are documented there and in standard biographies.'
},

/* ============================================================== C V RAMAN === */
{
  id: 'sci-raman',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'Why Is the Sea Blue?',
  hook: 'Every book said the sea is blue because it reflects the sky. On a ship home to India, one passenger decided to check — from the deck.',
  hero: 'raman',
  cast: ['raman', 'mithu'],
  minutes: 4,
  place: ['IN-TN', 'IN-WB'],
  words_hi: [['रंग', 'rang', 'colour'], ['समुद्र', 'samudra', 'sea'], ['सवाल', 'sawaal', 'question']],
  scenes: [
    { art: ['raman'], who: null,
      text: 'Chandrasekhara Venkata Raman, born in Tiruchirappalli in Tamil Nadu, was sailing home from London in 1921, and the Mediterranean was outrageously blue. The books had an answer ready: the sea reflects the sky, said the great Lord Rayleigh, and everyone repeated it. Raman stood at the rail and looked at the water for a long time. Repeating is not checking.' },
    { art: ['raman'], who: null, mood: 'wow',
      text: 'He had a small optical device in his luggage — he was the kind of traveller who would — and it could filter out reflected light. He pointed it at the sea, cutting away the sky\'s reflection. If the books were right, the blue should vanish with it. The blue stayed. The sea was not borrowing its colour from the sky. The water itself was scattering sunlight and making its own blue. By the time the ship reached India he had already written this up and posted it to the journal Nature.' },
    { art: ['raman'], who: null, mood: 'think',
      text: 'A colour is not just a fact — it is a message from inside the water. Back at his laboratory in Kolkata, the Indian Association for the Cultivation of Science, Raman and his colleagues, above all K. S. Krishnan, spent seven years shining light through liquids and reading what came out. The question underneath: when light passes through a substance, does the substance leave its fingerprints on the light?' },
    { art: ['raman'], who: null, mood: 'wow',
      text: 'On 28 February 1928 they had it, unmistakably: a tiny fraction of the scattered light comes out with its colour shifted — and the shift depends on the molecules it met. It is called the Raman effect, and it means light can be used to identify what things are made of without touching them. Laboratories all over the world use it today, on everything from medicines to paintings to the surface of Mars.' },
    { art: ['raman'], who: null,
      text: 'In 1930 Raman won the Nobel Prize in Physics — the first person from Asia to win a science Nobel. His biographers tell that he was so sure it was coming, he booked his tickets to Stockholm months before the announcement. That is either tremendous confidence or tremendous cheek, and with Raman it was generally both.' },
    { art: ['raman'], who: 'mithu',
      text: 'India keeps 28 February as National Science Day, for the day the light gave up its secret. And it all runs back to a passenger at a ship\'s rail asking a question every book had already answered. Wrongly, as it turned out. Worth remembering, that.' }
  ],
  moral: 'The question everyone has stopped asking is exactly the one worth checking.',
  source: 'Raman\'s own note "The Colour of the Sea" (Nature, 1921), written on the 1921 voyage; Nobel Prize records (Physics, 1930); the Indian Association for the Cultivation of Science, Kolkata, where the 1928 experiments with K. S. Krishnan were done. The Stockholm-tickets story is as told in standard biographies (G. Venkataraman, Journey into Light).'
},

/* ============================================================ RAMANUJAN ===== */
{
  id: 'sci-ramanujan',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'The Clerk Who Wrote to Cambridge',
  hook: 'A shipping clerk in Madras posted a fat envelope of mathematics to a famous professor in England. Two professors had already ignored him.',
  hero: 'ramanujan',
  cast: ['ramanujan', 'mithu'],
  minutes: 5,
  place: ['IN-TN'],
  words_hi: [['चिट्ठी', 'chitthi', 'letter'], ['अंक', 'ank', 'number'], ['अनंत', 'anant', 'endless']],
  scenes: [
    { art: ['ramanujan'], who: null,
      text: 'Srinivasa Ramanujan, from Erode and Kumbakonam in Tamil Nadu, worked as a clerk at the Madras Port Trust, counting other people\'s cargo for a small salary. He had failed out of college — twice — because he would study nothing, absolutely nothing, except mathematics. He filled notebook after notebook with results in his own strange notation, mathematics nobody around him could follow, and worked by lamplight on a slate because paper cost money.' },
    { art: ['ramanujan'], who: null,
      text: 'In January 1913 he did a brave and slightly desperate thing: he wrote to G. H. Hardy, one of the most famous mathematicians in England — a man he had never met, in a country he had never seen. He introduced himself honestly as a clerk with no university degree, and enclosed page after page of theorems, more than a hundred of them, with no proofs. Two other Cambridge professors had already received such letters from him, and had not replied.',
      ask: {
        q: 'You are Hardy. Famous, busy — and here is a fat envelope of wild mathematical claims from an unknown clerk in Madras. What do you do?',
        options: ['Bin it — cranks write every week', 'Reply politely: get a degree first', 'Sit down and actually check the mathematics'],
        answer: 2,
        right: 'That is what Hardy did — first alone, then with his friend Littlewood, deep into the night. And the theorems fought back.',
        wrong: 'Hardy nearly did. But something in the pages nagged at him, and that evening he and his friend Littlewood sat down and actually checked the mathematics.'
      } },
    { art: ['ramanujan'], who: null, mood: 'wow',
      text: 'Some results Hardy recognised. Some were subtly wrong. And some were like nothing he had ever seen — Hardy wrote afterwards that such theorems had to be true, because no one would have had the imagination to invent them. He arranged to bring their author to Cambridge, and for five years the clerk and the professor did mathematics together that people are still mining today.' },
    { art: ['ramanujan'], who: null,
      text: 'The most famous story about them is Hardy\'s own, and he loved telling it. Ramanujan lay ill; Hardy visited, and remarked that his taxi\'s number, 1729, seemed rather a dull one. No, Ramanujan said at once — it is a very interesting number: it is the smallest number you can write as the sum of two cubes in two different ways. From his sickbed. Without a pause. Hardy said every number seemed to be Ramanujan\'s personal friend.' },
    { art: ['ramanujan'], who: null, mood: 'sad',
      text: 'England\'s cold and the war years were hard on him, and he was often ill. He sailed home to India in 1919, and died the next year, at just thirty-two. But he worked to the very end, and the notebooks he left — including one found decades later — are still yielding new mathematics today. Mathematicians speak of him the way musicians speak of Mozart.' },
    { art: ['ramanujan'], who: 'mithu',
      text: 'To this day, 1729 is called the taxicab number, and finding the next numbers like it is a real mathematical pursuit. Not bad for a dull number in a sad room. The letter, by the way — the one that changed everything — cost him the price of the stamps. Some envelopes are heavier than they look.' }
  ],
  moral: 'He asked for nothing except to be checked. Being checkable is the bravest way to knock on a door.',
  source: 'G. H. Hardy\'s own writings on Ramanujan — his book Ramanujan (1940) and obituary notices, where the 1729 exchange and the "no one would have the imagination to invent them" verdict are Hardy\'s own telling; the 1913 letters are printed in Ramanujan\'s Collected Papers; Robert Kanigel\'s The Man Who Knew Infinity for the life.'
},

/* ========================================================== JANAKI AMMAL ==== */
{
  id: 'sci-janaki',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'The Woman Who Sweetened the Sugarcane',
  hook: 'India grew oceans of sugarcane — and imported its sweetest canes from an island far away. One botanist decided India\'s own cane could learn sweetness.',
  hero: 'janaki_ammal',
  cast: ['janaki_ammal', 'mithu'],
  minutes: 4,
  place: ['IN-KL', 'IN-TN'],
  words_hi: [['गन्ना', 'ganna', 'sugarcane'], ['मिठास', 'mithaas', 'sweetness'], ['फूल', 'phool', 'flower']],
  scenes: [
    { art: ['janaki_ammal'], who: null,
      text: 'Edavaleth Kakkat Janaki Ammal was born in 1897 in Thalassery, on the Kerala coast, into a big house full of children where her father kept a garden and wrote about birds. She fell in love with plants early, and refused to fall out of it — at a time when an Indian woman in a laboratory was a sight most professors had simply never seen. She kept going anyway: college in Madras, then a scholarship across the world to Michigan, in America.' },
    { art: ['janaki_ammal'], who: null, mood: 'wow',
      text: 'She came home Dr Janaki Ammal — remembered as the first Indian woman to earn a doctorate in botany. Her science was cytogenetics: counting and reading chromosomes, the tiny thread-libraries inside every living cell that decide what a plant can be. Counting chromosomes sounds humble. It is actually a master key — it tells you which plants can cross with which, and what their children might become.' },
    { art: ['janaki_ammal'], who: null, mood: 'think',
      text: 'And India had a problem worth a master key. At the Sugarcane Breeding Institute in Coimbatore she faced it: India\'s own canes were tough — they could take India\'s droughts and soils — but thin in sweetness, so the sweetest planting cane came from Java, abroad. Tough but not sweet; sweet but not tough.',
      ask: {
        q: 'One cane is tough, another is sweet, and you need both in one plant. What does a plant breeder do?',
        options: ['Plant them side by side and hope', 'Cross them — and read the chromosomes to find the crosses that can work at all', 'Just import the sweet one forever'],
        answer: 1,
        right: 'That was her work, cross after cross after patient cross — including crosses between plants so distantly related that most botanists thought they were impossible. Her chromosome counts showed which doors were actually open.',
        wrong: 'Hoping does not mix chromosomes. She crossed them — cross after patient cross, guided by chromosome counts that showed which doors were actually open — including crosses most botanists thought impossible.'
      } },
    { art: ['janaki_ammal'], who: null,
      text: 'The work helped give India canes that were both: sweet canes for Indian fields, so the sweetness no longer had to be imported. Then she took her master key abroad: at a great genetics institute in England she and the scientist C. D. Darlington wrote the Chromosome Atlas of Cultivated Plants — a census of the chromosomes of the world\'s crops that researchers used for decades. At the Royal Horticultural Society\'s garden at Wisley, where she worked on magnolias, a magnolia she raised still flowers — and it is named Magnolia kobus \'Janaki Ammal\'.' },
    { art: ['janaki_ammal'], who: null, mood: 'wow',
      text: 'India asked her back, to reorganise the Botanical Survey of India — the great national accounting of every plant the land holds. And in her eighties she took up one more fight: scientists were campaigning to save Silent Valley, an ancient rainforest in Kerala, from being dammed and drowned. She joined them, studied it, spoke for it. The forest stands today, a national park, full of birdsong.' },
    { art: ['janaki_ammal'], who: 'mithu',
      text: 'A magnolia in England and a rainforest in Kerala both carry her memory, which is a fair pair of monuments for one botanist. Sweetness, it turns out, was her subject in more ways than one — and she worked, by her own habit, right to the end of a very long life.' }
  ],
  moral: 'Nobody had kept a seat for her, so she brought her own — and the whole field ended up rearranged around it.',
  source: 'Records of the Sugarcane Breeding Institute, Coimbatore; the Chromosome Atlas of Cultivated Plants (Darlington & Janaki Ammal, 1945); the Royal Horticultural Society, where Magnolia kobus \'Janaki Ammal\' is recorded at Wisley; the Botanical Survey of India\'s institutional history; documented accounts of the Silent Valley campaign, and the park\'s establishment in 1984.'
},

/* ================================================================ BHABHA ==== */
{
  id: 'sci-bhabha',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'A Home for Science',
  hook: 'A war trapped a young physicist in his own country. Instead of waiting for a ship back to England, he decided the science should move to India.',
  hero: 'bhabha',
  cast: ['bhabha', 'mithu'],
  minutes: 4,
  place: ['IN-MH'],
  words_hi: [['घर', 'ghar', 'home'], ['सपना', 'sapna', 'dream'], ['विज्ञान', 'vigyan', 'science']],
  scenes: [
    { art: ['bhabha'], who: null,
      text: 'Homi Jehangir Bhabha, born in Bombay in 1909, was by his twenties a physicist with a growing name at Cambridge, working on cosmic rays — particles that fall on us from space. In 1939 he came home to India on holiday. Then the Second World War broke out, the sea routes closed, and the holiday quietly became the rest of his life.' },
    { art: ['bhabha'], who: null, mood: 'think',
      text: 'He took a post at the Indian Institute of Science in Bangalore, in C. V. Raman\'s orbit, and looked hard at a fact he had always known: a young Indian who wanted to do the world\'s best physics had to leave India to do it. Not for lack of minds — for lack of a home. No buildings, no instruments, no salaries, no colleagues down the corridor. Science, he understood, is not a lone genius in a shed. It is a household, and India had never been given one.' },
    { art: ['bhabha'], who: null,
      text: 'So in 1944 — before India was even independent — he sat down and wrote a letter to the Sir Dorabji Tata Trust, proposing an institute for fundamental research. The letter survives, and one sentence in it has become famous: when nuclear energy was successfully used for power, he wrote, India would not have to look abroad for its experts, but would find them ready at hand. Nuclear power stations existed nowhere on Earth when he wrote that. He was budgeting for a future he could see and nobody had built.' },
    { art: ['bhabha'], who: null, mood: 'wow',
      text: 'The Trust said yes. The Tata Institute of Fundamental Research opened in 1945 and grew into its home by the sea in Bombay — and Bhabha, who was a genuinely fine painter himself, fussed over every detail of it: the gardens, the architecture, the modern paintings he hung on its walls, until the institute held one of India\'s great art collections. People asked why a physics institute needed beauty. He built it beautiful anyway; he did not believe fine minds grow in ugly rooms.' },
    { art: ['bhabha'], who: null,
      text: 'And the famous sentence came true on schedule. When India came to build its atomic programme, it did not have to look abroad — the scientists were ready at hand, trained in the house that Bhabha built. TIFR stands by the sea today, still doing mathematics and physics at the world\'s edge, gardens and paintings and all.' },
    { art: ['bhabha'], who: 'mithu',
      text: 'Plenty of people dream of doing great things themselves. Bhabha\'s dream was a building full of other people doing them — which is a rarer dream, and it outlives you better. Ask your family what they would build, if they could build one place for people to be brilliant in.' }
  ],
  moral: 'He did not wait for the future to arrive — he built the rooms it would need, and then it moved in.',
  source: 'Bhabha\'s letter of 1944 to the Sir Dorabji Tata Trust, which survives in the archives of the Tata Institute of Fundamental Research and is loosely quoted here from that documented text; TIFR\'s own institutional history, including its founding in 1945 and its art collection.'
},

/* ============================================================== SARABHAI ==== */
{
  id: 'sci-sarabhai',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'The Rocket in the Church',
  hook: 'India\'s space programme began in a fishing village in Kerala — in a church, with rocket parts arriving by bicycle and bullock cart. There are photographs.',
  hero: 'sarabhai',
  cast: ['sarabhai', 'mithu'],
  minutes: 5,
  place: ['IN-KL', 'IN-GJ'],
  words_hi: [['आकाश', 'aakash', 'sky'], ['साइकिल', 'saikil', 'bicycle'], ['शुरुआत', 'shuruaat', 'beginning']],
  scenes: [
    { art: ['sarabhai'], who: null,
      text: 'Vikram Sarabhai was born in 1919 into a great mill-owning family of Ahmedabad, in Gujarat, and could have spent his life comfortably running factories. Instead he studied cosmic rays, and in 1947 — eleven days into India\'s independence, aged twenty-eight — he founded a physics laboratory in Ahmedabad. He was a builder of institutions the way some people are collectors of stamps: he simply could not stop.' },
    { art: ['sarabhai'], who: null, mood: 'think',
      text: 'In 1962 India asked him to start something that sounded, frankly, absurd: a space programme, in a country where most villages had no electricity. Plenty of sensible people said so out loud.',
      ask: {
        q: 'A young country with little money, 1962. Should it really be spending on rockets?',
        options: ['No — roads and schools first, space later', 'Yes — to race the rich countries to the Moon', 'Yes — if the rockets work FOR the fields and the classrooms'],
        answer: 2,
        right: 'That was Sarabhai\'s own argument, in his documented words: India had no fantasy of racing anyone to the Moon — but if satellites could watch the monsoon, connect the country and teach village schools by television, then India must be second to none.',
        wrong: 'Sarabhai answered exactly this doubt, in words that are still quoted: India had no fantasy of racing anyone to the Moon — but if satellites could watch the monsoon, connect the country and teach village schools by television, then India must be second to none.'
      } },
    { art: ['sarabhai'], who: null,
      text: 'For the first launch site his scientists needed a spot close to the magnetic equator, where the upper air is at its most interesting. The map pointed at Thumba — a quiet fishing village near Thiruvananthapuram in Kerala. And in the middle of the chosen ground stood the village\'s church, St Mary Magdalene\'s. The bishop and the parish talked it over — and gave their church to the nation\'s science, moving their prayers to a new church built nearby.' },
    { art: ['sarabhai'], who: null, mood: 'wow',
      text: 'So India\'s space programme moved into a church. The altar end became a laboratory; the bishop\'s house became the office; and because there was hardly any transport, rocket parts travelled the last stretch by bicycle and by bullock cart — and the photographs of that survive in ISRO\'s archives, some of the best-loved pictures in Indian science. On 21 November 1963, the first sounding rocket rose from Thumba into the evening sky. Honesty note: that first rocket was borrowed from America, with help from friends abroad — a beginning is allowed to borrow.' },
    { art: ['sarabhai'], who: null,
      text: 'From that church grew ISRO, the Indian Space Research Organisation — the organisation that went on to put satellites over every monsoon, television into village schools exactly as promised, and, in time, spacecraft around the Moon and Mars. Sarabhai did not live to see most of it; he died in 1971, at just fifty-two. The programme he planted kept his promise for him.' },
    { art: ['sarabhai'], who: 'mithu',
      text: 'The church at Thumba is a space museum now — you can walk in and see the rockets where the pews were. A village that lent its holiest building, scientists on bicycles, and a man who promised the sky would work for the fields. That is how India went to space. Beginnings are allowed to be small; they are not allowed to be small-hearted.' }
  ],
  moral: 'Aim at the sky, and load the rocket on whatever the village actually has — a beginning that waits for perfect equipment never begins.',
  source: 'ISRO\'s own history of the Thumba Equatorial Rocket Launching Station — the church of St Mary Magdalene, the relocated parish, and the bicycle and bullock-cart photographs are in its archives; the launch of 21 November 1963 (an American Nike-Apache) is in ISRO records; Sarabhai\'s "second to none" argument is from his documented statements; the Physical Research Laboratory, Ahmedabad, for his founding years.'
},

/* =========================================================== SWAMINATHAN ==== */
{
  id: 'sci-swaminathan',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'The Wheat That Would Not Fall Over',
  hook: 'India was living ship-to-mouth, waiting on grain boats. The fix turned out to hinge on something absurdly simple: the height of a wheat stem.',
  hero: 'swaminathan',
  cast: ['swaminathan', 'mithu'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['गेहूँ', 'gehoon', 'wheat'], ['खेत', 'khet', 'field'], ['फ़सल', 'fasal', 'harvest']],
  scenes: [
    { art: ['swaminathan'], who: null,
      text: 'Monkombu Sambasivan Swaminathan, born in Kumbakonam in Tamil Nadu in 1925, was a student in 1943 when famine struck Bengal and people died in the streets in numbers that are hard to write down. He said ever afterwards that it was this that decided him: he had been headed for medicine, and he turned instead to the science of growing food. He wanted, he said, a hungry-proof India.' },
    { art: ['swaminathan'], who: null, mood: 'think',
      text: 'By the 1960s India was importing wheat by the shipload and eating it almost off the docks — people called it living ship-to-mouth. Here was the maddening trap: give Indian wheat plenty of water and fertiliser and it grew tall, top-heavy — and then fell flat in the wind and rotted in the mud. Feed it well and you flattened it.',
      ask: {
        q: 'Well-fed wheat grows tall and falls over. What do you change?',
        options: ['Feed it less, harvest less, stay hungry', 'Hold every stalk up with sticks', 'Change the plant itself — a short, strong stem that spends the food on grain'],
        answer: 2,
        right: 'That was the answer: dwarf wheat. A short, stiff stem that stands firm and pours the extra feeding into the head of grain instead of into height.',
        wrong: 'You cannot put sticks under a million fields. The answer was to change the plant itself: dwarf wheat, short and stiff, standing firm and pouring the extra feeding into grain instead of height.'
      } },
    { art: ['swaminathan'], who: null, mood: 'wow',
      text: 'Swaminathan and his colleagues brought in the dwarf wheats bred by Norman Borlaug in Mexico — he invited Borlaug to India in 1963 — and crossed and trialled them for Indian fields and Indian rotis. Farmers, above all in Punjab, took the new seed and ran with it. In 1968 the wheat harvest came in so far beyond anything before it that in places there was nowhere to put the grain — the histories of that year record schools being closed so the classrooms could be used to store wheat. They called it the Green Revolution, and the ships stopped.' },
    { art: ['swaminathan'], who: null, mood: 'sad',
      text: 'And one honest sentence, because this story has earned it: the new farming drank deep — heavy water, heavy fertiliser — and in time the land began presenting its bills, in tired soils and falling wells. Swaminathan said so himself, and spent his later decades on what he called an evergreen revolution — his own phrase — meaning harvests that stay high without wearing out the earth that gives them. Feeding people turned out to be not one problem but a problem you must keep solving.' },
    { art: ['swaminathan'], who: 'mithu',
      text: 'When the World Food Prize was created in 1987, the first one ever awarded went to Swaminathan. From a boy watching a famine to a country with its granaries full — measured out in something as small as the height of a stem. Big doors swing on small hinges.' }
  ],
  moral: 'He fed a country and then kept asking whether he had done it right — the second thing is as rare as the first.',
  source: 'M. S. Swaminathan\'s own accounts of 1943 and the wheat years, as recorded by the M. S. Swaminathan Research Foundation; documented histories of the 1968 harvest, including the schools-as-granaries detail; "evergreen revolution" is his own published phrase; World Food Prize records, 1987.'
},

/* ============================================================== SALIM ALI === */
{
  id: 'sci-salimali',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'The Fall of a Sparrow',
  hook: 'A ten-year-old with an airgun shot a sparrow — and the question he asked next turned him into the Birdman of India. He told the story himself.',
  hero: 'salimali',
  cast: ['salimali', 'mithu'],
  minutes: 4,
  place: ['IN-MH'],
  words_hi: [['चिड़िया', 'chidiya', 'bird'], ['पंख', 'pankh', 'feather'], ['धैर्य', 'dhairya', 'patience']],
  scenes: [
    { art: ['salimali'], who: null,
      text: 'Salim Ali grew up in Bombay around 1900, an orphan raised in a big, warm houseful of uncles and cousins, and like a lot of boys then he had an airgun and used it on sparrows. One day he picked up a sparrow he had shot and stopped. On its throat was a patch of yellow. Sparrows, every boy knew, do not have yellow throats. So what exactly was lying in his hand?' },
    { art: ['salimali'], who: null, mood: 'think',
      text: 'He could have shrugged. Instead he carried the bird to his uncle, who did an unusually wise thing for a busy uncle: he sent the boy with a note to the Bombay Natural History Society. There, a courteous Englishman named W. S. Millard did not laugh at a small boy with a dead sparrow. He opened drawer after drawer of carefully kept bird skins until they found the match: a yellow-throated sparrow. Then he kept opening drawers — and showed the boy stuffed birds beyond anything he had imagined, and lent him books. Salim Ali told this story all his life; it is the opening of his own memoir.' },
    { art: ['salimali'], who: null, mood: 'wow',
      text: 'The boy who had shot birds became the man who counted them. For decade after decade Salim Ali walked India doing bird surveys — princely state by princely state, forest by marsh by mountain — with notebooks, patience and famously little money, finding out for the first time exactly which birds lived where in India. Then he put it in a book ordinary people could afford, The Book of Indian Birds, and taught a whole country the names of its own neighbours.' },
    { art: ['salimali'], who: null,
      text: 'And because he knew where the birds lived, he knew what they could not live without. When the wetland at Bharatpur — a city of nesting storks, herons and cranes, and winter home to birds from across the world — needed defending, his voice was one of the loudest raised for it; he fought similar corners all his life, Silent Valley\'s rainforest among them. Bharatpur is the Keoladeo National Park today. The birds still arrive every winter, on schedule.' },
    { art: ['salimali'], who: null,
      text: 'When he finally wrote his life down, he named the book after the bird that began it: The Fall of a Sparrow. He never pretended the beginning was tidy — a shot bird, a boy\'s bad aim, a stab of curiosity. What he did with the next seventy years is the part he offered as the lesson.' },
    { art: ['salimali'], who: 'mithu',
      text: 'Next bird you see — actually look at it. Throat, wings, how it flies, what it says. If you can find out its name, you have started exactly where the Birdman of India started. No airgun required; he would be the first to say so.' }
  ],
  moral: 'He was not the boy who never did wrong — he was the boy who looked closely at what he had done, and asked.',
  source: 'Salim Ali\'s own memoir, The Fall of a Sparrow (1985) — the yellow-throated sparrow, Mr Millard and the drawers of bird skins are his own telling; the Bombay Natural History Society\'s records of his surveys; Keoladeo National Park\'s documented history.'
},

/* ================================================================= KALAM ==== */
{
  id: 'sci-kalam',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'The Newspaper Boy of Rameswaram',
  hook: 'The train stopped stopping at his island town, so the newspapers came flying out of a moving carriage — into the hands of a boy who would one day fly rockets.',
  hero: 'kalam',
  cast: ['kalam', 'mithu'],
  minutes: 5,
  place: ['IN-TN'],
  words_hi: [['अख़बार', 'akhbaar', 'newspaper'], ['उड़ान', 'udaan', 'flight'], ['मेहनत', 'mehnat', 'hard work']],
  scenes: [
    { art: ['kalam'], who: null,
      text: 'Avul Pakir Jainulabdeen Abdul Kalam was born in 1931 in Rameswaram, the island temple-town at the very toe of Tamil Nadu, where his father owned a wooden boat that ferried pilgrims. A house of little money and much steadiness — his memoir remembers his father\'s honesty and his mother\'s kindness as the family\'s actual wealth. Half the town were his relatives, and the sea was at the end of every street.' },
    { art: ['kalam'], who: null,
      text: 'Then the Second World War reached even Rameswaram\'s railway line: the train stopped halting at the station, and the town\'s newspapers had to be flung out in bundles from the moving carriage. His cousin Samsuddin, who distributed the papers, needed a boy quick enough to catch them. So every dawn, Abdul caught the news out of the air, ran his delivery rounds, and then went to school. It was the first money he ever earned, and he wrote half a century later that he could still feel the pride of it.' },
    { art: ['kalam'], who: null, mood: 'wow',
      text: 'He told, all his life, of a schoolteacher in Rameswaram who one day taught the class how birds fly — drawing the bird on the board, the wing, the lift, the tail steering — and, when the class did not follow, took the boys to the seashore in the evening to watch the seabirds do it. Kalam said that was the day his life found its subject. The boy who caught flying newspapers decided his business would be flight.' },
    { art: ['kalam'], who: null,
      text: 'The road ran through physics in Tiruchirappalli and aeronautical engineering in Madras, and into India\'s rocket programme in its bicycle-and-bullock-cart infancy. In time he was made project director of the SLV-3 — India\'s attempt to build a launcher of its very own. The first attempt, in 1979, failed and fell into the sea, with Kalam in charge and the country watching; his memoir is honest about how that felt. On 18 July 1980 the next SLV-3 climbed all the way, and put the satellite Rohini into orbit. India could now reach space from its own soil, on its own rocket.' },
    { art: ['kalam'], who: null, mood: 'wow',
      text: 'Missiles and rockets made him famous; children made him beloved. In 2002 the newspaper boy of Rameswaram was elected President of India — and the morning papers, the kind he had once caught out of the air at a moving train, now carried his photograph on the front page. As President he answered children\'s letters and quizzed schoolrooms and was, by unanimous agreement of everyone under twelve, the children\'s own President.' },
    { art: ['kalam'], who: 'mithu',
      text: 'He spent his last afternoon, in 2015, doing the thing he had chosen over every comfort: teaching students. Catch what today throws at you, his story keeps saying — a newspaper bundle will do — and mind the teachers who show you birds. You cannot tell, from the platform of a small station, how far the line runs.' }
  ],
  moral: 'The distance from a small town to the sky is real — and it is crossed at dawn, one caught bundle at a time.',
  source: 'A. P. J. Abdul Kalam\'s own memoir Wings of Fire (1999) — the wartime newspapers, cousin Samsuddin, the first wages and the 1979 failure are his own telling, and the seashore bird-flight lesson is from his own recounted schooldays; ISRO records for the SLV-3 launch of Rohini, 18 July 1980; the presidency (2002–2007) is public record.'
},

/* ============================================================= ANNA MANI === */
{
  id: 'sci-annamani',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'The Girl Who Refused the Earrings',
  hook: 'On her eighth birthday, her family offered the customary gift of diamond earrings. She had a different request — and it ran her whole life.',
  hero: 'annamani',
  cast: ['annamani', 'mithu'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['मौसम', 'mausam', 'weather'], ['हवा', 'hawa', 'wind'], ['जिज्ञासा', 'jigyasa','curiosity']],
  scenes: [
    { art: ['annamani'], who: null, mood: 'think',
      text: 'Anna Mani was born in 1918 in Peermade, in the hills of Kerala, into a prosperous family with settled ideas about what girls were for. By eight she had read most of what her town could offer a child. Then came her eighth birthday, and with it the family custom: a gift of diamond earrings.',
      ask: {
        q: 'The earrings are offered — beautiful, expensive, the proper gift. What did Anna ask for instead?',
        options: ['A bigger pair of earrings', 'A set of encyclopaedias', 'Nothing at all'],
        answer: 1,
        right: 'A set of encyclopaedias — instead of diamonds. She told this story herself, all her life, and it is the truest introduction she could have: a person who, offered sparkle, asked for the whole world in volumes.',
        wrong: 'What she asked for — and she told this story herself, all her life — was a set of encyclopaedias. Offered sparkle, she asked for the whole world in volumes, and the family library never recovered.'
      } },
    { art: ['annamani'], who: null,
      text: 'The reading girl became a physics student in Madras, and then a researcher in the laboratory of C. V. Raman himself — you have met him earlier on this shelf — where she spent years teasing out the secrets of light inside diamonds and rubies. She wrote five research papers of real quality. And here the record must be honest, because itihaas is honest: on a technicality of paperwork, the university never granted her the doctorate her work had earned. She shrugged, in her way, and got on with the science.' },
    { art: ['annamani'], who: null, mood: 'think',
      text: 'In 1948, after training in instrument-making in England, she joined the Meteorological Department of newly independent India — and found a quiet embarrassment: nearly every instrument India used to read its own weather, every barometer and thermometer and rain gauge, was imported. A country whose farms, ships and monsoon forecasts hung on the weather could not build the tools that measured it.' },
    { art: ['annamani'], who: null, mood: 'wow',
      text: 'Anna Mani made that her life\'s work. She gathered and standardised the drawings of about a hundred weather instruments and drove Indian workshops to manufacture them to her exacting standards — she was famously exacting — until the weather service of India ran on instruments made in India, and the importing stopped. Almost nothing in a museum will show you her work; it hangs instead, by the thousand, in every weather station in the country.' },
    { art: ['annamani'], who: null,
      text: 'She kept going where the air got thinner. She built and flew instruments to measure ozone — the fragile, invisible layer that shields all life from the sun\'s harshest rays — years before the world grew properly worried about it, and served on the international commission that watches it. And in her so-called retirement she turned to the wind: measuring stations across the country, handbooks of India\'s winds and sunshine — the quiet groundwork under the wind farms that turn on Indian ridges today.' },
    { art: ['annamani'], who: 'mithu',
      text: 'Diamond earrings sparkle for one person. A weather service, an ozone record and a wind atlas work for a billion. She knew the difference at eight years old — and never once changed her mind.' }
  ],
  moral: 'She spent her life measuring what cannot be seen — wind, ozone, the weight of air — and her trick was always the same: build the instrument yourself.',
  source: 'The World Meteorological Organization\'s published tribute to Anna Mani; her documented interviews, retold in Abha Sur\'s "Dispersed Radiance", which carry the encyclopaedia-instead-of-earrings story in her own telling, and the Raman-laboratory years with the withheld doctorate; India Meteorological Department institutional history for the standardisation of some hundred weather instruments, the ozone work and International Ozone Commission membership, and the solar radiation and wind-energy handbooks and survey stations of her later years.'
},

/* =========================================================== TESSY THOMAS == */
{
  id: 'sci-tessy',
  collection: 'vigyan',
  badge: 'itihaas',
  title: 'The Engineer Who Steered the Fire',
  hook: 'A rocket is easy to light and very hard to steer. When India needed someone to lead its longest-flying missile, the record shows who got the job.',
  hero: 'tessy',
  cast: ['tessy', 'mithu'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['अग्नि', 'agni', 'fire'], ['दिशा', 'disha', 'direction'], ['लक्ष्य', 'lakshya', 'aim']],
  scenes: [
    { art: ['tessy'], who: null,
      text: 'Tessy Thomas was born in 1963 in Alappuzha, Kerala — a town of canals and coir — and named, her family has said, after Mother Teresa. She was a child of the same Kerala coast where, down at Thumba, India\'s first rockets were rising from a fishing village; you have read that story on this shelf. She grew up good at mathematics and better at not letting go of a problem.' },
    { art: ['tessy'], who: null, mood: 'think',
      text: 'She studied engineering, and in 1988 joined DRDO — the organisation that builds India\'s defence technology — where she was put to work on the Agni programme, the long-range missiles named for fire, in the years when A. P. J. Abdul Kalam led those corridors. Her specialism was the deep end of the field: guidance. Lighting a rocket is the loud part. The hard part is everything after — a machine that must know, every single second of a flight across thousands of kilometres, exactly where it is, where it is going, and how to correct itself, alone, at enormous speed, with nobody able to reach it.' },
    { art: ['tessy'], who: null,
      text: 'She spent twenty years mastering that art — guidance, trajectory, the fierce physics of re-entry, when a returning craft must survive its own meteor-hot plunge back through the air. She rose the way engineers respect most: flight by flight, problem by solved problem. Missile teams keep no polite fictions; the bird flies or it does not, and everyone knows whose work is aboard.' },
    { art: ['tessy'], who: null, mood: 'wow',
      text: 'In 2011, Agni-IV flew successfully with Tessy Thomas as its project director — the first woman ever to lead an Indian missile project. And on 19 April 2012 came the bigger day: the first flight of Agni-V, the longest-legged missile India had ever built, able to cross five thousand kilometres — a capability only a handful of nations possess. She was its programme director. The launch worked. The newspapers, reaching for a name equal to the moment, coined one: Agniputri — daughter of fire. The nickname is the press\'s invention, and she has worn it lightly; her own word for herself has always been simpler. Engineer.' },
    { art: ['tessy'], who: null,
      text: 'The work carried her on: she went on to head all of DRDO\'s aeronautical systems — thousands of engineers, everything that flies. Ask what mattered in her story and the record answers plainly: not that a woman finally led a missile programme, but that the missiles she led flew true — and that every girl in India doing her mathematics homework now knows, as a settled fact, that this door stands open.' },
    { art: ['tessy'], who: 'mithu',
      text: 'Anyone can light a fire. The rare skill is teaching it, second by second, exactly where to go — in a missile, and, if you think about it, in a life.' }
  ],
  moral: 'Lighting the fire is the easy part. Steering it — patiently, precisely, all the way to the far target — is the work of a lifetime.',
  source: 'DRDO\'s record and contemporary press reporting: Tessy Thomas joined DRDO in 1988 and worked on the Agni programme; project director of Agni-IV (successful flight, 2011) and programme director for the first Agni-V flight of 19 April 2012 — the first woman to lead an Indian missile project — later Director General of Aeronautical Systems, DRDO. "Agniputri" is the Indian press\'s coinage from the Agni-V reporting and is attributed to the press here; no remark is invented for her or anyone else.'
}
];

window.IND_COLLECTIONS_VIGYAN = [
  { id: 'vigyan', name: 'Vigyan — The Scientists', avatar: 'raman',
    note: 'Real people, real evidence. The ones who asked the question everyone else had stopped asking.' }
];
