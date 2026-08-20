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
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: '"ईसवी सन् 499 में, बिहार में आज के पटना के पास कुसुमपुर में, एक विद्वान ने गणित और खगोलशास्त्र की एक ऐसी किताब पूरी की जो पूरी तरह से पद्यों में लिखी गई थी, ताकि उसे याद रखकर अपने दिमाग में संजोया जा सके। हमें ठीक-ठीक पता है कि यह कब हुआ, और हम यह भी जानते हैं कि उनकी उम्र कितनी थी, क्योंकि उन्होंने खुद किताब के अंदर हमें बताया है: तेईस साल। इस किताब का नाम \'आर्यभटीय\' है, और लोग तब से आज तक इसे पढ़ते आ रहे हैं।"',
      text: 'In the year 499 CE, in Kusumapura — near today\'s Patna, in Bihar — a scholar finished a book of mathematics and astronomy written entirely in verse, so that it could be memorised and carried in people\'s heads. We know exactly when, and we know how old he was, because he tells us himself, inside the book: twenty-three. The book is called the Aryabhatiya, and people have been studying it ever since.' },
    { art: ['aryabhata'], who: null, mood: 'think',
      hi: '"उनकी एक समस्या बहुत पुरानी थी: अनगिनत संकेतों में डूबे बिना आप बहुत बड़ी संख्याओं को कैसे लिख सकते हैं? उनकी किताब जिस उत्तर पर काम करती है, वह वही है जिसे आप बिना ध्यान दिए हर रोज़ इस्तेमाल करते हैं — कोई अंक कहाँ बैठता है, यही तय करता है कि उसका मान क्या है। 25 में 2 का मतलब बीस होता है। 205 में 2 का मतलब दो सौ होता है। जिससे एक अजीब सा सवाल सामने आता है: 205 में, बीच में काम कौन कर रहा है?"',
      text: 'One of his problems was very old: how do you write enormous numbers without drowning in symbols? The answer his book works with is the one you use every day without noticing — WHERE a digit sits decides what it is worth. The 2 in 25 means twenty. The 2 in 205 means two hundred. Which forces a strange question: in 205, what is doing the work in the middle?',
      ask: {
        q: 'What sits in the middle of 205, holding the tens place open?',
        options: ['Nothing — you could leave it out', 'A nothing that has to be WRITTEN, or the whole number collapses', 'A very small one'],
        answer: 1,
        right: 'That is the deep idea. Leave it out and 205 becomes 25. The empty place must be marked — nothing, doing the work of something.',
        wrong: 'Try leaving it out: 205 becomes 25, and your two hundred vanishes. The empty place has to be MARKED. Nothing, doing the work of something.'
      } },
    { art: ['aryabhata'], who: null,
      hi: '"भारत में उस चिह्नित खालीपन को \'शून्य\' कहा जाने लगा। गणित के इतिहासकार आर्यभट के संख्याओं के साथ काम करने के तरीके को एक ऐसी जगह बताते हैं जहाँ यह विचार पहले से ही अपनी पूरी ताकत दिखा रहा था — और यही वह विचार है, वह खाली जगह जो मायने रखती है, जिसका ज़िक्र लोग तब करते हैं जब वे कहते हैं कि भारत ने दुनिया को शून्य दिया। इसके लिए सबसे पहले वह छोटा गोल चिह्न किसने बनाया? कोई भी इसे साबित नहीं कर सकता। बड़े लोग आज भी शोध-पत्रिकाओं में इस बात पर खुशी-खुशी बहस करते हैं।"',
      text: 'In India that marked emptiness came to be called shunya. Historians of mathematics point to Aryabhata\'s way of working with numbers as a place where the idea is already pulling its weight — and it is this idea, the empty place that counts, that people mean when they say India gave the world zero. Who first drew the little round symbol for it? Nobody can prove it. Grown-ups still argue about that one, happily, in journals.' },
    { art: ['aryabhata'], who: null, mood: 'wow',
      hi: '"और फिर यह किताब एक ऐसी बात कहती है जिस पर उस समय धरती पर शायद ही किसी ने विश्वास किया हो। आर्यभट लिखते हैं कि तारे हर रात हमारे चारों ओर चक्कर नहीं लगाते — बल्कि धरती खुद घूम रही है। जिस तरह चलती नाव में बैठा व्यक्ति नदी किनारे के पेड़ों को पीछे छूटते हुए देखता है, वे अपने पद्य में कहते हैं, ठीक उसी तरह हम, घूमती हुई धरती पर सवार होकर, तारों को पश्चिम की ओर बढ़ते देखते हैं। आप आज भी उस श्लोक को पढ़ सकते हैं। उन्होंने एक नाव से धरती के घूमने की पहेली सुलझा ली थी।"',
      text: 'And then the book says something that almost nobody on Earth believed at the time. The stars, Aryabhata writes, do not wheel around us each night — the Earth itself is turning. Just as a person in a moving boat sees the trees on the riverbank drift backwards, he says in his verse, so we, riding the turning Earth, see the stars drift west. You can still read that verse today. He worked out the turning from a boat.' },
    { art: ['aryabhata'], who: null, mood: 'sad',
      hi: '"उनके बाद आने वाले ज़्यादातर खगोलशास्त्रियों ने इसे नकार दिया। घूमती हुई धरती! हमें तो ज़रूर इसका अहसास होता। कइयों ने उनकी किताब की नकल तो की लेकिन उस हिस्से को "सुधार" दिया, और लगभग एक हज़ार साल और पाठ्यपुस्तकों में थमी हुई धरती का ही राज रहा, जब तक कि दूसरे देशों के दूरबीनों ने आखिरकार उनकी ही बात साबित नहीं कर दी। समय से पहले सही होना एक अकेलापन भरा काम हो सकता है — जब तक बाकी सब वहाँ नहीं पहुँच जाते, तब तक सबूत ही आपका साथ निभाते हैं।"',
      text: 'The astronomers who came after him mostly said no. A spinning Earth! Surely we would feel it. Many copied his book but "corrected" that part, and the still Earth stayed in charge of the textbooks for about a thousand years more, until telescopes in other countries settled it his way. Being right early can be a lonely business — the evidence keeps you company until everyone else arrives.' },
    { art: ['aryabhata'], who: 'mithu',
      hi: '"1975 में, जब भारत ने अपना पहला उपग्रह अंतरिक्ष में भेजा, तो उसे एक नाम की ज़रूरत थी। उन्होंने उसका नाम \'आर्यभट\' रखा। जिस इंसान ने कहा था कि धरती घूमती है, वह घूमती हुई धरती के चक्कर लगा रहा था। उन्हें यह नज़ारा ज़रूर पसंद आता।"',
      text: 'In 1975, when India sent up its very first satellite, it needed a name. They called it Aryabhata. The man who said the Earth turns, riding around the turning Earth. He would have liked the view.' }
  ],
  moral: 'A question written down carefully can wait a thousand years for the world to catch up — and it keeps.',
  source: 'The Aryabhatiya of Aryabhata (499 CE) — his own verses give his age and the boat comparison for the turning Earth — as read in standard histories of Indian mathematics such as Kim Plofker\'s Mathematics in India. The satellite Aryabhata (1975) is in ISRO\'s records.'
},

/* ============================================================== J C BOSE ==== */
{
  id: 'sci-jcbose',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: '"1890 के दशक में जगदीश चंद्र बोस कोलकाता के प्रेसीडेंसी कॉलेज में फ़िज़िक्स पढ़ाते थे। उनकी लैब नाम भर की लैब थी — एक छोटा-सा कमरा, और साज़ो-सामान के लिए न के बराबर पैसे। इसलिए उन्होंने वहीं के कारीगरों के साथ मिलकर अपने उपकरण खुद बनाए, और वे इतने शानदार निकले कि दुनिया में सबसे बेहतरीन साबित हुए। 1895 में उन्होंने उन्हीं में से एक यंत्र से कोलकाता के एक हॉल में दीवारों के पार अदृश्य तरंगें भेजीं और दूर रखी एक घंटी बजा दी — यानी रेडियो तरंगें, तब जब दुनिया के ज़्यादातर लोगों ने ऐसी किसी चीज़ का नाम भी नहीं सुना था।"',
      text: 'Jagadish Chandra Bose taught physics at Presidency College in Kolkata in the 1890s, in a laboratory that was barely a laboratory — a small room, almost no money for equipment. So he built his own instruments, working with local metalworkers, and they turned out to be some of the finest instruments anywhere. In 1895 he used one set of them to send invisible waves through walls across a Kolkata hall, ringing a bell at a distance — radio waves, years before most of the world had heard of such a thing.' },
    { art: ['jcbose'], who: null, mood: 'think',
      hi: '"लेकिन एक सवाल उनका पीछा नहीं छोड़ रहा था, और वह पौधों के बारे में था। कुत्ता दौड़ता है, इंसान चिल्लाता है — पर पौधा, जो इन दोनों में से कुछ नहीं कर सकता, वो आपसे कुछ कैसे कहेगा? बोस का जवाब था: ऐसा तरीका बनाओ जिससे उसकी आवाज़ सुनी जा सके। उनके बनाए क्रेस्कोग्राफ़ ने पौधे के बढ़ने को हज़ारों गुना बड़ा करके दिखाया, ताकि जो बढ़त आँखों से कभी न दिखती, वह एक चलती हुई लकीर बन गई जिसे आप देख सकते थे — एक पौधा, आपकी आँखों के सामने बढ़ता हुआ।"',
      text: 'But the question that would not let go of him was about plants. A dog runs, a person cries out — how would a plant, which can do neither, ever tell you anything? Bose\'s answer: build it a way to be heard. His crescograph magnified a plant\'s growth many thousands of times, so that growth too slow for any eye became a moving line you could watch — a plant, growing, live.' },
    { art: ['jcbose'], who: null, mood: 'wow',
      hi: '"और उस लकीर में एक ख़बर छिपी थी। पौधे को ठंडा करो, तो लकीर धीमी पड़ जाती। उसे ज़ोर से छुओ या कोई ख़राब चीज़ पीने को दो, तो लकीर लड़खड़ाती और सहम जाती। पौधा सचमुच जवाब दे रहा था — वह यूँ ही चुपचाप नहीं बैठा था, बल्कि अपने शांत और धीमे अंदाज़ में अपनी दुनिया पर असर दिखा रहा था। बोस यूरोप की बड़ी-बड़ी विज्ञान सभाओं में गए और कोलकाता में बनाए अपने उपकरणों से यह सब करके दिखाया।"',
      text: 'And the line had news in it. Chill the plant, and the line slowed. Touch it roughly, give it something nasty to drink, and the line stumbled and flinched. The plant was responding — not sitting there at all, but reacting to its world, in its own silent, slow-motion way. Bose travelled to the great scientific societies of Europe and showed them, with the instruments he had built in Kolkata.' },
    { art: ['jcbose'], who: null,
      hi: '"और यहीं से यह कहानी एक बड़े फ़ैसले का मोड़ लेती है। उनके इस यंत्र — और उससे पहले उनके रेडियो तरंगों वाले उपकरणों — जैसी चीज़ों से ही उस ज़माने में लोग भारी दौलत बना रहे थे। कंपनियाँ जो भी सामने आता, उसी का पेटेंट करा रही थीं। पर बोस कोई अमीर आदमी नहीं थे।"',
      text: 'And here is where the story turns into a decision. Instruments like his — and his radio-wave devices before them — were exactly the kind of thing fortunes were being built on. Companies were patenting everything in sight. He was not a rich man.',
      ask: {
        q: 'You have invented instruments the world wants. What do you do with them?',
        options: ['Patent everything and name your price', 'Sell them to one company, quietly', 'Refuse to fence them in — publish how they work, for anyone'],
        answer: 2,
        right: 'That was Bose\'s choice, made on purpose, more than once. Friends once filed a patent for him in America; he let it lapse. He believed knowledge grows best unfenced.',
        wrong: 'Bose chose the strangest option: he refused to fence his inventions at all. Friends once filed a patent for him in America — he let it lapse. He believed knowledge grows best unfenced.'
      } },
    { art: ['jcbose'], who: null,
      hi: '"1917 में उन्होंने कोलकाता में बोस इंस्टीट्यूट खोला — जो एशिया के सबसे पहले रिसर्च संस्थानों में से एक था — और अपने सारे उपकरण, अपने तरीके और अपनी ज़िंदगी भर की कमाई आने वाले लोगों के लिए वहीं सौंप दी। वह संस्थान आज भी वहीं है, और आज भी काम कर रहा है।"',
      text: 'In 1917 he opened the Bose Institute in Kolkata — one of the first research institutes in Asia — and gave his instruments, his methods and his life\'s work to it, for whoever came next. It is still there, still working.' },
    { art: ['jcbose'], who: 'mithu',
      hi: '"अगली बार जब तुम खिड़की पर रखे किसी पौधे को रोशनी की तरफ़ झुकते देखो, तो याद रखना: वह इसी पल, धीरे-धीरे, कुछ कर रहा है। बोस ने वह मशीन बनाई जिससे लोग यह सब होते हुए देख सके। पौधा कभी भी बस यूँ ही नहीं बैठा था। और न ही बोस।"',
      text: 'Next time you see a plant on a windowsill leaning towards the light, remember: it is doing something, slowly, right now. Bose built the machine that let people watch it happen. The plant was never just sitting there. Neither was he.' }
  ],
  moral: 'The quietest things are not silent — sometimes nobody has built the right way to listen yet.',
  source: 'Institutional history of the Bose Institute, Kolkata (founded by Bose, 1917), and records of his demonstrations to the Royal Society; his 1895 Kolkata demonstration and his refusal to patent — including the lapsed American patent filed by friends — are documented there and in standard biographies.'
},

/* ============================================================== C V RAMAN === */
{
  id: 'sci-raman',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: 'तमिलनाडु के तिरुचिरापल्ली में जन्मे चंद्रशेखर वेंकट रामन, सन 1921 में पानी के जहाज़ से लंदन से घर लौट रहे थे, और भूमध्य सागर गज़ब का नीला दिख रहा था। किताबों में इसका जवाब तैयार था: महान लॉर्ड रेले ने कहा था कि समुद्र में आसमान का अक्स दिखता है, और सब बस वही दोहराते रहे। रामन रेलिंग के पास खड़े रहे और देर तक पानी को देखते रहे। दोहराते रहने का मतलब यह तो नहीं कि बात की जाँच भी की गई हो।',
      text: 'Chandrasekhara Venkata Raman, born in Tiruchirappalli in Tamil Nadu, was sailing home from London in 1921, and the Mediterranean was outrageously blue. The books had an answer ready: the sea reflects the sky, said the great Lord Rayleigh, and everyone repeated it. Raman stood at the rail and looked at the water for a long time. Repeating is not checking.' },
    { art: ['raman'], who: null, mood: 'wow',
      hi: 'उनके सामान में एक छोटा-सा प्रकाश-उपकरण था — वे थे ही ऐसे मुसाफ़िर जिनके पास ऐसी चीज़ें होती हैं — और वह यंत्र झलकी हुई रोशनी को छानकर अलग कर सकता था। उन्होंने उसे समुद्र की तरफ़ घुमाया, ताकि आसमान का अक्स कटकर अलग हो जाए। अगर किताबें सही होतीं, तो वह नीला रंग भी उसके साथ ग़ायब हो जाना चाहिए था। पर नीला रंग तो वहीं रहा। समुद्र अपना रंग आसमान से उधार नहीं ले रहा था। पानी खुद सूरज की रोशनी को बिखेरकर अपना नीला रंग बना रहा था। जहाज़ के भारत पहुँचने तक, उन्होंने इस पर पूरा लेख लिख लिया था और उसे \'नेचर\' पत्रिका को डाक से भेज भी दिया था।',
      text: 'He had a small optical device in his luggage — he was the kind of traveller who would — and it could filter out reflected light. He pointed it at the sea, cutting away the sky\'s reflection. If the books were right, the blue should vanish with it. The blue stayed. The sea was not borrowing its colour from the sky. The water itself was scattering sunlight and making its own blue. By the time the ship reached India he had already written this up and posted it to the journal Nature.' },
    { art: ['raman'], who: null, mood: 'think',
      hi: 'रंग महज़ एक सच्चाई नहीं होता — वह तो पानी के भीतर से आया हुआ एक संदेश होता है। कोलकाता में अपनी प्रयोगशाला, \'इंडियन एसोसिएशन फ़ॉर द कल्टीवेशन ऑफ़ साइंस\' में लौटकर, रामन और उनके साथियों ने, ख़ास तौर पर के. एस. कृष्णन ने, सात साल अलग-अलग तरल पदार्थों से रोशनी गुज़ारने और उससे निकलने वाले नतीजों को समझने में बिता दिए। बुनियादी सवाल यह था: जब रोशनी किसी चीज़ के आर-पार गुज़रती है, तो क्या वह चीज़ रोशनी पर अपनी उंगलियों के निशान छोड़ जाती है?',
      text: 'A colour is not just a fact — it is a message from inside the water. Back at his laboratory in Kolkata, the Indian Association for the Cultivation of Science, Raman and his colleagues, above all K. S. Krishnan, spent seven years shining light through liquids and reading what came out. The question underneath: when light passes through a substance, does the substance leave its fingerprints on the light?' },
    { art: ['raman'], who: null, mood: 'wow',
      hi: '28 फ़रवरी 1928 को उन्हें साफ़-साफ़ जवाब मिल गया: बिखरी हुई रोशनी का एक नन्हा-सा हिस्सा अपना रंग बदलकर बाहर निकलता है — और यह बदलाव इस बात पर निर्भर करता है कि रोशनी किन अणुओं से टकराई थी। इसे \'रामन प्रभाव\' कहा जाता है, और इसका मतलब है कि चीज़ों को छुए बिना ही, सिर्फ़ रोशनी के ज़रिए यह पहचाना जा सकता है कि वे किस चीज़ से बनी हैं। आज दुनिया भर की प्रयोगशालाएँ इसका इस्तेमाल दवाइयों से लेकर पुरानी तस्वीरों और यहाँ तक कि मंगल ग्रह की सतह की जाँच के लिए करती हैं।',
      text: 'On 28 February 1928 they had it, unmistakably: a tiny fraction of the scattered light comes out with its colour shifted — and the shift depends on the molecules it met. It is called the Raman effect, and it means light can be used to identify what things are made of without touching them. Laboratories all over the world use it today, on everything from medicines to paintings to the surface of Mars.' },
    { art: ['raman'], who: null,
      hi: 'सन 1930 में रामन को भौतिकी का नोबेल पुरस्कार मिला — विज्ञान में नोबेल जीतने वाले वे एशिया के पहले व्यक्ति बने। उनकी जीवनी लिखने वाले बताते हैं कि उन्हें यह पुरस्कार मिलने का इतना पक्का भरोसा था कि एलान होने से महीनों पहले ही उन्होंने स्टॉकहोम के टिकट बुक करवा लिए थे। इसे या तो ज़बरदस्त आत्मविश्वास कह सकते हैं या फिर गज़ब की बेबाकी, और रामन के मामले में तो आम तौर पर ये दोनों ही बातें थीं।',
      text: 'In 1930 Raman won the Nobel Prize in Physics — the first person from Asia to win a science Nobel. His biographers tell that he was so sure it was coming, he booked his tickets to Stockholm months before the announcement. That is either tremendous confidence or tremendous cheek, and with Raman it was generally both.' },
    { art: ['raman'], who: 'mithu',
      hi: 'भारत 28 फ़रवरी को \'राष्ट्रीय विज्ञान दिवस\' के रूप में मनाता है, क्योंकि इसी दिन रोशनी ने अपना राज़ खोला था। और यह पूरी कहानी जहाज़ की रेलिंग पर खड़े उस मुसाफ़िर से शुरू होती है जिसने ऐसा सवाल पूछा, जिसका जवाब हर किताब पहले ही दे चुकी थी। और जैसा कि साबित हुआ, वह जवाब बिल्कुल ग़लत था। याद रखने लायक बात है यह।',
      text: 'India keeps 28 February as National Science Day, for the day the light gave up its secret. And it all runs back to a passenger at a ship\'s rail asking a question every book had already answered. Wrongly, as it turned out. Worth remembering, that.' }
  ],
  moral: 'The question everyone has stopped asking is exactly the one worth checking.',
  source: 'Raman\'s own note "The Colour of the Sea" (Nature, 1921), written on the 1921 voyage; Nobel Prize records (Physics, 1930); the Indian Association for the Cultivation of Science, Kolkata, where the 1928 experiments with K. S. Krishnan were done. The Stockholm-tickets story is as told in standard biographies (G. Venkataraman, Journey into Light).'
},

/* ============================================================ RAMANUJAN ===== */
{
  id: 'sci-ramanujan',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: 'तमिलनाडु के इरोड और कुंभकोणम के रहने वाले श्रीनिवास रामानुजन, मद्रास पोर्ट ट्रस्ट में एक क्लर्क के रूप में काम करते थे, जहाँ वे कम तनख्वाह पर दूसरों के माल की गिनती करते थे। वे कॉलेज में फेल हो गए थे — एक बार नहीं, दो बार — क्योंकि वे गणित के अलावा कुछ भी, बिल्कुल कुछ भी नहीं पढ़ते थे। उन्होंने अपने अनोखे तरीक़े से लिखे गणितीय नतीजों से एक के बाद एक कई कॉपियाँ भर दी थीं, ऐसा गणित जिसे उनके आस-पास कोई नहीं समझ सकता था, और दीये की रोशनी में वे स्लेट पर काम करते थे क्योंकि कागज़ ख़रीदने में पैसे लगते थे।',
      text: 'Srinivasa Ramanujan, from Erode and Kumbakonam in Tamil Nadu, worked as a clerk at the Madras Port Trust, counting other people\'s cargo for a small salary. He had failed out of college — twice — because he would study nothing, absolutely nothing, except mathematics. He filled notebook after notebook with results in his own strange notation, mathematics nobody around him could follow, and worked by lamplight on a slate because paper cost money.' },
    { art: ['ramanujan'], who: null,
      hi: 'जनवरी 1913 में उन्होंने एक बड़ी हिम्मत और थोड़ी बेबसी भरा काम किया: उन्होंने इंग्लैंड के सबसे मशहूर गणितज्ञों में से एक, जी. एच. हार्डी को ख़त लिखा — एक ऐसे इंसान को जिनसे वे कभी मिले नहीं थे, और एक ऐसे देश में जिसे उन्होंने कभी देखा नहीं था। उन्होंने बड़ी ईमानदारी से अपना परिचय एक ऐसे क्लर्क के रूप में दिया जिसके पास यूनिवर्सिटी की कोई डिग्री नहीं थी, और साथ में सौ से भी ज़्यादा प्रमेयों के पन्ने-के-पन्ने भेज दिए, बिना किसी सबूत के। कैम्ब्रिज के दो अन्य प्रोफ़ेसरों को भी उनसे ऐसे ख़त मिल चुके थे, और उन्होंने कोई जवाब नहीं दिया था।',
      text: 'In January 1913 he did a brave and slightly desperate thing: he wrote to G. H. Hardy, one of the most famous mathematicians in England — a man he had never met, in a country he had never seen. He introduced himself honestly as a clerk with no university degree, and enclosed page after page of theorems, more than a hundred of them, with no proofs. Two other Cambridge professors had already received such letters from him, and had not replied.',
      ask: {
        q: 'You are Hardy. Famous, busy — and here is a fat envelope of wild mathematical claims from an unknown clerk in Madras. What do you do?',
        options: ['Bin it — cranks write every week', 'Reply politely: get a degree first', 'Sit down and actually check the mathematics'],
        answer: 2,
        right: 'That is what Hardy did — first alone, then with his friend Littlewood, deep into the night. And the theorems fought back.',
        wrong: 'Hardy nearly did. But something in the pages nagged at him, and that evening he and his friend Littlewood sat down and actually checked the mathematics.'
      } },
    { art: ['ramanujan'], who: null, mood: 'wow',
      hi: 'कुछ नतीजों को हार्डी पहचान गए। कुछ में बारीक ग़लतियाँ थीं। और कुछ ऐसे थे जैसा उन्होंने पहले कभी देखा ही नहीं था — हार्डी ने बाद में लिखा कि ऐसे प्रमेयों का सच होना तय था, क्योंकि किसी के पास भी इन्हें मन से गढ़ने की कल्पना नहीं हो सकती थी। उन्होंने इनके रचने वाले को कैम्ब्रिज बुलाने का इंतज़ाम किया, और पाँच साल तक उस क्लर्क और प्रोफ़ेसर ने मिलकर ऐसा गणित रचा जिसे लोग आज भी खंगाल रहे हैं।',
      text: 'Some results Hardy recognised. Some were subtly wrong. And some were like nothing he had ever seen — Hardy wrote afterwards that such theorems had to be true, because no one would have had the imagination to invent them. He arranged to bring their author to Cambridge, and for five years the clerk and the professor did mathematics together that people are still mining today.' },
    { art: ['ramanujan'], who: null,
      hi: 'उनके बारे में सबसे मशहूर क़िस्सा खुद हार्डी का है, और वे इसे सुनाना बहुत पसंद करते थे। रामानुजन बीमार पड़े थे; हार्डी उनसे मिलने पहुँचे, और कहा कि उनकी टैक्सी का नंबर, 1729, काफ़ी उबाऊ सा लगता है। "नहीं," रामानुजन तुरंत बोले — "यह तो बहुत ही दिलचस्प नंबर है: यह वह सबसे छोटी संख्या है जिसे दो अलग-अलग तरीक़ों से दो घनों के जोड़ के रूप में लिखा जा सकता है।" अपनी बीमारी के बिस्तर से। बिना एक पल रुके। हार्डी ने कहा कि ऐसा लगता था मानो हर संख्या रामानुजन की अपनी ख़ास दोस्त हो।',
      text: 'The most famous story about them is Hardy\'s own, and he loved telling it. Ramanujan lay ill; Hardy visited, and remarked that his taxi\'s number, 1729, seemed rather a dull one. No, Ramanujan said at once — it is a very interesting number: it is the smallest number you can write as the sum of two cubes in two different ways. From his sickbed. Without a pause. Hardy said every number seemed to be Ramanujan\'s personal friend.' },
    { art: ['ramanujan'], who: null, mood: 'sad',
      hi: 'इंग्लैंड की ठंड और युद्ध के साल उन पर बहुत भारी पड़े, और वे अक्सर बीमार रहने लगे। 1919 में वे जहाज़ से भारत लौट आए, और अगले ही साल, महज़ बत्तीस साल की उम्र में उनका देहांत हो गया। लेकिन उन्होंने आख़िर तक काम किया, और जो कॉपियाँ वे पीछे छोड़ गए — जिनमें से एक दशकों बाद मिली — उनसे आज भी नया गणित निकल रहा है। गणितज्ञ उनका नाम उसी तरह लेते हैं जैसे संगीतकार मोज़ार्ट का नाम लेते हैं।',
      text: 'England\'s cold and the war years were hard on him, and he was often ill. He sailed home to India in 1919, and died the next year, at just thirty-two. But he worked to the very end, and the notebooks he left — including one found decades later — are still yielding new mathematics today. Mathematicians speak of him the way musicians speak of Mozart.' },
    { art: ['ramanujan'], who: 'mithu',
      hi: 'आज भी 1729 को \'टैक्सीकैब नंबर\' कहा जाता है, और इसके जैसी अगली संख्याएँ ढूँढना गणित की दुनिया की एक असली खोज है। एक उदास कमरे में उबाऊ कहे गए नंबर के लिए यह बुरा नहीं है! वैसे, वह ख़त — जिसने सब कुछ बदल दिया — उसमें बस कुछ डाक टिकटों का ख़र्च लगा था। कुछ लिफ़ाफ़े दिखने से कहीं ज़्यादा भारी होते हैं।',
      text: 'To this day, 1729 is called the taxicab number, and finding the next numbers like it is a real mathematical pursuit. Not bad for a dull number in a sad room. The letter, by the way — the one that changed everything — cost him the price of the stamps. Some envelopes are heavier than they look.' }
  ],
  moral: 'He asked for nothing except to be checked. Being checkable is the bravest way to knock on a door.',
  source: 'G. H. Hardy\'s own writings on Ramanujan — his book Ramanujan (1940) and obituary notices, where the 1729 exchange and the "no one would have the imagination to invent them" verdict are Hardy\'s own telling; the 1913 letters are printed in Ramanujan\'s Collected Papers; Robert Kanigel\'s The Man Who Knew Infinity for the life.'
},

/* ========================================================== JANAKI AMMAL ==== */
{
  id: 'sci-janaki',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: 'एडवलेथ कक्कट जानकी अम्माल का जन्म 1897 में केरल के तट पर बसे थालाश्शेरी में, बच्चों से भरे एक बड़े से घर में हुआ था, जहाँ उनके पिता एक बगीचा सँभालते थे और पक्षियों के बारे में लिखते थे। उन्हें बचपन में ही पेड़-पौधों से प्यार हो गया, और यह प्यार कभी छूटा नहीं — वह भी उस दौर में, जब किसी प्रयोगशाला में किसी भारतीय महिला को देखना ज़्यादातर प्रोफ़ेसरों के लिए बिल्कुल अनसुनी बात थी। फिर भी वे आगे बढ़ती रहीं: पहले मद्रास में कॉलेज, और फिर दुनिया के उस पार, अमेरिका के मिशिगन के लिए एक छात्रवृत्ति।',
      text: 'Edavaleth Kakkat Janaki Ammal was born in 1897 in Thalassery, on the Kerala coast, into a big house full of children where her father kept a garden and wrote about birds. She fell in love with plants early, and refused to fall out of it — at a time when an Indian woman in a laboratory was a sight most professors had simply never seen. She kept going anyway: college in Madras, then a scholarship across the world to Michigan, in America.' },
    { art: ['janaki_ammal'], who: null, mood: 'wow',
      hi: 'वे डॉक्टर जानकी अम्माल बनकर घर लौटीं — वनस्पति विज्ञान में डॉक्टरेट पाने वाली पहली भारतीय महिला के रूप में याद की जाने वाली। उनका विज्ञान था साइटोजेनेटिक्स: यानी हर जीवित कोशिका के भीतर धागों जैसी नन्हीं किताबों, क्रोमोसोम को गिनना और समझना, जो तय करते हैं कि कोई पौधा क्या बन सकता है। क्रोमोसोम गिनना सुनने में बड़ा मामूली काम लगता है। मगर असल में यह एक मास्टर चाबी है — यह बताती है कि किन पौधों का आपस में मेल कराया जा सकता है, और उनसे पैदा होने वाले नए पौधे कैसे बनेंगे।',
      text: 'She came home Dr Janaki Ammal — remembered as the first Indian woman to earn a doctorate in botany. Her science was cytogenetics: counting and reading chromosomes, the tiny thread-libraries inside every living cell that decide what a plant can be. Counting chromosomes sounds humble. It is actually a master key — it tells you which plants can cross with which, and what their children might become.' },
    { art: ['janaki_ammal'], who: null, mood: 'think',
      hi: 'और भारत के पास एक ऐसी समस्या थी, जिसके लिए इस मास्टर चाबी की ज़रूरत थी। कोयंबटूर के गन्ना प्रजनन संस्थान में उनका सामना इसी से हुआ: भारत के अपने गन्ने मज़बूत थे — वे भारत के सूखे और मिट्टी को झेल सकते थे — मगर उनमें मिठास कम थी, इसलिए रोपाई के लिए सबसे मीठा गन्ना विदेश से, जावा से आता था। मज़बूत लेकिन मीठा नहीं; मीठा लेकिन मज़बूत नहीं।',
      text: 'And India had a problem worth a master key. At the Sugarcane Breeding Institute in Coimbatore she faced it: India\'s own canes were tough — they could take India\'s droughts and soils — but thin in sweetness, so the sweetest planting cane came from Java, abroad. Tough but not sweet; sweet but not tough.',
      ask: {
        q: 'One cane is tough, another is sweet, and you need both in one plant. What does a plant breeder do?',
        options: ['Plant them side by side and hope', 'Cross them — and read the chromosomes to find the crosses that can work at all', 'Just import the sweet one forever'],
        answer: 1,
        right: 'That was her work, cross after cross after patient cross — including crosses between plants so distantly related that most botanists thought they were impossible. Her chromosome counts showed which doors were actually open.',
        wrong: 'Hoping does not mix chromosomes. She crossed them — cross after patient cross, guided by chromosome counts that showed which doors were actually open — including crosses most botanists thought impossible.'
      } },
    { art: ['janaki_ammal'], who: null,
      hi: 'इस काम से भारत को ऐसे गन्ने मिले जिनमें दोनों खूबियाँ थीं: भारतीय खेतों के लिए मीठे गन्ने, ताकि मिठास को बाहर से मँगवाना न पड़े। फिर वे अपनी यह मास्टर चाबी लेकर विदेश गईं: इंग्लैंड के एक बड़े जेनेटिक्स संस्थान में उन्होंने और वैज्ञानिक सी. डी. डार्लिंगटन ने \'क्रोमोसोम एटलस ऑफ़ कल्टीवेटेड प्लांट्स\' लिखी — दुनिया की फ़सलों के क्रोमोसोम की ऐसी जनगणना, जिसे शोधकर्ताओं ने दशकों तक इस्तेमाल किया। विज़ली में रॉयल हॉर्टिकल्चरल सोसाइटी के बगीचे में, जहाँ उन्होंने मैग्नोलिया पर काम किया था, उनके हाथों उगाया एक मैग्नोलिया आज भी खिलता है — और उसका नाम मैग्नोलिया कोबस \'जानकी अम्माल\' है।',
      text: 'The work helped give India canes that were both: sweet canes for Indian fields, so the sweetness no longer had to be imported. Then she took her master key abroad: at a great genetics institute in England she and the scientist C. D. Darlington wrote the Chromosome Atlas of Cultivated Plants — a census of the chromosomes of the world\'s crops that researchers used for decades. At the Royal Horticultural Society\'s garden at Wisley, where she worked on magnolias, a magnolia she raised still flowers — and it is named Magnolia kobus \'Janaki Ammal\'.' },
    { art: ['janaki_ammal'], who: null, mood: 'wow',
      hi: 'भारत ने उन्हें बॉटनिकल सर्वे ऑफ़ इंडिया को नए सिरे से संगठित करने के लिए वापस बुलाया — जो इस धरती के हर पौधे का देश-स्तरीय बड़ा हिसाब-किताब था। और अस्सी की उम्र में उन्होंने एक और लड़ाई लड़ी: वैज्ञानिक केरल के एक प्राचीन वर्षावन, साइलेंट वैली को बाँध बनाकर डूबने से बचाने की मुहिम चला रहे थे। वे भी उनके साथ जुड़ गईं, उस पर अध्ययन किया, और उसके पक्ष में आवाज़ उठाई। वह जंगल आज भी खड़ा है, पक्षियों के गीतों से गूँजता एक राष्ट्रीय उद्यान।',
      text: 'India asked her back, to reorganise the Botanical Survey of India — the great national accounting of every plant the land holds. And in her eighties she took up one more fight: scientists were campaigning to save Silent Valley, an ancient rainforest in Kerala, from being dammed and drowned. She joined them, studied it, spoke for it. The forest stands today, a national park, full of birdsong.' },
    { art: ['janaki_ammal'], who: 'mithu',
      hi: 'इंग्लैंड में एक मैग्नोलिया और केरल में एक वर्षावन, दोनों उनकी याद सँभाले हुए हैं, जो किसी एक वनस्पति वैज्ञानिक के लिए स्मारकों की एक बेहतरीन जोड़ी है। देखा जाए तो मिठास एक से ज़्यादा मायनों में उनका विषय थी — और अपनी आदत के मुताबिक, उन्होंने अपनी बेहद लंबी ज़िंदगी के अंत तक काम किया।',
      text: 'A magnolia in England and a rainforest in Kerala both carry her memory, which is a fair pair of monuments for one botanist. Sweetness, it turns out, was her subject in more ways than one — and she worked, by her own habit, right to the end of a very long life.' }
  ],
  moral: 'Nobody had kept a seat for her, so she brought her own — and the whole field ended up rearranged around it.',
  source: 'Records of the Sugarcane Breeding Institute, Coimbatore; the Chromosome Atlas of Cultivated Plants (Darlington & Janaki Ammal, 1945); the Royal Horticultural Society, where Magnolia kobus \'Janaki Ammal\' is recorded at Wisley; the Botanical Survey of India\'s institutional history; documented accounts of the Silent Valley campaign, and the park\'s establishment in 1984.'
},

/* ================================================================ BHABHA ==== */
{
  id: 'sci-bhabha',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: '1909 में बंबई में जन्मे होमी जहाँगीर भाभा बीस-बाईस साल की उम्र में ही कैम्ब्रिज के एक जाने-माने भौतिक वैज्ञानिक बन चुके थे, जो कॉस्मिक किरणों पर काम कर रहे थे — यानी वे कण जो अंतरिक्ष से हम पर बरसते हैं। 1939 में वे छुट्टियों में भारत अपने घर आए। तभी दूसरा विश्व युद्ध छिड़ गया, समुद्री रास्ते बंद हो गए, और वह छोटी सी छुट्टी चुपके से उनकी बाकी ज़िंदगी बन गई।',
      text: 'Homi Jehangir Bhabha, born in Bombay in 1909, was by his twenties a physicist with a growing name at Cambridge, working on cosmic rays — particles that fall on us from space. In 1939 he came home to India on holiday. Then the Second World War broke out, the sea routes closed, and the holiday quietly became the rest of his life.' },
    { art: ['bhabha'], who: null, mood: 'think',
      hi: 'उन्होंने बैंगलोर के \'इंडियन इंस्टीट्यूट ऑफ साइंस\' में सी. वी. रमन के साथ काम संभाला, और उस सच्चाई को गहराई से समझा जिसे वे हमेशा से जानते थे: कोई भी युवा भारतीय जो दुनिया की सबसे बेहतरीन भौतिकी पढ़ना या करना चाहता था, उसे भारत छोड़ना ही पड़ता था। इसलिए नहीं कि यहाँ प्रतिभा की कमी थी — बल्कि इसलिए कि उनके पास कोई ठिकाना नहीं था। न इमारतें, न उपकरण, न तनख्वाह, और न ही गलियारे में साथ काम करने वाले साथी। वे समझ गए थे कि विज्ञान किसी शेड में बैठा अकेला प्रतिभाशाली व्यक्ति नहीं होता। विज्ञान तो एक पूरा भरा-पूरा घर होता है, और भारत को कभी ऐसा घर मिला ही नहीं था।',
      text: 'He took a post at the Indian Institute of Science in Bangalore, in C. V. Raman\'s orbit, and looked hard at a fact he had always known: a young Indian who wanted to do the world\'s best physics had to leave India to do it. Not for lack of minds — for lack of a home. No buildings, no instruments, no salaries, no colleagues down the corridor. Science, he understood, is not a lone genius in a shed. It is a household, and India had never been given one.' },
    { art: ['bhabha'], who: null,
      hi: 'इसलिए 1944 में — भारत के आज़ाद होने से भी पहले — उन्होंने बैठकर \'सर दोराबजी टाटा ट्रस्ट\' को एक चिट्ठी लिखी, जिसमें बुनियादी शोध के लिए एक संस्थान बनाने का प्रस्ताव रखा। वह चिट्ठी आज भी मौजूद है, और उसका एक वाक्य बहुत मशहूर हो गया: उन्होंने लिखा था कि जब बिजली बनाने के लिए परमाणु ऊर्जा का इस्तेमाल होने लगेगा, तब भारत को विशेषज्ञों के लिए विदेशों की तरफ़ नहीं देखना पड़ेगा, बल्कि वे यहीं तैयार मिलेंगे। जब उन्होंने यह लिखा था, तब पूरी दुनिया में कहीं भी कोई परमाणु ऊर्जा केंद्र नहीं था। वे एक ऐसे भविष्य की तैयारी कर रहे थे जो सिर्फ़ उन्हें दिखाई दे रहा था और जिसे अभी तक किसी ने बनाया नहीं था।',
      text: 'So in 1944 — before India was even independent — he sat down and wrote a letter to the Sir Dorabji Tata Trust, proposing an institute for fundamental research. The letter survives, and one sentence in it has become famous: when nuclear energy was successfully used for power, he wrote, India would not have to look abroad for its experts, but would find them ready at hand. Nuclear power stations existed nowhere on Earth when he wrote that. He was budgeting for a future he could see and nobody had built.' },
    { art: ['bhabha'], who: null, mood: 'wow',
      hi: 'ट्रस्ट ने हाँ कह दी। 1945 में \'टाटा इंस्टीट्यूट ऑफ फंडामेंटल रिसर्च\' खुला और बंबई में समंदर के किनारे अपने नए घर में फला-फूला — और भाभा, जो खुद एक बेहद उम्दा चित्रकार थे, उन्होंने इसकी एक-एक बारीकी पर पूरा ध्यान दिया: बगीचे, इमारत की बनावट, और दीवारों पर लगाई गई आधुनिक पेंटिंग्स, यहाँ तक कि उस संस्थान में भारत का एक अनूठा कला-संग्रह तैयार हो गया। लोगों ने पूछा कि भौतिकी के संस्थान को खूबसूरती की क्या ज़रूरत है? फिर भी उन्होंने उसे खूबसूरत बनाया; उनका मानना था कि बेहतरीन दिमाग बदसूरत कमरों में नहीं पनपते।',
      text: 'The Trust said yes. The Tata Institute of Fundamental Research opened in 1945 and grew into its home by the sea in Bombay — and Bhabha, who was a genuinely fine painter himself, fussed over every detail of it: the gardens, the architecture, the modern paintings he hung on its walls, until the institute held one of India\'s great art collections. People asked why a physics institute needed beauty. He built it beautiful anyway; he did not believe fine minds grow in ugly rooms.' },
    { art: ['bhabha'], who: null,
      hi: 'और वह मशहूर वाक्य बिलकुल सही वक्त पर सच साबित हुआ। जब भारत ने अपना परमाणु कार्यक्रम बनाना शुरू किया, तो उसे विदेशों की तरफ़ नहीं देखना पड़ा — वैज्ञानिक यहीं तैयार खड़े थे, जिन्हें भाभा के बनाए उसी घर में तराशा गया था। टीआईएफआर आज भी समंदर के किनारे शान से खड़ा है, अपने सुंदर बगीचों और पेंटिंग्स के साथ, दुनिया के सबसे ऊँचे स्तर पर गणित और भौतिकी के नए रास्ते तलाश रहा है।',
      text: 'And the famous sentence came true on schedule. When India came to build its atomic programme, it did not have to look abroad — the scientists were ready at hand, trained in the house that Bhabha built. TIFR stands by the sea today, still doing mathematics and physics at the world\'s edge, gardens and paintings and all.' },
    { art: ['bhabha'], who: 'mithu',
      hi: 'बहुत से लोग खुद बड़े काम करने के सपने देखते हैं। भाभा का सपना एक ऐसी इमारत का था जहाँ बाकी लोग मिलकर बड़े काम कर सकें — यह बहुत कम लोगों का सपना होता है, और यह आपके जाने के बाद भी सदियों तक ज़िंदा रहता है। अपने परिवार से पूछो कि अगर उन्हें एक ऐसी जगह बनाने का मौका मिले जहाँ लोग अपनी प्रतिभा से कमाल कर सकें, तो वे क्या बनाएंगे?',
      text: 'Plenty of people dream of doing great things themselves. Bhabha\'s dream was a building full of other people doing them — which is a rarer dream, and it outlives you better. Ask your family what they would build, if they could build one place for people to be brilliant in.' }
  ],
  moral: 'He did not wait for the future to arrive — he built the rooms it would need, and then it moved in.',
  source: 'Bhabha\'s letter of 1944 to the Sir Dorabji Tata Trust, which survives in the archives of the Tata Institute of Fundamental Research and is loosely quoted here from that documented text; TIFR\'s own institutional history, including its founding in 1945 and its art collection.'
},

/* ============================================================== SARABHAI ==== */
{
  id: 'sci-sarabhai',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: 'विक्रम साराभाई का जन्म 1919 में गुजरात के अहमदाबाद के एक बड़े मिल-मालिक परिवार में हुआ था, और वे चाहते तो आराम से ज़िंदगी भर कारखाने चला सकते थे। मगर उन्होंने कॉस्मिक किरणों की पढ़ाई की, और 1947 में — भारत की आज़ादी के ठीक ग्यारह दिन बाद, सिर्फ़ अट्ठाईस साल की उम्र में — उन्होंने अहमदाबाद में एक भौतिकी प्रयोगशाला शुरू की। वे नए-नए संस्थान ऐसे बनाते थे जैसे कुछ लोग डाक टिकट जमा करते हैं: वे बस रुक ही नहीं पाते थे।',
      text: 'Vikram Sarabhai was born in 1919 into a great mill-owning family of Ahmedabad, in Gujarat, and could have spent his life comfortably running factories. Instead he studied cosmic rays, and in 1947 — eleven days into India\'s independence, aged twenty-eight — he founded a physics laboratory in Ahmedabad. He was a builder of institutions the way some people are collectors of stamps: he simply could not stop.' },
    { art: ['sarabhai'], who: null, mood: 'think',
      hi: '1962 में भारत ने उनसे एक ऐसी चीज़ शुरू करने को कहा जो सुनने में सचमुच बेतुकी लगती थी: एक अंतरिक्ष कार्यक्रम, वह भी एक ऐसे देश में जहाँ ज़्यादातर गाँवों में बिजली तक नहीं थी। कई समझदार लोगों ने यह बात साफ़-साफ़ कही भी।',
      text: 'In 1962 India asked him to start something that sounded, frankly, absurd: a space programme, in a country where most villages had no electricity. Plenty of sensible people said so out loud.',
      ask: {
        q: 'A young country with little money, 1962. Should it really be spending on rockets?',
        options: ['No — roads and schools first, space later', 'Yes — to race the rich countries to the Moon', 'Yes — if the rockets work FOR the fields and the classrooms'],
        answer: 2,
        right: 'That was Sarabhai\'s own argument, in his documented words: India had no fantasy of racing anyone to the Moon — but if satellites could watch the monsoon, connect the country and teach village schools by television, then India must be second to none.',
        wrong: 'Sarabhai answered exactly this doubt, in words that are still quoted: India had no fantasy of racing anyone to the Moon — but if satellites could watch the monsoon, connect the country and teach village schools by television, then India must be second to none.'
      } },
    { art: ['sarabhai'], who: null,
      hi: 'पहले रॉकेट की उड़ान के लिए उनके वैज्ञानिकों को चुंबकीय भूमध्य रेखा के पास एक ऐसी जगह चाहिए थी, जहाँ आसमान की ऊपरी हवा का अध्ययन सबसे दिलचस्प होता है। नक्शे में थुंबा का नाम सामने आया — केरल में तिरुवनंतपुरम के पास मछुआरों का एक शांत गाँव। और चुनी गई ज़मीन के बिल्कुल बीच में गाँव का एक चर्च खड़ा था, सेंट मैरी मैग्डलीन। बिशप और वहाँ के लोगों ने आपस में बातचीत की — और देश के विज्ञान के लिए अपना चर्च दे दिया, और अपनी प्रार्थनाओं के लिए पास ही एक नया चर्च बना लिया।',
      text: 'For the first launch site his scientists needed a spot close to the magnetic equator, where the upper air is at its most interesting. The map pointed at Thumba — a quiet fishing village near Thiruvananthapuram in Kerala. And in the middle of the chosen ground stood the village\'s church, St Mary Magdalene\'s. The bishop and the parish talked it over — and gave their church to the nation\'s science, moving their prayers to a new church built nearby.' },
    { art: ['sarabhai'], who: null, mood: 'wow',
      hi: 'तो इस तरह भारत का अंतरिक्ष कार्यक्रम एक चर्च में आ गया। जहाँ वेदी थी, वहाँ प्रयोगशाला बन गई; बिशप का घर दफ़्तर बन गया; और चूँकि आने-जाने के साधन न के बराबर थे, इसलिए रॉकेट के पुर्जे आख़िरी रास्ते तक साइकिल और बैलगाड़ी से पहुँचाए गए — और उनकी तस्वीरें आज भी इसरो के संग्रह में मौजूद हैं, जो भारतीय विज्ञान की सबसे प्यारी तस्वीरों में गिनी जाती हैं। 21 नवंबर 1963 को, पहला साउंडिंग रॉकेट थुंबा से शाम के आसमान में उड़ चला। सच तो यह है: वह पहला रॉकेट विदेश के दोस्तों की मदद से अमेरिका से उधार लिया गया था — शुरुआत में कुछ उधार लेने की पूरी छूट होती है।',
      text: 'So India\'s space programme moved into a church. The altar end became a laboratory; the bishop\'s house became the office; and because there was hardly any transport, rocket parts travelled the last stretch by bicycle and by bullock cart — and the photographs of that survive in ISRO\'s archives, some of the best-loved pictures in Indian science. On 21 November 1963, the first sounding rocket rose from Thumba into the evening sky. Honesty note: that first rocket was borrowed from America, with help from friends abroad — a beginning is allowed to borrow.' },
    { art: ['sarabhai'], who: null,
      hi: 'उसी चर्च से निकला इसरो, यानी भारतीय अंतरिक्ष अनुसंधान संगठन — वही संगठन जिसने आगे चलकर हर मानसून पर नज़र रखने वाले उपग्रह छोड़े, वादे के मुताबिक गाँव-गाँव के स्कूलों तक टेलीविज़न पहुँचाया, और आगे चलकर चाँद और मंगल तक अपने अंतरिक्ष यान भेजे। साराभाई यह सब देखने के लिए जीवित नहीं रहे; 1971 में, सिर्फ़ बावन साल की उम्र में उनका देहांत हो गया। मगर जिस कार्यक्रम की नींव उन्होंने रखी थी, उसने उनका वादा पूरा कर दिखाया।',
      text: 'From that church grew ISRO, the Indian Space Research Organisation — the organisation that went on to put satellites over every monsoon, television into village schools exactly as promised, and, in time, spacecraft around the Moon and Mars. Sarabhai did not live to see most of it; he died in 1971, at just fifty-two. The programme he planted kept his promise for him.' },
    { art: ['sarabhai'], who: 'mithu',
      hi: 'थुंबा का वह चर्च अब एक स्पेस म्यूज़ियम है — आप अंदर जाकर देख सकते हैं कि जहाँ कभी बैठने की बेंचें थीं, वहाँ अब रॉकेट रखे हैं। एक गाँव जिसने अपनी सबसे पवित्र इमारत दे दी, साइकिलों पर चलते वैज्ञानिक, और एक इंसान जिसने वादा किया था कि आसमान खेतों की भलाई के लिए काम करेगा। भारत इस तरह अंतरिक्ष पहुँचा। शुरुआत भले छोटी हो सकती है; मगर दिल कभी छोटा नहीं होना चाहिए।',
      text: 'The church at Thumba is a space museum now — you can walk in and see the rockets where the pews were. A village that lent its holiest building, scientists on bicycles, and a man who promised the sky would work for the fields. That is how India went to space. Beginnings are allowed to be small; they are not allowed to be small-hearted.' }
  ],
  moral: 'Aim at the sky, and load the rocket on whatever the village actually has — a beginning that waits for perfect equipment never begins.',
  source: 'ISRO\'s own history of the Thumba Equatorial Rocket Launching Station — the church of St Mary Magdalene, the relocated parish, and the bicycle and bullock-cart photographs are in its archives; the launch of 21 November 1963 (an American Nike-Apache) is in ISRO records; Sarabhai\'s "second to none" argument is from his documented statements; the Physical Research Laboratory, Ahmedabad, for his founding years.'
},

/* =========================================================== SWAMINATHAN ==== */
{
  id: 'sci-swaminathan',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: 'साल 1925 में तमिलनाडु के कुंभकोणम में जन्मे मॉन्कोम्बु सांबशिवन स्वामीनाथन 1943 में एक छात्र थे, जब बंगाल में भयानक अकाल पड़ा और सड़कों पर इतने लोग मरे कि उनकी गिनती लिखना भी मुश्किल है। उन्होंने बाद में हमेशा यही कहा कि इसी बात ने उनका फैसला तय कर दिया: वे डॉक्टर बनने जा रहे थे, लेकिन उसकी जगह उन्होंने अनाज उगाने के विज्ञान को चुन लिया। वे कहते थे कि वे एक ऐसा भारत चाहते थे जहाँ कोई भूखा न रहे।',
      text: 'Monkombu Sambasivan Swaminathan, born in Kumbakonam in Tamil Nadu in 1925, was a student in 1943 when famine struck Bengal and people died in the streets in numbers that are hard to write down. He said ever afterwards that it was this that decided him: he had been headed for medicine, and he turned instead to the science of growing food. He wanted, he said, a hungry-proof India.' },
    { art: ['swaminathan'], who: null, mood: 'think',
      hi: '1960 के दशक तक भारत जहाज़ भर-भरकर गेहूँ मँगवा रहा था और गोदियों से उतरते ही उसे खाया जा रहा था — लोग इसे \'जहाज़ से मुँह तक की ज़िंदगी\' कहते थे। पर एक उलझन भरी मुश्किल थी: भारत के गेहूँ को खूब पानी और खाद दो तो वह लंबा और ऊपर से भारी हो जाता था — और फिर हवा चलते ही गिर पड़ता था और कीचड़ में सड़ जाता था। उसे अच्छी खुराक दो, और वह ज़मीन पर लोट जाता था।',
      text: 'By the 1960s India was importing wheat by the shipload and eating it almost off the docks — people called it living ship-to-mouth. Here was the maddening trap: give Indian wheat plenty of water and fertiliser and it grew tall, top-heavy — and then fell flat in the wind and rotted in the mud. Feed it well and you flattened it.',
      ask: {
        q: 'Well-fed wheat grows tall and falls over. What do you change?',
        options: ['Feed it less, harvest less, stay hungry', 'Hold every stalk up with sticks', 'Change the plant itself — a short, strong stem that spends the food on grain'],
        answer: 2,
        right: 'That was the answer: dwarf wheat. A short, stiff stem that stands firm and pours the extra feeding into the head of grain instead of into height.',
        wrong: 'You cannot put sticks under a million fields. The answer was to change the plant itself: dwarf wheat, short and stiff, standing firm and pouring the extra feeding into grain instead of height.'
      } },
    { art: ['swaminathan'], who: null, mood: 'wow',
      hi: 'स्वामीनाथन और उनके साथियों ने मैक्सिको में नॉर्मन बोरलॉग द्वारा तैयार किए गए छोटे कद के गेहूँ की किस्में मँगवाईं — उन्होंने 1963 में बोरलॉग को भारत आमंत्रित किया — और भारतीय खेतों और भारतीय रोटियों के हिसाब से उनका संकरण और परीक्षण किया। किसानों ने, खास तौर पर पंजाब में, इस नए बीज को हाथों-हाथ लिया। 1968 में गेहूँ की ऐसी बंपर फसल हुई जो पहले कभी नहीं देखी गई थी, यहाँ तक कि कई जगह अनाज रखने की जगह ही नहीं बची — उस साल के इतिहास में दर्ज है कि स्कूल बंद कर दिए गए ताकि कमरों में गेहूँ भरा जा सके। लोगों ने इसे हरित क्रांति कहा, और बाहर से आने वाले जहाज़ बंद हो गए।',
      text: 'Swaminathan and his colleagues brought in the dwarf wheats bred by Norman Borlaug in Mexico — he invited Borlaug to India in 1963 — and crossed and trialled them for Indian fields and Indian rotis. Farmers, above all in Punjab, took the new seed and ran with it. In 1968 the wheat harvest came in so far beyond anything before it that in places there was nowhere to put the grain — the histories of that year record schools being closed so the classrooms could be used to store wheat. They called it the Green Revolution, and the ships stopped.' },
    { art: ['swaminathan'], who: null, mood: 'sad',
      hi: 'और एक सच्ची बात, क्योंकि इस कहानी में यह बताना ज़रूरी है: इस नई खेती ने बहुत कुछ सोखा — खूब सारा पानी, खूब सारी खाद — और वक्त के साथ ज़मीन ने अपना हिसाब माँगना शुरू कर दिया, थकी हुई मिट्टी और गिरते हुए कुओं के रूप में। स्वामीनाथन जी ने खुद यह बात मानी, और अपने बाद के दशक उस काम में लगाए जिसे वे सदाबहार क्रांति कहते थे — यह उनका अपना शब्द था — जिसका मतलब था ऐसी भरपूर फसलें जो धरती को थकाए बिना मिलती रहें। लोगों का पेट भरना कोई एक बार की समस्या नहीं निकली, बल्कि एक ऐसा सवाल निकली जिसे लगातार सुलझाते रहना पड़ता है।',
      text: 'And one honest sentence, because this story has earned it: the new farming drank deep — heavy water, heavy fertiliser — and in time the land began presenting its bills, in tired soils and falling wells. Swaminathan said so himself, and spent his later decades on what he called an evergreen revolution — his own phrase — meaning harvests that stay high without wearing out the earth that gives them. Feeding people turned out to be not one problem but a problem you must keep solving.' },
    { art: ['swaminathan'], who: 'mithu',
      hi: 'जब 1987 में विश्व खाद्य पुरस्कार शुरू हुआ, तो सबसे पहला पुरस्कार स्वामीनाथन जी को ही मिला। अकाल को देखने वाले एक लड़के से लेकर भरे हुए अन्नागारों वाले देश तक का यह सफर — तने की ऊँचाई जितनी छोटी सी चीज़ से तय हुआ था। बड़े-बड़े दरवाज़े छोटे कब्ज़ों पर ही घूमते हैं।',
      text: 'When the World Food Prize was created in 1987, the first one ever awarded went to Swaminathan. From a boy watching a famine to a country with its granaries full — measured out in something as small as the height of a stem. Big doors swing on small hinges.' }
  ],
  moral: 'He fed a country and then kept asking whether he had done it right — the second thing is as rare as the first.',
  source: 'M. S. Swaminathan\'s own accounts of 1943 and the wheat years, as recorded by the M. S. Swaminathan Research Foundation; documented histories of the 1968 harvest, including the schools-as-granaries detail; "evergreen revolution" is his own published phrase; World Food Prize records, 1987.'
},

/* ============================================================== SALIM ALI === */
{
  id: 'sci-salimali',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: 'सालिम अली 1900 के आसपास बंबई में पले-बढ़े, वे अनाथ थे और मामा-चाचाओं और भाई-बहनों से भरे एक बड़े, प्यार भरे घर में बड़े हुए। उस ज़माने के बहुत से लड़कों की तरह उनके पास भी एक एयरगन थी जिससे वे गौरैयों का शिकार करते थे। एक दिन उन्होंने अपनी गिराई हुई एक गौरैया उठाई और ठिठक गए। उसके गले पर पीले रंग का एक निशान था। हर लड़का जानता था कि गौरैया का गला पीला नहीं होता। तो फिर उनके हाथ में यह कौन-सा परिंदा था?',
      text: 'Salim Ali grew up in Bombay around 1900, an orphan raised in a big, warm houseful of uncles and cousins, and like a lot of boys then he had an airgun and used it on sparrows. One day he picked up a sparrow he had shot and stopped. On its throat was a patch of yellow. Sparrows, every boy knew, do not have yellow throats. So what exactly was lying in his hand?' },
    { art: ['salimali'], who: null, mood: 'think',
      hi: '"वह चाहता तो कंधे उचकाकर बात टाल देता। इसके बजाय वह उस चिड़िया को अपने चाचा के पास ले गया, और चाचा ने भी एक व्यस्त इंसान होने के बावजूद बड़ी समझदारी दिखाई: उन्होंने एक चिट्ठी लिखकर उस लड़के को \'बॉम्बे नेचुरल हिस्ट्री सोसाइटी\' भेज दिया। वहाँ डब्ल्यू. एस. मिलार्ड नाम के एक भले अंग्रेज़ ने हाथ में मरी हुई गौरैया लिए उस छोटे से बच्चे का मज़ाक नहीं उड़ाया। उन्होंने जतन से रखी परिंदों की खालों वाली एक के बाद एक कई दराज़ें खोलीं, जब तक कि बिल्कुल वैसी ही चिड़िया नहीं मिल गई: एक पीली गर्दन वाली गौरैया। फिर वे और दराज़ें खोलते गए — और उस लड़के को ऐसे-ऐसे भरे हुए पक्षी दिखाए जिनकी उसने कभी कल्पना भी नहीं की थी, और उसे पढ़ने को किताबें भी दीं। सालिम अली ज़िंदगी भर यह किस्सा सुनाते रहे; उनकी अपनी आत्मकथा की शुरुआत भी यहीं से होती है।"',
      text: 'He could have shrugged. Instead he carried the bird to his uncle, who did an unusually wise thing for a busy uncle: he sent the boy with a note to the Bombay Natural History Society. There, a courteous Englishman named W. S. Millard did not laugh at a small boy with a dead sparrow. He opened drawer after drawer of carefully kept bird skins until they found the match: a yellow-throated sparrow. Then he kept opening drawers — and showed the boy stuffed birds beyond anything he had imagined, and lent him books. Salim Ali told this story all his life; it is the opening of his own memoir.' },
    { art: ['salimali'], who: null, mood: 'wow',
      hi: '"जिस लड़के ने कभी परिंदों पर निशाना साधा था, वही बड़ा होकर उनकी गिनती करने वाला इंसान बन गया। दशकों तक सालिम अली पक्षियों का सर्वेक्षण करते हुए पूरे भारत में घूमे — एक-एक रियासत, एक-एक जंगल, दलदल और पहाड़ नापते हुए — अपनी कॉपियाँ, धैर्य और बेहद कम पैसों के साथ। उन्होंने पहली बार यह पता लगाया कि भारत में कौन-सी चिड़िया ठीक कहाँ रहती है। फिर उन्होंने यह सब एक ऐसी किताब में समेट दिया जिसे आम लोग भी खरीद सकें, \'द बुक ऑफ़ इंडियन बर्ड्स\', और पूरे देश को उनके अपने पड़ोसियों के नाम सिखा दिए।"',
      text: 'The boy who had shot birds became the man who counted them. For decade after decade Salim Ali walked India doing bird surveys — princely state by princely state, forest by marsh by mountain — with notebooks, patience and famously little money, finding out for the first time exactly which birds lived where in India. Then he put it in a book ordinary people could afford, The Book of Indian Birds, and taught a whole country the names of its own neighbours.' },
    { art: ['salimali'], who: null,
      hi: '"और क्योंकि वे जानते थे कि परिंदे कहाँ रहते हैं, इसलिए वे यह भी जानते थे कि किन चीज़ों के बिना वे ज़िंदा नहीं रह सकते। जब भरतपुर के दलदली इलाके को — जहाँ बगुले, सारस और ढोंक घोंसले बनाते थे और जो दुनिया भर से आने वाले पक्षियों का सर्दियों का बसेरा था — बचाने की ज़रूरत पड़ी, तो उठने वाली सबसे बुलंद आवाज़ों में एक आवाज़ उनकी थी। उन्होंने जीवन भर ऐसी कई जगहों के लिए लड़ाई लड़ी, जिनमें \'साइलेंट वैली\' का वर्षावन भी शामिल था। भरतपुर आज \'केवलादेव नेशनल पार्क\' है। वहाँ चिड़ियाँ आज भी हर सर्दी में, अपने तय वक्त पर आ पहुँचती हैं।"',
      text: 'And because he knew where the birds lived, he knew what they could not live without. When the wetland at Bharatpur — a city of nesting storks, herons and cranes, and winter home to birds from across the world — needed defending, his voice was one of the loudest raised for it; he fought similar corners all his life, Silent Valley\'s rainforest among them. Bharatpur is the Keoladeo National Park today. The birds still arrive every winter, on schedule.' },
    { art: ['salimali'], who: null,
      hi: '"जब आखिरकार उन्होंने अपनी ज़िंदगी की कहानी लिखी, तो किताब का नाम उसी चिड़िया पर रखा जिससे इसकी शुरुआत हुई थी: \'द फ़ॉल ऑफ़ अ स्पैरो\'। उन्होंने कभी यह दिखावा नहीं किया कि शुरुआत बहुत साफ़-सुथरी थी — एक गोली खाई चिड़िया, एक बच्चे का बिगड़ा हुआ निशाना, और मन में उठी उत्सुकता की एक टीस। लेकिन इसके बाद के सत्तर सालों में उन्होंने जो किया, वही सीख उन्होंने दुनिया के सामने रखी।"',
      text: 'When he finally wrote his life down, he named the book after the bird that began it: The Fall of a Sparrow. He never pretended the beginning was tidy — a shot bird, a boy\'s bad aim, a stab of curiosity. What he did with the next seventy years is the part he offered as the lesson.' },
    { art: ['salimali'], who: 'mithu',
      hi: '"अगली बार तुम्हें जो भी चिड़िया दिखे — उसे सचमुच गौर से देखना। उसका गला, पंख, उसका उड़ना, और उसकी बोली। अगर तुम उसका नाम पता कर सको, तो समझो तुम्हारी शुरुआत भी ठीक वहीं से हुई है जहाँ से \'बर्डमैन ऑफ़ इंडिया\' की हुई थी। इसके लिए किसी एयरगन की ज़रूरत नहीं; यह बात कहने वाले सबसे पहले इंसान वही होते।"',
      text: 'Next bird you see — actually look at it. Throat, wings, how it flies, what it says. If you can find out its name, you have started exactly where the Birdman of India started. No airgun required; he would be the first to say so.' }
  ],
  moral: 'He was not the boy who never did wrong — he was the boy who looked closely at what he had done, and asked.',
  source: 'Salim Ali\'s own memoir, The Fall of a Sparrow (1985) — the yellow-throated sparrow, Mr Millard and the drawers of bird skins are his own telling; the Bombay Natural History Society\'s records of his surveys; Keoladeo National Park\'s documented history.'
},

/* ================================================================= KALAM ==== */
{
  id: 'sci-kalam',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: '"अवुल पाकिर जैनुलाब्दीन अब्दुल कलाम का जन्म 1931 में तमिलनाडु के बिल्कुल छोर पर बसे मंदिर-द्वीप रामेश्वरम में हुआ था, जहाँ उनके पिता की लकड़ी की एक नाव थी जो तीर्थयात्रियों को ले जाती थी। वह कम पैसों लेकिन बड़े ठहराव और सुकून वाला घर था — अपनी आत्मकथा में वे अपने पिता की ईमानदारी और अपनी माँ की दयालुता को ही परिवार की असली दौलत याद करते हैं। आधा कस्बा उनके रिश्तेदारों का था, और हर सड़क के मोड़ पर समंदर मिलता था।"',
      text: 'Avul Pakir Jainulabdeen Abdul Kalam was born in 1931 in Rameswaram, the island temple-town at the very toe of Tamil Nadu, where his father owned a wooden boat that ferried pilgrims. A house of little money and much steadiness — his memoir remembers his father\'s honesty and his mother\'s kindness as the family\'s actual wealth. Half the town were his relatives, and the sea was at the end of every street.' },
    { art: ['kalam'], who: null,
      hi: 'फिर दूसरा विश्व युद्ध रामेश्वरम की रेलवे लाइन तक भी पहुँच गया: स्टेशन पर ट्रेन का रुकना बंद हो गया, और शहर के अख़बारों को चलती बोगी से बंडलों में बाहर फेंकना पड़ता था। उनके चचेरे भाई समसुद्दीन, जो अख़बार बाँटते थे, उन्हें एक ऐसे लड़के की ज़रूरत थी जो फुर्ती से उन्हें लपक सके। इसलिए हर सुबह सवेरे, अब्दुल हवा में ही उड़ते अख़बार लपकते, घर-घर बाँटने दौड़ते, और फिर स्कूल जाते। यह उनकी ज़िंदगी की पहली कमाई थी, और आधी सदी बाद उन्होंने लिखा कि उस गर्व का अहसास उन्हें आज भी वैसा ही होता था।',
      text: 'Then the Second World War reached even Rameswaram\'s railway line: the train stopped halting at the station, and the town\'s newspapers had to be flung out in bundles from the moving carriage. His cousin Samsuddin, who distributed the papers, needed a boy quick enough to catch them. So every dawn, Abdul caught the news out of the air, ran his delivery rounds, and then went to school. It was the first money he ever earned, and he wrote half a century later that he could still feel the pride of it.' },
    { art: ['kalam'], who: null, mood: 'wow',
      hi: 'वे ज़िंदगी भर रामेश्वरम के अपने एक स्कूल शिक्षक की बात बताते रहे, जिन्होंने एक दिन कक्षा को सिखाया कि पक्षी कैसे उड़ते हैं — बोर्ड पर पक्षी बनाकर, उसके पंख, उसकी उड़ान और दिशा बदलती पूँछ समझाते हुए — और जब बच्चों की समझ में बात नहीं आई, तो वे शाम को लड़कों को समुद्र किनारे ले गए ताकि वे समुद्री पक्षियों को उड़ते देख सकें। कलाम कहते थे कि वही दिन था जब उनकी ज़िंदगी को अपनी दिशा मिल गई। उड़ते हुए अख़बार लपकने वाले उस लड़के ने तय कर लिया कि अब उसका काम ही उड़ान होगा।',
      text: 'He told, all his life, of a schoolteacher in Rameswaram who one day taught the class how birds fly — drawing the bird on the board, the wing, the lift, the tail steering — and, when the class did not follow, took the boys to the seashore in the evening to watch the seabirds do it. Kalam said that was the day his life found its subject. The boy who caught flying newspapers decided his business would be flight.' },
    { art: ['kalam'], who: null,
      hi: 'यह रास्ता तिरुचिरापल्ली में भौतिकी और मद्रास में एरोनॉटिकल इंजीनियरिंग से होता हुआ भारत के उस रॉकेट कार्यक्रम तक पहुँचा, जो तब अपनी साइकिल और बैलगाड़ी वाली शुरुआती अवस्था में था। आगे चलकर उन्हें एसएलवी-3 का प्रोजेक्ट डायरेक्टर बनाया गया — भारत का अपना रॉकेट प्रक्षेपक बनाने की पहली कोशिश। 1979 में पहला प्रयास नाकाम रहा और रॉकेट समुद्र में गिर गया; उस समय कलाम ही उसके ज़िम्मेदार थे और पूरा देश देख रहा था; अपनी आत्मकथा में उन्होंने खुलकर लिखा है कि तब कैसा लगा था। 18 जुलाई 1980 को अगला एसएलवी-3 पूरी ऊँचाई तक गया, और उसने रोहिणी उपग्रह को कक्षा में स्थापित कर दिया। अब भारत अपनी ही ज़मीन से, अपने ही रॉकेट पर अंतरिक्ष तक पहुँच सकता था।',
      text: 'The road ran through physics in Tiruchirappalli and aeronautical engineering in Madras, and into India\'s rocket programme in its bicycle-and-bullock-cart infancy. In time he was made project director of the SLV-3 — India\'s attempt to build a launcher of its very own. The first attempt, in 1979, failed and fell into the sea, with Kalam in charge and the country watching; his memoir is honest about how that felt. On 18 July 1980 the next SLV-3 climbed all the way, and put the satellite Rohini into orbit. India could now reach space from its own soil, on its own rocket.' },
    { art: ['kalam'], who: null, mood: 'wow',
      hi: 'मिसाइलों और रॉकेटों ने उन्हें मशहूर बनाया; और बच्चों ने उन्हें सबका प्यारा बना दिया। 2002 में, रामेश्वरम का वह अख़बार बाँटने वाला लड़का भारत का राष्ट्रपति चुना गया — और सुबह के जिन अख़बारों को वे कभी चलती ट्रेन से हवा में लपका करते थे, अब उन्हीं के पहले पन्ने पर उनकी तस्वीर छपी थी। राष्ट्रपति के रूप में उन्होंने बच्चों की चिट्ठियों के जवाब दिए, कक्षाओं में जाकर सवाल पूछे और बारह साल से कम उम्र के हर बच्चे की नज़र में वे सचमुच बच्चों के अपने राष्ट्रपति थे।',
      text: 'Missiles and rockets made him famous; children made him beloved. In 2002 the newspaper boy of Rameswaram was elected President of India — and the morning papers, the kind he had once caught out of the air at a moving train, now carried his photograph on the front page. As President he answered children\'s letters and quizzed schoolrooms and was, by unanimous agreement of everyone under twelve, the children\'s own President.' },
    { art: ['kalam'], who: 'mithu',
      hi: '2015 में अपनी ज़िंदगी की आख़िरी दोपहर उन्होंने वही काम करते हुए बिताई, जिसे उन्होंने हर आराम से बढ़कर चुना था: विद्यार्थियों को पढ़ाना। उनकी कहानी आज भी यही कहती है — ज़िंदगी तुम्हारी तरफ़ जो भी उछाले, उसे लपक लो, चाहे वह अख़बार का बंडल ही क्यों न हो — और उन शिक्षकों की बात हमेशा याद रखो जो तुम्हें पक्षी दिखाते हैं। एक छोटे से स्टेशन के प्लेटफ़ॉर्म पर खड़े होकर तुम यह अंदाज़ा नहीं लगा सकते कि पटरी कितनी दूर तक जाती है।',
      text: 'He spent his last afternoon, in 2015, doing the thing he had chosen over every comfort: teaching students. Catch what today throws at you, his story keeps saying — a newspaper bundle will do — and mind the teachers who show you birds. You cannot tell, from the platform of a small station, how far the line runs.' }
  ],
  moral: 'The distance from a small town to the sky is real — and it is crossed at dawn, one caught bundle at a time.',
  source: 'A. P. J. Abdul Kalam\'s own memoir Wings of Fire (1999) — the wartime newspapers, cousin Samsuddin, the first wages and the 1979 failure are his own telling, and the seashore bird-flight lesson is from his own recounted schooldays; ISRO records for the SLV-3 launch of Rohini, 18 July 1980; the presidency (2002–2007) is public record.'
},

/* ============================================================= ANNA MANI === */
{
  id: 'sci-annamani',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: 'अन्ना मणि का जन्म 1918 में केरल की पहाड़ियों में बसे पीरमेड में हुआ था, एक ऐसे संपन्न परिवार में जिसकी लड़कियों के बारे में तयशुदा सोच थी। आठ साल की उम्र तक उन्होंने वह सब कुछ पढ़ डाला था जो उनका क़स्बा किसी बच्चे को पढ़ने के लिए दे सकता था। फिर उनका आठवाँ जन्मदिन आया, और उसके साथ आई परिवार की पुरानी रस्म: हीरे की बालियों का तोहफ़ा।',
      text: 'Anna Mani was born in 1918 in Peermade, in the hills of Kerala, into a prosperous family with settled ideas about what girls were for. By eight she had read most of what her town could offer a child. Then came her eighth birthday, and with it the family custom: a gift of diamond earrings.',
      ask: {
        q: 'The earrings are offered — beautiful, expensive, the proper gift. What did Anna ask for instead?',
        options: ['A bigger pair of earrings', 'A set of encyclopaedias', 'Nothing at all'],
        answer: 1,
        right: 'A set of encyclopaedias — instead of diamonds. She told this story herself, all her life, and it is the truest introduction she could have: a person who, offered sparkle, asked for the whole world in volumes.',
        wrong: 'What she asked for — and she told this story herself, all her life — was a set of encyclopaedias. Offered sparkle, she asked for the whole world in volumes, and the family library never recovered.'
      } },
    { art: ['annamani'], who: null,
      hi: 'किताबें पढ़ने की शौकीन वह लड़की मद्रास में भौतिक विज्ञान की छात्रा बनी, और फिर खुद सी. वी. रमन की प्रयोगशाला में एक शोधकर्ता — आप उनसे इसी अलमारी में पहले मिल चुके हैं — जहाँ उन्होंने हीरों और माणिकों के भीतर रोशनी के रहस्यों को सुलझाने में सालों बिताए। उन्होंने वाकई उम्दा दर्जे के पाँच शोध-पत्र लिखे। और यहाँ हमें सच्चाई बतानी होगी, क्योंकि इतिहास सच्चा होता है: कागज़ात की एक तकनीकी अड़चन की वजह से, विश्वविद्यालय ने उन्हें वह डॉक्टरेट कभी नहीं दी जिसकी उनकी मेहनत हक़दार थी। उन्होंने अपने अंदाज़ में कंधे उचकाए, और वापस विज्ञान के काम में जुट गईं।',
      text: 'The reading girl became a physics student in Madras, and then a researcher in the laboratory of C. V. Raman himself — you have met him earlier on this shelf — where she spent years teasing out the secrets of light inside diamonds and rubies. She wrote five research papers of real quality. And here the record must be honest, because itihaas is honest: on a technicality of paperwork, the university never granted her the doctorate her work had earned. She shrugged, in her way, and got on with the science.' },
    { art: ['annamani'], who: null, mood: 'think',
      hi: '1948 में, इंग्लैंड में वैज्ञानिक उपकरण बनाने का प्रशिक्षण लेकर, वह नए-नए आज़ाद हुए भारत के मौसम विभाग में शामिल हुईं — और वहाँ उन्होंने एक खामोश करने वाली शर्मिंदगी देखी: भारत अपने मौसम को समझने के लिए जो भी उपकरण इस्तेमाल करता था, हर बैरोमीटर, थर्मामीटर और रेन गेज, सब बाहर से मंगाया जाता था। एक ऐसा देश जिसके खेत, जहाज़ और मॉनसून के अनुमान मौसम पर टिके थे, वह मौसम नापने वाले औज़ार तक खुद नहीं बना पाता था।',
      text: 'In 1948, after training in instrument-making in England, she joined the Meteorological Department of newly independent India — and found a quiet embarrassment: nearly every instrument India used to read its own weather, every barometer and thermometer and rain gauge, was imported. A country whose farms, ships and monsoon forecasts hung on the weather could not build the tools that measured it.' },
    { art: ['annamani'], who: null, mood: 'wow',
      hi: 'अन्ना मणि ने इसी को अपनी ज़िंदगी का मकसद बना लिया। उन्होंने मौसम से जुड़े लगभग सौ उपकरणों के नक्शे जुटाए, उन्हें मानकीकृत किया और भारतीय वर्कशॉपों से अपने तय किए कड़े मानकों के हिसाब से उन्हें बनवाया — वे अपने सख्त उसूलों के लिए मशहूर थीं — जब तक कि भारत की मौसम सेवा पूरी तरह भारत में बने उपकरणों पर न चलने लगी, और बाहर से मंगाना बंद नहीं हो गया। किसी म्यूज़ियम में शायद ही आपको उनका काम देखने को मिले; बल्कि उनका काम तो देश के हर मौसम केंद्र में हज़ारों की तादाद में लगा हुआ है।',
      text: 'Anna Mani made that her life\'s work. She gathered and standardised the drawings of about a hundred weather instruments and drove Indian workshops to manufacture them to her exacting standards — she was famously exacting — until the weather service of India ran on instruments made in India, and the importing stopped. Almost nothing in a museum will show you her work; it hangs instead, by the thousand, in every weather station in the country.' },
    { art: ['annamani'], who: null,
      hi: 'वे वहाँ भी काम करती रहीं जहाँ हवा और पतली होती जाती है। उन्होंने ओज़ोन को नापने वाले उपकरण बनाए और उड़ाए — वह नाज़ुक, अदृश्य परत जो सूरज की सबसे तीखी किरणों से हर जीव की रक्षा करती है — इससे बरसों पहले कि दुनिया इसके बारे में सचमुच फिक्रमंद होती, और उन्होंने इस पर नज़र रखने वाले अंतरराष्ट्रीय आयोग में भी अपनी सेवाएँ दीं। और अपने तथाकथित रिटायरमेंट के बाद उन्होंने अपना रुख हवा की ओर किया: पूरे देश में मापन केंद्र बनाए, भारत की हवाओं और धूप पर मार्गदर्शिकाएँ तैयार कीं — वही शांत बुनियाद, जिस पर आज भारत की पहाड़ियों पर पवन चक्कियाँ घूमती हैं।',
      text: 'She kept going where the air got thinner. She built and flew instruments to measure ozone — the fragile, invisible layer that shields all life from the sun\'s harshest rays — years before the world grew properly worried about it, and served on the international commission that watches it. And in her so-called retirement she turned to the wind: measuring stations across the country, handbooks of India\'s winds and sunshine — the quiet groundwork under the wind farms that turn on Indian ridges today.' },
    { art: ['annamani'], who: 'mithu',
      hi: 'हीरे की बालियाँ सिर्फ एक इंसान के लिए चमकती हैं। एक मौसम सेवा, ओज़ोन का रिकॉर्ड और हवाओं का नक्शा सौ करोड़ लोगों के काम आते हैं। वे आठ साल की उम्र में ही यह फ़र्क समझ गई थीं — और उन्होंने कभी अपना इरादा नहीं बदला।',
      text: 'Diamond earrings sparkle for one person. A weather service, an ozone record and a wind atlas work for a billion. She knew the difference at eight years old — and never once changed her mind.' }
  ],
  moral: 'She spent her life measuring what cannot be seen — wind, ozone, the weight of air — and her trick was always the same: build the instrument yourself.',
  source: 'The World Meteorological Organization\'s published tribute to Anna Mani; her documented interviews, retold in Abha Sur\'s "Dispersed Radiance", which carry the encyclopaedia-instead-of-earrings story in her own telling, and the Raman-laboratory years with the withheld doctorate; India Meteorological Department institutional history for the standardisation of some hundred weather instruments, the ozone work and International Ozone Commission membership, and the solar radiation and wind-energy handbooks and survey stations of her later years.'
},

/* =========================================================== TESSY THOMAS == */
{
  id: 'sci-tessy',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
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
      hi: 'टेसी थॉमस का जन्म 1963 में केरल के आलाप्पुड़ा में हुआ था — नहरों और नारियल के रेशों का एक शहर — और उनके परिवार के अनुसार, उनका नाम मदर टेरेसा के नाम पर रखा गया था। वे केरल के उसी समुद्री तट की बेटी थीं जहाँ, नीचे थुंबा में, मछुआरों के एक गाँव से भारत के पहले रॉकेट उड़ रहे थे; आप यह कहानी इसी अलमारी में पढ़ चुके हैं। वे बड़ी हुईं तो गणित में होशियार थीं और किसी मुश्किल सवाल के पीछे पड़कर उसे हल करने में उससे भी माहिर।',
      text: 'Tessy Thomas was born in 1963 in Alappuzha, Kerala — a town of canals and coir — and named, her family has said, after Mother Teresa. She was a child of the same Kerala coast where, down at Thumba, India\'s first rockets were rising from a fishing village; you have read that story on this shelf. She grew up good at mathematics and better at not letting go of a problem.' },
    { art: ['tessy'], who: null, mood: 'think',
      hi: '"उन्होंने इंजीनियरिंग की पढ़ाई की, और 1988 में डीआरडीओ से जुड़ गईं — वह संस्थान जो भारत की रक्षा तकनीक बनाता है — जहाँ उन्हें अग्नि कार्यक्रम पर काम करने का ज़िम्मा मिला। अग्नि यानी आग के नाम पर रखी गई लंबी दूरी की मिसाइलें, और ये वो दौर था जब ए. पी. जे. अब्दुल कलाम उन दफ़्तरों की कमान संभालते थे। टेसी की ख़ासियत इस क्षेत्र की सबसे गहरी गुत्थी में थी: गाइडेंस यानी रास्ता दिखाना। रॉकेट में आग लगाना तो बस एक धमाकेदार शुरुआत होती है। असली मुश्किल तो उसके बाद शुरू होती है — एक ऐसी मशीन जिसे हज़ारों किलोमीटर की उड़ान में हर एक सेकंड ठीक-ठीक पता होना चाहिए कि वह कहाँ है, किधर जा रही है, और इतनी भयानक रफ़्तार में अकेले उड़ते हुए, जहाँ कोई उस तक पहुँच भी नहीं सकता, ख़ुद अपना रास्ता कैसे दुरुस्त करना है।"',
      text: 'She studied engineering, and in 1988 joined DRDO — the organisation that builds India\'s defence technology — where she was put to work on the Agni programme, the long-range missiles named for fire, in the years when A. P. J. Abdul Kalam led those corridors. Her specialism was the deep end of the field: guidance. Lighting a rocket is the loud part. The hard part is everything after — a machine that must know, every single second of a flight across thousands of kilometres, exactly where it is, where it is going, and how to correct itself, alone, at enormous speed, with nobody able to reach it.' },
    { art: ['tessy'], who: null,
      hi: '"उन्होंने बीस साल इस हुनर को साधने में बिताए — रास्ता दिखाना, उड़ान का रास्ता तय करना, और हवा को चीरते हुए वापस लौटने की वह ख़तरनाक फ़िज़िक्स, जब लौटते हुए यान को टूटते तारे जैसी तपती आग से बचकर निकलना होता है। वह उस रास्ते से आगे बढ़ीं जिसे इंजीनियर्स सबसे ज़्यादा सम्मान देते हैं: एक-एक उड़ान के साथ, एक-एक सुलझाई गई मुश्किल के साथ। मिसाइल बनाने वाली टीमों में कोई झूठी तारीफ़ नहीं चलती; चिड़िया उड़ती है या नहीं उड़ती, और हर कोई जानता है कि उसमें किसकी मेहनत लगी है।"',
      text: 'She spent twenty years mastering that art — guidance, trajectory, the fierce physics of re-entry, when a returning craft must survive its own meteor-hot plunge back through the air. She rose the way engineers respect most: flight by flight, problem by solved problem. Missile teams keep no polite fictions; the bird flies or it does not, and everyone knows whose work is aboard.' },
    { art: ['tessy'], who: null, mood: 'wow',
      hi: '"2011 में, टेसी थॉमस के प्रोजेक्ट डायरेक्टर रहते अग्नि-चार ने सफ़ल उड़ान भरी — वह किसी भारतीय मिसाइल प्रोजेक्ट की कमान संभालने वाली पहली महिला थीं। और 19 अप्रैल 2012 को आया इससे भी बड़ा दिन: अग्नि-पाँच की पहली उड़ान, भारत द्वारा अब तक बनाई गई सबसे लंबी दूरी की मिसाइल, जो पाँच हज़ार किलोमीटर पार कर सकती थी — एक ऐसी ताक़त जो दुनिया के चंद देशों के पास ही है। टेसी इसकी प्रोग्राम डायरेक्टर थीं। उड़ान पूरी तरह कामयाब रही। इस शानदार पल को बयां करने के लिए अख़बारों ने उन्हें एक नया नाम दिया: अग्निपुत्री — यानी आग की बेटी। यह नाम अख़बारों की देन था, और उन्होंने इसे बहुत सादगी से स्वीकारा; लेकिन ख़ुद के लिए उनका अपना शब्द हमेशा बिल्कुल सीधा-सादा रहा है। इंजीनियर।"',
      text: 'In 2011, Agni-IV flew successfully with Tessy Thomas as its project director — the first woman ever to lead an Indian missile project. And on 19 April 2012 came the bigger day: the first flight of Agni-V, the longest-legged missile India had ever built, able to cross five thousand kilometres — a capability only a handful of nations possess. She was its programme director. The launch worked. The newspapers, reaching for a name equal to the moment, coined one: Agniputri — daughter of fire. The nickname is the press\'s invention, and she has worn it lightly; her own word for herself has always been simpler. Engineer.' },
    { art: ['tessy'], who: null,
      hi: '"उनका काम उन्हें आगे बढ़ाता रहा: आगे चलकर वह डीआरडीओ के तमाम एयरोनॉटिकल सिस्टम्स की मुखिया बनीं — हज़ारों इंजीनियर्स और हवा में उड़ने वाली हर चीज़ उनके अधीन थी। अगर कोई पूछे कि उनकी कहानी में सबसे ख़ास बात क्या थी, तो इतिहास साफ़ जवाब देता है: सिर्फ़ यह नहीं कि आख़िरकार किसी महिला ने मिसाइल कार्यक्रम की कमान संभाली, बल्कि यह कि उनके नेतृत्व में उड़ी मिसाइलों ने बिल्कुल सटीक निशाना साधा — और यह कि अब भारत में बैठकर गणित का होमवर्क करती हर बच्ची यह पक्के तौर पर जानती है कि यह दरवाज़ा उसके लिए भी खुला है।"',
      text: 'The work carried her on: she went on to head all of DRDO\'s aeronautical systems — thousands of engineers, everything that flies. Ask what mattered in her story and the record answers plainly: not that a woman finally led a missile programme, but that the missiles she led flew true — and that every girl in India doing her mathematics homework now knows, as a settled fact, that this door stands open.' },
    { art: ['tessy'], who: 'mithu',
      hi: '"आग तो कोई भी लगा सकता है। असली हुनर तो उसे पल-पल यह सिखाने में है कि उसे ठीक कहाँ जाना है — एक मिसाइल में, और ज़रा सोच कर देखें, तो ज़िंदगी में भी।"',
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
