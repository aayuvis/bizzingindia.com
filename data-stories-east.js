/* Bizzing India — story content, EAST and the ISLANDS.

   Same shape as data-stories.js / data-stories-regional.js / data-stories-more.js,
   on its own global so all the sets can be loaded and merged independently.

   Coverage tranche: Lakshadweep (from zero), the Andaman & Nicobar Islands,
   Jharkhand, Odisha and West Bengal.

   Editorial notes for this file (docs/05 is binding):

   - Lakshadweep is a Muslim, Malayali- and Mahl-speaking seafaring society and is
     told that way from the inside: the odam sets out after prayers because that is
     when it sets out. Nothing here ranks or compares any faith.
   - The indigenous peoples of the Andaman and Nicobar Islands — Great Andamanese,
     Onge, Jarawa, Sentinelese, Nicobarese, Shompen — are living, small and
     protected communities. This file follows the pattern set by fk.andaman-fire:
     landscape, animals and settler history carry the islands; where a community's
     own life is described (the Nicobarese, the languages story) it is credited,
     ethnographically grounded, and never caricatured. No story here puts words in
     the mouth of a protected people.
   - Adivasi traditions of Jharkhand — Santhal, Munda, Oraon (Kurukh), Asur, Ho —
     are told from the inside and credited by name.
   - Where a telling is the app's own — a nature tale in a region's idiom rather
     than a collected folk text — the source line SAYS SO plainly instead of
     inventing a tradition. Where an old telling is harsher than this one, the
     source line says that too.
   - it.birsa-munda touches colonial-era conflict and is flagged needs_review per
     docs/05 §6: a human author with a named reviewer signs off before publish.
   - Bonbibi of the Sundarbans is revered by Hindu and Muslim families alike; the
     story keeps both present and judges neither, and the tiger is respected,
     never a monster.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is said / told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_EAST = [

/* ======================================================== LAKSHADWEEP ====== */
{
  id: 'fk.cheraman-sails',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Sailors Who Found the Islands',
  hook: 'They set out to look for a king who had sailed away. They found something better than a king.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['खोज', 'khoj', 'search'], ['तूफ़ान', 'toofan', 'storm'], ['द्वीप', 'dweep', 'island']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'केरल के तट के पास, नीले समंदर पर हरे मोतियों की मुट्ठी जैसे बिखरे हुए, लक्षद्वीप के द्वीप फैले हैं — भारत के नक्शे की सबसे छोटी, और सबसे खूबसूरत जगहों में से एक। वहाँ के रहने वाले खुद एक कहानी सुनाते हैं कि कैसे किसी ने पहली बार इन द्वीपों को खोजा था।',
      text: 'Off the coast of Kerala, scattered over the blue like a handful of green beads, lie the islands of Lakshadweep — the smallest of all the places on India\'s map, and one of the loveliest. The islanders themselves tell a story about how anyone ever found them at all.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'कहते हैं कि बहुत समय पहले, केरल तट के एक महान राजा — चेरामन पेरुमल — एक रात अपने महल से निकले और पश्चिम की ओर समंदर पार चले गए, और फिर कभी वापस नहीं लौटे। और उनकी प्रजा इसे ऐसे ही कैसे छोड़ सकती थी? उनकी खोज के लिए जहाज़ तैयार किए गए।',
      text: 'Long ago, they say, a great king of the Kerala coast — the Cheraman Perumal — left his palace one night and sailed away west across the sea, and did not come back. And his people could not simply let that be. Ships were fitted out to look for him.' },
    { art: ['guard'], who: 'guard',
      hi: '"हम पश्चिम की ओर समंदर के रास्ते चलेंगे," नाविकों ने कहा, "और हर बंदरगाह पर तब तक पूछेंगे जब तक कोई उन्हें देख न ले।" उन्होंने पानी, चावल और नारियल लादे, सबको अलविदा कहा, और मछुआरों की नावों को पीछे छोड़ते हुए खुले समंदर में निकल पड़े।',
      text: '"We will follow the sea road west," said the sailors, "and ask at every port until somebody has seen him." They loaded water and rice and coconuts, said their goodbyes, and went out past the fishing boats into open water.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'मगर समंदर के इरादे कुछ और ही थे। दक्षिण-पश्चिम से एक भयानक तूफ़ान उठा — मॉनसून का वही बड़ा तूफ़ान, जिसके आगे किसी की नहीं चलती — और वह उनके पाल, उनकी पतवार, और रास्ते की सारी समझ उड़ा ले गया, और उन्हें कई दिनों तक नक्शे के सूने हिस्से की तरफ़ धकेलता रहा।',
      text: 'The sea had other plans. A storm came up from the south-west — the big monsoon kind, the kind you do not argue with — and it took their sails, and their steering, and their idea of where they were, and blew them for days into the empty part of the map.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'जब आख़िरकार हवा थमी, तो उनके जहाज़ टूट चुके थे और वे बह रहे थे; पीने का पानी ख़त्म हो चुका था, और किसी भी तरफ़ ज़मीन का नामो-निशान नज़र नहीं आ रहा था।',
      text: 'When the wind finally dropped, they were wrecked and drifting, out of fresh water, with no land in sight in any direction at all.',
      ask: {
        q: 'No compass, no chart, no coast. How do sailors in an old story find land?',
        options: ['Shout for help as loudly as possible', 'Watch the birds and the clouds', 'Row in a straight line and hope'],
        answer: 1,
        right: 'That is the old way. Birds fly home to land at evening, and clouds pile up over islands. They followed both.',
        wrong: 'They did what island sailors have always done: watched the birds going home at evening, and the clouds that stack up over land — and followed.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'और भोर के समय, देखने से पहले ही उन्हें आवाज़ सुनाई दी — समंदर के बीचों-बीच चट्टानों से टकराती लहरों के सफ़ेद झाग की एक लंबी लकीर। उस चट्टान के पीछे पानी इतना चमकीला हरा था कि असली ही नहीं लगता था, और उस हरे पानी के पीछे रेत थी, और रेत के पीछे नारियल के पेड़।',
      text: 'And at dawn they heard it before they saw it — a long white line of surf, breaking on a reef in the middle of the ocean. Behind the reef the water turned a green so bright it did not look real, and behind the green there was sand, and behind the sand there were coconut palms.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"नारियलों में पानी है," पानी चीरते हुए किनारे आते सबसे बुज़ुर्ग नाविक ने कहा, "और लैगून में मछलियाँ हैं, और यहाँ ऐसी एक भी चीज़ नहीं है जो हमें नुकसान पहुँचाना चाहती हो।" उन्होंने जहाज़ की मरम्मत की। और जब वे घर लौटे और सबको बताया, तो लोग फिर से वहाँ जाने लगे — इस बार जान-बूझकर।',
      text: '"There is water in the coconuts," said the oldest sailor, wading ashore, "and fish in the lagoon, and not one single thing here that wants to hurt us." They mended the ship. And when they got home and told everyone, people began to go back — on purpose, this time.' },
    { art: ['courtier'], who: null,
      hi: 'मालाबार तट से परिवार आए और वहीं बस गए। उन्होंने मूँगे की चट्टानों को समझा, द्वीपों के नाम रखे, और भी नारियल के पेड़ लगाए, और द्वीपवासी बन गए — और उन्हीं के बच्चों के बच्चों के बच्चे आज लक्षद्वीप के लोग हैं, जो अब भी मलयालम बोलते हैं, अब भी समंदर को किताब की तरह पढ़ लेते हैं।',
      text: 'Families came from the Malabar coast and stayed. They learned the reefs, named the islands, planted more palms, and became the islanders — and their children\'s children\'s children are the people of Lakshadweep today, still speaking Malayalam, still reading the sea like a book.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'उन्हें राजा कभी नहीं मिले। द्वीप के लोग हल्की मुस्कान के साथ आपको बताएँगे कि राजा को ढूँढना कभी मकसद था ही नहीं। असली मकसद तो ये द्वीप थे। कुछ तलाशें ऐसी ही होती हैं।',
      text: 'They never did find the king. The islanders will tell you, with a small smile, that the king was never the point. The islands were the point. Some searches are like that.' }
  ],
  moral: 'Set out looking for one thing and stay ready to find another. The best discoveries are usually the ones you were not making.',
  source: 'The traditional account of the discovery and settlement of Lakshadweep — sailors driven onto the islands during the search for the vanished Cheraman Perumal — as told on the islands and recorded in the old gazetteers of Laccadive, Minicoy and Amindivi. Historians treat it as legend, and it is told here as one. Many versions.'
},

{
  id: 'fk.ubaidullah-lamp',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Dream That Crossed the Sea',
  hook: 'A man had a dream that told him to sail east. The sea took everything he had except the dream.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['सपना', 'sapna', 'dream'], ['दीया', 'diya', 'lamp'], ['समुद्र', 'samudra', 'sea']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'लक्षद्वीप के लोग मुसलमान हैं, और बहुत लंबे समय से हैं — हर द्वीप के बीचों-बीच मस्जिद है, पाँच वक़्त की नमाज़ से दिन ढलता और निकलता है, और सुबह की नमाज़ के बाद नावें समंदर में उतरती हैं। द्वीप के लोग एक कहानी सुनाते हैं कि कैसे यह धर्म पहली बार पानी के रास्ते उन तक पहुँचा।',
      text: 'The people of Lakshadweep are Muslim, and have been for a very long time — the mosque is the middle of every island, the day is shaped by the five prayers, and the boats go out after the morning one. The islanders tell a story about how the faith first came across the water to them.' },
    { art: ['courtier'], who: null,
      hi: 'कहते हैं, बहुत समय पहले अरब में उबैदुल्लाह नाम के एक नेक इंसान रहते थे। एक रात उन्होंने एक ख़्वाब देखा — एक साफ़, शांत और सच्चा ख़्वाब — जिसने उनसे कहा कि समंदर पर जाओ, जहाज़ पर सवार होओ, और पूरब के दूर-दराज़ द्वीपों तक यह दीन लेकर जाओ। वे जागे और वह ख़्वाब बाक़ी ख़्वाबों की तरह ओझल नहीं हुआ।',
      text: 'Long ago in Arabia, they say, there lived a good man named Ubaidullah. One night he had a dream — a clear, quiet, unmistakable dream — that told him to go to the sea, board a ship, and carry the faith to islands far away in the east. He woke up and the dream did not fade the way dreams do.' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'think',
      hi: '"पूरब तो बहुत बड़ी जगह है," उनके दोस्तों ने कहा। "कौन-से द्वीप? कितनी दूर? तुम्हें खाना कौन खिलाएगा?" और उबैदुल्लाह ने कहा, "ख़्वाब में यह नहीं बताया गया था। मैं जाकर ही पता लगाऊँगा।" और वे बंदरगाह गए और पूरब की तरफ़ जाने वाले पहले ही जहाज़ पर सवार हो गए।',
      text: '"East is a big place," his friends said. "Which islands? How far? Who will feed you?" And Ubaidullah said, "The dream did not say. I will find out by going." And he went down to the harbour and took the first ship sailing east.',
      ask: {
        q: 'Setting out with no map, no address, and no plan except trust. Is that brave or foolish?',
        options: ['Foolish — you should always know where you are going', 'Brave — some journeys only show you the way once you start', 'Neither — he should have waited for a second dream'],
        answer: 1,
        right: 'The islanders would say so. In this story, the way appears under the traveller\'s feet — but only after the first step.',
        wrong: 'The islanders tell it as bravery. In this story the way appears under the traveller\'s feet — but only after the first step.'
      } },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'दूर गहरे समंदर में, एक तूफ़ान ने जहाज़ के टुकड़े-टुकड़े कर दिए। उबैदुल्लाह लकड़ी का एक तख़्ता पकड़े पानी में जा गिरे। लहरें उन्हें बहा ले गईं, इधर-उधर उलटती रहीं, और दूर ले जाती रहीं — कितनी देर तक, कोई नहीं कह सकता — जब तक कि उन्होंने उन्हें आधे डूबे हुए और पूरी तरह भटके हुए, एक छोटे से हरे-भरे द्वीप के किनारे पर नहीं पहुँचा दिया।',
      text: 'Far out at sea, a storm broke the ship to pieces. Ubaidullah went into the water holding a plank, and the waves took him, and turned him over, and carried him — for how long, nobody can say — until they set him down, half-drowned and entirely lost, on the beach of a small green island.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'वह अमिनी द्वीप था, उन द्वीपों में से जिन्हें आज हम लक्षद्वीप कहते हैं। भोर के समय द्वीपवासियों को अपनी रेत पर एक अजनबी मिला, जिसके पास कुछ भी नहीं था — न कोई सामान, न सोना, यहाँ तक कि जूते भी नहीं। उन्होंने उन्हें पानी दिया, खाना दिया और छांव दी, क्योंकि यही तो किया जाता है।',
      text: 'It was Amini, in the islands we now call Lakshadweep. The islanders found a stranger on their sand at dawn with nothing at all — no goods, no gold, not even shoes. They gave him water, and food, and shade, because that is what you do.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'और वे वहीं बस गए, उनकी बोली सीखी, और इतने प्यार से रहे और एक ईश्वर तथा सीधे रास्ते के बारे में इतनी सादगी से बात की कि लोग उनकी बातें सुनने लगे — पहले कुछ लोग, फिर पूरे-के-पूरे परिवार, और फिर वक़्त के साथ, एक के बाद एक कई द्वीप। किसी के साथ कोई ज़बरदस्ती नहीं की गई। यह एक ऐसी बात है जिसका यह कहानी खास ध्यान रखती है: उनके पास किसी पर ज़बरदस्ती करने के लिए कुछ था ही नहीं। उनके पास बस एक सपना था और अच्छा व्यवहार।',
      text: 'And he stayed, and learned their words, and lived so gently and spoke so plainly about the One God and the straight path that people began to listen — first a few, then households, then, in time, island after island. Nobody was forced. That is a thing the story is careful about: he had nothing to force anyone with. He had a dream and good manners.' },
    { art: ['courtier'], who: null,
      hi: 'उबैदुल्लाह द्वीप के लोगों के बीच ही बूढ़े हुए। जब उनका देहांत हुआ, तो उन्हें अंद्रोत द्वीप पर दफ़नाया गया, और उनकी मज़ार आज भी वहीं है — एक शांत, सफेदी पुती जगह जहाँ दीया हमेशा जलता रहता है, और सभी द्वीपों से लोग दुआ करने और उन्हें याद करने आते हैं।',
      text: 'Ubaidullah grew old among the islanders. When he died, he was buried on the island of Andrott, and his grave is there today — a quiet, whitewashed place where the lamp is kept lit, and people come from all the islands to pray and to remember him.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'अंद्रोत के पास से गुज़रने वाले मछुआरे आज भी ठीक-ठीक जानते हैं कि पेड़ों के बीच वह दरगाह कहाँ पर है। यह इन सारे द्वीपों की सबसे पुरानी और सबसे अज़ीज़ जगहों में से एक है — वह जगह जहाँ, जैसा कि द्वीप के लोग बताते हैं, वह सपना आखिरकार अपनी मंज़िल तक पहुँच गया।',
      text: 'Fishermen passing Andrott still know exactly where the dargah stands among the palms. It is one of the oldest and most loved places in all the islands — the spot where, as the islanders tell it, the dream finally arrived at its address.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आज भी लक्षद्वीप के हर द्वीप पर दिन की शुरुआत वैसे ही होती है जैसे उनकी होती थी: पहले प्रार्थना से, और फिर समंदर से। किसी भी द्वीपवासी परिवार से उबैदुल्लाह के बारे में पूछिए — यह उन्हीं की कहानी है, और वे ही इसे सबसे अच्छे ढंग से सुनाते हैं।',
      text: 'On every island of Lakshadweep today, the day still begins the way his did: with prayer, and then with the sea. Ask an islander family about Ubaidullah — this is their story, and they tell it best.' }
  ],
  moral: 'A message carried gently travels further than one carried loudly. He arrived with nothing, and it was enough.',
  source: 'The tradition of Hazrat Ubaidullah, told across Lakshadweep as the coming of Islam to the islands; his dargah at Andrott is a revered place of visitation today. An island tradition, told here from the inside; versions differ island to island.'
},

{
  id: 'fk.odam-race',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'Race Day on the Lagoon',
  hook: 'Ten rowers, one drum, and a whole island on the beach shouting. Today the boats race.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['नाव', 'naav', 'boat'], ['दौड़', 'daud', 'race'], ['साथ', 'saath', 'together']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'लक्षद्वीप के सबसे दक्षिणी द्वीप मिनिकॉय पर, हर गाँव के पास दौड़ के लिए एक शानदार नाव होती है — लंबी, पतली और किसी साज़ की तरह चमकाई हुई। यहाँ के लोग पाल वाली नावें, जिन्हें वे \'ओडम\' कहते हैं, लगभग किसी से भी बेहतर बनाते हैं, और त्योहारों के दिनों में ये नावें लैगून के पानी पर दौड़ लगाती हैं।',
      text: 'On Minicoy, the southernmost island of Lakshadweep, every village keeps a great racing boat, long and slim and polished like a musical instrument. The islanders build sailing boats — odam, they call the big ones — better than almost anyone, and on festival days the boats race across the lagoon.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'दौड़ से कई दिन पहले से, बस नाव ही सब कुछ होती है। उसे तेल लगाकर तब तक रगड़ा जाता है जब तक वह चमक न उठे। शाम को मल्लाह अभ्यास करते हैं, और छोटे-छोटे बच्चे उथले पानी में खड़े होकर अपने पिताओं, चाचाओं और बड़ी बहनों को ताल गिनते हुए देखते हैं — क्योंकि हर कोई अच्छी तरह जानता है कि कौन सी टीम किसकी है।',
      text: 'For days before a race, the boat is everything. It is oiled and rubbed until it shines. The crew practises in the evenings, and small children stand in the shallows watching their fathers and uncles and big sisters count the stroke — because everyone knows exactly whose crew is whose.' },
    { art: ['guard'], who: 'guard',
      hi: '"दौड़ की नाव सिर्फ़ मज़बूत बाज़ुओं का खेल नहीं है," बूढ़े माँझी हर साल नए मल्लाहों से कहते हैं। "इस लैगून में मज़बूत बाज़ुओं की कोई कमी नहीं है। दौड़ की नाव का मतलब है दस लोगों का एक बनकर नाव चलाना। जिस दिन तुम यह सीख जाओगे, हम जीतना शुरू कर देंगे।"',
      text: '"A race boat is not about strong arms," the old steersman tells the new rowers, every single year. "The lagoon is full of strong arms. A race boat is about ten people rowing as one person. The day you learn that, we start winning."' },
    { art: ['courtier'], who: null,
      hi: 'दौड़ की सुबह सबसे पहले दुआ माँगी जाती है, जैसा कि इस द्वीप पर हर काम से पहले होता है — सभी मल्लाह बाकी लोगों के साथ मस्जिद जाते हैं, और नावें रेत पर इंतज़ार करती हैं, और किसी को इंतज़ार से कोई परेशानी नहीं होती, क्योंकि अच्छी शुरुआत से ही काम अच्छा होता है।',
      text: 'On the morning of the race there are prayers first, as there are before everything on the islands — the crews go to the mosque with everyone else, and the boats wait on the sand, and nobody minds waiting, because a thing goes better begun properly.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'इस साल, एक टीम के सामने एक मुश्किल आ गई। उनके सबसे मज़बूत मल्लाह के हाथ में चोट लग गई। उस खाली जगह को भरने के लिए किनारे पर दो लोग मौजूद हैं: एक चौड़े कंधों वाला हट्टा-कट्टा मुसाफ़िर जिसने उनके साथ कभी नाव नहीं चलाई, और एक दुबला-पतला चौदह साल का लड़का जिसने दो साल तक हर शाम इसी टीम के साथ अभ्यास किया है।',
      text: 'This year, one crew has a problem. Their strongest rower has hurt his hand. There are two people on the beach who could take the empty seat: a big, broad-shouldered visitor who has never rowed with them, and a thin fourteen-year-old who has practised with this crew every evening for two years.',
      ask: {
        q: 'One empty seat. The strong stranger, or the thin teenager who knows the stroke?',
        options: ['The strong stranger — muscles win races', 'The teenager — the crew rows as one, and she knows the one', 'Leave the seat empty'],
        answer: 1,
        right: 'The steersman did not even hesitate. "She knows our stroke. Get in." Ten as one beats nine and a stranger.',
        wrong: 'The steersman chose the teenager, and did not even hesitate. "She knows our stroke. Get in." Ten as one beats nine and a stranger.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'नगाड़े की थाप के साथ ताल बँधती है और नावें फेंके हुए भालों की तरह तेज़ी से आगे निकल पड़ती हैं। चारों तरफ़ पानी के छींटे। पूरा द्वीप समुद्र किनारे मौजूद है — दादियाँ, नन्हे बच्चे, और अपनी दुकान बंद करके आया दुकानदार — सब अपने गाँव के लिए ज़ोर-शोर से नारे लगा रहे हैं, और लैगून का पानी इतना साफ़ है कि नीचे तलहटी पर दौड़ती नावों की परछाइयाँ साफ़ दिखाई दे रही हैं।',
      text: 'The drum sets the stroke and the boats go off the line like thrown spears. Spray everywhere. The whole island is on the beach — grandmothers, babies, the shopkeeper who shut his shop — roaring for their village, and the lagoon is so clear you can see the boats\' shadows racing along the bottom beneath them.' },
    { art: ['courtier'], who: null,
      hi: 'वे आधी नाव की दूरी से जीत जाते हैं, और उस चौदह साल की लड़की को कंधों पर उठाकर किनारे लाया जाता है, जो यह दिखाने की पूरी कोशिश कर रही है जैसे उसके साथ तो ऐसा रोज़ ही होता हो।',
      text: 'They win by half a boat\'s length, and the fourteen-year-old is carried up the beach on shoulders, trying very hard to look as if this sort of thing happens to her all the time.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'और फिर — यह वह बात है जिसकी बाहर से आने वाले कभी उम्मीद नहीं करते — सब मिलकर एक साथ खाते हैं। जीतने वाली टोली, हारने वाली टोलियाँ, सब के सब। यह मुकाबला सिर्फ़ तब तक मुकाबला रहता है जब तक नावें पानी में हैं और उससे एक मिनट भी ज़्यादा नहीं, क्योंकि कल यही औरतें और मर्द उसी समंदर में मछली पकड़ रहे होंगे, और वहाँ वे सब एक ही टोली हैं।',
      text: 'And then — this is the part visitors never expect — everybody eats together. Winning crew, losing crews, everyone. The race is a contest for exactly as long as the boats are in the water and not one minute longer, because tomorrow these same men and women will be fishing the same sea, and out there they are all one crew.' },
    { art: ['guard'], who: 'mithu',
      hi: 'अगर आप कभी मिनिकॉय जाएँ, तो पूछिए कि इस साल किस गाँव की नाव सबसे तेज़ है। फिर किसी दूसरे गाँव के इंसान से पूछिए, और दोनों जवाबों की तुलना करके देखिए। इसे यहाँ बड़ा ज़बरदस्त मनोरंजन माना जाता है।',
      text: 'If you ever go to Minicoy, ask which village\'s boat is fastest this year. Then ask someone from a different village, and compare the answers. This is considered excellent entertainment.' }
  ],
  moral: 'Ten rowing as one beat eleven rowing as eleven — on the lagoon and everywhere else.',
  source: 'Boat racing on Minicoy, Lakshadweep, where each village keeps and races its own great rowing boat and the island\'s builders are famous for the odam, the traditional sailing vessel. Race days are real and current; the crew in this telling is the app\'s own.'
},

{
  id: 'fk.minicoy-mahl',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Island That Speaks Mahl',
  hook: 'On one island of Lakshadweep, the words come from across the sea — and are written from right to left.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['भाषा', 'bhasha', 'language'], ['पड़ोसी', 'padosi', 'neighbour'], ['चचेरा भाई', 'chachera bhai', 'cousin']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'लक्षद्वीप के ज़्यादातर द्वीपों पर मलयालम बोली जाती है, ठीक केरल के उस तट की तरह जहाँ से लोग आए थे। लेकिन नाव लेकर दक्षिण की ओर बढ़िए, बाकी सभी द्वीपों को पार करते हुए आखिरी द्वीप — मिनिकॉय — तक, और भाषा बदल जाती है। यहाँ के लोग महल बोलते हैं।',
      text: 'Most of the islands of Lakshadweep speak Malayalam, like the Kerala coast they came from. But sail south, past all the others, to the last island — Minicoy — and the language changes. Here the people speak Mahl.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'महल वही भाषा है जो ठीक दक्षिण में बसे द्वीपीय देश मालदीव में बोली जाती है — मालदीव के लोग इसे दिवेही कहते हैं। इसका मतलब यह है कि मिनिकॉय का एक बच्चा और मालदीव का एक बच्चा, किसी अंतरराष्ट्रीय सीमा के आर-पार भी, अपने-अपने घरों की रसोई वाली भाषा में आपस में बात कर सकते हैं।',
      text: 'Mahl is the same language spoken in the Maldives, the island country just to the south — the Maldivians call it Divehi. Which means a child on Minicoy and a child in the Maldives can talk to each other, across an international border, in the language of their own kitchens.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: '"मिनिकॉय तो नक्शे पर लिखा हमारा नाम है," द्वीप का कोई रहने वाला आपको बताएगा। "हमारे द्वीप का हमारा अपना नाम मलिकु है।" मलिकु — इसे धीमे से बोलिए, बिल्कुल वैसे जैसे वे बोलते हैं। जो द्वीप अपने लिए अपना नाम संभालकर रखता है, वह द्वीप बखूबी जानता है कि वह असल में कौन है।',
      text: '"Minicoy is our map name," an islander will tell you. "Our own name for our island is Maliku." Maliku — say it softly, the way they do. An island that keeps its own name for itself is an island that knows exactly who it is.' },
    { art: ['courtier'], who: null,
      hi: 'नक्शों पर लकीरें खिंचने से बहुत पहले, मलिकु और मालदीव के बीच का समंदर कोई दीवार नहीं था — वह एक रास्ता था। नावें इधर से उधर आती-जाती थीं। शादियों से दोनों तरफ के परिवार आपस में जुड़ते थे। कहानियाँ, गीत और पकवानों के नुस्खे दोनों तरफ आते-जाते रहे। सरहद तो बाद में आई; भाई-बहन पहले आए।',
      text: 'Long before the map lines were drawn, the sea between Maliku and the Maldives was not a wall — it was a road. Boats went back and forth. Families married across it. Stories and songs and recipes travelled both ways. The border came later; the cousins came first.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'और महल भाषा में एक और अनोखी बात है। यह अपनी ही लिपि में लिखी जाती है, जिसे ताना कहते हैं — और अरबी की तरह, ताना भी पन्ने पर दाएँ से बाएँ लिखी जाती है।',
      text: 'And Mahl has one more surprise. It is written in its own script, called Thaana — and Thaana runs from right to left across the page, like Arabic.',
      ask: {
        q: 'A Minicoy child can write her name in Thaana, in Malayalam script, in English, and often in Hindi too. What is that many scripts worth?',
        options: ['Not much — one is enough for anybody', 'A lot — every script is another window she can look through', 'It only matters for exams'],
        answer: 1,
        right: 'Every script is a window. She has four, and the view is different from each one.',
        wrong: 'The islanders would say: every script is a window, and she has four of them. The view is different from each.'
      } },
    { art: ['guard'], who: null,
      hi: 'बाकी लक्षद्वीप की तरह ही, मिनिकॉय के स्कूल में बच्चे मलयालम और अंग्रेज़ी में पढ़ते हैं। घर पर बातचीत महल में होती है। नानी-दादी का कोई गीत, कोई कहावत, किसी खास हवा के लिए वह सही लफ़्ज़ जिसका किसी दूसरी भाषा में कोई नाम तक नहीं — ये सब महल में ही ज़िंदा हैं, और बच्चे इन्हें अपने साथ सँभालकर रखते हैं।',
      text: 'At school on Minicoy the children learn in Malayalam and English like the rest of Lakshadweep. At home the talk is Mahl. A grandmother\'s song, a proverb, the right word for a particular wind that no other language bothers to name — those live in Mahl, and the children carry them.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"आप भारतीय हैं या मालदीव वालों जैसे हैं?" एक बार किसी मुसाफ़िर ने मलिकु के एक बूढ़े नाविक से पूछा। उन्होंने बड़ी शराफ़त से सोचा। "लाइटहाउस अंग्रेज़ों का बनाया हुआ है, टूना मछली सबकी है, भाषा मेरी माँ की है, और यह द्वीप भारतीय है," उन्होंने कहा। "एक इंसान पूरा बंदरगाह हो सकता है। उसे सिर्फ़ एक नाव बनकर रहने की ज़रूरत नहीं।"',
      text: '"Are you Indian or are you like the Maldivians?" a visitor once asked an old Maliku sailor. He thought about it politely. "The lighthouse is British-built, the tuna is everyone\'s, the language is my mother\'s, and the island is Indian," he said. "A man can be a whole harbour. He does not have to be one boat."' },
    { art: ['courtier'], who: null,
      hi: 'मिनिकॉय के दक्षिणी छोर पर बना विशाल लाइटहाउस 1880 के दशक से खड़ा है, और यहाँ के लोग नाविकों के रूप में पूरे अरब सागर में मशहूर हैं — मलिकु के लोगों ने बड़े-बड़े जहाज़ों पर काम करते हुए दुनिया भर के बंदरगाहों का सफ़र किया है, अपनी भाषा को अपने साथ ले गए और पूरी दुनिया को समेटकर अपने घर ले आए।',
      text: 'The great lighthouse at the southern end of Minicoy has stood since the 1880s, and the islanders are famous across the Arabian Sea as sailors — Maliku men have crewed big ships to ports all over the world, taking their language with them and bringing the world home.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'भारत में सैकड़ों भाषाएँ बोली जाती हैं, और उनमें से एक ऐसी भी है जो सिर्फ़ उसके एक ही द्वीप पर बोली जाती है — और अपने पड़ोसी देश के साथ भी बड़े प्यार से बांटी जाती है। अगर आप कभी मिनिकॉय के किसी इंसान से मिलें, तो उनसे महल भाषा में कुछ बोलने को ज़रूर कहें। आप दुनिया के उन गिने-चुने लोगों में होंगे जिन्होंने इसे सुना है।',
      text: 'India speaks hundreds of languages, and here is one spoken on exactly one of its islands — shared, warmly, with the neighbour country next door. If you ever meet someone from Minicoy, ask them to say something in Mahl. You will be one of the few people on Earth who has heard it.' }
  ],
  moral: 'A border is a line on the water. A language is a family — and family reaches across.',
  source: 'Minicoy (Maliku), Lakshadweep, where the language is Mahl — the same language as the Maldives\' Divehi — written in the right-to-left Thaana script; the island\'s historic lighthouse dates from the 1880s. All current and real; the sailor\'s words are the app\'s own telling.'
},

{
  id: 'fk.tuna-star',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'One Fish at a Time',
  hook: 'No nets. No dragging the sea empty. On these islands, tuna are caught one at a time, like a fair game — and a star shows the way home.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['तारा', 'tara', 'star'], ['मछली', 'machhli', 'fish'], ['सुबह', 'subah', 'morning']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'लक्षद्वीप के एक द्वीप पर, भोर की पहली किरण फूटने से पहले ही, ट्यूना पकड़ने वाली नाव जाग उठती है। मल्लाह सुबह की नमाज़ पढ़ते हैं, कुछ गरमा-गरम पीते हैं, और पानी की तरफ़ चल पड़ते हैं, जबकि आसमान अभी तय ही कर रहा होता है कि उसे कौन-सा रंग ओढ़ना है।',
      text: 'Before first light on a Lakshadweep island, the tuna boat is already awake. The crew prays the dawn prayer, drinks something hot, and goes down to the water while the sky is still deciding what colour to be.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'पहला पड़ाव: लैगून, चारा पकड़ने के लिए — चमचमाती नन्हीं रूपहली मछलियों से भरा एक झोंका, जिन्हें नाव पर समुद्री पानी की टंकी में ज़िंदा और तैरते हुए रखा जाता है। छोटी मछलियों के बिना बड़ी मछली नहीं मिलेगी। समंदर में हर चीज़ एक-दूसरे से जुड़ी है; मछुआरे यह बात तैरना सीखने से भी पहले सीख जाते हैं।',
      text: 'First stop: the lagoon, to catch bait — a shimmering scoopful of tiny silver fish, kept alive and swimming in a tank of seawater on board. Without the little fish there will be no big fish. Everything at sea is connected to everything else; fishermen learn that before they learn to swim.' },
    { art: ['guard'], who: 'guard', mood: 'wow',
      hi: 'रीफ़ से आगे निकलकर, निगरानी करने वाला पानी को पढ़ता है। "पक्षी!" — जहाँ समुद्री पक्षी गोता लगा रहे होते हैं, वहीं नीचे ट्यूना शिकार कर रही होती हैं। नाव तेज़ी से आगे बढ़ती है, मल्लाह ज़िंदा चारा फेंकते हैं, और कोई समंदर पर पानी की बौछार करता है ताकि सतह झिलमिलाने और उबलने लगे — और ट्यूना खाने के लिए पागल होकर टूट पड़ती हैं, हर चमकती चीज़ पर झपट्टा मारने लगती हैं।',
      text: 'Out past the reef, the lookout reads the water. "Birds!" — where seabirds are diving, tuna are hunting beneath. The boat runs in, the crew flings live bait, and someone sprays the sea with water so it flickers and boils — and the tuna go into a feeding frenzy, striking at everything that glitters.' },
    { art: ['guard'], who: null,
      hi: 'और अब आता है सबसे मशहूर हिस्सा। हर मछुआरे के पास एक छड़ी, एक छोटी डोरी और एक बिना कांटे वाला हुक होता है। मछली फँसी — एक ज़ोरदार खिंचाव — और एक स्किपजैक ट्यूना कंधे के ऊपर से उड़ती हुई डेक पर आ गिरती है। छड़ी और डोरी, एक बार में बस एक मछली, ठीक उसी तरह जैसे उनके दादाजी किया करते थे।',
      text: 'And now the famous part. Each fisherman has a pole, a short line, and one barbless hook. Strike — a heave — and a skipjack tuna comes flying over the shoulder onto the deck. Pole and line, one fish at a time, exactly the way their grandfathers did it.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'एक बार एक मुसाफ़िर ने कप्तान से वही सीधा-सा सवाल पूछा: एक बहुत बड़ा जाल डालकर एक ही बार में मछलियों का पूरा झुंड क्यों नहीं पकड़ लेते?',
      text: 'A visitor once asked the captain the obvious question: why not use a giant net and take the whole school in one go?',
      ask: {
        q: 'Why would fishermen choose to catch fish one at a time when a big net could take thousands?',
        options: ['They cannot afford big nets', 'One at a time takes only what is needed — and leaves the sea full for next year', 'Tuna cannot be caught in nets'],
        answer: 1,
        right: 'That is it exactly. The pole takes the fish that bite and leaves the school alive. These islands have fished this way for generations, and the tuna keep coming back.',
        wrong: 'The captain smiled. "A net takes everything — the mothers, the babies, next year\'s fish. My pole takes what bites today and leaves the sea full. Ask me again in twenty years which of us is still fishing."'
      } },
    { art: ['courtier'], who: null,
      hi: 'किनारे लौटकर, पकड़ी गई मछलियों से \'मास\' बनता है — ट्यूना को उबाला जाता है, धुएँ में पकाया जाता है और तब तक सुखाया जाता है जब तक वह सख्त और गहरे रंग की न हो जाए और महीनों तक चले। मिनिकॉय की यह सूखी ट्यूना सदियों से इन समंदरों में मशहूर रही है; जहाज़ सिर्फ़ इसे खरीदने के लिए इस द्वीप पर आया करते थे।',
      text: 'Back on shore, the catch becomes mas — tuna boiled, smoked and dried until it is hard and dark and keeps for months. Minicoy\'s cured tuna has been famous across these seas for centuries; ships used to call at the island just to buy it.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'और शाम को, दिशा पहचानने का वही पुराना पाठ, जो किसी खानदानी नुस्खे की तरह पीढ़ी-दर-पीढ़ी चला आ रहा था। दादाजी समुद्र के ऊपर, उत्तर की ओर इशारा करते हैं। "उसे ढूँढ़ो जो अपनी जगह से नहीं हिलता। बाकी सारे तारे रात भर आसमान में चलते रहते हैं। बस वही एक अपनी जगह टिका रहता है, और वह ठीक उत्तर के ऊपर खड़ा रहता है। कभी रास्ता भटक जाओ, तो अपना तारा ढूँढ़ लो।"',
      text: 'And in the evening, the old navigation lesson, passed down like a family recipe. The grandfather points north, low over the sea. "Find the one that does not move. All the other stars walk across the sky all night. That one stands still, and it stands over north. Lose your way, find your star."' },
    { art: ['courtier'], who: null,
      hi: 'अब तो नावों में इंजन हैं, जीपीएस है, और वॉटरप्रूफ़ थैलियों में फ़ोन भी हैं। दादाजी यह बात जानते हैं। फिर भी वे तारे की पहचान सिखाते हैं। वे कहते हैं, बैटरियाँ ख़त्म हो जाती हैं। आसमान कभी ख़त्म नहीं होता।',
      text: 'The boats have engines now, and GPS, and phones in waterproof pouches. The grandfathers know this. They teach the star anyway. Batteries run out, they say. The sky does not.' },
    { art: ['guard'], who: 'mithu',
      hi: 'आज रात, अगर तुम जहाँ हो वहाँ आसमान साफ़ है, तो ध्रुव तारा ढूँढ़ना — वही, जो अपनी जगह से कभी नहीं हिलता। लक्षद्वीप के मछुआरे भी ठीक उसी तारे को देख रहे हैं। यह उन सबसे पुरानी चीज़ों में से एक है जिसे इंसानों ने सदियों से आपस में साझा किया है।',
      text: 'Tonight, if the sky is clear where you are, look for the Pole Star — Dhruv Tara, the still one. Fishermen in Lakshadweep are looking at exactly the same star. It is one of the oldest things people have ever shared.' }
  ],
  moral: 'Take what you need and leave the sea full. And always know your still star.',
  source: 'Pole-and-line tuna fishing as practised in Lakshadweep — live bait, barbless hooks, one fish at a time — and the cured tuna (mas) for which Minicoy has long been known. The method and the star-lore are real and current; the family in this telling is the app\'s own.'
},

{
  id: 'fk.first-coconut',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Nut That Crossed the Ocean',
  hook: 'Before there was anyone on the sandbank, something small and round and patient came riding in on the waves.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'pt_crow'],
  minutes: 3,
  place: ['IN-LD'],
  words_hi: [['नारियल', 'nariyal', 'coconut'], ['लहर', 'lehar', 'wave'], ['किनारा', 'kinara', 'shore']],
  scenes: [
    { art: ['pt_tortoise'], who: null,
      hi: 'यहाँ सबसे छोटे टापुओं की एक कहानी है — वे जो कभी गहरे समुद्र में मूँगे की चट्टान पर बस सफ़ेद रेत का एक टीला भर थे, जहाँ न कोई पेड़ था, न कोई छाँव, न पीने का मीठा पानी, और न कोई रहने वाला।',
      text: 'Here is a tale for the smallest islands — the ones that began as nothing but a white sandbank on a coral reef, far out at sea, with no tree, no shade, no fresh water, and nobody home.' },
    { art: ['pt_tortoise'], who: null,
      hi: 'दूर कहीं, किसी हरे-भरे तट पर, नारियल का एक पेड़ पानी की ओर झुका हुआ था, जैसे वे हमेशा झुकते हैं — नारियल के पेड़ हमेशा समुद्र की तरफ़ ही झुकते हैं, मानो किसी बात को सुनने की कोशिश कर रहे हों। और एक दिन एक पका हुआ नारियल डाल से छूटा, नीचे गिरा, गीली रेत पर एक बार उछला, और लहरों में लुढ़क गया।',
      text: 'Far away, on some green coast, a coconut palm leaned out over the water, the way they do — coconut palms always lean towards the sea, as if they are listening for something. And one day a ripe nut let go, dropped, bounced once on the wet sand, and rolled into the waves.' },
    { art: ['pt_crow', 'pt_tortoise'], who: 'pt_crow', mood: 'think',
      hi: '"तुम डूब जाओगे," ऊपर से एक समुद्री पक्षी ने नारियल से कहा। "वहाँ आगे सब कुछ डूब जाता है।" लेकिन नारियल नहीं डूबा। वह तैरता रहा — पानी की सतह पर शांत और टिका हुआ, जैसे किसी बेहद अकलमंद कारीगर की बनाई एक छोटी सी भूरी नाव।',
      text: '"You will drown," a gull told the coconut, from above. "Everything drowns out there." But the coconut did not drown. It floated — riding low and calm, like a small brown boat that had been designed by someone very clever.',
      ask: {
        q: 'What does a coconut carry inside its husk that lets it cross an ocean?',
        options: ['A little air to float, and its own water and food for the journey', 'A tiny sail', 'Nothing — it just gets lucky'],
        answer: 0,
        right: 'That is exactly right, and it is real: the husk floats, and inside is water to drink and food to grow on. A coconut is a packed suitcase.',
        wrong: 'Better than luck: the husk holds air so it floats, and inside is its own water and its own food. A coconut is a packed suitcase, ready for a long trip.'
      } },
    { art: ['pt_tortoise'], who: null,
      hi: '"हफ़्तों तक वह पानी की लहरों पर बहता रहा। उसके ऊपर से तूफ़ान गुज़र गए। बड़ी-बड़ी मछलियों ने उसे देखा और छोड़ दिया। उसमें वैसा ही धीरज था जैसा सिर्फ़ बीजों में होता है — यानी पूरा का पूरा।"',
      text: 'It rode the currents for weeks. Storms passed over it. Big fish looked at it and decided against it. It was patient the way only seeds are patient — which is completely.' },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      hi: '"और आख़िरकार बाकी सबसे ऊँची एक लहर ने उसे उठाया और समंदर के बीचों-बीच एक सफ़ेद रेतीले टीले पर ऊपर पहुँचा दिया — पानी के घेरे से ऊपर, गुनगुनी रेत में, हज़ार मील के दायरे की उस अकेली जगह पर जहाँ से वह अपनी नई शुरुआत कर सकता था।"',
      text: 'And at last a wave, taller than the rest, picked it up and set it down high on the white sandbank in the middle of the sea — above the tide line, in the warm sand, in the one place in a thousand miles where it could begin.' },
    { art: ['pt_tortoise'], who: null,
      hi: '"उसने अपना ही पानी पिया। उसने अपनी ही ख़ुराक खाई। उसने उस रेत में जड़ें जमाईं जिसमें पहले कभी कोई जड़ नहीं गई थी, और पंख जैसी एक हरी पत्ती ऊपर निकाल दी। टापू का पहला पेड़। समुद्री पक्षी उस पर आकर बैठने लगे, और उनके आने से दूसरी चीज़ों के बीज भी पहुँचे, और धीरे-धीरे वह रेतीला टीला हरा-भरा हो गया।"',
      text: 'It drank its own water. It ate its own food. It put down roots into sand that had never held a root before, and sent up one green feather of a leaf. The first tree on the island. The gulls came to sit in it, and their visits brought seeds of other things, and slowly the sandbank turned green.' },
    { art: ['pt_crow'], who: null,
      hi: '"और जब बहुत समय बाद लोग उस टापू पर आए, तो नारियल के पेड़ उनका इंतज़ार कर रहे थे — फलों में मीठा पानी, छाल से रस्सी, पत्तियों से छतें, तनों से नावें, तेल, छाँव, सब कुछ। लक्षद्वीप के लोग कहते हैं कि इस एक पेड़ की दी हुई चीज़ों के सहारे पूरी ज़िंदगी बड़े आराम से कट सकती है, और यह बात उनसे बेहतर कौन जानेगा।"',
      text: 'And when, long after, people came to that island, the palms were waiting for them — sweet water in the nuts, rope from the husk, roofs from the leaves, boats from the trunks, oil, shade, everything. The islanders of Lakshadweep say you can live a whole good life in the gifts of this one tree, and they should know.' },
    { art: ['pt_tortoise'], who: 'mithu',
      hi: '"हर टापू पर मौजूद हर नारियल का पेड़ किसी ऐसे ही बहादुर नारियल की औलाद की औलाद है, जो अकेले ही समंदर पार कर गया था। अगली बार जब कोई छोटी और धीमी सी चीज़ किसी बड़े काम पर निकले, तो यह बात याद रखने लायक है।"',
      text: 'Every coconut palm on every island is the great-great-grandchild of some brave nut that crossed the water alone. Which is worth remembering, next time something small and slow sets out on something big.' }
  ],
  moral: 'Small, slow and packed with patience will cross an ocean that big and loud cannot.',
  source: 'A Bizzing India telling, said so plainly: there is no single collected folk text behind it. The natural history is real — coconuts genuinely float across oceans and sprout on far beaches, and the palm is the tree of life of Lakshadweep, where almost every part of it is used.'
},

{
  id: 'fk.turtle-lagoon',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Turtle Who Kept the Lagoon Calm',
  hook: 'Outside the reef, the ocean roars all day. Inside, the water lies still as a mirror. The islanders\' children know who to thank.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'courtier'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['कछुआ', 'kachhua', 'turtle'], ['शांति', 'shanti', 'calm'], ['धीरे', 'dheere', 'slowly']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"लक्षद्वीप के हर टापू के दो समंदर होते हैं। मूँगे की चट्टानों के बाहर बड़ा गहरा समंदर है, जिसे हमेशा जल्दी मची रहती है और जो हमेशा गरजता रहता है। चट्टानों के अंदर लैगून की शांत झील है — हरे काँच जैसी, नहाने के गुनगुने पानी जैसी, और इतनी थमी हुई कि नाव से नीचे तली पर केकड़े को चलते हुए देखा जा सकता है।"',
      text: 'Every Lakshadweep island has two seas. Outside the reef is the big dark ocean, which is always in a hurry and always shouting. Inside the reef is the lagoon — green glass, warm as bathwater, so still you can watch a crab walk on the bottom from a boat.' },
    { art: ['pt_tortoise'], who: null,
      hi: 'लैगून में एक बूढ़ी हरी कछुआ रहती है। वह वहाँ इतने पुराने ज़माने से है जितना किसी की दादी-नानी को भी याद नहीं। वह समुद्री घास के मैदानों को वैसे ही चरती है जैसे कोई गाय खेत में चरती है, और वह ऊपर उठती है, एक धीमी साँस लेती है, और फिर नीचे डूब जाती है — बस यही उसका पूरा दिन है, और उसे इसका कोई पछतावा नहीं।',
      text: 'In the lagoon lives an old green turtle. She has been there longer than anyone\'s grandmother can remember. She grazes on the seagrass meadows the way a cow grazes a field, and she rises, and takes one slow breath, and sinks, and that is her whole day, and she is not sorry.' },
    { art: ['pt_tortoise', 'courtier'], who: null,
      hi: 'टापू के बच्चे आपस में कहते हैं कि लैगून उसी की वजह से शांत रहता है। वे कहते हैं कि हर सुबह, वह मूँगे की चट्टान के अंदर-अंदर धीरे-धीरे एक पूरा चक्कर तैरती है — और जहाँ-जहाँ से वह गुज़रती है, पानी को याद आ जाता है कि शांत कैसे रहा जाता है।',
      text: 'The island children tell each other that the lagoon is calm because of her. Every morning, they say, she swims one slow circle right around the inside of the reef — and everywhere she passes, the water remembers how to be still.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'एक मानसून, बाहर का समंदर कई दिनों तक उफनता रहा, और लैगून भी बेचैन होने लगा — नावों को थपेड़े मारता, किनारे की रेत को काटता हुआ। एक छोटा लड़का दौड़कर अपने दादाजी के पास गया। "कछुआ ने अपना चक्कर लगाना छोड़ दिया है! किसी को जाकर उससे कहना चाहिए कि वह जल्दी करे!"',
      text: 'One monsoon, the sea outside went wild for days, and even the lagoon began to fret — slapping at the boats, chewing at the sand. A small boy ran to his grandfather. "The turtle has stopped swimming her circle! Someone must go and tell her to hurry!"',
      ask: {
        q: 'The lagoon is upset and the turtle is as slow as ever. Should somebody make her hurry?',
        options: ['Yes — a storm is no time to be slow', 'No — her slowness is not the problem, it is the cure', 'Yes — or find a faster turtle'],
        answer: 1,
        right: 'The grandfather said the same. "She has seen a hundred storms, and hurried for none of them. Watch what she does instead."',
        wrong: 'The grandfather shook his head. "She has seen a hundred storms, and hurried for none of them. Her slowness is not the problem. Watch."'
      } },
    { art: ['pt_tortoise'], who: null,
      hi: 'उन्होंने किनारे से देखा। दूर उस उफनते लैगून में, वह बूढ़ी कछुआ अपना वही चक्कर काट रही थी — वही घेरा, वही रफ़्तार, सूरज के उगने जैसी बेफ़िक्र और शांत, जबकि पानी उसके चारों तरफ़ उछल रहा था और शोर मचा रहा था।',
      text: 'They watched from the beach. Out in the churning lagoon, the old turtle was swimming her circle — the same circle, at the same speed, unhurried as sunrise, while the water leapt and fussed around her.' },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      hi: 'और जहाँ-जहाँ से वह गुज़र चुकी थी, पानी शांत होता गया। इसलिए नहीं कि उसने उसे दबा दिया था। बल्कि इसलिए, क्योंकि किसी ऐसे के पास रहकर जो बिल्कुल भी घबराने को तैयार न हो, समंदर के लिए भी लगातार घबराते रहना बहुत मुश्किल होता है।',
      text: 'And wherever she had passed, the water settled. Not because she pushed it down. Because it is very hard, even for a sea, to keep panicking next to somebody who simply is not going to.' },
    { art: ['courtier'], who: null,
      hi: 'शाम तक बाहर का तूफ़ान अब भी गरज रहा था — लेकिन लैगून फिर से शांत लेटा था, नावों को थामे हुए, ताड़ के पेड़ों की परछाइयों को समेटे हुए, बिल्कुल निश्चल और ठहरा हुआ।',
      text: 'By evening the storm outside was still roaring — but the lagoon lay quiet again, holding the boats, holding the reflections of the palms, holding still.' },
    { art: ['courtier', 'pt_tortoise'], who: 'courtier',
      hi: '“उसका सारा हुनर बस यही है,” घर लौटते हुए दादाजी ने कहा। “वह पानी को शांत नहीं करती। वह उसे याद दिलाती है। तुम्हारे अंदर भी ऐसा ही एक कछुआ है — धीमी साँसें, वही गोल चक्कर। जब तुम्हारे अंदर का मौसम शोर मचाने लगे, तो उसे तैरने के लिए भेज दिया करो।”',
      text: '"That is her whole trick," the grandfather said, walking home. "She does not calm the water. She reminds it. There is a turtle like that inside you, too — slow breaths, same circle. When your own weather gets loud, send her swimming."' },
    { art: ['pt_tortoise'], who: 'mithu',
      hi: 'लक्षद्वीप के लैगून में सचमुच के हरे कछुए चरते हैं, और वहाँ उनकी रक्षा की जाती है — हो सकता है किसी दिन तुम भी किसी कछुए के पास तैरो। अगर तैरो, तो धीरे-धीरे चलना। तुम्हारे आने से पहले वह शांत थी; कम से कम तुम भी उसी की तरह शांत तो रह ही सकते हो।',
      text: 'Real green turtles really do graze the lagoons of Lakshadweep, and they are protected there — you may swim near one someday. Move slowly if you do. She was calm before you arrived; the least you can do is match her.' }
  ],
  moral: 'You cannot shout a storm quiet. But calm, kept steadily enough, is catching.',
  source: 'A Bizzing India telling in the idiom of the islands, said so plainly — not a collected folk text. The green turtles, the seagrass meadows and the stillness of the Lakshadweep lagoons are real, and the turtles are protected by law.'
},

{
  id: 'fk.wandering-sandbank',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Sandbank That Goes Visiting',
  hook: 'Some mornings there is a little white island in the lagoon. Some mornings there is only sea. The children say it goes visiting.',
  hero: 'courtier',
  cast: ['courtier', 'pt_crow'],
  minutes: 4,
  place: ['IN-LD'],
  words_hi: [['रेत', 'ret', 'sand'], ['चाँद', 'chand', 'moon'], ['ज्वार', 'jwaar', 'tide']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'लक्षद्वीप के द्वीपों में से एक के पास रेत का एक टीला है — लैगून के बीच सफेद रेत की एक छोटी-सी सूनी पहाड़ी, जहाँ न कोई पेड़ है, न झोपड़ी, न कुछ और। किसी-किसी दिन तुम नाव खेकर वहाँ पहुँच सकते हो, उस पर उतर सकते हो, और दुनिया का सबसे छोटा देश सिर्फ तुम्हारा हो सकता है।',
      text: 'Near one of the islands of Lakshadweep there is a sandbank — a little bare hill of white sand out in the lagoon, with no trees, no huts, no anything. On some days you can row out, land on it, and have the smallest country in the world all to yourself.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और बाकी दिनों में वह बस वहाँ होता ही नहीं। उसी जगह नाव लेकर जाओ तो वहाँ हरा पानी मिलता है, और ठीक उसी जगह मछलियाँ अपने काम में लगी होती हैं जहाँ कल तुम खड़े थे। द्वीप के छोटे बच्चे कहते हैं कि रेत का टीला किसी से मिलने गया है।',
      text: 'And on other days it is simply not there. Row to the same spot and you find green water, with fish going about their business exactly where you stood yesterday. The little ones on the island say the sandbank has gone visiting.' },
    { art: ['courtier', 'pt_crow'], who: null,
      hi: '“किससे मिलने?” कभी न कभी हर बच्चा पूछ ही लेता है। “अपनी माँ से,” दादियाँ कहती हैं, जो पीढ़ियों से यही जवाब देती आ रही हैं। “समुद्र उसकी माँ है। दिन में दो बार तो एक द्वीप भी अपनी माँ के घर जाता है।”',
      text: '"Visiting whom?" asks every child, sooner or later. "Its mother," say the grandmothers, who have been giving this answer for generations. "The sea is its mother. Even an island goes home to its mother twice a day."' },
    { art: ['courtier'], who: null,
      hi: 'बड़े बच्चों को इसका असली जवाब पता चलता है, जो उतना ही अच्छा है: ज्वार-भाटा। दिन में दो बार समुद्र साँस अंदर खींचता है और पानी ऊपर चढ़ आता है, और रेत का टीला अपना सिर सिकोड़ते कछुए की तरह नीचे छिप जाता है। दिन में दो बार समुद्र साँस बाहर छोड़ता है, और वह फिर वहीं सामने आ जाता है, सफेद और भीगा हुआ, मानो कुछ हुआ ही न हो।',
      text: 'The bigger children learn the realer answer, which is just as good: the tide. Twice a day the sea breathes in and the water rises, and the sandbank slips under like a turtle ducking its head. Twice a day the sea breathes out, and there it is again, white and dripping, as if nothing had happened.' },
    { art: ['pt_crow', 'courtier'], who: null, mood: 'think',
      hi: 'और ज्वार को कौन खींचता है? ऊपर देखो। इतनी दूर से चाँद, जब गुज़रता है, तो समंदर को अपनी ओर खींचता है, और समंदर उसकी तरफ़ वैसे ही झुक जाता है जैसे सूरजमुखी सूरज की तरफ़ झुकते हैं। चाँद समंदर को हिलाता है; समंदर रेत के टीले को ढक लेता है। उस रेत पर खड़ा बच्चा मानो चाँदनी से बनी किसी मशीन के अंदर खड़ा हो।',
      text: 'And who pulls the tide? Look up. The moon, all that way away, tugs at the ocean as it passes, and the ocean leans towards it the way sunflowers lean at the sun. The moon moves the sea; the sea covers the sandbank. A child standing on that sand is standing inside a machine made of moonlight.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'एक दोपहर तीन बच्चे नाव खेकर रेत के टीले पर खेलने पहुँचे, और उन्होंने जी भरकर खेला, और खेल अपने सबसे मज़ेदार मोड़ पर ठीक तभी पहुँचा जब पानी की पहली ठंडी उँगली रेत के बीचों-बीच रेंगती हुई आई।',
      text: 'One afternoon three children rowed out to the sandbank to play, and played hard, and the game reached its absolute best part just as the first cold finger of water crept across the middle of the sand.',
      ask: {
        q: 'The best part of the game, and the tide is coming in. What do the island children do?',
        options: ['Finish the game — the water is still shallow', 'Get in the boat now — the sea keeps its schedule, not yours', 'Argue about it for a while'],
        answer: 1,
        right: 'Island children do not argue with the tide. In the boat, at once — the game can finish on the beach.',
        wrong: 'Island children know better than that. The tide keeps its own schedule and does not wait for the end of games. In the boat, at once.'
      } },
    { art: ['courtier'], who: null,
      hi: 'वे नाव में बैठ गए और अपने कदमों के निशानों को हरे पानी के नीचे एक-एक करके गायब होते देखने लगे — पहले किनारे वाले निशान, फिर हॉपस्कॉच के खाने, फिर रेत का किला, और फिर वह पूरा का पूरा छोटा सा देश, मानो कहीं सैर पर निकल गया हो।',
      text: 'They sat in the boat and watched their footprints disappear one by one under the green water — first the ones near the edge, then the hopscotch squares, then the castle, then the whole little country, gone visiting.' },
    { art: ['courtier'], who: null,
      hi: '"यह वापस आ जाएगा," सबसे बड़े बच्चे ने कहा, और अगली ही सुबह वह लौट भी आया, धुलकर एकदम साफ़-सुथरा — हर निशान गायब, हर खेल मिटा हुआ, बिल्कुल नई रेत नए-नए खेलों के लिए तैयार। और सच सोचो, तो किसी टापू को चलाने का यह कितना शानदार तरीका है।',
      text: '"It will come back," said the eldest, and it did, the very next morning, rinsed perfectly clean — every footprint gone, every game erased, brand new sand ready for brand new games. Which is, if you think about it, a wonderful way to run an island.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: 'ज्वार-भाटा सचमुच होता है, चाँद सचमुच उसे खींचता है, और पूरे लक्षद्वीप में रेत के टीले सच में दिन में दो बार दिखाई देते और गायब होते हैं। अपने परिवार से पूछना कि चाँद पूरा कब होता है — वही वह समय होता है जब समंदर सबसे गहरी साँस लेता है, और रेत का टीला सबसे देर तक दूर रहता है।',
      text: 'Tides are real, the moon really does pull them, and low sandbanks all over Lakshadweep really do appear and disappear twice a day. Ask your family when the moon is fullest — that is when the sea breathes deepest, and the sandbank stays away longest.' }
  ],
  moral: 'The sea keeps its own timetable. The wise thing is not to fight it — it is to know it.',
  source: 'A Bizzing India telling, said so plainly — the grandmothers\' answer is the app\'s own invention in the island idiom. The tides, the moon\'s pull, and the sandbanks of the Lakshadweep lagoons that vanish and return twice a day are entirely real.'
},

/* ================================================== ANDAMAN & NICOBAR ====== */
{
  id: 'fk.tree-that-counts',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Trees That Count as Family',
  hook: 'In the Nicobar Islands, when a baby is born, somebody plants a tree — and the tree is not a decoration. It is a plan.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['नारियल', 'nariyal', 'coconut'], ['परिवार', 'parivaar', 'family'], ['पेड़', 'ped', 'tree']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'अंडमान के दक्षिण में, सुमात्रा की ओर एक लड़ी की तरह फैले हुए, निकोबार द्वीप समूह हैं — और वे सबसे पहले और हमेशा निकोबारी लोगों के हैं, जो वहाँ कई सदियों से रहते आए हैं और आज भी रहते हैं। यह कहानी इस बारे में है कि वे किन चीज़ों को अनमोल मानते हैं, और यह उनकी इजाज़त का मान रखते हुए सुनाई गई है: यह उनका हाल बताती है, उनकी जगह खुद बोलने का दावा नहीं करती।',
      text: 'South of the Andamans, strung towards Sumatra, lie the Nicobar Islands — and they belong, first and always, to the Nicobarese, who have lived there for many centuries and still do. This story is about how they count what matters, and it is told with their leave in mind: it describes, it does not pretend to speak for them.' },
    { art: ['courtier'], who: null,
      hi: 'बहुत समय पहले निकोबार द्वीप समूह जाने वाले खोजियों ने एक ऐसी बात लिखी, जिसने उन्हें हैरान कर दिया था। जब उन्होंने पूछा, "यहाँ अमीर कौन है?", तो किसी ने भी सामान से भरे घर की तरफ़ इशारा नहीं किया। लोगों ने नारियल के बागों, सुअरों और बड़ी-बड़ी डोंगियों की तरफ़ इशारा किया। निकोबारियों के हिसाब से दौलत वह है जो लोगों का पेट भरे और उन्हें यहाँ-वहाँ ले जाए — न कि वह जो किसी बक्से में बंद पड़ी रहे।',
      text: 'Ethnographers who visited the Nicobars long ago wrote down something that surprised them. When they asked, "Who is rich here?", nobody pointed at a house full of things. People pointed at coconut groves, and at pigs, and at big canoes. Wealth, in the Nicobarese way of counting, is what feeds people and carries people — not what sits in a box.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'और यहाँ परिवारों को भी बड़े खुले दिल से गिना जाता है। पारंपरिक निकोबारी परिवार — जिसे \'तुहेत\' कहा जाता है — एक बड़ा संयुक्त परिवार होता है: दादा-दादी, चाचा-चाची, बुआ-ताऊ, चचेरे भाई-बहन, सब मिलकर साथ रहते हैं और अपने बाग-बगीचों को साझा रखते हैं। पेड़ किसी एक इंसान के नहीं होते। वे पूरे परिवार के होते हैं, ठीक वैसे ही जैसे परिवार उन पेड़ों का होता है।',
      text: 'And families are counted generously too. The traditional Nicobarese household — the tuhet, as it is called — is a big joint family: grandparents, uncles, aunts, cousins, everyone together, holding their groves and gardens in common. The trees do not belong to one person. They belong to the family, the way the family belongs to the trees.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'इसलिए जब भी कोई बच्चा पैदा होता है, तो उसके लिए नारियल के पेड़ लगाने की यहाँ बहुत पुरानी परंपरा है। ज़रा सोचिए इसका क्या मतलब है। नारियल के पेड़ पर फल आने में कई साल लगते हैं। जो कोई भी उस नवजात बच्चे के लिए पेड़ लगाता है, वह मानो कह रहा होता है: जब मैं बहुत बूढ़ा हो जाऊँगा, तब भी तुम यहीं रहोगे, हम सब यहीं रहेंगे, और यह द्वीप तब भी हमारा पेट भरता रहेगा।',
      text: 'So when a baby is born, it has long been the way to plant coconut palms for the child. Think about what that means. A palm takes years to bear. Whoever plants for a newborn is saying: you will still be here, we will still be here, and the island will still be feeding us, long after I am old.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'एक बार किसी मुसाफ़िर ने अचरज में पड़कर पूछा कि जब सिक्कों को गिनना इतना आसान है, तो भला कोई पेड़ों से अपनी दौलत क्यों नापेगा।',
      text: 'A visitor once wondered aloud why anyone would measure wealth in trees when coins are so much easier to count.',
      ask: {
        q: 'Coins or coconut trees — which is the better way to be rich on an island?',
        options: ['Coins — you can spend them on anything', 'Trees — a coin is spent once, a tree gives food every year for a lifetime', 'Neither — being rich does not matter'],
        answer: 1,
        right: 'That is the island arithmetic. A coin leaves your hand once. A grove feeds your grandchildren.',
        wrong: 'Island arithmetic says otherwise: a coin leaves your hand once and is gone, but a grove stands there feeding your family for a hundred years.'
      } },
    { art: ['guard'], who: null,
      hi: 'नारियल के बाग खाना, तेल और पानी देते हैं; सुअर उन दावतों के लिए होते हैं जब पूरा गाँव इकट्ठा होता है; और तराशी हुई, लहरों पर तेज़ी से तैरने वाली नावें इन द्वीपों को आपस में जोड़ती हैं। बगीचों में रतालू और केवड़ा उगते हैं। यह जीने का एक पूरा तौर-तरीक़ा है, जो हमेशा टिके रहने के लिए बना है, और इसे ख़ुद निकोबारियों ने बनाया है।',
      text: 'The groves give food and oil and drink; the pigs are for feasts, when whole villages gather; the canoes — carved, outrigger-steadied, quick through the surf — knit the islands together. Gardens grow yams and pandanus. It is a whole way of living, built to last, and it was built by the Nicobarese themselves.' },
    { art: ['courtier'], who: null,
      hi: 'द्वीपों पर ज़िंदगी बदली है और बदलती जा रही है — अब वहाँ स्कूल हैं, फ़ेरी नावें हैं और फ़ोन भी हैं, और 2004 की भयानक सुनामी ने इन द्वीपों को बहुत गहरी चोट पहुँचाई थी, फिर भी निकोबारियों ने मिलकर, एक-एक तुहेत के साथ, सब कुछ दोबारा खड़ा कर लिया। उनका वही पुराना हिसाब आज भी ज़िंदा है। सबसे पहले परिवार, और बच्चों के लिए पेड़।',
      text: 'Life on the islands has changed and keeps changing — there are schools and ferries and phones, and the great tsunami of 2004 hit these islands very hard, and the Nicobarese rebuilt, together, tuhet by tuhet. The counting survived. Family first, and trees for the children.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आज निकोबार में कहीं न कहीं ऐसे ताड़ के पेड़ खड़े हैं, जो उन बच्चों के लिए लगाए गए थे जो आज खुद दादा-दादी बन चुके हैं। अपने आप से पूछिए कि आपका परिवार क्या लगाता है — यह हमेशा कोई पेड़ ही नहीं होता, लेकिन हर परिवार कुछ न कुछ ज़रूर लगाता है।',
      text: 'Somewhere in the Nicobars today there are palms standing that were planted for children who are now grandparents. Ask yourself what your family plants — it is not always a tree, but every family plants something.' }
  ],
  moral: 'Real wealth is whatever still feeds your family in fifty years. Count in trees, not coins.',
  source: 'The Nicobarese of the Nicobar Islands, as recorded by ethnographers of the islands and as reported in accounts of Nicobarese life: joint-family tuhets, wealth reckoned in coconut groves, pigs and canoes, and palms planted for children. Practices vary island to island and generation to generation — told here with respect, describing rather than speaking for the community.'
},

{
  id: 'fk.ross-ficus',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Island the Roots Took Back',
  hook: 'It had ballrooms, a bakery, a printing press and a church. Then the people left — and the forest quietly moved back in.',
  hero: 'guard',
  cast: ['guard', 'pt_deer'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['जड़', 'jad', 'root'], ['दीवार', 'deewar', 'wall'], ['जंगल', 'jangal', 'forest']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'अंडमान में पोर्ट ब्लेयर के बिल्कुल पास एक नन्हा-सा द्वीप है, जिसका चक्कर आप एक घंटे में पैदल लगा सकते हैं। सौ-सवा सौ साल पहले, अंग्रेज़ी राज में, यह पूरे द्वीप समूह की छोटी-सी राजधानी हुआ करता था — रॉस आइलैंड, जहाँ हुकूमत चलाने वाले अफ़सर अपने परिवारों के साथ रहते थे।',
      text: 'Just off Port Blair in the Andamans lies a tiny island you can walk around in an hour. A hundred and some years ago, under British rule, it was the little capital of the whole island chain — Ross Island, where the officers who governed lived with their families.' },
    { art: ['guard'], who: null,
      hi: 'अपने छोटे-से आकार के बावजूद, यहाँ सब कुछ था: ऊँची मीनार वाला एक चर्च, एक बेकरी, टेनिस कोर्ट, एक छापाखाना, बगीचे, और समंदर की तरफ़ खुलते बरामदों वाले आलीशान घर। लोग इसे "पूरब का पेरिस" कहते थे, जो शायद थोड़ी बढ़ा-चढ़ाकर की गई बात थी, लेकिन हज़ार मील के दायरे में यह यक़ीनन सबसे शानदार आधा वर्ग किलोमीटर था।',
      text: 'For its size, it had everything: a church with a steeple, a bakery, tennis courts, a printing press, gardens, grand houses with verandas looking out at the sea. People called it the Paris of the East, which was laying it on a bit thick, but it was certainly the fanciest square half-kilometre for a thousand miles.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'पर यह हमेशा नहीं टिका। 1941 में एक ज़बरदस्त भूकंप ने इस द्वीप को हिलाकर रख दिया, और फिर अंडमान पर दूसरा विश्व युद्ध छा गया, और जब यह सब ख़त्म हुआ तो अंग्रेज़ हमेशा के लिए भारत छोड़कर जा रहे थे। लोग चले गए, दरवाज़े खुले रह गए, और द्वीप पर सन्नाटा छा गया।',
      text: 'It did not last. A great earthquake shook the island in 1941, and then the Second World War swept through the Andamans, and when it was all over the British were leaving India altogether. The people went away, and the doors stood open, and the island fell silent.' },
    { art: ['pt_deer', 'guard'], who: null, mood: 'think',
      hi: 'लेकिन कोई द्वीप कभी सचमुच ख़ामोश नहीं होता। कोई चीज़ किनारे पर खड़े होकर शुरू से इंतज़ार कर रही थी — सब्र से भरी, हरी-भरी, और जिसे बिल्कुल कोई जल्दी नहीं थी।',
      text: 'But an island is never really silent. Something had been waiting at the edges the whole time — patient, green, and in absolutely no hurry.',
      ask: {
        q: 'The people are gone. What takes over an abandoned island?',
        options: ['Nothing — empty buildings just stay empty', 'The forest — seed by seed, root by root', 'Pirates'],
        answer: 1,
        right: 'The forest. Birds dropped fig seeds on the rooftops, the rains watered them, and the great ficus trees began to grow — right out of the walls.',
        wrong: 'Not pirates, and never nothing. Birds dropped fig seeds on the rooftops, the rains watered them, and the great ficus trees began to grow — right out of the walls.'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'आज वहाँ जाइए तो आपको कुछ ऐसा दिखेगा जो दुनिया में बहुत कम जगहें दिखा सकती हैं: पेड़ों की बाहों में लिपटी हुई पूरी की पूरी इमारतें। फाइकस की जड़ें दरवाज़ों पर धीमे झरनों की तरह उतरती हैं, खिड़कियों की मेहराबों को लपेट लेती हैं, और चर्च की मीनार पर चढ़ जाती हैं। आप हर बार यह नहीं बता सकते कि दीवार कहाँ ख़त्म होती है और जड़ कहाँ से शुरू — और यही तो कमाल की बात है। द्वीप ने तय कर लिया था कि इन दोनों को एक ही हो जाना चाहिए।',
      text: 'Go there today and you will see something few places on Earth can show you: whole buildings held in the arms of trees. Ficus roots pour down over doorways like slow waterfalls, wrap window arches, climb the church tower. You cannot always tell where wall ends and root begins — and that is the point. The island decided they should be one thing.' },
    { art: ['pt_deer'], who: null,
      hi: 'पुराने परेड मैदान में चित्तीदार हिरण चरते हैं। अफ़सरों के बगीचों से मोर कूकते हैं। समंदर की हवा उन कमरों से होकर गुज़रती है जहाँ कभी नाच हुआ करते थे, और अब वहाँ रोशनी के सिवा कोई नहीं नाचता।',
      text: 'Spotted deer graze on the old parade ground. Peacocks call from the officers\' gardens. The sea wind goes through rooms where dances were held, and nobody dances there but the light.' },
    { art: ['guard'], who: 'guard',
      hi: 'टापू पर एक गाइड इसे कुछ इस तरह समझाता है: "साम्राज्य ने ईंटों से बनाया और सोचा कि यह हमेशा रहेगा। फ़ाइकस सब्र से बनाता है — और सब्र कहीं ज़्यादा मज़बूत चीज़ है।"',
      text: 'A guide on the island likes to put it this way: "The empire built in brick and thought it was building forever. The ficus builds in patience — and patience is the stronger material."' },
    { art: ['guard'], who: null,
      hi: 'अब इस टापू का एक नया सरकारी नाम है — नेताजी सुभाष चंद्र बोस द्वीप, उस स्वतंत्रता सेनानी के सम्मान में जिनका झंडा इन द्वीपों पर फहराया गया था। फ़ेरी नावें हर रोज़ सैलानियों को लाती हैं, और हिरण उन्हें आते-जाते देखते हैं, ठीक वैसे ही जैसे इस टापू ने हर किसी को आते-जाते देखा है।',
      text: 'The island has a new official name now — Netaji Subhas Chandra Bose Dweep, honouring the freedom fighter whose flag was raised in these islands. Ferries bring visitors every day, and the deer watch them come and go, the way the island has watched everyone come and go.' },
    { art: ['pt_deer'], who: 'mithu',
      hi: 'दीवारें ढह जाती हैं और जड़ें बढ़ती जाती हैं — हर जगह, हमेशा, सिर्फ़ वहीं नहीं। यह याद रखने लायक बात है कि आख़िरकार लोग इन दोनों में से किसके लिए तालियाँ बजाते हैं।',
      text: 'Walls fall down and roots grow up — everywhere, always, not just there. It is worth remembering which of the two things people cheer for, in the end.' }
  ],
  moral: 'What is built by force stands for a while. What grows by patience takes it back.',
  source: 'Ross Island (officially renamed Netaji Subhas Chandra Bose Dweep in 2018), Port Blair, Andaman Islands: the former British administrative headquarters, damaged by the 1941 earthquake, abandoned around the Second World War, and now famous for its ficus-covered ruins, deer and peafowl. Open to visitors today; the guide\'s words are the app\'s own telling.'
},

{
  id: 'fk.north-bay-light',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Lighthouse That Says Its Name',
  hook: 'Every lighthouse on every coast blinks — but no two blink alike. Each one is saying who it is, all night long.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['रोशनी', 'roshni', 'light'], ['रात', 'raat', 'night'], ['जहाज़', 'jahaaz', 'ship']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'पोर्ट ब्लेयर के पास बंदरगाह के मुहाने पर, नॉर्थ बे नाम की एक हरी-भरी पहाड़ी पर, एक लाइटहाउस खड़ा है — लाल और सफ़ेद पट्टियों वाला, इतने साफ़ पानी के ऊपर कि नीचे के मूँगे के बगीचे पूरे भारत में मशहूर हैं। सालों तक ठीक इसी नज़ारे की तस्वीर बीस रुपये के पुराने नोट पर छपती थी, इसलिए लाखों लोगों ने बिना इसका नाम जाने इस लाइटहाउस को अपनी जेबों में रखा।',
      text: 'At the mouth of the harbour near Port Blair, on a green headland called North Bay, stands a lighthouse — white and red-banded, above water so clear that the coral gardens below it are famous across India. For years, a picture of this very view was printed on the old twenty-rupee note, so millions of people carried this lighthouse in their pockets without ever knowing its name.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'दिन में तो यह बस यूँ ही खड़ा रहता है और लोग इसकी तस्वीरें लेते रहते हैं। इसका असली काम तब शुरू होता है जब आसमान से रोशनी ढल जाती है और समंदर हज़ारों किलोमीटर में फैली स्याही बन जाता है — क्योंकि उस स्याही पर जहाज़ होते हैं, और ज़मीन को छूने से पहले जहाज़ों को यह जानना ज़रूरी होता है कि ज़मीन कहाँ है।',
      text: 'By day it just stands there being photographed. Its real work starts when the light goes out of the sky and the sea turns into a thousand kilometres of ink — because out on that ink, there are ships, and the ships need to know where the land is before they touch it.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'एक बच्ची, जो लाइटहाउस के रखवाले अपने चाचा से मिलने आई थी, उसने एक बड़ा अच्छा सवाल पूछा। "लेकिन चाचाजी — किसी नाविक को रोशनी दिखाई देती है। ठीक है। पर उसे कैसे पता चलता है कि वह कौन-सी रोशनी है? दुनिया के हर किनारे पर लाइटहाउस होते हैं। रोशनी तो बस रोशनी होती है।"',
      text: 'A girl visiting her uncle, a lighthouse keeper, asked the good question. "But uncle — a sailor sees a light. Fine. How does he know WHICH light? There are lighthouses on every coast in the world. A light is a light."',
      ask: {
        q: 'In the dark, every lighthouse is just a bright dot. How can a sailor tell one from another?',
        options: ['Each lighthouse blinks in its own special rhythm', 'Lighthouses are all different colours', 'Sailors just guess from the map'],
        answer: 0,
        right: 'Exactly. Each lighthouse has its own pattern of flashes — its signature. Count the blinks and the pauses, check the chart, and the light tells you its name.',
        wrong: 'The trick is rhythm. Each lighthouse flashes in its own pattern — so many blinks, so long a pause — like a signature written in light. Count it, check the chart, and the light tells you its name.'
      } },
    { art: ['guard'], who: 'guard',
      hi: '"हर रोशनी रात भर झपक-झपककर अपना नाम बताती है," रखवाले ने कहा। "समुद्री नक्शे में किनारे के हर पैटर्न का हिसाब होता है। नाविक गिनता है — चमक, चमक, ठहराव — और वह ठीक-ठीक जान जाता है कि वह ज़मीन का कौन-सा कोना देख रहा है, और पानी के नीचे चट्टानें कहाँ हैं। रोशनी सिर्फ़ यह नहीं कहती कि यहाँ ज़मीन है। वह कहती है कि यहाँ ज़मीन है, और मैं नॉर्थ बे हूँ।"',
      text: '"Every light says its own name, all night, in blinks," the keeper said. "The chart lists every pattern on the coast. A sailor counts — flash, flash, pause — and knows exactly which headland he is looking at, and exactly where the reef lies. The light is not just saying here is land. It is saying here is land, and I am North Bay."' },
    { art: ['guard'], who: null,
      hi: 'रखवाले का काम बस लगातार नियम से टिके रहने का है: बत्ती, लेंस और लॉग बुक। इसमें कोई रोमांच नहीं होता, और न ही ऐसा होना चाहिए। दूर अंधेरे में कोई, जिससे वह कभी नहीं मिलेगा, आज रात इसलिए सुरक्षित है क्योंकि रोशनी ने आज भी ठीक वही किया जो उसने कल रात किया था।',
      text: 'The keeper\'s work is steadiness itself: the lamp, the lens, the log book. It is not exciting, and it is not supposed to be. Somewhere out in the dark, someone he will never meet is safe because the light did tonight exactly what it did last night.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'यहाँ के समंदर का एक और अजूबा है: पानी खुद कभी-कभी जगमगा उठता है। अंधेरी रातों में, लहरों के हिलने पर पानी के नन्हे जीव चमकने लगते हैं, जिससे नाव के पीछे हल्की आग जैसी लकीर खिंच जाती है। जब से पतवारें बनी हैं, तब से इन द्वीपों के नाविक अपनी पतवारों से रोशनी टपकते देखते आए हैं।',
      text: 'These waters have another wonder: the sea itself sometimes lights up. On dark nights, tiny living things in the water glow when the waves stir them, so a boat\'s wake can trail pale fire. Sailors of these islands have watched their own oars drip light for as long as there have been oars.' },
    { art: ['courtier'], who: null,
      hi: 'और नॉर्थ बे की रोशनी के नीचे, दिन के समय, काँच के तले वाली नावें मूँगे की चट्टानों के ऊपर तैरती हैं — धारीदार मछलियों के झुंड, नीले स्टैगहॉर्न मूँगे, मखमली किनारों वाली विशाल सीपियाँ — एक पूरा शांत शहर, जिसे यह लाइटहाउस पीढ़ियों से जहाज़ों के टूटने से चुपचाप बचाता आ रहा है।',
      text: 'And under the North Bay light, by day, glass-bottomed boats drift over the coral — clouds of striped fish, blue staghorn, giant clams with velvet lips — a whole silent city that the lighthouse has been quietly guarding from shipwreck for generations.' },
    { art: ['guard'], who: 'mithu',
      hi: 'इंसान भी कुछ-कुछ लाइटहाउस जैसे होते हैं, रखवाले चाचा अपनी भतीजी से कहा करते थे। चमक-दमक होना तो आम बात है। पर लगातार एक-सा बने रहना — हर रात अपने सच्चे अंदाज़ में चमकना, चाहे कोई देख रहा हो या नहीं — वही तो असल में जहाजों को सुरक्षित घर पहुँचाता है।',
      text: 'People are a little like lighthouses, the keeper would tell his niece. Being bright is ordinary. Being steady — blinking your own true pattern, every night, whether or not anyone seems to be watching — that is what actually brings the ships home.' }
  ],
  moral: 'Anyone can shine once. A lighthouse is trusted because it shines the same, all night, every night.',
  source: 'The North Bay lighthouse near Port Blair, Andaman Islands — the view familiar from the back of India\'s old twenty-rupee note — and the real system of light characteristics, by which every lighthouse flashes its own charted pattern. The keeper and his niece are the app\'s own telling; sea-sparkle (bioluminescence) is real in these waters.'
},

{
  id: 'fk.dugong-meadow',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Dugong Who Remembered',
  hook: 'Under the sea there are meadows, and in the meadows grazes a gentle giant with a very long memory.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'pt_crocodile'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['समुद्र', 'samudra', 'sea'], ['घास', 'ghaas', 'grass'], ['याद', 'yaad', 'memory']],
  scenes: [
    { art: ['pt_tortoise'], who: null,
      hi: 'ज्यादातर लोग जानते हैं कि समुद्र में मछलियाँ होती हैं। बहुत कम लोग यह जानते हैं कि समुद्र में घास के मैदान भी होते हैं — बिल्कुल असली मैदान, मुलायम हरी समुद्री घास के, जो शांत खाड़ियों के उथले और धूप-खिले पानी में उगते हैं। और जहाँ घास के मैदान होते हैं, वहाँ चरने वाले जीव भी होते हैं। अंडमान और निकोबार द्वीप समूह में चरने वाला यह जीव है डुगोंग: यानी समुद्री गाय।',
      text: 'Most people know the sea has fish. Fewer know the sea has meadows — real ones, of soft green seagrass, growing in the shallow sunlit water of quiet bays. And where there are meadows, there are grazers. In the Andaman and Nicobar Islands, the grazer is the dugong: the sea cow.' },
    { art: ['pt_tortoise'], who: null,
      hi: 'डुगोंग एक नाव जितनी बड़ी और दादी जैसी सौम्य होती है। उसका गोल चेहरा होता है, छोटी-छोटी दयालु आँखें और मूँछों वाले होंठ, जो घास कुतरने के लिए बने हैं। वह किसी को नुकसान नहीं पहुँचाती। वह अपने मैदान में घास खाती है, साँस लेने के लिए धीरे से ऊपर आती है, एक ठंडी साँस भरती है और फिर घास की ओर नीचे उतर जाती है। बहुत पहले नाविकों ने शाम के धुंधलके में उसे ऊपर आते देखा, और दुनिया की आधी जलपरी कहानियों की शुरुआत हो गई।',
      text: 'A dugong is big as a boat and gentle as a grandmother. She has a round face, small kind eyes, and a whiskery lip made for cropping grass. She hurts nobody. She eats her meadow, rises softly for a breath of air, sighs, and sinks back to the grass. Sailors long ago, seeing her rise in the dusk, started half the mermaid stories in the world.' },
    { art: ['pt_crocodile', 'pt_tortoise'], who: null,
      hi: 'अब सुनिए वह कहानी जो इन द्वीपों का पानी सुना सकता है। एक बूढ़ी डुगोंग उसी मैदान में चरती थी जहाँ उसकी माँ चरा करती थी, और उससे पहले उसकी नानी भी। डुगोंग ऐसी ही होती हैं: वे घास के मैदानों का नक्शा अपनी यादों में सँजोकर रखती हैं, जो पीढ़ी-दर-पीढ़ी चला आ रहा है और इंसानों के किसी भी नक्शे से पुराना है।',
      text: 'Now for the tale the islands\' waters could tell. An old dugong grazed the same meadow her mother had grazed, and her mother\'s mother before that. Dugongs are like that: they carry the map of the meadows in their memory, handed down, older than anybody\'s charts.' },
    { art: ['pt_tortoise'], who: null, mood: 'sad',
      hi: 'एक साल, एक तूफ़ान ने उसके मैदान को उजाड़ दिया — घास को उखाड़ फेंका और रेत के नीचे दबा दिया। उसके पास खड़ी नन्हीं डुगोंग, उसकी बेटी, उस उजड़ी हुई जगह पर गोल-गोल घूमती रही और समझ नहीं पाई कि क्या करे। खाने के लिए कुछ नहीं बचा था, और समुद्र अचानक बहुत बड़ा और बहुत खाली लगने लगा।',
      text: 'One year, a storm tore her meadow — ripped the grass, buried it in sand. The young dugong beside her, her daughter, circled the ruined place and did not know what to do. There was nothing to eat, and the sea suddenly seemed very large and very empty.' },
    { art: ['pt_tortoise'], who: 'pt_tortoise', mood: 'think',
      hi: 'बूढ़ी डुगोंग ने उसे हौले से छुआ और उस उजड़े मैदान से मुड़कर तट के किनारे-किनारे तैरने लगी। उसे याद आ रहा था: उत्तर की ओर तीन खाड़ियों के पार, जहाँ मैंग्रोव के पेड़ झुके हुए हैं, वहाँ एक और मैदान है। बहुत पहले उसकी अपनी माँ ने उसे वह जगह दिखाई थी, उस दिन की याद जिसकी ज़रूरत उसे आज तक कभी नहीं पड़ी थी।',
      text: 'The old one nudged her and turned away from the ruin, out along the coast. She was remembering: three bays north, past the point where the mangroves lean out, there is another meadow. Her own mother had shown her, long ago, on a day she had never needed until now.',
      ask: {
        q: 'The old dugong has never needed the far meadow in her whole life. Why did her mother bother showing it to her?',
        options: ['To make the swim longer', 'Because what you learn before you need it is the thing that saves you', 'By accident'],
        answer: 1,
        right: 'That is what memory is for. Grandmothers everywhere teach spare meadows.',
        wrong: 'Nothing about it was accident. What you learn before you need it is exactly the thing that saves you — grandmothers everywhere teach spare meadows.'
      } },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      hi: 'वे साथ-साथ तैरीं, बूढ़ी डुगोंग आगे-आगे चल रही थी, उत्तर की ओर तीन खाड़ियों के पार, झुके हुए मैंग्रोव से आगे — और वह रहा मैदान, पानी के नीचे रोशनी में लहराता हुआ हरा-भरा, ठीक उसी जगह जहाँ यादों ने बताया था। उन्होंने अपने सिर नीचे किए और साथ-साथ चरने लगीं, और साथ चलते-चलते बेटी भी वह रास्ता सीख गई।',
      text: 'They swam together, the old one leading, three bays north, past the leaning mangroves — and there it was, green and waving in the underwater light, exactly where memory said it would be. They put their heads down and grazed, side by side, and the daughter learned the way as she went.' },
    { art: ['pt_crocodile'], who: null,
      hi: 'और उधर उस उजड़े हुए घास के मैदान में, धीमे-धीमे एक नई उम्मीद जाग रही थी: समुद्री घास फिर उग आती है। एक-एक तिनका कर वो पुराना मैदान लौट आया, और एक दिन वो बेटी अपने बच्चे को वापस वहीं ले जाएगी, यादों से बने एक ऐसे रास्ते पर जो कभी मिटता नहीं।',
      text: 'And back at the ruined meadow, something slow and hopeful was happening: seagrass regrows. Blade by blade the old meadow returned, and one day the daughter would lead her own calf back to it, along a path made entirely of remembering.' },
    { art: ['pt_tortoise'], who: null,
      hi: 'डूगोंग अंडमान और निकोबार द्वीप समूह का राजकीय पशु है, और उसे ख़ास सुरक्षा दी गई है — क्योंकि अब बहुत कम डूगोंग बचे हैं, और जो जीव किसी को नुकसान नहीं पहुँचाता, वो ऐसे समंदर का हकदार है जहाँ उसे भी कोई नुकसान न पहुँचे। उसकी रक्षा करने का मतलब है उन घास के मैदानों की भी रक्षा करना। भला कोई घास चरने वाले को बचाकर उसकी घास पर पक्की सड़क कैसे बना सकता है।',
      text: 'The dugong is the official animal of the Andaman and Nicobar Islands, and it is protected — because there are not many left, and a creature that harms nobody deserves waters that harm her back just as little. Protecting her means protecting the meadows too. You cannot save a grazer and pave her grass.' },
    { art: ['pt_tortoise'], who: 'mithu',
      hi: 'अपने घर के सबसे बड़े बुज़ुर्ग से कहो कि वो तुम्हें कोई ऐसी चीज़ दिखाएँ जो उन्होंने अपने सबसे बड़े बुज़ुर्ग से सीखी थी। यही तो समुद्री घास का रास्ता है। हर परिवार इन्हीं रास्तों पर तैरता आगे बढ़ता है।',
      text: 'Ask your oldest relative to show you something they learned from THEIR oldest relative. That is a seagrass path. Every family swims along them.' }
  ],
  moral: 'The elders carry the map of the spare meadows. Learn it before you need it.',
  source: 'A Bizzing India telling, said so plainly — not a collected folk text. The natural history is real: dugongs graze the seagrass meadows of the Andaman and Nicobar Islands, pass on knowledge of feeding grounds, are the islands\' official animal, and are protected under Indian law.'
},

{
  id: 'fk.flying-fox-ferry',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Evening Ferry of the Flying Foxes',
  hook: 'Every evening, on schedule, a slow dark river crosses the island sky. It is not birds. Look closer.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'courtier'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['शाम', 'shaam', 'evening'], ['आकाश', 'aakash', 'sky'], ['बीज', 'beej', 'seed']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'अंडमान के द्वीपों पर दिन का अंत एक अनोखे तमाशे के साथ होता है, और यह तमाशा बिल्कुल मुफ़्त है। जैसे ही आसमान सुनहरा होता है, ऊँचे पेड़ों में से पंख फड़फड़ाती एक लंबी, धीमी कतार ऊपर उठती है और पानी के पार निकल पड़ती है — सैकड़ों बड़े और काले साए, किसी फ़ेरी की कतार जैसे बेफ़िक्र और इत्मीनान से चलते हुए।',
      text: 'On the islands of the Andamans, the day ends with a show, and the show is free. Just as the sky goes gold, a long, slow, flapping line rises out of the tall trees and sets off across the water — hundreds of big dark shapes, unhurried as a ferry queue.' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      hi: 'ये फ़्लाइंग फ़ॉक्स हैं — इन द्वीपों के विशाल चमगादड़, लोमड़ी जैसे लाल चेहरों वाले, बंद छतरी जैसे मुड़े पंखों वाले, और जिनके फैले पंख तुम्हारी दोनों बाँहों के फैलाव से भी बड़े होते हैं। दिन भर वे अपने बसेरे वाले पेड़ों पर उलटे लटके रहते हैं, पंखों से हवा झलते हैं, आपस में हल्की-फुल्की नोंक-झोंक करते हैं, और बिल्कुल कोई काम नहीं करते। शाम होते ही उनका काम शुरू होता है।',
      text: 'They are flying foxes — the great fruit bats of the islands, with fox-red faces, wrapped-umbrella wings, and a wingspan wider than your armspan. All day they hang upside down in their roost trees, fanning themselves, bickering gently, doing absolutely nothing. Evening is when their work begins.' },
    { art: ['pt_crow', 'courtier'], who: null,
      hi: 'और यह सचमुच का काम है। बस इन द्वीपों को इस बात का अहसास नहीं है। ये फ़्लाइंग फ़ॉक्स फलों के पेड़ों की ओर उड़ जाते हैं — जंगली अंजीर, जंगली बादाम, जंगलों में उगे आम — और रात भर दावत उड़ाते हैं। वे खाते हुए खूब बिखेरते हैं, और यह बिखेरना ही तो सारा खेल है।',
      text: 'And it IS work. The islands just do not know it. The flying foxes cross to the fruit trees — wild figs, sea almonds, mangoes gone wild — and they feast all night, and they are messy eaters, and the mess is the whole point.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'अपनी चाची के साथ शाम को इस पार से उस पार जाते चमगादड़ों को देखते हुए एक लड़के ने उनसे बड़ा अच्छा सवाल पूछा, "चाची, पानी के उस पार उस छोटे से टापू पर जो जंगल है—उसे किसने लगाया? वहाँ तो कोई नहीं रहता। कभी कोई रहा भी नहीं।"',
      text: 'A boy watching the evening crossing with his aunt asked her the good question. "Auntie, the forest on that little island across the water — who planted it? Nobody lives there. Nobody ever has."',
      ask: {
        q: 'Nobody ever planted the little island\'s forest. So how did a forest cross the sea?',
        options: ['It grew from nothing', 'Wings and waves carried the seeds — bats, birds and floating fruit', 'Someone planted it secretly at night'],
        answer: 1,
        right: 'That is exactly how. Every seed a flying fox drops is a tree posted to a new address.',
        wrong: 'The secret planters are real, but they have wings. Bats and birds carry seeds in their bellies, the waves float the rest — every seed dropped is a tree posted to a new address.'
      } },
    { art: ['pt_crow'], who: null,
      hi: '"इस आने-जाने को देखो," चाची ने कहा। "जो भी चमगादड़ अंजीर खाती है, वह उसके बीज अपने पेट में लेकर उड़ती है, और आज रात इन टापुओं पर कहीं न कहीं वे बीज गिरेंगे—खुली जगहों में, समुद्री तटों पर, और पानी की ऐसी संकरी खाड़ियों के पार जिन्हें तैरकर कोई बीज कभी पार नहीं कर सकता था। ये चमगादड़ इन टापुओं पर तब से जंगल लगा रहे हैं, जब उन्हें ऐसा करते देखने के लिए यहाँ कोई इंसान भी नहीं था।"',
      text: '"Watch the ferry," said his aunt. "Every fox that eats a fig carries its seeds away inside her, and somewhere out over the islands tonight, seeds will fall — into clearings, onto beaches, across channels no seed could swim. The bats have been planting these islands since before there was anyone here to watch them do it."' },
    { art: ['pt_crow'], who: null,
      hi: 'दिन के समय ये चमगादड़ जिन पुराने पेड़ों पर लटकते हैं, वे उनके जाने-पहचाने ठिकाने हैं—साल-दर-साल वही पेड़, उन्हीं डालियों पर चमगादड़ों की पीढ़ियाँ, मानो कोई ऐसा परिवार जिसने कभी अपना घर ही न बदला हो। टापू के लोग इन्हीं के सहारे रास्ते तय करते हैं: \'चमगादड़ वाले पेड़ों से मुड़ जाना\', और हर किसी को पता होता है कि वह जगह कहाँ है।',
      text: 'The old trees the foxes hang in by day are known roosts — the same trees, year after year, generations of bats in the same branches, like a family that has never once moved house. Islanders navigate by them: turn at the bat trees, everyone knows where that is.' },
    { art: ['courtier'], who: null,
      hi: 'लड़का और उसकी चाची तब तक देखते रहे जब तक कि पीछे छूटे आखिरी चमगादड़ भी पार नहीं निकल गए—शाम के गुलाबी आसमान में छोटे-छोटे काले कॉमा जैसे। "वे भोर होने से पहले लौट आएँगे," चाची ने कहा। "फलों से पेट भरे हुए, और घर लौटने के पूरे रास्ते में पेड़ लगाते हुए। सोना, स्कूल, खाना—यह तुम्हारा नियम है। लटकना, उड़ना, और जंगल उगाना—यह उनका नियम है।"',
      text: 'The boy and his aunt watched until the last stragglers crossed, little black commas against the pink. "They will be back before dawn," she said. "Full of fruit, planting all the way home. Sleep, school, dinner — that is your schedule. Hang, fly, plant a forest — that is theirs."' },
    { art: ['pt_crow'], who: 'mithu',
      hi: 'अगली बार जब तुम कोई फल खाकर उसका बीज यूँ ही उछाल दो—तो बधाई हो, तुमने एक बीज के लिए उड़ने वाले चमगादड़ का काम कर दिया। वे तो रात के अंधेरे में, पंखों पर उड़ते हुए यह काम हज़ारों बार करते हैं। इन टापुओं के जंगल उन्हीं के दस्तख़त हैं।',
      text: 'Next time you eat a fruit and flick the seed away — congratulations, you did a flying fox\'s job for one seed. They do it a thousand times a night, on wings, in the dark. The forests of the islands are their signature.' }
  ],
  moral: 'Some of the most important work in the world looks like a slow line of somebody else\'s evening.',
  source: 'A Bizzing India telling, said so plainly — the aunt and the boy are the app\'s own. The natural history is real: flying foxes (great fruit bats) roost communally in the Andaman Islands, cross between islands at dusk, and are major seed-dispersers by which island forests spread.'
},

{
  id: 'fk.one-island-bird',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Bird With One Island',
  hook: 'Every kind of bird lives somewhere. One hornbill lives on exactly one small island — and nowhere else on Earth.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'guard'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['पक्षी', 'pakshi', 'bird'], ['द्वीप', 'dweep', 'island'], ['घोंसला', 'ghonsla', 'nest']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'मुख्य अंडमान द्वीपों से बहुत दूर, खुले समंदर में अकेला, नारकोंडम नाम का एक छोटा, हरा-भरा ज्वालामुखीय टापू है। वहाँ ऊँची चट्टानें हैं, जंगल हैं, कोई शहर नहीं, और एक ऐसा निवासी है जिसने पक्षी-प्रेमियों के बीच इस जगह को मशहूर बना दिया है: नारकोंडम हॉर्नबिल।',
      text: 'Far out beyond the main Andaman Islands, alone in the open sea, stands a small green volcanic island called Narcondam. It has cliffs, forest, no town, and one resident that has made it famous among people who love birds: the Narcondam hornbill.' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      hi: '"हॉर्नबिल सचमुच एक अनोखा परिंदा होता है — एक बड़ा, खूबसूरत पक्षी जिसकी भारी-भरकम मुड़ी हुई चोंच होती है, और जो अंजीर की तलाश में पेड़ों की डालियों के बीच गोते लगाता रहता है। भारत के कई जंगलों में हॉर्नबिल मिलते हैं। लेकिन यह वाला हॉर्नबिल सिर्फ़ नारकोंडम द्वीप पर ही रहता है। न पास वाले द्वीप पर। न मुख्य ज़मीन पर। पूरी दुनिया में कहीं और नहीं।"',
      text: 'A hornbill is a spectacular thing — a big handsome bird with a huge curved bill, swooping through the canopy after figs. There are hornbills in many forests of India. But THIS hornbill lives on Narcondam Island only. Not the next island. Not the mainland. Nowhere else on the entire planet.' },
    { art: ['pt_crow', 'guard'], who: null,
      hi: '"वैज्ञानिकों के पास इसके लिए एक शब्द है: एंडेमिक। इसका मतलब है "सिर्फ़ यहीं मिलने वाला।" दुनिया भर के सारे नारकोंडम हॉर्नबिल — जितने भी मौजूद हैं, सब के सब — बस एक ऐसे छोटे से द्वीप पर समा जाते हैं जिसे आप एक ही दोपहर में पैदल चलकर पार कर सकते हैं।"',
      text: 'Scientists have a word for that: endemic. It means "found only here." The whole world population of Narcondam hornbills — every single one that exists — fits on one island you could walk across in an afternoon.' },
    { art: ['pt_crow'], who: null,
      hi: '"हॉर्नबिल जिस तरह अपना परिवार पालते हैं, वह किसी मनगढ़ंत कहानी जैसा लगता है, पर है बिल्कुल सच। माँ पक्षी किसी बड़े, पुराने पेड़ में एक खोखली जगह ढूंढती है, अंदर जाकर बैठ जाती है, और कीचड़ व लेप से अंदर से ही दरवाज़ा बंद कर लेती है — बस एक पतली सी झिरी छोड़कर। वह अपने अंडों के साथ उस चारदीवारी में बंद रहती है, हर सांप और तूफ़ान से पूरी तरह सुरक्षित।"',
      text: 'Hornbills raise their families in a way that sounds made up and is not. The mother finds a hollow in a big old tree, settles in, and seals the entrance from inside with mud and paste — leaving only a narrow slit. She stays walled in with her eggs, safe from every snake and storm.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      hi: '"पर इससे एक साफ़ मुश्किल खड़ी होती है: दीवार के अंदर बंद माँ ख़रीदारी करने बाहर नहीं जा सकती।"',
      text: 'Which leaves one obvious problem: a walled-in mother cannot go shopping.',
      ask: {
        q: 'Mother hornbill is sealed in the nest hollow for weeks. How does she eat?',
        options: ['She stores months of food beforehand', 'The father brings food to the slit, trip after trip, all season', 'She does not eat until the chicks fly'],
        answer: 1,
        right: 'The father. All day, every day — figs and fruit passed through the slit, hundreds of trips, until the chicks are ready. He feeds his whole walled-up family alone.',
        wrong: 'The father does it. All day, every day, he flies fruit to the nest and passes it through the slit — hundreds of trips, feeding his whole walled-up family until the chicks are ready to come out.'
      } },
    { art: ['guard'], who: null,
      hi: '"और यही तो एक खूबसूरत चक्र है: हॉर्नबिल जंगल के अंजीर खाकर जीते हैं, और जंगल हॉर्नबिलों के दम पर जीता है — जो बीज वे निगलकर इधर-उधर बिखेरते हैं, उन्हीं से अंजीर के नए पेड़ उगते हैं। एक द्वीप, एक पक्षी, एक जंगल, जो हज़ारों सालों से इसी तरह एक-दूसरे का साथ निभाते चले आ रहे हैं।"',
      text: 'And here is the beautiful circle: the hornbills live on the forest\'s figs, and the forest lives on the hornbills — the seeds they swallow and scatter grow into the next generation of fig trees. One island, one bird, one forest, each keeping the other going, round and round, for thousands of years.' },
    { art: ['guard'], who: 'guard',
      hi: '"जिस जीव के पास बस एक ही द्वीप हो, उसके पास कोई दूसरा सहारा नहीं होता। अगर नारकोंडम पर कुछ बहुत बुरा हो जाए — जैसे पेड़ कट जाएं, या बाहर से नए जानवर आ जाएं — तो इनकी गिनती आगे बढ़ाने के लिए दुनिया में कहीं और कोई दूसरा झुंड नहीं बचेगा। इसलिए इस द्वीप को एक अभयारण्य बनाकर सुरक्षित रखा गया है, यहाँ आने-जाने पर कड़ी रोक है, और वैज्ञानिक हॉर्नबिलों की गिनती बड़े ध्यान से करते हैं। हाल के सालों की गिनती एक अच्छी ख़बर लेकर आई है: एक द्वीप वाला यह पक्षी अब भी हिम्मत से टिका हुआ है।"',
      text: 'A creature with one island has no spare. If anything went badly wrong on Narcondam — the trees cut, new animals brought ashore — there would be no second population out there to carry on. So the island is protected as a sanctuary, visits are strictly limited, and scientists count the hornbills carefully. The counts in recent years have been good news: the bird with one island is holding on.' },
    { art: ['pt_crow'], who: null,
      hi: '"भारत में ऐसी अनमोल धरोहरें बिखरी पड़ी हैं — ऐसे जीव-जंतु जिनकी पूरी दुनिया बस एक पहाड़ी, एक झील या एक टापू तक ही सिमटी है। ये हमारे देश की सबसे नायाब चीज़ें हैं, किसी भी तिजोरी में रखे ख़ज़ाने से कहीं ज़्यादा कीमती, क्योंकि तिजोरी का ख़ज़ाना तो दोबारा भी आ सकता है।"',
      text: 'India is dotted with treasures like this — species whose entire world is one hill, one lake, one island. They are the country\'s rarest belongings, rarer than anything in any vault, because a vault\'s treasures can be replaced.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: '""सिर्फ़ यहीं पाया जाता है" कहने का एक और मतलब है "सिर्फ़ हमें सौंपा गया है।" नार्कोन्डम का हॉर्नबिल भारत को सौंपा गया है। दुनिया के तुम्हारे अपने कोने में जो भी सिर्फ़ वहीं पाया जाता है — पूछो, पता लगाओ — वह तुम्हें सौंपा गया है।"',
      text: '"Found only here" is another way of saying "trusted only to us." Narcondam\'s hornbill is trusted to India. Whatever is endemic to your corner of the world — ask, find out — is trusted to you.' }
  ],
  moral: 'A treasure that exists in only one place makes that place its keeper.',
  source: 'The Narcondam hornbill, endemic to Narcondam Island in the Andamans — a protected wildlife sanctuary with the species\' entire world population; hornbill nest-sealing and the father\'s provisioning are standard hornbill biology. Recent surveys report a stable population.'
},

{
  id: 'fk.island-of-tongues',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Bazaar of Many Tongues',
  hook: 'Stand in one market in the Andamans and close your eyes. You can hear half of India — and something far, far older.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AN'],
  words_hi: [['भाषा', 'bhasha', 'language'], ['बाज़ार', 'bazaar', 'market'], ['घर', 'ghar', 'home']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"पोर्ट ब्लेयर के सुबह के बाज़ार में जाओ — अंडमान का मुख्य शहर, जिसे हाल ही में \'श्री विजय पुरम\' का नया सरकारी नाम दिया गया है — और बस ध्यान से सुनो। मछली की दुकान पर बांग्ला। फूलों की दुकान पर तमिल। तेलुगु, मलयालम, हिंदी, दक्षिणी द्वीपों से आई निकोबारी, और सैलानियों के नक्शों पर बोली जाती अंग्रेज़ी। एक छोटा सा बाज़ार, और लगता है जैसे आधा भारत एक साथ बोल रहा हो।"',
      text: 'Go to the morning market in Port Blair — the main town of the Andamans, lately given the new official name Sri Vijaya Puram — and just listen. Bengali at the fish stall. Tamil at the flower stall. Telugu, Malayalam, Hindi, Nicobarese from the southern islands, English over the tourist maps. One small market, half of India talking at once.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"हर भाषा अपने साथ एक कहानी लेकर यहाँ पहुँची। पिछली डेढ़ सदी में बंगाल और तमिल इलाके से, केरल, आंध्र और राँची के पठार से लोग इन द्वीपों पर आकर बसे — किसान, मज़दूर, मछुआरे, क्लर्क — और हर परिवार ने अपने चूल्हे-बर्तनों के साथ-साथ अपनी भाषा भी बाँध ली थी। ये द्वीप मानो एक छोटा सा भारत बन गए, समंदर के नमकीन स्वाद में रंगा हुआ।"',
      text: 'Every language arrived with a story. Over the last century and a half, settlers came to these islands from Bengal and from Tamil country, from Kerala and Andhra and the Ranchi plateau — farmers, labourers, fisherfolk, clerks — and each family packed its language along with its cooking pots. The islands became a little India, sea-flavoured.' },
    { art: ['guard'], who: null,
      hi: '"उनका बचपन आपस में एक चोटी की तरह गूँथ गया। अंडमान के किसी बच्चे का आज नाम भले बांग्ला हो, उसका सबसे पक्का दोस्त तमिल हो सकता है, अध्यापिका मलयाली, और पसंदीदा गाना किसी तेलुगु फ़िल्म का — और स्कूल के फाटक से बस तक पहुँचते-पहुँचते वह बिना जाने ही तीन बार अपनी भाषा बदल लेती है।"',
      text: 'Their childhoods braided together. An Andaman child today might have a Bengali name, a Tamil best friend, a Malayali teacher, and a favourite Telugu film song — and switch languages three times between the school gate and the bus without noticing she has done it.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"लेकिन इन द्वीपों में ऐसी भाषाएँ भी बसी हैं जो इन सबसे कहीं ज़्यादा पुरानी हैं — इतनी पुरानी कि शायद ही कोई चीज़ उनके जितनी पुरानी हो। अंडमान के सबसे पहले बाशिंदे — ग्रेट अंडमानी, ओंगे, जारवा, सेंटिनली — यहाँ कई हज़ार सालों से रहते आए हैं, और उनकी भाषाएँ धरती के किसी भी अन्य भाषा-परिवार से मेल नहीं खातीं। निकोबार में भी, निकोबारी और शोम्पेन लोग इसी तरह अपनी बिल्कुल अनोखी भाषाएँ बोलते हैं।"',
      text: 'But the islands hold languages far older than any of these — older than almost anything. The first peoples of the Andamans — the Great Andamanese, the Onge, the Jarawa, the Sentinelese — have lived here for many thousands of years, and their languages belong to no other family of languages on Earth. In the Nicobars, the Nicobarese and the Shompen likewise speak languages all their own.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"उन पुरानी आवाज़ों में से कुछ अब बहुत धीमी पड़ चुकी हैं। ग्रेट अंडमानी लोगों की कभी कई भाषाएँ हुआ करती थीं, पर आज उन्हें बोलने वाले मुट्ठी भर ही रह गए हैं, और बुज़ुर्गों ने भाषा-वैज्ञानिकों के साथ मिलकर शब्दों, गीतों और नामों को लिख कर सहेजा है ताकि जो कुछ बचा है, उसका मान रखा जा सके। जब कोई बुज़ुर्ग बोलने वाला दुनिया से जाता है, तो मानो एक पूरी लाइब्रेरी ही बंद हो जाती है। इसीलिए यह काम इतना ज़रूरी है।"',
      text: 'Some of those ancient voices have grown very quiet. The languages of the Great Andamanese peoples, once many, now have only a handful of speakers, and elders have worked with linguists to write down words, songs and names so that what remains is kept with honour. When an old speaker dies, a whole library closes. That is why the work matters.',
      ask: {
        q: 'When a language falls silent, what exactly is lost?',
        options: ['Nothing — people just use another language', 'A whole way of seeing: its names for the winds and plants, its songs, its jokes, its memory', 'Only some old words'],
        answer: 1,
        right: 'A language is a way of seeing. Every one carries names, songs and knowledge that exist nowhere else — which is why elders and linguists work together to keep them.',
        wrong: 'Far more than words. A language carries its own names for the winds and plants, its own songs and jokes and memory — a whole way of seeing that exists nowhere else.'
      } },
    { art: ['guard'], who: null,
      hi: '"जारवा और सेंटिनेली लोग आज भी हर दिन अपनी भाषाएँ बोलते हैं, अपने जंगलों में और अपने द्वीप पर, जैसे वे हमेशा से बोलते आए हैं। बाहर का कोई भी इंसान उन भाषाओं को नहीं जानता — और ऐसा ही होना भी चाहिए। भारत उनकी ज़मीन और शांति से जीने के उनके फ़ैसले की हिफ़ाज़त करता है। यहाँ आदर का मतलब है दूरी बनाए रखना।"',
      text: 'The Jarawa and the Sentinelese still speak their languages every day, in their own forests and on their own island, as they always have. Nobody outside knows those languages — and that is as it should be. India protects their lands and their choice to be left in peace. Respect, here, means distance.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"पोर्ट ब्लेयर की एक अध्यापिका ने अपनी कक्षा को कुछ यूँ समझाया: \\"हमारे द्वीपों की बोली में कई परतें हैं। सबसे नई परतें जहाज़ों से आईं, और तुम उन्हें बाज़ार में सुन सकते हो। सबसे पुरानी परतें जहाज़ों के बनने से भी पहले से हैं, और वहाँ जाना हमारा काम नहीं है। दोनों ही तुमसे बस एक चीज़ चाहती हैं — परवाह।\\""',
      text: 'A schoolteacher in Port Blair puts it to her class like this: "Our islands speak in layers. The newest layers came by ship, and you can hear them in the bazaar. The oldest layers came before ships existed, and they are not ours to visit. Both deserve the same thing from you — care."' },
    { art: ['courtier'], who: null,
      hi: '"तो बाज़ार की चहल-पहल यूँ ही चलती रहती है: बंगाली, तमिल, हिंदी, तेलुगु, मलयालम, निकोबारी, सब एक ही चमकदार मछली का मोल-भाव करते हुए। और आखिरी सड़क के पार, घने जंगल में, द्वीपों की सबसे पुरानी भाषाएँ आज भी उन्हीं लोगों के बीच गूँज रही हैं जिनकी वे हैं।"',
      text: 'So the market hums on: Bengali, Tamil, Hindi, Telugu, Malayalam, Nicobarese, all bargaining over the same bright fish. And beyond the last road, in the deep forest, the oldest languages of the islands go on being spoken to the people they belong to.' },
    { art: ['guard'], who: 'mithu',
      hi: '"ज़रा अपने परिवार की भाषाएँ गिनकर देखो — वे जो बोली जाती हैं, और वे जो दादा-दादी या नाना-नानी जानते हैं पर तुम नहीं। यह साल ख़त्म होने से पहले उनमें से किसी एक के दस शब्द ज़रूर सीखो। कोई लाइब्रेरी इसी तरह खुली रहती है।"',
      text: 'Count the languages in your own family — the ones spoken, and the ones a grandparent knows that you do not. Ask for ten words of one before the year is out. That is how a library stays open.' }
  ],
  moral: 'Every language is somebody\'s home. Visit the ones you are invited into; guard the ones you are not.',
  source: 'The settler communities of the Andaman Islands (Bengali, Tamil, Telugu, Malayali, Hindi-speaking and Ranchi-region families among them) are well documented, as are the indigenous peoples — Great Andamanese, Onge, Jarawa, Sentinelese, Nicobarese and Shompen — whose languages are unrelated to any outside family; Great Andamanese language documentation with the community\'s elders is real and ongoing, and tribal lands are protected by law. Port Blair was officially renamed Sri Vijaya Puram in 2024. The teacher is the app\'s own telling.'
},

/* ========================================================== JHARKHAND ====== */
{
  id: 'fk.first-dance',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'How the First Evening Got Its Dance',
  hook: 'The world was made, the fields were planted, the day\'s work was done — and then everyone just stood there. Something was missing.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['नाच', 'naach', 'dance'], ['ढोल', 'dhol', 'drum'], ['शाम', 'shaam', 'evening']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"झारखंड के संथाली लोग अपने पूरे इतिहास को गाकर सुनाते हैं, दुनिया की बिल्कुल शुरुआत से — और यह उसी कहानी के शुरुआती दिनों का एक किस्सा है, पहले पुरखों के बाद का, जब उनके बच्चों और नाती-पोतों के पास गाँव थे, खेत थे, और वह सब कुछ था जो किसी बस्ती को चाहिए होता है। लगभग सब कुछ।"',
      text: 'The Santhals of Jharkhand sing their whole history, from the very beginning of the world — and this is one of the tellings from early in that story, after the first ancestors, when their children and grandchildren had villages, and fields, and everything a people needs. Almost everything.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'क्योंकि पुरानी कहानियाँ बताती हैं कि सबसे पहले बसे गाँवों में शामें कुछ अधूरी सी होती थीं। दिन तो पूरी तरह काम से भरा रहता था — ज़मीन साफ़ करना, बीज बोना, मवेशी चराना, घर बनाना। लेकिन जब सूरज ढल जाता और काम रुक जाता, तो लोग बस यूँ ही बैठे रहते। आग चटकती रहती। कोई जम्हाई लेता। शाम में मानो एक खालीपन था, ठीक उस चीज़ की शक्ल का जिसे अभी किसी ने बनाया ही नहीं था।',
      text: 'Because in the first villages, the tellings say, the evenings were wrong. The day was full — clearing, sowing, herding, building. But when the sun went down and the work stopped, people just sat. The fire crackled. Somebody yawned. There was a hole in the evening exactly the shape of something nobody had invented yet.' },
    { art: ['guard'], who: null,
      hi: 'पहला टुकड़ा अचानक ही हाथ लग गया। धान कूटती एक औरत के मूसल से एक ताल बन रही थी — धुम, धुम, धुम — और छत की मरम्मत कर रहे एक आदमी के हाथ भी उसी ताल पर थिरकने लगे। मूसल की आवाज़ का जवाब देने के लिए किसी ने एक खोखले तने पर चमड़ा मढ़ दिया, और बस, अचानक ढोल बन गया।',
      text: 'The first piece arrived by accident. A woman husking rice kept a rhythm with her pestle — thum, thum, thum — and a man mending a roof found his hands tapping along. Somebody stretched a skin over a hollow log to answer the pestle back, and there, suddenly, was the drum.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'और जैसा कि सबको तुरंत पता चल गया, ढोल की थाप पर कोई भी शांत नहीं बैठ सकता। यह कानों से भीतर उतरती है और पैरों से बाहर फूट पड़ती है। बच्चे सबसे पहले उठ खड़े हुए — बच्चे तो हमेशा ही ऐसे होते हैं — आग की रोशनी में कूदते-फांदते हुए, बिना यह जाने कि वे क्या कर रहे हैं और रुकने का तो उनका कोई इरादा ही नहीं था।',
      text: 'And a drum, as everyone instantly discovered, does not let you sit still. It goes in at the ears and comes out at the feet. The children were up first — children always are — hopping in the firelight with no idea what they were doing and no interest in stopping.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'फिर वह सवाल उठा जिसने इसे संथाली पहचान दी। बीच में अकेला नाचता हुआ एक नर्तक बड़ा प्यारा लग रहा था, पर थोड़ा अकेला भी। हर कोई उसमें शामिल होना चाहता था — लेकिन इतने सारे लोग आपस में टकराए बिना एक साथ कैसे नाचें?',
      text: 'Then came the question that made it Santhal. One dancer alone in the middle looked wonderful and a little lonely. Everyone wanted to join — but how do many people dance together without becoming a herd of collisions?',
      ask: {
        q: 'A whole village wants to dance at once. What shape lets everyone in?',
        options: ['A line, hands linked, moving together', 'Everyone alone, scattered about', 'Only the best dancers, with the rest watching'],
        answer: 0,
        right: 'The line. Hands linked, feet together, swaying as one — and there is no end to a line: anyone who comes can simply join it.',
        wrong: 'They found the line: hands linked, feet moving together, the whole row swaying as one. And a line has no end — anyone who comes can simply join it.'
      } },
    { art: ['courtier'], who: null,
      hi: 'यही वह नाच है जिसे आप आज भी देख सकते हैं: नर्तकों की एक लंबी कतार, एक-दूसरे की बाँहों में बाँहें डाले, एक साथ क़दम बढ़ाते और झूमते हुए, जबकि नीचे ढोल अपनी बातें करते रहते हैं — बड़ा तमक और लंबा तुमदाक\', वे दो ढोल जिनके नाम हर संथाल बच्चा जानता है। यह कतार नाच के मैदान में एक धीमी, खुशहाल नदी की तरह बलखाती चलती है।',
      text: 'That is the dance you can still see: the long line of dancers, arms linked, stepping and swaying together while the drums talk underneath — the big tamak and the long tumdak\', the two drums whose names every Santhal child knows. The line curls around the dancing ground like a slow, happy river.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'इस ताल में ढलने के लिए नए गीत भी बनते गए — बुआई और फ़सल कटाई के गीत, शादियों के गीत, वसंत में बाहा और फ़सल के बाद सोहराय के त्योहारों के गीत। अलग-अलग दिनों के लिए अलग-अलग नाच, हर एक के अपने क़दम और अपने गीत, मानो पूरा साल ही नाचना सीख गया हो।',
      text: 'The songs grew to fit it — songs for planting and harvest, for weddings, for the festivals of Baha in the spring and Sohrai after the harvest. Different dances for different days, each with its own step and its own songs, so the year itself learned to dance.' },
    { art: ['courtier'], who: null,
      hi: 'और शाम का खालीपन भर गया। बुज़ुर्ग कहते हैं, दिन भर पड़ोसियों के साथ मिलकर अपने हाथों से काम करो, और फिर शाम को उन्हीं हाथों में हाथ डालकर कदम से कदम मिलाओ — और जो गाँव एक कतार में नाचता है, वह मुश्किल दिनों में भी एक होकर खिंचता है।',
      text: 'And the hole in the evening was filled. Work all day with your hands beside your neighbours, the elders say, and then in the evening, link those same hands and step together — and a village that dances in one line will pull in one line too, when the hard days come.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'त्योहार की रातों में पूरे झारखंड में आज भी शाम ढलते ही नगाड़े बज उठते हैं, कतार बन जाती है, और उसमें हमेशा जगह रहती है। इस सबसे पुराने नाच का यही सबसे पुराना नियम है: जो भी जुड़ना चाहे, उसे कतार के छोर से कभी लौटाया नहीं जाता।',
      text: 'On festival nights across Jharkhand the drums still start at dusk, and the line still forms, and it still has room. That is the oldest rule of the oldest dance: nobody who wants to join is ever turned away from the end of the line.' }
  ],
  moral: 'A line of linked hands has no collisions and no end. Villages that dance together hold together.',
  source: 'Santhal oral tradition of Jharkhand and the country round about, where the people\'s history is sung from the creation onward and communal line-dances with the tamak and tumdak\' drums mark Baha, Sohrai, weddings and festivals. The dances and drums are real and current; tellings of how they began vary, and this is one gentle telling of it.'
},

{
  id: 'fk.singbonga-furnaces',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'Sing Bonga and the Smoke That Hid the Sky',
  hook: 'The iron furnaces burned day and night, and the smoke rose and rose, until even the sun had to do something about it.',
  hero: 'courtier',
  cast: ['courtier', 'pt_crow'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['सूरज', 'sooraj', 'sun'], ['लोहा', 'loha', 'iron'], ['चिड़िया', 'chidiya', 'bird']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'झारखंड के मुंडा लोग और उनके पड़ोसी असुर — जो सदियों तक लोहा गलाने में उस्ताद थे, सचमुच के माहिर, जिनकी पुरानी भट्ठियों के टीले आज भी उस पठार पर बिखरे पड़े हैं — सृष्टि की बिल्कुल शुरुआत की एक कहानी सुनाते हैं, जो लोहे, धुएँ और खुद सूरज की है।',
      text: 'The Munda people of Jharkhand, and their neighbours the Asur — who were master iron-smelters for centuries, real ones, whose old furnace mounds still dot the plateau — tell a story from the deep beginning of things, about iron, smoke, and the sun himself.' },
    { art: ['courtier'], who: null,
      hi: 'उस कहानी में पहले-पहल लोहा गलाने वालों को एक बड़ा भेद पता चला: कि एक खास लाल मिट्टी को चूल्हे की आग से कहीं तेज़ भट्ठी में तपाने पर, उसमें से चमकता हुआ लोहा बह निकलता है। कुल्हाड़ियाँ! हल के फाल! तीरों की नोकें! यह अब तक का सबसे काम का जादू था, और उन्हें इस पर सही मायनों में गर्व था।',
      text: 'In that story the first smelters learned a mighty secret: that certain red earth, cooked in a furnace hotter than any cooking fire, weeps out shining iron. Axes! Ploughshares! Arrowheads! It was the most useful magic anyone had ever found, and they were rightly proud of it.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'लेकिन घमंड आग को और हवा देता रहा। एक भट्ठी से कई भट्ठियाँ बन गईं; धौंकनियां दिन-रात साँसें भरती रहीं; और धुएँ के सलेटी खंभे उठकर पूरी दुनिया पर झुक आए, यहाँ तक कि दिन धुंधले पड़ गए, रातों में तारे न रहे, और हर हरी-भरी चीज़ खाँसने लगी।',
      text: 'But pride kept feeding the fires. One furnace became many; the bellows sighed day and night; and the smoke went up in grey pillars that leaned together over the world, until the days grew dim and the nights had no stars, and everything green began to cough.' },
    { art: ['pt_crow', 'courtier'], who: null,
      hi: 'इन सबसे ऊँचे आसमान में सिंग बोंगा थे — वे महान देवता जिन्हें मुंडा कहानियों में सूरज के रूप में पूजा जाता है, जो सब कुछ देखते हैं। उन्होंने धुएँ के पार अपनी धुंधली और मैली दुनिया को नीचे देखा, और तय किया कि कुछ भी करने से पहले, लोहा गलाने वालों से ठीक तरह से कहा जाए कि वे अपनी आग को धीमा कर लें। सो उन्होंने संदेशवाहक भेजे: परिंदों को।',
      text: 'High above it all was Sing Bonga — the great spirit whom the Munda tellings honour as the sun, the one who sees everything. He looked down through the smoke at his dimmed and dirty world, and decided that before anything else, the smelters should be asked, properly, to ease their fires. So he sent messengers: the birds.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      hi: 'एक-एक करके पंछी संदेश लेकर भट्टियों की ओर उड़े — और जब लौटे, तो बदले हुए थे। पुरानी कहानियाँ कहती हैं कि राजा कौआ कोयले जैसा काला झुलसकर लौटा, और बाकी पंछी धुएँ और अंगारों के निशान लेकर लौटे — और इसी वजह से आज तक वे पंछी वही रंग पहने हुए हैं।',
      text: 'One after another the birds flew down to the furnaces to carry the message — and came back changed. The tellings say the king crow came back scorched black as charcoal, and others came back marked by smoke and cinders — and that is why those birds wear those colours to this day.',
      ask: {
        q: 'The bird-messengers came back singed, and the message was not heard. What should Sing Bonga do next?',
        options: ['Give up — some people never listen', 'Punish first and explain afterwards', 'Go down himself, humbly, and see the furnaces up close'],
        answer: 2,
        right: 'That is what the tellings say he did — he came down to the furnaces in the shape of an ordinary boy, so he could understand before he judged.',
        wrong: 'He did neither. The tellings say he came down himself, in the shape of an ordinary boy, to stand at the furnaces and understand before he judged.'
      } },
    { art: ['courtier'], who: null,
      hi: 'इसलिए सूरज एक सीधे-सादे, धूल से सने बालक का रूप धरकर भट्टियों तक पहुँचे, वहाँ धौंकनी चलाई, और सबकी बातें सुनीं। उन्होंने लोहा गलाने वालों की होशियारी देखी और उसका सम्मान किया। उन्होंने उन लपटों को भी देखा जो कभी नहीं थमती थीं, और उस आसमान को भी जिसे वे निगलती जा रही थीं।',
      text: 'So the sun walked to the furnaces as a plain, dusty boy, and worked the bellows, and listened. He saw the cleverness of the smelters and honoured it. He also saw the fires that never once rested, and the sky they were eating.' },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: 'फिर उन्होंने अपना असली रूप दिखाया — और इस सौम्य कहानी में, उनका वो तेज ही अपनी बात मनवाने के लिए काफ़ी था। "तुम्हारा लोहा अच्छा है," उन्होंने कहा। "पर तुम्हारा यूँ कभी न रुकना ठीक नहीं। मैं भी तो हर एक शाम ढलता हूँ। आग ज़रूर जले — पर उसे विश्राम भी मिलना चाहिए, वरना यह आसमान मेरी रोशनी की जगह तुम्हारे धुएँ का होकर रह जाएगा।" और फिर भट्टियों ने रात को सोना सीख लिया, और आसमान में तारे लौट आए।',
      text: 'Then he revealed himself — and in this gentle telling, the blaze of him was argument enough. "Your iron is good," he said. "Your never-stopping is not. Even I set, every single evening. The fires may burn — but they must also rest, or the sky belongs to your smoke instead of my light." And the furnaces learned to sleep at night, and the stars came back.' },
    { art: ['pt_crow'], who: null,
      hi: 'इस कहानी के पुराने रूपों में लोहा गलाने वालों का अंजाम कहीं ज़्यादा कठोर होता है — नीचे दिया गया संदर्भ यह साफ़-साफ़ बताता है — पर हर कहानी का ढाँचा वही रहता है: वह धुआँ, वे झुलसे हुए पंछी जो आज भी अपने निशान लिए फिरते हैं, और खुद सूरज, जो कोई भी कदम उठाने से पहले खुद नीचे उतरकर आए।',
      text: 'The old tellings of this story end far more harshly for the smelters — the source below says so honestly — but every version keeps the same bones: the smoke, the singed birds who still wear their marks, and the sun who came down himself before he acted.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'असुर समुदाय के लोग आज भी झारखंड में रहते हैं, और पुरातत्ववेत्ता आज भी उनके पूर्वजों के लोहे का अध्ययन करते हैं — यह दुनिया में लोहा गलाने के सबसे पुराने इलाकों में से एक है। आसमान को धुएँ से भर देने की इतनी पुरानी कहानी, आज हम सभी से भी बहुत कुछ कहती है।',
      text: 'The Asur people still live in Jharkhand today, and archaeologists still study their ancestors\' iron — some of the oldest smelting country anywhere. A story this old, about smoke over-filling a sky, has rather a lot to say to the rest of us just now.' }
  ],
  moral: 'Make your fine things — but let the fires rest. Even the sun sets every evening.',
  source: 'The Sing Bonga and Asur cycle of Munda and Asur oral tradition in the Chotanagpur region, in which Sing Bonga sends bird messengers (returned singed, which is why they wear their colours) and descends himself to the smelters. Older recorded tellings end far more harshly for the Asur than this gentle version; the Asur are a living community, and their historic iron-smelting is well attested.'
},

{
  id: 'fk.sal-grove-promise',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Grove the Axes Never Touch',
  hook: 'When the first fields were cleared, the trees fell one by one. Except in one place — and there is a reason the axes stop there.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['पेड़', 'ped', 'tree'], ['वादा', 'vaada', 'promise'], ['छाया', 'chhaya', 'shade']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'झारखंड से होकर गुज़रिए तो आपको यह बार-बार दिखाई देगा: खुले खेत, मकान, सड़कें — और फिर किसी गाँव के पास, लंबे और पुराने पेड़ों का एक अछूता सा टुकड़ा, गहरा हरा और शांत, मानो इस पुरानी दुनिया का ही कोई हिस्सा हो। यही है वह पवित्र उपवन — जिसे उरांव और मुंडा लोग सरना कहते हैं, और संथाल लोग जाहेर कहते हैं।',
      text: 'Drive through Jharkhand and you will see it again and again: open fields, houses, roads — and then, beside a village, a patch of tall old forest standing untouched, dark green and quiet, like a piece of the original world. That is the sacred grove — the sarna, as the Oraon and Munda say; the jaher, as the Santhals say.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'ये कहानियाँ उस दौर की हैं जब पहले-पहल खेत बने थे। खेती करने के लिए ज़मीन साफ़ करनी ही होती है; तो शुरुआती परिवारों ने पेड़ काटे, जलाए और हल चलाए। एक-एक पेड़ करके जंगल पीछे हटता गया, और जहाँ कभी जंगल खड़ा था, वहाँ गाँव बसते चले गए।',
      text: 'The tellings go back to when the first fields were made. To farm, you must clear; the first families cut and burned and ploughed, and the forest gave ground, tree by tree, and the villages rose where it had stood.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: 'लेकिन हर नए गाँव के किनारे, बड़ों ने कुल्हाड़ियों को रोक दिया। साल के बड़े-बड़े तनों पर हाथ रखते हुए उन्होंने कहा, "पेड़ों के इस हिस्से को नहीं। इसे हम पूरा का पूरा बचाकर रखेंगे। जंगल ने हमें सब कुछ दिया है — हमारे खेत उसी का शरीर थे। जो इंसान सब कुछ ले लेता है और कुछ भी नहीं बचाता, वह भूल जाता है कि उसे पाला-पोसा किसने था।"',
      text: 'But at the edge of each new village, the elders stopped the axes. "Not this stand," they said, resting a hand on the great sal trunks. "This one we keep whole. The forest has given us everything — our fields were its body. A person who takes everything and keeps nothing back has forgotten who fed them."',
      ask: {
        q: 'The village needs wood and land, and here stands one more grove of tall sal. Why keep it uncut?',
        options: ['The wood was poor quality', 'As a promise — a kept piece of the forest, where its spirits and the village meet with honour', 'They ran out of axes'],
        answer: 1,
        right: 'A promise, and a meeting place. The grove is where the village honours the spirits of the land that carries it — the first and oldest thank-you, still standing.',
        wrong: 'Nothing so small. The grove is a kept promise — the piece of forest never taken, where the village honours the spirits of the land that carries it. The oldest thank-you there is, still standing.'
      } },
    { art: ['courtier'], who: null,
      hi: 'तो इस तरह ये कुंज आज भी खड़े हैं। साल के पेड़ों के नीचे गाँव अपने सबसे ख़ास दिन मनाता है — बसंत के सरहुल और बाहा त्योहार ढोल-नगाड़ों और फूलों के साथ सबसे पहले इसी कुंज में आते हैं, और गाँव के पुजारी, पाहन, वहाँ पूरे समाज की तरफ़ से प्रार्थना करते हैं। यह कुंज कोई सिर्फ़ देखने का नज़ारा नहीं है। यह एक ठिकाना है: जहाँ गाँव और यह जीती-जागती धरती आपस में बात करते हैं।',
      text: 'So the groves stand. Under the sal trees the village holds its most important days — the Sarhul and Baha festivals of spring come to the grove first, with drums and flowers, and the village priest, the pahan, speaks there for the whole community. The grove is not scenery. It is an address: it is where the village and the living land talk.' },
    { art: ['courtier'], who: null,
      hi: 'यही सरना परंपरा का दिल है — झारखंड के कई आदिवासी समुदायों की आस्था, जो एक महान शक्ति और कुंज, पहाड़ व नदी-नालों की शक्तियों का आदर करते हैं, और जो आपसे सीधे-सीधे कहेंगे: हमारे मंदिर की छत पत्तों की है। यह एक जीती-जागती आस्था है, जिसे आज लाखों लोग मानते हैं, और ये कुंज उनके पवित्र तीर्थ हैं।',
      text: 'This is the heart of the Sarna way — the faith of many Adivasi communities of Jharkhand, who honour a single great spirit and the spirits of grove, hill and stream, and who will tell you plainly: our temple has a roof of leaves. It is a living faith, held today by millions, and the groves are its holy places.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'और वह वादा दोगुना समझदारी भरा साबित हुआ। इन पवित्र कुंजों का अध्ययन करने वाले वैज्ञानिक बार-बार यही पाते हैं: जब आसपास हर जगह से सब कुछ ख़त्म हो गया, तब भी पुराने पेड़, दवाइयों के पौधे, चिड़ियाँ, मधुमक्खियाँ और ठंडे झरने इन्हीं कुंजों में बचे रहे। निभाए गए वादे ने बीजों को बचाए रखा। वह धन्यवाद असल में बीजों का एक खज़ाना बन गया।',
      text: 'And the promise turned out to be wise twice over. Scientists who study the sacred groves keep finding the same thing: the old trees, the medicine plants, the birds and bees and cool springs survive in the groves when they have vanished everywhere around. The kept promise kept the seeds. The thank-you turned out to be a seed-bank.' },
    { art: ['courtier'], who: null,
      hi: 'बुज़ुर्ग कहते हैं कि साल का पेड़ साल भर देता है — पत्तलों के लिए पत्ते, दीयों और पूजा की धूनी के लिए राल, बसंत में फूल, और मई की तपती धूप में छाँव। वह बस वही माँगता है जो हर जीव माँगता है: मेरा आख़िरी हिस्सा भी मत छीन लेना।',
      text: 'A sal tree, the elders say, gives all year — leaves for plates, resin for lamps and blessing-smoke, flowers in spring, shade in the terrible May sun. All it asks is what everything asks: do not take the last of me.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"शायद आपके आस-पास भी कोई ऐसा पेड़ हो जिसे किसी ने न काटने का फैसला किया था — अपने परिवार से पूछिए कि क्या वे ऐसे किसी पेड़ को जानते हैं, और यह फैसला किसने लिया था, और क्यों। ऐसा हर पेड़ एक छोटा \'सरना\' होता है: पत्तों से बना एक वादा।"',
      text: 'Somewhere near you there is probably a tree that someone decided must not be cut — ask your family if they know one, and who decided, and why. Every such tree is a small sarna: a promise with leaves.' }
  ],
  moral: 'Take what you need and keep a grove whole. The thank-you you leave standing feeds your grandchildren.',
  source: 'The sacred groves (sarna / jaher) of the Adivasi communities of Jharkhand — Oraon, Munda, Santhal, Ho and others — are real, current and central to the Sarna faith, with Sarhul and Baha kept in them each spring; their documented role as refuges of biodiversity is also real. The framing tale of the first promise is a Bizzing India telling in that idiom, said so plainly — ask an Adivasi family how they tell it.'
},

{
  id: 'fk.karam-brothers',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Branch the Brothers Brought Home',
  hook: 'Two brothers had good luck and did not know where it came from. Then they found out — the hard way, and then the walking way.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['भाई', 'bhai', 'brother'], ['डाली', 'daali', 'branch'], ['त्योहार', 'tyohaar', 'festival']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"हर साल, जब बारिश धान की फसल को पका रही होती है, झारखंड के गांवों में करम का त्योहार मनाया जाता है। गीतों और ढोल-नगाड़ों के साथ करम के पेड़ की एक डाली घर लाई जाती है, उसे पूरे आदर के साथ आंगन में रोपा जाता है, और रात भर उसके चारों ओर नाच-गाना होता है। यह त्योहार वही कहानी कहता है — कर्मा और धर्मा नाम के दो भाइयों की कहानी।"',
      text: 'Every year, when the rains are ripening the rice, the villages of Jharkhand keep the festival of Karam. A branch of the karam tree is carried home with songs and drums, planted with honour in the courtyard, and danced around all night. This is the story the festival tells — the story of Karma and Dharma, the two brothers.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"कर्मा और धर्मा किसान थे, और उनकी किस्मत के चर्चे दूर-दूर तक थे। उनके धान के पौधे सबसे लंबे होते, उनके मवेशी चमकते रहते, और उनके अनाज के भंडार के लिए एक बड़े दरवाजे की ज़रूरत पड़ गई थी। और हर साल, फसल पकने के समय, उनका परिवार अपनी माँ के सिखाए तरीके से रात भर गीतों के साथ करम की डाली का आदर करता था — यही उनकी किस्मत की जड़ थी, हालांकि दोनों भाई इसे लगभग भूल ही चुके थे।"',
      text: 'Karma and Dharma were farmers, and their luck was famous. Their rice stood taller, their cattle shone, their granary needed a bigger door. And every year, at the ripening time, their household honoured the karam branch with songs, all night, the way their mother had taught them — that was the root of the luck, though the brothers had half forgotten it.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: '"फिर एक ऐसा साल आया जब बहुत काम था। व्यापार खूब चला, भाई अमीर हो गए और भाग-दौड़ में लगे रहे, और जब त्योहार का समय आया, तो उनके पास फुर्सत ही नहीं थी। दूसरे आंगनों में ढोल बजते रहे। उनके आंगन में सन्नाटा था — और कुछ कहानियों में तो यह भी कहा जाता है कि वे उस पवित्र डाली को सिर्फ भूले ही नहीं, बल्कि हड़बड़ी में उसे ठोकर मारकर एक तरफ कर दिया, जो कि और भी बुरा था।"',
      text: 'Then came a busy year. Trade was good, the brothers were rich and rushing, and when the festival came round, they had no time. The drums played in other courtyards. In theirs, nothing — and in some tellings the sacred branch was not just forgotten but knocked aside in the hurry, which is worse.' },
    { art: ['guard'], who: null,
      hi: '"और किस्मत उनका साथ छोड़कर चली गई। चुपचाप, पूरी तरह से, ठीक वैसे ही जैसे कोई मेहमान उस घर से चला जाता है जहाँ कोई उसका स्वागत नहीं करता। धान में बीमारी लग गई, मवेशी भटक गए, अनाज का भंडार खाली हो गया, और साल भर के अंदर ही वे मशहूर भाई गरीब होकर एक खाली मेज़ के आमने-सामने बैठकर एक-दूसरे को ताकने लगे।"',
      text: 'And the luck left. Quietly, completely, the way a guest leaves a house where no one greets her. The rice sickened, the cattle strayed, the granary emptied, and within the year the famous brothers were poor men staring at each other across a bare table.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"उन्होंने एक बुज़ुर्ग से पूछा कि उनसे क्या नियम टूटा है। \\"आप जानते हैं कि आपने क्या तोड़ा है,\\" उन्होंने कहा। \\"सवाल यह है कि अब आप इसके बारे में क्या करेंगे?\\""',
      text: 'They asked an elder what they had broken. "You know what you have broken," she said. "The question is what you will do about it."',
      ask: {
        q: 'The brothers neglected the karam and lost everything. What must they do now?',
        options: ['Wait for the luck to wander back on its own', 'Go and find Karam Rani — walk, search, and bring the branch home with full honour', 'Buy a new branch quickly from the market'],
        answer: 1,
        right: 'The walking way. Honour that was thrown aside cannot be bought back cheap — it has to be gone after, on foot, and carried home properly.',
        wrong: 'There is no quick version. Honour thrown aside cannot be bought back cheap. They had to go after it on foot — and they did.'
      } },
    { art: ['courtier'], who: null,
      hi: 'तो दोनों भाई चल पड़े। पुरानी कहानियाँ बताती हैं कि वे बहुत दूर तक गए — नदियाँ पार कीं, जंगलों से गुज़रे, और जो कोई भी मिला उससे पूछते रहे कि करम देवता कहाँ मिलेंगे। और इस तलाश ने ही उन्हें बदलना शुरू कर दिया: जिन दो लोगों के पास किसी चीज़ के लिए फ़ुर्सत नहीं थी, अब उनके पास हर बात के लिए समय था। रास्ते में जो भी मिला, उन्होंने उसकी मदद की, क्योंकि आख़िरकार वे समझ चुके थे कि मदद की ज़रूरत होना कैसा लगता है।',
      text: 'So the brothers walked. The tellings send them far — across rivers, through forests, asking everyone they met where the spirit of the karam might be found. And the search itself began to change them: two men who had had no time for anything now had time for everything, and helped whoever they met on the road, because they finally knew how it felt to need help.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'आख़िरकार, पानी के किनारे उन्हें करम का पेड़ मिल ही गया — और उन्होंने सच्चे मन से उससे माफ़ी माँगी, ठीक वैसे ही जैसे सचमुच पछतावा होने पर माँगी जाती है। फिर पूरे आदर के साथ उन्होंने एक डाली काटी और उसे ऊँचा उठाए घर की ओर चल पड़े। रास्ते भर वे वही गीत गाते रहे जो उनकी माँ ने उन्हें सिखाए थे, एक-एक बोल, पूरे रास्ते।',
      text: 'At last, by the water, they found the karam — and they asked its forgiveness, plainly, the way you ask when you mean it. And they cut one branch with honour, and carried it home high, singing the songs their mother had taught them, every verse, the whole way back.' },
    { art: ['guard'], who: null,
      hi: 'उन्होंने वह डाली अपने आँगन में रोप दी, और घर के सभी लोग रात भर उसके चारों ओर नाचे — और क़िस्मत भी उसी तरह घर लौट आई जैसे वह डाली आई थी: सिर-आँखों पर उठाकर, पूरे आदर के साथ, गीतों की धुन पर। खेत फिर से हरे-भरे हो गए। भाई फिर कभी यह बात नहीं भूले। जो भी एक डाली के लिए इतनी दूर चलकर गया हो, वह कभी भूलता नहीं।',
      text: 'They planted the branch in their courtyard, and the household danced around it all night — and the luck came home the way the branch had: carried, honoured, sung to. The fields recovered. The brothers did not forget again. Nobody who has walked that far for a branch forgets again.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आज भी करम के दिनों में लड़कियाँ छोटे-छोटे बरतनों में हल्के सुनहरे रंग के अंकुर उगाती हैं — जिन्हें जावा कहा जाता है — त्योहार से कई दिन पहले तक चुपके से उनकी देखभाल की जाती है। और उरांव, मुंडा, संथाल, हो और कई दूसरे परिवारों में डाली रोपी जाती है और भोर होने तक उसके सामने गीत गाए जाते हैं। अगर आप कभी बरसात के मौसम में झारखंड जाएँ, तो बस ढोल-नगाड़ों की थाप के पीछे-पीछे चले जाइए।',
      text: 'At Karam time today, the girls grow little cups of pale-gold seedlings — jawa, they are called — tended secretly for days before the festival, and the branch is planted and sung to till dawn, in Oraon, Munda, Santhal, Ho and many other households. If you are ever in Jharkhand in the rainy season, follow the drums.' }
  ],
  moral: 'Luck is a guest. It stays where it is greeted — and once neglected, it must be fetched back on foot.',
  source: 'The Karam festival of Jharkhand and neighbouring regions, kept by Oraon, Munda, Santhal, Ho, Kharia and other communities, and its tale of the brothers Karma and Dharma who neglected the karam and journeyed to bring the branch home. Many versions, differing in detail; the jawa seedlings and all-night songs are real and current.'
},

{
  id: 'fk.bamboo-bonga',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Elephant and the Keeper of the Bamboo',
  hook: 'The bamboo grove fed him every winter. One winter he decided to eat all of it at once — and something in the grove cleared its throat.',
  hero: 'pt_elephant',
  cast: ['pt_elephant', 'courtier'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['हाथी', 'haathi', 'elephant'], ['बाँस', 'baans', 'bamboo'], ['कल', 'kal', 'tomorrow']],
  scenes: [
    { art: ['pt_elephant'], who: null,
      hi: 'संथालों की भाषा में कहें, तो यह जीती-जागती दुनिया बोंगाओं से भरी है — यानी हर जगह की अपनी आत्मा: पहाड़ का बोंगा, झरने का बोंगा, चौराहे वाले पुराने पेड़ का बोंगा। जिस जगह पर बोंगा होता है, वह सिर्फ़ कोई बेजान चीज़ नहीं होती, बल्कि कोई जीता-जागता स्वरूप होती है। और यहीं से बात आती है उस हाथी की, और गाँव के ऊपर वाले बाँस के झुरमुट की।',
      text: 'In the Santhal way of speaking, the living world is full of bongas — the spirits of places: a spirit of the hill, of the stream, of the old tree at the crossing. A place with a bonga is a place that is somebody, not just something. Which brings us to the elephant, and the bamboo grove above the village.' },
    { art: ['pt_elephant'], who: null,
      hi: 'हर सर्दी में, जब जंगल में खाने की कमी हो जाती, तो वह हाथी पहाड़ी चढ़कर बाँस के बड़े झुरमुट के पास आता और भरपेट खाता। उस झुरमुट में हमेशा काफ़ी कुछ होता था: किनारों पर हरे-हरे बाँस और नरम ज़मीन में मीठी-मीठी कोपलें। वह खाता, हवा में ही कहीं हल्की घुरघुराहट के साथ धन्यवाद करता, और आराम से टहलता हुआ चला जाता। उसकी पूरी ज़िंदगी बस ऐसे ही चलती आई थी।',
      text: 'Every winter, when the forest grew lean, the elephant came up the hill to the great bamboo grove and ate. The grove always had enough: green canes at the edges, sweet shoots in the softer ground. He ate, rumbled his thanks in the general direction of nothing, and ambled off. It had worked this way his whole life.' },
    { art: ['pt_elephant'], who: null, mood: 'think',
      hi: 'लेकिन यह सर्दी बाकी सर्दियों से ज़्यादा भूख भरी थी, और बाँस के उस झुरमुट के बीच खड़े हाथी के मन में एक बड़ा सा विचार आया: सिर्फ़ किनारों से थोड़ा-थोड़ा क्यों चबाना? वह तो एक ही दोपहर में पूरे जंगल को गिरा सकता था और हफ़्ते भर दावत उड़ा सकता था — बाँस के भीतरी नरम हिस्से, नई कोपलें, सब कुछ, एक साथ।',
      text: 'But this winter was hungrier than most, and standing in the middle of all that bamboo, the elephant had a big grey thought: why nibble at the edges? He could push the whole grove flat in an afternoon and feast for a week — the hearts of the clumps, the young shoots, everything, all at once.',
      ask: {
        q: 'A whole grove, one hungry elephant, one afternoon. What is wrong with eating everything at once?',
        options: ['Nothing — food is for eating', 'Eat the heart of the grove today and there is no grove next winter, or ever', 'He might get a stomach-ache'],
        answer: 1,
        right: 'That is the whole arithmetic. The edges regrow; the heart does not. Eat it all once and you have eaten every winter to come.',
        wrong: 'Bigger than a stomach-ache. The edges of a bamboo clump regrow, but the heart does not. Eat it all once, and you have eaten every winter to come as well.'
      } },
    { art: ['pt_elephant', 'courtier'], who: null,
      hi: 'उसने पहले बड़े झुरमुट पर अपनी सूँड लपेटी ही थी कि जंगल बोल पड़ा। ज़ोर से नहीं। बोंगाओं को कभी-कभार ही ज़ोर से बोलने की ज़रूरत पड़ती है। वह बाँसों के बीच से बहती हवा जैसी आवाज़ थी, जो हर तरफ़ से आ रही थी और कहीं से भी नहीं: "सर्दियों के मेहमान। खींचने से पहले — एक सवाल।"',
      text: 'He had wrapped his trunk around the first great clump when the grove spoke. Not loudly. Bongas rarely need to be loud. It was a voice like wind through canes, coming from everywhere and nowhere: "Winter guest. Before you pull — a question."' },
    { art: ['courtier'], who: 'courtier',
      hi: '"तुमने अपनी ज़िंदगी की हर सर्दी यहीं खाया है," जंगल के रखवाले ने कहा। "पिछली सर्दी तुम्हें किसने खिलाया?" "इसी जंगल ने," हाथी ने कहा। "और उससे पिछली सर्दी?" "इसी जंगल ने।" "और अगली सर्दी तुम्हें कौन खिलाएगा?" हाथी का मुँह खुला का खुला रह गया, और वह सूँड हवा में उठाए, वहीं खड़ा हिसाब लगाने लगा।',
      text: '"You have eaten here every winter of your life," said the keeper of the grove. "Who fed you last winter?" "This grove," said the elephant. "And the winter before?" "This grove." "And who will feed you NEXT winter?" The elephant opened his mouth, and stood there, trunk in the air, doing the arithmetic.' },
    { art: ['pt_elephant'], who: 'pt_elephant', mood: 'sad',
      hi: '"...यही जंगल," उसने आख़िरकार बहुत धीमे से कहा। "अगर यह बचा रहा तो।" उसने बाँस के झुरमुट को छोड़ दिया। वह झूलकर वापस सीधा खड़ा हो गया, और पूरा जंगल सरसरा उठा — राहत से, या हँसी से; बाँसों में यह फ़र्क समझना मुश्किल होता है।',
      text: '"...This grove," he said at last, very quietly. "If there is one." He let go of the clump. It swayed back upright, and the whole grove rustled — with relief, or laughter; with bamboo it is hard to tell the difference.' },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: '"तो फिर सुनो मेहमान, इस जंगल का नियम," बोंगा ने कहा। "किनारों से खाओ, जहाँ मैं फिर से उगता हूँ। भीतरी हिस्से छोड़ दो, जहाँ मैं रहता हूँ। पेट भर खाओ और मुझे खड़ा रहने दो — और मैं तुम्हें, तुम्हारे बच्चों को, और उनके बच्चों को हर सर्दी खिलाऊँगा, जब तक कि हाथी यहाँ का रास्ता न भूल जाएँ। यह एक शोर भरी दोपहर से कहीं बेहतर सौदा है।"',
      text: '"Then here is the grove\'s law, guest," said the bonga. "Take from the edges, where I grow back. Leave the hearts, where I live. Eat your fill and leave me standing — and I will feed you, and your calves, and their calves, every winter until elephants forget the way here. That is a better bargain than one loud afternoon."' },
    { art: ['pt_elephant'], who: null,
      hi: 'हाथी ने किनारों से खाया — कहना पड़ेगा, बहुत सारा खाया; नियम ने पेट भर खाने को कहा था, और उसने छककर खाया। फिर उसने सबसे पुराने बाँस को अपनी सूँड से हौले से छुआ, जैसे बड़ों के पाँव छूते हैं, और पहाड़ी से नीचे लौट गया। और अगली सर्दी वह जंगल वहीं था। और उससे अगली सर्दी भी। और उससे अगली भी।',
      text: 'The elephant ate from the edges — a very large amount, it must be said; the law says fill, and he filled. Then he touched the oldest cane gently with his trunk, the way you touch an elder\'s feet, and went back down the hill. And the next winter the grove was there. And the next. And the next.' },
    { art: ['pt_elephant'], who: 'mithu',
      hi: 'झारखंड के संथाल गाँव इतिहास लिखने से भी पहले के समय से उपवन का एक नियम निभाते आए हैं: सिर्फ़ किनारों से लो, दिल को बख्श दो, और उस जगह को किसी जीते-जागते इंसान की तरह आदर दो। यही वजह है कि उनकी पहाड़ियों पर आज भी बातें करने के लिए घने उपवन बचे हुए हैं।',
      text: 'The Santhal villages of Jharkhand have kept the grove\'s law for longer than anyone has written things down: take from the edge, spare the heart, and treat the place like a somebody. It is why their hills still have groves to argue with.' }
  ],
  moral: 'Take from the edges and spare the heart, and the grove will outlast your grandchildren\'s hunger.',
  source: 'A Bizzing India telling, said so plainly — this particular elephant tale is the app\'s own. The frame is real and credited: bongas, the spirits of places, are how Santhal tradition speaks of the living land, and take-what-regrows restraint is genuine Adivasi forest practice in Jharkhand.'
},

{
  id: 'it.birsa-munda',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'itihaas',
  needs_review: true,
  title: 'The Boy They Called Father of the Earth',
  hook: 'He herded sheep and played the flute like any village boy. A whole state now has its birthday on his.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-JH'],
  words_hi: [['धरती', 'dharti', 'earth'], ['जंगल', 'jangal', 'forest'], ['हक़', 'haq', 'rightful claim']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'यह एक सच्ची कहानी है — इतिहास, जो सबूतों से साबित होता है। साल 1875 में, छोटानागपुर के पठार पर बसे उलिहातू गाँव में, एक ग़रीब मुंडा परिवार में बिरसा नाम के एक लड़के का जन्म हुआ। वह भेड़ें चराता था और अपनी बाँसुरी के लिए जाना जाता था। उस शुरुआत में ऐसा कुछ भी नहीं था जिससे लगे कि इतिहास उसे देख रहा था।',
      text: 'This is a true story — itihaas, what the evidence shows. In 1875, in the village of Ulihatu on the Chotanagpur plateau, a boy named Birsa was born to a poor Munda family. He herded sheep, and he was known for his flute. Nothing about the beginning said history was watching.' },
    { art: ['courtier'], who: null,
      hi: 'मुंडा लोग कई सदियों से अपने पुराने तौर-तरीक़ों के तहत उन जंगलों को साफ़ करके खेती करते आए थे: ज़मीन उन परिवारों की होती थी जिनके पूर्वजों ने सबसे पहले मिलकर, एक समुदाय की तरह, उसे साफ़ किया था। बिरसा अलग-अलग गाँवों और मिशन स्कूलों के बीच बड़ा हुआ—वह सीखने में बहुत तेज़ था और हर बात को ध्यान से सुनता था।',
      text: 'The Munda people had cleared and farmed those forests for many centuries, under their own old system: the land belonged to the families whose ancestors had first cleared it, together, as a community. Birsa grew up moving between villages and mission schools, quick at learning, listening to everything.' },
    { art: ['guard', 'courtier'], who: null, mood: 'sad',
      hi: 'और बड़े होते हुए उसने देखा कि उसके अपने ही लोग अपनी ही ज़मीन पर बेबस होते जा रहे थे। ब्रितानी हुकूमत के क़ानूनों के तहत, बाहरी लोग — ज़मींदार और साहूकार — मुंडाओं के खेतों और जंगलों पर हक़ जमा रहे थे। जिन परिवारों ने पीढ़ियों से किसी पहाड़ी पर खेती की थी, उन्हें उसी के लिए लगान देने या बिना मज़दूरी के काम करने पर मजबूर किया जा रहा था। मुंडाओं के पास उस चीज़ के लिए एक शब्द था जो उनसे छीनी जा रही थी, और उसका मतलब था सब कुछ।',
      text: 'And what he saw as he grew up was his people losing ground on their own land. Under the laws of British colonial rule, outsiders — landlords and moneylenders — were gaining rights over Munda fields and forests. Families who had farmed a hillside for generations were being forced to pay rent for it, or to work without pay. The Mundas had a word for what was being lost, and it meant everything.' },
    { art: ['courtier'], who: null,
      hi: 'जवान होकर बिरसा ने आवाज़ उठाई। उसने अपने लोगों से कहा कि डर छोड़ दें, साफ़-सुथरा जीवन जिएँ, और याद रखें कि उनके पैरों तले की ज़मीन सबसे पुराने हक़ से उनकी है — उन लोगों का हक़ जिन्होंने इसे अपना घर बनाया था। लोग उसे सुनने के लिए दूर-दूर से पैदल चलकर आने लगे। वे उसे धरती आबा यानी धरती का पिता पुकारते थे। तब वह मुश्किल से बीस-इक्कीस साल का ही था।',
      text: 'As a young man, Birsa began to speak. He told his people to give up fear, to live cleanly, and to remember that the land under their feet was theirs by the oldest right there is — the right of the ones who made it a home. People began to walk long distances to hear him. They called him Dharti Aba: Father of the Earth. He was barely in his twenties.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'उसका संदेश एक आंदोलन बन गया, और वह आंदोलन एक महा-विद्रोह में बदल गया — उसके लोग इसे उलगुलान कहते थे, जो 1899 और 1900 में अपने चरम पर था। इसका नारा तब से आज तक याद किया जाता है: हमारा अपना राज वापस आए।',
      text: 'His message gathered into a movement, and the movement into a rising — the Ulgulan, his people called it, the Great Tumult, at its height in 1899 and 1900. Its cry has been remembered ever since: let our own rule return.',
      ask: {
        q: 'What were Birsa and the Mundas standing up FOR?',
        options: ['Treasure and power for Birsa himself', 'Their forests, their fields, and the right to live on their own land under their own ways', 'Nothing in particular'],
        answer: 1,
        right: 'That is what the evidence shows: land, forest and dignity — the right of a people to their own home and their own ways.',
        wrong: 'The record is clear: not treasure, and not power for one man. Forests, fields, and the right of a people to live on their own land under their own ways.'
      } },
    { art: ['guard'], who: null, mood: 'sad',
      hi: '"अंग्रेज़ी हुकूमत ने ताक़त से जवाब दिया, और इस बगावत को दबा दिया गया; कहानी के ये हिस्से बड़े दुख भरे हैं, और यह ऐप इन्हें तब के लिए संभाल कर रखता है जब तुम थोड़े बड़े हो जाओगे। साल 1900 में बिरसा को पकड़कर राँची की जेल ले जाया गया, और वहीं, उसी साल, महज़ लगभग पचीस साल की उम्र में वे दुनिया छोड़ गए। उनके लोगों ने उनका नाम लेना कभी नहीं छोड़ा।"',
      text: 'The colonial government answered with force, and the rising was put down; those parts of the story are hard, and this app keeps them for when you are older. Birsa was captured in 1900 and taken to Ranchi jail, and there, that same year, still only about twenty-five years old, he died. His people never stopped saying his name.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"और इतिहास बताता है कि आगे क्या हुआ: जिन हुक्मरानों ने उन्हें जेल में डाला था, उन्हें क़ानून बदलना पड़ा। कुछ ही सालों के भीतर छोटानागपुर के लिए एक नया क़ानून आया जिसने आदिवासियों की ज़मीन को बाहर वालों के हाथों में जाने से बचाया — यह एक ऐसी हिफ़ाज़त थी जिसके लिए बिरसा के लोगों ने अपना ख़ून बहाया था, और जो आज भी झारखण्ड की क़ानून की किताबों में दर्ज है।"',
      text: 'And here is what the evidence shows happened next: the rulers who had jailed him had to change the law. Within a few years came a new act for Chotanagpur that protected Adivasi land from being taken by outsiders — a protection Birsa\'s people had bled for, and one that still stands in Jharkhand\'s law books today.' },
    { art: ['courtier'], who: null,
      hi: '"एक सदी बाद, भारत ने इस पठार को तराश कर जंगलों की ज़मीन के लिए एक नया राज्य बनाया — झारखण्ड का ठीक यही मतलब होता है। इसके बनने की चुनी गई तारीख़ थी: 15 नवंबर 2000। यानी बिरसा का जन्मदिन। भारत की संसद में उनकी तस्वीर लगी है; राँची के हवाई अड्डे का नाम उनके नाम पर है; और अब पूरे भारत में 15 नवंबर को सभी आदिवासी समुदायों के सम्मान के दिन के रूप में मनाया जाता है।"',
      text: 'A century later, India carved a new state out of the plateau, for the land of the forests — Jharkhand means exactly that. The chosen date for its birth: 15 November 2000. Birsa\'s birthday. His portrait hangs in India\'s Parliament; Ranchi\'s airport carries his name; and 15 November is now marked across India as a day honouring all Adivasi peoples.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"वे क़रीब पचीस साल ही जिए — यह उम्र तो कई लोगों की यह सोचने में बीत जाती है कि क्या किया जाए। याद रखना वह नाम जो उनके अपने लोगों ने उन्हें दिया, जो कोई भी सरकार कभी नहीं दे सकती थी: धरती आबा। यानी धरती के पिता।"',
      text: 'He lived about twenty-five years — fewer than many people spend deciding what to do. Remember the title his own people gave him, which no government ever could: Dharti Aba. Father of the Earth.' }
  ],
  moral: 'Standing up for your people\'s home can outlive you — and outvote the ones who stopped you.',
  source: 'K. S. Singh, "Birsa Munda and His Movement, 1874–1901" (the standard scholarly study); the Chotanagpur Tenancy Act of 1908 protecting Adivasi land; Jharkhand statehood on 15 November 2000, Birsa\'s birth anniversary, now observed nationally as Janjatiya Gaurav Divas; his portrait hangs in Parliament\'s Central Hall. The violence of the Ulgulan\'s suppression is deliberately kept offstage for this age band. needs_review: colonial-era conflict requires named human review before publish (docs/05 §6).'
},

{
  id: 'fk.sarhul-flowers',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'When the Sal Trees Bloom',
  hook: 'In Jharkhand, the new year does not arrive by calendar. It arrives by flower — and the whole state can smell it coming.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['फूल', 'phool', 'flower'], ['वसंत', 'vasant', 'spring'], ['धन्यवाद', 'dhanyavaad', 'thanks']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"हर बसंत, झारखण्ड के साल के जंगल चुपचाप एक अनोखा कमाल दिखाते हैं: उन विशाल पेड़ों पर फूल खिल उठते हैं — लाखों की तादाद में छोटे-छोटे, हल्के मलाई जैसे रंग के फूल, और शहद जैसी मीठी महक जो मीलों दूर तक फैल जाती है। और जब साल खिल उठता है, तब आदिवासियों का नया साल आ जाता है। इस त्योहार को सरहुल कहते हैं: साल के पेड़ों की पूजा।"',
      text: 'Every spring, the sal forests of Jharkhand do something quietly spectacular: the great trees flower — small, cream-pale blossoms by the million, and a honeyed scent that drifts for miles. And when the sal blooms, the Adivasi new year has arrived. The festival is called Sarhul: the worship of the sal.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"इस पठार के कई समुदाय इसे अपने-अपने ढंग से मनाते हैं — उराँव, मुंडा, हो और दूसरे लोग सरहुल मनाते हैं, और संताल लोग फूलों के खिलने के इसी मौसम में अपना फूलों का त्योहार, बाहा, मनाते हैं। अलग-अलग गीत, अलग-अलग कदम, पर बात एक ही: नया साल तभी शुरू होता है जब पेड़ कहते हैं।"',
      text: 'It is kept, in their own ways, by many peoples of the plateau — the Oraon, the Munda, the Ho and others keep Sarhul, and the Santhals keep their own flower festival, Baha, in the same blossoming season. Different songs, different steps, one shared idea: the year begins when the trees say so.' },
    { art: ['guard'], who: null,
      hi: 'त्योहार सबसे पहले पवित्र उपवन में जाता है। गाँव के पुजारी — पाहन — वहाँ सबकी तरफ से पूजा-अनुष्ठान करते हैं, अच्छी बारिश और अच्छे साल के लिए भेंट चढ़ाते हैं और प्रार्थना करते हैं; कई गाँवों में पाहन पानी के बर्तनों से संकेत पढ़ते हैं, और पूरा गाँव सुनता है कि पानी मानसून के बारे में क्या भरोसा दिला रहा है।',
      text: 'The festival goes to the sacred grove first. The village priest — the pahan — keeps the rites there on behalf of everyone, with offerings and prayers for good rains and a good year; in many villages the pahan reads the signs from vessels of water, and the village listens to what the water promises about the monsoon.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'फिर उपवन का आशीर्वाद घर आता है। उपवन से साल के फूल लाए जाते हैं और दरवाज़ों व घरों में आदर के साथ रखे जाते हैं — पुजारी और बुज़ुर्ग हर परिवार तक फूल पहुँचाते हैं, ताकि गाँव की हर छत जंगल के बसंत का एक हिस्सा पहन सके। नगाड़े बजने लगते हैं। नाचने वालों की कतारें बन जाती हैं। यह सब देर रात तक चलता रहता है, और किसी को भी इसे रोकने की कोई जल्दी नहीं होती।',
      text: 'Then the grove\'s blessing comes home. Sal blossoms are carried from the grove and set with honour on doorways and in houses — the priest and elders bringing flowers to every family, so that every roof in the village wears a piece of the forest\'s spring. Drums begin. Lines of dancers form. It goes on into the night, and nobody is in a hurry for it to stop.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'सरहुल में एक ऐसा रिवाज़ है जिस पर ठहरकर सोचने की ज़रूरत है। जब तक यह त्योहार मना नहीं लिया जाता — जब तक धन्यवाद नहीं कह दिया जाता — तब तक कई परिवार नए मौसम के जंगल के पहले फल और फूल नहीं खाते।',
      text: 'There is one custom inside Sarhul worth thinking about slowly. Until the festival is kept — until thanks are given — many families will not eat the new season\'s first fruits and flowers of the forest.',
      ask: {
        q: 'Why wait for a thank-you before eating the first new fruits of the year?',
        options: ['The fruit is not ripe before the festival', 'Because saying thanks FIRST remembers that the forest gives — that food is received, not just grabbed', 'It is only about parties'],
        answer: 1,
        right: 'Gratitude first, feast second. It is the same order as folding your hands before a meal — the receiving is remembered before the eating begins.',
        wrong: 'It is about the order of things: thanks first, feast second. Eating only after the festival remembers that the forest gives — that food is received, not just grabbed.'
      } },
    { art: ['guard'], who: null,
      hi: 'राँची में, सरहुल शहर के सबसे शानदार नज़ारों में से एक बन चुका है: हर मोहल्ले से निकलती शोभायात्राएँ, लाल पाड़ वाली सफ़ेद साड़ियों में नर्तकों और ढोल बजाने वालों का सैलाब, हर तरफ साल के फूल, और गाती-गुनगुनाती चलती पूरी राजधानी। स्कूल बंद रहते हैं। यह पठार अपना ही उत्सव मनाता है।',
      text: 'In Ranchi, Sarhul has grown into one of the great sights of the city: processions from every neighbourhood, rivers of dancers and drummers in white saris bordered with red, sal blossoms everywhere, the whole capital walking and singing. Schools close. The plateau celebrates itself.' },
    { art: ['courtier'], who: null,
      hi: 'और इन सबके बीच खड़े हैं वे पेड़ जिनसे यह सब शुरू हुआ — साल, इस पठार का पेड़, जो पत्तल, राल, छाँव, लकड़ी और इस एक हफ़्ते की महक देता है। अपने दिल में यह त्योहार पूरे समुदाय का जंगल की ओर मुड़कर, बाकायदा नगाड़ों के साथ यह कहने जैसा है: हमने आपकी देन को देखा। शुक्रिया। इस साल फिर से।',
      text: 'And through it all stand the trees that started it — the sal, the tree of the plateau, giver of leaf-plates and resin and shade and timber and this one week of perfume. The festival is, at its heart, a whole people turning to a forest and saying, formally and with drums: we noticed. Thank you. Again this year.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आपके परिवार का बसंत का त्योहार चाहे जो भी हो — सरहुल, बाहा, होली, ईस्टर, नवरोज़, बिहू — यह ज़रूर पूछिए कि वह किस बात के लिए शुक्रिया कहता है। बसंत का हर त्योहार असल में एक धन्यवाद-पत्र है। पते अलग-अलग हैं; चिट्ठी वही है।',
      text: 'Whatever your family\'s spring festival is — Sarhul, Baha, Holi, Easter, Navroz, Bihu — ask what it says thank you FOR. Every spring festival is a thank-you note. The addresses differ; the letter is the same.' }
  ],
  moral: 'Begin the year with a thank-you, and everything eaten after it tastes like a gift.',
  source: 'Sarhul, the spring festival of the Oraon, Munda, Ho and other Adivasi communities of Jharkhand, and the Santhal Baha festival in the same season — the sal blossoms, the pahan\'s rites in the sacred grove, the flower-bearing to homes, first-fruits restraint until the festival, and Ranchi\'s great processions are all real and current. Details vary by community and village; ask a family how theirs keeps it.'
},

/* ============================================================= ODISHA ====== */
{
  id: 'fk.boita-bandana',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'Little Boats for the Big Sailors',
  hook: 'Before dawn on one full-moon morning, all of Odisha goes down to the water carrying tiny boats — to remember the hugest ones.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-OR'],
  words_hi: [['नाव', 'naav', 'boat'], ['दीया', 'diya', 'lamp'], ['समुद्र', 'samudra', 'sea']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'कार्तिक पूर्णिमा की सुबह अभी अंधेरा ही है — पवित्र कार्तिक महीने की पूर्णिमा — और पूरे ओडिशा में परिवार पानी की ओर जा रहे हैं। नदियाँ, कुंड, तालाब, और पुरी में खुद समंदर: जहाँ-जहाँ पानी है, वहाँ नींद से भरे बच्चे अपने सबसे अच्छे कपड़े पहने, बड़ी सावधानी से छोटी-छोटी नावें ले जा रहे हैं।',
      text: 'It is still dark on the morning of Kartika Purnima — the full moon of the holy month of Kartika — and all over Odisha, families are walking to water. Rivers, tanks, ponds, the sea itself at Puri: wherever there is water, there are sleepy children in their best clothes, carefully carrying little boats.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'ये नावें केले के तने, छाल और रंग-बिरंगे कागज़ से बनी हैं, और हर नाव को किसी असली जहाज़ के छोटे रूप की तरह सजाया गया है: एक दीया, पान के पत्ते, फूल और एक सिक्का। भोर की पहली किरण फूटते ही, हर परिवार अपनी नन्हीं नाव को जलते हुए दीये के साथ पानी में उतारता है — और अचानक पूरी काली नदी बहते हुए तारों का बेड़ा बन जाती है।',
      text: 'The boats are made of banana stem and bark and coloured paper, and each one is loaded like a real ship in miniature: a lamp, betel leaves, flowers, a coin. At first light, each family sets its little boat on the water, lamp burning — and suddenly the whole dark river is a fleet of drifting stars.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'जैसे ही नावें आगे बढ़ती हैं, सब मिलकर वही पुराना जयकारा लगाते हैं — "आ का मा बोई!" — यह इतनी पुरानी पुकार है कि इसमें समुद्री यात्रा के महीनों के ही नाम आते हैं; किसी ओड़िया परिवार से कहिए कि वे आपको इसे ठीक से बोलकर सुनाएँ। इस परंपरा को बोइता बंदाणा कहते हैं: नावों का वंदन। लेकिन कौन-सी नावें?',
      text: 'As the boats go out, everyone says the old cry together — "Aa ka ma boi!" — a counting-call so ancient that it names the sailing months themselves; ask an Odia family to say it for you properly. The custom is called Boita Bandana: the honouring of the boats. But which boats?' },
    { art: ['guard'], who: 'guard',
      hi: 'वे विशाल नावें। कई सदियों पहले, ओडिशा — जिसे उन दिनों कलिंग कहा जाता था — भारत के महान समुद्री क्षेत्रों में से एक था। वहाँ के व्यापारी, जिन्हें साधब कहा जाता था, \'बोइत\' नाम के ऊँचे-ऊँचे जहाज़ बनाते थे, और जब बारिश के बाद हवाओं का रुख बदलता, तो पूरे के पूरे जहाज़ी बेड़े बंगाल की खाड़ी के पार निकल पड़ते थे — श्रीलंका, बर्मा, और सुदूर बाली, जावा और सुमात्रा के द्वीपों तक।',
      text: 'The huge ones. Many centuries ago, Odisha — Kalinga, in those days — was one of the great seafaring lands of India. Its merchants, the sadhabas, built tall ships called boitas, and when the winds turned after the rains, whole fleets set out across the Bay of Bengal — to Sri Lanka, to Burma, and all the way to the islands of Bali, Java and Sumatra.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'ज़रा सोचिए, किनारे पर रह गए परिवारों के लिए उस यात्रा का क्या मतलब होता होगा। न कोई फ़ोन, न कोई भरोसेमंद नक्शा, महीनों तक कोई ख़बर नहीं — बस जाते समय मॉनसून की हवाएँ और, अगर सब ठीक रहा, तो लौटते समय भी मॉनसून की ही हवाएँ।',
      text: 'Think what a sailing like that meant for the families on the shore. No phones, no maps you could trust, no news for months — just the monsoon winds out and, if all went well, the monsoon winds home.',
      ask: {
        q: 'The great ships left on this full moon, with the favourable winds. Who do you think the little lamp-boats really honour?',
        options: ['The sea itself, and nothing more', 'The sailors — the leaving, the waiting families, and the hoped-for coming home', 'The boat-builders\' carpentry'],
        answer: 1,
        right: 'The sailors and the waiters both. Every little boat is a launched blessing: go well, come home. Families have floated that same message for two thousand years.',
        wrong: 'The lamp-boats carry a message older than writing: go well, come home. They honour the sailors who left on this moon — and the families who stood on this shore and watched them go.'
      } },
    { art: ['courtier'], who: null,
      hi: 'यह व्यापार दोनों तरफ़ से चला और उसने दोनों ओर अपनी छाप छोड़ी। आज भी, इंडोनेशिया में पाँच हज़ार किलोमीटर दूर बाली द्वीप पर कलिंग से अपने पुराने रिश्तों की याद में एक त्योहार मनाया जाता है, और ओड़िया व बाली के विद्वान दूर के रिश्तेदारों की तरह एक-दूसरे के उत्सवों में जाकर खानदानी ऐल्बम साझा करते हैं। समुद्र के इस रास्ते को दोनों किनारों पर याद रखा गया है।',
      text: 'The trade went both ways and left traces both ways. To this day, Bali — five thousand kilometres away in Indonesia — keeps its own festival remembering the old links with Kalinga, and Odia and Balinese scholars visit each other\'s festivals like distant cousins comparing family albums. The sea road is remembered at both ends.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'और कटक में, महानदी के रेतीले तट पर, ये नन्हीं नावें एक बहुत बड़े मेले की शुरुआत करती हैं: बाली जात्रा — जिसका सीधा अर्थ है "बाली की यात्रा" — जो भारत के सबसे बड़े खुले मेलों में से एक है। कई दिनों तक वहाँ दुकानें, झूले, खिलौने और खाने-पीने के ढेरों पकवान होते हैं, नदी किनारे उत्सव का एक पूरा शहर ही बस जाता है, और इस सबका नाम एक समुद्री यात्रा पर रखा गया है।',
      text: 'And in Cuttack, on the sands of the Mahanadi river, the little boats launch a giant fair: Bali Jatra — literally "the journey to Bali" — one of the biggest open-air fairs in India. For days there are stalls and wheels and toys and mountains of food, a whole city of celebration on the riverbank, all of it named for a voyage.' },
    { art: ['courtier'], who: null,
      hi: 'सुबह-सुबह जो बच्चे नावें तैराते हैं, वे सचमुच का कोई जहाज़ कहीं नहीं ले जा सकते। पर बात यह है ही नहीं। बात तो यह है कि यह समुद्र तट याद रखता है कि कभी उसने क्या किया था — और पानी पर तैरता हर दीया कहता है: हम भूले नहीं हैं कि हमारे पुरखों ने कभी समंदर पार किया था।',
      text: 'The children who float boats at dawn mostly cannot sail a ship anywhere. That is not the point. The point is that a coastline remembers what it once did — and every lamp set on the water says: we have not forgotten that our great-great-grandparents crossed the sea.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'तुम भी कार्तिक पूर्णिमा पर अपनी एक बोइता बना सकते हो — कागज़ की, किसी पत्ते की, और अगर कोई बड़ा मदद करे तो एक नन्हे दीये के साथ — और दुनिया में जहाँ भी पानी मिले, उस पर इसे तैरा सकते हो। ओडिशा से दूर रहने वाले बहुत से ओड़िया परिवार बिल्कुल यही करते हैं। हर किनारे से एक ही संदेश जाता है: सकुशल जाओ, घर लौट आओ।',
      text: 'You can make a boita of your own on Kartika Purnima — paper, a leaf, a little lamp if an adult helps — and float it on any water you have, anywhere in the world. Plenty of Odia families far from Odisha do exactly that. The message is the same from every shore: go well, come home.' }
  ],
  moral: 'A paper boat with a lamp can carry two thousand years of remembering. Small things launched with love go far.',
  source: 'Boita Bandana on Kartika Purnima and the Bali Jatra fair at Cuttack, both real and current, commemorating the sadhaba merchants of ancient Kalinga who sailed to Bali, Java, Sumatra and beyond; the "Aa ka ma boi" cry names the sailing months. Odisha\'s maritime links with Bali are attested and celebrated at both ends.'
},

{
  id: 'it.konark-chariot',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'itihaas',
  title: 'The Chariot That Cannot Move and Never Stops',
  hook: 'Seven hundred years ago, a king ordered a temple built in the shape of the sun\'s own chariot — wheels, horses and all.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 5,
  place: ['IN-OR'],
  words_hi: [['सूरज', 'sooraj', 'sun'], ['पहिया', 'pahiya', 'wheel'], ['पत्थर', 'patthar', 'stone']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'ओडिशा के तट पर, समंदर के करीब, इंसानों द्वारा बनाई गई सबसे हैरान कर देने वाली इमारतों में से एक खड़ी है। यह इतिहास है — जो सबूत दिखाते हैं — और वह सबूत आज भी वहीं पत्थरों पर तराशा हुआ खड़ा है, जिसे कोई भी जाकर देख सकता है: कोणार्क का सूर्य मंदिर।',
      text: 'On the shore of Odisha, near the sea, stands one of the most astonishing buildings human beings have ever made. This is itihaas — what the evidence shows — and the evidence is still standing there, carved in stone, for anyone to go and see: the Sun Temple of Konark.' },
    { art: ['guard'], who: null,
      hi: 'इसे तेरहवीं सदी में पूर्वी गंग वंश के राजा नरसिंहदेव प्रथम के आदेश पर बनाया गया था, जिनका इस तट पर राज था। उनके कारीगरों को एक बेहद सुंदर और अनूठी कल्पना दी गई थी: यह मंदिर सिर्फ़ सूर्य देवता का सम्मान ही नहीं करेगा। यह ख़ुद उनका रथ होगा — वही विशाल रथ जिसमें सवार होकर, जैसा कि कथा बताती है, सूर्य हर दिन आकाश की सैर करते हैं।',
      text: 'It was built in the thirteenth century, by order of King Narasimhadeva the First of the Eastern Ganga dynasty, who ruled this coast. His builders were given an idea of pure poetry: the temple would not merely honour Surya, the sun. It would BE his chariot — the great chariot in which, as the katha tells it, the sun rides across the sky each day.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'तो उन्होंने पहाड़ी जितना बड़ा पत्थर का एक रथ बनाया। उसके किनारों पर उन्होंने बारह जोड़ी विशाल पहिए तराशे, जो किसी पूरे कद के इंसान से भी ऊँचे थे, और जिनकी हर तीली तथा धुरी पर गहनों जैसी बारीक नक्काशी की गई थी। और आगे, पत्थरों में पूरी ताक़त से ज़ोर लगाते हुए सात शक्तिशाली घोड़े, जो पूरे मंदिर को भोर की दिशा में खींच रहे हों।',
      text: 'So they built a chariot of stone the size of a hill. Along its sides they carved twelve pairs of gigantic wheels, taller than a grown man, every spoke and hub worked with carvings fine as jewellery. And at the front, straining forward in stone, seven mighty horses to draw the whole temple towards the dawn.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"कोणार्क के गाइड आने वाले लोगों से गिनती वाला सवाल पूछना बहुत पसंद करते हैं, तो चलिए, वही सवाल आपके लिए भी है। पहियों के बारह जोड़े। सात घोड़े। मंदिर बनाने वालों ने ये संख्याएँ जान-बूझकर चुनी थीं।"',
      text: 'Guides at Konark love to ask visitors the counting question, so here it is for you. Twelve pairs of wheels. Seven horses. The builders chose those numbers on purpose.',
      ask: {
        q: 'Why twelve pairs of wheels and seven horses on the sun\'s chariot?',
        options: ['They were the king\'s lucky numbers', 'Twelve months of the year, seven days of the week — the chariot carries time itself', 'That was all the stone they had'],
        answer: 1,
        right: 'The temple is a calendar in stone: the months as wheels, the days as horses. And guides still show how a wheel\'s spokes can be read like a sundial, telling time by shadow.',
        wrong: 'The numbers are the calendar: twelve months as wheels, seven days as horses — a chariot carrying time itself. Guides still show how a wheel\'s spokes can be read like a sundial, telling time by shadow.'
      } },
    { art: ['guard'], who: null,
      hi: '"सदियों तक, बंगाल की खाड़ी के नाविक इस मंदिर को दिशा पहचानने के लिए इस्तेमाल करते थे और उन्होंने इसे एक नाम भी दिया था: \'ब्लैक पैगोडा\' — इसके गहरे रंग के पत्थर की वजह से, और समुद्र तट पर आगे सफ़ेदी से पुते पुरी के मंदिर, यानी अपने \'व्हाइट पैगोडा\' से अलग पहचानने के लिए। इतनी बड़ी इमारत कि पानी के जहाज़ इसे देखकर अपना रुख तय करते थे।"',
      text: 'For centuries, sailors on the Bay of Bengal used the temple as a landmark and gave it a nickname: the Black Pagoda — for its dark stone, and to tell it apart from the white-washed temple of Puri up the coast, their White Pagoda. A building so large that ships steered by it.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: '"सबूतों की सच्ची बात यह है: आज आप जो मंदिर देखते हैं, वह पूरा नहीं है। इसका मुख्य शिखर — जो पूरे भारत के सबसे ऊँचे शिखरों में से एक होता — सदियों पहले गिरकर खंडहर बन गया, और विद्वानों में आज भी इस बात पर बहस होती है कि यह ठीक कब और क्यों गिरा: ज़मीन की वजह से, समुद्री हवा से, नुकसान से, या अनदेखी से; पुराने दस्तावेज़ बहुत कम हैं और इतिहासकार अंदाज़ा लगाने के बजाय साफ़-साफ़ यही बताते हैं। जो आज बचा हुआ है, वह है इसका बड़ा मंडप और रथ का निचला हिस्सा — और सिर्फ़ इतना ही देख कर मन चकित रह जाता है।"',
      text: 'Honesty about the evidence: the temple you see today is not complete. Its main tower — which would have been one of the tallest in India — fell in ruin centuries ago, and scholars still debate exactly when and why: the ground, the sea air, damage, neglect; the records are thin and historians say so rather than guessing. What survives is the great porch and the chariot base — and even that much is overwhelming.' },
    { art: ['courtier'], who: null,
      hi: '"नक्काशियों को ज़रा ध्यान से देखिए, तो मंदिर का रूप बिल्कुल गंभीर नहीं लगता: संगीतकार, नर्तक, हाथी, हंस, पहलवान, परिवार, और तेरहवीं सदी की ज़िंदगी का हर एक भरा-पूरा कोना। कारीगरों ने अपनी पूरी दुनिया को ही सूरज के रथ पर उकेर दिया था — तो एक तरह से, हर किसी को इस रथ पर सवारी करने का मौका मिल गया।"',
      text: 'Look closely at the carvings and the temple stops being solemn: musicians, dancers, elephants, geese, wrestlers, families, whole crowded inches of thirteenth-century life. The builders carved their own world onto the sun\'s chariot — so in a way, everyone got to ride.' },
    { art: ['courtier'], who: null,
      hi: '"1984 में, कोणार्क को यूनेस्को विश्व धरोहर स्थल घोषित किया गया — दुनिया के उन अनमोल ख़ज़ानों में से एक जिन्हें सहेज कर रखने पर सब राज़ी हुए हैं — और भारतीय पुरातत्व सर्वेक्षण इसकी देखभाल करता है। इसे बचाने वाले विशेषज्ञ इस पर लगातार काम करते रहते हैं; पत्थर के रथ को सँभालना धीमा, सावधानी भरा और कभी न ख़त्म होने वाला काम है, बिल्कुल वैसे ही जैसे किसी भी सँभालने लायक चीज़ की हिफ़ाज़त की जाती है।"',
      text: 'In 1984, Konark was inscribed as a UNESCO World Heritage Site — one of the treasures the whole world has agreed to keep — and the Archaeological Survey of India tends it. Conservators work on it constantly; keeping a stone chariot is slow, careful, unending work, like keeping anything worth keeping.' },
    { art: ['guard'], who: 'mithu',
      hi: '"सूर्योदय के समय कोणार्क में खड़े हो जाइए, तो सात सौ साल बाद भी वह जादू बिल्कुल वैसे ही असर करता है जैसा कारीगरों ने चाहा था: पत्थरों के सात घोड़ों के ठीक सामने, समुद्र से असली सूरज निकलकर ऊपर आता है, और एक पल के लिए लगता है कि यह रथ, जो हिल भी नहीं सकता, बस अभी चल पड़ेगा।"',
      text: 'Stand at Konark at sunrise and the poetry still lands exactly as the builders aimed it, seven hundred years later: the real sun comes up out of the sea, straight ahead of the seven stone horses, and for one moment the chariot that cannot move looks like it is about to.' }
  ],
  moral: 'Build your idea so well that seven centuries later, strangers can still read it at sunrise.',
  source: 'The Sun Temple at Konark, Odisha — built in the 13th century under Narasimhadeva I of the Eastern Ganga dynasty; twelve pairs of carved wheels, seven horses, the sailors\' "Black Pagoda" nickname, the long-fallen main tower (its cause debated by scholars), and UNESCO World Heritage inscription in 1984 (Archaeological Survey of India / UNESCO listing).'
},

{
  id: 'fk.manika-curd',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Milkmaid and the Two Riders',
  hook: 'Two riders stopped at a village stall and drank their fill of curd. They paid with a ring — and the ring paid her back forever.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-OR'],
  words_hi: [['दही', 'dahi', 'curd'], ['घोड़ा', 'ghoda', 'horse'], ['अंगूठी', 'angoothi', 'ring']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'यह ओडिशा की सबसे प्यारी कथाओं में से एक है — पुरी के मंदिर की एक कहानी, जो सदियों से सुनाई जा रही है। ओडिशा के एक राजा, पुरुषोत्तम देव, अपनी पूरी सेना के साथ दक्षिण की ओर, दूर कांची की लंबी यात्रा पर निकले थे। वे क्यों जा रहे थे, यह कहानी तब के लिए है जब आप थोड़े बड़े हो जाएँगे; यह कहानी तो सड़क किनारे की एक दुकान और उसे चलाने वाली महिला के बारे में है।',
      text: 'This is one of Odisha\'s best-loved kathas — a temple story of Puri, told for centuries. A king of Odisha, Purushottama Deva, was on a long march south with his whole army, towards far-off Kanchi. The why of the march is a story for when you are older; this story is about a stall by the road, and the woman who kept it.' },
    { art: ['courtier'], who: null,
      hi: 'उनका नाम माणिका था, और वे दही बेचती थीं — अपनी ही गायों का बढ़िया गाढ़ा दही। उनके पास पीतल का एक बर्तन था, नारियल के खोल की कलछी थी, और झील के पास सड़क किनारे एक छायादार जगह थी। सेनाएँ हों, राजा हों, या तीर्थयात्री: सब उन्हीं रास्तों से गुज़रते हैं, और उन रास्तों पर प्यास सबको लगती है।',
      text: 'Her name was Manika, and she sold curd — good thick curd from her own cows, with a brass pot and a coconut-shell ladle and a shady spot where the road ran near the lake. Armies, kings, pilgrims: everyone travels the same roads, and everyone gets thirsty on them.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'उस तपती दोपहर, बाकी सबसे आगे सड़क पर दो घुड़सवार आए — देखने में दो भाई लगते थे, एक बारिश के बादल जैसा साँवला, काले... नहीं — कहानियों में यह बात बिल्कुल साफ़ बताई गई है: एक साँवला सवार, सफ़ेद घोड़े पर; एक गोरा सवार, काले घोड़े पर; दोनों ही बेहद सुंदर, दोनों ही धूल से सने हुए, और दोनों को ही सचमुच बहुत तेज़ प्यास लगी थी।',
      text: 'That hot afternoon, two riders came up the road ahead of all the rest — two brothers by the look of them, one dark as a rain cloud on a black... no — the tellings are exact about this: one rider dark, on a white horse; one fair, on a black horse; both of them beautiful, both of them dusty, both of them very thirsty indeed.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"माँ, दही पिलाइए," साँवले सवार ने कहा, और उन्होंने दोनों को दही परोसा — एक के बाद एक कई कटोरे भर-भर कर। वे ऐसे पी रहे थे जैसे सौ सालों से घोड़े दौड़ा रहे हों। जब आख़िरकार उनका पीना पूरा हुआ, तो साँवला सवार मुस्कुराया और — "हमारे पास सिक्के नहीं हैं। आप यह रख लीजिए। हमारे पीछे इसी रास्ते से राजा आ रहे हैं; उन्हें यह दिखा दीजिएगा, और वे हमारा हिसाब चुका देंगे।" और उसने उन्हें एक अँगूठी दे दी।',
      text: '"Curd, mother," said the dark one, and she served them — bowl after bowl after bowl. They drank like men who had been riding for a hundred years. When at last they were done, the dark rider smiled, and — "We have no coins with us. Take this. The king is coming up this road behind us; show it to him, and he will settle our account." And he gave her a ring.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'माणिका ने अपनी हथेली में रखी अँगूठी को देखा। यह उनकी थामी हुई किसी भी अँगूठी से कहीं भारी थी, और उस पर ऐसी कारीगरी थी जिसका नाम भी वे नहीं जानती थीं। दो अजनबी, पास में कोई सिक्का नहीं, और राजा से जुड़ा एक वादा।',
      text: 'Manika looked at the ring in her palm. It was heavier than any ring she had held, and worked with a craft she had no name for. Two strangers, no coins, a promise about a king.',
      ask: {
        q: 'Two strangers have drunk a whole day\'s curd and left only a ring and a promise. What should Manika do?',
        options: ['Chase them down the road shouting', 'Trust the ring, wait for the king, and see', 'Throw the ring in the lake'],
        answer: 1,
        right: 'She trusted and waited — and what came of it was bigger than any day\'s earnings ever could be.',
        wrong: 'She chose trust. She tucked the ring away, went on ladling curd, and waited to see if the road would keep the riders\' promise.'
      } },
    { art: ['guard'], who: 'guard',
      hi: 'सेना आ पहुँची — दूर क्षितिज तक उड़ती धूल, हाथी, झंडे, और ख़ुद राजा। माणिका शाही दल के आगे बढ़ीं, अँगूठी आगे बढ़ाई, और बस इतना कहा: "महाराज, आपसे आगे निकले दो घुड़सवारों ने मेरी दुकान पर दही पिया था। उन्होंने कहा था कि पैसे आप देंगे।"',
      text: 'The army arrived — dust to the horizon, elephants, banners, and the king himself. Manika stepped up to the royal party, held out the ring, and said, simply: "Two riders ahead of you drank curd at my stall, Maharaj. They said you would pay."' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: '"राजा ने अंगूठी पर बस एक नज़र डाली — और अपनी सवारी से नीचे उतर आए। क्योंकि वे उसे पहचानते थे। वह पुरी के मंदिर की थी; खुद प्रभु की अपनी थी। और वे वही बात समझ गए जो कहानियाँ समझती हैं: कि खुद जगन्नाथ और उनके भाई बलभद्र उनकी सेना के आगे-आगे चल रहे थे, दो भाई एक सफेद और एक काले घोड़े पर सवार — और वे भी किसी आम इंसान की तरह, एक अच्छी सी दुकान पर दही पीने रुके थे।"',
      text: 'The king took one look at the ring — and got down from his mount. For he knew it. It was from the temple at Puri; it was the Lord\'s own. And he understood what the tellings understand: that Jagannath and his brother Balabhadra themselves were riding ahead of his army, two brothers on a white horse and a black — and that they had stopped, like anyone, for curd at a good stall.' },
    { art: ['courtier'], who: null,
      hi: '"राजा ने तुरंत मणिका का पूरा हिसाब चुका दिया — और हिसाब से कहीं ज़्यादा दिया। कहानियाँ कहती हैं कि उन्होंने उसका गाँव उसी के और उसके परिवार के नाम कर दिया; और आज भी चिल्का झील के पास मणिकापटना नाम की एक जगह है — यानी मणिका का कस्बा — जिसे ओड़िआ परिवार सड़क से जाते हुए आपको दिखा देंगे।"',
      text: 'The king paid Manika\'s account on the spot — and far more than the account. The tellings say he granted her village to her and her family; and to this day, near the Chilika lake, there is a place called Manikapatna — Manika\'s town — which Odia families will point out to you from the road.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"ओड़िशा को यह कहानी एक बिल्कुल ओड़िआ अंदाज़ की वजह से प्यारी है: सेना के साथ चलते हुए जग के स्वामी जिस भी रूप में दिख सकते थे, उसमें से उन्होंने सड़क किनारे की एक दुकान पर गर्मी और प्यास से बेहाल मुसाफ़िर बनना चुना, जो नारियल की करछुल से दही पीता है और खाता खोल जाता है। किसी ओड़िआ परिवार से यह कहानी सुनाने को कहिए — और ध्यान दीजिए कि वे क्या बताते हैं कि उस दुकान पर सबसे पहले किसे परोसा गया था: हर किसी को।"',
      text: 'Odisha loves this story for a very Odia reason: of all the ways the Lord of the Universe might show himself on a march, he chose to be a hot, thirsty traveller at a roadside stall, drinking curd from a coconut ladle and running up a tab. Ask an Odia family to tell it — and note who they say was served first at that stall: everyone.' }
  ],
  moral: 'Serve every dusty stranger well. You have no idea who is riding ahead of the king.',
  source: 'The Odia temple tradition of Manika the milkmaid and the riders on the Kanchi march of King Purushottama Deva — the famous Kanchi-Kaveri katha of Puri, kept in temple tradition and Odia telling; the village of Manikapatna near Chilika bears her name. The war itself is deliberately left offstage for this age band. Many versions.'
},

{
  id: 'fk.rasagola-door',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'The Sweet That Opened the Door',
  hook: 'The Lord of the Universe came home from nine days away — and found the door locked. Someone inside wanted a word.',
  hero: 'lakshmi',
  cast: ['lakshmi', 'courtier'],
  minutes: 4,
  place: ['IN-OR'],
  words_hi: [['मिठाई', 'mithai', 'sweet'], ['दरवाज़ा', 'darwaza', 'door'], ['घर', 'ghar', 'home']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"हर गर्मी में पुरी में रथ यात्रा आती है — रथों का त्योहार, जब सारे जग के स्वामी जगन्नाथ, अपने भाई बलभद्र और बहन सुभद्रा के साथ, हज़ारों हाथों से खींचे जाने वाले लकड़ी के विशाल रथों में सवार होकर बड़े मंदिर से बाहर निकलते हैं, और आगे सड़क पर बने एक दूसरे मंदिर में रहने जाते हैं। पूरे नौ दिनों के लिए।"',
      text: 'Every summer at Puri comes the Rath Yatra — the festival of chariots, when Jagannath, Lord of the Universe, with his brother Balabhadra and sister Subhadra, rides out of the great temple in enormous wooden chariots pulled by thousands of hands, and goes to stay at another temple up the road. For nine whole days.' },
    { art: ['lakshmi'], who: null,
      hi: '"नौ दिन का सफ़र काफ़ी लंबा होता है। और यहीं आकर पुरी की कहानियाँ बड़ी आत्मीय और घरेलू हो जाती हैं, क्योंकि कोई था जो इस सफ़र पर नहीं गया: जगन्नाथ की पत्नी लक्ष्मी, सौभाग्य और सुखी गृहस्थी की देवी। वे घर पर ही रहीं। पूरे नौ दिनों तक। जबकि उनके पति आगे सड़क पर अपने भाई और बहन के साथ छुट्टियाँ मना रहे थे।"',
      text: 'Nine days is a long trip. And here the tellings of Puri turn warm and domestic, because somebody did not go on the trip: Lakshmi, Jagannath\'s wife, goddess of fortune and of well-run households. She stayed home. For nine days. While her husband holidayed up the road with his brother and sister.' },
    { art: ['lakshmi'], who: 'lakshmi', mood: 'think',
      hi: '"कहानियाँ उनके मन के भावों को बिल्कुल सच-सच बताती हैं, और इसीलिए यह कहानी सबको इतनी प्यारी लगती है। लक्ष्मी इंतज़ार करती रहीं। वे दिन गिनती रहीं। उन नौ दिनों के लगभग बीच में, वे आगे सड़क की ओर गईं — कुछ कहानियों के अनुसार चुपके से, रात के वक़्त — दूर से उस छुट्टी की चहल-पहल देखने के लिए। और फिर वे घर लौटीं, उन्होंने सोचा, और एक फ़ैसला किया।"',
      text: 'The tellings are honest about her feelings, which is why everyone loves this story. Lakshmi waited. She counted the days. Somewhere around the middle of the nine, she went — in some tellings secretly, at night — up the road to look at the holiday from a distance. And then she came home, and thought, and made a decision.',
      ask: {
        q: 'Nine days, no word, and now the chariots are rumbling home. What does Lakshmi do?',
        options: ['Pretend nothing happened and put dinner on', 'Lock the door — and let the Lord of the Universe explain himself from the step', 'Leave forever'],
        answer: 1,
        right: 'She locked the door. Of the whole temple. On the Lord of the Universe. Puri has adored her for it ever since.',
        wrong: 'The tellings are unanimous and delighted: she locked the door. Of the whole temple. On the Lord of the Universe. And waited.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'तो वह बड़ा सा जुलूस घर लौट आया — रथ, ढोल-नगाड़े, शंख, और रस्सियां खींचता आधा ओडिशा — और मंदिर के सामने आकर रुका, पर दरवाज़ा बंद था। सारे ब्रह्मांड के स्वामी अपनी ही चौखट पर खड़े थे। ढोल की आवाज़ धीरे-धीरे थम गई। अंदर कहीं, बिल्कुल शांत, खुद भाग्य की देवी इंतज़ार कर रही थीं यह सुनने के लिए कि वे अपने बचाव में क्या कहते हैं।',
      text: 'So the great procession came home — chariots, drums, conches, half of Odisha pulling the ropes — and rolled up to the temple, and the door was shut. The Lord of the Universe stood on his own doorstep. The drums trailed off. Somewhere inside, perfectly calm, fortune herself was waiting to hear what he had to say for himself.' },
    { art: ['lakshmi', 'courtier'], who: 'courtier',
      hi: 'कहानियों में कहा जाता है कि उनके पास मिठाइयाँ थीं। रसगुल्ले — चाशनी में डूबे वो नरम, सफेद गोले, जिन्हें यह तट सदियों से मंदिर के लिए बनाता आया है। कटोरी भर-भरकर रसगुल्ले, दरवाज़े की झिरी से पेश किए गए, और शायद चेहरे पर उनका सबसे प्यारा सा भाव था। एक पति, जो दुनिया की सबसे जानी-पहचानी भाषा में माफ़ी मांग रहा था।',
      text: 'What he had, the tellings say, was sweets. Rasagolas — the soft white rounds soaked in syrup that this coast has made for the temple since long ago. Bowl upon bowl of them, offered at the crack of the door, with, one imagines, his most winning expression. A husband apologising in the universal language.' },
    { art: ['lakshmi'], who: 'lakshmi',
      hi: 'लक्ष्मी ने उन्हें बस उतनी ही देर इंतज़ार कराया, जितनी सबक सिखाने के लिए ज़रूरी थी। फिर उन्होंने रसगुल्ले स्वीकार कर लिए — सच कहें तो वे थे भी बहुत लाजवाब — और अपनी शर्तें रख दीं: घर संभालने वाले की परवाह किए बिना अब नौ दिन की कोई यात्रा नहीं होगी। शर्तें मान ली गईं। दरवाज़ा खुला। सारे ब्रह्मांड के स्वामी घर आ गए।',
      text: 'Lakshmi let him wait exactly as long as was instructive. Then she accepted the rasagolas — they were, to be fair, excellent — and named her terms: no more nine-day trips without proper regard for the one who keeps the house. Terms agreed. The door opened. The Lord of the Universe came home.' },
    { art: ['courtier'], who: null,
      hi: 'और यह सिर्फ एक कहानी नहीं है — यह मंदिर के पंचांग में दर्ज है। जिस दिन जगन्नाथ लौटते हैं और दरवाज़े पर सुलह करते हैं, उस दिन को नीलाद्रि बिजे कहा जाता है, और हर साल उस दिन रसगुल्ले का भोग लगाया जाता है। दरवाज़ा खुलवाने वाली इस मिठाई के सम्मान में, ओडिशा इस दिन को \'रसगोला दिबस\' — यानी रसगुल्ला दिवस — के रूप में भी मनाता है।',
      text: 'And this is not just a story — it is on the temple calendar. The day Jagannath returns and makes peace at the door is called Niladri Bije, and rasagolas are offered that day, every single year. Odisha even keeps the date as Rasagola Dibasa — Rasagola Day — in honour of the sweet that opened the door.' },
    { art: ['lakshmi'], who: 'mithu',
      hi: 'ध्यान दीजिए कि पुरी ने अपने भगवान के बारे में क्या याद रखना चुना: कि वे भी उस इंसान के आगे जवाबदेह हैं जिसने घर में दीया जलाए रखा। कई ओड़िआ परिवारों में लोग बिल्कुल संजीदगी से आपसे कहेंगे कि पूरी परंपरा में यह सबसे सच्ची कहानी है। ज़रा उनसे पूछिए कि वे मुस्कुरा क्यों रहे हैं।',
      text: 'Notice what Puri chose to remember about its Lord: that even he answers to the person who kept the lamps lit at home. In many Odia families they will tell you, straight-faced, that this is the most realistic story in the whole tradition. Ask them why they are smiling.' }
  ],
  moral: 'Even the Lord of the Universe knocks politely when he has kept the household waiting. Homecomings owe something to the ones who stayed.',
  source: 'The Niladri Bije tradition at Puri — Lakshmi barring the door on Jagannath\'s return from Rath Yatra and the offering of rasagolas that ends the festival each year; Odisha marks the day as Rasagola Dibasa. A temple katha told with affection across Odisha; many tellings.'
},

{
  id: 'fk.ridley-night',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Night the Sea Comes Ashore',
  hook: 'On a few dark nights each year, one Odisha beach hosts one of the greatest gatherings of mothers on Earth.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'guard'],
  minutes: 4,
  place: ['IN-OR'],
  words_hi: [['कछुआ', 'kachhua', 'turtle'], ['रात', 'raat', 'night'], ['किनारा', 'kinara', 'shore']],
  scenes: [
    { art: ['pt_tortoise'], who: null,
      hi: 'साल के ज़्यादातर समय, गहिरमाथा और रुशिकुल्या नदी के मुहाने पर ओडिशा के लंबे समुद्र तट सिर्फ रेत, हवा और मछुआरों की नावों से भरे होते हैं। लेकिन समुद्र इन तटों से मिलने का एक वादा निभाता है — और कुछ अंधेरी रातों में, आमतौर पर सर्दियों के ढलते दिनों में, वह आ पहुँचता है।',
      text: 'For most of the year, the long beaches of the Odisha coast at Gahirmatha and by the Rushikulya river mouth are just sand, wind and fishing boats. But the sea is keeping an appointment with these beaches — and on a few dark nights, usually late in winter, it arrives.' },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      hi: 'इसकी शुरुआत लहरों के फेन में दिखते कुछ उभारों से होती है। फिर कुछ और। फिर और भी बहुत से। ऑलिव रिडले समुद्री कछुए — छोटे, गोल खोल वाले, भीगे हुए जैतून के रंग जैसे — लहरों से बाहर निकलकर चलने लगते हैं। सैकड़ों। फिर हज़ारों। फिर एक ही रात में दसियों हज़ार, यहाँ तक कि जहाँ तक टॉर्च की रोशनी जा सके, पूरा समुद्र तट कछुओं से पट जाता है—अगर कोई इतना नासमझ हो कि वहाँ टॉर्च जलाए।',
      text: 'It begins as bumps in the surf line. Then more. Then more. Olive ridley sea turtles — small, round-shelled, the colour of wet olives — start walking out of the waves. Hundreds. Then thousands. Then tens of thousands, in a single night, until the beach is cobbled with turtles as far as a torch could shine, if anyone were unwise enough to shine one.' },
    { art: ['guard', 'pt_tortoise'], who: null,
      hi: 'वैज्ञानिक इसके लिए स्पैनिश शब्द अरीबादा — "आगमन" — का इस्तेमाल करते हैं, क्योंकि पूरी दुनिया में बस कुछ ही समुद्र तटों पर ऐसा नज़ारा दिखता है, और ओडिशा के तट उनमें सबसे ख़ास हैं। इनमें से हर एक कछुआ एक माँ है, और हर एक माँ दूर समंदर पार तैरकर इसी ख़ास रेत पर आई है।',
      text: 'Scientists use the Spanish word arribada — "the arrival" — for this, because only a few beaches in the whole world host it, and Odisha\'s are among the greatest. Every one of those turtles is a mother, and every one has swum from far across the ocean to this particular sand.' },
    { art: ['pt_tortoise'], who: null,
      hi: 'हर माँ खुद को खींचकर लहरों की पहुँच से ऊपर ले जाती है, अपने पिछले चप्पूदार पैरों से सुराही जैसा साफ़-सुथरा घोंसला खोदती है — बिना देखे, बस अपनी सहज समझ से, जैसे कोई पीठ पीछे बुनाई कर रहा हो — लगभग सौ नरम सफ़ेद अंडे देती है, उन्हें ढकती है, रेत को थपथपाकर बराबर करती है, और वापस समंदर में चली जाती है। वह अब लौटकर नहीं आएगी। बाकी काम रेत और सूरज कर देते हैं।',
      text: 'Each mother hauls herself above the tide line, digs a neat flask-shaped nest with her back flippers — working blind, by instinct, like someone knitting behind their back — lays a hundred-odd soft white eggs, covers them, pats the sand down, and walks back into the sea. She will not return. The sand and the sun do the rest.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: 'लगभग छह या सात हफ़्तों बाद, पूरे तट पर अंडों से बच्चे निकलने लगते हैं। हथेली में समा जाने जितने नन्हे-नन्हे कछुए हज़ारों की तादाद में रेत से उबलते हुए बाहर आते हैं — लगभग हमेशा रात के समय — और फ़ौरन दौड़ना शुरू कर देते हैं। उन्हें जल्दी से समंदर तक पहुँचना होता है। और यहाँ इंसानों की भूमिका बहुत ज़रूरी हो जाती है: इन तटों की रखवाली करने वाले वनकर्मी और गाँव वाले अंडों से बच्चे निकलने के मौसम में तट पर अँधेरा रखते हैं।',
      text: 'Some six or seven weeks later, the beach hatches. Tiny turtles, small enough to sit in your palm, boil up out of the sand by the thousand — almost always at night — and immediately begin to run. They must reach the sea, fast. And here people matter: the wardens and villagers who watch over these beaches keep the shore dark during hatching season.',
      ask: {
        q: 'Why must the beach be kept DARK when the baby turtles hatch?',
        options: ['So the babies can sleep', 'Hatchlings find the sea by heading for the brightest horizon — natural light over the water; a bulb on land points them the wrong way', 'Darkness keeps the sand cool'],
        answer: 1,
        right: 'That is the secret: for millions of years the sea was the bright direction at night. A single stray bulb can send a whole nest marching inland — so lights near the beach go off, and the old bright path stays true.',
        wrong: 'It is about the babies\' compass: they head for the brightest horizon, which for millions of years meant the sea shining under the night sky. A stray bulb on land points them the wrong way — so people switch off, and the old path stays true.'
      } },
    { art: ['pt_tortoise'], who: null,
      hi: 'इसलिए अंडों से बच्चे निकलने वाली रातों में तट पर अँधेरे में लोग धीरे-धीरे आते-जाते दिखते हैं: वन विभाग के कर्मचारी, लाल रोशनी वाली टॉर्च लिए वैज्ञानिक, और गाँव वाले — जिनमें मछुआरों के परिवार भी शामिल हैं जो अंडे देने के मौसम में अपने जाल अलग तरह से लगाते हैं ताकि कछुआ माताएँ आसानी से निकल सकें। ओडिशा को इन कछुओं पर ठीक वैसे ही नाज़ है जैसे दूसरी जगहों को अपनी ऐतिहासिक इमारतों पर होता है।',
      text: 'So on hatching nights there are people on the beach in the dark, moving quietly: forest department staff, scientists with red-shaded torches, and villagers — including fishing families who set their nets differently in the nesting season so the mothers can pass. Odisha is proud of these turtles the way other places are proud of monuments.' },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      hi: 'और जो नन्हे कछुए लहरों तक पहुँच जाते हैं, वे इस विशाल महासागर में तैरते हुए दूर चले जाते हैं, और सालों के लिए ग़ायब हो जाते हैं। फिर, बड़ी होने पर मादा कछुए एक हैरान कर देने वाला काम करती हैं: वे बिना किसी रास्ते वाले हज़ारों किलोमीटर लंबे समंदर को पार करके — ठीक उसी तट पर अंडे देने वापस आती हैं जहाँ वे खुद अंडों से निकली थीं। वे इतनी सटीकता से अपना रास्ता कैसे ढूँढ़ लेती हैं, इस पर अभी भी अध्ययन चल रहा है; इसका जवाब कहीं न कहीं खारे पानी, चुंबकत्व और यादों में छिपा है।',
      text: 'And the little ones that reach the waves swim out into the enormous ocean, and vanish for years. Then, grown, the females do the astonishing thing: they come back — across thousands of kilometres of trackless sea — to nest on the very coast where they hatched. How they navigate so exactly is still being studied; the answer is written somewhere in salt and magnetism and memory.' },
    { art: ['pt_tortoise'], who: 'mithu',
      hi: '"इस वक्त बंगाल की खाड़ी में कहीं ऐसे कछुए तैर रहे हैं, जिनके ज़हन में ओडिशा के समुद्री तट बसे हैं। अगर आप कभी उस मौसम में उस तट पर जाएँ, तो आप भी देखरेख में होने वाली निगरानी का हिस्सा बन सकते हैं — आँखें खुली, टॉर्च बंद, आवाज़ धीमी। कुछ अजूबे अँधेरे में ही देखे जाते हैं।"',
      text: 'Somewhere out in the Bay of Bengal right now are turtles carrying Odisha\'s beaches in their heads. If you are ever on that coast in the season, you may join a supervised watch — eyes open, torch off, voice low. Some wonders are watched in the dark.' }
  ],
  moral: 'The great appointments of the wild are kept in darkness and silence — and keeping them sometimes just means switching off a light.',
  source: 'The mass nesting (arribada) of olive ridley sea turtles at Gahirmatha and the Rushikulya rookery in Odisha — among the world\'s largest — with hatchling light-disorientation, seasonal fishing precautions and dark-beach protection all real and current, overseen by the Odisha forest department with local communities.'
},

{
  id: 'fk.tapoi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'Tapoi and the Seven Ships',
  hook: 'Seven brothers sailed away and left their little sister the richest girl on the coast. It did not stay that way.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_deer'],
  minutes: 5,
  place: ['IN-OR'],
  words_hi: [['बहन', 'behen', 'sister'], ['बकरी', 'bakri', 'goat'], ['सच', 'sach', 'truth']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"ओडिशा के समुद्री यात्राओं के सुनहरे दौर में एक सौदागर रहता था, जिसके सात बेटे थे और सबसे छोटी व सबसे लाडली एक बेटी: तपोई। वह पूरे घर का मोती थी — और जब हवाओं का रुख बदला, तो उसके सातों भाइयों ने दूर द्वीपों के लंबे सफ़र के लिए अपने सात जहाज़ लादे और तपोई को अपनी सात बहुओं की देखरेख में छोड़कर रवाना हो गए।"',
      text: 'In the great sailing days of Odisha there lived a merchant with seven sons and, last and most loved, one daughter: Tapoi. She was the pearl of the household — and when the winds turned, her seven brothers loaded their seven ships for the long voyage to the far islands, and sailed, leaving Tapoi in the care of their seven wives.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"कुछ समय तक तो सब रेशम और मिठाइयों जैसा सुखद रहा। लेकिन महीने खिंचते चले गए, कोई पाल लौटकर नहीं आया, और घर का धन कम होने लगा — और सात में से छह बहुओं का रंग छोटी बहन के लिए बदल गया। लाड-दुलार बंद हो गया। फिर दया भी ख़त्म हो गई। उन्होंने उसे चिथड़े पहनाए, जूठन खिलाई, और रोज़ बकरियाँ चराने झाड़ियों वाले मैदानों में भेजने लगीं। केवल सातवीं बहू, जो सबसे छोटी थी, दयालु बनी रही — वह चुपके से उसे खाना दे देती, उसके कपड़े सिल देती, और हौसला देती: धीरज रखो, छोटी; जहाज़ ज़रूर लौटेंगे।"',
      text: 'For a while, all was silk and sweets. But the months stretched, and no sail came back, and the household\'s money thinned — and six of the seven wives changed towards the little sister. The petting stopped. Then the kindness stopped. They dressed her in rags, fed her scraps, and sent her out to the scrubland every day to herd the goats. Only the seventh wife, the youngest, stayed kind — slipping her food, mending her clothes, whispering: bear it, little one; the ships will come.' },
    { art: ['pt_deer', 'courtier'], who: null,
      hi: '"इस तरह तपोई बकरियों और मैनाओं के साथ हवादार बंजर ज़मीन पर रहने लगी, सौदागर का मोती अब चरवाही बन चुकी थी। और वहीं, भाद्रपद के महीने में, उसने रविवार के दिन गाँव की लड़कियों को ख़ुदा — यानी टूटे हुए चावल, जो सबसे मामूली अनाज है — का भोग लेकर इंतज़ार करने वालों की रखवाली करने वाली मंगला देवी की पूजा के लिए इकट्ठा होते देखा।"',
      text: 'So Tapoi lived on the windy commons with the goats and the mynah birds, the merchant\'s pearl turned goatherd. And there, in the month of Bhadraba, she saw village girls gathering on Sundays with offerings of khuda — broken rice, the humblest grain there is — to worship the goddess Mangala, keeper of those who wait.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"तपोई के पास कुछ भी नहीं था: न रेशम, न मिठाइयाँ, न अपने नाम का एक साबुत चावल का दाना। बस टूटा हुआ चावल था, जिसे उसने बकरियों के आगे फेंके गए दानों में से बटोरा था।"',
      text: 'Tapoi had nothing: no silk, no sweets, not a whole grain of rice to her name. Only broken rice, gathered from what was thrown to the goats.',
      ask: {
        q: 'Can the poorest offering on the coast — a handful of broken rice — be enough for a goddess?',
        options: ['No — offerings must be grand to count', 'Yes — the goddess weighs the heart, not the grain', 'Only if nobody sees you make it'],
        answer: 1,
        right: 'That is the whole heart of this katha, and of the vrata girls keep to this day: Mangala weighs the heart. Khuda from Tapoi outweighed silver from anyone.',
        wrong: 'The tellings are clear: Mangala weighs the heart, not the grain. Tapoi\'s handful of khuda, offered with everything she had left, outweighed silver.'
      } },
    { art: ['courtier'], who: null,
      hi: '"इसलिए तपोई हर रविवार अपने टूटे हुए चावल से, खुले मैदान में बकरियों की संगत के बीच पूजा करती रही — और बस एक ही चीज़ माँगती रही: मेरे भाइयों के जहाज़ों को घर लौटा लाओ।"',
      text: 'So Tapoi worshipped with her broken rice, Sunday after Sunday, out on the commons with the goats for a congregation — and asked for one thing only: bring my brothers\' ships home.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'और एक सुबह क्षितिज पर पाल लहराते दिखे। पूरे सात। सातों जहाज़ पानी की सतह तक लदे हुए नदी में आगे बढ़े — सफ़र लंबा रहा था क्योंकि वह बड़ा कामयाब रहा था — और सातों भाई किनारे पर उतरते ही, सबसे पहले अपनी छोटी बहन के बारे में पूछने लगे।',
      text: 'And one morning the horizon grew sails. Seven of them. The seven ships came up the river laden to the waterline — the voyage had been long because it had been lucky — and the seven brothers stepped ashore asking, first thing, for their little sister.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'छहों बहुएँ तपोई को रेशमी कपड़े पहनाने और छह महीने के ज़ुल्म को छह मिनट में मिटाने के लिए दौड़ पड़ीं। लेकिन सच रेशम से भी तेज़ चलता है। पूरी बात सामने आ ही गई — वे चीथड़े, बचा-खुचा खाना, बकरियाँ — और इन सब के बीच सबसे छोटी बहू की दया किसी दिए की तरह जगमगा रही थी।',
      text: 'The six wives flew to dress Tapoi in silk and undo six months of cruelty in six minutes. But truth walks faster than silk. The whole story came out — the rags, the scraps, the goats — the youngest wife\'s kindness shining out of it like a lamp.' },
    { art: ['courtier'], who: null,
      hi: 'पुरानी कहानियों में छहों बहुओं के साथ बड़ी सख़्ती बरती गई है, और नीचे दिया गया स्रोत भी यह बात साफ़-साफ़ कहता है। अगर इसे नरमी से कहें: तो उन्हें पूरे परिवार के सामने खड़ा करके सच सुनाया गया, और उनसे तपोई की वैसे ही सेवा करवाई गई जैसे तपोई से करवाई गई थी — तब तक, जब तक वे इसे दिल से समझ न गईं। जो शर्म सीख दे, वह बिना सीख की सज़ा से कहीं बेहतर होती है। सातवीं बहू का सबसे ज़्यादा आदर-सत्कार हुआ।',
      text: 'The oldest tellings deal harshly with the six wives, and the source below says so honestly. Told gently: they were made to stand before the whole household and hear the truth said out loud, and to serve Tapoi as she had been made to serve — until they understood it from the inside. Shame that teaches is worth more than punishment that doesn\'t. The seventh wife was honoured above them all.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आज भी, भाद्रव के महीने में, ओड़िआ लड़कियाँ हर इतवार को खुदुरुकुणी ओषा का व्रत रखती हैं — मंगला माँ को \'खुदा\' यानी टूटे हुए चावल का भोग लगाती हैं, और एक-दूसरे को तपोई की कहानी सुनाती हैं, जैसा लड़कियाँ सदियों से करती आई हैं। बकरियाँ चराने वाली उस मोती जैसी लाडली को हर साल याद किया जाता है। उन छह बेरहम बहुओं को भी याद रखा जाता है — जिससे यह सबक़ मिलता है कि दूसरों के साथ कैसा बर्ताव करना चाहिए।',
      text: 'To this day, in the month of Bhadraba, Odia girls keep the Khudurukuni Osha on Sundays — worshipping Mangala with offerings of khuda, broken rice, and telling Tapoi\'s story to each other, as girls have for centuries. The pearl who herded goats is remembered every single year. The six unkind wives are remembered too — which is its own lesson about how you treat people.' }
  ],
  moral: 'Kindness done when no ships are in sight is the kind that gets remembered when the sails come home.',
  source: 'The Tapoi katha of Odisha, told with the Khudurukuni Osha — the vrata kept by Odia girls on Sundays in Bhadraba, worshipping goddess Mangala with offerings of khuda (broken rice). A folk tale of the sadhaba seafaring days; the oldest tellings punish the six sisters-in-law far more harshly than this version, and say so here rather than pretending otherwise.'
},

/* ======================================================== WEST BENGAL ====== */
{
  id: 'fk.lalkamal-nilkamal',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'Lalkamal and Nilkamal',
  hook: 'Two princes, two mothers, one palace — and a night watch where falling asleep is absolutely not allowed.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_crow'],
  minutes: 5,
  place: ['IN-WB'],
  words_hi: [['भाई', 'bhai', 'brother'], ['रात', 'raat', 'night'], ['मधुमक्खी', 'madhumakkhi', 'bee']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'यह कहानी \'ठाकुरमार झूली\' से है — दादी माँ की कहानियों की पोटली, जो बंगाल की सबसे प्यारी कहानियों की किताब है। एक राजा की दो रानियाँ थीं। एक तो आम इंसानी रानी थी; दूसरी, हालाँकि दरबार में किसी को पता नहीं था, रक्खोश कुल की थी — यानी बंगाली कहानियों के वे बड़े, बेतुके राक्षस, जिनमें बस नुकीले दाँत और बेहिसाब भूख होती थी, पर अक़्ल बिल्कुल नहीं।',
      text: 'Out of Thakurmar Jhuli — the Grandmother\'s Bag of Tales, Bengal\'s most beloved storybook — comes this one. A king had two queens. One was an ordinary human queen; the other, though nobody at court knew it, came of rakkhosh folk — the big, ridiculous ogres of Bengali tales, all fangs and appetite and very little sense.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'दोनों रानियों का एक-एक बेटा हुआ। राक्षसी रानी का बेटा था लालकमल, यानी लाल कमल; इंसानी रानी का बेटा था नीलकमल, यानी नीला कमल। और सबसे प्यारी बात यह थी: दोनों सौतेले भाई एक-दूसरे से बेहद प्यार करते थे। वही खेल, वही पढ़ाई, वही शैतानियाँ; ऐसा कभी नहीं होता था कि एक दिखे और दूसरा उसके ठीक पीछे न हो।',
      text: 'Each queen had a son. The rakkhosh-queen\'s boy was Lalkamal, the red lotus; the human queen\'s boy was Nilkamal, the blue lotus. And here is the lovely part: the two half-brothers loved each other completely. Same games, same lessons, same mischief; you never saw one without the other close behind.' },
    { art: ['pt_crow'], who: null,
      hi: 'लेकिन रात में, रक्खोश रिश्तेदार महल के आस-पास सूँघते-सूँघते आ धमके — और रक्खोश के आने की ख़बर तो एक मील दूर से ही लग जाती है, क्योंकि वह अपने ख़ानदान का नारा दहाड़े बिना रह ही नहीं सकता: "हाऊ माऊ खाऊ! मानुषेर गन्धो पाऊ!" — जिसका बंगाली में कुछ-कुछ यह मतलब होता है, "हाऊ! माऊ! खाऊँगा! मुझे इंसान की गंध आ रही है!" रक्खोश एक साथ बेहद ख़तरनाक भी होते हैं और छिपकर दबे पाँव आने में एकदम फिसड्डी भी।',
      text: 'But at night, rakkhosh relatives came sniffing round the palace — and a rakkhosh announces itself from a mile off, because it cannot help bellowing the family motto: "Haau maau khaau! Manusher gawndho paau!" — which is Bengali for roughly "Fee! Fo! Yum! I smell a hu-man!" Rakkhosh are extremely dangerous and extremely bad at being sneaky, both at once.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: 'भाइयों को पता चला कि ख़तरा पास आ रहा है, और उन्होंने वही किया जो \'ठाकुरमार झूली\' के वीर करते हैं: उन्होंने दो घोड़ों पर जीन कसी और इस ख़तरे का अंत करने निकल पड़े — सीधे रक्खोशों के अपने राज तक। वहाँ उन्होंने दानव-राजा के ही मेहमानख़ाने में एक कमरा लिया और बारी-बारी से पहरा देने की ठानी: एक सोएगा, एक जागकर पहरा देगा, और पहरा देने वाले को बिल्कुल भी सोना नहीं है।',
      text: 'The brothers learned the danger was creeping close, and did what heroes in Thakurmar Jhuli do: they saddled two horses and rode out to end it — all the way to the rakkhosh kingdom itself. There they took a room in the ogre-king\'s own guest house, and agreed to keep watch in turns: one sleeps, one guards, and the guard must NOT fall asleep.',
      ask: {
        q: 'Midnight in the ogres\' guest house. Nilkamal is on watch and his eyelids weigh a tonne each. What must he do?',
        options: ['Just a five-minute nap — what could happen?', 'Stay awake however he can — sing, pace, pinch himself — his brother\'s life is on his watch', 'Wake Lalkamal early and let him do it'],
        answer: 1,
        right: 'He walked, he counted stars, he bit his own thumb — and he stayed awake. In Thakurmar Jhuli, the watch that holds is the whole difference.',
        wrong: 'Naps are how palaces fall in these tales. He walked, he counted stars, he bit his own thumb — and he stayed awake, because his brother\'s life was on his watch.'
      } },
    { art: ['pt_crow', 'guard'], who: 'pt_crow', mood: 'wow',
      hi: 'और क्योंकि वह जाग रहा था, उसने सुन लिया — दो रक्खोश पहरेदार अंधेरे में गपशप लड़ा रहे थे, और रक्खोशों की आदत के मुताबिक बहुत ही ज़ोर-ज़ोर से उस इकलौते राज़ की बात कर रहे थे, जिसे उन्हें कभी मुँह से बाहर निकालना ही नहीं चाहिए था: दानव-राजा की जान उसके शरीर में थी ही नहीं। वह तो एक गहरे, अंधेरे तालाब की तलहटी में, एक बंद डिब्बे के अंदर दो मधुमक्खियों में बसी थी।',
      text: 'And because he was awake, he heard it — two rakkhosh sentries gossiping in the dark, as rakkhosh always do, far too loudly, about the one secret they should never have said aloud: the ogre-king\'s life was not kept in his body at all. It was kept in a pair of bees, sealed in a box, at the bottom of a deep, dark tank.' },
    { art: ['courtier'], who: null,
      hi: 'सुबह होते ही दोनों भाइयों ने वह तालाब ढूँढ निकाला। नीलकमल ने डुबकी लगाई — ठंडे, हरे पानी में गहरे और गहरे — और हाथों में डिब्बा थामे हाँफता हुआ बाहर निकला। अंदर दो सुनहरी मधुमक्खियाँ ग़ुस्से से भिनभिना रही थीं, और राज्य का हर एक रक्खोश एकदम चौंककर सीधा बैठ गया, क्योंकि उन्हें लगा कि दुनिया में कुछ तो गड़बड़ होने लगी है।',
      text: 'At dawn the brothers found the tank. Nilkamal dived — down and down through the cold green water — and came up gasping with the box in his hands. Inside, two golden bees buzzed furiously, and every rakkhosh in the kingdom sat bolt upright at once, feeling something go wobbly in the world.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'हर दिशा से रक्खोश गरजते हुए, अपना हाऊ-माऊ-खाऊ चिल्लाते चले आए — तभी लालकमल ने वह डिब्बा हवा में उठा दिया, और पूरी फ़ौज फिसलती हुई ऐसे ठिठक कर रुक गई, जैसे किसी शादी में आई चाचियाँ-मौसियाँ अचानक बड़ी भली बन जाती हैं। "ज़रा संभलकर," दानव-राजा ने दबी हुई आवाज़ में कहा। और जैसे ही मधुमक्खियों को छोड़ा गया और जादू टूटा, उस पूरे भयानक राज को बाँधे रखने वाला तिलिस्म बिखर गया — और दहाड़ें, नुकीले दाँत, ख़ानदानी नारा और बाकी सब कुछ, सलेटी धुएँ का गुबार बनकर ताड़ के पेड़ों के ऊपर हवा में उड़ गया।',
      text: 'Rakkhosh came thundering from every direction, roaring their haau-maau-khaau — and Lalkamal held up the box, and the whole army skidded to a halt, suddenly as polite as aunties at a wedding. "Careful with that," said the ogre-king, in a small voice. And the moment the bees were let go and the spell was broken, the magic that held that whole grim kingdom together came undone — and it all went up in a puff of grey smoke and blew away over the palm trees, roars, fangs, motto and all.' },
    { art: ['courtier'], who: null,
      hi: 'दोनों भाई अपनी दोनों माताओं के पास घर लौट आए, और आखिरकार महल रात में चैन की नींद सोया। और बाद में हर किसी को जो बात याद रही, वह मधुमक्खियाँ या पानी में लगाई डुबकी नहीं थी, बल्कि सबसे सीधी-सादी बात थी: किसी भी पल, किसी भी ख़तरे में, दोनों में से किसी भाई ने एक बार भी दूसरे के बिना जाने की बात सोची तक नहीं थी।',
      text: 'The brothers rode home to both their mothers, and the palace slept soundly at night, at last. And what everyone remembered afterwards was not the bees or the diving, but the simplest thing: neither brother, at any point, in any danger, had even once considered leaving without the other.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अगर तुम्हारी कोई बंगाली दादी या नानी हैं — कोई ठाकुर्मा या दीदा — तो उनसे यह वाली सुनाने को कहना। वे रक्खोश की आवाज़ निकालकर सुनाएँगी। और एक बार जब दादी-नानी वह आवाज़ निकाल दें, तो किसी रक्खोश से डरना नामुमकिन हो जाता है — और ज़ाहिर है, उस आवाज़ का पूरा मक़सद ही यही है।"',
      text: 'If you have a Bengali grandmother — a thakuma or a dida — ask her for this one. She will do the rakkhosh voice. It is impossible to be afraid of a rakkhosh once a grandmother has done the voice, which is, of course, the entire point of the voice.' }
  ],
  moral: 'Keep your watch and keep your brother. Everything else in the story is just bees.',
  source: 'Thakurmar Jhuli, collected by Dakshinaranjan Mitra Majumdar, 1907 — the classic Bengali grandmother-tales; the rakkhosh chant "haau maau khaau" is the collection\'s famous ogre-cry. Told gently here: the rakkhosh kept silly-scary as the tradition itself keeps them, and the ogre-kingdom\'s end softened to smoke.'
},

{
  id: 'fk.gopal-pot-of-wit',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'A Pot Full of Cleverness',
  hook: 'The Raja ordered Gopal to bring him a pot full of wit by the next full moon. Gopal went home and planted a seed.',
  hero: 'courtier',
  cast: ['courtier', 'akbar'],
  minutes: 4,
  place: ['IN-WB'],
  words_hi: [['बुद्धि', 'buddhi', 'wit'], ['घड़ा', 'ghada', 'pot'], ['बीज', 'beej', 'seed']],
  scenes: [
    { art: ['akbar'], who: null,
      hi: '"बंगाल के कृष्णनगर में राजा कृष्णचंद्र के दरबार में, सबसे तेज़ ज़ुबान और सबसे गोल-मटोल पेट, दोनों ही गोपाल भाँड़ के थे — जो शाही नाई और विदूषक थे — बीरबल को बंगाल का जवाब, और बंगाल में तो स्वाभाविक रूप से, दोनों में से उन्हीं को असली माना जाता था।"',
      text: 'At the court of Raja Krishnachandra of Krishnanagar in Bengal, the sharpest tongue and the roundest belly both belonged to Gopal Bhar, the royal barber and jester — Bengal\'s answer to Birbal, and in Bengal, naturally, considered the original of the two.' },
    { art: ['akbar', 'courtier'], who: 'akbar',
      hi: 'एक दिन बाहर से आए एक पंडित जी ने नाक सिकोड़ते हुए ताना मारा कि राजा का दरबार सोने से तो भरा है मगर यहाँ अक्ल की भारी कंगाली है। यह बात राजा को चुभ गई और उन्होंने एक ही झटके में सबको अपनी चतुराई दिखाने की ठान ली। "गोपाल!" भरे दरबार में उन्होंने ऐलान किया। "कहते हैं कि तुम पूरे बंगाल के सबसे हाज़िरजवाब इंसान हो। इसे साबित करके दिखाओ। अगली पूर्णिमा तक मेरे लिए एक मटका भरकर बुद्धि—यानी एक मटका भरकर अक्ल लेकर आओ। अगर नहीं ला पाए, तो हम समझ जाएँगे कि तुम्हारी होशियारी सिर्फ बातों ही बातों की थी।"',
      text: 'One day a visiting pandit sniffed that the Raja\'s court was rich in gold but poor in brains, and the Raja, stung, decided to out-clever everyone at once. "Gopal!" he announced before the full court. "You are said to be the wittiest man in Bengal. Prove it. Bring me a pot full of buddhi — a pot full of wit — by the next full moon. Fail, and we shall know your cleverness was only talk."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'दरबार में दबी-दबी हँसी गूँज उठी। सुराही से कोई अक्लमंदी तो उँडेल नहीं सकता; सब समझ चुके थे कि आखिरकार गोपाल हार ही गया। लेकिन गोपाल ने झुककर आदाब किया, घर गया... और बाहर अपनी सब्ज़ियों की क्यारी में, एक संकरे मुँह वाले मिट्टी के घड़े के पास लौकी का एक बीज बो दिया।',
      text: 'The court tittered. You cannot pour cleverness out of a jug; everyone knew Gopal was beaten at last. Gopal, however, bowed deeply, went home... and out in his vegetable patch, planted one gourd seed beside a narrow-necked clay pot.',
      ask: {
        q: 'A pot, a gourd seed, and one month. What is Gopal up to?',
        options: ['He is going to hide and hope the Raja forgets', 'He is growing the gourd INSIDE the pot — a thing that goes in easily and then cannot come out', 'He is going to fill the pot with clever sayings written on paper'],
        answer: 1,
        right: 'That is the trick. He slipped the tiny young gourd through the pot\'s neck while it was small — and let it grow in there until it filled the pot completely.',
        wrong: 'Watch the vine. He slipped the tiny young gourd in through the pot\'s narrow neck while it was still small — and then simply let it grow.'
      } },
    { art: ['courtier'], who: null,
      hi: '"बेल ऊपर चढ़ती गई, और गोपाल ने एक नन्हीं-सी लौकी को — तुम्हारे अँगूठे जितनी छोटी — मटके की सँकरी गर्दन से अंदर डाल दिया। और वहाँ, मटके के अँधेरे में, गर्दन के रास्ते बेल से खुराक पाती हुई, वह लौकी बढ़ती गई। और बढ़ती गई। यहाँ तक कि उसने अंदर की हर गोलाई को भर दिया, ठीक वैसे जैसे दस्ताने में मुट्ठी पूरी तरह समा जाती है।"',
      text: 'The vine climbed, and Gopal trained one baby gourd — small as your thumb — in through the pot\'s narrow neck. And there, in the dark of the pot, fed by its vine through the neck, the gourd grew. And grew. Until it filled every curve of the inside, snug as a fist in a glove.' },
    { art: ['courtier', 'akbar'], who: 'courtier', mood: 'wow',
      hi: 'पूर्णिमा के दिन, गोपाल ने सिंहासन के सामने घड़ा रख दिया, बेल अब भी लटक रही थी। "महाराज, आपके हुक्म के मुताबिक, बुद्धि से भरा घड़ा।" राजा ने अंदर झाँका, कद्दू देखा और हँस पड़े। "अरे बदमाश, यह तो सब्ज़ी है!" "चखकर देख लीजिए, महाराज। लेकिन पहले आपको इसे बाहर निकालना होगा।"',
      text: 'On the full moon, Gopal set the pot before the throne, vine still trailing. "A pot full of buddhi, Maharaj, as ordered." The Raja peered in, saw the gourd, and laughed. "This is a vegetable, you rogue!" "Taste it and see, Maharaj. But you will have to take it out first."' },
    { art: ['akbar'], who: 'akbar',
      hi: 'राजा ने अंदर हाथ डाला। लौकी बाहर नहीं निकल रही थी — मटके का मुँह बहुत ही संकरा था। उन्होंने मटके को उल्टा किया। उसे हिलाया। उनका चेहरा शर्म से हल्का गुलाबी पड़ गया। "यह बाहर नहीं निकल रही, गोपाल।" "जी नहीं, महाराज," गोपाल मुस्कुराते हुए बोला। "बुद्धि की भी यही तो बात है। छोटे दिमाग में डालना आसान है, पर बड़े सिर से बाहर नहीं उड़ेल सकते।"',
      text: 'The Raja reached in. The gourd would not come — the neck was far too narrow. He turned the pot over. He shook it. He went a delicate shade of pink. "It does not come OUT, Gopal." "No, Maharaj," said Gopal, beaming. "That is the thing about buddhi. Easy to put into a young head. From a grown one, it does not pour."' },
    { art: ['akbar', 'courtier'], who: null,
      hi: '"और इसीलिए, महाराज," गोपाल अपनी रौ में आते हुए आगे बोला, "इसे उगाना पड़ता है — धीरे-धीरे, अँधेरे में, बिना दिखे, एक नन्हे-से बीज से। जो कोई भी आपसे बनी-बनाई अक्ल का मटका देने का वादा करता है," और यहाँ वह बाहर से आए पंडित जी की ओर हल्का-सा झुका, "वह आपको एक खाली मटका ही बेच रहा है।"',
      text: '"And that, Maharaj," Gopal went on, warming up nicely, "is why it must be grown — slowly, in the dark, unseen, from one small seed. Anyone who promises you a pot of ready-made wit," and here he bowed very slightly towards the visiting pandit, "is selling you an empty pot."' },
    { art: ['courtier'], who: null,
      hi: 'राजा इतना हँसे कि उनका मुकुट खिसक गया, उन्होंने गोपाल को उसके वज़न के बराबर — खैर, बात बंगाल की है तो मिठाइयों के वज़न के बराबर — मिठाइयाँ दीं, और उस मटके को दरबार में सजाकर रखवा दिया। उसके बाद जब भी कोई अपनी अक्ल की डींग हाँकता, राजा कृष्णचंद्र बस चुपचाप उस मटके की तरफ इशारा कर देते।',
      text: 'The Raja laughed until his crown slipped, paid Gopal his weight in — well, in sweets, this being Bengal — and kept the pot on display in the court. Whenever anyone boasted of their brains thereafter, Krishnachandra would silently point at it.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'तुम्हारा सिर भी मटका ही है, और यह अभी नया है — और यही वह समय है जब चीज़ें अंदर जाती हैं। इस ऐप की हर कहानी लौकी का एक और बीज है। बस बोते जाओ।',
      text: 'Your head is the pot, and it is still young — which is exactly the moment things go in. Every story in this app is one more gourd seed. Plant away.' }
  ],
  moral: 'Wit cannot be poured, bought or borrowed — only grown from small seeds, while the neck of the pot is still wide.',
  source: 'Gopal Bhar tales — the legendary jester of Raja Krishnachandra of Krishnanagar (18th century), told in Bengali for generations. The gourd-in-the-pot riddle is a favourite told of Gopal and of clever men across India; many versions.'
},

{
  id: 'fk.bonbibi-dukhey',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'katha',
  title: 'Bonbibi, Lady of the Forest',
  hook: 'In the world\'s largest mangrove forest, honey-gatherers of two faiths whisper the same name before they step off the boat.',
  hero: 'courtier',
  cast: ['courtier', 'pt_lion', 'guard'],
  minutes: 5,
  place: ['IN-WB'],
  words_hi: [['जंगल', 'jangal', 'forest'], ['शहद', 'shahad', 'honey'], ['माँ', 'maa', 'mother']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'बंगाल के दक्षिणी छोर पर, जहाँ गंगा की सैकड़ों धाराएँ समुद्र में मिलती हैं, सुंदरबन बसा है — धरती का सबसे बड़ा मैंग्रोव जंगल। यह ज्वार-भाटे वाली नदियों, साँस लेती मिट्टी और खारे पानी में खड़े पेड़ों की भूलभुलैया है, और रॉयल बंगाल टाइगर का बसेरा भी। लोग इसके किनारों पर रहते हैं और शहद, मछली तथा लकड़ी के लिए जंगल में जाते हैं। और कोई भी वहाँ अकेला कदम नहीं रखता।',
      text: 'At the bottom of Bengal, where the Ganga\'s hundred mouths meet the sea, lies the Sundarbans — the largest mangrove forest on Earth, a maze of tidal rivers and breathing mud and trees that stand in salt water, and the realm of the royal Bengal tiger. People live at its edge and enter it for honey, fish and wood. And no one enters alone.' },
    { art: ['courtier'], who: null,
      hi: 'जंगल की नदियों में नावें उतरने से पहले, शहद इकट्ठा करने वाले — जिन्हें मौले कहा जाता है — एक नाम पुकारते हैं: बोनबीबी। यानी जंगल की देवी। और उनकी अनोखी बात यह है: हिंदू परिवार भी उनका नाम लेते हैं और मुस्लिम परिवार भी, एक साथ, एक ही नाव में बैठकर। उनकी कहानी \'बोनबीबी जोहुरनामा\' नाम की किताब से पढ़ी जाती है — जो इस्लाम के पवित्र ग्रंथों की तरह दाईं ओर से पढ़ने के लिए छपी है — और जंगल के किनारे उनके थान सबके लिए खुले हैं। साफ़ दिल से आने वाले हर इंसान की वह रक्षक हैं, और उन्होंने कभी किसी से उसका धर्म नहीं पूछा।',
      text: 'Before the boats slip into the forest rivers, the honey-gatherers — the moule, as they are called — say a name: Bonbibi. The lady of the forest. And here is the wonder of her: the Hindu families say it and the Muslim families say it, together, in the same boats. Her tale is read from a book called the Bonbibi Johuranama — printed, like the holy books of Islam, to be read from the right-hand side — and her shrines stand open to everyone at the forest\'s edge. She is the guardian of all who enter with a clean heart, and she has never once asked anyone their faith.' },
    { art: ['courtier', 'pt_lion'], who: null,
      hi: '"जंगल में एक और भी पुरानी शक्ति बसती है: दक्खिन राय, दक्षिण के स्वामी, जो एक विशाल बाघ का रूप धरकर चलते हैं। वे कोई राक्षस नहीं हैं — यह बात साफ़ समझ लो। वे जंगल की अपनी ही भयंकर शान हैं, जिनकी जंगल के थानों में पूरी श्रद्धा से पूजा होती है; लेकिन इंसानी लालच पर उनका गुस्सा भड़क उठता है, और जब लोग उनके जंगल से बहुत ज़्यादा छीन लेते हैं, तो उनका न्याय बड़ा भयानक होता है। यह पुरानी कहानी उसी दिन की है जब उन दोनों ने आपस में नियम तय किए थे।"',
      text: 'The forest also has an older power: Dokkhin Rai, lord of the south, who rides in the shape of the great tiger. He is not a monster — say that clearly. He is the forest\'s own fierce majesty, honoured in his own right at forest shrines; but his anger burns against human greed, and when people take too much from his forest, his justice is terrible. The old tale is about the day the two of them settled the rules.' },
    { art: ['guard', 'courtier'], who: null, mood: 'sad',
      hi: '"धोना नाम के एक लालची व्यापारी ने शहद के लिए सात नावें तैयार कीं, और — क्योंकि कहानी में कोई शर्मनाक बात भी होनी ही चाहिए — वह एक गरीब विधवा के छोटे बेटे दुखे को अपने साथ ले गया, जिसके नाम का मतलब ही \'दुख\' होता है। जंगल के गहरे सन्नाटे में, धोना के लालच और दक्खिन राय के गुस्से का आमना-सामना हुआ, और एक भयानक सौदा तय हुआ: नावें शहद और मोम से लदकर लौटेंगी, और उस लड़के को कीचड़ भरे किनारे पर अकेला, बाघ-राज के हवाले छोड़ दिया जाएगा।"',
      text: 'A greedy trader named Dhona fitted out seven boats for honey, and — because the tale must have its shame — brought along a poor widow\'s young son, Dukhey, whose name means sorrow. Deep in the forest, Dhona\'s greed and Dokkhin Rai\'s anger found each other, and a terrible bargain was struck: the boats would return heaped with honey and wax, and the boy would be left behind, alone on the mud flats, for the tiger-lord.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"दुखे किनारे पर अकेला खड़ा रहा; नावें दूर जाकर छोटी होती गईं, जंगल बड़ा होता गया, और मैंग्रोव के जंगलों में कहीं सुनहरी धारियों वाली कोई चीज़ हिलने लगी। तब उस बालक ने वही एक काम किया जो नाव पर चढ़ने से पहले उसकी माँ ने उसे सिखाया था: "अगर तुम कभी जंगल में भटक जाओ और कोई उम्मीद न बचे, तो माँ बोनबीबी को पुकारना। वे दौड़ी चली आती हैं।""',
      text: 'Dukhey stood alone on the bank as the boats grew small, and the forest grew large, and somewhere in the mangroves something golden and striped began to move. And the boy did the one thing his mother had taught him before he sailed: "If you are ever lost past hope in the forest, call Ma Bonbibi. She comes."',
      ask: {
        q: 'Alone, abandoned, tiger coming. Does calling on Bonbibi count as a plan?',
        options: ['No — he should run into the forest', 'Yes — in the Sundarbans it is the FIRST plan: call the guardian, with a clean heart, and she comes', 'No — he should swim for the boats'],
        answer: 1,
        right: 'It is the oldest plan in the mangroves. He called with his whole heart — and she came.',
        wrong: 'Running and swimming end badly in tiger country. He called — with his whole heart, the way his mother taught — and Bonbibi came.'
      } },
    { art: ['courtier', 'pt_lion'], who: null, mood: 'wow',
      hi: '"वे तुरंत आ पहुँचीं, साथ में उनके भाई शाह जोंगोली भी थे, और वे उस बालक तथा बाघ-राज के बीच खड़ी हो गईं। वहाँ कोई ऐसा युद्ध नहीं हुआ जिसे लड़ाई कहा जा सके — यही तो इस कहानी की कोमल सच्चाई है: दक्खिन राय का विनाश नहीं किया गया, क्योंकि जंगल के लोगों के लिए जो पूज्य है, उसका नाश नहीं हो सकता; उन्हें सुधारा गया। बोनबीबी बोलीं, दक्षिण के स्वामी ने सिर झुकाया, और दोनों के बीच सुलह हो गई — शर्तों वाली सुलह।"',
      text: 'She came at once, with her brother Shah Jongoli at her side, and stood between the boy and the tiger-lord. There was no battle worth the name — this is the gentle truth of the tale: Dokkhin Rai was not destroyed, for nothing sacred to the forest people could be; he was corrected. Bonbibi spoke, and the lord of the south bowed, and peace was made between them — a peace with terms.' },
    { art: ['guard'], who: 'guard',
      hi: '"और वे शर्तें ही तो इस कहानी का असली खज़ाना हैं। जंगल का बँटवारा हो गया: गहरे बीहड़ इलाके हमेशा के लिए दक्खिन राय और उनके जीवों के नाम रहे; और किनारे के इलाके इंसानों के लिए — और इंसान वहाँ केवल अपनी ज़रूरत पर ही जा सकते हैं, महज़ अपनी चाहत पूरी करने कभी नहीं। सच्चे दिल और खाली हाथों से आओ, बस उतना ही लो जितनी तुम्हारे परिवार को ज़रूरत है, कुछ भी बर्बाद मत करो, और बोनबीबी तुम्हारे साथ चलेंगी। लालच लेकर आओगे, तो अकेले ही भटकोगे।"',
      text: 'And the terms are the whole treasure of the story. The forest was shared out: the deep wild places for Dokkhin Rai and his creatures, forever; the edges for the people — and the people may enter ONLY needing, never merely wanting. Come with a clean heart and empty hands, take just what your family needs, waste nothing, and Bonbibi walks with you. Come greedy, and you walk alone.' },
    { art: ['courtier'], who: null,
      hi: '"दुखे को घर पहुँचाया गया — कहानियाँ कहती हैं कि एक बड़े मगरमच्छ की पीठ पर बैठाकर, जो पूरे बंगाली साहित्य में घर लौटने की सबसे अनोखी सवारी है — और साथ में इतना धन दिया गया कि उसकी माँ का जीवन हमेशा के लिए संवर जाए। बाज़ार-बाज़ार में धोना की शर्मनाक हरकत के चर्चे फैल गए। और आज के दिन तक मौले इन शर्तों को निभाते हैं: वे चुपचाप जाते हैं, ज़रूरत भर लेते हैं, और कभी घमंड नहीं करते, क्योंकि शहद जंगल का वरदान है, उनकी कोई जीत नहीं।"',
      text: 'Dukhey was carried home — the tellings say on the back of a great crocodile, which is the best school-run in all of Bengali literature — with wealth enough to keep his mother forever. Dhona\'s shame was told in every market. And to this day the moule keep the terms: they enter quietly, take modestly, and never boast, for the honey is the forest\'s gift, not their conquest.' },
    { art: ['pt_lion'], who: null,
      hi: 'और बाघ बाघ ही रहता है — कहानी में न उसका कभी शिकार किया जाता है, न कोई उससे नफ़रत करता है। जंगल के लोग उसे बस आदर से याद करते हैं: उसी की वजह से घना जंगल घना बना रहता है, उसी की वजह से कोई अपनी ज़रूरत से ज़्यादा नहीं लेता, और उसी की वजह से सुंदरबन आज भी बचा हुआ है, जबकि इतने सारे जंगल ख़त्म हो गए। जिस जंगल की रखवाली हो, उसके पहरेदार का सचमुच रौबदार होना ज़रूरी भी है।',
      text: 'And the tiger stays the tiger — never hunted in the tale, never hated. The forest people\'s word for him is respect: he is why the deep forest stays deep, why no one takes too much, why the Sundarbans is still standing when so many forests are gone. A guarded forest needs its guard to be genuinely formidable.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'दो धर्म, एक जंगल, दोनों की रक्षा करने वाली एक ही माँ, और एक बाघ जिसकी दहाड़ इस पूरे रिश्ते को सच्चा बनाए रखती है। जब हिंदू और मुसलमान नाविक जंगल के एक ही मुहाने पर एक ही नाम पुकारते हैं, तो पूछिए कि सुंदरबन ऐसा क्या जानता है जो हम बाकी सब आज भी सीखने की कोशिश कर रहे हैं।',
      text: 'Two faiths, one forest, one mother who guards them both, and a tiger whose fierceness keeps the whole bargain honest. When Hindu and Muslim boatmen say the same name at the same forest edge, ask what the Sundarbans knows that the rest of us are still learning.' }
  ],
  moral: 'Enter the forest needing, not wanting. The guardian walks with clean hearts — of every faith — and the tiger keeps everyone honest.',
  source: 'The Bonbibi tradition of the Sundarbans and the tale of Dukhey from the Bonbibi Johuranama, the verse text read at her worship — revered by Hindu and Muslim forest-goers alike, with shrines kept at the forest edge; the moule honey-gatherers\' customs of restraint are real and current. Dokkhin Rai is honoured in the tradition itself and is presented here, as there, with respect. Many tellings.'
},

{
  id: 'fk.ilish-rain',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-east',
  badge: 'aaj',
  title: 'The Fish That Comes With the Rain',
  hook: 'When the first monsoon clouds pile up over Bengal, an entire state starts thinking about exactly one fish.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-WB'],
  words_hi: [['बारिश', 'baarish', 'rain'], ['मछली', 'machhli', 'fish'], ['नदी', 'nadi', 'river']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'बंगाल में मॉनसून कभी अकेला नहीं आता। जब आसमान भीगी स्लेट के रंग का हो जाता है और धूल पर पहली मोटी बूँदें गिरती हैं — \'ब्रिश्टी\', बारिश के लिए बांग्ला शब्द, जिसे बंगाली ऐसे कहते हैं जैसे दूसरे लोग किसी मिठाई का नाम लेते हैं — तब कोलकाता से लेकर नदी किनारे बसे सबसे छोटे गाँव तक, हर किसी के मन में बस एक ही लज़ीज़ ख़याल आने लगता है: इलिश आ रही है।',
      text: 'In Bengal, the monsoon does not arrive alone. When the sky goes the colour of wet slate and the first fat drops hit the dust — brishti, the Bengali word for rain, a word Bengalis say the way other people say dessert — everyone from Kolkata to the smallest river village starts thinking the same delicious thought: the ilish are coming.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'इलिश — जिसे अंग्रेज़ी में हिल्सा कहते हैं — समुद्र में रहने वाली एक रुपहली मछली है। लेकिन जब बारिश से नदियाँ उफान पर आती हैं, तो इलिश एक अनोखा काम करती है: वे हज़ारों की तादाद में चमकती हुई समंदर छोड़ देती हैं और नदियों के बहाव के ख़िलाफ़ ऊपर की ओर तैरने लगती हैं — हुगली में ऊपर, डेल्टा के चौड़े मुहानों से होते हुए — सीधे बंगाल के दिल तक, ठीक वैसे ही जैसे उनकी नस्ल तब से करती आ रही है जब बंगाल नाम की कोई जगह भी नहीं बनी थी।',
      text: 'The ilish — hilsa, in English — is a silver fish that lives in the sea. But when the rains swell the rivers, the ilish do an extraordinary thing: they leave the sea in their gleaming thousands and swim UP the rivers — up the Hooghly, up the wide mouths of the delta — against the current, into the very heart of Bengal, as their kind has done since before there was a Bengal to swim into.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'मछुआरों के परिवार इन इशारों को किसी चिट्ठी की तरह पढ़ लेते हैं: बादलों का रंग, पानी से छूकर आती हवा की खुशबू, और वह दिन जब नदी का रुख़ ज़रा सा बदलता है। फिर सलेटी बारिश में नावें निकल पड़ती हैं — छोटी नावें, बड़े जाल, और पीढ़ियों की समझ — क्योंकि समंदर की इलिश अच्छी तो होती है, मगर मॉनसून की नदियों में खा-पीकर पुष्ट हुई नदी वाली इलिश ही वह है जिसके गीत कवियों ने गाए हैं।',
      text: 'The fishing families read the signs like a letter: the colour of the clouds, the smell of the wind off the water, the day the river turns just so. Then the boats go out in the grey rain — small boats, big nets, generations of knowing — because sea-ilish is good, but river-ilish, plumped on the monsoon rivers, is the one the poets meant.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'और बाज़ारों में — अरे, इलिश के मौसम में बाज़ारों का क्या कहना! बर्फ़ पर सजी चाँदी जैसी कतारें। जौहरियों की तरह मछलियों पर झुककर उनके गलफड़ों की चमक परखते पारखी, और फ़ुटबॉल के विरोधी प्रशंसकों की तरह पद्मा बनाम हुगली पर बहस करते लोग। ऐसी दादियाँ-नानियाँ जो मछली चुनने के मामले में साठ साल से कम उम्र के किसी इंसान पर भरोसा नहीं करतीं। यह सिर्फ़ ख़रीदारी नहीं है; यह तो चमकदार छिलकों से सजा एक पूरा नाटक है।',
      text: 'And in the markets — oh, the markets in ilish season. The silver rows on the ice. The connoisseurs bending over them like jewellers, checking the gleam of a gill, arguing Padma-side versus Hooghly-side like rival football fans. Grandmothers who trust no one under sixty to choose a fish. It is not shopping; it is theatre with scales on.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'मगर किसी चीज़ को हद से ज़्यादा चाहने का बंगाल को एक कड़वा सबक मिला है। सालों तक हर इलिश पकड़ते रहने की वजह से — जिसमें खोका इलिश, यानी नन्हे-मुन्ने बच्चे, और अंडे देने के लिए नदी के बहाव की ओर जाने वाली मां मछलियां भी शामिल थीं — नदियां खाली होने लगी थीं।',
      text: 'But Bengal has learned a hard lesson about loving something too hungrily. Years of catching every ilish — including the khoka ilish, the little young ones, and the mothers on their way upriver to lay eggs — began to empty the rivers.',
      ask: {
        q: 'Everyone wants ilish, and the small young ones are easiest to catch. Why must the khoka ilish go back in the water?',
        options: ['Small fish taste bad', 'A young fish caught today is a whole river of fish that never happens — let it grow, spawn, and the ilish return every year, forever', 'It is just an old superstition'],
        answer: 1,
        right: 'That is the arithmetic of forever: every young fish released is thousands of eggs next season. So the rules protect the small ones and the nesting season — and the rivers are recovering.',
        wrong: 'It is law and it is sense: a young fish caught today is a whole river of future fish that never happens. Released, it grows and spawns thousands. So the small ones go back — and the rivers recover.'
      } },
    { art: ['guard'], who: null,
      hi: 'इसलिए आज कुछ नियम बनाए गए हैं, जिनका अब और भी अच्छी तरह पालन होता है: सबसे नन्हीं इलिश को जाल में नहीं फंसाना, और उस समय मछली पकड़ने पर रोक लगाना जब मां मछलियां अंडे देने नदी में ऊपर की ओर जाती हैं। मछुआरों के परिवार थोड़ा बुदबुदाते हैं, पर बात मान लेते हैं और ज़्यादातर लोग इससे सहमत भी हैं — कोई भी ऐसी पीढ़ी नहीं बनना चाहता जिसने आखिरी मछली भी खाकर खत्म कर दी हो। सच तो यह है कि किसी मछली से सच्चा प्यार करने का मतलब यह भी होता है कि सही वक्त पर उसे अकेला छोड़ दिया जाए।',
      text: 'So today there are rules, kept better and better: no netting the tiniest ilish, rest periods when the mother fish run upriver to spawn. Fishing families grumble and comply and mostly agree — nobody wants to be the generation that ate the last one. Loving a fish properly, it turns out, includes leaving it alone at the right times.' },
    { art: ['courtier'], who: null,
      hi: 'और जब मौसम की पहली बढ़िया इलिश किसी घर की रसोई तक पहुंचती है — खिड़कियों पर बरसती मूसलाधार बारिश के बीच सरसों के साथ भाप में पकी हुई, या ढेर सारे भात के साथ कुरकुरी तली हुई — तो पूरे बंगाल को, कम से कम एक वक्त के खाने के लिए, पूरा सुकून मिल जाता है। सरहद पार बांग्लादेश में तो यह राष्ट्रीय मछली है, और किसकी नदियों की इलिश ज़्यादा बेहतर होती है, इस बात पर बहस छिड़ना अपने आप में एक पसंदीदा खेल जैसा है, जो हर शादी में खेला जाता है।',
      text: 'And when the season\'s first proper ilish reaches a family kitchen — steamed with mustard, or fried crisp with a mountain of rice while the rain hammers the windows — Bengal is, for one meal, entirely at peace. Across the border in Bangladesh it is the national fish, and the arguing over whose rivers make the better ilish is itself a beloved regional sport, played at every wedding.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'हर जगह का कोई न कोई ऐसा खाना होता है जो असल में किसी कैलेंडर जैसा होता है — एक ऐसा स्वाद जो बताता है कि कोई मौसम सचमुच आ चुका है। बंगाल के उस स्वाद में बारिश, नदियों और चांदी का एहसास है। अपने परिवार से पूछो कि तुम्हारा ऐसा खास खाना कौन-सा है, और उन्हें उससे इतना प्यार करना किसने सिखाया।',
      text: 'Every place has a food that is really a calendar — a taste that means a season has truly arrived. Bengal\'s tastes of rain and rivers and silver. Ask your family what yours is, and who taught them to love it.' }
  ],
  moral: 'Love a season\'s gift enough to guard it — take it with joy, and leave enough that it always comes back with the rain.',
  source: 'The ilish (hilsa) and the Bengali monsoon — the sea-to-river spawning run, the fishing and market culture of West Bengal, and current conservation rules protecting juvenile (khoka) ilish and spawning seasons in India and Bangladesh, where the hilsa is the national fish. All real and current.'
}

];

window.IND_COLLECTIONS_EAST = [
  { id: 'desh-east', name: 'East & the Islands', note: 'Lakshadweep, the Andamans and Nicobars, Jharkhand, Odisha and Bengal — lagoons, groves, chariots and one very locked door.', avatar: 'pt_tortoise' }
];
